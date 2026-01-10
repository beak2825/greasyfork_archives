// ==UserScript==
// @name         Universal Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  极致灵敏的文字复制/全功能快捷键/白瓷UI/自动回车
// @author       Gemini
// @match        *://*/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562106/Universal%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562106/Universal%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 0. 全局配置与初始化 ===
    const runScope = GM_getValue('run_scope', 'weibo.com');

    GM_registerMenuCommand("⚙️ 打开设置", forceOpenSettings);
    GM_registerMenuCommand("➕ 添加当前网站", addCurrentSite);

    function addCurrentSite() {
        const currentHost = location.hostname;
        let scopes = GM_getValue('run_scope', 'weibo.com');

        if (scopes === '*' || scopes === '') {
            alert('当前已是 [全网通用] 模式，无需添加。');
            return;
        }

        const rules = scopes.split(/[,，\n\s]+/).filter(r => r);
        if (rules.some(r => currentHost.includes(r.replace(/\*$/, '')))) {
            alert(`当前网站 ${currentHost} 已在白名单中！`);
            return;
        }

        rules.push(currentHost);
        GM_setValue('run_scope', rules.join(', '));
        if(confirm(`✅ 已添加 ${currentHost}\n是否刷新页面加载脚本？`)) location.reload();
    }

    function checkPermission() {
        const config = runScope.trim();
        if (config === '*' || config === '') return true;

        const currentUrl = location.href;
        const currentHost = location.hostname;
        const rules = config.split(/[,，\n\s]+/).filter(r => r);

        return rules.some(rule => {
            let cleanRule = rule.replace(/\*$/, '');
            if (cleanRule.includes('/')) return currentUrl.includes(cleanRule);
            return currentHost.includes(cleanRule);
        });
    }

    function forceOpenSettings() {
        if (!document.getElementById('wb-modal')) {
            GM_addStyle(STYLES);
            createSettings();
        }
        openSettings();
    }

    if (!checkPermission()) return;

    // === 1. 状态与常量 ===
    const EMOJI_MAP = { '[月]':'🈷️','[微笑]':'🙂', '[嘻嘻]':'😁', '[哈哈]':'😂', '[可爱]':'😊', '[可怜]':'🥺', '[挖鼻]':'👃', '[吃惊]':'😱', '[害羞]':'😳', '[挤眼]':'😉', '[闭嘴]':'🤐', '[鄙视]':'😒', '[爱你]':'🤟', '[泪]':'😭', '[偷笑]':'🤭', '[亲亲]':'😘', '[生病]':'😷', '[太开心]':'😆', '[白眼]':'🙄', '[右哼哼]':'😤', '[左哼哼]':'😤', '[嘘]':'🤫', '[衰]':'😓', '[委屈]':'☹️', '[吐]':'🤮', '[哈欠]':'🥱', '[抱抱]':'🤗', '[怒]':'😡', '[疑问]':'❓', '[馋嘴]':'😋', '[拜拜]':'👋', '[思考]':'🤔', '[汗]':'😅', '[困]':'😴', '[睡]':'💤', '[钱]':'💰', '[失望]':'😞', '[酷]':'😎', '[色]':'😍', '[哼]':'😤', '[鼓掌]':'👏', '[晕]':'😵', '[悲伤]':'😢', '[抓狂]':'😫', '[黑线]':'😑', '[阴险]':'😈', '[怒骂]':'🤬', '[互粉]':'🤝', '[心]':'❤️', '[伤心]':'💔', '[猪头]':'🐷', '[熊猫]':'🐼', '[兔子]':'🐰', '[ok]':'👌', '[耶]':'✌️', '[good]':'👍', '[NO]':'🚫', '[赞]':'👍', '[来]':'🙋', '[弱]':'👎', '[草泥马]':'🦙', '[神马]':'🐴', '[囧]':'😣', '[浮云]':'☁️', '[给力]':'💪', '[围观]':'👀', '[威武]':'🦁', '[奥特曼]':'🦸', '[礼物]':'🎁', '[钟]':'⏰', '[话筒]':'🎤', '[蜡烛]':'🕯️', '[蛋糕]':'🎂', '[并不简单]':'🧐', '[二哈]':'🐶', '[费解]':'😕', '[允悲]':'🤦', '[跪了]':'🧎', '[吃瓜]':'🍉', '[哆啦A梦花心]':'😍', '[哆啦A梦吃惊]':'😱', '[污]':'🤢', '[舔屏]':'👅', '[坏笑]':'😏', '[摊手]':'🤷', '[抱抱_旧]':'🫂', '[鲜花]':'🌹', '[月亮]':'🌙', '[太阳]':'☀️', '[干杯]':'🍻', '[doge]':'🐕', '[喵喵]':'🐱', '[酸]':'🍋', '[打脸]':'🤦‍♂️', '[顶]':'🔝', '[666]':'🤙', '[作揖]':'🙏', '[握手]':'🤝', '[拳头]':'👊', '[加油]':'💪', '[男孩儿]':'👦', '[女孩儿]':'👧', '[喜]':'囍', '[福]':'🧧', '[微风]':'🍃', '[下雨]':'🌧️', '[沙尘暴]':'🌪️', '[飞机]':'✈️', '[照相机]':'📷', '[音乐]':'🎵', '[电影]':'🎬', '[肥皂]':'🧼', '[手套]':'🧤', '[裂开]': '🫠', '[哇]': '🤩', '[叹气]': '😮‍💨', '[调皮]': '😜', '[笑cry]': '😂' };
    const HASH_MAP = { 'ee8d85': '👍', 'e69c89': '🈶', 'e697a0': '🈚', 'f6adb2': '😠', '523061': '❤️' };

    const state = {
        modeOn: false, isSelecting: false, startPos: { x: 0, y: 0 }, selected: new Set(),
        isDragging: false, dragOffset: { x: 0, y: 0 },
        recKey: null,
        replyText: GM_getValue('custom_reply', '收到'),
        hkToggle: GM_getValue('hk_toggle', {key:'q', alt:true, ctrl:false, shift:false}),
        hkDate: GM_getValue('hk_date', {key:'d', alt:true, ctrl:false, shift:false}),
        hkLast: GM_getValue('hk_last', {key:'e', alt:true, ctrl:false, shift:false}),
        hkAll: GM_getValue('hk_all', {key:'d', alt:true, ctrl:false, shift:false}),
        hkReply: GM_getValue('hk_reply', {key:'r', alt:true, ctrl:false, shift:false}),
        dateStr: GM_getValue('target_date_str', ''),
        showConfirm: GM_getValue('date_show_confirm', true),
        enableCopy: GM_getValue('enable_text_copy', true),
        dockPos: GM_getValue('dock_pos', null),
        runScope: runScope
    };

    let dock, overlay, modal;

    // === 2. 样式系统 ===
    const STYLES = `
        :root {
            --wb-bg: rgba(255, 255, 255, 0.92); --wb-stroke: rgba(255, 255, 255, 0.8);
            --wb-blur: blur(20px); --wb-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
            --wb-accent: #FF758C; --wb-accent-bg: #fff0f3;
            --wb-text: #555; --wb-text-dark: #333; --wb-z: 2147483647;
        }
        #wb-dock { position: fixed; z-index: var(--wb-z); display: flex; align-items: center; gap: 8px; padding: 6px; border-radius: 100px; background: var(--wb-bg); backdrop-filter: var(--wb-blur) saturate(120%); box-shadow: var(--wb-shadow), inset 0 0 0 1px var(--wb-stroke); transition: transform 0.2s; user-select: none; font-family: -apple-system, sans-serif; }
        #wb-dock:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
        #wb-dock.is-dragging { cursor: move; transform: scale(0.98); opacity: 0.9; }
        .wb-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; cursor: pointer; color: #999; transition: all 0.2s ease; position: relative; }
        .wb-btn:hover { background: rgba(0,0,0,0.03); color: #333; }
        .wb-btn:active { transform: scale(0.9); background: rgba(0,0,0,0.06); }
        .wb-btn.active { background: var(--wb-accent-bg); color: var(--wb-accent); }
        .wb-btn svg { width: 20px; height: 20px; fill: currentColor; }
        .wb-btn::after { content: attr(data-tip); position: absolute; bottom: 115%; left: 50%; transform: translateX(-50%) translateY(10px); opacity: 0; pointer-events: none; background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px; white-space: nowrap; transition: 0.2s; font-weight: 500; }
        .wb-btn:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
        .wb-div { width: 1px; height: 16px; background: rgba(0,0,0,0.08); margin: 0 2px; }
        .wb-overlay { position: fixed; border: 2px dashed var(--wb-accent); background: rgba(255, 117, 140, 0.1); z-index: 999990; pointer-events: none; display: none; border-radius: 4px; }
        .wb-selected { outline: 4px solid var(--wb-accent) !important; box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5), 0 5px 15px rgba(0,0,0,0.2) !important; z-index: 999999 !important; position: relative !important; filter: brightness(0.95); transition: 0.2s; }
        .wb-badge { position: absolute; top: -10px; right: -10px; width: 24px; height: 24px; background: var(--wb-accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; z-index: 1000000; pointer-events: none; animation: popIn 0.3s; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }

        #wb-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.1); backdrop-filter: blur(8px); z-index: var(--wb-z); display: none; align-items: center; justify-content: center; }
        .wb-box { background: white; padding: 24px; border-radius: 24px; width: 340px; box-shadow: 0 20px 60px rgba(0,0,0,0.12); animation: popUp 0.3s; font-family: system-ui, sans-serif; border: 1px solid white; display:flex; flex-direction:column; max-height: 85vh; }
        .wb-title { font-size: 16px; font-weight: 700; color: #333; margin-bottom: 20px; text-align: center; flex-shrink: 0; }
        .wb-scroll-area { overflow-y: auto; flex-grow: 1; padding-right: 4px; margin-bottom: 10px; }
        .wb-scroll-area::-webkit-scrollbar { width: 4px; }
        .wb-scroll-area::-webkit-scrollbar-thumb { background: #eee; border-radius: 4px; }

        .wb-field { margin-bottom: 16px; }
        .wb-label { font-size: 12px; color: #888; margin-bottom: 6px; display: block; font-weight: 600; }
        .wb-input { width: 100%; padding: 10px 14px; border: 1px solid #eee; border-radius: 12px; font-size: 14px; background: #f9f9f9; color: #333; outline: none; box-sizing: border-box; transition: 0.2s; }
        .wb-input:focus { background: white; border-color: var(--wb-accent); }

        .wb-domain-list { display: flex; flex-direction: column; gap: 8px; }
        .wb-domain-row { display: flex; align-items: center; gap: 8px; }
        .wb-domain-row input { flex: 1; }
        .wb-icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: #f0f0f5; color: #666; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0; }
        .wb-icon-btn:hover { background: #ffe0e6; color: #ff4757; }
        .wb-add-btn { width: 100%; padding: 8px; background: #f4f4f4; border: 1px dashed #ccc; color: #666; border-radius: 10px; cursor: pointer; font-size: 12px; margin-top: 8px; transition: 0.2s; }
        .wb-add-btn:hover { border-color: var(--wb-accent); color: var(--wb-accent); background: #fff0f3; }

        .wb-btn-block { width: 100%; padding: 12px; border: none; border-radius: 14px; background: #333; color: white; font-weight: 600; cursor: pointer; font-size: 14px; transition: 0.2s; flex-shrink: 0; }
        .wb-btn-block:hover { transform: scale(0.98); opacity: 0.9; }
        .wb-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .wb-txt { font-size: 14px; color: #555; }
        .wb-switch { position: relative; width: 44px; height: 24px; }
        .wb-switch input { opacity: 0; width: 0; height: 0; }
        .wb-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e0e0e0; transition: .3s; border-radius: 34px; }
        .wb-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s cubic-bezier(0.2, 0.8, 0.2, 1); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        input:checked + .wb-slider { background-color: var(--wb-accent); }
        input:checked + .wb-slider:before { transform: translateX(20px); }
        .wb-key { padding: 8px; background: #f4f4f4; border-radius: 8px; text-align: center; font-size: 12px; color: #666; cursor: pointer; border: 1px solid transparent; margin-bottom: 5px; display: block; width: 100%; box-sizing: border-box;}
        .wb-key.rec { background: #fff0f3; color: var(--wb-accent); border-color: var(--wb-accent); }
        .wb-toast { position: fixed; top: 40px; left: 50%; transform: translateX(-50%) translateY(-20px); background: white; padding: 8px 20px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); z-index: var(--wb-z); opacity: 0; pointer-events: none; transition: 0.3s; font-size: 13px; font-weight: 600; color: #444; border: 1px solid #f0f0f0; display: flex; align-items: center; gap: 6px; }
        .wb-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        @keyframes popUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
        body.wb-mode-on img { pointer-events: auto !important; cursor: crosshair !important; }
    `;
    GM_addStyle(STYLES);

    // === 3. 初始化 UI ===
    function init() {
        if(document.getElementById('wb-dock')) return;

        dock = document.createElement('div'); dock.id = 'wb-dock';

        if (state.dockPos) {
            dock.style.left = state.dockPos.left;
            dock.style.top = state.dockPos.top;
            dock.style.right = 'auto'; dock.style.bottom = 'auto';
        } else {
            dock.style.bottom = '60px'; dock.style.right = '50px';
        }

        const btnSelect = createBtn('wb-sel', '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>', `选图 (${fmtKey(state.hkToggle)})`);
        const btnDate = createBtn('wb-date', '<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>', `按日期 (${fmtKey(state.hkDate)})`);
        const btnLast = createBtn('wb-last', '<svg viewBox="0 0 24 24"><path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/></svg>', `最新一张 (${fmtKey(state.hkLast)})`);
        const btnAll = createBtn('wb-all', '<svg viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>', `下载全部 (${fmtKey(state.hkAll)})`);
        const btnReply = createBtn('wb-reply', '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>', `回复: ${state.replyText} (${fmtKey(state.hkReply)})`);
        const btnSet = createBtn('wb-set', '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.08-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>', '设置');

        const div1 = document.createElement('div'); div1.className = 'wb-div';
        const div2 = document.createElement('div'); div2.className = 'wb-div';

        dock.append(btnSelect, btnDate, btnLast, div1, btnAll, div2, btnReply, btnSet);
        document.body.appendChild(dock);

        overlay = document.createElement('div'); overlay.className = 'wb-overlay';
        document.body.appendChild(overlay);

        createSettings();
        bindInteractions();
        bindKeys();

        document.addEventListener('click', onImageClickCapture, true);

        btnSelect.onclick = toggleSelectMode;
        btnDate.onclick = runDate;
        btnLast.onclick = downloadLast;
        btnAll.onclick = downloadAll;
        btnReply.onclick = quickReply;
        btnSet.onclick = openSettings;
    }

    function createBtn(id, icon, tip) {
        const b = document.createElement('button');
        b.id = id; b.className = 'wb-btn'; b.innerHTML = icon; b.dataset.tip = tip;
        return b;
    }

    // === 5. 核心功能 ===
    function onImageClickCapture(e) {
        if (!state.modeOn) return;
        if (e.target.tagName === 'IMG' && checkImg(e.target)) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            toggleImgSelection(e.target);
        }
    }

    function quickReply() {
        const text = state.replyText;
        const chatBox = document.querySelector('.chat-content') || document.querySelector('.m-message-list') || document.body;
        const input = document.querySelector('textarea');
        const sendBtn = Array.from(document.querySelectorAll('a, div, button')).find(el => el.innerText === '发送' && el.offsetParent !== null && !el.className.includes('disabled'));

        if (input) {
            input.focus(); input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                if (sendBtn) sendBtn.click();
                showToast(`🚀 已发送: ${text}`);
            }, 100);
        } else { showToast('❌ 未找到输入框'); }
    }

    function toggleSelectMode() {
        state.modeOn = !state.modeOn;
        const btn = document.getElementById('wb-sel');
        if (state.modeOn) {
            document.body.classList.add('wb-mode-on');
            btn.classList.add('active');
            updateSelectBtn(); showToast('✨ 进入选图模式 (点击图片即可选中)');
            bindSelectEvents(true);
        } else {
            if (state.selected.size > 0) downloadImgs(Array.from(state.selected));
            document.body.classList.remove('wb-mode-on');
            btn.classList.remove('active');
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>';
            btn.dataset.tip = `选图 (${fmtKey(state.hkToggle)})`;
            clearSelection();
            bindSelectEvents(false);
        }
    }

    function updateSelectBtn() {
        const btn = document.getElementById('wb-sel');
        if (state.selected.size > 0) {
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
            btn.dataset.tip = `下载 (${state.selected.size})`;
        } else {
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>';
            btn.dataset.tip = `选图 (${fmtKey(state.hkToggle)})`;
        }
    }

    function bindSelectEvents(bind) {
        const method = bind ? 'addEventListener' : 'removeEventListener';
        document[method]('mousedown', onDown);
        document[method]('mousemove', onMove);
        document[method]('mouseup', onUp);
    }

    function onDown(e) {
        const chatBox = document.querySelector('.chat-content') || document.querySelector('.vue-recycle-scroller');
        const isChat = chatBox && chatBox.contains(e.target);
        if(dock.contains(e.target) || modal.style.display==='flex' || e.button!==0 || !isChat || e.target.tagName === 'IMG') return;
        e.preventDefault();
        state.isSelecting=true; state.startPos={x:e.clientX, y:e.clientY};
        overlay.style.display='block'; updateOverlay(e);
    }
    function onMove(e) { if(state.isSelecting) requestAnimationFrame(() => updateOverlay(e)); }
    function onUp(e) {
        if (!state.isSelecting) return;
        state.isSelecting = false; overlay.style.display = 'none';
        const rect = { left: Math.min(state.startPos.x, e.clientX), top: Math.min(state.startPos.y, e.clientY), width: Math.abs(e.clientX - state.startPos.x), height: Math.abs(e.clientY - state.startPos.y) };
        const imgs = getValidImages();
        if (rect.width > 5 && rect.height > 5) {
            imgs.forEach(img => {
                const r = img.getBoundingClientRect();
                if (r.left < rect.left + rect.width && r.left + r.width > rect.left && r.top < rect.top + rect.height && r.top + r.height > rect.top) toggleImgSelection(img);
            });
        }
    }

    function updateOverlay(e) {
        const w = Math.abs(e.clientX - state.startPos.x), h = Math.abs(e.clientY - state.startPos.y);
        overlay.style.left = Math.min(e.clientX, state.startPos.x) + 'px';
        overlay.style.top = Math.min(e.clientY, state.startPos.y) + 'px';
        overlay.style.width = w + 'px'; overlay.style.height = h + 'px';
    }

    function toggleImgSelection(img) {
        if (state.selected.has(img)) { state.selected.delete(img); img.classList.remove('wb-selected'); removeBadge(img); }
        else { state.selected.add(img); img.classList.add('wb-selected'); addBadge(img); }
        updateSelectBtn();
    }
    function clearSelection() { state.selected.forEach(img => { img.classList.remove('wb-selected'); removeBadge(img); }); state.selected.clear(); updateSelectBtn(); }

    function addBadge(img) {
        const b=document.createElement('div'); b.className='wb-badge'; b.innerText=state.selected.size;
        img.dataset.uid=Math.random().toString(36).substr(2); b.dataset.for=img.dataset.uid;
        const p=img.parentElement; if(getComputedStyle(p).position==='static') p.style.position='relative'; p.appendChild(b);
    }
    function removeBadge(img) { const b=img.parentElement.querySelector(`.wb-badge[data-for="${img.dataset.uid}"]`); if(b) b.remove(); reorder(); }
    function reorder() { let i=1; state.selected.forEach(m=>{const b=m.parentElement.querySelector(`.wb-badge[data-for="${m.dataset.uid}"]`); if(b) b.innerText=i++;}); }

    function checkImg(img) { return img.width>50 && !img.src.includes('expression') && !img.classList.contains('avatar'); }
    function getValidImages() { return Array.from(document.querySelectorAll('img')).filter(checkImg); }

    function downloadLast() {
        const valid = getValidImages();
        if (valid.length > 0) { downloadImgs([valid[valid.length - 1]]); showToast('🌸 已抓取最新一张'); }
        else { showToast('💨 没找到图片'); }
    }

    function downloadAll() {
        const imgs = getValidImages();
        if(imgs.length === 0) return showToast('💨 屏幕内没有图片');
        if(state.showConfirm) {
            if(confirm(`📦 屏幕内共发现 ${imgs.length} 张图片，确认全部下载？`)) downloadImgs(imgs);
        } else {
            downloadImgs(imgs);
        }
    }

    function runDate() {
        const input = state.dateStr.trim();
        if(!input) { showToast('❌ 请先在设置中输入日期'); return openSettings(); }
        const list = document.querySelectorAll('.chat-content li');
        let imgs = [], curr = '', regex = /^\d{1,2}:\d{2}$/;
        list.forEach(li => {
            const t = li.querySelector('.time');
            if(t) curr = t.innerText.trim();
            let match = (input==='今天') ? (curr.includes('今天')||regex.test(curr)) : (input==='昨天') ? curr.includes('昨天') : curr.includes(input);
            if(match) li.querySelectorAll('img').forEach(img => { if(checkImg(img)) imgs.push(img); });
        });
        if(!imgs.length) return showToast(`⚠️ 未找到 "${input}" 的图片`);
        if(state.showConfirm && !confirm(`📅 找到 ${imgs.length} 张图片，下载？`)) return;
        downloadImgs(imgs);
    }

    function downloadImgs(list) {
        if(!list.length) return;
        let idx=0;
        showToast('🚀 开始下载...');
        const next = () => {
            if(idx>=list.length) { showToast('🎉 下载完成'); if(state.modeOn) toggleSelectMode(); return; }
            let url = list[idx].getAttribute('data-src') || list[idx].src;
            if (location.hostname.includes('weibo.com')) {
                if(url.includes('msget_thumbnail')) url = url.replace('msget_thumbnail','msget')+'&imageType=origin';
            }
            const d=new Date(), ts=`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
            GM_download({ url: url, name: `wb_${ts}_${idx+1}.jpg`, onload:()=>{idx++;setTimeout(next,200)}, onerror:()=>{idx++;next()} });
        };
        next();
    }

    function bindInteractions() {
        let sx, sy;
        dock.onmousedown = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            state.isDragging = false; sx = e.clientX; sy = e.clientY;
            state.dragOffset = { x: e.clientX - dock.offsetLeft, y: e.clientY - dock.offsetTop };
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        };
        function onDrag(e) {
            if (!state.isDragging && (Math.abs(e.clientX - sx) > 3 || Math.abs(e.clientY - sy) > 3)) {
                state.isDragging = true; dock.classList.add('is-dragging');
            }
            if (state.isDragging) {
                dock.style.left = (e.clientX - state.dragOffset.x) + 'px';
                dock.style.top = (e.clientY - state.dragOffset.y) + 'px';
                dock.style.right = 'auto'; dock.style.bottom = 'auto';
            }
        }
        function stopDrag() {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            setTimeout(() => {
                dock.classList.remove('is-dragging');
                GM_setValue('dock_pos', { left: dock.style.left, top: dock.style.top });
            }, 50);
        }
    }

    // 状态自愈 (Fix V1.5.1)
    window.addEventListener('pageshow', () => { state.isDragging = false; state.isSelecting = false; if(dock) dock.classList.remove('is-dragging'); });
    document.addEventListener('visibilitychange', () => { if(document.visibilityState==='visible') { state.isDragging=false; state.isSelecting=false; if(dock) dock.classList.remove('is-dragging'); } });

    function createSettings() {
        modal = document.createElement('div'); modal.id = 'wb-modal';
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

        const scopesStr = GM_getValue('run_scope', '*');
        const scopeList = scopesStr === '*' ? ['*'] : scopesStr.split(/[,，\n\s]+/).filter(r=>r);

        modal.innerHTML = `
            <div class="wb-box">
                <div class="wb-title">⚙️ 偏好设置</div>

                <div class="wb-scroll-area">
                    <div class="wb-field">
                        <label class="wb-label">🌍 运行范围 (域名或路径)</label>
                        <div class="wb-domain-list" id="wb-scope-list"></div>
                        <button class="wb-add-btn" id="wb-add-scope">+ 添加规则 (支持通配符)</button>
                    </div>

                    <div class="wb-field">
                        <label class="wb-label">💬 自动回复内容</label>
                        <input type="text" id="wb-reply-in" class="wb-input" value="${state.replyText}">
                    </div>

                    <div class="wb-field">
                        <label class="wb-label">📅 日期下载</label>
                        <input type="text" id="wb-in-date" class="wb-input" placeholder="输入: 2025-02-14 或 今天">
                    </div>

                    <div class="wb-field">
                        <label class="wb-label">📦 功能开关</label>
                        <div class="wb-row">
                            <span class="wb-txt">下载前弹窗确认</span>
                            <label class="wb-switch"><input type="checkbox" id="wb-toggle-confirm"><span class="wb-slider"></span></label>
                        </div>
                        <div class="wb-row">
                            <span class="wb-txt">文本复制助手 (Emoji翻译)</span>
                            <label class="wb-switch"><input type="checkbox" id="wb-toggle-copy"><span class="wb-slider"></span></label>
                        </div>
                    </div>

                    <div class="wb-field">
                        <label class="wb-label">⌨️ 快捷键设置 (点击录制)</label>
                        <div id="wb-k-toggle" class="wb-key">选图模式: ${fmtKey(state.hkToggle)}</div>
                        <div id="wb-k-date" class="wb-key">按日期下: ${fmtKey(state.hkDate)}</div>
                        <div id="wb-k-last" class="wb-key">最新一张: ${fmtKey(state.hkLast)}</div>
                        <div id="wb-k-all" class="wb-key">下载全部: ${fmtKey(state.hkAll)}</div>
                        <div id="wb-k-reply" class="wb-key">极速回复: ${fmtKey(state.hkReply)}</div>
                    </div>
                </div>

                <button id="wb-save" class="wb-btn-block">保存并关闭</button>
            </div>
        `;
        document.body.appendChild(modal);

        const listContainer = document.getElementById('wb-scope-list');
        const renderRow = (val) => {
            const row = document.createElement('div'); row.className = 'wb-domain-row';
            const input = document.createElement('input'); input.type='text'; input.className='wb-input'; input.value=val;
            const delBtn = document.createElement('button'); delBtn.className='wb-icon-btn'; delBtn.innerHTML='🗑️';
            delBtn.onclick = () => row.remove();
            row.append(input, delBtn);
            listContainer.appendChild(row);
        };
        scopeList.forEach(renderRow);

        document.getElementById('wb-add-scope').onclick = () => renderRow('');

        const replyIn = document.getElementById('wb-reply-in');
        const inDate = document.getElementById('wb-in-date');
        inDate.value = state.dateStr;
        inDate.oninput = (e) => { state.dateStr = e.target.value; GM_setValue('target_date_str', e.target.value); };

        const toggleConfirm = document.getElementById('wb-toggle-confirm');
        toggleConfirm.checked = state.showConfirm;
        toggleConfirm.onchange = (e) => { state.showConfirm = e.target.checked; GM_setValue('date_show_confirm', e.target.checked); };

        const toggleCopy = document.getElementById('wb-toggle-copy');
        toggleCopy.checked = state.enableCopy;
        toggleCopy.onchange = (e) => { state.enableCopy = e.target.checked; GM_setValue('enable_text_copy', e.target.checked); };

        document.getElementById('wb-save').onclick = () => {
            state.replyText = replyIn.value;
            GM_setValue('custom_reply', state.replyText);
            document.getElementById('wb-reply').dataset.tip = `回复: ${state.replyText} (${fmtKey(state.hkReply)})`;

            const inputs = listContainer.querySelectorAll('input');
            const newScopes = Array.from(inputs).map(i => i.value.trim()).filter(v => v);
            const scopeStr = newScopes.length > 0 ? newScopes.join(', ') : '*';
            GM_setValue('run_scope', scopeStr);
            state.runScope = scopeStr;

            modal.style.display = 'none';
            showToast('✅ 设置已保存');

            if (!checkPermission()) {
                if(confirm('⚠️ 当前域名已不在白名单内，脚本将停止运行。\n是否刷新页面？')) location.reload();
            }
        };

        const bindRec = (id, type, storeKey) => {
            const el = document.getElementById(id);
            el.onclick = (e) => {
                e.stopPropagation(); el.innerText = '请按下快捷键...'; el.classList.add('rec');
                state.recKey = { type, el, storeKey };
            };
        };
        bindRec('wb-k-toggle', 'toggle', 'hk_toggle');
        bindRec('wb-k-date', 'date', 'hk_date'); // 修正：映射到 hk_date
        bindRec('wb-k-last', 'last', 'hk_last');
        bindRec('wb-k-all', 'all', 'hk_all');
        bindRec('wb-k-reply', 'reply', 'hk_reply');
    }

    function openSettings() { modal.style.display = 'flex'; }

    function bindKeys() {
        document.addEventListener('keydown', (e) => {
            if (state.recKey) {
                e.preventDefault(); e.stopPropagation();
                if(['Control','Alt','Shift','Meta'].includes(e.key)) return;
                const nk = { key:e.key.toLowerCase(), alt:e.altKey, ctrl:e.ctrlKey, shift:e.shiftKey };

                // 保存快捷键
                switch(state.recKey.type) {
                    case 'toggle': state.hkToggle = nk; break;
                    case 'date': state.hkDate = nk; break;
                    case 'last': state.hkLast = nk; break;
                    case 'all': state.hkAll = nk; break;
                    case 'reply': state.hkReply = nk; break;
                }

                GM_setValue(state.recKey.storeKey, nk);

                // 刷新按钮提示
                document.getElementById('wb-sel').dataset.tip = `选图 (${fmtKey(state.hkToggle)})`;
                document.getElementById('wb-date').dataset.tip = `按日期 (${fmtKey(state.hkDate)})`;
                document.getElementById('wb-last').dataset.tip = `最新一张 (${fmtKey(state.hkLast)})`;
                document.getElementById('wb-all').dataset.tip = `下载全部 (${fmtKey(state.hkAll)})`;
                document.getElementById('wb-reply').dataset.tip = `回复: ${state.replyText} (${fmtKey(state.hkReply)})`;

                // 刷新设置面板显示的文字
                const typeMap = { 'toggle':'选图模式', 'date':'按日期下', 'last':'最新一张', 'all':'下载全部', 'reply':'极速回复' };
                state.recKey.el.innerText = `${typeMap[state.recKey.type]}: ${fmtKey(nk)}`;
                state.recKey.el.classList.remove('rec');
                state.recKey = null;
                return;
            }
            if (matchKey(e, state.hkToggle)) toggleSelectMode();
            if (matchKey(e, state.hkDate)) runDate();
            if (matchKey(e, state.hkLast)) downloadLast();
            if (matchKey(e, state.hkAll)) downloadAll();
            if (matchKey(e, state.hkReply)) quickReply();
            if (state.modeOn && e.key === 'Escape') toggleSelectMode();
        });
    }

    function showToast(msg) {
        const t = document.createElement('div'); t.className = 'wb-toast';
        t.innerHTML = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2000);
    }

    // 零延迟复制 (V1.5.2 特性)
    document.addEventListener('mouseup', () => {
        requestAnimationFrame(() => {
            if(!state.enableCopy || state.modeOn || (modal && modal.style.display === 'flex')) return;
            const sel = window.getSelection();
            if(sel.isCollapsed) return;

            const div = document.createElement('div');
            div.appendChild(sel.getRangeAt(0).cloneContents());

            div.querySelectorAll('img').forEach(img => {
                let done = false; const alt = img.alt || img.title;
                if(alt) { if(EMOJI_MAP[alt]) { img.replaceWith(EMOJI_MAP[alt]); done=true; } else { img.replaceWith(alt); done=true; } }
                if(!done && img.src) for(const [h,em] of Object.entries(HASH_MAP)) if(img.src.includes(h)) { img.replaceWith(em); done=true; break; }
                if(!done && (img.src.includes('expression')||img.src.includes('emimage'))) img.replaceWith('[表情]');
            });

            const txt = div.textContent;
            if(txt && txt.trim().length > 0) {
                GM_setClipboard(txt);
                showToast(`✨ 已复制: ${txt.substring(0,8)}...`);
            }
        });
    });

    function matchKey(e,s) { return e.key.toLowerCase()===s.key && e.altKey===s.alt && e.ctrlKey===s.ctrl && e.shiftKey===s.shift; }
    function fmtKey(s) { const p=[]; if(s.ctrl)p.push('Ctrl'); if(s.alt)p.push('Alt'); if(s.shift)p.push('Shift'); p.push(s.key.toUpperCase()); return p.join('+'); }

    setTimeout(init, 1000);
})();