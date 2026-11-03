export type WhatsAppContextType =
  | 'produto'
  | 'pedido'
  | 'marketing_olfativo'
  | 'presentes_corporativos'
  | 'experiencia_laboratorio'
  | 'geral';

export function buildWhatsAppLink(
  phoneRaw: string,
  context: WhatsAppContextType,
  detail?: string
): string {
  const cleanPhone = (phoneRaw || '5544999999999').replace(/\D/g, '') || '5544999999999';

  let message = 'Olá! Gostaria de conhecer mais sobre o universo da Avidore · Laboratório Olfativo.';

  switch (context) {
    case 'produto':
      message = detail
        ? `Olá! Estou no site da Avidore e gostaria de informações sobre o produto "${detail}" e como sentir as fragrâncias antes de escolher.`
        : 'Olá! Estou visitando a loja online da Avidore e gostaria de auxílio para escolher uma fragrância ou produto.';
      break;
    case 'pedido':
      message = detail
        ? `Olá! Gostaria de informações sobre o meu pedido ${detail} realizado no site da Avidore.`
        : 'Olá! Preciso de auxílio referente a um pedido na loja online da Avidore.';
      break;
    case 'marketing_olfativo':
      message = detail
        ? `Olá! Tenho interesse em soluções de Marketing Olfativo e Identidade Olfativa para minha empresa (${detail}). Gostaria de conversar com um especialista da Avidore.`
        : 'Olá! Tenho interesse em desenvolver uma Identidade Olfativa para minha clínica/empresa (Astorga, Maringá, Londrina e região) e gostaria de falar com um especialista.';
      break;
    case 'presentes_corporativos':
      message = detail
        ? `Olá! Gostaria de solicitar uma proposta de Presentes Corporativos personalizados da Avidore (${detail}).`
        : 'Olá! Tenho interesse em Presentes Corporativos personalizados da Avidore com prazo programado. Podem me enviar informações?';
      break;
    case 'experiencia_laboratorio':
      message = detail
        ? `Olá! Gostaria de agendar uma Experiência Olfativa no Laboratório da Avidore ("Sinta antes de escolher") — ${detail}.`
        : 'Olá! Gostaria de agendar minha visita ao Laboratório Olfativo da Avidore para sentir as fragrâncias antes de escolher.';
      break;
    default:
      if (detail) {
        message = `Olá! Contato pelo site da Avidore: ${detail}`;
      }
      break;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export type AnalyticsEventName =
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'generate_lead'
  | 'contact_whatsapp'
  | 'page_view';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackAvidoreEvent(
  eventName: AnalyticsEventName,
  payload: Record<string, unknown> = {}
): void {
  try {
    // Google Tag Manager dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        brand: 'AVIDORE',
        timestamp: new Date().toISOString(),
        ...payload,
      });

      // Google Analytics 4 gtag
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, payload);
      }

      // Meta Pixel fbq mapping
      if (typeof window.fbq === 'function') {
        const metaEventMap: Record<AnalyticsEventName, string> = {
          view_item: 'ViewContent',
          add_to_cart: 'AddToCart',
          begin_checkout: 'InitiateCheckout',
          purchase: 'Purchase',
          generate_lead: 'Lead',
          contact_whatsapp: 'Contact',
          page_view: 'PageView',
        };
        window.fbq('track', metaEventMap[eventName] || eventName, payload);
      }
    }
  } catch {
    // Non-blocking analytics
  }
}

export function updatePageSeo(title: string, description: string, pathHash: string): void {
  if (typeof document === 'undefined') return;
  document.title = title;

  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);

  trackAvidoreEvent('page_view', { page_title: title, page_path: pathHash });
}

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
