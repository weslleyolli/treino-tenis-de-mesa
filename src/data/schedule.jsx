import { yt } from "../lib/helpers.jsx";
import {
  Bot, GraduationCap, Trophy, Wind, Target, Layers, Zap, Users, Activity
} from "lucide-react";

/* ============================================================
   OS 6 PADRÕES
   Substituem os antigos blocos de regularidade solta. A ideia é treinar a
   sequência como ela aparece no jogo — saque, resposta esperada do adversário
   e a bola que você tem de resolver — em vez de 80 bolas no mesmo lugar.
   ============================================================ */
const PADROES = {
  P1: {
    id: "P1", nome: "No-spin → bola alta → finaliza", tag: "seu combo principal",
    dials: { Topspin: 2, Backspin: 0, "Frequência": 2, "Oscilação": "OFF" },
    pos: "Robô ajustado para bola mais alta e mole — é a sobra que o no-spin provoca.",
    total: "≈ 16 min", contador: "finalizações boas",
    blocks: [
      { tag: "saque", label: "Saque de verdade no balde", time: "4 min", target: "15 no-spins curtos no balde ao lado", rest: "—",
        cue: "É o saque que gera a bola alta. Treine o gesto real antes de virar para o robô." },
      { tag: "robô", label: "Finalização da bola alta", time: "12 min", target: "4 séries × 10 bolas", rest: "45 s",
        cue: "Finalize com 80%. A meta não é força: é acertar 8 de 10." },
    ],
  },
  P2: {
    id: "P2", nome: "Backspin → ele empurra → abertura", tag: "resolve o Henrique",
    dials: { Topspin: 0, Backspin: 3, "Frequência": 2, "Oscilação": "OFF" },
    pos: "Bola cortada caindo no meio da sua metade, diagonal de forehand.",
    total: "≈ 18 min", contador: "aberturas com efeito",
    blocks: [
      { tag: "sem robô", label: "Aquecimento e gesto", time: "4 min", target: "Corda 2 min + 10 sombras do slow loop", rest: "—",
        cue: "Raquete desce ao joelho direito, sobe em diagonal." },
      { tag: "robô · freq 2", label: "Slow loop — abertura", time: "14 min", target: "6 séries × 8 bolas", rest: "45 s",
        cue: "Raquete aberta 70–80°, arco alto, muita rotação e pouca velocidade. É abertura, não winner." },
    ],
  },
  P3: {
    id: "P3", nome: "Abertura → bloqueio dele volta → continuação", tag: "troca de marcha",
    dials: { Topspin: 4, Backspin: 0, "Frequência": 4, "Oscilação": "OFF" },
    pos: "Bola de bloqueio voltando rápida e baixa, na sua diagonal.",
    total: "≈ 16 min", contador: "sequências completas",
    blocks: [
      { tag: "robô · freq 4", label: "Abrir e continuar", time: "16 min", target: "5 séries × 2 min", rest: "60 s",
        cue: "A primeira bola você abre com arco; as seguintes ataca mais reto e rápido. Treina a troca de marcha entre abrir e continuar — o que mais falta no amador." },
    ],
  },
  P4: {
    id: "P4", nome: "Pressão no backhand → ele gira → pune a paralela", tag: "Caio e Aleykson",
    dials: { Topspin: 2, Backspin: 0, "Frequência": 4, "Oscilação": "ON" },
    pos: "Oscilação ligada: o robô alterna os cantos e você escolhe a direção.",
    total: "≈ 16 min", contador: "paralelas certeiras",
    blocks: [
      { tag: "robô · osc ON", label: "3 no canto + 1 na paralela", time: "16 min", target: "5 séries × 2 min", rest: "60 s",
        cue: "Regra: 3 bolas seguidas no mesmo canto, depois 1 rápida na paralela oposta. Repete. É exatamente o xadrez que abre os dois." },
    ],
  },
  P5: {
    id: "P5", nome: "Recepção agressiva — flick", tag: "sai da recepção passiva",
    dials: { Topspin: 0, Backspin: 2, "Frequência": 2, "Oscilação": "OFF" },
    pos: "Robô mirando curto, bola caindo perto da rede na sua metade.",
    total: "≈ 14 min", contador: "flicks na mesa",
    blocks: [
      { tag: "sem robô", label: "Gesto do flick", time: "3 min", target: "15 sombras: entrada de pé direito + punho", rest: "—",
        cue: "Movimento curto. O punho é quem gera, não o braço." },
      { tag: "robô · curto", label: "Flick de recepção", time: "11 min", target: "4 séries × 10 bolas", rest: "45 s",
        cue: "Entra com o pé direito, punho carregado, movimento curto." },
    ],
  },
  P6: {
    id: "P6", nome: "Ponto decisivo", tag: "consistência sob pressão",
    dials: { Topspin: 3, Backspin: 0, "Frequência": 4, "Oscilação": "ON" },
    pos: "Ritmo de jogo com oscilação. Você não sabe o lado — como no 9-9.",
    total: "≈ 15 min", contador: "recorde de bolas seguidas",
    blocks: [
      { tag: "robô · osc ON", label: "Série do 9-9", time: "15 min", target: "5 séries · conte bolas seguidas na mesa", rest: "60 s",
        cue: "Imagine 9-9. Se errar, recomeça do zero. Meta: 25 seguidas. Sem tentar vencedor — é o treino que você usa contra o Caio no deuce." },
    ],
  },
  P7: {
    id: "P7", nome: "Footwork com bola — Falkenberg", tag: "o que mais separa nível",
    dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "ON" },
    pos: "Oscilação entre os dois cantos. Você se desloca, o robô não facilita.",
    total: "≈ 18 min", contador: "voltas limpas",
    blocks: [
      { tag: "sem robô", label: "Side-step sem bola", time: "4 min", target: "3 séries × 40 s de side-step entre os cantos", rest: "30 s",
        cue: "O pé do lado do deslocamento sai primeiro. Nunca cruze os pés." },
      { tag: "robô · osc ON", label: "Falkenberg", time: "14 min", target: "5 séries × 2 min", rest: "60 s",
        cue: "BH no canto de BH → contorne e ataque de FH do mesmo canto → FH no canto de FH. Volte ao centro depois de cada bola: a recuperação é o que separa nível, não o golpe." },
    ],
  },
  P8: {
    id: "P8", nome: "Recepção — decidir antes de tocar", tag: "sair do automático",
    dials: { Topspin: 0, Backspin: 2, "Frequência": 2, "Oscilação": "OFF" },
    pos: "Robô mirando curto, bola cortada perto da rede.",
    total: "≈ 14 min", contador: "decisões certas",
    blocks: [
      { tag: "robô · curto", label: "Três respostas, você escolhe", time: "14 min", target: "5 séries × 8 bolas", rest: "45 s",
        cue: "A cada bola escolha: push curto, push longo no canto, ou flick. Regra: não repita a mesma resposta duas vezes seguidas. A bola é sempre igual — quem varia é você. É o ensaio da decisão, que é o que falta na recepção." },
    ],
  },
};

