// ==UserScript==
// @name        Moodle Grade Dashboard & Predictor
// @namespace   Violentmonkey Scripts
// @match       https://moodle.colby.edu/grade/report/user/index.php*
// @match       https://moodle.colby.edu/my/
// @grant       GM_addStyle
// @license     MIT
// @version     4.1
// @author      -
// @description Adds a category-aware grade predictor with goal seeking, alerts, and visualizations, plus an "All Grades" dashboard with trend charts.
// @description:fix v4.1 - Fixed a critical syntax error that occurred when adding a new hypothetical assignment row.
// @downloadURL https://update.greasyfork.org/scripts/551183/Moodle%20Grade%20Dashboard%20%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/551183/Moodle%20Grade%20Dashboard%20%20Predictor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SHARED UTILITIES ---
    const STORAGE_KEY = 'moodleGradeTracker';
    const getStoredData = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const setStoredData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // --- STYLES ---
    GM_addStyle(`
        /* --- General Predictor Styles --- */
        #gradePredictorContainer { margin-top: 40px; padding: 25px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        #gradePredictorContainer h2 { margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px; color: #333; }
        .predictor-body { display: flex; gap: 30px; flex-wrap: wrap; }
        .predictor-assignments { flex: 3; min-width: 450px; }
        .predictor-sidebar { flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 20px; }
        .predictor-module { padding: 20px; background-color: #fff; border-radius: 5px; border: 1px solid #ddd; text-align: center; }
        .predictor-module h4 { margin-top: 0; color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
        .grade-category h4 { margin: 15px 0 10px 0; color: #555; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .assignment-row { display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center; padding: 8px; border-radius: 4px; background-color: #fff; border: 1px solid #eee; }
        .assignment-row input { padding: 6px; border: 1px solid #ccc; border-radius: 4px; }
        .assignment-name { flex-grow: 1; font-size: 14px; margin-right: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        input.hypothetical-name { width: 40%; margin-right: 10px; }
        input.hypothetical-grade, input.hypothetical-max-grade { width: 60px; }
        input.hypothetical-weight { width: 70px; margin-left: 10px; }
        #addAssignmentBtn { margin-top: 20px; padding: 10px 15px; width: 100%; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        #predictedGrade { font-size: 48px; font-weight: bold; color: #0056b3; margin: 10px 0; }
        #predictedLetterGrade { font-size: 24px; font-weight: bold; color: #495057; }
        #totalWeightInfo { font-size: 12px; color: #6c757d; margin-top: 15px; }

        /* --- Goal Seeker Styles --- */
        #goalSeeker .goal-inputs { display: flex; gap: 10px; justify-content: center; margin-bottom: 15px; }
        #goalSeeker input { width: 100px; text-align: center; padding: 5px; }
        #goalSeeker button { padding: 8px 12px; background-color: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; }
        #goalSeekerResult { font-size: 18px; font-weight: bold; margin-top: 10px; min-height: 25px; }

        /* --- Alerts Styles --- */
        #gradeAlerts .alert { padding: 12px; margin-bottom: 10px; border-radius: 5px; text-align: left; }
        #gradeAlerts .alert-critical { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        #gradeAlerts .alert-warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; }
        #gradeAlerts .alert-ok { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }

        /* --- Chart Styles --- */
        #categoryWeightChartContainer { position: relative; }
        #categoryWeightChart { display: block; margin: 10px auto; }
        #chartLegend { list-style: none; padding: 0; margin-top: 15px; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
        #chartLegend li { display: flex; align-items: center; font-size: 12px; }
        #chartLegend span { width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; }
        .trend-chart-container { margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px; }

        /* --- Dashboard Modal Styles --- */
        #allGradesBtn { background-color: #007bff; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 15px 0; }
        #gradesModal { display: none; position: fixed; z-index: 1001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); }
        .modal-content { background-color: #fefefe; margin: 8% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 800px; border-radius: 8px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .modal-header h2 { margin: 0; }
        .close-btn { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
        .course-grade-summary { display: grid; grid-template-columns: 2fr 1fr 1fr 80px; gap: 15px; padding: 15px 10px; border-bottom: 1px solid #eee; align-items: center; }
        .course-name { font-weight: bold; }
        .course-last-updated { font-size: 12px; color: #888; }
        .course-final-grade { font-size: 20px; font-weight: bold; text-align: center; }
        .course-trend { font-size: 16px; text-align: center; }
        .trend-up { color: #28a745; } .trend-down { color: #dc3545; } .trend-stable { color: #6c757d; }
        .show-trend-btn { font-size: 12px; padding: 4px 8px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #efefef; }
    `);

    // --- ROUTER ---
    if (window.location.pathname.includes('/grade/report/user/index.php')) {
        runGradePredictorPage();
    } else if (window.location.pathname.includes('/my/')) {
        runDashboardPage();
    }

    // --- GRADE PREDICTOR PAGE ---
    function runGradePredictorPage() {
        let categories = {};
        let allAssignments = [];
        let courseId = new URLSearchParams(window.location.search).get('id');
        let courseName = document.querySelector('h1').textContent;

        const predictorHTML = `
            <div id="gradePredictorContainer">
                <h2>Grade Dashboard for ${courseName}</h2>
                <div class="predictor-body">
                    <div class="predictor-assignments">
                        <div id="gradeCategories"></div>
                        <div id="hypotheticalAssignments" class="grade-category"><h4>Add Future Assignments</h4></div>
                        <button id="addAssignmentBtn">+ Add Assignment</button>
                    </div>
                    <div class="predictor-sidebar">
                        <div class="predictor-module" id="gradeSummary">
                            <h4>Predicted Grade</h4>
                            <div id="predictedGrade">--%</div>
                            <div id="predictedLetterGrade"></div>
                            <div id="totalWeightInfo"></div>
                        </div>
                        <div class="predictor-module" id="categoryWeightContainer">
                             <h4>Category Weights</h4>
                             <div id="categoryWeightChartContainer"></div>
                             <ul id="chartLegend"></ul>
                        </div>
                        <div class="predictor-module" id="goalSeeker">
                            <h4>Goal Seeker</h4>
                            <p style="font-size: 13px; color: #666;">What average grade do I need on my remaining assignments to get a final grade of...</p>
                            <div class="goal-inputs">
                                <input type="number" id="targetGradeInput" placeholder="e.g., 90">
                                <input type="number" id="remainingWeightInput" placeholder="Remaining %">
                            </div>
                            <div id="goalSeekerResult"></div>
                        </div>
                         <div class="predictor-module" id="gradeAlertsContainer">
                            <h4>Suggestions & Alerts</h4>
                            <div id="gradeAlerts"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('region-main').insertAdjacentHTML('beforeend', predictorHTML);

        function parseGrades() {
            const gradeTable = document.querySelector('.user-grade');
            if (!gradeTable) return;
            categories = {};
            allAssignments = [];
            let currentCategory = 'Uncategorized';
            const rows = gradeTable.querySelectorAll('tbody > tr:not(.spacer)');

            rows.forEach(row => {
                if (row.classList.contains('category')) {
                    const catNameElem = row.querySelector('a + span');
                    if (catNameElem) currentCategory = catNameElem.textContent.trim();
                } else if (row.querySelector('.column-itemname .gradeitemheader')) {
                    const nameElem = row.querySelector('.column-itemname .gradeitemheader');
                    let weight = parseFloat(row.querySelector('.column-weight').textContent.replace('%', '')) / 100;
                    let grade = parseFloat(row.querySelector('.column-grade').textContent);
                    let maxGrade = parseFloat(row.querySelector('.column-range').textContent.split('–')[1]);

                    if (!isNaN(weight) && !isNaN(grade) && !isNaN(maxGrade) && weight > 0) {
                        const assignment = { name: nameElem.textContent.trim(), grade, maxGrade, weight, isHypothetical: false };
                        if (!categories[currentCategory]) categories[currentCategory] = [];
                        categories[currentCategory].push(assignment);
                        allAssignments.push(assignment);
                    }
                }
            });
            renderCategories();
            runAllCalculations();
        }

        function renderCategories() {
            const container = document.getElementById('gradeCategories');
            container.innerHTML = '';
            for (const catName in categories) {
                if (categories[catName].every(a => a.isHypothetical)) continue;
                const catDiv = document.createElement('div');
                catDiv.className = 'grade-category';
                catDiv.innerHTML = `<h4>${catName}</h4>`;
                categories[catName].filter(a => !a.isHypothetical).forEach(a => {
                    const row = document.createElement('div');
                    row.className = 'assignment-row';
                    row.innerHTML = `<span class="assignment-name" title="${a.name}">${a.name}</span><span><strong>${(a.weight * 100).toFixed(1)}%</strong></span><span>${a.grade.toFixed(2)}/${a.maxGrade.toFixed(2)}</span>`;
                    catDiv.appendChild(row);
                });
                container.appendChild(catDiv);
            }
        }

        function runAllCalculations() {
            const { finalGrade } = calculateGrade();
            storeGrade(finalGrade);
            runAlertsAndSuggestions();
            renderCategoryWeightChart();
            setupGoalSeeker();
        }

        function calculateGrade() {
            let totalWeightedGrade = 0;
            let totalWeight = 0;
            allAssignments.forEach(a => {
                if (a.weight > 0 && a.maxGrade > 0) {
                    totalWeightedGrade += (a.grade / a.maxGrade) * a.weight;
                    totalWeight += a.weight;
                }
            });
            const finalGrade = totalWeight > 0 ? (totalWeightedGrade / totalWeight) * 100 : 0;
            document.getElementById('predictedGrade').textContent = `${finalGrade.toFixed(2)}%`;
            document.getElementById('totalWeightInfo').textContent = `Based on ${(totalWeight * 100).toFixed(0)}% of course weight.`;
            return { finalGrade, totalWeight, totalWeightedGrade };
        }

        function storeGrade(finalGrade) {
            const data = getStoredData();
            if (!data[courseId]) data[courseId] = { name: courseName, history: [] };
            const history = data[courseId].history;
            if (history.length === 0 || history[history.length - 1].grade !== finalGrade.toFixed(2)) {
                history.push({ date: new Date().toISOString().split('T')[0], grade: finalGrade.toFixed(2) });
                if (history.length > 10) history.shift();
            }
            data[courseId].name = courseName;
            setStoredData(data);
        }

        function runAlertsAndSuggestions() {
            const container = document.getElementById('gradeAlerts');
            container.innerHTML = '';
            let hasAlerts = false;
            allAssignments.filter(a => !a.isHypothetical).forEach(a => {
                if (a.grade === 0) {
                    hasAlerts = true;
                    container.innerHTML += `<div class="alert alert-critical"><strong>CRITICAL:</strong> "${a.name}" has a score of 0. This is significantly impacting your grade.</div>`;
                }
                if ((a.grade / a.maxGrade) < 0.75 && a.weight >= 0.10) {
                     hasAlerts = true;
                     container.innerHTML += `<div class="alert alert-warning"><strong>Warning:</strong> Your score on "${a.name}" is below 75% on an item worth ${(a.weight * 100).toFixed(0)}% of your grade.</div>`;
                }
            });
            if (!hasAlerts) {
                 container.innerHTML = `<div class="alert alert-ok"><strong>All Good!</strong> No immediate issues detected. Keep up the great work!</div>`;
            }
        }

        function renderCategoryWeightChart() {
            const container = document.getElementById('categoryWeightChartContainer');
            const legend = document.getElementById('chartLegend');
            container.innerHTML = ''; legend.innerHTML = '';
            const categoryWeights = {};
            let totalChartWeight = 0;
            Object.keys(categories).forEach(catName => {
                const catWeight = categories[catName].reduce((sum, a) => sum + a.weight, 0);
                if (catWeight > 0) {
                    categoryWeights[catName] = catWeight;
                    totalChartWeight += catWeight;
                }
            });

            const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];
            let cumulativePercent = 0;
            const radius = 50;
            const circumference = 2 * Math.PI * radius;
            let svg = `<svg id="categoryWeightChart" width="120" height="120" viewBox="0 0 120 120">`;
            let colorIndex = 0;

            for (const catName in categoryWeights) {
                const percent = (categoryWeights[catName] / totalChartWeight) * 100;
                const color = colors[colorIndex % colors.length];
                const offset = circumference - (cumulativePercent / 100 * circumference);

                svg += `<circle r="${radius}" cx="60" cy="60" fill="transparent" stroke="${color}" stroke-width="20"
                        stroke-dasharray="${(percent/100)*circumference} ${circumference}"
                        transform="rotate(-90 60 60)" style="stroke-dashoffset: ${offset};"></circle>`;

                legend.innerHTML += `<li><span style="background-color: ${color};"></span>${catName} (${(percent).toFixed(0)}%)</li>`;
                cumulativePercent += percent;
                colorIndex++;
            }
            svg += `</svg>`;
            container.innerHTML = svg;
        }

        function setupGoalSeeker() {
            const targetInput = document.getElementById('targetGradeInput');
            const weightInput = document.getElementById('remainingWeightInput');
            const resultDiv = document.getElementById('goalSeekerResult');

            const calculateGoal = () => {
                const targetGrade = parseFloat(targetInput.value) / 100;
                const remainingWeight = parseFloat(weightInput.value) / 100;
                if (isNaN(targetGrade) || isNaN(remainingWeight) || remainingWeight <= 0) {
                    resultDiv.textContent = ''; return;
                }
                const { totalWeight, totalWeightedGrade } = calculateGrade();
                if (totalWeight + remainingWeight > 1.01) { // Allow for rounding errors
                    resultDiv.textContent = 'Error: Weights exceed 100%'; return;
                }
                const currentScore = totalWeightedGrade;
                const targetScore = targetGrade * (totalWeight + remainingWeight);
                const neededScore = targetScore - currentScore;
                const requiredAvg = (neededScore / remainingWeight) * 100;

                if (requiredAvg > 100) {
                    resultDiv.innerHTML = `<span style="color: #dc3545;">Need: ${requiredAvg.toFixed(2)}% (High)</span>`;
                } else if (requiredAvg < 0) {
                     resultDiv.innerHTML = `<span style="color: #28a745;">Goal is already met!</span>`;
                } else {
                    resultDiv.innerHTML = `<span style="color: #0056b3;">Need: ${requiredAvg.toFixed(2)}%</span>`;
                }
            };
            targetInput.oninput = calculateGoal;
            weightInput.oninput = calculateGoal;
        }

        document.getElementById('addAssignmentBtn').addEventListener('click', () => {
             const hypoCategory = 'Hypothetical';
             if (!categories[hypoCategory]) categories[hypoCategory] = [];
             const newAssignment = { name: 'New Assignment', grade: 0, maxGrade: 100, weight: 0.1, isHypothetical: true };
             categories[hypoCategory].push(newAssignment);
             allAssignments.push(newAssignment);
             const index = categories[hypoCategory].length - 1;

             const container = document.getElementById('hypotheticalAssignments');
             const row = document.createElement('div');
             row.className = 'assignment-row';
             // *** FIX WAS APPLIED HERE *** The last input tag was missing its closing '>'
             row.innerHTML = `<input type="text" value="${newAssignment.name}" class="hypo-name" data-index="${index}"><span><input type="number" value="${newAssignment.grade}" class="hypo-grade" data-index="${index}">/<input type="number" value="${newAssignment.maxGrade}" class="hypo-max" data-index="${index}"></span><input type="number" value="${(newAssignment.weight*100).toFixed(0)}" class="hypo-weight" data-index="${index}" placeholder="%">`;
             container.appendChild(row);

             row.querySelectorAll('input').forEach(input => input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index);
                const assignment = categories[hypoCategory][idx];
                if (e.target.classList.contains('hypo-name')) assignment.name = e.target.value;
                else if (e.target.classList.contains('hypo-grade')) assignment.grade = parseFloat(e.target.value) || 0;
                else if (e.target.classList.contains('hypo-max')) assignment.maxGrade = parseFloat(e.target.value) || 100;
                else if (e.target.classList.contains('hypo-weight')) assignment.weight = parseFloat(e.target.value) / 100 || 0;
                runAllCalculations();
             }));
             runAllCalculations();
        });

        parseGrades();
    }

    // --- DASHBOARD PAGE ---
    function runDashboardPage() {
        const dashboardHeader = document.querySelector('#page-header .page-header-headings');
        if (!dashboardHeader) return;
        const button = document.createElement('button');
        button.id = 'allGradesBtn'; button.textContent = 'View All Grades Summary';
        dashboardHeader.parentNode.insertBefore(button, dashboardHeader.nextSibling);

        const modalHTML = `<div id="gradesModal"><div class="modal-content"><div class="modal-header"><h2>All Grades Summary</h2><span class="close-btn">&times;</span></div><div id="modalBody"></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('gradesModal');
        button.onclick = () => { renderModalContent(); modal.style.display = 'block'; };
        document.querySelector('.close-btn').onclick = () => modal.style.display = 'none';
        window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };

        function renderModalContent() {
            const modalBody = document.getElementById('modalBody');
            const data = getStoredData();
            if (Object.keys(data).length === 0) {
                modalBody.innerHTML = `<p>No grade data found. Visit a course's grade page first to populate this summary.</p>`; return;
            }
            let content = '';
            for (const courseId in data) {
                const course = data[courseId];
                if (!course.history || course.history.length === 0) continue;
                const latest = course.history[course.history.length - 1];
                let trendHTML = '<span class="trend-stable">—</span>';
                if (course.history.length > 1) {
                    const prev = course.history[course.history.length - 2];
                    const diff = parseFloat(latest.grade) - parseFloat(prev.grade);
                    if (diff > 0) trendHTML = `<span class="trend-up">▲ +${diff.toFixed(2)}%</span>`;
                    else if (diff < 0) trendHTML = `<span class="trend-down">▼ ${diff.toFixed(2)}%</span>`;
                }
                content += `
                    <div id="summary-${courseId}">
                        <div class="course-grade-summary">
                            <div><div class="course-name">${course.name}</div><div class="course-last-updated">Last calculated: ${new Date(latest.date).toLocaleDateString()}</div></div>
                            <div class="course-final-grade">${parseFloat(latest.grade).toFixed(2)}%</div>
                            <div class="course-trend">${trendHTML}</div>
                            <button class="show-trend-btn" data-courseid="${courseId}">Show Trend</button>
                        </div>
                    </div>`;
            }
            modalBody.innerHTML = content;
            document.querySelectorAll('.show-trend-btn').forEach(btn => btn.onclick = toggleTrendChart);
        }

        function toggleTrendChart(event) {
            const btn = event.target;
            const courseId = btn.dataset.courseid;
            const container = document.getElementById(`summary-${courseId}`);
            const existingChart = container.querySelector('.trend-chart-container');

            if (existingChart) {
                existingChart.remove();
                btn.textContent = 'Show Trend';
            } else {
                const data = getStoredData()[courseId];
                if (data && data.history.length > 1) {
                    const chartDiv = document.createElement('div');
                    chartDiv.className = 'trend-chart-container';
                    createTrendChart(data.history, chartDiv);
                    container.appendChild(chartDiv);
                    btn.textContent = 'Hide Trend';
                }
            }
        }

       function createTrendChart(history, container) {
            const grades = history.map(p => parseFloat(p.grade));
            const minGrade = Math.min(...grades);
            const maxGrade = Math.max(...grades);
            const gradeRange = maxGrade - minGrade;

            const w = 600, h = 150, p = 30;
            const gradeSpan = gradeRange < 10 ? 10 : gradeRange; // Min 10pt span to avoid flat lines
            const y_start = Math.floor(minGrade - (gradeSpan * 0.1));

            const getX = (i) => p + i * (w - 2*p) / (history.length - 1);
            const getY = (grade) => h - p - ((grade - y_start) / gradeSpan * (h - 2*p));

            let points = "";
            history.forEach((point, i) => {
                points += `${getX(i)},${getY(parseFloat(point.grade))} `;
            });

            let y_axis_labels = '';
            for(let i=0; i<=2; i++){
                const grade = y_start + (i/2 * gradeSpan);
                y_axis_labels += `<text x="${p-10}" y="${getY(grade)}" text-anchor="end" alignment-baseline="middle" font-size="10" fill="#666">${grade.toFixed(1)}%</text>`;
            }

            container.innerHTML = `
                <svg width="100%" viewBox="0 0 ${w} ${h}">
                    <line x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}" stroke="#ccc"/>
                    <line x1="${p}" y1="${p}" x2="${p}" y2="${h-p}" stroke="#ccc"/>
                    ${y_axis_labels}
                    <polyline points="${points}" fill="none" stroke="#007bff" stroke-width="2"/>
                </svg>`;
        }
    }
})();