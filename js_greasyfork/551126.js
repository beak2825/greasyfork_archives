// ==UserScript==
// @name              全网VIP视频免费破解【持续更新版】
// @namespace         http://tampermonkey.net/
// @version           1.0.1
// @description       全网VIP视频免费破解【持续更新版】。支持：腾讯、爱奇艺、优酷、芒果、pptv、乐视...；
// @icon              data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD//gAUU29mdHdhcmU6IFNuaXBhc3Rl/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAGgAeAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8/stTivZLhFV0eBtrhwB+PXpXc/Bj4bXXxy1ObTdE1XTrDUE3GO31PzkMyqMsytHE64Gf4iD6A15TrUx0fUriVQcXcBUY/vjivpb9hGz+w/GLTocYK6dcbvqQCa/Q6ec46dWth21zUFNzdt3zfuvS8btng5rwnkuCy3DZrSi3DGyoqiuZ6JQf1m/flq2hG+yMPTf2e9X1nVPEFlZa9olx/YTmO9nDXKxo4LB1G6AMxUockDB7E1i+Jvg/rnhzw/peuRSWut6RqP+pu9MMjgHBIDK6KwOAe3bBwa+g/hQEPiP41CVmSM6ndbmRdxA3zZIGRn8xXkniP42Wdr4C0Dwp4XhvPI0/wDeTX2oIsbyvhshUR2AGWJ5Y9h71+cUuKuK8ZxVisry6KqUqFSkpJxSiqc6DnKUp7qXPyqKV7pv3WtV8NWyzLKGAhXrNxlNTtZ3fNGdkku3Le/5njU1tDcbfNiSXacrvUHB9q3/AA/438R+Eo5o9D1/VNGSYhpV0+8kgDkdCwRhn8axaK/od0abbbitd9N7bXPh/rNflhDndo3sruyvvbtfrbc6Kf4j+LLq4uJ5vFGszT3CCOaSTUJmaVBnCsS2SBk8H1Nc7RRUU8NRoylOlBRcrXaSTdtFfvZbGU6tSpbnk3buz//Z
// @author            aaaa__k
// @match             *://*.youku.com/*
// @match             *://*.iqiyi.com/*
// @match             *://*.iq.com/*
// @match             *://*.le.com/*
// @match             *://v.qq.com/*
// @match             *://m.v.qq.com/*
// @match             *://*.tudou.com/*
// @match             *://*.mgtv.com/*
// @match             *://tv.sohu.com/*
// @match             *://film.sohu.com/*
// @match             *://*.1905.com/*
// @match             *://*.bilibili.com/*
// @match             *://*.pptv.com/*

// @require           https://code.jquery.com/jquery-3.6.0.min.js
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_log
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/551126/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E3%80%90%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/551126/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E3%80%90%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

