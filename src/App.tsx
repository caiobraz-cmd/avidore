import React, { useEffect, useMemo, useState } from 'react';
import { initialDatabase } from './data/initialStoreData';
import {
  AvidoreDatabase,
  CartItem,
  CommercialLead,
  Coupon,
  OlfactoryCollection,
  Order,
  Product,
  ShippingOption,
  StoreSettings,
} from './types/avidore';
import {
  buildWhatsAppLink,
  formatCurrencyBRL,
  trackAvidoreEvent,
  updatePageSeo,
  WhatsAppContextType,
} from './utils/analyticsAndWhatsapp';
import { AvidoreMonogram, ProductStudioVisual } from './components/BrandVisuals';
import { HomePageView } from './components/HomePageView';
import {
  ColecoesOlfativasView,
  CuidadosPessoaisView,
  LojaView,
  ProdutoIndividualView,
} from './components/EcommercePages';
import {
  ContatoView,
  ExperienciaLaboratorioView,
  MarketingOlfativoView,
  PoliticasView,
  PresentesCorporativosView,
  SobreAvidoreView,
} from './components/B2BAndExperiencePages';
import {
  CarrinhoView,
  CheckoutView,
  MinhaContaView,
  PainelAdminView,
} from './components/CartCheckoutAccountAdmin';
import { ShoppingBag, X, Menu, MessageCircle, ArrowRight } from 'lucide-react';

type ActivePage =
  | 'home'
  | 'loja'
  | 'colecoes'
  | 'cuidados-pessoais'
  | 'produto'
  | 'marketing-olfativo'
  | 'presentes-corporativos'
  | 'experiencia'
  | 'sobre'
  | 'contato'
  | 'carrinho'
  | 'checkout'
  | 'minha-conta'
  | 'politicas'
  | 'admin';

const CART_STORAGE_KEY = 'avidore_cart_v1';

