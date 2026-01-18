function balanceEquation() {
    const input = document.getElementById('equation-input').value;
    const resultDiv = document.getElementById('result');

    if (!input.trim()) {
        resultDiv.innerHTML = '❌ Vui lòng nhập phương trình!';
        return;
    }

    try {
        const balanced = balanceChemicalEquation(input);
        resultDiv.innerHTML = `✅ Phương trình cân bằng: ${balanced}`;
    } catch (e) {
        resultDiv.innerHTML = `❌ Lỗi: ${e.message}`;
    }
}

function balanceChemicalEquation(equation) {
    // 1️⃣ Chuẩn hoá chuỗi
    equation = equation.replace(/\s+/g, '');

    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error('Phương trình phải có đúng 1 dấu =');
    }

    const reactants = parts[0].split('+');
    const products  = parts[1].split('+');

    if (!reactants.length || !products.length) {
        throw new Error('Phải có chất ở cả hai vế');
    }

    // 2️⃣ Phân tích công thức hoá học (không ngoặc – mức phổ thông)
    function parseFormula(formula) {
        const atoms = {};
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;

        while ((match = regex.exec(formula)) !== null) {
            const el = match[1];
            const count = match[2] ? parseInt(match[2]) : 1;
            atoms[el] = (atoms[el] || 0) + count;
        }

        if (Object.keys(atoms).length === 0) {
            throw new Error(`Công thức không hợp lệ: ${formula}`);
        }
        return atoms;
    }

    // 3️⃣ Thu thập nguyên tố
    const atomSet = new Set();
    [...reactants, ...products].forEach(c => {
        const atoms = parseFormula(c);
        Object.keys(atoms).forEach(a => atomSet.add(a));
    });

    const atoms = Array.from(atomSet);
    const n = reactants.length + products.length;

    // 4️⃣ Tạo ma trận Ax = 0
    const matrix = atoms.map(() => Array(n).fill(0));

    [...reactants, ...products].forEach((compound, i) => {
        const parsed = parseFormula(compound);
        atoms.forEach((atom, r) => {
            matrix[r][i] = parsed[atom] || 0;
            if (i < reactants.length) matrix[r][i] *= -1;
        });
    });

    // 5️⃣ Giải null-space
    const coeffs = solveHomogeneous(matrix);
    if (!coeffs) throw new Error('Không thể cân bằng phương trình');

    // 6️⃣ Chuẩn hoá hệ số
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const g = coeffs.reduce((a, b) => gcd(a, b));
    const final = coeffs.map(c => c / g);

    // 7️⃣ Xuất kết quả
    const fmt = (c, k) => (k === 1 ? '' : k) + c;
    const left  = reactants.map((c, i) => fmt(c, final[i])).join(' + ');
    const right = products.map((c, i) => fmt(c, final[reactants.length + i])).join(' + ');

    return `${left} = ${right}`;
}

/* ===========================
   GIẢI HỆ AX = 0 (NULL SPACE)
   =========================== */
function solveHomogeneous(A) {
    const rows = A.length;
    const cols = A[0].length;
    const M = A.map(r => [...r]);

    let lead = 0;
    for (let r = 0; r < rows; r++) {
        if (lead >= cols) break;

        let i = r;
        while (Math.abs(M[i][lead]) < 1e-10) {
            i++;
            if (i === rows) {
                i = r;
                lead++;
                if (lead === cols) break;
            }
        }
        if (lead === cols) break;

        [M[i], M[r]] = [M[r], M[i]];

        const lv = M[r][lead];
        for (let j = 0; j < cols; j++) M[r][j] /= lv;

        for (let i = 0; i < rows; i++) {
            if (i !== r) {
                const lv2 = M[i][lead];
                for (let j = 0; j < cols; j++) {
                    M[i][j] -= lv2 * M[r][j];
                }
            }
        }
        lead++;
    }

    // đặt biến cuối = 1
    const sol = Array(cols).fill(0);
    sol[cols - 1] = 1;

    // giải ngược
    for (let i = rows - 1; i >= 0; i--) {
        const row = M[i];
        const p = row.findIndex(v => Math.abs(v) > 1e-10);
        if (p === -1 || p === cols - 1) continue;

        let sum = 0;
        for (let j = p + 1; j < cols; j++) sum += row[j] * sol[j];
        sol[p] = -sum;
    }

    // chuyển sang số nguyên
    const lcm = sol.reduce((l, v) => {
        const d = v.toString().split('.')[1]?.length || 0;
        return lcmFunc(l, 10 ** d);
    }, 1);

    const res = sol.map(v => Math.round(v * lcm));
    if (res.some(v => v <= 0)) return null;
    return res;
}

