const pool = require('../config/database');
const bcrypt = require('bcrypt');

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      DROP TABLE IF EXISTS waitlist CASCADE;
      DROP TABLE IF EXISTS booking_coaches CASCADE;
      DROP TABLE IF EXISTS booking_equipment CASCADE;
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS pricing_rules CASCADE;
      DROP TABLE IF EXISTS coaches CASCADE;
      DROP TABLE IF EXISTS equipment CASCADE;
      DROP TABLE IF EXISTS courts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE courts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        court_type VARCHAR(50) NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE equipment (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        total_quantity INTEGER NOT NULL,
        available_quantity INTEGER NOT NULL,
        rental_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE coaches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100),
        hourly_rate DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE pricing_rules (
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

    await client.query(`
      CREATE TABLE bookings (
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

    await client.query(`
      CREATE TABLE booking_equipment (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        equipment_id INTEGER REFERENCES equipment(id),
        quantity INTEGER DEFAULT 1
      )
    `);

    await client.query(`
      CREATE TABLE booking_coaches (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        coach_id INTEGER REFERENCES coaches(id)
      )
    `);

    await client.query(`
      CREATE TABLE waitlist (
        id SERIAL PRIMARY KEY,
        court_id INTEGER REFERENCES courts(id),
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        user_email VARCHAR(100) NOT NULL,
        notified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      ['admin', 'admin@courtbook.com', hashedPassword, 'admin']
    );

    await client.query(`
      INSERT INTO courts (name, court_type, base_price) VALUES
      ('Indoor Court 1', 'indoor', 500),
      ('Indoor Court 2', 'indoor', 500),
      ('Outdoor Court 1', 'outdoor', 300),
      ('Outdoor Court 2', 'outdoor', 300)
    `);

    await client.query(`
      INSERT INTO equipment (name, total_quantity, available_quantity, rental_price) VALUES
      ('Badminton Racket', 10, 10, 50),
      ('Sports Shoes', 8, 8, 30),
      ('Shuttlecock Set', 15, 15, 20)
    `);

    await client.query(`
      INSERT INTO coaches (name, specialization, hourly_rate) VALUES
      ('Coach Rajesh', 'Singles Specialist', 800),
      ('Coach Priya', 'Doubles Expert', 750),
      ('Coach Anil', 'Beginner Training', 600)
    `);

    await client.query(`
      INSERT INTO pricing_rules (rule_name, rule_type, multiplier_type, multiplier_value, conditions) VALUES
      ('Peak Hours Premium', 'time_based', 'percentage', 50, '{"start_time": "18:00", "end_time": "21:00"}'),
      ('Weekend Surcharge', 'day_based', 'percentage', 30, '{"days": [0, 6]}'),
      ('Indoor Court Premium', 'court_based', 'percentage', 20, '{"court_types": ["indoor"]}'),
      ('Early Bird Discount', 'time_based', 'percentage', -10, '{"start_time": "06:00", "end_time": "09:00"}')
    `);

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { initializeDatabase };