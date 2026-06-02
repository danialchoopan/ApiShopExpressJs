const app = require('./app');
const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync();
    console.log('✅ Database connected and synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