function lcmFunc(a, b) {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
}
//Bảng tuần hoàn
let elements =[];
fetch("../elements.json").then(r => r.json()).then(data => {
    elements = data;
    console.log("Loaded: ",elements.length);
});
function searchElements() {
  const input = document.getElementById("search").value.trim();
  const out = document.getElementById("output");

  if (elements.length === 0) {
    out.innerText = "⏳ Dữ liệu chưa load xong";
    return;
  }

  if (!input) {
    out.innerText = "❌ Vui lòng nhập dữ liệu";
    return;
  }

  let result = null;

  // 🔢 Nếu là số → tìm theo số khối (làm tròn)
  if (!isNaN(input)) {
    const mass = Math.round(Number(input));
    result = elements.find(e => Math.round(e.atomicMass) === mass);
  } 
  // 🔤 Nếu là chữ → tìm theo tên hoặc kí hiệu
  else {
    const key = input.toLowerCase();
    result = elements.find(e =>
      e.name.toLowerCase() === key ||
      e.symbol.toLowerCase() === key
    );
  }

  if (!result) {
    out.innerText = "❌ Không tìm thấy nguyên tố";
    return;
  }

  // ✅ Hiển thị kết quả
  out.innerHTML = `
    <h2>${result.name} (${result.symbol})</h2>
    <p>Số hiệu nguyên tử: ${result.atomicNumber}</p>
    <p>Số khối: ${result.atomicMass}</p>
    <p>Chu kì: ${result.period}</p>
    <p>Nhóm: ${result.group ?? "—"}</p>
    <p>Phân loại: ${result.category}</p>
  `;
}
//Tính toán với mol
    //Tính số mol theo số nguyên tử
function soNguyenTu() {
    const input = document.getElementById("so-nguyen-tu").value;
    const resultElement = document.getElementById("moles-result");
    if (input === "") {
        resultElement.innerText = "❌ Vui lòng nhập số nguyên tử";
        return;
    }
    const soNguyenTu = Number(input);
    if (isNaN(soNguyenTu) || soNguyenTu < 0) {
        resultElement.innerText = "❌ Vui lòng nhập số nguyên tử hợp lệ";
        return;
    }
    const soMol = soNguyenTu / 6.022e23;
    resultElement.innerText = `Số mol: ${soMol.toFixed(10)}`;
}
    //Tính số nguyên tử theo số mol
function soMol() {
    const input = document.getElementById("so-mol").value;
    const resultElement = document.getElementById("atoms-result");
    if (input === "") {
        resultElement.innerText = "❌ Vui lòng nhập số mol";
        return;
    }
    const soMol = Number(input);
    if (isNaN(soMol) || soMol < 0) {
        resultElement.innerText = "❌ Vui lòng nhập số mol hợp lệ";
        return;
    }
    const soNguyenTu = soMol * 6.022e23;
    resultElement.innerText = `Số nguyên tử: ${soNguyenTu.toExponential(10)}`;
}
    //Công thức khối lượng mol
