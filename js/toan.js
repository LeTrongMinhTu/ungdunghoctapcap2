const features = {
    "giai phuong trinh" : "giaiphuongtrinh",
    "giải phương trình" : "giaiphuongtrinh",
    "may tinh" : "may-tinh-feature",
    "máy tính" : "may-tinh-feature",
    "li thuyet chung" : "li-thuyet-chung-feature",
    "lí thuyết chung" : "li-thuyet-chung-feature", 
    "ly thuyet chung" : "li-thuyet-chung-feature",
    "lý thuyết chung" : "li-thuyet-chung-feature",
    "toan nang cao" : "toan-nang-cao-feature",
    "toán nâng cao" : "toan-nang-cao-feature"
}

document.getElementById("timkiem").addEventListener("submit", e => {
    e.preventDefault();
    let userdata = document.getElementById("search").value.trim().toLowerCase();
    if (features[userdata]) {
        document.getElementById(features[userdata]).scrollIntoView({behavior: "smooth"})
    } else {
        alert("Sorry, it was not exist")
    }
});

//phương trình bậc nhất một ẩn
document.getElementById("ptbninput").addEventListener("submit", e => {
    e.preventDefault();
    let a_ptbn = parseFloat(document.getElementById("a1").value.trim());
    let b_ptbn = parseFloat(document.getElementById("b1").value.trim());
    let c_ptbn = parseFloat(document.getElementById("c1").value.trim());
    result = "";
    let d_ptbn = b_ptbn - c_ptbn;
    if (a_ptbn ===0 && d_ptbn === 0) {
        result = "Vô số nghiệm";
    } else if (a_ptbn === 0 && d_ptbn !== 0) {
        result = "Vô nghiệm";
    } else {
        result = `${-d_ptbn/a_ptbn}`
    }
    setResult("result_ptbn", result);
});
// Phương trình bậc hai
document.getElementById("ptbhinput").addEventListener("submit", e => {
    e.preventDefault();
    let a_ptbh = parseFloat(document.getElementById("a2").value.trim());
    let b_ptbh = parseFloat(document.getElementById("b2").value.trim());
    let c_ptbh = parseFloat(document.getElementById("c2").value.trim());
    let d_ptbh = parseFloat(document.getElementById("d2").value.trim());
    let e_ptbh = c_ptbh-d_ptbh;
    let result1 = "";
    if (a_ptbh === 0) {
        if (b_ptbh === 0 && e_ptbh === 0) {
            result1 = "Vô số nghiệm";
        } else if (b_ptbn === 0 && e !== 0) {
            result1 = "Vô nghiệm";
        } else {
            result1 = `${-e_ptbh/b_ptbh}`;
        }
    } else {
        let delta = b_ptbh*b_ptbh - 4*a_ptbh*e_ptbh;
        if (delta < 0) {
            result1 = "Vô nghiệm";
        } else if (delta == 0) {
            let x = -b_ptbh/(2*a_ptbh);
            result1 = `2 nghiệm kép là x1 = x2 = ${x}`;
        } else {
            let x1 = (-b_ptbh + Math.sqrt(delta)) / (2*a_ptbh);
            let x2 = (-b_ptbh - Math.sqrt(delta)) / (2*a_ptbh);
            result1 = `2 nghiệm phân biệt x1 = ${x1} và x2 = ${x2}`;
        }
    }
    setResult("result_ptbh", result1);
});
//Bất phương trình bậc nhất 1 ẩn
document.getElementById("bptbninput").addEventListener("submit", e => {
    e.preventDefault();

    let a = parseFloat(document.getElementById("a_bpt").value.trim());
    let b = parseFloat(document.getElementById("b_bpt").value.trim());
    let c = parseFloat(document.getElementById("c_bpt").value.trim());
    let op = document.getElementById("op").value;

    let d = b - c; // chuyển về ax + d (op) 0
    let result2 = "";

    if (a === 0) {
        if (d === 0) {
            result2 = "Bất phương trình đúng với mọi x";
        } else {
            result2 = "Bất phương trình vô nghiệm";
        }
    } else {
        // Chia cả 2 vế cho a
        let rhs = -d / a;
        if (a > 0) {
            result2 = `Nghiệm: x ${op} ${rhs}`;
        } else {
            // đổi chiều dấu
            let newOp = "";
            if (op === "<") newOp = ">";
            else if (op === "<=") newOp = ">=";
            else if (op === ">") newOp = "<";
            else if (op === ">=") newOp = "<=";

            result2 = `Nghiệm: x ${newOp} ${rhs}`;
        }
    }

    setResult("result_bptbn", result2);
});
 // Bất phương trình bậc 2
