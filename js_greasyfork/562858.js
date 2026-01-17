// ==UserScript==
// @name         字体替换增强器 (等宽 + 无衬线) 
// @namespace    kvkS0ewmtA4PYE
// @description  替换网页的等宽字体和无衬线字体，顺带修复英文系统的中文 Fallback 问题。可根据需求修改脚本中的字体设置。使用前需确保已安装所需字体。
// @version      12.3.0
// @license      Apache License 2.0
// @author       Ckrvxr
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/562858/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA%E5%99%A8%20%28%E7%AD%89%E5%AE%BD%20%2B%20%E6%97%A0%E8%A1%AC%E7%BA%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562858/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA%E5%99%A8%20%28%E7%AD%89%E5%AE%BD%20%2B%20%E6%97%A0%E8%A1%AC%E7%BA%BF%29.meta.js
// ==/UserScript==
(function () {
    "use strict";

    const defaultConfig = {
        mono_latin: ["Cascadia Next SC", "Cascadia Code", "SF Mono"],
        sans_latin: ["Microsoft YaHei UI", "SF Pro", ""],
    };

    function loadConfig() {
        return {
            mono_latin: GM_getValue("mono_latin", defaultConfig.mono_latin),
            sans_latin: GM_getValue("sans_latin", defaultConfig.sans_latin),
        };
    }

    function saveConfig(config) {
        GM_setValue("mono_latin", config.mono_latin);
        GM_setValue("sans_latin", config.sans_latin);
    }

    function createConfigUI(config) {
        if (document.getElementById('font-config-panel')) return;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflowX = "hidden";
        document.documentElement.style.overflowY = "hidden";

        const panel = document.createElement("div");
        panel.id = "font-config-panel";
        panel.style.cssText = `
            z-index: 2147483647;
            position: fixed;
            inset: 0;
            background: #ffffff;
            overflow-y: auto;
            padding: 4rem;
            font-family: sans-serif;
            box-sizing: border-box;
        `;

        const title = document.createElement("h1");
        title.textContent = "字体替换增强器 · 配置面板";
        title.style.cssText = `
            margin: 0 0 2rem;
            font-size: 1.5rem;
            text-align: center;
            color: #333333;
        `;

        const createInputGroup = (type, label) => {
            const container = document.createElement("div");
            container.style.marginBottom = "2rem";

            const titleLabel = document.createElement("label");
            titleLabel.textContent = label;
            titleLabel.style.cssText = `
                display: block;
                margin-bottom: 0.75rem;
                font-weight: 600;
                color: #333333;
                font-size: 1.1rem;
            `;

            const inputContainer = document.createElement("div");
            inputContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5rem;
            `;

            const values = config[type] || defaultConfig[type];

            values.forEach((value, index) => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = value;
                input.dataset.type = type;
                input.dataset.index = index;
                input.placeholder = `备选字体 ${index + 1}`;
                input.style.cssText = `
                    width: 100%;
                    padding: 0.6rem;
                    border: 1px solid #cccccc;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    color: #333333;
                    background: #f9f9f9;
                    box-sizing: border-box;
                `;
                inputContainer.appendChild(input);
            });

            container.appendChild(titleLabel);
            container.appendChild(inputContainer);
            return container;
        };

        const createButton = (text, colorScheme) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.style.cssText = `
                flex: 1;
                padding: 0.75rem 1rem;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin: 0 0.5rem;
                color: white;
                background: ${colorScheme.base};
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;

            const hoverEffect = () => {
                btn.style.background = colorScheme.hover;
                btn.style.transform = "translateY(-1px)";
                btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
            };
            const outEffect = () => {
                btn.style.background = colorScheme.base;
                btn.style.transform = "translateY(0)";
                btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            };

            btn.addEventListener("mouseenter", hoverEffect);
            btn.addEventListener("mouseleave", outEffect);
            btn.addEventListener("touchstart", hoverEffect, { passive: true });
            btn.addEventListener("touchend", outEffect, { passive: true });

            return btn;
        };

        const colorSchemes = {
            primary: { base: "#4f46e5", hover: "#4338ca" },
            secondary: { base: "#64748b", hover: "#475569" },
            success: { base: "#10b981", hover: "#0b8a5e" },
            warning: { base: "#f59e0b", hover: "#d97706" },
            danger: { base: "#ef4444", hover: "#dc2626" },
        };

        const importInput = document.createElement("input");
        importInput.type = "file";
        importInput.accept = ".json";
        importInput.style.display = "none";

        const importBtn = createButton("导入配置", colorSchemes.warning);
        importBtn.onclick = () => importInput.click();
        importInput.onchange = async () => {
            try {
                const file = importInput.files[0];
                if (!file) return;
                const content = await file.text();
                const importedConfig = JSON.parse(content);
                
                let updated = false;
                if (importedConfig.mono_latin && Array.isArray(importedConfig.mono_latin)) {
                    config.mono_latin = [...importedConfig.mono_latin];
                    updated = true;
                }
                if (importedConfig.sans_latin && Array.isArray(importedConfig.sans_latin)) {
                    config.sans_latin = [...importedConfig.sans_latin];
                    updated = true;
                }

                if (updated) {
                    saveConfig(config);
                    alert("导入成功：请刷新页面生效");
                    closePanel();
                } else {
                    alert("导入失败：未找到有效的字体配置");
                }
            } catch (e) {
                console.error("导入配置失败:", e);
                alert("导入失败：无效的配置文件或读取错误");
            }
        };

        const exportBtn = createButton("导出配置", colorSchemes.secondary);
        exportBtn.onclick = () => {
            const blob = new Blob([JSON.stringify({ 
                mono_latin: config.mono_latin,
                sans_latin: config.sans_latin
            }, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "font-replacement-config.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        const resetBtn = createButton("重置默认", colorSchemes.danger);
        resetBtn.onclick = () => {
            if (confirm("确定要重置所有字体配置为默认值吗？")) {
                config.mono_latin = [...defaultConfig.mono_latin];
                config.sans_latin = [...defaultConfig.sans_latin];
                saveConfig(config);
                alert("重置成功：请刷新页面生效");
                closePanel();
            }
        };

        const saveBtn = createButton("保存配置", colorSchemes.success);
        saveBtn.onclick = () => {
            ['mono_latin', 'sans_latin'].forEach(type => {
                const inputs = panel.querySelectorAll(`input[data-type='${type}']`);
                inputs.forEach((input) => {
                    const index = parseInt(input.dataset.index, 10);
                    if (!isNaN(index)) {
                        config[type][index] = input.value.trim();
                    }
                });
            });
            saveConfig(config);
            alert("保存成功：请刷新页面生效");
            closePanel();
        };

        const closeBtn = createButton("关闭", colorSchemes.primary);
        const closePanel = () => {
            panel.remove();
            document.body.style.overflow = "";
            document.documentElement.style.overflowX = "";
            document.documentElement.style.overflowY = "";
        };
        closeBtn.onclick = closePanel;

        panel.appendChild(title);
        panel.appendChild(createInputGroup("mono_latin", "等宽字体 (Monospace)"));
        panel.appendChild(createInputGroup("sans_latin", "无衬线字体 (Sans-Serif)"));

        const actionRow1 = document.createElement("div");
        actionRow1.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        `;
        actionRow1.appendChild(importBtn);
        actionRow1.appendChild(exportBtn);
        actionRow1.appendChild(resetBtn);
        panel.appendChild(actionRow1);

        const actionRow2 = document.createElement("div");
        actionRow2.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
        `;
        actionRow2.appendChild(saveBtn);
        actionRow2.appendChild(closeBtn);
        panel.appendChild(actionRow2);

        document.body.appendChild(panel);
    }

    function generateCSS(config) {
        const [mono_1, mono_2, mono_3] = config.mono_latin || defaultConfig.mono_latin;
        const [sans_1, sans_2, sans_3] = config.sans_latin || defaultConfig.sans_latin;

        const monoSrc = `local("${mono_1}"), local("${mono_2}"), local("${mono_3}")`;
        const sansSrc = `local("${sans_1}"), local("${sans_2}"), local("${sans_3}")`;

        let css = `
        /* --- Mono --- */
            /* --- Namespace --- */
                @font-face {font-family: "MONO_SPACE"; src: ${monoSrc};}
                @font-face {font-family: "monospace"; src: ${monoSrc};}
                @font-face {font-family: "ui-monospace"; src: ${monoSrc};}
            /* --- Microsoft --- */
                @font-face {font-family: "Lucida Console"; src: ${monoSrc};}
                @font-face {font-family: "Consolas"; src: ${monoSrc};}
                @font-face {font-family: "Courier"; src: ${monoSrc};}
                @font-face {font-family: "Courier New"; src: ${monoSrc};}
                @font-face {font-family: "Cascadia Code"; src: ${monoSrc};}
                @font-face {font-family: "Cascadia Mono"; src: ${monoSrc};}
            /* --- Apple --- */
                @font-face {font-family: "Andale Mono"; src: ${monoSrc};}
                @font-face {font-family: "Monaco"; src: ${monoSrc};}
                @font-face {font-family: "Menlo"; src: ${monoSrc};}
                @font-face {font-family: "San Francisco Mono"; src: ${monoSrc};}
                @font-face {font-family: "SF Mono"; src: ${monoSrc};}
                @font-face {font-family: "SFMono-Regular"; src: ${monoSrc};}
            /* --- Google --- */
                @font-face {font-family: "Droid Sans Mono"; src: ${monoSrc};}
                @font-face {font-family: "Roboto Mono"; src: ${monoSrc};}
                @font-face {font-family: "Noto Sans Mono"; src: ${monoSrc};}
            /* --- Adobe --- */
                @font-face {font-family: "Source Code Pro"; src: ${monoSrc};}
            /* --- Others --- */
                @font-face {font-family: "Ubuntu Mono"; src: ${monoSrc};}
                @font-face {font-family: "Fira Code"; src: ${monoSrc};}
                @font-face {font-family: "Fira Mono"; src: ${monoSrc};}
                @font-face {font-family: "DejaVu Sans Mono"; src: ${monoSrc};}
                @font-face {font-family: "Liberation Mono"; src: ${monoSrc};}
        /* --- Sans --- */
            /* --- Namespace --- */
                @font-face {font-family: "SANS_SPACE"; src: ${sansSrc};}
                @font-face {font-family: "sans-serif"; src: ${sansSrc};}
                @font-face {font-family: "system-ui"; src: ${sansSrc};}
                @font-face {font-family: "ui-sans-serif"; src: ${sansSrc};}
            /* --- Microsoft --- */
                @font-face {font-family: "Trebuchet MS"; src: ${sansSrc};}
                @font-face {font-family: "Tahoma"; src: ${sansSrc};}
                @font-face {font-family: "Verdana"; src: ${sansSrc};}
                @font-face {font-family: "Arial"; src: ${sansSrc};}
                @font-face {font-family: "Segoe UI"; src: ${sansSrc};}
                @font-face {font-family: "Microsoft YaHei"; src: ${sansSrc};}
                @font-face {font-family: "MicrosoftYaHei"; src: ${sansSrc};}
                @font-face {font-family: "Microsoft YaHei UI"; src: ${sansSrc};}
            /* --- Apple --- */
                @font-face {font-family: "Helvetica"; src: ${sansSrc};}
                @font-face {font-family: "Helvetica Neue"; src: ${sansSrc};}
                @font-face {font-family: "HelveticaNeue"; src: ${sansSrc};}
                @font-face {font-family: "Hiragino Sans GB"; src: ${sansSrc};}
                @font-face {font-family: "PingFang SC"; src: ${sansSrc};}
                @font-face {font-family: "PingFangSC"; src: ${sansSrc};}
                @font-face {font-family: "San Francisco Pro"; src: ${sansSrc};}
                @font-face {font-family: "SF Pro"; src: ${sansSrc};}
                @font-face {font-family: "SF Pro Text"; src: ${sansSrc};}
                @font-face {font-family: "SF Pro Display"; src: ${sansSrc};}
                @font-face {font-family: "SFPro-Regular"; src: ${sansSrc};}
                @font-face {font-family: "SFProText-Regular"; src: ${sansSrc};}
                @font-face {font-family: "SFProDisplay-Regular"; src: ${sansSrc};}
                @font-face {font-family: "-apple-system"; src: ${sansSrc};}
                @font-face {font-family: "BlinkMacSystemFont"; src: ${sansSrc};}
            /* --- Google --- */
                @font-face {font-family: "Droid Sans"; src: ${sansSrc};}
                @font-face {font-family: "Roboto"; src: ${sansSrc};}
                @font-face {font-family: "Noto Sans"; src: ${sansSrc};}
            /* --- Adobe --- */
                @font-face {font-family: "Source Sans Pro"; src: ${sansSrc};}
                @font-face {font-family: "Source Sans 3"; src: ${sansSrc};}
            /* --- Others --- */
                @font-face {font-family: "Ubuntu"; src: ${sansSrc};}
                @font-face {font-family: "Fira Sans"; src: ${sansSrc};}
                @font-face {font-family: "DejaVu Sans"; src: ${sansSrc};}
                @font-face {font-family: "Liberation Sans"; src: ${sansSrc};}
                @font-face {font-family: "Open Sans"; src: ${sansSrc};}
                @font-face {font-family: "Cantarell"; src: ${sansSrc};}
        `;

        const currentUrl = window.location.href;
        let additionalStyles = "";

        // 站点优化 
        if (currentUrl.startsWith("https://greasyfork.org/")) {
            additionalStyles += `
                pre { font-family: "MONO_SPACE", monospace !important; }
            `;
        } else if (currentUrl.startsWith("https://chat.qwen.ai/")) {
            additionalStyles += `
                .ͼ1 .cm-scroller { font-family: "MONO_SPACE", monospace !important; }
            `;
        } else if (currentUrl.startsWith("https://cplusplus.com/")) {
            additionalStyles += `
                pre, code, tt, samp, var, dfn, cite, kbd { font-family: "MONO_SPACE", monospace !important; }
            `;
        } else if (currentUrl.startsWith("https://www.cppreference.com/")) {
            additionalStyles += `
                code { font-family: "MONO_SPACE", monospace !important; }
            `;
        } else if (currentUrl.startsWith("https://www.wenxiaobai.com/")) {
            additionalStyles += `
                .markdown-body code *, code { font-family: "MONO_SPACE", monospace !important; }
            `;
        }

        if (additionalStyles) { css += `${additionalStyles}`; }

        css += `
        body {
            -webkit-font-smoothing: subpixel-antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-smoothing: subpixel-antialiased !important;
        }
        `;

        return css;
    }

    const config = loadConfig();
    GM_registerMenuCommand("配置面板", () => createConfigUI(config));
    GM_addStyle(generateCSS(config));
})();