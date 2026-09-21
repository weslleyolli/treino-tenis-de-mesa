/* TREINO EM GRUPO — uma mesa, um grupo, todo mundo treinando
   ======================================================================
   O problema que esta aba resolve: quando o pessoal se junta, vira
   campeonato. Campeonato é divertido e não levanta o nível de ninguém —
   cada um joga 3 ou 4 partidas do jeito que já joga e vai embora igual.

   Um treino em grupo com UMA mesa só funciona se duas coisas forem
   decididas antes de chegar no ginásio: quem está onde a cada minuto, e o
   que a pessoa que está fora da mesa está fazendo. Sem isso, metade do
   grupo fica parada olhando e o treino morre em 20 minutos.

   Por isso aqui tem conteúdo (o que treinar) E rodízio calculado (quem
   entra, quem sai, quem alimenta). A tela responde "e agora?" sem
   ninguém precisar lembrar de nada.

   A sessão foi desenhada para 5 pessoas e 1 mesa, mas os rodízios são
   calculados a partir da lista de nomes: com 4, 5 ou 6 tudo continua
   fechando, só muda quanto tempo cada um fica fora. */

/* ---------- As três regras que seguram o treino em pé ---------- */
export const REGRAS_DE_CASA = [
  {
    titulo: "Quem está fora tem função",
    texto: "Ninguém fica de braço cruzado. Quem sai da mesa cata bola, conta a série de quem está treinando ou alimenta. Fora da mesa não é descanso, é a outra metade do treino.",
  },
  {
    titulo: "Alimentador não compete",
    texto: "Quem está com o balde não está tentando ganhar do colega. A bola sai sempre no mesmo lugar, no mesmo ritmo. Dificultar de propósito estraga o bloco inteiro.",
  },
  {
    titulo: "Bola que atrapalha, repete",
    texto: "Bola de outra dupla no meio da jogada não conta. Repete sem discussão e sem reclamar — com uma mesa só isso vai acontecer o tempo todo.",
  },
];

/* ---------- A sessão, minuto a minuto ----------
   `painel` liga o bloco ao rodízio que a tela calcula. Bloco sem painel é
   só leitura: o grupo lê, faz e segue. */
export const BLOCOS = [
  {
    id: "aquecimento",
    nome: "Aquecimento em diagonais",
    de: 0, ate: 10, min: 10,
    formacao: "4 na mesa · troca aos 5 min",
    cor: "#2FA36B",
    painel: "diagonais",
    trocaSeg: 5 * 60,
    resumo: "Bola na mesa, sem ganhar ponto de ninguém. O objetivo é a mão esquentar e o pé começar a andar.",
    comoRodar: [
      "Duas duplas, cada uma numa diagonal: uma joga a diagonal do forehand, a outra a do backhand.",
      "Primeiros 2 min só backhand na diagonal, depois só forehand. Bola no meio da mesa, ritmo confortável.",
      "Ninguém tenta acelerar. Se a bola está caindo 10 vezes seguidas sem esforço, o aquecimento está certo.",
      "Aos 5 min todo mundo gira: quem estava fora entra, quem está há mais tempo sai.",
    ],
  },
  {
    id: "regularidade",
    nome: "Regularidade em diagonais",
    de: 10, ate: 30, min: 20,
    formacao: "4 na mesa · rodízio a cada 4 min",
    cor: "#1E5A8A",
    painel: "diagonais",
    trocaSeg: 4 * 60,
    resumo: "Três exercícios de controle, com meta em número. Aqui não se joga ponto — se conta série.",
    comoRodar: [
      "A cada 4 min o rodízio gira e a dupla troca de exercício.",
      "A meta é contada em voz alta pelo colega que está fora. Errou, volta a contar do zero.",
      "Bateu a meta antes do tempo acabar? Aumenta o ritmo, não o risco.",
    ],
  },
  {
    id: "multibola",
    nome: "Multibola",
    de: 30, ate: 54, min: 24,
    formacao: "1 alimenta · 1 treina · o resto cata",
    cor: "#F26B21",
    painel: "multibola",
    turnoSeg: 2 * 60,
    resumo: "O bloco mais valioso do dia. Duas voltas de 2 min por pessoa, 30 bolas por vez, com foco definido.",
    comoRodar: [
      "Quem acabou de treinar vira o alimentador do próximo — assim ninguém precisa combinar nada.",
      "30 bolas por vez. Quem está catando conta os acertos em voz alta.",
      "No fim das duas voltas os acertos viram o ranking do dia.",
    ],
  },
  {
    id: "jogo",
    nome: "Jogo com regra",
    de: 54, ate: 80, min: 26,
    formacao: "2 jogam · resto na fila · máx. 2 vitórias",
    cor: "#7A4FE0",
    painel: "jogo",
    resumo: "Ponto de verdade, mas com uma regra que obriga o grupo a usar o que acabou de treinar.",
    comoRodar: [
      "Partidas de 7 pontos, saque trocando a cada 2.",
      "Quem ganha fica na mesa, no máximo 2 vitórias seguidas. Na terceira, sai e vai para o fim da fila.",
      "A regra do dia vale para os dois jogadores e é a mesma o bloco inteiro.",
    ],
  },
  {
    id: "fechamento",
    nome: "Fechamento",
    de: 80, ate: 85, min: 5,
    formacao: "grupo inteiro",
    cor: "#D6A324",
    painel: null,
    resumo: "Cinco minutos sentado com o grupo. Sem isso, ninguém leva nada do treino para casa.",
    comoRodar: [
      "Lê o ranking da multibola em voz alta.",
      "Cada um fala UMA frase: o que melhorou hoje e o que ainda está ruim.",
      "Combina o foco do próximo treino ali, na hora, antes de todo mundo sumir.",
    ],
  },
];

