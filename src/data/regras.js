/* CAMPEONATO COM REGRA — o acervo de regras e os formatos
   ======================================================================
   Campeonato normal não levanta o nível de ninguém: cada um joga do jeito
   que já joga, ganha ou perde, e vai embora igual. O que muda o jogo é uma
   regra que PROÍBE a saída fácil — aquela que você usa quando a bola fica
   difícil e que é justamente a que precisa sumir.

   POR QUE CADA REGRA É TÃO DESCRITIVA
   Regra curta quebra no primeiro ponto em que os dois discordam, e aí o
   campeonato para para discutir em vez de treinar. Então cada regra aqui
   traz, além do resumo:

     · comoFunciona — o passo a passo, sem depender de bom senso;
     · vale — a partir de qual bola e para quem;
     · punicao — o que acontece exatamente quando alguém quebra;
     · juiz — o que olhar, concretamente, de fora da mesa;
     · duvidas — as discussões que VÃO aparecer, já decididas.

   As dúvidas são a parte que mais importa. Não são perguntas hipotéticas:
   são os casos de borda que travam um jogo de verdade (a bola que cai no
   meio, o saque que ninguém tocou, o efeito que saiu mais fraco). Com elas
   escritas, a resposta já está combinada antes de alguém precisar dela.

   O nível: 1 dá para jogar hoje sem pensar muito, 2 exige atenção e o jogo
   cai de ritmo no começo, 3 vira outro esporte por uns minutos — e é onde
   mais se aprende, se o grupo aguentar.

   DUAS RAQUETES BASTAM. Numa mesa só, jogam sempre dois. Quem está fora não
   precisa de raquete: apita. */

export const CATEGORIAS = [
  { id: "abre", nome: "Saída do backspin", cor: "#F26B21", alvo: "abrir a bola cortada em vez de empurrar de volta" },
  { id: "curto", nome: "Jogo curto", cor: "#1E5A8A", alvo: "a cozinhada: controlar a bola baixa perto da rede" },
  { id: "ataque", nome: "Drive e ataque", cor: "#D14A32", alvo: "terminar o ponto em vez de esperar o erro do outro" },
  { id: "defesa", nome: "Defesa e bloqueio", cor: "#7A4FE0", alvo: "aguentar o topspin do outro sem recuar" },
  { id: "saque", nome: "Saque e devolução", cor: "#2FA36B", alvo: "as duas bolas que decidem metade dos pontos" },
  { id: "lados", nome: "Lados e pés", cor: "#1C6F63", alvo: "jogar o golpe do lado certo, e recuperar a posição entre as bolas" },
  { id: "cabeca", nome: "Cabeça", cor: "#D6A324", alvo: "o que você faz quando o ponto aperta" },
];

