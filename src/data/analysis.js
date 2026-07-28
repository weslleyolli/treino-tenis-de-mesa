/* ============ ABA ANÁLISE — dados ============ */
const CAPTURE = [
  { t: "Slow motion obrigatório", d: "Grave em **slow motion** (120 ou 240 fps). Em velocidade normal o frame do contato quase nunca existe — a bola aparece borrada ou já saiu." },
  { t: "Duas posições de câmera", d: "**Lateral:** celular perpendicular ao seu corpo, na altura do quadril, a 2–3 m. É a única que mostra ângulo de joelho, arco do braço e ponto de contato. **Frontal:** do lado do adversário, atrás da mesa, na altura da rede — serve para saque e disfarce." },
  { t: "Enquadramento", d: "Corpo **inteiro no quadro**, dos pés até a raquete levantada. Se cortar os pés, metade da análise se perde: a força vem do chão." },
  { t: "Luz e fundo", d: "Luz vindo de frente ou do lado, **nunca contraluz**. Fundo liso e contrastante com a bola — parede clara com bola laranja funciona bem." },
  { t: "Quantidade", d: "Grave **6 a 8 repetições** do mesmo golpe e escolha a mais representativa (não a melhor). Analisar o golpe excepcional não corrige nada." },
  { t: "Print em resolução cheia", d: "Pause e tire print **sem recortar e sem filtro**. Não use zoom digital: prefira aproximar a câmera na gravação." },
];

const FRAMES_GUIDE = [
  { n: "F1", t: "Posição de espera", when: "Antes de qualquer movimento, com a bola vindo.", look: "Largura dos pés, flexão de joelho, altura da raquete, inclinação do tronco." },
  { n: "F2", t: "Fim da preparação", when: "No instante em que a raquete atinge o ponto mais atrás/mais baixo — antes de começar a subir.", look: "Rotação de quadril e ombro, altura da raquete, distribuição de peso, ângulo do cotovelo." },
  { n: "F3", t: "CONTATO", when: "O frame exato em que a bola toca a borracha. É o mais importante dos quatro.", look: "Altura da bola, posição em relação ao quadril, ângulo da raquete, posição do punho, região da borracha." },
  { n: "F4", t: "Finalização", when: "Fim natural do movimento, antes de recuperar a base.", look: "Onde a raquete parou, transferência de peso, se o tronco levantou, início da recuperação." },
];

