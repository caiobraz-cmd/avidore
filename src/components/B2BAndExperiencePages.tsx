import React, { useState } from 'react';
import { CommercialLead, StoreSettings } from '../types/avidore';
import { buildWhatsAppLink, trackAvidoreEvent } from '../utils/analyticsAndWhatsapp';
import { AvidoreMonogram, OfficialBrandShowcase, ProductStudioVisual } from './BrandVisuals';
import { Check, ArrowRight, Calendar, Building2, Gift, Sparkles, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

interface PageSharedProps {
  settings: StoreSettings;
  onSubmitLead: (lead: Omit<CommercialLead, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  onNavigate: (page: string) => void;
}

/**
 * 6. MARKETING OLFATIVO — SOLUÇÕES PARA EMPRESAS
 */
export const MarketingOlfativoView: React.FC<PageSharedProps> = ({ settings, onSubmitLead }) => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    segment: 'Clínica Odontológica',
    city: 'Maringá - PR',
    whatsapp: '',
    email: '',
    interestContext: 'Identidade olfativa e difusão contínua',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setErrorMsg('Por favor, preencha nome, empresa, WhatsApp e e-mail para retornarmos seu contato.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await onSubmitLead({
        type: 'marketing_olfativo',
        name: form.name,
        company: form.company,
        segment: form.segment,
        city: form.city,
        whatsapp: form.whatsapp,
        email: form.email,
        interestContext: form.interestContext,
        message: form.message,
      });
      trackAvidoreEvent('generate_lead', { lead_type: 'marketing_olfativo', segment: form.segment, city: form.city });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const specialistWaUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    'marketing_olfativo',
    `${form.segment || 'Clínica/Empresa'} em ${form.city || 'Paraná'}`
  );

  return (
    <div className="space-y-20 pb-20">
      {/* Hero B2B Marketing Olfativo */}
      <section className="max-w-[1200px] mx-auto px-6 pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 lg:p-14">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
                Soluções para Empresas · Astorga · Maringá · Londrina
              </div>
              <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] leading-[1.12] font-normal">
                Transforme a maneira como sua marca e seu espaço são percebidos.
              </h1>
              <p className="text-base text-[#393331]/80 leading-relaxed max-w-2xl">
                A Avidore desenvolve soluções de marketing olfativo e identidade sensorial para clínicas odontológicas,
                laboratórios, clínicas médicas, escritórios de arquitetura e estabelecimentos comerciais que desejam
                acolher seus clientes com uma assinatura própria — sentida no laboratório ou em demonstração presencial
                antes da escolha.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#form-marketing-olfativo"
                className="px-6 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors whitespace-nowrap shrink-0"
              >
                Desenvolva uma identidade olfativa para sua empresa
              </a>
              <a
                href={specialistWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAvidoreEvent('contact_whatsapp', { context: 'marketing_olfativo_hero' })}
                className="px-6 py-3.5 border border-[#393331]/30 text-[#393331] text-sm font-medium hover:border-[#985858] hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Fale com um especialista
              </a>
            </div>

            <div className="pt-6 border-t border-[#D8C9BD]/50 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#393331]/75">
              <div>
                <div className="font-semibold text-[#393331] mb-1">Degustação Prévia</div>
                Demonstração com fita olfativa e amostras reais no próprio ambiente da empresa.
              </div>
              <div>
                <div className="font-semibold text-[#393331] mb-1">Exclusividade em Contrato</div>
                Possibilidade de composição reservada para o seu segmento e endereço comercial.
              </div>
              <div>
                <div className="font-semibold text-[#393331] mb-1">Rota Astorga · Maringá · Londrina</div>
                Atendimento próximo, reposição programada e prazos claros por escrito.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[360px] flex flex-col">
            <ProductStudioVisual
              shape="reed_diffuser"
              accentColor="#6E786E"
              surfaceTone="#F4F2ED"
              collectionRoman="III"
              labelSubtitle="IDENTIDADE OLFATIVA CORPORATIVA"
              className="w-full h-full min-h-[360px] border border-[#D8C9BD]/40"
            />
          </div>
        </div>
      </section>

      {/* O que é Marketing Olfativo & Identidade Olfativa */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-b border-[#D8C9BD]/60 py-14">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">01. Conceito e Estratégia</span>
            <h2 className="font-serif-editorial text-3xl text-[#393331]">O que é Marketing Olfativo?</h2>
            <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
              O marketing olfativo é o planejamento intencional da atmosfera sensorial de um ambiente comercial ou
              institucional. Ao contrário de uma aromatização improvisada — que frequentemente resulta em fragrâncias
              excessivas, enjoativas ou desconectadas do espaço —, o projeto olfativo calibra família aromática,
              intensidade e dispersão para harmonizar com a arquitetura, o fluxo de pessoas e o posicionamento da
              empresa.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">02. Assinatura da Marca</span>
            <h2 className="font-serif-editorial text-3xl text-[#393331]">O que é Identidade Olfativa?</h2>
            <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
              Assim como o logotipo e o projeto arquitetônico traduzem visualmente uma marca, a identidade olfativa é a
              tradução sensorial da sua empresa. É a fragrância que o cliente ou paciente reconhece imediatamente ao
              entrar na recepção, associando o ambiente a cuidado, organização, hospitalidade e atenção aos detalhes.
            </p>
          </div>
        </div>
      </section>

      {/* Públicos Prioritários */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">Segmentos Atendidos</span>
          <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
            Projetos desenhados para espaços que exigem discrição e confiança
          </h2>
          <p className="text-sm text-[#393331]/75 leading-relaxed">
            Desenvolvemos curadoria específica para ambientes de saúde e negócios onde a fragrância precisa acolher com
            naturalidade, sem saturar quem permanece horas no local.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              index: '01',
              title: 'Clínicas Odontológicas',
              description:
                'Suaviza a percepção típica de consultório logo na recepção, criando uma transição serena e acolhedora para pacientes e acompanhantes.',
              notes: 'Composições suaves, frescas e nunca enjoativas',
            },
            {
              index: '02',
              title: 'Laboratórios e Diagnóstico',
              description:
                'Transmite limpeza, organização e cuidado técnico em salas de espera e unidades de coleta com alto giro matinal.',
              notes: 'Equilíbrio luminoso e baixa fadiga olfativa',
            },
            {
              index: '03',
              title: 'Clínicas Médicas e Estéticas',
              description:
                'Valoriza a experiência de hospitalidade e conforto em consultórios dermatológicos, médicos e espaços de bem-estar.',
              notes: 'Elegância silenciosa e presença contínua',
            },
            {
              index: '04',
              title: 'Varejo, Showrooms e Escritórios',
              description:
                'Lojas de mobiliário, arquitetura, advocacia e marcas que desejam estender sua identidade até as sacolas, embalagens e salas de reunião.',
              notes: 'Assinatura autoral e aplicação multicanal',
            },
          ].map((item) => (
            <div
              key={item.index}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-7 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="text-xs text-[#985858] font-medium">{item.index}. Segmento Prioritário</div>
                <h3 className="font-serif-editorial text-2xl text-[#393331]">{item.title}</h3>
                <p className="text-sm text-[#393331]/75 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-4 border-t border-[#D8C9BD]/40 text-xs text-[#393331]/65">{item.notes}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Etapas de Desenvolvimento & Possibilidades de Aplicação */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#393331] text-[#F6F1EB] p-8 lg:p-14 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[#D8C9BD]">
              Metodologia Avidore · Sinta Antes de Escolher
            </span>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#FFFFFF]">
              Como funciona o desenvolvimento da identidade olfativa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01. Diagnóstico do Espaço',
                desc: 'Avaliamos metragem, climatização, fluxo de clientes/pacientes, materiais arquitetônicos e perfil da marca.',
              },
              {
                step: '02. Curadoria e Fita Olfativa',
                desc: 'Apresentamos opções selecionadas no nosso laboratório em Astorga ou em visita presencial em Maringá e Londrina.',
              },
              {
                step: '03. Teste no Ambiente Real',
                desc: 'Validamos a projeção no próprio espaço para assegurar que a fragrância seja agradável tanto para quem chega quanto para a equipe.',
              },
              {
                step: '04. Implantação e Reposição',
                desc: 'Definimos formatos de aplicação (difusores, refis regularizados, sprays institucionais e brindes) com cronograma de atendimento.',
              },
            ].map((s) => (
              <div key={s.step} className="space-y-3 border-t border-[#D8C9BD]/25 pt-5">
                <h3 className="font-serif-editorial text-xl text-[#FFFFFF]">{s.step}</h3>
                <p className="text-sm text-[#D8C9BD]/85 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Diagnóstico Comercial B2B */}
      <section id="form-marketing-olfativo" className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">Atendimento Empresarial</span>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
              Desenvolva uma identidade olfativa para sua empresa
            </h2>
            <p className="text-sm text-[#393331]/80 leading-relaxed">
              Preencha os dados da sua clínica ou empresa para agendar uma demonstração com fita olfativa ou receber uma
              proposta personalizada da nossa equipe técnica.
            </p>
            <div className="space-y-3 pt-2 text-xs text-[#393331]/75">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#985858]" />
                <span>Demonstração presencial na rota Astorga, Maringá e Londrina</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#985858]" />
                <span>Envio de amostras olfativas para outras regiões</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#985858]" />
                <span>Conformidade regulatória e transparência contratual</span>
              </div>
            </div>
            <div className="pt-4">
              <a
                href={specialistWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAvidoreEvent('contact_whatsapp', { context: 'marketing_olfativo_form_side' })}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#985858] hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Prefere atendimento imediato pelo WhatsApp? Fale com um especialista
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#F6F1EB] border border-[#D8C9BD] p-8 space-y-4">
                <h3 className="font-serif-editorial text-2xl text-[#393331]">
                  Solicitação empresarial registrada com sucesso.
                </h3>
                <p className="text-sm text-[#393331]/80 leading-relaxed">
                  Nossa equipe comercial recebeu os dados da empresa <strong>{form.company}</strong> e entrará em
                  contato pelo WhatsApp <strong>{form.whatsapp}</strong> para organizar sua demonstração olfativa.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={specialistWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#985858] text-white text-xs font-medium hover:bg-[#7d4545] transition-colors"
                  >
                    Iniciar conversa no WhatsApp agora
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 border border-[#D8C9BD] text-xs font-medium text-[#393331]"
                  >
                    Enviar nova solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-[#985858]/10 border border-[#985858] text-xs text-[#985858]">{errorMsg}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Seu nome *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex.: Dra. Mariana Costa"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Clínica ou Empresa *</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Nome da clínica ou empresa"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Segmento de atuação</label>
                    <select
                      value={form.segment}
                      onChange={(e) => setForm({ ...form, segment: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    >
                      <option value="Clínica Odontológica">Clínica Odontológica</option>
                      <option value="Laboratório de Análises / Diagnóstico">Laboratório de Análises / Diagnóstico</option>
                      <option value="Clínica Médica / Dermatológica / Estética">Clínica Médica / Dermatológica / Estética</option>
                      <option value="Escritório de Arquitetura / Advocacia">Escritório de Arquitetura / Advocacia</option>
                      <option value="Loja / Showroom / Estabelecimento Comercial">Loja / Showroom / Estabelecimento Comercial</option>
                      <option value="Outro Segmento Empresarial">Outro Segmento Empresarial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Cidade / Região</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Ex.: Maringá - PR, Londrina - PR, Astorga - PR"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">WhatsApp com DDD *</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="(44) 99999-0000"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">E-mail corporativo *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="contato@suaempresa.com.br"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">
                    Descreva o ambiente ou objetivo (ex.: recepção + 2 consultórios, fragrância exclusiva)
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Conte-nos brevemente sobre o espaço e como gostaria que seus clientes ou pacientes se sentissem ao entrar."
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Enviando solicitação...' : 'Desenvolva uma identidade olfativa para sua empresa'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * 7. PRESENTES CORPORATIVOS
 */
export const PresentesCorporativosView: React.FC<PageSharedProps> = ({ settings, onSubmitLead }) => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    desiredQuantity: '30 a 50 unidades',
    occasion: 'Final de Ano / Natal Corporativo',
    customizationNeed: 'Personalização com marca da empresa e fita exclusiva',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setErrorMsg('Preencha Nome, Empresa, WhatsApp e E-mail para enviarmos sua proposta corporativa.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await onSubmitLead({
        type: 'presentes_corporativos',
        name: form.name,
        company: form.company,
        whatsapp: form.whatsapp,
        email: form.email,
        desiredQuantity: form.desiredQuantity,
        occasion: form.occasion,
        customizationNeed: form.customizationNeed,
        message: form.message,
      });
      trackAvidoreEvent('generate_lead', {
        lead_type: 'presentes_corporativos',
        quantity: form.desiredQuantity,
        occasion: form.occasion,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const corpWaUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    'presentes_corporativos',
    `${form.company || 'Empresa'} · ${form.desiredQuantity} (${form.occasion})`
  );

  return (
    <div className="space-y-20 pb-20">
      <section className="max-w-[1200px] mx-auto px-6 pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 lg:p-14">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
                Presentes Corporativos Personalizados · Prazos por Escrito
              </div>
              <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] leading-[1.12] font-normal">
                Presentes que permanecem na memória de clientes, parceiros e equipes.
              </h1>
              <p className="text-base text-[#393331]/80 leading-relaxed max-w-2xl">
                Mais do que um brinde convencional, um presente olfativo da Avidore passa a fazer parte da casa ou do
                escritório de quem o recebe. Desenvolvemos kits corporativos com apresentação impecável, opções de
                personalização visual e cronograma de entrega formalizado em proposta.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#form-proposta-corporativa"
                className="px-6 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors whitespace-nowrap shrink-0"
              >
                Solicitar uma proposta corporativa
              </a>
              <a
                href={corpWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAvidoreEvent('contact_whatsapp', { context: 'presentes_corporativos_hero' })}
                className="px-6 py-3.5 border border-[#393331]/30 text-[#393331] text-sm font-medium hover:border-[#985858] hover:text-[#985858] transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Atendimento corporativo via WhatsApp
              </a>
            </div>

            <div className="pt-6 border-t border-[#D8C9BD]/50 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#393331]/75">
              <div>
                <div className="font-semibold text-[#393331] mb-1">Personalização Elegante</div>
                Aplicação da identidade da sua empresa em rótulos, tags, cintas e embalagens de presente.
              </div>
              <div>
                <div className="font-semibold text-[#393331] mb-1">Escolha Sensorial Prévia</div>
                Você sente as fragrâncias antes de aprovar o lote corporativo da sua marca.
              </div>
              <div>
                <div className="font-semibold text-[#393331] mb-1">Compromisso de Entrega</div>
                Datas de corte e entrega estipuladas por escrito para total segurança em eventos e fim de ano.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[360px] flex flex-col">
            <ProductStudioVisual
              shape="aromatic_kit"
              accentColor="#985858"
              surfaceTone="#F6F1EB"
              collectionRoman="IX"
              labelSubtitle="KITS E PRESENTES CORPORATIVOS"
              className="w-full h-full min-h-[360px] border border-[#D8C9BD]/40"
            />
          </div>
        </div>
      </section>

      {/* Modalidades de Presentes Corporativos */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">Aplicações Empresariais</span>
          <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
            Soluções sob medida para cada ocasião da sua empresa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Relacionamento com Clientes VIP e Entrega de Projetos',
              desc: 'Ideal para escritórios de arquitetura, construtoras, imobiliárias de alto padrão, clínicas e consultorias no momento de entrega de chaves ou fechamento de contratos.',
              detail: 'Apresentação individual em caixa rígida ou acabamento em linho',
            },
            {
              title: 'Datas Comemorativas e Natal Corporativo',
              desc: 'Kits aromáticos e difusores preparados em lotes programados para final de ano, Dia das Mães, Dia do Médico, Dia do Dentista e aniversários institucionais.',
              detail: 'Produção sob reserva com cronograma garantido',
            },
            {
              title: 'Reconhecimento de Colaboradores e Eventos',
              desc: 'Presentes para onboarding de executivos, convenções anuais, palestras e celebrações internas que pedem uma lembrança sofisticada e útil.',
              detail: 'Opções escaláveis conforme tiragem do evento',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <h3 className="font-serif-editorial text-2xl text-[#393331]">{card.title}</h3>
                <p className="text-sm text-[#393331]/75 leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-4 border-t border-[#D8C9BD]/40 text-xs text-[#985858] font-medium">{card.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário Completo de Proposta Corporativa */}
      <section id="form-proposta-corporativa" className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">Orçamento Sob Medida</span>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
              Solicitar uma proposta corporativa
            </h2>
            <p className="text-sm text-[#393331]/80 leading-relaxed">
              Informe a quantidade estimada, a ocasião e o nível de personalização desejado. Retornaremos com opções de
              kits, prazos de produção e condições comerciais por faixa de volume.
            </p>
            <div className="p-5 bg-[#F6F1EB] border border-[#D8C9BD]/70 space-y-2 text-xs text-[#393331]/80">
              <div className="font-semibold text-[#393331]">Atendimento Regional e Nacional</div>
              <p>
                Realizamos apresentações de mostruário físico na região de Astorga, Maringá e Londrina e enviamos
                propostas detalhadas para empresas de todo o Brasil.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#F6F1EB] border border-[#D8C9BD] p-8 space-y-4">
                <h3 className="font-serif-editorial text-2xl text-[#393331]">
                  Solicitação de proposta corporativa enviada!
                </h3>
                <p className="text-sm text-[#393331]/80 leading-relaxed">
                  Recebemos seu pedido para <strong>{form.company}</strong> ({form.desiredQuantity} · {form.occasion}).
                  Nossa equipe preparará as opções e entrará em contato pelo WhatsApp <strong>{form.whatsapp}</strong>.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={corpWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#985858] text-white text-xs font-medium hover:bg-[#7d4545]"
                  >
                    Adiantar atendimento no WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 border border-[#D8C9BD] text-xs font-medium text-[#393331]"
                  >
                    Nova solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-[#985858]/10 border border-[#985858] text-xs text-[#985858]">{errorMsg}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Nome *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nome completo do responsável"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Empresa *</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Razão social ou nome fantasia"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="(44) 99999-0000"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">E-mail *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="seuemail@empresa.com.br"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Quantidade desejada *</label>
                    <select
                      value={form.desiredQuantity}
                      onChange={(e) => setForm({ ...form, desiredQuantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    >
                      <option value="15 a 30 unidades">15 a 30 unidades</option>
                      <option value="30 a 50 unidades">30 a 50 unidades</option>
                      <option value="50 a 100 unidades">50 a 100 unidades</option>
                      <option value="100 a 250 unidades">100 a 250 unidades</option>
                      <option value="Acima de 250 unidades">Acima de 250 unidades</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Ocasião *</label>
                    <input
                      type="text"
                      required
                      value={form.occasion}
                      onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                      placeholder="Ex.: Natal Corporativo, Evento, Entrega de Chaves"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">
                    Necessidade de personalização
                  </label>
                  <select
                    value={form.customizationNeed}
                    onChange={(e) => setForm({ ...form, customizationNeed: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  >
                    <option value="Personalização com marca da empresa e fita exclusiva">
                      Personalização com marca da empresa e fita exclusiva
                    </option>
                    <option value="Desenvolvimento de fragrância exclusiva + embalagem personalizada">
                      Desenvolvimento de fragrância exclusiva + embalagem personalizada
                    </option>
                    <option value="Kits com apresentação padrão Avidore + cartão institucional">
                      Kits com apresentação padrão Avidore + cartão institucional
                    </option>
                    <option value="Desejo orientação da equipe Avidore">Desejo orientação da equipe Avidore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">Mensagem adicional</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Informe data limite de entrega desejada, cidade de destino ou detalhes adicionais."
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Enviando proposta...' : 'Solicitar uma proposta corporativa'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * 8. EXPERIÊNCIA NO LABORATÓRIO ("Sinta antes de escolher.")
 */
export const ExperienciaLaboratorioView: React.FC<PageSharedProps> = ({ settings, onSubmitLead }) => {
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    city: 'Astorga / Região',
    interestContext: 'Conhecer as 10 Coleções Olfativas para residência',
    preferredDateOrShift: 'Período da tarde (com agendamento prévio)',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.whatsapp.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitLead({
        type: 'experiencia_laboratorio',
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email,
        city: form.city,
        interestContext: form.interestContext,
        preferredDateOrShift: form.preferredDateOrShift,
        message: form.message,
      });
      trackAvidoreEvent('generate_lead', { lead_type: 'experiencia_laboratorio', city: form.city });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const labWaUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    'experiencia_laboratorio',
    `${form.name || 'Visitante'} (${form.interestContext})`
  );

  return (
    <div className="space-y-20 pb-20">
      <section className="max-w-[1200px] mx-auto px-6 pt-10 lg:pt-14">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
              Laboratório Olfativo Avidore · Sinta antes de escolher
            </div>
            <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] leading-[1.12] font-normal">
              Por que escolher uma fragrância sem antes senti-la?
            </h1>
            <p className="text-base text-[#393331]/80 leading-relaxed">
              Escolher um aroma apenas por descrições genéricas na tela frequentemente leva a frustrações: fragrâncias
              excessivamente doces, suaves demais para o tamanho da sala ou diferentes do imaginado. Na Avidore, abrimos
              nosso espaço para uma experiência guiada — onde você sente cada acorde na fita olfativa e no ambiente
              antes de decidir.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#form-agendar-experiencia"
                className="px-6 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors"
              >
                Agende sua experiência
              </a>
              <a
                href={labWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAvidoreEvent('contact_whatsapp', { context: 'experiencia_laboratorio_hero' })}
                className="px-6 py-3.5 border border-[#393331]/30 text-[#393331] text-sm font-medium hover:border-[#985858] hover:text-[#985858] transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Agendar pelo WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#F6F1EB] border border-[#D8C9BD]/70 p-8 space-y-6">
              <AvidoreMonogram className="w-12 h-12" color="#985858" />
              <h2 className="font-serif-editorial text-2xl text-[#393331]">
                O que acontece durante a visita ao Laboratório
              </h2>
              <ul className="space-y-4 text-sm text-[#393331]/80">
                <li className="border-b border-[#D8C9BD]/50 pb-3">
                  <strong className="text-[#393331] block">01. Recepção e Leitura de Preferências</strong>
                  Conversamos sobre o ambiente que você deseja perfumar (residência, consultório ou presente) e suas
                  memórias olfativas preferidas.
                </li>
                <li className="border-b border-[#D8C9BD]/50 pb-3">
                  <strong className="text-[#393331] block">02. Degustação nas 10 Coleções Olfativas</strong>
                  Apresentação guiada em fitas olfativas e campânulas para perceber a evolução das notas sem saturar o
                  olfato.
                </li>
                <li>
                  <strong className="text-[#393331] block">03. Orientação de Posicionamento e Volume</strong>
                  Indicação técnica sobre quantidade de varetas, circulação de ar e combinação entre difusor e kit
                  aromático.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Informações de Localização & Agendamento */}
      <section id="form-agendar-experiencia" className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-14">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">Visitas Mediante Confirmação</span>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">Agende sua experiência</h2>
            <p className="text-sm text-[#393331]/80 leading-relaxed">
              Para garantir atendimento individualizado e preparar a bancada olfativa sem interferência de outros aromas
              no ar, todas as visitas são agendadas previamente.
            </p>

            <div className="space-y-4 pt-2 border-t border-[#D8C9BD]/60 text-xs text-[#393331]/80">
              <div>
                <div className="font-semibold text-[#393331] uppercase tracking-wider mb-1">Localização</div>
                <p>{settings.laboratoryLocation.addressPlaceholder}</p>
              </div>
              <div>
                <div className="font-semibold text-[#393331] uppercase tracking-wider mb-1">Horários de Visita</div>
                <p>{settings.laboratoryLocation.hoursPlaceholder}</p>
              </div>
              <div>
                <div className="font-semibold text-[#393331] uppercase tracking-wider mb-1">Política de Atendimento</div>
                <p>{settings.laboratoryLocation.visitPolicyNote}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#F6F1EB] border border-[#D8C9BD] p-8 space-y-4">
                <h3 className="font-serif-editorial text-2xl text-[#393331]">
                  Solicitação de agendamento recebida!
                </h3>
                <p className="text-sm text-[#393331]/80 leading-relaxed">
                  Agradecemos seu interesse, <strong>{form.name}</strong>. Entraremos em contato pelo WhatsApp{' '}
                  <strong>{form.whatsapp}</strong> para confirmar a disponibilidade de data e horário no laboratório.
                </p>
                <a
                  href={labWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 bg-[#985858] text-white text-xs font-medium hover:bg-[#7d4545]"
                >
                  Confirmar diretamente pelo WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Seu nome *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="(44) 99999-0000"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="seuemail@exemplo.com.br"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Sua cidade</label>
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    >
                      <option value="Astorga - PR">Astorga - PR</option>
                      <option value="Maringá - PR">Maringá - PR</option>
                      <option value="Londrina - PR">Londrina - PR</option>
                      <option value="Outra cidade do Paraná / Brasil">Outra cidade do Paraná / Brasil</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Objetivo da experiência</label>
                    <select
                      value={form.interestContext}
                      onChange={(e) => setForm({ ...form, interestContext: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    >
                      <option value="Conhecer as 10 Coleções Olfativas para residência">
                        Conhecer as 10 Coleções Olfativas para residência
                      </option>
                      <option value="Escolher fragrância para Clínica / Consultório / Empresa">
                        Escolher fragrância para Clínica / Consultório / Empresa
                      </option>
                      <option value="Selecionar Presentes Corporativos ou Eventos">
                        Selecionar Presentes Corporativos ou Eventos
                      </option>
                      <option value="Conhecer a Linha de Cuidados Pessoais Avidore">
                        Conhecer a Linha de Cuidados Pessoais Avidore
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#393331] mb-1.5">Preferência de período</label>
                    <input
                      type="text"
                      value={form.preferredDateOrShift}
                      onChange={(e) => setForm({ ...form, preferredDateOrShift: e.target.value })}
                      placeholder="Ex.: Terça ou Quinta à tarde"
                      className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">Observações adicionais</label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Conte-nos se há alguma preferência de notas ou ambiente específico."
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors"
                >
                  {submitting ? 'Registrando...' : 'Agende sua experiência'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * 9. SOBRE A AVIDORE
 */
export const SobreAvidoreView: React.FC<{ settings: StoreSettings; onNavigate: (page: string) => void }> = ({
  settings,
  onNavigate,
}) => {
  return (
    <div className="space-y-20 pb-20">
      <section className="max-w-[1200px] mx-auto px-6 pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 lg:p-14">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
              A Avidore · Laboratório Olfativo e Cosmético
            </span>
            <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] leading-[1.12] font-normal">
              Elegância que se sente.
            </h1>
            <p className="text-base text-[#393331]/80 leading-relaxed">
              A Avidore nasce como um laboratório olfativo e cosmético dedicado a conectar fragrâncias, espaços,
              cuidados pessoais e marcas. Mais do que comercializar objetos perfumados, cultivamos a convicção de que
              cada ambiente e cada gesto cotidiano merecem uma atmosfera pensada com sensibilidade, rigor técnico e
              permanência.
            </p>
            <p className="text-base text-[#393331]/80 leading-relaxed">
              Nossa assinatura — <strong>“Sinta antes de escolher”</strong> — traduz nosso respeito pela percepção
              individual de cada pessoa e de cada empresa. Na rota entre Astorga, Maringá e Londrina, e com estrutura
              preparada para atender clientes em todo o Brasil, unimos a curadoria de coleções olfativas, uma linha
              própria de cuidados pessoais e projetos empresariais sob medida.
            </p>
          </div>
          <div className="lg:col-span-5">
            <OfficialBrandShowcase className="min-h-[340px]" />
          </div>
        </div>
      </section>

      {/* As Três Frentes de Atuação */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">Arquitetura da Marca</span>
          <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">Três frentes complementares</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs text-[#985858] font-medium">01. Universo Olfativo</div>
              <h3 className="font-serif-editorial text-2xl text-[#393331]">Experiências e Produtos Olfativos</h3>
              <p className="text-sm text-[#393331]/75 leading-relaxed">
                Dez coleções olfativas compostas por difusores de ambiente e kits aromáticos desenvolvidos para
                diferentes momentos e estilos arquitetônicos, acompanhados da experiência de degustação no laboratório.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('colecoes')}
              className="text-xs font-medium text-[#985858] hover:underline text-left"
            >
              Explorar as 10 Coleções Olfativas →
            </button>
          </div>

          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs text-[#985858] font-medium">02. Autocuidado Cotidiano</div>
              <h3 className="font-serif-editorial text-2xl text-[#393331]">Cosméticos de Marca Própria</h3>
              <p className="text-sm text-[#393331]/75 leading-relaxed">
                Linha essencial composta por Creme de Hidratação, Sabonete de Limpeza Facial e Sérum, fabricados por
                indústria parceira homologada com formulações padronizadas sob a curadoria Avidore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cuidados-pessoais')}
              className="text-xs font-medium text-[#985858] hover:underline text-left"
            >
              Conhecer a Linha de Cuidados Pessoais →
            </button>
          </div>

          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs text-[#985858] font-medium">03. Soluções B2B</div>
              <h3 className="font-serif-editorial text-2xl text-[#393331]">
                Marketing Olfativo e Presentes Corporativos
              </h3>
              <p className="text-sm text-[#393331]/75 leading-relaxed">
                Desenvolvimento de identidade olfativa para clínicas odontológicas, laboratórios, clínicas e empresas,
                além de presentes corporativos personalizados com prazos formalizados.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('marketing-olfativo')}
              className="text-xs font-medium text-[#985858] hover:underline text-left"
            >
              Ver Soluções para Empresas →
            </button>
          </div>
        </div>
      </section>

      {/* Espaços Reservados para Dados Institucionais Oficiais (Sem invenção de histórico, datas ou prêmios) */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 lg:p-12 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">
              Transparência Institucional e Regulatória
            </span>
            <h2 className="font-serif-editorial text-2xl lg:text-3xl text-[#393331]">
              Informações Institucionais e Quadro Técnico
            </h2>
            <p className="text-xs text-[#393331]/70">
              Estrutura preparada para inserção dos dados societários, histórico oficial dos fundadores e registros
              regulatórios definitivos, sem adição de informações não verificadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#393331]/80">
            <div className="p-5 bg-[#F6F1EB] border border-[#D8C9BD]/60 space-y-1.5">
              <div className="font-semibold text-[#393331]">História e Fundação Oficial</div>
              <p>[Espaço reservado para o texto biográfico oficial da fundação e trajetória da Avidore]</p>
            </div>
            <div className="p-5 bg-[#F6F1EB] border border-[#D8C9BD]/60 space-y-1.5">
              <div className="font-semibold text-[#393331]">Responsabilidade Técnica e ANVISA</div>
              <p>
                [Espaço reservado para identificação do Responsável Técnico (CRQ/CRF), AFE e números de notificação
                sanitária de cada linha]
              </p>
            </div>
            <div className="p-5 bg-[#F6F1EB] border border-[#D8C9BD]/60 space-y-1.5">
              <div className="font-semibold text-[#393331]">Sede e Atuação Regional</div>
              <p>
                Sede em {settings.laboratoryLocation.city} – {settings.laboratoryLocation.state}, com atendimento direto
                no eixo Astorga, Maringá e Londrina e envios para todo o território nacional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * 10. CONTATO (Com 5 contextos de WhatsApp + Formulário)
 */
export const ContatoView: React.FC<PageSharedProps> = ({ settings, onSubmitLead }) => {
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    interestContext: 'Interesse em produtos',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.whatsapp.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitLead({
        type: 'contato_geral',
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email,
        interestContext: form.interestContext,
        message: form.message,
      });
      trackAvidoreEvent('generate_lead', { lead_type: 'contato_geral', context: form.interestContext });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappChannels: {
    label: string;
    desc: string;
    context: 'produto' | 'pedido' | 'marketing_olfativo' | 'presentes_corporativos' | 'experiencia_laboratorio';
    detail?: string;
  }[] = [
    {
      label: '01. Interesse em produtos e coleções',
      desc: 'Auxílio para conhecer as 10 coleções olfativas e a linha de cuidados pessoais.',
      context: 'produto',
    },
    {
      label: '02. Dúvidas sobre pedidos e envios',
      desc: 'Acompanhamento de pedidos realizados no site, prazos de entrega e rastreamento.',
      context: 'pedido',
    },
    {
      label: '03. Marketing olfativo para clínicas e empresas',
      desc: 'Solicitação de visita técnica, fita olfativa e projetos de identidade sensorial.',
      context: 'marketing_olfativo',
    },
    {
      label: '04. Presentes corporativos personalizados',
      desc: 'Cotações para lotes empresariais, brindes de fim de ano e eventos.',
      context: 'presentes_corporativos',
    },
    {
      label: '05. Agendamento de experiência no laboratório',
      desc: 'Reserva de horário para sentir as fragrâncias presencialmente antes de escolher.',
      context: 'experiencia_laboratorio',
    },
  ];

  return (
    <div className="space-y-16 pb-20 max-w-[1200px] mx-auto px-6 pt-10 lg:pt-14">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">Canais de Atendimento</span>
        <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] font-normal">
          Fale com a equipe da Avidore
        </h1>
        <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
          Escolha abaixo o canal direto de WhatsApp de acordo com a sua necessidade ou envie uma mensagem pelo
          formulário. Nosso atendimento apoia tanto compras na loja online quanto projetos empresariais.
        </p>
      </div>

      {/* 5 Contextos de WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whatsappChannels.map((ch) => {
          const url = buildWhatsAppLink(settings.whatsappNumber, ch.context, ch.detail);
          return (
            <a
              key={ch.label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAvidoreEvent('contact_whatsapp', { context: ch.context })}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-6 flex flex-col justify-between space-y-5 hover:border-[#985858] transition-colors group"
            >
              <div className="space-y-2">
                <h2 className="font-serif-editorial text-xl text-[#393331] group-hover:text-[#985858] transition-colors">
                  {ch.label}
                </h2>
                <p className="text-xs text-[#393331]/75 leading-relaxed">{ch.desc}</p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#985858]">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Iniciar conversa contextual no WhatsApp</span>
              </div>
            </a>
          );
        })}

        {/* Card Instagram & Dados Oficiais */}
        <div className="bg-[#393331] text-[#F6F1EB] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <h2 className="font-serif-editorial text-xl text-[#FFFFFF]">Instagram e Canais Oficiais</h2>
            <p className="text-xs text-[#D8C9BD]/85 leading-relaxed">
              Acompanhe os bastidores do laboratório olfativo, lançamentos das coleções e projetos corporativos na
              região de Astorga, Maringá e Londrina.
            </p>
          </div>
          <div className="space-y-1.5 text-xs">
            <div>
              Instagram:{' '}
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D8C9BD] underline hover:text-white"
              >
                {settings.instagramHandle}
              </a>
            </div>
            <div>E-mail: {settings.emailContact}</div>
            <div>WhatsApp: {settings.whatsappDisplay}</div>
          </div>
        </div>
      </div>

      {/* Formulário de Contato + Endereço/Horários */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-12">
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-serif-editorial text-3xl text-[#393331]">Laboratório e Atendimento Regional</h2>
          <div className="space-y-4 text-xs text-[#393331]/80 leading-relaxed">
            <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
              <strong className="text-[#393331] block mb-1">Endereço do Laboratório (Astorga · PR)</strong>
              {settings.laboratoryLocation.addressPlaceholder}
            </div>
            <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
              <strong className="text-[#393331] block mb-1">Horários de Atendimento</strong>
              {settings.laboratoryLocation.hoursPlaceholder}
            </div>
            <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
              <strong className="text-[#393331] block mb-1">Mapa e Rota de Atuação</strong>
              Atuação presencial prioritária no eixo <strong>Astorga · Maringá · Londrina (Norte do Paraná)</strong> e
              logística de e-commerce para todo o Brasil. O mapa interativo será ativado assim que a numeração predial
              oficial for liberada para divulgação pública.
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-[#F6F1EB] border border-[#D8C9BD] p-8 space-y-4">
              <h3 className="font-serif-editorial text-2xl text-[#393331]">Mensagem enviada com sucesso.</h3>
              <p className="text-sm text-[#393331]/80">
                Recebemos seu contato referente a <strong>{form.interestContext}</strong> e responderemos em breve.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 border border-[#D8C9BD] text-xs font-medium text-[#393331]"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-serif-editorial text-2xl text-[#393331]">Envie uma mensagem</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">Nome completo *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#393331] mb-1.5">Assunto</label>
                  <select
                    value={form.interestContext}
                    onChange={(e) => setForm({ ...form, interestContext: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                  >
                    <option value="Interesse em produtos">Interesse em produtos</option>
                    <option value="Dúvidas sobre pedidos">Dúvidas sobre pedidos</option>
                    <option value="Marketing olfativo">Marketing olfativo</option>
                    <option value="Presentes corporativos">Presentes corporativos</option>
                    <option value="Agendamento de experiência">Agendamento de experiência</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#393331] mb-1.5">Mensagem *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F6F1EB]/60 border border-[#D8C9BD] text-sm text-[#393331] focus:outline-none focus:border-[#985858]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors"
              >
                {submitting ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 14. PÁGINAS INSTITUCIONAIS E POLÍTICAS
 */
export const PoliticasView: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12 space-y-10 pb-20">
      <div className="space-y-3 border-b border-[#D8C9BD] pb-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[#985858]">Governança, LGPD e Conformidade</span>
        <h1 className="font-serif-editorial text-4xl text-[#393331]">Políticas Institucionais e Regulatórias</h1>
      </div>

      <div className="space-y-8 text-sm text-[#393331]/85 leading-relaxed">
        <section className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 space-y-3">
          <h2 className="font-serif-editorial text-2xl text-[#393331]">
            1. Responsabilidade Regulatória e Conformidade Sanitária (ANVISA)
          </h2>
          <p>
            Todos os produtos cosméticos (Linha de Cuidados Pessoais) e saneantes/aromatizadores de ambiente (Coleções
            Olfativas) comercializados sob a marca Avidore seguem rigorosamente as normas aplicáveis da Agência Nacional
            de Vigilância Sanitária (Anvisa).
          </p>
          <p>
            Os produtos da Linha de Cuidados Pessoais (Creme de Hidratação, Sabonete de Limpeza Facial e Sérum) possuem
            formulações padronizadas fabricadas por indústria cosmética parceira devidamente habilitada. Nenhum produto
            utiliza alegações terapêuticas, promessas médicas não comprovadas ou ingredientes omitidos da rotulagem
            oficial (INCI). Produtos em fase de homologação permanecem sinalizados em modo de pré-visualização/rascunho
            até a publicação do respectivo número de processo/notificação.
          </p>
        </section>

        <section className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 space-y-3">
          <h2 className="font-serif-editorial text-2xl text-[#393331]">
            2. Política de Envios, Prazos e Proteção contra Avarias
          </h2>
          <p>
            Por trabalharmos com frascos de vidro e difusores sensíveis, todas as remessas da Avidore utilizam embalagem
            de proteção reforçada. Na rota regional (Astorga, Maringá e Londrina), oferecemos modalidade de entrega
            expressa dedicada e opção de retirada agendada no laboratório. Para as demais regiões do Paraná e do Brasil,
            operamos com Correios (SEDEX e PAC) e transportadoras parceiras com código de rastreio e seguro integral.
          </p>
        </section>

        <section className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 space-y-3">
          <h2 className="font-serif-editorial text-2xl text-[#393331]">
            3. Política de Trocas, Devoluções e Direito de Arrependimento
          </h2>
          <p>
            Em conformidade com o Código de Defesa do Consumidor (Art. 49), o cliente dispõe de até 7 (sete) dias
            corridos após o recebimento do pedido online para solicitar a devolução de produtos lacrados e sem indícios
            de uso. Caso ocorra qualquer avaria no transporte, a Avidore realiza a substituição prioritária sem custo
            adicional mediante envio de registro fotográfico pelo nosso canal de WhatsApp ou e-mail.
          </p>
        </section>

        <section className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-8 space-y-3">
          <h2 className="font-serif-editorial text-2xl text-[#393331]">
            4. Privacidade e Proteção de Dados (LGPD — Lei nº 13.709/2018)
          </h2>
          <p>
            Os dados informados em formulários comerciais, agendamentos de visita ao laboratório e compras online são
            utilizados exclusivamente para processamento logístico, emissão fiscal e atendimento solicitado pelo
            titular. A Avidore não armazena dados sensíveis de cartões de crédito diretamente em seus servidores,
            operando por meio de gateways criptografados e plataformas homologadas (Nuvemshop / Shopify / Pix Banco
            Central).
          </p>
        </section>
      </div>
    </div>
  );
};