export const REGRAS = [
  /* ---------------- saída do backspin ---------------- */
  {
    id: "r-abre-tudo", cat: "abre", nivel: 2,
    nome: "Toda cortada tem que ser aberta",
    resumo: "Bola cortada não volta empurrada: tem que sair por cima, com giro para frente.",
    comoFunciona: [
      "Bola com backspin — cortada do adversário, ou o próprio saque cortado — só pode ser devolvida com um golpe que passe por cima da bola e coloque giro para frente.",
      "Empurrar está proibido: raquete aberta, braço indo reto para frente, bola saindo sem giro. Mesmo que caia na mesa.",
      "Bola sem efeito ou com topspin não entra na regra. Essas você devolve como quiser.",
    ],
    vale: "Do saque até a última bola do ponto, para os dois jogadores.",
    punicao: "Empurrou: ponto do adversário, na hora, mesmo que a bola tenha caído.",
    juiz: "Olha o movimento da raquete, não onde a bola cai. Raquete aberta e braço reto é empurrada; raquete fechando e braço subindo é abertura.",
    duvidas: [
      { p: "E se a bola vier curta demais para abrir?", r: "A regra continua valendo, mas toque curto de volta não é empurrada. O que está proibido é empurrar longo. Se não dá para abrir, toca curto." },
      { p: "Abri e a bola foi para fora. Perdi por errar ou por quebrar a regra?", r: "Por errar, normal — o ponto é do outro de qualquer jeito. A regra só pune quem NÃO tentou." },
      { p: "O saque cortado também tem que ser aberto?", r: "Sim. A devolução de saque cortado é a bola que mais dói no campeonato e a que mais importa aqui." },
    ],
    aviso: "É a regra que mais dói e a que mais resolve. Espere errar muito nos primeiros 10 pontos — é assim que ela funciona.",
  },
  {
    id: "r-abre-premio", cat: "abre", nivel: 1,
    nome: "Abriu e ganhou, vale 2",
    resumo: "Quem abre a primeira bola cortada do ponto e ganha esse ponto marca 2 em vez de 1.",
    comoFunciona: [
      "O ponto corre normal: nada está proibido.",
      "O juiz guarda uma informação só: quem foi o primeiro a abrir uma bola cortada.",
      "Se essa pessoa ganhar o ponto, marca 2. Se perder, o adversário marca 1 normal.",
    ],
    vale: "Em todos os pontos do game, para os dois.",
    punicao: "Nenhuma. Esta regra premia em vez de punir.",
    juiz: "Uma pergunta por ponto: quem abriu primeiro? Se ninguém abriu, o ponto vale 1 e acabou.",
    duvidas: [
      { p: "E se os dois abrirem no mesmo ponto?", r: "Vale para quem abriu PRIMEIRO. Se essa pessoa perder o ponto, o outro marca 1 normal — não herda o prêmio." },
      { p: "Abertura fraca, que mal passou da rede, conta?", r: "Conta. O critério é o movimento, não a qualidade — senão vira discussão de gosto a cada ponto." },
    ],
    placar: "2 pontos no ponto ganho abrindo",
    aviso: "Versão gentil da regra de cima: premia em vez de punir. Boa para abrir o dia, ou para quem ainda erra muito a abertura.",
  },
  {
    id: "r-abre-terceira", cat: "abre", nivel: 2,
    nome: "Terceira bola é obrigatória",
    resumo: "Quem saca tem que atacar a terceira bola do ponto, seja qual for a devolução.",
    comoFunciona: [
      "Conta-se assim: saque é a bola 1, a devolução do adversário é a bola 2, e a bola 3 é do sacador.",
      "Essa bola 3 tem que ser atacada — giro para frente, movimento por cima da bola.",
      "Se a devolução veio curta, o sacador tem que chegar nela com o pé e atacar de perto assim mesmo.",
    ],
    vale: "Só para quem está sacando, e só na bola 3.",
    punicao: "Não atacou a bola 3: ponto do adversário.",
    juiz: "Conta as bolas em voz alta — um, dois, TRÊS — e na terceira olha só se o movimento foi de ataque.",
    duvidas: [
      { p: "E se a devolução for tão boa que é impossível atacar?", r: "Continua sendo ponto do adversário. É o preço da regra, e é exatamente ele que ensina a sacar já pensando na bola 3." },
      { p: "A bola 3 pode ser um toque curto agressivo?", r: "Não. Tem que ser ataque com giro para frente. Flick curto não cumpre." },
      { p: "E se o adversário errar a devolução?", r: "Ponto do sacador, normal. A regra só cobra se a bola 3 chegar a existir." },
    ],
  },
  {
    id: "r-abre-bh", cat: "abre", nivel: 3,
    nome: "Abrir de backhand também",
    resumo: "Cortada que cai no lado do backhand tem que ser aberta de backhand, sem contornar.",
    comoFunciona: [
      "Cortada no lado do forehand: abre de forehand, normal.",
      "Cortada no lado do backhand: abre de backhand, ali mesmo onde a bola caiu.",
      "Atravessar o pé para abrir tudo de forehand está proibido nesta regra.",
    ],
    vale: "Só nas bolas cortadas. Bola sem efeito ou com topspin, joga como quiser.",
    punicao: "Contornou, ou empurrou de backhand em vez de abrir: ponto do adversário.",
    juiz: "Olha os pés. Se o pé de trás atravessou para o lado do backhand, contornou.",
    duvidas: [
      { p: "E a bola que cai bem no meio?", r: "O meio é do backhand nesta regra. Combinem isso antes do primeiro ponto e ninguém discute depois." },
      { p: "Sou canhoto, muda alguma coisa?", r: "Não. Lado do backhand é o lado da sua mão de backhand, seja qual for." },
      { p: "Posso abrir de backhand com pouco giro, só para cumprir?", r: "Pode, e é assim que se começa. O juiz cobra o movimento por cima, não a potência." },
    ],
    aviso: "Quase todo mundo só sabe abrir de forehand e passa a vida fugindo do backhand. Esta regra expõe isso em dois pontos.",
  },
  {
    id: "r-abre-sem-medo", cat: "abre", nivel: 3,
    nome: "Empurrou, perdeu — nos dois lados",
    resumo: "Nenhuma bola pode sair da sua raquete sem giro, em nenhum momento do ponto.",
    comoFunciona: [
      "Vale a regra de abrir toda cortada, e mais: toda bola que você manda tem que ter giro, para frente ou cortado de propósito.",
      "Bola boba, no meio da mesa, sem giro nenhum, é falta de quem mandou.",
      "Toque curto com corte de verdade continua valendo. O que não pode é a bola morta.",
    ],
    vale: "Todas as bolas do ponto, para os dois.",
    punicao: "Mandou bola sem giro: ponto do adversário, mesmo que ela caia na mesa.",
    juiz: "Olha a bola depois do quique: bola sem giro quica e segue reta e morta; com giro ela salta ou freia. Na dúvida, deixa passar — a regra é para punir a bola obviamente sem nada.",
    duvidas: [
      { p: "E quando eu só alcanço a bola de raspão?", r: "Bola de emergência não é punida. A regra vale para quem escolheu jogar mole, não para quem foi salvar a bola." },
      { p: "Quem decide se tinha giro?", r: "O juiz, e não se discute. Por isso esta regra pede um juiz que o grupo respeite." },
    ],
    aviso: "Nível 3 de verdade. Use em um game curto, não no campeonato inteiro.",
  },

  /* ---------------- jogo curto ---------------- */
  {
    id: "r-curto-saque", cat: "curto", nivel: 1,
    nome: "Todo saque tem que ser curto",
    resumo: "O saque tem que quicar duas vezes na mesa do adversário.",
    comoFunciona: [
      "Saque curto é o que, se ninguém tocasse nele, quicaria duas vezes antes de sair pela linha de fundo.",
      "Qualquer efeito e qualquer direção valem — só o comprimento está preso.",
      "A devolução é livre: a regra acaba no saque.",
    ],
    vale: "Só no saque, para os dois.",
    punicao: "Saque longo: ponto do adversário. Não existe segundo saque.",
    juiz: "Fica de pé na lateral, na altura da linha de fundo do recebedor, e olha o segundo quique.",
    duvidas: [
      { p: "E se o adversário devolver um saque que era longo?", r: "O juiz canta 'longo' assim que a bola passa da linha sem o segundo quique, e o ponto acaba ali. Não importa se o outro chegou a devolver." },
      { p: "Saque que bate na rede e fica curto?", r: "Repete, como em qualquer jogo. Esta regra não muda o que já é regra do esporte." },
      { p: "E se eu não conseguir sacar curto de jeito nenhum?", r: "Então esta é a regra certa para você hoje. Saca mais devagar e com o primeiro quique mais perto da sua própria rede." },
    ],
  },
  {
    id: "r-curto-duas", cat: "curto", nivel: 2,
    nome: "Duas curtas antes de abrir",
    resumo: "As duas primeiras bolas de cada lado ficam curtas. O ponto só abre a partir da quinta.",
    comoFunciona: [
      "Saque curto (bola 1), devolução curta (bola 2), segunda curta do sacador (bola 3), segunda do recebedor (bola 4).",
      "Da bola 5 em diante o ponto libera e cada um joga como quiser.",
      "Curto aqui quer dizer: a bola não passa da metade da mesa do adversário.",
    ],
    vale: "Da bola 1 até a bola 4, para os dois.",
    punicao: "Alongou antes da bola 5: ponto do adversário.",
    juiz: "Conta as bolas e olha onde cada uma cai. Passou da metade antes da bola 5, é falta.",
    duvidas: [
      { p: "E se a bola sair longa sem querer?", r: "É falta igual. A regra não pergunta a intenção — se perguntasse, não daria para arbitrar." },
      { p: "Posso atacar uma bola curta na bola 3?", r: "Não. Até a bola 4 é tudo curto, e flick também é ataque." },
      { p: "Onde fica 'a metade da mesa' exatamente?", r: "Na linha imaginária no meio do caminho entre a rede e o fundo. Combinem olhando a mesa antes de começar; na dúvida do juiz, o ponto repete." },
    ],
  },
  {
    id: "r-curto-longa", cat: "curto", nivel: 2,
    nome: "Quem alonga, entrega",
    resumo: "Na fase curta, quem manda a primeira bola longa entrega a bola — e se o outro atacar e ganhar, vale 2.",
    comoFunciona: [
      "O ponto começa curto, como na regra de cima.",
      "Quem manda a primeira bola que passa da metade não perde o ponto: o ponto corre normalmente.",
      "Se o adversário atacar justamente essa bola e ganhar o ponto, ele marca 2 em vez de 1.",
    ],
    vale: "Da bola 1 até a primeira bola longa do ponto.",
    punicao: "Nenhuma direta. A punição é o adversário poder marcar dobrado.",
    juiz: "Marca quem alongou primeiro e avisa alto: 'bola longa, vale 2'. Se quem alongou ainda ganhar o ponto, vale 1 normal.",
    duvidas: [
      { p: "E se o adversário não atacar a bola longa?", r: "Ponto normal, vale 1 para quem ganhar. O prêmio é só de quem atacou a bola entregue." },
      { p: "O saque longo conta como alongar?", r: "Conta, e é o caso mais comum de todos. Quem saca longo já entregou o ponto." },
      { p: "Ataquei a bola entregue mas perdi o ponto. E aí?", r: "Ponto do outro, valendo 1. O prêmio é por ganhar atacando, não por atacar." },
    ],
    placar: "2 pontos para quem ataca a bola entregue",
    aviso: "Melhor que punir: ensina que alongar cedo tem preço, sem parar o rali para marcar falta.",
  },
  {
    id: "r-curto-varia", cat: "curto", nivel: 3,
    nome: "Não repete o lugar",
    resumo: "Na fase curta, ninguém devolve duas vezes seguidas na mesma faixa da mesa.",
    comoFunciona: [
      "A mesa do adversário é dividida em três faixas no olho: forehand, meio, backhand.",
      "A sua bola curta não pode cair na mesma faixa da sua bola curta anterior.",
      "Vale só enquanto o ponto está curto; quando a bola abre, a regra sai de cena.",
    ],
    vale: "Enquanto as bolas estiverem curtas, para os dois.",
    punicao: "Repetiu a faixa: ponto do adversário.",
    juiz: "Guarda só a última faixa de cada um. Caiu de novo na mesma, aponta e marca.",
    duvidas: [
      { p: "E a bola bem em cima da linha entre duas faixas?", r: "O juiz escolhe uma e fala alto. A decisão dele vale, mesmo que os dois discordem." },
      { p: "Preciso variar também depois que o ponto abre?", r: "Não. Quando a bola fica longa, a regra acaba para o resto do ponto." },
    ],
  },

  /* ---------------- drive e ataque ---------------- */
  {
    id: "r-atk-cinco", cat: "ataque", nivel: 1,
    nome: "Nenhum ponto passa de 5 bolas",
    resumo: "Chegou na 6ª bola do rali, o ponto morre e ninguém marca.",
    comoFunciona: [
      "Conta-se toda bola que cruza a rede, do saque em diante: o saque é a bola 1.",
      "Quando alguém vai bater a bola 6, o juiz grita 'morreu' e o ponto acaba sem ninguém pontuar.",
      "O saque volta para quem sacou, como se o ponto não tivesse acontecido.",
    ],
    vale: "Todos os pontos.",
    punicao: "Ninguém marca — os dois perdem o ponto. É a única regra do acervo sem vencedor.",
    juiz: "Conta alto: um, dois, três, quatro, cinco — MORREU. Contar alto é obrigatório, senão os dois jogam a bola 6 sem saber.",
    duvidas: [
      { p: "E se o ponto acabar naturalmente na bola 5?", r: "Marca normal. A regra só corta o que passaria de 5." },
      { p: "O saque conta como bola 1?", r: "Conta. Na prática cada um bate duas vezes e o ponto tem que morrer ali." },
      { p: "Bola que bate na rede e passa mesmo assim?", r: "Conta como uma bola, igual." },
    ],
    aviso: "É a regra que mais tira gente da zona de conforto sem exigir técnica nova. Em dois games o grupo inteiro começa a atacar.",
  },
  {
    id: "r-atk-primeiro", cat: "ataque", nivel: 1,
    nome: "Quem ataca primeiro leva mais",
    resumo: "Ponto ganho com bola atacada vale 2. Ponto ganho esperando o erro do outro vale 1.",
    comoFunciona: [
      "O ponto corre normal, sem nada proibido.",
      "Quando ele acaba, o juiz olha a ÚLTIMA bola de quem ganhou.",
      "Se foi ataque — giro para frente, movimento por cima da bola — vale 2. Se foi devolução, bloqueio, ou o adversário errou sozinho, vale 1.",
    ],
    vale: "Todos os pontos, para os dois.",
    punicao: "Nenhuma. A regra só muda quanto vale o ponto.",
    juiz: "Uma pergunta por ponto: a última bola de quem ganhou foi um ataque? Sim, 2. Não, 1.",
    duvidas: [
      { p: "O adversário errou sozinho depois do meu ataque. Vale 2?", r: "Vale 2. A sua última bola foi ataque, e foi ela que forçou o erro." },
      { p: "Bloqueio forte conta como ataque?", r: "Não. Bloqueio é passivo por definição: você usa a força da bola dele em vez da sua." },
    ],
    placar: "2 pontos no ponto ganho atacando",
  },
  {
    id: "r-atk-bloqueio", cat: "ataque", nivel: 2,
    nome: "Dois bloqueios e acabou",
    resumo: "Depois de dois bloqueios seguidos, o terceiro tem que ser contra-ataque.",
    comoFunciona: [
      "Bloqueio é devolver a bola atacada sem dar força própria — só colocando a raquete.",
      "Você pode bloquear duas vezes seguidas. Na terceira bola da sequência, tem que atacar.",
      "Se no meio da sequência você atacar, a conta zera e você ganha dois bloqueios de novo.",
    ],
    vale: "Para quem está defendendo, dentro de uma mesma sequência de ataques do adversário.",
    punicao: "Bloqueou três vezes seguidas: ponto do adversário.",
    juiz: "Conta os bloqueios de quem está defendendo, em voz alta: 'um... dois... tem que virar'.",
    duvidas: [
      { p: "E se o ataque dele for forte demais para contra-atacar?", r: "Continua sendo falta. É exatamente isso que a regra treina: achar a bola para virar antes de ficar encurralado." },
      { p: "Dar um passo atrás e devolver com giro conta como contra-ataque?", r: "Conta, desde que você tenha dado força própria na bola." },
    ],
  },
  {
    id: "r-atk-alta", cat: "ataque", nivel: 1,
    nome: "Bola alta é ponto do outro",
    resumo: "Bola que sobe acima da altura da cabeça entrega o ponto na hora.",
    comoFunciona: [
      "Se a bola que sai da sua raquete passa acima da cabeça de quem está em pé junto à mesa, o ponto acaba ali.",
      "Não importa se ela ia cair na mesa: o ponto é do adversário.",
      "Vale para qualquer bola do ponto, inclusive o saque.",
    ],
    vale: "Todas as bolas, para os dois.",
    punicao: "Ponto do adversário, imediato.",
    juiz: "Fica de pé na lateral e usa a cabeça dos jogadores como régua. Passou claramente por cima, canta.",
    duvidas: [
      { p: "E o lob de defesa, que é para ser alto mesmo?", r: "Está proibido nesta regra. É justamente o hábito que ela quer tirar." },
      { p: "Bola alta que o adversário mata. Conta o quê?", r: "Ponto do adversário de qualquer jeito — mesmo resultado, sem discussão." },
      { p: "E se ela passou só um pouquinho acima?", r: "Na dúvida o juiz deixa passar. A regra é para a bola obviamente alta, não para o milímetro." },
    ],
    aviso: "A regra mais barata do acervo: quase não precisa de arbitragem e some com a bola de defesa preguiçosa.",
  },

  /* ---------------- defesa e bloqueio ---------------- */
  {
    id: "r-def-muda", cat: "defesa", nivel: 2,
    nome: "Bloqueio tem que mudar de direção",
    resumo: "Todo bloqueio devolve para a metade oposta de onde a bola veio.",
    comoFunciona: [
      "Veio atacada do lado direito da mesa dele: seu bloqueio tem que cair no lado esquerdo.",
      "Veio do lado esquerdo: cai no direito.",
      "Veio pelo meio: vale qualquer um dos lados, menos o meio.",
    ],
    vale: "Só nos bloqueios. Contra-ataque vai para onde quiser.",
    punicao: "Bloqueou de volta no mesmo lado de onde veio: ponto do adversário.",
    juiz: "Olha de onde a bola saiu e onde o bloqueio caiu. É a única coisa a acompanhar no ponto.",
    duvidas: [
      { p: "O que conta como 'lado'?", r: "Metade da mesa, dividida pela linha do meio. Não precisa ser na ponta — basta atravessar o meio." },
      { p: "Bloqueei e a bola pegou a rede e caiu do lado errado.", r: "Rede é sorte, não é falta. O ponto corre normal." },
    ],
    aviso: "É a regra que ensina o bloqueio a ser uma arma em vez de um empurrão de sobrevivência.",
  },
  {
    id: "r-def-dobro", cat: "defesa", nivel: 1,
    nome: "Defendeu e virou, vale 2",
    resumo: "Ponto ganho depois de ter defendido pelo menos um ataque vale 2.",
    comoFunciona: [
      "O ponto corre normal.",
      "Se no meio dele o adversário atacou, você aguentou, e depois você ganhou o ponto: vale 2.",
      "Se você ganhou sem nunca ter sido atacado, vale 1.",
    ],
    vale: "Todos os pontos, para os dois.",
    punicao: "Nenhuma.",
    juiz: "Teve ataque do outro lado no meio do ponto? Se quem defendeu ganhou, 2.",
    duvidas: [
      { p: "Vale se eu defendi e ele errou a bola seguinte?", r: "Vale 2. Defender e forçar o erro é ganhar o ponto." },
      { p: "E se os dois atacaram e os dois defenderam?", r: "Vale 2 para quem ganhou, porque ele também defendeu em algum momento." },
    ],
    placar: "2 pontos no ponto ganho depois de defender",
  },
  {
    id: "r-def-perto", cat: "defesa", nivel: 3,
    nome: "Proibido recuar",
    resumo: "Ninguém bate a bola com os dois pés atrás da linha marcada no chão.",
    comoFunciona: [
      "Antes de começar, marquem uma linha no chão a um passo da linha de fundo: uma garrafa de cada lado, uma mochila, uma fita.",
      "Você pode se mexer dentro desse espaço, mas não pode bater a bola com os dois pés atrás da marca.",
      "Vale para os dois jogadores, o game inteiro.",
    ],
    vale: "Todas as bolas.",
    punicao: "Bateu de trás da marca: ponto do adversário.",
    juiz: "Olha só os pés no momento do toque. Fica de pé na lateral, na altura da marca, para enxergar a linha.",
    duvidas: [
      { p: "E se ele me empurrar para trás com um ataque forte?", r: "Aí é ponto dele. É esse o ponto da regra: não dá para resolver fugindo da mesa." },
      { p: "Um pé atrás e um na frente?", r: "Vale. Só é falta com os dois atrás da marca." },
      { p: "A que distância fica a marca?", r: "Um passo largo atrás da linha de fundo. Perto demais vira sorteio; longe demais a regra não faz nada." },
    ],
    aviso: "É a regra que mata o hábito de fugir da mesa quando o topspin vem forte.",
  },
  {
    id: "r-def-longo", cat: "defesa", nivel: 2,
    nome: "Defesa tem que ir longa",
    resumo: "Bola devolvida sob pressão tem que cair no terço do fundo da mesa.",
    comoFunciona: [
      "Quando o adversário ataca e você devolve, a sua bola tem que cair no terço do fundo da mesa dele.",
      "Devolução curta ou no meio, que entrega a bola de graça para ele atacar de novo, é falta.",
      "Quando você é quem está atacando, a regra não vale — ataque cai onde quiser.",
    ],
    vale: "Só nas bolas devolvidas logo depois de um ataque do adversário.",
    punicao: "Defesa curta: ponto do adversário.",
    juiz: "Divide a mesa em três de olho. Caiu no terço do fundo, vale; caiu antes, falta.",
    duvidas: [
      { p: "E se eu quiser dar um toque curto de surpresa?", r: "Nesta regra não pode. Ela existe justamente porque a defesa curta na pressão quase sempre é medo, não surpresa." },
      { p: "A bola bateu na quina do fundo.", r: "Quina do fundo é o terço do fundo. Vale." },
    ],
  },

  /* ---------------- saque e devolução ---------------- */
  {
    id: "r-sq-varia", cat: "saque", nivel: 1,
    nome: "Saque nunca repete",
    resumo: "Não pode sacar duas vezes seguidas igual: ou muda o efeito, ou muda o lugar.",
    comoFunciona: [
      "Dois saques seguidos não podem ter ao mesmo tempo o mesmo efeito e o mesmo destino.",
      "Mudar só o efeito já cumpre. Mudar só o lugar também.",
      "Como cada um saca duas vezes seguidas, na prática é entre os seus dois saques que a regra pega.",
    ],
    vale: "Todos os saques.",
    punicao: "Repetiu efeito E lugar: ponto do adversário.",
    juiz: "Guarda o saque anterior de quem está sacando. Só isso.",
    duvidas: [
      { p: "Efeito parecido conta como igual?", r: "O critério é grosso de propósito: cortado, sem efeito, lateral ou por cima. Trocar entre esses quatro já cumpre." },
      { p: "Errei o saque. O próximo pode ser igual ao que errei?", r: "Não. Saque errado conta como saque dado." },
    ],
  },
  {
    id: "r-sq-anunciado", cat: "saque", nivel: 2,
    nome: "Saque anunciado",
    resumo: "Antes de sacar, o sacador diz em voz alta o efeito que vai colocar — e tem que cumprir.",
    comoFunciona: [
      "O sacador fala uma das quatro palavras: 'cortado', 'sem efeito', 'lateral' ou 'por cima'.",
      "Depois saca, e o efeito tem que ser o que ele anunciou.",
      "O recebedor sabe o que vem — e ainda assim vai errar muito. É esse o ponto.",
    ],
    vale: "Todos os saques.",
    punicao: "Sacou calado, ou saiu efeito diferente do anunciado: ponto do adversário.",
    juiz: "Ouve o que foi dito e olha o que a bola faz no quique: cortada freia, por cima salta para frente, lateral desvia.",
    duvidas: [
      { p: "E se o efeito sair mais fraco do que eu queria?", r: "Continua valendo, desde que seja daquele tipo. A regra pede o tipo, não a intensidade." },
      { p: "O recebedor pode fingir que não ouviu?", r: "Não. Se o sacador falou e o juiz ouviu, está dito. Se o juiz não ouviu, o saque repete." },
    ],
    aviso: "Parece que entrega o jogo e não entrega: o outro sabe o efeito e continua errando. Mostra para o grupo que saque bom não é saque escondido — é saque com qualidade.",
  },
  {
    id: "r-sq-bh", cat: "saque", nivel: 2,
    nome: "Devolução só de backhand",
    resumo: "Toda devolução de saque é de backhand, esteja a bola onde estiver.",
    comoFunciona: [
      "O saque pode ir para qualquer lugar da mesa.",
      "A devolução — só ela, a bola 2 — tem que ser de backhand.",
      "Da bola 3 em diante o ponto é livre.",
    ],
    vale: "Só na devolução de saque.",
    punicao: "Devolveu de forehand: ponto do sacador.",
    juiz: "Olha o lado da raquete na bola 2. É a única bola a acompanhar no ponto.",
    duvidas: [
      { p: "Saque na ponta do meu forehand, dá para chegar de backhand?", r: "Dá, atravessando o pé. É isso que a regra treina." },
      { p: "E se eu simplesmente não alcançar?", r: "Ponto do sacador. A regra é dura de propósito." },
    ],
  },
  {
    id: "r-sq-dois", cat: "saque", nivel: 1,
    nome: "Dois saques ruins e a bola é do outro",
    resumo: "Errou dois saques no game, o saque passa para o adversário pelo resto do game.",
    comoFunciona: [
      "Saque errado é o que vai na rede, sai da mesa, ou é falta de alguma outra regra combinada.",
      "Na segunda vez, o adversário passa a sacar todos os pontos restantes do game.",
      "Os pontos dos saques errados continuam contando para o adversário, normal.",
    ],
    vale: "Dentro de cada game. A conta zera no game seguinte.",
    punicao: "Perde o direito de sacar pelo resto do game.",
    juiz: "Duas marquinhas por jogador. É a arbitragem mais barata do acervo.",
    duvidas: [
      { p: "Saque que bate na rede e cai do outro lado conta como erro?", r: "Não: isso repete, como em qualquer jogo." },
      { p: "E se eu perder o saque logo no começo do game?", r: "O adversário saca o game inteiro. É esse o tamanho do prejuízo, e é o que faz a regra funcionar." },
    ],
  },
  {
    id: "r-sq-escolhido", cat: "saque", nivel: 3,
    nome: "O adversário escolhe o saque",
    resumo: "Antes de cada ponto, quem recebe diz qual efeito o sacador tem que usar.",
    comoFunciona: [
      "O recebedor fala alto: 'cortado', 'sem efeito', 'lateral' ou 'por cima'.",
      "O sacador tem que sacar aquele efeito. O lugar e a velocidade continuam livres.",
      "O recebedor escolhe antes de o sacador tomar posição.",
    ],
    vale: "Todos os saques.",
    punicao: "Sacou efeito diferente do pedido: ponto do recebedor.",
    juiz: "Ouve o pedido e confere o quique, do mesmo jeito que no saque anunciado.",
    duvidas: [
      { p: "Posso pedir sempre o mesmo efeito?", r: "Pode. E é o que vai acontecer: cada um vai descobrir na hora qual saque do colega ele não sabe devolver." },
      { p: "E se o sacador não souber fazer o efeito pedido?", r: "Ele vai perder pontos até aprender. É para isso que a regra serve." },
      { p: "O recebedor pode mudar de ideia depois de falar?", r: "Não. Falou, valeu — senão vira jogo de nervo em vez de treino." },
    ],
    aviso: "A regra mais reveladora do acervo. Em um game o grupo inteiro descobre quais saques cada um tem de verdade.",
  },

  /* ---------------- lados e pés ---------------- */
  {
    id: "r-lad-cada", cat: "lados", nivel: 2,
    nome: "Cada lado com seu golpe",
    resumo: "Bola que cai no lado do backhand é jogada de backhand; bola no lado do forehand, de forehand.",
    comoFunciona: [
      "A mesa é dividida ao meio. O lado da sua mão de backhand é o lado do backhand.",
      "Bola que quica nesse lado tem que ser jogada de backhand, ali mesmo, sem atravessar o pé.",
      "Bola que quica no lado do forehand tem que ser jogada de forehand.",
    ],
    vale: "Todas as bolas do ponto, menos o saque.",
    punicao: "Jogou o golpe errado para o lado, ou contornou: ponto do adversário.",
    juiz: "Olha onde a bola quicou e qual lado da raquete tocou nela. Não precisa olhar os pés.",
    duvidas: [
      { p: "E a bola que cai bem no meio?", r: "Combinem antes do primeiro ponto: o meio é do backhand (é o mais comum) ou do forehand. Uma vez combinado, vale o game inteiro para os dois." },
      { p: "A bola quicou no meu backhand mas pulou para o lado do forehand. Qual vale?", r: "Vale onde ela QUICOU, não onde você pegou. Senão vira discussão em todo ponto." },
      { p: "O saque entra na regra?", r: "Não. Quem saca escolhe onde a bola cai, então a regra não faria sentido no saque." },
      { p: "E a bola que não quica no meu lado, que eu pego no ar?", r: "Ponto do adversário de qualquer jeito: bola pegada antes do quique já é falta no tênis de mesa." },
    ],
    aviso: "Parece limitante e é o contrário: é a regra que constrói o backhand de quem só sabe contornar. Quase todo jogador de clube passa a vida fugindo do backhand — aqui não dá.",
  },
  {
    id: "r-lad-contorna", cat: "lados", nivel: 3,
    nome: "Contorna tudo: só forehand",
    resumo: "O game inteiro sem backhand: tudo que chega no lado do backhand tem que ser contornado com o pé.",
    comoFunciona: [
      "Toda bola é jogada de forehand, caia onde cair.",
      "Bola no lado do backhand exige atravessar o pé e girar o corpo para pegá-la de forehand.",
      "É o oposto exato da regra de cima. As duas em games alternados formam o par mais completo do acervo.",
    ],
    vale: "Todas as bolas, menos o saque.",
    punicao: "Bateu de backhand: ponto do adversário.",
    juiz: "Olha o lado da raquete. Sem meio-termo.",
    duvidas: [
      { p: "E quando a bola vem rápida no meu backhand e não dá tempo?", r: "Ponto do adversário. É o preço, e é ele que faz o pé andar." },
      { p: "Posso segurar a raquete de outro jeito?", r: "Pode fazer o que quiser com a mão, desde que a bola saia do lado do forehand da raquete." },
    ],
    aviso: "Cansa muito e melhora o pé de todo mundo. Um game, não o campeonato inteiro.",
  },
  {
    id: "r-lad-meio", cat: "lados", nivel: 2,
    nome: "Volta ao meio entre as bolas",
    resumo: "Depois de cada bola, os dois pés têm que passar pelo meio antes da bola seguinte.",
    comoFunciona: [
      "Marquem o meio com uma fita no chão ou uma garrafa atrás de cada lado da mesa.",
      "Bateu a bola, você volta para o meio. Só depois sai de novo para a próxima.",
      "Não precisa PARAR no meio: precisa passar por ele.",
    ],
    vale: "Entre todas as bolas do mesmo ponto.",
    punicao: "Bateu duas bolas seguidas sem passar pelo meio: ponto do adversário.",
    juiz: "Fica atrás do jogador que está defendendo e olha os pés entre uma bola e outra.",
    duvidas: [
      { p: "E quando as bolas vêm muito rápidas?", r: "Aí é ponto do adversário. A regra pune exatamente quem não recupera a tempo, que é o erro que ela treina." },
      { p: "Preciso voltar depois da última bola do ponto?", r: "Não. A regra só vale entre bolas do mesmo ponto." },
      { p: "E se as duas bolas vierem no mesmo lugar?", r: "Vale igual: sai, volta ao meio, sai de novo. É aí que a maioria quebra a regra sem perceber." },
    ],
    aviso: "A recuperação é o que separa quem joga bem uma bola de quem joga bem um rali. Ninguém treina isso sozinho.",
  },
  {
    id: "r-lad-meia", cat: "lados", nivel: 1,
    nome: "Meia mesa para quem está ganhando",
    resumo: "Quem lidera a classificação só pode jogar em metade da mesa; o outro joga a mesa inteira.",
    comoFunciona: [
      "Antes da partida, olhem a classificação: quem está na frente joga com meia mesa.",
      "A metade é escolhida por quem está atrás, antes do primeiro ponto, e vale a partida toda.",
      "Bola de quem lidera que cai na metade proibida é ponto do adversário.",
    ],
    vale: "Todas as bolas de quem lidera, menos o saque.",
    punicao: "Caiu na metade proibida: ponto do adversário.",
    juiz: "Olha um lado só da mesa, o proibido. Caiu lá, canta.",
    duvidas: [
      { p: "E se dois estiverem empatados na liderança?", r: "Vale para os dois quando jogarem entre si. Contra os outros, vale para quem estiver na frente." },
      { p: "A bola que cai em cima da linha do meio?", r: "Linha do meio é boa. Só é falta o que cai claramente na metade proibida." },
    ],
    aviso: "É o que mantém o grupo inteiro competindo em vez de duas pessoas dominando o dia. E para quem lidera é o melhor treino de precisão que existe.",
  },

  /* ---------------- cabeça ---------------- */
  {
    id: "r-cb-falado", cat: "cabeca", nivel: 2,
    nome: "Ponto falado",
    resumo: "Antes de sacar, o sacador diz em voz alta como pretende terminar o ponto.",
    comoFunciona: [
      "Exemplos que valem: 'abro na terceira', 'ataco o backhand dele', 'seguro curto e espero a longa'.",
      "Não precisa CUMPRIR. Precisa dizer — e dizer um plano de verdade.",
      "'Vou ganhar' não vale: tem que dizer COMO.",
    ],
    vale: "Todos os saques.",
    punicao: "Sacou calado, ou disse algo vago: ponto do adversário.",
    juiz: "Ouve. Se não deu para entender o plano, pede para repetir uma vez; na segunda, marca.",
    duvidas: [
      { p: "E se meu plano der errado e eu tiver que improvisar?", r: "Improvisa à vontade. A regra cobra o plano, não o resultado." },
      { p: "Posso dizer o mesmo plano sempre?", r: "Pode. E vai descobrir rápido que o adversário começa a se preparar para ele." },
    ],
    aviso: "Obriga cada um a ter um plano. Metade do grupo vai descobrir que não tinha nenhum.",
  },
  {
    id: "r-cb-calado", cat: "cabeca", nivel: 1,
    nome: "Reclamou, perdeu",
    resumo: "Reclamar da bola, da mesa, do juiz ou de si mesmo custa o ponto.",
    comoFunciona: [
      "Vale xingar sozinho, bater na mesa, jogar a raquete, resmungar depois do erro.",
      "Vale também discutir a decisão do juiz: discutir é reclamar.",
      "Comemorar um ponto bom não é reclamar. Comemorar pode.",
    ],
    vale: "O tempo inteiro, inclusive entre os pontos.",
    punicao: "Ponto do adversário. Se o ponto ainda não começou, o adversário já começa ganhando 1.",
    juiz: "Decide na hora e não explica. Foi reclamação para ele, foi reclamação.",
    duvidas: [
      { p: "E se o juiz errar feio?", r: "Perde o ponto e segue. É esse o treino: em campeonato de verdade ninguém devolve o ponto que você jogou fora reclamando." },
      { p: "Posso pedir para repetir uma bola duvidosa?", r: "Pode pedir uma vez, sem tom de reclamação. A resposta do juiz é final." },
    ],
    aviso: "Parece piada e é o melhor treino de cabeça do acervo.",
  },
  {
    id: "r-cb-handicap", cat: "cabeca", nivel: 1,
    nome: "O melhor começa perdendo",
    resumo: "Quem está na frente da classificação começa cada partida 0 a 3 atrás.",
    comoFunciona: [
      "Antes de começar, olhem a classificação e ajustem o placar inicial.",
      "Se quem lidera continuar ganhando fácil, o grupo sobe para 0 a 4 na rodada seguinte.",
      "Quem está em último pode começar 1 a 0 na frente contra qualquer um.",
    ],
    vale: "Em todas as partidas de quem lidera.",
    punicao: "Não tem: é só o placar inicial.",
    juiz: "Confere o placar antes do primeiro saque.",
    duvidas: [
      { p: "E se o líder mudar no meio do campeonato?", r: "O handicap acompanha: vale sempre para quem está na frente NA HORA da partida." },
      { p: "Isso não é injusto?", r: "É a intenção. Campeonato equilibrado tem mais pontos disputados, e ponto disputado é o que treina." },
    ],
  },
  {
    id: "r-cb-longo", cat: "cabeca", nivel: 1,
    nome: "Rali longo vale mais",
    resumo: "Ponto que passou de 8 bolas vale 2 para quem ganhar.",
    comoFunciona: [
      "O juiz conta as bolas do ponto, do saque em diante.",
      "Passou de 8, ele avisa alto: 'esse vale 2'.",
      "Os dois ouvem e sabem que o ponto ficou caro — e é aí que ele fica bom.",
    ],
    vale: "Todos os pontos.",
    punicao: "Nenhuma.",
    juiz: "Conta alto a partir da bola 6, para os dois ouvirem o ponto chegando.",
    duvidas: [
      { p: "Vale 2 mesmo se eu ganhar porque ele errou?", r: "Vale. O ponto longo foi construído pelos dois." },
    ],
    placar: "2 pontos no ponto que passou de 8 bolas",
    aviso: "O contrário da regra das 5 bolas. Use quando o grupo estiver terminando tudo no braço, sem construir nada.",
  },
  {
    id: "r-cb-relampago", cat: "cabeca", nivel: 1,
    nome: "Game relâmpago de 5",
    resumo: "Partidas de 5 pontos, sem vantagem: no 4 a 4, o próximo ponto decide.",
    comoFunciona: [
      "Cada partida vai até 5 pontos.",
      "No 4 a 4 não tem vantagem: o ponto seguinte é o do jogo.",
      "Saque troca a cada 2 pontos, como sempre.",
    ],
    vale: "A partida inteira.",
    punicao: "Não tem.",
    juiz: "Só o placar. É a partida mais fácil de apitar do acervo.",
    duvidas: [
      { p: "Não é curto demais para medir quem é melhor?", r: "É — e é a intenção. Com partidas curtas o campeonato inteiro cabe no tempo, e cada ponto pesa." },
    ],
    aviso: "Boa para quando o grupo tem pouco tempo, ou para dar muitos confrontos diferentes na mesma tarde.",
  },
  {
    id: "r-cb-tres", cat: "cabeca", nivel: 1,
    nome: "Três segundos antes de sacar",
    resumo: "Entre o fim de um ponto e o saque seguinte, o sacador espera três segundos parado.",
    comoFunciona: [
      "Acabou o ponto, o sacador pega a bola e conta três segundos antes de sacar.",
      "Nesses três segundos ele fica parado, com a bola na mão, olhando a mesa.",
      "O adversário também espera: ninguém pode apressar.",
    ],
    vale: "Entre todos os pontos.",
    punicao: "Sacou antes: o ponto não conta e o saque é refeito. Na segunda vez no mesmo game, ponto do adversário.",
    juiz: "Conta em voz alta: um, dois, três — saca.",
    duvidas: [
      { p: "Isso não deixa o jogo chato?", r: "Deixa o jogo mais lento e o grupo mais calmo. Quem erra em sequência erra porque saca no automático, com a cabeça no ponto anterior." },
      { p: "E se eu estiver no ritmo e quiser continuar?", r: "Especialmente aí. A regra existe para quebrar o automático — inclusive o bom." },
    ],
    aviso: "É a regra que mais muda quem perde pontos em sequência quando fica nervoso.",
  },
];

