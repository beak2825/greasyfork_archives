// ==UserScript==
// @name         WoD 美化
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @description  美化一下老旧的WoD网站页面
// @namespace    lunzhiPenxil
// @repository   https://github.com/lunzhiPenxil/WoDBeautify
// @license      AGPL3
// @version      2025.12.30.2
// @include      http*://*.world-of-dungeons.org/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560353/WoD%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560353/WoD%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    // 默认设置
    const defaultSettings = {
        enableBaseTransition: true,
        enableLinkUnderline: true,
        enableLeftMenu: true,
        enableTopMenu: true
    };

    // 加载设置
    function loadSettings() {
        const settings = {};
        for (const key in defaultSettings) {
            settings[key] = GM_getValue(key, defaultSettings[key]);
        }
        return settings;
    }

    // 保存设置
    function saveSettings(settings) {
        for (const key in settings) {
            GM_setValue(key, settings[key]);
        }
        // 重新加载CSS
        applyStyles(settings);
    }

    // 显示设置对话框
    function showSettingsDialog() {
        const settings = loadSettings();
        
        let dialog = document.createElement('div');
        dialog.innerHTML = /*html*/ `
            <div class="WoDBeautifyConfig">
                <h3 class="title">WoD 美化设置</h3>
                <div class="config">
                    ${Object.keys(settings).map(key => `
                        <label class="configLable">
                            <input type="checkbox" id="${key}" ${settings[key] ? 'checked' : ''}>
                            <span>${getSettingLabel(key)}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="buttonBox">
                    <button id="saveBtn">保存设置</button>
                    <button id="closeBtn">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // 事件监听
        dialog.querySelector('#saveBtn').addEventListener('click', () => {
            const newSettings = {};
            Object.keys(settings).forEach(key => {
                newSettings[key] = dialog.querySelector(`#${key}`).checked;
            });
            saveSettings(newSettings);
            document.body.removeChild(dialog);
        });
        
        dialog.querySelector('#closeBtn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        // 点击背景关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }

    // 获取设置项标签
    function getSettingLabel(key) {
        const labels = {
            enableBaseTransition: '基础特效',
            enableLinkUnderline: '超链接下划线特效',
            enableLeftMenu: '左侧菜单特效',
            enableTopMenu: '顶部菜单栏现代化'
        };
        return labels[key] || key;
    }

    // CSS片段定义
    const cssFragments = {
        buildInCSS: /*css*/ `
            /* == 配置菜单自用的 CSS == */
            @keyframes flipInX {
              from {
                transform: translate(-50%, -50%) perspective(400px) rotate3d(1, 0, 0, 90deg);
                animation-timing-function: ease-in;
                opacity: 0;
              }
          
              40% {
                transform: translate(-50%, -50%) perspective(400px) rotate3d(1, 0, 0, -20deg);
                animation-timing-function: ease-in;
              }
          
              60% {
                transform: translate(-50%, -50%) perspective(400px) rotate3d(1, 0, 0, 10deg);
                opacity: 1;
              }
          
              80% {
                transform: translate(-50%, -50%) perspective(400px) rotate3d(1, 0, 0, -5deg);
              }
          
              to {
                transform: translate(-50%, -50%) perspective(400px);
              }
            }

            @keyframes pulse {
                from {
                    transform: scale3d(1, 1, 1);
                }
                50% {
                    transform: scale3d(1.05, 1.05, 1.05);
                }
                to {
                    transform: scale3d(1, 1, 1);
                }
            }

            div.WoDBeautifyConfig {
                position: fixed;
                z-index: 10000;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a80;
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 30px 40px 10px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                min-width: 300px;
                font-family: Arial, sans-serif;
                animation: flipInX 600ms ease-out forwards;
                transition: all 300ms;
            }

            div.WoDBeautifyConfig h3.title {
                margin-top: 0;
                border-bottom: 1px solid #333;
                padding-bottom: 10px;
            }

            div.WoDBeautifyConfig div.config {
                margin: 15px 0;
            }

            div.WoDBeautifyConfig div.config label.configLable {
                display: flex;
                align-items: center;
                margin: 10px 0;
                cursor: pointer;
            }

            div.WoDBeautifyConfig div.config label.configLable input {
                margin-right: 10px;
            }

            div.WoDBeautifyConfig div.buttonBox {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }

            div.WoDBeautifyConfig div.buttonBox button#saveBtn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }

            div.WoDBeautifyConfig div.buttonBox button#closeBtn {
                background: #666;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }

            div.WoDBeautifyConfig div.buttonBox :is(
                button#saveBtn,
                button#closeBtn
            ):hover {
                filter: brightness(120%);
                animation: pulse 500ms ease forwards;
            }
        `,
    
        baseTransition: /*css*/ `
            /* == 基础过渡 == */
            * {
                transition: all 300ms;
            }
        `,

        linkUnderline: /*css*/ `
            /* == 超链接下划线动画 == */
            :is(
                .gadget.main_content.popup,
                .content_table,
                #gadgettable-top,
                #gadgettable-center,
                #gadgettable-right
            ) a:not(:has(:is(
                span.prevHeroLinkImageLeft,
                span.nextHeroLinkImageRight,
                span.font_Hero_Name
            ))) {
                position: relative !important;
                width: max-content;
                padding: 0;
                transition: color 200ms, transform 350ms cubic-bezier(0, 0, 0, 2);
            }

            :is(
                .gadget.main_content.popup,
                .content_table,
                #gadgettable-top,
                #gadgettable-center,
                #gadgettable-right
            ) a:not(:has(:is(
                span.prevHeroLinkImageLeft,
                span.nextHeroLinkImageRight,
                span.font_Hero_Name
            )))::after {
                content: "";
                position: absolute;
                bottom: 0px;
                left: 100%;
                width: 0;
                height: 1px;
                background: #ffffff;
                transition: width 350ms, left 350ms;
            }

            :is(
                .gadget.main_content.popup,
                .content_table,
                #gadgettable-top,
                #gadgettable-center,
                #gadgettable-right
            ) a:not(:has(:is(
                span.prevHeroLinkImageLeft,
                span.nextHeroLinkImageRight,
                span.font_Hero_Name
            )))::after {
                height: 1px;
            }

            :is(
                .gadget.main_content.popup,
                .content_table,
                #gadgettable-top,
                #gadgettable-center,
                #gadgettable-right
            ) a:not(:has(:is(
                span.prevHeroLinkImageLeft,
                span.nextHeroLinkImageRight,
                span.font_Hero_Name
            ))):hover::after {
                left: 0;
                width: 100%;
                transition: width 350ms, left 0ms;
            }

            .changeHeroLink::after {
                display: none;
            }
        `,

        leftMenu: /*css*/ `
            /* == 左侧菜单自适应，flex化 == */
            #gadgettable-left * {
                transition: all 300ms;
            }

            #gadgettable-left a {
                width: max-content;
            }

            #gadgettable-left a:hover {
                transform: translateX(20%) scale(1.5);
            }

            #gadgettable-left #gadgettable-left-gadgets {
                padding-left: 0;
            }

            #gadgettable-left .gadget_scroll .menu-vertical {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #gadgettable-left .gadget_scroll .menu-vertical .menu-0-body {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #gadgettable-left .gadget_scroll .menu-vertical .menu-0-body > * {
                overflow: hidden;
                box-sizing: border-box;
            }

            #gadgettable-left .gadget_scroll .menu-vertical .menu-1 {
                padding-bottom: 8px;
                padding-left: 8px;
            }

            #gadgettable-left .gadget_scroll .menu-vertical .menu-1:has(.menu-1-body) {
                padding-bottom: 0;
            }

            #gadgettable-left .gadget_scroll .menu-vertical .menu-1:has(.menu-1-caption) .menu-1-body {
                display: block !important;
                padding: 0;
                padding-top: 8px;
                padding-left: 0;
                max-height: 0;
                overflow: hidden;
                transition: max-height 300ms ease, padding 800ms ease-out;
            }

            #gadgettable-left .gadget_scroll .menu-vertical .menu-1:has(.menu-1-caption.selected) .menu-1-body {
                max-height: 700px;
                padding-left: 8px;
            }

            .menu-1-arrow,
            .menu-2-arrow {
                display: none; /* 暂时禁用原生的下拉菜单箭头 */
            }

            .menu-2 .menu-2-body {
                display: block !important; /* 原生的逻辑在这块有问题，这里强制展示 */
            }

            .menu-1-arrow.open,
            .menu-2-arrow.closed.open {
                background: url(https://delta.world-of-dungeons.org/wod/css//skins/skin-8/images/page/navigate_down.png) no-repeat;
            }

            .menu-1,
            .menu-2 {
                position: relative !important;
            }

            :is(
                .menu-1:has(.menu-1-body),
                .menu-2:has(.menu-2-body)
            )::after {
                position: absolute;
                display: block;
                content: "";
                background: url(https://delta.world-of-dungeons.org/wod/css//skins/skin-8/images/page/navigate_right.png) no-repeat;
                top: 5px;
                right: 8px;
                height: 16px;
                width: 16px;
                transition: transform 300ms cubic-bezier(0, 0, 0, 1.5);
            }

            :is(
                .menu-1:has(.menu-1-body):has(.menu-1-caption.selected),
                .menu-2:has(.menu-2-body):has(.menu-2-caption) /* 前面已经强制全部情况都是展开了，所以这里也是 */
            )::after {
                transform: rotate(90deg);
            }

            .menu-1 > a {
                position: relative !important;
            }

            .menu-1 > a:after {
                position: absolute;
                display: block;
                content: "";
                top: 0;
                left: -8px;
                height: 0;
                width: 0;
                transition: transform 300ms cubic-bezier(0, 0, 0, 1.5), box-shadow 1200ms ease-out;
                transform: none !important;
                transform-origin: center center;
                box-shadow: 0px 0px 0px 0px #ffcf00;
                background: #ffffff00;
            }
            
            .menu-1:has(.menu-1-body):has(.menu-1-caption.selected) > a:after {
                box-shadow: 0 0 160px 40px #ffcf00;
            }
        `,

        topMenu: /*css*/ `
            /* == 顶部菜单栏 == */
            #gadgettable-top * {
                transition: all 300ms;
            }

            #gadgettable-top {
                position: fixed;
                z-index: 999;
                width: 100%;
            }

            #gadgettable-top .background {
                background-color: #1a1a1a80;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0px 0px 20px -4px #000000;
            }

            #gadgettable-top :is(
                .border-top,
                .border-bottom,
                .border-left,
                .border-right
            ) {
                display: none;
            }

            #gadgettable-top .gadget_scroll {
                overflow-y: hidden;
            }

            #gadgettable-left,
            #gadgettable-center,
            #gadgettable-right {
                padding-top: 20px;
            }
        `
    };

    // 应用CSS样式
    function applyStyles(settings) {
        let css = '';

        css += cssFragments.buildInCSS;
        
        if (settings.enableBaseTransition) {
            css += cssFragments.baseTransition;
        }
        
        if (settings.enableLinkUnderline) {
            css += cssFragments.linkUnderline;
        }
        
        if (settings.enableLeftMenu) {
            css += cssFragments.leftMenu;
        }
        
        if (settings.enableTopMenu) {
            css += cssFragments.topMenu;
        }
        
        // 移除旧的样式
        const oldStyle = document.getElementById('wod-beautify-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        // 添加新的样式
        if (css.trim()) {
            const style = document.createElement('style');
            style.id = 'wod-beautify-style';
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // 初始化
    const settings = loadSettings();
    applyStyles(settings);
    
    // 注册菜单命令
    GM_registerMenuCommand('⚙️ WoD 美化设置', showSettingsDialog);

    // 一次性初始化函数
    function initMenuStatesOnce() {
        const allMenus = document.querySelectorAll('.menu-1');
        const total = allMenus.length;

        if (total === 0) {
            console.log('[WoD美化] 未找到菜单元素');
            return;
        }

        let marked = 0;

        allMenus.forEach(menu => {
            const caption = menu.querySelector('.menu-1-caption');
            if (caption && menu.classList.contains('open')) {
                caption.classList.add('selected');
                marked++;
            }
        });

        console.log(`[WoD美化] 完成。检查了 ${total} 个菜单，标记了 ${marked} 个`);
    }

    // 在DOM就绪后执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenuStatesOnce);
    } else {
        setTimeout(initMenuStatesOnce, 50);
    }
})();