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

/* ---------- 7. O ADVERSÁRIO DA SEMANA ----------
   A sexta era o pedaço mais fraco do ciclo: repetia dois padrões do treino
   antigo que os blocos irregulares já cobrem melhor. Vira o que sexta deveria
   ser — o dia de jogo simulado, véspera do sábado.

   Os cinco arquétipos são os mesmos da aba Táticas, que até agora só existiam
   para ler. Aqui cada um vira uma regulagem de robô e uma regra de execução:
   você não estuda o plano contra aquele adversário, você executa ele por 20
   minutos. Preparação para adversário específico é o que um treinador faz na
   semana de competição, e é a coisa mais barata de treinar sozinho — porque o
   que muda não é a bola, é a sua decisão. */
const ADVERSARIOS = {
  "adv-empurra": {
    id: "adv-empurra", tecnicas: ["fh-loop", "fh-loop-slow", "push-longo"], tipo: "Só empurra (defensivo)", fraqueza: "Não sabe lidar com velocidade nem com bola longa.",
    dials: d(0, 4, 2, true), time: "20 min", rest: "60 s", contador: "aberturas que passaram",
    pos: "Backspin alto com oscilação: tudo volta cortado, de qualquer canto. É exatamente o que esse cara devolve.",
    target: "6 séries × 10 bolas",
    regra: "Abra TODAS. Nenhum push devolvido — nem a difícil, nem a última da série.",
    plano: [
      "**Não entre no jogo de empurrar.** Contra ele você perde por paciência, nunca por técnica.",
      "**Abra com topspin contra backspin sem medo:** a bola dele é sempre cortada e sempre previsível.",
      "Errar abrindo aqui **vale mais** que ganhar empurrando — é o hábito que este bloco está comprando.",
    ],
    cue: "O erro que este bloco conserta não é de gesto, é de escolha: você sabe abrir e mesmo assim empurra de volta quando a bola vem cortada. Vinte minutos sem a opção de empurrar tiram isso.",
  },
  "adv-ataca": {
    id: "adv-ataca", tecnicas: ["toque-curto", "block", "block-ativo"], tipo: "Ataca tudo (agressivo)", fraqueza: "Erra sob pressão de bola curta e baixa.",
    dials: d(5, 0, 5, true), time: "20 min", rest: "75 s", contador: "sequências de 6 bloqueios",
    pos: "Topspin pesado e frequência alta. É o cara que abriu primeiro e está em cima de você.",
    target: "6 séries × 90 s",
    regra: "Bloqueie tudo, mudando a direção a cada bola. Proibido atacar antes da sexta bola da sequência.",
    plano: [
      "**Bloqueio, não recuo.** Sair da mesa contra quem ataca é entregar o ângulo.",
      "**Varie a direção do bloqueio** para quebrar o ritmo dele — é o que faz atacante amador errar.",
      "No jogo, o complemento é o **saque curto e baixo**: nada de meio-longo, que é justamente o que ele ataca.",
    ],
    cue: "No amador, quem ataca demais erra perto de 40%. Contra esse tipo, sobreviver seis bolas é literalmente a tática — e é uma habilidade que só se ganha com o robô alto e rápido assim.",
  },
  "adv-bh": {
    id: "adv-bh", tecnicas: ["fh-drive", "bh-drive", "footwork"], tipo: "Backhand fraco", fraqueza: "Trava quando é forçado a repetir backhand.",
    dials: d(2, 0, 3, true), time: "20 min", rest: "60 s", contador: "sequências 3+1 completas",
    pos: "Bola de jogo com oscilação. O que muda aqui não é a bola do robô — é onde VOCÊ coloca a sua.",
    target: "6 séries × 8 sequências",
    regra: "Três bolas seguidas no canto de backhand dele (sua diagonal esquerda), a quarta no forehand aberto.",
    plano: [
      "**Saque curto na zona 1 e insista.** Ele vai tentar virar tudo de forehand.",
      "**Três no mesmo canto, uma no aberto.** A quarta só existe porque as três primeiras foram no mesmo lugar.",
      "Se você errar a colocação, a sequência **não conta** — a disciplina de mira é o que está sendo treinado.",
    ],
    cue: "O robô não tem backhand fraco; quem está sendo treinado aqui é a sua mira. Colocar três bolas no mesmo canto sob bola imprevisível é mais difícil do que parece, e é o que abre o ponto contra metade do clube.",
  },
  "adv-canhoto": {
    id: "adv-canhoto", tecnicas: ["footwork", "cross-step", "pivo"], tipo: "Canhoto", fraqueza: "As diagonais invertem e ele abandona a sua paralela.",
    dials: d(3, 0, 3, true), time: "20 min", rest: "60 s", contador: "paralelas certeiras",
    pos: "Bola de jogo com oscilação. De novo: o que muda é o seu alvo, não a bola dele.",
    target: "6 séries × 10 bolas",
    regra: "TODAS na paralela. Nenhuma diagonal — que é o lado para onde a sua mão quer ir sozinha.",
    plano: [
      "**A paralela é o ângulo que canhoto abandona**, porque a diagonal de forehand dele é o golpe forte.",
      "**Seu pendular lateral foge para o backhand dele** — mesma vantagem do destro, lado espelhado.",
      "**Cuidado com a diagonal larga do forehand dele:** é de lá que vem o ponto se você jogar no lugar errado.",
    ],
    cue: "Canhoto é o adversário que mais desorganiza amador, e não por técnica: é o mapa que inverte. Vinte minutos jogando só paralela reescrevem o automático a tempo do próximo torneio.",
  },
  "adv-previsivel": {
    id: "adv-previsivel", tecnicas: ["ler-efeito", "split-step", "fh-drive"], tipo: "Devolve sempre no mesmo lugar", fraqueza: "Previsibilidade total.",
    dials: d(2, 0, 3, false), time: "20 min", rest: "60 s", contador: "primeiras bolas atacadas",
    pos: "Oscilação DESLIGADA de propósito. O robô é literalmente este adversário — bola no mesmo lugar, sempre.",
    target: "6 séries × 12 bolas",
    regra: "Pré-posicione ANTES da bola sair e ataque de primeira. Nenhuma bola de espera.",
    plano: [
      "**Pré-posicionar é o golpe.** Se você já está no lugar, a bola vira ataque; se não, vira devolução.",
      "**Ataque de primeira, sempre.** Contra previsível, esperar é desperdiçar a única vantagem que você tem.",
      "Em jogo, isto começa observando **os três primeiros pontos** e usando o padrão o resto da partida.",
    ],
    cue: "Ler o padrão do adversário é a habilidade mais barata do jogo e a que quase ninguém treina. Aqui o robô é o professor perfeito, porque previsível é tudo o que ele sabe ser.",
  },
};