export const regrasPorCategoria = (cat) => REGRAS.filter((r) => r.cat === cat);
export const regraPorId = (id) => REGRAS.find((r) => r.id === id);

export const NIVEIS = {
  1: { nome: "Dá para jogar hoje", cor: "#2FA36B" },
  2: { nome: "Exige atenção", cor: "#D6A324" },
  3: { nome: "Vira outro jogo", cor: "#D14A32" },
};

/* ---------- Formatos ----------
   A diferença entre os dois primeiros é QUANDO a regra troca, e isso muda
   quem chega a jogar com ela:

     · regra por rodada  — rápido, mas quem apita aquela rodada não joga
       aquela regra nenhuma vez;
     · regra por rodízio — cada regra dura um todos-contra-todos inteiro,
       então ninguém fica de fora de nenhuma regra.                        */
export const FORMATOS = [
  {
    id: "porregra",
    nome: "Uma regra por vez",
    resumo: "Cada regra vira um rodízio completo: todo mundo enfrenta todo mundo com aquela regra antes de trocar.",
    detalhe: [
      "Com 5 pessoas, cada regra são 10 partidas e cada um joga 4 vezes com ela.",
      "**Ninguém fica de fora de nenhuma regra** — é a diferença para o formato de baixo.",
      "Por isso, escolha poucas regras: duas já dão 20 partidas.",
      "A cada rodada, quem está de folga **apita**.",
    ],
    minJog: 3,
  },
  {
    id: "todos",
    nome: "Todos contra todos",
    resumo: "Um rodízio só, com a regra trocando a cada rodada. Mais rápido, mas quem apita a rodada não joga aquela regra.",
    detalhe: [
      "Com 5 pessoas são 10 partidas no total, em 5 rodadas.",
      "A regra troca sozinha quando a rodada vira.",
      "A cada rodada, quem está de folga **apita** — e não joga a regra daquela rodada.",
    ],
    minJog: 3,
  },
  {
    id: "rei",
    nome: "Rei da mesa",
    resumo: "Quem ganha fica, no máximo 2 vitórias seguidas. Sem tabela, sem fim marcado — para quando o grupo quiser.",
    detalhe: [
      "Os dois primeiros da lista começam; o resto entra na fila pela ordem.",
      "Quem está na frente da fila **apita** a partida que está rolando.",
      "A regra troca a cada 3 partidas, passando pelas que vocês escolheram.",
    ],
    minJog: 3,
  },
];

