/* CAMPEONATO COM REGRA — o acervo de regras e os formatos
   ======================================================================
   Campeonato normal não levanta o nível de ninguém: cada um joga do jeito
   que já joga, ganha ou perde, e vai embora igual. O que muda o jogo é uma
   regra que PROÍBE a saída fácil — aquela que você usa quando a bola fica
   difícil e que é justamente a que precisa sumir.

   Toda regra aqui tem três coisas obrigatórias:
     · o que ela treina (senão é só brincadeira);
     · como funciona em uma frase que dá para falar em voz alta;
     · como o juiz marca — se não dá para arbitrar de fora da mesa, a regra
       morre no primeiro ponto em que os dois discordam.

   E toda regra tem nível: 1 dá para jogar hoje sem pensar muito, 2 exige
   atenção e o jogo cai de ritmo no começo, 3 vira outro esporte por uns
   minutos (e é onde mais se aprende, se o grupo aguentar).

   DUAS RAQUETES BASTAM. Numa mesa só, jogam sempre dois. Quem está fora não
   precisa de raquete: apita. Foi por isso que os blocos de diagonais e
   multibola saíram daqui — aqueles sim precisavam de raquete para todo
   mundo. (A multibola precisa de uma raquete só, a de quem treina; se um dia
   sobrar bola e tempo, ela volta.) */

export const CATEGORIAS = [
  { id: "abre", nome: "Saída do backspin", cor: "#F26B21", alvo: "abrir a bola cortada em vez de empurrar de volta" },
  { id: "curto", nome: "Jogo curto", cor: "#1E5A8A", alvo: "a cozinhada: controlar a bola baixa perto da rede" },
  { id: "ataque", nome: "Drive e ataque", cor: "#D14A32", alvo: "terminar o ponto em vez de esperar o erro do outro" },
  { id: "defesa", nome: "Defesa e bloqueio", cor: "#7A4FE0", alvo: "aguentar o topspin do outro sem recuar" },
  { id: "saque", nome: "Saque e devolução", cor: "#2FA36B", alvo: "as duas bolas que decidem metade dos pontos" },
  { id: "cabeca", nome: "Cabeça", cor: "#D6A324", alvo: "o que você faz quando o ponto aperta" },
];

/* `placar` só existe quando a regra mexe na contagem. Sem ele, a punição é
   sempre a mesma: quebrou a regra, perdeu o ponto. */
