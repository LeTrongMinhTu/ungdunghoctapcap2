/* ================== GRAMMAR CHECK ================== */

const btnCheck = document.getElementById("check");
const inputText = document.getElementById("text");
const output = document.getElementById("output");
const correctedBox = document.getElementById("corrected");

btnCheck.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) {
        alert("⚠️ Nhập câu tiếng Anh trước nhé");
        return;
    }

    btnCheck.innerText = "Đang kiểm tra...";
    btnCheck.disabled = true;

    const params = new URLSearchParams();
    params.append("text", text);
    params.append("language", "en-US");

    try {
        const resp = await fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const data = await resp.json();

        /* ===== HIGHLIGHT LỖI (KHÔNG LỆCH) ===== */
        let highlighted = text;
        let shift = 0;

        data.matches.forEach(match => {
            const start = match.offset + shift;
            const end = start + match.length;
            const suggestion = match.replacements.length
                ? match.replacements[0].value
                : "";

            const markStart =
                `<mark data-fix="${suggestion}" title="${match.message} → ${suggestion}">`;
            const markEnd = `</mark>`;

            highlighted =
                highlighted.slice(0, start) +
                markStart +
                highlighted.slice(start, end) +
                markEnd +
                highlighted.slice(end);

            shift += markStart.length + markEnd.length;
        });

        output.innerHTML = highlighted;

        /* ===== TỰ ĐỘNG SỬA CÂU ===== */
        let corrected = text;
        data.matches
            .sort((a, b) => b.offset - a.offset)
            .forEach(match => {
                if (match.replacements.length > 0) {
                    corrected =
                        corrected.slice(0, match.offset) +
                        match.replacements[0].value +
                        corrected.slice(match.offset + match.length);
                }
            });

        correctedBox.textContent = corrected;

    } catch (err) {
        console.error(err);
        alert("❌ Không kết nối được tới API");
    } finally {
        btnCheck.innerText = "Check Grammar";
        btnCheck.disabled = false;
    }
});

/* ===== CLICK LỖI → TỰ SỬA ===== */
output.addEventListener("click", e => {
    if (e.target.tagName === "MARK") {
        const fix = e.target.dataset.fix;
        if (fix) {
            e.target.outerHTML = fix;
        }
    }
});


/* ================== THƯ VIỆN ĐỀ THI ================== */

const chonLop = document.getElementById("chon-lop");
const chonHocKi = document.getElementById("chonhocki");
const chonDe = document.getElementById("chon-de");
const btnXemDe = document.getElementById("xem-de");

btnXemDe.addEventListener("click", async () => {
    const lop = chonLop.value;
    const hk = chonHocKi.value;
    const de = chonDe.value;

    const link = `../asset/anh/${lop}/${hk}/${de}.pdf`;

    btnXemDe.innerText = "Đang mở...";
    btnXemDe.disabled = true;

    try {
        const res = await fetch(link, { method: "HEAD" });

        if (res.ok) {
            window.open(link, "_blank");
        } else {
            alert("❌ Không tìm thấy đề thi!");
        }
    } catch (e) {
        alert("❌ Lỗi khi kiểm tra đề!");
    } finally {
        btnXemDe.innerText = "Xem đề";
        btnXemDe.disabled = false;
    }
});
/* ==================  CHẤM ĐIỂM GIỌNG ĐỌC ================== */
const bodenoi = [
  "I started learning programming because I enjoy solving difficult problems.",
  "Reading books every day helps improve both vocabulary and critical thinking.",
  "The small café near my house becomes very crowded every weekend.",
  "She decided to study harder after realizing the importance of education.",
  "Technology has changed the way people communicate across long distances.",
  "He stayed up late to finish the project before the deadline.",
  "Many students find mathematics challenging but rewarding at the same time.",
  "The weather was so cold that nobody wanted to leave home.",
  "Learning a new language requires patience, practice, and daily effort.",
  "My friends and I often discuss interesting ideas after school.",
  "The movie was longer than expected but still very entertaining.",
  "Good time management helps students balance study and personal life.",
  "She felt proud after completing such a difficult task alone.",
  "The internet provides access to a huge amount of useful information.",
  "He always listens to music while doing his homework at night.",
  "Traveling to different countries helps people understand other cultures better.",
  "The teacher explained the lesson clearly so everyone could understand.",
  "I enjoy writing stories because it allows me to be creative.",
  "Hard work and consistency are important factors for long-term success.",
  "They continued practicing every day despite many early failures."
]
function randomInt(n) {
  return Math.floor(Math.random() * n);
}
document.getElementById("target").innerText = bodenoi[randomInt(20)];

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

function startRecording() {
  recognition.start();
}

recognition.onresult = function (event) {
  const spokenText = event.results[0][0].transcript.toLowerCase();
  document.getElementById("spoken").innerText = spokenText;

  const targetText = document
    .getElementById("target")
    .innerText
    .toLowerCase();

  const score = calculateScore(spokenText, targetText);
  document.getElementById("score").innerText = score;
};

function calculateScore(spoken, target) {
  const spokenWords = spoken.split(" ");
  const targetWords = target.split(" ");

  let correct = 0;

  spokenWords.forEach(word => {
    if (targetWords.includes(word)) {
      correct++;
    }
  });
  const result = Math.round((correct / targetWords.length) * 100);
  if (result >= 50) {
    document.getElementById("target").innerText = bodenoi[randomInt(20)];
  }
  return result;
}
// LẤY SMOOTH a SCROLL 
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
// ===== TỪ ĐIỂN =====

// LÀM SẠCH CÂU
function cleanText(text) {
  return text.replace(/["!]/g, "").trim();
}

// TRANSLATE TO VIET (MyMemory – CORS OK)
async function translateToVI(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`
  );

  if (!res.ok) {
    throw new Error("Lỗi gọi API dịch");
  }

  const data = await res.json();
  return data.responseData.translatedText;
}

// TRA TỪ
async function traTu() {
  const word = document.getElementById("tu-tra").value.trim();
  const result = document.getElementById("ket-qua-tra-tu");

  if (!word) {
    alert("❌ Nhập từ trước đã");
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(word)) {
    result.innerHTML = "❌ Chỉ nhập chữ cái tiếng Anh";
    return;
  }

  result.innerHTML = "⏳ Đang tra từ...";

  try {
    // 📘 TỪ ĐIỂN
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );

    if (!res.ok) {
      result.innerHTML = "❌ Không tìm thấy từ";
      return;
    }

    const data = await res.json();
    const meaning = data[0].meanings[0];
    const definitionEN = cleanText(
      meaning.definitions[0].definition
    );

    // 🌍 DỊCH
    let definitionVI = "⚠️ Không dịch được";
    try {
      definitionVI = await translateToVI(definitionEN);
    } catch (e) {
      console.warn("Lỗi dịch:", e);
    }

    result.innerHTML = `
      <h3>${data[0].word}</h3>
      <p><i>${meaning.partOfSpeech}</i></p>
      <p><b>EN:</b> ${definitionEN}</p>
      <p><b>VI:</b> ${definitionVI}</p>
    `;
  } catch (err) {
    result.innerHTML = "⚠️ Lỗi kết nối mạng";
    console.error(err);
  }
}