/* ---------- Os três exercícios do bloco de regularidade ---------- */
export const DRILLS = [
  {
    nome: "Diagonal fixa",
    meta: "30 seguidas",
    como: "Os dois jogam sempre na mesma diagonal, mesmo golpe. Nada de mudar direção.",
    olho: "A bola tem que cair sempre na mesma metade da mesa. Se está espalhando, o ritmo está alto demais.",
  },
  {
    nome: "Um fixo, um livre",
    meta: "20 trocas",
    como: "Um joga sempre na mesma diagonal; o outro devolve para onde quiser. Trocam a cada 2 min.",
    olho: "Quem está fixo treina constância; quem está livre treina decidir cedo para onde a bola vai.",
  },
  {
    nome: "Dois pontos, um golpe",
    meta: "10 sequências",
    como: "Um manda alternado em dois pontos da mesa (meio e ponta do forehand); o outro devolve tudo com o mesmo golpe.",
    olho: "É o exercício que obriga o pé a andar. Se o braço está esticando para alcançar, o pé não foi.",
  },
];

/* ---------- Como alimentar sem estragar o treino do colega ----------
   Metade dos grupos faz multibola errado porque o alimentador tenta jogar
   bonito. O trabalho dele é ser previsível. */
export const GUIA_ALIMENTADOR = {
  onde: "De pé na lateral da mesa, do lado do forehand de quem treina, com o balde na mão que não joga.",
  passos: [
    "**Backspin:** a bola bate primeiro na SUA metade da mesa e só depois passa. É isso que dá a bola baixa e cortada.",
    "**Topspin:** direto para a metade do colega, com a mão fechando por cima.",
    "**Ritmo constante:** comece com uma bola a cada 3 segundos e não mude no meio da série.",
    "**Só acelere quando ele estiver em 8 de 10.** Antes disso, mais rápido não é mais difícil, é só mais errado.",
    "**Não teste o parceiro.** Mesma altura, mesmo lugar, mesma força — a dificuldade do exercício já está no exercício.",
  ],
};

/* ---------- O foco de cada volta da multibola ----------
   São as duas coisas que mais custaram pontos no último campeonato. */
export const FOCOS_MULTIBOLA = [
  {
    volta: 1,
    titulo: "Saída do backspin",
    alvo: "Abrir TODAS as bolas",
    como: "O alimentador manda 30 bolas cortadas. A regra é abrir todas — nada de empurrar de volta para ficar no seguro.",
    conta: "Conta como acerto a bola que passa por cima da rede com giro para frente e cai na mesa. Bola empurrada não conta, mesmo caindo.",
  },
  {
    volta: 2,
    titulo: "Defesa de topspin",
    alvo: "Bloquear mudando a direção",
    como: "O alimentador manda 30 bolas com topspin. Bloquear devolvendo para a diagonal oposta de onde veio.",
    conta: "Conta como acerto o bloqueio que cai na metade combinada. Devolver no mesmo lugar não conta.",
  },
];

/* ---------- O bloco de jogo ---------- */
export const REGRAS_JOGO = {
  pontos: "Partidas de 7 pontos. Vitória vale 2 pontos no placar do dia.",
  bonus: "Quem cumpriu a regra do dia a partida inteira ganha +1, mesmo perdendo. É o que impede o grupo de abandonar a regra quando o jogo aperta.",
  opcoes: [
    { id: "A", nome: "Regra A — toda cortada tem que ser aberta", texto: "Nenhuma bola cortada pode ser devolvida empurrada. Empurrou, perdeu o ponto." },
    { id: "B", nome: "Regra B — nenhum ponto passa de 5 bolas", texto: "Chegou na 6ª bola do rali, o ponto morre e ninguém marca. Obriga os dois a atacar." },
  ],
};

