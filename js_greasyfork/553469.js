// ==UserScript==
// @name         不智慧教室
// @version      1.1
// @description  Bypass CORS in private
// @author       singledog
// @match        https://duaa.singledog233.top/*
// @grant        GM_xmlhttpRequest
// @connect      iclass.buaa.edu.cn
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1226768
// @downloadURL https://update.greasyfork.org/scripts/553469/%E4%B8%8D%E6%99%BA%E6%85%A7%E6%95%99%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/553469/%E4%B8%8D%E6%99%BA%E6%85%A7%E6%95%99%E5%AE%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;
    const dlog = (...args) => { if (DEBUG) console.log('[iClass-Userscript]', ...args); };
    dlog('Userscript loaded at', location.href);

    function httpRequest(method, url, { headers = {}, data = null, timeout = 8000 } = {}) {
        dlog('httpRequest:start', { method, url, headers, dataPreview: (typeof data === 'string' ? data.slice(0, 128) : data), timeout });
        return new Promise((resolve, reject) => {
            const t0 = performance.now();
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data,
                timeout,
                onload: (res) => {
                    const dt = (performance.now() - t0).toFixed(1);
                    dlog('httpRequest:onload', { url, status: res.status, timeMs: dt, length: (res.responseText || '').length });
                    try {
                        const json = JSON.parse(res.responseText || '{}');
                        dlog('httpRequest:json', json);
                        resolve(json);
                    } catch (e) {
                        dlog('httpRequest:parse-error', e);
                        resolve({ STATUS: '1', message: '响应非JSON', raw: res.responseText });
                    }
                },
                onerror: (e) => {
                    dlog('httpRequest:onerror', e);
                    reject(new Error('网络错误'));
                },
                ontimeout: () => {
                    dlog('httpRequest:timeout', { url, timeout });
                    reject(new Error('请求超时'));
                },
            });
        });
    }

    function toQuery(params) {
        const usp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => usp.append(k, v));
        return usp.toString();
    }

    // 登录
    async function login(studentId) {
        dlog('login:start', { studentId });
        const url = `https://iclass.buaa.edu.cn:8346/app/user/login.action?` + toQuery({
            password: '',
            phone: studentId,
            userLevel: '1',
            verificationType: '2',
            verificationUrl: '',
        });
        const res = await httpRequest('GET', url);
        dlog('login:done', res);
        return res;
    }

    // 课表查询
    async function getSchedule(userId, sessionId, dateStr) {
        dlog('getSchedule:start', { userId, sessionIdPreview: (sessionId || '').slice(0, 6) + '...', dateStr });
        const url = `https://iclass.buaa.edu.cn:8346/app/course/get_stu_course_sched.action?` + toQuery({
            dateStr,
            id: userId,
        });
        const res = await httpRequest('GET', url, { headers: { sessionId } });
        dlog('getSchedule:done', res);
        return res;
    }

    // 签到
    async function sign(userId, courseSchedId) {
        dlog('sign:start', { userId, courseSchedId });
        const tsMs = Date.now();
        const url = `http://iclass.buaa.edu.cn:8081/app/course/stu_scan_sign.action?courseSchedId=${encodeURIComponent(courseSchedId)}&timestamp=${tsMs}`;
        const body = toQuery({ id: userId }); // 表单方式
        const res = await httpRequest('POST', url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: body,
        });
        dlog('sign:done', res);
        return res;
    }

    // 使用 postMessage 监听来自页面的请求，并回传处理结果
    window.addEventListener('message', async (ev) => {
        try {
            const data = ev.data || {};
            if (!data.__ICLASS_MSG__) return;
            const { type, id, payload } = data;
            dlog('message:received', { type, id, payload });

            if (type === 'iclass:intranet:query') {
                const { studentId, dateStr } = payload || {};
                try {
                    const loginRes = await login(studentId);
                    if (loginRes.STATUS !== '0') {
                        dlog('query:login-failed', loginRes);
                        window.postMessage({ __ICLASS_MSG__: true, type: 'iclass:intranet:query:result', id, payload: { login: loginRes, schedule: { STATUS: '1', message: '登录失败' } } }, '*');
                        return;
                    }
                    const userId = loginRes.result?.id;
                    const sessionId = loginRes.result?.sessionId;
                    const scheduleRes = await getSchedule(userId, sessionId, dateStr);
                    dlog('query:success');
                    window.postMessage({ __ICLASS_MSG__: true, type: 'iclass:intranet:query:result', id, payload: { login: loginRes, schedule: scheduleRes } }, '*');
                } catch (e) {
                    dlog('query:error', e);
                    window.postMessage({ __ICLASS_MSG__: true, type: 'iclass:intranet:query:result', id, payload: { login: { STATUS: '1', message: e.message }, schedule: { STATUS: '1', message: e.message } } }, '*');
                }
            }

            if (type === 'iclass:intranet:signin') {
                const { studentId, courseSchedId } = payload || {};
                try {
                    const loginRes = await login(studentId);
                    if (loginRes.STATUS !== '0') {
                        dlog('signin:login-failed', loginRes);
                        window.postMessage({ __ICLASS_MSG__: true, type: 'iclass:intranet:signin:result', id, payload: { STATUS: '1', message: '登录失败' } }, '*');
                        return;
                    }
                    const userId = loginRes.result?.id;
                    const signRes = await sign(userId, courseSchedId);
                    dlog('signin:success');
                    window.postMessage({ __ICLASS_MSG__: true, type: 'iclass:intranet:signin:result', id, payload: signRes }, '*');
                } catch (e) {
                    dlog('signin:error', e);
                    window.postMessage({ __ICLASS_MSG__: true, type: 'iclass:intranet:signin:result', id, payload: { STATUS: '1', message: e.message } }, '*');
                }
            }
        } catch (err) {
            dlog('message:handler-error', err);
        }
    });

})();