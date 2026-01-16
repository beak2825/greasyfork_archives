// ==UserScript==
// @name     Gemini Model Switcher
// @namespace     lenor_tamp_code
// @version     8.0
// @description     将Gemini的切换不同模型并点击发送按钮集成为独立的三个按钮。只需点一下鼠标，即可使用自己想要的模型发送，增加快速切换模型的便捷性。
// @author     Lenor
// @match     https://gemini.google.com/*
// @website      https://github.com/LenorEric/Gemini-Model-Button
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/562721/Gemini%20Model%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/562721/Gemini%20Model%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_TEXTS = {
        fast: "Answers quickly",
        thinking: "Solves complex problems",
        pro: "Thinks longer for advanced math & code"
    };

    const TARGET_NAME = {
        fast: "Fast",
        thinking: "Thinking",
        pro: "Pro"
    };

    function getEl(xpath, context = document) {
        return document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    async function switchAndSend(modelKey) {
        const targetText = TARGET_TEXTS[modelKey];
        const targetName = TARGET_NAME[modelKey];
        console.log(`[GeminiScript] 准备切换到: ${targetName}`);

        const targetXpath = `//*[text()='${targetName}']`;
        const currentModel = getEl(targetXpath);
        if (currentModel && currentModel.tagName === "SPAN") {
            console.log("[GeminiScript] 已经是这个模型了喵");
        } else {
            const switcherBtn = getEl("//bard-mode-switcher//button");
            if (!switcherBtn) {
                console.error("[GeminiScript] 找不到菜单触发按钮");
                return;
            }

             switcherBtn.click();

            // await new Promise(r => setTimeout(r, 50));

            const itemXpath = `//*[normalize-space(text())='${targetText}']`;
            const menuOption = getEl(itemXpath);

            if (menuOption) {
                console.log(`[GeminiScript] 找到菜单项，点击中...`);
                menuOption.click();
            } else {
                console.error(`[GeminiScript] 未找到文字为 "${targetText}" 的菜单项，请检查文字是否完全匹配`);
                switcherBtn.click();
                return;
            }

            // await new Promise(r => setTimeout(r, 50));
        }

       
        let sendBtn = getEl("//button[contains(@aria-label, 'Send')]") ||
                      getEl("//button[@aria-label='发送']") ||
                      getEl("//button[contains(@class, 'send-button')]");

        if (!sendBtn) {
            console.log(`[GeminiScript] 第一次的button不对`);
             sendBtn = getEl("//input-area-v2//div[contains(@class, 'input-area-container')]//button[not(@disabled)]");
        }

        if (sendBtn) {
            console.log(`[GeminiScript] 点击发送`);
            sendBtn.click();
        } else {
            console.error("[GeminiScript] 找不到发送按钮");
        }
    }

    function injectUI() {
        if (document.getElementById('gemini-vertical-switcher')) return;

        const inputArea = getEl("//input-area-v2");
        if (!inputArea) return;

        if (getComputedStyle(inputArea).position === 'static') {
            inputArea.style.position = 'relative';
        }
        inputArea.style.overflow = 'visible';

        const container = document.createElement('div');
        container.id = 'gemini-vertical-switcher';
        container.style.position = 'absolute';
        container.style.right = '-100px';
        container.style.bottom = '0px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';
        container.style.zIndex = '100';

        const createBtn = (label, key, colorStart, colorEnd) => {
            const btn = document.createElement('button');
            btn.innerText = label;

            btn.style.width = '80px';
            btn.style.height = '38px';
            btn.style.background = `linear-gradient(135deg, ${colorStart}, ${colorEnd})`;
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '12px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '12px';
            btn.style.fontWeight = '550';
            btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
            btn.style.transition = 'transform 0.1s, box-shadow 0.1s';
            btn.style.fontFamily = '"Google Sans", Roboto, Arial, sans-serif';

            btn.onmouseover = () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 8px rgba(0,0,0,0.3)';
            };
            btn.onmouseout = () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
            };

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = 'translateY(-2px)', 100);
                switchAndSend(key);
            };

            return btn;
        };

        container.appendChild(createBtn('Fast', 'fast', '#34a853', '#2e8b46'));
        container.appendChild(createBtn('Thinking', 'thinking', '#4285f4', '#3367d6'));
        container.appendChild(createBtn('Pro', 'pro', '#9c27b0', '#7b1fa2'));

        inputArea.appendChild(container);
    }

    const observer = new MutationObserver((mutations) => {
        injectUI();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(injectUI, 1500);

})();