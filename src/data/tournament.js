/* ============================================================
   ABA TORNEIO — lógica de campeonato
   ============================================================ */
const uid = () => Date.now() + Math.floor(Math.random() * 100000);

// Round-robin (algoritmo do círculo). Retorna lista de rodadas, cada uma com pares [i,j].
function roundRobin(ids) {
  const arr = ids.slice();
  if (arr.length % 2 === 1) arr.push(null); // bye
  const n = arr.length;
  const rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i], b = arr[n - 1 - i];
      if (a !== null && b !== null) pairs.push([a, b]);
    }
    rounds.push(pairs);
    arr.splice(1, 0, arr.pop()); // rotaciona mantendo o primeiro fixo
  }
  return rounds;
}

function genGroupMatches(players, doubleRound) {
  const ids = players.map(p => p.id);
  let rounds = roundRobin(ids);
  if (doubleRound) {
    const back = rounds.map(rd => rd.map(([a, b]) => [b, a]));
    rounds = rounds.concat(back);
  }
  const matches = [];
  rounds.forEach((rd, ri) => rd.forEach(([a, b]) => {
    matches.push({ id: uid(), phase: "grupo", round: ri + 1, a, b, sets: [], done: false, label: `Rodada ${ri + 1}` });
  }));
  return matches;
}

/* Quem saca agora, pelas regras oficiais:
   o saque troca a cada 2 pontos; a partir de 10-10 troca a cada ponto.
   Retorna 0 (jogador A) ou 1 (jogador B). `starter` é quem sacou primeiro no set. */
function serverOf(a, b, starter = 0) {
  const total = a + b;
  const changes = (a >= 10 && b >= 10) ? 10 + (total - 20) : Math.floor(total / 2);
  return (starter + changes) % 2;
}

// Quem abre o saque no set `i` — alterna a cada set.
const setStarter = (matchStarter, i) => (matchStarter + i) % 2;

/* Situação do saque agora: quem saca, se é o 1º ou o 2º saque da vez e se a
   troca acontece no próximo ponto. No deuce cada jogador saca uma vez só. */
function serveInfo(a, b, starter = 0) {
  const total = a + b;
  const deuce = a >= 10 && b >= 10;
  return {
    server: serverOf(a, b, starter),
    deuce,
    de: deuce ? 1 : 2,                       // quantos saques seguidos ele tem
    numero: deuce ? 1 : (total % 2) + 1,     // em qual deles está
    trocaNoProximo: deuce || total % 2 === 1,
  };
}

// Set encerrado: 11 pontos com 2 de vantagem (ou mais, no deuce).
const setDone = (s) => (s.a >= 11 || s.b >= 11) && Math.abs(s.a - s.b) >= 2;

// Resultado de uma partida a partir dos sets: {wa, wb, done}
function matchResult(m, bestOf) {
  let wa = 0, wb = 0;
  (m.sets || []).forEach(s => { if (s.a > s.b) wa++; else if (s.b > s.a) wb++; });
  const need = Math.ceil(bestOf / 2);
  return { wa, wb, done: wa >= need || wb >= need, winner: wa >= need ? m.a : wb >= need ? m.b : null };
}

function standings(players, matches, bestOf, frozen) {
  const t = {};
  players.forEach(p => {
    const fz = frozen && frozen.find(f => f.id === p.id);
    t[p.id] = fz ? { ...fz } : { id: p.id, name: p.name, P: 0, J: 0, V: 0, D: 0, SP: 0, SC: 0 };
  });
  matches.filter(m => m.phase === "grupo").forEach(m => {
    const r = matchResult(m, bestOf);
    if (!r.done) return;
    const A = t[m.a], B = t[m.b]; if (!A || !B) return;
    A.J++; B.J++;
    A.SP += r.wa; A.SC += r.wb; B.SP += r.wb; B.SC += r.wa;
    if (r.winner === m.a) { A.V++; B.D++; A.P += 2; }
    else { B.V++; A.D++; B.P += 2; }
  });
  return Object.values(t).sort((x, y) =>
    y.P - x.P || (y.V - x.V) || ((y.SP - y.SC) - (x.SP - x.SC)) || (y.SP - x.SP) || x.name.localeCompare(y.name));
}

// Mata-mata: monta o chaveamento a partir dos N classificados
const KO_SIZES = { 2: "Final", 4: "Semifinal", 8: "Quartas", 16: "Oitavas" };
function seedOrder(n) { // ordenamento clássico de chave (1 vs n, 2 vs n-1 espelhado)
  if (n === 2) return [1, 2];
  const prev = seedOrder(n / 2);
  const out = [];
  prev.forEach(s => { out.push(s); out.push(n + 1 - s); });
  return out;
}
function genBracket(qualifiers, bestOf) {
  const n = qualifiers.length;
  const order = seedOrder(n);
  const first = [];
  for (let i = 0; i < n; i += 2) {
    const s1 = order[i], s2 = order[i + 1];
    first.push({ id: uid(), phase: "ko", roundSize: n, a: qualifiers[s1 - 1].id, b: qualifiers[s2 - 1].id, sets: [], done: false });
  }
  return first;
}

const DEFAULT_TOURNEY = {
  name: "Campeonato de Domingo",
  bestOf: 5,
  doubleRound: false,
  koStart: 4,
  phase: "config", // config | grupo | ko | fim
  players: [],
  groupMatches: [],
  koMatches: [],
};

/* Houve um campeonato de exemplo embutido aqui, que se autogravava em todo
   aparelho novo e contaminava o ranking. Foi removido; isto só reconhece o que
   ficou gravado para poder descartar. Os ids 201-203 eram dele. */
const ehExemploAntigo = (t) =>
  !!t && Array.isArray(t.koMatches) && t.koMatches.some(m => m.id === 201 || m.id === 202 || m.id === 203);

export {
  uid, roundRobin, genGroupMatches, matchResult, standings, KO_SIZES, seedOrder, genBracket, DEFAULT_TOURNEY,
  serverOf, setStarter, setDone, serveInfo, ehExemploAntigo
};
