/* ============================================================
   COMO FAZER CADA PADRÃO

   O `cue` de cada bloco é a frase curta que serve de lembrete no meio da série.
   Isto aqui é o passo a passo para consultar ANTES de começar, quando a dúvida
   é "como eu faço isso, exatamente?" — que é a dúvida que aparece na mesa.
   ============================================================ */

const GUIAS = {
  P1: {
    montagem: {
      robo: "Linha de fundo, apontado para a sua diagonal de forehand. Incline o cabeçote um pouco para CIMA — você quer bola alta e mole, não rasante.",
      voce: "Posição normal de ataque, um passo atrás da linha. Balde de bolas ao lado, para a parte do saque.",
      confira: "Mande 3 bolas de teste antes de começar. Se vierem baixas, suba mais o cabeçote.",
    },
    situacao: "Você saca no-spin curto. Ele lê como backspin, levanta a raquete e a bola sobra ALTA e mole. Essa sobra é o ponto — e é ela que o robô está imitando.",
    passos: [
      "Comece pelo balde ao lado: 15 no-spins curtos de verdade. É o saque que cria a sobra, então ele treina junto.",
      "Vire para o robô. Espere a bola chegar ao ponto MAIS ALTO.",
      "Ajuste os pés ANTES de armar o braço. Bola alta se resolve com o corpo no lugar certo.",
      "Bata com 80% de força, raquete fechada, movimento para frente e para baixo.",
      "Mire no canto aberto — nunca no meio da mesa.",
      "Volte à base antes da próxima bola.",
    ],
    olhar: "Acertar 8 de 10. Só isso. Força não entra na conta.",
    ajustes: [
      ["Saindo longa", "Feche mais a raquete e bata mais para baixo."],
      ["Batendo na rede", "Você pegou na descida. Espere o topo do quique."],
      ["Acertando mas fraca", "Está ótimo. Melhor 8 de 10 fracas que 5 de 10 fortes."],
    ],
    erro: "Dar 100% e errar. Bola alta se perde por ansiedade, não por falta de força.",
  },

  P2: {
    montagem: {
      robo: "Linha de fundo, mirando a sua diagonal de forehand. A bola deve quicar no MEIO da sua metade — nem curta, nem no fundo.",
      voce: "Meio passo atrás da linha, pé direito recuado, joelhos bem flexionados.",
      confira: "A bola tem que chegar cortada e LENTA. Se vier rápida, baixe a frequência.",
    },
    situacao: "Você sacou backspin curto, ele empurrou e a bola voltou cortada e sem velocidade. É a bola que o Henrique te dá o tempo todo. Agora você abre.",
    passos: [
      "Espere a bola quicar e COMEÇAR A DESCER. Nunca bata na subida.",
      "Deixe a raquete descer até a altura do joelho direito. Peso 70% na perna direita.",
      "Abra a raquete para 70–80°, quase vertical. É esse ângulo que levanta a cortada.",
      "Empurre o chão com a perna direita e suba em diagonal.",
      "Contato FINO, raspando a traseira da bola. Sinta pincelar, não socar.",
      "Termine com a raquete acima da cabeça e recupere a base.",
    ],
    olhar: "A bola tem que passar ALTA sobre a rede e cair com muito efeito. Arco alto aqui é acerto, não erro.",
    ajustes: [
      ["Batendo na rede", "Abra mais a raquete e suba mais. Quase sempre é isso."],
      ["Saindo longa", "Contato mais fino e menos força. Você está socando."],
      ["Sem efeito", "Raquete fechada demais. Abra e raspe."],
    ],
    erro: "Tentar ganhar o ponto na abertura. É ABERTURA — quem ganha o ponto é a bola seguinte.",
  },

  P3: {
    montagem: {
      robo: "Linha de fundo, diagonal. Topspin alto e frequência 4: a bola volta rápida e BAIXA, como um bloqueio.",
      voce: "Comece um passo atrás. A cada bola da série, chegue mais perto da mesa.",
      confira: "A bola tem que vir rasante. Se estiver subindo muito, aumente o topspin.",
    },
    situacao: "Você abriu (P2), ele bloqueou e a bola voltou rápida e baixa. Agora não dá mais para abrir com arco: tem que continuar mais reto. Essa troca é a bola que o amador erra.",
    passos: [
      "A PRIMEIRA bola de cada série você abre com arco, igual ao P2.",
      "Da segunda em diante, encurte o movimento: menos arco, mais para frente.",
      "Contato mais CHEIO, não tão fino quanto na abertura.",
      "Chegue mais perto da mesa — a bola vem rápida e não dá tempo de recuar.",
      "Mantenha a série viva: o objetivo é a sequência inteira, não uma bola.",
    ],
    olhar: "A troca de marcha entre a 1ª e a 2ª bola. É o exercício inteiro.",
    ajustes: [
      ["2ª bola saindo longa", "Você continuou com arco. Encurte e vá mais para frente."],
      ["1ª bola na rede", "Você atacou reto contra a cortada. A primeira ainda é abertura."],
      ["Perdendo a série no meio", "Diminua a força. Continuar vale mais que acelerar."],
    ],
    erro: "Usar o mesmo golpe nas duas bolas. São dois golpes diferentes — o exercício existe por causa disso.",
  },

  P4: {
    montagem: {
      robo: "Centralizado com oscilação ON, alternando os cantos.",
      voce: "Base no centro. Você escolhe a direção; o robô só alimenta.",
      confira: "Você precisa de espaço livre para os dois lados. Confira antes de começar.",
    },
    situacao: "Você prende ele no canto de backhand. Depois de umas três bolas ele começa a GIRAR O CORPO para cobrir aquele lado — e no instante em que gira, abre a paralela oposta. Caio e Aleykson giram cedo demais: é exatamente aí que se ganha deles.",
    passos: [
      "Três bolas seguidas no MESMO canto. Controladas, não fortes — são preparação.",
      "Conte em voz alta: um, dois, três.",
      "Na quarta, jogue rápido na paralela OPOSTA.",
      "Mude a direção só pelo ÂNGULO DA RAQUETE. O gesto do braço tem que ser idêntico.",
      "Volte ao centro imediatamente: se ele alcançar, a bola volta no seu lado aberto.",
      "Recomece a contagem.",
    ],
    olhar: "O gesto ser igual nas quatro bolas. Se o corpo anuncia a paralela, o padrão não funciona no jogo.",
    ajustes: [
      ["Paralela saindo pela lateral", "Você virou o corpo. Use só o ângulo da raquete."],
      ["As três primeiras muito fortes", "Controle. Elas prendem, não ganham."],
      ["Chegando atrasado na paralela", "Volte ao centro antes, não depois de olhar a bola."],
    ],
    erro: "Atacar com força as três primeiras. Elas são o xadrez; a quarta é o xeque.",
  },

  P5: {
    montagem: {
      robo: "Mais perto da rede, mirando CURTO. A bola tem que quicar duas vezes na sua metade se você não tocar nela.",
      voce: "Perto da mesa, pronto para entrar com o pé direito.",
      confira: "Se a bola estiver saindo longa, aproxime o robô ou baixe o cabeçote.",
    },
    situacao: "Ele saca curto e cortado esperando que você empurre. Em vez de devolver passivo, você ataca por cima da mesa e inverte a iniciativa do ponto.",
    passos: [
      "Comece com 15 sombras, sem bola, só o gesto.",
      "Pé direito ENTRA por baixo da mesa. Sem isso, o flick não existe.",
      "Antebraço e punho carregados para trás, raquete sob a linha da bola.",
      "Espere o TOPO do quique, bem à frente do corpo.",
      "Punho chicoteia para frente e para cima. Quem gera é o punho, não o braço.",
      "Movimento curto: cabe dentro de uma caixa de sapato.",
      "Recue o pé imediatamente e volte à base.",
    ],
    olhar: "A entrada do pé. Se o pé não entra, o resto não adianta.",
    ajustes: [
      ["Batendo na rede", "Abra mais o punho e vá mais para cima. A bola é cortada."],
      ["Saindo longa", "Menos punho, mais controle. É um toque, não um golpe."],
      ["Errando muito na série", "Volte ao push nesta série e tente o flick na próxima."],
    ],
    erro: "Fazer com o braço, de longe. Flick é punho, perto e curto.",
  },

  P6: {
    montagem: {
      robo: "Centralizado, oscilação ON, ritmo de jogo. Você não sabe o lado.",
      voce: "Base no centro, pés ativos. Postura de quem espera, não de quem ataca.",
      confira: "A bola tem que vir jogável dos dois lados. Ajuste até devolver 10 seguidas com folga.",
    },
    situacao: "Está 9-9. A próxima bola decide. Não é hora de vencedor: é hora de colocar a bola na mesa e deixar ele errar. É assim que se ganha do Caio no deuce.",
    passos: [
      "Antes de começar a série, diga em voz alta: 9-9.",
      "Devolva TODAS na mesa. Nenhuma tentativa de vencedor.",
      "Bola no meio da mesa, com margem folgada sobre a rede.",
      "Conte cada bola em voz alta.",
      "Errou? Pare, respire fundo uma vez e recomece do ZERO.",
      "Anote o melhor da série no contador do card.",
    ],
    olhar: "25 seguidas. É a única meta.",
    ajustes: [
      ["Errando antes de 10", "Diminua a força e aumente a margem sobre a rede."],
      ["Chegando a 20 e errando", "É concentração, não técnica. Respire entre as bolas."],
      ["Fácil demais", "Suba a frequência em 1. A bola tem que incomodar."],
    ],
    erro: "Acelerar quando a contagem está alta. É exatamente o que você faz no 9-9 real — e é o que este treino existe para desmontar.",
  },

  P7: {
    montagem: {
      robo: "Centralizado com oscilação ON, alternando os dois cantos.",
      voce: "Base no CENTRO da mesa. É de lá que você sai e é para lá que volta.",
      confira: "Marque o centro no chão com uma fita. Você precisa enxergar se está voltando.",
    },
    situacao: "No jogo a bola nunca vem no mesmo lugar. O Falkenberg é o exercício clássico de deslocamento: ele te obriga a CHEGAR com o golpe certo, em vez de esticar o braço.",
    passos: [
      "Comece sem bola: 3 séries de 40 s de side-step entre os cantos.",
      "Com bola — bola no canto de BACKHAND: bata de backhand.",
      "Próxima bola também no canto de backhand: CONTORNE e bata de FOREHAND desse mesmo canto.",
      "Bola no canto de FOREHAND: bata de forehand.",
      "Repita o ciclo.",
      "Depois de CADA bola, volte ao centro. Sempre.",
    ],
    olhar: "A volta ao centro. Se você fica parado no canto esperando, o exercício perdeu o sentido.",
    ajustes: [
      ["Chegando atrasado", "Saia no instante em que a bola sai do robô, não quando ela quica."],
      ["Cruzando os pés", "Side-step: o pé do lado do deslocamento sai primeiro, o outro acompanha."],
      ["Cansando rápido", "Baixe a frequência em 1. Deslocamento certo vale mais que muitas bolas."],
    ],
    erro: "Esticar o braço para alcançar em vez de mover os pés. O golpe sai torto e você não treina o que importa.",
  },

  P8: {
    montagem: {
      robo: "Perto da rede, mirando curto e cortado. Sempre a MESMA bola.",
      voce: "Perto da mesa, como quem espera um saque curto.",
      confira: "A bola precisa ser repetitiva de propósito: aqui quem varia é você, não ela.",
    },
    situacao: "No jogo você recebe e responde no automático — quase sempre push. Só que existem três respostas, e escolher a certa é o que separa recepção boa de recepção passiva. Aqui a bola é fixa justamente para você treinar a ESCOLHA.",
    passos: [
      "Antes de cada bola, escolha uma das três: push curto, push longo no canto, ou flick.",
      "Diga a escolha em voz alta ANTES de tocar na bola.",
      "Execute exatamente o que falou.",
      "Regra: não repita a mesma resposta duas vezes seguidas.",
      "Conte quantas você executou como tinha decidido — é esse número que importa.",
      "Force pelo menos 3 flicks por série, mesmo errando.",
    ],
    olhar: "A decisão vir ANTES do toque. Se você decidiu durante o golpe, não valeu.",
    ajustes: [
      ["Decidindo em cima da hora", "Decida quando a bola SAI do robô, não quando ela chega."],
      ["Escolhendo sempre push", "Está fugindo do difícil. Force os 3 flicks."],
      ["Errando o que decidiu", "Baixe a exigência: nesta série alterne só entre push curto e push longo."],
    ],
    erro: "Deixar o corpo escolher sozinho. O exercício inteiro é sobre escolha consciente.",
  },
};

export { GUIAS };
