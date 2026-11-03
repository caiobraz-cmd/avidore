import { AvidoreDatabase, OlfactoryCollection, Product } from '../types/avidore';

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const collectionMoods = [
  {
    subtitle: 'Atmosfera de serenidade arquitetônica e luz matinal',
    atmosphereTag: 'Serenidade & Luz Natural',
    concept:
      'Concebida para espaços de contemplação e recepções que pedem equilíbrio imediato. Uma composição pensada para acolher sem saturar o ambiente, respeitando a assinatura da Avidore: sentir antes de escolher.',
    vesselTone: '#8C6D58',
    liquidTone: '#E8DEC8',
    stoneTone: '#F2ECE4',
    botanicalAccent: 'Linho cru & Madeira clara',
    featured: true,
  },
  {
    subtitle: 'Elegância silenciosa e presença envolvente para interiores',
    atmosphereTag: 'Sofisticação Silenciosa',
    concept:
      'Inspirada no minimalismo europeu contemporâneo, traduz conforto tátil e sobriedade. Ideal para salas de estar, escritórios executivos e consultórios que valorizam discrição e permanência.',
    vesselTone: '#985858',
    liquidTone: '#DFC7B9',
    stoneTone: '#EFEAE2',
    botanicalAccent: 'Pedra travertino & Folhagem seca',
    featured: true,
  },
  {
    subtitle: 'Frescor botânico e transparência luminosa',
    atmosphereTag: 'Pureza & Clareza Sensorial',
    concept:
      'Desenhada para transmitir sensação de limpeza, ordem e bem-estar contínuo. Especialmente apreciada em ambientes de saúde, clínicas odontológicas, laboratórios e espaços de autocuidado.',
    vesselTone: '#6E786E',
    liquidTone: '#E4EAE0',
    stoneTone: '#F4F2ED',
    botanicalAccent: 'Vidro fosco & Botânicos verdes',
    featured: true,
  },
  {
    subtitle: 'Calor textural e profundidade contemporânea',
    atmosphereTag: 'Acolhimento & Presença',
    concept:
      'Uma interpretação intimista que veste o espaço com personalidade própria. Desenvolvida para momentos de pausa ao entardecer e ambientes com arquitetura em madeira, couro e tecidos naturais.',
    vesselTone: '#5A463F',
    liquidTone: '#D9C2B0',
    stoneTone: '#EBE3DA',
    botanicalAccent: 'Madeira nobre & Âmbar suave',
    featured: true,
  },
  {
    subtitle: 'Equilíbrio mineral e delicadeza atemporal',
    atmosphereTag: 'Equilíbrio & Harmonia',
    concept:
      'Proporções olfativas delicadas que permanecem no espaço de forma sutil. Pensada para quem busca um aroma contínuo e nunca fatigante no dia a dia residencial ou corporativo.',
    vesselTone: '#A48C7E',
    liquidTone: '#EFE5DC',
    stoneTone: '#F6F1EB',
    botanicalAccent: 'Cerâmica artesanal & Algodão',
    featured: false,
  },
  {
    subtitle: 'Identidade marcante e refinamento de galeria',
    atmosphereTag: 'Caráter Editorial',
    concept:
      'Composição de assinatura autoral que transforma a percepção de showrooms, ateliers e ambientes sociais. Um convite à memória olfativa duradoura.',
    vesselTone: '#7B4B4B',
    liquidTone: '#E3CEC5',
    stoneTone: '#F1EAE4',
    botanicalAccent: 'Mármore escovado & Resinas nobres',
    featured: false,
  },
  {
    subtitle: 'Leveza fluida para rituais diários da casa',
    atmosphereTag: 'Leveza Cotidiana',
    concept:
      'Criada para acompanhar a rotina da casa com naturalidade. Sua difusão equilibrada cria uma transição suave entre os ambientes íntimos e sociais.',
    vesselTone: '#9C8B7A',
    liquidTone: '#EDE4D7',
    stoneTone: '#F5F0E8',
    botanicalAccent: 'Cânhamo natural &Luz difusa',
    featured: false,
  },
  {
    subtitle: 'Sobriedade arquitetônica e notas de textura seca',
    atmosphereTag: 'Arquitetura & Matéria',
    concept:
      'Dialoga com superfícies minerais, concreto aparente e iluminação indireta. Uma proposta contemporânea para ambientes que buscam identidade própria longe do lugar-comum.',
    vesselTone: '#4E4744',
    liquidTone: '#D6CBC2',
    stoneTone: '#EAE4DE',
    botanicalAccent: 'Pedra bruta & Raízes aromáticas',
    featured: false,
  },
  {
    subtitle: 'Luminosidade delicada para gestos de hospitalidade',
    atmosphereTag: 'Hospitalidade & Afeto',
    concept:
      'Pensada para receber bem e presentear com significado. Traduz cuidado nos detalhes, desde o primeiro contato visual até a permanência suave no ambiente.',
    vesselTone: '#985858',
    liquidTone: '#F0DFD8',
    stoneTone: '#F6F1EB',
    botanicalAccent: 'Seda natural & Flores brancas secas',
    featured: false,
  },
  {
    subtitle: 'Reserva especial de laboratório e alta permanência',
    atmosphereTag: 'Reserva do Laboratório',
    concept:
      'Síntese do cuidado técnico da Avidore. Elaborada para oferecer projeção equilibrada e assinatura memorável, disponível para degustação prévia no laboratório olfativo.',
    vesselTone: '#393331',
    liquidTone: '#DEC8B8',
    stoneTone: '#EDE5DC',
    botanicalAccent: 'Vidro âmbar de laboratório & Metais escovados',
    featured: false,
  },
];

