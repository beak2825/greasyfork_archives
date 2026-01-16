// ==UserScript==
// @name          SOOP 리캡
// @license       MIT
// @namespace     http://tampermonkey.net/
// @version       1.6.7
// @description   본인의 시청 기록을 화려한 리캡으로 확인하세요! (제작: 헤슷)
// @author        헤슷
// @match         https://www.sooplive.co.kr/*
// @match         https://play.sooplive.co.kr/*
// @match         https://broadstatistic.sooplive.co.kr/*
// @connect       sooplive.co.kr
// @connect       sch.sooplive.co.kr
// @connect       res.sooplive.co.kr
// @connect       afevent2.sooplive.co.kr
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @require       https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/562690/SOOP%20%EB%A6%AC%EC%BA%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/562690/SOOP%20%EB%A6%AC%EC%BA%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_BG = "https://i.ibb.co/Z6BXDfRH/20260112-235411-1.png";
    const SEARCH_API_URL = 'https://sch.sooplive.co.kr/api.php';
    const STATS_API_URL = 'https://broadstatistic.sooplive.co.kr/api/watch_statistic.php';
    const INFO_API_URL = 'https://afevent2.sooplive.co.kr/api/get_private_info.php';

    let currentUserId = "";
    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth() + 1;
    let weeklyChart = null;
    let rankChart = null;

    const parseHMSToSeconds = (t) => { if (!t || typeof t !== 'string') return 0; const p = t.split(':').map(Number); while (p.length < 3) p.unshift(0); return (p[0] * 3600) + (p[1] * 60) + p[2]; };

    const getBase64Image = (url) => new Promise((resolve) => {
        if (!url) return resolve("");
        GM_xmlhttpRequest({
            method: "GET", url: url, responseType: "arraybuffer",
            onload: (res) => {
                const blob = new Blob([res.response], { type: res.responseHeaders.match(/content-type:\s*(\S+)/i)?.[1] || 'image/png' });
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            },
            onerror: () => resolve("https://res.sooplive.co.kr/images/common/thumb_profile.gif")
        });
    });

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap');

        #custom-recap-btn {
            position: fixed; z-index: 10000; padding: 16px 28px;
            background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); color: white; border: none;
            border-radius: 15px; cursor: move; font-family: 'Pretendard'; font-weight: 800;
            box-shadow: 0 10px 30px rgba(0, 114, 255, 0.4);
            transition: opacity 0.3s, visibility 0.3s;
            user-select: none; touch-action: none;
        }
        #custom-recap-btn.hidden { opacity: 0; visibility: hidden; pointer-events: none; }

        #recap-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 5, 10, 0.95); backdrop-filter: blur(25px); z-index: 100001; display: block; overflow-y: scroll !important; padding: 50px 0; box-sizing: border-box; }

        .recap-window { background: #0a0a0f; color: #fff; width: 1200px !important; border-radius: 45px; margin: 0 auto; position: relative; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 50px 150px rgba(0,0,0,0.8); height: auto !important; min-height: 1000px; font-family: 'Pretendard'; overflow: visible; }

        /* [수정] 헤더 영역 높이 고정 및 배경 넘침 완벽 차단 */
        .recap-header-section {
            height: 660px;
            background-repeat: no-repeat !important;
            background-position: center center !important;
            background-size: cover !important;
            border-radius: 45px 45px 0 0;
            overflow: hidden;
            position: relative;
        }

        /* [수정] 하단 본문색(#0a0a0f)과 자연스럽게 이어지도록 그라데이션 강화 */
        .header-glass-inner {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom,
                rgba(10, 10, 20, 0) 0%,
                rgba(10, 10, 20, 0.2) 50%,
                rgba(10, 10, 20, 0.8) 85%,
                #0a0a0f 100%) !important;
            padding: 60px 60px 50px 60px;
            box-sizing: border-box;
            z-index: 2;
            display: flex;
            flex-direction: column;
        }

        /* [수정] 헤더와 본문 사이의 미세한 틈새 방지 */
        .recap-body-section {
            background: #0a0a0f;
            padding: 20px 60px 180px 60px;
            border-radius: 0 0 45px 45px;
            position: relative;
            margin-top: -2px;
            z-index: 3;
        }

        .ai-insult-box { background: linear-gradient(90deg, rgba(0, 198, 255, 0.1), rgba(0, 255, 178, 0.1)); border-left: 5px solid #00ffb2; padding: 25px 35px; border-radius: 20px; margin-bottom: 40px; font-size: 20px; font-weight: 800; color: #e0f9ff; line-height: 1.5; display: flex; align-items: center; gap: 15px; }

        #particle-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

        /* MOST 1 카드 호버 반응 */
        .stat-card:first-child { transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; cursor: pointer; }
        .stat-card:first-child:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 0 30px var(--tier-color); border-color: var(--tier-color); }
        .stat-card:first-child::before { content: "CLICK ME! 🎁"; position: absolute; top: 10px; right: 15px; background: var(--tier-color); color: #000; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 10px; opacity: 0; transform: translateY(10px); transition: 0.3s; }
        .stat-card:first-child:hover::before { opacity: 1; transform: translateY(0); }

        /* 성대한 폭죽 연출용 애니메이션 (위치 조정 포함) */
        @keyframes grand-reveal {
            0% { transform: translate(-50%, -30%) scale(0); filter: brightness(3); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); opacity: 1; }
        }

        .grand-gift-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(15px);
            z-index: 1000000; display: flex; align-items: center; justify-content: center;
        }

        .grand-profile-img {
            position: fixed; top: 50%; left: 50%;
            width: 420px; height: 420px;
            border-radius: 50%; border: 15px solid #fff;
            box-shadow: 0 0 80px var(--tier-color);
            object-fit: cover; z-index: 1000001;
            animation: grand-reveal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .grand-text {
            position: fixed; top: 82%; left: 50%; transform: translateX(-50%);
            font-size: 45px; font-weight: 950; color: #fff;
            text-shadow: 0 0 20px var(--tier-color); z-index: 1000001;
            animation: grand-reveal 0.6s 0.2s both;
        }

        /* 공통 UI 요소 */
        .tier-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; padding: 20px 45px; background: rgba(255,255,255,0.03); border-radius: 35px; border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); }
        .tier-visual { display: flex; align-items: center; gap: 15px; }
        .tier-img-box { width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; position: relative; }
        .tier-img-icon { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px var(--tier-color)); transform: scale(1.2); transition: transform 0.2s; }
        .tier-img-icon.is-challenger { transform: scale(1.45); }
        .tier-name { font-size: 58px; font-weight: 900; color: var(--tier-color); text-transform: uppercase; letter-spacing: -2px; text-shadow: 0 0 20px var(--tier-color); }

        .cafe-link-btn { background-image: url('https://i.ibb.co/DDCy7PW3/1.jpg'); background-size: cover; background-position: center; color: #fff; border: 2px solid rgba(255,255,255,0.2); padding: 16px 30px; border-radius: 22px; font-size: 18px; font-weight: 900; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; font-family: 'Pretendard'; position: relative; overflow: hidden; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .cafe-link-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .cafe-link-btn::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.2); z-index: 0; }
        .cafe-link-btn span { position: relative; z-index: 1; }

        .month-selector-area { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; align-items: center; }
        .recap-select { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 25px; border-radius: 12px; font-size: 18px; font-weight: 800; cursor: pointer; outline: none; }
        .badge-container { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-bottom: 50px; min-height: 60px; }
        .badge-item { background: rgba(255,255,255,0.1); padding: 0 26px; height: 48px; border-radius: 16px; font-size: 16px; font-weight: 800; color: #ffd700; border: 1.5px solid rgba(255,215,0,0.2); display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; transition: 0.3s; }
        .badge-item:hover { transform: translateY(-5px); background: rgba(255,215,0,0.15); border-color: #ffd700; }
        .custom-tooltip { position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); background: rgba(20, 20, 30, 0.95); color: #fff; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; white-space: nowrap; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); pointer-events: none; opacity: 0; transition: 0.3s; visibility: hidden; }
        .badge-item:hover .custom-tooltip { opacity: 1; visibility: visible; bottom: 115%; }
        .top-rank-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
        .stat-card { background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 15px; box-sizing: border-box; backdrop-filter: blur(5px); }
        .rank-img { width: 80px; height: 80px; border-radius: 22px; border: 3px solid #00c6ff; object-fit: cover; }
        .main-layout { display: grid !important; grid-template-columns: 480px 1fr !important; gap: 40px !important; align-items: start; }
        .section-box { background: rgba(255, 255, 255, 0.02); padding: 45px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.06); box-sizing: border-box; height: auto !important; }
        .cal-header-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; text-align: center; margin-bottom: 15px; font-size: 14px; font-weight: 900; color: #666; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; width: 100%; }
        .cal-day { aspect-ratio: 1/1; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.08); }
        .cal-active { background: linear-gradient(135deg, #00c6ff, #0072ff); color: #fff !important; box-shadow: 0 8px 20px rgba(0, 114, 255, 0.4); }

        .category-rank-area { margin-top: 80px; }
        .category-rank-list { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
        .category-item { background: rgba(255,255,255,0.05); padding: 10px 18px; border-radius: 18px; display: flex; align-items: center; gap: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .cat-num { font-weight: 900; color: #00c6ff; width: 20px; font-size: 16px; }
        .cat-img-box { width: 30px; height: 30px; border-radius: 6px; background: #333; overflow: hidden; }
        .cat-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .cat-name-box { font-weight: 700; flex: 1; color: #ddd; font-size: 15px; }
        .cat-cnt-box { background: rgba(0, 114, 255, 0.3); color: #fff; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }

        .tools-area { position: absolute; bottom: 50px; left: 60px; right: 60px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 35px; }
        .modern-upload-label { display: flex; align-items: center; gap: 12px; padding: 14px 28px; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); cursor: pointer; color: #eee; font-weight: 800; font-size: 16px; }
        .screenshot-btn { background: #fff; color: #000; border: none; padding: 16px 50px; border-radius: 22px; font-size: 18px; font-weight: 900; cursor: pointer; }
        #bg-file-input { display: none; }
        .close-btn { position: absolute; top: 40px; right: 40px; background: rgba(255,255,255,0.2); border: none; color: #fff; width: 55px; height: 55px; border-radius: 50%; cursor: pointer; font-size: 24px; z-index: 1000; }
        #mmr-diff { font-size: 16px; margin-top: 5px; font-weight: 800; }
        .diff-up { color: #ff4e4e; } .diff-down { color: #005eff; }
        .loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); border-radius: 45px; display: none; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; z-index: 100; }
    `);

    const getHealingMessage = (s) => {
        const h = Math.floor(s.totalHours || 0); const d = s.activeDays || 0; const dr = s.dawnRatio || 0; const vr = s.vodRatio || 0; const wr = s.weekendRatio || 0; const t1r = s.top1Ratio || 0; const bc = s.bjCount || 0; const mc = s.mostCategory || "다양한 방송";
        if (h >= 500) return `🌌 당신은 SOOP의 살아있는 전설! 한 달 중 ${h}시간이나 방송을 지켜주신 덕분에 스트리머들은 정말 행복했을 거예요. 당신이 숲의 주인입니다.`;
        if (d >= 30) return `🛡️ 365일 변치 않는 소나무 같은 분! ${d}일 내내 스트리머를 찾아주신 당신의 성실함은 그 어떤 다이아몬드보다 값진 선물입니다.`;
        if (dr > 0.6) return `🦇 고요한 밤의 수호자님! 시청의 절반 이상을 새벽 시간에 함께해주셨네요. 고독한 스트리머의 밤을 밝게 비춰주셔서 진심으로 고마워요.`;
        if (t1r > 0.7) return `🧡 진정한 일편단심! 오직 한 스트리머를 위해 전체 시청의 ${Math.round(t1r*100)}%를 쏟아부으셨네요. 당신 같은 팬이 있다는 건 스트리머에게 가장 큰 축복입니다.`;
        if (vr > 2.0) return `🍿 다시보기 마스터! 놓친 방송도 끝까지 챙겨보시는 당신의 꼼꼼함 덕분에 스트리머의 모든 노력이 헛되지 않고 빛을 발하네요.`;
        if (wr > 0.5) return `🔥 뜨거운 주말의 전사! 평일의 피로를 숲에서 풀며 주말 내내 열정적으로 시청하셨군요. 당신의 주말 에너지가 숲을 가득 채웠습니다.`;
        if (bc >= 40) return `🌍 숲의 만물박사! 무려 ${bc}명의 스트리머를 만나며 소통하셨네요. 넓은 마음으로 많은 스트리머를 응원해주시는 당신은 숲의 진정한 홍보대사입니다.`;
        if (mc.includes("게임")) return `🎮 '${mc}' 정복자! 전략과 컨트롤을 넘나드는 시청 감각을 가지셨군요. 스트리머의 플레이 하나하나에 열광해주셔서 감사합니다.`;
        if (mc.includes("토크") || mc.includes("소통")) return `💬 소통의 고수! 스트리머의 이야기에 귀 기울이고 마음을 나눠주신 ${h}시간 덕분에 방송이 따뜻한 사랑방이 되었어요.`;
        if (h >= 100) return `✨ 든든한 숲의 조력자! 이번 달 ${h}시간 동안 보내주신 따뜻한 시선과 채팅이 스트리머들이 방송을 이어갈 수 있는 원동력이 되었습니다.`;
        if (d >= 15) return `📅 벌써 ${d}일이나 오셨네요! 스트리머에게 "오늘도 오셨네요?"라는 말을 듣기에 충분한 단골 시청자님, 늘 그 자리에 있어주셔서 감사해요.`;
        return `🌱 이번 달에도 숲과 함께 ${h}시간의 소중한 추억을 만들어주셔서 고마워요. 당신의 발걸음 하나하나가 숲을 더 푸르고 아름답게 만듭니다!`;
    };

    const getBadges = (s) => {
        const b = []; const h = s.totalHours || 0; const d = s.activeDays || 0; const dr = s.dawnRatio || 0; const vr = s.vodRatio || 0; const t1r = s.top1Ratio || 0; const bc = s.bjCount || 0; const wr = s.weekendRatio || 0;
        if (h >= 500) b.push({name: "🌌 SOOP의 신", desc: "한 달 500시간 이상 시청한 초고수"});
        else if (h >= 300) b.push({name: "👑 SOOP 성주", desc: "한 달 300시간 이상 꾸준히 시청"});
        else if (h >= 150) b.push({name: "💎 숲의 지배자", desc: "한 달 150시간 이상 즐겨봄"});
        else if (h >= 80) b.push({name: "🥇 프로 시청러", desc: "한 달 80시간 이상 시청"});
        else if (h >= 30) b.push({name: "🥉 루키 시청자", desc: "한 달 30시간 이상 시청"});
        if (d >= 28) b.push({name: "🛡️ 전설의 수호자", desc: "한 달 내내 매일 접속"});
        else if (d >= 20) b.push({name: "📅 개근의 신", desc: "한 달 중 20일 이상 접속"});
        else if (d >= 10) b.push({name: "🏃 성실한 발걸음", desc: "한 달 중 10일 이상 접속"});
        if (dr > 0.5) b.push({name: "蝙 심야의 박쥐", desc: "시청의 절반 이상이 새벽 시간"});
        else if (dr > 0.2) b.push({name: "🌙 올빼미 수호자", desc: "새벽에 자주 시청"});
        if (vr > 1.5) b.push({name: "🍿 VOD 광인", desc: "라이브보다 다시보기를 훨씬 더 많이 봄"});
        else if (h > 20 && vr < 0.1) b.push({name: "📡 생방 사수단", desc: "다시보기보다 실시간 소통을 사랑함"});
        if (t1r > 0.6) b.push({name: "🧡 일편단심", desc: "한 스트리머만 집중해서 시청"});
        if (bc >= 25) b.push({name: "🌍 박애주의자", desc: "여러 스트리머를 골고루 시청"});
        if (wr > 0.3) b.push({name: "🔥 주말의 전사", desc: "주말에 몰아서 시청하는 스타일"});
        if (b.length === 0) b.push({name: "🌱 새싹 와쳐", desc: "가볍게 즐기는 시청자"});
        return b;
    };

    const getTier = (score) => {
        if (score >= 7000) return { name: "Challenger", color: "#FFD700", icon: "https://i.ibb.co/yB4SN6hD/A3s1-WNn-Bx55t-K-9w-BNz-We-IE5-Ywz-Ffbb-DVe-BI64-N6-R1-Le-Oad-OYCdn-Q2-XNBKgo-P9-Gdc2-LCQ0-Ul-ZKx-GUA5-Ekz-D.webp" };
        if (score >= 4500) return { name: "Grandmaster", color: "#ff4e4e", icon: "https://i.ibb.co/KzFyV8B8/o-M-0sr-E7-Viko4-Jq-Yw-R2-ncqc8-Jw-VIMk-Xwet2r-E87j-YF12d-Bp4-Zz-XVhvus-CGs-Rze-Ry-Osy-M4bh-HBHM2s-OXm8-O.webp" };
        if (score >= 3500) return { name: "Master", color: "#be8bff", icon: "https://i.ibb.co/V0kRfqNJ/SZPPC-Fh0zx-Q8-ZDLy-E-UW6gyoo-Tp-f-Dcdtg48hlzdktt-IGEa5a-X5fn-UIZph3bsrzcspez-Sgw9n-Df-MIcm2-Tv-Y6-rkq.webp" };
        if (score >= 1500) return { name: "Diamond", color: "#57d5ff", icon: "https://i.ibb.co/twKGL32v/CQ5mlw-WS7-SGMx-I6i-Afr-US8p-NU99-EBp7r-u-Ve-Bgo-Bp-BM4-SWHRY9-Vbn02im-Rgeocb2-5h-Hx-Mg-ELkpcrzmt4n-Xi-C.webp" };
        if (score >= 900) return { name: "Emerald", color: "#2ecc71", icon: "https://i.ibb.co/KPV3z0C/r-SG5-O90-Kus-Py-No-Uzkw6-Qok0d-P-n-Tjud-ASd-Cq-Lvva-XSjw-C7-Im-Mpkw-Z0pi-NHg-Ska-I73ycua-CF0u9kgr-Bno-G.webp" };
        if (score >= 500) return { name: "Platinum", color: "#3498db", icon: "https://i.ibb.co/C5gz0n9D/9-YGk-Zi-X8j5ajb78-C1yo-IPJk-Eh63k3y-Itr-Gj-SL3dw2-Ld-Hygs-GDCi-S7x4-AADJx-JGa-QLj6-UPmxw-FT-RFHp-Egp0w.webp" };
        if (score >= 300) return { name: "Gold", color: "#f1c40f", icon: "https://i.ibb.co/Zpk9kHtH/r-K2-g-Iv-Fsqg-MKS0-YN9-Wc1-Bv-XSn2-Ekqg-YOl-Dg-VMob4e-Ea3-Qq63w4-QMNVpi-XTFw-WY3u-EBQi-Bv3-SEYEJ6-Ekqc8j-FO.webp" };
        if (score >= 150) return { name: "Silver", color: "#bdc3c7", icon: "https://i.ibb.co/d4NZC5Yj/Bp3-QFKGm76-Vp-CQZYDx-IIey4-n-PZd59-Fr47st-N-Xa3-Mj-FNu-W1g-NGQb5-CKt-Logsth-TZDkf-Xa-Z7ji-AQTsi-W-xd-Cb.webp" };
        return { name: "Bronze", color: "#cd7f32", icon: "https://i.ibb.co/zWSJkYZn/KWb-D6-Au2kz-D5o-YWKewl-JGf3-Ubk-NUOb-Wqn-Tc-VHRE9q-Nu-NRQu-Ja-Bc-Xh1-BQ57pd-Fs1-Fgr-CLYDtnk-MGKLh4-Mre-Q.webpL" };
    };

    const fetchRawData = (id, start, end, mod) => new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "POST", url: STATS_API_URL,
            data: new URLSearchParams({ szModule: mod, szMethod: 'watch', szStartDate: start, szEndDate: end, nPage: 1, szId: id }).toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => { try { resolve(JSON.parse(res.responseText).data || null); } catch { resolve(null); } },
            onerror: () => resolve(null)
        });
    });

    const updateRecapData = async () => {
        const loading = document.getElementById('loading-recap');
        if (loading) loading.style.display = 'flex';
        try {
            const start = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`, end = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${new Date(selectedYear, selectedMonth, 0).getDate()}`;
            const prevMonthDate = new Date(selectedYear, selectedMonth - 2, 1);
            const pStart = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-01`, pEnd = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0).getDate()}`;
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
                    if (s > 0) { sec += s; days.add(r.day); const dayOfWeek = new Date(r.day).getDay(); if (dayOfWeek === 0 || dayOfWeek === 6) weekendSec += s; }
                });
                const stack = data?.chart?.data_stack || data?.chart?.data_stack_vod || data?.chart?.vod_data_stack || [];
                stack.forEach(s => {
                    if(s.bj_nick && s.bj_nick !== '기타') streamers.add(s.bj_nick);
                    if(s.data) s.data.forEach((v, i) => { if(i >= 1 && i <= 6) dawnSec += v; });
                });
                return { sec, days, streamers, dawnSec, weekendSec };
            };

            const curL = processStats(liveD), curV = processStats(vodD), preL = processStats(pLiveD), preV = processStats(pVodD);
            const totalSec = curL.sec + curV.sec, totalHours = totalSec / 3600;
            const activeDays = new Set([...curL.days, ...curV.days]);
            const streamers = new Set([...curL.streamers, ...curV.streamers]);
            const MMR = Math.floor((totalHours * 12) + (activeDays.size * 60) + (streamers.size * 15));
            const prevMMR = Math.floor(((preL.sec+preV.sec)/3600 * 12) + (new Set([...preL.days, ...preV.days]).size * 60) + (new Set([...preL.streamers, ...preV.streamers]).size * 15));
            const mmrDiff = MMR - prevMMR;

            const streamerMap = new Map();
            [...(liveD?.chart?.data_stack || []), ...(vodD?.chart?.data_stack_vod || [])].forEach(s => {
                if(s.bj_nick && s.bj_nick !== '기타') streamerMap.set(s.bj_nick, (streamerMap.get(s.bj_nick) || 0) + (s.data || []).reduce((a,b)=>a+b, 0));
            });
            const streamerList = Array.from(streamerMap.entries()).map(([nick, total]) => ({ nick, total })).sort((a,b) => b.total - a.total);
            const catMap = new Map();
            (liveC?.table2?.data || []).forEach(item => { if(item?.skey) catMap.set(item.skey, (catMap.get(item.skey) || 0) + parseInt(item.cnt || 0)); });
            const sortedCategories = Array.from(catMap.entries()).sort((a,b) => b[1] - a[1]).slice(0, 7);
            const badgeStats = { totalHours, activeDays: activeDays.size, dawnRatio: totalSec > 0 ? (curL.dawnSec + curV.dawnSec) / totalSec : 0, vodRatio: curL.sec > 0 ? (curV.sec / curL.sec) : 0, bjCount: streamers.size, top1Ratio: totalSec > 0 && streamerList.length > 0 ? (streamerList[0].total / totalSec) : 0, weekendRatio: totalSec > 0 ? (curL.weekendSec + curV.weekendSec) / totalSec : 0, mostCategory: sortedCategories[0]?.[0] || "전체" };

            const win = document.querySelector('.recap-window');
            const tier = getTier(MMR);
            win.style.setProperty('--tier-color', tier.color);

            if(weeklyChart) {
                const wd = new Array(7).fill(0);
                [...(liveD?.table1?.data || []), ...(vodD?.table1?.data || [])].forEach(r => { if(r.day) wd[new Date(r.day).getDay()] += parseHMSToSeconds(r.total_watch_time)/3600; });
                weeklyChart.data.datasets[0].data = wd.map(v => v.toFixed(1));
                weeklyChart.data.datasets[0].backgroundColor = tier.color;
                weeklyChart.data.datasets[0].shadowColor = tier.color;
                weeklyChart.update();
            }
            if(rankChart) {
                rankChart.data.labels = streamerList.map(s => s.nick);
                rankChart.data.datasets[0].data = streamerList.map(s => (s.total / 3600).toFixed(1));
                rankChart.data.datasets[0].backgroundColor = tier.color;
                rankChart.data.datasets[0].shadowColor = tier.color;
                rankChart.canvas.parentNode.style.height = `${Math.max(400, streamerList.length * 40)}px`;
                rankChart.update();
            }

            win.querySelector('.tier-visual').innerHTML = `<div class="tier-img-box"><img src="${tier.icon}" class="tier-img-icon ${tier.name === 'Challenger' ? 'is-challenger' : ''}"></div><div class="tier-name">${tier.name}</div>`;
            win.querySelector('#mmr-val').innerText = MMR.toLocaleString();
            win.querySelector('#mmr-diff').innerText = `${mmrDiff >= 0 ? '▲' : '▼'} ${Math.abs(mmrDiff).toLocaleString()}`;
            win.querySelector('#mmr-diff').className = mmrDiff >= 0 ? 'diff-up' : 'diff-down';
            win.querySelector('.badge-container').innerHTML = getBadges(badgeStats).map(b => `<div class="badge-item">${b.name}<div class="custom-tooltip">${b.desc || ''}</div></div>`).join('');
            win.querySelector('#ai-insult').innerText = getHealingMessage(badgeStats);

            const getLogo = (n) => new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `${SEARCH_API_URL}?m=searchHistory&service=list&d=${encodeURIComponent(n)}`, onload: (res) => { try { const d = JSON.parse(res.responseText); r(d?.suggest_bj?.find(s => s.user_nick === n)?.station_logo || ""); } catch { r(""); } } }));
            const [raw1, raw2] = await Promise.all([getLogo(streamerList[0]?.nick), getLogo(streamerList[1]?.nick)]);
            const [img1, img2] = await Promise.all([getBase64Image(raw1), getBase64Image(raw2)]);

            const cards = win.querySelectorAll('.stat-card');

            // MOST 1 카드 설정 (폭죽 이벤트 포함)
            cards[0].innerHTML = `<img src="${img1 || 'https://res.sooplive.co.kr/images/common/thumb_profile.gif'}" class="rank-img"><div><div style="font-size:13px; color:#888;">MOST 1</div><div style="font-weight:900;">${streamerList[0]?.nick || '-'}</div></div>`;
            cards[0].onclick = () => {
                if (document.querySelector('.grand-gift-overlay')) return;

                const overlay = document.createElement('div');
                overlay.className = 'grand-gift-overlay';
                overlay.innerHTML = `
                    <img src="${img1 || 'https://res.sooplive.co.kr/images/common/thumb_profile.gif'}" class="grand-profile-img">
                    <div class="grand-text">👑 MY BEST STR: ${streamerList[0]?.nick} 👑</div>
                `;
                document.body.appendChild(overlay);

                const createFireworks = (startX, startY, count) => {
                    for (let i = 0; i < count; i++) {
                        const p = document.createElement('div');
                        const colors = ['#FFD700', '#FFFFFF', '#FF4E4E', '#00C6FF', '#FF00FF', '#7FFF00'];
                        const size = Math.random() * 12 + 6;
                        Object.assign(p.style, {
                            position: 'fixed', left: startX, top: startY,
                            width: `${size}px`, height: `${size}px`,
                            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                            borderRadius: '50%', zIndex: '1000002', pointerEvents: 'none',
                            boxShadow: `0 0 ${size}px #fff`
                        });
                        document.body.appendChild(p);

                        const angle = Math.random() * Math.PI * 2;
                        const velocity = 10 + Math.random() * 35;
                        let posX = 0, posY = 0, gravity = 0, opacity = 1;
                        const move = () => {
                            posX += Math.cos(angle) * velocity;
                            posY += Math.sin(angle) * velocity + gravity;
                            gravity += 0.4; opacity -= 0.015;
                            p.style.transform = `translate(${posX}px, ${posY}px)`;
                            p.style.opacity = opacity;
                            if (opacity > 0) requestAnimationFrame(move); else p.remove();
                        };
                        move();
                    }
                };

                const points = [['50%', '50%'], ['30%', '40%'], ['70%', '40%'], ['20%', '60%'], ['80%', '60%']];
                points.forEach((pt, idx) => {
                    setTimeout(() => createFireworks(pt[0], pt[1], 100), idx * 150);
                });

                setTimeout(() => {
                    overlay.style.transition = 'opacity 0.8s';
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 800);
                }, 4000);
            };

            cards[1].innerHTML = `<img src="${img2 || 'https://res.sooplive.co.kr/images/common/thumb_profile.gif'}" class="rank-img"><div><div style="font-size:13px; color:#888;">MOST 2</div><div style="font-weight:900;">${streamerList[1]?.nick || '-'}</div></div>`;
            cards[2].innerHTML = `<div><div style="display:flex; gap:15px;"><div><div style="font-size:11px; color:#00c6ff;">LIVE</div><div style="font-size:20px; font-weight:900;">${(curL.sec/3600).toFixed(1)}h</div></div><div><div style="font-size:11px; color:#bb8bff;">VOD</div><div style="font-size:20px; font-weight:900;">${(curV.sec/3600).toFixed(1)}h</div></div></div></div>`;
            cards[3].innerHTML = `<div><div style="font-size:13px; color:#888;">ATTENDANCE</div><div style="font-size:32px; font-weight:900; color:#ffd700;">${activeDays.size}일</div></div>`;

            const catContainer = document.getElementById('category-ranking-list');
            catContainer.innerHTML = sortedCategories.map((c, i) => `<div class="category-item"><div class="cat-num">${i+1}</div><div class="cat-img-box"><img id="cat-img-load-${i}" src="" style="display:none;"></div><div class="cat-name-box">${c[0]}</div><div class="cat-cnt-box">${c[1]}회</div></div>`).join('');
            (async () => {
                const categoryData = await new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `${SEARCH_API_URL}?m=categoryList&szOrder=prefer&nListCnt=100`, onload: res => { try { r(JSON.parse(res.responseText)); } catch { r({}); } } }));
                const list = categoryData?.data?.list || [];
                for (let i = 0; i < sortedCategories.length; i++) {
                    const found = list.find(item => item.category_name === sortedCategories[i][0]);
                    let imgUrl = found?.cate_img || (found?.cate_no ? `https://res.sooplive.co.kr/images/category/${found.cate_no}.jpg` : "");
                    if (imgUrl) { const base64 = await getBase64Image(imgUrl); const imgEl = document.getElementById(`cat-img-load-${i}`); if (imgEl && base64) { imgEl.src = base64; imgEl.style.display = 'block'; } }
                }
            })();

            const calGrid = win.querySelector('.calendar-grid');
            let h_cal = ''; for(let i=0; i<new Date(selectedYear, selectedMonth - 1, 1).getDay(); i++) h_cal += '<div class="cal-day" style="visibility:hidden;"></div>';
            for(let d=1; d<=new Date(selectedYear, selectedMonth, 0).getDate(); d++) h_cal += `<div class="cal-day ${activeDays.has(`${selectedYear}-${String(selectedMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`) ?'cal-active':''}">${d}</div>`;
            calGrid.innerHTML = h_cal;

        } catch(e) { console.error(e); }
        if (loading) loading.style.display = 'none';
    };

    const renderBaseRecap = async () => {
        if (!currentUserId) { const userRes = await new Promise(r => GM_xmlhttpRequest({ method: "GET", url: INFO_API_URL, onload: res => r(JSON.parse(res.responseText).CHANNEL) })); currentUserId = userRes.LOGIN_ID; }
        const savedBg = localStorage.getItem('soop_recap_local_bg') || DEFAULT_BG;
        let overlay = document.getElementById('recap-modal-overlay');
        if (!overlay) { overlay = document.createElement('div'); overlay.id = 'recap-modal-overlay'; document.body.appendChild(overlay); }
        overlay.innerHTML = `
            <div class="recap-window">
                <div class="recap-header-section" id="recap-header-bg" style="background-image: url('${savedBg}');">
                    <div class="header-glass-inner">
                        <button class="close-btn" id="close-recap">✕</button>
                        <div class="tier-header"><div class="tier-visual"></div><div style="text-align:right;"><div style="font-size:16px; color:rgba(255,255,255,0.4); font-weight:700;">WATCHER MMR</div><div id="mmr-val" style="font-size:42px; font-weight:900;">0</div><div id="mmr-diff"></div></div></div>
                        <div class="month-selector-area"><div style="font-size:18px; font-weight:800; color:#00c6ff;">월별 조회: </div><select id="select-month" class="recap-select"></select></div>
                        <div class="badge-container"></div>
                        <div class="top-rank-grid"><div class="stat-card"></div><div class="stat-card"></div><div class="stat-card"></div><div class="stat-card"></div></div>
                    </div>
                </div>
                <div class="recap-body-section">
                    <div id="loading-recap" class="loading-overlay">데이터 분석 중...</div>
                    <div class="ai-insult-box" id="ai-insult">분석 중...</div>
                    <div class="main-layout">
                        <div class="section-box">
                            <div style="font-size:20px; font-weight:900; margin-bottom:25px;">요일 활동량</div><div style="height:180px;"><canvas id="weeklyChart"></canvas></div>
                            <div style="font-size:20px; font-weight:900; margin-top:50px; margin-bottom:25px;">출석 체크</div>
                            <div class="calendar-wrapper"><div class="cal-header-row"><div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div></div><div class="calendar-grid"></div></div>
                            <div class="category-rank-area"><div style="font-size:20px; font-weight:900;">참여 카테고리 순위</div><div id="category-ranking-list" class="category-rank-list"></div></div>
                        </div>
                        <div class="section-box"><div style="font-size:20px; font-weight:900; margin-bottom:25px;">스트리머 순위</div><div style="position:relative;"><canvas id="rankChart"></canvas></div></div>
                    </div>

                    <div class="tools-area">
                        <label for="bg-file-input" class="modern-upload-label">📁 배경 변경</label>
                        <input type="file" id="bg-file-input" accept="image/*">
                        <div style="display: flex; gap: 12px;">
                            <a href="https://cafe.naver.com/f-e/cafes/31308909/menus/91?viewType=L&page=1&size=15" target="_blank" class="cafe-link-btn"><span>HINDERLAND</span></a>
                            <button id="screenshot-btn" class="screenshot-btn">IMAGE SAVE</button>
                        </div>
                    </div>
                </div>
            </div>`;

        const monthSel = document.getElementById('select-month');
        for(let i = 0; i < 3; i++) { const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1); monthSel.innerHTML += `<option value="${d.getFullYear()}-${d.getMonth() + 1}" ${i===0?'selected':''}>${d.getFullYear()}년 ${d.getMonth() + 1}월</option>`; }

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
                reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2 + 0.3; this.speedX = Math.random() * 0.5 - 0.25; this.speedY = Math.random() * 0.5 - 0.25; this.opacity = Math.random() * 0.5; this.life = Math.random() * 150; }
                update() { this.x += this.speedX; this.y += this.speedY; this.life -= 0.1; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life < 0) this.reset(); }
                draw() {
                    ctx.save(); // 스타일 설정을 위해 저장

                    // 발광 효과 추가
                    ctx.shadowBlur = this.size * 3; // 입자 크기에 비례한 빛 번짐
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'; // 발광 색상

                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore(); // 스타일 복원 (다른 입자에 영향 안 주도록)
                }
            }
            for (let i = 0; i < 80; i++) particles.push(new Particle());
            const animate = () => { if (!document.getElementById('particle-canvas')) return; ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); };
            animate();
        }

        monthSel.onchange = (e) => { [selectedYear, selectedMonth] = e.target.value.split('-').map(Number); updateRecapData(); };
        document.getElementById('close-recap').onclick = () => overlay.remove();
        document.getElementById('bg-file-input').onchange = (e) => {
            const file = e.target.files[0];
            if (file) { const r = new FileReader(); r.onload = (ev) => { localStorage.setItem('soop_recap_local_bg', ev.target.result); document.getElementById('recap-header-bg').style.backgroundImage = `url('${ev.target.result}')`; }; r.readAsDataURL(file); }
        };
        document.getElementById('screenshot-btn').onclick = () => { html2canvas(document.querySelector('.recap-window'), { useCORS: true, scale: 2, backgroundColor: '#0a0a0f', scrollY: -window.scrollY }).then(canvas => { const link = document.createElement('a'); link.download = `RECAP.png`; link.href = canvas.toDataURL(); link.click(); }); };

        const moderateGlowPlugin = {
            id: 'moderateGlowPlugin',
            beforeDraw: (chart) => {
                const { ctx } = chart;
                const shadowColor = chart.data.datasets[0].shadowColor;
                if (shadowColor) { ctx.save(); ctx.shadowBlur = 8.5; ctx.shadowColor = shadowColor + "CC"; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
            },
            afterDraw: (chart) => { chart.ctx.restore(); }
        };

        const commonOptions = { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 15, right: 15, bottom: 5, left: 10 } }, plugins: { legend: { display: false } } };

        weeklyChart = new Chart(document.getElementById('weeklyChart'), {
            type: 'bar',
            data: { labels: ['일','월','화','수','목','금','토'], datasets: [{ data: [], borderRadius: 7, shadowColor: '' }] },
            options: { ...commonOptions, scales: { x: { grid: { display: false }, ticks: { color: '#888' } }, y: { display: false } } },
            plugins: [moderateGlowPlugin]
        });

        rankChart = new Chart(document.getElementById('rankChart'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [], borderRadius: 9, barThickness: 25, shadowColor: '' }] },
            options: { ...commonOptions, indexAxis: 'y', scales: { y: { ticks: { color: '#fff' }, grid: { display: false } }, x: { display: false } } },
            plugins: [moderateGlowPlugin]
        });

        updateRecapData();
    };

    const btn = document.createElement('button');
    btn.id = 'custom-recap-btn'; btn.innerText = "CHECK MY RECAP";
    const savedPos = JSON.parse(localStorage.getItem('soop_recap_btn_pos') || '{"right":"30px","bottom":"30px"}');
    Object.assign(btn.style, { right: savedPos.right, bottom: savedPos.bottom, left: savedPos.left || 'auto', top: savedPos.top || 'auto' });
    document.body.appendChild(btn);

    let isDragging = false, offset = { x: 0, y: 0 }, dragStartTime = 0;
    btn.addEventListener('mousedown', (e) => { dragStartTime = Date.now(); isDragging = true; const rect = btn.getBoundingClientRect(); offset.x = e.clientX - rect.left; offset.y = e.clientY - rect.top; btn.style.transition = 'none'; });
    document.addEventListener('mousemove', (e) => { if (!isDragging) return; const x = e.clientX - offset.x, y = e.clientY - offset.y; btn.style.left = x + 'px'; btn.style.top = y + 'px'; btn.style.right = 'auto'; btn.style.bottom = 'auto'; });
    document.addEventListener('mouseup', () => { if (!isDragging) return; isDragging = false; btn.style.transition = 'opacity 0.3s, visibility 0.3s'; localStorage.setItem('soop_recap_btn_pos', JSON.stringify({ left: btn.style.left, top: btn.style.top, right: 'auto', bottom: 'auto' })); });
    btn.onclick = () => { if (Date.now() - dragStartTime < 200) renderBaseRecap(); };

    const updateBtnVisibility = () => {
        const checkClasses = (el) => { if(!el) return false; const list = el.classList; return list.contains('full_screen') || list.contains('ua-fullscreen') || list.contains('sz-screen-mode') || list.contains('screen_mode'); };
        if (!!(document.fullscreenElement || document.webkitFullscreenElement) || checkClasses(document.body)) btn.classList.add('hidden'); else btn.classList.remove('hidden');
    };
    setInterval(updateBtnVisibility, 1000);
})();