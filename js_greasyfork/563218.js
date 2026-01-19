// ==UserScript==
// @name         NodeSeek & DeepFlood 回帖足迹
// @namespace    http://www.nodeseek.com/
// @version      1.0.0
// @description  在帖子列表中为本人已回复过的帖子自动打上“已回复”标签
// @author       dabao
// @match        https://www.nodeseek.com/*
// @match        https://www.deepflood.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACz0lEQVR4Ae3B32tVdQAA8M85u7aVHObmzJVD0+ssiphstLEM62CBlCBEIAYhUoGGD/kiRUo+9CIEElFZgZJFSApBVhCUX2WFrVQKf5Qy26SgdK4pN7eZu+cbtyfJ/gLx83HD9SAhlEyXupiPhUSTeonRfNw1ws2aRJeN5jHcolFhJJ9M8Zj99piDTnv12SjzfzIb9dmrC7Pttt8ykjDVLsu8ZZ1GH1oqeDofJLtJh4fMEw3Y72jlCuEO2+W+sNJFr3vOZ1YIi8NIGA29hDWhGgZDJ2Rt2ZvZSBazmMUsZsPZ1qwVQmcYDNWwhtAbRsNIWJx6WLPDfgxNVkm9nR8hm+XduLba7F9RtcXztmUzyY/YJrUqNPvBYc0eSS3CwXxMl4WG7CarsyEuvU2HOkRNujSw3PosxR6DFurKxx3E/akFohPo0aDfEO61os5LdrtLVWG1TzxokifdiSH9GnTjuGhBqsWE39GOo3kVi8wsmeVW00SJ200zA9r0kFcdQzv+MKElVW/S+L5EE86pmUth3BV/SzCOCUjMVXMWzfsSYybVl1SlSlESkagpuOI1nzshFX1gyAF1UKhJEKOkJFVNXVBv+pJoBK1qBkh86z1/SaR+9o5zEgoDaloxsiSart6F1Bkl83ESHWEKvvEbqZJETaokgSH9hCk6cBLtSs6kDqEb/cZ0K+MnO0X/VdhRGUBZjzH9uA+HUl+a0BvmO+J7bVZSKWz1kehqhfe9oWalNoccDmW9JnyV+toxsy3PK3aY9Gx4gMp567ziV4WawpCXra+MEhZ5xqTtecVycxzXlxA22OK4ZYbt9LjvrM5PkNUp6zVPdNpBv1QKwt126Paxp8zwqXu8kG8pYZdHlT2Rvxo2aVG2ObyYn65UnXLKVULZZrP02ZRfCms1OmAXCSHRYqrLzuZFaDFV6s/8omuERs0Kl/LzITVTvTHDeXTD9eAftAsSYhXYOWUAAAAASUVORK5CYII=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/563218/NodeSeek%20%20DeepFlood%20%E5%9B%9E%E5%B8%96%E8%B6%B3%E8%BF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/563218/NodeSeek%20%20DeepFlood%20%E5%9B%9E%E5%B8%96%E8%B6%B3%E8%BF%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const w = unsafeWindow, d = document, SID = location.host.replace(/\W/g, '');
    const DB = 'nsx-comments-db', ST = 'nsx-comments-store';
    const K = { I: "nsx_init", P: "nsx_page", T: "nsx_time", C: "nsx_count" };

    // 0. 校验登录
    const user = w.__config__?.user;
    if (!user?.member_id) return;
    const { member_id: uid, member_name: uName } = user;

    // 1. 存储封装
    const get = (k, def) => (GM_getValue(SID, {})[uid]?.[k] ?? def);
    const set = (k, v) => { const d = GM_getValue(SID, {}); if(!d[uid]) d[uid] = {}; d[uid][k] = v; GM_setValue(SID, d); };
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    GM_addStyle(`.replied-badge{display:inline-block;margin-left:8px;padding:2px 8px;font-size:12px;color:#fff;background:#10b981;border-radius:4px;text-decoration:none}.replied-badge:hover{background:#059669;color:#fff !important;}`);

    // 2. DB 操作封装
    const dbAct = (mode, fn) => new Promise((res, rej) => {
        const r = indexedDB.open(DB, 1);

        r.onerror = () => rej(r.error || new Error('DB Open Failed'));

        r.onupgradeneeded = e => {
            const db = e.target.result;
            if(db.objectStoreNames.contains(ST)) db.deleteObjectStore(ST);

            const s = db.createObjectStore(ST, {keyPath:['uid','post_id','floor_id']});
            s.createIndex('upid', ['uid','post_id']);
        };

        r.onsuccess = () => {
            const tx = r.result.transaction([ST], mode);
            tx.onerror = () => rej(tx.error || new Error('Transaction Error'));
            tx.onabort = () => rej(tx.error || new Error('Transaction Aborted'));
            try { fn(tx.objectStore(ST), res, rej); } catch (e) { rej(e); }
        };
    });

    // 3. 核心抓取
    async function sync(mode) {
        const isInit = mode === 'init';
        let p = isInit ? get(K.P, 1) : 1, n = 0, stop = 0, max = Math.ceil((w.__config__?.user?.nComment||0)/15)||999;
        console.log(`[${SID}#${uName}] ${mode} start p:${p}`);

        while(!stop && (isInit ? p <= max : true)) {
            if(d.querySelector('.msc-sub')) d.querySelector('.msc-sub').textContent = `正在同步: 第 ${p} / ${isInit?max:'?'} 页`;

            const res = await fetch(`/api/content/list-comments?uid=${uid}&page=${p}`)
            .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));

            if(!res.success || !res.comments?.length) break;

            for(const c of res.comments) {
                if(!c.floor_id) continue;
                const exist = await dbAct('readonly', (s,r)=>s.get([uid, c.post_id, c.floor_id]).onsuccess=e=>r(!!e.target.result));
                if(!isInit && exist) stop=1;
                else await dbAct('readwrite', (s,r)=>s.put({uid, post_id:c.post_id, floor_id:c.floor_id}).onsuccess=()=>r(n++));
            }
            if(isInit) set(K.P, p);
            p++; await sleep(1000);
        }

        const total = await dbAct('readonly', (s,r)=>s.index('upid').count(IDBKeyRange.bound([uid,0], [uid,Infinity])).onsuccess=e=>r(e.target.result));
        set(K.C, total);
        set(K.T, Date.now());
        if(isInit) { set(K.I, true); set(K.P, 1); }
        return n;
    }

    // 4. UI 标记
    async function mark() {
        if(!/^\/(categories\/|page|award|search|$)/.test(location.pathname)) return;

        const els = [...d.querySelectorAll('.post-list-item')].map(el=>({el, pid: parseInt(el.querySelector('.post-title a')?.href.match(/-(\d+)-/)?.[1])})).filter(e=>e.pid);
        if(!els.length) return;

        await Promise.all(els.map(async ({el, pid}) => {
            try {
                const max = await dbAct('readonly', (s,r) => {
                    const range = IDBKeyRange.bound([uid, pid, 0], [uid, pid, Infinity]);
                    // 读取 value.floor_id
                    s.openCursor(range, 'prev').onsuccess = e => r(e.target.result?.value.floor_id || 0);
                });

                if(max > 0 && !el.querySelector('.replied-badge')) {
                    const b = d.createElement('a');
                    Object.assign(b, { className: 'replied-badge', target: '_blank', textContent: `已回复 #${max}`,
                                      href: `/post-${pid}-${Math.ceil(max/(w.__config__?.commentPerPage||10))}#${max}` });
                    el.querySelector('.post-title').append(b);
                }
            } catch (e) {
                console.warn('[Mark Error]', pid, e);
            }
        }));
    }

    // 5. 主流程
    const list = d.querySelector('ul.post-list');
    if(list) new MutationObserver(mark).observe(list, {childList:true});

    navigator.locks.request(`nsx_sync_${uid}`, {ifAvailable:true}, async lock => {
        if(!lock) return mark();

        try {
            if(!get(K.I)) {
                const last = get(K.P, 1);
                const title = last > 1 ? '断点续传' : '初始化回复数据';
                const msg = last > 1
                ? `检测到账号 [${uName}] 上次同步中断，进度第 ${last} 页。\n是否继续？`
                    : `检测到账号 [${uName}] 尚未同步记录。\n是否开始抓取？`;

                await new Promise((res, rej) => w.mscConfirm(title, msg, async ()=>{
                    w.mscAlert('正在同步',`账号: ${uName}\n请保持页面开启...`, ()=>{});
                    try {
                        const n = await sync('init');
                        d.querySelector('.msc-confirm')?.remove();
                        w.mscAlert('同步完成', `新增 ${n} 条记录`, mark);
                    } catch(e) {
                        d.querySelector('.msc-confirm')?.remove();
                        w.mscAlert('同步失败', `错误信息: ${e.message}`);
                    }
                    res();
                }, res));
            } else {
                await sync('inc');
                mark();
            }
        } catch (e) {
            console.error('[NSX Critical Error]', e);
        }
    });

    // 6. 菜单
    GM_registerMenuCommand(`🔄 重置回复数据`, () => w.mscConfirm('确认重置？', '仅清空当前账号的缓存记录，不影响其他账号。', async () => {
        try {
            await dbAct('readwrite', (s,r) => {
                const req = s.index('upid').openCursor(IDBKeyRange.bound([uid,0], [uid,Infinity]));
                req.onsuccess = e => {
                    const c = e.target.result;
                    if(c) { c.delete(); c.continue(); } else r();
                };
            });
            const d = GM_getValue(SID, {}); delete d[uid]; GM_setValue(SID, d);
            location.reload();
        } catch(e) { w.mscAlert('重置失败', e.message); }
    }));

    GM_registerMenuCommand(`📊 数据统计信息`, () => {
        const timeStr = get(K.T) ? new Date(get(K.T)).toLocaleString() : '无';
        w.mscAlert('统计', `用户: ${uName}\n状态: ${get(K.I)?'✅ 完成':'⏳ 进行中'}\n更新: ${timeStr}\n记录: ${get(K.C,0)} 条`);
    });
})();