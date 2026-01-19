// ==UserScript==
// @name         C6 回复辅助
// @description  C6 用CK自动回复 下注 编辑 引用 点评
// @namespace    http://tampermonkey.net/
// @version      4.3.2
// @match        http*://*/htm_data/*/*/*
// @match        http*://*/htm_mob/*/*/*
// @match        http*://*/thread0806.php?*
// @match        http*://*/read.php?*
// @match        http*://*/profile.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      LGPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563251/C6%20%E5%9B%9E%E5%A4%8D%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/563251/C6%20%E5%9B%9E%E5%A4%8D%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义全局变量和模块命名空间
    var App = {
        utils: {},
        timers: {},
        time: {},
        network: {},
        account: {},
        reply: {},
        replyExtra: {},
        ui: {},
        betting: {}
    };
    var UI = {};
    var accounts = GM_getValue("reply_accounts", []) || [];
    var savedTids = GM_getValue("saved_tids", []) || [];
    var isRunning = false;
    var completedReplies = 0, failedReplies = 0, totalReplies = 0;
    var serverTimeOffset = 0;
    var clockTimer = null;
    var timeFetched = false;

    // 定时器模块 (Timer Handles)
    (function(ns) {
        ns._handles = new Set();
        function createHandle(cancelFn, type = "custom", meta = {}) {
            let cancelled = false;
            const handle = {
                cancel: () => {
                    if (cancelled) return;
                    cancelled = true;
                    try { cancelFn(); } catch(e) { console.error("TimerHandle cancel error:", e); }
                    ns._handles.delete(handle);
                },
                cancelled: () => cancelled,
                type,
                meta
            };
            ns._handles.add(handle);
            return handle;
        }
        ns.createTimeout = function(fn, delay, meta = {}) {
            let handle;
            let id = setTimeout(() => {
                try { fn(); } catch(e) { console.error(e); }
                ns._handles.delete(handle);
            }, delay);
            handle = createHandle(() => clearTimeout(id), "timeout", meta);
            return handle;
        };
        ns.createCustom = function(cancelFn, meta = {}) {
            return createHandle(cancelFn, "custom", meta);
        };
        ns.registerHandle = function(handle) {
            if (!handle || typeof handle.cancel !== 'function') return null;
            ns._handles.add(handle);
            return handle;
        };
        ns.unregisterHandle = function(handle) {
            if (!handle) return;
            ns._handles.delete(handle);
        };
        ns.clearAll = function() {
            const arr = Array.from(ns._handles);
            arr.forEach(h => {
                try { h.cancel(); } catch(e) { console.error(e); }
            });
            ns._handles.clear();
        };
        ns.createHandle = createHandle;
    })(App.timers);

    // 公共工具模块 (Utils)
    (function(ns) {
        ns.addLog = function(msg) {
            if (!UI || !UI.log) return;
            UI.log.style.display = "block";
            UI.log.innerHTML += `<br>${msg}`;
            UI.log.scrollTop = UI.log.scrollHeight;
        };

        ns.safeRequest = function(options) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    ...options,
                    onload: (resp) => resolve({ ok: true, resp }),
                    onerror: (err) => resolve({ ok: false, err }),
                    ontimeout: (err) => resolve({ ok: false, err })
                });
            });
        };

        ns.clearAllTimers = function() {
            try {
                if (App.timers && typeof App.timers.clearAll === 'function') {
                    App.timers.clearAll();
                }
            } catch(e) {
                console.error("clearAllTimers error:", e);
            }
        };

        ns.formatTime = function(dateObj) {
            if (!(dateObj instanceof Date)) return "";
            return dateObj.toLocaleTimeString();
        };

        ns.extractBetTable = function(html) {
            const div = document.createElement("div");
            div.innerHTML = html;
            const postContent = div.querySelector('.tpc_content');
            if (!postContent) return null;
            const table = postContent.querySelector('table');
            if (!table) return null;

            const rows = table.querySelectorAll('tr');
            if (!rows || rows.length === 0) return null;
            const headerCells = rows[0].querySelectorAll('td');
            const hasDraw = Array.from(headerCells).some(c =>
                                                         c.textContent.includes('平局')
                                                        );

            const dataRows = Array.from(rows).slice(1);
            const tableData = [];

            dataRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 0) return;
                if (hasDraw) {
                    tableData.push([
                        (cells[1] && cells[1].textContent.trim()) || "",
                        (cells[2] && cells[2].textContent.trim()) || "",
                        (cells[3] && cells[3].textContent.trim()) || ""
                    ]);
                } else {
                    tableData.push([
                        (cells[1] && cells[1].textContent.trim()) || "",
                        (cells[3] && cells[3].textContent.trim()) || ""
                    ]);
                }
            });

            return tableData;
        };

        ns.getRandomBetResult = function(tableData) {
            const result = [];
            for (let i = 0; i < tableData.length; i++) {
                const row = tableData[i];
                const pick = Math.random() < 0.5 ? 0 : 1;
                result.push(row[pick]);
            }
            return result;
        };

        ns.buildHeaders = function(uaVal, cookieVal, isPost = false, tid = "") {
            const headers = {
                "User-Agent": uaVal || navigator.userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            };

            if (cookieVal) {
                headers["Cookie"] = cookieVal.endsWith(";") ? cookieVal : cookieVal + ";";
            }

            if (isPost) {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
                headers["Origin"] = location.origin;
                headers["Referer"] = `${location.origin}/read.php?tid=${tid}`;
                headers["Cache-Control"] = "max-age=0";
            }

            return headers;
        };
    })(App.utils);

    // 回复扩展功能模块 (点评、编辑、引用)
    (function(ns) {
        function getHeaders(ck, ua, referer) {
            return {
                "Host": location.host,
                "User-Agent": ua || navigator.userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Cookie": (ck ? ck : document.cookie) + "; ismob=0",
                "Referer": referer || location.href
            };
        }
        function gmRequest(opts) {
            return new Promise(res => {
                GM_xmlhttpRequest({
                    method: opts.method || 'GET',
                    url: opts.url,
                    headers: opts.headers || {},
                    data: opts.data,
                    anonymous: true,
                    onload: r => res({ ok: true, resp: r }),
                    onerror: e => res({ ok: false, err: e }),
                    ontimeout: e => res({ ok: false, err: e })
                });
            });
        }
        function calcPage(article) {
            const n = Number(article) || 0;
            if (n <= 24) return 1;
            return Math.floor((n - 25) / 25) + 2;
        }
        function extractPid(htmlText, tid, articleIndex) {
            if (!htmlText) return null;
            const articleStr = String(articleIndex || '').trim();
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                if (articleStr) {
                    const el = doc.querySelector(`[article="${articleStr}"], [data-article="${articleStr}"]`);
                    if (el) {
                        const onclick =
                              el.getAttribute('onclick') ||
                              el.closest('[onclick]')?.getAttribute('onclick') || '';
                        let m = onclick.match(/clickLike\((\d+)\s*,/);
                        if (m) return m[1];

                        const container = el.closest('table, div, tr') || el.parentElement || doc;
                        const aWithPid = container.querySelector('a[href*="pid="], a[href*="post.php?action=modify"], a[id^="like"]');
                        if (aWithPid) {
                            const href = aWithPid.getAttribute('href') || aWithPid.getAttribute('onclick') || '';
                            m = href.match(/pid=(\d+)/) || href.match(/like(\d+)/) || href.match(/(\d{5,})/);
                            if (m) return m[1];
                        }

                        const cont = container.querySelector('[id^="cont"], a[name]');
                        if (cont) {
                            const id = cont.id || cont.getAttribute('name') || '';
                            const mm = id.match(/(?:cont)?(\d{5,})/);
                            if (mm) return mm[1];
                        }
                    }
                }
                const floorEl = Array.from(doc.querySelectorAll('span, a, b'))
                .find(n => (n.textContent || '').includes(`${articleIndex}樓`));
                if (floorEl) {
                    const postContainer = floorEl.closest('table, div, tr') || floorEl.parentElement;
                    if (postContainer) {
                        const anchor = postContainer.querySelector('a[name], [id^="cont"], a[href*="pid="]');
                        if (anchor) {
                            const name = anchor.getAttribute('name') || anchor.id || anchor.getAttribute('href') || '';
                            const mm = name.match(/(\d{5,})/) || name.match(/pid=(\d+)/);
                            if (mm) return mm[1];
                        }
                    }
                }
            } catch (e) {}
            if (articleIndex) {
                const re = new RegExp(`<[^>]+article=["']${articleIndex}["'][\\s\\S]{0,300}?(?:pid=(\\d+)|onclick=["'][^"']*?(\\d{5,})[\\s,])`, 'i');
                const m = htmlText.match(re);
                if (m) return m[1] || m[2];
            }
            let m = htmlText.match(/pid=(\d{5,})/);
            if (m) return m[1];
            m = htmlText.match(/id=["']post_(\d{5,})["']/i);
            if (m) return m[1];
            m = htmlText.match(/var\s+comm(\d+)\s*=\s*\{/i);
            if (m) return m[1];
            return null;
        }
        async function fetchPid(domain, fid, tid, article, ck, ua) {
            const page = calcPage(article);
            const headers = getHeaders(ck, ua, `${domain}/read.php?tid=${tid}`);
            if (page === 1) {
                const now = new Date();
                const yy = String(now.getFullYear()).slice(-2);
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const staticUrl = `${domain}/htm_data/${yy + mm}/${fid}/${tid}.html`;
                const r1 = await gmRequest({ url: staticUrl, headers });
                if (r1.ok && r1.resp.responseText) {
                    const pid = extractPid(r1.resp.responseText, tid, article);
                    if (pid) return { pid, page };
                }
            }
            const url = `${domain}/read.php?tid=${tid}&page=${page}`;
            const r = await gmRequest({ url, headers });
            if (!r.ok) return null;
            const pid = extractPid(r.resp.responseText, tid, article);
            if (!pid) return null;
            return { pid, page };
        }
        async function resolveTouid(domain, fid, tid, pid, article, usernameInput, ck, ua) {
            if (!usernameInput) return null;
            const input = usernameInput.trim().toLowerCase();
            if (!input) return null;
            const win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
            const comm = win && win['comm' + pid];
            if (!comm) return null;
            for (const k of Object.keys(comm)) {
                const c = comm[k];
                if (!c) continue;
                if (c.u && c.u.toLowerCase() === input && c.i) {
                    return String(c.i);
                }
                if (c.tu && c.tu.toLowerCase() === input && c.ti) {
                    return String(c.ti);
                }
            }
            return null;
        }
        async function fetchReplyForm(domain, fid, tid, pid, article, ck, ua) {
            const page = calcPage(article);
            const url = `${domain}/post.php?action=reply&fid=${fid}&tid=${tid}&page=${page}`;
            const r = await gmRequest({
                url,
                headers: getHeaders(ck, ua, url)
            });
            if (!r.ok) return null;
            const html = r.resp.responseText || '';
            const pick = name => {
                const m = html.match(new RegExp(`name=["']${name}["'][^>]*value=["']([^"']*)["']`, 'i'));
                return m ? m[1] : '';
            };
            return {
                verify:   pick('verify'),
                formhash: pick('formhash') || pick('form_hash'),
                posttime: pick('posttime'),
                usesig:   pick('atc_usesign') || '1'
            };
        }
        async function fetchQuoteForm(domain, fid, tid, pid, article, ck, ua) {
            const url = `${domain}/post.php?action=quote&fid=${fid}&tid=${tid}&pid=${pid}&article=${article}`;
            const r = await gmRequest({
                url,
                headers: getHeaders(ck, ua, url)
            });
            if (!r.ok) return null;
            const html = r.resp.responseText || '';
            const pick = name => {
                const m = html.match(new RegExp(`name=["']${name}["'][^>]*value=["']([^"']*)["']`, 'i'));
                return m ? m[1] : '';
            };
            return {
                verify: pick('verify'),
                formhash: pick('formhash') || pick('form_hash'),
                posttime: pick('posttime')
            };
        }
        async function fetchModifyForm(domain, fid, tid, pid, article, ck, ua) {
            const url = `${domain}/post.php?action=modify&fid=${fid}&tid=${tid}&pid=${pid}&article=${article}`;
            const r = await gmRequest({
                url,
                headers: getHeaders(ck, ua, url)
            });
            if (!r.ok) return null;
            const html = r.resp.responseText || '';
            const pick = name => {
                const m = html.match(new RegExp(`name=["']${name}["'][^>]*value=["']([^"']*)["']`, 'i'));
                return m ? m[1] : '';
            };
            return {
                verify:   pick('verify'),
                formhash: pick('formhash') || pick('form_hash'),
                posttime: pick('posttime'),
                usesig:   pick('atc_usesign') || '1'
            };
        }
        async function postComment({ fid, tid, article, content, touid, username, ck, ua }) {
            const domain = location.origin;
            const pidInfo = await fetchPid(domain, fid, tid, article, ck, ua);
            if (!pidInfo) return false;
            const { pid } = pidInfo;
            let realTouid = touid && String(touid).trim();
            if (!realTouid && username) {
                realTouid = await resolveTouid(domain, fid, tid, pid, article, username, ck, ua);
            }
            if (!realTouid) realTouid = "0";
            const form = await fetchReplyForm(domain, fid, tid, pid, article, ck, ua);
            if (!form) return false;
            const body = [
                "atc_money=0",
                "atc_rvrc=0",
                "atc_title=" + encodeURIComponent("回 " + article + " 楼"),
                "atc_usesign=" + encodeURIComponent(form.usesig || "1"),
                "atc_convert=1",
                "atc_autourl=1",
                "atc_content=" + encodeURIComponent(content),
                "step=2",
                "action=comment",
                "fid=" + encodeURIComponent(fid),
                "tid=" + encodeURIComponent(tid),
                "editor=0",
                "pid=" + encodeURIComponent(pid),
                "article=" + encodeURIComponent(article),
                "page=h",
                "touid=" + encodeURIComponent(realTouid),
                "verify=" + encodeURIComponent(form.verify || ""),
                "formhash=" + encodeURIComponent(form.formhash || ""),
                "posttime=" + encodeURIComponent(form.posttime || "")
            ].join("&");
            const postUrl = `${domain}/post.php?action=comment&fid=${fid}&tid=${tid}&pid=${pid}&article=${article}`;
            const res = await gmRequest({
                method: 'POST',
                url: postUrl,
                headers: {
                    ...getHeaders(ck, ua, `${domain}/read.php?tid=${tid}&page=${calcPage(article)}&fpage=1`),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: body
            });
            if (!res.ok) return false;
            const text = res.resp.responseText || '';
            return /回复成功|發貼完畢|回復成功|window\.location|refresh/i.test(text);
        }
        async function postModify({ fid, tid, article, content, ck, ua }) {
            const domain = location.origin;
            const pidInfo = await fetchPid(domain, fid, tid, article, ck, ua);
            if (!pidInfo) return false;
            const { pid } = pidInfo;
            const form = await fetchModifyForm(domain, fid, tid, pid, article, ck, ua);
            if (!form) return false;
            const boundary = "----WebKitFormBoundary" + Math.random().toString(16).slice(2);
            const body =
                  `--${boundary}\r\nContent-Disposition: form-data; name="verify"\r\n\r\n${form.verify}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_title"\r\n\r\n \r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_autourl"\r\n\r\n1\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_usesign"\r\n\r\n${form.usesig}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_convert"\r\n\r\n1\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="transport"\r\n\r\n1\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="md"\r\n\r\n3\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_content"\r\n\r\n${content}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_rvrc"\r\n\r\n0\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="step"\r\n\r\n2\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="pid"\r\n\r\n${pid}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="action"\r\n\r\nmodify\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="fid"\r\n\r\n${fid}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="tid"\r\n\r\n${tid}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="article"\r\n\r\n${article}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="touid"\r\n\r\n\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="special"\r\n\r\n0\r\n` +
                  `--${boundary}--\r\n`;
            const res = await gmRequest({
                method: 'POST',
                url: `${domain}/post.php`,
                headers: {
                    ...getHeaders(ck, ua, `${domain}/post.php?action=modify&fid=${fid}&tid=${tid}&pid=${pid}&article=${article}`),
                    "Content-Type": `multipart/form-data; boundary=${boundary}`
                },
                data: body
            });
            if (!res.ok) return false;
            const text = res.resp.responseText || '';
            return /成功|完成|修改|refresh|window\.location/i.test(text);
        }
        async function postQuote({ fid, tid, article, content, touid, ck, ua }) {
            const domain = location.origin;
            const pidInfo = await fetchPid(domain, fid, tid, article, ck, ua);
            if (!pidInfo) return false;
            const { pid } = pidInfo;
            const form = await fetchQuoteForm(domain, fid, tid, pid, article, ck, ua);
            if (!form) return false;
            const boundary = '----tmQuote' + Date.now();
            const body =
                  `--${boundary}\r\nContent-Disposition: form-data; name="verify"\r\n\r\n${form.verify}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="formhash"\r\n\r\n${form.formhash}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="posttime"\r\n\r\n${form.posttime}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="atc_content"\r\n\r\n${content}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="step"\r\n\r\n2\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="editor"\r\n\r\nwysiwyg\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="pid"\r\n\r\n${pid}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="action"\r\n\r\nquote\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="fid"\r\n\r\n${fid}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="tid"\r\n\r\n${tid}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="article"\r\n\r\n${article}\r\n` +
                  `--${boundary}\r\nContent-Disposition: form-data; name="touid"\r\n\r\n${touid || ''}\r\n` +
                  `--${boundary}--\r\n`;
            const r = await gmRequest({
                method: 'POST',
                url: `${domain}/post.php`,
                headers: {
                    ...getHeaders(ck, ua, `${domain}/post.php?action=quote&fid=${fid}&tid=${tid}&pid=${pid}&article=${article}`),
                    'Content-Type': `multipart/form-data; boundary=${boundary}`
                },
                data: body
            });
            return r.ok;
        }
        ns.postQuote = postQuote;
        ns.postComment = postComment;
        ns.postModify = postModify;
        ns.resolveTouid = resolveTouid;
    })(App.replyExtra);

    // 时间同步模块
    (function(ns) {
        function formatLocalTime(date) {
            if (!(date instanceof Date)) return "";
            return date.toTimeString().split(' ')[0];
        }
        ns.updateTimeDisplay = function() {
            if (!timeFetched || !UI || !UI.timeDisplay) return;
            const now = Date.now();
            const currentServerTime = new Date(now + serverTimeOffset);
            const offsetSec = (serverTimeOffset / 1000).toFixed(2);
            UI.timeDisplay.innerHTML =
                `服务器时间: <b>${formatLocalTime(currentServerTime)}</b> | 误差补偿: ${offsetSec}s`;
        };

        async function singleProbe(fid, tid, cookieVal, uaVal) {
            const start = Date.now();
            const url = `/post.php?action=reply&fid=${fid}&tid=${tid}&_=${start}`;
            try {
                const headResp = await App.utils.safeRequest({
                    method: "HEAD",
                    url,
                    headers: App.utils.buildHeaders(uaVal, cookieVal)
                });
                const endHead = Date.now();
                if (headResp.ok && headResp.resp) {
                    const rawHeaders = headResp.resp.responseHeaders || "";
                    const dateMatch = rawHeaders.match(/Date:\s*(.+?)\r?\n/i);
                    if (dateMatch && dateMatch[1]) {
                        const serverTime = new Date(dateMatch[1]).getTime();
                        const rtt = endHead - start;
                        const estimatedServerTimeAtEnd = serverTime + (rtt / 2);
                        const offset = estimatedServerTimeAtEnd - endHead;
                        return { valid: true, offset, rtt };
                    }
                }
            } catch (e) {}
            try {
                const startGet = Date.now();
                const getResp = await App.utils.safeRequest({
                    method: "GET",
                    url,
                    headers: App.utils.buildHeaders(uaVal, cookieVal)
                });
                const endGet = Date.now();
                if (!getResp.ok || !getResp.resp) return { valid: false };
                const html = getResp.resp.responseText || "";
                let m13 = html.match(/(\d{13})/);
                let m10 = html.match(/(\d{10})/);
                let serverTimestamp = null;
                if (m13) serverTimestamp = parseInt(m13[1], 10);
                else if (m10) serverTimestamp = parseInt(m10[1], 10) * 1000;
                if (!serverTimestamp) {
                    const timeMatch = html.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                    if (timeMatch) {
                        serverTimestamp = new Date(timeMatch[1].replace(/-/g, "/")).getTime();
                    }
                }
                if (!serverTimestamp) return { valid: false };
                const rttGet = endGet - startGet;
                const estimatedServerTimeAtEnd = serverTimestamp + (rttGet / 2);
                const offset = estimatedServerTimeAtEnd - endGet;
                return { valid: true, offset, rtt: rttGet };
            } catch (e) {
                return { valid: false };
            }
        }

        ns.calibrateServerTime = async function() {
            const fid = UI.fidInput.value.trim() || "0";
            const tid = UI.tidInput.value.trim() || "0";
            const cookieVal = UI.cookieInput.value.trim();
            const uaVal = UI.uaInput.value.trim() || navigator.userAgent;

            App.utils.addLog("📡 开始高精度校准 (采样 5 次)...");
            const samples = [];
            const attempts = 5;
            for (let i = 0; i < attempts; i++) {
                const res = await singleProbe(fid, tid, cookieVal, uaVal);
                if (res.valid) {
                    samples.push(res);
                    App.utils.addLog(` - 采样 ${i+1}: RTT ${res.rtt}ms, 偏移 ${(res.offset/1000).toFixed(3)}s`);
                } else {
                    App.utils.addLog(` - 采样 ${i+1}: 无效`);
                }
                await new Promise(r => setTimeout(r, 200 + Math.floor(Math.random() * 300)));
            }
            if (samples.length === 0) {
                App.utils.addLog("❌ 校准失败，未能获取有效样本");
                return;
            }
            const rtts = samples.map(s => s.rtt).sort((a, b) => a - b);
            const medianRtt = rtts[Math.floor(rtts.length / 2)];
            const filtered = samples.filter(s => s.rtt <= Math.max(medianRtt * 2, 1000));
            if (filtered.length === 0) {
                App.utils.addLog("⚠ 所有样本 RTT 异常，使用最小 RTT 样本作为基准");
                filtered.push(samples.reduce((a, b) => a.rtt < b.rtt ? a : b));
            }
            filtered.sort((a, b) => a.rtt - b.rtt);
            const best = filtered[0];

            serverTimeOffset = best.offset;
            timeFetched = true;
            App.utils.addLog(`✔ 校准完成 (最佳 RTT: ${best.rtt}ms, 偏移 ${(best.offset/1000).toFixed(3)}s)`);

            if (clockTimer) clearInterval(clockTimer);
            clockTimer = setInterval(ns.updateTimeDisplay, 1000);
            ns.updateTimeDisplay();
        };

        ns.fetchPageTimeOnOpen = async function() {
            if (timeFetched) return;
            const fid = UI.fidInput.value.trim() || "0";
            const tid = UI.tidInput.value.trim() || "0";
            const cookieVal = UI.cookieInput.value.trim();
            const uaVal = UI.uaInput.value.trim() || navigator.userAgent;
            const res = await singleProbe(fid, tid, cookieVal, uaVal);
            if (!res.valid) return;
            serverTimeOffset = res.offset;
            timeFetched = true;
            if (clockTimer) clearInterval(clockTimer);
            clockTimer = setInterval(ns.updateTimeDisplay, 1000);
            ns.updateTimeDisplay();
        };
        ns._singleProbe = singleProbe;
    })(App.time);

    // 网络请求模块
    (function(ns) {
        ns.getVerify = async function(fid, tid, cookieVal, uaVal, callback) {
            const domain = location.origin;
            const host = location.host;
            const url = `${domain}/post.php?action=reply&fid=${fid}&tid=${tid}&_=${Date.now()}`;
            App.utils.addLog("开始获取 verify...");
            const { ok, resp } = await App.utils.safeRequest({
                method: "GET",
                url,
                anonymous: true,
                headers: {
                    "Host": host,
                    "User-Agent": uaVal,
                    "Cookie": cookieVal + "; ismob=0"
                }
            });
            if (!ok || !resp) {
                App.utils.addLog("❌ 获取 verify 请求失败");
                callback(null);
                return;
            }
            const raw = resp.responseText;
            const match = raw.match(/name=["']verify["'][^>]*value=["']([^"']+)["']/i);
            if (match) {
                const verifyValue = match[1];
                App.utils.addLog(`✔ 成功获取 verify: ${verifyValue}`);
                callback(verifyValue);
            } else {
                App.utils.addLog("❌ 未找到 verify");
                callback(null);
            }
        };
    })(App.network);

    // 账号管理模块
    (function(ns) {
        ns.stopAllReplies = function() {
            App.utils.addLog("⏹ 停止所有回复任务");
            App.utils.clearAllTimers();
            isRunning = false;
            if (UI.stopBtn) UI.stopBtn.disabled = true;
            completedReplies = 0;
            failedReplies = 0;
            totalReplies = 0;
            try { delete window.expectedTriggerTime; } catch(e) {}
        };
        ns.refreshAccountSelect = function() {
            if (!UI.accountSelect) return;
            accounts = accounts.filter(acc => acc && acc.username);
            GM_setValue("reply_accounts", accounts);
            UI.accountSelect.innerHTML = `<option value="">选择账号</option>`;
            accounts.forEach(acc => {
                UI.accountSelect.innerHTML += `<option value="${acc.username}">${acc.username}</option>`;
            });
        };
        ns.moveAccount = function(direction) {
            const name = UI.accountSelect.value;
            if (!name) return;
            const index = accounts.findIndex(acc => acc.username === name);
            if (index < 0) return;
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= accounts.length) return;
            const temp = accounts[index];
            accounts[index] = accounts[newIndex];
            accounts[newIndex] = temp;
            GM_setValue("reply_accounts", accounts);
            ns.refreshAccountSelect();
            UI.accountSelect.value = name;
        };
        ns.fetchUserProfile = async function(cookieVal, uaVal) {
            const domain = location.origin;
            const host = location.host;
            const { ok, resp } = await App.utils.safeRequest({
                method: "GET",
                url: `${domain}/profile.php`,
                anonymous: true,
                headers: {
                    "Host": host,
                    "Connection": "keep-alive",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": uaVal,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Referer": `${domain}/`,
                    "Cookie": cookieVal + (cookieVal.endsWith(";") ? "" : ";") + "ismob=0"
                }
            });
            if (!ok || !resp) {
                App.utils.addLog("❌ 无法访问 profile.php");
                return null;
            }
            const html = resp.responseText || "";
            let username = null, uid = null, title = "";
            let m1 = html.match(/用戶名[:：]\s*([^（<]+)（UID[:：]?\s*(\d+)\s*）/i);
            if (m1) {
                username = m1[1].trim();
                uid = m1[2].trim();
            }
            if (!uid) {
                let uidMatch = html.match(/UID[:：]?\s*(\d+)/i);
                if (uidMatch) uid = uidMatch[1].trim();
            }
            if (!username) {
                let m2 = html.match(/Username[:：]?\s*([^\s<]+)/i);
                if (m2) username = m2[1].trim();
            }
            if (!username) {
                let m3 = html.match(/<title>([^<]+)的个人资料/i);
                if (m3) username = m3[1].trim();
            }
            let titleMatch = html.match(/會員頭銜[:：]\s*([^<\r\n]+)/i);
            if (titleMatch) title = titleMatch[1].trim();
            App.utils.addLog(`✔ 获取账号成功：${username || "未知"} (UID: ${uid || "未知"})`);
            return { username, uid, title };
        };
        ns.getAuthInfo = function() {
            const ckInput = UI.cookieInput.value.trim();
            const uaInput = UI.uaInput.value.trim();
            if (!ckInput) {
                return { ck: document.cookie || "", ua: navigator.userAgent, mode: "browser" };
            }
            if (!uaInput) {
                App.utils.addLog("❌ 填写了 CK，但未填写 UA");
                return null;
            }
            return { ck: ckInput, ua: uaInput, mode: "manual" };
        };
        ns.pad2 = function(n) { return String(n).padStart(2, "0"); };
        ns.formatHMS = function(h, m, s) { return `${ns.pad2(h)}:${ns.pad2(m)}:${ns.pad2(s)}`; };
    })(App.account);

    // 回复任务模块
    (function(ns) {
        ns.highPrecisionSchedule = function(triggerTimeTS, callback, options = {}) {
            const COARSE_MS = options.coarseMs ?? 200;
            const RAF_MS = options.rafMs ?? 50;
            const SPIN_MS = options.spinMs ?? 15;
            const MAX_SPIN_ITER = options.maxSpinIter ?? 2000;
            let cancelled = false;
            let timeoutId = null;
            let rafId = null;
            function now() {
                return Date.now() + serverTimeOffset;
            }
            function clearAll() {
                cancelled = true;
                try { if (timeoutId) clearTimeout(timeoutId); } catch(e) {}
                try { if (rafId) cancelAnimationFrame(rafId); } catch(e) {}
            }
            async function spinLoop(finalTarget) {
                let iter = 0;
                while (!cancelled && now() < finalTarget && iter < MAX_SPIN_ITER) {
                    iter++;
                    if ((iter & 0xFF) === 0) {
                        await new Promise(r => setTimeout(r, 0));
                    }
                }
                if (cancelled) return;
                if (now() >= finalTarget) {
                    try { callback(); } catch(e) { console.error(e); }
                } else {
                    rafWait(finalTarget);
                }
            }
            function rafWait(finalTarget) {
                if (cancelled) return;
                const diff = finalTarget - now();
                if (diff <= 0) {
                    try { callback(); } catch(e) { console.error(e); }
                    return;
                }
                if (diff <= SPIN_MS) {
                    spinLoop(finalTarget);
                    return;
                }
                rafId = requestAnimationFrame(() => rafWait(finalTarget));
            }
            function coarseWait(finalTarget) {
                if (cancelled) return;
                const diff = finalTarget - now();
                if (diff <= 0) {
                    try { callback(); } catch(e) { console.error(e); }
                    return;
                }
                if (diff > COARSE_MS) {
                    const wait = Math.max(diff - COARSE_MS, 0);
                    timeoutId = setTimeout(() => coarseWait(finalTarget), wait);
                } else if (diff > RAF_MS) {
                    rafWait(finalTarget);
                } else if (diff > SPIN_MS) {
                    rafWait(finalTarget);
                } else {
                    spinLoop(finalTarget);
                }
            }
            coarseWait(triggerTimeTS);
            return {
                cancel: clearAll,
                type: 'schedule'
            };
        };

        ns.startReplyHandler = async function() {
            App.utils.addLog("🔥 任务已布署，准备启动...");
            const fid = UI.fidInput.value.trim();
            const tid = UI.tidInput.value.trim();
            const replyBase = UI.textarea.value;
            const startStr = UI.startIndexInput.value.trim();
            const endStr = UI.endIndexInput.value.trim();
            const auth = App.account.getAuthInfo();
            if (!auth) return;
            const ck = auth.ck;
            const ua = auth.ua;
            if (!fid || !tid) { App.utils.addLog("❌ 请填写 fid 和 tid"); return; }
            if (!replyBase) { App.utils.addLog("❌ 请填写回复内容"); return; }
            const startIndex = parseInt(startStr || "1", 10);
            const endIndex = parseInt(endStr || startIndex.toString(), 10);
            const intervalSec = Math.max(parseInt(UI.intervalInput.value.trim() || "2", 10), 1);

            if (UI.hh.value || UI.mm.value || UI.ss.value) {
                const hh = Math.min(Math.max(parseInt(UI.hh.value || "0", 10), 0), 23);
                const mm = Math.min(Math.max(parseInt(UI.mm.value || "0", 10), 0), 59);
                const ss = Math.min(Math.max(parseInt(UI.ss.value || "0", 10), 0), 59);
                App.utils.addLog("🔧 定时任务启动前进行高精度时间校准（采样 5 次）...");
                try {
                    await App.time.calibrateServerTime();
                } catch (e) {
                    App.utils.addLog("⚠ 校准过程中出现异常，继续后续流程");
                }
                let nowServer = new Date(Date.now() + serverTimeOffset);
                let targetTime = new Date(nowServer.getTime());
                targetTime.setHours(hh, mm, ss, 0);
                if (targetTime.getTime() <= nowServer.getTime()) {
                    targetTime = new Date(targetTime.getTime() + 24 * 3600 * 1000);
                    App.utils.addLog(`⚠ 目标时间已过，已自动调整为次日 ${App.account.formatHMS(hh, mm, ss)}`);
                }
                let advanceMsVal = parseInt(UI.advanceMs.value || GM_getValue("lastAdvanceMs", "0"), 10);
                if (isNaN(advanceMsVal) || advanceMsVal < 0) advanceMsVal = 0;
                GM_setValue("lastAdvanceMs", advanceMsVal);
                const triggerTime = targetTime.getTime() - advanceMsVal;
                const triggerDate = new Date(triggerTime);
                const ms = String(triggerDate.getMilliseconds()).padStart(3, "0");
                const expectedText = `${App.account.pad2(triggerDate.getHours())}:${App.account.pad2(triggerDate.getMinutes())}:${App.account.pad2(triggerDate.getSeconds())}.${ms}`;
                window.expectedTriggerTime = triggerTime;
                App.utils.addLog(`⏰ 设定目标: ${App.account.formatHMS(hh, mm, ss)} | 提前: ${advanceMsVal}ms`);
                App.utils.addLog(`🚀 预计发射: ${expectedText}`);
                App.utils.addLog("🕵️ 正在预取 Verify...");
                App.network.getVerify(fid, tid, ck, ua, (verify) => {
                    if (!verify) { App.utils.addLog("❌ 无法获取 verify，任务终止"); return; }
                    const scheduleHandleObj = ns.highPrecisionSchedule(
                        triggerTime,
                        () => {
                            const replyCount = endIndex - startIndex + 1;
                            ns.startReply(fid, tid, replyBase, replyCount, intervalSec, ck, ua, verify, startIndex, endIndex);
                        }
                    );
                    const scheduleHandle = App.timers.createCustom(scheduleHandleObj.cancel, { source: 'highPrecisionSchedule', target: triggerTime });
                    App.timers.registerHandle(scheduleHandle);
                });
            } else {
                App.utils.addLog("⚡ 无定时设置，立即执行...");
                App.network.getVerify(fid, tid, ck, ua, (verify) => {
                    if (!verify) { App.utils.addLog("❌ 无法获取 verify"); return; }
                    const replyCount = endIndex - startIndex + 1;
                    ns.startReply(fid, tid, replyBase, replyCount, intervalSec, ck, ua, verify, startIndex, endIndex);
                });
            }
        };

        ns.startReply = function(fid, tid, replyBase, replyCount, intervalSec, ck, ua, verify, startIndex, endIndex) {
            isRunning = true;
            if (UI.stopBtn) UI.stopBtn.disabled = false;
            totalReplies = replyCount;
            completedReplies = 0;
            failedReplies = 0;
            App.utils.addLog(`🔫 发射！(间隔 ${intervalSec}s)`);
            const launchOne = (idx) => {
                let content = replyBase;
                if (replyCount > 1) content += idx;
                ns.sendReply(fid, tid, content, ck, ua, verify, idx);
            };
            for (let i = startIndex; i <= endIndex; i++) {
                const delay = (i - startIndex) * intervalSec * 1000;
                if (delay === 0) {
                    launchOne(i);
                } else {
                    const handle = App.timers.createTimeout(() => {
                        if (!isRunning) return;
                        launchOne(i);
                    }, delay, { source: 'startReply', index: i, tid });
                    App.timers.registerHandle(handle);
                }
            }
        };

        ns.sendReply = async function(fid, tid, content, ck, ua, verify, index) {
            const domain = location.origin;
            const host = location.host;
            const postData =
                  `atc_usesign=1&atc_convert=1&atc_autourl=1` +
                  `&atc_title=${encodeURIComponent("Re:" + tid)}` +
                  `&atc_content=${encodeURIComponent(content)}` +
                  `&step=2&action=reply&fid=${fid}&tid=${tid}` +
                  `&verify=${encodeURIComponent(verify)}`;
            const reqStart = Date.now();
            const { ok, resp, err } = await App.utils.safeRequest({
                method: "POST",
                url: `${domain}/post.php`,
                anonymous: true,
                headers: {
                    "Host": host,
                    "Connection": "keep-alive",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "Origin": domain,
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": ua,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Referer": `${domain}/read.php?tid=${tid}`,
                    "Cookie": ck + "; ismob=0"
                },
                data: postData
            });
            const reqEnd = Date.now();
            const duration = reqEnd - reqStart;
            if (!ok || !resp) {
                App.utils.addLog(`❌ 回复 ${index} 失败: ${err?.statusText || "网络错误"}`);
                failedReplies++;
                if (completedReplies + failedReplies >= totalReplies) ns.finishTask();
                return { ok: false, reason: err?.statusText || "network error" };
            }
            if (window.expectedTriggerTime) {
                const launchError = reqStart - window.expectedTriggerTime;
                App.utils.addLog(`📐 发射精度误差: ${launchError > 0 ? '+' : ''}${launchError} ms`);
            }
            if (resp.status === 200) {
                App.utils.addLog(`✔ 回复 ${index} 成功 (耗时: ${duration}ms)`);
                if (window.expectedTriggerTime && duration > 200) {
                    App.utils.addLog(`💡 建议下次提前毫秒设为: ${Math.floor(duration/2) + 50} 左右`);
                }
                completedReplies++;
                if (completedReplies + failedReplies >= totalReplies) ns.finishTask();
                return { ok: true, status: resp.status, duration };
            } else {
                App.utils.addLog(`❌ 回复 ${index} 状态异常: ${resp.status}`);
                failedReplies++;
                if (completedReplies + failedReplies >= totalReplies) ns.finishTask();
                return { ok: false, status: resp.status, reason: "status not 200" };
            }
        };

        ns.finishTask = function() {
            isRunning = false;
            if (UI.stopBtn) UI.stopBtn.disabled = true;
            App.utils.addLog(`🎉 任务完成：成功 ${completedReplies}，失败 ${failedReplies}`);
            App.utils.clearAllTimers();
        };

        ns.getBetPointsByTitle = function(title) {
            switch (String(title || "").trim()) {
                case "禁止發言": return 0;
                case "聖騎士": return 30;
                case "精靈王": return 30;
                case "風雲使者": return 40;
                case "光明使者": return 40;
                case "天使": return 50;
                default: return 0;
            }
        };
    })(App.reply);

    // UI 界面构建模块
    (function(ns) {
        ns.init = function() {
            if (!document.body) return false;
            const frag = document.createDocumentFragment();
            const btn = document.createElement("button");
            btn.textContent = "自动回复";
            Object.assign(btn.style, {
                position: "fixed", bottom: "20px", right: "20px",
                zIndex: "999999", padding: "10px 15px",
                background: "#007bff", color: "#fff",
                border: "none", borderRadius: "5px",
                cursor: "pointer", fontSize: "14px"
            });
            frag.appendChild(btn);
            UI.floatBtn = btn;

            const panel = document.createElement("div");
            Object.assign(panel.style, {
                position: "fixed", top: "20px", right: "20px",
                zIndex: "10000", padding: "12px",
                background: "#f8f9fa", border: "1px solid #ccc",
                borderRadius: "6px", display: "none",
                width: "450px", boxSizing: "border-box"
            });
            frag.appendChild(panel);
            UI.panel = panel;

            const title = document.createElement("div");
            title.textContent = "C6多功能脚本 by:9527+10g";
            title.style.cssText = "font-size:14px;font-weight:bold;margin-bottom:8px;";
            panel.appendChild(title);

            const inputStyle = "width:100%;padding:5px;font-size:13px;box-sizing:border-box";
            const textarea = document.createElement("textarea");
            textarea.rows = 5;
            textarea.placeholder = "内容支持多行，点评自动末尾加序号";
            textarea.style.cssText = inputStyle;
            panel.appendChild(textarea);
            UI.textarea = textarea;

            const row2 = document.createElement("div");
            row2.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin:10px 0;";
            panel.appendChild(row2);

            const fidInput = document.createElement("input");
            fidInput.placeholder = "Fid"; fidInput.style.cssText = inputStyle;
            row2.appendChild(fidInput); UI.fidInput = fidInput;

            const tidInput = document.createElement("input");
            tidInput.placeholder = "Tid"; tidInput.style.cssText = inputStyle;
            row2.appendChild(tidInput); UI.tidInput = tidInput;

            const articleInput = document.createElement("input");
            articleInput.placeholder = "楼层（Article）"; articleInput.style.cssText = inputStyle;
            row2.appendChild(articleInput); UI.articleInput = articleInput;

            const modify = document.createElement("button");
            modify.textContent = "提交编辑";
            modify.style.cssText = "padding:4px;background:#28a745;color:white;border:none;border-radius:1px;cursor:pointer;";
            row2.appendChild(modify); UI.modify = modify;

            const row3 = document.createElement("div");
            row3.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin:10px 0;";
            panel.appendChild(row3);

            const usernamInput = document.createElement("input");
            usernamInput.placeholder = "点评用户名(可选)"; usernamInput.style.cssText = inputStyle;
            row3.appendChild(usernamInput); UI.usernamInput = usernamInput;

            const touidInput = document.createElement("input");
            touidInput.placeholder = "点评Uid(可选)"; touidInput.style.cssText = inputStyle;
            row3.appendChild(touidInput); UI.touidInput = touidInput;

            const comment = document.createElement("button");
            comment.textContent = "提交点评";
            comment.style.cssText = "padding:4px;background:#28a745;color:white;border:none;border-radius:1px;cursor:pointer;";
            row3.appendChild(comment); UI.comment = comment;

            const quote = document.createElement("button");
            quote.textContent = "提交引用";
            quote.style.cssText = "padding:4px;background:#28a745;color:white;border:none;border-radius:1px;cursor:pointer;";
            row3.appendChild(quote); UI.quote = quote;

            UI.modify.addEventListener("click", async () => {
                const fid = UI.fidInput.value.trim();
                const tid = UI.tidInput.value.trim();
                const article = UI.articleInput.value.trim();
                const content = UI.textarea.value.trim();
                if (!fid || !tid || !article) {
                    App.utils.addLog("❌ fid / tid / 楼层article 不能为空");
                    return;
                }
                if (!content) {
                    App.utils.addLog("❌ 内容不能为空");
                    return;
                }
                const auth = App.account.getAuthInfo();
                if (!auth) return;
                App.utils.addLog("✏️ 提交编辑");
                const ok = await App.replyExtra.postModify({
                    fid,
                    tid,
                    article,
                    content,
                    ck: auth.ck,
                    ua: auth.ua
                });
                App.utils.addLog(ok ? "✔ 提交成功" : "❌ 提交失败");
            });

            UI.comment.addEventListener("click", async () => {
                const fid = UI.fidInput.value.trim();
                const tid = UI.tidInput.value.trim();
                const article = UI.articleInput.value.trim();
                const content = UI.textarea.value.trim();
                const touid = UI.touidInput.value.trim();
                const username = UI.usernamInput.value.trim();
                if (!fid || !tid) {
                    App.utils.addLog("❌ fid / tid 不能为空");
                    return;
                }
                if (!content) {
                    App.utils.addLog("❌ 内容不能为空");
                    return;
                }
                const auth = App.account.getAuthInfo();
                if (!auth) return;
                App.utils.addLog("💬 提交点评…");
                const ok = await App.replyExtra.postComment({
                    fid,
                    tid,
                    article,
                    content,
                    touid,
                    username,
                    ck: auth.ck,
                    ua: auth.ua
                });
                App.utils.addLog(ok ? "✔ 点评成功" : "❌ 点评失败");
            });

            UI.quote.addEventListener("click", async () => {
                const fid = UI.fidInput.value.trim();
                const tid = UI.tidInput.value.trim();
                const article = UI.articleInput.value.trim();
                const username = UI.usernamInput.value.trim();
                const touid = UI.touidInput.value.trim();
                const content = UI.textarea.value.trim();
                if (!fid || !tid || !article) {
                    App.utils.addLog("❌ fid / tid / 楼层article 不能为空");
                    return;
                }
                if (!content) {
                    App.utils.addLog("❌ 内容不能为空");
                    return;
                }
                const auth = App.account.getAuthInfo();
                if (!auth) return;
                App.utils.addLog("📎 提交引用…");
                const ok = await App.replyExtra.postQuote({
                    fid,
                    tid,
                    article,
                    content,
                    touid,
                    username,
                    ck: auth.ck,
                    ua: auth.ua
                });
                App.utils.addLog(ok ? "✔ 引用成功" : "❌ 引用失败");
            });

            (function autoFillFidTid() {
                const url = location.href;
                const fidParam = url.match(/fid=(\d+)/);
                const tidParam = url.match(/tid=(\d+)/);
                if (fidParam) UI.fidInput.value = fidParam[1];
                if (tidParam) UI.tidInput.value = tidParam[1];
                const pathMatch = url.match(/\/htm_(?:data|mob)\/\d+\/(\d+)\/(\d+)/);
                if (pathMatch) {
                    UI.fidInput.value = pathMatch[1];
                    UI.tidInput.value = pathMatch[2];
                }
                const scripts = document.querySelectorAll("script");
                for (const s of scripts) {
                    const m = s.textContent.match(/var\s+fid\s*=\s*(\d+)/);
                    if (m) { UI.fidInput.value = m[1]; break; }
                }
                const searchLink = document.querySelector("a[href*='search.php?fid=']");
                if (searchLink) {
                    const m = searchLink.href.match(/fid=(\d+)/);
                    if (m) UI.fidInput.value = m[1];
                }
                const replyLink = document.querySelector("a[href*='action=reply'][href*='fid='][href*='tid=']");
                if (replyLink) {
                    const m = replyLink.href.match(/fid=(\d+)&tid=(\d+)/);
                    if (m) {
                        UI.fidInput.value = m[1];
                        UI.tidInput.value = m[2];
                    }
                }
            })();

            const row4 = document.createElement("div");
            row4.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin:10px 0;";
            panel.appendChild(row4);

            const startIndexInput = document.createElement("input");
            startIndexInput.placeholder = "开始序号"; startIndexInput.style.cssText = inputStyle;
            row4.appendChild(startIndexInput); UI.startIndexInput = startIndexInput;

            const endIndexInput = document.createElement("input");
            endIndexInput.placeholder = "结束序号"; endIndexInput.style.cssText = inputStyle;
            row4.appendChild(endIndexInput); UI.endIndexInput = endIndexInput;

            const intervalInput = document.createElement("input");
            intervalInput.placeholder = "间隔(秒)"; intervalInput.type = "number";
            intervalInput.style.cssText = inputStyle;
            row4.appendChild(intervalInput); UI.intervalInput = intervalInput;

            const stopBtn = document.createElement("button");
            stopBtn.textContent = "停止任务";
            stopBtn.style.cssText = "width:100%;padding:6px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;";
            stopBtn.disabled = true;
            row4.appendChild(stopBtn); UI.stopBtn = stopBtn;

            const row5 = document.createElement("div");
            row5.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;";
            panel.appendChild(row5);

            const cookieInput = document.createElement("input");
            cookieInput.placeholder = "Cookie（留空=浏览器）"; cookieInput.style.cssText = inputStyle;
            row5.appendChild(cookieInput); UI.cookieInput = cookieInput;

            const uaInput = document.createElement("input");
            uaInput.placeholder = "UA（留空=浏览器）"; uaInput.style.cssText = inputStyle;
            row5.appendChild(uaInput); UI.uaInput = uaInput;

            const row6 = document.createElement("div");
            row6.style.cssText = "display:grid;grid-template-columns:3fr 1fr 1fr 1fr 1fr;gap:10px;margin:10px 0;";
            panel.appendChild(row6);

            const accountSelect = document.createElement("select");
            accountSelect.style.cssText = "width:100%;padding:6px;font-size:13px;";
            row6.appendChild(accountSelect); UI.accountSelect = accountSelect;

            const saveAccountBtn = document.createElement("button");
            saveAccountBtn.textContent = "保存";
            saveAccountBtn.style.cssText = "padding:6px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;";
            row6.appendChild(saveAccountBtn); UI.saveAccountBtn = saveAccountBtn;

            const deleteAccountBtn = document.createElement("button");
            deleteAccountBtn.textContent = "删除";
            deleteAccountBtn.style.cssText = "padding:6px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;";
            row6.appendChild(deleteAccountBtn); UI.deleteAccountBtn = deleteAccountBtn;

            const upBtn = document.createElement("button");
            upBtn.textContent = "上移";
            upBtn.style.cssText = "padding:6px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;";
            row6.appendChild(upBtn); UI.upBtn = upBtn;

            const downBtn = document.createElement("button");
            downBtn.textContent = "下移";
            downBtn.style.cssText = "padding:6px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;";
            row6.appendChild(downBtn); UI.downBtn = downBtn;

            const row7 = document.createElement("div");
            row7.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin:10px 0;";
            panel.appendChild(row7);

            const hh = document.createElement("input");
            hh.placeholder = "HH"; hh.type = "number"; hh.style.cssText = inputStyle;
            row7.appendChild(hh); UI.hh = hh;

            const mm = document.createElement("input");
            mm.placeholder = "MM"; mm.type = "number"; mm.style.cssText = inputStyle;
            row7.appendChild(mm); UI.mm = mm;

            const ss = document.createElement("input");
            ss.placeholder = "SS"; ss.type = "number"; ss.style.cssText = inputStyle;
            row7.appendChild(ss); UI.ss = ss;

            const advanceMs = document.createElement("input");
            advanceMs.placeholder = "提前毫秒"; advanceMs.type = "number"; advanceMs.style.cssText = inputStyle;
            row7.appendChild(advanceMs); UI.advanceMs = advanceMs;
            UI.advanceMs.value = GM_getValue("lastAdvanceMs", "0");

            const row8 = document.createElement("div");
            row8.style.cssText = "display:grid;grid-template-columns:1fr 2fr;gap:10px;margin:10px 0;";
            panel.appendChild(row8);

            const timeCalibrationBtn = document.createElement("button");
            timeCalibrationBtn.textContent = "校准服务器时间";
            timeCalibrationBtn.style.cssText = "padding:6px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;";
            row8.appendChild(timeCalibrationBtn);
            UI.timeCalibrationBtn = timeCalibrationBtn;

            const timeDisplay = document.createElement("div");
            timeDisplay.style.cssText = "font-size:13px;color:#333;padding-top:6px;";
            row8.appendChild(timeDisplay);
            UI.timeDisplay = timeDisplay;

            const startBtn = document.createElement("button");
            startBtn.textContent = "开始回复";
            startBtn.style.cssText = "width:100%;padding:8px;font-size:14px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;";
            panel.appendChild(startBtn);
            UI.startBtn = startBtn;

            const betRow = document.createElement("div");
            betRow.style.cssText = "display: grid; grid-template-columns: 4fr 1fr; gap: 10px; margin-top: 10px;";
            panel.appendChild(betRow);

            const betBatchBtn = document.createElement("button");
            betBatchBtn.textContent = "批量下注";
            betBatchBtn.style.cssText = "width:100%;padding:8px;font-size:14px;background:#ff5722;color:white;border:none;border-radius:4px;cursor:pointer;";
            betRow.appendChild(betBatchBtn);
            UI.betBatchBtn = betBatchBtn;

            const betPointsInput = document.createElement("input");
            betPointsInput.placeholder = "点数";
            betPointsInput.type = "number";
            let lastBetPoints = GM_getValue("lastBetPoints", 30);
            betPointsInput.value = lastBetPoints;
            betPointsInput.style.cssText = "width:100%;padding:6px;font-size:14px;";
            betRow.appendChild(betPointsInput);
            UI.betPointsInput = betPointsInput;
            betPointsInput.addEventListener("change", () => {
                let val = parseInt(betPointsInput.value.trim() || "30", 10);
                if (![10, 20, 30, 40, 50].includes(val)) {
                    App.utils.addLog("❌ 点数只能输入 10 / 20 / 30 / 40 / 50，已重置为上次有效值");
                    val = lastBetPoints;
                    betPointsInput.value = val;
                } else {
                    lastBetPoints = val;
                    GM_setValue("lastBetPoints", val);
                }
            });

            const log = document.createElement("div");
            Object.assign(log.style, {
                position: "fixed", bottom: "120px", right: "20px",
                zIndex: "9999", width: "300px", maxHeight: "200px",
                overflowY: "auto", padding: "8px",
                background: "rgba(0,0,0,0.8)", color: "#0f0",
                fontSize: "12px", borderRadius: "5px",
                display: "none", boxSizing: "border-box"
            });
            frag.appendChild(log);
            UI.log = log;
            document.body.appendChild(frag);

            UI.floatBtn.addEventListener("click", () => {
                if (UI.panel.style.display === "block") {
                    UI.panel.style.display = "none";
                    UI.log.style.display = "none";
                } else {
                    UI.panel.style.display = "block";
                    UI.log.style.display = "none";
                    App.time.fetchPageTimeOnOpen();
                }
            });

            UI.timeCalibrationBtn.addEventListener("click", App.time.calibrateServerTime);
            UI.stopBtn.addEventListener("click", App.account.stopAllReplies);
            UI.upBtn.addEventListener("click", () => App.account.moveAccount(-1));
            UI.downBtn.addEventListener("click", () => App.account.moveAccount(1));
            UI.startBtn.addEventListener("click", App.reply.startReplyHandler);

            UI.accountSelect.addEventListener("change", () => {
                const name = UI.accountSelect.value;
                const acc = accounts.find(a => a.username === name);
                if (!acc) return;
                UI.cookieInput.value = acc.ck;
                UI.uaInput.value = acc.ua;
                UI.betPointsInput.value = acc.betPoints || 40;
                App.utils.addLog(`✔ 已加载账号：${name}`);
            });

            UI.saveAccountBtn.addEventListener("click", async () => {
                let ck = UI.cookieInput.value.trim();
                let ua = UI.uaInput.value.trim();
                if (!ck) ck = document.cookie || "";
                if (!ua) ua = navigator.userAgent;
                App.utils.addLog("正在访问 profile.php 获取账号信息...");
                const info = await App.account.fetchUserProfile(ck, ua);
                if (!info || !info.uid) {
                    App.utils.addLog("❌ 无法获取 UID，账号未保存");
                    return;
                }
                const idx = accounts.findIndex(acc => acc.uid === info.uid);
                const newAcc = {
                    username: info.username,
                    ck,
                    ua,
                    uid: info.uid,
                    title: info.title,
                    betPoints: App.reply.getBetPointsByTitle(info.title)
                };
                if (idx >= 0) {
                    accounts[idx] = newAcc;
                    App.utils.addLog(`✔ 已更新账号：${info.username} (UID:${info.uid})`);
                } else {
                    accounts.push(newAcc);
                    App.utils.addLog(`✔ 已新增账号：${info.username} (UID:${info.uid})`);
                }
                GM_setValue("reply_accounts", accounts);
                App.account.refreshAccountSelect();
            });

            UI.deleteAccountBtn.addEventListener("click", () => {
                const name = UI.accountSelect.value;
                if (!name) {
                    App.utils.addLog("❌ 未选择账号，无法删除");
                    return;
                }
                const idx = accounts.findIndex(acc => acc.username === name);
                if (idx < 0) {
                    App.utils.addLog("❌ 找不到该账号，无法删除");
                    return;
                }
                accounts.splice(idx, 1);
                App.utils.addLog(`✔ 已删除账号：${name}`);
                GM_setValue("reply_accounts", accounts);
                App.account.refreshAccountSelect();
                UI.cookieInput.value = "";
                UI.uaInput.value = "";
                UI.betPointsInput.value = 40;
            });

            UI.betBatchBtn.addEventListener("click", async () => {
                App.utils.addLog("▶ 开始批量下注流程");
                let ck = UI.cookieInput.value.trim();
                let ua = UI.uaInput.value.trim();
                const acc = accounts.find(a => a.username === UI.accountSelect.value);
                if (!ck) ck = acc?.ck || document.cookie;
                if (!ua) ua = acc?.ua || navigator.userAgent;
                if (acc && acc.betPoints !== undefined) {
                    UI.betPointsInput.value = acc.betPoints;
                }
                const betPoints = parseInt(UI.betPointsInput.value || "40", 10);

                let uid = acc?.uid;
                if (!uid) {
                    App.utils.addLog("▶ 正在获取 UID…");
                    const profile = await App.account.fetchUserProfile(ck, ua);
                    if (!profile || !profile.uid) {
                        App.utils.addLog("❌ 无法获取当前账号 UID");
                        return;
                    }
                    uid = profile.uid;
                    if (acc) {
                        acc.uid = uid;
                        acc.ck = ck;
                        acc.ua = ua;
                        GM_setValue("reply_accounts", accounts);
                    }
                    App.utils.addLog(`✔ 获取账号成功：${profile.username} (UID:${uid})`);
                } else {
                    App.utils.addLog(`✔ 使用已保存 UID：${acc.username} (UID:${uid})`);
                }

                App.utils.addLog("▶ 正在抓取今日有效 tid…");
                const tids = await App.betting.fetchTodayOpenTids(ck, ua, uid);
                if (!tids || tids.length === 0) {
                    App.utils.addLog("❌ 今日没有可下注的 tid");
                    return;
                }
                App.utils.addLog(`✔ 获取到 ${tids.length} 个 tid，开始加载内容…`);
                const previews = [];
                for (const item of tids) {
                    const p = await App.betting.fetchTidBetPreview(item, ck, ua, betPoints);
                    previews.push(p);
                    App.utils.addLog(`✔ 已加载 tid=${item.tid}`);
                }
                ns.showBetPreviewPopup(previews, (finalList) => {
                    if (finalList.length === 0) {
                        App.utils.addLog("❌ 所有内容为空，已取消下注");
                        return;
                    }
                    App.utils.addLog(`▶ 开始下注 ${finalList.length} 个 tid`);
                    App.betting.startBatchBetting(finalList, ck, ua, uid);
                });
            });

            App.time.fetchPageTimeOnOpen();
        };

        ns.showBetPreviewPopup = function(previews, onConfirm) {
            const old = document.getElementById("betPreviewPopup");
            if (old) old.remove();
            previews.sort((a, b) => a.endTime - b.endTime);
            const wrap = document.createElement("div");
            wrap.id = "betPreviewPopup";
            wrap.style.cssText = `
                position: fixed;
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
                width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                background: #fff;
                border: 2px solid #333;
                padding: 15px;
                z-index: 999999;
            `;
            const title = document.createElement("div");
            title.textContent = "批量下注预览（清空表示跳过该 tid）";
            title.style.cssText = "font-size:16px;font-weight:bold;margin-bottom:10px;";
            wrap.appendChild(title);

            const items = [];
            const currentUid = accounts.find(a => a.username === UI.accountSelect.value)?.uid;
            previews.forEach(p => {
                const box = document.createElement("div");
                box.style.cssText = "margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #ccc;";
                const record = savedTids.find(s => s.tid === p.tid);
                const betUids = record ? record.uids : [];
                let statusText = betUids.length > 0
                ? "已下注账号:" + betUids.map(uid => {
                    const acc = accounts.find(a => a.uid === uid);
                    return acc ? acc.username : uid;
                }).join(", ")
                : "未下注";
                const t1 = document.createElement("div");
                t1.textContent = `TID：${p.tid} [${statusText}]`;
                t1.style.cssText = "font-weight:bold;";
                box.appendChild(t1);
                const t2 = document.createElement("div");
                t2.textContent = `标题：${p.title}`;
                t2.style.cssText = "margin-bottom:5px;";
                box.appendChild(t2);

                if (currentUid && betUids.includes(currentUid)) {
                    const info = document.createElement("div");
                    info.textContent = "⚠ 当前账号已下注，不能重复下注";
                    info.style.cssText = "color:red;margin-top:5px;";
                    box.appendChild(info);
                } else {
                    const ta = document.createElement("textarea");
                    ta.style.cssText = "width:100%;height:100px;";
                    ta.value = p.betText;
                    box.appendChild(ta);
                    items.push({ tid: p.tid, contentBox: ta });
                }

                wrap.appendChild(box);
            });

            const btnRow = document.createElement("div");
            btnRow.style.cssText = "text-align:right;margin-top:10px;";
            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "取消";
            cancelBtn.style.cssText = "margin-right:10px;";
            cancelBtn.onclick = () => wrap.remove();
            const okBtn = document.createElement("button");
            okBtn.textContent = "开始下注";
            okBtn.style.cssText = "background:#28a745;color:#fff;padding:5px 10px;";
            okBtn.onclick = () => {
                const finalList = items.map(i => {
                    const raw = i.contentBox.value;
                    const onlyBlank = raw.replace(/\s+/g, "").length === 0;
                    return { tid: i.tid, content: onlyBlank ? "" : raw.trim() };
                }).filter(i => i.content.length > 0);
                wrap.remove();
                onConfirm(finalList);
            };
            btnRow.appendChild(cancelBtn);
            btnRow.appendChild(okBtn);
            wrap.appendChild(btnRow);
            document.body.appendChild(wrap);
        };
    })(App.ui);

    // 投注相关模块
    (function(ns) {
        ns.fetchTodayOpenTids = async function(cookieVal, uaVal, uid) {
            const domain = location.origin;
            const host = location.host;
            const { ok, resp } = await App.utils.safeRequest({
                method: "GET",
                url: `${domain}/thread0806.php?fid=23&search=today`,
                anonymous: true,
                headers: {
                    "Host": host,
                    "User-Agent": uaVal,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Cookie": cookieVal + "; ismob=0"
                }
            });
            if (!ok || !resp) {
                App.utils.addLog("❌ 无法访问 thread0806.php");
                return [];
            }
            const html = resp.responseText;
            const blocks = html.match(/<td class="tal"[\s\S]*?<\/td>/gi) || [];
            const now = Date.now();
            const tids = [];
            for (const block of blocks) {
                if (!block.includes("[開盤]")) continue;
                const tidMatch = block.match(/id=["']t(\d+)["']/);
                if (!tidMatch) continue;
                const tid = tidMatch[1];
                const hrefMatch = block.match(/href=["']([^"']+htm_data[^"']+)["']/);
                let realPath = hrefMatch ? hrefMatch[1] : null;
                const timeMatch = block.match(/下注截止时间：(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
                if (!timeMatch) continue;
                const endTime = new Date(timeMatch[1].replace(/-/g, "/")).getTime();
                tids.push({ tid, url: realPath, endTime });
            }
            savedTids = savedTids.filter(item => item.endTime > now);
            for (const t of tids) {
                if (t.endTime > now) {
                    let record = savedTids.find(s => s.tid === t.tid);
                    if (record) {
                        record.endTime = t.endTime;
                        record.url = t.url;
                    } else {
                        savedTids.push({ tid: t.tid, endTime: t.endTime, url: t.url, uids: [] });
                    }
                }
            }
            GM_setValue("saved_tids", savedTids);
            App.utils.addLog(`✔ 今日有效 tid 数量: ${tids.filter(t => t.endTime > now).length}`);
            return tids.filter(t => t.endTime > now);
        };

        ns.fetchTidBetPreview = async function(item, ck, ua, betPoints) {
            const domain = location.origin;
            const host = location.host;
            const url = item.url ? `${domain}${item.url}` : `${domain}/read.php?tid=${item.tid}`;
            const { ok, resp } = await App.utils.safeRequest({
                method: "GET",
                url,
                anonymous: true,
                headers: {
                    "Host": host,
                    "Connection": "keep-alive",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": ua,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Referer": `${domain}/read.php?tid=${item.tid}`,
                    "Cookie": ck + "; ismob=0"
                }
            });
            if (!ok || !resp) {
                return { tid: item.tid, title: "加载失败", betText: "" };
            }
            const html = resp.responseText;
            let title = "未知标题";
            const m = html.match(/<title>(.*?)<\/title>/i);
            if (m) title = m[1].replace(/ - .*?论坛.*/, "").trim();
            const tableData = App.utils.extractBetTable(html);
            if (!tableData) {
                return { tid: item.tid, title, betText: "" };
            }
            const picks = App.utils.getRandomBetResult(tableData);
            let betText = "";
            picks.forEach((p, i) => {
                betText += `${i+1}.下注球隊：${p}\n`;
            });
            betText += `下注点数：${betPoints}`;
            return { tid: item.tid, title, betText, endTime: item.endTime, url: item.url };
        };

        ns.startBatchBetting = async function(list, ck, ua, uid) {
            if (!list || list.length === 0) {
                App.utils.addLog("❌ 没有可下注的 tid");
                return;
            }
            App.utils.addLog(`▶ 开始批量下注，共 ${list.length} 个`);
            let index = 0, successCount = 0, failCount = 0;
            async function next() {
                if (index >= list.length) {
                    GM_setValue("saved_tids", savedTids);
                    App.utils.addLog(`🎉 批量下注完成：成功 ${successCount} 个，失败 ${failCount} 个`);
                    return;
                }
                const item = list[index++];
                App.utils.addLog(`▶ 正在下注 tid=${item.tid}`);
                App.network.getVerify("23", item.tid, ck, ua, async (verify) => {
                    if (!verify) {
                        App.utils.addLog(`❌ 获取 verify 失败，跳过 tid=${item.tid}`);
                        failCount++;
                        const h = App.timers.createTimeout(next, 2000, { source: 'batchRetry', tid: item.tid });
                        App.timers.registerHandle(h);
                        return;
                    }
                    try {
                        const result = await App.reply.sendReply("23", item.tid, item.content, ck, ua, verify, index);
                        if (result && result.ok) {
                            successCount++;
                            let record = savedTids.find(s => s.tid === item.tid);
                            if (!record) {
                                record = { tid: item.tid, endTime: item.endTime || Date.now() + 86400000, url: item.url || "", uids: [] };
                                savedTids.push(record);
                            }
                            if (!record.uids.includes(uid)) {
                                record.uids.push(uid);
                            }
                            App.utils.addLog(`✔ 下注成功 tid=${item.tid}`);
                        } else {
                            failCount++;
                            App.utils.addLog(`❌ 下注失败 tid=${item.tid} ${(result && result.reason) ? '('+result.reason+')' : ''}`);
                        }
                    } catch (e) {
                        App.utils.addLog(`❌ 下注请求异常 tid=${item.tid}`);
                        failCount++;
                    }
                    const h = App.timers.createTimeout(next, 2000, { source: 'batchNext', tid: item.tid });
                    App.timers.registerHandle(h);
                });
            }
            next();
        };
    })(App.betting);

    // 主流程启动
    App.ui.init();
    App.account.refreshAccountSelect();
    App.time.fetchPageTimeOnOpen();
})();