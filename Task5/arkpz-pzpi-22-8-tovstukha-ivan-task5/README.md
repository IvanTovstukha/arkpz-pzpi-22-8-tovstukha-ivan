# Документація проєкту AquaSense

## Опис проекту

AquaSense – це програмна система для автоматизації та моніторингу роботи акваріумів. Вона інтегрує серверну бізнес-логіку, REST API, базу даних і IoT-пристрої для контролю параметрів акваріумів, таких як температура, рівень кисню та pH. IoT-пристрої (на основі ESP32) взаємодіють із системою через MQTT-протокол, забезпечуючи реальну симуляцію вимірювань сенсорів та автоматизацію роботи пристроїв.

---

## Компоненти системи

### 1. **Серверна частина**

- **Технології**: Node.js з використанням Express.js.
- **База даних**: MySQL із налаштуванням підключення через mysql2 пакет.
- **API**: REST API для CRUD-операцій над користувачами, акваріумами, сенсорами, пристроями та логами.
- **MQTT інтеграція**: MQTT клієнт для обміну даними між сервером і IoT-пристроями.
- **Бізнес-логіка**: Автоматичне керування пристроями на основі значень сенсорів (коригування температури, кисню, pH).

### 2. **IoT-клієнт**

- **Платформа**: Мікроконтролер ESP32 з підключенням до Wi-Fi.
- **Бібліотеки**: PubSubClient, Adafruit SSD1306, Adafruit GFX.
- **Функціонал**:
  - Моніторинг значень сенсорів (температура, кисень, pH).
  - Управління пристроями (термостат, аератор, контролер pH) залежно від параметрів акваріуму.
  - Відображення значень сенсорів і статусу пристроїв на OLED-дисплеї.

---

## Вимоги до середовища

### Програмне забезпечення:

- Операційна система: Windows 10 або новіша.
- Середовище розробки: Visual Studio Code для бекенду, Arduino IDE для IoT-коду.
- СУБД: MySQL Community Server.

### Залежності:

- Сервер:
  - express
  - mysql2
  - mqtt
  - swagger-ui-express
- IoT:
  - PubSubClient
  - Adafruit SSD1306
  - Adafruit GFX

---

## Інструкція з розгортання

### Крок 1: Клонування репозиторію

Скористайтеся командою:

```bash

git clone https://github.com/NureTovstukhaIvan/AquaSense.git

```

### Крок 2: Налаштування серверної частини

Встановіть необхідні залежності:

 ```bash

cd AquaSense
npm install
npm install express
npm install --save-dev nodemon
npm install mysql2
npm install mqtt
npm install swagger-ui-express

 ```

Створіть базу даних у MySQL:

```sql

CREATE DATABASE AquaSense;

```

Імпортуйте таблиці та структуру бази даних:

```sql

CREATE TABLE Users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Aquariums (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
name VARCHAR(100) NOT NULL,
specification VARCHAR(100),
capacity DECIMAL(10, 2) NOT NULL, -- Ємність акваріуму в літрах
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Sensors (
id INT AUTO_INCREMENT PRIMARY KEY,
aquarium_id INT NOT NULL,
type VARCHAR(255) NOT NULL,
value DECIMAL(10, 2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (aquarium_id) REFERENCES Aquariums(id) ON DELETE CASCADE
);

CREATE TABLE Logs (
id INT AUTO_INCREMENT PRIMARY KEY,
sensor_id INT NOT NULL,
message VARCHAR(255),
logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (sensor_id) REFERENCES Sensors(id) ON DELETE CASCADE
);

CREATE TABLE Devices (
id INT AUTO_INCREMENT PRIMARY KEY,
aquarium_id INT NOT NULL,
name VARCHAR(100) NOT NULL,
status ENUM('on', 'off') DEFAULT 'off',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (aquarium_id) REFERENCES Aquariums(id) ON DELETE CASCADE
);

````
Налаштуйте конфігурацію бази даних у файлі src/config/db.js:
```js

const pool = mysql.createPool({
host: 'localhost',
user: 'root',
password: 'yourpassword',
database: 'AquaSense',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});

````

### Крок 3: Запуск серверної частини

Запустіть сервер командою:

```bash

node index.js

```

Переконайтеся, що сервер доступний за адресою:
http://localhost:3000

Swagger-документація API доступна за адресою:
http://localhost:3000/api-docs

### Крок 4: Налаштування IoT-клієнта

Відкрийте код IoT у Arduino IDE.
Налаштуйте параметри підключення:

```js

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char\* mqtt_server = "test.mosquitto.org";

```

Завантажте код на ESP32.
Переконайтеся, що пристрій успішно підключається до Wi-Fi та брокера MQTT.

### Крок 5: Тестування системи

Додайте акваріум, сенсори та пристрої в базу даних через Swagger або Postman.
Перевірте взаємодію IoT-пристрою з сервером:

- Перевірте значення сенсорів у базі даних після моніторингу.
- Переконайтеся, що коригування значень викликає зміну статусу пристроїв.
- Логи повинні записуватися в базу даних.

## Ліцензія

Проєкт ліцензований під ліцензією Mit. Apache License 2.0

### Контактна інформація  
Розробник: Товстуха Іван  
Email: `ivan.tovstukha@nure.ua`
