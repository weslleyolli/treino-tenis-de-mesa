import { getStore } from "@netlify/blobs";

/* Estado compartilhado do app: campeonatos, ranking e treino.
   Guardado como um mapa { chave: { value, updatedAt } } para dar para mesclar
   por chave — dois aparelhos mexendo em coisas diferentes não se atropelam. */

const CHAVE_BLOB = "estado";
const NOME_STORE = "treino-tm";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

/* A senha vive só na variável de ambiente do Netlify, nunca no repositório.
   Sem SYNC_KEY configurada a API fica fechada, em vez de aberta por acidente. */
function autorizado(req) {
  const esperada = process.env.SYNC_KEY;
  if (!esperada) return false;
  const enviada = req.headers.get("x-chave") || "";
  if (enviada.length !== esperada.length) return false;
  let dif = 0;
  for (let i = 0; i < esperada.length; i++) dif |= enviada.charCodeAt(i) ^ esperada.charCodeAt(i);
  return dif === 0;
}

const ehMapaValido = (o) =>
  !!o && typeof o === "object" && !Array.isArray(o) &&
  Object.values(o).every(v => v && typeof v === "object" && "value" in v);

/* Mescla por chave: vence o carimbo de tempo mais novo. */
function mesclar(atual, recebido) {
  const saida = { ...atual };
  for (const [k, novo] of Object.entries(recebido)) {
    const velho = atual[k];
    if (!velho || (novo.updatedAt || 0) >= (velho.updatedAt || 0)) saida[k] = novo;
  }
  return saida;
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  if (!process.env.SYNC_KEY)
    return json({ erro: "Sincronização não configurada. Defina SYNC_KEY nas variáveis de ambiente do Netlify." }, 503);

  if (!autorizado(req)) return json({ erro: "Senha inválida." }, 401);

  /* Consistência forte: o padrão é eventual, e aí a leitura logo antes da
     mescla não enxerga a escrita anterior — o estado voltava vazio e cada
     aparelho apagava o do outro. */
  const store = getStore({ name: NOME_STORE, consistency: "strong" });

  if (req.method === "GET") {
    const dados = (await store.get(CHAVE_BLOB, { type: "json" })) || {};
    return json({ dados, servidorEm: Date.now() });
  }

  if (req.method === "POST") {
    let corpo;
    try { corpo = await req.json(); } catch { return json({ erro: "JSON inválido." }, 400); }
    if (!ehMapaValido(corpo?.dados)) return json({ erro: "Formato inesperado." }, 400);

    // mescla com o que já está lá para não perder o que outro aparelho gravou
    const atual = (await store.get(CHAVE_BLOB, { type: "json" })) || {};
    const final = mesclar(atual, corpo.dados);
    await store.setJSON(CHAVE_BLOB, final);
    return json({ dados: final, servidorEm: Date.now() });
  }

  return json({ erro: "Método não suportado." }, 405);
};

export const config = { path: "/api/dados" };
