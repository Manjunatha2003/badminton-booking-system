const checkAvailability = async (client, courtId, date, startTime) => {
  const result = await client.query(
    `SELECT COUNT(*) FROM bookings 
     WHERE court_id = $1 AND booking_date = $2 AND start_time = $3 AND status = 'confirmed'`,
    [courtId, date, startTime]
  );
  return parseInt(result.rows[0].count) === 0;
};

const checkEquipmentAvailability = async (client, equipmentIds, date, startTime) => {
  for (const equipmentId of equipmentIds) {
    const result = await client.query(
      `SELECT e.available_quantity,
       (SELECT COALESCE(SUM(be.quantity), 0) 
        FROM booking_equipment be
        JOIN bookings b ON be.booking_id = b.id
        WHERE be.equipment_id = $1 AND b.booking_date = $2 AND b.start_time = $3 AND b.status = 'confirmed') as booked
       FROM equipment e WHERE e.id = $1`,
      [equipmentId, date, startTime]
    );
    
    if (result.rows.length === 0) return false;
    const { available_quantity, booked } = result.rows[0];
    if (available_quantity - booked <= 0) return false;
  }
  return true;
};

const checkCoachAvailability = async (client, coachId, date, startTime) => {
  if (!coachId) return true;
  
  const result = await client.query(
    `SELECT COUNT(*) FROM booking_coaches bc
     JOIN bookings b ON bc.booking_id = b.id
     WHERE bc.coach_id = $1 AND b.booking_date = $2 AND b.start_time = $3 AND b.status = 'confirmed'`,
    [coachId, date, startTime]
  );
  return parseInt(result.rows[0].count) === 0;
};

const calculateEndTime = (startTime) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = hours + 1;
  return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

module.exports = {
  checkAvailability,
  checkEquipmentAvailability,
  checkCoachAvailability,
  calculateEndTime
};