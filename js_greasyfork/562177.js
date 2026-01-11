// ==UserScript==
// @name         Rumanhua Downloader V12.6
// @namespace    rumanhua-downloader
// @version      12.6
// @description  Tương thích hoàn toàn với link http://rumanhua2.com trên điện thoại.
// @author       User
// @match        *://rumanhua2.com/*
// @match        *://*.rumanhua2.com/*
// @match        http://rumanhua2.com/*
// @match        http://*.rumanhua2.com/*
// @include      /^http?://(www\.|m\.)?rumanhua2\.com/.*$/
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.48/dist/zip.min.js
// @downloadURL https://update.greasyfork.org/scripts/562177/Rumanhua%20Downloader%20V126.user.js
// @updateURL https://update.greasyfork.org/scripts/562177/Rumanhua%20Downloader%20V126.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Xác nhận script chạy (Kiểm tra trong phần Console nếu cần)
    console.log("Rumanhua Script Started");

    const PARALLEL_DOWNLOADS = 12; // Số luồng vừa phải cho điện thoại

    // --- GIAO DIỆN MOBILE ---
    const ui = document.createElement('div');
    // Đẩy lên 130px để chắc chắn nằm trên thanh địa chỉ/công cụ của Firefox
    ui.style = "position: fixed; right: 15px; bottom: 130px; z-index: 2147483647;";
    document.body.appendChild(ui);

    const btn = document.createElement('button');
    btn.innerHTML = '🚀 TẢI ZIP';
    btn.style = "padding: 16px 22px; background: #e67e22; color: white; border: 2px solid #fff; border-radius: 50px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-size: 15px; font-family: sans-serif;";
    ui.appendChild(btn);

    const status = document.createElement('div');
    status.style = "position: fixed; top: 15%; left: 10%; right: 10%; background: #fff; color: #e67e22; padding: 15px; border-radius: 10px; border: 2px solid #e67e22; font-weight: bold; font-size: 15px; display: none; z-index: 2147483647; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.3);";
    document.body.appendChild(status);

    const log = (txt) => { status.style.display = 'block'; status.innerHTML = txt; };

    function getCleanFileName() {
        try {
            let fullTitle = document.title;
            // Rumanhua mobile title fallback
            let mangaName = fullTitle.match(/《(.+?)》/)?.[1] || "Manga";
            let chapterName = fullTitle.split('》')[1]?.split('-')[0]?.trim() || fullTitle.split('_')[0] || "Chapter";
            return `${mangaName}_${chapterName}`.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_").trim();
        } catch (e) { return "Rumanhua_" + Date.now(); }
    }

    async function fetchImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, responseType: 'arraybuffer',
                timeout: 25000,
                onload: (res) => resolve(res.response),
                onerror: (err) => reject(err)
            });
        });
    }

    btn.onclick = async () => {
        const imgTags = document.querySelectorAll('img');
        let urls = [];
        imgTags.forEach(img => {
            const src = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('v-lazy') || img.src;
            if (src && src.match(/\.(jpg|jpeg|png|webp|avif)/i) && !src.includes('logo')) {
                try {
                    urls.push(new URL(src, location.href).href);
                } catch(e){}
            }
        });
        urls = [...new Set(urls)];

        if (urls.length === 0) {
            alert("❌ Không thấy ảnh. Bạn cần kéo xuống cuối chương để nạp ảnh trước!");
            return;
        }

        btn.disabled = true;
        btn.style.opacity = '0.5';
        log("⚡ Đang chuẩn bị nạp...");

        const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
        let completed = 0;
        let index = 0;

        const worker = async () => {
            while (index < urls.length) {
                const i = index++;
                const url = urls[i];
                try {
                    const data = await fetchImage(url);
                    const ext = url.split('.').pop().split('?')[0] || 'jpg';
                    const name = `${String(i + 1).padStart(3, '0')}.${ext}`;
                    await zipWriter.add(name, new zip.Uint8ArrayReader(new Uint8Array(data)), { level: 0 });
                } catch (e) {}
                completed++;
                log(`📥 Đang nạp: ${completed} / ${urls.length}`);
            }
        };

        const workers = [];
        for (let i = 0; i < Math.min(PARALLEL_DOWNLOADS, urls.length); i++) {
            workers.push(worker());
        }
        await Promise.all(workers);

        log("📦 Đang đóng gói ZIP...");
        const zipBlob = await zipWriter.close();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = `${getCleanFileName()}.zip`;
        document.body.appendChild(a);
        a.click();
        
        log("✅ HOÀN TẤT! Đã gửi lệnh tải.");
        btn.disabled = false;
        btn.style.opacity = '1';
        setTimeout(() => { status.style.display = 'none'; a.remove(); }, 5000);
    };
})();