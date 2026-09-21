/* ============ ANÁLISE DE VÍDEO POR IA ============
   A aba Análise fazia isso com rubrica manual, item por item. Mandar o vídeo
   para um modelo e perguntar é mais rápido e cobre qualquer golpe do acervo —
   então o que sobrou dela é o que continua valendo: como filmar, e um prompt
   que ja vem preenchido com os passos e os erros DAQUELA tecnica. */

const COMO_FILMAR = [
  { t: "Slow motion obrigatório", d: "Grave em **slow motion** (120 ou 240 fps). Em velocidade normal o instante do contato quase não existe — a bola aparece borrada ou já saiu." },
  { t: "Câmera lateral", d: "Celular **perpendicular ao seu corpo**, na altura do quadril, a 2–3 m. É a única posição que mostra ângulo de joelho, arco do braço e ponto de contato. Para saque, use também uma frontal, do lado do adversário, na altura da rede." },
  { t: "Corpo inteiro no quadro", d: "Dos **pés até a raquete levantada**. Se cortar os pés, metade da análise se perde: a força vem do chão." },
  { t: "Luz de frente ou do lado", d: "**Nunca contraluz.** Fundo liso e contrastante com a bola — parede clara com bola laranja funciona bem." },
  { t: "6 a 8 repetições", d: "Grave o mesmo golpe várias vezes e mande a repetição **mais representativa, não a melhor**. Analisar o golpe excepcional não corrige nada." },
  { t: "Sem zoom digital e sem filtro", d: "Aproxime a câmera na gravação em vez de dar zoom. Corte e filtro atrapalham a leitura do ângulo da raquete." },
];

/* Tira o negrito de markdown: o prompt vai para um chat, não para a tela. */
const limpo = (s) => String(s).replace(/\*\*/g, "");

function promptDaTecnica(t) {
  const passos = t.steps.map((p, i) => `${i + 1}. ${limpo(p)}`).join("\n");
  const erros = t.err.map((e) => `- ${limpo(e)}`).join("\n");
  const exercicios = t.exercicios.map((e) => `- ${e.nome} (${e.series} séries × ${e.repet}): ${limpo(e.meta)}`).join("\n");

  return `Analise minha execução de ${t.name}${t.aka ? ` (${t.aka})` : ""} no tênis de mesa.

CONTEXTO
Sou destro e jogo de empunhadura clássica (shakehand). Vim da caneta, mas a transição está feita: a memória muscular já está na clássica. Não parta do princípio de que o que você vir é resíduo de caneta — julgue o gesto pelo que ele é. Treino com robô iPong V300, que regula topspin, backspin, frequência e oscilação.

O VÍDEO
Slow motion, câmera lateral, corpo inteiro no quadro, 6 a 8 repetições do mesmo golpe. Mandei a repetição mais representativa, não a melhor.

REFERÊNCIA TÉCNICA — avalie contra estes passos, um por um
${passos}

ERROS COMUNS NESTE GOLPE — confira se algum aparece
${erros}

O QUE EU PRECISO DE VOLTA
1. Uma nota de 0 a 10 para a execução.
2. Cada passo da referência marcado como certo, parcial ou errado.
3. O erro MAIS GRAVE — apenas um — e por que ele é o mais grave dos que você viu.
4. Um ajuste concreto que eu consiga sentir na próxima série. Uma sensação ou uma referência corporal, não teoria.
5. Em que momento do vídeo esse erro aparece mais claro (tempo aproximado).

EXERCÍCIOS QUE EU JÁ TENHO PARA ESTE GOLPE
${exercicios}

Se um destes já corrige o erro que você achou, diga qual e o que mudar nele. Se nenhum servir, proponha um, usando as regulagens do iPong V300.`;
}

