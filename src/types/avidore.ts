export type ProductLine = 'olfativa' | 'cuidados_pessoais';

export type ProductCategory =
  | 'difusor_ambiente'
  | 'kit_aromatico'
  | 'creme_hidratacao'
  | 'sabonete_facial'
  | 'serum_facial';

export type RegulatoryStatus = 'publicado' | 'rascunho_anvisa';

export interface OlfactoryCollection {
  id: string;
  code: string; // e.g., "COLEÇÃO I"
  romanNumeral: string; // "I" .. "X"
  name: string; // e.g., "Coleção Olfativa I — [Nome Oficial em Definição]"
  subtitle: string;
  conceptDescription: string;
  fragrancePresentation: string;
  topNotesPlaceholder: string;
  heartNotesPlaceholder: string;
  baseNotesPlaceholder: string;
  atmosphereTag: string;
  visualTheme: {
    vesselTone: string;
    liquidTone: string;
    stoneTone: string;
    botanicalAccent: string;
  };
  featured: boolean;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  subtitle: string;
  line: ProductLine;
  category: ProductCategory;
  collectionId?: string; // For Linha A (Coleções Olfativas I..X)
  price: number;
  promotionalPrice?: number | null;
  stock: number;
  volumePlaceholder: string; // e.g. "[Volume Oficial — A confirmar]"
  shortDescription: string;
  fullDescription: string;
  characteristics: string[];
  usageInstructions: string;
  // Olfactory specific (Linha A)
  olfactoryNotes?: {
    top: string;
    heart: string;
    base: string;
    family: string;
  };
  // Personal Care specific (Linha B - standardized partner manufacturing)
  cosmeticDetails?: {
    compositionInci: string;
    ingredientsSummary: string;
    skinTypeIndication: string;
    partnerManufacturingNote: string;
  };
  regulatoryInfo: {
    status: RegulatoryStatus;
    anvisaProcessPlaceholder: string;
    technicalResponsibleNote: string;
    batchPlaceholder: string;
  };
  variations?: {
    id: string;
    label: string;
    priceDelta: number;
    inStock: boolean;
  }[];
  featured: boolean;
  visualStyle: {
    bottleShape: 'reed_diffuser' | 'aromatic_kit' | 'cream_jar' | 'cleanser_pump' | 'serum_dropper';
    accentColor: string;
    surfaceTone: string;
  };
}

export interface CartItem {
  productId: string;
  variationId?: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  active: boolean;
}

export interface ShippingOption {
  id: string;
  carrier: string;
  serviceName: string;
  estimatedDays: string;
  price: number;
  regionNote: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    whatsapp: string;
    document: string; // CPF or CNPJ
  };
  shippingAddress: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  shippingMethod: ShippingOption;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    variationLabel?: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  total: number;
  paymentMethod: 'pix' | 'cartao_credito' | 'checkout_externo';
  paymentStatus: 'aguardando_pagamento' | 'pago' | 'em_analise' | 'cancelado';
  fulfillmentStatus: 'recebido' | 'em_separacao' | 'enviado' | 'entregue';
  trackingCode?: string;
}

export interface CommercialLead {
  id: string;
  type: 'marketing_olfativo' | 'presentes_corporativos' | 'experiencia_laboratorio' | 'contato_geral';
  createdAt: string;
  name: string;
  company?: string;
  segment?: string; // e.g., Clínica Odontológica, Laboratório, Clínica Médica, etc.
  city?: string; // Astorga, Maringá, Londrina, Outra
  whatsapp: string;
  email: string;
  desiredQuantity?: string;
  occasion?: string;
  customizationNeed?: string;
  preferredDateOrShift?: string;
  interestContext?: string;
  message: string;
  status: 'novo' | 'em_atendimento' | 'proposta_enviada' | 'concluido';
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string; // e.g., "5544999999999"
  whatsappDisplay: string;
  instagramHandle: string;
  instagramUrl: string;
  emailContact: string;
  laboratoryLocation: {
    city: string;
    state: string;
    regionCoverage: string[];
    addressPlaceholder: string;
    hoursPlaceholder: string;
    visitPolicyNote: string;
  };
  ecommercePlatformIntegration: {
    activePlatform: 'nativo_avidore' | 'nuvemshop_headless' | 'shopify_storefront';
    nuvemshopStoreUrlPlaceholder: string;
    shopifyDomainPlaceholder: string;
    freeShippingThreshold: number;
  };
  analyticsPreparedness: {
    ga4MeasurementIdPlaceholder: string;
    gtmContainerIdPlaceholder: string;
    metaPixelIdPlaceholder: string;
    enableEventLogging: boolean;
  };
}

export interface AvidoreDatabase {
  collections: OlfactoryCollection[];
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  leads: CommercialLead[];
  settings: StoreSettings;
}
