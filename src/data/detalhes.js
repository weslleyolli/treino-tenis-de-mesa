/* ============================================================
   COMO FAZER — a descrição longa de cada exercício
   O card do dia é curto de propósito: nome, dose, regulagem e uma frase de
   atenção. Isso basta quando você já sabe o exercício, e não basta nenhuma
   vez na primeira semana. Aqui mora o resto: o que é, como montar, o passo a
   passo, o critério de sucesso e os erros que estragam o bloco.

   Cada bloco do cronograma carrega um `det` com a chave daqui. Quem não tem
   chave ainda abre o "Como fazer": a tela monta a descrição com o que o
   próprio bloco traz (dose, regulagem, passos, limite do robô e a frase de
   atenção). Botão que abre tela vazia é pior que botão nenhum.

   Forma de cada entrada:
     oque      uma frase — o que este exercício é
     montagem  como deixar mesa, robô e corpo antes da primeira bola
     execucao  o passo a passo, na ordem
     meta      o critério objetivo de hoje: passou ou não passou
     erros     o que estraga o bloco, e o que fazer no lugar

   As regulagens aparecem como o visor do controle mostra:
   Freq · Osc · Top · Back, cada um de 1 a 8 (Osc 0 = desligada). O efeito é a
   DIFERENÇA entre as duas rodas — Top maior faz topspin, Back maior faz
   backspin, iguais fazem bola sem efeito. São pontos de partida: o próprio
   manual avisa que bola, poeira e umidade mudam tudo, e a régua de correção
   está no "Como fazer" de todo bloco com robô.
   ============================================================ */

