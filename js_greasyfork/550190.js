// ==UserScript==
// @name         Scratch JSON Editor
// @namespace    https://scratch.mit.edu/
// @version      2025-09-09
// @description  JSONエディター画面を作る
// @author       You
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550190/Scratch%20JSON%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/550190/Scratch%20JSON%20Editor.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    /** @param {() => unknown} listener */
    const onLoaded = listener => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", listener);
        } else {
            listener();
        }
    };
    if (/^\/projects\/\d+\/json\/?/.test(location.pathname)) {
        const id = Number(location.pathname.match(/^\/projects\/(\d+)\/json\/?/)[1]);
        onLoaded(() => {
            /** @type {HTMLDivElement} */
            const boxContent = document.querySelector('.box-content');
            boxContent.innerHTML = 'Loading...';
        });
        const xtoken = await fetch('/session', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json())
            .then(r => r.user?.token);
        const { title, project_token: ptoken }
            = await fetch(`https://api.scratch.mit.edu/projects/${id}`, { headers: { 'X-Token': xtoken } })
                .then(r => r.json());
        onLoaded(() => {
            /** @type {HTMLDivElement} */
            const boxHead = document.querySelector('.box-head');
            boxHead.style.paddingTop = '7px';
            boxHead.innerHTML = `<h2><a href="/projects/${id}/"></a> » JSON Editor</h2>`;
            boxHead.querySelector('a').innerText = title;
        });
        const json = await fetch(`https://projects.scratch.mit.edu/${id}?token=${ptoken}`)
            .then(r => r.text());
        onLoaded(() => {
            /** @type {HTMLDivElement} */
            const boxContent = document.querySelector('.box-content');
            boxContent.innerHTML = '';
            const textarea = document.createElement('textarea');
            const button = document.createElement('button');
            const status = document.createElement('span');
            button.innerText = '保存';
            textarea.value = json;
            Object.assign(textarea.style, {
                margin: '0 auto',
                boxSizing: 'border-box',
                width: 'calc(100% - 40px)',
                height: '30em',
                resize: 'vertical',
                fontFamily: 'monospace',
            });
            Object.assign(button.style, {
                margin: '20px',
            });
            Object.assign(status.style, {
                display: 'inline-block',
                width: '10em',
            });
            boxContent.append(textarea, button, status);
            button.addEventListener('click', () => {
                status.innerText = '';
                fetch(`https://projects.scratch.mit.edu/${id}`, {
                    method: 'PUT',
                    body: textarea.value,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                }).then(r => {
                    status.innerText = String(r.status);
                }).catch(() => {
                    status.innerText = 'Error';
                });
            });
        });
    }
})();