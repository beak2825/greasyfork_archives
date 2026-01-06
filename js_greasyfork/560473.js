// ==UserScript==
// @name         江江解析 - 多平台VIP视频解析工具
// @namespace    http://tampermonkey.net/
// @version      3.11
// @description  【全网VIP视频免费看】支持腾讯、爱奇艺、优酷、B站、芒果TV等主流平台，提供PotPlayer推送播放（江江独家4K高清）、网页内嵌播放、弹窗播放三种模式，19+解析源可选，自动记忆上次使用的解析源
// @author       江江解析
// @license      MIT
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎬</text></svg>
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://m.v.qq.com/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://m.bilibili.com/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://m.iqiyi.com/*
// @match        *://*.iq.com/play/*
// @match        *://v.youku.com/v_show/id_*
// @match        *://*.youku.com/v_show/id_*
// @match        *://v.m.youku.com/v_show/id_*
// @match        *://*.youku.com/video*
// @match        *://*.youku.com/*?vid=*
// @match        *://m.youku.com/*
// @match        *://*.mgtv.com/b/*
// @match        *://www.mgtv.com/b/*
// @match        *://m.mgtv.com/b/*
// @match        *://*.tudou.com/v_*
// @match        *://tv.sohu.com/v/*
// @match        *://m.tv.sohu.com/*
// @match        *://v.pptv.com/show/*
// @match        *://vip.pptv.com/show/*
// @match        *://m.pptv.com/show/*
// @match        *://www.wasu.cn/Play/show/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.acfun.cn/bangumi/*
// @match        *://vip.1905.com/play/*
// @match        *://www.1905.com/play/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      121.40.174.45
// @connect      59.153.164.125
// @connect      125.208.23.251
// @connect      sspa8.top
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/560473/%E6%B1%9F%E6%B1%9F%E8%A7%A3%E6%9E%90%20-%20%E5%A4%9A%E5%B9%B3%E5%8F%B0VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560473/%E6%B1%9F%E6%B1%9F%E8%A7%A3%E6%9E%90%20-%20%E5%A4%9A%E5%B9%B3%E5%8F%B0VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/*
 * MIT License
 * Copyright (c) 2025 江江解析
 * 详细说明请查看 README.md
 */

