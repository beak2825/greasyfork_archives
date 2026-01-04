// ==UserScript==
// @name         DeepFlood X
// @namespace    http://www.deepflood.com/
// @version      0.4.1.2
// @description  【原DeepFlood增强】自动签到、无缝翻页帖子评论、快捷回复、代码高亮、屏蔽用户、屏蔽帖子、楼主低等级提醒
// @author       dabao
// @match        *://*.deepflood.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACz0lEQVR4Ae3B32tVdQAA8M85u7aVHObmzJVD0+ssiphstLEM62CBlCBEIAYhUoGGD/kiRUo+9CIEElFZgZJFSApBVhCUX2WFrVQKf5Qy26SgdK4pN7eZu+cbtyfJ/gLx83HD9SAhlEyXupiPhUSTeonRfNw1ws2aRJeN5jHcolFhJJ9M8Zj99piDTnv12SjzfzIb9dmrC7Pttt8ykjDVLsu8ZZ1GH1oqeDofJLtJh4fMEw3Y72jlCuEO2+W+sNJFr3vOZ1YIi8NIGA29hDWhGgZDJ2Rt2ZvZSBazmMUsZsPZ1qwVQmcYDNWwhtAbRsNIWJx6WLPDfgxNVkm9nR8hm+XduLba7F9RtcXztmUzyY/YJrUqNPvBYc0eSS3CwXxMl4WG7CarsyEuvU2HOkRNujSw3PosxR6DFurKxx3E/akFohPo0aDfEO61os5LdrtLVWG1TzxokifdiSH9GnTjuGhBqsWE39GOo3kVi8wsmeVW00SJ200zA9r0kFcdQzv+MKElVW/S+L5EE86pmUth3BV/SzCOCUjMVXMWzfsSYybVl1SlSlESkagpuOI1nzshFX1gyAF1UKhJEKOkJFVNXVBv+pJoBK1qBkh86z1/SaR+9o5zEgoDaloxsiSart6F1Bkl83ESHWEKvvEbqZJETaokgSH9hCk6cBLtSs6kDqEb/cZ0K+MnO0X/VdhRGUBZjzH9uA+HUl+a0BvmO+J7bVZSKWz1kehqhfe9oWalNoccDmW9JnyV+toxsy3PK3aY9Gx4gMp567ziV4WawpCXra+MEhZ5xqTtecVycxzXlxA22OK4ZYbt9LjvrM5PkNUp6zVPdNpBv1QKwt126Paxp8zwqXu8kG8pYZdHlT2Rvxo2aVG2ObyYn65UnXLKVULZZrP02ZRfCms1OmAXCSHRYqrLzuZFaDFV6s/8omuERs0Kl/LzITVTvTHDeXTD9eAftAsSYhXYOWUAAAAASUVORK5CYII=
// @require      https://s4.zstatic.net/ajax/libs/layui/2.9.9/layui.min.js
// @resource     highlightStyle https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css
// @resource     highlightStyle_dark https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-end
// @license      GPL-3.0 License
// @supportURL   https://www.deepflood.com/
// @homepageURL  https://www.deepflood.com/
// @downloadURL https://update.greasyfork.org/scripts/550935/DeepFlood%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/550935/DeepFlood%20X.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const { version, author, name, icon } = GM_info.script;

    // 适配新站点
    const BASE_URL = "https://www.deepflood.com";

    const util = {
        clog:(c) => {
            console.group(`%c %c [${name}]-v${version} by ${author}`, `background:url(${icon}) center/12px no-repeat;padding:3px`, "");
            console.log(c);
            console.groupEnd();
        },
        getValue: (name, defaultValue) => GM_getValue(name, defaultValue),
        setValue: (name, value) => GM_setValue(name, value),
        sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.head.querySelector(`#${id}`);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },
        removeStyle(id,tag){
            tag = tag || 'style';
            let doc = document, styleDom = doc.head.querySelector(`#${id}`);
            if (styleDom) { doc.head.removeChild(styleDom) };
        },
        getAttrsByPrefix(element, prefix) {
            return Array.from(element.attributes).reduce((acc, { name, value }) => {
                if (name.startsWith(prefix)) acc[name] = value;
                return acc;
            }, {});
        },
        data(element, key, value) {
            if (arguments.length < 2) return undefined;
            if (value !== undefined) element.dataset[key] = value;
            return element.dataset[key];
        },
        async post(url, data, headers, responseType = 'json') {
            return this.fetchData(url, 'POST', data, headers, responseType);
        },
        async get(url, headers, responseType = 'json') {
            return this.fetchData(url, 'GET', null, headers, responseType);
        },
        async fetchData(url, method='GET', data=null, headers={}, responseType='json') {
            const options = {
                method,
                headers: { 'Content-Type':'application/json',...headers},
                body: data ? JSON.stringify(data) : undefined
            };
            const response = await fetch(url.startsWith("http") ? url : BASE_URL + url, options);
            const result = await response[responseType]().catch(() => null);
            return response.ok ? result : Promise.reject(result);
        },
        getCurrentDate() {
            const localTimezoneOffset = (new Date()).getTimezoneOffset();
            const beijingOffset = 8 * 60;
            const beijingTime = new Date(Date.now() + (localTimezoneOffset + beijingOffset) * 60 * 1000);
            const timeNow = `${beijingTime.getFullYear()}/${(beijingTime.getMonth() + 1)}/${beijingTime.getDate()}`;
            return timeNow;
        },
        createElement(tagName, options = {}, childrens = [], doc = document, namespace = null) {
            if (Array.isArray(options)) {
                if (childrens.length !== 0) {
                    throw new Error("If options is an array, childrens should not be provided.");
                }
                childrens = options;
                options = {};
            }

            const { staticClass = '', dynamicClass = '', attrs = {}, on = {} } = options;

            const ele = namespace ? doc.createElementNS(namespace, tagName) : doc.createElement(tagName);

            if (staticClass) {
                staticClass.split(' ').forEach(cls => ele.classList.add(cls.trim()));
            }
            if (dynamicClass) {
                dynamicClass.split(' ').forEach(cls => ele.classList.add(cls.trim()));
            }

            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.entries(value).forEach(([styleKey, styleValue]) => {
                        ele.style[styleKey] = styleValue;
                    });
                } else {
                    if (value !== undefined) ele.setAttribute(key, value);
                }
            });

            Object.entries(on).forEach(([event, handler]) => {
                ele.addEventListener(event, handler);
            });

            childrens.forEach(child => {
                if (typeof child === 'string') {
                    child = doc.createTextNode(child);
                }
                ele.appendChild(child);
            });

            return ele;
        },
        b64DecodeUnicode(str) {
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    };

    const opts = {
        post: {
            pathPattern: /^\/(categories\/|page|award|search|$)/,
            scrollThreshold: 1500,
            nextPagerSelector: '.nsk-pager a.pager-next',
            postListSelector: 'ul.post-list:not(.topic-carousel-panel)',
            topPagerSelector: 'div.nsk-pager.pager-top',
            bottomPagerSelector: 'div.nsk-pager.pager-bottom',
        },
        comment: {
            pathPattern: /^\/post-/,
            scrollThreshold: 690,
            nextPagerSelector: '.nsk-pager a.pager-next',
            postListSelector: 'ul.comments',
            topPagerSelector: 'div.nsk-pager.post-top-pager',
            bottomPagerSelector: 'div.nsk-pager.post-bottom-pager',
        },
        setting: {
            SETTING_SIGN_IN_STATUS: 'setting_sign_in_status',
            SETTING_SIGN_IN_LAST_DATE: 'setting_sign_in_last_date',
            SETTING_SIGN_IN_IGNORE_DATE: 'setting_sign_in_ignore_date',
            SETTING_AUTO_LOADING_STATUS: 'setting_auto_loading_status'
        },
        settings:{
            "version": version,
            "sign_in": { "enabled": true, "method": 0, "last_date": "", "ignore_date": "" },
            "signin_tips": { "enabled": true },
            "re_signin": { "enabled": true },
            "auto_jump_external_links": { "enabled": true },
            "loading_post": { "enabled": true },
            "loading_comment": { "enabled": true },
            "quick_comment": { "enabled": true },
            "open_post_in_new_tab": { "enabled": false },
            "block_members": { "enabled": true },
            "block_posts": { "enabled": true,"keywords":[] },
            "level_tag": { "enabled": true, "low_lv_alarm":false, "low_lv_max_days":30 },
            "code_highlight": { "enabled": true },
            "image_slide":{ "enabled":true },
            "visited_links":{ "enabled": true, "link_color":"","visited_color":"","dark_link_color":"","dark_visited_color":"" },
            "user_card_ext": { "enabled":true }
        }
    };
    layui.use(function () {
        const layer = layui.layer;
        const dropdown = layui.dropdown;
        const message = {
            info: (text) => message.__msg(text, { "background-color": "#4D82D6" }),
            success: (text) => message.__msg(text, { "background-color": "#57BF57" }),
            warning: (text) => message.__msg(text, { "background-color": "#D6A14D" }),
            error: (text) => message.__msg(text, { "background-color": "#E1715B" }),
            __msg: (text, style) => { let index = layer.msg(text, { offset: 't', area: ['100%', 'auto'], anim: 'slideDown' }); layer.style(index, Object.assign({ opacity: 0.9 }, style)); }
        };

        const Config = {
            // 初始化配置数据
            initValue() {
                const value = [
                    { name: opts.setting.SETTING_SIGN_IN_STATUS, defaultValue: 0 },
                    { name: opts.setting.SETTING_SIGN_IN_LAST_DATE, defaultValue: '1753/1/1' },
                    { name: opts.setting.SETTING_SIGN_IN_IGNORE_DATE, defaultValue: '1753/1/1' },
                    { name: opts.setting.SETTING_AUTO_LOADING_STATUS, defaultValue: 1 },
                    { name: 'open_post_in_new_tab', defaultValue: 0 },
                    { name: 'feedback', defaultValue: 0 }
                ];
                this.upgradeConfig();
                value.forEach((v) => util.getValue(v.name) === undefined && util.setValue(v.name, v.defaultValue));
            },
            // 升级配置项
            upgradeConfig() {
                const upgradeConfItem = (oldConfKey, newConfKey) => {
                    if (util.getValue(oldConfKey) && util.getValue(newConfKey) === undefined) {
                        util.clog(`升级配置项 ${oldConfKey} 为 ${newConfKey}`);
                        util.setValue(newConfKey, util.getValue(oldConfKey));
                        GM_deleteValue(oldConfKey);
                    }
                };
                upgradeConfItem('menu_signInTime', opts.setting.SETTING_SIGN_IN_LAST_DATE);
            },
            initializeConfig() {
                const defaultConfig = opts.settings;
                if (!util.getValue('settings')) {
                    util.setValue('settings', defaultConfig);
                    return;
                }
                if(this.getConfig('version')===version) return;
                let storedConfig = util.getValue('settings');
                const cleanDefaults = (stored, defaults) => {
                    Object.keys(stored).forEach(key => {
                        if (defaults[key] === undefined) {
                            delete stored[key];
                        } else if (typeof stored[key] === 'object' && stored[key] !== null && !(stored[key] instanceof Array)) {
                            cleanDefaults(stored[key], defaults[key]);
                        }
                    });
                };
                const mergeDefaults = (stored, defaults) => {
                    Object.keys(defaults).forEach(key => {
                        if (typeof defaults[key] === 'object' && defaults[key] !== null && !(defaults[key] instanceof Array)) {
                            if (!stored[key]) stored[key] = {};
                            mergeDefaults(stored[key], defaults[key]);
                        } else {
                            if (stored[key] === undefined) {
                                stored[key] = defaults[key];
                            }
                        }
                    });
                };
                mergeDefaults(storedConfig, defaultConfig);
                cleanDefaults(storedConfig, defaultConfig);
                storedConfig.version = version;
                util.setValue('settings',storedConfig);
            },updateConfig(path, value) {
                let config = util.getValue('settings');
                let keys = path.split('.');
                let lastKey = keys.pop();
                let lastObj = keys.reduce((obj, key) => obj[key], config);
                lastObj[lastKey] = value;
                util.setValue('settings', config);
            },getConfig(path) {
                let config = GM_getValue('settings');
                let keys = path.split('.');
                return keys.reduce((obj, key) => obj[key], config);
            }
        };

        const FeatureFlags={
            isEnabled(featureName) {
                if (Config.getConfig(featureName)) {
                    return Config.getConfig(`${featureName}.enabled`);
                } else {
                    console.error(`Feature '${featureName}' does not exist.`);
                    return false;
                }
            }
        };

        const main = {
            loginStatus: false,
            //检查是否登陆
            checkLogin() {
                if (unsafeWindow.__config__ && unsafeWindow.__config__.user) {
                    this.loginStatus = true;
                    util.clog(`当前登录用户 ${unsafeWindow.__config__.user.member_name} (ID ${unsafeWindow.__config__.user.member_id})`);
                }
            },
            // 自动签到
            autoSignIn(rand) {
                if(!FeatureFlags.isEnabled('sign_in')) return;

                if (!this.loginStatus) return
                if (util.getValue(opts.setting.SETTING_SIGN_IN_STATUS) === 0) return;

                rand = rand || (util.getValue(opts.setting.SETTING_SIGN_IN_STATUS) === 1);

                let timeNow = util.getCurrentDate(),
                    timeOld = util.getValue(opts.setting.SETTING_SIGN_IN_LAST_DATE);
                if (!timeOld || timeOld != timeNow) {
                    util.setValue(opts.setting.SETTING_SIGN_IN_LAST_DATE, timeNow);
                    this.signInRequest(rand);
                }
            },
            // 重新签到
            reSignIn() {
                if (!this.loginStatus) return;
                if (util.getValue(opts.setting.SETTING_SIGN_IN_STATUS) === 0) {
                    unsafeWindow.mscAlert('提示', this.getMenuStateText(this._menus[0], 0) + ' 状态时不支持重新签到！');
                    return;
                }

                util.setValue(opts.setting.SETTING_SIGN_IN_LAST_DATE, '1753/1/1');
                location.reload();
            },
            addSignTips() {
                if(!FeatureFlags.isEnabled('signin_tips')) return;

                if (!this.loginStatus) return
                if (util.getValue(opts.setting.SETTING_SIGN_IN_STATUS) !== 0) return;

                const timeNow = util.getCurrentDate();
                const { SETTING_SIGN_IN_IGNORE_DATE, SETTING_SIGN_IN_LAST_DATE } = opts.setting;
                const timeIgnore = util.getValue(SETTING_SIGN_IN_IGNORE_DATE);
                const timeOld = util.getValue(SETTING_SIGN_IN_LAST_DATE);

                if (timeNow === timeIgnore || timeNow === timeOld) return;

                const _this = this;
                let tip = util.createElement("div", { staticClass: 'nsplus-tip' });
                let tip_p = util.createElement('p');
                tip_p.innerHTML = '今天你还没有签到哦！&emsp;【<a class="sign_in_btn" data-rand="true" href="javascript:;">随机抽个鸡腿</a>】&emsp;【<a class="sign_in_btn" data-rand="false" href="javascript:;">只要5个鸡腿</a>】&emsp;【<a id="sign_in_ignore" href="javascript:;">今天不再提示</a>】';
                tip.appendChild(tip_p);
                tip.querySelectorAll('.sign_in_btn').forEach(function (item) {
                    item.addEventListener("click", function (e) {
                        const rand = util.data(this, 'rand');
                        _this.signInRequest(rand);
                        tip.remove();
                        util.setValue(SETTING_SIGN_IN_LAST_DATE, timeNow);
                    })
                });
                tip.querySelector('#sign_in_ignore').addEventListener("click", function (e) {
                    tip.remove();
                    util.setValue(SETTING_SIGN_IN_IGNORE_DATE, timeNow);
                });

                document.querySelector('header').append(tip);
            },
            async signInRequest(rand) {
                await util.post('/api/attendance?random=' + (rand || false), {}, { "Content-Type": "application/json" }).then(json => {
                    if (json.success) {
                        message.success(`签到成功！今天午饭+${json.gain}个鸡腿; 积攒了${json.current}个鸡腿了`);
                    }
                    else {
                        message.info(json.message);
                    }
                }).catch(error => {
                    message.info(error.message || "发生未知错误");
                    util.clog(error);
                });
                util.clog(`[${name}] 签到完成`);
            },
            is_show_quick_comment: false,
            quickComment() {
                if (!this.loginStatus || !opts.comment.pathPattern.test(location.pathname)) return;
                if (util.getValue(opts.setting.SETTING_AUTO_LOADING_STATUS) === 0) return;

                const _this = this;

                const onClick = (e) => {
                    if (_this.is_show_quick_comment) {
                        return;
                    }
                    e.preventDefault();

                    const mdEditor = document.querySelector('.md-editor');
                    const clientHeight = document.documentElement.clientHeight, clientWidth = document.documentElement.clientWidth;
                    const mdHeight = mdEditor.clientHeight, mdWidth = mdEditor.clientWidth;
                    const top = (clientHeight / 2) - (mdHeight / 2), left = (clientWidth / 2) - (mdWidth / 2);
                    mdEditor.style.cssText = `position: fixed; top: ${top}px; left: ${left}px; margin: 30px 0px; width: 100%; max-width: ${mdWidth}px; z-index: 999;`;
                    const moveEl = mdEditor.querySelector('.tab-select.window_header');
                    moveEl.style.cursor = "move";
                    moveEl.addEventListener('mousedown', startDrag);
                    addEditorCloseButton();
                    _this.is_show_quick_comment = true;
                };
                const commentDiv = document.querySelector('#fast-nav-button-group #back-to-parent').cloneNode(true);
                commentDiv.id = 'back-to-comment';
                commentDiv.innerHTML = '<svg class="iconpark-icon" style="width: 24px; height: 24px;"><use href="#comments"></use></svg>';
                commentDiv.addEventListener("click", onClick);
                document.querySelector('#back-to-parent').before(commentDiv);
                document.querySelectorAll('.nsk-post .comment-menu,.comment-container .comments').forEach(x=>x.addEventListener("click",(event) =>{ if(!["引用", "回复", "编辑"].includes(event.target.textContent)) return; onClick(event);},true));

                function addEditorCloseButton() {
                    const fullScreenToolbar = document.querySelector('#editor-body .window_header > :last-child');
                    const cloneToolbar = fullScreenToolbar.cloneNode(true);
                    cloneToolbar.setAttribute('title', '关闭');
                    cloneToolbar.querySelector('span').classList.replace('i-icon-full-screen-one', 'i-icon-close');
                    cloneToolbar.querySelector('span').innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
                    cloneToolbar.addEventListener("click", function (e) {
                        const mdEditor = document.querySelector('.md-editor');
                        mdEditor.style = "";
                        const moveEl = mdEditor.querySelector('.tab-select.window_header');
                        moveEl.style.cursor = "";
                        moveEl.removeEventListener('mousedown', startDrag);

                        this.remove();
                        _this.is_show_quick_comment = false;
                    });
                    fullScreenToolbar.after(cloneToolbar);
                }
                function startDrag(event) {
                    if (event.button !== 0) return;

                    const draggableElement = document.querySelector('.md-editor');
                    const parentMarginTop = parseInt(window.getComputedStyle(draggableElement).marginTop);
                    const initialX = event.clientX - draggableElement.offsetLeft;
                    const initialY = event.clientY - draggableElement.offsetTop + parentMarginTop;
                    document.onmousemove = function (event) {
                        const newX = event.clientX - initialX;
                        const newY = event.clientY - initialY;
                        draggableElement.style.left = newX + 'px';
                        draggableElement.style.top = newY + 'px';
                    };
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }
            },
            //自动点击跳转页链接
            autoJump() {
                document.querySelectorAll('a[href*="/jump?to="]').forEach(link => {
                    try {
                        const urlObj = new URL(link.href);
                        const encodedUrl = urlObj.searchParams.get('to');
                        if (encodedUrl) {
                            const decodedUrl = decodeURIComponent(encodedUrl);
                            link.href = decodedUrl;
                        }
                    } catch (e) {
                        console.error('处理链接时出错:', e);
                    }
                });
                if (!/^\/jump/.test(location.pathname)) return;
                document.querySelector('.btn').click();
            },
            blockPost(ele) {
                ele = ele || document;
                ele.querySelectorAll('.post-title>a[href]').forEach(function (item) {
                    if (item.textContent.toLowerCase().includes("__keys__")) {
                        item.closest(".post-list-item").classList.add('blocked-post')
                    }
                });
            },
            blockPostsByViewLevel(ele) {
                ele = ele || document;
                let level=0;
                if (this.loginStatus) level = unsafeWindow.__config__.user.rank;
                [...ele.querySelectorAll('.post-list-item use[href="#lock"]')].forEach(el => {
                    const n = +el.closest('span')?.textContent.match(/\d+/)?.[0] || 0;
                    if (n > level) el.closest('.post-list-item')?.classList.add('blocked-post');
                });
            },
            //屏蔽用户
            blockMemberDOMInsert() {
                if (!this.loginStatus) return;

                const _this = this;
                Array.from(document.querySelectorAll(".post-list .post-list-item,.content-item")).forEach((function (t, n) {
                    var r = t.querySelector('.avatar-normal');
                    r.addEventListener("click", (function (n) {
                        n.preventDefault();
                        let intervalId = setInterval(async () => {
                            const userCard = document.querySelector('div.user-card.hover-user-card');
                            const pmButton = document.querySelector('div.user-card.hover-user-card a.btn');
                            if (userCard && pmButton) {
                                clearInterval(intervalId);
                                const dataVAttrs = util.getAttrsByPrefix(userCard, 'data-v');
                                const userName = userCard.querySelector('a.Username').textContent;
                                dataVAttrs.style = "float:left; background-color:rgba(0,0,0,.3)";
                                const blockBtn = util.createElement("a", {
                                    staticClass: "btn", attrs: dataVAttrs, on: {
                                        click: function (e) {
                                            e.preventDefault();
                                            unsafeWindow.mscConfirm(`确定要屏蔽“${userName}”吗？`, '你可以在本站的 设置=>屏蔽用户 中解除屏蔽', function () { blockMember(userName); })
                                        }
                                    }
                                }, ["屏蔽"]);
                                pmButton.after(blockBtn);
                            }
                        }, 50);
                    }))
                }))
                function blockMember(userName) {
                    util.post("/api/block-list/add", { "block_member_name": userName }, { "Content-Type": "application/json" }).then(function (data) {
                        if (data.success) {
                            let msg = '屏蔽用户【' + userName + '】成功！';
                            unsafeWindow.mscAlert(msg);
                            util.clog(msg);
                        } else {
                            let msg = '屏蔽用户【' + userName + '】失败！' + data.message;
                            unsafeWindow.mscAlert(msg);
                            util.clog(msg);
                        }
                    }).catch(function (err) {
                        util.clog(err);
                    });
                }
            },
            addImageSlide() {
                if (!opts.comment.pathPattern.test(location.pathname)) return;

                const posts = document.querySelectorAll('article.post-content');
                posts.forEach(function (post, i) {
                    const images = post.querySelectorAll('img:not(.sticker)');
                    if (images.length === 0) return;

                    images.forEach(function (image, i) {
                        const newImg = image.cloneNode(true);
                        image.parentNode.replaceChild(newImg, image);
                        newImg.addEventListener('click', function (e) {
                            e.preventDefault();
                            const imgArr = Array.from(post.querySelectorAll('img:not(.sticker)'));
                            const clickedIndex = imgArr.indexOf(this);
                            const photoData = imgArr.map((img, i) => ({ alt: img.alt, pid: i + 1, src: img.src }));
                            layer.photos({ photos: { "title": "图片预览", "start": clickedIndex, "data": photoData } });
                        }, true);
                    });
                });
            },
            addLevelTag() {
                if (!this.loginStatus) return;
                if (!opts.comment.pathPattern.test(location.pathname)) return;

                this.getUserInfo(unsafeWindow.__config__.postData.op.uid).then((user) => {
                    let warningInfo = '';
                    const daysDiff = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));
                    if (daysDiff < 30) {
                        warningInfo = `⚠️`;
                    }
                    console.log(user);
                    const span = util.createElement("span", { staticClass: `nsk-badge role-tag user-level user-lv${user.rank}`, on: { mouseenter: function (e) { layer.tips(`注册 <span class="layui-badge">${daysDiff}</span> 天；帖子 ${user.nPost}；评论 ${user.nComment}`, this, { tips: 3, time: 0 }); }, mouseleave: function (e) { layer.closeAll(); } } }, [util.createElement("span", [`${warningInfo}Lv ${user.rank}`])]);

                    const authorLink = document.querySelector('#nsk-body .nsk-post .nsk-content-meta-info .author-info>a');
                    if (authorLink != null) {
                        authorLink.after(span);
                    }
                });
            },
            getUserInfo(uid) {
                return new Promise((resolve, reject) => {
                    util.get(`/api/account/getInfo/${uid}`, {}, 'json').then((data) => {
                        if (!data.success) {
                            util.clog(data);
                            return;
                        }
                        resolve(data.detail);
                    }).catch((err) => reject(err));
                })
            },
            userCardEx() {
                if (!this.loginStatus) return;
                if (!(opts.post.pathPattern.test(location.pathname)|| opts.comment.pathPattern.test(location.pathname))) return;

                const updateNotificationElement = (element, href, iconHref, text, count) => {
                    element.querySelector("a").setAttribute("href", `${href}`);
                    element.querySelector("a > svg > use").setAttribute("href", `${iconHref}`);
                    element.querySelector("a > :nth-child(2)").textContent = `${text} `;
                    element.querySelector("a > :last-child").textContent = count;
                    const countEl = element.querySelector("a > :last-child");
                    countEl.classList.toggle("notify-count", count > 0);

                    return element;
                };

                const userCard = document.querySelector(".user-card .user-stat");
                const lastElement = userCard.querySelector(".stat-block:first-child > :last-child");

                const atMeElement = lastElement.cloneNode(true);
                const msgElement = lastElement.cloneNode(true);

                lastElement.after(atMeElement);
                userCard.querySelector(".stat-block:last-child").append(msgElement);

                const updateAllCounts = (counts) => {
                    updateNotificationElement(atMeElement, "/notification#/atMe", "#at-sign", "我", counts.atMe);
                    updateNotificationElement(msgElement, "/notification#/message?mode=list", "#envelope-one", "私信", counts.message);
                    updateNotificationElement(lastElement, "/notification#/reply", "#remind-6nce9p47", "回复", counts.reply);
                };

                updateAllCounts(unsafeWindow.__config__.user.unViewedCount);

                let interval = 30000;
                const minInterval = 30000;
                const maxInterval = 10 * 60 * 1000;
                function fetchUnreadCount() {
                    fetch(BASE_URL + "/api/notification/unread-count", { credentials: "include" })
                        .then(res => res.ok ? res.json() : Promise.reject(res.status))
                        .then(data => {
                        if (data.success && data.unreadCount) updateAllCounts(data.unreadCount);
                        interval = minInterval;
                    })
                    .catch(err => {
                        console.error(err);
                        interval = Math.min(interval * 2, maxInterval);
                    })
                    .finally(() => setTimeout(fetchUnreadCount, interval));
                }
                fetchUnreadCount();
            },
            // 自动翻页
            autoLoading() {
                if (util.getValue(opts.setting.SETTING_AUTO_LOADING_STATUS) === 0) return;
                let opt = {};
                if (opts.post.pathPattern.test(location.pathname)) { opt = opts.post; }
                else if (opts.comment.pathPattern.test(location.pathname)) { opt = opts.comment; }
                else { return; }
                let is_requesting = false;
                let _this = this;
                this.windowScroll(function (direction, e) {
                    if (direction === 'down') {
                        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        if (document.documentElement.scrollHeight <= document.documentElement.clientHeight + scrollTop + opt.scrollThreshold && !is_requesting) {
                            if (!document.querySelector(opt.nextPagerSelector)) return;
                            let nextUrl = document.querySelector(opt.nextPagerSelector).attributes.href.value;
                            is_requesting = true;
                            util.get(nextUrl, {}, 'text').then(function (data) {
                                let doc = new DOMParser().parseFromString(data, "text/html");
                                _this.blockPost(doc);
                                _this.blockPostsByViewLevel(doc);
                                if (opts.comment.pathPattern.test(location.pathname)){
                                    let el = doc.getElementById('temp-script')
                                    let jsonText = el.textContent;
                                    if (jsonText) {
                                        let conf = JSON.parse(util.b64DecodeUnicode(jsonText))
                                        unsafeWindow.__config__.postData.comments.push(...conf.postData.comments);
                                    }
                                }
                                document.querySelector(opt.postListSelector).append(...doc.querySelector(opt.postListSelector).childNodes);
                                document.querySelector(opt.topPagerSelector).innerHTML = doc.querySelector(opt.topPagerSelector).innerHTML;
                                document.querySelector(opt.bottomPagerSelector).innerHTML = doc.querySelector(opt.bottomPagerSelector).innerHTML;
                                history.pushState(null, null, nextUrl);
                                if (opts.comment.pathPattern.test(location.pathname)){
                                    const vue = document.querySelector('.comment-menu').__vue__;
                                    Array.from(document.querySelectorAll(".content-item")).forEach(function (t,e) {
                                        var n = t.querySelector(".comment-menu-mount");
                                        if(!n) return;
                                        let o = new vue.$root.constructor(vue.$options);
                                        o.setIndex(e);
                                        o.$mount(n);
                                    });
                                }
                                is_requesting = false;
                            }).catch(function (err) {
                                is_requesting = false;
                                util.clog(err);
                            });
                        }
                    }
                });
            },
            // 滚动条事件
            windowScroll(fn1) {
                let beforeScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                    fn = fn1 || function () { };
                setTimeout(function () {
                    window.addEventListener('scroll', function (e) {
                        const afterScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                              delta = afterScrollTop - beforeScrollTop;
                        if (delta == 0) return false;
                        fn(delta > 0 ? 'down' : 'up', e);
                        beforeScrollTop = afterScrollTop;
                    }, false);
                }, 1000)
            },
            // 平滑滚动
            smoothScroll(){
                const scroll = (selector, top = 0) => {
                    const btn = document.querySelector(selector);
                    if (btn) {
                        btn.onclick = null;
                        btn.removeAttribute('onclick');
                        btn.addEventListener('click', e => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if(e.target.querySelector('use[href="#down"]')){
                                top = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                            }
                            window.scrollTo({ top, behavior: 'smooth' });
                        }, true);
                    }
                };
                scroll('#back-to-top', 0);
                scroll('#back-to-bottom');
            },

            // === 新增：只切脚本本地状态 + 自动刷新菜单 + 绑定行为 ===
            dfxSetOpenInNewTab(on) {
              try {
                const v = on ? 1 : 0;
                GM_setValue('open_post_in_new_tab', v);
                console.log('已写入 open_post_in_new_tab =', v);
                this.registerMenus?.();
                unsafeWindow?.mscAlert?.(`已${on ? '开启' : '关闭'}新标签页打开链接（仅脚本本地状态）`);
                this.bindOpenInNewTabHandler?.();
              } catch (e) {
                console.error(e);
              }
            },

            // === 新增：拦截帖子链接点击，按脚本状态强制新标签打开 ===
            bindOpenInNewTabHandler() {
              try {
                if (unsafeWindow.__dfxOpenInNewTabHandler) {
                  document.removeEventListener('click', unsafeWindow.__dfxOpenInNewTabHandler, true);
                }
              } catch(e){}

              unsafeWindow.__dfxOpenInNewTabHandler = (e) => {
                const a = e.target.closest('a[href]');
                if (!a) return;
                const href = a.href;
                const isPost = /^https?:\/\/www\.deepflood\.com\/post-\d+-\d+/.test(href);
                if (isPost && util.getValue('open_post_in_new_tab') === 1) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  window.open(href, '_blank');
                }
              };

              document.addEventListener('click', unsafeWindow.__dfxOpenInNewTabHandler, true);
            },

            switchMultiState(stateName, states) {
                let currState = util.getValue(stateName);
                currState = (currState + 1) % states.length;
                util.setValue(stateName, currState);
                this.registerMenus();
            },
            getMenuStateText(menu, stateVal) {
                return `${menu.states[stateVal].s1} ${menu.text}（${menu.states[stateVal].s2}）`;
            },
            _menus: [
                {
                    name: opts.setting.SETTING_SIGN_IN_STATUS,
                    callback: (name, states) => main.switchMultiState(name, states),
                    accessKey: '',
                    text: '自动签到',
                    states: [
                        { s1: '❌', s2: '关闭' },
                        { s1: '🎲', s2: '随机🍗' },
                        { s1: '📌', s2: '5个🍗' }
                    ]
                },
                {
                    name: 're_sign_in',
                    callback: (name, states) => main.reSignIn(),
                    accessKey: '',
                    text: '🔂 重新签到',
                    states: []
                },
                {
                    name: opts.setting.SETTING_AUTO_LOADING_STATUS,
                    callback: (name, states) => main.switchMultiState(name, states),
                    accessKey: '',
                    text: '无缝加载',
                    states: [
                        { s1: '❌', s2: '关闭' },
                        { s1: '✅', s2: '开启' }
                    ]
                },
                {
                    name: 'open_post_in_new_tab',
                    // 改为调用新增方法，而不是旧的 switchOpenPostInNewTab
                    callback: () => {
                        const next = util.getValue('open_post_in_new_tab') ? 0 : 1;
                        main.dfxSetOpenInNewTab(next);
                    },
                    accessKey: '',
                    text: '新标签页打开链接',
                    states: [
                        { s1: '❌', s2: '关闭' },
                        { s1: '✅', s2: '开启' }
                    ]
                },
                {
                    name: 'feedback',
                    // 已替换为 GreasyFork 反馈地址
                    callback: () => GM_openInTab('https://greasyfork.org/zh-CN/scripts/550935-deepflood-x/feedback', { active: true, insert: true, setParent: true }),
                    accessKey: '',
                    text: '💬 反馈 & 建议',
                    states: []
                }
            ],

            _menuIds: [],
            registerMenus() {
                this._menuIds.forEach(function (id) {
                    GM_unregisterMenuCommand(id);
                });
                this._menuIds = [];

                const _this = this;
                this._menus.forEach(function (menu) {
                    let k = menu.text;
                    if (menu.states.length > 0) {
                        k = _this.getMenuStateText(menu, util.getValue(menu.name));
                    }
                    let autoClose = menu.hasOwnProperty('autoClose') ? menu.autoClose : true;
                    let menuId = GM_registerMenuCommand(k, function () { menu.callback(menu.name, menu.states) }, { autoClose: autoClose });
                    menuId = menuId || k;
                    _this._menuIds.push(menuId);
                });
            },
            advancedSettings() {
                let layerWidth = layui.device().mobile ? '100%' : '620px';
                layer.open({
                    type: 1,
                    offset: 'r',
                    anim: 'slideLeft',
                    area: [layerWidth, '100%'],
                    scrollbar: false,
                    shade: 0.1,
                    shadeClose: false,
                    btn: ["保存设置"],
                    btnAlign: 'r',
                    title: 'DeepFlood X 设置',
                    id: 'setting-layer-direction-r',
                    content: `<div class="layui-row" style="display:flex;height:100%">
  <div class="layui-panel layui-col-xs3 layui-col-sm3 layui-col-md3" id="demo-menu">
    <ul class="layui-menu" lay-filter="demo"></ul>
  </div>
  <div class="layui-col-xs9 layui-col-sm9 layui-col-md9" style="overflow-y: auto; padding-left: 10px" id="demo-content">
    <fieldset id="group1" class="layui-elem-field layui-field-title">
      <legend>基本设置</legend>
    </fieldset>
    <div style="height: 500px;">Content for Group 1</div>
    <fieldset id="group2" class="layui-elem-field layui-field-title">
      <legend>扩展设置</legend>
    </fieldset>
    <div style="height: 500px;">Content for Group 2</div>
    <fieldset id="group3" class="layui-elem-field layui-field-title">
      <legend>实验设置</legend>
    </fieldset>
    <div style="height: 500px;">Content for Group 3</div>
  </div>
</div>
<script>
  document.querySelectorAll('#demo-content > fieldset').forEach(function (el, i) {
    let li = document.createElement('li');
    if (i === 0) li.classList = 'layui-menu-item-checked';
    let div = document.createElement('div');
    div.classList = 'layui-menu-body-title';
    let a = document.createElement('a');
    a.href = '#' + el.id;
    a.textContent = el.textContent;
    a.addEventListener('click', aClick);
    li.append(div);
    div.append(a);
    document.querySelector('#demo-menu>ul').append(li);
  });
  const docContent = document.querySelector('#demo-content');
  docContent.addEventListener('scroll', function (e) {
    var scrollPos = docContent.scrollTop;
    console.log(scrollPos);
    docContent.querySelectorAll('fieldset').forEach(function (el) {
      var topPos = el.offsetTop - 10;
      if (scrollPos >= topPos) {
        var id = el.getAttribute('id');
        document.querySelectorAll('.layui-menu > li.layui-menu-item-checked').forEach(function (navItem) {
          navItem.classList.remove('layui-menu-item-checked');
        });
        var navItem = document.querySelector('.layui-menu > li a[href="#' + id + '"]').closest('li');
        navItem.classList.add('layui-menu-item-checked');
      }
    });
  });
  function aClick(e) {
    e.preventDefault();
    var id = this.getAttribute('href');
    var target = document.querySelector(id);
    docContent.scrollTo({
      top: target.offsetTop - 10,
    });
  }
<\/script>`,
                    yes: function(index, layero, that){
                        layer.msg('111');
                        layer.close(index);
                    }
                });
            },
            addCodeHighlight() {
                const codes = document.querySelectorAll(".post-content pre code");
                if (codes) {
                    codes.forEach(function (code) {
                        const copyBtn = util.createElement("span", { staticClass: "copy-code", attrs: { title: "复制代码" }, on: { click: copyCode } }, [util.createElement("svg", { staticClass: 'iconpark-icon' }, [util.createElement("use", { attrs: { href: "#copy" } }, [], document, "http://www.w3.org/2000/svg")], document, "http://www.w3.org/2000/svg")]);
                        code.after(copyBtn);
                    });
                }
                function copyCode(e) {
                    const pre = this.closest('pre');
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(pre.querySelector("code"));
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand('copy');
                    selection.removeAllRanges();
                    updateCopyButton(this);
                    layer.tips(`复制成功`, this, { tips: 4, time: 1000 })
                }
                function updateCopyButton(ele) {
                    ele.querySelector("use").setAttribute("href", "#check");
                    util.sleep(1000).then(() => ele.querySelector("use").setAttribute("href", "#copy"));
                }
            },
            addPluginStyle() {
                let style = `
                :root { --link-visited-color: #afb9c1 }
                body.dark-layout { --link-visited-color: #393f4e; }
            .nsplus-tip { background-color: rgba(255, 217, 0, 0.8); border: 0px solid black;  padding: 3px; text-align: center;animation: blink 5s cubic-bezier(.68,.05,.46,.96) infinite;}
            .nsplus-tip p,.nsplus-tip p a { color: #f00 }
            .nsplus-tip p a:hover {color:#0ff}
            #back-to-comment{display:flex;}
            #fast-nav-button-group .nav-item-btn:nth-last-child(4){bottom:120px;}

            header div.history-dropdown-on { color: var(--link-hover-color); cursor: pointer; padding: 0 5px; position: absolute; right: 50px}

            .post-list .post-title a:visited{color:var(--link-visited-color)}
            .role-tag.user-level.user-lv0 {background-color: rgb(199 194 194); border: 1px solid rgb(199 194 194); color: #fafafa;}
            .role-tag.user-level.user-lv1 {background-color: #ff9400; border: 1px solid #ff9400; color: #fafafa;}
            .role-tag.user-level.user-lv2 {background-color: #ff9400; border: 1px solid #ff9400; color: #fafafa;}
            .role-tag.user-level.user-lv3 {background-color: #ff3a55; border: 1px solid #ff3a55; color: #fafafa;}
            .role-tag.user-level.user-lv4 {background-color: #ff3a55; border: 1px solid #ff3a55; color: #fafafa;}
            .role-tag.user-level.user-lv5 {background-color: #de00ff; border: 1px solid #de00ff; color: #fafafa;}
            .role-tag.user-level.user-lv6 {background-color: #de00ff; border: 1px solid #de00ff; color: #fafafa;}
            .role-tag.user-level.user-lv7 {background-color: #ff0000; border: 1px solid #ff0000; color: #fafafa;}
            .role-tag.user-level.user-lv8 {background-color: #3478f7; border: 1px solid #3478f7; color: #fafafa;}

            .post-content pre { position: relative; }
.post-content pre span.copy-code { position: absolute; right: .5em; top: .5em; cursor: pointer;color: #c1c7cd;  }
.post-content pre .iconpark-icon {width:16px;height:16px;margin:3px;}
.post-content pre .iconpark-icon:hover {color:var(--link-hover-color)}
.dark-layout .post-content pre code.hljs { padding: 1em !important; }
`;
                if (document.head) {
                    util.addStyle('nsplus-style', 'style', style);
                    util.addStyle('layui-style', 'link', 'https://s.cfn.pp.ua/layui/2.9.9/css/layui.css');
                    util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle"));
                }
            },
            addPluginScript() {
                GM_addElement(document.body, 'script', {
                    src: 'https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/highlight.min.js'
                });
                GM_addElement(document.body, 'script', {
                    textContent: 'window.onload = function(){hljs.highlightAll();}'
                });
                GM_addElement(document.body, "script", { textContent: `!function(e){var t,n,d,o,i,a,r='<svg><symbol id="envelope-one" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M36 16V8H4v24h8" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M12 40h32V16H12v24Z" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="m12 16 16 12 16-12" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M32 16H12v15" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M44 31V16H24" data-follow-stroke="currentColor"/></symbol><symbol id="at-sign" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M44 24c0-11.046-8.954-20-20-20S4 12.954 4 24s8.954 20 20 20v0c4.989 0 9.55-1.827 13.054-4.847" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M24 32a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M32 24a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6m-12 1v-9" data-follow-stroke="currentColor"/></symbol><symbol id="copy" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M13 12.432v-4.62A2.813 2.813 0 0 1 15.813 5h24.374A2.813 2.813 0 0 1 43 7.813v24.375A2.813 2.813 0 0 1 40.187 35h-4.67" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M32.188 13H7.811A2.813 2.813 0 0 0 5 15.813v24.374A2.813 2.813 0 0 0 7.813 43h24.375A2.813 2.813 0 0 0 35 40.187V15.814A2.813 2.813 0 0 0 32.187 13Z" data-follow-stroke="currentColor"/></symbol><symbol id="history" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M5.818 6.727V14h7.273" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M4 24c0 11.046 8.954 20 20 20v0c11.046 0 20-8.954 20-20S35.046 4 24 4c-7.402 0-13.865 4.021-17.323 9.998" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="m24.005 12-.001 12.009 8.48 8.48" data-follow-stroke="currentColor"/></symbol></svg>';function c(){i||(i=!0,d())}t=function(){var e,t,n;(n=document.createElement("div")).innerHTML=r,r=null,(t=n.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",e=t,(n=document.body).firstChild?(t=n.firstChild).parentNode.insertBefore(e,t):n.appendChild(e))},document.addEventListener?["complete","loaded","interactive"].indexOf(document.readyState)>-1?setTimeout(t,0):(n=function(){document.removeEventListener("DOMContentLoaded",n,!1),t()},document.addEventListener("DOMContentLoaded",n,!1)):document.attachEvent&&(d=t,o=e.document,i=!1,(a=function(){try{o.documentElement.doScroll("left")}catch(e){return void setTimeout(a,50)}c()})(),o.onreadystatechange=function(){"complete"==o.readyState&&(o.onreadystatechange=null,c())})}(window);` });
            },
            darkMode(){
                const targetNode = document.querySelector('body');
                if(targetNode.classList.contains('dark-layout')){
                    util.addStyle('layuicss-theme-dark','link','https://s.cfn.pp.ua/layui/theme-dark/2.9.7/css/layui-theme-dark.css');
                    util.removeStyle('hightlight-style');
                    util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle_dark"));
                }

                const observerConfig = {
                    attributes: true,
                    attributeFilter: ['class'],
                };

                const observer = new MutationObserver((mutationsList, observer) => {
                    for(let mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            if(targetNode.classList.contains('dark-layout')){
                                util.addStyle('layuicss-theme-dark','link','https://s.cfn.pp.ua/layui/theme-dark/2.9.7/css/layui-theme-dark.css');
                                util.removeStyle('hightlight-style');
                                util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle_dark"));
                            }else{
                                util.removeStyle('layuicss-theme-dark');
                                util.removeStyle('hightlight-style');
                                util.addStyle('hightlight-style', 'link', GM_GetResourceURL("highlightStyle"));
                            }
                        }
                    }
                });

                observer.observe(targetNode, observerConfig);
            },
            init() {
                Config.initValue();
                Config.initializeConfig();
                this.addPluginStyle();
                this.checkLogin();
                const codeMirrorElement = document.querySelector('.CodeMirror');
                if (codeMirrorElement) {
                    const codeMirrorInstance = codeMirrorElement.CodeMirror;
                    if (codeMirrorInstance) {
                        let btnSubmit = document.querySelector('.md-editor button.submit.btn.focus-visible');
                        btnSubmit.innerText=btnSubmit.innerText+'(Ctrl+Enter)';
                        codeMirrorInstance.addKeyMap({"Ctrl-Enter":function(cm){ btnSubmit.click();}});
                    }
                }
                this.autoSignIn();
                this.addSignTips();
                this.autoJump();
                this.autoLoading();
                this.blockMemberDOMInsert();
                this.blockPost();
                this.blockPostsByViewLevel();
                this.quickComment();
                this.addLevelTag();
                this.userCardEx();
                this.registerMenus();
                this.bindOpenInNewTabHandler(); // 绑定新标签打开行为（依据脚本本地状态）
                this.addPluginScript();
                this.addCodeHighlight();
                this.addImageSlide();
                this.darkMode();
                this.history();
                this.initInstantPage();
                this.smoothScroll();

                // 暴露一个便捷方法到页面控制台
                unsafeWindow.__dfxSetOpenInNewTab = (on) => this.dfxSetOpenInNewTab(on);
            }
        }
        main.init();
    });
})();
