// ==UserScript==
// @name         OPGG界面优化与交互优化
// @name:en      OPGG UI optimization and interaction improvements
// @name:en-GB   OPGG UI optimization and interaction improvements
// @name:ko      OP.GG의 UI 개선 및 인터랙션 최적화
// @name:zh      OPGG界面优化与交互优化
// @name:zh-CN   OPGG界面优化与交互优化
// @name:zh-HK   OPGG 介面優化與互動優化
// @name:zh-MO   OPGG 介面優化與互動優化
// @name:zh-MY   OPGG界面优化与交互优化
// @name:zh-SG   OPGG界面优化与交互优化
// @name:zh-TW   OPGG 介面優化與互動優化
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  OPGG的英雄分析页面和游戏模式页面的元素排版优化、英雄分析页面点击英雄名字链接跳转方式改为'新建标签页打开'
// @description:en     Optimize the layout of elements on OPGG’s Champions page and Game modes page, and change the champion name links on the Champions page so they open in a new tab.
// @description:en-GB  Optimize the layout of elements on OPGG’s Champions page and Game modes page, and change the champion name links on the Champions page so they open in a new tab.
// @description:ko     OPGG의 챔피언 분석 페이지와 게임 모드 페이지의 요소 배치를 최적화하고, 챔피언 분석 페이지에서 챔피언 이름을 클릭할 때 링크가‘새 탭에서 열리도록’수정합니다.
// @description:zh     OPGG的英雄分析页面和游戏模式页面的元素排版优化、英雄分析页面点击英雄名字链接跳转方式改为'新建标签页打开'
// @description:zh-CN  OPGG的英雄分析页面和游戏模式页面的元素排版优化、英雄分析页面点击英雄名字链接跳转方式改为'新建标签页打开'
// @description:zh-HK  優化 OPGG 的英雄分析頁面與遊戲模式頁面的元素排版，並將英雄分析頁面中點擊英雄名稱的連結改為『在新分頁中開啟』
// @description:zh-MO  優化 OPGG 的英雄分析頁面與遊戲模式頁面的元素排版，並將英雄分析頁面中點擊英雄名稱的連結改為『在新分頁中開啟』
// @description:zh-MY  OPGG的英雄分析页面和游戏模式页面的元素排版优化、英雄分析页面点击英雄名字链接跳转方式改为'新建标签页打开'
// @description:zh-SG  OPGG的英雄分析页面和游戏模式页面的元素排版优化、英雄分析页面点击英雄名字链接跳转方式改为'新建标签页打开'
// @description:zh-TW  優化 OPGG 的英雄分析頁面與遊戲模式頁面的元素排版，並將英雄分析頁面中點擊英雄名稱的連結改為『在新分頁中開啟』
// @license      Copyright © 2025 Leon. All rights reserved.
// @author       Leon
// @match        https://op.gg/zh-cn* 
// @match        https://op.gg/ko*
// @match        https://op.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=op.gg
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556789/OPGG%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%E4%B8%8E%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/556789/OPGG%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%E4%B8%8E%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 静态常量定义 (避免GC压力)
    // ==========================================
    const STYLE_ID = 'my-optimized-spa-style';

    // 预定义CSS字符串，避免运行时拼接
    const CSS_CHAMPIONS = `
        @media (min-width: 1080px) {
            .md\\:w-width-limit { width: 1600px; }
            .md\\:text-lg { margin-left: 200px; }
            .md\\:w-\\[740px\\] { width: 830px; }
            .md\\:w-\\[332px\\] { width: 532px; }
        }
        .w-\\[332px\\] { width: 532px; }
        .flex-row-reverse { flex-direction: row; margin-left: 100px; }
        .flex { display: flex; justify-content: center; }
        .md\\:w-auto { justify-content: flex-start !important; }
        #content-header { display: none; }
    `;

    const CSS_MODES = `
        .md\\:max-w-\\[332px\\], .md\\:gap-2 { width: 334px !important; }
        .md\\:max-w-\\[332px\\] { max-width: 405px; }
        #content-header { display: none; }
    `;

    // ==========================================
    // 2. 状态缓存 (核心性能优化点)
    // ==========================================
    // 缓存 DOM 节点引用
    let _cachedStyleEl = null;
    // 缓存当前页面类型，防止重复渲染
    let _currentType = null;

    // 懒加载获取 Style 标签，终身只操作一次 DOM 插入
    function getStyleElement() {
        if (_cachedStyleEl) return _cachedStyleEl;
        _cachedStyleEl = document.getElementById(STYLE_ID);
        if (!_cachedStyleEl) {
            _cachedStyleEl = document.createElement('style');
            _cachedStyleEl.id = STYLE_ID;
            _cachedStyleEl.type = 'text/css';
            document.head.appendChild(_cachedStyleEl);
        }
        return _cachedStyleEl;
    }

    // ==========================================
    // 3. 样式应用逻辑
    // ==========================================
    function updateStyles() {
        const path = location.pathname;
        let newType = 'other';

        // 快速判断页面类型 (使用 indexOf 比 includes 微快，且兼容性更好)
        if (/\/champions\/?$/.test(path)) {
            newType = 'champions';
        } else if (path.indexOf('modes') !== -1) {
            newType = 'modes';
        }

        // 【性能关键】如果页面类型没变，直接退出！
        // 避免浏览器执行耗时的 Recalculate Style
        if (newType === _currentType) return;

        // 更新状态
        _currentType = newType;
        const styleEl = getStyleElement();

        // 只有状态改变时才写入 DOM
        if (newType === 'champions') {
            styleEl.textContent = CSS_CHAMPIONS;
        } else if (newType === 'modes') {
            styleEl.textContent = CSS_MODES;
        } else {
            styleEl.textContent = ''; // 清理样式
        }

    }

    // ==========================================
    // 4. 点击拦截逻辑 (Event Hot Path)
    // ==========================================
    function handleClick(e) {
        // 【性能关键】快速检查：利用缓存变量判断。
        // 如果当前不是 champions 页面，直接结束函数，不进行任何 DOM 遍历。
        if (_currentType !== 'champions') return;

        // 只有确定在 champions 页面，才开始查找 DOM
        // closest 是原生 C++ 实现，速度很快，但能省则省
        const link = e.target.closest('a');
        if (!link || !link.href) return;

        // 检查父级容器：精准匹配 class
        const targetContainer = link.closest('.flex.flex-row-reverse.gap-2');

        if (targetContainer) {
            link.target = "_blank";
            e.stopPropagation(); // 阻止 SPA 路由接管
        }
    }

    // ==========================================
    // 5. 初始化与事件绑定
    // ==========================================

    // 绑定点击事件 (捕获阶段)
    document.addEventListener('click', handleClick, true);

    // 劫持 History API
    const _historyWrap = function(type) {
        const orig = history[type];
        return function() {
            const rv = orig.apply(this, arguments);
            const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');

    // 绑定路由事件
    // 使用同一个处理函数，减少内存占用
    window.addEventListener('pushState', updateStyles);
    window.addEventListener('replaceState', updateStyles);
    window.addEventListener('popstate', updateStyles);

    // 首次执行
    updateStyles();

})();