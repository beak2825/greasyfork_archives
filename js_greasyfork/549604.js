// ==UserScript==
// @name         等宽字体替换增强器
// @namespace    https://greasyfork.org/scripts/549604
// @description  替换网页的等宽字体。可根据需求修改脚本中的字体设置。使用前需确保已安装所需字体。
// @version      11.0.1
// @license      Apache License 2.0
// @author       Ckrvxr
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @homepageURL  https://greasyfork.org/zh-CN/scripts/549604
// @downloadURL https://update.greasyfork.org/scripts/549604/%E7%AD%89%E5%AE%BD%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549604/%E7%AD%89%E5%AE%BD%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    "use strict";

    const defaultConfig = {mono_latin: ["Cascadia Next SC", "Cascadia Code", "SF Mono"],};

    function loadConfig() {
        return {
            mono_latin: GM_getValue("mono_latin", defaultConfig.mono_latin),
        };
    }

    function saveConfig(config) {
        GM_setValue("mono_latin", config.mono_latin);
    }

    function createConfigUI(config) {
        if (document.getElementById('font-config-panel')) return;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflowX = "hidden";
        document.documentElement.style.overflowY = "hidden";

        const panel = document.createElement("div");
        panel.id = "font-config-panel";
        panel.style.cssText = `
            z-index: 999999;
            position: fixed;
            inset: 0;
            background: #ffffff;
            overflow-y: auto;
            padding: 4rem;
            font-family: sans-serif;
        `;

        const title = document.createElement("h1");
        title.textContent = "等宽字体替换增强器 · 配置面板";
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

            config[type].forEach((value, index) => {
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
                if (importedConfig.mono_latin && Array.isArray(importedConfig.mono_latin)) {
                    config.mono_latin = [...importedConfig.mono_latin];
                    saveConfig(config);
                    alert("导入成功：请刷新页面生效");
                    closePanel();
                } else {
                    alert("导入失败：配置文件格式不正确");
                }
            } catch (e) {
                console.error("导入配置失败:", e);
                alert("导入失败：无效的配置文件或读取错误");
            }
        };

        const exportBtn = createButton("导出配置", colorSchemes.secondary);
        exportBtn.onclick = () => {
            const blob = new Blob([JSON.stringify({ mono_latin: config.mono_latin }, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "monospace-font-config.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        const resetBtn = createButton("重置默认", colorSchemes.danger);
        resetBtn.onclick = () => {
            if (confirm("确定要重置等宽字体配置为默认值吗？")) {
                config.mono_latin = [...defaultConfig.mono_latin];
                saveConfig(config);
                alert("重置成功：请刷新页面生效");
                closePanel();
            }
        };

        const saveBtn = createButton("保存配置", colorSchemes.success);
        saveBtn.onclick = () => {
            const inputs = panel.querySelectorAll("input[data-type='mono_latin']");
            inputs.forEach((input) => {
                const index = parseInt(input.dataset.index, 10);
                if (!isNaN(index)) {
                    config.mono_latin[index] = input.value.trim();
                }
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
        const [mono_latin_1, mono_latin_2, mono_latin_3] = config.mono_latin;

        let css = `
        @font-face {font-family: "MONO_SPACE"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "monospace"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Monaco"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Consolas"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Courier"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Courier New"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Andale Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Ubuntu Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Fira Code"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Fira Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "DejaVu Sans Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Liberation Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Source Code Pro"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "Menlo"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "San Francisco Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "SF Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        @font-face {font-family: "SFMono-Regular"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}");}
        `;

        const currentUrl = window.location.href;
        let additionalStyles = "";

        if (currentUrl.startsWith("https://greasyfork.org/")) {
            additionalStyles += `
                pre {
                    font-family: "MONO_SPACE", monospace !important;
                }
            `;
        } else if (currentUrl.startsWith("https://chat.qwen.ai/")) {
            additionalStyles += `
                .ͼ1 .cm-scroller {
                    font-family: "MONO_SPACE", monospace !important;
                }
            `;
        } else if (currentUrl.startsWith("https://cplusplus.com/")) {
            additionalStyles += `
                pre, code, tt, samp, var, dfn, cite, kbd {
                    font-family: "MONO_SPACE", monospace !important;
                }
            `;
        } else if (currentUrl.startsWith("https://www.cppreference.com/")) {
            additionalStyles += `
                code {
                    font-family: "MONO_SPACE", monospace !important;
                }
            `;
        } else if (currentUrl.startsWith("https://www.wenxiaobai.com/")) {
            additionalStyles += `
                .markdown-body code *,
                code {
                    font-family: "MONO_SPACE", monospace !important;
                }
            `;
        }

        if (additionalStyles) {css += `${additionalStyles}`;}

        css += `
        body {
            -webkit-font-smoothing: subpixel-antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-smoothing: antialiased !important;
        }
        `;

        return css;
    }

    const config = loadConfig();
    GM_registerMenuCommand("配置面板", () => createConfigUI(config));
    GM_addStyle(generateCSS(config));
})();