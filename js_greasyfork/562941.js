// ==UserScript==
// @name         Discord Lookup Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Floating lookup panel for Discord user and guild IDs
// @author       901wia
// @match        *://discord.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562941/Discord%20Lookup%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/562941/Discord%20Lookup%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PANEL_ID = 'dc-inspector-panel';

    const COLORS = {
        accent: '#2efd48',
        background: '#050505',
        card: '#0a0a0a',
        border: '#2efd4833'
    };

    let authToken = null;
    let activeRequests = {};

    const byId = (id) => document.getElementById(id);

    async function discordRequest(endpoint, key) {
        if (activeRequests[key]) {
            activeRequests[key].abort();
        }

        const controller = new AbortController();
        activeRequests[key] = controller;

        const response = await fetch('https://discord.com/api/v9' + endpoint, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    function downloadAsset(url, name, evt) {
        if (!url) return;

        if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        }

        const finalUrl = url.split('?')[0] + '?size=4096';

        GM_xmlhttpRequest({
            method: 'GET',
            url: finalUrl,
            responseType: 'blob',
            onload: function (res) {
                const blob = URL.createObjectURL(res.response);
                const a = document.createElement('a');
                a.href = blob;
                a.download = name + (url.includes('.gif') ? '.gif' : '.png');
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(blob);
            }
        });
    }

    function injectStyles() {
        GM_addStyle(`
            #${PANEL_ID} {
                position: fixed;
                top: 40px;
                left: 40px;
                width: 420px;
                max-height: 90vh;
                display: none;
                flex-direction: column;
                background: ${COLORS.background};
                color: #fff;
                border: 1px solid ${COLORS.border};
                border-radius: 20px;
                z-index: 2147483647;
                font-family: system-ui, -apple-system, BlinkMacSystemFont;
                box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                overflow: hidden;
            }

            #${PANEL_ID}.open {
                display: flex;
            }

            .dc-header {
                padding: 18px 20px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #111;
            }

            .dc-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .dc-input {
                width: 100%;
                background: #000;
                border: 1px solid #222;
                border-radius: 12px;
                padding: 14px;
                color: ${COLORS.accent};
                outline: none;
                font-size: 13px;
                font-family: monospace;
            }

            .dc-result {
                background: ${COLORS.card};
                border: 1px solid #1a1a1a;
                border-radius: 16px;
                overflow: hidden;
            }

            .dc-banner {
                height: 120px;
                background: #111;
                cursor: pointer;
            }

            .dc-banner img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .dc-avatar-wrap {
                margin-top: -40px;
                padding-left: 15px;
            }

            .dc-avatar {
                width: 85px;
                height: 85px;
                border-radius: 18px;
                border: 5px solid ${COLORS.card};
                overflow: hidden;
                background: #000;
                cursor: pointer;
            }

            .dc-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .dc-info {
                padding: 15px;
            }

            .dc-name {
                font-size: 18px;
                font-weight: 800;
            }

            .dc-sub {
                font-size: 11px;
                color: #555;
                margin-bottom: 12px;
                font-family: monospace;
            }

            .dc-tags {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .dc-tag {
                padding: 5px 12px;
                border-radius: 8px;
                font-size: 10px;
                border: 1px solid ${COLORS.border};
                color: ${COLORS.accent};
                background: #000;
                font-weight: bold;
            }

            .dc-toggle {
                position: fixed;
                bottom: 35px;
                left: 35px;
                width: 60px;
                height: 60px;
                border-radius: 20px;
                background: #000;
                border: 1px solid ${COLORS.accent};
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 2147483647;
            }
        `);
    }

    function buildUI() {
        const toggle = document.createElement('div');
        toggle.className = 'dc-toggle';
        toggle.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${COLORS.accent}" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
            </svg>
        `;
        toggle.onclick = () => byId(PANEL_ID).classList.toggle('open');
        document.body.appendChild(toggle);

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="dc-header">
                <strong style="color:${COLORS.accent};letter-spacing:2px;font-size:12px">901</strong>
                <span id="dc-close" style="cursor:pointer;color:#444">ESC</span>
            </div>
            <div class="dc-body">
                <input id="dc-input" class="dc-input" placeholder="ENTER USER / GUILD ID">
                <div id="dc-output"></div>
            </div>
        `;
        document.body.appendChild(panel);

        byId('dc-close').onclick = () => panel.classList.remove('open');

        enableDrag(panel);
        bindLogic();
    }

    function bindLogic() {
        byId('dc-input').oninput = async function (e) {
            const value = e.target.value.trim();
            const out = byId('dc-output');

            if (value.length < 17) {
                out.innerHTML = '';
                return;
            }

            const user = await discordRequest('/users/' + value, 'user');

            if (user) {
                const profile = await discordRequest('/users/' + value + '/profile', 'profile');
                renderUser(user, profile);
                return;
            }

            const guild = await discordRequest('/guilds/' + value + '?with_counts=true', 'guild');
            if (guild) {
                renderGuild(guild);
            }
        };
    }

    function isAnimated(hash) {
        return hash && hash.startsWith('a_');
    }

    function renderUser(user, profile) {
        const avatar = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isAnimated(user.avatar) ? 'gif' : 'png'}`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';

        const banner = user.banner
            ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${isAnimated(user.banner) ? 'gif' : 'png'}`
            : null;

        const tags = [
            'BOT: ' + (user.bot ? 'YES' : 'NO'),
            'NITRO: ' + (profile && profile.premium_since ? 'YES' : 'NO')
        ];

        drawResult(user.username, user.id, avatar, banner, tags);
    }

    function renderGuild(guild) {
        const icon = guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${isAnimated(guild.icon) ? 'gif' : 'png'}`
            : null;

        const banner = guild.banner
            ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${isAnimated(guild.banner) ? 'gif' : 'png'}`
            : null;

        const tags = [
            'MEMBERS: ' + (guild.approximate_member_count || 0),
            'BOOSTS: ' + (guild.premium_subscription_count || 0)
        ];

        drawResult(guild.name, 'OWNER: ' + guild.owner_id, icon, banner, tags);
    }

    function drawResult(name, sub, icon, banner, tags) {
        const out = byId('dc-output');

        out.innerHTML = `
            <div class="dc-result">
                <div class="dc-banner" id="dc-banner">
                    ${banner ? `<img src="${banner}">` : ''}
                </div>
                <div class="dc-avatar-wrap">
                    <div class="dc-avatar" id="dc-avatar">
                        <img src="${icon}">
                    </div>
                </div>
                <div class="dc-info">
                    <div class="dc-name">${name}</div>
                    <div class="dc-sub">${sub}</div>
                    <div class="dc-tags">
                        ${tags.map(t => `<span class="dc-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        if (icon) byId('dc-avatar').onclick = (e) => downloadAsset(icon, name + '_icon', e);
        if (banner) byId('dc-banner').onclick = (e) => downloadAsset(banner, name + '_banner', e);
    }

    function enableDrag(el) {
        let px = 0, py = 0;

        el.querySelector('.dc-header').onmousedown = function (e) {
            px = e.clientX;
            py = e.clientY;

            document.onmousemove = function (e) {
                el.style.left = el.offsetLeft + (e.clientX - px) + 'px';
                el.style.top = el.offsetTop + (e.clientY - py) + 'px';
                px = e.clientX;
                py = e.clientY;
            };

            document.onmouseup = function () {
                document.onmousemove = null;
            };
        };
    }

    function boot() {
        const token = (localStorage.getItem('token') || '').replace(/"/g, '');
        if (!token || token.length < 50) {
            setTimeout(boot, 1000);
            return;
        }

        authToken = token;
        injectStyles();
        buildUI();
    }

    boot();
})();
