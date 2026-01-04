// ==UserScript==
// @name         ZMPT 超级批量投注
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  在批量投注和批量随机投注按钮右侧添加超级批量投注按钮，点击后输入次数自动提交
// @author       江畔
// @match        https://zmpt.cc/*
// @match        http://zmpt.cc/*
// @icon         https://zmpt.cc/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557803/ZMPT%20%E8%B6%85%E7%BA%A7%E6%89%B9%E9%87%8F%E6%8A%95%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557803/ZMPT%20%E8%B6%85%E7%BA%A7%E6%89%B9%E9%87%8F%E6%8A%95%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储API信息
    let apiInfo = {
        url: null,
        method: 'POST',
        headers: {},
        getBody: null,
        isRandom: false
    };

    // 监听请求完成状态
    let requestCompleted = false;

    // 标记是否正在执行超级批量投注（防止重复提交）
    let isSubmitting = false;

    // 查找按钮
    function findButton(text) {
        for (const btn of document.querySelectorAll('button')) {
            const item = btn.querySelector('.index-module__button-item___Pwfyv');
            if (item && item.textContent.trim() === text) {
                return btn;
            }
        }
        return null;
    }

    // 查找输入框
    function findInput(button) {
        const container = button.closest('.index-module__inputbox___fWLtE');
        return container ? container.querySelector('input[type="number"]') : null;
    }

    // 创建超级按钮
    function createSuperButton(originalBtn, isRandom) {
        if (originalBtn.dataset.superAdded === 'true') return;

        const container = originalBtn.closest('.index-module__inputbox___fWLtE');
        if (!container) return;

        const superBtn = originalBtn.cloneNode(true);
        superBtn.className = originalBtn.className + ' super-bet-btn';
        superBtn.style.backgroundColor = '#FF6B6B';
        superBtn.style.color = 'white';
        superBtn.style.marginLeft = '10px';

        const buttonItem = superBtn.querySelector('.index-module__button-item___Pwfyv');
        if (buttonItem) {
            buttonItem.textContent = isRandom ? '超级批量随机投注' : '超级批量投注';
        }

        superBtn.addEventListener('mouseenter', function() {
            if (!this.disabled) this.style.backgroundColor = '#FF5252';
        });
        superBtn.addEventListener('mouseleave', function() {
            if (!this.disabled) this.style.backgroundColor = '#FF6B6B';
        });

        superBtn.addEventListener('click', () => handleSuperBet(originalBtn, superBtn));
        container.appendChild(superBtn);
        originalBtn.dataset.superAdded = 'true';
    }

    // 拦截fetch捕获API信息
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};

        // 检查是否是批量投注的API请求
        if (typeof url === 'string' && url.includes('/batch')) {
            // 如果这个请求是我们自己发起的（有标记），直接执行不拦截
            if (options._isSuperBet) {
                return originalFetch.apply(this, args);
            }

            console.log('[超级批量投注] 检测到批量投注API请求:', url);

            // 只在未捕获API信息时才捕获（避免覆盖）
            if (!apiInfo.url || !apiInfo.getBody) {
                // 捕获API信息
                apiInfo.url = url;
                apiInfo.method = options.method || 'POST';
                apiInfo.headers = options.headers || {};

                // 保存请求体生成函数
                if (options.body) {
                    try {
                        const bodyData = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
                        apiInfo.getBody = (betAmount, isRandom) => {
                            const newBody = JSON.parse(JSON.stringify(bodyData));
                            // 更新投注数量相关字段
                            if (newBody.count !== undefined) newBody.count = betAmount;
                            if (newBody.amount !== undefined) newBody.amount = betAmount;
                            if (newBody.betAmount !== undefined) newBody.betAmount = betAmount;
                            if (newBody.num !== undefined) newBody.num = betAmount;
                            // 更新随机投注标志
                            if (isRandom && newBody.random !== undefined) newBody.random = true;
                            if (isRandom && newBody.isRandom !== undefined) newBody.isRandom = true;
                            return newBody;
                        };
                        console.log('[超级批量投注] 捕获到API请求体:', bodyData);
                    } catch (e) {
                        console.warn('[超级批量投注] 解析请求体失败:', e);
                    }
                }
            }

            requestCompleted = false;
            const promise = originalFetch.apply(this, args);
            promise.then(() => {
                console.log('[超级批量投注] API请求完成');
                requestCompleted = true;
            }).catch((err) => {
                console.log('[超级批量投注] API请求失败:', err);
                requestCompleted = true;
            });
            return promise;
        }

        return originalFetch.apply(this, args);
    };

    // 处理超级批量投注
    async function handleSuperBet(originalBtn, superBtn) {
        // 防止重复提交
        if (isSubmitting) {
            console.warn('[超级批量投注] 正在提交中，请勿重复点击！');
            return;
        }

        const input = findInput(originalBtn);
        if (!input) {
            alert('未找到投注数量输入框！');
            return;
        }

        const betAmount = parseInt(input.value, 10);
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('请输入有效的投注数量！');
            return;
        }

        const timesStr = prompt(`请输入要提交的次数：\n（每次提交 ${betAmount.toLocaleString()}）`, '');
        if (!timesStr || timesStr.trim() === '') return;

        const times = parseInt(timesStr.trim(), 10);
        if (isNaN(times) || times <= 0) {
            alert('请输入有效的次数！');
            return;
        }

        isSubmitting = true;

        superBtn.disabled = true;
        superBtn.style.backgroundColor = '#999';
        superBtn.style.cursor = 'not-allowed';
        const buttonItem = superBtn.querySelector('.index-module__button-item___Pwfyv');
        const originalText = buttonItem ? buttonItem.textContent : '';

        // 判断是批量随机投注还是批量投注
        const isRandom = originalBtn.textContent.includes('随机');

        console.log(`[超级批量投注] 开始提交，共 ${times} 次，每次 ${betAmount.toLocaleString()}，是否随机: ${isRandom}`);

        // 如果还没有捕获到API信息，先点击一次按钮来捕获（这次提交算作第1次）
        let actualTimes = times;
        let useAPI = false;

        if (!apiInfo.url || !apiInfo.getBody) {
            console.log('[超级批量投注] 未捕获到API信息，点击按钮捕获（这次算第1次提交）...');
            requestCompleted = false;
            originalBtn.click();

            // 等待捕获API信息（最多等待2秒）
            let waited = 0;
            while ((!apiInfo.url || !apiInfo.getBody) && waited < 2000) {
                await new Promise(resolve => setTimeout(resolve, 100));
                waited += 100;
            }

            if (apiInfo.url && apiInfo.getBody) {
                console.log('[超级批量投注] API信息捕获成功，剩余次数使用API直接提交');
                useAPI = true;
                actualTimes = times - 1; // 减去已经提交的1次
                if (buttonItem) {
                    buttonItem.textContent = `提交中 (1/${times})`;
                }
                // 等待这次提交完成
                let waited2 = 0;
                while (!requestCompleted && waited2 < 3000) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    waited2 += 100;
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            } else {
                console.warn('[超级批量投注] 未能捕获API信息，使用点击按钮方式');
                actualTimes = times - 1; // 减去已经提交的1次
                if (buttonItem) {
                    buttonItem.textContent = `提交中 (1/${times})`;
                }
                // 等待这次提交完成
                let waited2 = 0;
                while (!requestCompleted && waited2 < 3000) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    waited2 += 100;
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } else {
            useAPI = true;
        }

        // 如果捕获到API信息，使用API直接提交（批量并发请求）
        if (useAPI && apiInfo.url && apiInfo.getBody) {
            console.log(`[超级批量投注] 使用API直接提交，URL: ${apiInfo.url}，剩余 ${actualTimes} 次`);

            if (actualTimes <= 0) {
                console.log('[超级批量投注] 所有提交已完成（捕获时已提交）');
            } else {
                const batchSize = 5; // 每批并发5个请求
                let completed = times - actualTimes; // 已完成的次数（包括捕获时的1次）

                // 分批并发执行
                for (let batchStart = 0; batchStart < actualTimes; batchStart += batchSize) {
                    const batchEnd = Math.min(batchStart + batchSize, actualTimes);
                    const batchRequests = [];

                    for (let i = batchStart; i < batchEnd; i++) {
                        const requestIndex = completed + i + 1; // 实际是第几次（从1开始）
                        const body = apiInfo.getBody(betAmount, isRandom);
                        const request = fetch(apiInfo.url, {
                            method: apiInfo.method,
                            headers: {
                                ...apiInfo.headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body),
                            credentials: 'include',
                            _isSuperBet: true // 标记这是我们自己发起的请求
                        }).then(response => {
                            completed++;
                            console.log(`[超级批量投注] 第 ${requestIndex}/${times} 次：API请求成功`);
                            if (buttonItem) {
                                buttonItem.textContent = `提交中 (${completed}/${times})`;
                            }
                            return response;
                        }).catch(err => {
                            completed++;
                            console.error(`[超级批量投注] 第 ${requestIndex}/${times} 次：API请求失败`, err);
                            return null;
                        });
                        batchRequests.push(request);
                    }

                // 等待当前批次完成
                await Promise.all(batchRequests);

                // 批次之间稍作延迟，避免服务器压力过大
                if (batchEnd < actualTimes) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                }
            }

            console.log(`[超级批量投注] 所有API请求完成！共 ${times} 次`);
        } else {
            // 使用点击按钮方式（剩余次数）
            if (actualTimes > 0) {
                for (let i = 0; i < actualTimes; i++) {
                    const requestIndex = times - actualTimes + i + 1;
                    if (buttonItem) {
                        buttonItem.textContent = `提交中 (${requestIndex}/${times})`;
                    }
                    console.log(`[超级批量投注] 第 ${requestIndex}/${times} 次：点击按钮提交`);
                    requestCompleted = false;
                    originalBtn.click();
                    let waited = 0;
                    while (!requestCompleted && waited < 3000) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        waited += 100;
                    }
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            console.log(`[超级批量投注] 所有批次提交完成！共 ${times} 次`);
        }

        isSubmitting = false;
        superBtn.disabled = false;
        superBtn.style.backgroundColor = '#FF6B6B';
        superBtn.style.cursor = 'pointer';
        if (buttonItem) buttonItem.textContent = originalText;

        // 显示提交成功信息并询问是否刷新
        const shouldRefresh = confirm(`提交成功！\n\n共提交 ${times} 次，每次 ${betAmount.toLocaleString()}。\n\n是否刷新网页？`);
        if (shouldRefresh) {
            window.location.reload();
        }
    }

    // 初始化
    function init() {
        const batchBtn = findButton('批量投注');
        const randomBtn = findButton('批量随机投注');

        if (batchBtn && !batchBtn.dataset.superAdded) {
            createSuperButton(batchBtn, false);
        }
        if (randomBtn && !randomBtn.dataset.superAdded) {
            createSuperButton(randomBtn, true);
        }
    }

    const observer = new MutationObserver(() => {
        if (document.querySelectorAll('.super-bet-btn').length >= 2) return;
        init();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', init);
})();
