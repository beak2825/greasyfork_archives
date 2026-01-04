// ==UserScript==
// @name         SERUTI Auto Fill Query
// @namespace    https://olah.web.bps.go.id/
// @version      1.51
// @description  Isi textarea dari URL eksternal dan upload hasil tabel ke Eval1800
// @match        https://olah.web.bps.go.id/seruti/query*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557049/SERUTI%20Auto%20Fill%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/557049/SERUTI%20Auto%20Fill%20Query.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const QUERY_URL = 'https://raw.githubusercontent.com/bps1800/jejama-ssn-sept-2025/main/query_seruti_tw_4.txt';
    const UPLOAD_URL = 'https://sosial1800.statapps.dev/evaluasi-seruti-tw4/api/post.php';
    const FILL_DELAY_MS = 500;

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        const observer = new MutationObserver(() => {
            const el2 = document.querySelector(selector);
            if (el2) {
                observer.disconnect();
                callback(el2);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function clearTextarea(textarea) {
        textarea.focus();
        textarea.select();
        textarea.setRangeText("");
        textarea.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "deleteContentBackward" }));
        textarea.value = "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("🧹 Textarea dikosongkan.");
    }

    async function fillQueryFromGitHub() {
        const switchBtn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Switch to Raw Query');
        const switchBtn2 = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Switch to Query Builder');
        if (switchBtn) {
            switchBtn.click();
            console.log('Klik "Switch to Query Builder"');
        } else if(switchBtn2){
            console.log('Sudah di tombol "Switch to Query Builder"');
        }else {
            alert('❌ Tidak menemukan tombol "Switch to Raw Query"!');
            return;
        }
        console.log("🔹 Mengambil query dari GitHub...");
        try {
            const response = await fetch(QUERY_URL);
            if (!response.ok) throw new Error(`Gagal fetch: ${response.status}`);
            const queryText = await response.text();

            waitForElement('body textarea', async (textarea) => {
                await clearTextarea(textarea);
                await sleep(FILL_DELAY_MS);
                textarea.value = queryText.trim();
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                console.log("✅ Query berhasil dimuat ke textarea.");
                //alert("✅ Query berhasil dimuat ke textarea dari GitHub.");
            });
        } catch (err) {
            console.error("❌ Gagal mengambil query:", err);
            alert("❌ Gagal mengambil query dari GitHub.");
        }
    }

    async function uploadToEval1800(buttonEl) {
        console.log("⬆️ Mengambil data tabel...");
        const table = document.querySelector('body > div.c-wrapper > div > main > div > div > div.container-fluid > div > div > div.card.border-dark.mb-0 > div.card-body.p-2 > div > table');
        if (!table) {
            alert("❌ Tidak menemukan tabel hasil query!");
            return;
        }

        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
        const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
            const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
            const obj = {};
            headers.forEach((h, i) => obj[h] = cells[i] || '');
            return obj;
        });

        if (!rows.length) {
            alert("⚠️ Tidak ada data di tabel!");
            return;
        }

        // ubah tombol jadi "Uploading..."
        const originalText = buttonEl.textContent;
        buttonEl.disabled = true;
        buttonEl.textContent = "⏳ Uploading...";

        try {
            const response = await fetch(UPLOAD_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rows)
            });

            const result = await response.text();
            console.log("✅ Upload sukses:", result);
            alert("✅ Data berhasil diupload ke Eval1800!\n"+ result);
        } catch (err) {
            console.error("❌ Gagal upload:", err);
            alert("❌ Upload ke Eval1800 gagal. Cek console log untuk detail.");
        } finally {
            // kembalikan tombol seperti semula
            buttonEl.textContent = originalText;
            buttonEl.disabled = false;
        }
    }

    function init() {
        // tombol Auto Fill Query
        waitForElement('button.btn.btn-sm.btn-primary[style*="width: 200px"]', (rawBtn) => {
            if (!rawBtn.textContent.includes('Switch to Raw Query')) return;

            const autoFillBtn = document.createElement('button');
            autoFillBtn.textContent = ' Auto Fill Query';
            autoFillBtn.className = 'btn btn-sm btn-warning ml-1';
            autoFillBtn.style.width = '200px';
            autoFillBtn.title = 'Ambil query dari GitHub dan isi ke textarea';
            autoFillBtn.addEventListener('click', fillQueryFromGitHub);

            rawBtn.parentNode.insertBefore(autoFillBtn, rawBtn.nextSibling);
            console.log('✅ Tombol "Auto Fill Query" ditambahkan.');
        });

        // tombol Upload ke Eval1800
        waitForElement('body > div.c-wrapper > div > main > div > div > div.container-fluid > div > div > div.card.border-dark.mb-2 > div > div.ml-auto > button.btn.btn-sm.btn-success.ml-1', (execBtn) => {
            const uploadBtn = document.createElement('button');
            uploadBtn.textContent = ' Upload ke Eval1800';
            uploadBtn.className = 'btn btn-sm btn-info ml-1';
            uploadBtn.title = 'Upload hasil tabel ke endpoint Eval1800';
            uploadBtn.addEventListener('click', () => uploadToEval1800(uploadBtn));

            execBtn.parentNode.insertBefore(uploadBtn, execBtn.nextSibling);
            console.log('✅ Tombol "Upload ke Eval1800" ditambahkan.');
        });
    }

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();

})();
