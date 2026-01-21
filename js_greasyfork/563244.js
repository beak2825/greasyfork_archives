// ==UserScript==
// @name        全局字体保存
// @version     1.0.1
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

    /**
     * 核心逻辑：注入字体
     * 如果 CSS 定义了 --user-font-range，则应用该范围；否则应用全字符集。
     */
    function injectFontFace(blobUrl) {
        let lastAppliedRange = null;

        const apply = (range) => {
            const cleanRange = (range && range.trim() !== '' && range !== 'initial' && range !== 'inherit') ? range.trim() : null;
            
            // 避免重复注入相同的范围
            if (cleanRange === lastAppliedRange) return;
            lastAppliedRange = cleanRange;

            const rangeCSS = cleanRange ? `unicode-range: ${cleanRange};` : '';
            const css = `
                @font-face {
                    font-family: 'UserLocalFont';
                    src: url('${blobUrl}');
                    ${rangeCSS}
                    font-weight: var(--vf-props, normal);
                    font-stretch: 50% 200%;
                    font-display: swap;
                }
            `;
            // 注入 CSS。后注入的 @font-face 会覆盖同名的先注入规则。
            GM_addStyle(css);
        };

        // 1. 立即尝试注入一次（即使此时没有读取到变量，也会注入一个无范围限制的完整字体）
        const getStyle = () => getComputedStyle(document.documentElement).getPropertyValue('--user-font-range');
        apply(getStyle());

        // 2. 监听并追随 CSS 变量的变化 (适配 Stylus 加载或动态切换 range)
        const observer = new MutationObserver(() => {
            const currentRange = getStyle();
            if (currentRange) apply(currentRange);
        });

        observer.observe(document.documentElement, { attributes: true, childList: true });
        
        // 3. 补充：页面加载完成后再次校对
        window.addEventListener('load', () => apply(getStyle()), { once: true });
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
                    alert(`✅ 存储成功，已作为 'UserLocalFont' 注入。`);
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

    if (window.self === window.top) {
        GM_registerMenuCommand("📂 上传并保存字体", () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = ".ttf,.otf,.woff,.woff2,.ttc";
            input.onchange = e => { if(e.target.files[0]) Storage.save(e.target.files[0]); };
            input.click();
        });
        GM_registerMenuCommand("🗑️ 清空存储", () => {
            if(confirm("确定清空存储的字体吗?")) {
                GM_listValues().forEach(k => { if (k.startsWith(CONFIG.DB_PREFIX) || k === CONFIG.META_KEY) GM_deleteValue(k); });
                location.reload();
            }
        });
    }

    Storage.load().then(blob => {
        if(blob) {
            const blobUrl = URL.createObjectURL(blob);
            injectFontFace(blobUrl);
        }
    });
})();