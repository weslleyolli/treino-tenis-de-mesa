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
  // vaga vazia no chaveamento: quem tem adversário passa sem jogar
  if (m && m.bye) {
    const quem = m.a ?? m.b;
    return { wa: m.a ? 1 : 0, wb: m.b ? 1 : 0, done: true, winner: quem ?? null };
  }
  const need = Math.ceil(bestOf / 2);
  /* Resultado lancado so em sets, sem os pontos de cada set — e o caso de
     campeonato jogado fora do app e registrado depois. Melhor guardar o que se
     sabe do que inventar placar de set. */
  if (m && m.semDetalhe && Array.isArray(m.placar)) {
    const [pa, pb] = m.placar;
    return { wa: pa, wb: pb, done: pa >= need || pb >= need, winner: pa >= need ? m.a : pb >= need ? m.b : null };
  }
  let wa = 0, wb = 0;
  (m.sets || []).forEach(s => { if (s.a > s.b) wa++; else if (s.b > s.a) wb++; });
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
/* Monta a primeira rodada. `tamanho` permite uma chave maior que o número de
   jogadores: as vagas que sobram viram bye, e pela ordem de chaveamento elas
   caem nos primeiros cabeças, como num torneio de verdade. */
const proximaPotencia = (n) => { let p = 2; while (p < n) p *= 2; return p; };

function genBracket(qualifiers, bestOf, tamanho, idaVolta) {
  // sem potencia de 2 o chaveamento nao fecha e seedOrder entra em recursao infinita
  const n = tamanho || proximaPotencia(Math.max(2, qualifiers.length));
  const order = seedOrder(n);
  const first = [];
  for (let i = 0; i < n; i += 2) {
    const a = qualifiers[order[i] - 1]?.id ?? null;
    const b = qualifiers[order[i + 1] - 1]?.id ?? null;
    if (a === null && b === null) continue;              // vaga totalmente vazia
    const bye = (a === null) !== (b === null);
    const tie = "c" + uid();
    first.push({ id: uid(), phase: "ko", roundSize: n, tie, leg: 1, a, b, sets: [], done: bye, bye });
    // na volta o mando inverte; quem passou direto não joga duas vezes
    if (idaVolta && !bye) first.push({ id: uid(), phase: "ko", roundSize: n, tie, leg: 2, a: b, b: a, sets: [], done: false });
  }
  return first;
}

/* ---- Quem abre o saque ----
   `starter` é 0 ou 1: o lado A ou o lado B daquela partida. Antes era sempre 0,
   ou seja, sempre o cabeça de chave / primeiro da lista — nunca variava. Agora
   quem abriu menos vezes no torneio começa sacando, e o empate vai a sorteio. */

/* Por jogador: em quantas partidas já entrou e em quantas abriu o saque. */
function estatSaques(matches) {
  const st = new Map();
  const reg = (id) => { if (!st.has(id)) st.set(id, { jogos: 0, saques: 0 }); return st.get(id); };
  for (const m of matches || []) {
    if (m.starter == null || m.bye || m.a == null || m.b == null) continue;
    reg(m.a).jogos++; reg(m.b).jogos++;
    reg(m.starter === 0 ? m.a : m.b).saques++;
  }
  return st;
}

const VAZIO = { jogos: 0, saques: 0 };

/* Começa quem tem mais "dívida" de saque — partidas jogadas menos saques
   abertos. Só comparar a contagem de saques não bastava: como as duas contagens
   empatam muito no começo, o sorteio do desempate se acumulava e alguém podia
   terminar o torneio sem abrir nenhum. A dívida se corrige sozinha, porque quem
   perde o sorteio fica devendo e ganha a próxima. */
function escolherStarter(match, matches) {
  if (match.starter != null) return match.starter;       // já foi decidido
  if (match.a == null || match.b == null) return 0;
  const st = estatSaques(matches);
  const A = st.get(match.a) || VAZIO, B = st.get(match.b) || VAZIO;

  const da = A.jogos - A.saques, db = B.jogos - B.saques;
  if (da !== db) return da > db ? 0 : 1;
  if (A.saques !== B.saques) return A.saques < B.saques ? 0 : 1;

  /* Empatado nos dois critérios: prioriza quem tem menos jogos pela frente,
     porque terá menos chances de compensar depois. */
  const faltam = (id) => (matches || []).filter(
    m => m.starter == null && !m.bye && m.id !== match.id && (m.a === id || m.b === id)).length;
  const fa = faltam(match.a), fb = faltam(match.b);
  if (fa !== fb) return fa < fb ? 0 : 1;

  return Math.random() < 0.5 ? 0 : 1;
}

/* Quantas vezes cada jogador abriu o saque — para mostrar na tela que está justo. */
function resumoSaques(players, matches) {
  const st = estatSaques(matches);
  return (players || []).map(p => {
    const e = st.get(p.id) || VAZIO;
    return { id: p.id, name: p.name, n: e.saques, jogos: e.jogos };
  }).sort((x, y) => x.n - y.n || x.name.localeCompare(y.name));
}

/* ---- Confronto do mata-mata: pode ter 1 jogo, 2 jogos (ida e volta) e ainda
   um set de desempate. Quem vence é quem somar mais sets no agregado; se o
   agregado empatar (2x0 e depois 0x2, por exemplo), decide o set extra. ---- */

const idDoTie = (m) => m.tie || ("m" + m.id);   // partidas antigas não tinham tie

function agruparTies(matches) {
  const porRodada = {};
  for (const m of matches || []) {
    const r = (porRodada[m.roundSize] = porRodada[m.roundSize] || {});
    (r[idDoTie(m)] = r[idDoTie(m)] || []).push(m);
  }
  for (const r of Object.values(porRodada))
    for (const legs of Object.values(r)) legs.sort((x, y) => (x.leg || 1) - (y.leg || 1));
  return porRodada;
}

