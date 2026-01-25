// ==UserScript==
// @name         bilibili 视频增强（倍速、锚点管理）
// @namespace    float0108
// @version      2.1.2
// @description  自定义倍速、快捷键、锚点管理、视频中心提示动效。1)快捷键：`键添加锚点，Tab/Shift+Tab切换锚点，自定义倍速快捷键（默认zxc）；2)管理面板：搜索过滤、批量删除、全选；
// @author       float0108 & gemini Pro & dzj0821
// @include      http*://*bilibili.com/video/*
// @include      http*://*bilibili.com/list/*
// @include      http*://*bilibili.com/bangumi/*
// @homepage     https://github.com/float0108/UserScript_Unclassified/
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @license      GNU/GPLv3
// @downloadURL https://update.greasyfork.org/scripts/563981/bilibili%20%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%80%8D%E9%80%9F%E3%80%81%E9%94%9A%E7%82%B9%E7%AE%A1%E7%90%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563981/bilibili%20%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%80%8D%E9%80%9F%E3%80%81%E9%94%9A%E7%82%B9%E7%AE%A1%E7%90%86%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --- 样式配置 ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* 中心提示框 */
        .speed-tip-overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -40%);
            background: rgba(0, 0, 0, 0.9); color: #fff; padding: 10px 12px;
            border-radius: 3px; font-size: 12px; z-index: 999999; pointer-events: none;
            opacity: 0; transition: opacity 0.1s ease; white-space: nowrap;
        }
        .speed-tip-show { opacity: 1; transform: translate(-50%, -50%); transition: opacity 0.1s ease, transform 0.1s ease; }

        /* 进度条锚点 */
        .bpx-player-progress-schedule-wrap { overflow: visible !important; }
        .custom-anchor-dot {
            position: absolute; width: 10px; height: 10px; top: -4px;
            background: #00aeec; border-radius: 50%; border: 2px solid #eee;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 2000;
            transform: translateX(-50%); cursor: pointer; transition: transform 0.2s;
        }
        .custom-anchor-dot:hover { transform: translateX(-50%) scale(1.3); border-color: #fff; }

        /* 管理面板 */
        #anchor-manager-panel {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 999999; width: 500px; padding: 20px; font-family: system-ui, -apple-system, sans-serif;
            color: #333; line-height: 1.5; box-sizing: border-box;
        }
        .mgr-search-bar { margin-bottom: 12px; display: flex; gap: 8px; }
        .mgr-input { flex: 1; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; outline: none; }
        .mgr-input:focus { border-color: #00aeec; }
        .mgr-list {
            max-height: 400px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px; margin-bottom: 15px;
            scrollbar-width: thin; scrollbar-color: #ccc transparent;
        }
        .mgr-list::-webkit-scrollbar { width: 6px; }
        .mgr-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        .mgr-item { display: grid; grid-template-columns: 30px 90px 1fr 50px 40px; gap: 10px; padding: 10px; border-bottom: 1px solid #f5f5f5; align-items: center; font-size: 12px; }
        .mgr-batch-ops { font-size: 12px; color: #666; display: flex; align-items: center; gap: 5px; }
        .mgr-header { font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .mgr-close-x { cursor: pointer; padding: 0 5px; font-size: 20px; color: #999; }
        .mgr-close-x:hover { color: #333; }
        .mgr-item:hover { background: #f9f9f9; }
        .mgr-item .video-t { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; color: #00aeec; font-weight: 500; }
        .mgr-item .video-t:hover { text-decoration: underline; }
        .mgr-item .del-v { color: #ff4757; cursor: pointer; text-align: center; font-size: 16px; }
        .mgr-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .mgr-btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #00aeec; color: #fff; transition: opacity 0.2s; }
        .mgr-btn:hover { opacity: 0.9; }
        .mgr-btn.pink { background: #fb7299; }
    `;
    document.head.appendChild(style);

    // --- 全局变量 ---
    let tempAnchors = [];
    let currentAnchorsData = []; // 缓存当前视频的锚点数据，避免重复读取 localStorage
    let isAnchorsLoaded = false; // 性能锁：标记当前视频锚点是否已成功渲染
    let menuIds = { toggle: null };

    const getBvid = () => {
        const m = location.pathname.match(/\/(BV[a-zA-Z0-9]+)/);
        return m ? m[1] : (new URLSearchParams(location.search).get("bvid") || "common");
    };
    const getTitle = () => document.querySelector('.video-title')?.innerText || document.title.replace('_哔哩哔哩_bilibili', '');
    const getGlobalIndex = () => {
        try {
            return JSON.parse(localStorage.getItem('anchor_global_index') || "{}");
        } catch (e) {
            console.error('读取全局索引失败:', e);
            return {};
        }
    };
    const isAutoSave = () => localStorage.getItem('anchor_auto_save') !== 'false';
    const getSpeedSetting = () => {
        try {
            return (localStorage.getItem("dz_bilibili_video_custom_speed_setting") || "0.5 0.75 1.0 1.25 1.5 2.0 3.0 4.0").split(" ");
        } catch (e) {
            console.error('读取倍速设置失败:', e);
            return [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0];
        }
    };
    const getShortcutKeys = () => {
        try {
            return (localStorage.getItem("dz_bilibili_video_custom_speed_shortcuts") || "z x c").split(" ");
        } catch (e) {
            console.error('读取快捷键设置失败:', e);
            return ["z", "x", "c"];
        }
    };
    const getSetSpeedOnLoadSetting = () => localStorage.getItem("dz_bilibili_video_custom_speed_set_speed_on_load") === "true";

    const formatTime = (seconds) => {
        seconds = Math.floor(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');
        return h > 0 ? `${h}:${mStr}:${sStr}` : `${mStr}:${sStr}`;
    };

    function saveToStore(bvid, anchors) {
        try {
            if (anchors.length === 0) {
                localStorage.removeItem(`anchors_${bvid}`);
                const idx = getGlobalIndex();
                delete idx[bvid];
                localStorage.setItem('anchor_global_index', JSON.stringify(idx));
            } else {
                localStorage.setItem(`anchors_${bvid}`, JSON.stringify(anchors.sort((a, b) => a - b)));
                const idx = getGlobalIndex();
                idx[bvid] = { title: getTitle(), count: anchors.length, time: Date.now() };
                localStorage.setItem('anchor_global_index', JSON.stringify(idx));
            }
            currentAnchorsData = anchors;
            isAnchorsLoaded = false;
        } catch (e) {
            console.error('保存锚点失败:', e);
            showTip('保存失败，请检查存储空间');
        }
    }

    function deleteAnchors(bvid) {
        try {
            localStorage.removeItem(`anchors_${bvid}`);
            const idx = getGlobalIndex();
            delete idx[bvid];
            localStorage.setItem('anchor_global_index', JSON.stringify(idx));
            if (bvid === getBvid()) {
                currentAnchorsData = [];
                isAnchorsLoaded = false;
            }
        } catch (e) {
            console.error('删除锚点失败:', e);
            showTip('删除失败');
        }
    }

    // --- 核心逻辑 ---
    function showTip(text) {
        let container = document.querySelector(".bpx-player-video-area") || document.querySelector(".video");
        if (!container) return;
        let tip = document.querySelector(".speed-tip-overlay") || (() => {
            let t = document.createElement("div"); t.className = "speed-tip-overlay";
            container.appendChild(t); return t;
        })();
        tip.innerText = text;
        tip.classList.add("speed-tip-show");
        clearTimeout(window.speedTipTimer);
        window.speedTipTimer = setTimeout(() => tip.classList.remove("speed-tip-show"), 1000);
    }

    function applySpeed(s) {
        let v = document.querySelector("video") ?? document.querySelector("bwp-video");
        if (v) {
            v.playbackRate = s;
            localStorage.setItem("dz_bilibili_video_custom_speed_value", s);
            showTip(`倍速切换到 ${s}x`);
        }
    }

    function renderAnchors() {
        const video = document.querySelector("video") ?? document.querySelector("bwp-video");
        if (!video || !video.duration) return; // 必须等待时长加载

        const bar = document.querySelector(".bpx-player-progress-schedule-wrap");
        if (!bar) return;

        document.querySelectorAll(".custom-anchor-dot").forEach(el => el.remove());

        // 使用缓存的数据渲染
        const anchors = currentAnchorsData;

        anchors.forEach(time => {
            const dot = document.createElement("div");
            dot.className = "custom-anchor-dot";
            dot.style.left = `${(time / video.duration) * 100}%`;
            dot.title = `时间点：${formatTime(time)}`;

            dot.addEventListener('contextmenu', (e) => {
                e.preventDefault(); e.stopPropagation();
                const newArr = anchors.filter(t => Math.abs(t - time) > 0.1);
                if (isAutoSave()) saveToStore(getBvid(), newArr);
                else {
                    tempAnchors = newArr;
                    currentAnchorsData = newArr;
                    isAnchorsLoaded = false; // 触发重绘
                }
                renderAnchors();
                showTip("锚点已移除");
            });
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); video.currentTime = time;
            });
            bar.appendChild(dot);
        });

        // 渲染完成后，进行校验。如果数量匹配，则锁定状态，不再重复渲染
        const renderedCount = document.querySelectorAll(".custom-anchor-dot").length;
        if (renderedCount === anchors.length) {
            isAnchorsLoaded = true;
            // console.log("锚点渲染成功，停止轮询");
        }
    }

    // --- 管理面板 ---
    function openManager() {
        const oldPanel = document.getElementById("anchor-manager-panel");
        if (oldPanel) oldPanel.remove();

        const panel = document.createElement("div");
        panel.id = "anchor-manager-panel";

        const renderList = (filterText = "") => {
            const idx = getGlobalIndex();
            const bvidList = Object.keys(idx)
                .filter(v => idx[v].title.toLowerCase().includes(filterText.toLowerCase()) || v.toLowerCase().includes(filterText.toLowerCase()))
                .sort((a, b) => idx[b].time - idx[a].time);

            const rows = bvidList.map(v => `
                <div class="mgr-item" data-bvid="${v}">
                    <input type="checkbox" class="mgr-select-item">
                    <code>${v}</code>
                    <div class="video-t" title="${idx[v].title}">${idx[v].title}</div>
                    <div style="text-align:center">${idx[v].count}</div>
                    <div class="del-v" title="删除">🗑️</div>
                </div>
            `).join('');

            return rows || '<div style="padding:20px;text-align:center;color:#999">未找到匹配记录</div>';
        };

        panel.innerHTML = `
            <div class="mgr-header">
                <span>📑 锚点全局管理</span>
                <span class="mgr-close-x">×</span>
            </div>
            <div class="mgr-search-bar">
                <input type="text" class="mgr-input" id="mgr-search" placeholder="搜索标题或 BV 号...">
            </div>
            <div class="mgr-batch-ops">
                <input type="checkbox" id="mgr-select-all"> <label for="mgr-select-all">全选</label>
                <span id="mgr-del-selected" style="color:#ff4757; cursor:pointer; margin-left:10px; display:none;">批量删除</span>
            </div>
            <div class="mgr-list" id="mgr-list-container">${renderList()}</div>
            <div class="mgr-footer">
                <label style="cursor:pointer; display:flex; align-items:center;">
                    <input type="checkbox" id="auto-save-cb" ${isAutoSave() ? 'checked' : ''} style="margin-right:5px;"> 自动保存
                </label>
                <div style="display:flex; gap:8px;">
                    ${!isAutoSave() ? '<button class="mgr-btn pink" id="manual-save-btn">保存当前</button>' : ''}
                    <button class="mgr-btn" id="close-btn">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 搜索事件
        const searchInput = panel.querySelector('#mgr-search');
        searchInput.focus();
        searchInput.addEventListener('input', (e) => {
            panel.querySelector('#mgr-list-container').innerHTML = renderList(e.target.value);
        });

        panel.addEventListener('click', (e) => {
            const target = e.target;

            // 全选逻辑
            if (target.id === 'mgr-select-all') {
                const checks = panel.querySelectorAll('.mgr-select-item');
                checks.forEach(c => c.checked = target.checked);
                const anyChecked = !!panel.querySelector('.mgr-select-item:checked');
                panel.querySelector('#mgr-del-selected').style.display = anyChecked ? 'inline' : 'none';
            }

            // 单选逻辑
            if (target.classList.contains('mgr-select-item')) {
                const checks = panel.querySelectorAll('.mgr-select-item');
                const allChecked = checks.length > 0 && Array.from(checks).every(c => c.checked);
                panel.querySelector('#mgr-select-all').checked = allChecked;
                const anyChecked = !!panel.querySelector('.mgr-select-item:checked');
                panel.querySelector('#mgr-del-selected').style.display = anyChecked ? 'inline' : 'none';
            }

            // 批量删除
            if (target.id === 'mgr-del-selected') {
                const selected = Array.from(panel.querySelectorAll('.mgr-select-item:checked')).map(c => c.closest('.mgr-item').dataset.bvid);
                if (confirm(`确定删除选中的 ${selected.length} 个视频的所有标记吗？`)) {
                    selected.forEach(bvid => deleteAnchors(bvid));
                    openManager();
                }
            }

            // 原有逻辑保持（删除、跳转等）...
            if (target.classList.contains('mgr-close-x') || target.id === 'close-btn') panel.remove();

            if (target.id === 'auto-save-cb') {
                localStorage.setItem('anchor_auto_save', target.checked);
                // 刷新数据源
                currentAnchorsData = target.checked ? JSON.parse(localStorage.getItem(`anchors_${getBvid()}`) || "[]") : tempAnchors;
                isAnchorsLoaded = false; // 触发重绘
                showTip(target.checked ? "自动保存已开启" : "自动保存已关闭");
                setTimeout(openManager, 100);
            }

            if (target.id === 'manual-save-btn') {
                saveToStore(getBvid(), tempAnchors);
                showTip("已存档");
                openManager();
            }

            if (target.classList.contains('del-v')) {
                const bvid = target.closest('.mgr-item').getAttribute('data-bvid');
                if (confirm(`确定删除 ${bvid} 的所有标记吗？`)) {
                    deleteAnchors(bvid);
                    openManager();
                }
            }

            if (target.classList.contains('video-t')) {
                const bvid = target.closest('.mgr-item').getAttribute('data-bvid');
                window.open(`https://www.bilibili.com/video/${bvid}`, '_blank');
            }
        });
    }
    /* --- 修改段结束 --- */

    // --- 菜单与设置 ---
    function updateMenu() {
        if (menuIds.toggle) GM_unregisterMenuCommand(menuIds.toggle);
        const isOn = getSetSpeedOnLoadSetting();
        menuIds.toggle = GM_registerMenuCommand(
            isOn ? "✅ 记忆倍速：开启 (点击关闭)" : "❌ 记忆倍速：关闭 (点击开启)",
            toggleMemory
        );
    }

    function toggleMemory() {
        const current = getSetSpeedOnLoadSetting();
        localStorage.setItem("dz_bilibili_video_custom_speed_set_speed_on_load", !current);
        updateMenu();
        showTip(`记忆倍速已${!current ? "开启" : "关闭"}`);
    }

    function updateSpeedSetting() {
        let input = window.prompt("输入倍速档位（空格分隔）：", getSpeedSetting().join(" "));
        if (input) {
            const speeds = input.trim().split(/\s+/).map(s => parseFloat(s)).filter(s => !isNaN(s) && s > 0);
            if (speeds.length === 0) {
                showTip("倍速设置无效");
                return;
            }
            localStorage.setItem("dz_bilibili_video_custom_speed_setting", speeds.join(" "));
            initMenu();
            showTip("倍速档位已更新");
        }
    }

    function updateShortcuts() {
        let input = window.prompt("设置快捷键（减速 加速 重置，空格分隔）：", getShortcutKeys().join(" "));
        if (input) {
            const keys = input.trim().split(/\s+/);
            if (keys.length !== 3) {
                showTip("请输入3个快捷键");
                return;
            }
            localStorage.setItem("dz_bilibili_video_custom_speed_shortcuts", keys.join(" "));
            showTip("快捷键已更新");
        }
    }

    GM_registerMenuCommand("📑 锚点列表管理", openManager);
    GM_registerMenuCommand("⚙️ 设置倍速档位", updateSpeedSetting);
    GM_registerMenuCommand("⌨️ 设置快捷键", updateShortcuts);
    updateMenu();

    // --- 键盘事件 ---
    document.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
        if (e.target.id === 'mgr-search') return;
        const video = document.querySelector("video") ?? document.querySelector("bwp-video");
        if (!video) return;

        // 锚点
        if (e.key === "`" || e.key === "·") {
            const anchors = isAutoSave() ? JSON.parse(localStorage.getItem(`anchors_${getBvid()}`) || "[]") : tempAnchors;
            const currentTime = video.currentTime;
            const exists = anchors.some(t => Math.abs(t - currentTime) < 0.5);
            if (exists) {
                showTip("该位置已存在锚点");
            } else {
                anchors.push(currentTime);
                if (isAutoSave()) saveToStore(getBvid(), anchors);
                else {
                    tempAnchors = anchors;
                    currentAnchorsData = anchors;
                    isAnchorsLoaded = false;
                }
                renderAnchors();
                showTip(`标记锚点: ${formatTime(currentTime)}`);
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            const anchors = currentAnchorsData;
            if (!anchors.length) return;
            const target = e.shiftKey
                ? [...anchors].reverse().find(t => t < video.currentTime - 1) || anchors[anchors.length - 1]
                : anchors.find(t => t > video.currentTime + 1) || anchors[0];
            video.currentTime = target;
            showTip(`跳转至 ${formatTime(target)}`);
        }

        // 倍速
        const symbolMap = { '，': ',', '。': '.', '？': '/', '【': '[', '】': ']' };
        const pressedKey = (symbolMap[e.key] || e.key).toUpperCase();
        const [kDec, kInc, kReset] = getShortcutKeys();
        const match = (t) => t.toUpperCase() === pressedKey;

        if (match(kDec) || match(kInc) || match(kReset)) {
            const list = getSpeedSetting().map(parseFloat).sort((a, b) => a - b);
            if (match(kReset)) applySpeed(1.0);
            else if (match(kDec)) {
                let p = list.filter(s => s < video.playbackRate - 0.01).pop();
                if (p !== undefined) applySpeed(p);
            }
            else if (match(kInc)) {
                let n = list.find(s => s > video.playbackRate + 0.01);
                if (n !== undefined) applySpeed(n);
            }
        }
    });

    // --- 初始化与循环检测 ---
    let cacheItem = undefined;

    function initMenu() {
        let menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu");
        if (!menu) return;
        if (!cacheItem) {
            let item = menu.children[0];
            if (!item) return;
            cacheItem = item.cloneNode(false);
            cacheItem.classList.remove("bpx-state-active");
        }
        while (menu.children.length > 0) menu.removeChild(menu.children[0]);
        getSpeedSetting().forEach(value => {
            let currentItem = cacheItem.cloneNode(false);
            currentItem.innerText = value + "x";
            currentItem.setAttribute("data-value", value);
            currentItem.onclick = () => applySpeed(parseFloat(value));
            menu.prepend(currentItem);
        });
        menu.classList.add("dz_bilibili_video_custom_speed_initialize");
    }

    let lastBvid = null;

    // 性能优化版循环
    setInterval(() => {
        const video = document.querySelector("video") ?? document.querySelector("bwp-video");
        if (!video) return;

        const curBvid = getBvid();

        // 场景1：BV号变更 (读取数据并存入缓存)
        if (curBvid !== lastBvid) {
            lastBvid = curBvid;
            tempAnchors = isAutoSave() ? [] : JSON.parse(localStorage.getItem(`anchors_${curBvid}`) || "[]");
            currentAnchorsData = isAutoSave() ? JSON.parse(localStorage.getItem(`anchors_${curBvid}`) || "[]") : tempAnchors;
            isAnchorsLoaded = false; // 重置锁，允许渲染

            if (getSetSpeedOnLoadSetting()) {
                video.playbackRate = parseFloat(localStorage.getItem("dz_bilibili_video_custom_speed_value") || 1);
            }
        }

        // 场景2：需要渲染 (锁是开启状态 且 视频时长已就绪)
        if (!isAnchorsLoaded && video.duration) {
            renderAnchors();
        }

        // 维持倍速菜单
        let menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu");
        if (menu && !menu.classList.contains("dz_bilibili_video_custom_speed_initialize")) initMenu();
    }, 500);

})();