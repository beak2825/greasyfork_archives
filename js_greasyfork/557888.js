// ==UserScript==
// @name        网页字体替换
// @namespace   http://tampermonkey.net/
// @version      1.0.2
// @description   该脚本允许你将所有网页的字体替换为你本地的任意字体
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
        CUSTOM_FAMILY: "UserLocalFont"
    };

    function injectGlobalStyles(blobUrl) {
        let css = "";

        // ==========================================
        // 1. 字体定义 (劫持列表)
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
            css += `@font-face { font-family: '${name}'; src: url('${blobUrl}'); font-display: swap; }`;
        });

        css += `@font-face { font-family: '${CONFIG.CUSTOM_FAMILY}'; src: url('${blobUrl}'); font-display: swap; }`;

        // ==========================================
        // 2. 智能替换规则 (Smart Replacement)
        // ==========================================
        // 核心修改：使用 :not() 排除器。
        // 凡是类名中包含 icon, mdi (B站), fa (FontAwesome) 等特征的，
        // 脚本完全不介入，让它使用网页原本的 CSS 设置。
        
        const targetSelectors = [
            "body", "p", "article", "section", "blockquote",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "li", "dt", "dd", "th", "td",
            "b", "strong",
            "input", "textarea", "select",
            "nav", "[role='link']", "[role='button']", "[role='menuitem']",
            "[dir='auto']", "[dir='ltr']", "[lang]"
        ];

        // 排除列表：这些特征绝对不碰
        const excludePatterns = [
            '[class*="icon"]',
            '[class*="Icon"]',
            '[class*="symbol"]',
            '[class*="fa-"]', // FontAwesome
            '[class*="mdi"]', // Material Design Icons (Bilibili/Bewly)
            '[class*="glyph"]',
            '[class*="bi-"]', // Bootstrap
            '.material-icons',
            '.google-material-icons'
        ];

        // 生成类似: div:not([class*="icon"]):not([class*="mdi"]) { ... } 的规则
        // 这样可以最大程度保护图标，同时替换文字
        const notClause = excludePatterns.map(p => `:not(${p})`).join("");
        
        css += `
            ${targetSelectors.map(s => s + notClause).join(", ")} {
                font-family: "${CONFIG.CUSTOM_FAMILY}", "TwitterChirp", "Inter", "Microsoft YaHei", sans-serif !important;
            }
        `;

        // ==========================================
        // 3. 特殊修复区 (Bilibili / ArXiv)
        // ==========================================
        css += `
            /* B站字幕单独强制替换 */
            .bpx-player-subtitle-panel-text,
            .bpx-player-subtitle-wrap span,
            .bilibili-player-video-subtitle {
                font-family: "${CONFIG.CUSTOM_FAMILY}", sans-serif !important;
            }
            
            /* ArXiv / LaTeX 修复 */
            .ltx_text, .ltx_title, .ltx_abstract, .ltx_font_bold {
                 font-family: "${CONFIG.CUSTOM_FAMILY}", sans-serif !important;
            }
        `;

        // ==========================================
        // 4. 图标保护白名单 (Icon Protection)
        // ==========================================
        // 这里只保留必须显式声明字体的规则 (如 Google 翻译)
        // 对于其他的图标，上面的 :not() 规则已经让脚本“放过”它们了
        
        const protectedIconFonts = [
            'Material Icons Extended', // Google Translate 核心修复
            'Google Material Icons',
            'Material Icons',
            'Material Design Icons',   // Bilibili / Bewly
            'FontAwesome', 
            'Material Symbols Outlined'
        ];
        
        // 针对 Google 翻译等顽固分子，强制指定字体列表
        css += `
            .material-icons-extended, 
            [class*="google-material-icons"],
            .goog-te-gadget-icon {
                font-family: ${protectedIconFonts.map(f => `"${f}"`).join(", ")} !important;
                font-weight: normal !important;
                font-style: normal !important;
            }
            
            /* 代码块字体保护 */
            pre, code, kbd, samp, .monaco-editor, .code-block, textarea.code {
                font-family: "Space Mono", "Consolas", monospace !important;
                font-variant-ligatures: none;
            }
            
            /* 数学公式保护 */
            .MathJax, .MathJax *, .mjx-container, .mjx-container *,
            .ltx_Math, .ltx_equation, .ltx_equation *, math, math * {
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
                    GM_setValue(CONFIG.META_KEY, { name: file.name, type: file.type, totalChunks: totalChunks });
                    alert("✅ 字体上传成功。");
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
        GM_registerMenuCommand("📂 上传字体文件", () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.accept = ".ttf,.otf,.woff,.woff2";
            input.onchange = e => { if(e.target.files[0]) Storage.save(e.target.files[0]); };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
        GM_registerMenuCommand("🗑️ 恢复默认", () => {
            if(confirm("确定恢复默认吗?")) { Storage.clear(); location.reload(); }
        });
        Storage.load().then(blob => {
            if(blob) injectGlobalStyles(URL.createObjectURL(blob));
        }).catch(e => console.error("FontLoader Error:", e));
    }

    init();
})();