const util = (function () {

    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        let startTimestamp;
        return new Promise((resolve, reject) => {
            function tryFindElement(timestamp) {
                if (!startTimestamp) {
                    startTimestamp = timestamp;
                }
                const elapsedTime = timestamp - startTimestamp;

                if (elapsedTime >= 500) {
                    GM_log("⏳ 查找元素：" + targetContainer + "，第" + tryTime + "次");
                    tabContainer = body.querySelector(targetContainer);
                    if (tabContainer) {
                        resolve(tabContainer);
                    } else if (++tryTime === maxTryTime) {
                        reject();
                    } else {
                        startTimestamp = timestamp;
                    }
                }
                if (!tabContainer && tryTime < maxTryTime) {
                    requestAnimationFrame(tryFindElement);
                }
            }

            requestAnimationFrame(tryFindElement);
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
        vipBoxId: 'vip_jx_box' + Math.ceil(Math.random() * 100000000),
        flag: "flag_vip",
        autoPlayerKey: "auto_player_key" + window.location.host,
        autoPlayerVal: "auto_player_value_" + window.location.host,
        videoParseList: [
            // {"name": "综合", "type": "1,3", "url": "https://jx.jsonplayer.com/player/?url="}, // 已隐藏，不稳定
            {"name": "CK", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
            {"name": "YT", "type": "1,3", "url": "https://jx.yangtu.top/?url="},
            {"name": "Player-JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
            {"name": "yparse", "type": "1,2", "url": "https://jx.yparse.com/index.php?url="},
            {"name": "8090", "type": "1,3", "url": "https://www.8090g.cn/?url="},
            {"name": "剖元", "type": "1,3", "url": "https://www.pouyun.com/?url="},
            {"name": "虾米", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "全民", "type": "1,3", "url": "https://43.240.74.102:4433?url="},

            {"name": "爱豆", "type": "1,3", "url": "https://jx.aidouer.net/?url="},
            {"name": "夜幕", "type": "1,3", "url": "https://www.yemu.xyz/?url="},
            {"name": "m1907", "type": "1,2", "url": "https://im1907.top/?jx="},

            {"name": "M3U8TV", "type": "1,3", "url": "https://jx.m3u8.tv/jiexi/?url="},
            {"name": "冰豆", "type": "1,3", "url": "https://bd.jx.cn/?url="},
            {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
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
                displayNodes: [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec", ".at-app-banner"]
            },

            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {
                host: "m.mgtv.com",
                container: ".video-area",
                name: "Default",
                displayNodes: ["div[class^=mg-app]", ".video-area-bar", ".open-app-popup"]
            },
            {host: "www.bilibili.com", container: "#player_module,#bilibiliPlayer,#bilibili-player", name: "Default", displayNodes: []},
            {host: "m.bilibili.com", container: ".player-wrapper,.player-container,.mplayer", name: "Default", displayNodes: []},
            {host: "www.iqiyi.com", container: "#videoContent,.iqp-player,#outlayer,#flashbox", name: "Default", displayNodes: ["#playerPopup", "div[class^=qy-header-login-pop]", "section[class^=modal-cover_]" ,".toast"]},
            {
                host: "m.iqiyi.com",
                container: ".m-video-player-wrap",
                name: "Default",
                displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"]
            },
            {host: "www.iq.com", container: ".intl-video-wrap", name: "Default", displayNodes: []},
            {host: "v.youku.com", container: "#player", name: "Default", displayNodes: ["#iframaWrapper", "#checkout_counter_mask", "#checkout_counter_popup"]},
            {
                host: "m.youku.com",
                container: "#player,.h5-detail-player",
                name: "Default",
                displayNodes: [".callEnd_box", ".h5-detail-guide", ".h5-detail-vip-guide"]
            },
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
                // 对于爱奇艺，先等待播放器容器加载
                if (window.location.host === "www.iqiyi.com") {
                    GM_log("⏰ 等待爱奇艺播放器加载...");
                    setTimeout(() => {
                        util.findTargetEle('body')
                            .then((container) => this.preHandle(container))
                            .then((container) => this.generateElement(container))
                            .then((container) => this.bindEvent(container))
                            .then((container) => this.autoPlay(container))
                            .then((container) => this.postHandle(container));
                    }, 3000); // 等待3秒
                } else {
                    util.findTargetEle('body')
                        .then((container) => this.preHandle(container))
                        .then((container) => this.generateElement(container))
                        .then((container) => this.bindEvent(container))
                        .then((container) => this.autoPlay(container))
                        .then((container) => this.postHandle(container));
                }
            }
        }

        preHandle(container) {
            // 调试：输出页面上可能的播放器容器
            if (window.location.host === "www.iqiyi.com") {
                GM_log("🔍 开始查找爱奇艺播放器容器...");
                const possibleContainers = [
                    '#flashbox', '.iqp-player-wrap', '#player', '.player-container',
                    '[data-player-hook="qiyu-player"]', '.qy-player-container',
                    '#block-player', '.intl-player-container', '.qy-video-area'
                ];
                possibleContainers.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) {
                        GM_log(`✅ 找到容器：${selector}`);
                        GM_log(el);
                    }
                });
                
                // 更强大的调试：查找所有包含video标签或iframe的元素
                GM_log("🔍 查找所有video和iframe的父容器...");
                const videos = document.querySelectorAll('video');
                const iframes = document.querySelectorAll('iframe');
                
                GM_log(`📹 找到 ${videos.length} 个video标签`);
                videos.forEach((video, index) => {
                    let parent = video.parentElement;
                    let level = 0;
                    while (parent && level < 5) {
                        if (parent.id) {
                            GM_log(`  video[${index}] 的父容器[${level}]：#${parent.id}`);
                        }
                        if (parent.className && typeof parent.className === 'string') {
                            const classes = parent.className.split(' ').filter(c => c.trim());
                            if (classes.length > 0) {
                                GM_log(`  video[${index}] 的父容器[${level}]：.${classes.join('.')}`);
                            }
                        }
                        parent = parent.parentElement;
                        level++;
                    }
                });
                
                GM_log(`🖼️ 找到 ${iframes.length} 个iframe标签`);
                iframes.forEach((iframe, index) => {
                    GM_log(`  iframe[${index}] src: ${iframe.src}`);
                });
                
                // 查找所有包含'player'关键字的div
                GM_log("🔍 查找包含'player'关键字的元素...");
                const allDivs = document.querySelectorAll('div');
                allDivs.forEach(div => {
                    const id = div.id || '';
                    const className = div.className || '';
                    if (id.toLowerCase().includes('player') || 
                        (typeof className === 'string' && className.toLowerCase().includes('player'))) {
                        if (id) GM_log(`  找到player相关元素 ID: #${id}`);
                        if (typeof className === 'string' && className.trim()) {
                            const classes = className.split(' ').filter(c => c.trim() && c.toLowerCase().includes('player'));
                            if (classes.length > 0) {
                                GM_log(`  找到player相关元素 CLASS: .${classes.join('.')}`);
                            }
                        }
                    }
                });
            }
            
            // 直接查询并隐藏元素，不存在则跳过，避免大量重试
            _CONFIG_.currentPlayerNode.displayNodes.forEach((item, index) => {
                try {
                    const elements = document.querySelectorAll(item);
                    if (elements && elements.length > 0) {
                        elements.forEach(el => {
                            el.style.display = 'none';
                            GM_log(`✅ 已隐藏元素：${item}`);
                        });
                    }
                } catch (e) {
                    // 静默跳过不存在的元素
                }
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        generateElement(container) {
            GM_addStyle(`
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:9999999; text-align:left;}
                        #${_CONFIG_.vipBoxId} .img_box{width:42px; height:42px;line-height:42px;text-align:center;background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);margin:10px 0px;border-radius:8px;box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);transition: all 0.3s ease;}
                        #${_CONFIG_.vipBoxId} .img_box:hover{transform: scale(1.1);box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:10px; left:52px; top:0; text-align:center; background-color: rgba(30, 30, 46, 0.95); backdrop-filter: blur(10px); border:1px solid rgba(102, 126, 234, 0.3);padding:15px 0px; width:400px; max-height:450px; overflow-y:auto; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);}
                        #${_CONFIG_.vipBoxId} .vip_list li{border-radius:6px; font-size:13px; color:#E0E0E0; text-align:center; width:calc(25% - 12px); line-height:28px; float:left; border:1px solid rgba(102, 126, 234, 0.3); background: rgba(255, 255, 255, 0.05); padding:0 6px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;transition: all 0.3s ease;}
                        #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#fff; border:1px solid #667eea;background: rgba(102, 126, 234, 0.2);transform: translateY(-2px);box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);}
                        #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:6px; height:1px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{border-radius:3px;background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{background:rgba(255, 255, 255, 0.05);border-radius:3px;}
                        #${_CONFIG_.vipBoxId} li.selected{color:#fff; border:1px solid #667eea;background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);font-weight:bold;}
						`);

            if (_CONFIG_.isMobile) {
                GM_addStyle(`
                    #${_CONFIG_.vipBoxId} {top:300px;}
                    #${_CONFIG_.vipBoxId} .vip_list {width:300px;}
                    `);
            }

            let type_1_str = "";
            let type_2_str = "";
            let type_3_str = "";
            _CONFIG_.videoParseList.forEach((item, index) => {
                if (item.type.includes("1")) {
                    type_1_str += `<li class="nq-li" title="${item.name}1" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("2")) {
                    type_2_str += `<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("3")) {
                    type_3_str += `<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
                }
            });

            let autoPlay = !!GM_getValue(_CONFIG_.autoPlayerKey, null) ? "开" : "关";

            $(container).append(`
                <div id="${_CONFIG_.vipBoxId}">
                    <div class="vip_icon">
                        <div class="img_box" id="vip_main_btn" title="🎬 左键：选择解析源 | 右键：切换自动解析(当前：${autoPlay})" style="color:white;font-size:16px;font-weight:bold;text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            <div style="font-size:18px;">VIP</div>
                            <div style="font-size:10px;margin-top:-4px;opacity:0.8;">自动:${autoPlay}</div>
                        </div>
                        <div class="vip_list">
                            <div>
                                <h3 style="color:#667eea; font-weight: bold; font-size: 16px; padding:8px 0px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🎥 内嵌播放</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#667eea; font-weight: bold; font-size: 16px; padding:8px 0px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🚀 弹窗播放（带选集）</h3>
                                <ul>
                                    ${type_2_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#667eea; font-weight: bold; font-size: 16px; padding:8px 0px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">⚡ 弹窗播放（不带选集）</h3>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div style="text-align:left;color:#FFF;font-size:10px;padding:0px 10px;margin-top:10px;">
                                <b>自动解析功能说明：</b>
                                <br>&nbsp;&nbsp;1、自动解析功能默认关闭（自动解析只支持内嵌播放源）
                                <br>&nbsp;&nbsp;2、开启自动解析，网页打开后脚本将根据当前选中的解析源自动解析视频。如解析失败，请手动选择不同的解析源尝试
                                <br>&nbsp;&nbsp;3、没有选中解析源将随机选取一个
                                <br>&nbsp;&nbsp;4、如某些网站有会员可以关闭自动解析功能
                            </div>
                        </div>
                    </div>
                </div>`);
            return new Promise((resolve, reject) => resolve(container));
        }

        bindEvent(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            const vipMainBtn = vipBox.find("#vip_main_btn");
            const vipList = vipBox.find(".vip_list");
            let isMenuOpen = false;
            
            // 左键点击：显示/隐藏菜单
            vipMainBtn.on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                isMenuOpen = !isMenuOpen;
                
                if (isMenuOpen) {
                    vipList.show();
                    // 固定页面，防止滚动
                    $('body').css({
                        'overflow': 'hidden',
                        'position': 'relative'
                    });
                } else {
                    vipList.hide();
                    // 恢复页面滚动
                    $('body').css({
                        'overflow': '',
                        'position': ''
                    });
                }
            });
            
            // 右键点击VIP按钮：切换自动播放
            vipMainBtn.on("contextmenu", function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                    GM_setValue(_CONFIG_.autoPlayerKey, null);
                    $(this).find("div:last").html("自动:关");
                    $(this).attr("title", "🎬 左键：选择解析源 | 右键：切换自动解析(当前：关)");
                    GM_log("✅ 自动解析已关闭");
                } else {
                    GM_setValue(_CONFIG_.autoPlayerKey, "true");
                    $(this).find("div:last").html("自动:开");
                    $(this).attr("title", "🎬 左键：选择解析源 | 右键：切换自动解析(当前：开)");
                    GM_log("✅ 自动解析已开启");
                }
                
                setTimeout(function () {
                    window.location.reload();
                }, 500);
            });
            
            // 点击页面其他地方关闭菜单
            $(document).on("click", function(e) {
                if (!vipBox.is(e.target) && vipBox.has(e.target).length === 0) {
                    if (isMenuOpen) {
                        isMenuOpen = false;
                        vipList.hide();
                        $('body').css({
                            'overflow': '',
                            'position': ''
                        });
                    }
                }
            });

            let _this = this;
            vipBox.find(".vip_list .nq-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    GM_setValue(_CONFIG_.autoPlayerVal, index);
                    GM_setValue(_CONFIG_.flag, "true");
                    _this.showPlayerWindow(_CONFIG_.videoParseList[index]);
                    vipBox.find(".vip_list li").removeClass("selected");
                    $(item).addClass("selected");
                });
            });
            vipBox.find(".vip_list .tc-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    const videoObj = _CONFIG_.videoParseList[index];
                    let url = videoObj.url + window.location.href;
                    GM_openInTab(url, {active: true, insert: true, setParent: true});
                });
            });

            //右键移动位置
            vipBox.mousedown(function (e) {
                if (e.which !== 3) {
                    return;
                }
                e.preventDefault()
                vipBox.css("cursor", "move");
                const positionDiv = $(this).offset();
                let distenceX = e.pageX - positionDiv.left;
                let distenceY = e.pageY - positionDiv.top;

                $(document).mousemove(function (e) {
                    let x = e.pageX - distenceX;
                    let y = e.pageY - distenceY;
                    const windowWidth = $(window).width();
                    const windowHeight = $(window).height();

                    if (x < 0) {
                        x = 0;
                    } else if (x > windowWidth - vipBox.outerWidth(true) - 100) {
                        x = windowWidth - vipBox.outerWidth(true) - 100;
                    }

                    if (y < 0) {
                        y = 0;
                    } else if (y > windowHeight - vipBox.outerHeight(true)) {
                        y = windowHeight - vipBox.outerHeight(true);
                    }
                    vipBox.css("left", x);
                    vipBox.css("top", y);
                });
                $(document).mouseup(function () {
                    $(document).off('mousemove');
                    vipBox.css("cursor", "pointer");
                });
                $(document).contextmenu(function (e) {
                    e.preventDefault();
                })
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        autoPlay(container) {
            // 自动播放切换功能已整合到VIP主按钮的右键点击中
            // 如果开启了自动播放，执行自动解析
            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                this.selectPlayer(container);
            }
            return new Promise((resolve, reject) => resolve(container));
        }

        selectPlayer(container) {
            let index = GM_getValue(_CONFIG_.autoPlayerVal, 2);
            let autoObj = _CONFIG_.videoParseList[index];
            let _th = this;
            if (autoObj.type.includes("1")) {
                setTimeout(function () {
                    _th.showPlayerWindow(autoObj);
                    const vipBox = $(`#${_CONFIG_.vipBoxId}`);
                    vipBox.find(`.vip_list [title="${autoObj.name}1"]`).addClass("selected");
                    $(container).find("#vip_auto").attr("title", `自动解析源：${autoObj.name}`);
                }, 2500);
            }
        }

        showPlayerWindow(videoObj) {
            // 尝试直接查找容器，避免长时间等待
            const containerSelectors = _CONFIG_.currentPlayerNode.container.split(',');
            let targetContainer = null;
            
            // 先尝试直接查找
            for (let selector of containerSelectors) {
                targetContainer = document.querySelector(selector.trim());
                if (targetContainer) {
                    GM_log(`找到播放器容器：${selector.trim()}`);
                    break;
                }
            }
            
            if (targetContainer) {
                const type = videoObj.type;
                let url = videoObj.url + window.location.href;
                if (type.includes("1")) {
                    util.reomveVideo();
                    $(targetContainer).empty();
                    
                    // 隐藏爱奇艺的播放控制条、选集等元素
                    if (window.location.host === "www.iqiyi.com") {
                        const hideSelectors = [
                            '.iqp-player-controller',  // 播放控制条
                            '.qy-play-episode',        // 选集列表
                            '.video-intro',            // 视频简介
                            '.playpage-body',          // 播放页主体（选集等）
                            '[class*="episode"]',      // 包含episode的元素
                            '[class*="playlist"]',     // 播放列表
                            '.play-wrapper-side',      // 侧边栏
                        ];
                        hideSelectors.forEach(selector => {
                            try {
                                $(selector).hide();
                                GM_log(`🚫 已隐藏：${selector}`);
                            } catch (e) {}
                        });
                    }
                    
                    // 设置容器样式确保可见
                    $(targetContainer).css({
                        'width': '100%',
                        'height': '600px',
                        'min-height': '500px',
                        'position': 'relative',
                        'background': '#000'
                    });
                    
                    let iframeDivCss = "width:100%;height:100%;z-index:999999;position:absolute;top:0;left:0;";
                    if (_CONFIG_.isMobile) {
                        iframeDivCss = "width:100%;height:220px;z-index:999999;";
                    }
                    if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                        iframeDivCss = "width:100%;height:220px;z-index:999999;margin-top:-56.25%;";
                    }
                    $(targetContainer).append(`<div style="${iframeDivCss}"><iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;" allowfullscreen="true" width="100%" height="100%"></iframe></div>`);
                    GM_log(`✅已加载解析源：${videoObj.name}，URL：${url}`);
                }
            } else {
                GM_log(`⚠️直接查找失败，使用延迟查找...容器选择器：${_CONFIG_.currentPlayerNode.container}`);
                // 如果直接找不到，才使用延迟查找
                util.findTargetEle(_CONFIG_.currentPlayerNode.container)
                    .then((container) => {
                        const type = videoObj.type;
                        let url = videoObj.url + window.location.href;
                        if (type.includes("1")) {
                            util.reomveVideo();
                            $(container).empty();
                            
                            // 隐藏爱奇艺的播放控制条、选集等元素
                            if (window.location.host === "www.iqiyi.com") {
                                const hideSelectors = [
                                    '.iqp-player-controller',  // 播放控制条
                                    '.qy-play-episode',        // 选集列表
                                    '.video-intro',            // 视频简介
                                    '.playpage-body',          // 播放页主体（选集等）
                                    '[class*="episode"]',      // 包含episode的元素
                                    '[class*="playlist"]',     // 播放列表
                                    '.play-wrapper-side',      // 侧边栏
                                ];
                                hideSelectors.forEach(selector => {
                                    try {
                                        $(selector).hide();
                                        GM_log(`🚫 已隐藏：${selector}`);
                                    } catch (e) {}
                                });
                            }
                            
                            // 设置容器样式确保可见
                            $(container).css({
                                'width': '100%',
                                'height': '600px',
                                'min-height': '500px',
                                'position': 'relative',
                                'background': '#000'
                            });
                            
                            let iframeDivCss = "width:100%;height:100%;z-index:999999;position:absolute;top:0;left:0;";
                            if (_CONFIG_.isMobile) {
                                iframeDivCss = "width:100%;height:220px;z-index:999999;";
                            }
                            if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                                iframeDivCss = "width:100%;height:220px;z-index:999999;margin-top:-56.25%;";
                            }
                            $(container).append(`<div style="${iframeDivCss}"><iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;" allowfullscreen="true" width="100%" height="100%"></iframe></div>`);
                            GM_log(`✅延迟查找成功，已加载解析源：${videoObj.name}`);
                        }
                    })
                    .catch((err) => {
                        GM_log(`❌找不到播放器容器：${_CONFIG_.currentPlayerNode.container}`);
                        alert('找不到播放器容器，请刷新页面重试或联系脚本作者更新');
                    });
            }
        }

        postHandle(container) {
            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                util.urlChangeReload();
            } else {
                let oldHref = window.location.href;
                let interval = setInterval(() => {
                    let newHref = window.location.href;
                    if (oldHref !== newHref) {
                        oldHref = newHref;
                        if (!!GM_getValue(_CONFIG_.flag, null)) {
                            clearInterval(interval);
                            window.location.reload();
                        }
                    }
                }, 1000);
            }
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