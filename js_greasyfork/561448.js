// ==UserScript==
// @name         [Bilibili] 批量移除粉丝
// @namespace    bilibili-fans-cleaner-v3
// @version      1.2.0
// @description  批量移除B站粉丝，清理僵尸粉
// @author       Modified based on CKylinMC
// @match        https://space.bilibili.com/*
// @connect      api.bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/561448/%5BBilibili%5D%20%E6%89%B9%E9%87%8F%E7%A7%BB%E9%99%A4%E7%B2%89%E4%B8%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/561448/%5BBilibili%5D%20%E6%89%B9%E9%87%8F%E7%A7%BB%E9%99%A4%E7%B2%89%E4%B8%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- MD5 算法 ---
    const md5 = function (d) {
        var r = Array(d.length >> 2);
        for (var i = 0; i < r.length; i++) r[i] = 0;
        for (var i = 0; i < d.length; i++) r[i >> 2] |= (d.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
        var k = [];
        for (var i = 0; i < r.length * 32; i += 8) k.push((r[i >> 5] >>> (i % 32)) & 0xFF);
        function md5_cmn(q, a, b, x, s, t) { return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b); }
        function md5_ff(a, b, c, d, x, s, t) { return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); }
        function md5_gg(a, b, c, d, x, s, t) { return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); }
        function md5_hh(a, b, c, d, x, s, t) { return md5_cmn(b ^ c ^ d, a, b, x, s, t); }
        function md5_ii(a, b, c, d, x, s, t) { return md5_cmn(c ^ (b | (~d)), a, b, x, s, t); }
        function safe_add(x, y) { var lsw = (x & 0xFFFF) + (y & 0xFFFF); var msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); }
        function bit_rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
        function hex_md5(s) {
            var x = Array(); var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22; var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23; var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            for (var i = 0; i < s.length * 8; i += 8) x[i >> 5] |= (s.charCodeAt(i / 8) & 0xFF) << (i % 32);
            var len = s.length * 8; x[len >> 5] |= 0x80 << ((len) % 32); x[(((len + 64) >>> 9) << 4) + 14] = len;
            a = 1732584193; b = -271733879; c = -1732584194; d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a; var oldb = b; var oldc = c; var oldd = d;
                a = md5_ff(a, b, c, d, x[i + 0], S11, -680876936); d = md5_ff(d, a, b, c, x[i + 1], S12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], S13, 606105819); b = md5_ff(b, c, d, a, x[i + 3], S14, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], S11, -176418897); d = md5_ff(d, a, b, c, x[i + 5], S12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], S13, -1473231341); b = md5_ff(b, c, d, a, x[i + 7], S14, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], S11, 1770035416); d = md5_ff(d, a, b, c, x[i + 9], S12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], S13, -42063); b = md5_ff(b, c, d, a, x[i + 11], S14, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], S11, 1804603682); d = md5_ff(d, a, b, c, x[i + 13], S12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], S13, -1502002290); b = md5_ff(b, c, d, a, x[i + 15], S14, 1236535329);
                a = md5_gg(a, b, c, d, x[i + 1], S21, -165796510); d = md5_gg(d, a, b, c, x[i + 6], S22, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], S23, 643717713); b = md5_gg(b, c, d, a, x[i + 0], S24, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], S21, -701558691); d = md5_gg(d, a, b, c, x[i + 10], S22, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], S23, -660478335); b = md5_gg(b, c, d, a, x[i + 4], S24, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], S21, 568446438); d = md5_gg(d, a, b, c, x[i + 14], S22, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], S23, -187363961); b = md5_gg(b, c, d, a, x[i + 8], S24, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], S21, -1444681467); d = md5_gg(d, a, b, c, x[i + 2], S22, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], S23, 1735328473); b = md5_gg(b, c, d, a, x[i + 12], S24, -1926607734);
                a = md5_hh(a, b, c, d, x[i + 5], S31, -378558); d = md5_hh(d, a, b, c, x[i + 8], S32, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], S33, 1839030562); b = md5_hh(b, c, d, a, x[i + 14], S34, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], S31, -1530992060); d = md5_hh(d, a, b, c, x[i + 4], S32, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], S33, -155497632); b = md5_hh(b, c, d, a, x[i + 10], S34, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], S31, 681279174); d = md5_hh(d, a, b, c, x[i + 0], S32, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], S33, -722521979); b = md5_hh(b, c, d, a, x[i + 6], S34, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], S31, -640364487); d = md5_hh(d, a, b, c, x[i + 12], S32, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], S33, 530742520); b = md5_hh(b, c, d, a, x[i + 2], S34, -995338651);
                a = md5_ii(a, b, c, d, x[i + 0], S41, -198630844); d = md5_ii(d, a, b, c, x[i + 7], S42, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], S43, -1416354905); b = md5_ii(b, c, d, a, x[i + 5], S44, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], S41, 1700485571); d = md5_ii(d, a, b, c, x[i + 3], S42, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], S43, -1051523); b = md5_ii(b, c, d, a, x[i + 1], S44, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], S41, 1873313359); d = md5_ii(d, a, b, c, x[i + 15], S42, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], S43, -1560198380); b = md5_ii(b, c, d, a, x[i + 13], S44, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], S41, -145523070); d = md5_ii(d, a, b, c, x[i + 11], S42, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], S43, 718787259); b = md5_ii(b, c, d, a, x[i + 9], S44, -343485551);
                a = safe_add(a, olda); b = safe_add(b, oldb); c = safe_add(c, oldc); d = safe_add(d, oldd);
            }
            var str = "";
            for (var i = 0; i < 4; i++) {
                 var v = [a, b, c, d][i];
                 for(var j=0; j<4; j++) {
                     var byte = (v >>> (j * 8)) & 0xFF;
                     var h = byte.toString(16);
                     if (h.length === 1) h = '0' + h;
                     str += h;
                 }
            }
            return str;
        }
        return hex_md5(d);
    };

    // --- 核心配置 ---
    const cfg = {
        VERSION: "1.2.0",
        delay: 800,
        retrial: 3
    };

    const datas = {
        mid: 0,
        fans: [],
        checked: [],
        wbiKeys: null,
        csrf: null
    };

    const get = q => document.querySelector(q);
    const getAll = q => document.querySelectorAll(q);
    const wait = t => new Promise(r => setTimeout(r, t));

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // --- Wbi 签名核心 ---
    const mixinKeyEncTab = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ];

    function getMixinKey(orig) {
        let temp = '';
        mixinKeyEncTab.forEach((n) => { temp += orig[n]; });
        return temp.slice(0, 32);
    }

    function encWbi(params, img_key, sub_key) {
        const mixin_key = getMixinKey(img_key + sub_key),
            curr_time = Math.round(Date.now() / 1000),
            chr_filter = /[!'()*]/g;
        let query = [];
        Object.assign(params, { wts: curr_time });
        Object.keys(params).sort().forEach((key) => {
            query.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    params[key].toString().replace(chr_filter, '')
                )}`
            );
        });
        let querystr = query.join('&');
        const wbi_sign = md5(querystr + mixin_key);
        return querystr + '&w_rid=' + wbi_sign;
    }

    async function getWbiKeys() {
        // 重要：添加 credentials: 'include' 解决跨域 -101 问题
        const resp = await fetch('https://api.bilibili.com/x/web-interface/nav', {
            credentials: 'include',
            cache: 'no-store'
        });
        const json_content = await resp.json();
        const img_url = json_content.data.wbi_img.img_url;
        const sub_url = json_content.data.wbi_img.sub_url;
        return {
            img_key: img_url.slice(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.')),
            sub_key: sub_url.slice(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'))
        };
    }

    async function fetchFans(pn = 1) {
        if (!datas.wbiKeys) datas.wbiKeys = await getWbiKeys();

        const params = {
            vmid: datas.mid,
            pn: pn,
            ps: 50,
            order: 'desc',
            order_type: 'attention'
        };

        const query = encWbi(params, datas.wbiKeys.img_key, datas.wbiKeys.sub_key);
        const url = `https://api.bilibili.com/x/relation/followers?${query}`;

        // 重要：添加 credentials: 'include' 解决跨域 -101 问题
        const res = await fetch(url, { credentials: 'include' });
        return await res.json();
    }

    async function kickFan(fid) {
        const body = new URLSearchParams({
            fid: fid,
            act: 7,
            re_src: 11,
            csrf: datas.csrf
        });

        // 重要：添加 credentials: 'include' 解决跨域 -101 问题
        const res = await fetch('https://api.bilibili.com/x/relation/modify', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include'
        });
        return await res.json();
    }

    // --- UI 相关 ---
    const addStyle = (css) => {
        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    const styles = `
        #BK-floatbtn { position: fixed; right: 0; top: 40vh; width: 40px; height: 40px; background: #333; color: #fff; border-radius: 5px 0 0 5px; cursor: pointer; z-index: 9999; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: 0.3s; }
        #BK-floatbtn:hover { background: #00a1d6; width: 120px; }
        #BK-floatbtn::after { content: "粉丝清理"; font-size: 14px; margin-left: 5px; display: none; }
        #BK-floatbtn:hover::after { display: block; }
        #BK-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 700px; background: #fff; z-index: 10000; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; }
        #BK-panel.show { display: flex; }
        .BK-header { padding: 15px; background: #f4f4f4; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
        .BK-title { font-size: 18px; font-weight: bold; color: #333; }
        .BK-close { cursor: pointer; font-size: 24px; color: #999; }
        .BK-toolbar { padding: 10px; background: #fff; border-bottom: 1px solid #eee; display: flex; gap: 10px; }
        .BK-btn { padding: 5px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; color: #fff; transition: 0.2s; }
        .BK-btn-primary { background: #00a1d6; }
        .BK-btn-danger { background: #ff4d4f; }
        .BK-btn-gray { background: #ccc; }
        .BK-list { flex: 1; overflow-y: auto; padding: 10px; }
        .BK-item { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0; transition: 0.2s; }
        .BK-item:hover { background: #f9f9f9; }
        .BK-item img { width: 36px; height: 36px; border-radius: 50%; margin: 0 10px; }
        .BK-item-info { flex: 1; }
        .BK-item-name { font-weight: bold; color: #333; font-size: 14px; }
        .BK-item-sign { color: #999; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        .BK-status { font-size: 12px; color: #999; width: 60px; text-align: right; }
        .BK-status.success { color: green; }
        .BK-status.error { color: red; }
    `;

    function init() {
        const urlPart = window.location.href.match(/space\.bilibili\.com\/(\d+)/);
        if (!urlPart) return;
        datas.mid = urlPart[1];
        datas.csrf = getCookie('bili_jct');

        if (!datas.csrf) {
            console.log("未检测到登录状态或不在个人空间");
            return;
        }

        addStyle(styles);
        createFloatBtn();
        createPanel();
    }

    function createFloatBtn() {
        const btn = document.createElement('div');
        btn.id = 'BK-floatbtn';
        btn.innerHTML = '🧹';
        btn.onclick = () => {
            const panel = get('#BK-panel');
            panel.classList.toggle('show');
            if (panel.classList.contains('show') && (!datas.fans || datas.fans.length === 0)) {
                loadFans(1);
            }
        };
        document.body.appendChild(btn);
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'BK-panel';
        panel.innerHTML = `
            <div class="BK-header">
                <div class="BK-title">粉丝清理大师 (Bot Killer)</div>
                <div class="BK-close" onclick="document.querySelector('#BK-panel').classList.remove('show')">×</div>
            </div>
            <div class="BK-toolbar">
                <button class="BK-btn BK-btn-primary" id="BK-refresh">刷新列表(第1页)</button>
                <button class="BK-btn BK-btn-gray" id="BK-select-all">全选本页</button>
                <button class="BK-btn BK-btn-danger" id="BK-kick-selected">一键移除选中</button>
                <span style="font-size:12px;color:#999;line-height:26px;margin-left:auto" id="BK-status-bar">就绪</span>
            </div>
            <div class="BK-list" id="BK-list-container">
                <div style="text-align:center;padding:20px;color:#999">请点击刷新列表获取数据...</div>
            </div>
        `;
        document.body.appendChild(panel);

        get('#BK-refresh').onclick = () => loadFans(1);
        get('#BK-select-all').onclick = toggleSelectAll;
        get('#BK-kick-selected').onclick = kickSelectedFans;
    }

    async function loadFans(page) {
        const container = get('#BK-list-container');
        const statusBar = get('#BK-status-bar');

        container.innerHTML = '<div style="text-align:center;padding:20px;">正在加载粉丝数据...<br>请稍候，计算签名中...</div>';
        statusBar.innerText = "读取中...";

        try {
            const res = await fetchFans(page);

            // 处理 -352 风控
            if (res.code === -352) {
                container.innerHTML = `
                    <div style="text-align:center;padding:20px;color:#f00">
                        <h3>触发 Bilibili 风控验证 (-352)</h3>
                        <p>请点击下方按钮，在新页面中随便浏览一下或完成验证码，然后回来再次点击刷新。</p>
                        <a href="https://t.bilibili.com/" target="_blank" style="display:inline-block;padding:8px 16px;background:#00a1d6;color:white;text-decoration:none;border-radius:4px;margin-top:10px">去通过验证</a>
                    </div>
                `;
                statusBar.innerText = "需要验证";
                return;
            }

            if (res.code !== 0) {
                container.innerHTML = `<div style="text-align:center;color:red">API 错误: ${res.message} (${res.code})</div>`;
                return;
            }

            datas.fans = res.data.list;
            renderList();
            statusBar.innerText = `获取成功，共 ${res.data.total} 粉丝`;
        } catch (e) {
            console.error(e);
            container.innerHTML = `<div style="text-align:center;color:red">请求失败: ${e.message}</div>`;
        }
    }

    function renderList() {
        const container = get('#BK-list-container');
        container.innerHTML = '';

        if (!datas.fans || datas.fans.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:20px;">暂无粉丝数据</div>';
            return;
        }

        datas.fans.forEach(fan => {
            const div = document.createElement('div');
            div.className = 'BK-item';
            div.dataset.mid = fan.mid;
            div.innerHTML = `
                <input type="checkbox" class="BK-checkbox" value="${fan.mid}">
                <img src="${fan.face}" loading="lazy">
                <div class="BK-item-info">
                    <div class="BK-item-name">${fan.uname}</div>
                    <div class="BK-item-sign">${fan.sign || '无签名'}</div>
                </div>
                <div class="BK-status" id="status-${fan.mid}"></div>
            `;
            div.onclick = (e) => {
                if(e.target.type !== 'checkbox') {
                    const cb = div.querySelector('.BK-checkbox');
                    cb.checked = !cb.checked;
                }
            }
            container.appendChild(div);
        });
    }

    function toggleSelectAll() {
        const cbs = getAll('.BK-checkbox');
        const allChecked = Array.from(cbs).every(cb => cb.checked);
        cbs.forEach(cb => cb.checked = !allChecked);
    }

    async function kickSelectedFans() {
        const checked = Array.from(getAll('.BK-checkbox:checked'));
        if (checked.length === 0) {
            alert('请先勾选需要移除的粉丝！');
            return;
        }
        if (!confirm(`即将移除 ${checked.length} 个粉丝。\n确定要继续吗？`)) return;

        const statusBar = get('#BK-status-bar');
        statusBar.innerText = "正在处理...";
        get('#BK-kick-selected').disabled = true;
        get('#BK-kick-selected').style.opacity = 0.5;

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < checked.length; i++) {
            const mid = checked[i].value;
            const statusNode = get(`#status-${mid}`);

            statusNode.innerText = "处理中...";

            try {
                const res = await kickFan(mid);
                if (res.code === 0) {
                    statusNode.innerText = "已移除";
                    statusNode.className = "BK-status success";
                    statusNode.parentElement.style.opacity = 0.4;
                    successCount++;
                } else {
                    statusNode.innerText = "失败";
                    statusNode.className = "BK-status error";
                    statusNode.title = res.message;
                    failCount++;
                }
            } catch (e) {
                statusNode.innerText = "错误";
                failCount++;
            }

            statusBar.innerText = `进度: ${i + 1}/${checked.length}`;
            if (i < checked.length - 1) await wait(cfg.delay);
        }

        get('#BK-kick-selected').disabled = false;
        get('#BK-kick-selected').style.opacity = 1;
        alert(`操作完成！成功: ${successCount}，失败: ${failCount}`);
        loadFans(1);
    }

    setTimeout(init, 1500);

})();
