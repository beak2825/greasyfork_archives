// ==UserScript==
// @name         超链接文本复制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  按住Shift右键点击超链接，可通过隔离样式的复制菜单进行复制文本
// @author       Aomine
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='0' y='24' font-size='24'>📝 </text></svg>
// @grant        GM_setClipboard
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/551238/%E8%B6%85%E9%93%BE%E6%8E%A5%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/551238/%E8%B6%85%E9%93%BE%E6%8E%A5%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

let activeLink = null;

document.addEventListener('contextmenu', function(e) {
    // 检查是否按住 Shift 键
    if (!e.shiftKey) return;

    const link = e.target.closest('a');
    if (!link) return;

    e.preventDefault(); // 阻止默认右键菜单
    activeLink = link;

    // 创建 Shadow DOM 容器（彻底隔离样式）
    const menuContainer = document.createElement('div');
    const shadow = menuContainer.attachShadow({ mode: 'closed' });

    // 注入隔离样式
    shadow.innerHTML = `
        <style>
            .custom-link-menu {
                position: absolute;
                background: white;
                border: 1px solid #ddd;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 999999;
                padding: 5px 0;
                min-width: 150px;
                font-family: Arial, sans-serif !important;
            }
            .custom-link-menu-item {
                padding: 5px 15px;
                cursor: pointer;
                color: #333 !important;
                font-size: 14px !important;
            }
            .custom-link-menu-item:hover {
                background: #f0f0f0 !important;
            }
        </style>
        <div class="custom-link-menu">
            <div class="custom-link-menu-item" id="copy-text">复制链接文本</div>
            <div class="custom-link-menu-item" id="cancel">取消</div>
        </div>
    `;

    // 定位菜单
    menuContainer.style.position = 'absolute';
    menuContainer.style.left = `${e.pageX}px`;
    menuContainer.style.top = `${e.pageY}px`;
    document.body.appendChild(menuContainer);

    // 绑定事件
    shadow.getElementById('copy-text').addEventListener('click', () => {
        GM_setClipboard(activeLink.innerText.trim());
        menuContainer.remove();
    });

    shadow.getElementById('cancel').addEventListener('click', () => {
        menuContainer.remove();
    });

    // 点击其他地方关闭菜单
    const closeMenu = (e) => {
        if (!menuContainer.contains(e.target)) {
            menuContainer.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    document.addEventListener('click', closeMenu);
}, true);
