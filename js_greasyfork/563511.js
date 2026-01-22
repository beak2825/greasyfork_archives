// ==UserScript==
// @name         HelloQuiz with Google AI
// @namespace    http://tampermonkey.net/
// @version      1.4
// @match        https://helloquiz.app/quiz/*
// @description  Adds Google Search and AI buttons to HelloQuiz.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563511/HelloQuiz%20with%20Google%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/563511/HelloQuiz%20with%20Google%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userLang = navigator.language || navigator.userLanguage;
    const isChinese = userLang.startsWith('zh');
    const QUERY_PREFIX = isChinese ? "介绍" : "Tell me about ";

    const style = document.createElement('style');
    style.textContent = `
        #custom-google-btn {
            background: var(--bg);
            cursor: pointer;
            color: var(--text);
            border-style: solid;
            border-width: 1px;
            border-color: var(--text);
            border-radius: 10px;
            padding: 5px;
            margin: 0 5px;
            font-size: .7em !important;
            width: calc(20% - 10px);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all .2s ease-in-out;
            box-sizing: border-box;
            vertical-align: middle;
        }
        #custom-google-btn:hover {
            background: var(--hl);
            color: var(--bg);
            border-color: var(--hl);
        }
        #custom-google-btn svg {
            width: 1.2em;
            height: 1.2em;
        }
        .generic-quiz-module__m31QtG__controlButtonsMap button {
            width: calc(20% - 10px) !important;
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'custom-google-btn';
    btn.title = 'p';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
    `;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = document.querySelector('.quiz-module__HPadfW__content h2');
        if (target) {
            const text = target.innerText.trim();
            window.open(`https://www.google.com/search?q=${encodeURIComponent(QUERY_PREFIX + text)}`, '_blank');
        }
    });

    const observer = new MutationObserver(() => {
        const container = document.querySelector('.generic-quiz-module__m31QtG__controlButtonsMap');
        if (container && !document.getElementById('custom-google-btn')) {
            container.appendChild(btn);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();