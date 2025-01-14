const express = require('express');
const router = express.Router();
const db = require('../config/db');



// Отримати всі девайси для конкретного акваріуму
router.get('/aquarium/:aquariumId', async (req, res) => {
    const aquariumId = req.params.aquariumId;

    try {
        const [devices] = await db.query('SELECT * FROM Devices WHERE aquarium_id = ?', [aquariumId]);
        res.json({ success: true, devices });
    } catch (error) {
        console.error('Error fetching devices for aquarium:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Створити новий девайс
router.post('/', async (req, res) => {
    const { aquarium_id, name, status } = req.body;

    try {
        const [result] = await db.query('INSERT INTO Devices (aquarium_id, name, status) VALUES (?, ?, ?)', [
            aquarium_id,
            name,
            status || 'off',
        ]);
        res.status(201).json({ success: true, message: 'Device created successfully', deviceId: result.insertId });
    } catch (error) {
        console.error('Error creating device:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



// Оновити інформацію про девайс
router.put('/:id', async (req, res) => {
    const deviceId = req.params.id;
    const { name, status } = req.body;

    try {
        const [result] = await db.query('UPDATE Devices SET name = ?, status = ? WHERE id = ?', [
            name,
            status,
            deviceId,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        res.json({ success: true, message: 'Device updated successfully' });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



module.exports = router;