document.getElementById("bptbhinput").addEventListener("submit", e => {
    e.preventDefault();

    let a = parseFloat(document.getElementById("a_bpt2").value.trim());
    let b = parseFloat(document.getElementById("b_bpt2").value.trim());
    let c = parseFloat(document.getElementById("c_bpt2").value.trim());
    let d = parseFloat(document.getElementById("d_bpt2").value.trim());
    let op = document.getElementById("op2").value;

    // Đưa d sang trái
    c = c - d;

    let result3 = "";

    if (a === 0) {
        // Quay về bậc nhất: bx + (c-d) (op) 0
        if (b === 0) {
            if (c === 0) result3 = "Bất phương trình đúng với mọi x";
            else result3 = "Bất phương trình vô nghiệm";
        } else {
            let rhs = -c / b;
            let finalOp = b > 0 ? op : 
                (op === "<" ? ">" : op === ">" ? "<" : op === "<=" ? ">=" : "<=");
            result3 = `Nghiệm: x ${finalOp} ${rhs}`;
        }
    } else {
        let delta = b*b - 4*a*c;

        if (delta < 0) {
            if (a > 0) {
                result3 = (op === ">" || op === ">=") ? "Đúng với mọi x" : "Vô nghiệm";
            } else {
                result3 = (op === "<" || op === "<=") ? "Đúng với mọi x" : "Vô nghiệm";
            }
        } else if (delta === 0) {
            let x0 = -b / (2*a);
            if (a > 0) {
                if (op === ">") result3 = `Nghiệm: x ≠ ${x0}`;
                else if (op === ">=") result3 = "Đúng với mọi x";
                else if (op === "<") result3 = "Vô nghiệm";
                else if (op === "<=") result3 = `Nghiệm: x = ${x0}`;
            } else {
                if (op === "<") result3 = `Nghiệm: x ≠ ${x0}`;
                else if (op === "<=") result3 = "Đúng với mọi x";
                else if (op === ">") result3 = "Vô nghiệm";
                else if (op === ">=") result3 = `Nghiệm: x = ${x0}`;
            }
        } else {
            let x1 = (-b - Math.sqrt(delta)) / (2*a);
            let x2 = (-b + Math.sqrt(delta)) / (2*a);
            if (x1 > x2) [x1, x2] = [x2, x1];

            if (a > 0) {
                if (op === ">") result3 = `x < ${x1} hoặc x > ${x2}`;
                else if (op === ">=") result3 = `x ≤ ${x1} hoặc x ≥ ${x2}`;
                else if (op === "<") result3 = `${x1} < x < ${x2}`;
                else if (op === "<=") result3 = `${x1} ≤ x ≤ ${x2}`;
            } else {
                if (op === ">") result3 = `${x1} < x < ${x2}`;
                else if (op === ">=") result3 = `${x1} ≤ x ≤ ${x2}`;
                else if (op === "<") result3 = `x < ${x1} hoặc x > ${x2}`;
                else if (op === "<=") result3 = `x ≤ ${x1} hoặc x ≥ ${x2}`;
            }
        }
    }

    setResult("result_bptbh", result3);
});
function toFraction(number, epsilon = 1.0E-10) {
    if (isNaN(number)) return number;
    let sign = number < 0 ? -1 : 1;
    number = Math.abs(number);

    let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = number;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a*h1 + h2; h2 = aux;
        aux = k1; k1 = a*k1 + k2; k2 = aux;
        b = 1/(b - a);
    } while (Math.abs(number - h1/k1) > number * epsilon);

    return `${sign*h1}/${k1}`;
}

function setResult(spanId, text) {
    let span = document.getElementById(spanId);
    span.textContent = text;
    span.dataset.original = text;  // lưu kết quả gốc
}

function convertToFraction(spanId) {
    let span = document.getElementById(spanId);
    let text = span.dataset.original || span.textContent; // luôn lấy từ gốc

    // tìm số thập phân
    let matches = text.match(/-?\d+(\.\d+)?/g);
    if (!matches) return;

    matches.forEach(numStr => {
        let num = parseFloat(numStr);
        if (!isNaN(num) && !Number.isInteger(num)) {
            let frac = toFraction(num);
            text = text.replace(numStr, frac);
        }
    });

    span.textContent = text;
}
// Máy tính
// Lấy phần tử
const display = document.getElementById("maytinhdisplay");
// loại trừ 2 nút con trỏ khỏi danh sách nút chung để không bị chèn ký tự
const buttons = document.querySelectorAll(".nutmaytinh button:not(#cursor-left):not(#cursor-right)");
const cursorLeft = document.getElementById('cursor-left');
const cursorRight = document.getElementById('cursor-right');

