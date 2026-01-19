// ==UserScript==
// @name         C6 直播辅助 (Refactored)
// @namespace    ui-preview-enhanced
// @version      1.1.0
// @match        *://*/*
// @description  不懂
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license     LGPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563069/C6%20%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9%20%28Refactored%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563069/C6%20%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9%20%28Refactored%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ================= 1. 配置与状态 (Config & State) ================= */
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
        }
    };

    // 全局状态
    let state = {
        panel: null,
        previewPanel: null,
        previewVisible: false,
        scoreManagerVisible: false,
        isEditMode: false,
        previewData: loadData(CONFIG.KEYS.PREVIEW_DATA, []),
        scoreSiteList: loadData(CONFIG.KEYS.SCORE_SITES, [
            { name: '足球(007)', url: 'https://live.titan007.com/oldIndexall.aspx' },
            { name: '篮球(007)', url: 'https://lq3.titan007.com/nba.htm' }
        ]),
        auxData: loadData(CONFIG.KEYS.AUX_DATA, { title: '', content: '', reply: '' }),
        auxConfig: loadData(CONFIG.KEYS.AUX_CONFIG, { refreshSec: 120, autoSec: 120 })
    };

    /* ================= 2. 工具函数 (Utils) ================= */
    function loadData(key, def) {
        try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; }
    }
    function saveData(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function parseTimeStr(str) {
        if (!str) return null;
        str = str.trim();
        const now = new Date();
        if (/^\d{1,2}:\d{1,2}$/.test(str)) {
            const parts = str.split(':');
            const d = new Date();
            d.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
            return d;
        }
        if (/^\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}$/.test(str)) {
            return new Date(`${now.getFullYear()}-${str}`);
        }
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    }

    function fetchRawHTML(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url, responseType: 'arraybuffer',
                onload: res => {
                    try {
                        const buffer = res.response;
                        let html = new TextDecoder('utf-8').decode(buffer);
                        // 智能判断编码
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

    /* ================= 3. 核心解析逻辑 (Parser & Logic) ================= */
    function parseDeadline(str) {
        if (!str) return null;
        const m = str.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
        if (m) {
            return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5])).getTime();
        }
        return null;
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

    function extractMatchTableFromHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const contentDiv = doc.querySelector('#conttpc');
        if (!contentDiv) return [];

        const rows = Array.from(contentDiv.querySelectorAll('table tr')).filter(tr => !tr.querySelector('td[colspan]'));
        if (rows.length === 0) return [];

        const headerTds = rows[0].querySelectorAll('td');
        const idx = { lm: -1, time: -1, ta: -1, pk: -1, tb: -1 };
        headerTds.forEach((td, i) => {
            const text = td.textContent.trim();
            if (CONFIG.REGEX.LM.test(text)) idx.lm = i;
            else if (CONFIG.REGEX.TIME.test(text)) idx.time = i;
            else if (CONFIG.REGEX.HOME.test(text)) idx.ta = i;
            else if (CONFIG.REGEX.HANDICAP.test(text)) idx.pk = i;
            else if (CONFIG.REGEX.AWAY.test(text)) idx.tb = i;
        });

        if (idx.ta === -1 || idx.tb === -1) return [];

        const parseTeamCell = (rawText) => {
            const m = rawText.match(/^\[([\d\.]+)\](.*)$/);
            return m ? { odd: m[1], name: m[2].trim() } : { odd: '', name: rawText };
        };

        const result = [];
        for (let i = 1; i < rows.length; i++) {
            const tds = rows[i].querySelectorAll('td');
            if (tds.length < 3) continue;

            const league = idx.lm > -1 && tds[idx.lm] ? tds[idx.lm].textContent.trim() : '';
            const rawTime = idx.time > -1 && tds[idx.time] ? tds[idx.time].textContent.trim() : '';
            const homeRaw = idx.ta > -1 && tds[idx.ta] ? tds[idx.ta].textContent.trim() : '';
            const handicap = idx.pk > -1 && tds[idx.pk] ? tds[idx.pk].textContent.trim() : '';
            const awayRaw = idx.tb > -1 && tds[idx.tb] ? tds[idx.tb].textContent.trim() : '';

            if (!homeRaw && !league) continue;
            const homeObj = parseTeamCell(homeRaw);
            const awayObj = parseTeamCell(awayRaw);

            result.push({
                league: league,
                home: homeObj.name, homeOdd: homeObj.odd,
                handicap: handicap,
                away: awayObj.name, awayOdd: awayObj.odd,
                startTime: rawTime,
                status: '未开播',
                _isManual: false
            });
        }
        return result;
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

    /* ===== 计算赛果逻辑 ===== */
    function autoBuildResult(m) {
        if (!m || m.status !== '已完结') return '';
        if (m.homeScore === '' || m.awayScore === '' || m.homeScore == null || m.awayScore == null) return '';

        const hs = Number(m.homeScore);
        const as = Number(m.awayScore);
        if (isNaN(hs) || isNaN(as)) return '';

        const leagueText = m.league || '';
        const pk = String(m.handicap || '').trim();

        // 1. 大小球
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

            if (bigWin === 0 && smallWin === 0) return ''; // 走水
            if (bigWin > smallWin) {
                const half = bigWin < parts.length;
                return `${bigOdds}${bigTeam}${half ? '（赢半）' : ''}`;
            }
            if (smallWin > bigWin) {
                const half = smallWin < parts.length;
                return `${smallOdds}${smallTeam}${half ? '（赢半）' : ''}`;
            }
            return '';
        }

        // 2. 让球盘
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

        if (homeWin === 0 && awayWin === 0) return '';
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

    /* ================= 4. 业务功能 (Actions) ================= */

    async function rebuildTodayOddsLogic() {
        state.previewData.length = 0;
        saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);

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
                const matches = extractMatchTableFromHTML(readHtml);
                state.previewData.push({
                    tid: item.tid,
                    title: meta.title || item.title,
                    author: meta.author,
                    deadline: meta.deadline || item.deadline,
                    extra: { matches, manualMatches: [] }
                });
            } catch (e) { console.error(`TID ${item.tid} 抓取失败`, e); }
            await new Promise(r => setTimeout(r, CONFIG.DELAY));
        }
        sortPreviewDataByDeadline();
        saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
    }

    async function addCurrentPageSmart() {
        let tid = null;
        const m = window.location.href.match(/tid=(\d+)/) || window.location.href.match(/\/(\d+)\.html/);
        tid = m ? m[1] : prompt("无法获取当前TID，请输入：", "");
        if (!tid) return;

        if (state.previewData.find(d => String(d.tid) === String(tid))) {
            alert('该 TID 已存在列表中！');
            return;
        }

        try {
            const html = await fetchRawHTML(`/read.php?tid=${tid}&toread=1`);
            const meta = parseReadPageMeta(html);
            const matches = extractMatchTableFromHTML(html);
            state.previewData.push({
                tid: String(tid),
                title: meta.title || `TID ${tid}`,
                author: meta.author || '未知',
                deadline: meta.deadline,
                extra: { matches, manualMatches: [] }
            });
            sortPreviewDataByDeadline();
            saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
            renderPreviewData();
        } catch (e) {
            alert('抓取失败，请检查网络或页面结构');
        }
    }

    async function refreshSingleTid(tid) {
        const item = state.previewData.find(x => String(x.tid) === String(tid));
        if (!item) return;
        try {
            const html = await fetchRawHTML(`/read.php?tid=${tid}&toread=1`);
            const meta = parseReadPageMeta(html);
            if (meta.author) item.author = meta.author;
            item.extra.matches = extractMatchTableFromHTML(html);
            item.extra.manualMatches = [];
            saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
        } catch (e) { alert(`TID ${tid} 刷新失败`); }
    }

    function sortPreviewDataByDeadline() {
        state.previewData.sort((a, b) => {
            const ta = a.deadline || 0;
            const tb = b.deadline || 0;
            if (!ta && !tb) return b.tid - a.tid;
            if (!ta) return 1;
            if (!tb) return -1;
            return ta - tb;
        });
    }

    function recalcAllFinishedResults() {
        state.previewData.forEach(item => {
            if (!item?.extra) return;
            const allMatches = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
            allMatches.forEach(m => {
                if (m.status !== '已完结') return;
                const r = autoBuildResult(m);
                if (r) m.result = r;
            });
        });
    }

    /* ================= 5. BBCode 生成 (Export) ================= */
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

    /* ================= 6. UI 构建与渲染 ================= */

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

        createFloatButton();
        createMainPanel();
        createPreviewUI(); // 提前创建但不显示
    }

    function createFloatButton() {
        const btn = document.createElement('button');
        btn.textContent = '直播辅助';
        Object.assign(btn.style, {
            position: 'fixed', right: '20px', bottom: '60px', zIndex: 999999,
            padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'
        });
        btn.onclick = () => { state.panel.style.display = state.panel.style.display === 'none' ? 'block' : 'none'; };
        document.body.appendChild(btn);
    }

