const tempInput  = document.getElementById('tempInput');
const fromUnit   = document.getElementById('fromUnit');
const convertBtn = document.getElementById('convertBtn');
const result     = document.getElementById('result');


function toCelsius(value, unit) {
    switch (unit) {
        case 'celsius':    return value;
        case 'fahrenheit': return (value - 32) * 5 / 9;
        case 'kelvin':     return value - 273.15;
        default:           return NaN;
    }
}

function fromCelsius(celsius) {
    return {
        celsius:    celsius,
        fahrenheit: celsius * 9 / 5 + 32,
        kelvin:     celsius + 273.15
    };
}

function convertTemperature(value, unit) {
    const celsius = toCelsius(value, unit);
    return fromCelsius(celsius);
}

function validate(value, unit) {
    if (isNaN(value)) {
        return 'Введите числовое значение.';
    }

    const celsius = toCelsius(value, unit);
    if (celsius < -273.15) {
        return 'Температура ниже абсолютного нуля (−273.15 °C) невозможна!';
    }
    return null;
}

function fmt(num) {
    return num.toFixed(2).replace(/\.00$/, '');
}

function handleConvert() {
    const value = parseFloat(tempInput.value);
    const unit  = fromUnit.value;

    const errorMsg = validate(value, unit);
    if (errorMsg) {
        result.className = 'error';
        result.textContent = '❌ ' + errorMsg;
        return;
    }

    const res = convertTemperature(value, unit);

    const units = ['celsius', 'fahrenheit', 'kelvin'];
    const labels = {
        celsius:    '°C',
        fahrenheit: '°F',
        kelvin:     'K'
    };
    let html = '';
    for (let i = 0; i < units.length; i++) {
        const key = units[i];
        const isSource = key === unit;
        html += `<div>${isSource ? '➡️' : '•'} 
            <span class="value">${fmt(res[key])} ${labels[key]}</span>
            ${isSource ? '(исходная)' : ''}
        </div>`;
    }

    result.className = 'success';
    result.innerHTML = html;
}

function resetResult() {
    result.className = '';
    result.textContent = 'Введите значение и нажмите «Конвертировать»';
}

convertBtn.addEventListener('click', handleConvert);

tempInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleConvert();
});

tempInput.addEventListener('input', resetResult);

fromUnit.addEventListener('change', () => {
    if (tempInput.value !== '') handleConvert();
});