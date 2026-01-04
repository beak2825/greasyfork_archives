// ==UserScript==
// @name         Paradox Mods Helper (Auto Load + Search Fix + Hide Loader + Mini Spinner)
// @name:zh-CN   Pmod助手
// @name:ja      パラドックスMODヘルパー
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Automatically load more, unlock search results, hide the global loading overlay, and display a small loading indicator in the bottom right corner. Add a button to clear all filters. 
// @description:zh-CN 自动加载更多、解锁搜索结果、隐藏全局加载遮罩，并在右下角显示小加载指示， 添加一个清除所有过滤器按钮
// @description:ja 自動でさらに読み込み、検索結果のロック解除、グローバル読み込みマスクを非表示にし、右下に小さな読み込みインジケーターを表示。すべてのフィルターをクリアするボタンを追加。
// @match        https://mods.paradoxplaza.com/games/*
// @match        *://mods.paradoxinteractive.com/*
// @match        *://mods.paradoxplaza.com/*
// @license      MPL-2.0
// @copyright 2025, AndreaFrederica (https://openuserjs.org/users/AndreaFrederica)
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558905/Paradox%20Mods%20Helper%20%28Auto%20Load%20%2B%20Search%20Fix%20%2B%20Hide%20Loader%20%2B%20Mini%20Spinner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558905/Paradox%20Mods%20Helper%20%28Auto%20Load%20%2B%20Search%20Fix%20%2B%20Hide%20Loader%20%2B%20Mini%20Spinner%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /******************************************************************
     * 功能开关
     ******************************************************************/
    const ENABLE_AUTO_LOAD_MORE = true; // 只在 /games/* 列表页生效
    const ENABLE_CLEAR_FILTERS_BUTTON = true; // 只在 /games/* 列表页生效
    const ENABLE_CSS_UNLOCK_AND_HIDE_LOADER = true; // 所有页面都生效（含 mini spinner）

    /******************************************************************
     * 工具函数：当前是否在 mods.paradoxplaza.com 的 /games/* 列表页
     ******************************************************************/
    function isGamesModsListPage() {
        return (
            location.host === 'mods.paradoxplaza.com' &&
            location.pathname.startsWith('/games/')
        );
    }

    /******************************************************************
     * 通用：检测全局 Loader 是否处于 active 状态
     ******************************************************************/
    function isGlobalLoaderActive() {
        const el = document.querySelector(
            '[class*="Loader-styles__loader"][class*="Loader-styles__global"]'
        );
        if (!el) return false;
        return String(el.className).includes('Loader-styles__active');
    }

    /******************************************************************
     * 功能一：LOAD MORE 自动点击（仅 /games/*）
     * 选择器策略：优先结构特征，不依赖文字
     ******************************************************************/
    let autoLoadTimerId = null;
    let autoLoadScrollBound = false;

    function getLoadMoreButton() {
        // 策略 1：通过 Pagination 容器和 Button class 的组合（最稳定）
        let btn = document.querySelector(
            '[class*="Pagination-styles__pagination"] button[class*="Button-styles__root"]'
        );
        if (btn) {
            console.log('PMH: Found button via Pagination + Button class selector');
            return btn;
        }

        // 策略 2：通过 Pagination 容器内的按钮（仅限第一个）
        const paginationDiv = document.querySelector('[class*="Pagination-styles__pagination"]');
        if (paginationDiv) {
            btn = paginationDiv.querySelector('button');
            if (btn) {
                console.log('PMH: Found button via Pagination container');
                return btn;
            }
        }

        // 策略 3：按钮带有特定的 class 组合（green + outline 或类似）
        btn = document.querySelector(
            'button[class*="Button-styles__root"][class*="Button-styles__green"]'
        );
        if (btn) {
            console.log('PMH: Found button via Button class combination');
            return btn;
        }

        // 策略 4：通过宽泛的 Pagination 特征搜索
        const allButtons = document.querySelectorAll('button');
        for (const button of allButtons) {
            const parent = button.closest('[class*="Pagination"]');
            if (parent) {
                console.log('PMH: Found button via parent Pagination element');
                return button;
            }
        }

        // 策略 5（备选）：如果上述都找不到，才使用文字匹配
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = btn.innerText.trim();
            if (text === 'LOAD MORE' || text === '加载更多' || text === 'もっと読み込む' || text === 'CHARGER PLUS') {
                console.log('PMH: Found button via text fallback:', text);
                return btn;
            }
        }

        console.log('PMH: Load More button not found');
        return null;
    }

    function isButtonInTriggerZone(btn) {
        const rect = btn.getBoundingClientRect();
        const vh = window.innerHeight;

        const offsetBottom = 600; // 视口下方阈值

        return rect.top <= vh + offsetBottom;
    }

    function clickLoadMore(btn) {
        if (!btn) return;
        if (btn.disabled || btn.getAttribute('aria-busy') === 'true') {
            return;
        }
        console.log('PMH: Auto clicking Load More...');
        btn.click();
    }

    function checkAndAutoLoad() {
        if (!ENABLE_AUTO_LOAD_MORE) return;
        if (!isGamesModsListPage()) return;

        if (isGlobalLoaderActive()) {
            return;
        }

        const btn = getLoadMoreButton();
        if (!btn) return;

        if (isButtonInTriggerZone(btn)) {
            clickLoadMore(btn);
        }
    }

    function ensureAutoLoadSetup() {
        if (!ENABLE_AUTO_LOAD_MORE) return;
        if (!isGamesModsListPage()) return;

        if (!autoLoadScrollBound) {
            window.addEventListener('scroll', checkAndAutoLoad);
            autoLoadScrollBound = true;
        }

        if (autoLoadTimerId == null) {
            autoLoadTimerId = setInterval(checkAndAutoLoad, 500);
        }

        checkAndAutoLoad();
    }

    /******************************************************************
     * 功能二：清除过滤器按钮（仅 /games/*）
     ******************************************************************/
    let clearBtnStyleInjected = false;

    function injectClearFiltersButtonStyle() {
        if (clearBtnStyleInjected || !ENABLE_CLEAR_FILTERS_BUTTON) return;

        const style = document.createElement('style');
        style.textContent = `
      #pmh-filters-buttons-container {
        display: flex;
        gap: 8px;
        width: 100%;
        padding: 8px 0;
        box-sizing: border-box;
      }

      #pmh-clear-filters-btn {
        flex: 0 0 70%;
        padding: 10px 16px;
        border-radius: 4px;
        background: rgba(100, 150, 255, 0.85);
        color: #fff;
        border: none;
        font-size: 14px;
        font-weight: 500;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: background 0.2s ease;
        user-select: none;
      }

      #pmh-clear-filters-btn:hover {
        background: rgba(80, 130, 255, 0.95);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }

      #pmh-clear-filters-btn:active {
        transform: scale(0.98);
      }

      #pmh-scroll-to-top-btn {
        flex: 0 0 20%;
        padding: 10px 16px;
        border-radius: 4px;
        background: rgba(100, 180, 100, 0.85);
        color: #fff;
        border: none;
        font-size: 16px;
        font-weight: 500;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: background 0.2s ease;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #pmh-scroll-to-top-btn:hover {
        background: rgba(80, 160, 80, 0.95);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }

      #pmh-scroll-to-top-btn:active {
        transform: scale(0.98);
      }
    `;
        document.documentElement.appendChild(style);
        clearBtnStyleInjected = true;
    }

    function ensureClearFiltersButton() {
        if (!ENABLE_CLEAR_FILTERS_BUTTON) return;
        if (!isGamesModsListPage()) return;

        injectClearFiltersButtonStyle();

        // 找到过滤器面板的内部滚动容器
        const filtersPanel = document.querySelector('[class*="SearchPage-styles__filters--"]');
        if (!filtersPanel) return;

        // 如果容器已经存在就不再添加
        if (document.getElementById('pmh-filters-buttons-container')) return;

        // 创建按钮容器
        const container = document.createElement('div');
        container.id = 'pmh-filters-buttons-container';

        // 创建清除过滤器按钮
        const clearBtn = document.createElement('button');
        clearBtn.id = 'pmh-clear-filters-btn';
        clearBtn.textContent = 'Clear Filters';

        clearBtn.addEventListener('click', () => {
            const inputs = document.querySelectorAll(
                '.src-components-SearchPage-styles__filters--\\[fullhash\\] input'
            );
            let clickedCount = 0;
            inputs.forEach(input => {
                if ((input.type === 'checkbox' || input.type === 'radio') && input.checked === true) {
                    input.click();
                    clickedCount++;
                }
            });
            console.log(`PMH: Clicked ${clickedCount} checked filter inputs.`);
        });

        // 创建返回顶部按钮
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'pmh-scroll-to-top-btn';
        scrollTopBtn.textContent = '🡹'; // 向上箭头图标

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('PMH: Scrolled to top.');
        });

        // 添加按钮到容器
        container.appendChild(clearBtn);
        container.appendChild(scrollTopBtn);

        // 把容器插入到过滤器面板的最后
        filtersPanel.appendChild(container);
        console.log('PMH: Clear Filters and Scroll to Top buttons added to filters panel.');
    }

    /******************************************************************
     * 功能三：CSS 解锁 + 隐藏全局 Loader + mini spinner（所有页面）
     ******************************************************************/
    let unlockStyleInjected = false;
    let miniSpinnerTimerId = null;
    let lastActive = null;

    function injectUnlockAndSpinnerCSS() {
        if (unlockStyleInjected || !ENABLE_CSS_UNLOCK_AND_HIDE_LOADER) return;

        const style = document.createElement('style');
        style.textContent = `
      [class*="SearchPage-styles__root"][class*="SearchPage-styles__isSearching"]
      [class*="SearchPage-styles__results"] {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      [class*="SearchPage-styles__root"][class*="SearchPage-styles__isSearching"]
      [class*="SearchPage-styles__content"],
      [class*="SearchPage-styles__root"][class*="SearchPage-styles__isSearching"]
      [class*="SearchPage-styles__header"] {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      [class*="Loader-styles__loader"][class*="Loader-styles__global"],
      [class*="Loader-styles__loader--"][class*="Loader-styles__global--"] {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      #pmh-loading-indicator {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.70);
        color: #fff;
        font-size: 12px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        pointer-events: none;
        box-sizing: border-box;
        width: 100px;
      }

      #pmh-loading-indicator-spinner {
        flex: 0 0 auto;
        width: 12px;
        height: 12px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
      }

      #pmh-loading-text {
        flex: 0 0 auto;
        white-space: nowrap;
        transition: opacity 0.2s ease;
      }

      #pmh-loading-indicator.pmh-active #pmh-loading-indicator-spinner {
        animation: pmh-spin 0.8s linear infinite;
      }

      #pmh-loading-indicator.pmh-idle #pmh-loading-indicator-spinner {
        animation: none;
      }

      @keyframes pmh-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
/* 1. 整个 Filter 面板浮在一边、垂直布局 */
[class*="SearchPage-styles__filters--"] {
  position: sticky;           /* 如果想真·脱离布局就改成 fixed，见下面 */
  top: 80px;                  /* 根据顶部导航高度调，比如 64/72/80 */
  display: flex;
  flex-direction: column;
  align-self: flex-start;     /* 避免跟着内容列一起被拉长 */
  max-height: calc(100vh - 96px);  /* 整个面板不超过视口高度 */
  box-sizing: border-box;
  overflow: hidden;           /* 自己不滚，只让内部那块滚 */
}

/* 2. Filter 标题，只当作固定头部 */
[class*="SearchPage-styles__filtersHeading--"] {
  flex: 0 0 auto;
}

/* 3. 真正滚动的是这块超长内容 */
[class*="SearchPage-Filter-styles__root--"] {
  flex: 1 1 auto;
  overflow-y: auto;
  padding-right: 4px;               /* 给滚动条留点空间 */
  max-height: 100%;                 /* 高度由外层 max-height 限制 */
  overscroll-behavior: contain;     /* 滚到底/顶时不要带着页面动 */
}

/* 4.（可选）滚动条美化一点 */
[class*="SearchPage-Filter-styles__root--"]::-webkit-scrollbar {
  width: 6px;
}

[class*="SearchPage-Filter-styles__root--"]::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.35);
}


    `;
        document.documentElement.appendChild(style);
        unlockStyleInjected = true;
    }

    function ensureMiniSpinner() {
        if (!ENABLE_CSS_UNLOCK_AND_HIDE_LOADER) return;

        injectUnlockAndSpinnerCSS();

        if (document.getElementById('pmh-loading-indicator')) return;

        const box = document.createElement('div');
        box.id = 'pmh-loading-indicator';
        box.classList.add('pmh-idle');

        const spinner = document.createElement('div');
        spinner.id = 'pmh-loading-indicator-spinner';

        const text = document.createElement('span');
        text.id = 'pmh-loading-text';
        text.textContent = 'Idle';

        box.appendChild(spinner);
        box.appendChild(text);

        (document.body || document.documentElement).appendChild(box);
    }

    function updateMiniSpinner() {
        if (!ENABLE_CSS_UNLOCK_AND_HIDE_LOADER) return;

        const box = document.getElementById('pmh-loading-indicator');
        const text = document.getElementById('pmh-loading-text');
        if (!box || !text) return;

        const active = isGlobalLoaderActive();
        if (active === lastActive) return;

        lastActive = active;

        text.style.opacity = '0';
        setTimeout(() => {
            text.textContent = active ? 'Loading…' : 'Idle';
            text.style.opacity = '1';
        }, 50);

        if (active) {
            box.classList.add('pmh-active');
            box.classList.remove('pmh-idle');
        } else {
            box.classList.add('pmh-idle');
            box.classList.remove('pmh-active');
        }
    }

    function initMiniSpinner() {
        if (!ENABLE_CSS_UNLOCK_AND_HIDE_LOADER) return;

        ensureMiniSpinner();
        updateMiniSpinner();

        if (miniSpinnerTimerId == null) {
            miniSpinnerTimerId = setInterval(updateMiniSpinner, 300);
        }
    }

    function pinFiltersPanel() {
        const outer = document.querySelector('[class*="SearchPage-styles__filters--"]');
        if (!outer) return;

        // 已经处理过就不要重复
        if (outer.dataset.pmhPinned === '1') return;

        const rect = outer.getBoundingClientRect();

        // 1. 在原位置插入一个占位元素，防止布局塌陷
        const placeholder = document.createElement('div');
        placeholder.id = 'pmh-filters-placeholder';
        placeholder.style.width = rect.width + 'px';
        placeholder.style.height = rect.height + 'px';
        outer.parentNode.insertBefore(placeholder, outer);

        // 2. 把整个 filters 面板改成 fixed 悬浮
        const TOP_OFFSET = 80; // 根据实际导航条高度调
        // 获取相对于 viewport 的位置，加上当前滚动量得到绝对位置
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        outer.style.position = 'fixed';
        outer.style.top = TOP_OFFSET + 'px';
        outer.style.left = (rect.left + scrollLeft) + 'px';
        outer.style.width = rect.width + 'px';
        outer.style.maxHeight = 'calc(100vh - ' + (TOP_OFFSET + 16) + 'px)';
        outer.style.overflow = 'hidden';
        outer.style.boxSizing = 'border-box';
        outer.style.zIndex = '40';

        outer.dataset.pmhPinned = '1';

        // 3. 内部长列表自己滚
        const inner = outer.querySelector('[class*="SearchPage-Filter-styles__root--"]');
        if (inner) {
            inner.style.maxHeight = '100%';
            inner.style.overflowY = 'auto';
            inner.style.overscrollBehavior = 'contain';
        }

        // 4. 添加一次性的窗口事件监听
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newRect = placeholder.getBoundingClientRect();
                const newScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                outer.style.left = (newRect.left + newScrollLeft) + 'px';
                outer.style.width = newRect.width + 'px';
            }, 150);
        };

        const handleScroll = () => {
            const newScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const newRect = placeholder.getBoundingClientRect();
            outer.style.left = (newRect.left + newScrollLeft) + 'px';
        };

        // 只添加一次监听器
        if (!outer.dataset.pmhListenersAdded) {
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll);
            outer.dataset.pmhListenersAdded = '1';
        }

        console.log('Paradox Mods: filters panel pinned & scrollable.');
    }

    // 初始化：DOM 就绪后跑一次，然后再定时检查（应对 SPA 内跳转）
    function initPinnedFilters() {
        pinFiltersPanel();
        // 简单粗暴点，每秒检查一次有没有新的 filters 出现
        setInterval(pinFiltersPanel, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPinnedFilters);
    } else {
        initPinnedFilters();
    }


    /******************************************************************
     * URL 变化监听：SPA + 前进后退 + bfcache
     ******************************************************************/
    function handleLocationChange() {
        if (isGamesModsListPage()) {
            ensureAutoLoadSetup();
            ensureClearFiltersButton();
            pinFiltersPanel();
        }

        initMiniSpinner();
    }

    function setupLocationWatcher() {
        const origPushState = history.pushState;
        history.pushState = function(...args) {
            const ret = origPushState.apply(this, args);
            window.dispatchEvent(new Event('pmh-locationchange'));
            return ret;
        };

        const origReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            const ret = origReplaceState.apply(this, args);
            window.dispatchEvent(new Event('pmh-locationchange'));
            return ret;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('pmh-locationchange'));
        });

        window.addEventListener('hashchange', () => {
            window.dispatchEvent(new Event('pmh-locationchange'));
        });

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                window.dispatchEvent(new Event('pmh-locationchange'));
            }
        });

        window.addEventListener('pmh-locationchange', handleLocationChange);
    }

    /******************************************************************
     * 初始挂载
     ******************************************************************/
    setupLocationWatcher();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            handleLocationChange();
        });
    } else {
        handleLocationChange();
    }

    console.log('Paradox Mods Helper v1.8 (SPA-aware, global mini spinner) loaded.');
})();