/* ============================================================
   AS PEÇAS DE UM TREINO
   O ciclo antigo montava o dia como lista plana de exercícios. Sessão de
   treino de verdade tem forma, e é sempre a mesma:

     ativação → bloco regular → bloco irregular → sistema → pontos → saque

   Regular grava o gesto. Irregular grava o jogador. Sistema é a sequência
   como ela aparece no jogo (saque + 3ª, recepção + 4ª). Pontos é onde tudo
   isso passa a valer alguma coisa. Este arquivo guarda as peças; o
   schedule.jsx monta os dias com elas.

   UMA LIMITAÇÃO DO iPONG V300 QUE MANDA NO DESENHO INTEIRO: a oscilação dele
   varre na horizontal, de canto a canto. Ele não alterna curto e comprido, e
   não muda de efeito no meio da série. Ou seja: aleatoriedade de direção dá
   para treinar sozinho; aleatoriedade de comprimento e de efeito, não — isso
   é sábado, com gente. Onde um bloco esbarra nisso, está escrito.
   ============================================================ */

const d = (top, back, freq, osc) => ({
  Topspin: top, Backspin: back, "Frequência": freq, "Oscilação": osc ? "ON" : "OFF",
});

/* ---------- 1. ATIVAÇÃO ----------
   Oito minutos que não são "corda 2 min". Aquecimento de tênis de mesa é
   articulação, pés e o gesto do dia — nessa ordem, e sem bola. */
function ativacao(focoNome) {
  return [
    { tag: "físico", label: "Mobilidade e corda", time: "4 min", rest: "—",
      target: "Corda 2 min · círculos de ombro, rotação de tronco e tornozelo 2 min",
      cue: "Aquecer é subir a temperatura da articulação, não cansar. Se você suou, passou." },
    { tag: "físico", label: "Pés sem bola", time: "2 min", rest: "20 s",
      target: "3 × 30 s: side-step entre os cantos · in-out · split-step no ritmo de jogo",
      cue: "Comece o treino já com os pés ligados. É a diferença entre a primeira série boa e a primeira série perdida." },
    { tag: "sombra", label: `Sombra — ${focoNome}`, time: "2 min", rest: "—",
      target: "20 repetições devagar, gesto inteiro, do pé à raquete",
      cue: "Aqui a sombra vale: é a última chance de corrigir o gesto antes da bola impor a pressa." },
  ];
}

/* ---------- 2. BLOCO REGULAR ----------
   Bola sempre no mesmo lugar. É o único momento do dia em que a repetição é o
   objetivo — e por isso ele é curto. 150 bolas com o gesto certo valem mais
   que 400 no automático. */
function regular(nome, dials, cue) {
  return {
    tag: "robô", label: `Regular — ${nome}`, time: "13 min", rest: "45 s",
    target: "6 séries × 25 bolas · mesmo ponto, mesma bola",
    dials, cue: cue || "Qualidade acima de quantidade: se a série passou de 5 erros, baixe a frequência em 1 antes de insistir.",
  };
}

/* ---------- 3. BLOCOS IRREGULARES ----------
   O que faltava. Bola fixa constrói golpe; bola imprevisível constrói jogador.
   A partir do bloco 2 o irregular passa a ser maior que o regular no dia. */