/* ============ O PROMPT DO DIA ============
   O prompt por técnica (acima) serve para consertar UM golpe no acervo. Este
   serve para o dia: ele sai pronto no card do treino, já sabendo o tema do
   dia, a regulagem do robô que você usou e a técnica que o dia trabalha.

   E é escrito para VÍDEO, não para frames. Modelos que leem vídeo inteiro
   (Gemini, por exemplo) enxergam o que quadro nenhum mostra — se a oitava
   repetição continua igual à primeira, se você chega na bola pronto ou
   correndo atrás, e se você volta à base entre uma bola e outra. Essas três
   perguntas vêm primeiro no prompt de propósito: são as que o vídeo responde
   melhor que qualquer olho no meio do treino. */

const FILMAR_DO_DIA = {
  seg: {
    tema: "saída do backspin — abrir toda bola cortada",
    filmar: [
      "8 aberturas seguidas do bloco irregular, sem cortar o vídeo entre elas.",
      "Câmera lateral, na altura do quadril, a 2-3 m. Corpo inteiro no quadro, dos pés à raquete.",
      "Deixe a mesa aparecer: dá para ver se a bola passou com efeito ou só passou.",
    ],
    olhar: "Contra cortada o erro quase nunca é o braço: é chegar parado e atacar de cima.",
  },
  ter: {
    tema: "cozinhada — três empurradas e a quarta é ataque",
    filmar: [
      "4 ciclos completos: os três pushes E a quarta bola atacada. O ciclo inteiro, sem cortar.",
      "Câmera lateral um pouco atrás de você, pegando a sua metade da mesa.",
      "O importante é ver a altura dos pushes passando a rede.",
    ],
    olhar: "O que decide é a altura do push e se a quarta bola sai mesmo quando a terceira ficou ruim.",
  },
  qua: {
    tema: "defesa de topspin — bloqueio que muda de direção",
    filmar: [
      "10 bloqueios seguidos, do mesmo jeito que você faz no bloco irregular.",
      "Câmera lateral, mostrando a DISTÂNCIA entre você e a mesa — é o dado principal do dia.",
      "Se der, uma segunda tomada de trás, para ver a direção dos bloqueios.",
    ],
    olhar: "Recuar da mesa é o erro que não se sente na hora e aparece no vídeo na primeira olhada.",
  },
  qui: {
    tema: "correção lenta — o dia de consertar o gesto",
    filmar: [
      "8 repetições em meia velocidade da técnica que você está consertando.",
      "Slow motion do celular, se tiver. Câmera lateral, corpo inteiro.",
      "Mande a repetição mais REPRESENTATIVA, não a melhor.",
    ],
    olhar: "Hoje o vídeo é a ferramenta principal do treino, não um extra.",
  },
  sex: {
    tema: "simulação — os quatro erros dentro de um jogo",
    filmar: [
      "2 pontos inteiros do set, do saque até a bola morrer.",
      "Câmera mais alta e atrás de você, pegando a mesa inteira.",
      "Não escolha os pontos bonitos: pegue dois seguidos, como caírem.",
    ],
    olhar: "Aqui interessa a DECISÃO, não o gesto: quando você abriu, quando empurrou, quando recuou.",
  },
  sab: {
    tema: "com parceiro — o que o robô não faz",
    filmar: [
      "10 recepções de saque dele, variando efeito, sem você saber o que vem.",
      "Câmera lateral pegando os dois lados da mesa, para o gesto do saque dele aparecer.",
      "Grave também o que ele falou do efeito, se der.",
    ],
    olhar: "É o único vídeo da semana com bola de gente: a leitura de efeito só existe aqui.",
  },
  dom: {
    tema: "sombra — o gesto sem a pressa da bola",
    filmar: [
      "20 repetições de sombra dos gestos da semana, devagar.",
      "Duas tomadas: uma de frente e uma de lado. Sem bola, o enquadramento é livre.",
      "Fundo liso ajuda a ver o contorno do movimento.",
    ],
    olhar: "Sombra é onde o erro aparece sem disfarce, porque não tem bola para culpar.",
  },
};

/* Monta o prompt do dia com o que o app já sabe: tema, regulagem usada,
   técnica da vez e os exercícios que existem para ela. */
