// ==UserScript==
// @name         屏蔽知乎复制迷你菜单(增强版)
// @namespace    https://github.com/yourname
// @version      1.1
// @description  精确屏蔽知乎复制后出现的迷你菜单，包括三角形指示器
// @author       You
// @match        https://*.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561798/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%A4%8D%E5%88%B6%E8%BF%B7%E4%BD%A0%E8%8F%9C%E5%8D%95%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561798/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%A4%8D%E5%88%B6%E8%BF%B7%E4%BD%A0%E8%8F%9C%E5%8D%95%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('知乎复制迷你菜单屏蔽脚本已加载');

    // 1. 强力的CSS隐藏 - 针对所有可能的类名和元素
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏迷你菜单容器 */
        .css-1h2knxp {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* 隐藏内部子元素 */
        .css-fg13ww,
        .css-15eh6e9,
        .css-1ekj6dv {
            display: none !important;
        }

        /* 强制隐藏三角形指示器 - 多层级选择器确保生效 */
        .css-1h2knxp .css-1qf3hh,
        .css-1h2knxp > .css-1qf3hh,
        .css-1qf3hh,
        .ZDI--AgreeFill24,
        svg[fill-rule="evenodd"][d*="13.792 3.681"],
        svg[class*="AgreeFill"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
        }

        /* 隐藏所有包含特定路径的SVG */
        svg path[d*="13.792 3.681"] {
            display: none !important;
        }

        /* 防止任何可能的伪元素 */
        .css-1h2knxp::before,
        .css-1h2knxp::after,
        .css-fg13ww::before,
        .css-fg13ww::after {
            display: none !important;
            content: none !important;
        }
    `;

    // 立即添加样式
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(style);
        });
    }

    // 2. 专门针对三角形SVG的移除函数
    function removeTriangleIndicator() {
        // 通过类名查找
        const trianglesByClass = document.querySelectorAll('.css-1qf3hh, .ZDI--AgreeFill24');
        trianglesByClass.forEach(el => {
            console.log('移除三角形指示器(通过类名):', el.className);
            el.remove();
        });

        // 通过SVG路径内容查找
        const allSvgs = document.querySelectorAll('svg');
        allSvgs.forEach(svg => {
            const paths = svg.querySelectorAll('path');
            paths.forEach(path => {
                const d = path.getAttribute('d') || '';
                if (d.includes('13.792 3.681') || d.includes('13.792 3.681c')) {
                    console.log('移除三角形指示器(通过路径):', svg.className);
                    svg.remove();
                }
            });
        });

        // 通过父容器查找
        const menuContainers = document.querySelectorAll('.css-1h2knxp');
        menuContainers.forEach(container => {
            const svgs = container.querySelectorAll('svg');
            svgs.forEach(svg => {
                if (svg.classList.contains('css-1qf3hh') ||
                    svg.classList.contains('ZDI--AgreeFill24')) {
                    console.log('从容器中移除三角形指示器');
                    svg.remove();
                }
            });
        });
    }

    // 3. 使用MutationObserver实时监控并移除
    const observer = new MutationObserver(function(mutations) {
        let foundMenu = false;

        mutations.forEach(function(mutation) {
            // 检查新增的节点
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // 检查是否是菜单容器
                    if (node.classList && node.classList.contains('css-1h2knxp')) {
                        console.log('检测到迷你菜单容器，立即移除');
                        foundMenu = true;
                        node.remove();
                    }

                    // 检查是否包含菜单容器
                    if (node.querySelectorAll) {
                        const menus = node.querySelectorAll('.css-1h2knxp');
                        if (menus.length > 0) {
                            console.log('检测到子菜单容器，立即移除');
                            foundMenu = true;
                            menus.forEach(menu => menu.remove());
                        }

                        // 检查是否有三角形指示器
                        const triangles = node.querySelectorAll('.css-1qf3hh, .ZDI--AgreeFill24');
                        if (triangles.length > 0) {
                            console.log('检测到三角形指示器，立即移除');
                            triangles.forEach(triangle => triangle.remove());
                        }
                    }
                }
            });
        });

        // 如果有菜单出现，额外检查一次三角形指示器
        if (foundMenu) {
            setTimeout(removeTriangleIndicator, 50);
        }
    });

    // 4. 启动观察器
    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true, // 监控属性变化
            attributeFilter: ['class'] // 只监控class属性变化
        });

        // 立即检查一次，移除可能已经存在的菜单和指示器
        const existingMenus = document.querySelectorAll('.css-1h2knxp');
        existingMenus.forEach(menu => {
            console.log('移除已存在的迷你菜单容器');
            menu.remove();
        });

        removeTriangleIndicator();
    }

    // 5. 页面加载完成后启动Observer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    // 6. 阻止复制事件并清理
    document.addEventListener('copy', function(e) {
        // 复制后稍微延迟，然后彻底清理
        setTimeout(() => {
            // 移除菜单容器
            const menus = document.querySelectorAll('.css-1h2knxp');
            menus.forEach(menu => {
                console.log('复制后移除菜单容器');
                menu.remove();
            });

            // 专门清理三角形指示器
            removeTriangleIndicator();
        }, 10);
    }, true); // 使用捕获阶段，确保我们先处理

    // 7. 更频繁的定期清理
    setInterval(() => {
        const menus = document.querySelectorAll('.css-1h2knxp');
        if (menus.length > 0) {
            console.log('定期清理：移除', menus.length, '个迷你菜单容器');
            menus.forEach(menu => menu.remove());
        }

        // 也清理可能单独存在的三角形指示器
        removeTriangleIndicator();
    }, 300); // 每300ms检查一次，更频繁

    // 8. 监听鼠标事件，防止菜单出现
    document.addEventListener('mouseup', function(e) {
        // 如果用户选择了文本，可能会触发菜单
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            console.log('检测到文本选择，准备清理菜单');
            setTimeout(() => {
                removeTriangleIndicator();
                document.querySelectorAll('.css-1h2knxp').forEach(menu => menu.remove());
            }, 100);
        }
    }, true);

    // 9. 监听知乎的单页应用路由变化
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('页面URL变化，重新检查并清理');
            // 重新检查并移除可能出现的菜单
            setTimeout(() => {
                document.querySelectorAll('.css-1h2knxp').forEach(menu => menu.remove());
                removeTriangleIndicator();
            }, 500);
        }
    });

    // 监听body变化来检测URL变化
    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('增强版脚本初始化完成');
})();