/* Transforma um padrão em sessão. O `slot` mantém a chave de conclusão única
   quando o dia tem dois padrões — sem ele, marcar um marcaria o outro. */
function sessaoPadrao(p, comAquecimento) {
  const blocks = comAquecimento && p.blocks[0].tag !== "sem robô"
    ? [{ tag: "sem robô", label: "Aquecimento", time: "5 min", target: "Corda 2 min + sombra 3 × 1 min", rest: "20 s",
        cue: "Sinta a cadeia perna → quadril → braço." }, ...p.blocks]
    : p.blocks;
  return {
    kind: "robo", slot: p.id, title: `${p.id} · ${p.nome}`, sub: p.tag,
    total: p.total, robot: true, counter: p.contador,
    robotCfg: { title: `${p.id} · ${p.nome}`, pos: p.pos, dials: p.dials },
    blocks,
  };
}

/* ============ ROBÔ — fallback por dia ============
   Cada padrão já traz a própria regulagem em `robotCfg`. Isto cobre as sessões
   que não são padrão (aquecimento de domingo). */
function robotFor(id) {
  if (id === "dom") return {
    title: "Aquecimento pré-campeonato",
    pos: "Centralizado, ritmo de jogo. Termine 20 min antes do primeiro jogo.",
    dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "ON" },
  };
  return null;
}

