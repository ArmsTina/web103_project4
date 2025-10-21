import { pool } from "../config/database.js";

const getLoadouts = async (req, res) => {
  const query = "SELECT * FROM loadouts";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const postLoadouts = async (req, res) => {
  const { name, primaryWeapon, subWeapon, gadget1, gadget2 } = req.body;
  const values = [name, primaryWeapon, subWeapon, gadget1, gadget2];
  const query =
    "INSERT INTO loadouts (name, primaryweapon, subweapon, gadget1, gadget2) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST Loadouts Error:", error);

    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Loadout with this name already exists." });
    }
    res
      .status(500)
      .json({ error: "Failed to save the loadout to the database." });
  }
};

export default {
  getLoadouts,
  postLoadouts,
};
