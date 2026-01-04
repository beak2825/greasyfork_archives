// ==UserScript==
// @name              全网VIP视频免费破解去广告-alienzy自用版
// @namespace         http://tampermonkey.net/
// @version           0.1.0
// @description       全网VIP视频免费破解去广告，适配PC+移动，全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析！鼠标左键拖拽，支持本页解析和跳转解析！🔥真4K高清🔥脚本长期维护更新，完全免费，无广告，仅限学习交流！
// @icon              data:image/png;base64,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
// @author            https://blog.alienzy.top/vipjx
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/tv/*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iq.com/play/*
// @include           *://*.youku.com/v_*
// @include           *://*.youku.com/video*
// @include           *://*.youku.com/*?vid=*
// @include           *://*.mgtv.com/b/*
// @include           *://*.tudou.com/v_*
// @include           *://tv.sohu.com/v/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://v.pptv.com/show/*
// @include           *://vip.pptv.com/show/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://*.acfun.cn/v/*
// @include           *://*.acfun.cn/bangumi/*
// @include           *://*.1905.com/play/*
// @include           *://m.v.qq.com/x/m/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/v_*
// @include           *://m.youku.com/video/*
// @include           *://m.youku.com/alipay_*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.tv.sohu.com/album/*
// @include           *://m.pptv.com/show/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/bangumi/play/*
// @require           https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/3.7.1/jquery.min.js
// @connect           api.bilibili.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset           UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/552973/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A-alienzy%E8%87%AA%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552973/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A-alienzy%E8%87%AA%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

const util = (function () {
    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if ((++tryTime) === maxTryTime) {
                    clearInterval(interval);
                    reject(new Error(`未找到元素: ${targetContainer}`));
                }
            }, 500);
        });
    }

    function urlChangeReload() {
        const oldHref = window.location.href;
        let interval = setInterval(() => {
            let newHref = window.location.href;
            if (oldHref !== newHref) {
                clearInterval(interval);
                window.location.reload();
            }
        }, 500);
    }

    function reomveVideo() {
        setInterval(() => {
            for (let video of document.getElementsByTagName("video")) {
                if (video.src) {
                    video.removeAttribute("src");
                    video.muted = true;
                    video.load();
                    video.pause();
                }
            }
        }, 500);
    }

    function syncRequest(option) {
        return new Promise((resolve, reject) => {
            option.onload = (res) => resolve(res);
            option.onerror = (err) => reject(err);
            GM_xmlhttpRequest(option);
        });
    }

    return {
        req: (option) => syncRequest(option),
        findTargetEle: (targetEle) => findTargetElement(targetEle),
        urlChangeReload: () => urlChangeReload(),
        reomveVideo: () => reomveVideo()
    }
})();


const superVip = (function () {
    const _CONFIG_ = {
        isMobile: navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
        currentPlayerNode: null,
        vipBoxId: 'vip_jx_box' + Math.ceil(Math.random() * 100000000),
        totalAreaId: 'vip_total_area' + Math.ceil(Math.random() * 100000000),
        flag: "flag_vip",
        videoParseList: [
            {"name": "789解析", "type": "1,3", "url": "https://jiexi.789jiexi.icu:4433/?url="},
            {"name": "极速解析", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
            {"name": "冰豆解析", "type": "1,3", "url": "https://bd.jx.cn/?url="},
            {"name": "973解析", "type": "1,3", "url": "https://jx.973973.xyz/?url="},
            {"name": "Player-JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
            {"name": "虾米视频解析", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "CK", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
            {"name": "七哥解析", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
            {"name": "夜幕", "type": "1,3", "url": "https://www.yemu.xyz/?url="},
            {"name": "盘古", "type": "1,3", "url": "https://www.pangujiexi.com/jiexi/?url="},
            {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
            {"name": "七七云解析", "type": "1,3", "url": "https://jx.77flv.cc/?url="},
            {"name": "芒果TV1", "type": "1,3", "url": "https://video.isyour.love/player/getplayer?url="},
            {"name": "芒果TV2", "type": "1,3","url":"https://im1907.top/?jx="},
            {"name": "HLS解析", "type": "1,3", "url": "https://jx.hls.one/?url="},
        ],
        playerContainers: [
            {host: "v.qq.com", container: "#mod_player,#player-container,.container-player", name: "Default", displayNodes: ["#mask_layer", ".mod_vip_popup", "#mask_layer", ".panel-tip-pay"]},
            {host: "m.v.qq.com", container: ".mod_player,#player", name: "Default", displayNodes: [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec"]},
            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "m.mgtv.com", container: ".video-area", name: "Default", displayNodes: ["div.adFixedContain,div.ad-banner,div.m-list-graphicxcy.fstp-mark", "div[class^=mg-app],div#comment-id.video-comment div.ft,div.bd.clearfix,div.v-follower-info", "div.ht.mgui-btn.mgui-btn-nowelt", "div.personal", "div[data-v-41c9a64e]"]},
            {host: "www.bilibili.com", container: "#player_module,#bilibiliPlayer,#bilibili-player", name: "Default", displayNodes: []},
            {host: "m.bilibili.com", container: ".player-wrapper,.player-container,.mplayer", name: "Default", displayNodes: []},
            {host: "www.iqiyi.com", container: "#outlayer, .iqp-player-videolayer", name: "Default", displayNodes: ["#playerPopup", "#vipCoversBox" ,"div.iqp-player-vipmask", "div.iqp-player-paymask","div.iqp-player-loginmask", "div[class^=qy-header-login-pop]",".covers_cloudCover__ILy8R","#videoContent > div.loading_loading__vzq4j",".iqp-player-guide"]},
            {host: "m.iqiyi.com", container: ".m-video-player-wrap, .iqp-player-videolayer", name: "Default", displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "div.iqp-player-vipmask", ".loading_loading__vzq4j","[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"]},
            {host: "www.iq.com", container: ".intl-video-wrap", name: "Default", displayNodes: []},
            {host: "v.youku.com", container: "#playerMouseWheel", name: "Default", displayNodes: ["#iframaWrapper"]},
            {host: "m.youku.com", container: "#playerMouseWheel,.h5-detail-player", name: "Default", displayNodes: []},
            {host: "tv.sohu.com", container: "#player", name: "Default", displayNodes: []},
            {host: "film.sohu.com", container: "#playerWrap", name: "Default", displayNodes: []},
            {host: "www.le.com", container: "#le_playbox", name: "Default", displayNodes: []},
            {host: "video.tudou.com", container: ".td-playbox", name: "Default", displayNodes: []},
            {host: "v.pptv.com", container: "#pptv_playpage_box", name: "Default", displayNodes: []},
            {host: "vip.pptv.com", container: ".w-video", name: "Default", displayNodes: []},
            {host: "www.wasu.cn", container: "#flashContent", name: "Default", displayNodes: []},
            {host: "www.acfun.cn", container: "#player", name: "Default", displayNodes: []},
            {host: "vip.1905.com", container: "#player,#vodPlayer", name: "Default", displayNodes: []},
            {host: "www.1905.com", container: "#player,#vodPlayer", name: "Default", displayNodes: []},
        ]
    };

    class BaseConsumer {
        constructor() {
            this.parse = () => {
                util.findTargetEle('body')
                    .then((body) => this.initPlayerNode())
                    .then(() => this.preHandle())
                    .then(() => this.generateElement())
                    .then(() => this.bindEvent())
                    .then(() => this.postHandle())
                    .catch(err => console.error("初始化失败:", err));
            }
        }

        initPlayerNode() {
            return new Promise((resolve) => {
                const currentHost = window.location.host;
                _CONFIG_.currentPlayerNode = _CONFIG_.playerContainers.find(container =>
                    currentHost.includes(container.host)
                );
                if (!_CONFIG_.currentPlayerNode) {
                    _CONFIG_.currentPlayerNode = {
                        container: "video",
                        displayNodes: []
                    };
                }
                resolve();
            });
        }

        preHandle() {
            return new Promise((resolve) => {
                _CONFIG_.currentPlayerNode.displayNodes.forEach((selector) => {
                    util.findTargetEle(selector)
                        .then((el) => el.style.display = 'none')
                        .catch(() => {});
                });
                resolve();
            });
        }

        generateElement() {
            return new Promise((resolve) => {
                GM_addStyle(`
                    #${_CONFIG_.totalAreaId} {
                        position: fixed;
                        top: 50%;
                        left: 20px;
                        transform: translateY(-50%);
                        z-index: 99999999;
                        display: inline-block;
                        padding: 5px;
                    }

                    #${_CONFIG_.vipBoxId} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 15px;
                        float: left;
                    }

                    .control-btn {
                        width: 63px;
                        height: 63px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px; /* 减小字体大小 */
                        font-weight: bold;
                        cursor: pointer;
                        color: white;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                        transition: all 0.3s ease;
                        z-index: 10;
                        text-align: center;
                        line-height: 1.2; /* 调整行高以适应小字体 */
                        padding: 5px;
                        word-break: break-word; /* 允许文字换行 */
                    }

                    .vip-main { background-color: #7d4aee; }
                    .inline-btn { background-color: #28a745; }
                    .popup-btn {
                        background-color: #ffc107; /* 黄色背景 */
                        color: black; /* 黑色文字，提高可读性 */
                    }

                    .inline-btn, .popup-btn {
                        opacity: 0;
                        visibility: hidden;
                        transform: translateX(-20px);
                        transition: all 0.3s ease;
                    }

                    #${_CONFIG_.totalAreaId}.active .inline-btn,
                    #${_CONFIG_.totalAreaId}.active .popup-btn {
                        opacity: 1;
                        visibility: visible;
                        transform: translateX(0);
                    }

                    .vip-list {
                        display: none;
                        float: left;
                        margin-left: 15px;
                        margin-top: 20px;
                        background: #3f4149;
                        border: 1px solid white;
                        border-radius: 5px;
                        width: 380px;
                        max-height: 400px;
                        overflow-y: auto;
                        padding: 10px 0;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        z-index: 5;
                    }

                    .vip-list.show {
                        display: block;
                    }

                    .list-section { display: none; }
                    .list-section.active { display: block; }

                    .vip-list li {
                        float: left;
                        width: calc(25% - 14px);
                        margin: 4px 2px;
                        padding: 0 4px;
                        line-height: 21px;
                        font-size: 12px;
                        color: #E6E6E6;
                        border: 1px solid gray;
                        border-radius: 2px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        user-select: none;
                    }

                    .vip-list li:hover {
                        color: #00dffc;
                        border-color: #00dffc;
                    }

                    .vip-list h3 {
                        color: #00dffc;
                        font-size: 16px;
                        padding: 5px 10px;
                        margin: 0;
                        text-align: left;
                    }

                    .vip-list ul {
                        padding: 0 10px;
                        margin: 0;
                        list-style: none;
                    }

                    .info {
                        padding: 10px;
                        color: #FFF;
                        font-size: 10px;
                        text-align: left;
                    }

                    li.selected {
                        color: #00dffc;
                        border: 1px solid #00dffc;
                    }
                `);

                let type1List = "";
                let type3List = "";
                _CONFIG_.videoParseList.forEach((item, index) => {
                    if (item.type.includes("1")) {
                        type1List += `<li class="nq-li" data-index="${index}">${item.name}</li>`;
                    }
                    if (item.type.includes("3")) {
                        type3List += `<li class="tc-li" data-index="${index}">${item.name}</li>`;
                    }
                });

                const html = `
                    <div id="${_CONFIG_.totalAreaId}">
                        <div id="${_CONFIG_.vipBoxId}">
                            <div class="control-btn inline-btn" title="内嵌播放解析源">内嵌播放</div>
                            <div class="control-btn vip-main" title="VIP解析菜单">VIP</div>
                            <div class="control-btn popup-btn" title="跳转播放解析源">跳转播放</div>
                        </div>
                        <div class="vip-list">
                            <div class="list-section" id="inline-list">
                                <h3>内嵌播放</h3>
                                <ul>${type1List}<div style="clear:both;"></div></ul>
                            </div>
                            <div class="list-section" id="popup-list">
                                <h3>跳转播放</h3>
                                <ul>${type3List}<div style="clear:both;"></div></ul>
                            </div>
                            <div class="info">
                                <b>使用说明：</b><br>
                                1. 内嵌播放：在当前页面内嵌播放视频<br>
                                2. 跳转播放：在新页面打开播放器
                            </div>
                        </div>
                    </div>
                `;

                $("body").prepend(html);
                resolve();
            });
        }

        bindEvent() {
            return new Promise((resolve) => {
                const totalArea = $(`#${_CONFIG_.totalAreaId}`);
                const vipBox = $(`#${_CONFIG_.vipBoxId}`);
                const vipList = totalArea.find(".vip-list");
                const inlineBtn = vipBox.find(".inline-btn");
                const popupBtn = vipBox.find(".popup-btn");
                const vipMainBtn = vipBox.find(".vip-main");
                const inlineList = vipList.find("#inline-list");
                const popupList = vipList.find("#popup-list");

                const showList = (section) => {
                    vipList.addClass("show");
                    inlineList.removeClass("active");
                    popupList.removeClass("active");
                    section.addClass("active");
                    totalArea.addClass("active");
                };

                const hideList = () => {
                    vipList.removeClass("show");
                    inlineList.removeClass("active");
                    popupList.removeClass("active");
                };

                const hideAll = () => {
                    totalArea.removeClass("active");
                    hideList();
                };

                // VIP主按钮交互
                vipMainBtn.on('mouseenter', () => totalArea.addClass("active"));

                // 内嵌按钮交互
                inlineBtn.on('mouseenter', () => {
                    totalArea.addClass("active");
                    showList(inlineList);
                });
                inlineBtn.on('click', () => showList(inlineList));

                // 跳转按钮交互
                popupBtn.on('mouseenter', () => {
                    totalArea.addClass("active");
                    showList(popupList);
                });
                popupBtn.on('click', () => showList(popupList));

                // 整体区域离开时隐藏
                totalArea.on('mouseleave', () => {
                    hideAll();
                });

                // 内嵌播放点击事件
                const _this = this;
                vipList.on('click', '.nq-li', function(e) {
                    e.stopPropagation();
                    const index = parseInt($(this).data("index"));
                    GM_setValue(_CONFIG_.flag, "true");
                    _this.showPlayerWindow(_CONFIG_.videoParseList[index]);
                    vipList.find("li").removeClass("selected");
                    $(this).addClass("selected");
                    hideAll();
                });

                // 跳转播放点击事件
                vipList.on('click', '.tc-li', function(e) {
                    e.stopPropagation();
                    const index = parseInt($(this).data("index"));
                    const parseObj = _CONFIG_.videoParseList[index];
                    if (parseObj) {
                        const url = parseObj.url + window.location.href;
                        GM_openInTab(url, {active: true});
                        hideAll();
                    }
                });

                // 拖拽功能
                totalArea.on('mousedown', function(e) {
                    if (!$(e.target).closest(".vip-main").length) return;
                    if (e.which !== 1) return;

                    const startPos = { x: e.pageX, y: e.pageY };
                    const boxPos = {
                        x: parseInt(totalArea.css("left")) || 20,
                        y: parseInt(totalArea.css("top")) || ($(window).height()/2 - 100)
                    };

                    totalArea.css("cursor", "grabbing");

                    const onMouseMove = (e) => {
                        e.preventDefault();
                        const dx = e.pageX - startPos.x;
                        const dy = e.pageY - startPos.y;
                        let newX = boxPos.x + dx;
                        let newY = boxPos.y + dy;

                        const maxX = $(window).width() - 450;
                        const maxY = $(window).height() - 300;
                        newX = Math.max(0, Math.min(newX, maxX));
                        newY = Math.max(0, Math.min(newY, maxY));

                        totalArea.css({ left: newX, top: newY, transform: 'none' });
                    };

                    const onMouseUp = () => {
                        $(document).off("mousemove", onMouseMove);
                        $(document).off("mouseup", onMouseUp);
                        totalArea.css("cursor", "default");
                    };

                    $(document).on("mousemove", onMouseMove);
                    $(document).on("mouseup", onMouseUp);
                });

                resolve();
            });
        }

        // 使用0.2版本的播放器替换逻辑
        showPlayerWindow(videoObj) {
            util.findTargetEle(_CONFIG_.currentPlayerNode.container)
                .then((container) => {
                    const type = videoObj.type;
                    let url = videoObj.url + window.location.href;
                    if (type.includes("1")) {
                        $(container).empty();
                        util.reomveVideo();
                        let iframeDivCss = "width:100%;height:100%;z-index:999999;";
                        if (_CONFIG_.isMobile) {
                            iframeDivCss = "width:100%;height:450px;z-index:999999;";
                        }
                        if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                            iframeDivCss = "width:100%;height:450px;z-index:999999;margin-top:-56.25%;";
                        }
                        try {
                            if (location.host.indexOf("youku.com") !== -1) {
                                const youkuSelectors = [
                                    "#youku-dashboard > div.kui-dashboard-dashboard-panel",
                                    "#youku-dashboard > div.kui-dashboard-dashboard-background",
                                    "#youku-dashboard > div.kui-dashboard-bar-container",
                                    "#youku-dashboard > div.kui-dashboard-timer-container"
                                ];
                                // 多次尝试清理，兼容异步渲染/延迟挂载
                                let attempts = 0;
                                const maxAttempts = 3;
                                const tid = setInterval(() => {
                                    attempts++;
                                    youkuSelectors.forEach(sel => {
                                        document.querySelectorAll(sel).forEach(n => n.remove());
                                    });
                                    if (attempts >= maxAttempts) clearInterval(tid);
                                }, 500);
                            }
                        } catch (e) {
                            console.warn("Youku cleanup error:", e);
                        }
                        $(container).append(`<div style="${iframeDivCss}"><iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;" allowfullscreen="true" width="100%" height="100%"></iframe></div>`);
                    }
                });
        }

        // 使用0.2版本的URL变化处理逻辑
        postHandle() {
            let oldHref = window.location.href;
            let interval = setInterval(() => {
                let newHref = window.location.href;
                if (oldHref !== newHref) {
                    oldHref = newHref;
                    if (!!GM_getValue(_CONFIG_.flag, null)){
                        clearInterval(interval);
                        window.location.reload();
                    }
                }
            }, 1000);
            return Promise.resolve();
        }
    }

    new BaseConsumer().parse();
})();