/* ============ SAQUE ============
   Fase de manutenção, não de aprendizado: o repertório já está em 78%. O foco
   rotaciona pelo que decide jogo — disfarce, comprimento e os pares. */
const SERVE_FOCUS = {
  1: "Par no-spin × backspin — o mesmo gesto, efeitos opostos",
  2: "Comprimento: curto que não sobra, longo rasante",
  3: "Pendular lateral e o reverso — abrir os dois lados",
  4: "Disfarce completo + conferência na câmera",
};

function serveSession(week, short) {
  const foco = SERVE_FOCUS[week];
  if (short) return { kind: "saque", slot: "saque", title: "Revisão de Saque", sub: "pré-jogo", total: "≈ 12 min", robot: false, blocks: [
    { tag: "saque", label: "Aquecimento de punho", time: "3 min", target: "20 saques leves, sem força", rest: "—", cue: "Empunhadura 2/10." },
    { tag: "saque", label: "Revisão dos saques confiáveis", time: "9 min", target: "30 saques: 10 backspin curto, 10 lateral, 10 do seu par de disfarce", rest: "—", cue: "Só o que já funciona. Campeonato não é dia de experimentar." },
  ] };
  return { kind: "saque", slot: "saque", title: "Treino de Saque", sub: foco, total: "≈ 30 min", robot: false, blocks: [
    { tag: "saque", label: "Montar a estação", time: "3 min", target: "40–60 bolas no balde · 2 garrafas nas zonas 1 e 2 · toalha a 40 cm da rede", rest: "—", cue: "Sem balde de bolas, treino de saque não existe." },
    { tag: "saque", label: "Aquecimento de punho", time: "3 min", target: "30 saques leves só de punho", rest: "—", cue: "Empunhadura 2/10. Solte a mão." },
    { tag: "saque", label: `Foco: ${foco}`, time: "12 min", target: "50 bolas no mesmo alvo · séries de 10", rest: "40 s", cue: "Registre acertos por série no registro da aba Saque." },
    { tag: "saque", label: "Comprimento — curto × longo", time: "6 min", target: "20 bolas: alterne 1 curto e 1 longo", rest: "—", cue: "Curto: 1º quique no meio da sua metade. Longo: perto da sua linha de fundo." },
    { tag: "saque", label: "Alvo sob pressão", time: "6 min", target: "20 saques na garrafa · uma tentativa cada", rest: "—", cue: "Registre o resultado na aba Saque." },
  ] };
}

/* ============ SESSÕES POR DIA ============ */
/* Sem robô e sem parceiro não existe: é o treino que transfere padrão para jogo. */
const JOGO_TREINO = { kind: "treino", slot: "jogotreino", title: "Jogo com regra", sub: "ensaio do domingo", total: "≈ 25 min", robot: false, blocks: [
  { tag: "jogo", label: "Sets valendo, com uma regra", time: "25 min", target: "3 sets contra um parceiro", rest: "—",
    cue: "Escolha UMA regra por set: (1) todo ponto começa com o saque do P1; (2) contra bola cortada, só abertura do P2, nunca push; (3) no 9-9 imaginário, joga o P6. Ganhar é secundário — o que conta é a regra ter sido cumprida." },
] };

function sessionsFor(id, week) {
  const P = PADROES;
  switch (id) {
    case "seg": return [sessaoPadrao(P.P2, true), sessaoPadrao(P.P3), sessaoPadrao(P.P7)];
    case "ter": return [serveSession(week), sessaoPadrao(P.P1)];
    case "qua": return [sessaoPadrao(P.P4, true), sessaoPadrao(P.P6), sessaoPadrao(P.P8)];
    case "qui": return [serveSession(week), sessaoPadrao(P.P5)];
    case "sex": return [sessaoPadrao(P.P2, true), sessaoPadrao(P.P4), sessaoPadrao(P.P7)];
    case "sab": return [sessaoPadrao(P.P3, true), sessaoPadrao(P.P6), serveSession(week, true), JOGO_TREINO];
    case "dom": return [
      { kind: "robo", slot: "aquecimento", title: "Aquecimento leve", sub: "pré-campeonato", total: "≈ 18 min", robot: true, blocks: [
        { tag: "sem robô", label: "Ativação", time: "6 min", target: "Corda 2 min + mobilidade + 20 sombras leves", rest: "—", cue: "Suar levemente, sem fadiga." },
        { tag: "robô", label: "Aquecimento de jogo", time: "12 min", target: "FH 2 × 2 min + BH 2 × 2 min + oscilação 2 × 2 min", rest: "45 s", cue: "Ritmo de partida. Pare enquanto ainda está bom." },
      ] },
      serveSession(week, true),
      { kind: "jogo", slot: "jogo", title: "Campeonato", sub: "dia de jogo", total: "—", robot: false, blocks: [
        { tag: "jogo", label: "Partidas", time: "—", target: "Jogue! Depois registre cada partida na aba Jogos", rest: "—", cue: "Anote qual saque rendeu ponto e onde você errou mais." },
      ] },
    ];
    default: return [];
  }
}