const IRREGULARES = {
  "irr-fh": {
    nome: "Dois pontos, um golpe", sub: "pivô obrigatório", dials: d(2, 0, 3, true), time: "17 min",
    target: "6 séries × 90 s · oscilação entre os cantos", rest: "60 s", contador: "séries sem furo",
    cue: "O robô alterna os cantos e você ataca SEMPRE de forehand — no lado do backhand, contorna. É o deslocamento que mais aparece em jogo de quem ataca, e o que mais falta no amador.",
  },
  "irr-escolha": {
    nome: "Você escolhe, mas não repete", sub: "decisão sob incerteza", dials: d(2, 0, 3, true), time: "16 min",
    target: "6 séries × 90 s", rest: "60 s", contador: "séries com a regra cumprida",
    cue: "A cada bola escolha forehand ou backhand — proibido dois iguais seguidos. Você deixa de reagir e passa a decidir, que é o que o jogo cobra e o robô normalmente não cobra.",
  },
  "irr-final": {
    nome: "A quinta é finalização", sub: "trocar de marcha", dials: d(3, 0, 4, true), time: "16 min",
    target: "6 séries × 90 s · conte as bolas em voz alta", rest: "60 s", contador: "finalizações certas",
    cue: "Quatro bolas de construção, a quinta você finaliza. Treina a troca de marcha — abrir é uma coisa, acelerar é outra, e perder o ponto por não mudar de marcha é o erro mais caro do amador.",
  },
  "irr-sobrevive": {
    nome: "Aguentar o ritmo", sub: "densidade de set", dials: d(3, 0, 5, true), time: "14 min",
    target: "5 séries × 2 min · conte a maior sequência de cada série", rest: "75 s", contador: "recorde de bolas seguidas",
    cue: "Frequência acima do seu conforto de propósito. Não é para atacar: é para não errar. É o treino que decide o quinto set.",
  },
  "irr-bh": {
    nome: "Lado esquerdo sob pressão", sub: "o backhand deixa de só sobreviver", dials: d(3, 0, 4, true), time: "15 min",
    target: "6 séries × 80 s · robô mirando o lado do backhand com oscilação curta", rest: "60 s", contador: "séries sem furo",
    cue: "Oscilação ligada mas mirando só a metade esquerda: a bola varia dentro do seu lado fraco. Quem ataca sempre acha esse canto — é lá que o jogo é decidido contra o Caio e o Aleykson.",
  },
};

/* ---------- 4. SISTEMAS ----------
   A peça de maior transferência para o jogo, e a que não existia em lugar
   nenhum do ciclo antigo. Golpe solto não ganha ponto; sequência ganha. */
const SISTEMAS = {
  "sist-saque3": {
    nome: "Saque + 3ª bola", sub: "o sistema que decide mais pontos que qualquer golpe",
    dials: d(2, 0, 1, true), time: "16 min", rest: "60 s", contador: "3ªs bolas atacadas",
    pos: "Frequência 1 — uma bola a cada 3 ou 4 segundos. É a pausa que te dá tempo de sacar e voltar.",
    target: "6 séries × 8 ciclos",
    montagem: "Balde do lado da mão que saca. Robô do outro lado da mesa, oscilação ON, mirando comprido.",
    ciclo: [
      "Assim que a bola anterior passar, **saque de verdade** — gesto inteiro, com efeito, na mesa.",
      "**Solte a bola do saque e volte imediatamente à posição base.** Ninguém te espera.",
      "A bola do robô chega: é a **devolução dele**. Ataque como 3ª bola.",
    ],
    cue: "A maioria erra a 3ª bola não por técnica, mas porque ainda está terminando o saque quando ela chega. Este bloco treina exatamente esses dois segundos.",
    limite: "O robô não sabe o que você sacou, então a devolução não corresponde ao seu saque. O que se treina aqui é o encadeamento e a recuperação — a leitura da devolução é sábado.",
  },
  "sist-rec4": {
    nome: "Recepção + 4ª bola", sub: "sair da recepção passiva",
    dials: d(0, 3, 2, false), time: "15 min", rest: "60 s", contador: "cadeias completas",
    pos: "Robô mirando curto, bola cortada caindo perto da rede. Frequência 2.",
    target: "6 séries × 10 ciclos (2 bolas cada)",
    montagem: "Robô fixo no curto. Você começa colado na mesa, pé direito pronto para entrar.",
    ciclo: [
      "**Bola 1 — recepção.** Escolha entre push curto, push longo no canto ou flick. Proibido repetir a mesma resposta duas vezes seguidas.",
      "**Bola 2 — a 4ª bola.** Sai da mesa e ataca. É a bola que a sua recepção construiu.",
    ],
    cue: "Recepção não é devolver, é escolher. E toda escolha tem uma bola seguinte — treinar as duas juntas é o que faz a recepção virar ataque.",
    limite: "O robô manda a mesma bola nas duas: a variação de efeito que o adversário faz não dá para simular. O que este bloco treina é a cadeia decisão → deslocamento → ataque.",
  },
  "sist-bloqueio": {
    nome: "Bloqueio → virar o jogo", sub: "parar de só sobreviver quando ele abre",
    dials: d(5, 0, 4, true), time: "15 min", rest: "60 s", contador: "viradas completas",
    pos: "Topspin pesado, frequência alta, oscilação ON. É o adversário que abriu primeiro.",
    target: "6 séries × 8 ciclos (3 bolas cada)",
    montagem: "Você colado na mesa. Robô no máximo de rotação que você ainda consegue bloquear.",
    ciclo: [
      "**Bolas 1 e 2 — bloqueio.** Raquete fechada, sem movimento, só ângulo. Absorva.",
      "**Bola 3 — contra-ataque.** Sai do bloqueio e ataca, mesmo que a bola não seja perfeita.",
    ],
    cue: "Ficar bloqueando até errar é o jeito mais comum de perder ponto estando vivo. A regra da terceira bola te obriga a sair.",
  },
};

