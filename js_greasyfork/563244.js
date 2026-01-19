// ==UserScript==
// @name        全局字体保存
// @version     1.0.0
// @description 存储字体到本地，解决移动端stylus等插件无法调用自定义本地字体的问题
// @author       Kyurin
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1544496
// @downloadURL https://update.greasyfork.org/scripts/563244/%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/563244/%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        CHUNK_SIZE: 512 * 1024,
        DB_PREFIX: "FONT_DATA_",
        META_KEY: "FONT_META"
    };

    function injectFontFace(blobUrl) {
        const css = `@font-face { font-family: 'UserLocalFont'; src: url('${blobUrl}'); font-display: swap; }`;
        GM_addStyle(css);
    }

    const Storage = {
        save: function(file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                const base64 = e.target.result.split(',')[1];
                const totalChunks = Math.ceil(base64.length / CONFIG.CHUNK_SIZE);
                GM_listValues().forEach(k => { if (k.startsWith(CONFIG.DB_PREFIX)) GM_deleteValue(k); });
                try {
                    for (let i = 0; i < totalChunks; i++) {
                        GM_setValue(`${CONFIG.DB_PREFIX}${i}`, base64.slice(i * CONFIG.CHUNK_SIZE, (i + 1) * CONFIG.CHUNK_SIZE));
                    }
                    GM_setValue(CONFIG.META_KEY, { type: file.type || "font/ttf", totalChunks: totalChunks });
                    alert(`✅ 字体存储成功，刷新后生效。`);
                    location.reload();
                } catch (err) { alert("❌ 存储失败：空间不足。"); }
            };
        },
        load: function() {
            return new Promise((resolve) => {
                const meta = GM_getValue(CONFIG.META_KEY);
                if (!meta) return resolve(null);
                try {
                    const chunks = [];
                    for (let i = 0; i < meta.totalChunks; i++) {
                        const chunk = GM_getValue(`${CONFIG.DB_PREFIX}${i}`);
                        if (chunk) chunks.push(chunk);
                    }
                    const byteStr = atob(chunks.join(''));
                    const bytes = new Uint8Array(byteStr.length);
                    for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
                    resolve(new Blob([bytes], {type: meta.type}));
                } catch (e) { resolve(null); }
            });
        }
    };

    // 只有主页面显示菜单，防止角标数字爆炸
    if (window.self === window.top) {
        GM_registerMenuCommand("📂 上传字体文件", () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = ".ttf,.otf,.woff,.woff2,.ttc";
            input.onchange = e => { if(e.target.files[0]) Storage.save(e.target.files[0]); };
            input.click();
        });
        GM_registerMenuCommand("🗑️ 清空存储", () => { if(confirm("确定清空?")) { GM_deleteValue(CONFIG.META_KEY); location.reload(); } });
    }

    Storage.load().then(blob => {
        if(blob) injectFontFace(URL.createObjectURL(blob));
    });
})();