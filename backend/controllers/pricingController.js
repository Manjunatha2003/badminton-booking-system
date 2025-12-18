const pool = require('../config/database');
const { calculatePrice } = require('../utils/pricingEngine');

const getAllRules = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pricing_rules ORDER BY priority DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createRule = async (req, res) => {
  try {
    const { rule_name, rule_type, multiplier_type, multiplier_value, conditions, priority } = req.body;
    const result = await pool.query(
      'INSERT INTO pricing_rules (rule_name, rule_type, multiplier_type, multiplier_value, conditions, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [rule_name, rule_type, multiplier_type, multiplier_value, conditions, priority || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { rule_name, rule_type, multiplier_type, multiplier_value, conditions, priority, is_active } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (rule_name !== undefined) {
      updates.push(`rule_name = $${paramCount++}`);
      values.push(rule_name);
    }
    if (rule_type !== undefined) {
      updates.push(`rule_type = $${paramCount++}`);
      values.push(rule_type);
    }
    if (multiplier_type !== undefined) {
      updates.push(`multiplier_type = $${paramCount++}`);
      values.push(multiplier_type);
    }
    if (multiplier_value !== undefined) {
      updates.push(`multiplier_value = $${paramCount++}`);
      values.push(multiplier_value);
    }
    if (conditions !== undefined) {
      updates.push(`conditions = $${paramCount++}`);
      values.push(conditions);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    values.push(id);

    await pool.query(
      `UPDATE pricing_rules SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pricing_rules WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const calculate = async (req, res) => {
  try {
    const { courtId, date, startTime, equipmentIds, coachId } = req.body;
    const pricing = await calculatePrice(courtId, date, startTime, equipmentIds, coachId);
    res.json(pricing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllRules, createRule, updateRule, deleteRule, calculate };