function promptDoDia({ diaId, diaNome, semana, tituloSemana, tecnica, dials }) {
  const f = FILMAR_DO_DIA[diaId];
  if (!f) return null;
  const visor = dials
    ? `Freq ${dials["Frequência"]} · Osc ${dials["Oscilação"]} · Top ${dials.Topspin} · Back ${dials.Backspin}`
    : null;

  const referencia = tecnica
    ? `REFERÊNCIA TÉCNICA — ${tecnica.name}. Avalie contra estes passos, um por um
${tecnica.steps.map((p, i) => `${i + 1}. ${limpo(p)}`).join("\n")}

ERROS COMUNS NESTE GOLPE — confira se algum aparece
${tecnica.err.map((e) => `- ${limpo(e)}`).join("\n")}`
    : "REFERÊNCIA TÉCNICA\nHoje não é dia de um golpe só: avalie o conjunto, na ordem em que as bolas aparecem.";

  const exercicios = tecnica
    ? `\n\nEXERCÍCIOS QUE EU JÁ TENHO PARA ESTA TÉCNICA
${tecnica.exercicios.map((e) => `- ${e.nome} (${e.series} séries × ${e.repet}): ${limpo(e.meta)}`).join("\n")}

Se um deles já corrige o erro que você achou, diga qual e o que mudar nele. Se nenhum servir, proponha um usando as regulagens do iPong V300 — Freq, Osc, Top e Back, cada um de 1 a 8, onde o efeito é a DIFERENÇA entre Top e Back (Top maior = topspin, Back maior = backspin, iguais = sem efeito).`
    : "";

  return `Analise a minha execução de hoje no tênis de mesa. Estou mandando um VÍDEO — use o vídeo inteiro, não um quadro parado.

CONTEXTO
Sou destro, empunhadura clássica (shakehand). Treino sozinho com o robô iPong V300.
Estou na semana ${semana} de 12 de um ciclo pós-torneio, montado em cima dos quatro erros que me custaram o último campeonato: sair do backspin, o jogo de cozinhada, o drive e a defesa de topspin.
A semana é "${tituloSemana}". Hoje, ${diaNome.toLowerCase()}, é o dia de ${f.tema}.

O QUE ESTÁ NO VÍDEO
${f.filmar.map((x) => `- ${limpo(x)}`).join("\n")}${visor ? `\n- Robô regulado em: ${visor}.` : ""}

${referencia}

O QUE SÓ O VÍDEO MOSTRA — responda estes três ANTES de falar de técnica
1. As repetições são iguais entre si? Compare a primeira com a última e diga o que mudou quando eu cansei.
2. Ritmo: eu chego na bola pronto ou correndo atrás dela? Diga em quais eu chego atrasado.
3. Recuperação: entre uma bola e outra eu volto à posição base, ou fico parado onde terminei o golpe?

O QUE EU PRECISO DE VOLTA
4. Uma nota de 0 a 10 para a execução.
5. Cada passo da referência marcado como certo, parcial ou errado — com o TEMPO do vídeo (ex.: 0:04) onde você viu isso.
6. O erro MAIS GRAVE, apenas um, e por que ele é o mais grave dos que você viu.
7. Um ajuste que eu consiga sentir na próxima série: uma sensação ou uma referência no corpo, não teoria.
8. Uma frase só para eu levar para o treino de amanhã.

REGRAS DA SUA RESPOSTA
- Se o vídeo não mostrar alguma coisa (ângulo ruim, contato fora do quadro, bola borrada), escreva "não dá para ver" em vez de deduzir. Prefiro um item a menos do que um palpite com cara de certeza.
- Cite o tempo do vídeo em toda afirmação sobre o meu gesto.
- Não elogie por educação. Se estiver ruim, diga que está ruim e onde.
- ${limpo(f.olhar)}${exercicios}`;
}

export { COMO_FILMAR, promptDaTecnica, promptDoDia, FILMAR_DO_DIA };
