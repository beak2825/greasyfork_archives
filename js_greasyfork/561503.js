// ==UserScript==
// @name         全能网页助手 (by鲨鱼) - 优化版
// @namespace    http://tampermonkey.net/
// @version      9.2
// @description  全网同步录屏、视频下载、截图。修复代码发布时的外部库白名单限制问题。
// @author       Gemini Expert
// @match        *://*/*
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/dom-to-image-more@2.9.5/dist/dom-to-image-more.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561503/%E5%85%A8%E8%83%BD%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B%20%28by%E9%B2%A8%E9%B1%BC%29%20-%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561503/%E5%85%A8%E8%83%BD%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B%20%28by%E9%B2%A8%E9%B1%BC%29%20-%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 状态管理 ---
    const KEY_HIDE_UNTIL = 'gemini_hide_until_' + window.location.hostname;
    const KEY_REC_STATE = 'gemini_rec_state';
    const KEY_REC_CMD = 'gemini_rec_cmd';

    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecordingLocal = false;
    let isDragging = false;

    // 监听录制状态
    GM_addValueChangeListener(KEY_REC_STATE, (name, oldVal, newVal, remote) => {
        updateRecButtonUI(newVal === 'recording');
    });

    // 监听远程停止
    GM_addValueChangeListener(KEY_REC_CMD, (name, oldVal, newVal, remote) => {
        if (remote && isRecordingLocal && newVal && newVal.startsWith('stop')) {
            stopRecording(true);
        }
    });

    function isHidden() {
        const hideUntil = GM_getValue(KEY_HIDE_UNTIL, 0);
        if (hideUntil === 0) return false;
        if (hideUntil === -1) return true;
        return Date.now() < hideUntil;
    }

    GM_registerMenuCommand("♻️ 恢复显示悬浮球", () => {
        GM_setValue(KEY_HIDE_UNTIL, 0);
        alert("✅ 已恢复显示！页面即将刷新...");
        location.reload();
    });

    if (isHidden()) return;

    // --- 2. CSS 样式 ---
    const css = `
        /* 悬浮球 */
        #gemini-helper-ball {
            position: fixed;
            width: 50px; height: 50px;
            background: rgba(0, 123, 255, 0.85); color: white;
            border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 2147483647; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; user-select: none;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s;
            font-family: system-ui, sans-serif; backdrop-filter: blur(4px);
            touch-action: none;
        }
        /* 悬停交互：增大弹出边距至 35px */
        #gemini-helper-ball:hover { background: #007bff; transform: scale(1.1); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
        #gemini-helper-ball[data-side="left"]:hover { transform: scale(1.1) translateX(35px) !important; }
        #gemini-helper-ball[data-side="right"]:hover { transform: scale(1.1) translateX(-35px) !important; }

        .gh-snap-anim {
            transition: left 0.5s cubic-bezier(0.25, 1, 0.5, 1), top 0.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        /* 菜单容器 */
        #gemini-helper-menu {
            position: fixed;
            width: 260px;
            background: #ffffff;
            border: 1px solid #e0e0e0; border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            z-index: 2147483647;
            padding: 12px;
            display: none;
            flex-direction: column;
            gap: 10px;
            font-family: system-ui, sans-serif; font-size: 13px; color: #333;
            height: auto !important;
            box-sizing: border-box;
        }

        .gh-header { display: flex; justify-content: space-between; align-items: center; margin: 0; padding: 0; }

        .gh-btn {
            display: block; width: 100%; padding: 8px; margin: 0;
            background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px;
            cursor: pointer; text-align: left; color: #374151; font-weight: 500; transition: all 0.2s;
        }
        .gh-btn:hover { background: #e5e7eb; }
        .gh-btn.primary { background: #2563eb; color: white; border: none; }
        .gh-btn.primary:hover { background: #1d4ed8; }
        .gh-btn.danger { color: #dc2626; background: #fef2f2; border-color: #fecaca; }
        .gh-btn.record { background: #be123c; color: white; border: none; }
        .gh-btn.record:hover { background: #9f1239; }
        .gh-btn.remote-stop { background: #f59e0b; color: white; border: none; }

        .gh-row { display: flex; align-items: center; justify-content: space-between; margin: 0; }
        .gh-select { padding: 4px; border-radius: 4px; border: 1px solid #ccc; font-size: 12px; width: 60%; }
        
        .gh-btn-group { display: flex; gap: 5px; margin-top: 5px; }
        .gh-btn-sm { flex: 1; padding: 5px; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 4px; cursor: pointer; text-align: center; color: #4338ca; font-size: 12px; }
        .gh-btn-sm:hover { background: #e0e7ff; }

        .gh-mouse-halo {
            position: fixed; width: 30px; height: 30px;
            background: rgba(255, 255, 0, 0.4);
            border: 2px solid rgba(255, 200, 0, 0.6);
            border-radius: 50%; pointer-events: none; z-index: 2147483646;
            transform: translate(-50%, -50%); display: none;
        }
        .gh-click-ripple {
            position: fixed; border-radius: 50%;
            background: rgba(0, 150, 255, 0.4);
            transform: translate(-50%, -50%);
            pointer-events: none; z-index: 2147483646;
            animation: gh-ripple-anim 0.6s linear forwards;
        }
        @keyframes gh-ripple-anim { 0% { width: 0; height: 0; opacity: 1; } 100% { width: 60px; height: 60px; opacity: 0; } }

        .gh-tabs { display: flex; border-bottom: 1px solid #eee; margin-bottom: 0; padding-bottom: 5px; }
        .gh-tab { flex: 1; text-align: center; padding: 5px; cursor: pointer; color: #666; border-bottom: 2px solid transparent; }
        .gh-tab.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: bold; }
        
        /* 统一面板高度 */
        .gh-panel { display: none; box-sizing: border-box; min-height: 210px; }
        .gh-panel.active { display: flex; flex-direction: column; gap: 8px; }
        #gh-vid-list { flex-grow: 1; max-height: 120px !important; }
    `;
    GM_addStyle(css);

    function createEl(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        Object.assign(el, props);
        children.forEach(c => typeof c === 'string' ? el.appendChild(document.createTextNode(c)) : el.appendChild(c));
        return el;
    }

    // --- 4. 初始化 ---
    function init() {
        if (document.getElementById('gemini-helper-ball')) return;

        // 鼠标光圈
        const halo = createEl('div', { id: 'gh-mouse-halo', className: 'gh-mouse-halo' });
        document.body.appendChild(halo);

        // 悬浮球
        const ball = createEl('div', { id: 'gemini-helper-ball', textContent: '🦈' });
        ball.style.top = (window.innerHeight - 150) + 'px';
        ball.style.left = (window.innerWidth - 60) + 'px';
        document.body.appendChild(ball);

        // 菜单
        const menu = createEl('div', { id: 'gemini-helper-menu' });
        
        // 标题
        const header = createEl('div', { className: 'gh-header' }, [
            createEl('strong', { textContent: '鲨鱼定制助手' }),
            createEl('span', { textContent: '✖', style: 'cursor:pointer; color:#999;', onclick: () => toggleMenu() })
        ]);
        menu.appendChild(header);

        // 标签页
        const tabNav = createEl('div', { className: 'gh-tabs' });
        const tabs = ['截图', '录屏', '视频'];
        const panels = [];
        tabs.forEach((t, i) => {
            const tab = createEl('div', { className: `gh-tab ${i===0?'active':''}`, textContent: t });
            tab.onclick = () => switchTab(i);
            tabNav.appendChild(tab);
        });
        menu.appendChild(tabNav);

        // --- 面板1: 截图 ---
        const panelShot = createEl('div', { className: 'gh-panel active', id: 'panel-0' });
        const shotTip = createEl('div', { textContent: '截图设置', style: 'font-weight:bold; font-size:12px; color:#333;' });
        
        const rowTime = createEl('div', { className: 'gh-row' });
        const cbTime = createEl('input', { type: 'checkbox', id: 'gh-shot-time', checked: true });
        rowTime.append(createEl('span', { textContent: '时间水印' }), cbTime);

        const rowFmt = createEl('div', { className: 'gh-row' }, [
            createEl('label', { textContent: '图片格式:' }),
            createEl('select', { id: 'gh-shot-fmt', className: 'gh-select' }, [
                createEl('option', { value: 'png', textContent: 'PNG (清晰)' }),
                createEl('option', { value: 'jpeg', textContent: 'JPG (小巧)' })
            ])
        ]);

        const rowDelay = createEl('div', { className: 'gh-row' }, [
            createEl('label', { textContent: '延时截取:' }),
            createEl('select', { id: 'gh-shot-delay', className: 'gh-select' }, [
                createEl('option', { value: '0', textContent: '立即' }),
                createEl('option', { value: '1000', textContent: '1 秒后' }),
                createEl('option', { value: '3000', textContent: '3 秒后' })
            ])
        ]);

        const btnShot = createEl('button', { className: 'gh-btn primary', textContent: '📸 截取网页' });
        btnShot.onclick = doCapture;

        panelShot.append(shotTip, rowTime, rowFmt, rowDelay, btnShot);
        panels.push(panelShot);

        // --- 面板2: 录屏 ---
        const panelRec = createEl('div', { className: 'gh-panel', id: 'panel-1' });
        const qualityRow = createEl('div', { className: 'gh-row' }, [
            createEl('label', { textContent: '画质:' }),
            createEl('select', { id: 'gh-rec-quality', className: 'gh-select' }, [
                createEl('option', { value: 'low', textContent: '节约空间' }),
                createEl('option', { value: 'medium', textContent: '标准', selected: true }),
                createEl('option', { value: 'high', textContent: '高清' })
            ])
        ]);
        const formatRow = createEl('div', { className: 'gh-row' }, [
            createEl('label', { textContent: '格式:' }),
            createEl('select', { id: 'gh-rec-format', className: 'gh-select' }, [
                createEl('option', { value: 'webm', textContent: 'WebM (推荐)' }),
                createEl('option', { value: 'mkv', textContent: 'MKV' })
            ])
        ]);
        const trailRow = createEl('div', { className: 'gh-row' });
        const cbTrail = createEl('input', { type: 'checkbox', id: 'gh-cb-trail', checked: true });
        trailRow.appendChild(createEl('label', { textContent: '显示点击与轨迹' }));
        trailRow.insertBefore(cbTrail, trailRow.firstChild);

        const btnRec = createEl('button', { id: 'gh-btn-rec', className: 'gh-btn record', textContent: '⏺️ 开始录制屏幕' });
        btnRec.onclick = handleRecBtnClick;

        panelRec.append(qualityRow, formatRow, trailRow, btnRec);
        const recStatus = createEl('div', { id: 'gh-rec-status', style: 'font-size:12px; color:#666; text-align:center;' });
        panelRec.appendChild(recStatus);
        panels.push(panelRec);

        // --- 面板3: 视频 ---
        const panelVid = createEl('div', { className: 'gh-panel', id: 'panel-2' });
        const vidTools = createEl('div', { style: 'border-bottom:1px solid #eee; padding-bottom:5px;' });
        vidTools.appendChild(createEl('div', { textContent: '全局控制:', style:'font-size:12px; color:#666;' }));
        
        const speedGroup = createEl('div', { className: 'gh-btn-group' });
        ['1.0x', '1.5x', '2.0x', '3.0x'].forEach(rate => {
            const b = createEl('div', { className: 'gh-btn-sm', textContent: rate });
            b.onclick = () => { document.querySelectorAll('video').forEach(v => v.playbackRate = parseFloat(rate)); alert(`🚀 全局视频倍速已设为 ${rate}`); };
            speedGroup.appendChild(b);
        });
        const btnPip = createEl('button', { className: 'gh-btn', textContent: '📺 开启画中画', style:'margin-top:5px; padding:5px;' });
        btnPip.onclick = () => {
            const v = document.querySelector('video');
            if(v && v.requestPictureInPicture) v.requestPictureInPicture().catch(e=>alert('❌ '+e.message)); else alert('⚠️ 未找到视频');
        };
        vidTools.append(speedGroup, btnPip);

        const btnScan = createEl('button', { className: 'gh-btn', textContent: '🔄 扫描视频资源' });
        btnScan.onclick = doScanVideo;
        const vidList = createEl('div', { id: 'gh-vid-list', style: 'max-height:120px; overflow-y:auto; font-size:12px;' });
        panelVid.append(vidTools, btnScan, vidList);
        panels.push(panelVid);

        panels.forEach(p => menu.appendChild(p));

        const btnHide = createEl('button', { className: 'gh-btn danger', textContent: '🙈 隐藏助手', onclick: showHideModal });
        menu.appendChild(btnHide);

        document.body.appendChild(menu);
        createHideModal();

        function switchTab(idx) {
            menu.querySelectorAll('.gh-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
            menu.querySelectorAll('.gh-panel').forEach((p, i) => p.classList.toggle('active', i === idx));
        }

        if (GM_getValue(KEY_REC_STATE) === 'recording') updateRecButtonUI(true);

        makeDraggable(ball);
        enableMouseViz(true);
    }

    // --- 5. 悬浮球拖拽 ---
    function makeDraggable(el) {
        let startX, startY, initialLeft, initialTop, hasMoved = false;

        const onDown = (e) => {
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            startX = clientX; startY = clientY;
            initialLeft = el.offsetLeft; initialTop = el.offsetTop;
            hasMoved = false; isDragging = true;
            el.classList.remove('gh-snap-anim');
            el.removeAttribute('data-side');
            
            document.addEventListener('mousemove', onMove); document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onUp); document.addEventListener('touchend', onUp);
        };

        const onMove = (e) => {
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            if (Math.abs(clientX - startX) > 3 || Math.abs(clientY - startY) > 3) {
                hasMoved = true;
                e.preventDefault();
                el.style.left = (initialLeft + (clientX - startX)) + 'px';
                el.style.top = (initialTop + (clientY - startY)) + 'px';
                document.getElementById('gemini-helper-menu').style.display = 'none';
            }
        };

        const onUp = (e) => {
            document.removeEventListener('mousemove', onMove); document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onUp); document.removeEventListener('touchend', onUp);
            isDragging = false;
            if (hasMoved) snapToEdge(el);
            else toggleMenu();
        };

        el.addEventListener('mousedown', onDown);
        el.addEventListener('touchstart', onDown, { passive: false });
    }

    function snapToEdge(el) {
        el.classList.add('gh-snap-anim');
        const winWidth = window.innerWidth;
        const rect = el.getBoundingClientRect();
        if (rect.left + rect.width / 2 < winWidth / 2) { el.style.left = '-15px'; el.setAttribute('data-side', 'left'); } 
        else { el.style.left = (winWidth - 35) + 'px'; el.setAttribute('data-side', 'right'); }
    }

    function toggleMenu() {
        const menu = document.getElementById('gemini-helper-menu');
        const ball = document.getElementById('gemini-helper-ball');
        
        if (menu.style.display === 'flex') {
            menu.style.display = 'none';
            // 关闭时：自动吸附
            snapToEdge(ball);
        } else {
            // 打开时：不强制修改位置，保持原地
            // 如果球是隐藏状态，先稍微弹出来一点点以便定位，但保持 data-side
            if (ball.style.left === '-15px') { ball.style.left = '5px'; ball.removeAttribute('data-side'); }
            if (parseInt(ball.style.left) > window.innerWidth - 40) { ball.style.left = (window.innerWidth - 55) + 'px'; ball.removeAttribute('data-side'); }

            const ballRect = ball.getBoundingClientRect();
            menu.style.top = ''; menu.style.bottom = ''; menu.style.left = ''; menu.style.right = '';

            if (ballRect.left < window.innerWidth / 2) { menu.style.left = (ballRect.right + 10) + 'px'; } 
            else { menu.style.right = (window.innerWidth - ballRect.left + 10) + 'px'; }

            if (ballRect.top > window.innerHeight / 2) { menu.style.bottom = (window.innerHeight - ballRect.bottom) + 'px'; menu.style.top = 'auto'; } 
            else { menu.style.top = ballRect.top + 'px'; menu.style.bottom = 'auto'; }
            
            menu.style.display = 'flex';
        }
    }

    // --- 6. 功能模块 ---
    async function handleRecBtnClick() {
        const globalState = GM_getValue(KEY_REC_STATE);
        if (globalState === 'recording') {
            if (!confirm("⚠️ 确定要结束录制并保存吗？")) return;
            if (isRecordingLocal) stopRecording(false);
            else { GM_setValue(KEY_REC_CMD, 'stop_' + Date.now()); document.getElementById('gh-rec-status').textContent = '📡 已发送停止指令...'; }
        } else { startRecording(); }
    }

    async function startRecording() {
        const status = document.getElementById('gh-rec-status');
        const quality = document.getElementById('gh-rec-quality').value;
        let bitrate = quality === 'low' ? 1000000 : (quality === 'high' ? 5000000 : 2500000);
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true });
            const mime = 'video/webm;codecs=vp9';
            mediaRecorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported(mime) ? mime : 'video/webm', videoBitsPerSecond: bitrate });
            recordedChunks = [];
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
            mediaRecorder.onstop = saveVideo;
            stream.getVideoTracks()[0].onended = () => { if (isRecordingLocal) stopRecording(false); };
            mediaRecorder.start();
            isRecordingLocal = true;
            GM_setValue(KEY_REC_STATE, 'recording');
            document.getElementById('gemini-helper-menu').style.display = 'none';
            snapToEdge(document.getElementById('gemini-helper-ball'));
        } catch (err) { console.error(err); status.textContent = '❌ ' + err.message; }
    }

    function stopRecording(isRemote) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') { mediaRecorder.stop(); mediaRecorder.stream.getTracks().forEach(track => track.stop()); }
        isRecordingLocal = false; GM_setValue(KEY_REC_STATE, 'idle');
        document.getElementById('gh-mouse-halo').style.display = 'none';
        if(isRemote) alert('✅ 已停止录制，正在保存...');
    }

    function updateRecButtonUI(isRec) {
        const btn = document.getElementById('gh-btn-rec');
        const status = document.getElementById('gh-rec-status');
        if (!btn) return;
        if (isRec) {
            btn.textContent = isRecordingLocal ? '⏹️ 停止录制' : '⏹️ 停止 (其他页面)';
            btn.className = isRecordingLocal ? 'gh-btn primary' : 'gh-btn remote-stop';
            status.textContent = isRecordingLocal ? '🔴 录制中...' : '📡 远程录制中...';
        } else {
            btn.textContent = '⏺️ 开始录制屏幕'; btn.className = 'gh-btn record'; status.textContent = '';
        }
    }

    function saveVideo() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const fmt = document.getElementById('gh-rec-format').value;
        const a = document.createElement('a'); a.href = url; a.download = `录屏_${Date.now()}.${fmt}`;
        document.body.appendChild(a); a.click();
        setTimeout(() => { window.URL.revokeObjectURL(url); document.getElementById('gh-rec-status').textContent = '📁 文件已下载'; }, 1000);
    }

    function enableMouseViz(enabled) {
        const halo = document.getElementById('gh-mouse-halo');
        document.onmousemove = (e) => {
            if (GM_getValue(KEY_REC_STATE) === 'recording' && document.getElementById('gh-cb-trail')?.checked) { 
                halo.style.display = 'block'; halo.style.left = e.clientX + 'px'; halo.style.top = e.clientY + 'px'; 
            } else halo.style.display = 'none';
        };
        document.onmousedown = (e) => {
            if (GM_getValue(KEY_REC_STATE) === 'recording' && document.getElementById('gh-cb-trail')?.checked && !isDragging) {
                const ripple = createEl('div', { className: 'gh-click-ripple' });
                ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
                document.body.appendChild(ripple); setTimeout(() => ripple.remove(), 600);
            }
        };
    }

    function doScanVideo() {
        const list = document.getElementById('gh-vid-list'); list.innerHTML = '';
        const vids = document.querySelectorAll('video');
        let count = 0;
        vids.forEach((v, i) => {
            let src = v.currentSrc || v.src || (v.querySelector('source') ? v.querySelector('source').src : '');
            if(src) {
                count++;
                if(count===1) GM_setClipboard(src);
                const row = createEl('div', { style: 'display:flex; align-items:center; border-bottom:1px solid #eee; padding:4px;' });
                const info = createEl('div', { textContent: `[${count}] ${src.substring(0,25)}...`, title: src, style: 'cursor:pointer; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:5px;' });
                info.onclick = () => { GM_setClipboard(src); alert('📋 复制成功'); };
                const btnDown = createEl('button', { textContent: '⬇️', style: 'padding:2px 6px; cursor:pointer;' });
                btnDown.onclick = () => GM_download({ url: src, name: `video_${Date.now()}.mp4`, saveAs: true, onerror: () => window.open(src, '_blank') });
                row.append(info, btnDown); list.appendChild(row);
            }
        });
        if(count===0) list.textContent = '未发现'; else list.prepend(createEl('div', { textContent: `✅ 发现${count}个`, style:'color:green;font-weight:bold' }));
    }

    function createHideModal() {
        const modal = createEl('div', { id: 'gh-hide-modal', style: 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2147483648; justify-content:center; align-items:center;' });
        const box = createEl('div', { className: 'gh-modal-box', style: 'background:white; padding:20px; border-radius:8px; width:300px; text-align:center; display:flex; flex-direction:column; gap:10px;' });
        box.innerHTML = '<h3>🙈 隐藏设置</h3><p style="color:#666;font-size:12px;">隐藏后可在篡改猴菜单恢复</p>';
        const btn1 = createEl('button', { className: 'gh-btn', textContent: '本次隐藏', onclick: () => doHide(0, true) });
        const btn2 = createEl('button', { className: 'gh-btn', textContent: '隐藏 24 小时', onclick: () => doHide(86400000) });
        const btn3 = createEl('button', { className: 'gh-btn danger', textContent: '永久隐藏', onclick: () => doHide(-1) });
        const btnCancel = createEl('button', { className: 'gh-btn', textContent: '取消', onclick: () => modal.style.display = 'none' });
        box.append(btn1, btn2, btn3, btnCancel); modal.appendChild(box); document.body.appendChild(modal);
    }
    function showHideModal() { document.getElementById('gemini-helper-menu').style.display = 'none'; document.getElementById('gh-hide-modal').style.display = 'flex'; }
    function doHide(dur, isSess) { document.getElementById('gh-hide-modal').style.display = 'none'; document.getElementById('gemini-helper-ball').style.display = 'none'; if(!isSess) GM_setValue(KEY_HIDE_UNTIL, dur === -1 ? -1 : Date.now() + dur); }
    
    async function doCapture() {
        const wantFull = confirm("📸 截图模式选择：\n\n【确定】截取 整个网页内容 (长图)\n【取消】仅截取 当前屏幕可视区域");
        const delay = parseInt(document.getElementById('gh-shot-delay').value);
        const fmt = document.getElementById('gh-shot-fmt').value;
        const btn = document.querySelector('#panel-0 .gh-btn');
        btn.textContent = '⏳ 处理中...';
        document.getElementById('gemini-helper-menu').style.display = 'none'; document.getElementById('gh-mouse-halo').style.display = 'none';
        
        const ball = document.getElementById('gemini-helper-ball');
        ball.style.display = 'none';

        if(delay > 0) await new Promise(r => setTimeout(r, delay));
        let wm = null;
        if(document.getElementById('gh-shot-time').checked) { wm = createEl('div', { textContent: `📅 ${new Date().toLocaleString()} @ ${window.location.host}`, style: 'position:fixed;top:10px;left:10px;color:red;font-weight:bold;z-index:9999999;text-shadow:1px 1px white;' }); document.body.appendChild(wm); }

        try {
            await new Promise(r=>setTimeout(r,300));
            const options = { filter: n => n.id !== 'gemini-helper-ball' && n.id !== 'gemini-helper-menu' && n.id !== 'gh-mouse-halo' };
            if (!wantFull) { options.width = window.innerWidth; options.height = window.innerHeight; options.style = { transform: `translate(-${window.scrollX}px, -${window.scrollY}px)`, transformOrigin: 'top left', width: `${document.documentElement.scrollWidth}px`, height: `${document.documentElement.scrollHeight}px` }; }
            const dataUrl = fmt === 'jpeg' ? await domtoimage.toJpeg(document.body, { ...options, quality: 0.9 }) : await domtoimage.toPng(document.body, options);
            const a = createEl('a', { href: dataUrl, download: `截图_${Date.now()}.${fmt}` }); a.click();
        } catch(e) { console.error(e); alert('截图失败: ' + e.message); }
        finally { 
            ball.style.display = 'flex'; 
            snapToEdge(ball); 
            if(wm) wm.remove(); btn.textContent = '📸 截取网页'; 
        }
    }

    setTimeout(init, 800);
})();