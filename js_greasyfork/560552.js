// ==UserScript==
// @name         TronClass Tool
// @namespace    ShanksSU
// @author       ShanksSU
// @version      0.1.1
// @description  Just TronClass Tool
// @match        https://eclass.yuntech.edu.tw/*
// @match        https://webapp.yuntech.edu.tw/WebNewCAS/TeachSurvey/*
// @icon         https://eclass.yuntech.edu.tw/static/assets/images/favicon-b420ac72.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560552/TronClass%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/560552/TronClass%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

const globalCss = `
        .clickable-area, .list-item .detail, .list-item, .title-wrapper, .forum-list-content-item,
        .list-item-for-exams, .exam-name-column, .topic-summary, .topic-title, .learning-activity,
        .todo-list {
            position: relative !important;
        }

        /* 覆蓋層連結 */
        a.tron-overlay-link {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important;
            z-index: 50 !important;
            text-decoration: none !important;
            background: rgba(0,0,0,0);
            cursor: pointer !important;
        }

        .expand-collapse-attachments {
            position: relative !important;
            z-index: 60 !important; /* 高於 overlay 的 50 */
            cursor: pointer !important;
        }

        .attachments, .attachments-wrapper, .attachment-row {
            position: relative !important;
            z-index: 60 !important;
        }

        .attachment-operations a, .attachment-operations i {
            position: relative !important;
            z-index: 61 !important;
        }

        .activity-operations-container {
            position: relative !important;
            z-index: 60 !important;
        }
    `;

    const style = document.createElement('style');
    style.innerHTML = globalCss;
    document.head.appendChild(style);

    const delay = ms => new Promise(r => setTimeout(r, ms));

    const waitElementLoad = async (sel, count = 1, limit = 0, ms = 200) => {
        let el, t = 0;
        while ((el = document.querySelectorAll(sel)).length < count) {
            if (limit && ++t > limit) throw `Timeout: ${sel}`;
            await delay(ms);
        }
        return count === 1 ? el[0] : el;
    };

    const requests = opt => new Promise((ok, err) => GM_xmlhttpRequest({
        ...opt, responseType: opt.type || "", onload: ok, onerror: err, onabort: err, ontimeout: err
    }));

    // 影片速刷
    class TronVideoTask {
        constructor(targetElement, dependencies) {
            this.element = targetElement;
            this.requests = dependencies.requests;
            this.delay = dependencies.delay || ((ms) => new Promise(r => setTimeout(r, ms)));
            this.config = { chunkSize: 120, randomize: true, retryCount: 3 };
            this.state = { userId: null, orgId: null, courseId: null, activityId: null, totalDuration: 0, currentProgress: 0, requiredProgress: 0 };
        }
        async init() {
            try {
                const timeParts = this.element.innerText.split(":").map(Number);
                this.state.totalDuration = timeParts.reduce((acc, curr, index) => {
                    const multipliers = timeParts.length === 3 ? [3600, 60, 1] : [60, 1];
                    return acc + curr * multipliers[index];
                }, 0);
                const urlCourse = location.href.match(/(?<=course\/)\d+/);
                const urlActivity = location.href.split('/').pop();
                if (typeof st !== 'undefined' && st.userId) {
                    this.state.userId = st.userId; this.state.orgId = st.orgId;
                    this.state.courseId = st.tags?.course_id || urlCourse; this.state.activityId = st.tags?.activity_id || urlActivity;
                } else {
                    const res = await this.requests({ method: "get", url: "/api/profile", type: "json" });
                    this.state.userId = res.response.id; this.state.orgId = res.response.org.id;
                    this.state.courseId = urlCourse; this.state.activityId = urlActivity;
                }
                const completionEl = document.querySelector(".completion-criterion > .attribute-value");
                this.state.requiredProgress = completionEl ? Number(completionEl.innerText.match(/\d+(?=%)/)) : 100;
                const progressRes = await this.requests({ method: "POST", url: `/api/course/activities-read/${this.state.activityId}`, type: "json" });
                this.state.currentProgress = progressRes.response.data?.completeness || 0;
                console.log(`[Video] ID:${this.state.activityId} 進度:${this.state.currentProgress}%`);
                return true;
            } catch (e) { console.error("[Video] Init Failed", e); return false; }
        }
        async run() {
            if (!await this.init()) return;
            await this.logAction("view");
            if (this.state.currentProgress >= this.state.requiredProgress) return;
            const titleEl = document.querySelector("span.title");
            const origTitle = titleEl ? titleEl.innerText : "";
            let nowTime = Math.floor(this.state.totalDuration * 0.01 * Math.max(this.state.currentProgress - 5, 0));
            while (nowTime < this.state.totalDuration) {
                let duration = this.config.chunkSize;
                if (this.config.randomize) duration -= Math.floor(Math.random() * 60);
                if (this.state.totalDuration - nowTime < 120) duration = this.state.totalDuration - nowTime;
                let newTime = nowTime + duration;
                if (newTime > this.state.totalDuration) newTime = this.state.totalDuration;
                try {
                    const res = await this.sendProgressPacket(nowTime, newTime, duration);
                    const completeness = res.response.data.completeness;
                    if (titleEl) titleEl.innerHTML = `<b>[速刷中] ${completeness}%</b> ${origTitle}`;
                    nowTime = newTime;
                    if (completeness >= 100) break;
                } catch (err) { await this.delay(1000); }
            }
            await this.delay(500); location.reload();
        }
        async sendProgressPacket(start, end, duration) {
            const readPromise = this.requests({ method: "POST", url: `/api/course/activities-read/${this.state.activityId}`, data: JSON.stringify({ start, end }), headers: { "Content-Type": "application/json" }, type: "json" });
            const statVideoPromise = this.requests({ method: "post", url: "/statistics/api/online-videos", data: JSON.stringify({ user_id: this.state.userId, org_id: this.state.orgId, course_id: this.state.courseId, activity_id: this.state.activityId, action_type: "play", ts: Date.now(), start_at: start, end_at: end, duration: duration }) });
            const statVisitPromise = this.requests({ method: "post", url: "/statistics/api/user-visits", data: JSON.stringify({ user_id: String(this.state.userId), org_id: this.state.orgId, course_id: String(this.state.courseId), visit_duration: duration }) });
            const [res] = await Promise.all([readPromise, statVideoPromise, statVisitPromise]);
            return res;
        }
        async logAction(actionType) {
            return this.requests({ method: "post", url: "/statistics/api/online-videos", data: JSON.stringify({ user_id: this.state.userId, org_id: this.state.orgId, course_id: this.state.courseId, activity_id: this.state.activityId, action_type: actionType, ts: Date.now() }) });
        }
    }

    // 教學評量
    class TeachSurveyTask {
        run() {
            const satisfactionInputs = document.querySelectorAll('input[type="radio"][name*="RB_Satisfaction"][value="5"]');
            satisfactionInputs.forEach((input) => { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); });
            const relationInputs = document.querySelectorAll('input[type="radio"][name*="Relation"][value="4"]');
            relationInputs.forEach((input) => { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); });
            if (satisfactionInputs.length > 0) this.showNotification(`已勾選: ${satisfactionInputs.length} 滿意`);
        }
        showNotification(msg) {
            const div = document.createElement("div");
            div.style.cssText = "position:fixed; top:10px; right:10px; background:green; color:white; padding:10px; z-index:9999; border-radius:5px;";
            div.innerText = msg; document.body.appendChild(div); setTimeout(() => div.remove(), 3000);
        }
    }

    // 連結
    class UniversalLinkFixer {
        constructor(config, dependencies) {
            this.config = config;
            this.requests = dependencies.requests;
            this.observer = null;
            this.dataList = [];
        }

        async run() {
            const courseIdMatch = location.href.match(/course\/(\d+)/);
            const courseId = courseIdMatch ? courseIdMatch[1] : null;

            if (this.config.api) {
                try {
                    const apiUrl = this.config.api.getUrl(courseId, location.href);
                    const res = await this.requests({method: "GET", url: apiUrl, type: "json"});
                    this.dataList = this.config.api.parser(res.response) || [];
                    console.log(`[LinkFixer] ${this.config.name}: 獲取 ${this.dataList.length} 筆資料`);
                } catch (e) { console.error(`[LinkFixer] API Error`, e); return; }
            }

            this.process(courseId);
            this.observer = new MutationObserver(() => this.process(courseId));
            const container = document.querySelector("#main-content") || document.body;
            this.observer.observe(container, { childList: true, subtree: true, attributes: true });
            setInterval(() => { this.process(courseId); }, 2000);
        }

        process(courseId) {
            document.querySelectorAll(this.config.itemSelector).forEach(item => {
                let targetContainer = item;
                if (this.config.containerSelector === "null") {
                    targetContainer = item;
                } else if (this.config.containerSelector && this.config.containerSelector.startsWith('closest:')) {
                    const selector = this.config.containerSelector.replace('closest:', '');
                    const titleEl = item.querySelector(this.config.titleSelector);
                    if (titleEl) targetContainer = titleEl.closest(selector);
                } else if (this.config.containerSelector) {
                    targetContainer = item.querySelector(this.config.containerSelector);
                }

                if (!targetContainer || targetContainer.querySelector('a.tron-overlay-link')) return;

                let targetUrl = null;

                if (this.config.mode === 'API') {
                    const titleEl = item.querySelector(this.config.titleSelector);
                    if (!titleEl) return;
                    const titleText = titleEl.innerText.trim();
                    const info = this.dataList.find(d => (d.title || '通用討論區').trim() === titleText);

                    if (info) {
                        const cid = info.course_id || courseId;
                        targetUrl = this.config.urlGenerator(cid, info.id, info);
                    }

                } else if (this.config.mode === 'DOM') {
                    const info = this.config.domParser(item);
                    if (info && info.id && info.type) {
                        targetUrl = this.config.urlGenerator(courseId, info.id, info.type);
                    }
                }

                if (targetUrl) {
                    this.injectOverlay(targetContainer, targetUrl);
                }
            });
        }

        injectOverlay(container, url) {
            const overlayLink = document.createElement('a');
            overlayLink.href = url;
            overlayLink.target = "_blank";
            overlayLink.className = 'tron-overlay-link';
            overlayLink.addEventListener("click", (e) => { e.stopPropagation(); }, true);
            container.appendChild(overlayLink);
        }
    }

    const currentUrl = location.href;

