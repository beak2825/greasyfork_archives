// ==UserScript==
// @name         优学院知识图谱
// @namespace    https://greasyfork.org/zh-CN/users/953334
// @version      0.0.1
// @description  自动完成优学院知识图谱 
// @author       itsdapi
// @match        https://kg.ulearning.cn/pc.html#/stuLearn/*
// @icon         https://www.ulearning.cn/ulearning/favicon.ico
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551842/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/551842/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const SPEED = 1
    // Intercept site requests to capture quiz list instead of sending our own
    const QUIZ_LIST_PATH = '/questionRelation/quizList';
    const quizListWaiters = new Map(); // key: knowledgeId -> Array<resolve>
    const latestQuizListWaiters = []; // Array<resolve> waiting for the latest quiz list regardless of knowledgeId

    function resolveWaiters(knowledgeId, data) {
        if (!knowledgeId) return;
        const key = String(knowledgeId);
        const waiters = quizListWaiters.get(key);
        if (!waiters || waiters.length === 0) return;
        quizListWaiters.delete(key);
        for (const resolve of waiters) {
            try { resolve(data); } catch (_) { /* noop */ }
        }
    }

    function resolveLatestWaiters(data) {
        if (!latestQuizListWaiters.length) return;
        const waiters = latestQuizListWaiters.splice(0, latestQuizListWaiters.length);
        for (const resolve of waiters) {
            try { resolve(data); } catch (_) { /* noop */ }
        }
    }

    function extractKnowledgeIdFromUrl(url) {
        try {
            const u = new URL(url, window.location.origin);
            return u.searchParams.get('knowledgeId');
        } catch (_) {
            return null;
        }
    }

    function notifyQuizListIfMatch(url, payload) {
        if (!url) return;
        // Accept any request hitting the quiz list path
        if (String(url).includes(QUIZ_LIST_PATH)) {
            const kid = extractKnowledgeIdFromUrl(url) || (payload && payload.knowledgeId) || null;
            const result = payload && (payload.result || payload.data || payload);
            resolveWaiters(kid, result);
            resolveLatestWaiters(result);
        }
    }

    // Patch fetch
    (function patchFetch() {
        if (!window.fetch) return;
        const originalFetch = window.fetch;
        window.fetch = function patchedFetch(input, init) {
            const url = (typeof input === 'string') ? input : (input && input.url);
            return originalFetch.apply(this, arguments).then((response) => {
                try {
                    const clone = response.clone();
                    clone.json().then((data) => {
                        try { notifyQuizListIfMatch(url, data); } catch (_) { /* noop */ }
                    }).catch(() => { /* not json, ignore */ });
                } catch (_) {
                    // Ignore clone/json issues
                }
                return response;
            });
        };
    })();

    main()

    async function main() {
        try {
            while (true) {
                await runKnowledgeQuiz()
                await sleep(3000)
                const nextBtn = findNextKnowledgeButton()
                if (!nextBtn) break
                nextBtn.click()
            }
        } catch (error) {
            console.log(error)
        }

    }

    // Patch XMLHttpRequest
    (function patchXHR() {
        if (!window.XMLHttpRequest) return;
        const openOrig = XMLHttpRequest.prototype.open;
        const sendOrig = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url) {
            try { this.__tm_url = url; } catch (_) { /* noop */ }
            return openOrig.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (body) {
            try {
                this.addEventListener('load', () => {
                    try {
                        if (this.status >= 200 && this.status < 400) {
                            const url = this.__tm_url;
                            // Only attempt JSON parse if it looks like the endpoint
                            if (String(url || '').includes(QUIZ_LIST_PATH)) {
                                try {
                                    const data = JSON.parse(this.responseText);
                                    notifyQuizListIfMatch(url, data);
                                } catch (_) { /* ignore parse errors */ }
                            }
                        }
                    } catch (_) { /* noop */ }
                });
            } catch (_) { /* noop */ }
            return sendOrig.apply(this, arguments);
        };
    })();

    function waitLatestQuizListFromPage(timeoutMs = 45000) {
        return new Promise((resolve, reject) => {
            // push a wrapped resolver so we can clear the timer on resolve
            let wrappedResolve = null;
            const timer = setTimeout(() => {
                const idx = latestQuizListWaiters.indexOf(wrappedResolve);
                if (idx >= 0) latestQuizListWaiters.splice(idx, 1);
                reject(new Error('Timed out waiting for latest quiz list request.'));
            }, timeoutMs);
            wrappedResolve = (value) => {
                clearTimeout(timer);
                resolve(value);
            };
            latestQuizListWaiters.push(wrappedResolve);
        });
    }
 
 
    async function runKnowledgeQuiz() {
        await waitLoad()

        await sleep(1000)
        const quizButton = await waitForElement('button.ul-button.go-quiz', {
            timeout: 20000,
            predicate: (el) => (el.textContent || '').includes('去测验')
        })
        await sleep(1000)
        quizButton.click()

        const quizList = await getLatestQuizList();

        for (const quiz of (quizList && quizList.list) || []) {
            const questionUl = await waitForElement('.question-ul', {
                timeout: 20000
            });
            await sleep(1000)
            const currentLi = questionUl.querySelector('li.question-item:last-child');
            await sleep(1000)
            const tfngArea = currentLi.querySelector('.answer-area');
            const choiceList = currentLi.querySelector('.choice-list');
            if (tfngArea) {
                await handleTFNG(quiz, tfngArea);
            } else if (choiceList) {
                await handleSingleChoice(quiz, choiceList);
            } else if (currentLi.querySelectorAll('input.blank-item-input').length > 0) {
                await handleFillInTheBlank(quiz, currentLi);
            } else {
                
            }
            await sleep(1000)
            const submitButton = currentLi.querySelector('.submit-button')
            if (!submitButton || !((submitButton.textContent || '').includes('提交'))) {
                
            } else {
                await sleep(1000)
                submitButton.click()
            }
        }
    }
 
    function waitLoad() {
        return new Promise((res) => {
            setTimeout(res, 500)
        })
    }

    async function handleTFNG(quiz, answerAreaElement) {
        await sleep(1000)
        const answer = getAnswer(quiz);
        if (!answerAreaElement) return;
        // Normalize answer to string 'true' | 'false'
        const answerValue = String(answer).toLowerCase() === 'true' ? 'true' : 'false';
        // Prefer clicking the label that contains the matching input to ensure UI frameworks react
        const input = answerAreaElement.querySelector(`input.ul-radio__original[value="${answerValue}"]`);
        if (!input) return;
        const label = input.closest('label');
        if (label) {
            label.click();
        } else {
            // Fallback: click the input and dispatch common events
            input.click();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    async function handleSingleChoice(quiz, choiceListElement) {
        await sleep(300)
        const answer = getAnswer(quiz);
        if (!choiceListElement) return;
        // Answers typically A/B/C/D; normalize
        const value = String(answer).trim().toUpperCase();
        const input = choiceListElement.querySelector(`input.ul-radio__original[value="${value}"]`);
        if (!input) return;
        const label = input.closest('label');
        if (label) {
            label.click();
        } else {
            input.click();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    async function handleFillInTheBlank(quiz, fillInTheBlankElement) {
        await sleep(300)
        if (!fillInTheBlankElement) return;

        const inputs = Array.from(fillInTheBlankElement.querySelectorAll('input.blank-item-input'));
        if (inputs.length === 0) return;

        const rawAnswer = getAnswer(quiz);

        function normalizeAnswers(value) {
            if (Array.isArray(value)) return value.map(v => String(v).trim());
            if (value == null) return [];
            const str = String(value).trim();
            // JSON array string
            if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('"') && str.endsWith('"'))) {
                try {
                    const parsed = JSON.parse(str);
                    if (Array.isArray(parsed)) return parsed.map(v => String(v).trim());
                    return [String(parsed).trim()];
                } catch (_) { /* fallthrough */ }
            }
            // Common separators: |, ||, comma variants, semicolons, '、'
            const parts = str.split(/\|\||\||,|，|;|；|、/).map(s => s.trim()).filter(Boolean);
            if (parts.length > 0) return parts;
            return [str];
        }

        const answers = normalizeAnswers(rawAnswer);

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const value = answers[i] != null ? answers[i] : (answers.length === 1 ? answers[0] : '');
            if (value == null) continue;
            input.focus();
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.blur();
            await sleep(100);
        }
    }

    function getAnswer(quiz) {
        return quiz.correctAnswer;
    }

    async function getLatestQuizList() {
        // Wait for the page's next/most recent quiz list request and reuse its response
        const result = await waitLatestQuizListFromPage(45000);
        return result;
    }

	async function sleep(ms) {
		const scaled = Math.max(0, Math.round(ms / SPEED));
		return new Promise(resolve => setTimeout(resolve, scaled));
	}
 
    function waitForElement(selector, options = {}) {
        const { timeout = 15000, predicate } = options
        return new Promise((resolve, reject) => {
            const tryFind = () => {
                const candidates = Array.from(document.querySelectorAll(selector))
                const match = predicate ? candidates.find(predicate) : candidates[0]
                if (match) {
                    cleanup()
                    resolve(match)
                }
            }
            const observer = new MutationObserver(() => tryFind())
            const observeTarget = document.documentElement || document
            observer.observe(observeTarget, { childList: true, subtree: true })
            const timeoutId = setTimeout(() => {
                cleanup()
                reject(new Error('waitForElement timeout'))
            }, timeout)
            function cleanup() {
                clearTimeout(timeoutId)
                observer.disconnect()
            }
            tryFind()
        })
    }

    function findNextKnowledgeButton() {
        const buttons = Array.from(document.querySelectorAll('button.ul-button'))
        return buttons.find(btn => (btn.textContent || '').includes('下一个知识点')) || null
    }
})();