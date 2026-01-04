// ==UserScript==
// @name         Moodle Preview Tasks
// @namespace    russbear
// @version      1.0
// @license MIT
// @description  Предпросмотр заданий
// @author       Russbear
// @match        *://*/course/view.php?id=*
// @match        *://*/mod/quiz/view.php?id=*
// @match        *://*/mod/assign/view.php?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557432/Moodle%20Preview%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/557432/Moodle%20Preview%20Tasks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .mpt-preview {
            margin-top: 6px;
            font-size: 12px;
            color: #555;
            border-left: 2px solid #ced4da;
            padding-left: 10px;
        }
        .mpt-toggle {
            background: none;
            border: none;
            color: #1a5a96;
            font-size: 12px;
            cursor: pointer;
            padding: 0;
            text-decoration: underline;
        }
        .mpt-toggle:hover {
            color: #0d4777;
        }
        .mpt-details {
            margin-top: 6px;
            padding: 8px 10px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 3px;
            font-size: 12px;
            line-height: 1.5;
            display: none;
        }
        .mpt-dates span {
            display: inline-block;
            margin-right: 12px;
        }
        .mpt-structure {
            margin-top: 4px;
            font-style: italic;
            color: #666;
        }
    `);

    function cleanText(el) {
        if (!el) return '';
        return (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function simplifyDate(str) {
        if (!str) return str;
        const m = str.match(/(\d{1,2}[\s\.]\w+[\s\.]\d{4}|\d{4}-\d{2}-\d{2})/);
        return m ? m[0].replace(/\./g, '.') : str;
    }

    function attachPreview(link, moduleType) {
        if (link.hasAttribute('data-mpt-processed')) return;
        link.setAttribute('data-mpt-processed', 'true');

        const container = document.createElement('div');
        container.className = 'mpt-preview';

        const toggle = document.createElement('button');
        toggle.className = 'mpt-toggle';
        toggle.textContent = 'Предпросмотр';
        toggle.type = 'button';

        const details = document.createElement('div');
        details.className = 'mpt-details';

        container.append(toggle, details);
        const parent = link.parentElement;
        if (parent) parent.appendChild(container);

        let cachedData = null;

        toggle.addEventListener('click', async () => {
            if (details.style.display === 'block') {
                details.style.display = 'none';
                toggle.textContent = 'Предпросмотр';
                return;
            }

            if (!cachedData) {
                toggle.disabled = true;
                cachedData = await loadPreviewData(link.href, moduleType);
                toggle.disabled = false;

                if (cachedData.error) {
                    details.innerHTML = '<i>Нет данных</i>';
                } else {
                    let html = '';
                    if (cachedData.intro) html += `<div>${cachedData.intro}</div>`;
                    if (cachedData.dates && Object.keys(cachedData.dates).length) {
                        const dateLines = Object.entries(cachedData.dates)
                            .map(([k, v]) => `<span><strong>${k}:</strong> ${v}</span>`)
                            .join('');
                        html += `<div class="mpt-dates">${dateLines}</div>`;
                    }
                    if (cachedData.structure) {
                        html += `<div class="mpt-structure">${cachedData.structure}</div>`;
                    }
                    details.innerHTML = html || '<i>Нет дополнительной информации</i>';
                }
            }

            details.style.display = 'block';
            toggle.textContent = 'Скрыть';
        });
    }

    function loadPreviewData(url, type) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: res => {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');

                        const introEl = doc.querySelector('#intro') ||
                                        doc.querySelector('.intro') ||
                                        doc.querySelector('#generalbox p') ||
                                        doc.querySelector('.box.generalbox p');
                        const intro = cleanText(introEl);

                        const dates = {};
                        doc.querySelectorAll('table.generaltable, .generalbox table')
                            .forEach(t => t.querySelectorAll('tr').forEach(r => {
                                const cells = r.querySelectorAll('td, th');
                                if (cells.length >= 2) {
                                    const lab = cells[0].textContent.trim();
                                    const val = cells[1].textContent.trim();
                                    if (!val) return;
                                    if (/доступ|available/i.test(lab)) dates['Открывается'] = simplifyDate(val);
                                    else if (/сдач|due|deadline/i.test(lab)) dates['Сдача до'] = simplifyDate(val);
                                    else if (/закр|close/i.test(lab)) dates['Закрывается'] = simplifyDate(val);
                                }
                            }));

                        let structure = '';
                        if (type === 'quiz') {
                            const info = doc.querySelector('.quizinfo')?.textContent || '';
                            const q = info.match(/(\d+)\s+вопрос/i)?.[1];
                            const t = info.match(/(\d+)\s+минут/i)?.[1];
                            const parts = [];
                            if (q) parts.push(`${q} вопрос${+q === 1 ? '' : 'ов'}`);
                            if (t) parts.push(`на ${t} мин.`);
                            structure = parts.join(', ');
                        }

                        resolve({ intro, dates, structure });
                    } catch {
                        resolve({ error: true });
                    }
                },
                onerror: () => resolve({ error: true }),
                timeout: 4000
            });
        });
    }

    function init() {
        document.querySelectorAll('a[href*="/mod/"]').forEach(link => {
            const href = link.href;
            if (
                (href.includes('/mod/quiz/view.php?id=') || href.includes('/mod/assign/view.php?id=')) &&
                !link.hasAttribute('data-mpt-processed') &&
                link.closest('.activityinstance, .activity, .modtype_quiz, .modtype_assign')
            ) {
                attachPreview(link, href.includes('/quiz/') ? 'quiz' : 'assign');
            }
        });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();