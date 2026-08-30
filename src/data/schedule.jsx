import { yt } from "../lib/helpers.jsx";
import { GUIAS } from "./guias.js";
import { STROKES } from "./strokes.js";
import {
  Bot, GraduationCap, Trophy, Wind, Target, Layers, Zap, Users, Activity, Dumbbell
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
    guia: GUIAS[p.id],
    blocks,
  };
}

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
   Um dia por semana, no sábado — o único dia com parceiro. Saque sozinho no
   balde é metade do treino; a outra metade é alguém devolvendo, e é isso que
   diz se o disfarce funciona. O foco acompanha o bloco: no bloco 1 se constrói
   o par principal, no 2 o comprimento e a terceira bola, no 3 o disfarce e a
   variação sob pressão. */
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

/* Domingo. Sete dias por semana só funciona se um deles for leve de propósito —
   sem isso a semana 6 em diante vira arrasto e a técnica piora junto. Carga
   quase zero, aprendizado alto: sombra do que foi treinado e o vídeo que
   alimenta o prompt de análise da aba Golpes. */
function sessaoLeve(tecnicas) {
  const nomes = tecnicas.map((t) => t.name).join(" · ");
  return {
    kind: "tecnica", slot: "leve", title: "Sombra e vídeo", sub: "dia leve — o que fecha o ciclo",
    total: "≈ 25 min", robot: false, blocks: [
      { tag: "sombra", label: "Mobilidade e soltura", time: "5 min", target: "Corda 2 min + mobilidade de ombro e quadril", rest: "—",
        cue: "Soltar, não cansar. Se suou muito, passou do ponto." },
      { tag: "sombra", label: "Sombra das técnicas da semana", time: "12 min", target: `3 × 2 min alternando: ${nomes}`, rest: "30 s",
        cue: "Devagar e correto vale mais que rápido. Sombra é onde o gesto se corrige sem a pressa da bola." },
      { tag: "estudo", label: "Gravar e mandar para análise", time: "8 min", target: "6 a 8 repetições de UMA técnica, slow motion, câmera lateral", rest: "—",
        cue: "Abra a técnica na aba Golpes, copie o prompt em 'Analisar meu vídeo com IA' e mande o vídeo. Escolha a repetição mais representativa, não a melhor." },
    ],
  };
}

/* A bateria de teste, na sexta das semanas 4, 8 e 12. Sempre a mesma, sempre na
   mesma ordem — comparar só funciona se a medida não mudar. É ela que responde
   "estou evoluindo?" com número em vez de sensação. */
function sessaoTeste(week) {
  return {
    kind: "tecnica", slot: "teste", title: `Bateria de teste · semana ${week}`, sub: "a mesma medida das outras semanas de teste",
    total: "≈ 40 min", robot: true,
    robotCfg: { title: "Bateria de teste", pos: "Ajuste conforme cada item — as regulagens estão em cada bloco.",
      dials: { Topspin: 0, Backspin: 3, "Frequência": 2, "Oscilação": "OFF" } },
    counter: "itens acima da linha de corte",
    blocks: [
      { tag: "saque", label: "1 · Saque curto backspin", time: "6 min", target: "20 saques na zona 1", rest: "—",
        cue: "Conte quantos ficam curtos E baixos. Linha de corte: 12 de 20." },
      { tag: "robô", label: "2 · Abertura contra cortada", time: "10 min", target: "6 séries × 8 bolas · Backspin 3-4, Freq 2", rest: "45 s",
        cue: "Conte as que passam com efeito. Linha de corte: 24 de 48." },
      { tag: "robô", label: "3 · Consistência (P6)", time: "8 min", target: "Melhor sequência · Topspin 3, Freq 4, Oscilação ON", rest: "60 s",
        cue: "Errou, recomeça do zero. Linha de corte: 25 seguidas." },
      { tag: "robô", label: "4 · Falkenberg (P7)", time: "6 min", target: "Voltas limpas em 2 min · Freq 3-4, Oscilação ON", rest: "60 s",
        cue: "Conta só o que voltou ao centro entre as bolas." },
      { tag: "robô", label: "5 · Forehand drive seguidas", time: "6 min", target: "Série livre · Topspin 3, Freq 3-4", rest: "—",
        cue: "O recorde da série. Linha de corte: 40." },
      { tag: "estudo", label: "Anotar e comparar", time: "4 min", target: "Os 5 números, no campo de anotações abaixo", rest: "—",
        cue: "Compare com a última semana de teste. O que não subiu vira o foco do bloco seguinte." },
    ],
  };
}

