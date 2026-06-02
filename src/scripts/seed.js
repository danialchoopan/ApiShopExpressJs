require('dotenv').config();

const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductAttribute,
  Order,
  OrderItem,
  Address
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
  const customer = await User.findOne({ where: { role: 'customer' } });

  const cats = [
    { name: 'کالای دیجیتال', sub: ['موبایل', 'لپ‌تاپ', 'ساعت هوشمند', 'هدفون', 'تبلت'] },
    { name: 'مد و پوشاک', sub: ['مردانه', 'زنانه', 'اکسسوری', 'کفش'] },
    { name: 'خانه و آشپزخانه', sub: ['لوازم برقی', 'دکوراسیون', 'ظروف'] },
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
  const headphoneCat = await Category.findOne({ where: { name: 'هدفون' } });
  const shoeCat = await Category.findOne({ where: { name: 'کفش' } });

  const products = [
    { title: 'گوشی موبایل سامسونگ Galaxy S23 Ultra', price: 52000000, cat: mobileCat.id, imgs: ['https://picsum.photos/seed/s23/600/600'], attrs: [{n:'رم', v:'۱۲ گیگابایت'}, {n:'حافظه', v:'۲۵۶ گیگابایت'}] },
    { title: 'لپ‌تاپ اپل MacBook Pro M2', price: 84000000, cat: laptopCat.id, imgs: ['https://picsum.photos/seed/mac/600/600'], attrs: [{n:'پردازنده', v:'M2'}, {n:'رم', v:'۱۶ گیگابایت'}] },
    { title: 'آیفون ۱۴ پرو مکس', price: 65000000, cat: mobileCat.id, imgs: ['https://picsum.photos/seed/iphone14/600/600'], attrs: [{n:'رنگ', v:'بنفش'}] },
    { title: 'ساعت هوشمند اپل سری ۸', price: 18000000, cat: watchCat.id, imgs: ['https://picsum.photos/seed/aw8/600/600'], attrs: [{n:'سایز', v:'۴۵ میلی‌متر'}] },
    { title: 'لپ‌تاپ گیمینگ لنوو Legion 5', price: 48000000, cat: laptopCat.id, imgs: ['https://picsum.photos/seed/legion/600/600'], attrs: [{n:'گرافیک', v:'RTX 3060'}] },
    { title: 'هودی مردانه طرح نایک', price: 850000, cat: menCat.id, imgs: ['https://picsum.photos/seed/hoodie/600/600'], attrs: [{n:'جنس', v:'دورس'}] },
    { title: 'گوشی شیائومی Redmi Note 12', price: 12000000, cat: mobileCat.id, imgs: ['https://picsum.photos/seed/redmi/600/600'], attrs: [{n:'رم', v:'۸ گیگابایت'}] },
    { title: 'هدفون سونی WH-1000XM5', price: 15000000, cat: headphoneCat.id, imgs: ['https://picsum.photos/seed/sony/600/600'], attrs: [{n:'نویز کنسلینگ', v:'دارد'}] },
    { title: 'کفش ورزشی آدیداس', price: 3200000, cat: shoeCat.id, imgs: ['https://picsum.photos/seed/shoes/600/600'], attrs: [{n:'سایز', v:'۴۲'}] },
    { title: 'مک بوک ایر M1', price: 42000000, cat: laptopCat.id, imgs: ['https://picsum.photos/seed/macair/600/600'], attrs: [{n:'پردازنده', v:'M1'}] },
    { title: 'گلکسی واچ ۵', price: 7500000, cat: watchCat.id, imgs: ['https://picsum.photos/seed/gw5/600/600'], attrs: [{n:'سایز', v:'۴۴'}] },
    { title: 'ایرپاد پرو ۲', price: 9200000, cat: headphoneCat.id, imgs: ['https://picsum.photos/seed/airpods/600/600'], attrs: [{n:'اتصال', v:'بلوتوث'}] },
    { title: 'تی‌شرت لانگ مردانه', price: 450000, cat: menCat.id, imgs: ['https://picsum.photos/seed/tshirt/600/600'], attrs: [{n:'رنگ', v:'مشکی'}] },
    { title: 'شلوار لی کلاسیک', price: 1200000, cat: menCat.id, imgs: ['https://picsum.photos/seed/jeans/600/600'], attrs: [{n:'سایز', v:'۴۴'}] },
    { title: 'کتری برقی بوش', price: 2800000, cat: Category.findOne({where:{name:'لوازم برقی'}}).id, imgs: ['https://picsum.photos/seed/kettle/600/600'], attrs: [{n:'توان', v:'۲۲۰۰ وات'}] },
    { title: 'قهوه‌ساز دلونگی', price: 6500000, cat: Category.findOne({where:{name:'لوازم برقی'}}).id, imgs: ['https://picsum.photos/seed/coffee/600/600'], attrs: [{n:'فشار بخار', v:'۱۵ بار'}] },
    { title: 'ساعت مچی هوشمند هوآوی', price: 4200000, cat: watchCat.id, imgs: ['https://picsum.photos/seed/hwatch/600/600'], attrs: [{n:'مدل', v:'GT3'}] },
    { title: 'ماوس گیمینگ ریزر', price: 2100000, cat: mobileCat.id, imgs: ['https://picsum.photos/seed/mouse/600/600'], attrs: [{n:'DPI', v:'۱۶۰۰۰'}] },
    { title: 'کیبورد مکانیکی تسکو', price: 1800000, cat: mobileCat.id, imgs: ['https://picsum.photos/seed/kb/600/600'], attrs: [{n:'نوع', v:'مکانیکی'}] },
    { title: 'پاوربانک ۲۰۰۰۰ شیائومی', price: 1400000, cat: mobileCat.id, imgs: ['https://picsum.photos/seed/pb/600/600'], attrs: [{n:'ظرفیت', v:'۲۰۰۰۰'}] }
  ];

  for (const p of products) {
    const product = await Product.create({
      title: p.title, slug: makeSlug(p.title), description: `محصول حرفه‌ای از دانیال دیجی برای ${p.title}. بالاترین کیفیت بازار با ضمانت بازگشت وجه.`,
      price: p.price, stock: 20, category_id: p.cat, created_by_user_id: admin.id
    });
    await ProductImage.bulkCreate(p.imgs.map((url, i) => ({ product_id: product.id, url, sort_order: i })));
    await ProductAttribute.bulkCreate(p.attrs.map(a => ({ product_id: product.id, name: a.n, value: a.v })));
  }

  // Create some sample orders
  const addr = await Address.create({
      user_id: customer.id, full_name: customer.full_name, phone: '09121234567',
      line1: 'تهران، خیابان آزادی، کوچه شماره ۱۰', city: 'تهران', province: 'تهران', is_default_shipping: true
  });

  const order = await Order.create({
      user_id: customer.id, order_number: 'ORD-1001', subtotal: 10000000, shipping_cost: 0, discount_total: 0, total: 10000000,
      payment_status: 'paid', status: 'completed', shipping_address_id: addr.id, billing_address_id: addr.id, placed_at: new Date()
  });
  await OrderItem.create({
      order_id: order.id, product_id: 1, title_snapshot: 'نمونه محصول', unit_price: 10000000, quantity: 1, line_total: 10000000
  });
}

(async () => {
  try {
    await sequelize.sync({ force: true });
    await upsertUsers();
    await seedData();
    console.log('🎉 Danial Digi Comprehensive Seed Successful');
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
})();
