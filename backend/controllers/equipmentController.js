const pool = require('../config/database');

const getAllEquipment = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipment ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEquipment = async (req, res) => {
  try {
    const { name, total_quantity, rental_price } = req.body;
    const result = await pool.query(
      'INSERT INTO equipment (name, total_quantity, available_quantity, rental_price) VALUES ($1, $2, $2, $3) RETURNING *',
      [name, total_quantity, rental_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, total_quantity, available_quantity, rental_price } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (total_quantity !== undefined) {
      updates.push(`total_quantity = $${paramCount++}`);
      values.push(total_quantity);
    }
    if (available_quantity !== undefined) {
      updates.push(`available_quantity = $${paramCount++}`);
      values.push(available_quantity);
    }
    if (rental_price !== undefined) {
      updates.push(`rental_price = $${paramCount++}`);
      values.push(rental_price);
    }

    values.push(id);

    await pool.query(
      `UPDATE equipment SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM equipment WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllEquipment, createEquipment, updateEquipment, deleteEquipment };