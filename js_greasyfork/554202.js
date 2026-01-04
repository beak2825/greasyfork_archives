// ==UserScript==
// @name   🌱 中国证券投资基金业协会视频辅助（破解自动暂停版）
// @namespace    http://jb.zhanyc.cn/
// @icon    https://js.zhanyc.cn/img/js-logo.svg
// @version      1.5（破解自动暂停）
// @description  破解视频点击其他区域自动暂停，支持：课程列表跳转、视频自动播放、静音、防挂机检测
// @author       DonRat（破解适配）
// @include    *://*.amac.org.cn/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_addValueChangeListener
// @run-at      document-start
// @require https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @require https://greasyfork.org/scripts/434540-layerjs-gm-with-css/code/layerjs-gm-with-css.js?version=1065982
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/554202/%F0%9F%8C%B1%20%E4%B8%AD%E5%9B%BD%E8%AF%81%E5%88%B8%E6%8A%95%E8%B5%84%E5%9F%BA%E9%87%91%E4%B8%9A%E5%8D%8F%E4%BC%9A%E8%A7%86%E9%A2%91%E8%BE%85%E5%8A%A9%EF%BC%88%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554202/%F0%9F%8C%B1%20%E4%B8%AD%E5%9B%BD%E8%AF%81%E5%88%B8%E6%8A%95%E8%B5%84%E5%9F%BA%E9%87%91%E4%B8%9A%E5%8D%8F%E4%BC%9A%E8%A7%86%E9%A2%91%E8%BE%85%E5%8A%A9%EF%BC%88%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    let $jq = $;
    unsafeWindow.$jq = $;
    unsafeWindow.layer = layer;
    let baseConfig = {}

    let plugMain = Object.assign(baseConfig, {
        config: { maxComment: 100 },
        pageData: {
            videoTimer: null,       // 视频检测定时器
            interactionTimer: null, // 模拟交互定时器
            iframeLoaded: false,    // iframe加载状态
            videoErrorCount: 0,     // 视频错误计数
            lastVideoState: { playing: false, curTime: 0 } // 视频状态缓存
        },
        // 初始化入口：优先拦截事件，再加载功能
        async init() {
            console.log("%c 插件1.5破解版初始化（防自动暂停）", "background:rgb(234,76,137);color:#fff");
            // 1. 优先拦截全局事件，防止被网站脚本抢占
            this.hookGlobalEvents();
            // 2. 区分顶层页面和iframe视频页
            if (window.self !== window.top) {
                if (location.href.includes("a=player")) {
                    this.initIframeVideo(); // iframe内视频控制
                }
                return;
            }
            // 3. 顶层页面初始化
            this.addStyle();
            this.overrideAlert();
            this.page_videoTop();
            await this.waitTimeout(1000);
            this.begin();
        },
        // 核心破解1：拦截全局事件，阻止暂停触发
        hookGlobalEvents() {
            // 1. 重写视频元素的pause方法，阻止主动暂停
            const originalPause = HTMLMediaElement.prototype.pause;
            HTMLMediaElement.prototype.pause = function () {
                // 仅允许“播放完成”时暂停，其他情况拦截
                const video = this;
                if (video.duration && video.currentTime + 3 >= video.duration) {
                    originalPause.call(video); // 播放完成允许暂停
                } else {
                    console.log("%c 拦截视频暂停指令", "background:rgb(234,76,137);color:#fff");
                }
            };

            // 2. 拦截全局click事件，避免点击其他区域触发暂停
            document.addEventListener("click", (e) => {
                const videoIframe = plugMain.getVideoIframe();
                if (videoIframe && !videoIframe.contains(e.target)) {
                    // 点击非视频区域时，强制视频保持播放
                    const video = plugMain.getVideo();
                    if (video && video.paused) {
                        video.play().catch(err => {
                            video.muted = true;
                            video.play();
                        });
                    }
                }
            }, true); // 捕获阶段拦截，优先于网站脚本

            // 3. 阻止视频容器blur事件（失去焦点暂停）
            window.addEventListener("blur", (e) => {
                const video = plugMain.getVideo();
                if (video) {
                    e.preventDefault();
                    e.stopPropagation();
                    // 强制视频容器重新获取焦点
                    video.focus();
                }
            }, true);
        },
        // 核心破解2：模拟用户交互，对抗后台防挂机检测
        startInteractionSimulator() {
            // 清除旧定时器
            if (this.pageData.interactionTimer) {
                clearInterval(this.pageData.interactionTimer);
            }
            // 每30秒模拟一次鼠标移动和点击（模拟用户操作）
            this.pageData.interactionTimer = setInterval(() => {
                if (!this.getVideo()) return;
                // 1. 模拟鼠标微小移动
                const mouseEvent = new MouseEvent("mousemove", {
                    clientX: 100 + Math.random() * 20,
                    clientY: 200 + Math.random() * 20,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(mouseEvent);
                // 2. 模拟点击视频容器（防止被判定为无交互）
                const videoIframe = this.getVideoIframe();
                if (videoIframe) {
                    const clickEvent = new MouseEvent("click", {
                        clientX: videoIframe.getBoundingClientRect().x + 50,
                        clientY: videoIframe.getBoundingClientRect().y + 50,
                        bubbles: true,
                        cancelable: true
                    });
                    videoIframe.dispatchEvent(clickEvent);
                }
                console.log("%c 模拟用户交互（防挂机检测）", "background:rgb(234,76,137);color:#fff");
            }, 30000); // 30秒一次，避免触发高频检测
        },
        // 核心破解3：iframe内视频控制（防止iframe内脚本暂停）
        async initIframeVideo() {
            console.log("%c 视频iframe初始化（破解暂停）", "background:rgb(234,76,137);color:#fff");
            // 等待视频元素加载（最多20秒）
            const videoLoaded = await this.waitOf(
                () => $("video").length > 0 && $("video")[0].readyState >= 1,
                500,
                40
            );
            if (!videoLoaded) {
                this.sendMsgToTop("videoError", "iframe内未检测到视频元素");
                return;
            }
            // 1. 强制视频静音+播放
            const video = this.getVideo();
            video.muted = true;
            video.play().catch(err => {
                video.muted = true;
                video.play();
            });
            // 2. 拦截iframe内的暂停事件
            video.addEventListener("pause", (e) => {
                if (video.currentTime + 3 < video.duration) {
                    e.preventDefault();
                    e.stopPropagation();
                    video.play(); // 被暂停后立即恢复播放
                    console.log("%c iframe内视频被暂停，已恢复", "background:rgb(234,76,137);color:#fff");
                }
            }, true);
            // 3. 通知顶层页面iframe就绪
            this.pageData.iframeLoaded = true;
            this.sendMsgToTop("iframeReady", true);
            // 4. 同步视频状态到顶层页面
            setInterval(() => {
                if (!$("video").length) return;
                const curState = {
                    playing: !video.paused,
                    curTime: video.currentTime.toFixed(0),
                    totalTime: video.duration.toFixed(0),
                    finished: this.isPlayFinish()
                };
                if (
                    curState.playing !== this.pageData.lastVideoState.playing ||
                    curState.curTime !== this.pageData.lastVideoState.curTime
                ) {
                    this.sendMsgToTop("videoState", curState);
                    this.pageData.lastVideoState = curState;
                }
            }, 1000);
        },
        // 顶层-iframe通信：接收iframe状态
        listenIframeMsg() {
            window.addEventListener("message", async (e) => {
                if (!e.data || e.data.source !== "amacVideoPlugin") return;
                const { cmd, data } = e.data;
                switch (cmd) {
                    // iframe就绪：启动交互模拟+视频监控
                    case "iframeReady":
                        this.pageData.iframeLoaded = true;
                        this.startVideoMonitor();
                        this.startInteractionSimulator(); // 启动防挂机模拟
                        this.tipsMsg("视频防暂停功能已启用，点击其他区域不中断", 3000);
                        break;
                    // 视频状态同步：更新标题+处理播放完成
                    case "videoState":
                        const { curTime, totalTime, finished, playing } = data;
                        $("title").text(`视频进度：${curTime}/${totalTime}秒（防暂停）`);
                        if (finished) {
                            this.stopVideoMonitor();
                            this.stopInteractionSimulator();
                            this.tipsMsg("当前视频已播放完成", 2000);
                        }
                        break;
                    // 视频错误处理
                    case "videoError":
                        this.stopVideoMonitor();
                        this.stopInteractionSimulator();
                        this.alertMsg(`视频加载错误：${data}，建议刷新页面`, 5000);
                        break;
                }
            });
        },
        // 停止交互模拟定时器
        stopInteractionSimulator() {
            if (this.pageData.interactionTimer) {
                clearInterval(this.pageData.interactionTimer);
                this.pageData.interactionTimer = null;
            }
        },
        // 获取视频iframe（穿透顶层页面）
        getVideoIframe() {
            const iframe = $("iframe[src*='a=player']")[0];
            return (iframe && iframe.contentWindow) ? iframe : null;
        },
        // 启动视频监控（维持播放状态）
        startVideoMonitor() {
            this.stopVideoMonitor();
            // 每2秒检查视频状态，确保不被暂停
            this.pageData.videoTimer = setInterval(() => {
                const video = this.getVideo();
                const iframe = this.getVideoIframe();
                if (!video || !iframe || !this.pageData.iframeLoaded) {
                    this.pageData.videoErrorCount++;
                    if (this.pageData.videoErrorCount >= 5) {
                        this.stopVideoMonitor();
                        this.alertMsg("视频监控异常，建议刷新页面", 5000);
                        this.pageData.videoErrorCount = 0;
                    }
                    return;
                }
                // 强制维持静音+播放状态
                if (video.volume !== 0) video.volume = 0;
                if (video.paused) {
                    video.play().catch(err => {
                        video.muted = true;
                        video.play();
                    });
                }
            }, 2000);
        },
        // 停止视频监控
        stopVideoMonitor() {
            if (this.pageData.videoTimer) {
                clearInterval(this.pageData.videoTimer);
                this.pageData.videoTimer = null;
            }
            this.pageData.videoErrorCount = 0;
        },
        // 课程列表页：快速跳转功能
        async page_courseList() {
            console.log("%c 加载课程列表跳转功能", "background:rgb(52,199,89);color:#fff");
            const listLoaded = await this.waitOf(
                () => $(".course-item, .unit-li").length > 0,
                500,
                20
            );
            if (!listLoaded) {
                this.tipsMsg("未检测到课程列表，建议刷新页面重试", 3000);
                return;
            }
            // 为每个课程添加绿色跳转按钮
            $(".course-item, .unit-li").each((i, el) => {
                const $el = $(el);
                if ($el.find(".zfk-jump-btn").length > 0) return;
                const courseTitle = $el.find("h3, .course-title").text().trim() || `课程${i+1}`;
                const $btn = $(`<button class="zfk-btn zfk-jump-btn success">快速进入学习</button>`);
                $btn.on("click", () => {
                    const $link = $el.find("a[href*='a=studyDetail']");
                    if ($link.length > 0) {
                        const studyUrl = $link.attr("href");
                        const fullUrl = studyUrl.startsWith("http") ? studyUrl : `${window.location.origin}${studyUrl}`;
                        window.open(fullUrl, "_self");
                    } else {
                        layer.msg(`【${courseTitle}】未找到学习入口`, { icon: 2, time: 2000 });
                    }
                });
                $el.find(".course-info, .unit-info, .course-bottom").append($btn);
            });
            this.tipsMsg("课程跳转功能已加载，点击绿色按钮直达视频页", 2000);
        },
        // 视频详情页：初始化iframe监控
        async page_videoStudyDetail() {
            console.log("%c 进入视频详情页，加载防暂停监控", "background:rgb(234,76,137);color:#fff");
            // 等待iframe容器加载（最多15秒）
            const iframeLoaded = await this.waitOf(
                () => this.getVideoIframe() !== null,
                500,
                30
            );
            if (!iframeLoaded) {
                this.alertMsg("未检测到视频播放容器，可能页面加载失败", 5000);
                return;
            }
            // 启动iframe消息监听（接收状态同步）
            this.listenIframeMsg();
            this.pageData.iframeLoaded = false;
            this.tipsMsg("正在连接视频容器，防暂停功能启动中...", 2000);
        },
        // 基础功能：获取视频元素
        getVideo() {
            if (window.self !== window.top) {
                return $("video")[0] || null; // iframe内直接获取
            }
            // 顶层页面通过iframe获取视频
            const iframe = this.getVideoIframe();
            return iframe ? iframe.contentWindow.$("video")[0] : null;
        },
        // 基础功能：启动入口
        async begin() {
            if (window === top) this.registerMenuCommand();
            // 监听URL变化（单页应用适配）
            let lastUrl = location.href;
            setInterval(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    this.stopVideoMonitor();
                    this.stopInteractionSimulator();
                    this.pageData.iframeLoaded = false;
                    this.runByUrl(lastUrl);
                }
            }, 500);
            // 首次加载当前页面功能
            this.runByUrl(location.href);
        },
        // 注册浏览器菜单（含破解功能说明）
        registerMenuCommand() {
            GM_registerMenuCommand("📌 破解版功能说明", () => {
                this.alertMsg(`
                    <div style="line-height:1.6;">
                        1. 防自动暂停：点击其他区域（目录/笔记）不中断视频播放<br/>
                        2. 防挂机检测：每30秒模拟鼠标交互，避免学时不记录<br/>
                        3. 课程列表：绿色按钮直达视频页，视频页默认静音自动播放<br/>
                        4. 进度显示：浏览器标题实时显示视频进度
                    </div>
                `, 10000);
            });
            GM_registerMenuCommand("🔄 刷新页面（重置功能）", () => {
                this.stopVideoMonitor();
                this.stopInteractionSimulator();
                location.reload();
            });
            GM_registerMenuCommand("❓ 破解失效排查", () => {
                this.alertMsg(`
                    <div style="line-height:1.6;">
                        Q1：点击仍暂停？<br/>
                        A1：刷新页面，确保脚本在"document-start"时机运行（脚本设置中确认）<br/>
                        Q2：学时不记录？<br/>
                        A2：不要最小化浏览器，保持页面在前台（部分浏览器后台会暂停视频）<br/>
                        Q3：视频无声音？<br/>
                        A3：插件默认静音，可手动点击视频开启声音（不影响自动播放）
                    </div>
                `, 12000);
            });
        },
        // 基础功能：提示弹窗
        tipsMsg(msg, timeout = 2000) {
            layer.msg(msg, { offset: "100px", time: timeout, icon: 0 });
        },
        // 基础功能：等待元素加载
        waitOf(fun, interval = 500, timeout = 20) {
            return new Promise((resolve) => {
                let _timeOut = timeout * 1000;
                let checkTimer;
                if (fun()) {
                    resolve(true);
                    return;
                }
                checkTimer = setInterval(() => {
                    _timeOut -= interval;
                    if (_timeOut < 0) {
                        clearInterval(checkTimer);
                        resolve(false);
                        return;
                    }
                    if (fun()) {
                        clearInterval(checkTimer);
                        resolve(true);
                    }
                }, interval);
            });
        },
        // 基础功能：延迟等待
        waitTimeout(timeout) {
            return new Promise(resolve => setTimeout(resolve, timeout));
        },
        // 基础功能：URL匹配页面功能
        async runByUrl(url) {
            if (url.includes("/index.php")) {
                // 课程列表页（a=minecourses0）
                if (url.includes("a=minecourses0")) {
                    this.page_courseList();
                }
                // 视频详情页（a=studyDetail）
                else if (url.includes("a=studyDetail")) {
                    this.page_videoStudyDetail();
                }
            }
        },
        // 基础功能：重写alert弹窗
        overrideAlert() {
            unsafeWindow.alert = function (msg) {
                layer.alert(msg, { title: "插件提示", icon: 0, shade: 0.2 });
            };
        },
        // 基础功能：发送消息到顶层页面
        sendMsgToTop(cmd, data) {
            window.top.postMessage({
                source: "amacVideoPlugin",
                cmd: cmd,
                data: data
            }, "*");
        },
        // 基础功能：发送指令到iframe
        sendCmdToIframe(cmd) {
            const videoIframe = this.getVideoIframe();
            if (videoIframe) {
                videoIframe.contentWindow.postMessage({
                    source: "amacVideoPlugin",
                    cmd: cmd
                }, "*");
            }
        },
        // 基础功能：检测视频是否播放完成
        isPlayFinish() {
            try {
                const video = this.getVideo();
                return video && video.duration > 0 && video.currentTime + 3 >= video.duration;
            } catch (e) {
                return false;
            }
        },
        // 基础功能：加载样式（绿色按钮）
        addStyle() {
            GM_addStyle(`
                /* 课程跳转按钮（绿色高亮） */
                .zfk-jump-btn {
                    background-color:#38b03f !important;
                    color:white !important;
                    padding:6px 15px !important;
                    border-radius:6px !important;
                    cursor:pointer !important;
                    border:none !important;
                    font-size:14px !important;
                    margin:8px 0 0 10px !important;
                    transition:all 0.3s !important;
                }
                .zfk-jump-btn:hover {
                    background-color:#2e9c35 !important;
                    transform:translateY(-1px) !important;
                    box-shadow:0 2px 5px rgba(0,0,0,0.1) !important;
                }
                /* 基础按钮样式 */
                .zfk-btn {
                    background-color:#0fbcf9;
                    color:white;
                    padding:4px 12px;
                    border:none;
                    box-sizing:content-box;
                    font-size:14px;
                    height:20px;
                    border-radius:4px;
                    cursor:pointer;
                    display:inline-block;
                    border:1px solid transparent;
                    white-space:nowrap;
                    user-select:none;
                    text-align:center;
                    vertical-align:middle;
                }
                .zfk-btn.success { background-color:#38b03f; }
            `);
        },
        // 基础功能：视频页标题更新监听
        page_videoTop() {
            GM_addValueChangeListener('updateTitle', (name, old_val, new_val) => {
                if (new_val && new_val.title && !this.pageData.iframeLoaded) {
                    $("title").text(new_val.title);
                }
            });
        },
        // 基础功能：GM存储操作
        getGMData(item, def = null) {
            return GM_getValue(item, def);
        },
        setGMData(item, val) {
            GM_setValue(item, val);
        },
        // 基础功能：获取当前时间戳
        now() {
            return new Date().getTime();
        }
    });

    // 脚本加载提示
    setTimeout(() => {
        if (!unsafeWindow.plugMain) {
            plugMain.init();
            unsafeWindow.plugMain = plugMain;
        } else {
            console.log("%c 插件已加载，跳过重复初始化", "background:rgb(155,155,155);color:#fff");
            plugMain.begin();
        }
    }, 500);
})();