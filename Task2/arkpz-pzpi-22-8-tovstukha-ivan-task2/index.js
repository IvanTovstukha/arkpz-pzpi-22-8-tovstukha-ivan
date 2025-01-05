const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const db = require("./src/config/db");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Підключення маршрутів
const userRoutes = require("./src/routes/users");
const aquariumRoutes = require("./src/routes/aquariums");
const deviceRoutes = require("./src/routes/devices");
const sensorRoutes = require("./src/routes/sensors");
const logRoutes = require("./src/routes/logs");

app.use("/users", userRoutes);
app.use("/aquariums", aquariumRoutes);
app.use("/devices", deviceRoutes);
app.use("/sensors", sensorRoutes);
app.use("/logs", logRoutes);

// Тестовий маршрут
app.get("/", (req, res) => {
  res.send("Welcome to AquaSense API");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
