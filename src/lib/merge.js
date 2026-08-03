/* Regras de mesclagem entre o aparelho e a nuvem.

   Para quase tudo, o carimbo mais novo vence. Mas o histórico de campeonatos é
   uma lista que só cresce: dois aparelhos arquivando torneios diferentes têm de
   terminar com os dois, e não com o do último que sincronizou. Ali a regra é
   união por id. Para a exclusão continuar funcionando mesmo assim, quem apaga
   registra o id numa lista de removidos, que a união respeita. */

const CHAVE_HIST = "tourney:history";
const CHAVE_REMOVIDOS = "tourney:removidos";

function unirRemovidos(a, b) {
  const m = new Map();
  for (const r of [...(a || []), ...(b || [])]) {
    if (r && r.id != null) m.set(String(r.id), r);
  }
  return [...m.values()];
}

function unirHistorico(a, b, removidos) {
  const fora = new Set((removidos || []).map((r) => String(r.id)));
  const m = new Map();
  for (const t of [...(a || []), ...(b || [])]) {
    if (!t || t.id == null) continue;
    const k = String(t.id);
    if (fora.has(k) || m.has(k)) continue;
    m.set(k, t);
  }
  return [...m.values()].sort((x, y) => (y.finishedAt || 0) - (x.finishedAt || 0));
}

function mesclarEstados(local, remoto) {
  const L = local || {}, R = remoto || {};
  const agora = Date.now();
  const saida = {};

  const removidos = unirRemovidos(L[CHAVE_REMOVIDOS]?.value, R[CHAVE_REMOVIDOS]?.value);
  if (removidos.length) saida[CHAVE_REMOVIDOS] = { value: removidos, updatedAt: agora };

  for (const k of new Set([...Object.keys(L), ...Object.keys(R)])) {
    if (k === CHAVE_REMOVIDOS) continue;
    const l = L[k], r = R[k];

    if (k === CHAVE_HIST) {
      saida[k] = { value: unirHistorico(l?.value, r?.value, removidos), updatedAt: agora };
      continue;
    }
    if (!r) { saida[k] = l; continue; }
    if (!l) { saida[k] = r; continue; }
    saida[k] = (r.updatedAt || 0) > (l.updatedAt || 0) ? r : l;
  }
  return saida;
}

/* Quais chaves mudaram de valor — a tela só recarrega se algo mudou de fato. */
function chavesMudadas(antes, depois) {
  const out = [];
  for (const [k, v] of Object.entries(depois || {})) {
    const a = antes?.[k];
    if (!a || JSON.stringify(a.value) !== JSON.stringify(v.value)) out.push(k);
  }
  return out;
}

export { mesclarEstados, unirHistorico, unirRemovidos, chavesMudadas, CHAVE_HIST, CHAVE_REMOVIDOS };
