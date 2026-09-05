import { yt, parseMin } from "../lib/helpers.jsx";
import { STROKES } from "./strokes.js";
import { FISICO, FASES, REGRAS_FISICO } from "./fisico.js";
import { d, ativacao, regular, IRREGULARES, SISTEMAS, JOGOS_SOLO, saqueDiario,
  ADVERSARIOS, SETS_COMPLETOS, ROTINA_PREJOGO } from "./blocos.js";
import {
  Bot, GraduationCap, Trophy, Wind, Target, Layers, Zap, Users, Activity, Dumbbell, Flame
} from "lucide-react";

/* ============ TÉCNICA DO ACERVO COMO SESSÃO ============
   O acervo já traz exercícios estruturados; aqui eles viram blocos da linha do
   tempo, iguais aos de um padrão. Assim a técnica ganha cronômetro, contador e
   anotação sem nenhum componente novo de tela. */

/* O campo `robot` das técnicas é prosa ("Topspin 0 / Backspin 3-4 / Freq 2 /
   Oscilação OFF"). Onde ela casa com esse formato, vira painel do robô. Onde
   não casa — as técnicas em que está escrito que o robô NÃO produz aquela bola —
   devolve null, e o painel simplesmente não aparece. */
function dialsDaTecnica(texto) {
  if (!texto) return null;
  const num = (rot) => {
    const m = new RegExp(rot + "\\s+(\\d+)", "i").exec(texto);
    return m ? Number(m[1]) : null;
  };
  const ts = num("Topspin"), bs = num("Backspin"), fq = num("Freq");
  if (ts === null && bs === null) return null;
  const osc = /Oscila(?:ção|cao)\s+ON/i.test(texto) ? "ON" : "OFF";
  return { Topspin: ts ?? 0, Backspin: bs ?? 0, "Frequência": fq ?? 2, "Oscilação": osc };
}

/* Quanto dura um exercício, em segundos.
   "3 séries × 90 segundos" é exato. "3 séries × 10 bolas" não é: estimo 4 s por
   repetição (lançar, jogar, recuperar), que é o ritmo real de série no robô.
   "1 set" não tem duração previsível e fica sem cronômetro. */
function segundosDoExercicio(e) {
  const tempo = /(\d+)\s*(segundos?|s\b|minutos?|min)/i.exec(e.repet);
  if (tempo) {
    const n = Number(tempo[1]);
    return e.series * (/^s/i.test(tempo[2]) ? n : n * 60);
  }
  if (/\bsets?\b/i.test(e.repet)) return 0;
  const cont = /(\d+)/.exec(e.repet);
  return cont ? e.series * Number(cont[1]) * 4 : 0;
}

const emMinutos = (seg) => (seg >= 60 ? `${Math.round(seg / 60)} min` : `${seg} s`);

function sessaoTecnica(id, opcoes = {}) {
  const t = STROKES.find((x) => x.id === id);
  if (!t) return null;
  const escolhidos = opcoes.exercicios
    ? t.exercicios.filter((e) => opcoes.exercicios.includes(e.n))
    : t.exercicios;
  let segundos = 0;
  const blocks = escolhidos.map((e) => {
    const seg = segundosDoExercicio(e);
    segundos += seg + (seg ? e.series * 45 : 0);   // as pausas entre séries contam
    return {
      tag: e.tipo,
      label: e.nome,
      time: seg ? emMinutos(seg) : "—",
      target: `${e.series} séries × ${e.repet} — ${e.montagem}`,
      rest: "45 s",
      cue: `${e.cue} Meta: ${e.meta}`,
    };
  });
  const dials = dialsDaTecnica(t.robot);
  return {
    kind: "tecnica",
    slot: "T-" + t.id,
    title: t.name,
    sub: opcoes.sub || t.aka || t.cat,
    total: segundos ? `≈ ${Math.round(segundos / 60)} min` : "—",
    robot: !!dials,
    robotCfg: dials ? { title: t.name, pos: t.robot, dials } : null,
    counter: "acertos",
    tecnicaId: t.id,
    blocks,
  };
}

/* ============ ROBÔ — fallback por dia ============
   Cada sessão já traz a própria regulagem. Isto cobre o que sobrou. */
function robotFor(id) {
  if (id === "dom") return {
    title: "Aquecimento pré-campeonato",
    pos: "Centralizado, ritmo de jogo. Termine 20 min antes do primeiro jogo.",
    dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "ON" },
  };
  return null;
}

