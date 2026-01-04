// ==UserScript==
// @name         Limbopro 网页划词搜索神器（移动端兼容版/划词番号搜索/影视搜索/谷歌搜索）
// @namespace    https://limbopro.com
// @version      1.2
// @description  【Limbopro 网页划词搜索神器】移动端 & PC 完美适配：选中文字 → 右侧悬浮面板（谷歌搜索🔍/影视搜索🎬/番号搜索🔞），不闪退、持久悬停；支持深色模式、丝滑动画、自动防重叠定位，按 Escape 或点击空白即可隐藏。
// @author       limbopro & Grok
// @match        https://*/*
// @icon         https://limbopro.com/favicon.ico
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554546/Limbopro%20%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%E7%A5%9E%E5%99%A8%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%BC%E5%AE%B9%E7%89%88%E5%88%92%E8%AF%8D%E7%95%AA%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%BD%B1%E8%A7%86%E6%90%9C%E7%B4%A2%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554546/Limbopro%20%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%E7%A5%9E%E5%99%A8%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%85%BC%E5%AE%B9%E7%89%88%E5%88%92%E8%AF%8D%E7%95%AA%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%BD%B1%E8%A7%86%E6%90%9C%E7%B4%A2%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%EF%BC%89.meta.js
// ==/UserScript==


// blog: https://limbopro.com/
// Tg: https://t.me/limboprossr

initLimoProSearch()

function initLimoProSearch() {
    if (window.limboproSearchPro) {
        console.log('LimoPro 搜索面板已存在');
        return;
    }
    window.limboproSearchPro = true;

    const buttons = [
        { text: '使用谷歌搜索🔍', color: '#0ea5e9' },  // 科技蓝
        { text: '使用影视搜索🎬', color: '#8b5cf6' }, // 紫色
        { text: '使用番号搜索🔞', color: '#c42a4e' } // 暗红
    ];

    const urls = [
        'https://www.google.com/search?q=', // 谷歌搜索
        'https://limbopro.com/search.html#gsc.tab=0&gsc.q=', // 影视搜索
        'https://limbopro.com/btsearch.html#gsc.tab=0&gsc.q=' // 番号搜索
    ];

    const container = document.createElement('div');
    container.id = 'limbopro-search-pro';
    Object.assign(container.style, {
        position: 'absolute',
        zIndex: '2147483647',
        display: 'none',
        pointerEvents: 'none',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        flexDirection: 'column',
        gap: '8px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        boxShadow: '0 10px 36px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        transition: 'all 0.2s ease, opacity 0.15s ease',
        minWidth: '142px',  // 优化：避免 Emoji 被截断
        alignItems: 'center',
        opacity: '0'
    });
    document.body.appendChild(container);

    const updateTheme = () => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        container.style.background = isDark ? 'rgba(30,30,40,0.92)' : 'rgba(255,255,255,0.95)';
        container.style.border = isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.3)';
    };
    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    const btns = buttons.map((cfg, i) => {
        const btn = document.createElement('button');
        btn.textContent = cfg.text;
        btn.dataset.url = urls[i];

        Object.assign(btn.style, {
            width: '100%',
            padding: '4px 14px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: '#fff',
            background: cfg.color,
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
            pointerEvents: 'auto',
            transition: 'all 0.2s ease',
            transform: 'translateY(0)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'  // 增强暗色模式可读性
        });

        btn.onmouseover = btn.ontouchstart = () => {
            btn.style.transform = 'translateY(-3px) scale(1.03)';
            btn.style.boxShadow = '0 10px 24px rgba(0,0,0,0.3)';
        };
        btn.onmouseout = btn.ontouchend = () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)';
        };
        btn.onmousedown = btn.ontouchstart = e => e.stopPropagation();

        container.appendChild(btn);
        return btn;
    });

    let currentText = '';
    let showTimeout = null;

    const hide = () => {
        container.style.opacity = '0';
        setTimeout(() => {
            if (container.style.opacity === '0') {
                container.style.display = 'none';
            }
        }, 150);
        currentText = '';
        if (showTimeout) clearTimeout(showTimeout);
    };

    const showPanel = (text) => {
        const sel = window.getSelection();
        if (!sel.rangeCount) return hide();
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect.width) return hide();

        container.style.display = 'flex';
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        container.style.display = 'none';

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const isMultiLine = rect.height > 24;

        let left = isMultiLine
            ? window.scrollX + rect.left - w - 12
            : window.scrollX + rect.right + 12 + 70;

        let top = isMultiLine
            ? window.scrollY + rect.bottom - h
            : window.scrollY + rect.top;

        // 防重叠
        const panelTop = top - window.scrollY;
        const panelBottom = panelTop + h;
        const textTop = rect.top;
        const textBottom = rect.bottom;

        if (isMultiLine && panelTop < textBottom && panelBottom > textTop) {
            top = window.scrollY + rect.bottom + 8;
        }

        top = Math.max(window.scrollY + 12, Math.min(top, window.scrollY + vh - h - 12));
        left = Math.max(window.scrollX + 12, Math.min(left, window.scrollX + vw - w - 12));

        container.style.top = top + 'px';
        container.style.left = left + 'px';
        container.style.display = 'flex';
        container.style.opacity = '1';  // 淡入

        currentText = text;
        btns.forEach(b => b.dataset.q = text);  // 修复：text → currentText
    };

    document.addEventListener('selectionchange', () => {
        if (showTimeout) clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            const text = window.getSelection().toString().trim();
            if (text && text === currentText) return;
            if (text) {
                showPanel(text);
            } else if (currentText) {
                hide();
            }
        }, 100);
    });

    btns.forEach(btn => {
        btn.onclick = () => {
            if (currentText) {
                window.open(btn.dataset.url + encodeURIComponent(currentText), '_blank');
            }
        };
    });

    document.addEventListener('mousedown', e => {
        if (!container.contains(e.target) && !window.getSelection().toString().trim()) hide();
    });

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScroll > 300 && !window.getSelection().toString().trim()) hide();
        lastScroll = now;
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !window.getSelection().toString().trim()) hide();
    });

    hide();
    console.log('LimoPro 搜索面板（你的终极优化版）已加载');
}
