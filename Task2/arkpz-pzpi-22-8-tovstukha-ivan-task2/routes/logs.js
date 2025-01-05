const express = require("express");
const router = express.Router();
const db = require("../config/db");



// Отримати всі логи для конкретного датчика
router.get("/sensor/:sensorId", async (req, res) => {
  const sensorId = req.params.sensorId;

  try {
    const [logs] = await db.query("SELECT * FROM Logs WHERE sensor_id = ?", [
      sensorId,
    ]);
    res.json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching logs for sensor:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});





module.exports = router;
