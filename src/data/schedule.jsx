import { yt } from "../lib/helpers.jsx";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";

/* ============ ROBÔ por dia/semana ============ */
function robotFor(id, week) {
  const F = week <= 2 ? 3 : 4;
  switch (id) {
    case "seg": return { title: "Forehand drive — regularidade", pos: "Linha de fundo, ~15 cm à esquerda do centro, mirando sua diagonal de FH.", dials: { Topspin: 3, Backspin: 0, "Frequência": F, "Oscilação": week === 4 ? "ON" : "OFF" } };
    case "ter": return { title: "Aquecimento pré-aula — FH + BH", pos: "Centralizado na linha de fundo. 15 min antes de sair para a aula.", dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "OFF" } };
    case "qua": return week <= 2
      ? { shadow: true, why: "Nas semanas 1–2 o topspin contra backspin é treinado em SOMBRA (sem bola) para gravar o gesto. O robô volta na semana 3.", extra: { title: "Regularidade leve (fim do bloco)", dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "OFF" } } }
      : { title: "Topspin de FH contra bola cortada", pos: "Linha de fundo, diagonal de FH, bola caindo no meio da sua metade.", dials: { Topspin: 0, Backspin: week === 3 ? 3 : 4, "Frequência": 2, "Oscilação": "OFF" } };
    case "qui": return { title: "Aquecimento pré-aula — BH + transição", pos: "Centralizado. Solte o braço antes da aula.", dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "OFF" } };
    case "sex": return { title: "Backhand drive + transição FH/BH", pos: "Bloco A: diagonal de BH. Bloco B: centralizado com oscilação.", dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "OFF" }, blockB: week >= 2 ? { Topspin: 3, Backspin: 0, "Frequência": week === 4 ? 4 : 3, "Oscilação": "ON" } : null };
    case "sab": return { title: "Reação, bloqueio rápido e footwork", pos: "Centralizado. Frequência alta + oscilação: você reage e se desloca.", dials: { Topspin: 2, Backspin: 0, "Frequência": week <= 2 ? 5 : 6, "Oscilação": "ON" } };
    case "dom": return { title: "Aquecimento pré-campeonato", pos: "Centralizado, ritmo de jogo. Termine 20 min antes do primeiro jogo.", dials: { Topspin: 2, Backspin: 0, "Frequência": 3, "Oscilação": "ON" } };
    default: return null;
  }
}

/* ============ SESSÕES SEPARADAS POR DIA ============ */
const SERVE_FOCUS = { 1: "Pendular backspin — efeito e comprimento curto", 2: "Pendular lateral entra; alterne com o backspin",
  3: "No-spin: o par do backspin, mesmo gesto", 4: "Disfarce completo + teste da câmera" };

function serveSession(week, short) {
  const foco = SERVE_FOCUS[week];
  if (short) return { kind: "saque", title: "Treino de Saque", sub: "revisão pré-jogo", total: "≈ 12 min", robot: false, blocks: [
    { tag: "saque", label: "Aquecimento de punho", time: "3 min", target: "20 saques leves, sem força", rest: "—", cue: "Empunhadura 2/10." },
    { tag: "saque", label: "Revisão dos saques confiáveis", time: "9 min", target: "30 saques: 10 backspin curto, 10 lateral, 10 do seu par de disfarce", rest: "—", cue: "Só o que já funciona. Campeonato não é dia de experimentar." },
  ] };
  return { kind: "saque", title: "Treino de Saque", sub: foco, total: "≈ 32 min", robot: false, blocks: [
    { tag: "saque", label: "Montar a estação", time: "3 min", target: "40–60 bolas no balde · 2 garrafas nas zonas 1 e 2 · toalha a 40 cm da rede", rest: "—", cue: "Sem balde de bolas, treino de saque não existe." },
    { tag: "saque", label: "Aquecimento de punho", time: "3 min", target: "30 saques leves só de punho", rest: "—", cue: "Empunhadura 2/10. Solte a mão." },
    { tag: "saque", label: `Foco: ${foco}`, time: "12 min", target: "50 bolas no mesmo alvo · séries de 10", rest: "40 s entre séries", cue: "Registre acertos por série no registro da aba Saque." },
    { tag: "saque", label: "Comprimento — curto × longo", time: "6 min", target: "20 bolas: alterne 1 curto e 1 longo", rest: "—", cue: "Curto: 1º quique no meio da sua metade. Longo: perto da sua linha de fundo." },
    { tag: "saque", label: week >= 3 ? "Disfarce — mesmo movimento" : "Precisão nas zonas 1 e 2", time: "6 min", target: week >= 3 ? "20 bolas alternando 2 efeitos com gesto idêntico" : "20 bolas: 10 na zona 1, 10 na zona 2", rest: "—", cue: "Critério: dois quiques na metade dele." },
    { tag: "saque", label: "Alvo sob pressão", time: "2 min", target: "10 saques na garrafa · uma tentativa cada", rest: "—", cue: "Registre o resultado na aba Saque." },
  ] };
}

