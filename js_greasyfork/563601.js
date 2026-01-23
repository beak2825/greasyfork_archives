// ==UserScript==
// @name         Google AI Studio 聊天记录markdown导出器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动滚动 Google AI Studio 聊天界面，捕获用户消息、AI 思维链和 AI 回答，导出为 MD 文件。已修复网站更新所导致的问题。按钮已移至左下角并可隐藏。
// @author       Elliott Zheng & pipdax & Gemini  
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwNzhmZiI+PHBhdGggZD0iTTE5LjUgMi4yNWgtMTVjLTEuMjQgMC0yLjI1IDEuMDEtMi4yNSAyLjI1djE1YzAgMS4yNCAxLjAxIDIuMjUgMi4yNSAyLjI1aDE1YzEuMjQgMCAyLjI1LTEuMDEgMi4yNS0yLjI1di0xNWMwLTEuMjQtMS4wMS0yLjI1LTIuMjUtMi4yNXptLTIuMjUgNmgtMTAuNWMtLjQxIDAtLjc1LS4zNC0uNzUtLjc1cy4zNC0uNzUuNzUtLjc1aDEwLjVjLjQxIDAgLjc1LjM0Ljc1Ljc1cy0uMzQuNzUtLjc1Ljc1em0wIDRoLTEwLjVjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWgxMC41Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS4yNS43NXptLTMgNGgtNy41Yy0uNDEgMC0uNzUtLjM0LS43NS0uNzVzLjM0LS43NS43NS0uNzVoNy41Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS43NS43NXoiLz48L3N2Zz4=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563601/Google%20AI%20Studio%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95markdown%E5%AF%BC%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563601/Google%20AI%20Studio%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95markdown%E5%AF%BC%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置常量 ---
    const buttonTextStartScroll = "滚动导出MD";
    const buttonTextStopScroll = "停止滚动";
    const buttonTextProcessingScroll = "处理滚动数据...";
    const successTextScroll = "滚动导出 MD 成功!";
    const errorTextScroll = "滚动导出失败";

    const exportTimeout = 3000;
    // 【修改】移除了旧的 EXPORT_FILENAME_PREFIX 常量

    const SCROLL_DELAY_MS = 1000;
    const MAX_SCROLL_ATTEMPTS = 300;
    const SCROLL_INCREMENT_FACTOR = 0.85;
    const SCROLL_STABILITY_CHECKS = 3;

    // --- 脚本内部状态变量 ---
    let isScrolling = false;
    let collectedData = new Map();
    let scrollCount = 0;
    let noChangeCounter = 0;

    // --- UI 界面元素变量 ---
    let captureButtonScroll = null;
    let stopButtonScroll = null;
    let statusDiv = null;
    let hideButton = null;
    let buttonContainer = null;

    // --- 辅助工具函数 ---
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function clickButtonsWithDelay() {
        const xpath1 = '/html/body/app-root/ms-app/div/div/div[3]/div/span/ms-prompt-renderer/ms-chunk-editor/section/ms-toolbar/div/div[2]/div/button';
        const xpath2 = '/html/body/div[1]/div/div[2]/div/div/button[last()]';

        const btn1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        

        if (!btn1) {
            console.error('未找到第一个按钮:', xpath1);
            return;
        }
        

        btn1.click();
        console.log('已点击第一个按钮');

        setTimeout(() => {
            const btn2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!btn2) {
            console.error('未找到第二个按钮:', xpath2);
                return;
            }
            btn2.click();
            console.log('已点击第二个按钮');
        }, 500);
    }

    function getCurrentTimestamp() {
        const n = new Date();
        const YYYY = n.getFullYear();
        const MM = (n.getMonth() + 1).toString().padStart(2, '0');
        const DD = n.getDate().toString().padStart(2, '0');
        const hh = n.getHours().toString().padStart(2, '0');
        const mm = n.getMinutes().toString().padStart(2, '0');
        const ss = n.getSeconds().toString().padStart(2, '0');
        return `${YYYY}${MM}${DD}_${hh}${mm}${ss}`;
    }

    /**
     * 【修改】新增函数，用于从页面获取项目名称
     * @param {boolean} clean - 是否清理文件名中的无效字符，默认为 true
     * @returns {string} - 项目名称，或一个默认名称
     */
    function getProjectName(clean = true) {
        const xpath = "/html/body/app-root/ms-app/div/div/div[3]/div/span/ms-prompt-renderer/ms-chunk-editor/section/ms-toolbar/div/div[1]/div/div/h1";
        const defaultName = "AI_Studio_Chat";
        try {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const titleElement = result.singleNodeValue;
            if (titleElement && titleElement.textContent) {
                let name = titleElement.textContent.trim();
                if (clean) {
                    name = name.replace(/[\\/:\*\?"<>\|]/g, '_');
                }
                console.log("成功获取项目名称: ", name);
                return name || defaultName;
            } else {
                console.warn(`警告: 未能通过XPath找到项目名称元素。将使用默认名称: "${defaultName}"`);
                return defaultName;
            }
        } catch (e) {
            console.error("通过XPath获取项目名称时出错: ", e);
            return defaultName;
        }
    }


    function getMainScrollerElement_AiStudio() {
        console.log("尝试查找滚动容器 (用于滚动导出)...");
        let scroller = document.querySelector('.chat-scrollable-container');
        if (scroller && scroller.scrollHeight > scroller.clientHeight) {
            console.log("找到滚动容器 (策略 1: .chat-scrollable-container):", scroller);
            return scroller;
        }
        scroller = document.querySelector('mat-sidenav-content');
        if (scroller && scroller.scrollHeight > scroller.clientHeight) {
            console.log("找到滚动容器 (策略 2: mat-sidenav-content):", scroller);
            return scroller;
        }
        const chatTurnsContainer = document.querySelector('ms-chat-turn')?.parentElement;
        if (chatTurnsContainer) {
            let parent = chatTurnsContainer;
            for (let i = 0; i < 5 && parent; i++) {
                if (parent.scrollHeight > parent.clientHeight + 10 &&
                    (window.getComputedStyle(parent).overflowY === 'auto' || window.getComputedStyle(parent).overflowY === 'scroll')) {
                    console.log("找到滚动容器 (策略 3: 向上查找父元素):", parent);
                    return parent;
                }
                parent = parent.parentElement;
            }
        }
        console.warn("警告 (滚动导出): 未能通过特定选择器精确找到 AI Studio 滚动区域，将尝试使用 document.documentElement。如果滚动不工作，请按F12检查聊天区域的HTML结构，并更新此函数内的选择器。");
        return document.documentElement;
    }


    // --- UI 界面创建与更新 ---
    function createUI() {
        console.log("开始创建 UI 元素...");

        buttonContainer = document.createElement('div');
        buttonContainer.id = 'exporter-button-container';
        buttonContainer.style.cssText = `position: fixed; bottom: 30%; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;`;
        document.body.appendChild(buttonContainer);

        captureButtonScroll = document.createElement('button');
        captureButtonScroll.textContent = buttonTextStartScroll;
        captureButtonScroll.id = 'capture-chat-scroll-button';
        captureButtonScroll.style.cssText = `padding: 10px 15px; background-color: #1a73e8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease;`;
        captureButtonScroll.addEventListener('click', handleScrollExtraction);
        buttonContainer.appendChild(captureButtonScroll);

        stopButtonScroll = document.createElement('button');
        stopButtonScroll.textContent = buttonTextStopScroll;
        stopButtonScroll.id = 'stop-scrolling-button';
        stopButtonScroll.style.cssText = `padding: 10px 15px; background-color: #d93025; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); display: none; transition: background-color 0.3s ease;`;
        stopButtonScroll.addEventListener('click', () => {
            if (isScrolling) {
                updateStatus('手动停止滚动信号已发送...');
                isScrolling = false;
                stopButtonScroll.disabled = true;
                stopButtonScroll.textContent = '正在停止...';
            }
        });
        buttonContainer.appendChild(stopButtonScroll);

        hideButton = document.createElement('button');
        hideButton.textContent = '👁️';
        hideButton.id = 'hide-exporter-buttons';
        hideButton.style.cssText = `position: fixed; bottom: calc(30% + 90px); left: 20px; z-index: 10000; padding: 5px 8px; background-color: rgba(0, 0, 0, 0.3); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px;`;
        hideButton.addEventListener('click', () => {
            const isHidden = buttonContainer.style.display === 'none';
            buttonContainer.style.display = isHidden ? 'flex' : 'none';
            hideButton.textContent = isHidden ? '👁️' : '🙈';
        });
        document.body.appendChild(hideButton);


        statusDiv = document.createElement('div');
        statusDiv.id = 'extract-status-div';
        statusDiv.style.cssText = `position: fixed; bottom: 30%; left: 200px; z-index: 9998; padding: 5px 10px; background-color: rgba(0,0,0,0.7); color: white; font-size: 12px; border-radius: 3px; display: none;`;
        document.body.appendChild(statusDiv);

        GM_addStyle(`
                  #capture-chat-scroll-button:disabled, #stop-scrolling-button:disabled {
                      opacity: 0.6; cursor: not-allowed; background-color: #aaa !important;
                  }
                   #capture-chat-scroll-button.success { background-color: #1e8e3e !important; }
                   #capture-chat-scroll-button.error { background-color: #d93025 !important; }
        `);
        console.log("UI 元素创建完成。");
    }

    function updateStatus(message) {
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.display = message ? 'block' : 'none';
        }
        console.log(`[Status] ${message}`);
    }


    // --- 核心业务逻辑 (滚动导出) ---
    function extractDataIncremental_AiStudio() {
        let newlyFoundCount = 0;
        let dataUpdatedInExistingTurn = false;
        const currentTurns = document.querySelectorAll('ms-chat-turn');

        currentTurns.forEach((turn, index) => {
            const turnKey = turn;
            const turnContainer = turn.querySelector('.chat-turn-container.user, .chat-turn-container.model');
            if (!turnContainer) {
                return;
            }

            let isNewTurn = !collectedData.has(turnKey);
            let extractedInfo = collectedData.get(turnKey) || {
                domOrder: index, type: 'unknown', userText: null, responseText: null
            };
            if (isNewTurn) {
                collectedData.set(turnKey, extractedInfo);
                newlyFoundCount++;
            }

            let dataWasUpdatedThisTime = false;

            if (turnContainer.classList.contains('user')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'user';
                if (!extractedInfo.userText) {
                    let userText = null;
                    
                    const turnContent = turn.querySelector('.turn-content');
                    if (turnContent) {
                        const selectors = [
                            '.ms-prompt-chunk ms-cmark-node',
                            'ms-prompt-chunk ms-cmark-node',
                            'ms-cmark-node',
                            '.ms-cmark-node',
                            'ms-text-chunk',
                            '.ms-text-chunk'
                        ];
                        
                        for (const selector of selectors) {
                            const node = turnContent.querySelector(selector);
                            if (node) {
                                const text = node.innerText.trim();
                                if (text && text.length > 0) {
                                    userText = text;
                                    console.log(`[用户文本提取] 成功使用选择器: ${selector}, 文本长度: ${text.length}`);
                                    break;
                                }
                            }
                        }
                        
                        if (!userText) {
                            const allText = turnContent.innerText.trim();
                            if (allText && allText.length > 0) {
                                userText = allText;
                                console.log(`[用户文本提取] 使用innerText, 文本长度: ${allText.length}`);
                            }
                        }
                    }
                    
                    if (userText) {
                        extractedInfo.userText = userText;
                        dataWasUpdatedThisTime = true;
                    } else {
                        console.warn(`[用户文本提取] 未能提取用户文本, turn ID: ${turn.id}`);
                    }
                }
            } else if (turnContainer.classList.contains('model')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'model';

                // Check if this turn has thought panels
                const hasThoughtPanel = turn.querySelector('.thought-panel') !== null;

                if (!extractedInfo.responseText) {
                    const responseChunks = Array.from(turn.querySelectorAll('.turn-content > ms-prompt-chunk'));
                    const responseTexts = responseChunks
                    .filter(chunk => !chunk.querySelector('.thought-panel'))
                    .map(chunk => {
                        const cmarkNode = chunk.querySelector('ms-cmark-node');
                        return cmarkNode ? cmarkNode.innerText.trim() : chunk.innerText.trim();
                    })
                    .filter(text => text && 
                        text !== 'Thoughts' && 
                        text !== 'Expand to view model thoughts' && 
                        text !== 'chevron_right' &&
                        text.trim().length > 0 &&
                        !text.includes('material-symbols-outlined'));

                    if (responseTexts.length > 0) {
                        extractedInfo.responseText = responseTexts.join('\n\n');
                        dataWasUpdatedThisTime = true;
                    }
                }

                // If this turn only has thought panels and no response, skip it
                if (hasThoughtPanel && !extractedInfo.responseText) {
                    collectedData.delete(turnKey);
                    return;
                }

                if (dataWasUpdatedThisTime) {
                    if (extractedInfo.responseText) extractedInfo.type = 'model_reply';
                }
            }

            if (dataWasUpdatedThisTime) {
                collectedData.set(turnKey, extractedInfo);
                dataUpdatedInExistingTurn = true;
            }
        });

        const userTurns = Array.from(collectedData.values()).filter(item => item.type === 'user');
        const userTurnsWithText = userTurns.filter(item => item.userText);
        const userTurnsWithoutText = userTurns.filter(item => !item.userText);
        
        console.log(`[提取统计] 总回合数: ${collectedData.size}, 用户回合: ${userTurns.length}, 有文本: ${userTurnsWithText.length}, 无文本: ${userTurnsWithoutText.length}`);
        
        if (currentTurns.length > 0 && collectedData.size === 0) {
            console.warn("警告(滚动导出): 页面上存在聊天回合 (ms-chat-turn)，但未能提取任何数据。CSS选择器可能已完全失效，请按F12检查并更新 extractDataIncremental_AiStudio 函数中的选择器。");
            updateStatus(`警告: 无法从聊天记录中提取数据，请检查脚本！`);
        } else {
            updateStatus(`滚动 ${scrollCount}/${MAX_SCROLL_ATTEMPTS}... 已收集 ${collectedData.size} 条记录...`);
        }

        return newlyFoundCount > 0 || dataUpdatedInExistingTurn;
    }

    async function autoScrollDown_AiStudio() {
        console.log("启动自动滚动 (滚动导出)...");
        isScrolling = true; collectedData.clear(); scrollCount = 0; noChangeCounter = 0;
        const scroller = getMainScrollerElement_AiStudio();
        if (!scroller) {
            updateStatus('错误 (滚动): 找不到滚动区域!');
            alert('未能找到聊天记录的滚动区域，无法自动滚动。请检查脚本中的选择器。');
            isScrolling = false; return false;
        }
        console.log('使用的滚动元素 (滚动导出):', scroller);
        const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
        const getScrollTop = () => isWindowScroller ? window.scrollY : scroller.scrollTop;
        const getScrollHeight = () => isWindowScroller ? document.documentElement.scrollHeight : scroller.scrollHeight;
        const getClientHeight = () => isWindowScroller ? window.innerHeight : scroller.clientHeight;
        updateStatus(`开始增量滚动 (最多 ${MAX_SCROLL_ATTEMPTS} 次)...`);
        let lastScrollHeight = -1;

        while (scrollCount < MAX_SCROLL_ATTEMPTS && isScrolling) {
            const currentScrollTop = getScrollTop(); const currentScrollHeight = getScrollHeight(); const currentClientHeight = getClientHeight();
            if (currentScrollHeight === lastScrollHeight) { noChangeCounter++; } else { noChangeCounter = 0; }
            lastScrollHeight = currentScrollHeight;
            if (noChangeCounter >= SCROLL_STABILITY_CHECKS && currentScrollTop + currentClientHeight >= currentScrollHeight - 20) {
                console.log("滚动条疑似触底 (滚动导出)，停止滚动。");
                updateStatus(`滚动完成 (疑似触底)。`);
                break;
            }
            if (currentScrollTop === 0 && scrollCount > 10) {
                console.log("滚动条返回顶部 (滚动导出)，停止滚动。");
                updateStatus(`滚动完成 (返回顶部)。`);
                break;
            }
            const targetScrollTop = currentScrollTop + (currentClientHeight * SCROLL_INCREMENT_FACTOR);
            if (isWindowScroller) { window.scrollTo({ top: targetScrollTop, behavior: 'smooth' }); } else { scroller.scrollTo({ top: targetScrollTop, behavior: 'smooth' }); }
            scrollCount++;
            updateStatus(`滚动 ${scrollCount}/${MAX_SCROLL_ATTEMPTS}... 等待 ${SCROLL_DELAY_MS}ms... (已收集 ${collectedData.size} 条)`);
            await delay(SCROLL_DELAY_MS);
            extractDataIncremental_AiStudio();
            if (!isScrolling) { console.log("检测到手动停止信号 (滚动导出)，退出滚动循环。"); break; }
        }

        if (!isScrolling && scrollCount < MAX_SCROLL_ATTEMPTS) {
            updateStatus(`滚动已手动停止 (共 ${scrollCount} 次尝试)。`);
        } else if (scrollCount >= MAX_SCROLL_ATTEMPTS) {
            updateStatus(`滚动停止: 已达到最大尝试次数 (${MAX_SCROLL_ATTEMPTS})。`);
        }
        isScrolling = false;
        return true;
    }

    function formatAndTriggerDownloadScroll() {
        updateStatus(`处理 ${collectedData.size} 条滚动记录并生成文件...`);
        const finalTurnsInDom = document.querySelectorAll('ms-chat-turn');
        let sortedData = [];
        finalTurnsInDom.forEach(turnNode => {
            if (collectedData.has(turnNode)) {
                sortedData.push(collectedData.get(turnNode));
            }
        });

        if (sortedData.length === 0) {
            updateStatus('没有收集到任何有效滚动记录。');
            alert('滚动结束后未能收集到任何聊天记录，无法导出。请检查脚本中的CSS选择器是否与当前网站匹配。');
            captureButtonScroll.textContent = buttonTextStartScroll; captureButtonScroll.disabled = false;
            captureButtonScroll.classList.remove('success', 'error'); updateStatus('');
            return;
        }

        const userTurns = sortedData.filter(item => item.type === 'user');
        const userTurnsWithText = userTurns.filter(item => item.userText);
        const userTurnsWithoutText = userTurns.filter(item => !item.userText);
        
        console.log(`[导出前统计] 总回合: ${sortedData.length}, 用户回合: ${userTurns.length}, 有文本: ${userTurnsWithText.length}, 无文本: ${userTurnsWithoutText.length}`);
        
        if (userTurnsWithoutText.length > 0) {
            console.warn(`[警告] 有 ${userTurnsWithoutText.length} 个用户回合未能提取文本内容。请按F12查看控制台日志了解详情。`);
        }

        const projectName = getProjectName();
        const originalProjectName = getProjectName(false);
        let fileContent = `${originalProjectName}\n=========================================\n\n`;
        sortedData.forEach((item, idx) => {
            let turnContent = "";
            if (item.type === 'user' && item.userText) {
                turnContent += `--- 用户 ---\n${item.userText}\n\n`;
            } else if (item.type === 'model_reply' && item.responseText) {
                turnContent += `--- AI 回答 ---\n${item.responseText}\n\n`;
            }
            if (turnContent) {
                fileContent += turnContent.trim() + "\n\n------------------------------\n\n";
            }
        });
        fileContent = fileContent.replace(/\n\n------------------------------\n\n$/, '\n').trim();

        try {
            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            // 【修改】使用新的函数来生成文件名
            const projectName = getProjectName();
            link.download = `${projectName}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            captureButtonScroll.textContent = successTextScroll;
            captureButtonScroll.classList.add('success');
        } catch (e) {
            console.error("滚动导出文件失败:", e);
            captureButtonScroll.textContent = `${errorTextScroll}: 创建失败`;
            captureButtonScroll.classList.add('error');
            alert("创建滚动下载文件时出错: " + e.message);
        }

        setTimeout(() => {
            captureButtonScroll.textContent = buttonTextStartScroll;
            captureButtonScroll.disabled = false;
            captureButtonScroll.classList.remove('success', 'error');
            updateStatus('');
        }, exportTimeout);
    }

    async function handleScrollExtraction() {

        clickButtonsWithDelay(); // 打开raw模式
        if (isScrolling) return;
        captureButtonScroll.disabled = true;
        captureButtonScroll.textContent = '滚动中...';
        stopButtonScroll.style.display = 'block';
        stopButtonScroll.disabled = false;
        stopButtonScroll.textContent = buttonTextStopScroll;

        // 【修改】在开始前先滚动到页面顶部
        const scroller = getMainScrollerElement_AiStudio();
        if (scroller) {
            updateStatus('正在滚动到顶部...');
            const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
            if (isWindowScroller) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                scroller.scrollTo({ top: 0, behavior: 'smooth' });
            }
            await delay(1500); // 等待滚动动画完成
        }

        updateStatus('初始化滚动 (滚动导出)...');

        try {
            const scrollSuccess = await autoScrollDown_AiStudio();
            if (scrollSuccess !== false) {
                captureButtonScroll.textContent = buttonTextProcessingScroll;
                updateStatus('滚动结束，准备最终处理...');
                await delay(500);
                extractDataIncremental_AiStudio();
                await delay(200);
                formatAndTriggerDownloadScroll();
            } else {
                captureButtonScroll.textContent = `${errorTextScroll}: 滚动失败`;
                captureButtonScroll.classList.add('error');
                setTimeout(() => {
                    captureButtonScroll.textContent = buttonTextStartScroll;
                    captureButtonScroll.disabled = false;
                    captureButtonScroll.classList.remove('error');
                    updateStatus('');
                }, exportTimeout);
            }
        } catch (error) {
            console.error('滚动处理过程中发生错误:', error);
            updateStatus(`错误 (滚动导出): ${error.message}`);
            alert(`滚动处理过程中发生错误: ${error.message}`);
            captureButtonScroll.textContent = `${errorTextScroll}: 处理出错`;
            captureButtonScroll.classList.add('error');
            setTimeout(() => {
                captureButtonScroll.textContent = buttonTextStartScroll;
                captureButtonScroll.disabled = false;
                captureButtonScroll.classList.remove('error');
                updateStatus('');
            }, exportTimeout);
            isScrolling = false;
        } finally {
            stopButtonScroll.style.display = 'none';
            isScrolling = false;
        }

        clickButtonsWithDelay(); //关闭raw 模式
    }


    
    


    

    // --- 脚本初始化入口 ---
    console.log("Google AI Studio 聊天记录markdown导出器 (v1.0): 等待页面加载 (2.5秒)...");
    setTimeout(createUI, 2500);

})();