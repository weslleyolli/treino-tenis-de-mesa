import Dexie from "dexie";

// Banco local (IndexedDB) — funciona 100% offline no celular, como um SQLite do navegador.
export const db = new Dexie("treinoTM");

// Versão 1 do schema. Cada "tabela" tem uma chave primária e índices para busca.
db.version(1).stores({
  // chave-valor genérico (substitui o window.storage antigo, migração sem dor)
  kv: "key",
  // registros de saque por sessão
  serveLog: "++id, date, type",
  // partidas do campeonato / torneio
  matches: "++id, phase, round, done",
  // avaliações de execução (aba Análise)
  analysis: "++id, date, stroke",
  // progresso e recordes dos treinos (chaveado por semana-dia-tipo)
  progress: "key",
});

/* ---------- Camada compatível com o window.storage antigo ----------
   Mantém get/set/delete/list para o código existente continuar funcionando.
   Assim você migra tela por tela, sem reescrever tudo de uma vez.        */
/* A camada de sincronização se registra aqui para saber que algo mudou, sem
   que db.js precise conhecê-la (evita import circular). */
let aoGravar = null;
export const definirAoGravar = (fn) => { aoGravar = fn; };

/* Cada gravação carimba a hora. É esse carimbo que permite mesclar com a nuvem
   por chave, em vez de um aparelho sobrescrever o outro por inteiro. */
export const storage = {
  async get(key) {
    const row = await db.kv.get(key);
    return row ? row.value : null;
  },
  async set(key, value) {
    await db.kv.put({ key, value, updatedAt: Date.now() });
    if (aoGravar) { try { aoGravar(key); } catch {} }
    return value;
  },
  async delete(key) {
    await db.kv.delete(key);
  },
  async list(prefix = "") {
    const all = await db.kv.toArray();
    return all.filter((r) => r.key.startsWith(prefix)).map((r) => r.key);
  },

  /* Dados gravados antes de a sincronização existir não têm carimbo, e valeriam
     como mais antigos que tudo — a primeira sincronização os apagaria. Aqui eles
     passam a valer como recém-escritos, então sobem para a nuvem em vez de
     serem sobrescritos por ela. */
  async carimbarAntigos() {
    const semCarimbo = await db.kv.filter((r) => !r.updatedAt).toArray();
    if (!semCarimbo.length) return 0;
    const agora = Date.now();
    await db.kv.bulkPut(semCarimbo.map((r) => ({ ...r, updatedAt: agora })));
    return semCarimbo.length;
  },

  /* Tudo em formato de sincronização: { chave: { value, updatedAt } } */
  async paraSync() {
    const all = await db.kv.toArray();
    const mapa = {};
    all.forEach((r) => { mapa[r.key] = { value: r.value, updatedAt: r.updatedAt || 0 }; });
    return mapa;
  },

  /* Aplica o que veio da nuvem, chave a chave, só quando for mais novo.
     Devolve as chaves que mudaram de fato. */
  async aplicarRemoto(remoto) {
    const locais = await db.kv.toArray();
    const porChave = new Map(locais.map((r) => [r.key, r]));
    const mudou = [];
    for (const [key, item] of Object.entries(remoto || {})) {
      if (!item || typeof item !== "object") continue;
      const local = porChave.get(key);
      if (local && (local.updatedAt || 0) >= (item.updatedAt || 0)) continue;
      await db.kv.put({ key, value: item.value, updatedAt: item.updatedAt || Date.now() });
      mudou.push(key);
    }
    return mudou;
  },
};

/* ---------- API "de verdade" para dados estruturados ----------
   Use estas nas telas novas — são mais rápidas e permitem query por índice. */
export const serveRepo = {
  all: () => db.serveLog.orderBy("id").reverse().toArray(),
  byType: (type) => db.serveLog.where("type").equals(type).reverse().toArray(),
  add: (entry) => db.serveLog.add(entry),
  remove: (id) => db.serveLog.delete(id),
  clear: () => db.serveLog.clear(),
};

export const matchRepo = {
  all: () => db.matches.orderBy("id").toArray(),
  add: (m) => db.matches.add(m),
  update: (id, changes) => db.matches.update(id, changes),
  remove: (id) => db.matches.delete(id),
  clear: () => db.matches.clear(),
};
