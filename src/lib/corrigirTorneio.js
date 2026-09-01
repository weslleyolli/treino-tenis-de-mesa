/* Correções em torneio já arquivado.

   O caso que motivou isto: um jogador não apareceu, os jogos dele ficaram 0-0-0
   sem W.O., e o empate em tudo o colocou à frente de quem realmente jogou —
   levando-o ao mata-mata. Lá, quem entrou na vaga foi outra pessoa, registrada
   com o nome errado.

   Renomear não resolve: o ranking soma por NOME, então o mesmo jogador com duas
   entradas no mesmo torneio ganharia os pontos das duas. O que resolve é fundir:
   as partidas que ELE de fato jogou passam para quem jogou, e o resto do
   fantasma desaparece. */

const temResultado = (m) =>
  !!(m && (m.done || m.bye || (m.sets || []).some(s => (s.a || 0) > 0 || (s.b || 0) > 0)));

/* Só as partidas com resultado migram. As que nunca aconteceram — o caso dos
   jogos de quem não foi — são apagadas em vez de viajarem para o outro jogador,
   senão ele terminaria com dois confrontos contra o mesmo adversário. */
function migrar(partidas, deId, paraId) {
  const out = [];
  for (const m of partidas || []) {
    const toca = m.a === deId || m.b === deId;
    if (!toca) { out.push(m); continue; }
    if (!temResultado(m)) continue;              // nunca foi jogada: some
    const nm = { ...m, a: m.a === deId ? paraId : m.a, b: m.b === deId ? paraId : m.b };
    if (nm.a != null && nm.a === nm.b) continue; // viraria jogo contra si mesmo
    out.push(nm);
  }
  return out;
}

/* Funde `deId` em `paraId`: o segundo herda o que o primeiro jogou de verdade,
   e o primeiro deixa de existir neste torneio. */
function fundirJogadores(torneio, deId, paraId) {
  if (!torneio || deId == null || paraId == null || deId === paraId) return torneio;
  const t = { ...torneio };
  t.players = (t.players || []).filter(p => p.id !== deId);
  t.table = (t.table || []).filter(r => r.id !== deId);
  t.groupMatches = migrar(t.groupMatches, deId, paraId);
  t.koMatches = migrar(t.koMatches, deId, paraId);
  if (t.championId === deId) {
    t.championId = paraId;
    t.championName = (t.players.find(p => p.id === paraId) || {}).name || t.championName;
  }
  return t;
}

function renomearJogador(torneio, id, nome) {
  const novo = String(nome || "").trim();
  if (!torneio || id == null || !novo) return torneio;
  const t = { ...torneio };
  t.players = (t.players || []).map(p => p.id === id ? { ...p, name: novo } : p);
  t.table = (t.table || []).map(r => r.id === id ? { ...r, name: novo } : r);
  if (t.championId === id) t.championName = novo;
  return t;
}

/* Remove sem herdeiro: some o jogador e tudo que ele disputou. Use quando a
   inscrição inteira foi engano — se alguém jogou no lugar dele, use fundir. */
function removerJogador(torneio, id) {
  if (!torneio || id == null) return torneio;
  const t = { ...torneio };
  t.players = (t.players || []).filter(p => p.id !== id);
  t.table = (t.table || []).filter(r => r.id !== id);
  const semEle = (ms) => (ms || []).filter(m => m.a !== id && m.b !== id);
  t.groupMatches = semEle(t.groupMatches);
  t.koMatches = semEle(t.koMatches);
  if (t.championId === id) { t.championId = null; t.championName = null; }
  return t;
}

export { fundirJogadores, renomearJogador, removerJogador };