export const initialCollections: OlfactoryCollection[] = romanNumerals.map((numeral, idx) => {
  const mood = collectionMoods[idx];
  const numberPadded = String(idx + 1).padStart(2, '0');
  return {
    id: `colecao-${idx + 1}`,
    code: `COLEÇÃO ${numeral}`,
    romanNumeral: numeral,
    name: `Coleção Olfativa ${numeral}`,
    subtitle: mood.subtitle,
    conceptDescription: mood.concept,
    fragrancePresentation: `[Apresentação Oficial da Fragrância #${numberPadded} — Espaço estruturado para inserção do nome autoral e família olfativa oficial da Coleção ${numeral}]`,
    topNotesPlaceholder: `[Notas de Saída da Coleção ${numeral} — Aguardando ficha oficial do laboratório]`,
    heartNotesPlaceholder: `[Notas de Corpo da Coleção ${numeral} — Aguardando ficha oficial do laboratório]`,
    baseNotesPlaceholder: `[Notas de Fundo da Coleção ${numeral} — Aguardando ficha oficial do laboratório]`,
    atmosphereTag: mood.atmosphereTag,
    visualTheme: {
      vesselTone: mood.vesselTone,
      liquidTone: mood.liquidTone,
      stoneTone: mood.stoneTone,
      botanicalAccent: mood.botanicalAccent,
    },
    featured: mood.featured,
  };
});

