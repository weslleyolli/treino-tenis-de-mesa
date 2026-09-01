/* Confronto direto entre dois jogadores, varrendo todos os campeonatos arquivados.

   O `id` de jogador é recriado a cada torneio, então cruzar por id não funciona
   entre campeonatos — o que atravessa é o nome, normalizado como o ranking já
   faz. É a mesma âncora do buildRanking, então os dois contam a mesma pessoa. */
import { matchResult } from "../data/tournament.js";

const norm = (n) => String(n || "").trim().toLowerCase();

const FASE = { 2: "Final", 4: "Semifinal", 8: "Quartas", 16: "Oitavas", 32: "Trigésimas" };

function confrontosEntre(history, nomeA, nomeB) {
  const A = norm(nomeA), B = norm(nomeB);
  const jogos = [];
  if (!A || !B || A === B) return { jogos, vitA: 0, vitB: 0, setsA: 0, setsB: 0, pontosA: 0, pontosB: 0 };

  for (const h of history || []) {
    const nomeDe = (id) => ((h.players || []).find(p => p.id === id) || {}).name || "";
    const varrer = (partidas, fase, bestOf) => {
      for (const m of partidas || []) {
        if (!m || m.bye) continue;
        const na = norm(nomeDe(m.a)), nb = norm(nomeDe(m.b));
        if (!((na === A && nb === B) || (na === B && nb === A))) continue;
        const r = matchResult(m, bestOf);
        if (!r.done) continue;
        /* `a` e `b` alternam de lado entre torneios; guardo tudo já orientado
           para A, senão a leitura vira um quebra-cabeça. */
        const aEsquerda = na === A;
        const sets = (m.sets || []).map(s => aEsquerda ? { a: s.a, b: s.b } : { a: s.b, b: s.a });
        jogos.push({
          id: m.id, torneio: h.name, em: h.finishedAt,
          fase: fase === "ko" ? (FASE[m.roundSize] || "Mata-mata") : "Fase de grupos",
          setsA: aEsquerda ? r.wa : r.wb,
          setsB: aEsquerda ? r.wb : r.wa,
          sets,
          venceuA: r.winner != null && norm(nomeDe(r.winner)) === A,
        });
      }
    };
    varrer(h.groupMatches, "grupo", h.bestOf);
    varrer(h.koMatches, "ko", h.koBestOf || h.bestOf);
  }

  jogos.sort((x, y) => y.em - x.em);
  const soma = (f) => jogos.reduce((n, j) => n + f(j), 0);
  return {
    jogos,
    vitA: soma(j => (j.venceuA ? 1 : 0)),
    vitB: soma(j => (j.venceuA ? 0 : 1)),
    setsA: soma(j => j.setsA),
    setsB: soma(j => j.setsB),
    pontosA: soma(j => j.sets.reduce((n, s) => n + (s.a || 0), 0)),
    pontosB: soma(j => j.sets.reduce((n, s) => n + (s.b || 0), 0)),
  };
}

/* Todo mundo que já apareceu em algum campeonato arquivado, sem repetir. */
function jogadoresDoHistorico(history) {
  const m = new Map();
  for (const h of history || []) for (const p of h.players || []) {
    if (p && p.name && !m.has(norm(p.name))) m.set(norm(p.name), p.name);
  }
  return [...m.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export { confrontosEntre, jogadoresDoHistorico };
