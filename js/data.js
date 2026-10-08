/*
 * BOHEMIA — content & residence data.
 *
 * Everything that changes over time lives here: the residences, their areas,
 * images and plans, and all EN / PT copy. Adding a residence = adding an object
 * to `units`. There is no sale status on the site: when a residence is sold,
 * remove it from `units` (and update the headline `line.all.2` by hand).
 *
 * Areas are derived from the architect's area schedules (Fracção A / B,
 * private gross area) and must be confirmed before publication.
 */
window.BOHEMIA = {
  // Enquiry form → Web3Forms (https://web3forms.com).
  // Paste the access key they email you. While empty, the form only shows the
  // thank-you message and sends nothing.
  enquiry: {
    web3formsKey: '18368bf5-0671-402f-b941-bb96b95b06c1',
    subject: 'New enquiry — Bohemia'
  },

  // Temporary (user, 2026-10-08): phones see a "please ask" screen instead of the site.
  // Set mobileBlocked: false to open phones for everyone. Opening any page once with
  // ?mobile=open unlocks that phone (remembered in its browser).
  access: { mobileBlocked: true, unlock: 'open' },

  // Direct contact (shown in the enquiry section and footer)
  contact: {
    email: 'sales@bohemiangroup.com',
    whatsapp: '351964759237',          // international format, digits only (Portugal +351)
    whatsappDisplay: '+351 964 759 237'
  },

  units: [
    {
      id: 'garden',
      fraction: 'A',
      numeral: 'I',
      typology: { pt: 'T3' },
      name: { en: 'The Garden Residence', pt: 'Residência Jardim' },
      level: { en: 'Ground floor', pt: 'Rés-do-chão' },
      levels: [0],
      bedrooms: 3,
      interior: 172,
      exterior: 198,
      parking: 3,
      // e.g. price: { en: '€4,500,000', pt: '4 500 000 €' } — null shows "Price on request"
      price: null,
      outdoor: [
        { k: 'terrace', v: 64 },
        { k: 'garden', v: 103 },
        { k: 'pool', v: 30 }
      ],
      tagline: {
        en: 'Single-level living, opening onto a private garden and pool.',
        pt: 'Viver num só piso, aberto a um jardim e piscina privativos.'
      },
      intro: {
        en: 'Set at the foot of the building, The Garden Residence unfolds on a single level. Three suites, a living room that opens entirely to the terrace, and a garden and pool of its own — the ease of a house, in a building of only two homes.',
        pt: 'Na base do edifício, a Residência Jardim desenvolve-se num único piso. Três suites, uma sala que se abre por inteiro ao terraço, um jardim e uma piscina próprios — a simplicidade de uma casa, num edifício de apenas duas residências.'
      },
      highlight: {
        en: 'Every bedroom a suite. Every room on one level.',
        pt: 'Todos os quartos em suite. Tudo num só piso.'
      },
      cover: 'ext-front',
      hero: 'garden-pool',
      outdoorLabel: 'ov.out.garden',
      planPdf: { file: 'assets/plans/pdf/bohemia-garden-residence-floor-plans.pdf', size: '0.9 MB' },
      gallery: ['living-a', 'dining-1', 'kitchen-2', 'bed-1', 'bath-master', 'garden-pool'],
      // Building hotspot on assets/img/ext-front.webp, in % of image size
      band: [[26.5, 53.6], [72.8, 53.6], [72.8, 73], [88, 76], [79, 89], [1, 89], [1, 77], [26.5, 73]],
      plans: [
        {
          key: 'a-l0', ratio: 2400 / 1873,
          label: { en: 'Ground floor', pt: 'Rés-do-chão' },
          rooms: [
            { n: 'living', a: 36.94, x: 57.3, y: 38, img: 'living-a' },
            { n: 'kitchen', a: 15.69, x: 61.6, y: 59.6, img: 'kitchen-2' },
            { n: 'entrance', a: 4.8, x: 34.7, y: 39.8 },
            { n: 'hall', a: 10.08, x: 31.7, y: 49 },
            { n: 'guestwc', a: 3.0, x: 47.2, y: 27.3 },
            { n: 'suite1', a: 13.65, x: 17.6, y: 33.5, img: 'bed-1' },
            { n: 'bath1', a: 7.66, x: 7.6, y: 29.8, img: 'bath-master' },
            { n: 'suite2', a: 12.65, x: 25.3, y: 62, img: 'bed-2' },
            { n: 'bath2', a: 5.78, x: 15.2, y: 62.5 },
            { n: 'suite3', a: 15.74, x: 40.5, y: 62.8, img: 'bed-3' },
            { n: 'bath3', a: 8.13, x: 52.5, y: 62 },
            { n: 'laundry', a: 9.51, x: 9.4, y: 50 },
            { n: 'terrace', a: 64.39, x: 67, y: 13, img: 'ext-front' },
            { n: 'pool', a: 30.46, x: 85.5, y: 50, img: 'garden-pool' },
            { n: 'garden', a: 102.75, x: 30, y: 83, img: 'garden-pool' }
          ]
        }
      ]
    },
    {
      id: 'penthouse',
      fraction: 'B',
      numeral: 'II',
      typology: { pt: 'T4 duplex' },
      name: { en: 'The Penthouse Residence', pt: 'Residência Penthouse' },
      level: { en: 'First & second floors', pt: '1.º e 2.º pisos' },
      levels: [1, 2],
      bedrooms: 4,
      interior: 267,
      exterior: 250,
      parking: 3,
      price: null,
      outdoor: [
        { k: 'balcony', v: 43 },
        { k: 'roofterrace', v: 184 },
        { k: 'pool', v: 23 }
      ],
      tagline: {
        en: 'Two floors, with living spaces raised to the light and a private terrace and pool above the trees.',
        pt: 'Dois pisos, com as zonas de estar elevadas à luz e um terraço e piscina privativos acima das árvores.'
      },
      intro: {
        en: 'The Penthouse Residence occupies the two upper floors. Four suites — among them a master suite with its own dressing room — are gathered on the first. Above, the living room and kitchen open onto a terrace of almost 185 m², with a pool of its own among the treetops.',
        pt: 'A Residência Penthouse ocupa os dois pisos superiores. Quatro suites — entre elas uma suite principal com closet próprio — reúnem-se no primeiro piso. Acima, a sala e a cozinha abrem-se para um terraço de quase 185 m², com piscina própria entre as copas das árvores.'
      },
      highlight: {
        en: 'Living above, sleeping below. The terrace is the main room.',
        pt: 'Viver em cima, descansar em baixo. O terraço é a sala principal.'
      },
      cover: 'ext-angle',
      hero: 'ext-angle-4k',
      outdoorLabel: 'ov.out.terraces',
      planPdf: { file: 'assets/plans/pdf/bohemia-penthouse-residence-floor-plans.pdf', size: '1.2 MB' },
      gallery: ['living-b', 'dining-2', 'kitchen-1', 'bed-3', 'bath-guest', 'bed-2'],
      band: [[26.4, 9], [76.8, 9], [76.8, 26.2], [87.2, 26.2], [87.2, 53.6], [14.8, 53.6], [14.8, 26.2], [26.4, 26.2]],
      plans: [
        {
          key: 'b-l1', ratio: 2400 / 1852,
          label: { en: 'First floor · Suites', pt: '1.º piso · Suites' },
          rooms: [
            { n: 'master', a: 15.53, x: 55.9, y: 50.3, img: 'bed-3' },
            { n: 'masterbath', a: 10.71, x: 52, y: 35.5, img: 'bath-master' },
            { n: 'dressing', a: 8.26, x: 43.1, y: 40.5 },
            { n: 'suite1', a: 13.65, x: 16.1, y: 40.3, img: 'bed-2' },
            { n: 'bath1', a: 7.8, x: 7.1, y: 33 },
            { n: 'suite2', a: 12.71, x: 23, y: 65.4, img: 'bed-1' },
            { n: 'bath2', a: 5.84, x: 13.5, y: 63.1 },
            { n: 'suite3', a: 22.87, x: 55.8, y: 63.5, img: 'bed-3' },
            { n: 'bath3', a: 6.96, x: 39.3, y: 64.9, img: 'bath-guest' },
            { n: 'hall', a: 23.26, x: 32.2, y: 53.6 },
            { n: 'laundry', a: 9.51, x: 9.4, y: 57.2 },
            { n: 'balcony', a: 43.34, x: 66, y: 76, img: 'ext-front' }
          ]
        },
        {
          key: 'b-l2', ratio: 2400 / 1398,
          label: { en: 'Second floor · Living', pt: '2.º piso · Zona social' },
          rooms: [
            { n: 'living', a: 41.2, x: 77, y: 52, img: 'living-b' },
            { n: 'kitchen', a: 24.63, x: 56.7, y: 50, img: 'kitchen-1' },
            { n: 'entrance', a: 7.61, x: 69.7, y: 44.5 },
            { n: 'roofterrace', a: 183.58, x: 21, y: 62, img: 'ext-angle' },
            { n: 'pool', a: 23.09, x: 39.5, y: 48, img: 'ext-angle-4k' }
          ]
        }
      ]
    }
  ],

  materials: [
    { img: 'travertine', name: { en: 'Travertine', pt: 'Travertino' }, where: { en: 'Façade · 120 × 60 cm slabs, concealed fixings', pt: 'Fachada · placas de 120 × 60 cm, fixação oculta' } },
    { img: 'stone', name: { en: 'Fior di Bosco', pt: 'Fior di Bosco' }, where: { en: 'Entrance halls · honed natural stone', pt: 'Halls de entrada · pedra natural amaciada' } },
    { img: 'slats', name: { en: 'Ribbed panelling', pt: 'Painéis canelados' }, where: { en: 'Halls & joinery · warm timber tone', pt: 'Halls e carpintarias · tom de madeira quente' } },
    { img: 'dekton', name: { en: 'Dekton Pietra', pt: 'Dekton Pietra' }, where: { en: 'Kitchen island & worktops · 20 mm', pt: 'Ilha e bancadas de cozinha · 20 mm' } },
    { img: 'walnut', name: { en: 'Engraved heartwood', pt: 'Cerne de madeira gravado' }, where: { en: 'Kitchen cabinetry · VD Holz in Form, Germany', pt: 'Móveis de cozinha · VD Holz in Form, Alemanha' } },
    { img: 'bath', name: { en: 'Light & water', pt: 'Luz e água' }, where: { en: 'Bathrooms · Laufen & Dornbracht LULU', pt: 'Casas de banho · Laufen e Dornbracht LULU' } }
  ],

  // Specification — from the developer's feature list (2026-10-07). Applies to both residences.
  // Each group: `tag` (shown in the list), `big` + `label` (headline in the card); `b` marks the maker.

  spec: [
    { tag: 'A+', big: 'A+', label: { en: 'Energy rating — the highest', pt: 'Classe energética — a máxima' }, title: { en: 'Climate & efficiency', pt: 'Clima e eficiência' }, items: [
      { en: 'Highest energy-efficiency rating, A+', pt: 'Classe energética máxima, A+' },
      { b: 'Uponor', en: 'underfloor heating', pt: 'Piso radiante {b}' },
      { en: 'VRF/VRV air conditioning, 3-pipe system — heating and cooling different rooms at the same time', pt: 'Ar condicionado VRF/VRV de 3 tubos — aquecimento e arrefecimento simultâneos em divisões diferentes' },
      { en: 'Mechanical ventilation system', pt: 'Sistema de ventilação mecânica' }
    ] },
    { tag: { en: 'Travertine', pt: 'Travertino' }, big: { en: 'Travertine', pt: 'Travertino' }, label: { en: 'Façade in natural stone', pt: 'Fachada em pedra natural' }, title: { en: 'Architecture & finishes', pt: 'Arquitetura e acabamentos' }, items: [
      { en: 'Façade in natural travertine stone', pt: 'Fachada em pedra travertino natural' },
      { b: 'Navarro N27000', en: 'minimalist windows', pt: 'Caixilharia minimalista {b}' },
      { en: 'External shutters on every window · skylights', pt: 'Estores exteriores em todas as janelas · claraboias' },
      { b: 'Havwoods · Comapla', en: 'wood floors', pt: 'Pavimentos em madeira {b}' },
      { b: 'Monalisa', en: 'porcelain tiles, mainly 600 × 1200 mm', pt: 'Revestimento cerâmico {b}, sobretudo 600 × 1200 mm' },
      { en: 'Fireplace in the living room · downlights and LED strip lighting', pt: 'Lareira na sala · iluminação embutida e fitas LED' }
    ] },
    { tag: 'Miele', big: 'Miele', label: { en: 'Kitchen & laundry appliances', pt: 'Eletrodomésticos de cozinha e lavandaria' }, title: { en: 'Kitchen & laundry', pt: 'Cozinha e lavandaria' }, items: [
      { b: 'VD Holz in Form', en: 'cabinetry in engraved heartwood, made in Germany', pt: 'Móveis em cerne de madeira gravado {b}, feitos na Alemanha' },
      { b: 'Dekton', en: 'kitchen island top', pt: 'Tampo da ilha em {b}' },
      { b: 'Miele', en: 'downdraft cooktop, oven & microwave, dishwasher, refrigerator, freezer, wine fridge, vacuum-sealing and plate-warming drawers', pt: 'Eletrodomésticos {b}: placa com extração descendente, forno e micro-ondas, máquina de lavar loiça, frigorífico, congelador, garrafeira, gavetas de vácuo e aquece-pratos' },
      { b: 'Quooker', en: 'tap — boiling, chilled and sparkling drinking water', pt: 'Torneira {b} — água a ferver, fria e com gás' },
      { b: 'Miele', en: 'washer and dryer in the laundry', pt: 'Máquina de lavar e de secar {b} na lavandaria' }
    ] },
    { tag: 'Dornbracht · Laufen', big: 'Dornbracht · Laufen', label: { en: 'Bathroom fittings & sanitaryware', pt: 'Torneiras e louças sanitárias' }, title: { en: 'Bathrooms', pt: 'Casas de banho' }, items: [
      { b: 'Laufen', en: 'WCs, bathtubs and basins', pt: 'Sanitas, banheiras e lavatórios {b}' },
      { b: 'Dornbracht LULU', en: 'taps and showers', pt: 'Torneiras e chuveiros {b}' },
      { b: 'Dornbracht', en: 'hand showers at every WC', pt: 'Chuveiros de higiene {b} em todas as sanitas' }
    ] },
    { tag: { en: 'Heated pool', pt: 'Piscina aquecida' }, big: { en: 'Heated pool', pt: 'Piscina aquecida' }, label: { en: 'With underwater speakers', pt: 'Com colunas subaquáticas' }, title: { en: 'Pool & sound', pt: 'Piscina e som' }, items: [
      { en: 'Heated swimming pool', pt: 'Piscina aquecida' },
      { en: 'Underwater speakers in the pool', pt: 'Colunas subaquáticas na piscina' },
      { b: 'Sonos', en: 'speakers indoors and outdoors', pt: 'Colunas {b} no interior e no exterior' }
    ] },
    { tag: { en: 'Smart home · 22 kW', pt: 'Domótica · 22 kW' }, big: { en: 'Smart home', pt: 'Domótica' }, label: { en: 'Shutters, climate, lighting & entrance · 22 kW EV charging', pt: 'Estores, clima, iluminação e entrada · carregamento elétrico de 22 kW' }, title: { en: 'Technology & building', pt: 'Tecnologia e edifício' }, items: [
      { en: 'Smart-home control of shutters, air conditioning, heating, mood-lighting zones and the entrance door', pt: 'Domótica para estores, ar condicionado, aquecimento, zonas de iluminação ambiente e porta de entrada' },
      { b: 'Thyssenkrupp', en: 'lift', pt: 'Elevador {b}' },
      { en: 'Wired Ethernet throughout', pt: 'Rede Ethernet cablada' },
      { en: '22 kW EV charging point in the garage', pt: 'Posto de carregamento elétrico de 22 kW na garagem' }
    ] }
  ],

  // Captions for the residence-page galleries (keyed by image name)
  captions: {
    'living-a': { en: 'Living room', pt: 'Sala' }, 'living-b': { en: 'Living room', pt: 'Sala' },
    'dining-1': { en: 'Dining', pt: 'Sala de jantar' }, 'dining-2': { en: 'Dining', pt: 'Sala de jantar' },
    'kitchen-1': { en: 'Kitchen', pt: 'Cozinha' }, 'kitchen-2': { en: 'Kitchen', pt: 'Cozinha' },
    'bed-1': { en: 'Suite', pt: 'Suite' }, 'bed-2': { en: 'Suite', pt: 'Suite' }, 'bed-3': { en: 'Suite', pt: 'Suite' },
    'bath-master': { en: 'Master bathroom', pt: 'Casa de banho principal' }, 'bath-guest': { en: 'Bathroom', pt: 'Casa de banho' },
    'garden-pool': { en: 'Private garden & pool', pt: 'Jardim e piscina privativos' }
  },

  // Interiors slideshow. Every statement is taken from the developer's specification list or the
  // architect's finishes presentation — nothing descriptive beyond those sources.
  interiors: [
    { img: 'living-a',
      spots: [
        { x: 72, y: 38, m: 'Navarro N27000', t: { en: 'Minimalist windows', pt: 'Caixilharia minimalista' } },
        { x: 50, y: 8.5, m: 'LED', t: { en: 'Downlights & LED strip lighting', pt: 'Iluminação embutida e fitas LED' } },
        { x: 86, y: 90, m: 'Havwoods · Comapla · Uponor', t: { en: 'Wood floors over underfloor heating', pt: 'Madeira sobre piso radiante' } }
      ],
      room: { en: 'Living room', pt: 'Sala' },
      title: { en: 'Living rooms that open to the outside.', pt: 'Salas que se abrem para o exterior.' },
      sub: { en: 'Minimalist glazing, a fireplace, timber underfoot.', pt: 'Caixilharia minimalista, lareira, madeira no chão.' },
      body: { en: 'Navarro N27000 minimalist windows open the living room to the terrace. A fireplace, Havwoods and Comapla wood floors and Sonos speakers are part of the specification.',
              pt: 'A caixilharia minimalista Navarro N27000 abre a sala ao terraço. Lareira, pavimentos em madeira Havwoods e Comapla e colunas Sonos fazem parte da especificação.' },
      makers: 'Navarro · Havwoods · Sonos' },
    { img: 'kitchen-2',
      spots: [
        { x: 33, y: 31, m: 'VD Holz in Form', t: { en: 'Engraved heartwood cabinetry', pt: 'Móveis em cerne de madeira gravado' } },
        { x: 47.5, y: 49, m: 'Quooker', t: { en: 'Boiling, chilled & sparkling water tap', pt: 'Torneira de água a ferver, fria e com gás' } },
        { x: 72, y: 46, m: 'Miele', t: { en: 'Oven, microwave & full appliance suite', pt: 'Forno, micro-ondas e eletrodomésticos' } },
        { x: 82, y: 57, m: 'Dekton', t: { en: 'Kitchen island top', pt: 'Tampo da ilha' } }
      ],
      room: { en: 'Kitchen', pt: 'Cozinha' },
      title: { en: 'Cabinetry made in Germany.', pt: 'Móveis feitos na Alemanha.' },
      sub: { en: 'Engraved heartwood, Dekton and Miele.', pt: 'Cerne de madeira gravado, Dekton e Miele.' },
      body: { en: 'Kitchen cabinetry in engraved heartwood by VD Holz in Form, an island top in Dekton and a full suite of Miele appliances — downdraft cooktop, oven and microwave, vacuum-sealing drawer and wine fridge among them. A Quooker tap pours boiling, chilled and sparkling water.',
              pt: 'Móveis de cozinha em cerne de madeira gravado da VD Holz in Form, tampo da ilha em Dekton e eletrodomésticos Miele — placa com extração descendente, forno e micro-ondas, gaveta de vácuo e garrafeira, entre outros. Uma torneira Quooker dá água a ferver, fria e com gás.' },
      makers: 'VD Holz in Form · Dekton · Miele · Quooker' },
    { img: 'dining-2',
      spots: [
        { x: 39, y: 23, m: { en: 'Smart home', pt: 'Domótica' }, t: { en: 'Mood-lighting zones', pt: 'Zonas de iluminação ambiente' } },
        { x: 89, y: 40, m: 'Navarro N27000', t: { en: 'Minimalist windows', pt: 'Caixilharia minimalista' } },
        { x: 7, y: 92, m: 'Havwoods · Comapla', t: { en: 'Wood floors', pt: 'Pavimentos em madeira' } }
      ],
      room: { en: 'Dining', pt: 'Sala de jantar' },
      title: { en: 'Light, set for the moment.', pt: 'A luz, ajustada ao momento.' },
      sub: { en: 'Mood-lighting zones on one system.', pt: 'Zonas de iluminação ambiente num só sistema.' },
      body: { en: 'Downlights and LED strip lighting are arranged in mood-lighting zones, controlled by the smart-home system — together with the shutters, heating and air conditioning.',
              pt: 'A iluminação embutida e as fitas LED organizam-se em zonas de ambiente, controladas pela domótica — tal como os estores, o aquecimento e o ar condicionado.' },
      makers: { en: 'Smart-home control', pt: 'Domótica' } },
    { img: 'bed-1',
      spots: [
        { x: 89, y: 30, m: 'Navarro N27000', t: { en: 'Minimalist windows, external shutters', pt: 'Caixilharia minimalista, estores exteriores' } },
        { x: 58, y: 24, m: 'VRF/VRV · 3-pipe', t: { en: 'Heat or cool this room on its own', pt: 'Aquecer ou arrefecer esta divisão à parte' } },
        { x: 86, y: 91, m: 'Uponor', t: { en: 'Underfloor heating', pt: 'Piso radiante' } }
      ],
      room: { en: 'Suite', pt: 'Suite' },
      title: { en: 'Every bedroom a suite.', pt: 'Todos os quartos em suite.' },
      sub: { en: 'Each room with its own climate.', pt: 'Cada divisão com o seu próprio clima.' },
      body: { en: 'Uponor underfloor heating and a 3-pipe VRF/VRV system, so one room can be heated while another is cooled. External shutters on every window.',
              pt: 'Piso radiante Uponor e um sistema VRF/VRV de 3 tubos, para aquecer uma divisão enquanto outra arrefece. Estores exteriores em todas as janelas.' },
      makers: 'Uponor · VRF/VRV' },
    { img: 'bath-master',
      spots: [
        { x: 55, y: 68, m: 'Laufen', t: { en: 'Freestanding bathtub', pt: 'Banheira livre' } },
        { x: 16, y: 48, m: 'Dornbracht LULU', t: { en: 'Taps', pt: 'Torneiras' } },
        { x: 31, y: 23, m: 'Dornbracht LULU', t: { en: 'Shower', pt: 'Chuveiro' } },
        { x: 10, y: 66, m: 'Laufen', t: { en: 'Basins', pt: 'Lavatórios' } },
        { x: 86, y: 18, m: 'Monalisa', t: { en: 'Porcelain tiles, 600 × 1200 mm', pt: 'Revestimento cerâmico, 600 × 1200 mm' } }
      ],
      room: { en: 'Master bathroom', pt: 'Casa de banho principal' },
      title: { en: 'Laufen and Dornbracht.', pt: 'Laufen e Dornbracht.' },
      sub: { en: 'Large-format tiles, few joins.', pt: 'Revestimento de grande formato, poucas juntas.' },
      body: { en: 'WCs, bathtubs and basins by Laufen; taps and showers from the Dornbracht LULU series, with a Dornbracht hand shower at every WC. Monalisa porcelain tiles, mainly 600 × 1200 mm.',
              pt: 'Sanitas, banheiras e lavatórios Laufen; torneiras e chuveiros da série Dornbracht LULU, com chuveiro de higiene Dornbracht em todas as sanitas. Revestimento cerâmico Monalisa, sobretudo 600 × 1200 mm.' },
      makers: 'Laufen · Dornbracht · Monalisa' },
    { img: 'hall-1',
      spots: [
        { x: 50, y: 82, m: 'Fior di Bosco', t: { en: 'Honed natural stone floor', pt: 'Pavimento em pedra natural amaciada' } },
        { x: 86, y: 45, m: { en: 'Ribbed panelling', pt: 'Painéis canelados' }, t: { en: 'Timber-tone wall panelling', pt: 'Revestimento de parede em tom de madeira' } },
        { x: 40.5, y: 12, m: 'LED', t: { en: 'Linear LED lighting', pt: 'Iluminação LED linear' } }
      ],
      room: { en: 'Entrance hall', pt: 'Hall de entrada' },
      title: { en: 'An entrance in stone and timber.', pt: 'Uma entrada em pedra e madeira.' },
      sub: { en: 'Fior di Bosco underfoot, ribbed panelling alongside.', pt: 'Fior di Bosco no chão, painéis canelados nas paredes.' },
      body: { en: 'The entrance hall is floored in honed Fior di Bosco natural stone and lined in ribbed panelling. The entrance door is part of the smart-home system, and a Thyssenkrupp lift serves the building.',
              pt: 'O hall de entrada tem pavimento em pedra natural Fior di Bosco amaciada e paredes em painéis canelados. A porta de entrada integra a domótica, e um elevador Thyssenkrupp serve o edifício.' },
      makers: 'Fior di Bosco · Thyssenkrupp' }
  ],


  // Indicative positions and drive times — verify before publication.
  place: {
    home: { lon: -9.3800, lat: 38.7125 },
    destinations: [
      { id: 'golf', cat: 'leisure', a: 80, side: 'l', lon: -9.3949, lat: 38.7187, min: 4, name: { en: 'Estoril Golf Club', pt: 'Clube de Golf do Estoril' } },
      { id: 'casino', cat: 'leisure', a: -40, side: 'l', lon: -9.3972, lat: 38.7063, min: 5, name: { en: 'Casino Estoril', pt: 'Casino Estoril' } },
      { id: 'tamariz', cat: 'coast', a: -100, side: 'r', lon: -9.3995, lat: 38.7031, min: 6, name: { en: 'Tamariz Beach', pt: 'Praia do Tamariz' } },
      { id: 'cascais', cat: 'coast', a: 200, side: 'r', lon: -9.4180, lat: 38.6928, min: 10, name: { en: 'Cascais & Marina', pt: 'Cascais e Marina' } },
      { id: 'schools', cat: 'essentials', a: 50, side: 'l', lon: -9.3320, lat: 38.6890, min: 10, name: { en: 'International schools', pt: 'Escolas internacionais' } },
      { id: 'lisbon', cat: 'city', a: 0, side: 'r', lon: -9.1390, lat: 38.7100, min: 25, name: { en: 'Lisbon', pt: 'Lisboa' } },
      { id: 'airport', cat: 'essentials', a: 12, side: 'r', lon: -9.1340, lat: 38.7740, min: 30, name: { en: 'Lisbon Airport', pt: 'Aeroporto de Lisboa' } }
    ]
  }
};

