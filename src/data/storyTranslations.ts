// Spanish translations for story content
// Structure: mysteryId -> field translations

export interface MysteryTranslation {
  title: string;
  tagline?: string;
  description: string;
  wordFamily: string; // Spanish word family equivalent
  words: string[];
  story: { id: number; text: string; clue?: string }[];
  scenes?: {
    id: number;
    title?: string;
    headerText?: string;
    dialogue: { speaker: string; text: string; emotion?: string }[];
    interactiveTarget?: { description: string; hint: string };
  }[];
}

export const spanishTranslations: Record<string, MysteryTranslation> = {
  'missing-cake': {
    title: 'El Caso de la Receta Perdida',
    tagline: '¡Ayuda a Jake la Serpiente a encontrar su receta de pastel!',
    description: '¡Jake la Serpiente necesita hornear un pastel para la fiesta del pueblo, pero su receta especial ha desaparecido! Ayuda a resolver el misterio.',
    wordFamily: '-ake',
    words: ['cake', 'bake', 'lake', 'make', 'take', 'wake', 'Jake', 'rake', 'shake', 'flake'],
    story: [
      { id: 1, text: 'Jake la Serpiente necesita hornear un pastel para la fiesta del pueblo.', clue: '¡Encuentra palabras que terminen en -ake!' },
      { id: 2, text: '¡Pero Jake no puede encontrar su receta especial!', clue: '¡Oh no! ¡La receta ha desaparecido!' },
      { id: 3, text: 'Pancake la Gata la vio caer junto al lago.', clue: '¿A dónde fue la receta?' },
      { id: 4, text: '¡La receta se deslizó debajo del tapete por error!', clue: '¡La encontraste!' },
      { id: 5, text: '¡Ahora Jake puede hornear su pastel para la fiesta!', clue: '¡Hurra! ¡Misterio resuelto!' },
      { id: 6, text: '¡Gran trabajo, Detective! ¡Ayudaste a Jake la Serpiente!', clue: '¡Es hora de practicar tus palabras con -AKE!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Escena 1',
        dialogue: [
          { speaker: 'Jake the Snake', text: '¡Oh No! Necesito hornear un pastel para la fiesta del pueblo.', emotion: 'worried' },
          { speaker: 'narrator', text: 'Pero Jake no puede encontrar su receta especial.' },
          { speaker: 'detective', text: '¡Yo te ayudaré!', emotion: 'excited' }
        ]
      },
      {
        id: 2,
        title: 'Escena 2',
        dialogue: [
          { speaker: 'Jake the Snake', text: 'La puse junto al lago esta mañana. ¿La habré recogido?', emotion: 'thinking' },
          { speaker: 'narrator', text: 'Jake intenta recordar dónde dejó la receta.' },
          { speaker: 'detective', text: '¡Preguntémosle a Pancake!', emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Escena 3',
        dialogue: [
          { speaker: 'Pancake the Cat', text: '¡La vi caer! Jake intentó preparar la masa y se le resbaló.', emotion: 'surprised' },
          { speaker: 'narrator', text: 'Pancake señala hacia la puerta con su patita.' },
          { speaker: 'detective', text: '¡Sigue la pista!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Escena 4',
        headerText: '¿Puedes encontrar la receta perdida? Haz clic en la receta para ayudar a Jake la Serpiente.',
        dialogue: [
          { speaker: 'detective', text: '¡Ahí está! La receta se deslizó debajo del tapete por error.', emotion: 'happy' },
          { speaker: 'narrator', text: 'El detective le devuelve la receta a Jake.' }
        ],
        interactiveTarget: {
          description: 'Papel de receta debajo del tapete',
          hint: '¡Mira cerca de la puerta!'
        }
      },
      {
        id: 5,
        title: 'Escena 5',
        dialogue: [
          { speaker: 'Jake the Snake', text: '¡La encontraste! ¡Ahora puedo hornear mi pastel!', emotion: 'happy' },
          { speaker: 'narrator', text: '¡Jake está muy feliz! Hará el mejor pastel para la fiesta del pueblo.' },
          { speaker: 'detective', text: '¡Hurra!', emotion: 'excited' }
        ]
      },
      {
        id: 6,
        title: 'Escena 6',
        dialogue: [
          { speaker: 'Pancake the Cat', text: '¡Gran trabajo, Detective!', emotion: 'happy' },
          { speaker: 'narrator', text: '¡Ayudaste a Jake a encontrar su receta! Es hora de practicar tus palabras con -AKE.' }
        ]
      }
    ]
  },

  'lost-hat': {
    title: 'El Caso del Sombrero Perdido',
    tagline: '¡Ayuda a Bella Conejita a encontrar su sombrero favorito!',
    description: '¡El sombrero favorito de Bella voló! Encuentra palabras que terminen en "-at" para ayudar.',
    wordFamily: '-at',
    words: ['hat', 'cat', 'bat', 'mat', 'sat', 'rat', 'flat', 'that', 'chat', 'pat'],
    story: [
      { id: 1, text: 'Bella se sentó en su tapete con su gato.', clue: '¿Dónde estaba sentada Bella?' },
      { id: 2, text: '¡Un murciélago voló y se llevó su sombrero!', clue: '¿Qué se llevó el sombrero?' },
      { id: 3, text: 'El gato corrió detrás del murciélago.', clue: '¿Quién persiguió al murciélago?' },
      { id: 4, text: '¡Encontraron el sombrero en una roca plana!', clue: '¡Hurra! ¡El sombrero fue encontrado!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Escena 1',
        dialogue: [
          { speaker: 'narrator', text: 'Era un día soleado en la Calle de la Cabaña Acogedora.' },
          { speaker: 'Bella Bunny', text: '¡Qué lindo día! Me encanta sentarme en mi tapete con mi amigo Matt el Gato.', emotion: 'happy' },
          { speaker: 'Matt the Cat', text: '¡Qué agradable! Podría sentarme aquí y charlar todo el día.', emotion: 'happy' }
        ]
      },
      {
        id: 2,
        title: 'Escena 2',
        dialogue: [
          { speaker: 'narrator', text: '¡De repente, una ráfaga de viento sopló por el jardín!' },
          { speaker: 'Batty the Bat', text: '¡Wiiii! ¡Mira este sombrero tan bonito! ¡Me lo llevaré!', emotion: 'excited' },
          { speaker: 'Bella Bunny', text: '¡Oh no! ¡Ese murciélago se llevó mi sombrero!', emotion: 'worried' },
          { speaker: 'detective', text: '¡Necesitamos recuperarlo!', emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Escena 3',
        dialogue: [
          { speaker: 'Matt the Cat', text: '¡Yo correré detrás de ese murciélago! ¡Espérenme!', emotion: 'excited' },
          { speaker: 'narrator', text: 'Matt el Gato corrió tan rápido como pudo por el prado.' },
          { speaker: 'detective', text: '¡Vamos, Matt! ¡Puedes atrapar a ese murciélago!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Escena 4',
        headerText: '¿Puedes encontrar el sombrero? ¡Haz clic en él para ayudar a Bella!',
        dialogue: [
          { speaker: 'Matt the Cat', text: '¡Mira! ¡El sombrero está en esa roca plana!', emotion: 'happy' },
          { speaker: 'detective', text: '¡Lo veo! El sombrero estaba en la roca plana junto al arroyo.', emotion: 'happy' },
          { speaker: 'narrator', text: 'El detective recoge el sombrero con cuidado.' }
        ],
        interactiveTarget: {
          description: 'Sombrero rosa en la roca plana',
          hint: '¡Mira en la roca plana!'
        }
      },
      {
        id: 5,
        title: 'Escena 5',
        dialogue: [
          { speaker: 'Bella Bunny', text: '¡Mi sombrero! ¡Lo encontraste! ¡Muchas gracias!', emotion: 'happy' },
          { speaker: 'Batty the Bat', text: 'Lo siento por llevarme tu sombrero. ¡Solo quería jugar!', emotion: 'sad' },
          { speaker: 'Bella Bunny', text: '¡Está bien, Batty! ¿Quieres sentarte y charlar con nosotros?', emotion: 'happy' },
          { speaker: 'Matt the Cat', text: '¡Sí! ¡Seamos todos amigos!', emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Escena 6',
        dialogue: [
          { speaker: 'narrator', text: 'Todos se sentaron juntos en el tapete y pasaron un tiempo maravilloso.' },
          { speaker: 'Bella Bunny', text: '¡Gran trabajo, Detective! ¡Nos ayudaste a encontrar mi sombrero!', emotion: 'happy' },
          { speaker: 'narrator', text: '¡Es hora de practicar tus palabras con -AT!' }
        ]
      }
    ]
  },

  'garden-mystery': {
    title: 'El Caso del Excavador del Jardín',
    tagline: '¡Ayuda a Oliver Búho a resolver el misterio del gran hoyo!',
    description: '¿Quién cavó hoyos en el jardín? Encuentra palabras que terminen en "-ig" para descubrir la verdad.',
    wordFamily: '-ig',
    words: ['dig', 'big', 'pig', 'wig', 'fig', 'jig', 'twig', 'gig'],
    story: [
      { id: 1, text: 'Oliver vio un gran hoyo en el jardín.', clue: '¿Qué tan grande era el hoyo?' },
      { id: 2, text: '¿Alguien lo cavó?', clue: '¿Qué pasó para hacer el hoyo?' },
      { id: 3, text: '¡Un cerdito estaba bailando cerca!', clue: '¿Quién estaba bailando?' },
      { id: 4, text: '¡El cerdito buscaba un higo para comer!', clue: '¡Misterio resuelto!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Escena 1',
        dialogue: [
          { speaker: 'narrator', text: 'Era una mañana hermosa en el Jardín del Prado Soleado.' },
          { speaker: 'Oliver Owl', text: '¡Dios mío! ¿Qué es esto? ¡Hay un gran hoyo en el jardín!', emotion: 'surprised' },
          { speaker: 'detective', text: '¿Quién pudo haber hecho un hoyo tan grande?', emotion: 'thinking' }
        ]
      },
      {
        id: 2,
        title: 'Escena 2',
        dialogue: [
          { speaker: 'narrator', text: 'Oliver Búho escuchó un sonido detrás de las flores.' },
          { speaker: 'Oliver Owl', text: '¿Qué es ese ruido? ¡Alguien está bailando!', emotion: 'surprised' },
          { speaker: 'detective', text: '¡Vamos a ver quién es!', emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Escena 3',
        dialogue: [
          { speaker: 'Piggy the Pig', text: '¡Cavar, cavar, cavar! ¡Me encanta cavar! ¿Dónde está mi higo?', emotion: 'happy' },
          { speaker: 'Oliver Owl', text: '¡Piggy! ¿Tú cavaste este gran hoyo?', emotion: 'surprised' },
          { speaker: 'Piggy the Pig', text: '¡Sí! Estoy buscando un higo. ¡Lo enterré aquí!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Escena 4',
        headerText: '¿Puedes ayudar a Piggy a encontrar el higo? ¡Haz clic en él!',
        dialogue: [
          { speaker: 'detective', text: '¡Veo algo! ¿Es ese el higo junto a la ramita?', emotion: 'excited' },
          { speaker: 'Piggy the Pig', text: '¡Sí! ¡Ese es mi higo! ¡Lo encontraste!', emotion: 'happy' },
          { speaker: 'narrator', text: 'El detective ayuda a Piggy a encontrar el higo enterrado.' }
        ],
        interactiveTarget: {
          description: 'Higo cerca de la ramita',
          hint: '¡Mira cerca de la ramita!'
        }
      },
      {
        id: 5,
        title: 'Escena 5',
        dialogue: [
          { speaker: 'Piggy the Pig', text: '¡Gracias! ¡Ahora puedo comer mi gran y delicioso higo!', emotion: 'happy' },
          { speaker: 'Oliver Owl', text: '¡Piggy, la próxima vez pregunta antes de cavar en el jardín!', emotion: 'happy' },
          { speaker: 'Piggy the Pig', text: '¡Lo haré! Perdón por el gran desorden.', emotion: 'sad' }
        ]
      },
      {
        id: 6,
        title: 'Escena 6',
        dialogue: [
          { speaker: 'narrator', text: 'Piggy bailó felizmente y todos se rieron juntos.' },
          { speaker: 'Oliver Owl', text: '¡Gran trabajo, Detective! ¡Resolviste el misterio del gran hoyo!', emotion: 'happy' },
          { speaker: 'narrator', text: '¡Es hora de practicar tus palabras con -IG!' }
        ]
      }
    ]
  },

  'sleepy-town': {
    title: 'El Caso del Pueblo Dormilón',
    tagline: '¡Ayuda a Misty Gata a despertar al pueblo dormilón!',
    description: '¡Todos están bostezando! Encuentra palabras que terminen en "-eep" para despertarlos.',
    wordFamily: '-eep',
    words: ['sleep', 'deep', 'keep', 'peep', 'sheep', 'beep', 'creep', 'steep'],
    story: [
      { id: 1, text: 'Todo el pueblo cayó en un sueño profundo.', clue: '¿Cómo dormían todos?' },
      { id: 2, text: '¡Hasta las ovejas estaban contando ovejas!', clue: '¿Quién más estaba durmiendo?' },
      { id: 3, text: 'Misty escuchó un pequeño pío de un pájaro.', clue: '¿Qué sonido hizo el pájaro?' },
      { id: 4, text: '¡Un fuerte bip despertó a todos!', clue: '¿Qué sonido salvó el día?' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Escena 1',
        dialogue: [
          { speaker: 'narrator', text: 'Algo extraño estaba pasando en el Pueblo Enredado.' },
          { speaker: 'Misty Cat', text: '¿Por qué están todos dormidos? ¡Todo el pueblo cayó en un sueño profundo!', emotion: 'worried' },
          { speaker: 'detective', text: 'Esto es muy extraño. ¡Necesitamos descubrir por qué!', emotion: 'thinking' }
        ]
      },
      {
        id: 2,
        title: 'Escena 2',
        dialogue: [
          { speaker: 'narrator', text: 'Hasta las ovejas estaban profundamente dormidas en el prado.' },
          { speaker: 'Sheepy the Sheep', text: 'Zzzzz... una oveja... dos ovejas... tres ovejas...', emotion: 'happy' },
          { speaker: 'Misty Cat', text: '¡Las ovejas están contando ovejas! ¡Por eso todos están dormidos!', emotion: 'surprised' }
        ]
      },
      {
        id: 3,
        title: 'Escena 3',
        dialogue: [
          { speaker: 'narrator', text: 'Misty Gata escuchó un sonido pequeñito.' },
          { speaker: 'Misty Cat', text: '¿Qué fue eso? ¡Escuché un pequeño pío!', emotion: 'surprised' },
          { speaker: 'detective', text: '¡Vino de ese pajarito! ¡Quizás nos pueda ayudar!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Escena 4',
        headerText: '¿Puedes encontrar algo que haga un fuerte bip? ¡Haz clic en él!',
        dialogue: [
          { speaker: 'detective', text: '¡Necesitamos algo fuerte para despertar a todos!', emotion: 'thinking' },
          { speaker: 'Misty Cat', text: '¡Mira! ¡Un despertador! ¡Puede hacer un fuerte bip!', emotion: 'excited' },
          { speaker: 'narrator', text: 'El detective presiona el botón de la alarma.' }
        ],
        interactiveTarget: {
          description: 'Despertador',
          hint: '¡Encuentra el despertador!'
        }
      },
      {
        id: 5,
        title: 'Escena 5',
        dialogue: [
          { speaker: 'narrator', text: '¡BIP! ¡BIP! ¡BIP! ¡La alarma sonó fuerte y clara!' },
          { speaker: 'Sheepy the Sheep', text: '¡Oh! ¡Estoy despierta! ¡Qué sueño tan profundo fue ese!', emotion: 'surprised' },
          { speaker: 'Misty Cat', text: '¡Todos se están despertando! ¡El bip funcionó!', emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Escena 6',
        dialogue: [
          { speaker: 'narrator', text: 'Todo el pueblo se despertó de su sueño profundo.' },
          { speaker: 'Sheepy the Sheep', text: '¡De ahora en adelante contaré para mí misma!', emotion: 'happy' },
          { speaker: 'Misty Cat', text: '¡Gran trabajo, Detective! ¡Salvaste al Pueblo Dormilón!', emotion: 'happy' },
          { speaker: 'narrator', text: '¡Es hora de practicar tus palabras con -EEP!' }
        ]
      }
    ]
  },

  'rainy-day': {
    title: 'La Pista del Día Lluvioso',
    description: '¡Algo salpicó en la lluvia! Encuentra palabras que terminen en "-ain" para investigar.',
    wordFamily: '-ain',
    words: ['rain', 'train', 'main', 'plain', 'brain', 'drain'],
    story: [
      { id: 1, text: 'La lluvia cayó en la calle principal.', clue: '¿Dónde cayó la lluvia?' },
      { id: 2, text: 'Benny usó su cerebro para pensar.', clue: '¿Qué usó Benny para pensar?' },
      { id: 3, text: '¡Escuchó un tren en la lluvia!', clue: '¿Qué estaba haciendo ruido?' },
      { id: 4, text: 'El agua se fue por el desagüe. ¡Misterio resuelto!', clue: '¡Gran trabajo de detective!' }
    ]
  },

  'sunny-park': {
    title: 'El Parque Soleado',
    description: '¿Quién dejó huellas en el parque? Encuentra palabras que terminen en "-un" para descubrirlo.',
    wordFamily: '-un',
    words: ['sun', 'run', 'fun', 'bun', 'pun', 'spun'],
    story: [
      { id: 1, text: 'El sol brillaba con fuerza.', clue: '¿Qué había en el cielo?' },
      { id: 2, text: '¡Alguien se divirtió en el parque!', clue: '¿Qué hicieron?' },
      { id: 3, text: '¡Corrieron y corrieron por todos lados!', clue: '¿Qué hicieron?' },
      { id: 4, text: '¡Se les cayó un panecillo de su picnic!', clue: '¡Caso cerrado!' }
    ]
  },

  'bell-tower': {
    title: 'La Torre de la Campana',
    description: '¡La campana dejó de sonar! Encuentra palabras que terminen en "-ell" para arreglarla.',
    wordFamily: '-ell',
    words: ['bell', 'tell', 'well', 'sell', 'fell', 'spell'],
    story: [
      { id: 1, text: 'La campana de la torre no quería sonar.', clue: '¿Qué dejó de funcionar?' },
      { id: 2, text: 'Mabel podía notar que algo estaba mal.', clue: '¿Qué podía hacer Mabel?' },

      { id: 3, text: 'Miró dentro del pozo buscando pistas.', clue: '¿Dónde miró?' },
      { id: 4, text: '¡Un hechizo mágico arregló la campana!', clue: '¡Din don! ¡Éxito!' }
    ]
  },

  'hop-shop': {
    title: 'La Tienda de Saltos',
    description: '¡Las cosas están saltando en la tienda! Encuentra palabras que terminen en "-op" para ayudar.',
    wordFamily: '-op',
    words: ['hop', 'shop', 'stop', 'top', 'pop', 'mop'],
    story: [
      { id: 1, text: 'Bella fue a la tienda.', clue: '¿A dónde fue Bella?' },
      { id: 2, text: '¡Tuvo que saltar sobre un trapeador!', clue: '¿Sobre qué saltó?' },
      { id: 3, text: '¡Un globo hizo pop en lo alto!', clue: '¿Qué sonido hizo?' },
      { id: 4, text: '¡Hora de parar y descansar!', clue: '¡Compras terminadas!' }
    ]
  },

  'night-light': {
    title: 'La Luz Nocturna',
    description: '¡Las luces se apagaron! Encuentra palabras que terminen en "-ight" para traerlas de vuelta.',
    wordFamily: '-ight',
    words: ['night', 'light', 'right', 'bright', 'sight', 'flight'],
    story: [
      { id: 1, text: 'Era una noche oscura en el pueblo.', clue: '¿Qué hora era?' },
      { id: 2, text: 'Oliver necesitaba encontrar la luz.', clue: '¿Qué buscaba Oliver?' },
      { id: 3, text: '¡Miró a la derecha y vio una estrella brillante!', clue: '¿Qué vio?' },
      { id: 4, text: '¡La estrella emprendió vuelo e iluminó todo!', clue: '¡Trabajo brillante!' }
    ]
  },

  'snowy-day': {
    title: 'El Día Nevado',
    description: '¡Está nevando! Encuentra palabras que terminen en "-ow" para jugar en la nieve.',
    wordFamily: '-ow',
    words: ['snow', 'blow', 'grow', 'show', 'glow', 'flow'],
    story: [
      { id: 1, text: 'La nieve comenzó a caer.', clue: '¿Qué estaba cayendo?' },
      { id: 2, text: 'El viento comenzó a soplar.', clue: '¿Qué hizo el viento?' },
      { id: 3, text: 'Misty vio los copos de nieve brillar.', clue: '¿Qué hicieron los copos de nieve?' },
      { id: 4, text: '¡Hora de mostrar a todos la nieve!', clue: '¡Diversión en la nieve!' }
    ]
  },

  'king-ring': {
    title: 'El Anillo del Rey',
    description: '¡El rey perdió su anillo! Encuentra palabras que terminen en "-ing" para ayudar.',
    wordFamily: '-ing',
    words: ['king', 'ring', 'sing', 'wing', 'bring', 'swing'],
    story: [
      { id: 1, text: 'El rey perdió su anillo especial.', clue: '¿Qué perdió el rey?' },
      { id: 2, text: 'Un pájaro con un ala voló cerca.', clue: '¿Quién pasó volando?' },
      { id: 3, text: '¡El pájaro comenzó a cantar una canción!', clue: '¿Qué hizo el pájaro?' },
      { id: 4, text: '¡Quería traer de vuelta el anillo!', clue: '¡Misterio real resuelto!' }
    ]
  },

  'duck-luck': {
    title: 'El Pato con Suerte',
    description: '¡El pato necesita suerte! Encuentra palabras que terminen en "-uck" para ayudar.',
    wordFamily: '-uck',
    words: ['duck', 'luck', 'truck', 'stuck', 'pluck', 'cluck'],
    story: [
      { id: 1, text: 'Un patito estaba atascado en el lodo.', clue: '¿Qué le pasó al pato?' },
      { id: 2, text: '¡Un gran camión vino a ayudar!', clue: '¿Qué vino a ayudar?' },
      { id: 3, text: 'Con un poco de suerte y un tirón...', clue: '¿Qué necesitaban?' },
      { id: 4, text: '¡El pato estaba libre! ¡Clo clo!', clue: '¡Final feliz!' }
    ]
  }
};

// Helper function to get translated mystery data
export function getTranslatedMystery(mysteryId: string): MysteryTranslation | undefined {
  return spanishTranslations[mysteryId];
}
