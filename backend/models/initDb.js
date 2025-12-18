const pool = require('../config/database');
const bcrypt = require('bcrypt');

const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // USERS
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // COURTS
    await client.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        court_type VARCHAR(50) NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // EQUIPMENT
    await client.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        total_quantity INTEGER NOT NULL,
        available_quantity INTEGER NOT NULL,
        rental_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // COACHES
    await client.query(`
      CREATE TABLE IF NOT EXISTS coaches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100),
        hourly_rate DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // PRICING RULES
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing_rules (
        id SERIAL PRIMARY KEY,
        rule_name VARCHAR(100) NOT NULL,
        rule_type VARCHAR(50) NOT NULL,
        multiplier_type VARCHAR(20) NOT NULL,
        multiplier_value DECIMAL(10,2) NOT NULL,
        conditions JSONB,
        priority INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // BOOKINGS
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        court_id INTEGER REFERENCES courts(id),
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        user_email VARCHAR(100) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ADMIN USER (only if not exists)
    const adminCheck = await client.query(
      "SELECT id FROM users WHERE username = 'admin'"
    );

    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
        ['admin', 'admin@courtbook.com', hashedPassword, 'admin']
      );
    }

    await client.query('COMMIT');
    console.log('Database initialized safely');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DB init error:', err.message);
  } finally {
    client.release();
  }
};

module.exports = { initializeDatabase };