function createMainPanel() {
    state.panel = document.createElement('div');
    Object.assign(state.panel.style, {
        position: 'fixed',
        right: '20px',
        top: '20px',
        width: '380px',
        background: '#f9f9f9',
        border: '1px solid #999',
        fontSize: '13px',
        zIndex: 999998,
        display: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
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
            <textarea id="aux_${key}" style="width:100%;height:50px;resize:vertical;">${state.auxData[key] || ''}</textarea>
        </div>
    `;

    state.panel.innerHTML = `
        <div style="padding:8px;font-weight:bold;background:#ddd;border-bottom:1px solid #aaa;">
            直播辅助控制台
        </div>

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
            <div>
                每 <input id="refreshSec" type="number"
                    value="${state.auxConfig.refreshSec}"
                    style="width:70px;text-align:center;"> 秒自动刷新
            </div>
            <button disabled style="padding:2px 10px;">停止</button>
            <button disabled style="padding:2px 10px;">运行</button>

            <div style="width:100%;height:1px;"></div>

            <div>
                每 <input id="autoSec" type="number"
                    value="${state.auxConfig.autoSec}"
                    style="width:70px;text-align:center;"> 秒自动回复
            </div>
            <button disabled style="padding:2px 10px;">停止</button>
            <button disabled style="padding:2px 10px;">运行</button>
        </div>

        <div style="padding:8px;text-align:center;">
            <button
                data-action="open-preview"
                style="width:100%;padding:8px;background:#17a2b8;color:white;border:none;cursor:pointer;">
                打开盘口助手
            </button>
        </div>
    `;

    // ⭐ 统一事件委托（你现有逻辑）
    state.panel.addEventListener('click', handleMainPanelClick);

    document.body.appendChild(state.panel);
}


    function createPreviewUI() {
        state.previewPanel = document.createElement('div');
        state.previewPanel.className = 'preview-panel';
        Object.assign(state.previewPanel.style, {
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
                </div>
                <div style="margin-left:auto;">
                    <button class="preview-header-btn" style="background:#dc3545;color:white;" data-action="close-preview">关闭</button>
                </div>
            </div>
        `;
        state.previewPanel.appendChild(header);

        const content = document.createElement('div');
        content.className = 'preview-content';
        content.style.cssText = `flex:1; overflow-y:auto; padding:10px;`;
        state.previewPanel.appendChild(content);

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
            </div>
        `;
        state.previewPanel.appendChild(scoreMgr);

        // 绑定事件委托
        state.previewPanel.addEventListener('click', handlePreviewClick);
        state.previewPanel.addEventListener('change', handlePreviewChange);
        state.previewPanel.addEventListener('input', handlePreviewInput);

        document.body.appendChild(state.previewPanel);
    }

    /* ================= 7. 事件处理 (Event Handlers) ================= */

    function handleMainPanelClick(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const group = btn.closest('.aux-btn-group');
        const key = group ? group.dataset.key : null;
        const textarea = key ? state.panel.querySelector(`#aux_${key}`) : null;

        switch (action) {
            case 'clear':
                if (textarea) textarea.value = '';
                break;
            case 'save':
                if (textarea) {
                    state.auxData[key] = textarea.value;
                    saveData(CONFIG.KEYS.AUX_DATA, state.auxData);
                }
                break;
            case 'load':
                if (key === 'content') {
                    const content = state.previewData.map(item => buildOddsBBCode(item)).join('\n\n');
                    textarea.value = content;
                    state.auxData.content = content;
                    saveData(CONFIG.KEYS.AUX_DATA, state.auxData);
                } else {
                    state.auxData = loadData(CONFIG.KEYS.AUX_DATA, {});
                    textarea.value = state.auxData[key] || '';
                }
                break;
            case 'copy':
                if (textarea) { textarea.select(); document.execCommand('copy'); }
                break;
            case 'open-preview':
                state.panel.style.display = 'none';
                togglePreview(true);
                break;
        }
    }

    async function handlePreviewClick(e) {
        const btn = e.target.closest('button[data-action], .edit-ctrl-btn');
        if (!btn) return;

        // 按钮可能在 DOM 变动后失效，所以要重新获取必要的上下文
        const action = btn.dataset.action || btn.getAttribute('onclick'); // 兼容旧逻辑的fallback，不过这里主要用 action
        // 获取上下文索引
        const tidBlock = btn.closest('.tid-block');
        const tidIdx = tidBlock ? parseInt(tidBlock.dataset.index) : -1;
        const tr = btn.closest('tr');
        const trIdx = tr ? parseInt(tr.dataset.idx) : -1;

        // 处理自定义按钮类 (edit-ctrl-btn) 放在 dataset.action 处理有点复杂，这里简单处理
        // 下面主要处理 header 按钮
        switch (action) {
            case 'close-preview':
                state.previewPanel.style.display = 'none';
                state.panel.style.display = 'block';
                break;
            case 'toggle-edit':
                state.isEditMode = !state.isEditMode;
                btn.textContent = state.isEditMode ? '退出编辑' : '编辑盘口';
                btn.style.background = state.isEditMode ? '#ffc107' : '';
                syncPreviewDataFromUI();
                renderPreviewData();
                break;
            case 'refresh-all':
                if (!confirm('将清空列表并重新抓取今日所有开盘帖，确定？')) return;
                state.previewPanel.querySelector('.preview-content').innerHTML = '<div style="padding:20px;text-align:center;">正在抓取中...</div>';
                await rebuildTodayOddsLogic();
                const today = new Date();
                const dateStr = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                state.previewPanel.querySelector('#liveDateInput').value = dateStr;
                saveData(CONFIG.KEYS.LIVE_DATE, dateStr);
                renderPreviewData();
                break;
            case 'add-page':
                await addCurrentPageSmart();
                break;
            case 'reload-ui':
                syncPreviewDataFromUI();
                recalcAllFinishedResults();
                renderPreviewData();
                break;
            case 'save-all':
                syncPreviewDataFromUI();
                recalcAllFinishedResults();
                saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
                saveData(CONFIG.KEYS.LIVE_DATE, state.previewPanel.querySelector('#liveDateInput').value);
                alert('数据已保存');
                break;
            case 'toggle-score-mgr':
                state.scoreManagerVisible = !state.scoreManagerVisible;
                state.previewPanel.querySelector('#scoreManager').style.display = state.scoreManagerVisible ? 'block' : 'none';
                if (state.scoreManagerVisible) renderScoreSiteList();
                break;
            case 'close-score-mgr':
                state.previewPanel.querySelector('#scoreManager').style.display = 'none';
                state.scoreManagerVisible = false;
                break;
            case 'add-score-site':
                const name = state.previewPanel.querySelector('#newScoreName').value.trim();
                const url = state.previewPanel.querySelector('#newScoreUrl').value.trim();
                if (name && url) {
                    state.scoreSiteList.push({ name, url });
                    saveData(CONFIG.KEYS.SCORE_SITES, state.scoreSiteList);
                    renderScoreSiteList();
                    state.previewPanel.querySelector('#newScoreName').value = '';
                    state.previewPanel.querySelector('#newScoreUrl').value = '';
                    renderPreviewData();
                }
                break;
            // 列表操作
            case 'tid-refresh':
                if (!confirm('确认重新获取？(将清空当前TID所有盘口)')) return;
                syncPreviewDataFromUI();
                await refreshSingleTid(state.previewData[tidIdx].tid);
                renderPreviewData();
                break;
            case 'tid-up':
                syncPreviewDataFromUI();
                if (tidIdx > 0) {
                    [state.previewData[tidIdx], state.previewData[tidIdx - 1]] = [state.previewData[tidIdx - 1], state.previewData[tidIdx]];
                    saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
                    renderPreviewData();
                }
                break;
            case 'tid-down':
                syncPreviewDataFromUI();
                if (tidIdx < state.previewData.length - 1) {
                    [state.previewData[tidIdx], state.previewData[tidIdx + 1]] = [state.previewData[tidIdx + 1], state.previewData[tidIdx]];
                    saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
                    renderPreviewData();
                }
                break;
            case 'tid-del':
                if (!confirm('确认删除该 TID 及其所有盘口吗？')) return;
                syncPreviewDataFromUI();
                state.previewData.splice(tidIdx, 1);
                saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
                renderPreviewData();
                break;
            case 'match-add':
                syncPreviewDataFromUI();
                state.previewData[tidIdx].extra.manualMatches = state.previewData[tidIdx].extra.manualMatches || [];
                state.previewData[tidIdx].extra.manualMatches.push({ _isManual: true, startTime: '', league: '', home: '', away: '' });
                saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
                renderPreviewData();
                break;
            case 'match-del':
                if (!confirm('确认删除此盘口？')) return;
                syncPreviewDataFromUI();
                const item = state.previewData[tidIdx];
                const autoLen = item.extra.matches.length;
                if (trIdx < autoLen) item.extra.matches.splice(trIdx, 1);
                else item.extra.manualMatches.splice(trIdx - autoLen, 1);
                saveData(CONFIG.KEYS.PREVIEW_DATA, state.previewData);
                renderPreviewData();
                break;
            case 'score-site-del':
                if (!confirm('确认删除？')) return;
                const siteIdx = parseInt(btn.dataset.idx);
                state.scoreSiteList.splice(siteIdx, 1);
                saveData(CONFIG.KEYS.SCORE_SITES, state.scoreSiteList);
                renderScoreSiteList();
                renderPreviewData();
                break;
        }
    }

    function handlePreviewChange(e) {
        const el = e.target;
        // 状态下拉框颜色改变
        if (el.classList.contains('ipt-status')) {
            el.className = 'ipt-status';
            if (el.value === '进行中') el.classList.add('status-live');
            if (el.value === '未开播') el.classList.add('status-wait');
            tryRecalcRow(el); // 状态变更可能触发结算逻辑
        }
        // 比分地址联动
        if (el.classList.contains('sel-score-site')) {
            const input = el.nextElementSibling;
            if (input) input.style.display = el.value === '__manual__' ? 'block' : 'none';
        }
    }

    function handlePreviewInput(e) {
        const el = e.target;
        // 核心数据变动 -> 自动切手动
        if (el.matches('.ipt-time, .ipt-league, .ipt-home, .ipt-handicap, .ipt-away, .ipt-progress, .ipt-hscore, .ipt-ascore, .ipt-result')) {
            const tr = el.closest('tr');
            if (tr) {
                const statusSel = tr.querySelector('.ipt-status');
                if (statusSel && statusSel.value !== '手动') {
                    statusSel.value = '手动';
                    statusSel.className = 'ipt-status';
                }
            }
        }
        // 比分变动 -> 自动计算赛果
        if (el.matches('.ipt-hscore, .ipt-ascore')) {
            tryRecalcRow(el);
        }
    }

    // 尝试重算单行赛果
    function tryRecalcRow(el) {
        const tr = el.closest('tr');
        if (!tr) return;
        const tidIdx = Number(tr.closest('.tid-block').dataset.index);
        const matchIdx = Number(tr.dataset.idx);

        // 临时同步当前行数据到内存对象，以便 autoBuildResult 使用
        const item = state.previewData[tidIdx];
        const allMatches = [...(item.extra.matches || []), ...(item.extra.manualMatches || [])];
        const m = allMatches[matchIdx];
        if (!m) return;

        // 从 DOM 读取最新值
        const statusVal = tr.querySelector('.ipt-status').value;
        if (statusVal !== '已完结' && statusVal !== '手动') return;

        m.homeScore = tr.querySelector('.ipt-hscore').value;
        m.awayScore = tr.querySelector('.ipt-ascore').value;

        const r = autoBuildResult(m);
        if (r && statusVal !== '手动') {
            const ipt = tr.querySelector('.ipt-result');
            if (ipt) ipt.value = r;
            m.result = r;
        }
    }

    /* ================= 8. 渲染逻辑 (Renderers) ================= */

    function togglePreview(show) {
        state.previewVisible = typeof show === 'boolean' ? show : !state.previewVisible;
        state.previewPanel.style.display = state.previewVisible ? 'flex' : 'none';
        if (state.previewVisible) renderPreviewData();
    }

    function renderScoreSiteList() {
        const div = state.previewPanel.querySelector('#scoreSiteListDiv');
        div.innerHTML = state.scoreSiteList.map((s, i) => `
            <div style="padding:4px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
                <span>${s.name}</span>
                <button data-action="score-site-del" data-idx="${i}" style="color:red;font-size:10px;">删</button>
            </div>
        `).join('');
    }

    function renderPreviewData() {
        const container = state.previewPanel.querySelector('.preview-content');
        container.innerHTML = '';
        if (!state.previewData.length) {
            container.innerHTML = '<div style="color:#999;text-align:center;margin-top:50px;">暂无数据，请点击“添加本页”或“重新获取盘口”</div>';
            return;
        }

        state.previewData.forEach((item, index) => {
            const block = document.createElement('div');
            block.className = 'tid-block';
            block.style.cssText = `border:1px solid #ccc; margin-bottom:15px; background:#fff; position:relative;`;
            block.dataset.tid = item.tid;
            block.dataset.index = index;

            const headerHtml = `
                <div style="background:#f8f9fa; padding:8px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
                    <a href="/read.php?tid=${item.tid}" target="_blank" style="font-weight:bold;text-decoration:none;color:#333;">${escapeHtml(buildTidTitle(item))}</a>
                    ${state.isEditMode ? `<div>
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
                                <th class="col-score-url">比分地址</th>
                                ${state.isEditMode ? `<th class="col-op">操作</th>` : ''}
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                    ${state.isEditMode ? `<button style="margin-top:5px;font-size:12px;" data-action="match-add">+ 添加一行</button>` : ''}
                </div>`;
            container.appendChild(block);
        });
    }

    function createMatchRowHTML(m, tidIdx, matchIdx) {
        let displayStatus = m.status || '未开播';
        const startTime = parseTimeStr(m.startTime);
        if (startTime) {
            const now = new Date();
            if (now >= startTime && displayStatus === '未开播') displayStatus = '进行中';
        }
        const statusClass = displayStatus === '进行中' ? 'status-live' : (displayStatus === '未开播' ? 'status-wait' : '');

        const homeVal = m.homeOdd ? `[${m.homeOdd}] ${m.home}` : m.home;
        const awayVal = m.awayOdd ? `[${m.awayOdd}] ${m.away}` : m.away;
        const isManual = m._isManual ? '1' : '0';

        let siteOpts = `<option value="">选择地址</option>`;
        state.scoreSiteList.forEach(s => {
            const selected = s.url === m.scoreUrl ? 'selected' : '';
            siteOpts += `<option value="${s.url}" ${selected}>${s.name}</option>`;
        });
        const isCustomSite = m.scoreUrl && !state.scoreSiteList.some(x => x.url === m.scoreUrl);
        siteOpts += `<option value="__manual__" ${isCustomSite ? 'selected' : ''}>手动输入</option>`;

        return `
            <tr data-idx="${matchIdx}" data-manual="${isManual}">
                <td>
                    <select class="ipt-status ${statusClass}">
                        <option value="手动" ${displayStatus === '手动' ? 'selected' : ''}>手动</option>
                        <option value="未开播" ${displayStatus === '未开播' ? 'selected' : ''}>未开播</option>
                        <option value="进行中" ${displayStatus === '进行中' ? 'selected' : ''}>进行中</option>
                        <option value="已完结" ${displayStatus === '已完结' ? 'selected' : ''}>已完结</option>
                        <option value="推迟" ${displayStatus === '推迟' ? 'selected' : ''}>推迟</option>
                    </select>
                </td>
                <td><input class="ipt-time" value="${m.startTime || ''}" placeholder="MM-DD HH:MM"></td>
                <td><input class="ipt-league" value="${m.league || ''}"></td>
                <td><input class="ipt-home" value="${homeVal || ''}"></td>
                <td><input class="ipt-handicap" value="${m.handicap || ''}"></td>
                <td><input class="ipt-away" value="${awayVal || ''}"></td>
                <td><input class="ipt-progress" value="${m.progress || ''}" placeholder="如 15'"></td>
                <td><input class="ipt-hscore" value="${m.homeScore || ''}"></td>
                <td><input class="ipt-ascore" value="${m.awayScore || ''}"></td>
                <td><input class="ipt-result" value="${m.result || ''}"></td>
                <td class="col-score-url">
                    <select class="sel-score-site">${siteOpts}</select>
                    <input class="ipt-score-manual" value="${m.scoreUrl || ''}" style="display:${isCustomSite ? 'block' : 'none'}" placeholder="http://...">
                </td>
                ${state.isEditMode ? `<td><button data-action="match-del" style="color:red;">删</button></td>` : ''}
            </tr>`;
    }

    function syncPreviewDataFromUI() {
        if (!state.previewPanel) return;
        const blocks = state.previewPanel.querySelectorAll('.tid-block');
        blocks.forEach(block => {
            const tidIdx = parseInt(block.dataset.index);
            const item = state.previewData[tidIdx];
            if (!item) return;

            const rows = block.querySelectorAll('tbody tr');
            const newMatches = [];
            const newManualMatches = [];

            rows.forEach(tr => {
                const safeVal = (cls) => { const el = tr.querySelector(cls); return el ? el.value.trim() : ''; };
                const parseTeam = (val) => {
                    const m = val.match(/^\s*\[([\d.]+)\]\s*(.*)$/);
                    return m ? { odd: m[1], team: m[2] } : { odd: '', team: val };
                };

                const homeObj = parseTeam(safeVal('.ipt-home'));
                const awayObj = parseTeam(safeVal('.ipt-away'));
                const siteSel = tr.querySelector('.sel-score-site');
                const siteManual = tr.querySelector('.ipt-score-manual');
                const scoreUrl = siteSel.value === '__manual__' ? (siteManual ? siteManual.value.trim() : '') : siteSel.value;

                const matchObj = {
                    status: safeVal('.ipt-status') || '未开播',
                    startTime: safeVal('.ipt-time'),
                    league: safeVal('.ipt-league'),
                    home: homeObj.team, homeOdd: homeObj.odd,
                    handicap: safeVal('.ipt-handicap'),
                    away: awayObj.team, awayOdd: awayObj.odd,
                    progress: safeVal('.ipt-progress'),
                    homeScore: safeVal('.ipt-hscore'),
                    awayScore: safeVal('.ipt-ascore'),
                    result: safeVal('.ipt-result'),
                    scoreUrl,
                    _isManual: tr.dataset.manual === '1'
                };
                if (matchObj._isManual) newManualMatches.push(matchObj);
                else newMatches.push(matchObj);
            });
            item.extra.matches = newMatches;
            item.extra.manualMatches = newManualMatches;
        });
    }

    /* ================= 9. 启动 (Bootstrap) ================= */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})();