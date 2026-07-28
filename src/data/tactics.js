/* ============ ABA TÁTICAS ============ */
const COMBOS = [
  { n: 1, name: "No-spin curto → ataque de FH", star: true, level: "seu combo principal",
    seq: ["Saque **pendular no-spin curto** na zona 2 (cotovelo).", "Ele empurra achando que é cortada → a bola **sobe alta e mole**.", "Você **ataca de FH** na diagonal aberta."],
    why: "É o padrão que mais rende ponto no amador. Funciona porque quase ninguém percebe a diferença entre backspin e no-spin.",
    train: "Bloco E do treino de disfarce: 20 repetições com um parceiro empurrando." },
  { n: 2, name: "Backspin curto → topspin de abertura",
    seq: ["Saque **pendular backspin curto** na zona 1 (BH dele).", "Ele empurra de volta, cortado.", "Você **abre com topspin de FH contra backspin** — exatamente seu treino de quarta."],
    why: "Conecta seu melhor saque com seu golpe-assinatura. É o padrão mais treinável do seu mês 1.",
    train: "Saque + robô com backspin logo depois: 15 repetições." },
  { n: 3, name: "Lateral curto → bola no lado vazio",
    seq: ["Saque **lateral curto** na zona 1.", "O efeito **empurra a devolução dele para a sua esquerda** — previsível.", "Você já está posicionado e joga na **diagonal oposta**, onde ele não está."],
    why: "Você não precisa de força: precisa saber para onde a bola vai voltar. Efeito lateral entrega isso.",
    train: "20 saques observando SÓ para onde a devolução vai. Anote o padrão." },
  { n: 4, name: "Curto, curto, longo rápido",
    seq: ["Dois saques **curtos** seguidos — ele se aproxima da mesa.", "No terceiro, **longo rápido na zona 5** (cotovelo), rasante.", "Ele está grudado na mesa e não tem tempo de recuar."],
    why: "É a variação de comprimento sem mudar o gesto. Ponto direto ou devolução fraca.",
    train: "Séries de 3: curto, curto, longo. 10 séries." },
  { n: 5, name: "Ataque no cotovelo, sempre",
    seq: ["Em qualquer bola de rally, jogue no **eixo do corpo dele** (cotovelo).", "Ele hesita entre FH e BH.", "A devolução vem mole e no meio → você ataca no ângulo aberto."],
    why: "O ponto mais fraco de todo amador não é o backhand: é a linha do meio, onde ele precisa decidir.",
    train: "No robô com oscilação, mire sempre no centro da mesa dele. 5 × 2 min." },
];

const OPPONENTS = [
  { type: "Só empurra (defensivo)", weak: "Não sabe lidar com velocidade nem com bola longa.",
    plan: ["Saque **longo rápido** com mais frequência — ele não consegue empurrar bola rápida.", "Abra com **topspin contra backspin** sem medo: a bola dele é sempre cortada e previsível.", "Não entre no jogo de empurrar com ele. Você perde por paciência."] },
  { type: "Ataca tudo (agressivo)", weak: "Erra sob pressão de bola curta e baixa.",
    plan: ["**Só saque curto e baixo.** Nada de meio-longo — é justamente o que ele ataca.", "Use o **bloqueio** e deixe ele errar: no amador, quem ataca demais erra 40%.", "Varie a direção do bloqueio para quebrar o ritmo."] },
  { type: "Backhand fraco", weak: "Trava quando é forçado a repetir BH.",
    plan: ["Saque **curto na zona 1** (BH) e insista.", "No rally, **jogue 3 bolas seguidas no BH** e a quarta no FH aberto.", "Ele vai tentar virar tudo de FH — aí o lado dele fica escancarado."] },
  { type: "Canhoto", weak: "As diagonais invertem e ele tem dificuldade no seu lado direito.",
    plan: ["Seu saque **pendular lateral** foge para o BH dele — mesma vantagem, lado espelhado.", "Ataque a **linha paralela** (sua direita → direita dele): é o ângulo que canhoto costuma abandonar.", "Cuidado com a diagonal larga do FH dele, que é o golpe mais forte."] },
  { type: "Devolve sempre no mesmo lugar", weak: "Previsibilidade total.",
    plan: ["Nos primeiros 3 pontos, **só observe** para onde ele devolve seu saque.", "Depois disso, **pré-posicione-se** ali e ataque de primeira.", "Isso vale mais que qualquer golpe novo: ler o padrão é a habilidade mais barata do jogo."] },
];

const GAME_VARIATIONS = [
  { t: "Varie o comprimento, não o gesto", d: "Curto → curto → longo. É a variação mais fácil de executar e a mais difícil de ler." },
  { t: "Varie a colocação com o mesmo golpe", d: "O mesmo FH drive pode ir na diagonal, na paralela ou no cotovelo. Mude o ângulo da raquete, não o movimento." },
  { t: "Varie o ritmo", d: "Duas bolas rápidas e uma lenta e alta. O amador ajusta a força pelo ritmo anterior e erra na mudança." },
  { t: "Varie a rotação no mesmo saque", d: "Backspin e no-spin com gesto idêntico. Já está treinado na aba Saque." },
  { t: "Ataque o cotovelo em momentos de pressão", d: "Em 9-9, jogue no eixo do corpo. A hesitação sob pressão é o que decide." },
  { t: "Repita o que está funcionando", d: "Se um saque rendeu 3 pontos, **não mude por vaidade**. Repita até ele resolver." },
];

const LOSING_FIXES = [
  "**Mude o saque antes de mudar o golpe.** Trocar o comprimento do saque resolve mais que tentar bater mais forte.",
  "**Reduza para 80% de força.** Perdendo, quase todo amador aumenta a força e aumenta o erro.",
  "**Jogue mais alto e mais longo por dois pontos** só para reconstruir a confiança e o ritmo.",
  "**Respire e demore os 10 segundos** entre pontos. Pressa é o principal erro tático do jogo amador.",
  "**Volte ao básico:** um saque confiável + uma bola no cotovelo. Nada de golpe novo em desvantagem.",
];

const GOLDEN_RULES = [
  "Bola alta é presente — mas bata com 80%, não 100%.",
  "Nunca sirva meio-longo: ou curto de verdade, ou rasante no fundo.",
  "Depois de cada golpe, volte à base. Sempre.",
  "Ajuste os pés antes de bater, nunca alcance com o braço.",
  "Se você não sabe o efeito da bola, jogue seguro e alto no fundo.",
  "Repita o saque que está funcionando até ele resolver o problema.",
  "Observe onde ele devolve nos 3 primeiros pontos e use isso o jogo inteiro.",
  "Errar atacando é melhor que errar recuando — mas só depois que a técnica estiver firme.",
];



export { COMBOS, OPPONENTS, GAME_VARIATIONS, LOSING_FIXES, GOLDEN_RULES };
