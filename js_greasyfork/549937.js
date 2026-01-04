// ==UserScript==
// @name         商城自动抢购助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  支持各大商城的自动抢购工具，可识别商品、自动下单、定时抢购
// @author       shenfangda
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/549937/%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549937/%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预定义的商城规则
    const siteRules = {
        'jd.com': {
            name: '京东',
            productSelectors: ['.sku-name', '.p-name'],
            priceSelectors: ['.price', '.p-price .price'],
            buyButtonSelectors: ['#InitCartUrl', '.btn-add', '.submit-btn'],
            cartButtonSelectors: ['.cart-btn', '#GotoShoppingCart'],
            checkoutSelectors: ['.submit-btn', '.checkout-submit']
        },
        'taobao.com': {
            name: '淘宝',
            productSelectors: ['.tb-main-title', '.title'],
            priceSelectors: ['.tb-rmb-num', '.price'],
            buyButtonSelectors: ['.tb-btn-add', '#J_AddCart'],
            cartButtonSelectors: ['.cart-button', '.shopcart-link'],
            checkoutSelectors: ['.go-btn', '.submit-btn']
        },
        'tmall.com': {
            name: '天猫',
            productSelectors: ['.tb-detail-hd h1', '.product-title'],
            priceSelectors: ['.tm-price', '.price'],
            buyButtonSelectors: ['.tb-btn-add', '#J_AddCart'],
            cartButtonSelectors: ['.cart-button', '.shopcart-link'],
            checkoutSelectors: ['.go-btn', '.submit-btn']
        },
        'suning.com': {
            name: '苏宁易购',
            productSelectors: ['.proinfo-title', '.product-title'],
            priceSelectors: ['.price-box .price', '.mainprice'],
            buyButtonSelectors: ['.addcart-btn', '#addToCart'],
            cartButtonSelectors: ['.cart-link', '.goto-cart'],
            checkoutSelectors: ['.checkout-btn', '.submit-order']
        }
    };

    // 创建设置面板
    function createPanel() {
        // 添加样式
        GM_addStyle(`
            #auto-buy-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
            }
            #auto-buy-panel h3 {
                margin-top: 0;
                color: #333;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            #auto-buy-panel label {
                display: block;
                margin: 10px 0 5px;
                font-weight: bold;
                color: #555;
            }
            #auto-buy-panel input, #auto-buy-panel select {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            #auto-buy-panel button {
                padding: 10px 15px;
                margin: 5px 5px 5px 0;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            #auto-buy-panel .btn-start {
                background: #4CAF50;
                color: white;
            }
            #auto-buy-panel .btn-stop {
                background: #f44336;
                color: white;
            }
            #auto-buy-panel .btn-test {
                background: #2196F3;
                color: white;
            }
            #auto-buy-panel .status {
                margin-top: 15px;
                padding: 10px;
                border-radius: 4px;
                font-weight: bold;
            }
            #auto-buy-panel .status.info { background: #e3f2fd; color: #1976d2; }
            #auto-buy-panel .status.success { background: #e8f5e9; color: #388e3c; }
            #auto-buy-panel .status.warning { background: #fff3e0; color: #f57c00; }
            #auto-buy-panel .status.error { background: #ffebee; color: #d32f2f; }
            #auto-buy-panel .product-info {
                margin: 15px 0;
                padding: 10px;
                background: #f9f9f9;
                border-radius: 4px;
                border-left: 3px solid #4CAF50;
            }
        `);

        const panel = document.createElement('div');
        panel.id = 'auto-buy-panel';
        
        // 检测当前网站
        const currentSite = Object.keys(siteRules).find(domain => 
            window.location.hostname.includes(domain)
        );
        const siteName = currentSite ? siteRules[currentSite].name : '未知网站';
        
        panel.innerHTML = `
            <h3>商城自动抢购助手</h3>
            <div>当前网站: <strong>${siteName}</strong></div>
            
            <label>商品选择器:</label>
            <input type="text" id="product-selector" placeholder="商品名称选择器，如 .sku-name">
            
            <label>价格选择器:</label>
            <input type="text" id="price-selector" placeholder="价格选择器，如 .price">
            
            <label>购买按钮选择器:</label>
            <input type="text" id="buy-button-selector" placeholder="加入购物车按钮，如 #InitCartUrl">
            
            <label>购物车按钮选择器:</label>
            <input type="text" id="cart-button-selector" placeholder="去购物车结算按钮，如 .cart-btn">
            
            <label>结算按钮选择器:</label>
            <input type="text" id="checkout-button-selector" placeholder="提交订单按钮，如 .submit-btn">
            
            <label>抢购时间:</label>
            <input type="datetime-local" id="buy-time">
            
            <label>重复尝试间隔(毫秒):</label>
            <input type="number" id="retry-interval" value="1000" min="100">
            
            <div style="margin-top: 15px;">
                <button id="start-btn" class="btn-start">开始抢购</button>
                <button id="stop-btn" class="btn-stop">停止</button>
                <button id="test-btn" class="btn-test">测试选择器</button>
                <button id="auto-detect-btn" class="btn-test">自动识别</button>
            </div>
            
            <div id="product-info" class="product-info" style="display: none;">
                <div>商品: <span id="product-name">-</span></div>
                <div>价格: <span id="product-price">-</span></div>
            </div>
            
            <div id="status" class="status info">就绪</div>
        `;
        
        document.body.appendChild(panel);
        
        // 绑定事件
        document.getElementById('start-btn').addEventListener('click', startAutoBuy);
        document.getElementById('stop-btn').addEventListener('click', stopAutoBuy);
        document.getElementById('test-btn').addEventListener('click', testSelectors);
        document.getElementById('auto-detect-btn').addEventListener('click', autoDetect);
        
        // 如果检测到已知网站，自动填充选择器
        if (currentSite) {
            const rules = siteRules[currentSite];
            document.getElementById('product-selector').value = rules.productSelectors[0] || '';
            document.getElementById('price-selector').value = rules.priceSelectors[0] || '';
            document.getElementById('buy-button-selector').value = rules.buyButtonSelectors[0] || '';
            document.getElementById('cart-button-selector').value = rules.cartButtonSelectors[0] || '';
            document.getElementById('checkout-button-selector').value = rules.checkoutSelectors[0] || '';
        }
    }

    let buyTimer = null;
    let retryInterval = null;
    let isBuying = false;

    // 开始自动购买
    function startAutoBuy() {
        if (isBuying) {
            updateStatus('已经在抢购中...', 'warning');
            return;
        }
        
        const buyTime = document.getElementById('buy-time').value;
        const interval = parseInt(document.getElementById('retry-interval').value) || 1000;
        
        if (!buyTime) {
            updateStatus('请选择抢购时间', 'error');
            return;
        }
        
        isBuying = true;
        updateStatus('抢购任务已启动，等待抢购时间...', 'info');
        
        // 设置定时抢购
        const targetTime = new Date(buyTime).getTime();
        const now = new Date().getTime();
        const delay = targetTime - now;
        
        if (delay <= 0) {
            updateStatus('设置的时间已过期', 'error');
            isBuying = false;
            return;
        }
        
        // 更新倒计时显示
        updateCountdown(targetTime);
        
        buyTimer = setTimeout(() => {
            executeBuyProcess();
            // 设置重复尝试
            retryInterval = setInterval(executeBuyProcess, interval);
        }, delay);
    }

    // 执行购买流程
    function executeBuyProcess() {
        if (!isBuying) return;
        
        updateStatus('正在执行抢购...', 'info');
        
        try {
            // 1. 点击购买按钮
            const buyButtonSelector = document.getElementById('buy-button-selector').value;
            if (buyButtonSelector) {
                const buyButton = document.querySelector(buyButtonSelector);
                if (buyButton) {
                    buyButton.click();
                    updateStatus('已点击购买按钮', 'success');
                } else {
                    updateStatus('未找到购买按钮', 'warning');
                }
            }
            
            // 2. 点击购物车按钮
            const cartButtonSelector = document.getElementById('cart-button-selector').value;
            if (cartButtonSelector) {
                const cartButton = document.querySelector(cartButtonSelector);
                if (cartButton) {
                    cartButton.click();
                    updateStatus('已跳转到购物车', 'success');
                }
            }
            
            // 3. 点击结算按钮
            const checkoutSelector = document.getElementById('checkout-button-selector').value;
            if (checkoutSelector) {
                const checkoutButton = document.querySelector(checkoutSelector);
                if (checkoutButton) {
                    checkoutButton.click();
                    updateStatus('已提交订单', 'success');
                    // 成功后停止重复尝试
                    stopAutoBuy();
                    GM_notification({
                        title: '抢购成功',
                        text: '商品已成功下单，请尽快完成支付',
                        timeout: 10000
                    });
                }
            }
        } catch (error) {
            updateStatus('执行过程中出错: ' + error.message, 'error');
        }
    }

    // 更新倒计时
    function updateCountdown(targetTime) {
        const status = document.getElementById('status');
        const interval = setInterval(() => {
            if (!isBuying) {
                clearInterval(interval);
                return;
            }
            
            const now = new Date().getTime();
            const distance = targetTime - now;
            
            if (distance <= 0) {
                clearInterval(interval);
                return;
            }
            
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            status.innerHTML = `倒计时: ${hours}时${minutes}分${seconds}秒`;
            status.className = 'status warning';
        }, 1000);
    }

    // 停止自动购买
    function stopAutoBuy() {
        if (buyTimer) {
            clearTimeout(buyTimer);
            buyTimer = null;
        }
        
        if (retryInterval) {
            clearInterval(retryInterval);
            retryInterval = null;
        }
        
        isBuying = false;
        updateStatus('已停止抢购', 'info');
    }

    // 测试选择器
    function testSelectors() {
        updateStatus('正在测试选择器...', 'info');
        
        // 测试商品名称
        const productSelector = document.getElementById('product-selector').value;
        if (productSelector) {
            const productElement = document.querySelector(productSelector);
            if (productElement) {
                document.getElementById('product-name').textContent = productElement.textContent.trim();
            }
        }
        
        // 测试价格
        const priceSelector = document.getElementById('price-selector').value;
        if (priceSelector) {
            const priceElement = document.querySelector(priceSelector);
            if (priceElement) {
                document.getElementById('product-price').textContent = priceElement.textContent.trim();
            }
        }
        
        // 显示产品信息
        document.getElementById('product-info').style.display = 'block';
        
        // 测试按钮
        const selectors = [
            'buy-button-selector',
            'cart-button-selector', 
            'checkout-button-selector'
        ];
        
        let successCount = 0;
        for (const selectorId of selectors) {
            const selector = document.getElementById(selectorId).value;
            if (selector && document.querySelector(selector)) {
                successCount++;
            }
        }
        
        updateStatus(`选择器测试完成: ${successCount}/${selectors.length} 个按钮找到`, 
                    successCount > 0 ? 'success' : 'error');
    }

    // 自动识别
    function autoDetect() {
        updateStatus('正在自动识别网站元素...', 'info');
        
        // 检测当前网站
        const currentSite = Object.keys(siteRules).find(domain => 
            window.location.hostname.includes(domain)
        );
        
        if (currentSite) {
            const rules = siteRules[currentSite];
            document.getElementById('product-selector').value = rules.productSelectors[0] || '';
            document.getElementById('price-selector').value = rules.priceSelectors[0] || '';
            document.getElementById('buy-button-selector').value = rules.buyButtonSelectors[0] || '';
            document.getElementById('cart-button-selector').value = rules.cartButtonSelectors[0] || '';
            document.getElementById('checkout-button-selector').value = rules.checkoutSelectors[0] || '';
            
            updateStatus(`已为 ${rules.name} 自动配置选择器`, 'success');
        } else {
            updateStatus('未识别到支持的商城网站，请手动配置选择器', 'warning');
        }
    }

    // 更新状态显示
    function updateStatus(message, type = 'info') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = 'status ' + type;
    }

    // 初始化
    window.addEventListener('load', createPanel);
})();