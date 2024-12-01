const apiKey = '58aab52da19414370c654b69a6d05a6f';  // Replace with your API key from Fixer.io
const apiUrl = `https://data.fixer.io/api/latest?access_key=${apiKey}`; // Fixer API URL

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
const convertButton = document.getElementById('convertBtn'); 

function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

async function fetchCurrencyData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
            populateCurrencyOptions(data.rates);
        } else {
            alert('Error fetching currency data!');
        }
    } catch (error) {
        alert('Failed to fetch exchange rates');
        console.error('Error:', error);
    }
}

function populateCurrencyOptions(rates) {
    const currencies = Object.keys(rates);
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.innerText = currency;
        fromCurrencySelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.innerText = currency;
        toCurrencySelect.appendChild(option2);
    });
}


async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (!amount || !fromCurrency || !toCurrency) {
        resultDisplay.innerText = 'Please enter all fields correctly!';
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const rates = data.rates;

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];

        const convertedAmount = (amount * toRate) / fromRate;
        resultDisplay.innerText = `Result: ${convertedAmount.toFixed(2)} ${toCurrency}`;


        storeHistory(amount, fromCurrency, toCurrency, convertedAmount.toFixed(2));
    } catch (error) {
        resultDisplay.innerText = 'Error converting currency!';
        console.error(error);
    }
}


function storeHistory(amount, fromCurrency, toCurrency, convertedAmount) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    historyDisplay.appendChild(historyItem);

 
    if (historyDisplay.children.length > 5) {
        historyDisplay.removeChild(historyDisplay.children[0]);
    }
}


fetchCurrencyData();

window.addEventListener('load', () => {
    convertButton.addEventListener('click', convertCurrency);
});
