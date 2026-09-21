import { yt, parseMin } from "../lib/helpers.jsx";
import { STROKES } from "./strokes.js";
import { FISICO, FASES, REGRAS_FISICO } from "./fisico.js";
import { r, aquecimento, regular, IRREGULARES, SISTEMAS, JOGOS_SOLO, saqueDiario,
  ADVERSARIOS, SETS_COMPLETOS, ROTINA_PREJOGO } from "./blocos.js";
import {
  Bot, GraduationCap, Trophy, Wind, Target, Layers, Zap, Users, Activity, Dumbbell, Flame
} from "lucide-react";

/* ============ TÉCNICA DO ACERVO COMO SESSÃO ============
   O acervo já traz exercícios estruturados; aqui eles viram blocos da linha do
   tempo, iguais aos de um padrão. Assim a técnica ganha cronômetro, contador e
   anotação sem nenhum componente novo de tela. */

/* O campo `robot` das técnicas é prosa na ordem do controle remoto do V300
   ("Freq 2 · Osc 0 · Top 3 · Back 6"). Onde ela casa com esse formato, vira
   painel do robô. Onde não casa — as técnicas em que está escrito que o robô
   NÃO produz aquela bola — devolve null, e o painel não aparece. */
function dialsDaTecnica(texto) {
  if (!texto) return null;
  const num = (rot) => {
    const m = new RegExp(rot + "\\s+(\\d+)", "i").exec(texto);
    return m ? Number(m[1]) : null;
  };
  const fq = num("Freq"), os = num("Osc"), ts = num("Top"), bs = num("Back");
  if (ts === null && bs === null) return null;
  return r(fq ?? 2, os ?? 0, ts ?? 4, bs ?? 4);
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
    dials: r(4, 4, 5, 3),
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
  1: "Curto backspin na zona 1 — o saque que obriga ele a empurrar",
  2: "O mesmo gesto, dois efeitos: backspin e no-spin",
  3: "Comprimento: curto que não sobra, longo rasante",
  4: "Teste do par — o parceiro canta o efeito antes de devolver",
  5: "Curto backspin + 3ª bola: o saque existe para a abertura vir",
  6: "Longo backspin rápido no cotovelo — a bola que volta alta",
  7: "Pendular lateral — e para onde a devolução volta",
  8: "Teste de terceira bola: quantas cortadas você chegou a abrir",
  9: "Disfarce: mesma altura, mesmo ritmo, contato diferente",
  10: "Curto no meio: tira o ângulo e a devolução vem no seu forehand",
  11: "Longo rápido como surpresa — duas vezes por set, não mais",
  12: "Teste final: só os saques que você usaria no próximo torneio",
};

