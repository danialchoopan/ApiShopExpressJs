const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Shop home
  await page.goto('http://localhost:3000/shop/index.html');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshots/shop_home.png' });

  // Login page
  await page.goto('http://localhost:3000/shop/login.html');
  await page.screenshot({ path: 'public/screenshots/login.png' });

  // Login as admin
  await page.fill('#email', 'admin@example.com');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Admin dashboard
  await page.goto('http://localhost:3000/admin/index.html');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshots/admin_dashboard.png' });

  // Admin products
  await page.goto('http://localhost:3000/admin/products.html');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshots/admin_products.png' });

  await browser.close();
})();