(function() {
    'use strict';

    // 配置参数 - 多个解析接口
    const config = {
        apis: [
            {
                name: '江江解析',
                url: 'http://121.40.174.45:299/api/',
                key: '126BC84CBF41A2A',
                color: '#3498db',
                hoverColor: '#2980b9',
                shadowColor: 'rgba(52, 152, 219, 0.5)',
                icon: '🚀',
                gradient: 'linear-gradient(135deg, #3498db, #2ecc71)',
                shortcut: 'Ctrl+Alt+1',
                type: 'potplayer'
            },
            {
                name: '江江备用',
                url: 'http://121.40.174.45:299/api/',
                key: '126BC84CBF41A2A',
                color: '#1abc9c',
                hoverColor: '#16a085',
                shadowColor: 'rgba(26, 188, 156, 0.5)',
                icon: '🔄',
                gradient: 'linear-gradient(135deg, #1abc9c, #16a085)',
                shortcut: 'Ctrl+Alt+3',
                type: 'potplayer'
            },
            {
                name: '麒麟解析',
                url: 'https://svip.qlplayer.cyou/?url=',
                key: '',
                color: '#e74c3c',
                hoverColor: '#c0392b',
                shadowColor: 'rgba(231, 76, 60, 0.5)',
                icon: '🐉',
                gradient: 'linear-gradient(135deg, #e74c3c, #e67e22)',
                shortcut: 'Ctrl+Alt+4',
                type: 'embed'
            },
            {
                name: '789解析',
                url: 'https://jiexi.789jiexi.icu:4433/?url=',
                key: '',
                color: '#9b59b6',
                hoverColor: '#8e44ad',
                shadowColor: 'rgba(155, 89, 182, 0.5)',
                icon: '7️⃣',
                gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                shortcut: 'Ctrl+Alt+5',
                type: 'embed'
            },
            {
                name: '极速解析',
                url: 'https://jx.2s0.cn/player/?url=',
                key: '',
                color: '#16a085',
                hoverColor: '#138d75',
                shadowColor: 'rgba(22, 160, 133, 0.5)',
                icon: '⚡',
                gradient: 'linear-gradient(135deg, #16a085, #138d75)',
                shortcut: 'Ctrl+Alt+6',
                type: 'embed'
            },
            {
                name: '冰豆解析',
                url: 'https://bd.jx.cn/?url=',
                key: '',
                color: '#2980b9',
                hoverColor: '#1f618d',
                shadowColor: 'rgba(41, 128, 185, 0.5)',
                icon: '🧊',
                gradient: 'linear-gradient(135deg, #2980b9, #1f618d)',
                shortcut: 'Ctrl+Alt+7',
                type: 'embed'
            },
            {
                name: '虾米解析',
                url: 'https://jx.xmflv.com/?url=',
                key: '',
                color: '#d35400',
                hoverColor: '#ba4a00',
                shadowColor: 'rgba(211, 84, 0, 0.5)',
                icon: '🦐',
                gradient: 'linear-gradient(135deg, #d35400, #ba4a00)',
                shortcut: 'Ctrl+Alt+8',
                type: 'embed'
            },
            {
                name: 'CK解析',
                url: 'https://www.ckplayer.vip/jiexi/?url=',
                key: '',
                color: '#c0392b',
                hoverColor: '#a93226',
                shadowColor: 'rgba(192, 57, 43, 0.5)',
                icon: '🎯',
                gradient: 'linear-gradient(135deg, #c0392b, #a93226)',
                shortcut: 'Ctrl+Alt+9',
                type: 'embed'
            },
            {
                name: '973解析',
                url: 'https://jx.973973.xyz/?url=',
                key: '',
                color: '#27ae60',
                hoverColor: '#1e8449',
                shadowColor: 'rgba(39, 174, 96, 0.5)',
                icon: '9️⃣',
                gradient: 'linear-gradient(135deg, #27ae60, #1e8449)',
                shortcut: 'Ctrl+Alt+0',
                type: 'embed'
            },
            {
                name: 'Player-JY',
                url: 'https://jx.playerjy.com/?url=',
                key: '',
                color: '#8e44ad',
                hoverColor: '#6c3483',
                shadowColor: 'rgba(142, 68, 173, 0.5)',
                icon: '▶️',
                gradient: 'linear-gradient(135deg, #8e44ad, #6c3483)',
                shortcut: 'Ctrl+Alt+Q',
                type: 'embed'
            },
            {
                name: '七哥解析',
                url: 'https://jx.nnxv.cn/tv.php?url=',
                key: '',
                color: '#2c3e50',
                hoverColor: '#1a252f',
                shadowColor: 'rgba(44, 62, 80, 0.5)',
                icon: '7️⃣',
                gradient: 'linear-gradient(135deg, #2c3e50, #1a252f)',
                shortcut: 'Ctrl+Alt+W',
                type: 'embed'
            },
            {
                name: '夜幕',
                url: 'https://www.yemu.xyz/?url=',
                key: '',
                color: '#34495e',
                hoverColor: '#1a252f',
                shadowColor: 'rgba(52, 73, 94, 0.5)',
                icon: '🌙',
                gradient: 'linear-gradient(135deg, #34495e, #1a252f)',
                shortcut: 'Ctrl+Alt+E',
                type: 'embed'
            },
            {
                name: '盘古',
                url: 'https://www.pangujiexi.com/jiexi/?url=',
                key: '',
                color: '#c0392b',
                hoverColor: '#922b21',
                shadowColor: 'rgba(192, 57, 43, 0.5)',
                icon: '🌍',
                gradient: 'linear-gradient(135deg, #c0392b, #922b21)',
                shortcut: 'Ctrl+Alt+R',
                type: 'embed'
            },
            {
                name: 'playm3u8',
                url: 'https://www.playm3u8.cn/jiexi.php?url=',
                key: '',
                color: '#16a085',
                hoverColor: '#0e6251',
                shadowColor: 'rgba(22, 160, 133, 0.5)',
                icon: '📹',
                gradient: 'linear-gradient(135deg, #16a085, #0e6251)',
                shortcut: 'Ctrl+Alt+T',
                type: 'embed'
            },
            {
                name: '七七云解析',
                url: 'https://jx.77flv.cc/?url=',
                key: '',
                color: '#d35400',
                hoverColor: '#a04000',
                shadowColor: 'rgba(211, 84, 0, 0.5)',
                icon: '☁️',
                gradient: 'linear-gradient(135deg, #d35400, #a04000)',
                shortcut: 'Ctrl+Alt+Y',
                type: 'embed'
            },
            {
                name: '芒果TV1',
                url: 'https://video.isyour.love/player/getplayer?url=',
                key: '',
                color: '#f39c12',
                hoverColor: '#d68910',
                shadowColor: 'rgba(243, 156, 18, 0.5)',
                icon: '🥭',
                gradient: 'linear-gradient(135deg, #f39c12, #d68910)',
                shortcut: 'Ctrl+Alt+U',
                type: 'embed'
            },
            {
                name: '芒果TV2',
                url: 'https://im1907.top/?jx=',
                key: '',
                color: '#e67e22',
                hoverColor: '#ca6f1e',
                shadowColor: 'rgba(230, 126, 34, 0.5)',
                icon: '🍊',
                gradient: 'linear-gradient(135deg, #e67e22, #ca6f1e)',
                shortcut: 'Ctrl+Alt+I',
                type: 'embed'
            },
            {
                name: 'HLS解析',
                url: 'https://jx.hls.one/?url=',
                key: '',
                color: '#3498db',
                hoverColor: '#2980b9',
                shadowColor: 'rgba(52, 152, 219, 0.5)',
                icon: '📡',
                gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
                shortcut: 'Ctrl+Alt+O',
                type: 'embed'
            }
        ],
        potplayerProtocol: 'potplayer://',
        timeout: 15000,
        retryCount: 2
    };

    // 初始化样式
    function initStyles() {
        if (document.getElementById('jiangjiang-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'jiangjiang-styles';
        style.textContent = `
            @keyframes notificationSlideIn {
                from { transform: translateX(-50%) translateY(-30px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes notificationSlideOut {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-30px); opacity: 0; }
            }
            #jiangjiang-buttons-container::-webkit-scrollbar {
                width: 6px;
            }
            #jiangjiang-buttons-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
            }
            #jiangjiang-buttons-container::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #667eea, #764ba2);
                border-radius: 3px;
            }
            #jiangjiang-buttons-container::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #764ba2, #667eea);
            }
        `;
        document.head.appendChild(style);
    }

    // 网站配置
    const siteConfig = {
        'qq.com': {
            name: '腾讯视频',
            icon: '🐧',
            urlPatterns: [
                /v\.qq\.com\/x\/cover\//,
                /v\.qq\.com\/x\/page\//,
                /m\.v\.qq\.com/
            ]
        },
        'bilibili.com': {
            name: '哔哩哔哩',
            icon: '📺',
            urlPatterns: [
                /bilibili\.com\/video\//,
                /bilibili\.com\/bangumi\/play\//,
                /m\.bilibili\.com/
            ]
        },
        'iqiyi.com': {
            name: '爱奇艺',
            icon: '🎬',
            urlPatterns: [
                /iqiyi\.com\/v_/,
                /iqiyi\.com\/w_/,
                /iqiyi\.com\/a_/,
                /m\.iqiyi\.com/
            ]
        },
        'iq.com': {
            name: '爱奇艺国际',
            icon: '🎬',
            urlPatterns: [
                /iq\.com\/play\//
            ]
        },
        'youku.com': {
            name: '优酷',
            icon: '🎥',
            urlPatterns: [
                /youku\.com\/v_show\/id_/,
                /youku\.com\/video/,
                /youku\.com\/.*\?vid=/,
                /m\.youku\.com/
            ]
        },
        'mgtv.com': {
            name: '芒果TV',
            icon: '🥭',
            urlPatterns: [
                /mgtv\.com\/b\//,
                /m\.mgtv\.com/
            ]
        },
        'tudou.com': {
            name: '土豆',
            icon: '🥔',
            urlPatterns: [
                /tudou\.com\/v_/
            ]
        },
        'sohu.com': {
            name: '搜狐视频',
            icon: '🔍',
            urlPatterns: [
                /tv\.sohu\.com\/v\//,
                /m\.tv\.sohu\.com/
            ]
        },
        'pptv.com': {
            name: 'PPTV',
            icon: '📺',
            urlPatterns: [
                /pptv\.com\/show\//,
                /m\.pptv\.com/
            ]
        },
        'wasu.cn': {
            name: '华数TV',
            icon: '📡',
            urlPatterns: [
                /wasu\.cn\/Play\/show\//
            ]
        },
        'le.com': {
            name: '乐视',
            icon: '🎬',
            urlPatterns: [
                /le\.com\/ptv\/vplay\//
            ]
        },
        'acfun.cn': {
            name: 'AcFun',
            icon: '🎮',
            urlPatterns: [
                /acfun\.cn\/v\//,
                /acfun\.cn\/bangumi\//
            ]
        },
        '1905.com': {
            name: '1905电影网',
            icon: '🎞️',
            urlPatterns: [
                /1905\.com\/play\//
            ]
        }
    };

    // 获取当前网站类型
    function getCurrentSite() {
        const hostname = window.location.hostname;
        
        for (const [domain, config] of Object.entries(siteConfig)) {
            if (hostname.includes(domain)) {
                return { domain, ...config };
            }
        }
        
        return null;
    }

    // 创建悬浮按钮
    function createFloatButtons() {
        const siteInfo = getCurrentSite();
        if (!siteInfo) return;
        
        // 移除可能已存在的按钮
        removeExistingButtons();
        
        // 创建主容器
        const mainContainer = document.createElement('div');
        mainContainer.id = 'jiangjiang-main-container';
        
        Object.assign(mainContainer.style, {
            position: 'fixed',
            top: '120px',
            left: '0px',
            zIndex: '99999',
            fontFamily: 'Microsoft YaHei, "Segoe UI", Arial, sans-serif'
        });
        
        // 创建切换按钮（侧边小按钮）
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'jiangjiang-toggle-btn';
        toggleBtn.innerHTML = '<span style="color:#ff6b6b;">V</span>I<span style="color:#ffd93d;">P</span>';
        toggleBtn.title = '点击展开解析菜单';
        
        Object.assign(toggleBtn.style, {
            width: '36px',
            height: '36px',
            lineHeight: '36px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            boxShadow: '2px 2px 10px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
        });
        
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.width = '40px';
            toggleBtn.style.boxShadow = '3px 3px 15px rgba(102, 126, 234, 0.6)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.width = '36px';
            toggleBtn.style.boxShadow = '2px 2px 10px rgba(102, 126, 234, 0.4)';
        });
        
        // 创建菜单容器（初始隐藏）
        const menuContainer = document.createElement('div');
        menuContainer.id = 'jiangjiang-buttons-container';
        
        Object.assign(menuContainer.style, {
            display: 'none',
            position: 'absolute',
            left: '36px',
            top: '0',
            background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0 12px 12px 12px',
            padding: '16px',
            width: '420px',
            maxHeight: '520px',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
        });
        
        // 分组：PotPlayer推送
        const potplayerApis = config.apis.filter(api => api.type === 'potplayer');
        const embedApis = config.apis.filter(api => api.type === 'embed');
        const popupApis = config.apis.filter(api => api.type === 'embed'); // 弹窗播放使用相同的解析源
        
        // 添加PotPlayer分组
        if (potplayerApis.length > 0) {
            const section1 = createSection('推送PotPlayer', potplayerApis, siteInfo, '江江独家4K', 'potplayer');
            menuContainer.appendChild(section1);
        }
        
        // 添加内嵌播放分组
        if (embedApis.length > 0) {
            const section2 = createSection('内嵌播放', embedApis, siteInfo, '', 'embed');
            menuContainer.appendChild(section2);
        }
        
        // 添加弹窗播放分组
        if (popupApis.length > 0) {
            const section3 = createSection('弹窗播放不带选集', popupApis, siteInfo, '', 'popup');
            menuContainer.appendChild(section3);
        }
        
        // 切换菜单显示/隐藏
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        });
        
        // 鼠标移入移出控制
        mainContainer.addEventListener('mouseenter', () => {
            menuContainer.style.display = 'block';
        });
        
        mainContainer.addEventListener('mouseleave', () => {
            menuContainer.style.display = 'none';
        });
        
        mainContainer.appendChild(toggleBtn);
        mainContainer.appendChild(menuContainer);
        
        // 添加拖动功能
        makeButtonDraggable(mainContainer, toggleBtn);
        
        document.body.appendChild(mainContainer);
        
        return mainContainer;
    }
    
    // 创建分组区域
    function createSection(title, apis, siteInfo, subtitle = '', mode = 'embed') {
        const section = document.createElement('div');
        section.style.marginBottom = '18px';
        
        // 标题容器
        const titleContainer = document.createElement('div');
        Object.assign(titleContainer.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            gap: '8px'
        });
        
        // 左边装饰线
        const leftLine = document.createElement('div');
        Object.assign(leftLine.style, {
            flex: '1',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 223, 252, 0.5))'
        });
        
        // 标题文字
        const titleEl = document.createElement('span');
        if (subtitle) {
            titleEl.innerHTML = `${title} <span style="color:#ffd93d;font-size:11px;background:rgba(255,217,61,0.15);padding:2px 6px;border-radius:4px;margin-left:4px;">${subtitle}</span>`;
        } else {
            titleEl.textContent = title;
        }
        Object.assign(titleEl.style, {
            color: '#00dffc',
            fontWeight: '600',
            fontSize: '13px',
            textShadow: '0 0 10px rgba(0, 223, 252, 0.3)',
            whiteSpace: 'nowrap'
        });
        
        // 右边装饰线
        const rightLine = document.createElement('div');
        Object.assign(rightLine.style, {
            flex: '1',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(0, 223, 252, 0.5), transparent)'
        });
        
        titleContainer.appendChild(leftLine);
        titleContainer.appendChild(titleEl);
        titleContainer.appendChild(rightLine);
        section.appendChild(titleContainer);
        
        // 按钮网格
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
        });
        
        apis.forEach((api) => {
            const button = createGridButton(api, siteInfo, mode);
            grid.appendChild(button);
            
            if (mode === 'popup') {
                // 弹窗播放模式
                button.addEventListener('click', () => {
                    saveLastUsedApi(api.name, mode);
                    handlePopupPlay(api, button);
                });
            } else if (mode === 'potplayer') {
                // PotPlayer推送模式
                button.addEventListener('click', () => {
                    saveLastUsedApi(api.name, mode);
                    handlePushToPotPlayer(api, button);
                });
            } else {
                // 内嵌播放模式
                button.addEventListener('click', () => {
                    saveLastUsedApi(api.name, mode);
                    handlePushToPotPlayer(api, button);
                });
            }
        });
        
        section.appendChild(grid);
        return section;
    }
    
    // 弹窗播放处理
    function handlePopupPlay(apiConfig, buttonElement) {
        const videoUrl = window.location.href;
        const url = apiConfig.url + encodeURIComponent(videoUrl);
        GM_openInTab(url, {active: true, insert: true, setParent: true});
        showNotification(`[${apiConfig.name}] 已在新窗口打开`, 'success');
    }
    
    // 保存上次使用的解析源
    function saveLastUsedApi(name, mode) {
        GM_setValue('lastUsedApi', { name, mode, time: Date.now() });
    }
        
    // 创建网格按钮
    function createGridButton(apiConfig, siteInfo, mode) {
        const button = document.createElement('button');
        button.textContent = apiConfig.name;
        button.title = apiConfig.name;
        button.className = 'jiangjiang-grid-btn';
        button.dataset.apiName = apiConfig.name;
        button.dataset.mode = mode;
        
        // 检查是否是上次使用的解析源
        const lastUsed = GM_getValue('lastUsedApi', null);
        const isLastUsed = lastUsed && lastUsed.name === apiConfig.name && lastUsed.mode === mode;
        
        Object.assign(button.style, {
            padding: '8px 6px',
            background: isLastUsed ? 'rgba(0, 223, 252, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            color: isLastUsed ? '#00dffc' : 'rgba(255, 255, 255, 0.8)',
            border: isLastUsed ? '1px solid #00dffc' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            textAlign: 'center',
            transition: 'all 0.25s ease',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            backdropFilter: 'blur(4px)',
            position: 'relative'
        });
        
        // 如果是上次使用的，添加小标记
        if (isLastUsed) {
            const badge = document.createElement('span');
            badge.textContent = '上次';
            Object.assign(badge.style, {
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                fontSize: '9px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                padding: '1px 4px',
                borderRadius: '4px',
                fontWeight: 'bold'
            });
            button.appendChild(badge);
            button.style.overflow = 'visible';
        }

        button.addEventListener('mouseenter', () => {
            button.style.color = '#00dffc';
            button.style.borderColor = '#00dffc';
            button.style.background = 'rgba(0, 223, 252, 0.1)';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 12px rgba(0, 223, 252, 0.2)';
        });

        button.addEventListener('mouseleave', () => {
            if (!isLastUsed) {
                button.style.color = 'rgba(255, 255, 255, 0.8)';
                button.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                button.style.background = 'rgba(255, 255, 255, 0.03)';
            } else {
                button.style.color = '#00dffc';
                button.style.borderColor = '#00dffc';
                button.style.background = 'rgba(0, 223, 252, 0.15)';
            }
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.96)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px) scale(1)';
        });

        return button;
    }

    // 使按钮可拖动
    function makeButtonDraggable(container, handle) {
        let isDragging = false;
        let offsetX, offsetY;
        
        handle.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            if (e.button !== 0) return; // 只响应左键
            
            isDragging = true;
            const containerRect = container.getBoundingClientRect();
            offsetX = e.clientX - containerRect.left;
            offsetY = e.clientY - containerRect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            const maxX = window.innerWidth - container.offsetWidth;
            const maxY = window.innerHeight - container.offsetHeight;
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            container.style.left = `${boundedX}px`;
            container.style.right = 'auto';
            container.style.top = `${boundedY}px`;
            container.style.bottom = 'auto';
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    // 移除已存在的按钮
    function removeExistingButtons() {
        const container = document.getElementById('jiangjiang-main-container');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }

    // 获取视频页面URL
    function getVideoUrl() {
        let currentUrl = window.location.href;
        const site = getCurrentSite();
        
        if (site.domain === 'iqiyi.com') {
            const urlObj = new URL(currentUrl);
            const params = new URLSearchParams(urlObj.search);
            params.delete('src');
            params.delete('fv');
            urlObj.search = params.toString();
            currentUrl = urlObj.toString();
        }
        else if (site.domain === 'youku.com') {
            const urlObj = new URL(currentUrl);
            const params = new URLSearchParams(urlObj.search);
            params.delete('sharekey');
            urlObj.search = params.toString();
            currentUrl = urlObj.toString();
        }
        else if (site.domain === 'bilibili.com') {
            const urlObj = new URL(currentUrl);
            const params = new URLSearchParams(urlObj.search);
            params.delete('share_source');
            params.delete('share_medium');
            params.delete('bbid');
            params.delete('ts');
            urlObj.search = params.toString();
            currentUrl = urlObj.toString();
        }
        else if (site.domain === 'mgtv.com') {
            const urlObj = new URL(currentUrl);
            const params = new URLSearchParams(urlObj.search);
            params.delete('fid');
            params.delete('from');
            urlObj.search = params.toString();
            currentUrl = urlObj.toString();
        }
        
        return encodeURIComponent(currentUrl.split('#')[0]);
    }

    // 构建API URL
    function buildApiUrl(videoUrl, apiConfig) {
        let apiUrl;
        
        // 如果有key，使用key参数格式
        if (apiConfig.key) {
            apiUrl = `${apiConfig.url}?key=${apiConfig.key}&url=${videoUrl}&t=${Date.now()}`;
        } else {
            // 没有key的接口直接拼接URL
            apiUrl = `${apiConfig.url}${videoUrl}`;
        }
        
        return apiUrl;
    }

    // 解析视频流地址
    function parseVideoStream(videoUrl, apiConfig, retry = 0) {
        return new Promise((resolve, reject) => {
            const apiUrl = buildApiUrl(videoUrl, apiConfig);
            
            console.log(`[${apiConfig.name}] 正在解析视频，尝试次数: ${retry + 1}`);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                timeout: config.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': window.location.origin
                },
                onload: function(response) {
                    try {
                        console.log(`[${apiConfig.name}] 响应状态:`, response.status);
                        
                        let data;
                        if (response.responseText.trim().startsWith('{')) {
                            data = JSON.parse(response.responseText);
                        } else if (response.responseText.trim().startsWith('[')) {
                            data = JSON.parse(response.responseText);
                        } else {
                            const urlMatch = response.responseText.match(/(https?:\/\/[^\s"']+)/);
                            if (urlMatch) {
                                resolve(urlMatch[0]);
                                return;
                            } else {
                                const text = response.responseText.trim();
                                if (text.startsWith('http')) {
                                    resolve(text);
                                    return;
                                }
                                // 对于百纳解析，可能直接返回视频地址
                                if (response.responseText.includes('http') && !response.responseText.includes('html')) {
                                    // 尝试从文本中提取URL
                                    const lines = response.responseText.split('\n');
                                    for (const line of lines) {
                                        if (line.includes('http') && !line.includes(' ')) {
                                            resolve(line.trim());
                                            return;
                                        }
                                    }
                                }
                                throw new Error('无法解析响应数据');
                            }
                        }
                        
                        let videoUrl = '';
                        
                        // 尝试多种可能的JSON结构
                        if (data.url) videoUrl = data.url;
                        else if (data.data && data.data.url) videoUrl = data.data.url;
                        else if (data.playUrl) videoUrl = data.playUrl;
                        else if (data.videoUrl) videoUrl = data.videoUrl;
                        else if (data.m3u8) videoUrl = data.m3u8;
                        else if (data.mp4) videoUrl = data.mp4;
                        else if (data.url_m3u8) videoUrl = data.url_m3u8;
                        else if (data.play_url) videoUrl = data.play_url;
                        else if (Array.isArray(data) && data[0] && data[0].url) videoUrl = data[0].url;
                        else if (data.msg && data.msg.includes('http')) {
                            videoUrl = data.msg;
                        }
                        
                        if (videoUrl && videoUrl.startsWith('http')) {
                            resolve(videoUrl);
                        } else {
                            if (retry < config.retryCount) {
                                console.log(`[${apiConfig.name}] 解析失败，正在重试 (${retry + 1}/${config.retryCount})...`);
                                setTimeout(() => {
                                    parseVideoStream(videoUrl, apiConfig, retry + 1)
                                        .then(resolve)
                                        .catch(reject);
                                }, 1000);
                            } else {
                                reject(new Error('无法获取视频地址'));
                            }
                        }
                    } catch (error) {
                        console.error(`[${apiConfig.name}] 解析错误:`, error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error(`[${apiConfig.name}] 请求错误:`, error);
                    if (retry < config.retryCount) {
                        console.log(`[${apiConfig.name}] 请求失败，正在重试 (${retry + 1}/${config.retryCount})...`);
                        setTimeout(() => {
                            parseVideoStream(videoUrl, apiConfig, retry + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        reject(error);
                    }
                },
                ontimeout: function() {
                    console.error(`[${apiConfig.name}] 请求超时`);
                    if (retry < config.retryCount) {
                        console.log(`[${apiConfig.name}] 请求超时，正在重试 (${retry + 1}/${config.retryCount})...`);
                        setTimeout(() => {
                            parseVideoStream(videoUrl, apiConfig, retry + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        reject(new Error('请求超时'));
                    }
                }
            });
        });
    }

    // 推送到PotPlayer
    async function pushToPotPlayer(videoStreamUrl) {
        try {
            console.log('视频流地址:', videoStreamUrl);
            
            const isVideoUrl = /\.(m3u8|mp4|flv|avi|mkv|mov|wmv|ts)(\?|$)/i.test(videoStreamUrl);
            
            if (!isVideoUrl) {
                console.warn('可能不是直接视频链接:', videoStreamUrl);
            }
            
            const potplayerUrl = `${config.potplayerProtocol}${videoStreamUrl}`;
            console.log('PotPlayer URL:', potplayerUrl);
            
            let opened = false;
            
            // 方法1：创建a标签点击
            try {
                const link = document.createElement('a');
                link.href = potplayerUrl;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    if (link.parentNode) {
                        link.parentNode.removeChild(link);
                    }
                }, 100);
                opened = true;
            } catch (e) {
                console.warn('a标签方法失败:', e);
            }
            
            // 方法2：使用GM_openInTab
            if (!opened) {
                try {
                    GM_openInTab(potplayerUrl, { active: false, insert: false });
                    opened = true;
                } catch (e) {
                    console.warn('GM_openInTab方法失败:', e);
                }
            }
            
            // 方法3：创建隐藏的iframe
            if (!opened) {
                try {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = potplayerUrl;
                    document.body.appendChild(iframe);
                    
                    setTimeout(() => {
                        if (iframe.parentNode) {
                            iframe.parentNode.removeChild(iframe);
                        }
                    }, 3000);
                    opened = true;
                } catch (e) {
                    console.warn('iframe方法失败:', e);
                }
            }
            
            return opened;
        } catch (error) {
            console.error('推送失败:', error);
            return false;
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const colors = {
            info: '#667eea',
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b'
        };
        
        // 移除已存在的通知
        document.querySelectorAll('.jiangjiang-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'jiangjiang-notification';
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: colors[type] || colors.info,
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: '100000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            animation: 'notificationSlideIn 0.3s ease',
            maxWidth: '80%',
            textAlign: 'center'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // 播放器容器配置
    const playerContainers = {
        'v.qq.com': { container: '#mod_player,#player-container,.container-player', displayNodes: ['#mask_layer', '.mod_vip_popup', '.panel-tip-pay'] },
        'm.v.qq.com': { container: '.mod_player,#player', displayNodes: ['.mod_vip_popup'] },
        'www.bilibili.com': { container: '#player_module,#bilibiliPlayer,#bilibili-player', displayNodes: [] },
        'm.bilibili.com': { container: '.player-wrapper,.player-container,.mplayer', displayNodes: [] },
        'www.iqiyi.com': { container: '#outlayer,.iqp-player-videolayer', displayNodes: ['#playerPopup', '#vipCoversBox', '.iqp-player-vipmask', '.iqp-player-paymask'] },
        'm.iqiyi.com': { container: '.m-video-player-wrap,.iqp-player-videolayer', displayNodes: ['.iqp-player-vipmask'] },
        'v.youku.com': { container: '#playerMouseWheel', displayNodes: ['#iframaWrapper'] },
        'm.youku.com': { container: '#playerMouseWheel,.h5-detail-player', displayNodes: [] },
        'www.mgtv.com': { container: '#mgtv-player-wrap', displayNodes: [] },
        'm.mgtv.com': { container: '.video-area', displayNodes: [] },
        'tv.sohu.com': { container: '#player', displayNodes: [] },
        'www.acfun.cn': { container: '#player', displayNodes: [] },
        'www.1905.com': { container: '#player,#vodPlayer', displayNodes: [] }
    };

    // 内嵌播放视频
    async function embedPlayVideo(videoUrl, apiConfig, site) {
        try {
            // 构建解析URL - 直接拼接，不需要encode
            const currentUrl = window.location.href;
            let embedUrl = apiConfig.url + currentUrl;
            console.log('内嵌播放URL:', embedUrl);
            
            // 获取当前网站的播放器容器配置
            const hostname = window.location.hostname;
            let containerConfig = null;
            for (const [host, config] of Object.entries(playerContainers)) {
                if (hostname.includes(host) || host.includes(hostname)) {
                    containerConfig = config;
                    break;
                }
            }
            
            // 查找播放器容器
            let playerContainer = null;
            if (containerConfig) {
                const selectors = containerConfig.container.split(',');
                for (const selector of selectors) {
                    playerContainer = document.querySelector(selector.trim());
                    if (playerContainer) {
                        console.log('找到播放器容器:', selector);
                        break;
                    }
                }
                
                // 隐藏干扰元素
                if (containerConfig.displayNodes) {
                    containerConfig.displayNodes.forEach(selector => {
                        const el = document.querySelector(selector);
                        if (el) el.style.display = 'none';
                    });
                }
            }
            
            // 如果没找到，尝试通用选择器
            if (!playerContainer) {
                const fallbackSelectors = ['#player', '.player', '[class*="player"]', 'video'];
                for (const selector of fallbackSelectors) {
                    playerContainer = document.querySelector(selector);
                    if (playerContainer) {
                        console.log('使用备用选择器:', selector);
                        break;
                    }
                }
            }
            
            // 停止原视频播放
            document.querySelectorAll('video').forEach(video => {
                if (video.src) {
                    video.removeAttribute('src');
                    video.muted = true;
                    video.load();
                    video.pause();
                }
            });
            
            if (!playerContainer) {
                // 如果找不到播放器，创建全屏容器
                const container = document.createElement('div');
                container.id = 'jiangjiang-embed-container';
                container.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999999;
                    background: #000;
                `;
                container.innerHTML = `<iframe src="${embedUrl}" style="width:100%;height:100%;border:none;" allowfullscreen="true"></iframe>`;
                document.body.appendChild(container);
            } else {
                // 清空原播放器并插入iframe
                playerContainer.innerHTML = '';
                playerContainer.style.cssText += 'position:relative;';
                playerContainer.innerHTML = `<div style="width:100%;height:100%;z-index:999999;"><iframe src="${embedUrl}" style="width:100%;height:100%;border:none;" allowfullscreen="true"></iframe></div>`;
            }
            
            showNotification(`[${apiConfig.name}] 视频已加载`, 'success');
            
        } catch (error) {
            console.error('内嵌播放失败:', error);
            throw error;
        }
    }

    // 暂停当前网站的视频播放
    function pauseCurrentVideo() {
        const site = getCurrentSite();
        if (!site) return false;
        
        console.log('尝试暂停视频...');
        
        try {
            // 方式1：直接找video标签
            const video = document.querySelector('video');
            if (video && !video.paused) {
                video.pause();
                console.log(`${site.name}视频已暂停（video标签）`);
                return true;
            }
            
            // 方式2：查找暂停按钮
            const pauseSelectors = [
                '[class*="pause"]',
                '[title*="暂停"]',
                'button[aria-label*="暂停"]',
                '.bpx-player-ctrl-play'
            ];
            
            for (const selector of pauseSelectors) {
                const pauseBtn = document.querySelector(selector);
                if (pauseBtn) {
                    pauseBtn.click();
                    console.log(`${site.name}已暂停（按钮）`);
                    return true;
                }
            }
        } catch (error) {
            console.warn('暂停视频失败:', error);
        }
        
        return false;
    }

    // 主处理函数
    async function handlePushToPotPlayer(apiConfig, buttonElement) {
        console.log('=== 开始处理 ===');
        console.log('API配置:', apiConfig.name);
        
        const site = getCurrentSite();
        if (!site) {
            console.error('无法识别当前网站');
            return;
        }
        
        const targetButton = buttonElement;
        const originalText = targetButton ? targetButton.textContent : '';
        
        try {
            // 显示加载状态
            if (targetButton) {
                targetButton.textContent = '加载中...';
                targetButton.style.pointerEvents = 'none';
                targetButton.style.color = '#00dffc';
                targetButton.style.borderColor = '#00dffc';
            }
            
            // 获取当前视频URL
            const videoUrl = getVideoUrl();
            
            // 根据接口类型选择处理方式
            if (apiConfig.type === 'embed') {
                showNotification(`[${apiConfig.name}] 正在加载...`, 'info');
                await embedPlayVideo(videoUrl, apiConfig, site);
            } else {
                showNotification(`[${apiConfig.name}] 正在解析...`, 'info');
                const videoStreamUrl = await parseVideoStream(videoUrl, apiConfig);
                
                showNotification(`正在推送到PotPlayer...`, 'info');
                const success = await pushToPotPlayer(videoStreamUrl);
                
                if (success) {
                    showNotification(`✓ 已推送到PotPlayer`, 'success');
                    setTimeout(() => pauseCurrentVideo(), 1000);
                    
                    const history = GM_getValue('pushHistory', []);
                    history.unshift({
                        site: site.name,
                        api: apiConfig.name,
                        url: window.location.href,
                        time: new Date().toLocaleString()
                    });
                    if (history.length > 50) history.pop();
                    GM_setValue('pushHistory', history);
                } else {
                    showNotification(`推送失败，请检查PotPlayer`, 'warning');
                }
            }
            
        } catch (error) {
            console.error(`[${apiConfig.name}] 错误:`, error);
            showNotification(`解析失败: ${error.message}`, 'error');
        } finally {
            // 恢复按钮状态
            if (targetButton) {
                targetButton.textContent = originalText;
                targetButton.style.pointerEvents = 'auto';
                targetButton.style.color = '#E6E6E6';
                targetButton.style.borderColor = '#666';
            }
        }
    }

    // 页面加载完成后初始化
    function init() {
        const site = getCurrentSite();
        if (!site) return;
        
        // 检查是否已经存在按钮
        if (!document.getElementById('jiangjiang-main-container')) {
            const container = createFloatButtons();
            
            // 添加键盘快捷键（只添加一次）
            addKeyboardListener();
            
            // 显示欢迎提示
            setTimeout(() => {
                showNotification(`VIP解析已启用，鼠标移到左侧VIP按钮展开菜单`, 'info');
            }, 1000);
        }
    }

    // 键盘快捷键处理
    let keyboardListenerAdded = false;
    function addKeyboardListener() {
        if (keyboardListenerAdded) return;
        keyboardListenerAdded = true;
        
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.altKey && !event.repeat) {
                const buttonIndex = parseInt(event.key) - 1;
                if (buttonIndex >= 0 && buttonIndex < config.apis.length) {
                    event.preventDefault();
                    const buttons = document.querySelectorAll('#jiangjiang-buttons-container button');
                    if (buttons[buttonIndex]) {
                        buttons[buttonIndex].click();
                    }
                }
            }
        });
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 初始化样式
    initStyles();

    // 监听页面变化
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            
            const site = getCurrentSite();
            if (site) {
                // 延迟初始化，等待新内容加载
                setTimeout(() => {
                    removeExistingButtons();
                    init();
                }, 1500);
            }
        }
    });
    
    observer.observe(document, { subtree: true, childList: true });
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

})();