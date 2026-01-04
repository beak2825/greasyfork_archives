// ==UserScript==
// @name         Srun Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Srun Login腳本，自動進行上網認證。
// @author       you
// @match        *://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      192.168.112.30
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557962/Srun%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/557962/Srun%20Auto%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======== 固定配置（根据需要改这里） ========
    const CONFIG = {
        base: 'http://192.168.112.30',  // 认证网关地址
        ac_id: '0',                     // self.ac_id
        callback: 'jQuery112402639979206520908_1729420854635'
    };
    // =========================================

    // === Tampermonkey 菜单：配置账号密码 ===
    function configureAccount() {
        const currentUsername = GM_getValue('srun_username', '');
        const currentPassword = GM_getValue('srun_password', '');

        let u = prompt('请输入 Srun 上网账号（学号 / 工号）：', currentUsername || '');
        if (u === null) return; // 用户取消
        u = u.trim();
        if (!u) {
            alert('账号不能为空');
            return;
        }

        let p = prompt('请输入 Srun 上网密码：', currentPassword || '');
        if (p === null) return; // 用户取消
        // 密码允许为空字符？通常不允许，这里简单校验
        if (!p) {
            alert('密码不能为空');
            return;
        }

        GM_setValue('srun_username', u);
        GM_setValue('srun_password', p);
        alert('账号密码已保存');
    }

    // === 注册菜单命令 ===
    GM_registerMenuCommand('设置 / 修改 Srun 账号密码', configureAccount);
    GM_registerMenuCommand('立即手动登录一次', () => {
        loginOnce(true);
    });

    // --- GM_xmlhttpRequest Promise 封装 ---
    function gmRequest({ method = 'GET', url, data = null, headers = {} }) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                data,
                headers,
                onload: (response) => resolve(response),
                onerror: (err) => reject(err),
                ontimeout: (err) => reject(err)
            });
        });
    }

    // ===== Python 中的 get_base64 (自定义字母表) =====
    const _PADCHAR = '=';
    const _ALPHA = 'LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA';

    function _getbyte(s, i) {
        const x = s.charCodeAt(i);
        if (x > 255) throw new Error('INVALID_CHARACTER_ERR: DOM Exception 5');
        return x;
    }

    function get_base64(s) {
        let i, b10;
        const x = [];
        const imax = s.length - (s.length % 3);
        if (s.length === 0) return s;

        for (i = 0; i < imax; i += 3) {
            b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2);
            x.push(
                _ALPHA[(b10 >> 18) & 63],
                _ALPHA[(b10 >> 12) & 63],
                _ALPHA[(b10 >> 6) & 63],
                _ALPHA[b10 & 63]
            );
        }

        const remain = s.length - imax;
        if (remain === 1) {
            b10 = _getbyte(s, imax) << 16;
            x.push(
                _ALPHA[(b10 >> 18) & 63],
                _ALPHA[(b10 >> 12) & 63],
                _PADCHAR,
                _PADCHAR
            );
        } else if (remain === 2) {
            b10 = (_getbyte(s, imax) << 16) | (_getbyte(s, imax + 1) << 8);
            x.push(
                _ALPHA[(b10 >> 18) & 63],
                _ALPHA[(b10 >> 12) & 63],
                _ALPHA[(b10 >> 6) & 63],
                _PADCHAR
            );
        }

        return x.join('');
    }

    // ===== xencode (Python 版移植) =====
    function ordat(msg, idx) {
        return idx < msg.length ? msg.charCodeAt(idx) : 0;
    }

    function sencode(msg, key) {
        const l = msg.length;
        const pwd = [];
        for (let i = 0; i < l; i += 4) {
            pwd.push(
                ordat(msg, i) |
                (ordat(msg, i + 1) << 8) |
                (ordat(msg, i + 2) << 16) |
                (ordat(msg, i + 3) << 24)
            );
        }
        if (key) pwd.push(l);
        return pwd;
    }

    function lencode(msg, key) {
        const l = msg.length;
        let ll = (l - 1) << 2;
        if (key) {
            const m = msg[l - 1];
            if (m < ll - 3 || m > ll) return null;
            ll = m;
        }
        const res = [];
        for (let i = 0; i < l; i++) {
            res[i] = String.fromCharCode(
                msg[i] & 0xff,
                (msg[i] >>> 8) & 0xff,
                (msg[i] >>> 16) & 0xff,
                (msg[i] >>> 24) & 0xff
            );
        }
        return key ? res.join('').substring(0, ll) : res.join('');
    }

    function get_xencode(msg, key) {
        if (msg === '') return '';
        let pwd = sencode(msg, true);
        let pwdk = sencode(key, false);
        if (pwdk.length < 4) {
            pwdk = pwdk.concat(new Array(4 - pwdk.length).fill(0));
        }
        const n = pwd.length - 1;
        let z = pwd[n];
        let y = pwd[0];
        const c = (0x86014019 | 0x183639A0) >>> 0;
        let m, e, p;
        let q = Math.floor(6 + 52 / (n + 1));
        let d = 0;

        while (q-- > 0) {
            d = (d + c) & (0x8CE0D9BF | 0x731F2640);
            e = (d >>> 2) & 3;
            for (p = 0; p < n; p++) {
                y = pwd[p + 1];
                m = (z >>> 5) ^ (y << 2);
                m = (m + (((y >>> 3) ^ (z << 4)) ^ (d ^ y))) >>> 0;
                m = (m + (pwdk[(p & 3) ^ e] ^ z)) >>> 0;
                pwd[p] = (pwd[p] + m) & (0xEFB8D130 | 0x10472ECF);
                z = pwd[p];
            }
            y = pwd[0];
            m = (z >>> 5) ^ (y << 2);
            m = (m + (((y >>> 3) ^ (z << 4)) ^ (d ^ y))) >>> 0;
            m = (m + (pwdk[(p & 3) ^ e] ^ z)) >>> 0;
            pwd[n] = (pwd[n] + m) & (0xBB390742 | 0x44C6F8BD);
            z = pwd[n];
        }
        return lencode(pwd, false);
    }

    // ===== HMAC-MD5 & SHA1（用 CryptoJS） =====
    function hmac_md5(password, token) {
        return CryptoJS.HmacMD5(password, token).toString(CryptoJS.enc.Hex);
    }

    function sha1(value) {
        return CryptoJS.SHA1(value).toString(CryptoJS.enc.Hex);
    }

    // ===== 获取 IP =====
    async function getIP() {
        const url = CONFIG.base + '/cgi-bin/rad_user_info';
        const params = new URLSearchParams({
            callback: CONFIG.callback,
            _: Date.now().toString()
        });
        const fullUrl = url + '?' + params.toString();
        // console.log('[getIP] url:', fullUrl);

        const resp = await gmRequest({ method: 'GET', url: fullUrl });
        const text = resp.responseText;
        // console.log('[getIP] response:', text);

        const match = text.match(/\((.*)\)/);
        if (!match) throw new Error('getIP: 无法解析JSONP');
        return JSON.parse(match[1]); // 返回完整数据，包含 error/online_ip/client_ip 等
    }

    // ===== 获取 token (challenge) =====
    async function getToken(ip, username) {
        const url = CONFIG.base + '/cgi-bin/get_challenge';
        const params = new URLSearchParams({
            callback: CONFIG.callback,
            username: username,
            ip: ip,
            _: Date.now().toString()
        });
        const fullUrl = url + '?' + params.toString();
        // console.log('[getToken] url:', fullUrl);

        const resp = await gmRequest({ method: 'GET', url: fullUrl });
        const text = resp.responseText;
        // console.log('[getToken] response:', text);

        const match = text.match(/\((.*)\)/);
        if (!match) throw new Error('getToken: 无法解析JSONP');
        const data = JSON.parse(match[1]);
        return data.challenge;
    }

    // ===== 组装 info 字符串 =====
    function buildInfo(ip, username, password) {
        const info = {
            username: username,
            password: password,
            ip: ip,
            acid: '32',
            enc_ver: 'srun_bx1'
        };
        return JSON.stringify(info);
    }

    // ===== 单次登录 =====
    let isLogging = false;

    async function loginOnce(manual = false) {
        if (isLogging) {
            console.log('[login] 上一次登录还在进行，跳过本次。');
            return;
        }

        const username = GM_getValue('srun_username', '');
        const password = GM_getValue('srun_password', '');

        if (!username || !password) {
            // console.log('[login] 未设置账号密码，无法自动登录。请在 Tampermonkey 图标 → 本脚本 → “设置 / 修改 Srun 账号密码” 中进行配置。');
            if (manual) {
                alert('未设置账号密码，请在 Tampermonkey 菜单中配置。');
            }
            return;
        }

        isLogging = true;
        try {
            // console.log('================= Srun 自动登录开始 =================');
            const ipInfo = await getIP();
            if (ipInfo.error === 'ok') {
                console.log('[login] 当前已在线，跳过登录。');
                return;
            }
            if (ipInfo.error !== 'not_online_error') {
                console.warn('[login] 无法识别的状态，跳过登录。error:', ipInfo.error);
                return;
            }

            const ip = ipInfo.client_ip || ipInfo.online_ip;
            if (!ip) {
                console.error('[login] 未获取到 IP，无法登录。');
                return;
            }
            // console.log('[login] IP:', ip);

            const token = await getToken(ip, username);
            // console.log('[login] token:', token);

            const infoRaw = buildInfo(ip, username, password);
            const xencoded = get_xencode(infoRaw, token);
            const infoEncoded = '{SRBX1}' + get_base64(xencoded);

            const hmd5 = hmac_md5(password, token);
            // console.log('[login] hmd5:', hmd5);

            const chkStr = token +
                username +
                token + hmd5 +
                token + CONFIG.ac_id +
                token + ip +
                token + '200' +
                token + '1' +
                token + infoEncoded;

            const chksum = sha1(chkStr);
            // console.log('[login] chksum:', chksum);

            const url = CONFIG.base + '/cgi-bin/srun_portal';
            const params = new URLSearchParams({
                callback: CONFIG.callback,
                action: 'login',
                username: username,
                password: '{MD5}' + hmd5,
                os: 'Windows 10',
                name: 'Windows',
                double_stack: '0',
                chksum: chksum,
                info: infoEncoded,
                ac_id: CONFIG.ac_id,
                ip: ip,
                n: '200',
                type: '1',
                _: Date.now().toString()
            });

            const fullUrl = url + '?' + params.toString();
            // console.log('[login] 请求 URL:', fullUrl);

            const resp = await gmRequest({ method: 'POST', url: fullUrl });
            const text = resp.responseText;
            // console.log('[login] response:', text);

            const match = text.match(/\((.*)\)/);
            if (!match) {
                console.error('[login] 无法解析JSONP响应');
            } else {
                const data = JSON.parse(match[1]);
                console.log('[login] error 字段:', data.error);
            }
        } catch (e) {
            console.error('[login] 出错:', e);
        } finally {
            isLogging = false;
        }
    }

    // ===== 启动逻辑 =====
    (function start() {
        const username = GM_getValue('srun_username', '');
        const password = GM_getValue('srun_password', '');

        if (!username || !password) {
            alert('[Srun Auto Login]\n尚未配置账号密码，自动登录会被跳过。\n请在 Tampermonkey 图标 → 本脚本 → “设置 / 修改 Srun 账号密码” 中配置。');
        } else {
            loginOnce();
        }
    })();
})();
