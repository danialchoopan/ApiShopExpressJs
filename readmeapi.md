# NodeShop API Documentation (Advanced)

این مستند برای توسعه‌دهندگان اپلیکیشن موبایل تهیه شده است.

## احراز هویت
- **Base URL:** `/api`
- **هدر مورد نیاز:** `Authorization: Bearer <TOKEN>`

## مدیریت کاربران (فقط Super Admin)
- `GET /users`: لیست تمامی کاربران.
- `PUT /users/:id`: بروزرسانی نقش یا وضعیت کاربر.
- `DELETE /users/:id`: حذف حساب کاربری.

## محصولات
- `GET /products`: لیست محصولات (دارای فیلتر `category_id` و جستجوی `q`).
- `GET /products/:id`: جزئیات کامل محصول شامل تصاویر (`ProductImages`) و ویژگی‌ها (`attributes`).
- `POST /products`: ایجاد محصول (نیاز به نقش ادمین/مدیر فروش). شامل آرایه `images` و `attributes`.
- `PUT /products/:id`: ویرایش کامل محصول.
- `DELETE /products/:id`: حذف محصول.

## دسته‌بندی‌ها
- `GET /categories`: لیست درختی دسته‌بندی‌ها (دسته اصلی + زیردسته).
- `POST /categories`: ایجاد دسته جدید.
- `PUT /categories/:id`: ویرایش نام یا تغییر والد.
- `DELETE /categories/:id`: حذف دسته.

## سبد خرید و سفارشات
- `GET /carts`: دریافت سبد فعلی.
- `POST /carts/items`: افزودن کالا.
- `PUT /carts/items/:productId`: تغییر تعداد (quantity).
- `DELETE /carts/items/:productId`: حذف از سبد.
- `POST /orders/from-cart`: نهایی کردن سفارش.
- `GET /orders/me`: تاریخچه سفارشات کاربر.
- `GET /orders/stats`: (ادمین) آمار کلی فروشگاه.
