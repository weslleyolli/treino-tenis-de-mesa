/* ============================================================
   PREPARAÇÃO FÍSICA
   O buraco número um do ciclo antigo: não existia nenhuma.

   Tênis de mesa parece jogo de braço e é jogo de perna. O que decide o quinto
   set não é o gesto — é conseguir chegar na bola com a base montada quando o
   corpo já não quer. Três sessões por semana, na academia, separadas do treino
   de mesa (na mesma tarde, mas depois; nunca antes — perna cansada estraga o
   treino técnico e não melhora nada).

   As mesmas três sessões nas 12 semanas. O que muda é a dose, e ela muda junto
   com o bloco: no bloco 1 aprende o movimento, no 2 sobe a carga, no 3 o volume
   cai e a velocidade sobe — porque o bloco 3 é o de jogo, e chegar cansado na
   mesa em novembro derruba tudo que foi construído.
   ============================================================ */

const FASES = {
  1: { nome: "Adaptação", sub: "aprender o movimento antes de somar carga",
    regra: "Carga que deixa 2 repetições de sobra no fim da série. Se a última saiu feia, estava pesada demais.",
    descanso: "60 s", descansoNota: "Descanso curto: aqui o objetivo é o movimento virar hábito." },
  2: { nome: "Força", sub: "a carga sobe, as repetições caem",
    regra: "Carga que faz a última repetição sair difícil, mas com a técnica inteira. Suba 2,5 kg quando completar todas as séries duas semanas seguidas.",
    descanso: "2 min", descansoNota: "Força precisa de descanso completo, não de queimação." },
  3: { nome: "Potência", sub: "volume baixo, velocidade alta",
    regra: "Metade da carga do bloco 2, o dobro da velocidade na fase de subida. Parou de subir rápido, acabou a série — mesmo que faltem repetições.",
    descanso: "2 min", descansoNota: "Potência só existe descansado: série cansada vira série lenta, e série lenta não treina potência." },
};