const somaMin = (blocks) => blocks.reduce((n, b) => n + (parseMin(b.time) || 0), 0);
const totalDe = (blocks) => `≈ ${Math.round(somaMin(blocks) / 60)} min`;

/* ============ SAQUE ============
   O saque deixou de ser um bloco semanal. Com mesa em casa ele virou hábito
   diário — 10 min todo dia dentro da sessão de sistemas, ~700 bolas por semana
   contra as ~200 do ciclo antigo. O que fica no sábado é o que só existe com
   gente do outro lado: alguém devolvendo e dizendo o efeito que leu. */
const SERVE_FOCUS = {
  1: "Par no-spin × backspin — o mesmo gesto, efeitos opostos",
  2: "Backspin curto: 1º quique no meio da sua metade",
  3: "No-spin: contato às 9h e a finalização falsa",
  4: "Teste do par — o parceiro canta o efeito antes de devolver",
  5: "Comprimento: curto que não sobra, longo rasante",
  6: "Saque + 3ª bola: o combo inteiro, não o saque solto",
  7: "Pendular lateral — e para onde a devolução volta",
  8: "Teste de terceira bola: quantas chegam ao ataque",
  9: "Disfarce: mesma altura, mesmo ritmo, contato diferente",
  10: "Variação de comprimento sem mudar o gesto",
  11: "Longo rápido como surpresa — duas vezes por set",
  12: "Teste final: repertório de jogo, só o que você usaria hoje",
};

function serveSession(week) {
  const foco = SERVE_FOCUS[week];
  const blocks = [
    { tag: "saque", label: "Aquecimento de punho", time: "3 min", rest: "—",
      target: "30 saques leves só de punho", cue: "Empunhadura 2/10. Solte a mão." },
    { tag: "saque", label: `Foco da semana: ${foco}`, time: "9 min", rest: "40 s",
      target: "60 bolas no mesmo alvo · séries de 10",
      cue: "Registre acertos por série na aba Saque." },
    { tag: "parceiro", label: "Ele devolve e canta o efeito", time: "10 min", rest: "—",
      target: "40 saques · depois de devolver, ele diz que efeito leu",
      cue: "É o único teste que existe do seu disfarce. Balde não responde. Se ele acerta o efeito em 8 de 10, o saque é honesto demais." },
    { tag: "parceiro", label: "Saque dele, recepção sua", time: "10 min", rest: "—",
      target: "40 saques dele, variando efeito e comprimento sem avisar",
      cue: "A habilidade que mais decide jogo é ler efeito de gente, e é a que menos dá para treinar sozinho. Este bloco é o mais caro da semana — não troque ele por nada." },
  ];
  return { kind: "saque", slot: "saque", title: "Saque e recepção com parceiro", sub: foco,
    total: totalDe(blocks), robot: false, counter: "acertos no alvo", blocks };
}

/* ============ CONSTRUTORES DE SESSÃO ============
   Cada dia da semana tem uma forma, e a forma é o que mudou de verdade em
   relação ao ciclo antigo. Antes: lista de exercícios. Agora: arco. */

/* Dia de carga e dia de qualidade — ativação, bloco regular, bloco irregular.
   `curto` encolhe o regular: da terça em diante o gesto já foi gravado na
   segunda, e o tempo vale mais no irregular. */
function sessaoMesa({ tecnica, irr, curto, semIrregular, titulo, sub }) {
  const t = tecnica ? STROKES.find((x) => x.id === tecnica) : null;
  const nome = t ? t.name : "gesto do dia";
  const I = IRREGULARES[irr];
  const dialsReg = (t && dialsDaTecnica(t.robot)) || d(2, 0, 3, false);

  /* Pegada, base, timing e deslocamento não são golpes: não existe "25 bolas de
     empunhadura". O que existe é bater drive enquanto se confere aquilo. Nesses
     casos o bloco regular vira um drive com a técnica como ponto de checagem —
     que é como um treinador conduziria, e evita um rótulo que não quer dizer
     nada na tela. */
  const suporte = t && (t.cat === "Base" || t.cat === "Deslocamento");
  const rotulo = suporte ? `Drive FH e BH — foco em ${nome.toLowerCase()}` : nome;
  const cueReg = suporte
    ? `A bola é drive comum; o que se treina é ${nome.toLowerCase()}. A cada série, pare e confira só esse detalhe — se ele escapou, a série não conta.`
    : null;

  const blocos = [
    ...ativacao(nome),
    { ...regular(rotulo, { ...dialsReg, "Oscilação": "OFF" }, cueReg), time: curto ? "10 min" : "13 min" },
  ];
  if (!semIrregular) blocos.push({ tag: "robô · osc ON", label: `Irregular — ${I.nome}`,
    time: I.time, rest: I.rest, target: I.target, dials: I.dials, cue: I.cue });
  return {
    kind: "mesa", slot: "mesa-" + irr, title: titulo, sub,
    total: totalDe(blocos), robot: true,
    robotCfg: { title: `Regular — ${rotulo}`, pos: "A regulagem muda entre o bloco regular e o irregular; cada bloco abaixo traz a sua.", dials: { ...dialsReg, "Oscilação": "OFF" } },
    counter: semIrregular ? "bolas boas no bloco regular" : I.contador, tecnicas: t ? [t.id] : null,
    blocks: blocos,
  };
}

