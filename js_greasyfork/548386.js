// ==UserScript==
// @name         Sye Network – Local Post Injector
// @namespace    https://sye.ct.ws/
// @version      1.0
// @description  Add local news articles directly to /posts/ on Sye Network
// @author       Sye
// @match        https://sye.ct.ws/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/548386/Sye%20Network%20%E2%80%93%20Local%20Post%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/548386/Sye%20Network%20%E2%80%93%20Local%20Post%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Panel Styles ---
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.width = '320px';
    panel.style.background = '#fff';
    panel.style.border = '2px solid #000';
    panel.style.padding = '15px';
    panel.style.borderRadius = '6px';
    panel.style.boxShadow = '0 0 12px rgba(0,0,0,.3)';
    panel.style.fontFamily = 'Georgia, serif';
    panel.style.fontSize = '14px';
    panel.style.zIndex = '99999';

    panel.innerHTML = `
      <h3 style="margin:0 0 10px; font-size:16px;">📰 Add Local News</h3>
      <label>Title:<br>
        <input type="text" id="inj_title" style="width:100%; margin:4px 0;">
      </label>
      <label>Date:<br>
        <input type="date" id="inj_date" style="width:100%; margin:4px 0;">
      </label>
      <label>Author:<br>
        <input type="text" id="inj_author" style="width:100%; margin:4px 0;" value="Anonymous">
      </label>
      <label>Content:<br>
        <textarea id="inj_content" rows="5" style="width:100%; margin:4px 0;"></textarea>
      </label>
      <button id="inj_submit" style="width:100%; background:#111; color:#fff; border:none; padding:8px; cursor:pointer;">
        ➕ Submit Post
      </button>
      <p id="inj_status" style="margin:6px 0 0; font-size:12px; color:#333;"></p>
    `;
    document.body.appendChild(panel);

    // --- Submit Handler ---
    document.getElementById('inj_submit').addEventListener('click', function() {
        const title   = document.getElementById('inj_title').value.trim();
        const date    = document.getElementById('inj_date').value.trim();
        const author  = document.getElementById('inj_author').value.trim();
        const content = document.getElementById('inj_content').value.trim();
        const status  = document.getElementById('inj_status');

        if (!title || !date || !content) {
            alert('⚠️ Title, Date, and Content are required!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('date', date);
        formData.append('author', author);
        formData.append('content', content);
        formData.append('signature', 'LOCAL_INJECT_TM'); // security token check

        status.textContent = '⏳ Submitting...';

        fetch('/dropper.php', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'success') {
                status.textContent = `✅ Saved as ${data.file}`;
                document.getElementById('inj_title').value = '';
                document.getElementById('inj_content').value = '';
            } else {
                status.textContent = `❌ Failed: ${data.message}`;
            }
        })
        .catch(err => {
            console.error(err);
            status.textContent = '❌ Network error';
        });
    });
})();