/* ---------- Tabela do todos-contra-todos ----------
   Método do círculo: fixa o primeiro e gira o resto. Com número ímpar de
   jogadores entra uma vaga vazia, e quem cai nela na rodada é o juiz — que
   é exatamente a função que faltava para quem não tem raquete. */
export function tabelaTodosContraTodos(jogadores) {
  const lista = [...jogadores];
  if (lista.length % 2 === 1) lista.push(null);   // null = folga, vira juiz
  const n = lista.length;
  const rodadas = [];
  let giro = lista.slice(1);
  for (let r = 0; r < n - 1; r++) {
    const ordem = [lista[0], ...giro];
    const jogos = [];
    let juiz = null;
    for (let i = 0; i < n / 2; i++) {
      const a = ordem[i], b = ordem[n - 1 - i];
      if (a === null) juiz = b;
      else if (b === null) juiz = a;
      else jogos.push([a, b]);
    }
    /* Com número par não sobra ninguém na vaga vazia, então o juiz é quem
       joga a última partida da rodada: ele apita as anteriores e depois entra. */
    if (!juiz && jogos.length) juiz = jogos[jogos.length - 1][0];
    rodadas.push({ jogos, juiz });
    giro = [giro[giro.length - 1], ...giro.slice(0, -1)];
  }
  return rodadas;
}

