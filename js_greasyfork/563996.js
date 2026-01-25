// ==UserScript==
// @name         Дневник (by @sbercreator)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  123
// @author       @sbercreator
// @match        *://cabinet.ruobr.ru/student/progress*
// @icon         https://cabinet.ruobr.ru/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563996/%D0%94%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%20%28by%20%40sbercreator%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563996/%D0%94%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%20%28by%20%40sbercreator%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let selectedSemester = null;

  function parseGradesFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const grades = [];
    const rows = doc.querySelectorAll('table tbody tr');

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 3) {
        const lesson = cells[0]?.textContent.trim() || '';
        const date = cells[1]?.textContent.trim() || '';
        const subject = cells[2]?.textContent.trim() || '';
        const mark = cells[3]?.textContent.trim() || '';

        let gradeNum = 0;
        const m = mark.toLowerCase();
        if (m.includes('отлично')) gradeNum = 5;
        else if (m.includes('хорошо')) gradeNum = 4;
        else if (m.includes('удовлетворительно')) gradeNum = 3;
        else if (m.includes('неудовлетворительно')) gradeNum = 2;

        if (gradeNum > 0 && date && subject) {
          grades.push({ lesson: parseInt(lesson) || 0, date, subject, grade: gradeNum });
        }
      }
    });

    return grades;
  }

  function getSemester(dateStr) {
    const parts = dateStr.split('.');
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    const month = date.getMonth() + 1;
    if (month >= 9 && month <= 12) return 1;
    if (month >= 1 && month <= 6) return 2;
    return 1;
  }

  function getStudentName() {
    const nameEl = document.querySelector('.top-user a, h1, .student-name');
    if (nameEl) {
      const fullName = nameEl.textContent.trim();
      const parts = fullName.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return parts[0] + ' ' + parts[1];
      return fullName;
    }
    return 'Студент';
  }

  function getGroupName() {
    const titleEl = document.querySelector('.top-title, title');
    if (titleEl) {
      const text = titleEl.textContent;
      const match = text.match(/\"([^\"]+)\"/);
      if (match) return match[1];
    }
    return '';
  }

  function getTotalPages() {
    const pagination = document.querySelectorAll('.pagination li a');
    let maxPage = 1;
    pagination.forEach(link => {
      const pageNum = parseInt(link.textContent.trim());
      if (!isNaN(pageNum) && pageNum > maxPage) maxPage = pageNum;
    });
    return maxPage;
  }

  function showSemesterDialog() {
    return new Promise((resolve) => {
      const dialogHTML = `
        <div id="semester-dialog" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(25,23,36,.98);display:flex;justify-content:center;align-items:center;z-index:10000;font-family:'Segoe UI',sans-serif;backdrop-filter:blur(16px);animation:fadeIn .5s ease">
          <div style="background:linear-gradient(135deg,rgba(31,29,46,.95),rgba(38,35,58,.95));border-radius:24px;padding:56px;max-width:720px;text-align:center;border:1px solid rgba(156,207,216,.3);box-shadow:0 30px 80px rgba(0,0,0,.9);animation:slideUp .6s ease;backdrop-filter:blur(16px)">
            <div style="font-size:56px;margin-bottom:18px;animation:float 3s ease-in-out infinite;filter:drop-shadow(0 0 20px rgba(196,167,231,.5))">📚</div>
            <h2 style="font-size:40px;margin-bottom:18px;color:#e0def4;font-weight:200;text-shadow:0 0 30px rgba(196,167,231,.5)">Выбор семестра</h2>
            <p style="color:#908caa;font-size:14px;margin-bottom:36px">Выберите период для анализа успеваемости</p>
            <div style="display:flex;gap:18px;justify-content:center;margin-bottom:28px;flex-wrap:wrap">
              <button onclick="window.selectSemester(1)" class="sem-btn" style="background:linear-gradient(135deg,#c4a7e7,#eb6f92);color:#e0def4;border:none;padding:32px 46px;border-radius:16px;font-size:20px;font-weight:700;cursor:pointer;transition:all .35s cubic-bezier(.4,0,.2,1);min-width:220px;box-shadow:0 10px 40px rgba(196,167,231,.5),inset 0 0 0 1px rgba(224,222,244,.2);position:relative;overflow:hidden;text-shadow:0 2px 4px rgba(0,0,0,.35)">
                <span style="position:relative;z-index:1">1 семестр</span>
                <div style="font-size:12px;opacity:.9;margin-top:8px;font-weight:500;position:relative;z-index:1">Сентябрь - Декабрь</div>
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#eb6f92,#c4a7e7);opacity:0;transition:opacity .35s"></div>
              </button>
              <button onclick="window.selectSemester(2)" class="sem-btn" style="background:linear-gradient(135deg,#31748f,#9ccfd8);color:#e0def4;border:none;padding:32px 46px;border-radius:16px;font-size:20px;font-weight:700;cursor:pointer;transition:all .35s cubic-bezier(.4,0,.2,1);min-width:220px;box-shadow:0 10px 40px rgba(49,116,143,.5),inset 0 0 0 1px rgba(224,222,244,.2);position:relative;overflow:hidden;text-shadow:0 2px 4px rgba(0,0,0,.35)">
                <span style="position:relative;z-index:1">2 семестр</span>
                <div style="font-size:12px;opacity:.9;margin-top:8px;font-weight:500;position:relative;z-index:1">Январь - Июнь</div>
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#9ccfd8,#31748f);opacity:0;transition:opacity .35s"></div>
              </button>
            </div>
            <button onclick="window.selectSemester('all')" style="background:rgba(224,222,244,.1);color:#e0def4;border:1px solid rgba(156,207,216,.3);padding:14px 38px;border-radius:30px;font-size:14px;cursor:pointer;transition:all .3s;backdrop-filter:blur(10px)" onmouseover="this.style.borderColor='#9ccfd8';this.style.background='rgba(156,207,216,.2)'" onmouseout="this.style.borderColor='rgba(156,207,216,.3)';this.style.background='rgba(224,222,244,.1)'">Все оценки</button>
            <div style="margin-top:46px;color:#6e6a86;font-size:12px;letter-spacing:2px">@sbercreator</div>
          </div>
        </div>
        <style>
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .sem-btn:hover{transform:scale(1.05);box-shadow:0 15px 60px rgba(196,167,231,.7),inset 0 0 0 1px rgba(224,222,244,.3)}
        .sem-btn:hover div:last-child{opacity:1}
        </style>
      `;
      document.body.insertAdjacentHTML('beforeend', dialogHTML);
      window.selectSemester = function(semester) {
        const dialog = document.getElementById('semester-dialog');
        dialog.style.animation = 'fadeOut .3s ease';
        setTimeout(() => dialog.remove(), 300);
        resolve(semester);
      };
    });
  }

  function showLoadingIndicator(current, total, semester) {
    const semesterText = semester === 'all' ? 'все оценки' : semester + ' семестр';
    const loadingHTML = `
      <div id="loading-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#191724;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;color:#e0def4;font-family:'Segoe UI',sans-serif">
        <div style="font-size:76px;margin-bottom:26px;animation:pulse 2s ease-in-out infinite;filter:drop-shadow(0 0 30px rgba(196,167,231,.8))">📚</div>
        <h2 style="font-size:30px;margin-bottom:10px;font-weight:200">Загрузка оценок</h2>
        <p style="font-size:16px;opacity:.55;margin-bottom:36px">${semesterText}</p>
        <div style="width:min(520px,80vw);height:4px;background:#26233a;border-radius:2px;overflow:hidden;box-shadow:0 0 20px rgba(196,167,231,.25)">
          <div id="progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#c4a7e7,#eb6f92,#31748f,#9ccfd8,#c4a7e7);background-size:400% 100%;animation:shimmer 3s linear infinite;transition:width .25s;box-shadow:0 0 20px rgba(196,167,231,.7)"></div>
        </div>
        <p style="font-size:12px;opacity:.35;margin-top:22px;letter-spacing:3px"><span id="current-page">${current}</span> / ${total}</p>
        <style>
        @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.85}}
        @keyframes shimmer{0%{background-position:400% 0}100%{background-position:-400% 0}}
        </style>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
  }

  function updateLoadingIndicator(current, total) {
    const currentEl = document.getElementById('current-page');
    const progressBar = document.getElementById('progress-bar');
    if (currentEl) currentEl.textContent = current;
    if (progressBar) progressBar.style.width = ((current / total) * 100) + '%';
  }

  function hideLoadingIndicator() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeOut .5s ease';
      setTimeout(() => overlay.remove(), 500);
    }
  }

  async function loadAllPages(semester) {
    const totalPages = getTotalPages();
    const allGrades = [];
    showLoadingIndicator(0, totalPages, semester);

    const currentPageGrades = parseGradesFromHTML(document.documentElement.outerHTML);
    allGrades.push(...currentPageGrades);

    for (let page = 2; page <= totalPages; page++) {
      try {
        updateLoadingIndicator(page, totalPages);
        const response = await fetch('/student/progress/?page=' + page);
        const html = await response.text();
        const grades = parseGradesFromHTML(html);
        allGrades.push(...grades);
        await new Promise(resolve => setTimeout(resolve, 220));
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }

    let filteredGrades = allGrades;
    if (semester !== 'all') {
      filteredGrades = allGrades.filter(g => getSemester(g.date) === semester);
    }
    return filteredGrades;
  }

  function calculateSubjectAverages(grades) {
    const subjects = {};
    grades.forEach(g => {
      if (!subjects[g.subject]) subjects[g.subject] = { total: 0, count: 0 };
      subjects[g.subject].total += g.grade;
      subjects[g.subject].count++;
    });
    return Object.keys(subjects).map(subject => ({
      name: subject,
      average: (subjects[subject].total / subjects[subject].count).toFixed(2),
      count: subjects[subject].count
    })).sort((a, b) => b.average - a.average);
  }

  function groupByWeeks(grades) {
    const weeks = {};
    grades.forEach(g => {
      const parts = g.date.split('.');
      const date = new Date(parts[2], parts[1] - 1, parts[0]);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const key = weekStart.toISOString().split('T')[0];
      if (!weeks[key]) weeks[key] = { title: formatWeek(weekStart), grades: [], startDate: weekStart };
      weeks[key].grades.push(g);
    });
    return Object.values(weeks).sort((a, b) => b.startDate - a.startDate);
  }

  function formatWeek(date) {
    const end = new Date(date);
    end.setDate(date.getDate() + 6);
    const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    return date.getDate() + ' ' + months[date.getMonth()] + ' - ' + end.getDate() + ' ' + months[end.getMonth()];
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function createHTML(grades, studentName, groupName) {
    const weeks = groupByWeeks(grades);
    const subjectAvgs = calculateSubjectAverages(grades);
    const total = grades.length;
    const avg = total > 0 ? (grades.reduce((s,g) => s + g.grade, 0) / total).toFixed(2) : 0;
    const grade5 = grades.filter(g => g.grade === 5).length;
    const grade4 = grades.filter(g => g.grade === 4).length;

    let subjectAvgsHTML = '<div class="avg scroll-reveal"><h3>Средние оценки</h3><div class="avg-grid">';
    subjectAvgs.forEach((s, idx) => {
      const color = parseFloat(s.average) >= 4.5 ? '#31C48D' : parseFloat(s.average) >= 3.5 ? '#3F83F8' : '#FACA15';
      const safeName = escapeHtml(s.name);
      const displayName = s.name.replace(' (базовый уровень)','').replace(' (углубленный уровень)','');
      subjectAvgsHTML += '<div class="avg-card" data-subject="' + safeName + '" style="animation-delay:' + (idx * 0.05) + 's">';
      subjectAvgsHTML += '<div class="avg-val" style="color:' + color + '">' + s.average + '</div>';
      subjectAvgsHTML += '<div class="avg-name">' + escapeHtml(displayName) + '</div>';
      subjectAvgsHTML += '<div class="avg-cnt">' + s.count + ' оценок</div>';
      subjectAvgsHTML += '</div>';
    });
    subjectAvgsHTML += '</div></div>';

    let weeksHTML = '';
    weeks.forEach((w, i) => {
      const g5 = w.grades.filter(g => g.grade === 5).length;
      const g4 = w.grades.filter(g => g.grade === 4).length;

      const sortedGrades = [...w.grades].sort((a, b) => {
        const dateA = a.date.split('.').reverse().join('');
        const dateB = b.date.split('.').reverse().join('');
        return dateB.localeCompare(dateA);
      });

      let cardsHTML = '';
      sortedGrades.forEach((g, idx) => {
        const displaySubject = g.subject.replace(' (базовый уровень)','').replace(' (углубленный уровень)','');
        cardsHTML += '<div class="gc gc-' + g.grade + '" data-s="' + escapeHtml(g.subject) + '" data-g="' + g.grade + '" style="animation-delay:' + (idx * 0.03) + 's">';
        cardsHTML += '<div class="gc-top"><span>' + escapeHtml(g.date) + '</span></div>';
        cardsHTML += '<div class="gc-subj">' + escapeHtml(displaySubject) + '</div>';
        cardsHTML += '<div class="gc-mark gc-mark-' + g.grade + '">' + g.grade + '</div>';
        cardsHTML += '</div>';
      });

      weeksHTML += '<div class="week scroll-reveal" data-week="' + i + '">';
      weeksHTML += '<div class="week-head" onclick="toggleWeek(' + i + ')"><div class="week-title">' + escapeHtml(w.title) + '</div><div class="week-stats">';
      if (g5 > 0) weeksHTML += '<span class="ws ws-5">' + g5 + '×5</span>';
      if (g4 > 0) weeksHTML += '<span class="ws ws-4">' + g4 + '×4</span>';
      weeksHTML += '<span class="week-arrow">▼</span></div></div>';
      weeksHTML += '<div class="week-content" id="week-' + i + '">' + cardsHTML + '</div>';
      weeksHTML += '</div>';
    });

    const safeStudentName = escapeHtml(studentName);
    const safeGroupName = groupName ? escapeHtml(groupName) : '';

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Электронный дневник</title>
<style>
:root{
  --base:#191724;
  --surface:#1f1d2e;
  --overlay:#26233a;
  --text:#e0def4;
  --subtle:#908caa;
  --muted:#6e6a86;
  --border:rgba(156,207,216,.25);
  --glow:rgba(196,167,231,.35);
  --green:#31C48D;
  --green2:#0E9F6E;
  --blue:#3F83F8;
  --blue2:#1C64F2;
  --yellow:#FACA15;
  --yellow2:#E3A008;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--base);color:var(--text);padding:20px;line-height:1.6;overflow-x:hidden;position:relative}

body::before{content:'';position:fixed;top:0;left:0;width:100%;height:100%;
  background:
    radial-gradient(ellipse at 30% 20%,rgba(196,167,231,.20) 0%,transparent 60%),
    radial-gradient(ellipse at 70% 70%,rgba(49,116,143,.18) 0%,transparent 60%),
    radial-gradient(ellipse at 50% 50%,rgba(235,111,146,.12) 0%,transparent 70%);
  animation:bgPulse 15s ease-in-out infinite;z-index:0;pointer-events:none
}
.stars{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.star{position:absolute;width:2px;height:2px;background:#ebbcba;border-radius:50%;animation:twinkle 3s ease-in-out infinite;opacity:.6}
.bg-orbs{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;overflow:hidden;pointer-events:none}
.orb{position:absolute;border-radius:50%;filter:blur(90px);opacity:.35;animation:float-orb 28s ease-in-out infinite}
.orb1{width:500px;height:500px;background:radial-gradient(circle,#c4a7e7,#eb6f92);top:-10%;left:-10%;animation-duration:30s}
.orb2{width:450px;height:450px;background:radial-gradient(circle,#31748f,#9ccfd8);bottom:-10%;right:-10%;animation-duration:25s;animation-delay:5s}
.orb3{width:400px;height:400px;background:radial-gradient(circle,#ebbcba,#f6c177);top:40%;left:50%;animation-duration:35s;animation-delay:10s}
.orb4{width:350px;height:350px;background:radial-gradient(circle,#eb6f92,#c4a7e7);top:60%;right:20%;animation-duration:28s;animation-delay:15s}
.mesh-bg{position:fixed;top:0;left:0;width:100%;height:100%;
  background-image:radial-gradient(circle,rgba(156,207,216,.12) 1px,transparent 1px);
  background-size:40px 40px;z-index:0;pointer-events:none;opacity:.4;animation:meshMove 20s linear infinite
}

body.lite::before{animation:none;opacity:.35}
body.lite .bg-orbs, body.lite .stars, body.lite .mesh-bg{display:none !important}
body.lite *{animation:none !important;transition:none !important}
body.lite .stat, body.lite .avg, body.lite .week, body.lite .filters, body.lite .avg-card, body.lite .gc{
  backdrop-filter:none !important;
  box-shadow:none !important;
}
body.lite .gc:hover, body.lite .stat:hover, body.lite .avg-card:hover, body.lite .week:hover{transform:none !important}
body.lite .gc:hover .gc-mark{transform:none !important}
body.lite .scroll-reveal{opacity:1 !important;transform:none !important}

.container{max-width:1200px;margin:0 auto;position:relative;z-index:1}
.header{margin-bottom:34px;animation:fadeInDown .8s ease}
.header h1{font-size:34px;font-weight:220;margin-bottom:8px;background:linear-gradient(135deg,var(--text),var(--subtle));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 26px rgba(196,167,231,.25))}
.header p{color:var(--muted);font-size:14px}

.lite-toggle{
  position:fixed;right:18px;bottom:18px;z-index:99999;
  border:1px solid rgba(156,207,216,.35);
  background:rgba(31,29,46,.65);
  color:var(--text);
  padding:10px 14px;
  border-radius:14px;
  cursor:pointer;
  font-size:13px;
  backdrop-filter:blur(12px);
  box-shadow:0 10px 30px rgba(0,0,0,.35);
  transition:transform .2s ease, background .2s ease, border-color .2s ease;
  user-select:none;
}
.lite-toggle:hover{transform:translateY(-2px);border-color:rgba(196,167,231,.55)}
body.lite .lite-toggle{background:rgba(38,35,58,.85)}

.stats{display:flex;gap:15px;margin:26px 0 26px 0;flex-wrap:wrap}
.stat{background:rgba(31,29,46,.6);backdrop-filter:blur(18px);padding:24px;border-radius:16px;min-width:130px;text-align:center;border:1px solid var(--border);transition:all .35s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;animation:fadeInUp .8s ease backwards;box-shadow:0 8px 32px rgba(0,0,0,.28),inset 0 0 0 1px rgba(224,222,244,.05)}
.stat:nth-child(1){animation-delay:.1s}
.stat:nth-child(2){animation-delay:.2s}
.stat:nth-child(3){animation-delay:.3s}
.stat:nth-child(4){animation-delay:.4s}
.stat:hover{transform:translateY(-8px) scale(1.02);border-color:rgba(156,207,216,.5)}
.stat-val{font-size:40px;font-weight:220;margin-bottom:8px;background:linear-gradient(135deg,var(--text),var(--subtle));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 18px rgba(156,207,216,.45))}
.stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:2px}

.avg{background:rgba(31,29,46,.6);backdrop-filter:blur(18px);padding:34px;border-radius:16px;margin-bottom:26px;border:1px solid var(--border);box-shadow:0 8px 32px rgba(0,0,0,.28),inset 0 0 0 1px rgba(224,222,244,.05)}
.avg h3{font-size:20px;font-weight:320;margin-bottom:22px;color:var(--text)}
.avg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.avg-card{background:rgba(38,35,58,.5);backdrop-filter:blur(10px);padding:18px;border-radius:12px;cursor:pointer;transition:all .35s cubic-bezier(.4,0,.2,1);border:1px solid rgba(156,207,216,.18);position:relative;overflow:hidden;animation:fadeInScale .6s ease backwards;box-shadow:0 4px 18px rgba(0,0,0,.2)}
.avg-card:hover{transform:translateY(-5px) scale(1.02);border-color:rgba(196,167,231,.5);box-shadow:0 15px 40px rgba(196,167,231,.26)}
.avg-val{font-size:34px;font-weight:220;margin-bottom:6px;filter:drop-shadow(0 0 10px currentColor)}
.avg-name{font-size:14px;color:var(--text);margin-bottom:5px}
.avg-cnt{font-size:12px;color:var(--muted)}

.filters{background:rgba(31,29,46,.6);backdrop-filter:blur(18px);padding:24px;border-radius:16px;margin-bottom:22px;border:1px solid var(--border);animation:fadeIn 1s ease;box-shadow:0 8px 32px rgba(0,0,0,.28),inset 0 0 0 1px rgba(224,222,244,.05)}
.filter-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;display:block}
.filter-btns{display:flex;gap:10px;flex-wrap:wrap}
.filter-btn{background:rgba(38,35,58,.55);backdrop-filter:blur(10px);color:var(--text);border:1px solid rgba(156,207,216,.2);padding:10px 18px;border-radius:25px;font-size:13px;cursor:pointer;transition:all .35s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;animation:fadeInScale .5s ease backwards;box-shadow:0 4px 15px rgba(0,0,0,.2)}
.filter-btn:hover{background:rgba(196,167,231,.13);border-color:rgba(196,167,231,.45);transform:translateY(-2px)}
.filter-btn.active{background:linear-gradient(135deg,#c4a7e7,#eb6f92);color:var(--base);border-color:transparent;font-weight:700}
.grade-btn{min-width:65px;text-align:center}
.reset-btn{background:rgba(38,35,58,.55);backdrop-filter:blur(10px);color:var(--text);border:1px solid rgba(156,207,216,.25);padding:10px 24px;border-radius:25px;font-size:13px;cursor:pointer;transition:all .35s;margin-top:15px;box-shadow:0 4px 15px rgba(0,0,0,.2)}
.reset-btn:hover{border-color:rgba(156,207,216,.6);background:rgba(156,207,216,.12);transform:scale(1.02)}

.week{background:rgba(31,29,46,.6);backdrop-filter:blur(18px);border-radius:16px;margin-bottom:18px;border:1px solid var(--border);overflow:hidden;transition:all .35s;box-shadow:0 8px 32px rgba(0,0,0,.28),inset 0 0 0 1px rgba(224,222,244,.05)}
.week:hover{border-color:rgba(156,207,216,.5)}
.week-head{padding:20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background .25s}
.week-head:hover{background:rgba(196,167,231,.08)}
.week-title{font-size:17px;font-weight:320}
.week-stats{display:flex;gap:12px;align-items:center}
.ws{padding:6px 12px;border-radius:15px;font-size:12px;font-weight:600;transition:transform .2s;backdrop-filter:blur(10px)}
.ws:hover{transform:scale(1.08)}
.ws-5{background:rgba(49,196,141,.18);color:var(--green);border:1px solid rgba(49,196,141,.45)}
.ws-4{background:rgba(63,131,248,.18);color:var(--blue);border:1px solid rgba(63,131,248,.45)}
.week-arrow{font-size:12px;color:var(--muted);margin-left:10px;transition:transform .35s cubic-bezier(.4,0,.2,1)}
.week.collapsed .week-arrow{transform:rotate(-90deg)}
.week-content{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;padding:0 20px 20px 20px;max-height:2000px;opacity:1;transition:all .45s cubic-bezier(.4,0,.2,1)}
.week.collapsed .week-content{max-height:0;opacity:0;padding:0;overflow:hidden}

.gc{background:rgba(38,35,58,.52);backdrop-filter:blur(10px);padding:16px;border-radius:12px;border-left:3px solid var(--overlay);transition:all .35s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;animation:fadeInLeft .6s ease backwards;box-shadow:0 4px 18px rgba(0,0,0,.2)}
.gc:hover{background:rgba(31,29,46,.72);transform:translateX(8px) scale(1.02)}
.gc-5{border-left-color:var(--green)}
.gc-4{border-left-color:var(--blue)}
.gc-3{border-left-color:var(--yellow)}
.gc-top{margin-bottom:10px;font-size:12px;color:var(--muted)}
.gc-subj{font-size:14px;margin-bottom:14px;color:var(--text);font-weight:450}
.gc-mark{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;font-weight:800;font-size:18px;transition:transform .55s;box-shadow:0 0 18px currentColor}
.gc:hover .gc-mark{transform:rotate(360deg) scale(1.12)}
.gc-mark-5{background:linear-gradient(135deg,var(--green),var(--green2));color:#08120d}
.gc-mark-4{background:linear-gradient(135deg,var(--blue),var(--blue2));color:#07122a}
.gc-mark-3{background:linear-gradient(135deg,var(--yellow),var(--yellow2));color:#1b1400}

.footer{text-align:center;margin-top:60px;padding:40px;color:var(--muted);font-size:12px;letter-spacing:3px}
.footer a{color:var(--subtle);text-decoration:none;transition:all .25s}
.footer a:hover{color:var(--text);letter-spacing:4px;text-shadow:0 0 20px rgba(196,167,231,.6)}

.scroll-reveal{opacity:0;transform:translateY(50px) rotateX(10deg);transform-style:preserve-3d;perspective:1000px;animation:revealScroll 1s cubic-bezier(.165,.84,.44,1) forwards}

@keyframes bgPulse{0%,100%{opacity:1}50%{opacity:.82}}
@keyframes float-orb{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}25%{transform:translate(100px,-100px) scale(1.2) rotate(90deg)}50%{transform:translate(-80px,80px) scale(.9) rotate(180deg)}75%{transform:translate(120px,60px) scale(1.1) rotate(270deg)}}
@keyframes meshMove{0%{background-position:0 0}100%{background-position:40px 40px}}
@keyframes twinkle{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeOut{from{opacity:1}to{opacity:0}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeInScale{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes revealScroll{to{opacity:1;transform:translateY(0) rotateX(0deg)}}

@media(max-width:768px){
  .stats{flex-direction:column}
  .avg-grid,.week-content{grid-template-columns:1fr}
  .filter-btns{justify-content:center}
  .orb{width:250px!important;height:250px!important}
  .lite-toggle{right:12px;bottom:12px}
}
</style>
</head><body>
<button class="lite-toggle" id="liteToggle" type="button">Lite: OFF</button>
<div class="stars"></div>
<div class="bg-orbs">
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="orb orb3"></div>
  <div class="orb orb4"></div>
</div>
<div class="mesh-bg"></div>

<div class="container">
  <div class="header">
    <h1>Электронный дневник</h1>
    <p>${safeStudentName}${safeGroupName ? ' · ' + safeGroupName : ''}</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-val" id="t">${total}</div><div class="stat-label">Оценок</div></div>
    <div class="stat"><div class="stat-val" id="a">${avg}</div><div class="stat-label">Средний</div></div>
    <div class="stat"><div class="stat-val" id="g5">${grade5}</div><div class="stat-label">Пятёрок</div></div>
    <div class="stat"><div class="stat-val" id="g4">${grade4}</div><div class="stat-label">Четвёрок</div></div>
  </div>

  ${subjectAvgsHTML}

  <div class="filters">
    <span class="filter-label">Оценка</span>
    <div class="filter-btns">
      <button class="filter-btn grade-btn active" data-type="grade" data-val="all">Все</button>
      <button class="filter-btn grade-btn" data-type="grade" data-val="5">5</button>
      <button class="filter-btn grade-btn" data-type="grade" data-val="4">4</button>
      <button class="filter-btn grade-btn" data-type="grade" data-val="3">3</button>
    </div>
    <button class="reset-btn" onclick="location.reload()">Сменить семестр</button>
  </div>

  <div id="weeks">${weeksHTML}</div>

  <div class="footer"><a href="https://t.me/sbercreator" target="_blank">@sbercreator</a></div>
</div>

<script>
const THEME_KEY='diary_theme_mode_v13';
let currentGrade='all';
let currentSubject='all';

function setLiteMode(isLite){
  document.body.classList.toggle('lite', isLite);
  const btn=document.getElementById('liteToggle');
  btn.textContent = isLite ? 'Lite: ON' : 'Lite: OFF';
  localStorage.setItem(THEME_KEY, isLite ? 'lite' : 'full');
}

(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || 'full';
  setLiteMode(saved === 'lite');
})();

(function initStars(){
  const isLite = document.body.classList.contains('lite');
  if(isLite) return;
  const holder=document.querySelector('.stars');
  for(let i=0;i<50;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.left=Math.random()*100+'%';
    star.style.top=Math.random()*100+'%';
    star.style.animationDelay=Math.random()*3+'s';
    star.style.animationDuration=(2+Math.random()*2)+'s';
    holder.appendChild(star);
  }
})();

document.getElementById('liteToggle').addEventListener('click', ()=>{
  setLiteMode(!document.body.classList.contains('lite'));
  if(document.body.classList.contains('lite')){
    const holder=document.querySelector('.stars');
    if(holder) holder.innerHTML='';
  }else{
    const holder=document.querySelector('.stars');
    if(holder && !holder.children.length){
      for(let i=0;i<50;i++){
        const star=document.createElement('div');
        star.className='star';
        star.style.left=Math.random()*100+'%';
        star.style.top=Math.random()*100+'%';
        star.style.animationDelay=Math.random()*3+'s';
        star.style.animationDuration=(2+Math.random()*2)+'s';
        holder.appendChild(star);
      }
    }
    document.querySelectorAll('.scroll-reveal').forEach(el=>{
      el.style.opacity='';
      el.style.transform='';
    });
  }
});

function toggleWeek(idx){
  document.querySelector('[data-week="'+idx+'"]').classList.toggle('collapsed');
}

function filterBySubject(subject){
  currentSubject=subject;
  applyFilters();
  const target=document.querySelector('.avg');
  if(target && !document.body.classList.contains('lite')){
    target.style.transform='translateY(-2px)';
    setTimeout(()=>target.style.transform='',140);
  }
}

document.querySelectorAll('.avg-card').forEach(card=>{
  card.addEventListener('click', function(){
    const subject = this.getAttribute('data-subject');
    filterBySubject(subject);
  });
});

document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.onclick=function(){
    const type=this.dataset.type;
    const val=this.dataset.val;
    document.querySelectorAll('[data-type="'+type+'"]').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
    if(type==='grade') currentGrade=val;
    applyFilters();
  };
});

function applyFilters(){
  let cards=document.querySelectorAll('.gc'),v=0,s5=0,s4=0,ts=0;
  cards.forEach((c,idx)=>{
    const s=c.getAttribute('data-s');
    const g=parseInt(c.getAttribute('data-g'));
    let show=true;
    if(currentSubject!=='all' && s!==currentSubject) show=false;
    if(currentGrade!=='all' && g!==parseInt(currentGrade)) show=false;

    if(show){
      c.style.display='block';
      if(!document.body.classList.contains('lite')){
        c.style.animation='fadeInLeft .6s ease '+(idx*0.02)+'s backwards';
      }
      v++; ts+=g;
      if(g===5) s5++;
      else if(g===4) s4++;
    } else {
      c.style.display='none';
    }
  });

  animateNumber('t', v);
  animateNumber('g5', s5);
  animateNumber('g4', s4);
  animateNumber('a', v>0 ? (ts/v).toFixed(2) : 0);

  document.querySelectorAll('.week').forEach(w=>{
    const vc=w.querySelectorAll('.gc:not([style*="none"])');
    w.style.display = vc.length>0 ? 'block' : 'none';
  });
}

function animateNumber(id,target){
  const el=document.getElementById(id);
  const isAvg=(id==='a');
  const isLite=document.body.classList.contains('lite');
  if(isLite){
    el.textContent = isAvg ? parseFloat(target).toFixed(2) : target;
    return;
  }
  const current=parseFloat(el.textContent)||0;
  const step=(target-current)/18;
  let count=0;
  const timer=setInterval(()=>{
    count++;
    const val=current+step*count;
    el.textContent=isAvg ? val.toFixed(2) : Math.round(val);
    if(count>=18){
      clearInterval(timer);
      el.textContent=isAvg ? parseFloat(target).toFixed(2) : target;
    }
  },28);
}

const observer=new IntersectionObserver(entries=>{
  if(document.body.classList.contains('lite')) return;
  entries.forEach((entry,idx)=>{
    if(entry.isIntersecting){
      entry.target.style.animationDelay=(idx*0.08)+'s';
      entry.target.style.animationPlayState='running';
    }
  });
},{threshold:0.12});

document.querySelectorAll('.scroll-reveal').forEach(el=>observer.observe(el));
</script>
</body></html>`;
  }

  async function main() {
    try {
      const studentName = getStudentName();
      const groupName = getGroupName();
      selectedSemester = await showSemesterDialog();
      const grades = await loadAllPages(selectedSemester);

      if (grades.length === 0) {
        hideLoadingIndicator();
        alert('Оценки не найдены!');
        return;
      }

      const html = createHTML(grades, studentName, groupName);
      hideLoadingIndicator();
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      console.error('Ошибка:', error);
      hideLoadingIndicator();
    }
  }

  setTimeout(main, 500);
})();
