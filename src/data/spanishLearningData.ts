// Spanish Learning Data for bilingual readers
// Focused on vocabulary (nouns) and verbs instead of English word families
// Designed for English speakers learning Spanish

export interface SpanishVocabWord {
  spanish: string;
  english: string;
  type: 'noun' | 'adjective' | 'adverb';
  article?: string; // el, la, los, las
  example?: string; // example sentence in Spanish
}

export interface VerbConjugation {
  yo: string;
  tu: string;       // tú
  el: string;       // él/ella
}

export interface SpanishVerb {
  infinitive: string; // hornear
  english: string; // to bake
  conjugation?: string; // hornea (he/she bakes) - legacy single form
  conjugations: VerbConjugation; // full conjugation table
  example?: string; // Jake necesita hornear un pastel.
}

export interface SpanishLearningSet {
  vocabulario: SpanishVocabWord[];
  verbos: SpanishVerb[];
  // Combined list of all Spanish words for games
  allWords: string[];
  // Distractor words (wrong answers for games)
  distractorWords: string[];
}

// Distractor conjugations for the conjugation game
// These are real Spanish conjugations but for WRONG verbs
export const distractorConjugations: Record<string, VerbConjugation> = {
  'correr': { yo: 'corro', tu: 'corres', el: 'corre' },
  'comer': { yo: 'como', tu: 'comes', el: 'come' },
  'vivir': { yo: 'vivo', tu: 'vives', el: 'vive' },
  'hablar': { yo: 'hablo', tu: 'hablas', el: 'habla' },
  'escribir': { yo: 'escribo', tu: 'escribes', el: 'escribe' },
  'leer': { yo: 'leo', tu: 'lees', el: 'lee' },
  'abrir': { yo: 'abro', tu: 'abres', el: 'abre' },
  'beber': { yo: 'bebo', tu: 'bebes', el: 'bebe' },
  'nadar': { yo: 'nado', tu: 'nadas', el: 'nada' },
  'caminar': { yo: 'camino', tu: 'caminas', el: 'camina' },
  'pintar': { yo: 'pinto', tu: 'pintas', el: 'pinta' },
  'cocinar': { yo: 'cocino', tu: 'cocinas', el: 'cocina' },
};

