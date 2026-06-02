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
    { full_name: 'مدیر کل (دانیال دیجی)', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { full_name: 'مدیر فروش (دانیال دیجی)', email: 'sales@example.com', password: 'sales123', role: 'sales_manager' },
    { full_name: 'دانیال دانیالی', email: 'user@example.com', password: 'user123', role: 'customer' }
  ];

  for (const u of users) {
    let user = await User.findOne({ where: { email: u.email } });
    if (!user) {
      const password_hash = await bcrypt.hash(u.password, 10);
      await User.create({ full_name: u.full_name, email: u.email, password_hash, role: u.role, status: 'active' });
    }
  }
}

async function seedData() {
  const admin = await User.findOne({ where: { role: 'admin' } });

  const cats = [
    { name: 'کالای دیجیتال', sub: ['موبایل', 'لپ‌تاپ', 'ساعت هوشمند'] },
    { name: 'مد و پوشاک', sub: ['مردانه', 'زنانه', 'اکسسوری'] },
    { name: 'خانه و آشپزخانه', sub: ['لوازم برقی', 'دکوراسیون'] },
  ];

  for (const c of cats) {
    const parent = await Category.create({ name: c.name, slug: makeSlug(c.name), created_by_user_id: admin.id });
    for (const s of c.sub) {
      await Category.create({ name: s, slug: makeSlug(s), parent_id: parent.id, created_by_user_id: admin.id });
    }
  }

  const mobileCat = await Category.findOne({ where: { name: 'موبایل' } });
  const laptopCat = await Category.findOne({ where: { name: 'لپ‌تاپ' } });
  const watchCat = await Category.findOne({ where: { name: 'ساعت هوشمند' } });
  const menCat = await Category.findOne({ where: { name: 'مردانه' } });

  const products = [
    {
      title: 'گوشی موبایل سامسونگ Galaxy S23 Ultra', price: 52000000, cat: mobileCat.id,
      imgs: ['https://picsum.photos/seed/s23/600/600', 'https://picsum.photos/seed/s23b/600/600'],
      attrs: [{n:'رم', v:'۱۲ گیگابایت'}, {n:'حافظه', v:'۲۵۶ گیگابایت'}]
    },
    {
      title: 'لپ‌تاپ اپل MacBook Pro M2', price: 84000000, cat: laptopCat.id,
      imgs: ['https://picsum.photos/seed/mac/600/600'],
      attrs: [{n:'پردازنده', v:'M2'}, {n:'رم', v:'۱۶ گیگابایت'}]
    },
    {
      title: 'آیفون ۱۴ پرو مکس', price: 65000000, cat: mobileCat.id,
      imgs: ['https://picsum.photos/seed/iphone14/600/600'],
      attrs: [{n:'رنگ', v:'بنفش'}, {n:'باتری', v:'۴۳۲۳ میلی‌آمپر'}]
    },
    {
      title: 'ساعت هوشمند اپل سری ۸', price: 18000000, cat: watchCat.id,
      imgs: ['https://picsum.photos/seed/aw8/600/600'],
      attrs: [{n:'سایز', v:'۴۵ میلی‌متر'}]
    },
    {
      title: 'لپ‌تاپ گیمینگ لنوو Legion 5', price: 48000000, cat: laptopCat.id,
      imgs: ['https://picsum.photos/seed/legion/600/600'],
      attrs: [{n:'کارت گرافیک', v:'RTX 3060'}]
    },
    {
      title: 'هودی مردانه طرح نایک', price: 850000, cat: menCat.id,
      imgs: ['https://picsum.photos/seed/hoodie/600/600'],
      attrs: [{n:'جنس', v:'دورس'}]
    },
    {
        title: 'گوشی شیائومی Redmi Note 12', price: 12000000, cat: mobileCat.id,
        imgs: ['https://picsum.photos/seed/redmi/600/600'],
        attrs: [{n:'رم', v:'۸ گیگابایت'}]
    },
    {
        title: 'تبلت سامسونگ Tab S8', price: 28000000, cat: mobileCat.id,
        imgs: ['https://picsum.photos/seed/tabs8/600/600'],
        attrs: [{n:'صفحه نمایش', v:'۱۱ اینچ'}]
    },
    {
        title: 'هدفون سونی WH-1000XM5', price: 15000000, cat: mobileCat.id,
        imgs: ['https://picsum.photos/seed/sony/600/600'],
        attrs: [{n:'حذف نویز', v:'دارد'}]
    },
    {
        title: 'کفش ورزشی آدیداس', price: 3200000, cat: menCat.id,
        imgs: ['https://picsum.photos/seed/shoes/600/600'],
        attrs: [{n:'سایز', v:'۴۲'}]
    }
  ];

  for (const p of products) {
    const product = await Product.create({
      title: p.title, slug: makeSlug(p.title), description: `توضیحات محصول دانیال دیجی برای ${p.title}. بهترین قیمت و کیفیت در فروشگاه ما.`,
      price: p.price, stock: 20, category_id: p.cat, created_by_user_id: admin.id
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
    console.log('🎉 Danial Digi Seed Successful');
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
})();