let currentInput = "";
let lastWasResult = false; // flag để biết vừa hiển thị kết quả =

// đảm bảo input được focus và caret có vị trí hợp lý
function focusAndEnsureCaret(input) {
  input.focus();
  if (typeof input.selectionStart !== 'number') {
    input.selectionStart = input.selectionEnd = input.value.length;
  }
}

// chèn ký tự tại con trỏ (caret). Nếu vừa có kết quả và người bấm số/ '(' / '.' -> xóa kết quả cũ.
function insertAtCursor(input, text) {
  focusAndEnsureCaret(input);

  // nếu vừa hiển thị kết quả và người bấm số/ '(' / '.' --> bắt đầu nhập mới
  if (lastWasResult && /^[0-9.(]/.test(text)) {
    input.value = "";
    currentInput = "";
    lastWasResult = false;
  }

  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.value = input.value.slice(0, start) + text + input.value.slice(end);
  input.selectionStart = input.selectionEnd = start + text.length;

  currentInput = input.value;
  lastWasResult = false;
}

// xóa 1 ký tự trước con trỏ (hoặc xóa vùng chọn)
function deleteAtCursor(input) {
  focusAndEnsureCaret(input);
  const start = input.selectionStart;
  const end = input.selectionEnd;
  if (start === 0 && end === 0) return;

  if (start !== end) {
    // xóa vùng chọn
    input.value = input.value.slice(0, start) + input.value.slice(end);
    input.selectionStart = input.selectionEnd = start;
  } else {
    // xóa ký tự trước caret
    input.value = input.value.slice(0, start - 1) + input.value.slice(end);
    input.selectionStart = input.selectionEnd = start - 1;
  }
  currentInput = input.value;
  lastWasResult = false;
}

// xử lý click cho các nút (không bao gồm hai nút di chuyển)
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.innerText.trim();

    // clear
    if (value === "clear") {
      currentInput = "";
      display.value = "";
      lastWasResult = false;
      return;
    }

    // bằng =
    if (value === "=") {
      try {
        // chuyển ký hiệu hiển thị sang JS
        let expression = currentInput.replace(/x/g, '*').replace(/:/g, '/');
        // Bao phân số a/b vào ngoặc để eval đúng
        expression = expression.replace(/(\d+)\/(\d+)/g, '($1/$2)');
        let result = eval(expression);
        display.value = result;
        currentInput = String(result);
        lastWasResult = true;
      } catch (e) {
        display.value = "Lỗi";
        currentInput = "";
        lastWasResult = false;
      }
      return;
    }

    // delete/backspace
    if (value.toLowerCase() === "delete") {
      deleteAtCursor(display);
      return;
    }

    // phân số a/b
    if (value === "a/b") {
      const a = prompt("Nhập tử số:");
      const b = prompt("Nhập mẫu số:");
      if (a !== null && b !== null) insertAtCursor(display, `(${a}/${b})`);
      return;
    }

    // lũy thừa (xuất các dạng label khác nhau như x□, x^□, v.v.)
    if (/x.*□|x\^|x□/.test(value)) {
      const exponent = prompt("Nhập số mũ n:");
      if (exponent !== null) insertAtCursor(display, `**(${exponent})`);
      return;
    }

    // căn bậc n
    if (value === "ⁿ√" || value.includes('√')) {
      const n = prompt("Nhập bậc n:");
      const radicand = prompt("Nhập số dưới căn:");
      if (n !== null && radicand !== null) insertAtCursor(display, `Math.pow(${radicand},1/${n})`);
      return;
    }

    // mặc định: chèn số, dấu + - x : ( )
    insertAtCursor(display, value);
  });
});

// nút di chuyển con trỏ trái/phải
cursorLeft.addEventListener('click', () => {
  focusAndEnsureCaret(display);
  let pos = display.selectionStart;
  if (pos > 0) display.selectionStart = display.selectionEnd = pos - 1;
});

cursorRight.addEventListener('click', () => {
  focusAndEnsureCaret(display);
  let pos = display.selectionStart;
  if (pos < display.value.length) display.selectionStart = display.selectionEnd = pos + 1;
});
window.addEventListener("load", () => {
  display.focus();
});

