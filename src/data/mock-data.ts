import type { Artifact } from '@/types/artifact'

/**
 * The 12 mock artifacts from the Figma board. Each entry always sets
 * `audioUrl`/`pdfUrl` to either a path or `null` (never omitted) so consuming
 * UI can rely on a consistent shape when deciding whether to render the
 * audio/PDF controls, instead of needing an `in` check.
 */
export const mockArtifacts: Artifact[] = [
  {
    id: 'wooden-chest',
    title: 'Wooden Chest',
    type: 'Useable',
    thumbnail: '/images/artifacts/wooden-chest/thumbnail.jpg',
    media: ['/images/artifacts/wooden-chest/1.jpg'],
    description:
      "This hand-carved wooden chest was used to store a family's most valuable possessions — linens, documents, and dowry gifts — before being passed down as an heirloom. Its dovetail joinery and brass fittings reflect a tradition of furniture-making practiced across generations of Filipino woodworkers.",
    contributor: {
      name: 'Corazon Reyes',
      quote:
        'My grandmother packed this chest with everything she owned when she left Manila. It weighed more than she did.',
      story:
        "Corazon's family carried the chest through three moves — Manila to Cebu, and finally to San Francisco in 1986 — before donating it to the museum so its story could reach more people than just her own children.",
    },
    audioUrl: '/audio/wooden-chest.mp3',
    audioDurationSeconds: 96,
    pdfUrl: '/documents/wooden-chest-provenance.pdf',
    journey: [
      { country: 'Philippines', flag: 'PH' },
      { country: 'United States', flag: 'US' },
    ],
  },
  {
    id: 'vyshyvanka',
    title: 'Vyshyvanka',
    type: 'Wearable',
    thumbnail: '/images/artifacts/vyshyvanka/thumbnail.jpg',
    media: ['/images/artifacts/vyshyvanka/1.jpg'],
    description:
      "A vyshyvanka is a traditional Ukrainian shirt embroidered with symbolic patterns unique to the wearer's home region — a stitched signature of identity, protection, and belonging.",
    contributor: {
      name: 'Olena Kovalenko',
      quote:
        "Every stitch was sewn by my mother's hand. Wearing it feels like she is still holding me.",
      story:
        'Olena packed this shirt in a single suitcase when she fled Kyiv in 2022. It has since been worn at every family celebration held in her new home in Warsaw.',
    },
    audioUrl: '/audio/vyshyvanka.mp3',
    audioDurationSeconds: 108,
    pdfUrl: null,
    journey: [
      { country: 'Ukraine', flag: 'UA' },
      { country: 'Poland', flag: 'PL' },
    ],
  },
  {
    id: 'carnival-mask',
    title: 'Carnival Mask',
    type: 'Ceremonial',
    thumbnail: '/images/artifacts/carnival-mask/thumbnail.jpg',
    media: ['/images/artifacts/carnival-mask/1.jpg', '/images/artifacts/carnival-mask/2.jpg'],
    description:
      "Carved from light balsa wood and finished with hand-painted lacquer, this mask was worn during Rio de Janeiro's Carnival street processions, its exaggerated features designed to be seen from a distance in a crowd of thousands.",
    contributor: {
      name: 'Thiago Alves',
      quote:
        "You put on the mask and for one night you are not you — you are everyone's grandfather, everyone's fool, everyone's king.",
      story:
        "Thiago's family has built masks for the same samba school in Rio for three generations; this one traveled with him when he moved to Lisbon to study.",
    },
    audioUrl: null,
    pdfUrl: null,
    journey: [
      { country: 'Brazil', flag: 'BR' },
      { country: 'Portugal', flag: 'PT' },
    ],
  },
  {
    id: 'beaded-gown',
    title: 'Beaded Gown',
    type: 'Wearable',
    thumbnail: '/images/artifacts/beaded-gown/thumbnail.jpg',
    media: ['/images/artifacts/beaded-gown/1.jpg', '/images/artifacts/beaded-gown/2.jpg'],
    description:
      'This beaded ceremonial gown was made using thousands of hand-strung glass beads arranged in geometric patterns associated with Yoruba royal regalia, traditionally worn at coming-of-age and wedding ceremonies.',
    contributor: {
      name: 'Adaeze Okafor',
      quote:
        'Each color in this dress tells you something — who my family is, where we come from, what we hope for the person wearing it.',
      story:
        'Adaeze wore the gown at her own wedding in Lagos before her daughter wore it again at a wedding in London twenty years later.',
    },
    audioUrl: null,
    pdfUrl: null,
    journey: [
      { country: 'Nigeria', flag: 'NG' },
      { country: 'United Kingdom', flag: 'GB' },
    ],
  },
  {
    id: 'mshatta-facade',
    title: 'Mshatta Façade',
    type: 'Architectural',
    thumbnail: '/images/artifacts/mshatta-facade/thumbnail.jpg',
    media: ['/images/artifacts/mshatta-facade/1.jpg', '/images/artifacts/mshatta-facade/2.jpg'],
    description:
      "The Mshatta Facade is a richly decorated stone wall from an 8th-century Umayyad desert castle in Jordan, carved with vine scrolls, rosettes, and paired animals drinking from a shared fountain. Sections of the original facade were gifted to Kaiser Wilhelm II in 1903 and now reside in Berlin's Pergamon Museum.",
    contributor: {
      name: 'Mansoor Alemy',
      quote:
        'These scenes of creatures drinking water from one fountain together; for me, it shows peace.',
      story:
        'Mansoor first saw a cast of the facade on a school trip to Amman, decades before he ever stood in front of the original panels in Berlin — two cities, one carving, one lesson about peace.',
    },
    audioUrl: '/audio/mshatta-facade.mp3',
    audioDurationSeconds: 180,
    pdfUrl: '/documents/mshatta-facade-curatorial-notes.pdf',
    journey: [
      { country: 'Jordan', flag: 'JO' },
      { country: 'Germany', flag: 'DE' },
    ],
  },
  {
    id: 'lei-poo',
    title: "Lei Po'o",
    type: 'Wearable',
    thumbnail: '/images/artifacts/lei-poo/thumbnail.jpg',
    media: ['/images/artifacts/lei-poo/1.jpg', '/images/artifacts/lei-poo/2.jpg'],
    description:
      "A lei po'o is a Hawaiian head lei woven from fresh flowers and maile leaves, worn at graduations, weddings, and hula performances as a mark of honor and aloha.",
    contributor: {
      name: 'Kealoha Kahananui',
      quote:
        "When you wear a lei po'o, you're wearing the mountain and the ocean at the same time.",
      story:
        "Kealoha's family traces its lei-making practice back to ancestors who voyaged from Tahiti; this piece was woven for her granddaughter's high school graduation in Honolulu.",
    },
    audioUrl: null,
    pdfUrl: null,
    journey: [
      { country: 'French Polynesia', flag: 'PF' },
      { country: 'United States', flag: 'US' },
    ],
  },
  {
    id: 'tatreez-thobe',
    title: 'Tatreez Thobe',
    type: 'Wearable',
    thumbnail: '/images/artifacts/tatreez-thobe/thumbnail.jpg',
    media: ['/images/artifacts/tatreez-thobe/1.jpg', '/images/artifacts/tatreez-thobe/2.jpg'],
    description:
      "This thobe is embroidered with tatreez, a centuries-old Palestinian cross-stitch tradition in which the color and pattern of the embroidery once identified a woman's home village.",
    contributor: {
      name: 'Rania Haddad',
      quote:
        "My grandmother could look at a dress and tell you which village a woman was from just by the stitches. That knowledge doesn't have a country anymore, so we keep it in the thread.",
      story:
        "Rania's family carried the thobe from Jerusalem to a refugee camp in Amman, and later to Chicago, stitching a few new rows into the hem at each stop.",
    },
    audioUrl: null,
    pdfUrl: null,
    journey: [
      { country: 'Palestine', flag: 'PS' },
      { country: 'Jordan', flag: 'JO' },
      { country: 'United States', flag: 'US' },
    ],
  },
  {
    id: 'mbira',
    title: 'Mbira',
    type: 'Musical',
    thumbnail: '/images/artifacts/mbira/thumbnail.jpg',
    media: ['/images/artifacts/mbira/1.jpg'],
    description:
      'The mbira dzavadzimu is a Zimbabwean thumb piano made of metal keys mounted on a hardwood soundboard, traditionally played at all-night ceremonies to summon ancestral spirits.',
    contributor: {
      name: 'Tendai Moyo',
      quote:
        "This instrument doesn't belong to one player. It belongs to everyone who has ever needed to talk to their ancestors.",
      story:
        'Tendai learned to build and play mbira from his grandfather in Harare and now teaches the tradition to diaspora communities in Johannesburg and London.',
    },
    audioUrl: '/audio/mbira.mp3',
    audioDurationSeconds: 145,
    pdfUrl: null,
    journey: [
      { country: 'Zimbabwe', flag: 'ZW' },
      { country: 'South Africa', flag: 'ZA' },
      { country: 'United Kingdom', flag: 'GB' },
    ],
  },
  {
    id: 'minbar',
    title: 'Minbar',
    type: 'Architectural',
    thumbnail: '/images/artifacts/minbar/thumbnail.jpg',
    media: ['/images/artifacts/minbar/1.jpg', '/images/artifacts/minbar/2.jpg'],
    description:
      'A minbar is the raised pulpit from which an imam delivers the Friday sermon; this example was hand-carved from cedar and inlaid with geometric marquetry in the tradition of Andalusian woodworking workshops.',
    contributor: {
      name: 'Yusuf El-Amin',
      quote:
        'A minbar is built once and used for centuries. Every splinter of wood in it has heard more prayers than any person alive.',
      story:
        'Carved in a Fez workshop descended from craftsmen exiled from Córdoba, this minbar design was later reproduced for a mosque built by Moroccan migrants in Madrid.',
    },
    audioUrl: null,
    pdfUrl: '/documents/minbar-provenance.pdf',
    journey: [
      { country: 'Morocco', flag: 'MA' },
      { country: 'Spain', flag: 'ES' },
    ],
  },
  {
    id: 'bamboo-pen',
    title: 'Bamboo Pen',
    type: 'Useable',
    thumbnail: '/images/artifacts/bamboo-pen/thumbnail.jpg',
    media: ['/images/artifacts/bamboo-pen/1.jpg'],
    description:
      'Carved from a single piece of bamboo, this calligraphy pen was used to write traditional Vietnamese chữ Nôm script, its nib hand-cut and reshaped by its owner as it wore down over years of use.',
    contributor: {
      name: 'Nguyễn Văn Thành',
      quote:
        'A good pen is sharpened a thousand times before it is thrown away. My grandfather said patience is carved the same way.',
      story:
        "This pen accompanied Thành's grandfather from a village near Huế to a refugee resettlement camp in France, and finally to a calligraphy school he founded in Paris.",
    },
    audioUrl: null,
    pdfUrl: null,
    journey: [
      { country: 'Vietnam', flag: 'VN' },
      { country: 'France', flag: 'FR' },
    ],
  },
  {
    id: 'backgammon-board',
    title: 'Backgammon Board',
    type: 'Playful',
    thumbnail: '/images/artifacts/backgammon-board/thumbnail.jpg',
    media: ['/images/artifacts/backgammon-board/1.jpg', '/images/artifacts/backgammon-board/2.jpg'],
    description:
      'This backgammon board — known as tavla in Turkish and takhteh in Persian — is inlaid with mother-of-pearl and bone, a game passed down through generations of tea-house players across the Middle East.',
    contributor: {
      name: 'Darius Farahani',
      quote:
        "In the tea houses of Tehran, this board was where old men argued, made peace, and told the same stories they'd already told a hundred times.",
      story:
        "Darius's father carried this board out of Tehran in 1979 and it became the centerpiece of every family gathering the family held afterward in Berlin.",
    },
    audioUrl: '/audio/backgammon-board.mp3',
    audioDurationSeconds: 110,
    pdfUrl: null,
    journey: [
      { country: 'Iran', flag: 'IR' },
      { country: 'Germany', flag: 'DE' },
    ],
  },
  {
    id: 'jamdani',
    title: 'Jamdani',
    type: 'Decorative',
    thumbnail: '/images/artifacts/jamdani/thumbnail.jpg',
    media: ['/images/artifacts/jamdani/1.jpg'],
    description:
      'Jamdani is a fine, hand-loomed muslin textile from Bangladesh, woven with intricate discontinuous-weft patterns so delicate that a single sari can take months to complete.',
    contributor: {
      name: 'Farzana Begum',
      quote:
        'You can hold an entire jamdani sari in one closed fist, but it takes a weaver a season of her life to make it.',
      story:
        "Farzana's mother wove this piece in Narayanganj before Farzana brought it to Toronto, where she now teaches the weaving technique to a new generation of Bangladeshi-Canadian women.",
    },
    audioUrl: null,
    pdfUrl: '/documents/jamdani-weaving-guide.pdf',
    journey: [
      { country: 'Bangladesh', flag: 'BD' },
      { country: 'Canada', flag: 'CA' },
    ],
  },
]
