const pool = require('../config/database');

const getAllCoaches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coaches ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCoach = async (req, res) => {
  try {
    const { name, specialization, hourly_rate } = req.body;
    const result = await pool.query(
      'INSERT INTO coaches (name, specialization, hourly_rate) VALUES ($1, $2, $3) RETURNING *',
      [name, specialization, hourly_rate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, hourly_rate, is_available } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (specialization !== undefined) {
      updates.push(`specialization = $${paramCount++}`);
      values.push(specialization);
    }
    if (hourly_rate !== undefined) {
      updates.push(`hourly_rate = $${paramCount++}`);
      values.push(hourly_rate);
    }
    if (is_available !== undefined) {
      updates.push(`is_available = $${paramCount++}`);
      values.push(is_available);
    }

    values.push(id);

    await pool.query(
      `UPDATE coaches SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCoach = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM coaches WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCoaches, createCoach, updateCoach, deleteCoach };