const express = require("express");
const router = express.Router();
const db = require("../config/db");





// Отримати всі акваріуми для конкретного користувача
router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [aquariums] = await db.query(
      "SELECT * FROM Aquariums WHERE user_id = ?",
      [userId]
    );
    res.json({ success: true, aquariums });
  } catch (error) {
    console.error("Error fetching user aquariums:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Створити новий акваріум
router.post("/", async (req, res) => {
  const { user_id, name, specification, capacity } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Aquariums (user_id, name, specification, capacity) VALUES (?, ?, ?, ?)",
      [user_id, name, specification, capacity]
    );
    res.status(201).json({
      success: true,
      message: "Aquarium created successfully",
      aquariumId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating aquarium:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Оновити інформацію про акваріум
router.put("/:id", async (req, res) => {
  const aquariumId = req.params.id;
  const { name, specification, capacity } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Aquariums SET name = ?, specification = ?, capacity = ? WHERE id = ?",
      [name, specification, capacity, aquariumId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Aquarium not found" });
    }

    res.json({ success: true, message: "Aquarium updated successfully" });
  } catch (error) {
    console.error("Error updating aquarium:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



module.exports = router;