// ==UserScript==
// @name         SOOP 리캡
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2.0.0
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
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js
// @downloadURL https://update.greasyfork.org/scripts/562690/SOOP%20%EB%A6%AC%EC%BA%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/562690/SOOP%20%EB%A6%AC%EC%BA%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        DEFAULT_BG: "https://i.ibb.co/Z6BXDfRH/20260112-235411-1.png",
        NO_PROFILE_IMG: "https://res.sooplive.co.kr/images/common/thumb_profile.gif",
        MAX_ITEMS: 40
    };

    const Endpoints = {
        SEARCH: 'https://sch.sooplive.co.kr/api.php',
        ANALYTICS: 'https://broadstatistic.sooplive.co.kr/api/watch_statistic.php',
        USER: 'https://afevent2.sooplive.co.kr/api/get_private_info.php'
    };

    const MemoryBank = {
        imgBuffer: new Map(),
        bjLogoUrl: new Map(),
        apiData: new Map()
    };

    const AppContext = {
        uid: localStorage.getItem('sr_uid') || "",
        activeYear: new Date().getFullYear(),
        activeMonth: new Date().getMonth() + 1,
        skinMode: localStorage.getItem('sr_skin_mode') || 'A',
        chartRef: null,
        lastResult: null,
        bgBlob: null
    };

    const RankAssets = {
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

    function convertTimeToSec(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 0;
        const parts = timeStr.split(':').map(Number);
        while (parts.length < 3) parts.unshift(0);
        return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }

    async function fetchImageBlob(targetUrl) {
        const url = targetUrl || CONFIG.NO_PROFILE_IMG;
        if (MemoryBank.imgBuffer.has(url)) {
            return MemoryBank.imgBuffer.get(url);
        }
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "arraybuffer", timeout: 5000,
                onload: (response) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        MemoryBank.imgBuffer.set(url, reader.result);
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(new Blob([response.response], { type: 'image/png' }));
                },
                onerror: () => resolve(CONFIG.NO_PROFILE_IMG),
                ontimeout: () => resolve(CONFIG.NO_PROFILE_IMG)
            });
        });
    }

    function findStreamerImage(nickname) {
        if (MemoryBank.bjLogoUrl.has(nickname)) return Promise.resolve(MemoryBank.bjLogoUrl.get(nickname));
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${Endpoints.SEARCH}?m=searchHistory&service=list&d=${encodeURIComponent(nickname)}`,
                onload: (response) => {
                    try {
                        const parsed = JSON.parse(response.responseText);
                        const match = parsed?.suggest_bj?.find(item => item.user_nick === nickname);
                        const logo = match ? match.station_logo : CONFIG.NO_PROFILE_IMG;
                        MemoryBank.bjLogoUrl.set(nickname, logo);
                        resolve(logo);
                    } catch { resolve(CONFIG.NO_PROFILE_IMG); }
                },
                onerror: () => resolve(CONFIG.NO_PROFILE_IMG)
            });
        });
    }

    function calculateTier(points) {
        const theme = RankAssets[AppContext.skinMode] || RankAssets.A;
        if (points >= 7000) return { label: "Challenger", color: "#FFD700", img: theme["Challenger"] };
        if (points >= 5500) return { label: "Grandmaster", color: "#ff4e4e", img: theme["Grandmaster"] };
        if (points >= 3500) return { label: "Master", color: "#be8bff", img: theme["Master"] };
        if (points >= 1500) return { label: "Diamond", color: "#57d5ff", img: theme["Diamond"] };
        if (points >= 900) return { label: "Emerald", color: "#2ecc71", img: theme["Emerald"] };
        if (points >= 500) return { label: "Platinum", color: "#3498db", img: theme["Platinum"] };
        if (points >= 300) return { label: "Gold", color: "#f1c40f", img: theme["Gold"] };
        if (points >= 150) return { label: "Silver", color: "#bdc3c7", img: theme["Silver"] };
        return { label: "Bronze", color: "#cd7f32", img: theme["Bronze"] };
    }

    function requestStats(uid, sDate, eDate, moduleName) {
        const key = `${uid}|${sDate}|${eDate}|${moduleName}`;
        if (MemoryBank.apiData.has(key)) return Promise.resolve(MemoryBank.apiData.get(key));

        return new Promise((resolve) => {
            const formData = `szModule=${moduleName}&szMethod=watch&szStartDate=${sDate}&szEndDate=${eDate}&nPage=1&szId=${uid}`;
            GM_xmlhttpRequest({
                method: "POST", url: Endpoints.ANALYTICS, data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                onload: (response) => {
                    try {
                        const json = JSON.parse(response.responseText);
                        const result = json.data || null;
                        MemoryBank.apiData.set(key, result);
                        resolve(result);
                    } catch { resolve(null); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    function triggerUltraCelebration(imgUrl, colorHex) {
        const overlay = document.createElement('div');
        overlay.className = 'sp-celebration-overlay';
        overlay.innerHTML = `<img src="${imgUrl}" class="sp-center-img">`;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('active'));

        document.body.classList.add('sp-body-shake');

        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 40, spread: 360, ticks: 100, zIndex: 1000000 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 70 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount: particleCount * 1.5, origin: { x: 0.5, y: 0.5 }, colors: [colorHex, '#FFF', '#FFD700'] }));
        }, 200);

        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
            document.body.classList.remove('sp-body-shake');
        }, 3000);
    }

    function triggerMegaVictory(cardElement, colorHex) {
        if (typeof confetti !== 'function') {
            console.warn("Confetti library not loaded.");
            return;
        }

        const img = cardElement.querySelector('.sp-card-img');
        if (img) {
            img.classList.remove('sp-zoom-effect');
            void img.offsetWidth;
            img.classList.add('sp-zoom-effect');
        }

        cardElement.classList.remove('sp-shake-effect');
        void cardElement.offsetWidth;
        cardElement.classList.add('sp-shake-effect');

        const rect = cardElement.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        const loop = (count) => {
            confetti({
                particleCount: 80, spread: 55, origin: { x, y },
                colors: [colorHex, '#ffffff', '#ffd700'],
                startVelocity: 40, scalar: 1.2, zIndex: 200000, disableForReducedMotion: true
            });
            confetti({
                particleCount: 40, angle: 60, spread: 45, origin: { x: x - 0.05, y: y + 0.05 },
                colors: [colorHex], zIndex: 200000
            });
            confetti({
                particleCount: 40, angle: 120, spread: 45, origin: { x: x + 0.05, y: y + 0.05 },
                colors: [colorHex], zIndex: 200000
            });

            if (count > 0) setTimeout(() => loop(count - 1), 250);
        };

        loop(3);

        setTimeout(() => {
            if (img) img.classList.remove('sp-zoom-effect');
            cardElement.classList.remove('sp-shake-effect');
        }, 1500);
    }

    function evaluateAchievements(metrics) {
        const list = [];
        const { totalHrs, attendance, dawnRate, vodRate, favRate, streamerCnt, weekendRate } = metrics;
        if (totalHrs >= 500) list.push({ title: "🌌 SOOP의 신", desc: "월 500시간 이상 시청" });
        else if (totalHrs >= 300) list.push({ title: "👑 SOOP 성주", desc: "월 300시간 이상 시청" });
        else if (totalHrs >= 150) list.push({ title: "💎 숲의 지배자", desc: "월 150시간 이상 시청" });
        else if (totalHrs >= 80) list.push({ title: "🥇 프로 시청러", desc: "월 80시간 이상 시청" });
        else if (totalHrs >= 30) list.push({ title: "🥉 루키 시청자", desc: "월 30시간 이상 시청" });
        else list.push({ title: "🌱 새싹 와쳐", desc: "입문 시청자" });

        if (attendance >= 30) list.push({ title: "🛡️ 전설의 수호자", desc: "매일 출석" });
        else if (attendance >= 25) list.push({ title: "📅 개근의 신", desc: "25일 이상 출석" });
        else if (attendance >= 15) list.push({ title: "🏃 성실한 발걸음", desc: "15일 이상 출석" });

        if (dawnRate > 0.5) list.push({ title: "🦇 심야의 박쥐", desc: "새벽 시청 50% 이상" });
        else if (dawnRate > 0.2) list.push({ title: "🌙 올빼미 수호자", desc: "새벽 시청 20% 이상" });

        if (vodRate > 2.0) list.push({ title: "🍿 VOD 광인", desc: "다시보기 위주" });
        else if (totalHrs > 20 && vodRate < 0.1) list.push({ title: "📡 생방 사수단", desc: "라이브 위주" });

        if (favRate > 0.6) list.push({ title: "🧡 일편단심", desc: "한 방송 집중" });
        if (streamerCnt >= 25) list.push({ title: "🌍 박애주의자", desc: "다양한 방송 시청" });
        if (weekendRate > 0.3) list.push({ title: "🔥 주말의 전사", desc: "주말 집중 시청" });
        return list;
    }

    function createFeedbackString(m) {
        const { totalHrs, attendance, dawnRate, favRate, weekendRate, vodRate, streamerCnt } = m;
        const intros = ["🌌 숲의 역사를 써내려가는 전설님!", "🌲 숲의 든든한 수호신!", "🦉 감성 가득한 새벽의 올빼미님!", "🎢 주말을 불태운 열정파님!", "📼 시간을 달리는 VOD 장인님!", "🌻 한 곳만 바라보는 해바라기님!", "🔥 식지 않는 열정을 가진 프로님!", "🌍 호기심 많은 탐험가님!", "🌱 귀여운 새싹님!", "🍀 반가운 여행자님!"];
        let idx = 0;
        if (totalHrs >= 400) idx = 0; else if (attendance >= 28) idx = 1; else if (dawnRate >= 0.55) idx = 2; else if (weekendRate >= 0.45 && totalHrs >= 30) idx = 3; else if (vodRate >= 2.0 && totalHrs >= 20) idx = 4; else if (favRate >= 0.8 && totalHrs >= 50) idx = 5; else if (totalHrs >= 150) idx = 6; else if (streamerCnt >= 50) idx = 7; else if (totalHrs <= 5) idx = 8; else idx = 9;

        const body = [];
        if (favRate >= 0.75) body.push(` 최애와 함께한 ${Math.floor(favRate * 75.5)}%의 시간이 빛나네요.`);
        if (dawnRate >= 0.4) body.push(` 모두가 잠든 새벽을 지켜주셔서 감사합니다.`);
        if (weekendRate >= 0.4) body.push(` 평일의 피로를 주말의 SOOP으로 씻어내셨군요.`);
        if (vodRate >= 1.5 && totalHrs >= 10) body.push(` 놓친 순간까지 꼼꼼히 챙겨보는 섬세함!`);
        if (streamerCnt >= 30) body.push(` 무려 ${streamerCnt}명의 방송을 넘나드는 마당발!`);
        if (attendance >= 25) body.push(` 당신의 꾸준함은 정말 최고입니다.`);
        if (totalHrs >= 100) body.push(` 이번 달 ${totalHrs.toFixed(1)}시간의 추억이 쌓였네요.`);
        if (body.length === 0) body.push(` 바쁜 일상 속에서도 찾아와주셔서 기뻐요.`);

        const tails = [" 다음 달에도 함께해요!", " 당신의 즐거움을 응원해요!", " 좋은 추억 많이 만드세요!", " 내일도 행복하세요!", " 하루하루가 푸르길!"];
        return intros[idx] + body[Math.floor(Math.random() * body.length)] + tails[Math.floor(Math.random() * tails.length)];
    }

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&display=swap');

        @keyframes sp-float { 0%, 100% { transform: scale(1.2) translateY(0); } 50% { transform: scale(1.25) translateY(-10px); } }
        @keyframes sp-pulse { 0%, 100% { transform: scale(1.45) translateY(0); } 50% { transform: scale(1.55) translateY(-15px); } }
        @keyframes sp-glitch { 0% { text-shadow: 5px 0 var(--rank-color), -2px 0 #fff; } 50% { text-shadow: 5px 0 var(--rank-color), -2px 0 #fff; } 100% { text-shadow: 0 0 10px var(--rank-color); } }
        @keyframes sp-pop { from { opacity: 0; transform: translateY(15px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

        @keyframes sp-shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 50% { transform: translateX(5px) rotate(5deg); } 75% { transform: translateX(-5px) rotate(-5deg); } 100% { transform: translateX(0); } }
        .sp-zoom-effect { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: scale(1.8) !important; z-index: 100; position: relative; box-shadow: 0 0 30px var(--rank-color); }
        .sp-shake-effect { animation: sp-shake 0.4s ease-in-out; }

        .sp-click-hint {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            font-size: 11px; font-weight: 800; color: #fff;
            background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 8px;
            opacity: 0; transition: 0.2s; pointer-events: none; z-index: 50;
            backdrop-filter: blur(2px); border: 1px solid rgba(255,255,255,0.2);
        }
        .sp-card:hover .sp-click-hint { opacity: 1; }

        .sp-celebration-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(15px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s;
        }
        .sp-celebration-overlay.active { opacity: 1; }

        .sp-center-img {
            width: 350px; height: 350px; border-radius: 50%;
            border: 8px solid #00aeff; box-shadow: 0 0 60px #00aeff, 0 0 120px rgba(71, 161, 255, 0.9);
            object-fit: cover; transform: scale(0); transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .sp-celebration-overlay.active .sp-center-img { transform: scale(1) rotate(360deg); }

        @keyframes sp-screen-shake-anim {
            0% { transform: translate(0, 0) rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-10px, -10px) rotate(-1deg); }
            20%, 40%, 60%, 80% { transform: translate(10px, 10px) rotate(1deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        .sp-body-shake { animation: sp-screen-shake-anim 0.5s cubic-bezier(.36,.07,.19,.97) both; }


        #sp-launch-btn { position: fixed; z-index: 10000; padding: 16px 28px; background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); color: white; border: none; border-radius: 15px; cursor: move; font-family: 'Pretendard'; font-weight: 800; box-shadow: 0 10px 30px rgba(0, 114, 255, 0.4); transition: 0.3s; }
        #sp-launch-btn.sp-invisible { opacity: 0; visibility: hidden; pointer-events: none; }

        #sp-modal-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 5, 10, 0.95); backdrop-filter: blur(20px); z-index: 100001; display: block; overflow-y: auto; padding: 50px 0; box-sizing: border-box; }
        .sp-dashboard-container { background: #0a0a0f; color: #fff; width: 1350px !important; border-radius: 45px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 50px 150px rgba(0,0,0,0.8); min-height: 1000px; font-family: 'Pretendard'; overflow: visible; position: relative; display: flex; flex-direction: column; }

        .sp-header { border-radius: 45px 45px 0 0; overflow: hidden; position: relative; background-size: cover; background-position: center; flex-shrink: 0; }
        .sp-header-inner { background: linear-gradient(to bottom, rgba(10,10,20,0.6), rgba(10,10,20,0.8) 70%, #0a0a0f); padding: 60px; }
        .sp-body { background: #0a0a0f; padding: 20px 60px 60px 60px; border-radius: 0 0 45px 45px; flex-grow: 1; display: flex; flex-direction: column; }

        .sp-rank-section { display: flex !important; justify-content: space-between; align-items: center; margin-bottom: 40px; padding: 20px 45px; background: rgba(255,255,255,0.03); border-radius: 35px; border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); }
        .sp-rank-visual { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 20px; }
        .sp-rank-icon-box { width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; }
        .sp-rank-img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px var(--rank-color)); transform: scale(1.2); animation: sp-float 3s ease-in-out infinite; }
        .sp-rank-img.special-fx { animation: sp-pulse 3s ease-in-out infinite; }
        .sp-rank-title { font-size: 58px; font-weight: 900; color: var(--rank-color); text-transform: uppercase; letter-spacing: -2px; text-shadow: 0 0 20px var(--rank-color); white-space: nowrap; }

        .sp-stat-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 25px; width: 100%; margin-top: 20px; }
        .sp-card { background: rgba(255,255,255,0.05); padding: 25px; border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px; position: relative; overflow: hidden; transition: 0.3s; flex-direction: row; }
        .sp-card:hover { transform: translateY(-5px); border-color: var(--rank-color); box-shadow: 0 0 20px var(--rank-color); }
        .sp-card.hidden-mode { background: rgba(0,0,0,0.8) !important; border: 1px dashed rgba(255,255,255,0.2); }
        .sp-card.hidden-mode > *:not(.sp-toggle-btn) { visibility: hidden !important; opacity: 0 !important; }
        .sp-card.hidden-mode::after { content: "SECRET"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; color: #333; font-size: 14px; letter-spacing: 2px; }
        .sp-toggle-btn { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.1); border: none; color: #fff; border-radius: 5px; font-size: 10px; padding: 2px 6px; cursor: pointer; z-index: 20; font-weight: 800; }
        .sp-card-img { width: 70px; height: 70px; border-radius: 20px; border: 3px solid #00c6ff; object-fit: cover; flex-shrink: 0; }

        .sp-list-container { display: flex; flex-direction: column; gap: 8px; height: auto; overflow: visible; }
        .sp-list-item { display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 10px 15px; transition: 0.2s; cursor: pointer; }
        .sp-list-item:hover { background: rgba(255,255,255,0.08); transform: translateX(3px); border-color: var(--rank-color); }
        .sp-idx-badge { font-size: 16px; font-weight: 800; color: #666; width: 24px; text-align: center; margin-right: 12px; font-style: italic; }
        .sp-idx-badge.top3 { color: var(--rank-color); text-shadow: 0 0 10px var(--rank-color); font-size: 20px; font-weight: 900; }
        .sp-list-img { width: 42px; height: 42px; border-radius: 10px; background: #222; margin-right: 15px; border: 1px solid rgba(255,255,255,0.1); object-fit: cover; }
        .sp-list-content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 5px; }
        .sp-list-bar { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
        .sp-list-fill { height: 100%; background: var(--rank-color); border-radius: 10px; box-shadow: 0 0 8px var(--rank-color); transition: width 1s ease-out; }
        .sp-row-value { font-size: 13px; font-weight: 700; color: #ccc; margin-left: 15px; min-width: 50px; text-align: right; }

        .sp-layout-grid { display: grid !important; grid-template-columns: 380px 1fr 1fr !important; gap: 25px !important; align-items: start; }
        .sp-panel { background: rgba(255,255,255,0.02); padding: 45px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.06); box-sizing: border-box; display: flex; flex-direction: column; gap: 50px; }

        .sp-badge-area { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-bottom: 50px; min-height: 60px; }
        .sp-badge { background: rgba(255,255,255,0.1); padding: 0 26px; height: 48px; border-radius: 16px; font-size: 16px; font-weight: 800; color: #ffd700; border: 1.5px solid rgba(255,215,0,0.2); display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; transition: 0.3s; }
        .sp-badge:hover { transform: translateY(-5px); background: rgba(255,215,0,0.15); border-color: #ffd700; }
        .sp-tooltip { position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); background: rgba(20, 20, 30, 0.95); color: #fff; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; white-space: nowrap; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); pointer-events: none; opacity: 0; transition: 0.3s; visibility: hidden; }
        .sp-badge:hover .sp-tooltip { opacity: 1; visibility: visible; bottom: 115%; }

        .sp-exit { position: absolute; top: 40px; right: 40px; background: rgba(255,255,255,0.2); border: none; color: #fff; width: 55px; height: 55px; border-radius: 50%; cursor: pointer; font-size: 24px; z-index: 100; transition: 0.3s; }
        .sp-exit:hover { background: var(--rank-color); color: #000; transform: rotate(90deg); }
        .sp-select-wrap { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; align-items: center; }
        .sp-select { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 25px; border-radius: 12px; font-size: 18px; font-weight: 800; cursor: pointer; outline: none; }
        .sp-msg-box { background: linear-gradient(90deg, rgba(0,198,255,0.1), rgba(0,255,178,0.1)); border-left: 5px solid #00ffb2; padding: 20px 30px; border-radius: 20px; margin-bottom: 40px; font-size: 20px; font-weight: 800; color: #e0f9ff; line-height: 1.6; display: flex; align-items: center; gap: 15px; min-height: 80px; white-space: pre-wrap; word-break: keep-all; }
        .sp-loading { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); border-radius: 45px; display: none; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; z-index: 100; }

        .sr-toolbar { margin-top: 60px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 35px; width: 100%; }
        .sr-opt-group { position: relative; display: flex; align-items: center; gap: 10px; }

        .sp-ctx-menu { position: absolute; bottom: 125%; left: 0; background: rgba(20,20,30,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 12px; display: none; flex-direction: column; gap: 8px; width: 220px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); backdrop-filter: blur(15px); z-index: 2000; }
        .sp-ctx-menu.active { display: flex; }
        .sp-ctx-item { background: transparent; border: none; color: #ccc; padding: 12px 15px; text-align: left; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 10px; transition: 0.2s; width: 100%; box-sizing: border-box; }
        .sp-ctx-item:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateX(5px); }

        .sp-tool-btn { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 14px 24px; border-radius: 20px; font-weight: 800; cursor: pointer; font-size: 16px; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .sp-tool-btn:hover { background: rgba(255,255,255,0.2); }
        .sp-save-btn { background: #fff; color: #000; border: none; padding: 16px 50px; border-radius: 22px; font-size: 18px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .sp-save-btn:disabled { background: #555; color: #888; cursor: not-allowed; }
        .sp-link-btn { background-image: url('https://i.ibb.co/DDCy7PW3/1.jpg'); background-size: cover; background-position: center; color: #fff; border: 2px solid rgba(255,255,255,0.2); padding: 16px 30px; border-radius: 22px; font-size: 18px; font-weight: 900; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; font-family: 'Pretendard'; position: relative; overflow: hidden; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        #sp-upload-input { display: none; }

        .sp-anim-item { opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .sp-anim-show { opacity: 1; transform: translateY(0); }
        #sp-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

        .sp-id-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); z-index: 100005; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px; }
        .sp-license-card { width: 600px; height: 350px; background: #111; border-radius: 20px; position: relative; overflow: hidden; border: 2px solid var(--rank-color); box-shadow: 0 0 40px rgba(0,0,0,0.8), 0 0 10px var(--rank-color); font-family: 'Pretendard'; color: #fff; }
        .sp-lc-bg { position: absolute; top:0; left:0; width:100%; height:100%; background-size: cover; background-position: center; opacity: 0.25; filter: grayscale(0.5); }
        .sp-lc-content { position: absolute; top:0; left:0; width:100%; height:100%; padding: 30px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
        .sp-lc-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
        .sp-lc-title { font-family: 'Chakra Petch'; font-size: 24px; font-weight: 700; color: var(--rank-color); letter-spacing: 2px; }
        .sp-lc-date { font-size: 16px; font-weight: 600; color: #888; }
        .sp-lc-body { display: flex; gap: 30px; align-items: center; flex: 1; }
        .sp-lc-icon { width: 120px; height: 120px; object-fit: contain; filter: drop-shadow(0 0 10px var(--rank-color)); }
        .sp-lc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
        .sp-lc-item { background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 10px; border-left: 3px solid var(--rank-color); }
        .sp-lc-lbl { font-size: 12px; color: #aaa; margin-bottom: 4px; }
        .sp-lc-val { font-size: 18px; font-weight: 800; }
        .sp-lc-foot { display: flex; justify-content: space-between; align-items: flex-end; }
        .sp-lc-user { font-size: 28px; font-weight: 900; }
        .sp-lc-top { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.5); padding: 8px 15px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.2); }
        .sp-lc-top img { width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--rank-color); }
        .sp-lc-fx { position: absolute; top:0; left:0; width:100%; height:10px; background: linear-gradient(to bottom, transparent, var(--rank-color), transparent); opacity: 0.3; animation: sp-pop 3s linear infinite; }

        .sp-cal-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; text-align: center; margin-bottom: 15px; font-size: 14px; font-weight: 900; color: #666; }
        .sp-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; width: 100%; }
        .sp-cal-day { aspect-ratio: 1/1; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.08); }
        .sp-cal-day.active { background: linear-gradient(135deg, #00c6ff, #0072ff); color: #fff !important; box-shadow: 0 8px 20px rgba(0, 114, 255, 0.4); }

        .sp-cat-list { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
        .sp-cat-item { background: rgba(255,255,255,0.05); padding: 10px 18px; border-radius: 18px; display: flex; align-items: center; gap: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .sp-cat-idx { font-weight: 900; color: #00c6ff; width: 20px; font-size: 16px; }
        .sp-cat-img { width: 30px; height: 30px; border-radius: 6px; background: #333; overflow: hidden; }
        .sp-cat-img img { width: 100%; height: 100%; object-fit: cover; }
        .sp-cat-txt { font-weight: 700; flex: 1; color: #ddd; font-size: 15px; }
        .sp-cat-cnt { background: rgba(0, 114, 255, 0.3); color: #fff; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }
    `);

    async function initDashboard() {
        if (!AppContext.uid) {
            try {
                const response = await new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: Endpoints.USER,
                        onload: (r) => resolve(JSON.parse(r.responseText).CHANNEL)
                    });
                });
                AppContext.uid = response.LOGIN_ID;
                localStorage.setItem('sr_uid', AppContext.uid);
            } catch (e) {
                return;
            }
        }

        let modal = document.getElementById('sp-modal-layer');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'sp-modal-layer';
            document.body.appendChild(modal);
        }

        const bg = localStorage.getItem('sr_bg_url') || CONFIG.DEFAULT_BG;
        const bgBlob = await fetchImageBlob(bg);
        AppContext.bgBlob = bgBlob;

        modal.innerHTML = `
            <div class="sp-dashboard-container">
                <div class="sp-header" id="sp-bg-target" style="background-image: url('${bgBlob}');">
                    <div class="sp-header-inner">
                        <button class="sp-exit" id="sp-close-btn">✕</button>
                        <div class="sp-rank-section">
                            <div class="sp-rank-visual">
                                <div class="sp-rank-icon-box"></div>
                                <div class="sp-rank-title"></div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:16px; color:rgba(255,255,255,0.4); font-weight:700;">WATCHER SCORE</div>
                                <div id="sp-score-val" style="font-size:42px; font-weight:900;">0</div>
                                <div id="sp-score-diff" style="font-size:28px; font-weight:800; margin-top:8px;"></div>
                            </div>
                        </div>
                        <div class="sp-select-wrap">
                            <div style="font-size:18px; font-weight:800; color:#00c6ff;">월별 조회: </div>
                            <select id="sp-month-sel" class="sp-select"></select>
                        </div>
                        <div class="sp-badge-area"></div>
                        <div class="sp-stat-grid">
                            <div class="sp-card sp-anim-item"></div><div class="sp-card sp-anim-item"></div>
                            <div class="sp-card sp-anim-item"></div><div class="sp-card sp-anim-item"></div>
                        </div>
                    </div>
                </div>
                <div class="sp-body">
                    <div id="sp-loader" class="sp-loading">데이터 분석 중...</div>
                    <div class="sp-msg-box" id="sp-msg-text"></div>
                    <div class="sp-layout-grid">
                        <div class="sp-panel">
                            <div class="sp-anim-item"><div style="font-size:20px; font-weight:900; margin-bottom:25px;">요일 활동량</div><div style="height:180px;"><canvas id="sp-chart"></canvas></div></div>
                            <div class="sp-anim-item"><div style="font-size:20px; font-weight:900; margin-bottom:25px;">출석 체크</div><div class="sp-cal-wrapper"><div class="sp-cal-header"><div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div></div><div class="sp-cal-grid"></div></div></div>
                            <div class="sp-anim-item"><div style="margin-top:0;"><div style="font-size:20px; font-weight:900;">참여 카테고리 순위</div><div id="sp-cat-list" class="sp-cat-list"></div></div></div>
                        </div>
                        <div class="sp-panel">
                            <div class="sp-anim-item"><div style="font-size:14px; font-weight:500; color:#888; margin-bottom:5px;">* 클릭하면 비공개 처리됩니다.</div><div style="font-size:20px; font-weight:900; margin-bottom:25px;">스트리머 순위 (Top ${CONFIG.MAX_ITEMS})</div><div id="sp-bj-list" class="sp-list-container"></div></div>
                        </div>
                        <div class="sp-panel">
                            <div class="sp-anim-item"><div style="font-size:14px; font-weight:500; color:#888; margin-bottom:5px;">* 클릭하면 비공개 처리됩니다.</div><div style="font-size:20px; font-weight:900; margin-bottom:25px;">VOD 시청 순위 (Top ${CONFIG.MAX_ITEMS})</div><div id="sp-vod-list" class="sp-list-container"></div></div>
                        </div>
                    </div>
                    <div class="sr-toolbar">
                        <div class="sr-opt-group">
                            <button id="sp-opt-btn" class="sp-tool-btn">⚙️ 설정</button>
                            <div class="sp-ctx-menu" id="sp-ctx-menu">
                                <label for="sp-upload-input" class="sp-ctx-item" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px;">
                                    <span>📁 배경 변경</span>
                                    <span style="font-size: 10px; color: #888;">권장: 1920x1080 <span style="color: #ff4e4e;">(Max 3MB)</span></span>
                                </label>
                                <button id="sp-skin-btn" class="sp-ctx-item">💎 티어 스킨</button>
                            </div>
                            <button id="sp-card-btn" class="sp-tool-btn" style="color:#ffd700; border-color:rgba(255,215,0,0.5);">🆔 요약 카드</button>
                        </div>
                        <input type="file" id="sp-upload-input" accept="image/*">
                        <div style="display: flex; gap: 12px;">
                            <a href="https://cafe.naver.com/f-e/cafes/31308909/menus/91" target="_blank" class="sp-link-btn"><span>HINDERLAND</span></a>
                            <button id="sp-save-btn" class="sp-save-btn">IMAGE SAVE</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const closeBtn = document.getElementById('sp-close-btn');
        closeBtn.onclick = () => {
            modal.remove();
            if (AppContext.chartRef) {
                AppContext.chartRef.destroy();
                AppContext.chartRef = null;
            }
        };

        const optBtn = document.getElementById('sp-opt-btn');
        const menu = document.getElementById('sp-ctx-menu');
        optBtn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('active'); };
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== optBtn) menu.classList.remove('active');
        });

        const skinBtn = document.getElementById('sp-skin-btn');
        skinBtn.innerText = `💎 티어 스킨 (${AppContext.skinMode})`;
        skinBtn.onclick = () => {
            AppContext.skinMode = AppContext.skinMode === 'A' ? 'B' : 'A';
            localStorage.setItem('sr_skin_mode', AppContext.skinMode);
            skinBtn.innerText = `💎 티어 스킨 (${AppContext.skinMode})`;
            refreshData();
        };

        document.getElementById('sp-card-btn').onclick = createSummaryCard;
        const saveBtn = document.getElementById('sp-save-btn');
        saveBtn.onclick = () => {
            const el = document.querySelector('.sp-dashboard-container');
            saveBtn.innerText = "⏳ 저장 중...";
            saveBtn.disabled = true;

            setTimeout(() => {
                html2canvas(el, { useCORS: true, scale: 1.5, backgroundColor: '#0a0a0f', scrollY: -window.scrollY }).then(c => {
                    const a = document.createElement('a');
                    a.download = `SOOP_RECAP_${Date.now()}.png`;
                    a.href = c.toDataURL();
                    a.click();
                    saveBtn.innerText = "IMAGE SAVE";
                    saveBtn.disabled = false;
                }).catch(() => {
                    alert("저장 실패");
                    saveBtn.innerText = "IMAGE SAVE";
                    saveBtn.disabled = false;
                });
            }, 100);
        };

        document.getElementById('sp-upload-input').onchange = (e) => {
            const f = e.target.files[0];
            if (f && f.size <= 3 * 1024 * 1024) {
                const r = new FileReader();
                r.onload = (ev) => {
                    localStorage.setItem('sr_bg_url', ev.target.result);
                    fetchImageBlob(ev.target.result).then(b => {
                        document.getElementById('sp-bg-target').style.backgroundImage = `url('${b}')`;
                    });
                };
                r.readAsDataURL(f);
            } else {
                alert("3MB 이하만 가능합니다.");
            }
        };

        const dateSel = document.getElementById('sp-month-sel');
        for (let i = 0; i < 3; i++) {
            const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
            dateSel.innerHTML += `<option value="${d.getFullYear()}-${d.getMonth() + 1}" ${i === 0 ? 'selected' : ''}>${d.getFullYear()}년 ${d.getMonth() + 1}월</option>`;
        }
        dateSel.onchange = (e) => {
            const [y, m] = e.target.value.split('-').map(Number);
            AppContext.activeYear = y;
            AppContext.activeMonth = m;
            refreshData();
        };

        const bgTarget = document.getElementById('sp-bg-target');
        const cvs = document.createElement('canvas');
        cvs.id = 'sp-particles';
        bgTarget.appendChild(cvs);
        const cx = cvs.getContext('2d');
        const pts = [];
        const fit = () => { cvs.width = bgTarget.offsetWidth; cvs.height = bgTarget.offsetHeight; };
        window.addEventListener('resize', fit);
        fit();

        for (let i = 0; i < 50; i++) pts.push({
            x: Math.random() * cvs.width,
            y: Math.random() * cvs.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            s: Math.random() + 0.5,
            a: Math.random() * 0.5
        });

        const loop = () => {
            if (!document.getElementById('sp-particles')) return;
            cx.clearRect(0, 0, cvs.width, cvs.height);
            for (const p of pts) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
                if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
                cx.globalAlpha = p.a;
                cx.fillStyle = '#fff';
                cx.beginPath();
                cx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
                cx.fill();
            }
            requestAnimationFrame(loop);
        };
        loop();

        refreshData();
    }

    async function refreshData() {
        const loader = document.getElementById('sp-loader');
        if (loader) loader.style.display = 'flex';

        try {
            const { activeYear, activeMonth, uid } = AppContext;
            const makeDate = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const endD = new Date(activeYear, activeMonth, 0).getDate();

            const cStart = makeDate(activeYear, activeMonth, 1);
            const cEnd = makeDate(activeYear, activeMonth, endD);

            const pDate = new Date(activeYear, activeMonth - 2, 1);
            const pStart = makeDate(pDate.getFullYear(), pDate.getMonth() + 1, 1);
            const pEnd = makeDate(pDate.getFullYear(), pDate.getMonth() + 1, new Date(pDate.getFullYear(), pDate.getMonth() + 1, 0).getDate());

            const [L1, V1, L2, V2, K1] = await Promise.all([
                requestStats(uid, cStart, cEnd, 'UserLiveWatchTimeData'),
                requestStats(uid, cStart, cEnd, 'UserVodWatchTimeData'),
                requestStats(uid, pStart, pEnd, 'UserLiveWatchTimeData'),
                requestStats(uid, pStart, pEnd, 'UserVodWatchTimeData'),
                requestStats(uid, cStart, cEnd, 'UserLiveSearchKeywordData').catch(() => ({}))
            ]);

            const parseSet = (d) => {
                let sec = 0, dateSet = new Set(), bjSet = new Set(), dawn = 0, wknd = 0;
                (d?.table1?.data || []).forEach(r => {
                    const s = convertTimeToSec(r.total_watch_time);
                    if (s > 0) {
                        sec += s;
                        dateSet.add(r.day);
                        const day = new Date(r.day).getDay();
                        if (day === 0 || day === 6) wknd += s;
                    }
                });
                const stk = [...(d?.chart?.data_stack || []), ...(d?.chart?.data_stack_vod || []), ...(d?.chart?.vod_data_stack || [])];
                stk.forEach(k => {
                    if (k.bj_nick && k.bj_nick !== '기타') bjSet.add(k.bj_nick);
                    k.data?.forEach((val, idx) => { if (idx >= 1 && idx <= 6) dawn += val; });
                });
                return { sec, dateSet, bjSet, dawn, wknd };
            };

            const nowL = parseSet(L1), nowV = parseSet(V1);
            const preL = parseSet(L2), preV = parseSet(V2);

            const totalSec = nowL.sec + nowV.sec;
            const hours = totalSec / 3600;
            const days = new Set([...nowL.dateSet, ...nowV.dateSet]);
            const bjs = new Set([...nowL.bjSet, ...nowV.bjSet]);

            const score = Math.floor((hours * 12) + (days.size * 60) + (bjs.size * 15));
            const prevScore = Math.floor(((preL.sec + preV.sec) / 3600 * 12) + (new Set([...preL.dateSet, ...preV.dateSet]).size * 60) + (new Set([...preL.bjSet, ...preV.bjSet]).size * 15));

            const rank = calculateTier(score);
            const bjMap = new Map();
            [...(L1?.chart?.data_stack || []), ...(V1?.chart?.data_stack_vod || []), ...(V1?.chart?.vod_data_stack || [])].forEach(x => {
                if (x.bj_nick && x.bj_nick !== '기타') {
                    const sum = (x.data || []).reduce((a, b) => a + b, 0);
                    bjMap.set(x.bj_nick, (bjMap.get(x.bj_nick) || 0) + sum);
                }
            });

            const sortedBJs = Array.from(bjMap.entries()).map(([n, v]) => ({ name: n, value: v })).sort((a, b) => b.value - a.value);
            const topBJ = sortedBJs[0]?.name || '-';

            const [u1, u2] = await Promise.all([findStreamerImage(topBJ), findStreamerImage(sortedBJs[1]?.name)]);
            const [pic1, pic2] = await Promise.all([fetchImageBlob(u1), fetchImageBlob(u2)]);

            AppContext.lastResult = {
                rankData: rank,
                totalHours: hours,
                activeDays: days.size,
                topName: topBJ,
                topImg: pic1,
                y: activeYear,
                m: activeMonth
            };

            const root = document.querySelector('.sp-dashboard-container');
            root.style.setProperty('--rank-color', rank.color);
            root.querySelector('.sp-rank-icon-box').innerHTML = `<img src="${rank.img}" class="sp-rank-img ${rank.label === 'Challenger' ? 'special-fx' : ''}">`;
            root.querySelector('.sp-rank-title').innerText = rank.label;

            const scoreDiff = score - prevScore;
            root.querySelector('#sp-score-val').innerText = score.toLocaleString();
            const diffDisplay = root.querySelector('#sp-score-diff');
            diffDisplay.innerText = `${scoreDiff >= 0 ? '▲' : '▼'} ${Math.abs(scoreDiff).toLocaleString()}`;
            diffDisplay.style.color = scoreDiff >= 0 ? '#ff4e4e' : '#0829ff';

            const stats = {
                totalHrs: hours,
                attendance: days.size,
                streamerCnt: bjs.size,
                dawnRate: totalSec > 0 ? (nowL.dawn + nowV.dawn) / totalSec : 0,
                vodRate: nowL.sec > 0 ? (nowV.sec / nowL.sec) : 0,
                favRate: totalSec > 0 && sortedBJs.length > 0 ? (sortedBJs[0].value / totalSec) : 0,
                weekendRate: totalSec > 0 ? (nowL.wknd + nowV.wknd) / totalSec : 0
            };

            root.querySelector('.sp-badge-area').innerHTML = evaluateAchievements(stats).map(b => `<div class="sp-badge sp-anim-item">${b.title}<div class="sp-tooltip">${b.desc}</div></div>`).join('');
            root.querySelector('#sp-msg-text').innerText = createFeedbackString(stats);

            const cards = root.querySelectorAll('.sp-card');
            [0, 1].forEach(i => {
                const target = sortedBJs[i];
                const name = target?.name || '-';
                const tStr = target ? `${(target.value / 3600).toFixed(1)}시간` : '';
                const img = i === 0 ? pic1 : pic2;

                const cursorStyle = i === 0 ? 'cursor: pointer;' : '';
                const clickHint = i === 0 ? '<div class="sp-click-hint">CLICK ME</div>' : '';

                cards[i].innerHTML = `
                    ${clickHint}
                    <button class="sp-toggle-btn">FOLD</button>
                    <img src="${img}" class="sp-card-img">
                    <div>
                        <div style="font-size:12px; color:#888;">MOST ${i+1}</div>
                        <div style="font-weight:900; font-size:18px;">${name}</div>
                        <div style="font-size:13px; color:var(--rank-color); margin-top:2px; font-weight:700;">${tStr}</div>
                    </div>
                `;

                if (i === 0) cards[i].style.cursor = 'pointer';

                cards[i].querySelector('.sp-toggle-btn').onclick = (e) => { e.stopPropagation(); cards[i].classList.toggle('hidden-mode'); };

                if(i === 0) {
                    cards[i].addEventListener('click', (e) => {
                          if (!e.target.classList.contains('sp-toggle-btn')) {
                           triggerUltraCelebration(pic1, rank.color);
                          }
                    });
                } else {
                }
            });

            cards[2].innerHTML = `<div><div style="display:flex; gap:15px;">
                <div><div style="font-size:11px; color:#00c6ff;">LIVE</div><div style="font-size:20px; font-weight:900;">${(nowL.sec / 3600).toFixed(1)}h</div></div>
                <div><div style="font-size:11px; color:#bb8bff;">VOD</div><div style="font-size:20px; font-weight:900;">${(nowV.sec / 3600).toFixed(1)}h</div></div>
            </div></div>`;

            cards[3].innerHTML = `<div><div style="font-size:13px; color:#888;">ATTENDANCE</div><div style="font-size:32px; font-weight:900; color:#ffd700;">${days.size}일</div></div>`;

            if (AppContext.chartRef) AppContext.chartRef.destroy();
            const wData = new Array(7).fill(0);
            const agg = (t) => (t?.table1?.data || []).forEach(r => { if (r.day) wData[new Date(r.day).getDay()] += convertTimeToSec(r.total_watch_time) / 3600; });
            agg(L1); agg(V1);

            const canvas = document.getElementById('sp-chart');
            if (canvas) {
                AppContext.chartRef = new Chart(canvas, {
                    type: 'bar',
                    data: { labels: ['일', '월', '화', '수', '목', '금', '토'], datasets: [{ data: wData.map(v => v.toFixed(1)), borderRadius: 7, backgroundColor: rank.color }] },
                    options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 15, right: 15, bottom: 5, left: 10 } }, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#888' } }, y: { display: false } } }
                });
            }

            const listEl = document.getElementById('sp-bj-list');
            if (listEl) {
                listEl.innerHTML = '';
                const max = sortedBJs[0]?.value || 1;
                const frag = document.createDocumentFragment();
                const queue = [];

                for (let i = 0; i < Math.min(sortedBJs.length, CONFIG.MAX_ITEMS); i++) {
                    const item = sortedBJs[i];
                    const w = (item.value / max) * 100;
                    const el = document.createElement('div');
                    el.className = 'sp-list-item sp-anim-item';
                    el.style.animationDelay = `${i * 0.03}s`;
                    el.innerHTML = `
                        <div class="sp-idx-badge ${i < 3 ? 'top3' : ''}">${i + 1}</div>
                        <img src="${CONFIG.NO_PROFILE_IMG}" class="sp-list-img" id="list-img-${i}">
                        <div class="sp-list-content">
                            <div class="sp-list-name">${item.name}</div>
                            <div class="sp-list-bar"><div class="sp-list-fill" style="width: ${w}%"></div></div>
                        </div>
                        <div class="sp-row-value" style="font-size:13px; font-weight:700; color:#ccc; margin-left:15px; min-width:50px; text-align:right;">${(item.value / 3600).toFixed(1)}h</div>
                    `;
                    el.onclick = async () => {
                        const t = el.querySelector('.sp-list-name');
                        const im = el.querySelector('.sp-list-img');
                        if (t.innerText === '비공개') {
                            t.innerText = item.name;
                            im.style.filter = 'none';
                            if (im.dataset.real) im.src = im.dataset.real;
                        } else {
                            t.innerText = '비공개';
                            im.style.filter = 'blur(10px)';
                            im.dataset.real = im.src;
                            const defBlob = await fetchImageBlob(CONFIG.NO_PROFILE_IMG);
                            im.src = defBlob;
                        }
                    };
                    frag.appendChild(el);
                    queue.push({ name: item.name, id: `list-img-${i}` });
                }
                listEl.appendChild(frag);

                const batchLoad = async () => {
                    for (let i = 0; i < queue.length; i += 3) {
                        await Promise.all(queue.slice(i, i + 3).map(async q => {
                            const url = await findStreamerImage(q.name);
                            const blob = await fetchImageBlob(url);
                            const t = document.getElementById(q.id);
                            if (t && blob) t.src = blob;
                        }));
                        await new Promise(r => requestAnimationFrame(r));
                    }
                };
                batchLoad();
            }

            const vodListEl = document.getElementById('sp-vod-list');
            if (vodListEl) {
                const vodMap = new Map();
                const vodSources = [...(V1?.chart?.data_stack || []), ...(V1?.chart?.data_stack_vod || []), ...(V1?.chart?.vod_data_stack || [])];

                vodSources.forEach(x => {
                    if (x.bj_nick && x.bj_nick !== '기타') {
                        const sum = (x.data || []).reduce((a, b) => a + b, 0);
                        vodMap.set(x.bj_nick, (vodMap.get(x.bj_nick) || 0) + sum);
                    }
                });
                const sortedVODs = Array.from(vodMap.entries()).map(([n, v]) => ({ name: n, value: v })).sort((a, b) => b.value - a.value);

                vodListEl.innerHTML = '';
                const maxV = sortedVODs[0]?.value || 1;
                const fragV = document.createDocumentFragment();
                const queueV = [];

                for (let i = 0; i < Math.min(sortedVODs.length, CONFIG.MAX_ITEMS); i++) {
                    const item = sortedVODs[i];
                    const w = (item.value / maxV) * 100;
                    const el = document.createElement('div');
                    el.className = 'sp-list-item sp-anim-item';
                    el.style.animationDelay = `${i * 0.03}s`;
                    el.innerHTML = `
                        <div class="sp-idx-badge ${i < 3 ? 'top3' : ''}">${i + 1}</div>
                        <img src="${CONFIG.NO_PROFILE_IMG}" class="sp-list-img" id="vod-list-img-${i}">
                        <div class="sp-list-content">
                            <div class="sp-list-name">${item.name}</div>
                            <div class="sp-list-bar"><div class="sp-list-fill" style="width: ${w}%"></div></div>
                        </div>
                        <div class="sp-row-value" style="font-size:13px; font-weight:700; color:#ccc; margin-left:15px; min-width:50px; text-align:right;">${(item.value / 3600).toFixed(1)}h</div>
                    `;
                    el.onclick = async () => {
                        const t = el.querySelector('.sp-list-name');
                        const im = el.querySelector('.sp-list-img');
                        if (t.innerText === '비공개') {
                            t.innerText = item.name;
                            im.style.filter = 'none';
                            if (im.dataset.real) im.src = im.dataset.real;
                        } else {
                            t.innerText = '비공개';
                            im.style.filter = 'blur(10px)';
                            im.dataset.real = im.src;
                            const defBlob = await fetchImageBlob(CONFIG.NO_PROFILE_IMG);
                            im.src = defBlob;
                        }
                    };
                    fragV.appendChild(el);
                    queueV.push({ name: item.name, id: `vod-list-img-${i}` });
                }
                vodListEl.appendChild(fragV);

                const batchLoadVOD = async () => {
                    for (let i = 0; i < queueV.length; i += 3) {
                        await Promise.all(queueV.slice(i, i + 3).map(async q => {
                            const url = await findStreamerImage(q.name);
                            const blob = await fetchImageBlob(url);
                            const t = document.getElementById(q.id);
                            if (t && blob) t.src = blob;
                        }));
                        await new Promise(r => requestAnimationFrame(r));
                    }
                };
                batchLoadVOD();
            }

            const catArea = document.getElementById('sp-cat-list');
            if (catArea && K1?.table2?.data) {
                const cm = new Map();
                K1.table2.data.forEach(x => { if (x?.skey) cm.set(x.skey, (cm.get(x.skey) || 0) + parseInt(x.cnt || 0)); });
                const sc = Array.from(cm.entries()).sort((a, b) => b[1] - a[1]).slice(0, 7);

                catArea.innerHTML = sc.map((c, i) => `
                    <div class="sp-cat-item">
                        <div class="sp-cat-idx">${i + 1}</div>
                        <div class="sp-cat-img"><img id="cat-pic-${i}" src=""></div>
                        <div class="sp-cat-txt">${c[0]}</div>
                        <div class="sp-cat-cnt">${c[1]}회</div>
                    </div>
                `).join('');

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${Endpoints.SEARCH}?m=categoryList&szOrder=prefer&nListCnt=100`,
                    onload: (r) => {
                        try {
                            const lst = JSON.parse(r.responseText)?.data?.list || [];
                            sc.forEach((c, i) => {
                                const f = lst.find(it => it.category_name === c[0]);
                                const u = f?.cate_img || (f?.cate_no ? `https://res.sooplive.co.kr/images/category/${f.cate_no}.jpg` : "");
                                const el = document.getElementById(`cat-pic-${i}`);
                                if (el && u) fetchImageBlob(u).then(b => el.src = b);
                            });
                        } catch { }
                    }
                });
            }

            const cal = root.querySelector('.sp-cal-grid');
            let h = '';
            const off = new Date(activeYear, activeMonth - 1, 1).getDay();
            for (let i = 0; i < off; i++) h += '<div class="sp-cal-day" style="visibility:hidden;"></div>';
            for (let d = 1; d <= endD; d++) {
                const k = makeDate(activeYear, activeMonth, d);
                h += `<div class="sp-cal-day ${days.has(k) ? 'active' : ''}">${d}</div>`;
            }
            cal.innerHTML = h;

            setTimeout(() => root.querySelectorAll('.sp-anim-item').forEach(e => e.classList.add('sp-anim-show')), 100);

        } catch (e) {
            console.error(e);
        }

        if (loader) loader.style.display = 'none';
    }

    const createSummaryCard = () => {
        if (!AppContext.lastResult) return alert("분석 완료 후 사용하세요.");
        const d = AppContext.lastResult;
        const bg = localStorage.getItem('sr_bg_url') || CONFIG.DEFAULT_BG;

        const ov = document.createElement('div');
        ov.className = 'sp-id-overlay';
        ov.innerHTML = `
            <div class="sp-license-card" style="--rank-color: ${d.rankData.color}">
                <div class="sp-lc-bg" style="background-image: url('${bg}')"></div>
                <div class="sp-lc-fx"></div>
                <div class="sp-lc-content">
                    <div class="sp-lc-head">
                        <div class="sp-lc-title">WATCHER LICENSE</div>
                        <div class="sp-lc-date">${d.y}.${String(d.m).padStart(2, '0')}</div>
                    </div>
                    <div class="sp-lc-body">
                        <img src="${d.rankData.img}" class="sp-lc-icon">
                        <div class="sp-lc-grid">
                            <div class="sp-lc-item">
                                <div class="sp-lc-lbl">TOTAL HOURS</div>
                                <div class="sp-lc-val">${d.totalHours.toFixed(1)}h</div>
                            </div>
                            <div class="sp-lc-item">
                                <div class="sp-lc-lbl">ATTENDANCE</div>
                                <div class="sp-lc-val" style="color:#ffd700;">${d.activeDays} DAYS</div>
                            </div>
                            <div class="sp-lc-item" style="grid-column:span 2; border-left:none; padding:0;">
                                <div class="sp-lc-lbl" style="margin-bottom:8px;">TOP STREAMER</div>
                                <div class="sp-lc-top"><img src="${d.topImg}"><span>${d.topName}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="sp-lc-foot">
                        <div class="sp-lc-user">SOOP WATCHER</div>
                        <div style="font-size:12px; opacity:0.6;">SOOP RECAP</div>
                    </div>
                </div>
            </div>
            <div style="display:flex; gap:10px;">
                <button id="sp-save-card" style="padding:12px 30px; font-weight:800; border-radius:12px; border:none; background:#fff; cursor:pointer;">💾 저장</button>
                <button id="sp-close-card" style="padding:12px 30px; font-weight:800; border-radius:12px; border:none; background:#333; color:#fff; cursor:pointer;">닫기</button>
            </div>
        `;
        document.body.appendChild(ov);

        document.getElementById('sp-save-card').onclick = async () => {
            const card = ov.querySelector('.sp-license-card');
            const i = new Image(); i.src = bg; await new Promise(r => i.onload = r);
            html2canvas(card, { useCORS: true, scale: 2, backgroundColor: '#111' }).then(c => {
                const a = document.createElement('a'); a.download = 'LICENSE.png'; a.href = c.toDataURL(); a.click();
            });
        };
        document.getElementById('sp-close-card').onclick = () => ov.remove();
    };

    const launch = () => {
        const btn = document.createElement('button');
        btn.id = 'sp-launch-btn';
        btn.innerText = "CHECK MY RECAP";

        const p = JSON.parse(localStorage.getItem('sr_pos_data') || '{"right":"30px","bottom":"30px"}');
        Object.assign(btn.style, { right: p.right, bottom: p.bottom, left: p.left || 'auto', top: p.top || 'auto' });

        document.body.appendChild(btn);

        let d = false, o = { x: 0, y: 0 };
        btn.onmousedown = e => { d = true; const r = btn.getBoundingClientRect(); o.x = e.clientX - r.left; o.y = e.clientY - r.top; btn.style.transition = 'none'; };
        document.onmousemove = e => { if (d) { btn.style.left = (e.clientX - o.x) + 'px'; btn.style.top = (e.clientY - o.y) + 'px'; btn.style.right = 'auto'; btn.style.bottom = 'auto'; } };
        document.onmouseup = () => { if (d) { d = false; btn.style.transition = 'all 0.3s'; localStorage.setItem('sr_pos_data', JSON.stringify({ left: btn.style.left, top: btn.style.top })); } };
        btn.onclick = () => { if (!d) initDashboard(); };

        setInterval(() => {
            const f = document.fullscreenElement || document.webkitFullscreenElement || document.body.classList.contains('full_screen') || document.body.classList.contains('screen_mode');
            if (f) btn.classList.add('sp-invisible');
            else btn.classList.remove('sp-invisible');
        }, 1000);
    };

    launch();
})();