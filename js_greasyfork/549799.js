// ==UserScript==
// @name         ReadTheory
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically answers ReadTheory quiz questions using AI
// @author       theroyalwhale
// @match        https://readtheoryapp.com/app/student/quiz
// @grant        GM_xmlhttpRequest
// @connect      openrouter.ai
// @icon         https://dyntech.cc/favicon?q=https://readtheory.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549799/ReadTheory.user.js
// @updateURL https://update.greasyfork.org/scripts/549799/ReadTheory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const AI_API_KEY = 'Grab your own key from OpenRouter';
    const AI_MODEL = 'moonshotai/kimi-k2-0905';

    let isProcessing = false;
    let currentUrl = window.location.href;
    let lastProcessedQuestion = null;
    let noSubmitButtonCount = 0;

    // Check if question has already been processed
    function isQuestionAlreadyProcessed(question) {
        return lastProcessedQuestion === question;
    }

    // Check if an answer is already selected
    function isAnswerAlreadySelected() {
        const selectedAnswer = document.querySelector('.student-quiz-page__answer.answer-card-wrapper.selected') ||
                             document.querySelector('.student-quiz-page__answer.answer-card-wrapper[aria-checked="true"]') ||
                             document.querySelector('.answer-card-wrapper.selected');
        return selectedAnswer !== null;
    }

    // Check if submit/next button exists
    function submitButtonExists() {
        const nextButton = document.querySelector('.primary-button.student-quiz-page__question-next.next-btn.quiz-tab-item');
        const submitButton = document.querySelector('.primary-button.student-quiz-page__question-submit.quiz-tab-item');
        return nextButton || submitButton;
    }
    function isOnQuizPage() {
        return window.location.href.includes('/app/student/quiz') &&
               window.location.href === currentUrl;
    }

    // Extract passage text from description wrapper
    function extractPassageText() {
        const descriptionWrapper = document.querySelector('.description-wrapper');
        if (!descriptionWrapper) return null;

        const paragraphs = descriptionWrapper.querySelectorAll('p');
        let passageText = '';
        paragraphs.forEach(p => {
            passageText += p.textContent.trim() + '\n';
        });
        return passageText.trim();
    }

    // Extract question text
    function extractQuestion() {
        const questionElement = document.querySelector('.student-quiz-page__question[role="title"]');
        return questionElement ? questionElement.textContent.trim() : null;
    }

    // Extract answer choices
    function extractAnswerChoices() {
        const answersContainer = document.querySelector('.student-quiz-page__answers.quiz-tab-item[role="main"]');
        if (!answersContainer) return null;

        const choices = [];
        const choiceElements = answersContainer.querySelectorAll('.student-quiz-page__answer.answer-card-wrapper[role="radio"]');

        choiceElements.forEach((element, index) => {
            const alphaElement = element.querySelector('.answer-card__alpha');
            const bodyElement = element.querySelector('.answer-card__body');

            if (alphaElement && bodyElement) {
                const letter = alphaElement.textContent.trim();
                const text = bodyElement.textContent.trim();
                choices.push({
                    letter: letter,
                    text: text,
                    element: element,
                    index: index
                });
            }
        });

        return choices;
    }

    // Call AI API to get the answer
    async function getAIAnswer(passageText, question, choices) {
        const choicesText = choices.map(choice => `${choice.letter}. ${choice.text}`).join('\n');

        const prompt = `Please read the following passage and answer the multiple choice question.
You MUST respond with ONLY the letter of the correct answer (A, B, C, D, or E).
Do not include any explanation or additional text - just the single letter.

PASSAGE:
${passageText}

QUESTION:
${question}

CHOICES:
${choicesText}

Answer (single letter only):`;

        try {
            // Generic API call structure - modify based on your specific AI service
            const response = await fetch(AI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_API_KEY}`
                },
                body: JSON.stringify({
                    model: AI_MODEL,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 10,
                    temperature: 0.1
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            // Extract answer based on common API response formats
            let answer;
            if (data.choices && data.choices[0] && data.choices[0].message) {
                // OpenAI format
                answer = data.choices[0].message.content.trim().toUpperCase();
            } else if (data.content && data.content[0] && data.content[0].text) {
                // Anthropic format
                answer = data.content[0].text.trim().toUpperCase();
            } else if (typeof data === 'string') {
                // Simple string response
                answer = data.trim().toUpperCase();
            } else {
                throw new Error('Unexpected API response format');
            }

            // Extract just the letter (remove any extra characters)
            const letterMatch = answer.match(/[A-Z]/);
            return letterMatch ? letterMatch[0] : null;

        } catch (error) {
            console.error('AI API Error:', error);
            return null;
        }
    }

    // Click the answer choice
    function selectAnswer(choices, answerLetter) {
        const selectedChoice = choices.find(choice => choice.letter === answerLetter);
        if (selectedChoice) {
            console.log(`Selecting answer: ${answerLetter} - ${selectedChoice.text}`);
            selectedChoice.element.click();
            return true;
        }
        return false;
    }

    // Click the submit button
    function submitAnswer() {
        // Try to find Next button first (after answer is selected)
        let submitButton = document.querySelector('.primary-button.student-quiz-page__question-next.next-btn.quiz-tab-item');

        // If Next button not found, try the Submit button
        if (!submitButton) {
            submitButton = document.querySelector('.primary-button.student-quiz-page__question-submit.quiz-tab-item');
        }

        if (submitButton && !submitButton.classList.contains('disabled')) {
            console.log('Clicking button:', submitButton.textContent.trim());
            submitButton.click();
            return true;
        }
        return false;
    }

    // Main processing function
    async function processQuestion() {
        if (isProcessing || !isOnQuizPage()) return;

        // Check if submit button exists, if not for multiple checks, refresh
        if (!submitButtonExists()) {
            noSubmitButtonCount++;
            if (noSubmitButtonCount >= 3) {
                console.log('Submit button missing for 3+ checks, refreshing page...');
                location.reload();
                return;
            }
            return;
        } else {
            noSubmitButtonCount = 0; // Reset counter if button exists
        }

        // Extract question to check if it's already processed
        const question = extractQuestion();
        if (!question) {
            console.log('No question found, waiting...');
            return;
        }

        // Skip if already processed this question
        if (isQuestionAlreadyProcessed(question)) {
            console.log('Question already processed, skipping AI call...');

            // Check if we need to submit an already selected answer
            if (isAnswerAlreadySelected()) {
                setTimeout(() => {
                    if (submitAnswer()) {
                        console.log('Previously selected answer submitted');
                        setTimeout(() => {
                            isProcessing = false;
                            currentUrl = window.location.href;
                            lastProcessedQuestion = null; // Reset for new question
                        }, 3000);
                    }
                }, 5000);
            }
            return;
        }

        // Skip if answer is already selected (but question is new)
        if (isAnswerAlreadySelected()) {
            console.log('Answer already selected for this question, just submitting...');
            lastProcessedQuestion = question;
            setTimeout(() => {
                if (submitAnswer()) {
                    console.log('Already selected answer submitted');
                    setTimeout(() => {
                        isProcessing = false;
                        currentUrl = window.location.href;
                        lastProcessedQuestion = null;
                    }, 3000);
                }
            }, 5000);
            return;
        }

        isProcessing = true;
        console.log('Processing new question...');

        try {
            // Extract all required elements
            const passageText = extractPassageText();
            const choices = extractAnswerChoices();

            if (!passageText || !question || !choices || choices.length === 0) {
                console.log('Missing required elements, waiting...');
                isProcessing = false;
                return;
            }

            console.log('Passage extracted:', passageText.substring(0, 100) + '...');
            console.log('Question:', question);
            console.log('Choices:', choices.map(c => `${c.letter}: ${c.text}`));

            // Mark this question as processed
            lastProcessedQuestion = question;

            // Get AI answer
            const aiAnswer = await getAIAnswer(passageText, question, choices);

            if (!aiAnswer) {
                console.error('Failed to get AI answer');
                isProcessing = false;
                lastProcessedQuestion = null; // Reset if failed
                return;
            }

            console.log('AI Answer:', aiAnswer);

            // Select the answer
            if (selectAnswer(choices, aiAnswer)) {
                // Wait 5 seconds before submitting
                setTimeout(() => {
                    if (submitAnswer()) {
                        console.log('Answer submitted successfully');
                        // Wait for page to refresh/change
                        setTimeout(() => {
                            isProcessing = false;
                            currentUrl = window.location.href;
                            lastProcessedQuestion = null; // Reset for new question
                        }, 3000);
                    } else {
                        console.log('Submit button not ready, will retry...');
                        isProcessing = false;
                    }
                }, 5000);
            } else {
                console.error('Failed to select answer:', aiAnswer);
                isProcessing = false;
                lastProcessedQuestion = null; // Reset if failed
            }

        } catch (error) {
            console.error('Error processing question:', error);
            isProcessing = false;
            lastProcessedQuestion = null; // Reset if error
        }
    }

    // Start the automation
    function startAutomation() {
        console.log('ReadTheory Auto Answer script started');
        console.log('Make sure to configure your AI API credentials in the script!');

        // Initial attempt
        setTimeout(processQuestion, 2000);

        // Set up interval to check for new questions
        setInterval(() => {
            if (isOnQuizPage() && !isProcessing) {
                processQuestion();
            } else if (!isOnQuizPage()) {
                console.log('Quiz completed or navigated away from quiz page');
            }
        }, 3000);
    }

    // Wait for page to load completely
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAutomation);
    } else {
        startAutomation();
    }

})();




