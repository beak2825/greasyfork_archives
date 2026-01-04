// ==UserScript==
// @name         CodeHS Auto-Complete
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Automatically does CodeHS videos, quizzes, and coding assignments
// @author       aprilfools
// @match        https://codehs.com/student/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      generativelanguage.googleapis.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551084/CodeHS%20Auto-Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/551084/CodeHS%20Auto-Complete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // config
    let GEMINI_API_KEY = GM_getValue('GEMINI_API_KEY', null);
    let isAutoModeEnabled = GM_getValue('isAutoModeEnabled', true); // default to true
    let goMultipleLessons = GM_getValue('goMultipleLessons', false); // default to false

    // UI Console Logger
    function logToUI(message) {
        // Also log to the browser console for debugging
        console.log(message);

        const consoleContainer = document.getElementById('console-log-container');
        if (consoleContainer) {
            const now = new Date();
            const timestamp = now.toTimeString().split(' ')[0];
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${timestamp}] ${message}`;
            logEntry.style.cssText = 'border-bottom: 1px solid #eee; padding: 2px 4px; font-size: 12px; font-family: monospace;';
            consoleContainer.insertBefore(logEntry, consoleContainer.firstChild); // Add new messages to the top
        }
    }


    // gets cookie by name, needed for CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // wait for ms
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // gemini api

    // get response from gemini
    async function callGemini(promptText) {
        if (!GEMINI_API_KEY) {
            const key = prompt("Please enter your Gemini API Key:");
            if (key) {
                GEMINI_API_KEY = key;
                GM_setValue('GEMINI_API_KEY', key);
            } else {
                throw new Error("API Key is required.");
            }
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                // pro might be needed for complex problems but 2.5 flash seems to be working fine + faster
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "contents": [{
                        "parts": [{
                            "text": promptText
                        }]
                    }]
                }),
                // give answer and handle errors
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.candidates && data.candidates.length > 0) {
                            const answer = data.candidates[0].content.parts[0].text.trim();
                            resolve(answer);
                        } else {
                            console.error("Gemini API Error:", data);
                            logToUI("API returned no candidates. Prompt might be blocked. Check browser console (F12).");
                            reject("API returned no candidates. The prompt might have been blocked. Check console.");
                        }
                    } catch (e) {
                        console.error("Failed to parse response:", response.responseText);
                        logToUI("API response parsing error. Check browser console (F12). API key may be invalid.");
                        reject("API response parsing error. Check console. Your API key may be invalid or have restrictions.");
                    }
                },
                onerror: function(error) {
                    console.error("Request failed:", error);
                    logToUI("API request failed. Check browser console (F12) for network errors.");
                    reject("API request failed. Check the console for network errors.");
                }
            });
        });
    }

    // module logic (videos, coding, quizzes)

    function completeVideo() {
        logToUI("Video assignment detected. Completing...");
        updateButtonState('Completing Video...');
        let studentAssignmentId = null;
        const currentPath = window.location.pathname;
        const moduleItems = document.querySelectorAll('a.module-item[data-said]');

        // get n assign student assignment id
        for (const item of moduleItems) {
            if (item.getAttribute('href') === currentPath) {
                studentAssignmentId = item.dataset.said;
                break;
            }
        }

        if (!studentAssignmentId) {
            alert("Error: Could not find the student assignment ID.");
            return;
        }

        const csrfToken = getCookie('csrftoken');
        // submit assignment via POST
        fetch("https://codehs.com/lms/ajax/submit_assignment", {
            "headers": { "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "x-csrftoken": csrfToken },
            "body": `student_assignment_id=${studentAssignmentId}&method=submit_assignment`,
            "method": "POST"
        }).then(response => response.json()).then(data => {
            logToUI("Submission response received.");
            logToUI("Video submitted! Going to next assignment.");
            // get next assignment url
            const currentUrl = window.location.href;
            const urlParts = currentUrl.split('/');
            const lastPart = urlParts[urlParts.length - 1];

            if (!isNaN(lastPart) && lastPart.trim() !== '') {
                const assignmentId = parseInt(lastPart, 10);
                const nextAssignmentId = assignmentId + 1;
                urlParts[urlParts.length - 1] = nextAssignmentId;
                const nextUrl = urlParts.join('/');
                logToUI(`Going to: ${nextUrl}`);
                window.location.href = nextUrl;
            } else {
                console.error("Could not get the next assignment ID from the URL. Reloading page as fallback.");
                logToUI("Error finding next assignment. Reloading...");
                location.reload();
            }
        }).catch(error => console.error("Submission failed:", error));
    }

    // quizes
    async function completeQuiz() {
        logToUI("Quiz detected. Completing...");
        const questions = document.querySelectorAll('.quiz-questions > li');
        let questionsAnswered = 0;

        // do questions
        for (const questionEl of questions) {
            // check if question already done
            if (questionEl.querySelector('.question-correctness-indicator.correct')) {
                logToUI("Skipping an already correct question.");
                continue;
            }

            const questionDescriptionEl = questionEl.querySelector('.quiz-question-description');
            if (!questionDescriptionEl) continue;

            // get answer choices
            const questionId = questionDescriptionEl.dataset.questionId;
            const questionText = questionDescriptionEl.dataset.markdown;
            const answers = Array.from(questionEl.querySelectorAll('.quiz-question-answers li')).map(answerEl => ({
                id: answerEl.querySelector('input').id,
                text: answerEl.querySelector('.question-answer-text').dataset.markdown
            }));

            // thx gemini for the prompt :heart:
            let promptForAI = `You are an expert assistant. Analyze the following multiple-choice question and provide only the HTML ID of the correct answer choice. Do not add any explanation or other text.\n\nQuestion:\n${questionText}\n\nAnswer Choices:\n${answers.map(a => `${a.id}: ${a.text}`).join('\n')}\n\nCorrect Answer ID:`;

            try {
                // query gemini y do question
                updateButtonState(`Asking Gemini... (${questionsAnswered + 1})`);
                const bestAnswerId = await callGemini(promptForAI);
                const answerRadio = document.getElementById(bestAnswerId);
                const checkButton = document.getElementById(`check-${questionId}-button`);

                if (answerRadio && checkButton) {
                    answerRadio.click();
                    await sleep(500);
                    checkButton.click();
                    questionsAnswered++;
                    logToUI(`Answered and checked question ${questionId}.`);
                    await sleep(2000);
                }
            } catch (error) {
                alert(`Request Error: ${error}`);
                break;
            }
        }

        if (questionsAnswered > 0) {
            logToUI("Quiz complete. Submitting...");
            // submit
            const completeButton = document.getElementById('next-button');
            if (completeButton) {
                completeButton.click();
            } else {
                console.error("Could not find the 'Complete Quiz' button (id: next-button). Reloading as a fallback.");
                logToUI("Error finding submit button. Reloading...");
                location.reload();
            }
        }
    }


    // coding modules
    async function completeCoding() {
        logToUI("Coding module detected. Completing...");
        updateButtonState('Solving Module...');

        try {
            // check assignment tab for instructions
            const instructionsElement = document.querySelector('.markdown-exercise-description');
            const instructions = instructionsElement ? instructionsElement.dataset.markdown : "No instructions found.";

            // check for multi-file assigments
            const fileListItems = document.querySelectorAll('div.Xe div.l ul li');
            logToUI(`Found ${fileListItems.length} file(s) in the list.`);

            if (fileListItems.length === 0) {
                alert("Could not find any files to process in the left-hand menu.");
                updateButtonState('Start', true);
                return;
            }

            for (const fileItem of fileListItems) {
                const clickableElement = fileItem.querySelector('span[style*="height: 30px"]');
                if (!clickableElement) {
                    logToUI("Could not find clickable element for a file item, skipping.");
                    continue;
                }

                const fileNameSpan = clickableElement.querySelector('.sc-gtsrHT');
                const fileName = fileNameSpan ? fileNameSpan.textContent.trim() : "unknown.file";

                logToUI(`Switching to file: ${fileName}`);
                clickableElement.click();
                await sleep(750); // Wait for Ace Editor to load the file content

                const editor = ace.edit("ace-editor");
                const currentCode = editor.getValue();

                updateButtonState(`Processing ${fileName}...`);
                logToUI(`Processing file content for: ${fileName}`);

                let promptForAI;
                if (fileName.toLowerCase().endsWith('.txt')) {
                    // might return ai like answers or js not work, i lowk cba to fix or make it sound human but its not THAT obvious
                    promptForAI = `You are a high school student answering questions. Your output must be plain text only.

**DO NOT USE ANY MARKDOWN.**
- Do not use asterisks for bold or italics.
- Do not use backticks (\`) for code. Use single quotes (' ') instead.
- Do not use headings or lists.

**YOUR TASK:**
1.  Repeat each question exactly as it is written.
2.  On the very next line, write a short, simple answer in a casual tone. Use contractions (it's, don't, etc.).

---
Assignment Instructions:
${instructions}
---
Questions from file '${fileName}':
${currentCode}
---

Now, answer the questions following these strict rules. The entire response must be plain text.

You are also not a know-it-all. You are just a Student with limited knowledge, so if the question is asking a certain proficiency of knowledge, do not use expert proficiency, not all questions (like beginner questions) need expert level answers like memory and buffers.
`;
                    logToUI("Using txt prompt");
                } else {
                    logToUI("Using code prompt");
                    // works perfectly i think, sometimes comments but its pretty human
                    promptForAI = `You are a code completion tool. Your task is to fix the given code according to the assignment instructions.

Assignment Instructions:
---
${instructions}
---

File Name: \`${fileName}\`

Original Code:
---
${currentCode}
---

Follow these rules STRICTLY:
1.  **Correct the errors** in the original code to meet the requirements of the assignment instructions.
2.  **Do NOT add any comments** that were not in the original code.
3.  **Do NOT refactor the code.** Preserve the original structure and style as much as possible. Only make the minimum changes necessary to fix the errors and satisfy the assignment goals.
4.  **Output ONLY the complete, corrected, raw code for the file.** Do not include any explanations, apologies, or markdown formatting like \`\`\`java. Just the code itself.
5.  If the instructions do not require changes to this specific file, return the original code exactly as provided.`;
                }

                const newContent = await callGemini(promptForAI);
                logToUI(`Got solution for ${fileName}. Updating editor...`);
                const cleanedContent = newContent.replace(/^```[a-z]*\n/,'').replace(/```$/,'');
                editor.setValue(cleanedContent, 1);
            }

            updateButtonState('Finishing...');
            await sleep(1000);
            const submitButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Submit + Continue');
            const nextButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Next');

            if (submitButton) {
                logToUI("Found 'Submit + Continue' button. Clicking it.");
                submitButton.click();
            } else if (nextButton) {
                logToUI("Found 'Next' button for exercise. Clicking it.");
                nextButton.click();
            } else {
                console.error("Could not find a 'Submit + Continue' or 'Next' button.");
                logToUI("Could not find a 'Submit + Continue' or 'Next' button.");
                updateButtonState('Submit not found!', true);
            }

        } catch (error) {
            alert(`Error: ${error}`);
            logToUI(`Error: ${error}`);
            updateButtonState('Error, Retry?', true);
        }
    }


    // UI

    function createUI() {
        if (document.getElementById('automation-container')) return;

        const container = document.createElement('div');
        container.id = 'automation-container';
        container.style.cssText = `position: fixed; top: 10px; right: 10px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end;`;

        const controlsRow = document.createElement('div');
        controlsRow.style.cssText = `display: flex; align-items: center; background-color: rgba(255,255,255,0.9); padding: 5px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;

        const button = document.createElement('button');
        button.id = 'automation-button';
        button.innerHTML = 'Start Bot';
        button.style.cssText = `padding: 8px 12px; font-size: 14px; background-color: #5e35b1; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;`;
        button.onmouseover = () => button.style.backgroundColor = '#673ab7';
        button.onmouseout = () => button.style.backgroundColor = isRunning ? '#9575cd' : '#5e35b1';
        button.addEventListener('click', () => main(true));

        const toggleLabel = document.createElement('label');
        toggleLabel.style.cssText = `display: flex; align-items: center; margin-left: 10px; font-size: 12px; color: #333; cursor: pointer;`;

        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.checked = isAutoModeEnabled;
        toggleCheckbox.style.cssText = `margin-right: 5px;`;
        toggleCheckbox.addEventListener('change', () => {
            isAutoModeEnabled = toggleCheckbox.checked;
            GM_setValue('isAutoModeEnabled', isAutoModeEnabled);
            logToUI(`Auto ${isAutoModeEnabled ? 'enabled' : 'disabled'}`);
        });

        const nextLessonToggleLabel = document.createElement('label');
        nextLessonToggleLabel.style.cssText = `display: flex; align-items: center; margin-left: 10px; font-size: 12px; color: #333; cursor: pointer;`;

        const nextLessonToggleCheckbox = document.createElement('input');
        nextLessonToggleCheckbox.type = 'checkbox';
        nextLessonToggleCheckbox.checked = goMultipleLessons;
        nextLessonToggleCheckbox.style.cssText = `margin-right: 5px;`;
        nextLessonToggleCheckbox.addEventListener('change', () => {
            goMultipleLessons = nextLessonToggleCheckbox.checked;
            GM_setValue('goMultipleLessons', goMultipleLessons);
            logToUI(`"Go >1 Lesson" is now ${goMultipleLessons ? 'ON' : 'OFF'}`);
        });

        // Console UI
        const consoleToggleButton = document.createElement('button');
        consoleToggleButton.innerHTML = 'Logs';
        consoleToggleButton.title = 'Toggle Console';
        consoleToggleButton.style.cssText = `margin-left: 10px; padding: 5px 8px; font-size: 14px; background-color: #78909c; color: white; border: none; border-radius: 5px; cursor: pointer;`;

        const consoleLogContainer = document.createElement('div');
        consoleLogContainer.id = 'console-log-container';
        consoleLogContainer.style.cssText = `display: none; width: 350px; height: 200px; overflow-y: scroll; background-color: rgba(245, 245, 245, 0.95); border: 1px solid #ccc; border-radius: 5px; margin-top: 5px; padding: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);`;

        consoleToggleButton.addEventListener('click', () => {
            const isHidden = consoleLogContainer.style.display === 'none';
            consoleLogContainer.style.display = isHidden ? 'block' : 'none';
            consoleToggleButton.style.backgroundColor = isHidden ? '#546e7a' : '#78909c';
        });

        toggleLabel.appendChild(toggleCheckbox);
        toggleLabel.appendChild(document.createTextNode('Auto'));
        nextLessonToggleLabel.appendChild(nextLessonToggleCheckbox);
        nextLessonToggleLabel.appendChild(document.createTextNode('Go >1 Lesson'));

        controlsRow.appendChild(button);
        controlsRow.appendChild(toggleLabel);
        controlsRow.appendChild(nextLessonToggleLabel);
        controlsRow.appendChild(consoleToggleButton);

        container.appendChild(controlsRow);
        container.appendChild(consoleLogContainer);

        document.body.appendChild(container);
    }

    function updateButtonState(text, isEnabled = false) {
        const button = document.getElementById('automation-button');
        if (button) {
            button.innerHTML = text;
            button.disabled = !isEnabled;
            button.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
            button.style.backgroundColor = isEnabled ? '#5e35b1' : '#9575cd';
        }
    }

    let isRunning = false;
    async function main(isManualClick = false) {
        if (isRunning) {
            logToUI("Bot is already in progress.");
            return;
        }

        if (!isManualClick && !isAutoModeEnabled) {
            logToUI("Auto is disabled. Aborting.");
            return;
        }

        isRunning = true;
        updateButtonState('Working...', false);

        // Check coding assignments via looking for file list
        const fileListItems = document.querySelectorAll('div.Xe div.l ul li');

        if (fileListItems.length > 0) {
            await completeCoding();
        } else if (document.getElementById('pre-video-container')) {
            completeVideo();
        } else if (document.querySelector('.quiz-questions')) {
            await completeQuiz();
        } else if (document.querySelector(".btn-main") && document.querySelector(".btn-main").innerHTML == "Let's Go!") {
            logToUI("Found next lesson button. Clicking...");
            document.querySelector(".btn-main").click();
        } else {
            logToUI('No compatible assignment found.');
            if (isManualClick) alert('No compatible video, quiz, or coding module found.');
        }

        updateButtonState('Start Bot', true);
        isRunning = false;
    }


    // initialize y spa redirect handling

    function init() {
        createUI();

        let currentPath = window.location.pathname;
        const bodyObserver = new MutationObserver(() => {
            const newPath = window.location.pathname;
            if (currentPath !== newPath) {
                currentPath = newPath;
                logToUI("URL path change detected, re-running.");
                setTimeout(() => main(false), 1500);
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });


        // observer for the final submit button after tests run
        const finalSubmitObserver = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // check if its an element
                        const submitButton = node.id === 'submit-correct' ? node : node.querySelector('#submit-correct');
                        if (submitButton) {
                            logToUI("Modal detected. Waiting for button to be ready...");
                            observer.disconnect();

                            const clickInterval = setInterval(() => {
                                const button = document.getElementById('submit-correct');
                                if (button && !button.disabled && button.offsetParent !== null) {
                                    logToUI("Submitting...");
                                    button.click();
                                    clearInterval(clickInterval);
                                }
                            }, 500);

                            setTimeout(() => clearInterval(clickInterval), 10000);
                            return;
                        }
                    }
                }
            }
        });

        finalSubmitObserver.observe(document.body, { childList: true, subtree: true });

        // initial run on page load
        setTimeout(() => main(false), 1500);
    }

    window.addEventListener('load', init);
})();