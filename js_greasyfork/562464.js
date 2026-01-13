// ==UserScript==
// @name         ECTScript
// @namespace    https://github.com/OnlyMaxi/ECTScript
// @version      1
// @description  for free ECTS click here!
// @match        https://tuwel.tuwien.ac.at/course/view.php?id=*
// @match        https://tuwel.tuwien.ac.at/mod/scorm/view.php?id=*
// @match        https://tuwel.tuwien.ac.at/mod/scorm/player.php
// @run-at       document-idle
// @license      https://raw.githubusercontent.com/ErikMcClure/bad-licenses/refs/heads/master/fuck-your-license
// @downloadURL https://update.greasyfork.org/scripts/562464/ECTScript.user.js
// @updateURL https://update.greasyfork.org/scripts/562464/ECTScript.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const rawState = sessionStorage.getItem('ECTScript-state');
    const state = rawState
        ? JSON.parse(rawState)
        : {
              mode: 'traverse', // 'traverse', 'api'
              allModules: true,
              running: false,
          };
    function saveState() {
        sessionStorage.setItem('ECTScript-state', JSON.stringify(state));
        document.dispatchEvent(new CustomEvent('ECTScript-state-update'));
    }

    async function delay(ms) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function tick() {
        await delay(0);
    }

    function scrollDown(element) {
        element.scrollTop = element.scrollHeight;
    }

    function reload() {
        window.location.reload();
    }

    function init() {
        if (window.location.origin !== 'https://tuwel.tuwien.ac.at') return;

        function hasCourseTitle() {
            const titles = document.querySelectorAll('h1');
            for (const title of titles) {
                if (!title.innerText) continue;
                if (title.innerText.includes('Diversity Skills')) return true;
            }
            return false;
        }

        function hasCourseBreadcrumb() {
            const breadcrumbs = document.querySelectorAll(
                '.breadcrumb-item > a',
            );
            for (const breadcrumb of breadcrumbs) {
                if (!breadcrumb.title) continue;
                if (breadcrumb.title.includes('Diversity Skills')) return true;
            }
            return false;
        }

        const path = window.location.pathname;

        if (path === '/course/view.php' && hasCourseTitle()) {
            initCoursePage();
        } else if (path === '/mod/scorm/view.php' && hasCourseBreadcrumb()) {
            initStartModulePage();
        } else if (path === '/mod/scorm/player.php' && hasCourseBreadcrumb()) {
            initPlayerPage();
        }
    }

    function initCoursePage() {
        attachStylesheet();

        const controlsElement = createControlsElement({
            note: 'Complete all modules automatically.',
            startAction: () => {
                state.allModules = true;
                state.running = true;
                saveState();
                logInfo('Script started for all modules.');
                openNextModule(true);
            },
        });
        controlsElement.classList.add('section-item');
        controlsElement.style.marginBottom = '1rem';
        document.querySelector('#section-0').prepend(controlsElement);

        if (state.running && state.allModules) {
            openNextModule();
        }
    }

    function openNextModule(logCompleted = false) {
        const activities = document.querySelectorAll(
            '.activity-item[data-activityname^="Start Modul"]', // de/en: Start Modul(e)..
        );

        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];

            const title = activity.querySelector(
                '.activityname .instancename',
            ).innerText;
            const moduleName = title.split('"')[1];

            if (activity.querySelector('.btn-subtle-success')) {
                if (logCompleted) {
                    logInfo(`Module already completed: ${moduleName}`);
                }
            } else {
                logInfo(`Module started: ${moduleName}`);
                activity.querySelector('.activityname a').click();
                return;
            }
        }

        state.running = false;
        saveState();
        logSuccess('All modules completed!');
    }

    function initStartModulePage() {
        attachStylesheet();

        const moduleName = document.querySelector('h1').innerText.split('"')[1];

        const controlsElement = createControlsElement({
            note: `Complete this module automatically: ${moduleName}`,
            startAction: () => {
                state.allModules = false;
                state.running = true;
                saveState();
                logInfo(`Script started for single module: ${moduleName}`);
                startModule();
            },
        });
        controlsElement.classList.add('activity-header');
        controlsElement.style.padding = '1em';
        document.querySelector('#region-main').prepend(controlsElement);

        if (state.running && state.allModules) {
            startModule();
        }
    }

    function startModule() {
        const startButton = document.querySelector('#n');
        startButton.click();
    }

    function initPlayerPage() {
        attachStylesheet();

        const moduleName = document.querySelector('h1').innerText.split('"')[1];

        const controlsElement = createControlsElement({
            note: `Complete this module automatically: ${moduleName}`,
            startAction: () => {
                state.allModules = false;
                state.running = true;
                saveState();
                logInfo(`Script started for single module: ${moduleName}`);
                runPlayer(moduleName);
            },
        });
        controlsElement.classList.add('activity-header');
        controlsElement.style.padding = '1em';
        document.querySelector('#region-main').prepend(controlsElement);

        if (state.running) {
            runPlayer(moduleName);
        }
    }

    function createControlsElement(options) {
        const controlsElement = document.createElement('div');
        controlsElement.id = 'ECTSettings';
        controlsElement.innerHTML = `
            <h4 id="ECTScript-heading" class="mb-3">ECTScript controls</h4>
            <p id="ECTScript-note" class="form-text"></p>

            <select id="ECTScript-mode" class="form-select mb-3">
                <option value="traverse">Traverse everything (slow, safe)</option>
                <option value="api">Spoof API calls (faster, unsafe)</option>
            </select>

            <a id="ECTScript-action" class="btn btn-primary mb-3"></a>

            <details open id="ECTScript-messages-wrapper">
                <summary>Messages <a id="ECTScript-messages-clear">(Clear)</a></summary>
                <ul id="ECTScript-messages"></ul>
            </details>
        `;

        const note = controlsElement.querySelector('#ECTScript-note');
        note.innerText = options.note;

        controlsElement
            .querySelector('#ECTScript-messages-clear')
            .addEventListener('click', (e) => {
                e.preventDefault();
                clearLog(controlsElement);
            });
        loadLog(controlsElement);

        const modeSelect = controlsElement.querySelector('#ECTScript-mode');
        modeSelect.value = state.mode;
        modeSelect.addEventListener('change', () => {
            state.mode = modeSelect.value;
            saveState();
        });

        const actionButton = controlsElement.querySelector('#ECTScript-action');
        let action;

        function onStateUpdate() {
            modeSelect.disabled = state.running;

            if (!state.running) {
                actionButton.innerText = `Start the ECTScript`;
                actionButton.classList.add('btn-primary');
                actionButton.classList.remove('btn-danger');
                action = options.startAction;
            } else {
                actionButton.innerText = `Stop the ECTScript`;
                actionButton.classList.remove('btn-primary');
                actionButton.classList.add('btn-danger');
                action = () => {
                    state.running = false;
                    saveState();
                    logInfo('Script stopped.');
                    reload();
                };
            }
        }
        document.addEventListener('ECTScript-state-update', () => {
            onStateUpdate();
        });
        onStateUpdate();

        actionButton.addEventListener('click', () => {
            action();
        });

        return controlsElement;
    }

    function attachStylesheet() {
        const style = document.createElement('style');
        style.textContent = `
            #ECTScript-messages-clear {
                color: #006699;
            }

            #ECTScript-messages-clear:hover {
                text-decoration: underline;
                cursor: pointer;
            }

            #ECTScript-messages-wrapper {
                interpolate-size: allow-keywords;
                transition: height 500ms ease;
            }

            #ECTScript-messages-wrapper::details-content {
                transition: height 0.5s ease, content-visibility 0.5s ease allow-discrete;
                height: 0;
                overflow: clip;

                padding-left: .9em;
            }

            #ECTScript-messages-wrapper[open]::details-content {
                height: auto;
            }

            #ECTScript-messages {
                list-style-type: none;
                padding: 0;
                max-height: 10em;
                overflow: auto;
            }

            .ECTScript-message {
                padding-left: .5em;
                font-size: .75em;
                word-break: break-word;
                border-width: 1px;
                border-left-style: solid;
                border-right-style: solid;
            }
            .ECTScript-message:first-child {
                border-top-style: solid;
            }
            .ECTScript-message:last-child {
                border-bottom-style: solid;
            }

            .ECTScript-message-type-info {
                background: var(--bs-info-bg-subtle);
                color: var(--bs-info-text-emphasis);
                border-color: var(--bs-info-border-subtle);
            }

            .ECTScript-message-type-warning {
                background: var(--bs-warning-bg-subtle);
                color: var(--bs-warning-text-emphasis);
                border-color: var(--bs-warning-border-subtle);
            }

            .ECTScript-message-type-error {
                background: var(--bs-danger-bg-subtle);
                color: var(--bs-danger-text-emphasis);
                border-color: var(--bs-danger-border-subtle);
            }

            .ECTScript-message-type-success {
                background: var(--bs-success-bg-subtle);
                color: var(--bs-success-text-emphasis);
                border-color: var(--bs-success-border-subtle);
            }

            .ECTScript-message-time {
                display: inline-block;
                color: grey;
                margin-right: .5em;
            }
        `;
        document.head.appendChild(style);
    }

    function showMessage(message, controlsElement = document) {
        const messageList = controlsElement.querySelector(
            '#ECTScript-messages',
        );
        if (!messageList) return;
        const messageElement = document.createElement('li');
        messageElement.classList.add('ECTScript-message');
        messageElement.classList.add('ECTScript-message-type-' + message.type);
        const timeElement = document.createElement('span');
        timeElement.classList.add('ECTScript-message-time');
        timeElement.innerText = message.date.toLocaleString();
        messageElement.appendChild(timeElement);
        const textElement = document.createElement('span');
        textElement.innerText = message.text;
        messageElement.appendChild(textElement);
        const isScrolled =
            messageList.scrollTop + messageList.clientHeight >=
            messageList.scrollHeight - 5;
        messageList.appendChild(messageElement);
        if (isScrolled) {
            requestAnimationFrame(() => scrollDown(messageList));
        }
    }

    function getMessages() {
        let messages;
        try {
            messages = JSON.parse(sessionStorage.getItem('ECTScript-messages'));
            for (const message of messages) {
                message.date = new Date(message.date);
            }
        } catch (e) {}
        if (!Array.isArray(messages)) {
            messages = [];
        }
        return messages;
    }

    function loadLog(controlsElement) {
        for (const message of getMessages()) {
            showMessage(message, controlsElement);
        }
    }

    function writeLog(message) {
        message.date ??= new Date();

        const messages = getMessages();
        messages.push(message);
        sessionStorage.setItem('ECTScript-messages', JSON.stringify(messages));

        showMessage(message);
    }

    function logInfo(text) {
        console.log('ECTScript:', text);
        writeLog({ type: 'info', text: `${text}` });
    }

    function logWarning(text) {
        console.warn('ECTScript:', text);
        writeLog({ type: 'warning', text: `${text}` });
    }

    function logError(text) {
        console.error('ECTScript:', text);
        writeLog({ type: 'error', text: `${text}` });
    }

    function logSuccess(text) {
        console.log('%cECTScript:', 'color: #bada55', text);
        writeLog({ type: 'success', text: `${text}` });
    }

    function clearLog(controlsElement = document) {
        sessionStorage.removeItem('ECTScript-messages');
        controlsElement.querySelector('#ECTScript-messages').innerHTML = '';
    }

    async function waitForSelector(parent, selector, timeout = 5000) {
        const start = Date.now();
        let element;
        while (true) {
            if (typeof selector === 'function') {
                element = selector(parent);
            } else {
                element = parent.querySelector(selector);
            }
            if (element) {
                break;
            }

            await delay(100);
            if (Date.now() - start > timeout) {
                throw new Error(
                    'Timeout waiting for element with selector: ' + selector,
                );
            }
        }
        return element;
    }

    async function runPlayer(moduleName) {
        try {
            if (state.mode === 'traverse') {
                await traversePlayer(moduleName);
            } else if (state.mode === 'api') {
                await spoofApiCall();
            }

            logSuccess(`Module completed: ${moduleName}`);
            if (!state.allModules) {
                state.running = false;
                saveState();
            } else {
                // close module
                document
                    .querySelector(
                        'div[role="main"] .btn[href^="https://tuwel.tuwien.ac.at/course/view.php"]',
                    )
                    .click();
            }
        } catch (e) {
            logError(e);
            state.running = false;
            saveState();
        }
    }

    async function spoofApiCall() {
        const scormObject = await waitForSelector(document, (parent) => {
            const so = parent.querySelector('#scorm_object');
            if (!so) return null;
            return so.contentDocument.querySelector('#content-frame')
                ? so
                : null;
        });
        const scormParams = new URL(scormObject.src).searchParams;

        await fetch('https://tuwel.tuwien.ac.at/mod/scorm/datamodel.php', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id: M.cfg.contextInstanceId,
                sesskey: M.cfg.sesskey,
                attempt: scormParams.get('attempt'),
                a: scormParams.get('a'),
                scoid: scormParams.get('scoid'),
                cmi__core__score__raw: 100,
                cmi__core__lesson_status: 'passed',
            }),
            method: 'POST',
        });
    }

    async function traversePlayer(moduleName) {
        let page;

        async function clickContinueButton() {
            const continueBtn = page.querySelector('.continue-btn');
            if (!continueBtn) return false;
            continueBtn.click();
            return true;
        }

        async function clickNextLink() {
            const nextLink = pageWrap.querySelector(
                '.next-lesson__link, [data-link="lesson-link-item"][data-direction="next"]',
            );
            if (!nextLink) return false;
            nextLink.click();
            return true;
        }

        async function solveFlashCards() {
            const block = page.querySelector(
                '.block-flashcards:not(.ECTScript--done)',
            );
            if (!block) return false; // all flashcards done
            while (true) {
                const flashcard = block.querySelector(
                    '.flashcard:not(.flashcard--flipped), .block-flashcard:not(.block-flashcard--flipped) .block-flashcard__flip',
                );
                if (!flashcard) break;

                flashcard.click();
                const nextArrow = block.querySelector(
                    '.block-flashcards-slider__arrow--next',
                );
                if (nextArrow) nextArrow.click(); // sometimes all flashcards are displayed instantly
                scrollDown(page.parentElement);
                await tick();
            }
            block.classList.add('ECTScript--done');
            return true;
        }

        async function solveProcessBlocks() {
            const unenteredCardSelector =
                '.process-card:not(.process-card--entered), .process-card--next';
            const processBlock = page.querySelector(
                `.block-process:has(${unenteredCardSelector})`,
            );
            if (!processBlock) return false;

            while (processBlock.querySelector(unenteredCardSelector)) {
                const nextBtn = await waitForSelector(
                    processBlock,
                    '.process-arrow--right',
                );
                nextBtn.click();
                await delay(100);
            }
            return true;
        }

        async function solveLabeledGraphicCanvas() {
            const next = page.querySelector(
                '.labeled-graphic-canvas:not(.ECTScript--done)',
            );
            if (!next) return false; // all done
            while (true) {
                const marker = page.querySelector(
                    '.labeled-graphic-marker:not(.labeled-graphic-marker--complete)',
                );
                if (!marker) break;
                marker.click();
                await tick();

                const activeBubbleClose = app.querySelector(
                    '#portal .bubble--active .bubble__close',
                );
                if (activeBubbleClose) activeBubbleClose.click();
                await tick();
            }
            next.classList.add('ECTScript--done');
            return true;
        }

        // wait until loaded
        const app = await waitForSelector(document, (parent) => {
            const so = parent.querySelector('#scorm_object');
            if (!so) return null;
            const cf = so.contentDocument.querySelector('#content-frame');
            if (!cf) return null;
            return cf.contentDocument.querySelector('#app');
        });

        // start from the first lesson
        const firstLessonLink = await waitForSelector(
            app,
            '.lesson-link' +
                ',.overview-list-item__link' +
                ',[data-link="lesson-link-item"]',
        );
        firstLessonLink.click();

        // complete module
        const maxRetries = 10;
        const retryTimeout = 100;

        let pageWrap = await waitForSelector(app, '#page-wrap');

        action: while (true) {
            for (let retries = 0; retries < maxRetries; retries++) {
                page = await waitForSelector(pageWrap, 'main:first-of-type');
                scrollDown(pageWrap);
                await tick();

                // iterate through each action, if it isn't possible, another action is needed
                if (await solveFlashCards()) continue action;
                if (await solveProcessBlocks()) continue action;
                if (await solveLabeledGraphicCanvas()) continue action;
                if (await solveKnowledgeBlocks(page)) continue action;
                if (await solveQuizzes(page)) continue action;
                if (await clickContinueButton()) continue action;
                if (await clickNextLink()) continue action;

                if (isLastPage(app, page)) break action;

                await delay(retryTimeout);
            }

            throw new Error(
                'Nothing to do, but module does not seem completed!',
            );
        }

        // works without it, but just to be sure, the request goes through
        await delay(500);
    }

    function isLastPage(app, page) {
        const lessonCount = page.querySelector('.lesson-header__count');
        if (lessonCount) {
            const nums = lessonCount.innerText.match(/[0-9]+/g);
            return nums[0] && nums[0] === nums[1];
        }

        var sidebarItems = app.querySelectorAll(
            '.nav-sidebar__outline-list .nav-sidebar__outline-section-item__link',
        );
        const last = sidebarItems[sidebarItems.length - 1];
        if (last) {
            return last.classList.contains(
                'nav-sidebar__outline-section-item__link--active',
            );
        }

        throw new Error('Last page detection failed');
    }

    function fillReactInput(input, value) {
        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
        ).set.call(input, value);
        for (const event of ['input', 'change']) {
            input.dispatchEvent(new Event(event, { bubbles: true }));
        }
    }

    async function collectQuizCardSolution(quizCard) {
        let solution = null;

        if (quizCard.querySelector('.quiz-multiple-response-option-wrap')) {
            const checkboxes = quizCard.querySelectorAll(
                '.quiz-multiple-response-option',
            );
            for (const checkbox of checkboxes) {
                checkbox.click();
            }
            await tick();

            quizCard.querySelector('.quiz-card__submit > button').click();
            await tick();

            solution = [];
            for (const answer of checkboxes) {
                solution.push(
                    answer.classList.contains(
                        'quiz-multiple-response-option--correct',
                    ),
                );
            }
            if (solution.every((s) => !s)) {
                throw new Error(
                    'Failed to collect quiz solution, no correct answer was collected',
                );
            }
        } else if (quizCard.querySelector('.quiz-match')) {
            const draggablesLen = quizCard.querySelectorAll(
                '.quiz-match__item--draggable .quiz-match__item-wrapper',
            ).length;
            for (let i = 0; i < draggablesLen; i++) {
                const draggables = quizCard.querySelectorAll(
                    '.quiz-match__item--draggable .quiz-match__item-wrapper',
                );
                draggables[i].focus();
                draggables[i].dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        which: 32,
                        bubbles: true,
                    }),
                );

                const droppables = quizCard.querySelectorAll(
                    '.quiz-match__item.droppable',
                );
                droppables[i].focus();
                droppables[i].dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        which: 32,
                        bubbles: true,
                    }),
                );
            }
            await tick();

            quizCard.querySelector('.quiz-card__submit > button').click();
            await tick();

            solution = [];
            const answers = quizCard.querySelectorAll(
                '.quiz-match__item-feedback',
            );
            const draggables = quizCard.querySelectorAll(
                '.quiz-match__item--draggable .quiz-match__item-wrapper',
            );
            const droppables = quizCard.querySelectorAll(
                '.quiz-match__item.droppable',
            );
            for (let i = 0; i < answers.length; i++) {
                const bubble = answers[i].querySelector(
                    '.quiz-match__item-feedback-bubble',
                );
                const targetIndex = bubble ? parseInt(bubble.innerText) - 1 : i;
                solution.push({
                    origin: draggables[i].querySelector(
                        '[data-match-content="true"]',
                    ).innerText,
                    target: droppables[targetIndex].querySelector(
                        '[data-match-content="true"]',
                    ).innerText,
                });
            }
        } else if (
            quizCard.querySelector('.quiz-multiple-choice-option-wrap')
        ) {
            const options = quizCard.querySelectorAll(
                '.quiz-multiple-choice-option',
            );

            options[0].click();
            await tick();

            quizCard.querySelector('.quiz-card__submit > button').click();
            await tick();

            solution = [];
            for (let i = 0; i < options.length; i++) {
                const inc = options[i].classList.contains(
                    'quiz-multiple-choice-option--incorrect',
                );
                solution.push(!inc);
            }
        } else if (quizCard.querySelector('.quiz-fill')) {
            const input = quizCard.querySelector(
                '.quiz-fill__container > input',
            );
            fillReactInput(input, '-');
            await tick();

            quizCard.querySelector('.quiz-card__submit > button').click();
            await tick();

            const optionsFeedback = quizCard.querySelector(
                '.quiz-fill__options',
            ).innerText;
            solution = optionsFeedback.replace(/.*: /, '').split(', ')[0];
        }

        return solution;
    }

    async function applyQuizCardSolution(quizCard, solution) {
        if (quizCard.querySelector('.quiz-multiple-response-option-wrap')) {
            const checkboxes = quizCard.querySelectorAll(
                '.quiz-multiple-response-option',
            );
            for (let i = 0; i < checkboxes.length; i++) {
                if (solution[i]) {
                    checkboxes[i].click();
                }
            }

            await tick();
            quizCard.querySelector('.quiz-card__submit > button').click();

            return true;
        } else if (quizCard.querySelector('.quiz-match')) {
            while (solution.length > 0) {
                const match = solution.shift();

                const draggables = quizCard.querySelectorAll(
                    '.quiz-match__item--draggable .quiz-match__item-wrapper',
                );
                const draggable = Array.from(draggables).find(
                    (d) =>
                        d.querySelector('[data-match-content="true"]')
                            .innerText === match.origin,
                );
                draggable.focus();
                draggable.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        which: 32,
                        bubbles: true,
                    }),
                );

                const droppables = quizCard.querySelectorAll(
                    '.quiz-match__item.droppable',
                );
                const droppable = Array.from(droppables).find(
                    (d) =>
                        d.querySelector('[data-match-content="true"]')
                            .innerText === match.target,
                );
                droppable.focus();
                droppable.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        which: 32,
                        bubbles: true,
                    }),
                );
            }

            await tick();
            quizCard.querySelector('.quiz-card__submit > button').click();

            return true;
        } else if (
            quizCard.querySelector('.quiz-multiple-choice-option-wrap')
        ) {
            const options = quizCard.querySelectorAll(
                '.quiz-multiple-choice-option',
            );
            for (let i = 0; i < options.length; i++) {
                if (solution[i]) {
                    options[i].click();
                }
            }

            await tick();
            quizCard.querySelector('.quiz-card__submit > button').click();

            return true;
        } else if (quizCard.querySelector('.quiz-fill')) {
            const input = quizCard.querySelector(
                '.quiz-fill__container > input',
            );
            fillReactInput(input, solution);

            await tick();
            quizCard.querySelector('.quiz-card__submit > button').click();

            return true;
        }

        return false;
    }

    async function solveQuizzes(page) {
        const quizWrap = page.querySelector('.quiz__wrap');
        if (!quizWrap) return false;

        let lastActiveCard = null;

        let solutions = new Map();
        let restarts = 0;
        let solvedCards = 0;
        while (true) {
            await tick();

            const activeCard = quizWrap.querySelector(
                '.quiz-item__card--active',
            );
            if (!activeCard) break;
            if (activeCard === lastActiveCard) {
                await delay(100);
                continue;
            }
            lastActiveCard = activeCard;

            if (activeCard.querySelector('.quiz-header__container')) {
                activeCard.querySelector('.quiz-header__start-quiz').click();
            } else if (activeCard.querySelector('.quiz-results')) {
                function getScore() {
                    return quizWrap.querySelector(
                        '.odometer__score-percent--hidden',
                    );
                }
                let score;
                while (!(score = getScore())) {
                    await delay(100);
                }
                if (score.innerText == '100%') {
                    break;
                }

                if (restarts >= 2) {
                    throw new Error(
                        `Quiz not fully solved after two restarts.`,
                    );
                }

                // restart quiz
                restarts++;
                activeCard.querySelector('.restart-button').click();
            } else {
                const questionId = activeCard.querySelector(
                    '.quiz-card__counter',
                ).innerText;

                if (!solutions.has(questionId)) {
                    // collect solution
                    const solution = await collectQuizCardSolution(activeCard);
                    if (!solution) {
                        throw new Error('Failed to collect quiz card solution');
                    }
                    solutions.set(questionId, solution);

                    const nextBtn = await waitForSelector(
                        activeCard,
                        '.quiz-card__feedback-button > button, .quiz-card__button--next',
                    );
                    nextBtn.click();
                } else {
                    // apply solution
                    const didApply = await applyQuizCardSolution(
                        activeCard,
                        solutions.get(questionId),
                    );
                    if (!didApply) {
                        throw new Error('Failed to apply quiz card solution');
                    }

                    const nextBtn = await waitForSelector(
                        activeCard,
                        '.quiz-card__feedback-button > button, .quiz-card__button--next',
                    );
                    nextBtn.click();
                }
            }

            solvedCards++;
        }

        return solvedCards > 0;
    }

    async function solveKnowledgeBlocks(page) {
        const knowledgeBlock = page.querySelector(
            '.block-knowledge:not(:has(.quiz-card__feedback-icon--correct))',
        );
        if (!knowledgeBlock) return false;

        if (knowledgeBlock.querySelector('.quiz-card__feedback--active')) {
            knowledgeBlock.querySelector('.block-knowledge__retake').click();
            // somehow options get cleared a while after quiz is reset
            while (knowledgeBlock.querySelector('[aria-checked="true"]')) {
                await delay(100);
            }
        }

        const solution = await collectQuizCardSolution(knowledgeBlock);
        if (!solution) {
            throw new Error('Failed to collect quiz card solution');
        }
        knowledgeBlock.querySelector('.block-knowledge__retake').click();
        // somehow options get cleared a while after quiz is reset
        while (knowledgeBlock.querySelector('[aria-checked="true"]')) {
            await delay(100);
        }

        const didApply = await applyQuizCardSolution(knowledgeBlock, solution);
        if (!didApply) {
            throw new Error('Failed to apply quiz card solution');
        }
        await waitForSelector(
            knowledgeBlock,
            '.quiz-card__feedback-icon--correct',
        );

        return true;
    }

    init();
})();