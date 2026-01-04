// ==UserScript==
// @name         NovelAI 计数连续生成
// @namespace    https://novelai.net
// @version      1.5
// @description  更加纯粹。
// @author       Tako
// @match        https://novelai.net/image
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555303/NovelAI%20%E8%AE%A1%E6%95%B0%E8%BF%9E%E7%BB%AD%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/555303/NovelAI%20%E8%AE%A1%E6%95%B0%E8%BF%9E%E7%BB%AD%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loopDelay, loopJitter, imagesToRun, confirmAnlas;
    let isAutoRunning = false;
    let imagesProcessed = 0;

    const anlasXpath = "/html/body/div[2]/div[2]/div[3]/div[3]/div[1]/div[1]/div[5]/button/div/div[1]/span";
    const seedXpath = "/html/body/div[2]/div[2]/div[3]/div[3]/div[1]/div[1]/div[5]/div/div/div/div[3]/button/span";

    let uiContainer, startButton, statusDisplay, hoverTrigger;

    function loadSettings() {
        loopDelay = GM_getValue('nai_ac_loopDelay', 5000);
        loopJitter = GM_getValue('nai_ac_loopJitter', 2000);
        imagesToRun = GM_getValue('nai_ac_imagesToRun', Infinity);
        confirmAnlas = GM_getValue('nai_ac_confirmAnlas', false);
    }

    function saveSettings() {
        GM_setValue('nai_ac_loopDelay', loopDelay);
        GM_setValue('nai_ac_loopJitter', loopJitter);
        GM_setValue('nai_ac_imagesToRun', imagesToRun);
        GM_setValue('nai_ac_confirmAnlas', confirmAnlas);
    }

    function findGenerateButton() {
        const xpath = "//button[span[starts-with(text(), 'Generate') and contains(text(), 'Image')]]";
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    async function waitForGeneration() {
        return new Promise((resolve, reject) => {
            const timeout = 30000;
            const interval = 500;
            let elapsed = 0;
            const id = setInterval(() => {
                elapsed += interval;
                const generateBtn = findGenerateButton();
                if (generateBtn && !generateBtn.disabled) {
                    clearInterval(id);
                    resolve();
                    return;
                }
                if (elapsed >= timeout) {
                    clearInterval(id);
                    reject(new Error(`生成超时 (${timeout / 1000}秒)`));
                }
            }, interval);
        });
    }

    function resetSeed() {
        try {
            let seedSpan = document.evaluate(seedXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (seedSpan) {
                let event = new MouseEvent("click", { bubbles: true, cancelable: true });
                seedSpan.dispatchEvent(event);
                console.log("Seed已重置");
            }
        } catch (e) { console.warn("重置Seed失败", e); }
    }

    function checkAnlas() {
        return new Promise((resolve) => {
            try {
                let anlasNode = document.evaluate(anlasXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (anlasNode && parseInt(anlasNode.innerText, 10) > 0) {
                    if (confirm("你要消耗Anlas进行连点吗？")) resolve(true);
                    else resolve(false);
                } else { resolve(true); }
            } catch (e) {
                console.warn("未检测到Anlas消耗，默认允许执行。");
                resolve(true);
            }
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function startAutomation() {
        if (isAutoRunning) return;
        if (confirmAnlas && !(await checkAnlas())) {
            updateStatus("用户取消");
            return;
        }

        isAutoRunning = true;
        imagesProcessed = 0;
        uiContainer.classList.add('running');
        startButton.innerText = "停止";

        const initialBtn = findGenerateButton();
        if (!initialBtn) {
             updateStatus("错误: 未找到按钮", 'error');
             stopAutomation();
             return;
        }

        if (initialBtn.disabled) {
            updateStatus("等待当前生成...");
            try {
                await waitForGeneration(); // 等待当前正在进行的生成
                resetSeed(); // 重置 seed 准备开始循环
            } catch (error) {
                console.error('连点器启动时等待失败:', error);
                updateStatus(`错误: ${error.message}`, 'error');
                stopAutomation();
                return;
            }
        }

        updateStatus("启动中...");

        for (let i = 1; (i <= imagesToRun || imagesToRun === Infinity); i++) {
            if (!isAutoRunning) {
                updateStatus("已停止");
                break;
            }

            imagesProcessed = i;
            let countDisplay = imagesToRun === Infinity ? '∞' : imagesToRun;
            updateStatus(`生成中: ${i}/${countDisplay}`);

            try {
                let generateButton = findGenerateButton();
                if (!generateButton) throw new Error('生成按钮消失');

                if (generateButton.disabled) {
                    updateStatus("按钮占用, 等待中...");
                    await waitForGeneration();
                    generateButton = findGenerateButton(); // 重新获取
                    if (!generateButton || generateButton.disabled) {
                        throw new Error('按钮持续占用');
                    }
                }
                generateButton.click();
                await waitForGeneration();
                resetSeed();

                if (i < imagesToRun || imagesToRun === Infinity) {
                    let randomJitter = (Math.random() * 2 - 1) * loopJitter;
                    let waitTime = Math.max(500, loopDelay + randomJitter);
                    let waited = 0;
                    while (waited < waitTime && isAutoRunning) {
                        updateStatus(`等待: (${(waited / 1000).toFixed(1)}s / ${(waitTime / 1000).toFixed(1)}s)`);
                        await sleep(250);
                        waited += 250;
                    }
                }
            } catch (error) {
                console.error('连点器生成失败:', error);
                updateStatus(`错误: ${error.message}`, 'error');
                stopAutomation();
                break;
            }
        }

        if (isAutoRunning) {
            stopAutomation();
            updateStatus(`完成: ${imagesProcessed} 张`);
        }
    }

    function stopAutomation() {
        isAutoRunning = false;
        uiContainer.classList.remove('running');
        startButton.innerText = "启动";
        if (!statusDisplay.innerText.includes("错误")) {
            updateStatus("已停止");
        }
    }

    function toggleAutomation() {
        if (isAutoRunning) {
            stopAutomation();
        } else {
            try {
                loopDelay = parseFloat(document.getElementById('nai-ac-delay').value) * 1000 || 5000;
                loopJitter = parseFloat(document.getElementById('nai-ac-jitter').value) * 1000 || 2000;
                let imagesInput = parseInt(document.getElementById('nai-ac-images').value, 10);
                imagesToRun = (!isNaN(imagesInput) && imagesInput > 0) ? imagesInput : Infinity;
                confirmAnlas = document.getElementById('nai-ac-confirm').checked;

                saveSettings();

            } catch(e) { console.error("读取设置失败", e); }
            startAutomation();
        }
    }

    function updateStatus(text, type = 'info') {
        if (statusDisplay) {
            statusDisplay.innerText = text;
            statusDisplay.style.color = type === 'error' ? '#FF6B6B' : 'rgb(245, 243, 194)';
        }
    }

    function createUI() {
        uiContainer = document.createElement('div');
        uiContainer.id = 'nai-auto-clicker-container';

        hoverTrigger = document.createElement('div');
        hoverTrigger.id = 'nai-ac-hover-trigger';
        hoverTrigger.innerHTML = '▶';
        uiContainer.appendChild(hoverTrigger);

        const menu = document.createElement('div');
        menu.id = 'nai-ac-menu';
        statusDisplay = document.createElement('div');
        statusDisplay.id = 'nai-ac-status';
        statusDisplay.innerText = "就绪";
        menu.appendChild(statusDisplay);

        menu.appendChild(createInputGroup('nai-ac-delay', '延迟 (s):', (loopDelay / 1000)));
        menu.appendChild(createInputGroup('nai-ac-jitter', '抖动 (±s):', (loopJitter / 1000)));
        menu.appendChild(createInputGroup('nai-ac-images', '张数:', imagesToRun === Infinity ? '' : imagesToRun, '留空无限'));
        menu.appendChild(createCheckboxGroup('nai-ac-confirm', '消耗前确认', confirmAnlas));

        startButton = document.createElement('button');
        startButton.id = 'nai-ac-start-btn';
        startButton.innerText = '启动';
        startButton.onclick = toggleAutomation;
        menu.appendChild(startButton);
        uiContainer.appendChild(menu);

        document.body.appendChild(uiContainer);

        let initX, containerX;
        hoverTrigger.addEventListener("mousedown", function (e) {
            e.preventDefault();
            initX = e.pageX;
            containerX = uiContainer.offsetLeft;
            if (e.target !== hoverTrigger) return;
            hoverTrigger.classList.add('grabbing');
            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        });
        function mouseMoveHandler(e) {
            let moveX = e.pageX - initX;
            let newLeft = containerX + moveX;
            if (newLeft < 0) newLeft = 0;
            if (newLeft > window.innerWidth - uiContainer.offsetWidth) {
                newLeft = window.innerWidth - uiContainer.offsetWidth;
            }
            uiContainer.style.left = newLeft + "px";
            uiContainer.style.right = 'auto';
        }
        function mouseUpHandler() {
            hoverTrigger.classList.remove('grabbing');
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        }

        let hideMenuTimer;
        uiContainer.addEventListener('mouseenter', () => {
            clearTimeout(hideMenuTimer);
            menu.style.display = 'block';
        });
        uiContainer.addEventListener('mouseleave', () => {
            hideMenuTimer = setTimeout(() => {
                menu.style.display = 'none';
            }, 200);
        });
    }

    function createInputGroup(id, labelText, defaultValue, placeholder = '') {
        const group = document.createElement('div');
        group.className = 'nai-ac-input-group';
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerText = labelText;
        group.appendChild(label);
        const input = document.createElement('input');
        input.type = 'number';
        input.id = id;
        input.value = defaultValue;
        input.placeholder = placeholder;
        group.appendChild(input);
        return group;
    }

    function createCheckboxGroup(id, labelText, isChecked) {
        const group = document.createElement('div');
        group.className = 'nai-ac-input-group nai-ac-checkbox-group';
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerText = labelText;
        label.style.cursor = 'pointer';
        group.appendChild(label);
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.checked = isChecked;
        group.appendChild(input);
        return group;
    }


    function addStyles() {
        GM_addStyle(`
            @keyframes nai-ac-spin-border {
                0% { border-color: rgb(245, 243, 194) transparent transparent transparent; }
                25% { border-color: transparent rgb(245, 243, 194) transparent transparent; }
                50% { border-color: transparent transparent rgb(245, 243, 194) transparent; }
                75% { border-color: transparent transparent transparent rgb(245, 243, 194); }
                100% { border-color: rgb(245, 243, 194) transparent transparent transparent; }
            }

            #nai-auto-clicker-container {
                position: fixed;
                bottom: 0;
                left: 30%;
                z-index: 9999;
                font-family: 'Source Sans Pro', sans-serif;
                user-select: none;
            }

            #nai-ac-hover-trigger {
                width: 42px; height: 42px;
                background-color: rgb(34, 37, 63);
                border: 2px solid #555;
                border-bottom: none;
                border-radius: 8px 8px 0 0;
                color: rgb(245, 243, 194);
                display: flex; align-items: center; justify-content: center;
                cursor: grab;
                font-size: 15px; box-sizing: border-box;
            }

            #nai-ac-hover-trigger.grabbing {
                cursor: grabbing;
            }

            #nai-auto-clicker-container.running #nai-ac-hover-trigger {
                border-width: 2px; border-style: solid;
                animation: nai-ac-spin-border 1.2s linear infinite;
            }

            #nai-ac-menu {
                display: none;
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 180px; padding: 12px;
                background-color: rgb(34, 37, 63);
                border: 1px solid #555; border-radius: 8px;
                box-shadow: -5px -5px 15px rgba(0,0,0,0.3);
            }

            /* 移除: CSS HOVER 规则，改用 JS 控制 */
            /*
            #nai-auto-clicker-container:hover #nai-ac-menu {
                 display: block;
                 left: 50%;
                 transform: translateX(-50%);
            }
            */

            #nai-ac-status {
                color: rgb(245, 243, 194); font-size: 14px;
                text-align: center; margin-bottom: 10px;
                border-bottom: 1px solid #555; padding-bottom: 8px;
                min-height: 1.2em;
            }

            .nai-ac-input-group {
                display: flex; justify-content: space-between;
                align-items: center; margin-bottom: 8px;
            }
            .nai-ac-input-group label {
                color: #DDD; font-size: 13px; margin-right: 5px;
            }
            .nai-ac-input-group input {
                width: 80px; background-color: rgb(20, 22, 40);
                color: white; border: 1px solid #555;
                border-radius: 4px; padding: 4px 6px; font-size: 13px;
                -moz-appearance: textfield;
            }
            .nai-ac-input-group input::-webkit-inner-spin-button,
            .nai-ac-input-group input::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }

            .nai-ac-checkbox-group input[type="checkbox"] {
                width: 16px; height: 16px; margin: 0;
                padding: 0; cursor: pointer;
                accent-color: rgb(111, 128, 255);
            }

            #nai-ac-start-btn {
                width: 100%; padding: 8px; margin-top: 5px;
                background-color: rgb(111, 128, 255); color: white;
                border: none; border-radius: 4px; cursor: pointer;
                font-weight: bold; font-size: 14px;
            }
            #nai-ac-start-btn:hover { background-color: rgb(130, 145, 255); }
            #nai-auto-clicker-container.running #nai-ac-start-btn {
                 background-color: #FF6B6B;
            }
        `);
    }

    loadSettings();
    addStyles();
    createUI();

})();