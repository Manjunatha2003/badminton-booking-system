const pool = require('../config/database');

const getAllCourts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courts ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCourt = async (req, res) => {
  try {
    const { name, court_type, base_price } = req.body;
    const result = await pool.query(
      'INSERT INTO courts (name, court_type, base_price) VALUES ($1, $2, $3) RETURNING *',
      [name, court_type, base_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, court_type, base_price, is_active } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (court_type !== undefined) {
      updates.push(`court_type = $${paramCount++}`);
      values.push(court_type);
    }
    if (base_price !== undefined) {
      updates.push(`base_price = $${paramCount++}`);
      values.push(base_price);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    values.push(id);

    await pool.query(
      `UPDATE courts SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM courts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCourts, createCourt, updateCourt, deleteCourt };