function serveSession(week) {
  const foco = SERVE_FOCUS[week];
  const blocks = [
    { det: "sv-punho", tag: "saque", label: "Aquecimento de punho", time: "3 min", rest: "—",
      target: "30 saques leves só de punho", cue: "Empunhadura 2/10. Solte a mão." },
    { det: "sv-foco", tag: "saque", label: `Foco da semana: ${foco}`, time: "9 min", rest: "40 s",
      target: "60 bolas no mesmo alvo · séries de 10",
      cue: "Registre acertos por série na aba Saque." },
    { det: "sv-parceiro-efeito", tag: "parceiro", label: "Ele devolve e canta o efeito", time: "10 min", rest: "—",
      target: "40 saques · depois de devolver, ele diz que efeito leu",
      cue: "É o único teste que existe do seu disfarce. Balde não responde. Se ele acerta o efeito em 8 de 10, o saque é honesto demais." },
    { det: "sv-parceiro-saque", tag: "parceiro", label: "Saque dele, recepção sua", time: "10 min", rest: "—",
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
  const dialsReg = (t && dialsDaTecnica(t.robot)) || r(3, 0, 5, 3);

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
    ...aquecimento(nome),
    { ...regular(rotulo, { ...dialsReg, "Oscilação": 0 }, cueReg), time: curto ? "10 min" : "13 min" },
  ];
  if (!semIrregular) blocos.push({ det: irr, tag: "robô · osc ON", label: `Irregular — ${I.nome}`,
    time: I.time, rest: I.rest, target: I.target, dials: I.dials, cue: I.cue });
  return {
    kind: "mesa", slot: "mesa-" + irr, title: titulo, sub,
    total: totalDe(blocos), robot: true,
    robotCfg: { title: `Regular — ${rotulo}`, pos: "A regulagem muda entre o bloco regular e o irregular; cada bloco abaixo traz a sua.", dials: { ...dialsReg, "Oscilação": 0 } },
    counter: semIrregular ? "bolas boas no bloco regular" : I.contador, tecnicas: t ? [t.id] : null,
    blocks: blocos,
  };
}

/* Sistema + saque diário. É o card de maior transferência da semana: golpe
   solto não ganha ponto, sequência ganha. */
function sessaoSistema({ sist, week }) {
  const S = SISTEMAS[sist];
  const blocos = [
    { det: sist, tag: "robô", label: S.nome, time: S.time, rest: S.rest,
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
    { det: jogo, tag: "jogo", label: J.nome, time: J.time, rest: J.rest,
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
    det: e.det, tag: "físico", label: e.nome, time: "—", rest: fase.descanso,
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
    ...aquecimento(tecnicas[0] ? tecnicas[0].name : "gesto da semana"),
    { det: "corr-lenta", tag: "sombra", label: "Correção lenta", time: "10 min", rest: "30 s",
      target: `4 × 2 min alternando: ${nomes}`,
      cue: "Metade da velocidade de jogo. Você está procurando o erro, não repetindo o acerto." },
    { det: "corr-trecho", tag: "robô", label: "Só o trecho que estava errado", time: "12 min", rest: "45 s",
      target: "4 séries × 20 bolas · frequência 1 abaixo do normal",
      dials: r(2, 0, 5, 4),
      cue: "Bola lenta de propósito. Se o gesto só sai certo devagar, ele ainda não está pronto — e insistir rápido grava o errado." },
    { det: "corr-video", tag: "estudo", label: "Gravar e mandar para análise", time: "6 min", rest: "—",
      target: "6 a 8 repetições de UMA técnica, slow motion, câmera lateral",
      cue: "Abra a técnica na aba Golpes, copie o prompt de análise e mande o vídeo. A resposta guia a segunda-feira seguinte." },
  ];
  return { kind: "tecnica", slot: "correcao", title: "Correção e vídeo", sub: "dia leve do meio da semana",
    total: totalDe(blocos), robot: true,
    robotCfg: { title: "Correção", pos: "Frequência baixa. Hoje a bola é ferramenta de conserto, não de treino.", dials: r(2, 0, 5, 4) },
    blocks: blocos };
}

/* Domingo. Sete dias por semana só funciona se um deles for quase nada. */
function sessaoLeve(tecnicas) {
  const nomes = tecnicas.map((t) => t.name).join(" · ");
  const blocos = [
    { det: "leve-soltura", tag: "sombra", label: "Soltura", time: "6 min", rest: "—",
      target: "Ombro, quadril e coluna torácica · sem corda, sem série, sem contar nada",
      cue: "Soltar, não cansar. Domingo é o único dia sem mesa: se virar treino, a semana que vem começa devendo." },
    { det: "leve-sombra", tag: "sombra", label: "Sombra da semana", time: "12 min", rest: "30 s",
      target: `3 × 2 min alternando: ${nomes}`,
      cue: "Devagar e correto. É o único treino da semana sem nenhuma pressa." },
    { det: "leve-revisao", tag: "estudo", label: "Fechar a semana", time: "8 min", rest: "—",
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
    { det: "jt-regra", tag: "jogo", label: "Sets valendo, com uma regra", time: "25 min", rest: "—",
      target: "3 sets contra o parceiro · uma regra por set",
      passos: [
        "**Set 1 — saída do backspin.** Toda bola cortada que der para abrir, você abre. Nenhum push de volta.",
        "**Set 2 — cozinhada.** No máximo três empurradas suas por ponto; a quarta é ataque, custe o que custar.",
        "**Set 3 — defesa.** Quando ele abrir primeiro, bloqueia colado na mesa e muda a direção. Proibido recuar.",
      ],
      cue: "Uma regra por set, e são as três da semana. Ganhar é secundário: o que conta é a regra ter sido cumprida, porque é ela que leva o conserto para dentro do jogo. Foi no jogo que os quatro erros apareceram." },
    { det: "jt-livre", tag: "jogo", label: "Set livre e anotação", time: "12 min", rest: "—",
      target: "1 set sem regra nenhuma + 3 minutos anotando",
      cue: "Sem regra, para ver o que sai sozinho — é o retrato mais honesto da semana. Anote: quantas cortadas você abriu (e quantas empurrou), quantos bloqueios aguentaram, onde perdeu mais. Esses números são o seu jogo, não o que você acha que é o seu jogo." },
  ];
  return { kind: "treino", slot: "jogotreino", title: "Jogo-treino com regra", sub: "onde o treino da semana vira jogo",
    total: totalDe(blocos), robot: false, counter: "sets com a regra cumprida", blocks: blocos };
})();

/* A bateria de teste, na sexta das semanas 4, 8 e 12. Ela mudou junto com o
   ciclo: mede os quatro erros do torneio, um item cada, mais a cadeia e o set.
   Comparar só funciona se a medida não mudar — então a semana 4 é a linha de
   base nova, e é com ela que as semanas 8 e 12 se comparam, não com o ciclo
   antigo. As linhas de corte são o que um jogador de clube deveria bater; se
   você passar todas na semana 8, elas sobem no próximo ciclo. */
function sessaoTeste(week) {
  const blocos = [
    { det: "teste-1", tag: "robô", label: "1 · Saída do backspin", time: "9 min", rest: "45 s",
      target: "6 séries × 8 bolas cortadas · abrir todas", dials: r(2, 0, 3, 6),
      cue: "O erro nº 1 do torneio. Conte as que passam COM efeito — bola que passa sem girar não conta. Linha de corte: 26 de 48." },
    { det: "teste-2", tag: "robô", label: "2 · Abrir sem saber onde vem", time: "7 min", rest: "60 s",
      target: "5 séries × 8 bolas · oscilação ligada", dials: r(2, 4, 3, 6),
      cue: "O mesmo golpe do item 1, agora sem saber o canto. A diferença entre os dois números é o quanto o seu deslocamento está custando. Linha de corte: 20 de 40." },
    { det: "teste-3", tag: "robô", label: "3 · Cozinhada com saída", time: "8 min", rest: "60 s",
      target: "6 séries × 6 ciclos: 3 pushes e abre a 4ª", dials: r(2, 3, 3, 6),
      cue: "Conte só os ciclos completos — três pushes baixos E a quarta atacada. Push alto no meio zera o ciclo. Linha de corte: 22 de 36." },
    { det: "teste-4", tag: "robô", label: "4 · Defesa de topspin", time: "7 min", rest: "60 s",
      target: "Maior sequência de bloqueios sem errar", dials: r(5, 4, 7, 2),
      cue: "Colado na mesa, mudando a direção a cada bola. Errou, recomeça do zero. Linha de corte: 18 seguidas." },
    { det: "teste-5", tag: "robô", label: "5 · Drive seguidas", time: "5 min", rest: "—",
      target: "Série livre de drive FH", dials: r(5, 0, 6, 3),
      cue: "A batida base, e o único item que veio igual do ciclo antigo — dá para comparar com o que você já tinha. Linha de corte: 40." },
    { det: "teste-6", tag: "robô", label: "6 · A cadeia inteira", time: "8 min", rest: "60 s",
      target: "5 séries × 6 ciclos: abre, bloqueia, ataca", dials: r(2, 4, 4, 4),
      cue: "Cortada → abertura → topspin dele → bloqueio → seu ataque. Conte as cadeias que chegaram até o fim. É o item que mais parece jogo. Linha de corte: 15 de 30." },
    { det: "teste-7", tag: "jogo", label: "7 · Set contra o robô", time: "8 min", rest: "—",
      target: "Um set até 11 · ponto = 5 bolas seguidas", dials: r(5, 4, 6, 3),
      cue: "Anote o placar. É a única medida do ciclo com consequência de erro embutida." },
    { det: "teste-8", tag: "estudo", label: "Anotar e comparar", time: "5 min", rest: "—",
      target: "Os 7 números, no campo de anotações abaixo",
      cue: "Compare com a última semana de teste. O que não subiu vira o foco do bloco seguinte — e se nada subir em dois testes seguidos, o problema não é volume, é o gesto: grave e mande para análise." },
  ];
  return { kind: "tecnica", slot: "teste", title: `Bateria de teste · semana ${week}`,
    sub: "os quatro erros do torneio, medidos", total: totalDe(blocos), robot: true,
    robotCfg: { title: "Bateria de teste", pos: "Cada item tem a sua regulagem — está no bloco.", dials: r(2, 0, 3, 6) },
    counter: "itens acima da linha de corte", blocks: blocos };
}

/* ============ O CICLO PÓS-TORNEIO — 12 SEMANAS ============
   O ciclo anterior era genérico: base, armas, jogo. Este nasceu de um
   campeonato ruim e de quatro erros nomeados por quem jogou:

     1. sair do backspin (abrir contra bola cortada)
     2. o jogo de cozinhada (push, toque curto, a troca perto da rede)
     3. o drive na bola
     4. defender topspin

   Nenhum deles é "o tema do bloco", porque os quatro erraram juntos no mesmo
   dia. Os quatro aparecem TODA semana, e cada um tem o seu dia fixo:

     segunda  → saída do backspin      (abrir, sempre, sem opção de empurrar)
     terça    → cozinhada              (três empurradas e a quarta é ataque)
     quarta   → defesa de topspin      (bloqueio que muda de direção)
     sexta    → os quatro dentro de um jogo simulado

   O DRIVE não tem dia porque tem todos: ele virou o aquecimento de todos os
   dias de mesa. Era corda e pés sem bola, que não eram feitos; agora são dez
   minutos de drive na mesa que aquecem e treinam a batida base ao mesmo tempo.

   O que muda de bloco para bloco é a exigência, não o assunto: bloco 1 conserta
   o gesto com bola previsível, bloco 2 cobra a decisão, bloco 3 junta tudo no
   mesmo ponto e com placar.

   INVARIANTE das semanas: `tecnicas` é sempre [abertura, jogo curto, defesa,
   drive] — nessa ordem. É o que faz `t: 0` ser sempre segunda (abertura),
   `t: 1` terça (cozinhada) e `t: 2` quarta (defesa) nas 12 semanas.

   Em cada dia: `t` é o índice na lista de técnicas da semana, `irr` o bloco
   irregular, `sist` o sistema, `jogo` o jogo pontuado, `fis` a sessão de
   academia, `advs` o adversário simulado da sexta. */
const BLOCOS = [
  {
    n: 1, nome: "Gesto", cor: "#1E5A8A",
    lema: "Consertar os quatro golpes, um por dia",
    semanas: {
      1: { titulo: "A saída do backspin", nota: "Segunda abre de forehand contra cortada — o erro nº 1 do torneio, com bola previsível para consertar o gesto. Terça o push de backhand, quarta o bloqueio parado.", tecnicas: ["fh-loop", "push-bh", "block", "fh-drive"] },
      2: { titulo: "O push que não entrega bola", nota: "Segunda o loop lento com muito efeito — a abertura segura, que passa mesmo na cortada pesada. Terça o push de forehand baixo e longo; quarta o bloqueio ativo, que devolve velocidade em vez de só aparar.", tecnicas: ["fh-loop-slow", "push-fh", "block-ativo", "bh-drive"] },
      3: { titulo: "O lado esquerdo faz as três coisas", nota: "A semana inteira no canto por onde o torneio entrou: abrir de backhand na segunda, toque curto na terça, chop block na quarta. Quem ataca sempre acha esse lado.", tecnicas: ["bh-loop", "toque-curto", "chop-block", "bh-punch"] },
      4: { titulo: "Semana de teste · linha de base nova", nota: "Volume menor e sem bloco irregular — medir cansado mede o cansaço. A bateria mudou junto com o ciclo: estes sete números são o seu ponto de partida pós-torneio.", teste: true, tecnicas: ["fh-loop", "push-longo", "block", "fh-drive"] },
    },
    dias: {
      seg: { t: 0, tema: "saída do backspin", irr: "irr-abre", sist: "sist-saque3", fis: "A" },
      ter: { t: 1, tema: "cozinhada", irr: "irr-cozinha", jogo: "js-abre", curto: true },
      qua: { t: 2, tema: "defesa de topspin", irr: "irr-defesa", sist: "sist-bloqueio", fis: "B" },
      qui: { correcao: [0, 1, 2] },
      sex: { advs: { 1: "adv-empurra", 2: "adv-ataca", 3: "adv-previsivel" }, fis: "C" },
    },
  },
  {
    n: 2, nome: "Decisão", cor: "#FF7A29",
    lema: "Quando abrir, quando cozinhar, quando segurar",
    semanas: {
      5: { titulo: "Abrir forte, não só abrir", nota: "Segunda o power loop: abertura que ganha ponto, não que devolve a bola. Terça a devolução de saque curto, onde a decisão de cozinhar ou atacar começa. Quarta o bloqueio com efeito, que devolve problema.", tecnicas: ["fh-loop-power", "rec-curto", "block-lateral", "footwork"] },
      6: { titulo: "Três empurradas e a quarta é sua", nota: "A cozinhada ganha prazo: push longo rápido na terça, e a bola seguinte é ataque. Na quarta o contra-topspin de forehand — quem abre primeiro não é dono do ponto.", tecnicas: ["fh-loop-slow", "push-longo", "fh-counterloop", "fh-drive"] },
      7: { titulo: "Backhand sob pressão", nota: "Abrir, tocar curto e contra-atacar — os três do mesmo lado, na semana que decide os jogos contra quem insiste no seu canto esquerdo.", tecnicas: ["bh-loop", "toque-curto", "bh-counterloop", "bh-drive"] },
      8: { titulo: "Semana de teste · meio do ciclo", nota: "Volume menor e a mesma bateria da semana 4. Compare item a item: o que não subiu em oito semanas não é falta de volume, é gesto — e vira vídeo na quinta.", teste: true, tecnicas: ["fh-loop", "push-bh", "block-ativo", "fh-drive"] },
    },
    dias: {
      seg: { t: 0, tema: "saída do backspin", irr: "irr-abre", sist: "sist-abrir-aguentar", fis: "A" },
      ter: { t: 1, tema: "cozinhada", irr: "irr-cozinha", jogo: "js-abre", curto: true },
      qua: { t: 2, tema: "defesa de topspin", irr: "irr-defesa", sist: "sist-rec4", fis: "B" },
      qui: { correcao: [0, 1, 2] },
      sex: { advs: { 5: "adv-ataca", 6: "adv-empurra", 7: "adv-bh" }, fis: "C" },
    },
  },
  {
    n: 3, nome: "Ponto inteiro", cor: "#7A4FE0",
    lema: "Os quatro erros dentro do mesmo ponto, com placar",
    semanas: {
      9: { titulo: "A cadeia completa", nota: "Cozinhar, abrir, aguentar a resposta e voltar a atacar — as quatro bolas do ponto que você perdeu a tarde inteira do campeonato, agora no mesmo bloco.", tecnicas: ["fh-loop-power", "push-longo", "fh-counterloop", "pivo"] },
      10: { titulo: "Sair da cozinhada atacando", nota: "Terça entra o flick: quando a bola curta não dá para abrir, ela dá para atacar — é a terceira saída, além de empurrar e de abrir. Segunda revisa o loop lento sob pressão, quarta o bloqueio com efeito.", tecnicas: ["fh-loop-slow", "flick", "block-lateral", "fh-drive"] },
      11: { titulo: "Pressão de verdade", nota: "Banana na terça e contra-topspin de backhand na quarta, com placar em tudo. É a semana mais dura do ciclo e a que mostra se o conserto aguenta pressão — que é onde ele falhou no torneio.", tecnicas: ["bh-loop", "banana", "bh-counterloop", "bh-drive"] },
      12: { titulo: "Semana de teste · fim do ciclo", nota: "A mesma bateria das semanas 4 e 8. Três medidas, uma linha — é ela, e não a sensação depois do treino, que diz se o próximo torneio vai ser diferente.", teste: true, tecnicas: ["fh-loop", "toque-curto", "block-ativo", "fh-drive"] },
    },
    dias: {
      seg: { t: 0, tema: "saída do backspin", irr: "irr-abre", sist: "sist-abrir-aguentar", fis: "A" },
      ter: { t: 1, tema: "cozinhada", irr: "irr-cozinha", jogo: "js-abre", curto: true },
      qua: { t: 2, tema: "defesa de topspin", irr: "irr-defesa", sist: "sist-bloqueio", fis: "B" },
      qui: { correcao: [0, 1, 2] },
      sex: { advs: { 9: "adv-ataca", 10: "adv-empurra", 11: "adv-canhoto" }, fis: "C" },
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

  /* O título do card carrega o erro que o dia conserta, não a carga do dia:
     "Mesa · saída do backspin" diz para que serve a sessão; "Mesa · carga",
     que era o título antigo, não dizia nada. A carga foi para o subtítulo. */
  const out = [sessaoMesa({
    tecnica: tecDaSemana(tecs, r.t), irr: r.irr, curto: r.curto, semIrregular: teste,
    titulo: "Mesa · " + (r.tema || (r.curto ? "qualidade" : "carga")),
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
    { det: A.id, tag: "robô", label: `Contra: ${A.tipo}`, time: A.time, rest: A.rest,
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
    { det: "sets-completos", tag: "jogo", label: S.nome, time: S.time, rest: S.rest,
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
  "**Peça bola cortada variando comprimento: uma curta, uma longa, sem avisar.** O iPong manda tudo do mesmo tamanho, e foi justamente a cortada curta que te pegou no torneio.",
  "**Peça para ele sacar variando e cantar o efeito depois que você devolveu.** Ler efeito de gente é a habilidade que mais decide jogo e a que menos dá para treinar sozinho.",
  "Se a aula voltar, ela entra aqui ou substitui a quinta. O pedido para o professor: **“me manda cortada e topspin alternados sem avisar”** — os dois erros do torneio na mesma série.",
];

/* ============ DIAS ============
   A semana é periodizada: 3 dias de carga, 1 de qualidade, 1 regenerativo,
   1 de jogo, 1 leve. A intensidade é uma decisão, não um acidente. */
const DAYS = [
  { id: "seg", short: "Seg", name: "Segunda", icon: Target, focus: "Saída do backspin · abrir toda cortada", total: "≈ 68 min + academia", tint: "#1E5A8A", intensity: "Alta", gym: true,
    checklist: ["O erro nº 1 do campeonato tem o dia mais pesado da semana", "O aquecimento é drive na mesa — ele já é treino, não pule para o bloco seguinte", "No bloco irregular não existe push: empurrar zera a série, errar abrindo não", "Academia depois da mesa, nunca antes"],
    videos: [["Abrir contra backspin", yt("table tennis open against backspin drill")], ["Saque e terceira bola", yt("table tennis serve and third ball attack drill")]] },

  { id: "ter", short: "Ter", name: "Terça", icon: Zap, focus: "Cozinhada · três empurradas e a quarta é ataque", total: "≈ 60 min", tint: "#FF7A29", intensity: "Alta",
    checklist: ["Push é preparação, não espera: baixo, longo e no canto", "Se a quarta bola não virou ataque, o ciclo não conta", "Termina com placar em que empurrar vale zero — é o placar do erro que te custou o torneio"],
    videos: [["Push com qualidade", yt("table tennis push technique low and long")], ["Sair do push atacando", yt("table tennis when to open from push rally")]] },

  { id: "qua", short: "Qua", name: "Quarta", icon: Layers, focus: "Defesa de topspin · bloqueio que muda de direção", total: "≈ 66 min + academia", tint: "#1E5A8A", intensity: "Alta", gym: true,
    checklist: ["Bloqueio se faz colado na mesa: recuar é entregar o ângulo", "Raquete fechada e sem movimento — é ângulo, não golpe", "Muda a direção a cada bola: é isso que faz atacante amador errar", "Academia B é a sessão de potência e de ombro. O face pull não é opcional"],
    videos: [["Bloqueio contra topspin", yt("table tennis block against topspin technique")], ["Bloqueio ativo", yt("table tennis punch block drill")]] },

  { id: "qui", short: "Qui", name: "Quinta", icon: Activity, focus: "Regenerativo · correção lenta e vídeo", total: "≈ 62 min", tint: "#0E8B8B", intensity: "Leve",
    checklist: ["Dia leve de propósito: cinco dias 'Alta' seguidos estagnam e machucam", "Bola lenta, meia velocidade — hoje você procura o erro, não repete o acerto", "Grave UMA das três técnicas da semana e mande para o prompt de análise da aba Golpes"],
    videos: [["Aprendizado motor e prática lenta", yt("motor learning slow practice table tennis")]] },

  { id: "sex", short: "Sex", name: "Sexta", icon: Flame, focus: "Simulação · os quatro erros dentro de um jogo", total: "≈ 60 min + academia", tint: "#FF7A29", intensity: "Alta", gym: true,
    checklist: ["Nada de técnica nova: hoje é usar o que a semana consertou dentro de um jogo", "Se a abertura ou o bloqueio sumirem sob pressão, eles ainda não estão prontos — voltam na segunda", "Os sets de sexta são o ensaio do sábado"],
    videos: [["Transferir técnica para o jogo", yt("table tennis transfer drills to match play")]] },

  { id: "sab", short: "Sáb", name: "Sábado", icon: Users, focus: "O único dia com parceiro · saque real e jogo", total: "≈ 70 min", tint: "#2FA36B", intensity: "Jogo", serveDay: true, star: true,
    checklist: ["Balde montado antes de começar", "Peça bola curta e cortada de verdade: comprimento e efeito variados é o que o robô não faz", "Peça para ele cantar o efeito do seu saque — é o teste que o balde sozinho não faz", "Anote os três números: quantas cortadas você abriu, quantos bloqueios aguentaram, onde perdeu mais"],
    semAula: SEM_AULA,
    videos: [["Ler efeito no saque", yt("table tennis read serve spin")], ["Jogo com restrição", yt("table tennis constraint based training games")]] },

  { id: "dom", short: "Dom", name: "Domingo", icon: Activity, focus: "Leve · sombra e revisão da semana", total: "≈ 26 min", tint: "#D6A324", intensity: "Leve",
    checklist: ["Leve é planejado, não é folga: sem ele a semana 6 em diante vira arrasto", "Releia as anotações dos seis dias antes de fechar", "Uma frase só: qual dos quatro erros melhorou nesta semana"],
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
