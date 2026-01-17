// ==UserScript==
// @name         SOOP 리캡
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  끼리
// @author       헤슷
// @match        https://www.sooplive.co.kr/*
// @match        https://play.sooplive.co.kr/*
// @match        https://broadstatistic.sooplive.co.kr/*
// @connect      sooplive.co.kr
// @connect      sch.sooplive.co.kr
// @connect      res.sooplive.co.kr
// @connect      afevent2.sooplive.co.kr
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/562690/SOOP%20%EB%A6%AC%EC%BA%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/562690/SOOP%20%EB%A6%AC%EC%BA%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_BG = "https://i.ibb.co/Z6BXDfRH/20260112-235411-1.png";
    const SEARCH_API_URL = 'https://sch.sooplive.co.kr/api.php';
    const STATS_API_URL = 'https://broadstatistic.sooplive.co.kr/api/watch_statistic.php';
    const INFO_API_URL = 'https://afevent2.sooplive.co.kr/api/get_private_info.php';

    const TIER_SETS = {
        A: {
            "Challenger": "https://i.ibb.co/yB4SN6hD/A3s1-WNn-Bx55t-K-9w-BNz-We-IE5-Ywz-Ffbb-DVe-BI64-N6-R1-Le-Oad-OYCdn-Q2-XNBKgo-P9-Gdc2-LCQ0-Ul-ZKx-GUA5-Ekz-D.webp",
            "Grandmaster": "https://i.ibb.co/KzFyV8B8/o-M-0sr-E7-Viko4-Jq-Yw-R2-ncqc8-Jw-VIMk-Xwet2r-E87j-YF12d-Bp4-Zz-XVhvus-CGs-Rze-Ry-Osy-M4bh-HBHM2s-OXm8-O.webp",
            "Master": "https://i.ibb.co/V0kRfqNJ/SZPPC-Fh0zx-Q8-ZDLy-E-UW6gyoo-Tp-f-Dcdtg48hlzdktt-IGEa5a-X5fn-UIZph3bsrzcspez-Sgw9n-Df-MIcm2-Tv-Y6-rkq.webp",
            "Diamond": "https://i.ibb.co/twKGL32v/CQ5mlw-WS7-SGMx-I6i-Afr-US8p-NU99-EBp7r-u-Ve-Bgo-Bp-BM4-SWHRY9-Vbn02im-Rgeocb2-5h-Hx-Mg-ELkpcrzmt4n-Xi-C.webp",
            "Emerald": "https://i.ibb.co/KPV3z0C/r-SG5-O90-Kus-Py-No-Uzkw6-Qok0d-P-n-Tjud-ASd-Cq-Lvva-XSjw-C7-Im-Mpkw-Z0pi-NHg-Ska-I73ycua-CF0u9kgr-Bno-G.webp",
            "Platinum": "https://i.ibb.co/C5gz0n9D/9-YGk-Zi-X8j5ajb78-C1yo-IPJk-Eh63k3y-Itr-Gj-SL3dw2-Ld-Hygs-GDCi-S7x4-AADJx-JGa-QLj6-UPmxw-FT-RFHp-Egp0w.webp",
            "Gold": "https://i.ibb.co/Zpk9kHtH/r-K2-g-Iv-Fsqg-MKS0-YN9-Wc1-Bv-XSn2-Ekqg-YOl-Dg-VMob4e-Ea3-Qq63w4-QMNVpi-XTFw-WY3u-EBQi-Bv3-SEYEJ6-Ekqc8j-FO.webp",
            "Silver": "https://i.ibb.co/d4NZC5Yj/Bp3-QFKGm76-Vp-CQZYDx-IIey4-n-PZd59-Fr47st-N-Xa3-Mj-FNu-W1g-NGQb5-CKt-Logsth-TZDkf-Xa-Z7ji-AQTsi-W-xd-Cb.webp",
            "Bronze": "https://i.ibb.co/zWSJkYZn/KWb-D6-Au2kz-D5o-YWKewl-JGf3-Ubk-NUOb-Wqn-Tc-VHRE9q-Nu-NRQu-Ja-Bc-Xh1-BQ57pd-Fs1-Fgr-CLYDtnk-MGKLh4-Mre-Q.webp"
        },
        B: {
            "Challenger": "https://i.ibb.co/KjBPpW3S/Gemini-Generated-Image-10k0u10k0u10k0u1-Photoroom.png",
            "Grandmaster": "https://i.ibb.co/KxKfs7K1/Gemini-Generated-Image-2kynp02kynp02kyn-Photoroom.png",
            "Master": "https://i.ibb.co/9m5xzWC6/Gemini-Generated-Image-qcdnpwqcdnpwqcdn.png",
            "Diamond": "https://i.ibb.co/JRR0Fj5n/Gemini-Generated-Image-9pbvyv9pbvyv9pbv-Photoroom.png",
            "Emerald": "https://i.ibb.co/1fVrCqNh/Gemini-Generated-Image-9hca9u9hca9u9hca.png",
            "Platinum": "https://i.ibb.co/JjYg9w9Z/Gemini-Generated-Image-j5x4lzj5x4lzj5x4-Photoroom.png",
            "Gold": "https://i.ibb.co/0yV4qjWJ/Gemini-Generated-Image-nb4t0qnb4t0qnb4t-Photoroom.png",
            "Silver": "https://i.ibb.co/zVyDVJFW/Gemini-Generated-Image-c9d0dc9d0dc9d0dc-Photoroom.png",
            "Bronze": "https://i.ibb.co/b5wWcDWd/Gemini-Generated-Image-4sz0k04sz0k04sz0.png"
        }
    };

    let currentUserId = localStorage.getItem('soop_recap_user_id') || "";
    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth() + 1;
    let selectedTierType = localStorage.getItem('soop_recap_tier_type') || 'A';
    let weeklyChart = null;
    let rankChart = null;
    let originalStreamerNames = [];
    let latestRecapData = null;

    const parseHMSToSeconds = (t) => {
        if (!t || typeof t !== 'string') return 0;
        const p = t.split(':').map(Number);
        while (p.length < 3) p.unshift(0);
        return (p[0] * 3600) + (p[1] * 60) + p[2];
    };

    const getBase64Image = (url) => new Promise((resolve) => {
        if (!url) return resolve("");
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "arraybuffer",
            onload: (res) => {
                const blob = new Blob([res.response], {
                    type: res.responseHeaders.match(/content-type:\s*(\S+)/i)?.[1] || 'image/png'
                });
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            },
            onerror: () => resolve("https://res.sooplive.co.kr/images/common/thumb_profile.gif")
        });
    });

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&display=swap');

        #custom-recap-btn {
            position: fixed; z-index: 10000; padding: 16px 28px;
            background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
            color: white; border: none; border-radius: 15px; cursor: move;
            font-family: 'Pretendard'; font-weight: 800;
            box-shadow: 0 10px 30px rgba(0, 114, 255, 0.4);
            transition: opacity 0.3s, visibility 0.3s; user-select: none; touch-action: none;
        }
        #custom-recap-btn.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
        #recap-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5, 5, 10, 0.95); backdrop-filter: blur(25px);
            z-index: 100001; display: block; overflow-y: scroll !important;
            padding: 50px 0; box-sizing: border-box;
        }

        .settings-container { position: relative; }
        .tool-main-btn {
            background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);
            padding: 14px 24px; border-radius: 20px; font-weight: 800; cursor: pointer; font-size: 16px;
            display: flex; align-items: center; gap: 8px; transition: 0.2s;
        }
        .tool-main-btn:hover { background: rgba(255,255,255,0.2); }
        .settings-menu {
            position: absolute; bottom: 125%; left: 0;
            background: rgba(20, 20, 30, 0.95); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 18px; padding: 12px; display: none; flex-direction: column; gap: 8px;
            width: 220px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); backdrop-filter: blur(15px);
            z-index: 2000; animation: menu-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .settings-menu.active { display: flex; }
        .tool-item {
            background: transparent; border: none; color: #ccc; padding: 12px 15px;
            text-align: left; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px;
            display: flex; align-items: center; gap: 10px; transition: 0.2s; width: 100%; box-sizing: border-box;
        }
        .tool-item:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateX(5px); }
        @keyframes menu-pop { from { opacity: 0; transform: translateY(15px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .summary-overlay {
            position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.85); z-index: 100005;
            display: flex; align-items: center; justify-content: center;
            flex-direction: column; gap: 20px;
        }
        .id-card {
            width: 600px; height: 350px; background: #111; border-radius: 20px;
            position: relative; overflow: hidden; border: 2px solid var(--tier-color);
            box-shadow: 0 0 40px rgba(0,0,0,0.8), 0 0 10px var(--tier-color); font-family: 'Pretendard'; color: #fff;
        }
        .id-card-bg {
            position: absolute; top:0; left:0; width:100%; height:100%;
            background-size: cover; background-position: center; opacity: 0.25; filter: grayscale(0.5);
        }
        .id-card-content {
            position: absolute; top:0; left:0; width:100%; height:100%;
            padding: 30px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;
        }
        .id-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
        .id-title { font-family: 'Chakra Petch'; font-size: 24px; font-weight: 700; color: var(--tier-color); letter-spacing: 2px; }
        .id-date { font-size: 16px; font-weight: 600; color: #888; }
        .id-body { display: flex; gap: 30px; align-items: center; flex: 1; }
        .id-tier-icon { width: 120px; height: 120px; object-fit: contain; filter: drop-shadow(0 0 10px var(--tier-color)); }
        .id-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
        .id-info-item { background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 10px; border-left: 3px solid var(--tier-color); }
        .id-label { font-size: 12px; color: #aaa; margin-bottom: 4px; }
        .id-val { font-size: 18px; font-weight: 800; }
        .id-footer { display: flex; justify-content: space-between; align-items: flex-end; }
        .id-user { font-size: 28px; font-weight: 900; }
        .id-most { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.5); padding: 8px 15px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.2); }
        .id-most img { width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--tier-color); }
        .id-most span { font-size: 14px; font-weight: 700; color: #eee; }
        .scan-line {
            position: absolute; top:0; left:0; width:100%; height:10px;
            background: linear-gradient(to bottom, transparent, var(--tier-color), transparent);
            opacity: 0.3; animation: scan 3s linear infinite;
        }
        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }

        @keyframes text-glitch {
            0% { text-shadow: 5px 0 var(--tier-color), -2px 0 #ffffff; }
            25% { text-shadow: -5px 0 var(--tier-color), 2px 0 #ffffff; }
            50% { text-shadow: 5px 0 var(--tier-color), -2px 0 #ffffff; }
            100% { text-shadow: 0 0 10px var(--tier-color); }
        }
        #mmr-val:hover { animation: text-glitch 1s cubic-bezier(.25, .46, .45, .94) both infinite; }
        .stat-card::before {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            border: 2px solid transparent; border-radius: 32px;
            background: linear-gradient(90deg, var(--tier-color), transparent, var(--tier-color)) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out; mask-composite: exclude;
            background-size: 200% auto; animation: border-flow 4s linear infinite; opacity: 0.3;
        }
        @keyframes border-flow { to { background-position: 200% center; } }
        .recap-window {
            background: #0a0a0f; color: #fff; width: 1200px !important;
            border-radius: 45px; margin: 0 auto; position: relative;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 50px 150px rgba(0,0,0,0.8);
            height: auto !important; min-height: 1000px;
            font-family: 'Pretendard'; overflow: visible;
        }
        .close-btn { transition: all 0.3s ease; }
        .close-btn:hover { transform: rotate(90deg) scale(1.1); background: var(--tier-color); color: #000; }
        .recap-header-section {
            background-repeat: no-repeat !important; background-position: center center !important; background-size: cover !important;
            border-radius: 45px 45px 0 0; overflow: hidden; position: relative;
        }
        .header-glass-inner {
            background: linear-gradient(to bottom, rgba(10, 10, 20, 0.6) 0%, rgba(10, 10, 20, 0.8) 70%, #0a0a0f 100%);
            padding: 60px 60px 50px 60px; position: relative;
        }
        .recap-body-section { background: #0a0a0f; padding: 20px 60px 180px 60px; border-radius: 0 0 45px 45px; position: relative; }
        .ai-insult-box {
            background: linear-gradient(90deg, rgba(0, 198, 255, 0.1), rgba(0, 255, 178, 0.1));
            border-left: 5px solid #00ffb2; padding: 20px 30px; border-radius: 20px; margin-bottom: 40px;
            font-size: 20px; font-weight: 800; color: #e0f9ff; line-height: 1.6; display: flex; align-items: center; gap: 15px;
            height: auto !important; min-height: 80px; white-space: pre-wrap; word-break: keep-all; overflow: visible;
        }
        #particle-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .tier-header {
            display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; padding: 20px 45px;
            background: rgba(255,255,255,0.03); border-radius: 35px; border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px);
        }
        .tier-visual { display: flex; align-items: center; gap: 15px; }
        .tier-img-box { width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; position: relative; }
        .tier-img-icon {
            width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px var(--tier-color));
            transform: scale(1.2); animation: tier-float 3s ease-in-out infinite; transition: transform 0.2s;
        }
        .tier-img-icon.is-challenger { animation: challenger-float 3s ease-in-out infinite; }
        @keyframes tier-float { 0%, 100% { transform: scale(1.2) translateY(0); } 50% { transform: scale(1.25) translateY(-10px); } }
        @keyframes challenger-float { 0%, 100% { transform: scale(1.45) translateY(0); } 50% { transform: scale(1.55) translateY(-15px); } }
        .tier-name {
            font-size: 58px; font-weight: 900; color: var(--tier-color); text-transform: uppercase;
            letter-spacing: -2px; text-shadow: 0 0 20px var(--tier-color);
        }
        .cafe-link-btn {
            background-image: url('https://i.ibb.co/DDCy7PW3/1.jpg'); background-size: cover; background-position: center;
            color: #fff; border: 2px solid rgba(255,255,255,0.2); padding: 16px 30px; border-radius: 22px;
            font-size: 18px; font-weight: 900; cursor: pointer; text-decoration: none; display: inline-flex;
            align-items: center; justify-content: center; transition: transform 0.2s, filter 0.2s;
            font-family: 'Pretendard'; position: relative; overflow: hidden; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .month-selector-area { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; align-items: center; }
        .recap-select {
            background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff;
            padding: 10px 25px; border-radius: 12px; font-size: 18px; font-weight: 800; cursor: pointer; outline: none;
        }
        .badge-container { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-bottom: 50px; min-height: 60px; }
        .badge-item {
            background: rgba(255,255,255,0.1); padding: 0 26px; height: 48px; border-radius: 16px;
            font-size: 16px; font-weight: 800; color: #ffd700; border: 1.5px solid rgba(255,215,0,0.2);
            display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; transition: 0.3s;
        }
        .badge-item:hover { transform: translateY(-5px); background: rgba(255,215,0,0.15); border-color: #ffd700; }
        .custom-tooltip {
            position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%);
            background: rgba(20, 20, 30, 0.95); color: #fff; padding: 12px 18px; border-radius: 12px;
            font-size: 13px; font-weight: 600; white-space: nowrap; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1); pointer-events: none; opacity: 0; transition: 0.3s; visibility: hidden;
        }
        .badge-item:hover .custom-tooltip { opacity: 1; visibility: visible; bottom: 115%; }
        .top-rank-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
        .stat-card {
            background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 32px;
            border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 15px;
            box-sizing: border-box; backdrop-filter: blur(5px); transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .rank-img { width: 80px; height: 80px; border-radius: 22px; border: 3px solid #00c6ff; object-fit: cover; }
        .stat-card.folded { background: rgba(0, 0, 0, 0.8) !important; border: 1px dashed rgba(255, 255, 255, 0.2); }
        .stat-card.folded > *:not(.fold-toggle) { visibility: hidden !important; opacity: 0 !important; }
        .stat-card.folded::after { content: "SECRET"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; color: #333; font-size: 14px; letter-spacing: 2px; }
        .fold-toggle {
            position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.1); border: none;
            color: #fff; border-radius: 5px; font-size: 10px; padding: 2px 6px; cursor: pointer; z-index: 20; font-weight: 800;
        }
        .main-layout { display: grid !important; grid-template-columns: 480px 1fr !important; gap: 40px !important; align-items: start; }
        .section-box {
            background: rgba(255, 255, 255, 0.02); padding: 45px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.06);
            box-sizing: border-box; height: auto !important; display: flex; flex-direction: column;
        }
        .cal-header-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; text-align: center; margin-bottom: 15px; font-size: 14px; font-weight: 900; color: #666; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; width: 100%; }
        .cal-day {
            aspect-ratio: 1/1; border-radius: 14px; display: flex; align-items: center; justify-content: center;
            font-size: 16px; font-weight: 800; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.08);
        }
        .cal-active { background: linear-gradient(135deg, #00c6ff, #0072ff); color: #fff !important; box-shadow: 0 8px 20px rgba(0, 114, 255, 0.4); }
        .category-rank-area { margin-top: 80px; }
        .category-rank-list { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
        .category-item {
            background: rgba(255,255,255,0.05); padding: 10px 18px; border-radius: 18px;
            display: flex; align-items: center; gap: 15px; border: 1px solid rgba(255,255,255,0.1);
        }
        .cat-num { font-weight: 900; color: #00c6ff; width: 20px; font-size: 16px; }
        .cat-img-box { width: 30px; height: 30px; border-radius: 6px; background: #333; overflow: hidden; }
        .cat-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .cat-name-box { font-weight: 700; flex: 1; color: #ddd; font-size: 15px; }
        .cat-cnt-box { background: rgba(0, 114, 255, 0.3); color: #fff; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }
        .tools-area {
            position: absolute; bottom: 50px; left: 60px; right: 60px; display: flex; justify-content: space-between;
            align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 35px;
        }
        .modern-upload-label {
            display: flex; align-items: center; gap: 12px; padding: 14px 28px; border-radius: 20px;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); cursor: pointer; color: #eee; font-weight: 800; font-size: 16px;
        }
        .screenshot-btn { background: #fff; color: #000; border: none; padding: 16px 50px; border-radius: 22px; font-size: 18px; font-weight: 900; cursor: pointer; }
        #bg-file-input { display: none; }
        .close-btn {
            position: absolute; top: 40px; right: 40px; background: rgba(255,255,255,0.2); border: none;
            color: #fff; width: 55px; height: 55px; border-radius: 50%; cursor: pointer; font-size: 24px; z-index: 1000;
        }
        #mmr-diff { font-size: 16px; margin-top: 5px; font-weight: 800; }
        .diff-up { color: #ff4e4e; } .diff-down { color: #005eff; }
        .loading-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8);
            border-radius: 45px; display: none; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; z-index: 100;
        }
        .stat-card:first-child { cursor: pointer; position: relative; }
        .stat-card:first-child:hover { transform: scale(1.05) translateY(-5px); border-color: var(--tier-color); box-shadow: 0 0 20px var(--tier-color); }
        #celebration-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100010; overflow: hidden; }
        .giant-photo-pop {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; height: 500px;
            border-radius: 50%; border: 10px solid var(--tier-color); box-shadow: 0 0 100px var(--tier-color);
            object-fit: cover; z-index: 100011; animation: photo-burst 3s forwards ease-in-out; pointer-events: none;
        }
        @keyframes photo-burst {
            0% { opacity: 0; transform: translate(-50%, -40%) scale(0.3); filter: brightness(2) blur(10px); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); filter: brightness(1) blur(0px); }
            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0px); }
            100% { opacity: 0; transform: translate(-50%, -55%) scale(1.3); filter: blur(30px); }
        }
        .impact-shake { animation: impact-shake 0.5s ease-in-out; }
        @keyframes impact-shake {
            0%, 100% { transform: translate(0,0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-10px, 5px); }
            20%, 40%, 60%, 80% { transform: translate(10px, -5px); }
        }
        .reveal-item { opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal-active { opacity: 1; transform: translateY(0); }
        .layout-item { margin-bottom: 40px; position: relative; }
        .layout-item:last-child { margin-bottom: 0; }
    `);

    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };

    const applyTiltEffect = (el) => {
        el.onmousemove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const dx = (x - xc) / 10;
            const dy = (y - yc) / 10;
            el.style.transform = `perspective(500px) rotateX(${-dy}deg) rotateY(${dx}deg) scale(1.05)`;
        };
        el.onmouseleave = () => {
            el.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`;
        };
    };

    const getBadges = (s) => {
        const b = [];
        if (s.totalHours >= 500) b.push({ name: "🌌 SOOP의 신", desc: "한 달에 500시간 이상 시청한 초고수" });
        else if (s.totalHours >= 300) b.push({ name: "👑 SOOP 성주", desc: "한 달에 300시간 이상 꾸준히 시청" });
        else if (s.totalHours >= 150) b.push({ name: "💎 숲의 지배자", desc: "한 달에 150시간 이상 즐겨봄" });
        else if (s.totalHours >= 80) b.push({ name: "🥇 프로 시청러", desc: "한 달에 80시간 이상 시청" });
        else if (s.totalHours >= 30) b.push({ name: "🥉 루키 시청자", desc: "한 달에 30시간 이상 시청" });
        else b.push({ name: "🌱 새싹 와쳐", desc: "가볍게 즐기는 시청자" });

        if (s.activeDays >= 30) b.push({ name: "🛡️ 전설의 수호자", desc: "한 달 내내 매일 접속" });
        else if (s.activeDays >= 25) b.push({ name: "📅 개근의 신", desc: "한 달 중 25일 이상 접속" });
        else if (s.activeDays >= 15) b.push({ name: "🏃 성실한 발걸음", desc: "한 달 중 15일 이상 접속" });

        if (s.dawnRatio > 0.5) b.push({ name: "🦇 심야의 박쥐", desc: "시청의 절반 이상이 새벽 시간" });
        else if (s.dawnRatio > 0.2) b.push({ name: "🌙 올빼미 수호자", desc: "새벽에 자주 시청" });

        if (s.vodRatio > 2.0) b.push({ name: "🍿 VOD 광인", desc: "라이브보다 다시보기를 훨씬 더 많이 봄" });
        else if (s.totalHours > 20 && s.vodRatio < 0.1) b.push({ name: "📡 생방 사수단", desc: "다시보기보다 실시간 소통을 사랑함" });

        if (s.top1Ratio > 0.6) b.push({ name: "🧡 일편단심", desc: "한 스트리머만 집중해서 시청" });
        if (s.bjCount >= 25) b.push({ name: "🌍 박애주의자", desc: "여러 스트리머를 골고루 시청" });
        if (s.weekendRatio > 0.3) b.push({ name: "🔥 주말의 전사", desc: "주말에 몰아서 시청하는 스타일" });
        return b;
    };

   const getHealingMessage = (s) => {
        const h = Math.floor(s.totalHours || 0);
        const d = s.activeDays || 0;
        const dawn = s.dawnRatio || 0;
        const top1 = s.top1Ratio || 0;
        const weekend = s.weekendRatio || 0;
        const vod = s.vodRatio || 0;
        const count = s.bjCount || 0;


        const p1Candidates = [];

        if (h >= 400) p1Candidates.push("🌌 숲의 역사를 써내려가는 전설님!");
        if (d >= 28) p1Candidates.push("🌲 한결같이 자리를 지키는 숲의 수호신!");
        if (dawn >= 0.55) p1Candidates.push("🦉 달빛 아래 깨어있는 감성 올빼미님!");
        if (weekend >= 0.45 && h >= 30) p1Candidates.push("🎢 황금 같은 주말을 불태운 열정파님!");
        if (vod >= 2.0 && h >= 20) p1Candidates.push("📼 시간을 지배하는 다시보기의 장인님!");
        if (top1 >= 0.8 && h >= 50) p1Candidates.push("🌻 한 곳만 바라보는 해바라기 같은 분!");
        if (h >= 150) p1Candidates.push("🔥 식지 않는 열정을 가진 프로 시청러님!");
        if (count >= 50) p1Candidates.push("🌍 넓은 세상을 탐험하는 호기심 대장님!");


        if (p1Candidates.length === 0) {
            if (h <= 5) p1Candidates.push("🌱 이제 막 싹을 틔운 귀여운 새싹님!");
            else p1Candidates.push("🍀 반가운 숲의 여행자님!");
        }


        const p1 = p1Candidates[Math.floor(Math.random() * p1Candidates.length)];



        const p2Candidates = [];

        if (top1 >= 0.75) {
             const lovePercent = Math.floor(top1 * 100);
             p2Candidates.push(` 가장 사랑하는 방송과 보낸 ${lovePercent}%의 시간이 빛나고 있어요.`);
             if (lovePercent >= 90) p2Candidates.push(` 최애를 향한 ${lovePercent}%의 순애보가 정말 눈부시네요.`);
        }
        if (dawn >= 0.4) {
            p2Candidates.push(` 모두가 잠든 새벽, 당신이 피워낸 이야기들이 참 소중해요.`);
            p2Candidates.push(` 남들이 모르는 새벽의 숲을 지켜주셔서 고마워요.`);
        }
        if (weekend >= 0.4) {
            p2Candidates.push(` 평일의 피로를 주말의 SOOP으로 말끔히 씻어내셨군요.`);
            p2Candidates.push(` 황금 같은 휴일을 SOOP과 함께해주셔서 영광이에요.`);
        }
        if (vod >= 1.5 && h >= 10) {
            p2Candidates.push(` 놓친 순간까지 꼼꼼히 챙겨보는 섬세함이 돋보입니다.`);
        }
        if (count >= 30) {
            p2Candidates.push(` 무려 ${count}명의 방송을 넘나든 당신은 진정한 마당발!`);
        }
        if (d >= 25) {
            p2Candidates.push(` 한 달 내내 숲을 지켜준 당신의 성실함은 정말 최고예요.`);
            p2Candidates.push(` 꾸준함이라는 가장 강력한 무기를 가지셨군요.`);
        }
        if (h >= 100) {
            p2Candidates.push(` 이번 달 쌓아올린 ${h}시간의 추억은 무엇과도 바꿀 수 없죠.`);
        }

        if (p2Candidates.length === 0) {
            p2Candidates.push(` 바쁜 일상 속에서도 잊지 않고 찾아와주셔서 기뻐요.`);
            p2Candidates.push(` 당신이 머문 자리마다 즐거움이 피어났길 바라요.`);
        }

        const p2 = p2Candidates[Math.floor(Math.random() * p2Candidates.length)];


        const endings = [
            " 고마워요, 다음 달에도 함께해요!",
            " 당신의 즐거움이 계속되길 응원해요!",
            " 앞으로도 숲에서 좋은 추억 많이 만드세요!",
            " 푹 쉬시고, 내일도 행복하세요!",
            " 당신의 하루하루가 숲처럼 푸르길!"
        ];
        const p3 = endings[Math.floor(Math.random() * endings.length)];

        return `${p1}${p2}${p3}`;
    };
    const getTier = (score) => {
        const tierSet = TIER_SETS[selectedTierType] || TIER_SETS.A;
        if (score >= 7000) return { name: "Challenger", color: "#FFD700", icon: tierSet["Challenger"] };
        if (score >= 4500) return { name: "Grandmaster", color: "#ff4e4e", icon: tierSet["Grandmaster"] };
        if (score >= 3500) return { name: "Master", color: "#be8bff", icon: tierSet["Master"] };
        if (score >= 1500) return { name: "Diamond", color: "#57d5ff", icon: tierSet["Diamond"] };
        if (score >= 900) return { name: "Emerald", color: "#2ecc71", icon: tierSet["Emerald"] };
        if (score >= 500) return { name: "Platinum", color: "#3498db", icon: tierSet["Platinum"] };
        if (score >= 300) return { name: "Gold", color: "#f1c40f", icon: tierSet["Gold"] };
        if (score >= 150) return { name: "Silver", color: "#bdc3c7", icon: tierSet["Silver"] };
        return { name: "Bronze", color: "#cd7f32", icon: tierSet["Bronze"] };
    };

    const fetchRawData = (id, start, end, mod) => new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: STATS_API_URL,
            data: new URLSearchParams({
                szModule: mod, szMethod: 'watch', szStartDate: start, szEndDate: end, nPage: 1, szId: id
            }).toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                try {
                    resolve(JSON.parse(res.responseText).data || null);
                } catch {
                    resolve(null);
                }
            },
            onerror: () => resolve(null)
        });
    });

    function launchHolyCelebration(tierColor) {
        const win = document.querySelector('.recap-window');
        if (win) {
            win.classList.remove('impact-shake');
            void win.offsetWidth;
            win.classList.add('impact-shake');
        }
        let container = document.getElementById('celebration-overlay') || document.createElement('div');
        container.id = 'celebration-overlay';
        document.body.appendChild(container);
        const canvas = document.createElement('canvas');
        canvas.id = 'celebration-canvas';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = [];
        const colors = [tierColor, '#ffffff', '#ffd700', '#ff00ff', '#00ffff', '#00ff00'];
        for (let i = 0; i < 400; i++) {
            particles.push({
                x: window.innerWidth / 2, y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 50, vy: (Math.random() - 0.5) * 50,
                size: Math.random() * 6 + 2, color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0, decay: Math.random() * 0.008 + 0.005, gravity: 0.22
            });
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.vx *= 0.97; p.vy *= 0.97; p.vy += p.gravity;
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                if (p.life <= 0) particles.splice(i, 1);
            });
            if (particles.length > 0) requestAnimationFrame(animate);
            else { canvas.remove(); container.remove(); }
        }
        animate();
    }

    const updateRecapData = async () => {
        const loading = document.getElementById('loading-recap');
        if (loading) loading.style.display = 'flex';
        try {
            const start = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`,
                  end = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${new Date(selectedYear, selectedMonth, 0).getDate()}`;
            const prevMonthDate = new Date(selectedYear, selectedMonth - 2, 1);
            const pStart = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-01`,
                  pEnd = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0).getDate()}`;

            const [liveD, vodD, pLiveD, pVodD, liveC] = await Promise.all([
                fetchRawData(currentUserId, start, end, 'UserLiveWatchTimeData'),
                fetchRawData(currentUserId, start, end, 'UserVodWatchTimeData'),
                fetchRawData(currentUserId, pStart, pEnd, 'UserLiveWatchTimeData'),
                fetchRawData(currentUserId, pStart, pEnd, 'UserVodWatchTimeData'),
                fetchRawData(currentUserId, start, end, 'UserLiveSearchKeywordData').catch(() => ({}))
            ]);

            const processStats = (data) => {
                let sec = 0, days = new Set(), streamers = new Set(), dawnSec = 0, weekendSec = 0;
                if (data?.table1?.data) data.table1.data.forEach(r => {
                    const s = parseHMSToSeconds(r.total_watch_time);
                    if (s > 0) {
                        sec += s; days.add(r.day);
                        const dayOfWeek = new Date(r.day).getDay();
                        if (dayOfWeek === 0 || dayOfWeek === 6) weekendSec += s;
                    }
                });
                const stack = data?.chart?.data_stack || data?.chart?.data_stack_vod || data?.chart?.vod_data_stack || [];
                stack.forEach(s => {
                    if (s.bj_nick && s.bj_nick !== '기타') streamers.add(s.bj_nick);
                    if (s.data) s.data.forEach((v, i) => { if (i >= 1 && i <= 6) dawnSec += v; });
                });
                return { sec, days, streamers, dawnSec, weekendSec };
            };

            const curL = processStats(liveD), curV = processStats(vodD),
                  preL = processStats(pLiveD), preV = processStats(pVodD);
            const totalSec = curL.sec + curV.sec, totalHours = totalSec / 3600;
            const activeDays = new Set([...curL.days, ...curV.days]);
            const streamers = new Set([...curL.streamers, ...curV.streamers]);
            const MMR = Math.floor((totalHours * 12) + (activeDays.size * 60) + (streamers.size * 15));
            const prevMMR = Math.floor(((preL.sec + preV.sec) / 3600 * 12) + (new Set([...preL.days, ...preV.days]).size * 60) + (new Set([...preL.streamers, ...preV.streamers]).size * 15));
            const mmrDiff = MMR - prevMMR;

            const streamerMap = new Map();
            [...(liveD?.chart?.data_stack || []), ...(vodD?.chart?.data_stack_vod || [])].forEach(s => {
                if (s.bj_nick && s.bj_nick !== '기타') streamerMap.set(s.bj_nick, (streamerMap.get(s.bj_nick) || 0) + (s.data || []).reduce((a, b) => a + b, 0));
            });
            const streamerList = Array.from(streamerMap.entries()).map(([nick, total]) => ({ nick, total })).sort((a, b) => b.total - a.total);
            originalStreamerNames = streamerList.map(s => s.nick);

            const badgeStats = {
                totalHours, activeDays: activeDays.size,
                dawnRatio: totalSec > 0 ? (curL.dawnSec + curV.dawnSec) / totalSec : 0,
                vodRatio: curL.sec > 0 ? (curV.sec / curL.sec) : 0, bjCount: streamers.size,
                top1Ratio: totalSec > 0 && streamerList.length > 0 ? (streamerList[0].total / totalSec) : 0,
                weekendRatio: totalSec > 0 ? (curL.weekendSec + curV.weekendSec) / totalSec : 0
            };

            const win = document.querySelector('.recap-window');
            const tier = getTier(MMR);
            win.style.setProperty('--tier-color', tier.color);

            const getLogo = (n) => new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `${SEARCH_API_URL}?m=searchHistory&service=list&d=${encodeURIComponent(n)}`, onload: (res) => { try { const d = JSON.parse(res.responseText); r(d?.suggest_bj?.find(s => s.user_nick === n)?.station_logo || ""); } catch { r(""); } } }));
            const topBjName = streamerList[0]?.nick || '-';
            const topBjRaw = await getLogo(topBjName);
            const top2BjRaw = await getLogo(streamerList[1]?.nick);

            latestRecapData = {
                tier, totalHours, activeDays: activeDays.size,
                topBjName, topBjImg: topBjRaw || "https://res.sooplive.co.kr/images/common/thumb_profile.gif",
                currentUserId, selectedYear, selectedMonth
            };

            if (weeklyChart) {
                const wd = new Array(7).fill(0);
                [...(liveD?.table1?.data || []), ...(vodD?.table1?.data || [])].forEach(r => { if (r.day) wd[new Date(r.day).getDay()] += parseHMSToSeconds(r.total_watch_time) / 3600; });
                weeklyChart.data.datasets[0].data = wd.map(v => v.toFixed(1));
                weeklyChart.data.datasets[0].backgroundColor = tier.color;
                weeklyChart.data.datasets[0].shadowColor = tier.color;
                weeklyChart.update();
            }
            if (rankChart) {
                rankChart.data.labels = [...originalStreamerNames];
                rankChart.data.datasets[0].data = streamerList.map(s => (s.total / 3600).toFixed(1));
                rankChart.data.datasets[0].backgroundColor = tier.color;
                rankChart.data.datasets[0].shadowColor = tier.color;
                rankChart.canvas.parentNode.style.height = `${Math.max(400, streamerList.length * 40)}px`;
                rankChart.update();
            }

            win.querySelector('.tier-visual').innerHTML = `<div class="tier-img-box"><img src="${tier.icon}" class="tier-img-icon ${tier.name === 'Challenger' ? 'is-challenger' : ''}"></div><div class="tier-name">${tier.name}</div>`;
            animateValue(win.querySelector('#mmr-val'), 0, MMR, 1500);

            const typeWriter = (el, text) => {
                el.innerText = ''; let i = 0;
                const typing = () => { if (i < text.length) { el.innerText += text.charAt(i); i++; setTimeout(typing, 20); } };
                typing();
            };
            win.querySelector('#mmr-diff').innerText = `${mmrDiff >= 0 ? '▲' : '▼'} ${Math.abs(mmrDiff).toLocaleString()}`;
            win.querySelector('#mmr-diff').className = mmrDiff >= 0 ? 'diff-up' : 'diff-down';
            win.querySelector('.badge-container').innerHTML = getBadges(badgeStats).map(b => `<div class="badge-item reveal-item">${b.name}<div class="custom-tooltip">${b.desc || ''}</div></div>`).join('');
            const insultEl = win.querySelector('#ai-insult');
            const message = getHealingMessage(badgeStats);
            typeWriter(insultEl, message);

            const cards = win.querySelectorAll('.stat-card');
            [0, 1].forEach(idx => {
                const bjName = streamerList[idx]?.nick || '-';
                let bjImg = (idx === 0 ? topBjRaw : top2BjRaw) || 'https://res.sooplive.co.kr/images/common/thumb_profile.gif';

                cards[idx].innerHTML = `<button class="fold-toggle">FOLD</button><img src="${bjImg}" class="rank-img" id="rank-img-${idx}"><div><div style="font-size:13px; color:#888;">MOST ${idx + 1}</div><div style="font-weight:900;">${bjName}</div></div>`;

                if (bjImg && !bjImg.startsWith('data:')) {
                    getBase64Image(bjImg).then(base64 => {
                        if (base64) {
                            const imgEl = document.getElementById(`rank-img-${idx}`);
                            if (imgEl) imgEl.src = base64;
                            if (idx === 0) latestRecapData.topBjImg = base64;
                        }
                    });
                }

                const btn = cards[idx].querySelector('.fold-toggle');
                btn.onclick = (e) => { e.stopPropagation(); cards[idx].classList.toggle('folded'); btn.innerText = cards[idx].classList.contains('folded') ? "OPEN" : "FOLD"; };
                if (idx === 0 && bjName !== '-') {
                    cards[0].onclick = () => {
                        if (cards[0].classList.contains('folded')) return;
                        const giantImg = document.createElement('img'); giantImg.src = document.getElementById(`rank-img-0`).src; giantImg.className = 'giant-photo-pop'; giantImg.style.setProperty('--tier-color', tier.color); document.body.appendChild(giantImg);
                        setTimeout(() => giantImg.remove(), 3000); launchHolyCelebration(tier.color);
                    };
                }
            });

            cards[2].innerHTML = `<div><div style="display:flex; gap:15px;"><div><div style="font-size:11px; color:#00c6ff;">LIVE</div><div style="font-size:20px; font-weight:900;">${(curL.sec / 3600).toFixed(1)}h</div></div><div><div style="font-size:11px; color:#bb8bff;">VOD</div><div style="font-size:20px; font-weight:900;">${(curV.sec / 3600).toFixed(1)}h</div></div></div></div>`;
            cards[3].innerHTML = `<div><div style="font-size:13px; color:#888;">ATTENDANCE</div><div style="font-size:32px; font-weight:900; color:#ffd700;">${activeDays.size}일</div></div>`;

            const catMap = new Map();
            (liveC?.table2?.data || []).forEach(item => { if (item?.skey) catMap.set(item.skey, (catMap.get(item.skey) || 0) + parseInt(item.cnt || 0)); });
            const sortedCategories = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 7);
            const catContainer = document.getElementById('category-ranking-list');
            catContainer.innerHTML = sortedCategories.map((c, i) => `<div class="category-item"><div class="cat-num">${i + 1}</div><div class="cat-img-box"><img id="cat-img-load-${i}" src="" style="display:none;"></div><div class="cat-name-box">${c[0]}</div><div class="cat-cnt-box">${c[1]}회</div></div>`).join('');

            (async () => {
                const categoryData = await new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `${SEARCH_API_URL}?m=categoryList&szOrder=prefer&nListCnt=100`, onload: res => { try { r(JSON.parse(res.responseText)); } catch { r({}); } } }));
                const list = categoryData?.data?.list || [];
                for (let i = 0; i < sortedCategories.length; i++) {
                    const found = list.find(item => item.category_name === sortedCategories[i][0]);
                    let imgUrl = found?.cate_img || (found?.cate_no ? `https://res.sooplive.co.kr/images/category/${found.cate_no}.jpg` : "");
                    if (imgUrl) {
                        const imgEl = document.getElementById(`cat-img-load-${i}`);
                        if (imgEl) {
                            imgEl.src = imgUrl;
                            imgEl.style.display = 'block';
                            getBase64Image(imgUrl).then(base64 => { if(base64) imgEl.src = base64; });
                        }
                    }
                }
            })();

            const calGrid = win.querySelector('.calendar-grid');
            let h_cal = '';
            for (let i = 0; i < new Date(selectedYear, selectedMonth - 1, 1).getDay(); i++) h_cal += '<div class="cal-day" style="visibility:hidden;"></div>';
            for (let d = 1; d <= new Date(selectedYear, selectedMonth, 0).getDate(); d++) h_cal += `<div class="cal-day ${activeDays.has(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`) ? 'cal-active' : ''}">${d}</div>`;
            calGrid.innerHTML = h_cal;

            setTimeout(() => {
                const revealItems = win.querySelectorAll('.layout-item, .stat-card, .reveal-item');
                revealItems.forEach((item, idx) => {
                    setTimeout(() => item.classList.add('reveal-active'), idx * 80);
                });
            }, 100);

        } catch (e) { console.error(e); }
        if (loading) loading.style.display = 'none';
    };

    const openSummaryCard = () => {
        if (!latestRecapData) return alert("데이터 분석이 완료된 후 시도해주세요.");
        const savedBg = localStorage.getItem('soop_recap_local_bg') || DEFAULT_BG;
        const d = latestRecapData;
        const overlay = document.createElement('div');
        overlay.className = 'summary-overlay';
        overlay.innerHTML = `
            <div class="id-card" style="--tier-color: ${d.tier.color}">
                <div class="id-card-bg" style="background-image: url('${savedBg}')"></div>
                <div class="scan-line"></div>
                <div class="id-card-content">
                    <div class="id-header">
                        <div class="id-title">WATCHER LICENSE</div>
                        <div class="id-date">${d.selectedYear}.${String(d.selectedMonth).padStart(2,'0')}</div>
                    </div>
                    <div class="id-body">
                        <img src="${d.tier.icon}" class="id-tier-icon">
                        <div class="id-info-grid">
                            <div class="id-info-item">
                                <div class="id-label">TOTAL HOURS</div>
                                <div class="id-val">${d.totalHours.toFixed(1)}h</div>
                            </div>
                            <div class="id-info-item">
                                <div class="id-label">ATTENDANCE</div>
                                <div class="id-val" style="color:#ffd700;">${d.activeDays} DAYS</div>
                            </div>
                            <div class="id-info-item" style="grid-column:span 2; border-left:none; padding:0;">
                                <div class="id-label" style="margin-bottom:8px;">TOP STREAMER</div>
                                <div class="id-most">
                                    <img src="${d.topBjImg}">
                                    <span>${d.topBjName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="id-footer">
                        <div class="id-user">SOOP WATCHER</div>
                        <div style="font-size:12px; opacity:0.6;">SOOP RECAP</div>
                    </div>
                </div>
            </div>
            <div style="display:flex; gap:10px;">
                <button id="save-card-btn" style="padding:12px 30px; font-weight:800; border-radius:12px; border:none; background:#fff; cursor:pointer;">💾 저장하기</button>
                <button id="close-card-btn" style="padding:12px 30px; font-weight:800; border-radius:12px; border:none; background:#333; color:#fff; cursor:pointer;">닫기</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('save-card-btn').onclick = () => {
            const card = overlay.querySelector('.id-card');
            html2canvas(card, { useCORS: true, scale: 2, backgroundColor: '#111' }).then(canvas => {
                const link = document.createElement('a');
                link.download = `SOOP_LICENSE_${d.selectedYear}_${d.selectedMonth}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        };
        document.getElementById('close-card-btn').onclick = () => overlay.remove();
    };

    const renderBaseRecap = async () => {
        if (!currentUserId) {
            try {
                const userRes = await new Promise(r => GM_xmlhttpRequest({ method: "GET", url: INFO_API_URL, onload: res => r(JSON.parse(res.responseText).CHANNEL) }));
                currentUserId = userRes.LOGIN_ID;
                localStorage.setItem('soop_recap_user_id', currentUserId);
            } catch (e) {
                console.error("ID fetch failed");
                return;
            }
        }
        const savedBg = localStorage.getItem('soop_recap_local_bg') || DEFAULT_BG;
        let overlay = document.getElementById('recap-modal-overlay') || document.createElement('div');
        overlay.id = 'recap-modal-overlay';
        document.body.appendChild(overlay);

        overlay.innerHTML = `
            <div class="recap-window">
                <div class="recap-header-section" id="recap-header-bg" style="background-image: url('${savedBg}');">
                    <div class="header-glass-inner">
                        <button class="close-btn" id="close-recap">✕</button>
                        <div class="tier-header">
                            <div class="tier-visual"></div>
                            <div style="text-align:right;">
                                <div style="font-size:16px; color:rgba(255,255,255,0.4); font-weight:700;">WATCHER MMR</div>
                                <div id="mmr-val" style="font-size:42px; font-weight:900;">0</div>
                                <div id="mmr-diff"></div>
                            </div>
                        </div>
                        <div class="month-selector-area">
                            <div style="font-size:18px; font-weight:800; color:#00c6ff;">월별 조회: </div>
                            <select id="select-month" class="recap-select"></select>
                        </div>
                        <div class="badge-container"></div>
                        <div class="top-rank-grid">
                            <div class="stat-card reveal-item"></div>
                            <div class="stat-card reveal-item"></div>
                            <div class="stat-card reveal-item"></div>
                            <div class="stat-card reveal-item"></div>
                        </div>
                    </div>
                </div>
                <div class="recap-body-section">
                    <div id="loading-recap" class="loading-overlay" style="display:flex;">데이터 분석 중...</div>
                    <div class="ai-insult-box" id="ai-insult">분석 중...</div>
                    <div class="main-layout">
                        <div class="section-box" id="col-left">
                            <div class="layout-item reveal-item" data-id="weekly">
                                <div style="font-size:20px; font-weight:900; margin-bottom:25px;">요일 활동량</div>
                                <div style="height:180px;"><canvas id="weeklyChart"></canvas></div>
                            </div>
                            <div class="layout-item reveal-item" data-id="calendar">
                                <div style="font-size:20px; font-weight:900; margin-bottom:25px;">출석 체크</div>
                                <div class="calendar-wrapper">
                                    <div class="cal-header-row"><div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div></div>
                                    <div class="calendar-grid"></div>
                                </div>
                            </div>
                            <div class="layout-item reveal-item" data-id="category">
                                <div class="category-rank-area" style="margin-top:0;">
                                    <div style="font-size:20px; font-weight:900;">참여 카테고리 순위</div>
                                    <div id="category-ranking-list" class="category-rank-list"></div>
                                </div>
                            </div>
                        </div>
                        <div class="section-box" id="col-right">
                            <div class="layout-item reveal-item" data-id="streamer">
                                <div style="font-size:14px; font-weight:500; color:#888; margin-bottom:5px;">* 클릭하면 비공개 처리됩니다.</div>
                                <div style="font-size:20px; font-weight:900; margin-bottom:25px;">스트리머 순위</div>
                                <div style="position:relative;"><canvas id="rankChart"></canvas></div>
                            </div>
                        </div>
                    </div>
                    <div class="tools-area">
                        <div style="display:flex; gap:10px;" class="settings-container">
                            <button id="settings-main-btn" class="tool-main-btn">⚙️ 설정</button>
                            <div class="settings-menu" id="settings-menu">
    <label for="bg-file-input" class="tool-item" style="flex-direction: column; align-items: flex-start; gap: 6px; height: auto;">
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
            <span>📁 배경 변경</span>
            <span style="font-size:11px; color:#ff6b6b; font-weight:800;">(Max 3MB)</span>
        </div>
        <div style="font-size:11px; color:#aaa; font-weight:500; letter-spacing:-0.5px;">
            사이즈 : 1920px x 1080px (권장)
        </div>
    </label>

    <button id="tier-skin-toggle" class="tool-item">💎 티어 스킨</button>
</div>
                            <button id="summary-card-btn" style="background:rgba(255,255,255,0.1); color:#ffd700; border:1px solid rgba(255,215,0,0.5); padding:14px 20px; border-radius:20px; font-weight:800; cursor:pointer;">🆔 요약 카드</button>
                        </div>
                        <input type="file" id="bg-file-input" accept="image/*">
                        <div style="display: flex; gap: 12px;">
                            <a href="https://cafe.naver.com/f-e/cafes/31308909/menus/91" target="_blank" class="cafe-link-btn"><span>HINDERLAND</span></a>
                            <button id="screenshot-btn" class="screenshot-btn">IMAGE SAVE</button>
                        </div>
                    </div>
                </div>
            </div>`;

        overlay.querySelectorAll('.stat-card').forEach(card => applyTiltEffect(card));

        const settingsBtn = document.getElementById('settings-main-btn');
        const settingsMenu = document.getElementById('settings-menu');
        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle('active');
        };
        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
                settingsMenu.classList.remove('active');
            }
        });

        const tierSkinBtn = document.getElementById('tier-skin-toggle');
        tierSkinBtn.innerText = `💎 티어 스킨 (${selectedTierType})`;
        tierSkinBtn.onclick = () => {
            selectedTierType = selectedTierType === 'A' ? 'B' : 'A';
            localStorage.setItem('soop_recap_tier_type', selectedTierType);
            tierSkinBtn.innerText = `💎 티어 스킨 (${selectedTierType})`;
            updateRecapData();
        };

        document.getElementById('summary-card-btn').onclick = openSummaryCard;

        const monthSel = document.getElementById('select-month');
        for (let i = 0; i < 3; i++) {
            const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
            monthSel.innerHTML += `<option value="${d.getFullYear()}-${d.getMonth() + 1}" ${i === 0 ? 'selected' : ''}>${d.getFullYear()}년 ${d.getMonth() + 1}월</option>`;
        }
        monthSel.onchange = (e) => { [selectedYear, selectedMonth] = e.target.value.split('-').map(Number); updateRecapData(); };

        const headerBg = document.getElementById('recap-header-bg');
        if (headerBg) {
            const canvas = document.createElement('canvas');
            canvas.id = 'particle-canvas';
            headerBg.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            let particles = [];
            const resize = () => { canvas.width = headerBg.offsetWidth; canvas.height = headerBg.offsetHeight; };
            window.addEventListener('resize', resize);
            resize();
            class Particle {
                constructor() { this.reset(); }
                reset() {
                    this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 1 + 0.3; this.speedX = Math.random() * 0.5 - 0.25;
                    this.speedY = Math.random() * 0.5 - 0.25; this.opacity = Math.random() * 0.5; this.life = Math.random() * 150;
                }
                update() {
                    this.x += this.speedX; this.y += this.speedY; this.life -= 0.1;
                    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life < 0) this.reset();
                }
                draw() {
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                }
            }
            for (let i = 0; i < 80; i++) particles.push(new Particle());
            const animate = () => { if (!document.getElementById('particle-canvas')) return; ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); };
            animate();

            headerBg.onmousemove = (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) / 50;
                const moveY = (e.clientY - window.innerHeight / 2) / 50;
                headerBg.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
            };
        }

        document.getElementById('close-recap').onclick = () => overlay.remove();
        document.getElementById('bg-file-input').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const LIMIT_SIZE = 3 * 1024 * 1024;
                if (file.size > LIMIT_SIZE) {
                    const currentSizeMB = (file.size / 1024 / 1024).toFixed(1);
                    const msg = `⚠️ 주의: 파일 용량 초과 (${currentSizeMB}MB)\n\n권장 용량인 3MB를 초과했습니다.\n용량이 너무 크면 브라우저 제한으로 인해\n저장이 안 되거나, 다음에 접속할 때 초기화될 수 있습니다.\n\n그래도 적용하시겠습니까?`;
                    if (!confirm(msg)) {
                        e.target.value = '';
                        return;
                    }
                }
                const r = new FileReader();
                r.onload = (ev) => {
                    try {
                        localStorage.setItem('soop_recap_local_bg', ev.target.result);
                        document.getElementById('recap-header-bg').style.backgroundImage = `url('${ev.target.result}')`;
                    } catch (err) {
                        alert("❌ 저장 실패!\n\n이미지 용량이 브라우저 저장소 한도를 초과했습니다.\n더 작은 용량의 이미지로 시도해주세요.");
                    }
                };
                r.readAsDataURL(file);
            }
        };

        document.getElementById('screenshot-btn').onclick = () => {
            const win = document.querySelector('.recap-window');
            const items = win.querySelectorAll('.stat-card');
            items.forEach(i => i.style.transform = 'none');
            html2canvas(win, { useCORS: true, scale: 2, backgroundColor: '#0a0a0f', scrollY: -window.scrollY }).then(canvas => {
                const link = document.createElement('a');
                link.download = `SOOP_RECAP_${selectedYear}_${selectedMonth}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        };

        const moderateGlowPlugin = {
            id: 'moderateGlowPlugin',
            beforeDraw: (c) => {
                const ctx = c.ctx;
                const sc = c.data.datasets[0].shadowColor;
                if (sc) { ctx.save(); ctx.shadowBlur = 8.5; ctx.shadowColor = sc + "CC"; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
            },
            afterDraw: (c) => { c.ctx.restore(); }
        };

        const commonOptions = { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 15, right: 15, bottom: 5, left: 10 } }, plugins: { legend: { display: false } } };

        weeklyChart = new Chart(document.getElementById('weeklyChart'), {
            type: 'bar',
            data: { labels: ['일', '월', '화', '수', '목', '금', '토'], datasets: [{ data: [], borderRadius: 7, shadowColor: '' }] },
            options: { ...commonOptions, scales: { x: { grid: { display: false }, ticks: { color: '#888' } }, y: { display: false } } },
            plugins: [moderateGlowPlugin]
        });

        rankChart = new Chart(document.getElementById('rankChart'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [], borderRadius: 9, barThickness: 25, shadowColor: '' }] },
            options: {
                ...commonOptions, indexAxis: 'y',
                animation: { duration: 2000, easing: 'easeOutQuart' },
                scales: { y: { ticks: { color: '#fff' }, grid: { display: false } }, x: { display: false } },
                onClick: (event) => {
                    const index = rankChart.scales.y.getValueForPixel(event.y);
                    if (index >= 0 && index < rankChart.data.labels.length) {
                        rankChart.data.labels[index] = (rankChart.data.labels[index] === "비공개 스트리머") ? originalStreamerNames[index] : "비공개 스트리머";
                        rankChart.update();
                    }
                }
            },
            plugins: [moderateGlowPlugin]
        });

        updateRecapData();
    };

    const mainBtn = document.createElement('button');
    mainBtn.id = 'custom-recap-btn';
    mainBtn.innerText = "CHECK MY RECAP";
    const savedPos = JSON.parse(localStorage.getItem('soop_recap_btn_pos') || '{"right":"30px","bottom":"30px"}');
    Object.assign(mainBtn.style, { right: savedPos.right, bottom: savedPos.bottom, left: savedPos.left || 'auto', top: savedPos.top || 'auto' });
    document.body.appendChild(mainBtn);

    let isDragging = false, offset = { x: 0, y: 0 }, dragStartTime = 0;
    mainBtn.addEventListener('mousedown', (e) => { dragStartTime = Date.now(); isDragging = true; const rect = mainBtn.getBoundingClientRect(); offset.x = e.clientX - rect.left; offset.y = e.clientY - rect.top; mainBtn.style.transition = 'none'; });
    document.addEventListener('mousemove', (e) => { if (!isDragging) return; mainBtn.style.left = (e.clientX - offset.x) + 'px'; mainBtn.style.top = (e.clientY - offset.y) + 'px'; mainBtn.style.right = 'auto'; mainBtn.style.bottom = 'auto'; });
    document.addEventListener('mouseup', () => { if (!isDragging) return; isDragging = false; mainBtn.style.transition = 'opacity 0.3s, visibility 0.3s'; localStorage.setItem('soop_recap_btn_pos', JSON.stringify({ left: mainBtn.style.left, top: mainBtn.style.top, right: 'auto', bottom: 'auto' })); });
    mainBtn.onclick = () => { if (Date.now() - dragStartTime < 200) renderBaseRecap(); };

    setInterval(() => {
        const check = (el) => el?.classList.contains('full_screen') || el?.classList.contains('ua-fullscreen') || el?.classList.contains('sz-screen-mode') || el?.classList.contains('screen_mode');
        if (!!(document.fullscreenElement || document.webkitFullscreenElement) || check(document.body)) mainBtn.classList.add('hidden');
        else mainBtn.classList.remove('hidden');
    }, 1000);

    const observeTierChange = () => {
        const observer = new MutationObserver(() => {
            const tierNameEl = document.querySelector('.tier-name');
            const win = document.querySelector('.recap-window');
            if (tierNameEl && win) {
                const currentTier = tierNameEl.innerText.trim();
                win.classList.forEach(cls => { if (cls.startsWith('tier-aura-')) win.classList.remove(cls); });
                if (currentTier) win.classList.add(`tier-aura-${currentTier}`);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    observeTierChange();

})();