// Generate the 20 Olfactory Collection Products (2 per collection: Difusor de Ambiente + Kit Aromático)
const olfactoryProducts: Product[] = initialCollections.flatMap((col, idx) => {
  const num = String(idx + 1).padStart(2, '0');

  const diffuser: Product = {
    id: `prod-difusor-${idx + 1}`,
    sku: `AVD-DIF-${num}`,
    slug: `difusor-de-ambiente-colecao-${col.romanNumeral.toLowerCase()}`,
    name: `Difusor de Ambiente · ${col.name}`,
    subtitle: `${col.atmosphereTag} — Fragrância oficial em homologação`,
    line: 'olfativa',
    category: 'difusor_ambiente',
    collectionId: col.id,
    price: 89.0,
    promotionalPrice: null,
    stock: 15,
    volumePlaceholder: '[Volume Oficial em ml — A confirmar na ficha técnica]',
    shortDescription: `Difusor de ambiente com varetas condutoras da ${col.name}. ${col.subtitle}.`,
    fullDescription: `${col.conceptDescription} Este produto integra a ${col.name} da Avidore. Os dados nominais de fragrância, pirâmide olfativa e volume exato estão estruturados em modo editorial até a confirmação da ficha técnica definitiva e regularização sanitária.`,
    characteristics: [
      `Pertence à ${col.name} (${col.atmosphereTag})`,
      'Acompanha conjunto de varetas para difusão contínua e uniforme',
      'Frasco com acabamento pensado para compor a arquitetura do ambiente',
      'Possibilidade de degustação olfativa prévia no Laboratório Avidore ("Sinta antes de escolher")',
      '[Volume nominal e dimensões exatas — Aguardando dados oficiais]',
    ],
    usageInstructions:
      'Retire o lacre de vedação e insira as varetas no frasco para que absorvam a fragrância. Inverta a posição das varetas periodicamente quando desejar intensificar a dispersão no ambiente. Posicione em local arejado, protegido da incidência solar direta.',
    olfactoryNotes: {
      family: `[Família Olfativa da ${col.name} — Em definição]`,
      top: col.topNotesPlaceholder,
      heart: col.heartNotesPlaceholder,
      base: col.baseNotesPlaceholder,
    },
    regulatoryInfo: {
      status: 'rascunho_anvisa',
      anvisaProcessPlaceholder: '[Processo / Notificação ANVISA — A confirmar antes da publicação comercial]',
      technicalResponsibleNote:
        'Comercialização sujeita à confirmação de notificação/regularização aplicável junto à Anvisa pelo Responsável Técnico.',
      batchPlaceholder: '[Lote / Validade — Impressos na embalagem oficial]',
    },
    variations: [
      { id: `var-dif-${idx + 1}-padrao`, label: 'Apresentação Padrão [Volume a confirmar]', priceDelta: 0, inStock: true },
    ],
    featured: idx < 3,
    visualStyle: {
      bottleShape: 'reed_diffuser',
      accentColor: col.visualTheme.vesselTone,
      surfaceTone: col.visualTheme.stoneTone,
    },
  };

  const aromaticKit: Product = {
    id: `prod-kit-${idx + 1}`,
    sku: `AVD-KIT-${num}`,
    slug: `kit-aromatico-colecao-${col.romanNumeral.toLowerCase()}`,
    name: `Kit Aromático · ${col.name}`,
    subtitle: `Experiência completa ${col.atmosphereTag} para ambiente ou presente`,
    line: 'olfativa',
    category: 'kit_aromatico',
    collectionId: col.id,
    price: 168.0,
    promotionalPrice: null,
    stock: 10,
    volumePlaceholder: '[Composição de itens e volumes do Kit — A confirmar]',
    shortDescription: `Conjunto sensorial da ${col.name}, ideal para ambientação completa ou presente sofisticado.`,
    fullDescription: `O Kit Aromático da ${col.name} reúne a identidade olfativa "${col.atmosphereTag}" em uma apresentação pensada para presentear ou vestir o espaço em diferentes momentos do dia. Os itens exatos que compõem o kit, seus volumes nominais e notas olfativas serão preenchidos conforme ficha oficial da Avidore.`,
    characteristics: [
      `Conjunto coordenado da ${col.name}`,
      'Embalagem de apresentação com acabamento editorial Avidore',
      'Excelente opção para presentear ou compor lavabos, salas e consultórios',
      'Disponível também para projetos de presentes corporativos sob consulta',
      '[Relação detalhada de itens e volumes — Aguardando ficha oficial]',
    ],
    usageInstructions:
      'Utilize os itens do kit de maneira combinada para manter a assinatura olfativa constante no espaço. Siga as orientações individuais de segurança contidas no rótulo de cada item.',
    olfactoryNotes: {
      family: `[Família Olfativa da ${col.name} — Em definição]`,
      top: col.topNotesPlaceholder,
      heart: col.heartNotesPlaceholder,
      base: col.baseNotesPlaceholder,
    },
    regulatoryInfo: {
      status: 'rascunho_anvisa',
      anvisaProcessPlaceholder: '[Processo / Notificação ANVISA — A confirmar antes da publicação comercial]',
      technicalResponsibleNote:
        'Comercialização sujeita à confirmação de notificação/regularização aplicável junto à Anvisa pelo Responsável Técnico.',
      batchPlaceholder: '[Lote / Validade — Impressos na embalagem oficial]',
    },
    variations: [
      { id: `var-kit-${idx + 1}-padrao`, label: 'Kit Apresentação Oficial [Itens a confirmar]', priceDelta: 0, inStock: true },
    ],
    featured: idx === 0 || idx === 1,
    visualStyle: {
      bottleShape: 'aromatic_kit',
      accentColor: col.visualTheme.vesselTone,
      surfaceTone: col.visualTheme.stoneTone,
    },
  };

  return [diffuser, aromaticKit];
});

