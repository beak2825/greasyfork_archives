// ==UserScript==
// @name         Woots Helper
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Woots Helper. Ctrl+shift+A to autofill, Ctrl+shift+S to check answers
// @author       You
// @license      MIT
// @match        https://app.woots.nl/digital_test/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558111/Woots%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558111/Woots%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MODEL_NAME = "gemini-2.5-flash";

    // --- Prompts ---
    const SOLVER_SYSTEM_PROMPT = `
You are a German grammar expert completing a "Fill in the blank" exercise.
You will receive a context and a list of numbered sentences with missing words (marked as ...).
The root verb is usually provided in brackets, e.g., (laufen).

Task:
1. Identify the correct conjugation of the verb in brackets for the missing gap (Präteritum/Strong Verbs).
2. Return a JSON object where the KEY is the Row ID and the VALUE is the single word answer.

Example Input:
0 | Er (laufen) ... nach Hause.
1 | Wir (sehen) ... den Film.

Example Output JSON:
{"0": "lief", "1": "sahen"}
`;

    const CHECKER_SYSTEM_PROMPT = `
You are a German grammar teacher. You will receive a list of sentences with filled-in answers.
Check if the answers are linguistically correct in the context.

Output a JSON object where the KEY is the Row ID.
- If Correct: Value is "Correct"
- If Incorrect: Value is the CORRECT word to replace it with.
`;

    // --- Configuration ---
    function getApiKey() {
        let key = GM_getValue("GEMINI_API_KEY", "");
        if (!key) {
            key = prompt("Please enter your Google Gemini API Key:");
            if (key) GM_setValue("GEMINI_API_KEY", key);
        }
        return key;
    }

    GM_registerMenuCommand("Change API Key", () => {
        const key = prompt("Enter new Google Gemini API Key:", GM_getValue("GEMINI_API_KEY", ""));
        if (key !== null) GM_setValue("GEMINI_API_KEY", key);
    });

    // --- Helpers ---
    function getGlobalContext() {
        const headerArticle = document.querySelector('.quiz-subquestion .d-flex article.redactor-content');
        return headerArticle ? headerArticle.innerText.trim() : "";
    }

    function cleanQuestionText(text) {
        // Removes leading numbers "1. ", "10. " and excess whitespace
        return text.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim();
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // --- Stealth Typing ---
    async function simulateTyping(element, text) {
        console.log(`[Typing] "${text}"`);
        element.focus();
        if(element.innerText.trim() !== "") element.innerHTML = "";

        for (let char of text) {
            await delay(25 + Math.random() * 50); // Human-like jitter
            const eventOptions = {
                key: char,
                code: `Key${char.toUpperCase()}`,
                bubbles: true,
                cancelable: true
            };
            element.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
            element.dispatchEvent(new KeyboardEvent('keypress', eventOptions));
            document.execCommand('insertText', false, char);
            element.dispatchEvent(new InputEvent('input', { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
        }
        element.blur();
    }

    async function simulateBackspaceClear(element) {
        element.focus();
        const len = element.innerText.length + 2;
        for (let i = 0; i < len; i++) {
            await delay(20);
            element.dispatchEvent(new KeyboardEvent('keydown', { key: "Backspace", keyCode: 8, bubbles: true }));
            document.execCommand('delete', false, null);
            element.dispatchEvent(new InputEvent('input', { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keyup', { key: "Backspace", keyCode: 8, bubbles: true }));
        }
    }

    // --- API Call ---
    async function callGemini(systemInstruction, userContent) {
        const apiKey = getApiKey();
        if (!apiKey) return null;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

        const data = {
            "system_instruction": { "parts": [{ "text": systemInstruction }] },
            "contents": [{ "parts": [{ "text": userContent }] }],
            "generationConfig": { "response_mime_type": "application/json" } // Force JSON
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json.candidates && json.candidates.length > 0) {
                                resolve(JSON.parse(json.candidates[0].content.parts[0].text));
                            } else {
                                resolve(null);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        console.error("API Error", response.responseText);
                        reject(response.statusText);
                    }
                },
                onerror: function(err) { reject(err); }
            });
        });
    }

    // --- Core Logic ---

    // Scrapes the page and returns a list of rows { id, text, element }
    function getQuestionRows(onlyEmpty = true) {
        const rows = document.querySelectorAll('.response-fill article.redactor-content p');
        let batch = [];

        rows.forEach((p, index) => {
            const editorDiv = p.querySelector('div[contenteditable="true"]');
            if (!editorDiv) return;

            const currentText = editorDiv.innerText.trim();
            const isEmpty = currentText.length === 0;

            if (onlyEmpty && !isEmpty) return; // Skip filled if solving
            if (!onlyEmpty && isEmpty) return; // Skip empty if checking

            // Clone to prepare text for AI
            let clone = p.cloneNode(true);
            const cloneSpan = clone.querySelector('span.d-inline-block');

            // If solving, insert placeholder. If checking, insert current answer.
            if (cloneSpan) {
                cloneSpan.textContent = onlyEmpty ? " ... " : ` ${currentText} `;
            }

            const cleanText = cleanQuestionText(clone.innerText || clone.textContent);

            batch.push({
                id: index,
                text: cleanText,
                element: editorDiv
            });
        });
        return batch;
    }

    async function solveBatch() {
        console.log("--- Batch Solving ---");
        const context = getGlobalContext();
        const questions = getQuestionRows(true); // Get only empty rows

        if (questions.length === 0) {
            console.log("No empty questions found.");
            return;
        }

        // Prepare Prompt
        const questionsList = questions.map(q => `${q.id} | ${q.text}`).join('\n');
        const userPrompt = `Context: ${context}\n\nQuestions:\n${questionsList}`;

        try {
            const answers = await callGemini(SOLVER_SYSTEM_PROMPT, userPrompt);
            if (!answers) return;

            // Apply Answers
            for (const q of questions) {
                const answer = answers[q.id.toString()];
                if (answer) {
                    await simulateTyping(q.element, answer);
                    // Add delay between questions to look human
                    await delay(600 + Math.random() * 600);
                }
            }
        } catch (e) {
            console.error("Solver Error", e);
        }
        console.log("--- Done ---");
    }

    async function checkBatch() {
        console.log("--- Batch Checking ---");
        const context = getGlobalContext();
        const filledQuestions = getQuestionRows(false); // Get only filled rows

        if (filledQuestions.length === 0) {
            console.log("No filled questions to check.");
            return;
        }

        const questionsList = filledQuestions.map(q => `${q.id} | ${q.text}`).join('\n');
        const userPrompt = `Context: ${context}\n\nQuestions to Check:\n${questionsList}`;

        try {
            const results = await callGemini(CHECKER_SYSTEM_PROMPT, userPrompt);
            if (!results) return;

            for (const q of filledQuestions) {
                const result = results[q.id.toString()];
                // If the key exists and it's NOT "Correct", it's the correction
                if (result && result.toLowerCase() !== "correct") {
                    console.log(`Fixing Row ${q.id}: ${result}`);
                    await simulateBackspaceClear(q.element);
                    await delay(200);
                    await simulateTyping(q.element, result);
                    await delay(500);
                }
            }
        } catch (e) {
            console.error("Checker Error", e);
        }
        console.log("--- Done ---");
    }

    // --- Controls ---
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey) {
            if (e.key.toLowerCase() === 'a') {
                e.preventDefault();
                solveBatch();
            } else if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                checkBatch();
            }
        }
    });

})();