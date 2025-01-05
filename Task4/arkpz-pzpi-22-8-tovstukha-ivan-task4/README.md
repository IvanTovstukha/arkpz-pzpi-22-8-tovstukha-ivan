# IoT Клієнт для Моніторингу показників в акваріумах

## Опис проекту
Проект представляє собою IoT-клієнт для моніторингу та автоматизації управління параметрами акваріуму. Система збирає дані з сенсорів температури, кисню та рівня pH, аналізує їх, передає на сервер через MQTT протокол та автоматично вмикає пристрої для коригування параметрів, якщо вони виходять за межі норми.

## Функціональність
Основною функцією системи є забезпечення стабільного середовища для мешканців акваріуму. IoT-клієнт виконує такі задачі:
- Збір даних з сенсорів температури, рівня кисню та pH.
- Автоматичне підключення до Wi-Fi мережі.
- Передача даних на сервер через MQTT протокол для збереження в базі даних.
- Автоматичне ввімкнення пристроїв (термостат, аератор, pH-контролер) при виявленні відхилень від норми.
- Оновлення статусу пристроїв та логування дій в базі даних.
- Відображення поточних параметрів на OLED-дисплеї IoT-пристрою.

### Технічні характеристики
Система базується на таких технічних компонентах:
- Платформа: Arduino IDE
- Wi-Fi модуль: ESP32
- Протокол передачі даних: MQTT
- Емуляція: Платформа Wokwi
- Серверна частина: Node.js + MySQL
- MQTT брокер: Mosquitto (публічний)

## Архітектура системи

### Компоненти
1. IoT-пристрій:
   - Модуль підключення до Wi-Fi.
   - Система зчитування даних сенсорів (температури, кисню, pH).
   - Логіка коригування параметрів через відповідні пристрої.
   - OLED-дисплей для відображення стану системи та параметрів.

2. Серверна частина:
   - MQTT брокер для прийому даних від IoT-пристрою.
   - База даних MySQL для збереження даних сенсорів, статусу пристроїв та логів.
   - REST API для взаємодії з іншими клієнтами.

## Приклади коду

### Зчитування даних сенсорів
```cpp
void updateSensors() {
    temperature += random(-15, 15) * 0.1;
    oxygen += random(-5, 5) * 0.1;
    ph += random(-5, 5) * 0.1;
    client.publish("aquarium/sensor/temperature", String(temperature).c_str());
    client.publish("aquarium/sensor/oxygen", String(oxygen).c_str());
    client.publish("aquarium/sensor/ph", String(ph).c_str());
}
```

### MQTT Callbacks
```cpp
void callback(char* topic, byte* payload, unsigned int length) {
    String message;
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    if (String(topic) == "aquarium/device/control") {
        if (message == "thermostat_on") thermostat_status = true;
        if (message == "thermostat_off") thermostat_status = false;
        if (message == "aerator_on") aerator_status = true;
        if (message == "aerator_off") aerator_status = false;
        if (message == "phController_on") phController_status = true;
        if (message == "phController_off") phController_status = false;
    }
    updateDisplay();
}
```

### Оновлення OLED-дисплея
```cpp
void updateDisplay() {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.print("Temp: "); display.print(temperature); display.println(" C");
    display.print("Oxygen: "); display.print(oxygen); display.println(" mg/L");
    display.print("pH: "); display.print(ph); display.println("");
    display.print("Thermostat: "); display.println(thermostat_status ? "ON" : "OFF");
    display.print("Aerator: "); display.println(aerator_status ? "ON" : "OFF");
    display.print("pH Controller: "); display.println(phController_status ? "ON" : "OFF");
    display.display();
}
```

## UML Діаграми

### Діаграма прецедентів
- Користувач переглядає дані акваріума.
- IoT-пристрій зчитує, аналізує та передає дані.
- Сервер зберігає та обробляє отримані дані.

### Діаграма діяльності
1. Включення IoT-пристрою
2. Підключення до Wi-Fi
3. Циклічне зчитування даних сенсорів
4. Передача даних через MQTT
5. Увімкнення пристроїв у разі відхилень
6. Оновлення стану на сервері

## Встановлення та налаштування
Для розгортання системи необхідно:

### IoT пристрій:
1. Встановити Arduino IDE.
2. Завантажити бібліотеки Adafruit SSD1306 та PubSubClient.
3. Налаштувати Wi-Fi підключення.
4. Завантажити код на ESP32 через Arduino IDE.

### Налаштування середовища
1. Встановити Arduino IDE
2. Додати бібліотеки ESP8266WiFi та PubSubClient
3. Налаштувати параметри Wi-Fi підключення
4. Завантажити код на пристрій

### Сервер
1. Налаштувати Node.js середовище
2. Встановити залежності через npm install
3. Налаштувати MySQL базу даних
4. Запустити сервер за допомогою node index.js

## Контактна інформація
**Розробник**: Товстуха Іван  
**Email**: ivan.tovstukha@nure.ua
