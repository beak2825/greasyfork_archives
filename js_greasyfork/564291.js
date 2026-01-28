// ==UserScript==
// @name         网页视频/音频控制器 - 倍速 + 音量增益
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  控制页面上所有 video 和 audio 的播放倍速与音量（支持 >100% 增益），带浮动小面板
// @author       kusaki
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M975.698113%20137.602415V748.872453a84.335094%2084.335094%200%200%201-84.335094%2084.354415H132.636981A84.335094%2084.335094%200%200%201%2048.301887%20748.872453V137.602415a84.335094%2084.335094%200%200%201%2084.335094-84.354415h758.726038A84.335094%2084.335094%200%200%201%20975.698113%20137.602415z%22%20fill%3D%22%23D0D0F7%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M975.698113%20137.679698v611.115472c0%2046.756226-37.675472%2084.431698-84.431698%2084.431698h-38.834717c46.756226%200%2084.431698-37.675472%2084.431698-84.431698V137.679698c0-46.563019-37.675472-84.431698-84.431698-84.431698h38.834717c46.756226%200%2084.431698%2037.868679%2084.431698%2084.431698z%22%20fill%3D%22%23C2C2EF%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M854.943396%20611.038189H169.056604a43.471698%2043.471698%200%200%201-43.471698-43.471698V174.002717a43.471698%2043.471698%200%200%201%2043.471698-43.471698h685.886792a43.471698%2043.471698%200%200%201%2043.471698%2043.471698v393.563774a43.471698%2043.471698%200%200%201-43.471698%2043.471698z%22%20fill%3D%22%23FFFFFF%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M898.415094%20457.824604v109.741887c0%2023.957736-19.513962%2043.471698-43.471698%2043.471698H169.056604c-23.957736%200-43.471698-19.513962-43.471698-43.471698v-39.800755c114.18566%2053.325283%20296.573585%2066.849811%20492.679245%2027.049056%20105.298113-21.446038%20201.129057-55.450566%20280.150943-96.990188z%22%20fill%3D%22%23E4E3FF%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M48.301887%20676.033208v72.839245a84.335094%2084.335094%200%200%200%2084.335094%2084.354415h758.726038A84.335094%2084.335094%200%200%200%20975.698113%20748.872453v-72.839245z%22%20fill%3D%22%237979F7%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M975.698113%20676.149132v72.646038c0%2046.756226-37.675472%2084.431698-84.431698%2084.431698H132.733585c-33.424906%200-62.406038-19.320755-75.930566-47.529057%2011.206038%205.409811%2023.571321%208.501132%2036.902641%208.501132h758.532831c46.756226%200%2084.431698-37.675472%2084.431698-84.431698v-33.618113h39.027924z%22%20fill%3D%22%235E5EEF%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M373.470189%20833.226868h277.078943v63.024302H373.470189z%22%20fill%3D%22%23A2A2F9%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M650.529811%20833.226868v62.98566h-20.48v-22.489358c0-14.58717-11.824302-26.392151-26.392151-26.392151H373.470189v-14.104151z%22%20fill%3D%22%237979F7%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M748.737208%20959.719849v-23.80317c0-21.909736-17.775094-39.68483-39.684831-39.68483H314.947623c-21.909736%200-39.68483%2017.775094-39.684831%2039.68483v23.80317c0%206.105358%204.946113%2011.032151%2011.012831%2011.032151h451.429434a11.032151%2011.032151%200%200%200%2011.032151-11.01283z%22%20fill%3D%22%23A2A2F9%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M275.262792%20949.634415v10.085434c0%206.105358%204.946113%2011.032151%2011.012831%2011.032151h451.429434a11.032151%2011.032151%200%200%200%2011.032151-11.01283v-10.104755z%22%20fill%3D%22%237979F7%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M651.882264%20370.881208a139.882264%20139.882264%200%201%201-279.80317%200c0-77.283019%2062.637887-140.114113%20139.920906-140.114114s139.882264%2062.850415%20139.882264%20140.114114z%22%20fill%3D%22%23FC6559%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M408.981736%20372.195019a10.626415%2010.626415%200%200%201-10.626415-11.592453%20113.760604%20113.760604%200%200%201%20105.607245-103.771774c5.293887-0.676226%2010.954868%203.960755%2011.360604%209.872906a10.665057%2010.665057%200%200%201-9.853585%2011.379925%2092.546415%2092.546415%200%200%200-85.900076%2084.431698%2010.626415%2010.626415%200%200%201-10.587773%209.679698z%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%22.3%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M651.920906%20370.861887a139.843623%20139.843623%200%200%201-139.920906%20139.940226%20139.379925%20139.379925%200%200%201-115.441509-60.841056%20138.954868%20138.954868%200%200%200%2093.512452%2035.801358A139.959547%20139.959547%200%200%200%20630.049811%20345.841509c0-29.367547-9.042113-56.493887-24.691924-79.099169a138.954868%20138.954868%200%200%201%2046.582339%20104.138868z%22%20fill%3D%22%23F05543%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M572.280755%20384.463698l-68.395472%2049.248604a16.944302%2016.944302%200%200%201-26.855849-13.756377v-98.342642a16.944302%2016.944302%200%200%201%2026.836528-13.756377l68.395472%2049.094037a16.944302%2016.944302%200%200%201%200.019321%2027.512755z%22%20fill%3D%22%23FFFFFF%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M512%20754.630038m-33.579472%200a33.579472%2033.579472%200%201%200%2067.158944%200%2033.579472%2033.579472%200%201%200-67.158944%200Z%22%20fill%3D%22%23474646%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M441.228075%20109.181585h-168.747471a14.490566%2014.490566%200%200%201%200-28.981132h168.747471a14.490566%2014.490566%200%200%201%200%2028.981132zM217.416453%20109.181585h-9.119396a14.490566%2014.490566%200%200%201%200-28.981132h9.119396a14.490566%2014.490566%200%200%201%200%2028.981132zM74.752%20578.270189v-168.766793a14.490566%2014.490566%200%200%201%2028.981132%200v168.766793a14.490566%2014.490566%200%200%201-28.981132%200zM74.752%20354.458566v-9.138717a14.490566%2014.490566%200%200%201%2028.981132%200v9.138717a14.490566%2014.490566%200%200%201-28.981132%200z%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%22.6%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E
// @downloadURL https://update.greasyfork.org/scripts/564291/%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E6%8E%A7%E5%88%B6%E5%99%A8%20-%20%E5%80%8D%E9%80%9F%20%2B%20%E9%9F%B3%E9%87%8F%E5%A2%9E%E7%9B%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/564291/%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E6%8E%A7%E5%88%B6%E5%99%A8%20-%20%E5%80%8D%E9%80%9F%20%2B%20%E9%9F%B3%E9%87%8F%E5%A2%9E%E7%9B%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 防止重复注入
    if (window.__VideoAudioControllerInjected) return;
    window.__VideoAudioControllerInjected = true;

    // ==================== 核心控制器逻辑 ====================
    const mediaElements = () => document.querySelectorAll('video, audio');

    const gainNodes = new WeakMap();
    const contexts = new WeakMap();

    function getOrCreateGain(media) {
        if (gainNodes.has(media)) return gainNodes.get(media);

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return null;

            const ctx = new AudioContext();
            const source = ctx.createMediaElementSource(media);
            const gainNode = ctx.createGain();

            source.connect(gainNode);
            gainNode.connect(ctx.destination);

            contexts.set(media, ctx);
            gainNodes.set(media, gainNode);

            // 保持原生 volume 为 1，避免双重衰减
            media.volume = 1;
            return gainNode;
        } catch (err) {
            console.warn('Web Audio API 创建失败:', err);
            return null;
        }
    }

    const controller = {
        setPlaybackRate(rate) {
            if (isNaN(rate) || rate <= 0) return 0;
            const elems = mediaElements();
            elems.forEach(el => { el.playbackRate = rate; });
            return elems.length;
        },

        setVolume(vol) {
            if (isNaN(vol) || vol < 0) return 0;
            const elems = mediaElements();
            let affected = 0;

            elems.forEach(el => {
                if (vol <= 1) {
                    el.volume = vol;
                    const gain = gainNodes.get(el);
                    if (gain) gain.gain.value = 1;
                } else {
                    el.volume = 1;
                    const gain = getOrCreateGain(el);
                    if (gain) {
                        gain.gain.value = vol;
                        affected++;
                    }
                }
            });

            return elems.length;
        },

        getStatus() {
            const elems = mediaElements();
            if (elems.length === 0) return null;

            let target = Array.from(elems).find(el => !el.muted && !el.paused && el.currentTime > 0);
            if (!target) target = elems[0];

            const gainVal = gainNodes.get(target)?.gain.value ?? 1;
            const effectiveVol = target.volume * gainVal;

            return {
                count: elems.length,
                playbackRate: target.playbackRate,
                volume: Math.round(effectiveVol * 100) / 100,
                rawVolume: target.volume,
                gain: Math.round(gainVal * 100) / 100,
                muted: target.muted,
                paused: target.paused,
                isAudio: target.tagName === 'AUDIO'
            };
        }
    };

    // ==================== 浮动控制面板 UI ====================
    let panel = null;
    let isPanelVisible = false;

    function createPanel() {
        if (panel) return;

        panel = document.createElement('div');
        panel.id = 'video-audio-controller-panel';
        panel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 999999;
            background: rgba(30,30,30,0.9); color: #eee; padding: 12px 16px;
            border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            font-family: system-ui, sans-serif; font-size: 13px; min-width: 220px;
            user-select: none; pointer-events: auto; display: none;
            backdrop-filter: blur(6px); border: 1px solid #444;
        `;

        panel.innerHTML = `
            <div style="margin-bottom:8px; font-weight:bold; text-align:center;">视频/音频控制器</div>

            <div style="margin:8px 0;">
                <label>倍速: <span id="speedVal">1.00×</span></label><br>
                <input type="range" id="speedSlider" min="0.25" max="4" step="0.05" value="1" style="width:100%;">
            </div>

            <div style="margin:12px 0 8px;">
                <label>音量: <span id="volVal">100%</span></label><br>
                <input type="range" id="volSlider" min="0" max="3" step="0.05" value="1" style="width:100%;">
            </div>

            <div id="status" style="font-size:11px; color:#aaa; text-align:center; margin-top:8px;">
                加载中...
            </div>

            <div style="text-align:center; margin-top:10px;">
                <button id="closePanel" style="padding:4px 12px; background:#555; border:none; color:#fff; border-radius:4px; cursor:pointer;">
                    关闭
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // 事件绑定
        const speedSlider = panel.querySelector('#speedSlider');
        const speedVal = panel.querySelector('#speedVal');
        const volSlider = panel.querySelector('#volSlider');
        const volVal = panel.querySelector('#volVal');
        const status = panel.querySelector('#status');

        speedSlider.addEventListener('input', () => {
            const v = Number(speedSlider.value);
            controller.setPlaybackRate(v);
            speedVal.textContent = v.toFixed(2) + '×';
            updateStatus();
        });

        volSlider.addEventListener('input', () => {
            const v = Number(volSlider.value);
            controller.setVolume(v);
            let txt = Math.round(v * 100) + '%';
            if (v > 1) txt += ` (+${(v-1).toFixed(1)}×增益)`;
            volVal.textContent = txt;
            updateStatus();
        });

        panel.querySelector('#closePanel').addEventListener('click', hidePanel);

        function updateStatus() {
            const st = controller.getStatus();
            if (!st) {
                status.textContent = '未检测到媒体元素';
                return;
            }
            status.innerHTML = `找到 ${st.count} 个媒体<br>
                ${st.paused ? '暂停' : '播放'}　${st.muted ? '静音' : ''}<br>
                有效音量: ${st.volume.toFixed(2)}`;
        }

        // 初始更新
        setTimeout(updateStatus, 500);
    }

    function showPanel() {
        if (!panel) createPanel();
        panel.style.display = 'block';
        isPanelVisible = true;
    }

    function hidePanel() {
        if (panel) panel.style.display = 'none';
        isPanelVisible = false;
    }

    // ==================== 触发方式 ====================

    // 方式1：页面有 video/audio 时自动显示（可注释掉）
    const observer = new MutationObserver(() => {
        if (mediaElements().length > 0 && !isPanelVisible) {
            showPanel();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 方式2：快捷键 Ctrl + Shift + V 显示/隐藏面板（可自定义）
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();
            if (isPanelVisible) hidePanel();
            else showPanel();
        }
    });

    // 初始检查
    if (mediaElements().length > 0) {
        setTimeout(showPanel, 1500); // 延迟一点，避免页面还没加载完
    }

    console.log('网页视频/音频控制器已加载。快捷键：Ctrl + Shift + V');
})();