/* ============ O CICLO DE 12 SEMANAS ============
   Três blocos de quatro semanas. Cada bloco tem os padrões que sustentam o seu
   tema e uma lista de técnicas do acervo por semana; o esqueleto dos dias é o
   mesmo nas 12, o que muda é o conteúdo.

   Na lista de cada dia: {p} é padrão, {t} é índice na lista de técnicas daquela
   semana, `ex` recorta quais exercícios entram (revisita curta em vez da técnica
   inteira). A quarta semana de cada bloco é de teste: volume menor e re-medição.

   Cada técnica aparece DUAS vezes na semana, em dias separados — repetição
   espaçada grava melhor que uma dose só. */
const BLOCOS = [
  {
    n: 1, nome: "Base", cor: "#1E5A8A",
    lema: "Consertar o que sustenta o resto",
    semanas: {
      1: { titulo: "Os fundamentos invisíveis", nota: "Pegada, base e timing. Nada de arma ainda — arma sobre base torta grava o erro.", tecnicas: ["grip", "stance", "timing", "split-step"] },
      2: { titulo: "Os pés antes do golpe", nota: "Deslocamento em todas as direções. O golpe perfeito com os pés errados não existe.", tecnicas: ["footwork", "cross-step", "in-out", "pivo"] },
      /* Esta semana carrega as três técnicas mais longas do acervo (28, 28 e 30
         min). No template do bloco, a segunda ficaria com 74 min. Aqui a semana
         sobrescreve o template: uma batida por dia, em vez de duas empilhadas. */
      3: { titulo: "As duas batidas", nota: "Forehand e backhand drive até virarem automáticos, mais o bloqueio.", tecnicas: ["fh-drive", "bh-drive", "block"],
        dias: {
          seg: [{ t: 0 }, { p: "P7" }],
          ter: [{ p: "P6" }, { t: 0, ex: [2, 3] }],
          qua: [{ t: 1 }, { p: "P8" }],
          qui: [{ t: 2, ex: [1, 2, 3] }, { t: 1, ex: [2, 3] }],
          sex: [{ p: "P6" }, { p: "P8" }],
        } },
      4: { titulo: "Jogo curto · semana de teste", nota: "Push e toque curto. Volume menor: re-meça a bateria e compare com a semana 1.", teste: true, tecnicas: ["push-bh", "push-fh", "toque-curto", "push-longo"] },
    },
    dias: {
      seg: [{ t: 0 }, { t: 1 }, { p: "P7" }],
      ter: [{ p: "P6" }, { t: 0, ex: [2, 3] }],
      qua: [{ t: 2 }, { t: 3 }, { p: "P8" }],
      qui: [{ t: 1, ex: [2, 3] }, { t: 2, ex: [1, 2] }, { p: "P7" }],
      sex: [{ p: "P6" }, { p: "P8" }],
    },
  },
  {
    n: 2, nome: "Armas", cor: "#FF7A29",
    lema: "O que ganha ponto",
    semanas: {
      5: { titulo: "A abertura", nota: "Topspin contra bola cortada. É o golpe que transforma defesa em ataque.", tecnicas: ["fh-loop", "fh-loop-slow"] },
      6: { titulo: "As marchas do ataque", nota: "Abrir é uma coisa, acelerar é outra. Aqui entram as duas e o efeito lateral.", tecnicas: ["fh-loop-power", "loop-lateral", "smash"] },
      7: { titulo: "O backhand ataca", nota: "O lado esquerdo deixa de só bloquear.", tecnicas: ["bh-loop", "bh-punch"] },
      8: { titulo: "Recepção agressiva · semana de teste", nota: "Flick e banana. Re-meça: abertura, smash e o combo do no-spin.", teste: true, tecnicas: ["flick", "banana", "flick-fh"] },
    },
    dias: {
      seg: [{ t: 0 }, { p: "P2" }],
      ter: [{ p: "P1" }, { t: 1 }],
      qua: [{ t: 0, ex: [2, 3] }, { t: 1, ex: [2, 3] }, { p: "P3" }],
      qui: [{ t: 2 }, { p: "P5" }],
      sex: [{ p: "P2" }, { p: "P3" }],
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
      seg: [{ t: 0 }, { t: 1 }, { p: "P4" }],
      ter: [{ p: "P6" }, { t: 0, ex: [2, 3] }],
      qua: [{ t: 2 }, { p: "P8" }, { p: "P4" }],
      qui: [{ t: 1, ex: [2, 3] }, { t: 2, ex: [1, 2] }, { p: "P6" }],
      sex: [{ p: "P4" }, { p: "P8" }],
    },
  },
];

