// ==UserScript==
// @name                手机端视频长按倍速脚本(个人自用二改)
// @name:en             Mobile Video Long-Press Speed Script
// @description         手机端长按视频按自定义倍速播放，可在菜单中设置倍速和是否显示倍速按钮。
// @description:en      On mobile, long-press video to play at custom speed; configure rate and speed button in menu.
// @version             1.0.2
// @author              二改自用(原作者shopkeeperV)
// @match               *://*/*
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_addStyle
// @license             MIT
// @namespace https://greasyfork.org/users/1102308
// @downloadURL https://update.greasyfork.org/scripts/557845/%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%E8%84%9A%E6%9C%AC%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%E4%BA%8C%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557845/%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%E8%84%9A%E6%9C%AC%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%E4%BA%8C%E6%94%B9%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    GM_addStyle(":not(:root):fullscreen{user-select:none !important;}");

    const baseDomain = location.host.toLowerCase().split('.').slice(-2).join('.');

    let settings = {
        speed: true,
        rate: 4
    };

    for (let key in settings) {
        let value = GM_getValue(key);
        if (value == undefined) {
            GM_setValue(key, settings[key]);
        } else {
            settings[key] = value;
        }
    }

    if (window === top) {
        function registerBoolean(btnName, key) {
            GM_registerMenuCommand(btnName, () => {
                try {
                    GM_setValue(key, !settings[key]);
                    settings[key] = !settings[key];
                    alert(`成功${settings[key] ? "开启" : "关闭"}。`);
                } catch (e) {
                    alert("浏览器 bug 捕获，刷新页面后重试。\n" + e.message);
                }
            });
        }

        function registerInput(btnName, description, key, integer, minimum, maximum) {
            GM_registerMenuCommand(btnName, () => {
                let input = window.prompt(description, settings[key]);
                if (input === null) return;
                input = Number(input);
                if (input && input > minimum && input <= maximum) {
                    if (integer && !Number.isInteger(input)) {
                        alert("要求整数！");
                        return;
                    }
                    try {
                        GM_setValue(key, input);
                        settings[key] = input;
                    } catch (e) {
                        alert("浏览器 bug 捕获，刷新页面后重试。\n" + e.message);
                    }
                } else {
                    alert("输入错误！");
                }
            });
        }

        registerBoolean("开关【展示播放速度调整按钮】", "speed");
        registerInput("修改长按倍速数值", "请指定需要的倍率，输入 0-6 的数字即可，可以是小数。", "rate", false, 0, 6);
    }

    let listenTarget = document;
    listen();

    function listen() {
        listenTarget.addEventListener("touchstart", (e) => {
            if (e.touches.length !== 1) return;

            let screenX = e.touches[0].screenX;
            let screenY = e.touches[0].screenY;

            if (document.fullscreenElement) {
                if (screenX < screen.width * 0.05 || screenX > screen.width * 0.95 ||
                    screenY < screen.height * 0.05 || screenY > screen.height * 0.95) {
                    return;
                }
            }

            const startClientX = Math.ceil(e.touches[0].clientX);
            const startScreenY = Math.ceil(screenY);

            let videoElement;
            let target = e.target;

            let others = [{domain: "avbebe.com", selector: ".fp-ui"}];
            for (let other of others) {
                if (baseDomain === other.domain) {
                    let _target = document.querySelector(other.selector);
                    if (!_target) break;
                    if (target !== _target && !_target.contains(target)) {
                        return;
                    }
                    if (target.clientWidth < _target.clientWidth * 0.3 ||
                        target.clientHeight < _target.clientHeight * 0.4) {
                        return;
                    }
                    target = _target;
                    break;
                }
            }

            let biggestContainer;
            let targetWidth = target.clientWidth;
            let targetHeight = target.clientHeight;
            let suitParents = [];
            let allParents = [];
            let temp = target;
            let maybeTiktok = false;

            while (true) {
                temp = temp.parentElement;
                if (!temp) {
                    return;
                }
                allParents.push(temp);
                if (temp.clientWidth > 0 &&
                    temp.clientWidth < targetWidth * 1.2 &&
                    temp.clientHeight > 0 &&
                    temp.clientHeight < targetHeight * 1.2) {
                    suitParents.push(temp);
                }
                if (temp.tagName === "BODY" ||
                    temp.tagName === "HTML" ||
                    !temp.parentElement) {
                    if (suitParents.length > 0) {
                        biggestContainer = suitParents[suitParents.length - 1];
                    } else if (target.tagName !== "VIDEO") {
                        return;
                    }
                    suitParents = null;
                    break;
                }
            }

            if (target.tagName !== "VIDEO") {
                let videoArray = biggestContainer.getElementsByTagName("video");
                if (videoArray.length > 0) {
                    if (videoArray.length > 1) {
                        for (let video of videoArray) {
                            if (video.paused === false) {
                                videoElement = video;
                            }
                        }
                        if (!videoElement) {
                            console.log("触摸位置找到不止一个视频，而且没有正在播放的，无法判断需要操作哪一个。");
                            return;
                        }
                    } else {
                        videoElement = videoArray[0];
                    }
                } else {
                    return;
                }
            } else {
                videoElement = target;
            }

            if (!document.fullscreenElement &&
                top === window &&
                !videoElement.controls &&
                target.clientHeight > window.innerHeight * 0.8 &&
                target.clientWidth > window.innerWidth * 0.8) {
                maybeTiktok = true;
            }

            if (!maybeTiktok && targetHeight > videoElement.clientHeight * 1.5) {
                return;
            }

            let playing = !videoElement.paused;
            let haveControls = videoElement.controls;

            let componentContainer = findComponentContainer();
            if (!componentContainer) return;

            makeTagAQuiet();

            if (!videoElement.getAttribute("disable_contextmenu")) {
                videoElement.addEventListener("contextmenu", (ev) => {
                    ev.preventDefault();
                });
                videoElement.setAttribute("disable_contextmenu", "true");
            }

            if (target.tagName === "IMG") {
                target.draggable = false;
                if (!target.getAttribute("disable_contextmenu")) {
                    target.addEventListener("contextmenu", (ev) => {
                        ev.preventDefault();
                    });
                    target.setAttribute("disable_contextmenu", "true");
                }
            }

            let sharedCSS = "border-radius:4px;z-index:99999;opacity:0.5;background-color:black;color:white;" +
                "display:flex;justify-content:center;align-items:center;text-align:center;user-select:none;";

            let longPress = false;
            let rateTimerBack;

            let notice;
            let screenWidth = screen.width;
            let componentMoveLeft = componentContainer.offsetLeft;
            let moveNum = Math.floor(componentMoveLeft * 1.1 / screenWidth);

            notice = componentContainer.querySelector(`:scope>.me-notice`);
            if (!notice) {
                notice = document.createElement("div");
                notice.className = "me-notice";
                let noticeWidth = 110;
                let noticeTop = Math.round(componentContainer.clientHeight / 8 - 20);
                let noticeLeft = Math.round(moveNum * screenWidth + componentContainer.clientWidth / 2 - noticeWidth / 2);
                notice.style.cssText = sharedCSS + "font-size:16px;position:absolute;display:none;letter-spacing:normal;";
                notice.style.width = noticeWidth + "px";
                notice.style.height = "30px";
                notice.style.left = noticeLeft + "px";
                notice.style.top = noticeTop + "px";
                componentContainer.appendChild(notice);
                window.addEventListener("resize", () => {
                    notice.remove();
                }, {once: true});
            }

            let rateTimer = setTimeout(() => {
                if (playing && videoElement.paused) {
                    videoElement.play();
                }
                rateTimerBack = setTimeout(() => {
                    if (videoElement.playbackRate === 1) {
                        videoElement.playbackRate = settings.rate;
                    }
                }, 500);

                videoElement.playbackRate = settings.rate;
                videoElement.controls = false;
                longPress = true;
                rateTimer = null;

                notice.innerText = "x" + settings.rate;
                notice.style.display = "flex";

                function showSpeedMenu(event) {
                    event.stopPropagation();
                    speedBtn.style.display = "none";
                    let container = componentContainer.querySelector(`:scope>.me-speed-container`);
                    if (container) {
                        container.style.display = "flex";
                    } else {
                        container = document.createElement("div");
                        container.className = "me-speed-container";
                        componentContainer.appendChild(container);
                        let css;
                        if (videoElement.videoHeight > videoElement.videoWidth) {
                            css = `flex-direction:column;top:0;bottom:0;left:${(window.innerWidth * 2) / 3 + 40}px`;
                        } else {
                            css = `flex-direction:row;left:0;right:0;top:${(window.innerHeight / 3) - 30}px`;
                        }
                        container.style.cssText = "display:flex;position:absolute;flex-wrap:nowrap;z-index:99999;justify-content:center;" + css;
                        const values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5, 6];
                        values.forEach(value => {
                            const button = document.createElement('div');
                            container.appendChild(button);
                            button.className = 'button';
                            button.textContent = value + "";
                            button.style.cssText = sharedCSS + "width:40px;height:30px;margin:2px;font-size:18px;";
                            button.addEventListener('touchstart', (ev) => {
                                ev.stopPropagation();
                                container.style.display = "none";
                                videoElement.playbackRate = value;
                                setTimeout(() => {
                                    if (videoElement.playbackRate === 1) {
                                        videoElement.playbackRate = value;
                                    }
                                }, 500);
                            });
                        });
                    }
                    componentContainer.addEventListener("touchstart", () => {
                        container.style.display = "none";
                    }, {capture: true, once: true});
                    window.addEventListener("resize", () => {
                        container.style.display = "none";
                    }, {once: true});
                }
            }, 800);

            function touchmoveHandler(moveEvent) {
                if (!rateTimer) return;
                if (moveEvent.touches.length !== 1) return;
                const touch = moveEvent.touches[0];
                const dx = Math.ceil(touch.clientX) - startClientX;
                const dy = Math.ceil(touch.screenY) - startScreenY;
                if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                    clearTimeout(rateTimer);
                    rateTimer = null;
                }
            }

            function touchendHandler() {
                if (notice) notice.style.display = "none";

                if (rateTimer) {
                    clearTimeout(rateTimer);
                    rateTimer = null;
                }
                if (rateTimerBack) {
                    clearTimeout(rateTimerBack);
                    rateTimerBack = null;
                }
                if (longPress) {
                    videoElement.controls = haveControls;
                    videoElement.playbackRate = 1;
                }
                target.removeEventListener("touchmove", touchmoveHandler);
            }

            target.addEventListener("touchmove", touchmoveHandler, {passive: true});
            target.addEventListener("touchend", touchendHandler, {once: true});

            function makeTagAQuiet() {
                for (let element of allParents) {
                    if (element.tagName === "A" &&
                        !element.getAttribute("disable_menu_and_drag")) {
                        element.addEventListener("contextmenu", (ev) => {
                            ev.preventDefault();
                        });
                        element.draggable = false;
                        element.setAttribute("disable_menu_and_drag", "true");
                        element.target = "_blank";
                        break;
                    }
                }
                allParents = null;
            }

            function findComponentContainer() {
                let others = [{domain: "spankbang.com", selector: ".vjs-controls-container"}];
                for (let other of others) {
                    if (baseDomain === other.domain) {
                        let ctrl = document.querySelector(other.selector);
                        if (!ctrl) break;
                        return findCommonAncestorWithSize(ctrl, videoElement);
                    }
                }

                if (target.tagName === "VIDEO") {
                    let tmp = videoElement;
                    while (tmp.parentElement) {
                        if (tmp.parentElement.clientWidth > 0 &&
                            tmp.parentElement.clientHeight > 0) {
                            return tmp.parentElement;
                        } else {
                            tmp = tmp.parentElement;
                        }
                    }
                } else {
                    if (window.getComputedStyle(target).opacity === "0") {
                        target.style.visibility = "hidden";
                        target.style.opacity = "1";
                    }
                    return target;
                }
                return null;

                function findCommonAncestorWithSize(element1, element2) {
                    function getAncestors(el) {
                        const ancestors = [];
                        let currentEl = el;
                        while (currentEl) {
                            ancestors.push(currentEl);
                            currentEl = currentEl.parentElement;
                        }
                        return ancestors;
                    }

                    const ancestors1 = getAncestors(element1);
                    const ancestors2 = getAncestors(element2);
                    for (let i = 0; i < ancestors1.length; i++) {
                        for (let j = 0; j < ancestors2.length; j++) {
                            if (ancestors1[i] === ancestors2[j]) {
                                if (ancestors1[i].clientWidth > 0 && ancestors1[i].clientHeight > 0) {
                                    return ancestors1[i];
                                }
                            }
                        }
                    }
                    return null;
                }
            }
        }, {capture: true});
    }
})();