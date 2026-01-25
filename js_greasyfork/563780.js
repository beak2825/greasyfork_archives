// ==UserScript==
// @name         Fortnite.gg Locker Importer
// @namespace    https://fortnite.gg/
// @version      2.3
// @description  Import your Fortnite locker to Fortnite.gg
// @author       Reepze
// @match        https://fortnite.gg/*
// @icon         https://fortnite.gg/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      account-public-service-prod.ol.epicgames.com
// @connect      fortnite-public-service-prod11.ol.epicgames.com
// @connect      fortnite-api.com
// @connect      fortnite.gg
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/563780/Fortnitegg%20Locker%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/563780/Fortnitegg%20Locker%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!location.pathname.toLowerCase().includes('/locker')) return;

    var SAC = 'Reepze';
    var switchToken = 'OThmN2U0MmMyZTNhNGY4NmE3NGViNDNmYmI0MWVkMzk6MGEyNDQ5YTItMDAxYS00NTFlLWFmZWMtM2U4MTI5MDFjNGQ3';
    var epicBase = 'https://account-public-service-prod.ol.epicgames.com';
    var fnBase = 'https://fortnite-public-service-prod11.ol.epicgames.com';

    var LOGO = 'data:image/png;base64,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';

    var typeOrder = {
        outfit: 1, backpack: 2, pickaxe: 3, glider: 4, contrail: 5, emote: 6, emoji: 7, spray: 8,
        wrap: 9, shoe: 10, companion: 11, banner: 12, music: 13, jamtrack: 13, loadingscreen: 14,
        toy: 15, aura: 16,
        guitar: 17, bass: 17, drum: 17, keytar: 17, microphone: 17,
        car: 18, decal: 18, wheel: 18, trail: 18, boost: 18,
        legokit: 19, unknown: 99
    };
    var instrumentSort = { guitar: 1, bass: 2, drum: 3, keytar: 4, microphone: 5 };
    var racingSort = { car: 1, decal: 2, wheel: 3, trail: 4, boost: 5 };

    var typeMap = {
        character: 'outfit', backbling: 'backpack', 'back bling': 'backpack', pet: 'backpack', petcarrier: 'backpack',
        dance: 'emote', emoticon: 'emoji', 'harvesting tool': 'pickaxe', harvestingtool: 'pickaxe',
        'skydiving trail': 'contrail', skydivercontrail: 'contrail', itemwrap: 'wrap', 'loading screen': 'loadingscreen',
        musicpack: 'music', 'music pack': 'music', bannertoken: 'banner', shoes: 'shoe', kicks: 'shoe', sidekick: 'companion',
        sparks_guitar: 'guitar', sparks_bass: 'bass', sparks_drum: 'drum', drums: 'drum', sparks_keyboard: 'keytar',
        keyboard: 'keytar', sparks_microphone: 'microphone', mic: 'microphone', sparks_aura: 'aura', instrument: 'guitar',
        track: 'jamtrack', 'jam track': 'jamtrack', sparks_song: 'jamtrack',
        body: 'car', vehiclebody: 'car', skin: 'decal', vehicleskin: 'decal', wheels: 'wheel', vehiclewheels: 'wheel',
        booster: 'boost', vehicleboost: 'boost', drifttrail: 'trail', vehiclebooster: 'trail',
        legoset: 'legokit', legoprop: 'legokit', legobuild: 'legokit', lego: 'legokit', build: 'legokit',
        juno_build: 'legokit', junobuild: 'legokit', decor: 'legokit', juno_decor: 'legokit', junodecor: 'legokit', legodecor: 'legokit'
    };

    var idPatterns = [
        [/^cid_/, 'outfit'], [/^bid_|^petcarrier_/, 'backpack'], [/^pickaxe_/, 'pickaxe'], [/^glider_/, 'glider'],
        [/^trails_/, 'contrail'], [/^eid_/, 'emote'], [/^emoji_/, 'emoji'], [/^spid_/, 'spray'], [/^wrap_/, 'wrap'],
        [/^lsid_/, 'loadingscreen'], [/^musicpack_/, 'music'], [/^toy_/, 'toy'], [/^shoes_/, 'shoe'],
        [/^companion_/, 'companion'], [/^banner/, 'banner'], [/^sid_|^sparks_song_/, 'jamtrack'], [/sparks_.*aura/, 'aura'],
        [/_guitar|sparks_.*guitar/, 'guitar'], [/_bass|sparks_.*bass/, 'bass'], [/_drumkit|sparks_.*drum/, 'drum'],
        [/_keytar|sparks_.*keyboard/, 'keytar'], [/_mic|sparks_.*microphone/, 'microphone'],
        [/^id_body_|^vkc_/, 'car'], [/^id_skin_|^vks_/, 'decal'], [/^id_wheel_|^vkw_/, 'wheel'],
        [/^id_boost_|^booster_|^vkb_/, 'boost'], [/^id_drifttrail_|^vkt_/, 'trail'], [/^jbsid_|^jbpid_|^juno_/, 'legokit']
    ];

    var seriesBonus = {
        marvel: 8800, dc: 8700, dark: 8600, cube: 8600, starwars: 8500, 'star wars': 8500,
        gaming: 8400, icon: 8300, columbus: 8300, creator: 8300, frozen: 8200, lava: 8100, shadow: 8000, slurp: 7900
    };
    var rarityScore = { legendary: 900, epic: 700, rare: 600, uncommon: 500, common: 400 };

    var session = null;
    var working = false;
    var deviceCode = null;
    var verifyUri = null;
    var pollInterval = null;
    var cosmeticsData = null;

    function getSettings() {
        try { return JSON.parse(GM_getValue('fngg_settings', '{}')); }
        catch(e) { return {}; }
    }
    function saveSetting(k, v) {
        var s = getSettings(); s[k] = v;
        GM_setValue('fngg_settings', JSON.stringify(s));
    }

    function saveSession(d) {
        GM_setValue('epic_session', JSON.stringify({
            token: d.accessToken, id: d.accountId, name: d.displayName, ts: Date.now()
        }));
    }
    function loadSession() {
        try {
            var d = JSON.parse(GM_getValue('epic_session'));
            if (!d || Date.now() - d.ts > 7200000) return null;
            return { accessToken: d.token, accountId: d.id, displayName: d.name };
        } catch(e) { return null; }
    }
    function clearSession() {
        GM_deleteValue('epic_session');
        session = null;
    }

    function http(method, url, headers, body) {
        return new Promise(function(res, rej) {
            GM_xmlhttpRequest({
                method: method, url: url, headers: headers || {}, data: body,
                onload: function(r) {
                    try { res({ status: r.status, data: JSON.parse(r.responseText) }); }
                    catch(e) { res({ status: r.status, data: r.responseText }); }
                },
                onerror: rej
            });
        });
    }

    function normalizeType(t) {
        if (!t) return 'unknown';
        var l = t.toLowerCase();
        return typeMap[l] || (typeOrder[l] !== undefined ? l : 'unknown');
    }
    function guessType(id) {
        var l = id.toLowerCase();
        for (var i = 0; i < idPatterns.length; i++) {
            if (idPatterns[i][0].test(l)) return idPatterns[i][1];
        }
        return null;
    }
    function getScore(item) {
        if (item.series) {
            var s = item.series.toLowerCase();
            for (var k in seriesBonus) if (s.indexOf(k) !== -1) return seriesBonus[k];
            return 7500;
        }
        return rarityScore[item.rarity] || 100;
    }

    GM_addStyle(`
        #fngg-panel{position:fixed;top:80px;right:20px;width:320px;background:#1a1a1d;border:1px solid #2a2a2d;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;z-index:999999;box-shadow:0 8px 32px rgba(0,0,0,.6)}
        #fngg-panel.min .body{display:none}
        .fngg-hdr{background:#222225;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #2a2a2d}
        .fngg-brand{display:flex;align-items:center;gap:10px}
        .fngg-brand img{width:32px;height:32px;border-radius:6px}
        .fngg-brand span{font-size:14px;font-weight:600;color:#fff}
        .fngg-btns{display:flex;gap:4px}
        .fngg-hbtn{background:0;border:0;color:#666;width:28px;height:28px;border-radius:4px;cursor:pointer}
        .fngg-hbtn:hover{background:#2a2a2d;color:#fff}
        .body{padding:16px}
        .ucard{display:flex;align-items:center;gap:12px;padding:12px;background:#222225;border-radius:6px;margin-bottom:12px}
        .ucard img{width:40px;height:40px;border-radius:6px}
        .ucard .info{flex:1;min-width:0}
        .ucard .name{font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ucard .status{font-size:11px;color:#4ade80;display:flex;align-items:center;gap:4px;margin-top:2px}
        .ucard .status::before{content:'';width:6px;height:6px;background:#4ade80;border-radius:50%}
        .lout{background:0;border:1px solid #333;color:#888;font-size:11px;padding:5px 10px;border-radius:4px;cursor:pointer}
        .lout:hover{background:rgba(239,68,68,.1);border-color:#ef4444;color:#ef4444}
        .btn{width:100%;padding:12px 16px;border:0;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .btn-y{background:#f0db4f;color:#000}
        .btn-y:hover:not(:disabled){background:#f5e066}
        .btn-g{background:#22c55e;color:#fff}
        .btn-g:hover:not(:disabled){background:#16a34a}
        .btn-x{background:#2a2a2d;color:#aaa;margin-top:12px}
        .btn-x:hover:not(:disabled){background:#333;color:#fff}
        .stxt{font-size:11px;color:#666;text-align:center;padding:10px;background:#222225;border-radius:6px;margin-top:12px}
        .fngg-m{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:9999999;opacity:0;visibility:hidden;transition:opacity .2s}
        .fngg-m.show{opacity:1;visibility:visible}
        .mbox{background:#1a1a1d;border:1px solid #2a2a2d;border-radius:12px;padding:24px;width:360px;text-align:center}
        .mtitle{font-size:18px;font-weight:700;color:#fff;margin-bottom:20px}
        .spin{width:28px;height:28px;border:3px solid #333;border-top-color:#f0db4f;border-radius:50%;animation:spin .8s linear infinite;margin:16px auto}
        @keyframes spin{to{transform:rotate(360deg)}}
        .mhint{font-size:12px;color:#666}
        .isec{text-align:left;margin-bottom:16px}
        .isec h3{font-size:13px;font-weight:600;color:#f0db4f;margin-bottom:8px}
        .isec p{font-size:12px;color:#aaa;line-height:1.5}
        .isec a{color:#f0db4f}
        .srow{display:flex;align-items:center;justify-content:space-between;padding:12px;background:#222225;border-radius:6px}
        .srow .slbl{font-size:12px;color:#fff}
        .srow .sdesc{font-size:10px;color:#666;margin-top:2px}
        .tog{position:relative;width:40px;height:22px;background:#333;border-radius:11px;cursor:pointer}
        .tog.on{background:#22c55e}
        .tog::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;transition:left .2s}
        .tog.on::after{left:20px}
        .ver{font-size:10px;color:#555;margin-top:16px}
        .sicon{font-size:40px;margin-bottom:12px}
        .stxt2{font-size:13px;color:#aaa;line-height:1.6;margin-bottom:20px}
        .stxt2 strong{color:#fff}
        .btn-sac{background:#f0db4f;color:#000;margin-bottom:8px}
        .btn-skip{background:0;border:0;color:#666;font-size:12px;padding:8px;cursor:pointer;width:100%}
        .btn-skip:hover{color:#888}
        #fngg-toast{position:fixed;bottom:20px;right:20px;background:#222225;border:1px solid #2a2a2d;border-radius:8px;padding:12px 20px;font-size:13px;color:#fff;z-index:99999999;transform:translateY(100px);opacity:0;transition:all .25s}
        #fngg-toast.show{transform:translateY(0);opacity:1}
        #fngg-toast.ok{border-left:3px solid #22c55e}
        #fngg-toast.err{border-left:3px solid #ef4444}
    `);

    function setStatus(t) { var e = document.getElementById('stxt'); if (e) e.textContent = t; }
    function toast(msg, type) {
        var t = document.getElementById('fngg-toast');
        if (!t) return;
        t.textContent = msg;
        t.className = 'show ' + (type || '');
        setTimeout(function() { t.className = ''; }, 3000);
    }
    function modal(id, show) {
        var m = document.getElementById(id);
        if (m) m.classList.toggle('show', show);
    }

    function updateUI() {
        var uel = document.getElementById('usec');
        var ael = document.getElementById('asec');
        if (!uel || !ael) return;

        if (session) {
            uel.innerHTML = '<div class="ucard"><img src="'+LOGO+'"><div class="info"><div class="name">'+session.displayName+'</div><div class="status">Connected</div></div><button class="lout" id="lout">Logout</button></div>';
            ael.innerHTML = '<button class="btn btn-g" id="ibtn"'+(working?' disabled':'')+'>'+(working?'Importing...':'Import Locker')+'</button>';
            document.getElementById('lout').onclick = logout;
            document.getElementById('ibtn').onclick = doImport;
        } else {
            uel.innerHTML = '';
            ael.innerHTML = '<button class="btn btn-y" id="lbtn">Connect Epic Account</button>';
            document.getElementById('lbtn').onclick = startLogin;
        }
    }

    function createUI() {
        if (document.getElementById('fngg-panel')) return;

        var p = document.createElement('div');
        p.id = 'fngg-panel';
        p.innerHTML = '<div class="fngg-hdr"><div class="fngg-brand"><img src="'+LOGO+'"><span>Locker Import</span></div><div class="fngg-btns"><button class="fngg-hbtn" id="ibtn2" title="Info">ⓘ</button><button class="fngg-hbtn" id="mbtn">▼</button></div></div><div class="body"><div id="usec"></div><div id="asec"></div><div class="stxt" id="stxt">Ready</div></div>';
        document.body.appendChild(p);

        var lm = document.createElement('div');
        lm.id = 'lmodal';
        lm.className = 'fngg-m';
        lm.innerHTML = '<div class="mbox"><div class="mtitle">Epic Games Login</div><div class="mhint" style="margin:20px 0">Click the button below to login with your Epic Games account.</div><button class="btn btn-y" id="openbtn">Login with Epic Games</button><div class="spin"></div><div class="mhint">Waiting for login...</div><button class="btn btn-x" id="cbtn">Cancel</button></div>';
        document.body.appendChild(lm);

        var im = document.createElement('div');
        im.id = 'imodal';
        im.className = 'fngg-m';
        im.innerHTML = '<div class="mbox"><div class="mtitle">Info</div><div class="isec"><h3>What does this do?</h3><p>This script connects to your Epic Games account and reads all your Fortnite cosmetics (skins, pickaxes, emotes, etc). It then generates a link for fortnite.gg that shows your entire locker. Everything gets sorted automatically by type and rarity so it looks nice.</p></div><div class="isec"><h3>Is this safe?</h3><p>Yep! The login uses Epic\'s official Device Code flow (same method apps like Discord use). Your password is never entered here or sent anywhere. The script only gets a temporary token that lets it read your locker, nothing else. Token expires after about 2 hours, then you\'d need to login again.</p></div><div class="isec"><h3>Settings</h3><div class="srow"><div><div class="slbl">Support Creator</div><div class="sdesc">Sets code "'+SAC+'" in Fortnite</div></div><div class="tog'+(getSettings().supportCreator?' on':'')+'" id="stog"></div></div></div><div class="isec"><p style="color:#888">Made with ❤️ by <a href="https://fortnite.gg/@reepze" target="_blank">Reepze</a></p></div><div class="ver">v2.3</div><button class="btn btn-x" id="cibtn">Close</button></div>';
        document.body.appendChild(im);

        var sm = document.createElement('div');
        sm.id = 'smodal';
        sm.className = 'fngg-m';
        sm.innerHTML = '<div class="mbox"><div class="sicon">🎉</div><div class="mtitle">Done!</div><div class="stxt2"><span id="icnt">Your items</span> are ready.<br><br>This is free btw. If you wanna support, use code <strong>"'+SAC+'"</strong> in the shop.<br><br><span style="color:#555;font-size:11px;">You can always change it in-game later.</span></div><button class="btn btn-sac" id="ybtn">❤️ Use code & continue</button><button class="btn-skip" id="nbtn">nah maybe later</button></div>';
        document.body.appendChild(sm);

        var te = document.createElement('div');
        te.id = 'fngg-toast';
        document.body.appendChild(te);

        if (getSettings().panelMin) {
            p.classList.add('min');
            document.getElementById('mbtn').textContent = '▲';
        }
        var savedX = getSettings().panelX;
        var savedY = getSettings().panelY;
        if (savedX !== undefined && savedY !== undefined) {
            p.style.right = 'auto';
            p.style.left = savedX + 'px';
            p.style.top = savedY + 'px';
        }

        document.getElementById('mbtn').onclick = function() {
            p.classList.toggle('min');
            var isMin = p.classList.contains('min');
            this.textContent = isMin ? '▲' : '▼';
            saveSetting('panelMin', isMin);
        };
        document.getElementById('ibtn2').onclick = function() {
            document.getElementById('stog').classList.toggle('on', getSettings().supportCreator === true);
            modal('imodal', true);
        };
        document.getElementById('cibtn').onclick = function() { modal('imodal', false); };
        document.getElementById('openbtn').onclick = function() { if (verifyUri) window.open(verifyUri, '_blank'); };
        document.getElementById('cbtn').onclick = cancelLogin;
        lm.onclick = function(e) { if (e.target === lm) cancelLogin(); };
        im.onclick = function(e) { if (e.target === im) modal('imodal', false); };

        document.getElementById('stog').onclick = function() {
            var on = !this.classList.contains('on');
            this.classList.toggle('on', on);
            saveSetting('supportCreator', on);
            toast(on ? 'Support enabled ❤️' : 'Support disabled', 'ok');
        };

        document.getElementById('ybtn').onclick = async function() {
            saveSetting('supportCreator', true);
            modal('smodal', false);
            var ok = await setSAC();
            toast(ok ? 'Thanks! ❤️' : 'Couldn\'t set code', ok ? 'ok' : 'err');
            setTimeout(function() {
                var url = document.getElementById('smodal').dataset.url;
                if (url) location.href = url; else location.reload();
            }, 800);
        };
        document.getElementById('nbtn').onclick = function() {
            modal('smodal', false);
            var url = document.getElementById('smodal').dataset.url;
            if (url) location.href = url; else location.reload();
        };

        var drag = false, sx, sy, ox, oy;
        p.querySelector('.fngg-hdr').onmousedown = function(e) {
            if (e.target.tagName === 'BUTTON') return;
            drag = true; sx = e.clientX; sy = e.clientY;
            ox = p.offsetLeft; oy = p.offsetTop;
            p.style.right = 'auto'; p.style.left = ox + 'px';
        };
        document.onmousemove = function(e) {
            if (!drag) return;
            p.style.left = (ox + e.clientX - sx) + 'px';
            p.style.top = (oy + e.clientY - sy) + 'px';
        };
        document.onmouseup = function() {
            if (drag) {
                saveSetting('panelX', parseInt(p.style.left));
                saveSetting('panelY', parseInt(p.style.top));
            }
            drag = false;
        };

        initSession();
    }

    async function initSession() {
        var s = loadSession();
        if (s) {
            try {
                var r = await http('GET', epicBase + '/account/api/oauth/verify', { 'Authorization': 'Bearer ' + s.accessToken });
                if (r.status === 200) session = s;
                else clearSession();
            } catch(e) { clearSession(); }
        }
        updateUI();
    }

    async function startLogin() {
        try {
            setStatus('Connecting...');
            var a1 = await http('POST', epicBase + '/account/api/oauth/token', {
                'Authorization': 'Basic ' + switchToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 'grant_type=client_credentials');
            if (a1.status !== 200) throw 'fail';

            var a2 = await http('POST', epicBase + '/account/api/oauth/deviceAuthorization', {
                'Authorization': 'Bearer ' + a1.data.access_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 'prompt=login');
            if (a2.status !== 200) throw 'fail';

            deviceCode = a2.data.device_code;
            verifyUri = a2.data.verification_uri_complete;

            modal('lmodal', true);
            setStatus('Waiting...');
            pollInterval = setInterval(pollLogin, 3000);
        } catch(e) {
            setStatus('Login failed');
            toast('Couldn\'t connect to Epic', 'err');
        }
    }

    async function pollLogin() {
        try {
            var r = await http('POST', epicBase + '/account/api/oauth/token', {
                'Authorization': 'Basic ' + switchToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 'grant_type=device_code&device_code=' + deviceCode);

            if (r.status === 200 && r.data.access_token) {
                clearInterval(pollInterval); pollInterval = null;
                deviceCode = null; verifyUri = null;
                session = { accessToken: r.data.access_token, accountId: r.data.account_id, displayName: r.data.displayName };
                saveSession(session);
                modal('lmodal', false);
                updateUI();
                setStatus('Connected!');
                toast('Hey ' + session.displayName + '!', 'ok');
                if (getSettings().supportCreator) setSAC();
            }
        } catch(e) {}
    }

    function cancelLogin() {
        if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
        deviceCode = null; verifyUri = null;
        modal('lmodal', false);
        setStatus('Ready');
    }

    function logout() {
        clearSession(); updateUI();
        setStatus('Ready');
        toast('Logged out', 'ok');
    }

    async function setSAC() {
        if (!session) return false;
        try {
            var r = await http('POST', fnBase + '/fortnite/api/game/v2/profile/' + session.accountId + '/client/SetAffiliateName?profileId=common_core', {
                'Authorization': 'Bearer ' + session.accessToken, 'Content-Type': 'application/json'
            }, JSON.stringify({ affiliateName: SAC }));
            return r.status === 200 || r.status === 204;
        } catch(e) { return false; }
    }

    async function loadCosmetics() {
        if (cosmeticsData) return cosmeticsData;
        cosmeticsData = {};

        var eps = [['br', null], ['cars', 'car'], ['instruments', 'guitar'], ['tracks', 'jamtrack'], ['lego/kits', 'legokit'], ['lego', 'legokit']];
        for (var i = 0; i < eps.length; i++) {
            setStatus('Loading cosmetics (' + (i+1) + '/' + eps.length + ')...');
            try {
                var r = await http('GET', 'https://fortnite-api.com/v2/cosmetics/' + eps[i][0]);
                if (r.status !== 200 || !r.data || !r.data.data) continue;
                for (var j = 0; j < r.data.data.length; j++) {
                    var item = r.data.data[j];
                    var id = item.id ? item.id.toLowerCase() : null;
                    if (!id || cosmeticsData[id]) continue;

                    var rar = (item.rarity && item.rarity.value) ? item.rarity.value.toLowerCase() : 'common';
                    var ser = (item.series && item.series.value) ? item.series.value : null;

                    var srars = ['starwars','marvel','dc','icon','gaming','frozen','lava','shadow','slurp','dark'];
                    if (srars.indexOf(rar) !== -1) {
                        ser = rar;
                        var bv = (item.rarity && item.rarity.backendValue) || '';
                        if (bv.indexOf('Legendary') !== -1) rar = 'legendary';
                        else if (bv.indexOf('Epic') !== -1) rar = 'epic';
                        else if (bv.indexOf('Rare') !== -1) rar = 'rare';
                        else if (bv.indexOf('Uncommon') !== -1) rar = 'uncommon';
                        else rar = 'common';
                    }

                    cosmeticsData[id] = {
                        name: item.name || id,
                        type: normalizeType(item.type ? item.type.value : null) || eps[i][1] || 'unknown',
                        rarity: rar, series: ser
                    };
                }
            } catch(e) {}
        }
        return cosmeticsData;
    }

    async function doImport() {
        if (working || !session) return;
        working = true; updateUI();

        try {
            var cdb = await loadCosmetics();

            setStatus('Getting fngg items...');
            var fr = await http('GET', 'https://fortnite.gg/api/items.json');
            if (fr.status !== 200) {
                setStatus('fortnite.gg not reachable');
                toast('fortnite.gg not reachable', 'err');
                working = false; updateUI();
                return;
            }
            var fngg = {};
            for (var k in fr.data) fngg[k.toLowerCase()] = parseInt(fr.data[k]);

            setStatus('Loading locker...');
            var ar = await http('POST', fnBase + '/fortnite/api/game/v2/profile/' + session.accountId + '/client/QueryProfile?profileId=athena&rvn=-1', {
                'Authorization': 'Bearer ' + session.accessToken, 'Content-Type': 'application/json'
            }, '{}');

            if (ar.status === 401) { clearSession(); updateUI(); toast('Session expired, login again', 'err'); setStatus('Session expired'); working = false; return; }
            if (ar.status !== 200) { toast('Epic API error (' + ar.status + ')', 'err'); setStatus('Epic API error'); working = false; updateUI(); return; }

            var ap = ar.data && ar.data.profileChanges && ar.data.profileChanges[0] ? ar.data.profileChanges[0].profile : null;
            var ai = (ap && ap.items) || {};
            var created = (ap && ap.created) ? ap.created.split('T')[0] : '2017-01-01';

            setStatus('Loading banners...');
            var ci = {}, currentSAC = null;
            try {
                var cr = await http('POST', fnBase + '/fortnite/api/game/v2/profile/' + session.accountId + '/client/QueryProfile?profileId=common_core&rvn=-1', {
                    'Authorization': 'Bearer ' + session.accessToken, 'Content-Type': 'application/json'
                }, '{}');
                if (cr.status === 200) {
                    var cp = cr.data && cr.data.profileChanges && cr.data.profileChanges[0] ? cr.data.profileChanges[0].profile : null;
                    ci = (cp && cp.items) || {};
                    currentSAC = (cp && cp.stats && cp.stats.attributes) ? cp.stats.attributes.mtx_affiliate : null;
                } else if (cr.status === 401) { clearSession(); updateUI(); toast('Session expired', 'err'); working = false; return; }
            } catch(e) {}

            setStatus('Processing...');
            var items = [];
            var all = Object.assign({}, ai, ci);
            for (var key in all) {
                var tid = all[key].templateId || '';
                if (tid.indexOf(':') === -1) continue;
                var bid = tid.split(':')[1].toLowerCase();
                var fid = fngg[bid];
                if (!fid || isNaN(fid)) continue;

                var meta = cdb[bid] || {};
                var type = normalizeType(meta.type);
                if (!type || type === 'unknown') type = guessType(bid) || 'unknown';

                items.push({ fid: fid, name: meta.name || bid, type: type, rarity: meta.rarity || 'common', series: meta.series || null });
            }

            if (!items.length) { setStatus('Nothing found'); toast('No items', 'err'); working = false; updateUI(); return; }

            setStatus('Sorting...');
            items.sort(function(a, b) {
                var ta = typeOrder[a.type] !== undefined ? typeOrder[a.type] : 99;
                var tb = typeOrder[b.type] !== undefined ? typeOrder[b.type] : 99;
                if (ta !== tb) return ta - tb;
                if (ta === 17) {
                    var ia = instrumentSort[a.type] || 99, ib = instrumentSort[b.type] || 99;
                    if (ia !== ib) return ia - ib;
                }
                if (ta === 18) {
                    var ra = racingSort[a.type] || 99, rb = racingSort[b.type] || 99;
                    if (ra !== rb) return ra - rb;
                }
                var sc = getScore(b) - getScore(a);
                if (sc !== 0) return sc;
                return (a.name || '').localeCompare(b.name || '');
            });

            setStatus('Building URL...');
            var ids = [], diffs = [];
            for (var i = 0; i < items.length; i++) ids.push(items[i].fid);
            for (var i = 0; i < ids.length; i++) diffs.push(i === 0 ? ids[i] : ids[i] - ids[i-1]);

            var str = created + ',' + diffs.join(',');
            var comp = pako.deflateRaw(str, { level: -1 });
            var b64 = btoa(String.fromCharCode.apply(null, comp)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
            var url = 'https://fortnite.gg/my-locker?items=' + b64;

            setStatus('Done! ' + items.length + ' items');
            toast(items.length + ' items', 'ok');
            working = false; updateUI();

            var already = currentSAC && currentSAC.trim().toLowerCase() === SAC.toLowerCase();
            if (already) {
                setTimeout(function() { location.href = url; }, 600);
            } else {
                document.getElementById('smodal').dataset.url = url;
                document.getElementById('icnt').innerHTML = '<strong>' + items.length + ' items</strong>';
                setTimeout(function() { modal('smodal', true); }, 400);
            }
        } catch(e) {
            var msg = 'Import failed';
            if (e && typeof e === 'string') msg = e;
            setStatus(msg);
            toast(msg, 'err');
            working = false; updateUI();
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
    else createUI();
})();