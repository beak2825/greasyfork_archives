// ==UserScript==
// @name         夸克网盘视频默认最高画质
// @namespace    https://github.com/Ry-Run/quark-automatic-quality
// @version      1.13
// @description  夸克网盘 Web 播放器自动选择最高可用画质（事件驱动、无轮询）+ 手动优先（不抢回）+ 配置UI
// @match        *://pan.quark.cn/*
// @run-at       document-start
// @author       run
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562245/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562245/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const SCRIPT_NAME = "夸克网盘视频默认最高画质";
    const LS_KEY = "quark_quality_script_config_v1";

    const QUALITY_RANK = ["4K", "2160", "2K", "1440", "超清", "1080", "高清", "720", "流畅", "360"];
    const DEFAULT_CONFIG = { mode: "AUTO" };

    let config = loadConfig();

    // 状态
    let manualOverride = false;
    let currentVideoEl = null;

    // 记录“当前视频”识别信息（只用 duration 判定新视频）
    let lastDuration = null;        // number
    let lastResolution = "";        // string
    let ignoreManualUntil = 0;

    // 用户互动/脚本点击标记
    let userInteracted = false;
    let lastSwitchByScriptAt = 0;
    let hasAutoApplied = false;

    // 自动设置重试（短时间）
    const MAX_AUTO_RETRY = 6;
    const AUTO_RETRY_INTERVAL = 900;
    let autoRetryCount = 0;
    let autoRetryTimer = null;

    // 新视频初始化阶段忽略手动检测
    const IGNORE_WINDOW_MS = 1500;

    // 判定“新视频”的 duration 变化阈值（秒）
    const DURATION_DIFF_THRESHOLD = 0.8;

    function log(...args) { console.log(`[${SCRIPT_NAME}]`, ...args); }
    function warn(...args) { console.warn(`[${SCRIPT_NAME}]`, ...args); }

    function loadConfig() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return { ...DEFAULT_CONFIG };
            return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
        } catch {
            return { ...DEFAULT_CONFIG };
        }
    }

    function saveConfig() {
        localStorage.setItem(LS_KEY, JSON.stringify(config));
        log("配置已保存 ✅", config);
    }

    function getQualityBox() { return document.querySelector(".keep-quality-box"); }
    function getVideoEl() { return document.querySelector("video.vjs-tech"); }

    function applyMask() {
        const video = getVideoEl();
        if (video) video.classList.add("qq-quality-blur");
    }

    function removeMask() {
        const video = getVideoEl();
        if (video) video.classList.remove("qq-quality-blur");
    }

    function getCurrentQualityText(box) {
        const active = box.querySelector(".keep-quality-text-box.keep-quality-active");
        return active ? (active.innerText || "").trim() : "";
    }

    function getQualityItems(box) {
        return Array.from(box.querySelectorAll(".keep-quality-list-box"))
            .map(item => {
                const textBox = item.querySelector(".keep-quality-text-box");
                const text = (textBox?.innerText || "").trim();
                return { item, textBox, text };
            })
            .filter(x => x.text);
    }

    function rankOfQuality(text) {
        if (!text) return Infinity;
        for (let i = 0; i < QUALITY_RANK.length; i++) {
            if (text.includes(QUALITY_RANK[i])) return i;
        }
        const m = text.match(/(\d{3,4})p/i);
        if (m) {
            const p = m[1];
            if (p === "2160") return QUALITY_RANK.indexOf("2160");
            if (p === "1440") return QUALITY_RANK.indexOf("1440");
            if (p === "1080") return QUALITY_RANK.indexOf("1080");
            if (p === "720") return QUALITY_RANK.indexOf("720");
            if (p === "360") return QUALITY_RANK.indexOf("360");
        }
        return Infinity;
    }

    function clickLikeUser(el) {
        if (!el) return false;
        ["mouseover", "mousedown", "mouseup", "click"].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
        });
        return true;
    }

    function chooseTarget(items) {
        if (!items || items.length === 0) return null;

        if (config.mode === "AUTO") {
            return items
                .map(it => ({ ...it, rank: rankOfQuality(it.text) }))
                .sort((a, b) => a.rank - b.rank)[0];
        }

        const targetMaxRank = {
            "4K": rankOfQuality("4K"),
            "2K": rankOfQuality("2K"),
            "UQ": rankOfQuality("超清"),
            "HQ": rankOfQuality("高清"),
            "LQ": rankOfQuality("流畅"),
        }[config.mode];

        const candidates = items
            .map(it => ({ ...it, rank: rankOfQuality(it.text) }))
            .filter(it => it.rank >= targetMaxRank)
            .sort((a, b) => a.rank - b.rank);

        return candidates[0] || items
            .map(it => ({ ...it, rank: rankOfQuality(it.text) }))
            .sort((a, b) => a.rank - b.rank)[0];
    }

    function stopAutoRetry() {
        if (autoRetryTimer) clearInterval(autoRetryTimer);
        autoRetryTimer = null;
        autoRetryCount = 0;
        // 如果重试停止（无论是成功还是达到上限），都移除模糊
        setTimeout(removeMask, 300); 
    }

    function startAutoRetry(reason) {
        // ✅ manualOverride 时绝不启动
        if (manualOverride) {
            log(`[${reason}] manualOverride=true，不启动自动重试`);
            removeMask();
            return;
        }

        stopAutoRetry(); // 清理旧定时器，但这里也会触发 removeMask，所以下面要重新 applyMask? 
        // 修正：stopAutoRetry 会移除 mask，所以如果是 startAutoRetry，我们应该保持 mask 或重新加
        // 但由于 autoRetry 是异步的，我们可以在这里强制加上，避免闪烁
        applyMask();
        
        autoRetryCount = 0;

        // 立即尝试一次
        const immediateOk = tryAutoSetQuality(`${reason}/immediate`);
        if (immediateOk) {
            stopAutoRetry(); // 成功则停止
            return;
        }

        autoRetryTimer = setInterval(() => {
            autoRetryCount++;
            const ok = tryAutoSetQuality(`${reason}/retry${autoRetryCount}`);
            if (ok || autoRetryCount >= MAX_AUTO_RETRY) {
                stopAutoRetry();
                if (ok) log("自动设置完成 ✅");
                else warn("达到最大自动重试次数，停止 ❌");
            }
        }, AUTO_RETRY_INTERVAL);
    }

    /** 返回 true 表示成功设置或已是目标 */
    function tryAutoSetQuality(reason) {
        if (manualOverride) {
            log(`[${reason}] manualOverride=true，本视频不自动切换`);
            removeMask(); // 确保移除预先施加的模糊
            return true;
        }

        const box = getQualityBox();
        const video = getVideoEl();
        if (!box || !video) return false;

        const items = getQualityItems(box);
        if (items.length === 0) return false;

        const current = getCurrentQualityText(box);
        const target = chooseTarget(items);

        log(`[${reason}] 画质项=`, items.map(x => x.text), "| 当前=", current || "(未知)", "| 目标=", target?.text);

        if (!target) return false;
        
        // 如果已经是目标画质
        if (current && current === target.text) {
            hasAutoApplied = true;
            removeMask(); // 移除模糊
            
            // 兜底：如果是新视频（通过reason判断）且暂停，尝试播放
            if (reason.includes("newVideo") && video.paused) {
                 video.play().catch(() => {});
            }
            return true;
        }

        lastSwitchByScriptAt = Date.now();
        clickLikeUser(target.textBox || target.item);
        hasAutoApplied = true;
        log(`[${reason}] 点击切换 =>`, target.text);
        
        // 切换后尝试自动播放逻辑
        setTimeout(() => {
            // 移除模糊
            setTimeout(removeMask, 100);

            if (!video.autoplay) video.autoplay = true;

            if (video.paused) {
                log("切换后视频暂停，尝试启动播放...");
                video.play().then(() => {
                    log("自动播放成功 ✅");
                }).catch(err => {
                    if (err.name === 'NotAllowedError') {
                        log("有声播放被拦截，尝试：静音起播 -> 立即恢复音量");
                        
                        video.muted = true;
                        video.play().then(() => {
                            // 尝试立即恢复音量
                            video.muted = false;
                            
                            // 检查是否因为恢复音量导致视频被浏览器暂停
                            setTimeout(() => {
                                if (video.paused) {
                                    log("恢复音量失败（视频被自动暂停），回退到静音播放，等待交互...");
                                    video.muted = true;
                                    video.play(); // 保持画面动起来

                                    // 只要用户有一点点交互，就恢复声音
                                    const resumeAudio = () => {
                                        video.muted = false;
                                        log("交互检测 => 音量恢复 ✅");
                                    };
                                    ["click", "keydown", "touchstart", "wheel"].forEach(ev => 
                                        document.addEventListener(ev, resumeAudio, { once: true, capture: true })
                                    );
                                } else {
                                    log("静音起播后立即恢复音量成功 ✅");
                                }
                            }, 50);
                        }).catch(e2 => warn("静音播放亦失败", e2));
                    } else {
                        warn("自动播放出错", err);
                    }
                });
            }
        }, 250); // 给播放器一点反应时间

        return true;
    }

    /** ✅ 监听画质菜单渲染，极速响应 */
    function observeQualityMenu() {
        // 监听 body 或者播放器容器，看 .keep-quality-box 是否出现或变化
        // 由于我们不知道它具体的父容器，监听 document.body 可能开销大，但最稳
        const obs = new MutationObserver((mutations) => {
             // 简单粗暴：只要有变动，就检查一下有没有画质框
             // 优化：检查 addedNodes 是否包含 keep-quality
             for (const m of mutations) {
                 if (m.target && m.target.classList && m.target.classList.contains("keep-quality-box")) {
                     tryAutoSetQuality("menuMutation");
                     return;
                 }
                 // 也可以查 addedNodes
                 if (m.addedNodes.length > 0) {
                     const box = getQualityBox();
                     if (box && (box === m.target || box.contains(m.target))) {
                         tryAutoSetQuality("menuContentAdded");
                         return;
                     }
                 }
             }
        });
        
        // 针对 #app 或播放器容器监听可能更好，这里先监听 document.body 的子树，注意性能
        // 但 quark 网盘播放器通常在某个特定容器里。为了通用性，先监听 body
        obs.observe(document.body, { childList: true, subtree: true });
    }

    /** ✅ 只在“真正新视频”时重置 manualOverride */
    function onNewVideo(reason, duration, resolution) {
        // 新视频：重置用户状态
        manualOverride = false;
        userInteracted = false;
        hasAutoApplied = false;
        ignoreManualUntil = Date.now() + IGNORE_WINDOW_MS;

        stopAutoRetry();
        
        // 视觉优化：立即应用模糊，掩盖低画质
        applyMask();

        log("检测到新视频 ✅", reason, "duration=", duration, "resolution=", resolution, `忽略手动检测 ${IGNORE_WINDOW_MS}ms`);

        // 新视频开始后立即尝试，不再等待 500ms
        startAutoRetry("newVideo");
    }

    /** ✅ metadata 到来时判断是否新视频（只看 duration） */
    function handleMetadata(evtName) {
        const video = getVideoEl();
        if (!video) return;

        const duration = Number.isFinite(video.duration) ? video.duration : null;
        const resolution = `${video.videoWidth || 0}x${video.videoHeight || 0}`;

        if (duration == null || duration <= 0) {
            log(`[${evtName}] duration 未就绪，跳过新视频判定`);
            return;
        }

        // 第一次拿到有效 duration
        if (lastDuration == null) {
            lastDuration = duration;
            lastResolution = resolution;
            onNewVideo(`firstMetadata(${evtName})`, duration, resolution);
            return;
        }

        // duration 变化超过阈值 => 真正新视频
        const diff = Math.abs(duration - lastDuration);
        if (diff >= DURATION_DIFF_THRESHOLD) {
            log(`duration 变化 => 新视频 ✅ (${evtName})`, "old=", lastDuration.toFixed(2), "new=", duration.toFixed(2), "diff=", diff.toFixed(2));
            lastDuration = duration;
            lastResolution = resolution;
            onNewVideo(`durationChanged(${evtName})`, duration, resolution);
            return;
        }

        // 仅分辨率变化：认为是同一视频切码率，不触发新视频
        if (resolution !== lastResolution) {
            log(`分辨率变化（同视频切码率）(${evtName})`, "old=", lastResolution, "new=", resolution, "manualOverride=", manualOverride);
            lastResolution = resolution;
            // ✅ 如果用户手动了，就啥也不做
            // ✅ 如果没手动，允许继续自动重试（但不会重置 manualOverride）
            if (!manualOverride) startAutoRetry("resolutionChanged");
            return;
        }
    }

    /** ✅ 监听画质变化：仅在用户互动/脚本已应用后才会锁 manualOverride */
    function observeQualityChange() {
        const t = setInterval(() => {
            const box = getQualityBox();
            if (!box) return;

            clearInterval(t);

            const obs = new MutationObserver(() => {
                if (Date.now() < ignoreManualUntil) return;
                if (Date.now() - lastSwitchByScriptAt < 250) return;

                if (!userInteracted && !hasAutoApplied) return;

                if (!manualOverride) {
                    manualOverride = true;
                    stopAutoRetry();
                    log("检测到用户手动切换画质 ✅ manualOverride=true，停止自动重试");
                }
            });

            obs.observe(box, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
            log("已启动画质变化监听 ✅（仅 keep-quality-box）");
        }, 400);
    }

    /** 捕捉用户对画质区域的点击 */
    function bindUserInteraction() {
        document.addEventListener("click", (e) => {
            const box = getQualityBox();
            if (!box) return;
            if (!e.target || !box.contains(e.target)) return;

            if (Date.now() - lastSwitchByScriptAt < 250) return;
            userInteracted = true;
            log("检测到用户点击画质区域 ✅ userInteracted=true");
        }, true);
    }

    /** UI */
    function createUI() {
        const style = document.createElement("style");
        style.textContent = `
      #qq-quality-btn{ position: fixed; right: 18px; bottom: 18px; z-index: 999999;
        width: 42px; height: 42px; border-radius: 10px; background: rgba(0,0,0,.6); color: #fff;
        display:flex; align-items:center; justify-content:center; font-size:18px; cursor:pointer; user-select:none;}
      #qq-quality-panel{ position: fixed; right: 18px; bottom: 68px; z-index: 999999;
        width: 220px; padding: 12px 12px 10px; background: rgba(0,0,0,.78); color:#fff;
        border-radius: 12px; font-size: 13px; display:none;}
      #qq-quality-panel label{display:block;margin:6px 0 4px;}
      #qq-quality-panel select{width:100%; padding:4px; border-radius:8px;}
      #qq-quality-panel input{transform: translateY(1px);}
      #qq-quality-panel .row{margin-top:10px; display:flex; gap:8px;}
      #qq-quality-panel button{ flex:1; padding:6px 8px; border:0; border-radius:10px; cursor:pointer; }
      #qq-quality-panel select{
       width:100%;
       padding:7px 12px;
       border-radius:12px;
       border:1px solid rgba(255,255,255,.35);
       background:#1677ff;
       color:#fff;
       outline:none;
       cursor:pointer;
       transition: all .15s ease;
       appearance:none;                 /* 去掉原生箭头（部分浏览器） */
       -webkit-appearance:none;
      }

      #qq-quality-panel select:hover{
        filter: brightness(1.05);
      }

      #qq-quality-panel select:focus{
       box-shadow: 0 0 0 3px rgba(22,119,255,.45);
       border-color: rgba(255,255,255,.55);
      }

      #qq-quality-panel option{
       background:#1677ff;
       color:#fff;
      }

      /* 视觉优化：切换期间的模糊遮罩 */
      video.qq-quality-blur {
        filter: blur(25px) !important;
        transition: filter 0.4s ease !important;
      }
    `;
        document.documentElement.appendChild(style);

        const btn = document.createElement("div");
        btn.id = "qq-quality-btn";
        btn.textContent = "⚙️";
        document.documentElement.appendChild(btn);

        const panel = document.createElement("div");
        panel.id = "qq-quality-panel";
        panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:8px;">画质设置</div>
      <label>默认策略</label>
      <select id="qq-quality-mode">
        <option value="AUTO">自动最高（推荐）</option>
        <option value="4K">尽量 4K</option>
        <option value="2K">尽量 2K</option>
        <option value="UQ">超清</option>
        <option value="HQ">高清</option>
        <option value="LQ">流畅</option>
      </select>

      <div class="row">
        <button id="qq-quality-save">保存</button>
        <button id="qq-quality-reset">恢复自动</button>
      </div>
      <div style="opacity:.8;margin-top:8px;font-size:12px;">
        你手动切画质后，本视频不再自动拉回（不会把切码率当新视频）。
      </div>
    `;
        document.documentElement.appendChild(panel);

        btn.addEventListener("click", () => {
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        });

        const modeSel = panel.querySelector("#qq-quality-mode");
        modeSel.value = config.mode;

        panel.querySelector("#qq-quality-save").addEventListener("click", () => {
            config.mode = modeSel.value;
            saveConfig();
            panel.style.display = "none";
            startAutoRetry("uiSave");
        });

        panel.querySelector("#qq-quality-reset").addEventListener("click", () => {
            manualOverride = false;
            userInteracted = false;
            log("已恢复自动 ✅ manualOverride=false");
            panel.style.display = "none";
            startAutoRetry("uiReset");
        });
    }

    function start() {
        log("脚本启动 ✅");
        bindUserInteraction();
        observeQualityChange();
        observeQualityMenu(); // 新增：监听菜单渲染

        window.addEventListener("DOMContentLoaded", () => createUI());

        // 监听 video 出现/替换
        const mo = new MutationObserver(() => {
            const video = getVideoEl();
            if (!video) return;

            if (video !== currentVideoEl) {
                currentVideoEl = video;
                log("检测到 video 元素替换/出现 ✅");
                
                // 视觉优化：Video 出现即模糊，掩盖默认画质
                applyMask();

                // 只用 metadata/canplay/playing 判断（不监听 emptied）
                ["loadedmetadata", "canplay", "playing"].forEach(evt => {
                    video.addEventListener(evt, () => handleMetadata(evt), true);
                });

                // 首次也触发一次
                setTimeout(() => handleMetadata("initial"), 1200);
            }
        });

        mo.observe(document.documentElement, { childList: true, subtree: true });
        log("已启动 DOM 监听（等待 video 出现）✅");
    }

    start();

})();
