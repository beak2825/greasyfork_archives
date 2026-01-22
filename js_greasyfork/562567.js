// ==UserScript==
// @name         国民大朱哥之撸区团播(V16.2-极简稳定版)
// @namespace    http://tampermonkey.net/
// @version      16.2
// @description  修复URL错误和变量名兼容性。保留所有功能(跨区/开关/排序/胜率)，体积小，性能强。
// @author       You
// @match        *://www.douyu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/562567/%E5%9B%BD%E6%B0%91%E5%A4%A7%E6%9C%B1%E5%93%A5%E4%B9%8B%E6%92%B8%E5%8C%BA%E5%9B%A2%E6%92%AD%28V162-%E6%9E%81%E7%AE%80%E7%A8%B3%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562567/%E5%9B%BD%E6%B0%91%E5%A4%A7%E6%9C%B1%E5%93%A5%E4%B9%8B%E6%92%B8%E5%8C%BA%E5%9B%A2%E6%92%AD%28V162-%E6%9E%81%E7%AE%80%E7%A8%B3%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ⚠️ 变量名已改回 RIOT_API_KEY，方便你直接复制旧配置
    const RIOT_API_KEY = "RGAPI-3f054bda-eb63-4c42-8808-d6e4185141c1";

    const MY_ROOMS = [
        { id: "12765525", name: "久米隆", rid: "Dragon9#9000", s: "JP1" },
        { id: "11162745", name: "塔塔酱", rid: "Never Trust LPL#Pyo", s: "JP1" },
        { id: null, name: "青野南", rid: "qinyenan#9527", s: "JP1" },
        { id: "12741089", name: "大飞科", rid: "Sebastian#10240", s: "JP1" },
        { id: "12697683", name: "皮特", rid: "SKT otto#pite", s: "JP1" },
        { id: "2326583", name: "Judy", rid: "Judy#oasis", s: "JP1" },
        { id: "10972939", name: "司马国玉", rid: "pkxin#miss", s: "KR" }
    ];

    const CACHE = { c: null, p: {} }, QUEUE = [];
    let isQ = false;

    // 样式精简压缩
    GM_addStyle(`
        @keyframes r { 100% { transform:rotate(360deg)} } @keyframes p { 0%,100% { box-shadow:0 0 0 0 #32cd32b3 } 70% { box-shadow:0 0 0 6px transparent } } @keyframes g { 0%,100% { box-shadow:0 0 0 0 #00bfffb3 } 70% { box-shadow:0 0 0 6px transparent } }
        #m-box { position:fixed; top:15%; right:20px; width:300px; max-height:80vh; background:#141423f2; backdrop-filter:blur(10px); border:1px solid #ffffff1a; border-radius:8px; color:#eee; font:13px sans-serif; z-index:9999; box-shadow:0 10px 30px #0008; display:flex; flex-direction:column; transition:transform .1s }
        #m-box.h { transform:translateX(320px)!important; transition:.3s }
        .tog { position:absolute; left:-18px; top:50%; transform:translateY(-50%); width:18px; height:50px; background:#141423f2; border-radius:6px 0 0 6px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid #ffffff1a; border-right:0; color:#aaa }
        .hd { display:flex; align-items:center; padding:10px; border-bottom:1px solid #ffffff1a; cursor:move; user-select:none }
        .tt { font-weight:700; color:#ffd700; flex:1 }
        .rf { background:#ffffff1a; border:1px solid #ffffff33; color:#4ade80; border-radius:4px; cursor:pointer; padding:2px 8px; font-size:12px; height:24px } .rf:hover { border-color:#4ade80; color:#fff } .rf .i.r { animation:r 1s linear infinite }
        #lst { padding:10px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#555 transparent } #lst::-webkit-scrollbar { width:6px } #lst::-webkit-scrollbar-thumb { background:#555; border-radius:3px }
        .it { margin-bottom:10px; padding:10px; background:#ffffff0d; border-radius:6px; transition:.2s; border:1px solid transparent } .it:hover { background:#ffffff1a; border-color:#ffffff33 } .it.off { opacity:.5; filter:grayscale(1) }
        .ih { display:flex; align-items:center; margin-bottom:6px } .ih:hover .nm { color:#ffa500; text-decoration:underline; cursor:pointer }
        .dt { width:8px; height:8px; border-radius:50%; background:#555; margin-right:8px } .dt.on { background:#32cd32; box-shadow:0 0 6px #32cd32; animation:p 2s infinite }
        .nm { font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:5px } .bk { font-size:11px; color:#999; margin-left:4px }
        .bts { display:flex; gap:5px } .sw { font-size:10px; padding:1px 4px; border-radius:3px; cursor:pointer; border:1px solid #555; color:#888; background:#0003 } .sw.on { color:#4ade80; border-color:#059669; background:#064e3b80 }
        .ir { color:#666; width:20px; text-align:center; cursor:pointer; transition:.2s } .ir:hover { color:#4ade80 } .ir.r { animation:r .8s linear infinite; color:#4ade80; pointer-events:none }
        .gt { font-size:10px; color:#00bfff; border:1px solid #00bfff; padding:0 4px; border-radius:3px; margin-left:4px; animation:g 2s infinite; vertical-align:middle }
        .st { font-size:11px; color:#aaa; display:flex; flex-direction:column; gap:4px } .rw { display:flex; justify-content:space-between }
        .tm { font-size:10px; color:#9ca3af; margin-bottom:2px } .rk { color:#e0e0e0; font-weight:700 } .wr { font-size:10px; color:#888; font-weight:400; margin-left:6px }
        .tag { padding:1px 5px; border-radius:3px; font-weight:700; font-size:10px } .w { background:#064e3b; color:#34d399; border:1px solid #059669 } .l { background:#7f1d1d; color:#f87171; border:1px solid #b91c1c }
        .ld { font-style:italic; font-size:10px; color:#888 } .err { color:#f87171; font-weight:700; font-size:11px } .pau { font-style:italic; font-size:11px; color:#666 }
    `);

    // --- 初始化 ---
    function init() {
        if (document.getElementById('m-box')) return;
        const box = document.createElement('div'); box.id = 'm-box';
        box.innerHTML = `
            <div class="tog">&gt;</div>
            <div class="hd"><div class="tt">撸区监控</div><button class="rf" title="全部刷新"><span class="i">↻</span></button></div>
            <div id="lst"></div>
        `;
        document.body.append(box);

        // 事件委托
        box.addEventListener('click', e => {
            const t = e.target;
            if (t.closest('.tog')) { box.classList.toggle('h'); t.innerText = box.classList.contains('h') ? '<' : '>'; return; }
            if (t.closest('.rf')) { const i=box.querySelector('.rf .i'); i.classList.add('r'); loadAll(true); setTimeout(()=>i.classList.remove('r'), 1000); return; }

            const item = t.closest('.it');
            if (!item) return;
            const idx = +item.dataset.i, r = MY_ROOMS[idx];

            if (t.closest('.sw')) { // 开关
                const s = t.closest('.sw'), on = s.classList.toggle('on');
                s.innerText = on ? '开' : '关';
                item.classList.toggle('off', !on);
                localStorage.setItem(`m_${idx}`, on ? 1 : 0);
                item.querySelector('.st').innerHTML = on ? '<span class="ld">⏳ 待命...</span>' : '<div class="pau">⛔ 已暂停</div>';
                if(on && r.rid) pushQ(()=>fetchData(r, idx));
                return;
            }
            if (t.closest('.ir')) { // 单刷
                if(item.classList.contains('off')) return;
                const ir = t.closest('.ir'); ir.classList.add('r');
                checkLive(r, idx);
                if(r.rid) fetchData(r, idx).finally(()=>ir.classList.remove('r'));
                else setTimeout(()=>ir.classList.remove('r'), 500);
                return;
            }
            if (t.closest('.ih') || t === item) {
                if (r.rid) GM_openInTab(`https://www.op.gg/summoners/${r.s==='KR'?'kr':'jp'}/${r.rid.replace('#','-')}`, {active:true});
                else if (r.id) window.location.href = `https://www.douyu.com/${r.id}`;
            }
        });

        // 拖拽
        let d=false,x,y,ix,iy;
        box.querySelector('.hd').onmousedown = e => { if(!e.target.closest('.rf')){ d=true; x=e.clientX; y=e.clientY; const r=box.getBoundingClientRect(); ix=r.left; iy=r.top; }};
        document.onmousemove = e => { if(d) { box.style.left=(ix+e.clientX-x)+'px'; box.style.top=(iy+e.clientY-y)+'px'; box.style.transform='none'; }};
        document.onmouseup = () => d=false;

        loadChamps();
        loadAll(true);
        setInterval(()=>loadAll(true), 1200000);
    }

    function loadAll(fetchAPI) {
        const lst = document.getElementById('lst');
        if (fetchAPI) { lst.innerHTML = ''; QUEUE.length=0; isQ=false; }

        MY_ROOMS.forEach((r, i) => {
            if (!fetchAPI) return;
            const on = localStorage.getItem(`m_${i}`) !== '0';
            const div = document.createElement('div');
            div.className = `it ${on?'':'off'}`;
            div.dataset.i = i; div.dataset.sc = -1;
            div.innerHTML = `
                <div class="ih">
                    <div class="dt" id="d-${i}"></div>
                    <div class="nm">${r.name}<span id="g-${i}"></span></div>
                    <div class="bts"><div class="sw ${on?'on':''}">${on?'开':'关'}</div><div class="ir">↻</div></div>
                </div>
                <div class="st ${on?'ld':''}" id="s-${i}">${on ? '⏳ 队列中...' : '<div class="pau">⛔ 已暂停</div>'}</div>
            `;
            lst.append(div);

            if (r.id) checkLive(r, i);
            else setTimeout(() => {
                const d = document.getElementById(`d-${i}`);
                if(d) { d.parentElement.parentElement.style.opacity = '0.7'; d.nextElementSibling.insertAdjacentHTML('beforeend', `<span class="bk">(未开播)</span>`); }
            }, 0);

            if (r.rid && fetchAPI && on) pushQ(()=>fetchData(r, i));
        });
        if (fetchAPI) runQ();
    }

    function pushQ(fn) { QUEUE.push(fn); }
    function runQ() {
        if (!QUEUE.length) { isQ=false; sort(); return; }
        isQ = true;
        Promise.all(QUEUE.splice(0, 5).map(f => f().catch(console.error))).finally(() => { sort(); setTimeout(runQ, 2000); });
    }
    function sort() {
        const lst = document.getElementById('lst');
        [...lst.children].sort((a,b) => {
            const oa=!a.classList.contains('off'), ob=!b.classList.contains('off');
            return oa===ob ? (b.dataset.sc - a.dataset.sc) : (oa?-1:1);
        }).forEach(n => lst.appendChild(n));
    }

    // 强制发送Header
    function req(url) {
        return new Promise((ok, no) => GM_xmlhttpRequest({
            method:"GET", url,
            headers:{"User-Agent":navigator.userAgent}, // 强制携带UA
            onload:r=>r.status==200?ok(JSON.parse(r.responseText)):no(r), onerror:no
        }));
    }

    function checkLive(r, i) {
        GM_xmlhttpRequest({ method:"GET", url:`https://open.douyucdn.cn/api/RoomApi/room/${r.id}`, onload: res => {
            const d = document.getElementById(`d-${i}`); if(!d) return;
            const nm = d.nextElementSibling;
            const isLive = JSON.parse(res.responseText).data?.room_status === "1";
            d.className = `dt ${isLive?'on':''}`;
            d.parentElement.parentElement.style.opacity = isLive ? '1' : '0.7';
            const bk = nm.querySelector('.bk'); if(bk) bk.remove();
            if(!isLive) nm.insertAdjacentHTML('beforeend', `<span class="bk">(未开播)</span>`);
        }});
    }

    async function fetchData(r, i) {
        const div = document.getElementById(`s-${i}`);
        if(div) div.innerText = "查询中...";
        const [gn, tl] = r.rid.split('#');
        const reg = "asia.api.riotgames.com";
        const plat = `${(r.s||'JP1').toLowerCase()}.api.riotgames.com`;

        try {
            if (!CACHE.p[r.rid]) {
                const ac = await req(`https://${reg}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gn)}/${encodeURIComponent(tl)}?api_key=${RIOT_API_KEY}`);
                CACHE.p[r.rid] = ac.puuid;
            }
            const uid = CACHE.p[r.rid];

            // 修复URL错误：添加了 /ids
            const [g, l, m] = await Promise.all([
                req(`https://${plat}/lol/spectator/v5/active-games/by-summoner/${uid}?api_key=${RIOT_API_KEY}`).catch(()=>0),
                req(`https://${plat}/lol/league/v4/entries/by-puuid/${uid}?api_key=${RIOT_API_KEY}`),
                req(`https://${reg}/lol/match/v5/matches/by-puuid/${uid}/ids?start=0&count=1&api_key=${RIOT_API_KEY}`) // 这里必须有 /ids
            ]);

            const sp = document.getElementById(`g-${i}`);
            if (g && g.gameId) {
                const me = g.participants.find(p=>p.puuid==uid);
                sp.innerHTML = `<span class="gt">● 游戏中 ${me ? (CACHE.c[me.championId]||'') : ''}</span>`;
            } else sp.innerHTML = '';

            let rkTxt = "Unranked", sc = 0;
            const so = l.find(x=>x.queueType=="RANKED_SOLO_5x5");
            if (so) {
                const ts = {CHALLENGER:9e4, GRANDMASTER:8e4, MASTER:7e4, DIAMOND:6e4, EMERALD:5e4, PLATINUM:4e4, GOLD:3e4, SILVER:2e4, BRONZE:1e4, IRON:0};
                const wr = Math.round((so.wins/(so.wins+so.losses))*100);
                rkTxt = `${so.tier} ${so.rank} ${so.leaguePoints}点 <span class="wr">(${so.wins}-${so.losses} ${wr}%)</span>`;
                sc = (ts[so.tier]||0) + (so.tier=='MASTER'||so.tier=='GRANDMASTER'||so.tier=='CHALLENGER' ? so.leaguePoints : ({I:300,II:200,III:100,IV:0}[so.rank]||0) + so.leaguePoints);
            }
            div.parentElement.dataset.sc = sc;

            let mtHtml = '<div>暂无记录</div>', tmHtml = '';
            if (m && m.length) {
                const d = await req(`https://${reg}/lol/match/v5/matches/${m[0]}?api_key=${RIOT_API_KEY}`);
                const p = d.info.participants.find(x=>x.puuid==uid);
                const min = Math.floor((Date.now()-d.info.gameEndTimestamp)/60000);
                tmHtml = `<span class="tm">${min<60?min+'分钟前':Math.floor(min/60)+'小时前'}</span>`;
                mtHtml = `<div class="rw"><div><span class="tag ${p.win?'w':'l'}">${p.win?'胜利':'失败'}</span><span style="margin-left:5px;color:#ddd">${p.championName}</span></div><span style="color:#999">${p.kills}/${p.deaths}/${p.assists}</span></div>`;
            }

            div.innerHTML = `${tmHtml}<div class="rk">${rkTxt}</div>${mtHtml}`;
            div.className = 'st';

        } catch (e) {
            console.error(e);
            if(div) div.innerHTML = `<span class="err">${e.status==403?'Key无效':e.status==404?'查无此人':'查询失败'}</span>`;
        }
    }

    async function loadChamps() {
        if (CACHE.c) return;
        try {
            // DataDragon 不需要header，用 fetch
            const v = await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json")).json();
            const d = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${v[0]}/data/zh_CN/champion.json`)).json();
            CACHE.c = {}; for(let k in d.data) CACHE.c[d.data[k].key] = d.data[k].name;
        } catch(e){}
    }

    init();
})();