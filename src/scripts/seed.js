require('dotenv').config();

const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
} = require('../models');
const { makeSlug } = require('../utils/slugify');

async function upsertAdmin() {
  const full_name = process.env.ADMIN_FULLNAME || 'Admin User';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const rawPass = process.env.ADMIN_PASSWORD || 'admin123';

  let admin = await User.findOne({ where: { email } });
  if (!admin) {
    const password_hash = await bcrypt.hash(rawPass, 10);
    admin = await User.create({
      full_name,
      email,
      password_hash,
      role: 'admin',
      status: 'active',
    });
    console.log(`✅ Admin created: ${email} / ${rawPass}`);
  } else {
    if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
    }
    console.log(`ℹ️ Admin exists: ${email}`);
  }
  return admin;
}

async function upsertCustomer() {
  const full_name = 'Customer User';
  const email = 'user@example.com';
  const rawPass = 'user123';

  let user = await User.findOne({ where: { email } });
  if (!user) {
    const password_hash = await bcrypt.hash(rawPass, 10);
    user = await User.create({
      full_name,
      email,
      password_hash,
      role: 'customer',
      status: 'active',
    });
    console.log(`✅ Customer created: ${email} / ${rawPass}`);
  }
  return user;
}

async function seedCategories(admin) {
  const base = [
    'الکترونیک',
    'پوشاک',
    'خانه و آشپزخانه',
  ];

  const count = await Category.count();
  if (count > 0) {
    console.log('ℹ️ Categories already present, skip seeding.');
    return await Category.findAll();
  }

  const rows = await Promise.all(
    base.map(name => Category.create({
      name,
      slug: makeSlug(name),
      parent_id: null,
      created_by_user_id: admin.id
    }))
  );
  console.log(`✅ Seeded ${rows.length} categories`);
  return rows;
}

async function seedProducts(admin, categories) {
  const data = [
    {
      title: 'گوشی موبایل مدل X',
      description: 'گوشی اقتصادی با باتری قوی',
      price: 8500000,
      stock: 20,
      sku: 'PHN-X-001',
      status: 'active',
      categoryName: 'الکترونیک',
      images: [{ url: 'https://picsum.photos/seed/phone/600/400', alt: 'phone' }],
    },
    {
      title: 'تی‌شرت کتان',
      description: 'راحت و سبک',
      price: 350000,
      stock: 100,
      sku: 'TSH-CTN-001',
      status: 'active',
      categoryName: 'پوشاک',
      images: [{ url: 'https://picsum.photos/seed/tshirt/600/400', alt: 'tshirt' }],
    },
    {
      title: 'کتری برقی',
      description: 'توان 2000 وات با قطع‌کن خودکار',
      price: 1200000,
      stock: 35,
      sku: 'KET-ELC-001',
      status: 'active',
      categoryName: 'خانه و آشپزخانه',
      images: [{ url: 'https://picsum.photos/seed/kettle/600/400', alt: 'kettle' }],
    },
    {
      title: 'لپ‌تاپ گیمینگ G5',
      description: 'قدرتمند برای بازی و کارهای سنگین',
      price: 45000000,
      stock: 5,
      sku: 'LTP-G5-002',
      status: 'active',
      categoryName: 'الکترونیک',
      images: [{ url: 'https://picsum.photos/seed/laptop/600/400', alt: 'laptop' }],
    },
    {
      title: 'هدفون بی‌سیم',
      description: 'کیفیت صدای عالی با حذف نویز',
      price: 2500000,
      stock: 50,
      sku: 'HDP-WLS-003',
      status: 'active',
      categoryName: 'الکترونیک',
      images: [{ url: 'https://picsum.photos/seed/headphone/600/400', alt: 'headphone' }],
    },
    {
      title: 'شلوار لی مردانه',
      description: 'جنس ترک با دوام بالا',
      price: 850000,
      stock: 40,
      sku: 'PNTS-DNM-002',
      status: 'active',
      categoryName: 'پوشاک',
      images: [{ url: 'https://picsum.photos/seed/jeans/600/400', alt: 'jeans' }],
    },
    {
      title: 'هودی زمستانی',
      description: 'گرم و نرم در رنگ‌های متنوع',
      price: 650000,
      stock: 60,
      sku: 'HOD-WNT-003',
      status: 'active',
      categoryName: 'پوشاک',
      images: [{ url: 'https://picsum.photos/seed/hoodie/600/400', alt: 'hoodie' }],
    },
    {
      title: 'جاروبرقی بوش',
      description: 'مکش فوق‌العاده با فیلتر هپا',
      price: 7500000,
      stock: 15,
      sku: 'VAC-BSH-002',
      status: 'active',
      categoryName: 'خانه و آشپزخانه',
      images: [{ url: 'https://picsum.photos/seed/vacuum/600/400', alt: 'vacuum' }],
    },
    {
      title: 'ست قابلمه چدن',
      description: '۱۰ پارچه با پوشش نانو',
      price: 3200000,
      stock: 25,
      sku: 'POT-IRN-003',
      status: 'active',
      categoryName: 'خانه و آشپزخانه',
      images: [{ url: 'https://picsum.photos/seed/pots/600/400', alt: 'pots' }],
    },
    {
      title: 'ساعت هوشمند سری ۷',
      description: 'پایش سلامت و اعلان‌های هوشمند',
      price: 1500000,
      stock: 30,
      sku: 'WCH-SMT-004',
      status: 'active',
      categoryName: 'الکترونیک',
      images: [{ url: 'https://picsum.photos/seed/watch/600/400', alt: 'watch' }],
    },
  ];

  const byName = new Map(categories.map(c => [c.name, c]));
  for (const p of data) {
    const cat = byName.get(p.categoryName);
    if (!cat) continue;

    const product = await Product.create({
      title: p.title,
      slug: makeSlug(p.title),
      description: p.description,
      price: p.price,
      stock: p.stock,
      sku: p.sku,
      status: p.status,
      category_id: cat.id,
      created_by_user_id: admin.id,
    });
    if (p.images?.length) {
      await ProductImage.bulkCreate(
        p.images.map((img, i) => ({
          product_id: product.id,
          url: img.url,
          alt: img.alt || null,
          sort_order: i,
        }))
      );
    }
  }
  console.log('✅ Seeded sample products (with images)');
}

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('🔁 Database synced (forced)');

    const admin = await upsertAdmin();
    await upsertCustomer();
    const categories = await seedCategories(admin);
    await seedProducts(admin, categories);

    console.log('🎉 Seeding completed.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  }
})();
