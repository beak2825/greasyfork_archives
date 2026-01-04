// ==UserScript==
// @name              全网VIP视频
// @namespace        
// @version           2025.9.29
// @description       全网VIP视频免费，智能选择有效解析链接，支持手动切换解析源
// @icon              https://nuaa.tech/zz.svg
// @author            https://pro.gleeze.com/article/46
// @include           *://v.qq.com/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/tv/*
// @include           *://*.iqiyi.com/*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iq.com/play/*
// @include           *://*.youku.com/*
// @include           *://*.youku.com/video*
// @include           *://*.youku.com/*?vid=*
// @include           *://*.mgtv.com/b/*
// @include           *://*.tudou.com/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/*
// @include           *://*.bilibili.com/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://v.pptv.com/show/*
// @include           *://vip.pptv.com/show/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://*.acfun.cn/v/*
// @include           *://*.acfun.cn/bangumi/*
// @include           *://*.1905.com/play/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/kszt/*
// @include           *://m.youku.com/video/*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.film.sohu.com/album/*
// @include           *://m.pptv.com/show/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/bangumi/play/*
// @connect           api.bilibili.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_notification
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/551027/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/551027/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91.meta.js
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
                    reject();
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
            option.onload = (res) => {
                resolve(res);
            };
            option.onerror = (err) => {
                reject(err);
            };
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
        statusBoxId: 'vip_status_box' + Math.ceil(Math.random() * 100000000),
        switchBtnId: 'vip_switch_btn' + Math.ceil(Math.random() * 100000000),
        flag: "flag_vip",
        autoPlayerKey: "auto_player_key" + window.location.host,
        autoPlayerVal: "auto_player_value_" + window.location.host,
        currentParseIndex: "current_parse_index_" + window.location.host,
        successCountKey: "success_count_key_" + window.location.host,
        videoParseList: [
         {"name": "优质A", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
         {"name": "通用无广", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
          {"name": "特供解析B", "type": "1,3", "url": "https://jx.77flv.cc/?url="},
            {"name": "特供解析A", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "新1解析", "type": "1,3", "url": "https://jx.m3u8.tv/jiexi/?url="},
            {"name": "极速解析", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
            {"name": "冰豆解析", "type": "1,3", "url": "https://bd.jx.cn/?url="},
            {"name": "973解析", "type": "1,3", "url": "https://jx.973973.xyz/?url="},
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
            {
                host: "v.qq.com",
                container: "#mod_player,#player-container,.container-player",
                name: "Default",
                displayNodes: ["#mask_layer", ".mod_vip_popup", "#mask_layer", ".panel-tip-pay"]
            },
            {
                host: "m.v.qq.com",
                container: ".mod_player,#player",
                name: "Default",
                displayNodes: [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec"]
            },

            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {
                host: "m.mgtv.com",
                container: ".video-area",
                name: "Default",
                displayNodes: ["div.adFixedContain,div.ad-banner,div.m-list-graphicxcy.fstp-mark", "div[class^=mg-app],div#comment-id.video-comment div.ft,div.bd.clearfix,div.v-follower-info", "div.ht.mgui-btn.mgui-btn-nowelt", "div.personal", "div[data-v-41c9a64e]"]
            },
            {host: "www.bilibili.com", container: "#player_module,#bilibiliPlayer,#bilibili-player", name: "Default", displayNodes: []},
            {host: "m.bilibili.com", container: ".player-wrapper,.player-container,.mplayer", name: "Default", displayNodes: []},
            {host: "www.iqiyi.com", container: "#outlayer, .iqp-player-videolayer", name: "Default", displayNodes: ["#playerPopup", "#vipCoversBox" ,"div.iqp-player-vipmask", "div.iqp-player-paymask","div.iqp-player-loginmask", "div[class^=qy-header-login-pop]",".covers_cloudCover__ILy8R","#videoContent > div.loading_loading__vzq4j",".iqp-player-guide"]},
            {
                host: "m.iqiyi.com",
                container: ".m-video-player-wrap, .iqp-player-videolayer",
                name: "Default",
                displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "div.iqp-player-vipmask", ".loading_loading__vzq4j","[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"]
            },
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
            this.currentTryIndex = -1;
            this.autoTryTimer = null;
            this.successCounts = GM_getValue(_CONFIG_.successCountKey, {});
            this.parse = () => {
                util.findTargetEle('body')
                    .then((container) => this.preHandle(container))
                    .then((container) => this.generateStatusBox(container))
                    .then((container) => this.autoPlay(container))
                    .then((container) => this.postHandle(container));
            }
        }

        preHandle(container) {
            _CONFIG_.currentPlayerNode.displayNodes.forEach((item, index) => {
                util.findTargetEle(item)
                    .then((obj) => obj.style.display = 'none')
                    .catch(e => console.warn("不存在元素", e));
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        generateStatusBox(container) {
            GM_addStyle(`
                #${_CONFIG_.statusBoxId} {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 9999999;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }
                #${_CONFIG_.statusBoxId} .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 6px;
                }
                #${_CONFIG_.statusBoxId} .status-working {
                    background-color: #4CAF50;
                }
                #${_CONFIG_.statusBoxId} .status-error {
                    background-color: #F44336;
                }
                #${_CONFIG_.statusBoxId} .status-idle {
                    background-color: #FFC107;
                }
                #${_CONFIG_.statusBoxId} .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 6px;
                }
                
                #${_CONFIG_.switchBtnId} {
                    position: fixed;
                    top: 60px;
                    right: 10px;
                    z-index: 9999999;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #3498db;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    border: none;
                    outline: none;
                }
                
                #${_CONFIG_.switchBtnId}:hover {
                    transform: scale(1.1);
                    background: #2980b9;
                }
                
                #${_CONFIG_.switchBtnId}.success {
                    background: #2ecc71;
                }
                
                #${_CONFIG_.switchBtnId}.error {
                    background: #e74c3c;
                }
                
                #${_CONFIG_.switchBtnId}.loading {
                    background: #3498db;
                    animation: pulse 1.5s infinite;
                }
                
                #${_CONFIG_.switchBtnId} svg {
                    width: 24px;
                    height: 24px;
                    fill: white;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `);

            $(container).append(`
                <div id="${_CONFIG_.statusBoxId}">
                    <div class="loading-spinner"></div>
                    <span id="status-text">正在初始化解析器...</span>
                </div>
            `);
            
            // 添加切换按钮
            $(container).append(`
                <button id="${_CONFIG_.switchBtnId}" class="loading" title="切换解析源">
                    <svg viewBox="0 0 24 24">
                        <path d="M17.65,6.35C16.2,4.9,14.21,4,12,4c-4.42,0-7.99,3.58-7.99,8s3.57,8,7.99,8c3.73,0,6.84-2.55,7.73-6h-2.08 c-0.82,2.33-3.04,4-5.65,4c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.66,0,3.14,0.69,4.22,1.78L13,11h7V4L17.65,6.35z"/>
                    </svg>
                </button>
            `);
            
            // 绑定按钮点击事件
            $(`#${_CONFIG_.switchBtnId}`).on('click', () => {
                this.switchToNextParser();
            });
            
            return new Promise((resolve, reject) => resolve(container));
        }

        updateStatus(text, statusClass) {
            const statusBox = $(`#${_CONFIG_.statusBoxId}`);
            if (statusBox.length) {
                statusBox.find("#status-text").text(text);
                if (statusClass) {
                    statusBox.find(".loading-spinner").remove();
                    statusBox.prepend(`<span class="status-indicator ${statusClass}"></span>`);
                }
            }
        }

        updateSwitchButton(status) {
            const btn = $(`#${_CONFIG_.switchBtnId}`);
            btn.removeClass("loading success error");
            btn.addClass(status);
        }

        autoPlay(container) {
            this.selectPlayer();
            return new Promise((resolve, reject) => resolve(container));
        }

        selectPlayer() {
            // 获取成功率最高的解析源
            let bestIndex = 0;
            let bestSuccessRate = -1;
            
            for (let i = 0; i < _CONFIG_.videoParseList.length; i++) {
                const successCount = this.successCounts[i] || 0;
                const successRate = successCount > 0 ? successCount / (successCount + 1) : 0;
                
                if (successRate > bestSuccessRate) {
                    bestSuccessRate = successRate;
                    bestIndex = i;
                }
            }
            
            let autoObj = _CONFIG_.videoParseList[bestIndex];
            let _th = this;
            if (autoObj.type.includes("1")) {
                setTimeout(function () {
                    _th.showPlayerWindow(autoObj, bestIndex);
                }, 1000);
            }
        }

        showPlayerWindow(videoObj, index) {
            this.currentTryIndex = index;
            this.updateStatus(`正在尝试: ${videoObj.name}`, "status-working");
            this.updateSwitchButton("loading");
            
            util.findTargetEle(_CONFIG_.currentPlayerNode.container)
                .then((container) => {
                    const type = videoObj.type;
                    let url = videoObj.url + window.location.href;
                    if (type.includes("1")) {
                        $(container).empty();
                        util.reomveVideo();
                        let iframeDivCss = "width:100%;height:100%;z-index:999999;position:relative;";
                        if (_CONFIG_.isMobile) {
                            iframeDivCss = "width:100%;height:450px;z-index:999999;position:relative;";
                        }
                        if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                            iframeDivCss = "width:100%;height:450px;z-index:999999;margin-top:-56.25%;position:relative;";
                        }
                        
                        // 添加加载动画
                        $(container).append(`
                            <div style="${iframeDivCss}">
                                <div class="loading-container" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999999;display:flex;justify-content:center;align-items:center;flex-direction:column;">
                                    <div class="loading-spinner" style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
                                    <div style="color:white;margin-top:10px;">正在尝试解析: ${videoObj.name}</div>
                                </div>
                                <iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;width:100%;height:100%;" allowfullscreen="true"></iframe>
                            </div>
                        `);
                        
                        const iframe = $(container).find("#iframe-player-4a5b6c")[0];
                        const loadingContainer = $(container).find(".loading-container");
                        
                        // 设置超时检测
                        const timeout = setTimeout(() => {
                            loadingContainer.hide();
                            this.handleParseFailure(index, container);
                        }, 10000);
                        
                        // 监听iframe加载完成
                        iframe.onload = () => {
                            clearTimeout(timeout);
                            loadingContainer.hide();
                            
                            // 记录解析成功
                            this.recordParseSuccess(index);
                            
                            // 更新状态
                            this.updateStatus(`解析成功: ${videoObj.name}`, "status-working");
                            this.updateSwitchButton("success");
                        };
                    }
                });
        }
        
        handleParseFailure(currentIndex, container) {
            // 记录解析失败
            this.recordParseFailure(currentIndex);
            
            // 查找下一个可用的解析源
            let nextIndex = -1;
            for (let i = 0; i < _CONFIG_.videoParseList.length; i++) {
                const idx = (currentIndex + i + 1) % _CONFIG_.videoParseList.length;
                if (_CONFIG_.videoParseList[idx].type.includes("1")) {
                    nextIndex = idx;
                    break;
                }
            }
            
            if (nextIndex !== -1) {
                // 显示下一个解析源
                const nextObj = _CONFIG_.videoParseList[nextIndex];
                this.showPlayerWindow(nextObj, nextIndex);
                
                // 更新状态
                this.updateStatus(`解析失败，尝试: ${nextObj.name}`, "status-error");
                this.updateSwitchButton("error");
                
                // 显示错误通知
                GM_notification({
                    text: `解析失败，正在尝试: ${nextObj.name}`,
                    title: "VIP解析",
                    timeout: 3000
                });
            } else {
                // 没有可用的解析源
                this.updateStatus("所有解析源尝试失败", "status-error");
                this.updateSwitchButton("error");
                GM_notification({
                    text: "所有解析源尝试失败，请刷新页面重试",
                    title: "VIP解析",
                    timeout: 5000
                });
            }
        }
        
        recordParseSuccess(index) {
            // 更新成功率统计
            this.successCounts[index] = (this.successCounts[index] || 0) + 1;
            GM_setValue(_CONFIG_.successCountKey, this.successCounts);
        }
        
        recordParseFailure(index) {
            // 更新成功率统计
            this.successCounts[index] = this.successCounts[index] || 0;
            GM_setValue(_CONFIG_.successCountKey, this.successCounts);
        }
        
        switchToNextParser() {
            if (this.currentTryIndex === -1) return;
            
            // 查找下一个可用的解析源
            let nextIndex = -1;
            for (let i = 0; i < _CONFIG_.videoParseList.length; i++) {
                const idx = (this.currentTryIndex + i + 1) % _CONFIG_.videoParseList.length;
                if (_CONFIG_.videoParseList[idx].type.includes("1")) {
                    nextIndex = idx;
                    break;
                }
            }
            
            if (nextIndex !== -1) {
                // 显示下一个解析源
                const nextObj = _CONFIG_.videoParseList[nextIndex];
                this.showPlayerWindow(nextObj, nextIndex);
                
                // 更新状态
                this.updateStatus(`手动切换至: ${nextObj.name}`, "status-working");
                this.updateSwitchButton("loading");
                
                // 显示通知
                GM_notification({
                    text: `已切换到: ${nextObj.name}`,
                    title: "VIP解析",
                    timeout: 2000
                });
            }
        }

        postHandle(container) {
            util.urlChangeReload();
        }

    }

    class DefaultConsumer extends BaseConsumer {
    }

    return {
        start: () => {
            GM_setValue(_CONFIG_.flag, null);
            let mallCase = 'Default';
            let playerNode = _CONFIG_.playerContainers.filter(value => value.host === window.location.host);
            if (playerNode === null || playerNode.length <= 0) {
                console.warn(window.location.host + "该网站暂不支持，请联系作者，作者将会第一时间处理（注意：请记得提供有问题的网址）");
                return;
            }
            _CONFIG_.currentPlayerNode = playerNode[0];
            mallCase = _CONFIG_.currentPlayerNode.name;
            const targetConsumer = eval(`new ${mallCase}Consumer`);
            targetConsumer.parse();
        }
    }

})();

(function () {
    superVip.start();
})();

