// ==UserScript==
// @name         i博思外挂
// @namespace    http://tampermonkey.net/
// @version      202601041256
// @description  try to take over the world!
// @author       Sudoria
// @match        http://aiit.iflysse.com/web/student/bosi-course/learn*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iflysse.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561323/i%E5%8D%9A%E6%80%9D%E5%A4%96%E6%8C%82.user.js
// @updateURL https://update.greasyfork.org/scripts/561323/i%E5%8D%9A%E6%80%9D%E5%A4%96%E6%8C%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        targetFileName: 'chunk-2ba954fe.5a891c2a.js',
        targetFileUrl: 'http://aiit.iflysse.com/web/js/chunk-2ba954fe.5a891c2a.js',
        replacements: [
            {
                searchText: '},[e._v(e._s(e.prevBtnTxt))]),e.nextBtnShow?t("el-button",{',
                replaceText: '},[e._v(e._s(e.prevBtnTxt))]),!0?t("el-button",{',
            },
            {
                // 删除倒计时逻辑，直接显示按钮并完成任务（必须在 nextBtnShow:!1 替换之前执行）
                searchText: '0!=this.pageType&&5!=this.pageType||this.workInfo.IsOver||(this.nextLoop=setInterval((function(){var e=100/c.workInfo.SpanTime;c.nextProgress+=e,c.nextProgress>=100&&(c.nextBtnShow=!0,c.overThisWork(t),clearInterval(c.nextLoop))}),1e3))',
                replaceText: '0 != this.pageType && 5 != this.pageType || this.workInfo.IsOver || (c.nextBtnShow = !0, c.overThisWork(t))',
            },
            {
                // 初始化时直接显示下一步按钮
                searchText: 'nextBtnShow:!1',
                replaceText: 'nextBtnShow:!0',
            },
        ],
    };

    let replaced = false;

    console.log('[i博思外挂] 脚本启动 (document-start)');

    // 方法：拦截 document.createElement，阻止目标 script 加载
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function(tagName, options) {
        const element = originalCreateElement(tagName, options);

        if (tagName.toLowerCase() === 'script') {
            // 拦截 src 属性的设置
            const originalSetAttribute = element.setAttribute.bind(element);
            element.setAttribute = function(name, value) {
                if (name === 'src' && value.includes(CONFIG.targetFileName)) {
                    console.log('[i博思外挂] 拦截到目标script标签设置src:', value);
                    handleScriptIntercept(element, value);
                    return; // 阻止设置 src
                }
                return originalSetAttribute(name, value);
            };

            // 同时拦截直接设置 src 属性
            Object.defineProperty(element, 'src', {
                get: function() {
                    return element.getAttribute('src') || '';
                },
                set: function(value) {
                    if (value.includes(CONFIG.targetFileName)) {
                        console.log('[i博思外挂] 拦截到目标script.src设置:', value);
                        handleScriptIntercept(element, value);
                        return;
                    }
                    originalSetAttribute('src', value);
                },
                configurable: true
            });
        }

        return element;
    };

    // 处理被拦截的脚本
    function handleScriptIntercept(scriptElement, originalSrc) {
        if (replaced) {
            console.log('[i博思外挂] 已替换过，跳过');
            return;
        }

        console.log('[i博思外挂] 开始下载并修改脚本...');

        // 使用 XMLHttpRequest 同步请求获取脚本内容
        const xhr = new XMLHttpRequest();
        xhr.open('GET', originalSrc, false); // 同步请求
        try {
            xhr.send();
            if (xhr.status === 200) {
                let code = xhr.responseText;
                console.log('[i博思外挂] 获取到脚本，长度:', code.length);

                let anyReplaced = false;
                for (const rule of CONFIG.replacements) {
                    if (code.includes(rule.searchText)) {
                        code = code.replace(rule.searchText, rule.replaceText);
                        console.log('[i博思外挂] ✅ 替换成功:', rule.searchText.substring(0, 30) + '...');
                        anyReplaced = true;
                    }
                }

                if (anyReplaced) {
                    replaced = true;
                    // 直接执行修改后的代码
                    const newScript = originalCreateElement('script');
                    newScript.textContent = code;
                    document.head.appendChild(newScript);
                    console.log('[i博思外挂] 修改后的脚本已注入');
                } else {
                    console.warn('[i博思外挂] 未找到任何目标文本，正常加载脚本');
                    scriptElement.setAttribute('src', originalSrc);
                }
            }
        } catch (e) {
            console.error('[i博思外挂] 请求失败:', e);
        }
    }

    // 备用方案：监听已存在的 script 标签（针对 HTML 中直接写的 script）
    const observer = new MutationObserver(function(mutations) {
        if (replaced) return;

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes(CONFIG.targetFileName)) {
                    console.log('[i博思外挂] MutationObserver 发现目标脚本:', node.src);

                    // 尝试阻止执行（可能来不及）
                    node.type = 'javascript/blocked';

                    // 下载并替换
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', node.src, false);
                    try {
                        xhr.send();
                        if (xhr.status === 200) {
                            let code = xhr.responseText;
                            let anyReplaced = false;
                            for (const rule of CONFIG.replacements) {
                                if (code.includes(rule.searchText)) {
                                    code = code.replace(rule.searchText, rule.replaceText);
                                    anyReplaced = true;
                                }
                            }
                            if (anyReplaced) {
                                const newScript = originalCreateElement('script');
                                newScript.textContent = code;
                                document.head.appendChild(newScript);
                                replaced = true;
                                console.log('[i博思外挂] ✅ 通过 MutationObserver 替换成功！');
                            }
                        }
                    } catch (e) {
                        console.error('[i博思外挂] MutationObserver 请求失败:', e);
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 视频进度处理 - 等待视频真正可播放后再设置进度
    const videoStates = new Map(); // video -> { processed: boolean, retries: number, listener: function }

    function completeVideo(video) {
        let state = videoStates.get(video);
        if (!state) {
            state = { processed: false, retries: 0, listener: null };
            videoStates.set(video, state);
        }

        // 已成功处理过，跳过
        if (state.processed) return;

        // 重试次数过多，放弃
        if (state.retries > 20) {
            console.log('[i博思外挂] ⚠️ 视频处理重试次数过多，放弃');
            return;
        }

        try {
            // 检查视频是否有 src
            if (!video.src && !video.querySelector('source')) {
                state.retries++;
                console.log('[i博思外挂] 视频无src，等待加载... (重试 ' + state.retries + ')');
                setTimeout(() => completeVideo(video), 500);
                return;
            }

            // readyState:
            // 0 = HAVE_NOTHING
            // 1 = HAVE_METADATA
            // 2 = HAVE_CURRENT_DATA
            // 3 = HAVE_FUTURE_DATA
            // 4 = HAVE_ENOUGH_DATA (可以播放)

            // 等待视频可以播放 (readyState >= 3)
            if (video.readyState < 3) {
                state.retries++;
                const readyStateNames = ['NOTHING', 'METADATA', 'CURRENT_DATA', 'FUTURE_DATA', 'ENOUGH_DATA'];
                console.log('[i博思外挂] 视频未就绪 (' + readyStateNames[video.readyState] + ')，等待... (重试 ' + state.retries + ')');
                
                // 监听 canplay 事件（视频可以开始播放时触发）
                if (!state.listener) {
                    state.listener = () => {
                        console.log('[i博思外挂] 收到 canplay 事件');
                        setTimeout(() => completeVideo(video), 100);
                    };
                    video.addEventListener('canplay', state.listener, { once: true });
                    video.addEventListener('canplaythrough', state.listener, { once: true });
                }
                
                // 同时设置超时重试
                setTimeout(() => completeVideo(video), 1000);
                return;
            }

            const duration = video.duration;
            if (!duration || !isFinite(duration) || duration <= 0) {
                state.retries++;
                console.log('[i博思外挂] 视频时长无效 (' + duration + ')，稍后重试... (重试 ' + state.retries + ')');
                setTimeout(() => completeVideo(video), 1000);
                return;
            }

            console.log('[i博思外挂] 视频已就绪，时长:', duration.toFixed(1), '秒');

            // 设置到接近结尾（留1秒避免某些检测）
            const targetTime = Math.max(0, duration - 1);
            video.currentTime = targetTime;
            state.processed = true;

            console.log('[i博思外挂] ✅ 视频进度已设置到:', targetTime.toFixed(1));

            // 触发相关事件，模拟正常播放完成
            video.dispatchEvent(new Event('timeupdate'));
            video.dispatchEvent(new Event('progress'));
            video.dispatchEvent(new Event('seeking'));
            video.dispatchEvent(new Event('seeked'));

            // 监听进度被重置的情况（某些播放器会重置）
            const checkReset = () => {
                if (video.currentTime < targetTime - 5) {
                    console.log('[i博思外挂] ⚠️ 检测到进度被重置，重新设置');
                    video.currentTime = targetTime;
                }
            };
            // 短时间内多次检查
            setTimeout(checkReset, 500);
            setTimeout(checkReset, 1000);
            setTimeout(checkReset, 2000);

            // 如果视频暂停了，尝试播放让它自然结束
            if (video.paused) {
                video.play().catch(() => {});
            }
        } catch (e) {
            console.error('[i博思外挂] 处理视频出错:', e);
            state.retries++;
            setTimeout(() => completeVideo(video), 1000);
        }
    }

    function scanForVideos() {
        const videos = document.querySelectorAll('video');
        let found = 0;
        videos.forEach(video => {
            const state = videoStates.get(video);
            if (!state || !state.processed) {
                found++;
                completeVideo(video);
            }
        });
        if (found > 0) {
            console.log('[i博思外挂] 扫描到 ' + found + ' 个未处理视频');
        }
    }

    // 监听 DOM 变化，检测新出现的视频
    function setupVideoObserver() {
        const videoObserver = new MutationObserver(function(mutations) {
            let hasNewVideo = false;

            for (const mutation of mutations) {
                // 检查新增节点
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    if (node.tagName === 'VIDEO') {
                        hasNewVideo = true;
                        // 立即处理新视频
                        setTimeout(() => completeVideo(node), 100);
                    } else if (node.querySelectorAll) {
                        const videos = node.querySelectorAll('video');
                        if (videos.length > 0) {
                            hasNewVideo = true;
                            videos.forEach(v => setTimeout(() => completeVideo(v), 100));
                        }
                    }
                }

                // 检查属性变化（视频 src 变化）
                if (mutation.type === 'attributes' && mutation.target.tagName === 'VIDEO') {
                    const video = mutation.target;
                    const state = videoStates.get(video);
                    // 如果 src 变了，重置状态
                    if (state) {
                        state.processed = false;
                        state.retries = 0;
                    }
                    setTimeout(() => completeVideo(video), 100);
                }
            }

            if (hasNewVideo) {
                // 延迟再扫描一次，确保不遗漏
                setTimeout(scanForVideos, 500);
                setTimeout(scanForVideos, 1500);
            }
        });

        videoObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        console.log('[i博思外挂] 视频监听器已启动');
    }

    // 监听 URL 变化（Vue Router 切换页面）
    let lastUrl = location.href;
    let initialized = false;
    
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[i博思外挂] 检测到页面切换:', location.href);
            
            // 检查是否进入目标页面
            if (location.href.includes('/web/student/bosi-course/learn')) {
                console.log('[i博思外挂] 进入目标页面，初始化功能...');
                // 页面切换后多次扫描
                setTimeout(scanForVideos, 500);
                setTimeout(scanForVideos, 1500);
                setTimeout(scanForVideos, 3000);
                
                // 确保日志面板存在
                if (!document.querySelector('.drawer-main') && !logManager.panel) {
                    setTimeout(() => {
                        if (document.body && !logManager.panel) {
                            logManager.init();
                            logManager.log('从其他页面进入，日志面板已启动');
                            setupVideoObserver();
                        }
                    }, 500);
                }
            }
        }
    }
    setInterval(checkUrlChange, 500);
    
    // 立即开始监听 URL（针对从其他页面跳转过来的情况）
    // 使用 history API 拦截
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(checkUrlChange, 100);
    };
    
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(checkUrlChange, 100);
    };
    
    window.addEventListener('popstate', () => {
        setTimeout(checkUrlChange, 100);
    });

    // 自动下一页控制器
    const autoNextPage = {
        enabled: false,
        interval: 10,
        timer: null,
        countdown: 0,
        checkbox: null, // 保存 checkbox 引用，用于自动取消勾选
        warningText: '预警提示',

        // 检测警告弹窗
        checkWarning() {
            const bodyText = document.body.innerText || '';
            return bodyText.includes(this.warningText);
        },

        click() {
            // 点击前检查是否有警告
            if (this.checkWarning()) {
                console.log('[i博思外挂] ⚠️ 检测到刷课警告，自动暂停！');
                this.stop();
                if (this.checkbox) {
                    this.checkbox.checked = false;
                }
                return false;
            }

            const btn = document.evaluate(
                '/html/body/div[1]/div[1]/section/section/footer/div[1]/button[2]/span',
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            if (btn) {
                btn.click();
                console.log('[i博思外挂] ✅ 自动点击下一页');
                return true;
            } else {
                console.log('[i博思外挂] ⚠️ 未找到下一页按钮');
                return false;
            }
        },

        start(seconds) {
            this.interval = seconds || this.interval;
            this.enabled = true;
            this.countdown = this.interval;
            this.timer = setInterval(() => {
                // 每秒检查警告
                if (this.checkWarning()) {
                    console.log('[i博思外挂] ⚠️ 检测到刷课警告，自动暂停！');
                    this.stop();
                    if (this.checkbox) {
                        this.checkbox.checked = false;
                    }
                    return;
                }

                this.countdown--;
                if (this.countdown <= 0) {
                    this.click();
                    this.countdown = this.interval;
                }
            }, 1000);
            console.log('[i博思外挂] 自动下一页已开启，间隔 ' + this.interval + ' 秒');
        },

        stop() {
            this.enabled = false;
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            console.log('[i博思外挂] 自动下一页已关闭');
        }
    };

    // 日志管理器
    const logManager = {
        logs: [],
        maxLines: 200,
        panel: null,
        logContent: null,

        init() {
            // 创建日志面板
            this.panel = document.createElement('div');
            this.panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 350px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.85);
                color: #0f0;
                border-radius: 8px;
                font-size: 11px;
                font-family: Consolas, monospace;
                z-index: 999999;
                box-shadow: 0 2px 15px rgba(0,0,0,0.4);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            `;

            // 标题栏
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 6px 10px;
                background: ${replaced ? '#28a745' : '#dc3545'};
                color: white;
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            header.innerHTML = `<span>${replaced ? '✅ JS已修改' : '❌ JS未修改'}</span><span style="font-size:10px;">点击扫描视频</span>`;
            header.onclick = () => {
                scanForVideos();
                this.log('🔄 手动扫描视频...');
            };

            // 控制栏
            const controlBar = document.createElement('div');
            controlBar.style.cssText = `
                padding: 8px 10px;
                background: rgba(255,255,255,0.1);
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            `;

            // 开关
            const toggleLabel = document.createElement('label');
            toggleLabel.style.cssText = `display: flex; align-items: center; gap: 5px; cursor: pointer; color: #fff;`;
            const toggleCheckbox = document.createElement('input');
            toggleCheckbox.type = 'checkbox';
            toggleCheckbox.style.cssText = `cursor: pointer;`;
            toggleLabel.appendChild(toggleCheckbox);
            toggleLabel.appendChild(document.createTextNode('自动下一页'));

            // 秒数输入
            const secondsInput = document.createElement('input');
            secondsInput.type = 'number';
            secondsInput.value = '10';
            secondsInput.min = '1';
            secondsInput.style.cssText = `
                width: 50px;
                padding: 2px 5px;
                border: 1px solid #666;
                border-radius: 3px;
                background: #333;
                color: #fff;
                font-size: 11px;
            `;

            const secondsLabel = document.createElement('span');
            secondsLabel.textContent = '秒';
            secondsLabel.style.color = '#fff';

            // 倒计时显示
            const countdownSpan = document.createElement('span');
            countdownSpan.style.cssText = `color: #0ff; margin-left: auto;`;
            countdownSpan.textContent = '';

            // 更新倒计时显示
            setInterval(() => {
                if (autoNextPage.enabled) {
                    countdownSpan.textContent = `${autoNextPage.countdown}s`;
                } else {
                    countdownSpan.textContent = '';
                }
            }, 500);

            toggleCheckbox.onchange = () => {
                if (toggleCheckbox.checked) {
                    const secs = parseInt(secondsInput.value) || 10;
                    autoNextPage.start(secs);
                } else {
                    autoNextPage.stop();
                }
            };

            // 保存 checkbox 引用
            autoNextPage.checkbox = toggleCheckbox;

            controlBar.appendChild(toggleLabel);
            controlBar.appendChild(secondsInput);
            controlBar.appendChild(secondsLabel);
            controlBar.appendChild(countdownSpan);

            // 日志内容区
            this.logContent = document.createElement('div');
            this.logContent.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 8px;
                max-height: 250px;
            `;

            this.panel.appendChild(header);
            this.panel.appendChild(controlBar);
            this.panel.appendChild(this.logContent);
            document.body.appendChild(this.panel);

            // 拦截 console.log
            this.interceptConsole();
        },

        log(msg, type = 'info') {
            const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            const colors = { info: '#0f0', warn: '#ff0', error: '#f55' };
            
            this.logs.push({ time, msg, type });
            
            // 超过200行清空
            if (this.logs.length > this.maxLines) {
                this.logs = [];
                this.logContent.innerHTML = '';
                this.log('📋 日志已清空 (超过200行)');
                return;
            }

            const line = document.createElement('div');
            line.style.cssText = `
                margin-bottom: 3px;
                word-break: break-all;
                color: ${colors[type] || colors.info};
            `;
            line.textContent = `[${time}] ${msg}`;
            this.logContent.appendChild(line);
            
            // 自动滚动到底部
            this.logContent.scrollTop = this.logContent.scrollHeight;
        },

        interceptConsole() {
            const self = this;
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;

            console.log = function(...args) {
                originalLog.apply(console, args);
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                if (msg.includes('[i博思外挂]')) {
                    self.log(msg.replace('[i博思外挂] ', ''), 'info');
                }
            };

            console.warn = function(...args) {
                originalWarn.apply(console, args);
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                if (msg.includes('[i博思外挂]')) {
                    self.log(msg.replace('[i博思外挂] ', ''), 'warn');
                }
            };

            console.error = function(...args) {
                originalError.apply(console, args);
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                if (msg.includes('[i博思外挂]')) {
                    self.log(msg.replace('[i博思外挂] ', ''), 'error');
                }
            };
        }
    };

    // ==================== 防闲置检测模块 ====================
    // 通过模拟用户活动来绕过网页的闲置检测机制
    const antiIdleModule = {
        timer: null,
        interval: 30000, // 每30秒模拟一次活动

        // 模拟鼠标移动事件
        simulateMouseMove() {
            const event = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            });
            document.dispatchEvent(event);
        },

        // 模拟键盘事件
        simulateKeyPress() {
            const event = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Shift',
                keyCode: 16
            });
            document.dispatchEvent(event);
        },

        // 模拟滚动事件
        simulateScroll() {
            const event = new Event('scroll', { bubbles: true });
            document.dispatchEvent(event);
        },

        // 模拟点击事件（不触发实际点击）
        simulateActivity() {
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: 0,
                clientY: 0
            });
            document.dispatchEvent(event);
            
            const upEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                clientX: 0,
                clientY: 0
            });
            document.dispatchEvent(upEvent);
        },

        // 重写可能的闲置检测函数
        overrideIdleDetection() {
            // 拦截 visibilitychange 事件
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'visibilitychange' || type === 'blur' || type === 'pagehide') {
                    console.log('[i博思外挂] 🛡️ 拦截闲置检测事件:', type);
                    // 不注册这些事件，或者注册一个空函数
                    return originalAddEventListener.call(this, type, function(e) {
                        // 阻止原始处理
                        e.stopImmediatePropagation();
                    }, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            // 伪造 document.hidden 始终为 false
            Object.defineProperty(document, 'hidden', {
                get: function() { return false; },
                configurable: true
            });

            // 伪造 document.visibilityState 始终为 'visible'
            Object.defineProperty(document, 'visibilityState', {
                get: function() { return 'visible'; },
                configurable: true
            });

            // 拦截 requestIdleCallback（如果网站使用它来检测闲置）
            if (window.requestIdleCallback) {
                const originalRequestIdleCallback = window.requestIdleCallback;
                window.requestIdleCallback = function(callback, options) {
                    // 延迟执行或不执行闲置回调
                    return originalRequestIdleCallback.call(window, function(deadline) {
                        // 伪造 deadline，让网站认为用户一直活跃
                        const fakeDeadline = {
                            didTimeout: false,
                            timeRemaining: function() { return 50; }
                        };
                        callback(fakeDeadline);
                    }, options);
                };
            }

            // 清除可能存在的闲置检测定时器
            const originalSetTimeout = window.setTimeout;
            const originalSetInterval = window.setInterval;
            const suspiciousKeywords = ['idle', 'timeout', 'inactive', 'away', 'close'];
            
            window.setTimeout = function(callback, delay, ...args) {
                const callbackStr = callback.toString().toLowerCase();
                for (const keyword of suspiciousKeywords) {
                    if (callbackStr.includes(keyword) && delay > 60000) {
                        console.log('[i博思外挂] 🛡️ 拦截可疑定时器 (setTimeout):', keyword);
                        return originalSetTimeout.call(window, function() {}, delay);
                    }
                }
                return originalSetTimeout.call(window, callback, delay, ...args);
            };

            window.setInterval = function(callback, delay, ...args) {
                const callbackStr = callback.toString().toLowerCase();
                for (const keyword of suspiciousKeywords) {
                    if (callbackStr.includes(keyword)) {
                        console.log('[i博思外挂] 🛡️ 拦截可疑定时器 (setInterval):', keyword);
                        return originalSetInterval.call(window, function() {}, delay);
                    }
                }
                return originalSetInterval.call(window, callback, delay, ...args);
            };

            console.log('[i博思外挂] 🛡️ 闲置检测拦截已启用');
        },

        // 启动防闲置
        start() {
            this.overrideIdleDetection();
            
            // 定期模拟用户活动
            this.timer = setInterval(() => {
                this.simulateMouseMove();
                this.simulateKeyPress();
                this.simulateScroll();
                this.simulateActivity();
                console.log('[i博思外挂] 🔄 模拟用户活动');
            }, this.interval);

            console.log('[i博思外挂] 🛡️ 防闲置模块已启动');
        },

        stop() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            console.log('[i博思外挂] 防闲置模块已停止');
        }
    };

    // 立即启动防闲置模块（在 document-start 阶段）
    antiIdleModule.start();
    // ==================== 防闲置检测模块结束 ====================

    // DOM 加载完成后添加日志面板和视频监听
    document.addEventListener('DOMContentLoaded', function() {
        // 只在目标页面初始化
        if (location.href.includes('/web/student/bosi-course/learn')) {
            logManager.init();
            logManager.log('日志面板已启动');

            // 启动视频监听
            setupVideoObserver();

            // 初始扫描
            scanForVideos();

            // 定期扫描（兜底方案，防止某些动态加载漏掉）
            setInterval(scanForVideos, 3000);

            console.log('[i博思外挂] 最终状态:', replaced ? '已修改' : '未修改');
        } else {
            console.log('[i博思外挂] 非目标页面，等待跳转...');
        }
    });

})();
