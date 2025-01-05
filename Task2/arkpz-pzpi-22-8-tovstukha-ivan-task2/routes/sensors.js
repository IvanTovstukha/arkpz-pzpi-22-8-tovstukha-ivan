const express = require("express");
const router = express.Router();
const db = require("../config/db");



// Отримати всі датчики для конкретного акваріуму
router.get("/aquarium/:aquariumId", async (req, res) => {
  const aquariumId = req.params.aquariumId;

  try {
    const [sensors] = await db.query(
      "SELECT * FROM Sensors WHERE aquarium_id = ?",
      [aquariumId]
    );
    res.json({ success: true, sensors });
  } catch (error) {
    console.error("Error fetching sensors for aquarium:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const sensorId = req.params.id;

  try {
    const [sensor] = await db.query("SELECT * FROM Sensors WHERE id = ?", [
      sensorId,
    ]);
    if (sensor.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sensor not found" });
    }
    res.json({ success: true, sensor: sensor[0] });
  } catch (error) {
    console.error("Error fetching sensor by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Створити новий датчик
router.post("/", async (req, res) => {
  const { aquarium_id, type, value } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Sensors (aquarium_id, type, value) VALUES (?, ?, ?)",
      [aquarium_id, type, value]
    );
    res.status(201).json({
      success: true,
      message: "Sensor created successfully",
      sensorId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating sensor:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Оновити інформацію про датчик
router.put("/:id", async (req, res) => {
  const sensorId = req.params.id;
  const { type, value } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Sensors SET type = ?, value = ? WHERE id = ?",
      [type, value, sensorId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sensor not found" });
    }

    res.json({ success: true, message: "Sensor updated successfully" });
  } catch (error) {
    console.error("Error updating sensor:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
