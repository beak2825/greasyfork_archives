// ==UserScript==
// @name        网页字体替换
// @namespace   http://tampermonkey.net/
// @version      1.0.3
// @description   该脚本允许你将所有网页的字体替换为你本地的任意字体。支持任意格式。
// @author       Kyurin
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @noframes
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557888/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/557888/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    if (window.top !== window.self) return;
 
    const CONFIG = {
        CHUNK_SIZE: 1024 * 1024,
        DB_PREFIX: "FONT_DATA_",
        META_KEY: "FONT_META",
        VAR_KEY: "IS_VARIABLE_FONT", // 新增：存储是否为可变字体的状态
        CUSTOM_FAMILY: "UserLocalFont"
    };
 
    // 读取用户设置，默认为 false (即默认当作普通静态字体处理，兼容性最好)
    const isVariableFont = GM_getValue(CONFIG.VAR_KEY, false);
 
    function injectGlobalStyles(blobUrl) {
        let css = "";
 
        // ==========================================
        // 关键逻辑：根据模式决定 CSS 属性
        // ==========================================
        let fontFaceProps = `src: url('${blobUrl}'); font-display: swap;`;
        
        if (isVariableFont) {
            //如果是可变字体，显式声明支持的字重范围，让浏览器调用字体内部轴
            fontFaceProps += `
                font-weight: 1 1000;
                font-stretch: 50% 200%;
            `;
        } else {
            // 如果是普通字体，不声明 font-weight。
            // 这样当网页需要 bold 时，浏览器会进行 "Synthetic Bold" (伪粗体/描边加粗)，
            // 避免出现"虽然加粗了但看起来还是细体"的 Bug。
        }
 
        // ==========================================
        // 1. 字体定义
        // ==========================================
        const hijackList = [
            "TwitterChirp", "TwitterChirpExtendedHeavy", "Chirp",
            "Latin Modern Roman", "Computer Modern", "LinLibertine", "Lucida Grande",
            "Inter", "Inter var", "Inter Tight",
            "Google Sans", "Google Sans Text",
            "Roboto", "San Francisco", "Segoe UI",
            "system-ui", "ui-sans-serif", "-apple-system", "BlinkMacSystemFont", "sans-serif",
            "Helvetica Neue", "Helvetica", "Arial", "Verdana", "Tahoma",
            "Open Sans", "Fira Sans", "Ubuntu",
            "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑",
            "Heiti SC", "SimHei", "SimSun", "Noto Sans SC", "Source Han Sans SC",
            "IBM Plex Sans", "Reddit Sans", "Noto Sans"
        ];
 
        hijackList.forEach(name => {
            css += `@font-face { font-family: '${name}'; ${fontFaceProps} }`;
        });
 
        css += `@font-face { font-family: '${CONFIG.CUSTOM_FAMILY}'; ${fontFaceProps} }`;
 
        // ==========================================
        // 2. 替换规则
        // ==========================================
        const targetSelectors = [
            "body", "p", "article", "section", "blockquote",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "li", "dt", "dd", "th", "td",
            "b", "strong",
            "input", "textarea", "select",
            "nav", "[role='link']", "[role='button']", "[role='menuitem']",
            "[dir='auto']", "[dir='ltr']", "[lang]"
        ];
 
        const excludePatterns = [
            '[class*="icon"]',
            '[class*="Icon"]',
            '[class*="symbol"]',
            '[class*="fa-"]',
            '[class*="mdi"]',
            '[class*="glyph"]',
            '[class*="bi-"]',
            '.material-icons',
            '.google-material-icons'
        ];
 
        const notClause = excludePatterns.map(p => `:not(${p})`).join("");
        
        css += `
            ${targetSelectors.map(s => s + notClause).join(", ")} {
                font-family: "${CONFIG.CUSTOM_FAMILY}", "TwitterChirp", "Inter", "Microsoft YaHei", sans-serif !important;
            }
        `;
 
        // ==========================================
        // 3. 修复与白名单
        // ==========================================
        css += `
            .bpx-player-subtitle-panel-text,
            .bpx-player-subtitle-wrap span,
            .bilibili-player-video-subtitle { font-family: "${CONFIG.CUSTOM_FAMILY}", sans-serif !important; }
            
            .ltx_text, .ltx_title, .ltx_abstract, .ltx_font_bold { font-family: "${CONFIG.CUSTOM_FAMILY}", sans-serif !important; }
            
            .material-icons-extended, [class*="google-material-icons"], .goog-te-gadget-icon {
                font-family: "Material Icons Extended", "Google Material Icons", "Material Icons", "Material Symbols Outlined" !important;
            }
            
            pre, code, kbd, samp, .monaco-editor, .code-block, textarea.code {
                font-family: "Space Mono", "Consolas", monospace !important;
                font-variant-ligatures: none;
            }
            
            .MathJax, .MathJax *, .mjx-container, .mjx-container *, math, math * {
                font-family: "Latin Modern Math", serif !important;
            }
        `;
 
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = css;
            document.head.appendChild(styleEl);
        }
 
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    }
 
    const Storage = {
        save: function(file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                const base64 = e.target.result.split(',')[1];
                const totalChunks = Math.ceil(base64.length / CONFIG.CHUNK_SIZE);
                this.clear();
                try {
                    for (let i = 0; i < totalChunks; i++) {
                        GM_setValue(`${CONFIG.DB_PREFIX}${i}`, base64.slice(i * CONFIG.CHUNK_SIZE, (i + 1) * CONFIG.CHUNK_SIZE));
                    }
                    GM_setValue(CONFIG.META_KEY, { name: file.name, type: file.type || "font/ttf", totalChunks: totalChunks });
                    alert(`✅ 字体 [${file.name}] 上传成功。\n注意：如果是可变字体，请在菜单中开启“可变字体模式”以获得最佳效果。`);
                    location.reload();
                } catch (err) {
                    alert("❌ 保存失败：空间不足。");
                }
            };
        },
        load: function() {
            return new Promise((resolve, reject) => {
                const meta = GM_getValue(CONFIG.META_KEY);
                if (!meta) { resolve(null); return; }
                setTimeout(() => {
                    try {
                        const chunks = [];
                        for (let i = 0; i < meta.totalChunks; i++) {
                            const chunk = GM_getValue(`${CONFIG.DB_PREFIX}${i}`);
                            if (chunk) chunks.push(chunk);
                        }
                        if (chunks.length !== meta.totalChunks) throw new Error("Corrupted data");
                        fetch(`data:${meta.type};base64,${chunks.join('')}`)
                            .then(res => res.blob())
                            .then(blob => resolve(blob))
                            .catch(() => {
                                const byteStr = atob(chunks.join(''));
                                const bytes = new Uint8Array(byteStr.length);
                                for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
                                resolve(new Blob([bytes], {type: meta.type}));
                            });
                    } catch (e) { reject(e); }
                }, 0);
            });
        },
        clear: function() {
            GM_listValues().forEach(k => {
                if (k.startsWith(CONFIG.DB_PREFIX) || k === CONFIG.META_KEY) GM_deleteValue(k);
            });
        }
    };
 
    function init() {
        // ==========================================
        // 菜单：上传字体
        // ==========================================
        GM_registerMenuCommand("📂 上传字体文件", () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.accept = ".ttf,.otf,.woff,.woff2,.ttc";
            input.onchange = e => { if(e.target.files[0]) Storage.save(e.target.files[0]); };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
 
        // ==========================================
        // 菜单：切换可变字体模式
        // ==========================================
        // 根据当前状态显示不同的图标和文字
        const modeStatus = isVariableFont ? "✅ 开启 (Variable)" : "❌ 关闭 (Static)";
        GM_registerMenuCommand(`🔠 可变字体模式: ${modeStatus}`, () => {
            const newState = !isVariableFont;
            GM_setValue(CONFIG.VAR_KEY, newState);
            const msg = newState 
                ? "模式已开启：\n适用于 Variable Fonts (可变字体)。\n浏览器将使用字体内部的字重轴。" 
                : "模式已关闭：\n适用于普通静态字体 (Static Fonts)。\n浏览器将自动生成伪粗体。";
            alert(msg);
            location.reload();
        });
 
        // ==========================================
        // 菜单：恢复默认
        // ==========================================
        GM_registerMenuCommand("🗑️ 恢复默认", () => {
            if(confirm("确定清空字体数据并恢复默认吗?")) { Storage.clear(); location.reload(); }
        });
 
        Storage.load().then(blob => {
            if(blob) injectGlobalStyles(URL.createObjectURL(blob));
        }).catch(e => console.error("FontLoader Error:", e));
    }
 
    init();
})();