export default function App() {
  const [db, setDb] = useState<AvidoreDatabase>(initialDatabase);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialDatabase.products[0]?.id || 'prod-difusor-1'
  );
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [{ productId: 'prod-difusor-1', quantity: 1 }];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [cep, setCep] = useState<string>('87020-025');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Sync initial store data from backend API
  useEffect(() => {
    fetch('/api/store')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: AvidoreDatabase | null) => {
        if (data && data.products) {
          setDb(data);
        }
      })
      .catch(() => {
        // Fallback to initialDatabase already in state
      });
  }, []);

  // Persist cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Update SEO metadata on route change
  useEffect(() => {
    const seoMap: Record<ActivePage, { title: string; desc: string }> = {
      home: {
        title: 'AVIDORE · Laboratório Olfativo | Sinta antes de escolher',
        desc: 'Descubra o universo da Avidore. Difusores de ambiente, kits aromáticos, cosméticos, marketing olfativo e presentes corporativos em Astorga, Maringá e Londrina.',
      },
      loja: {
        title: 'Loja Oficial AVIDORE | Difusores, Kits Aromáticos e Cosméticos',
        desc: 'Compre online difusores de ambiente, kits aromáticos das 10 Coleções Olfativas e a Linha de Cuidados Pessoais Avidore.',
      },
      colecoes: {
        title: '10 Coleções Olfativas | AVIDORE · Laboratório Olfativo',
        desc: 'Conheça as 10 Coleções Olfativas da Avidore. Difusores de ambiente e kits aromáticos desenvolvidos para transformar espaços.',
      },
      'cuidados-pessoais': {
        title: 'Linha de Cuidados Pessoais | Creme, Sabonete Facial e Sérum AVIDORE',
        desc: 'Creme de hidratação, sabonete de limpeza facial e sérum sob a marca Avidore com formulações padronizadas de alta qualidade.',
      },
      produto: {
        title: 'Detalhes do Produto | AVIDORE · Laboratório Olfativo',
        desc: 'Especificações completas, apresentação olfativa, composição e envio para todo o Brasil.',
      },
      'marketing-olfativo': {
        title: 'Marketing Olfativo para Empresas e Clínicas | AVIDORE (Maringá, Londrina, Astorga)',
        desc: 'Identidade olfativa para clínicas odontológicas, laboratórios, clínicas médicas e empresas. Sinta antes de escolher.',
      },
      'presentes-corporativos': {
        title: 'Presentes Corporativos Personalizados com Aroma | AVIDORE',
        desc: 'Kits corporativos e presentes personalizados para clientes, colaboradores e eventos empresariais com prazo garantido em contrato.',
      },
      experiencia: {
        title: 'Experiência no Laboratório Olfativo | AVIDORE · Astorga - PR',
        desc: 'Agende sua experiência guiada no Laboratório Olfativo da Avidore e sinta as fragrâncias antes de escolher.',
      },
      sobre: {
        title: 'Sobre a AVIDORE | Filosofia e Laboratório Olfativo',
        desc: 'Conheça a proposta da Avidore: elegância que se sente, unindo experiências olfativas, cosméticos e soluções corporativas.',
      },
      contato: {
        title: 'Contato e Atendimento WhatsApp | AVIDORE · Laboratório Olfativo',
        desc: 'Fale com a Avidore via WhatsApp, Instagram ou formulário para compras, marketing olfativo, presentes corporativos e visitas.',
      },
      carrinho: {
        title: 'Sacola de Compras | AVIDORE · Laboratório Olfativo',
        desc: 'Revise seus produtos selecionados, calcule o frete e finalize sua compra na Avidore.',
      },
      checkout: {
        title: 'Checkout Seguro | AVIDORE · Laboratório Olfativo',
        desc: 'Finalize seu pedido com segurança via Pix, cartão de crédito ou integração e-commerce.',
      },
      'minha-conta': {
        title: 'Minha Conta e Pedidos | AVIDORE · Laboratório Olfativo',
        desc: 'Acompanhe seu histórico de pedidos, status de pagamento e código de rastreamento.',
      },
      politicas: {
        title: 'Políticas Institucionais, LGPD e Conformidade Regulatória | AVIDORE',
        desc: 'Informações sobre conformidade sanitária Anvisa, política de envios, trocas e privacidade LGPD.',
      },
      admin: {
        title: 'Painel Administrativo | AVIDORE · Gestão de Catálogo e Pedidos',
        desc: 'Gestão de produtos, coleções olfativas, estoque, cupons, pedidos e oportunidades comerciais.',
      },
    };

    const current = seoMap[activePage] || seoMap.home;
    updatePageSeo(current.title, current.desc, `#${activePage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const navigateTo = (page: string) => {
    setActivePage(page as ActivePage);
    setIsMobileMenuOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setActivePage('produto');
    trackAvidoreEvent('view_item', {
      item_id: product.sku,
      item_name: product.name,
      price: product.promotionalPrice ?? product.price,
    });
  };

  const handleAddToCart = (product: Product, quantity: number, variationId?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === product.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: Math.min(product.stock, updated[existingIdx].quantity + quantity),
        };
        return updated;
      }
      return [...prev, { productId: product.id, quantity, variationId }];
    });

    trackAvidoreEvent('add_to_cart', {
      item_id: product.sku,
      item_name: product.name,
      quantity,
      price: product.promotionalPrice ?? product.price,
    });

    setIsBagDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const prod = db.products.find((p) => p.id === item.productId);
      if (!prod) return sum;
      return sum + (prod.promotionalPrice ?? prod.price) * item.quantity;
    }, 0);
  }, [cart, db.products]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const fetchShippingOptions = async (targetCep: string, customSubtotal?: number): Promise<ShippingOption[]> => {
    const sub = customSubtotal !== undefined ? customSubtotal : cartSubtotal;
    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: targetCep, subtotal: sub }),
      });
      if (res.ok) {
        const data = await res.json();
        setShippingOptions(data.options || []);
        if (data.options?.length > 0) {
          setSelectedShipping(data.options[0]);
        }
        return data.options || [];
      }
    } catch {
      // Fallback local calculation
    }
    const fallback: ShippingOption[] = [
      {
        id: 'rota-norte-pr',
        carrier: 'Logística Dedicada Rota Norte PR',
        serviceName: 'Entrega Expressa Eixo Astorga · Maringá · Londrina',
        estimatedDays: '1 a 2 dias úteis',
        price: sub >= db.settings.ecommercePlatformIntegration.freeShippingThreshold ? 0 : 14.9,
        regionNote: 'Norte do Paraná',
      },
      {
        id: 'correios-sedex',
        carrier: 'Correios SEDEX',
        serviceName: 'SEDEX com Seguro',
        estimatedDays: '2 a 4 dias úteis',
        price: 24.9,
        regionNote: 'Nacional',
      },
    ];
    setShippingOptions(fallback);
    setSelectedShipping(fallback[0]);
    return fallback;
  };

  const handleApplyCoupon = async (code: string): Promise<{ ok: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, message: data.error || 'Cupom inválido.' };
      }
      setAppliedCoupon(data.coupon);
      return { ok: true, message: `Cupom ${data.coupon.code} aplicado com sucesso!` };
    } catch {
      const localMatch = db.coupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
      );
      if (localMatch && cartSubtotal >= localMatch.minOrderValue) {
        setAppliedCoupon(localMatch);
        return { ok: true, message: `Cupom ${localMatch.code} aplicado!` };
      }
      return { ok: false, message: 'Não foi possível validar este cupom.' };
    }
  };

  const handlePlaceOrder = async (payload: {
    customer: Order['customer'];
    shippingAddress: Order['shippingAddress'];
    shippingMethod: ShippingOption;
    paymentMethod: Order['paymentMethod'];
  }): Promise<Order> => {
    const items = cart
      .map((item) => {
        const prod = db.products.find((p) => p.id === item.productId);
        if (!prod) return null;
        return {
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          quantity: item.quantity,
          unitPrice: prod.promotionalPrice ?? prod.price,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const discount = appliedCoupon
      ? appliedCoupon.discountType === 'percentage'
        ? (cartSubtotal * appliedCoupon.discountValue) / 100
        : Math.min(cartSubtotal, appliedCoupon.discountValue)
      : 0;

    const total = Math.max(0, cartSubtotal - discount + payload.shippingMethod.price);

    const body = {
      ...payload,
      items,
      subtotal: cartSubtotal,
      discount,
      couponCode: appliedCoupon?.code,
      shippingCost: payload.shippingMethod.price,
      total,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setDb((prev) => ({ ...prev, orders: [data.order, ...prev.orders] }));
        setCart([]);
        setAppliedCoupon(null);
        return data.order;
      }
    } catch {
      // Fallback
    }

    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `AVD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...body,
      paymentStatus: 'aguardando_pagamento',
      fulfillmentStatus: 'recebido',
    };
    setDb((prev) => ({ ...prev, orders: [fallbackOrder, ...prev.orders] }));
    setCart([]);
    setAppliedCoupon(null);
    return fallbackOrder;
  };

  const handleSubmitLead = async (
    leadPayload: Omit<CommercialLead, 'id' | 'createdAt' | 'status'>
  ): Promise<void> => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      if (res.ok) {
        const data = await res.json();
        setDb((prev) => ({ ...prev, leads: [data.lead, ...prev.leads] }));
        return;
      }
    } catch {
      // Fallback
    }
    const fallbackLead: CommercialLead = {
      ...leadPayload,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'novo',
    };
    setDb((prev) => ({ ...prev, leads: [fallbackLead, ...prev.leads] }));
  };

  // Admin handlers
  const handleSaveProduct = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch {
      // local update below
    }
    setDb((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === product.id ? product : p)),
    }));
  };

  const handleSaveCollection = async (collection: OlfactoryCollection) => {
    try {
      await fetch(`/api/collections/${collection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collection),
      });
    } catch {
      // local update below
    }
    setDb((prev) => ({
      ...prev,
      collections: prev.collections.map((c) => (c.id === collection.id ? collection : c)),
    }));
  };

  const handleCreateCoupon = async (coupon: Omit<Coupon, 'active'>) => {
    const created: Coupon = { ...coupon, active: true };
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });
    } catch {
      // local update below
    }
    setDb((prev) => ({
      ...prev,
      coupons: [...prev.coupons.filter((c) => c.code !== created.code), created],
    }));
  };

  const handleUpdateOrder = async (id: string, patch: Partial<Order>) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch {
      // local update below
    }
    setDb((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const handleUpdateLead = async (id: string, status: CommercialLead['status']) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // local update below
    }
    setDb((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    }));
  };

  const handleSaveSettings = async (settings: StoreSettings) => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {
      // local update below
    }
    setDb((prev) => ({ ...prev, settings }));
  };

  const activeProduct =
    db.products.find((p) => p.id === selectedProductId) || db.products[0];
  const activeProductCollection = activeProduct?.collectionId
    ? db.collections.find((c) => c.id === activeProduct.collectionId)
    : undefined;
  const relatedProducts = useMemo(() => {
    if (!activeProduct) return [];
    return db.products.filter(
      (p) =>
        p.id !== activeProduct.id &&
        (p.collectionId === activeProduct.collectionId || p.line === activeProduct.line)
    );
  }, [activeProduct, db.products]);

  // Contextual WhatsApp for floating button
  const floatingWaContext: WhatsAppContextType =
    activePage === 'marketing-olfativo'
      ? 'marketing_olfativo'
      : activePage === 'presentes-corporativos'
      ? 'presentes_corporativos'
      : activePage === 'experiencia'
      ? 'experiencia_laboratorio'
      : activePage === 'carrinho' || activePage === 'checkout' || activePage === 'minha-conta'
      ? 'pedido'
      : 'produto';

  const floatingWaUrl = buildWhatsAppLink(
    db.settings.whatsappNumber,
    floatingWaContext,
    activePage === 'produto' ? activeProduct?.name : undefined
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EB] text-[#393331]">
      {/* TOP BAR CONTRACT: One-row, three-zone header separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#F6F1EB]/95 backdrop-blur-xs border-b border-[#D8C9BD]/80">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Title, one line */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="font-serif-editorial text-2xl tracking-[0.22em] text-[#985858] font-medium whitespace-nowrap shrink-0"
          >
            AVIDORE
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-[0.14em] text-[#393331]/85">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className={`hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'home' ? 'text-[#985858] underline underline-offset-4' : ''
              }`}
            >
              Início
            </a>
            <a
              href="#loja"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('loja');
              }}
              className={`hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'loja' || activePage === 'produto'
                  ? 'text-[#985858] underline underline-offset-4'
                  : ''
              }`}
            >
              Loja
            </a>
            <a
              href="#colecoes"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('colecoes');
              }}
              className={`hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'colecoes' ? 'text-[#985858] underline underline-offset-4' : ''
              }`}
            >
              Coleções
            </a>
            <a
              href="#cuidados-pessoais"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('cuidados-pessoais');
              }}
              className={`hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'cuidados-pessoais' ? 'text-[#985858] underline underline-offset-4' : ''
              }`}
            >
              Cuidados Pessoais
            </a>
            <a
              href="#marketing-olfativo"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('marketing-olfativo');
              }}
              className={`hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'marketing-olfativo' || activePage === 'presentes-corporativos'
                  ? 'text-[#985858] underline underline-offset-4'
                  : ''
              }`}
            >
              Empresas
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsBagDrawerOpen(true)}
              className="px-4 py-2 text-xs font-medium bg-[#985858] text-white hover:bg-[#7d4545] transition-colors whitespace-nowrap shrink-0 tabular-nums"
            >
              Sacola ({totalCartItems})
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Architectural Directory Bar (In-body navigation across all 14 institutional, B2B, and account pages) */}
      <div className="bg-[#FFFFFF] border-b border-[#D8C9BD]/60">
        <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto text-[11px] text-[#393331]/75">
          <div className="flex items-center gap-5 whitespace-nowrap">
            <button
              type="button"
              onClick={() => navigateTo('experiencia')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'experiencia' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              Experiência no Laboratório
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('marketing-olfativo')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'marketing-olfativo' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              Marketing Olfativo
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('presentes-corporativos')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'presentes-corporativos' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              Presentes Corporativos
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('sobre')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'sobre' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              A Avidore
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('contato')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'contato' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              Contato
            </button>
          </div>

          <div className="flex items-center gap-4 whitespace-nowrap">
            <button
              type="button"
              onClick={() => navigateTo('minha-conta')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'minha-conta' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              Meus Pedidos ({db.orders.length})
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className={`hover:text-[#985858] transition-colors ${
                activePage === 'admin' ? 'text-[#985858] font-semibold' : ''
              }`}
            >
              Painel Admin
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#393331] font-medium pl-2"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Mobile Expandable Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#D8C9BD] bg-[#F6F1EB] px-6 py-4 grid grid-cols-2 gap-3 text-xs font-medium">
            <button type="button" onClick={() => navigateTo('home')} className="text-left py-1.5">
              Início
            </button>
            <button type="button" onClick={() => navigateTo('loja')} className="text-left py-1.5">
              Loja Completa
            </button>
            <button type="button" onClick={() => navigateTo('colecoes')} className="text-left py-1.5">
              10 Coleções Olfativas
            </button>
            <button type="button" onClick={() => navigateTo('cuidados-pessoais')} className="text-left py-1.5">
              Cuidados Pessoais
            </button>
            <button type="button" onClick={() => navigateTo('marketing-olfativo')} className="text-left py-1.5">
              Marketing Olfativo
            </button>
            <button type="button" onClick={() => navigateTo('presentes-corporativos')} className="text-left py-1.5">
              Presentes Corporativos
            </button>
            <button type="button" onClick={() => navigateTo('experiencia')} className="text-left py-1.5">
              Experiência no Laboratório
            </button>
            <button type="button" onClick={() => navigateTo('sobre')} className="text-left py-1.5">
              Sobre a Avidore
            </button>
            <button type="button" onClick={() => navigateTo('contato')} className="text-left py-1.5">
              Contato
            </button>
            <button type="button" onClick={() => navigateTo('carrinho')} className="text-left py-1.5">
              Sacola de Compras
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT ROUTER */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePageView
            collections={db.collections}
            products={db.products}
            settings={db.settings}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p, q) => handleAddToCart(p, q)}
          />
        )}

        {activePage === 'loja' && (
          <LojaView
            products={db.products}
            collections={db.collections}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p, q) => handleAddToCart(p, q)}
          />
        )}

        {activePage === 'colecoes' && (
          <ColecoesOlfativasView
            collections={db.collections}
            products={db.products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p, q) => handleAddToCart(p, q)}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'cuidados-pessoais' && (
          <CuidadosPessoaisView
            products={db.products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p, q) => handleAddToCart(p, q)}
          />
        )}

        {activePage === 'produto' && activeProduct && (
          <ProdutoIndividualView
            product={activeProduct}
            collection={activeProductCollection}
            relatedProducts={relatedProducts}
            settings={db.settings}
            onBack={() => navigateTo('loja')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onCalculateShipping={fetchShippingOptions}
          />
        )}

        {activePage === 'marketing-olfativo' && (
          <MarketingOlfativoView
            settings={db.settings}
            onSubmitLead={handleSubmitLead}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'presentes-corporativos' && (
          <PresentesCorporativosView
            settings={db.settings}
            onSubmitLead={handleSubmitLead}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'experiencia' && (
          <ExperienciaLaboratorioView
            settings={db.settings}
            onSubmitLead={handleSubmitLead}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'sobre' && (
          <SobreAvidoreView settings={db.settings} onNavigate={navigateTo} />
        )}

        {activePage === 'contato' && (
          <ContatoView
            settings={db.settings}
            onSubmitLead={handleSubmitLead}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'carrinho' && (
          <CarrinhoView
            cart={cart}
            products={db.products}
            appliedCoupon={appliedCoupon}
            shippingOptions={shippingOptions}
            selectedShipping={selectedShipping}
            cep={cep}
            onSetCep={setCep}
            onCalculateShipping={async (c) => {
              await fetchShippingOptions(c);
            }}
            onSelectShipping={setSelectedShipping}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={() => setAppliedCoupon(null)}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onContinueShopping={() => navigateTo('loja')}
            onProceedToCheckout={() => navigateTo('checkout')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutView
            cart={cart}
            products={db.products}
            appliedCoupon={appliedCoupon}
            shippingOptions={shippingOptions}
            selectedShipping={selectedShipping}
            cep={cep}
            settings={db.settings}
            onSetCep={setCep}
            onCalculateShipping={async (c) => {
              await fetchShippingOptions(c);
            }}
            onSelectShipping={setSelectedShipping}
            onApplyCoupon={handleApplyCoupon}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => navigateTo('carrinho')}
            onGoToAccount={() => navigateTo('minha-conta')}
          />
        )}

        {activePage === 'minha-conta' && (
          <MinhaContaView
            orders={db.orders}
            settings={db.settings}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'politicas' && <PoliticasView />}

        {activePage === 'admin' && (
          <PainelAdminView
            products={db.products}
            collections={db.collections}
            coupons={db.coupons}
            orders={db.orders}
            leads={db.leads}
            settings={db.settings}
            onSaveProduct={handleSaveProduct}
            onSaveCollection={handleSaveCollection}
            onCreateCoupon={handleCreateCoupon}
            onUpdateOrder={handleUpdateOrder}
            onUpdateLead={handleUpdateLead}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* SLIDE-OVER SHOPPING BAG DRAWER */}
      {isBagDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#393331]/40 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-[#F6F1EB] h-full border-l border-[#D8C9BD] flex flex-col justify-between p-6 shadow-xl">
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-[#D8C9BD] pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#985858]">
                    Experiência de Compra
                  </span>
                  <h2 className="font-serif-editorial text-2xl text-[#393331]">
                    Sacola de Compras ({totalCartItems})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBagDrawerOpen(false)}
                  className="p-2 text-[#393331]/70 hover:text-[#393331]"
                  aria-label="Fechar sacola"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <p className="text-sm text-[#393331]/75">Sua sacola está vazia no momento.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBagDrawerOpen(false);
                      navigateTo('loja');
                    }}
                    className="px-5 py-2.5 bg-[#985858] text-white text-xs font-medium"
                  >
                    Conhecer Produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const prod = db.products.find((p) => p.id === item.productId);
                    if (!prod) return null;
                    const price = prod.promotionalPrice ?? prod.price;
                    return (
                      <div
                        key={prod.id}
                        className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="font-serif-editorial text-base text-[#393331] leading-snug">
                            {prod.name}
                          </div>
                          <div className="text-xs text-[#393331]/70 tabular-nums">
                            {formatCurrencyBRL(price)} un.
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQuantity(prod.id, item.quantity - 1)}
                              className="w-6 h-6 border border-[#D8C9BD] text-xs"
                            >
                              −
                            </button>
                            <span className="text-xs tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCartQuantity(
                                  prod.id,
                                  Math.min(prod.stock, item.quantity + 1)
                                )
                              }
                              className="w-6 h-6 border border-[#D8C9BD] text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="text-xs font-semibold text-[#393331] tabular-nums">
                            {formatCurrencyBRL(price * item.quantity)}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(prod.id)}
                            className="text-[11px] text-[#985858] underline"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#D8C9BD] space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-[#393331] tabular-nums">
                  <span>Subtotal</span>
                  <span>{formatCurrencyBRL(cartSubtotal)}</span>
                </div>
                <p className="text-[11px] text-[#393331]/70">
                  Frete e cupons calculados na sacola completa ou no checkout.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBagDrawerOpen(false);
                      navigateTo('carrinho');
                    }}
                    className="py-3 px-4 border border-[#393331] text-xs font-medium text-[#393331] hover:bg-[#393331] hover:text-white transition-colors"
                  >
                    Ver Sacola
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBagDrawerOpen(false);
                      trackAvidoreEvent('begin_checkout', { value: cartSubtotal });
                      navigateTo('checkout');
                    }}
                    className="py-3 px-4 bg-[#985858] text-white text-xs font-medium hover:bg-[#7d4545] transition-colors"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP CHANNEL (Com mensagem contextual automática) */}
      <a
        href={floatingWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAvidoreEvent('contact_whatsapp', { context: `floating_${activePage}` })}
        className="fixed bottom-5 right-5 z-20 px-4 py-3 bg-[#393331] text-[#F6F1EB] border border-[#D8C9BD]/40 shadow-md hover:bg-[#985858] hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
        aria-label="Atendimento via WhatsApp Avidore"
      >
        <MessageCircle className="w-4 h-4 text-[#D8C9BD]" />
        <span>Atendimento WhatsApp</span>
      </a>

      {/* 11. RODAPÉ COMPLETO E EDITORIAL */}
      <footer className="bg-[#393331] text-[#F6F1EB] border-t border-[#D8C9BD]/30 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Coluna 1: Marca */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <AvidoreMonogram className="w-8 h-8" color="#D8C9BD" />
                <span className="font-serif-editorial text-2xl tracking-[0.22em] text-[#FFFFFF]">
                  AVIDORE
                </span>
              </div>
              <p className="text-xs text-[#D8C9BD]/85 leading-relaxed max-w-sm">
                Laboratório olfativo e cosmético. Experiências e produtos para ambientes, linha de cuidados pessoais,
                marketing olfativo corporativo e presentes personalizados.
              </p>
              <div className="text-xs font-serif-editorial italic text-[#D8C9BD] text-base">
                “Sinta antes de escolher.”
              </div>
            </div>

            {/* Coluna 2: Loja e Coleções */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <div className="uppercase tracking-[0.16em] text-[#D8C9BD] font-semibold">
                Loja &amp; Coleções
              </div>
              <ul className="space-y-2 text-[#F6F1EB]/80">
                <li>
                  <button type="button" onClick={() => navigateTo('loja')} className="hover:text-white">
                    Catálogo Completo da Loja
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('colecoes')} className="hover:text-white">
                    As 10 Coleções Olfativas
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('cuidados-pessoais')} className="hover:text-white">
                    Linha de Cuidados Pessoais
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('carrinho')} className="hover:text-white">
                    Sacola de Compras
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('minha-conta')} className="hover:text-white">
                    Minha Conta e Pedidos
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Soluções Corporativas & Experiência */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <div className="uppercase tracking-[0.16em] text-[#D8C9BD] font-semibold">
                Empresas &amp; Laboratório
              </div>
              <ul className="space-y-2 text-[#F6F1EB]/80">
                <li>
                  <button type="button" onClick={() => navigateTo('marketing-olfativo')} className="hover:text-white">
                    Marketing Olfativo para Empresas
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('presentes-corporativos')} className="hover:text-white">
                    Presentes Corporativos
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('experiencia')} className="hover:text-white">
                    Experiência no Laboratório
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('sobre')} className="hover:text-white">
                    Sobre a Avidore
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('contato')} className="hover:text-white">
                    Canais de Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Atuação Regional & Governança */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <div className="uppercase tracking-[0.16em] text-[#D8C9BD] font-semibold">
                Região &amp; Políticas
              </div>
              <p className="text-[#F6F1EB]/75 leading-relaxed">
                Atuação regional dedicada em <strong>Astorga, Maringá e Londrina (PR)</strong>, com envio para todo o
                Brasil.
              </p>
              <ul className="space-y-2 text-[#F6F1EB]/80 pt-1">
                <li>
                  <button type="button" onClick={() => navigateTo('politicas')} className="hover:text-white">
                    Políticas, LGPD e ANVISA
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('admin')} className="hover:text-white">
                    Painel Administrativo
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D8C9BD]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#D8C9BD]/70">
            <div>
              © {new Date().getFullYear()} Avidore Laboratório Olfativo e Cosmético Ltda. Todos os direitos reservados.
            </div>
            <div>
              Astorga · Maringá · Londrina — Paraná, Brasil
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
