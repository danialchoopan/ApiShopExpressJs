# Shop API (Node.js + Express + Sequelize + SQLite)

یک API نمونه فروشگاه اینترنتی با الگوی MVC. شامل احراز هویت JWT، نقش ادمین، دسته‌بندی، محصول، سبد خرید، و سفارش.

## تکنولوژی‌ها
- Node.js, Express
- Sequelize (SQLite)
- JWT Auth
- ساختار MVC

## قابلیت‌ها
- ثبت‌نام/ورود کاربر، پروفایل کاربر جاری
- مدیریت دسته‌بندی و محصول (ادمین)
- سبد خرید کاربر و تبدیل سبد به سفارش با ترنزاکشن
- Seed اولیه: ادمین و چند دسته/محصول نمونه
- کالکشن Postman آماده

## ساختار پوشه‌ها
```
src/
  app.js, server.js
  config/ (config.js, db.js)
  models/ (user, category, product, productImage, address, cart, cartItem, order, orderItem, index)
  routes/ (auth, users, categories, products, carts, orders, index)
  controllers/ (...)
  middlewares/ (auth, isAdmin, errorHandler)
  validators/ (user, product)
  utils/ (slugify, pagination)
  scripts/ (seed.js)
docs/
  postman/ecommerce-api.postman_collection.json
```

## راه‌اندازی سریع

### پیش‌نیاز
- Node.js 18+

### نصب
```bash
npm i
```

### تنظیم متغیرهای محیطی
یک فایل `.env` بر اساس `.env.example` بسازید:
```
NODE_ENV=development
PORT=3000
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=7d

ADMIN_FULLNAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### ساخت دیتابیس و داده اولیه
```bash
npm run db:seed
```

### اجرا
حالت توسعه:
```bash
npm run dev
```
حالت عادی:
```bash
npm start
```

### تست سریع API
ورود ادمین:
```bash
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@example.com","password":"admin123"}'
```
لیست محصولات:
```bash
curl http://localhost:3000/api/products
```

## Postman
فایل کالکشن: `docs/postman/ecommerce-api.postman_collection.json`  
متغیرها:  
- `baseUrl` = `http://localhost:3000/api`  
- `authToken` = مقدار توکن خروجی لاگین

## نکات
- قیمت‌ها به صورت عدد صحیح (minor unit) ذخیره می‌شوند.
- مسیرهای ادمین پشت `auth` و `isAdmin` محافظت می‌شوند.
- برای جست‌وجوی عنوان محصول از `Op.like` استفاده کنید.

## اسکریپت‌ها
- `npm run dev` اجرای توسعه با nodemon
- `npm start` اجرای عادی
- `npm run db:sync` همگام‌سازی اسکیمای دیتابیس
- `npm run db:seed` اجرای داده اولیه
