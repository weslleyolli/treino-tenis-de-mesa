import { storage, definirAoGravar } from "./db.js";

/* Sincronização com a nuvem (Netlify Blobs via /api/dados).
   O app continua offline-first: o IndexedDB é sempre a fonte imediata da tela,
   e a nuvem é uma cópia mesclada por chave. Se a rede falhar, nada quebra. */

const URL_API = "/api/dados";
const CHAVE_LOCAL = "treinotm:chave";     // senha compartilhada, por aparelho
const ULTIMO_SYNC = "treinotm:ultimoSync";

const lerChave = () => { try { return localStorage.getItem(CHAVE_LOCAL) || ""; } catch { return ""; } };
const gravarChave = (v) => { try { v ? localStorage.setItem(CHAVE_LOCAL, v) : localStorage.removeItem(CHAVE_LOCAL); } catch {} };
const lerUltimoSync = () => { try { return Number(localStorage.getItem(ULTIMO_SYNC)) || 0; } catch { return 0; } };
const gravarUltimoSync = (t) => { try { localStorage.setItem(ULTIMO_SYNC, String(t)); } catch {} };

/* Avisa a interface quando o estado da sincronização muda. */
const ouvintes = new Set();
let estado = { fase: "ocioso", erro: null, em: lerUltimoSync() };
const assinar = (fn) => { ouvintes.add(fn); fn(estado); return () => ouvintes.delete(fn); };
function definirEstado(novo) {
  estado = { ...estado, ...novo };
  ouvintes.forEach((fn) => fn(estado));
}

async function chamar(metodo, corpo) {
  const chave = lerChave();
  if (!chave) throw new Error("sem-chave");
  const r = await fetch(URL_API, {
    method: metodo,
    headers: { "x-chave": chave, ...(corpo ? { "content-type": "application/json" } : {}) },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (r.status === 401) throw new Error("senha-invalida");
  if (r.status === 503) throw new Error("nao-configurado");
  if (!r.ok) throw new Error("falha-" + r.status);
  return r.json();
}

/* Envia o que é local, recebe a mescla de volta e aplica o que for mais novo.
   Devolve as chaves alteradas para a tela poder se recarregar. */
async function sincronizar() {
  if (!lerChave()) { definirEstado({ fase: "sem-chave", erro: null }); return { mudou: [] }; }
  definirEstado({ fase: "sincronizando", erro: null });
  try {
    await storage.carimbarAntigos();   // protege dados anteriores à sincronização
    const locais = await storage.paraSync();
    const { dados } = await chamar("POST", { dados: locais });
    const mudou = await storage.aplicarRemoto(dados);
    const agora = Date.now();
    gravarUltimoSync(agora);
    definirEstado({ fase: "ok", erro: null, em: agora });
    return { mudou };
  } catch (e) {
    const motivo = e && e.message ? e.message : "falha";
    definirEstado({ fase: "erro", erro: motivo });
    return { mudou: [], erro: motivo };
  }
}

/* Testa a senha sem gravar nada. */
async function testarChave(chave) {
  const anterior = lerChave();
  gravarChave(chave);
  try { await chamar("GET"); return { ok: true }; }
  catch (e) { gravarChave(anterior); return { ok: false, motivo: e.message }; }
}

/* Empurra depois de um tempinho parado, para uma partida inteira não virar
   dezenas de requisições. */
let timer = null;
function agendarSync(ms = 4000) {
  if (!lerChave()) return;
  clearTimeout(timer);
  timer = setTimeout(() => { sincronizar(); }, ms);
}

// toda gravação local agenda um envio
definirAoGravar(() => agendarSync());

// e ao voltar a ter rede, tenta de novo
if (typeof window !== "undefined") window.addEventListener("online", () => agendarSync(500));

export { lerChave, gravarChave, testarChave, sincronizar, agendarSync, assinar, lerUltimoSync };
