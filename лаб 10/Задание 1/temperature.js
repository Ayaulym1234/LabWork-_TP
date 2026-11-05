// Создаем глобальный объект с нашими формулами
window.TemperatureMath = {
    
    celsiusToFahrenheit: function(c) {
        return (c * 9 / 5) + 32;
    },

    celsiusToKelvin: function(c) {
        return c + 273.15;
    },

    isValidCelsius: function(c) {
        return c >= -273.15;
    }
};