// ==UserScript==
// @name         Bahamut Forum Comment Scraper with AI Analysis
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  爬取巴哈姆特論壇特定樓層留言並在新分頁跳轉到ChatGPT或Grok進行分析，或下載為JSON
// @author       You
// @match        https://forum.gamer.com.tw/C.php?bsn=*&snA=*
// @match        https://chatgpt.com/*
// @match        https://grok.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/548204/Bahamut%20Forum%20Comment%20Scraper%20with%20AI%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/548204/Bahamut%20Forum%20Comment%20Scraper%20with%20AI%20Analysis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 預設提示詞
    const PROMPT_TEMPLATE = `你是一個專業的論壇討論分析工具。請分析以下巴哈姆特論壇留言資料：
{comments}
留言格式為:b+序號+(發言人暱稱:發言內容)
請提供：
1. 主要討論主題（例如遊戲特色、問題反饋）。
2. 情緒分析（計算正面、負面、中立留言的比例）。
3. 3-5個關鍵觀點（例如熱門意見或爭議點）。
4. 活躍用戶分析（列出留言最多的用戶）。
輸出格式為清晰的報告，包含標題和分段。`;

    // 提取特定主樓層回覆
    function scrapeMainReplies(targetFloor) {
        let replies = [];
        let blocks = document.querySelectorAll('section[id^="post_"]');
        if (!blocks.length) {
            console.error('未找到主樓層，可能頁面無內容或需要登入');
            return replies;
        }

        blocks.forEach(block => {
            let floorElement = block.querySelector('.floor, .c-section__title--reply');
            let contentElement = block.querySelector('.c-article__content, .reply-content__article');
            let floor = floorElement ? floorElement.dataset.floor || floorElement.innerText.trim() : '未知';
            let content = contentElement ? contentElement.innerText.trim() : '無內容';
            let snB = block.id.replace('post_', '');
            if (!targetFloor || floor === targetFloor) {
                replies.push({ floor: floor, content: content, subComments: [], snB: snB });
            }
        });
        console.log('主樓層數量:', replies.length);
        return replies;
    }

    // 提取子留言（支援分頁）
    function scrapeSubComments(bsn, snB, snC = '', callback) {
        let url = `https://forum.gamer.com.tw/ajax/moreCommend.php?bsn=${bsn}&snB=${snB}`;
        if (snC) url += `&snC=${snC}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36'
            },
            onload: function(response) {
                try {
                    let data = JSON.parse(response.responseText);
                    let comments = [];
                    for (let key in data) {
                        if (key.match(/^\d+$/)) {
                            comments.push({
                                user: data[key].nick || '未知用戶',
                                content: data[key].comment || '無內容',
                                time: data[key].wtime || '未知時間'
                            });
                        }
                    }
                    if (data.next_snC) {
                        scrapeSubComments(bsn, snB, data.next_snC, nextComments => {
                            callback(comments.concat(nextComments));
                        });
                    } else {
                        callback(comments);
                    }
                } catch (e) {
                    console.error(`解析子留言失敗 (snB=${snB}):`, e);
                    callback([]);
                }
            },
            onerror: function() {
                console.error(`子留言請求失敗: bsn=${bsn}, snB=${snB}`);
                callback([]);
            }
        });
    }

    // 簡化留言為文字格式（限制長度）
    function simplifyComments(replies) {
        let text = '';
        const maxLength = 8000; // 限制總長度以避免URL或localStorage溢出
        let num = 0;
        replies.forEach(reply => {
            let entry = `${reply.floor}樓主文:\n ${reply.content.replace(/https?:\/\/\S+/g, "").replace(/#.*?#/g, "").replace(/\s+/g, " ").trim()}\n留言:\n`;
            if (text.length + entry.length < maxLength) text += entry;
            reply.subComments.reverse().forEach(sub => {
                num+=1;
                entry = `b${num}(${sub.user}:${sub.content.replace(/https?:\/\/\S+/g, "").replace(/#.*?#/g, "").replace(/\s+/g, " ").trim()})\n`;//${sub.time}
                if (text.length + entry.length < maxLength) text += entry;
            });
        });
        if (text.length >= maxLength) text = text.substring(0, maxLength - 3) + '...';
        return text;
    }

    // 添加輸入框和按鈕（左下角，垂直疊放）
    function addAnalysisButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

        // 樓層輸入框
        const floorInput = document.createElement('input');
        floorInput.type = 'text';
        floorInput.placeholder = '輸入樓層號 (留空爬取所有樓層)';
        floorInput.style.padding = '10px';
        floorInput.style.border = '1px solid #ccc';
        floorInput.style.borderRadius = '5px';
        floorInput.style.width = '200px';

        const chatgptButton = document.createElement('button');
        chatgptButton.innerText = '使用ChatGPT分析';
        chatgptButton.style.padding = '10px 20px';
        chatgptButton.style.backgroundColor = '#4CAF50';
        chatgptButton.style.color = 'white';
        chatgptButton.style.border = 'none';
        chatgptButton.style.borderRadius = '5px';
        chatgptButton.style.cursor = 'pointer';

        const grokButton = document.createElement('button');
        grokButton.innerText = '使用Grok分析';
        grokButton.style.padding = '10px 20px';
        grokButton.style.backgroundColor = '#007BFF';
        grokButton.style.color = 'white';
        grokButton.style.border = 'none';
        grokButton.style.borderRadius = '5px';
        grokButton.style.cursor = 'pointer';

        const downloadButton = document.createElement('button');
        downloadButton.innerText = '下載JSON';
        downloadButton.style.padding = '10px 20px';
        downloadButton.style.backgroundColor = '#FF5733';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';

        container.appendChild(floorInput);
        container.appendChild(chatgptButton);
        container.appendChild(grokButton);
        container.appendChild(downloadButton);
        document.body.appendChild(container);

        return { floorInput, chatgptButton, grokButton, downloadButton };
    }

    // 爬取並跳轉（新分頁）
    function scrapeAndRedirect(button, platform, floorInput) {
        button.innerText = '爬取中...';
        button.disabled = true;

        let targetFloor = floorInput.value.trim();
        let urlParams = new URL(window.location.href).searchParams;
        let bsn = urlParams.get('bsn');
        let snA = urlParams.get('snA');
        let replies = scrapeMainReplies(targetFloor);

        if (!replies.length) {
            console.error('無主樓層資料，無法繼續爬取');
            alert('無主樓層資料，請檢查頁面或輸入的樓層號是否正確');
            button.innerText = platform === 'chatgpt' ? '使用ChatGPT分析' : '使用Grok分析';
            button.disabled = false;
            return;
        }

        let completed = 0;
        replies.forEach(reply => {
            scrapeSubComments(bsn, reply.snB, '', comments => {
                reply.subComments = comments;
                completed++;
                console.log(`樓層 ${reply.floor} 子留言數: ${comments.length}`);

                if (completed === replies.length) {
                    const commentsText = simplifyComments(replies);
                    const prompt = PROMPT_TEMPLATE.replace('{comments}', commentsText);

                    // 儲存提示詞到localStorage
                    GM_setValue('analysis_prompt', prompt);

                    // 新分頁跳轉
                    let targetUrl = platform === 'chatgpt' ? 'https://chatgpt.com/' : 'https://grok.com/';
                    window.open(targetUrl, '_blank');

                    button.innerText = platform === 'chatgpt' ? '使用ChatGPT分析' : '使用Grok分析';
                    button.disabled = false;
                }
            });
        });
    }

    // 爬取並下載JSON
    function scrapeAndDownload(button, floorInput) {
        button.innerText = '爬取中...';
        button.disabled = true;

        let targetFloor = floorInput.value.trim();
        let urlParams = new URL(window.location.href).searchParams;
        let bsn = urlParams.get('bsn');
        let snA = urlParams.get('snA');
        let replies = scrapeMainReplies(targetFloor);

        if (!replies.length) {
            console.error('無主樓層資料，無法繼續爬取');
            alert('無主樓層資料，請檢查頁面或輸入的樓層號是否正確');
            button.innerText = '下載JSON';
            button.disabled = false;
            return;
        }

        let completed = 0;
        replies.forEach(reply => {
            scrapeSubComments(bsn, reply.snB, '', comments => {
                reply.subComments = comments;
                completed++;
                console.log(`樓層 ${reply.floor} 子留言數: ${comments.length}`);

                if (completed === replies.length) {
                    const jsonData = JSON.stringify(replies, null, 2);
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const filename = `bahamut_comments_${bsn}_${snA}_${timestamp}.json`;

                    GM_download({
                        url: url,
                        name: filename,
                        saveAs: true,
                        onload: () => {
                            URL.revokeObjectURL(url);
                            button.innerText = '下載JSON';
                            button.disabled = false;
                        },
                        onerror: () => {
                            console.error('下載失敗');
                            alert('下載JSON失敗，請重試');
                            button.innerText = '下載JSON';
                            button.disabled = false;
                        }
                    });
                }
            });
        });
    }

    // 模擬自然輸入事件
    function dispatchInputEvent(element, value) {
        console.log('Dispatching input event to element:', element);
        const setValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        const inputEvent = new InputEvent('input', { bubbles: true, data: value });
        const changeEvent = new Event('change', { bubbles: true });
        setValue.call(element, value);
        element.dispatchEvent(inputEvent);
        element.dispatchEvent(changeEvent);
        element.focus();
    }

    // 自動填充提示詞（ChatGPT或Grok頁面）
    function autoFillPrompt() {
        const prompt = GM_getValue('analysis_prompt', '');
        if (!prompt) {
            console.log('無提示詞，跳過自動填充');
            return;
        }

        if (window.location.href.includes('chatgpt.com')) {
            console.log('進入ChatGPT頁面，開始嘗試填充提示詞');
            const tryFillChatGPT = (attempt = 1, maxAttempts = 5) => {
                if (attempt > maxAttempts) {
                    console.error('ChatGPT自動填充失敗，超過最大重試次數');
                    GM_setValue('analysis_prompt', '');
                    return;
                }

                const inputBox = document.querySelector('#prompt-textarea, textarea[data-id="root"], textarea, [contenteditable="true"]');
                console.log('找框');
                //const inputBox = document.querySelector('textarea, [contenteditable="true"]');
                console.log('找按鈕');
                const submitButton = document.querySelector('button[data-testid="send-button"], button[aria-label="Send prompt"], button[aria-label*="send"], button[type="submit"]');

                if (inputBox) {
                    console.log('找到ChatGPT輸入框和，開始填充 (嘗試次數:', attempt, ')');
                    console.log(prompt);
                    console.log(inputBox);
                    if (true && inputBox.tagName === 'DIV') {
                        inputBox.innerText = prompt;
                        inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                        inputBox.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        inputBox.className = 'ProseMirror';
                        dispatchInputEvent(inputBox, prompt);

                    }
                    setTimeout(() => {
                        if (submitButton && !submitButton.disabled) {
                            console.log('提交按鈕可用，點擊提交');
                            submitButton.click();
                            GM_setValue('analysis_prompt', '');
               //             observer.disconnect();
                        } else {
                           // console.log('提交按鈕禁用，重試... (嘗試次數:', attempt, ')');
                            console.log('提交按鈕未找到或禁用，嘗試模擬Enter鍵');
                            const enterEvent = new KeyboardEvent('keydown', {
                                key: 'Enter',
                                code: 'Enter',
                                which: 13,
                                keyCode: 13,
                                bubbles: true,
                                cancelable: true
                            });
                            inputBox.dispatchEvent(enterEvent);
                            GM_setValue('analysis_prompt', '');
                //            setTimeout(() => tryFillChatGPT(observer, attempt + 1, maxAttempts), 2000);
                        }
                    }, 1500);
                } else {
                    console.log('ChatGPT輸入框或按鈕未找到，重試... (嘗試次數:', attempt, ')');
                    setTimeout(() => tryFillChatGPT( attempt + 1, maxAttempts), 2000);
                }
            };
            setTimeout(() => tryFillChatGPT(), 3000); // 初始延遲5000ms
        } else if (window.location.href.includes('grok.com')) {
            console.log('進入Grok頁面，開始嘗試填充提示詞');
            const tryFill = (attempt = 1, maxAttempts = 5) => {
                if (attempt > maxAttempts) {
                    console.error('Grok自動填充失敗，超過最大重試次數');
                    GM_setValue('analysis_prompt', '');
                    return;
                }

                const inputBox = document.querySelector('textarea, [contenteditable="true"]');
                const submitButton = document.querySelector('button[type="submit"], button[aria-label*="send"], button[aria-label*="Send"]');

                if (inputBox) {
                    console.log('找到Grok輸入框，開始填充');
                    if (inputBox.tagName === 'DIV') {
                        inputBox.innerText = prompt;
                        inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                        inputBox.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        dispatchInputEvent(inputBox, prompt);
                    }
                    setTimeout(() => {
                        if (submitButton && !submitButton.disabled) {
                            console.log('提交按鈕可用，點擊提交');
                            submitButton.click();
                            GM_setValue('analysis_prompt', '');
                        } else {
                            console.log('提交按鈕未找到或禁用，嘗試模擬Enter鍵');
                            const enterEvent = new KeyboardEvent('keydown', {
                                key: 'Enter',
                                code: 'Enter',
                                which: 13,
                                keyCode: 13,
                                bubbles: true,
                                cancelable: true
                            });
                            inputBox.dispatchEvent(enterEvent);
                            GM_setValue('analysis_prompt', '');
                        }
                    }, 1500);
                } else {
                    console.log('Grok輸入框未找到，重試... (嘗試次數:', attempt, ')');
                    setTimeout(() => tryFill(attempt + 1, maxAttempts), 1500);
                }
            };
            setTimeout(() => tryFill(), 2000);
        }
    }

    // 主邏輯
    if (window.location.href.includes('forum.gamer.com.tw')) {
        console.log('進入巴哈姆特論壇頁面，添加按鈕');
        const { floorInput, chatgptButton, grokButton, downloadButton } = addAnalysisButtons();
        chatgptButton.addEventListener('click', () => {
            console.log('點擊ChatGPT分析按鈕');
            scrapeAndRedirect(chatgptButton, 'chatgpt', floorInput);
        });
        grokButton.addEventListener('click', () => {
            console.log('點擊Grok分析按鈕');
            scrapeAndRedirect(grokButton, 'grok', floorInput);
        });
        downloadButton.addEventListener('click', () => {
            console.log('點擊下載JSON按鈕');
            scrapeAndDownload(downloadButton, floorInput);
        });
    } else if (window.location.href.includes('chatgpt.com') || window.location.href.includes('grok.com')) {
        console.log('檢測到ChatGPT或Grok頁面，執行自動填充');
        autoFillPrompt();
    }
})();