const blocoDaSemana = (week) => BLOCOS.find((b) => b.semanas[week]) || BLOCOS[0];
const semanaInfo = (week) => blocoDaSemana(week).semanas[week] || BLOCOS[0].semanas[1];

function sessionsFor(id, week) {
  const bloco = blocoDaSemana(week);
  const info = semanaInfo(week);
  const tecs = info.tecnicas;

  if (id === "sab") return [serveSession(week), JOGO_TREINO];
  if (id === "dom") return [sessaoLeve(tecs.map((t) => STROKES.find((s) => s.id === t)).filter(Boolean))];

  /* Semana de teste: a sexta vira a bateria, e os dias longos perdem o último
     item. Sem essa queda de volume, "semana de teste" seria só um rótulo — e
     medir cansado mede o cansaço, não a técnica. */
  /* Uma semana pode sobrescrever o template do bloco quando o conteúdo dela não
     cabe nele — ver a semana 3. */
  const receita = (info.dias && info.dias[id]) || bloco.dias[id] || [];

  if (info.teste) {
    if (id === "sex") return [sessaoTeste(week)];
    return montar(receita.slice(0, 2), tecs);
  }

  return montar(receita, tecs);
}

function montar(receita, tecs) {
  return receita.map((item, i) => {
    if (item.p) return sessaoPadrao(PADROES[item.p], i === 0);
    const tecId = tecs[item.t % tecs.length];
    return sessaoTecnica(tecId, item.ex ? { exercicios: item.ex, sub: "revisita" } : {});
  }).filter(Boolean);
}

const KIND_META = {
  robo: { icon: Bot, color: "#FF7A29", label: "Padrão" },
  tecnica: { icon: Dumbbell, color: "#1E5A8A", label: "Técnica" },
  saque: { icon: Wind, color: "#2FA36B", label: "Saque" },
  treino: { icon: Users, color: "#1C6F63", label: "Jogo-treino" },
  aula: { icon: GraduationCap, color: "#7A4FE0", label: "Aula" },
  jogo: { icon: Trophy, color: "#D6A324", label: "Jogo" },
};

function isDayDone(done, week, id) {
  const ss = sessionsFor(id, week);
  return ss.length > 0 && ss.every(s => done[`w${week}-${id}-${s.slot || s.kind}`]);
}

/* Aparece no sábado, o único dia com outra pessoa. O ciclo inteiro depende de
   usar bem essas duas horas, porque é o que o robô não entrega. */
const SEM_AULA = [
  "Sábado é o único dia com parceiro — gaste ele no que o robô não faz.",
  "**Peça para ele sacar variando e cantar o efeito depois que você devolveu.** Ler efeito de gente é a habilidade que mais decide jogo e a que menos dá para treinar sozinho.",
  "Se a aula voltar, ela entra aqui ou substitui um dia de técnica. O pedido para o professor continua o mesmo: **“me manda cortada e topspin alternados sem avisar”**.",
];