// Generate the 3 Personal Care Products (Linha B — Standardized partner manufacturing under Avidore brand)
const personalCareProducts: Product[] = [
  {
    id: 'prod-cuidados-creme-hidratacao',
    sku: 'AVD-COS-01',
    slug: 'creme-de-hidratacao-avidore',
    name: 'Creme de Hidratação Avidore',
    subtitle: 'Linha de Cuidados Pessoais · Formulação padronizada por indústria parceira',
    line: 'cuidados_pessoais',
    category: 'creme_hidratacao',
    price: 98.0,
    promotionalPrice: null,
    stock: 20,
    volumePlaceholder: '[Volume / Peso Líquido Oficial — Aguardando ficha técnica da indústria parceira]',
    shortDescription:
      'Creme de hidratação comercializado sob a marca Avidore, desenvolvido e fabricado por indústria cosmética parceira com formulação padronizada.',
    fullDescription:
      'O Creme de Hidratação integra a Linha de Cuidados Pessoais Avidore. Fabricado por indústria cosmética parceira homologada e comercializado sob a identidade da Avidore, possui formulação padronizada e rigoroso controle de qualidade industrial. Esta página está preparada para exibir a composição INCI oficial, volume, modo de uso e dados regulatórios fornecidos pela fabricante.',
    characteristics: [
      'Produto cosmético de formulação padronizada por indústria parceira',
      'Apresentação comercial e curadoria estética assinadas pela Avidore',
      'Sem personalização individual de fórmula',
      '[Textura, sensorial e especificações técnicas — Aguardando laudo/ficha oficial da indústria]',
      '[Volume nominal — Aguardando especificação oficial]',
    ],
    usageInstructions:
      '[Modo de Uso Oficial — A ser inserido exatamente conforme rotulagem aprovada pela indústria fabricante e notificação sanitária.]',
    cosmeticDetails: {
      compositionInci:
        '[Composição INCI Oficial — Aguardando listagem integral de ingredientes fornecida pela indústria parceira fabricante]',
      ingredientsSummary:
        '[Ingredientes declarados em português — Aguardando ficha técnica oficial da indústria parceira, sem adição de ativos não documentados]',
      skinTypeIndication: '[Indicação de uso conforme rotulagem oficial — A confirmar]',
      partnerManufacturingNote:
        'Fabricado por indústria cosmética parceira terceirizada e distribuído/comercializado sob a marca Avidore. Formulação padronizada, não sujeita a personalização individual.',
    },
    regulatoryInfo: {
      status: 'rascunho_anvisa',
      anvisaProcessPlaceholder: '[Nº de Processo / Notificação ANVISA da Indústria Parceira — A confirmar]',
      technicalResponsibleNote:
        'Produto cosmético sujeito às normas da Anvisa. Nenhuma alegação terapêutica ou dermatológica é exibida sem comprovação regulatória.',
      batchPlaceholder: '[CNPJ Fabricante, AFE, Lote e Validade — Conforme embalagem oficial]',
    },
    featured: true,
    visualStyle: {
      bottleShape: 'cream_jar',
      accentColor: '#985858',
      surfaceTone: '#F6F1EB',
    },
  },
  {
    id: 'prod-cuidados-sabonete-facial',
    sku: 'AVD-COS-02',
    slug: 'sabonete-de-limpeza-facial-avidore',
    name: 'Sabonete de Limpeza Facial Avidore',
    subtitle: 'Linha de Cuidados Pessoais · Formulação padronizada por indústria parceira',
    line: 'cuidados_pessoais',
    category: 'sabonete_facial',
    price: 76.0,
    promotionalPrice: null,
    stock: 25,
    volumePlaceholder: '[Volume Líquido Oficial — Aguardando ficha técnica da indústria parceira]',
    shortDescription:
      'Sabonete de limpeza facial sob a marca Avidore, com formulação padronizada produzida por indústria cosmética parceira.',
    fullDescription:
      'Desenvolvido para o cuidado facial cotidiano dentro do universo Avidore, o Sabonete de Limpeza Facial conta com formulação padronizada fabricada por indústria parceira especializada. Todas as informações de rotulagem, lista de ingredientes (INCI), volume e dados regulatórios seguem estritamente a documentação técnica do fabricante parceiro.',
    characteristics: [
      'Formulação padronizada produzida por indústria cosmética parceira',
      'Embalagem com design minimalista alinhado à identidade Avidore',
      'Sem opção de alteração ou personalização de fórmula',
      '[Características físico-químicas e modo de aplicação — Aguardando ficha técnica oficial]',
      '[Volume nominal — Aguardando especificação oficial]',
    ],
    usageInstructions:
      '[Modo de Uso Oficial — A ser preenchido exatamente conforme instruções da rotulagem registrada pela indústria parceira.]',
    cosmeticDetails: {
      compositionInci:
        '[Composição INCI Oficial — Aguardando listagem integral de ingredientes fornecida pela indústria parceira fabricante]',
      ingredientsSummary:
        '[Ingredientes declarados em português — Aguardando ficha técnica oficial da indústria parceira, sem adição de ativos não documentados]',
      skinTypeIndication: '[Indicação de uso conforme rotulagem oficial — A confirmar]',
      partnerManufacturingNote:
        'Fabricado por indústria cosmética parceira terceirizada e comercializado sob a marca Avidore. Formulação padronizada.',
    },
    regulatoryInfo: {
      status: 'rascunho_anvisa',
      anvisaProcessPlaceholder: '[Nº de Processo / Notificação ANVISA da Indústria Parceira — A confirmar]',
      technicalResponsibleNote:
        'Produto cosmético sujeito às normas da Anvisa. Publicação comercial definitiva condicionada à inserção dos dados oficiais de rotulagem.',
      batchPlaceholder: '[CNPJ Fabricante, AFE, Lote e Validade — Conforme embalagem oficial]',
    },
    featured: true,
    visualStyle: {
      bottleShape: 'cleanser_pump',
      accentColor: '#B49B8D',
      surfaceTone: '#F6F1EB',
    },
  },
  {
    id: 'prod-cuidados-serum',
    sku: 'AVD-COS-03',
    slug: 'serum-avidore',
    name: 'Sérum Avidore',
    subtitle: 'Linha de Cuidados Pessoais · Formulação padronizada por indústria parceira',
    line: 'cuidados_pessoais',
    category: 'serum_facial',
    price: 124.0,
    promotionalPrice: null,
    stock: 18,
    volumePlaceholder: '[Volume Líquido Oficial em ml — Aguardando ficha técnica da indústria parceira]',
    shortDescription:
      'Sérum de cuidados pessoais comercializado sob a marca Avidore, produzido com formulação padronizada por indústria cosmética parceira.',
    fullDescription:
      'O Sérum Avidore completa o trio essencial da Linha de Cuidados Pessoais. Sua fabricação é realizada por indústria parceira homologada, garantindo padronização técnica, estabilidade e conformidade regulatória. Os campos de composição, ingredientes e instruções de uso abaixo estão estruturados para receber os dados oficiais do fabricante.',
    characteristics: [
      'Formulação cosmética padronizada por indústria parceira homologada',
      'Frasco conta-gotas de precisão com apresentação Avidore',
      'Produto padronizado (não possui personalização individual de fórmula)',
      '[Especificações técnicas da formulação — Aguardando ficha oficial da indústria]',
      '[Volume nominal — Aguardando especificação oficial]',
    ],
    usageInstructions:
      '[Modo de Uso Oficial — A ser inserido conforme diretrizes de rotulagem e precauções fornecidas pela indústria fabricante.]',
    cosmeticDetails: {
      compositionInci:
        '[Composição INCI Oficial — Aguardando listagem integral de ingredientes fornecida pela indústria parceira fabricante]',
      ingredientsSummary:
        '[Ingredientes declarados em português — Aguardando ficha técnica oficial da indústria parceira, sem adição de ativos não documentados]',
      skinTypeIndication: '[Indicação de uso conforme rotulagem oficial — A confirmar]',
      partnerManufacturingNote:
        'Fabricado por indústria cosmética parceira terceirizada e comercializado sob a marca Avidore. Formulação padronizada.',
    },
    regulatoryInfo: {
      status: 'rascunho_anvisa',
      anvisaProcessPlaceholder: '[Nº de Processo / Notificação ANVISA da Indústria Parceira — A confirmar]',
      technicalResponsibleNote:
        'Produto cosmético sujeito às exigências da Anvisa. Não utiliza alegações médicas ou terapêuticas.',
      batchPlaceholder: '[CNPJ Fabricante, AFE, Lote e Validade — Conforme embalagem oficial]',
    },
    featured: true,
    visualStyle: {
      bottleShape: 'serum_dropper',
      accentColor: '#393331',
      surfaceTone: '#F6F1EB',
    },
  },
];

