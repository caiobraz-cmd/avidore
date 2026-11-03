import React, { useMemo, useState } from 'react';
import {
  OlfactoryCollection,
  Product,
  ProductCategory,
  ShippingOption,
  StoreSettings,
} from '../types/avidore';
import { buildWhatsAppLink, formatCurrencyBRL, trackAvidoreEvent } from '../utils/analyticsAndWhatsapp';
import { ProductStudioVisual } from './BrandVisuals';
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  Check,
  Truck,
  ShieldCheck,
  MessageCircle,
  SlidersHorizontal,
} from 'lucide-react';

export const ProductCard: React.FC<{
  product: Product;
  collection?: OlfactoryCollection;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}> = ({ product, collection, onSelectProduct, onAddToCart }) => {
  const effectivePrice = product.promotionalPrice ?? product.price;
  const categoryLabel =
    product.category === 'difusor_ambiente'
      ? 'Difusor de Ambiente'
      : product.category === 'kit_aromatico'
      ? 'Kit Aromático'
      : 'Cuidados Pessoais';

  return (
    <article className="bg-[#FFFFFF] border border-[#D8C9BD]/70 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 group">
      <div>
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="w-full text-left block focus:outline-none"
        >
          <div className="aspect-[4/5] w-full overflow-hidden border-b border-[#D8C9BD]/50">
            <ProductStudioVisual
              shape={product.visualStyle.bottleShape}
              accentColor={product.visualStyle.accentColor}
              surfaceTone={product.visualStyle.surfaceTone}
              collectionRoman={collection?.romanNumeral || 'I'}
              labelSubtitle={product.name}
              className="w-full h-full transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
        </button>

        <div className="p-6 space-y-2.5">
          {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-[#393331]/65 uppercase tracking-wider">
            <span>{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{collection ? collection.code : 'Linha Cosmética'}</span>
            {product.stock > 0 ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#393331]/70">Disponível</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#985858]">Esgotado</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left block focus:outline-none"
          >
            <h3 className="font-serif-editorial text-2xl text-[#393331] group-hover:text-[#985858] transition-colors leading-snug">
              {product.name}
            </h3>
          </button>

          <p className="text-xs text-[#393331]/75 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-[#D8C9BD]/40 flex items-center justify-between gap-4">
        <div className="tabular-nums">
          {product.promotionalPrice ? (
            <div className="flex flex-col">
              <span className="text-xs text-[#393331]/50 line-through">{formatCurrencyBRL(product.price)}</span>
              <span className="text-base font-semibold text-[#985858]">{formatCurrencyBRL(effectivePrice)}</span>
            </div>
          ) : (
            <span className="text-base font-semibold text-[#393331]">{formatCurrencyBRL(effectivePrice)}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="px-3 py-2 text-xs font-medium text-[#393331] border border-[#D8C9BD] hover:border-[#393331] transition-colors whitespace-nowrap shrink-0"
          >
            Detalhes
          </button>
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product, 1)}
            className="px-4 py-2 text-xs font-medium bg-[#985858] text-white hover:bg-[#7d4545] transition-colors disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            {product.stock > 0 ? 'Adicionar' : 'Indisponível'}
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * 2. LOJA COMPLETA (Catálogo E-commerce com filtros, busca e ordenação)
 */
export const LojaView: React.FC<{
  products: Product[];
  collections: OlfactoryCollection[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  initialCategoryFilter?: string;
}> = ({ products, collections, onSelectProduct, onAddToCart, initialCategoryFilter = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter);
  const [collectionFilter, setCollectionFilter] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');

  const collectionMap = useMemo(() => {
    const map = new Map<string, OlfactoryCollection>();
    collections.forEach((c) => map.set(c.id, c));
    return map;
  }, [collections]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (onlyInStock && p.stock <= 0) return false;
        if (categoryFilter === 'olfativa' && p.line !== 'olfativa') return false;
        if (categoryFilter === 'cuidados_pessoais' && p.line !== 'cuidados_pessoais') return false;
        if (categoryFilter === 'difusor_ambiente' && p.category !== 'difusor_ambiente') return false;
        if (categoryFilter === 'kit_aromatico' && p.category !== 'kit_aromatico') return false;
        if (collectionFilter !== 'all' && p.collectionId !== collectionFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q);
          return matchName || matchSku || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.promotionalPrice ?? a.price;
        const priceB = b.promotionalPrice ?? b.price;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'pt-BR');
        return Number(b.featured) - Number(a.featured);
      });
  }, [products, categoryFilter, collectionFilter, onlyInStock, searchQuery, sortBy]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14 space-y-10 pb-20">
      {/* Header Loja */}
      <div className="border-b border-[#D8C9BD]/80 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
            Loja Oficial Avidore · Catálogo Completo
          </div>
          <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] font-normal">
            Experiências Olfativas e Cuidados Pessoais
          </h1>
          <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
            Explore as 10 Coleções Olfativas (Difusores de Ambiente e Kits Aromáticos) e os 3 produtos da Linha de
            Cuidados Pessoais Avidore.
          </p>
        </div>

        <div className="text-xs text-[#393331]/70 tabular-nums">
          Exibindo <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos cadastrados
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Interactive Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F6F1EB] border border-[#D8C9BD]/60">
            {[
              { id: 'all', label: 'Todos (23)' },
              { id: 'difusor_ambiente', label: 'Difusores de Ambiente (10)' },
              { id: 'kit_aromatico', label: 'Kits Aromáticos (10)' },
              { id: 'cuidados_pessoais', label: 'Cuidados Pessoais (3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(tab.id);
                  if (tab.id === 'cuidados_pessoais') setCollectionFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === tab.id
                    ? 'bg-[#985858] text-white'
                    : 'text-[#393331]/80 hover:text-[#393331]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-[#393331]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, coleção ou código..."
              className="w-full pl-10 pr-4 py-2 bg-[#F6F1EB]/70 border border-[#D8C9BD] text-xs text-[#393331] focus:outline-none focus:border-[#985858]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#D8C9BD]/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[#393331]/75 font-medium">Coleção Olfativa:</label>
              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                disabled={categoryFilter === 'cuidados_pessoais'}
                className="px-3 py-1.5 bg-[#F6F1EB] border border-[#D8C9BD] text-xs text-[#393331] focus:outline-none focus:border-[#985858] disabled:opacity-40"
              >
                <option value="all">Todas as 10 Coleções</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.atmosphereTag})
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-[#393331]/80">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-[#985858]"
              />
              <span>Apenas itens em estoque</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#393331]/75 font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 bg-[#F6F1EB] border border-[#D8C9BD] text-xs text-[#393331] focus:outline-none focus:border-[#985858]"
            >
              <option value="featured">Destaques da Curadoria</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="name_asc">Ordem Alfabética (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-12 text-center space-y-4">
          <p className="font-serif-editorial text-2xl text-[#393331]">
            Nenhum produto encontrado para os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              setCollectionFilter('all');
              setSearchQuery('');
              setOnlyInStock(false);
            }}
            className="px-5 py-2.5 bg-[#985858] text-white text-xs font-medium"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              collection={product.collectionId ? collectionMap.get(product.collectionId) : undefined}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 3. COLEÇÕES OLFATIVAS (Linha A — 10 Coleções, cada uma com Difusor de Ambiente e Kit Aromático)
 */
export const ColecoesOlfativasView: React.FC<{
  collections: OlfactoryCollection[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onNavigate: (page: string) => void;
}> = ({ collections, products, onSelectProduct, onAddToCart, onNavigate }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collections[0]?.id || 'colecao-1');

  const activeCollection =
    collections.find((c) => c.id === selectedCollectionId) || collections[0];

  const activeCollectionProducts = products.filter(
    (p) => p.collectionId === activeCollection?.id
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14 space-y-14 pb-20">
      <div className="space-y-4 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
          Linha A · 10 Coleções Olfativas Avidore
        </div>
        <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] font-normal">
          Cada fragrância carrega uma atmosfera.
        </h1>
        <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
          O universo olfativo da Avidore é organizado em 10 coleções autorais. Cada coleção foi concebida para compor o
          ambiente por meio de duas apresentações complementares: o <strong>Difusor de Ambiente</strong> e o{' '}
          <strong>Kit Aromático</strong>. Selecione uma coleção abaixo para explorar seu conceito e seus produtos.
        </p>
      </div>

      {/* Seletor das 10 Coleções */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {collections.map((col) => {
          const isSelected = col.id === activeCollection?.id;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setSelectedCollectionId(col.id)}
              className={`p-3.5 border text-left transition-colors flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#393331] text-[#FFFFFF] border-[#393331]'
                  : 'bg-[#FFFFFF] text-[#393331] border-[#D8C9BD]/80 hover:border-[#985858]'
              }`}
            >
              <span className="text-[11px] uppercase tracking-widest opacity-70">Coleção</span>
              <span className="font-serif-editorial text-2xl font-medium mt-1">{col.romanNumeral}</span>
            </button>
          );
        })}
      </div>

      {/* Detalhe da Coleção Selecionada + Seus 2 Produtos (Difusor + Kit Aromático) */}
      {activeCollection && (
        <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-b border-[#D8C9BD]/60 pb-10">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-xs text-[#985858] uppercase tracking-widest font-medium">
                <span>{activeCollection.code}</span>
                <span>·</span>
                <span>{activeCollection.atmosphereTag}</span>
              </div>
              <h2 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331]">
                {activeCollection.name} — {activeCollection.subtitle}
              </h2>
              <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
                {activeCollection.conceptDescription}
              </p>
              <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60 text-xs text-[#393331]/80 space-y-1">
                <div className="font-semibold text-[#393331]">Apresentação da Fragrância</div>
                <p>{activeCollection.fragrancePresentation}</p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F6F1EB] border border-[#D8C9BD]/70 p-6 space-y-4">
              <div className="text-xs uppercase tracking-[0.16em] text-[#985858] font-medium">
                Estrutura Olfativa · {activeCollection.code}
              </div>
              <div className="space-y-3 text-xs text-[#393331]/85">
                <div className="border-b border-[#D8C9BD]/50 pb-2.5">
                  <strong className="block text-[#393331]">Notas de Saída (Topo)</strong>
                  <span>{activeCollection.topNotesPlaceholder}</span>
                </div>
                <div className="border-b border-[#D8C9BD]/50 pb-2.5">
                  <strong className="block text-[#393331]">Notas de Corpo (Coração)</strong>
                  <span>{activeCollection.heartNotesPlaceholder}</span>
                </div>
                <div className="border-b border-[#D8C9BD]/50 pb-2.5">
                  <strong className="block text-[#393331]">Notas de Fundo (Base)</strong>
                  <span>{activeCollection.baseNotesPlaceholder}</span>
                </div>
                <div>
                  <strong className="block text-[#393331]">Direção Visual e Materiais</strong>
                  <span>{activeCollection.visualTheme.botanicalAccent}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Os 2 Produtos da Coleção (Difusor de Ambiente + Kit Aromático) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.16em] text-[#985858]">
                  Escolha sua apresentação na {activeCollection.name}
                </span>
                <h3 className="font-serif-editorial text-2xl lg:text-3xl text-[#393331]">
                  Difusor de Ambiente &amp; Kit Aromático
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('experiencia')}
                className="text-xs font-medium text-[#985858] hover:underline"
              >
                Deseja sentir esta coleção pessoalmente no Laboratório? Agende sua visita →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeCollectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  collection={activeCollection}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visão Geral de Todas as 10 Coleções */}
      <div className="space-y-6 pt-4">
        <h2 className="font-serif-editorial text-3xl text-[#393331]">
          Panorama das 10 Coleções Olfativas (20 produtos)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => {
            const colProducts = products.filter((p) => p.collectionId === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#FFFFFF] border border-[#D8C9BD]/70 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2">
                  <div className="text-xs text-[#985858] uppercase tracking-wider">
                    {col.code} · {col.atmosphereTag}
                  </div>
                  <h3 className="font-serif-editorial text-2xl text-[#393331]">{col.name}</h3>
                  <p className="text-xs text-[#393331]/75 leading-relaxed">{col.conceptDescription}</p>
                </div>
                <div className="pt-4 border-t border-[#D8C9BD]/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {colProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectProduct(p)}
                        className="px-3 py-1.5 bg-[#F6F1EB] border border-[#D8C9BD] text-xs text-[#393331] hover:border-[#985858]"
                      >
                        {p.category === 'difusor_ambiente' ? 'Ver Difusor' : 'Ver Kit Aromático'} (
                        {formatCurrencyBRL(p.promotionalPrice ?? p.price)})
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-medium text-[#985858] hover:underline"
                  >
                    Abrir Coleção {col.romanNumeral} ↑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * 4. LINHA DE CUIDADOS PESSOAIS (Linha B — 3 Produtos padronizados por indústria parceira)
 */
export const CuidadosPessoaisView: React.FC<{
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}> = ({ products, onSelectProduct, onAddToCart }) => {
  const cosmeticProducts = products.filter((p) => p.line === 'cuidados_pessoais');

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14 space-y-14 pb-20">
      <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-5">
          <div className="text-xs uppercase tracking-[0.18em] text-[#985858] font-medium">
            Linha B · Cuidados Pessoais Avidore
          </div>
          <h1 className="font-serif-editorial text-4xl lg:text-5xl text-[#393331] font-normal leading-[1.12]">
            Cuidado diário com qualidade industrial e curadoria estética Avidore.
          </h1>
          <p className="text-sm lg:text-base text-[#393331]/80 leading-relaxed">
            A Linha de Cuidados Pessoais Avidore reúne três produtos essenciais para a rotina da pele:{' '}
            <strong>Creme de Hidratação</strong>, <strong>Sabonete de Limpeza Facial</strong> e <strong>Sérum</strong>.
            Fabricados por indústria cosmética parceira homologada e comercializados sob a marca Avidore, possuem
            formulações padronizadas, desenvolvidas com rigor técnico e total transparência regulatória.
          </p>
        </div>

        <div className="lg:col-span-4 bg-[#F6F1EB] border border-[#D8C9BD]/70 p-6 space-y-3 text-xs text-[#393331]/80">
          <div className="font-semibold text-[#393331] uppercase tracking-wider">Compromisso de Transparência</div>
          <p>
            • Formulações padronizadas pela indústria parceira fornecedora (sem personalização individual de fórmula).
          </p>
          <p>
            • Composição INCI, volume, modo de uso e dados regulatórios Anvisa exibidos na página individual de cada
            produto conforme rotulagem oficial.
          </p>
          <p>• Comunicação responsável, livre de promessas terapêuticas ou alegações não comprovadas.</p>
        </div>
      </div>

      {/* Os 3 Produtos de Cuidados Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cosmeticProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Quadro Comparativo Técnico dos 3 Produtos */}
      <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 space-y-6">
        <h2 className="font-serif-editorial text-3xl text-[#393331]">
          Estrutura Técnica da Linha de Cuidados Pessoais
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D8C9BD] text-[#393331]">
                <th className="py-3 pr-4 font-semibold">Produto</th>
                <th className="py-3 px-4 font-semibold">Origem de Fabricação</th>
                <th className="py-3 px-4 font-semibold">Composição &amp; Volume</th>
                <th className="py-3 px-4 font-semibold">Status Regulatório</th>
                <th className="py-3 pl-4 font-semibold text-right">Ficha Individual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C9BD]/50 text-[#393331]/80">
              {cosmeticProducts.map((p) => (
                <tr key={p.id}>
                  <td className="py-4 pr-4 font-medium text-[#393331]">{p.name}</td>
                  <td className="py-4 px-4">Indústria Parceira Homologada (Fórmula Padronizada)</td>
                  <td className="py-4 px-4">{p.volumePlaceholder}</td>
                  <td className="py-4 px-4">{p.regulatoryInfo.anvisaProcessPlaceholder}</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(p)}
                      className="text-[#985858] font-medium hover:underline"
                    >
                      Abrir página do produto →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. PÁGINA INDIVIDUAL DE PRODUTO (PDP — Contiguous Purchase Module)
 */
export const ProdutoIndividualView: React.FC<{
  product: Product;
  collection?: OlfactoryCollection;
  relatedProducts: Product[];
  settings: StoreSettings;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, variationId?: string) => void;
  onCalculateShipping: (cep: string, subtotal: number) => Promise<ShippingOption[]>;
}> = ({
  product,
  collection,
  relatedProducts,
  settings,
  onBack,
  onSelectProduct,
  onAddToCart,
  onCalculateShipping,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<string | undefined>(
    product.variations?.[0]?.id
  );
  const [activeGalleryAngle, setActiveGalleryAngle] = useState<'frontal' | 'detalhe' | 'ambiente'>('frontal');
  const [activeTab, setActiveTab] = useState<'descricao' | 'composicao' | 'uso' | 'regulatorio'>('descricao');

  // Shipping calculator on PDP
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const effectivePrice = product.promotionalPrice ?? product.price;

  const handleCalcCep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim()) return;
    setCalculatingShipping(true);
    try {
      const opts = await onCalculateShipping(cep, effectivePrice * quantity);
      setShippingOptions(opts);
    } finally {
      setCalculatingShipping(false);
    }
  };

  const productWaUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    'produto',
    `${product.name} (SKU: ${product.sku})`
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-16 pb-20">
      {/* Breadcrumb & Voltar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8C9BD]/60 pb-4 text-xs text-[#393331]/70">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#393331] hover:text-[#985858] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao catálogo
        </button>
        <div className="flex items-center gap-2">
          <span>Loja Avidore</span>
          <span>·</span>
          <span>{product.line === 'olfativa' ? 'Coleções Olfativas' : 'Linha de Cuidados Pessoais'}</span>
          <span>·</span>
          <span className="text-[#393331] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Contiguous Purchase Module (Gallery Left + Purchase Spec Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Galeria de Fotografias (Left) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/5] w-full bg-[#FFFFFF] border border-[#D8C9BD]/80 overflow-hidden relative">
            <ProductStudioVisual
              shape={product.visualStyle.bottleShape}
              accentColor={
                activeGalleryAngle === 'detalhe'
                  ? '#393331'
                  : activeGalleryAngle === 'ambiente'
                  ? '#8C6D58'
                  : product.visualStyle.accentColor
              }
              surfaceTone={
                activeGalleryAngle === 'ambiente' ? '#EFEAE2' : product.visualStyle.surfaceTone
              }
              collectionRoman={collection?.romanNumeral || 'I'}
              labelSubtitle={product.name}
              className="w-full h-full"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#D8C9BD]/60 px-3.5 py-2 text-[11px] text-[#393331]/75 flex items-center justify-between">
              <span>
                {activeGalleryAngle === 'frontal' && '01. Apresentação Frontal em Pedestal de Travertino'}
                {activeGalleryAngle === 'detalhe' && '02. Detalhe de Acabamento e Rotulagem Editorial'}
                {activeGalleryAngle === 'ambiente' && '03. Proporção em Luz Natural Arquitetônica'}
              </span>
              <span className="uppercase tracking-wider text-[#985858]">Placeholder Fotográfico Oficial</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'frontal', label: '01. Estúdio Frontal' },
              { id: 'detalhe', label: '02. Detalhe Rótulo' },
              { id: 'ambiente', label: '03. Luz Natural' },
            ].map((thumb) => (
              <button
                key={thumb.id}
                type="button"
                onClick={() => setActiveGalleryAngle(thumb.id as typeof activeGalleryAngle)}
                className={`p-3 border text-left text-xs transition-colors ${
                  activeGalleryAngle === thumb.id
                    ? 'border-[#985858] bg-[#FFFFFF] text-[#393331] font-medium'
                    : 'border-[#D8C9BD]/60 bg-[#F6F1EB] text-[#393331]/70 hover:border-[#393331]/40'
                }`}
              >
                {thumb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Módulo de Compra Contíguo (Right) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#D8C9BD]/80 p-8 lg:p-10 space-y-6">
          <div className="space-y-2 border-b border-[#D8C9BD]/60 pb-5">
            <div className="flex items-center gap-2 text-xs text-[#985858] uppercase tracking-wider font-medium">
              <span>SKU: {product.sku}</span>
              <span>·</span>
              <span>
                {product.line === 'olfativa'
                  ? collection?.name || 'Coleção Olfativa'
                  : 'Linha de Cuidados Pessoais (Fórmula Padronizada)'}
              </span>
            </div>
            <h1 className="font-serif-editorial text-3xl lg:text-4xl text-[#393331] font-normal">
              {product.name}
            </h1>
            <p className="text-xs text-[#393331]/70">{product.subtitle}</p>
          </div>

          {/* Preço & Estoque */}
          <div className="flex items-baseline justify-between gap-4">
            <div className="tabular-nums">
              {product.promotionalPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold text-[#985858]">
                    {formatCurrencyBRL(product.promotionalPrice)}
                  </span>
                  <span className="text-sm text-[#393331]/50 line-through">
                    {formatCurrencyBRL(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-semibold text-[#393331]">
                  {formatCurrencyBRL(product.price)}
                </span>
              )}
              <div className="text-xs text-[#393331]/65 mt-1">
                Em até 3x sem juros no cartão ou via Pix com aprovação imediata
              </div>
            </div>

            <div className="text-right text-xs tabular-nums">
              {product.stock > 0 ? (
                <span className="text-[#393331] font-medium">
                  Em estoque ({product.stock} un. disponíveis)
                </span>
              ) : (
                <span className="text-[#985858] font-medium">Temporariamente sem estoque</span>
              )}
            </div>
          </div>

          {/* Volume / Especificação Oficial Placeholder */}
          <div className="p-3.5 bg-[#F6F1EB] border border-[#D8C9BD]/60 text-xs text-[#393331]/80 flex items-center justify-between">
            <span className="font-medium text-[#393331]">Volume / Apresentação:</span>
            <span>{product.volumePlaceholder}</span>
          </div>

          {/* Variações (quando existirem — sem personalização de fórmula para cosméticos) */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#393331]">Apresentação disponível:</label>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariationId(v.id)}
                    className={`px-3.5 py-2 text-xs border transition-colors ${
                      selectedVariationId === v.id
                        ? 'border-[#985858] bg-[#F6F1EB] text-[#393331] font-medium'
                        : 'border-[#D8C9BD] text-[#393331]/75'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantidade + Botão Adicionar à Sacola */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center border border-[#D8C9BD] bg-[#F6F1EB]/60">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-sm font-medium text-[#393331] hover:bg-[#D8C9BD]/30"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="px-4 py-3 text-sm font-medium text-[#393331] tabular-nums min-w-[44px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(Math.max(1, product.stock), q + 1))}
                className="px-4 py-3 text-sm font-medium text-[#393331] hover:bg-[#D8C9BD]/30"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => onAddToCart(product, quantity, selectedVariationId)}
              className="flex-1 py-3.5 px-6 bg-[#985858] text-white text-sm font-medium hover:bg-[#7d4545] transition-colors disabled:opacity-40 inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock > 0 ? 'Adicionar à sacola' : 'Produto indisponível'}
            </button>
          </div>

          {/* Canal de Apoio WhatsApp */}
          <div className="pt-2">
            <a
              href={productWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackAvidoreEvent('contact_whatsapp', { context: 'pdp_specialist', sku: product.sku })
              }
              className="w-full py-2.5 px-4 border border-[#D8C9BD] text-xs font-medium text-[#393331] hover:border-[#985858] hover:text-[#985858] transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Dúvidas sobre este produto ou deseja sentir antes no laboratório? Fale no WhatsApp
            </a>
          </div>

          {/* Cálculo de Prazo de Entrega e Opções de Envio */}
          <div className="pt-5 border-t border-[#D8C9BD]/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#393331]">
              <Truck className="w-4 h-4 text-[#985858]" />
              <span>Simular prazo de entrega e opções de envio</span>
            </div>
            <form onSubmit={handleCalcCep} className="flex gap-2">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP (ex.: 87020-025)"
                className="flex-1 px-3.5 py-2 bg-[#F6F1EB]/70 border border-[#D8C9BD] text-xs text-[#393331] focus:outline-none focus:border-[#985858] tabular-nums"
              />
              <button
                type="submit"
                disabled={calculatingShipping}
                className="px-4 py-2 bg-[#393331] text-white text-xs font-medium hover:bg-[#393331]/90"
              >
                {calculatingShipping ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {shippingOptions && (
              <div className="space-y-2 pt-2">
                {shippingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-3 bg-[#F6F1EB] border border-[#D8C9BD]/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-[#393331]">{opt.serviceName}</div>
                      <div className="text-[#393331]/70">
                        {opt.estimatedDays} · {opt.regionNote}
                      </div>
                    </div>
                    <div className="font-semibold text-[#393331] tabular-nums">
                      {opt.price === 0 ? 'Grátis' : formatCurrencyBRL(opt.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Abas de Informações Detalhadas, Composição, Modo de Uso e Regulatório */}
      <div className="bg-[#FFFFFF] border border-[#D8C9BD]/80">
        <div className="flex flex-wrap border-b border-[#D8C9BD]/70 bg-[#F6F1EB]/60">
          {[
            { id: 'descricao', label: 'Descrição e Características' },
            {
              id: 'composicao',
              label:
                product.line === 'olfativa'
                  ? 'Apresentação da Fragrância e Notas'
                  : 'Composição INCI e Ingredientes',
            },
            { id: 'uso', label: 'Modo de Uso' },
            { id: 'regulatorio', label: 'Informações Regulatórias (ANVISA)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-4 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#985858] text-[#985858] bg-[#FFFFFF]'
                  : 'border-transparent text-[#393331]/70 hover:text-[#393331]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 lg:p-10 text-sm text-[#393331]/85 leading-relaxed space-y-6">
          {activeTab === 'descricao' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-serif-editorial text-2xl text-[#393331]">Conceito e Apresentação</h2>
                <p>{product.fullDescription}</p>
              </div>
              <div className="lg:col-span-5 space-y-3 bg-[#F6F1EB] p-6 border border-[#D8C9BD]/60">
                <h3 className="font-serif-editorial text-xl text-[#393331]">Características Técnicas</h3>
                <ul className="space-y-2 text-xs">
                  {product.characteristics.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#985858] shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'composicao' && (
            <div className="space-y-4 max-w-3xl">
              {product.line === 'olfativa' && product.olfactoryNotes ? (
                <>
                  <h2 className="font-serif-editorial text-2xl text-[#393331]">
                    Pirâmide Olfativa e Família Aromática
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Família Olfativa</strong>
                      {product.olfactoryNotes.family}
                    </div>
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Notas de Topo (Saída)</strong>
                      {product.olfactoryNotes.top}
                    </div>
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Notas de Corpo (Coração)</strong>
                      {product.olfactoryNotes.heart}
                    </div>
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Notas de Fundo (Base)</strong>
                      {product.olfactoryNotes.base}
                    </div>
                  </div>
                </>
              ) : product.cosmeticDetails ? (
                <>
                  <h2 className="font-serif-editorial text-2xl text-[#393331]">
                    Composição Cosmética Padronizada (Indústria Parceira)
                  </h2>
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Nota sobre Fabricação e Padronização</strong>
                      {product.cosmeticDetails.partnerManufacturingNote}
                    </div>
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Composição (INCI)</strong>
                      {product.cosmeticDetails.compositionInci}
                    </div>
                    <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60">
                      <strong className="block text-[#393331] mb-1">Ingredientes em Português</strong>
                      {product.cosmeticDetails.ingredientsSummary}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {activeTab === 'uso' && (
            <div className="space-y-3 max-w-2xl">
              <h2 className="font-serif-editorial text-2xl text-[#393331]">Modo de Uso e Recomendações</h2>
              <p>{product.usageInstructions}</p>
            </div>
          )}

          {activeTab === 'regulatorio' && (
            <div className="space-y-4 max-w-3xl text-xs">
              <h2 className="font-serif-editorial text-2xl text-[#393331]">
                Conformidade Regulatória e Notificação Sanitária
              </h2>
              <div className="p-4 bg-[#F6F1EB] border border-[#D8C9BD]/60 space-y-2">
                <div>
                  <strong className="text-[#393331]">Status de Publicação: </strong>
                  <span>
                    {product.regulatoryInfo.status === 'publicado'
                      ? 'Regularizado para comercialização'
                      : 'Modo de Rascunho / Pré-lançamento — Aguardando inserção dos dados regulatórios oficiais'}
                  </span>
                </div>
                <div>
                  <strong className="text-[#393331]">Processo / Notificação ANVISA: </strong>
                  <span>{product.regulatoryInfo.anvisaProcessPlaceholder}</span>
                </div>
                <div>
                  <strong className="text-[#393331]">Lote e Rastreabilidade: </strong>
                  <span>{product.regulatoryInfo.batchPlaceholder}</span>
                </div>
                <p className="text-[#393331]/75 pt-1">{product.regulatoryInfo.technicalResponsibleNote}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-editorial text-3xl text-[#393331]">Produtos Relacionados</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                collection={collection}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p, q) => onAddToCart(p, q)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