/* Sistema + saque diário. É o card de maior transferência da semana: golpe
   solto não ganha ponto, sequência ganha. */
function sessaoSistema({ sist, week }) {
  const S = SISTEMAS[sist];
  const blocos = [
    { tag: "robô", label: S.nome, time: S.time, rest: S.rest,
      target: `${S.target} — ${S.montagem}`, dials: S.dials, passos: S.ciclo,
      cue: S.cue, limite: S.limite },
    saqueDiario(SERVE_FOCUS[week]),
  ];
  return {
    kind: "sistema", slot: sist, title: S.nome, sub: S.sub,
    total: totalDe(blocos), robot: true,
    robotCfg: { title: S.nome, pos: S.pos, dials: S.dials },
    counter: S.contador, blocks: blocos,
  };
}

/* Pontos + saque diário. Nenhum treino de segunda a sexta terminava com ponto
   jogado — sem placar, o erro não custa nada, e treino sem custo de erro não
   transfere para jogo. */
function sessaoPontos({ jogo, week }) {
  const J = JOGOS_SOLO[jogo];
  const blocos = [
    { tag: "jogo", label: J.nome, time: J.time, rest: J.rest,
      target: "Placar anotado no fim — é o dado que a aba Progresso desenha",
      dials: J.dials, passos: J.regras, cue: J.cue },
    saqueDiario(SERVE_FOCUS[week]),
  ];
  return {
    kind: "pontos", slot: jogo, title: J.nome, sub: J.sub,
    total: totalDe(blocos), robot: true,
    robotCfg: { title: J.nome, pos: "Regulagem de ritmo de jogo. O que muda aqui não é a bola, é a consequência do erro.", dials: J.dials },
    counter: J.contador, blocks: blocos,
  };
}

/* Academia. Sessão separada da mesa, com marcação própria — é trabalho de
   verdade e some se não for contado. */
function sessaoFisico(letra, blocoN) {
  const F = FISICO[letra];
  const fase = FASES[blocoN];
  const blocos = F.exercicios.map((e) => ({
    tag: "físico", label: e.nome, time: "—", rest: fase.descanso,
    target: e.dose[blocoN], cue: e.cue,
  }));
  return {
    kind: "fisico", slot: "fisico-" + letra, title: `Físico ${letra} · ${F.nome}`,
    sub: `${F.sub} · fase ${fase.nome.toLowerCase()}`, total: F.total, robot: false,
    porque: F.porque, regraFase: `${fase.nome}: ${fase.regra}`, regras: REGRAS_FISICO,
    blocks: blocos,
  };
}

/* Quinta-feira. O dia leve do meio da semana — e leve é planejado, não é folga.
   Cinco dias "Alta" seguidos não é treino profissional, é o jeito mais rápido
   de estagnar e de se machucar. Aqui a sombra volta a valer: sem a pressa da
   bola, é onde o gesto se conserta. */
function sessaoCorrecao(tecnicas) {
  const nomes = tecnicas.map((t) => t.name).join(" · ");
  const blocos = [
    ...ativacao(tecnicas[0] ? tecnicas[0].name : "gesto da semana"),
    { tag: "sombra", label: "Correção lenta", time: "10 min", rest: "30 s",
      target: `4 × 2 min alternando: ${nomes}`,
      cue: "Metade da velocidade de jogo. Você está procurando o erro, não repetindo o acerto." },
    { tag: "robô", label: "Só o trecho que estava errado", time: "12 min", rest: "45 s",
      target: "4 séries × 20 bolas · frequência 1 abaixo do normal",
      dials: d(2, 0, 2, false),
      cue: "Bola lenta de propósito. Se o gesto só sai certo devagar, ele ainda não está pronto — e insistir rápido grava o errado." },
    { tag: "estudo", label: "Gravar e mandar para análise", time: "6 min", rest: "—",
      target: "6 a 8 repetições de UMA técnica, slow motion, câmera lateral",
      cue: "Abra a técnica na aba Golpes, copie o prompt de análise e mande o vídeo. A resposta guia a segunda-feira seguinte." },
  ];
  return { kind: "tecnica", slot: "correcao", title: "Correção e vídeo", sub: "dia leve do meio da semana",
    total: totalDe(blocos), robot: true,
    robotCfg: { title: "Correção", pos: "Frequência baixa. Hoje a bola é ferramenta de conserto, não de treino.", dials: d(2, 0, 2, false) },
    blocks: blocos };
}

