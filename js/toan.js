// toan.js

// Hàm giải phương trình bậc nhất: ax + b = c
function solveLinear(a, b, c) {
    if (a === 0) {
        if (b === c) {
            return "Vô số nghiệm";
        } else {
            return "Vô nghiệm";
        }
    } else {
        let x = (c - b) / a;
        return x;
    }
}

// Hàm giải phương trình bậc hai: ax² + bx + c = d
function solveQuadratic(a, b, c, d) {
    let delta = b * b - 4 * a * (c - d);
    if (delta < 0) {
        return "Vô nghiệm";
    } else if (delta === 0) {
        let x = -b / (2 * a);
        return x;
    } else {
        let x1 = (-b + Math.sqrt(delta)) / (2 * a);
        let x2 = (-b - Math.sqrt(delta)) / (2 * a);
        return `${x1}, ${x2}`;
    }
}

// Hàm giải bất phương trình bậc nhất: ax + b □ c
function solveLinearInequality(a, b, c, op) {
    if (a === 0) {
        let condition = false;
        if (op === '<' && b < c) condition = true;
        else if (op === '<=' && b <= c) condition = true;
        else if (op === '>' && b > c) condition = true;
        else if (op === '>=' && b >= c) condition = true;
        return condition ? "Đúng với mọi x" : "Không có nghiệm";
    } else {
        let x = (c - b) / a;
        if (a > 0) {
            if (op === '<') return `x < ${x}`;
            else if (op === '<=') return `x ≤ ${x}`;
            else if (op === '>') return `x > ${x}`;
            else return `x ≥ ${x}`;
        } else {
            if (op === '<') return `x > ${x}`;
            else if (op === '<=') return `x ≥ ${x}`;
            else if (op === '>') return `x < ${x}`;
            else return `x ≤ ${x}`;
        }
    }
}

// Hàm giải bất phương trình bậc hai: ax² + bx + c □ d
function solveQuadraticInequality(a, b, c, d, op) {
    if (a === 0) {
        return solveLinearInequality(b, c, d, op);
    }
    let delta = b * b - 4 * a * (c - d);
    if (delta < 0) {
        let alwaysTrue = (op === '>' && a > 0) || (op === '<' && a < 0) || (op === '>=' && a > 0) || (op === '<=' && a < 0);
        return alwaysTrue ? "Đúng với mọi x" : "Không có nghiệm";
    } else if (delta === 0) {
        let x = -b / (2 * a);
        if (a > 0) {
            if (op === '>' || op === '>=') return `x ≠ ${x}`;
            else return `x = ${x}`;
        } else {
            if (op === '<' || op === '<=') return `x ≠ ${x}`;
            else return `x = ${x}`;
        }
    } else {
        let root1 = (-b + Math.sqrt(delta)) / (2 * a);
        let root2 = (-b - Math.sqrt(delta)) / (2 * a);
        let min = Math.min(root1, root2);
        let max = Math.max(root1, root2);
        if (a > 0) {
            if (op === '>') return `x < ${min} hoặc x > ${max}`;
            else if (op === '>=') return `x ≤ ${min} hoặc x ≥ ${max}`;
            else if (op === '<') return `${min} < x < ${max}`;
            else return `${min} ≤ x ≤ ${max}`;
        } else {
            if (op === '>') return `${min} < x < ${max}`;
            else if (op === '>=') return `${min} ≤ x ≤ ${max}`;
            else if (op === '<') return `x < ${min} hoặc x > ${max}`;
            else return `x ≤ ${min} hoặc x ≥ ${max}`;
        }
    }
}

// Hàm chuyển đổi số thành phân số
function toFraction(decimal) {
    if (decimal % 1 === 0) return decimal.toString();
    let sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    let numerator = decimal;
    let denominator = 1;
    while (numerator % 1 !== 0) {
        numerator *= 10;
        denominator *= 10;
    }
    let gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    let g = gcd(numerator, denominator);
    numerator /= g;
    denominator /= g;
    return `${sign * numerator}/${denominator}`;
}

// Hàm chuyển đổi kết quả thành phân số
function convertToFraction(id) {
    let span = document.getElementById(id);
    let text = span.textContent;
    if (!isNaN(text)) {
        span.textContent = toFraction(parseFloat(text));
    } else if (text.includes(',')) {
        let parts = text.split(',');
        span.textContent = parts.map(p => toFraction(parseFloat(p.trim()))).join(', ');
    }
}

