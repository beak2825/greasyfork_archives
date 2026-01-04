// ==UserScript==
// @name        当页开链（支持Alt禁用）
// @namespace   -
// @match       *://*/*
// @exclude-match    *://www.gamer520.com/*
// @exclude-match    *://bray.tech/*
// @grant       none
// @version     5.8
// @author      -
// @description 当前页面打开链接，按住Alt键时临时禁用此功能
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/558064/%E5%BD%93%E9%A1%B5%E5%BC%80%E9%93%BE%EF%BC%88%E6%94%AF%E6%8C%81Alt%E7%A6%81%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558064/%E5%BD%93%E9%A1%B5%E5%BC%80%E9%93%BE%EF%BC%88%E6%94%AF%E6%8C%81Alt%E7%A6%81%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(() => {
    // Alt键状态跟踪
    let altPressed = false;

    // 监听Alt键按下和释放
    document.addEventListener('keydown', e => {
        if (e.key === 'Alt') {
            altPressed = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key === 'Alt') {
            altPressed = false;
        }
    });

    // 窗口失焦时重置Alt状态
    window.addEventListener('blur', () => {
        altPressed = false;
    });

const shouldExcludeElement = (target) => {
    const EXCLUDE_SELECTORS = `
        [href^="javascript"]
        #ks
        .bpx-player-ending-content
        .carousel-wrap
        #sb_form
        .swiper-wrapper
        .win-wapper
        [class="hidden xl:flex space-x-4 items-center"]
        [class="flex items-start justify-between"]
        [role="button"]
        [class="pager__btn pager__btn__prev"]
        [class="pager__btn pager__btn__next"]
        [id="download_tab_cont"]
        [class^="SourceListItem__name"]
        [class^="file-tree-btn"]
        [id="send_sms_code"]
        [class="comment-reply-link"]
        [class="download-buttons-container"]
        [id="rdgenconseemore"]
        [class="tf_btn-area__Nyc0o"]
        [class="pc_btn-item__byhSS"]
        [data-type="seek"]
    `.trim().split('\n').map(s => s.trim()).filter(Boolean);

    return EXCLUDE_SELECTORS.some(selector => target.closest(selector));
};

    // 修改点击事件监听器，添加Alt键检查
    document.addEventListener('click', function(event) {
        // 如果Alt键被按下，阻止事件传播并返回（允许默认行为）
        if (altPressed) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        // 使用Event.composedPath()获取精确目标（2025推荐）
        const preciseTarget = event.composedPath()[0];

        if (shouldExcludeElement(preciseTarget)) return true;

        // 动态节点溯源（兼容Shadow DOM）
        let node = preciseTarget;
        while (node && node.tagName !== 'A') {
            node = node.parentElement || node.host; // 处理Web Components场景
        }

        // 增强型链接处理
        if (node?.tagName === 'A') {
            // 最新安全策略（2025-04）
            event.stopImmediatePropagation(); // 防止其他监听器干扰
            event.preventDefault();

            // 异步跳转避免阻塞（2025性能优化方案）
            requestAnimationFrame(() => {
                window.location.assign(node.href); // 替代直接href赋值
            });
        }
    }, true);

window.open = u => (location = u);

  //

new MutationObserver(_=>document.querySelectorAll('form').forEach(f=>f.target='_self')).observe(document,{childList:1,subtree:1});

})();