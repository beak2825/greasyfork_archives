// ==UserScript==
// @name         C6 直播辅助
// @namespace    ui-preview-enhanced
// @version      1.2.9527
// @match        *://*/*
// @description  C6 直播辅助+盘口助手+直播助手
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      LGPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563069/C6%20%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/563069/C6%20%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==========================================================================
       1. CONFIGURATION (配置常量)
       ========================================================================== */
    const CONFIG = {
        HOURS_LIMIT: 24, // 抓取时效限制
        DELAY: 500,      // 爬虫请求间隔
        KEYS: {
            PREVIEW_DATA: 'preview_tid_data',
            SCORE_SITES: 'score_site_config',
            LIVE_DATE: 'preview_live_date',
            AUX_DATA: 'aux_panel_data',
            AUX_CONFIG: 'aux_panel_config'
        },
        REGEX: {
            LM: /賽事|赛事/,
            TIME: /比賽時間|時間|比赛时间|时间/,
            HOME: /主隊|主队|主/,
            HANDICAP: /讓球|让球|让|讓|盘口|平局/,
            AWAY: /客隊|客队|客/
        },
        WORDS: {
            FINISHED: ['完', '完结', '结束'],
            // 明确的走盘/无效词汇
            VOIDED: ['走', '走盘']
        }
    };

    /* ==========================================================================
       2. GLOBAL STATE (全局状态)
       ========================================================================== */
    const State = {
        panel: null,
        previewPanel: null,
        livePanel: null,
        previewVisible: false,
        liveVisible: false,
        scoreManagerVisible: false,
        isEditMode: false,

        // Data Store
        previewData: loadData(CONFIG.KEYS.PREVIEW_DATA, []),
        scoreSiteList: loadData(CONFIG.KEYS.SCORE_SITES, [
            { name: '足球(007)', url: 'https://live.titan007.com/oldIndexall.aspx' },
            { name: '篮球(007)', url: 'https://lq3.titan007.com/nba.htm' }
        ]),
        auxData: loadData(CONFIG.KEYS.AUX_DATA, { title: '', content: '', reply: '' }),
        auxConfig: loadData(CONFIG.KEYS.AUX_CONFIG, { refreshSec: 120, autoSec: 120 }),
    };

    /* ==========================================================================
       3. UTILITIES (通用工具函数)
       ========================================================================== */
    function loadData(key, def) {
        try {
            return JSON.parse(localStorage.getItem(key)) || def;
        } catch (e) {
            return def;
        }
    }

    function saveData(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback for older environments or non-secure contexts
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // --- Time Parsing Utils ---

    function parseTimeStr(str) {
        if (!str) return null;
        str = str.trim();
        const now = new Date();

        // Format HH:mm (自动补全为当天)
        if (/^\d{1,2}:\d{1,2}$/.test(str)) {
            const parts = str.split(':');
            const d = new Date();
            d.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
            return d;
        }
        // Format MM-DD HH:mm (自动补全为当年)
        if (/^\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}$/.test(str)) {
            // 补全年份并替换横杠，兼容手机
            const year = now.getFullYear();
            const safeStr = `${year}-${str}`.replace(/-/g, '/');
            return new Date(safeStr);
        }

        // Full Date string (YYYY-MM-DD HH:mm)
        // 核心修复：把所有 "-" 替换为 "/"，解决 Mobile Safari Invalid Date 问题
        const safeStr = str.replace(/-/g, '/');
        const d = new Date(safeStr);
        return isNaN(d.getTime()) ? null : d;
    }

    function parseDeadline(str) {
        if (!str) return null;
        const m = str.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
        if (m) {
            return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5])).getTime();
        }
        return null;
    }

    function getNextDayMidnightStr(deadlineTs) {
        const d = deadlineTs ? new Date(deadlineTs) : new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day} 00:00`;
    }

    function normalizeStartTime(str) {
        if (!str) return '';
        let s = str.trim();
        s = s.replace(/：/g, ':').replace(/[．。]/g, '.');
        s = s.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2})(\d{2})$/, (_, d, h, m) => `${d} ${h}:${m}`);
        s = s.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{1,2})[:.](\d{1,2})$/, (_, d, h, m) => `${d} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        return s;
    }

    function isValidStartTimeStrict(str) {
        return /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(str);
    }

    // --- String/Title Utils ---

    function extractFirstBracket(title) {
        if (!title) return '';
        const m = title.match(/^\s*\[([^\]]+)\]/);
        return m ? m[1] : '';
    }

    function extractTitleBrackets(title) {
        if (!title) return '';
        const all = title.match(/\[[^\]]+]/g) || [];
        if (!all.length) return '';
        // 标题含“场次 / 場次” → 取前两个 []
        if (/[场次|場次]/.test(title) && all.length >= 2) {
            return all[0] + all[1];
        }
        return all[0];
    }

    function fetchRandomPoem() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://v1.jinrishici.com/rensheng.txt',
                onload: res => {
                    const text = (res.responseText || '').trim();
                    resolve(text.replace(/\s+/g, ' '));
                },
                onerror: () => resolve('')
            });
        });
    }

    /* ==========================================================================
       4. CORE LOGIC (核心业务逻辑)
       ========================================================================== */

    /**
     * 计算比赛状态：自动/手动/走盘/已完结/未开赛
     */
    function calcMatchStatus(m) {
        // 如果人工手动把状态设为 走盘，尊重人工设置
        if (m.status === '走盘') return '走盘';

        const now = Date.now();
        const startTime = parseTimeStr(m.startTime);
        const started = !!(startTime && now >= startTime.getTime());
        const rawProgress = (m.progress || '').trim();
        const progress = rawProgress || '';
        const urlStat = (m.scoreUrlStatus || '').trim();
        const manualTouched = m._manualProgress || m._manualScore || m._manualResult;

        const norm = s => (s == null ? '' : String(s).trim());
        const eqIgnoreCase = (a, b) => norm(a).toLowerCase() === norm(b).toLowerCase();
        const isExact = (val, arr) => {
            if (!val) return false;
            for (const x of (arr || [])) {
                if (eqIgnoreCase(val, x)) return true;
            }
            return false;
        };

        // 1) 走盘 —— 进度词匹配 VOIDED
        if (isExact(progress, CONFIG.WORDS.VOIDED)) return '走盘';
        // 2) 已完结 —— 进度词匹配 FINISHED
        if (isExact(progress, CONFIG.WORDS.FINISHED)) return '已完结';
        // 3) 未开赛
        if (!startTime || !started) return '未开赛';
        // 4) 手动干预或地址异常
        if (manualTouched || !urlStat || /失败|异常|error/i.test(urlStat)) return '手动';
        // 5) 自动
        return '自动';
    }

    /**
     * 根据比分和盘口计算赛果
     */
    function autoBuildResult(m) {
        if (!m) return '';
        if (m.status === '走盘') return '走盘';
        if (m.homeScore === '' || m.awayScore === '' || m.homeScore == null || m.awayScore == null) return '';

        const hs = Number(m.homeScore);
        const as = Number(m.awayScore);
        if (isNaN(hs) || isNaN(as)) return '';

        const leagueText = m.league || '';
        const pk = String(m.handicap || '').trim();

        // 逻辑A: 大小球逻辑
        if (/总分|大小球|大小/.test(leagueText) && /^(\d+(\.\d+)?)(\/\d+(\.\d+)?)?$/.test(pk)) {
            const total = hs + as;
            const parts = pk.includes('/') ? pk.split('/').map(Number) : [Number(pk)];
            const bigTeam = m.home || '大球';
            const smallTeam = m.away || '小球';
            const bigOdds = m.homeOdd ? `[${m.homeOdd}] ` : '';
            const smallOdds = m.awayOdd ? `[${m.awayOdd}] ` : '';

            let bigWin = 0, smallWin = 0;
            parts.forEach(p => {
                if (total > p) bigWin++;
                else if (total < p) smallWin++;
            });

            if (bigWin === 0 && smallWin === 0) return '走盘';
            if (bigWin > smallWin) return `${bigOdds}${bigTeam}${bigWin < parts.length ? '（赢半）' : ''}`;
            if (smallWin > bigWin) return `${smallOdds}${smallTeam}${smallWin < parts.length ? '（赢半）' : ''}`;
            return '';
        }

        // 逻辑B: 让球逻辑
        return judgeHandicapResultWithHalf(m, hs, as);
    }

    function judgeHandicapResultWithHalf(m, hs, as) {
        const line = String(m.handicap || '').trim();
        if (!line) return '';

        const homeTeam = m.home || '';
        const awayTeam = m.away || '';
        const homeOdds = m.homeOdd ? `[${m.homeOdd}] ` : '';
        const awayOdds = m.awayOdd ? `[${m.awayOdd}] ` : '';
        const isHomeGive = line.startsWith('-');

        const raw = line.replace(/[+-]/g, '');
        const parts = raw.includes('/') ? raw.split('/').map(Number) : [Number(raw)];

        let homeWin = 0, awayWin = 0;
        parts.forEach(p => {
            const adj = isHomeGive ? -p : p;
            const diff = (hs - as) + adj;
            if (diff > 0) homeWin++;
            else if (diff < 0) awayWin++;
        });

        if (homeWin === 0 && awayWin === 0) return '走盘';
        if (homeWin > awayWin) {
            const half = homeWin < parts.length;
            return `${homeOdds}${homeTeam}${half ? '（赢半）' : ''}`;
        }
        if (awayWin > homeWin) {
            const half = awayWin < parts.length;
            return `${awayOdds}${awayTeam}${half ? '（赢半）' : ''}`;
        }
        return '';
    }

    function resultChar(m) {
        // 用于生成标题的简短结果符
        if (m.status === '走盘') return '走';
        if (m.status === '已完结') {
            let r = (m.result || autoBuildResult(m) || '').trim();
            if (!r) return '*';
            const isHalf = /赢半/.test(r);
            const clean = r.replace(/（.*?）/g, ''); // 去掉括号，避免干扰
            if (m.home && clean.includes(m.home)) return isHalf ? '主(半)' : '主';
            if (m.away && clean.includes(m.away)) return isHalf ? '客(半)' : '客';
            return '*';
        }
        return '*';
    }

    /* ==========================================================================
       5. DATA & NETWORK (数据抓取与解析)
       ========================================================================== */

    function fetchRawHTML(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url, responseType: 'arraybuffer',
                onload: res => {
                    try {
                        const buffer = res.response;
                        let html = new TextDecoder('utf-8').decode(buffer);
                        if (html.match(/charset\s*=\s*["']?(gbk|gb2312|gb18030)/i)) {
                            html = new TextDecoder('gbk').decode(buffer);
                        }
                        resolve(html);
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    function extractTidsFromTodayHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('tr');
        const nowSec = Math.floor(Date.now() / 1000);
        const LIMIT_SEC = CONFIG.HOURS_LIMIT * 3600;
        const list = [];

        rows.forEach(tr => {
            if (!tr.classList.contains('tr3')) return;
            const tdTal = tr.querySelector('td.tal');
            if (!tdTal) return;

            const typeText = tdTal.textContent || '';
            if (!/\[(開盤|对赌)\]/.test(typeText)) return;

            const timeEl = tr.querySelector('span[data-timestamp]');
            if (!timeEl) return;
            const ts = parseInt(timeEl.dataset.timestamp.replace(/\D/g, ''), 10);
            if (!ts || (nowSec - ts > LIMIT_SEC)) return;

            const linkEl = tdTal.querySelector('h3 a');
            if (!linkEl) return;

            let tid = null;
            if (linkEl.id && /^t\d+$/.test(linkEl.id)) tid = linkEl.id.replace('t', '');
            else {
                const m = linkEl.href.match(/\/(\d+)\.html/) || linkEl.href.match(/tid=(\d+)/);
                if (m) tid = m[1];
            }
            if (!tid) return;

            const fullTitle = linkEl.textContent.trim();
            let author = '未知';
            const authorEl = tr.querySelector('a.bl');
            if (authorEl) author = authorEl.textContent.trim();

            list.push({ tid, title: fullTitle, author, deadline: parseDeadline(fullTitle), postTs: ts });
        });
        return list;
    }

    function parseReadPageMeta(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const meta = { title: '', author: '', deadline: null };
        const h4 = doc.querySelector('h4');
        if (h4) {
            meta.title = h4.textContent.trim();
            meta.deadline = parseDeadline(meta.title);
        }
        const authorB = doc.querySelector('th[rowspan="2"] > b');
        if (authorB) meta.author = authorB.textContent.trim();
        else {
            const bl = doc.querySelector('a.bl');
            if (bl) meta.author = bl.textContent.trim();
        }
        return meta;
    }

    function extractRawTablesFromHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const contentDiv = doc.querySelector('#conttpc');
        if (!contentDiv) return [];

        const tables = Array.from(contentDiv.querySelectorAll('table'));
        const rawTables = [];

        tables.forEach((table, tableIndex) => {
            const trs = Array.from(table.querySelectorAll('tr'))
                .filter(tr => !tr.querySelector('td[colspan]'));
            if (trs.length < 2) return;

            // 表头
            const headerTds = Array.from(trs[0].querySelectorAll('td'));
            const headers = headerTds.map((td, i) => {
                const text = td.textContent.replace(/\s+/g, '').trim();
                let role = null;
                if (CONFIG.REGEX.LM.test(text)) role = 'league';
                else if (CONFIG.REGEX.TIME.test(text)) role = 'time';
                else if (CONFIG.REGEX.HOME.test(text)) role = 'home';
                else if (CONFIG.REGEX.HANDICAP.test(text)) role = 'handicap';
                else if (CONFIG.REGEX.AWAY.test(text)) role = 'away';
                return { index: i, text, role };
            });

            if (!headers.some(h => h.role === 'home') || !headers.some(h => h.role === 'away')) {
                return;
            }

            // 数据行
            const rows = trs.slice(1).map(tr => {
                const tds = Array.from(tr.querySelectorAll('td'));
                return tds.map((td, i) => ({
                    text: td.textContent.trim(),
                    rawHTML: td.innerHTML.trim(),
                    role: headers[i]?.role || null
                }));
            });

            rawTables.push({ tableIndex, headers, rows, rawHTML: table.outerHTML });
        });

        return rawTables;
    }

    function rawTablesToMatches(rawTables, title) {
        const deadlineTs = parseDeadline(title);
        const defaultStartTime = getNextDayMidnightStr(deadlineTs);
        const parseTeamCell = (rawText) => {
            const m = rawText.match(/^\[([\d\.]+)\](.*)$/);
            return m ? { odd: m[1], name: m[2].trim() } : { odd: '', name: rawText.trim() };
        };

        const matches = [];

        rawTables.forEach(rt => {
            rt.rows.forEach(row => {
                let league = '', rawTime = '', homeRaw = '', handicap = '', awayRaw = '';

                row.forEach(cell => {
                    if (!cell.role) return;
                    if (cell.role === 'league') league = cell.text;
                    else if (cell.role === 'time') rawTime = cell.text;
                    else if (cell.role === 'home') homeRaw = cell.text;
                    else if (cell.role === 'handicap') handicap = cell.text;
                    else if (cell.role === 'away') awayRaw = cell.text;
                });

                if (!homeRaw && !awayRaw && !league) return;

                const homeObj = parseTeamCell(homeRaw);
                const awayObj = parseTeamCell(awayRaw);

                matches.push({
                    _mid: generateUUID(),
                    league,
                    home: homeObj.name,
                    homeOdd: homeObj.odd,
                    handicap,
                    away: awayObj.name,
                    awayOdd: awayObj.odd,
                    startTime: rawTime || defaultStartTime,
                    status: '未开赛',
                    _isManual: false,
                    roundTag: extractFirstBracket(title)
                });
            });
        });

        return matches;
    }

    async function rebuildTodayOddsLogic() {
        State.previewData.length = 0;
        saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);

        const listHtml = await fetch('/thread0806.php?fid=23&search=today').then(r => r.text());
        const tids = extractTidsFromTodayHTML(listHtml);
        if (!tids.length) {
            alert('未抓取到符合条件(类别/时间)的今日 TID');
            return;
        }

        for (const item of tids) {
            try {
                const readHtml = await fetchRawHTML(`/read.php?tid=${item.tid}&toread=1`);
                const meta = parseReadPageMeta(readHtml);
                const rawTables = extractRawTablesFromHTML(readHtml);
                const matches = rawTablesToMatches(rawTables, meta.title);

                State.previewData.push({
                    tid: item.tid,
                    title: meta.title,
                    author: meta.author,
                    deadline: meta.deadline,
                    extra: { rawTables, matches, manualMatches: [] }
                });
            } catch (e) {
                console.error(`TID ${item.tid} 抓取失败`, e);
            }
            await new Promise(r => setTimeout(r, CONFIG.DELAY));
        }

        sortPreviewDataByDeadline();
        saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
    }

    async function refreshSingleTid(tid) {
        const item = State.previewData.find(x => String(x.tid) === String(tid));
        if (!item) return;
        try {
            const html = await fetchRawHTML(`/read.php?tid=${tid}&toread=1`);
            const meta = parseReadPageMeta(html);
            if (meta.author) item.author = meta.author;
            const rawTables = extractRawTablesFromHTML(html);
            const matches = rawTablesToMatches(rawTables, meta.title || item.title);
            item.extra.matches = matches;
            item.extra.manualMatches = [];
            saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
        } catch (e) {
            alert(`TID ${tid} 刷新失败`);
        }
    }

    async function addCurrentPageSmart() {
        let tid = null;
        const m = location.href.match(/tid=(\d+)/) || location.href.match(/\/(\d+)\.html/);
        tid = m ? m[1] : prompt("无法获取当前TID，请输入：", "");
        if (!tid) return;
        if (State.previewData.find(d => String(d.tid) === String(tid))) {
            alert('该 TID 已存在列表中！');
            return;
        }

        try {
            const html = await fetchRawHTML(`/read.php?tid=${tid}&toread=1`);
            const meta = parseReadPageMeta(html);
            const rawTables = extractRawTablesFromHTML(html);
            const matches = rawTablesToMatches(rawTables, meta.title);

            State.previewData.push({
                tid: String(tid),
                title: meta.title || `TID ${tid}`,
                author: meta.author || '未知',
                deadline: meta.deadline,
                extra: { rawTables, matches, manualMatches: [] }
            });
            sortPreviewDataByDeadline();
            saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            renderPreviewData();
        } catch (e) {
            alert('抓取失败，请检查网络或页面结构');
            console.error(e);
        }
    }

    /* ==========================================================================
       6. EXPORT / BBCODE (发帖格式生成)
       ========================================================================== */

    async function buildAutoPostTitle() {
        const dateStr = State.previewPanel?.querySelector('#liveDateInput')?.value || '';
        const poem = await fetchRandomPoem();
        const parts = [];

        State.previewData.forEach(item => {
            const tag = extractTitleBrackets(item.title);
            if (!tag) return;
            const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            if (!all.length) return;
            const resultStr = all.map(m => resultChar(m)).join('');
            parts.push(`${tag}${resultStr}`);
        });
        return `${dateStr} ${poem}  ${parts.join(' ')}`.trim();
    }

    function buildLiveReplyHeader(m) {
        const round = m.roundTag ? `[${m.roundTag}]` : '';
        const league = m.league ? `[${m.league}]` : '';
        return round + league;
    }

    function buildLiveReplyBBCode(m) {
        const homeVal = m.homeOdd ? `[${m.homeOdd}] ${m.home}` : (m.home || '');
        const awayVal = m.awayOdd ? `[${m.awayOdd}] ${m.away}` : (m.away || '');
        const homeScore = m.homeScore ?? '';
        const awayScore = m.awayScore ?? '';

        return (
            `[color=green]${homeVal}[/color]　` +
            `[color=#FF6600]${m.handicap || ''}[/color]　` +
            `[color=green]${awayVal}[/color] ` +
            `[color=orange]${m.progress || ''}[/color]\n` +
            `[size=4]` +
            `[backcolor=blue][color=white]　${homeScore}　[/color][/backcolor]` +
            `　-　` +
            `[backcolor=blue][color=white]　${awayScore}　[/color][/backcolor]` +
            `[/size]`
        );
    }

    function generateLiveReplyText(matchList) {
        const groups = new Map();
        matchList.forEach(m => {
            const header = buildLiveReplyHeader(m);
            if (!groups.has(header)) groups.set(header, []);
            groups.get(header).push(m);
        });
        const out = [];
        groups.forEach((matches, header) => {
            out.push(header);
            matches.forEach(m => out.push(buildLiveReplyBBCode(m)));
        });
        return out.join('\n');
    }

    function buildTidTitle(item) {
        const d = item.deadline ? new Date(item.deadline) : null;
        const ym = d ? String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') : '';
        let body = (item.title || '').replace(/^Tid：\d+\s*/i, '').replace(/@\S+$/, '').trim();
        if (body.indexOf('[') !== -1) body = body.slice(body.indexOf('['));
        return `[tid=${item.tid}-23-${ym}]${item.author || '未知'}[/tid]${body}`;
    }

    function buildOddsBBCode(item) {
        const matches = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
        if (!matches.length) return '';

        const tidTitle = buildTidTitle(item);
        const tidTag = (tidTitle.match(/^\[tid=[^\]]+\][^\[]+\[\/tid\]/) || [''])[0];

        let bb = `[table][tr][td=7,1][align=center][b][color=red][size=4]${item.title.trim()}[/size][/color][/b]\n${tidTag}[/align][/td][/tr]`;
        bb += `[tr]` + ['开赛时间', '赛事', '主隊', '让球盘', '客隊', '比分', '赢盘球队']
            .map(h => `[td][align=center][b][color=purple][size=3]${h}\n[/size][/color][/b][/align][/td]`).join('') + `[/tr]`;

        matches.forEach((m, idx) => {
            const n = idx + 1;
            const timeText = m.startTime || `${item.date || ''} 待定${n}`;
            const leagueText = m.league || '';
            const homeText = m.homeOdd ? `[${m.homeOdd}]${m.home}` : (m.home || '');
            const awayText = m.awayOdd ? `[${m.awayOdd}]${m.away}` : (m.away || '');
            const handicapText = m.handicap || '';
            const scoreText = (m.homeScore && m.awayScore) ? `${m.homeScore}:${m.awayScore}` : `比分${n}`;
            const winText = m.result || autoBuildResult(m) || `赢盘${n}`;

            bb += `[tr]` +
                `[td][align=center][b][color=green][size=3]${timeText}\n[/size][/color][/b][/align][/td]` +
                `[td][align=center][b][color=orange][size=3]${leagueText}\n[/size][/color][/b][/align][/td]` +
                `[td][align=center][b][color=green][size=3]${homeText}\n[/size][/color][/b][/align][/td]` +
                `[td][align=center][b][color=red][size=3]${handicapText}\n[/size][/color][/b][/align][/td]` +
                `[td][align=center][b][color=green][size=3]${awayText}\n[/size][/color][/b][/align][/td]` +
                `[td][align=center][b][color=red][size=3]${scoreText}\n[/size][/color][/b][/align][/td]` +
                `[td][align=center][b][color=blue][size=3]${winText}\n[/size][/color][/b][/align][/td]` +
                `[/tr]`;
        });
        return bb + `[/table]\n`;
    }

    /* ==========================================================================
       7. UI CREATION (界面构建)
       ========================================================================== */

    function initUI() {
        const style = document.createElement('style');
        style.textContent = `
            .aux-btn-group button, .preview-header-btn { margin: 0 2px; padding: 2px 8px; font-size: 12px; cursor: pointer; }
            .odds-table { width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed; }
            .odds-table th, .odds-table td { border: 1px solid #ccc; padding: 2px; text-align: center; }
            .odds-table input, .odds-table select { width: 100%; box-sizing: border-box; border: 1px solid #ddd; padding: 2px; font-size: 11px; }
            .odds-table th { background: #eee; font-weight: bold; }
            .col-status { width: 70px; } .col-time { width: 100px; } .col-score { width: 40px; }
            .col-progress { width: 50px; } .col-result { width: 120px; } .col-op { width: 60px; }
            .ipt-score-url-status { font-size: 11px; text-align: center;padding: 1px;}
            .col-score-url { width: 100px; min-width: 80px; max-width: 80px; }
            .ipt-result { font-weight: bold; font-size: 13px; white-space: nowrap; }
            .col-score-url select { margin-bottom: 2px; }
            .status-live { color: red; font-weight: bold; }
            .status-wait { color: green; }
            .edit-ctrl-btn { margin: 0 2px; padding: 1px 4px; font-size: 10px; cursor: pointer;}
            .preview-panel { max-height: calc(100vh - 40px); overflow: auto; }
            .preview-header-sticky { position: sticky; top: 0; z-index: 3; background: #f0f0f0; }
        `;
        document.head.appendChild(style);
      document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        refreshAllMatchStatus();
        saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);

        if (State.previewVisible) renderPreviewData();
        if (State.liveVisible) renderLiveData();
    }
});


        createFloatButton();
        createMainPanel();
        createPreviewUI();
        createLiveUI();
    }

    function createFloatButton() {
        const btn = document.createElement('button');
        btn.textContent = '直播辅助';
        Object.assign(btn.style, {
            position: 'fixed', right: '20px', bottom: '60px', zIndex: 999999,
            padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'
        });document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        refreshAllMatchStatus();
        saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);

        if (State.previewVisible) renderPreviewData();
        if (State.liveVisible) renderLiveData();
    }
});

        btn.onclick = () => { State.panel.style.display = State.panel.style.display === 'none' ? 'block' : 'none'; };
        document.body.appendChild(btn);
    }

    function createMainPanel() {
        State.panel = document.createElement('div');
        Object.assign(State.panel.style, {
            position: 'fixed', right: '20px', top: '20px', width: '380px',
            background: '#f9f9f9', border: '1px solid #999', fontSize: '13px',
            zIndex: 999998, display: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        });
        const renderInputBlock = (label, key) => `
            <div style="padding:6px;border-bottom:1px solid #ddd;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <b>${label}</b>
                    <div class="aux-btn-group" data-key="${key}">
                        <button data-action="clear">清除</button>
                        <button data-action="save">保存</button>
                        <button data-action="load">刷新</button>
                        <button data-action="copy">复制</button>
                    </div>
                </div>
                <textarea id="aux_${key}" style="width:100%;height:50px;resize:vertical;">${State.auxData[key] || ''}</textarea>
            </div>`;

        State.panel.innerHTML = `
            <div style="padding:8px;font-weight:bold;background:#ddd;border-bottom:1px solid #aaa;">直播辅助控制台</div>
            ${renderInputBlock('发帖标题', 'title')}
            ${renderInputBlock('发帖内容', 'content')}
            ${renderInputBlock('直播回复', 'reply')}

            <div style="padding:6px;border-bottom:1px solid #ddd;">
                <label><input type="checkbox" disabled> 标题</label>
                <label><input type="checkbox" disabled> 内容</label>
                <label><input type="checkbox" disabled> 回复</label>
                <label><input type="checkbox" disabled> 得分</label>
                <label><input type="checkbox" disabled> 自动</label>
            </div>

            <div style="padding:8px;border-bottom:1px solid #ddd;display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                <div>每 <input id="refreshSec" type="number" value="${State.auxConfig.refreshSec}" style="width:70px;text-align:center;"> 秒自动刷新</div>
                <button disabled style="padding:2px 10px;">停止</button>
                <button disabled style="padding:2px 10px;">运行</button>
                <div style="width:100%;height:1px;"></div>
                <div>每 <input id="autoSec" type="number" value="${State.auxConfig.autoSec}" style="width:70px;text-align:center;"> 秒自动回复</div>
                <button disabled style="padding:2px 10px;">停止</button>
                <button disabled style="padding:2px 10px;">运行</button>
            </div>

            <div style="padding:8px;display:flex;gap:8px;">
                <button data-action="open-preview" style="flex:1;padding:8px;background:#17a2b8;color:white;border:none;cursor:pointer;">打开盘口助手</button>
                <button data-action="open-live-from-panel" style="flex:1;padding:8px;background:#6f42c1;color:white;border:none;cursor:pointer;">打开直播助手</button>
            </div>
        `;
        State.panel.addEventListener('click', handleMainPanelClick);
        document.body.appendChild(State.panel);
    }

    function createPreviewUI() {
        State.previewPanel = document.createElement('div');
        State.previewPanel.className = 'preview-panel';
        Object.assign(State.previewPanel.style, {
            position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)', maxWidth: '1400px', maxHeight: '900px',
            background: '#fff', border: '2px solid #555', zIndex: 999997, borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'none', flexDirection: 'column', overflow: 'hidden'
        });
        const header = document.createElement('div');
        header.className = 'preview-header-sticky';
        header.style.cssText = `padding:10px; background:#f0f0f0; border-bottom:1px solid #ccc; position:sticky; top:0; z-index:10;`;
        header.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; width:100%;">
                <strong style="font-size:16px;">盘口助手</strong>
                <span style="font-size:12px;color:#666;">直播日期:</span>
                <input type="text" id="liveDateInput" value="${loadData(CONFIG.KEYS.LIVE_DATE, '')}" style="width:100px;text-align:center;">
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-left:10px;">
                    <button class="preview-header-btn" data-action="toggle-edit">编辑盘口</button>
                    <button class="preview-header-btn" data-action="refresh-all">重新获取盘口</button>
                    <button class="preview-header-btn" data-action="toggle-score-mgr">比分地址管理</button>
                    <button class="preview-header-btn" data-action="add-page">添加本页</button>
                    <span style="border-left:1px solid #ccc;margin:0 6px;"></span>
                    <button class="preview-header-btn" data-action="reload-ui">刷新界面</button>
                    <button class="preview-header-btn" style="background:#28a745;color:white;" data-action="save-all">保存全部</button>
                    <button class="preview-header-btn" style="background:#6f42c1;color:white;" data-action="open-live">打开直播助手</button>
                </div>
                <div style="margin-left:auto;">
                    <button class="preview-header-btn" style="background:#dc3545;color:white;" data-action="close-preview">关闭</button>
                </div>
            </div>`;
        State.previewPanel.appendChild(header);

        const content = document.createElement('div');
        content.className = 'preview-content';
        content.style.cssText = `flex:1; overflow-y:auto; padding:10px;`;
        State.previewPanel.appendChild(content);

        // Score Manager Modal
        const scoreMgr = document.createElement('div');
        scoreMgr.id = 'scoreManager';
        scoreMgr.style.cssText = `display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:520px; max-width:90vw; background:white; border:1px solid #888; padding:12px; box-shadow:0 8px 25px rgba(0,0,0,0.35); z-index:1000000; border-radius:6px;`;
        scoreMgr.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                <strong>比分地址管理</strong>
                <button data-action="close-score-mgr">✕</button>
            </div>
            <div id="scoreSiteListDiv" style="max-height:240px; overflow-y:auto; margin-bottom:8px; border:1px solid #eee; padding:4px;"></div>
            <div style="display:flex;gap:6px;">
                <input id="newScoreName" placeholder="名称" style="width:90px;">
                <input id="newScoreUrl" placeholder="URL" style="flex:1;min-width:0;">
                <button data-action="add-score-site">添加</button>
            </div>`;
        State.previewPanel.appendChild(scoreMgr);

        // Events
        State.previewPanel.addEventListener('click', handlePreviewClick);
        State.previewPanel.addEventListener('change', handlePreviewChange);
        State.previewPanel.addEventListener('input', handlePreviewInput);
        State.previewPanel.addEventListener('focusout', handlePreviewBlur);
        document.body.appendChild(State.previewPanel);
    }

    function createLiveUI() {
        State.livePanel = document.createElement('div');
        Object.assign(State.livePanel.style, {
            position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)', maxWidth: '1200px', maxHeight: '800px',
            background: '#fff', border: '2px solid #444', zIndex: 999996, display: 'none', flexDirection: 'column'
        });
        State.livePanel.innerHTML = `
            <div style="padding:10px;background:#f0f0f0;border-bottom:1px solid #ccc; display:flex;align-items:center;">
                <strong style="font-size:16px;">直播助手</strong>
                <div style="margin-left:auto;display:flex;gap:6px;">
                    <button data-action="live-reload">刷新界面</button>
                    <button data-action="live-save" style="background:#28a745;color:white;">保存全部</button>
                    <button data-action="live-open-preview" style="background:#17a2b8;color:white;">打开盘口助手</button>
                    <button data-action="live-close" style="background:#dc3545;color:white;">关闭</button>
                </div>
            </div>
            <div class="live-content" style="flex:1;overflow:auto;padding:10px;"></div>
        `;
        State.livePanel.addEventListener('click', handleLiveClick);
        State.livePanel.addEventListener('input', handleLiveInput);
        State.livePanel.addEventListener('focusout', handleLiveBlur);
        document.body.appendChild(State.livePanel);
    }

    function createMatchRowHTML(m, tidIdx, matchIdx) {
        const isEdit = State.isEditMode;
        const lockBasic = !isEdit ? 'disabled' : '';
        const displayStatus = m.status || '未开赛';
        const statusClass = displayStatus === '自动' ? 'status-live' : displayStatus === '未开赛' ? 'status-wait' : '';
        const homeVal = m.homeOdd ? `[${m.homeOdd}] ${m.home}` : m.home;
        const awayVal = m.awayOdd ? `[${m.awayOdd}] ${m.away}` : m.away;
        m._homeDisplay = homeVal;
        m._awayDisplay = awayVal;

        let siteOpts = `<option value="">选择地址</option>`;
        State.scoreSiteList.forEach(s => {
            siteOpts += `<option value="${s.url}" ${s.url === m.scoreUrl ? 'selected' : ''}>${s.name}</option>`;
        });
        const isCustom = m.scoreUrl && !State.scoreSiteList.some(x => x.url === m.scoreUrl);
        siteOpts += `<option value="__manual__" ${isCustom ? 'selected' : ''}>手动输入</option>`;

        return `
        <tr data-idx="${matchIdx}" data-manual="${m._isManual ? '1' : '0'}">
            <td>
                <select class="ipt-status ${statusClass}">
                    ${['自动','手动','未开赛','已完结','走盘'].map(v => `<option value="${v}" ${v===displayStatus ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
            </td>
            <td><input class="ipt-time" value="${m.startTime||''}"></td>
            <td><input class="ipt-league" value="${m.league||''}" ${lockBasic}></td>
            <td><input class="ipt-home" value="${homeVal||''}" ${lockBasic}></td>
            <td><input class="ipt-handicap" value="${m.handicap||''}" ${lockBasic}></td>
            <td><input class="ipt-away" value="${awayVal||''}" ${lockBasic}></td>
            <td><input class="ipt-progress" value="${m.progress||''}"></td>
            <td><input class="ipt-hscore" value="${m.homeScore||''}"></td>
            <td><input class="ipt-ascore" value="${m.awayScore||''}"></td>
            <td><input class="ipt-result" value="${m.result||''}"></td>
            <td><input class="ipt-score-url-status" value="${m.scoreUrlStatus||''}" ${lockBasic}></td>
            <td class="col-score-url">
                <select class="sel-score-site">${siteOpts}</select>
                <input class="ipt-score-manual" value="${m.scoreUrl||''}" style="display:${isCustom?'block':'none'}" placeholder="http://...">
            </td>
            ${isEdit ? `<td><button data-action="match-del" style="color:red;">删</button></td>` : ''}
        </tr>`;
    }

    function createLiveRowHTML(m) {
        return `
        <tr data-mid="${m._mid}">
            <td>${m.status}</td>
            <td>${m._homeDisplay || m.home}</td>
            <td>${m.handicap}</td>
            <td>${m._awayDisplay || m.away}</td>
            <td><input class="live-progress" value="${m.progress || ''}"></td>
            <td><input class="live-hs" value="${m.homeScore || ''}"></td>
            <td><input class="live-as" value="${m.awayScore || ''}"></td>
            <td><input class="live-result" value="${m.result || ''}"></td>
        </tr>`;
    }

    function renderScoreSiteList() {
        const div = State.previewPanel.querySelector('#scoreSiteListDiv');
        div.innerHTML = State.scoreSiteList.map((s, i) => `
            <div style="padding:4px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
                <span>${s.name}</span>
                <button data-action="score-site-del" data-idx="${i}" style="color:red;font-size:10px;">删</button>
            </div>
        `).join('');
    }

    function renderPreviewData() {
        const container = State.previewPanel.querySelector('.preview-content');
        container.innerHTML = '';
        if (!State.previewData.length) {
            container.innerHTML = '<div style="color:#999;text-align:center;margin-top:50px;">暂无数据，请点击“添加本页”或“重新获取盘口”</div>';
            return;
        }

        State.previewData.forEach((item, index) => {
            const block = document.createElement('div');
            block.className = 'tid-block';
            block.style.cssText = `border:1px solid #ccc; margin-bottom:15px; background:#fff; position:relative;`;
            block.dataset.tid = item.tid;
            block.dataset.index = index;

            const headerHtml = `
                <div style="background:#f8f9fa; padding:8px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
                    <a href="/read.php?tid=${item.tid}" target="_blank" style="font-weight:bold;text-decoration:none;color:#333;">${escapeHtml(buildTidTitle(item))}</a>
                    ${State.isEditMode ? `<div>
                        <button class="edit-ctrl-btn" data-action="tid-refresh">刷</button>
                        <button class="edit-ctrl-btn" data-action="tid-up">↑</button>
                        <button class="edit-ctrl-btn" data-action="tid-down">↓</button>
                        <button class="edit-ctrl-btn" style="color:red;" data-action="tid-del">删</button>
                    </div>` : ''}
                </div>`;

            const allMatches = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            let rowsHtml = allMatches.length === 0
                ? `<tr><td colspan="12" style="padding:10px;color:#999;">无盘口数据</td></tr>`
                : allMatches.map((m, mIdx) => createMatchRowHTML(m, index, mIdx)).join('');

            block.innerHTML = `
                ${headerHtml}
                <div style="padding:5px;">
                    <table class="odds-table">
                        <thead>
                            <tr>
                                <th class="col-status">状态</th> <th class="col-time">开赛时间</th> <th class="col-league">赛事</th>
                                <th>主队</th> <th style="width:50px;">盘口</th> <th>客队</th> <th class="col-progress">进度</th>
                                <th class="col-score">主</th> <th class="col-score">客</th> <th class="col-result">赛果</th>
                                <th style="width:50px;">地址状态</th> <th class="col-score-url">比分地址</th>
                                ${State.isEditMode ? `<th class="col-op">操作</th>` : ''}
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                    ${State.isEditMode ? `<button style="margin-top:5px;font-size:12px;" data-action="match-add">+ 添加一行</button>` : ''}
                </div>`;
            container.appendChild(block);
        });
    }

    function renderLiveData() {
        if (!State.livePanel) return;
        const container = State.livePanel.querySelector('.live-content');
        if (!container) return;
        container.innerHTML = '';
        State.previewData.forEach(item => {
            const matches = [...item.extra.matches, ...(item.extra.manualMatches || [])]
                .filter(m => ['自动', '手动'].includes(m.status));

            if (!matches.length) return;

            const block = document.createElement('div');
            block.style.border = '1px solid #ccc';
            block.style.marginBottom = '12px';
            block.innerHTML = `
                <div style="background:#fafafa;padding:6px;font-weight:bold;">${escapeHtml(item.title)}</div>
                <table class="odds-table">
                    <thead>
                        <tr>
                            <th>状态</th><th>主队</th><th>盘口</th><th>客队</th>
                            <th>进度</th><th>主</th><th>客</th><th>赛果</th>
                        </tr>
                    </thead>
                    <tbody>${matches.map(m => createLiveRowHTML(m)).join('')}</tbody>
                </table>`;
            container.appendChild(block);
        });
    }

    function updatePreviewRowUI(tr, m) {
        const sel = tr.querySelector('.ipt-status');
        if (sel) {
            sel.value = m.status;
            sel.className = 'ipt-status';
        }
        const res = tr.querySelector('.ipt-result');
        if (res) res.value = m.result || '';
    }

    /* ==========================================================================
       8. DATA SYNC (数据同步)
       ========================================================================== */

    function sortPreviewDataByDeadline() {
        State.previewData.sort((a, b) => {
            const ta = a.deadline || 0;
            const tb = b.deadline || 0;
            if (!ta && !tb) return b.tid - a.tid;
            if (!ta) return 1;
            if (!tb) return -1;
            return ta - tb;
        });
    }

    function recalcAllFinishedResults() {
        State.previewData.forEach(item => {
            if (!item?.extra) return;
            const allMatches = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            allMatches.forEach(m => {
                if (m.status !== '已完结') return;
                const r = autoBuildResult(m);
                if (r) m.result = r;
            });
        });
    }

    function refreshAllMatchStatus() {
        State.previewData.forEach(item => {
            const all = [...item.extra.matches, ...(item.extra.manualMatches || [])];
            all.forEach(m => { m.status = calcMatchStatus(m); });
        });
    }

    function tryRecalcRow(el) {
        const tr = el.closest('tr');
        if (!tr) return;
        const tidIdx = Number(tr.closest('.tid-block').dataset.index);
        const matchIdx = Number(tr.dataset.idx);
        const item = State.previewData[tidIdx];
        const allMatches = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
        const m = allMatches[matchIdx];
        if (!m) return;

        const statusEl = tr.querySelector('.ipt-status');
        if (!statusEl) return;
        const statusVal = statusEl.value;

        const hs = tr.querySelector('.ipt-hscore');
        const as = tr.querySelector('.ipt-ascore');
        m.homeScore = hs ? hs.value : '';
        m.awayScore = as ? as.value : '';

        const r = autoBuildResult(m);
        if (r && statusVal !== '手动') {
            const ipt = tr.querySelector('.ipt-result');
            if (ipt) ipt.value = r;
            m.result = r;
        }
    }

    function canCommitPreviewUI() {
        const blocks = State.previewPanel.querySelectorAll('.tid-block');
        for (const block of blocks) {
            const rows = block.querySelectorAll('tbody tr');
            for (const tr of rows) {
                const time = tr.querySelector('.ipt-time')?.value.trim();
                if (time && !isValidStartTimeStrict(time)) {
                    return false;
                }
            }
        }
        return true;
    }

    function syncPreviewDataFromUI() {
        if (!State.previewPanel) return;
        const blocks = State.previewPanel.querySelectorAll('.tid-block');
        blocks.forEach(block => {
            const tidIdx = Number(block.dataset.index);
            const item = State.previewData[tidIdx];
            if (!item) return;

            const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            const rows = block.querySelectorAll('tbody tr');

            rows.forEach((tr, idx) => {
                const m = all[idx];
                if (!m) return;
                const v = cls => tr.querySelector(cls)?.value?.trim() || '';

                m.status = v('.ipt-status');
                m.startTime = v('.ipt-time');
                m.progress = v('.ipt-progress');
                m.homeScore = v('.ipt-hscore');
                m.awayScore = v('.ipt-ascore');
                m.result = v('.ipt-result');
                m.scoreUrlStatus = v('.ipt-score-url-status');

                const siteSel = tr.querySelector('.sel-score-site');
                const siteManual = tr.querySelector('.ipt-score-manual');
                if (siteSel) {
                    m.scoreUrl = siteSel.value === '__manual__' ? (siteManual?.value.trim() || '') : siteSel.value;
                }
                m.roundTag = extractFirstBracket(item.title);
            });
        });
    }

    function syncLiveDataToPreview() {
        const trs = State.livePanel.querySelectorAll('tbody tr');
        trs.forEach(tr => {
            const mid = tr.dataset.mid;
            if (!mid) return;
            let target = null;
            for (const item of State.previewData) {
                const all = [...item.extra.matches, ...(item.extra.manualMatches || [])];
                const found = all.find(m => m._mid === mid);
                if (found) { target = found; break; }
            }
            if (!target) return;
            const get = sel => tr.querySelector(sel)?.value.trim() || '';
            target.progress = get('.live-progress');
            target.homeScore = get('.live-hs');
            target.awayScore = get('.live-as');
            target.result = get('.live-result');
            target.status = calcMatchStatus(target);
        });
    }

    function togglePreview(show) {
    State.previewVisible = typeof show === 'boolean' ? show : !State.previewVisible;
    State.previewPanel.style.display = State.previewVisible ? 'flex' : 'none';
    if (State.previewVisible) {
        refreshAllMatchStatus();
        renderPreviewData();
    }
}


    /* ==========================================================================
       9. EVENT HANDLERS (事件处理)
       ========================================================================== */

    function handleMainPanelClick(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const group = btn.closest('.aux-btn-group');
        const key = group ? group.dataset.key : null;
        const textarea = key ? State.panel.querySelector(`#aux_${key}`) : null;

        switch (action) {
            case 'clear':
                if (textarea) textarea.value = '';
                break;
            case 'save':
                if (textarea && key) {
                    State.auxData[key] = textarea.value;
                    saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
                }
                break;
            case 'load':
                if (key === 'title') {
                    (async () => {
                        const title = await buildAutoPostTitle();
                        textarea.value = title;
                        State.auxData.title = title;
                        saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
                    })();
                    break;
                }
                if (key === 'reply') {
                    const matchList = [];
                    State.previewData.forEach(item => {
                        const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
                        all.forEach(m => {
                            if (m.status === '自动' || m.status === '手动') {
                                if (!m.roundTag && item.title) {
                                    m.roundTag = extractFirstBracket(item.title);
                                }
                                matchList.push(m);
                            }
                        });
                    });
                    const text = generateLiveReplyText(matchList);
                    textarea.value = text;
                    State.auxData.reply = text;
                    saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
                    break;
                }
                if (key === 'content') {
                    const content = State.previewData.map(item => buildOddsBBCode(item)).join('\n\n');
                    textarea.value = content;
                    State.auxData.content = content;
                    saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
                    break;
                }
                if (!textarea || !key) break;
                State.auxData = loadData(CONFIG.KEYS.AUX_DATA, {});
                textarea.value = State.auxData[key] || '';
                break;
            case 'copy':
                if (textarea) {
                    textarea.select();
                    document.execCommand('copy');
                }
                break;
            case 'open-preview':
                State.panel.style.display = 'none';
                togglePreview(true);
                break;
            case 'open-live-from-panel':
                State.panel.style.display = 'none';
                if (State.previewPanel) {
                    State.previewPanel.style.display = 'none';
                    State.previewVisible = false;
                }
                State.livePanel.style.display = 'flex';
                State.liveVisible = true;
                renderLiveData();
                break;
        }
    }

    async function handlePreviewClick(e) {
        const btn = e.target.closest('button[data-action], .edit-ctrl-btn');
        if (!btn) return;

        const action = btn.dataset.action || btn.getAttribute('onclick');
        const tidBlock = btn.closest('.tid-block');
        const tidIdx = tidBlock ? parseInt(tidBlock.dataset.index) : -1;
        const tr = btn.closest('tr');
        const trIdx = tr ? parseInt(tr.dataset.idx) : -1;

        switch (action) {
            case 'close-preview':
                State.previewPanel.style.display = 'none';
                State.panel.style.display = 'block';
                break;
            case 'toggle-edit':
                State.isEditMode = !State.isEditMode;
                btn.textContent = State.isEditMode ? '退出编辑' : '编辑盘口';
                btn.style.background = State.isEditMode ? '#ffc107' : '';
                if (!State.isEditMode) {
                    syncPreviewDataFromUI();
                    refreshAllMatchStatus();
                }
                renderPreviewData();
                break;
            case 'refresh-all':
                if (!confirm('将清空列表并重新抓取今日所有开盘帖，确定？')) return;
                State.previewPanel.querySelector('.preview-content').innerHTML = '<div style="padding:20px;text-align:center;">正在抓取中...</div>';
                await rebuildTodayOddsLogic();
                const today = new Date();
                const dateStr = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                State.previewPanel.querySelector('#liveDateInput').value = dateStr;
                saveData(CONFIG.KEYS.LIVE_DATE, dateStr);
                renderPreviewData();
                break;
            case 'add-page':
                await addCurrentPageSmart();
                break;
            case 'reload-ui':
                if (!canCommitPreviewUI()) {
                    renderPreviewData(); // 回滚
                    break;
                }
                syncPreviewDataFromUI();
                refreshAllMatchStatus();
                recalcAllFinishedResults();
                renderPreviewData();
                break;
            case 'save-all':
                if (!canCommitPreviewUI()) return;
                syncPreviewDataFromUI();
                refreshAllMatchStatus();
                recalcAllFinishedResults();
                saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
                saveData(CONFIG.KEYS.LIVE_DATE, State.previewPanel.querySelector('#liveDateInput').value);
                alert('数据已保存');
                break;
            case 'toggle-score-mgr':
                State.scoreManagerVisible = !State.scoreManagerVisible;
                State.previewPanel.querySelector('#scoreManager').style.display = State.scoreManagerVisible ? 'block' : 'none';
                if (State.scoreManagerVisible) renderScoreSiteList();
                break;
            case 'close-score-mgr':
                State.previewPanel.querySelector('#scoreManager').style.display = 'none';
                State.scoreManagerVisible = false;
                break;
            case 'add-score-site':
                const name = State.previewPanel.querySelector('#newScoreName').value.trim();
                const url = State.previewPanel.querySelector('#newScoreUrl').value.trim();
                if (name && url) {
                    State.scoreSiteList.push({ name, url });
                    saveData(CONFIG.KEYS.SCORE_SITES, State.scoreSiteList);
                    renderScoreSiteList();
                    State.previewPanel.querySelector('#newScoreName').value = '';
                    State.previewPanel.querySelector('#newScoreUrl').value = '';
                    renderPreviewData();
                }
                break;
            // List Operations
            case 'tid-refresh':
                if (!confirm('确认重新获取？(将清空当前TID所有盘口)')) return;
                syncPreviewDataFromUI();
                await refreshSingleTid(State.previewData[tidIdx].tid);
                renderPreviewData();
                break;
            case 'tid-up':
                syncPreviewDataFromUI();
                if (tidIdx > 0) {
                    [State.previewData[tidIdx], State.previewData[tidIdx - 1]] = [State.previewData[tidIdx - 1], State.previewData[tidIdx]];
                    saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
                    renderPreviewData();
                }
                break;
            case 'tid-down':
                syncPreviewDataFromUI();
                if (tidIdx < State.previewData.length - 1) {
                    [State.previewData[tidIdx], State.previewData[tidIdx + 1]] = [State.previewData[tidIdx + 1], State.previewData[tidIdx]];
                    saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
                    renderPreviewData();
                }
                break;
            case 'tid-del':
                if (!confirm('确认删除该 TID 及其所有盘口吗？')) return;
                syncPreviewDataFromUI();
                State.previewData.splice(tidIdx, 1);
                saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
                renderPreviewData();
                break;
            case 'match-add':
                syncPreviewDataFromUI();
                State.previewData[tidIdx].extra.manualMatches = State.previewData[tidIdx].extra.manualMatches || [];
                State.previewData[tidIdx].extra.manualMatches.push({
                    _mid: generateUUID(),
                    _isManual: true,
                    startTime: getNextDayMidnightStr(),
                    league: '', home: '', away: ''
                });
                saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
                renderPreviewData();
                break;
            case 'match-del':
                if (!confirm('确认删除此盘口？')) return;
                syncPreviewDataFromUI();
                const item = State.previewData[tidIdx];
                const autoLen = item.extra.matches.length;
                if (trIdx < autoLen) item.extra.matches.splice(trIdx, 1);
                else item.extra.manualMatches.splice(trIdx - autoLen, 1);
                saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
                renderPreviewData();
                break;
            case 'score-site-del':
                if (!confirm('确认删除？')) return;
                const siteIdx = parseInt(btn.dataset.idx);
                State.scoreSiteList.splice(siteIdx, 1);
                saveData(CONFIG.KEYS.SCORE_SITES, State.scoreSiteList);
                renderScoreSiteList();
                renderPreviewData();
                break;
            case 'open-live':
                State.previewPanel.style.display = 'none';
                State.previewVisible = false;
                State.livePanel.style.display = 'flex';
                State.liveVisible = true;
                renderLiveData();
                break;
        }
    }

    function handleLiveClick(e) {
        const action = e.target.dataset.action;
        if (action === 'live-close') {
            State.livePanel.style.display = 'none';
            State.liveVisible = false;
            State.panel.style.display = 'block';
        }
        if (action === 'live-reload') {
            renderLiveData();
        }
        if (action === 'live-save') {
            syncLiveDataToPreview();
            refreshAllMatchStatus();
            recalcAllFinishedResults();
            saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            alert('已保存');
            return;
        }
        if (action === 'live-open-preview') {
            State.livePanel.style.display = 'none';
            State.liveVisible = false;
            State.previewPanel.style.display = 'flex';
            State.previewVisible = true;
            renderPreviewData();
            return;
        }
    }

    function handlePreviewChange(e) {
        const el = e.target;
        if (!el.classList.contains('ipt-status')) return;
        const tr = el.closest('tr');
        if (!tr) return;

        el.className = 'ipt-status';
        if (el.value === '自动') el.classList.add('status-live');
        if (el.value === '未开赛') el.classList.add('status-wait');

        const resultIpt = tr.querySelector('.ipt-result');
        if (el.value === '走盘' && resultIpt) resultIpt.value = '走盘';
        if (el.value !== '走盘') tryRecalcRow(el);
    }

    function handlePreviewInput(e) {
        const el = e.target;
        const tr = el.closest('tr');
        if (!tr) return;
        const tidIdx = Number(tr.closest('.tid-block').dataset.index);
        const matchIdx = Number(tr.dataset.idx);
        const item = State.previewData[tidIdx];
        if (!item) return;
        const allMatches = [...item.extra.matches, ...(item.extra.manualMatches || [])];
        const m = allMatches[matchIdx];
        if (!m) return;

        // 【已删除】此处原有的 ipt-time 实时修正逻辑已移除，移至 blur 事件处理

        if (el.classList.contains('ipt-progress')) m._manualProgress = true;
        if (el.classList.contains('ipt-hscore') || el.classList.contains('ipt-ascore')) m._manualScore = true;
        if (el.classList.contains('ipt-result')) m._manualResult = true;

        if (!['已完结', '走盘'].includes(m.status)) {
            m.status = calcMatchStatus(m);
        }

        // 输入比分时，实时计算赛果（不改状态）
        if (el.classList.contains('ipt-hscore') || el.classList.contains('ipt-ascore')) {
            const r = autoBuildResult(m);
            if (r && m.result !== r) {
                m.result = r;
                const resultInput = tr.querySelector('.ipt-result');
                if (resultInput) resultInput.value = r;
            }
        }
    }

function handlePreviewBlur(e) {
        const ipt = e.target;

        // --- 新增：时间输入框失去焦点时修正格式 ---
        if (ipt.classList.contains('ipt-time')) {
            const fixed = normalizeStartTime(ipt.value);
            // 只有当格式确实变化了才更新 UI 和数据，避免不必要的闪烁
            if (fixed !== ipt.value) {
                ipt.value = fixed;
                // 同步数据
                const tr = ipt.closest('tr');
                if (tr) {
                    const tidBlock = tr.closest('.tid-block');
                    const tidIdx = Number(tidBlock.dataset.index);
                    const matchIdx = Number(tr.dataset.idx);
                    const item = State.previewData[tidIdx];
                    if (item) {
                        const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
                        if (all[matchIdx]) {
                            all[matchIdx].startTime = fixed;
                            // 时间变了，可能影响“未开赛/自动”状态，重新计算一下
                            all[matchIdx].status = calcMatchStatus(all[matchIdx]);
                            updatePreviewRowUI(tr, all[matchIdx]);
                        }
                    }
                }
            }
            return; // 处理完时间直接返回
        }
        // ---------------------------------------

        if (!ipt.classList.contains('ipt-hscore') && !ipt.classList.contains('ipt-ascore') && !ipt.classList.contains('ipt-progress')) return;

        const tr = ipt.closest('tr');
        if (!tr) return;

        const tidBlock = tr.closest('.tid-block');
        if (!tidBlock) return;
        const tidIdx = Number(tidBlock.dataset.index);
        const matchIdx = Number(tr.dataset.idx);
        const item = State.previewData[tidIdx];
        if (!item) return;
        const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
        const m = all[matchIdx];
        if (!m) return;

        m.homeScore = tr.querySelector('.ipt-hscore')?.value.trim() || '';
        m.awayScore = tr.querySelector('.ipt-ascore')?.value.trim() || '';
        m.progress = tr.querySelector('.ipt-progress')?.value.trim() || '';

        const r = autoBuildResult(m);
        if (r) m.result = r;
        updatePreviewRowUI(tr, m);
    }

    function handleLiveInput(e) {
        if (!e || !e.target) return;
        const el = e.target;
        const tr = el.closest('tr');
        if (!tr) return;
        const mid = tr.dataset.mid;
        if (!mid) return;

        let target = null;
        for (const item of State.previewData) {
            const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            const found = all.find(m => m._mid === mid);
            if (found) { target = found; break; }
        }
        if (!target) return;

        const get = sel => {
            const v = tr.querySelector(sel);
            return v ? (v.value ?? '').trim() : '';
        };

        target.progress = get('.live-progress');
        target.homeScore = get('.live-hs');
        target.awayScore = get('.live-as');
        target.result = get('.live-result');

        target._manualProgress = true;
        target._manualScore = true;
        target._manualResult = true;

        if (el.classList.contains('live-progress')) {
            target._manualProgress = true;
            target.status = calcMatchStatus(target);
        }
        try { recalcAllFinishedResults(); } catch (err) { }
        saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
    }

    function handleLiveBlur(e) {
        const ipt = e.target;
        if (!ipt.matches('.live-hs, .live-as')) return;
        const tr = ipt.closest('tr');
        if (!tr) return;
        const mid = tr.dataset.mid;
        if (!mid) return;

        let m = null;
        State.previewData.some(item => {
            const all = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            m = all.find(x => x._mid === mid);
            return !!m;
        });
        if (!m) return;

        const get = (cls) => tr.querySelector(cls)?.value?.trim() || '';
        m.progress = get('.live-progress');
        m.homeScore = get('.live-hs');
        m.awayScore = get('.live-as');

        const r = autoBuildResult(m);
        if (r) m.result = r;

        const statusTd = tr.querySelector('td:first-child');
        if (statusTd) statusTd.textContent = m.status;
        const resIpt = tr.querySelector('.live-result');
        if (resIpt) resIpt.value = m.result || '';
    }

    /* ==========================================================================
       10. BOOTSTRAP
       ========================================================================== */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})();