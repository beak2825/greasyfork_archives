// ==UserScript==
// @name         辅种站点查询助手
// @version      1.0.4
// @author       UndefinedCode
// @description  查询可辅种站点
// @match        https://*/details.php*
// @match        https://totheglory.im/t/*
// @exclude      https://open.cd/*
// @exclude      https://*.m-team.cc/*
// @connect      2025.iyuu.cn
// @connect      iyuu.843294024552.workers.dev
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @namespace https://greasyfork.org/users/1538701
// @downloadURL https://update.greasyfork.org/scripts/556078/%E8%BE%85%E7%A7%8D%E7%AB%99%E7%82%B9%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556078/%E8%BE%85%E7%A7%8D%E7%AB%99%E7%82%B9%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOKEN_KEY = "IYUU_TOKEN_KEY";
    const API_BASE = "https://2025.iyuu.cn";
    const IYUU_API = "https://iyuu.843294024552.workers.dev/iyuu"
    const VERSION = "8.2.0";

    let IYUU_TOKEN = GM_getValue(TOKEN_KEY);
    if (!IYUU_TOKEN) {
        IYUU_TOKEN = prompt("请输入你的 IYUU Token:");
        if (IYUU_TOKEN) {
            GM_setValue(TOKEN_KEY, IYUU_TOKEN);
        } else {
            alert("未输入Token，将无法查询辅种站点");
            return;
        }
    }

    function tryParseJSON(text) {
        try { return JSON.parse(text); } catch (e) { return null; }
    }

    function gmGetJson(url, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers,
                responseType: 'json',
                onload(res) {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res.response ?? tryParseJSON(res.responseText));
                    } else reject({ status: res.status, body: res.response ?? res.responseText });
                },
                onerror: reject
            });
        });
    }

    function gmPostJson(url, data = {}, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: Object.assign({ 'Content-Type': 'application/json', token: IYUU_TOKEN }, headers),
                data: JSON.stringify(data),
                responseType: 'json',
                onload(res) {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res.response ?? tryParseJSON(res.responseText));
                    } else reject({ status: res.status, body: res.response ?? res.responseText });
                },
                onerror: reject
            });
        });
    }

    async function sha1HexOfString(str) {
        const buf = new TextEncoder().encode(str);
        const digest = await crypto.subtle.digest("SHA-1", buf);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function findInfoRange(bytes) {
        let pos = 0, n = bytes.length;
        function parseIntASCII() {
            let s = pos;
            while (pos < n && bytes[pos] >= 0x30 && bytes[pos] <= 0x39) pos++;
            if (s === pos) throw "num";
            return parseInt(new TextDecoder('ascii').decode(bytes.slice(s, pos)), 10);
        }
        function parseString() {
            const len = parseIntASCII();
            if (bytes[pos++] !== 0x3A) throw ":";
            const s = pos; pos += len;
            if (pos > n) throw "EOF";
            return { start: s, end: pos };
        }
        function parseInteger() { pos++; if (bytes[pos] === 0x2D) pos++; while (bytes[pos] !== 0x65) pos++; pos++; }
        function parseList() { pos++; while (bytes[pos] !== 0x65) parseElement(); pos++; }
        function parseDict() {
            pos++;
            while (pos < n && bytes[pos] !== 0x65) {
                const key = parseString();
                const keyStr = new TextDecoder().decode(bytes.slice(key.start, key.end));
                if (keyStr === "info") {
                    const infoStart = pos;
                    parseElement();
                    return { infoStart, infoEnd: pos, finished: true };
                } else parseElement();
            }
            pos++;
            return { finished: false };
        }
        function parseElement() {
            const c = bytes[pos];
            if (c === 0x69) parseInteger();
            else if (c === 0x6C) parseList();
            else if (c === 0x64) {
                const r = parseDict();
                if (r?.finished) return r;
            }
            else if (c >= 0x30 && c <= 0x39) parseString();
            else throw "?";
            return null;
        }

        const r = parseElement();
        if (r?.finished) return r;
        throw "info not found";
    }

    const CACHE_KEY_SITES = "__iyuu_sites_v4";
    const CACHE_TTL_MS = 5 * 60 * 1000;

    function saveSitesCache(obj) {
        try { sessionStorage.setItem(CACHE_KEY_SITES, JSON.stringify({ ts: Date.now(), payload: obj })); } catch (e) { }
    }
    function loadSitesCache() {
        try {
            const raw = sessionStorage.getItem(CACHE_KEY_SITES);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
            return parsed.payload;
        } catch { return null; }
    }

    function normalizeBaseUrl(rawBase, site) {
        if (!rawBase) return null;

        let s = String(rawBase).trim();

        s = s.replace(/^["'](.*)["']$/, "$1");

        const curHost = location.hostname;

        if (s.includes("/")) {
            if (s.startsWith(curHost + "/")){
                s = s.slice(curHost.length + 1);
            }
            else {
                const parts = s.split("/");
                const last = parts.reverse().find(p => p.includes(".") && !p.includes(" "));
                if (last) s = last;
            }
        }

        if (!/^https?:\/\//i.test(s)) s = "https://" + s;

        if (/api\.m-team\.cc/i.test(s)){
            s = s.replace(/api\.m-team\.cc/ig, "kp.m-team.cc");
        }
        const maybe = (site?.nickname || site?.title || "").toLowerCase();
        if ((/m-team/i.test(maybe) || /馒头/.test(maybe)) && /api\.m-team\.cc/i.test(s)){
            s = s.replace(/api\.m-team\.cc/ig, "kp.m-team.cc");
        }

        s = s.replace(/\/+$/, "");

        return s;
    }

    function insertSeedRow(items, note) {
        const tr = document.createElement("tr");
        const th = document.createElement("td");
        th.className = "rowhead nowrap";
        th.textContent = "可辅种站点";

        const td = document.createElement("td");
        td.className = "rowfollow";
        td.style.fontWeight = "bold";
        td.style.color = "#d35400";
        td.style.fontSize = "13px";

        if (!items || !items.length) {
            td.textContent = "无";
        } else {
            items.forEach((it, i) => {
                if (i > 0) td.append(" , ");
                const a = document.createElement("a");
                a.href = it.url;
                a.textContent = it.name;
                a.target = "_blank";
                a.style.color = "#d35400";
                a.style.fontSize = "13px";
                td.appendChild(a);
            });
        }

        if (note) {
            const div = document.createElement("div");
            div.style.fontSize = "8px";
            div.style.color = "#888";
            div.style.marginTop = "4px";
            div.textContent = note;
            td.appendChild(div);
        }

        tr.appendChild(th);
        tr.appendChild(td);

        if (location.hostname.includes("totheglory.im")) {
            const bookmarkTr = document.querySelector('a.bookmark')?.closest("tr");
            if (bookmarkTr && bookmarkTr.parentNode) {
                bookmarkTr.parentNode.insertBefore(tr, bookmarkTr.nextSibling);
                return;
            }
        } else if (location.hostname.includes("hhanclub.top")) {
            const titleDiv = document.createElement("div");
            titleDiv.className = "font-bold leading-6";
            titleDiv.textContent = "可辅种站点";

            const listDiv = document.createElement("div");
            listDiv.style.color = "#d35400";
            listDiv.style.fontWeight = "bold";
            listDiv.style.fontSize = "14px";

            if (!items || !items.length) {
                listDiv.textContent = "无";
            } else {
                items.forEach((it, i) => {
                    if (i > 0) listDiv.append(" , ");
                    const a = document.createElement("a");
                    a.href = it.url;
                    a.textContent = it.name;
                    a.target = "_blank";
                    a.style.fontSize = "14px";
                    a.style.fontWeight = "bold";
                    a.style.color = "#d35400";
                    listDiv.appendChild(a);
                });
            }

            const markLink = document.querySelector('#mark_button')?.closest('a');
            if (markLink) {
                const parentDiv = markLink.parentNode;
                const container = parentDiv.parentNode;
                container.insertBefore(titleDiv, parentDiv.nextSibling);
                container.insertBefore(listDiv, titleDiv.nextSibling);
                return;
            }
    }

        const reportTr = document.querySelector('a[href*="report.php"]')?.closest("tr");
        if (reportTr) reportTr.after(tr);
    }

    async function apiGetSites() {
        const cache = loadSitesCache();
        if (cache) return cache;

        const res = await gmGetJson(`${API_BASE}/reseed/sites/index`, { token: IYUU_TOKEN });
        if (!res || res.code !== 0) throw new Error("apiGetSites 错误: " + res?.msg);
        const map = {};
        res.data?.sites?.forEach(s => map[String(s.id)] = s);
        saveSitesCache(map);
        return map;
    }

    async function apiReportExisting(sidList) {
        const res = await gmPostJson(
            `${API_BASE}/reseed/sites/reportExisting`,
            { sid_list: sidList.map(String) }
        );
        if (res.code !== 0) throw new Error("apiReportExisting 错误: " + res.msg);
        return res.data.sid_sha1;
    }

    async function apiReseed(infoHashList, sidSha1) {
        const sorted = [...infoHashList].sort();
        const json = JSON.stringify(sorted);
        const sha1 = await sha1HexOfString(json);

        const res = await gmPostJson(`${API_BASE}/reseed/index/index`, {
            hash: json,
            sha1,
            sid_sha1: sidSha1,
            timestamp: Math.floor(Date.now() / 1000),
            version: VERSION
        });

        if (res.code !== 0) throw new Error("apiReseed 错误: " + res.msg);
        return res.data;
    }

    async function iyuuApiQuery(hash) {
        const res = await gmGetJson(`${IYUU_API}?hash=${hash}`);
        let code = res?.code ?? res?.response?.code;
        let data = res?.data ?? res?.response?.data;

        if (code !== 0) throw new Error("IYUU_API 错误 : " + res.msg);

        return data.map(it => ({
            name: it.name || it.site_name || it.title,
            url: it.url || it.link
        }));
    }

    async function getTorrentUrl(tid) {
        const curHost = location.hostname;

        if (curHost.includes("totheglory.im")) {
            const a = Array.from(document.querySelectorAll("a.index"))
            .find(el => el.href.endsWith(".torrent") || el.textContent.includes(".torrent"));
            if (a) return new URL(a.getAttribute("href"), location.origin).href;
            throw new Error("未找到 TTG 种子下载链接");
        }

        return `${location.origin}/download.php?id=${tid}`;
    }

    async function main() {
        try {
            let tid = null;

            const ttgMatch = location.pathname.match(/^\/t\/(\d+)\/?/);
            if (ttgMatch) {
                tid = ttgMatch[1];
            }

            if (!tid && location.pathname.includes("details.php")) {
                const url = new URL(location.href);
                tid = url.searchParams.get("id");
            }

            if (!tid) return;

            const cacheKey = "iyuu_hash_" + tid;

            let infoHash = localStorage.getItem(cacheKey);

            const m = document.body.textContent.match(/(?:种子)?Hash(?:码)?[:：]?\s*([a-f0-9]{40})/i);
            if (m) {
                infoHash = m[1];
                localStorage.setItem(cacheKey, infoHash);
            }

            if (!infoHash) {
                try {
                    const dlUrl = await getTorrentUrl(tid);
                    const resp = await fetch(dlUrl, { credentials: "include" });
                    if (!resp.ok) throw new Error("下载失败: " + resp.status);
                    const ab = await resp.arrayBuffer();
                    const bytes = new Uint8Array(ab);
                    const { infoStart, infoEnd } = findInfoRange(bytes);
                    const digest = await crypto.subtle.digest("SHA-1", bytes.slice(infoStart, infoEnd));
                    infoHash = Array.from(new Uint8Array(digest))
                        .map(b => b.toString(16).padStart(2, "0"))
                        .join("");
                    localStorage.setItem(cacheKey, infoHash);
                } catch (e) {
                    insertSeedRow([], "提取 infohash 失败: " + e.message);
                    return;
                }
            }

            let sitesMap, sidSha1, data;
            let fallback = false;
            let errors = [];

            try {
                sitesMap = await apiGetSites();
                sidSha1 = await apiReportExisting(Object.keys(sitesMap));
                data = await apiReseed([infoHash], sidSha1);
            } catch (e) {
                fallback = true;
                errors.push(e);
            }

            if (!fallback && data?.[infoHash]?.torrent?.length) {
                const result = data[infoHash].torrent.map(t => {
                    const site = sitesMap[String(t.sid)];
                    const base = normalizeBaseUrl(site.base_url, site);
                    return {
                        name: site.nickname || site.title || base,
                        url: `${base}/details.php?id=${t.torrent_id}`
                    };
                });
                insertSeedRow(result, "- 结果来源：IYUU API（新版）");
                return;
            }

            // 备用 API
            try {
                const raw = await iyuuApiQuery(infoHash);
                const clean = raw.map(it => {
                    let url = it.url;

                    // 无协议 → 加 https
                    if (!/^https?:\/\//.test(url)) {
                        url = url.replace(location.hostname + "/", "");
                        url = "https://" + url;
                    }
                    url = url.replace(/api\.m-team\.cc/ig, "kp.m-team.cc");

                    return { name: it.name, url };
                });

                insertSeedRow(clean, "- 结果来源：IYUU第三方API");
            } catch (e) {
                errors.push(e);
                insertSeedRow([], `查询失败：${errors.join(" | ")}`);
            }

        } catch (e) {
            insertSeedRow([], "未知错误：" + e);
        }
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
    else main();

})();
