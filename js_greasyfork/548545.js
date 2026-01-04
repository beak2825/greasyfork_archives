// ==UserScript==
// @name         MJJBOX 增强
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  为 MJJBox 设置自动签到、等级进度、自动阅读、自动点赞、快速收藏、话题时间显示、精确回复时间、新标签页打开、返回顶部 等功能。
// @description:en Adds features like Auto Check-in, Level Progress, Auto Reading, Auto Liking, Quick Bookmarking, Topic Time Display, Precise Reply Time, Open in New Tab, and Back to Top to MJJBox.
// @description:zh-CN 为 MJJBox 设置自动签到、等级进度、自动阅读、自动点赞、快速收藏、话题时间显示、精确回复时间、新标签页打开、返回顶部 等功能。
// @author       Zz
// @match        https://mjjbox.com/*
// @icon         https://www.google.com/s2/favicons?domain=mjjbox.com
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/548545/MJJBOX%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/548545/MJJBOX%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var settings = {};

    const settingsConfig = {
        class_label_topic: "💠 话题内容相关:",
        quick_mark: { type: 'checkbox', label: '快速收藏 ', default: true, style: '', info: '在帖子上增加一个⭐用于快速收藏到书签' },
        show_floor_time: { type: 'checkbox', label: '更精确的回复时间', default: true, style: '', info: '帖子的回复时间改为绝对时间并精确到分钟' },

        class_label_list: "💠 话题列表相关:",
        show_up_time: { type: 'checkbox', label: '显示话题时间', default: true, style: '', info: '话题列表的帖子显示创建/更新时间，老的帖子会褪色泛黄' },

        class_label_profile: "💠 个人信息与签到:",
        show_level_and_checkin: { type: 'checkbox', label: '等级与签到助手', default: true, style: '', info: '在页面右上角显示等级徽章，点击查看进度与签到' },
        auto_checkin: { type: 'checkbox', label: '自动签到', default: false, style: '', info: '每天自动完成签到任务' },
        checkin_reminder: { type: 'checkbox', label: '签到提醒', default: true, style: '', info: '如果当天未签到，则进行提醒' },

        class_label_all: "💠 通用:",
        open_in_new: { type: 'checkbox', label: '新标签页打开', default: false, style: '', info: '让所有链接默认从新标签页打开' },
        back_to_top: { type: 'checkbox', label: '“返回顶部”按钮', default: true, style: '', info: '在页面右下角显示一个快速返回顶部的按钮' },

        class_label_auto: "💠 自动阅读功能:",
        show_auto_read_controls: { type: 'checkbox', label: '显示自动阅读控件', default: false, style: '', info: '在页面左下角显示“开始阅读”和“自动点赞”的控制按钮' },

        class_label_end: "",
    };

    // Load settings from storage
    Object.keys(settingsConfig).forEach(key => {
        if (typeof settingsConfig[key] === 'object') {
            settings[key] = GM_getValue(key, settingsConfig[key].default);
        }
    });

    // --- Individual Menu Commands ---
    Object.keys(settingsConfig).forEach(key => {
        const config = settingsConfig[key];
        if (typeof config === 'object' && config.type === 'checkbox') {
            const isEnabled = settings[key];
            const label = `${isEnabled ? '✅' : '❌'} ${config.label.trim()}`;

            GM_registerMenuCommand(label, () => {
                GM_setValue(key, !isEnabled);
                window.location.reload();
            });
        }
    });
    GM_registerMenuCommand('⚙️ 打开详细设置面板 (Open Settings Panel)', openSettings);


    // --- Settings Panel ---
    function openSettings() {
        if (document.querySelector('#mjjbox-custom-setting')) return;
        const shadow = document.createElement('div');
        shadow.style = `position: fixed; top: 0; left: 0; z-index: 8888; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6);`;
        const panel = document.createElement('div');
        panel.style = `max-width: calc(100% - 100px); width: max-content; position: fixed; top: 50%; left: 50%; z-index: 9999; transform: translate(-50%, -50%); background-color: var(--secondary); color: var(--primary); padding: 15px 25px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.7); max-height: calc(95vh - 40px); overflow-y: auto; border-radius: 8px;`;
        panel.id = "mjjbox-custom-setting";
        let html = `<style type="text/css">#mjjbox-custom-setting { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; } #mjjbox-custom-setting label { font-size: 16px; display: flex; justify-content: space-between; align-items: center; margin: 12px; } #mjjbox-custom-setting label span { color: #6bc; font-size: 12px; font-weight: normal; padding: 0 6px; margin-right: auto; } #mjjbox-custom-setting label input { margin: 0 5px 0 15px; } .settings-buttons { display: flex; justify-content: space-around; margin-top: 20px; } .settings-buttons button { user-select: none; color: #333; padding: 8px 16px; border-radius: 5px; border: none; line-height: normal; cursor: pointer; } #mjjbox-custom-setting hr { display: block; height: 1px; border: 0; border-top: 1px solid var(--primary-low); margin: 1em 0; padding: 0; }</style><h2 style="text-align:center; margin-top:.5rem;">MJJBox 自定义设置</h2>`;
        Object.keys(settingsConfig).forEach(key => {
            const cfg = settingsConfig[key];
            if (typeof cfg === 'string') {
                html += `<hr><h3 style="margin-top:5px; font-size: 1.1em;">${cfg}</h3>`;
            } else {
                const val = settings[key];
                const checked = cfg.type === 'checkbox' && val ? 'checked' : '';
                html += `<label style="${cfg.style}">${cfg.label}<span>${cfg.info}</span><input type="${cfg.type}" id="ujs_set_${key}" value="${val}" ${checked}></label>`;
            }
        });
        html += `<div class="settings-buttons"><button id="ld_userjs_apply" style="font-weight: bold; background: var(--tertiary); color: var(--secondary)">保存并刷新</button><button id="ld_userjs_reset" style="background: #fbb;">重置</button><button id="ld_userjs_close" style="background: #ddd;">取消</button></div>`;
        panel.innerHTML = html;
        document.body.append(shadow, panel);

        function saveAndReload() {
            Object.keys(settingsConfig).forEach(key => {
                const element = document.getElementById(`ujs_set_${key}`);
                if (element) GM_setValue(key, element.type === 'checkbox' ? element.checked : element.value);
            });
            window.location.reload();
        }
        document.querySelector('button#ld_userjs_apply').addEventListener('click', saveAndReload);
        document.querySelector('button#ld_userjs_reset').addEventListener('click', () => {
            Object.keys(settingsConfig).forEach(key => { if (typeof settingsConfig[key] === 'object') GM_deleteValue(key); });
            window.location.reload();
        });
        function setting_hide() { panel.remove(); shadow.remove(); }
        document.querySelector('button#ld_userjs_close').addEventListener('click', setting_hide);
        shadow.addEventListener('click', setting_hide);
    }

    // == 功能区 ==

    // Function 1: 快速收藏
    if (settings.quick_mark) {
        const starSvg = `<svg class="svg-icon" aria-hidden="true" style="text-indent: 1px; transform: scale(1); width:18px; height:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg></svg> `;
        let markMap = new Map();
        function handleResponse(xhr, s, e) { xhr.onreadystatechange = () => { if (xhr.readyState === 4) (xhr.status === 200 ? s(xhr) : e(xhr)); }; }
        function TryParseJson(str) { try { return JSON.stringify(JSON.parse(str), null, 1); } catch (err) { return str; } }
        function deleteStarMark(btn, id) { if (markMap.has(id)) { const mid = markMap.get(id); const x = new XMLHttpRequest(); x.open('DELETE', `/bookmarks/${mid}`, !0); x.setRequestHeader('Content-Type','application/json'); x.setRequestHeader('x-requested-with','XMLHttpRequest'); x.setRequestHeader("x-csrf-token",document.head.querySelector("meta[name=csrf-token]")?.content); handleResponse(x, () => { btn.style.color='#777'; btn.title="收藏"; btn.onclick=()=>addStarMark(btn,id); },(err)=>console.error('删除收藏失败!',err.statusText,TryParseJson(err.responseText))); x.send(); } }
        function addStarMark(btn, id) { const x = new XMLHttpRequest(); x.open('POST','/bookmarks',!0); x.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8'); x.setRequestHeader('x-requested-with','XMLHttpRequest'); x.setRequestHeader("x-csrf-token",document.head.querySelector("meta[name=csrf-token]")?.content); const postData=`name=%E6%94%B6%E8%97%8F&auto_delete_preference=3&bookmarkable_id=${id}&bookmarkable_type=Post`; handleResponse(x,(res)=>{ btn.style.color='#fdd459'; btn.title="删除收藏"; const newMark=JSON.parse(res.responseText); markMap.set(String(newMark.bookmarkable_id),String(newMark.id)); btn.onclick=()=>deleteStarMark(btn,id); },(err)=>console.error('收藏失败!',err.statusText,TryParseJson(err.responseText))); x.send(postData); }
        function addMarkBtn() { document.querySelectorAll("article[data-post-id]").forEach(art=>{ const target=art.querySelector("div.topic-body.clearfix > div.regular.contents > section > nav > div.actions"); if (target&&!art.querySelector("span.star-bookmark")) { const id=art.getAttribute('data-post-id'); const star=document.createElement('span'); star.innerHTML=starSvg; star.className="star-bookmark"; star.style.cssText='cursor:pointer;margin:0 12px;'; if(markMap.has(id)){star.style.color='#fdd459';star.title="删除收藏";star.onclick=()=>deleteStarMark(star,id);}else{star.style.color='#777';star.title="收藏";star.onclick=()=>addStarMark(star,id);} target.after(star); } }); }
        function getStarMark() { const userEl = document.querySelector('#current-user button > img[src]'); if(!userEl) return; const match = userEl.getAttribute('src').match(/\/user_avatar\/[^\/]+\/([^\/]+)\/\d+\//); const username = match?.[1]; if(!username) return; const x = new XMLHttpRequest(); x.open('GET',`/u/${username}/user-menu-bookmarks`,!0); x.setRequestHeader("x-csrf-token",document.head.querySelector("meta[name=csrf-token]")?.content); handleResponse(x,(res)=>{ var r=JSON.parse(res.responseText); markMap.clear(); r.bookmarks.forEach(m=>markMap.set(m.bookmarkable_id.toString(),m.id.toString())); addMarkBtn();},(err)=>console.error('获取收藏列表失败:',err.statusText)); x.send(); }
        let lastUpdateTime=0; const mainNode=document.querySelector("#main-outlet"); if(mainNode){ new MutationObserver(()=>{const now=Date.now();if(now-lastUpdateTime>5e3){getStarMark();lastUpdateTime=now;}else{addMarkBtn();}}).observe(mainNode,{childList:!0,subtree:!0}); getStarMark();}
    }

    // Function 2: 显示话题时间
    if (settings.show_up_time) {
        const getHue=(d,c)=>{const diff=Math.abs(c-d),base=2592e6,ratio=Math.min(Math.log(diff/base+1),1);return 120-140*ratio;};
        const formatDate=d=>{const p=s=>String(s).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;};
        const parseDate=s=>{
            let p;
            if ((p=s.match(/(\d+)\s*年\s*(\d+)\s*月\s*(\d+)\s*日\s*(\d+):(\d+)/))) return new Date(p[1],p[2]-1,p[3],p[4],p[5]);
            if ((p=s.match(/(\w+)\s*(\d+),\s*(\d+)\s*(\d+):(\d+)\s*(am|pm)/i))) {
                const m={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
                let h=parseInt(p[4],10);
                if(p[6].toLowerCase()==='pm'&&h<12)h+=12;
                else if(p[6].toLowerCase()==='am'&&h===12)h=0;
                return new Date(p[3],m[p[1]],p[2],h,p[5]);
            }
            if ((p=s.match(/(\d+)\s*(?:分钟|minute|min)s?前?/i))) return new Date(Date.now()-parseInt(p[1],10)*6e4);
            if ((p=s.match(/(\d+)\s*(?:小时|hour)s?前?/i))) return new Date(Date.now()-parseInt(p[1],10)*36e5);
            return null;
        };
        GM_addStyle(`.topic-list .topic-list-data.age.activity{width:12em;text-align:left;}.topic-list .topic-list-data.age.activity>a.post-activity{font-size:13px;line-height:1.5;text-wrap:nowrap;padding:4px 5px;display:block;}`);
        const creatTimeShow = () => {
            document.querySelectorAll(".topic-list-item").forEach(row => {
                const item = row.querySelector(".num.topic-list-data.age.activity");
                if (!item || item.dataset.customized) return;
                item.dataset.customized = "true";

                const timeSpan = item.querySelector("a.post-activity");
                if (!timeSpan) return;

                const timeInfo = item.title;
                const now = new Date();
                let createDate = null;
                let updateDate = null;

                let createStrMatch = timeInfo.match(/创建日期：([\s\S]+?)最新：/i) || timeInfo.match(/Created: ([\s\S]+?)Latest:/i);
                let updateStrMatch = timeInfo.match(/最新：([\s\S]+)/i) || timeInfo.match(/Latest: ([\s\S]+)/i);

                if (createStrMatch && createStrMatch[1]) {
                    // Primary method: parse from title attribute for older posts
                    createDate = parseDate(createStrMatch[1].trim());
                    if (updateStrMatch && updateStrMatch[1]) {
                        updateDate = parseDate(updateStrMatch[1].trim());
                    }
                } else {
                    // Fallback method: parse from visible text for recent posts
                    const relativeTimeStr = timeSpan.textContent.trim();
                    const parsedRelativeDate = parseDate(relativeTimeStr);
                    if (parsedRelativeDate) {
                        createDate = parsedRelativeDate;
                        updateDate = parsedRelativeDate;
                    }
                }

                if (!createDate) return;

                // --- Rendering ---
                const createHue = getHue(createDate, now);
                const formatCreate = formatDate(createDate);
                let html = `<span style="color:hsl(${createHue}, 35%, 50%);">创建: ${formatCreate}</span><br>`;

                if (updateDate) {
                    const updateHue = getHue(updateDate, now);
                    const formatNew = formatDate(updateDate);
                    html += `<span style="color:hsl(${updateHue}, 35%, 50%);">最新: ${formatNew}</span>`;
                } else {
                    html += `<span style="color:#888;">最新: 暂无回复</span>`;
                }
                timeSpan.innerHTML = html;

                // --- Fading old posts ---
                const pastDays = Math.abs(createDate - now) / 864e5;
                const title = row.querySelector(".main-link");
                if (title) {
                    if (pastDays > 120) { title.style.filter = "sepia(90%) brightness(85%)"; }
                    else if (pastDays > 60) { title.style.opacity = 0.8; title.style.filter = "sepia(40%) brightness(85%)"; }
                    else if (pastDays > 30) { title.style.opacity = 0.9; title.style.filter = "grayscale(10%) sepia(10%)"; }
                }
            });
        };
        setInterval(creatTimeShow,1000);
    }

    // Function 3: 新窗口打开
    if (settings.open_in_new) {
        document.addEventListener('click', e => { const a = e.target.closest('a'); if (!a || !a.href || a.target || e.button !== 0 || e.ctrlKey || e.metaKey || a.href.startsWith('javascript:')) return; const ex = ['.d-header-icons','.nav-pills','.post-controls','.topic-meta-data .contents','.topic-timeline','.user-card-actions','.category-breadcrumb','.select-kit-header','.select-kit-row','.modal-body','.actions'].join(', '); if (a.closest(ex)) return; e.preventDefault(); e.stopImmediatePropagation(); window.open(a.href, '_blank'); }, true);
    }

    // Function 4: 显示更精确的回复时间
    if (settings.show_floor_time) {
        GM_addStyle(`.post-info.post-date > a > .relative-date {font-size: 0;} .post-info.post-date > a > .relative-date::after {content: attr(title); font-size: 14px;}`);
    }

    // Function 5: 等级与签到助手
    if (settings.show_level_and_checkin) {
        /* global Discourse */
        (() => {
            if (window !== window.top) return;

            // ========== 脚本配置 ==========
            const SCRIPT_CONFIG = {
                baseURL: 'https://mjjbox.com',
                notificationDuration: 3500,
                requestTimeout: 15000,
                maxInitAttempts: 50,
                permissionsURL: 'https://mjjbox.com/t/topic/322',
                defaults: {
                    autoCheckin: settings.auto_checkin, // Use main settings
                    checkinReminder: settings.checkin_reminder, // Use main settings
                },
                fallbackAvatar: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyIDE2di0yYzAtMi42NiA1LjMzLTQgOC00eiIvPjwvc3ZnPg==`,
            };

            // ========== 脚本状态 ==========
            let isLoadingData = false;
            let lastFetchedData = {};

            /* ========== 等级与条件数据 ========== */
            const levelNames = { 0: '青铜会员', 1: '白银会员', 2: '黄金会员', 3: '钻石会员', 4: '星曜会员' };
            const levelRequirements = {
                1: { topics_entered: 5, posts_read: 30, time_read: 10 * 60 },
                2: { days_visited: 15, topics_entered: 20, posts_read: 100, time_read: 60 * 60, posts_created: 1, likes_received: 15, likes_given: 20, has_avatar: true, has_bio: true },
                3: { days_visited_in_100: 50, topics_entered: 200, posts_read: 500, posts_created_in_100: 10, likes_received: 50, likes_given: 100, flagged_posts_ratio: 0.05 },
                4: { manual_promotion: true }
            };

            const requirementMeta = {
                topics_entered: { unit: '个', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>` },
                posts_read: { unit: '篇', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>` },
                time_read: { unit: '分钟', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>` },
                days_visited: { unit: '天', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },
                days_visited_in_100: { unit: '天', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },
                posts_created: { unit: '篇', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>` },
                posts_created_in_100: { unit: '篇', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>` },
                likes_received: { unit: '次', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>` },
                likes_given: { unit: '次', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>` },
                has_avatar: { unit: '', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` },
                has_bio: { unit: '', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>` },
                flagged_posts_ratio: { unit: '', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>` }
            };

            /* ========== CSS ========== */
            const styles = `
              :root { --mjj-purple: #7c3aed; --success-color: #00C0A8; --text-color-primary: #1f2937; --text-color-secondary: #6b7280; --bg-color-light: #ffffff; --bg-color-medium: #f7f8fa; --border-color: #e5e7eb; }
              .mjjbox-level-badge { position: fixed; top: 20px; right: 20px; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: #fff; cursor: pointer; z-index: 9999; box-shadow: 0 5px 25px -5px rgba(0,0,0,.3); border: 2px solid #fff; opacity: 0.4 !important; transition: transform .3s, box-shadow .3s, opacity .5s; }
              .mjjbox-level-badge.loaded { opacity: 0.85 !important; }
              .mjjbox-level-badge:hover { transform: scale(1.1); box-shadow: 0 8px 30px -8px rgba(0,0,0,.4); opacity: 1 !important; }
              .mjjbox-level-badge.level-0 { background: linear-gradient(135deg,#9ca3af 0%,#6b7280 100%); }
              .mjjbox-level-badge.level-1 { background: linear-gradient(135deg,#a7b9c9 0%,#7f92a5 100%); }
              .mjjbox-level-badge.level-2 { background: linear-gradient(135deg,#fcc400 0%,#e1a100 100%); }
              .mjjbox-level-badge.level-3 { background: linear-gradient(135deg,#9ae6b4 0%,#38a169 100%); }
              .mjjbox-level-badge.level-4 { background: linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%); }
              .mjjbox-level-modal { position: fixed; inset: 0; background: rgba(0,0,0,.2); z-index: 10000; opacity: 0; visibility: hidden; transition: opacity .35s,visibility .35s; backdrop-filter: blur(8px); }
              .mjjbox-level-modal.show { opacity: 1; visibility: visible; }
              .mjjbox-level-modal.show .mjjbox-level-modal-content { transform: scale(1); opacity: 1; }
              .mjjbox-level-modal-content { position: absolute; top: 60px; right: 88px; background: var(--bg-color-medium); border-radius: 16px; width: 380px; box-shadow: 0 10px 40px -10px rgba(0,0,0,.3); overflow: hidden; transform-origin: top right; transform: scale(0.9); opacity: 0; transition: transform .3s, opacity .3s; }
              .mjjbox-header { padding: 20px 45px 20px 20px; background: linear-gradient(135deg, #438EE2, #3973E0); color: white; display: flex; align-items: center; justify-content: space-between; gap: 10px; position: relative; }
              .mjjbox-user-details { display: flex; align-items: center; gap: 15px; }
              .mjjbox-avatar-link { display: block; line-height: 0; transition: transform 0.2s; border-radius: 50%; }
              .mjjbox-avatar-link:hover { transform: scale(1.1); }
              .mjjbox-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.5); }
              .mjjbox-user-info .username { font-size: 18px; font-weight: bold; margin: 0; }
              .mjjbox-user-title { font-size: 12px; margin: 4px 0; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 8px; display: inline-block; font-weight: 500; }
              .mjjbox-user-info .level { font-size: 14px; margin: 2px 0 0; }
              .mjjbox-rank-info { text-align: right; flex-shrink: 0; }
              .mjjbox-rank-info > div:first-child { margin-bottom: 6px; }
              .mjjbox-rank-info .rank-value { font-size: 18px; font-weight: 700; color: #fff; margin-right: 5px; }
              .mjjbox-rank-info .rank-label { font-size: 12px; opacity: 0.8; }
              .mjjbox-close-btn { position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 24px; cursor: pointer; color: white; opacity: 0.7; transition: opacity 0.2s; }
              .mjjbox-close-btn:hover { opacity: 1; }
              .mjjbox-level-link, .mjjbox-level-link:visited { color: white !important; text-decoration: none; display: inline-block; transition: transform 0.2s, opacity 0.2s; opacity: 0.8; }
              .mjjbox-level-link:hover { transform: scale(1.05); opacity: 1; }
              .mjjbox-body { padding: 0 10px 15px; max-height: calc(80vh - 90px); overflow-y: auto; scrollbar-width: thin; scrollbar-color: #ccc #f7f8fa; }
              .mjjbox-body::-webkit-scrollbar { width: 5px; }
              .mjjbox-body::-webkit-scrollbar-track { background: var(--bg-color-medium); }
              .mjjbox-body::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; }
              .mjjbox-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px 10px; }
              .stat-item { background: linear-gradient(135deg, #5A9BE5, #438EE2); padding: 12px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px -2px rgba(74, 144, 226, 0.4); }
              .stat-item .value, .stat-item .label { color: white; }
              .stat-item .value { font-size: 18px; font-weight: bold; }
              .stat-item .label { font-size: 12px; margin-top: 4px; opacity: 0.8; }
              .mjjbox-progress-title { font-size: 16px; font-weight: 600; color: var(--text-color-primary); padding: 15px 10px 10px; margin: 0; border-top: 1px solid var(--border-color); }
              .mjjbox-progress-list { display: flex; flex-direction: column; gap: 8px; padding: 0 10px; }
              .progress-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--bg-color-light); border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
              .progress-icon svg { width: 20px; height: 20px; color: var(--text-color-secondary); }
              .progress-details { flex-grow: 1; }
              .progress-label { display: flex; justify-content: space-between; font-size: 14px; font-weight: 500; color: var(--text-color-primary); margin-bottom: 5px; }
              .progress-values { font-size: 12px; color: var(--text-color-secondary); }
              .progress-bar { height: 6px; background: #eef2f7; border-radius: 3px; overflow: hidden; }
              .progress-fill { height: 100%; background: linear-gradient(90deg, #438EE2, #3973E0); transition: width .4s; }
              .progress-item.met .progress-fill { background: var(--success-color); }
              .progress-item.met .progress-icon svg { color: var(--success-color); }
              .progress-item.info-only .progress-details { text-align: left; }
              .progress-item.info-only .progress-label { margin-bottom: 0; }
              .mjjbox-notification { position: fixed; top: 90px; right: 24px; padding: 12px 18px; border-radius: 8px; color: #fff; font-weight: 600; z-index: 10001; opacity: 0; transform: translateX(120%); transition: all .3s; }
              .mjjbox-demotion-warning { padding: 10px; margin: 10px 10px 0; font-size: 12px; color: var(--text-color-secondary); background-color: #eef2f7; border-radius: 8px; }
              .mjjbox-checkin-area { padding: 0 10px 10px; }
              .mjjbox-checkin-btn { width: 100%; background: var(--mjj-purple); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; box-shadow: 0 4px 15px -5px var(--mjj-purple); }
              .mjjbox-checkin-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px -5px var(--mjj-purple); }
              .mjjbox-checkin-btn:disabled { background: var(--success-color); box-shadow: 0 4px 15px -5px var(--success-color); cursor: not-allowed; }
              @media (max-width: 480px) {
                .mjjbox-level-badge { top: 85px; right: 15px; bottom: auto; }
                .mjjbox-avatar-link { min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center; }
                .mjjbox-level-modal-content { width: 92vw; max-width: 380px; top: 50%; left: 50%; right: auto; transform: translate(-50%, -50%) scale(0.95); max-height: 90vh; }
                .mjjbox-level-modal.show .mjjbox-level-modal-content { transform: translate(-50%, -50%) scale(1); }
              }
            `;
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);

            /* ========== 帮助函数 ========== */
            const getDiscourseUser = () => unsafeWindow.Discourse?.User?.current();
            const getCurrentUsername = () => getDiscourseUser()?.username || null;
            const getCsrfToken = () => getDiscourseUser()?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.content;

            const formatRank = (rank) => {
                if (rank === null || typeof rank !== 'number') return '--';
                if (rank < 10000) return rank.toString();
                return (rank / 10000).toFixed(1) + 'w';
            };

            const showNotification = (msg, type = 'info', dur = SCRIPT_CONFIG.notificationDuration) => {
                const existingN = document.querySelector('.mjjbox-notification');
                if (existingN) existingN.remove();
                const n = document.createElement('div');
                n.className = 'mjjbox-notification';
                n.style.cssText += `background: ${type === 'error' ? '#ef4444' : (type === 'info' ? '#3b82f6' : '#10b981')};`;
                n.textContent = msg;
                document.body.appendChild(n);
                setTimeout(() => { n.style.opacity = '1'; n.style.transform = 'translateX(0)'; }, 100);
                setTimeout(() => { n.style.opacity = '0'; n.style.transform = 'translateX(120%)'; setTimeout(() => n.remove(), 300); }, dur);
            };

            /* ========== UI 创建 ========== */
            const createLevelBadge = () => {
                const badge = document.createElement('div');
                badge.className = 'mjjbox-level-badge';
                badge.innerHTML = 'LV ?';
                badge.title = '点击加载等级与签到';
                badge.addEventListener('click', () => fetchUserData(false));
                document.body.appendChild(badge);
                return badge;
            };

            const updateLevelBadge = (level, username) => {
                const badge = document.querySelector('.mjjbox-level-badge');
                if (!badge) return;
                badge.innerHTML = `LV ${level}`;
                const currentClasses = badge.className.split(' ').filter(c => !c.startsWith('level-')).join(' ');
                badge.className = `${currentClasses} level-${level}`;
                badge.title = `${username} - ${levelNames[level] || '未知等级'}（点击查看详情）`;
            };

            /* ========== 数据获取 ========== */
            const fetchUserData = async (isRefresh = false) => {
                if (isLoadingData) return;
                isLoadingData = true;
                const username = getCurrentUsername();
                if (!username) { isLoadingData = false; return showNotification('❌ 无法获取当前用户名', 'error'); }
                if (!isRefresh) { showNotification('🔄 正在获取最新数据...', 'info', 1500); }
                try {
                    const [summaryData, userData, checkinData, dailyRankData, allTimeRankData] = await Promise.all([
                        new Promise(resolve => GM_xmlhttpRequest({ method: 'GET', url: `${SCRIPT_CONFIG.baseURL}/u/${username}/summary.json`, headers: { Accept: 'application/json' }, timeout: SCRIPT_CONFIG.requestTimeout, onload: r => resolve(r.status === 200 ? JSON.parse(r.responseText) : null), onerror: () => resolve(null) })),
                        new Promise(resolve => GM_xmlhttpRequest({ method: 'GET', url: `${SCRIPT_CONFIG.baseURL}/u/${username}.json`, headers: { Accept: 'application/json' }, timeout: SCRIPT_CONFIG.requestTimeout, onload: r => resolve(r.status === 200 ? JSON.parse(r.responseText) : null), onerror: () => resolve(null) })),
                        new Promise(resolve => GM_xmlhttpRequest({ method: 'GET', url: `${SCRIPT_CONFIG.baseURL}/checkin.json`, headers: { Accept: 'application/json' }, timeout: SCRIPT_CONFIG.requestTimeout, onload: r => resolve(r.status === 200 ? JSON.parse(r.responseText) : null), onerror: () => resolve(null) })),
                        new Promise(resolve => GM_xmlhttpRequest({ method: 'GET', url: `${SCRIPT_CONFIG.baseURL}/leaderboard/1.json?period=daily`, headers: { Accept: 'application/json' }, onload: r => resolve(r.status === 200 ? JSON.parse(r.responseText) : null), onerror: () => resolve(null) })),
                        new Promise(resolve => GM_xmlhttpRequest({ method: 'GET', url: `${SCRIPT_CONFIG.baseURL}/leaderboard/1.json`, headers: { Accept: 'application/json' }, onload: r => resolve(r.status === 200 ? JSON.parse(r.responseText) : null), onerror: () => resolve(null) }))
                    ]);
                    processUserData(summaryData, userData, checkinData, dailyRankData, allTimeRankData, username);
                } catch (error) {
                    showNotification('❌ 数据请求时发生未知错误', 'error');
                    console.error("Fetch User Data Error:", error);
                } finally {
                    isLoadingData = false;
                }
            };

            const handleRefreshAfterCheckin = async () => {
                if (!getCurrentUsername()) return;
                try {
                    // Refresh all data including ranks
                    fetchUserData(true);
                } catch (error) {
                    showNotification('❌ 刷新签到数据失败', 'error');
                    console.error("Refresh After Checkin Error:", error);
                }
            };

            const processUserData = (summaryData, userData, checkinData, dailyRankData, allTimeRankData, username) => {
                if (!userData || !userData.user) { return showNotification('❌ 获取核心用户数据(user.json)失败', 'error'); }
                const userSummary = summaryData?.user_summary || userData.user?.user_summary;
                if (!userSummary) { return showNotification('❌ 用户摘要数据不完整或格式错误', 'error'); }

                lastFetchedData = { summaryData, userData, checkinData, dailyRankData, allTimeRankData };
                const user = userData.user;
                const dailyRank = dailyRankData?.personal?.position || null;
                const allTimeRank = allTimeRankData?.personal?.position || null;

                if (typeof user.trust_level === 'number') {
                    const level = user.trust_level;
                    updateLevelBadge(level, username);
                    const badge = document.querySelector('.mjjbox-level-badge');
                    if (badge) badge.classList.add('loaded');
                    createLevelModal({
                        level, username, checkinData, dailyRank, allTimeRank,
                        userData: { user, userSummary, gamification_score: user.gamification_score || 0 }
                    });
                } else {
                    showNotification('❌ 无法解析用户等级信息', 'error');
                }
            };

            const calculateLevelProgress = (currentLevel, userData) => {
                if (!userData?.userSummary) return { items: [] };
                const us = userData.userSummary;
                const u = userData.user;
                const next = currentLevel + 1;
                const req = levelRequirements[next];
                if (!req) return { items: [], isMaxLevel: true };
                const items = [];
                const add = (label, current, required, key, title = '') => {
                    const met = current >= required;
                    items.push({ label, current, required, isMet: met, percentage: Math.min((current / required) * 100, 100), key, unit: requirementMeta[key]?.unit || '', title });
                };
                const addBoolean = (label, isMet, key) => {
                    items.push({ label, current: isMet ? '已完成' : '未完成', required: '需完成', isMet, key, unit: '' });
                };
                const addInfo = (label, key) => {
                    items.push({ label, key, isInfo: true });
                };
                if (req.topics_entered !== undefined) add('阅读主题', us.topics_entered || 0, req.topics_entered, 'topics_entered');
                if (req.posts_read !== undefined) add('阅读帖子', us.posts_read_count || 0, req.posts_read, 'posts_read');
                if (req.time_read !== undefined) add('阅读时长', Math.floor((us.time_read || 0) / 60), Math.floor(req.time_read / 60), 'time_read');
                if (req.days_visited !== undefined) add('访问天数', us.days_visited || 0, req.days_visited, 'days_visited');
                if (req.days_visited_in_100 !== undefined) add('⚠️ 近期访问', us.days_visited || 0, req.days_visited_in_100, 'days_visited_in_100', '注意：此为总访问天数(近似值)，非精确的近期数值，仅供参考。');
                if (req.posts_created !== undefined) add('发布主题', us.topic_count || 0, req.posts_created, 'posts_created');
                if (req.posts_created_in_100 !== undefined) add('⚠️ 近期发帖/回复', (us.topic_count || 0) + (us.post_count || 0), req.posts_created_in_100, 'posts_created_in_100', '注意：此为总发帖/回复数(近似值)，非精确的近期数值，仅供参考。');
                if (req.likes_received !== undefined) add('收到点赞', us.likes_received || 0, req.likes_received, 'likes_received');
                if (req.likes_given !== undefined) add('送出点赞', us.likes_given || 0, req.likes_given, 'likes_given');
                if (req.has_avatar !== undefined) addBoolean('设置头像', !!(u.avatar_template && !u.avatar_template.includes('letter_avatar')), 'has_avatar');
                if (req.has_bio !== undefined) addBoolean('填写简介', !!(u.bio_raw && u.bio_raw.trim()), 'has_bio');
                if (req.flagged_posts_ratio !== undefined) addInfo('帖子声誉良好', 'flagged_posts_ratio');
                items.sort((a, b) => a.isMet - b.isMet);
                return { items, isMaxLevel: !levelRequirements[next] };
            };

            const _performCheckinRequest = () => {
                return new Promise((resolve, reject) => {
                    const csrfToken = getCsrfToken();
                    if (!csrfToken) {
                        return reject({ type: 'Auth', message: '无法获取安全令牌，请刷新页面' });
                    }
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${SCRIPT_CONFIG.baseURL}/checkin`,
                        headers: { 'Accept': 'application/json', 'X-CSRF-Token': csrfToken, 'X-Requested-With': 'XMLHttpRequest' },
                        timeout: SCRIPT_CONFIG.requestTimeout,
                        onload: (resp) => {
                            let responseData;
                            try { responseData = JSON.parse(resp.responseText); }
                            catch (e) {
                                if (resp.status === 200) return reject({ type: 'Parse', message: '签到响应格式异常', status: resp.status });
                            }
                            switch (resp.status) {
                                case 200:
                                    responseData.success ? resolve(responseData) : reject({ type: 'API', message: responseData.message || '签到失败', data: responseData });
                                    break;
                                case 403:
                                    reject({ type: 'Auth', message: '权限不足，请重新登录', status: resp.status });
                                    break;
                                case 422:
                                    if (resp.responseText?.includes("already checked in") || resp.responseText?.includes("已经签到过")) {
                                        reject({ type: 'Duplicate', message: '您今天已经签到过了', data: responseData });
                                    } else {
                                        reject({ type: 'Validation', message: '安全验证失败，请刷新页面', status: resp.status });
                                    }
                                    break;
                                default:
                                    reject({ type: 'HTTP', message: `签到失败，服务器响应: ${resp.status}`, status: resp.status });
                            }
                        },
                        onerror: () => reject({ type: 'Network', message: '签到请求失败，请检查网络连接' })
                    });
                });
            };

            const handleCheckin = async (btn) => {
                if (!getCurrentUsername()) return showNotification('❌ 请先登录后再签到', 'error');
                btn.disabled = true;
                btn.textContent = '处理中...';
                try {
                    const result = await _performCheckinRequest();
                    showNotification(`🎉 ${result.message || '签到成功！'}`, 'success');
                    const existingModal = document.querySelector('.mjjbox-level-modal');
                    if (existingModal) {
                        existingModal.classList.remove('show');
                        setTimeout(() => { existingModal.remove(); handleRefreshAfterCheckin(); }, 350);
                    }
                } catch (error) {
                    console.error("签到错误:", error);
                    if (error.type === 'Duplicate') {
                        showNotification(`😅 ${error.message}`, 'info');
                        const existingModal = document.querySelector('.mjjbox-level-modal');
                        if (existingModal) {
                            existingModal.classList.remove('show');
                            setTimeout(() => { existingModal.remove(); handleRefreshAfterCheckin(); }, 350);
                        }
                    } else {
                        showNotification(`❌ ${error.message}`, 'error');
                        btn.disabled = false;
                        btn.textContent = '🚀 立即签到';
                    }
                }
            };

            const runAutomation = async () => {
                if (!settings.auto_checkin && !settings.checkin_reminder) {
                    return;
                }
                const liveStatus = await new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `${SCRIPT_CONFIG.baseURL}/checkin.json`,
                        headers: { Accept: 'application/json' },
                        timeout: SCRIPT_CONFIG.requestTimeout,
                        onload: r => {
                            if (r.status === 200) {
                                try {
                                    const data = JSON.parse(r.responseText);
                                    resolve({ today_checked_in: data.today_checked_in === true });
                                } catch (e) {
                                    console.error("MJJBOX 脚本: 解析 checkin.json 失败。", e);
                                    resolve({ today_checked_in: true });
                                }
                            } else {
                                console.warn(`MJJBOX 脚本: 自动签到状态检查失败, HTTP 状态: ${r.status}`);
                                resolve({ today_checked_in: true });
                            }
                        },
                        onerror: (e) => {
                            console.error("MJJBOX 脚本: 自动签到状态检查网络错误。", e);
                            resolve({ today_checked_in: true });
                        }
                    });
                });
                if (liveStatus.today_checked_in) {
                    console.log("MJJBOX 脚本: 服务器报告今日已签到，自动化任务跳过。");
                    return;
                }
                console.log("MJJBOX 脚本: 服务器报告今日未签到，开始执行自动化任务。");
                if (settings.auto_checkin) {
                    showNotification('🚀 正在尝试自动签到...', 'info', 2000);
                    try {
                        const result = await _performCheckinRequest();
                        showNotification(`✅ 自动签到成功: ${result.message || ''}`, 'success');
                    } catch (error) {
                        if (error.type !== 'Duplicate') {
                            showNotification(`❌ 自动签到失败: ${error.message}`, 'error');
                        }
                    }
                } else if (settings.checkin_reminder) {
                    setTimeout(() => {
                        showNotification('🤔 今日尚未签到，记得点击徽章签到哦！', 'info', 6000);
                    }, 3000);
                }
            };

            const createLevelModal = ({ level, username, userData, checkinData, dailyRank, allTimeRank }) => {
                const oldModal = document.querySelector('.mjjbox-level-modal');
                if(oldModal) oldModal.remove();

                const modal = document.createElement('div');
                modal.className = 'mjjbox-level-modal';
                document.body.appendChild(modal);

                const progress = calculateLevelProgress(level, userData);
                const hasCheckedIn = checkinData?.today_checked_in || false;
                const canCheckIn = checkinData?.can_check_in ?? !hasCheckedIn;
                const isButtonDisabled = hasCheckedIn || !canCheckIn;

                const pointsToday = (checkinData?.checkin_history?.[0]?.points_earned) ?? 0;
                const totalCheckins = checkinData?.user_checkin_count || 0;
                const consecutiveDays = checkinData?.consecutive_days || 0;
                const avatarUrl = userData.user.avatar_template.replace('{size}', '100');
                const userTitle = userData.user.title || '';

                let checkinBtnText = '🚀 立即签到';
                if (hasCheckedIn) {
                    checkinBtnText = `✅ 今日已签到 (获得 ${pointsToday} 积分)`;
                } else if (!canCheckIn) {
                    checkinBtnText = '🚫 无签到权限';
                }

                const currentPoints = userData.gamification_score || 0;

                const content = document.createElement('div');
                content.className = 'mjjbox-level-modal-content';

                content.innerHTML = `
                  <div class="mjjbox-header">
                    <div class="mjjbox-user-details">
                        <a href="${SCRIPT_CONFIG.baseURL}/u/${encodeURIComponent(username)}/summary" target="_blank" class="mjjbox-avatar-link" title="点击查看个人总结页">
                            <img src="${avatarUrl}" alt="avatar" class="mjjbox-avatar" onerror="this.onerror=null; this.src='${SCRIPT_CONFIG.fallbackAvatar}'">
                        </a>
                        <div class="mjjbox-user-info">
                            <h2 class="username">${username}</h2>
                            ${userTitle ? `<p class="mjjbox-user-title">${userTitle}</p>` : ''}
                            <a href="${SCRIPT_CONFIG.permissionsURL}" target="_blank" class="mjjbox-level-link" title="点击查看社区权限对照表">
                                <p class="level">LV${level} ${levelNames[level]}</p>
                            </a>
                        </div>
                    </div>
                    <div class="mjjbox-rank-info">
                        <div>
                            <span class="rank-value">#${formatRank(allTimeRank)}</span>
                            <span class="rank-label">总排名</span>
                        </div>
                        <div>
                            <span class="rank-value">#${formatRank(dailyRank)}</span>
                            <span class="rank-label">今日排名</span>
                        </div>
                    </div>
                    <button class="mjjbox-close-btn">&times;</button>
                  </div>
                  <div class="mjjbox-body">
                    <div class="mjjbox-stats-grid">
                        <div class="stat-item"><div class="value">${totalCheckins} 次</div><div class="label">总签到</div></div>
                        <div class="stat-item"><div class="value">${consecutiveDays} 天</div><div class="label">连续签到</div></div>
                        <div class="stat-item"><div class="value">${currentPoints}</div><div class="label">总积分</div></div>
                    </div>
                    <div class="mjjbox-checkin-area">
                        <button id="do-checkin-btn" class="mjjbox-checkin-btn" ${isButtonDisabled ? 'disabled' : ''}>${checkinBtnText}</button>
                    </div>
                    <h3 class="mjjbox-progress-title">${progress.isMaxLevel ? '🎉 已是最高等级' : `LV${level+1} 晋级进度`}</h3>
                    <div class="mjjbox-progress-list">
                        ${progress.items.map(item => {
                            if (item.isInfo) {
                                return `
                                <div class="progress-item info-only">
                                    <div class="progress-icon">${requirementMeta[item.key]?.icon || ''}</div>
                                    <div class="progress-details">
                                        <div class="progress-label">
                                            <span>${item.label}</span>
                                            <span class="progress-values">由系统自动评估</span>
                                        </div>
                                    </div>
                                </div>`;
                            }
                            return `
                            <div class="progress-item ${item.isMet ? 'met' : ''}" title="${item.title || ''}">
                                <div class="progress-icon">${requirementMeta[item.key]?.icon || ''}</div>
                                <div class="progress-details">
                                    <div class="progress-label">
                                        <span>${item.label}</span>
                                        <span class="progress-values">${item.current}${item.unit} / ${item.required}${item.unit}</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${item.percentage || 0}%"></div>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                    ${(level >= 2 && level < 4) ? `
                      <div class="mjjbox-demotion-warning">
                          💡 <strong>友情提示</strong>：达到 LV3 后，需保持活跃度，否则系统会自动降级哦。
                      </div>
                    ` : ''}
                  </div>
                `;
                modal.appendChild(content);

                setTimeout(() => modal.classList.add('show'), 10);

                const checkinBtn = content.querySelector('#do-checkin-btn');
                if (checkinBtn) { checkinBtn.addEventListener('click', () => handleCheckin(checkinBtn)); }

                const closeModal = () => {
                    modal.classList.remove('show');
                    document.removeEventListener('keydown', escListener);
                    setTimeout(() => { modal.remove(); }, 350);
                };
                const escListener = e => { if (e.key === 'Escape') closeModal(); };
                content.querySelector('.mjjbox-close-btn').addEventListener('click', closeModal);
                modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
                document.addEventListener('keydown', escListener);

                return modal;
            };

            const init = () => {
                let attempts = 0;
                const interval = setInterval(() => {
                    if (typeof unsafeWindow.Discourse?.User?.current === 'function') {
                        clearInterval(interval);
                        console.log("MJJBOX 脚本: Discourse 对象已加载，开始初始化。");

                        createLevelBadge();

                        if (getCurrentUsername()) {
                            setTimeout(() => runAutomation(), 2000);
                        }
                    } else {
                        attempts++;
                        if (attempts >= SCRIPT_CONFIG.maxInitAttempts) {
                            clearInterval(interval);
                            showNotification('❌ 脚本初始化失败，请刷新页面', 'error', 5000);
                            console.error("MJJBOX 脚本: 等待 Discourse 对象超时。");
                        }
                    }
                }, 200);
            };

            if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
            else { init(); }
        })();
    }

    // Function 6: 返回顶部按钮
    if (settings.back_to_top) {
        GM_addStyle(`#back-to-top-btn { position: fixed; bottom: 28px; right: 90px; width: 45px; height: 45px; background-color: var(--primary-medium, #666); color: #fff; border: none; border-radius: 50%; cursor: pointer; display: none; justify-content: center; align-items: center; font-size: 24px; z-index: 9998; opacity: 0.7; transition: opacity 0.3s, background-color 0.3s, transform 0.3s; } #back-to-top-btn:hover { opacity: 1; transform: scale(1.1); background-color: var(--tertiary, #3b82f6); }`);
        const btn = document.createElement('button');
        btn.id = 'back-to-top-btn';
        btn.innerHTML = '↑';
        btn.title = '返回顶部';
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => { if (window.scrollY > 300) { btn.style.display = 'flex'; } else { btn.style.display = 'none'; } });
        btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // Function 7: 自动阅读控件
    if (settings.show_auto_read_controls) {
        // 定义基本URL
        const possibleBaseURLs = [
            "https://mjjbox.com"
        ];
        const commentLimit = 1000;
        const topicListLimit = 100;
        const likeLimit = 50;
        // 获取当前页面的URL
        const currentURL = window.location.href;

        // 确定当前页面对应的BASE_URL
        let BASE_URL = possibleBaseURLs.find((url) => currentURL.startsWith(url));
        console.log("currentURL:", currentURL);
        // 环境变量：阅读网址，如果没有找到匹配的URL，则默认为第一个
        if (!BASE_URL) {
            BASE_URL = possibleBaseURLs[0];
            console.log("默认BASE_URL设置为: " + BASE_URL);
        } else {
            console.log("当前BASE_URL是: " + BASE_URL);
        }

        console.log("脚本正在运行在: " + BASE_URL);

        // 检查是否是第一次运行脚本
        function checkFirstRun() {
            if (localStorage.getItem("isFirstRun") === null) {
                console.log("脚本第一次运行，执行初始化操作...");
                updateInitialData();
                localStorage.setItem("isFirstRun", "false");
            } else {
                console.log("脚本非第一次运行");
            }
        }

        // 更新初始数据的函数
        function updateInitialData() {
            localStorage.setItem("read", "false"); // 开始时自动滚动关闭
            localStorage.setItem("autoLikeEnabled", "false"); //默认关闭自动点赞
            console.log("执行了初始数据更新操作");
        }
        const delay = 2000; // 滚动检查的间隔（毫秒）
        let scrollInterval = null;
        let checkScrollTimeout = null;
        let autoLikeInterval = null;

        function scrollToBottomSlowly(distancePerStep = 20, delayPerStep = 50) {
            if (scrollInterval !== null) {
                clearInterval(scrollInterval);
            }
            scrollInterval = setInterval(() => {
                window.scrollBy(0, distancePerStep);
            }, delayPerStep); // 每50毫秒滚动20像素
        }

        function getLatestTopic() {
            let latestPage = Number(localStorage.getItem("latestPage")) || 0;
            let topicList = [];
            let isDataSufficient = false;

            while (!isDataSufficient) {
                latestPage++;
                const url = `${BASE_URL}/latest.json?no_definitions=true&page=${latestPage}`;

                // This part requires jQuery ($), which might not be available.
                // Using GM_xmlhttpRequest for consistency if jQuery is not guaranteed.
                // However, Discourse sites usually have jQuery.
                if (typeof $ !== 'undefined') {
                    $.ajax({
                        url: url,
                        async: false,
                        success: function (result) {
                            if (
                                result &&
                                result.topic_list &&
                                result.topic_list.topics.length > 0
                            ) {
                                result.topic_list.topics.forEach((topic) => {
                                    if (commentLimit > topic.posts_count) {
                                        topicList.push(topic);
                                    }
                                });
                                if (topicList.length >= topicListLimit) {
                                    isDataSufficient = true;
                                }
                            } else {
                                isDataSufficient = true;
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error(XMLHttpRequest, textStatus, errorThrown);
                            isDataSufficient = true;
                        },
                    });
                } else {
                    console.error("jQuery not found for auto-read function.");
                    isDataSufficient = true; // Stop loop if no jQuery
                }
            }

            if (topicList.length > topicListLimit) {
                topicList = topicList.slice(0, topicListLimit);
            }

            localStorage.setItem("topicList", JSON.stringify(topicList));
        }

        function openNewTopic() {
            let topicListStr = localStorage.getItem("topicList");
            let topicList = topicListStr ? JSON.parse(topicListStr) : [];

            if (topicList.length === 0) {
                getLatestTopic();
                topicListStr = localStorage.getItem("topicList");
                topicList = topicListStr ? JSON.parse(topicListStr) : [];
            }

            if (topicList.length > 0) {
                const topic = topicList.shift();
                localStorage.setItem("topicList", JSON.stringify(topicList));
                if (topic.last_read_post_number) {
                    window.location.href = `${BASE_URL}/t/topic/${topic.id}/${topic.last_read_post_number}`;
                } else {
                    window.location.href = `${BASE_URL}/t/topic/${topic.id}`;
                }
            }
        }

        function checkScroll() {
            if (localStorage.getItem("read") === "true") {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                    console.log("已滚动到底部");
                    openNewTopic();
                } else {
                    scrollToBottomSlowly();
                    if (checkScrollTimeout !== null) {
                        clearTimeout(checkScrollTimeout);
                    }
                    checkScrollTimeout = setTimeout(checkScroll, delay);
                }
            }
        }

        window.addEventListener("load", () => {
            checkFirstRun();
            if (localStorage.getItem("read") === "true") {
                console.log("自动阅读已启用，判断页面类型...");
                if (currentURL.includes('/t/topic/')) {
                    console.log("当前是话题页面，执行滚动逻辑");
                    checkScroll();
                    if (isAutoLikeEnabled()) {
                        autoLike();
                    }
                } else {
                    console.log("当前是列表页面，直接打开新话题");
                    openNewTopic();
                }
            }
        });

        const currentTime = Date.now();
        const defaultTimestamp = new Date("1999-01-01T00:00:00Z").getTime();
        const storedTime = parseInt(localStorage.getItem("clickCounterTimestamp") || defaultTimestamp.toString(), 10);
        let clickCounter = parseInt(localStorage.getItem("clickCounter") || "0", 10);

        if (currentTime - storedTime > 24 * 60 * 60 * 1000) {
            clickCounter = 0;
            localStorage.setItem("clickCounter", "0");
            localStorage.setItem("clickCounterTimestamp", currentTime.toString());
        }

        function triggerClick(button) {
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            button.dispatchEvent(event);
        }

        function autoLike() {
            const buttons = document.querySelectorAll("button.like:not(.user-liked)");
            if (buttons.length === 0) {
                return;
            }
            buttons.forEach((button, index) => {
                if (button.title !== "赞" || clickCounter >= likeLimit) {
                    return;
                }
                autoLikeInterval = setTimeout(() => {
                    triggerClick(button);
                    clickCounter++;
                    localStorage.setItem("clickCounter", clickCounter.toString());
                    if (clickCounter === likeLimit) {
                        localStorage.setItem("autoLikeEnabled", "false");
                    }
                }, index * 3000);
            });
        }

        const button = document.createElement("button");
        button.textContent = localStorage.getItem("read") === "true" ? "停止阅读" : "开始阅读";
        button.style.cssText = "position: fixed; bottom: 10px; left: 10px; z-index: 1000; background-color: #f0f0f0; color: #000; border: 1px solid #ddd; padding: 5px 10px; border-radius: 5px;";
        document.body.appendChild(button);

        button.onclick = function () {
            const currentlyReading = localStorage.getItem("read") === "true";
            const newReadState = !currentlyReading;
            localStorage.setItem("read", newReadState.toString());
            button.textContent = newReadState ? "停止阅读" : "开始阅读";
            if (!newReadState) {
                if (scrollInterval !== null) clearInterval(scrollInterval);
                if (checkScrollTimeout !== null) clearTimeout(checkScrollTimeout);
                scrollInterval = null;
                checkScrollTimeout = null;
                localStorage.removeItem("navigatingToNextTopic");
            } else {
                openNewTopic();
            }
        };

        const toggleAutoLikeButton = document.createElement("button");
        const isAutoLikeEnabled = () => localStorage.getItem("autoLikeEnabled") === "true";
        const setAutoLikeEnabled = (enabled) => localStorage.setItem("autoLikeEnabled", enabled ? "true" : "false");

        toggleAutoLikeButton.textContent = isAutoLikeEnabled() ? "禁用自动点赞" : "启用自动点赞";
        toggleAutoLikeButton.style.cssText = "position: fixed; bottom: 50px; left: 10px; z-index: 1000; background-color: #f0f0f0; color: #000; border: 1px solid #ddd; padding: 5px 10px; border-radius: 5px;";
        document.body.appendChild(toggleAutoLikeButton);

        toggleAutoLikeButton.addEventListener("click", () => {
            const isEnabled = !isAutoLikeEnabled();
            setAutoLikeEnabled(isEnabled);
            toggleAutoLikeButton.textContent = isEnabled ? "禁用自动点赞" : "启用自动点赞";
        });
    }

})();