/* Domingo. Sete dias por semana só funciona se um deles for quase nada. */
function sessaoLeve(tecnicas) {
  const nomes = tecnicas.map((t) => t.name).join(" · ");
  const blocos = [
    { tag: "sombra", label: "Mobilidade e soltura", time: "8 min", rest: "—",
      target: "Corda 2 min + mobilidade de ombro, quadril e coluna torácica",
      cue: "Soltar, não cansar. Se suou muito, passou do ponto." },
    { tag: "sombra", label: "Sombra da semana", time: "12 min", rest: "30 s",
      target: `3 × 2 min alternando: ${nomes}`,
      cue: "Devagar e correto. É o único treino da semana sem nenhuma pressa." },
    { tag: "estudo", label: "Fechar a semana", time: "8 min", rest: "—",
      target: "Reler as anotações dos 6 dias e escrever UMA frase: o que muda na semana que vem",
      cue: "Ciclo sem revisão é calendário, não é treino." },
  ];
  return { kind: "tecnica", slot: "leve", title: "Sombra e revisão", sub: "dia leve — o que fecha a semana",
    total: totalDe(blocos), robot: false, blocks: blocos };
}

/* Sábado. O único dia com outra pessoa, e por isso o único que recebe o que o
   robô não entrega: efeito de verdade para ler e ponto disputado. */
const JOGO_TREINO = (() => {
  const blocos = [
    { tag: "jogo", label: "Sets valendo, com uma regra", time: "25 min", rest: "—",
      target: "3 sets contra o parceiro",
      passos: [
        "Todo ponto começa com o **seu sistema de saque + 3ª bola** — o mesmo que você treinou segunda.",
        "Contra bola cortada, **só abertura**, nunca push. Perder ponto abrindo vale mais que ganhar empurrando.",
        "No 9-9, joga como no bloco de deuce: **sete bolas na mesa antes de tentar qualquer coisa**.",
      ],
      cue: "Escolha UMA regra por set. Ganhar é secundário — o que conta é a regra ter sido cumprida, porque é ela que leva o treino da semana para dentro do jogo." },
    { tag: "jogo", label: "Set livre e anotação", time: "12 min", rest: "—",
      target: "1 set sem regra nenhuma + 3 minutos anotando",
      cue: "Sem regra, para ver o que sai sozinho. Anote: quantos pontos vieram do saque, quantas 3ªs bolas você atacou, onde perdeu mais. Esses três números são o seu jogo." },
  ];
  return { kind: "treino", slot: "jogotreino", title: "Jogo-treino com regra", sub: "onde o treino da semana vira jogo",
    total: totalDe(blocos), robot: false, counter: "sets com a regra cumprida", blocks: blocos };
})();

/* A bateria de teste, na sexta das semanas 4, 8 e 12. Os cinco primeiros itens
   são idênticos aos do ciclo antigo — comparar só funciona se a medida não
   mudar. Os dois últimos são novos porque medem o que agora se treina. */