const DETALHES = {
  /* ---------- aquecimento (todo dia de mesa) ---------- */
  "aq-drive": {
    oque: "O aquecimento e o treino de drive na mesma coisa: bola leve na diagonal, ritmo baixo, gesto inteiro.",
    montagem: [
      "Robô na borda de trás, na linha do meio. Visor: Freq 2 · Osc 0 · Top 5 · Back 4 — topspin leve.",
      "Você na posição base, a um passo da mesa, joelhos soltos.",
      "Balde cheio antes de começar — parar no meio para catar bola esfria tudo.",
    ],
    execucao: [
      "2 minutos de diagonal de forehand. Só a diagonal, sempre o mesmo ponto.",
      "2 minutos de diagonal de backhand.",
      "2 minutos alternando forehand e backhand, uma bola cada, com o pé acompanhando.",
    ],
    meta: "Terminar os 6 minutos sem ter aumentado a força. Se você está suando no quinto minuto, aqueceu errado.",
    erros: [
      "Começar forte porque a bola é fácil → os dois primeiros minutos são para achar o timing, não a potência.",
      "Bater só de braço, com os pés parados → o aquecimento também é dos pés; eles entram desde a primeira bola.",
      "Pular esta parte quando o tempo está curto → corte o bloco irregular, nunca o aquecimento.",
    ],
  },
  "aq-ritmo": {
    oque: "A ponte entre aquecer e treinar: a mesma bola, uma marcha acima, para o corpo chegar no bloco principal já no ritmo.",
    montagem: [
      "Mesma posição. Visor: Freq 4 · Osc 0 · Top 6 · Back 3 — a bola vem mais rápida e com mais efeito.",
      "Nada mais muda: mesmo ponto, mesma bola, oscilação desligada.",
    ],
    execucao: [
      "4 séries de 20 bolas, alternando forehand e backhand como você preferir.",
      "30 segundos de pausa entre séries — o suficiente para respirar, não para esfriar.",
      "A cada série, confira uma coisa só: o tamanho do gesto.",
    ],
    meta: "As 4 séries com o mesmo gesto do bloco anterior. Gesto que cresceu junto com a bola é série perdida.",
    erros: [
      "Deixar o gesto crescer quando a bola vem mais rápido → é exatamente o drive que erra em jogo.",
      "Transformar isto num bloco de força → a intensidade do dia vem depois, no irregular.",
    ],
  },
  "aq-sombra": {
    oque: "Dois minutos sem bola com o gesto do dia — a última chance de consertar o movimento antes de a bola impor a pressa.",
    montagem: [
      "Longe da mesa, com espaço para o gesto inteiro.",
      "De frente para um vidro ou para a câmera do celular apoiada, se tiver.",
    ],
    execucao: [
      "20 repetições bem devagar, do pé à raquete: peso no pé de trás, rotação de tronco, braço por último.",
      "Pare a cada 5 repetições e refaça a primeira posição.",
      "As últimas 5, na velocidade de jogo — só para sentir a diferença.",
    ],
    meta: "As 20 repetições iguais entre si. Sombra que varia é gesto que ainda não existe.",
    erros: [
      "Fazer rápido para 'não perder tempo' → devagar é o ponto; rápido você já faz na mesa.",
      "Sombra só de braço → se o pé não entra na sombra, ele não entra no jogo.",
    ],
  },

  /* ---------- bloco regular ---------- */
  "regular": {
    oque: "Bola sempre no mesmo lugar. É o único momento do dia em que a repetição é o objetivo — e por isso ele é curto.",
    montagem: [
      "Regulagem do painel acima, com Osc 0: hoje a bola tem que ser previsível.",
      "Balde cheio e toalha ao alcance. 150 bolas seguidas sem parar.",
      "Marque mentalmente o ponto da mesa onde a bola vai cair, antes de ligar o robô.",
    ],
    execucao: [
      "6 séries de 25 bolas, 45 segundos de descanso entre elas.",
      "A cada série escolha UM detalhe do gesto para conferir — não a série inteira, um detalhe.",
      "Conte os erros de cada série em voz alta no fim. O número é o dado do bloco.",
    ],
    meta: "Menos de 5 erros por série. Passou de 5, baixe a frequência em 1 antes de insistir.",
    erros: [
      "Trocar qualidade por quantidade → 150 bolas com o gesto certo valem mais que 400 no automático.",
      "Insistir na frequência alta errando muito → você está gravando o erro, e ele custa semanas para sair.",
      "Achar que o bloco regular é o treino → ele grava o gesto; o jogo mora no bloco seguinte.",
    ],
  },

  /* ---------- irregulares do ciclo pós-torneio ---------- */
  "irr-abre": {
    oque: "O erro nº 1 do campeonato, com bola imprevisível: cortada em qualquer canto e uma regra só — abrir.",
    montagem: [
      "Visor: Freq 2 · Osc 4 · Top 3 · Back 7 — cortada forte, caindo em lugar sorteado.",
      "Você a um passo e meio da mesa: abertura contra cortada precisa de espaço para o braço descer.",
      "Balde cheio: são 60 bolas e parar no meio quebra o bloco.",
    ],
    execucao: [
      "6 séries de 10 bolas, 60 segundos entre elas.",
      "Leia o canto, desloque com o pé primeiro, e só então abra.",
      "Escove a bola de baixo para cima. Contra cortada, efeito passa e força pendura na rede.",
      "Conte as que passaram COM efeito — bola que passa sem girar não conta.",
    ],
    meta: "Pelo menos 6 aberturas boas por série. Empurrar zera a série inteira, mesmo que a bola tenha ficado na mesa.",
    erros: [
      "Empurrar a difícil 'só essa' → é exatamente essa que você empurrou no torneio. Erre abrindo.",
      "Atacar de cima, como se fosse topspin contra topspin → contra cortada a raquete entra por baixo.",
      "Ficar parado e alcançar a bola com o braço → o pé vai primeiro, sempre.",
    ],
  },
  "irr-cozinha": {
    oque: "O jogo de cozinhada com prazo: três empurradas de qualidade e a quarta é ataque, sempre.",
    montagem: [
      "Visor: Freq 2 · Osc 3 · Top 3 · Back 6 — cortada média, posição sorteada.",
      "Você colado na mesa para os pushes, pronto para dar um passo atrás na quarta bola.",
    ],
    execucao: [
      "Bolas 1, 2 e 3: push. Baixo (passando rente à rede), longo (último terço da mesa) e no canto.",
      "Bola 4: sai da mesa meio passo e abre. Sem exceção, mesmo que a bola não esteja perfeita.",
      "6 séries de 8 ciclos desses. Conte só os ciclos em que a quarta virou ataque.",
    ],
    meta: "6 ciclos completos por série. Push alto no meio do ciclo anula o ciclo.",
    erros: [
      "Push alto → ele ataca. Baixo é mais importante que longo.",
      "Empurrar a quarta 'porque a terceira ficou ruim' → o ciclo existe para te tirar dessa decisão.",
      "Cozinhar esperando o erro dele → cozinhar é preparar a bola que VOCÊ vai atacar.",
    ],
    robo: "O iPong manda tudo do mesmo comprimento: a cozinhada curta de verdade só dá para treinar no sábado, com gente.",
  },
  "irr-defesa": {
    oque: "O ataque dele em cima de você: bloqueio colado na mesa, mudando de direção a cada bola.",
    montagem: [
      "Visor: Freq 5 · Osc 4 · Top 7 · Back 2 — topspin pesado. É o cara que abriu primeiro.",
      "Você COLADO na mesa. Recuar aqui é entregar o ângulo.",
      "Suba a rotação até o limite em que você ainda consegue bloquear — e fique um passo abaixo dele.",
    ],
    execucao: [
      "6 séries de 90 segundos, 75 de descanso.",
      "Raquete fechada, sem movimento de braço: é ângulo, não golpe. A bola dele já traz a velocidade.",
      "A cada bola, alterne a direção: uma na paralela, uma na diagonal.",
      "Conte a maior sequência de bloqueios sem erro de cada série.",
    ],
    meta: "Uma sequência de 8 bloqueios com direção alternada, em pelo menos 4 das 6 séries.",
    erros: [
      "Recuar da mesa → contra quem ataca, sair é perder o ângulo e o tempo.",
      "Tentar bater no bloqueio → quanto menos movimento, mais controle. O bloqueio é passivo de propósito.",
      "Bloquear tudo no mesmo lugar → é o que deixa o atacante confortável. A direção alternada é o bloco.",
    ],
  },
  "irr-fh": {
    oque: "Dois pontos, um golpe: o robô espalha a bola (ele sorteia, não alterna) e você ataca sempre de forehand, contornando quando cair no lado do backhand.",
    montagem: [
      "Visor: Freq 4 · Osc 4 · Top 5 · Back 3 — bola de jogo, posição sorteada.",
      "Posição base deslocada um pouco para o lado do backhand — é de lá que você contorna.",
    ],
    execucao: [
      "6 séries de 90 segundos, 60 de descanso.",
      "Bola no forehand: ataque normal e volte ao centro.",
      "Bola no backhand: contorne com o pé esquerdo (destro) e ataque de forehand mesmo assim.",
    ],
    meta: "Séries sem furo — furo é bola que você deixou passar ou devolveu de backhand.",
    erros: [
      "Contornar com o braço em vez do pé → você alcança a bola, mas chega tarde na seguinte.",
      "Não voltar ao centro depois de atacar → a segunda bola é a que cobra a recuperação.",
    ],
  },
  "irr-escolha": {
    oque: "Decisão sob incerteza: a cada bola você escolhe forehand ou backhand, proibido repetir duas iguais seguidas.",
    montagem: ["Visor: Freq 4 · Osc 4 · Top 5 · Back 3.", "Posição base no centro, peso nas pontas dos pés."],
    execucao: [
      "6 séries de 90 segundos.",
      "A cada bola, decida o golpe ANTES de ela quicar.",
      "Duas iguais seguidas invalidam a série — é a regra que te tira do automático.",
    ],
    meta: "Séries com a regra cumprida do começo ao fim.",
    erros: [
      "Decidir depois do quique → aí não é decisão, é reação.",
      "Cair no automático do forehand → é justamente o hábito que a regra está quebrando.",
    ],
  },
  "irr-final": {
    oque: "Trocar de marcha: quatro bolas de construção e a quinta é finalização.",
    montagem: ["Visor: Freq 5 · Osc 4 · Top 6 · Back 3.", "Comece a meia-distância."],
    execucao: [
      "6 séries de 90 segundos, contando as bolas em voz alta.",
      "Bolas 1 a 4: construção, sem pressa, colocando a bola.",
      "Bola 5: acelera. Marcha diferente, não só mais força.",
    ],
    meta: "Finalizações certas — a quinta bola, atacada de verdade e dentro.",
    erros: [
      "Finalizar todas → aí não existe marcha, existe só uma velocidade.",
      "Nunca finalizar → é o erro que decide o set: ponto dominado que você não fecha.",
    ],
  },
  "irr-sobrevive": {
    oque: "Densidade de set: frequência acima do seu conforto, e a tarefa não é atacar, é não errar.",
    montagem: ["Visor: Freq 6 · Osc 4 · Top 6 · Back 3.", "Um passo atrás da posição normal."],
    execucao: [
      "5 séries de 2 minutos, 75 segundos de descanso.",
      "Bola na mesa é o objetivo. Nada de tentar vencedor.",
      "Anote a maior sequência de cada série.",
    ],
    meta: "O recorde de bolas seguidas, subindo semana a semana.",
    erros: [
      "Tentar ganhar o ponto → o bloco é sobre aguentar, não sobre resolver.",
      "Parar quando cansa → é exatamente quando o bloco começa a valer; é o quinto set.",
    ],
  },
  "irr-bh": {
    oque: "O lado esquerdo sob pressão: oscilação ligada, mas mirando só a metade do backhand.",
    montagem: ["Visor: Freq 5 · Osc 0 · Top 6 · Back 3, com o furo de saída girado para o seu lado de backhand.", "O V300 não mira meia mesa: a oscilação dele sorteia a mesa inteira. Por isso aqui ela fica desligada e quem aponta é você.", "Posição base no lado do backhand."],
    execucao: [
      "6 séries de 80 segundos, 60 de descanso.",
      "A bola varia dentro do seu lado fraco: ajuste com pequenos passos, não com o braço.",
      "Alterne bloqueio e ataque conforme a bola pedir.",
    ],
    meta: "Séries sem furo. Furo é bola que passou sem você chegar.",
    erros: [
      "Contornar tudo de forehand → hoje não; o backhand é o assunto.",
      "Ficar de pé parado → variação curta cobra passo curto, e é o passo que quase ninguém treina.",
    ],
  },

  /* ---------- sistemas ---------- */
  "sist-saque3": {
    meta: "24 terceiras bolas atacadas de verdade nas 6 séries — atacada, não devolvida.",
    erros: [
      "Ainda estar terminando o saque quando a bola chega → é o erro que este bloco existe para consertar.",
      "Sacar de qualquer jeito para 'chegar na terceira' → o saque ruim é o que estraga a terceira.",
      "Não voltar à posição base depois do saque → ninguém te espera.",
    ],
  },
  "sist-rec4": {
    meta: "Cadeias completas: a recepção escolhida (não repetida) E a quarta bola atacada.",
    erros: [
      "Repetir a mesma resposta → recepção não é devolver, é escolher.",
      "Ficar colado na mesa depois da recepção → a quarta bola pede um passo atrás.",
    ],
  },
  "sist-bloqueio": {
    meta: "Viradas completas: dois bloqueios absorvidos e a terceira bola atacada.",
    erros: [
      "Bloquear até errar → é o jeito mais comum de perder ponto estando vivo.",
      "Tentar virar já na primeira → as duas primeiras são para absorver.",
    ],
  },
  "sist-abrir-aguentar": {
    meta: "Cadeias completas: abriu, bloqueou e voltou a atacar. Conte só as que chegaram ao fim.",
    erros: [
      "Abrir e ficar parado admirando → a resposta vem, e vem rápido.",
      "Recuar depois de abrir → você abre a meia-distância e volta para a mesa, não o contrário.",
      "Bloquear a terceira também → bloquear duas vezes é sobreviver; a terceira tem que ser sua.",
    ],
  },

  /* ---------- jogos pontuados ---------- */
  "js-abre": {
    oque: "O placar do erro que te custou o campeonato: bola na mesa empurrando não vale ponto.",
    montagem: ["Visor: Freq 2 · Osc 4 · Top 3 · Back 7 — cortada forte, posição sorteada.", "Papel e caneta, ou as anotações do card, para o placar."],
    execucao: [
      "Cada ponto começa com o robô mandando cortada.",
      "Você empurra no máximo 3 bolas e abre.",
      "Abertura passou: ponto seu. Empurrou a quarta ou errou a abertura na rede: ponto do robô.",
      "Vai até 11, com 2 de diferença.",
    ],
    meta: "Ganhar o set. E, mesmo perdendo, terminar com mais pontos de abertura do que na semana passada.",
    erros: [
      "Contar como ponto a bola que ficou na mesa empurrando → é o hábito que o jogo inteiro está corrigindo.",
      "Abrir com força para 'garantir' → abertura é efeito; força vem na bola seguinte.",
    ],
  },
  "js-set5": {
    meta: "Ganhar o set do robô. Anote o placar — é o dado que a aba Progresso desenha.",
    erros: ["Recomeçar a contagem quando erra na quarta bola → o ponto perdido conta, é esse o sentido."],
  },
  "js-prazo": {
    meta: "Pontos ganhos dentro do prazo: terminados em até 5 bolas, com ataque seu.",
    erros: ["Adiar a decisão porque a troca está confortável → é o set que você domina e perde no fim."],
  },
  "js-deuce": {
    meta: "Deuces vencidos, de 5. Anote quantos.",
    erros: ["Tentar vencedor no 9-9 → sete bolas na mesa primeiro; a pressa é o erro do amador no fim do set."],
  },
  "sets-completos": {
    meta: "Sets ganhos, e a rotina entre pontos cumprida em todos eles.",
    erros: [
      "Sacar o ponto seguinte sem parar → os 10 segundos entre pontos existem e são treináveis.",
      "Ajustar o robô no meio do set → em jogo ninguém ajusta nada.",
    ],
  },

  /* ---------- saque ---------- */
  "saque-diario": {
    oque: "Dez minutos de saque todo dia. Saque não melhora em treino semanal, melhora em repetição diária.",
    montagem: [
      "Balde com 100 bolas do seu lado da mesa.",
      "Um alvo físico do outro lado: uma caixa, uma garrafa deitada ou uma folha na zona que você quer acertar.",
    ],
    execucao: [
      "Séries de 10, com o foco da semana que está escrito no card.",
      "A cada série, conte os acertos no alvo antes de recomeçar.",
      "Registre o total na aba Saque — sem denominador não existe evolução.",
    ],
    meta: "100 bolas no dia. A porcentagem no alvo é o número que sobe ao longo do ciclo.",
    erros: [
      "Sacar sem alvo → vira aquecimento de punho, não treino de saque.",
      "Trocar de saque a cada bola → o foco da semana é um só, de propósito.",
      "Empunhadura apertada → saque é punho solto, pressão 2 de 10.",
    ],
  },

  /* ---------- quinta: correção ---------- */
  "corr-lenta": {
    oque: "Metade da velocidade de jogo, sem bola: você está procurando o erro, não repetindo o acerto.",
    montagem: ["Espaço livre, de frente para um vidro ou com o celular gravando de lado."],
    execucao: [
      "4 blocos de 2 minutos, alternando as três técnicas da semana.",
      "Em cada bloco, pare duas vezes no meio do gesto e confira a posição.",
    ],
    meta: "Achar UM detalhe errado. Um é suficiente — é o que você leva para a mesa em seguida.",
    erros: ["Fazer no ritmo normal → no ritmo normal o erro passa batido; é para isso que existe a câmera lenta."],
  },
  "corr-trecho": {
    oque: "Só o pedaço que estava errado, com bola lenta de propósito.",
    montagem: ["Robô uma frequência ABAIXO do normal do dia. Oscilação desligada."],
    execucao: [
      "4 séries de 20 bolas, 45 segundos de descanso.",
      "Execute pensando só no detalhe que a correção lenta achou.",
      "Se o gesto sair certo devagar e errado rápido, fique no devagar — insistir rápido grava o errado.",
    ],
    meta: "As 4 séries com o detalhe corrigido. Velocidade volta amanhã.",
    erros: ["Subir a frequência porque está fácil → hoje a bola é ferramenta de conserto, não de treino."],
  },
  "corr-video": {
    oque: "Gravar uma técnica e mandar para análise. A resposta guia a segunda-feira seguinte.",
    montagem: [
      "Celular apoiado na lateral, na altura da mesa, pegando o corpo inteiro.",
      "Boa luz de frente, não contra a janela.",
    ],
    execucao: [
      "Grave 6 a 8 repetições de UMA técnica só, em câmera lenta se o celular tiver.",
      "Abra a técnica na aba Golpes e copie o prompt de análise.",
      "Mande o vídeo com o prompt e guarde a resposta nas anotações.",
    ],
    meta: "Um vídeo por semana. Doze no ciclo — é o registro mais honesto da sua evolução.",
    erros: ["Gravar de frente → o gesto se vê de lado; de frente esconde a rotação do tronco."],
  },

  /* ---------- domingo ---------- */
  "leve-soltura": {
    oque: "Seis minutos de soltura, sem corda, sem série e sem contar nada.",
    montagem: ["Em casa mesmo, sem mesa."],
    execucao: ["Ombro, quadril e coluna torácica, no seu tempo.", "Pare antes de cansar."],
    meta: "Terminar mais solto do que começou. Só isso.",
    erros: ["Transformar em treino → domingo é o dia que faz a semana seguinte existir."],
  },
  "leve-sombra": {
    oque: "Sombra das três técnicas da semana, devagar, sem nenhuma pressa.",
    montagem: ["Espaço livre, de preferência de frente para um vidro."],
    execucao: ["3 blocos de 2 minutos, alternando as três técnicas.", "Velocidade de estudo, não de jogo."],
    meta: "Os três gestos saindo iguais do começo ao fim do bloco.",
    erros: ["Acelerar no fim porque está fácil → o único treino da semana sem pressa é este."],
  },
  "leve-revisao": {
    oque: "Oito minutos relendo a semana e escrevendo uma frase. Ciclo sem revisão é calendário, não é treino.",
    montagem: ["O app aberto nos seis dias anteriores."],
    execucao: [
      "Releia as anotações de segunda a sábado.",
      "Olhe os recordes dos contadores: o que subiu e o que não saiu do lugar.",
      "Escreva UMA frase: qual dos quatro erros melhorou nesta semana.",
    ],
    meta: "A frase escrita. Uma, específica — não 'treinei bem'.",
    erros: ["Pular porque 'já sei como foi' → você não sabe; a anotação de terça já foi esquecida."],
  },

  /* ---------- sábado ---------- */
  "jt-regra": {
    oque: "Três sets contra o parceiro, um por regra da semana. É onde o conserto vira jogo.",
    montagem: ["Placar combinado antes de começar.", "Combine a regra do set com ele — inclusive para ele te cobrar."],
    execucao: [
      "Set 1: toda cortada que der para abrir, você abre.",
      "Set 2: no máximo três empurradas suas por ponto; a quarta é ataque.",
      "Set 3: quando ele abrir primeiro, bloqueia colado e muda a direção.",
    ],
    meta: "A regra cumprida o set inteiro. Ganhar é secundário — de verdade.",
    erros: [
      "Abandonar a regra quando o set aperta → é aí que a regra vale, e é aí que o torneio acontece.",
      "Escolher a regra que você já cumpre → escolha a que te incomoda.",
    ],
  },
  "jt-livre": {
    oque: "Um set sem regra nenhuma, para ver o que sai sozinho. É o retrato mais honesto da semana.",
    montagem: ["Nada combinado. Jogo normal."],
    execucao: [
      "Um set até 11, jogando como você jogaria no torneio.",
      "Três minutos anotando logo depois, enquanto está fresco.",
    ],
    meta: "Três números anotados: cortadas abertas × empurradas, bloqueios que aguentaram, onde perdeu mais.",
    erros: ["Anotar só o placar → o placar não ensina nada; os três números ensinam."],
  },

  /* ---------- rotina pré-jogo (sexta) ---------- */
  "pj-bola": {
    oque: "Exatamente o aquecimento que você faria com o adversário nos 10 minutos antes da partida.",
    montagem: ["Visor: Freq 4 · Osc 0 · Top 5 · Back 3."],
    execucao: ["2 min de diagonal de forehand, 2 de backhand, 2 alternando."],
    meta: "Chegar no primeiro ponto com o timing achado.",
    erros: ["Usar o aquecimento para treinar → aquecer é achar o timing; treino foi a semana toda."],
  },
  "pj-cortadas": {
    oque: "Tocar uma vez em cada um dos dois erros que decidem a sua partida, antes de ela começar.",
    montagem: ["Visor: Freq 2 · Osc 0 · Top 3 · Back 7 para as cortadas. Depois Top 7 · Back 2 para os bloqueios, se der tempo."],
    execucao: ["10 aberturas contra cortada.", "10 bloqueios contra topspin."],
    meta: "Nenhuma das duas coisas estreando no primeiro ponto do jogo.",
    erros: ["Pular por causa do tempo → são 3 minutos e valem o primeiro set."],
  },
  "pj-rotina": {
    oque: "O ensaio da rotina: garrafa, toalha, o primeiro saque decidido e a respiração.",
    montagem: ["Garrafa e toalha no lugar, como em jogo."],
    execucao: [
      "10 saques do repertório que você usaria hoje.",
      "Decida qual saque abre o jogo — e o plano B se ele devolver bem.",
      "Uma respiração longa antes do último saque.",
    ],
    meta: "Chegar ao primeiro ponto com a decisão já tomada.",
    erros: ["Decidir o primeiro saque na hora → o primeiro ponto é o mais mal jogado do torneio inteiro."],
  },

  /* ---------- saque com parceiro (sábado) ---------- */
  "sv-punho": {
    oque: "Trinta saques leves só de punho, para soltar a mão antes de mirar qualquer coisa.",
    montagem: ["Balde do seu lado. Sem alvo ainda."],
    execucao: ["30 saques curtos, empunhadura 2 de 10, só punho, sem braço."],
    meta: "Sentir a raquete acelerar sozinha no contato.",
    erros: ["Apertar o cabo → mão apertada mata o efeito, e é o erro nº 1 do saque amador."],
  },
  "sv-parceiro-efeito": {
    oque: "O único teste que existe do seu disfarce: ele devolve e depois diz o efeito que leu.",
    montagem: ["Ele do outro lado, devolvendo normal.", "Combine que ele fala o efeito DEPOIS de devolver, nunca antes."],
    execucao: ["40 saques seus, variando efeito sem avisar.", "Anote quantos ele acertou."],
    meta: "Se ele acerta o efeito em 8 de 10, o seu saque é honesto demais — o gesto está entregando.",
    erros: ["Perguntar antes de ele devolver → aí ele responde pelo que viu, não pelo que sentiu na bola."],
  },
  "sv-parceiro-saque": {
    oque: "Saque dele, recepção sua. É o bloco mais caro da semana — não troque ele por nada.",
    montagem: ["Ele saca variando efeito e comprimento, sem avisar."],
    execucao: [
      "40 saques dele.",
      "Antes de tocar, diga em voz alta o efeito que você leu.",
      "Depois compare com o que ele fez de verdade.",
    ],
    meta: "Ler o efeito certo em mais da metade. É a habilidade que mais decide jogo.",
    erros: ["Chutar a devolução sem ler → é assim que o ponto morre na primeira bola, como no torneio."],
  },
  /* ---------- bateria de teste (sextas das semanas 4, 8 e 12) ----------
     Aqui o detalhe não é sobre técnica, é sobre MEDIR: medida que muda de
     método não compara com nada, e o ciclo inteiro depende dessa comparação. */
  "teste-1": {
    oque: "O erro nº 1 do torneio, medido com bola previsível: 48 cortadas, todas para abrir.",
    montagem: ["Visor: Freq 2 · Osc 0 · Top 3 · Back 7 — o canto é sempre o mesmo.", "Balde cheio: parar no meio muda a medida."],
    execucao: ["6 séries de 8 bolas, 45 segundos entre elas.", "Conte em voz alta as que passaram COM efeito.", "Anote o total das 6 séries, não a melhor série."],
    meta: "Linha de corte 26 de 48.",
    erros: ["Contar bola que passou sem girar → ela não é abertura, é empurrada alta.", "Mudar a regulagem no meio porque está difícil → aí o número não compara com o da semana 8."],
  },
  "teste-2": {
    oque: "O mesmo golpe do item 1, agora sem saber o canto. A diferença entre os dois números é o que o seu deslocamento está custando.",
    montagem: ["Mesma regulagem do item 1, com Osc 4 — a posição passa a ser sorteada."],
    execucao: ["5 séries de 8 bolas, 60 segundos entre elas.", "Mesma contagem: só as que passaram com efeito."],
    meta: "Linha de corte 20 de 40. Se a queda em relação ao item 1 for maior que 25%, o problema é perna, não braço.",
    erros: ["Antecipar o canto olhando o robô → olhe a bola, como em jogo."],
  },
  "teste-3": {
    oque: "A cozinhada medida: três pushes de qualidade e a quarta atacada, 36 ciclos.",
    montagem: ["Visor: Freq 2 · Osc 3 · Top 3 · Back 6."],
    execucao: ["6 séries de 6 ciclos.", "Conte só os ciclos completos: três pushes baixos E a quarta atacada."],
    meta: "Linha de corte 22 de 36.",
    erros: ["Contar o ciclo em que um push saiu alto → push alto é ponto do adversário; não conta."],
  },
  "teste-4": {
    oque: "A defesa medida: maior sequência de bloqueios sem errar, com direção alternada.",
    montagem: ["Visor: Freq 5 · Osc 4 · Top 7 · Back 2. A mesma regulagem das três medidas do ciclo."],
    execucao: ["Colado na mesa, alternando paralela e diagonal.", "Errou, recomeça do zero.", "Anote a maior sequência do dia."],
    meta: "Linha de corte 18 seguidas.",
    erros: ["Bloquear tudo no mesmo lugar para aumentar o número → a direção alternada é parte da medida."],
  },
  "teste-5": {
    oque: "O drive: série livre de forehand, o recorde do dia. É o único item que veio igual do ciclo antigo.",
    montagem: ["Visor: Freq 5 · Osc 0 · Top 6 · Back 3."],
    execucao: ["Uma série livre, sem parar, até errar.", "Anote o número."],
    meta: "Linha de corte 40 seguidas.",
    erros: ["Diminuir o gesto para durar mais → aí você mede outra coisa, não o seu drive."],
  },
  "teste-6": {
    oque: "A cadeia inteira: cortada → abertura → topspin dele → bloqueio → seu ataque, 30 ciclos.",
    montagem: ["Visor: Freq 2 · Osc 4 · Top 4 · Back 4 — rodas iguais, bola sem efeito, que é a única mistura que o V300 faz. Para a cortada e o topspin de verdade, rode em séries alternadas trocando só o Top e o Back."],
    execucao: ["5 séries de 6 ciclos de 3 bolas.", "Conte as cadeias que chegaram até o fim."],
    meta: "Linha de corte 15 de 30. É o item que mais se parece com jogo.",
    erros: ["Contar a cadeia em que você bloqueou a terceira → a terceira é ataque, senão a cadeia não fechou."],
  },
  "teste-7": {
    oque: "Um set até 11 contra o robô, ponto = 5 bolas seguidas. A única medida com consequência de erro embutida.",
    montagem: ["Visor: Freq 5 · Osc 4 · Top 6 · Back 3."],
    execucao: ["Set completo até 11, com 2 de diferença.", "Anote o placar final."],
    meta: "Ganhar. E, perdendo, perder por menos que na última semana de teste.",
    erros: ["Reiniciar o set quando começa mal → é justamente o set ruim que o torneio cobra."],
  },
  "teste-8": {
    oque: "Cinco minutos anotando os sete números e comparando com a última semana de teste.",
    montagem: ["O app aberto nas anotações da semana de teste anterior."],
    execucao: ["Escreva os sete números na ordem dos itens.", "Marque quais subiram, quais ficaram e quais caíram.", "Escolha UM item que não subiu: ele vira o foco do bloco seguinte."],
    meta: "Os sete números anotados. Medida não anotada é medida perdida.",
    erros: ["Anotar só os bons → o item que caiu é o mais informativo dos sete."],
  },

  /* ---------- sexta: o adversário da semana ---------- */
  "adv-empurra": {
    oque: "Vinte minutos contra quem devolve tudo cortado e espera você errar — e sem a opção de empurrar de volta.",
    montagem: ["Visor: Freq 2 · Osc 4 · Top 3 · Back 7: tudo volta cortado, de lugar sorteado."],
    execucao: ["6 séries de 10 bolas.", "Abra TODAS. Nenhum push devolvido, nem a difícil, nem a última."],
    meta: "Aberturas que passaram. Errar abrindo aqui vale mais que ganhar empurrando.",
    erros: ["Entrar no jogo de empurrar dele → contra esse tipo você perde por paciência, nunca por técnica."],
  },
  "adv-ataca": {
    oque: "Vinte minutos contra quem abriu primeiro e está em cima de você: sobreviver seis bolas é literalmente a tática.",
    montagem: ["Visor: Freq 6 · Osc 5 · Top 7 · Back 2."],
    execucao: ["6 séries de 90 segundos.", "Bloqueie tudo mudando a direção a cada bola.", "Proibido atacar antes da sexta bola da sequência."],
    meta: "Sequências de 6 bloqueios. No amador, quem ataca demais erra perto de 40% — sobreviver é o plano.",
    erros: ["Recuar da mesa → sair contra quem ataca é entregar o ângulo.", "Tentar resolver na terceira bola → a regra das seis existe para isso."],
  },
  "adv-bh": {
    oque: "Contra quem tem backhand fraco. O robô não tem backhand fraco: quem está sendo treinada aqui é a sua mira.",
    montagem: ["Visor: Freq 4 · Osc 4 · Top 5 · Back 3. O que muda não é a bola dele, é onde VOCÊ coloca a sua."],
    execucao: ["6 séries de 8 sequências.", "Três bolas seguidas na diagonal esquerda, a quarta no forehand aberto.", "Errou a colocação: a sequência não conta."],
    meta: "Sequências 3+1 completas.",
    erros: ["Variar antes da terceira → a quarta só funciona porque as três primeiras foram no mesmo lugar."],
  },
  "adv-canhoto": {
    oque: "Contra canhoto: as diagonais invertem e a paralela vira o ângulo que ele abandona.",
    montagem: ["Visor: Freq 4 · Osc 4 · Top 6 · Back 3."],
    execucao: ["6 séries de 10 bolas.", "TODAS na paralela. Nenhuma diagonal — que é para onde a sua mão quer ir sozinha."],
    meta: "Paralelas certeiras.",
    erros: ["Cair na diagonal no automático → é ela que entrega o forehand forte do canhoto."],
  },
  "adv-previsivel": {
    oque: "Contra quem devolve sempre no mesmo lugar. O robô é literalmente este adversário.",
    montagem: ["Visor: Freq 4 · Osc 0 · Top 5 · Back 3 — oscilação desligada de propósito."],
    execucao: ["6 séries de 12 bolas.", "Pré-posicione ANTES de a bola sair e ataque de primeira.", "Nenhuma bola de espera."],
    meta: "Primeiras bolas atacadas. Em jogo, isto começa observando os três primeiros pontos.",
    erros: ["Esperar a bola para 'ver o que vem' → contra previsível, esperar desperdiça a sua única vantagem."],
  },
  /* ---------- academia ----------
     Aqui a descrição é de execução segura: carga errada em tênis de mesa custa
     semanas de mesa, e o ombro é a articulação que mais sai de jogo. A dose e a
     regra de carga da fase já estão no card; o que falta é a forma. */
  "fis-agachamento": {
    oque: "O exercício que sustenta a base semiflexionada do quinto set.",
    montagem: ["Barra apoiada no trapézio, não no pescoço.", "Pés na largura dos ombros, pontas levemente abertas."],
    execucao: ["Desça até a coxa passar da paralela, joelho acompanhando a ponta do pé.", "A subida é sempre rápida — é ela que vira arranque lateral na mesa.", "Respire em cima, não no meio da descida."],
    meta: "Todas as séries com a profundidade completa. Meia repetição não conta.",
    erros: ["Joelho caindo para dentro → afaste os pés e baixe a carga.", "Calcanhar saindo do chão → falta tornozelo; use calço e alongue antes."],
  },
  "fis-terra": {
    oque: "Cadeia posterior e lombar: é o que protege as costas no giro do forehand.",
    montagem: ["Barra colada na perna do começo ao fim.", "Joelhos levemente flexionados, e assim ficam."],
    execucao: ["Empurre o quadril para trás, lombar neutra.", "Desça até sentir o posterior esticar, não até o chão.", "Suba apertando o glúteo."],
    meta: "Terminar a série sem arredondar as costas em nenhuma repetição.",
    erros: ["Arredondar a lombar → pare a série imediatamente, é lesão a caminho.", "Afastar a barra da perna → aumenta a alavanca na coluna."],
  },
  "fis-bulgaro": {
    oque: "Uma perna de cada vez, que é como você joga: o peso está sempre num pé só.",
    montagem: ["Pé de trás no banco, peito do pé apoiado.", "Perna da frente longe o suficiente para o joelho não passar do pé."],
    execucao: ["Desça na vertical, sem projetar o joelho à frente.", "Suba pela perna da frente, sem empurrar com a de trás."],
    meta: "As duas pernas com a mesma qualidade. A pior manda na carga.",
    erros: ["Compensar com a perna de trás → tire carga até conseguir sem empurrar."],
  },
  "fis-panturrilha": {
    oque: "O primeiro centímetro do deslocamento lateral sai da panturrilha.",
    montagem: ["Ponta do pé num degrau, calcanhar livre."],
    execucao: ["Desça devagar até esticar, suba rápido.", "Amplitude completa: é ela que treina, não a carga."],
    meta: "Amplitude total nas três séries.",
    erros: ["Quicar com meia amplitude → vira gasto de tempo."],
  },
  "fis-prancha-lateral": {
    oque: "O tronco que segura o corpo montado quando você chega esticado na bola.",
    montagem: ["Cotovelo abaixo do ombro, corpo em linha reta."],
    execucao: ["Quadril alto, sem desabar.", "Respire normal — prancha com apneia não conta."],
    meta: "O tempo completo sem o quadril cair. Caiu, acabou a série.",
    erros: ["Rodar o tronco para aguentar mais → prefira menos tempo com a posição certa."],
  },
  "fis-salto-caixote": {
    oque: "Explosão vertical: a mesma que te tira do lugar no primeiro passo.",
    montagem: ["Caixote na altura em que você aterrissa com os pés inteiros no topo."],
    execucao: ["Salte e aterrisse suave, joelho flexionado.", "DESÇA do caixote, nunca salte para baixo."],
    meta: "Todos os saltos com aterrissagem silenciosa. Barulho é impacto mal absorvido.",
    erros: ["Subir a altura para impressionar → potência é velocidade, não altura."],
  },
  "fis-medicine": {
    oque: "O gesto do forehand com carga: rotação de quadril e tronco, braço por último.",
    montagem: ["De lado para a parede, pés na largura dos ombros."],
    execucao: ["Gire pelo quadril, o tronco segue, o braço é o último.", "Arremesse o mais forte possível — é exercício de velocidade."],
    meta: "Cada arremesso na máxima velocidade. Série lenta não treina potência.",
    erros: ["Arremessar só de braço → é exatamente o erro que você já faz na mesa."],
  },
  "fis-remada": {
    oque: "Costas e a musculatura que segura o ombro no lugar.",
    montagem: ["Tronco inclinado a 45°, lombar neutra."],
    execucao: ["Puxe a barra em direção ao umbigo, cotovelo rente ao corpo.", "Aperte a escápula no fim de cada repetição."],
    meta: "Sem usar impulso de tronco em nenhuma repetição.",
    erros: ["Puxar com o tronco → baixe a carga; o exercício é de costas, não de quadril."],
  },
  "fis-desenvolvimento": {
    oque: "Ombro forte é ombro que aguenta milhares de saques e topspins.",
    montagem: ["Sentado com apoio nas costas, ou em pé com abdômen contraído."],
    execucao: ["Suba até esticar sem travar o cotovelo.", "Desça controlado até a altura do queixo."],
    meta: "Amplitude igual nas duas séries finais.",
    erros: ["Arquear a lombar para levantar mais → é assim que se machuca a coluna num exercício de ombro."],
  },
  "fis-face-pull": {
    oque: "O exercício que mais previne lesão de ombro. Não é opcional.",
    montagem: ["Polia na altura do rosto, corda."],
    execucao: ["Puxe a corda em direção à testa, abrindo os cotovelos.", "Gire os ombros para fora no fim do movimento."],
    meta: "As 15 repetições em todas as fases do ciclo — esta dose não muda de propósito.",
    erros: ["Usar carga alta → aqui é qualidade e volume; carga alta tira o efeito protetor."],
  },
  "fis-pallof": {
    oque: "Anti-rotação: o tronco aprende a NÃO girar, que é o que segura a base quando o braço gira.",
    montagem: ["De lado para a polia, elástico na altura do peito."],
    execucao: ["Estenda os braços à frente resistindo à rotação.", "Segure 2 segundos na ponta."],
    meta: "Nenhuma rotação do tronco durante a série.",
    erros: ["Deixar o tronco girar com a polia → é o oposto do exercício."],
  },
  "fis-escada": {
    oque: "Frequência de passo: o pé aprende a tocar e sair do chão.",
    montagem: ["Escada no chão, ou linhas marcadas com fita."],
    execucao: ["Séries de 20 segundos, o mais rápido possível, com o pé leve.", "Olhe para a frente, não para os pés."],
    meta: "Todas as séries na mesma velocidade. Caiu a velocidade, acabou o exercício.",
    erros: ["Fazer devagar para não errar o passo → a velocidade é o treino."],
  },
  "fis-side-step": {
    oque: "O deslocamento da mesa, com resistência: é o mais específico da academia inteira.",
    montagem: ["Elástico na cintura, preso ao lado."],
    execucao: ["Side-step na posição de jogo, semiflexionado.", "Pés nunca se cruzam.", "Volte sempre à posição base entre um passo e outro."],
    meta: "Manter a altura do quadril durante toda a série. Subiu, cansou.",
    erros: ["Levantar o tronco quando cansa → é exatamente isso que acontece no quinto set; treine contra."],
  },
  "fis-sprint": {
    oque: "Arranque puro. Ponto de tênis de mesa dura poucos segundos e é decidido nos primeiros passos.",
    montagem: ["10 metros marcados, piso não escorregadio."],
    execucao: ["Tiros de 10 m, descanso completo entre eles (30 a 60 s).", "Saia forte, desacelere com calma."],
    meta: "O último tiro no mesmo tempo do primeiro.",
    erros: ["Encurtar o descanso → aí vira condicionamento, e o objetivo aqui é velocidade."],
  },
  "fis-intervalado": {
    oque: "A densidade de um set: esforço forte, pausa curta, repetido.",
    montagem: ["Corda ou bike."],
    execucao: ["30 segundos forte, 30 leves, sem parar entre os blocos."],
    meta: "O último bloco forte com a mesma intensidade do primeiro.",
    erros: ["Começar em ritmo insustentável → o primeiro bloco deve parecer fácil."],
  },
  "fis-prancha-dinamica": {
    oque: "O centro do corpo trabalhando enquanto os apoios mudam — como no jogo.",
    montagem: ["Prancha frontal, antebraços no chão."],
    execucao: ["Alterne apoio de antebraço e mão, sem balançar o quadril."],
    meta: "45 segundos com o quadril imóvel.",
    erros: ["Rebolar para trocar o apoio → diminua o ritmo da troca."],
  },

  /* ---------- saque: o foco da semana ---------- */
  "sv-foco": {
    oque: "Sessenta bolas no mesmo alvo, com o foco de saque da semana que está escrito no card.",
    montagem: [
      "Balde com 60 bolas do seu lado.",
      "Um alvo físico na zona do foco da semana: caixa, garrafa deitada ou folha de papel.",
      "Do outro lado da mesa, uma raquete deitada marcando onde a bola NÃO pode cair (meio-longo).",
    ],
    execucao: [
      "Séries de 10, com 40 segundos entre elas.",
      "Mesmo gesto nas 60 bolas. O foco da semana é um só, de propósito.",
      "Conte os acertos de cada série e registre na aba Saque.",
    ],
    meta: "A porcentagem no alvo subindo ao longo do ciclo. Na semana 12 você deve bater 7 de 10 no foco que treinou.",
    erros: [
      "Trocar de saque no meio → o ciclo inteiro do saque é feito de repetição do mesmo gesto.",
      "Não usar alvo → sem alvo não há acerto nem erro, só bola na mesa.",
      "Sacar forte para 'testar' → o saque da semana é o do card; teste na aba Saque, fora da série.",
    ],
  },
};

export { DETALHES };