function tinhKhoiLuongMol() {
    const mRaw = document.getElementById("khoi-luong-khoi-luong-mol").value.trim();
  const nRaw = document.getElementById("so-mol-khoi-luong-mol").value.trim();
  const MRaw = document.getElementById("khoi-luong-mol-khoi-luong-mol").value.trim();
  const out = document.getElementById("khoi-luong-result");

  const m = mRaw === "" ? null : Number(mRaw);
  const n = nRaw === "" ? null : Number(nRaw);
  const M = MRaw === "" ? null : Number(MRaw);

  //Kiểm tra nhập sai
  if (
    (m !== null && (isNaN(m) || m < 0)) ||
    (n !== null && (isNaN(n) || n < 0)) ||
    (M !== null && (isNaN(M) || M < 0))
  ) {
    out.innerText = "❌ Dữ liệu nhập không hợp lệ";
    return;
  }

  //Có m + n → tính M
  if (m !== null && n !== null && M === null) {
    out.innerText = `M = ${(m / n).toFixed(2)} g/mol`;
    return;
  }

  //Có m + M → tính n
  if (m !== null && M !== null && n === null) {
    out.innerText = `n = ${(m / M).toExponential(4)} mol`;
    return;
  }

  //Có n + M → tính m
  if (n !== null && M !== null && m === null) {
    out.innerText = `m = ${(n * M).toFixed(2)} g`;
    return;
  }

  //Nhập đủ 3 → kiểm tra đúng sai
  if (m !== null && n !== null && M !== null) {
    const expectedM = m / n;
    const saiSo = Math.abs(expectedM - M);

    if (saiSo < 0.01) {
      out.innerText = "✅ Kết quả CHÍNH XÁC";
    } else {
      out.innerText = "⚠️ Có gì đó sai sai 😅 (không thỏa m = n × M)";
    }
    return;
  }

  //Còn lại
  out.innerText = "❌ Vui lòng nhập đúng 2 hoặc 3 đại lượng";
}
    //Thể tích mol
function tinhTheTich() {
  const VRaw = document.getElementById("the-tich").value.trim();
  const nRaw = document.getElementById("so-mol-the-tich").value.trim();
  const out = document.getElementById("result-the-tich-mol");

  const V = VRaw === "" ? null : Number(VRaw.replace(",", "."));
  const n = nRaw === "" ? null : Number(nRaw.replace(",", "."));

  // ❌ Dữ liệu không hợp lệ
  if (
    (V !== null && (isNaN(V) || V < 0)) ||
    (n !== null && (isNaN(n) || n < 0))
  ) {
    out.innerText = "❌ Dữ liệu nhập không hợp lệ";
    return;
  }

  // ✅ Có n → tính V
  if (n !== null && V === null) {
    out.innerText = `V = ${(24.79 * n).toFixed(2)} lít`;
    return;
  }

  // ✅ Có V → tính n
  if (V !== null && n === null) {
    out.innerText = `n = ${(V / 24.79).toExponential(4)} mol`;
    return;
  }

  // 🔍 Có cả V và n → kiểm tra
  if (V !== null && n !== null) {
    const expectedV = 24.79 * n;
    const saiSo = Math.abs(expectedV - V);

    if (saiSo < 0.05) {
      out.innerText = "✅ Kết quả CHÍNH XÁC";
    } else {
      out.innerText = "⚠️ Có gì đó sai sai 😅 (không thỏa V = 24,79 × n)";
    }
    return;
  }

  // ❌ Không nhập gì
  out.innerText = "❌ Vui lòng nhập ít nhất 1 đại lượng";
}
    //Tính tan