function sessaoTeste(week) {
  const blocos = [
    { tag: "saque", label: "1 · Saque curto backspin", time: "6 min", rest: "—",
      target: "20 saques na zona 1", cue: "Conte quantos ficam curtos E baixos. Linha de corte: 12 de 20." },
    { tag: "robô", label: "2 · Abertura contra cortada", time: "9 min", rest: "45 s",
      target: "6 séries × 8 bolas", dials: d(0, 4, 2, false),
      cue: "Conte as que passam com efeito. Linha de corte: 24 de 48." },
    { tag: "robô", label: "3 · Consistência sob incerteza", time: "7 min", rest: "60 s",
      target: "Melhor sequência", dials: d(3, 0, 4, true),
      cue: "Errou, recomeça do zero. Linha de corte: 25 seguidas." },
    { tag: "robô", label: "4 · Falkenberg", time: "6 min", rest: "60 s",
      target: "Voltas limpas em 2 min", dials: d(2, 0, 3, true),
      cue: "Conta só o que voltou ao centro entre as bolas." },
    { tag: "robô", label: "5 · Forehand drive seguidas", time: "5 min", rest: "—",
      target: "Série livre", dials: d(3, 0, 4, false), cue: "O recorde da série. Linha de corte: 40." },
    { tag: "robô", label: "6 · Saque + 3ª bola", time: "8 min", rest: "60 s",
      target: "5 séries × 8 ciclos", dials: d(2, 0, 1, true),
      cue: "Conte quantas 3ªs bolas você chegou a atacar de verdade. Linha de corte: 24 de 40." },
    { tag: "jogo", label: "7 · Set contra o robô", time: "8 min", rest: "—",
      target: "Um set até 11, ponto = 5 bolas seguidas", dials: d(3, 0, 4, true),
      cue: "Anote o placar. É a única medida do ciclo que tem consequência de erro embutida." },
    { tag: "estudo", label: "Anotar e comparar", time: "5 min", rest: "—",
      target: "Os 7 números, no campo de anotações abaixo",
      cue: "Compare com a última semana de teste. O que não subiu vira o foco do bloco seguinte." },
  ];
  return { kind: "tecnica", slot: "teste", title: `Bateria de teste · semana ${week}`,
    sub: "a mesma medida das outras semanas de teste", total: totalDe(blocos), robot: true,
    robotCfg: { title: "Bateria de teste", pos: "Cada item tem a sua regulagem — está no bloco.", dials: d(0, 4, 2, false) },
    counter: "itens acima da linha de corte", blocks: blocos };
}

/* ============ O CICLO DE 12 SEMANAS ============
   Três blocos de quatro semanas. O esqueleto da semana é o mesmo nas 12 e é
   periodizado — carga, qualidade, carga, regenerativo, simulação, parceiro,
   leve. Cinco dias "Alta" seguidos, como no ciclo antigo, não é treino
   profissional: é o jeito mais rápido de estagnar.

   Em cada dia: `t` é o índice na lista de técnicas da semana, `irr` o bloco
   irregular, `sist` o sistema, `jogo` o jogo pontuado, `fis` a sessão de
   academia, `pad` o padrão de jogo (sexta). */
