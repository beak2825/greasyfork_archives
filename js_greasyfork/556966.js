// ==UserScript==
// @name         WebUntis Name Learning Quiz
// @namespace    https://greasyfork.org/en/scripts/556966-webuntis-name-learning-quiz
// @version      2.2
// @description  Lern-Quiz mit Auswahl- oder Eingabemodus, Fortschritt, Konfetti und Live-Umschaltung. Non-commercial use only. Attribution required.
// @match        *.webuntis.com/*
// @grant        none
// @author       Simon Pirker
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/556966/WebUntis%20Name%20Learning%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/556966/WebUntis%20Name%20Learning%20Quiz.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('[Quiz+] Script gestartet.');

  // === STYLES ===
  const style = document.createElement('style');
  style.textContent = `


    #quizContainer {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  padding: 25px 30px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
  z-index: 10000;
  display: none;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

    #quizContainer img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 15px;
    }
    .quiz-option {
      background: #f0f0f0;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 1em;
      margin: 5px;
      cursor: pointer;
      transition: background 0.2s;
      width: 250px;
    }
    .quiz-option:hover { background: #FFD700; }
    #quizFeedback {
      margin-top: 10px;
      font-weight: bold;
      font-size: 1.1em;
      min-height: 1.5em;
    }
    #quizProgress {
      margin-top: 8px;
      font-size: 0.9em;
      color: #333;
    }
    #quizEndButton {
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      margin-top: 15px;
      cursor: pointer;
    }
    #quizEndButton:hover { background: #c0392b; }
    #startQuizButton {
      margin: 10px;
      background: #4CAF50;
      color: white;
      font-size: 1.1em;
      border: none;
      border-radius: 50px;
      padding: 10px 20px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    #startQuizButton:hover { background: #45a049; }
    #quizModeSelect {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;
      justify-content: center;
      align-items: center;
    }
    #quizInput {
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 8px;
      width: 200px;
      margin: 5px 0;
      font-size: 1em;
    }
  `;
  document.head.appendChild(style);

  // === DATA ===
  let students = [];
  let quizList = [];
  let currentStudent = null;
  let mode = 'multiple'; // 'multiple' or 'input'
    let totalAnswers = 0;
let correctAnswers = 0;

  // === UI CREATION ===
  const quizContainer = document.createElement('div');
  quizContainer.id = 'quizContainer';
  quizContainer.innerHTML = `
    <div id="quizModeSelect">
      <label><input type="radio" name="quizMode" value="multiple" checked> Auswahl</label>
      <label><input type="radio" name="quizMode" value="input"> Eingabe</label>
    </div>
    <img id="quizImage" src="" alt="Student">
    <div id="quizOptions"></div>
    <input id="quizInput" type="text" placeholder="Name eingeben" style="display:none;">
    <button id="quizSubmit" style="display:none;">Überprüfen</button>
    <div id="quizFeedback"></div>
    <div id="quizProgress"></div>
    <button id="quizEndButton">🚪 Lernen beenden</button>
  `;
  document.body.appendChild(quizContainer);

  // === HELPERS ===
  function getStudents() {
    // ✅ Alle Schüler inkludieren (keine Filterung nach Abwesenheit)
    const cards = Array.from(document.querySelectorAll('.studentCard__container'));
    return cards.map(c => ({
      firstName: c.querySelector('.studentCard__firstName')?.innerText.trim() || '',
      lastName: c.querySelector('.studentCard__lastName')?.innerText.trim() || '',
      img: c.querySelector('img')?.src || '',
      id: Math.random().toString(36).substr(2, 9)
    }));
  }

  function pickRandom(arr, n, excludeId) {
    const filtered = arr.filter(s => s.id !== excludeId);
    return filtered.sort(() => Math.random() - 0.5).slice(0, n);
  }

  function levenshtein(a, b) {
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  }

  function isNameMatch(input, student) {
    const clean = s => s.toLowerCase().trim();
    const user = clean(input);
    const fn = clean(student.firstName);
    const ln = clean(student.lastName);
    return (
      levenshtein(user, fn) <= 1 ||
      levenshtein(user, ln) <= 1 ||
      levenshtein(user, `${fn} ${ln}`) <= 1
    );
  }

  function updateProgress() {
    const total = students.length;
    const done = total - quizList.length;
    document.getElementById('quizProgress').textContent = `Fortschritt: ${done} / ${total} richtig`;
  }

  // === QUIZ LOGIC ===
  function showNextQuestion() {
if (quizList.length === 0) {
  quizContainer.style.display = 'none';
  const total = totalAnswers;
  const correct = correctAnswers;
  const wrong = total - correct;

  launchConfetti();
  showStatsOverlay(correct, wrong, total);
  return;
}

    currentStudent = quizList[Math.floor(Math.random() * quizList.length)];
    const wrong = pickRandom(students, 4, currentStudent.id);
    const options = [currentStudent, ...wrong];
for (let i = options.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [options[i], options[j]] = [options[j], options[i]];
}

    const quizImage = document.getElementById('quizImage');
    const optContainer = document.getElementById('quizOptions');
    const inputField = document.getElementById('quizInput');
    const submitBtn = document.getElementById('quizSubmit');
    const feedback = document.getElementById('quizFeedback');

    quizImage.src = currentStudent.img || '';
    feedback.textContent = '';
    optContainer.innerHTML = '';
    inputField.value = '';

    if (mode === 'multiple') {
      optContainer.style.display = 'block';
      inputField.style.display = 'none';
      submitBtn.style.display = 'none';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = `${opt.firstName} ${opt.lastName}`;
        btn.onclick = () => checkAnswer(opt.firstName + ' ' + opt.lastName);
        optContainer.appendChild(btn);
      });
    } else {
      optContainer.style.display = 'none';
      inputField.style.display = 'block';
      submitBtn.style.display = 'block';
      inputField.focus();
      submitBtn.onclick = () => checkAnswer(inputField.value);
    }

    updateProgress();
    quizContainer.style.display = 'flex';
  }

  function checkAnswer(answer) {
    const feedback = document.getElementById('quizFeedback');
    let correct = false;
    if (mode === 'multiple') {
      const fullName = `${currentStudent.firstName} ${currentStudent.lastName}`;
      correct = answer.trim().toLowerCase() === fullName.trim().toLowerCase();
    } else {
      correct = isNameMatch(answer, currentStudent);
    }

    if (correct) {
  feedback.textContent = '✅ Korrekt!';
  feedback.style.color = '#27ae60';
  quizList = quizList.filter(s => s.id !== currentStudent.id);
  correctAnswers++;
} else {
  feedback.textContent = `❌ Richtig ist: ${currentStudent.firstName} ${currentStudent.lastName}`;
  feedback.style.color = '#e74c3c';
}
totalAnswers++;

    setTimeout(showNextQuestion, 1300);
  }

  function endQuiz() {
    quizList = [];
      totalAnswers = 0;
correctAnswers = 0;
    quizContainer.style.display = 'none';

    console.log('[Quiz+] Lernen beendet.');
  }

