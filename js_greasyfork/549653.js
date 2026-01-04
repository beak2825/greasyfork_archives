// ==UserScript==
// @name        国服英雄榜速查工具
// @namespace   https://greasyfork.org/zh-CN/users/1502715
// @version     2.11.0
// @license     MIT
// @description 在魔兽世界国服英雄榜页面快速展示特定角色的英雄榜数据。目前支持史诗团本首领（击杀次数/最后击杀时间/首次击杀时间）和坚韧钥石（成就完成时间）
// @author      电视卫士
// @match       https://wow.blizzard.cn/character/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     webapi.blizzard.cn
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/549653/%E5%9B%BD%E6%9C%8D%E8%8B%B1%E9%9B%84%E6%A6%9C%E9%80%9F%E6%9F%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549653/%E5%9B%BD%E6%9C%8D%E8%8B%B1%E9%9B%84%E6%A6%9C%E9%80%9F%E6%9F%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果当前页面是角色选择页面、404页面或搜索页面，直接退出
    if (
        location.href === 'https://wow.blizzard.cn/character/#/' ||
        location.href === 'https://wow.blizzard.cn/character/404/' ||
        location.href.startsWith('https://wow.blizzard.cn/character/#/search?q=') ||
        location.href.startsWith('https://wow.blizzard.cn/character/classic/')
    ) {
        return;
    }

    /* -------------------------
        配置：副本/首领/成就映射
    -------------------------*/
    const RAID_CONFIG = [
        {
            name: '法力熔炉：欧米伽',
            instanceId: 1302,
            bosses: [
                {name: '集能哨兵', encounterId: 2684, achId: 41604},
                {name: '卢米萨尔', encounterId: 2686, achId: 41605},
                {name: '缚魂者娜欣达利', encounterId: 2685, achId: 41606},
                {name: '熔炉编织者阿拉兹', encounterId: 2687, achId: 41607},
                {name: '狩魂猎手', encounterId: 2688, achId: 41608},
                {name: '弗兰克提鲁斯', encounterId: 2747, achId: 41609},
                {name: '节点之王萨哈达尔', encounterId: 2690, achId: 41610},
                {name: '诸界吞噬者迪门修斯', encounterId: 2691, achId: 41611},
            ]
        },
        {
            name: '解放安德麦',
            instanceId: 1296,
            bosses: [
                {name: '维克茜和磨轮', encounterId: 2639, achId: 41229},
                {name: '血腥大熔炉', encounterId: 2640, achId: 41230},
                {name: '里克·混响', encounterId: 2641, achId: 41231},
                {name: '斯提克斯·堆渣', encounterId: 2642, achId: 41232},
                {name: '链齿狂人洛肯斯多', encounterId: 2653, achId: 41233},
                {name: '独臂盜匪', encounterId: 2644, achId: 41234},
                {name: '穆格·兹伊，安保头子', encounterId: 2645, achId: 41235},
                {name: '铬武大王加里维克斯', encounterId: 2646, achId: 41236},
            ]
        },
        {
            name: '尼鲁巴尔王宫',
            instanceId: 1273,
            bosses: [
                {name: '噬灭者乌格拉克斯', encounterId: 2607, achId: 40236},
                {name: '血缚恐魔', encounterId: 2611, achId: 40237},
                {name: '苏雷吉队长席克兰', encounterId: 2599, achId: 40238},
                {name: '拉夏南', encounterId: 2609, achId: 40239},
                {name: '虫巢扭曲者欧维纳克斯', encounterId: 2612, achId: 40240},
                {name: '节点女亲王凯威扎', encounterId: 2601, achId: 40241},
                {name: '流丝之庭', encounterId: 2608, achId: 40242},
                {name: '安苏雷克女王', encounterId: 2602, achId: 40243},
            ]
        }
    ];

    const RESILIENCE_ACH = [
        {level:12, id:42149},{level:13,id:42150},{level:14,id:42151},{level:15,id:42152},{level:16,id:42153},
        {level:17,id:42154},{level:18,id:42155},{level:19,id:42156},{level:20,id:42157},{level:21,id:42158},
        {level:22,id:42159},{level:23,id:42160},{level:24,id:42161},{level:25,id:42162},{level:26,id:42802},
        {level:27,id:42803},{level:28,id:42804},{level:29,id:42805},{level:30,id:42806}
    ];

    // localStorage key for panel state
    const STORAGE_KEY_PANEL_OPEN = 'addon-panel-default-open';

    /* -------------------------
        Helpers
    -------------------------*/
    function $(sel, root=document) { return root.querySelector(sel); }
    function $all(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

    function formatDate(ts, locale, short=false) {
        if (!ts && ts !== 0) return '-';
        try {
            const d = new Date(Number(ts));
            if (isNaN(d)) return '-';
            if (short) {
                return d.toISOString().split('T')[0];
            }
            return d.toLocaleString(locale);
        } catch(e) { return '-'; }
    }

    function formatRelativeTime(ts) {
        if (!ts) return '';
        const now = Date.now();
        const diffInMinutes = Math.floor((now - Number(ts)) / (1000 * 60));
        if (diffInMinutes < 60) {
            return `(${diffInMinutes}分钟前)`;
        }
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `(${diffInHours}小时前)`;
        }
        const diffInDays = Math.floor(diffInHours / 24);
        return `(${diffInDays}天前)`;
    }

    function showToast(msg, timeout=3000) {
        let t = document.createElement('div');
        t.className = 'addon-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(()=> t.classList.add('show'), 10);
        setTimeout(()=> { t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, timeout);
    }

    // Custom CSS styles
    GM_addStyle(`
        .addon-toggle-btn {
            position: fixed;
            right: 18px;
            top: 80px;
            padding: 8px 12px;
            background: rgba(18,18,18,0.94);
            color: #eee;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            z-index: 999999;
            font-family: "Helvetica Neue", Arial, "PingFang SC", "Microsoft Yahei", sans-serif;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
        }

        .addon-panel {
            position: fixed;
            right: 18px;
            top: 80px;
            width: 480px;
            max-width: calc(100vw - 40px);
            background: rgba(18,18,18,0.94);
            color: #eee;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            z-index: 999999;
            font-family: "Helvetica Neue", Arial, "PingFang SC", "Microsoft Yahei", sans-serif;
            font-size: 13px;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
            transform: scaleY(0);
            transform-origin: top;
            max-height: 600px;
            opacity: 0;
        }

        .addon-panel.open {
            transform: scaleY(1);
            max-height: 600px;
            opacity: 1;
        }

        .addon-header { padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.03); }
        .addon-header-top { display: flex; justify-content: space-between; align-items: center; }
        .addon-header-left { display: flex; align-items: center; }
        .addon-title { font-weight:600; margin-right:8px; }
        .addon-controls { display:flex; gap:6px; align-items:center; }
        .addon-btn { background:transparent; border:1px solid rgba(255,255,255,0.06); padding:4px 8px; border-radius:6px; color:#ddd; cursor:pointer; }
        .addon-tabs { display:flex; gap:6px; padding:8px; background:rgba(0,0,0,0.03); border-bottom:1px solid rgba(255,255,255,0.02); }
        .addon-tab { padding:6px 10px; border-radius:4px; cursor:pointer; background:transparent; color:#ccc; }
        .addon-tab.active { background:linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); color:#fff; font-weight:600; }
        .addon-body { padding:10px; max-height:420px; overflow:auto; }
        table.addon-table { width:100%; border-collapse:collapse; }
        table.addon-table th, table.addon-table td { padding:6px 8px; text-align:left; border-bottom:1px dashed rgba(255,255,255,0.03); font-size:13px; }
        table.addon-table th { color:#bbb; font-weight:600; }
        .addon-error { color:#ff8a8a; padding:6px; }
        .addon-toast { position:fixed; right:20px; bottom:20px; padding:8px 12px; background:#333; color:#fff; border-radius:6px; opacity:0; transition:0.2s; z-index:9999999; }
        .addon-toast.show { opacity:1; transform: translateY(-6px); }
        .addon-small { font-size:12px; color:#bbb; }
        .addon-date-red { color: #ff8a8a; font-weight: bold; }
        .addon-login-time { font-size: 11px; color: #aaa; margin-top: 4px; }
        .addon-external-links { display: flex; gap: 4px; margin-left: 10px; }
        .addon-external-links a { text-decoration: none; color: #aaa; font-size: 11px; padding: 2px 4px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; transition: color 0.2s, border-color 0.2s; }
        .addon-external-links a:hover { color: #fff; border-color: #fff; }
        .addon-settings { font-size: 11px; color: #aaa; margin-left: 10px; display: flex; align-items: center; }
        .addon-settings input { margin-right: 4px; }
    `);

    /* -------------------------
        UI 构建
    -------------------------*/
    // 读取默认展开状态，默认为 true (展开)
    let isPanelDefaultOpen = localStorage.getItem(STORAGE_KEY_PANEL_OPEN) !== 'false';

    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'addon-toggle-btn';
    toggleBtn.textContent = '史诗团本/坚韧钥石';
    document.body.appendChild(toggleBtn);

    const panel = document.createElement('div');
    panel.className = 'addon-panel' + (isPanelDefaultOpen ? ' open' : ''); // 初始化面板状态
    panel.innerHTML = `
        <div class="addon-header">
            <div class="addon-header-top">
                <div class="addon-header-left">
                    <div class="addon-title">史诗团本/坚韧钥石</div>
                    <div class="addon-external-links" id="addon-external-links"></div>
                </div>
                <div class="addon-controls">
                    <div class="addon-settings">
                        <input type="checkbox" id="addon-default-open-checkbox">
                        <label for="addon-default-open-checkbox">默认展开</label>
                    </div>
                    <button class="addon-btn" id="addon-refresh">刷新</button>
                    <button class="addon-btn" id="addon-close">收起</button>
                </div>
            </div>
            <div class="addon-login-time" id="addon-login-time"></div>
        </div>
        <div class="addon-tabs" id="addon-tabs"></div>
        <div class="addon-body" id="addon-body">
            <div class="addon-loading">等待加载...</div>
        </div>
    `;
    document.body.appendChild(panel);

    const loginTimeEl = $('#addon-login-time');
    const tabsContainer = $('#addon-tabs');
    const bodyContainer = $('#addon-body');
    const externalLinksContainer = $('#addon-external-links');
    const defaultOpenCheckbox = $('#addon-default-open-checkbox');

    // 初始化复选框状态
    defaultOpenCheckbox.checked = isPanelDefaultOpen;
    defaultOpenCheckbox.addEventListener('change', (e) => {
        // 保存用户设置到 localStorage
        localStorage.setItem(STORAGE_KEY_PANEL_OPEN, e.target.checked);
        showToast(`已设置默认状态为${e.target.checked ? '展开' : '折叠'}`);
    });

    const tabDefs = [
        ...RAID_CONFIG.map(r=>({key: `raid_${r.instanceId}`, label: r.name, type:'raid', cfg:r})),
        {key: 'resilience', label: '坚韧钥石', type:'resilience'}
    ];

    tabDefs.forEach((t, i) => {
        const btn = document.createElement('div');
        btn.className = 'addon-tab' + (i===0 ? ' active' : '');
        btn.dataset.key = t.key;
        btn.textContent = t.label;
        btn.addEventListener('click', () => {
            $all('.addon-tab').forEach(x=>x.classList.remove('active'));
            btn.classList.add('active');
            showTab(t);
        });
        tabsContainer.appendChild(btn);
    });

    // Panel controls
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('open');
    });
    $('#addon-close').addEventListener('click', () => {
        panel.classList.remove('open');
    });
    $('#addon-refresh').addEventListener('click', ()=> doFullRefresh(true));

    let lastFetched = { token: null, raids: null, achievements: null, indexData: null, character: null, tokenCharKey: null };
    const locale = (location.host && location.host.includes('wow.blizzard.cn')) ? 'zh-CN' : 'en-US';
    // const region = 'cn'; // unused variable removed

    /* -------------------------
        从页面 URL 提取 realm_slug & role_name
    -------------------------*/
    function parseCharacterFromUrl() {
        try {
            const h = location.hash || '';
            // Remove query parameters before splitting
            const hashWithoutQuery = h.split('?')[0];
            const parts = hashWithoutQuery.replace(/^#\/?/, '').split('/');
            if (parts.length >= 2) {
                const realm_slug = parts[0];
                const role_name = parts[1];
                return { realm_slug: decodeURIComponent(realm_slug), role_name: decodeURIComponent(role_name) };
            } else {
                return null;
            }
        } catch(e) { return null; }
    }

    let urlObserverTimer = null;
    window.addEventListener('hashchange', () => {
        // 当 URL hash 变化时，延迟刷新以确保页面加载完成
        if (urlObserverTimer) clearTimeout(urlObserverTimer);
        urlObserverTimer = setTimeout(()=> {
            doFullRefresh(true);
        }, 300);
    });

    /* -------------------------
        GM_xmlhttpRequest 封装：返回 Promise
    -------------------------*/
    function gmFetchJson(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: { 'Accept': 'application/json' },
                onload: function(resp) {
                    try {
                        // 确保响应码是成功的
                        if (resp.status >= 200 && resp.status < 300) {
                            const j = JSON.parse(resp.responseText);
                            resolve(j);
                        } else {
                            reject(new Error(`API 请求失败: ${resp.status} ${resp.statusText}`));
                        }
                    } catch(e) {
                        reject(new Error('解析 JSON 失败: ' + e.message));
                    }
                },
                onerror: function(err) {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                },
                timeout: 15000
            });
        });
    }

    /* -------------------------
        API 调用
    -------------------------*/
    async function fetchIndex(realm_slug_raw, role_name_raw) {
        if (!realm_slug_raw || !role_name_raw) throw new Error('无法解析角色信息');
        const realm = encodeURIComponent(realm_slug_raw);
        const role = encodeURIComponent(role_name_raw);
        const url = `https://webapi.blizzard.cn/wow-armory-server/api/index?realm_slug=${realm}&role_name=${role}`;
        const j = await gmFetchJson(url);
        if (j && j.data && j.data.token) return j.data;
        throw new Error('未获取到角色token，可尝试先访问一次自己的英雄榜页面以获取登录状态');
    }

    async function fetchRaids(token) {
        const url = `https://webapi.blizzard.cn/wow-armory-server/api/do?api=raids&token=${token}`;
        return await gmFetchJson(url);
    }

    async function fetchAchievements(token) {
        const url = `https://webapi.blizzard.cn/wow-armory-server/api/do?api=character_achievement&token=${token}`;
        return await gmFetchJson(url);
    }

    /* -------------------------
        数据解析 & 渲染
    -------------------------*/
    function findRaidInstance(raidsData, instanceId) {
        if (!raidsData || !raidsData.data || !Array.isArray(raidsData.data.expansions)) return null;
        for (const exp of raidsData.data.expansions) {
            const instances = exp.instances || [];
            for (const inst of instances) {
                if (inst.instance && Number(inst.instance.id) === Number(instanceId)) return inst;
            }
        }
        return null;
    }

    function findMythicMode(modes) {
        if (!Array.isArray(modes)) return null;
        for (const m of modes) {
            if (m.difficulty && m.difficulty.type === 'MYTHIC') {
                return m;
            }
        }
        return null;
    }

    function findEncounterProgress(mode, encounterId) {
        if (!mode || !mode.progress || !Array.isArray(mode.progress.encounters)) return null;
        return mode.progress.encounters.find(e => e.encounter && Number(e.encounter.id) === Number(encounterId));
    }

    function findAchievementEntry(achievementsData, achId) {
        if (!achievementsData || !achievementsData.data || !Array.isArray(achievementsData.data.achievements)) return null;
        // 查找精确 ID 匹配或 achievement.id 匹配
        return achievementsData.data.achievements.find(a => Number(a.id) === Number(achId) || (a.achievement && Number(a.achievement.id) === Number(achId)));
    }

    function renderRaidTable(cfg, raidsData, achievementsData) {
        const inst = findRaidInstance(raidsData, cfg.instanceId);
        const mode = inst ? findMythicMode(inst.modes || []) : null;

        const allFirstKillDates = [];
        let hasAnyKills = false;
        let hasAnyAch = false;

        const allBossData = cfg.bosses.map(b => {
            const prog = mode ? findEncounterProgress(mode, b.encounterId) : null;
            const kills = prog ? (prog.completed_count ?? 0) : 0;
            const lastKill = prog ? (prog.last_kill_timestamp ?? null) : null;
            const achEntry = findAchievementEntry(achievementsData, b.achId);
            const firstKill = achEntry ? (achEntry.completed_timestamp ?? null) : null;

            if (kills > 0) hasAnyKills = true;
            if (firstKill) {
                allFirstKillDates.push(formatDate(firstKill, locale, true));
                hasAnyAch = true;
            }

            return {
                name: b.name,
                kills,
                lastKill,
                firstKill
            };
        });

        // 优化点 1: 逻辑调整
        // 如果没有团本数据，但有成就数据，则展示成就数据
        if (!hasAnyKills && !hasAnyAch) {
            return `<div class="addon-small">未检测到角色${cfg.name}史诗难度击杀记录，也未检测到战网最高进度成就。</div>`;
        }

        // 识别重复的首次击杀日期
        const dateCounts = allFirstKillDates.reduce((acc, date) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        const redDates = Object.keys(dateCounts).filter(date => dateCounts[date] > 1);

        // 优化点 3: 调整列宽和列标题
        const header = `<table class="addon-table"><thead><tr><th style="width:40%">首领（史诗难度）</th><th style="width:15%">击杀次数</th><th style="width:22.5%">最后击杀</th><th style="width:22.5%">首次击杀</th></tr></thead><tbody>`;
        const body = allBossData.map(r => {
            let killsHtml = r.kills > 0 ? r.kills : '-';
            let lastKillHtml = r.kills > 0 ? escapeHtml(formatDate(r.lastKill, locale)) : '-';

            let firstKillHtml = '-';
            if (r.firstKill) {
                firstKillHtml = escapeHtml(formatDate(r.firstKill, locale));
                if (redDates.includes(formatDate(r.firstKill, locale, true))) {
                    firstKillHtml = `<span class="addon-date-red">${firstKillHtml}</span>`;
                }
            }

            // 如果没有击杀记录但有成就，将击杀次数和最后击杀标记为 '无记录'
            if (r.kills === 0 && r.firstKill) {
                killsHtml = '<span class="addon-small">无记录</span>';
                lastKillHtml = '<span class="addon-small">无记录</span>';
            }

            return `<tr>
                <td>${escapeHtml(r.name)}</td>
                <td>${killsHtml}</td>
                <td>${lastKillHtml}</td>
                <td>${firstKillHtml}</td>
            </tr>`;
        }).join('');

        const footer = `</tbody></table><div class="addon-small" style="margin-top:8px">*首次击杀时间取自英雄榜成就，为角色所属战网帐号/战团的最早完成时间，可能并非角色本身完成。击杀次数和最后击杀时间为角色本身数据。</div>`;
        return header + body + footer;
    }


    function renderResilienceTable(achievementsData) {
        const rows = RESILIENCE_ACH.map(a => {
            const ent = findAchievementEntry(achievementsData, a.id);
            const ts = ent ? (ent.completed_timestamp ?? null) : null;
            return {level: a.level, ts};
        }).filter(r => r.ts);

        const allAchDates = rows.map(r => formatDate(r.ts, locale, true));
        const dateCounts = allAchDates.reduce((acc, date) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        const redDates = Object.keys(dateCounts).filter(date => dateCounts[date] > 1);

        if (rows.length === 0) return `<div class="addon-small">未检测到本赛季的坚韧钥石成就</div>`;

        // 按照等级降序排列
        rows.sort((a, b) => b.level - a.level);

        const header = `<table class="addon-table"><thead><tr><th style="width:40%">坚韧等级</th><th style="width:60%">完成时间</th></tr></thead><tbody>`;
        const body = rows.map(r => {
            let timeHtml = escapeHtml(formatDate(r.ts, locale));
            if (redDates.includes(formatDate(r.ts, locale, true))) {
                timeHtml = `<span class="addon-date-red">${timeHtml}</span>`;
            }
            return `<tr><td>+${r.level}</td><td>${timeHtml}</td></tr>`;
        }).join('');

        const footer = `</tbody></table><div class="addon-small" style="margin-top:8px">*完成时间取自英雄榜成就，为角色所属战网帐号/战团完成的最早完成时间，可能并非角色本身完成，建议结合角色史诗钥石分数和进度一并判断</div>`;
        return header + body + footer;
    }

    function escapeHtml(s) {
        // Handle null/undefined case
        if (s === null || s === undefined) return '';
        return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
    }

    function updateExternalLinks(char) {
        if (!char) {
            externalLinksContainer.innerHTML = '';
            return;
        }

        const realmSlug = char.realm_slug.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
        const roleName = char.role_name;

        const links = [
            {
                name: 'Raider.IO',
                url: `https://raider.io/cn/characters/cn/${realmSlug}/${roleName}`
            },
            {
                name: 'Warcraft Logs',
                url: `https://cn.warcraftlogs.com/character/cn/${realmSlug}/${roleName}`
            }
        ];

        externalLinksContainer.innerHTML = links.map(link =>
            `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="前往 ${link.name} 查询">${link.name}</a>`
        ).join('');
    }

    async function showTab(tabDef) {
        bodyContainer.innerHTML = `<div class="addon-loading">加载中...</div>`;
        try {
            const char = parseCharacterFromUrl();
            if (!char) throw new Error('无法从 URL 解析角色（请在英雄榜角色页打开）。');
            const token = await getTokenAndDataIfNeeded(char);
            if (!token) throw new Error('无法获取 token。');
            if (!lastFetched.raids || !lastFetched.achievements) {
                throw new Error('内部错误：缺失团本或成就数据，请点击"刷新"重试。');
            }
            if (tabDef.type === 'raid') {
                bodyContainer.innerHTML = renderRaidTable(tabDef.cfg, lastFetched.raids, lastFetched.achievements);
            } else if (tabDef.key === 'resilience') {
                bodyContainer.innerHTML = renderResilienceTable(lastFetched.achievements);
            } else {
                bodyContainer.innerHTML = `<div class="addon-error">未知 tab</div>`;
            }
        } catch (e) {
            bodyContainer.innerHTML = `<div class="addon-error">${escapeHtml(e.message || e)}</div>`;
            console.error('[WoW Armory Addon Error]', e);
        }
    }

    async function getTokenAndDataIfNeeded(char, doRefresh=false) {
        try {
            if (!char) char = parseCharacterFromUrl();
            if (!char) throw new Error('无法解析角色信息');
            const charKey = `${char.realm_slug}||${char.role_name}`;

            // 1. 获取 Token
            if (doRefresh || lastFetched.tokenCharKey !== charKey || !lastFetched.token) {
                bodyContainer.innerHTML = `<div class="addon-loading">获取 token ...</div>`;
                const indexData = await fetchIndex(char.realm_slug, char.role_name);
                lastFetched.token = indexData.token;
                lastFetched.tokenCharKey = charKey;
                lastFetched.indexData = indexData;
                // 重置数据
                lastFetched.raids = null;
                lastFetched.achievements = null;

                const loginTime = indexData?.character_summary?.last_login_timestamp;
                if (loginTime) {
                    loginTimeEl.textContent = `角色上次登录：${formatDate(loginTime, locale)} ${formatRelativeTime(loginTime)}`;
                } else {
                    loginTimeEl.textContent = '角色上次登录：无法获取';
                }
            }

            // 2. 获取 Raids 数据
            if (!lastFetched.raids || doRefresh) {
                bodyContainer.innerHTML = `<div class="addon-loading">获取团本数据 ...</div>`;
                lastFetched.raids = await fetchRaids(lastFetched.token);
            }
            // 3. 获取 Achievements 数据
            if (!lastFetched.achievements || doRefresh) {
                bodyContainer.innerHTML = `<div class="addon-loading">获取成就数据 ...</div>`;
                lastFetched.achievements = await fetchAchievements(lastFetched.token);
            }

            // 更新外部链接所需角色信息
            lastFetched.character = char;
            updateExternalLinks(lastFetched.character);

            return lastFetched.token;
        } catch (e) {
            loginTimeEl.textContent = '角色上次登录：无法获取';
            throw e;
        }
    }

    async function doFullRefresh(force=false) {
        try {
            const char = parseCharacterFromUrl();
            if (!char) {
                bodyContainer.innerHTML = `<div class="addon-error">请在角色英雄榜页面打开脚本（示例：https://wow.blizzard.cn/character/#/{服务器}/{角色名}）。</div>`;
                updateExternalLinks(null);
                return;
            }
            bodyContainer.innerHTML = `<div class="addon-loading">正在刷新数据...</div>`;
            await getTokenAndDataIfNeeded(char, force);

            // 刷新完成后，显示当前选中的 Tab
            const activeTab = $('.addon-tab.active');
            let tabToOpen = activeTab ? tabDefs.find(t=>t.key===activeTab.dataset.key) : tabDefs[0];
            if (tabToOpen) {
                await showTab(tabToOpen);
            }
            showToast('数据已刷新');
        } catch (e) {
            bodyContainer.innerHTML = `<div class="addon-error">${escapeHtml(e.message || e)}</div>`;
            console.error('[WoW Armory Addon Error]', e);
        }
    }

    (async function init() {
        try {
            // 给予页面基础元素加载的时间
            await new Promise(res => setTimeout(res, 600));
            await doFullRefresh(false);
            // 优化点 2: 根据 localStorage 决定是否默认展开
            if (isPanelDefaultOpen) {
                // 确保只有在面板未打开时才调用 click，防止二次动画
                if (!panel.classList.contains('open')) {
                    toggleBtn.click();
                }
            }
        } catch(e) {
            console.error('init error', e);
        }
    })();
})();