// ==UserScript==
// @name         Yandex Solver v4
// @namespace    http://tampermonkey.net/
// @version      40.4
// @description  Yandex Education Solver - Auto Mode
// @author       Nirupha
// @match        https://education.yandex.ru/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562482/Yandex%20Solver%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/562482/Yandex%20Solver%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS_KEY = 'ye_settings';
    const SUBJECT_ID = 'ac7328ca-dd3d-4bea-8566-9c3177273a57';
    const BASE_URL = 'https://education.yandex.ru';
    const AUTO_ANSWERS_KEY = 'ye_auto_answers';
    const AUTO_MODE_KEY = 'ye_auto_mode';
    const HIDDEN_KEY = 'ye_hidden';
    const COLLECTION_INFO_KEY = 'ye_collection_info';

    function isValidPage() {
        return /\/(collections|variants)\//.test(window.location.href);
    }

    function getCollectionId() {
        const match = window.location.href.match(/\/(collections|variants)\/([^\/\?]+)/);
        return match ? match[2] : null;
    }

    function getAnswersLogKey(collectionId) {
        return `ye_answers_log_${collectionId || 'default'}`;
    }

    function getSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return { showWrong: true, autoFill: false };
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function getCollectionTaskNumber() {
        const match = window.location.href.match(/\/(collections|variants)\/[^\/]+\/task\/(\d+)/);
        return match ? match[2] : null;
    }

    function getCollectionBaseUrl() {
        const match = window.location.href.match(/(.*\/(collections|variants)\/[^\/]+)/);
        return match ? match[1] : null;
    }

    function getCollectionInfo() {
        const collectionId = getCollectionId();
        if (!collectionId) return null;
        try {
            const saved = localStorage.getItem(`${COLLECTION_INFO_KEY}_${collectionId}`);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return null;
    }

    function saveCollectionInfo(title) {
        const collectionId = getCollectionId();
        if (!collectionId) return;
        const url = getCollectionBaseUrl();
        localStorage.setItem(`${COLLECTION_INFO_KEY}_${collectionId}`, JSON.stringify({ title, url }));
    }

    function isHidden() {
        return localStorage.getItem(HIDDEN_KEY) === 'true';
    }

    function setHidden(hidden) {
        if (hidden) {
            localStorage.setItem(HIDDEN_KEY, 'true');
        } else {
            localStorage.removeItem(HIDDEN_KEY);
        }
        updateVisibility();
    }

    function toggleHidden() {
        setHidden(!isHidden());
    }

    function updateVisibility() {
        const container = document.getElementById('ye-container');
        if (container) {
            container.style.display = isHidden() ? 'none' : 'block';
        }
    }

    function setupHiddenButton() {
        const badge = document.querySelector('[class*="EgeLevelBadge-module__EgeLevelBadge"]');
        if (!badge || badge.dataset.yeSetup) return;

        badge.dataset.yeSetup = 'true';
        badge.style.cursor = 'pointer';

        badge.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleHidden();
        });
    }

    async function getCsrfToken() {
        const response = await fetch(BASE_URL + '/api/v5/get-csrf-token', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data.sk;
    }

    async function getTaskAnswer(taskId) {
        const csrfToken = await getCsrfToken();

        const response = await fetch(BASE_URL + '/api/v5/gpttr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify([{
                type: 'get_task_by_id',
                task_id: taskId,
                params: {
                    subject_id: SUBJECT_ID
                }
            }]),
            credentials: 'include'
        });

        const data = await response.json();

        const answerLayout = data.markup?.answer_control_layout;
        if (answerLayout && answerLayout.length > 0) {
            const content = answerLayout[0].content;
            if (content?.correct_answers) {
                return content.correct_answers;
            }
        }

        return null;
    }

    async function getAllCollectionAnswers(variantId) {
        const csrfToken = await getCsrfToken();

        const response = await fetch(BASE_URL + '/api/v5/gpttr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify([{
                type: 'public_get_variant_request_item',
                variant_id: variantId,
                params: {
                    subject_id: SUBJECT_ID
                }
            }]),
            credentials: 'include'
        });

        const data = await response.json();

        const answers = {};
        let totalTasks = 0;
        let title = data.title || 'Подборка';

        saveCollectionInfo(title);

        if (data.tasks && Array.isArray(data.tasks)) {
            totalTasks = data.tasks.length;
            data.tasks.forEach((task, index) => {
                const num = index + 1;
                const answerLayout = task.markup?.answer_control_layout;

                if (answerLayout && answerLayout.length > 0) {
                    const content = answerLayout[0].content;

                    if (content?.correct_answers && typeof content.correct_answers === 'string') {
                        answers[num] = {
                            answer: content.correct_answers,
                            type: 'text',
                            taskId: task.id,
                            egeNumber: task.number
                        };
                    }
                    else if (content?.correct_answers && Array.isArray(content.correct_answers)) {
                        answers[num] = {
                            answer: content.correct_answers,
                            type: 'table',
                            taskId: task.id,
                            egeNumber: task.number
                        };
                    }
                }
            });
        }

        return { answers, totalTasks, title };
    }

    async function getTaskIdFromPage() {
        const copyBtn = document.querySelector('[data-testid="GpttrTaskTitleOverlappingButton"]');
        if (copyBtn) {
            copyBtn.click();
            await new Promise(r => setTimeout(r, 100));

            try {
                const url = await navigator.clipboard.readText();
                const match = url.match(/\/task\/([a-f0-9-]+)/);
                if (match) return match[1];
            } catch(e) {}
        }

        const links = document.querySelectorAll('a[href*="/task/"]');
        for (const link of links) {
            const match = link.href.match(/\/task\/([a-f0-9-]{36})/);
            if (match) return match[1];
        }

        return null;
    }

    function getAnswersLog() {
        const collectionId = getCollectionId();
        if (!collectionId) return {};
        try {
            const saved = localStorage.getItem(getAnswersLogKey(collectionId));
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return {};
    }

    function saveAnswerToLog(taskNum, userAnswer, isCorrect, correctAnswer, egeNumber) {
        const collectionId = getCollectionId();
        if (!collectionId) return;

        const key = getAnswersLogKey(collectionId);
        let log = getAnswersLog();
        log[taskNum] = {
            answer: userAnswer,
            isCorrect,
            correctAnswer,
            egeNumber,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(log));
    }

    function saveAllAnswersToLog(answers) {
        const collectionId = getCollectionId();
        if (!collectionId) return;

        const key = getAnswersLogKey(collectionId);
        let log = {};

        for (const [num, data] of Object.entries(answers)) {
            log[num] = {
                answer: data.answer,
                isCorrect: true,
                correctAnswer: data.answer,
                timestamp: Date.now(),
                type: data.type,
                egeNumber: data.egeNumber
            };
        }

        localStorage.setItem(key, JSON.stringify(log));
    }

    function deleteAnswerFromLog(taskNum) {
        const collectionId = getCollectionId();
        if (!collectionId) return;

        const key = getAnswersLogKey(collectionId);
        let log = getAnswersLog();
        delete log[taskNum];
        localStorage.setItem(key, JSON.stringify(log));
        forceRenderAnswersPanel();
    }

    function clearCurrentAnswersLog() {
        const collectionId = getCollectionId();
        if (!collectionId) return;
        localStorage.removeItem(getAnswersLogKey(collectionId));
    }

    function formatAnswerForCopy(data) {
        if (typeof data.answer === 'string') {
            return data.answer;
        }
        if (Array.isArray(data.answer)) {
            return data.answer.map(row => {
                if (Array.isArray(row)) return row.join(', ');
                return row;
            }).join(' | ');
        }
        return String(data.answer);
    }

    async function copyAnswersToClipboard() {
        const log = getAnswersLog();
        const entries = Object.entries(log);

        if (entries.length === 0) {
            alert('Нет ответов для копирования. Сначала загрузи ответы.');
            return false;
        }

        const info = getCollectionInfo();
        const title = info?.title || 'Подборка';
        const url = info?.url || getCollectionBaseUrl() || window.location.href;

        entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

        let text = `**${title}**\n`;
        text += `Ссылка:\n`;
        text += `**>${url}**\n\n`;

        entries.forEach(([num, data]) => {
            const answer = formatAnswerForCopy(data);
            text += `${num}: \`${answer}\`\n`;
        });

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            console.error('Copy failed:', e);
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position:fixed;top:-9999px;';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    }

    function getAutoAnswers() {
        try {
            const saved = localStorage.getItem(AUTO_ANSWERS_KEY);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return null;
    }

    function saveAutoAnswers(answers, totalTasks) {
        localStorage.setItem(AUTO_ANSWERS_KEY, JSON.stringify({ answers, totalTasks }));
    }

    function clearAutoAnswers() {
        localStorage.removeItem(AUTO_ANSWERS_KEY);
    }

    function isAutoMode() {
        return localStorage.getItem(AUTO_MODE_KEY) === 'true';
    }

    function setAutoMode(enabled) {
        if (enabled) {
            localStorage.setItem(AUTO_MODE_KEY, 'true');
        } else {
            localStorage.removeItem(AUTO_MODE_KEY);
        }
    }

    function autoFillPageInput(answer) {
        const pageInput = document.querySelector('.TaskTextinputAnswer-module__GpttrTaskTextinputAnswer_Textinput--NmcgF input.Textinput-Control');
        if (!pageInput || !answer) return false;

        const clearBtn = document.querySelector('.TaskTextinputAnswer-module__GpttrTaskTextinputAnswer_Textinput--NmcgF .Textinput-Clear');
        if (clearBtn && pageInput.value) clearBtn.click();

        const lastValue = pageInput.value;
        pageInput.value = answer;
        pageInput.focus();

        const event = new Event("input", { bubbles: true });
        const tracker = pageInput._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        pageInput.dispatchEvent(event);

        pageInput.style.backgroundColor = '#e8f5e9';
        pageInput.style.borderColor = '#4caf50';
        pageInput.style.boxShadow = '0 0 0 2px rgba(76,175,80,0.3)';

        setTimeout(() => {
            pageInput.style.backgroundColor = '';
            pageInput.style.borderColor = '';
            pageInput.style.boxShadow = '';
        }, 400);

        return true;
    }

    function clickSaveButton() {
        const saveBtn = document.querySelector('button.Button2_type_submit');
        if (saveBtn && saveBtn.textContent.includes('Сохранить')) {
            saveBtn.click();
            return true;
        }
        return false;
    }

    function goToTask(taskNum) {
        const baseUrl = getCollectionBaseUrl();
        if (baseUrl) {
            window.location.href = `${baseUrl}/task/${taskNum}`;
            return true;
        }
        return false;
    }

    async function waitForElement(selector, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await new Promise(r => setTimeout(r, 100));
        }
        return null;
    }

    async function waitForSaveComplete(timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const saveBtn = document.querySelector('button.Button2_type_submit');
            if (saveBtn && !saveBtn.disabled) {
                await new Promise(r => setTimeout(r, 500));
                return true;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        return true;
    }

    async function runAutoMode() {
        const data = getAutoAnswers();
        if (!data) {
            setAutoMode(false);
            updateAutoButton();
            return;
        }

        const { answers, totalTasks } = data;
        const currentNum = getCollectionTaskNumber();

        if (!currentNum) {
            await new Promise(r => setTimeout(r, 500));
            runAutoMode();
            return;
        }

        const numInt = parseInt(currentNum);
        const answer = answers[numInt];

        updateAutoButton(numInt, totalTasks);

        if (!answer) {
            console.log(`Нет ответа для задания ${numInt}`);
            if (numInt < totalTasks) {
                goToTask(numInt + 1);
            } else {
                setAutoMode(false);
                clearAutoAnswers();
                updateAutoButton();
                alert('✅ Автоматическое прохождение завершено!');
            }
            return;
        }

        await waitForElement('.TaskTextinputAnswer-module__GpttrTaskTextinputAnswer_Textinput--NmcgF input.Textinput-Control');
        await new Promise(r => setTimeout(r, 300));

        if (!isAutoMode()) {
            updateAutoButton();
            return;
        }

        const answerText = typeof answer.answer === 'string'
            ? answer.answer
            : (Array.isArray(answer.answer) ? answer.answer.flat().join(', ') : String(answer.answer));

        const filled = autoFillPageInput(answerText);
        if (!filled) {
            console.log('Не удалось вставить ответ');
            if (numInt < totalTasks) {
                goToTask(numInt + 1);
            }
            return;
        }

        await new Promise(r => setTimeout(r, 300));

        if (!isAutoMode()) {
            updateAutoButton();
            return;
        }

        const clicked = clickSaveButton();
        if (!clicked) {
            console.log('Не удалось нажать кнопку сохранения');
        }

        await waitForSaveComplete();

        saveAnswerToLog(currentNum, answerText, true, answerText, answer.egeNumber);

        if (!isAutoMode()) {
            updateAutoButton();
            forceRenderAnswersPanel();
            return;
        }

        if (numInt < totalTasks) {
            await new Promise(r => setTimeout(r, 200));
            goToTask(numInt + 1);
        } else {
            setAutoMode(false);
            clearAutoAnswers();
            updateAutoButton();
            forceRenderAnswersPanel();
            alert('✅ Автоматическое прохождение завершено!');
        }
    }

    function updateAutoButton(current, total) {
        const btn = document.getElementById('ye-auto-btn');
        if (!btn) return;

        if (isAutoMode() && current && total) {
            btn.textContent = `⏸ ${current}/${total}`;
            btn.style.background = '#ff9800';
        } else if (isAutoMode()) {
            btn.textContent = '⏸ Стоп';
            btn.style.background = '#ff9800';
        } else {
            btn.textContent = '▶ Авто';
            btn.style.background = '#9c27b0';
        }
    }

    function createToggle(id, label, initialChecked, onChange) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex;align-items:center;gap:6px;`;

        const toggle = document.createElement('div');
        toggle.id = id;
        toggle.dataset.checked = initialChecked ? 'true' : 'false';
        toggle.style.cssText = `width:32px;height:18px;background:${initialChecked ? '#4caf50' : '#ccc'};border-radius:9px;position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;`;

        const knob = document.createElement('div');
        knob.style.cssText = `width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;top:2px;left:${initialChecked ? '16px' : '2px'};transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.3);`;
        toggle.appendChild(knob);

        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = `font-size:11px;color:#666;white-space:nowrap;cursor:pointer;`;

        const handleClick = () => {
            const isCurrentlyChecked = toggle.dataset.checked === 'true';
            const newState = !isCurrentlyChecked;
            toggle.dataset.checked = newState ? 'true' : 'false';
            toggle.style.background = newState ? '#4caf50' : '#ccc';
            knob.style.left = newState ? '16px' : '2px';
            onChange(newState);
        };

        toggle.onclick = handleClick;
        labelEl.onclick = handleClick;

        wrapper.appendChild(toggle);
        wrapper.appendChild(labelEl);
        return wrapper;
    }

    let lastRenderedHash = '';

    function forceRenderAnswersPanel() {
        lastRenderedHash = '';
        renderAnswersPanel();
    }

    function formatAnswer(data) {
        if (typeof data.answer === 'string') {
            return data.answer;
        }
        if (Array.isArray(data.answer)) {
            return data.answer.map(row => {
                if (Array.isArray(row)) return row.join(', ');
                return row;
            }).join(' | ');
        }
        return String(data.answer);
    }

    function renderAnswersPanel() {
        if (!isValidPage()) return;

        const container = document.getElementById('ye-container');
        if (!container) return;

        const log = getAnswersLog();
        const entries = Object.entries(log);
        const settings = getSettings();

        let panel = document.getElementById('ye-answers-panel');
        const currentHash = JSON.stringify(log) + JSON.stringify(settings);

        if (panel && currentHash === lastRenderedHash) return;
        lastRenderedHash = currentHash;

        if (entries.length === 0) {
            if (panel) panel.remove();
            return;
        }

        if (panel) panel.remove();

        panel = document.createElement('div');
        panel.id = 'ye-answers-panel';
        panel.style.cssText = `display:flex;flex-direction:column;gap:4px;margin-top:10px;padding:10px 12px;background:rgba(0,0,0,0.03);border-radius:8px;font-size:13px;max-height:400px;overflow-y:auto;`;
        container.appendChild(panel);

        entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

        const currentNum = getCollectionTaskNumber();

        entries.forEach(([num, data]) => {
            const isCorrect = data.isCorrect === true;
            const displayAnswer = formatAnswer(data);
            const isCurrent = num === currentNum;

            const item = document.createElement('div');
            item.style.cssText = `display:inline-flex;align-items:center;gap:4px;padding:4px 8px;background:${isCurrent ? 'rgba(33,150,243,0.1)' : 'rgba(0,0,0,0.03)'};border-radius:4px;position:relative;cursor:pointer;align-self:flex-start;${isCurrent ? 'border:1px solid rgba(33,150,243,0.3);' : ''}`;

            item.onclick = () => {
                autoFillPageInput(typeof data.answer === 'string' ? data.answer : displayAnswer);
            };

            if (isCorrect) {
                const symSpan = document.createElement('span');
                symSpan.style.cssText = `color:#4caf50;font-weight:600;`;
                symSpan.textContent = '✓';
                item.appendChild(symSpan);
            }

            const numSpan = document.createElement('span');
            numSpan.style.cssText = `opacity:0.5;font-weight:600;`;
            const egeNum = data.egeNumber ? ` (№${data.egeNumber})` : '';
            numSpan.textContent = `${num}${egeNum}:`;

            const answerSpan = document.createElement('span');

            if (isCorrect) {
                answerSpan.innerHTML = `<b>${displayAnswer}</b>`;
            } else if (data.correctAnswer) {
                if (settings.showWrong) {
                    answerSpan.innerHTML = `<b style="color:#e53935">${data.answer}</b> → <b style="color:#4caf50">${data.correctAnswer}</b>`;
                } else {
                    answerSpan.innerHTML = `<b style="color:#4caf50">${data.correctAnswer}</b>`;
                }
            } else {
                answerSpan.innerHTML = `<b style="color:#e53935">${data.answer}</b>`;
            }

            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = '✕';
            deleteBtn.style.cssText = `position:absolute;top:-6px;right:-6px;width:16px;height:16px;background:#e53935;color:#fff;border-radius:50%;font-size:10px;display:none;align-items:center;justify-content:center;cursor:pointer;line-height:16px;text-align:center;`;
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteAnswerFromLog(num);
            };

            item.onmouseenter = () => { deleteBtn.style.display = 'flex'; };
            item.onmouseleave = () => { deleteBtn.style.display = 'none'; };

            item.appendChild(numSpan);
            item.appendChild(answerSpan);
            item.appendChild(deleteBtn);
            panel.appendChild(item);
        });

        const clearAll = document.createElement('button');
        clearAll.textContent = '🗑';
        clearAll.title = 'Очистить';
        clearAll.style.cssText = `padding:4px 8px;background:rgba(0,0,0,0.08);border:none;border-radius:4px;font-size:12px;cursor:pointer;align-self:flex-end;margin-top:4px;`;
        clearAll.onclick = () => {
            if (confirm('Очистить историю?')) {
                clearCurrentAnswersLog();
                panel.remove();
                lastRenderedHash = '';
            }
        };
        panel.appendChild(clearAll);
    }

    function findPanelParent() {
        const aiMessage = document.querySelector('[class*="ChatAssistantMessage-module__assistant_message_border"]');
        if (aiMessage && aiMessage.parentElement) {
            return { parent: aiMessage.parentElement, insertAfter: aiMessage };
        }

        const taskBubble = document.querySelector('[class*="GpttrTaskDetails-module__GpttrTaskBubble--"]');
        if (taskBubble) {
            const footer = taskBubble.querySelector('footer');
            if (footer) {
                return { parent: footer, insertAfter: footer.querySelector('form') };
            }
            const canvas = taskBubble.querySelector('canvas');
            if (canvas) {
                return { parent: taskBubble, insertBefore: canvas };
            }
            return { parent: taskBubble, insertAfter: null };
        }

        const answerForm = document.querySelector('[data-testid="TaskTextinputAnswerForm"]');
        if (answerForm && answerForm.parentElement) {
            return { parent: answerForm.parentElement, insertAfter: answerForm };
        }

        return null;
    }

    let lastUrl = window.location.href;

    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            lastRenderedHash = '';
        }
    }

    async function checkAnswer(userAnswer) {
        const taskNum = getCollectionTaskNumber();
        if (!taskNum) throw new Error('Не удалось определить номер задания');

        const taskId = await getTaskIdFromPage();
        if (!taskId) throw new Error('Не удалось получить ID задания');

        const correctAnswer = await getTaskAnswer(taskId);
        if (!correctAnswer) throw new Error('Не удалось получить правильный ответ');

        const isCorrect = userAnswer.trim() === correctAnswer.trim();

        return { isCorrect, correctAnswer, taskNum };
    }

    function createControlPanel() {
        checkUrlChange();
        setupHiddenButton();

        if (isHidden()) {
            const existing = document.getElementById('ye-container');
            if (existing) existing.style.display = 'none';
            return;
        }

        const existingContainer = document.getElementById('ye-container');

        const placement = findPanelParent();
        if (!placement) return;

        if (existingContainer && placement.parent.contains(existingContainer)) {
            existingContainer.style.display = 'block';
            return;
        }
        if (existingContainer) existingContainer.remove();

        const taskNum = getCollectionTaskNumber() || '?';
        const settings = getSettings();
        const collectionId = getCollectionId();

        const container = document.createElement('div');
        container.id = 'ye-container';
        container.style.cssText = `margin-top:12px;margin-bottom:12px;display:block;`;

        const panel = document.createElement('div');
        panel.id = 'ye-panel';
        panel.style.cssText = `display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(0,0,0,0.05);border-radius:8px;flex-wrap:wrap;`;

        const numLabel = document.createElement('span');
        numLabel.id = 'ye-task-num';
        numLabel.textContent = `№${taskNum}`;
        numLabel.style.cssText = `font-size:15px;font-weight:600;color:#4caf50;min-width:30px;`;

        const sep1 = document.createElement('div');
        sep1.style.cssText = `width:1px;height:20px;background:rgba(0,0,0,0.1);`;

        const showAllBtn = document.createElement('button');
        showAllBtn.id = 'ye-show-all-btn';
        showAllBtn.textContent = '📋';
        showAllBtn.title = 'Показать все ответы';
        showAllBtn.style.cssText = `padding:6px 10px;background:#2196F3;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;`;

        showAllBtn.onclick = async () => {
            if (!collectionId) {
                alert('Не удалось определить ID подборки');
                return;
            }

            showAllBtn.textContent = '⏳';
            showAllBtn.disabled = true;

            try {
                const { answers, totalTasks, title } = await getAllCollectionAnswers(collectionId);
                const count = Object.keys(answers).length;

                if (count === 0) {
                    alert('Не удалось получить ответы');
                    return;
                }

                saveAllAnswersToLog(answers);
                forceRenderAnswersPanel();

                showAllBtn.textContent = '✓';
                showAllBtn.style.background = '#4caf50';

                setTimeout(() => {
                    showAllBtn.textContent = '📋';
                    showAllBtn.style.background = '#2196F3';
                    showAllBtn.disabled = false;
                }, 1000);

            } catch (err) {
                console.error(err);
                alert('Ошибка: ' + err.message);
                showAllBtn.textContent = '📋';
                showAllBtn.disabled = false;
            }
        };

        const copyBtn = document.createElement('button');
        copyBtn.id = 'ye-copy-btn';
        copyBtn.textContent = '📄';
        copyBtn.title = 'Копировать ответы';
        copyBtn.style.cssText = `padding:6px 10px;background:#607D8B;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;`;

        copyBtn.onclick = async () => {
            copyBtn.textContent = '⏳';
            copyBtn.disabled = true;

            const log = getAnswersLog();
            const hasAnswers = Object.keys(log).length > 0;

            if (!hasAnswers && collectionId) {
                try {
                    const { answers } = await getAllCollectionAnswers(collectionId);
                    saveAllAnswersToLog(answers);
                    forceRenderAnswersPanel();
                } catch (err) {
                    console.error(err);
                    alert('Ошибка загрузки: ' + err.message);
                    copyBtn.textContent = '📄';
                    copyBtn.disabled = false;
                    return;
                }
            }

            const success = await copyAnswersToClipboard();

            if (success) {
                copyBtn.textContent = '✓';
                copyBtn.style.background = '#4caf50';
            } else {
                copyBtn.textContent = '✗';
                copyBtn.style.background = '#e53935';
            }

            setTimeout(() => {
                copyBtn.textContent = '📄';
                copyBtn.style.background = '#607D8B';
                copyBtn.disabled = false;
            }, 1000);
        };

        const autoBtn = document.createElement('button');
        autoBtn.id = 'ye-auto-btn';
        autoBtn.textContent = isAutoMode() ? '⏸ Стоп' : '▶ Авто';
        autoBtn.title = 'Автоматическое прохождение';
        autoBtn.style.cssText = `padding:6px 10px;background:${isAutoMode() ? '#ff9800' : '#9c27b0'};color:#fff;border:none;border-radius:6px;font-size:12px;cursor:pointer;font-weight:bold;`;

        autoBtn.onclick = async () => {
            if (isAutoMode()) {
                setAutoMode(false);
                clearAutoAnswers();
                updateAutoButton();
                return;
            }

            if (!collectionId) {
                alert('Не удалось определить ID подборки');
                return;
            }

            autoBtn.textContent = '⏳';
            autoBtn.disabled = true;

            try {
                const { answers, totalTasks } = await getAllCollectionAnswers(collectionId);
                const count = Object.keys(answers).length;

                if (count === 0) {
                    alert('Не удалось получить ответы');
                    autoBtn.textContent = '▶ Авто';
                    autoBtn.disabled = false;
                    return;
                }

                saveAutoAnswers(answers, totalTasks);
                setAutoMode(true);

                saveAllAnswersToLog(answers);
                forceRenderAnswersPanel();

                autoBtn.disabled = false;
                updateAutoButton();

                runAutoMode();

            } catch (err) {
                console.error(err);
                alert('Ошибка: ' + err.message);
                autoBtn.textContent = '▶ Авто';
                autoBtn.disabled = false;
            }
        };

        const sep2 = document.createElement('div');
        sep2.style.cssText = `width:1px;height:20px;background:rgba(0,0,0,0.1);`;

        const togglesWrapper = document.createElement('div');
        togglesWrapper.style.cssText = `display:flex;gap:10px;align-items:center;`;

        const toggle1 = createToggle('ye-toggle-wrong', 'Неверные', settings.showWrong, (state) => {
            const s = getSettings();
            s.showWrong = state;
            saveSettings(s);
            forceRenderAnswersPanel();
        });

        togglesWrapper.appendChild(toggle1);

        const sep3 = document.createElement('div');
        sep3.style.cssText = `width:1px;height:20px;background:rgba(0,0,0,0.1);`;

        const input = document.createElement('input');
        input.id = 'ye-input';
        input.placeholder = "Ответ";
        input.style.cssText = `flex:1;padding:8px 10px;border-radius:6px;border:1px solid rgba(0,0,0,0.15);background:#fff;font-size:14px;outline:none;max-width:100px;min-width:60px;`;

        const sendBtn = document.createElement('button');
        sendBtn.id = 'ye-send-btn';
        sendBtn.innerHTML = "→";
        sendBtn.style.cssText = `padding:8px 12px;background:#4caf50;color:#fff;border:none;border-radius:6px;font-size:16px;font-weight:bold;cursor:pointer;`;

        input.onkeydown = (e) => { if (e.key === "Enter") sendBtn.click(); };

        sendBtn.onclick = async () => {
            const userAnswer = input.value.trim();
            if (!userAnswer) return alert("Введи ответ!");

            sendBtn.innerHTML = "···";
            sendBtn.style.background = "#999";
            sendBtn.disabled = true;

            try {
                const result = await checkAnswer(userAnswer);

                saveAnswerToLog(result.taskNum, userAnswer, result.isCorrect, result.correctAnswer);

                sendBtn.innerHTML = result.isCorrect ? "✓" : "✗";
                sendBtn.style.background = result.isCorrect ? "#4caf50" : "#e53935";

                if (!result.isCorrect && settings.autoFill) {
                    autoFillPageInput(result.correctAnswer);
                }

                forceRenderAnswersPanel();

                input.value = "";
                setTimeout(() => {
                    sendBtn.innerHTML = "→";
                    sendBtn.style.background = "#4caf50";
                    sendBtn.disabled = false;
                    input.focus();
                }, 300);

            } catch (err) {
                console.error(err);
                alert(err.message);
                sendBtn.innerHTML = "→";
                sendBtn.style.background = "#4caf50";
                sendBtn.disabled = false;
            }
        };

        panel.appendChild(numLabel);
        panel.appendChild(sep1);
        panel.appendChild(showAllBtn);
        panel.appendChild(copyBtn);
        panel.appendChild(autoBtn);
        panel.appendChild(sep2);
        panel.appendChild(togglesWrapper);
        panel.appendChild(sep3);
        panel.appendChild(input);
        panel.appendChild(sendBtn);
        container.appendChild(panel);

        if (placement.insertBefore) {
            placement.parent.insertBefore(container, placement.insertBefore);
        } else if (placement.insertAfter) {
            placement.insertAfter.after(container);
        } else {
            placement.parent.appendChild(container);
        }

        lastRenderedHash = '';
        renderAnswersPanel();

        if (!isAutoMode()) {
            input.focus();
        }
    }

    function updateTaskNum() {
        const numLabel = document.getElementById('ye-task-num');
        if (!numLabel) return;
        const num = getCollectionTaskNumber() || '?';
        if (numLabel.textContent !== `№${num}`) numLabel.textContent = `№${num}`;
    }

    function init() {
        if (!isValidPage()) return;

        if (isAutoMode()) {
            setTimeout(runAutoMode, 1000);
        }

        setInterval(() => {
            checkUrlChange();
            createControlPanel();
            updateTaskNum();
            renderAnswersPanel();
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();