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
export const storage = {
  async get(key) {
    const row = await db.kv.get(key);
    return row ? row.value : null;
  },
  async set(key, value) {
    await db.kv.put({ key, value });
    return value;
  },
  async delete(key) {
    await db.kv.delete(key);
  },
  async list(prefix = "") {
    const all = await db.kv.toArray();
    return all.filter((r) => r.key.startsWith(prefix)).map((r) => r.key);
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