if (currentUrl.includes("webapp.yuntech.edu.tw/WebNewCAS/TeachSurvey")) {
        waitElementLoad('input[type="radio"]', 1, 30, 200).then(() => { new TeachSurveyTask().run(); });
    } else {

        let fixerConfig = null;

        if (currentUrl.includes("user/index")) {
            fixerConfig = {
                name: "Todo List",
                mode: "API",
                itemSelector: ".todo-list",
                titleSelector: ".todo-title span",
                containerSelector: "null",
                api: {
                    getUrl: () => `/api/todos`,
                    parser: (res) => res.todo_list
                },
                urlGenerator: (cid, id, info) => {
                    if (info.type === 'homework') return `/course/${cid}/learning-activity#/${id}`;
                    if (info.type === 'exam') return `/course/${cid}/learning-activity#/exam/${id}`;
                    if (info.type === 'questionnaire') return `/course/${cid}/learning-activity/full-screen#/questionnaire/${id}`;
                    return `/course/${cid}/learning-activity/full-screen#/${id}`;
                }
            };
        } else if (currentUrl.includes("homework#/")) {
            fixerConfig = {
                name: "Homework List",
                mode: "API",
                itemSelector: ".list-item",
                titleSelector: ".shorten-title",
                containerSelector: "closest:.detail",
                api: {
                    getUrl: (cid) => `/api/courses/${cid}/homework-activities?page_size=200`,
                    parser: (res) => res.homework_activities
                },
                urlGenerator: (cid, id) => `/course/${cid}/learning-activity#/${id}`
            };
        } else if (currentUrl.includes("exam#/")) {
            fixerConfig = {
                name: "Exam List",
                mode: "API",
                itemSelector: ".list-item-for-exams",
                titleSelector: ".shorten-title",
                containerSelector: "closest:.exam-name-column",
                api: {
                    getUrl: (cid) => `/api/courses/${cid}/exam-list?page_size=200`,
                    parser: (res) => res.exams
                },
                urlGenerator: (cid, id) => `/course/${cid}/learning-activity#/exam/${id}`
            };
        } else if (currentUrl.includes("questionnaire#/")) {
            fixerConfig = {
                name: "Questionnaire List",
                mode: "API",
                itemSelector: ".list-item-for-exams",
                titleSelector: ".shorten-title",
                containerSelector: "null",
                api: {
                    getUrl: (cid) => `/api/courses/${cid}/questionnaire-list?page_size=200`,
                    parser: (res) => res.questionnaires
                },
                urlGenerator: (cid, id) => `/course/${cid}/learning-activity/full-screen#/questionnaire/${id}`
            };
        } else if (currentUrl.includes("topic-category/")) {
            fixerConfig = {
                name: "Forum Topics",
                mode: "API",
                itemSelector: ".topic-summary",
                titleSelector: ".topic-title a",
                containerSelector: "null",
                api: {
                    getUrl: (cid, url) => {
                        const match = url.match(/topic-category\/(\d+)/);
                        return `/api/forum/categories/${match ? match[1] : 0}?page=1&page_size=100`;
                    },
                    parser: (res) => res.result ? res.result.topics : []
                },
                urlGenerator: (cid, id) => `/course/${cid}/forum#/topics/${id}`
            };
        } else if (currentUrl.includes("forum#/")) {
            fixerConfig = {
                name: "Forum Categories",
                mode: "API",
                itemSelector: ".forum-list-content-item",
                titleSelector: ".forum-category-title",
                containerSelector: "null",
                api: {
                    getUrl: (cid) => `/api/courses/${cid}/topic-categories?page_size=200`,
                    parser: (res) => res.topic_categories
                },
                urlGenerator: (cid, id) => `/course/${cid}/forum#/topic-category/${id}`
            };
        } else if (currentUrl.includes("/course/")) {
            fixerConfig = {
                name: "Main Syllabus",
                mode: "DOM",
                itemSelector: ".learning-activity",
                titleSelector: ".title, .name",
                containerSelector: "closest:.clickable-area",
                domParser: (item) => {
                    const idMatch = item.id.match(/learning-activity-(\d+)/);
                    if (!idMatch) return null;
                    let type = null;
                    const typeEl = item.querySelector('*[ng-switch-when]');
                    if (typeEl) type = typeEl.getAttribute('ng-switch-when');
                    if (!type) {
                        const icon = item.querySelector('i.font[class*="font-syllabus-"]');
                        if (icon) {
                            const match = icon.className.match(/font-syllabus-([a-z_]+)/);
                            if (match) { type = match[1]; if (type === 'ask-question') type = 'forum'; }
                        }
                    }
                    if (!type || ['module', 'chapter', 'default'].includes(type)) return null;
                    return { id: idMatch[1], type: type };
                },
                urlGenerator: (cid, id, type) => {
                    if (type === 'exam') return `/course/${cid}/learning-activity#/exam/${id}`;
                    if (type === 'homework') return `/course/${cid}/learning-activity#/${id}`;
                    if (type === 'questionnaire') return `/course/${cid}/learning-activity/full-screen#/questionnaire/${id}`;
                    return `/course/${cid}/learning-activity/full-screen#/${id}`;
                }
            };
        }

        if (fixerConfig) {
            setTimeout(() => {
                new UniversalLinkFixer(fixerConfig, { requests }).run();
            }, 1000);
        }

        waitElementLoad("span[ng-bind='ui.duration|formatTime']", 1, 50, 200)
            .then((element) => {
                console.log("偵測到影片，準備速刷...");
                new TronVideoTask(element, { requests, delay }).run();
            }).catch(() => {});
    }
})();