const pool = require('../config/database');

const calculatePrice = async (courtId, date, startTime, equipmentIds = [], coachId = null) => {
  const courtResult = await pool.query('SELECT * FROM courts WHERE id = $1', [courtId]);
  if (courtResult.rows.length === 0) throw new Error('Court not found');
  
  const court = courtResult.rows[0];
  let basePrice = parseFloat(court.base_price);
  const breakdown = [{ description: `${court.name} (Base)`, amount: basePrice }];

  const rulesResult = await pool.query('SELECT * FROM pricing_rules WHERE is_active = true ORDER BY priority DESC');
  const rules = rulesResult.rows;

  const bookingDate = new Date(date);
  const dayOfWeek = bookingDate.getDay();
  const [hours] = startTime.split(':').map(Number);

  for (const rule of rules) {
    let applies = false;
    const conditions = rule.conditions || {};

    if (rule.rule_type === 'time_based' && conditions.start_time && conditions.end_time) {
      const [startHour] = conditions.start_time.split(':').map(Number);
      const [endHour] = conditions.end_time.split(':').map(Number);
      applies = hours >= startHour && hours < endHour;
    } else if (rule.rule_type === 'day_based' && conditions.days) {
      applies = conditions.days.includes(dayOfWeek);
    } else if (rule.rule_type === 'court_based' && conditions.court_types) {
      applies = conditions.court_types.includes(court.court_type);
    }

    if (applies) {
      const multiplier = parseFloat(rule.multiplier_value);
      let adjustment = 0;
      
      if (rule.multiplier_type === 'percentage') {
        adjustment = (basePrice * multiplier) / 100;
      } else {
        adjustment = multiplier;
      }
      
      basePrice += adjustment;
      breakdown.push({ 
        description: rule.rule_name, 
        amount: adjustment 
      });
    }
  }

  if (equipmentIds && equipmentIds.length > 0) {
    const equipResult = await pool.query(
      'SELECT name, rental_price FROM equipment WHERE id = ANY($1)',
      [equipmentIds]
    );
    equipResult.rows.forEach(equip => {
      const price = parseFloat(equip.rental_price);
      basePrice += price;
      breakdown.push({ description: equip.name, amount: price });
    });
  }

  if (coachId) {
    const coachResult = await pool.query('SELECT name, hourly_rate FROM coaches WHERE id = $1', [coachId]);
    if (coachResult.rows.length > 0) {
      const coach = coachResult.rows[0];
      const rate = parseFloat(coach.hourly_rate);
      basePrice += rate;
      breakdown.push({ description: `Coach: ${coach.name}`, amount: rate });
    }
  }

  return { total: Math.round(basePrice * 100) / 100, breakdown };
};

module.exports = { calculatePrice };