// ==UserScript==
// @name         Linux.do Hand‑Drawn Theme (2026 马年新春版 V2.0)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将 Linux.do 论坛美化为手绘风格 + 2026马年新春元素（灯笼、奔马、烟花、红包雨）
// @author       baicai
// @match        https://linux.do/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562612/Linuxdo%20Hand%E2%80%91Drawn%20Theme%20%282026%20%E9%A9%AC%E5%B9%B4%E6%96%B0%E6%98%A5%E7%89%88%20V20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562612/Linuxdo%20Hand%E2%80%91Drawn%20Theme%20%282026%20%E9%A9%AC%E5%B9%B4%E6%96%B0%E6%98%A5%E7%89%88%20V20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🐴 马年新春主题脚本开始加载...');

    /* ==================================================
       1️⃣ 核心 CSS 样式
       ================================================== */
    const mainCSS = `
        /* ====== 根变量（新春红金配色） ====== */
        :root {
            --hd-bg: #fff8f0;
            --hd-text: #4a1c1c;
            --hd-muted: #f5e6d3;
            --hd-accent: #d62828;
            --hd-secondary: #c9a227;
            --hd-highlight: #ffe066;
            --hd-border: #8b0000;
            --hd-shadow: 4px 4px 0 0 #8b0000;
            --hd-shadow-hover: 2px 2px 0 0 #8b0000;
            --wobbly-big: 255px 15px 225px 15px / 15px 225px 15px 255px;
            --wobbly-sm: 20px 5px 20px 5px / 5px 20px 5px 20px;
            --hd-font-head: 'Kalam', 'LXGW WenKai Screen', 'Kaiti SC', cursive, sans-serif;
            --hd-font-body: 'Patrick Hand', 'LXGW WenKai Screen', 'Kaiti SC', cursive, sans-serif;
        }

        /* ====== 全局基础 ====== */
        body {
            font-family: var(--hd-font-body) !important;
            background: var(--hd-bg) !important;
            background-image:
                radial-gradient(var(--hd-muted) 1px, transparent 1px),
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ctext x='40' y='50' font-size='28' text-anchor='middle' fill='%23d6282810'%3E福%3C/text%3E%3C/svg%3E") !important;
            background-size: 24px 24px, 160px 160px !important;
            color: var(--hd-text) !important;
        }

        h1, h2, h3, h4, h5, .d-header, .category-name, .topic-title {
            font-family: var(--hd-font-head) !important;
        }

        a { color: var(--hd-secondary); text-decoration-style: dashed; }
        a:hover { color: var(--hd-accent); }

        /* ====== 导航栏 ====== */
        .d-header {
            background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%) !important;
            border-bottom: 3px solid var(--hd-secondary) !important;
            height: 70px !important;
        }
        .d-header .title a, .d-header .header-title { color: #ffd700 !important; }
        .d-header-icons .icon, .d-header-icons .btn { color: #ffd700 !important; }
        .d-header .d-icon { color: #ffd700 !important; }

        /* ====== 侧边栏 ====== */
        .sidebar-wrapper {
            background: transparent !important;
            border-right: 2px dashed var(--hd-accent);
        }
        .sidebar-section-link-wrapper .sidebar-section-link {
            font-family: var(--hd-font-body) !important;
            border: 2px solid transparent !important;
            border-radius: var(--wobbly-sm) !important;
            transition: all .2s !important;
        }
        .sidebar-section-link-wrapper .sidebar-section-link:hover {
            background: #fff !important;
            border-color: var(--hd-accent) !important;
            box-shadow: var(--hd-shadow-hover) !important;
            transform: rotate(-1deg);
        }
        .sidebar-section-link-wrapper .sidebar-section-link.active {
            background: var(--hd-highlight) !important;
            border-color: var(--hd-accent) !important;
            box-shadow: var(--hd-shadow) !important;
        }

        /* ====== 主题列表 ====== */
        .topic-list {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 0 8px !important;
            table-layout: auto !important;
        }
        .topic-list tbody tr.topic-list-item {
            background: #fff !important;
            box-shadow: 2px 2px 0 rgba(139,0,0,.15) !important;
            transition: all .16s ease !important;
        }
        .topic-list tbody tr.topic-list-item:hover {
            transform: translate(-2px,-2px) rotate(0.15deg);
            box-shadow: var(--hd-shadow);
        }
        .topic-list tbody tr.topic-list-item td {
            background: #fff !important;
            border-top: 2px solid var(--hd-accent) !important;
            border-bottom: 2px solid var(--hd-accent) !important;
            padding: 10px 12px !important;
        }
        .topic-list tbody tr.topic-list-item td:first-child {
            border-left: 2px solid var(--hd-accent) !important;
            border-radius: 12px 0 0 12px !important;
        }
        .topic-list tbody tr.topic-list-item td:last-child {
            border-right: 2px solid var(--hd-accent) !important;
            border-radius: 0 12px 12px 0 !important;
        }

        /* ====== 按钮 ====== */
        .btn-primary, .topic-footer-main-buttons .btn.create {
            background: linear-gradient(135deg, #d62828 0%, #8b0000 100%) !important;
            color: #ffd700 !important;
            border: 2px solid var(--hd-secondary) !important;
        }

        /* ====== 滚动条 ====== */
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: var(--hd-bg); }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #d62828, #8b0000);
            border: 2px solid var(--hd-secondary);
            border-radius: 10px;
        }
    `;

    /* ==================================================
       2️⃣ 新春装饰 CSS
       ================================================== */
    const festivalCSS = `
        /* 🏮 灯笼容器 */
        #cny-lanterns {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            pointer-events: none;
            z-index: 99999;
            display: flex;
            justify-content: space-around;
            padding: 0 5%;
            box-sizing: border-box;
        }
        .cny-lantern {
            font-size: 50px;
            animation: swing 3s ease-in-out infinite;
            transform-origin: top center;
            filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
            cursor: pointer;
            pointer-events: auto;
        }
        .cny-lantern:nth-child(even) { animation-delay: -1.5s; }
        @keyframes swing {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
        }

        /* 🐴 奔马 */
        #cny-horse {
            position: fixed;
            bottom: 30px;
            right: 30px;
            font-size: 100px;
            z-index: 99998;
            animation: gallop 1.5s ease-in-out infinite;
            filter: drop-shadow(3px 3px 6px rgba(0,0,0,0.4));
            cursor: pointer;
            transition: transform 0.3s;
        }
        #cny-horse:hover { transform: scale(1.3) !important; }
        @keyframes gallop {
            0%, 100% { transform: translateY(0) rotate(-3deg); }
            25% { transform: translateY(-20px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(3deg); }
            75% { transform: translateY(-25px) rotate(0deg); }
        }

        /* 🧧 红包雨容器 */
        #cny-rain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 99990;
            overflow: hidden;
        }
        .cny-packet {
            position: absolute;
            top: -60px;
            font-size: 35px;
            animation: fall linear forwards;
            filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.3));
        }
        @keyframes fall {
            to {
                transform: translateY(calc(100vh + 100px)) rotate(720deg);
            }
        }

        /* 🎆 烟花 */
        .cny-firework {
            position: fixed;
            pointer-events: none;
            z-index: 100000;
            font-size: 40px;
            animation: burst 0.6s ease-out forwards;
        }
        @keyframes burst {
            0% { transform: scale(0.3); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
        }

        /* 🎊 新春横幅 */
        #cny-banner {
            position: fixed;
            top: 72px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #d62828 0%, #8b0000 100%);
            color: #ffd700;
            padding: 10px 40px;
            border-radius: 0 0 25px 25px;
            font-family: 'LXGW WenKai Screen', 'Kaiti SC', 'SimSun', serif;
            font-size: 20px;
            font-weight: bold;
            z-index: 99995;
            box-shadow: 0 5px 20px rgba(139,0,0,0.5);
            border: 3px solid #ffd700;
            border-top: none;
            animation: glow 2s ease-in-out infinite;
            white-space: nowrap;
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 5px 20px rgba(139,0,0,0.5); }
            50% { box-shadow: 0 5px 30px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.4); }
        }

        /* 🎐 春联 */
        .cny-couplet {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            writing-mode: vertical-rl;
            background: linear-gradient(180deg, #d62828 0%, #8b0000 100%);
            color: #ffd700;
            padding: 20px 12px;
            border-radius: 8px;
            font-family: 'LXGW WenKai Screen', 'Kaiti SC', 'SimSun', serif;
            font-size: 20px;
            font-weight: bold;
            z-index: 99994;
            border: 3px solid #ffd700;
            box-shadow: 3px 3px 15px rgba(0,0,0,0.4);
            letter-spacing: 8px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        #cny-couplet-left { left: 8px; }
        #cny-couplet-right { right: 8px; }

        /* 📱 移动端适配 */
        @media (max-width: 1000px) {
            .cny-couplet { display: none !important; }
            #cny-horse { font-size: 60px; bottom: 15px; right: 15px; }
            .cny-lantern { font-size: 35px; }
            #cny-banner { font-size: 14px; padding: 8px 25px; top: 72px; }
        }
    `;

    /* ==================================================
       3️⃣ 注入 CSS
       ================================================== */
    GM_addStyle(mainCSS);
    GM_addStyle(festivalCSS);
    console.log('✅ CSS 样式已注入');

    /* ==================================================
       4️⃣ 加载字体
       ================================================== */
    const loadFonts = () => {
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap',
            'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web/style.css'
        ];
        fonts.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        });
        console.log('✅ 字体已加载');
    };

    /* ==================================================
       5️⃣ 创建新春装饰元素
       ================================================== */
    const createFestivalElements = () => {
        // 🏮 灯笼
        const lanternContainer = document.createElement('div');
        lanternContainer.id = 'cny-lanterns';
        const lanternEmojis = ['🏮', '🧧', '🏮', '🧧', '🏮', '🧧', '🏮'];
        lanternEmojis.forEach((emoji, i) => {
            const lantern = document.createElement('span');
            lantern.className = 'cny-lantern';
            lantern.textContent = emoji;
            lantern.style.animationDelay = `${i * 0.3}s`;
            lantern.onclick = () => createFirework(lantern.getBoundingClientRect());
            lanternContainer.appendChild(lantern);
        });
        document.body.appendChild(lanternContainer);
        console.log('✅ 灯笼已创建');

        // 🐴 奔马
        const horse = document.createElement('div');
        horse.id = 'cny-horse';
        horse.textContent = '🐴';
        horse.title = '马到成功！点击放烟花 🎆';
        horse.onclick = (e) => {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    createFirework({
                        left: e.clientX + (Math.random() - 0.5) * 150,
                        top: e.clientY + (Math.random() - 0.5) * 150
                    });
                }, i * 100);
            }
        };
        document.body.appendChild(horse);
        console.log('✅ 奔马已创建');

        // 🎊 横幅
        const banner = document.createElement('div');
        banner.id = 'cny-banner';
        banner.innerHTML = '🐴 2026 丙午马年 · 恭贺新禧 · 马到成功 🎊';
        document.body.appendChild(banner);
        console.log('✅ 横幅已创建');

        // 🎐 春联
        const leftCouplet = document.createElement('div');
        leftCouplet.id = 'cny-couplet-left';
        leftCouplet.className = 'cny-couplet';
        leftCouplet.textContent = '龙马精神迎新岁';
        document.body.appendChild(leftCouplet);

        const rightCouplet = document.createElement('div');
        rightCouplet.id = 'cny-couplet-right';
        rightCouplet.className = 'cny-couplet';
        rightCouplet.textContent = '骏马奔腾创伟业';
        document.body.appendChild(rightCouplet);
        console.log('✅ 春联已创建');

        // 🧧 红包雨容器
        const rainContainer = document.createElement('div');
        rainContainer.id = 'cny-rain';
        document.body.appendChild(rainContainer);
        console.log('✅ 红包雨容器已创建');

        // 启动红包雨
        startRedPacketRain(rainContainer);
    };

    /* ==================================================
       6️⃣ 红包雨动画
       ================================================== */
    const startRedPacketRain = (container) => {
        const packets = ['🧧', '💰', '🪙', '🎁', '✨', '🐴'];

        const createPacket = () => {
            const packet = document.createElement('span');
            packet.className = 'cny-packet';
            packet.textContent = packets[Math.floor(Math.random() * packets.length)];
            packet.style.left = Math.random() * 100 + '%';
            packet.style.fontSize = (25 + Math.random() * 20) + 'px';

            const duration = 4 + Math.random() * 4;
            packet.style.animationDuration = duration + 's';

            container.appendChild(packet);

            setTimeout(() => {
                if (packet.parentNode) {
                    packet.remove();
                }
            }, duration * 1000);
        };

        // 初始创建一批
        for (let i = 0; i < 5; i++) {
            setTimeout(createPacket, i * 500);
        }

        // 持续创建
        setInterval(createPacket, 1500);
        console.log('✅ 红包雨已启动');
    };

    /* ==================================================
       7️⃣ 烟花效果
       ================================================== */
    const createFirework = (pos) => {
        const fireworks = ['🎆', '🎇', '✨', '💥', '🌟', '⭐'];
        const fw = document.createElement('span');
        fw.className = 'cny-firework';
        fw.textContent = fireworks[Math.floor(Math.random() * fireworks.length)];
        fw.style.left = (pos.left || pos.x) + 'px';
        fw.style.top = (pos.top || pos.y) + 'px';
        document.body.appendChild(fw);

        setTimeout(() => fw.remove(), 600);
    };

    // 点击页面任意位置放烟花
    document.addEventListener('click', (e) => {
        // 不在输入框等元素上触发
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        createFirework({ left: e.clientX, top: e.clientY });
    });

    /* ==================================================
       8️⃣ 初始化
       ================================================== */
    const init = () => {
        console.log('🚀 开始初始化新春主题...');
        loadFonts();

        // 确保 DOM 完全加载后再创建元素
        if (document.readyState === 'complete') {
            createFestivalElements();
        } else {
            window.addEventListener('load', createFestivalElements);
        }

        console.log('🎉 马年新春主题加载完成！');
    };

    // 执行初始化
    init();

})();
