// ==UserScript==
// @name         linuxdo保活优化版（面板控制）
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Linux.do 自动浏览 + 点赞 + 实时统计面板 + 面板控制启动/停止/暂停
// @author       levi & ChatGPT
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/553111/linuxdo%E4%BF%9D%E6%B4%BB%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%88%E9%9D%A2%E6%9D%BF%E6%8E%A7%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553111/linuxdo%E4%BF%9D%E6%B4%BB%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%88%E9%9D%A2%E6%9D%BF%E6%8E%A7%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ========== 配置部分 ========== **/
    const config = {
        scrollInterval: 1500,
        scrollStep: 800,
        viewCountThreshold: 500,
        scrollDuration: 30,
        maxTopics: 100,
        maxRunTime: 30,
        iframeStyle: {
            width: '320px',
            height: '480px',
            position: 'fixed',
            top: '70px',
            left: '8px',
            zIndex: '9999',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.15)'
        },
        logging: { enabled: true, level: { error: true, info: true, debug: false } }
    };

    /** ========== 日志工具 ========== **/
    const logger = Object.fromEntries(
        Object.entries(console).map(([level, fn]) => [
            level,
            (...args) => { if (config.logging.enabled && config.logging.level[level]) fn(...args); }
        ])
    );

    /** ========== 状态数据 ========== **/
    const stats = GM_getValue('linuxdoStats', { totalViews: 0, totalLikes: 0 });
    const session = { startTime: Date.now(), views: 0, likes: 0 };
    let isPaused = false;

    /** ========== 状态控制 ========== **/
    const getSwitchState = () => GM_getValue('linuxdoHelperEnabled', false);
    const setSwitchState = (s) => GM_setValue('linuxdoHelperEnabled', s);

    /** ========== 工具函数 ========== **/
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const randomDelay = (min = 2000, max = 5000) =>
        delay(Math.floor(Math.random() * (max - min)) + min);
    const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
    const saveStats = () => GM_setValue('linuxdoStats', stats);

    /** ========== 统计面板 ========== **/
    function createStatsPanel() {
        if (document.getElementById('linuxdo-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'linuxdo-panel';
        panel.innerHTML = `
            <div class="panel-header" style="cursor:move; background:#2b2b2b; color:#fff; padding:6px 10px; border-top-left-radius:8px; border-top-right-radius:8px; font-size:13px;">
                🧩 Linuxdo 助手
                <span id="panel-min" style="float:right;cursor:pointer;">—</span>
            </div>
            <div class="panel-body" style="background:#fff; color:#333; padding:8px; font-size:13px; line-height:1.4;">
                <div>🕒 运行时间：<span id="time">0:00</span></div>
                <div>👀 浏览：<span id="views">0</span></div>
                <div>💖 点赞：<span id="likes">0</span></div>
                <div>⚙️ 状态：<span id="state">停止</span></div>
                <button id="start-btn" style="margin-top:6px;width:100%;padding:4px;border:none;border-radius:4px;background:#28a745;color:white;cursor:pointer;">▶️ 开始</button>
                <button id="pause-btn" style="margin-top:4px;width:100%;padding:4px;border:none;border-radius:4px;background:#007bff;color:white;cursor:pointer;">⏸ 暂停</button>
            </div>
        `;
        Object.assign(panel.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '180px',
            border: '1px solid #888',
            borderRadius: '8px',
            boxShadow: '0 0 6px rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
            zIndex: 99999,
            userSelect: 'none'
        });
        document.body.appendChild(panel);

        // 拖动
        const header = panel.querySelector('.panel-header');
        let offsetX, offsetY, dragging = false;
        header.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', stop);
        });
        const move = e => {
            if (!dragging) return;
            panel.style.left = e.clientX - offsetX + 'px';
            panel.style.top = e.clientY - offsetY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };
        const stop = () => {
            dragging = false;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', stop);
        };

        // 最小化
        const body = panel.querySelector('.panel-body');
        const minBtn = document.getElementById('panel-min');
        minBtn.onclick = () => {
            if (body.style.display === 'none') {
                body.style.display = 'block';
                minBtn.textContent = '—';
            } else {
                body.style.display = 'none';
                minBtn.textContent = '+';
            }
        };

        // 暂停/恢复
        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn.onclick = () => {
            if (!getSwitchState()) return;
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? '▶️ 恢复' : '⏸ 暂停';
            pauseBtn.style.background = isPaused ? '#28a745' : '#007bff';
            logger.info(`助手已${isPaused ? '暂停' : '恢复'}`);
        };

        // 开始/停止
        const startBtn = document.getElementById('start-btn');
        startBtn.onclick = async () => {
            const running = getSwitchState();
            if (running) {
                setSwitchState(false);
                startBtn.textContent = '▶️ 开始';
                startBtn.style.background = '#28a745';
                logger.info('助手已停止');
            } else {
                setSwitchState(true);
                startBtn.textContent = '🛑 停止';
                startBtn.style.background = '#dc3545';
                isPaused = false;
                pauseBtn.textContent = '⏸ 暂停';
                pauseBtn.style.background = '#007bff';
                logger.info('助手已启动');
                main(); // 启动主逻辑
            }
        };

        // 更新面板
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
            const m = Math.floor(elapsed / 60);
            const s = elapsed % 60;
            document.getElementById('time').textContent = `${m}:${s.toString().padStart(2,'0')}`;
            document.getElementById('views').textContent = session.views;
            document.getElementById('likes').textContent = session.likes;
            document.getElementById('state').textContent = getSwitchState()
                ? (isPaused ? '暂停中' : '运行中')
                : '停止';
            document.getElementById('state').style.color =
                getSwitchState() ? (isPaused ? 'orange' : 'green') : 'red';
        }, 1000);
    }

    /** ========== 功能逻辑 ========== **/
    async function checkAndLike(win) {
        try {
            const btn = win.document.querySelector('button.btn-toggle-reaction-like');
            if (!btn || btn.title.includes('删除此 heart 回应')) return;
            btn.click();
            session.likes++;
            stats.totalLikes++;
            saveStats();
        } catch (e) { logger.error('点赞失败:', e); }
    }

    async function browseTopic(topic) {
        while (isPaused) await delay(1000);
        logger.info(`浏览中：${topic.title}`);
        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, config.iframeStyle);
        iframe.src = `${topic.url}?_=${Date.now()}`;
        document.body.appendChild(iframe);

        await new Promise((r) => (iframe.onload = r));
        session.views++;
        stats.totalViews++;
        saveStats();

        if (topic.views > config.viewCountThreshold) await checkAndLike(iframe.contentWindow);

        const end = Date.now() + config.scrollDuration * 1000;
        while (Date.now() < end) {
            if (isPaused) await delay(1000);
            iframe.contentWindow.scrollBy(0, config.scrollStep);
            await delay(config.scrollInterval);
        }

        iframe.remove();
        await randomDelay();
    }

    async function getTopicsList() {
        const titles = document.querySelectorAll('#list-area .title');
        return Array.from(titles)
            .filter(el => !el.closest('tr')?.querySelector('.pinned'))
            .map(el => ({
                title: el.textContent.trim(),
                url: el.href,
                views: parseInt(el.closest('tr')?.querySelector('.num.views .number')?.getAttribute('title')?.replace(/\D/g, '') || 0)
            }));
    }

    function shouldStop() {
        if (!getSwitchState()) return true;
        if (session.views >= config.maxTopics) return true;
        const runMins = (Date.now() - session.startTime) / 60000;
        return runMins >= config.maxRunTime;
    }

    /** ========== 主逻辑 ========== **/
    async function main() {
        const topics = shuffleArray(await getTopicsList());
        for (const topic of topics) {
            if (shouldStop()) break;
            await browseTopic(topic);
        }
        setSwitchState(false);
        logger.info('助手已完成任务或停止');
    }

    /** ========== 启动入口 ========== **/
    if (document.readyState === 'complete') createStatsPanel();
    else window.addEventListener('load', createStatsPanel);

})();