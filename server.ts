import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialDatabase } from './src/data/initialStoreData.ts';
import { AvidoreDatabase, CommercialLead, Coupon, OlfactoryCollection, Order, Product, ShippingOption } from './src/types/avidore.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'avidore-db.json');

function loadDatabase(): AvidoreDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), 'utf-8');
      return structuredClone(initialDatabase);
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as AvidoreDatabase;
  } catch (err) {
    console.error('Error loading database, falling back to initialDatabase:', err);
    return structuredClone(initialDatabase);
  }
}

function saveDatabase(db: AvidoreDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

export function calculateShippingOptions(cepRaw: string, subtotal: number, freeThreshold: number): ShippingOption[] {
  const cleanCep = (cepRaw || '').replace(/\D/g, '');
  const isFree = subtotal >= freeThreshold;

  // Paraná CEPs start with 80 to 87. North Paraná (Maringá 870xx, Astorga 86730, Londrina 860xx)
  const isNorthParana =
    cleanCep.startsWith('86730') ||
    cleanCep.startsWith('870') ||
    cleanCep.startsWith('871') ||
    cleanCep.startsWith('860') ||
    cleanCep.startsWith('861') ||
    cleanCep.startsWith('866') ||
    cleanCep.startsWith('867') ||
    cleanCep.startsWith('868') ||
    cleanCep.startsWith('869');

  const isParana = cleanCep.startsWith('8');

  if (isNorthParana) {
    return [
      {
        id: 'retirada-astorga',
        carrier: 'Laboratório Avidore · Astorga/PR',
        serviceName: 'Retirada Agendada no Laboratório (com degustação olfativa)',
        estimatedDays: 'Disponível em 1 dia útil mediante agendamento',
        price: 0,
        regionNote: 'Astorga · PR',
      },
      {
        id: 'rota-norte-pr',
        carrier: 'Logística Dedicada Rota Norte PR',
        serviceName: 'Entrega Expressa Eixo Astorga · Maringá · Londrina',
        estimatedDays: '1 a 2 dias úteis',
        price: isFree ? 0 : 14.9,
        regionNote: isFree ? 'Frete Cortesia Avidore' : 'Tarifa reduzida regional',
      },
      {
        id: 'correios-sedex-pr',
        carrier: 'Correios SEDEX',
        serviceName: 'SEDEX Regional Paraná',
        estimatedDays: '2 a 3 dias úteis',
        price: isFree ? 0 : 21.5,
        regionNote: 'Com seguro e código de rastreio',
      },
    ];
  }

  if (isParana) {
    return [
      {
        id: 'correios-sedex-estadual',
        carrier: 'Correios SEDEX',
        serviceName: 'SEDEX Paraná',
        estimatedDays: '2 a 4 dias úteis',
        price: isFree ? 0 : 26.9,
        regionNote: 'Envio protegido anti-avaria com rastreamento',
      },
      {
        id: 'correios-pac-estadual',
        carrier: 'Correios PAC',
        serviceName: 'PAC Econômico Paraná',
        estimatedDays: '4 a 6 dias úteis',
        price: isFree ? 0 : 19.9,
        regionNote: 'Frete Cortesia acima de R$ ' + freeThreshold.toFixed(0),
      },
    ];
  }

  return [
    {
      id: 'jadlog-package-br',
      carrier: 'Jadlog · Embalagem Reforçada',
      serviceName: 'Jadlog Package Nacional',
      estimatedDays: '4 a 7 dias úteis',
      price: isFree ? 0 : 29.9,
      regionNote: 'Proteção dupla para frascos de vidro',
    },
    {
      id: 'correios-sedex-br',
      carrier: 'Correios SEDEX',
      serviceName: 'SEDEX Nacional',
      estimatedDays: '2 a 5 dias úteis',
      price: 42.9,
      regionNote: 'Entrega prioritária com seguro integral',
    },
  ];
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  // 1. Get entire store state
  app.get('/api/store', (_req, res) => {
    const db = loadDatabase();
    res.json(db);
  });

  // 2. Calculate shipping options by CEP
  app.post('/api/shipping/calculate', (req, res) => {
    const { cep, subtotal = 0 } = req.body || {};
    const db = loadDatabase();
    const options = calculateShippingOptions(
      String(cep || ''),
      Number(subtotal) || 0,
      db.settings.ecommercePlatformIntegration.freeShippingThreshold
    );
    res.json({ options });
  });

  // 3. Validate Coupon
  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal = 0 } = req.body || {};
    const db = loadDatabase();
    const normalized = String(code || '').trim().toUpperCase();
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === normalized && c.active);
    if (!coupon) {
      res.status(404).json({ error: 'Cupom não encontrado ou expirado.' });
      return;
    }
    if (Number(subtotal) < coupon.minOrderValue) {
      res.status(400).json({
        error: `Este cupom requer valor mínimo de R$ ${coupon.minOrderValue.toFixed(2).replace('.', ',')} em produtos.`,
      });
      return;
    }
    res.json({ coupon });
  });

  // 4. Create Order (Checkout)
  app.post('/api/orders', (req, res) => {
    const db = loadDatabase();
    const payload = req.body;
    const orderNumber = `AVD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      shippingAddress: payload.shippingAddress,
      shippingMethod: payload.shippingMethod,
      items: payload.items || [],
      subtotal: Number(payload.subtotal) || 0,
      discount: Number(payload.discount) || 0,
      couponCode: payload.couponCode || undefined,
      shippingCost: Number(payload.shippingCost) || 0,
      total: Number(payload.total) || 0,
      paymentMethod: payload.paymentMethod || 'pix',
      paymentStatus: payload.paymentMethod === 'pix' ? 'aguardando_pagamento' : 'em_analise',
      fulfillmentStatus: 'recebido',
    };

    // Decrement stock for ordered items
    for (const item of newOrder.items) {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    db.orders.unshift(newOrder);
    saveDatabase(db);
    res.status(201).json({ order: newOrder });
  });

  // 5. Update Order status / tracking (Admin)
  app.patch('/api/orders/:id', (req, res) => {
    const db = loadDatabase();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    if (req.body.fulfillmentStatus) order.fulfillmentStatus = req.body.fulfillmentStatus;
    if (req.body.trackingCode !== undefined) order.trackingCode = req.body.trackingCode;
    saveDatabase(db);
    res.json({ order });
  });

  // 6. Submit Commercial Lead (Marketing Olfativo, Presentes Corporativos, Experiência no Laboratório, Contato)
  app.post('/api/leads', (req, res) => {
    const db = loadDatabase();
    const payload = req.body;
    const newLead: CommercialLead = {
      id: `lead-${Date.now()}`,
      type: payload.type || 'contato_geral',
      createdAt: new Date().toISOString(),
      name: payload.name || '',
      company: payload.company || '',
      segment: payload.segment || '',
      city: payload.city || '',
      whatsapp: payload.whatsapp || '',
      email: payload.email || '',
      desiredQuantity: payload.desiredQuantity || '',
      occasion: payload.occasion || '',
      customizationNeed: payload.customizationNeed || '',
      preferredDateOrShift: payload.preferredDateOrShift || '',
      interestContext: payload.interestContext || '',
      message: payload.message || '',
      status: 'novo',
    };
    db.leads.unshift(newLead);
    saveDatabase(db);
    res.status(201).json({ lead: newLead });
  });

  // 7. Update Lead Status (Admin)
  app.patch('/api/leads/:id', (req, res) => {
    const db = loadDatabase();
    const lead = db.leads.find((l) => l.id === req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }
    if (req.body.status) lead.status = req.body.status;
    saveDatabase(db);
    res.json({ lead });
  });

  // 8. Admin: Update or Create Product
  app.put('/api/products/:id', (req, res) => {
    const db = loadDatabase();
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    const updatedProduct: Product = req.body;
    if (idx >= 0) {
      db.products[idx] = { ...db.products[idx], ...updatedProduct };
    } else {
      db.products.unshift(updatedProduct);
    }
    saveDatabase(db);
    res.json({ product: updatedProduct });
  });

  // 9. Admin: Update Collection
  app.put('/api/collections/:id', (req, res) => {
    const db = loadDatabase();
    const idx = db.collections.findIndex((c) => c.id === req.params.id);
    if (idx < 0) {
      res.status(404).json({ error: 'Coleção não encontrada.' });
      return;
    }
    const updatedCollection: OlfactoryCollection = { ...db.collections[idx], ...req.body };
    db.collections[idx] = updatedCollection;
    saveDatabase(db);
    res.json({ collection: updatedCollection });
  });

  // 10. Admin: Create or Toggle Coupon
  app.post('/api/coupons', (req, res) => {
    const db = loadDatabase();
    const coupon: Coupon = {
      code: String(req.body.code || '').trim().toUpperCase(),
      description: String(req.body.description || ''),
      discountType: req.body.discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: Number(req.body.discountValue) || 10,
      minOrderValue: Number(req.body.minOrderValue) || 0,
      active: true,
    };
    const existingIdx = db.coupons.findIndex((c) => c.code === coupon.code);
    if (existingIdx >= 0) {
      db.coupons[existingIdx] = coupon;
    } else {
      db.coupons.push(coupon);
    }
    saveDatabase(db);
    res.json({ coupons: db.coupons });
  });

  app.patch('/api/coupons/:code', (req, res) => {
    const db = loadDatabase();
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === req.params.code.toUpperCase());
    if (!coupon) {
      res.status(404).json({ error: 'Cupom não encontrado.' });
      return;
    }
    coupon.active = Boolean(req.body.active);
    saveDatabase(db);
    res.json({ coupon });
  });

  // 11. Admin: Update Store Settings
  app.put('/api/settings', (req, res) => {
    const db = loadDatabase();
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json({ settings: db.settings });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AVIDORE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