// Xử lý form phương trình bậc nhất
document.getElementById('ptbninput').addEventListener('submit', function(e) {
    e.preventDefault();
    let a = parseFloat(document.getElementById('a1').value);
    let b = parseFloat(document.getElementById('b1').value);
    let c = parseFloat(document.getElementById('c1').value);
    let result = solveLinear(a, b, c);
    document.getElementById('result_ptbn').textContent = result;
});

// Xử lý form phương trình bậc hai
document.getElementById('ptbhinput').addEventListener('submit', function(e) {
    e.preventDefault();
    let a = parseFloat(document.getElementById('a2').value);
    let b = parseFloat(document.getElementById('b2').value);
    let c = parseFloat(document.getElementById('c2').value);
    let d = parseFloat(document.getElementById('d2').value);
    let result = solveQuadratic(a, b, c, d);
    document.getElementById('result_ptbh').textContent = result;
});

// Xử lý form bất phương trình bậc nhất
document.getElementById('bptbninput').addEventListener('submit', function(e) {
    e.preventDefault();
    let a = parseFloat(document.getElementById('a_bpt').value);
    let b = parseFloat(document.getElementById('b_bpt').value);
    let c = parseFloat(document.getElementById('c_bpt').value);
    let op = document.getElementById('op').value;
    let result = solveLinearInequality(a, b, c, op);
    document.getElementById('result_bptbn').textContent = result;
});

// Xử lý form bất phương trình bậc hai
document.getElementById('bptbhinput').addEventListener('submit', function(e) {
    e.preventDefault();
    let a = parseFloat(document.getElementById('a_bpt2').value);
    let b = parseFloat(document.getElementById('b_bpt2').value);
    let c = parseFloat(document.getElementById('c_bpt2').value);
    let d = parseFloat(document.getElementById('d_bpt2').value);
    let op = document.getElementById('op2').value;
    let result = solveQuadraticInequality(a, b, c, d, op);
    document.getElementById('result_bptbh').textContent = result;
});

// Xử lý máy tính
let display = document.getElementById('maytinhdisplay');
let cursorPos = 0;

function updateDisplay() {
    display.focus();
    display.setSelectionRange(cursorPos, cursorPos);
}

display.addEventListener('input', function() {
    cursorPos = display.selectionStart;
});

display.addEventListener('click', function() {
    cursorPos = display.selectionStart;
});

document.querySelectorAll('.nutmaytinh button').forEach(button => {
    button.addEventListener('click', function() {
        let val = this.textContent;
        let text = display.value;
        if (val === 'Del') {
            if (cursorPos > 0) {
                display.value = text.slice(0, cursorPos - 1) + text.slice(cursorPos);
                cursorPos--;
            }
        } else if (val === 'Clear') {
            display.value = '';
            cursorPos = 0;
        } else if (val === '←') {
            if (cursorPos > 0) cursorPos--;
        } else if (val === '→') {
            if (cursorPos < text.length) cursorPos++;
        } else if (val === '=') {
            try {
                let expr = text.replace(/\^/g, '**').replace(/√/g, 'Math.sqrt');
                let result = eval(expr);
                display.value = result;
                cursorPos = display.value.length;
            } catch {
                display.value = 'Error';
                cursorPos = 0;
            }
        } else if (val === 'x^□') {
            display.value = text.slice(0, cursorPos) + '^' + text.slice(cursorPos);
            cursorPos++;
        } else if (val === 'a/b') {
            display.value = text.slice(0, cursorPos) + '/' + text.slice(cursorPos);
            cursorPos++;
        } else {
            display.value = text.slice(0, cursorPos) + val + text.slice(cursorPos);
            cursorPos += val.length;
        }
        updateDisplay();
    });
});

// Xử lý form tìm kiếm (nếu cần, ví dụ chuyển hướng hoặc alert)
document.getElementById('timkiem').addEventListener('submit', function(e) {
    e.preventDefault();
    let query = document.getElementById('search').value;
    alert(`Tìm kiếm: ${query}`); // Thay bằng logic thực tế nếu cần
});