/* Um BLOCO é um pedaço do campeonato que roda sob UMA regra. É o que
   unifica os dois formatos de tabela: no "todos" cada bloco tem uma rodada
   só (a regra troca a cada rodada); no "porregra" cada bloco tem o rodízio
   inteiro (a regra dura até todo mundo ter jogado com ela). A tela desenha
   os dois do mesmo jeito. */
export function montarBlocos(formato, jogadores, escolhidas) {
  const rodadas = tabelaTodosContraTodos(jogadores);
  if (formato === "porregra") {
    const regras = escolhidas.length ? escolhidas : [null];
    return regras.map((regraId) => ({ regraId, rodadas }));
  }
  return rodadas.map((rd, i) => ({ regraId: regraDaVez(escolhidas, i), rodadas: [rd] }));
}

export const totalPartidas = (blocos) =>
  blocos.reduce((a, b) => a + b.rodadas.reduce((x, r) => x + r.jogos.length, 0), 0);

export const chaveDaPartida = (bi, ri, pi) => `b${bi}-r${ri}-p${pi}`;

/* Classificação a partir dos resultados já lançados.
   `resultados` é { chaveDaPartida: { vencedor, perdedor, bonus[], naRegra{} } }.

   `pr` (pontos na regra) não entra em `pts`: ele já se paga dentro da
   partida, porque cada ponto na regra vale 2 e portanto ajuda a vencer.
   Somá-lo de novo na classificação cobraria a mesma coisa duas vezes. Ele
   fica na tabela como medida de execução — quem mais fez o que a regra
   pedia, tendo ganhado ou não. */