const BLOCOS = [
  {
    n: 1, nome: "Base", cor: "#1E5A8A",
    lema: "Consertar o que sustenta o resto",
    semanas: {
      1: { titulo: "Os fundamentos invisíveis", nota: "Pegada, base e timing. Nada de arma ainda — arma sobre base torta grava o erro.", tecnicas: ["grip", "stance", "timing", "split-step"] },
      2: { titulo: "Os pés antes do golpe", nota: "Deslocamento em todas as direções. O golpe perfeito com os pés errados não existe.", tecnicas: ["footwork", "cross-step", "in-out", "pivo"] },
      3: { titulo: "As duas batidas", nota: "Forehand e backhand drive até virarem automáticos, mais o bloqueio.", tecnicas: ["fh-drive", "bh-drive", "block"] },
      4: { titulo: "Jogo curto · semana de teste", nota: "Push e toque curto. Volume menor: re-meça a bateria e compare com a semana 1.", teste: true, tecnicas: ["push-bh", "push-fh", "toque-curto", "push-longo"] },
    },
    dias: {
      seg: { t: 0, irr: "irr-escolha", sist: "sist-saque3", fis: "A" },
      ter: { t: 1, irr: "irr-fh", jogo: "js-set5", curto: true },
      qua: { t: 2, irr: "irr-bh", sist: "sist-rec4", fis: "B" },
      qui: { correcao: [0, 1, 2] },
      sex: { advs: { 1: "adv-empurra", 2: "adv-previsivel", 3: "adv-bh" }, fis: "C" },
    },
  },
  {
    n: 2, nome: "Armas", cor: "#FF7A29",
    lema: "O que ganha ponto",
    semanas: {
      5: { titulo: "A abertura", nota: "Topspin contra bola cortada. É o golpe que transforma defesa em ataque.", tecnicas: ["fh-loop", "fh-loop-slow", "fh-loop-power"] },
      6: { titulo: "As marchas do ataque", nota: "Abrir é uma coisa, acelerar é outra. Aqui entram as duas e o efeito lateral.", tecnicas: ["fh-loop-power", "loop-lateral", "smash"] },
      7: { titulo: "O backhand ataca", nota: "O lado esquerdo deixa de só bloquear.", tecnicas: ["bh-loop", "bh-punch", "block-ativo"] },
      8: { titulo: "Recepção agressiva · semana de teste", nota: "Flick e banana. Re-meça: abertura, smash e o saque + 3ª bola.", teste: true, tecnicas: ["flick", "banana", "flick-fh"] },
    },
    dias: {
      seg: { t: 0, irr: "irr-fh", sist: "sist-saque3", fis: "A" },
      ter: { t: 1, irr: "irr-final", jogo: "js-prazo", curto: true },
      qua: { t: 2, irr: "irr-bh", sist: "sist-saque3", fis: "B" },
      qui: { correcao: [0, 1, 2] },
      sex: { advs: { 5: "adv-ataca", 6: "adv-empurra", 7: "adv-canhoto" }, fis: "C" },
    },
  },
  {
    n: 3, nome: "Jogo", cor: "#7A4FE0",
    lema: "Integrar e aguentar pressão",
    semanas: {
      9: { titulo: "Ler antes de tocar", nota: "Leitura de efeito e devolução. Em torneio, todo ponto começa com um saque que você nunca viu.", tecnicas: ["ler-efeito", "rec-curto", "rec-longo"] },
      10: { titulo: "Contra quem ataca primeiro", nota: "Contra-topspin e bloqueio ativo — parar de só sobreviver quando ele abre.", tecnicas: ["fh-counterloop", "bh-counterloop", "block-ativo"] },
      11: { titulo: "Quando o ponto foge", nota: "As bolas que te mantêm vivo longe da mesa, e como devolver o efeito invertido.", tecnicas: ["block-lateral", "chop-block", "lob", "fish"] },
      12: { titulo: "Material estranho · semana de teste", nota: "Borracha longa e anti — os estilos que decidem estreia. Re-meça a bateria inteira.", teste: true, tecnicas: ["pips-contra", "anti", "rec-lateral", "rec-meio"] },
    },
    dias: {
      seg: { t: 0, irr: "irr-final", sist: "sist-bloqueio", fis: "A" },
      ter: { t: 1, irr: "irr-sobrevive", jogo: "js-prazo", curto: true },
      qua: { t: 2, irr: "irr-bh", sist: "sist-rec4", fis: "B" },
      qui: { correcao: [0, 1, 2] },
      sex: { advs: { 9: "adv-ataca", 10: "adv-bh", 11: "adv-canhoto" }, fis: "C" },
    },
  },
];

const blocoDaSemana = (week) => BLOCOS.find((b) => b.semanas[week]) || BLOCOS[0];
const semanaInfo = (week) => blocoDaSemana(week).semanas[week] || BLOCOS[0].semanas[1];
const tecDaSemana = (tecs, i) => tecs[i % tecs.length];

function sessionsFor(id, week) {
  const bloco = blocoDaSemana(week);
  const info = semanaInfo(week);
  const tecs = info.tecnicas;
  const objs = (idx) => idx.map((i) => STROKES.find((s) => s.id === tecDaSemana(tecs, i))).filter(Boolean);

  if (id === "sab") return [serveSession(week), JOGO_TREINO];
  if (id === "dom") return [sessaoLeve(objs([0, 1, 2]))];

  const r = (info.dias && info.dias[id]) || bloco.dias[id];
  if (!r) return [];
  /* A sexta gira os cinco arquétipos ao longo do ciclo: cada semana enfrenta um
     adversário diferente, e nenhum aparece duas vezes no mesmo bloco. */
  if (r.advs) r.adv = r.advs[week];

  /* Semana de teste: a sexta vira a bateria e a academia sai da semana — medir
     cansado mede o cansaço. Nos outros dias sai o bloco irregular, que é o mais
     fatigante; o regular e o sistema ficam. Dá uma queda de ~25% no volume, que
     é taper de verdade. Cortar mais faria a semana de teste virar semana
     perdida, e cortar menos faria "semana de teste" ser só um rótulo. */
  const teste = !!info.teste;

  if (id === "sex") {
    if (teste) return [sessaoTeste(week)];
    const out = [sessaoAdversario(r.adv), sessaoSets(week)];
    if (r.fis) out.push(sessaoFisico(r.fis, bloco.n));
    return out;
  }

  if (r.correcao) return [sessaoCorrecao(objs(r.correcao)), sessaoPontos({ jogo: "js-set5", week })];

  const out = [sessaoMesa({
    tecnica: tecDaSemana(tecs, r.t), irr: r.irr, curto: r.curto, semIrregular: teste,
    titulo: "Mesa · " + (teste ? "taper" : r.curto ? "qualidade" : "carga"),
    sub: teste ? "semana de teste — volume reduzido" : r.curto ? "menos volume, mais intensidade" : "o bloco pesado da semana",
  })];
  out.push(r.sist ? sessaoSistema({ sist: r.sist, week }) : sessaoPontos({ jogo: r.jogo, week }));
  if (r.fis && !teste) out.push(sessaoFisico(r.fis, bloco.n));
  return out;
}