function launchConfetti() {
  const confetti = document.createElement('canvas');
  confetti.style.position = 'fixed';
  confetti.style.top = '0';
  confetti.style.left = '0';
  confetti.style.width = '100%';
  confetti.style.height = '100%';
  confetti.style.pointerEvents = 'none';
  confetti.style.zIndex = '999999';
  document.body.appendChild(confetti);

  const ctx = confetti.getContext('2d');
  const pieces = Array.from({ length: 200 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight - window.innerHeight,
    size: 4 + Math.random() * 6,
    color: `hsl(${Math.random() * 360},100%,50%)`,
    speed: 2 + Math.random() * 3
  }));

  let duration = 7000; // 7 Sekunden sichtbar
  let start = performance.now();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, confetti.width, confetti.height);
    pieces.forEach(p => {
      p.y += p.speed;
      if (p.y > window.innerHeight) p.y = -10;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (elapsed < duration) requestAnimationFrame(draw);
    else confetti.remove();
  }
  requestAnimationFrame(draw);
}

    function showStatsOverlay(correct, wrong, total) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.75)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '100000';

  const box = document.createElement('div');
  box.style.background = 'white';
  box.style.padding = '20px 30px';
  box.style.borderRadius = '12px';
  box.style.textAlign = 'center';
  box.style.boxShadow = '0 6px 14px rgba(0,0,0,0.3)';
  box.innerHTML = `<h2>📊 Lernstatistik</h2><canvas id="statsChart" width="200" height="200"></canvas>
    <p>Gesamt: <b>${total}</b><br>
    ✅ Richtig: <b>${correct}</b><br>
    ❌ Falsch: <b>${wrong}</b></p>`;

  const btn = document.createElement('button');
  btn.textContent = 'Schließen';
  btn.style.marginTop = '15px';
  btn.style.padding = '8px 18px';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.background = '#3498db';
  btn.style.color = 'white';
  btn.style.cursor = 'pointer';
  btn.onclick = () => overlay.remove();

  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Kreisdiagramm zeichnen
  const ctx = document.getElementById('statsChart').getContext('2d');
  const correctAngle = (correct / total) * 2 * Math.PI;
  const wrongAngle = (wrong / total) * 2 * Math.PI;

  ctx.clearRect(0, 0, 200, 200);
  // richtig (grün)
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.arc(100, 100, 90, 0, correctAngle);
  ctx.fillStyle = '#27ae60';
  ctx.fill();

  // falsch (rot)
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.arc(100, 100, 90, correctAngle, correctAngle + wrongAngle);
  ctx.fillStyle = '#e74c3c';
  ctx.fill();

  // Kreisrand
  ctx.beginPath();
  ctx.arc(100, 100, 90, 0, 2 * Math.PI);
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  ctx.stroke();
}

  // === ADD START BUTTON ===
  function addStartButton(container) {
    if (document.getElementById('startQuizButton')) return;
    const btn = document.createElement('button');
    btn.id = 'startQuizButton';
    btn.textContent = '🧠 Lern-Quiz starten';
    container.appendChild(btn);

    btn.addEventListener('click', () => {
      students = getStudents();
      if (students.length === 0) {
        alert('Keine Schüler gefunden!');
        return;
      }
      quizList = [...students];
      console.log(`[Quiz+] Starte mit ${quizList.length} Schülern.`);
      showNextQuestion();
    });
  }

  // === EVENT LISTENERS ===
  document.getElementById('quizEndButton').addEventListener('click', endQuiz);

  // Radiobuttons → sofortiger Moduswechsel
  document.querySelectorAll('input[name="quizMode"]').forEach(radio => {
    radio.addEventListener('change', e => {
      mode = e.target.value;
      console.log('[Quiz+] Modus gewechselt:', mode);
      showNextQuestion(); // 🔁 sofort aktualisieren
    });
  });

  // "Enter" löst Überprüfung aus
  document.getElementById('quizInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('quizSubmit').click();
    }
  });

  // === OBSERVER ===
  const observer = new MutationObserver(() => {
    const container = document.getElementById('classregPageForm.studentWidgets');
    if (container) addStartButton(container);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