export function classificacao(jogadores, resultados) {
  const base = {};
  jogadores.forEach((j) => { base[j] = { nome: j, pts: 0, v: 0, d: 0, regra: 0, pr: 0 }; });
  Object.values(resultados || {}).forEach((res) => {
    if (!res) return;
    Object.entries(res.naRegra || {}).forEach(([nome, n]) => {
      if (base[nome]) base[nome].pr += Number(n) || 0;
    });
    if (!res.vencedor) return;
    const v = base[res.vencedor];
    if (v) { v.pts += 2; v.v += 1; }
    if (res.perdedor && base[res.perdedor]) base[res.perdedor].d += 1;
    (res.bonus || []).forEach((nome) => {
      if (base[nome]) { base[nome].pts += 1; base[nome].regra += 1; }
    });
  });
  return Object.values(base).sort((a, b) =>
    b.pts - a.pts || b.v - a.v || b.pr - a.pr || b.regra - a.regra || a.nome.localeCompare(b.nome));
}

/* REI DA MESA — fila com limite de vitórias seguidas.
   `seguidas` é a sequência DE QUEM ESTÁ NA MESA, então anda junto com o nome
   do dono (`campeao`): sem isso, quem acabou de entrar e venceu herdava a
   sequência de quem ele derrubou e era mandado embora na hora. */
