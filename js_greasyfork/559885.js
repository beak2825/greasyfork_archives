// ==UserScript==
// @name         Linux.do 自动滚动阅读
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 Linux.do 帖子页面 div.panel 添加自动滚动按钮，适配 Discourse 动态刷新机制
// @author       21zys
// @match        https://linux.do/t/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559885/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/559885/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    const SCROLL_STEP = 260;      // 每次滚动的距离 (像素)
    const SCROLL_INTERVAL = 2500; // 滚动间隔 (毫秒)

    // --- 状态管理对象 ---
    // 使用对象存储状态，确保 DOM 更新时状态不丢失
    const GlobalState = {
        isScrolling: false,
        timer: null,
        // 记录当前的主题ID，防止跨贴时不停止
        baseTopicUrl: getBaseTopicUrl()
    };

    // 获取除去楼层号的 URL 基础部分 (用于判断是否真正换了帖子)
    function getBaseTopicUrl() {
        // 匹配格式: /t/topic-name/12345
        const match = location.pathname.match(/^\/t\/[^\/]+\/\d+/);
        return match ? match[0] : location.pathname;
    }

    // --- 滚动逻辑 ---
    function doScroll() {
        if (!GlobalState.isScrolling) return;

        // 执行平滑滚动
        window.scrollBy({ top: SCROLL_STEP, behavior: 'smooth' });
    }

    // --- 核心开关 ---
    function toggleScroll(targetState) {
        // 如果未指定 targetState，则取反当前状态
        const newState = (targetState !== undefined) ? targetState : !GlobalState.isScrolling;

        if (newState) {
            // == 开启滚动 ==
            if (!GlobalState.isScrolling) {
                console.log('AutoScroll: Started');
                GlobalState.isScrolling = true;
                doScroll(); // 立即跑一次
                GlobalState.timer = setInterval(doScroll, SCROLL_INTERVAL);
            }
        } else {
            // == 停止滚动 ==
            if (GlobalState.isScrolling) {
                console.log('AutoScroll: Stopped');
                GlobalState.isScrolling = false;
                if (GlobalState.timer) clearInterval(GlobalState.timer);
                GlobalState.timer = null;
            }
        }

        // 更新按钮视觉状态
        updateButtonUI();
    }

    // --- UI 更新逻辑 ---
    function updateButtonUI() {
        const btn = document.getElementById('linuxdo-auto-scroll-btn');
        if (!btn) return;

        if (GlobalState.isScrolling) {
            btn.innerHTML = '⏸ 停止 (运行中)';
            // 样式：高亮色
            btn.classList.remove('btn-default');
            btn.classList.add('btn-primary');
        } else {
            btn.innerHTML = '▶ 自动滚屏';
            // 样式：恢复默认
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-default');
        }
    }

    // --- 注入按钮到 DOM ---
    function renderButton() {
        // 1. 防重复
        if (document.getElementById('linuxdo-auto-scroll-btn')) return;

        // 2. 寻找容器
        // Discourse 的 Timeline 面板经常重绘，我们需要精确找到它
        // 通常在 .timeline-container 下面的 .panel
        const panel = document.querySelector('.timeline-container .panel') || document.querySelector('div.panel');

        if (panel) {
            const btn = document.createElement('button');
            btn.id = 'linuxdo-auto-scroll-btn';
            btn.className = 'btn btn-default btn-icon-text';

            // 样式微调：放在面板顶部或合适位置
            btn.style.width = '100%';
            btn.style.marginTop = '0px';
            btn.style.marginBottom = '10px';
            btn.style.fontSize = '13px';

            // 事件监听
            btn.addEventListener('click', function(e) {
                // 阻止事件冒泡，防止触发 Discourse 的其他快捷键或面板点击行为
                e.stopPropagation();
                e.preventDefault();
                toggleScroll();
            });

            // 插入到面板最上方
            panel.insertBefore(btn, panel.firstChild);

            // 关键：每次重绘出一颗新按钮，立刻同步当前的状态颜色
            updateButtonUI();
        }
    }

    // --- 监控页面变化 ---
    // 1. 这里的 Observer 负责：当页面滚动导致 panel 被重绘（按钮消失）时，立刻把按钮加回去
    const domObserver = new MutationObserver((mutations) => {
        if (!document.getElementById('linuxdo-auto-scroll-btn')) {
            renderButton();
        }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });

    // 2. 路由检测 (仅针对真正切换帖子的场景)
    // 我们不再监听 href 的简单变化，而是定时检查 基础Topic URL 是否变了
    setInterval(() => {
        const currentBase = getBaseTopicUrl();
        if (currentBase !== GlobalState.baseTopicUrl) {
            // 说明用户点击了别的帖子，或者退回了首页(虽然match不中)
            // 此时必须停止定时器，并更新基准URL
            if (GlobalState.isScrolling) {
                toggleScroll(false);
            }
            GlobalState.baseTopicUrl = currentBase;
        }
    }, 1000);

})();
