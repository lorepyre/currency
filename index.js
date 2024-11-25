const apiKey = 'eb86bb9f5695d9e7acc6a722'; 
const apiUrl = 'https://v6.exchangerate-api.com/v6/' + apiKey + '/latest/'; 
let fromCurrency = 'RUB'; 
let toCurrency = 'USD'; 

function checkInternetConnection() {
    const noInternetElement = document.getElementById('no-internet');

    if (navigator.onLine) {
noInternetElement.style.display = 'none';
    } else {
     noInternetElement.style.display = 'block';
    }
}


window.addEventListener('online', checkInternetConnection);
window.addEventListener('offline', checkInternetConnection);

document.addEventListener('DOMContentLoaded', checkInternetConnection);

async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await fetch(apiUrl + fromCurrency); 
        const data = await response.json();
        return data.conversion_rates[toCurrency];
    } catch (error) {
        console.error('API sorğusunda xəta:', error);
    }
}

function updateConversionRates() {
    getExchangeRate(fromCurrency, toCurrency).then(rate => {
        const reverseRate = 1 / rate;
    
        document.querySelector('.iHavehad .conversion-rate').textContent = `1 ${fromCurrency} = ${rate.toFixed(5)} ${toCurrency}`;    
        document.querySelector('.iWantToGet .conversion-rate').textContent = `1 ${toCurrency} = ${reverseRate.toFixed(5)} ${fromCurrency}`;
    });
}

function updateConvertedValue(changedInput) {
    const amountFromInput = document.querySelector('.iHavehad .amount-display input');
    const amountToInput = document.querySelector('.iWantToGet .amount-display input');
    
    if (changedInput === 'from') {
        const amountFrom = parseFloat(amountFromInput.value);
        if (!isNaN(amountFrom)) {
            getExchangeRate(fromCurrency, toCurrency).then(rate => {
                if (!rate) return;
                const convertedAmount = amountFrom * rate; 
                amountToInput.value = convertedAmount.toFixed(2); 
            });
        } else {
            amountToInput.value = '';
        }
    } else if (changedInput === 'to') {
        const amountTo = parseFloat(amountToInput.value);
        if (!isNaN(amountTo)) {
            getExchangeRate(toCurrency, fromCurrency).then(rate => {
                if (!rate) return;
                const convertedAmount = amountTo * rate; 
                amountFromInput.value = convertedAmount.toFixed(2); 
            });
        } else {
            amountFromInput.value = ''; 
        }
    }
}

document.querySelectorAll('.iHavehad .currency-selector button').forEach(button => {
    button.addEventListener('click', function() {
fromCurrency = button.textContent.trim();
        
        document.querySelectorAll('.iHavehad .currency-selector button').forEach(btn => {
            btn.classList.remove('active');
});

     button.classList.add('active');
        
 updateConversionRates(); 
        updateConvertedValue('from'); 
    });
});

document.querySelectorAll('.iWantToGet .currency-selector button').forEach(button => {
 button.addEventListener('click', function() {
        toCurrency = button.textContent.trim();  
 document.querySelectorAll('.iWantToGet .currency-selector button').forEach(btn => {
     btn.classList.remove('active');
        });
button.classList.add('active');
        
        updateConversionRates(); 
        updateConvertedValue('to');
    });
});

document.querySelector('.iHavehad .amount-display input').addEventListener('input', function() {
    updateConvertedValue('from');
});

document.querySelector('.iWantToGet .amount-display input').addEventListener('input', function() {
    updateConvertedValue('to');
});

updateConversionRates();
