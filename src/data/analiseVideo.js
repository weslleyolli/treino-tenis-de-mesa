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

export { COMO_FILMAR, promptDaTecnica };
