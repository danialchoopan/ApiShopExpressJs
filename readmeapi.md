# NodeShop API Documentation

این مستند برای توسعه‌دهندگان موبایل و کسانی که می‌خواهند از API فروشگاه استفاده کنند تهیه شده است.

## اطلاعات پایه
- **Base URL:** `/api`
- **Content-Type:** `application/json`

## احراز هویت (Authentication)
تمامی درخواست‌هایی که نیاز به احراز هویت دارند باید هدر زیر را داشته باشند:
`Authorization: Bearer <your_token>`

### ۱. ثبت نام
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "full_name": "نام شما",
    "email": "email@example.com",
    "password": "password123"
  }
  ```

### ۲. ورود
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "email@example.com",
    "password": "password123"
  }
  ```
- **Response:** شامل `token` و اطلاعات کاربر.

---

## محصولات (Products)

### ۱. لیست محصولات
- **URL:** `/products`
- **Method:** `GET`
- **Query Params:** `page`, `limit`, `category_id`, `q` (جستجو)

### ۲. جزئیات محصول
- **URL:** `/products/:id`
- **Method:** `GET`

---

## سبد خرید (Cart)

### ۱. دریافت سبد خرید
- **URL:** `/carts`
- **Method:** `GET` (نیاز به توکن)

### ۲. افزودن به سبد
- **URL:** `/carts/items`
- **Method:** `POST`
- **Body:** `{"product_id": 1, "quantity": 1}`

---

## سفارشات (Orders)

### ۱. ثبت سفارش از سبد خرید
- **URL:** `/orders/from-cart`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "shipping_address_id": 1,
    "billing_address_id": 1
  }
  ```

### ۲. لیست سفارشات من
- **URL:** `/orders/me`
- **Method:** `GET`

---

## آدرس‌ها (Addresses)

### ۱. لیست آدرس‌های کاربر
- **URL:** `/addresses`
- **Method:** `GET`

### ۲. افزودن آدرس جدید
- **URL:** `/addresses`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "full_name": "نام گیرنده",
    "line1": "آدرس دقیق",
    "city": "تهران",
    "province": "تهران",
    "phone": "0912..."
  }
  ```
