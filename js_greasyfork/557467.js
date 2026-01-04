// ==UserScript==
// @name         Whop.com Scraper
// @namespace    https://greasyfork.org/users/30331-setcher
// @version      1.0.0
// @description  Adds buttons to easily copy video names on Whop.com
// @author       Setcher
// @match        https://whop.com/joined/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557467/Whopcom%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/557467/Whopcom%20Scraper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const css = `
        .whop-global-btns {margin:20px 0;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .whop-global-btn {flex:1;max-width:300px;background:#2563eb;color:#fff;border:none;padding:14px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;}
        .whop-global-btn:hover {background:#1d4ed8;}
        .whop-sec-btn {margin-left:8px;background:none;border:none;font-size:16px;cursor:pointer;opacity:0.8;}
        .whop-sec-btn:hover {opacity:1;}
        .whop-lesson-btn {margin-left:10px;background:none;border:none;font-size:19px;cursor:pointer;opacity:0.85;}
        .whop-lesson-btn:hover {opacity:1;}
        .whop-content-btn {display:block;margin:0 auto 16px;background:#1d4ed8;color:#fff;border:none;padding:9px 18px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;}
        .whop-content-btn:hover {background:#1e40af;}
        .whop-total-dur {color:#71717a;font-size:14px;margin-top:8px;text-align:center;}
        .whop-toast {position:fixed;bottom:20px;right:20px;background:#000000e6;color:#fff;padding:14px 24px;border-radius:10px;font-size:15px;z-index:99999;opacity:0;transform:translateY(20px);transition:opacity .3s,transform .3s;box-shadow:0 8px 25px rgba(0,0,0,0.4);}
        .whop-toast.show {opacity:1;transform:translateY(0);}
    `;
    document.head.appendChild(Object.assign(document.createElement('style'), {textContent: css}));

    const toast = msg => {
        const t = document.createElement('div');
        t.className = 'whop-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
    };

    const copy = text => navigator.clipboard.writeText(text).then(() => toast((text.match(/\n/g)||[]).length + 1 + ' lines copied'));

    // TOTAL DURATION
    const addTotalDuration = () => {
        if (document.querySelector('.whop-total-dur')) return;
        const span = [...document.querySelectorAll('span')].find(s => /of.*lessons/i.test(s.textContent));
        if (!span) return;
        const container = span.closest('div');

        let total = 0;
        document.querySelectorAll('span').forEach(s => {
            const m = s.textContent.match(/•\s*(\d+):(\d{2})(?::(\d{2}))?/);
            if (m) total += m[3] ? +m[1]*3600 + +m[2]*60 + +m[3] : +m[1]*60 + +m[2];
        });

        const h = Math.floor(total/3600), m = Math.floor(total%3600/60), s = total%60;
        const time = h ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`;

        container.insertAdjacentHTML('beforeend', `<div class="whop-total-dur">${time}</div>`);
    };

    // ✂️ BUTTON NEXT TO LESSON TITLE
    const addLessonCopyButton = () => {
        document.querySelectorAll('span.font-semibold.fui-r-size-5').forEach(titleSpan => {
            if (titleSpan.dataset.whopLessonBtn) return;
            titleSpan.dataset.whopLessonBtn = '1';

            // Find the correct number by matching the title in the full list
            const allLessons = [...document.querySelectorAll('button.relative.flex.w-full')];
            const currentLessonBtn = allLessons.find(btn =>
                                                     btn.querySelector('span.line-clamp-2')?.textContent.trim() === titleSpan.textContent.trim()
                                                    );
            const index = allLessons.indexOf(currentLessonBtn);
            const number = index >= 0 ? String(index + 1).padStart(2, '0') + '. ' : '';

            // Create scissors button
            const btn = document.createElement('button');
            btn.className = 'whop-lesson-btn';
            btn.textContent = '✂️';
            btn.title = 'Copy numbered lesson title';
            btn.style.cssText = 'margin-right:8px; font-size:20px; background:none; border:none; cursor:pointer; opacity:0.9;';
            btn.onclick = () => copy(`${number}${titleSpan.textContent.trim()}`);

            // Insert scissors button BEFORE the title text
            titleSpan.parentNode.insertBefore(btn, titleSpan);

            // Optional: wrap both in a flex container so they stay on the same line perfectly
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:inline-flex; align-items:center;';
            titleSpan.parentNode.insertBefore(wrapper, titleSpan);
            wrapper.appendChild(btn);
            wrapper.appendChild(titleSpan);
        });
    };

    // LESSON CONTENT BUTTON (centered above description)
    const addContentButton = () => {
        document.querySelectorAll('div.ProseMirror').forEach(prose => {
            if (prose.dataset.whopDone) return;
            prose.dataset.whopDone = '1';

            const section = document.querySelector('span.text-gray-9.fui-r-size-2')?.textContent.trim() || 'Section';
            const lesson  = document.querySelector('span.font-semibold.fui-r-size-5')?.textContent.trim() || 'Lesson';

            const btn = document.createElement('button');
            btn.className = 'whop-content-btn';
            btn.textContent = '✂️ Copy Lesson Content';
            btn.onclick = () => copy(`${section} - ${lesson} content:\n${prose.innerText.trim()}`);

            prose.parentNode.insertBefore(btn, prose);
        });
    };

    // SECTION BUTTONS (Copy / Copy with Time)
    const addSectionButtons = () => {
        document.querySelectorAll('div.flex.h-\\[55px\\]').forEach(header => {
            if (header.dataset.whopDone) return;
            header.dataset.whopDone = '1';

            const title = header.querySelector('span.font-semibold');
            if (!title) return;

            const btn1 = document.createElement('button');
            btn1.className = 'whop-sec-btn';
            btn1.textContent = '✂️';
            const btn2 = document.createElement('button');
            btn2.className = 'whop-sec-btn';
            btn2.textContent = '✂️⌛';

            let items = [];
            let el = header.nextElementSibling;
            while (el && !el.classList.contains('border-t')) el = el.nextElementSibling;
            if (el) items = [...el.querySelectorAll('button.relative.flex.w-full')];

            btn1.onclick = () => {
                let out = title.textContent.trim() + '\n';
                items.forEach((it,i) => out += `${(i+1).toString().padStart(2,'0')}. ${it.querySelector('span.line-clamp-2')?.textContent.trim()}\n`);
                copy(out);
            };
            btn2.onclick = () => {
                let out = title.textContent.trim() + '\n';
                items.forEach((it,i) => {
                    const name = it.querySelector('span.line-clamp-2')?.textContent.trim();
                    const time = it.querySelector('span.text-gray-9')?.textContent.split('•')[1]?.trim() || '';
                    out += `${(i+1).toString().padStart(2,'0')}. ${name}${time?' • '+time:''}\n`;
                });
                copy(out);
            };

            title.parentNode.append(btn1, btn2);
        });
    };

    // GLOBAL BUTTONS
    const addGlobalButtons = () => {
        if (document.querySelector('.whop-global-btns')) return;
        const ref = [...document.querySelectorAll('div.flex.flex-col.gap-2')].find(d =>
            [...d.querySelectorAll('span')].some(s => /of.*lessons/i.test(s.textContent))
        );
        if (!ref) return;

        const div = document.createElement('div');
        div.className = 'whop-global-btns';

        ['✂️', '✂️ w/Time'].forEach((txt, i) => {
            const b = document.createElement('button');
            b.className = 'whop-global-btn';
            b.textContent = txt;
            b.onclick = () => {
                let out = '', sec=0;
                document.querySelectorAll('div.flex.h-\\[55px\\]').forEach(h => {
                    const t = h.querySelector('span.font-semibold')?.textContent.trim();
                    if (!t) return;
                    out += `${++sec}. ${t}\n`;
                    let list = h.nextElementSibling;
                    while (list && !list.classList.contains('border-t')) list = list.nextElementSibling;
                    if (!list) return;
                    [...list.querySelectorAll('button.relative.flex.w-full')].forEach((it,j) => {
                        const name = it.querySelector('span.line-clamp-2')?.textContent.trim();
                        if (i===1) {
                            const time = it.querySelector('span.text-gray-9')?.textContent.split('•')[1]?.trim() || '';
                            out += `${(j+1).toString().padStart(2,'0')}. ${name}${time?' • '+time:''}\n`;
                        } else out += `${(j+1).toString().padStart(2,'0')}. ${name}\n`;
                    });
                    out += '\n';
                });
                copy(out.trim());
            };
            div.appendChild(b);
        });

        ref.parentNode.insertBefore(div, ref.nextSibling);
    };

    const run = () => {
        addTotalDuration();
        addSectionButtons();
        addGlobalButtons();
        addContentButton();
        addLessonCopyButton();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();

    new MutationObserver(() => setTimeout(run, 800))
        .observe(document.body, {childList:true, subtree:true});
})();