/* ---------- Quando o dia não sai como o planejado ---------- */
export const PLANO_B = [
  { se: "Menos de 40 bolas", entao: "Turnos de multibola de 90 s em vez de 2 min. Menos bola por vez, mesma quantidade de voltas." },
  { se: "Só 4 pessoas", entao: "Tudo funciona e ninguém fica fora: 4 na mesa nas diagonais, e na multibola 1 alimenta, 1 treina, 2 catam." },
  { se: "6 pessoas", entao: "2 ficam fora nas diagonais. O sexto filma a multibola — o vídeo vale tanto quanto a bola." },
  { se: "O grupo reclamando", entao: "Corta o bloco 2 (regularidade) e vai direto para a multibola. Nunca corte a multibola: é o único bloco que ninguém consegue fazer sozinho." },
  { se: "Só 1 hora", entao: "8 min de aquecimento, 24 de multibola, 25 de jogo. Corta as diagonais." },
];

/* ============ RODÍZIOS ============
   Tudo abaixo é função pura: mesma lista + mesma volta = mesma escalação.
   A tela só guarda em que volta o grupo está. */

/* DIAGONAIS — 4 na mesa em duas duplas, cada dupla numa diagonal.
   A cada volta quem está na mesa há mais tempo sai e quem estava fora entra.
   Com 5 pessoas, 5 voltas fecham um ciclo e cada um fica fora exatamente uma
   vez. Com 4, ninguém sai. Com 6, saem dois por volta. */
export function escalacaoDiagonais(jogadores, volta) {
  const n = jogadores.length;
  if (n < 2) return null;
  const naMesa = Math.min(4, n);
  const v = ((volta % n) + n) % n;
  const ordem = Array.from({ length: n }, (_, i) => jogadores[(v + i) % n]);
  const mesa = ordem.slice(0, naMesa);
  const fora = ordem.slice(naMesa);
  /* Os dois lados da mesa: os dois primeiros de um lado, os dois seguintes do
     outro. As diagonais saem do cruzamento — é assim que 4 pessoas jogam numa
     mesa sem uma bola bater na outra. */
  const diagonais = [];
  if (mesa.length >= 4) {
    diagonais.push({ nome: "Diagonal do forehand", par: [mesa[0], mesa[2]] });
    diagonais.push({ nome: "Diagonal do backhand", par: [mesa[1], mesa[3]] });
  } else if (mesa.length >= 2) {
    diagonais.push({ nome: "Mesa inteira", par: [mesa[0], mesa[1]] });
  }
  return { mesa, fora, diagonais };
}

/* MULTIBOLA — quem acabou de treinar alimenta o próximo.
   Turno t: treina o jogador t, alimenta o jogador t-1, o resto cata bola.
   A regra é essa porque não exige combinação nenhuma: quem largou a raquete
   pega o balde. */
export function turnoMultibola(jogadores, turno) {
  const n = jogadores.length;
  if (n < 2) return null;
  const t = ((turno % n) + n) % n;
  const treina = jogadores[t];
  const alimenta = jogadores[(t - 1 + n) % n];
  const catam = jogadores.filter((j) => j !== treina && j !== alimenta);
  return { treina, alimenta, catam };
}

export const totalTurnosMultibola = (n, voltas = 2) => n * voltas;

/* Em qual volta (e portanto com qual foco) está o turno global. */
export const voltaDoTurno = (n, turnoGlobal) => Math.floor(turnoGlobal / Math.max(1, n));

/* JOGO — fila com limite de 2 vitórias seguidas.
   `seguidas` é a sequência DE QUEM ESTÁ NA MESA, então anda junto com o nome
   do dono (`campeao`). Sem isso, quem acabou de entrar e venceu herdava a
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
    novasSeguidas = 0;
    novoCampeao = null;
  } else {
    novaFila.push(perdedor);
    const entra = novaFila.shift();
    novaMesa = entra ? [vencedor, entra] : [vencedor, perdedor];
    novasSeguidas = entra ? sequencia : 0;
    novoCampeao = entra ? vencedor : null;
  }
  return { mesa: novaMesa, fila: novaFila, seguidas: novasSeguidas, campeao: novoCampeao, perdedor };
}

/* Placar do dia: multibola (1 ponto por acerto) e jogo (2 por vitória, 1 por
   cumprir a regra) moram em escalas diferentes de propósito. O ranking que o
   grupo lê no fechamento é o da multibola, porque é o que mede execução e não
   sorte de chaveamento. */
export function rankingMultibola(jogadores, acertos) {
  return jogadores
    .map((nome) => {
      const v = FOCOS_MULTIBOLA.map((f) => Number(acertos[`${f.volta}:${nome}`]) || 0);
      return { nome, voltas: v, total: v.reduce((a, b) => a + b, 0) };
    })
    .sort((a, b) => b.total - a.total);
}

export const TOTAL_MIN = BLOCOS.reduce((a, b) => a + b.min, 0);