function sessionsFor(id, week) {
  const meta = { 1: "20", 2: "30", 3: "40", 4: "40" }[week];
  const metaBH = { 1: "20", 2: "25", 3: "30", 4: "30" }[week];

  if (id === "seg") return [
    { kind: "robo", title: "Treino no Robô", sub: "Forehand drive", total: "≈ 38 min", robot: true, counter: "FH seguidos", blocks: [
      { tag: "sem robô", label: "Aquecimento", time: "6 min", target: "Corda 2 min + sombra de FH 3 × 1 min", rest: "20 s", cue: "Sinta a cadeia perna → quadril → braço." },
      { tag: "robô", label: "Regularidade — FH fixo", time: "14 min", target: "4 séries de ~2,5 min (~80 bolas/série)", rest: "60 s", cue: `Meta: ${meta} bolas seguidas na mesa.` },
      { tag: "robô", label: "Blocos de contagem", time: "10 min", target: "5 séries · conte quantas seguidas até errar", rest: "45 s", cue: "Use o contador deste card." },
      { tag: "robô", label: week >= 2 ? "Direção do golpe" : "Regularidade extra", time: "8 min", target: week >= 2 ? "4 séries × 2 min · alterne diagonal e paralela" : "4 séries × 2 min", rest: "45 s", cue: week >= 2 ? "A direção vem do ângulo da raquete." : "Semana 1: gesto limpo, sem pressa." },
    ]},
    { kind: "fisico", title: "Treino Físico", sub: "Footwork e força de pernas", total: "≈ 24 min", robot: false, blocks: [
      { tag: "físico", label: "Escada de coordenação", time: "10 min", target: "2 pés / in-in-out-out / Icky Shuffle · 3 passadas cada", rest: "30 s", cue: "Ponta dos pés, joelhos flexionados." },
      { tag: "físico", label: "Cones em X", time: "6 min", target: "4 voltas completas", rest: "30 s", cue: "Side-step sem cruzar os pés, postura de jogo." },
      { tag: "físico", label: "Força de base", time: "8 min", target: "Agachamento 3×12 · afundo 3×10/perna · panturrilha 3×15", rest: "45 s", cue: "" },
    ]},
  ];

  if (id === "ter" || id === "qui") {
    const isTer = id === "ter";
    return [
      { kind: "robo", title: "Aquecimento no Robô", sub: "antes da aula", total: "15 min", robot: true, blocks: [
        { tag: "robô", label: isTer ? "Aquecimento FH + BH" : "Aquecimento BH + transição", time: "15 min",
          target: isTer ? "FH 2 × 3 min + BH 2 × 3 min" : "BH 3 × 3 min + transição 2 × 2 min", rest: "45 s",
          cue: isTer ? "Ache o timing. Chegue na aula já quente." : "Cotovelo à frente como eixo. Pés antes do golpe." },
      ]},
      { kind: "aula", title: "Aula com o Professor", sub: isTer ? "primeira aula da semana" : "segunda aula da semana", total: "60 min", robot: false, blocks: [
        { tag: "aula", label: "Aula completa", time: "60 min",
          target: isTer ? "Fundamento da semana + bloqueio ativo + correções ao vivo" : "Correção do BH + 10 min de recepção de saque",
          rest: "—", cue: isTer ? "Peça para ele checar a cadeia cinética. Filme 1 série de FH e 1 de BH." : "Leve as dúvidas do treino de saque — ele lê seu efeito melhor que ninguém." },
      ]},
    ];
  }

  if (id === "qua") return [
    serveSession(week),
    { kind: "robo", title: "Treino no Robô", sub: "Topspin de FH vs backspin", total: week <= 2 ? "≈ 30 min" : "≈ 32 min", robot: true, counter: "topspins bons",
      blocks: week <= 2
        ? [ { tag: "sem robô", label: "Aquecimento + gesto", time: "6 min", target: "Corda 2 min + 10 sombras do topspin", rest: "—", cue: "" },
            { tag: "sombra", label: "Gesto do topspin vs backspin", time: "16 min", target: "5 séries × 15 repetições", rest: "40 s", cue: "Raquete desce ao joelho direito → sobe em diagonal → termina acima da cabeça." },
            { tag: "sombra", label: "Gesto + transferência de peso", time: "8 min", target: "4 séries × 12 repetições", rest: "40 s", cue: "70% na perna direita → explode para a esquerda." } ]
        : [ { tag: "sem robô", label: "Aquecimento + gesto", time: "6 min", target: "Corda 2 min + 10 sombras do topspin", rest: "—", cue: "" },
            { tag: "robô · freq 2", label: "Topspin isolado vs backspin", time: "16 min", target: "6 séries × 8 bolas (~48 bolas)", rest: "45 s", cue: `Contato FINO, pincelada. Meta: ${week === 3 ? "6 de 8" : "8 de 8"} com efeito.` },
            { tag: "robô · freq 2", label: "Séries de qualidade", time: "10 min", target: "5 séries × 10 bolas · conte as que caem na mesa", rest: "45 s", cue: "Na rede → abra mais e suba. Longa → contato mais fino." } ]},
  ];

  if (id === "sex") return [
    { kind: "robo", title: "Treino no Robô", sub: "Backhand + transição", total: "≈ 42 min", robot: true, counter: "BH / transições", blocks: [
      { tag: "sem robô", label: "Aquecimento", time: "6 min", target: "Corda 2 min + sombra de BH 3 × 1 min", rest: "20 s", cue: "Abra o antebraço tipo leque, cotovelo como eixo." },
      { tag: "robô", label: "Regularidade — BH fixo", time: "14 min", target: "4 séries de ~2,5 min (~80 bolas/série)", rest: "60 s", cue: `Bola na frente do abdômen. Meta: ${metaBH} seguidas.` },
      { tag: "robô", label: "Contagem de BH", time: "8 min", target: "4 séries · máximo de bolas seguidas", rest: "45 s", cue: "Registre no contador deste card." },
      week >= 2
        ? { tag: "robô · osc ON", label: "Transição FH ↔ BH (Bloco B)", time: "14 min", target: "5 séries × 2 min · robô alterna os lados", rest: "60 s", cue: `Pés primeiro, golpe depois. Meta: ${week === 2 ? "10" : "15"} transições limpas.` }
        : { tag: "robô", label: "Consistência extra de BH", time: "14 min", target: "5 séries × 2 min", rest: "60 s", cue: "Semana 1 sem oscilação — firme o gesto." },
    ]},
    serveSession(week),
  ];

  if (id === "sab") return [
    { kind: "robo", title: "Treino no Robô", sub: "Reação e bloqueio rápido", total: "≈ 34 min", robot: true, blocks: [
      { tag: "sem robô", label: "Aquecimento", time: "5 min", target: "Corda 2 min + mobilidade de punhos e ombros", rest: "—", cue: "" },
      { tag: "robô · osc ON", label: "Bloqueio rápido de reação", time: "12 min", target: "5 séries × 2 min em frequência alta", rest: "60 s", cue: "Raquete pronta na frente do corpo. Reaja com os olhos." },
      { tag: "robô · osc ON", label: "Footwork com bola — 3 pontos", time: "10 min", target: "4 séries × 2 min (canto FH / meio / canto BH)", rest: "60 s", cue: "Volte ao centro após cada bola." },
      { tag: "robô · osc ON", label: "Contra-ataque reativo", time: "7 min", target: "3 séries × 2 min", rest: "60 s", cue: "Devolva com intenção, sem antecipar o lado." },
    ]},
    { kind: "fisico", title: "Treino Físico", sub: "Reflexo e core", total: "≈ 20 min", robot: false, blocks: [
      { tag: "físico", label: "Parede com bola de tênis", time: "8 min", target: "4 séries × 45 s", rest: "20 s", cue: "Jogue com uma mão, pegue com a outra." },
      { tag: "físico", label: "Reaction ball", time: "5 min", target: "3 séries × 45 s", rest: "20 s", cue: "Quique imprevisível, reaja sem antecipar." },
      { tag: "físico", label: "Core", time: "7 min", target: "Prancha 3 × 40 s + prancha lateral 2 × 30 s/lado", rest: "40 s", cue: "" },
    ]},
  ];

  if (id === "dom") return [
    { kind: "robo", title: "Aquecimento no Robô", sub: "pré-campeonato", total: "≈ 18 min", robot: true, blocks: [
      { tag: "sem robô", label: "Ativação", time: "6 min", target: "Corda 2 min + mobilidade + 20 sombras leves", rest: "—", cue: "Suar levemente, sem fadiga." },
      { tag: "robô", label: "Aquecimento de jogo", time: "12 min", target: "FH 2 × 2 min + BH 2 × 2 min + oscilação 2 × 2 min", rest: "45 s", cue: "Ritmo de partida. Pare enquanto ainda está bom." },
    ]},
    serveSession(week, true),
    { kind: "jogo", title: "Campeonato Amador", sub: "dia de jogo", total: "—", robot: false, blocks: [
      { tag: "jogo", label: "Partidas", time: "—", target: "Jogue! Depois registre cada partida na aba Jogos", rest: "—", cue: "Anote qual saque rendeu ponto e onde você errou mais." },
    ]},
  ];

  return [];
}

