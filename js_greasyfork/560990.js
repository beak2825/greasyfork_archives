// ==UserScript==
// @name         药师帮店铺价格排序（全新实现）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全新实现的药师帮店铺商品价格排序功能
// @author       fanooo.com
// @match        https://dian.ysbang.cn/index.html#/supplierstore*
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/560990/%E8%8D%AF%E5%B8%88%E5%B8%AE%E5%BA%97%E9%93%BA%E4%BB%B7%E6%A0%BC%E6%8E%92%E5%BA%8F%EF%BC%88%E5%85%A8%E6%96%B0%E5%AE%9E%E7%8E%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560990/%E8%8D%AF%E5%B8%88%E5%B8%AE%E5%BA%97%E9%93%BA%E4%BB%B7%E6%A0%BC%E6%8E%92%E5%BA%8F%EF%BC%88%E5%85%A8%E6%96%B0%E5%AE%9E%E7%8E%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加自定义样式
    const style = document.createElement('style');
    style.innerHTML = `
        .ysb-sort-container {
            display: flex;
            justify-content: center;
            margin: 15px 0;
            width: 100%;
            gap: 10px;
            position: sticky;
            top: 0;
            z-index: 100;
            background: white;
            padding: 10px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .ysb-sort-btn {
            padding: 10px 20px;
            background: #fff;
            color: #409eff;
            border: 2px solid #409eff;
            border-radius: 25px;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            transition: all 0.3s;
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
        .ysb-sort-btn:hover {
            background: #ecf5ff;
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.15);
        }
        .ysb-sort-btn.active {
            background: #409eff;
            color: #fff;
            border-color: #409eff;
            box-shadow: 0 3px 6px rgba(64, 158, 255, 0.4);
        }
        .ysb-sort-btn i {
            margin-right: 8px;
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    
    // 主函数 - 初始化排序按钮
    function initSortButtons() {
        console.log("药师帮店铺价格排序脚本已启动");
        
        // 检查是否已存在排序容器
        if (document.querySelector(".ysb-sort-container")) return;
        
        // 创建排序容器
        const sortContainer = document.createElement('div');
        sortContainer.className = 'ysb-sort-container';
        sortContainer.id = 'ysb-sort-container';
        
        // 创建升序按钮
        const ascBtn = document.createElement('button');
        ascBtn.className = 'ysb-sort-btn';
        ascBtn.innerHTML = '<i>↑</i>价格升序';
        ascBtn.dataset.direction = 'asc';
        
        // 创建降序按钮
        const descBtn = document.createElement('button');
        descBtn.className = 'ysb-sort-btn';
        descBtn.innerHTML = '<i>↓</i>价格降序';
        descBtn.dataset.direction = 'desc';
        
        // 添加到容器
        sortContainer.appendChild(ascBtn);
        sortContainer.appendChild(descBtn);
        
        // 插入位置 - 店铺标题下方
        const shopHeader = document.querySelector('.shop-header');
        if (shopHeader) {
            shopHeader.parentNode.insertBefore(sortContainer, shopHeader.nextElementSibling);
        } else {
            // 备用插入位置
            const goodsContainer = document.querySelector('.goods-container');
            if (goodsContainer) {
                goodsContainer.parentNode.insertBefore(sortContainer, goodsContainer);
            } else {
                const allGoodsWrapper = document.querySelector('.all-goods-wrapper');
                if (allGoodsWrapper) {
                    allGoodsWrapper.parentNode.insertBefore(sortContainer, allGoodsWrapper);
                } else {
                    document.body.insertBefore(sortContainer, document.body.firstChild);
                }
            }
        }
        
        // 添加按钮事件监听
        ascBtn.addEventListener('click', () => sortItems(true, ascBtn, descBtn));
        descBtn.addEventListener('click', () => sortItems(false, ascBtn, descBtn));
        
        // 初始设置升序按钮为激活状态
        ascBtn.classList.add('active');
    }
    
    // 简单可靠的价格提取函数
    function extractPrice(item) {
        // 尝试查找所有包含价格的元素
        const priceElements = item.querySelectorAll('*');
        for (const element of priceElements) {
            const text = element.textContent.trim();
            
            // 尝试匹配价格格式：¥45.50 或 ￥45.50
            const match = text.match(/[¥￥]\s*([\d.,]+)/);
            if (match) {
                const priceStr = match[1].replace(/,/g, '');
                const priceValue = parseFloat(priceStr);
                if (!isNaN(priceValue) && priceValue > 0) {
                    return priceValue;
                }
            }
            
            // 尝试匹配纯数字价格格式
            const numberMatch = text.match(/\b(\d[\d.,]*)\b/);
            if (numberMatch) {
                const priceStr = numberMatch[1].replace(/,/g, '');
                const priceValue = parseFloat(priceStr);
                if (!isNaN(priceValue) && priceValue > 0) {
                    return priceValue;
                }
            }
        }
        
        console.warn('无法提取价格', item);
        return null;
    }
    
    // 简单可靠的排序函数
    function sortItems(isAsc, ascBtn, descBtn) {
        console.log(`正在执行${isAsc ? '升序' : '降序'}排序...`);
        
        // 获取所有商品项
        const goodsItems = document.querySelectorAll('.all-goods-wrapper');
        
        if (goodsItems.length === 0) {
            console.error('未找到商品项');
            return;
        }
        
        console.log(`找到 ${goodsItems.length} 个商品项`);
        
        // 将NodeList转换为数组
        const itemsArray = Array.from(goodsItems);
        
        // 收集价格用于调试
        const prices = itemsArray.map(item => {
            const price = extractPrice(item);
            console.log('商品价格:', price);
            return price;
        });
        
        // 排序商品
        itemsArray.sort((a, b) => {
            const priceA = extractPrice(a);
            const priceB = extractPrice(b);
            
            // 处理无效价格
            if (priceA === null && priceB === null) return 0;
            if (priceA === null) return 1;
            if (priceB === null) return -1;
            
            // 排序
            return isAsc ? priceA - priceB : priceB - priceA;
        });
        
        // 获取商品容器
        const parentContainer = itemsArray[0].parentElement;
        
        // 重新添加排序后的元素
        itemsArray.forEach(item => {
            parentContainer.appendChild(item);
        });
        
        // 更新按钮状态
        ascBtn.classList.toggle('active', isAsc);
        descBtn.classList.toggle('active', !isAsc);
        
        console.log(`排序完成！当前为${isAsc ? '升序' : '降序'}`);
    }
    
    // 页面加载处理
    function handlePageLoad() {
        // 等待页面完全加载
        const maxAttempts = 10;
        let attempts = 0;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            // 检查商品项是否加载
            const goodsItems = document.querySelectorAll('.all-goods-wrapper');
            if (goodsItems.length > 0) {
                clearInterval(checkInterval);
                console.log("商品已加载，初始化排序按钮");
                initSortButtons();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log("商品加载超时，但仍尝试初始化");
                initSortButtons();
            }
        }, 500);
    }
    
    // 启动脚本
    if (window.location.hash.includes('#/supplierstore')) {
        console.log("检测到药师帮店铺页面");
        
        // 如果是首次加载，直接处理
        handlePageLoad();
        
        // 监听路由变化
        window.addEventListener('hashchange', function() {
            if (window.location.hash.includes('#/supplierstore')) {
                console.log("路由变化到店铺页面");
                handlePageLoad();
            }
        });
    }
})();