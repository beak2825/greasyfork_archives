// ==UserScript==
// @name              Bilibili Video Player Enhancer Tools
// @name:zh           哔哩哔哩视频播放器增强工具
// @name:zh-CN        哔哩哔哩视频播放器增强工具
// @name:en           Bilibili Video Player Enhancer Tools
// @name:en-US        Bilibili Video Player Enhancer Tools
// @description       Adds more speed buttons and more settings to and Bilibili video players.
// @description:en    Adds more speed buttons and more settings to and Bilibili video players.
// @description:en-US Adds more speed buttons and more settings to and Bilibili video players.
// @description:zh    哔哩哔哩视频播放器下添加更多倍速播放按钮及更多配置。
// @description:zh-CN 哔哩哔哩视频播放器下添加更多倍速播放按钮及更多配置。
// @namespace         com.zlmix.tampermonkey.BiliVideoPlayerEnhancerTools
// @version           0.1.2
// @author            zilong@zlmix.com

// @match             *://*.bilibili.com*
// @include           *://*.bilibili.com*

// @grant             GM_addStyle
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @icon              https://www.bilibili.com/favicon.ico?v=1
// @charset		      UTF-8

// @require https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=

// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/558922/Bilibili%20Video%20Player%20Enhancer%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/558922/Bilibili%20Video%20Player%20Enhancer%20Tools.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const i18nConfig = {
        // 中文配置
        zh: {
            menu_settings: "设置面板",
            menu_save: "保存",
            menu_close: "关闭",

            Youtube_AutoTheaterMode: "Youtube - 自动视频网页全屏",
            Youtube_AutoRate: "Youtube - 自动倍速播放",
            Youtube_AutoRemoveMiniplayer: "Youtube - 自动移除MiniPlayer按钮",

            Bilibili_AutoWebFullscreen: "Bilibili - 自动视频网页全屏",
            Bilibili_AutoRate: "Bilibili - 自动倍速播放",
            Bilibili_AutoRemovePip: "Bilibili - 自动移除画中画按钮",
            Bilibili_AutoRemoveWide: "Bilibili - 自动移除宽屏按钮",
            Bilibili_AutoRemoveSpeed: "Bilibili - 自动移除原始倍速按钮",
            Bilibili_AutoRemoveComments: "Bilibili - 自动移除评论输入区",
            Bilibili_AutoRemoveSettings: "Bilibili - 自动移除设置按钮",
            Shortcut_Title: "快捷键:",
            Shortcut_Items: [
                "《 键减速",
                " 》键加速"
            ],
        },
        // 英文配置
        en: {
            menu_settings: "Settings Panel",
            menu_save: "Save",
            menu_close: "Close",

            Youtube_AutoTheaterMode: "Youtube - Auto Theater Mode",
            Youtube_AutoRate: "Youtube - Auto Playback",
            Youtube_AutoRemoveMiniplayer: "Youtube - Auto Remove MiniPlayer Button",

            Bilibili_AutoWebFullscreen: "Bilibili - Auto Web Fullscreen",
            Bilibili_AutoRate: "Bilibili - Auto Playback",
            Bilibili_AutoRemovePip: "Bilibili - Auto Remove Picture-in-Picture Button",
            Bilibili_AutoRemoveWide: "Bilibili - Auto Remove Wide Button",
            Bilibili_AutoRemoveSpeed: "Bilibili - Auto Remove Original Speed Button",
            Bilibili_AutoRemoveComments: "Bilibili - Auto Remove Comments Input Area",
            Bilibili_AutoRemoveSettings: "Bilibili - Auto Remove Settings Button",
            Shortcut_Title: "Shortcut:",
            Shortcut_Items: [
                "《 key to decrease speed",
                " 》 key to increase speed"
            ],
        }
    };

    const settingPanelStyles = `
        #minimalSettingsPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 99999;
            font-family: sans-serif;
            display: none;
        }
        #minimalSettingsPanel.show {
            display: block;
        }
        #minimalSettingsPanel h2 {
            margin: 0 0 10px;
            font-size: 1.1em;
            text-align: center;
        }
        #minimalSettingsPanel .setting-item {
            margin-bottom: 10px;
        }
        #minimalSettingsPanel .setting-item input[type="text"] {
            width: 40px;
            margin-left: 8px;
            padding: 2px 4px;
            border: 1px solid #ccc;
        }
        #minimalSettingsPanel .buttons {
            margin-top: 15px;
            text-align: right;
        }
        #minimalSettingsPanel button {
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            background-color: #eee;
            border-radius: 3px;
        }
        .speed-control-button.active {
            border: 2px solid #007bff !important;
        }`;

    let youtubeLiveStreamCheck = null;

    const Common = {
        speeds: ['0.5', '0.75', '1.0', '1.25', '1.5', '1.75', '2.0', '2.5', '3.0'],
        defaultSpeed: '2.0',
        colors: ['#072525', '#287F54', '#C22544'],
        currentLang: 'en',
        settingPanelItems: [],
        settingPanelInitialized: false,
        settingPanelElement: null,
        speedIndicatorElement: null,
        speedIndicatorTimer: null,
        detectLanguage: function () {
            let userLang = navigator.language.toLowerCase();
            if (userLang.startsWith('zh')) {
                return 'zh';
            }
            if (userLang.startsWith('en')) {
                return 'en';
            }
            return 'en';
        },
        geti18nText: function (key) {
            return i18nConfig[Common.currentLang][key];
        },
        initializePanel: function () {
            let panel = document.createElement("div");
            panel.id = "minimalSettingsPanel";
            let title = document.createElement("h2");
            title.textContent = Common.geti18nText("menu_settings");
            panel.appendChild(title);
            for (const [key, item] of Object.entries(Common.settingPanelItems)) {
                let functionDiv = document.createElement("div");
                functionDiv.className = "setting-item";
                panel.appendChild(functionDiv);
                let functionValue = GM_getValue(item.dataKey, false);
                let input1 = document.createElement("input");
                input1.type = "checkbox";
                input1.checked = functionValue;
                input1.id = item.classId;
                functionDiv.appendChild(input1);
                let label1 = document.createElement("label");
                label1.setAttribute("for", item.classId);
                label1.textContent = item.text;
                functionDiv.appendChild(label1);
                if (item.valueKey) {
                    let select = document.createElement("select");
                    select.id = item.classId + "-value";
                    select.style.marginLeft = "8px";
                    Common.speeds.forEach(speed => {
                        let option = document.createElement("option");
                        option.value = speed;
                        option.textContent = speed + 'x';
                        select.appendChild(option);
                    });
                    select.value = GM_getValue(item.valueKey, Common.defaultSpeed);
                    functionDiv.appendChild(select);
                }
            }

            // shortcut
            const shortcutContainer = document.createElement("div");
            shortcutContainer.style.marginTop = "15px";
            shortcutContainer.style.fontSize = "1.0em";
            shortcutContainer.style.color = "#666";
            shortcutContainer.style.fontWeight = "bold";
            shortcutContainer.style.display = "flex";
            shortcutContainer.style.flexDirection = "column";
            shortcutContainer.style.alignItems = "center";
            const shortcutTitleText = Common.geti18nText("Shortcut_Title");
            const titleElement = document.createElement("div");
            titleElement.textContent = shortcutTitleText;
            shortcutContainer.appendChild(titleElement);
            const shortcutItems = Common.geti18nText("Shortcut_Items");
            shortcutItems.forEach(itemText => {
                const line = document.createElement("div");
                line.textContent = itemText;
                shortcutContainer.appendChild(line);
            });
            panel.appendChild(shortcutContainer);

            let buttons = document.createElement("div");
            buttons.className = "buttons";
            let saveBtn = document.createElement("button");
            saveBtn.id = "saveBtn";
            saveBtn.textContent = Common.geti18nText("menu_save");
            saveBtn.addEventListener("click", () => {
                Common.saveSettings();
            });
            let closeBtn = document.createElement("button");
            closeBtn.id = "closeBtn";
            closeBtn.textContent = Common.geti18nText("menu_close");
            closeBtn.addEventListener("click", () => {
                Common.togglePanel();
            });
            buttons.appendChild(saveBtn);
            buttons.appendChild(closeBtn);
            panel.appendChild(buttons);
            document.body.appendChild(panel);
            Common.settingPanelElement = panel;
            Common.settingPanelInitialized = true;
        },
        saveSettings: function () {
            for (const [key, item] of Object.entries(Common.settingPanelItems)) {
                const isChecked = document.getElementById(item.classId).checked;
                GM_setValue(item.dataKey, isChecked);
                if (item.valueKey) {
                    const value = document.getElementById(item.classId + "-value").value;
                    GM_setValue(item.valueKey, value);
                }
            }
            Common.settingPanelElement.classList.toggle('show');
        },
        togglePanel: function () {
            if (!Common.settingPanelInitialized) {
                Common.initializePanel();
            }
            Common.settingPanelElement.classList.toggle('show');
        },
        initSettingItems: function (currentUrl) {
            if (currentUrl.includes("youtube.com")) {
                Common.settingPanelItems = {
                    // Youtube_AutoTheaterMode: {
                    //     classId: "Youtube-AutoTheaterMode",
                    //     text: geti18nText("Youtube_AutoTheaterMode"),
                    //     dataKey: "Youtube-AutoTheaterMode",
                    // },
                    Youtube_AutoRate: {
                        classId: "Youtube-AutoRate",
                        text: Common.geti18nText("Youtube_AutoRate"),
                        dataKey: "Youtube-AutoRate-Enabled",
                        valueKey: "Youtube-AutoRate-Value",
                    },
                    Youtube_AutoRemoveMiniplayer: {
                        classId: "Youtube-AutoRemoveMiniplayer",
                        text: Common.geti18nText("Youtube_AutoRemoveMiniplayer"),
                        dataKey: "Youtube-AutoRemoveMiniplayer",
                    },
                };
            } else if (currentUrl.includes("bilibili.com")) {
                Common.settingPanelItems = {
                    Bilibili_AutoWebFullscreen: {
                        classId: "Bilibili-AutoWebFullscreen",
                        text: Common.geti18nText("Bilibili_AutoWebFullscreen"),
                        dataKey: "Bilibili-AutoWebFullscreen",
                    },
                    Bilibili_AutoRate: {
                        classId: "Bilibili-AutoRate",
                        text: Common.geti18nText("Bilibili_AutoRate"),
                        dataKey: "Bilibili-AutoRate-Enabled",
                        valueKey: "Bilibili-AutoRate-Value",
                    },
                    Bilibili_AutoRemovePip: {
                        classId: "Bilibili-AutoRemovePip",
                        text: Common.geti18nText("Bilibili_AutoRemovePip"),
                        dataKey: "Bilibili-AutoRemovePip",
                    },
                    Bilibili_AutoRemoveWide: {
                        classId: "Bilibili-AutoRemoveWide",
                        text: Common.geti18nText("Bilibili_AutoRemoveWide"),
                        dataKey: "Bilibili-AutoRemoveWide",
                    },
                    Bilibili_AutoRemoveSpeed: {
                        classId: "Bilibili-AutoRemoveSpeed",
                        text: Common.geti18nText("Bilibili_AutoRemoveSpeed"),
                        dataKey: "Bilibili-AutoRemoveSpeed",
                    },
                    Bilibili_AutoRemoveComments: {
                        classId: "Bilibili-AutoRemoveComments",
                        text: Common.geti18nText("Bilibili_AutoRemoveComments"),
                        dataKey: "Bilibili-AutoRemoveComments",
                    },
                    Bilibili_AutoRemoveSettings: {
                        classId: "Bilibili-AutoRemoveSettings",
                        text: Common.geti18nText("Bilibili_AutoRemoveSettings"),
                        dataKey: "Bilibili-AutoRemoveSettings",
                    },
                };
            };
        },
        createSpeedButtons: function (panelCallback, btnClickCallback) {
            if (document.querySelector('#speedButtons')) {
                return;
            }
            let bgColor = Common.colors[0];
            let speedListDiv = document.createElement('div');
            speedListDiv.id = 'speedButtons';
            speedListDiv.style.display = 'flex';
            speedListDiv.style.alignItems = 'center';
            speedListDiv.style.justifyContent = 'center';
            speedListDiv.style.height = '100%';
            const handleButtonClick = (speed) => {
                Common.setPlaybackRate(speed);
            };
            for (let i = 0; i < Common.speeds.length; i++) {
                const speedValue = parseFloat(Common.speeds[i]);
                if (speedValue >= 1) { bgColor = Common.colors[1]; }
                if (speedValue >= 1.5) { bgColor = Common.colors[2]; }
                let btn = document.createElement('button');
                btn.style.backgroundColor = bgColor;
                btn.style.marginRight = '1px';
                btn.style.border = '1px solid #D3D3D3';
                btn.style.borderRadius = '2px';
                btn.style.color = '#ffffff';
                btn.style.cursor = 'pointer';
                btn.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
                btn.style.display = 'flex';
                btn.style.justifyContent = 'center';
                btn.style.alignItems = 'center';
                btn.style.width = '38px';
                btn.style.height = '24px';
                btn.style.fontSize = '14px';
                btn.textContent = Common.speeds[i] + '×';
                btn.className = 'speed-control-button';
                btn.dataset.speed = Common.speeds[i];
                btn.addEventListener('click', () => {
                    btnClickCallback ? btnClickCallback(Common.speeds[i]) : handleButtonClick(Common.speeds[i]);
                });
                speedListDiv.appendChild(btn);
            }
            // by zl
            // panelCallback(speedListDiv);
        },
        removeSelector: function (selector) {
            let ele = document.querySelector(selector);
            if (ele) {
                ele.remove();
        }
        },
        setPlaybackRate: function (rate) {
            const video = document.getElementsByTagName('video')[0];
            if (video) {
                video.playbackRate = parseFloat(rate);
                Common.updateSpeedButtonHighlight(rate);
                Common.showSpeedIndicator(rate);
            }
        },
        showSpeedIndicator: function (rate) {
            if (Common.speedIndicatorTimer) {
                clearTimeout(Common.speedIndicatorTimer);
            }
            if (!Common.speedIndicatorElement) {
                const indicator = document.createElement('div');
                indicator.style.position = 'fixed';
                indicator.style.top = '50%';
                indicator.style.left = '50%';
                indicator.style.transform = 'translate(-50%, -50%)';
                indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                indicator.style.color = 'white';
                indicator.style.padding = '10px 20px';
                indicator.style.borderRadius = '8px';
                indicator.style.fontSize = '24px';
                indicator.style.fontWeight = 'bold';
                indicator.style.zIndex = '2147483647';
                indicator.style.pointerEvents = 'none';
                indicator.style.transition = 'opacity 0.3s ease-out';
                indicator.style.opacity = '0';
                document.body.appendChild(indicator);
                Common.speedIndicatorElement = indicator;
            }
            Common.speedIndicatorElement.textContent = `${rate}x`;
            Common.speedIndicatorElement.style.opacity = '1';
            Common.speedIndicatorTimer = setTimeout(() => {
                Common.speedIndicatorElement.style.opacity = '0';
            }, 500);
        },
        updateSpeedButtonHighlight: function (rate) {
            const buttons = document.querySelectorAll('.speed-control-button');
            buttons.forEach(button => button.classList.remove('active'));
            const activeButton = document.querySelector(`.speed-control-button[data-speed="${rate}"]`);
            if (activeButton) activeButton.classList.add('active');
        },
        handleKeydown: function (event) {
            const target = event.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }
            const video = document.getElementsByTagName('video')[0];
            if (!video) {
                return;
            }
            const currentRate = video.playbackRate;
            let currentIndex = Common.speeds.findIndex(speed => parseFloat(speed) === currentRate);
            if (currentIndex === -1) {
                const closest = Common.speeds.reduce((prev, curr) => {
                    return (Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev);
                });
                currentIndex = Common.speeds.indexOf(closest);
            }
            let newIndex = currentIndex;

            //console.log('code is: ', event.code);
            if (event.code === 'Comma') {
                if (currentIndex > 0) {
                    newIndex = currentIndex - 1;
                }
            } else if (event.code === 'Period') {
                if (currentIndex < Common.speeds.length - 1) {
                    newIndex = currentIndex + 1;
                }
            } else if (event.code === 'KeyT') {
                //console.log('T');
                //this.wideScreenToggel();
                setTimeout(() => {
                    Common.wideScreenToggel();
                    console.log("按键设置宽屏");
                }, 100);
            } else {
                return;
            }
            Common.setPlaybackRate(Common.speeds[newIndex]);
        },
        wideScreenToggel: function() {
            var pageType = 0;
            switch (pageType) {
                case 0:
                case 1:
                    document.querySelector(".bpx-player-ctrl-wide").click();
                    break;
                case 2:
                    document.querySelector(".squirtle-widescreen-wrap").children[0].click();
                    break;
                case 3:
                    var video = document.querySelector("video");
                    imitataMouseMove(video, 0, 0);
                    document.querySelectorAll(LIVE_TOOLS_RIGHT)[1].click()
                    break;
            }
        }
    };
    const WebSite = {
        data: {
            youtubeLiveStreamStatus: false,
        },
        selectors: {
            youtube: {
                // YouTube selectors listeners
                videoPanel: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls',
                liveStreamIcon: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button', // Youtube Live Stream check
                miniPlayerBtn: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-miniplayer-button.ytp-button',
                finishListener: 'yt-navigate-finish',
                liveStreamClass: 'ytp-live-badge-is-livehead',
            },
            bilibili: {
                /// Bilibili selectors
                playerContainer: '#bilibili-player',
                webFullClass: 'mode-webscreen',
                speedBtn: '.bpx-player-control-bottom-left',
                videoPanel: '.bilibili-player, .bpx-player-container, #bilibiliPlayer',
                commentsPanel: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-center',
                webFullBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web',
                pipBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-pip',
                wideBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-wide',
                speedsListBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate',
                settingsBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-setting',
            }
        },
        youtube: function () {
            if (window.location.href.includes("youtube.com/watch")) {
                const handleYoutubePage = async () => {
                    console.log('执行Youtube页面脚本handler');
                    try {
                        let videopanel = await elmGetter.get(WebSite.selectors.youtube.videoPanel);
                        console.log('添加更多倍速按钮');
                        Common.createSpeedButtons((moreSpeedsDiv) => {
                            videopanel.before(moreSpeedsDiv);
                        }, (speed) => {
                            Common.setPlaybackRate(speed);
                            WebSite.data.youtubeLiveStreamStatus = false;
                        });
                    } catch (error) {
                        console.error('Failed create speed button elements:', error);
                    }

                    try {
                        const removalConfigs = {
                            Youtube_AutoRemoveMiniplayer: WebSite.selectors.youtube.miniPlayerBtn,
                        };
                        for (const key in removalConfigs) {
                            if (GM_getValue(Common.settingPanelItems[key].dataKey, false)) {
                                elmGetter.get(removalConfigs[key]).then(item => {
                                    console.log('移除按钮:', removalConfigs[key]);
                                    item.remove();
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Failed autoremove buttons:', error);
                    }

                    if (GM_getValue(Common.settingPanelItems.Youtube_AutoRate.dataKey, false)) {
                        const rate = parseFloat(GM_getValue(Common.settingPanelItems.Youtube_AutoRate.valueKey, Common.defaultSpeed));
                        console.log(`设置 ${rate} 倍速播放`);
                        Common.setPlaybackRate(rate);
                        WebSite.data.youtubeLiveStreamStatus = false;
                    }
                };

                // 启动直播状态检测
                youtubeLiveStreamCheck = setInterval(() => {
                    let element = document.querySelector(WebSite.selectors.youtube.liveStreamIcon);
                    if (element) {
                        if (element.classList.contains(WebSite.selectors.youtube.liveStreamClass) && !WebSite.data.youtubeLiveStreamStatus && window.location.href.includes("youtube.com/watch")) {
                            Common.setPlaybackRate(1.0);
                            console.log('已检测到直播，重置播放速度为1.0');
                            WebSite.data.youtubeLiveStreamStatus = true;
                        }
                    }
                }, 1000);

                handleYoutubePage();
            }
        },
        bilibili: function () {
            const handleBilibiliPage = async () => {
                try {
                    await elmGetter.get(WebSite.selectors.bilibili.videoPanel);
                    Common.createSpeedButtons((moreSpeedsDiv) => {
                        let ele = document.querySelector(WebSite.selectors.bilibili.speedBtn);
                        if (ele) {
                            ele.after(moreSpeedsDiv);
                        }
                    });
                } catch (error) {
                    console.error('Failed create speed button elements:', error);
                }

                try {
                    const removalConfigs = {
                        Bilibili_AutoRemoveComments: WebSite.selectors.bilibili.commentsPanel,
                        Bilibili_AutoRemovePip: WebSite.selectors.bilibili.pipBtn,
                        Bilibili_AutoRemoveWide: WebSite.selectors.bilibili.wideBtn,
                        Bilibili_AutoRemoveSpeed: WebSite.selectors.bilibili.speedsListBtn,
                        Bilibili_AutoRemoveSettings: WebSite.selectors.bilibili.settingsBtn,
                    };
                    for (const key in removalConfigs) {
                        if (GM_getValue(Common.settingPanelItems[key].dataKey, false)) {
                            elmGetter.get(removalConfigs[key]).then(item => {
                                item.remove();
                            });
                        }
                    }
                } catch (error) {
                    console.error('Failed autoremove buttons:', error);
                }

                try {
                    if (GM_getValue(Common.settingPanelItems.Bilibili_AutoWebFullscreen.dataKey, false)) {
                        elmGetter.get(WebSite.selectors.bilibili.playerContainer).then(playItem => {
                            if (playItem.classList.contains(WebSite.selectors.bilibili.webFullClass)) {
                                return;
                            }
                            elmGetter.get(WebSite.selectors.bilibili.webFullBtn).then(item => {
                                item.click();
                            });
                        });
                    }
                } catch (error) {
                    console.error('Failed webfull or auto rate:', error);
                }

                if (GM_getValue(Common.settingPanelItems.Bilibili_AutoRate.dataKey, false)) {
                    const rate = parseFloat(GM_getValue(Common.settingPanelItems.Bilibili_AutoRate.valueKey, Common.defaultSpeed));
                    Common.setPlaybackRate(rate);
                }

            };

            if (window.location.href.includes("bilibili.com/video")) {
                handleBilibiliPage();
            }
        }
    }

    function main() {
        // 每次页面加载时，都先清理所有可能存在的定时器
        if (youtubeLiveStreamCheck !== null) {
            clearInterval(youtubeLiveStreamCheck);
            youtubeLiveStreamCheck = null;
        }
        Common.currentLang = Common.detectLanguage();
        Common.initSettingItems(window.location.href);
        GM_addStyle(settingPanelStyles);
        GM_registerMenuCommand(Common.geti18nText("menu_settings"), Common.togglePanel);
        document.addEventListener('keydown', Common.handleKeydown);

        setTimeout(() => {
            Common.wideScreenToggel();
            console.log("自动设置宽屏");
        }, 3000);

        // 首次加载时执行
        if (window.location.href.includes("youtube.com/watch")) {
            console.log('首次执行Youtube脚本');
            WebSite.youtube();
        } else if (window.location.href.includes("bilibili.com/video")) {
            console.log('首次执行Bilibili脚本');
            WebSite.bilibili();
        }

        if (window.location.href.includes("youtube.com")) {
            console.log('注册Youtube监听器');
            window.addEventListener(WebSite.selectors.youtube.finishListener, WebSite.youtube);
        }
    }
    main();

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        // 这个监听器只为Bilibili的URL变化服务，以解决自动连播问题。
        // YouTube有自己的 'yt-navigate-finish' 事件监听器，不受此影响。
        if (url !== lastUrl && url.includes("bilibili.com/video")) {
            lastUrl = url;
            console.log(`Bilibili URL changed to: ${url}. Re-running main logic.`);
            main();
        }
    }).observe(document, { subtree: true, childList: true });
})();
