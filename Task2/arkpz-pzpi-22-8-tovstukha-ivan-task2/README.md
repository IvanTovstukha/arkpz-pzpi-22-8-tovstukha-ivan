# AquaSense - Документація API

## Опис проєкту

AquaSense – це програмна система для автоматизації моніторингу та управління акваріумами. Система дозволяє користувачам стежити за параметрами акваріумної води (температура, рівень кисню, pH), автоматично включати/вимикати пристрої для регулювання цих параметрів (термостат, аератор, контролер pH) та зберігати журнали змін. Симуляція сенсорів і пристроїв виконується за допомогою IoT-системи, а дані зберігаються у базі даних.

## Функціонал

### Авторизація

- Реєстрація та авторизація користувачів.
- Маршрути для входу та перегляду профілю користувача.

### Акваріуми

- Створення, оновлення та видалення акваріумів.
- Отримання списку акваріумів для користувача.

### Сенсори

- Моніторинг параметрів акваріумної води (температура, рівень кисню, pH).
- Оновлення значень сенсорів у базі даних.

### Пристрої

- Автоматичне ввімкнення/вимкнення пристроїв при відхиленні параметрів від норми.
- Відображення поточного статусу пристроїв.

### Журнали

- Зберігання логів змін параметрів та роботи пристроїв.
- Отримання історії змін для кожного сенсора.

### Інтеграція IoT

- Симуляція сенсорів і пристроїв через MQTT.
- Стан сенсорів і пристроїв синхронізується з базою даних у реальному часі.

## Технології

- **Платформа**: Node.js
- **Мова програмування**: JavaScript (ES6+)
- **СУБД**: MySQL
- **IoT**: Wokwi (симуляція ESP32, MQTT-брокер Mosquitto)
- **Фреймворк**: Express.js
- **Документація API**: Swagger

## Вимоги

### Середовище виконання:

- Node.js версія 16 або вище.
- MySQL.

### Бібліотеки та залежності:

- `express`: для створення серверних маршрутів.
- `mysql2`: для роботи з MySQL.
- `mqtt`: для інтеграції з MQTT-брокером.
- `cookie-parser`: для роботи з cookies.
- `bcrypt`: для хешування паролів користувачів.
- `swagger-ui-express`: для документування API.

## Налаштування

1. **Налаштування бази даних**
   - Створіть базу даних MySQL з назвою AquaSense.
   - Використовуйте SQL-скрипт для створення таблиць:
   ```
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
   ```

2. **Налаштування MQTT**
   Використовуйте публічний брокер MQTT: test.mosquitto.org.
   Теми MQTT:

   - Для сенсорів: aquarium/sensor/temperature, aquarium/sensor/oxygen, aquarium/sensor/ph.
   - Для пристроїв: aquarium/device/control.

3. **Налаштування Swagger**
   - Для автоматичної генерації документації API за допомогою Swagger, налаштуйте `swagger-jsdoc` і `swagger-ui-express`.

## Використання

### Запуск серверу

1. Клонувати репозиторій:
   ```bash
   git clone https://github.com/NureTovstukhaIvan/AquaSense.git
   ```
2. Перейдіть до директорії проєкту:
   ```
   cd aquasense
   ```
3. Встановіть залежності:
   ```
   npm install
   ```
4. Запустіть сервер:

```
npm start
```

Приклади запитів
Реєстрація користувача

- Метод: `POST`
- Маршрут: `/users/register`
  Тіло запиту:

```
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Авторизація користувача

- Метод: `POST`
- Маршрут: `/users/login`
  Тіло запиту:

```
{
  "email": "john@example.com",
  "password": "password123"
}
```

Перегляд профілю користувача

- Метод: `POST`
- Маршрут: `/users/:id`

Додавання акваріума

- Метод: `POST`
- Маршрут: `/aquariums`
  Тіло запиту:

```
{
  "user_id": 1,
  "name": "My Aquarium",
  "location": "Living Room"
}
```

Отримання списку акваріумів

- Метод: `GET`
- Маршрут: `/aquariums/user/:userId`

Отримання всіх сенсорів для акваріума

- Метод: `GET`
- Маршрут: `/sensors/aquarium/:aquariumId`

Оновлення значення сенсора

- Метод: `PUT`
- Маршрут: `/sensors/:id`
  Тіло запиту:

```
{
  "value": 26.5
}
```

Вмикання пристрою

- Метод: `POST`
- Маршрут: `/devices/control`
  Тіло запиту:

```
{
  "device_name": "thermostat",
  "action": "on"
}
```

Вимикання пристрою

- Метод: `POST`
- Маршрут: `/devices/control`
  Тіло запиту:

```
{
  "device_name": "thermostat",
  "action": "off"
}
```

Отримання списку пристроїв для акваріума

- Метод: `GET`
- Маршрут: `/devices/aquarium/:aquariumId`

Отримання всіх логів для сенсора

- Метод: `GET`
- Маршрут: `/logs/sensor/:sensorId`

Створення логу вручну

- Метод: `POST`
- Маршрут: `/logs`
  Тіло запиту:

```
{
  "sensor_id": 1,
  "message": "Temperature corrected from 30 to 28"
}
```

Примітки

- MQTT забезпечує взаємодію між сенсорами та пристроями в режимі реального часу.
- Дисплей на ESP32 синхронізує стан пристроїв і показників сенсорів відповідно до останніх оновлень.

Контакти  
Розробник: Товстуха Іван  
Email: `ivan.tovstukha@nure.ua`