window.I18N = {
  en: {
    'nav.residences': 'Residences', 'nav.architecture': 'Architecture', 'nav.estoril': 'Estoril',
    'nav.group': 'Bohemian Group', 'nav.enquiry': 'Enquire', 'nav.menu': 'Menu', 'nav.close': 'Close',
    'tagline': 'The art of place and pause',
    'hero.place': 'Estoril · Portugal',
    'hero.sub': 'Two private residences on Avenida da Dinamarca.',
    'hero.facts': '3 & 4 suites · private pools · garden & roof terrace',
    'film.eyebrow': 'The film', 'film.watch': 'Watch the film', 'film.meta': '1:15 · Sound on',
    'intro.title': 'An intimate expression of Estoril living.',
    'intro.meta': '{n} homes · {beds} bedrooms · {pools} pools',
    'hero.cue': 'Discover', 'sound': 'Sound', 'skip': 'Enter',
    'intro.eyebrow': 'Bohemia',
    'intro.statement': 'An intimate expression of Estoril living — conceived with the privacy of a home and the refinement of contemporary architecture.',
    'intro.body': 'On a quiet hillside above the Estoril coast, Bohemia is a single building of travertine, glass and light — and just two residences, one of three bedrooms and one of four. Each has its own floors, its own outdoor spaces and its own pool. Nothing is shared that should be private.',
    'dusk.1': 'By day, a house of stone and light.',
    'dusk.2': 'By evening, a lantern on the hillside.',
    'dusk.cap': 'Avenida da Dinamarca, Estoril',
    'collection.eyebrow': 'The Residences',
    'collection.lede': 'Each residence occupies its own floors of the building. Select a level to explore it.',
    'collection.hint': 'Select a level',
    'res.explore': 'Explore the residence', 'res.explore.short': 'Explore',
    'arch.eyebrow': 'Architecture',
    'arch.title_html': 'Designed as homes,<br><em>not apartments.</em>',
    'arch.lede': 'Bohemia is composed as a sequence of horizontal planes stepping into the hillside — deep, cantilevered slabs that shade the glass beneath them and give every floor a terrace of its own.',
    'arch.body': 'The façade is clad in travertine and framed in anthracite aluminium. Floor-to-ceiling glazing slides away completely, so that living rooms continue, uninterrupted, onto terraces, gardens and pools. Mature pines enclose the site, and the building is turned to the light rather than to the street.',
    'arch.credit': 'Concept design', 'arch.credit.sub': 'Architecture + Interior',
    'brand.by': 'by Bohemian Group', 'brand.foot': 'By Bohemian Group · Estoril',
    'arch.p1.t': 'Privacy', 'arch.p1.d': 'Each residence on its own floors, with its own outdoor spaces and pool.',
    'arch.p2.t': 'Light', 'arch.p2.d': 'Full-height glazing on every elevation, softened by linen and deep overhangs.',
    'arch.p3.t': 'Proportion', 'arch.p3.d': 'Generous rooms arranged simply: living spaces to the view, suites to the garden.',
    'arch.p4.t': 'Outside in', 'arch.p4.d': 'Terraces, gardens and water treated as rooms, not as additions.',
    'arch.cap1': 'The ground-floor terrace and pool', 'arch.cap2': 'Fior di Bosco stone and ribbed timber in the halls', 'arch.cap3': 'A private garden pool',
    'mat.eyebrow': 'Interiors & Materials',
    'mat.title_html': 'Luxury is a matter<br><em>of detail.</em>',
    'mat.lede': 'A restrained palette of natural stone, timber tones and soft light — chosen to age well, and to be lived with.',
    'int.eyebrow': 'Interiors', 'int.room': 'Room', 'int.makers': 'Makers', 'int.view': 'View', 'int.render': 'Image', 'int.cgi': 'CGI · indicative', 'int.prev': 'Previous', 'int.next': 'Next', 'int.title': 'Quiet rooms, made for living.',
    'est.eyebrow': 'The Address',
    'est.sub': 'Estoril, Portugal',
    'est.riviera': 'The Portuguese Riviera',
    'est.body': 'For more than a century, the coast between Estoril and Cascais has drawn those who could live anywhere — for the Atlantic light, the mild winters, the golf and the sea, and for Lisbon, twenty-five minutes away outside rush hour. Avenida da Dinamarca sits above it all: residential, green and quiet, minutes from the beaches of Tamariz and the marina at Cascais.',
    'est.min': 'min', 'est.note': 'Indicative travel times by car, outside rush hour.',
    'est.cat.all': 'All', 'est.cat.leisure': 'Leisure', 'est.cat.coast': 'Coast', 'est.cat.essentials': 'Essentials', 'est.cat.city': 'City',
    'est.ringsCap': 'Rings show drive time from the residence. Hover or tap a place to trace it.',
    'est.ocean': 'Atlantic Ocean', 'est.tagus': 'Tagus',
    'group.eyebrow': 'Developed by',
    'group.title': 'Bohemian Group',
    'group.body': 'We build rarely, and deliberately. Each project begins with a place worth pausing in, and is shaped by a small team of architects, designers and craftspeople who share one conviction: that the best homes are felt before they are understood.',
    'enq.eyebrow': 'Enquiries',
    'enq.title_html': 'Request <em>further information.</em>',
    'enq.lead': 'Pricing and viewings are arranged individually.',
    'enq.visits.k': 'Viewings', 'enq.visits.t': 'Visits can be arranged in Estoril, or by video call.',
    'enq.step1': 'About you', 'enq.step2': 'Your interest', 'enq.step3': 'Message',
    'enq.continue': 'Continue', 'enq.back': 'Back', 'enq.optional': '(optional)', 'enq.msg': 'Message', 'enq.talk': 'Prefer to talk?',
    'enq.ph.name': 'As you would like to be addressed', 'enq.ph.phone': '+351 …',
    'enq.ph.msg': 'Timing, preferred visit dates, or anything you would like us to prepare.',
    'enq.missing1': 'Please add your name and a valid email.',
    'enq.missingPhone': 'Please add a telephone number, so we can contact you as you prefer.',
    'enq.missing3': 'Please tick the privacy consent.',
    'enq.body': 'Visits can be arranged in Estoril, or by video call. Pricing and viewings are arranged individually.',
    'enq.name': 'Full name', 'enq.email': 'Email', 'enq.phone': 'Telephone', 'enq.country': 'Country of residence',
    'enq.interest': 'Residence of interest', 'enq.any': 'Not yet decided', 'enq.role': 'I am enquiring as',
    'enq.role.buyer': 'A private buyer', 'enq.role.advisor': 'An advisor or agent', 'enq.role.office': 'A family office',
    'enq.contact': 'Preferred contact', 'enq.c.email': 'Email', 'enq.c.phone': 'Telephone', 'enq.c.wa': 'WhatsApp',
    'enq.message': 'Message (optional)',
    'enq.consent': 'I agree that Bohemian Group may contact me about Bohemia. My details will be handled in line with the privacy policy.',
    'enq.send': 'Send enquiry',
    'enq.sending': 'Sending…', 'enq.error': 'Your enquiry could not be sent. Please try again in a moment.',
    'enq.missing': 'Please add your name, a valid email and tick the privacy consent.',
    'enq.direct': 'Or contact us directly', 'wa.msg': 'Hello, I would like to know more about Bohemia.', 'wa.msg.r': 'Hello, I would like to know more about {name} at Bohemia.',
    'enq.thanks.t': 'Thank you.', 'enq.img.alt': 'Living room, computer-generated image',
    'enq.thanks.d': 'We will be in touch with you personally, within one working day.',
    'foot.legal': 'Bohemia is developed by Bohemian Group. All images are computer-generated and indicative. Areas are approximate and subject to final confirmation. Furniture is not included.',
    'foot.privacy': 'Privacy', 'foot.cookies': 'Cookies',
    'fact.bedrooms': 'Bedrooms', 'fact.interior': 'Interior', 'fact.exterior': 'Outdoor', 'fact.parking': 'Parking', 'fact.pool': 'Private pool',
    'fact.yes': 'Yes', 'fact.spaces': 'spaces',
    'fact.price': 'Price', 'price.request': 'Price on request', 'price.onrequest': 'On request',
    'ov.inside': 'Inside', 'ov.out.garden': 'Garden & terrace', 'ov.out.terraces': 'Terraces & pool',
    'ov.note.more': 'Drawn to scale. Outdoor space exceeds the interior by {d} m².', 'ov.note.less': 'Drawn to scale. Outdoor space equals {p}% of the interior.',
    'ov.suites': 'Suites', 'ov.pool': 'Pool', 'ov.private': 'Private', 'ov.parking': 'Parking', 'ov.spaces': '{n} spaces',
    'u.private': 'Private', 'u.poolword': 'Pool', 'tag.ground': 'Ground floor', 'tag.floor': 'Floor {n}', 'tag.floors': 'Floors {a}–{b}',
    'u.bedrooms': 'bedrooms', 'u.interior': 'interior', 'u.pool': 'private pool',
    'room.living': 'Living room', 'room.kitchen': 'Kitchen', 'room.entrance': 'Entrance', 'room.hall': 'Hall', 'room.guestwc': 'Guest WC',
    'room.suite1': 'Suite I', 'room.suite2': 'Suite II', 'room.suite3': 'Suite III', 'room.bath1': 'Bathroom I', 'room.bath2': 'Bathroom II',
    'room.bath3': 'Bathroom III', 'room.laundry': 'Laundry', 'room.terrace': 'Terrace', 'room.pool': 'Pool', 'room.garden': 'Garden',
    'room.master': 'Master suite', 'room.masterbath': 'Master bathroom', 'room.dressing': 'Dressing room', 'room.balcony': 'Balcony',
    'room.roofterrace': 'Roof terrace',
    'plan.living': 'Living', 'plan.kitchen': 'Kitchen', 'plan.entrance': 'Entrance', 'plan.hall': 'Hall', 'plan.guestwc': 'WC',
    'plan.suite1': 'Suite I', 'plan.suite2': 'Suite II', 'plan.suite3': 'Suite III', 'plan.bath1': 'Bath I', 'plan.bath2': 'Bath II', 'plan.bath3': 'Bath III',
    'plan.laundry': 'Laundry', 'plan.master': 'Master suite', 'plan.masterbath': 'Master bath', 'plan.dressing': 'Dressing',
    'plan.terrace': 'Terrace', 'plan.pool': 'Pool', 'plan.garden': 'Garden', 'plan.balcony': 'Balcony', 'plan.roofterrace': 'Terrace',
    'rp.pdf': 'Architectural plans', 'rp.pdf.dl': 'Download PDF',
    'rp.back': 'The collection', 'rp.plan': 'The plan', 'rp.plan.hint': 'Select a room', 'rp.plan.drag': 'Drag to move',
    'rp.storage': 'private storage',
    'feat.eyebrow': 'Everything included', 'feat.title_html': 'Every feature,<br><em>at a glance.</em>',
    'feat.lede': 'All that comes with each residence — from the travertine façade to the Quooker tap.',
    'feat.out': 'Outdoor & building', 'feat.two': 'Only two residences in the building',
    'feat.parking': '{n} parking spaces in the basement garage and private storage, for each residence',
    'feat.cta': 'Ask about any feature',
    'block.msg': 'Please ask the developer, Chaudhry Nihaal, to allow mobile access.',
    'spec.eyebrow': 'Specification', 'spec.title_html': 'Specified<br><em>without compromise.</em>',
    'spec.lede': 'Every system and finish comes from the makers who do it best — so the homes perform as beautifully as they look.',
    'spec.note': 'Specification applies to both residences. Furniture is not included.', 'spec.all': 'Full specification', 'spec.less': 'Show less',
    'rp.gallery': 'Gallery', 'rp.spec': 'Specification', 'rp.also': 'Also in the collection',
    'rp.cta': 'Enquire about this residence', 'rp.drag': 'Drag',
    'rp.spec.finishes': 'Finishes', 'rp.spec.finishes.d': 'Travertine façade · Fior di Bosco stone entrance · oak floors · Dekton Pietra kitchen worktops · porcelain-clad bathrooms',
    'rp.spec.outdoor': 'Outdoor', 'rp.spec.building': 'The building',
    'rp.spec.building.d': 'Lift access · three parking spaces · private storage · secure underground garage',
    'rp.areas.note': 'Areas are approximate and subject to final confirmation.',
    'line.all.2': 'Two exceptional residences. One remarkable address.',
    'facts.res': 'Residences', 'facts.bed': 'Bedrooms', 'facts.pool': 'Private pools', 'res.label': 'Residence', 'est.scale': '5 km'
  },
  pt: {
    'nav.residences': 'Residências', 'nav.architecture': 'Arquitetura', 'nav.estoril': 'Estoril',
    'nav.group': 'Bohemian Group', 'nav.enquiry': 'Contactar', 'nav.menu': 'Menu', 'nav.close': 'Fechar',
    'tagline': 'A arte do lugar e da pausa',
    'hero.place': 'Estoril · Portugal',
    'hero.sub': 'Duas residências privadas na Avenida da Dinamarca.',
    'hero.facts': 'T3 e T4 · piscinas privativas · jardim e terraço superior',
    'film.eyebrow': 'O filme', 'film.watch': 'Ver o filme', 'film.meta': '1:15 · Com som',
    'intro.title': 'Uma expressão íntima do viver no Estoril.',
    'intro.meta': '{n} residências · {types} · {pools} piscinas',
    'hero.cue': 'Descobrir', 'sound': 'Som', 'skip': 'Entrar',
    'intro.eyebrow': 'Bohemia',
    'intro.statement': 'Uma expressão íntima do viver no Estoril — pensada com a privacidade de uma casa e o requinte da arquitetura contemporânea.',
    'intro.body': 'Numa encosta tranquila sobre a costa do Estoril, o Bohemia é um único edifício de travertino, vidro e luz — com apenas duas residências, uma de três quartos e outra de quatro. Cada uma tem os seus pisos, os seus espaços exteriores e a sua piscina. Nada se partilha que deva ser privado.',
    'dusk.1': 'De dia, uma casa de pedra e luz.',
    'dusk.2': 'Ao entardecer, uma lanterna na encosta.',
    'dusk.cap': 'Avenida da Dinamarca, Estoril',
    'collection.eyebrow': 'As Residências',
    'collection.lede': 'Cada residência ocupa os seus próprios pisos do edifício. Selecione um piso para a explorar.',
    'collection.hint': 'Selecione um piso',
    'res.explore': 'Explorar a residência', 'res.explore.short': 'Explorar',
    'arch.eyebrow': 'Arquitetura',
    'arch.title_html': 'Pensadas como casas,<br><em>não como apartamentos.</em>',
    'arch.lede': 'O Bohemia compõe-se como uma sequência de planos horizontais que se escalonam na encosta — lajes profundas, em consola, que sombreiam o vidro e dão a cada piso um terraço próprio.',
    'arch.body': 'A fachada é revestida a travertino e emoldurada em alumínio antracite. Os vãos de piso a teto deslizam por completo, para que as salas continuem, sem interrupção, para terraços, jardins e piscinas. Pinheiros maduros envolvem o terreno, e o edifício volta-se para a luz e não para a rua.',
    'arch.credit': 'Conceito de arquitetura', 'arch.credit.sub': 'Arquitetura + Interiores',
    'brand.by': 'por Bohemian Group', 'brand.foot': 'Por Bohemian Group · Estoril',
    'arch.p1.t': 'Privacidade', 'arch.p1.d': 'Cada residência nos seus próprios pisos, com exteriores e piscina próprios.',
    'arch.p2.t': 'Luz', 'arch.p2.d': 'Vãos de altura total em todas as fachadas, suavizados por linho e palas profundas.',
    'arch.p3.t': 'Proporção', 'arch.p3.d': 'Espaços generosos, organizados com simplicidade: as salas para a vista, as suites para o jardim.',
    'arch.p4.t': 'Dentro e fora', 'arch.p4.d': 'Terraços, jardins e água tratados como divisões, e não como acrescentos.',
    'arch.cap1': 'O terraço e a piscina do rés-do-chão', 'arch.cap2': 'Pedra Fior di Bosco e painéis canelados nos halls', 'arch.cap3': 'Uma piscina privativa no jardim',
    'mat.eyebrow': 'Interiores e Materiais',
    'mat.title_html': 'O luxo é uma questão<br><em>de detalhe.</em>',
    'mat.lede': 'Uma paleta contida de pedra natural, tons de madeira e luz suave — escolhida para envelhecer bem, e para ser vivida.',
    'int.eyebrow': 'Interiores', 'int.room': 'Divisão', 'int.makers': 'Marcas', 'int.view': 'Vista', 'int.render': 'Imagem', 'int.cgi': 'Imagem 3D · indicativa', 'int.prev': 'Anterior', 'int.next': 'Seguinte', 'int.title': 'Espaços serenos, feitos para viver.',
    'est.eyebrow': 'A Morada',
    'est.sub': 'Estoril, Portugal',
    'est.riviera': 'A Costa do Estoril',
    'est.body': 'Há mais de um século que a costa entre o Estoril e Cascais atrai quem poderia viver em qualquer lugar — pela luz atlântica, pelos invernos amenos, pelo golfe e pelo mar, e por Lisboa, a vinte e cinco minutos fora das horas de ponta. A Avenida da Dinamarca fica acima de tudo isto: residencial, verde e tranquila, a minutos das praias do Tamariz e da marina de Cascais.',
    'est.min': 'min', 'est.note': 'Tempos de viagem de carro indicativos, fora das horas de ponta.',
    'est.cat.all': 'Todos', 'est.cat.leisure': 'Lazer', 'est.cat.coast': 'Costa', 'est.cat.essentials': 'Essenciais', 'est.cat.city': 'Cidade',
    'est.ringsCap': 'Os anéis mostram o tempo de carro a partir da residência. Passe o cursor ou toque num local para o traçar.',
    'est.ocean': 'Oceano Atlântico', 'est.tagus': 'Tejo',
    'group.eyebrow': 'Promovido por',
    'group.title': 'Bohemian Group',
    'group.body': 'Construímos raramente, e com intenção. Cada projeto começa num lugar onde vale a pena parar, e ganha forma pelas mãos de uma pequena equipa de arquitetos, designers e artesãos que partilham uma convicção: as melhores casas sentem-se antes de se compreenderem.',
    'enq.eyebrow': 'Contacto',
    'enq.title_html': 'Peça <em>mais informações.</em>',
    'enq.lead': 'Preços e visitas são tratados individualmente.',
    'enq.visits.k': 'Visitas', 'enq.visits.t': 'As visitas podem ser agendadas no Estoril, ou por videochamada.',
    'enq.step1': 'Sobre si', 'enq.step2': 'O seu interesse', 'enq.step3': 'Mensagem',
    'enq.continue': 'Continuar', 'enq.back': 'Voltar', 'enq.optional': '(opcional)', 'enq.msg': 'Mensagem', 'enq.talk': 'Prefere falar connosco?',
    'enq.ph.name': 'Como prefere que nos dirijamos a si', 'enq.ph.phone': '+351 …',
    'enq.ph.msg': 'Prazos, datas preferidas para a visita, ou o que quiser que preparemos.',
    'enq.missing1': 'Indique o seu nome e um email válido.',
    'enq.missingPhone': 'Indique um número de telefone, para o podermos contactar como prefere.',
    'enq.missing3': 'Assinale o consentimento de privacidade.',
    'enq.body': 'As visitas podem ser agendadas no Estoril, ou por videochamada. Preços e visitas são tratados individualmente.',
    'enq.name': 'Nome completo', 'enq.email': 'Email', 'enq.phone': 'Telefone', 'enq.country': 'País de residência',
    'enq.interest': 'Residência de interesse', 'enq.any': 'Ainda não decidi', 'enq.role': 'Contacto na qualidade de',
    'enq.role.buyer': 'Comprador particular', 'enq.role.advisor': 'Consultor ou agente', 'enq.role.office': 'Family office',
    'enq.contact': 'Contacto preferido', 'enq.c.email': 'Email', 'enq.c.phone': 'Telefone', 'enq.c.wa': 'WhatsApp',
    'enq.message': 'Mensagem (opcional)',
    'enq.consent': 'Aceito que o Bohemian Group me contacte sobre o Bohemia. Os meus dados serão tratados de acordo com a política de privacidade.',
    'enq.send': 'Enviar pedido',
    'enq.sending': 'A enviar…', 'enq.error': 'Não foi possível enviar o seu pedido. Por favor, tente novamente dentro de momentos.',
    'enq.missing': 'Indique o seu nome, um email válido e assinale o consentimento de privacidade.',
    'enq.direct': 'Ou contacte-nos diretamente', 'wa.msg': 'Olá, gostaria de saber mais sobre o Bohemia.', 'wa.msg.r': 'Olá, gostaria de saber mais sobre a {name} no Bohemia.',
    'enq.thanks.t': 'Obrigado.', 'enq.img.alt': 'Sala, imagem gerada por computador',
    'enq.thanks.d': 'Entraremos pessoalmente em contacto consigo no prazo de um dia útil.',
    'foot.legal': 'O Bohemia é promovido pelo Bohemian Group. Todas as imagens são geradas por computador e meramente indicativas. As áreas são aproximadas e sujeitas a confirmação final. O mobiliário não está incluído.',
    'foot.privacy': 'Privacidade', 'foot.cookies': 'Cookies',
    'fact.bedrooms': 'Quartos', 'fact.interior': 'Interior', 'fact.exterior': 'Exterior', 'fact.parking': 'Estacionamento', 'fact.pool': 'Piscina privativa',
    'fact.yes': 'Sim', 'fact.spaces': 'lugares',
    'fact.price': 'Preço', 'price.request': 'Preço sob consulta', 'price.onrequest': 'Sob consulta',
    'ov.inside': 'Interior', 'ov.out.garden': 'Jardim e terraço', 'ov.out.terraces': 'Terraços e piscina',
    'ov.note.more': 'Desenhado à escala. O espaço exterior excede o interior em {d} m².', 'ov.note.less': 'Desenhado à escala. O espaço exterior equivale a {p}% do interior.',
    'ov.suites': 'Suites', 'ov.pool': 'Piscina', 'ov.private': 'Privativa', 'ov.parking': 'Estacionamento', 'ov.spaces': '{n} lugares',
    'u.private': 'Privativa', 'u.poolword': 'Piscina', 'tag.ground': 'Rés-do-chão', 'tag.floor': '{n}.º piso', 'tag.floors': '{a}.º e {b}.º pisos',
    'u.bedrooms': 'quartos', 'u.interior': 'interior', 'u.pool': 'piscina privativa',
    'room.living': 'Sala', 'room.kitchen': 'Cozinha', 'room.entrance': 'Hall de entrada', 'room.hall': 'Corredor', 'room.guestwc': 'WC social',
    'room.suite1': 'Suite I', 'room.suite2': 'Suite II', 'room.suite3': 'Suite III', 'room.bath1': 'Casa de banho I', 'room.bath2': 'Casa de banho II',
    'room.bath3': 'Casa de banho III', 'room.laundry': 'Lavandaria', 'room.terrace': 'Terraço', 'room.pool': 'Piscina', 'room.garden': 'Jardim',
    'room.master': 'Suite principal', 'room.masterbath': 'Casa de banho principal', 'room.dressing': 'Closet', 'room.balcony': 'Varanda',
    'room.roofterrace': 'Terraço superior',
    'plan.living': 'Sala', 'plan.kitchen': 'Cozinha', 'plan.entrance': 'Entrada', 'plan.hall': 'Corredor', 'plan.guestwc': 'WC',
    'plan.suite1': 'Suite I', 'plan.suite2': 'Suite II', 'plan.suite3': 'Suite III', 'plan.bath1': 'WC I', 'plan.bath2': 'WC II', 'plan.bath3': 'WC III',
    'plan.laundry': 'Lavandaria', 'plan.master': 'Suite principal', 'plan.masterbath': 'WC principal', 'plan.dressing': 'Closet',
    'plan.terrace': 'Terraço', 'plan.pool': 'Piscina', 'plan.garden': 'Jardim', 'plan.balcony': 'Varanda', 'plan.roofterrace': 'Terraço',
    'rp.pdf': 'Plantas de arquitetura', 'rp.pdf.dl': 'Descarregar PDF',
    'rp.back': 'A coleção', 'rp.plan': 'A planta', 'rp.plan.hint': 'Selecione uma divisão', 'rp.plan.drag': 'Arraste para mover',
    'rp.storage': 'arrecadação privativa',
    'feat.eyebrow': 'Tudo incluído', 'feat.title_html': 'Cada detalhe,<br><em>num só olhar.</em>',
    'feat.lede': 'Tudo o que acompanha cada residência — da fachada em travertino à torneira Quooker.',
    'feat.out': 'Exterior e edifício', 'feat.two': 'Apenas duas residências no edifício',
    'feat.parking': '{n} lugares de estacionamento em cave e arrecadação privativa, por residência',
    'feat.cta': 'Pergunte por qualquer detalhe',
    'block.msg': 'Peça ao programador, Chaudhry Nihaal, que permita o acesso móvel.',
    'spec.eyebrow': 'Especificação', 'spec.title_html': 'Especificado<br><em>sem compromissos.</em>',
    'spec.lede': 'Cada sistema e acabamento vem de quem o faz melhor — para que as casas funcionem tão bem quanto parecem.',
    'spec.note': 'A especificação aplica-se às duas residências. O mobiliário não está incluído.', 'spec.all': 'Especificação completa', 'spec.less': 'Mostrar menos',
    'rp.gallery': 'Galeria', 'rp.spec': 'Especificação', 'rp.also': 'Também na coleção',
    'rp.cta': 'Pedir informações sobre esta residência', 'rp.drag': 'Arrastar',
    'rp.spec.finishes': 'Acabamentos', 'rp.spec.finishes.d': 'Fachada em travertino · hall em pedra Fior di Bosco · pavimentos em carvalho · bancadas de cozinha em Dekton Pietra · casas de banho em porcelânico',
    'rp.spec.outdoor': 'Exterior', 'rp.spec.building': 'O edifício',
    'rp.spec.building.d': 'Acesso por elevador · três lugares de estacionamento · arrecadação privada · garagem subterrânea segura',
    'rp.areas.note': 'Áreas aproximadas, sujeitas a confirmação final.',
    'line.all.2': 'Duas residências excecionais. Uma morada notável.',
    'facts.res': 'Residências', 'facts.bed': 'Quartos', 'facts.pool': 'Piscinas privativas', 'res.label': 'Residência', 'est.scale': '5 km'
  }
};
