import React, { useState } from 'react';
import {
  CartItem,
  CommercialLead,
  Coupon,
  OlfactoryCollection,
  Order,
  Product,
  ShippingOption,
  StoreSettings,
} from '../types/avidore';
import {
  buildWhatsAppLink,
  formatCurrencyBRL,
  trackAvidoreEvent,
} from '../utils/analyticsAndWhatsapp';
import { ProductStudioVisual } from './BrandVisuals';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  Check,
  Package,
  Settings,
  Plus,
  Edit3,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

/**
 * 11. CARRINHO / SACOLA DE COMPRAS (Página dedicada)
 */
export const CarrinhoView: React.FC<{
  cart: CartItem[];
  products: Product[];
  appliedCoupon: Coupon | null;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  cep: string;
  onSetCep: (cep: string) => void;
  onCalculateShipping: (cep: string) => Promise<void>;
  onSelectShipping: (option: ShippingOption) => void;
  onApplyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  onRemoveCoupon: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
  onSelectProduct: (product: Product) => void;
}> = ({
  cart,
  products,
  appliedCoupon,
  shippingOptions,
  selectedShipping,
  cep,
  onSetCep,
  onCalculateShipping,
  onSelectShipping,
  onApplyCoupon,
  onRemoveCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
  onSelectProduct,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const detailedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const unitPrice = product.promotionalPrice ?? product.price;
      return {
        ...item,
        product,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = detailedItems.reduce((acc, item) => acc + item.lineTotal, 0);

  const discount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? (subtotal * appliedCoupon.discountValue) / 100
      : Math.min(subtotal, appliedCoupon.discountValue)
    : 0;

  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await onApplyCoupon(couponInput.trim());
    setCouponFeedback({ ok: res.ok, text: res.message });
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim()) return;
    setCalcLoading(true);
    try {
      await onCalculateShipping(cep);
    } finally {
      setCalcLoading(false);
    }
  };

  if (detailedItems.length === 0) {
    return (
      <div className="max-w-[900px] mx-auto px-6 py-16 text-center space-y-6">
        <div className="w-14 h-14 mx-auto bg-[#FFFFFF] border border-[#D8C9BD] flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-[#985858]" />
        </div>
        <h1 className="font-serif-editorial text-4xl text-[#393331]">Sua sacola de compras está vazia</h1>
        <p className="text-sm text-[#393331]/75 max-w-md mx-auto">
          Explore nossas 10 Coleções Olfativas ou a Linha de Cuidados Pessoais Avidore para iniciar sua experiência.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-7 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors"
        >
          Explorar a Loja Avidore
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14 space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8C9BD]/80 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-[#985858]">Sacola de Compras</span>
          <h1 className="font-serif-editorial text-4xl text-[#393331]">Seus produtos selecionados</h1>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="text-xs font-medium text-[#985858] hover:underline"
        >
          ← Continuar comprando
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Lista de Itens */}
        <div className="lg:col-span-7 space-y-4">
          {detailedItems.map(({ product, quantity, unitPrice, lineTotal }) => (
            <div
              key={product.id}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="w-20 h-24 shrink-0 border border-[#D8C9BD]/60 overflow-hidden"
                >
                  <ProductStudioVisual
                    shape={product.visualStyle.bottleShape}
                    accentColor={product.visualStyle.accentColor}
                    surfaceTone={product.visualStyle.surfaceTone}
                    className="w-full h-full"
                  />
                </button>
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#985858]">SKU: {product.sku}</div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="font-serif-editorial text-xl text-[#393331] hover:text-[#985858] text-left"
                  >
                    {product.name}
                  </button>
                  <div className="text-xs text-[#393331]/70 tabular-nums">
                    Valor unitário: {formatCurrencyBRL(unitPrice)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#D8C9BD]/40">
                <div className="flex items-center border border-[#D8C9BD] bg-[#F6F1EB]/60">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                    className="px-3 py-1.5 text-xs font-medium text-[#393331]"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 text-xs font-medium text-[#393331] tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(product.id, Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-xs font-medium text-[#393331]"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm font-semibold text-[#393331] tabular-nums min-w-[90px] text-right">
                  {formatCurrencyBRL(lineTotal)}
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(product.id)}
                  className="text-[#393331]/50 hover:text-[#985858] transition-colors p-1"
                  aria-label="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo, Frete e Cupom */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-7 space-y-6">
          <h2 className="font-serif-editorial text-2xl text-[#393331] border-b border-[#D8C9BD]/60 pb-3">
            Resumo do Pedido
          </h2>

          {/* Simulador de Frete */}
          <div className="space-y-3 border-b border-[#D8C9BD]/60 pb-5">
            <label className="block text-xs font-medium text-[#393331]">
              Cálculo de frete e prazo de entrega (CEP)
            </label>
            <form onSubmit={handleShippingSubmit} className="flex gap-2">
              <input
                type="text"
                value={cep}
                onChange={(e) => onSetCep(e.target.value)}
                placeholder="Ex.: 87020-025 (Maringá) ou 86730-000 (Astorga)"
                className="flex-1 px-3 py-2 bg-[#F6F1EB]/70 border border-[#D8C9BD] text-xs text-[#393331] focus:outline-none focus:border-[#985858] tabular-nums"
              />
              <button
                type="submit"
                disabled={calcLoading}
                className="px-4 py-2 bg-[#393331] text-white text-xs font-medium"
              >
                {calcLoading ? '...' : 'Calcular'}
              </button>
            </form>

            {shippingOptions.length > 0 && (
              <div className="space-y-2 pt-1">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`p-3 border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      selectedShipping?.id === opt.id
                        ? 'border-[#985858] bg-[#F6F1EB]'
                        : 'border-[#D8C9BD]/70 bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shipping_option"
                        checked={selectedShipping?.id === opt.id}
                        onChange={() => onSelectShipping(opt)}
                        className="accent-[#985858]"
                      />
                      <div>
                        <div className="font-medium text-[#393331]">{opt.serviceName}</div>
                        <div className="text-[11px] text-[#393331]/70">{opt.estimatedDays}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-[#393331] tabular-nums">
                      {opt.price === 0 ? 'Grátis' : formatCurrencyBRL(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Cupom de Desconto */}
          <div className="space-y-2.5 border-b border-[#D8C9BD]/60 pb-5">
            <label className="block text-xs font-medium text-[#393331]">
              Cupom de cortesia (Ex.: BEMVINDO10 ou ROTA25)
            </label>
            {appliedCoupon ? (
              <div className="p-3 bg-[#F6F1EB] border border-[#985858] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#985858]">{appliedCoupon.code}</span>
                  <span className="text-[#393331]/75 ml-2">— {appliedCoupon.description}</span>
                </div>
                <button
                  type="button"
                  onClick={onRemoveCoupon}
                  className="text-xs text-[#985858] underline ml-2"
                >
                  Remover
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Código do cupom"
                  className="flex-1 px-3 py-2 bg-[#F6F1EB]/70 border border-[#D8C9BD] text-xs text-[#393331] uppercase focus:outline-none focus:border-[#985858]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-[#393331] text-[#393331] text-xs font-medium hover:bg-[#393331] hover:text-white transition-colors"
                >
                  Aplicar
                </button>
              </form>
            )}
            {couponFeedback && (
              <p className={`text-xs ${couponFeedback.ok ? 'text-[#393331]' : 'text-[#985858]'}`}>
                {couponFeedback.text}
              </p>
            )}
          </div>

          {/* Totais */}
          <div className="space-y-2.5 text-sm tabular-nums">
            <div className="flex justify-between text-[#393331]/80">
              <span>Subtotal ({detailedItems.reduce((a, b) => a + b.quantity, 0)} itens)</span>
              <span>{formatCurrencyBRL(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#985858]">
                <span>Desconto ({appliedCoupon?.code})</span>
                <span>− {formatCurrencyBRL(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#393331]/80">
              <span>Frete ({selectedShipping ? selectedShipping.serviceName : 'A calcular'})</span>
              <span>
                {selectedShipping
                  ? selectedShipping.price === 0
                    ? 'Grátis'
                    : formatCurrencyBRL(selectedShipping.price)
                  : 'Informe o CEP'}
              </span>
            </div>
            <div className="pt-3 border-t border-[#D8C9BD] flex justify-between text-lg font-semibold text-[#393331]">
              <span>Valor Total</span>
              <span>{formatCurrencyBRL(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              trackAvidoreEvent('begin_checkout', { value: total, item_count: detailedItems.length });
              onProceedToCheckout();
            }}
            className="w-full py-3.5 px-6 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors flex items-center justify-center gap-2"
          >
            <span>Prosseguir para checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 12. CHECKOUT PROFISSIONAL E SEGURO
 */
export const CheckoutView: React.FC<{
  cart: CartItem[];
  products: Product[];
  appliedCoupon: Coupon | null;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  cep: string;
  settings: StoreSettings;
  onSetCep: (cep: string) => void;
  onCalculateShipping: (cep: string) => Promise<void>;
  onSelectShipping: (option: ShippingOption) => void;
  onApplyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  onPlaceOrder: (orderPayload: {
    customer: Order['customer'];
    shippingAddress: Order['shippingAddress'];
    shippingMethod: ShippingOption;
    paymentMethod: Order['paymentMethod'];
  }) => Promise<Order>;
  onBackToCart: () => void;
  onGoToAccount: () => void;
}> = ({
  cart,
  products,
  appliedCoupon,
  shippingOptions,
  selectedShipping,
  cep,
  settings,
  onSetCep,
  onCalculateShipping,
  onSelectShipping,
  onPlaceOrder,
  onBackToCart,
  onGoToAccount,
}) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    whatsapp: '',
    document: '',
  });
  const [address, setAddress] = useState({
    cep: cep || '87020-025',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'Maringá',
    state: 'PR',
  });
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'checkout_externo'>('pix');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState('');

  const detailedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const unitPrice = product.promotionalPrice ?? product.price;
      return { ...item, product, unitPrice, lineTotal: unitPrice * item.quantity };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = detailedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const discount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? (subtotal * appliedCoupon.discountValue) / 100
      : Math.min(subtotal, appliedCoupon.discountValue)
    : 0;
  const activeShipping: ShippingOption = selectedShipping ||
    shippingOptions[0] || {
      id: 'rota-norte-pr',
      carrier: 'Logística Rota Norte PR',
      serviceName: 'Entrega Expressa Eixo Astorga · Maringá · Londrina',
      estimatedDays: '1 a 2 dias úteis',
      price: subtotal >= settings.ecommercePlatformIntegration.freeShippingThreshold ? 0 : 14.9,
      regionNote: 'Norte do Paraná',
    };
  const total = Math.max(0, subtotal - discount + activeShipping.price);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.whatsapp.trim() || !customer.document.trim()) {
      setFormError('Por favor, preencha todos os dados de identificação do comprador.');
      return;
    }
    if (!address.street.trim() || !address.number.trim() || !address.city.trim()) {
      setFormError('Por favor, informe o endereço completo para entrega ou referência.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const created = await onPlaceOrder({
        customer,
        shippingAddress: { ...address, cep: address.cep || cep },
        shippingMethod: activeShipping,
        paymentMethod,
      });
      trackAvidoreEvent('purchase', {
        transaction_id: created.orderNumber,
        value: created.total,
        currency: 'BRL',
        payment_method: created.paymentMethod,
      });
      setConfirmedOrder(created);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    const orderWaUrl = buildWhatsAppLink(
      settings.whatsappNumber,
      'pedido',
      `${confirmedOrder.orderNumber} (${formatCurrencyBRL(confirmedOrder.total)})`
    );

    return (
      <div className="max-w-[900px] mx-auto px-6 py-12 space-y-8 pb-20">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD] p-8 lg:p-12 space-y-6">
          <div className="flex items-center gap-3 text-[#985858] text-xs uppercase tracking-[0.18em] font-medium">
            <Check className="w-4 h-4" />
            <span>Pedido Registrado · Protocolo {confirmedOrder.orderNumber}</span>
          </div>
          <h1 className="font-serif-editorial text-4xl text-[#393331]">
            Obrigado por escolher a Avidore, {confirmedOrder.customer.name}.
          </h1>
          <p className="text-sm text-[#393331]/80 leading-relaxed">
            Seu pedido <strong>{confirmedOrder.orderNumber}</strong> foi registrado com segurança. Em conformidade com
            as boas práticas de segurança digital, o processamento financeiro final ocorre via gateway homologado
            (Pix Banco Central / Nuvemshop / Shopify) sem armazenamento de dados sensíveis de cartão.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F6F1EB] border border-[#D8C9BD]/70 p-6 text-xs text-[#393331]/85">
            <div className="space-y-1.5">
              <div className="font-semibold text-[#393331] uppercase tracking-wider">Dados de Entrega</div>
              <p>
                {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.number}{' '}
                {confirmedOrder.shippingAddress.complement}
              </p>
              <p>
                {confirmedOrder.shippingAddress.neighborhood} · {confirmedOrder.shippingAddress.city} –{' '}
                {confirmedOrder.shippingAddress.state} (CEP {confirmedOrder.shippingAddress.cep})
              </p>
              <p className="pt-1 text-[#985858] font-medium">
                Modalidade: {confirmedOrder.shippingMethod.serviceName} ({confirmedOrder.shippingMethod.estimatedDays})
              </p>
            </div>
            <div className="space-y-1.5 tabular-nums">
              <div className="font-semibold text-[#393331] uppercase tracking-wider">Resumo Financeiro</div>
              <p>Subtotal: {formatCurrencyBRL(confirmedOrder.subtotal)}</p>
              {confirmedOrder.discount > 0 && <p>Desconto: − {formatCurrencyBRL(confirmedOrder.discount)}</p>}
              <p>Frete: {formatCurrencyBRL(confirmedOrder.shippingCost)}</p>
              <p className="text-sm font-semibold text-[#393331] pt-1">
                Total do Pedido: {formatCurrencyBRL(confirmedOrder.total)}
              </p>
              <p>
                Método escolhido:{' '}
                {confirmedOrder.paymentMethod === 'pix'
                  ? 'Pix (Chave / QR Code Institucional)'
                  : confirmedOrder.paymentMethod === 'cartao_credito'
                  ? 'Cartão de Crédito via Gateway Seguro'
                  : 'Checkout Integrado Nuvemshop / Shopify'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={orderWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#985858] text-white text-xs font-medium hover:bg-[#7d4545] inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Receber link de pagamento / acompanhamento via WhatsApp
            </a>
            <button
              type="button"
              onClick={onGoToAccount}
              className="px-6 py-3 border border-[#393331] text-[#393331] text-xs font-medium hover:bg-[#393331] hover:text-white transition-colors"
            >
              Ver meus pedidos em Minha Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14 space-y-10 pb-20">
      <div className="flex items-center justify-between border-b border-[#D8C9BD]/80 pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-[#985858]">Finalização de Compra</span>
          <h1 className="font-serif-editorial text-4xl text-[#393331]">Checkout Seguro Avidore</h1>
        </div>
        <button
          type="button"
          onClick={onBackToCart}
          className="text-xs font-medium text-[#393331] hover:text-[#985858]"
        >
          ← Voltar à sacola
        </button>
      </div>

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8">
          {formError && (
            <div className="p-4 bg-[#985858]/10 border border-[#985858] text-xs text-[#985858]">{formError}</div>
          )}

          {/* Etapa 1: Identificação */}
          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-7 space-y-5">
            <h2 className="font-serif-editorial text-2xl text-[#393331]">01. Identificação e Dados Pessoais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">Nome completo / Razão Social *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">CPF ou CNPJ *</label>
                <input
                  type="text"
                  required
                  value={customer.document}
                  onChange={(e) => setCustomer({ ...customer, document: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331] tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">E-mail para confirmação *</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">WhatsApp com DDD *</label>
                <input
                  type="tel"
                  required
                  value={customer.whatsapp}
                  onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                  placeholder="(44) 99999-0000"
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331] tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Etapa 2: Endereço e Modalidade de Frete */}
          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-7 space-y-5">
            <h2 className="font-serif-editorial text-2xl text-[#393331]">02. Endereço de Entrega e Logística</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">CEP *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={address.cep}
                    onChange={(e) => {
                      setAddress({ ...address, cep: e.target.value });
                      onSetCep(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331] tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => onCalculateShipping(address.cep)}
                    className="px-3 py-2 bg-[#393331] text-white text-xs"
                  >
                    OK
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#393331] mb-1">Logradouro (Rua / Avenida) *</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">Número *</label>
                <input
                  type="text"
                  required
                  value={address.number}
                  onChange={(e) => setAddress({ ...address, number: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#393331] mb-1">Complemento / Sala / Clínica</label>
                <input
                  type="text"
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1">UF *</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-xs text-[#393331]"
                />
              </div>
            </div>

            {/* Seleção de Frete */}
            {shippingOptions.length > 0 && (
              <div className="pt-3 space-y-2">
                <div className="text-xs font-medium text-[#393331]">Modalidade de envio selecionada:</div>
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`p-3 border flex items-center justify-between text-xs cursor-pointer ${
                      activeShipping.id === opt.id ? 'border-[#985858] bg-[#F6F1EB]' : 'border-[#D8C9BD]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="checkout_shipping"
                        checked={activeShipping.id === opt.id}
                        onChange={() => onSelectShipping(opt)}
                        className="accent-[#985858]"
                      />
                      <div>
                        <div className="font-medium text-[#393331]">{opt.serviceName}</div>
                        <div className="text-[#393331]/70">{opt.estimatedDays}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-[#393331] tabular-nums">
                      {opt.price === 0 ? 'Grátis' : formatCurrencyBRL(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Etapa 3: Método de Pagamento e Integração */}
          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-7 space-y-5">
            <h2 className="font-serif-editorial text-2xl text-[#393331]">
              03. Método de Pagamento (Integração Transparente)
            </h2>
            <p className="text-xs text-[#393331]/75 leading-relaxed">
              A estrutura da Avidore opera integrada a plataformas especializadas no Brasil (Nuvemshop / Shopify) e
              gateways homologados pelo Banco Central. Nenhum dado de cartão é armazenado neste navegador.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'pix',
                  title: 'Pix Banco Central (Aprovação Prioritária)',
                  desc: 'Geração de código Pix oficial após o registro do pedido, sem tarifas adicionais.',
                },
                {
                  id: 'cartao_credito',
                  title: 'Cartão de Crédito (Link Seguro Homologado)',
                  desc: 'Processamento criptografado em até 6x via gateway brasileiro (Mercado Pago / Pagar.me / Nuvem Pago).',
                },
                {
                  id: 'checkout_externo',
                  title: 'Finalizar via Plataforma E-commerce Integrada (Nuvemshop / Shopify)',
                  desc: 'Sincroniza os itens da sacola diretamente com o checkout certificado da plataforma.',
                },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`p-4 border flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === m.id ? 'border-[#985858] bg-[#F6F1EB]' : 'border-[#D8C9BD]/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as typeof paymentMethod)}
                    className="mt-1 accent-[#985858]"
                  />
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-[#393331]">{m.title}</div>
                    <div className="text-[#393331]/75">{m.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Revisão Final */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-7 space-y-6">
          <h2 className="font-serif-editorial text-2xl text-[#393331] border-b border-[#D8C9BD]/60 pb-3">
            Revisão do Pedido
          </h2>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {detailedItems.map(({ product, quantity, lineTotal }) => (
              <div key={product.id} className="flex items-center justify-between text-xs border-b border-[#D8C9BD]/40 pb-2.5">
                <div>
                  <div className="font-medium text-[#393331]">{product.name}</div>
                  <div className="text-[#393331]/65">Qtd: {quantity} · SKU: {product.sku}</div>
                </div>
                <div className="font-medium text-[#393331] tabular-nums">{formatCurrencyBRL(lineTotal)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm tabular-nums pt-2 border-t border-[#D8C9BD]/60">
            <div className="flex justify-between text-[#393331]/80">
              <span>Subtotal</span>
              <span>{formatCurrencyBRL(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#985858]">
                <span>Cupom ({appliedCoupon?.code})</span>
                <span>− {formatCurrencyBRL(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#393331]/80">
              <span>Envio ({activeShipping.serviceName})</span>
              <span>{activeShipping.price === 0 ? 'Grátis' : formatCurrencyBRL(activeShipping.price)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-[#393331] pt-3 border-t border-[#D8C9BD]">
              <span>Total a pagar</span>
              <span>{formatCurrencyBRL(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Confirmando pedido...' : 'Confirmar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * 13. MINHA CONTA E HISTÓRICO DE PEDIDOS
 */
export const MinhaContaView: React.FC<{
  orders: Order[];
  settings: StoreSettings;
  onNavigate: (page: string) => void;
}> = ({ orders, settings, onNavigate }) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14 space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D8C9BD]/80 pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[#985858]">Área do Cliente</span>
          <h1 className="font-serif-editorial text-4xl text-[#393331]">Minha Conta e Histórico de Pedidos</h1>
          <p className="text-xs text-[#393331]/75">
            Consulte o status de pagamento, separação, envio e código de rastreio dos seus pedidos na Avidore.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="block text-xs font-medium text-[#393331] mb-1">
            Filtrar por número do pedido ou e-mail:
          </label>
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Ex.: AVD-2026-1001 ou e-mail"
            className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#D8C9BD] text-xs text-[#393331]"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-10 text-center space-y-4">
          <p className="font-serif-editorial text-2xl text-[#393331]">Nenhum pedido localizado.</p>
          <button
            type="button"
            onClick={() => onNavigate('loja')}
            className="px-6 py-2.5 bg-[#985858] text-white text-xs font-medium"
          >
            Ir para a Loja
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const waOrderUrl = buildWhatsAppLink(
              settings.whatsappNumber,
              'pedido',
              order.orderNumber
            );
            return (
              <div key={order.id} className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-6 lg:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8C9BD]/50 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#985858] font-semibold">
                      <span>Pedido {order.orderNumber}</span>
                      <span>·</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="text-sm font-medium text-[#393331]">
                      Cliente: {order.customer.name} ({order.customer.email})
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <span className="text-[#393331]/65">Pagamento: </span>
                      <strong className="uppercase text-[#393331]">
                        {order.paymentStatus.replace('_', ' ')}
                      </strong>
                    </div>
                    <span>·</span>
                    <div>
                      <span className="text-[#393331]/65">Logística: </span>
                      <strong className="uppercase text-[#985858]">
                        {order.fulfillmentStatus.replace('_', ' ')}
                      </strong>
                    </div>
                    {order.trackingCode && (
                      <>
                        <span>·</span>
                        <div className="tabular-nums">
                          <span className="text-[#393331]/65">Rastreio: </span>
                          <strong className="text-[#393331]">{order.trackingCode}</strong>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  <div className="lg:col-span-7 space-y-2">
                    <div className="font-semibold text-[#393331] uppercase tracking-wider">Itens do Pedido</div>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-1 border-b border-[#D8C9BD]/30 tabular-nums">
                        <span>
                          {item.quantity}x {item.productName} ({item.sku})
                        </span>
                        <span className="font-medium">{formatCurrencyBRL(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-5 bg-[#F6F1EB] p-4 border border-[#D8C9BD]/60 flex flex-col justify-between space-y-3">
                    <div className="space-y-1 text-[#393331]/80">
                      <div>
                        <strong className="text-[#393331]">Entrega: </strong>
                        {order.shippingAddress.city} – {order.shippingAddress.state} ({order.shippingMethod.serviceName})
                      </div>
                      <div className="tabular-nums">
                        <strong className="text-[#393331]">Total: </strong>
                        {formatCurrencyBRL(order.total)}
                      </div>
                    </div>
                    <a
                      href={waOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#985858] hover:underline inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Falar sobre este pedido no WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * PAINEL ADMINISTRATIVO REAL (Gestão de Catálogo, Coleções, Estoque, Cupons, Pedidos, Leads B2B e Integrações)
 */
export const PainelAdminView: React.FC<{
  products: Product[];
  collections: OlfactoryCollection[];
  coupons: Coupon[];
  orders: Order[];
  leads: CommercialLead[];
  settings: StoreSettings;
  onSaveProduct: (product: Product) => Promise<void>;
  onSaveCollection: (collection: OlfactoryCollection) => Promise<void>;
  onCreateCoupon: (coupon: Omit<Coupon, 'active'>) => Promise<void>;
  onUpdateOrder: (id: string, patch: Partial<Order>) => Promise<void>;
  onUpdateLead: (id: string, status: CommercialLead['status']) => Promise<void>;
  onSaveSettings: (settings: StoreSettings) => Promise<void>;
}> = ({
  products,
  collections,
  coupons,
  orders,
  leads,
  settings,
  onSaveProduct,
  onSaveCollection,
  onCreateCoupon,
  onUpdateOrder,
  onUpdateLead,
  onSaveSettings,
}) => {
  const [activeSection, setActiveSection] = useState<
    'produtos' | 'colecoes' | 'pedidos' | 'leads' | 'cupons' | 'integracoes'
  >('produtos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCollection, setEditingCollection] = useState<OlfactoryCollection | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderValue: 100,
  });
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [saveToast, setSaveToast] = useState('');

  const notify = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3500);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-8 pb-20">
      <div className="border-b border-[#D8C9BD] pb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
            Gestão Operacional e Comercial · Persistência em Banco de Dados
          </span>
          <h1 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
            Painel Administrativo Avidore
          </h1>
        </div>
        {saveToast && (
          <div className="px-4 py-2 bg-[#393331] text-white text-xs font-medium">{saveToast}</div>
        )}
      </div>

      {/* Menu do Painel */}
      <div className="flex flex-wrap gap-2 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-2">
        {[
          { id: 'produtos', label: `Produtos e Estoque (${products.length})` },
          { id: 'colecoes', label: `Coleções Olfativas (${collections.length})` },
          { id: 'pedidos', label: `Pedidos e Logística (${orders.length})` },
          { id: 'leads', label: `Oportunidades B2B & Visitas (${leads.length})` },
          { id: 'cupons', label: `Cupons (${coupons.length})` },
          { id: 'integracoes', label: 'E-commerce (Nuvemshop/Shopify) & SEO' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeSection === tab.id
                ? 'bg-[#985858] text-white'
                : 'text-[#393331]/80 hover:bg-[#F6F1EB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ABA 1: PRODUTOS E ESTOQUE */}
      {activeSection === 'produtos' && (
        <div className="space-y-6">
          {editingProduct && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onSaveProduct(editingProduct);
                setEditingProduct(null);
                notify('Produto atualizado com sucesso no catálogo!');
              }}
              className="bg-[#FFFFFF] border-2 border-[#985858] p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#D8C9BD] pb-3">
                <h2 className="font-serif-editorial text-2xl text-[#393331]">
                  Editando: {editingProduct.name} ({editingProduct.sku})
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-[#393331]/70 underline"
                >
                  Cancelar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Nome Oficial do Produto</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Estoque (un.)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Volume Oficial</label>
                  <input
                    type="text"
                    value={editingProduct.volumePlaceholder}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, volumePlaceholder: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Status Regulatório (ANVISA)</label>
                  <select
                    value={editingProduct.regulatoryInfo.status}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        regulatoryInfo: {
                          ...editingProduct.regulatoryInfo,
                          status: e.target.value as 'publicado' | 'rascunho_anvisa',
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  >
                    <option value="rascunho_anvisa">Rascunho — Aguardando Notificação Oficial</option>
                    <option value="publicado">Publicado — Regularizado junto à Anvisa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Nº Processo / Notificação ANVISA</label>
                  <input
                    type="text"
                    value={editingProduct.regulatoryInfo.anvisaProcessPlaceholder}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        regulatoryInfo: {
                          ...editingProduct.regulatoryInfo,
                          anvisaProcessPlaceholder: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium mb-1">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={editingProduct.fullDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, fullDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#985858] text-white text-xs font-medium"
              >
                Salvar Alterações no Produto
              </button>
            </form>
          )}

          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8C9BD] bg-[#F6F1EB] text-[#393331]">
                  <th className="p-3.5 font-semibold">SKU</th>
                  <th className="p-3.5 font-semibold">Produto</th>
                  <th className="p-3.5 font-semibold">Linha</th>
                  <th className="p-3.5 font-semibold">Preço</th>
                  <th className="p-3.5 font-semibold">Estoque</th>
                  <th className="p-3.5 font-semibold">Status Anvisa</th>
                  <th className="p-3.5 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C9BD]/50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F6F1EB]/40">
                    <td className="p-3.5 tabular-nums text-[#393331]/70">{p.sku}</td>
                    <td className="p-3.5 font-medium text-[#393331]">{p.name}</td>
                    <td className="p-3.5">
                      {p.line === 'olfativa' ? 'Coleção Olfativa' : 'Cuidados Pessoais'}
                    </td>
                    <td className="p-3.5 tabular-nums font-semibold">
                      {formatCurrencyBRL(p.promotionalPrice ?? p.price)}
                    </td>
                    <td className="p-3.5 tabular-nums">{p.stock} un.</td>
                    <td className="p-3.5">
                      {p.regulatoryInfo.status === 'publicado' ? 'Publicado' : 'Em Homologação'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="text-[#985858] font-medium hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: COLEÇÕES OLFATIVAS */}
      {activeSection === 'colecoes' && (
        <div className="space-y-6">
          {editingCollection && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onSaveCollection(editingCollection);
                setEditingCollection(null);
                notify('Coleção Olfativa atualizada!');
              }}
              className="bg-[#FFFFFF] border-2 border-[#985858] p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#D8C9BD] pb-3">
                <h2 className="font-serif-editorial text-2xl text-[#393331]">
                  Editar {editingCollection.code}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingCollection(null)}
                  className="text-xs underline"
                >
                  Fechar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nome Oficial da Coleção</label>
                  <input
                    type="text"
                    value={editingCollection.name}
                    onChange={(e) =>
                      setEditingCollection({ ...editingCollection, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Atmosfera / Subtítulo</label>
                  <input
                    type="text"
                    value={editingCollection.subtitle}
                    onChange={(e) =>
                      setEditingCollection({ ...editingCollection, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1">Notas de Saída (Topo)</label>
                  <input
                    type="text"
                    value={editingCollection.topNotesPlaceholder}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        topNotesPlaceholder: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Notas de Corpo (Coração)</label>
                  <input
                    type="text"
                    value={editingCollection.heartNotesPlaceholder}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        heartNotesPlaceholder: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Notas de Fundo (Base)</label>
                  <input
                    type="text"
                    value={editingCollection.baseNotesPlaceholder}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        baseNotesPlaceholder: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#985858] text-white text-xs font-medium"
              >
                Salvar Coleção
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map((col) => (
              <div
                key={col.id}
                className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="text-[#985858] font-semibold">{col.code}</div>
                  <div className="font-serif-editorial text-xl text-[#393331]">{col.name}</div>
                  <p className="text-[#393331]/70">{col.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCollection(col)}
                  className="px-3 py-1.5 border border-[#D8C9BD] text-xs font-medium text-[#985858]"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: PEDIDOS E LOGÍSTICA */}
      {activeSection === 'pedidos' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs"
            >
              <div className="space-y-1">
                <div className="font-semibold text-[#985858]">
                  {ord.orderNumber} · {new Date(ord.createdAt).toLocaleString('pt-BR')}
                </div>
                <div className="text-sm font-medium text-[#393331]">
                  {ord.customer.name} — {ord.customer.whatsapp} ({ord.shippingAddress.city}/{ord.shippingAddress.state})
                </div>
                <div className="text-[#393331]/75 tabular-nums">
                  Total: <strong>{formatCurrencyBRL(ord.total)}</strong> · Frete: {ord.shippingMethod.serviceName}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] text-[#393331]/65 mb-1">Pagamento</label>
                  <select
                    value={ord.paymentStatus}
                    onChange={async (e) => {
                      await onUpdateOrder(ord.id, {
                        paymentStatus: e.target.value as Order['paymentStatus'],
                      });
                      notify(`Pedido ${ord.orderNumber} atualizado.`);
                    }}
                    className="px-2.5 py-1.5 bg-[#F6F1EB] border border-[#D8C9BD]"
                  >
                    <option value="aguardando_pagamento">Aguardando Pagamento</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="pago">Pago</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#393331]/65 mb-1">Status de Envio</label>
                  <select
                    value={ord.fulfillmentStatus}
                    onChange={async (e) => {
                      await onUpdateOrder(ord.id, {
                        fulfillmentStatus: e.target.value as Order['fulfillmentStatus'],
                      });
                      notify(`Envio do pedido ${ord.orderNumber} atualizado.`);
                    }}
                    className="px-2.5 py-1.5 bg-[#F6F1EB] border border-[#D8C9BD]"
                  >
                    <option value="recebido">Recebido</option>
                    <option value="em_separacao">Em Separação</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#393331]/65 mb-1">Código de Rastreio</label>
                  <input
                    type="text"
                    defaultValue={ord.trackingCode || ''}
                    placeholder="Ex.: BR123456789"
                    onBlur={async (e) => {
                      if (e.target.value !== (ord.trackingCode || '')) {
                        await onUpdateOrder(ord.id, { trackingCode: e.target.value });
                        notify('Código de rastreio salvo!');
                      }
                    }}
                    className="px-2.5 py-1.5 bg-[#F6F1EB] border border-[#D8C9BD] tabular-nums"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 4: OPORTUNIDADES COMERCIAIS B2B & AGENDAMENTOS */}
      {activeSection === 'leads' && (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-6 flex flex-col lg:flex-row justify-between gap-6 text-xs"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="text-[#985858] font-semibold uppercase tracking-wider">
                  {lead.type.replace('_', ' ')} · {new Date(lead.createdAt).toLocaleString('pt-BR')}
                </div>
                <div className="text-sm font-medium text-[#393331]">
                  {lead.name} {lead.company ? `— ${lead.company}` : ''} ({lead.whatsapp} · {lead.email})
                </div>
                {lead.segment && <div>Segmento: {lead.segment} · Cidade: {lead.city}</div>}
                {lead.desiredQuantity && (
                  <div>
                    Quantidade: {lead.desiredQuantity} · Ocasião: {lead.occasion} · Personalização:{' '}
                    {lead.customizationNeed}
                  </div>
                )}
                {lead.preferredDateOrShift && <div>Preferência de visita: {lead.preferredDateOrShift}</div>}
                <p className="text-[#393331]/80 bg-[#F6F1EB] p-3 border border-[#D8C9BD]/50">
                  {lead.message || 'Sem mensagem adicional.'}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start">
                <select
                  value={lead.status}
                  onChange={async (e) => {
                    await onUpdateLead(lead.id, e.target.value as CommercialLead['status']);
                    notify('Status do atendimento atualizado!');
                  }}
                  className="px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                >
                  <option value="novo">Novo Contato</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="proposta_enviada">Proposta Enviada</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 5: CUPONS */}
      {activeSection === 'cupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newCoupon.code.trim()) return;
              await onCreateCoupon(newCoupon);
              setNewCoupon({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: 10,
                minOrderValue: 100,
              });
              notify('Cupom cadastrado!');
            }}
            className="lg:col-span-5 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-6 space-y-4 text-xs"
          >
            <h2 className="font-serif-editorial text-2xl text-[#393331]">Criar Novo Cupom</h2>
            <div>
              <label className="block font-medium mb-1">Código (Ex.: AVIDORE15)</label>
              <input
                type="text"
                required
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Descrição</label>
              <input
                type="text"
                required
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Tipo</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      discountType: e.target.value as 'percentage' | 'fixed',
                    })
                  }
                  className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                >
                  <option value="percentage">Percentual (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Valor do Desconto</label>
                <input
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#985858] text-white font-medium"
            >
              Salvar Cupom
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-[#985858] text-sm">{c.code}</div>
                  <div className="text-[#393331]/80">{c.description}</div>
                  <div className="text-[#393331]/60 tabular-nums">
                    Desconto:{' '}
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}%`
                      : formatCurrencyBRL(c.discountValue)}{' '}
                    · Pedido mínimo: {formatCurrencyBRL(c.minOrderValue)}
                  </div>
                </div>
                <span className="font-medium text-[#393331]">{c.active ? 'Ativo' : 'Inativo'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 6: INTEGRAÇÕES E-COMMERCE (Nuvemshop / Shopify) & MENSURAÇÃO */}
      {activeSection === 'integracoes' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSaveSettings(settingsForm);
            notify('Configurações de integração e canais atualizadas!');
          }}
          className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 space-y-6 text-xs"
        >
          <h2 className="font-serif-editorial text-2xl text-[#393331]">
            Arquitetura de Integração E-commerce (Nuvemshop / Shopify) e Canais Oficiais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Motor de Checkout Principal</label>
              <select
                value={settingsForm.ecommercePlatformIntegration.activePlatform}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    ecommercePlatformIntegration: {
                      ...settingsForm.ecommercePlatformIntegration,
                      activePlatform: e.target.value as StoreSettings['ecommercePlatformIntegration']['activePlatform'],
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              >
                <option value="nativo_avidore">Checkout Transparente Avidore + Gateway Brasileiro</option>
                <option value="nuvemshop_headless">Integração Headless Nuvemshop (Brasil — Pix, Cartões, Melhor Envio)</option>
                <option value="shopify_storefront">Integração Shopify Storefront API</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">WhatsApp Oficial (Apenas números com DDI 55)</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD] tabular-nums"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Endereço do Laboratório (Astorga/PR)</label>
              <input
                type="text"
                value={settingsForm.laboratoryLocation.addressPlaceholder}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    laboratoryLocation: {
                      ...settingsForm.laboratoryLocation,
                      addressPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Horários de Atendimento e Visita</label>
              <input
                type="text"
                value={settingsForm.laboratoryLocation.hoursPlaceholder}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    laboratoryLocation: {
                      ...settingsForm.laboratoryLocation,
                      hoursPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#D8C9BD]/60 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Google Analytics 4 (ID Oficial)</label>
              <input
                type="text"
                value={settingsForm.analyticsPreparedness.ga4MeasurementIdPlaceholder}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    analyticsPreparedness: {
                      ...settingsForm.analyticsPreparedness,
                      ga4MeasurementIdPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Google Tag Manager (ID Oficial)</label>
              <input
                type="text"
                value={settingsForm.analyticsPreparedness.gtmContainerIdPlaceholder}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    analyticsPreparedness: {
                      ...settingsForm.analyticsPreparedness,
                      gtmContainerIdPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Meta Pixel (ID Oficial)</label>
              <input
                type="text"
                value={settingsForm.analyticsPreparedness.metaPixelIdPlaceholder}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    analyticsPreparedness: {
                      ...settingsForm.analyticsPreparedness,
                      metaPixelIdPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#F6F1EB] border border-[#D8C9BD]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#985858] text-white font-medium"
          >
            Salvar Configurações da Plataforma
          </button>
        </form>
      )}
    </div>
  );
};
