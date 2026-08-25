/* ============================================================
   RANQUEAMENTO — pontos por colocação, no estilo WTT
   ============================================================ */
import { matchResult } from "./tournament.js";

/* Pontos pela FASE em que o jogador caiu, nao pela posicao final. Quem perde na
   mesma rodada leva o mesmo, que e como funciona em torneio de verdade: sem
   disputa de 3o lugar, os dois semifinalistas valem o mesmo. */
const RANK_POR_FASE = { campeao: 1000, final: 700, 4: 450, 8: 250, 16: 100, 32: 50 };
const RANK_GRUPOS = 50;                       // caiu antes do mata-mata
const RANK_POINTS = [1000, 700, 450, 250, 100];  // usado quando so ha fase de grupos
const RANK_TAIL = 50;
const pointsFor = (pos) => RANK_POINTS[pos] ?? RANK_TAIL;

/* Rótulo da fase que cada posição representa, para explicar a tabela na tela. */
const RANK_TABLE = [
  { pos: "Campeão", label: "venceu a final", pts: 1000 },
  { pos: "Vice", label: "perdeu a final", pts: 700 },
  { pos: "Semis", label: "os dois semifinalistas", pts: 450 },
  { pos: "Quartas", label: "os quatro", pts: 250 },
  { pos: "Oitavas", label: "os oito", pts: 100 },
  { pos: "Grupos", label: "caiu antes do mata-mata", pts: RANK_GRUPOS },
];

/* Saldo herdado: a temporada já estava em andamento quando o app passou a
   registrar. Estes pontos entram no ranking anual de 2026 e não têm mês. */
const RANKING_SEED = {
  year: 2026,
  entries: [
    { name: "Henrique", points: 11100, titles: 7 },
    { name: "Weslley", points: 9950, titles: 4 },
    { name: "Caio", points: 6425, titles: 1 },
    { name: "Aleykson", points: 5675, titles: 2 },
    { name: "Leo", points: 2800, titles: 0 },
  ],
};

const normName = (n) => String(n || "").trim().toLowerCase();

/* Ordem final de um campeonato arquivado, do 1º ao último.
   Mata-mata manda: final define 1º/2º, perdedores de cada rodada vêm em
   seguida, e quem não chegou ao mata-mata entra pela classificação de grupos. */
function placementsOf(h) {
  const bo = h.koBestOf || h.bestOf;
  const ko = h.koMatches || [];
  const table = h.table || [];
  const rankInGroup = (id) => {
    const i = table.findIndex(r => r.id === id);
    return i === -1 ? 999 : i;
  };

  const order = [];
  const seen = new Set();
  const push = (id) => { if (id != null && !seen.has(id)) { seen.add(id); order.push(id); } };

  // Rodadas da menor (final = 2) para a maior: final, semis, quartas…
  const sizes = [...new Set(ko.map(m => m.roundSize))].sort((a, b) => a - b);
  for (const sz of sizes) {
    const rd = ko.filter(m => m.roundSize === sz && matchResult(m, bo).done);
    if (sz === 2) {
      const fin = rd[0];
      if (fin) {
        const r = matchResult(fin, bo);
        push(r.winner);
        push(r.winner === fin.a ? fin.b : fin.a);
      }
    } else {
      const losers = rd.map(m => {
        const r = matchResult(m, bo);
        return r.winner === m.a ? m.b : m.a;
      });
      losers.sort((x, y) => rankInGroup(x) - rankInGroup(y));
      losers.forEach(push);
    }
  }
  table.forEach(r => push(r.id));
  return order;
}

/* Quanto cada jogador somou num campeonato: [{ name, points, title }].
   Sem mata-mata, vale a classificação de grupos. Com mata-mata, vale a fase em
   que a pessoa caiu — os dois semifinalistas levam o mesmo, e assim por diante. */
function awardsOf(h) {
  const nameOf = (id) => (h.players || []).find(p => p.id === id)?.name || "—";
  const bo = h.koBestOf || h.bestOf;
  const ko = h.koMatches || [];

  if (!ko.length) {
    return (h.table || []).map((r, i) => ({ name: r.name, points: pointsFor(i), title: i === 0 }));
  }

  const pontos = new Map();   // id -> pontos
  let campeao = null;

  for (const m of ko) {
    const r = matchResult(m, bo);
    if (!r.done || m.bye) continue;
    const perdedor = r.winner === m.a ? m.b : m.a;
    if (perdedor == null) continue;
    // cai na rodada de maior valor que alcançou
    const vale = m.roundSize === 2 ? RANK_POR_FASE.final : (RANK_POR_FASE[m.roundSize] ?? RANK_GRUPOS);
    pontos.set(perdedor, Math.max(pontos.get(perdedor) || 0, vale));
    if (m.roundSize === 2) campeao = r.winner;
  }
  if (campeao != null) pontos.set(campeao, RANK_POR_FASE.campeao);

  // quem estava inscrito e nao chegou ao mata-mata
  for (const r of (h.table || [])) if (!pontos.has(r.id)) pontos.set(r.id, RANK_GRUPOS);

  return [...pontos.entries()].map(([id, points]) => ({
    name: nameOf(id), points, title: id === campeao,
  }));
}

/* Monta o ranking a partir dos campeonatos arquivados.
   scope "ano": todos do ano + saldo herdado. scope "mes": só os do mês. */
function buildRanking(history, { scope, year, month, removidos }) {
  const fora = new Set((removidos || []).map(r => normName(r.nome ?? r)));
  const acc = new Map();
  const bump = (name, points, titles, events) => {
    const k = normName(name);
    if (!k || fora.has(k)) return;   // tirado do ranking pelo usuário
    const cur = acc.get(k) || { name, points: 0, titles: 0, events: 0 };
    cur.points += points; cur.titles += titles; cur.events += events;
    acc.set(k, cur);
  };

  if (scope === "ano" && year === RANKING_SEED.year) {
    RANKING_SEED.entries.forEach(e => bump(e.name, e.points, e.titles, 0));
  }

  (history || []).forEach(h => {
    const d = new Date(h.finishedAt);
    if (d.getFullYear() !== year) return;
    if (scope === "mes" && d.getMonth() !== month) return;
    awardsOf(h).forEach(a => bump(a.name, a.points, a.title ? 1 : 0, 1));
  });

  return [...acc.values()].sort((a, b) =>
    b.points - a.points || b.titles - a.titles || a.name.localeCompare(b.name));
}

/* Quantos campeonatos entraram no recorte (o saldo herdado não conta). */
const countEvents = (history, { year, month, scope }) =>
  (history || []).filter(h => {
    const d = new Date(h.finishedAt);
    return d.getFullYear() === year && (scope === "ano" || d.getMonth() === month);
  }).length;

export { RANK_POINTS, RANK_TAIL, RANK_POR_FASE, RANK_GRUPOS, RANK_TABLE, RANKING_SEED, pointsFor, placementsOf, awardsOf, buildRanking, countEvents };