export const REGRAS = [
  /* ---------- saída do backspin ---------- */
  {
    id: "r-abre-tudo", cat: "abre", nivel: 2,
    nome: "Toda cortada tem que ser aberta",
    como: "Nenhuma bola com backspin pode ser devolvida empurrada. Se veio cortada, vai por cima com giro para frente.",
    juiz: "Olha o movimento, não o resultado: empurrou (raquete aberta, bola sem giro) já é falta, mesmo que a bola caia.",
    aviso: "É a regra que mais dói e a que mais resolve. Espere errar muito nos primeiros 10 pontos.",
  },
  {
    id: "r-abre-premio", cat: "abre", nivel: 1,
    nome: "Abriu e ganhou, vale 2",
    como: "Quem abre a primeira bola cortada do ponto e ganha esse ponto marca 2 em vez de 1.",
    juiz: "Só precisa lembrar quem abriu primeiro. Se ninguém abriu, o ponto vale 1 normal.",
    placar: "2 pontos no ponto ganho abrindo",
    aviso: "Versão gentil da regra de cima: premia em vez de punir. Boa para começar o dia.",
  },
  {
    id: "r-abre-terceira", cat: "abre", nivel: 2,
    nome: "Terceira bola é obrigatória",
    como: "Quem saca tem que atacar a terceira bola do ponto, seja qual for a devolução.",
    juiz: "Conta as bolas em voz alta: saque (1), devolução (2), e a 3 tem que sair atacada.",
  },
  {
    id: "r-abre-sem-medo", cat: "abre", nivel: 3,
    nome: "Empurrou, perdeu — nos dois lados",
    como: "Vale a regra de abrir tudo, e mais: nenhuma bola pode ser devolvida sem giro, em nenhum momento do ponto.",
    juiz: "Bola boba no meio da mesa, sem giro nenhum, é falta de quem mandou.",
    aviso: "Nível 3 de verdade. Use em um game curto, não no campeonato inteiro.",
  },

  /* ---------- jogo curto ---------- */
  {
    id: "r-curto-saque", cat: "curto", nivel: 1,
    nome: "Todo saque tem que ser curto",
    como: "O saque tem que quicar duas vezes na mesa do adversário. Saiu longo, perdeu o ponto.",
    juiz: "É o mais fácil de arbitrar do acervo: ou deu o segundo quique antes da linha de fundo, ou não deu.",
  },
  {
    id: "r-curto-duas", cat: "curto", nivel: 2,
    nome: "Duas curtas antes de abrir",
    como: "As duas primeiras bolas de cada lado têm que ficar curtas. Só a partir da terceira o ponto libera.",
    juiz: "Conta as bolas. Bola que passa da metade da mesa do outro antes da terceira é falta.",
  },
  {
    id: "r-curto-longa", cat: "curto", nivel: 2,
    nome: "Quem alonga, entrega",
    como: "Na fase curta, quem manda a primeira bola longa não perde o ponto — entrega a bola para o outro atacar. Se o outro atacar e ganhar, vale 2.",
    juiz: "Marca quem alongou primeiro. Se ele ainda ganhar o ponto, vale 1 normal.",
    placar: "2 pontos para quem ataca a bola entregue",
    aviso: "Melhor que punir: ensina que alongar cedo tem preço, sem parar o rali.",
  },
  {
    id: "r-curto-varia", cat: "curto", nivel: 3,
    nome: "Não repete o lugar",
    como: "Na fase curta, ninguém pode devolver duas vezes seguidas no mesmo lugar da mesa. Tem que variar.",
    juiz: "O juiz divide a mesa em três (forehand, meio, backhand) e só olha se caiu duas vezes na mesma faixa.",
  },

  /* ---------- drive e ataque ---------- */
  {
    id: "r-atk-cinco", cat: "ataque", nivel: 1,
    nome: "Nenhum ponto passa de 5 bolas",
    como: "Chegou na 6ª bola do rali, o ponto morre e ninguém marca. Os dois são obrigados a resolver cedo.",
    juiz: "Conta alto: 1, 2, 3, 4, 5 — e grita 'morreu'. Ponto anulado, saca de novo.",
    aviso: "É a regra que mais tira gente da zona de conforto sem exigir técnica nova.",
  },
  {
    id: "r-atk-primeiro", cat: "ataque", nivel: 1,
    nome: "Quem ataca primeiro leva mais",
    como: "Ponto ganho com bola atacada vale 2. Ponto ganho esperando o erro do outro vale 1.",
    juiz: "A última bola de quem ganhou foi um ataque? 2. Foi devolução, ou o outro errou sozinho? 1.",
    placar: "2 pontos no ponto ganho atacando",
  },
  {
    id: "r-atk-bloqueio", cat: "ataque", nivel: 2,
    nome: "Dois bloqueios e acabou",
    como: "Depois de dois bloqueios seguidos, o terceiro tem que ser contra-ataque. Bloqueou três vezes, perdeu o ponto.",
    juiz: "Conta os bloqueios de quem está defendendo. Na terceira bola passiva, aponta e marca.",
  },
  {
    id: "r-atk-so-fh", cat: "ataque", nivel: 3,
    nome: "Só forehand",
    como: "O game inteiro sem backhand. Tudo que chega no lado do backhand tem que ser contornado com o pé.",
    juiz: "Bateu de backhand, perdeu o ponto. Não tem meio-termo.",
    aviso: "Cansa muito e melhora o pé de todo mundo. Um game, não mais.",
  },

  /* ---------- defesa e bloqueio ---------- */
  {
    id: "r-def-muda", cat: "defesa", nivel: 2,
    nome: "Bloqueio tem que mudar de direção",
    como: "Todo bloqueio devolve para a diagonal oposta de onde a bola veio. Devolveu no mesmo lugar, perdeu o ponto.",
    juiz: "Veio do lado direito, tem que cair no lado esquerdo. O juiz olha só isso.",
  },
  {
    id: "r-def-dobro", cat: "defesa", nivel: 1,
    nome: "Defendeu e virou, vale 2",
    como: "Ponto ganho depois de ter defendido pelo menos um ataque do adversário vale 2.",
    juiz: "Teve um ataque do outro lado no meio do ponto? Se quem defendeu ganhou, vale 2.",
    placar: "2 pontos no ponto ganho depois de defender",
  },
  {
    id: "r-def-perto", cat: "defesa", nivel: 3,
    nome: "Proibido recuar",
    como: "Ninguém pode dar mais de um passo para trás da linha de fundo. A bola tem que ser pega perto da mesa.",
    juiz: "Marca o chão com uma garrafa ou a mochila. Pisou atrás, perdeu o ponto.",
    aviso: "É a regra que mata o hábito de fugir da mesa quando o topspin vem forte.",
  },

  /* ---------- saque e devolução ---------- */
  {
    id: "r-sq-varia", cat: "saque", nivel: 1,
    nome: "Saque nunca repete",
    como: "Não pode sacar duas vezes seguidas igual: ou muda o efeito, ou muda o lugar.",
    juiz: "Só lembrar do saque anterior. Repetiu os dois (efeito e lugar), perdeu o ponto.",
  },
  {
    id: "r-sq-anunciado", cat: "saque", nivel: 2,
    nome: "Saque anunciado",
    como: "Antes de sacar, o sacador diz em voz alta o efeito que vai colocar. E tem que cumprir.",
    juiz: "O juiz confere se saiu o que foi dito. Mentiu, perdeu o ponto.",
    aviso: "Parece que entrega o jogo e não entrega: o outro sabe o efeito e continua errando. Mostra para o grupo que saque bom não é saque escondido.",
  },
  {
    id: "r-sq-bh", cat: "saque", nivel: 2,
    nome: "Devolução só de backhand",
    como: "Toda devolução de saque tem que ser de backhand, esteja a bola onde estiver.",
    juiz: "Devolveu de forehand, perdeu o ponto.",
  },
  {
    id: "r-sq-dois", cat: "saque", nivel: 1,
    nome: "Dois saques ruins e a bola é do outro",
    como: "Errou dois saques no game (na rede ou fora), o saque passa para o adversário pelo resto do game.",
    juiz: "Conta os saques errados de cada um. É a punição mais barata do acervo.",
  },

  /* ---------- cabeça ---------- */
  {
    id: "r-cb-falado", cat: "cabeca", nivel: 2,
    nome: "Ponto falado",
    como: "Antes de sacar, o sacador diz em voz alta como pretende terminar o ponto ('abro na terceira', 'ataco o backhand dele').",
    juiz: "Não precisa cumprir — precisa dizer. Sacou calado, perdeu o ponto.",
    aviso: "Obriga cada um a ter um plano. Metade do grupo vai descobrir que não tinha nenhum.",
  },
  {
    id: "r-cb-calado", cat: "cabeca", nivel: 1,
    nome: "Reclamou, perdeu",
    como: "Reclamar da bola, da mesa, do juiz ou de si mesmo custa o ponto. Vale para xingar sozinho também.",
    juiz: "O juiz decide na hora e não discute. Discutir a decisão também é reclamar.",
    aviso: "Parece piada e é o melhor treino de cabeça do acervo. Em campeonato de verdade ninguém devolve o ponto que você jogou fora reclamando.",
  },
  {
    id: "r-cb-handicap", cat: "cabeca", nivel: 1,
    nome: "O melhor começa perdendo",
    como: "Quem está na frente da classificação começa cada partida 0 a 3 atrás.",
    juiz: "Só ajustar o placar antes de começar. O número sobe para 0-4 se ele continuar ganhando fácil.",
    aviso: "É o que mantém o grupo inteiro competindo em vez de duas pessoas dominando o dia.",
  },
  {
    id: "r-cb-longo", cat: "cabeca", nivel: 1,
    nome: "Rali longo vale mais",
    como: "Ponto que passou de 8 bolas vale 2 para quem ganhar.",
    juiz: "Conta as bolas. Passou de 8, avisa: 'esse vale 2'.",
    placar: "2 pontos no ponto que passou de 8 bolas",
    aviso: "O contrário da regra das 5 bolas. Use quando o grupo estiver terminando tudo no braço.",
  },
];

