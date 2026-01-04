// ==UserScript==
// @name         自动跳过抖音直播间
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动跳过抖音直播间，且可以输入关键词进行指定跳过
// @author       洛洛罗
// @match        https://www.douyin.com/?recommend=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557965/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/557965/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 配置常量 ---
    const PLUGIN_ID = "quicker_tiktok_sidebar_plugin";
    const TIMER_KEY = "quicker_tiktok_timer";
    const STORAGE_KEY = "quicker_tiktok_block_keywords";
    const DY_RED = "#FE2C55"; // 抖音红
    const ICON_PATH_ON = "M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7.12683C20 7.42765 19.8643 7.71285 19.6309 7.89808L14 12.3667V17.7081C14 18.2323 13.6019 18.6713 13.085 18.7497L13 18.7626L10.5 19.7241C10.0827 19.8846 9.62678 19.5768 9.62678 19.1296V12.4419L4.47167 7.93117C4.17329 7.67009 4 7.29381 4 6.89668V5Z";

    // 防止重复注入
    if (document.getElementById(PLUGIN_ID)) return;

    // --- 全局变量 ---
    let isCoolingDown = false;
    let blockList = [];
    let isRunning = false;

    // --- 数据持久化 ---
    function loadConfig() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { try { blockList = JSON.parse(saved); } catch (e) { blockList = []; } }
    }
    function saveConfig(str) {
        var arr = str.replace(/，/g, ",").split(",");
        var finalArr = [];
        for(var i=0; i<arr.length; i++) {
            var s = arr[i].trim();
            if(s.length > 0) finalArr.push(s);
        }
        blockList = finalArr;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blockList));
    }

    // --- 核心工具：获取当前正在播放的卡片 ---
    function getActiveSlide() {
        var el = document.querySelector('[data-e2e="feed-active-video"]');
        if (el) return el;
        var videos = document.querySelectorAll('video');
        for (var i = 0; i < videos.length; i++) {
            var v = videos[i];
            if (!v.paused && v.style.display !== 'none' && v.readyState > 2) {
                return v.closest('[data-e2e="feed-item"]') || v.closest('.swiper-slide') || v.parentElement.parentElement;
            }
        }
        return null;
    }

    // --- 模拟按键跳过 ---
    function triggerSkip(reason) {
        console.log(`[自动净化] 跳过原因: ${reason}`);
        var event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40 });
        document.body.dispatchEvent(event);
    }

    // --- 核心判定逻辑 ---
    function skipLogic() {
        if (isCoolingDown) return;
        try {
            var activeSlide = getActiveSlide();
            if (!activeSlide) return;

            var shouldSkip = false;
            
            // 1. 属性检测 (最准)
            if (activeSlide.querySelector('[data-e2e="feed-live"]')) shouldSkip = true;

            // 2. 标签文字检测
            if (!shouldSkip) {
                var tagContent = activeSlide.querySelector('.semi-tag-content');
                if (tagContent && tagContent.innerText.indexOf("直播中") !== -1) shouldSkip = true;
            }

            // 3. 通用文本检测
            if (!shouldSkip) {
                var text = activeSlide.innerText;
                if (text.indexOf("进入直播间") !== -1 || text.indexOf("直播加载中") !== -1) shouldSkip = true;
            }

            // 4. 屏蔽词检测
            if (!shouldSkip && blockList.length > 0) {
                var fullText = activeSlide.innerText;
                for (var i = 0; i < blockList.length; i++) {
                    if (fullText.indexOf(blockList[i]) !== -1) { shouldSkip = true; break; }
                }
            }

            if (shouldSkip) {
                triggerSkip("命中规则");
                isCoolingDown = true;
                updateIconState(true);
                setTimeout(() => {
                    isCoolingDown = false;
                    updateIconState(false);
                }, 1500);
            }
        } catch (e) { console.error("SkipLogic Error:", e); }
    }

    // --- UI 构建：克隆原生按钮 (解决错位问题的核心) ---
    function initUI() {
        var checkTimer = setInterval(function() {
            // 寻找一个参照物，比如“短剧”、“放映厅”或者“首页”
            // 我们需要找到它最外层的容器，通常是 li 或者 div
            var anchors = document.querySelectorAll('a[href*="/"], div[role="button"]');
            var refElement = null;
            
            for (let el of anchors) {
                if (el.innerText.includes("短剧") || el.innerText.includes("放映厅") || el.innerText.includes("直播")) {
                     // 向上找，找到侧边栏列表的直接子元素 (通常有 class 控制布局)
                     // 结构通常是: ul > li > a > ...
                     // 或者是 div.sidebar > div.item > a > ...
                     refElement = el.parentElement; 
                     // 简单验证：确保这个父元素不是 body，且它的父级是侧边栏容器
                     if (refElement && refElement.parentElement && refElement.parentElement.childElementCount > 3) {
                         break;
                     }
                }
            }

            if (refElement) {
                clearInterval(checkTimer);
                injectSidebarBtn(refElement);
            }
        }, 1000);
    }

    function injectSidebarBtn(refItem) {
        // 1. 克隆原生节点
        var cloneItem = refItem.cloneNode(true);
        cloneItem.id = PLUGIN_ID;
        
        // 2. 获取内部的链接元素 (a标签 或 role=button 的 div)
        var linkEl = cloneItem.querySelector('a') || cloneItem.querySelector('[role="button"]');
        if (!linkEl) linkEl = cloneItem.querySelector('div'); // 兜底

        // 3. 清除原有的跳转属性和事件
        if (linkEl.tagName === 'A') {
            linkEl.removeAttribute('href');
            linkEl.removeAttribute('target');
        }

        // 4. 替换图标 (SVG)
        var svgEl = cloneItem.querySelector('svg');
        if (svgEl) {
            // 保留 SVG 的 class，以维持大小和颜色样式，只替换 path
            svgEl.id = "qt_icon_svg"; // 标记方便后续改变颜色
            svgEl.innerHTML = `<path d="${ICON_PATH_ON}" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>`;
        }

        // 5. 替换文字
        var spanEl = cloneItem.querySelector('span');
        if (spanEl) {
            spanEl.id = "qt_text_span";
            spanEl.innerText = "自动净化";
        }

        // 6. 绑定点击事件
        // 使用 capture 阶段或覆盖 onclick 防止原生 React 事件干扰
        linkEl.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleState();
        };

        // 7. 绑定右键设置
        linkEl.oncontextmenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            showSettings();
        };

        // 8. 插入到侧边栏 (插入到参照物的后面)
        if (refItem.nextSibling) {
            refItem.parentElement.insertBefore(cloneItem, refItem.nextSibling);
        } else {
            refItem.parentElement.appendChild(cloneItem);
        }

        createSettingsPanel();
        loadConfig();
        toggleState(); // 默认开启
    }

    // --- 状态更新 ---
    function updateIconState(isSkippingAction) {
        var svg = document.getElementById("qt_icon_svg");
        var text = document.getElementById("qt_text_span");
        
        // 获取原生文字的默认颜色 (通常通过 computedStyle 或者父级继承)
        // 我们利用 CSS 变量或者直接操作 style
        
        if (isRunning) {
            if (svg) svg.style.color = DY_RED; // 图标变红
            if (text) {
                text.innerText = isSkippingAction ? "跳过中..." : "净化开启";
                // text.style.color = DY_RED; // 文字可选变红，或者保持白色
            }
        } else {
            if (svg) svg.style.color = ""; // 恢复默认颜色 (继承 CSS)
            if (text) {
                text.innerText = "净化关闭";
                // text.style.color = "";
            }
        }
    }

    function toggleState() {
        if (isRunning) {
            clearInterval(window[TIMER_KEY]);
            window[TIMER_KEY] = null;
            isRunning = false;
        } else {
            skipLogic();
            window[TIMER_KEY] = setInterval(skipLogic, 800);
            isRunning = true;
        }
        updateIconState(false);
    }

    // --- 设置面板 (无需改动) ---
    function createSettingsPanel() {
        if (document.getElementById("qt_settings_panel")) return;
        var panel = document.createElement("div");
        panel.id = "qt_settings_panel";
        panel.style.cssText = "display:none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 320px; background: #161823; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; z-index: 999999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: #fff; font-family: PingFang SC, sans-serif;";
        panel.innerHTML =
            '<h3 style="margin:0 0 15px 0; font-size:16px; color:#FE2C55;">屏蔽词设置</h3>' +
            '<p style="font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:10px;">输入关键词，用逗号分隔：</p>' +
            '<textarea id="qt_settings_input" style="width:100%; height:100px; background:rgba(255,255,255,0.05); border:none; color:#eee; border-radius:8px; padding:10px; box-sizing:border-box; resize:none; font-size:12px; outline:none;"></textarea>' +
            '<div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">' +
                '<button id="qt_close_btn" style="padding:6px 16px; border-radius:4px; border:none; cursor:pointer; background:rgba(255,255,255,0.1); color:#fff;">取消</button>' +
                '<button id="qt_save_btn" style="padding:6px 16px; border-radius:4px; border:none; cursor:pointer; background:#FE2C55; color:#fff; font-weight:bold;">保存</button>' +
            '</div>';
        document.body.appendChild(panel);
        document.getElementById("qt_close_btn").onclick = function() { panel.style.display = "none"; };
        document.getElementById("qt_save_btn").onclick = function() {
            saveConfig(document.getElementById("qt_settings_input").value);
            panel.style.display = "none";
            var t = document.getElementById("qt_text_span");
            if(t) t.innerText = "已保存";
            setTimeout(function(){ updateIconState(false); }, 1500);
        };
    }

    function showSettings() {
        var panel = document.getElementById("qt_settings_panel");
        var input = document.getElementById("qt_settings_input");
        if(panel) {
            input.value = blockList.join(", ");
            panel.style.display = "block";
        }
    }

    initUI();
})();