const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

let db = {};
let client = null;

const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  const { MongoClient } = require('mongodb');
  client = new MongoClient(MONGODB_URI);
  const mongoDb = client.db();

  class MongoNeDBWrapper {
    constructor(collection) {
      this.col = collection;
    }
    find(query) {
      const cursor = this.col.find(query);
      const chain = {
        sort: (sortObj) => {
          cursor.sort(sortObj);
          return chain;
        },
        limit: (num) => {
          cursor.limit(num);
          return chain;
        },
        then: (onfulfilled, onrejected) => {
          return cursor.toArray().then(onfulfilled, onrejected);
        }
      };
      return chain;
    }
    async findOne(query) {
      return await this.col.findOne(query);
    }
    async insert(docs) {
      if (Array.isArray(docs)) {
        const res = await this.col.insertMany(docs);
        return docs.map((doc, idx) => ({ ...doc, _id: res.insertedIds[idx] }));
      } else {
        const res = await this.col.insertOne(docs);
        return { ...docs, _id: res.insertedId };
      }
    }
    async update(query, update, options = {}) {
      const mongoOptions = {};
      if (options.upsert) mongoOptions.upsert = true;
      if (options.multi) {
        return await this.col.updateMany(query, update, mongoOptions);
      } else {
        return await this.col.updateOne(query, update, mongoOptions);
      }
    }
    async remove(query, options = {}) {
      if (options.multi) {
        return await this.col.deleteMany(query);
      } else {
        return await this.col.deleteOne(query);
      }
    }
    async count(query) {
      return await this.col.countDocuments(query);
    }
  }

  db = {
    users:     new MongoNeDBWrapper(mongoDb.collection('users')),
    products:  new MongoNeDBWrapper(mongoDb.collection('products')),
    orders:    new MongoNeDBWrapper(mongoDb.collection('orders')),
    messages:  new MongoNeDBWrapper(mongoDb.collection('messages')),
    inventory: new MongoNeDBWrapper(mongoDb.collection('inventory')),
    batches:   new MongoNeDBWrapper(mongoDb.collection('batches')),
    settings:  new MongoNeDBWrapper(mongoDb.collection('settings')),
    counters:  new MongoNeDBWrapper(mongoDb.collection('counters')),
  };
} else {
  const Datastore = require('nedb-promises');
  const dbDir = path.join(__dirname, 'data');
  fs.mkdirSync(dbDir, { recursive: true });

  db = {
    users:     Datastore.create({ filename: path.join(dbDir, 'users.db'),     autoload: true }),
    products:  Datastore.create({ filename: path.join(dbDir, 'products.db'),  autoload: true }),
    orders:    Datastore.create({ filename: path.join(dbDir, 'orders.db'),    autoload: true }),
    messages:  Datastore.create({ filename: path.join(dbDir, 'messages.db'),  autoload: true }),
    inventory: Datastore.create({ filename: path.join(dbDir, 'inventory.db'), autoload: true }),
    batches:   Datastore.create({ filename: path.join(dbDir, 'batches.db'),   autoload: true }),
    settings:  Datastore.create({ filename: path.join(dbDir, 'settings.db'),  autoload: true }),
    counters:  Datastore.create({ filename: path.join(dbDir, 'counters.db'),  autoload: true }),
  };
}

async function nextId(name) {
  const doc = await db.counters.findOne({ _id: name });
  const next = (doc ? doc.seq : 0) + 1;
  await db.counters.update({ _id: name }, { $set: { seq: next } }, { upsert: true });
  return next;
}

