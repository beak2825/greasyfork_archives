// ==UserScript==
// @name         X クイズ投稿 TSVコピーボタン
// @namespace    https://greasyfork.org/ja/users/570127
// @version      1.3.3
// @description  クイズ投稿を解析しTSVコピーします
// @match        https://x.com/*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560397/X%20%E3%82%AF%E3%82%A4%E3%82%BA%E6%8A%95%E7%A8%BF%20TSV%E3%82%B3%E3%83%94%E3%83%BC%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/560397/X%20%E3%82%AF%E3%82%A4%E3%82%BA%E6%8A%95%E7%A8%BF%20TSV%E3%82%B3%E3%83%94%E3%83%BC%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_CLASS = 'daiku-tsv-copy-btn';

    function extractPostText(article) {
        return Array.from(
            article.querySelectorAll('[data-testid="tweetText"]')
        ).map(b => b.innerText).join('\n');
    }

    function extractDate(article) {
        const time = article.querySelector('time');
        if (!time?.dateTime) return ['', '', ''];
        const d = new Date(time.dateTime);
        return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    }

    /* ---------- Type I： 【地下〜 / 答え 型 ---------- */
    function parseBracketStyle(lines) {
        let genreLine = '';
        const questionLines = [];
        let answer = '';
        let explanation = '';

        let state = 'search';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;

            if (state === 'search' && line.startsWith('【地下')) {
                genreLine = line;
                state = 'question';
                continue;
            }

            if (state === 'question' && /^答え/.test(line)) {
                answer = line.replace(/^答え[:：]?\s*/, '');
                state = 'afterAnswer';
                continue;
            }

            if (state === 'question') {
                questionLines.push(line);
                continue;
            }

            if (state === 'afterAnswer') {
                explanation = line;
                break;
            }
        }

        if (!genreLine || !answer) return null;

        return {
            genreLine,
            question: questionLines.join(' '),
            answer,
            explanation
        };
    }

    /* ---------- Type Y： 問／答 型 ---------- */
    function parseQAStyle(lines) {
        let genreLine = '';
        let question = '';
        let answer = '';

        for (const line of lines) {
            if (!line) continue;

            if (!genreLine && line.includes('#地下クイズ')) {
                genreLine = line;
                continue;
            }

            if (line.startsWith('問')) {
                question = line.replace(/^問\s*/, '');
                continue;
            }

            if (line.startsWith('答')) {
                answer = line.replace(/^答\s*/, '');
                continue;
            }
        }

        if (!genreLine || !question || !answer) return null;

        return {
            genreLine,
            question,
            answer,
            explanation: ''
        };
    }

    function parseUndergroundQuiz(text) {
        const lines = text.split('\n').map(l => l.trim());

        return (
            parseBracketStyle(lines) ||
            parseQAStyle(lines)
        );
    }

    function buildTSV(article) {
        const text = extractPostText(article);
        if (!text.includes('地下クイズ')) return null;

        const parsed = parseUndergroundQuiz(text);
        if (!parsed) return null;

        const [y, m, d] = extractDate(article);

        return [
            y,
            m,
            d,
            parsed.genreLine,
            parsed.question,
            parsed.answer,
            parsed.explanation
        ].join('\t');
    }

    function addButtonToArticle(article) {
        if (article.querySelector(`.${BUTTON_CLASS}`)) return;

        const tsv = buildTSV(article);
        if (!tsv) return;

        const btn = document.createElement('button');
        btn.textContent = 'TSVコピー';
        btn.className = BUTTON_CLASS;
        btn.style.cssText = `
            margin-top: 6px;
            padding: 2px 6px;
            font-size: 11px;
            cursor: pointer;
            opacity: 0.85;
        `;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            GM_setClipboard(tsv);

            const original = btn.textContent;
            btn.textContent = 'コピー済み';
            btn.style.opacity = '0.6';

            setTimeout(() => {
                btn.textContent = original;
                btn.style.opacity = '0.85';
            }, 1000);
        });

        article.querySelector('[data-testid="tweetText"]')?.appendChild(btn);
    }

    function scan() {
        document.querySelectorAll('article').forEach(addButtonToArticle);
    }

    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    scan();
})();