/* Sexta é véspera de sábado, então é o dia de jogo simulado — não mais um dia
   de exercício. Dois cards: o adversário da semana (arquétipo da aba Táticas
   virando regulagem e regra de execução) e sets completos com placar. */
function sessaoAdversario(advId) {
  const A = ADVERSARIOS[advId];
  const blocos = [
    ...ROTINA_PREJOGO,
    { tag: "robô", label: `Contra: ${A.tipo}`, time: A.time, rest: A.rest,
      target: `${A.target} — REGRA: ${A.regra}`, dials: A.dials, passos: A.plano, cue: A.cue },
  ];
  return {
    kind: "adversario", slot: advId, title: "O adversário da semana", sub: A.tipo,
    total: totalDe(blocos), robot: true,
    robotCfg: { title: A.tipo, pos: A.pos, dials: A.dials },
    porque: `A fraqueza dele: ${A.fraqueza}`,
    counter: A.contador, tecnicas: A.tecnicas, blocks: blocos,
  };
}

function sessaoSets(week) {
  const S = SETS_COMPLETOS;
  const blocos = [
    { tag: "jogo", label: S.nome, time: S.time, rest: S.rest,
      target: S.target, dials: S.dials, passos: S.regras, cue: S.cue },
    saqueDiario(SERVE_FOCUS[week]),
  ];
  return {
    kind: "pontos", slot: "sets", title: S.nome, sub: S.sub,
    total: totalDe(blocos), robot: true,
    robotCfg: { title: S.nome, pos: S.pos, dials: S.dials },
    counter: S.contador, blocks: blocos,
  };
}

const KIND_META = {
  mesa: { icon: Bot, color: "#FF7A29", label: "Mesa" },
  adversario: { icon: Users, color: "#7A4FE0", label: "Adversário" },
  sistema: { icon: Zap, color: "#0E8B8B", label: "Sistema" },
  pontos: { icon: Trophy, color: "#D6A324", label: "Pontos" },
  fisico: { icon: Dumbbell, color: "#B4472F", label: "Físico" },
  tecnica: { icon: Target, color: "#1E5A8A", label: "Técnica" },
  saque: { icon: Wind, color: "#2FA36B", label: "Saque" },
  treino: { icon: Users, color: "#1C6F63", label: "Jogo-treino" },
  aula: { icon: GraduationCap, color: "#7A4FE0", label: "Aula" },
  jogo: { icon: Trophy, color: "#D6A324", label: "Jogo" },
};

function isDayDone(done, week, id) {
  const ss = sessionsFor(id, week);
  return ss.length > 0 && ss.every(s => done[`w${week}-${id}-${s.slot || s.kind}`]);
}

const SEM_AULA = [
  "Sábado é o único dia com parceiro — gaste ele no que o robô não faz.",
  "**Peça para ele sacar variando e cantar o efeito depois que você devolveu.** Ler efeito de gente é a habilidade que mais decide jogo e a que menos dá para treinar sozinho.",
  "Se a aula voltar, ela entra aqui ou substitui a quinta. O pedido para o professor continua o mesmo: **“me manda cortada e topspin alternados sem avisar”**.",
];

/* ============ DIAS ============
   A semana é periodizada: 3 dias de carga, 1 de qualidade, 1 regenerativo,
   1 de jogo, 1 leve. A intensidade é uma decisão, não um acidente. */
