import { pool } from "../config/database.js";

const getEquipments = async (req, res) => {
  const query = "SELECT * FROM equipments";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getEquipments,
};