function tieResult(legs, bestOf) {
  if (!legs || !legs.length) return { done: false };
  const A = legs[0].a, B = legs[0].b;
  const normais = legs.filter(l => !l.desempate);
  let sa = 0, sb = 0, concluidos = 0;

  for (const l of normais) {
    const r = matchResult(l, bestOf);
    if (!r.done) continue;
    concluidos++;
    // soma pelo dono do resultado, não pelo lado — na volta os lados trocam
    sa += (l.a === A ? r.wa : r.wb);
    sb += (l.a === A ? r.wb : r.wa);
  }
  const base = { sa, sb, A, B, jogos: normais.length, concluidos };
  if (concluidos < normais.length) return { ...base, done: false };
  if (sa !== sb) return { ...base, done: true, winner: sa > sb ? A : B };

  const d = legs.find(l => l.desempate);
  if (!d) return { ...base, done: false, precisaDesempate: true };
  const rd = matchResult(d, 1);
  return rd.done
    ? { ...base, done: true, winner: rd.winner, viaDesempate: true }
    : { ...base, done: false, temDesempate: true };
}

/* Cria o set de desempate dos confrontos que empataram no agregado. */
function garantirDesempates(koMatches, bestOf) {
  const porRodada = agruparTies(koMatches);
  const novos = [];
  for (const ties of Object.values(porRodada)) {
    for (const legs of Object.values(ties)) {
      const r = tieResult(legs, bestOf);
      if (!r.precisaDesempate) continue;
      const base = legs[0];
      novos.push({
        id: uid(), phase: "ko", roundSize: base.roundSize, tie: idDoTie(base),
        leg: 3, desempate: true, a: r.A, b: r.B, sets: [], done: false,
      });
    }
  }
  return novos.length ? koMatches.concat(novos) : koMatches;
}


/* Quantos jogadores uma chave desse tamanho comporta sem virar só bye.
   Acima de metade garante que nenhum confronto fique vazio dos dois lados. */
const cabeNaChave = (qtd, tamanho) => qtd > tamanho / 2 && qtd <= tamanho;

/* A ordem de chaveamento como uma lista de `tamanho` posições (ids ou null).
   Guardar as vagas vazias explicitamente é o que permite arrastar um jogador
   para uma posição que dá bye. */
function ordemInicial(players, tamanho) {
  const out = new Array(tamanho).fill(null);
  players.slice(0, tamanho).forEach((p, i) => { out[i] = p.id; });
  return out;
}

/* A ordem guardada só serve se cobrir exatamente os jogadores atuais. */
function ordemValida(ordem, players, tamanho) {
  if (!Array.isArray(ordem) || ordem.length !== tamanho) return false;
  const ids = new Set(players.map(p => p.id));
  const usados = ordem.filter(x => x != null);
  return usados.length === Math.min(players.length, tamanho)
    && usados.every(id => ids.has(id))
    && new Set(usados).size === usados.length;
}

/* Os confrontos que uma ordem produz: pares de posições de seed. */
function confrontosDe(ordem, tamanho) {
  const seq = seedOrder(tamanho);
  const jogos = [];
  for (let i = 0; i < tamanho; i += 2) {
    const ia = seq[i] - 1, ib = seq[i + 1] - 1;
    if (ordem[ia] == null && ordem[ib] == null) continue;
    jogos.push({ ia, ib, a: ordem[ia], b: ordem[ib] });
  }
  return jogos;
}

function embaralhar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULT_TOURNEY = {
  name: "Campeonato de Domingo",
  bestOf: 5,
  doubleRound: false,
  koStart: 4,
  formato: "grupos+mata",   // mata | so-grupos | grupos+mata
  chaveamento: "ordem",     // ordem = pela lista de jogadores | sorteio = aleatório
  phase: "config",          // config | grupo | ko | fim
  players: [],
  groupMatches: [],
  koMatches: [],
};

/* Houve um campeonato de exemplo embutido aqui, que se autogravava em todo
   aparelho novo e contaminava o ranking. Foi removido; isto só reconhece o que
   ficou gravado para poder descartar. Os ids 201-203 eram dele. */
/* Torneios salvos antes dos três formatos gravavam "grupos" querendo dizer
   grupos seguidos de mata-mata. */
const formatoDe = (t) => {
  const f = t && t.formato;
  if (f === "grupos" || !f) return "grupos+mata";
  return f;
};
const temGrupos = (t) => formatoDe(t) !== "mata";

/* Mata-mata pode ter formato proprio: as vezes da tempo de ida e volta nos
   grupos mas nao na eliminatoria. null = segue o que vale para os grupos. */
const koIdaVoltaDe = (t) => (t && t.koIdaVolta != null ? !!t.koIdaVolta : !!(t && t.doubleRound));
const koBestOfDe = (t) => (t && t.koBestOf) || (t && t.bestOf) || 5;
const temMata = (t) => formatoDe(t) !== "so-grupos";

const ehExemploAntigo = (t) =>
  !!t && Array.isArray(t.koMatches) && t.koMatches.some(m => m.id === 201 || m.id === 202 || m.id === 203);

export {
  uid, roundRobin, genGroupMatches, matchResult, standings, KO_SIZES, seedOrder, genBracket, DEFAULT_TOURNEY,
  serverOf, setStarter, setDone, serveInfo, ehExemploAntigo, cabeNaChave, embaralhar, proximaPotencia,
  agruparTies, tieResult, garantirDesempates, idDoTie, formatoDe, temGrupos, temMata,
  ordemInicial, ordemValida, confrontosDe, estatSaques, escolherStarter, resumoSaques,
  koIdaVoltaDe, koBestOfDe
};
