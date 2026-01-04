// ==UserScript==
// @name         Black Russia Forum
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Black Russia  Forum
// @author       King_Rangers
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://i.postimg.cc/tRN0SWBX/photo-2025-12-16-09-53-49.jpg
// @connect      i.postimg.cc
// @connect      api.imgbb.com
// @connect      *
// @run-at       document-start
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/559268/Black%20Russia%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/559268/Black%20Russia%20Forum.meta.js
// ==/UserScript==
(function() {
    'use strict';


        const STYLE_ID = 'blackrussia-custom-style-v111';
    const WELCOME_SCREEN_ID = 'br-style-welcome-screen-v111';
    const SCRIPT_VERSION = '2.0';
    const PANEL_ID = 'blackrussia-settings-panel-v111';
    const BOTTOM_NAV_ID = 'blackrussia-bottom-nav-bar-v111';
    const CLOCK_ID = 'br-style-clock-v111';
    const STYLE_ICON_ID = 'br-style-toggle-icon-v111';
    const EFFECTS_CONTAINER_ID = 'br-effects-container-v111';
    const BACKGROUND_ELEMENT_ID = 'br-style-background-v111';
    const TOAST_CONTAINER_ID = 'br-style-toast-container-v111';
    const SCROLL_INDICATOR_ID = 'br-style-scroll-indicator-v111';
    const UPLOAD_HISTORY_KEY = 'br_style_upload_history';
    const BOTTOM_NAV_HEIGHT = '45px';

       const MAX_IMAGE_SIZE_MB = 5;
    const PETAL_IMAGES = {};
    const WALLPAPER_GALLERY = {
        "<i class='fas fa-magic'></i> Разное": ["https://i.postimg.cc/rwrCzqTV/096dfed5a331f4647b82817bab90f327.jpg", "https://i.postimg.cc/6QVrLzyy/0ce2522a98106cefac3a6c60987ad2c1.jpg", "https://i.postimg.cc/QMZgTvNy/107f84b10d36383ebc6bb33cf61db817.jpg", "https://i.postimg.cc/X7XgSwDs/20ff313da04ee41cc082d9ea417fde29.jpg", "https://i.postimg.cc/QxVqGpnV/228c9975a3282e208ff4ceff6a78874c-(1).jpg", "https://i.postimg.cc/T1Nq5whj/237bf8d38ce665115287ea1e0f0d001d.jpg", "https://i.postimg.cc/kMTypjw5/2e0e318d883978f0481536082cbb48e6.jpg", "https://i.postimg.cc/JnPjSn3C/2eb216a9f408d1d3231408d6aea527e3.jpg", "https://i.postimg.cc/rwrCzqTF/39c85e4d6211a7533587204f84f89215.jpg", "https://i.postimg.cc/NMg1NTHH/44f8e0039d7346d1bddfa2c1d7cb13d4.jpg", "https://i.postimg.cc/28J7zVsp/46d15274d54e5560326cf25dc9f97c98.jpg", "https://i.postimg.cc/nz0qNz4q/4d2241c4a83c81441851e7d5e7028272.jpg", "https://i.postimg.cc/xT730cW4/4e62d6082309b7be6557c81e333ba4a8.jpg", "https://i.postimg.cc/c46cyQ5j/68d03765e2a158edd375fa842cf8b96a.jpg", "https://i.postimg.cc/8Cgd6xkv/6d191a51b2d2ccb397befc9b4be4b2b0.jpg", "https://i.postimg.cc/KYh7MCcV/74137379fd5a0682d5eb83ad21cbfe69.jpg", "https://i.postimg.cc/HsK9pVq1/7d2013040aa34a77a4943ff3747d2ce8.jpg", "https://i.postimg.cc/T3DqhTxP/830eccb28829c9d7a2c95401f072471f.jpg", "https://i.postimg.cc/rmQ57mGM/8605362b74f0925e5ec44ba8b70b12e0.jpg", "https://i.postimg.cc/ZYwLMfj3/8af2b6fd65c9d03b60bb7b0e5b0a0393.jpg", "https://i.postimg.cc/gJYvMRZ3/959a371122a5e2c0cca5cc4a318b1931.jpg", "https://i.postimg.cc/43v6bwmx/a1161f9285c06af217904f0cbdc6aad9.jpg", "https://i.postimg.cc/FKXbLwFw/a12f9d45e495196799f16e734e985e0d.jpg", "https://i.postimg.cc/1XXDSQMN/aae170a92387bf1954dccbc0dd6f590b.jpg", "https://i.postimg.cc/MKXY2yrt/aff014bd892d206c075d13bbb12ab88a.jpg", "https://i.postimg.cc/L81BhmSj/bcb59c3c5e2796e8cd40aa2200aec9cf.jpg", "https://i.postimg.cc/R0x1H2Cw/c031d0bfd11980e967ebf0890932e0e4.jpg", "https://i.postimg.cc/HW6thS3c/c1b97a29d14cb609567211918a520605.jpg", "https://i.postimg.cc/Qt0cvtQ6/c5b6cc6d7a2f1e3936dfcd450f672a49.jpg", "https://i.postimg.cc/yxx0KHnZ/c603d1f5a47030bb5895d29802af9b15.jpg", "https://i.postimg.cc/MKXY2yrd/c7bcafebba86b58fdaddd5b0bd3f27a0.jpg", "https://i.postimg.cc/8kZb0ywF/cba5566e4fc67c5112c2fa39caf47820.jpg", "https://i.postimg.cc/Hky4jTmJ/d84bcd3a8f93f62ebd164b74e680d793.jpg", "https://i.postimg.cc/YSN6f8jT/dc020d4fd909b338fdfc4390db08fafc.jpg", "https://i.postimg.cc/HW6thS3V/e082d0853ceeaaf17cd2e6e5d7ecfd27.jpg", "https://i.postimg.cc/qRj2WRcT/f2e4cd175487d3738f43f1f72b6a6a63.jpg", "https://i.postimg.cc/CLtsFzWc/f3644c40df02b28a1832dd097053bea1.jpg", "https://i.postimg.cc/mgHNhT4s/f56fd6ddf10ea8dff8c4ddd3353c01b0.jpg", "https://i.postimg.cc/SKbLMHQB/f831d4bff86b02bef593d76a33f201ad.jpg", "https://i.postimg.cc/bJzQ6btb/ff084323f1ad320baa1381c5ae728e2e.jpg"],
        "<i class='fas fa-tree'></i> Природа": ["https://i.postimg.cc/fThHC5J9/0185acd4ab82d25d60eef415adf19a2f.jpg", "https://i.postimg.cc/BQGhpNX4/30028eb3ab96fa9fa4c361a1481f4952.jpg", "https://i.postimg.cc/YqwXR8hv/7bd2995d3f3cb531afd718b714426ac9.jpg", "https://i.postimg.cc/SNpZdVJz/99dedb1c832c9c01bbffe979ac0298b5.jpg", "https://i.postimg.cc/wTdW2F7y/b3a35bba489d6306b454d8b089e1e4bd.jpg", "https://i.postimg.cc/Prk6yKPQ/c679a199d8f22d305b12ecf0ba7f0085-(1).jpg", "https://i.postimg.cc/Prk6yKPb/c80f1dfbd2605f7251c6337de63afba2.jpg", "https://i.postimg.cc/hPqCsMf9/d0d55c3c2dcd506fd0e1fab4cff6303e.jpg", "https://i.postimg.cc/WbP98Sh6/db80a3e81622370d4add365252121345.jpg", "https://i.postimg.cc/8kfmfYmC/2d332406197d20278a6add33a10c7507.jpg", "https://i.postimg.cc/PfvQv7Qx/469276dcef747a64f7852f8f7a0b94fb.jpg", "https://i.postimg.cc/XNBkBPkq/9462c11f99d851e2133b1b2474e5f14b.jpg", "https://i.postimg.cc/zDHFHQF5/f5a524b0d731a3a15e5700316b1c4cbd.jpg", "https://i.postimg.cc/Y2LzLPzC/fc63221ccd2f821d0d10312ab9a917c0.jpg", "https://i.postimg.cc/jdPVcZts/07a244796226ce7b18d994cdb5c676dc.jpg", "https://i.postimg.cc/J4ZwxPmx/0880a8943b1a4a68e00d74255d08b242.jpg", "https://i.postimg.cc/tCW0k2yD/0bd364d1bafd05f8a319574118c8127d-(1).jpg", "https://i.postimg.cc/15wxBJsm/0f3efb60fe8a7ee23408471c10494803.jpg", "https://i.postimg.cc/65nscYwP/1044297b290600b762afb82c15bae15c.jpg", "https://i.postimg.cc/NfmhDpYP/1a4baac8a11bb3a0e9affef725518ba4.jpg", "https://i.postimg.cc/3rP52PMf/1aed27558f343f06c5e4ac09d9f809ae.jpg", "https://i.postimg.cc/dQzPGzM3/25bd6fd4c7a3788993548eba635101ca.jpg", "https://i.postimg.cc/28hpG2rj/2a6ac84ccb57f9fefe2798dfbde25319.jpg", "https://i.postimg.cc/fTm4CBZ6/2b62da001ec93a3c56748aac28b5d62b.jpg", "https://i.postimg.cc/Vs3QX3yH/302b4fc779b7ba571e985b8594d88af1.jpg", "https://i.postimg.cc/h4HWVHF0/37ef3ecdd7290c544d3f985da3523a66.jpg", "https://i.postimg.cc/SQwFcw0r/3be529306ec559e6ccfa801b34b0d09f.jpg", "https://i.postimg.cc/RCj5wjrq/546d58a69d51b5525cd97a62395ff7fc.jpg", "https://i.postimg.cc/7Pp8Spvg/64de71a19c72c32c4cbcbbb0a08dad13.jpg", "https://i.postimg.cc/hPTFspct/656d41426bc16d1bba435e1c6bf8cdd6.jpg", "https://i.postimg.cc/02Dgncx0/6e81f9309ca7c329754b069a77c45acd.jpg", "https://i.postimg.cc/zXKm708Y/77a7713d630a2765a189fd1ff60f98c0.jpg", "https://i.postimg.cc/WbgR8Xj6/77ffa189c556187d1aca079e0248c473.jpg", "https://i.postimg.cc/xjkVJ9Zz/7ec94f09c0400795ff8c600f3c21a7d1.jpg", "https://i.postimg.cc/gcfF3f9x/871f07adb56b7dc714fd729c6166e6f3.jpg", "https://i.postimg.cc/jqG0yGV6/880435d08da4f6553ed9b561a1ffbf4a.jpg", "https://i.postimg.cc/XNTS9TMP/884179968ac3a009a2df453ea3fd4c8d.jpg", "https://i.postimg.cc/sD7FmwyJ/92b6237e0a7f2888768c4cf1fa43277d.jpg", "https://i.postimg.cc/jqG0yGV8/9bebf25f4b390925d133d7831d4f2164.jpg", "https://i.postimg.cc/Dftk1tVj/a10b2a4ed36974434fca78f68fb3d585.jpg", "https://i.postimg.cc/fW6nY643/b607d0645b48424aa8f1ca7a9507c4fc.jpg", "https://i.postimg.cc/J4ZwxPmp/b8ed4156118706620fee2e60065b8b91.jpg", "https://i.postimg.cc/L6LdDNRN/b95cd8439fc6b6ebf1b91ee3bef02c54.jpg", "https://i.postimg.cc/KcdStdXL/c158aa687941766bb9289c9011f5d5f4.jpg", "https://i.postimg.cc/ZKpkHV4J/cbb52a882105cf814a0a3ed2168eef37.jpg", "https://i.postimg.cc/gk89sNmF/d42730f8e96a8e329eee76ecd1e0af1c.jpg", "https://i.postimg.cc/9Xv5yv3b/d68de7971400377b0881565883e249bf.jpg", "https://i.postimg.cc/zD9ZT9mK/d891e51065322a04a50d661ab6fb470c.jpg", "https://i.postimg.cc/sD7FmwyN/db4dd589be056ab2b2191423f6f9e43c.jpg", "https://i.postimg.cc/pXzNCqxw/e8052342a0eda329224eabded4fd7653.jpg", "https://i.postimg.cc/GhG0Kqdd/ec73692ab65c02cd2df2ede2921136a1.jpg", "https://i.postimg.cc/Njc3zmjh/efc090eda495242466ff40e0d3fc5071.jpg", "https://i.postimg.cc/tCW0k2yv/f7f2ef062768ce8c6ab76eeb7dec58ad.jpg", "https://i.postimg.cc/3JmM1nYJ/ff0f47f7c359584ff3d6fad6d6f09957.jpg"],
        "<i class='fas fa-snowflake'></i> Новый год": ["https://i.postimg.cc/6qx2vMtP/358a87e9957fb2f8ca9dfd6a5fe67851.jpg", "https://i.postimg.cc/d3cky5JQ/42fc33a3f381c0d828b89c70d95fca04.jpg", "https://i.postimg.cc/brfDtmqX/51c5feacfee4e9f4a2a1792f9db8cd91.jpg", "https://i.postimg.cc/Xq6GCs41/83b13dbfa450907a40ac3cf32549ab71.jpg", "https://i.postimg.cc/C1qn53py/87d19b7e6d86e5133303770fe46dc9e1.jpg", "https://i.postimg.cc/D03JXxnM/991602375ac130dc5a043fc76d2ff221.jpg", "https://i.postimg.cc/sxCQhT3D/a5bc068f9e5010308334d36411147583.jpg", "https://i.postimg.cc/hvRzd2cH/a9de41f2b5e45a873b1327ce1b37ef28.jpg", "https://i.postimg.cc/Xq6GCsnV/adab9363d1771d6f3f4872d0ceb056f6.jpg", "https://i.postimg.cc/90HR7LCN/dbcf6265bb574a238ca1da34513de917.jpg", "https://i.postimg.cc/NFv9HdBZ/dfc77c71895d4f004c0687bf3c4d4801.jpg", "https://i.postimg.cc/Gtn8yXbw/f3e030c90ddb913650964ce6cfc0e1d8.jpg"],
        "<i class='fas fa-city'></i> Город": ["https://i.postimg.cc/50Ljb8LG/15020ac296aa3ab8b8da46db65777710-(1).jpg", "https://i.postimg.cc/j5PCtyPv/182f03ba7db4be84edda6fdc52f5b6a7.jpg", "https://i.postimg.cc/JnZtMjZ2/5b10b689b889be48a61e419c7534ad40.jpg", "https://i.postimg.cc/JnZtMjZp/5d3e6f3b56d7530d57e6cc76bbb8e37f.jpg", "https://i.postimg.cc/tTW7pFWw/5e22910a69edb226b865bbafa18a285c.jpg", "https://i.postimg.cc/vBfDb5f3/802a726c4e09ef60773b6e9b5d334da7.jpg", "https://i.postimg.cc/Qt1Vhc1J/86e07779c2ea825ca3ad7c185a08d2a6.jpg", "https://i.postimg.cc/k4KDqWKs/c57fd23ca8031721d6c176afbb9f7182.jpg", "https://i.postimg.cc/Qt1Vhc1z/d6880e813d0cee6298e7e16cfbe5d192.jpg"],
        "<i class='fas fa-ghost'></i> Аниме": ["https://i.postimg.cc/LsZ83jCg/091472f1ecb725e6ac371faea4ffbebe.jpg", "https://i.postimg.cc/KYg8DtqP/1c9fe641e56e8a86cf588be30cb8c74d.jpg", "https://i.postimg.cc/3wDxF2Sp/20f116c27cfb3bfc105a7f918b1f2bc8.jpg", "https://i.postimg.cc/Zqy5x67R/33d13e57b4d58f1c7b4f67e91b194774.jpg", "https://i.postimg.cc/CKfxsbPK/4a99d606ecdcb8972504cf41fe47cc2b.jpg", "https://i.postimg.cc/Pq85Q13X/5de4f7a34b32ad89ae56b0ba7a1b82c4.jpg", "https://i.postimg.cc/xdb13Lx8/6fb485c2ffb3c57a2fd416fc9830f060.jpg", "https://i.postimg.cc/hG7t1Vyt/8b0d7db4f7899489c7c8f2be3a6aea80.jpg", "https://i.postimg.cc/VNbkWXGr/8dc2f6fda9f6c1f68fa36671bce31ef6.jpg", "https://i.postimg.cc/XvyYk9Hd/c83aa4cdbff2241148e27d99d8180485.jpg", "https://i.postimg.cc/vm6Zt5qn/e48cb63a72d65419b05229ba8cdab4e2.jpg", "https://i.postimg.cc/k5tgvW1W/fb6aefae8686b08cc6fcf67613d8f7da.jpg", "https://i.postimg.cc/rmM2R4vq/037871995e93b6a628110a6e2514379e.jpg", "https://i.postimg.cc/cH0Gt3VG/14ea9b63668d521a1024e986c4bec707.jpg", "https://i.postimg.cc/Y2LzLPzC/2d65eec34a18847d59591490f41cdb77.jpg", "https://i.postimg.cc/NMBv2XWw/3327ac2c881524bebcb7c77c24c85fd5.jpg", "https://i.postimg.cc/cH0Gt3Vq/3b64cac23b23a01c24eca1d5652adb97.jpg", "https://i.postimg.cc/9MCHw9vh/52ba18f5d2a4a7fae730177e862d4eb3.jpg", "https://i.postimg.cc/FRNXkSwW/7966fd70c891a9d00319ddf4800e80c6.jpg", "https://i.postimg.cc/QthZK7RD/8a29c6d382f48b3dd5383eff67413f65.jpg", "https://i.postimg.cc/zB8YHh49/b8593e6d4ccb79212e52a3357157350d.jpg", "https://i.postimg.cc/0QP1KSLk/be394c425ab59b37259f8e582af4ba92.jpg", "https://i.postimg.cc/DZn34Gtn/c5c1ce89f8eb88b5d3ad494a8f4c3b30.jpg", "https://i.postimg.cc/Twfv5bZR/d400dcdb653b74ae19834a089508bf81.jpg", "https://i.postimg.cc/63tx4ZFk/da698024f3af035bf8f84c01810bfe80.jpg", "https://i.postimg.cc/W3TcqZx8/e72f6d9de0503ea952fbdd07e655f016-(1).jpg", "https://i.postimg.cc/d1wcZCgg/f70de7b94e14a65578facc8f9d18f4bf.jpg", "https://i.postimg.cc/d1wcZCgN/f8337684ee6984b2198dacee61479183.jpg", "https://i.postimg.cc/fLDQSd1H/fa98fb37dd17e516663d8b4aad6894f4.jpg"]
    };

    let settingsPanel = null;
    let settingsIcon = null;
    let bottomNavElement = null;
    let clockElement = null;
    let effectsContainer = null;
    let toastContainer = null;
    let myUsername = null;
    let domObserver = null;
    let scrollObserver = null;
    let scrollIndicatorElement = null;
    let currentSettings = {};
    let lastScrollTop = 0;
    let threadAuthor = null;
let brWorker = null;

    const WORKER_SOURCE = `
    self.onmessage = function(e) {
        const { type, payload } = e.data;

        if (type === 'PROCESS_ADMINS') {
            const { html, nicks } = payload;
            const found = [];
            const lowerNicks = nicks.map(n => n.toLowerCase());

            const regex = /class="username[^>]*>([^<]+)</g;
            let match;
            const online = [];

            while ((match = regex.exec(html)) !== null) {
                online.push(match[1].trim().toLowerCase());
            }

            lowerNicks.forEach(nick => {
                if (online.includes(nick)) {
                    found.push(nick);
                }
            });

            self.postMessage({ type: 'ADMINS_RESULT', data: found });
        }

        if (type === 'PROCESS_COUNTERS') {
            const { html } = payload;
            const alertsMatch = html.match(/class="p-nav-link--alerts[^"]*"[^>]*data-badge="(\d+)"/);
            const convsMatch = html.match(/class="p-nav-link--conversations[^"]*"[^>]*data-badge="(\d+)"/);

            self.postMessage({
                type: 'COUNTERS_RESULT',
                data: {
                    alerts: alertsMatch ? parseInt(alertsMatch[1]) : 0,
                    conversations: convsMatch ? parseInt(convsMatch[1]) : 0
                }
            });
        }
    };
    `;

    function setupBrWorker() {
        if (brWorker) return;
        const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
        brWorker = new Worker(URL.createObjectURL(blob));

        brWorker.onmessage = function(e) {
            const { type, data } = e.data;

            if (type === 'ADMINS_RESULT') {
                data.forEach(nick => {
                    if (!notifiedAdmins.has(nick)) {
                        showToast(`⚡ ${nick} вошел на форум!`, 'info', 5000);
                        notifiedAdmins.add(nick);
                    }
                });
            }

            if (type === 'COUNTERS_RESULT') {
                const updateBadge = (sel, count) => {
                    const el = document.querySelector(sel);
                    if (!el) return;
                    const current = parseInt(el.textContent.trim()) || 0;
                    if (count > 0) {
                        el.textContent = count;
                        el.style.display = '';
                        if (count > current) {
                            el.classList.add('br-counter-pop');
                            setTimeout(() => el.classList.remove('br-counter-pop'), 700);
                        }
                    } else {
                        el.style.display = 'none';
                    }
                };

                updateBadge('.p-nav-link--alerts .badge', data.alerts);
                updateBadge('.p-nav-link--conversations .badge', data.conversations);
            }
        };
    }

const defaultSettings = {
        bgImageDataUri: '', opacityValue: 0.3, borderRadius: '10px', bgColor: '#18181b', enableRounding: true,
        enableEdge: true, edgeColor: '#4A90E2', edgeWidth: '1px', edgeOpacity: 0.5, edgeStyle: 'cloud_glow',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        transparentElementsOpacity: 1, enableGradient: false, gradientColor1: '#333333', gradientColor2: '#000000',
        gradientColor3: '#555555', gradientColor4: '#222222', gradientDirection: '135deg',
        enableAnimatedGradient: false, animatedGradientSpeed: '5s',
        enableBottomNav: true, bottomNavOpacity: 0.85, bottomNavBorderRadius: '25px', bottomNavPosition: 'bottom-center',
        quickLinks: [{ name: 'Главная', url: 'https://forum.blackrussia.online/', icon: 'fas fa-home' }, { name: 'Правила', url: 'https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.10/', icon: 'fas fa-gavel' }, { name: 'Жалобы', url: 'https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.14/', icon: 'fas fa-exclamation-shield' }],
        enableTextGlow: false, textGlowColor: '#FFFF00', textGlowIntensity: '5px',
        effectType: 'none', effectIntensity: 50, effectSpeed: 1, effectSwayIntensity: 1, effectRainLength: 20,
        customPresets: {}, enableBlockBlur: false, blockBlurAmount: 5,
        enableOwnMessageHighlight: false, ownMessageHighlightBgColor: '#2c3e50', ownMessageHighlightEdgeColor: '#3498db', ownMessageHighlightEdgeWidth: '0.2px',
        enablePageTransition: false, pageTransitionType: 'fade-in', pageTransitionDuration: 0.5,
        enableAvatarBorder: false, avatarBorderColor1: '#FF00DE', avatarBorderColor2: '#00F0FF', avatarBorderColor3: '#00FF85', avatarBorderSize: '2px', avatarBorderSpeed: '3s', avatarBorderStyle: 'gradient', avatarPulsateColor: '#FFFFFF',
        enablePulsatingNicks: false, pulsatingNickColor: '#FFFFFF', pulsatingNickIntensity: 1.1, pulsatingNickSpeed: '2s',
        enableGradientNicks: false, gradientNickColor1: '#FFFFFF', gradientNickColor2: '#00F0FF', gradientNickColor3: '#FF00DE', gradientNickSpeed: '3s',
        enableUiAnimations: false, uiAnimationSpeed: '0.2s',
        enableScrollFadeIn: true, scrollFadeInType: 'fade-in-up',
        enableParallaxScroll: false, enableScrollIndicator: true, scrollIndicatorColor: '#00F0FF', scrollIndicatorHeight: '3px',
        enableWideMode: false,
        enableOpHighlight: true, opHighlightBgColor: '#3a2e4a', opHighlightEdgeColor: '#9b59b6', opHighlightEdgeWidth: '1px',
        enableSmartNav: true, enable3DAvatarHover: false, enableLikeAnimations: false,
        enableDynamicWelcome: true, enableInteractiveParticles: false,
        enableContextualBackgrounds: false, contextualBgUrl: 'zhaloby', contextualBgPreset: 'default_dark',
        enableLiveCounters: true, enableLiveFeed: true, enableAdminOnlineToast: true, adminToastNicks: 'King_Rangers\nClayton_Hemingway',
        enableHotTopicPulse: false, liveUpdateInterval: 60,
        imgbbApiKey: '', uploaderBtnBgUrl: '',
        enableComplaintTracker: true, complaintTrackerWarnTime: 12, complaintTrackerCritTime: 24, complaintTrackerSections: 'жалоб, обжалован, техническ, биографи, заявлен',
        panelTheme: 'classic_dark', enableTopicAnimation: false, topicAnimationType: 'fade-in',
        enableBinder: true, bottomNavTheme: 'nav_theme_fire', enableThreadPreview: false, enableSectionStats: true, enableSkeletonLoading: true, enableCopyToast: true,
    };

    const availableFonts = [
        { name: "Стандартный (System)", value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', url: '' },
        { name: "Roboto (Android Default)", value: '"Roboto", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
        { name: "Montserrat (Современный)", value: '"Montserrat", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap' },
        { name: "Open Sans (Нейтральный)", value: '"Open Sans", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap' },
        { name: "Oswald (Строгий/Громкий)", value: '"Oswald", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&display=swap' },
        { name: "Nunito (Мягкий/Круглый)", value: '"Nunito", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap' },
        { name: "Comfortaa (Футуристичный)", value: '"Comfortaa", cursive', url: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap' },
        { name: "Playfair Display (Элегантный)", value: '"Playfair Display", serif', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
        { name: "Orbitron (Киберпанк)", value: '"Orbitron", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap' },
        { name: "Merriweather (Для чтения)", value: '"Merriweather", serif', url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap' },
        { name: "Press Start 2P (Пиксельный)", value: '"Press Start 2P", cursive', url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' }
    ];
    const builtInPresets = {
        'new_year': { enableGradient: true, gradientColor1: '#0a1931', gradientColor2: '#173a6a', gradientColor3: '#ffffff', gradientColor4: '#0a1931', gradientDirection: '135deg', enableAnimatedGradient: true, animatedGradientSpeed: '15s', bgColor: '#1a2a47', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 3, enableRounding: true, borderRadius: '10px', enableEdge: true, edgeColor: '#ffffff', edgeWidth: '1px', edgeOpacity: 0.7, enableTextGlow: true, textGlowColor: '#cce7ff', textGlowIntensity: '8px', effectType: 'snow', effectIntensity: 100, effectSpeed: 1, effectSwayIntensity: 1.2, enableAvatarBorder: true, avatarBorderColor1: '#ffffff', avatarBorderColor2: '#cce7ff', avatarBorderColor3: '#89cff0', enablePulsatingNicks: false, enableUiAnimations: true, enableTopicAnimation: true, enableScrollIndicator: true, scrollIndicatorColor: '#ffffff' },
        'halloween': { enableGradient: true, gradientColor1: '#1a0000', gradientColor2: '#ff6600', gradientColor3: '#000000', gradientColor4: '#3d0000', gradientDirection: '45deg', enableAnimatedGradient: true, animatedGradientSpeed: '10s', bgColor: '#2b0f00', opacityValue: 0.9, enableBlockBlur: false, enableRounding: true, borderRadius: '6px', enableEdge: true, edgeColor: '#ff6600', edgeWidth: '2px', edgeOpacity: 0.8, enableTextGlow: true, textGlowColor: '#ff9900', textGlowIntensity: '10px', effectType: 'leaves-autumn_maple', effectIntensity: 60, effectSpeed: 0.8, effectSwayIntensity: 1, enableAvatarBorder: true, avatarBorderColor1: '#ff6600', avatarBorderColor2: '#f0ad4e', avatarBorderColor3: '#000000', enablePulsatingNicks: true, pulsatingNickColor: '#ff6600', pulsatingNickIntensity: 1.1, pulsatingNickSpeed: '2s', enableUiAnimations: true, enableTopicAnimation: true, enableScrollIndicator: true, scrollIndicatorColor: '#ff6600' },
        'cyberpunk': { enableGradient: true, gradientColor1: '#000000', gradientColor2: '#ff00ff', gradientColor3: '#00ffff', gradientColor4: '#000000', gradientDirection: '45deg', enableAnimatedGradient: true, animatedGradientSpeed: '6s', bgColor: '#1a001a', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 2, enableRounding: true, borderRadius: '2px', enableEdge: true, edgeColor: '#00ffff', edgeWidth: '1px', edgeOpacity: 0.8, enableTextGlow: true, textGlowColor: '#ff00ff', textGlowIntensity: '10px', effectType: 'matrix', effectIntensity: 90, effectSpeed: 1.2, effectRainLength: 18, enableAvatarBorder: true, avatarBorderColor1: '#ff00ff', avatarBorderColor2: '#00ffff', avatarBorderColor3: '#F0FF00', enablePulsatingNicks: true, pulsatingNickColor: '#00ffff', pulsatingNickIntensity: 1.05, pulsatingNickSpeed: '1.5s', enableUiAnimations: true, enableTopicAnimation: true, enableScrollIndicator: true, scrollIndicatorColor: '#00ffff' },
        'valentines': { ...defaultSettings, enableGradient: true, gradientColor1: '#ffc0cb', gradientColor2: '#e63946', gradientColor3: '#ffffff', gradientColor4: '#ffb6c1', gradientDirection: '135deg', enableAnimatedGradient: true, animatedGradientSpeed: '12s', bgColor: '#3d1a2a', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 3, enableRounding: true, borderRadius: '22px', enableEdge: true, edgeColor: '#ff8fab', edgeWidth: '1px', edgeOpacity: 0.7, enableTextGlow: true, textGlowColor: '#ffc0cb', textGlowIntensity: '8px', effectType: 'petals-red_rose', effectIntensity: 60, effectSpeed: 0.8, effectSwayIntensity: 1.5, enableAvatarBorder: true, avatarBorderColor1: '#ff0054', avatarBorderColor2: '#ffffff', avatarBorderColor3: '#ff8fab', enablePulsatingNicks: true, pulsatingNickColor: '#ff8fab', pulsatingNickIntensity: 1.05, enableGradientNicks: false, enableScrollIndicator: true, scrollIndicatorColor: '#ff0054' },
        'womens_day': { ...defaultSettings, enableGradient: true, gradientColor1: '#f8c5c8', gradientColor2: '#a4d4ae', gradientColor3: '#ffffff', gradientColor4: '#fffdd0', gradientDirection: '45deg', enableAnimatedGradient: true, animatedGradientSpeed: '15s', bgColor: '#333333', opacityValue: 0.85, enableBlockBlur: true, blockBlurAmount: 4, enableRounding: true, borderRadius: '10px', enableEdge: true, edgeColor: '#90ee90', edgeWidth: '1px', edgeOpacity: 0.8, enableTextGlow: true, textGlowColor: '#d4ffb8', textGlowIntensity: '6px', effectType: 'petals-sakura', effectIntensity: 70, effectSpeed: 1, effectSwayIntensity: 1.3, enableAvatarBorder: true, avatarBorderColor1: '#f8c5c8', avatarBorderColor2: '#90ee90', avatarBorderColor3: '#fffdd0', enablePulsatingNicks: false, enableGradientNicks: true, gradientNickColor1: '#f8c5c8', gradientNickColor2: '#90ee90', gradientNickColor3: '#f8c5c8', enableScrollIndicator: true, scrollIndicatorColor: '#f8c5c8' },
        'victory_day': { ...defaultSettings, enableGradient: true, gradientColor1: '#000000', gradientColor2: '#ff6600', gradientColor3: '#d90429', gradientColor4: '#000000', gradientDirection: 'to right', enableAnimatedGradient: true, animatedGradientSpeed: '10s', bgColor: '#1c1c1c', opacityValue: 0.9, enableBlockBlur: false, enableRounding: true, borderRadius: '4px', enableEdge: true, edgeColor: '#ff6600', edgeWidth: '2px', edgeOpacity: 0.9, enableTextGlow: true, textGlowColor: '#fca311', textGlowIntensity: '10px', effectType: 'none', enableAvatarBorder: true, avatarBorderStyle: 'pulsate', avatarPulsateColor: '#fca311', avatarBorderSpeed: '2s', enablePulsatingNicks: true, pulsatingNickColor: '#ff6600', pulsatingNickIntensity: 1.1, enableGradientNicks: false, enableScrollIndicator: true, scrollIndicatorColor: '#ff6600' },
        'ramadan': { ...defaultSettings, enableGradient: true, gradientColor1: '#004d40', gradientColor2: '#ffd700', gradientColor3: '#ffffff', gradientColor4: '#00695c', gradientDirection: '135deg', enableAnimatedGradient: true, animatedGradientSpeed: '14s', bgColor: '#003d33', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 2, enableRounding: true, borderRadius: '8px', enableEdge: true, edgeColor: '#ffd700', edgeWidth: '0.3px', edgeOpacity: 0.8, enableTextGlow: true, textGlowColor: '#fff59d', textGlowIntensity: '8px', effectType: 'fireflies', effectIntensity: 50, effectSpeed: 0.7, effectSwayIntensity: 1, enableAvatarBorder: true, avatarBorderColor1: '#ffd700', avatarBorderColor2: '#ffffff', avatarBorderColor3: '#00796b', enablePulsatingNicks: false, enableGradientNicks: true, gradientNickColor1: '#ffd700', gradientNickColor2: '#ffffff', gradientNickColor3: '#fff59d', enableScrollIndicator: true, scrollIndicatorColor: '#ffd700' },
        'default_dark': { ...defaultSettings }
    };
    const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';

    function hexToRgb(hex) { if (!hex || typeof hex !== 'string') return null; const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }
    function readFileAsDataURL(file) { return new Promise((resolve, reject) => { if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) { reject(new Error(`Файл слишком большой! Макс. размер: ${MAX_IMAGE_SIZE_MB} МБ.`)); return; } const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = (error) => reject(error); reader.readAsDataURL(file); }); }
    function downloadFile(filename, content, contentType) { const blob = new Blob([content], { type: contentType }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
    function isValidEffectType(type) { return ['none', 'rain', 'snow', 'petals-sakura', 'petals-red_rose', 'leaves-autumn_maple', 'fireflies', 'matrix', 'bubbles'].includes(type); }
    function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }
    function isValidURL(str) { if (!str || typeof str !== 'string') return false; try { new URL(str); return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('ftp://'); } catch (_) { return str.startsWith('/'); } }
    function getRandomInRange(min, max) { return Math.random() * (max - min) + min; }
    function getRandomIntInRange(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; }
    function observeDOM(targetNode, callback, options = { childList: true, subtree: true }) { if (!targetNode) return null; const observer = new MutationObserver(callback); observer.observe(targetNode, options); return observer; }
    function injectScript(src) { return new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.async = true; script.onload = resolve; script.onerror = reject; (document.head || document.documentElement).appendChild(script); }); }
    function injectStyle(href) { return new Promise((resolve, reject) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.onload = resolve; link.onerror = reject; (document.head || document.documentElement).appendChild(link); }); }

    function createRipple(event) {
        const button = event.currentTarget;
        if (!button) return;

        let rippleContainer = button.querySelector('.br-ripple-container');
        if (!rippleContainer) {
            rippleContainer = document.createElement('div');
            rippleContainer.className = 'br-ripple-container';
            button.appendChild(rippleContainer);
        }

        const ripple = document.createElement('span');
        ripple.className = 'br-ripple-effect';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        rippleContainer.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }


    let capsuleTimer;

    function showToast(message, type = 'info', duration = 3000) {
        let container = document.getElementById('br-capsule-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'br-capsule-container';
            container.innerHTML = `
                <div id="br-capsule">
                    <div class="br-capsule-content">
                        <span class="br-capsule-icon"></span>
                        <span class="br-capsule-text"></span>
                    </div>
                </div>`;
            document.body.appendChild(container);
        }

        const capsule = document.getElementById('br-capsule');
        const iconEl = capsule.querySelector('.br-capsule-icon');
        const textEl = capsule.querySelector('.br-capsule-text');

        let iconHtml = '<i class="fas fa-info-circle c-info"></i>';
        if (type === 'success') iconHtml = '<i class="fas fa-check-circle c-success"></i>';
        if (type === 'error') iconHtml = '<i class="fas fa-exclamation-triangle c-error"></i>';
        if (type === 'loading') iconHtml = '<i class="fas fa-spinner fa-spin c-load"></i>';

        clearTimeout(capsuleTimer);

        iconEl.innerHTML = iconHtml;
        textEl.textContent = message;

        if (!capsule.classList.contains('br-active')) {
            requestAnimationFrame(() => {
                capsule.classList.add('br-active');
            });
        }

        capsuleTimer = setTimeout(() => {
            capsule.classList.remove('br-active');
        }, duration);
    }

function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function validateSetting(key, value, defaultValue) {
        const dValue = (defaultValue !== undefined) ? defaultValue : defaultSettings[key];
        const dType = typeof dValue;

        if (dType === 'boolean') {
            return (value === true || value === 'true');
        }

        if (dType === 'number') {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) return dValue;

            let numValue = parsedValue;
            switch(key) {
                case 'opacityValue': case 'edgeOpacity': case 'bottomNavOpacity': case 'transparentElementsOpacity':
                    return Math.max(0, Math.min(1, numValue));
                case 'effectIntensity':
                    return Math.max(10, Math.min(200, parseInt(numValue, 10)));
                case 'effectSpeed':
                    return Math.max(0.1, Math.min(5, numValue));
                case 'effectSwayIntensity':
                    return Math.max(0, Math.min(3, numValue));
                case 'effectRainLength': case 'blockBlurAmount':
                    return Math.max(0, Math.min(50, parseInt(numValue, 10)));
                case 'pageTransitionDuration': case 'pulsatingNickIntensity':
                    return Math.max(0.1, Math.min(2, numValue));
                default:
                    return Number.isInteger(dValue) ? parseInt(numValue, 10) : numValue;
            }
        }

        if (dType === 'string') {
        const strValue = (value !== null && value !== undefined) ? String(value).trim() : String(dValue);
        if (strValue === '' || strValue.toLowerCase() === 'null' || strValue.toLowerCase() === 'undefined') return dValue;

            if (key === 'effectType' && !isValidEffectType(strValue)) return dValue;
            if (key === 'pageTransitionType' && !['fade-in', 'slide-in-left', 'slide-in-right', 'zoom-in'].includes(strValue)) return dValue;

            const validateUnit = (val, unit) => /^\d+(\.\d+)?$/.test(val) ? `${val}${unit}` : (new RegExp(`^\\d+(\\.\\d+)?${unit}$`).test(val) ? val : dValue);

            if (['borderRadius', 'edgeWidth', 'textGlowIntensity', 'ownMessageHighlightEdgeWidth', 'avatarBorderSize', 'scrollIndicatorHeight'].includes(key)) {
                return validateUnit(strValue, 'px');
            }
            if (['animatedGradientSpeed', 'avatarBorderSpeed', 'pulsatingNickSpeed', 'uiAnimationSpeed'].includes(key)) {
                return validateUnit(strValue, 's');
            }
            return strValue;
        }

        if (dType === 'object' && dValue !== null) {
            let parsedObj = value;
            if (typeof parsedObj === 'string') {
                try { parsedObj = JSON.parse(parsedObj); } catch (e) { parsedObj = dValue; }
            }
            if (key === 'quickLinks') {
                return Array.isArray(parsedObj) ? parsedObj.filter(l => l && l.name && l.url) : dValue;
            }
            return (typeof parsedObj === 'object' && parsedObj !== null && !Array.isArray(parsedObj)) ? parsedObj : dValue;
        }
        return value;
    }

    function addQuickLinkInput(container, link = { name: '', url: '' }) {
        if (!container) return;
        const linkInputDiv = document.createElement('div');
        linkInputDiv.className = 'quick-link-input-item';
        linkInputDiv.innerHTML = `
            <input type="text" class="quick-link-name" placeholder="Название" value="${link.name || ''}">
            <input type="text" class="quick-link-url" placeholder="URL (https://...)" value="${link.url || ''}">
            <button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить ссылку">➖</button>
        `;
        container.appendChild(linkInputDiv);
linkInputDiv.querySelector('.remove-quick-link-btn').addEventListener('click', (e) => {
            createRipple(e);
            linkInputDiv.remove();
        });    }

async function loadSettings() {
    const SIG = "S2luZ19SYW5nZXJz";
    currentSettings = {};
    const tempDefault = { ...defaultSettings };

    if (GM_info.script.author !== atob(SIG)) {
        currentSettings = {
            ...defaultSettings,
            opacityValue: 0,
            bgColor: '#ff0000',
            borderRadius: '50%',
            enableBlockBlur: true,
            blockBlurAmount: 20
        };
        return;
    }

        try {
            const settingKeys = Object.keys(tempDefault);
            const loadedValues = await Promise.all(settingKeys.map(key => GM_getValue(key, tempDefault[key])));
            settingKeys.forEach((key, index) => {
                currentSettings[key] = validateSetting(key, loadedValues[index], tempDefault[key]);
            });
            if (!currentSettings.quickLinks || !Array.isArray(currentSettings.quickLinks) || currentSettings.quickLinks.length === 0) {
                currentSettings.quickLinks = tempDefault.quickLinks;
            }
            if (typeof currentSettings.customPresets !== 'object' || currentSettings.customPresets === null || Array.isArray(currentSettings.customPresets)) {
                currentSettings.customPresets = tempDefault.customPresets;
            }
            Object.keys(builtInPresets['default_dark']).forEach(key => {
                if (currentSettings[key] === undefined) {
                    currentSettings[key] = defaultSettings[key];
                }
            });

            if (window.innerWidth < 800) {
                currentSettings.enableSmartNav = false;
                currentSettings.enableParallaxScroll = false;
                currentSettings.enableBlockBlur = false;
            }

        } catch (e) {
            console.error(e);
            currentSettings = { ...defaultSettings };
        }
    }

    async function saveSettings(settingsToSave) {
        try {
            const savePromises = [];
            const validatedSettings = {};
            const allKeys = { ...defaultSettings, ...settingsToSave };
            for (const key in allKeys) {
                if (defaultSettings.hasOwnProperty(key)) {
                    let valueToValidate = settingsToSave.hasOwnProperty(key) ? settingsToSave[key] : currentSettings[key];
                    let validatedValue = validateSetting(key, valueToValidate, defaultSettings[key]);
                    let valueToStore = validatedValue;

                    if (key === 'quickLinks' && Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    } else if (key === 'customPresets' && typeof valueToStore === 'object' && valueToStore !== null && !Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    }
                    savePromises.push(GM_setValue(key, valueToStore));
                    validatedSettings[key] = validatedValue;
                } else if (settingsToSave.hasOwnProperty(key)) {
                     console.warn(`[BR Style] Попытка сохранить неизвестный ключ: ${key}`);
                }
            }
            await Promise.all(savePromises);
            currentSettings = { ...currentSettings, ...validatedSettings };
            return true;
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения настроек!', e);
            showToast('[BR Style] Ошибка сохранения настроек!', 'error');
            return false;
        }
    }

    function applyForumStyles(settings) {
        const selectedFontObj = availableFonts.find(f => f.value === settings.fontFamily);
        if (selectedFontObj && selectedFontObj.url) {
            const fontLinkId = 'br-custom-font-loader';
            let fontLink = document.getElementById(fontLinkId);
            if (!fontLink) {
                fontLink = document.createElement('link');
                fontLink.id = fontLinkId;
                fontLink.rel = 'stylesheet';
                document.head.appendChild(fontLink);
            }
            if (fontLink.href !== selectedFontObj.url) {
                fontLink.href = selectedFontObj.url;
            }
        }

        let styleElement = document.getElementById(STYLE_ID);
        if (!styleElement) {
            styleElement = document.createElement('style'); styleElement.id = STYLE_ID; styleElement.type = 'text/css';
            (document.head || document.documentElement).appendChild(styleElement);
        }
        try {
            const cachedRgb = {}; const getRgb = (hex) => { if (!cachedRgb[hex]) cachedRgb[hex] = hexToRgb(hex); return cachedRgb[hex]; };
            const mainBgRgb = getRgb(settings.bgColor);
            const mainElementBgColor = mainBgRgb ? `rgba(${mainBgRgb.r}, ${mainBgRgb.g}, ${mainBgRgb.b}, ${settings.opacityValue})` : defaultSettings.bgColor;
            const edgeRgb = getRgb(settings.edgeColor);
            const edgeColorWithOpacity = edgeRgb ? `rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, ${settings.edgeOpacity})` : 'transparent';
            const edgeWidthValue = (typeof settings.edgeWidth === 'number') ? `${settings.edgeWidth}px` : settings.edgeWidth;
            const finalEdgeBoxShadow = 'none';
            const borderRadiusValue = (typeof settings.borderRadius === 'number') ? `${settings.borderRadius}px` : settings.borderRadius;
            const finalBorderRadius = settings.enableRounding ? borderRadiusValue : '0px';
            const fallbackBgColor = settings.bgColor || '#1e1e1e';
            const bottomNavBaseBgRgb = getRgb('#380202');
            const bottomNavFinalBgColor = bottomNavBaseBgRgb ? `rgba(${bottomNavBaseBgRgb.r}, ${bottomNavBaseBgRgb.g}, ${bottomNavBaseBgRgb.b}, ${settings.bottomNavOpacity})` : '#222222';
            let bottomNavPositionStyle = ''; const navBarOffset = '10px';
            const safeBottom = `max(${navBarOffset}, env(safe-area-inset-bottom) + 15px)`;

            switch (settings.bottomNavPosition) {
                case 'bottom-left': bottomNavPositionStyle = `bottom: ${safeBottom}; top: auto; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'bottom-right': bottomNavPositionStyle = `bottom: ${safeBottom}; top: auto; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'top-left': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'top-center': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: 50%; right: auto; transform: translateX(-50%);`; break;
                case 'top-right': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'middle-left': bottomNavPositionStyle = `bottom: auto; top: 50%; left: ${navBarOffset}; right: auto; transform: translateY(-50%);`; break;
                case 'middle-right': bottomNavPositionStyle = `bottom: auto; top: 50%; left: auto; right: ${navBarOffset}; transform: translateY(-50%);`; break;
                case 'bottom-center': default: bottomNavPositionStyle = `bottom: ${safeBottom}; top: auto; left: 50%; right: auto; transform: translateX(-50%);`; break;
            }
const mainElementsSelector = '.block-container, .block-filterBar, .message-inner, .widget-container .widget, .bbCodeBlock-content, .formPopup .menu-content, .tooltip-content, .structItem, .notice-content, .overlay-container .overlay-content, .p-header, .p-nav, .p-navSticky.is-sticky .p-nav, .p-footer, .offCanvasMenu-content, .p-body, .p-body-header, .p-body-sidebar, .menu, .menu-content, .menu-row, .menu-linkRow, .menu-header, .menu-footer, .menu-scroller, .menu-separator, .pageHeader, .pageNav, .pageNav-page, .pageNav-jump, .tabs-tab, .tabs--standalone, .block-header, .block-minorHeader, .block-tabHeader, .block-footer, .block-formSection, .block-formRow, .filterBar, .filterBar-menuTrigger, .p-footer-inner, .p-footer-row, .p-sectionLinks, .uix_extendedFooterRow, .fr-toolbar, .fr-box, .input, .p-breadcrumbs, .memberTooltip, .memberTooltip-content, .tooltip, .reactionsBar, .p-quickSearch, .attachedFiles, .bbCodeCode';

const transparentElementsSelector = '.p-body-inner, .message, .message-cell, .block-body, .bbCodeBlock, .bbCodeBlock-title, .widget-container, .notice, .overlay-container .overlay, .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-command.fr-btn+.fr-dropdown-menu, .fr-box.fr-basic, button.button, a.button.button--link, .input, .input:focus, .input.is-focused, .select, .inputGroup, .inputGroup-text, .formRow, .formRow .input, .block-minorTabHeader, .blockMessage, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row, .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link, .offCanvasMenu-linkHolder, .offCanvasMenu-list, .offCanvasMenu-subList, .formPopup-outer, .inputChoices, .inputChoices-choice, .button--primary, .button--plain, .button--icon, .p-navEl, .p-navEl-link, .hScroller-action, .p-sectionLinks-list, .blockLink, .uix_extendedFooterRow .block-container, .uix_extendedFooterRow .block-body, .p-nav-search, .p-nav-search .input, .p-breadcrumbs--parent, .p-breadcrumbs--child, .node-main, .node-stats, .node-extra, .node-icon, .structItem-cell, .structItem-parts, .memberHeader, .memberHeader-content, .memberHeader-main, .fr-wrapper, .fr-element, .fr-popup, .menu-link';

const pageWrapperSelector = '.p-pageWrapper';

const fontTargetSelector = `
*:not(.fa):not(.fas):not(.far):not(.fab):not(.fal):not(.fad):not([class*="fa-"]):not(i):not(.material-icons)
`.trim();

const textGlowTargetSelector = `
a:not(.button):not(.tabs-tab),
.p-title-value,
.structItem-title a,
.node-title a,
${settings.enableGradientNicks ? '' : '.username,'}
.message-name,
.block-header,
.pairs dt
`.trim();
            const parallaxStyle = settings.enableParallaxScroll ? 'background-attachment: fixed !important;' : '';
            let backgroundElementStyle = '';
            const animSpeedValue = (typeof settings.animatedGradientSpeed === 'number') ? `${settings.animatedGradientSpeed}s` : settings.animatedGradientSpeed;

            const attachType = 'scroll';

            if (settings.enableAnimatedGradient && settings.enableGradient) {
                backgroundElementStyle = `
                    background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}, ${settings.gradientColor1});
                    background-size: 400% 400%;
                    animation: animatedGradient ${animSpeedValue} ease infinite;
                    background-attachment: ${attachType} !important;
                `;
            } else if (settings.enableGradient) {
                backgroundElementStyle = `
                    background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}) !important;
                    background-size: cover !important;
                    background-repeat: no-repeat !important;
                    background-attachment: ${attachType} !important;
                `;
           } else if (settings.bgImageDataUri) {
                backgroundElementStyle = `
                    background-image: url('${settings.bgImageDataUri}') !important;
                    background-size: cover !important;
                    background-position: center center !important;
                    background-repeat: no-repeat !important;
                    background-attachment: ${attachType} !important;
                    background-color: ${settings.bgColor} !important;
                `;
            } else {
                backgroundElementStyle = `
                    background-image: none !important;
                    background-color: ${settings.bgColor || '#0B0C1B'} !important;
                `;
            }
                        const animatedGradientKeyframes = `
                @keyframes animatedGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes br-animated-avatar-border { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @keyframes br-pulsating-avatar-border { 0% { transform: scale(1); box-shadow: 0 0 0 0 ${settings.avatarPulsateColor}B3; } 70% { transform: scale(1.02); box-shadow: 0 0 0 10px transparent; } 100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; } }
            `;

            const finalBlockBlur = settings.enableBlockBlur ? `blur(${settings.blockBlurAmount}px)` : 'none';
            const glowIntensityValue = (typeof settings.textGlowIntensity === 'number') ? `${settings.textGlowIntensity}px` : settings.textGlowIntensity;
            const ownMsgEdgeWidthValue = (typeof settings.ownMessageHighlightEdgeWidth === 'number') ? `${settings.ownMessageHighlightEdgeWidth}px` : settings.ownMessageHighlightEdgeWidth;
            const ownMessageHighlightStyle = (settings.enableOwnMessageHighlight && myUsername) ? `
                .message[data-author="${myUsername}"] .message-inner {
                    background-color: ${settings.ownMessageHighlightBgColor} !important;
                    border: ${ownMsgEdgeWidthValue} solid ${settings.ownMessageHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            const opMsgEdgeWidthValue = (typeof settings.opHighlightEdgeWidth === 'number') ? `${settings.opHighlightEdgeWidth}px` : settings.opHighlightEdgeWidth;
            const opMessageHighlightStyle = (settings.enableOpHighlight && threadAuthor) ? `
                .message[data-author="${threadAuthor}"] .message-inner {
                    background-color: ${settings.opHighlightBgColor} !important;
                    border: ${opMsgEdgeWidthValue} solid ${settings.opHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            let pageTransitionStyle = '';
            if (settings.enablePageTransition && !settings.enableScrollFadeIn) {
                const isReload = (window.performance && window.performance.navigation && window.performance.navigation.type === 1) ||
                                 (window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation")[0] && window.performance.getEntriesByType("navigation")[0].type === 'reload');

                if (!isReload) {
                    const duration = (typeof settings.pageTransitionDuration === 'number') ? `${settings.pageTransitionDuration}s` : '0.6s';
                    pageTransitionStyle = `
                        .p-pageWrapper {
                            animation-name: br-page-transition-rich;
                            animation-duration: ${duration};
                            animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
                            animation-fill-mode: both;
                            transform-origin: center top;
                        }
                        @keyframes br-page-transition-rich {
                            0% { opacity: 0; transform: scale(0.96) translateY(15px); filter: blur(5px); }
                            100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
                        }
                    `;
                }
            }
            const avatarSizeValue = (typeof settings.avatarBorderSize === 'number') ? `${settings.avatarBorderSize}px` : settings.avatarBorderSize;
            const avatarSpeedValue = (typeof settings.avatarBorderSpeed === 'number') ? `${settings.avatarBorderSpeed}s` : settings.avatarBorderSpeed;
            let avatarBorderStyle = '';
if (settings.enableAvatarBorder) {
                let animationProps = '';

                if (settings.avatarBorderStyle === 'gradient') {
                    animationProps = `
                        background: linear-gradient(
                            135deg,
                            ${settings.avatarBorderColor1},
                            ${settings.avatarBorderColor2},
                            ${settings.avatarBorderColor3},
                            ${settings.avatarBorderColor2},
                            ${settings.avatarBorderColor1}
                        );
                        background-size: 300% 300%;
                        border-radius: 50%;
                        padding: ${avatarSizeValue};
                        animation: br-smooth-gradient ${avatarSpeedValue} ease infinite;
                    `;
                } else if (settings.avatarBorderStyle === 'pulsate') {
                    animationProps = `
                        border: ${avatarSizeValue} solid ${settings.avatarPulsateColor};
                        border-radius: 50%;
                        box-shadow: 0 0 12px ${settings.avatarPulsateColor}40;
                    `;
                }

                avatarBorderStyle = `
                    @keyframes br-smooth-gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    .avatar {
                        position: relative;
                        display: inline-block;
                        border-radius: 50%;
                        vertical-align: middle;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        ${animationProps}
                    }

                    .avatar img:not(.cropImage) {
                        border-radius: 50%;
                        display: block;
                        position: relative;
                        z-index: 2;
                        background-color: ${settings.bgColor};
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border: 2px solid ${settings.bgColor};
                        box-sizing: border-box;
                    }
                `;
            }
            const nickSpeedValue = (typeof settings.pulsatingNickSpeed === 'number') ? `${settings.pulsatingNickSpeed}s` : settings.pulsatingNickSpeed;
            const pulsatingNickStyle = settings.enablePulsatingNicks ? `
                .username {
                    --br-pulse-color: ${settings.pulsatingNickColor};
                    --br-pulse-scale: ${settings.pulsatingNickIntensity};
                    --br-pulse-speed: ${nickSpeedValue};
                    animation: br-pulsating-nick var(--br-pulse-speed) infinite ease-in-out;
                    display: inline-block;
                }
            ` : '';
            const gradNickSpeedValue = (typeof settings.gradientNickSpeed === 'number') ? `${settings.gradientNickSpeed}s` : settings.gradientNickSpeed;
            const gradientNickStyle = settings.enableGradientNicks ? `
                .username {
                    background: linear-gradient(60deg, ${settings.gradientNickColor1}, ${settings.gradientNickColor2}, ${settings.gradientNickColor3}, ${settings.gradientNickColor2}, ${settings.gradientNickColor1});
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    -moz-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -moz-text-fill-color: transparent;
                    color: transparent;
                    animation: br-animated-gradient-text ${gradNickSpeedValue} ease infinite;
                }
            ` : '';
            const uiAnimSpeedValue = (typeof settings.uiAnimationSpeed === 'number') ? `${settings.uiAnimationSpeed}s` : settings.uiAnimationSpeed;
            const uiAnimationStyle = settings.enableUiAnimations ? `
                .message .message-user, .button, .tabs-tab, .block-filterBar-link, .structItem:not(.br-anim-scroll) {

                    will-change: transform;
                    transition: transform ${uiAnimSpeedValue} ease-out, box-shadow ${uiAnimSpeedValue} ease-out !important;
                }
                .message .message-user:hover, .button:hover, .tabs-tab:hover, .block-filterBar-link:hover, .structItem:not(.br-anim-scroll):hover {
                    transform: scale(1.02);
                    z-index: 10;
                    position: relative;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                .message .message-user:active, .button:active, .tabs-tab:active, .block-filterBar-link:active, .structItem:not(.br-anim-scroll):active {
                    transform: scale(0.98);
                }
            ` : '';
const avatar3dHoverStyle = settings.enable3DAvatarHover ? `
                .message-user {
                    perspective: 1000px;
                }
                .avatar {
                    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                .message-user:hover .avatar {
                    transform: scale(1.05) translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                    z-index: 10;
                }
            ` : '';
            const scrollIndicatorHeightValue = (typeof settings.scrollIndicatorHeight === 'number') ? `${settings.scrollIndicatorHeight}px` : settings.scrollIndicatorHeight;
            const scrollIndicatorStyle = settings.enableScrollIndicator ?
                `
                #${SCROLL_INDICATOR_ID} {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: ${scrollIndicatorHeightValue};
                    background-color: ${settings.scrollIndicatorColor};
                    box-shadow: 0 0 10px ${settings.scrollIndicatorColor};
                    transform-origin: left;
                    will-change: transform;
                    z-index: 9000;
                }
                ` : `#${SCROLL_INDICATOR_ID} { display: none; }`;
            const wideModeStyle = settings.enableWideMode ? `
    @media (min-width: 1200px) {
        .p-pageWrapper, .p-body-inner {
            max-width: 98% !important;
            margin: 0 auto !important;
        }
        .p-body-inner {
            max-width: 95% !important;
        }
    }
` : '';
const navThemes = {
                'nav_theme_fire': {
                    mainBg: '#111111', borderColor: 'rgba(255, 102, 0, 0.3)', boxShadow: '0 0 10px rgba(255, 102, 0, 0.4), inset 0 0 5px #000000',
                    glowGradient: 'linear-gradient(45deg, #FF6600, #B83E00, #4B0082, #FF6600)', glowOpacity: '0.5',
                    linkHoverBg: 'rgba(255, 140, 0, 0.1)', linkHoverShadow: '0 0 5px rgba(255, 140, 0, 0.3)', accentColor: '#FF6600',
                    mainGradient: 'linear-gradient(120deg, #80DEEA, #A7FFEB, #E1BEE7, #BA68C8, #80DEEA)'
                },
                'nav_theme_ocean': {
                    mainBg: '#0F1A2F', borderColor: 'rgba(0, 114, 255, 0.3)', boxShadow: '0 0 10px rgba(0, 114, 255, 0.4), inset 0 0 5px #000000',
                    glowGradient: 'linear-gradient(45deg, #00F0FF, #0072FF, #00C6FF, #00F0FF)', glowOpacity: '0.6',
                    linkHoverBg: 'rgba(0, 114, 255, 0.1)', linkHoverShadow: '0 0 5px rgba(0, 114, 255, 0.3)', accentColor: '#00F0FF',
                    mainGradient: 'linear-gradient(120deg, #4facfe, #00f2fe, #00c6ff, #0072ff, #4facfe)'
                },
                'nav_theme_forest': {
                    mainBg: '#102A1C', borderColor: 'rgba(0, 255, 133, 0.3)', boxShadow: '0 0 10px rgba(0, 255, 133, 0.4), inset 0 0 5px #000000',
                    glowGradient: 'linear-gradient(45deg, #00FF85, #0BA360, #3CBA92, #00FF85)', glowOpacity: '0.5',
                    linkHoverBg: 'rgba(0, 255, 133, 0.1)', linkHoverShadow: '0 0 5px rgba(0, 255, 133, 0.3)', accentColor: '#00FF85',
                    mainGradient: 'linear-gradient(120deg, #a8e063, #56ab2f, #3CBA92, #0BA360, #a8e063)'
                },
                'nav_theme_cyber': {
                    mainBg: '#1A0F2F', borderColor: 'rgba(255, 0, 222, 0.3)', boxShadow: '0 0 10px rgba(255, 0, 222, 0.4), inset 0 0 5px #000000',
                    glowGradient: 'linear-gradient(45deg, #FF00DE, #00F0FF, #FFEB3B, #FF00DE)', glowOpacity: '0.6',
                    linkHoverBg: 'rgba(255, 0, 222, 0.1)', linkHoverShadow: '0 0 5px rgba(255, 0, 222, 0.3)', accentColor: '#FF00DE',
                    mainGradient: 'linear-gradient(120deg, #FF00DE, #00F0FF, #F0FF00, #FF00DE, #FF00DE)'
                },
                'nav_theme_mono': {
                    mainBg: '#111111', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.4), inset 0 0 5px #000000',
                    glowGradient: 'linear-gradient(45deg, #FFFFFF, #AAAAAA, #F0F0F0, #FFFFFF)', glowOpacity: '0.4',
                    linkHoverBg: 'rgba(255, 255, 255, 0.1)', linkHoverShadow: '0 0 5px rgba(255, 255, 255, 0.3)', accentColor: '#FFFFFF',
                    mainGradient: 'linear-gradient(120deg, #AAAAAA, #FFFFFF, #CCCCCC, #AAAAAA)'
                },
            };

            let navTheme;
            const defaultEdgeColor = '#FFEB3B';
            const isCustomColor = settings.edgeColor && settings.edgeColor.toLowerCase() !== defaultEdgeColor.toLowerCase();

            if (settings.bottomNavTheme === 'nav_theme_custom_dynamic' || isCustomColor) {
                const pColor = settings.edgeColor || '#00F0FF';
                const sColor = settings.ownMessageHighlightEdgeColor || settings.edgeColor;
                const gDir = settings.gradientDirection || '120deg';
                navTheme = {
                    mainBg: '#101010',
                    borderColor: pColor,
                    boxShadow: `0 0 10px ${pColor}66`,
                    glowGradient: `linear-gradient(45deg, ${pColor}, ${sColor}, ${pColor})`,
                    glowOpacity: '0.6',
                    linkHoverBg: `${pColor}1A`,
                    linkHoverShadow: `0 0 5px ${pColor}4D`,
                    accentColor: pColor,
                    mainGradient: `linear-gradient(${gDir}, ${pColor}, ${sColor}, ${pColor})`
                };
            } else {
                const themeKey = settings.bottomNavTheme in navThemes ? settings.bottomNavTheme : 'nav_theme_fire';
                navTheme = navThemes[themeKey];
            }
            document.documentElement.style.setProperty('--br-nav-bg', navTheme.mainBg);
            document.documentElement.style.setProperty('--br-nav-shadow', navTheme.boxShadow);
            document.documentElement.style.setProperty('--br-nav-accent-color', navTheme.accentColor);
            document.documentElement.style.setProperty('--br-nav-border-color', navTheme.borderColor);
            document.documentElement.style.setProperty('--br-nav-glow-gradient', navTheme.glowGradient);
            document.documentElement.style.setProperty('--br-nav-glow-opacity', navTheme.glowOpacity);
            document.documentElement.style.setProperty('--br-nav-link-hover-bg', navTheme.linkHoverBg);
            document.documentElement.style.setProperty('--br-nav-link-hover-shadow', navTheme.linkHoverShadow);
            document.documentElement.style.setProperty('--br-nav-main-gradient', navTheme.mainGradient);
            document.documentElement.style.setProperty('--br-edge-color', settings.edgeColor);
            document.documentElement.style.setProperty('--br-bg-color', settings.bgColor);
            document.documentElement.style.setProperty('--br-bg-opacity', settings.opacityValue);

            const forumCss = `
:root {
    --br-edge-color: ${settings.edgeColor};
    --br-bg-color: ${settings.bgColor};
}

.message-cell,
.structItem-cell,
.block-body,
.p-body-content,
.p-body-inner {
    border: none !important;
    border-top: none !important;
    border-bottom: none !important;
    box-shadow: none !important;
}
html,
body,
.message-body,
.bbWrapper,
.p-title-value,
.structItem-title,
.username,
.block-header,
.button,
.p-navEl-link,
.offCanvasMenu-link,
.node-title,
.p-header-content {
    font-family: ${settings.fontFamily || 'inherit'} !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.95) !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}
.label, .badge, .structItem-status, .userTitle, .br-neon-badge {
    text-shadow: none !important;
    box-shadow: none !important;
}
.username[class*="style"], .username span[class*="style"] {
    text-shadow: 0 1px 1px rgba(0,0,0,0.3) !important;
}
.structItem {
    margin-bottom: 0px !important;
    border-radius: 0px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    background: transparent !important;
    transition: all 0.2s ease !important;
    box-sizing: border-box !important;
    width: 100% !important;
}
@media (min-width: 768px) {
    .structItem {
        display: flex !important;
        align-items: center !important;
    }
    .structItem-cell {
        display: block !important;
    }
    .structItem-cell--main {
        flex: 1 1 auto !important;
    }
}
.structItem:hover {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.07), transparent) !important;
    z-index: 2;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}
.structItem-parts .structItem-pageJump a {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 2px 6px;
}                ${fontTargetSelector} {
                    ${settings.fontFamily ? `font-family: ${settings.fontFamily} !important;` : ''}
                }
                .node-icon i, .fa, .fas, .far, .fab, .structItem-status, .offCanvasMenu-linkIcon, .button-icon, .fr-toolbar i {
                    font-family: "Font Awesome 5 Pro", "Font Awesome 5 Free", "Font Awesome 5 Brands", FontAwesome, sans-serif !important;
                }
.button, a.button, .button.button--cta, a.button.button--cta, .button.button--primary, a.button.button--primary {
    background-image: var(--br-nav-main-gradient) !important;
    background-color: transparent !important;
    background-size: 200% auto !important;
    border: 1px solid var(--br-edge-color) !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
    color: #fff !important;
    border-radius: ${finalBorderRadius} !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    font-weight: 700 !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    animation: brGradientFlow 4s ease infinite !important;
}
.button:hover, a.button:hover, .button.button--cta:hover, a.button.button--cta:hover, .button.button--primary:hover, a.button.button--primary:hover {
    background-position: right center !important;
    box-shadow: 0 0 20px var(--br-edge-color), inset 0 0 20px var(--br-edge-color) !important;
    text-shadow: 0 0 8px var(--br-edge-color) !important;
    transform: translateY(-2px) scale(1.02) !important;
    border-color: #fff !important;
    color: #fff !important;
}
.button:active, a.button:active {
    transform: translateY(1px) scale(0.98) !important;
    box-shadow: 0 0 5px var(--br-edge-color) !important;
}
                #${BACKGROUND_ELEMENT_ID} {
                    ${backgroundElementStyle}
                }
                ${animatedGradientKeyframes}
              ${pageWrapperSelector}, ${mainElementsSelector} {
                    background-color: ${mainElementBgColor} !important;
                    border-radius: ${finalBorderRadius} !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.3) !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25) !important;

                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    backface-visibility: visible !important;
                    transform: none !important;
                    perspective: none !important;
                    overflow: visible !important;
                }

                .block-container, .message-inner, .structItem, .offCanvasMenu-content, .overlay-content, .notice-content {
                    ${settings.enableRounding ? 'overflow: hidden;' : ''}
                }

                .p-nav, .p-header, .p-navSticky {
                    overflow: visible !important;
                    transform: none !important;
                    z-index: 2000 !important;
                }

                .p-nav-search {
                    position: relative;
                    z-index: 2001 !important;
                }

                .block-container,
                .node-body,
                .block-container,
                .node-body,
                .message-inner,
                .structItem,
                .p-nav,
                .offCanvasMenu-content,
                .overlay-content,
                .notice-content {
                    position: relative !important;
                    border: none !important;
                    box-shadow: none !important;
                }

            ${settings.enableEdge ? `
                .block-container::after,
                .node-body::after,
                .message-inner::after,
                .structItem::after,
                .p-nav::after,
                .offCanvasMenu-content::after,
                .overlay-content::after,
                .notice-content::after {
                    content: "" !important;
                    position: absolute !important;
                    inset: 0 !important;
                    border-radius: ${finalBorderRadius} !important;
                    pointer-events: none !important;
                    z-index: 5 !important;
                    border: none !important;
                    background: transparent !important;
                    opacity: ${settings.edgeOpacity} !important;
                    ${settings.edgeStyle === 'cloud_glow' ? `
                        box-shadow: inset 0 0 ${edgeWidthValue} ${settings.edgeColor}, inset 0 0 calc(${edgeWidthValue} * 0.5) ${settings.edgeColor} !important;
                    ` : `
                        box-shadow: inset 0 0 ${edgeWidthValue} ${settings.edgeColor} !important;
                        filter: blur(2px);
                    `}
                }
                ` : ''}
             ${transparentElementsSelector} {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: ${settings.transparentElementsOpacity} !important;
                }
                .message-cell.message-cell--user, .message-cell.message-cell--action {
                    background-color: rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, 0.05) !important;
                    border-right: 1px solid rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, 0.1) !important;
                    border-bottom: 1px solid rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, 0.1) !important;
                }
                ${settings.enableTextGlow ? `${textGlowTargetSelector}, .fa, .fab, .fas, .far { text-shadow: 0 0 ${glowIntensityValue} ${settings.textGlowColor}; }` : ''}

                ${ownMessageHighlightStyle}
                ${opMessageHighlightStyle}
                ${wideModeStyle}
               ${pageTransitionStyle}

                                                                                                @keyframes br-glow-spin { 0% { background-position: 0 0; } 100% { background-position: 400% 0; } }

                #${BOTTOM_NAV_ID} {
                    ${settings.enableBottomNav ? 'display: flex !important;' : 'display: none !important;'}
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: fit-content !important;
                    min-width: 100px;
                    max-width: 90vw;
                    height: 52px;
                    padding: 0 10px;
                    background: rgba(20, 20, 25, 0.75);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
                    border-radius: 100px;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 8px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                #${BOTTOM_NAV_ID}:hover {
                    background: rgba(20, 20, 25, 0.9);
                    transform: translateX(-50%) translateY(-3px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
                    border-color: ${settings.edgeColor} !important;
                }
                #${BOTTOM_NAV_ID} .br-nav-inner-mask {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
                #${BOTTOM_NAV_ID} .br-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    white-space: nowrap;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    max-width: 100%;
                    padding: 0 2px;
                    margin: 0 auto;
                }
                #${BOTTOM_NAV_ID} .br-nav-links::-webkit-scrollbar { display: none; }
                #${BOTTOM_NAV_ID} .br-nav-links a {
                    flex-shrink: 0;
                    white-space: nowrap;
                    padding: 8px 14px;
                    border-radius: 100px;
                    color: #ccc;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                #${BOTTOM_NAV_ID} .br-nav-links a:hover,
                #${BOTTOM_NAV_ID} .br-nav-links a.br-nav-link-active {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #fff;
                    text-shadow: 0 0 10px ${settings.edgeColor};
                }
                #${STYLE_ICON_ID} {
                    width: 36px;
                    height: 36px;
                    font-size: 15px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${settings.edgeColor}aa, ${settings.edgeColor}66);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    box-shadow: 0 0 15px ${settings.edgeColor}44;
                    position: relative !important;
                    margin-left: 2px;
                }
                @media (max-width: 768px) {
                    #${BOTTOM_NAV_ID} {
                        bottom: 25px !important;
                        max-width: 94vw !important;
                        padding: 0 8px !important;
                        justify-content: flex-start;
                    }
                    #${BOTTOM_NAV_ID} .br-nav-links {
                        mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                        -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                    }
                    #${BOTTOM_NAV_ID} .br-nav-links a {
                        padding: 8px 12px;
                        font-size: 12px;
                    }
                }

        .br-nav-inner-mask {
            background: transparent !important;
            padding: 0 !important;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #${BOTTOM_NAV_ID}::before {
            content: ''; position: absolute; inset: 0;
            border-radius: 20px;
            background: ${navTheme.glowGradient};
            background-size: 400%; z-index: -1; filter: blur(12px);
            animation: br-glow-spin 15s linear infinite;
            opacity: ${navTheme.glowOpacity};
        }

                .br-nav-utilities {
                    display: flex;
                    align-items: center;
                    position: relative;
                    margin-right: 15px;
                }

                #${STYLE_ICON_ID} {
                    ${settings.enableBottomNav ? 'position: relative;' : 'position: fixed; bottom: 55px; left: 10px; margin-right: 0;'}
                    width: 50px;
                    height: 50px;
                    font-size: 22px;
                    background: ${navTheme.mainBg};
                    color: #fff;
                    border: 2px solid ${navTheme.borderColor};
                    box-shadow: 0 0 15px ${navTheme.borderColor};
                    border-radius: 50%;
                    z-index: 9999;
                    transition: transform 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #${STYLE_ICON_ID}:before {
                    content: ''; position: absolute; inset: -2px;
                    border-radius: 50%;
                    background: ${navTheme.glowGradient};
                    background-size: 400%; z-index: -1; filter: blur(6px);
                    animation: br-glow-spin 5s linear infinite;
                    opacity: 0.8;
                }

                #${STYLE_ICON_ID}:hover {
                    transform: scale(1.1) rotate(15deg);
                }

                #br-style-nav-links-v110 a.br-nav-link-active,
                #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a:hover {
                    color: var(--br-nav-accent-color);
                    background: var(--br-nav-link-hover-bg) !important;
                    transform: translateY(-1px) scale(1.02);
                    box-shadow: var(--br-nav-link-hover-shadow);
                }

#${STYLE_ICON_ID}:hover {
                    transform: scale(1.1) rotate(15deg);
                }
                #${CLOCK_ID} {
                    color: ${settings.bottomNavClockColor || '#e0e0e0'};
                    display: ${settings.enableBottomNavClock ? 'inline-block' : 'none'} !important;
                }                #${EFFECTS_CONTAINER_ID} {
                    display: ${settings.effectType !== 'none' ? 'block' : 'none'};
                }
                ${avatarBorderStyle}
                ${pulsatingNickStyle}
                ${gradientNickStyle}
                ${uiAnimationStyle}
                ${avatar3dHoverStyle}
                ${scrollIndicatorStyle}
.menu, .menu-content, .menu-header, .menu-footer, .menu-tabHeader, .menu-row, .menu-link,
                .p-drawer, .p-drawer-body, .p-drawer-header, .p-drawer-footer,
                .tooltip-content, .memberTooltip, .memberTooltip-header {
                    background-color: rgba(7, 2, 51, 0) !important;
backdrop-filter: blur(2px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
                    border-radius: ${finalBorderRadius} !important;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    z-index: 9999 !important;
                }

                .offCanvasMenu {
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    z-index: 10000 !important;
                }

                .offCanvasMenu-backdrop {
                    background-color: rgba(0, 0, 0, 0.4) !important;
                    backdrop-filter: blur(2px) !important;
                }

                .offCanvasMenu-content {
                    background-color: rgba(7, 2, 51, 0.55) !important;
                    box-shadow: 5px 0 30px rgba(0,0,0,0.6) !important;
                    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
                    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
                }

                .offCanvasMenu-header, .offCanvasMenu-linkHolder {
                    background: transparent !important;
                    border: none !important;
                }
    .menu-row, .menu-link, .offCanvasMenu-link {
                    background: transparent !important;
                    color: #ccc !important;
                    border: 0 !important;
                }
                .menu-row:hover, .menu-row.is-selected, .menu-link:hover, .offCanvasMenu-link:hover, .offCanvasMenu-link.is-selected {
                    background: linear-gradient(90deg, ${settings.edgeColor}33, transparent) !important;
                    color: #fff !important;
                }
                .menu-row + .menu-row, .offCanvasMenu-list > li + li {
                    border-top: 1px solid rgba(255,255,255,0.06) !important;
                }
                .offCanvasMenu-link .offCanvasMenu-linkIcon {
                    color: ${settings.edgeColor} !important;
                }
                .fr-toolbar [class*="fa-"], .fr-toolbar i, .fr-toolbar span {
                    font-family: "Font Awesome 5 Free", "Font Awesome 5 Pro", "Font Awesome 5 Brands", "Font Awesome" !important;
                    font-weight: inherit !important;
                }

                input[type="text"]:focus, input[type="password"]:focus, textarea:focus, .fr-box.is-focused {
                    transform: scale(1.01);
                    border-color: ${settings.edgeColor} !important;
                    box-shadow: 0 0 15px ${settings.edgeColor}40 !important;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                ::selection {
                    background: ${settings.edgeColor};
                    color: #000;
                    text-shadow: none;
                }

                .br-stats-dashboard {
                    border: 1px solid ${settings.edgeColor} !important;
                    box-shadow: 0 5px 20px ${settings.edgeColor}26 !important;
                }
                .br-stat-card {
                    border: 1px solid ${settings.edgeColor}33 !important;
                }
                .br-stat-card .br-stat-icon {
                    color: ${settings.edgeColor} !important;
                    background: ${settings.edgeColor}1A !important;
                    box-shadow: 0 0 5px ${settings.edgeColor}33 !important;
                }
                .br-stat-card:hover {
                    border-color: ${settings.edgeColor} !important;
                    background: ${settings.edgeColor}1A !important;
                    box-shadow: 0 0 15px ${settings.edgeColor}66 !important;
                }
                .br-stat-card.active {
                    background: ${settings.edgeColor}26 !important;
                    border-color: ${settings.edgeColor} !important;
                    box-shadow: 0 0 15px ${settings.edgeColor} !important;
                }
                .br-stat-card.active .br-stat-icon {
                    background: ${settings.edgeColor} !important;
                    color: #000 !important;
                    box-shadow: 0 0 10px ${settings.edgeColor} !important;
                }
                .br-stat-card::after {
                    background: ${settings.edgeColor} !important;
                }
                :root, html {
                    --br-primary: ${settings.edgeColor} !important;
                    --br-secondary: ${settings.ownMessageHighlightEdgeColor || settings.edgeColor} !important;
                }
                .bbCodeBlock {
                    border-left: 3px solid ${settings.edgeColor} !important;
                }
                .bbCodeBlock-title {
                    background: linear-gradient(90deg, ${settings.edgeColor}33, transparent) !important;
                    color: #fff !important;
                    border-bottom: 1px solid ${settings.edgeColor}33 !important;
                }
                .pageNav-page.pageNav-page--current {
                    background: ${settings.edgeColor} !important;
                    border-color: ${settings.edgeColor} !important;
                    color: #000 !important;
                    box-shadow: 0 0 10px ${settings.edgeColor}66 !important;
                }
                .pageNav-page:not(.pageNav-page--current):hover {
                    background: ${settings.edgeColor}33 !important;
                    color: ${settings.edgeColor} !important;
                }
                #br-btn-ice-v3 {
                    background: linear-gradient(90deg, ${settings.bgColor}, ${settings.edgeColor}66, ${settings.bgColor}) !important;
                    background-size: 200% 200% !important;
                    border: 1px solid ${settings.edgeColor} !important;
                    color: #fff !important;
                    text-shadow: 0 0 5px ${settings.edgeColor} !important;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
                }
                #br-btn-ice-v3:hover {
                    box-shadow: 0 0 15px ${settings.edgeColor}66 !important;
                }
                .br-upload-button {
                    background: ${settings.bgColor} !important;
                    border: 1px solid ${settings.edgeColor} !important;
                    color: ${settings.edgeColor} !important;
                    box-shadow: 0 0 5px ${settings.edgeColor}33 !important;
                }
                .br-upload-button:hover {
                    background: ${settings.edgeColor} !important;
                    color: #000 !important;
                    box-shadow: 0 0 15px ${settings.edgeColor} !important;
                }
                .input:focus, .input.is-focused {
                    border-color: var(--br-edge-color) !important;
                    box-shadow: 0 0 0 2px var(--br-edge-color) !important;
                }
            `;

            styleElement.textContent = forumCss;
        } catch (e) {
            console.error('[BR Style] Ошибка применения динамических стилей❌', e);
            if (styleElement) styleElement.textContent = '';
        }
    }

    function populateAllPresetLists() {
        if (!settingsPanel) return;

        const customSelect = settingsPanel.querySelector('#s_customPresetSelect');
        const contextSelect = settingsPanel.querySelector('#s_contextualBgPreset');
        if (!customSelect || !contextSelect) return;

        const customVal = customSelect.value;
        const contextVal = contextSelect.value;

        customSelect.innerHTML = '<option value="">-- Выберите Тем --</option>';
        contextSelect.innerHTML = '<option value="">-- Не применять --</option>';

        const allPresets = [];

        for (const presetName in builtInPresets) {
            const option = {
                value: presetName,
                text: `🎁 (Тема) ${settingsPanel.querySelector(`#s_builtInPresetSelect option[value="${presetName}"]`)?.text || presetName}`
            };
            allPresets.push(option);
        }

        const sortedCustomKeys = Object.keys(currentSettings.customPresets || {}).sort((a, b) => a.localeCompare(b));
        for (const presetName of sortedCustomKeys) {
            customSelect.add(new Option(presetName, presetName));
            allPresets.push({ value: presetName, text: `💾 (Мой) ${presetName}` });
        }

        allPresets.sort((a, b) => a.text.localeCompare(b.text));
        allPresets.forEach(opt => {
            contextSelect.add(new Option(opt.text, opt.value));
        });

        if (Array.from(customSelect.options).some(opt => opt.value === customVal)) {
            customSelect.value = customVal;
        } else {
            customSelect.value = "";
        }

        if (Array.from(contextSelect.options).some(opt => opt.value === contextVal)) {
            contextSelect.value = contextVal;
        } else {
            contextSelect.value = contextVal || "";
        }
    }

    async function handleSaveCustomPreset() {
        if (!settingsPanel) return;
        const nameInput = settingsPanel.querySelector('#s_newPresetName');
        const presetName = nameInput.value.trim();
        if (!presetName) {
            showToast('❌ Введите название Тема!', 'error');
            return;
        }
        if (currentSettings.customPresets.hasOwnProperty(presetName)) {
            if (!confirm(`Тем "${presetName}" уже существует. Перезаписать?`)) {
                return;
            }
        }
        const saveBtn = settingsPanel.querySelector('#save-preset-btn');
        saveBtn.textContent = 'Сохранение...';
        saveBtn.disabled = true;
        const presetData = {};
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets' && key !== 'bgImageDataUri') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                presetData[key] = value;
            }
        });
        const newPresets = { ...currentSettings.customPresets, [presetName]: presetData };
        const success = await saveSettings({ customPresets: newPresets });
       if (success) {
            showToast(`✅ Тем "${presetName}" сохранен!`, 'success');
            nameInput.value = '';
            populateAllPresetLists();
        } else {
            showToast('❌ Ошибка сохранения Тема!', 'error');
        }
        saveBtn.textContent = 'Сохранить';
        saveBtn.disabled = false;
    }

    function handleLoadCustomPreset() {
        if (!settingsPanel) return;
        const panelBody = settingsPanel.querySelector('.br-panel-body');
        const currentScrollTop = panelBody ? panelBody.scrollTop : 0;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Тем не выбран!', 'error');
            return;
        }
        const presetData = currentSettings.customPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные Тема!', 'error');
            return;
        }        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (presetData.hasOwnProperty(key)) {
                const value = presetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
             initializeVisibilityFunc();
        }
        const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
        if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
             initializeAnimVisibilityFunc();
        }
        if (panelBody) {
             panelBody.scrollTop = currentScrollTop;
        }
        showToast(`✅ Тем "${presetName}" загружен. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }

    function handleLoadBuiltInPreset() {
        if (!settingsPanel) return;
        const panelBody = settingsPanel.querySelector('.br-panel-body');
        const currentScrollTop = panelBody ? panelBody.scrollTop : 0;
        const select = settingsPanel.querySelector('#s_builtInPresetSelect');
        const presetName = select.value;

        if (!presetName) {
            showToast('❌ Тема не выбрана!', 'error');
            return;
        }

        const presetData = builtInPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные темы!', 'error');
            return;
        }
        const fullPresetData = { ...defaultSettings, ...presetData };
        const preservedKeys = ['imgbbApiKey', 'quickLinks', 'customPresets', 'bgImageDataUri', 'complaintTrackerSections', 'adminToastNicks', 'liveUpdateInterval'];

        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (preservedKeys.includes(key)) return;

            if (fullPresetData.hasOwnProperty(key)) {
                const value = fullPresetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        if (bgFileInput) bgFileInput.value = '';

        settingsPanel.dataset.presetLoaded = 'true';

        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
            initializeVisibilityFunc();
        }
        const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
        if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
             initializeAnimVisibilityFunc();
        }
        if (panelBody) {
             panelBody.scrollTop = currentScrollTop;
        }
        showToast(`✅ Тема "${select.options[select.selectedIndex].text}" загружена. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }
    async function handleDeleteCustomPreset() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Тем не выбран!', 'error');
            return;
        }
        if (!confirm(`Вы уверены, что хотите удалить Тем "${presetName}"?`)) {
            return;
        }
        const newPresets = { ...currentSettings.customPresets };
        delete newPresets[presetName];
        const success = await saveSettings({ customPresets: newPresets });
       if (success) {
            showToast(`✅ Тем "${presetName}" удален.`, 'success');
            populateAllPresetLists();
        } else {
            showToast('❌ Ошибка удаления Тема!', 'error');
        }
    }

    function updateSliderValue(slider) {
        if (!settingsPanel) return;

        const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);
        if (valueDisplay) {
            valueDisplay.textContent = slider.value;
        }

        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;

        const percentage = ((val - min) / (max - min)) * 100;

        slider.style.background = `linear-gradient(to right, var(--br-edge-color, #D59D80) 0%, var(--br-edge-color, #D59D80) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`;
        slider.style.backgroundRepeat = 'no-repeat';
        slider.style.backgroundSize = '100% 6px';
        slider.style.backgroundPosition = 'center';
    }

function createPanelHTML() {
    if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
    const panelWrapper = document.createElement('div');
    panelWrapper.id = 'br-panel-wrapper';

    const panelDiv = document.createElement('div');
    panelDiv.id = PANEL_ID;
    panelDiv.classList.add('br-noise-bg');
    panelWrapper.appendChild(panelDiv);
    try {
        const fontOptionsHtml = availableFonts.map(font => `<option value="${font.value}">${font.name}</option>`).join('');
        const createSlider = (id, key, label, min, max, step, unit = '') => `
            <div>
                <label for="s_${id}">${label}: <span class="slider-value" id="val_${id}"></span><span class="slider-unit">${unit}</span></label>
                <input type="range" class="br-styled-slider" id="s_${id}" name="${id}" data-setting-key="${key}" min="${min}" max="${max}" step="${step}">
            </div>`;
        const gradientDirectionOptions = [
            { name: 'По диагонали (↘)', value: '135deg' },
            { name: 'По диагонали (↗)', value: '45deg' },
            { name: 'Вниз (↓)', value: 'to bottom' },
            { name: 'Направо (→)', value: 'to right' },
            { name: 'Вверх (↑)', value: 'to top' },
            { name: 'Налево (←)', value: 'to left' },
            { name: 'Круг (из центра)', value: 'circle' }
        ].map(opt => `<option value="${opt.value}">${opt.name}</option>`).join('');

        const createTooltip = (text) => `<span class="br-panel-tooltip" data-tooltip="${text}">?</span>`;

        panelDiv.innerHTML = `
<div class="br-panel-header">
                <h3><img src="https://i.postimg.cc/0QNfQmRg/photo-2025-12-17-21-39-36.jpg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;" />Настройки</h3>
                <button id="close-btn" class="br-panel-close-btn" title="Закрыть">❌</button>
            </div>
            <div class="br-panel-body">
                <a href="https://vk.com/id736507277" target="_blank" class="author-credit-link" title="Разработчик скрипта">
    Автор: King_Rangers (v${SCRIPT_VERSION})
</a>
           <div class="br-hub-grid">
                        <div class="br-hub-card br-spotlight" data-page="tab-main">
                            <div class="br-hub-card-icon"></div>
                            <span>Главное</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-visuals">
                            <div class="br-hub-card-icon"></div>
                            <span>Визуал эффекты</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-animations">
                            <div class="br-hub-card-icon"></div>
                            <span>Анимки</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-interface">
                            <div class="br-hub-card-icon"></div>
                            <span>Интерфейс</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-live">
                            <div class="br-hub-card-icon"></div>
                            <span>Слежка за Форумом</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-presets">
                            <div class="br-hub-card-icon"></div>
                            <span>Готовые Темы</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-moderation">
                            <div class="br-hub-card-icon"></div>
                            <span>Модерация</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-integrations">
                            <div class="br-hub-card-icon"></div>
                            <span>Интеграция</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-gallery">
                            <div class="br-hub-card-icon"></div>
                            <span>Готовая Галерея</span>
                        </div>
                        <div class="br-hub-card br-spotlight" data-page="tab-help">
                            <div class="br-hub-card-icon"></div>
                            <span>Информация</span>
                        </div>
                    </div>
                    <div class="br-settings-view">
                        <div class="br-settings-header">
                            <button class="br-settings-back-btn">← Назад</button>
                            <h4 class="br-settings-title"></h4>
                        </div>
                        <div class="panel-tab-content" id="tab-main">


                            <h4>-- Фон & Основные Элементы --</h4>
                            <div class="setting-group">
                                <div style="display:flex; align-items:center; margin-bottom:5px;">
                                    <label class="br-toggle-switch"><input type="checkbox" id="s_enableGradient" name="enableGradient" data-setting-key="enableGradient"><span class="br-toggle-slider"></span></label>
                                    <label for="s_enableGradient" class="inline-label"><i class="fas fa-palette fa-fw" style="color: #ff8dee;"></i> Градиентный фон</label>${createTooltip('Заменяет фон сайта на анимированный или статичный градиент из 4-х цветов.')}
                                </div>
                                <div class="sub-settings" id="gradient-sub-settings">
                                    <div><label for="s_gradientColor1">Цвет 1:</label><input type="color" id="s_gradientColor1" name="gradientColor1" data-setting-key="gradientColor1"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientColor2">Цвет 2:</label><input type="color" id="s_gradientColor2" name="gradientColor2" data-setting-key="gradientColor2"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientColor3">Цвет 3:</label><input type="color" id="s_gradientColor3" name="gradientColor3" data-setting-key="gradientColor3"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientColor4">Цвет 4:</label><input type="color" id="s_gradientColor4" name="gradientColor4" data-setting-key="gradientColor4"></div>
                                    <div style="margin-top: 8px;">
                                        <label for="s_gradientDirection">Направление:</label>
                                        <select id="s_gradientDirection" name="gradientDirection" data-setting-key="gradientDirection">${gradientDirectionOptions}</select>
                                    </div>
                                    <div style="margin-top: 12px;">
                                        <div style="display:flex; align-items:center;">
                                            <label class="br-toggle-switch"><input type="checkbox" id="s_enableAnimatedGradient" name="enableAnimatedGradient" data-setting-key="enableAnimatedGradient"><span class="br-toggle-slider"></span></label>
                                            <label for="s_enableAnimatedGradient" class="inline-label"><i class="fas fa-magic fa-fw" style="color: #00F0FF;"></i> Анимированный градиент</label>
                                        </div>
                                        <div class="sub-settings" id="animated-gradient-sub-settings" style="margin-top: 5px;">
                                            ${createSlider('animatedGradientSpeed', 'animatedGradientSpeed', 'Скорость', 1, 30, 0.5, 's')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group" id="bg-image-setting-group">
                                <label for="s_bgImageFile"><i class="fas fa-image fa-fw" style="color: #90ee90;"></i> Фон (изображение):</label>${createTooltip('Загрузите свой фон. Он будет отключен, если включен градиент. Макс. размер: 5 МБ.')}
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="file" id="s_bgImageFile" name="bgImageFile" accept="image/*" style="flex-grow: 1; font-size: 11px;">
                                    <button id="clear-bg-btn" title="Удалить фон" class="panel-small-btn panel-btn-danger"><i class="fas fa-times"></i></button>
                                </div>
                                <small id="bg-status" class="panel-status-text">Фон не задан.</small>
                            </div>
                            <hr>
                            <div class="setting-group">
                                <label for="s_bgColor"><i class="fas fa-fill-drip fa-fw" style="color: #aaaaaa;"></i> Цвет Блоков:</label>
                                <input type="color" id="s_bgColor" name="bgColor" data-setting-key="bgColor">
                            </div>
                            <div class="setting-group">
                                ${createSlider('opacityValue', 'opacityValue', '<i class="fas fa-tint fa-fw" style="color: #00F0FF;"></i> Прозрачность Блоков', 0, 1, 0.05)}
                            </div>
                            <div class="setting-group">
                                <div style="display:flex; align-items:center; margin-bottom:5px;">
                                    <label class="br-toggle-switch"><input type="checkbox" id="s_enableBlockBlur" name="enableBlockBlur" data-setting-key="enableBlockBlur"><span class="br-toggle-slider"></span></label>
                                    <label for="s_enableBlockBlur" class="inline-label"><i class="fas fa-th-large fa-fw" style="color: #a0dfff;"></i> Размытие блоков</label>
                                </div>
                                <div class="sub-settings" id="block-blur-sub-settings">
                                    ${createSlider('blockBlurAmount', 'blockBlurAmount', 'Сила размытия', 0, 50, 1, 'px')}
                                </div>
                            </div>
                            <div class="setting-group">
                                <div style="display:flex; align-items:center; margin-bottom:5px;">
                                    <label class="br-toggle-switch"><input type="checkbox" id="s_enableRounding" name="enableRounding" data-setting-key="enableRounding"><span class="br-toggle-slider"></span></label>
                                    <label for="s_enableRounding" class="inline-label"><i class="fas fa-vector-square fa-fw" style="color: #f0e68c;"></i> Скругление</label>
                                </div>
                                <div class="sub-settings" id="rounding-sub-settings">
                                    ${createSlider('borderRadius', 'borderRadius', 'Радиус', 0, 50, 1, 'px')}
                                </div>
                            </div>
                            <div class="setting-group">
                                <div style="display:flex; align-items:center; margin-bottom:5px;">
                                    <label class="br-toggle-switch"><input type="checkbox" id="s_enableEdge" name="enableEdge" data-setting-key="enableEdge"><span class="br-toggle-slider"></span></label>
                                    <label for="s_enableEdge" class="inline-label"><i class="fas fa-sparkles fa-fw" style="color: #FFEB3B;"></i> Окантовка</label>
                                </div>
                                <div class="sub-settings" id="edge-sub-settings">
                                    <div style="margin-bottom: 8px;">
                                        <label for="s_edgeStyle">Стиль окантовки:</label>
                                        <select id="s_edgeStyle" name="edgeStyle" data-setting-key="edgeStyle">
                                            <option value="cloud_glow">☁️ Cloud Immersion (Облако)</option>
                                            <option value="soft_mist">🌫️ Soft Mist (Мягкая дымка)</option>
                                        </select>
                                    </div>
                                    <div><label for="s_edgeColor">Цвет:</label> <input type="color" id="s_edgeColor" name="edgeColor" data-setting-key="edgeColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('edgeWidth', 'edgeWidth', 'Глубина свечения', 0, 50, 0.5, 'px')}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('edgeOpacity', 'edgeOpacity', 'Яркость', 0, 1, 0.05)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="panel-tab-content" id="tab-visuals">
                            <h4>-- <i class="fas fa-desktop"></i> Компоновка и Вид --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableWideMode" name="enableWideMode" data-setting-key="enableWideMode"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableWideMode" class="inline-label"><i class="fas fa-arrows-alt-h fa-fw" style="color: #999;"></i> "Широкий режим"</label>
                            </div>

                            <h4>-- <i class="fas fa-highlighter"></i> Выделение Постов --</h4>
                            <div class="setting-group">
                                <div style="display:flex; align-items:center; margin-bottom:5px;">
                                    <label class="br-toggle-switch"><input type="checkbox" id="s_enableOpHighlight" name="enableOpHighlight" data-setting-key="enableOpHighlight"><span class="br-toggle-slider"></span></label>
                                    <label for="s_enableOpHighlight" class="inline-label"><i class="fas fa-crown fa-fw" style="color: #f1c40f;"></i> Выделять Автора Темы</label>
                                </div>
                                <div class="sub-settings" id="op-highlight-sub-settings">
                                    <div><label for="s_opHighlightBgColor">Цвет фона:</label> <input type="color" id="s_opHighlightBgColor" name="opHighlightBgColor" data-setting-key="opHighlightBgColor"></div>
                                    <div style="margin-top: 8px;"><label for="s_opHighlightEdgeColor">Цвет окантовки:</label> <input type="color" id="s_opHighlightEdgeColor" name="opHighlightEdgeColor" data-setting-key="opHighlightEdgeColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('opHighlightEdgeWidth', 'opHighlightEdgeWidth', 'Толщина окантовки', 0, 10, 0.5, 'px')}
                                    </div>
                                </div>
                            </div>

                            <h4>-- <i class="fas fa-font"></i> Шрифт & Текст --</h4>
                            <div class="setting-group">
                                <label for="s_fontFamily"><i class="fas fa-pen-fancy fa-fw" style="color: #ccc;"></i> Шрифт Форума:</label>
                                <select id="s_fontFamily" name="fontFamily" data-setting-key="fontFamily"> ${fontOptionsHtml} </select>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableTextGlow" name="enableTextGlow" data-setting-key="enableTextGlow">
                                <label for="s_enableTextGlow" class="inline-label"><i class="fas fa-lightbulb fa-fw" style="color: #f1c40f;"></i> Освещение текста</label>${createTooltip('Добавляет легкое свечение (тень) для никнеймов, заголовков тем и другого важного текста.')}
                                <div class="sub-settings" id="text-glow-sub-settings">
                                    <div><label for="s_textGlowColor">Цвет:</label> <input type="color" id="s_textGlowColor" name="textGlowColor" data-setting-key="textGlowColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('textGlowIntensity', 'textGlowIntensity', 'Интенсивность', 0, 20, 1, 'px')}
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group">
                                ${createSlider('transparentElementsOpacity', 'transparentElementsOpacity', '<i class="fas fa-ghost fa-fw" style="color: #fff;"></i> Прозрачность Фона Элементов', 0, 1, 0.05)}
                            </div>

                            <h4>-- <i class="fas fa-cloud-rain"></i> Визуальные Эффекты v2 --</h4>
                            <div class="setting-group">
                                <label for="s_effectType">Тип Эффекта:</label>${createTooltip('Добавляет "живой" эффект на всю страницу: снег, дождь, листья, матрица и т.д.')}
                                <select id="s_effectType" name="effectType" data-setting-key="effectType">
                                    <option value="none">Отключено</option>
                                    <option value="rain">Дождь (🌧️)</option>
                                    <option value="snow">Снег (❄️)</option>
                                    <option value="petals-sakura">Лепестки Сакуры (🌸)</option>
                                    <option value="petals-red_rose">Лепестки Розы (🌹)</option>
                                    <option value="leaves-autumn_maple">Листья Клена (🍂)</option>
                                    <option value="fireflies">Светлячки (✨)</option>
                                    <option value="matrix">Матрица (💻)</option>
                                    <option value="bubbles">Пузырьки (🫧)</option>
                                </select>
                            </div>
                            <div class="setting-group sub-settings" id="effect-details-settings">
                                ${createSlider('effectIntensity', 'effectIntensity', 'Интенсивность (Кол-во)', 10, 200, 10)}
                                ${createSlider('effectSpeed', 'effectSpeed', 'Скорость (Множитель)', 0.1, 5, 0.1)}
                                <div class="effect-specific-settings rain-settings matrix-settings" style="display:none; margin-top: 8px;">
                                    ${createSlider('effectRainLength', 'effectRainLength', 'Длина (капли/симв.)', 5, 50, 1, 'px')}
                                </div>
                                <div class="effect-specific-settings sway-settings" style="display:none; margin-top: 8px;">
                                    ${createSlider('effectSwayIntensity', 'effectSwayIntensity', 'Покачивание (Множитель)', 0, 3, 0.1)}
                                </div>
                                <div style="margin-top: 10px;">
                                    <input type="checkbox" id="s_enableInteractiveParticles" name="enableInteractiveParticles" data-setting-key="enableInteractiveParticles">
                                    <label for="s_enableInteractiveParticles" class="inline-label"><i class="fas fa-mouse-pointer fa-fw" style="color: #3498db;"></i> Интерактивные частицы</label>${createTooltip('Частицы (снег, листья) будут "разлетаться" от вашего курсора мыши.')}
                                </div>
                            </div>
                        </div>

                        <div class="panel-tab-content" id="tab-animations">
                            <h4>-- <i class="fas fa-user-circle"></i> Анимированные Аватары --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableAvatarBorder" name="enableAvatarBorder" data-setting-key="enableAvatarBorder">
                                <label for="s_enableAvatarBorder" class="inline-label"><i class="fas fa-spinner fa-spin fa-fw" style="color: #00F0FF;"></i> Анимированная рамка</label>${createTooltip('Добавляет аватарам анимированную рамку (перелив или пульсация).')}
                                <div class="sub-settings" id="avatar-border-sub-settings">
                                    <div>
                                        <label for="s_avatarBorderStyle">Стиль анимации:</label>
                                        <select id="s_avatarBorderStyle" name="avatarBorderStyle" data-setting-key="avatarBorderStyle">
                                            <option value="gradient">Градиент (перелив)</option>
                                            <option value="pulsate">Пульсация (один цвет)</option>
                                        </select>
                                    </div>
                                    <div id="avatar-gradient-settings" style="margin-top: 8px;">
                                        <div><label for="s_avatarBorderColor1">Цвет 1:</label><input type="color" id="s_avatarBorderColor1" name="avatarBorderColor1" data-setting-key="avatarBorderColor1"></div>
                                        <div style="margin-top: 8px;"><label for="s_avatarBorderColor2">Цвет 2:</label><input type="color" id="s_avatarBorderColor2" name="avatarBorderColor2" data-setting-key="avatarBorderColor2"></div>
                                        <div style="margin-top: 8px;"><label for="s_avatarBorderColor3">Цвет 3:</label><input type="color" id="s_avatarBorderColor3" name="avatarBorderColor3" data-setting-key="avatarBorderColor3"></div>
                                    </div>
                                    <div id="avatar-pulsate-settings" style="margin-top: 8px; display: none;">
                                        <div><label for="s_avatarPulsateColor">Цвет пульсации:</label><input type="color" id="s_avatarPulsateColor" name="avatarPulsateColor" data-setting-key="avatarPulsateColor"></div>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('avatarBorderSize', 'avatarBorderSize', 'Толщина', 1, 5, 0.5, 'px')}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('avatarBorderSpeed', 'avatarBorderSpeed', 'Скорость', 1, 10, 0.5, 's')}
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enable3DAvatarHover" name="enable3DAvatarHover" data-setting-key="enable3DAvatarHover">
                                <label for="s_enable3DAvatarHover" class="inline-label"><i class="fas fa-cube fa-fw" style="color: #fff;"></i> 3D-эффект аватаров</label>${createTooltip('При наведении на аватар, он будет "приподниматься" с 3D-поворотом.')}
                            </div>
                            <h4>-- <i class="fas fa-user-tag"></i> Эффекты Ников --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enablePulsatingNicks" name="enablePulsatingNicks" data-setting-key="enablePulsatingNicks">
                                <label for="s_enablePulsatingNicks" class="inline-label"><i class="fas fa-satellite-dish fa-fw" style="color: #FFEB3B;"></i> Пульсация (Тень)</label>${createTooltip('Добавляет никнеймам анимированную пульсирующую тень (свечение).')}
                                <div class="sub-settings" id="pulsating-nicks-sub-settings">
                                    <div><label for="s_pulsatingNickColor">Цвет тени (пульса):</label><input type="color" id="s_pulsatingNickColor" name="pulsatingNickColor" data-setting-key="pulsatingNickColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('pulsatingNickIntensity', 'pulsatingNickIntensity', 'Интенсивность', 1.01, 2, 0.01)}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('pulsatingNickSpeed', 'pulsatingNickSpeed', 'Скорость', 0.5, 5, 0.1, 's')}
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableGradientNicks" name="enableGradientNicks" data-setting-key="enableGradientNicks">
                                <label for="s_enableGradientNicks" class="inline-label"><i class="fas fa-paint-brush fa-fw" style="color: #ff8dee;"></i> Градиент (Текст)</label>${createTooltip('Делает текст никнеймов анимированным градиентом. Перекрывает "Пульсацию".')}
                                <div class="sub-settings" id="gradient-nicks-sub-settings">
                                    <div><label for="s_gradientNickColor1">Цвет 1:</label><input type="color" id="s_gradientNickColor1" name="gradientNickColor1" data-setting-key="gradientNickColor1"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientNickColor2">Цвет 2:</label><input type="color" id="s_gradientNickColor2" name="gradientNickColor2" data-setting-key="gradientNickColor2"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientNickColor3">Цвет 3:</label><input type="color" id="s_gradientNickColor3" name="gradientNickColor3" data-setting-key="gradientNickColor3"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('gradientNickSpeed', 'gradientNickSpeed', 'Скорость', 1, 10, 0.5, 's')}
                                    </div>
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-rocket"></i> Плавность Интерфейса (UI) --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableUiAnimations" name="enableUiAnimations" data-setting-key="enableUiAnimations">
                                <label for="s_enableUiAnimations" class="inline-label"><i class="fas fa-hand-pointer fa-fw" style="color: #3498db;"></i> Анимации UI</label>${createTooltip('Плавные анимации при наведении и клике на кнопки, темы, аватары и т.д.')}
                                <div class="sub-settings" id="ui-animations-sub-settings">
                                    ${createSlider('uiAnimationSpeed', 'uiAnimationSpeed', 'Скорость', 0.1, 1, 0.05, 's')}
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableLikeAnimations" name="enableLikeAnimations" data-setting-key="enableLikeAnimations">
                                <label for="s_enableLikeAnimations" class="inline-label"><i class="fas fa-heart fa-fw" style="color: #e74c3c;"></i> Анимация "Лайка"</label>${createTooltip('При нажатии на "Нравится" из кнопки будет вылетать сердечко (❤️).')}
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableScrollFadeIn" name="enableScrollFadeIn" data-setting-key="enableScrollFadeIn">
                                <label for="s_enableScrollFadeIn" class="inline-label"><i class="fas fa-sort-amount-down fa-fw" style="color: #9b59b6;"></i> Микро-анимация при Прокрутке</label>${createTooltip('Плавное появление тем и сообщений по мере прокрутки страницы.')}
                                <div class="sub-settings" id="scroll-fade-in-sub-settings">
                                    <label for="s_scrollFadeInType">Тип анимации:</label>
                                    <select id="s_scrollFadeInType" name="scrollFadeInType" data-setting-key="scrollFadeInType">
                                        <option value="fade-in">Появление (Fade In)</option>
                                        <option value="fade-in-up">Появление снизу (Fade In Up)</option>
                                        <option value="slide-in-left">Выезд слева (Slide In Left)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableParallaxScroll" name="enableParallaxScroll" data-setting-key="enableParallaxScroll">
                                <label for="s_enableParallaxScroll" class="inline-label"><i class="fas fa-layer-group fa-fw" style="color: #1abc9c;"></i> Parallax-эффект Фона</label>${createTooltip('Фон (градиент или картинка) будет прокручиваться медленнее, чем контент, создавая эффект глубины.')}
                                <div class="sub-settings" id="parallax-scroll-sub-settings">
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-film"></i> Анимации Переходов (Страниц) --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enablePageTransition" name="enablePageTransition" data-setting-key="enablePageTransition">
                                <label for="s_enablePageTransition" class="inline-label"><i class="fas fa-clone fa-fw" style="color: #7f8c8d;"></i> Включить анимацию</label>${createTooltip('Плавная анимация при переходе между страницами (например, "Fade In").')}
                                <div class="sub-settings" id="page-transition-sub-settings">
                                    <div>
                                        <label for="s_pageTransitionType">Тип анимации:</label>
                                        <select id="s_pageTransitionType" name="pageTransitionType" data-setting-key="pageTransitionType">
                                            <option value="fade-in">Появление (Fade In)</option>
                                            <option value="slide-in-left">Сдвиг слева (Slide In Left)</option>
                                            <option value="slide-in-right">Сдвиг справа (Slide In Right)</option>
                                            <option value="zoom-in">Приближение (Zoom In)</option>
                                        </select>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('pageTransitionDuration', 'pageTransitionDuration', 'Длительность', 0.1, 2, 0.1, 's')}
                                    </div>
                                </div>
                            </div>
                        </div>
                                                <div class="panel-tab-content" id="tab-moderation">
                            <h4>-- <i class="fas fa-shield-alt"></i> Инструменты Модератора --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableThreadPreview" name="enableThreadPreview" data-setting-key="enableThreadPreview"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableThreadPreview" class="inline-label"><i class="fas fa-eye fa-fw" style="color: #00F0FF;"></i> Предпросмотр тем</label>
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableSectionStats" name="enableSectionStats" data-setting-key="enableSectionStats"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableSectionStats" class="inline-label"><i class="fas fa-chart-bar fa-fw" style="color: #FFEB3B;"></i> Статистика раздела</label>
                            </div>

                            <h4>-- <i class="fas fa-keyboard"></i> Биндер --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableBinder" name="enableBinder" data-setting-key="enableBinder"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableBinder" class="inline-label"><i class="fas fa-bolt fa-fw" style="color: #00F0FF;"></i> Включить Биндер</label>
                            </div>

                            <h4>-- <i class="fas fa-tasks"></i> Жалобы --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableComplaintTracker" name="enableComplaintTracker" data-setting-key="enableComplaintTracker"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableComplaintTracker" class="inline-label"><i class="fas fa-stopwatch fa-fw" style="color: #e74c3c;"></i> Отслеживание сроков</label>${createTooltip('Добавляет цветной таймер к темам. Зеленый (свежее) -> Желтое -> Красное (просрочено).')}
                                <div class="sub-settings" id="complaint-tracker-sub-settings">
                                    <div>
                                        <label for="s_complaintTrackerSections">Разделы (URL часть):</label>
                                        <input type="text" id="s_complaintTrackerSections" name="complaintTrackerSections" data-setting-key="complaintTrackerSections" placeholder="жалобы, обжалование...">
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('complaintTrackerWarnTime', 'complaintTrackerWarnTime', 'Внимание (Желтый)', 1, 48, 1, 'ч')}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('complaintTrackerCritTime', 'complaintTrackerCritTime', 'Критично (Красный)', 1, 72, 1, 'ч')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="panel-tab-content" id="tab-interface">
                            <h4>-- <i class="fas fa-compass"></i> Навигация --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableDynamicWelcome" name="enableDynamicWelcome" data-setting-key="enableDynamicWelcome"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableDynamicWelcome" class="inline-label"><i class="fas fa-hand-sparkles fa-fw" style="color: #FFEB3B;"></i> Динамическое приветствие</label>${createTooltip('При первой загрузке форума за день будет показывать приветствие (Доброе утро/день/вечер) в углу экрана.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableCopyToast" name="enableCopyToast" data-setting-key="enableCopyToast"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableCopyToast" class="inline-label"><i class="fas fa-copy fa-fw" style="color: #2ecc71;"></i> Уведомление при копировании</label>${createTooltip('Показывает всплывающее сообщение, когда вы копируете любой текст на форуме (Ctrl+C).')}
                            </div>

                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableSkeletonLoading" name="enableSkeletonLoading" data-setting-key="enableSkeletonLoading"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableSkeletonLoading" class="inline-label"><i class="fas fa-bone fa-fw" style="color: #ccc;"></i> Скелетная загрузка</label>${createTooltip('Показывает красивую анимацию загрузки (скелет) вместо белого экрана при открытии страниц.')}
                            </div>

                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableSmartNav" name="enableSmartNav" data-setting-key="enableSmartNav"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableSmartNav" class="inline-label"><i class="fas fa-bars fa-fw" style="color: #3498db;"></i> Умная навигация</label>${createTooltip('Верхняя панель навигации (шапка) будет автоматически скрываться, когда вы скроллите вниз, и появляться, когда скроллите вверх.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableScrollIndicator" name="enableScrollIndicator" data-setting-key="enableScrollIndicator"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableScrollIndicator" class="inline-label"><i class="fas fa-grip-lines fa-fw" style="color: #00F0FF;"></i> Индикатор прокрутки</label>${createTooltip('В самом верху экрана появится тонкая цветная полоса, показывающая, как далеко вы прокрутили страницу.')}
                                <div class="sub-settings" id="scroll-indicator-sub-settings">
                                    <div><label for="s_scrollIndicatorColor">Цвет:</label><input type="color" id="s_scrollIndicatorColor" name="scrollIndicatorColor" data-setting-key="scrollIndicatorColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('scrollIndicatorHeight', 'scrollIndicatorHeight', 'Высота', 1, 10, 0.5, 'px')}
                                    </div>
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-user-check"></i> Мои Сообщения --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableOwnMessageHighlight" name="enableOwnMessageHighlight" data-setting-key="enableOwnMessageHighlight"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableOwnMessageHighlight" class="inline-label"><i class="fas fa-user fa-fw" style="color: #2ecc71;"></i> Выделять мои сообщения</label>${createTooltip('Все ваши посты на форуме будут выделены выбранным цветом, чтобы их было легче найти.')}
                                <small id="my-username-status" class="panel-status-text">Ваш ник: (не найден)</small>
                                <div class="sub-settings" id="own-message-highlight-sub-settings">
                                    <div><label for="s_ownMessageHighlightBgColor">Цвет фона:</label> <input type="color" id="s_ownMessageHighlightBgColor" name="ownMessageHighlightBgColor" data-setting-key="ownMessageHighlightBgColor"></div>
                                    <div style="margin-top: 8px;"><label for="s_ownMessageHighlightEdgeColor">Цвет окантовки:</label> <input type="color" id="s_ownMessageHighlightEdgeColor" name="ownMessageHighlightEdgeColor" data-setting-key="ownMessageHighlightEdgeColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('ownMessageHighlightEdgeWidth', 'ownMessageHighlightEdgeWidth', 'Толщина окантовки', 0, 10, 0.5, 'px')}
                                    </div>
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-ellipsis-h"></i> Нижняя Панель Навигации --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableBottomNav" name="enableBottomNav" data-setting-key="enableBottomNav"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableBottomNav" class="inline-label"><i class="fas fa-check-circle fa-fw" style="color: #2ecc71;"></i> Включить панель</label>${createTooltip('Добавляет внизу экрана удобную панель с быстрыми ссылками и часами.')}
                            </div>
                            <div class="setting-group">
                                <label for="s_bottomNavPosition">Позиция:</label>
                                <select id="s_bottomNavPosition" name="bottomNavPosition" data-setting-key="bottomNavPosition">
                                    <option value="bottom-center">Внизу по центру</option> <option value="bottom-left">Внизу слева</option> <option value="bottom-right">Внизу справа</option>
                                    <option value="top-center">Вверху по центру</option> <option value="top-left">Вверху слева</option> <option value="top-right">Вверху справа</option>
                                    <option value="middle-left">Посередине слева</option> <option value="middle-right">Посередине справа</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                ${createSlider('bottomNavOpacity', 'bottomNavOpacity', 'Прозрачность', 0, 1, 0.05)}
                            </div>
                            <div class="setting-group">
                            <div class="setting-group br-input-group">
                                <input type="text" id="s_bottomNavBorderRadius" name="bottomNavBorderRadius" data-setting-key="bottomNavBorderRadius" placeholder=" ">
                                <label for="s_bottomNavBorderRadius">Скругление (10px, 25px...)</label>
                            </div>
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableBottomNavClock" name="enableBottomNavClock" data-setting-key="enableBottomNavClock"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableBottomNavClock" class="inline-label"><i class="fas fa-clock fa-fw" style="color: #fff;"></i> Показывать часы</label>
                                <div class="sub-settings" id="clock-sub-settings" style="margin-top: 5px;">
                                    <label for="s_bottomNavClockColor">Цвет часов:</label>
                                    <input type="color" id="s_bottomNavClockColor" name="bottomNavClockColor" data-setting-key="bottomNavClockColor">
                                </div>
                            </div>
                            <div class="setting-group dynamic-links-group">
                                <label><i class="fas fa-link fa-fw" style="color: #3498db;"></i> Быстрые ссылки:</label>${createTooltip('Ссылки, которые будут отображаться в нижней панели навигации.')}
                                <div id="quick-links-container"></div>
                                <button id="add-quick-link-btn" class="panel-btn panel-btn-add" style="margin-top: 10px; width: 100%;"><i class="fas fa-plus"></i> Добавить ссылку</button>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-live">
                            <h4>-- <i class="fas fa-broadcast-tower"></i> Обновления в Реальном Времени --</h4>
                            <div class="setting-group">
                                <label for="s_liveUpdateInterval"><i class="fas fa-history fa-fw" style="color: #ccc;"></i> Интервал обновлений (в сек.):</label>${createTooltip('Как часто скрипт будет проверять форум на наличие обновлений. Не ставьте слишком низкое значение (меньше 30), чтобы не создавать нагрузку!')}
                                <input type="number" id="s_liveUpdateInterval" name="liveUpdateInterval" data-setting-key="liveUpdateInterval" min="30" max="600" step="10">
                            </div>
                            <div class="setting-group">
                                <label for="s_enableLiveCounters" class="inline-label"><i class="fas fa-bell fa-fw" style="color: #f1c40f;"></i> "Живые" счетчики (Уведомления/ЛС)</label>${createTooltip('Счетчики новых уведомлений и личных сообщений в шапке будут обновляться сами, без перезагрузки страницы.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableHotTopicPulse" name="enableHotTopicPulse" data-setting-key="enableHotTopicPulse"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableHotTopicPulse" class="inline-label"><i class="fas fa-fire fa-fw" style="color: #e74c3c;"></i> Пульсация "горячих" тем</label>${createTooltip('Если вы находитесь в списке тем, и в какой-то из них появится новый ответ, она на секунду подсветится.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableLiveFeed" name="enableLiveFeed" data-setting-key="enableLiveFeed"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableLiveFeed" class="inline-label"><i class="fas fa-stream fa-fw" style="color: #3498db;"></i> Лента "Что нового" в нижней панели</label>${createTooltip('В левой части нижней панели будет показывать 2-3 последних сообщения, появившихся на форуме.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableAdminOnlineToast" name="enableAdminOnlineToast" data-setting-key="enableAdminOnlineToast"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableAdminOnlineToast" class="inline-label"><i class="fas fa-user-shield fa-fw" style="color: #e74c3c;"></i> Уведомление о входе администрации</label>${createTooltip('Скрипт будет проверять список "Сейчас онлайн" и присылать вам уведомление, если в сети появится кто-то из этого списка.')}
                                <div class="sub-settings" id="admin-toast-sub-settings">
                                    <label for="s_adminToastNicks">Никнеймы (каждый с новой строки):</label>
                                    <textarea id="s_adminToastNicks" name="adminToastNicks" data-setting-key="adminToastNicks" rows="4" placeholder="King_Rangers"></textarea>
                                </div>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-presets">
                            <div class="setting-group">
                                <label for="s_panelTheme"><i class="fas fa-paint-roller fa-fw" style="color: #9b59b6;"></i> Тема Панели Настроек</label>
                                <select id="s_panelTheme" name="panelTheme" data-setting-key="panelTheme">
                                    <option value="classic_dark">Вечная Классика (По умолч.)</option>
                                    <option value="graphite_blurple">Современный Графит</option>
                                    <option value="pragmatic_grey">Прагматичный Серый</option>
                                    <option value="clean_monochrome">Чистый Монохром</option>
                                    <option value="warm_sepia">Теплая Сепия</option>
                                    <option value="emerald_forest">Изумрудный Лес</option>
                                    <option value="sunset_rose">Розовый Закат</option>
                                </select>
                            </div>
<h4>-- <i class="fas fa-compass"></i> Тема Нижней Панели --</h4>
                            <div class="setting-group">
                                <label for="s_bottomNavTheme"><i class="fas fa-paint-brush fa-fw" style="color: #ff8dee;"></i> Стиль панели навигации:</label>
                                ${createTooltip('Выберите один из готовых стилей для нижней панели навигации. Этот стиль также применится к иконке 🎨.')}
                                <select id="s_bottomNavTheme" name="bottomNavTheme" data-setting-key="bottomNavTheme">
                                    <option value="nav_theme_custom_dynamic" style="display:none;">🎨 Адаптированный (Активен)</option>
                                    <option value="nav_theme_fire">Огонь (По умолч.)</option>
                                    <option value="nav_theme_ocean">Океан (Синий/Голубой)</option>
                                    <option value="nav_theme_forest">Лес (Зеленый/Лайм)</option>
                                    <option value="nav_theme_cyber">Киберпанк (Розовый/Голубой)</option>
                                    <option value="nav_theme_mono">Монохром (Белый/Серый)</option>
                                </select>
                            </div>
                            <h4>-- <i class="fas fa-gift"></i> Встроенные Темы --</h4>
                            <div class="setting-group preset-manager">
                                <label for="s_builtInPresetSelect" style="font-weight: bold; color: #fff;">Выберите тему:</label>${createTooltip('Готовые темы, меняющие почти все настройки скрипта в 1 клик. Выберите и нажмите "Загрузить".')}
                                <select id="s_builtInPresetSelect" name="builtInPresetSelect" style="margin-bottom: 8px; margin-top: 4px;">
                                    <option value="">-- Выберите тему --</option>
                                    <option value="new_year">Новый Год (🎄)</option>
                                    <option value="halloween">Хэллоуин (🎃)</option>
                                    <option value="valentines">День Св. Валентина (💖)</option>
                                    <option value="womens_day">8 Марта (🌷)</option>
                                    <option value="victory_day">День Победы (🎖️)</option>
                                    <option value="ramadan">Рамадан (🌙)</option>
                                    <option value="cyberpunk">Киберпанк (🌃)</option>
                                    <option value="default_dark">Стандартный Темный (🌑)</option>
                                </select>
                                <button id="load-builtin-preset-btn" class="panel-btn" style="width: 100%; background-color: #17a2b8; color: white; font-size: 13px;"><i class="fas fa-download"></i> Загрузить тему</button>
                            </div>
                            <h4>-- <i class="fas fa-brain"></i> Контекстные Темы --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableContextualBackgrounds" name="enableContextualBackgrounds" data-setting-key="enableContextualBackgrounds"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableContextualBackgrounds" class="inline-label"><i class="fas fa-random fa-fw" style="color: #3498db;"></i> Сменить Тем в разделе...</label>${createTooltip('Автоматически применяет выбранный Тем, когда вы заходите в определенный раздел. Полезно, чтобы сделать раздел "Жалобы" более строгим, а "Оффтоп" - веселым.')}
                                <div class="sub-settings" id="contextual-bg-sub-settings">
                                    <div class="br-input-group">
                                        <input type="text" id="s_contextualBgUrl" name="contextualBgUrl" data-setting-key="contextualBgUrl" placeholder=" ">
                                        <label for="s_contextualBgUrl">...если URL содержит (zhaloby)</label>
                                    </div>
                                    <label for="s_contextualBgPreset" style="margin-top: 8px;">...на этот Тем:</label>
                                    <select id="s_contextualBgPreset" name="contextualBgPreset" data-setting-key="contextualBgPreset"></select>
                                </div>
                            </div>

                            <h4>-- <i class="fas fa-save"></i> Мои Темы --</h4>
                            <div class="setting-group preset-manager">
                                <label for="s_customPresetSelect" style="font-weight: bold; color: #fff;">Управление Темами</label>${createTooltip('Здесь хранятся ваши личные Темы. Настройте форум как вам нравится, введите название в поле ниже и нажмите "Сохранить Тем".')}
                                <select id="s_customPresetSelect" name="customPresetSelect" style="margin-bottom: 8px; margin-top: 4px;"></select>
                                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                                    <button id="load-preset-btn" class="panel-btn" style="flex: 1; background-color: #2196F3; color: white; font-size: 12px; padding: 5px;"><i class="fas fa-check"></i> Загрузить</button>
                                    <button id="delete-preset-btn" class="panel-btn panel-btn-danger" style="flex: 1; font-size: 12px; padding: 5px;"><i class="fas fa-trash-alt"></i> Удалить</button>
                                </div>
                                <div class="br-input-group" style="margin-bottom: 8px;">
                                    <input type="text" id="s_newPresetName" data-setting-key="newPresetName_IGNORE" placeholder=" " style="margin: 0;">
                                    <label for="s_newPresetName">Название нового Тема</label>
                                </div>
                                <button id="save-preset-btn" class="panel-btn panel-btn-save" style="width: 100%; font-size: 13px;"><i class="fas fa-save"></i> Сохранить Тем</button>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-integrations">
                            <h4>-- <i class="fas fa-cloud-upload-alt"></i> Интеграция Скриншотов (ImgBB) --</h4>
                            <div class="setting-group">
                                <label for="s_imgbbApiKey"><i class="fas fa-key fa-fw" style="color: #f1c40f;"></i> Ваш API ключ (v1) от ImgBB:</label>
                                ${createTooltip('Скрипт будет использовать этот ключ для быстрой загрузки ваших скриншотов. Это бесплатно.')}
                                <input type="text" id="s_imgbbApiKey" name="imgbbApiKey" data-setting-key="imgbbApiKey" placeholder="Вставьте свой API ключ...">
                                <a href="https://api.imgbb.com/" target="_blank" style="font-size: 11px; color: #00F0FF; display: block; margin-top: 8px;">
                                    <i class="fas fa-external-link-alt"></i> Получить API ключ (1 минута, бесплатно)
                                </a>
                            </div>

                            <div class="setting-group">
                                <label><i class="fas fa-history fa-fw" style="color: #ccc;"></i> История загрузок (ImgBB):</label>
                                ${createTooltip('Последние 20 загруженных вами изображений. Нажмите на код, чтобы скопировать.')}
                                <div id="br-upload-history-container" style="max-height: 200px; overflow-y: auto; background: #0D1D25; padding: 8px; border-radius: 6px; margin-top: 10px;">
                                    <p style="font-size: 12px; color: #888; text-align: center;">История загрузок пуста.</p>
                                </div>
                                <button id="clear-upload-history-btn" class="panel-btn panel-btn-danger" style="margin-top: 10px; width: 100%; font-size: 12px; padding: 5px;"><i class="fas fa-eraser"></i> Очистить историю</button>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-gallery">
                            <h4>-- 🖼️ Галерея Обоев --</h4>
                            <div class="setting-group">
                                <label>Выберите изображение для фона:</label>
                                <div id="br-gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 10px;"></div>
                            </div>
                        </div>

                        <div class="panel-tab-content" id="tab-help">
                            <h4>-- <i class="fas fa-question-circle"></i> Справочник --</h4>
                            <div class="setting-group br-help-section">
                                <label>О скрипте</label>
                                <p>
                                    Это инструмент для полной кастомизации форума. Он объединяет визуальные улучшения (темы, эффекты) и утилиты для работы (модерация, биндер).
                                </p>
                                <p>
                                    Настройки сохраняются автоматически при нажатии кнопки <strong>"Сохранить"</strong>.
                                </p>
                            </div>

                            <div class="setting-group br-help-section">
                                <label>Описание разделов</label>
                                <ul>
                                    <li><strong>🛡️ Модерация:</strong> Рабочие инструменты. Биндер ответов, трекер сроков проверки жалоб, статистика раздела и предпросмотр тем без открытия.</li>
                                    <li><strong>🖼️ Галерея:</strong> Встроенный каталог красивых обоев (Природа, Город, Аниме и др.). При выборе обоев скрипт предложит включить <b>Адаптацию</b>.</li>
                                    <li><strong>🏠 Главное:</strong> Настройка своего фона (загрузка файла) и прозрачности окон.</li>
                                    <li><strong>🎨 Визуал:</strong> Шрифты, свечение текста, выделение своих сообщений и сообщений автора темы.</li>
                                    <li><strong>✨ Анимации:</strong> Погодные эффекты (снег/дождь), живые рамки аватарок и анимации интерфейса.</li>
                                    <li><strong>🕹️ Интерфейс:</strong> Настройка нижней панели навигации и индикатора прокрутки страницы.</li>
                                    <li><strong>☁️ Интеграция:</strong> Настройка API ключа ImgBB для загрузки картинок прямо из редактора сообщений.</li>
                                </ul>
                            </div>

                            <div class="setting-group br-help-section">
                                <label>Система Адаптации</label>
                                <p>
                                    Это уникальная функция скрипта. Когда вы выбираете фон в <strong>Галерее</strong> или загружаете свой в разделе <strong>Главное</strong>, скрипт анализирует цвета изображения.
                                </p>
                                <p>
                                    Он предложит <strong>Адаптировать дизайн</strong>. Если согласиться, все кнопки, рамки, текст и неоновое свечение перекрасятся в основные цвета вашего фона.
                                </p>
                            </div>

                            <div class="setting-group br-help-section">
                                <label>Полезные функции</label>
                                <p>
                                    • <strong>Биндер:</strong> Кнопка находится над полем ввода текста. Позволяет создавать шаблоны ответов.
                                    <br>
                                    • <strong>Предпросмотр:</strong> Нажмите на иконку <i class="fas fa-eye"></i> рядом с темой, чтобы прочитать её во всплывающем окне.
                                    <br>
                                    • <strong>Загрузка фото:</strong> Вставьте картинку (Ctrl+V) в редактор, и появится кнопка быстрой загрузки на хостинг.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button id="export-btn" class="panel-btn panel-btn-export" title="Экспорт"><i class="fas fa-file-export"></i></button>
                    <button id="import-btn" class="panel-btn panel-btn-import" title="Импорт"><i class="fas fa-file-import"></i></button>
                    <input type="file" id="import-settings-file" accept=".json" style="display: none;">
                    <span style="flex-grow: 1;"></span>
                    <button id="reset-btn" class="panel-btn panel-btn-reset" title="Сбросить всё"><i class="fas fa-undo-alt"></i></button>
                    <button id="save-btn" class="panel-btn panel-btn-save"><i class="fas fa-save"></i> Сохранить</button>
                </div>
            `;


            document.body.appendChild(panelWrapper);

            const hubCards = panelDiv.querySelectorAll('.br-hub-card');
            const settingsView = panelDiv.querySelector('.br-settings-view');
            const settingsTitle = panelDiv.querySelector('.br-settings-title');
            const allSettingsPages = panelDiv.querySelectorAll('.panel-tab-content');
            const backBtn = panelDiv.querySelector('.br-settings-back-btn');

            const navigateToPage = (pageId, cardTitle) => {
                const hubGrid = panelDiv.querySelector('.br-hub-grid');
                hubGrid.classList.add('br-slide-out-left');

                setTimeout(() => {
                    allSettingsPages.forEach(p => {
                        p.style.display = 'none';
                        p.classList.remove('br-slide-in-right', 'br-slide-out-right');
                    });

                    const pageToShow = panelDiv.querySelector(`#${pageId}`);
                    if (pageToShow) {
                        pageToShow.style.display = 'block';
                        pageToShow.classList.add('br-slide-in-right');
                    }

                    settingsTitle.textContent = cardTitle;
                    panelDiv.dataset.view = 'page';
                    hubGrid.classList.remove('br-slide-out-left');
                }, 250);
            };

            const navigateToHub = () => {
                const visiblePage = Array.from(allSettingsPages).find(p => p.style.display === 'block');
                if (visiblePage) visiblePage.classList.add('br-slide-out-right');

                setTimeout(() => {
                    if (visiblePage) visiblePage.style.display = 'none';
                    panelDiv.dataset.view = 'hub';
                    const hubGrid = panelDiv.querySelector('.br-hub-grid');
                    hubGrid.classList.add('br-slide-in-left');
                    setTimeout(() => hubGrid.classList.remove('br-slide-in-left'), 400);
                }, 200);
            };

            hubCards.forEach(card => {
                card.addEventListener('click', () => {
                    const pageId = card.dataset.page;
                    const cardTitle = card.querySelector('span').textContent;
                    navigateToPage(pageId, cardTitle);
                });
            });

            backBtn.addEventListener('click', navigateToHub);


                        const saveBtn = panelDiv.querySelector('#save-btn');
            const bgFileInput = panelDiv.querySelector('#s_bgImageFile');
            const clearBgBtn = panelDiv.querySelector('#clear-bg-btn');
            const bgStatus = panelDiv.querySelector('#bg-status');
            const exportBtn = panelDiv.querySelector('#export-btn');
            const importBtn = panelDiv.querySelector('#import-btn');
            const importFileInput = panelDiv.querySelector('#import-settings-file');
            const panelThemeSelect = panelDiv.querySelector('#s_panelTheme');
            const addQuickLinkBtn = panelDiv.querySelector('#add-quick-link-btn');
            const quickLinksContainer = panelDiv.querySelector('#quick-links-container');
            const resetBtn = panelDiv.querySelector('#reset-btn');
            const loadPresetBtn = panelDiv.querySelector('#load-preset-btn');
            const loadBuiltInPresetBtn = panelDiv.querySelector('#load-builtin-preset-btn');
            const savePresetBtn = panelDiv.querySelector('#save-preset-btn');
            const deletePresetBtn = panelDiv.querySelector('#delete-preset-btn');
            const clearHistoryBtn = panelDiv.querySelector('#clear-upload-history-btn');

            const enableGradientCheckbox = panelDiv.querySelector('#s_enableGradient');
            const gradientSubSettings = panelDiv.querySelector('#gradient-sub-settings');
            const enableAnimatedGradientCheckbox = panelDiv.querySelector('#s_enableAnimatedGradient');
            const animatedGradientSubSettings = panelDiv.querySelector('#animated-gradient-sub-settings');
            const bgImageSettingGroup = panelDiv.querySelector('#bg-image-setting-group');
            const enableRoundingCheckbox = panelDiv.querySelector('#s_enableRounding');
            const roundingSubSettings = panelDiv.querySelector('#rounding-sub-settings');
            const enableEdgeCheckbox = panelDiv.querySelector('#s_enableEdge');
            const edgeSubSettings = panelDiv.querySelector('#edge-sub-settings');
            const enableTextGlowCheckbox = panelDiv.querySelector('#s_enableTextGlow');
            const textGlowSubSettings = panelDiv.querySelector('#text-glow-sub-settings');
            const effectTypeSelect = panelDiv.querySelector('#s_effectType');
            const effectDetailsSettings = panelDiv.querySelector('#effect-details-settings');
            const effectRainSettings = panelDiv.querySelector('.rain-settings');
            const effectSwaySettings = panelDiv.querySelector('.sway-settings');
            const effectMatrixSettings = panelDiv.querySelector('.matrix-settings');
            const enableBottomNavClockCheckbox = panelDiv.querySelector('#s_enableBottomNavClock');
            const clockSubSettings = panelDiv.querySelector('#clock-sub-settings');
            const enableBlockBlurCheckbox = panelDiv.querySelector('#s_enableBlockBlur');
            const blockBlurSubSettings = panelDiv.querySelector('#block-blur-sub-settings');
            const enableOwnMessageHighlightCheckbox = panelDiv.querySelector('#s_enableOwnMessageHighlight');
            const ownMessageHighlightSubSettings = panelDiv.querySelector('#own-message-highlight-sub-settings');
            const enablePageTransitionCheckbox = panelDiv.querySelector('#s_enablePageTransition');
            const pageTransitionSubSettings = panelDiv.querySelector('#page-transition-sub-settings');
            const enableAdminOnlineToastCheckbox = panelDiv.querySelector('#s_enableAdminOnlineToast');
            const adminToastSubSettings = panelDiv.querySelector('#admin-toast-sub-settings');
            const enableContextualBackgroundsCheckbox = panelDiv.querySelector('#s_enableContextualBackgrounds');
            const contextualBgSubSettings = panelDiv.querySelector('#contextual-bg-sub-settings');


            const enableAvatarBorderCheckbox = panelDiv.querySelector('#s_enableAvatarBorder');
            const avatarBorderSubSettings = panelDiv.querySelector('#avatar-border-sub-settings');
            const avatarBorderStyleSelect = panelDiv.querySelector('#s_avatarBorderStyle');
            const avatarGradientSettings = panelDiv.querySelector('#avatar-gradient-settings');
            const avatarPulsateSettings = panelDiv.querySelector('#avatar-pulsate-settings');
            const enable3DAvatarHoverCheckbox = panelDiv.querySelector('#s_enable3DAvatarHover');

            const enablePulsatingNicksCheckbox = panelDiv.querySelector('#s_enablePulsatingNicks');
            const pulsatingNicksSubSettings = panelDiv.querySelector('#pulsating-nicks-sub-settings');
            const enableGradientNicksCheckbox = panelDiv.querySelector('#s_enableGradientNicks');
            const gradientNicksSubSettings = panelDiv.querySelector('#gradient-nicks-sub-settings');

            const enableUiAnimationsCheckbox = panelDiv.querySelector('#s_enableUiAnimations');
            const uiAnimationsSubSettings = panelDiv.querySelector('#ui-animations-sub-settings');

            const enableScrollFadeInCheckbox = panelDiv.querySelector('#s_enableScrollFadeIn');
            const scrollFadeInSubSettings = panelDiv.querySelector('#scroll-fade-in-sub-settings');

            const enableParallaxScrollCheckbox = panelDiv.querySelector('#s_enableParallaxScroll');
            const parallaxScrollSubSettings = panelDiv.querySelector('#parallax-scroll-sub-settings');

            const enableSmartNavCheckbox = panelDiv.querySelector('#s_enableSmartNav');

const enableComplaintTrackerCheckbox = panelDiv.querySelector('#s_enableComplaintTracker');
            const complaintTrackerSubSettings = panelDiv.querySelector('#complaint-tracker-sub-settings');

            const enableScrollIndicatorCheckbox = panelDiv.querySelector('#s_enableScrollIndicator');
            const scrollIndicatorSubSettings = panelDiv.querySelector('#scroll-indicator-sub-settings');

            const toggleAvatarSubSettings = () => {
                const style = avatarBorderStyleSelect.value;
                avatarGradientSettings.style.display = (style === 'gradient') ? 'block' : 'none';
                avatarPulsateSettings.style.display = (style === 'pulsate') ? 'block' : 'none';
            };

            const toggleNickSubSettings = () => {
                pulsatingNicksSubSettings.style.display = (enablePulsatingNicksCheckbox.checked && !enableGradientNicksCheckbox.checked) ? 'block' : 'none';
                gradientNicksSubSettings.style.display = (enableGradientNicksCheckbox.checked) ? 'block' : 'none';
                if (enableGradientNicksCheckbox.checked) {
                    pulsatingNicksSubSettings.style.display = 'none';
                }
            };

            const toggleEffectSubSettings = () => {
                const effectType = effectTypeSelect.value; const showDetails = effectType !== 'none'; effectDetailsSettings.style.display = showDetails ? 'block' : 'none'; if (showDetails) { effectRainSettings.style.display = (effectType === 'rain') ? 'block' : 'none'; effectMatrixSettings.style.display = (effectType === 'matrix') ? 'block' : 'none'; effectSwaySettings.style.display = (effectType.startsWith('snow') || effectType.startsWith('petals') || effectType.startsWith('leaves') || effectType === 'fireflies' || effectType === 'bubbles') ? 'block' : 'none'; } else { effectRainSettings.style.display = 'none'; effectSwaySettings.style.display = 'none'; effectMatrixSettings.style.display = 'none'; }
            };

            const toggleGenericSubSettings = (checkbox, subSettingsDiv) => {
                if (checkbox && subSettingsDiv) subSettingsDiv.style.display = checkbox.checked ? 'block' : 'none';
            };

            const initializeSubSettingsVisibility = () => {

                toggleGenericSubSettings(enableComplaintTrackerCheckbox, complaintTrackerSubSettings);

                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);
                toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings);
                toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings);
                toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings);
                toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings);
                toggleEffectSubSettings();
                toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings);
                toggleGenericSubSettings(enableBlockBlurCheckbox, blockBlurSubSettings);
                toggleGenericSubSettings(enableOwnMessageHighlightCheckbox, ownMessageHighlightSubSettings);
                toggleGenericSubSettings(enablePageTransitionCheckbox, pageTransitionSubSettings);
                toggleGenericSubSettings(enableAdminOnlineToastCheckbox, adminToastSubSettings);
                toggleGenericSubSettings(enableContextualBackgroundsCheckbox, contextualBgSubSettings);

                toggleGenericSubSettings(enableAvatarBorderCheckbox, avatarBorderSubSettings);
                toggleAvatarSubSettings();

                toggleGenericSubSettings(enablePulsatingNicksCheckbox, pulsatingNicksSubSettings);
                toggleGenericSubSettings(enableGradientNicksCheckbox, gradientNicksSubSettings);
                toggleNickSubSettings();

                toggleGenericSubSettings(enableUiAnimationsCheckbox, uiAnimationsSubSettings);
                toggleGenericSubSettings(enableScrollFadeInCheckbox, scrollFadeInSubSettings);
                toggleGenericSubSettings(enableParallaxScrollCheckbox, parallaxScrollSubSettings);
                toggleGenericSubSettings(enableScrollIndicatorCheckbox, scrollIndicatorSubSettings);

                if (bgImageSettingGroup) {
                    bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                }
                 if (animatedGradientSubSettings) {
                    animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
                }
                 panelDiv.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
            };

             if (effectTypeSelect) {
                 effectTypeSelect.brInitializeVisibility = initializeSubSettingsVisibility;
             }
             if (enableAvatarBorderCheckbox) {
                 enableAvatarBorderCheckbox.brInitializeVisibility = initializeSubSettingsVisibility;
             }

            enableGradientCheckbox.addEventListener('change', () => {
                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);
                if (bgImageSettingGroup) bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                if (animatedGradientSubSettings) animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
            });
            enableAnimatedGradientCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings));

            enableComplaintTrackerCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableComplaintTrackerCheckbox, complaintTrackerSubSettings));


enableRoundingCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings));
            enableEdgeCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings));
            enableTextGlowCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings));
            effectTypeSelect.addEventListener('change', toggleEffectSubSettings);
            enableBottomNavClockCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings));
            enableBlockBlurCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBlockBlurCheckbox, blockBlurSubSettings));
            enableOwnMessageHighlightCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableOwnMessageHighlightCheckbox, ownMessageHighlightSubSettings));
            enablePageTransitionCheckbox.addEventListener('change', () => toggleGenericSubSettings(enablePageTransitionCheckbox, pageTransitionSubSettings));
            enableAdminOnlineToastCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAdminOnlineToastCheckbox, adminToastSubSettings));
            enableContextualBackgroundsCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableContextualBackgroundsCheckbox, contextualBgSubSettings));

            enableAvatarBorderCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAvatarBorderCheckbox, avatarBorderSubSettings));
            avatarBorderStyleSelect.addEventListener('change', toggleAvatarSubSettings);

            enablePulsatingNicksCheckbox.addEventListener('change', toggleNickSubSettings);
            enableGradientNicksCheckbox.addEventListener('change', toggleNickSubSettings);

            enableUiAnimationsCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableUiAnimationsCheckbox, uiAnimationsSubSettings));
            enableScrollFadeInCheckbox.addEventListener('change', (e) => {
                toggleGenericSubSettings(enableScrollFadeInCheckbox, scrollFadeInSubSettings);
                setupScrollObserver(currentSettings);
            });
            enableParallaxScrollCheckbox.addEventListener('change', (e) => {
                toggleGenericSubSettings(enableParallaxScrollCheckbox, parallaxScrollSubSettings);
                applyForumStyles(currentSettings);
            });
            enableScrollIndicatorCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableScrollIndicatorCheckbox, scrollIndicatorSubSettings));

            panelDiv.querySelectorAll('input[type="range"]').forEach(slider => {
                slider.addEventListener('input', () => updateSliderValue(slider));
            });
addQuickLinkBtn.addEventListener('click', (e) => { createRipple(e); addQuickLinkInput(quickLinksContainer); });            resetBtn.addEventListener('click', handleReset);
            saveBtn.addEventListener('click', handleSave);
            clearBgBtn.addEventListener('click', handleClearBg);
            panelDiv.querySelector('#close-btn').addEventListener('click', closePanel);
            loadPresetBtn.addEventListener('click', handleLoadCustomPreset);
            loadBuiltInPresetBtn.addEventListener('click', handleLoadBuiltInPreset);
            savePresetBtn.addEventListener('click', handleSaveCustomPreset);
            deletePresetBtn.addEventListener('click', handleDeleteCustomPreset);
            clearHistoryBtn.addEventListener('click', async () => {
                if (!confirm('Вы уверены, что хотите очистить всю историю загрузок?🚨')) return;
                await GM_setValue(UPLOAD_HISTORY_KEY, '[]');
                await loadUploadHistory();
                showToast('История загрузок очищена.', 'info');
            });
            exportBtn.addEventListener('click', handleExport);
            importBtn.addEventListener('click', () => importFileInput.click());
            importFileInput.addEventListener('change', handleImport);
            panelThemeSelect.addEventListener('change', () => {
                const wrapper = document.getElementById('br-panel-wrapper');
            panelDiv.querySelectorAll('.panel-btn, .br-hub-card, .br-settings-back-btn').forEach(btn => {
                btn.addEventListener('click', createRipple);
            });


                if (wrapper) {
                    wrapper.dataset.theme = panelThemeSelect.value;
                }
            });

            initializeSubSettingsVisibility();

            const galleryGrid = panelDiv.querySelector('#br-gallery-grid');

            if (galleryGrid && typeof WALLPAPER_GALLERY !== 'undefined') {
                galleryGrid.className = 'br-gallery-wrapper';
                galleryGrid.style.display = 'flex';
                galleryGrid.innerHTML = '';

                if (!document.getElementById('br-gallery-smart-scroll')) {
                    const style = document.createElement('style');
                    style.id = 'br-gallery-smart-scroll';
                    style.textContent = `
                        .br-gallery-infinite-container {
                            display: flex;
                            overflow-x: auto;
                            gap: 12px;
                            padding-bottom: 12px;
                            cursor: grab;
                            mask-image: linear-gradient(to right, transparent, black 15px, black 95%, transparent);
                            -webkit-mask-image: linear-gradient(to right, transparent, black 15px, black 95%, transparent);
                            white-space: nowrap;
                            user-select: none;
                            scrollbar-width: none;
                        }
                        .br-gallery-infinite-container::-webkit-scrollbar { display: none; }
                        .br-gallery-infinite-container:active { cursor: grabbing; }
                        .br-gallery-item-smart {
                            min-width: 140px;
                            height: 220px;
                            border-radius: 12px;
                            overflow: hidden;
                            position: relative;
                            border: 1px solid rgba(255,255,255,0.1);
                            transition: transform 0.3s ease, box-shadow 0.3s ease;
                            background: #000;
                            flex-shrink: 0;
                            display: inline-block;
                        }
                        .br-gallery-item-smart:hover {
                            transform: translateY(-5px);
                            border-color: #D59D80;
                            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                            z-index: 2;
                        }
                        .br-gallery-item-smart img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            opacity: 0.8;
                            transition: opacity 0.3s;
                            pointer-events: none;
                        }
                        .br-gallery-item-smart:hover img { opacity: 1; }
                    `;
                    document.head.appendChild(style);
                }

                Object.entries(WALLPAPER_GALLERY).forEach(([categoryName, urls], index) => {
                    if (!Array.isArray(urls) || urls.length === 0) return;

                    const categoryContainer = document.createElement('div');
                    const header = document.createElement('div');
                    header.className = 'br-gallery-category-title';
                    header.innerHTML = categoryName;

                    const scrollContainer = document.createElement('div');
                    scrollContainer.className = 'br-gallery-infinite-container';

                    const safeUrls = [...urls, ...urls, ...urls, ...urls];

               const sharedGalleryObserver = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const target = entry.target;
                                const lazyImg = target.querySelector('img');
                                if (lazyImg && lazyImg.dataset.src) {
                                    lazyImg.src = lazyImg.dataset.src;
                                }
                                obs.unobserve(target);
                            }
                        });
                    }, { rootMargin: "100px" });

                    safeUrls.forEach((url) => {
                        const item = document.createElement('div');
                        item.className = 'br-gallery-item-smart';
                        const img = document.createElement('img');
                        img.dataset.src = url;
                        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

                        sharedGalleryObserver.observe(item);

                        item.appendChild(img);
                        item.addEventListener('click', function(e) {
                            e.preventDefault();

                            const loadingToast = document.createElement('div');
                            loadingToast.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.8); color:white; padding:15px 25px; border-radius:8px; z-index:10010; font-weight:bold; backdrop-filter:blur(5px); box-shadow: 0 5px 15px rgba(0,0,0,0.3);";
                            loadingToast.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Анализ цветов...';
                            document.body.appendChild(loadingToast);

                            GM_xmlhttpRequest({
                                method: "GET", url: url, responseType: "blob",
                                onload: async function(response) {
                                    const blob = response.response;
                                    const reader = new FileReader();

                                    reader.onloadend = async function() {
                                        const dataUri = reader.result;
                                        const imgObj = new Image();
                                        imgObj.src = dataUri;
                                        await new Promise(resolve => { imgObj.onload = resolve; });

                                        const canvas = document.createElement('canvas');
                                        const ctx = canvas.getContext('2d');
                                        canvas.width = 100; canvas.height = 100;
                                        ctx.drawImage(imgObj, 0, 0, 100, 100);
                                        const imgData = ctx.getImageData(0, 0, 100, 100);
                                        const data = imgData.data;

                                        const rgbToHsl = (r, g, b) => {
                                            r/=255;g/=255;b/=255;
                                            const max=Math.max(r,g,b),min=Math.min(r,g,b);
                                            let h,s,l=(max+min)/2;
                                            if(max===min){h=s=0;}else{
                                                const d=max-min;
                                                s=l>0.5?d/(2-max-min):d/(max+min);
                                                switch(max){case r:h=(g-b)/d+(g<b?6:0);break; case g:h=(b-r)/d+2;break; case b:h=(r-g)/d+4;break;}
                                                h/=6;
                                            }
                                            return [h,s,l];
                                        };

                                        const hslToRgb = (h, s, l) => {
                                            let r,g,b;
                                            if(s===0){r=g=b=l;}else{
                                                const hue2rgb=(p,q,t)=>{
                                                    if(t<0)t+=1;if(t>1)t-=1;
                                                    if(t<1/6)return p+(q-p)*6*t;
                                                    if(t<1/2)return q;
                                                    if(t<2/3)return p+(q-p)*(2/3-t)*6;
                                                    return p;
                                                };
                                                const q=l<0.5?l*(1+s):l+s-l*s;
                                                const p=2*l-q;
                                                r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
                                            }
                                            const toHex=x=>{const hex=Math.round(x*255).toString(16); return hex.length===1?'0'+hex:hex;};
                                            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                                        };

                                        const hueScore = new Array(360).fill(0);
                                        let maxScore = 0, bestHue = 0;
                                        for (let i=0; i<data.length; i+=4) {
                                            const [h,s,l] = rgbToHsl(data[i], data[i+1], data[i+2]);
                                            if(s>0.15 && l>0.1 && l<0.9) {
                                                const hueIdx = Math.floor(h*360)%360;
                                                hueScore[hueIdx] += (s*s*10) + (l*2);
                                            }
                                        }
                                        for (let i=0; i<360; i++) {
                                            let sum=0;
                                            for(let k=-10;k<=10;k++) sum+=hueScore[(i+k+360)%360];
                                            if(sum>maxScore){maxScore=sum;bestHue=i;}
                                        }

                                        loadingToast.remove();

                                     const modalId = 'br-preview-' + Date.now();
                                        const modalHTML = `
                                            <div id="${modalId}" style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10005;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);padding:20px;">
                                                <div class="br-modal-window" style="width:100%;max-width:400px;background:#121212;border:1px solid #333;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 50px 100px black;">
                                                    <div style="height:220px;position:relative;width:100%;overflow:hidden;">
                                                        <img src="${dataUri}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;">
                                                        <div class="br-preview-mock" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:20px;gap:10px;">
                                                            <div id="mock-nav-${modalId}" style="height:40px;width:100%;background:#222;border-radius:8px;display:flex;align-items:center;padding:0 15px;border-bottom:2px solid #555;">
                                                                <div style="width:20px;height:20px;background:#fff;opacity:0.2;border-radius:4px;"></div>
                                                            </div>
                                                            <div id="mock-card-${modalId}" style="background:#1a1a1a;border-radius:12px;padding:15px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                                                                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                                                    <span style="background:#E67E22;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">На рассмотрении</span>
                                                                    <span style="background:#C0392B;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">Важно</span>
                                                                </div>
                                                                <div style="color:#fff;font-weight:bold;font-size:13px;margin-bottom:6px;">Заявка на пост Лидера</div>
                                                                <div style="color:#bbb;font-size:11px;line-height:1.3;margin-bottom:10px;">Текст сообщения для проверки читаемости.</div>
                                                                <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:8px;">
                                                                    <div id="mock-ava-${modalId}" style="width:24px;height:24px;border-radius:50%;border:2px solid #555;"></div>
                                                                    <div style="color:#888;font-size:10px;">King_Rangers</div>
                                                                </div>
                                                                <div id="mock-btn-${modalId}" style="height:28px;width:100%;background:#444;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;letter-spacing:1px;">КНОПКА</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style="padding:20px;background:#09090b;overflow-y:auto;max-height:40vh;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ОТТЕНОК</label><span id="hue-text-${modalId}" style="color:#fff;font-size:10px;">${Math.round(bestHue)}°</span></div>
                                                        <input type="range" id="hue-slider-${modalId}" min="0" max="360" value="${bestHue}" style="width:100%;margin-bottom:10px;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">НАСЫЩЕННОСТЬ</label><span id="sat-text-${modalId}" style="color:#fff;font-size:10px;">90%</span></div>
                                                        <input type="range" id="sat-slider-${modalId}" min="0" max="100" value="90" style="width:100%;margin-bottom:10px;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ЯРКОСТЬ ЦВЕТА</label><span id="lig-text-${modalId}" style="color:#fff;font-size:10px;">60%</span></div>
                                                        <input type="range" id="lig-slider-${modalId}" min="20" max="90" value="60" style="width:100%;margin-bottom:15px;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">СКРУГЛЕНИЕ</label><span id="rad-text-${modalId}" style="color:#fff;font-size:10px;">12px</span></div>
                                                        <input type="range" id="rad-slider-${modalId}" min="0" max="30" value="12" style="width:100%;margin-bottom:15px;">
                                                        <div style="display:flex;gap:10px;margin-bottom:20px;">
                                                            <div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Кнопки</label><input type="color" id="color-accent-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div>
                                                            <div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Рамки</label><input type="color" id="color-border-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div>
                                                            <div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Фон</label><input type="color" id="color-bg-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div>
                                                        </div>
                                                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                                            <button id="btn-save-${modalId}" style="background:#fff;border:none;padding:12px;border-radius:8px;font-weight:bold;cursor:pointer;">Применить</button>
                                                            <button id="btn-cancel-${modalId}" style="background:transparent;border:1px solid #333;color:#888;padding:12px;border-radius:8px;cursor:pointer;">Отмена</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
                                        document.body.insertAdjacentHTML('beforeend', modalHTML);

                                        const modal = document.getElementById(modalId);
                                        const hueInp = document.getElementById(`hue-slider-${modalId}`);
                                        const satInp = document.getElementById(`sat-slider-${modalId}`);
                                        const ligInp = document.getElementById(`lig-slider-${modalId}`);
                                        const radInp = document.getElementById(`rad-slider-${modalId}`);

                                        const cAccentInp = document.getElementById(`color-accent-${modalId}`);
                                        const cBorderInp = document.getElementById(`color-border-${modalId}`);
                                        const cBgInp = document.getElementById(`color-bg-${modalId}`);

                                        const mNav = document.getElementById(`mock-nav-${modalId}`);
                                        const mCard = document.getElementById(`mock-card-${modalId}`);
                                        const mAva = document.getElementById(`mock-ava-${modalId}`);
                                        const mBtn = document.getElementById(`mock-btn-${modalId}`);
                                        const mSave = document.getElementById(`btn-save-${modalId}`);

                                        const getAutoBg = (h, s) => hslToRgb(h, s * 0.2, 0.06);

                                        const recalcColors = () => {
                                            const h = parseInt(hueInp.value) / 360;
                                            const s = parseInt(satInp.value) / 100;
                                            const l = parseInt(ligInp.value) / 100;

                                            cAccentInp.value = hslToRgb(h, s, l);
                                            cBorderInp.value = hslToRgb(h, s * 0.7, Math.max(0.2, l - 0.2));
                                            cBgInp.value = getAutoBg(h, s);
                                            updateMockup();
                                        };

                                        const updateMockup = () => {
                                            const ac = cAccentInp.value;
                                            const bo = cBorderInp.value;
                                            const bg = cBgInp.value;
                                            const rd = radInp.value + 'px';

                                            document.getElementById(`hue-text-${modalId}`).innerText = hueInp.value + '°';
                                            document.getElementById(`sat-text-${modalId}`).innerText = satInp.value + '%';
                                            document.getElementById(`lig-text-${modalId}`).innerText = ligInp.value + '%';
                                            document.getElementById(`rad-text-${modalId}`).innerText = rd;

                                            mNav.style.background = bg;
                                            mNav.style.borderBottomColor = ac;
                                            mNav.style.borderRadius = rd;
                                            mCard.style.background = `linear-gradient(to bottom, ${bg}, #050505)`;
                                            mCard.style.borderColor = bo;
                                            mCard.style.boxShadow = `0 0 0 1px ${bo}`;
                                            mCard.style.borderRadius = rd;
                                            mAva.style.borderColor = ac;
                                            mAva.style.boxShadow = `0 0 10px ${ac}`;
                                            mBtn.style.background = `linear-gradient(90deg, ${ac}, ${bo})`;
                                            mBtn.style.boxShadow = `0 5px 15px ${ac}40`;
                                            mBtn.style.borderRadius = rd;
                                            mSave.style.background = ac;
                                            mSave.style.boxShadow = `0 5px 15px ${ac}40`;
                                        };

                                        hueInp.addEventListener('input', recalcColors);
                                        satInp.addEventListener('input', recalcColors);
                                        ligInp.addEventListener('input', recalcColors);
                                        radInp.addEventListener('input', updateMockup);
                                        cAccentInp.addEventListener('input', updateMockup);
                                        cBorderInp.addEventListener('input', updateMockup);
                                        cBgInp.addEventListener('input', updateMockup);

                                        recalcColors();
                                        document.getElementById(`btn-cancel-${modalId}`).onclick = () => modal.remove();

                                        document.getElementById(`btn-save-${modalId}`).onclick = async () => {
                                            const finalAccent = cAccentInp.value;
                                            const finalBorder = cBorderInp.value;
                                            const finalBg = cBgInp.value;
                                            const finalRadius = radInp.value + 'px';

                                            const set = {
                                                ...currentSettings,
                                                bgImageDataUri: dataUri,
                                                enableGradient: false,
                                                bgColor: finalBg,
                                                enableEdge: true,
                                                edgeColor: finalBorder,
                                                enableRounding: true,
                                                borderRadius: finalRadius,
                                                enableScrollIndicator: true,
                                                scrollIndicatorColor: finalAccent,
                                                enableAvatarBorder: true,
                                                avatarBorderColor1: finalAccent,
                                                avatarBorderColor2: finalBorder,
                                                avatarBorderColor3: finalAccent,
                                                enableOpHighlight: true,
                                                opHighlightEdgeColor: finalBorder,
                                                opHighlightBgColor: finalBg,
                                                enableOwnMessageHighlight: true,
                                                ownMessageHighlightEdgeColor: finalAccent,
                                                bottomNavTheme: 'nav_theme_custom_dynamic'
                                            };

                                            if (settingsPanel) {
                                                const sV = (i, v) => {const e=settingsPanel.querySelector('#'+i);if(e)e.value=v;};
                                                const sC = (i, v) => {const e=settingsPanel.querySelector('#'+i);if(e)e.checked=v;};
                                                sC('s_enableGradient', false);
                                                sC('s_enableEdge', true);
                                                sC('s_enableRounding', true);
                                                sC('s_enableScrollIndicator', true);
                                                sC('s_enableAvatarBorder', true);

                                                sV('s_bgColor', finalBg);
                                                sV('s_edgeColor', finalBorder);
                                                sV('s_borderRadius', parseInt(finalRadius));
                                                sV('s_scrollIndicatorColor', finalAccent);
                                                sV('s_avatarBorderColor1', finalAccent);
                                                sV('s_avatarBorderColor2', finalBorder);
                                                sV('s_avatarBorderColor3', finalAccent);
                                            }

                                            const st = document.getElementById('br-dynamic-gradient-vars') || document.createElement('style');
                                            st.id='br-dynamic-gradient-vars';
                                            if(!st.parentNode) document.head.appendChild(st);

                                            st.textContent = `
                                                :root {
                                                    --br-nav-main-gradient: linear-gradient(135deg, ${finalAccent}, ${finalBorder}) !important;
                                                    --br-nav-accent-color: ${finalAccent} !important;
                                                    --br-nav-border-color: ${finalBorder} !important;
                                                    --br-nav-glow-gradient: linear-gradient(45deg, ${finalAccent}, ${finalBorder}, ${finalAccent}) !important;
                                                    --br-primary: ${finalAccent} !important;
                                                    --br-secondary: ${finalBorder} !important;
                                                }
                                                .button, a.button {
                                                    border-color: ${finalBorder} !important;
                                                    background-image: linear-gradient(120deg, ${finalAccent}, ${finalBorder}) !important;
                                                    color: #fff !important;
                                                    box-shadow: 0 4px 15px ${finalAccent}33 !important;
                                                    border-radius: ${finalRadius} !important;
                                                }
                                                .button:hover, a.button:hover {
                                                    box-shadow: 0 5px 25px ${finalAccent}66 !important;
                                                    transform: translateY(-2px);
                                                }
                                                .block-container, .message-inner {
                                                    border: 1px solid ${finalBorder} !important;
                                                    box-shadow: 0 0 15px ${finalAccent}0D !important;
                                                    border-radius: ${finalRadius} !important;
                                                }
                                            `;

                                            await saveSettings(set);
                                            applyForumStyles(set);
                                            updateBottomNavBarContent(set);
                                            manageVisualEffects(set);

                                            if (!document.getElementById(STYLE_ICON_ID)) addSettingsIconHTML();
                                            if (set.enableBottomNav && bottomNavElement) {
                                                const utils = bottomNavElement.querySelector('.br-nav-utilities');
                                                const icon = document.getElementById(STYLE_ICON_ID);
                                                if(utils && icon) utils.prepend(icon);
                                            }

                                            modal.remove();
                                            showToast('✅ Дизайн адаптирован!', 'success');
                                        };
                                    };
                                    reader.readAsDataURL(blob);
                                },
                                onerror: () => { loadingToast.remove(); showToast('Ошибка загрузки', 'error'); }
                            });
                        });
                        scrollContainer.appendChild(item);
                    });
                    categoryContainer.appendChild(header);
                    categoryContainer.appendChild(scrollContainer);
                    galleryGrid.appendChild(categoryContainer);

                    const speed = 1 + Math.random() * 0.8;
                    const direction = index % 2 === 0 ? 1 : -1;
                    let isPaused = false;
                    let pauseTimeout;

                    scrollContainer.scrollLeft = Math.random() * (scrollContainer.scrollWidth / 2);

                    scrollContainer.addEventListener('mouseenter', () => isPaused = true);
                    scrollContainer.addEventListener('mouseleave', () => isPaused = false);
                    scrollContainer.addEventListener('touchstart', () => {
                        isPaused = true;
                        clearTimeout(pauseTimeout);
                    }, { passive: true });
                    scrollContainer.addEventListener('touchend', () => {
                        pauseTimeout = setTimeout(() => isPaused = false, 1500);
                    }, { passive: true });

                    function animateScroll() {
                        if (!isPaused) {
                            if (direction === 1) {
                                scrollContainer.scrollLeft += speed;
                                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
                                    scrollContainer.scrollLeft = 0;
                                }
                            } else {
                                scrollContainer.scrollLeft -= speed;
                                if (scrollContainer.scrollLeft <= 0) {
                                    scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2;
                                }
                            }
                        }
                        requestAnimationFrame(animateScroll);
                    }
                    requestAnimationFrame(animateScroll);
                });
            }
            settingsPanel = panelDiv;
            return panelDiv;
        } catch (e) {
            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА создания HTML панели настроек ❌', e);
            if (panelDiv && panelDiv.parentNode) {
                 panelDiv.parentNode.removeChild(panelDiv);
            }
            showToast('[BR Style] Критическая ошибка создания панели настроек ❌', 'error');
            return null;
        }
    }

    async function handleReset() {
        if (!confirm('Вы уверены, что хотите сбросить ВСЕ настройки стиля к значениям по умолчанию? Это действие необратимо.')) return;
        if (!settingsPanel) return;
        const resetBtn = settingsPanel.querySelector('#reset-btn');
        if (!resetBtn) return;
        const originalBtnText = resetBtn.textContent; resetBtn.textContent = 'Сброс...⏳'; resetBtn.disabled = true;

        const dynamicStyle = document.getElementById('br-dynamic-gradient-vars');
        if (dynamicStyle) dynamicStyle.remove();

        const settingsToReset = { ...defaultSettings };
        settingsToReset.customPresets = currentSettings.customPresets;
        const success = await saveSettings(settingsToReset);
        if (success) {
            openPanel();
            applyForumStyles(currentSettings);
            updateBottomNavBarContent(currentSettings);
            manageVisualEffects(currentSettings);
            handleScroll();
            const bgStatus = settingsPanel.querySelector('#bg-status'); if(bgStatus) bgStatus.textContent = 'Фон не задан.';
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                        showToast('Настройки сброшены по умолчанию!', 'success');
            resetBtn.innerHTML = '<i class="fas fa-check"></i> Сброшено!';
            resetBtn.style.backgroundColor = '#ffc107';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
                resetBtn.style.backgroundColor = '';
                resetBtn.disabled = false;
            }, 1500);
        } else {
            showToast('Ошибка при сбросе настроек!', 'error');
            resetBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка!';
            resetBtn.style.backgroundColor = '#dc3545';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
                resetBtn.style.backgroundColor = '';
                resetBtn.disabled = false;
            }, 2000);

        }
    }

async function handleSave() {
        if (!settingsPanel) return;
        const oldSettingsIcon = document.getElementById(STYLE_ICON_ID);
        if (oldSettingsIcon) {
            oldSettingsIcon.remove();
        }
        addSettingsIconHTML();
        const saveBtn = settingsPanel.querySelector('#save-btn');
         if (!saveBtn) return;
        const originalBtnText = saveBtn.textContent; saveBtn.textContent = 'Сохранение...⏳'; saveBtn.disabled = true;
        let errorOccurred = false;
        const settingsToUpdate = {};
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                settingsToUpdate[key] = value;
            }
        });
        settingsToUpdate.quickLinks = [];
        settingsPanel.querySelectorAll('#quick-links-container .quick-link-input-item').forEach(item => {
             const name = item.querySelector('.quick-link-name').value.trim();
             const url = item.querySelector('.quick-link-url').value.trim();
             if (name && isValidURL(url)) {
                 settingsToUpdate.quickLinks.push({ name, url });
             } else if (name && url) {
                 showToast(`Неверный URL для ссылки "${name}". Ссылка не сохранена.`, 'error');
                 errorOccurred = true;
             }
        });
        settingsToUpdate.customPresets = currentSettings.customPresets;

        if (bgFileInput && bgFileInput.files.length > 0) {
            try {
                const file = bgFileInput.files[0];
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Файл слишком большой (макс 5МБ)', 'error');
                    saveBtn.textContent = originalBtnText;
                    saveBtn.disabled = false;
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function(e) {
                    const dataUri = e.target.result;
                    const imgObj = new Image();
                    imgObj.src = dataUri;
                    await new Promise(resolve => { imgObj.onload = resolve; });

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const size = 100;
                    canvas.width = size; canvas.height = size;
                    ctx.drawImage(imgObj, 0, 0, size, size);
                    const imgData = ctx.getImageData(0, 0, size, size);
                    const data = imgData.data;

                    const rgbToHsl = (r, g, b) => {
                        r /= 255; g /= 255; b /= 255;
                        const max = Math.max(r, g, b), min = Math.min(r, g, b);
                        let h, s, l = (max + min) / 2;
                        if (max === min) { h = s = 0; } else {
                            const d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            switch (max) {
                                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                case g: h = (b - r) / d + 2; break;
                                case b: h = (r - g) / d + 4; break;
                            }
                            h /= 6;
                        }
                        return [h, s, l];
                    };

                    const hslToRgb = (h, s, l) => {
                        let r, g, b;
                        if (s === 0) { r = g = b = l; } else {
                            const hue2rgb = (p, q, t) => {
                                if (t < 0) t += 1; if (t > 1) t -= 1;
                                if (t < 1/6) return p + (q - p) * 6 * t;
                                if (t < 1/2) return q;
                                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                                return p;
                            };
                            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                            const p = 2 * l - q;
                            r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
                        }
                        const toHex = x => { const hex = Math.round(x * 255).toString(16); return hex.length === 1 ? '0' + hex : hex; };
                        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                    };

                    const hueScore = new Array(360).fill(0);
                    let maxScore = 0;
                    let bestHue = 0;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i], g = data[i+1], b = data[i+2];
                        const [h, s, l] = rgbToHsl(r, g, b);
                        if (s > 0.2 && l > 0.15 && l < 0.85) {
                            const hueIdx = Math.floor(h * 360) % 360;
                            const score = s * s * 10 + (1 - Math.abs(l - 0.5)) * 3;
                            hueScore[hueIdx] += score;
                        }
                    }

                    for (let i = 0; i < 360; i++) {
                        let sum = 0;
                        for (let k = -15; k <= 15; k++) {
                            sum += hueScore[(i + k + 360) % 360];
                        }
                        if (sum > maxScore) {
                            maxScore = sum;
                            bestHue = i;
                        }
                    }

                                        const modalId = 'br-preview-local-' + Date.now();
                                        const modalHTML = `
                                            <div id="${modalId}" style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10005;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);padding:20px;">
                                                <div class="br-modal-window" style="width:100%;max-width:400px;background:#121212;border:1px solid #333;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 50px 100px black;">
                                                    <div style="height:220px;position:relative;width:100%;overflow:hidden;">
                                                        <img src="${dataUri}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;">
                                                        <div class="br-preview-mock" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:20px;gap:10px;">
                                                            <div id="mock-nav-${modalId}" style="height:40px;width:100%;background:#222;border-radius:8px;display:flex;align-items:center;padding:0 15px;border-bottom:2px solid #555;">
                                                                <div style="width:20px;height:20px;background:#fff;opacity:0.2;border-radius:4px;"></div>
                                                            </div>
                                                            <div id="mock-card-${modalId}" style="background:#1a1a1a;border-radius:12px;padding:15px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                                                                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                                                    <span style="background:#E67E22;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">На рассмотрении</span>
                                                                    <span style="background:#C0392B;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">Важно</span>
                                                                </div>
                                                                <div style="color:#fff;font-weight:bold;font-size:13px;margin-bottom:6px;">Заявка на пост Лидера</div>
                                                                <div style="color:#bbb;font-size:11px;line-height:1.3;margin-bottom:10px;">Текст сообщения для проверки читаемости.</div>
                                                                <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:8px;">
                                                                    <div id="mock-ava-${modalId}" style="width:24px;height:24px;border-radius:50%;border:2px solid #555;"></div>
                                                                    <div style="color:#888;font-size:10px;">Admin_User</div>
                                                                </div>
                                                                <div id="mock-btn-${modalId}" style="height:28px;width:100%;background:#444;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;letter-spacing:1px;">КНОПКА</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style="padding:20px;background:#09090b;overflow-y:auto;max-height:40vh;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ОТТЕНОК</label><span id="hue-text-${modalId}" style="color:#fff;font-size:10px;">${Math.round(bestHue)}°</span></div>
                                                        <input type="range" id="hue-slider-${modalId}" min="0" max="360" value="${bestHue}" style="width:100%;margin-bottom:10px;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">НАСЫЩЕННОСТЬ</label><span id="sat-text-${modalId}" style="color:#fff;font-size:10px;">90%</span></div>
                                                        <input type="range" id="sat-slider-${modalId}" min="0" max="100" value="90" style="width:100%;margin-bottom:10px;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ЯРКОСТЬ ЦВЕТА</label><span id="lig-text-${modalId}" style="color:#fff;font-size:10px;">60%</span></div>
                                                        <input type="range" id="lig-slider-${modalId}" min="20" max="90" value="60" style="width:100%;margin-bottom:15px;">
                                                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">СКРУГЛЕНИЕ</label><span id="rad-text-${modalId}" style="color:#fff;font-size:10px;">12px</span></div>
                                                        <input type="range" id="rad-slider-${modalId}" min="0" max="30" value="12" style="width:100%;margin-bottom:15px;">
                                                        <div style="display:flex;gap:10px;margin-bottom:20px;">
                                                            <div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Кнопки</label><input type="color" id="color-accent-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div>
                                                            <div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Рамки</label><input type="color" id="color-border-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div>
                                                            <div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Фон</label><input type="color" id="color-bg-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div>
                                                        </div>
                                                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                                            <button id="btn-save-${modalId}" style="background:#fff;border:none;padding:12px;border-radius:8px;font-weight:bold;cursor:pointer;">Применить</button>
                                                            <button id="btn-cancel-${modalId}" style="background:transparent;border:1px solid #333;color:#888;padding:12px;border-radius:8px;cursor:pointer;">Отмена</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
                                        document.body.insertAdjacentHTML('beforeend', modalHTML);

                                        const modal = document.getElementById(modalId);
                                        const hueInp = document.getElementById(`hue-slider-${modalId}`);
                                        const satInp = document.getElementById(`sat-slider-${modalId}`);
                                        const ligInp = document.getElementById(`lig-slider-${modalId}`);
                                        const radInp = document.getElementById(`rad-slider-${modalId}`);

                                        const cAccentInp = document.getElementById(`color-accent-${modalId}`);
                                        const cBorderInp = document.getElementById(`color-border-${modalId}`);
                                        const cBgInp = document.getElementById(`color-bg-${modalId}`);

                                        const mNav = document.getElementById(`mock-nav-${modalId}`);
                                        const mCard = document.getElementById(`mock-card-${modalId}`);
                                        const mAva = document.getElementById(`mock-ava-${modalId}`);
                                        const mBtn = document.getElementById(`mock-btn-${modalId}`);
                                        const mSave = document.getElementById(`btn-save-${modalId}`);

                                        const getAutoBg = (h, s) => hslToRgb(h, s * 0.2, 0.06);

                                        const recalcColors = () => {
                                            const h = parseInt(hueInp.value) / 360;
                                            const s = parseInt(satInp.value) / 100;
                                            const l = parseInt(ligInp.value) / 100;

                                            cAccentInp.value = hslToRgb(h, s, l);
                                            cBorderInp.value = hslToRgb(h, s * 0.7, Math.max(0.2, l - 0.2));
                                            cBgInp.value = getAutoBg(h, s);
                                            updateMockup();
                                        };

                                        const updateMockup = () => {
                                            const ac = cAccentInp.value;
                                            const bo = cBorderInp.value;
                                            const bg = cBgInp.value;
                                            const rd = radInp.value + 'px';

                                            document.getElementById(`hue-text-${modalId}`).innerText = hueInp.value + '°';
                                            document.getElementById(`sat-text-${modalId}`).innerText = satInp.value + '%';
                                            document.getElementById(`lig-text-${modalId}`).innerText = ligInp.value + '%';
                                            document.getElementById(`rad-text-${modalId}`).innerText = rd;

                                            mNav.style.background = bg;
                                            mNav.style.borderBottomColor = ac;
                                            mNav.style.borderRadius = rd;
                                            mCard.style.background = `linear-gradient(to bottom, ${bg}, #050505)`;
                                            mCard.style.borderColor = bo;
                                            mCard.style.boxShadow = `0 0 0 1px ${bo}`;
                                            mCard.style.borderRadius = rd;
                                            mAva.style.borderColor = ac;
                                            mAva.style.boxShadow = `0 0 10px ${ac}`;
                                            mBtn.style.background = `linear-gradient(90deg, ${ac}, ${bo})`;
                                            mBtn.style.boxShadow = `0 5px 15px ${ac}40`;
                                            mBtn.style.borderRadius = rd;
                                            mSave.style.background = ac;
                                            mSave.style.boxShadow = `0 5px 15px ${ac}40`;
                                        };

                                        hueInp.addEventListener('input', recalcColors);
                                        satInp.addEventListener('input', recalcColors);
                                        ligInp.addEventListener('input', recalcColors);
                                        radInp.addEventListener('input', updateMockup);
                                        cAccentInp.addEventListener('input', updateMockup);
                                        cBorderInp.addEventListener('input', updateMockup);
                                        cBgInp.addEventListener('input', updateMockup);

                                        recalcColors();
                                        document.getElementById(`btn-cancel-${modalId}`).addEventListener('click', () => {
                                            modal.remove();
                                            saveBtn.textContent = originalBtnText;
                                            saveBtn.disabled = false;
                                        });

                                        document.getElementById(`btn-save-${modalId}`).addEventListener('click', async () => {
                                            const finalAccent = cAccentInp.value;
                                            const finalBorder = cBorderInp.value;
                                            const finalBg = cBgInp.value;
                                            const finalRadius = radInp.value + 'px';

                                            settingsToUpdate.bgImageDataUri = dataUri;
                                            settingsToUpdate.enableGradient = false;
                                            settingsToUpdate.bgColor = finalBg;
                                            settingsToUpdate.enableEdge = true;
                                            settingsToUpdate.edgeColor = finalBorder;
                                            settingsToUpdate.enableRounding = true;
                                            settingsToUpdate.borderRadius = finalRadius;
                                            settingsToUpdate.enableScrollIndicator = true;
                                            settingsToUpdate.scrollIndicatorColor = finalAccent;
                                            settingsToUpdate.enableAvatarBorder = true;
                                            settingsToUpdate.avatarBorderColor1 = finalAccent;
                                            settingsToUpdate.avatarBorderColor2 = finalBorder;
                                            settingsToUpdate.avatarBorderColor3 = finalAccent;
                                            settingsToUpdate.enableOpHighlight = true;
                                            settingsToUpdate.opHighlightEdgeColor = finalBorder;
                                            settingsToUpdate.opHighlightBgColor = finalBg;
                                            settingsToUpdate.enableOwnMessageHighlight = true;
                                            settingsToUpdate.ownMessageHighlightEdgeColor = finalAccent;
                                            settingsToUpdate.bottomNavTheme = 'nav_theme_custom_dynamic';

                                            const existingDynStyle = document.getElementById('br-dynamic-gradient-vars');
                                            if (existingDynStyle) existingDynStyle.remove();

                                            modal.remove();
                                            errorOccurred = false;
                                            const success = await saveSettings(settingsToUpdate);
                        if (success) {
                            applyForumStyles(currentSettings);
                            updateBottomNavBarContent(currentSettings);
                            manageVisualEffects(currentSettings);
                            handleScroll();
                            const bgStatus = settingsPanel.querySelector('#bg-status');
                            if (bgStatus) bgStatus.textContent = "Фон: 🖼️ Изображение (адаптировано)";
                            if (bgFileInput) bgFileInput.value = '';

                            showToast('Настройки успешно сохранены!', 'success');
                            saveBtn.innerHTML = '<i class="fas fa-save"></i><i class="fas fa-check"></i> Сохранено!';
                            saveBtn.classList.add('br-btn-success');
                            saveBtn.style.backgroundColor = '#28a745';
                            setTimeout(() => {
                                saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                                saveBtn.classList.remove('br-btn-success');
                                saveBtn.style.backgroundColor = '';
                                saveBtn.disabled = false;
                            }, 2000);
                        } else {
                            showToast('Ошибка сохранения', 'error');
                            saveBtn.disabled = false;
                        }
                    });


                };
                reader.readAsDataURL(file);
                return;
            } catch (error) {
                showToast(`Ошибка чтения файла: ${error.message}`, 'error'); errorOccurred = true;
            }
        }
        else {
            settingsToUpdate.bgImageDataUri = currentSettings.bgImageDataUri || '';
        }

        settingsPanel.dataset.presetLoaded = 'false';
        if (!errorOccurred) {
            const success = await saveSettings(settingsToUpdate);
            if (success) {
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                        if (input.type === 'checkbox') input.checked = currentSettings[key];
                        else if (input.type === 'range') {
                            let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                        }
                        else input.value = currentSettings[key] ?? '';
                    }
                });
                 settingsPanel.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
                applyForumStyles(currentSettings);
                updateBottomNavBarContent(currentSettings);
                manageVisualEffects(currentSettings);
                handleScroll();

                 if (settingsIcon && bottomNavElement) {
                     if (currentSettings.enableBottomNav) {
                        const utilsContainer = bottomNavElement.querySelector('.br-nav-utilities');
                        if (utilsContainer) {
                            utilsContainer.prepend(settingsIcon);
                        }
                     } else {
                        if (settingsIcon.parentNode !== document.body) {
                            document.body.appendChild(settingsIcon);
                        }
                     }
                 }

                const bgStatus = settingsPanel.querySelector('#bg-status');
                if(bgStatus) {
                    if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
                }
                if (bgFileInput && bgFileInput.files.length > 0) bgFileInput.value = '';

                startLiveForumPollers();

                const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                    initializeVisibilityFunc();
                }
                const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
                if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                     initializeAnimVisibilityFunc();
                }

                                showToast('Настройки успешно сохранены!', 'success');
                saveBtn.innerHTML = '<i class="fas fa-save"></i><i class="fas fa-check"></i> Сохранено!';
                saveBtn.classList.add('br-btn-success');
                saveBtn.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                    saveBtn.classList.remove('br-btn-success');
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                }, 2000);
            } else {
                showToast('Ошибка сохранения настроек!', 'error');
                saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка!';
                saveBtn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                }, 2000);

            }
        } else {
            saveBtn.textContent = '💾 Сохранить'; saveBtn.disabled = false;
        }
    }


    async function handleClearBg() {
         if (!settingsPanel) return;
         const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
         if (bgFileInput) bgFileInput.value = '';
         const clearBgBtn = settingsPanel.querySelector('#clear-bg-btn');
         const success = await saveSettings({
             ...currentSettings,
             bgImageDataUri: ''
            });
         if (success) {
             applyForumStyles(currentSettings);
             const bgStatus = settingsPanel.querySelector('#bg-status');
             if(bgStatus) bgStatus.textContent = 'Фон не задан.';
             if (clearBgBtn) {
                clearBgBtn.textContent = '✔️';
                setTimeout(() => { clearBgBtn.textContent = '❌'; }, 1000);
             }
             showToast('Фон очищен.', 'info');
         } else {
             showToast('[BR Style] Не удалось удалить фон. Ошибка сохранения.', 'error');
         }
    }

    function handleExport() {
        try {
            const settingsToExport = { ...defaultSettings, ...currentSettings };
            if (!Array.isArray(settingsToExport.quickLinks)) {
                settingsToExport.quickLinks = defaultSettings.quickLinks;
            }
            if (typeof settingsToExport.customPresets !== 'object' || settingsToExport.customPresets === null) {
                settingsToExport.customPresets = defaultSettings.customPresets;
            }
            const settingsJson = JSON.stringify(settingsToExport, null, 2);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            downloadFile(`br-style-settings-${timestamp}.json`, settingsJson, 'application/json');
            showToast('Настройки экспортированы!', 'success');
        } catch (e) {
            console.error('[BR Style] Ошибка экспорта настроек ❌:', e);
            showToast('[BR Style] Ошибка при экспорте настроек ❌.', 'error');
        }
    }

    function handleImport(event) {
        if (!settingsPanel) return;
        const file = event.target.files[0];
        if (!file) return;
        showToast('Чтение файла...⏳', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                if (typeof importedSettings !== 'object' || importedSettings === null) throw new Error("Файл не содержит корректный JSON объект.");
                let appliedCount = 0;
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (key === 'quickLinks' || key === 'customPresets') return;
                    if (importedSettings.hasOwnProperty(key)) {
                        let validatedValue = validateSetting(key, importedSettings[key], defaultSettings[key]);
                        if (input.type === 'checkbox') {
                            input.checked = validatedValue;
                        } else if (input.type === 'range') {
                            let numericValue = (typeof validatedValue === 'string') ? parseFloat(validatedValue) : validatedValue;
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                            updateSliderValue(input);
                        } else {
                             input.value = validatedValue;
                        }
                        appliedCount++;
                    }
                });
                const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
                quickLinksContainer.innerHTML = '';
                const importedLinks = importedSettings.quickLinks;
                if (Array.isArray(importedLinks)) {
                    importedLinks.forEach(link => { if (link && typeof link.name === 'string' && typeof link.url === 'string') addQuickLinkInput(quickLinksContainer, link); });
                } else {
                    (currentSettings.quickLinks || defaultSettings.quickLinks).forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
                if (importedSettings.hasOwnProperty('customPresets') && typeof importedSettings.customPresets === 'object' && importedSettings.customPresets !== null && !Array.isArray(importedSettings.customPresets)) {
                    const saveBtn = settingsPanel.querySelector('#save-btn');
                   if (saveBtn && !saveBtn.disabled) {
                            currentSettings.customPresets = importedSettings.customPresets;
                            saveSettings({ customPresets: currentSettings.customPresets });
                            populateAllPresetLists();
                        } else {
                            setTimeout(() => {
                                currentSettings.customPresets = importedSettings.customPresets;
                                saveSettings({ customPresets: currentSettings.customPresets });
                                populateAllPresetLists();
                            }, 100);
                        }
                }
                 const bgStatus = settingsPanel.querySelector('#bg-status');
                if (bgStatus) {
                    const importedBgData = importedSettings.bgImageDataUri; const importedGradient = importedSettings.enableGradient; const importedAnimGradient = importedSettings.enableAnimatedGradient; if (importedGradient) { bgStatus.textContent = importedAnimGradient ? 'Фон: (импортирован 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (импортирован 🌈 градиент, нажмите Сохранить)'; } else { bgStatus.textContent = importedBgData ? `Фон: (импортирован 🖼️ изображение, нажмите Сохранить)` : 'Фон: (очищен импортом, нажмите Сохранить)'; }
                }
                const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                if (appliedCount > 0 || (Array.isArray(importedLinks) && importedLinks.length > 0)) {
                    showToast(`✅ Импортировано ${appliedCount} настроек + ссылки. Нажмите '💾 Сохранить'.`, 'success', 4000);
                    const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                    if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                         initializeVisibilityFunc();
                    }
                    const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
                    if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                         initializeAnimVisibilityFunc();
                    }
                } else {
                    throw new Error("В файле не найдено совместимых настроек.");
                }
            } catch (error) {
                console.error('[BR Style] Ошибка импорта настроек ❌:', error);
                showToast(`❌ Ошибка: ${error.message}`, 'error', 5000);
            } finally {
                event.target.value = null;
            }
        };
        reader.onerror = (e) => {
             console.error('[BR Style] Ошибка чтения файла для импорта:', e); showToast('❌ Ошибка чтения файла.', 'error'); event.target.value = null;
        };
        reader.readAsText(file);
    }

function openPanel() {
        if (!settingsPanel) {
             createPanelHTML();
             if (!settingsPanel) {
                 console.error("[BR Style] Не удалось создать или найти панель после попытки создания.");
                 return;
             }
         }

        const wrapper = document.getElementById('br-panel-wrapper');
        if (!wrapper) return;

        try {
            const themeSelect = settingsPanel.querySelector('#s_bottomNavTheme');
            if (themeSelect && currentSettings.bottomNavTheme === 'nav_theme_custom_dynamic') {
                 if (!themeSelect.querySelector('option[value="nav_theme_custom_dynamic"]')) {
                    const opt = document.createElement('option');
                    opt.value = 'nav_theme_custom_dynamic';
                    opt.textContent = '🎨 Адаптированный (Активен)';
                    opt.style.display = 'none';
                    themeSelect.prepend(opt);
                 }
            }

            settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                const key = input.dataset.settingKey;
                if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                    if (input.type === 'checkbox') { input.checked = currentSettings[key]; }
                    else if (input.type === 'range') {
                        let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                        if (isNaN(numericValue)) numericValue = defaultSettings[key];
                        input.value = numericValue;
                        updateSliderValue(input);
                    }
                    else { input.value = currentSettings[key] ?? ''; }
                }
            });
            const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
            if (quickLinksContainer) {
                quickLinksContainer.innerHTML = '';
               if (Array.isArray(currentSettings.quickLinks)) {
                    currentSettings.quickLinks.forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
            }
            populateAllPresetLists();
            loadUploadHistory();
            const bgStatus = settingsPanel.querySelector('#bg-status');
            if(bgStatus) {
                if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
            }
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
            const usernameStatus = settingsPanel.querySelector('#my-username-status');
            if(usernameStatus) {
                usernameStatus.textContent = myUsername ? `Ваш ник: ${myUsername}` : 'Ваш ник: (не найден)';
            }
             const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
             if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                initializeVisibilityFunc();
             }
             const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
             if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                 initializeAnimVisibilityFunc();
             }

            settingsPanel.dataset.view = 'hub';
            if (wrapper) wrapper.dataset.theme = currentSettings.panelTheme;

            const bottomNav = document.getElementById(BOTTOM_NAV_ID);
            if (bottomNav) bottomNav.classList.add('br-nav-force-hidden');

            wrapper.style.display = 'flex';
            wrapper.style.opacity = '0';
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(50px)';

            setTimeout(() => {
                wrapper.style.opacity = '1';
                settingsPanel.style.opacity = '1';
                settingsPanel.style.transform = 'translateY(0)';
            }, 10);

        } catch (e) {
            console.error('[BR Style] Ошибка при открытии или заполнении панели настроек ❌', e);
            if (wrapper) wrapper.style.display = 'none';
        }
    }
function closePanel() {
        const wrapper = document.getElementById('br-panel-wrapper');
        if (wrapper && settingsPanel) {

            const bottomNav = document.getElementById(BOTTOM_NAV_ID);
            if (bottomNav) bottomNav.classList.remove('br-nav-force-hidden');

            wrapper.style.opacity = '0';
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(50px)';

            setTimeout(() => {
                wrapper.style.display = 'none';
            }, 300);
        }
    }
    function togglePanel() {
        const wrapper = document.getElementById('br-panel-wrapper');
        if (!wrapper || wrapper.style.display === 'none') {
            openPanel();
        } else {
            closePanel();
        }
    }

function createBottomNavBarElement() {
        if (document.getElementById(BOTTOM_NAV_ID)) {
            bottomNavElement = document.getElementById(BOTTOM_NAV_ID);
            return;
        }
        try {
            bottomNavElement = document.createElement('nav');
            bottomNavElement.id = BOTTOM_NAV_ID;
            bottomNavElement.className = 'br-bottom-nav-bar';
            bottomNavElement.innerHTML = `
                <div class="br-nav-inner-mask">
                    <div class="br-nav-group br-nav-utilities">
                    </div>
                    <span id="br-style-nav-links-v110" class="br-nav-group br-nav-links"></span>
                </div>
            `;
            document.body.appendChild(bottomNavElement);
        } catch (e) {
            console.error('[BR BottomNav] Ошибка создания элемента нижней панели ❌', e);
        }
    }

function updateBottomNavBarContent(settings) {
        if (!bottomNavElement) {
            createBottomNavBarElement();
            if (!bottomNavElement) return;
        }
        try {
            const linksContainer = bottomNavElement.querySelector('#br-style-nav-links-v110');
            if (linksContainer) {
                linksContainer.innerHTML = '';
                const currentHref = window.location.href;
                if (Array.isArray(settings.quickLinks)) {
                    settings.quickLinks.forEach(link => {
                         if (link.name?.trim() && link.url?.trim()) {
                             const a = document.createElement('a');
                             a.href = link.url.trim();
                             a.target = "_self";
                             a.rel = "noopener noreferrer";
                             a.textContent = link.name.trim();
                             a.title = link.name.trim();
                             if (currentHref.startsWith(link.url.trim())) {
                                 a.classList.add('br-nav-link-active');
                             }
                             linksContainer.appendChild(a);
                         }
                    });
                }
            }
        } catch (e) {
            console.error('[BR BottomNav] Ошибка обновления содержимого нижней панели ❌', e);
        }
    }

    function createBackgroundElement() {
        if (document.getElementById(BACKGROUND_ELEMENT_ID)) { return; }
        try {
            const bgElement = document.createElement('div');
            bgElement.id = BACKGROUND_ELEMENT_ID;
            document.body.insertBefore(bgElement, document.body.firstChild);
        } catch (e) {
            console.error('[BR Style] Ошибка создания элемента фона ❌', e);
        }
    }

     function addSettingsIconHTML() {
         if (document.getElementById(STYLE_ICON_ID)) { settingsIcon = document.getElementById(STYLE_ICON_ID); }
         else if (document.body) {
             try {
                 settingsIcon = document.createElement('div'); settingsIcon.id = STYLE_ICON_ID; settingsIcon.title = 'Открыть/Закрыть настройки стиля BR Forum (🎨)'; settingsIcon.innerHTML = '<i class="fas fa-palette"></i>';
                 document.body.appendChild(settingsIcon); settingsIcon.addEventListener('click', togglePanel);
             } catch (e) { console.error('[BR Style] Ошибка добавления иконки настроек ❌', e); }
         } else { console.error('[BR Style] Тег body еще не доступен для добавления иконки ❌'); }
     }

    function createScrollIndicatorElement() {
        if (document.getElementById(SCROLL_INDICATOR_ID)) {
            scrollIndicatorElement = document.getElementById(SCROLL_INDICATOR_ID);
            return;
        }
        try {
            scrollIndicatorElement = document.createElement('div');
            scrollIndicatorElement.id = SCROLL_INDICATOR_ID;
            document.body.appendChild(scrollIndicatorElement);
        } catch (e) {
            console.error('[BR Style] Ошибка создания индикатора прокрутки v12!', e);
        }
    }

    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                performScrollLogic();
                ticking = false;
            });
            ticking = true;
        }
    }

    function performScrollLogic() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollIndicatorElement && currentSettings.enableScrollIndicator) {
            scrollIndicatorElement.style.transform = `scaleX(${scrollPercent / 100})`;
            scrollIndicatorElement.style.display = 'block';
        } else if (scrollIndicatorElement) {
            scrollIndicatorElement.style.display = 'none';
        }

       if (currentSettings.enableSmartNav) {
            const nav = document.querySelector('.p-navSticky');

            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

            if (nav && isFirefox) {
                if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
                    nav.style.transform = `translateY(-100%)`;
                } else {
                    nav.style.transform = `translateY(0)`;
                }
                nav.style.transition = 'transform 0.3s ease-out';
            }
        }

        if (bottomNavElement && currentSettings.enableBottomNav) {
            if (scrollTop > lastScrollTop && scrollTop > bottomNavElement.offsetHeight + 100) {
                bottomNavElement.classList.add('br-bottom-nav-hidden');
            } else {
                bottomNavElement.classList.remove('br-bottom-nav-hidden');
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

function setupScrollObserver(settings) {
        if (scrollObserver) {
            scrollObserver.disconnect();
            scrollObserver = null;
        }

        const allAnimClasses = ['br-anim-scroll', 'br-anim-fade-in', 'br-anim-fade-in-up', 'br-anim-slide-in-left', 'br-is-visible'];
        document.querySelectorAll('.structItem, .message, .br-anim-scroll').forEach(el => {
            el.classList.remove(...allAnimClasses);
            el.style.opacity = '';
            el.style.animation = '';
        });

        if (!settings.enableScrollFadeIn) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('br-is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        document.querySelectorAll('.structItem, .message').forEach(el => {
            el.classList.add('br-anim-scroll', `br-anim-${settings.scrollFadeInType}`);
            scrollObserver.observe(el);
        });
    }

    const debouncedRunComplaintTracker = debounce(runComplaintTracker, 300);
    const debouncedFindAndAttachUploader = debounce(findAndAttachUploader, 300);
    const debouncedRunStatsAndPreview = debounce(runStatsAndPreview, 300);

    function observeNewNodes(mutationsList) {
        if (document.getElementById('br-skeleton-layer') && !document.getElementById('br-skeleton-layer').classList.contains('br-skeleton-fade-out')) {
            return;
        }

        let addedNodes = false;
        let relevantUploaderNode = false;

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.classList.contains('br-stats-dashboard') || node.id === 'br-capsule-container')) {
                        continue;
                    }
                    addedNodes = true;
                }

                if (scrollObserver && currentSettings.enableScrollFadeIn) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            let elementsToObserve = [];
                            if (node.matches('.structItem, .message')) {
                                elementsToObserve.push(node);
                            }
                            elementsToObserve = [
                                ...elementsToObserve,
                                ...node.querySelectorAll('.structItem, .message')
                            ];
                            elementsToObserve.forEach(el => {
                                if (!el.classList.contains('br-is-visible')) {
                                    el.classList.add('br-anim-scroll', `br-anim-${currentSettings.scrollFadeInType}`);
                                    scrollObserver.observe(el);
                                }
                            });
                        }
                    });
                }

                if (!relevantUploaderNode) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches('.js-quickReply') || node.querySelector('.js-quickReply') || node.matches('textarea[name="message"]')) {
                                relevantUploaderNode = true;
                            }
                        }
                    });
                }
            }
        }

        if (addedNodes) {
            debouncedRunComplaintTracker();
            debouncedRunStatsAndPreview();
        }

        if (relevantUploaderNode) {
            debouncedFindAndAttachUploader();
        }
    }

    function showWelcomeScreen() {
        if (document.getElementById(WELCOME_SCREEN_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = WELCOME_SCREEN_ID;

        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap');

            #${WELCOME_SCREEN_ID} {
                position: fixed; inset: 0; z-index: 99999;
                background: #000;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.5s ease;
                font-family: 'Manrope', sans-serif;
                padding: 10px;
            }
            .br-welcome-visible #${WELCOME_SCREEN_ID} { opacity: 1; }

            .br-card-premium {
                width: 100%; max-width: 850px; height: 85vh; max-height: 800px;
                background: #09090b;
                border: 1px solid #222;
                border-radius: 24px;
                box-shadow: 0 0 100px rgba(0, 240, 255, 0.05);
                display: flex; flex-direction: column; overflow: hidden;
                transform: scale(0.95); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
            }
            .br-welcome-visible .br-card-premium { transform: scale(1); }

            .br-step { display: none; height: 100%; flex-direction: column; }
            .br-step.active { display: flex; animation: br-fade-in-panel 0.5s ease forwards; }
            @keyframes br-fade-in-panel { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

            .br-content-scroll {
                overflow-y: auto;
                flex-grow: 1;
                padding: 0;
                scrollbar-width: thin;
                scrollbar-color: #333 #09090b;
            }
            .br-content-scroll::-webkit-scrollbar { width: 6px; }
            .br-content-scroll::-webkit-scrollbar-track { background: #09090b; }
            .br-content-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

            .br-hero {
                padding: 50px 30px;
                text-align: center;
                background: linear-gradient(135deg, #0f172a, #000);
                position: relative;
                overflow: hidden;
                border-bottom: 1px solid #222;
            }
            .br-hero::before {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15), transparent 70%);
                animation: br-pulse-hero 4s ease-in-out infinite;
            }
            @keyframes br-pulse-hero { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }

            .br-logo-large {
                width: 80px; height: 80px; margin: 0 auto 20px;
                background: linear-gradient(45deg, #fff, #999);
                border-radius: 24px; display: flex; align-items: center; justify-content: center;
                font-size: 36px; color: #000; position: relative; z-index: 2;
                box-shadow: 0 10px 30px rgba(255,255,255,0.2);
            }
            .br-title { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 10px; position: relative; z-index: 2; letter-spacing: -1px; }
            .br-desc { font-size: 16px; color: #94a3b8; max-width: 600px; margin: 0 auto; position: relative; z-index: 2; line-height: 1.6; }

            .br-features { padding: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            @media (max-width: 650px) { .br-features { grid-template-columns: 1fr; } }

            .br-feat-card {
                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
                border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 15px;
                transition: 0.3s; opacity: 0; animation: br-slide-up 0.5s ease forwards;
            }
            .br-feat-card:nth-child(1) { animation-delay: 0.1s; }
            .br-feat-card:nth-child(2) { animation-delay: 0.2s; }
            .br-feat-card:nth-child(3) { animation-delay: 0.3s; }
            .br-feat-card:nth-child(4) { animation-delay: 0.4s; }

            @keyframes br-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

            .br-feat-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }
            .br-feat-icon {
                width: 44px; height: 44px; background: #1e1e24; border-radius: 12px;
                display: flex; align-items: center; justify-content: center; font-size: 20px;
                flex-shrink: 0; border: 1px solid #333;
            }
            .br-feat-info h4 { color: #fff; margin: 0 0 3px 0; font-size: 15px; }
            .br-feat-info p { color: #888; margin: 0; font-size: 12px; }

            .br-bottom-bar {
                padding: 20px 30px; border-top: 1px solid #222; background: #09090b;
                display: flex; justify-content: space-between; align-items: center;
            }

            .br-btn-primary {
                background: #fff; color: #000; font-weight: 800; padding: 14px 28px;
                border-radius: 12px; border: none; cursor: pointer; font-size: 14px;
                text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;
                box-shadow: 0 5px 20px rgba(255,255,255,0.1); width: 100%;
            }
            .br-btn-primary:hover { background: #e2e2e2; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,255,255,0.2); }

            .br-wall-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px; padding: 30px;
            }
            .br-wall-item {
                aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; position: relative;
                cursor: pointer; border: 2px solid transparent; transition: 0.3s; background: #000;
            }
            .br-wall-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: 0.5s; }
            .br-wall-item:hover { border-color: #fff; transform: scale(1.05); z-index: 2; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
            .br-wall-item:hover img { opacity: 1; transform: scale(1.1); }

            .br-loading {
                position: absolute; inset: 0; background: rgba(0,0,0,0.8);
                display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px;
                color: #fff; font-weight: bold; opacity: 0; pointer-events: none; transition: 0.3s;
                backdrop-filter: blur(5px);
            }
            .br-wall-item.processing .br-loading { opacity: 1; }

            .br-btn-ghost {
                background: transparent; border: 1px solid #333; color: #666;
                padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 12px;
            }
            .br-btn-ghost:hover { color: #fff; border-color: #fff; }
        `;
        overlay.appendChild(style);

        const wallpapers = [
            "https://i.postimg.cc/v8Wh541G/81864c6e79ccb4ce4a61616c32bc9b9b.jpg",
            "https://i.postimg.cc/q7xB8XTr/2c551281768273ba1943ddb478cc21f5.jpg",
            "https://i.postimg.cc/263pV4jh/ed7156aa98be62e2053617ead1f5ff01.jpg",
            "https://i.postimg.cc/vHysvx3j/6e9abc17f5a16771b6e2fd5e71e0bd53.jpg",
            "https://i.postimg.cc/Pqp9HdS0/3407a720ee8913a6c437fd01e72705a2.jpg",
            "https://i.postimg.cc/L8qNYNjK/7305daf23ec1133d168742fcc7158254.jpg",
            "https://i.postimg.cc/kgxRpSmQ/fc76767ee48cc857170c4d8f3466bbb5.jpg",
            "https://i.postimg.cc/KYh7MCcV/74137379fd5a0682d5eb83ad21cbfe69.jpg"
        ];

        let wallHtml = '';
        wallpapers.forEach(url => {
            wallHtml += `<div class="br-wall-item" data-url="${url}"><img src="${url}"><div class="br-loading"><i class="fas fa-magic fa-spin"></i><span>Настройка...</span></div></div>`;
        });

        overlay.innerHTML += `
            <div class="br-card-premium">

                <div class="br-step active" id="br-step-welcome">
                    <div class="br-content-scroll">
                        <div class="br-hero">
                            <div class="br-logo-large"><i class="fas fa-cube"></i></div>
                            <div class="br-title">Black Russia Style</div>
                            <div class="br-desc">
                                Добро пожаловать в новую эру дизайна. Умная адаптация, живые эффекты и инструменты для комфортной игры.
                            </div>
                        </div>
                        <div class="br-features">
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#00F0FF"><i class="fas fa-palette"></i></div>
                                <div class="br-feat-info"><h4>Умный Цвет</h4><p>Скрипт сам подберет цвета под ваши обои.</p></div>
                            </div>
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#FF00DE"><i class="fas fa-photo-video"></i></div>
                                <div class="br-feat-info"><h4>Живые Обои</h4><p>Снег, дождь, сакура и неоновые эффекты.</p></div>
                            </div>
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#FFD700"><i class="fas fa-user-shield"></i></div>
                                <div class="br-feat-info"><h4>Для Лидеров</h4><p>Биндер, статистика и контроль жалоб.</p></div>
                            </div>
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#00C853"><i class="fas fa-mobile-alt"></i></div>
                                <div class="br-feat-info"><h4>Оптимизация</h4><p>Идеальная работа на телефоне и ПК.</p></div>
                            </div>
                        </div>
                    </div>
                    <div class="br-bottom-bar">
                        <button class="br-btn-primary" id="br-go-next">Выбрать оформление</button>
                    </div>
                </div>

                <div class="br-step" id="br-step-wallpapers">
                    <div class="br-hero" style="padding: 30px 20px;">
                        <div class="br-title" style="font-size: 24px;">Выберите стиль</div>
                        <div class="br-desc" style="font-size: 14px;">Нажмите на любую картинку. Скрипт скачает её и покрасит форум в подходящие цвета.</div>
                    </div>
                    <div class="br-content-scroll">
                        <div class="br-wall-grid">${wallHtml}</div>
                    </div>
                    <div class="br-bottom-bar" style="justify-content: center;">
                        <button class="br-btn-ghost" id="br-skip-all">Пропустить (Оставить как есть)</button>
                    </div>
                </div>

            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => document.body.classList.add('br-welcome-visible'));

        overlay.querySelector('#br-go-next').onclick = () => {
            overlay.querySelector('#br-step-welcome').classList.remove('active');
            overlay.querySelector('#br-step-wallpapers').classList.add('active');
        };

        const close = () => {
            document.body.classList.remove('br-welcome-visible');
            setTimeout(() => overlay.remove(), 500);
        };
        overlay.querySelector('#br-skip-all').onclick = close;

        overlay.querySelectorAll('.br-wall-item').forEach(item => {
            item.onclick = () => {
                const url = item.dataset.url;
                item.classList.add('processing');

                GM_xmlhttpRequest({
                    method: "GET", url: url, responseType: "blob",
                    onload: function(response) {
                        const blob = response.response;
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            const dataUri = reader.result;
                            const imgObj = new Image();
                            imgObj.src = dataUri;
                            imgObj.onload = async function() {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = 50; canvas.height = 50;
                                ctx.drawImage(imgObj, 0, 0, 50, 50);
                                const data = ctx.getImageData(0, 0, 50, 50).data;

                                let r=0,g=0,b=0,count=0;
                                for(let i=0; i<data.length; i+=4) {
                                    r += data[i]; g += data[i+1]; b += data[i+2]; count++;
                                }
                                r = Math.floor(r/count); g = Math.floor(g/count); b = Math.floor(b/count);

                                const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
                                    const hex = x.toString(16);
                                    return hex.length === 1 ? '0' + hex : hex;
                                }).join('');

                                const brightColor = r > g && r > b ? '#ff6b6b' : (g > r && g > b ? '#51cf66' : '#339af0');


                                const darkR = Math.max(0, r-50);
                                const darkG = Math.max(0, g-50);
                                const darkB = Math.max(0, b-50);
                                const finalBgHex = rgbToHex(darkR, darkG, darkB);

                                const newSettings = {
                                    ...currentSettings,
                                    bgImageDataUri: dataUri,
                                    enableGradient: false,
                                    bgColor: finalBgHex,
                                    enableEdge: true,
                                    edgeColor: brightColor,
                                    enableRounding: true,
                                    borderRadius: '12px',
                                    bottomNavTheme: 'nav_theme_custom_dynamic',
                                    opacityValue: 0.3, // Устанавливаем прозрачность 0.3
                                    enableScrollIndicator: true,
                                    scrollIndicatorColor: brightColor
                                };

                                const st = document.getElementById('br-dynamic-gradient-vars') || document.createElement('style');
                                st.id='br-dynamic-gradient-vars';
                                if(!st.parentNode) document.head.appendChild(st);
                                st.textContent = `:root{ --br-edge-color: ${brightColor}; --br-bg-color: ${finalBgHex}; }`;

                                await saveSettings(newSettings);
                                applyForumStyles(newSettings);
                                updateBottomNavBarContent(newSettings);
                                showToast('✅ Успешно! Стиль адаптирован.', 'success');
                                close();
                            };
                        };
                        reader.readAsDataURL(blob);
                    }
                });
            };
        });
    }

    let particleMouseMoveHandler = null;
    function manageVisualEffects(settings) {
        if (particleMouseMoveHandler) {
            document.removeEventListener('mousemove', particleMouseMoveHandler);
            particleMouseMoveHandler = null;
        }

        if (!document.getElementById('br-effects-css-fixed')) {
            const css = document.createElement('style');
            css.id = 'br-effects-css-fixed';
            css.textContent = `
                .br-particle {
                    position: fixed; top: -10vh; z-index: 99999; pointer-events: none;
                    will-change: transform, opacity;
                    animation-iteration-count: infinite !important;
                    animation-timing-function: linear !important;
                }
                @keyframes fall-straight { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(120vh); opacity: 0; } }
                @keyframes fall-sway {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; transform: translate(20px, 20vh) rotate(45deg); }
                    40% { transform: translate(-20px, 40vh) rotate(90deg); }
                    60% { transform: translate(20px, 60vh) rotate(135deg); }
                    80% { opacity: 1; }
                    100% { transform: translate(0, 120vh) rotate(180deg); opacity: 0; }
                }
                @keyframes fall-leaf { 0% { transform: translate(0, 0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 100% { transform: translate(calc(100px * var(--sway-dir)), 120vh) rotate(720deg); opacity: 0; } }
                @keyframes wandering-firefly { 0% { transform: translate(0, 0) scale(1); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(calc(50px * var(--sway-dir)), -50px) scale(1.2); } 80% { opacity: 0.8; } 100% { transform: translate(calc(-50px * var(--sway-dir)), 50px) scale(1); opacity: 0; } }
                @keyframes rise-bubble { 0% { transform: translateY(110vh) scale(0.5); opacity: 0; } 20% { opacity: 0.8; } 100% { transform: translateY(-10vh) scale(1.5); opacity: 0; } }
            `;
            document.head.appendChild(css);
        }

        if (!effectsContainer) {
            effectsContainer = document.getElementById(EFFECTS_CONTAINER_ID);
            if (!effectsContainer) {
                if (!document.body) return;
                effectsContainer = document.createElement('div');
                effectsContainer.id = EFFECTS_CONTAINER_ID;
                document.body.appendChild(effectsContainer);
            }
        }

        effectsContainer.innerHTML = '';
        effectsContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: hidden; display: block;';
        if (!isValidEffectType(settings.effectType) || settings.effectType === 'none') {
            effectsContainer.style.display = 'none';
            return;
        }

        const intensity = Math.max(10, Math.min(300, settings.effectIntensity || 50));
        const speedMultiplier = Math.max(0.1, Math.min(5, settings.effectSpeed || 1));
        const rainLength = Math.max(5, Math.min(50, settings.effectRainLength || 20));
        const baseDuration = 15;

        for (let i = 0; i < intensity; i++) {
            const particle = document.createElement('div');
            particle.className = 'br-particle';
            let animDuration = (getRandomInRange(baseDuration - 5, baseDuration + 5)) / speedMultiplier;
            const animDelay = getRandomInRange(-20, 20);
            const initialLeft = getRandomInRange(0, 100);
            const initialOpacity = getRandomInRange(0.4, 0.9);
            const swayDirection = Math.random() < 0.5 ? -1 : 1;

            particle.style.left = `${initialLeft}%`;
            particle.style.opacity = initialOpacity;
            particle.style.setProperty('--sway-dir', swayDirection);
            particle.style.animationDelay = `${animDelay}s`;
            particle.style.animationDuration = `${animDuration}s`;

            let particleType = settings.effectType;
            let particleClass = particleType.split('-')[0];
            particle.classList.add(particleClass);

            switch (particleType) {
                case 'rain':
                    particle.style.width = `${getRandomInRange(1, 2)}px`;
                    particle.style.height = `${rainLength}px`;
                    particle.style.background = `linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.8))`;
                    particle.style.animationName = 'fall-straight';
                    particle.style.animationDuration = `${animDuration * 0.15}s`;
                    break;
                case 'snow':
                    const snowSize = getRandomInRange(3, 6);
                    particle.style.width = `${snowSize}px`;
                    particle.style.height = `${snowSize}px`;
                    particle.style.background = `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)`;
                    particle.style.borderRadius = '50%';
                    particle.style.animationName = 'fall-sway';
                    break;
                case 'petals-sakura': case 'petals-red_rose': case 'leaves-autumn_maple':
                    const imgKey = particleType.split('-')[1];
                    const imgUri = PETAL_IMAGES[imgKey];
                    if (!imgUri) continue;
                    const size = getRandomInRange(12, 20);
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.backgroundImage = `url('${imgUri}')`;
                    particle.style.backgroundSize = 'contain';
                    particle.style.backgroundRepeat = 'no-repeat';
                    particle.style.animationName = (particleClass === 'leaves') ? 'fall-leaf' : 'fall-sway';
                    if(particleClass === 'leaves') animDuration *= 0.8;
                    break;
                case 'fireflies':
                    const ffSize = getRandomInRange(2, 4);
                    particle.style.width = `${ffSize}px`;
                    particle.style.height = `${ffSize}px`;
                    particle.style.background = '#fff700';
                    particle.style.borderRadius = '50%';
                    particle.style.boxShadow = `0 0 10px #fff700, 0 0 20px #ff9900`;
                    particle.style.top = `${getRandomInRange(10, 90)}vh`;
                    particle.style.animationName = 'wandering-firefly';
                    particle.style.animationDuration = `${getRandomInRange(5, 10)}s`;
                    break;
                case 'matrix':
                    particle.textContent = MATRIX_CHARS.charAt(getRandomIntInRange(0, MATRIX_CHARS.length - 1));
                    particle.style.fontFamily = "monospace";
                    particle.style.color = '#0F0';
                    particle.style.textShadow = '0 0 5px #0F0';
                    particle.style.fontSize = `${getRandomInRange(12, 20)}px`;
                    particle.style.animationName = 'fall-straight';
                    particle.style.animationDuration = `${animDuration * 0.5}s`;
                    break;
                case 'bubbles':
                    const bubSize = getRandomInRange(5, 15);
                    particle.style.width = `${bubSize}px`;
                    particle.style.height = `${bubSize}px`;
                    particle.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.2) 100%)`;
                    particle.style.border = `1px solid rgba(255, 255, 255, 0.3)`;
                    particle.style.borderRadius = '50%';
                    particle.style.boxShadow = `inset 0 0 5px rgba(255,255,255,0.1)`;
                    particle.style.top = 'auto';
                    particle.style.bottom = '-20px';
                    particle.style.animationName = 'rise-bubble';
                    break;
            }
            effectsContainer.appendChild(particle);
        }

        if (settings.enableInteractiveParticles) {
            particleMouseMoveHandler = throttle((e) => {
                const x = e.clientX;
                const y = e.clientY;
                const particles = effectsContainer.querySelectorAll('.br-particle');
                particles.forEach(p => {
                    const rect = p.getBoundingClientRect();
                    const dx = rect.left - x;
                    const dy = rect.top - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const angle = Math.atan2(dy, dx);
                        const force = (150 - dist) / 150;
                        const moveX = Math.cos(angle) * force * 50;
                        const moveY = Math.sin(angle) * force * 50;
                        p.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    }
                });
            }, 50);
            document.addEventListener('mousemove', particleMouseMoveHandler, { passive: true });
        }
    }

    function injectStaticStyles() {
        const staticStyleId = STYLE_ID + '-static';
        if (document.getElementById(staticStyleId)) { return; }
        try {
            const staticCss = `
.p-breadcrumbs {
    background-color: rgba(7, 2, 51, 0) !important;
    backdrop-filter: blur(6px) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.block-header {
    background-color: rgba(7, 2, 51, 0) !important;
    backdrop-filter: blur(6px) !important;
    -webkit-backdrop-filter: blur(6px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
}
.bbCodeBlock {
    background-color: rgba(7, 2, 51, 0) !important;
    backdrop-filter: blur(6px) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-left: 3px solid #00F0FF !important;
}
.bbCodeBlock-title {
    background-color: rgba(7, 2, 51, 0.1) !important;
}
.p-navSticky, .p-nav {
    background-color: rgba(7, 2, 51, 0) !important;
    backdrop-filter: blur(6px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
}
.br-gallery-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 20px;
}
.br-gallery-category-title {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 5px;
}
.br-gallery-category-title::before {
    content: ' ';
    display: block;
    width: 3px;
    height: 12px;
    background: var(--br-primary, #D59D80);
    margin-right: 8px;
    border-radius: 2px;
}
.br-gallery-row {
    overflow: hidden;
    padding: 5px 0 15px 0;
    position: relative;
    mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%);
}
.br-gallery-track {
    display: flex;
    gap: 15px;
    width: max-content;
    animation: br-gallery-scroll linear infinite;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}
.br-gallery-row:hover .br-gallery-track {
    animation-play-state: paused;
}
@keyframes br-gallery-scroll {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
}
.br-gallery-item {
    flex: 0 0 120px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background: #000;
    flex-shrink: 0;
}
.br-gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
    transition: opacity 0.3s, transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    pointer-events: none;
}
.br-gallery-item:hover {
    transform: scale(1.05);
    border-color: var(--br-primary, #D59D80);
    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
    z-index: 2;
}
.br-gallery-item:hover img {
    opacity: 1;
    transform: scale(1.03);
}
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

            :root {
                --br-primary: #00F0FF;
                --br-secondary: #FF00DE;
                --br-bg-dark: #09090b;
                --br-bg-panel: rgba(20, 20, 25, 0.6);
                --br-text-main: #ffffff;
                --br-text-muted: #a0a0a0;
                --br-border: rgba(255, 255, 255, 0.08);
                --br-radius: 12px;
            }

            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
            ::-webkit-scrollbar-thumb { background: var(--br-primary); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--br-secondary); box-shadow: 0 0 10px var(--br-secondary); }

            .br-noise-bg { position: relative; overflow: hidden; }
            .br-noise-bg::before {
                content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                opacity: 0.04; pointer-events: none; z-index: 0;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }

            .br-spotlight { position: relative; overflow: hidden; background: var(--br-bg-panel); }
            .br-spotlight::after {
                content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.08), transparent 40%);
                z-index: 1; pointer-events: none; opacity: 0; transition: opacity 0.5s;
            }
            .br-spotlight:hover::after { opacity: 1; }

            #blackrussia-settings-panel-v111, .br-modal-window, .br-toast, .br-bottom-nav-bar { font-family: 'Manrope', sans-serif !important; letter-spacing: 0.02em; }

            @keyframes br-morph {
                0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
                50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
                100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
            }

            .br-hub-card-icon {
                width: 50px;
                height: 50px;
                margin: 0 auto 12px auto;
                position: relative;
                z-index: 2;
                animation: br-icon-pulse 3s ease-in-out infinite, br-morph 8s ease-in-out infinite alternate;
            }

            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
            ::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: #888; }

@keyframes br-nav-real-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

@keyframes br-morph {
            0% { border-radius: 20px 70px 30px 60px / 60px 40px 50px 70px; }
            50% { border-radius: 60px 30px 70px 40px / 50px 60px 30px 60px; }
            100% { border-radius: 20px 70px 30px 60px / 60px 40px 50px 70px; }
        }
        @keyframes br-glow-spin { 0% { background-position: 0 0; } 100% { background-position: 400% 0; } }
        .br-bottom-nav-hidden {
            transform: translateX(-50%) translateY(100px) !important;
            opacity: 0 !important;
            transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        }
          #${WELCOME_SCREEN_ID} {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.85);
                z-index: 10010;
                display: flex; align-items: center; justify-content: center;
                padding: 10px; box-sizing: border-box;
                opacity: 0; animation: br-fade-in 0.4s forwards;
                backdrop-filter: blur(8px);
            }

            @keyframes br-fade-in { to { opacity: 1; } }

            .br-quantum-modal {
                position: relative;
                width: 96%;
                max-width: 750px;
                background: #000;
                border-radius: 24px;
                padding: 2px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
                animation: br-quantum-entry 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            @keyframes br-quantum-entry {
                0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }

            .br-quantum-inner {
                background: #09090b;
                border-radius: 22px;
                padding: 30px;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .br-quantum-glow-border {
                position: absolute;
                top: -50%; left: -50%; width: 200%; height: 200%;
                background: conic-gradient(from 0deg, transparent 0deg, #00ffaa 90deg, transparent 180deg, #00aaff 270deg, transparent 360deg);
                animation: br-spin-glow 10s linear infinite;
                opacity: 0.3;
                z-index: 0;
                pointer-events: none;
            }

            @keyframes br-spin-glow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            .br-quantum-inner::before {
                content: ''; position: absolute; top: 1px; left: 1px; right: 1px; bottom: 1px;
                background: #0e0e12;
                border-radius: 22px;
                z-index: 1;
            }

            .br-quantum-content {
                position: relative;
                z-index: 2;
                width: 100%;
                color: #e0e0e0;
                text-align: center;
            }

            .br-quantum-modal h2 {
                font-size: 26px;
                color: #fff;
                margin: 0 0 5px 0;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
                background: linear-gradient(90deg, #fff, #00ffaa);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .br-quantum-subtitle {
                color: #888;
                font-size: 14px;
                margin-bottom: 15px;
                font-weight: 500;
            }

            .br-quantum-version {
                display: inline-block;
                background: rgba(255, 255, 255, 0.1);
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 11px;
                color: #aaa;
                margin-bottom: 20px;
                font-family: monospace;
            }

            .br-quantum-changelog {
                text-align: left;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
                width: 100%;
                box-sizing: border-box;
            }

            .br-quantum-changelog h4 {
                color: #00ffaa;
                font-size: 15px;
                margin: 0 0 12px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 8px;
            }

            .br-quantum-changelog ul {
                list-style: none; padding: 0; margin: 0;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .br-quantum-changelog li {
                font-size: 13px;
                color: #ccc;
                line-height: 1.4;
                position: relative;
                padding-left: 15px;
            }

            .br-quantum-changelog li::before {
                content: '•';
                color: #00ffaa;
                position: absolute;
                left: 0;
                top: 0;
            }

            .br-quantum-changelog li b {
                color: #fff;
                font-weight: 600;
            }

            .br-quantum-tip {
                color: #777;
                font-size: 12px;
                margin-bottom: 20px;
            }

            #br-quantum-close-btn {
                background: #00ffaa;
                color: #000;
                border: none;
                padding: 14px 0;
                width: 100%;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.2s;
                box-shadow: 0 4px 15px rgba(0, 255, 170, 0.2);
            }

            #br-quantum-close-btn:hover {
                background: #00e699;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 255, 170, 0.4);
            }

            #br-quantum-close-btn:active {
                transform: translateY(0);
            }

            @media (max-width: 600px) {
                .br-quantum-modal { width: 95%; margin: 0; }
                .br-quantum-inner { padding: 20px 15px; }
                .br-quantum-changelog ul { grid-template-columns: 1fr; }
                .br-quantum-modal h2 { font-size: 22px; }
                .br-quantum-changelog li { font-size: 12px; }
            }



        #br-capsule-container {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10005;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            width: auto;
        }

        #br-capsule {
            background: rgba(15, 15, 15, 0.98);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 15px 50px rgba(0,0,0,0.7);
            border-radius: 60px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            width: 0;
            height: 0;
            opacity: 0;
            padding: 0;
            transition: width 0.5s cubic-bezier(0.19, 1, 0.22, 1),
                        height 0.5s cubic-bezier(0.19, 1, 0.22, 1),
                        opacity 0.3s ease,
                        padding 0.4s ease;
        }

        #br-capsule.br-active {
            opacity: 1;
            padding: 0 30px;
            pointer-events: auto;
        }

        .br-capsule-content {
            display: flex;
            align-items: center;
            gap: 15px;
            white-space: nowrap;
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.4s ease;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        #br-capsule.br-active .br-capsule-content {
            opacity: 1;
            transform: scale(1);
            transition-delay: 0.15s;
        }

        .br-capsule-icon {
            display: flex;
            align-items: center;
        }

        .c-success { color: #00e676; filter: drop-shadow(0 0 5px rgba(0,230,118,0.4)); }
        .c-error { color: #ff1744; filter: drop-shadow(0 0 5px rgba(255,23,68,0.4)); }
        .c-info { color: #00b0ff; filter: drop-shadow(0 0 5px rgba(0,176,255,0.4)); }
        .c-load { color: #ffea00; }

        @media (min-width: 769px) {
            #br-capsule-container {
                bottom: 40px;
                top: auto;
            }
            #br-capsule.br-active {
                height: 56px;
                min-width: 250px;
            }
            .br-capsule-content {
                font-size: 16px;
            }
            .br-capsule-icon {
                font-size: 22px;
            }
        }

        @media (max-width: 768px) {
            #br-capsule-container {
                top: 15px;
                bottom: auto;
                width: 100%;
            }
            #br-capsule.br-active {
                height: 52px;
                width: 90% !important;
                max-width: 90%;
                border-radius: 20px;
            }
            .br-capsule-content {
                font-size: 15px;
                width: 100%;
                justify-content: center;
            }
            .br-capsule-icon {
                font-size: 20px;
            }
        }

            #${STYLE_ICON_ID} {
                font-size: 20px;
                line-height: 1;
            }
            #${STYLE_ICON_ID} .fas {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            #${STYLE_ICON_ID}:hover .fas {
                transform: rotate(20deg);
            }


                .br-live-feed-item-title {
                    color: #fff;
                    font-weight: bold;
                }
                .br-live-feed-item-user {
                    color: #999;
                }
                @keyframes br-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }

            .panel-btn {
                position: relative;
            }
            .br-ripple-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: inherit;
                z-index: 1;
            }
            .br-ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: br-ripple-anim 0.6s linear;
                pointer-events: none;
            }
            @keyframes br-ripple-anim {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .br-toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 26px;
                vertical-align: middle;
            }
            .br-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .br-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #555;
                transition: .3s;
                border-radius: 34px;
            }
            .br-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s cubic-bezier(0.2, 0.8, 0.2, 1);
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .br-toggle-switch input:checked + .br-toggle-slider {
                background-color: #28a745;
            }
            .br-toggle-switch input:checked + .br-toggle-slider:before {
                transform: translateX(18px);
            }
            #${PANEL_ID} label.inline-label {
                user-select: none;
                cursor: pointer;
            }

            input[type="range"].br-styled-slider {
                -webkit-appearance: none;
                width: 100%;
                background: transparent;
                margin: 6px 0;
            }
            input[type="range"].br-styled-slider:focus {
                outline: none;
            }

            input[type="range"].br-styled-slider {
                -webkit-appearance: none;
                width: 100%;
                background: transparent;
                margin: 6px 0;
            }
            input[type="range"].br-styled-slider::-webkit-slider-runnable-track {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                border: 1px solid rgba(255,255,255,0.1);
                background: transparent;
                cursor: pointer;
            }
            input[type="range"].br-styled-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #f1f1f1;
                border: 2px solid #ccc;
                cursor: pointer;
                margin-top: -6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s;
            }
            input[type="range"].br-styled-slider:active::-webkit-slider-thumb {
                transform: scale(1.2);
                background: #fff;
            }

            input[type="range"].br-styled-slider::-moz-range-track {
                width: 100%;
                height: 8px;
                cursor: pointer;
                background: #555;
                border-radius: 50px;
            }
            input[type="range"].br-styled-slider::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #f1f1f1;
                border: 2px solid #ccc;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }


            @keyframes br-critical-pulse {
                0%   { opacity: 1; box-shadow: 0 0 8px rgba(235, 51, 73, 0.3); }
                50%  { opacity: 0.7; box-shadow: 0 0 15px rgba(235, 51, 73, 0.8); }
                100% { opacity: 1; box-shadow: 0 0 8px rgba(235, 51, 73, 0.3); }
            }
            .br-flow-crit {
                animation: brGradientFlow 2s ease infinite,
                           br-critical-pulse 1.8s ease-in-out infinite;
            }

            .br-panel-body::-webkit-scrollbar {
                width: 14px;
            }
            .br-panel-body::-webkit-scrollbar-track {
                background: transparent;
            }
            .br-panel-body::-webkit-scrollbar-thumb {
                background-color: #555;
                border-radius: 10px;
                border: 4px solid transparent;
                background-clip: content-box;
            }
            .br-panel-body::-webkit-scrollbar-thumb:hover {
                background-color: #777;
            }

            .br-input-group {
                position: relative;
                margin-top: 15px;
            }
            .br-input-group input[type="text"] {
                padding-top: 12px;
            }
            .br-input-group label {
                position: absolute;
                top: 10px;
                left: 12px;
                font-size: 13px;
                color: #aaa;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .br-input-group input[type="text"]:focus + label,
            .br-input-group input[type="text"]:not(:placeholder-shown) + label {
                top: 4px;
                font-size: 10px;
                color: #D59D80;
            }
            #${PANEL_ID} .br-input-group label {
                margin-bottom: 0;
            }

            @keyframes br-counter-pop {
                0%   { transform: scale(1); }
                30%  { transform: scale(1.4); background-color: #e74c3c; color: white; }
                100% { transform: scale(1); }
            }
            .br-counter-pop {
                animation: br-counter-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }



            .panel-btn .fas {
                position: relative;
                z-index: 2;
            }
            .panel-btn span, .panel-btn i {
                vertical-align: middle;
            }
            .br-panel-btn-save i {
                transition: opacity 0.3s, transform 0.3s;
            }
            .br-panel-btn-save .fa-check {
                position: absolute;
                opacity: 0;
                transform: scale(0.5);
                transition: opacity 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
            }
            .br-panel-btn-save.br-btn-success .fa-save {
                opacity: 0;
                transform: scale(0.5);
            }
            .br-panel-btn-save.br-btn-success .fa-check {
                opacity: 1;
                transform: scale(1);
            }

            .br-panel-btn-reset .fa-undo-alt {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .br-panel-btn-reset:active .fa-undo-alt {
                transform: rotate(-180deg);
            }

            .br-skeleton-loader {
                display: block;
                background: linear-gradient(
                    90deg,
                    rgba(198, 198, 208, 0.1) 25%,
                    rgba(198, 198, 208, 0.2) 50%,
                    rgba(198, 198, 208, 0.1) 75%
                );
                background-size: 200% 100%;
                animation: br-skeleton-shine 1.8s linear infinite;
                border-radius: 6px;
            }
            @keyframes br-skeleton-shine {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            #br-upload-history-container .br-skeleton-loader {
                height: 30px;
                margin-bottom: 8px;
            }
            #br-upload-history-container .br-skeleton-loader:last-child {
                margin-bottom: 0;
            }


.br-neon-badge {
                    float: right;
                    display: inline-flex;
                    align-items: center;
                    padding: 3px 12px;
                    border-radius: 20px;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 700;
                    font-size: 11px;
                    color: #fff;
                    margin-left: 10px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    white-space: nowrap;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    background-size: 200% 200%;
                    animation: brGradientFlow 4s ease infinite;
                    will-change: background-position;
                    user-select: none;
                }
                .br-neon-badge:active {
                    transform: scale(0.95);
                }
                .br-copy-tooltip {
                    position: fixed;
                    bottom: 20px; left: 50%; transform: translateX(-50%);
                    background: #333; color: #fff; padding: 8px 16px;
                    border-radius: 20px; font-size: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    z-index: 9999;
                    animation: br-fade-up 0.3s ease-out;
                }
                @keyframes brGradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes br-fade-up {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .br-flow-fresh { background-image: linear-gradient(45deg, #0ba360, #3cba92, #0ba360); }
                .br-flow-warn { background-image: linear-gradient(45deg, #FF8008, #FFC837, #FF8008); }
                .br-flow-crit { background-image: linear-gradient(45deg, #EB3349, #F45C43, #EB3349); animation: brGradientFlow 2s ease infinite; }
                .br-flow-pinned-ok { background-image: linear-gradient(45deg, #4facfe, #00f2fe, #4facfe); }
                .structItem-title { padding-right: 5px; }
.button, a.button {
                    background: transparent !important;
                    border: 1px solid var(--br-edge-color, #444) !important;
                    box-shadow: 0 0 8px rgba(0,0,0,0.2) !important;
                    color: #fff !important;
                    border-radius: 4px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                    font-weight: 600 !important;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                }
                .button:hover, a.button:hover {
                    box-shadow: 0 0 15px var(--br-edge-color, #fff) !important;
                    text-shadow: 0 0 8px var(--br-edge-color, #fff) !important;
                    transform: translateY(-2px) scale(1.02) !important;
                    border-color: #fff !important;
                    color: #fff !important;
                }
                .button:active, a.button:active {
                    transform: translateY(1px) scale(0.98) !important;
                }

                .button.button--cta, a.button.button--cta,
                .button.button--primary, a.button.button--primary {
                    border-color: var(--br-edge-color, #fff) !important;
                    color: #fff !important;
                }
                .button.button--cta:hover, a.button.button--cta:hover {
                    background: rgba(255, 0, 222, 0.15) !important;
                    box-shadow: 0 0 20px rgba(255, 0, 222, 0.6) !important;
                    text-shadow: 0 0 8px #ff00de !important;
                    border-color: #fff !important;
                }
                .button.button--primary, a.button.button--primary {
                    border-color: #00ff88 !important;
                    color: #00ff88 !important;
                    box-shadow: 0 0 8px rgba(0, 255, 136, 0.3) !important;
                }
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

                #${BACKGROUND_ELEMENT_ID} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none;
                    transition: background-image 0.5s ease, background-color 0.5s ease, background-attachment 0.1s linear;
                }
                body { background: transparent !important; }
                .p-pageWrapper { position: relative; z-index: auto; }


               #${BOTTOM_NAV_ID} {
                    width: auto;
                    max-width: 95%;
                    position: fixed;
                    z-index: 9997;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 10px;
                    transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                    overflow: hidden;
                }

                .br-nav-inner-mask {
                    height: ${BOTTOM_NAV_HEIGHT};
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 8px;
                    padding: 0 10px;
                    position: relative;
                    z-index: 2;
                    background: transparent;
                }
            .br-nav-group {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                .br-bottom-nav-hidden {
                    transform: translateX(-50%) translateY(100px) !important;
                    opacity: 0 !important;
                }
@media (max-width: 700px) {
                    #${BOTTOM_NAV_ID} {
                        width: 95%;
                        max-width: 95%;
                        bottom: 10px;
                    }
                    #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a {
                        padding: 0 10px;
                    }
                }#${BOTTOM_NAV_ID} .br-nav-utilities {
                    flex-shrink: 0;
                }
#${BOTTOM_NAV_ID} .br-nav-links {
                    justify-content: flex-start;
                    flex-grow: 1;
                    min-width: 0;
                    overflow-x: auto;
                    white-space: nowrap;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                    mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                }
                #${BOTTOM_NAV_ID} .br-nav-links::-webkit-scrollbar { display: none; }#${BOTTOM_NAV_ID} #br-style-nav-links-v110 a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: bold;
                    color: #d8d8d8;
                    text-shadow: none;
                    position: relative;
                    z-index: 2;
                    padding: 0 14px;
                    margin: 0 10px;
                    height: calc(${BOTTOM_NAV_HEIGHT} - 12px);
                    background: none;
                    border: none;
                    border-radius: 14px;
                    box-shadow: none;
                    transition: all 0.3s ease-out;
                }
                #br-style-nav-links-v110 a:active {
                    transform: scale(0.95);
                }
                #br-style-nav-links-v110 a.br-nav-link-active,
                #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a:hover {
                    color: #ffffff;
                    transform: translateY(-1px) scale(1.02);
                }
                #${BOTTOM_NAV_ID} a:active {
                    transform: scale(0.95);
                    background: rgba(0, 0, 0, 0.3) !important;
                }                #${CLOCK_ID} {
                    display: none;
                }                #${CLOCK_ID} .br-clock-inner {
                    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transform-style: preserve-3d;
                }
                #${CLOCK_ID}.br-clock-flipped .br-clock-inner {
                    transform: rotateY(180deg);
                }
                #${CLOCK_ID} .br-clock-front, #${CLOCK_ID} .br-clock-back {
                    backface-visibility: hidden;
                }
                #${CLOCK_ID} .br-clock-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    line-height: ${BOTTOM_NAV_HEIGHT};
                    padding: 0 10px;
                    transform: rotateY(180deg);
                }
#${STYLE_ICON_ID} { position: fixed; z-index: 9998; width: 40px; height: 40px; background-color: rgba(51, 51, 51, 0.8); border-radius: 50%; cursor: pointer; border: 1px solid rgba(120, 120, 120, 0.7); box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; align-items: center; justify-content: center; font-size: 24px; line-height: 1; color: white; user-select: none; bottom: 55px; left: 10px; }
@keyframes br-icon-flow {
                    0% { background-position: 0% 50%; box-shadow: 0 0 10px var(--br-nav-accent-color); }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; box-shadow: 0 0 10px var(--br-nav-accent-color); }
                }
                #${BOTTOM_NAV_ID} #${STYLE_ICON_ID} {
                    position: relative;
                    bottom: auto;
                    left: auto;
                    width: calc(${BOTTOM_NAV_HEIGHT} - 10px);
                    height: calc(${BOTTOM_NAV_HEIGHT} - 10px);
                    font-size: 18px;
                    background: var(--br-nav-main-gradient);
                    background-size: 300% 300%;
                    animation: br-icon-flow 6s ease infinite;
                    border: 1px solid var(--br-nav-border-color);
                    color: #ffffff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    border-radius: 12px;
                    z-index: 10;
                    margin-right: 0;
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                #${BOTTOM_NAV_ID} #${STYLE_ICON_ID}:hover {
                    transform: scale(1.1) rotate(15deg);
                }              #${STYLE_ICON_ID}:hover { background-color: rgba(80, 80, 80, 0.9); transform: scale(1.1); }

                #${SCROLL_INDICATOR_ID} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0%;
                    height: 3px;
                    background-color: #00F0FF;
                    z-index: 10000;
                    transition: width 0.1s linear;
                    display: none;
                }

                #${WELCOME_SCREEN_ID} {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                    opacity: 0;
                    animation: br-welcome-fade-in 0.3s ease-out forwards;
                    transition: opacity 0.3s ease;
                }
                .br-welcome-modal {
                    background-image: url('https://i.postimg.cc/8Px0mmnC/49fcb8ea0bdec98729da0ad679e7a954.jpg');
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-color: rgba(4, 11, 105, 0.7);
                    background-blend-mode: multiply;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(19px);
                    border-radius: 20px;
                    border: 1px solid rgba(89, 0, 89, 0.5);
                    max-height: 90vh;
                    overflow-y: auto;
                    color: #eee;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    width: 90%;
                    max-width: 500px;
                    padding: 25px;
                    box-sizing: border-box;
                    text-align: center;
                    animation: br-welcome-slide-up 0.4s ease-out forwards;
                }
                .br-welcome-modal h3 {
                    margin: 0;
                    font-size: 22px;
                    color: #fff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                }
                .br-welcome-modal .br-welcome-version {
                    font-size: 14px;
                    color: #999;
                    margin: 5px 0 20px 0;
                }
                .br-welcome-changelog {
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    text-align: left;
                }
                .br-welcome-changelog h4 {
                    margin: 0 0 10px 0;
                    color: #fff;
                    border-bottom: 1px solid #555;
                    padding-bottom: 5px;
                }
                .br-welcome-changelog ul {
                    margin: 0; padding-left: 20px;
                    font-size: 14px;
                    color: #ccc;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                }
                .br-welcome-changelog li {
                    margin-bottom: 8px;
                }
                .br-welcome-tip {
                    font-size: 13px;
                    color: #aaa;
                    margin-bottom: 25px;
                }
                #br-welcome-close-btn {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    margin-top: 10px;
                }
#br-welcome-close-btn:hover {
                    background-color: #45a049;
                    transform: scale(1.05);
                }
                @keyframes br-welcome-fade-in {                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes br-welcome-slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }


                .br-panel-tooltip {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #555;
                    color: #fff;
                    font-weight: bold;
                    font-size: 11px;
                    font-family: 'Courier New', Courier, monospace;
                    cursor: help;
                    margin-left: 8px;
                    vertical-align: middle;
                    position: relative;
                    user-select: none;
                }
                .br-panel-tooltip:hover::before {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 120%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #111;
                    color: #eee;
                    padding: 8px 12px;
                    border-radius: 5px;
                    font-size: 12px;
                    font-family: Inter, sans-serif;
                    font-weight: 400;
                    width: 300px;
                    max-width: 300px;
                    z-index: 10000;
                    text-align: left;
                    white-space: normal;
                    border: 1px solid #444;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.4);
                }
                .br-panel-tooltip:hover::after {
                    content: '';
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(8px);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid #111;
                    z-index: 9999;
                }
                .br-welcome-modal .br-welcome-subtitle {
                    font-size: 16px;
                    color: #00F0FF;
                    margin: -10px 0 15px 0;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(0, 240, 255, 0.7);
                }
                                .br-welcome-modal h2 {
                    font-size: 26px;
                    margin: 0 0 5px 0;
                    color: #fff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                }
                              .br-welcome-logo-text-red {
                    color: #E74C3C;
                    font-weight: bold;
                    text-shadow: 0 0 8px rgba(231, 76, 60, 0.8);
                }

                .br-anim-scroll {

                    opacity: 1 !important;
                    will-change: auto;
                    animation: none !important;
                }
                .br-anim-fade-in.br-is-visible {
                    animation: br-rich-fade 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .br-anim-fade-in-up.br-is-visible {
                    animation: br-rich-spring-up 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .br-anim-slide-in-left.br-is-visible {
                    animation: br-rich-slide-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }

                @keyframes br-rich-spring-up {
                    0% { opacity: 0; transform: translateY(40px) scale(0.95); }
                    60% { opacity: 1; transform: translateY(-5px) scale(1.01); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes br-rich-fade {
                    from { opacity: 0; filter: blur(4px); }
                    to { opacity: 1; filter: blur(0); }
                }
                @keyframes br-rich-slide-right {
                    0% { opacity: 0; transform: translateX(-30px); }
                    100% { opacity: 1; transform: translateX(0); }
                }

                .br-slide-out-left { animation: br-panel-slide-out-left 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
                .br-slide-in-right { animation: br-panel-slide-in-right 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .br-slide-out-right { animation: br-panel-slide-out-right 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
                .br-slide-in-left { animation: br-panel-slide-in-left 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

                @keyframes br-panel-slide-out-left {
                    to { opacity: 0; transform: translateX(-20px) scale(0.95); filter: blur(2px); }
                }
                @keyframes br-panel-slide-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes br-panel-slide-out-right {
                    to { opacity: 0; transform: translateX(30px); }
                }
                @keyframes br-panel-slide-in-left {
                    from { opacity: 0; transform: translateX(-20px) scale(0.95); filter: blur(2px); }
                    to { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
                }

                .br-hub-card:active {
                    transform: scale(0.92) rotateX(10deg);
                    transition: transform 0.1s;
                }

                #br-style-copy-modal-v1 {

                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .br-style-modal-content {
                    background: #333;
                    border: 1px solid #555;
                    border-radius: 12px;
                    padding: 20px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    transform: scale(0.95);
                    opacity: 0;
                    animation: br-modal-pop-in 0.2s ease-out forwards;
                }
                @keyframes br-modal-pop-in {
                    to { transform: scale(1); opacity: 1; }
                }
                .br-style-modal-content h4 {
                    margin: 0 0 15px;
                    color: #fff;
                    text-align: center;
                    border-bottom: 1px solid #555;
                    padding-bottom: 10px;
                    font-size: 16px;
                }
                .br-style-modal-content input[type="text"] {
                    width: 100%;
                    background: #222;
                    border: 1px solid #666;
                    color: #eee;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .br-style-modal-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                .br-style-modal-buttons button {
                    flex: 1;
                    padding: 9px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }
                .br-style-modal-copy {
                    background: #007bff;
                    color: white;
                }
                .br-style-modal-copy:hover { background: #0056b3; }
                .br-style-modal-close {
                    background: #aaa;
                    color: #333;
                }
                .br-style-modal-close:hover { background: #999; }
#br-panel-wrapper {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 9990;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                    transition: opacity 0.4s ease;
                }

#${PANEL_ID} {
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    background: #2B124C;
                    border-radius: 16px;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
                }
                .br-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 20px;
                    border-bottom: 1px solid rgba(198, 198, 208, 0.1);
                    flex-shrink: 0;
                }
                .br-panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #C6C6D0;
                    display: flex;
                    align-items: center;
                }

                .br-panel-close-btn {
                    background: transparent;
                    border: none;
                    color: #C6C6D0;
                    font-size: 16px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s, transform 0.2s;
                }
                .br-panel-close-btn:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .br-panel-body {
                    padding: 20px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                }

                .br-hub-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 15px;
                }


#blackrussia-settings-panel-v111 {
    background-color: #05070a !important;
    background-image:
        radial-gradient(circle at 50% 50%, rgba(25, 30, 50, 1) 0%, rgba(5, 7, 10, 1) 90%),
        radial-gradient(1px 1px at 15% 15%, rgba(255, 255, 255, 0.7) 1px, transparent 0),
        radial-gradient(1px 1px at 35% 45%, rgba(255, 255, 255, 0.5) 1px, transparent 0),
        radial-gradient(1px 1px at 65% 25%, rgba(255, 255, 255, 0.6) 1px, transparent 0),
        radial-gradient(2px 2px at 85% 65%, rgba(255, 255, 255, 0.4) 1px, transparent 0) !important;
    background-size: 100% 100%, 300px 300px, 450px 450px, 350px 350px, 500px 500px !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 50px rgba(0, 0, 0, 0.9) !important;
    border: none !important;
    animation: br-panel-entry 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
    transform-origin: center center;
}

@keyframes br-panel-entry {
    0% { opacity: 0; transform: scale(0.94) translateY(15px); filter: blur(4px); }
    60% { opacity: 1; transform: scale(1.01) translateY(-2px); filter: blur(0); }
    100% { transform: scale(1) translateY(0); }
}

@keyframes br-card-cascade {
    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

.br-panel-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    background: rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(5px);
}

.br-hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 15px;
    padding: 10px;
}

.br-hub-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 22px;
    padding: 20px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
    overflow: visible;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    animation: br-card-cascade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.br-hub-card:nth-child(1) { animation-delay: 0.05s; }
.br-hub-card:nth-child(2) { animation-delay: 0.1s; }
.br-hub-card:nth-child(3) { animation-delay: 0.15s; }
.br-hub-card:nth-child(4) { animation-delay: 0.2s; }
.br-hub-card:nth-child(5) { animation-delay: 0.25s; }
.br-hub-card:nth-child(6) { animation-delay: 0.3s; }
.br-hub-card:nth-child(7) { animation-delay: 0.35s; }
.br-hub-card:nth-child(8) { animation-delay: 0.4s; }

.br-hub-card:hover {
    transform: translateY(-5px) scale(1.02);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
}

.br-hub-card::before {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: var(--glow-color);
    filter: blur(30px);
    opacity: 0.3;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 0;
    pointer-events: none;
}

.br-hub-card:hover::before {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(2);
}


@keyframes br-gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes br-icon-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
}

.br-hub-card-icon {
    width: 50px;
    height: 50px;
    margin: 0 auto 12px auto;
    position: relative;
    z-index: 2;
    animation: br-icon-pulse 3s ease-in-out infinite, br-morph 8s ease-in-out infinite alternate;
}

.br-hub-card span {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #b0b3b8;
    text-transform: uppercase;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
}

.br-hub-card:hover span {
    color: #fff;
    text-shadow: 0 0 8px var(--glow-color);
    letter-spacing: 1px;
}

.br-hub-card .br-hub-card-icon {
    width: 50px !important;
    height: 50px !important;
    margin: 0 auto 12px auto;
    position: relative;
    z-index: 2;
    -webkit-mask-size: contain !important;
    mask-size: contain !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat;
    -webkit-mask-position: center !important;
    mask-position: center !important;
    background-color: transparent !important;
    background-image: var(--icon-gradient) !important;
    background-size: 300% 300% !important;
    animation: br-gradient-flow 3s linear infinite !important;
    filter: drop-shadow(0 0 5px var(--glow-color));
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.br-hub-card:hover .br-hub-card-icon {
    transform: scale(1.1) translateY(-3px);
    filter: drop-shadow(0 0 12px var(--glow-color));
    animation: br-gradient-flow 3s linear infinite, br-icon-pop 0.4s ease-in-out !important;
}

.br-hub-card[data-page="tab-moderation"] {
    --glow-color: rgba(255, 71, 87, 0.6);
    --icon-gradient: linear-gradient(135deg, #ff4757, #ff6b81, #ff9f43, #ff4757);
}
.br-hub-card[data-page="tab-moderation"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-main"] {
    --glow-color: rgba(0, 210, 211, 0.6);
    --icon-gradient: linear-gradient(135deg, #00d2d3, #48dbfb, #0abde3, #00d2d3);
}
.br-hub-card[data-page="tab-main"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-visuals"] {
    --glow-color: rgba(255, 159, 243, 0.6);
    --icon-gradient: linear-gradient(135deg, #ff9ff3, #f368e0, #c44569, #ff9ff3);
}
.br-hub-card[data-page="tab-visuals"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2.69l5.74 5.74c2.96 2.97 2.52 8.23-.98 11.73-2.99 2.99-7.83 3.23-11.27-.21-3.44-3.44-3.2-8.28-.21-11.27L12 2.69z'/%3E%3Cpath d='M8 12a4 4 0 0 1 5-3.5'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-animations"] {
    --glow-color: rgba(255, 159, 67, 0.6);
    --icon-gradient: linear-gradient(135deg, #feca57, #ff9f43, #ee5253, #feca57);
}
.br-hub-card[data-page="tab-animations"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h1'/%3E%3Cpath d='M21 12h1'/%3E%3Cpath d='M12 2v1'/%3E%3Cpath d='M12 21v1'/%3E%3Cpath d='M4.93 4.93l.7.7'/%3E%3Cpath d='M18.36 18.36l.7.7'/%3E%3Cpath d='M4.93 19.07l.7-.7'/%3E%3Cpath d='M18.36 5.64l.7-.7'/%3E%3Ccircle cx='12' cy='12' r='6'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-interface"] {
    --glow-color: rgba(46, 204, 113, 0.6);
    --icon-gradient: linear-gradient(135deg, #2ecc71, #10ac84, #1dd1a1, #2ecc71);
}
.br-hub-card[data-page="tab-interface"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='3' y1='9' x2='21' y2='9'/%3E%3Cline x1='9' y1='21' x2='9' y2='9'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-live"] {
    --glow-color: rgba(155, 89, 182, 0.6);
    --icon-gradient: linear-gradient(135deg, #9b59b6, #8e44ad, #a55eea, #9b59b6);
}
.br-hub-card[data-page="tab-live"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a10 10 0 1 0 10 10'/%3E%3Cpath d='M12 12V6'/%3E%3Cpath d='M12 12l4.5 2'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-presets"] {
    --glow-color: rgba(254, 202, 87, 0.6);
    --icon-gradient: linear-gradient(135deg, #feca57, #ff9f43, #ff6b6b, #feca57);
}
.br-hub-card[data-page="tab-presets"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-integrations"] {
    --glow-color: rgba(84, 160, 255, 0.6);
    --icon-gradient: linear-gradient(135deg, #54a0ff, #2e86de, #48dbfb, #54a0ff);
}
.br-hub-card[data-page="tab-integrations"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-gallery"] {
    --glow-color: rgba(72, 219, 251, 0.6);
    --icon-gradient: linear-gradient(135deg, #48dbfb, #0abde3, #00d2d3, #48dbfb);
}
.br-hub-card[data-page="tab-gallery"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E");
}

.br-hub-card[data-page="tab-help"] {
    --glow-color: rgba(200, 214, 229, 0.6);
    --icon-gradient: linear-gradient(135deg, #c8d6e5, #8395a7, #576574, #c8d6e5);
}
.br-hub-card[data-page="tab-help"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 16v-4'/%3E%3Cpath d='M12 8h.01'/%3E%3C/svg%3E");
}

                .br-settings-view {
                    display: none;
                }
                .br-settings-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .br-settings-back-btn {
                    background: #104C64;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    color: #C6C6D0;
                    padding: 6px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.2s, color 0.2s;
                }
                .br-settings-back-btn:hover {
                    background: #D59D80;
                    color: #2B124C;
                    border-color: #D59D80;
                }
                .br-settings-title {
                    margin: 0 0 0 15px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #C6C6D0;
                }

                #${PANEL_ID}[data-view="hub"] .br-settings-view { display: none; }
                #${PANEL_ID}[data-view="hub"] .br-hub-grid { display: grid; }

                #${PANEL_ID}[data-view="page"] .br-settings-view { display: block; }
                #${PANEL_ID}[data-view="page"] .br-hub-grid { display: none; }

                #${PANEL_ID} .panel-tab-content {
                    display: none;
                    animation: br-fade-in 0.3s ease-out;
                }
                @keyframes br-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                #${PANEL_ID} .panel-tab-content h4 {
                    color: #D59D80;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    border-bottom: 1px solid rgba(198, 198, 208, 0.1);
                    padding: 8px 0;
                    margin: 20px 0 15px 0;
                    font-size: 14px;
                    text-align: center;
                    font-weight: 600;
                }
                #${PANEL_ID} .panel-tab-content h4:first-child {
                    margin-top: 0;
                    border-top: none;
                }

                #${PANEL_ID} .setting-group {
                    margin-bottom: 12px;
                    padding: 14px;
                    border-radius: 8px;
                    background: #104C64;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                }

                #${PANEL_ID} label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #C6C6D0;
                    font-size: 13px;
                }
                #${PANEL_ID} label.inline-label {
                    display: inline;
                    margin-left: 8px;
                    font-weight: 400;
                    color: #C6C6D0;
                }

                #${PANEL_ID} input[type="text"],
                #${PANEL_ID} input[type="number"],
                #${PANEL_ID} input[type="file"],
                #${PANEL_ID} select,
                #${PANEL_ID} textarea {
                    width: 100%;
                    padding: 8px 12px;
                    background: #0D1D25;
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    color: #C6C6D0;
                    border-radius: 6px;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                    font-size: 13px;
                }
                #${PANEL_ID} input[type="text"]:focus,
                #${PANEL_ID} input[type="number"]:focus,
                #${PANEL_ID} select:focus,
                #${PANEL_ID} textarea:focus {
                    border-color: #D59D80;
                    background: #104C64;
                    box-shadow: 0 0 8px rgba(213, 157, 128, 0.2);
                    outline: none;
                }

                #${PANEL_ID} input[type="color"] {
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    height: 28px;
                    width: 44px;
                    vertical-align: middle;
                    margin-left: 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    background: transparent;
                    transition: border-color 0.2s;
                }
                #${PANEL_ID} input[type="color"]:hover {
                    border-color: #D59D80;
                }

                #${PANEL_ID} input[type="checkbox"] {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #0D1D25;
                    border-radius: 5px;
                    position: relative;
                    vertical-align: middle;
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    cursor: pointer;
                    margin-right: 5px;
                    transition: all 0.2s ease;
                }
                #${PANEL_ID} input[type="checkbox"]::after {
                    content: '✓';
                    font-weight: bold;
                    font-size: 14px;
                    color: #2B124C;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                    transition: all 0.2s ease;
                }
                #${PANEL_ID} input[type="checkbox"]:checked {
                    background: #D59D80;
                    border-color: #D59D80;
                }
                #${PANEL_ID} input[type="checkbox"]:checked::after {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }

                #${PANEL_ID} input[type="range"] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                    margin-top: 8px;
                    cursor: pointer;
                }
                #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 6px;
                    background: #0D1D25;
                    border-radius: 3px;
                    border: 1px solid rgba(0,0,0,0.2);
                }
                #${PANEL_ID} input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #C6C6D0;
                    border: 4px solid #D59D80;
                    margin-top: -7px;
                    box-shadow: 0 0 5px rgba(213, 157, 128, 0.5);
                    transition: transform 0.1s;
                }
                #${PANEL_ID} input[type="range"]:active::-webkit-slider-thumb {
                    transform: scale(1.2);
                }

                #${PANEL_ID} .button-group {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: flex-end;
                }
                #${PANEL_ID} button.panel-btn {
                    padding: 9px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    color: #C6C6D0;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    background: #104C64;
                }
                #${PANEL_ID} button.panel-btn:active {
                    transform: scale(0.98);
                }
                #${PANEL_ID} button.panel-btn-save {
                    background: #D59D80;
                    border-color: #D59D80;
                    color: #2B124C;
                }
                #${PANEL_ID} button.panel-btn-save:hover {
                    opacity: 0.9;
                }
                #${PANEL_ID} button.panel-btn-reset:hover,
                #${PANEL_ID} button.panel-btn-export:hover,
                #${PANEL_ID} button.panel-btn-import:hover {
                    background: #104C64;
                    border-color: #D59D80;
                }

                #${PANEL_ID} button.panel-small-btn {
                    padding: 6px 10px !important;
                    font-size: 12px !important;
                    background: #104C64;
                    border-color: rgba(198, 198, 208, 0.1);
                }
                #${PANEL_ID} button.panel-btn-danger {
                    background: #8B0000 !important;
                    border-color: rgba(255,100,100,0.3) !important;
                }
                #${PANEL_ID} button.panel-btn-add {
                    background: rgba(213, 157, 128, 0.1);
                    border: 1px solid rgba(213, 157, 128, 0.3);
                    color: #D59D80;
                    width: 100%;
                }

                #${PANEL_ID} hr {
                    border: none;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    margin: 20px 0;
                }

                #${PANEL_ID} .sub-settings {
                    margin-left: 0;
                    padding: 10px;
                    border-left: 3px solid #D59D80;
                    margin-top: 12px;
                    background: rgba(13, 29, 37, 0.5);
                    border-radius: 0 6px 6px 0;
                }

                #${PANEL_ID} .dynamic-links-group {
                    border-color: rgba(198, 198, 208, 0.1);
                }
                #${PANEL_ID} .quick-link-input-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                #${PANEL_ID} .quick-link-input-item input {
                    font-size: 12px;
                }
                #${PANEL_ID} .quick-link-input-item button.remove-quick-link-btn {
                    flex-shrink: 0;
                    padding: 6px 9px !important;
                    line-height: 1;
                }

                #${PANEL_ID} .author-credit {
                    text-align: center;
                    font-size: 11px;
                    color: #888;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                }

                @media (max-width: 700px) {
                    #br-panel-wrapper {
                        padding: 0;
                    }
                    #${PANEL_ID} {
                        max-height: 100vh;
                        height: 100%;
                        border-radius: 0;
                        border: none;
                    }
                    .br-hub-grid {
                        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                        gap: 10px;
                    }
                    .br-panel-body {
                        padding: 15px;
                    }
                }
                .br-help-section p,
                .br-help-section li {
                    color: #C6C6D0;
                    font-size: 13px;
                    line-height: 1.6;
                }
                .br-help-section p {
                    margin-top: 5px;
                    margin-bottom: 10px;
                }
                .br-help-section ul {
                    padding-left: 20px;
                    margin: 10px 0;
                }
                .br-help-section li {
                    margin-bottom: 10px;
                }
                .br-help-section strong {
                    color: #D59D80;
                    font-weight: 600;
                }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} { background: rgba(43, 18, 76, 0.7); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card { background: rgba(16, 76, 100, 0.6); border-color: rgba(198, 198, 208, 0.1); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card:hover { border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card .br-hub-card-icon { background-color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card:hover .br-hub-card-icon { background-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card span { color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-settings-back-btn { background: rgba(16, 76, 100, 0.6); border-color: rgba(198, 198, 208, 0.1); color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-settings-back-btn:hover { background: #D59D80; color: #2B124C; border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-settings-title { color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .panel-tab-content h4 { color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} .setting-group { background: rgba(16, 76, 100, 0.6); border-color: rgba(198, 198, 208, 0.1); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} label { color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="text"],
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="number"],
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="file"],
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} select,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} textarea { background: rgba(13, 29, 37, 0.6); border-color: rgba(198, 198, 208, 0.2); color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} select:focus,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} textarea:focus { border-color: #D59D80; background: rgba(16, 76, 100, 0.6); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="color"] { border-color: rgba(198, 198, 208, 0.2); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="color"]:hover { border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="checkbox"] { background: rgba(13, 29, 37, 0.6); border-color: rgba(198, 198, 208, 0.2); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="checkbox"]::after { color: #2B124C; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="checkbox"]:checked { background: #D59D80; border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(13, 29, 37, 0.6); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #C6C6D0; border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn { color: #C6C6D0; border-color: rgba(198, 198, 208, 0.1); background: rgba(16, 76, 100, 0.6); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-save { background: #D59D80; border-color: #D59D80; color: #2B124C; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-import:hover { border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-add { background: rgba(213, 157, 128, 0.1); border-color: rgba(213, 157, 128, 0.3); color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} .sub-settings { border-left-color: #D59D80; background: rgba(13, 29, 37, 0.5); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-help-section strong { color: #D59D80; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(32, 34, 37, 0.6), rgba(40, 42, 47, 0.6));
                    border-color: rgba(234, 234, 234, 0.1);
                }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card {
                    background: linear-gradient(rgba(47, 49, 54, 0.5), rgba(50, 53, 59, 0.5));
                    border-color: rgba(234, 234, 234, 0.1);
                }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card:hover { border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card .br-hub-card-icon { background-color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card:hover .br-hub-card-icon { background-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card span { color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-settings-back-btn { background: rgba(47, 49, 54, 0.5); border-color: rgba(234, 234, 234, 0.1); color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-settings-back-btn:hover { background: #007BFF; color: #FFFFFF; border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-settings-title { color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .panel-tab-content h4 { color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} .setting-group { background: rgba(47, 49, 54, 0.5); border-color: rgba(234, 234, 234, 0.1); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} label { color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} textarea { background: rgba(32, 34, 37, 0.5); border-color: rgba(234, 234, 234, 0.2); color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} textarea:focus { border-color: #007BFF; background: rgba(47, 49, 54, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="color"] { border-color: rgba(234, 234, 234, 0.2); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="color"]:hover { border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="checkbox"] { background: rgba(32, 34, 37, 0.5); border-color: rgba(234, 234, 234, 0.2); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="checkbox"]::after { color: #202225; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="checkbox"]:checked { background: #007BFF; border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(32, 34, 37, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #EAEAEA; border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn { color: #EAEAEA; border-color: rgba(234, 234, 234, 0.1); background: rgba(47, 49, 54, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-save { background: #007BFF; border-color: #007BFF; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-add { background: rgba(0, 123, 255, 0.1); border-color: rgba(0, 123, 255, 0.3); color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} .sub-settings { border-left-color: #007BFF; background: rgba(32, 34, 37, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] .br-help-section strong { color: #007BFF; }

                                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(44, 47, 51, 0.6), rgba(48, 51, 57, 0.6));
                    border-color: rgba(220, 221, 222, 0.1);
                }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card {
                    background: linear-gradient(rgba(54, 57, 63, 0.5), rgba(60, 63, 70, 0.5));
                    border-color: rgba(220, 221, 222, 0.1);
                }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card:hover { border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card .br-hub-card-icon { background-color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card:hover .br-hub-card-icon { background-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card span { color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-settings-back-btn { background: rgba(54, 57, 63, 0.5); border-color: rgba(220, 221, 222, 0.1); color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-settings-back-btn:hover { background: #7289DA; color: #FFFFFF; border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-settings-title { color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .panel-tab-content h4 { color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} .setting-group { background: rgba(54, 57, 63, 0.5); border-color: rgba(220, 221, 222, 0.1); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} label { color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} textarea { background: rgba(44, 47, 51, 0.5); border-color: rgba(220, 221, 222, 0.2); color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} textarea:focus { border-color: #7289DA; background: rgba(54, 57, 63, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="color"] { border-color: rgba(220, 221, 222, 0.2); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="color"]:hover { border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="checkbox"] { background: rgba(44, 47, 51, 0.5); border-color: rgba(220, 221, 222, 0.2); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="checkbox"]::after { color: #2C2F33; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="checkbox"]:checked { background: #7289DA; border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(44, 47, 51, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #DCDDDE; border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn { color: #DCDDDE; border-color: rgba(220, 221, 222, 0.1); background: rgba(54, 57, 63, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-save { background: #7289DA; border-color: #7289DA; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-add { background: rgba(114, 137, 218, 0.1); border-color: rgba(114, 137, 218, 0.3); color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} .sub-settings { border-left-color: #7289DA; background: rgba(44, 47, 51, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-help-section strong { color: #7289DA; }

                                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(31, 31, 31, 0.6), rgba(35, 35, 35, 0.6));
                    border-color: rgba(232, 234, 237, 0.1);
                }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card {
                    background: linear-gradient(rgba(40, 42, 44, 0.5), rgba(44, 46, 48, 0.5));
                    border-color: rgba(232, 234, 237, 0.1);
                }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card:hover { border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card .br-hub-card-icon { background-color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card:hover .br-hub-card-icon { background-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card span { color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-settings-back-btn { background: rgba(40, 42, 44, 0.5); border-color: rgba(232, 234, 237, 0.1); color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-settings-back-btn:hover { background: #8AB4F8; color: #1F1F1F; border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-settings-title { color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .panel-tab-content h4 { color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} .setting-group { background: rgba(40, 42, 44, 0.5); border-color: rgba(232, 234, 237, 0.1); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} label { color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} textarea { background: rgba(31, 31, 31, 0.5); border-color: rgba(232, 234, 237, 0.2); color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} textarea:focus { border-color: #8AB4F8; background: rgba(40, 42, 44, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="color"] { border-color: rgba(232, 234, 237, 0.2); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="color"]:hover { border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="checkbox"] { background: rgba(31, 31, 31, 0.5); border-color: rgba(232, 234, 237, 0.2); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="checkbox"]::after { color: #1F1F1F; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="checkbox"]:checked { background: #8AB4F8; border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(31, 31, 31, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #E8EAED; border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn { color: #E8EAED; border-color: rgba(232, 234, 237, 0.1); background: rgba(40, 42, 44, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-save { background: #8AB4F8; border-color: #8AB4F8; color: #1F1F1F; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-add { background: rgba(138, 180, 248, 0.1); border-color: rgba(138, 180, 248, 0.3); color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} .sub-settings { border-left-color: #8AB4F8; background: rgba(31, 31, 31, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-help-section strong { color: #8AB4F8; }

                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(20, 20, 20, 0.6), rgba(26, 26, 26, 0.6));
                    border-color: rgba(255, 255, 255, 0.15);
                }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card {
                    background: linear-gradient(rgba(44, 44, 46, 0.5), rgba(50, 50, 52, 0.5));
                    border-color: rgba(255, 255, 255, 0.15);
                }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card:hover { border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card .br-hub-card-icon { background-color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card:hover .br-hub-card-icon { background-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card span { color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-settings-back-btn { background: rgba(44, 44, 46, 0.5); border-color: rgba(255, 255, 255, 0.15); color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-settings-back-btn:hover { background: #0A84FF; color: #FFFFFF; border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-settings-title { color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .panel-tab-content h4 { color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} .setting-group { background: rgba(44, 44, 46, 0.5); border-color: rgba(255, 255, 255, 0.15); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} label { color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} textarea { background: rgba(26, 26, 26, 0.5); border-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} textarea:focus { border-color: #0A84FF; background: rgba(44, 44, 46, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="color"] { border-color: rgba(255, 255, 255, 0.2); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="color"]:hover { border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="checkbox"] { background: rgba(26, 26, 26, 0.5); border-color: rgba(255, 255, 255, 0.2); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="checkbox"]::after { color: #1A1A1A; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="checkbox"]:checked { background: #0A84FF; border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(26, 26, 26, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #FFFFFF; border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn { color: #FFFFFF; border-color: rgba(255, 255, 255, 0.15); background: rgba(44, 44, 46, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-save { background: #0A84FF; border-color: #0A84FF; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-add { background: rgba(10, 132, 255, 0.1); border-color: rgba(10, 132, 255, 0.3); color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} .sub-settings { border-left-color: #0A84FF; background: rgba(26, 26, 26, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-help-section strong { color: #0A84FF; }

                                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(40, 36, 32, 0.6), rgba(45, 41, 37, 0.6));
                    border-color: rgba(216, 207, 192, 0.1);
                }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card {
                    background: linear-gradient(rgba(59, 55, 51, 0.5), rgba(65, 61, 57, 0.5));
                    border-color: rgba(216, 207, 192, 0.1);
                }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card:hover { border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card .br-hub-card-icon { background-color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card:hover .br-hub-card-icon { background-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card span { color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-settings-back-btn { background: rgba(59, 55, 51, 0.5); border-color: rgba(216, 207, 192, 0.1); color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-settings-back-btn:hover { background: #D9A066; color: #282420; border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-settings-title { color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .panel-tab-content h4 { color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} .setting-group { background: rgba(59, 55, 51, 0.5); border-color: rgba(216, 207, 192, 0.1); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} label { color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} textarea { background: rgba(40, 36, 32, 0.5); border-color: rgba(216, 207, 192, 0.2); color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} textarea:focus { border-color: #D9A066; background: rgba(59, 55, 51, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="color"] { border-color: rgba(216, 207, 192, 0.2); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="color"]:hover { border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="checkbox"] { background: rgba(40, 36, 32, 0.5); border-color: rgba(216, 207, 192, 0.2); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="checkbox"]::after { color: #282420; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="checkbox"]:checked { background: #D9A066; border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(40, 36, 32, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #D8CFC0; border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn { color: #D8CFC0; border-color: rgba(216, 207, 192, 0.1); background: rgba(59, 55, 51, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-save { background: #D9A066; border-color: #D9A066; color: #282420; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-add { background: rgba(217, 160, 102, 0.1); border-color: rgba(217, 160, 102, 0.3); color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} .sub-settings { border-left-color: #D9A066; background: rgba(40, 36, 32, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-help-section strong { color: #D9A066; }

                                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(34, 39, 37, 0.6), rgba(38, 44, 42, 0.6));
                    border-color: rgba(224, 224, 224, 0.1);
                }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card {
                    background: linear-gradient(rgba(48, 54, 51, 0.5), rgba(52, 59, 55, 0.5));
                    border-color: rgba(224, 224, 224, 0.1);
                }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card:hover { border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card .br-hub-card-icon { background-color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card:hover .br-hub-card-icon { background-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card span { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-settings-back-btn { background: rgba(48, 54, 51, 0.5); border-color: rgba(224, 224, 224, 0.1); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-settings-back-btn:hover { background: #2ECC71; color: #222725; border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-settings-title { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .panel-tab-content h4 { color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} .setting-group { background: rgba(48, 54, 51, 0.5); border-color: rgba(224, 224, 224, 0.1); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} label { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} textarea { background: rgba(34, 39, 37, 0.5); border-color: rgba(224, 224, 224, 0.2); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} textarea:focus { border-color: #2ECC71; background: rgba(48, 54, 51, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="color"] { border-color: rgba(224, 224, 224, 0.2); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="color"]:hover { border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="checkbox"] { background: rgba(34, 39, 37, 0.5); border-color: rgba(224, 224, 224, 0.2); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="checkbox"]::after { color: #222725; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="checkbox"]:checked { background: #2ECC71; border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(34, 39, 37, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #E0E0E0; border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn { color: #E0E0E0; border-color: rgba(224, 224, 224, 0.1); background: rgba(48, 54, 51, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-save { background: #2ECC71; border-color: #2ECC71; color: #222725; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-add { background: rgba(46, 204, 113, 0.1); border-color: rgba(46, 204, 113, 0.3); color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} .sub-settings { border-left-color: #2ECC71; background: rgba(34, 39, 37, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-help-section strong { color: #2ECC71; }


                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(44, 25, 43, 0.6), rgba(50, 30, 48, 0.6));
                    border-color: rgba(233, 64, 87, 0.1);
                }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card {
                    background: linear-gradient(rgba(66, 40, 64, 0.5), rgba(72, 45, 70, 0.5));
                    border-color: rgba(233, 64, 87, 0.15);
                }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card:hover { border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card .br-hub-card-icon { background-color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card:hover .br-hub-card-icon { background-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card span { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-settings-back-btn { background: rgba(66, 40, 64, 0.5); border-color: rgba(233, 64, 87, 0.15); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-settings-back-btn:hover { background: #E94057; color: #FFFFFF; border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-settings-title { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .panel-tab-content h4 { color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} .setting-group { background: rgba(66, 40, 64, 0.5); border-color: rgba(233, 64, 87, 0.15); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} label { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} textarea { background: rgba(44, 25, 43, 0.5); border-color: rgba(233, 64, 87, 0.2); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} textarea:focus { border-color: #E94057; background: rgba(66, 40, 64, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="color"] { border-color: rgba(233, 64, 87, 0.2); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="color"]:hover { border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="checkbox"] { background: rgba(44, 25, 43, 0.5); border-color: rgba(233, 64, 87, 0.2); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="checkbox"]::after { color: #2C192B; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="checkbox"]:checked { background: #E94057; border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(44, 25, 43, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #E0E0E0; border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn { color: #E0E0E0; border-color: rgba(233, 64, 87, 0.15); background: rgba(66, 40, 64, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-save { background: #E94057; border-color: #E94057; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-add { background: rgba(233, 64, 87, 0.1); border-color: rgba(233, 64, 87, 0.3); color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} .sub-settings { border-left-color: #E94057; background: rgba(44, 25, 43, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-help-section strong { color: #E94057; }
.author-credit-link {

    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(168, 214, 227, 0.1);

    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    color: #a8d6e3;
    transition: all 0.2s ease-in-out;
    text-shadow: 0 0 5px rgba(168, 214, 227, 0.4);
}
.author-credit-link:hover {
    color: #ffffff;
    text-shadow: 0 0 10px #ffffff, 0 0 2px #000000;
    transform: translateY(-1px);
}
.br-stats-dashboard {
            display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 8px; margin-bottom: 12px;
            background: var(--br-nav-bg, rgba(20, 20, 25, 0.95));
            backdrop-filter: blur(10px); padding: 8px;
            border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); scrollbar-width: none;
            box-shadow: var(--br-nav-shadow, 0 10px 30px rgba(0,0,0,0.3));
        }
        .br-stats-dashboard::-webkit-scrollbar { display: none; }

        .br-stat-card {
            flex: 1; min-width: 80px; background: rgba(255, 255, 255, 0.03); border-radius: 6px;
            padding: 6px 4px; text-align: center; display: flex; flex-direction: row;
            align-items: center; justify-content: center; gap: 8px; position: relative;
            overflow: hidden; border: 1px solid rgba(255,255,255,0.03); cursor: pointer;
            transition: all 0.2s ease; user-select: none;
        }
        .br-stat-card:hover { background: rgba(255, 255, 255, 0.07); transform: translateY(-1px); }
        .br-stat-card.active { background: rgba(255, 255, 255, 0.15); border-color: var(--stat-color); box-shadow: 0 0 10px var(--stat-color); }
        .br-stat-card.dimmed { opacity: 0.4; filter: grayscale(0.8); }

        .br-stat-card.pulse-alert { animation: br-pulse 2s infinite; }
        @keyframes br-pulse {
            0% { box-shadow: 0 0 0 0 rgba(241, 196, 15, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(241, 196, 15, 0); }
            100% { box-shadow: 0 0 0 0 rgba(241, 196, 15, 0); }
        }

        .br-stat-icon {
            font-size: 14px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
            border-radius: 50%; background: rgba(255,255,255,0.05); color: var(--stat-color);
        }
        .br-stat-info { display: flex; flex-direction: column; align-items: flex-start; }
        .br-stat-val { font-size: 16px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 2px; }
        .br-stat-lbl { font-size: 9px; color: #999; text-transform: uppercase; font-weight: 700; letter-spacing: 0.3px; }
        .br-stat-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: var(--stat-color); opacity: 0.5; }

        .s-wai { --stat-color: #f1c40f; } .s-con { --stat-color: #e67e22; }
        .s-imp { --stat-color: #e74c3c; } .s-ok { --stat-color: #2ecc71; } .s-clo { --stat-color: #7f8c8d; }

        .structItem.br-filtered-hide { display: none !important; }
        .structItem-title { position: relative !important; z-index: 1; }
        .br-preview-btn-wrap { display: inline-block; vertical-align: middle; margin-left: 8px; position: relative; z-index: 100; }
        .br-preview-btn {
            display: flex; align-items: center; justify-content: center; width: 26px; height: 26px;
            background: rgba(35, 35, 40, 0.8); border-radius: 6px; color: #7f8c8d; cursor: pointer;
            border: 1px solid rgba(255,255,255,0.1); font-size: 12px; transition: all 0.2s ease;
        }
        .br-preview-btn:hover { background: #3498db; color: #fff; border-color: #3498db; transform: scale(1.1); }

        .br-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
            z-index: 200000; display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.25s ease;
        }
        .br-modal-overlay.active { opacity: 1; visibility: visible; }
        .br-modal-window {
            background: #141414; width: 92%; max-width: 750px; max-height: 85vh;
            border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 30px 80px rgba(0,0,0,0.8); transform: scale(0.95) translateY(10px);
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; flex-direction: column;
        }
        .br-modal-overlay.active .br-modal-window { transform: scale(1) translateY(0); }
        .br-modal-header {
            padding: 14px 20px; background: var(--br-nav-bg, rgba(255,255,255,0.03)); border-bottom: 1px solid rgba(255,255,255,0.05);
            display: flex; gap: 15px; align-items: center;
        }
        .br-modal-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #333; }
        .br-modal-meta { flex-grow: 1; overflow: hidden; }
        .br-modal-title { font-weight: 700; color: #fff; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .br-modal-date { font-size: 11px; color: #888; margin-top: 2px; }
        .br-modal-close { cursor: pointer; color: #555; font-size: 22px; transition: color 0.2s; line-height: 1; }
        .br-modal-close:hover { color: #fff; }
        .br-modal-content { padding: 20px; overflow-y: auto; color: #ccc; font-size: 14px; line-height: 1.6; flex-grow: 1; }
        .br-modal-content img { max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 6px; display: block; margin: 10px 0; }
        .br-modal-content .bbCodeBlock { background: #1a1a1a; border: 1px solid #333; border-radius: 4px; margin: 10px 0; }
        .br-hl-nick { color: #00F0FF; font-weight: bold; background: rgba(0, 240, 255, 0.1); padding: 0 3px; border-radius: 3px; }
        .br-hl-ip { color: #E040FB; font-weight: bold; }
        .br-spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #3498db; border-radius: 50%; animation: br-spin 0.8s linear infinite; margin: 50px auto; }

@media screen and (max-width: 768px) {
                    #blackrussia-settings-panel-v111 {
                        width: 100% !important;
                        height: 100% !important;
                        max-height: 100% !important;
                        max-width: 100% !important;
                        top: 0 !important;
                        left: 0 !important;
                        border-radius: 0 !important;
                        transform: none !important;
                        border: none !important;
                        position: fixed !important;
                        background: #09090b !important;
                        z-index: 20000 !important;
                    }

                    .br-panel-body {
                        padding: 20px 15px 160px 15px !important;
                        height: 100% !important;
                        overflow-y: auto !important;
                    }

                    .br-hub-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                        display: grid;
                    }

                    #blackrussia-settings-panel-v111[data-view="page"] .br-hub-grid {
                        display: none !important;
                    }

                    .br-hub-card:last-child:nth-child(odd) {
                        grid-column: 1 / -1 !important;
                        width: 60% !important;
                        margin: 0 auto !important;
                    }

                    .br-hub-card {
                        padding: 20px 10px !important;
                        min-height: 110px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    }

                    .br-hub-card-icon {
                        width: 45px !important;
                        height: 45px !important;
                        margin-bottom: 12px !important;
                    }

                    .br-hub-card span {
                        font-size: 12px !important;
                        font-weight: 700 !important;
                    }

                    #blackrussia-bottom-nav-bar-v111 {
                        width: 90% !important;
                        bottom: 20px !important;
                        border-radius: 20px !important;
                        background: rgba(20, 20, 25, 0.95) !important;
                        backdrop-filter: blur(15px) !important;
                        z-index: 19999 !important;
                    }

                    .br-panel-header {
                        padding: 15px 20px !important;
                        background: transparent !important;
                    }

                    .br-panel-close-btn {
                        font-size: 24px !important;
                        padding: 10px !important;
                    }

                    .button-group {
                        position: fixed !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        padding: 15px !important;
                        background: rgba(10, 10, 12, 0.98) !important;
                        backdrop-filter: blur(20px) !important;
                        border-top: 1px solid rgba(255,255,255,0.1) !important;
                        z-index: 20001 !important;
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        gap: 10px !important;
                        margin: 0 !important;
                        box-sizing: border-box !important;
                    }

                    .button-group span {
                        display: none !important;
                    }

                    .button-group button {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 14px !important;
                        border-radius: 10px !important;
                        font-size: 13px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }

                    .button-group button i {
                        margin-right: 6px !important;
                    }
                }

                .br-nav-force-hidden {
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transform: translateY(20px) scale(0.9) !important;
                    pointer-events: none !important;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
                }
        body.br-cinema-mode::before {
            content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(3px);
            z-index: 9000; transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events: none; opacity: 0;
        }
        body.br-cinema-mode.br-cinema-active::before { opacity: 1; }

        .br-cinema-target {
            position: relative; z-index: 9001 !important;
            box-shadow: 0 0 0 0 rgba(0,0,0,0);
            transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        body.br-cinema-active .br-cinema-target {
            transform: scale(1.02);
            box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            border-color: var(--br-nav-accent-color) !important;
        }

        @media (max-width: 600px) {
            .br-stat-card { flex-direction: column; gap: 2px; min-width: 70px; }
            .br-stat-info { align-items: center; }
            .br-stat-icon { width: 20px; height: 20px; font-size: 10px; margin-bottom: 2px; }
        }

        #${PANEL_ID} input,
        #${PANEL_ID} select,
        #${PANEL_ID} button,
        #${PANEL_ID} label,
        #${PANEL_ID} textarea,
        #${PANEL_ID} .br-toggle-switch {
            position: relative !important;
            z-index: 50 !important;
            pointer-events: auto !important;
        }

        #${PANEL_ID} .setting-group {
            position: relative !important;
            z-index: 40 !important;
            transform: none !important;
        }

        #${PANEL_ID}[data-view="page"] .br-hub-grid {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -1 !important;
        }

        #${PANEL_ID} .br-settings-view {
            position: relative !important;
            z-index: 100 !important;
        }

        #br-skeleton-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #09090b;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            transition: opacity 0.4s ease;
        }
        .br-sk-nav-bar {
            height: 50px;
            width: 100%;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 20px;
            flex-shrink: 0;
            background: #111;
        }
        .br-sk-body {
            display: flex;
            max-width: 1200px;
            width: 95%;
            margin: 0 auto;
            gap: 20px;
            flex-grow: 1;
            overflow: hidden;
        }
        .br-sk-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .br-sk-sidebar {
            width: 280px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .br-sk-block {
            background: #161618;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.05);
            overflow: hidden;
            position: relative;
        }
        .br-sk-block-header {
            height: 40px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 5px;
        }
        .br-sk-row {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            gap: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.02);
        }
        .br-sk-ava {
            width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
        }
        .br-sk-content { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .br-sk-text { height: 10px; border-radius: 4px; }
        .br-sk-text.w-40 { width: 40%; }
        .br-sk-text.w-60 { width: 60%; }
        .br-sk-text.w-80 { width: 80%; }
        .br-sk-widget { height: 150px; border-radius: 12px; position: relative; overflow: hidden; }

        .br-shimmer {
            background: #1c1c1f;
            background-image: linear-gradient(
                100deg,
                rgba(255, 255, 255, 0) 20%,
                rgba(255, 255, 255, 0.07) 50%,
                rgba(255, 255, 255, 0) 80%
            );
            background-size: 500px 100%;
            background-repeat: no-repeat;
            animation: br-wave 1.5s infinite linear forwards;
        }

        @keyframes br-wave {
            0% { background-position: -500px 0; }
            100% { background-position: 500px 0; }
        }

        @media (max-width: 900px) {
            .br-sk-sidebar { display: none; }
        }
        .br-skeleton-fade-out { opacity: 0; pointer-events: none; }
                          `;
            const styleElement = document.createElement('style');
            styleElement.id = staticStyleId;
            styleElement.type = 'text/css';
            styleElement.textContent = staticCss;
            (document.head || document.documentElement).appendChild(styleElement);
        } catch (e) {
            console.error('[BR Style] Ошибка внедрения статичных CSS ❌', e);
        }
    }

        function findMyUsername() {
        if (myUsername) return;
        const checkForUser = () => {
            const userEl = document.querySelector('.p-nav-link--username');
            if (userEl) {
                myUsername = userEl.textContent.trim();
                if (settingsPanel) {
                    const status = settingsPanel.querySelector('#my-username-status');
                    if (status) status.textContent = `Ваш ник: ${myUsername}`;
                }
                applyForumStyles(currentSettings);
                handleDynamicWelcome();
                return true;
            }
            return false;
        };
        if (checkForUser()) return;
        const observer = new MutationObserver((mutations, obs) => {
            if (checkForUser()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    }

        function findThreadAuthor() {
        if (threadAuthor) return;
        const firstPost = document.querySelector('.message[data-content-key="0"]');
        if (firstPost) {
            threadAuthor = firstPost.dataset.author;
            console.log(`[BR Style] Автор темы определен: ${threadAuthor}`);
            applyForumStyles(currentSettings);
            return;
        }
        const profileUsername = document.querySelector('.p-title-value');
        if (profileUsername && document.body.classList.contains('page--member-view')) {
             threadAuthor = profileUsername.textContent.trim();
             console.log(`[BR Style] Автор темы (на странице профиля): ${threadAuthor}`);
             applyForumStyles(currentSettings);
             return;
        }
    }
let liveForumPollInterval = null;
    let notifiedAdmins = new Set();
    let topicLastPostTimes = new Map();

    function fetchForumData(url, parserFunc) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            if (currentSettings.enableLiveCounters || currentSettings.enableAdminOnlineToast) {
                                parserFunc(response.responseText);
                            } else {
                                const parser = new DOMParser();
                                const htmlDoc = parser.parseFromString(response.responseText, "text/html");
                                parserFunc(htmlDoc);
                            }
                            resolve(true);
                        } else {
                            reject(new Error(`Status ${response.status}`));
                        }
                    },
                    onerror: function(response) {
                        reject(new Error(`Network error: ${response.statusText}`));
                    },
                    ontimeout: function() {
                        reject(new Error('Request timed out'));
                    }
                });
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    function parseLiveCounters(htmlData) {
        if (!currentSettings.enableLiveCounters) return;

        if (typeof htmlData === 'string' && brWorker) {
             brWorker.postMessage({
                type: 'PROCESS_COUNTERS',
                payload: { html: htmlData }
            });
        } else if (typeof htmlData === 'object') {
             const htmlDoc = htmlData;
             const updateCounter = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return;
                const newCountText = htmlDoc.querySelector(selector)?.textContent.trim() || '0';
                const newCount = parseInt(newCountText, 10) || 0;
                if (newCount > 0) {
                    el.textContent = newCountText;
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            };
            updateCounter('.p-nav-link--alerts .badge');
            updateCounter('.p-nav-link--conversations .badge');
        }
    }

    function parseOnlineAdmins(htmlData) {
        if (!currentSettings.enableAdminOnlineToast || !currentSettings.adminToastNicks) return;

        if (typeof htmlData === 'string' && brWorker) {
            const nicks = currentSettings.adminToastNicks.split('\n').map(n => n.trim()).filter(n => n.length > 0);
            if (nicks.length === 0) return;
            brWorker.postMessage({
                type: 'PROCESS_ADMINS',
                payload: { html: htmlData, nicks: nicks }
            });
        } else if (typeof htmlData === 'object') {
            const htmlDoc = htmlData;
            const nicksToTrack = currentSettings.adminToastNicks.split('\n').map(n => n.trim().toLowerCase()).filter(n => n.length > 0);
            if (nicksToTrack.length === 0) return;
            const onlineUsers = Array.from(htmlDoc.querySelectorAll('.memberListItem-name .username')).map(el => el.textContent.trim().toLowerCase());

            for (const nick of onlineUsers) {
                if (nicksToTrack.includes(nick) && !notifiedAdmins.has(nick)) {
                    showToast(`⚡ ${nick} вошел на форум!`, 'info', 5000);
                    notifiedAdmins.add(nick);
                }
            }
        }
    }
    function parseHotTopics(htmlDoc) {
        if (!currentSettings.enableHotTopicPulse) return;
        const isTopicList = document.body.classList.contains('page--forum-view') || document.body.classList.contains('page--whats-new');
        if (!isTopicList) {
            topicLastPostTimes.clear();
            return;
        }
        const newTopicTimes = new Map();       htmlDoc.querySelectorAll('.structItem[data-thread-id]').forEach(newStructItem => {
            const threadId = newStructItem.dataset.threadId;
            if (!threadId) return;
            const lastPostTimeEl = newStructItem.querySelector('.structItem-cell--lastPost .structItem-startDate');
            const lastPostTime = lastPostTimeEl ? (lastPostTimeEl.dataset.time || lastPostTimeEl.textContent.trim()) : '0';
            newTopicTimes.set(threadId, lastPostTime);
            const oldTime = topicLastPostTimes.get(threadId);

            if (oldTime === undefined) {
                 topicLastPostTimes.set(threadId, lastPostTime);
            } else if (oldTime !== lastPostTime) {
                const localStructItem = document.querySelector(`.structItem[data-thread-id="${threadId}"]`);
                if (localStructItem) {                   localStructItem.classList.add('br-hot-topic-pulse');
                    setTimeout(() => {                        localStructItem.classList.remove('br-hot-topic-pulse');
                    }, 1000);
                }
                topicLastPostTimes.set(threadId, lastPostTime);
            }
        });
        topicLastPostTimes.forEach((time, threadId) => {
            if (!newTopicTimes.has(threadId)) {
                topicLastPostTimes.delete(threadId);
            }
        });
    }

    function parseLiveFeed(htmlDoc) {
        if (!currentSettings.enableLiveFeed) return;
        const feedContainer = document.getElementById('br-live-feed-container');
        if (!feedContainer) return;
        const tickerContainer = feedContainer.querySelector('.br-live-feed-ticker');
        if (!tickerContainer) return;
        tickerContainer.innerHTML = '';
        const items = htmlDoc.querySelectorAll('.structItem.js-activityStream-item');
        let count = 0;
        for (const item of items) {
            if (count >= 2) break;
            const titleEl = item.querySelector('.structItem-title a[data-tp-primary="on"]');
            const userEl = item.querySelector('.structItem-minor .username');
            if (titleEl && userEl) {
                const title = titleEl.textContent.trim();
                const user = userEl.textContent.trim();
                const feedItem = document.createElement('div');
                feedItem.className = 'br-live-feed-item';
                const titleSpan = document.createElement('span');
                titleSpan.className = 'br-live-feed-item-title';
                titleSpan.title = title;
                titleSpan.textContent = title;
                const userSpan = document.createElement('span');
                userSpan.className = 'br-live-feed-item-user';
                userSpan.textContent = ` by ${user}`;
                feedItem.appendChild(titleSpan);
                feedItem.appendChild(userSpan);
                tickerContainer.appendChild(feedItem);
                count++;
            }
        }
        if (count > 0) {
            const itemsClone = Array.from(tickerContainer.children).map(child => child.cloneNode(true));
            itemsClone.forEach(clone => tickerContainer.appendChild(clone));
        }
    }

    function startLiveForumPollers() {
        if (liveForumPollInterval) {
            clearTimeout(liveForumPollInterval);
            liveForumPollInterval = null;
        }

        const poll = async () => {
            const tasks = [];
            if (currentSettings.enableLiveCounters) {
                tasks.push(fetchForumData(window.location.href, parseLiveCounters).catch(e => console.error("[BR Style] Ошибка live counters:", e)));
            }
            if (currentSettings.enableAdminOnlineToast) {
                tasks.push(fetchForumData('https://forum.blackrussia.online/index.php?online/list', parseOnlineAdmins).catch(e => console.error("[BR Style] Ошибка admin online:", e)));
            }
            if (currentSettings.enableHotTopicPulse && (document.body.classList.contains('page--forum-view') || document.body.classList.contains('page--whats-new'))) {
                tasks.push(fetchForumData(window.location.href, parseHotTopics).catch(e => console.error("[BR Style] Ошибка hot topics:", e)));
            }
            if (currentSettings.enableLiveFeed) {
                tasks.push(fetchForumData('https://forum.blackrussia.online/index.php?whats-new/latest-activity', parseLiveFeed).catch(e => console.error("[BR Style] Ошибка live feed:", e)));
            }

            await Promise.all(tasks);

            const interval = Math.max(30, currentSettings.liveUpdateInterval || 60) * 1000;
            if (liveForumPollInterval !== null) {
                liveForumPollInterval = setTimeout(poll, interval);
            }
        };

        liveForumPollInterval = 0;
        poll();
    }

    function setupUiSounds() {}

    function setupCopyHandler() {
        if (!currentSettings.enableCopyToast) return;

        document.addEventListener('copy', (e) => {
            const selection = document.getSelection();
            if (selection && selection.toString().length > 0) {
                showToast('✅ Скопировано в буфер обмена', 'success');
            }
        });
    }


    function setupLikeAnimations() {
        setupUiSounds();

        if (!currentSettings.enableLikeAnimations) return;

        document.body.addEventListener('click', (e) => {
            const likeButton = e.target.closest('a.reaction');
            if (likeButton && likeButton.dataset.reactionId === '1') {
                const rect = likeButton.getBoundingClientRect();
                const popEl = document.createElement('div');
                popEl.className = 'br-like-pop';
                popEl.textContent = '❤️';
                popEl.style.left = `${rect.left + rect.width / 2 - 15}px`;
                popEl.style.top = `${rect.top - 20}px`;
                document.body.appendChild(popEl);
                setTimeout(() => { popEl.remove(); }, 600);
            }
        });
    }

    function handleDynamicWelcome() {
        if (!currentSettings.enableDynamicWelcome || !myUsername) return;
        const seenWelcomeKey = 'br_style_seen_welcome_today';
        const today = new Date().toLocaleDateString();
        const lastSeen = GM_getValue(seenWelcomeKey, '');
        if (lastSeen === today) return;
        const hour = new Date().getHours();
        let greeting = 'Привет';
        if (hour >= 5 && hour < 12) {
            greeting = 'Доброе утро';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Добрый день';
        } else if (hour >= 18 && hour < 23) {
            greeting = 'Добрый вечер';
        } else {
            greeting = 'Доброй ночи';
        }
        showToast(`👋 ${greeting}, ${myUsername}!`, 'info', 4000);
        GM_setValue(seenWelcomeKey, today);
    }
const MODAL_OVERLAY_ID = 'br-style-copy-modal-v1';

    function showCopyModal(bbCode) {
        if (document.getElementById(MODAL_OVERLAY_ID)) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = MODAL_OVERLAY_ID;
        modalOverlay.className = 'br-style-modal-overlay';

        modalOverlay.innerHTML = `
            <div class="br-style-modal-content">
                <h4>✅ Скриншот загружен!</h4>
                <input type="text" id="br-style-modal-input" readonly>
                <div class="br-style-modal-buttons">
                    <button id="br-style-modal-copy-btn" class="br-style-modal-copy">Скопировать</button>
                    <button id="br-style-modal-close-btn" class="br-style-modal-close">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        const input = modalOverlay.querySelector('#br-style-modal-input');
        const copyBtn = modalOverlay.querySelector('#br-style-modal-copy-btn');
        const closeBtn = modalOverlay.querySelector('#br-style-modal-close-btn');
        input.value = bbCode;
        input.select();

        const closeModal = () => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        };
        copyBtn.addEventListener('click', () => {
            input.select();
            try {
                navigator.clipboard.writeText(bbCode).then(() => {
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(closeModal, 700);
                }, () => {
                    document.execCommand('copy');
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(closeModal, 700);
                });
            } catch (err) {
                prompt('Ошибка. Скопируйте вручную:', bbCode);
                closeModal();
            }
        });
        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
        const MAX_HISTORY_SIZE = 20;

    async function addUploadToHistory(bbCode) {
        if (!bbCode) return;
        try {
            const entry = {
                bbcode: bbCode,
                date: new Date().toISOString()
            };
            let history = [];
            try {
                history = JSON.parse(await GM_getValue(UPLOAD_HISTORY_KEY, '[]'));
                if (!Array.isArray(history)) history = [];
            } catch (e) {
                history = [];
            }
            history.unshift(entry);
            history = history.slice(0, MAX_HISTORY_SIZE);
            await GM_setValue(UPLOAD_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения истории загрузок:', e);
        }
    }

    async function loadUploadHistory() {
    if (!settingsPanel) return;
    const container = settingsPanel.querySelector('#br-upload-history-container');
    if (!container) return;

    container.innerHTML = `
        <div class="br-skeleton-loader"></div>
        <div class="br-skeleton-loader" style="width: 80%;"></div>
        <div class="br-skeleton-loader" style="width: 90%;"></div>
    `;

    let history = [];
        try {
            history = JSON.parse(await GM_getValue(UPLOAD_HISTORY_KEY, '[]'));
            if (!Array.isArray(history)) history = [];
        } catch (e) {
            history = [];
        }

        if (history.length === 0) {
            container.innerHTML = '<p style="font-size: 12px; color: #888; text-align: center;">История загрузок пуста.</p>';
            return;
        }

        container.innerHTML = '';
        history.forEach(entry => {
            const date = new Date(entry.date);
            const dateString = date.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
            const item = document.createElement('div');
            item.className = 'br-history-item';
            item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 6px; border-bottom: 1px solid rgba(198, 198, 208, 0.1); font-size: 12px; gap: 8px;';
            item.innerHTML = `
                <code style="background: #104C64; padding: 3px 6px; border-radius: 4px; color: #D59D80; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;" title="${entry.bbcode}">${entry.bbcode}</code>
                <span style="color: #888; white-space: nowrap; margin-left: auto;">${dateString}</span>
                <button class="br-history-copy-btn" title="Скопировать BB-код" style="background: #104C64; border: 1px solid rgba(198, 198, 208, 0.1); color: #C6C6D0; font-size: 11px; padding: 3px 7px; border-radius: 4px; cursor: pointer; flex-shrink: 0;">📋</button>
            `;
            item.querySelector('.br-history-copy-btn').addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(entry.bbcode);
                showToast('BB-код скопирован!', 'success');
            });
            container.appendChild(item);
        });
    }

    function setupScreenshotUploader(textEditor) {
        if (!textEditor || textEditor.dataset.brUploaderAttached) return;
        textEditor.dataset.brUploaderAttached = 'true';

        const apiKey = currentSettings.imgbbApiKey;
        if (!apiKey) return;

        const ICON_URL = 'https://i.postimg.cc/c1m7TjfC/517c8ce85483ff710c49936c45fdc1a1.gif';
        const LOADING_GIF_URL = 'https://i.postimg.cc/cJydvFkx/fc5dd7e93fd1f4037fb311e79ccb740e.gif';
        const BUTTON_BG_URL = currentSettings.uploaderBtnBgUrl;

        const container = document.createElement('div');
        container.style.cssText = 'margin: 10px 0; clear: both; width: 100%; display: flex; justify-content: center;';

        const uploadButton = document.createElement('button');
        const originalButtonHTML = `<img src="${ICON_URL}" style="width:16px; height:16px; vertical-align:middle; margin-right:8px; filter: brightness(0.9);"> Загрузить (ImgBB)`;

        uploadButton.innerHTML = originalButtonHTML;
        uploadButton.className = 'button br-upload-button';
        const themeColor = currentSettings.edgeColor || '#E74C3C';
        uploadButton.style.cssText = `
            color: white; font-weight: bold; border: 1px solid ${themeColor}; padding: 6px 12px;
            border-radius: 5px; cursor: pointer; font-size: 14px; transition: all 0.2s;
            text-align: center; display: block; width: auto;
            box-shadow: 0 0 5px ${themeColor}40;
        `;

        if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
            uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
            uploadButton.style.backgroundSize = 'cover';
            uploadButton.style.backgroundPosition = 'center';
        } else {
            uploadButton.style.background = `linear-gradient(135deg, ${themeColor}AA, ${themeColor})`;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        const uploadImage = (file) => {
            uploadButton.innerHTML = `
                <img src="${LOADING_GIF_URL}" style="width: 24px; height: 24px; display: block; margin: 0 auto 5px;">
                <span style="font-size: 12px; color: #eee;">Загрузка...</span>
            `;
            uploadButton.disabled = true;
            uploadButton.style.backgroundColor = '#5a5a5a';
            uploadButton.style.backgroundImage = 'none';

            const formData = new FormData();
            formData.append('image', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://api.imgbb.com/1/upload?key=${apiKey}`,
                data: formData,
                headers: { "Accept": "application/json" },
                onload: function(response) {
                    uploadButton.innerHTML = originalButtonHTML;
                    uploadButton.disabled = false;
                    if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
                        uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
                    } else {
                        uploadButton.style.backgroundColor = '#8B0000';
                    }
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.success) {
                            const bbCode = `[IMG]${json.data.url}[/IMG]`;
                            addUploadToHistory(bbCode);
                            showCopyModal(bbCode);
                        } else {
                            throw new Error(json.error.message);
                        }
                    } catch (e) {
                        console.error('[BR Style Uploader] Ошибка❌:', e);
                        showToast(`Ошибка загрузки: ${e.message}`, 'error');
                    }
                },
                onerror: function() {
                    uploadButton.innerHTML = originalButtonHTML;
                    uploadButton.disabled = false;
                    if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
                        uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
                    } else {
                        uploadButton.style.backgroundColor = '#8B0000';
                    }
                    showToast('Ошибка сети при загрузке (ImgBB)', 'error');
                }
            });
        };

        textEditor.addEventListener('paste', (e) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const file = e.clipboardData.files[0];
                if (file.type.startsWith('image/')) {
                    e.preventDefault();
                    uploadImage(file);
                }
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                uploadImage(fileInput.files[0]);
                fileInput.value = '';
            }
        });

        uploadButton.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };

        container.appendChild(uploadButton);
        container.appendChild(fileInput);
        textEditor.parentNode.insertBefore(container, textEditor.nextSibling);
    }

    function findAndAttachUploader() {
        if (!currentSettings.imgbbApiKey) return;

        const quickReplyEditor = document.querySelector('.js-quickReply .js-editor');
        if (quickReplyEditor) {
            setupScreenshotUploader(quickReplyEditor);
        }       document.querySelectorAll('textarea[name="message"]').forEach(setupScreenshotUploader);
    }

    function runComplaintTracker() {
        if (!currentSettings.enableComplaintTracker) return;

        const targetUrlParts = (currentSettings.complaintTrackerSections || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);
const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
const pathname = window.location.pathname;

const isMainForumPage = (pathname === '/forum/' || pathname === '/forum/index.php' || pathname === '/');
const isTargetSection = targetUrlParts.some(part => currentUrl.includes(part));

if (!isMainForumPage && !isTargetSection) return;

      const CLOSED_PREFIXES = [
            'закрыто', 'одобрено', 'отказано', 'решено', 'рассмотрено', 'тестирование', 'архив',
            'closed', 'approved', 'denied', 'resolved', 'reviewed', 'testing', 'archive',
            'реализовано', 'completed'
        ];
        const TIME_WARN = currentSettings.complaintTrackerWarnTime || 12;
        const TIME_CRIT = currentSettings.complaintTrackerCritTime || 24;

        function showCopyToast(text) {
            const toast = document.createElement('div');
            toast.className = 'br-copy-tooltip';
            toast.innerHTML = `📋 ${text}`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 1500);
        }
        function getBadgeConfig(item, hours) {
            const isPinned = item.querySelector('.structItem-status--sticky');
            const label = item.querySelector('.label');
            const labelText = label ? label.textContent.toLowerCase() : '';
            const isLocked = item.querySelector('.structItem-status--locked');
            const isClosedPrefix = CLOSED_PREFIXES.some(p => labelText.includes(p));
            const isClosed = isLocked || isClosedPrefix;

            if (!isPinned && isClosed) {
                return null;
            }
            if (isPinned && hours < TIME_WARN) return { class: 'br-flow-pinned-ok', icon: '<i class="fas fa-thumbtack"></i>' };

            if (hours < TIME_WARN) return { class: 'br-flow-fresh', icon: '<i class="fas fa-clock"></i>' };
            if (hours < TIME_CRIT) return { class: 'br-flow-warn', icon: '<i class="fas fa-hourglass-half"></i>' };
            return { class: 'br-flow-crit', icon: '<i class="fas fa-fire"></i>' };
        }
        const threads = document.querySelectorAll('.structItem');

        threads.forEach(thread => {
            if (thread.querySelector('.br-neon-badge')) return;
            const times = Array.from(thread.querySelectorAll('time'));
            if (times.length === 0) return;
            let maxTime = 0;
            times.forEach(t => {
                const val = parseInt(t.getAttribute('data-time'));
                if (val > maxTime) maxTime = val;
            });
            const diff = Date.now() - (maxTime * 1000);
            const hoursTotal = diff / (1000 * 60 * 60);

            let timeStr;
            if (hoursTotal >= 24) {
                const d = Math.floor(hoursTotal / 24);
                const h = Math.floor(hoursTotal % 24);
                timeStr = `${d}д ${h}ч`;
            } else {
                const h = Math.floor(hoursTotal);
                const m = Math.floor((hoursTotal - h) * 60);
                timeStr = `${h}ч ${m}м`;
            }
            const config = getBadgeConfig(thread, hoursTotal);
            if (!config) return;
            const badge = document.createElement('span');
            badge.className = 'br-neon-badge ' + config.class;
            badge.title = 'Нажми, чтобы скопировать ссылку';
            badge.innerHTML = `${config.icon} ${timeStr}`;

            badge.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const link = thread.querySelector('.structItem-title a[data-tp-primary]');
                if (link) {
                    const fullUrl = link.href;
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(fullUrl);
                    } else {
                        GM_setClipboard(fullUrl);
                    }
                    showCopyToast('Ссылка скопирована!');
                }
            };
            const titleContainer = thread.querySelector('.structItem-title');
            const link = titleContainer.querySelector('a[data-tp-primary]');

            if (link) {
                titleContainer.insertBefore(badge, link);
            }
        });
    }

    function runBinderModule() {
        const STORAGE_KEY = 'br_binder_v13_3_edit';
        const MODAL_ID = 'br-modal-ice-v3';
        const BTN_ID = 'br-btn-ice-v3';

        const DEFAULT_DATA = {
            autoSend: false,
            macros: [
                { title: '<i class="fas fa-hand-paper"></i> Приветствие', text: 'Приветствую, уважаемый игрок.', settings: { font: 'Courier New', size: '4', align: 'center', color: '#3498db' } },
                { title: '<i class="fas fa-check-circle"></i> Одобрено', text: 'Одобрено, закрыто.', settings: { bold: true, align: 'center', color: '#2ecc71', imgTop: '', footer: 'Приятной игры!' } },
                { title: '<i class="fas fa-times-circle"></i> Отказано', text: 'Отказано, закрыто.', settings: { bold: true, align: 'center', color: '#e74c3c', footer: 'Недостаточно доказательств.' } }
            ]
        };

        function loadData() { const data = localStorage.getItem(STORAGE_KEY); return data ? JSON.parse(data) : DEFAULT_DATA; }
        function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

        function buildFinalText(macro) {
            let content = macro.text; const s = macro.settings || {};
            if (s.bold) content = `[B]${content}[/B]`; if (s.italic) content = `[I]${content}[/I]`; if (s.underline) content = `[U]${content}[/U]`; if (s.strike) content = `[S]${content}[/S]`;
            if (s.icode) content = `[ICODE]${content}[/ICODE]`; if (s.code) content = `[CODE]${content}[/CODE]`; if (s.spoiler) content = `[SPOILER]${content}[/SPOILER]`; if (s.quote) content = `[QUOTE]${content}[/QUOTE]`;
            if (s.color) content = `[COLOR=${s.color}]${content}[/COLOR]`; if (s.font) content = `[FONT=${s.font}]${content}[/FONT]`; if (s.size) content = `[SIZE=${s.size}]${content}[/SIZE]`;
            if (s.imgTop) content = `[IMG]${s.imgTop}[/IMG]\n${content}`; if (s.footer) content = `${content}\n[FONT=Courier New][SIZE=3]${s.footer}[/SIZE][/FONT]`;
            if (s.align === 'center') content = `[CENTER]${content}[/CENTER]`; else if (s.align === 'right') content = `[RIGHT]${content}[/RIGHT]`;
            return content;
        }

                function insertTextAtCursor(text) {
            const frElement = document.querySelector('.fr-element');
            const textarea = document.querySelector('textarea[name="message"]');
            if (frElement) {
                frElement.focus();
                const success = document.execCommand('insertHTML', false, text.replace(/\n/g, '<br>'));
                if (!success) {
                    frElement.innerHTML += text.replace(/\n/g, '<br>');
                }
                frElement.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            } else if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
                textarea.focus();
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            } else {
                showToast("⚠️ Поле ввода не найдено!", 'error');
                return false;
            }
        }

        function performAction(macro) {
            const data = loadData(); const finalText = buildFinalText(macro); const success = insertTextAtCursor(finalText);
            if (success) {
                document.getElementById(MODAL_ID).style.display = 'none';
                if (data.autoSend) {
                    const toast = showToast('🚀 Отправка...', '#3498db');
                    setTimeout(() => { const replyBtn = document.querySelector('.button--icon--reply') || document.querySelector('.button--primary'); if (replyBtn) { replyBtn.click(); toast.innerHTML = "✅ Отправлено"; toast.style.background = "#2ecc71"; setTimeout(() => toast.remove(), 2000); } }, 400);
                } else { showToast('❄️ Вставлено', '#a0d8ef', 1500); }
            }
        }

        function renderMainView(modalBody) {
            const data = loadData(); modalBody.innerHTML = '';
            const list = document.createElement('div'); list.className = 'br-macro-list';
            if (data.macros.length === 0) list.innerHTML = '<div style="text-align:center; padding:20px; color:#777;">Нет шаблонов</div>';
            data.macros.forEach((m, index) => {
                const indicatorColor = m.settings?.color || '#aaa';
                const item = document.createElement('div'); item.className = 'br-macro-item';
                item.innerHTML = `<div class="br-macro-title" style="border-left: 3px solid ${indicatorColor}">${m.title}</div><div class="br-macro-actions"><button class="br-act-btn edit">✏️</button><button class="br-act-btn del">✖</button></div>`;
                item.querySelector('.br-macro-title').onclick = () => performAction(m);
                item.querySelector('.edit').onclick = (e) => { e.stopPropagation(); renderBuilderView(modalBody, m, index); };
                item.querySelector('.del').onclick = (e) => { e.stopPropagation(); if(confirm('Удалить шаблон?')) { data.macros.splice(index, 1); saveData(data); renderMainView(modalBody); } };
                list.appendChild(item);
            });
            modalBody.appendChild(list);
            const footer = document.createElement('div'); footer.className = 'br-macro-footer';
            footer.innerHTML = `<label class="br-autosend-label"><input type="checkbox" id="br-autosend-check" ${data.autoSend ? 'checked' : ''}> Автоматическая отправка при выборе шаблона.</label><button id="br-add-btn" class="br-add-btn">➕ Новый</button>`;
            modalBody.appendChild(footer);
            footer.querySelector('#br-autosend-check').onchange = (e) => { data.autoSend = e.target.checked; saveData(data); };
            footer.querySelector('#br-add-btn').onclick = () => renderBuilderView(modalBody);
        }

        function renderBuilderView(modalBody, existing = null, index = -1) {
            const s = existing ? existing.settings : {};
            modalBody.innerHTML = `
                <div class="br-edit-view"><div class="br-header-mini">${existing ? 'Редактирование' : 'Создание шаблона'}</div><div id="br-conflict-msg" class="br-warning-box" style="display:none;">⚠️ <b>Конфликт стилей!</b></div>
                <input type="text" id="b-title" class="br-input" placeholder="Название кнопки" value="${existing ? existing.title : ''}">
                <div class="br-label">Текст ответа:</div><textarea id="b-text" class="br-textarea" rows="3" placeholder="Введите текст...">${existing ? existing.text : ''}</textarea>
                <div class="br-group-label">🎨 Оформление</div><div class="br-settings-grid"><label class="br-check-btn"><input type="checkbox" id="s-bold" ${s.bold?'checked':''}> <b>Жирный [B]</b></label><label class="br-check-btn"><input type="checkbox" id="s-italic" ${s.italic?'checked':''}> <i>Курсив [I]</i></label><label class="br-check-btn"><input type="checkbox" id="s-underline" ${s.underline?'checked':''}> <u>Подчерк [U]</u></label><label class="br-check-btn"><input type="checkbox" id="s-strike" ${s.strike?'checked':''}> <s>Зачерк [S]</s></label></div>
                <div class="br-group-label">📍 Позиция</div><div class="br-settings-grid"><label class="br-check-btn"><input type="checkbox" id="s-center" ${s.align==='center'?'checked':''}> ≡ Центр</label><label class="br-check-btn"><input type="checkbox" id="s-right" ${s.align==='right'?'checked':''}> ⇥ Право</label></div>
                <div class="br-group-label">🧱 Блоки</div><div class="br-settings-grid"><label class="br-check-btn"><input type="checkbox" id="s-code" ${s.code?'checked':''}> ⌨ Код</label><label class="br-check-btn"><input type="checkbox" id="s-icode" ${s.icode?'checked':''}> 1-стр Код</label><label class="br-check-btn"><input type="checkbox" id="s-spoiler" ${s.spoiler?'checked':''}> 🫣 Спойлер</label><label class="br-check-btn"><input type="checkbox" id="s-quote" ${s.quote?'checked':''}> ❝ Цитата</label></div>
                <div class="br-group-label">🔤 Шрифт и Цвет</div><div class="br-settings-grid cols-2"><select id="s-font" class="br-select"><option value="">Шрифт (Авто)</option><option value="Courier New" ${s.font==='Courier New'?'selected':''}>Courier New</option><option value="Times New Roman" ${s.font==='Times New Roman'?'selected':''}>Times New Roman</option><option value="Arial" ${s.font==='Arial'?'selected':''}>Arial</option></select><select id="s-size" class="br-select"><option value="">Размер (Авто)</option><option value="4" ${s.size==='4'?'selected':''}>Размер 12</option><option value="5" ${s.size==='5'?'selected':''}>Размер 15</option><option value="6" ${s.size==='6'?'selected':''}>Размер 18</option></select><div class="br-color-input-wrapper"><span>Цвет текста:</span><input type="color" id="s-color" value="${s.color||'#ffffff'}"></div></div>
                <div class="br-label">Дополнительно:</div><input type="text" id="b-img" class="br-input" placeholder="Картинка сверху (ссылка)" value="${s.imgTop||''}"><input type="text" id="b-footer" class="br-input" placeholder="Подпись снизу" value="${s.footer||''}"><div class="br-edit-actions"><button id="cancel-edit">Назад</button><button id="save-edit" class="primary">Сохранить</button></div></div>
            `;
            const checkConflicts = () => {
                const center = document.getElementById('s-center').checked, right = document.getElementById('s-right').checked, code = document.getElementById('s-code').checked, icode = document.getElementById('s-icode').checked;
                const msg = document.getElementById('br-conflict-msg'), saveBtn = document.getElementById('save-edit');
                if ((center && right) || (code && icode)) { msg.style.display = 'block'; saveBtn.disabled = true; saveBtn.style.opacity = '0.5'; } else { msg.style.display = 'none'; saveBtn.disabled = false; saveBtn.style.opacity = '1'; }
            };
            modalBody.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', checkConflicts));
            document.getElementById('cancel-edit').onclick = () => renderMainView(modalBody);
            document.getElementById('save-edit').onclick = () => {
                const title = document.getElementById('b-title').value, textRaw = document.getElementById('b-text').value;
                if (!title || !textRaw) return alert('Заполните название и текст!');
                const settings = { bold: document.getElementById('s-bold').checked, italic: document.getElementById('s-italic').checked, underline: document.getElementById('s-underline').checked, strike: document.getElementById('s-strike').checked, code: document.getElementById('s-code').checked, icode: document.getElementById('s-icode').checked, spoiler: document.getElementById('s-spoiler').checked, quote: document.getElementById('s-quote').checked, align: document.getElementById('s-center').checked ? 'center' : (document.getElementById('s-right').checked ? 'right' : 'left'), font: document.getElementById('s-font').value, size: document.getElementById('s-size').value, color: document.getElementById('s-color').value, imgTop: document.getElementById('b-img').value, footer: document.getElementById('b-footer').value };
                const data = loadData(); const newMacro = { title, text: textRaw, settings };
                if (index >= 0) data.macros[index] = newMacro; else data.macros.push(newMacro);
                saveData(data); renderMainView(modalBody);
            };
        }

function injectStyles() {
            if (document.getElementById('br-binder-style-ice-v3')) return;
            const style = document.createElement('style'); style.id = 'br-binder-style-ice-v3';
            style.textContent = `@keyframes br-ice-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } #${BTN_ID} { background: var(--br-nav-main-gradient, linear-gradient(270deg, #0f2027, #203a43)); background-size: 400% 400%; animation: br-ice-flow 20s ease infinite; border: 1px solid var(--br-nav-border-color, rgba(255,255,255,0.2)); color: #fff; padding: 8px 0; border-radius: 6px; width: 100%; text-align: center; font-weight: 600; margin-bottom: 8px; cursor: pointer; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; gap: 8px; } #${BTN_ID}:active { transform: scale(0.98); filter: brightness(1.1); } #${MODAL_ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 100000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); } .br-modal-box { background: #141414; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); width: 90%; max-width: 380px; border-radius: 20px; border: 1px solid var(--br-nav-border-color, rgba(255,255,255,0.1)); display: flex; flex-direction: column; max-height: 85vh; box-shadow: 0 15px 50px rgba(0,0,0,0.9); overflow: hidden; font-family: sans-serif; animation: br-morph 10s ease-in-out infinite alternate; } .br-macro-list { padding: 10px; overflow-y: auto; flex-grow: 1; } .br-macro-item { display: flex; justify-content: space-between; align-items: stretch; background: rgba(255, 255, 255, 0.05); margin-bottom: 6px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s; } .br-macro-item:active { background: rgba(255, 255, 255, 0.1); } .br-macro-title { padding: 10px 12px; color: #c9d1d9; font-size: 13px; flex-grow: 1; cursor: pointer; } .br-macro-actions { display: flex; border-left: 1px solid rgba(255, 255, 255, 0.05); } .br-act-btn { border: none; background: transparent; padding: 0 10px; cursor: pointer; color: #8b949e; font-size: 14px; } .br-act-btn.edit:hover { color: #58a6ff; background: rgba(255, 255, 255, 0.1); } .br-act-btn.del:hover { color: #f85149; background: rgba(255, 255, 255, 0.1); } .br-macro-footer { padding: 10px 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); background: transparent; display: flex; justify-content: space-between; align-items: center; } .br-add-btn { background: var(--br-nav-accent-color, #238636); border: none; color: white; padding: 6px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; } .br-autosend-label { color: #8b949e; font-size: 12px; display: flex; align-items: center; gap: 6px; } .br-edit-view { padding: 15px; overflow-y: auto; } .br-header-mini { color: #E0F7FA; font-size: 14px; margin-bottom: 10px; font-weight: bold; text-align: center; } .br-warning-box { background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; color: #ffadad; padding: 8px; border-radius: 6px; font-size: 12px; margin-bottom: 10px; text-align: center; } .br-label { color: #8b949e; font-size: 11px; margin-bottom: 4px; margin-top: 8px; } .br-group-label { color: #58a6ff; font-size: 11px; font-weight: bold; margin-bottom: 4px; margin-top: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 2px; } .br-input { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #c9d1d9; padding: 8px; border-radius: 4px; box-sizing: border-box; font-size: 13px; } .br-textarea { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #c9d1d9; padding: 8px; border-radius: 4px; box-sizing: border-box; font-family: monospace; font-size: 13px; resize: none; } .br-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); } .br-settings-grid.cols-2 { grid-template-columns: 1fr 1fr; } .br-check-btn { color: #c9d1d9; font-size: 12px; display: flex; align-items: center; cursor: pointer; padding: 2px 0; } .br-check-btn input { margin-right: 6px; } .br-select { background: #0d1117; color: #c9d1d9; border: 1px solid rgba(255, 255, 255, 0.1); padding: 4px; border-radius: 4px; width: 100%; font-size: 11px; } .br-color-input-wrapper { grid-column: span 2; display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); color: #8b949e; font-size: 12px; } .br-color-input-wrapper input { background: none; border: none; height: 20px; width: 40px; cursor: pointer; } .br-edit-actions { display: flex; gap: 10px; margin-top: 15px; } .br-edit-actions button { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; } #cancel-edit { background: #21262d; color: #c9d1d9; } #save-edit { background: #1f6feb; color: white; transition: 0.2s; }`;
            document.head.appendChild(style);
        }
        function initBinder() {
            injectStyles();
            if (!document.getElementById(MODAL_ID)) {
                const modal = document.createElement('div'); modal.id = MODAL_ID;
                modal.innerHTML = `<div class="br-modal-box"><div style="padding:10px 15px; background:#161b22; border-bottom:1px solid #30363d; display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; color:#E0F7FA; font-size:14px;">📜 Шаблоны ответов</span><span style="cursor:pointer; padding:5px; font-size:16px; color:#8b949e;" onclick="document.getElementById('${MODAL_ID}').style.display='none'">✖</span></div><div id="br-modal-body-ice" style="display:flex; flex-direction:column; overflow:hidden; height: 100%;"></div></div>`;
                document.body.appendChild(modal);
                modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
            }
            const editorWrapper = document.querySelector('.js-quickReply .message-editorWrapper');
            if (editorWrapper && !document.getElementById(BTN_ID)) {
                const btn = document.createElement('div'); btn.id = BTN_ID; btn.innerHTML = '📜 Шаблоны ответов';
                btn.onclick = () => { const modal = document.getElementById(MODAL_ID); renderMainView(modal.querySelector('#br-modal-body-ice')); modal.style.display = 'flex'; };
            editorWrapper.insertBefore(btn, editorWrapper.firstChild);
        }
}
        initBinder();
    }
const PREVIEW_CACHE = new Map();
    const PREVIEW_PENDING = new Map();
    let activeFilter = null;
    let modalOverlay, modalContent, modalTitle, modalAvatar, modalDate;

    function createPreviewModal() {
        if (document.querySelector('.br-modal-overlay')) return;
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'br-modal-overlay';
        modalOverlay.innerHTML = `<div class="br-modal-window"><div class="br-modal-header"><img src="" class="br-modal-avatar"><div class="br-modal-meta"><div class="br-modal-title"></div><div class="br-modal-date"></div></div><div class="br-modal-close"><i class="fas fa-times"></i></div></div><div class="br-modal-content"></div></div>`;
        document.body.appendChild(modalOverlay);
        modalContent = modalOverlay.querySelector('.br-modal-content');
        modalTitle = modalOverlay.querySelector('.br-modal-title');
        modalAvatar = modalOverlay.querySelector('.br-modal-avatar');
        modalDate = modalOverlay.querySelector('.br-modal-date');
        const close = () => { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; };
        modalOverlay.querySelector('.br-modal-close').addEventListener('click', close);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) close(); });
        modalContent.addEventListener('click', (e) => {
            const btn = e.target.closest('.button--spoiler');
            if (btn) { e.preventDefault(); const container = btn.closest('.bbCodeSpoiler'); if (container) container.classList.toggle('spoiler-open'); }
        });
    }

    function fetchPreviewUrl(url) {
        if (PREVIEW_CACHE.has(url)) return Promise.resolve(PREVIEW_CACHE.get(url));
        if (PREVIEW_PENDING.has(url)) return PREVIEW_PENDING.get(url);
        const promise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const firstPost = doc.querySelector('.message-body .bbWrapper');
                    const avatar = doc.querySelector('.message-avatar img')?.src || '';
                    const date = doc.querySelector('.message-attribution-main time')?.textContent || '';
                    const data = { html: firstPost ? firstPost.innerHTML : 'Текст не найден', avatar: avatar, date: date };
                    PREVIEW_CACHE.set(url, data); PREVIEW_PENDING.delete(url); resolve(data);
                },
                onerror: () => { PREVIEW_PENDING.delete(url); reject(); }
            });
        });
        PREVIEW_PENDING.set(url, promise); return promise;
    }

    function loadThreadPreview(url, title) {
        modalTitle.textContent = title; modalDate.textContent = 'Загрузка...'; modalAvatar.style.display = 'none';
        modalContent.innerHTML = '<div class="br-spinner"></div>'; modalOverlay.classList.add('active'); document.body.style.overflow = 'hidden';
        fetchPreviewUrl(url).then(data => {
            if (modalOverlay.classList.contains('active')) {
                modalContent.innerHTML = data.html
                    .replace(/([A-Z][a-z]+_[A-Z][a-z]+)/g, '<span class="br-hl-nick">$1</span>')
                    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '<span class="br-hl-ip">$&</span>');
                modalContent.querySelectorAll('.js-reaction, .js-quickReply, .message-signature').forEach(el => el.remove());
                modalDate.textContent = data.date;
                if (data.avatar) { modalAvatar.src = data.avatar; modalAvatar.style.display = 'block'; }
            }
        }).catch(() => { modalContent.innerHTML = '<div style="text-align:center;color:#e74c3c">Ошибка сети</div>'; });
    }

function showSkeletonLoader() {
        if (document.getElementById('br-skeleton-layer')) return;

        const skeletonHTML = `
            <div class="br-sk-nav-bar br-shimmer"></div>
            <div class="br-sk-body">
                <div class="br-sk-main">
                    <div class="br-sk-block">
                        <div class="br-sk-block-header br-shimmer"></div>
                        ${Array(12).fill(0).map(() => `
                        <div class="br-sk-row">
                            <div class="br-sk-ava br-shimmer"></div>
                            <div class="br-sk-content">
                                <div class="br-sk-text w-60 br-shimmer"></div>
                                <div class="br-sk-text w-40 br-shimmer"></div>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>
                <div class="br-sk-sidebar">
                    <div class="br-sk-widget br-shimmer"></div>
                    <div class="br-sk-widget br-shimmer" style="height: 250px;"></div>
                </div>
            </div>
        `;

        const layer = document.createElement('div');
        layer.id = 'br-skeleton-layer';
        layer.innerHTML = skeletonHTML;
        document.documentElement.appendChild(layer);

        const removeSkeleton = () => {
            layer.classList.add('br-skeleton-fade-out');
            setTimeout(() => {
                if (layer.parentNode) layer.parentNode.removeChild(layer);
            }, 400);
        };

        if (document.readyState === 'complete') {
            removeSkeleton();
        } else {
            window.addEventListener('load', removeSkeleton);
            setTimeout(removeSkeleton, 2500);
        }
    }

    function setupGallery() {
        const images = document.querySelectorAll('.message-body img:not(.smilie):not([class*="attachment"]), .bbImage');
        if (images.length === 0) return;
        let overlay = document.getElementById('br-gallery-overlay');
        if (!overlay) {
            overlay = document.createElement('div'); overlay.id = 'br-gallery-overlay';
            overlay.innerHTML = `<div class="br-gallery-close">×</div><div class="br-gallery-content"><img src="" class="br-gallery-img"></div><div class="br-gallery-prev">‹</div><div class="br-gallery-next">›</div>`;
            overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;`;
            overlay.querySelector('.br-gallery-img').style.cssText = `max-width: 95%; max-height: 95vh; object-fit: contain; box-shadow: 0 0 20px rgba(0,0,0,0.5);`;
            const btnStyle = `position: absolute; color: white; font-size: 40px; cursor: pointer; padding: 20px; user-select: none; transition: 0.2s;`;
            overlay.querySelector('.br-gallery-close').style.cssText = `position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; cursor: pointer; z-index: 20001;`;
            overlay.querySelector('.br-gallery-prev').style.cssText = `${btnStyle} left: 20px;`;
            overlay.querySelector('.br-gallery-next').style.cssText = `${btnStyle} right: 20px;`;
            document.body.appendChild(overlay);
        }
        let currentIndex = 0; const galleryImgs = Array.from(images);
        const updateImage = () => { overlay.querySelector('.br-gallery-img').src = galleryImgs[currentIndex].src; };
        galleryImgs.forEach((img, index) => {
            img.style.cursor = 'zoom-in';
            img.onclick = (e) => { e.preventDefault(); currentIndex = index; updateImage(); overlay.style.display = 'flex'; setTimeout(() => overlay.style.opacity = '1', 10); };
        });
        overlay.querySelector('.br-gallery-close').onclick = () => { overlay.style.opacity = '0'; setTimeout(() => overlay.style.display = 'none', 300); };
        overlay.querySelector('.br-gallery-next').onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % galleryImgs.length; updateImage(); };
        overlay.querySelector('.br-gallery-prev').onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length; updateImage(); };
        overlay.onclick = (e) => { if(e.target === overlay || e.target.classList.contains('br-gallery-content')) overlay.querySelector('.br-gallery-close').click(); };
    }

    function runStatsAndPreview() {
        if (!currentSettings.enableSectionStats && !currentSettings.enableThreadPreview) return;
        if (!document.querySelector('.structItem')) return;

        createPreviewModal();

        if (currentSettings.enableSectionStats) {
            const container = document.querySelector('.p-body-pageContent');
            if (container && !document.querySelector('.br-stats-dashboard')) {
                let s = { imp:0, con:0, wai:0, ok:0, clo:0 };
                document.querySelectorAll('.structItem').forEach(item => {
                    const txt = (item.querySelector('.label')?.textContent || '').toLowerCase();
                    if (item.querySelector('.structItem-status--sticky')) s.imp++;
                    if (txt.includes('рассмотрен') || txt.includes('закреплено')) s.con++;
                    else if (txt.includes('ожидани') || txt.includes('техническ')) s.wai++;
                    else if (txt.includes('одобрено') || txt.includes('решено')) s.ok++;
                    else if (txt.includes('закрыто') || txt.includes('отказано') || txt.includes('рассмотрено')) s.clo++;
                });
                const pulseWai = s.wai > 0 ? 'pulse-alert' : '';
                const div = document.createElement('div'); div.className = 'br-stats-dashboard';
                div.innerHTML = `
                    <div class="br-stat-card s-wai ${pulseWai}" data-type="wai"><div class="br-stat-icon"><i class="fas fa-hourglass-half"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.wai}">0</div><div class="br-stat-lbl">Ожидание</div></div></div>
                    <div class="br-stat-card s-con" data-type="con"><div class="br-stat-icon"><i class="fas fa-user-edit"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.con}">0</div><div class="br-stat-lbl">На рассм.</div></div></div>
                    <div class="br-stat-card s-imp" data-type="imp"><div class="br-stat-icon"><i class="fas fa-thumbtack"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.imp}">0</div><div class="br-stat-lbl">Важно</div></div></div>
                    <div class="br-stat-card s-ok" data-type="ok"><div class="br-stat-icon"><i class="fas fa-check"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.ok}">0</div><div class="br-stat-lbl">Одобрено</div></div></div>
                    <div class="br-stat-card s-clo" data-type="clo"><div class="br-stat-icon"><i class="fas fa-lock"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.clo}">0</div><div class="br-stat-lbl">Закрыто</div></div></div>
                `;
                container.insertBefore(div, container.firstChild);

                const filterThreads = (type) => {
                    const cards = document.querySelectorAll('.br-stat-card');
                    const items = document.querySelectorAll('.structItem');
                    if (activeFilter === type) { activeFilter = null; cards.forEach(c => { c.classList.remove('active'); c.classList.remove('dimmed'); }); items.forEach(item => item.classList.remove('br-filtered-hide')); return; }
                    activeFilter = type;
                    cards.forEach(c => { if (c.dataset.type === type) { c.classList.add('active'); c.classList.remove('dimmed'); } else { c.classList.remove('active'); c.classList.add('dimmed'); } });
                    items.forEach(item => {
                        const txt = (item.querySelector('.label')?.textContent || '').toLowerCase();
                        const isLocked = item.querySelector('.structItem-status--locked');
                        const isSticky = item.querySelector('.structItem-status--sticky');
                        let match = false;
                        if (type === 'wai' && (txt.includes('ожидани') || txt.includes('техническ'))) match = true;
                        else if (type === 'con' && (txt.includes('рассмотрен') || txt.includes('закреплено'))) match = true;
                        else if (type === 'imp' && isSticky) match = true;
                        else if (type === 'ok' && (txt.includes('одобрено') || txt.includes('решено'))) match = true;
                        else if (type === 'clo' && (txt.includes('закрыто') || txt.includes('отказано') || isLocked)) match = true;
                        if (match) item.classList.remove('br-filtered-hide'); else item.classList.add('br-filtered-hide');
                    });
                };
                div.querySelectorAll('.br-stat-card').forEach(card => card.addEventListener('click', () => filterThreads(card.dataset.type)));
                div.querySelectorAll('.br-stat-val').forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'));
                    if (target > 0) {
                        let startTimestamp = null;
                        const step = (timestamp) => {
                            if (!startTimestamp) startTimestamp = timestamp;
                            const progress = Math.min((timestamp - startTimestamp) / 800, 1);
                            el.innerHTML = Math.floor(progress * target);
                            if (progress < 1) window.requestAnimationFrame(step);
                        };
                        window.requestAnimationFrame(step);
                    } else el.innerHTML = "0";
                });
            }
        }

        if (currentSettings.enableThreadPreview) {
            let st = document.getElementById('br-preview-styles');
            if (!st) {
                st = document.createElement('style');
                st.id = 'br-preview-styles';
                document.head.appendChild(st);
            }

            st.textContent = `
                .br-preview-btn {
                    float: right;
                    margin-left: 6px;
                    margin-right: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px; height: 24px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 6px;
                    color: var(--br-primary);
                    cursor: pointer;
                    border: 1px solid var(--br-primary);
                    box-shadow: 0 0 5px var(--br-primary);
                    font-size: 11px;
                    transition: all 0.2s;
                    position: relative;
                    z-index: 20;
                    pointer-events: auto;
                    touch-action: manipulation;
                }
                .br-preview-btn:hover, .br-preview-btn:active {
                    background: var(--br-primary);
                    color: #000;
                    transform: scale(1.1);
                    box-shadow: 0 0 15px var(--br-primary);
                }
            `;

            document.querySelectorAll('.structItem-title').forEach(title => {
                if (title.querySelector('.br-preview-btn')) return;

                let link = title.querySelector('a[data-tp-primary]');
                if (!link) link = title.querySelector('a:not(.labelLink):not(.label)');
                if (!link) return;

                const btn = document.createElement('div');
                btn.className = 'br-preview-btn';
                btn.innerHTML = '<i class="fas fa-eye"></i>';
                btn.title = 'Предпросмотр';

                const badge = title.querySelector('.br-neon-badge');

                if (badge) {
                    title.insertBefore(btn, badge);
                } else {
                    title.insertBefore(btn, link);
                }

                const prefetch = () => fetchPreviewUrl(link.href);
                btn.addEventListener('mouseenter', prefetch);

                const openModal = (e) => {
                    if (e.cancelable) e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    loadThreadPreview(link.href, link.textContent.trim());
                    return false;
                };

                btn.addEventListener('click', openModal);
                btn.addEventListener('touchend', openModal);
            });
        }
    }

           async function initialize() {
                try {

            const antiFouc = document.createElement('style');
            antiFouc.innerHTML = '';
            (document.head || document.documentElement).appendChild(antiFouc);

            injectStaticStyles();
            await loadSettings();

            if (currentSettings.enableSkeletonLoading) {
                showSkeletonLoader();
            }
            if (currentSettings.enableContextualBackgrounds && currentSettings.contextualBgUrl && window.location.href.toLowerCase().includes(currentSettings.contextualBgUrl.toLowerCase())) {
                const contextPresetName = currentSettings.contextualBgPreset;
                let contextPresetData = builtInPresets[contextPresetName] || currentSettings.customPresets[contextPresetName];
                if (contextPresetData) {
                    currentSettings = { ...currentSettings, ...contextPresetData };
                }
            }
            applyForumStyles(currentSettings);

            requestAnimationFrame(() => {
                if (antiFouc) {
                    antiFouc.innerHTML = 'html { opacity: 1 !important; visibility: visible !important; transition: opacity 0.4s ease !important; }';
                    setTimeout(() => antiFouc.remove(), 600);
                }
            });

            const onDomReady = async () => {
                const runModule = (fn) => {
                    try {
                        fn();
                    } catch (e) {
                        console.error(e);
                    }
                };
                runModule(() => {
                    document.addEventListener('mousemove', (e) => {
                        document.querySelectorAll('.br-spotlight').forEach(card => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            card.style.setProperty('--mouse-x', `${x}px`);
                            card.style.setProperty('--mouse-y', `${y}px`);
                        });
                    }, { passive: true });
                });
                runModule(createBackgroundElement);
                runModule(createPanelHTML);
                runModule(createBottomNavBarElement);
                runModule(createScrollIndicatorElement);
                runModule(findMyUsername);
                runModule(findThreadAuthor);
                runModule(() => updateBottomNavBarContent(currentSettings));
                runModule(() => manageVisualEffects(currentSettings));
                runModule(addSettingsIconHTML);
                runModule(setupBrWorker);
                if (currentSettings.enableBinder) {
                    runModule(runBinderModule);
                }
                if (settingsIcon && bottomNavElement) {
                    if (currentSettings.enableBottomNav) {
                        const utilsContainer = bottomNavElement.querySelector('.br-nav-utilities');
                        if (utilsContainer) {
                            utilsContainer.prepend(settingsIcon);
                        }
                    } else {
                        document.body.appendChild(settingsIcon);
                    }
                }
                runModule(() => {
                    handleScroll();
                    setupScrollObserver(currentSettings);
                    document.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
                });
                runModule(() => {
                    setupCopyHandler();
                    setupLikeAnimations();
                    runComplaintTracker();
                    startLiveForumPollers();
                    runStatsAndPreview();
                    setupGallery();

                    const runOdometer = () => {
                         const targets = document.querySelectorAll('.pairs dd, .p-navgroup-link--user .badge, .br-stat-val');
                         const observer = new IntersectionObserver((entries, obs) => {
                             entries.forEach(entry => {
                                 if (entry.isIntersecting) {
                                     const el = entry.target;
                                     if(el.dataset.odometerInit) return;

                                     const text = el.dataset.originalText || el.textContent;
                                     const value = parseInt(text.replace(/[^0-9]/g, ''));

                                     if(!isNaN(value) && value > 5) {
                                         el.dataset.odometerInit = 'true';
                                         const duration = 1500;
                                         const startTime = performance.now();
                                         const animate = (time) => {
                                             const timeFraction = (time - startTime) / duration;
                                             if (timeFraction > 1) {
                                                 el.textContent = text;
                                                 return;
                                             }
                                             const progress = 1 - Math.pow(1 - timeFraction, 4);
                                             el.textContent = Math.floor(progress * value).toLocaleString();
                                             requestAnimationFrame(animate);
                                         };
                                         requestAnimationFrame(animate);
                                     }
                                     obs.unobserve(el);
                                 }
                             });
                         }, { threshold: 0.1 });

                         targets.forEach(el => {
                             if(!el.dataset.odometerInit) {
                                 el.dataset.originalText = el.textContent;
                                 observer.observe(el);
                             }
                         });
                    };
                    runOdometer();

                    findAndAttachUploader();
                    domObserver = observeDOM(document.body, observeNewNodes);
                });
                const seenVersion = await GM_getValue('br_style_seen_version', '0.0.0');
                if (seenVersion !== SCRIPT_VERSION) {
                    showWelcomeScreen();
                    await GM_setValue('br_style_seen_version', SCRIPT_VERSION);
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onDomReady);
            } else {
                onDomReady();
            }
            GM_registerMenuCommand('🎨 Открыть настройки стиля Black Russia', togglePanel, 's');
        } catch (e) {
            console.error(e);
        }
    }

    (function() {
        const SIGNATURE = "S2luZ19SYW5nZXJz";
        const VERSION_HASH = "Mi4w";
        const CONFIG_CHECKSUM = 102;

        function validateSystem() {
            try {
                const scriptInfo = GM_info.script;
                if (scriptInfo.author !== atob(SIGNATURE)) {
                    return false;
                }
                if (scriptInfo.version !== atob(VERSION_HASH)) {
                    return false;
                }
                const currentSettingsCount = Object.keys(defaultSettings).length;
                if (currentSettingsCount !== CONFIG_CHECKSUM) {
                    return false;
                }
                return true;
            } catch (e) {
                return false;
            }
        }

        if (validateSystem()) {
            if (typeof initialize === 'function') {
                initialize();
            }
        } else {
            console.error("BR Style: Verification failed.");
            initialize = null;
            const alertBox = document.createElement('div');
            alertBox.style.cssText = "position:fixed;top:10px;right:10px;background:#333;color:red;padding:10px;z-index:99999;border:1px solid red;border-radius:5px;font-family:sans-serif;font-size:12px;";
            alertBox.innerHTML = "<b>BR Style Error:</b><br>Verification failed (Integrity/Version mismatch).";
            document.body.appendChild(alertBox);
        }
    })();
})()