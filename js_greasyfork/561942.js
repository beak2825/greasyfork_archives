// ==UserScript==
// @name         Happymh Downloader
// @namespace    happymh-downloader
// @version      12.0
// @description  Dùng lõi nén của script Asura để đảm bảo tải được file ZIP.
// @author       User
// @match        https://m.happymh.com/mangaread/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.48/dist/zip.min.js
// @downloadURL https://update.greasyfork.org/scripts/561942/Happymh%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561942/Happymh%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIG ---
    const PARALLEL_DOWNLOADS = 10;

    // --- UI ---
    const ui = document.createElement('div');
    ui.style = "position: fixed; right: 20px; bottom: 20px; z-index: 999999;";
    document.body.appendChild(ui);

    const btn = document.createElement('button');
    btn.innerHTML = '⚡ TẢI TRUYỆN';
    btn.style = "padding: 15px 25px; background: #27ae60; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: sans-serif;";
    ui.appendChild(btn);

    const status = document.createElement('div');
    status.style = "position: fixed; top: 15px; left: 50%; transform: translateX(-50%); background: #fff; color: #c0392b; padding: 10px 25px; border-radius: 10px; border: 3px solid #27ae60; font-weight: bold; font-family: 'Acme', sans-serif; font-size: 20px; display: none; z-index: 1000000; box-shadow: 0 5px 15px rgba(0,0,0,0.2);";
    document.body.appendChild(status);

    const log = (txt) => { status.style.display = 'block'; status.innerHTML = txt; };

    // --- UTILS ---
    function getCleanFileName() {
        try {
            const parts = document.title.split(' - ');
            const name = parts[0] || "Manga";
            const chap = parts[1] || "";
            return `${name}_${chap}`.replace(/[\\/:*?"<>|]+/g, "_").trim();
        } catch (e) { return "Happymh_Download"; }
    }

    async function fetchImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, responseType: 'arraybuffer',
                onload: (res) => resolve(res.response),
                onerror: (err) => reject(err)
            });
        });
    }

    // --- MAIN ---
    btn.onclick = async () => {
        const imgTags = document.querySelectorAll('img');
        let urls = [];
        imgTags.forEach(img => {
            const src = img.getAttribute('data-src') || img.getAttribute('v-lazy') || img.src;
            if (src && (src.includes('ruicdn') || src.includes('happymh')) && !src.includes('logo')) {
                urls.push(src);
            }
        });
        urls = [...new Set(urls)];

        if (urls.length === 0) {
            alert("❌ Không tìm thấy ảnh. Hãy kéo xuống cuối chương để ảnh hiện hết đã!");
            return;
        }

        btn.disabled = true;
        btn.style.background = '#bdc3c7';
        log("🚀 Đang tải ảnh...");

        // Khởi tạo zipWriter theo cách của Asura script (zip.js)
        const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
        let completed = 0;
        let index = 0;

        // Hàm tải song song
        const worker = async () => {
            while (index < urls.length) {
                const i = index++;
                const url = urls[i];
                try {
                    const data = await fetchImage(url);
                    const ext = url.split('.').pop().split('?')[0] || 'jpg';
                    const name = `${String(i + 1).padStart(3, '0')}.${ext}`;

                    // Thêm vào file zip ngay khi tải xong ảnh đó
                    await zipWriter.add(name, new zip.Uint8ArrayReader(new Uint8Array(data)));

                    completed++;
                    log(`📥 Đang nạp: ${completed} / ${urls.length}`);
                } catch (e) {
                    console.error("Lỗi ảnh:", url);
                    completed++;
                }
            }
        };

        // Chạy 10 luồng tải song song
        await Promise.all(Array(PARALLEL_DOWNLOADS).fill(null).map(worker));

        log("📦 Đang xuất file ZIP...");
        try {
            const zipBlob = await zipWriter.close();

            const a = document.createElement("a");
            a.href = URL.createObjectURL(zipBlob);
            a.download = `${getCleanFileName()}.zip`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                a.remove();
                URL.revokeObjectURL(a.href);
                log("✅ HOÀN TẤT!");
                btn.disabled = false;
                btn.style.background = '#27ae60';
                setTimeout(() => { status.style.display = 'none'; }, 3000);
            }, 1000);

        } catch (err) {
            alert("Lỗi nén ZIP: " + err.message);
            btn.disabled = false;
            btn.style.background = '#27ae60';
        }
    };
})();