export function proximoJogo({ mesa, fila, seguidas, campeao }, vencedor) {
  const perdedor = mesa.find((j) => j !== vencedor);
  const sequencia = vencedor === campeao ? seguidas + 1 : 1;
  const novaFila = [...fila];
  let novaMesa, novasSeguidas, novoCampeao;
  if (sequencia >= 2 && novaFila.length >= 2) {
    /* Bateu o limite: sai junto com o perdedor e entram dois da fila. O
       perdedor entra na fila antes do vencedor — quem ganhou já jogou mais. */
    novaFila.push(perdedor, vencedor);
    novaMesa = [novaFila.shift(), novaFila.shift()];
    novasSeguidas = 0; novoCampeao = null;
  } else {
    novaFila.push(perdedor);
    const entra = novaFila.shift();
    novaMesa = entra ? [vencedor, entra] : [vencedor, perdedor];
    novasSeguidas = entra ? sequencia : 0;
    novoCampeao = entra ? vencedor : null;
  }
  return { mesa: novaMesa, fila: novaFila, seguidas: novasSeguidas, campeao: novoCampeao, perdedor };
}

/* A regra de uma rodada (ou de um bloco de 3 partidas no rei da mesa) sai da
   lista escolhida, girando. Escolheram menos regras que rodadas? Repete. */
export const regraDaVez = (escolhidas, indice) =>
  escolhidas.length ? escolhidas[indice % escolhidas.length] : null;