function tinhDoTan() {
  const mctRaw = document.getElementById("mct").value.trim();
  const mnuocRaw = document.getElementById("mnuoc").value.trim();
  const SRaw = document.getElementById("S").value.trim();
  const out = document.getElementById("result-tinh-tan");

  const mct = mctRaw === "" ? null : Number(mctRaw.replace(",", "."));
  const mnuoc = mnuocRaw === "" ? null : Number(mnuocRaw.replace(",", "."));
  const S = SRaw === "" ? null : Number(SRaw.replace(",", "."));

  // ❌ Kiểm tra dữ liệu
  if (
    (mct !== null && (isNaN(mct) || mct < 0)) ||
    (mnuoc !== null && (isNaN(mnuoc) || mnuoc <= 0)) ||
    (S !== null && (isNaN(S) || S < 0))
  ) {
    out.innerText = "❌ Dữ liệu nhập không hợp lệ";
    return;
  }

  // ✅ Có mct + mnuoc → tính S
  if (mct !== null && mnuoc !== null && S === null) {
    out.innerText = `S = ${((mct / mnuoc) * 100).toFixed(2)} g / 100 g nước`;
    return;
  }

  // ✅ Có S + mnuoc → tính mct
  if (S !== null && mnuoc !== null && mct === null) {
    out.innerText = `m chất tan = ${((S * mnuoc) / 100).toFixed(2)} g`;
    return;
  }

  // ✅ Có S + mct → tính mnuoc
  if (S !== null && mct !== null && mnuoc === null) {
    out.innerText = `m nước = ${((mct * 100) / S).toFixed(2)} g`;
    return;
  }

  // 🔍 Có đủ 3 → kiểm tra đúng sai
  if (mct !== null && mnuoc !== null && S !== null) {
    const expectedS = (mct / mnuoc) * 100;
    const saiSo = Math.abs(expectedS - S);

    if (saiSo < 0.1) {
      out.innerText = "✅ Kết quả CHÍNH XÁC";
    } else {
      out.innerText = "⚠️ Có gì đó sai sai 😅 (không thỏa công thức độ tan)";
    }
    return;
  }

  // ❌ Trường hợp còn lại
  out.innerText = "❌ Vui lòng nhập đúng 2 hoặc 3 đại lượng";
}
    //Tính nồng độ phần trăm (C%)
function tinhC() {
  const mctRaw = document.getElementById("mct-nong-do-phan-tram").value.trim();
  const mdmRaw = document.getElementById("mdm-nong-do-phan-tram").value.trim();
  const mdRaw  = document.getElementById("md-nong-do-phan-tram").value.trim();
  const CRaw   = document.getElementById("C-nong-do-phan-tram").value.trim();
  const out = document.getElementById("result-nong-do-phan-tram");
  const mct = mctRaw === "" ? null : Number(mctRaw.replace(",", "."));
  const mdm = mdmRaw === "" ? null : Number(mdmRaw.replace(",", "."));
  const md  = mdRaw  === "" ? null : Number(mdRaw.replace(",", "."));
  const C   = CRaw   === "" ? null : Number(CRaw.replace(",", "."));

  // ❌ Kiểm tra dữ liệu
  if (
    (mct !== null && (isNaN(mct) || mct < 0)) ||
    (mdm !== null && (isNaN(mdm) || mdm < 0)) ||
    (md !== null && (isNaN(md) || md <= 0)) ||
    (C !== null && (isNaN(C) || C < 0))
  ) {
    out.innerText = "❌ Dữ liệu nhập không hợp lệ";
    return;
  }

  // ✅ Có mct + mdm → tính C%
  if (mct !== null && mdm !== null && C === null) {
    const mdCalc = mct + mdm;
    out.innerText = `C% = ${((mct / mdCalc) * 100).toFixed(2)} %`;
    return;
  }

  // ✅ Có C% + md → tính mct
  if (C !== null && md !== null && mct === null) {
    out.innerText = `m chất tan = ${((C * md) / 100).toFixed(2)} g`;
    return;
  }

  // ✅ Có C% + mct → tính md
  if (C !== null && mct !== null && md === null) {
    out.innerText = `m dung dịch = ${((mct * 100) / C).toFixed(2)} g`;
    return;
  }

  // 🔍 Có đủ 3 → kiểm tra đúng sai
  if (mct !== null && md !== null && C !== null) {
    const expectedC = (mct / md) * 100;
    const saiSo = Math.abs(expectedC - C);

    if (saiSo < 0.1) {
      out.innerText = "✅ Kết quả CHÍNH XÁC";
    } else {
      out.innerText = "⚠️ Có gì đó sai sai 😅 (không đúng công thức C%)";
    }
    return;
  }

  // ❌ Trường hợp còn lại
  out.innerText = "❌ Vui lòng nhập đúng 2 hoặc 3 đại lượng";
}
    //Nồng độ mol
