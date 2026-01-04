// ==UserScript==
// @name         药师帮价格排序（精简美化版）
// @namespace    http://tampermonkey.net/
// @version      0.4.8
// @description  对药师帮搜索结果按价格排序
// @author       fanooo.com
// @match        http://dian.ysbang.cn/*
// @match        https://dian.ysbang.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/557726/%E8%8D%AF%E5%B8%88%E5%B8%AE%E4%BB%B7%E6%A0%BC%E6%8E%92%E5%BA%8F%EF%BC%88%E7%B2%BE%E7%AE%80%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557726/%E8%8D%AF%E5%B8%88%E5%B8%AE%E4%BB%B7%E6%A0%BC%E6%8E%92%E5%BA%8F%EF%BC%88%E7%B2%BE%E7%AE%80%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt, actionFunction, bWaitOnce, iframeSelector
) {
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents().find(selectorTxt);
    
    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        targetNodes.each(function() {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;
            if (!alreadyFound) {
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    } else {
        btargetsFound = false;
    }
    
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];
    
    if (btargetsFound && bWaitOnce && timeControl) {
        clearInterval(timeControl);
        delete controlObj[controlKey];
    } else {
        if (!timeControl) {
            timeControl = setInterval(function() {
                waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
            }, 300);
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

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

    function main() {
        console.log("药师帮价格排序脚本已启动");
        
        // 检查是否已存在排序容器
        if (document.querySelector(".ysb-sort-container")) return;
        
        // 创建排序容器
        const sortContainer = document.createElement('div');
        sortContainer.className = 'ysb-sort-container';
        
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
        
        // 查找规格元素下方位置
        const specElement = document.querySelector('.condition');
        if (specElement) {
            // 插入到规格元素下方
            specElement.parentNode.insertBefore(sortContainer, specElement.nextSibling);
        } else {
            // 备用插入位置
            const drugListPage = document.querySelector('div.drugListPage');
            if (drugListPage) {
                drugListPage.insertBefore(sortContainer, drugListPage.firstChild);
            }
        }
        
        // 添加按钮事件监听
        ascBtn.addEventListener('click', () => sorter(true, ascBtn, descBtn));
        descBtn.addEventListener('click', () => sorter(false, ascBtn, descBtn));
        
        // 初始设置升序按钮为激活状态
        ascBtn.classList.add('active');
    }
    
    function sorter(isAsc, ascBtn, descBtn) {
        console.log(`正在执行${isAsc ? '升序' : '降序'}排序...`);
        
        const cartItemList = document.querySelector('div.drug-list');
        if (!cartItemList) {
            console.error('未找到商品列表');
            return;
        }
        
        const oldItems = Array.from(cartItemList.children);
        
        // 使用更高效的排序算法
        oldItems.sort((a, b) => {
            const priceA = extractPrice(a);
            const priceB = extractPrice(b);
            
            if (priceA === null) return 1;
            if (priceB === null) return -1;
            
            if (priceA === priceB) return 0;
            
            return isAsc ? priceA - priceB : priceB - priceA;
        });
        
        // 使用文档片段减少DOM操作
        const fragment = document.createDocumentFragment();
        oldItems.forEach(item => {
            fragment.appendChild(item);
        });
        
        cartItemList.appendChild(fragment);
        
        // 更新按钮状态
        ascBtn.classList.toggle('active', isAsc);
        descBtn.classList.toggle('active', !isAsc);
        
        console.log(`排序完成！当前为${isAsc ? '升序' : '降序'}`);
    }
    
    // 优化价格提取函数
    function extractPrice(item) {
        // 尝试多种选择器
        const priceNode = item.querySelector('div.goods-price-all') || 
                          item.querySelector('.price-wrap') || 
                          item.querySelector('.goods-price');
        
        if (!priceNode) return null;
        
        const priceText = priceNode.textContent.trim();
        
        // 使用更高效的正则表达式匹配价格
        const match = priceText.match(/(?:\￥|\¥)\s*([\d.,]+)/);
        return match ? parseFloat(match[1].replace(',', '')) : null;
    }
    
    // 使用MutationObserver监听页面变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const searchKey = document.querySelector("input.searchKey");
                if (searchKey) {
                    main();
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 初始执行
    waitForKeyElements("input.searchKey", main);
})();