/* ---------- 5. PONTOS ----------
   Nenhum treino de segunda a sexta terminava com ponto jogado. Sem placar, sem
   consequência de erro, o treino inteiro acontece num contexto que o jogo nunca
   oferece — e é por isso que o treino não transfere. */
const JOGOS_SOLO = {
  "js-set5": {
    nome: "Set contra o robô", sub: "placar de verdade, sozinho",
    dials: d(3, 0, 4, true), time: "12 min", rest: "—", contador: "sets ganhos do robô",
    regras: [
      "Cada **ponto** é uma sequência de **5 bolas seguidas** na mesa.",
      "Completou as 5: ponto seu. Errou antes: ponto do robô.",
      "Vai até **11**, com 2 de diferença. Anote o placar final abaixo.",
    ],
    cue: "O número não importa; a consequência sim. Errar deixa de custar nada e passa a custar um ponto — é isso que muda a sua atenção da bola 3 em diante.",
  },
  "js-prazo": {
    nome: "Ponto com prazo", sub: "parar de empurrar o jogo",
    dials: d(2, 0, 3, true), time: "12 min", rest: "—", contador: "pontos ganhos no prazo",
    regras: [
      "Cada ponto tem que terminar em **até 5 bolas**, com um **ataque seu**.",
      "Chegou na 6ª bola ainda trocando: ponto perdido, mesmo que a bola esteja na mesa.",
      "10 pontos por série, 3 séries.",
    ],
    cue: "Você tem consistência e usa ela para adiar a decisão. Este jogo cobra o oposto: resolver. É o remédio direto para o set que você domina e perde no fim.",
  },
  "js-deuce": {
    nome: "Só deuce", sub: "a parte do jogo que decide",
    dials: d(3, 0, 4, true), time: "12 min", rest: "90 s", contador: "deuces vencidos",
    regras: [
      "Todo ponto começa **9-9**. Você precisa de dois seguidos para levar.",
      "Cada ponto: **7 bolas seguidas** na mesa, sem tentar vencedor.",
      "5 deuces por sessão. Anote quantos você levou.",
    ],
    cue: "Ninguém treina o 9-9 e todo mundo perde nele. Aqui você joga só ele, cinco vezes, toda semana.",
  },
};

/* ---------- 6. SAQUE DIÁRIO ----------
   Com mesa em casa, saque deixa de ser um bloco semanal e vira hábito diário.
   Saque é habilidade de milhares de repetições: 10 min por dia são 70 min por
   semana e ~500 bolas — contra os 30 min soltos do ciclo antigo. */
function saqueDiario(foco) {
  return {
    tag: "saque", label: "Saque — 10 minutos todo dia", time: "10 min", rest: "—",
    target: `100 bolas no balde · foco da semana: ${foco}`,
    cue: "Saque não melhora em treino semanal, melhora em repetição diária. Registre os acertos na aba Saque — sem denominador não existe evolução.",
  };
}

export { d, ativacao, regular, IRREGULARES, SISTEMAS, JOGOS_SOLO, saqueDiario };
