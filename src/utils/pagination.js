exports.toPagination = (page = 1, limit = 20) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (p - 1) * perPage;
  return { page: p, perPage, offset };
};