/* dose[fase] — a mesma lista de exercícios, prescrição diferente por bloco. */
const FISICO = {
  A: {
    id: "A", nome: "Força de base", sub: "pernas e cadeia posterior", total: "≈ 45 min",
    porque: "A base do tênis de mesa é perna semiflexionada com o peso trocando de pé o tempo todo. Perna forte não te dá um golpe novo — te dá o mesmo golpe na bola 40 do set com a mesma qualidade da bola 4.",
    exercicios: [
      { nome: "Agachamento", dose: { 1: "3 × 12", 2: "4 × 6", 3: "4 × 3 explosivo" },
        cue: "Desça até a coxa passar da paralela. A subida é sempre rápida — é ela que vira arranque lateral na mesa." },
      { nome: "Levantamento terra romeno", dose: { 1: "3 × 12", 2: "4 × 8", 3: "3 × 5" },
        cue: "Barra colada na perna, quadril para trás, lombar neutra. É o que protege as costas no giro do forehand." },
      { nome: "Afundo búlgaro", dose: { 1: "3 × 10 cada perna", 2: "3 × 8 cada perna", 3: "3 × 6 cada perna" },
        cue: "Pé de trás no banco. Uma perna de cada vez, que é como você joga: o peso está sempre num pé só." },
      { nome: "Elevação de panturrilha", dose: { 1: "3 × 15", 2: "4 × 12", 3: "3 × 10 explosivo" },
        cue: "Amplitude inteira, descendo até esticar. O split-step sai daqui." },
      { nome: "Prancha lateral", dose: { 1: "3 × 40 s cada lado", 2: "3 × 45 s cada lado", 3: "3 × 40 s cada lado" },
        cue: "É o core que segura o tronco quando você abre de forehand fora de posição." },
    ],
  },

  B: {
    id: "B", nome: "Potência e rotação", sub: "tronco, ombro e explosão", total: "≈ 45 min",
    porque: "O topspin é uma rotação que começa no pé e termina na raquete. Treinar essa rotação com carga é a forma mais direta de ganhar velocidade de bola sem mexer no gesto. E o ombro entra aqui por saúde: o topspin fecha o ombro milhares de vezes por semana, e sem trabalho de puxada isso vira lesão.",
    exercicios: [
      { nome: "Salto no caixote", dose: { 1: "4 × 5", 2: "5 × 3", 3: "6 × 3" },
        cue: "Qualidade, não cansaço. Se a altura do salto cair, a série acabou — mesmo que faltem repetições." },
      { nome: "Arremesso rotacional de medicine ball", dose: { 1: "3 × 8 cada lado", 2: "4 × 6 cada lado", 3: "5 × 5 máximo cada lado" },
        cue: "É o gesto do topspin com carga. Jogue com o quadril e o pé de trás; o braço só entrega." },
      { nome: "Remada curvada", dose: { 1: "3 × 12", 2: "4 × 8", 3: "3 × 6" },
        cue: "Puxar equilibra o ombro que o saque e o topspin desgastam." },
      { nome: "Desenvolvimento de ombro", dose: { 1: "3 × 12", 2: "4 × 8", 3: "3 × 6" },
        cue: "Sem arquear a lombar. Se precisa jogar o quadril para subir, está pesado." },
      { nome: "Face pull", dose: { 1: "3 × 15", 2: "3 × 15", 3: "3 × 15" },
        cue: "Não é estética, é manguito rotador. Este é o exercício que te mantém jogando aos 40." },
      { nome: "Pallof press", dose: { 1: "3 × 10 cada lado", 2: "3 × 10 cada lado", 3: "3 × 8 cada lado" },
        cue: "Anti-rotação: você aprende a NÃO girar. É o que segura o tronco quando ele te pega fora de posição." },
    ],
  },

  C: {
    id: "C", nome: "Velocidade e resistência específica", sub: "arranque e densidade de set", total: "≈ 35 min",
    porque: "O ponto de tênis de mesa dura 4 segundos e o descanso dura 10. Correr 5 km não treina isso — treina o oposto. O que serve é esforço curto e máximo, repetido muitas vezes com pouca pausa. É literalmente a estrutura de um set.",
    exercicios: [
      { nome: "Escada de agilidade", dose: { 1: "6 × 20 s", 2: "6 × 20 s", 3: "8 × 20 s" },
        cue: "Pé no chão o mínimo de tempo possível. Não é chegar longe, é bater rápido." },
      { nome: "Side-step com elástico na cintura", dose: { 1: "4 × 30 s", 2: "4 × 40 s", 3: "4 × 30 s" },
        cue: "É o deslocamento do jogo com resistência. Nunca cruze os pés." },
      { nome: "Sprint 10 m", dose: { 1: "6 tiros", 2: "8 tiros", 3: "10 tiros" },
        cue: "Recuperação completa entre os tiros — isto é arranque, não corrida. Andar de volta já basta." },
      { nome: "Intervalado (corda ou bike)", dose: { 1: "8 × 30 s forte / 30 s leve", 2: "10 × 30 s / 30 s", 3: "8 × 30 s / 30 s" },
        cue: "É a densidade de um set: esforço curto, pausa curta, onze vezes seguidas." },
      { nome: "Prancha dinâmica", dose: { 1: "3 × 45 s", 2: "3 × 45 s", 3: "3 × 45 s" },
        cue: "Alterne apoio de mão e de cotovelo sem balançar o quadril." },
    ],
  },
};

/* Regras que valem para as três sessões, nas 12 semanas. */
const REGRAS_FISICO = [
  "**Depois da mesa, nunca antes.** Perna cansada estraga o treino técnico e não melhora o físico.",
  "**Na semana de teste (4, 8 e 12), corte a última série de cada exercício.** Medir cansado mede o cansaço.",
  "**Dois dias antes de campeonato, nada de perna pesada.** Só mobilidade e escada.",
  "Dor articular manda parar; dor muscular não. Aprenda a diferença antes de forçar.",
];

export { FISICO, FASES, REGRAS_FISICO };
