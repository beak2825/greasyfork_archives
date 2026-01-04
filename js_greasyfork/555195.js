// ==UserScript==
// @name         HackMyVM 小工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  集成国旗替换、时间统计图表、时区转换、快速导航、保持登录
// @author       webadmin
// @match        https://hackmyvm.eu/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555195/HackMyVM%20%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555195/HackMyVM%20%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const countryMap = {
        'cn': '中国', 'us': '美国', 'jp': '日本', 'kr': '韩国', 'gb': '英国',
        'fr': '法国', 'de': '德国', 'it': '意大利', 'es': '西班牙', 'ru': '俄罗斯',
        'in': '印度', 'br': '巴西', 'ca': '加拿大', 'au': '澳大利亚', 'mx': '墨西哥',
        'ar': '阿根廷', 'za': '南非', 'eg': '埃及', 'tr': '土耳其', 'sa': '沙特',
        'ae': '阿联酋', 'th': '泰国', 'vn': '越南', 'sg': '新加坡', 'my': '马来西亚',
        'id': '印尼', 'ph': '菲律宾', 'cu': '古巴', 'nl': '荷兰', 'be': '比利时',
        'ch': '瑞士', 'at': '奥地利', 'se': '瑞典', 'no': '挪威', 'dk': '丹麦',
        'fi': '芬兰', 'pl': '波兰', 'cz': '捷克', 'hu': '匈牙利', 'ro': '罗马尼亚',
        'bg': '保加利亚', 'hr': '克罗地亚', 'rs': '塞尔维亚', 'ua': '乌克兰',
        'by': '白俄罗斯', 'lt': '立陶宛', 'lv': '拉脱维亚', 'ee': '爱沙尼亚',
        'ie': '爱尔兰', 'pt': '葡萄牙', 'gr': '希腊', 'il': '以色列', 'ir': '伊朗',
        'iq': '伊拉克', 'sy': '叙利亚', 'lb': '黎巴嫩', 'jo': '约旦', 'kw': '科威特',
        'qa': '卡塔尔', 'bh': '巴林', 'om': '阿曼', 'ye': '也门', 'pk': '巴基斯坦',
        'bd': '孟加拉', 'lk': '斯里兰卡', 'mm': '缅甸', 'kh': '柬埔寨', 'la': '老挝',
        'mn': '蒙古', 'kz': '哈萨克', 'uz': '乌兹别克', 'kg': '吉尔吉斯',
        'tj': '塔吉克', 'tm': '土库曼', 'af': '阿富汗', 'np': '尼泊尔', 'bt': '不丹',
        'mv': '马尔代夫', 'nz': '新西兰', 'fj': '斐济', 'pg': '巴新', 'sb': '所罗门',
        'vu': '瓦努阿图', 'to': '汤加', 'ws': '萨摩亚', 'ki': '基里巴斯',
        'tv': '图瓦卢', 'nr': '瑙鲁', 'pw': '帛琉', 'fm': '密克罗尼西亚', 'mh': '马绍尔'
    };

    function replaceFlags() {
    document.querySelectorAll('img[src*="/flags/"], img[src*="flags/"]').forEach(img => {
        const match = img.src.match(/flags\/([a-z]{2})\.svg/i);
        if (match) {
            const code = match[1].toLowerCase();
            const name = countryMap[code] || code.toUpperCase();
            const span = document.createElement('span');
            span.textContent = name;
            span.className = img.className;
            const cs = window.getComputedStyle(img);
            span.style.cssText = `display:inline-block!important;padding:2px 6px!important;background:#f8f9fa!important;border:1px solid #dee2e6!important;border-radius:4px!important;font-size:11px!important;font-weight:500!important;color:#495057!important;line-height:1.2!important;text-align:center!important;white-space:nowrap!important;vertical-align:middle!important;min-width:24px!important;text-shadow:none!important;box-shadow:none!important;-webkit-box-reflect:none!important;filter:none!important;margin:${cs.margin};margin-left:${cs.marginLeft};margin-right:${cs.marginRight};margin-top:${cs.marginTop};margin-bottom:${cs.marginBottom}`;
            img.parentNode.replaceChild(span, img);
            }
        });
    }


    function parseTimes() {
        const cb = document.querySelector('.card-body');
        if (!cb) return null;
        const times = [];
        cb.innerHTML.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g)?.forEach(t => times.push(new Date(t)));
        return times;
    }

    function calcHourStats(times) {
        const hrs = new Array(24).fill(0);
        times.forEach(t => hrs[new Date(t.getTime() + 8 * 3600000).getHours()]++);
        return hrs;
    }

    function calcDateStats(times) {
        const dc = {}, l30 = [], td = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(td);
            d.setDate(td.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            l30.push(ds);
            dc[ds] = 0;
        }
        times.forEach(t => {
            const ds = t.toISOString().split('T')[0];
            if (dc.hasOwnProperty(ds)) dc[ds]++;
        });
        return { dates: l30, counts: l30.map(d => dc[d]) };
    }

    function findPeak(arr) {
        let mx = 0, idx = 0;
        arr.forEach((v, i) => { if (v > mx) { mx = v; idx = i; } });
        return idx;
    }

    function createChart() {
        const times = parseTimes();
        if (!times || times.length === 0) return;
        const tgt = document.querySelector('.col-md-8.col-12');
        if (!tgt) return;
        document.getElementById('time-stats-container')?.remove();
        const hrs = calcHourStats(times);
        const dts = calcDateStats(times);
        const div = document.createElement('div');
        div.id = 'time-stats-container';
        div.style.cssText = 'background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:20px;padding:20px;border:1px solid #e0e0e0';
        div.innerHTML = `<h4 style="margin-bottom:20px;color:#333;text-align:center">🎯 打靶时间分布统计 (共${times.length}次提交)</h4><div style="display:flex;gap:20px"><div style="flex:1"><h5 style="text-align:center;margin-bottom:15px;color:#666">24小时分布 (北京时间)</h5><canvas id="hourChart" width="400" height="300"></canvas></div><div style="flex:1"><h5 style="text-align:center;margin-bottom:15px;color:#666">最近30天分布</h5><canvas id="dateChart" width="400" height="300"></canvas></div></div><div style="margin-top:15px;text-align:center;color:#888;font-size:12px">峰值时间: ${findPeak(hrs)}:00-${findPeak(hrs) + 1}:00 | 最活跃日期: ${dts.dates[findPeak(dts.counts)] || '无'}</div>`;
        tgt.insertBefore(div, tgt.firstChild);
        new Chart(document.getElementById('hourChart').getContext('2d'), {
            type: 'line',
            data: { labels: Array.from({length: 24}, (_, i) => `${i}:00`), datasets: [{ label: '提交次数', data: hrs, borderColor: '#ff6b6b', backgroundColor: 'rgba(255,107,107,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#ff6b6b', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } }
        });
        new Chart(document.getElementById('dateChart').getContext('2d'), {
            type: 'line',
            data: { labels: dts.dates.map(d => d.substring(5)), datasets: [{ label: '提交次数', data: dts.counts, borderColor: '#4ecdc4', backgroundColor: 'rgba(78,205,196,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#4ecdc4', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { ticks: { maxTicksLimit: 10 } } }, plugins: { legend: { display: false } } }
        });
    }

    function convertTime() {
        const vmt = document.querySelector('h1.vmtitle2, .vmtitle2');
        if (!vmt) return;
        const span = vmt.querySelector('span');
        if (!span) return;
        const m = span.textContent.trim().match(/(\d{1,2})\w*\s+(\w+)\s+(\d{1,2}):(\d{2})\s+(\w+)/i);
        if (!m) return;
        const mons = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
        const tzs = { CET: 1, CEST: 2, EST: -5, EDT: -4, PST: -8, PDT: -7, GMT: 0, UTC: 0, BST: 1, JST: 9, CST: 8 };
        const mon = mons[m[2].toLowerCase()];
        if (mon === undefined) return;
        const off = tzs[m[5].toUpperCase()] || 0;
        const utc = new Date(new Date().getFullYear(), mon, parseInt(m[1]), parseInt(m[3]) - off, parseInt(m[4]));
        const bjt = new Date(utc.getTime() + 8 * 3600000);
        document.getElementById('bj-time-display')?.remove();
        const bd = document.createElement('div');
        bd.id = 'bj-time-display';
        bd.style.cssText = 'background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:10px 15px;border-radius:6px;margin-top:10px;font-weight:bold;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.2);border-left:4px solid #ff6b6b';
        bd.innerHTML = `🕐 ${bjt.getMonth() + 1}月${bjt.getDate()}日 ${String(bjt.getHours()).padStart(2, '0')}:${String(bjt.getMinutes()).padStart(2, '0')} 北京时间`;
        vmt.parentNode.insertBefore(bd, vmt.nextSibling);
    }

    function navNext() {
        const m = location.href.match(/c=(\d+)/);
        if (m) location.href = location.href.replace(/c=\d+/, 'c=' + String(parseInt(m[1]) + 1).padStart(3, '0'));
    }

    replaceFlags();
    if (/profile\/\?user=/.test(location.href)) {
        typeof Chart !== 'undefined' ? createChart() : setTimeout(() => typeof Chart !== 'undefined' && createChart(), 100);
    }
    setTimeout(convertTime, 100);

    if (/challenges\/challenge\.php\?c=/.test(location.href)) {
        document.addEventListener('mouseup', e => e.button === 4 && navNext());
        document.addEventListener('keydown', e => e.key === 'ArrowRight' && navNext());
    }

    const obs = new MutationObserver(muts => {
        let flag = false, chart = false, time = false;
        muts.forEach(mut => {
            if (mut.type === 'childList' && mut.addedNodes.length > 0) {
                flag = true;
                mut.addedNodes.forEach(n => {
                    if (n.nodeType === 1) {
                        if (n.classList?.contains('card-body') || n.querySelector?.('.card-body')) chart = true;
                        if (n.classList?.contains('vmtitle2') || n.querySelector?.('.vmtitle2')) time = true;
                    }
                });
            }
        });
        if (flag) setTimeout(replaceFlags, 100);
        if (chart) setTimeout(() => typeof Chart !== 'undefined' && createChart(), 200);
        if (time) setTimeout(convertTime, 100);
    });
    obs.observe(document.body, { childList: true, subtree: true });

    setInterval(() => location.reload(), 300000);
})();