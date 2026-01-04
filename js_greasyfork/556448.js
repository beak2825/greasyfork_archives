// ==UserScript==
// @name         Spaceship 域名查询增强工具
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  提取可注册域名，按价格排序，支持中国备案域名筛选，智能自动滚动加载
// @author       Orrin
// @match        https://*.spaceship.com/*
// @match        https://www.spaceship.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556448/Spaceship%20%E5%9F%9F%E5%90%8D%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/556448/Spaceship%20%E5%9F%9F%E5%90%8D%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 中国工信部允许备案的域名后缀列表
    const CHINA_APPROVED_TLDS = [
        '中国', 'cn', '政务.cn', '公益.cn', 'gov.cn', 'org.cn', 'ac.cn', 'mil.cn',
        'net.cn', 'edu.cn', 'com.cn', 'bj.cn', 'tj.cn', 'sh.cn', 'cq.cn', 'he.cn',
        'sx.cn', 'nm.cn', 'ln.cn', 'jl.cn', 'hl.cn', 'js.cn', 'zj.cn', 'ah.cn',
        'fj.cn', 'jx.cn', 'sd.cn', 'ha.cn', 'hb.cn', 'hn.cn', 'gd.cn', 'gx.cn',
        'hi.cn', 'sc.cn', 'gz.cn', 'yn.cn', 'xz.cn', 'sn.cn', 'qh.cn', 'nx.cn',
        'xj.cn', 'tw.cn', 'hk.cn', 'mo.cn', '政务', '公益', '公司', '网络', '网址',
        '商城', '网店', '中信', '商标', '广东', '佛山', '信息', '手机', '在线',
        '中文网', '集团', '我爱你', '商店', '企业', '娱乐', '游戏', '购物', '餐厅',
        '招聘', '时尚', '移动', '网站', '联通', '世界', '健康', '香港',
        'ren', 'wang', 'citic', 'top', 'sohu', 'xin', 'com', 'net', 'club',
        'xyz', 'site', 'shop', 'info', 'mobi', 'red', 'pro', 'kim', 'ltd',
        'group', 'biz', 'link', 'store', 'tech', 'fun', 'online', 'art', 'design',
        'love', 'center', 'video', 'social', 'team', 'show', 'cool', 'zone',
        'world', 'today', 'city', 'chat', 'company', 'live', 'fund', 'gold',
        'plus', 'guru', 'run', 'pub', 'email', 'life', 'co', 'baidu', 'cloud',
        'host', 'space', 'press', 'website', 'archi', 'asia', 'bio', 'black',
        'blue', 'green', 'lotto', 'organic', 'pet', 'pink', 'poker', 'promo',
        'ski', 'vote', 'voto', 'icu', 'fans', 'unicom', 'jpmorgan', 'chase',
        'cc', 'band', 'cab', 'cafe', 'cash', 'fan', 'fyi', 'games', 'market',
        'mba', 'news', 'media', 'sale', 'shopping', 'studio', 'tax', 'technology',
        'vin', 'baby', 'college', 'monster', 'protection', 'rent', 'security',
        'storage', 'theatre', 'bond', 'cyou', 'uno', 'school', 'global', 'me',
        'pw', 'hk', 'tv', 'saxo', 'click', 'auto', 'autos', 'beauty', 'boats',
        'car', 'cars', 'hair', 'homes', 'makeup', 'motorcycles', 'quest', 'skin',
        'tickets', 'yachts', 'kids', 'vip', 'beer', 'law', 'work', 'fashion',
        'luxe', 'yoga', 'fit', 'ink', 'wiki', 'anquan', 'yun'
    ];
    // 域名数据存储
    let domainData = [];
    let domainSet = new Set(); // 用于快速去重
    // 自动滚动控制
    let autoScrollEnabled = false;
    let lastDomainCount = 0;
    let noNewDomainsCount = 0;
    // 手动选择的滚动容器
    let manualScrollContainer = null;
    // 添加CSS样式
    GM_addStyle(`
        #domain-extractor-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 450px;
            max-height: 90vh;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            color: #2d3748;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
            flex-direction: column;
        }
        #domain-extractor-panel.show {
            display: flex;
        }
        .dep-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 6px 6px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .dep-header h3 {
            margin: 0;
            font-size: 16px;
        }
        .dep-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dep-close:hover {
            background: rgba(255,255,255,0.3);
        }
        .dep-controls {
            padding: 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
        }
        .dep-button-group {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }
        .dep-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            flex: 1;
            min-width: 100px;
        }
        .dep-btn-primary {
            background: #667eea;
            color: white;
        }
        .dep-btn-primary:hover {
            background: #5568d3;
        }
        .dep-btn-success {
            background: #48bb78;
            color: white;
        }
        .dep-btn-success:hover {
            background: #38a169;
        }
        .dep-btn-warning {
            background: #ed8936;
            color: white;
        }
        .dep-btn-warning:hover {
            background: #dd6b20;
        }
        .dep-btn-info {
            background: #4299e1;
            color: white;
        }
        .dep-btn-info:hover {
            background: #3182ce;
        }
        .dep-btn-danger {
            background: #f56565;
            color: white;
        }
        .dep-btn-danger:hover {
            background: #e53e3e;
        }
        .dep-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .dep-btn-active {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
            }
            50% {
                box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.15);
            }
        }
        .dep-filter-group {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .dep-checkbox {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
        }
        .dep-checkbox input {
            cursor: pointer;
        }
        .dep-stats {
            padding: 10px 15px;
            background: #e6f7ff;
            border-bottom: 1px solid #91d5ff;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
        }
        .dep-scroll-status {
            padding: 8px 15px;
            background: #fff7e6;
            border-bottom: 1px solid #ffd591;
            font-size: 12px;
            color: #d46b08;
            display: none;
        }
        .dep-scroll-status.active {
            display: block;
        }
        .dep-scroll-progress {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .dep-progress-bar {
            flex: 1;
            height: 4px;
            background: #ffd591;
            border-radius: 2px;
            overflow: hidden;
        }
        .dep-progress-fill {
            height: 100%;
            background: #fa8c16;
            transition: width 0.3s;
        }
        .dep-content {
            padding: 10px;
            overflow-y: auto;
            max-height: calc(90vh - 300px);
        }
        .dep-domain-item {
            padding: 10px;
            margin-bottom: 8px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s;
        }
        .dep-domain-item:hover {
            border-color: #667eea;
            box-shadow: 0 2px 8px rgba(102,126,234,0.1);
        }
        .dep-domain-info {
            flex: 1;
        }
        .dep-domain-name {
            font-weight: 600;
            font-size: 14px;
            color: #2d3748;
            margin-bottom: 4px;
        }
        .dep-domain-meta {
            font-size: 12px;
            color: #718096;
        }
        .dep-domain-price {
            font-size: 16px;
            font-weight: 700;
            color: #667eea;
            margin-left: 10px;
        }
        .dep-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 6px;
        }
        .dep-badge-china {
            background: #fef5e7;
            color: #d68910;
        }
        .dep-toggle-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 999998;
            transition: all 0.2s;
        }
        .dep-toggle-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .dep-empty {
            text-align: center;
            padding: 40px 20px;
            color: #a0aec0;
        }
        .dep-empty-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .dep-loading {
            text-align: center;
            padding: 20px;
            color: #667eea;
        }
        .dep-export-options {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e2e8f0;
        }
        .dep-scroll-settings {
            margin-top: 8px;
            padding: 10px;
            background: #f0f4f8;
            border-radius: 4px;
            font-size: 12px;
        }
        .dep-scroll-settings label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            color: #2d3748;
        }
        .dep-scroll-settings input[type="number"] {
            width: 60px;
            padding: 4px 8px;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
        }
        #dep-container-hint {
            font-size: 10px;
            color: #718096;
            margin-top: 4px;
            display: none;
        }
    `);
    // 解析价格（转换为数字）
    function parsePrice(priceText) {
        if (!priceText) return 0;
        const match = priceText.match(/[\d,]+\.?\d*/);
        if (match) {
            return parseFloat(match[0].replace(/,/g, ''));
        }
        return 0;
    }
    // 检查是否为中国备案支持的域名
    function isChinaApprovedDomain(tld) {
        const cleanTld = tld.toLowerCase().replace('.', '');
        return CHINA_APPROVED_TLDS.includes(cleanTld);
    }
    // 清空域名数据
    function clearDomainData() {
        domainData = [];
        domainSet.clear();
        console.log('已清空域名数据');
    }
    // 提取域名信息 - 累加模式
    // 提取域名信息 - 如果有价格未加载则等待重试
    // 修改 extractDomains 函数的重试部分
    async function extractDomains() {
        let newDomainsCount = 0;
        let hasZeroPrice = false;
        try {
            const availableDomains = document.querySelectorAll('[data-zid="RegularAvailableDomain"]');
            console.log(`当前 DOM 中的域名元素: ${availableDomains.length} 个`);
            availableDomains.forEach((item, index) => {
                try {
                    const nameElement = item.querySelector('.domain-name-wrapper');
                    if (!nameElement) return;
                    const domainText = nameElement.textContent.trim();
                    const tldElement = item.querySelector('.domains-tab-item__available__regular__text__tld');
                    const tld = tldElement ? tldElement.textContent.trim() : '';
                    // 排除续费价格
                    const allPrices = item.querySelectorAll('.product-price');
                    let priceElement = null;
                    for (let pe of allPrices) {
                        if (!pe.classList.contains('domains-tab-item__available__regular__price__renewal__line')) {
                            priceElement = pe;
                        }
                    }
                    const priceText = priceElement ? priceElement.textContent.trim() : '¥0';
                    const price = parsePrice(priceText);
                    // 检测价格是否为0
                    if (price === 0 && !domainSet.has(domainText)) {
                        hasZeroPrice = true;
                        console.log(`⚠️ 域名 ${domainText} 价格为0，可能未加载完成`);
                    }
                    const increaseElement = item.querySelector('.average-pricing-tag .gb-tag__text');
                    const priceIncrease = increaseElement ? increaseElement.textContent.trim() : '';
                    const fullDomain = domainText;
                    const isChinaApproved = isChinaApprovedDomain(tld);
                    if (!domainSet.has(fullDomain)) {
                        domainSet.add(fullDomain);
                        newDomainsCount++;
                        domainData.push({
                            domain: fullDomain,
                            tld: tld,
                            price: price,
                            priceText: priceText,
                            priceIncrease: priceIncrease,
                            isChinaApproved: isChinaApproved
                        });
                    }
                } catch (e) {
                    console.error(`提取域名 ${index} 时出错:`, e);
                }
            });
            if (newDomainsCount > 0) {
                console.log(`✓ 新增 ${newDomainsCount} 个域名，累计总数: ${domainData.length} 个`);
            } else {
                console.log(`当前批次无新域名，累计总数: ${domainData.length} 个`);
            }
            // 如果发现有价格为0的情况，等待后重新提取
            if (hasZeroPrice) {
                console.log('🔄 检测到价格未加载，等待500ms后重新提取...');
                await new Promise(resolve => setTimeout(resolve, 500));
                // 重新提取价格 - 修复选择器
                const availableDomainsRetry = document.querySelectorAll('[data-zid="RegularAvailableDomain"]');
                let updatedCount = 0;
                let stillZeroCount = 0; // 统计仍然为0的数量
                availableDomainsRetry.forEach((item) => {
                    try {
                        const nameElement = item.querySelector('.domain-name-wrapper');
                        if (!nameElement) return;
                        const domainText = nameElement.textContent.trim();

                        // ✅ 修复：使用相同的选择器逻辑
                        const allPrices = item.querySelectorAll('.product-price');
                        let priceElement = null;
                        for (let pe of allPrices) {
                            if (!pe.classList.contains('domains-tab-item__available__regular__price__renewal__line')) {
                                priceElement = pe;
                            }
                        }
                        const priceText = priceElement ? priceElement.textContent.trim() : '¥0';
                        const price = parsePrice(priceText);
                        // 找到对应的域名数据并更新价格
                        const domainIndex = domainData.findIndex(d => d.domain === domainText);
                        if (domainIndex !== -1 && domainData[domainIndex].price === 0) {
                            if (price > 0) {
                                domainData[domainIndex].price = price;
                                domainData[domainIndex].priceText = priceText;
                                updatedCount++;
                                console.log(`✓ 更新域名 ${domainText} 的价格: ${priceText}`);
                            } else {
                                stillZeroCount++;
                            }
                        }
                    } catch (e) {
                        console.error('重新提取价格出错:', e);
                    }
                });
                if (updatedCount > 0) {
                    console.log(`✓ 成功更新 ${updatedCount} 个域名的价格`);
                }
                if (stillZeroCount > 0) {
                    console.warn(`⚠️ 仍有 ${stillZeroCount} 个域名价格为0`);
                }
                // ✅ 如果还有价格为0，再等待一次
                if (stillZeroCount > 0) {
                    console.log('🔄 再次等待500ms...');
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // 第二次重试
                    const retryAgain = document.querySelectorAll('[data-zid="RegularAvailableDomain"]');
                    let finalUpdateCount = 0;

                    retryAgain.forEach((item) => {
                        try {
                            const nameElement = item.querySelector('.domain-name-wrapper');
                            if (!nameElement) return;
                            const domainText = nameElement.textContent.trim();

                            const allPrices = item.querySelectorAll('.product-price');
                            let priceElement = null;
                            for (let pe of allPrices) {
                                if (!pe.classList.contains('domains-tab-item__available__regular__price__renewal__line')) {
                                    priceElement = pe;
                                }
                            }
                            const priceText = priceElement ? priceElement.textContent.trim() : '¥0';
                            const price = parsePrice(priceText);
                            const domainIndex = domainData.findIndex(d => d.domain === domainText);
                            if (domainIndex !== -1 && domainData[domainIndex].price === 0 && price > 0) {
                                domainData[domainIndex].price = price;
                                domainData[domainIndex].priceText = priceText;
                                finalUpdateCount++;
                                console.log(`✓ 第二次更新域名 ${domainText} 的价格: ${priceText}`);
                            }
                        } catch (e) {
                            console.error('第二次重试出错:', e);
                        }
                    });

                    if (finalUpdateCount > 0) {
                        console.log(`✓ 第二次重试成功更新 ${finalUpdateCount} 个域名的价格`);
                    }
                }
            }
        } catch (e) {
            console.error('提取域名过程出错:', e);
            showNotification('提取域名时出现错误，请查看控制台', 'error');
        }
        return { total: domainData.length, newCount: newDomainsCount };
    }


    // 查找可滚动父元素
    function findScrollableParent(element) {
        let parent = element.parentElement;
        let depth = 0;
        const maxDepth = 15;

        while (parent && parent !== document.body && depth < maxDepth) {
            const style = window.getComputedStyle(parent);
            const isScrollable = ['auto', 'scroll'].includes(style.overflow) ||
                  ['auto', 'scroll'].includes(style.overflowY);

            if (isScrollable && parent.scrollHeight > parent.clientHeight + 10) {
                console.log(`在第 ${depth} 层找到可滚动父元素:`, {
                    element: parent,
                    scrollHeight: parent.scrollHeight,
                    clientHeight: parent.clientHeight,
                    scrollTop: parent.scrollTop
                });
                return parent;
            }

            parent = parent.parentElement;
            depth++;
        }

        console.log('未找到可滚动父元素');
        return null;
    }
    // 强制触发虚拟列表加载
    function triggerVirtualLoad(container) {
        console.log('尝试触发虚拟列表加载...');

        const originalScroll = container.scrollTop;
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            container.scrollTop = originalScroll + container.clientHeight * 0.7;
        }, 100);

        const scrollEvent = new Event('scroll', { bubbles: true });
        container.dispatchEvent(scrollEvent);

        const wheelEvent = new WheelEvent('wheel', {
            deltaY: 100,
            bubbles: true
        });
        container.dispatchEvent(wheelEvent);
    }
    // 滚动元素
    function scrollElement(container, resolve) {
        const currentScroll = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        console.log(`滚动信息 - 当前: ${currentScroll}, 总高度: ${scrollHeight}, 可见: ${clientHeight}`);

        const remainingScroll = scrollHeight - clientHeight - currentScroll;
        console.log(`剩余可滚动距离: ${remainingScroll}px`);

        if (remainingScroll < 50) {
            console.log('✓ 已到达容器底部');
            resolve(true);
            return;
        }

        const scrollStep = Math.min(clientHeight * 0.7, remainingScroll);
        const targetScroll = currentScroll + scrollStep;

        console.log(`准备滚动: 从 ${currentScroll} 到 ${targetScroll} (步进: ${scrollStep}px)`);

        try {
            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });

            setTimeout(() => {
                const actualScroll = container.scrollTop;
                console.log(`滚动后实际位置: ${actualScroll}px`);

                if (Math.abs(actualScroll - currentScroll) < 10) {
                    console.warn('⚠️ 滚动位置未改变，尝试强制触发加载');
                    triggerVirtualLoad(container);
                    setTimeout(() => resolve(false), 800);
                } else {
                    resolve(false);
                }
            }, 1000);

        } catch (e) {
            console.error('滚动出错:', e);
            container.scrollTop = targetScroll;
            setTimeout(() => resolve(false), 1000);
        }
    }
    // 滚动窗口
    function scrollWindow(resolve) {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;

        console.log(`窗口滚动信息 - 当前: ${currentScroll}, 总高度: ${scrollHeight}, 可见: ${clientHeight}`);

        const remainingScroll = scrollHeight - clientHeight - currentScroll;
        console.log(`窗口剩余可滚动距离: ${remainingScroll}px`);

        if (remainingScroll < 50) {
            console.log('✓ 已到达页面底部');
            resolve(true);
            return;
        }

        const scrollStep = Math.min(clientHeight * 0.7, remainingScroll);
        const targetScroll = currentScroll + scrollStep;

        console.log(`窗口准备滚动: 从 ${currentScroll} 到 ${targetScroll}`);

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        setTimeout(() => {
            const actualScroll = window.scrollY || document.documentElement.scrollTop;
            console.log(`窗口滚动后位置: ${actualScroll}px`);
            resolve(false);
        }, 1000);
    }
    // 智能滚动函数
    function smartScroll() {
        return new Promise((resolve) => {
            console.log('=== 开始查找滚动容器 ===');

            let scrollContainer = null;

            // 优先使用手动设置的容器
            if (manualScrollContainer) {
                console.log('使用手动设置的滚动容器');
                scrollContainer = manualScrollContainer;
            }

            // 方法1: 直接查找带有 data-test-id="virtuoso-scroller" 的元素
            if (!scrollContainer) {
                scrollContainer = document.querySelector('[data-test-id="virtuoso-scroller"]');
                if (scrollContainer) {
                    console.log('找到 virtuoso-scroller (方法1)');
                }
            }

            // 方法2: 查找 Virtuoso 的滚动包装器
            if (!scrollContainer) {
                const virtuosoRoot = document.querySelector('[data-virtuoso-scroller="true"]');
                if (virtuosoRoot) {
                    scrollContainer = virtuosoRoot;
                    console.log('找到 virtuoso-scroller (方法2)');
                }
            }

            // 方法3: 查找包含 virtuoso-item-list 的可滚动父元素
            if (!scrollContainer) {
                const itemList = document.querySelector('[data-testid="virtuoso-item-list"]');
                if (itemList) {
                    console.log('找到 item-list，开始向上查找滚动容器...');
                    scrollContainer = findScrollableParent(itemList);
                }
            }

            // 方法4: 查找所有可能的滚动容器
            if (!scrollContainer) {
                console.log('使用备选方案：查找所有可滚动元素');
                const allElements = document.querySelectorAll('*');
                for (let elem of allElements) {
                    const style = window.getComputedStyle(elem);
                    const isScrollable = ['auto', 'scroll'].includes(style.overflow) ||
                          ['auto', 'scroll'].includes(style.overflowY);

                    if (isScrollable && elem.scrollHeight > elem.clientHeight + 10) {
                        if (elem.querySelector('[data-zid="RegularAvailableDomain"]')) {
                            scrollContainer = elem;
                            console.log('找到包含域名列表的滚动容器:', elem);
                            break;
                        }
                    }
                }
            }

            // 如果还是没找到，尝试窗口滚动
            if (!scrollContainer) {
                console.log('未找到滚动容器，使用窗口滚动');
                scrollWindow(resolve);
                return;
            }

            // 验证找到的容器是否真的可以滚动
            const containerInfo = {
                scrollTop: scrollContainer.scrollTop,
                scrollHeight: scrollContainer.scrollHeight,
                clientHeight: scrollContainer.clientHeight,
                canScroll: scrollContainer.scrollHeight > scrollContainer.clientHeight
            };

            console.log('容器信息:', containerInfo);
            console.log('容器元素:', scrollContainer);

            if (!containerInfo.canScroll) {
                console.warn('容器不可滚动，尝试窗口滚动');
                scrollWindow(resolve);
                return;
            }

            // 执行滚动
            scrollElement(scrollContainer, resolve);
        });
    }
    // 自动滚动并提取
    // 自动滚动并提取 - 修改为支持 async extractDomains
    async function autoScrollAndExtract() {
        if (autoScrollEnabled) {
            stopAutoScroll();
            return;
        }
        clearDomainData();

        autoScrollEnabled = true;
        lastDomainCount = 0;
        noNewDomainsCount = 0;
        let consecutiveFailures = 0;
        const MAX_FAILURES = 5;
        const btn = document.getElementById('dep-auto-scroll');
        btn.textContent = '⏸ 停止滚动';
        btn.classList.add('dep-btn-active');
        const statusDiv = document.getElementById('dep-scroll-status');
        statusDiv.classList.add('active');
        updateScrollStatus('🚀 开始自动滚动加载...');
        while (autoScrollEnabled) {
            // 等待提取完成（包括重试）
            const result = await extractDomains();
            const currentTotal = result.total;
            const newCount = result.newCount;
            updateCurrentDisplay();
            if (newCount === 0) {
                noNewDomainsCount++;
                consecutiveFailures++;
                updateScrollStatus(`⏳ 未发现新域名 (${noNewDomainsCount}/3) - 累计: ${currentTotal} 个`);
                if (consecutiveFailures >= MAX_FAILURES) {
                    updateScrollStatus('⚠️ 加载似乎遇到问题，正在重试...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    consecutiveFailures = 0;
                    continue;
                }
                if (noNewDomainsCount >= 3) {
                    updateScrollStatus(`✅ 加载完成！共提取 ${currentTotal} 个域名`);
                    showNotification(`加载完成！共提取 ${currentTotal} 个可注册域名`, 'success');
                    stopAutoScroll();
                    break;
                }
            } else {
                noNewDomainsCount = 0;
                consecutiveFailures = 0;
                updateScrollStatus(`✨ 发现 ${newCount} 个新域名 (累计: ${currentTotal})...`);
                lastDomainCount = currentTotal;
            }
            const reachedBottom = await smartScroll();
            if (reachedBottom) {
                updateScrollStatus('🔍 已到达底部，最后确认...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                const finalResult = await extractDomains();
                updateCurrentDisplay();
                if (finalResult.newCount === 0) {
                    updateScrollStatus(`✅ 加载完成！共提取 ${finalResult.total} 个域名`);
                    showNotification(`加载完成！共提取 ${finalResult.total} 个可注册域名`, 'success');
                    stopAutoScroll();
                    break;
                } else {
                    console.log(`底部仍有新域名，继续加载...`);
                    lastDomainCount = finalResult.total;
                }
            }
            const baseInterval = parseInt(document.getElementById('dep-scroll-interval')?.value || 1000);
            const interval = consecutiveFailures > 0 ? baseInterval * 1.5 : baseInterval;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }

    // 停止自动滚动
    function stopAutoScroll() {
        autoScrollEnabled = false;
        const btn = document.getElementById('dep-auto-scroll');
        if (btn) {
            btn.textContent = '🔄 自动加载全部';
            btn.classList.remove('dep-btn-active');
        }
        const statusDiv = document.getElementById('dep-scroll-status');
        if (statusDiv) {
            setTimeout(() => {
                statusDiv.classList.remove('active');
            }, 3000);
        }
    }
    // 更新滚动状态
    function updateScrollStatus(message) {
        const statusText = document.getElementById('dep-scroll-status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }
    // 更新当前显示
    function updateCurrentDisplay() {
        const currentSort = document.getElementById('dep-sort-price')?.dataset.active === 'true' ? 'price' : 'name';
        const chinaFilterEnabled = document.getElementById('dep-filter-china')?.checked || false;
        let currentDomains = sortDomains(domainData, currentSort);
        const filtered = filterDomains(currentDomains, chinaFilterEnabled);
        renderDomains(filtered);
        updateStats(filtered, domainData.length);
    }
    // 排序域名
    function sortDomains(domains, sortBy = 'price') {
        const sorted = [...domains];
        if (sortBy === 'price') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'name') {
            sorted.sort((a, b) => a.domain.localeCompare(b.domain));
        }
        return sorted;
    }
    // 筛选域名
    function filterDomains(domains, chinaOnly = false) {
        if (chinaOnly) {
            return domains.filter(d => d.isChinaApproved);
        }
        return domains;
    }
    // 渲染域名列表
    function renderDomains(domains) {
        const contentDiv = document.getElementById('dep-domain-list');
        if (domains.length === 0) {
            contentDiv.innerHTML = `
                <div class="dep-empty">
                    <div class="dep-empty-icon">📭</div>
                    <div>未找到可注册域名</div>
                    <div style="margin-top: 8px; font-size: 12px;">请先在页面上搜索域名或点击"自动加载全部"</div>
                </div>
            `;
            return;
        }
        contentDiv.innerHTML = domains.map(domain => `
            <div class="dep-domain-item">
                <div class="dep-domain-info">
                    <div class="dep-domain-name">
                        ${domain.domain}
                        ${domain.isChinaApproved ? '<span class="dep-badge dep-badge-china">可备案</span>' : ''}
                    </div>
                    <div class="dep-domain-meta">
                        后缀: ${domain.tld}
                        ${domain.priceIncrease ? ` | 年均涨幅: ${domain.priceIncrease}` : ''}
                    </div>
                </div>
                <div class="dep-domain-price">${domain.priceText}</div>
            </div>
        `).join('');
    }
    // 更新统计信息
    function updateStats(filtered, total) {
        const statsDiv = document.getElementById('dep-stats');
        const chinaCount = filtered.filter(d => d.isChinaApproved).length;
        const totalChina = domainData.filter(d => d.isChinaApproved).length;
        const chinaFilterEnabled = document.getElementById('dep-filter-china')?.checked || false;

        statsDiv.innerHTML = `
            <span>显示:
<strong>${filtered.length}</strong> / 总计: <strong>${total}</strong></span>
            <span>可备案: <strong>${chinaFilterEnabled ? chinaCount : totalChina}</strong></span>
        `;
    }
    // 导出为文本
    function exportAsText(domains) {
        let text = '可注册域名列表\n';
        text += '=' .repeat(50) + '\n\n';
        domains.forEach((domain, index) => {
            text += `${index + 1}. ${domain.domain}\n`;
            text += `   价格: ${domain.priceText}\n`;
            text += `   后缀: ${domain.tld}\n`;
            text += `   可备案: ${domain.isChinaApproved ? '是' : '否'}\n`;
            if (domain.priceIncrease) {
                text += `   年均涨幅: ${domain.priceIncrease}\n`;
            }
            text += '\n';
        });
        return text;
    }
    // 导出为CSV
    function exportAsCSV(domains) {
        let csv = '域名,价格,后缀,可备案,年均涨幅\n';
        domains.forEach(domain => {
            csv += `"${domain.domain}","${domain.priceText}","${domain.tld}","${domain.isChinaApproved ? '是' : '否'}","${domain.priceIncrease}"\n`;
        });
        return csv;
    }
    // 导出为JSON
    function exportAsJSON(domains) {
        return JSON.stringify(domains, null, 2);
    }
    // 下载文件
    function downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    // 复制到剪贴板
    function copyDomainsToClipboard(domains) {
        const domainList = domains.map(d => d.domain).join('\n');

        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(domainList);
            showNotification(`已复制 ${domains.length} 个域名到剪贴板`, 'success');
        } else {
            navigator.clipboard.writeText(domainList).then(() => {
                showNotification(`已复制 ${domains.length} 个域名到剪贴板`, 'success');
            }).catch(() => {
                showNotification('复制失败，请使用导出功能', 'error');
            });
        }
    }
    // 调试函数：列出所有可滚动元素
    function debugScrollableElements() {
        console.log('=== 调试：查找所有可滚动元素 ===');
        const allElements = document.querySelectorAll('*');
        const scrollableElements = [];

        allElements.forEach(elem => {
            const style = window.getComputedStyle(elem);
            const isScrollable = ['auto', 'scroll'].includes(style.overflow) ||
                  ['auto', 'scroll'].includes(style.overflowY);

            if (isScrollable && elem.scrollHeight > elem.clientHeight) {
                const hasDomains = elem.querySelector('[data-zid="RegularAvailableDomain"]') !== null;
                scrollableElements.push({
                    element: elem,
                    tagName: elem.tagName,
                    className: elem.className,
                    scrollHeight: elem.scrollHeight,
                    clientHeight: elem.clientHeight,
                    scrollTop: elem.scrollTop,
                    hasDomains: hasDomains
                });
            }
        });

        console.log(`找到 ${scrollableElements.length} 个可滚动元素:`, scrollableElements);

        const domainContainers = scrollableElements.filter(s => s.hasDomains);
        console.log(`其中包含域名的容器:`, domainContainers);

        return scrollableElements;
    }
    // 创建面板
    function createPanel() {
        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'dep-toggle-btn';
        toggleBtn.className = 'dep-toggle-btn';
        toggleBtn.textContent = '🔍 域名提取工具';
        toggleBtn.onclick = () => {
            const panel = document.getElementById('domain-extractor-panel');
            panel.classList.toggle('show');
        };
        document.body.appendChild(toggleBtn);
        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'domain-extractor-panel';
        panel.innerHTML = `
            <div class="dep-header" id="dep-header">
                <h3>🔍 域名提取工具</h3>
                <button class="dep-close" id="dep-close">×</button>
            </div>
            <div class="dep-controls">
                <div class="dep-button-group">
                    <button class="dep-btn dep-btn-primary" id="dep-auto-scroll">🔄 自动加载全部</button>
                    <button class="dep-btn dep-btn-success" id="dep-extract">📥 提取当前</button>
                </div>
                <div class="dep-button-group">
                    <button class="dep-btn dep-btn-danger" id="dep-clear" style="flex: 0.5;">🗑️ 清空</button>
                    <button class="dep-btn dep-btn-danger" id="dep-debug" style="flex: 0.5;">🔧 调试</button>
                </div>
                <div class="dep-button-group">
                    <button class="dep-btn dep-btn-warning" id="dep-sort-price" data-active="true">💰 按价格</button>
                    <button class="dep-btn dep-btn-warning" id="dep-sort-name" data-active="false">🔤 按名称</button>
                </div>
                <div class="dep-filter-group">
                    <label class="dep-checkbox">
                        <input type="checkbox" id="dep-filter-china">
                        <span>仅显示可备案域名</span>
                    </label>
                </div>
                <div class="dep-scroll-settings">
                    <label>
                        <span>滚动间隔 (毫秒):</span>
                        <input type="number" id="dep-scroll-interval" value="1000" min="500" max="3000" step="100">
                    </label>
                    <div style="margin-top: 8px;">
                        <button class="dep-btn dep-btn-info" id="dep-select-container" style="width: 100%; font-size: 11px;">
                            🎯 手动选择滚动容器
                        </button>
                        <div id="dep-container-hint"></div>
                    </div>
                </div>
                <div class="dep-export-options">
                    <div class="dep-button-group">
                        <button class="dep-btn dep-btn-info" id="dep-copy-list">📋 复制</button>
                        <button class="dep-btn dep-btn-info" id="dep-export-txt">📄 TXT</button>
                        <button class="dep-btn dep-btn-info" id="dep-export-csv">📊 CSV</button>
                        <button class="dep-btn dep-btn-info" id="dep-export-json">💾 JSON</button>
                    </div>
                </div>
            </div>
            <div class="dep-scroll-status" id="dep-scroll-status">
                <div class="dep-scroll-progress">
                    <span id="dep-scroll-status-text">准备中...</span>
                </div>
            </div>
            <div class="dep-stats" id="dep-stats">
                <span>显示: <strong>0</strong> / 总计: <strong>0</strong></span>
                <span>可备案: <strong>0</strong></span>
            </div>
            <div class="dep-content" id="dep-domain-list">
                <div class="dep-empty">
                    <div class="dep-empty-icon">👋</div>
                    <div>点击"自动加载全部"开始</div>
                    <div style="margin-top: 8px; font-size: 12px;">将自动滚动页面并提取所有域名</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        // 绑定事件
        setupEventListeners();
        // 实现拖拽功能
        makeDraggable(panel);
    }
    // 设置事件监听器
    function setupEventListeners() {
        let currentSort = 'price';
        let chinaFilterEnabled = false;
        let currentDomains = [];
        // 关闭按钮
        document.getElementById('dep-close').onclick = () => {
            document.getElementById('domain-extractor-panel').classList.remove('show');
        };
        // 自动滚动加载
        document.getElementById('dep-auto-scroll').onclick = () => {
            autoScrollAndExtract();
        };
        // 提取当前域名
        // 提取当前域名 - 支持 async
        document.getElementById('dep-extract').onclick = async () => {
            const btn = document.getElementById('dep-extract');
            btn.textContent = '提取中...';
            btn.disabled = true;
            clearDomainData();

            const result = await extractDomains();

            currentDomains = sortDomains(domainData, currentSort);
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            renderDomains(filtered);
            updateStats(filtered, domainData.length);
            btn.textContent = '📥 提取当前';
            btn.disabled = false;
            if (result.total > 0) {
                showNotification(`成功提取 ${result.total} 个可注册域名！`, 'success');
            } else {
                showNotification('未找到可注册域名，请确认页面已加载完成', 'warning');
            }
        };

        // 清空数据
        document.getElementById('dep-clear').onclick = () => {
            if (domainData.length === 0) {
                showNotification('数据已经是空的', 'info');
                return;
            }

            const count = domainData.length;
            clearDomainData();

            currentDomains = [];
            renderDomains([]);
            updateStats([], 0);

            showNotification(`已清空 ${count} 个域名数据`, 'success');
        };
        // 调试按钮
        document.getElementById('dep-debug').onclick = () => {
            console.log('=== 开始调试模式 ===');

            const scrollables = debugScrollableElements();

            const domainElements = document.querySelectorAll('[data-zid="RegularAvailableDomain"]');
            console.log(`当前页面域名元素数量: ${domainElements.length}`);

            console.log('执行测试滚动...');
            smartScroll().then(isBottom => {
                console.log(`测试滚动结果: ${isBottom ? '已到底部' : '未到底部'}`);

                setTimeout(() => {
                    const newCount = document.querySelectorAll('[data-zid="RegularAvailableDomain"]').length;
                    console.log(`滚动后域名元素数量: ${newCount}`);

                    if (newCount === domainElements.length) {
                        console.warn('⚠️ 滚动后域名数量未增加！可能的原因:');
                        console.warn('1. 已经加载完所有域名');
                        console.warn('2. 滚动容器识别错误');
                        console.warn('3. 网站使用了特殊的虚拟滚动');
                    } else {
                        console.log(`✓ 滚动成功，新增 ${newCount - domainElements.length} 个域名`);
                    }
                }, 2000);
            });

            showNotification('调试信息已输出到控制台 (F12)', 'info');
        };
        // 按价格排序
        document.getElementById('dep-sort-price').onclick = () => {
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                return;
            }
            currentSort = 'price';
            document.getElementById('dep-sort-price').dataset.active = 'true';
            document.getElementById('dep-sort-name').dataset.active = 'false';
            currentDomains = sortDomains(domainData, 'price');
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            renderDomains(filtered);
            updateStats(filtered, domainData.length);
            showNotification('已按价格从低到高排序', 'success');
        };
        // 按名称排序
        document.getElementById('dep-sort-name').onclick = () => {
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                return;
            }
            currentSort = 'name';
            document.getElementById('dep-sort-price').dataset.active = 'false';
            document.getElementById('dep-sort-name').dataset.active = 'true';
            currentDomains = sortDomains(domainData, 'name');
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            renderDomains(filtered);
            updateStats(filtered, domainData.length);
            showNotification('已按名称排序', 'success');
        };
        // 筛选可备案域名
        document.getElementById('dep-filter-china').onchange = (e) => {
            chinaFilterEnabled = e.target.checked;
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                e.target.checked = false;
                return;
            }
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            renderDomains(filtered);
            updateStats(filtered, domainData.length);
            if (chinaFilterEnabled) {
                showNotification(`筛选出 ${filtered.length} 个可备案域名`, 'success');
            }
        };
        // 手动选择滚动容器
        document.getElementById('dep-select-container').onclick = () => {
            const hint = document.getElementById('dep-container-hint');
            hint.style.display = 'block';
            hint.textContent = '请移动鼠标到域名列表的滚动区域并点击...';

            const style = document.createElement('style');
            style.id = 'dep-selector-style';
            style.textContent = `
                * { cursor: crosshair !important; }
                *:hover { outline: 3px solid #667eea !important; }
            `;
            document.head.appendChild(style);

            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const target = e.target;
                console.log('用户选择的元素:', target);

                const style = window.getComputedStyle(target);
                const isScrollable = ['auto', 'scroll'].includes(style.overflow) ||
                      ['auto', 'scroll'].includes(style.overflowY);

                if (isScrollable && target.scrollHeight > target.clientHeight) {
                    manualScrollContainer = target;
                    hint.textContent = '✓ 已选择滚动容器！';
                    hint.style.color = '#48bb78';
                    console.log('手动设置滚动容器:', target);
                    showNotification('滚动容器已设置，现在可以开始自动加载', 'success');
                } else {
                    hint.textContent = '⚠️ 该元素不可滚动，请重试';
                    hint.style.color = '#f56565';
                    showNotification('该元素不可滚动，请选择其他元素', 'warning');
                }

                document.getElementById('dep-selector-style')?.remove();
                document.removeEventListener('click', clickHandler, true);

                setTimeout(() => {
                    hint.style.display = 'none';
                    hint.style.color = '#718096';
                }, 3000);
            };

            document.addEventListener('click', clickHandler, true);
        };
        // 复制列表
        document.getElementById('dep-copy-list').onclick = () => {
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                return;
            }
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            copyDomainsToClipboard(filtered);
        };
        // 导出TXT
        document.getElementById('dep-export-txt').onclick = () => {
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                return;
            }
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            const text = exportAsText(filtered);
            downloadFile(text, `域名列表_${new Date().toISOString().slice(0,10)}.txt`, 'text/plain; charset=utf-8');
            showNotification('TXT文件已导出', 'success');
        };
        // 导出CSV
        document.getElementById('dep-export-csv').onclick = () => {
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                return;
            }
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            const csv = exportAsCSV(filtered);
            downloadFile(csv, `域名列表_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv; charset=utf-8');
            showNotification('CSV文件已导出', 'success');
        };
        // 导出JSON
        document.getElementById('dep-export-json').onclick = () => {
            if (domainData.length === 0) {
                showNotification('请先提取域名', 'warning');
                return;
            }
            const filtered = filterDomains(currentDomains, chinaFilterEnabled);
            const json = exportAsJSON(filtered);
            downloadFile(json, `域名列表_${new Date().toISOString().slice(0,10)}.json`, 'application/json');
            showNotification('JSON文件已导出', 'success');
        };
    }
    // 实现拖拽功能
    function makeDraggable(element) {
        const header = document.getElementById('dep-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#48bb78',
            warning: '#ed8936',
            info: '#4299e1',
            error: '#f56565'
        };
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-size: 14px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    // 监听页面变化（适应动态加载）
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            if (autoScrollEnabled) {
                const currentCount = document.querySelectorAll('[data-zid="RegularAvailableDomain"]').length;
                if (currentCount > 0) {
                    // 实时更新逻辑
                }
            }
        });
        const targetNode = document.querySelector('[data-testid="virtuoso-item-list"]');
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
    }
    // 在控制台暴露调试函数
    window.debugScrollableElements = debugScrollableElements;
    window.getDomainData = () => {
        console.log('=== 当前域名数据 ===');
        console.log(`总数: ${domainData.length}`);
        console.log(`Set 大小: ${domainSet.size}`);
        console.log('域名列表:', domainData.map(d => d.domain));

        const domains = domainData.map(d => d.domain);
        const duplicates = domains.filter((item, index) => domains.indexOf(item) !== index);
        if (duplicates.length > 0) {
            console.warn('发现重复域名:', duplicates);
        } else {
            console.log('✓ 无重复域名');
        }

        return domainData;
    };
    window.checkDuplicates = () => {
        const domains = domainData.map(d => d.domain);
        const unique = new Set(domains);
        console.log(`总数: ${domains.length}, 唯一: ${unique.size}, 重复: ${domains.length - unique.size}`);
    };
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    createPanel();
                    observePageChanges();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                createPanel();
                observePageChanges();
            }, 1000);
        }
        console.log('域名提取工具已加载 v2.0');
        console.log('功能：');
        console.log('- 🔄 自动加载全部：智能滚动页面加载所有域名');
        console.log('- 📥 提取当前：提取当前已加载的域名');
        console.log('- 🗑️ 清空：清空已提取的数据');
        console.log('- 🔧 调试：输出调试信息到控制台');
        console.log('- 💰 按价格排序：从低到高排序');
        console.log('- 🔤 按名称排序：字母顺序排序');
        console.log('- 可备案筛选：筛选中国工信部支持的域名后缀');
        console.log('- 导出功能：支持复制、TXT、CSV、JSON格式');
        console.log('- 🎯 手动选择滚动容器：适配特殊页面结构');
    }
    // 启动脚本
    init();
})();