async function initDB() {
  if (MONGODB_URI && client) {
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('Connected successfully to MongoDB');
  }

  // Seed admin users
  const adminExists = await db.users.findOne({ username: 'admin' });
  if (!adminExists) {
    await db.users.insert([
      {
        id: 1, name: 'Administrator', username: 'admin',
        password: bcrypt.hashSync('bole2024', 10),
        role: 'admin', phone: '+251939277772', email: 'admin@bolefeed.com',
        created_at: new Date().toISOString()
      },
      {
        id: 2, name: 'Sales Staff', username: 'staff',
        password: bcrypt.hashSync('staff123', 10),
        role: 'staff', phone: '', email: 'staff@bolefeed.com',
        created_at: new Date().toISOString()
      }
    ]);
    await db.counters.update({ _id: 'users' }, { $set: { seq: 2 } }, { upsert: true });
  }

  // Seed products
  const productCount = await db.products.count({});
  if (productCount === 0) {
    const now = new Date().toISOString();
    const products = [
      {
        id: 1, name: 'Layer Super Phase 1 Feed', category: 'Layer Feed',
        description: 'Complete & balanced nutrition for laying hens aged 18–45 weeks. Scientifically formulated to support maximum egg production, strong eggshell formation, and optimal body condition. Made from high-quality ingredients for better results.',
        weight_kg: 50, price_etb: 2800,
        protein: 'Min 16.5%', fat: 'Min 5.0%', fiber: 'Max 7.0%',
        calcium: 'Min 3.75%', moisture: 'Max 10.0%', energy: 'Min 2500 Kcal/Kg',
        target_animal: 'Laying hens 18–45 weeks',
        benefits: ['High Egg Production', 'Strong Eggshell Formation', 'Balanced Nutrition', 'Improved Feed Efficiency', 'Healthy Growth & Performance'],
        feeding_guide: 'Provide 110–120g per bird per day. Always ensure clean drinking water is available. Adjust feeding according to production stage and body weight.',
        emoji: '🐔', stock_qty: 420, min_stock_alert: 100,
        active: true, featured: true, created_at: now, updated_at: now
      },
      {
        id: 2, name: 'Layer Super Phase 2 Feed', category: 'Layer Feed',
        description: 'Optimized nutrition for mature laying hens 46 weeks and older. Higher calcium content supports sustained eggshell quality and bone density in peak and late production stages.',
        weight_kg: 50, price_etb: 2700,
        protein: 'Min 15.5%', fat: 'Min 4.5%', fiber: 'Max 7.5%',
        calcium: 'Min 4.0%', moisture: 'Max 10.0%', energy: 'Min 2400 Kcal/Kg',
        target_animal: 'Laying hens 46+ weeks',
        benefits: ['Sustained Egg Production', 'Superior Eggshell Quality', 'Bone Health Support', 'High Calcium Formula', 'Late-Lay Optimization'],
        feeding_guide: 'Provide 115–125g per bird per day. Monitor body condition regularly and adjust feeding rates accordingly.',
        emoji: '🥚', stock_qty: 310, min_stock_alert: 100,
        active: true, featured: true, created_at: now, updated_at: now
      },
      {
        id: 3, name: 'Broiler Starter Feed', category: 'Broiler Feed',
        description: 'High-protein starter formula for broiler chicks from day-old to 3 weeks. Supports rapid skeletal development, immune system strength and excellent early growth performance.',
        weight_kg: 50, price_etb: 3100,
        protein: 'Min 22.0%', fat: 'Min 5.5%', fiber: 'Max 5.0%',
        calcium: 'Min 1.0%', moisture: 'Max 10.0%', energy: 'Min 3000 Kcal/Kg',
        target_animal: 'Broiler chicks 0–3 weeks',
        benefits: ['Rapid Early Growth', 'Strong Immune System', 'Skeletal Development', 'High Protein Formula', 'Excellent Feed Conversion'],
        feeding_guide: 'Feed ad libitum (free choice) from day-old to 21 days. Provide fresh clean water at all times.',
        emoji: '🐣', stock_qty: 280, min_stock_alert: 80,
        active: true, featured: true, created_at: now, updated_at: now
      },
      {
        id: 4, name: 'Broiler Finisher Feed', category: 'Broiler Feed',
        description: 'Energy-dense finisher ration for broilers from 4 weeks to market weight. Promotes maximum weight gain, superior meat quality and optimal feed-to-gain ratio for profitable production.',
        weight_kg: 50, price_etb: 2950,
        protein: 'Min 19.0%', fat: 'Min 5.0%', fiber: 'Max 6.0%',
        calcium: 'Min 0.9%', moisture: 'Max 10.0%', energy: 'Min 2900 Kcal/Kg',
        target_animal: 'Broilers 4–7 weeks',
        benefits: ['Maximum Weight Gain', 'Superior Meat Quality', 'Optimal Feed Conversion', 'Energy Dense Formula', 'Market-Ready Performance'],
        feeding_guide: 'Feed ad libitum from week 4 to market. Withdraw feed 8–12 hours before slaughter.',
        emoji: '🍗', stock_qty: 195, min_stock_alert: 80,
        active: true, featured: false, created_at: now, updated_at: now
      },
      {
        id: 5, name: 'Dairy Cattle Feed', category: 'Dairy Feed',
        description: 'Nutritionally balanced concentrate for lactating dairy cows. Formulated to maximize milk yield, maintain reproductive efficiency and sustain optimal body condition throughout the lactation cycle.',
        weight_kg: 50, price_etb: 2200,
        protein: 'Min 14.0%', fat: 'Min 3.5%', fiber: 'Max 12.0%',
        calcium: 'Min 1.2%', moisture: 'Max 12.0%', energy: 'Min 2200 Kcal/Kg',
        target_animal: 'Lactating dairy cows',
        benefits: ['Increased Milk Production', 'Reproductive Health Support', 'Optimal Body Condition', 'Balanced Minerals & Vitamins', 'Cost-Effective Feeding'],
        feeding_guide: 'Feed 2–4kg per 10L of milk produced. Supplement with quality roughage and fresh water at all times.',
        emoji: '🐄', stock_qty: 115, min_stock_alert: 50,
        active: true, featured: false, created_at: now, updated_at: now
      },
    ];
    await db.products.insert(products);
    await db.counters.update({ _id: 'products' }, { $set: { seq: 5 } }, { upsert: true });
  }

  // Seed orders
  const orderCount = await db.orders.count({});
  if (orderCount === 0) {
    const orders = [
      { id:1, order_ref:'BOLE-0001', customer_name:'Abebe Girma',    customer_phone:'+251911234567', customer_email:'abebe@gmail.com', product_id:1, product_name:'Layer Super Phase 1 Feed', quantity:5,  unit_price:2800, total_price:14000, delivery_method:'delivery', delivery_address:'Bole Sub-City, Addis Ababa', notes:'', status:'delivered',  payment_status:'paid',    payment_method:'cash', admin_notes:'Regular customer', created_at:'2024-11-25T09:00:00.000Z', updated_at:'2024-11-27T10:00:00.000Z' },
      { id:2, order_ref:'BOLE-0002', customer_name:'Tigist Haile',   customer_phone:'+251922345678', customer_email:'',               product_id:2, product_name:'Layer Super Phase 2 Feed', quantity:10, unit_price:2700, total_price:27000, delivery_method:'pickup',   delivery_address:'',                         notes:'Call before coming', status:'confirmed',  payment_status:'unpaid',  payment_method:'cash', admin_notes:'', created_at:'2024-12-01T10:30:00.000Z', updated_at:'2024-12-01T12:00:00.000Z' },
      { id:3, order_ref:'BOLE-0003', customer_name:'Solomon Bekele', customer_phone:'+251933456789', customer_email:'',               product_id:3, product_name:'Broiler Starter Feed',     quantity:3,  unit_price:3100, total_price:9300,  delivery_method:'delivery', delivery_address:'Kirkos, Addis Ababa',      notes:'', status:'pending',    payment_status:'unpaid',  payment_method:'cash', admin_notes:'', created_at:'2024-12-05T14:00:00.000Z', updated_at:'2024-12-05T14:00:00.000Z' },
      { id:4, order_ref:'BOLE-0004', customer_name:'Meron Tadesse',  customer_phone:'+251944567890', customer_email:'meron@email.com',product_id:5, product_name:'Dairy Cattle Feed',        quantity:8,  unit_price:2200, total_price:17600, delivery_method:'delivery', delivery_address:'Akaki-Kaliti, Addis Ababa',notes:'Urgent', status:'pending',    payment_status:'partial', payment_method:'bank_transfer', admin_notes:'Partial payment received', created_at:'2024-12-06T11:00:00.000Z', updated_at:'2024-12-06T11:00:00.000Z' },
      { id:5, order_ref:'BOLE-0005', customer_name:'Dawit Tesfaye',  customer_phone:'+251955678901', customer_email:'',               product_id:4, product_name:'Broiler Finisher Feed',    quantity:4,  unit_price:2950, total_price:11800, delivery_method:'delivery', delivery_address:'Lideta, Addis Ababa',      notes:'', status:'processing', payment_status:'paid',    payment_method:'bank_transfer', admin_notes:'', created_at:'2024-12-07T09:15:00.000Z', updated_at:'2024-12-07T11:00:00.000Z' },
      { id:6, order_ref:'BOLE-0006', customer_name:'Hiwot Alemu',    customer_phone:'+251966789012', customer_email:'',               product_id:1, product_name:'Layer Super Phase 1 Feed', quantity:20, unit_price:2800, total_price:56000, delivery_method:'delivery', delivery_address:'Bole Michael, Addis Ababa',notes:'Monthly order', status:'confirmed',  payment_status:'paid',    payment_method:'bank_transfer', admin_notes:'Bulk wholesale customer', created_at:'2024-12-08T08:00:00.000Z', updated_at:'2024-12-08T09:00:00.000Z' },
    ];
    await db.orders.insert(orders);
    await db.counters.update({ _id: 'orders' }, { $set: { seq: 6 } }, { upsert: true });
  }

  // Seed messages
  const msgCount = await db.messages.count({});
  if (msgCount === 0) {
    await db.messages.insert([
      { id:1, name:'Hiwot Alemu', phone:'+251911111111', email:'hiwot@email.com', subject:'Bulk Order Inquiry',  message:'I need 50 bags of Layer Phase 1 every month for my poultry farm. Can you offer a wholesale price?', read:false, replied:false, created_at:'2024-12-08T06:00:00.000Z' },
      { id:2, name:'Yonas Mulat', phone:'+251922222222', email:'',                subject:'Delivery Coverage',   message:'Do you deliver to Sebeta? I have a poultry farm there with 2000 birds and need regular supply.', read:false, replied:false, created_at:'2024-12-08T03:00:00.000Z' },
      { id:3, name:'Almaz Worku', phone:'+251933333333', email:'',                subject:'Feeding Rate Query',  message:'What is the recommended daily feeding rate per bird for Layer Super Phase 1?', read:true, replied:true, admin_reply:'The recommended feeding rate is 110–120g per bird per day for Layer Phase 1. Always provide clean water at all times.', created_at:'2024-12-07T08:00:00.000Z' },
      { id:4, name:'Biruk Assefa',phone:'+251944444444', email:'',                subject:'Phase 1 vs Phase 2',  message:'What is the difference between Phase 1 and Phase 2? My hens are currently 50 weeks old.', read:true, replied:false, created_at:'2024-12-07T07:00:00.000Z' },
      { id:5, name:'Liya Solomon', phone:'+251955555555',email:'liya@farm.com',   subject:'Product Availability',message:'Do you have Broiler Starter in stock? I need 15 bags urgently for my new batch.', read:false, replied:false, created_at:'2024-12-09T10:00:00.000Z' },
    ]);
    await db.counters.update({ _id: 'messages' }, { $set: { seq: 5 } }, { upsert: true });
  }

  // Seed batches
  const batchCount = await db.batches.count({});
  if (batchCount === 0) {
    await db.batches.insert([
      { id:1, product_id:1, batch_no:'BOLE-L1-2024-001', mfg_date:'2024-10-01', exp_date:'2025-04-01', qty_produced:500, qty_remaining:420, notes:'Standard production run', created_at:'2024-10-01T07:00:00.000Z' },
      { id:2, product_id:2, batch_no:'BOLE-L2-2024-001', mfg_date:'2024-10-15', exp_date:'2025-04-15', qty_produced:400, qty_remaining:310, notes:'', created_at:'2024-10-15T07:00:00.000Z' },
      { id:3, product_id:3, batch_no:'BOLE-BS-2024-001', mfg_date:'2024-11-01', exp_date:'2025-05-01', qty_produced:350, qty_remaining:280, notes:'High demand — increased run', created_at:'2024-11-01T07:00:00.000Z' },
      { id:4, product_id:4, batch_no:'BOLE-BF-2024-001', mfg_date:'2024-11-10', exp_date:'2025-05-10', qty_produced:250, qty_remaining:195, notes:'', created_at:'2024-11-10T07:00:00.000Z' },
      { id:5, product_id:5, batch_no:'BOLE-DC-2024-001', mfg_date:'2024-11-20', exp_date:'2025-05-20', qty_produced:150, qty_remaining:115, notes:'Dairy cattle seasonal production', created_at:'2024-11-20T07:00:00.000Z' },
    ]);
    await db.counters.update({ _id: 'batches' }, { $set: { seq: 5 } }, { upsert: true });
  }

  // Seed settings
  const settingCount = await db.settings.count({});
  if (settingCount === 0) {
    await db.settings.insert([
      { key: 'company_name',     value: 'Bole Animal Feed Processing' },
      { key: 'company_tagline',  value: 'Quality Feed for Better Results' },
      { key: 'company_phone1',   value: '+251 939 277 772' },
      { key: 'company_phone2',   value: '+251 939 377 773' },
      { key: 'company_phone3',   value: '+251 711 277 771' },
      { key: 'company_email',    value: 'info@boleanimalfeed.com' },
      { key: 'company_address',  value: 'Bole Michael, Addis Ababa, Ethiopia' },
      { key: 'working_hours',    value: 'Mon–Sat: 8:00 AM – 6:00 PM | Sun: 9:00 AM – 1:00 PM' },
      { key: 'shelf_life_months',value: '6' },
      { key: 'currency',         value: 'ETB' },
      { key: 'about_text',       value: 'Bole Animal Feed Processing is a leading animal nutrition company based in Addis Ababa, Ethiopia. We specialize in manufacturing scientifically balanced feed products for poultry, dairy and livestock farmers across the country. Our commitment to quality ingredients, rigorous testing, and expert nutritional formulation ensures every bag delivers consistent results for your farm.' },
    ]);
  }

  console.log('✅ Bole Animal Feed database initialized');
}

module.exports = { db, initDB, nextId };
