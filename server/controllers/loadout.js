import { pool } from "../config/database.js";

/**
 * GET /loadout/:id
 * Fetches a single loadout by its ID.
 */
const getLoadoutById = async (req, res) => {
  const { id } = req.params; // Get ID from URL
  const query = "SELECT * FROM loadouts WHERE id = $1";
  try {
    const result = await pool.query(query, [id]);

    // Check if a loadout was found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Loadout not found" });
    }
    // Send the found loadout
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "22P02") {
      res.status(404).json({ error: "Loadout not found" });
    }
    console.error("GET Loadout by ID Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /loadout/:id
 * Updates an existing loadout by its ID. (Edit)
 */
const updateLoadout = async (req, res) => {
  const { id } = req.params; // Get ID from URL
  const { name, primaryWeapon, subWeapon, gadget1, gadget2, price } = req.body; // Get data from request body
  const values = [name, primaryWeapon, subWeapon, gadget1, gadget2, price, id];

  const query =
    "UPDATE loadouts SET name = $1, primaryweapon = $2, subweapon = $3, gadget1 = $4, gadget2 = $5, price = $6 WHERE id = $7 RETURNING *";

  try {
    const result = await pool.query(query, values);

    // Check if a loadout was found and updated
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Loadout not found" });
    }

    // Send the updated loadout
    res.json(result.rows[0]);
  } catch (error) {
    console.error("PATCH Loadout Error:", error);

    // Handle unique constraint violation
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Loadout with this name already exists." });
    }

    // Handle other errors
    res.status(500).json({ error: "Failed to update the loadout." });
  }
};

/**
 * DELETE /loadout/:id
 * Deletes a loadout by its ID.
 */
const deleteLoadout = async (req, res) => {
  const { id } = req.params; // Get ID from URL
  const query = "DELETE FROM loadouts WHERE id = $1 RETURNING *";

  try {
    const result = await pool.query(query, [id]);

    // Check if a loadout was found and deleted
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Loadout not found" });
    }

    // Send the deleted loadout data as confirmation
    // Alternative: res.sendStatus(204); (No Content)
    res.json(result.rows[0]);
  } catch (error) {
    console.error("DELETE Loadout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export only the required functions
export default {
  getLoadoutById,
  updateLoadout,
  deleteLoadout,
};
