import React from 'react';
import { OlfactoryCollection, Product, StoreSettings } from '../types/avidore';
import { buildWhatsAppLink, formatCurrencyBRL, trackAvidoreEvent } from '../utils/analyticsAndWhatsapp';
import { AvidoreMonogram, OfficialBrandShowcase, ProductStudioVisual } from './BrandVisuals';
import { ProductCard } from './EcommercePages';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';

export const HomePageView: React.FC<{
  collections: OlfactoryCollection[];
  products: Product[];
  settings: StoreSettings;
  onNavigate: (page: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}> = ({ collections, products, settings, onNavigate, onSelectProduct, onAddToCart }) => {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const cosmeticProducts = products.filter((p) => p.line === 'cuidados_pessoais');

  const collectionMap = new Map<string, OlfactoryCollection>();
  collections.forEach((c) => collectionMap.set(c.id, c));

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO PRINCIPAL */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-14">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#985858] font-medium">
                <span>AVIDORE · Laboratório Olfativo</span>
                <span aria-hidden="true">·</span>
                <span>Sinta antes de escolher</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[54px] text-[#393331] leading-[1.08] font-normal">
                Existem experiências que não precisam ser vistas. Basta sentir.
              </h1>

              <p className="text-base lg:text-lg text-[#393331]/80 leading-relaxed max-w-2xl">
                Descubra o universo da Avidore. Criamos experiências olfativas que transformam ambientes, despertam
                sensações e tornam momentos inesquecíveis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('experiencia')}
                className="px-7 py-4 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors whitespace-nowrap shrink-0"
              >
                Descubra a Avidore
              </button>
              <button
                type="button"
                onClick={() => onNavigate('colecoes')}
                className="px-7 py-4 border border-[#393331]/35 text-[#393331] text-sm font-medium hover:border-[#985858] hover:text-[#985858] transition-colors whitespace-nowrap shrink-0"
              >
                Conheça nossas coleções
              </button>
            </div>

            <div className="pt-6 border-t border-[#D8C9BD]/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#393331]/75">
              <div>
                <div className="font-semibold text-[#393331] mb-0.5">10 Coleções Olfativas</div>
                Difusores de ambiente e kits aromáticos autorais.
              </div>
              <div>
                <div className="font-semibold text-[#393331] mb-0.5">Linha de Cuidados Pessoais</div>
                Creme de hidratação, sabonete facial e sérum.
              </div>
              <div>
                <div className="font-semibold text-[#393331] mb-0.5">Soluções para Empresas</div>
                Marketing olfativo e presentes corporativos no PR e Brasil.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[420px] flex flex-col">
            <ProductStudioVisual
              shape="reed_diffuser"
              accentColor="#985858"
              surfaceTone="#F6F1EB"
              collectionRoman="I"
              labelSubtitle="AVIDORE LABORATÓRIO OLFATIVO"
              className="w-full h-full min-h-[420px] border border-[#D8C9BD]/50"
            />
          </div>
        </div>
      </section>

      {/* 2. APRESENTAÇÃO INSTITUCIONAL DA AVIDORE */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-b border-[#D8C9BD]/70 py-16">
          <div className="lg:col-span-5">
            <OfficialBrandShowcase className="min-h-[300px]" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
              Elegância que se sente · Astorga · Maringá · Londrina
            </div>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331] leading-tight">
              Mais do que produtos perfumados, um laboratório dedicado à memória sensorial de casas e marcas.
            </h2>
            <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
              Na Avidore, acreditamos que a escolha de uma fragrância deve nascer do encontro real com o aroma. Por
              isso construímos nossa operação sobre uma premissa clara: <strong>“Sinta antes de escolher.”</strong> Seja
              em uma visita guiada ao nosso laboratório, em uma demonstração para sua clínica ou na escolha de um
              presente, cada detalhe foi desenhado para unir sofisticação silenciosa, transparência e permanência.
            </p>
            <div className="flex flex-wrap gap-6 pt-2 text-xs font-medium text-[#985858]">
              <button type="button" onClick={() => onNavigate('sobre')} className="hover:underline">
                Conhecer a filosofia da Avidore →
              </button>
              <button type="button" onClick={() => onNavigate('experiencia')} className="hover:underline">
                Agendar visita ao Laboratório Olfativo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESTAQUE DAS COLEÇÕES OLFATIVAS (10 Coleções) */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
              Linha A · Universo Olfativo
            </span>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
              As 10 Coleções Olfativas Avidore
            </h2>
            <p className="text-sm text-[#393331]/75 leading-relaxed">
              Cada coleção apresenta uma atmosfera própria e desdobra-se em dois produtos principais: o Difusor de
              Ambiente e o Kit Aromático.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('colecoes')}
            className="text-xs font-medium text-[#985858] hover:underline whitespace-nowrap shrink-0"
          >
            Ver todas as 10 coleções (20 produtos) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.slice(0, 4).map((col) => (
            <div
              key={col.id}
              className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-6 flex flex-col justify-between space-y-6 hover:border-[#985858] transition-colors"
            >
              <div className="space-y-3">
                <div className="aspect-[4/3] w-full border border-[#D8C9BD]/50 overflow-hidden">
                  <ProductStudioVisual
                    shape="reed_diffuser"
                    accentColor={col.visualTheme.vesselTone}
                    surfaceTone={col.visualTheme.stoneTone}
                    collectionRoman={col.romanNumeral}
                    labelSubtitle={col.name}
                    className="w-full h-full"
                  />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#985858] font-medium">
                  {col.code} · {col.atmosphereTag}
                </div>
                <h3 className="font-serif-editorial text-2xl text-[#393331]">{col.name}</h3>
                <p className="text-xs text-[#393331]/75 leading-relaxed line-clamp-3">{col.conceptDescription}</p>
              </div>

              <div className="pt-4 border-t border-[#D8C9BD]/50 flex items-center justify-between text-xs">
                <span className="text-[#393331]/65">Difusor &amp; Kit Aromático</span>
                <button
                  type="button"
                  onClick={() => onNavigate('colecoes')}
                  className="font-medium text-[#985858] hover:underline"
                >
                  Explorar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DESTAQUE DA LINHA DE CUIDADOS PESSOAIS */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D8C9BD]/60 pb-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
                Linha B · Cuidados Pessoais Avidore
              </span>
              <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
                Rituais essenciais para a pele
              </h2>
              <p className="text-sm text-[#393331]/75 leading-relaxed">
                Três formulações padronizadas produzidas por indústria cosmética parceira e apresentadas sob a curadoria
                da marca Avidore: Creme de Hidratação, Sabonete de Limpeza Facial e Sérum.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cuidados-pessoais')}
              className="text-xs font-medium text-[#985858] hover:underline whitespace-nowrap shrink-0"
            >
              Conhecer a Linha de Cuidados Pessoais →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cosmeticProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRODUTOS SELECIONADOS (LOJA VIRTUAL) */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
              Compra Online · E-commerce Avidore
            </span>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
              Produtos Selecionados
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('loja')}
            className="px-5 py-2.5 border border-[#393331] text-xs font-medium text-[#393331] hover:bg-[#393331] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Ver catálogo completo (23 produtos)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              collection={product.collectionId ? collectionMap.get(product.collectionId) : undefined}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* 6 & 7. SOLUÇÕES CORPORATIVAS: MARKETING OLFATIVO + PRESENTES CORPORATIVOS */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marketing Olfativo */}
          <div className="bg-[#393331] text-[#F6F1EB] p-8 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.18em] text-[#D8C9BD]">
                Soluções para Empresas · Clínicas, Laboratórios e Varejo
              </div>
              <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#FFFFFF]">
                Marketing Olfativo e Identidade Sensorial
              </h2>
              <p className="text-sm text-[#D8C9BD]/90 leading-relaxed">
                Projetos pensados para clínicas odontológicas, laboratórios, clínicas médicas e empresas que desejam
                acolher pacientes e clientes com um aroma próprio — escolhido após degustação real no próprio ambiente.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('marketing-olfativo')}
                className="px-6 py-3 bg-[#985858] text-white text-xs font-medium hover:bg-[#7d4545] transition-colors"
              >
                Desenvolva uma identidade olfativa para sua empresa
              </button>
            </div>
          </div>

          {/* Presentes Corporativos */}
          <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.18em] text-[#985858]">
                Relacionamento Empresarial · Prazos por Escrito
              </div>
              <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
                Presentes Corporativos Personalizados
              </h2>
              <p className="text-sm text-[#393331]/80 leading-relaxed">
                Kits aromáticos e difusores com personalização para empresas, presentes de final de ano, eventos,
                clientes e colaboradores. Produção planejada com data de corte e entrega estipuladas em proposta.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('presentes-corporativos')}
                className="px-6 py-3 bg-[#393331] text-white text-xs font-medium hover:bg-[#393331]/90 transition-colors"
              >
                Solicitar uma proposta corporativa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8 & 9. EXPERIÊNCIA NO LABORATÓRIO & DIFERENCIAIS DA MARCA */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-12">
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
              Experiência Avidore · Laboratório Olfativo
            </div>
            <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
              “Sinta antes de escolher.”
            </h2>
            <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
              Convidamos você a conhecer nosso laboratório olfativo mediante agendamento. Em um atendimento
              personalizado, você experimenta as fragrâncias nas fitas olfativas, compreende o comportamento de cada
              composição no espaço e escolhe com total segurança.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('experiencia')}
                className="px-7 py-3.5 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors"
              >
                Agende sua experiência
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              {
                title: '01. Degustação Sensorial',
                desc: 'Evita aromas enjoativos, fracos ou diferentes do esperado ao permitir sentir antes da decisão.',
              },
              {
                title: '02. Curadoria Europeia',
                desc: 'Estética minimalista, materiais nobres e composições equilibradas para ambientes contemporâneos.',
              },
              {
                title: '03. Atendimento B2C e B2B',
                desc: 'Da escolha de um difusor para sua casa ao projeto completo de identidade olfativa empresarial.',
              },
              {
                title: '04. Presença Regional Próxima',
                desc: 'Atuação dedicada em Astorga, Maringá e Londrina, com envio seguro para todo o Brasil.',
              },
            ].map((dif) => (
              <div key={dif.title} className="p-5 bg-[#F6F1EB] border border-[#D8C9BD]/70 space-y-2">
                <div className="font-semibold text-[#393331]">{dif.title}</div>
                <p className="text-[#393331]/75 leading-relaxed">{dif.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CHAMADA FINAL PARA CONHECER A AVIDORE */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#F6F1EB] border border-[#D8C9BD] p-10 lg:p-16 text-center space-y-6">
          <AvidoreMonogram className="w-12 h-12 mx-auto" color="#985858" />
          <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331] max-w-2xl mx-auto">
            Existem experiências que permanecem mesmo depois que o momento termina.
          </h2>
          <p className="text-sm text-[#393331]/75 max-w-xl mx-auto">
            Explore nossas coleções na loja online, solicite um projeto para sua empresa ou agende uma visita ao
            laboratório olfativo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('loja')}
              className="px-7 py-3.5 bg-[#985858] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#7d4545] transition-colors"
            >
              Comprar na Loja Online
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contato')}
              className="px-7 py-3.5 border border-[#393331] text-[#393331] text-xs font-medium uppercase tracking-wider hover:bg-[#393331] hover:text-white transition-colors"
            >
              Falar com a Avidore
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