/* ---------- 8. SETS COMPLETOS ----------
   Sexta é véspera de sábado, e véspera de jogo se treina jogando. Set inteiro,
   placar de verdade, saque trocando a cada 2 pontos — e a rotina entre pontos,
   que é uma habilidade e ninguém treina. */
const SETS_COMPLETOS = {
  nome: "Sets completos contra o robô", sub: "véspera de jogo se treina jogando",
  dials: d(3, 0, 4, true), time: "18 min", rest: "90 s", contador: "sets ganhos",
  pos: "Ritmo de jogo com oscilação. Regulagem única do começo ao fim — em jogo ninguém ajusta o robô no meio do set.",
  target: "3 sets até 11",
  regras: [
    "**Ponto = 6 bolas seguidas na mesa.** Completou, ponto seu; errou antes, ponto dele.",
    "**Saque a cada 2 pontos**, como em jogo — faça o gesto inteiro do saque antes de cada série.",
    "**Rotina entre pontos, obrigatória:** respire fundo uma vez e decida o próximo saque ANTES de começar. Os 10 segundos existem para isso.",
    "**Toalha a cada 6 pontos.** É regra de jogo e é onde a cabeça reseta.",
    "Anote o placar dos 3 sets nas anotações.",
  ],
  cue: "Pressa entre pontos é o principal erro tático do jogo amador — e é impossível treinar isso em bloco de exercício, porque bloco não tem entre-pontos. Aqui tem.",
};

/* Aquecimento de jogo: o que você faria nos 10 minutos antes de uma partida.
   Ensaiar a rotina é treinar a habilidade de começar pronto — o primeiro set
   perdido por estar frio é o mais caro do torneio. */
const ROTINA_PREJOGO = [
  { tag: "físico", label: "Mobilidade curta", time: "3 min", rest: "—",
    target: "Ombro, quadril e tornozelo · corda 1 min",
    cue: "Aquecimento de jogo é mais curto que o de treino de propósito: você tem 10 minutos de mesa em torneio, não 40." },
  { tag: "robô", label: "Aquecimento de bola", time: "5 min", rest: "—",
    target: "2 min diagonal de forehand · 2 min diagonal de backhand · 1 min alternando",
    dials: d(2, 0, 3, false),
    cue: "Exatamente o aquecimento que você faria com o adversário antes do jogo. Sem oscilação: aquecer é achar o timing, não treinar." },
  { tag: "saque", label: "Ensaio da rotina", time: "2 min", rest: "—",
    target: "10 saques · e a decisão de qual vai ser o primeiro saque do jogo",
    passos: [
      "Garrafa e toalha no lugar **antes** do primeiro ponto.",
      "Decida agora **qual saque abre o jogo** — e o plano B se ele devolver bem.",
      "Uma respiração longa antes do primeiro saque. O primeiro ponto é o mais mal jogado do torneio inteiro.",
    ],
    cue: "Ninguém treina isto e todo mundo perde o primeiro set por causa disto." },
];

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

export { d, ativacao, regular, IRREGULARES, SISTEMAS, JOGOS_SOLO, saqueDiario,
  ADVERSARIOS, SETS_COMPLETOS, ROTINA_PREJOGO };