function tinhCM() {
  const nRaw  = document.getElementById("n-nong-do-mol").value.trim();
  const VRaw  = document.getElementById("V-nong-do-mol").value.trim();
  const CMRaw = document.getElementById("CM-nong-do-mol").value.trim();
  const out = document.getElementById("result-nong-do-mol");

  const n  = nRaw  === "" ? null : Number(nRaw.replace(",", "."));
  const V  = VRaw  === "" ? null : Number(VRaw.replace(",", "."));
  const CM = CMRaw === "" ? null : Number(CMRaw.replace(",", "."));

  // ❌ Kiểm tra dữ liệu
  if (
    (n !== null && (isNaN(n) || n < 0)) ||
    (V !== null && (isNaN(V) || V <= 0)) ||
    (CM !== null && (isNaN(CM) || CM < 0))
  ) {
    out.innerText = "❌ Dữ liệu nhập không hợp lệ";
    return;
  }

  // ✅ Có n + V → tính CM
  if (n !== null && V !== null && CM === null) {
    out.innerText = `CM = ${(n / V).toFixed(3)} mol/L`;
    return;
  }

  // ✅ Có CM + V → tính n
  if (CM !== null && V !== null && n === null) {
    out.innerText = `n = ${(CM * V).toFixed(3)} mol`;
    return;
  }

  // ✅ Có CM + n → tính V
  if (CM !== null && n !== null && V === null) {
    out.innerText = `V = ${(n / CM).toFixed(3)} L`;
    return;
  }

  // 🔍 Có đủ 3 → kiểm tra đúng sai
  if (n !== null && V !== null && CM !== null) {
    const expectedCM = n / V;
    const saiSo = Math.abs(expectedCM - CM);

    if (saiSo < 0.01) {
      out.innerText = "✅ Kết quả CHÍNH XÁC";
    } else {
      out.innerText = "⚠️ Có gì đó sai sai 😅 (không đúng công thức CM)";
    }
    return;
  }

  // ❌ Trường hợp còn lại
  out.innerText = "❌ Vui lòng nhập đúng 2 hoặc 3 đại lượng";
}
    //Tỉ khối
function tinhTiKhoi() {
  const MARaw = document.getElementById("MA").value.trim();
  const MBRaw = document.getElementById("MB").value.trim();
  const dRaw  = document.getElementById("d").value.trim();
  const out = document.getElementById("result-ti-khoi");

  const MA = MARaw === "" ? null : Number(MARaw.replace(",", "."));
  const MB = MBRaw === "" ? null : Number(MBRaw.replace(",", "."));
  const d  = dRaw  === "" ? null : Number(dRaw.replace(",", "."));

  // ❌ Kiểm tra dữ liệu
  if (
    (MA !== null && (isNaN(MA) || MA <= 0)) ||
    (MB !== null && (isNaN(MB) || MB <= 0)) ||
    (d  !== null && (isNaN(d)  || d  <= 0))
  ) {
    out.innerText = "❌ Dữ liệu nhập không hợp lệ";
    return;
  }

  // ✅ Có MA + MB → tính d
  if (MA !== null && MB !== null && d === null) {
    out.innerText = `d(A/B) = ${(MA / MB).toFixed(3)}`;
    return;
  }

  // ✅ Có d + MB → tính MA
  if (d !== null && MB !== null && MA === null) {
    out.innerText = `M(A) = ${(d * MB).toFixed(2)} g/mol`;
    return;
  }

  // ✅ Có d + MA → tính MB
  if (d !== null && MA !== null && MB === null) {
    out.innerText = `M(B) = ${(MA / d).toFixed(2)} g/mol`;
    return;
  }

  // 🔍 Có đủ 3 → kiểm tra đúng sai
  if (MA !== null && MB !== null && d !== null) {
    const expected = MA / MB;
    const saiSo = Math.abs(expected - d);

    if (saiSo < 0.01) {
      out.innerText = "✅ Kết quả CHÍNH XÁC";
    } else {
      out.innerText = "⚠️ Sai (MA / MB ≠ d)";
    }
    return;
  }

  // ❌ Thiếu dữ kiện
  out.innerText = "❌ Vui lòng nhập đúng 2 hoặc 3 đại lượng";
}