export const regrasPorCategoria = (cat) => REGRAS.filter((r) => r.cat === cat);
export const regraPorId = (id) => REGRAS.find((r) => r.id === id);

export const NIVEIS = {
  1: { nome: "Dá para jogar hoje", cor: "#2FA36B" },
  2: { nome: "Exige atenção", cor: "#D6A324" },
  3: { nome: "Vira outro jogo", cor: "#D14A32" },
};

/* ---------- Formatos ---------- */
export const FORMATOS = [
  {
    id: "todos",
    nome: "Todos contra todos",
    resumo: "Cada um joga contra cada um, uma vez. Com 5 pessoas são 10 partidas e a tela monta a tabela.",
    detalhe: [
      "A cada rodada, quem está de folga **apita** — e é por isso que não precisa de raquete para todo mundo.",
      "Cada rodada tem a sua regra. Ela troca sozinha quando a rodada vira.",
      "Vitória vale 2. Quem cumpriu a regra a partida inteira ganha +1, mesmo perdendo.",
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

export const totalPartidas = (rodadas) => rodadas.reduce((a, r) => a + r.jogos.length, 0);

/* Classificação a partir dos resultados já lançados.
   `resultados` é { "chaveDaPartida": { vencedor, bonus: [nomes] } } */
export function classificacao(jogadores, resultados) {
  const base = {};
  jogadores.forEach((j) => { base[j] = { nome: j, pts: 0, v: 0, d: 0, regra: 0 }; });
  Object.values(resultados || {}).forEach((res) => {
    if (!res || !res.vencedor) return;
    const v = base[res.vencedor];
    if (v) { v.pts += 2; v.v += 1; }
    if (res.perdedor && base[res.perdedor]) base[res.perdedor].d += 1;
    (res.bonus || []).forEach((nome) => {
      if (base[nome]) { base[nome].pts += 1; base[nome].regra += 1; }
    });
  });
  return Object.values(base).sort((a, b) =>
    b.pts - a.pts || b.v - a.v || b.regra - a.regra || a.nome.localeCompare(b.nome));
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
