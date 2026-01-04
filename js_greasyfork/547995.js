// ==UserScript==
// @name         阿里巴巴商品批量自动收藏（登录买家账号刷）-树洞先生
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过页面输入框批量输入产品ID，自动访问每个产品页面并执行收藏操作(页面加载 → 等待2秒 → 点击收藏 → 等待1秒 → 检测状态 → 记录结果 → 等待1秒 → 跳转下一个)
// @author       树洞先生(V：shudong_my)
// @license      MIT 
// @match        https://www.alibaba.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547995/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%95%86%E5%93%81%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%94%B6%E8%97%8F%EF%BC%88%E7%99%BB%E5%BD%95%E4%B9%B0%E5%AE%B6%E8%B4%A6%E5%8F%B7%E5%88%B7%EF%BC%89-%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/547995/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%95%86%E5%93%81%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%94%B6%E8%97%8F%EF%BC%88%E7%99%BB%E5%BD%95%E4%B9%B0%E5%AE%B6%E8%B4%A6%E5%8F%B7%E5%88%B7%EF%BC%89-%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('=== 阿里巴巴批量收藏脚本已加载 ===');
    console.log('当前URL:', window.location.href);
    console.log('页面状态:', document.readyState);

    // ==================== 函数定义区域 ====================
    
    // 检查是否已经收藏
    function checkFavorited() {
        // 填充的心形图标或 aria-pressed=true
        if (document.querySelector('svg.detail-icon-favorite-fill')) return true;
        if (document.querySelector('[aria-pressed="true"][aria-label*="Favorite" i], [aria-pressed="true"][aria-label*="收藏"]')) return true;
        // 备用：某些实现会在父节点加选中类名
        const heart = document.querySelector('svg[class*="favorite"], svg[class*="heart"]');
        if (heart) {
            const container = heart.closest('[class]');
            if (container && /active|selected|filled|on/.test(container.className)) return true;
        }
        return false;
    }

    // 更稳的收藏按钮查找
    function findFavoriteButton() {
        const selectors = [
            'button[aria-label*="Favorite" i]',
            '[aria-label*="收藏"]',
            '[title*="收藏"]',
            '[data-spm-anchor-id*="follow"]',
            '[data-spm*="follow"]',
            '[data-spm*="fav"]',
            'svg.detail-icon-favorite',
            'svg.detail-icon-favorite-fill',
            'svg[class*="favorite"]',
            'svg[class*="heart"]'
        ];

        const nodes = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
        const candidates = nodes
            .map(el => el.closest('button,[role="button"],a,div,span') || el)
            .filter(el => el && el.offsetParent !== null);

        // 优先非已收藏的候选
        const notFilled = candidates.find(el => !el.querySelector('svg.detail-icon-favorite-fill'));
        return notFilled || candidates[0] || null;
    }

    // 模拟人类点击序列
    function simulateHumanClick(element) {
        try {
            element.scrollIntoView({ block: 'center', inline: 'center' });
            const rect = element.getBoundingClientRect();
            const opts = {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            };
            ['pointerover','pointerenter','mouseover','mouseenter','pointerdown','mousedown','pointerup','mouseup','click']
                .forEach(type => element.dispatchEvent(new MouseEvent(type, opts)));
        } catch (e) {
            try { element.click(); } catch (_) {}
        }
    }

    // 获取当前页面的产品ID
    function getCurrentProductId() {
        const match = window.location.href.match(/product-detail\/(.*?)\.html/);
        return match ? match[1].replace(/^a_/, '') : null;
    }

    // 检测是否为"Product Not Available"页面
    function isProductNotAvailablePage() {
        // 检查页面标题
        if (document.title.includes('Product Not Available')) {
            return true;
        }

        // 检查页面内容中的错误信息
        const errorTexts = [
            '此商品暂时无法购买',
            'Product Not Available',
            '即将跳转至相似商品页面',
            'will soon jump to a similar product page'
        ];

        const pageText = document.body.innerText || document.body.textContent || '';
        return errorTexts.some(text => pageText.includes(text));
    }

    // 强制跳转到下一个未处理的产品
    function goToNextProduct() {
        console.log('=== 开始跳转到下一个产品 ===');
        
        // 重新获取最新的处理状态
        const currentProcessedIds = JSON.parse(localStorage.getItem('aliFavoriteProcessed') || '[]');
        const currentUnprocessedIds = productIds.filter(id => !currentProcessedIds.includes(id));

        console.log('已处理的产品:', currentProcessedIds);
        console.log('未处理的产品:', currentUnprocessedIds);

        const nextId = currentUnprocessedIds[0];
        if (nextId) {
            console.log(`即将处理下一个产品: ${nextId}`);
            const nextUrl = `https://www.alibaba.com/product-detail/a_${nextId}.html`;
            console.log('跳转URL:', nextUrl);
            
            // 强制跳转，不使用setTimeout
            window.location.href = nextUrl;
        } else {
            console.log('所有产品已处理完毕！');
            localStorage.removeItem('aliFavoriteProcessed'); // 清除进度记录

            // 自动导出收藏结果
            setTimeout(() => {
                autoExportResults();
            }, 1000); // 等待1秒后自动导出

            // 返回首页（在当前窗口）
            window.location.href = 'https://www.alibaba.com/';
        }
    }

    // 获取等待时长设置
    function getWaitDuration() {
        // 从本地存储获取等待时长，默认为3秒
        const waitDuration = localStorage.getItem('aliFavoriteWaitDuration');
        return waitDuration ? parseInt(waitDuration) : 3;
    }

    // 调试收藏按钮状态
    function debugFavoriteButton() {
        console.log('=== 调试收藏按钮状态 ===');

        const favorited = checkFavorited();
        if (favorited) {
            console.log('✅ 当前产品已经是收藏状态');
        } else {
            console.log('❌ 当前产品未收藏');
        }

        const favoriteButton = findFavoriteButton();
        if (favoriteButton) {
            console.log('✅ 找到收藏按钮');
            console.log('收藏按钮HTML:', favoriteButton.outerHTML);
            console.log('收藏按钮位置:', favoriteButton.getBoundingClientRect());
        } else {
            console.log('❌ 未找到收藏按钮');
        }

        let debugInfo = '=== 调试收藏按钮状态 ===\n';
        debugInfo += favorited ? '✅ 当前产品已经是收藏状态\n' : '❌ 当前产品未收藏\n';
        debugInfo += favoriteButton ? '✅ 找到收藏按钮\n' : '❌ 未找到收藏按钮\n';
        alert(debugInfo);
    }

    // ==================== 主逻辑开始 ====================
    
    // 从本地存储获取产品ID列表，默认为空数组
    let productIds = JSON.parse(localStorage.getItem('aliFavoriteProductIds') || '[]');

    // 初始化本地存储，记录处理进度
    if (!localStorage.getItem('aliFavoriteProcessed')) {
        localStorage.setItem('aliFavoriteProcessed', JSON.stringify([]));
    }

    // 初始化重试次数记录
    if (!localStorage.getItem('aliFavoriteRetryCount')) {
        localStorage.setItem('aliFavoriteRetryCount', JSON.stringify({}));
    }

    // 在首页显示悬浮按钮
    if (window.location.href === 'https://www.alibaba.com/' || 
        window.location.href === 'https://www.alibaba.com' ||
        window.location.href.match(/^https:\/\/www\.alibaba\.com\/?$/)) {
        // 等待DOM完全加载后再创建按钮
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createFloatingButton);
        } else {
            // 如果DOM已经加载完成，延迟一点时间确保页面完全渲染
            setTimeout(createFloatingButton, 1000);
        }
        return;
    }

    // 在产品详情页执行收藏操作
    if (window.location.href.includes('product-detail')) {
        // 获取当前页面的产品ID
        const currentId = getCurrentProductId();

        // 检查当前产品是否已经被处理过
        const currentProcessedIds = JSON.parse(localStorage.getItem('aliFavoriteProcessed') || '[]');
        if (currentProcessedIds.includes(currentId)) {
            console.log(`产品 ${currentId} 已经处理过，跳过`);
            // 如果已处理过，直接跳转到下一个
            goToNextProduct();
            return;
        }

        // 检查是否为"Product Not Available"页面
        if (isProductNotAvailablePage()) {
            console.log(`产品 ${currentId} 页面显示"商品暂时无法购买"，跳过该链接`);

            // 记录产品不可用状态
            const unavailableRecord = {
                id: currentId,
                status: 'unavailable',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                reason: '商品暂时无法购买'
            };

            // 保存到本地存储
            let unavailableRecords = JSON.parse(localStorage.getItem('aliFavoriteUnavailableRecords') || '[]');
            unavailableRecords.push(unavailableRecord);
            localStorage.setItem('aliFavoriteUnavailableRecords', JSON.stringify(unavailableRecords));

            // 标记为已处理
            currentProcessedIds.push(currentId);
            localStorage.setItem('aliFavoriteProcessed', JSON.stringify(currentProcessedIds));

            // 立即跳转到下一个产品
            goToNextProduct();
            return;
        }

        if (currentId && productIds.includes(currentId)) {
            // 等待页面加载完成后执行收藏
            setTimeout(() => {
                // 首先检查是否已经是收藏成功状态
                if (checkFavorited()) {
                    console.log(`产品 ${currentId} 已经是收藏状态，无需重复收藏`);

                    // 记录已收藏状态
                    const successRecord = {
                        id: currentId,
                        status: 'already_favorited',
                        timestamp: new Date().toISOString(),
                        url: window.location.href
                    };

                    // 保存到本地存储
                    let successRecords = JSON.parse(localStorage.getItem('aliFavoriteSuccessRecords') || '[]');
                    successRecords.push(successRecord);
                    localStorage.setItem('aliFavoriteSuccessRecords', JSON.stringify(successRecords));

                    // 标记为已处理
                    currentProcessedIds.push(currentId);
                    localStorage.setItem('aliFavoriteProcessed', JSON.stringify(currentProcessedIds));

                    // 立即跳转到下一个产品
                    goToNextProduct();
                    return;
                }

                // 如果不是收藏状态，则查找收藏按钮
                const favoriteButton = findFavoriteButton();

                if (favoriteButton) {
                    console.log(`找到收藏按钮，正在收藏产品: ${currentId}`);
                    simulateHumanClick(favoriteButton);

                    // 等待1秒后检查收藏状态
                    setTimeout(() => {
                        // 再次检查收藏按钮是否变成已收藏状态
                        if (checkFavorited()) {
                            console.log(`产品 ${currentId} 收藏成功`);

                            // 记录收藏成功
                            const successRecord = {
                                id: currentId,
                                status: 'success',
                                timestamp: new Date().toISOString(),
                                url: window.location.href
                            };

                            // 保存到本地存储
                            let successRecords = JSON.parse(localStorage.getItem('aliFavoriteSuccessRecords') || '[]');
                            successRecords.push(successRecord);
                            localStorage.setItem('aliFavoriteSuccessRecords', JSON.stringify(successRecords));

                            // 标记为已处理
                            currentProcessedIds.push(currentId);
                            localStorage.setItem('aliFavoriteProcessed', JSON.stringify(currentProcessedIds));

                            // 立即跳转到下一个产品
                            goToNextProduct();

                        } else {
                            console.log(`产品 ${currentId} 收藏失败`);

                            // 检查重试次数
                            let retryCounts = JSON.parse(localStorage.getItem('aliFavoriteRetryCount') || '{}');
                            const currentRetryCount = retryCounts[currentId] || 0;

                            if (currentRetryCount < 2) { // 最多重试2次
                                // 增加重试次数
                                retryCounts[currentId] = currentRetryCount + 1;
                                localStorage.setItem('aliFavoriteRetryCount', JSON.stringify(retryCounts));

                                console.log(`产品 ${currentId} 收藏失败，第 ${currentRetryCount + 1} 次重试`);

                                // 等待3秒后重试
                                setTimeout(() => {
                                    location.reload();
                                }, 3000);
                                return;
                            } else {
                                // 超过重试次数，记录失败并继续下一个
                                console.log(`产品 ${currentId} 收藏失败，已达到最大重试次数`);

                                // 记录收藏失败
                                const failRecord = {
                                    id: currentId,
                                    status: 'failed',
                                    timestamp: new Date().toISOString(),
                                    url: window.location.href,
                                    reason: '收藏失败，已达到最大重试次数'
                                };

                                // 保存到本地存储
                                let failRecords = JSON.parse(localStorage.getItem('aliFavoriteFailRecords') || '[]');
                                failRecords.push(failRecord);
                                localStorage.setItem('aliFavoriteFailRecords', JSON.stringify(failRecords));

                                // 标记为已处理
                                currentProcessedIds.push(currentId);
                                localStorage.setItem('aliFavoriteProcessed', JSON.stringify(currentProcessedIds));

                                // 立即跳转到下一个产品
                                goToNextProduct();
                            }
                        }
                    }, 1000);
                } else {
                    // 尝试通过 XPath 定位收藏图标/按钮
                    const xpaths = [
                        '//*[@id="ProductImageMain"]/div[2]/div[1]/svg',
                        '/html/body/div[1]/div[1]/div[1]/div[1]/div[5]/div/div/div[2]/div[2]/div[1]/svg'
                    ];

                    let xpathElement = null;
                    for (const xp of xpaths) {
                        try {
                            const result = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                            if (result && result.singleNodeValue) {
                                xpathElement = result.singleNodeValue;
                                break;
                            }
                        } catch (e) {
                            console.log('XPath 解析失败:', xp, e);
                        }
                    }

                    if (xpathElement) {
                        console.log('通过 XPath 找到收藏元素，尝试点击');

                        const clickable = xpathElement.closest('button, a, div, span') || xpathElement;
                        simulateHumanClick(clickable);

                        // 等待1秒后检查收藏状态
                        setTimeout(() => {
                            if (checkFavorited()) {
                                console.log(`产品 ${currentId} 收藏成功`);

                                const successRecord = {
                                    id: currentId,
                                    status: 'success',
                                    timestamp: new Date().toISOString(),
                                    url: window.location.href
                                };

                                let successRecords = JSON.parse(localStorage.getItem('aliFavoriteSuccessRecords') || '[]');
                                successRecords.push(successRecord);
                                localStorage.setItem('aliFavoriteSuccessRecords', JSON.stringify(successRecords));

                                currentProcessedIds.push(currentId);
                                localStorage.setItem('aliFavoriteProcessed', JSON.stringify(currentProcessedIds));

                                goToNextProduct();
                            } else {
                                console.log(`产品 ${currentId} 收藏失败 (XPath)`);

                                // 检查重试次数
                                let retryCounts = JSON.parse(localStorage.getItem('aliFavoriteRetryCount') || '{}');
                                const currentRetryCount = retryCounts[currentId] || 0;

                                if (currentRetryCount < 2) {
                                    retryCounts[currentId] = currentRetryCount + 1;
                                    localStorage.setItem('aliFavoriteRetryCount', JSON.stringify(retryCounts));

                                    console.log(`产品 ${currentId} 收藏失败，第 ${currentRetryCount + 1} 次重试 (XPath)`);

                                    setTimeout(() => {
                                        location.reload();
                                    }, 3000);
                                    return;
                                } else {
                                    console.log(`产品 ${currentId} 收藏失败，已达到最大重试次数 (XPath)`);

                                    const failRecord = {
                                        id: currentId,
                                        status: 'failed',
                                        timestamp: new Date().toISOString(),
                                        url: window.location.href,
                                        reason: '未找到收藏按钮，或 XPath 点击失败'
                                    };

                                    let failRecords = JSON.parse(localStorage.getItem('aliFavoriteFailRecords') || '[]');
                                    failRecords.push(failRecord);
                                    localStorage.setItem('aliFavoriteFailRecords', JSON.stringify(failRecords));

                                    currentProcessedIds.push(currentId);
                                    localStorage.setItem('aliFavoriteProcessed', JSON.stringify(currentProcessedIds));

                                    goToNextProduct();
                                }
                            }
                        }, 1000);
                    } else {
                        console.log(`未找到收藏按钮，跳过产品: ${currentId}`);

                        // 记录未找到收藏按钮
                        const failRecord = {
                            id: currentId,
                            status: 'failed',
                            timestamp: new Date().toISOString(),
                            url: window.location.href,
                            reason: '未找到收藏按钮'
                        };

                        let failRecords = JSON.parse(localStorage.getItem('aliFavoriteFailRecords') || '[]');
                        failRecords.push(failRecord);
                        localStorage.setItem('aliFavoriteFailRecords', JSON.stringify(failRecords));

                        goToNextProduct();
                    }
                }
            }, getWaitDuration() * 1000); // 页面加载后等待用户设置的秒数再执行收藏
        }
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const button = document.createElement('div');
        button.innerHTML = '📚 批量收藏';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9998;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            user-select: none;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        // 点击显示控制面板
        button.addEventListener('click', () => {
            if (document.getElementById('batchCollectionPanel')) {
                // 如果面板已存在，则隐藏
                document.getElementById('batchCollectionPanel').remove();
            } else {
                // 如果面板不存在，则创建
                createControlPanel();
            }
        });

        document.body.appendChild(button);
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'batchCollectionPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: 400px;
            max-height: 70vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333; font-size: 16px;">📚 产品批量刷访客收藏工具-树洞先生</h3>
                <button id="closePanelBtn" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">×</button>
            </div>

            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <p style="margin: 5px 0 0 0; color: #999; font-size:16px;">
                    脚本来源: 树洞先生 (v:shudong_my)
                </p>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="waitDurationInput" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">
                    等待时长 (秒):
                </label>
                <input type="number" id="waitDurationInput" value="2" min="1" max="10" style="width: 100%; padding: 8px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px;" placeholder="页面加载后等待秒数">
                <p style="margin: 3px 0 0 0; font-size: 12px; color: #666;">建议设置: 3-5秒，网络较慢时可适当增加</p>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="productIdsInput" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">
                    产品ID列表 (用逗号或换行分隔):
                </label>
                <textarea id="productIdsInput" rows="5" style="width: 100%; padding: 10px; border: 2px solid #e1e5e9; border-radius: 8px; resize: vertical; font-family: monospace; font-size: 13px;" placeholder="例如: 1600542164490, 123456, 789012&#10;或每行一个ID"></textarea>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="saveIdsBtn" style="flex: 1; padding: 10px; background: #52c41a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s;">
                    保存ID列表
                </button>
                <button id="startBtn" style="flex: 1; padding: 10px; background: #1677ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s;">
                    开始批量收藏
                </button>
            </div>

            <div style="text-align: center; margin-bottom: 15px;">
                <button id="resetBtn" style="padding: 8px 18px; background: #f5222d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s; margin-right: 10px;">
                    重置进度
                </button>
                <button id="debugBtn" style="padding: 8px 18px; background: #722ed1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s;">
                    调试收藏按钮
                </button>
            </div>

            <div style="margin-top: 15px; padding: 12px; background: #fff7e6; border: 1px solid #ffd591; border-radius: 6px;">
                <p style="margin: 0; font-size: 12px; color: #d46b08;">
                    💡 <strong>提示:</strong> 输入产品ID后先点击保存，再点击开始收藏
                </p>
            </div>
        `;

        document.body.appendChild(panel);

        // 填充已保存的ID到输入框
        const inputElement = document.getElementById('productIdsInput');
        inputElement.value = productIds.join('\n');

        // 填充已保存的等待时长
        const waitDurationInput = document.getElementById('waitDurationInput');
        waitDurationInput.value = getWaitDuration();

        // 更新进度显示
        updateProgressDisplay();

        // 关闭按钮事件
        document.getElementById('closePanelBtn').addEventListener('click', () => {
            panel.remove();
        });

        // 点击面板外部关闭
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });

        // 保存ID列表按钮事件
        document.getElementById('saveIdsBtn').addEventListener('click', () => {
            // 获取输入框内容并处理
            let input = inputElement.value.trim();
            if (!input) {
                alert('请输入产品ID列表');
                return;
            }

            // 处理用逗号或换行分隔的ID
            let ids = input.split(/[,，\n]+/)
                .map(id => id.trim())
                .filter(id => id); // 过滤空值

            if (ids.length === 0) {
                alert('未识别到有效的产品ID');
                return;
            }

            // 清空之前的收藏记录，开始新的批次
            localStorage.removeItem('aliFavoriteSuccessRecords');
            localStorage.removeItem('aliFavoriteFailRecords');
            localStorage.removeItem('aliFavoriteUnavailableRecords');
            localStorage.removeItem('aliFavoriteProcessed');
            localStorage.removeItem('aliFavoriteRetryCount');

            // 保存等待时长设置
            const waitDuration = document.getElementById('waitDurationInput').value;
            localStorage.setItem('aliFavoriteWaitDuration', waitDuration);

            // 保存到本地存储和变量
            productIds = ids;
            localStorage.setItem('aliFavoriteProductIds', JSON.stringify(ids));

            alert(`已保存 ${ids.length} 个产品ID，等待时长: ${waitDuration}秒，开始新的收藏批次`);
            // 更新进度显示
            updateProgressDisplay();
        });

        // 开始按钮事件
        document.getElementById('startBtn').addEventListener('click', () => {
            if (productIds.length === 0) {
                alert('请先输入并保存产品ID列表');
                return;
            }

            // 重新获取最新的未处理ID列表
            const currentProcessedIds = JSON.parse(localStorage.getItem('aliFavoriteProcessed') || '[]');
            const currentUnprocessedIds = productIds.filter(id => !currentProcessedIds.includes(id));

            const firstId = currentUnprocessedIds[0];
            if (firstId) {
                console.log(`开始处理第一个产品: ${firstId}`);
                // 第一个产品在新窗口打开，后续产品在当前窗口处理
                window.open(`https://www.alibaba.com/product-detail/a_${firstId}.html`, '_blank');
            } else {
                alert('所有产品已处理完毕！');
            }
        });

        // 重置按钮事件
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('确定要重置处理进度吗？')) {
                localStorage.removeItem('aliFavoriteProcessed');
                location.reload();
            }
        });

        // 调试按钮事件
        document.getElementById('debugBtn').addEventListener('click', () => {
            debugFavoriteButton();
        });

        // 按钮悬停效果
        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '0.8';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '1';
            });
        });
    }

    // 更新进度显示
    function updateProgressDisplay() {
        const progressElement = document.getElementById('progressText');
        if (progressElement) {
            const currentProcessedIds = JSON.parse(localStorage.getItem('aliFavoriteProcessed') || '[]');
            const currentUnprocessedIds = productIds.filter(id => !currentProcessedIds.includes(id));
            progressElement.textContent = `已处理: ${currentProcessedIds.length}/${productIds.length}，剩余: ${currentUnprocessedIds.length}`;
        }
    }

    // 导出结果表格
    function exportResultsTable() {
        const successRecords = JSON.parse(localStorage.getItem('aliFavoriteSuccessRecords') || '[]');
        const failRecords = JSON.parse(localStorage.getItem('aliFavoriteFailRecords') || '[]');
        const unavailableRecords = JSON.parse(localStorage.getItem('aliFavoriteUnavailableRecords') || '[]');

        if (successRecords.length === 0 && failRecords.length === 0 && unavailableRecords.length === 0) {
            alert('暂无收藏记录可导出');
            return;
        }

        // 创建表格数据
        let csvContent = '产品ID,状态,时间,URL,失败原因\n';

        // 添加成功记录
        successRecords.forEach(record => {
            const status = record.status === 'already_favorited' ? '已收藏' : '收藏成功';
            csvContent += `${record.id},${status},${record.timestamp},${record.url},\n`;
        });

        // 添加失败记录
        failRecords.forEach(record => {
            csvContent += `${record.id},失败,${record.timestamp},${record.url},${record.reason || ''}\n`;
        });

        // 添加不可用记录
        unavailableRecords.forEach(record => {
            csvContent += `${record.id},商品不可用,${record.timestamp},${record.url},${record.reason || ''}\n`;
        });

        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `收藏结果_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 显示统计信息
        const totalCount = successRecords.length + failRecords.length + unavailableRecords.length;
        const successCount = successRecords.length;
        const failCount = failRecords.length;
        const unavailableCount = unavailableRecords.length;

        alert(`导出完成！\n总计: ${totalCount} 个产品\n成功: ${successCount} 个\n失败: ${failCount} 个\n不可用: ${unavailableCount} 个`);
    }

    // 自动导出收藏结果
    function autoExportResults() {
        const successRecords = JSON.parse(localStorage.getItem('aliFavoriteSuccessRecords') || '[]');
        const failRecords = JSON.parse(localStorage.getItem('aliFavoriteFailRecords') || '[]');
        const unavailableRecords = JSON.parse(localStorage.getItem('aliFavoriteUnavailableRecords') || '[]');

        if (successRecords.length === 0 && failRecords.length === 0 && unavailableRecords.length === 0) {
            console.log('暂无收藏记录可导出');
            return;
        }

        // 创建表格数据
        let csvContent = '产品ID,状态,时间,URL,失败原因\n';

        // 添加成功记录
        successRecords.forEach(record => {
            const status = record.status === 'already_favorited' ? '已收藏' : '收藏成功';
            csvContent += `${record.id},${status},${record.timestamp},${record.url},\n`;
        });

        // 添加失败记录
        failRecords.forEach(record => {
            csvContent += `${record.id},失败,${record.timestamp},${record.url},${record.reason || ''}\n`;
        });

        // 添加不可用记录
        unavailableRecords.forEach(record => {
            csvContent += `${record.id},商品不可用,${record.timestamp},${record.url},${record.reason || ''}\n`;
        });

        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `收藏结果_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 显示统计信息
        const totalCount = successRecords.length + failRecords.length + unavailableRecords.length;
        const successCount = successRecords.length;
        const failCount = failRecords.length;
        const unavailableCount = unavailableRecords.length;

        console.log(`自动导出完成！\n总计: ${totalCount} 个产品\n成功: ${successCount} 个\n失败: ${failCount} 个\n不可用: ${unavailableCount} 个`);

        // 显示完成提示
        alert(`🎉 批量收藏完成！\n\n📊 统计结果:\n总计: ${totalCount} 个产品\n成功: ${successCount} 个\n失败: ${failCount} 个\n不可用: ${unavailableCount} 个\n\n📁 结果已自动导出到: 收藏结果_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.csv`);
    }
})();