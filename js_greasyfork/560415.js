// ==UserScript==
// @name         药师帮优惠券自动领取
// @namespace    https://dian.ysbang.cn/index.html#/couponCenter?trafficType=4
// @version      1.0
// @description  自动领取药师帮优惠券中心的所有优惠券，支持查看更多店铺券，后台运行，实时统计
// @author       www.fanooo.com
// @match        https://dian.ysbang.cn/index.html#/couponCenter
// @icon         https://staticd.ysbang.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560415/%E8%8D%AF%E5%B8%88%E5%B8%AE%E4%BC%98%E6%83%A0%E5%88%B8%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560415/%E8%8D%AF%E5%B8%88%E5%B8%AE%E4%BC%98%E6%83%A0%E5%88%B8%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .ysb-status {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background-color: rgba(255,255,255,0.9);
            padding: 10px 15px;
            border-radius: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 14px;
            max-width: 300px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .ysb-total-count {
            font-weight: bold;
            color: #3a86ff;
        }
    `;
    document.head.appendChild(style);
    
    // 创建状态元素
    const statusElement = document.createElement('div');
    statusElement.className = 'ysb-status';
    
    // 创建统计元素
    const totalElement = document.createElement('div');
    totalElement.className = 'ysb-total-count';
    totalElement.textContent = '已领取总数: 0';
    
    // 创建状态文本元素
    const statusText = document.createElement('div');
    statusText.textContent = '正在初始化...';
    
    statusElement.appendChild(totalElement);
    statusElement.appendChild(statusText);
    document.body.appendChild(statusElement);
    
    // 主功能
    let totalCollected = 0; // 新增统计变量
    let isRunning = true;
    let stopFlag = false;
    
    // 更新统计显示
    const updateTotalDisplay = () => {
        totalElement.textContent = `已领取总数: ${totalCollected}`;
    };
    
    // 等待页面加载完成
    const waitForPageReady = () => {
        return new Promise((resolve) => {
            const checkReady = () => {
                if (document.querySelector('.coupon-list') || document.querySelector('.home-first-box')) {
                    resolve();
                } else {
                    setTimeout(checkReady, 1000);
                }
            };
            checkReady();
        });
    };
    
    // 开始自动领取
    const startAutoCollect = async () => {
        if (stopFlag) return;
        
        // 等待页面加载完成
        statusText.textContent = '等待页面加载...';
        await waitForPageReady();
        
        // 开始领取流程
        findCoupons();
    };
    
    // 查找优惠券
    const findCoupons = () => {
        if (stopFlag) return;
        
        statusText.textContent = '正在查找优惠券...';
        
        // 根据实际页面结构查找优惠券按钮
        const couponButtons = document.querySelectorAll('.coupon-list-item .box-content, .home-first-box .box-content, .btn-box .box-content');
        const coupons = [];
        
        couponButtons.forEach(btn => {
            // 确保按钮可见且可点击
            if (btn.offsetWidth > 0 && btn.offsetHeight > 0) {
                // 检查按钮文本内容
                const btnText = btn.textContent.replace(/\s+/g, '').trim();
                if ((btnText === '立即领取' || btnText === '领取' || btnText === '立即<br>领取') && !btn.disabled) {
                    coupons.push(btn);
                }
            }
        });
        
        if (coupons.length > 0) {
            statusText.textContent = `找到 ${coupons.length} 张优惠券`;
            setTimeout(() => processCoupons(coupons), 1000);
        } else {
            // 如果没有找到，尝试加载更多优惠券
            tryLoadMoreCoupons();
        }
    };
    
    // 尝试加载更多优惠券
    const tryLoadMoreCoupons = () => {
        if (stopFlag) return;
        
        statusText.textContent = '尝试加载更多优惠券...';
        
        // 查找"查看更多店铺券"按钮
        const loadMoreButton = document.querySelector('.more-selected-coupons .note');
        
        if (loadMoreButton) {
            // 模拟点击加载更多按钮
            simulateClick(loadMoreButton);
            
            setTimeout(() => {
                // 再次尝试查找优惠券
                findCoupons();
            }, 3000);
        } else {
            // 如果仍然没有找到，尝试滚动加载
            scrollAndLoadCoupons();
        }
    };
    
    // 滚动加载更多优惠券
    const scrollAndLoadCoupons = () => {
        if (stopFlag) return;
        
        // 滚动到底部以加载更多优惠券
        window.scrollTo(0, document.body.scrollHeight);
        
        setTimeout(() => {
            // 再次尝试查找优惠券
            findCoupons();
        }, 3000);
    };
    
    // 处理优惠券
    const processCoupons = (coupons) => {
        if (stopFlag) return;
        
        const total = coupons.length;
        let processed = 0;
        
        statusText.textContent = `开始领取 ${total} 张优惠券`;
        
        const processNext = () => {
            if (stopFlag) return;
            
            if (processed >= total) {
                // 完成当前批次
                statusText.textContent = '当前批次领取完成，尝试加载更多优惠券';
                
                // 尝试加载更多优惠券
                tryLoadMoreCoupons();
                return;
            }
            
            const coupon = coupons[processed];
            statusText.textContent = `领取中 (${processed + 1}/${total})`;
            
            // 滚动到优惠券位置
            coupon.scrollIntoView({behavior: 'smooth', block: 'center'});
            
            setTimeout(() => {
                // 模拟鼠标事件
                simulateClick(coupon);
                
                // 更新进度
                processed++;
                
                // 实时更新领取总数
                totalCollected++;
                updateTotalDisplay();
                
                // 处理下一个优惠券
                setTimeout(processNext, 1500 + Math.random() * 1000);
            }, 500);
        };
        
        processNext();
    };
    
    // 模拟点击
    const simulateClick = (element) => {
        // 创建鼠标事件
        const mouseDownEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        
        const mouseUpEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        
        // 分派事件
        element.dispatchEvent(mouseDownEvent);
        element.dispatchEvent(mouseUpEvent);
        element.dispatchEvent(clickEvent);
    };
    
    // 启动自动领取
    startAutoCollect();
})();