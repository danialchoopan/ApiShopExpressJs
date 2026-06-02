require('dotenv').config();

const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductAttribute,
} = require('../models');
const { makeSlug } = require('../utils/slugify');

async function upsertUsers() {
  const users = [
    { full_name: 'مدیر کل (Super Admin)', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { full_name: 'مدیر فروش (Sales Manager)', email: 'sales@example.com', password: 'sales123', role: 'sales_manager' },
    { full_name: 'مشتری تست', email: 'user@example.com', password: 'user123', role: 'customer' }
  ];

  for (const u of users) {
    let user = await User.findOne({ where: { email: u.email } });
    if (!user) {
      const password_hash = await bcrypt.hash(u.password, 10);
      await User.create({ full_name: u.full_name, email: u.email, password_hash, role: u.role, status: 'active' });
      console.log(`✅ User: ${u.email} (${u.role})`);
    }
  }
}

async function seedData() {
  const admin = await User.findOne({ where: { role: 'admin' } });

  // Categories
  const cats = [
    { name: 'کالای دیجیتال', sub: ['موبایل', 'لپ‌تاپ', 'هدفون'] },
    { name: 'مد و پوشاک', sub: ['مردانه', 'زنانه'] },
    { name: 'خانه و آشپزخانه', sub: ['لوازم برقی'] },
  ];

  for (const c of cats) {
    const parent = await Category.create({ name: c.name, slug: makeSlug(c.name), created_by_user_id: admin.id });
    for (const s of c.sub) {
      await Category.create({ name: s, slug: makeSlug(s), parent_id: parent.id, created_by_user_id: admin.id });
    }
  }

  const mobileCat = await Category.findOne({ where: { name: 'موبایل' } });
  const laptopCat = await Category.findOne({ where: { name: 'لپ‌تاپ' } });

  // Products
  const products = [
    {
      title: 'گوشی موبایل سامسونگ مدل Galaxy S23 Ultra',
      price: 52000000,
      cat: mobileCat.id,
      imgs: ['https://picsum.photos/seed/s23/600/600', 'https://picsum.photos/seed/s23b/600/600'],
      attrs: [{n:'رم', v:'۱۲ گیگابایت'}, {n:'حافظه', v:'۲۵۶ گیگابایت'}, {n:'رنگ', v:'سبز'}]
    },
    {
      title: 'لپ‌تاپ اپل مدل MacBook Pro M2',
      price: 84000000,
      cat: laptopCat.id,
      imgs: ['https://picsum.photos/seed/mac/600/600'],
      attrs: [{n:'پردازنده', v:'M2'}, {n:'رم', v:'۱۶ گیگابایت'}]
    },
    {
      title: 'هدفون بی‌سیم سونی مدل WH-1000XM5',
      price: 14500000,
      cat: mobileCat.id,
      imgs: ['https://picsum.photos/seed/sony/600/600'],
      attrs: [{n:'باتری', v:'۳۰ ساعت'}, {n:'نویز کنسلینگ', v:'دارد'}]
    }
  ];

  for (const p of products) {
    const product = await Product.create({
      title: p.title, slug: makeSlug(p.title), description: `توضیحات کامل برای ${p.title} با بهترین کیفیت و گارانتی معتبر.`,
      price: p.price, stock: 15, category_id: p.cat, created_by_user_id: admin.id
    });
    await ProductImage.bulkCreate(p.imgs.map((url, i) => ({ product_id: product.id, url, sort_order: i })));
    await ProductAttribute.bulkCreate(p.attrs.map(a => ({ product_id: product.id, name: a.n, value: a.v })));
  }
}

(async () => {
  try {
    await sequelize.sync({ force: true });
    await upsertUsers();
    await seedData();
    console.log('🎉 Final Seeding Successful');
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
})();