const KIND_META = {
  robo: { icon: Bot, color: "#FF7A29", label: "Padrão" },
  saque: { icon: Wind, color: "#2FA36B", label: "Saque" },
  treino: { icon: Users, color: "#1C6F63", label: "Jogo-treino" },
  aula: { icon: GraduationCap, color: "#7A4FE0", label: "Aula" },
  jogo: { icon: Trophy, color: "#D6A324", label: "Jogo" },
};

function isDayDone(done, week, id) {
  const ss = sessionsFor(id, week);
  return ss.length > 0 && ss.every(s => done[`w${week}-${id}-${s.slot || s.kind}`]);
}

/* Nota que aparece em terça e quinta: hoje esses dias são saque + padrão
   porque você está sem aula. Quando a aula voltar, eles mudam. */
const SEM_AULA = [
  "Enquanto você está sem aula, terça e quinta ficam com saque + um padrão.",
  "Quando a aula voltar, esses dois dias viram **aula + 15 min de aquecimento** no robô, e o padrão do dia sai.",
  "O pedido para o professor é específico: **“me manda cortada e topspin alternados sem avisar”** — é a única coisa que o robô não faz e que você precisa.",
];

/* ============ DIAS ============ */
const DAYS = [
  { id: "seg", short: "Seg", name: "Segunda", icon: Target, focus: "P2 + P3 + P7 · abertura, continuação e pés", total: "≈ 52 min", tint: "#FF7A29", intensity: "Alta",
    bio: { title: "Abertura contra bola cortada (P2)", steps: [
      "Base: pés bem afastados, pé direito atrás. Joelhos ~110° — 'sente' no golpe.",
      "Preparação: gire quadril e ombro à direita e deixe a raquete **descer até a altura do joelho direito**. Peso ~70% na perna direita.",
      "Timing: bata no topo do quique ou no início da descida — nunca na subida.",
      "Ângulo: raquete **aberta 70–80°**, quase vertical. É o que levanta a bola cortada.",
      "Contato **fino**, pincelada na traseira/superior. Muita rotação, pouca velocidade.",
      "Finalização: raquete acima da cabeça. Recupere a base em 1 s — o P3 começa aqui." ],
      note: "Abertura não é winner. A bola que decide é a seguinte, quando o bloqueio dele volta." },
    videos: [["Topspin vs backspin — PingSkills", yt("forehand topspin against backspin PingSkills")], ["Slow loop contra backspin", yt("table tennis slow loop against backspin")]] },

  { id: "ter", short: "Ter", name: "Terça", icon: Wind, focus: "Saque (30 min) + P1", total: "≈ 46 min", tint: "#2FA36B", intensity: "Alta", serveDay: true, star: true,
    checklist: ["Balde montado antes de começar", "O no-spin do P1 é o mesmo gesto do backspin", "Filme 1 série de saque para conferir o disfarce"],
    semAula: SEM_AULA,
    videos: [["No-spin vs backspin serve", yt("no spin serve vs backspin serve table tennis")], ["Como finalizar bola alta", yt("table tennis how to smash high ball")]] },

  { id: "qua", short: "Qua", name: "Quarta", icon: Layers, focus: "P4 + P6 + P8 · xadrez, pressão e recepção", total: "≈ 50 min", tint: "#7A4FE0", intensity: "Alta",
    bio: { title: "Pressão no backhand e punição na paralela (P4)", steps: [
      "Três bolas seguidas no **mesmo canto**: você está construindo, não atacando ainda.",
      "Repare no momento em que ele **gira o corpo** para cobrir aquele canto — é o gatilho.",
      "A quarta bola vai **rápida na paralela oposta**, no espaço que ele acabou de abrir.",
      "Direção vem do **ângulo da raquete no contato**, não de um movimento diferente. Se o gesto mudar, ele lê.",
      "Volte ao centro imediatamente: se ele alcançar, a bola volta no seu lado aberto." ],
      note: "É exatamente o xadrez que abre o Caio e o Aleykson. Os dois giram cedo demais." },
    videos: [["Padrão de jogo — canto e paralela", yt("table tennis playing patterns wide backhand then down the line")]] },

  { id: "qui", short: "Qui", name: "Quinta", icon: Wind, focus: "Saque + P5 · flick", total: "≈ 44 min", tint: "#2FA36B", intensity: "Média", serveDay: true,
    checklist: ["O flick é prioridade 4 — um dia por semana basta", "Entrada de pé direito antes do punho", "Se estiver errando muito, volte ao push e tente na próxima série"],
    semAula: SEM_AULA,
    videos: [["Backhand flick", yt("backhand flick table tennis tutorial")], ["Flick em câmera lenta", yt("table tennis banana flick slow motion")]] },

  { id: "sex", short: "Sex", name: "Sexta", icon: Target, focus: "P2 + P4 + P7 · padrões e pés", total: "≈ 55 min", tint: "#FF7A29", intensity: "Alta",
    checklist: ["P2 de novo na semana: a abertura é o que resolve o Henrique", "No P4, conte quantas paralelas realmente passaram", "No P7, o que conta é voltar ao centro, não o golpe"],
    videos: [["Slow loop contra backspin", yt("table tennis slow loop against backspin")]] },

  { id: "sab", short: "Sáb", name: "Sábado", icon: Zap, focus: "P3 + P6 + saque + jogo-treino", total: "≈ 68 min", tint: "#1C6F63", intensity: "Média", serveDay: true,
    checklist: ["Sábado é ensaio do domingo: nada novo", "No P6, anote o recorde de bolas seguidas", "Revisão de saque só com o que já funciona", "No jogo-treino, cumprir a regra vale mais que ganhar o set"],
    videos: [["Consistência sob pressão", yt("table tennis consistency drill under pressure")]] },

  { id: "dom", short: "Dom", name: "Domingo", icon: Trophy, focus: "Aquecimento leve + campeonato", total: "≈ 30 min + jogos", tint: "#D6A324", intensity: "Jogo", matchDay: true, serveDay: true,
    matchNotes: [
      "Aqueça de leve e pare ANTES de cansar — o campeonato é o esforço do dia.",
      "Escolha 2 saques confiáveis e um terceiro só como surpresa. Não estreie saque novo em jogo.",
      "Contra o Henrique: backspin e abra (P2). Contra Caio e Aleykson: pressão no BH e pune a paralela (P4).",
      "No deuce, jogue o P6: bola na mesa, sem tentar vencedor.",
      "Depois dos jogos, registre a partida na aba Jogos: saque que rendeu ponto e onde errou mais.",
    ],
    videos: [["Táticas simples de jogo", yt("table tennis basic tactics for beginners")]] },
];

const WEEK_INFO = [
  { n: 1, title: "Instalar os padrões", note: "Acerte a sequência antes da velocidade. Saque: par no-spin × backspin." },
  { n: 2, title: "Velocidade na continuação", note: "P3 mais reto e rápido a partir da 2ª bola. Saque: comprimento." },
  { n: 3, title: "Xadrez sob pressão", note: "P4 com o gesto idêntico nas duas direções. Saque: lateral e reverso." },
  { n: 4, title: "Ensaio de campeonato", note: "P6 valendo, meta de 25 seguidas. Saque: disfarce completo." },
];

export {
  robotFor, SERVE_FOCUS, serveSession, sessionsFor, KIND_META, isDayDone, DAYS, WEEK_INFO, PADROES,
};