/* ============ DIAS ============ */
const DAYS = [
  { id: "seg", short: "Seg", name: "Segunda", icon: Target, focus: "Técnicas novas da semana + padrão", total: "≈ 50 min", tint: "#1E5A8A", intensity: "Alta",
    checklist: ["É o dia da técnica nova — cabeça descansada, gesto devagar", "Cada exercício tem meta: anote quantos saíram, não só que você fez", "A biomecânica completa está na aba Golpes, dentro da técnica"],
    videos: [["Como treinar técnica nova", yt("table tennis how to learn new technique deliberate practice")]] },

  { id: "ter", short: "Ter", name: "Terça", icon: Bot, focus: "Padrão do bloco + revisita da técnica", total: "≈ 40 min", tint: "#FF7A29", intensity: "Alta",
    checklist: ["O padrão vem primeiro, com a cabeça descansada", "A revisita é curta de propósito — dois exercícios, não a técnica inteira", "Se o gesto da segunda-feira não saiu, hoje é o dia de consertar"],
    videos: [["Consistência sob pressão", yt("table tennis consistency drill under pressure")]] },

  { id: "qua", short: "Qua", name: "Quarta", icon: Layers, focus: "Segunda leva de técnicas + padrão", total: "≈ 50 min", tint: "#1E5A8A", intensity: "Alta",
    checklist: ["As técnicas de hoje são diferentes das de segunda — a semana cobre quatro frentes", "Meta por exercício, sempre: sem denominador não há evolução", "Errou muito numa série? Baixe a frequência do robô em 1 antes de insistir"],
    videos: [["Como treinar técnica nova", yt("table tennis how to learn new technique deliberate practice")]] },

  { id: "qui", short: "Qui", name: "Quinta", icon: Activity, focus: "Revisitas + padrão · segunda dose da semana", total: "≈ 45 min", tint: "#0E8B8B", intensity: "Média",
    checklist: ["É a segunda dose das técnicas de segunda e quarta — repetição espaçada grava melhor que dose única", "Recortes curtos: o objetivo é lembrar o gesto, não cansar", "Se uma técnica já saiu automática, troque o tempo dela por mais padrão"],
    videos: [["Aprendizado motor e repetição espaçada", yt("motor learning spaced practice table tennis")]] },

  { id: "sex", short: "Sex", name: "Sexta", icon: Zap, focus: "Integração · os padrões do bloco, sem técnica nova", total: "≈ 35 min", tint: "#FF7A29", intensity: "Alta",
    checklist: ["Nada novo hoje: é o dia de usar a técnica da semana dentro do padrão", "Se o gesto novo sumir sob pressão do padrão, ele ainda não está pronto — volte a ele na segunda", "Anote o contador dos dois padrões: é o número que a aba Evolução desenha"],
    videos: [["Transferir técnica para o jogo", yt("table tennis transfer drills to match play")]] },

  { id: "sab", short: "Sáb", name: "Sábado", icon: Users, focus: "Saque + jogo-treino · o único dia com parceiro", total: "≈ 55 min", tint: "#2FA36B", intensity: "Alta", serveDay: true, star: true,
    checklist: ["Balde montado antes de começar", "Peça para ele cantar o efeito do seu saque — é o teste que o balde sozinho não faz", "No jogo-treino, cumprir a regra vale mais que ganhar o set", "Registre a partida na aba Jogos"],
    semAula: SEM_AULA,
    videos: [["No-spin vs backspin serve", yt("no spin serve vs backspin serve table tennis")], ["Jogo com restrição", yt("table tennis constraint based training games")]] },

  { id: "dom", short: "Dom", name: "Domingo", icon: Activity, focus: "Sombra e vídeo · dia leve", total: "≈ 25 min", tint: "#D6A324", intensity: "Leve",
    checklist: ["Leve é planejado, não é folga: sem ele a semana 6 em diante vira arrasto", "Sombra devagar e correto — é onde o gesto se conserta sem a pressa da bola", "Grave UMA técnica e mande para análise; a resposta guia a semana seguinte"],
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
  robotFor, SERVE_FOCUS, serveSession, sessionsFor, KIND_META, isDayDone, DAYS, WEEK_INFO, PADROES,
  sessaoTecnica, BLOCOS, blocoDaSemana, semanaInfo,
};