const DAYS = [
  { id: "seg", short: "Seg", name: "Segunda", icon: Target, focus: "Carga · técnica nova + saque e 3ª bola", total: "≈ 70 min + academia", tint: "#1E5A8A", intensity: "Alta", gym: true,
    checklist: ["O dia mais pesado da semana — comece com a cabeça descansada", "O bloco regular é curto de propósito: 150 bolas boas, não 400 no automático", "O sistema de saque + 3ª bola é o bloco de maior transferência para o jogo. Não pule", "Academia depois da mesa, nunca antes"],
    videos: [["Serve and third ball attack", yt("table tennis serve and third ball attack drill")]] },

  { id: "ter", short: "Ter", name: "Terça", icon: Zap, focus: "Qualidade · menos volume, mais intensidade", total: "≈ 62 min", tint: "#FF7A29", intensity: "Alta",
    checklist: ["Volume menor que segunda, intensidade maior — não é um dia fácil, é um dia curto", "O regular encolhe: o gesto já foi gravado ontem", "Termina com placar. Errar hoje custa ponto"],
    videos: [["Random drills", yt("table tennis irregular random drill training")]] },

  { id: "qua", short: "Qua", name: "Quarta", icon: Layers, focus: "Carga · segundo golpe da semana + recepção", total: "≈ 68 min + academia", tint: "#1E5A8A", intensity: "Alta", gym: true,
    checklist: ["Segunda técnica da semana, e o irregular vai para o lado do backhand", "Recepção + 4ª bola: recepção não é devolver, é escolher — e toda escolha tem uma bola seguinte", "Academia B é a sessão de potência e de ombro. O face pull não é opcional"],
    videos: [["Receive and 4th ball", yt("table tennis receive and fourth ball drill")]] },

  { id: "qui", short: "Qui", name: "Quinta", icon: Activity, focus: "Regenerativo · correção lenta e vídeo", total: "≈ 58 min", tint: "#0E8B8B", intensity: "Leve",
    checklist: ["Dia leve de propósito: cinco dias 'Alta' seguidos estagnam e machucam", "Bola lenta, meia velocidade — hoje você procura o erro, não repete o acerto", "Grave UMA técnica e mande para o prompt de análise da aba Golpes"],
    videos: [["Aprendizado motor e prática lenta", yt("motor learning slow practice table tennis")]] },

  { id: "sex", short: "Sex", name: "Sexta", icon: Flame, focus: "Simulação · situações de jogo + pontos sob pressão", total: "≈ 62 min + academia", tint: "#FF7A29", intensity: "Alta", gym: true,
    checklist: ["Nada de técnica nova: hoje é usar o que a semana construiu dentro de uma situação", "Se o gesto novo sumir sob pressão do padrão, ele ainda não está pronto — volte a ele na segunda", "Os pontos de sexta são o ensaio do sábado"],
    videos: [["Transferir técnica para o jogo", yt("table tennis transfer drills to match play")]] },

  { id: "sab", short: "Sáb", name: "Sábado", icon: Users, focus: "O único dia com parceiro · saque real e jogo", total: "≈ 70 min", tint: "#2FA36B", intensity: "Jogo", serveDay: true, star: true,
    checklist: ["Balde montado antes de começar", "Peça para ele cantar o efeito do seu saque — é o teste que o balde sozinho não faz", "Receber saque de gente é a habilidade que menos dá para treinar sozinho: 10 minutos disso valem uma semana de robô", "Anote os três números: pontos do saque, 3ªs bolas atacadas, onde perdeu mais"],
    semAula: SEM_AULA,
    videos: [["No-spin vs backspin serve", yt("no spin serve vs backspin serve table tennis")], ["Jogo com restrição", yt("table tennis constraint based training games")]] },

  { id: "dom", short: "Dom", name: "Domingo", icon: Activity, focus: "Leve · sombra e revisão da semana", total: "≈ 28 min", tint: "#D6A324", intensity: "Leve",
    checklist: ["Leve é planejado, não é folga: sem ele a semana 6 em diante vira arrasto", "Releia as anotações dos seis dias antes de fechar", "Uma frase só: o que muda na semana que vem"],
    videos: [["Shadow play", yt("table tennis shadow practice technique")]] },
];

/* Uma entrada por semana do ciclo, derivada dos blocos — não há duas listas de
   semanas para sair de sincronia. */
const WEEK_INFO = BLOCOS.flatMap((b) =>
  Object.entries(b.semanas).map(([n, s]) => ({
    n: Number(n), title: s.titulo, note: s.nota, bloco: b.n, blocoNome: b.nome, cor: b.cor, teste: !!s.teste,
  }))
).sort((a, b) => a.n - b.n);

export {
  robotFor, SERVE_FOCUS, serveSession, sessionsFor, KIND_META, isDayDone, DAYS, WEEK_INFO,
  sessaoTecnica, BLOCOS, blocoDaSemana, semanaInfo, IRREGULARES, SISTEMAS, JOGOS_SOLO, ADVERSARIOS,
};
