/* ============================================================
   RANQUEAMENTO — pontos por colocação, no estilo WTT
   ============================================================ */
import { matchResult } from "./tournament.js";

/* Pontos por posição final. Do 6º em diante, RANK_TAIL. */
const RANK_POINTS = [1000, 700, 450, 250, 100];
const RANK_TAIL = 50;
const pointsFor = (pos) => RANK_POINTS[pos] ?? RANK_TAIL;

/* Rótulo da fase que cada posição representa, para explicar a tabela na tela. */
const RANK_TABLE = [
  { pos: "1º", label: "Campeão", pts: 1000 },
  { pos: "2º", label: "Vice", pts: 700 },
  { pos: "3º", label: "Semifinal", pts: 450 },
  { pos: "4º", label: "Semifinal", pts: 250 },
  { pos: "5º", label: "Fase de grupos", pts: 100 },
  { pos: "6º+", label: "Fase de grupos", pts: RANK_TAIL },
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

/* Quanto cada jogador somou num campeonato: [{ name, points, title }] */
function awardsOf(h) {
  const nameOf = (id) => (h.players || []).find(p => p.id === id)?.name || "—";
  return placementsOf(h).map((id, i) => ({
    name: nameOf(id),
    points: pointsFor(i),
    title: i === 0,
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

export { RANK_POINTS, RANK_TAIL, RANK_TABLE, RANKING_SEED, pointsFor, placementsOf, awardsOf, buildRanking, countEvents };