const RUBRICS = [
  { id: "fh", name: "Forehand Drive", frames: [
    { f: "F1", label: "Posição de espera", items: [
      { c: "Pés mais afastados que a largura dos ombros", ref: "Pé direito meio passo atrás", err: "Pés juntos e paralelos" },
      { c: "Joelhos flexionados ~120°", ref: "Quadríceps sob tensão visível", err: "Pernas retas (vício de ping pong)" },
      { c: "Raquete à frente do corpo, altura do umbigo", ref: "Ponta apontando para a rede", err: "Raquete baixa ao lado do corpo" },
    ]},
    { f: "F2", label: "Fim da preparação", items: [
      { c: "Quadril e ombro girados ~45° à direita", ref: "O ombro esquerdo aponta para a rede", err: "Só o braço foi para trás, tronco parado" },
      { c: "Raquete na altura da cintura, não atrás das costas", ref: "Cotovelo entre 90° e 110°", err: "Raquete muito atrás — golpe longo demais" },
      { c: "Peso 60–70% na perna direita", ref: "Joelho direito mais flexionado que o esquerdo", err: "Peso centrado ou já na esquerda" },
    ]},
    { f: "F3", label: "Contato", items: [
      { c: "Bola no topo do quique", ref: "Altura entre a rede e o ombro", err: "Bola já caindo — contato atrasado" },
      { c: "Contato à frente do quadril direito", ref: "Bola visivelmente à frente do corpo", err: "Contato ao lado ou atrás do quadril" },
      { c: "Raquete fechada 45–60°", ref: "Face olhando para a mesa em diagonal", err: "Raquete aberta — bola sobe alta" },
      { c: "Punho neutro, alinhado ao antebraço", ref: "Sem dobra visível no punho", err: "Punho quebrado para baixo (vício de caneta)" },
    ]},
    { f: "F4", label: "Finalização", items: [
      { c: "Raquete termina na altura do nariz/testa", ref: "Apontando para o alvo", err: "Raquete parou na altura do peito — golpe freado" },
      { c: "Peso transferido para a perna esquerda", ref: "Quadril girado de frente para a rede", err: "Peso ainda atrás" },
      { c: "Tronco continua inclinado à frente", ref: "Postura de jogo mantida", err: "Levantou o corpo durante o golpe" },
    ]},
  ]},
  { id: "bh", name: "Backhand Drive", frames: [
    { f: "F1", label: "Posição de espera", items: [
      { c: "Corpo de frente para a mesa, pés quase paralelos", ref: "Ombros paralelos à rede", err: "Corpo virado como no forehand" },
      { c: "Joelhos flexionados e tronco à frente", ref: "Peso na ponta dos pés", err: "Postura ereta" },
    ]},
    { f: "F2", label: "Fim da preparação", items: [
      { c: "Raquete na frente do corpo, altura do umbigo", ref: "Nunca atrás da linha do tronco", err: "Raquete puxada para trás" },
      { c: "Cotovelo à frente e praticamente imóvel", ref: "É o eixo do movimento", err: "Cotovelo recuando ou subindo" },
      { c: "Antebraço fechado, pronto para abrir", ref: "Ângulo fechado como um leque", err: "Braço estendido antes do golpe" },
    ]},
    { f: "F3", label: "Contato", items: [
      { c: "Contato NA FRENTE do corpo", ref: "Na linha do abdômen ou adiante", err: "Deixou a bola entrar no corpo" },
      { c: "Bola no topo do quique", ref: "Entre a rede e o peito", err: "Contato tardio, bola caindo" },
      { c: "Raquete levemente fechada", ref: "~50–60° com a mesa", err: "Face aberta — bola sem controle" },
      { c: "Punho firme, sem chicote", ref: "Leve avanço natural apenas", err: "Punho solto, direção aleatória" },
    ]},
    { f: "F4", label: "Finalização", items: [
      { c: "Raquete aponta ao alvo, altura do peito", ref: "Movimento curto e compacto", err: "Raquete passou do ombro — exagerado" },
      { c: "Base preservada, pronto para o próximo golpe", ref: "Pés no lugar, joelhos flexionados", err: "Perdeu o equilíbrio" },
    ]},
  ]},
  { id: "loop", name: "Topspin de FH vs Backspin", frames: [
    { f: "F1", label: "Posição de espera", items: [
      { c: "Pés bem mais afastados que no drive", ref: "Base larga e estável", err: "Base estreita — sem espaço para o arco" },
      { c: "Joelhos ~110°, sensação de 'sentar'", ref: "Mais baixo que no drive", err: "Postura alta" },
    ]},
    { f: "F2", label: "Fim da preparação", items: [
      { c: "Raquete desceu até a altura do joelho direito", ref: "Ponta apontando para baixo", err: "Raquete parou na cintura — sem arco" },
      { c: "Ombro direito visivelmente mais baixo que o esquerdo", ref: "Tronco inclinado para a direita", err: "Ombros nivelados" },
      { c: "Peso ~70% na perna direita", ref: "Joelho direito bem carregado", err: "Peso distribuído — sem impulso" },
      { c: "Braço relaxado, quase estendido", ref: "Sem tensão no ombro", err: "Braço rígido e dobrado" },
    ]},
    { f: "F3", label: "Contato", items: [
      { c: "Contato no topo do quique ou início da descida", ref: "Nunca na subida da bola", err: "Contato na subida — bola voa" },
      { c: "Raquete aberta 70–80°, quase vertical", ref: "Mais aberta que no drive", err: "Raquete fechada — bola na rede" },
      { c: "Contato fino na traseira/superior da bola", ref: "Terço superior da borracha", err: "Contato cheio (socou a bola)" },
      { c: "Joelhos começando a estender", ref: "Impulso do chão visível", err: "Pernas paradas — só braço" },
    ]},
    { f: "F4", label: "Finalização", items: [
      { c: "Raquete acima da cabeça, perto da testa esquerda", ref: "Arco vertical completo", err: "Terminou na altura do ombro" },
      { c: "Peso totalmente na perna esquerda", ref: "Quadril de frente para a rede", err: "Peso atrás — não transferiu" },
      { c: "Recuperação já iniciada", ref: "Raquete voltando ao centro", err: "Parado admirando a bola" },
    ]},
  ]},
  { id: "serve", name: "Saque Pendular", frames: [
    { f: "F1", label: "Preparação", items: [
      { c: "Tronco baixo, olhos quase na altura da bola", ref: "Joelhos bem flexionados", err: "Em pé — não vê o ponto de contato" },
      { c: "Palma aberta e plana, mão imóvel", ref: "Dedos juntos, bola parada", err: "Dedos em concha (falta)" },
      { c: "Bola atrás da linha de fundo", ref: "Acima do nível da mesa", err: "Bola sobre a mesa (falta)" },
    ]},
    { f: "F2", label: "Lançamento", items: [
      { c: "Lançamento de no mínimo 16 cm, quase vertical", ref: "Cerca de um palmo e meio", err: "Lançamento baixo ou para frente (falta)" },
      { c: "Braço livre saindo do caminho", ref: "Bola totalmente visível", err: "Braço escondendo a bola (falta)" },
      { c: "Punho carregado para trás", ref: "Pronto para chicotear", err: "Punho travado — saque sem efeito" },
    ]},
    { f: "F3", label: "Contato", items: [
      { c: "Bola baixa, perto do nível da mesa", ref: "Contato na descida do arco", err: "Contato alto — saque sobe" },
      { c: "Ponto de contato correto na bola", ref: "6 h backspin · 3 h lateral · 9 h no-spin", err: "Contato cheio no centro" },
      { c: "Punho liberando no contato", ref: "Aceleração visível da mão", err: "Movimento só de braço" },
      { c: "Empunhadura frouxa (mão relaxada)", ref: "Pressão 2/10", err: "Mão apertada — mata o efeito" },
    ]},
    { f: "F4", label: "Finalização", items: [
      { c: "Raquete cruzou o corpo à frente do quadril esquerdo", ref: "Arco completo", err: "Movimento interrompido no contato" },
      { c: "Finalização idêntica entre efeitos diferentes", ref: "Compare dois prints lado a lado", err: "Finalização muda e entrega o efeito" },
    ]},
  ]},
];

const PROMPT_TEXT = "Analise minha execucao de [NOME DO GOLPE]. Sou iniciante em transicao da empunhadura caneta para a classica (shakehand). Envio 4 frames de um slow motion, camera lateral: F1 posicao de espera, F2 fim da preparacao, F3 contato com a bola, F4 finalizacao. Use a rubrica do meu app: avalie cada item de 0 a 2, calcule a nota final de 0 a 10, aponte o erro mais grave e me diga o ajuste especifico e um exercicio no robo iPong V300 para corrigir.";


export { CAPTURE, FRAMES_GUIDE, RUBRICS, PROMPT_TEXT };
