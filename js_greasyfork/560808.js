// ==UserScript==
// @name         ASStars — Автопроставление меток S
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматически проставляет ЕСТЬ S / НЕТ S по txt-файлам (по ID аниме)
// @match        https://animestars.org/user/*/cards_progress*
// @match        https://asstars.tv/user/*/cards_progress*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560808/ASStars%20%E2%80%94%20%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B5%D1%82%D0%BE%D0%BA%20S.user.js
// @updateURL https://update.greasyfork.org/scripts/560808/ASStars%20%E2%80%94%20%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B5%D1%82%D0%BE%D0%BA%20S.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const TOTAL_PAGES = 146;
    const DELAY = 900; // мс между кликами

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function extractIDs(text) {
        return new Set(
            text
                .split('\n')
                .map(l => l.match(/^(\d+)/))
                .filter(Boolean)
                .map(m => m[1])
        );
    }

    function readFile(file) {
        return new Promise(res => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.readAsText(file);
        });
    }

    async function chooseFiles() {
        return new Promise(res => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = '.txt';
            input.onchange = () => res([...input.files]);
            input.click();
        });
    }

    async function processPage(doc, hasS, noS, progress) {
        const blocks = [...doc.querySelectorAll('[data-anime-id], a[href*="-"]')];

        for (const block of blocks) {
            const link = block.closest('a[href*="-"]') || block.querySelector('a[href*="-"]');
            if (!link) continue;

            const m = link.href.match(/\/(\d+)-/);
            if (!m) continue;

            const id = m[1];

            const root = link.closest('.anime-card, .user-anime, .collection-item');
            if (!root) continue;

            if (hasS.has(id)) {
                const btn = root.querySelector('button:contains("ЕСТЬ")') ||
                            [...root.querySelectorAll('button')].find(b => b.textContent.includes('ЕСТЬ'));
                if (btn) {
                    btn.click();
                    await sleep(DELAY);
                }
            }

            if (noS.has(id)) {
                const btn = root.querySelector('button:contains("НЕТ")') ||
                            [...root.querySelectorAll('button')].find(b => b.textContent.includes('НЕТ'));
                if (btn) {
                    btn.click();
                    await sleep(DELAY);
                }
            }

            progress.done++;
            progress.btn.textContent = `🛠 Автопроставление (${progress.done})`;
        }
    }

    async function start(btn) {
        const files = await chooseFiles();
        if (!files.length) return alert('Файлы не выбраны');

        const hasFile = files.find(f => f.name.includes('has'));
        const noFile  = files.find(f => f.name.includes('no'));

        if (!hasFile || !noFile) {
            alert('Нужны has_s.txt и no_s.txt');
            return;
        }

        const hasS = extractIDs(await readFile(hasFile));
        const noS  = extractIDs(await readFile(noFile));

        btn.disabled = true;
        btn.textContent = '🛠 Подготовка...';

        let progress = { done: 0, btn };

        const base = location.href.replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '');

        for (let page = 1; page <= TOTAL_PAGES; page++) {
            let doc;

            if (page === 1) {
                doc = document;
            } else {
                const html = await fetch(`${base}/page/${page}/`).then(r => r.text());
                doc = new DOMParser().parseFromString(html, 'text/html');
            }

            await processPage(doc, hasS, noS, progress);
        }

        btn.textContent = '✅ Автопроставление завершено';
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '🛠 Автопроставить метки';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '10px 16px',
            fontSize: '14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: '#9b59b6',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)'
        });

        btn.onclick = () => start(btn);
        document.body.appendChild(btn);
    }

    window.addEventListener('load', createButton);
})();
