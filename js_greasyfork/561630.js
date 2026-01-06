// ==UserScript==
// @name         HKUST Course Scraper & API Interceptor
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Scrape course data and intercept planner API locally
// @match        https://admlu65.ust.hk/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      w5.ab.ust.hk
// @connect      admlu65.ust.hk
// @run-at       document-start
// @author       Atopos
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561630/HKUST%20Course%20Scraper%20%20API%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/561630/HKUST%20Course%20Scraper%20%20API%20Interceptor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== DOM 安全方法（绕过页面 monkey patch） ====================
    // 一些站点会重写 appendChild/insertBefore 导致调用时报奇怪的 SyntaxError。
    // 在 document-start 保存原生引用，然后后续统一用 safeAppend/safeInsertBefore。
    const __nativeAppendChild = Node.prototype.appendChild;
    const __nativeInsertBefore = Node.prototype.insertBefore;
    const __nativeInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

    function safeSetInnerHTML(element, html) {
        if (!element) return;
        if (!__nativeInnerHTML || !__nativeInnerHTML.set) {
            element.innerHTML = html;
            return;
        }
        __nativeInnerHTML.set.call(element, html);
    }

    function safeAppend(parent, child) {
        if (!parent || !child) return;
        return __nativeAppendChild.call(parent, child);
    }

    function safeInsertBefore(parent, child, before) {
        if (!parent || !child) return;
        return __nativeInsertBefore.call(parent, child, before || null);
    }

    function getBodyOrRoot() {
        return document.body || document.documentElement;
    }

    function setOnclickById(id, handler) {
        const el = document.getElementById(id);
        if (el) el.onclick = handler;
    }

    // ==================== 通用工具 ====================

    let debugMode = GM_getValue('debugMode', false);

    function debugLog(category, message, data = null) {
        if (!debugMode) return;
        const ts = new Date().toISOString();
        console.log(`[DEBUG ${ts}] [${category}]`, message);
        if (data !== null && data !== undefined) console.log('Data:', data);
    }

    function generateHash() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let out = '';
        for (let i = 0; i < 32; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
        return out;
    }

    function getDefaultTerm() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        let termYear = year;
        let termCode = '10';

        if (month >= 7 && month <= 11) termCode = '10';           // Fall
        else if (month === 12) termCode = '20';                   // Winter
        else if (month >= 1 && month <= 5) { termYear = year - 1; termCode = '30'; } // Spring
        else if (month === 6) { termYear = year - 1; termCode = '40'; }              // Summer

        return String(termYear).slice(-2) + termCode;
    }

    function termCodeToHuman(termCode) {
        const s = String(termCode || '');
        const m = s.match(/^(\d{2})(10|20|30|40)$/);
        if (!m) return s;

        const yy = parseInt(m[1], 10);
        const code = m[2];
        const map = { '10': 'Fall', '20': 'Winter', '30': 'Spring', '40': 'Summer' };

        const nowYear = new Date().getFullYear();
        const baseCentury = Math.floor(nowYear / 100) * 100;
        let fullYear = baseCentury + yy;
        if (fullYear > nowYear + 1) fullYear -= 100;

        return `${fullYear} ${map[code] || code}`;
    }

    function getCookieValue(name) {
        const target = `${encodeURIComponent(name)}=`;
        const parts = String(document.cookie || '').split(/;\s*/);
        for (const p of parts) {
            if (p.startsWith(target)) return p.slice(target.length);
        }
        return '';
    }

    function getCsrfTokenFromDocument() {
        const meta = document.querySelector('meta[name="csrf_token"], meta[name="csrf-token"], meta[name="csrf"]');
        const metaToken = meta?.getAttribute('content') || '';
        if (metaToken) return metaToken;

        const inputToken = document.querySelector('input[name="_token"]')?.getAttribute('value') || '';
        if (inputToken) return inputToken;

        const xsrf = getCookieValue('XSRF-TOKEN');
        if (xsrf) {
            try { return decodeURIComponent(xsrf); } catch { return xsrf; }
        }

        return '';
    }

    async function fetchCsrfTokenByRequest() {
        try {
            const resp = await originalFetch('https://admlu65.ust.hk/', { method: 'GET', credentials: 'include' });
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const meta = doc.querySelector('meta[name="csrf_token"], meta[name="csrf-token"], meta[name="csrf"]');
            const metaToken = meta?.getAttribute('content') || '';
            if (metaToken) return metaToken;
            const inputToken = doc.querySelector('input[name="_token"]')?.getAttribute('value') || '';
            return inputToken || '';
        } catch {
            return '';
        }
    }

    function buildPlannerCsrfHeaders(token) {
        const t = String(token || '');
        if (!t) return {};
        return {
            'X-CSRF-Token': t,
            'X-XSRF-TOKEN': t,
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    function getInterceptedTerms() {
        const v = GM_getValue('interceptedTerms', []);
        return Array.isArray(v) ? v : [];
    }

    function setInterceptedTerms(terms) {
        const t = Array.isArray(terms) ? terms : [];
        GM_setValue('interceptedTerms', t);
        debugLog('INTERCEPTOR', 'Updated intercepted terms', t);
    }

    function shouldIntercept(term) {
        const ok = !!term && getInterceptedTerms().includes(term);
        debugLog('INTERCEPTOR', `Should intercept ${term}?`, ok);
        return ok;
    }

    function normalizeBodyToUrlEncoded(body) {
        if (body == null) return '';
        if (typeof body === 'string') return body;
        if (body instanceof URLSearchParams) return body.toString();

        if (typeof FormData !== 'undefined' && body instanceof FormData) {
            const usp = new URLSearchParams();
            for (const [k, v] of body.entries()) usp.append(k, String(v));
            return usp.toString();
        }

        try {
            return new URLSearchParams(body).toString();
        } catch {
            return '';
        }
    }

    function safeUrl(url) {
        try { return new URL(String(url), window.location.href); }
        catch { return null; }
    }

    function getCurrentTermFromPage() {
        const m = window.location.pathname.match(/\/(\d{4})(?:\/|$)/);
        const term = m ? m[1] : null;
        debugLog('INTERCEPTOR', 'Current term from page', term);
        return term;
    }

    function extractTermFromPath(pathname) {
        if (!pathname) return null;
        const m = String(pathname).match(/\/(\d{4})(?:\/|$)/);
        return m ? m[1] : null;
    }

    function extractTermFromAny(u, body) {
        const fromPath = extractTermFromPath(u?.pathname);
        if (fromPath) return fromPath;

        const qs = u?.searchParams;
        const fromQs = qs?.get('semester') || qs?.get('term') || qs?.get('sem') || null;
        if (fromQs && /^\d{4}$/.test(fromQs)) return fromQs;

        const bodyParams = new URLSearchParams(normalizeBodyToUrlEncoded(body));
        const fromBody = bodyParams.get('semester') || bodyParams.get('term') || bodyParams.get('sem') || null;
        if (fromBody && /^\d{4}$/.test(fromBody)) return fromBody;

        const fromPage = getCurrentTermFromPage();
        if (fromPage && /^\d{4}$/.test(fromPage)) return fromPage;

        return null;
    }

    function extractHashFromPath(pathname) {
        if (!pathname) return null;
        const parts = String(pathname).split('/').filter(Boolean);
        if (parts.length >= 3 && parts[0] === 'planner' && ['save', 'delete', 'rename'].includes(parts[1])) {
            return parts[2] || null;
        }
        if (parts.length >= 3 && parts[0] === 'sis' && parts[1] === 'shopping-cart') return parts[2] || null;
        return null;
    }

    // ==================== 页面学期下拉扩充（近四年） ====================

    function ensureSemesterDropdownYears() {
        const ul = document.querySelector('ul.semester-dropdown');
        if (!ul) return;

        const nowYear = new Date().getFullYear(); // 例如 2026
        const want = [];
        for (let i = 0; i < 4; i++) {
            const startYear = nowYear - i; // 最新为 nowYear~nowYear+1
            const dataYear = String(startYear).slice(-2); // "26"
            const label = `${startYear}-${String(startYear + 1).slice(-2)}`; // "2026-27"
            want.push({ dataYear, label });
        }

        const existing = new Set(
            Array.from(ul.querySelectorAll('li[data-year]'))
                .map(li => String(li.getAttribute('data-year') || '').trim())
                .filter(Boolean)
        );

        const toAdd = want.filter(x => !existing.has(x.dataYear));
        if (toAdd.length === 0) return;

        const makeLi = ({ dataYear, label }) => {
            const li = document.createElement('li');
            li.setAttribute('data-year', dataYear);

            const h5 = document.createElement('h5');
            h5.textContent = label;
            safeAppend(li, h5);

            ['Fall', 'Winter', 'Spring', 'Summer'].forEach(t => {
                const a = document.createElement('a');
                a.textContent = t;
                safeAppend(li, a);
            });

            return li;
        };

        const lis = Array.from(ul.querySelectorAll('li[data-year]'));
        const getNum = (li) => parseInt(li.getAttribute('data-year') || '0', 10) || 0;

        toAdd.forEach(item => {
            const newLi = makeLi(item);
            const newNum = parseInt(item.dataYear, 10) || 0;

            // 找到第一个 data-year 小于 newNum 的位置插入（保持降序：26,25,24,23）
            const insertBefore = lis.find(li => getNum(li) < newNum) || null;
            safeInsertBefore(ul, newLi, insertBefore);

            lis.push(newLi);
            lis.sort((a, b) => getNum(b) - getNum(a));
        });

        // 强制启用被站点置灰的学期（站点点击事件会检查 disabled="disabled" 并直接拒绝）
        ul.querySelectorAll('a[disabled], a[aria-disabled="true"]').forEach(a => {
            a.removeAttribute('disabled');
            a.removeAttribute('aria-disabled');
        });

        debugLog('UI', 'semester-dropdown years ensured', { added: toAdd.map(x => x.label) });
    }

    function installSemesterDropdownObserver() {
        const obs = new MutationObserver(() => {
            try { ensureSemesterDropdownYears(); } catch { /* ignore */ }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
        ensureSemesterDropdownYears();
    }

    // ==================== selector 搜索（模糊） ====================

    function normalizeSearchValue(s) {
        return String(s || '')
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '');
    }

    function splitAlphaNumeric(q) {
        const qq = normalizeSearchValue(q);
        const letters = (qq.match(/[A-Z]+/g) || []).join('');
        const digits = (qq.match(/\d+/g) || []).join('');
        return { qq, letters, digits };
    }

    function courseMatchesQuery(course, q) {
        if (!course || !course.metadata) return false;
        const { qq, letters, digits } = splitAlphaNumeric(q);
        if (!qq) return false;

        const subj = normalizeSearchValue(course.metadata.subject || '');
        const codeNorm = normalizeSearchValue(String(course.metadata.code || '').trim());
        const titleNorm = normalizeSearchValue(course.title || '');
        const valueNorm = normalizeSearchValue(course.value || '');

        if (valueNorm.includes(qq) || titleNorm.includes(qq) || (subj + codeNorm).includes(qq)) return true;

        if (letters && !digits) {
            if (subj.startsWith(letters)) return true;
            if (titleNorm.includes(letters)) return true;
            return false;
        }

        if (!letters && digits) {
            if (codeNorm.includes(digits)) return true;
            return false;
        }

        if (letters && digits) {
            if (subj.startsWith(letters) && codeNorm.includes(digits)) return true;
            if (codeNorm.includes(digits) && (subj.includes(letters) || titleNorm.includes(letters))) return true;
            return false;
        }

        return false;
    }

    function searchCourses(termData, query, limit = 50) {
        const out = [];
        const q = String(query || '').trim();
        if (!q) return out;

        const subjects = Object.keys(termData || {});
        for (const s of subjects) {
            const list = termData[s];
            if (!Array.isArray(list)) continue;

            for (const c of list) {
                if (courseMatchesQuery(c, q)) {
                    out.push(c);
                    if (out.length >= limit) return out;
                }
            }
        }
        return out;
    }

    // ==================== 课程爬取 ====================

    async function fetchSubjectList(term) {
        return new Promise((resolve, reject) => {
            const url = `https://w5.ab.ust.hk/wcq/cgi-bin/${term}/`;
            debugLog('SCRAPER', `Fetching subject list from: ${url}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (resp) => {
                    try {
                        const doc = new DOMParser().parseFromString(resp.responseText, 'text/html');
                        const subjects = [];
                        for (const a of doc.querySelectorAll('a[href*="subject/"]')) {
                            const m = a.href.match(/subject\/([A-Z]+)/);
                            if (m) subjects.push(m[1]);
                        }
                        resolve([...new Set(subjects)].sort());
                    } catch (e) {
                        debugLog('SCRAPER', 'Error parsing subjects', e);
                        reject(e);
                    }
                },
                onerror: (e) => {
                    debugLog('SCRAPER', 'Network error', e);
                    reject(e);
                }
            });
        });
    }

    function parseTime(timeStr) {
        const m = String(timeStr).match(/(\d{1,2}):(\d{2})(AM|PM)/);
        if (!m) return null;
        let hour = parseInt(m[1], 10);
        const minute = parseInt(m[2], 10);
        const ap = m[3];
        if (ap === 'PM' && hour !== 12) hour += 12;
        if (ap === 'AM' && hour === 12) hour = 0;
        return hour * 100 + minute;
    }

    function parseDayOfWeek(dayStr) {
        const map = { Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6, Su: 0 };
        return map[dayStr] ?? null;
    }

    function parseCourse(courseDiv) {
        const subjectDiv = courseDiv.querySelector('.subject');
        if (!subjectDiv) return null;

        const fullTitle = subjectDiv.textContent.trim();
        const m = fullTitle.match(/^([A-Z]+)\s+(\d+[A-Z]*)\s+-\s+(.+?)\s+\((\d+)\s+units?\)/);
        if (!m) return null;

        const [, subject, code, name, credits] = m;

        const rawText = (courseDiv.textContent || '');
        const matchingRequired = /Matching between Lecture\s*&\s*(Lab|Tutorial) required/i.test(rawText);

        const courseInfo = {
            type: 'timetable-planner',
            value: subject + code,
            title: `${subject} ${code}`,
            subtitle: name,
            half: false,
            icon: '',
            is_favourited: false,
            metadata: {
                credits: parseInt(credits, 10),
                show_flags: false,
                taken: false,
                prerequisite: true,
                corequisite: true,
                exclusion: true,
                review_count: null,
                id: null,
                subject,
                code,
                name,
                matching: !!matchingRequired,
                is_favourited: false,
                is_subscribed: null,
                sections: [],
                is_planned: false,
                quota: 0,
                waitlist: false,
                category_short: '',
                category_long: ''
            }
        };

        const normalizeWs = (s) => String(s || '').replace(/\s+/g, ' ').trim();

        const sectionsTable = courseDiv.querySelector('table.sections');
        const allRows = sectionsTable ? Array.from(sectionsTable.querySelectorAll('tr')) : [];

        for (let i = 0; i < allRows.length; i++) {
            const row = allRows[i];
            if (!row.classList.contains('newsect')) continue;

            const sectionCell = row.cells[0];
            const quotaCell = row.cells[5];
            const enrollCell = row.cells[6];
            const availCell = row.cells[7];
            const waitCell = row.cells[8];

            if (!sectionCell) continue;

            const sm = normalizeWs(sectionCell.textContent).match(/^([A-Z]+\d+[A-Z]*)\s*\((\d+)\)/);
            if (!sm) continue;

            const [, sectionName, sectionNumber] = sm;

            const section = {
                section: sectionName,
                number: parseInt(sectionNumber, 10),
                quota: parseInt(normalizeWs(quotaCell?.textContent) || 0, 10),
                enrolled: parseInt(normalizeWs(enrollCell?.textContent) || 0, 10),
                available: parseInt(normalizeWs(availCell?.textContent) || 0, 10),
                waitlist: parseInt(normalizeWs(waitCell?.textContent) || 0, 10),
                sessions: []
            };

            // 同一个 section 可能有多行时间：mainRow + 若干 otherRow（直到下一个 newsect）
            const timeRows = [row];
            let j = i + 1;
            while (j < allRows.length && !allRows[j].classList.contains('newsect')) {
                const r = allRows[j];
                // 跳过移动端展开行
                if (r.classList.contains('mobileInstructorRow') || r.classList.contains('mobileViewDetail')) {
                    j++;
                    continue;
                }

                // otherRow 通常第 2 列是时间；如果像时间段则收进来
                const timeText = normalizeWs(r.cells?.[1]?.textContent);
                if (timeText && /\d{1,2}:\d{2}[AP]M\s*-\s*\d{1,2}:\d{2}[AP]M/i.test(timeText)) {
                    timeRows.push(r);
                }

                j++;
            }
            i = j - 1;

            for (const tr of timeRows) {
                const dateTimeText = normalizeWs(tr.cells?.[1]?.textContent);
                let roomText = normalizeWs(tr.cells?.[2]?.textContent);
                if (roomText.toUpperCase() === 'TBA') roomText = '';

                const instructors = [];
                (tr.cells?.[3]?.querySelectorAll?.('a') || []).forEach(a => {
                    const t = normalizeWs(a.textContent);
                    if (t) instructors.push(t);
                });

                const tm = dateTimeText.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2}[AP]M)\s*-\s*(\d{1,2}:\d{2}[AP]M)/);
                if (tm) {
                    const days = (tm[1].match(/.{2}/g) || []).map(d => d.trim()).filter(Boolean);
                    const start = parseTime(tm[2]);
                    const end = parseTime(tm[3]);
                    for (const d of days) {
                        const dow = parseDayOfWeek(d);
                        if (dow !== null && start !== null && end !== null) {
                            section.sessions.push({
                                day_of_week: dow,
                                start,
                                end,
                                venue: roomText,
                                instructors
                            });
                        }
                    }
                }
            }

            if (section.sessions.length === 0) {
                section.sessions.push({
                    day_of_week: 0,
                    start: 0,
                    end: 0,
                    venue: '',
                    instructors: []
                });
            }

            courseInfo.metadata.sections.push(section);
            courseInfo.metadata.quota += section.quota;
            if (section.waitlist > 0) courseInfo.metadata.waitlist = true;
        }

        return courseInfo;
    }

    async function scrapeSubject(term, subject, progressCallback) {
        return new Promise((resolve, reject) => {
            const url = `https://w5.ab.ust.hk/wcq/cgi-bin/${term}/subject/${subject}`;
            debugLog('SCRAPER', `Fetching courses for ${subject}`, { url });

            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (resp) => {
                    try {
                        const doc = new DOMParser().parseFromString(resp.responseText, 'text/html');
                        const courses = [];
                        doc.querySelectorAll('.course').forEach(div => {
                            const c = parseCourse(div);
                            if (c) courses.push(c);
                        });

                        progressCallback && progressCallback(`${subject}: ${courses.length} courses`);
                        resolve({ subject, courses });
                    } catch (e) {
                        debugLog('SCRAPER', `Error parsing ${subject}`, e);
                        reject(e);
                    }
                },
                onerror: (e) => {
                    debugLog('SCRAPER', `Network error for ${subject}`, e);
                    reject(e);
                }
            });
        });
    }

    // ==================== 本地存储/全局 hash 查找 ====================

    function listAllTimetableTermsFromStorage() {
        let keys = [];
        try {
            keys = (typeof GM_listValues === 'function') ? GM_listValues() : [];
        } catch {
            keys = [];
        }

        const terms = [];
        for (const k of keys) {
            if (typeof k === 'string' && k.startsWith('timetables_')) {
                const term = k.slice('timetables_'.length);
                if (term) terms.push(term);
            }
        }
        return [...new Set(terms)];
    }

    function findTimetableByHashGlobal(hash) {
        if (!hash) return null;

        const terms = listAllTimetableTermsFromStorage();
        for (const t of getInterceptedTerms()) if (!terms.includes(t)) terms.push(t);

        for (const term of terms) {
            const key = `timetables_${term}`;
            const timetables = GM_getValue(key, []);
            if (!Array.isArray(timetables) || timetables.length === 0) continue;

            const idx = timetables.findIndex(tt => tt && tt.hash === hash);
            if (idx >= 0) return { term, key, timetables, index: idx, timetable: timetables[idx] };
        }
        return null;
    }

    function getLocalTimetables(term) {
        const key = `timetables_${term}`;
        const list = GM_getValue(key, []);
        const timetables = Array.isArray(list) ? list : [];

        if (timetables.length === 0) {
            timetables.push({ hash: generateHash(), title: 'Untitled Timetable', data: [] });
            setLocalTimetables(term, timetables);
            debugLog('INTERCEPTOR', `Created default empty timetable for term ${term}`);
        }
        return timetables;
    }

    function getLocalTimetablesRaw(term) {
        const key = `timetables_${term}`;
        const list = GM_getValue(key, []);
        return Array.isArray(list) ? list : [];
    }

    function setLocalTimetables(term, timetables) {
        const list = Array.isArray(timetables) ? timetables : [];
        if (list.length === 0) list.push({ hash: generateHash(), title: 'Untitled Timetable', data: [] });
        GM_setValue(`timetables_${term}`, list);
        debugLog('INTERCEPTOR', `Saved ${list.length} timetable(s) for term ${term}`);
    }

    function getLocalCourseData(term) {
        const allData = GM_getValue('courseData', {});
        if (!allData || typeof allData !== 'object') return {};
        return allData[term] || {};
    }

    function ensureTimetableExists(term, hash) {
        if (!term || !hash) return null;

        const timetables = getLocalTimetables(term);
        const idx = timetables.findIndex(t => t && t.hash === hash);
        if (idx >= 0) return { term, timetables, index: idx, timetable: timetables[idx] };

        const tt = { hash, title: 'Imported Timetable', data: [] };
        timetables.push(tt);
        setLocalTimetables(term, timetables);
        return { term, timetables, index: timetables.length - 1, timetable: tt };
    }

    // ==================== 本地 Timetable 管理（UI/导出覆盖） ====================

    function escapeHtml(s) {
        return String(s ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function buildLocalTimetableIndex() {
        const terms = listAllTimetableTermsFromStorage().sort();
        const rows = [];

        for (const term of terms) {
            const list = getLocalTimetablesRaw(term);
            if (!Array.isArray(list) || list.length === 0) continue;

            for (const tt of list) {
                if (!tt || !tt.hash) continue;
                rows.push({
                    term,
                    hash: String(tt.hash),
                    title: String(tt.title || 'Untitled Timetable')
                });
            }
        }

        rows.sort((a, b) => {
            if (a.term !== b.term) return a.term < b.term ? 1 : -1;
            return a.title.localeCompare(b.title);
        });

        return rows;
    }

    // 同样修改 renderLocalTimetableManager（约 715 行）和 loadServerListIntoModal（约 868 行）：
    function renderLocalTimetableManager() {
        const host = document.getElementById('local-tt-list');
        if (!host) return;

        const rows = buildLocalTimetableIndex();
        if (rows.length === 0) {
            safeSetInnerHTML(host, `<div style="font-size:12px;color:#666;">No local timetables found (timetables_* not in storage).</div>`);
            return;
        }

        safeSetInnerHTML(host, rows.map(r => `
        <div style="border:1px solid #ddd;border-radius:6px;padding:8px;margin-bottom:8px;background:#fff;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
                <div style="min-width:0;">
                    <div style="font-weight:600;font-size:13px;line-height:1.2;">${escapeHtml(r.title)}</div>
                    <div style="font-size:12px;color:#444;margin-top:2px;">Term: <b>${escapeHtml(termCodeToHuman(r.term))}</b></div>
                    <div style="font-size:11px;color:#888;margin-top:2px;word-break:break-all;">${escapeHtml(r.hash)}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;flex:0 0 auto;">
                    <button class="export-tt-btn"
                        data-term="${escapeHtml(r.term)}"
                        data-hash="${escapeHtml(r.hash)}"
                        style="padding:6px 8px;background:#673AB7;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">
                        导出覆盖到服务器…
                    </button>
                </div>
            </div>
        </div>
    `).join(''));

        host.querySelectorAll('.export-tt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const term = btn.getAttribute('data-term') || '';
                const hash = btn.getAttribute('data-hash') || '';
                openExportModal(term, hash);
            });
        });
    }

    function ensureExportModalDom() {
        if (document.getElementById('export-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'export-modal-overlay';
        overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.45);
        z-index: 20000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

        // 用 safeSetInnerHTML 替代直接赋值
        safeSetInnerHTML(overlay, `
        <div id="export-modal" style="
            width: min(720px, 96vw);
            max-height: 85vh;
            overflow: auto;
            background: #fff;
            border-radius: 10px;
            border: 2px solid #333;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
            padding: 14px;
            font-family: Arial, sans-serif;
        ">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <div style="min-width:0;">
                    <div style="font-weight:700;">导出覆盖到服务器</div>
                    <div id="export-modal-subtitle" style="font-size:12px;color:#555;margin-top:2px;word-break:break-word;"></div>
                </div>
                <button id="export-modal-close" style="padding:6px 10px;background:#eee;border:1px solid #ccc;border-radius:6px;cursor:pointer;">关闭</button>
            </div>

            <div style="margin-top:12px;">
                <div style="font-size:13px;font-weight:600;margin-bottom:6px;">选择服务器端要被覆盖的 Timetable</div>
                <div id="export-modal-serverlist" style="border:1px solid #ddd;border-radius:8px;background:#fafafa;padding:10px;min-height:90px;">
                    加载中...
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
                <button id="export-modal-refresh" style="padding:8px 10px;background:#607D8B;color:white;border:none;border-radius:6px;cursor:pointer;">刷新列表</button>
                <button id="export-modal-confirm" style="padding:8px 10px;background:#d32f2f;color:white;border:none;border-radius:6px;cursor:pointer;">确认覆盖</button>
            </div>

            <div id="export-modal-status" style="margin-top:10px;font-size:12px;color:#444;"></div>
        </div>
    `);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeExportModal();
        });

        safeAppend(getBodyOrRoot(), overlay);

        // 延迟绑定事件，确保 innerHTML 渲染完成
        setTimeout(() => {
            document.getElementById('export-modal-close')?.addEventListener('click', closeExportModal);
        }, 0);
    }

    function setExportModalStatus(msg) {
        const el = document.getElementById('export-modal-status');
        if (el) el.textContent = msg || '';
    }

    function closeExportModal() {
        const overlay = document.getElementById('export-modal-overlay');
        if (overlay) overlay.style.display = 'none';
        setExportModalStatus('');
    }

    function encodeTimetableToFormData(timetable, options = {}) {
        const formData = new URLSearchParams();
        const data = Array.isArray(timetable?.data) ? timetable.data : [];
        const padSessionsTo = Number.isFinite(options.padSessionsTo) ? options.padSessionsTo : 0;

        const v = (x) => (x === null || x === undefined) ? '' : String(x);
        const normalizeNumberLike = (x) => {
            const s = v(x).trim();
            if (s === '') return '';
            const n = Number(s);
            return Number.isFinite(n) ? String(n) : s;
        };
        const isValidDay = (d) => {
            const s = String(d ?? '').trim();
            if (s === '') return false;
            const n = Number(s);
            return Number.isFinite(n) && n >= 0 && n <= 7;
        };
        const isValidTime = (t) => {
            const s = String(t ?? '').trim();
            if (s === '') return false;
            const n = Number(s);
            return Number.isFinite(n) && n >= 0;
        };

        let outIndex = 0;
        data.forEach((course) => {
            const subject = String(course?.subject ?? '').trim();
            const code = String(course?.code ?? '').trim();
            if (!subject || !code) return;

            const rawSessions = Array.isArray(course?.sessions) ? course.sessions : [];
            const cleaned = [];
            const seen = new Set();
            for (const session of rawSessions) {
                const section = v(session?.section).trim();
                const venue = v(session?.venue).trim();
                const number = v(session?.number).trim();
                const day = normalizeNumberLike(session?.dayOfWeek);
                const start = normalizeNumberLike(session?.startTime);
                const end = normalizeNumberLike(session?.endTime);

                const allEmpty = !section && !venue && !number && !day && !start && !end;
                if (allEmpty) continue;

                // 站点的“占位 session”允许 day=0/start=0/end=0（比如未排课/占位）
                if (!isValidDay(day) || !isValidTime(start) || !isValidTime(end)) continue;

                const key = [section, number, day, start, end, venue].join('|');
                if (seen.has(key)) continue;
                seen.add(key);
                cleaned.push({ section, venue, number, dayOfWeek: day, startTime: start, endTime: end });
            }

            // 如果完全没有 session，就不发送这门课（否则可能触发服务器校验失败）
            if (cleaned.length === 0) return;

            // 先写课程字段，再写 sessions（字段顺序尽量贴近站点原始请求）
            formData.append(`data[${outIndex}][enabled]`, v(course?.enabled ?? 'true'));
            formData.append(`data[${outIndex}][subject]`, subject);
            formData.append(`data[${outIndex}][code]`, code);
            formData.append(`data[${outIndex}][credits]`, v(course?.credits ?? 0));

            const total = Math.max(cleaned.length, padSessionsTo);
            for (let j = 0; j < total; j++) {
                const s = cleaned[j] || { section: '', venue: '', number: '', dayOfWeek: '', startTime: '', endTime: '' };
                formData.append(`data[${outIndex}][sessions][${j}][section]`, v(s.section));
                formData.append(`data[${outIndex}][sessions][${j}][venue]`, v(s.venue));
                formData.append(`data[${outIndex}][sessions][${j}][number]`, v(s.number));
                formData.append(`data[${outIndex}][sessions][${j}][dayOfWeek]`, v(s.dayOfWeek));
                formData.append(`data[${outIndex}][sessions][${j}][startTime]`, v(s.startTime));
                formData.append(`data[${outIndex}][sessions][${j}][endTime]`, v(s.endTime));
            }

            formData.append(`data[${outIndex}][color]`, v(course?.color ?? '#34495e'));
            formData.append(`data[${outIndex}][constraint]`, v(course?.constraint ?? 'false'));

            outIndex++;
        });

        return formData;
    }

    async function fetchServerTimetables(term) {
        // 用 originalFetch 走真实服务器，避免被本脚本拦截
        const url = `https://admlu65.ust.hk/planner/query/${encodeURIComponent(term)}`;

        const resp = await originalFetch(url, { method: 'GET', credentials: 'include' });
        const text = await resp.text();
        try {
            return JSON.parse(text);
        } catch {
            throw new Error('Server returned non-JSON (GET)');
        }
    }

    async function overwriteServerTimetable(serverHash, localTimetable) {
        const url = `https://admlu65.ust.hk/planner/save/${encodeURIComponent(serverHash)}`;
        const padSessionsTo = 0;

        const doPost = async (csrfToken) => {
            const formData = encodeTimetableToFormData(localTimetable, { padSessionsTo });
            if (csrfToken) formData.set('_token', String(csrfToken));
            formData.set('hash', String(serverHash));
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                ...buildPlannerCsrfHeaders(csrfToken)
            };
            return await originalFetch(url, {
                method: 'POST',
                body: formData.toString(),
                credentials: 'include',
                headers
            });
        };

        let csrfToken = getCsrfTokenFromDocument();
        let resp = await doPost(csrfToken);
        if (resp.status === 419) {
            csrfToken = (await fetchCsrfTokenByRequest()) || csrfToken;
            resp = await doPost(csrfToken);
        }

        const text = await resp.text();
        let json = null;
        try { json = JSON.parse(text); } catch { /* ignore */ }

        if (!resp.ok) {
            const hint = resp.status === 419 ? '（CSRF/Session 过期，Page Expired）' : '';
            throw new Error(`HTTP ${resp.status}: ${resp.statusText} ${hint}`.trim());
        }

        if (json && json.error && json.error !== false) {
            throw new Error(typeof json.error === 'string' ? json.error : 'Server error');
        }

        return json || { ok: true };
    }

    let exportContext = { term: '', localHash: '' };

    async function loadServerListIntoModal(term) {
        const box = document.getElementById('export-modal-serverlist');
        if (!box) return;

        safeSetInnerHTML(box, '加载中...');
        setExportModalStatus('');

        try {
            const data = await fetchServerTimetables(term);
            const list = Array.isArray(data?.timetables) ? data.timetables : [];

            if (list.length === 0) {
                safeSetInnerHTML(box, `<div style="font-size:12px;color:#666;">服务器端该学期没有 timetables（或未能读取）。</div>`);
                return;
            }

            safeSetInnerHTML(box, list.map((tt, idx) => {
                const hash = String(tt?.hash || '');
                const title = String(tt?.title || 'Untitled Timetable');
                const id = `server-tt-${idx}`;
                return `
                <label for="${id}" style="display:block;border:1px solid #e0e0e0;background:#fff;border-radius:8px;padding:8px;margin-bottom:8px;cursor:pointer;">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                        <input type="radio" name="server-tt" id="${id}" value="${escapeHtml(hash)}" style="margin-top:3px;">
                        <div style="min-width:0;">
                            <div style="font-weight:600;font-size:13px;">${escapeHtml(title)}</div>
                            <div style="font-size:11px;color:#888;word-break:break-all;margin-top:2px;">${escapeHtml(hash)}</div>
                        </div>
                    </div>
                </label>
            `;
            }).join(''));

            const first = box.querySelector('input[type="radio"][name="server-tt"]');
            if (first) first.checked = true;
        } catch (e) {
            safeSetInnerHTML(box, `<div style="font-size:12px;color:#b00020;">加载失败：${escapeHtml(e?.message || String(e))}</div>`);
        }
    }

    async function openExportModal(term, localHash) {
        ensureExportModalDom();

        exportContext = { term: String(term || ''), localHash: String(localHash || '') };

        const overlay = document.getElementById('export-modal-overlay');
        const subtitle = document.getElementById('export-modal-subtitle');
        if (subtitle) subtitle.textContent = `本地：${termCodeToHuman(exportContext.term)} / Hash ${exportContext.localHash}`;

        if (overlay) overlay.style.display = 'flex';

        await loadServerListIntoModal(exportContext.term);

        setOnclickById('export-modal-refresh', async () => {
            await loadServerListIntoModal(exportContext.term);
        });

        setOnclickById('export-modal-confirm', async () => {
            try {
                const chosen = document.querySelector('input[name="server-tt"]:checked');
                const serverHash = chosen?.value || '';
                if (!serverHash) {
                    setExportModalStatus('请选择一个服务器端 timetable。');
                    return;
                }

                const found = findTimetableByHashGlobal(exportContext.localHash);
                if (!found || !found.timetable) {
                    setExportModalStatus('本地 timetable 未找到（可能已被清空）。');
                    return;
                }

                if (!confirm(`确认用本地 timetable 覆盖服务器端 hash=${serverHash} 吗？此操作不可撤销。`)) return;

                setExportModalStatus('正在覆盖...');
                await overwriteServerTimetable(serverHash, found.timetable);
                setExportModalStatus('覆盖成功。');
            } catch (e) {
                setExportModalStatus(`覆盖失败：${e?.message || String(e)}`);
            }
        });
    }

    // ==================== API handlers（本地响应） ====================

    const apiHandlers = {
        query: (term) => {
            debugLog('API', `Query timetables for term ${term}`);
            return { error: false, timetables: getLocalTimetables(term) };
        },

        course: (term, subject, code) => {
            const subj = String(subject || '').trim().toUpperCase();
            const c = String(code || '').trim().toUpperCase();
            debugLog('API', `Course detail ${term} ${subj}${c}`);

            if (!term || !shouldIntercept(term)) {
                return { error: true, message: 'Term is not intercepted', metadata: null };
            }

            const termData = getLocalCourseData(term);
            const list = (termData && subj && Array.isArray(termData[subj])) ? termData[subj] : [];
            const found = list.find(x => String(x?.metadata?.subject || '').toUpperCase() === subj && String(x?.metadata?.code || '').toUpperCase() === c);

            if (!found || !found.metadata) {
                return {
                    error: true,
                    message: 'Course not found in local cache. Please scrape this subject first.',
                    metadata: null
                };
            }

            const m = found.metadata;
            const id = (typeof m.id === 'number' && Number.isFinite(m.id)) ? m.id : 0;

            return {
                error: false,
                metadata: {
                    id,
                    subject: m.subject || subj,
                    code: m.code || c,
                    name: m.name || '',
                    credits: (typeof m.credits === 'number' ? m.credits : parseInt(String(m.credits || '0'), 10) || 0),
                    matching: !!m.matching,
                    is_favourited: !!m.is_favourited,
                    is_subscribed: m.is_subscribed ?? null,
                    sections: Array.isArray(m.sections) ? m.sections : [],
                    is_planned: !!m.is_planned
                }
            };
        },

        selectorQuery: (params) => {
            debugLog('API', 'Selector query', params);
            const { type, value, semester } = params;

            if (!shouldIntercept(semester)) return null;
            const termData = getLocalCourseData(semester);

            if (type === 'default' || !type) {
                const subjects = Object.keys(termData).sort();
                const list = [
                    { type: 'categories', value: '', title: 'Common Core Courses', subtitle: '', half: false, icon: 'list', is_favourited: false, metadata: [] },
                    { type: 'heading', value: '', title: 'My Collections', subtitle: '', half: false, icon: '', is_favourited: false, metadata: [] },
                    { type: 'favourites', value: '', title: 'Favourites', subtitle: '', half: false, icon: 'heart', is_favourited: false, metadata: [] },
                    { type: 'plan', value: '', title: 'My Plan', subtitle: '', half: false, icon: 'fa-lightbulb-o', is_favouritted: false, metadata: [] },
                    { type: 'heading', value: '', title: 'Subjects', subtitle: '', half: false, icon: '', is_favouritted: false, metadata: [] }
                ];

                subjects.forEach(s => list.push({ type: 'subject', value: s, title: s, subtitle: '', half: true, icon: '', is_favouritted: false, metadata: [] }));
                return { error: false, list };
            }

            if (type === 'subject' && value) {
                return { error: false, list: termData[value] || [] };
            }

            if (type === 'search') {
                const results = searchCourses(termData, value, 80);
                return { error: false, list: results };
            }

            return { error: false, list: [] };
        },

        enrl: (term) => ({ error: 'Enrollment API is not supported in offline mode', term }),
        shoppingCart: (hash) => ({ error: 'Shopping cart API is not supported in offline mode', hash }),

        create: (term) => {
            debugLog('API', `Create timetable for term ${term}`);
            const timetables = getLocalTimetables(term);
            const newHash = generateHash();
            timetables.push({ hash: newHash, title: 'Untitled Timetable', data: [] });
            setLocalTimetables(term, timetables);
            return { error: false, hash: newHash, timetables };
        },

        save: (hash, body, term /* optional */) => {
            debugLog('API', `Save timetable ${hash}`, { term });

            let found = findTimetableByHashGlobal(hash);

            if (!found && term && shouldIntercept(term)) {
                found = ensureTimetableExists(term, hash);
                if (found) {
                    found.key = `timetables_${term}`;
                    found.timetables = GM_getValue(found.key, []);
                    found.index = found.timetables.findIndex(t => t && t.hash === hash);
                    found.timetable = found.timetables[found.index];
                }
            }

            if (!found) return { error: 'Timetable not found (hash not in local storage)' };

            const params = new URLSearchParams(normalizeBodyToUrlEncoded(body));

            const data = [];
            for (let i = 0; params.has(`data[${i}][subject]`); i++) {
                const courseData = {
                    enabled: params.get(`data[${i}][enabled]`) || 'true',
                    subject: params.get(`data[${i}][subject]`) || '',
                    code: params.get(`data[${i}][code]`) || '',
                    credits: parseInt(params.get(`data[${i}][credits]`) || '0', 10) || 0,
                    color: params.get(`data[${i}][color]`) || '#34495e',
                    constraint: params.get(`data[${i}][constraint]`) || 'false',
                    sessions: []
                };

                for (let j = 0; params.has(`data[${i}][sessions][${j}][section]`); j++) {
                    const getStr = (k) => {
                        const v = params.get(k);
                        return v === null ? '' : v; // 保留 "0"
                    };

                    courseData.sessions.push({
                        section: getStr(`data[${i}][sessions][${j}][section]`),
                        venue: getStr(`data[${i}][sessions][${j}][venue]`),
                        number: getStr(`data[${i}][sessions][${j}][number]`),
                        dayOfWeek: getStr(`data[${i}][sessions][${j}][dayOfWeek]`),
                        startTime: getStr(`data[${i}][sessions][${j}][startTime]`),
                        endTime: getStr(`data[${i}][sessions][${j}][endTime]`)
                    });
                }

                data.push(courseData);
            }

            found.timetables[found.index].data = data;
            setLocalTimetables(found.term, found.timetables);

            return { error: false };
        },

        delete: (hash, term /* optional */) => {
            debugLog('API', `Delete timetable ${hash}`, { term });

            let found = findTimetableByHashGlobal(hash);

            if (!found && term && shouldIntercept(term)) {
                return { error: false, timetables: getLocalTimetables(term) };
            }

            if (!found) return { error: 'Timetable not found (hash not in local storage)' };

            const newList = found.timetables.filter(t => t && t.hash !== hash);
            setLocalTimetables(found.term, newList);
            return { error: false, timetables: GM_getValue(`timetables_${found.term}`, []) };
        },

        rename: (hash, title, term /* optional */) => {
            debugLog('API', `Rename timetable ${hash} -> "${title}"`, { term });

            let found = findTimetableByHashGlobal(hash);

            if (!found && term && shouldIntercept(term)) {
                found = ensureTimetableExists(term, hash);
                if (found) {
                    found.key = `timetables_${term}`;
                    found.timetables = GM_getValue(found.key, []);
                    found.index = found.timetables.findIndex(t => t && t.hash === hash);
                    found.timetable = found.timetables[found.index];
                }
            }

            if (!found) return { error: 'Timetable not found (hash not in local storage)' };

            found.timetables[found.index].title = title || '';
            setLocalTimetables(found.term, found.timetables);
            return { error: false };
        }
    };

    // ==================== XHR 拦截 ====================

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    function mockJsonResponse(xhr, obj, status = 200, statusText = 'OK') {
        const responseText = JSON.stringify(obj);

        const headerMap = { 'content-type': 'application/json; charset=utf-8' };
        xhr.getResponseHeader = (name) => headerMap[String(name || '').toLowerCase()] ?? null;
        xhr.getAllResponseHeaders = () => Object.entries(headerMap).map(([k, v]) => `${k}: ${v}\r\n`).join('');

        Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true });
        Object.defineProperty(xhr, 'status', { value: status, configurable: true });
        Object.defineProperty(xhr, 'statusText', { value: statusText, configurable: true });
        Object.defineProperty(xhr, 'responseText', { value: responseText, configurable: true });
        Object.defineProperty(xhr, 'response', { value: responseText, configurable: true });

        try { Object.defineProperty(xhr, 'responseURL', { value: xhr._absUrl || '', configurable: true }); } catch { /* ignore */ }

        try { if (xhr.onreadystatechange) xhr.onreadystatechange(); } catch { /* ignore */ }
        try { if (xhr.onload) xhr.onload(); } catch { /* ignore */ }
        try { if (xhr.onloadend) xhr.onloadend(); } catch { /* ignore */ }
    }

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._method = method;
        const u = safeUrl(url);
        this._parsedUrl = u;
        this._absUrl = u ? u.toString() : String(url);
        debugLog('XHR', `open ${method} ${this._absUrl}`);
        return originalOpen.apply(this, [method, url, ...args]);
    };

    function handlePlannerLikeRequest(u, method, body) {
        if (!u) return { shouldBlock: false, response: null };

        const path = u.pathname || '';
        const hashFromPath = extractHashFromPath(path);
        const term = extractTermFromAny(u, body);

        const isPlanner =
            path.startsWith('/planner/') ||
            path === '/planner/query' ||
            path === '/planner/create' ||
            path === '/planner/save' ||
            path === '/planner/delete' ||
            path === '/planner/rename';

        const isSelector = (path === '/selector/query');
        const isEnrl = path.startsWith('/course/enrl/');
        const isCart = path.startsWith('/sis/shopping-cart/');

        if (!isPlanner && !isSelector && !isEnrl && !isCart) return { shouldBlock: false, response: null };

        if (isSelector) {
            const semester = u.searchParams.get('semester') || term;
            if (semester && shouldIntercept(semester)) {
                const resp = apiHandlers.selectorQuery({
                    type: u.searchParams.get('type'),
                    value: u.searchParams.get('value'),
                    semester,
                    page: u.searchParams.get('page')
                }) || { error: false, list: [] };
                return { shouldBlock: true, response: resp };
            }
            return { shouldBlock: false, response: null };
        }

        if (path.startsWith('/planner/query/') || path === '/planner/query') {
            const t = path.startsWith('/planner/query/') ? path.split('/').pop() : term;
            if (t && shouldIntercept(t)) return { shouldBlock: true, response: apiHandlers.query(t) };
            return { shouldBlock: false, response: null };
        }

        if (path.startsWith('/planner/course/') || path === '/planner/course') {
            const t = path.startsWith('/planner/course/') ? path.split('/').pop() : (u.searchParams.get('term') || term);
            const subject = u.searchParams.get('subject') || '';
            const code = u.searchParams.get('code') || '';
            if (t && shouldIntercept(t)) return { shouldBlock: true, response: apiHandlers.course(t, subject, code) };
            return { shouldBlock: false, response: null };
        }

        if (path.startsWith('/planner/create/') || path === '/planner/create') {
            const t = path.startsWith('/planner/create/') ? path.split('/').pop() : term;
            if (t && shouldIntercept(t)) return { shouldBlock: true, response: apiHandlers.create(t) };
            return { shouldBlock: false, response: null };
        }

        if (path.startsWith('/planner/save/') || path === '/planner/save') {
            const params = new URLSearchParams(normalizeBodyToUrlEncoded(body));
            const hash = hashFromPath || params.get('hash') || params.get('id') || null;
            if (!hash) return { shouldBlock: false, response: null };

            const found = findTimetableByHashGlobal(hash);
            const t = term;

            if (found || (t && shouldIntercept(t))) {
                return { shouldBlock: true, response: apiHandlers.save(hash, body, t) };
            }
            return { shouldBlock: false, response: null };
        }

        if (path.startsWith('/planner/delete/') || path === '/planner/delete') {
            const params = new URLSearchParams(normalizeBodyToUrlEncoded(body));
            const hash = hashFromPath || params.get('hash') || params.get('id') || null;
            if (!hash) return { shouldBlock: false, response: null };

            const found = findTimetableByHashGlobal(hash);
            const t = term;
            if (found || (t && shouldIntercept(t))) {
                return { shouldBlock: true, response: apiHandlers.delete(hash, t) };
            }
            return { shouldBlock: false, response: null };
        }

        if (path.startsWith('/planner/rename/') || path === '/planner/rename') {
            const params = new URLSearchParams(normalizeBodyToUrlEncoded(body));
            const hash = hashFromPath || params.get('hash') || params.get('id') || null;
            const title = params.get('title') || params.get('name') || '';
            if (!hash) return { shouldBlock: false, response: null };

            const found = findTimetableByHashGlobal(hash);
            const t = term;
            if (found || (t && shouldIntercept(t))) {
                return { shouldBlock: true, response: apiHandlers.rename(hash, title, t) };
            }
            return { shouldBlock: false, response: null };
        }

        if (isEnrl) {
            const t = path.split('/').pop() || term;
            if (t && shouldIntercept(t)) return { shouldBlock: true, response: apiHandlers.enrl(t) };
            return { shouldBlock: false, response: null };
        }

        if (isCart) {
            const hash = hashFromPath;
            const t = term || getCurrentTermFromPage();
            if (hash && t && shouldIntercept(t)) return { shouldBlock: true, response: apiHandlers.shoppingCart(hash) };
            return { shouldBlock: false, response: null };
        }

        return { shouldBlock: false, response: null };
    }

    XMLHttpRequest.prototype.send = function (data) {
        const method = (this._method || 'GET').toUpperCase();
        const u = this._parsedUrl || safeUrl(this._absUrl);

        debugLog('XHR', `send ${method} ${this._absUrl || ''}`, { hasBody: data != null });

        try {
            const { shouldBlock, response } = handlePlannerLikeRequest(u, method, data);

            if (shouldBlock) {
                debugLog('XHR', `INTERCEPTING ${method} ${this._absUrl || ''}`, response);
                setTimeout(() => mockJsonResponse(this, response), 0);
                return;
            }
        } catch (e) {
            debugLog('XHR', 'Interceptor error, fallback to native send()', e);
        }

        return originalSend.apply(this, arguments);
    };

    // ==================== fetch 拦截 ====================

    const originalFetch = window.fetch;
    window.fetch = function (url, options = {}) {
        try {
            const method = (options.method || 'GET').toUpperCase();
            const u = safeUrl(url);
            if (!u) return originalFetch.apply(this, arguments);

            debugLog('FETCH', `${method} ${u.toString()}`, { hasBody: options.body != null });

            const { shouldBlock, response } = handlePlannerLikeRequest(u, method, options.body);

            if (shouldBlock) {
                debugLog('FETCH', `INTERCEPTING ${method} ${u.toString()}`, response);
                return Promise.resolve(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                }));
            }
        } catch (e) {
            debugLog('FETCH', 'Interceptor error, fallback to native fetch()', e);
        }

        return originalFetch.apply(this, arguments);
    };

    // ==================== UI ====================

    let currentOpenPanel = null;

    function togglePanel(panelName) {
        if (currentOpenPanel === panelName) {
            collapsePanel(panelName);
            currentOpenPanel = null;
            return;
        }
        if (currentOpenPanel) collapsePanel(currentOpenPanel);
        expandPanel(panelName);
        currentOpenPanel = panelName;
    }

    function expandPanel(panelName) {
        const panel = document.getElementById(`${panelName}-panel`);
        const content = document.getElementById(`${panelName}-content`);
        const toggle = document.getElementById(`${panelName}-toggle`);
        if (!panel || !content || !toggle) return;
        content.style.display = 'block';
        toggle.textContent = '−';
        panel.style.width = '420px';
        panel.style.opacity = '1';
        panel.style.padding = '15px';
    }

    function collapsePanel(panelName) {
        const panel = document.getElementById(`${panelName}-panel`);
        const content = document.getElementById(`${panelName}-content`);
        const toggle = document.getElementById(`${panelName}-toggle`);
        if (!panel || !content || !toggle) return;
        content.style.display = 'none';
        toggle.textContent = '▶';
        panel.style.width = '240px';
        panel.style.opacity = '0.85';
        panel.style.padding = '8px 10px';
    }

    function updateScraperProgress(message) {
        const area = document.getElementById('scraper-progress');
        if (!area) return;
        area.innerHTML += `${message}<br>`;
        area.scrollTop = area.scrollHeight;
    }

    function updateInterceptorStatus(message) {
        const area = document.getElementById('interceptor-status');
        if (!area) return;
        area.innerHTML += `${message}<br>`;
        area.scrollTop = area.scrollHeight;
    }

    function updateTotalCourses() {
        const data = GM_getValue('courseData', {});
        let total = 0;
        if (data && typeof data === 'object') {
            Object.values(data).forEach(termData => {
                if (!termData || typeof termData !== 'object') return;
                Object.values(termData).forEach(courses => total += Array.isArray(courses) ? courses.length : 0);
            });
        }
        const span = document.getElementById('total-courses');
        if (span) span.textContent = String(total);
    }

    function clearAllData() {
        if (!confirm('这会清空 courseData/currentTerm/currentSubjects 以及所有 timetables_*。确定继续？')) return;

        try {
            const keys = (typeof GM_listValues === 'function') ? GM_listValues() : [];
            for (const k of keys) {
                if (k === 'courseData' || k === 'currentTerm' || k === 'currentSubjects') {
                    GM_deleteValue(k);
                    continue;
                }
                if (typeof k === 'string' && k.startsWith('timetables_')) {
                    GM_deleteValue(k);
                }
            }
            updateScraperProgress('已清空所有已存数据。');
            updateTotalCourses();
            updateInterceptorStatus('本地数据已清空。如有需要请刷新页面。');
            renderLocalTimetableManager();
        } catch (e) {
            alert(`清空失败：${e?.message || String(e)}`);
        }
    }

    async function loadSubjects() {
        const year = document.getElementById('year-select')?.value;
        const term = document.getElementById('term-select')?.value;
        const termCode = `${year}${term}`;

        const select = document.getElementById('subject-select');
        if (!select) return;

        select.disabled = true;
        select.innerHTML = '<option value="">加载中...</option>';
        updateScraperProgress(`正在加载 ${termCode} 的科目列表...`);

        try {
            const subjects = await fetchSubjectList(termCode);
            select.disabled = false;
            select.innerHTML = '<option value="">请选择科目</option>' + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
            GM_setValue('currentSubjects', subjects);
            GM_setValue('currentTerm', termCode);
            updateScraperProgress(`加载完成：共 ${subjects.length} 个科目`);
        } catch (e) {
            select.innerHTML = '<option value="">加载失败</option>';
            updateScraperProgress(`错误：${e?.message || String(e)}`);
        }
    }

    async function scrapeSingleSubject() {
        const select = document.getElementById('subject-select');
        const subject = select?.value;
        const term = GM_getValue('currentTerm', '');

        if (!subject) { alert('请先选择一个科目！'); return; }

        const area = document.getElementById('scraper-progress');
        if (area) area.innerHTML = '';
        updateScraperProgress(`正在抓取 ${subject}...`);

        try {
            const result = await scrapeSubject(term, subject, (m) => updateScraperProgress(m));
            const allData = GM_getValue('courseData', {});
            if (!allData[term]) allData[term] = {};
            allData[term][subject] = result.courses;
            GM_setValue('courseData', allData);

            updateScraperProgress(`已保存：${result.courses.length} 门课`);
            updateTotalCourses();
        } catch (e) {
            updateScraperProgress(`错误：${e?.message || String(e)}`);
        }
    }

    async function scrapeAllSubjects() {
        const subjects = GM_getValue('currentSubjects', []);
        const term = GM_getValue('currentTerm', '');
        const concurrency = Math.max(1, Math.min(10, parseInt(document.getElementById('concurrency-input')?.value || '3', 10) || 3));

        if (!Array.isArray(subjects) || subjects.length === 0) { alert('请先加载科目列表！'); return; }
        if (!confirm(`将以并发 ${concurrency} 抓取 ${subjects.length} 个科目，确定继续？`)) return;

        const area = document.getElementById('scraper-progress');
        if (area) area.innerHTML = '';
        updateScraperProgress(`开始抓取，并发=${concurrency}`);

        const termData = {};
        let completed = 0;
        let failed = 0;

        for (let i = 0; i < subjects.length; i += concurrency) {
            const batch = subjects.slice(i, i + concurrency);
            updateScraperProgress(`批次 ${Math.floor(i / concurrency) + 1}：${batch.join(', ')}`);

            const results = await Promise.all(batch.map(subject =>
                scrapeSubject(term, subject, (m) => updateScraperProgress(`  ${m}`))
                    .then(r => ({ ok: true, subject: r.subject, count: r.courses.length, courses: r.courses }))
                    .catch(e => ({ ok: false, subject, error: e?.message || String(e) }))
            ));

            results.forEach(r => {
                if (r.ok) {
                    termData[r.subject] = r.courses;
                    completed++;
                    updateScraperProgress(`  成功 ${r.subject}：${r.count}`);
                } else {
                    failed++;
                    updateScraperProgress(`  失败 ${r.subject}：${r.error}`);
                }
            });

            const allData = GM_getValue('courseData', {});
            allData[term] = { ...(allData[term] || {}), ...termData };
            GM_setValue('courseData', allData);
            updateTotalCourses();
        }

        updateScraperProgress(`完成：${completed}/${subjects.length}，失败=${failed}`);
    }

    function exportJSON() {
        const data = GM_getValue('courseData', {});
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) { alert('没有可导出的数据！'); return; }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `hkust_courses_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();

        URL.revokeObjectURL(url);
        updateScraperProgress('已导出。');
    }

    function viewStoredData() {
        const data = GM_getValue('courseData', {});
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) { alert('没有数据。'); return; }

        let summary = '';
        let total = 0;

        Object.keys(data).forEach(term => {
            const subjects = Object.keys(data[term] || {});
            let count = 0;
            subjects.forEach(s => count += (data[term][s] || []).length);
            total += count;
            summary += `${termCodeToHuman(term)}：${count} 门课（${subjects.length} 个科目）\n`;
        });

        alert(`总计：${total} 门课\n\n${summary}`);
    }

    function applyInterception() {
        const checkboxes = document.querySelectorAll('#term-checkboxes input[type="checkbox"]');
        const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        setInterceptedTerms(selected);
        updateInterceptorStatus(`已启用拦截：${selected.length} 个学期`);
        alert('拦截设置已应用。建议刷新页面以确保生效。');
    }

    function createIntegratedPanels() {
        const defaultTerm = getDefaultTerm();
        const currentYear = new Date().getFullYear();

        const yearOptions = [];
        for (let i = -1; i <= 1; i++) {
            const y = currentYear + i;
            yearOptions.push(`<option value="${String(y).slice(-2)}">${y}</option>`);
        }

        const currentTerms = getInterceptedTerms();
        const terms = [];
        for (let i = -1; i <= 1; i++) {
            const y = currentYear + i;
            const yy = String(y).slice(-2);
            terms.push({ value: yy + '10', label: `${y} Fall` });
            terms.push({ value: yy + '20', label: `${y} Winter` });
            terms.push({ value: yy + '30', label: `${y} Spring` });
            terms.push({ value: yy + '40', label: `${y} Summer` });
        }

        const container = document.createElement('div');
        container.id = 'unified-panel-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const baseStyle = `
            width: 420px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        `;

        const interceptorPanel = document.createElement('div');
        interceptorPanel.id = 'interceptor-panel';
        interceptorPanel.style.cssText = baseStyle;

        const courseData = GM_getValue('courseData', {});
        const hasData = courseData && typeof courseData === 'object' && Object.keys(courseData).length > 0;

        interceptorPanel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;cursor:pointer;" data-panel="interceptor">
                <h3 style="margin:0;">接口拦截器</h3>
                <span id="interceptor-toggle" style="font-size:20px;user-select:none;">−</span>
            </div>
            <div id="interceptor-content">
                <div style="padding:10px;background:#f1f8ff;border:1px solid #b6d4fe;border-radius:8px;margin-bottom:10px;font-size:12px;color:#084298;line-height:1.5;">
                    <div style="font-weight:700;margin-bottom:4px;">使用说明</div>
                    <div>1）先在“课程抓取”里抓取课程数据（否则拦截列表为空）。</div>
                    <div>2）在下方勾选要拦截的学期，点击“应用拦截”。</div>
                    <div>3）“本地 Timetable 管理”里可导出覆盖到服务器端某个 timetable。</div>
                </div>

                ${!hasData ? `<div style="padding:10px;background:#fff3cd;border:1px solid #ffc107;border-radius:4px;margin-bottom:10px;font-size:13px;color:#856404;">
                    还没有课程数据：请先在“课程抓取”中抓取一次。
                </div>` : ''}

                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;font-size:13px;">拦截学期：</label>
                    <div id="term-checkboxes" style="max-height:150px;overflow-y:auto;border:1px solid #ddd;padding:10px;background:#f9f9f9;">
                        ${terms.map(t => `
                            <label style="display:block;margin-bottom:5px;">
                                <input type="checkbox" value="${t.value}" ${currentTerms.includes(t.value) ? 'checked' : ''}>
                                ${t.label}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom:10px;">
                    <button id="apply-intercept-btn" style="width:100%;padding:8px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;">
                        应用拦截
                    </button>
                </div>

                <div style="margin:12px 0 8px;font-weight:700;">本地 Timetable 管理</div>
                <div style="display:flex;gap:8px;margin-bottom:10px;">
                    <button id="refresh-local-tt-btn" style="flex:1;padding:8px;background:#455A64;color:white;border:none;border-radius:4px;cursor:pointer;">
                        刷新列表
                    </button>
                </div>
                <div id="local-tt-list" style="max-height:260px;overflow:auto;border:1px solid #ddd;padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:10px;"></div>

                <div id="interceptor-status" style="height:90px;overflow-y:auto;border:1px solid #ddd;padding:10px;font-size:12px;background:#f9f9f9;">
                    就绪。
                </div>
            </div>
        `;

        const scraperPanel = document.createElement('div');
        scraperPanel.id = 'scraper-panel';
        scraperPanel.style.cssText = baseStyle;

        scraperPanel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;cursor:pointer;" data-panel="scraper">
                <h3 style="margin:0;">课程抓取</h3>
                <span id="scraper-toggle" style="font-size:20px;user-select:none;">−</span>
            </div>
            <div id="scraper-content">
                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;font-size:13px;">选择学期：</label>
                    <div style="display:flex;gap:5px;">
                        <select id="year-select" style="flex:1;padding:5px;">${yearOptions.join('')}</select>
                        <select id="term-select" style="flex:1;padding:5px;">
                            <option value="10">Fall</option>
                            <option value="20">Winter</option>
                            <option value="30">Spring</option>
                            <option value="40">Summer</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;font-size:13px;">并发（1-10）：</label>
                    <input id="concurrency-input" type="number" min="1" max="10" value="3" style="width:100%;padding:5px;box-sizing:border-box;">
                </div>

                <div style="margin-bottom:10px;">
                    <select id="subject-select" style="width:100%;padding:5px;" disabled>
                        <option value="">正在加载科目列表...</option>
                    </select>
                </div>

                <div style="margin-bottom:10px;">
                    <button id="scrape-single-btn" style="width:100%;padding:8px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;">
                        抓取所选科目
                    </button>
                </div>

                <div style="margin-bottom:10px;">
                    <button id="scrape-all-btn" style="width:100%;padding:8px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;">
                        抓取全部科目
                    </button>
                </div>

                <div style="display:flex;gap:5px;margin-bottom:10px;">
                    <button id="export-json-btn" style="flex:1;padding:8px;background:#FF9800;color:white;border:none;border-radius:4px;cursor:pointer;">导出</button>
                    <button id="view-data-btn" style="flex:1;padding:8px;background:#607D8B;color:white;border:none;border-radius:4px;cursor:pointer;">查看</button>
                </div>

                <div style="margin-bottom:10px;">
                    <button id="clear-all-btn" style="width:100%;padding:8px;background:#d32f2f;color:white;border:none;border-radius:4px;cursor:pointer;">
                        清空所有已存数据
                    </button>
                </div>

                <div id="scraper-progress" style="height:120px;overflow-y:auto;border:1px solid #ddd;padding:10px;font-size:12px;background:#f9f9f9;">
                    准备就绪。
                </div>

                <div style="margin-top:10px;font-size:11px;color:#666;">
                    共 <span id="total-courses">0</span> 门课
                </div>
            </div>
        `;

        safeAppend(container, interceptorPanel);
        safeAppend(container, scraperPanel);
        safeAppend(getBodyOrRoot(), container);

        interceptorPanel.querySelector('[data-panel="interceptor"]')?.addEventListener('click', () => togglePanel('interceptor'));
        scraperPanel.querySelector('[data-panel="scraper"]')?.addEventListener('click', () => togglePanel('scraper'));

        currentOpenPanel = 'interceptor';
        collapsePanel('scraper');

        const ysel = document.getElementById('year-select');
        const tsel = document.getElementById('term-select');
        if (ysel) ysel.value = defaultTerm.slice(0, 2);
        if (tsel) tsel.value = defaultTerm.slice(2, 4);

        ysel?.addEventListener('change', loadSubjects);
        tsel?.addEventListener('change', loadSubjects);
        document.getElementById('scrape-single-btn')?.addEventListener('click', scrapeSingleSubject);
        document.getElementById('scrape-all-btn')?.addEventListener('click', scrapeAllSubjects);
        document.getElementById('export-json-btn')?.addEventListener('click', exportJSON);
        document.getElementById('view-data-btn')?.addEventListener('click', viewStoredData);
        document.getElementById('clear-all-btn')?.addEventListener('click', clearAllData);
        document.getElementById('apply-intercept-btn')?.addEventListener('click', applyInterception);

        document.getElementById('refresh-local-tt-btn')?.addEventListener('click', () => {
            renderLocalTimetableManager();
        });

        ensureExportModalDom();
        updateTotalCourses();
        loadSubjects();
        renderLocalTimetableManager();
    }

    // ==================== 初始化（只执行一次） ====================

    function initOnce() {
        if (window.__HKUST_PANEL_INITED__) return;
        window.__HKUST_PANEL_INITED__ = true;

        try { installSemesterDropdownObserver(); } catch (e) { debugLog('UI', 'installSemesterDropdownObserver failed', e); }

        try {
            if (!document.getElementById('unified-panel-container')) {
                createIntegratedPanels();
            }
        } catch (e) {
            debugLog('UI', 'createIntegratedPanels failed', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnce, { once: true });
    } else {
        initOnce();
    }
    window.addEventListener('load', initOnce, { once: true });

})();