export const initialDatabase: AvidoreDatabase = {
  collections: initialCollections,
  products: [...olfactoryProducts, ...personalCareProducts],
  coupons: [
    {
      code: 'BEMVINDO10',
      description: '10% de cortesia na primeira experiência online Avidore',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 80,
      active: true,
    },
    {
      code: 'ROTA25',
      description: 'R$ 25 de desconto para pedidos acima de R$ 220',
      discountType: 'fixed',
      discountValue: 25,
      minOrderValue: 220,
      active: true,
    },
  ],
  orders: [
    {
      id: 'ord-demo-1001',
      orderNumber: 'AVD-2026-1001',
      createdAt: '2026-11-02T14:20:00.000Z',
      customer: {
        name: 'Helena Vasconcelos',
        email: 'helena.vasconcelos@exemplo.com.br',
        whatsapp: '(44) 99812-3400',
        document: '048.***.***-12',
      },
      shippingAddress: {
        cep: '87020-025',
        street: 'Av. Tiradentes',
        number: '850',
        complement: 'Sala 402 — Clínica Odontológica',
        neighborhood: 'Zona 01',
        city: 'Maringá',
        state: 'PR',
      },
      shippingMethod: {
        id: 'rota-expressa-pr',
        carrier: 'Logística Rota Norte PR (Astorga · Maringá · Londrina)',
        serviceName: 'Entrega Dedicada Rota Norte PR',
        estimatedDays: '1 a 2 dias úteis',
        price: 14.9,
        regionNote: 'Eixo Astorga – Maringá – Londrina',
      },
      items: [
        {
          productId: 'prod-difusor-1',
          productName: 'Difusor de Ambiente · Coleção Olfativa I',
          sku: 'AVD-DIF-01',
          quantity: 2,
          unitPrice: 89.0,
        },
        {
          productId: 'prod-cuidados-sabonete-facial',
          productName: 'Sabonete de Limpeza Facial Avidore',
          sku: 'AVD-COS-02',
          quantity: 1,
          unitPrice: 76.0,
        },
      ],
      subtotal: 254.0,
      discount: 25.0,
      couponCode: 'ROTA25',
      shippingCost: 14.9,
      total: 243.9,
      paymentMethod: 'pix',
      paymentStatus: 'pago',
      fulfillmentStatus: 'enviado',
      trackingCode: 'AVD-PR-8849201',
    },
  ],
  leads: [
    {
      id: 'lead-demo-1',
      type: 'marketing_olfativo',
      createdAt: '2026-11-02T16:40:00.000Z',
      name: 'Dr. Ricardo Menezes',
      company: 'Clínica Odontológica Integrada Menezes',
      segment: 'Clínica Odontológica',
      city: 'Maringá - PR',
      whatsapp: '(44) 99911-2233',
      email: 'contato@odontomenezes.com.br',
      interestContext: 'Identidade olfativa para recepção e 3 consultórios odontológicos',
      message:
        'Gostaria de agendar uma demonstração com fita olfativa para escolhermos um aroma suave e acolhedor para nossa recepção em Maringá.',
      status: 'em_atendimento',
    },
    {
      id: 'lead-demo-2',
      type: 'presentes_corporativos',
      createdAt: '2026-11-03T09:15:00.000Z',
      name: 'Camila Andrade',
      company: 'Studio Arquitetura & Interiores Londrina',
      city: 'Londrina - PR',
      whatsapp: '(43) 99654-1100',
      email: 'camila@studioandrade.arq.br',
      desiredQuantity: '50 a 100 unidades',
      occasion: 'Presente de Final de Ano / Entrega de Chaves',
      customizationNeed: 'Personalização de rótulo com marca do escritório e fita em tom areia',
      message: 'Buscamos um kit aromático com prazo garantido em contrato para presentear clientes em dezembro.',
      status: 'novo',
    },
  ],
  settings: {
    brandName: 'AVIDORE · Laboratório Olfativo',
    tagline: 'Sinta antes de escolher.',
    whatsappNumber: '5544999999999',
    whatsappDisplay: '+55 (44) [Número Oficial WhatsApp — A confirmar]',
    instagramHandle: '@avidore',
    instagramUrl: 'https://www.instagram.com/',
    emailContact: 'contato@avidore.com.br',
    laboratoryLocation: {
      city: 'Astorga',
      state: 'PR',
      regionCoverage: ['Astorga', 'Maringá', 'Londrina', 'Norte do Paraná e envios para todo o Brasil'],
      addressPlaceholder: '[Endereço Oficial do Laboratório e Showroom em Astorga/PR — Aguardando confirmação para publicação]',
      hoursPlaceholder: '[Horários de Atendimento e Visitas Guiadas — Aguardando definição oficial]',
      visitPolicyNote:
        'Visitas ao laboratório para degustação de fragrâncias ("Sinta antes de escolher") realizadas mediante agendamento prévio.',
    },
    ecommercePlatformIntegration: {
      activePlatform: 'nativo_avidore',
      nuvemshopStoreUrlPlaceholder: 'https://avidore.lojavirtualnuvem.com.br',
      shopifyDomainPlaceholder: 'avidore.myshopify.com',
      freeShippingThreshold: 280.0,
    },
    analyticsPreparedness: {
      ga4MeasurementIdPlaceholder: '[G-XXXXXXXXXX — Inserir ID oficial do Google Analytics 4]',
      gtmContainerIdPlaceholder: '[GTM-XXXXXXX — Inserir ID oficial do Google Tag Manager]',
      metaPixelIdPlaceholder: '[XXXXXXXXXXXXXXXX — Inserir ID oficial do Meta Pixel]',
      enableEventLogging: true,
    },
  },
};
