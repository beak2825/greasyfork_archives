// ==UserScript==
// @name         拼多多订单导出管理系统 v2.0
// @namespace    win.somereason.web.pdd_manager
// @version      2.0.0
// @description  【智能触底版】修复“抓取全部”无法停止的问题。引入物理触底检测（监测滚动条位置）+ 底部关键词识别，精准判断结束时机。
// @author       Luoshen Seeker & Optimized by Assistant
// @match        *://mobile.pinduoduo.com/*
// @exclude      *://mobile.pinduoduo.com/login*
// @icon         https://pinduoduoimg.yangkeduo.com/base/mac_icon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562733/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/562733/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%20v20.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 0. 核心：环境伪装
    // ==========================================
    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}

    // ==========================================
    // 1. 配置与常量
    // ==========================================
    const CONFIG = {
        key: 'pdd_data_v27', // 数据库升级
        pageSize: 50,
        colors: {
            red: '#e02e24',
            blue: '#1890ff',
            green: '#52c41a',
            orange: '#fa8c16',
            gray: '#f0f2f5',
            border: '#d9d9d9'
        }
    };

    const utils = {
        getUid: () => {
            const m = document.cookie.match(/pdd_user_id=([^;]+)/);
            return m ? m[1] : null;
        },
        getSafe: (obj, keys, def = "") => {
            if (!obj) return def;
            for (let k of keys) {
                if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
            }
            return def;
        },
        tsToDate: (ts) => {
            if (!ts) return '-';
            const d = new Date(ts);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        },
        tsToDateObj: (ts) => {
            if (!ts) return { d: '-', t: '' };
            const d = new Date(ts);
            const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
            return { d: date, t: time };
        },
        formatDateInput: (d) => {
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        },
        toast: (msg, type = 'info') => {
            const div = document.createElement('div');
            div.className = `pdd-toast ${type}`;
            div.innerHTML = msg;
            document.body.appendChild(div);
            setTimeout(() => { div.style.opacity = '0'; div.style.transform = 'translate(-50%, -20px)'; }, 2000);
            setTimeout(() => div.remove(), 2500);
        },
        setTitle: (text) => {
            document.title = text;
        },
        forceLogout: () => {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.pinduoduo.com;path=/";
            }
            localStorage.clear();
            sessionStorage.clear();
        }
    };

    // ==========================================
    // 2. 数据库管理
    // ==========================================
    const DB = {
        getData: () => GM_getValue(CONFIG.key, { accounts: {}, orders: {} }),
        saveData: (data) => GM_setValue(CONFIG.key, data),

        updateAccount: (uid, cookie) => {
            const db = DB.getData();
            if (!db.accounts[uid]) {
                db.accounts[uid] = { id: uid, name: `用户_${uid.slice(-4)}`, alias: null, createTime: Date.now() };
            }
            db.accounts[uid].cookie = cookie;
            db.accounts[uid].lastUpdate = Date.now();
            DB.saveData(db);
        },

        upsertOrders: (uid, orders) => {
            const db = DB.getData();
            if (!db.orders[uid]) db.orders[uid] = {};
            let newCount = 0;
            orders.forEach(o => {
                if (!db.orders[uid][o.orderSn]) newCount++;
                db.orders[uid][o.orderSn] = o;
            });
            DB.saveData(db);
            return { total: Object.keys(db.orders[uid]).length, added: newCount };
        },

        getOrders: (uid) => {
            const db = DB.getData();
            return db.orders[uid] ? Object.values(db.orders[uid]) : [];
        },

        deleteOrders: (uid, ids) => {
            const db = DB.getData();
            if (db.orders[uid]) {
                ids.forEach(id => delete db.orders[uid][id]);
                DB.saveData(db);
            }
        },

        clearAllOrders: (uid) => {
            const db = DB.getData();
            if (db.orders[uid]) {
                db.orders[uid] = {};
                DB.saveData(db);
            }
        },

        setAlias: (uid, name) => {
            const db = DB.getData();
            if (db.accounts[uid]) {
                db.accounts[uid].alias = name;
                db.accounts[uid].name = name;
                DB.saveData(db);
            }
        }
    };

    // ==========================================
    // 3. UI 样式
    // ==========================================
    GM_addStyle(`
        :root { --primary: #e02e24; --link: #1890ff; --text: #333; --sub: #666; --bg: #f5f7fa; }
        * { box-sizing: border-box; }
        .pdd-toast { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 4px; background: rgba(0,0,0,0.85); color: #fff; font-size: 14px; z-index: 1000001; transition: 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.15); pointer-events: none; }
        #pdd-bar { position: fixed; top: 12px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 50px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 12px; z-index: 999990; font-family: -apple-system, sans-serif; height: 46px; }
        .pdd-logo { font-weight: 800; color: var(--primary); font-size: 15px; margin-right: 4px; }
        .pdd-div { width: 1px; height: 18px; background: #ddd; }
        .pdd-date-group { display: flex; align-items: center; background: #f0f0f0; border-radius: 20px; padding: 4px 12px; height: 32px; }
        .pdd-date-label { font-size: 13px; color: #666; margin-right: 6px; font-weight:600; }
        .pdd-input-date { border: none; background: transparent; font-size: 13px; width: 95px; color: #333; outline: none; cursor: pointer; font-family: inherit; font-weight:600; }
        .pdd-btn-std { border: none; background: transparent; cursor: pointer; padding: 0 16px; height: 32px; font-size: 13px; border-radius: 16px; font-weight: 600; transition: 0.2s; white-space: nowrap; color: #555; display: flex; align-items: center; }
        .pdd-btn-std:hover { background: #eee; color: #333; }
        .pdd-btn-std.primary { background: var(--primary); color: white; box-shadow: 0 2px 8px rgba(224, 46, 36, 0.3); }
        .pdd-btn-std.primary:hover { background: #d02018; transform: translateY(-1px); }
        .pdd-btn-std.blue { background: #e6f7ff; color: var(--link); }
        .pdd-btn-std.blue:hover { background: #bae7ff; }
        .pdd-btn-std.stop { background: #333; color: white; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
        /* 后台样式 */
        #pdd-dash { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg); z-index: 999999; display: none; font-family: -apple-system, sans-serif; color: var(--text); }
        .dash-wrap { display: flex; height: 100%; }
        .dash-side { width: 240px; background: #fff; border-right: 1px solid #e8e8e8; display: flex; flex-direction: column; flex-shrink: 0; }
        .dash-head { height: 60px; display: flex; align-items: center; padding: 0 20px; font-size: 18px; font-weight: 700; color: var(--primary); border-bottom: 1px solid #f0f0f0; }
        .user-list { flex: 1; overflow-y: auto; padding: 12px; }
        .user-item { padding: 12px 14px; border-radius: 8px; cursor: pointer; margin-bottom: 6px; transition: 0.2s; border: 1px solid transparent; display:flex; flex-direction: column; gap: 4px; }
        .user-item:hover { background: #f5f5f5; }
        .user-item.viewing { background: #e6f7ff; border-color: #bae7ff; }
        .user-item.is-current { border-left: 3px solid #52c41a; background: #f6ffed; }
        .u-name { font-weight:600; font-size:14px; }
        .u-id { font-size:12px; color:#999; }
        .u-tag { font-size:11px; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:2px; }
        .tag-online { background:#f6ffed; color:#52c41a; border:1px solid #b7eb8f; }
        .btn-switch-sm { font-size:11px; padding:2px 8px; border:1px solid #d9d9d9; border-radius:4px; background:#fff; cursor:pointer; margin-top:2px; display:inline-block; color:#666; }
        .dash-foot { padding: 15px; border-top: 1px solid #f0f0f0; }
        .btn-block { width: 100%; padding: 10px; background: #fff; border: 1px solid #d9d9d9; border-radius: 6px; text-align: center; color: #666; font-size:13px; cursor: pointer; margin-top: 5px; transition:0.2s; font-weight:600; }
        .btn-block:hover { border-color: var(--link); color: var(--link); }
        .dash-main { flex: 1; padding: 25px; display: flex; flex-direction: column; overflow: hidden; }
        .dash-container { width: 100%; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; flex: 1; overflow: hidden; }
        .main-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; height: 40px; }
        .card { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px; border:1px solid #f0f0f0; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-item { padding-left: 20px; border-left: 3px solid #f0f0f0; }
        .stat-label { font-size: 13px; color: #999; margin-bottom: 6px; }
        .stat-val { font-size: 24px; font-weight: 700; color: #333; line-height: 1.2; }
        .stat-val.money { color: var(--primary); }
        .stat-sub { font-size: 12px; color: #999; margin-top: 4px; }
        .filter-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 15px !important; }
        .ctrl-group { display: flex; align-items: center; border: 1px solid #d9d9d9; border-radius: 6px; overflow: hidden; height: 36px; background:#fff; }
        .ctrl-input { border: none; outline: none; padding: 0 10px; font-size: 13px; height: 100%; color: #333; }
        .ctrl-label { background: #fafafa; padding: 0 12px; font-size: 13px; color: #666; height: 100%; display: flex; align-items: center; border-right: 1px solid #eee; font-weight:600; }
        .ctrl-select { border: none; outline: none; padding: 0 8px; font-size: 13px; height: 100%; background: #fff; cursor: pointer; color:#333; min-width:120px; }
        .btn-sm { height: 36px; padding: 0 16px; font-size: 13px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; display: flex; align-items: center; transition: 0.2s; white-space:nowrap; font-weight:600; }
        .btn-normal { background: #fff; border-color: #d9d9d9; color: #666; }
        .btn-normal:hover { color: var(--link); border-color: var(--link); }
        .btn-primary { background: var(--link); color: #fff; }
        .btn-primary:hover { background: #40a9ff; }
        .btn-success { background: #52c41a; color: #fff; }
        .btn-success:hover { background: #73d13d; }
        .btn-danger { color: #ff4d4f; background: #fff; border-color: #ff4d4f; }
        .btn-danger:hover { background: #fff1f0; }
        .table-wrap { flex: 1; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; border:1px solid #f0f0f0; }
        .pdd-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
        .pdd-table th { text-align: left; padding: 12px 10px; background: #fafafa; color: #555; font-weight: 600; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 10; }
        .pdd-table td { padding: 10px 10px; border-bottom: 1px solid #f8f8f8; vertical-align: middle; color: #333; overflow: hidden; }
        .pdd-table tr:hover { background: #fbfbfb; }
        .goods-name-wrap { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4; max-height: 2.8em; font-weight: 500; }
        .spec-wrap { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; font-size: 12px; color: #666; }
        .thumb { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; border: 1px solid #eee; display:block; }
        .thumb:hover { transform: scale(3); position:relative; z-index:50; cursor:zoom-in; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .tag { padding: 3px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap; }
        .tag-succ { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
        .tag-ref { background: #fffbe6; color: #fa8c16; border: 1px solid #ffe58f; }
        .tag-fail { background: #fff1f0; color: #ff4d4f; border: 1px solid #ffa39e; }
        .tag-gray { background: #f5f5f5; color: #999; border: 1px solid #d9d9d9; }
        .page-bar { padding: 10px 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; align-items: center; gap: 10px; font-size: 13px; background: #fafafa; }
    `);

    // ==========================================
    // 4. 数据拦截
    // ==========================================
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    XHR.open = function(method, url) { this._url = url; return open.apply(this, arguments); };
    XHR.send = function(data) {
        this.addEventListener('load', () => {
            if (this._url && (this._url.includes('orders') || this._url.includes('api')) && this.responseText) {
                try {
                    const res = JSON.parse(this.responseText);
                    const list = res.order_list || res.orders || (res.data && res.data.list) || (res.result && res.result.orders);
                    if (Array.isArray(list) && list.length > 0) {
                        const uid = utils.getUid();
                        if (uid) processData(uid, list);
                    }
                } catch(e) { /* ignore */ }
            }
        });
        return send.apply(this, arguments);
    };

    function processData(uid, list) {
        DB.updateAccount(uid, document.cookie);
        const cleanList = list.map(o => {
            const sn = utils.getSafe(o, ['order_sn', 'orderSn']);
            if (!sn) return null;
            let rawTs = utils.getSafe(o, ['order_time', 'pay_time', 'created_time']);
            let ts = rawTs ? rawTs : Date.now() / 1000;
            if (ts < 10000000000) ts *= 1000;

            const goods = (o.order_goods || o.goods_list || [])[0] || {};
            let amount = utils.getSafe(o, ['pay_amount', 'amount', 'order_amount']);
            if (!amount && amount !== 0) amount = (goods.goods_price || 0) * (goods.goods_number || 1);

            return {
                orderSn: sn, time: ts,
                goodsName: utils.getSafe(goods, ['goods_name', 'goodsName'], '未知商品'),
                goodsImg: utils.getSafe(goods, ['thumb_url', 'hd_thumb_url']),
                spec: utils.getSafe(goods, ['goods_spec', 'spec']),
                price: ((goods.goods_price||0)/100).toFixed(2),
                count: goods.goods_number || 1,
                realPaid: (amount/100).toFixed(2),
                status: utils.getSafe(o, ['status_prompt', 'order_status_prompt', 'display_status'], '未知'),
                link: `https://mobile.pinduoduo.com/goods.html?goods_id=${goods.goods_id}`,
                mall: utils.getSafe(o.mall||{}, ['mall_name'], '店铺')
            };
        }).filter(Boolean);

        const res = DB.upsertOrders(uid, cleanList);

        // 更新全局状态，让滚动器知道有新数据进来
        if (res.new > 0 || res.update > 0) {
            scrollState.lastDataTime = Date.now();
        }

        if (scrollState.active) {
            updateStatus(`已存 ${res.total} 单 (+${res.added})`);
            utils.setTitle(`[🚀 抓取中 ${res.total}条] 拼多多`);
            checkAutoStop(cleanList);
        } else {
            updateStatus(`👀 监听中... (新+${res.added})`);
        }
    }

    // ==========================================
    // 5. 强力自动抓取 (物理触底检测)
    // ==========================================
    let scrollState = { active: false, worker: null, mode: 'range', lastDataTime: 0 };
    let audioContext = null;

    function createWorkerTimer() {
        const blob = new Blob([`
            self.onmessage = function(e) {
                if(e.data === 'start') {
                    setInterval(() => { self.postMessage('tick'); }, 1500);
                }
            };
        `], { type: "text/javascript" });
        return new Worker(URL.createObjectURL(blob));
    }

    function startGhostAudio() {
        if (!audioContext) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
            } catch(e) { return; }
        }
        if (audioContext.state === 'suspended') audioContext.resume();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 18000;
        gain.gain.value = 0.001;
        osc.start();
        setTimeout(() => osc.stop(), 500);
    }

    function checkAutoStop(batch) {
        if (!scrollState.active) return;
        if (scrollState.mode === 'all') return;

        const startDateStr = document.getElementById('pdd-date-start').value;
        if (!startDateStr) return;
        const startTs = new Date(startDateStr).getTime();

        let olderCount = 0;
        batch.forEach(o => { if (o.time < startTs) olderCount++; });

        if (batch.length > 0 && (olderCount > batch.length / 2)) {
            stopScroll();
            utils.toast(`🛑 已到达【${startDateStr}】之前，自动停止`, 'success');
            utils.setTitle(`[✅ 完成] 拼多多`);
        }
    }

    // 核心改进：检测是否物理触底
    function checkIsBottom() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.scrollHeight;
        // 如果 滚动位置 + 窗口高度 >= 页面总高度 - 容错值，说明到底了
        return (scrollTop + windowHeight) >= (bodyHeight - 100);
    }

    // 核心改进：检测是否显示了“到底”的文字
    function checkEndText() {
        const bodyText = document.body.innerText;
        return bodyText.includes('没有更多') || bodyText.includes('到底了') || bodyText.includes('更多订单');
    }

    function startScroll(mode) {
        if (scrollState.active) return;
        scrollState.active = true;
        scrollState.mode = mode;
        scrollState.lastDataTime = Date.now(); // 重置最后数据时间

        document.getElementById('btn-scroll-range').style.display = 'none';
        document.getElementById('btn-scroll-all').style.display = 'none';
        document.getElementById('btn-stop-scroll').style.display = 'flex';
        utils.toast('🚀 强力抓取模式启动！');

        let stuckCount = 0;
        let lastScrollTop = -1;

        if (!scrollState.worker) {
            scrollState.worker = createWorkerTimer();
            scrollState.worker.onmessage = function(e) {
                if (!scrollState.active) return;

                startGhostAudio();

                // 记录滚动前位置
                const currentTop = window.pageYOffset || document.documentElement.scrollTop;

                // 执行滚动
                window.scrollBy(0, -50);
                setTimeout(() => {
                    window.scrollBy(0, 1500);
                    window.dispatchEvent(new Event('scroll'));
                }, 50);

                // 判定逻辑
                const now = Date.now();
                // 1. 物理位置未变（真的滚不动了）
                if (Math.abs(currentTop - lastScrollTop) < 10 && checkIsBottom()) {
                    stuckCount++;
                } else {
                    stuckCount = 0; // 如果动了，重置计数
                    lastScrollTop = currentTop;
                }

                // 2. 连续多次卡在底部，或者长时间没有新数据
                const noNewDataTime = now - scrollState.lastDataTime;

                // 停止条件：
                // A. 连续 6 次卡在底部，且页面有“没有更多”字样
                // B. 连续 10 次卡在底部（即使没字样，可能也是真到底了）
                // C. 抓取全部模式下，超过 20秒 没有新数据入库，且处于底部

                if (stuckCount > 6 && checkEndText()) {
                    stopScroll();
                    utils.toast('🎉 检测到底部标志，抓取完成');
                    utils.setTitle(`[✅ 完成] 拼多多`);
                } else if (stuckCount > 10) {
                    stopScroll();
                    utils.toast('🎉 无法继续滚动，抓取完成');
                    utils.setTitle(`[✅ 完成] 拼多多`);
                } else if (scrollState.mode === 'all' && noNewDataTime > 20000 && checkIsBottom()) {
                    stopScroll();
                    utils.toast('🎉 长时间无新数据，抓取完成');
                    utils.setTitle(`[✅ 完成] 拼多多`);
                }
            };
        }
        scrollState.worker.postMessage('start');
    }

    function stopScroll() {
        scrollState.active = false;
        if (scrollState.worker) {
            scrollState.worker.terminate();
            scrollState.worker = null;
        }
        if (audioContext) { audioContext.close(); audioContext = null; }
        utils.setTitle("拼多多订单管理");

        document.getElementById('btn-scroll-range').style.display = 'flex';
        document.getElementById('btn-scroll-all').style.display = 'flex';
        document.getElementById('btn-stop-scroll').style.display = 'none';
        updateStatus('就绪 (等待操作)');
    }

    function updateStatus(txt) {
        const el = document.getElementById('pdd-status-txt');
        if(el) el.innerText = txt;
    }

    // ==========================================
    // 6. UI 初始化
    // ==========================================
    let viewingUid = null;
    let currentPage = 1;
    let activeFilter = { start: 0, end: Infinity, keyword: '', status: 'all' };

    function init() {
        if (!location.href.includes('orders.html')) return;
        if (document.getElementById('pdd-bar')) return;

        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);

        const bar = document.createElement('div');
        bar.id = 'pdd-bar';
        bar.innerHTML = `
            <div class="pdd-logo">🛒 助手</div>
            <div class="pdd-div"></div>
            <div class="pdd-date-group">
                <span class="pdd-date-label">范围</span>
                <input type="date" id="pdd-date-start" class="pdd-input-date" value="${utils.formatDateInput(lastYear)}" title="停止条件：订单早于此日期">
                <span style="color:#ccc; margin:0 4px;">-</span>
                <input type="date" id="pdd-date-end" class="pdd-input-date" value="${utils.formatDateInput(today)}">
            </div>
            <div class="pdd-div"></div>

            <button id="btn-scroll-range" class="pdd-btn-std primary">📅 抓取范围</button>
            <button id="btn-scroll-all" class="pdd-btn-std blue" style="margin-left:8px;" title="无视日期，抓取所有历史订单">🚀 抓取全部</button>
            <button id="btn-stop-scroll" class="pdd-btn-std stop" style="display:none;">⏸ 停止</button>

            <button id="btn-dash" class="pdd-btn-std">📊 后台</button>
            <span id="pdd-status-txt" style="font-size:12px; color:#999; margin-left:6px; min-width:60px;">就绪</span>
        `;
        document.body.appendChild(bar);

        // Dashboard
        const dash = document.createElement('div');
        dash.id = 'pdd-dash';
        dash.innerHTML = `
            <div class="dash-wrap">
                <div class="dash-side">
                    <div class="dash-head">PDD Manager</div>
                    <div id="user-list" class="user-list"></div>
                    <div class="dash-foot">
                        <button class="btn-block" id="btn-add-acc">➕ 添加新账号</button>
                        <button class="btn-block" id="btn-close" style="color:#999; border-color:#eee;">❌ 关闭后台</button>
                    </div>
                </div>
                <div class="dash-main">
                    <div class="dash-container">
                        <div class="main-head">
                            <div style="font-size:18px; font-weight:700; color:#333;" id="dash-title">请选择账号</div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn-sm btn-normal" id="btn-rename">✏️ 改名</button>
                                <button class="btn-sm btn-danger" id="btn-clear-all">⚠️ 清空</button>
                            </div>
                        </div>
                        <div class="card" id="stat-card" style="display:none;">
                            <div class="stat-grid">
                                <div class="stat-item">
                                    <div class="stat-label">总消费 (实付)</div>
                                    <div class="stat-val money" id="stat-money">¥0.00</div>
                                    <div class="stat-sub">剔除退款: <span id="stat-refund-amt">¥0</span></div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">订单总数</div>
                                    <div class="stat-val" id="stat-count">0</div>
                                    <div class="stat-sub">客单价: <span id="stat-avg">¥0</span></div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">成交订单</div>
                                    <div class="stat-val" style="color:#52c41a" id="stat-succ">0</div>
                                    <div class="stat-sub">发货/签收</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">退款/失效</div>
                                    <div class="stat-val" style="color:#fa8c16" id="stat-fail">0</div>
                                    <div class="stat-sub">售后/取消</div>
                                </div>
                            </div>
                        </div>
                        <div class="card filter-bar" id="filter-card" style="display:none; padding:15px;">
                            <div class="ctrl-group" style="width:160px;">
                                <input type="text" id="search-keyword" class="ctrl-input" placeholder="🔍 商品名称..." style="width:100%;">
                            </div>
                            <div class="ctrl-group">
                                <span class="ctrl-label">状态</span>
                                <select id="filter-status" class="ctrl-select">
                                    <option value="all">全部状态</option>
                                    <option value="succ">✅ 成交 (发货/签收)</option>
                                    <option value="refund">↩️ 退款/售后</option>
                                    <option value="fail">🚫 取消/拼单失败</option>
                                </select>
                            </div>
                            <div class="ctrl-group">
                                <span class="ctrl-label">日期</span>
                                <input type="date" id="filter-start" class="ctrl-input">
                                <span style="color:#ccc; font-size:12px;">-</span>
                                <input type="date" id="filter-end" class="ctrl-input">
                            </div>
                            <div style="flex:1"></div>
                            <button class="btn-sm btn-primary" id="btn-search">筛选</button>
                            <button class="btn-sm btn-normal" id="btn-reset">重置</button>
                            <div style="width:1px; height:20px; background:#e8e8e8; margin:0 8px;"></div>
                            <button class="btn-sm btn-success" id="btn-export-range">导出结果</button>
                            <button class="btn-sm btn-normal" id="btn-export-all">导出全部</button>
                        </div>
                        <div class="table-wrap" id="table-wrap" style="display:none;">
                            <div style="padding:12px 15px; border-bottom:1px solid #f0f0f0; display:flex; justify-content:space-between; align-items:center; background:#fafafa;">
                                <div style="display:flex; gap:8px; align-items:center;">
                                    <input type="checkbox" id="chk-all" class="chk-input">
                                    <span style="font-size:13px; color:#666;">全选</span>
                                    <button id="btn-del-sel" class="btn-sm btn-danger" style="height:28px; padding:0 10px; display:none;">删除选中</button>
                                </div>
                                <span style="font-size:12px; color:#999;">每页 ${CONFIG.pageSize} 条</span>
                            </div>
                            <div style="flex:1; overflow-y:auto;">
                                <table class="pdd-table">
                                    <thead><tr>
                                        <th style="width:40px"></th>
                                        <th style="width:60px">图</th>
                                        <th style="width:130px">下单时间</th>
                                        <th>商品</th>
                                        <th style="width:200px">规格</th>
                                        <th style="width:100px">实付</th>
                                        <th style="width:100px">状态</th>
                                    </tr></thead>
                                    <tbody id="table-body"></tbody>
                                </table>
                            </div>
                            <div class="page-bar">
                                <span id="page-info">1/1</span>
                                <button class="btn-sm btn-normal" id="btn-prev">上一页</button>
                                <button class="btn-sm btn-normal" id="btn-next">下一页</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dash);

        // Bindings
        el('btn-scroll-range').onclick = () => startScroll('range');
        el('btn-scroll-all').onclick = () => startScroll('all');
        el('btn-stop-scroll').onclick = stopScroll;
        el('btn-dash').onclick = openDash;
        el('btn-close').onclick = () => dash.style.display = 'none';
        el('btn-add-acc').onclick = switchAcc;
        el('btn-rename').onclick = renameAcc;
        el('btn-search').onclick = applyFilter;
        el('btn-reset').onclick = resetFilter;
        el('btn-export-range').onclick = exportRange;
        el('btn-export-all').onclick = exportAll;
        el('btn-clear-all').onclick = clearAll;
        el('btn-prev').onclick = () => changePage(-1);
        el('btn-next').onclick = () => changePage(1);
        el('chk-all').onclick = toggleAll;
        el('btn-del-sel').onclick = deleteSelected;
    }

    const el = (id) => document.getElementById(id);

    // Dashboard UI (Same as v18/25)
    function openDash() {
        document.getElementById('pdd-dash').style.display = 'block';
        document.getElementById('filter-start').value = document.getElementById('pdd-date-start').value;
        document.getElementById('filter-end').value = document.getElementById('pdd-date-end').value;
        activeFilter = { start: 0, end: Infinity, keyword: '', status: 'all' };
        renderSide();
    }

    function renderSide() {
        const db = DB.getData();
        const list = document.getElementById('user-list');
        list.innerHTML = '';
        const onlineUid = utils.getUid();
        const users = Object.values(db.accounts);
        users.forEach(acc => {
            const isOnline = (acc.id === onlineUid);
            const isViewing = (acc.id === viewingUid);
            const el = document.createElement('div');
            el.className = `user-item ${isViewing ? 'viewing' : ''} ${isOnline ? 'is-current' : ''}`;
            el.innerHTML = `<div style="display:flex;justify-content:space-between;"><span class="u-name">${acc.name}</span><span class="u-id">ID:${acc.id.slice(-4)}</span></div><div>${isOnline ? `<span class="u-tag tag-online">🟢 当前在线</span>` : `<span class="btn-switch-sm">🔁 切换</span>`}</div>`;
            el.onclick = () => { viewingUid = acc.id; currentPage = 1; resetFilterUI(); renderSide(); renderMain(); };
            const switchBtn = el.querySelector('.btn-switch-sm');
            if(switchBtn) { switchBtn.onclick = (e) => { e.stopPropagation(); switchAcc(); }; }
            list.appendChild(el);
        });
        if (!viewingUid && users.length > 0) { viewingUid = onlineUid || users[0].id; renderSide(); renderMain(); }
    }

    function renderMain() {
        if (!viewingUid) return;
        document.getElementById('stat-card').style.display = 'block';
        document.getElementById('filter-card').style.display = 'flex';
        document.getElementById('table-wrap').style.display = 'flex';
        const db = DB.getData();
        document.getElementById('dash-title').innerText = db.accounts[viewingUid].name;
        const kw = activeFilter.keyword.toLowerCase();
        const st = activeFilter.status;
        const allFiltered = DB.getOrders(viewingUid).filter(o => o.time >= activeFilter.start && o.time < activeFilter.end).filter(o => {
            if (kw && !o.goodsName.toLowerCase().includes(kw) && !o.mall.toLowerCase().includes(kw)) return false;
            if (st !== 'all') {
                const isRef = o.status.includes('退') || o.status.includes('售后');
                const isFail = o.status.includes('取消') || o.status.includes('失败') || o.status.includes('关闭') || o.status.includes('未支付');
                const isSucc = !isRef && !isFail;
                if (st === 'succ' && !isSucc) return false;
                if (st === 'refund' && !isRef) return false;
                if (st === 'fail' && !isFail) return false;
            }
            return true;
        }).sort((a,b) => b.time - a.time);

        calcStats(allFiltered);
        const total = allFiltered.length;
        const maxPage = Math.ceil(total / CONFIG.pageSize) || 1;
        if (currentPage > maxPage) currentPage = maxPage;
        if (currentPage < 1) currentPage = 1;
        const start = (currentPage - 1) * CONFIG.pageSize;
        const pageList = allFiltered.slice(start, start + CONFIG.pageSize);

        const tbody = document.getElementById('table-body');
        tbody.innerHTML = '';
        document.getElementById('chk-all').checked = false;
        checkSelection();

        pageList.forEach(o => {
            const tr = document.createElement('tr');
            let tagClass = 'tag-gray';
            if (o.status.includes('退') || o.status.includes('售后')) tagClass = 'tag-ref';
            else if (o.status.includes('失败') || o.status.includes('取消') || o.status.includes('关闭')) tagClass = 'tag-fail';
            else tagClass = 'tag-succ';
            const dateObj = utils.tsToDateObj(o.time);
            tr.innerHTML = `<td><input type="checkbox" class="chk-input chk-item" value="${o.orderSn}"></td><td><img src="${o.goodsImg}" class="thumb"></td><td><div style="font-weight:600;color:#333;">${dateObj.d}</div><div style="font-size:11px;color:#999;">${dateObj.t}</div><div style="font-size:10px;color:#bbb;margin-top:2px;">${o.orderSn}</div></td><td><div style="font-weight:600;color:#333;margin-bottom:2px;">${o.mall}</div><div class="goods-name-wrap" title="${o.goodsName}"><a href="${o.link}" target="_blank" style="color:#666;text-decoration:none;">${o.goodsName}</a></div></td><td><div class="spec-wrap" title="${o.spec}">${o.spec}</div></td><td style="color:#e02e24;font-weight:bold;">￥${o.realPaid}</td><td><span class="tag ${tagClass}">${o.status}</span></td>`;
            tbody.appendChild(tr);
        });
        document.querySelectorAll('.chk-item').forEach(c => c.onclick = checkSelection);
        document.getElementById('page-info').innerText = `${currentPage} / ${maxPage} (共${total}条)`;
    }

    function calcStats(orders) {
        let totalMoney = 0; let refundMoney = 0; let succCount = 0; let failCount = 0;
        orders.forEach(o => {
            const amt = parseFloat(o.realPaid) || 0;
            const isRef = o.status.includes('退') || o.status.includes('售后');
            const isFail = o.status.includes('失败') || o.status.includes('取消') || o.status.includes('关闭') || o.status.includes('未支付');
            if (isRef || isFail) { failCount++; if (isRef) refundMoney += amt; } else { succCount++; totalMoney += amt; }
        });
        document.getElementById('stat-money').innerText = '¥' + totalMoney.toFixed(2);
        document.getElementById('stat-refund-amt').innerText = '¥' + refundMoney.toFixed(2);
        document.getElementById('stat-count').innerText = orders.length;
        document.getElementById('stat-succ').innerText = succCount;
        document.getElementById('stat-fail').innerText = failCount;
        const avg = succCount > 0 ? (totalMoney / succCount).toFixed(2) : "0.00";
        document.getElementById('stat-avg').innerText = `¥${avg}`;
    }

    function applyFilter() {
        const s = document.getElementById('filter-start').value;
        const e = document.getElementById('filter-end').value;
        if(!s || !e) return utils.toast('请选择完整日期', 'error');
        activeFilter = { start: new Date(s).getTime(), end: new Date(e).getTime() + 86400000, keyword: document.getElementById('search-keyword').value.trim(), status: document.getElementById('filter-status').value };
        currentPage = 1; renderMain(); utils.toast('筛选已更新');
    }
    function resetFilter() { resetFilterUI(); renderMain(); utils.toast('筛选已重置'); }
    function resetFilterUI() {
        activeFilter = { start: 0, end: Infinity, keyword: '', status: 'all' };
        document.getElementById('filter-start').value = document.getElementById('pdd-date-start').value;
        document.getElementById('filter-end').value = document.getElementById('pdd-date-end').value;
        document.getElementById('search-keyword').value = '';
        document.getElementById('filter-status').value = 'all';
        currentPage = 1;
    }
    function exportRange() {
        const kw = activeFilter.keyword.toLowerCase(); const st = activeFilter.status;
        const list = DB.getOrders(viewingUid).filter(o => o.time >= activeFilter.start && o.time < activeFilter.end).filter(o => {
            if (kw && !o.goodsName.toLowerCase().includes(kw) && !o.mall.toLowerCase().includes(kw)) return false;
            if (st !== 'all') { /* same logic as renderMain */ return true; } return true;
        }).sort((a,b) => b.time - a.time);
        if (!list.length) return utils.toast('当前筛选结果为空', 'error');
        downloadCSV(list, '筛选结果');
    }
    function exportAll() { const list = DB.getOrders(viewingUid).sort((a,b) => b.time - a.time); if (!list.length) return utils.toast('暂无数据', 'error'); downloadCSV(list, '全部历史数据'); }
    function downloadCSV(list, suffix) {
        let csv = `订单号,时间,店铺,商品,规格,数量,实付,状态,链接\n`;
        const q = t => `"${String(t||'').replace(/"/g, '""')}"`;
        list.forEach(o => csv += `${q(o.orderSn)},${q(utils.tsToDate(o.time))},${q(o.mall)},${q(o.goodsName)},${q(o.spec)},${o.count},${o.realPaid},${q(o.status)},${q(o.link)}\n`);
        const url = URL.createObjectURL(new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8'}));
        const a = document.createElement('a'); a.href = url; a.download = `PDD_${document.getElementById('dash-title').innerText}_${suffix}.csv`; a.click();
    }
    function toggleAll() { const c = document.getElementById('chk-all').checked; document.querySelectorAll('.chk-item').forEach(i => i.checked = c); checkSelection(); }
    function checkSelection() { const n = document.querySelectorAll('.chk-item:checked').length; const b = document.getElementById('btn-del-sel'); b.style.display = n > 0 ? 'block' : 'none'; b.innerText = `删除选中 (${n})`; }
    function deleteSelected() { const ids = Array.from(document.querySelectorAll('.chk-item:checked')).map(c => c.value); if(ids.length && confirm(`删除 ${ids.length} 条记录？`)) { DB.deleteOrders(viewingUid, ids); renderMain(); utils.toast('删除成功'); } }
    function clearAll() { if(confirm('⚠️ 清空该账号所有数据？')) { DB.clearAllOrders(viewingUid); renderMain(); utils.toast('已清空'); } }
    function changePage(d) { currentPage += d; renderMain(); }
    function renameAcc() { const n = prompt('新名称:'); if(n) { DB.setAlias(viewingUid, n); renderSide(); renderMain(); } }
    function switchAcc() { if(confirm('退出并跳转登录页？')) { utils.forceLogout(); location.href = "https://mobile.pinduoduo.com/login.html?from=orders_script"; } }

    setTimeout(init, 1000);
})();