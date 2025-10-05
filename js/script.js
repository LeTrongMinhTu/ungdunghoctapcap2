// ================== Menu Dropdown ==================
const menuBtn = document.getElementById("menuBtn");
const menuList = document.getElementById("menuList");

// Toggle menu khi bấm nút
menuBtn.addEventListener("click", () => {
  menuList.classList.toggle("show");
});

// Đóng menu nếu click ra ngoài
window.addEventListener("click", (e) => {
  if (!e.target.matches("#menuBtn")) {
    menuList.classList.remove("show");
  }
});

// Hàm mở trang mới
function openSubject(url) {
  window.open(url, "_blank");
  menuList.classList.remove("show");
}

// ================== Thời gian học ==================
let timenow = Date.now();

window.addEventListener("beforeunload", function () {
  let timeend = Date.now();
  let timespent = (timeend - timenow) / 1000 / 60 / 60;
  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  hours += timespent;
  localStorage.setItem("hours", hours);
});

// ================== Goals ==================
function markGoal(goalId) {
  localStorage.setItem("goal-" + goalId, "done");
  let li = document.getElementById("goal-" + goalId);
  if (li && !li.innerText.includes("✅")) {
    li.innerHTML = li.innerText + " ✅";
  }
}

function updateGoals() {
  ["ghichu", "tkb", "tonghop", "cauhoi"].forEach(goalId => {
    let li = document.getElementById("goal-" + goalId);
    if (localStorage.getItem("goal-" + goalId) === "done") {
      li.innerHTML = li.innerText.replace("✅", "") + " ✅";
    }
  });
}

// ================== Bảng thành tích ==================
function updateStats() {
  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  document.getElementById("hours").innerText = hours.toFixed(2);

  // tính điểm: mỗi 0.17h ~ 10 phút = 1 điểm
  let points = Math.floor(hours / 0.17);
  localStorage.setItem("points", points);
  document.getElementById("points").innerText = points;

  // badges
  let badgeBox = document.getElementById("badges");
  badgeBox.innerHTML = "";
  if (hours >= 5) badgeBox.innerHTML += "<span>🏅 5h</span>";
  if (hours >= 10) badgeBox.innerHTML += "<span>🎖️ 10h</span>";
  if (hours >= 20) badgeBox.innerHTML += "<span>🥇 20h</span>";

  // goals done
  let goals = ["ghichu", "tkb", "tonghop", "cauhoi"];
  let done = goals.filter(id => localStorage.getItem("goal-" + id) === "done").length;
  document.getElementById("goals-done").innerText = done + "/" + goals.length;

  // progress bar
  let percent = (done / goals.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

function resetProgress() {
  if (confirm("Bạn có chắc chắn muốn làm lại từ đầu không?")) {
    localStorage.clear();
    location.reload();
  }
}

// ================== Thống kê học tập (Chart.js) ==================
function renderChart() {
  let ctx = document.getElementById("studyChart").getContext("2d");

  // lưu lại lịch sử học theo ngày
  let history = JSON.parse(localStorage.getItem("history")) || [];
  let today = new Date().toLocaleDateString("vi-VN");

  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  if (!history.find(h => h.date === today)) {
    history.push({ date: today, hours: hours });
    localStorage.setItem("history", JSON.stringify(history));
  }

  let labels = history.map(h => h.date);
  let data = history.map(h => h.hours);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Tổng giờ học",
        data: data,
        borderColor: "gold",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { color: "#444" }
        },
        y: {
          ticks: { color: "#fff" },
          grid: { color: "#444" }
        }
      }
    }
  });
}

// ================== Quiz nhanh ==================
const quizData = [
  { q: "2 + 2 = ?", a: ["3", "4", "5"], correct: 1 },
  { q: "Thủ đô Việt Nam là?", a: ["Hà Nội", "Huế", "Đà Nẵng"], correct: 0 },
  { q: "H2O là công thức của?", a: ["Oxi", "Nước", "Muối"], correct: 1 },
  { q: "9 x 9 = ?", a: ["81", "72", "99"], correct: 0 },
  { q: "Who is the father of computer?", a: ["Newton", "Charles Babbage", "Einstein"], correct: 1 }
];
let quizIndex = 0, score = 0;

function startQuiz() {
  quizIndex = 0; score = 0;
  showQuestion();
}

function showQuestion() {
  if (quizIndex >= quizData.length) {
    document.getElementById("quizArea").innerHTML =
      `<p>Bạn đã hoàn thành! Điểm: ${score}/${quizData.length}</p>`;
    let high = parseInt(localStorage.getItem("highscore")) || 0;
    if (score > high) {
      localStorage.setItem("highscore", score);
      document.getElementById("quizArea").innerHTML += "<p>🎉 Kỷ lục mới!</p>";
    } else {
      document.getElementById("quizArea").innerHTML += "<p>🏆 Kỷ lục hiện tại: " + high + "</p>";
    }
    return;
  }
  let q = quizData[quizIndex];
  let html = `<p>${q.q}</p>`;
  q.a.forEach((ans, i) => {
    html += `<button onclick="checkAnswer(${i})">${ans}</button><br>`;
  });
  document.getElementById("quizArea").innerHTML = html;
}

function checkAnswer(i) {
  if (i === quizData[quizIndex].correct) score++;
  quizIndex++;
  showQuestion();
}

// ================== Dark Mode ==================
function toggleMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// ================== Music ==================
function toggleMusic() {
  let audio = document.getElementById("bgMusic");
  let musicBtn = document.getElementById("musicBtn");

  if (audio.paused) {
    audio.play();
    localStorage.setItem("musicOn", "true");
    if (musicBtn) musicBtn.innerText = "🔊";
  } else {
    audio.pause();
    localStorage.setItem("musicOn", "false");
    if (musicBtn) musicBtn.innerText = "🔇";
  }
}

// ================== Feedback ==================
function saveFeedback() {
  let fb = document.getElementById("feedback").value;
  if (fb.trim() === "") {
    document.getElementById("feedbackStatus").innerText = "❌ Vui lòng nhập góp ý!";
    return;
  }
  let list = JSON.parse(localStorage.getItem("feedbacks")) || [];
  list.push(fb);
  localStorage.setItem("feedbacks", JSON.stringify(list));
  document.getElementById("feedback").value = "";
  document.getElementById("feedbackStatus").innerText = "✅ Đã lưu góp ý!";
}

// ================== Init ==================
window.addEventListener("load", () => {
  updateGoals();
  updateStats();
  renderChart();

  // giữ dark mode khi reload
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  // giữ trạng thái nhạc khi reload
  let audio = document.getElementById("bgMusic");
  let musicBtn = document.getElementById("musicBtn");
  if (localStorage.getItem("musicOn") === "true") {
    audio.play();
    if (musicBtn) musicBtn.innerText = "🔊";
  } else {
    if (musicBtn) musicBtn.innerText = "🔇";
  }

  // hiển thị giờ học
  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  let hoursEl = document.getElementById("hours");
  if (hoursEl) hoursEl.innerText = hours.toFixed(2);
});
