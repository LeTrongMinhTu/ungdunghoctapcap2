let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        currentInput += button.dataset.value;
        display.value = currentInput;
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        if (currentInput === '') return;
        if (previousInput !== '') {
            calculate();
        }
        operator = button.dataset.op;
        previousInput = currentInput;
        currentInput = '';
    });
});

document.getElementById('equals').addEventListener('click', () => {
    if (currentInput === '' || previousInput === '') return;
    calculate();
    operator = '';
});

document.getElementById('clear').addEventListener('click', () => {
    currentInput = '';
    previousInput = '';
    operator = '';
    display.value = '';
});

document.getElementById('frac').addEventListener('click', () => {
    if (display.value === '' || isNaN(parseFloat(display.value))) {
        display.value = 'Error: Invalid number';
        return;
    }
    const decimal = parseFloat(display.value);
    display.value = decimalToFraction(decimal);
    currentInput = display.value;  // Update current input for further ops
});

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error: Division by zero';
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    display.value = result;
    currentInput = result.toString();
    previousInput = '';
}

function decimalToFraction(decimal) {
    if (decimal % 1 === 0) return decimal + "/1";  // Whole number
    let numerator = decimal;
    let denominator = 1;
    // Multiply by 10 until numerator is integer (up to 10 decimal places for approximation)
    for (let i = 0; i < 10; i++) {
        if (numerator % 1 === 0) break;
        numerator *= 10;
        denominator *= 10;
    }
    // Simplify using GCD
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const g = gcd(Math.abs(numerator), denominator);
    return (numerator / g) + "/" + (denominator / g);
}