export const spanishLearningData: Record<string, SpanishLearningSet> = {
  'missing-cake': {
    vocabulario: [
      { spanish: 'pastel', english: 'cake', type: 'noun', article: 'el', example: 'Jake necesita hacer un pastel.' },
      { spanish: 'receta', english: 'recipe', type: 'noun', article: 'la', example: '¡La receta ha desaparecido!' },
      { spanish: 'fiesta', english: 'party', type: 'noun', article: 'la', example: 'La fiesta del pueblo es hoy.' },
      { spanish: 'pueblo', english: 'town', type: 'noun', article: 'el', example: 'Todo el pueblo está invitado.' },
      { spanish: 'lago', english: 'lake', type: 'noun', article: 'el', example: 'La receta cayó junto al lago.' },
      { spanish: 'tapete', english: 'mat/rug', type: 'noun', article: 'el', example: 'Estaba debajo del tapete.' },
    ],
    verbos: [
      { infinitive: 'hornear', english: 'to bake', conjugation: 'hornea', conjugations: { yo: 'horneo', tu: 'horneas', el: 'hornea' }, example: 'Jake necesita hornear un pastel.' },
      { infinitive: 'buscar', english: 'to search/look for', conjugation: 'busca', conjugations: { yo: 'busco', tu: 'buscas', el: 'busca' }, example: 'Jake busca su receta.' },
      { infinitive: 'encontrar', english: 'to find', conjugation: 'encuentra', conjugations: { yo: 'encuentro', tu: 'encuentras', el: 'encuentra' }, example: '¡El detective encuentra la receta!' },
      { infinitive: 'perder', english: 'to lose', conjugation: 'pierde', conjugations: { yo: 'pierdo', tu: 'pierdes', el: 'pierde' }, example: 'Jake pierde su receta especial.' },
      { infinitive: 'ayudar', english: 'to help', conjugation: 'ayuda', conjugations: { yo: 'ayudo', tu: 'ayudas', el: 'ayuda' }, example: 'El detective ayuda a Jake.' },
      { infinitive: 'resolver', english: 'to solve', conjugation: 'resuelve', conjugations: { yo: 'resuelvo', tu: 'resuelves', el: 'resuelve' }, example: '¡Resolvemos el misterio!' },
    ],
    allWords: ['pastel', 'receta', 'fiesta', 'pueblo', 'lago', 'tapete', 'hornear', 'buscar', 'encontrar', 'perder', 'ayudar', 'resolver'],
    distractorWords: ['gato', 'perro', 'casa', 'libro', 'correr', 'dormir', 'cantar', 'bailar'],
  },

  'lost-hat': {
    vocabulario: [
      { spanish: 'sombrero', english: 'hat', type: 'noun', article: 'el', example: '¡El sombrero de Bella voló!' },
      { spanish: 'gato', english: 'cat', type: 'noun', article: 'el', example: 'Matt el Gato es su amigo.' },
      { spanish: 'murciélago', english: 'bat', type: 'noun', article: 'el', example: 'Un murciélago se llevó el sombrero.' },
      { spanish: 'tapete', english: 'mat', type: 'noun', article: 'el', example: 'Bella se sentó en su tapete.' },
      { spanish: 'roca', english: 'rock', type: 'noun', article: 'la', example: 'El sombrero estaba en la roca.' },
      { spanish: 'amigos', english: 'friends', type: 'noun', article: 'los', example: '¡Todos son amigos ahora!' },
    ],
    verbos: [
      { infinitive: 'sentarse', english: 'to sit down', conjugation: 'se sienta', conjugations: { yo: 'me siento', tu: 'te sientas', el: 'se sienta' }, example: 'Bella se sienta en su tapete.' },
      { infinitive: 'volar', english: 'to fly', conjugation: 'vuela', conjugations: { yo: 'vuelo', tu: 'vuelas', el: 'vuela' }, example: 'El murciélago vuela con el sombrero.' },
      { infinitive: 'correr', english: 'to run', conjugation: 'corre', conjugations: { yo: 'corro', tu: 'corres', el: 'corre' }, example: 'Matt corre detrás del murciélago.' },
      { infinitive: 'llevar', english: 'to take/carry', conjugation: 'lleva', conjugations: { yo: 'llevo', tu: 'llevas', el: 'lleva' }, example: 'Batty se lleva el sombrero.' },
      { infinitive: 'charlar', english: 'to chat', conjugation: 'charla', conjugations: { yo: 'charlo', tu: 'charlas', el: 'charla' }, example: 'Todos charlan juntos en el tapete.' },
      { infinitive: 'jugar', english: 'to play', conjugation: 'juega', conjugations: { yo: 'juego', tu: 'juegas', el: 'juega' }, example: 'Batty solo quería jugar.' },
    ],
    allWords: ['sombrero', 'gato', 'murciélago', 'tapete', 'roca', 'amigos', 'sentarse', 'volar', 'correr', 'llevar', 'charlar', 'jugar'],
    distractorWords: ['pastel', 'lago', 'fiesta', 'pueblo', 'hornear', 'buscar', 'resolver', 'perder'],
  },

  'garden-mystery': {
    vocabulario: [
      { spanish: 'jardín', english: 'garden', type: 'noun', article: 'el', example: '¡Hay un hoyo en el jardín!' },
      { spanish: 'hoyo', english: 'hole', type: 'noun', article: 'el', example: 'Oliver vio un gran hoyo.' },
      { spanish: 'cerdo', english: 'pig', type: 'noun', article: 'el', example: 'El cerdito estaba bailando.' },
      { spanish: 'higo', english: 'fig', type: 'noun', article: 'el', example: 'Piggy buscaba un higo.' },
      { spanish: 'ramita', english: 'twig', type: 'noun', article: 'la', example: 'El higo estaba junto a la ramita.' },
      { spanish: 'flores', english: 'flowers', type: 'noun', article: 'las', example: 'Escuchó un sonido detrás de las flores.' },
    ],
    verbos: [
      { infinitive: 'cavar', english: 'to dig', conjugation: 'cava', conjugations: { yo: 'cavo', tu: 'cavas', el: 'cava' }, example: '¡A Piggy le encanta cavar!' },
      { infinitive: 'bailar', english: 'to dance', conjugation: 'baila', conjugations: { yo: 'bailo', tu: 'bailas', el: 'baila' }, example: 'Piggy baila felizmente.' },
      { infinitive: 'escuchar', english: 'to listen/hear', conjugation: 'escucha', conjugations: { yo: 'escucho', tu: 'escuchas', el: 'escucha' }, example: 'Oliver escucha un sonido.' },
      { infinitive: 'enterrar', english: 'to bury', conjugation: 'entierra', conjugations: { yo: 'entierro', tu: 'entierras', el: 'entierra' }, example: 'Piggy enterró su higo aquí.' },
      { infinitive: 'preguntar', english: 'to ask', conjugation: 'pregunta', conjugations: { yo: 'pregunto', tu: 'preguntas', el: 'pregunta' }, example: '¡La próxima vez pregunta primero!' },
      { infinitive: 'reír', english: 'to laugh', conjugation: 'ríe', conjugations: { yo: 'río', tu: 'ríes', el: 'ríe' }, example: 'Todos se ríen juntos.' },
    ],
    allWords: ['jardín', 'hoyo', 'cerdo', 'higo', 'ramita', 'flores', 'cavar', 'bailar', 'escuchar', 'enterrar', 'preguntar', 'reír'],
    distractorWords: ['sombrero', 'pastel', 'lago', 'receta', 'volar', 'hornear', 'correr', 'sentarse'],
  },

  'sleepy-town': {
    vocabulario: [
      { spanish: 'pueblo', english: 'town', type: 'noun', article: 'el', example: 'Todo el pueblo está dormido.' },
      { spanish: 'sueño', english: 'sleep/dream', type: 'noun', article: 'el', example: 'Cayeron en un sueño profundo.' },
      { spanish: 'oveja', english: 'sheep', type: 'noun', article: 'la', example: 'Las ovejas están dormidas.' },
      { spanish: 'pájaro', english: 'bird', type: 'noun', article: 'el', example: 'Un pájaro hizo un pequeño pío.' },
      { spanish: 'despertador', english: 'alarm clock', type: 'noun', article: 'el', example: '¡El despertador hace bip!' },
      { spanish: 'prado', english: 'meadow', type: 'noun', article: 'el', example: 'Las ovejas duermen en el prado.' },
    ],
    verbos: [
      { infinitive: 'dormir', english: 'to sleep', conjugation: 'duerme', conjugations: { yo: 'duermo', tu: 'duermes', el: 'duerme' }, example: 'Todo el pueblo duerme.' },
      { infinitive: 'despertar', english: 'to wake up', conjugation: 'despierta', conjugations: { yo: 'despierto', tu: 'despiertas', el: 'despierta' }, example: '¡El bip despierta a todos!' },
      { infinitive: 'contar', english: 'to count', conjugation: 'cuenta', conjugations: { yo: 'cuento', tu: 'cuentas', el: 'cuenta' }, example: 'Las ovejas cuentan ovejas.' },
      { infinitive: 'escuchar', english: 'to listen/hear', conjugation: 'escucha', conjugations: { yo: 'escucho', tu: 'escuchas', el: 'escucha' }, example: 'Misty escucha un pequeño pío.' },
      { infinitive: 'salvar', english: 'to save', conjugation: 'salva', conjugations: { yo: 'salvo', tu: 'salvas', el: 'salva' }, example: '¡El detective salva al pueblo!' },
      { infinitive: 'sonar', english: 'to ring/sound', conjugation: 'suena', conjugations: { yo: 'sueno', tu: 'suenas', el: 'suena' }, example: 'La alarma suena fuerte.' },
    ],
    allWords: ['pueblo', 'sueño', 'oveja', 'pájaro', 'despertador', 'prado', 'dormir', 'despertar', 'contar', 'escuchar', 'salvar', 'sonar'],
    distractorWords: ['jardín', 'pastel', 'sombrero', 'higo', 'cavar', 'hornear', 'volar', 'bailar'],
  },

  'rainy-day': {
    vocabulario: [
      { spanish: 'lluvia', english: 'rain', type: 'noun', article: 'la', example: 'La lluvia cae en la calle.' },
      { spanish: 'tren', english: 'train', type: 'noun', article: 'el', example: '¡Escuchó un tren!' },
      { spanish: 'calle', english: 'street', type: 'noun', article: 'la', example: 'La calle principal está mojada.' },
      { spanish: 'cerebro', english: 'brain', type: 'noun', article: 'el', example: 'Benny usó su cerebro.' },
      { spanish: 'desagüe', english: 'drain', type: 'noun', article: 'el', example: 'El agua se fue por el desagüe.' },
    ],
    verbos: [
      { infinitive: 'llover', english: 'to rain', conjugation: 'llueve', conjugations: { yo: 'lluevo', tu: 'llueves', el: 'llueve' }, example: 'Llueve en la calle principal.' },
      { infinitive: 'pensar', english: 'to think', conjugation: 'piensa', conjugations: { yo: 'pienso', tu: 'piensas', el: 'piensa' }, example: 'Benny piensa con su cerebro.' },
      { infinitive: 'caer', english: 'to fall', conjugation: 'cae', conjugations: { yo: 'caigo', tu: 'caes', el: 'cae' }, example: 'La lluvia cae del cielo.' },
      { infinitive: 'investigar', english: 'to investigate', conjugation: 'investiga', conjugations: { yo: 'investigo', tu: 'investigas', el: 'investiga' }, example: 'El detective investiga el ruido.' },
    ],
    allWords: ['lluvia', 'tren', 'calle', 'cerebro', 'desagüe', 'llover', 'pensar', 'caer', 'investigar'],
    distractorWords: ['pastel', 'sombrero', 'jardín', 'oveja', 'hornear', 'volar', 'cavar', 'dormir'],
  },

  'sunny-park': {
    vocabulario: [
      { spanish: 'sol', english: 'sun', type: 'noun', article: 'el', example: 'El sol brilla con fuerza.' },
      { spanish: 'parque', english: 'park', type: 'noun', article: 'el', example: 'Están en el parque.' },
      { spanish: 'panecillo', english: 'bun/roll', type: 'noun', article: 'el', example: 'Se les cayó un panecillo.' },
      { spanish: 'huellas', english: 'footprints', type: 'noun', article: 'las', example: '¿Quién dejó huellas?' },
      { spanish: 'picnic', english: 'picnic', type: 'noun', article: 'el', example: 'Tuvieron un picnic en el parque.' },
    ],
    verbos: [
      { infinitive: 'brillar', english: 'to shine', conjugation: 'brilla', conjugations: { yo: 'brillo', tu: 'brillas', el: 'brilla' }, example: 'El sol brilla con fuerza.' },
      { infinitive: 'correr', english: 'to run', conjugation: 'corre', conjugations: { yo: 'corro', tu: 'corres', el: 'corre' }, example: '¡Corrieron por todos lados!' },
      { infinitive: 'divertirse', english: 'to have fun', conjugation: 'se divierte', conjugations: { yo: 'me divierto', tu: 'te diviertes', el: 'se divierte' }, example: '¡Alguien se divirtió en el parque!' },
      { infinitive: 'dejar', english: 'to leave', conjugation: 'deja', conjugations: { yo: 'dejo', tu: 'dejas', el: 'deja' }, example: '¿Quién dejó las huellas?' },
    ],
    allWords: ['sol', 'parque', 'panecillo', 'huellas', 'picnic', 'brillar', 'correr', 'divertirse', 'dejar'],
    distractorWords: ['lluvia', 'tren', 'sombrero', 'pastel', 'dormir', 'cavar', 'volar', 'hornear'],
  },

  'bell-tower': {
    vocabulario: [
      { spanish: 'campana', english: 'bell', type: 'noun', article: 'la', example: 'La campana no quiere sonar.' },
      { spanish: 'torre', english: 'tower', type: 'noun', article: 'la', example: 'La torre tiene una campana.' },
      { spanish: 'pozo', english: 'well', type: 'noun', article: 'el', example: 'Miró dentro del pozo.' },
      { spanish: 'hechizo', english: 'spell', type: 'noun', article: 'el', example: '¡Un hechizo mágico lo arregló!' },
      { spanish: 'pista', english: 'clue', type: 'noun', article: 'la', example: 'Buscó pistas en el pozo.' },
    ],
    verbos: [
      { infinitive: 'sonar', english: 'to ring/sound', conjugation: 'suena', conjugations: { yo: 'sueno', tu: 'suenas', el: 'suena' }, example: 'La campana no suena.' },
      { infinitive: 'arreglar', english: 'to fix', conjugation: 'arregla', conjugations: { yo: 'arreglo', tu: 'arreglas', el: 'arregla' }, example: 'El hechizo arregla la campana.' },
      { infinitive: 'mirar', english: 'to look', conjugation: 'mira', conjugations: { yo: 'miro', tu: 'miras', el: 'mira' }, example: 'Mabel mira dentro del pozo.' },
      { infinitive: 'notar', english: 'to notice', conjugation: 'nota', conjugations: { yo: 'noto', tu: 'notas', el: 'nota' }, example: 'Mabel nota que algo está mal.' },

    ],
    allWords: ['campana', 'torre', 'pozo', 'hechizo', 'pista', 'sonar', 'arreglar', 'mirar', 'notar'],
    distractorWords: ['sol', 'parque', 'lluvia', 'jardín', 'correr', 'dormir', 'bailar', 'hornear'],
  },

  'hop-shop': {
    vocabulario: [
      { spanish: 'tienda', english: 'shop/store', type: 'noun', article: 'la', example: 'Bella fue a la tienda.' },
      { spanish: 'trapeador', english: 'mop', type: 'noun', article: 'el', example: 'Saltó sobre el trapeador.' },
      { spanish: 'globo', english: 'balloon', type: 'noun', article: 'el', example: '¡El globo hizo pop!' },
      { spanish: 'salto', english: 'jump/hop', type: 'noun', article: 'el', example: 'Dio un gran salto.' },
    ],
    verbos: [
      { infinitive: 'saltar', english: 'to jump/hop', conjugation: 'salta', conjugations: { yo: 'salto', tu: 'saltas', el: 'salta' }, example: 'Bella salta sobre el trapeador.' },
      { infinitive: 'parar', english: 'to stop', conjugation: 'para', conjugations: { yo: 'paro', tu: 'paras', el: 'para' }, example: '¡Hora de parar y descansar!' },
      { infinitive: 'comprar', english: 'to buy/shop', conjugation: 'compra', conjugations: { yo: 'compro', tu: 'compras', el: 'compra' }, example: 'Bella compra en la tienda.' },
      { infinitive: 'descansar', english: 'to rest', conjugation: 'descansa', conjugations: { yo: 'descanso', tu: 'descansas', el: 'descansa' }, example: 'Es hora de descansar.' },
    ],
    allWords: ['tienda', 'trapeador', 'globo', 'salto', 'saltar', 'parar', 'comprar', 'descansar'],
    distractorWords: ['campana', 'torre', 'sol', 'lluvia', 'sonar', 'mirar', 'correr', 'dormir'],
  },

  'night-light': {
    vocabulario: [
      { spanish: 'noche', english: 'night', type: 'noun', article: 'la', example: 'Era una noche oscura.' },
      { spanish: 'luz', english: 'light', type: 'noun', article: 'la', example: 'Oliver busca la luz.' },
      { spanish: 'estrella', english: 'star', type: 'noun', article: 'la', example: '¡Vio una estrella brillante!' },
      { spanish: 'vuelo', english: 'flight', type: 'noun', article: 'el', example: 'La estrella emprendió vuelo.' },
      { spanish: 'oscuridad', english: 'darkness', type: 'noun', article: 'la', example: 'La oscuridad cubrió el pueblo.' },
    ],
    verbos: [
      { infinitive: 'brillar', english: 'to shine', conjugation: 'brilla', conjugations: { yo: 'brillo', tu: 'brillas', el: 'brilla' }, example: 'La estrella brilla con fuerza.' },
      { infinitive: 'iluminar', english: 'to light up', conjugation: 'ilumina', conjugations: { yo: 'ilumino', tu: 'iluminas', el: 'ilumina' }, example: 'La estrella ilumina todo.' },
      { infinitive: 'buscar', english: 'to search', conjugation: 'busca', conjugations: { yo: 'busco', tu: 'buscas', el: 'busca' }, example: 'Oliver busca la luz.' },
      { infinitive: 'volar', english: 'to fly', conjugation: 'vuela', conjugations: { yo: 'vuelo', tu: 'vuelas', el: 'vuela' }, example: 'La estrella vuela por el cielo.' },
    ],
    allWords: ['noche', 'luz', 'estrella', 'vuelo', 'oscuridad', 'brillar', 'iluminar', 'buscar', 'volar'],
    distractorWords: ['tienda', 'globo', 'campana', 'jardín', 'saltar', 'parar', 'cavar', 'dormir'],
  },

  'snowy-day': {
    vocabulario: [
      { spanish: 'nieve', english: 'snow', type: 'noun', article: 'la', example: 'La nieve comenzó a caer.' },
      { spanish: 'viento', english: 'wind', type: 'noun', article: 'el', example: 'El viento sopla fuerte.' },
      { spanish: 'copos', english: 'snowflakes', type: 'noun', article: 'los', example: 'Los copos de nieve brillan.' },
      { spanish: 'invierno', english: 'winter', type: 'noun', article: 'el', example: 'Es un día de invierno.' },
    ],
    verbos: [
      { infinitive: 'nevar', english: 'to snow', conjugation: 'nieva', conjugations: { yo: 'nievo', tu: 'nievas', el: 'nieva' }, example: '¡Está nevando!' },
      { infinitive: 'soplar', english: 'to blow', conjugation: 'sopla', conjugations: { yo: 'soplo', tu: 'soplas', el: 'sopla' }, example: 'El viento sopla fuerte.' },
      { infinitive: 'caer', english: 'to fall', conjugation: 'cae', conjugations: { yo: 'caigo', tu: 'caes', el: 'cae' }, example: 'La nieve cae del cielo.' },
      { infinitive: 'mostrar', english: 'to show', conjugation: 'muestra', conjugations: { yo: 'muestro', tu: 'muestras', el: 'muestra' }, example: '¡Hora de mostrar la nieve!' },
    ],
    allWords: ['nieve', 'viento', 'copos', 'invierno', 'nevar', 'soplar', 'caer', 'mostrar'],
    distractorWords: ['noche', 'estrella', 'sol', 'lluvia', 'brillar', 'buscar', 'saltar', 'hornear'],
  },

  'king-ring': {
    vocabulario: [
      { spanish: 'rey', english: 'king', type: 'noun', article: 'el', example: 'El rey perdió su anillo.' },
      { spanish: 'anillo', english: 'ring', type: 'noun', article: 'el', example: 'El anillo es muy especial.' },
      { spanish: 'pájaro', english: 'bird', type: 'noun', article: 'el', example: 'Un pájaro voló cerca.' },
      { spanish: 'ala', english: 'wing', type: 'noun', article: 'el', example: 'El pájaro tiene un ala grande.' },
      { spanish: 'canción', english: 'song', type: 'noun', article: 'la', example: 'El pájaro cantó una canción.' },
    ],
    verbos: [
      { infinitive: 'perder', english: 'to lose', conjugation: 'pierde', conjugations: { yo: 'pierdo', tu: 'pierdes', el: 'pierde' }, example: 'El rey pierde su anillo.' },
      { infinitive: 'cantar', english: 'to sing', conjugation: 'canta', conjugations: { yo: 'canto', tu: 'cantas', el: 'canta' }, example: 'El pájaro canta una canción.' },
      { infinitive: 'traer', english: 'to bring', conjugation: 'trae', conjugations: { yo: 'traigo', tu: 'traes', el: 'trae' }, example: '¡Quiere traer el anillo de vuelta!' },
      { infinitive: 'volar', english: 'to fly', conjugation: 'vuela', conjugations: { yo: 'vuelo', tu: 'vuelas', el: 'vuela' }, example: 'El pájaro vuela por el cielo.' },
    ],
    allWords: ['rey', 'anillo', 'pájaro', 'ala', 'canción', 'perder', 'cantar', 'traer', 'volar'],
    distractorWords: ['nieve', 'viento', 'tienda', 'campana', 'nevar', 'soplar', 'saltar', 'dormir'],
  },

  'duck-luck': {
    vocabulario: [
      { spanish: 'pato', english: 'duck', type: 'noun', article: 'el', example: 'El patito está atascado.' },
      { spanish: 'lodo', english: 'mud', type: 'noun', article: 'el', example: 'El pato está en el lodo.' },
      { spanish: 'camión', english: 'truck', type: 'noun', article: 'el', example: 'Un gran camión vino a ayudar.' },
      { spanish: 'suerte', english: 'luck', type: 'noun', article: 'la', example: 'Con un poco de suerte...' },
    ],
    verbos: [
      { infinitive: 'atascar', english: 'to get stuck', conjugation: 'se atasca', conjugations: { yo: 'me atasco', tu: 'te atascas', el: 'se atasca' }, example: 'El pato se atasca en el lodo.' },
      { infinitive: 'ayudar', english: 'to help', conjugation: 'ayuda', conjugations: { yo: 'ayudo', tu: 'ayudas', el: 'ayuda' }, example: 'El camión ayuda al pato.' },
      { infinitive: 'tirar', english: 'to pull', conjugation: 'tira', conjugations: { yo: 'tiro', tu: 'tiras', el: 'tira' }, example: 'Tiran del pato para sacarlo.' },
      { infinitive: 'liberar', english: 'to free', conjugation: 'libera', conjugations: { yo: 'libero', tu: 'liberas', el: 'libera' }, example: '¡El pato está libre!' },
    ],
    allWords: ['pato', 'lodo', 'camión', 'suerte', 'atascar', 'ayudar', 'tirar', 'liberar'],
    distractorWords: ['rey', 'anillo', 'nieve', 'jardín', 'cantar', 'volar', 'cavar', 'hornear'],
  },
};

// Helper to get learning data for a mystery
export function getSpanishLearningData(mysteryId: string): SpanishLearningSet | undefined {
  return spanishLearningData[mysteryId];
}