const KIND_META = {
  robo: { icon: Bot, color: "#F26B21", label: "Robô" },
  saque: { icon: Wind, color: "#2FA36B", label: "Saque" },
  fisico: { icon: Gauge, color: "#1E5A8A", label: "Físico" },
  aula: { icon: GraduationCap, color: "#7C5CFC", label: "Aula" },
  jogo: { icon: Trophy, color: "#E0A800", label: "Jogo" },
};

function isDayDone(done, week, id) {
  const ss = sessionsFor(id, week);
  return ss.length > 0 && ss.every(s => done[`w${week}-${id}-${s.kind}`]);
}

/* ============ DIAS ============ */
const DAYS = [
  { id: "seg", short: "Seg", name: "Segunda", icon: Bot, focus: "Robô (forehand) + físico", total: "≈ 62 min", tint: "#F26B21", intensity: "Alta",
    bio: { title: "Forehand Drive", steps: [
      "Base: pés mais que a largura dos ombros, pé direito meio passo atrás. Joelhos ~120°, 60% do peso na ponta dos pés.",
      "Preparação: gire quadril e ombro ~45° à direita pelo giro do tronco. Raquete na altura da cintura.",
      "Golpe: quadril inicia a rotação à esquerda → tronco → braço acelera à frente e para cima. Cotovelo 90–110°.",
      "Contato: topo do quique, à frente do quadril direito. Raquete fechada (~45–60°).",
      "Finalização: raquete na altura do nariz/testa. Peso na perna esquerda. Volte à base." ] },
    videos: [["Forehand drive — PingSkills", yt("forehand drive table tennis PingSkills")], ["Counterhit slow motion", yt("forehand counterhit slow motion table tennis")]] },

  { id: "ter", short: "Ter", name: "Terça", icon: GraduationCap, focus: "Aula + aquecimento no robô", total: "75 min", tint: "#7C5CFC", intensity: "Alta", lesson: true,
    checklist: ["Empunhadura relaxada (pressão 3/10), raquete alinhada ao antebraço", "Joelhos flexionados, peso na ponta dos pés", "Ajustar os pés ANTES de bater", "Voltar à base após cada golpe"],
    videos: [["Erros de empunhadura shakehand", yt("Tom Lodziak shakehand grip mistakes")]] },

  { id: "qua", short: "Qua", name: "Quarta", icon: Wind, focus: "Saque + robô (topspin)", total: "≈ 64 min", tint: "#2FA36B", intensity: "Alta", star: true, serveDay: true,
    bio: { title: "Topspin de FH contra backspin", steps: [
      "Base: pés bem afastados, pé direito atrás. Joelhos ~110° — 'sente' no golpe.",
      "Preparação: gire quadril + ombro à direita e deixe a raquete DESCER até a altura do joelho direito. Peso ~70% na perna direita.",
      "Timing: bata no topo do quique ou no início da descida — nunca na subida.",
      "Golpe: empurre o chão com a perna direita → quadril explode → braço sobe em diagonal (~60–70°).",
      "Ângulo: raquete MAIS ABERTA (~70–80°), quase vertical.",
      "Contato FINO (pincelada) na traseira/superior da bola. Sinta raspar, não socar.",
      "Finalização: raquete acima da cabeça, perto da testa esquerda. Recupere a base em 1 s." ],
      note: "Erro nº 1: usar só o braço e mandar na rede. Na rede → abra mais e suba. Longa → contato mais fino." },
    videos: [["Topspin vs backspin — PingSkills", yt("forehand topspin against backspin PingSkills")], ["Hugo Calderano slow motion", yt("Hugo Calderano forehand topspin slow motion")]] },

  { id: "qui", short: "Qui", name: "Quinta", icon: GraduationCap, focus: "Aula + aquecimento no robô", total: "75 min", tint: "#7C5CFC", intensity: "Alta", lesson: true,
    checklist: ["Leve as dúvidas do treino de saque de quarta", "Peça 10 min de recepção de saque", "Filme 1 série de BH para revisar"],
    videos: [["Recepção de saque", yt("how to return serves table tennis PingSkills")]] },

  { id: "sex", short: "Sex", name: "Sexta", icon: Bot, focus: "Robô (backhand) + saque", total: "≈ 74 min", tint: "#F26B21", intensity: "Média", serveDay: true,
    bio: { title: "Backhand Drive", steps: [
      "Base: de frente para a mesa, pés quase paralelos, joelhos flexionados. A bola vem na frente do abdômen.",
      "Preparação: raquete na frente do corpo, altura do umbigo. O cotovelo é o eixo — quase não se move.",
      "Golpe: antebraço abre à frente e para cima, como abrir um leque.",
      "Contato: topo do quique, NA FRENTE do corpo. Raquete levemente fechada.",
      "Finalização: raquete aponta ao alvo, altura do peito. Movimento curto e compacto." ],
      note: "Transição FH/BH: o side-step vem ANTES do golpe. Pés primeiro, bater depois." },
    videos: [["Backhand drive — PingSkills", yt("backhand drive table tennis PingSkills")], ["Transição FH/BH", yt("table tennis FH BH transition footwork drill")]] },

  { id: "sab", short: "Sáb", name: "Sábado", icon: Gauge, focus: "Robô (reação) + físico", total: "≈ 54 min", tint: "#1E5A8A", intensity: "Média",
    videos: [["Robô — bloqueio rápido", yt("table tennis robot block drill")], ["Parede — reação", yt("tennis ball wall reaction drill")]] },

  { id: "dom", short: "Dom", name: "Domingo", icon: Trophy, focus: "Aquecimento + saque + campeonato", total: "≈ 30 min + jogos", tint: "#E0A800", intensity: "Jogo", matchDay: true, serveDay: true,
    matchNotes: [
      "Aqueça de leve e pare ANTES de cansar — o campeonato é o esforço do dia.",
      "Escolha 2 saques confiáveis e um terceiro só como surpresa. Não estreie saque novo em jogo.",
      "Depois dos jogos, registre a partida na aba Jogos: saque que rendeu ponto e onde errou mais.",
      "Hidrate-se entre partidas e mantenha as pernas ativas.",
    ],
    videos: [["Táticas simples de jogo", yt("table tennis basic tactics for beginners")]] },
];

const WEEK_INFO = [
  { n: 1, title: "Empunhadura, postura e FH parado", note: "Robô lento, sem oscilação. Saque: pendular backspin." },
  { n: 2, title: "BH drive + consistência", note: "Frequência sobe. Saque: pendular lateral entra." },
  { n: 3, title: "Topspin de FH vs. backspin", note: "Backspin 3 no robô. Saque: no-spin entra." },
  { n: 4, title: "Transição + disfarce de saque", note: "Oscilação ON. Saque: mesmo movimento, efeitos diferentes." },
];



export {
  robotFor, SERVE_FOCUS, serveSession, sessionsFor, KIND_META, isDayDone, DAYS, WEEK_INFO
};
