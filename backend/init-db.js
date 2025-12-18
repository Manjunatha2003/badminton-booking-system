require('dotenv').config();
const { initializeDatabase } = require('../models/initDb');

initializeDatabase()
  .then(() => {
    console.log('🎉 Tables created in Render PostgreSQL');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to create tables:', err);
    process.exit(1);
  });
