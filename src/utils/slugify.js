exports.makeSlug = (str = '') =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9\-]+/g, '') // حذف کاراکترهای خاص؛ حروف فارسی و لاتین و عدد
    .replace(/\-+/g, '-');
