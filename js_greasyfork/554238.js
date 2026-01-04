// ==UserScript==
// @name         去除雪球弹窗、侧边栏、聊天栏 (ddrwin原版，修改版自用)
// @namespace    https://github.com/your-namespace
// @version      1.3
// @description  去除雪球弹窗、自动展开"查看更多"，优化页面布局
// @author       ddrwin (jerry modified)
// @match        *://xueqiu.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @homepage    https://greasyfork.org/en/scripts/554238
// @downloadURL https://update.greasyfork.org/scripts/554238/%E5%8E%BB%E9%99%A4%E9%9B%AA%E7%90%83%E5%BC%B9%E7%AA%97%E3%80%81%E4%BE%A7%E8%BE%B9%E6%A0%8F%E3%80%81%E8%81%8A%E5%A4%A9%E6%A0%8F%20%28ddrwin%E5%8E%9F%E7%89%88%EF%BC%8C%E4%BF%AE%E6%94%B9%E7%89%88%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554238/%E5%8E%BB%E9%99%A4%E9%9B%AA%E7%90%83%E5%BC%B9%E7%AA%97%E3%80%81%E4%BE%A7%E8%BE%B9%E6%A0%8F%E3%80%81%E8%81%8A%E5%A4%A9%E6%A0%8F%20%28ddrwin%E5%8E%9F%E7%89%88%EF%BC%8C%E4%BF%AE%E6%94%B9%E7%89%88%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==


// original: https://update.greasyfork.org/scripts/543938/
(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        /* 隐藏聊天栏 */
/*
         #snb_im {
            display: none !important;
        }
*/

        /* 隐藏侧边栏 */
/*
        .home__col--rt {
            display: none !important;
        }
*/

        /* 调整主内容区宽度 */
        .home__col--lt {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 0 20px !important;
        }

        /* 去除弹窗 */
        .modal__jianlian, .index_close_1Ux, .index_con_1AQ {
            display: none !important;
        }

        /* 优化页面布局 */
        body {
            background-color: #f5f7fa;
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        }
        .container {
            padding: 20px 0;
        }
        .home__main {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
            padding: 25px;
            margin-bottom: 20px;
        }
        .home__main-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }

        /* 自动展开的内容样式 */
        .expanded-content {
            background: #f9fafc;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            border-left: 3px solid #1e80ff;
        }

        /* 优化帖子样式 */
        .status__content {
            line-height: 1.7;
            font-size: 15px;
            color: #333;
        }

        /* 优化评论区域 */
        .comments__editor {
            background: #f9fafc;
            border-radius: 8px;
            padding: 15px;
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
            .home__col--lt {
                padding: 0 10px !important;
            }
            .home__main {
                padding: 15px;
            }
        }
    `);

    // 自动关闭弹窗的函数
    function closePopups() {
        // 第一种弹窗
        const popup1 = document.querySelector('div.modal.modal__jianlian.image__modal.taichi_popup');
        const closeBtn1 = document.querySelector('div.modal.modal__jianlian.image__modal.taichi_popup > a.close');

        // 第二种弹窗
        const popup2 = document.querySelector('a.index_close_1Ux');
        const closeBtn2 = document.querySelector('a.index_close_1Ux');

        if (popup1 && closeBtn1) {
            closeBtn1.click();
        }

        if (popup2 && closeBtn2) {
            closeBtn2.click();
        }
    }

    // 自动展开"查看更多"内容
    function expandShowMore() {
        // 原有的 show_more 按钮
        const showMoreButtons = document.querySelectorAll('a.show_more');
        showMoreButtons.forEach(button => {
            if (!button.classList.contains('expanded-by-script')) {
                button.classList.add('expanded-by-script');
                button.click();

                const container = button.closest('.status__content');
                if (container) {
                    container.classList.add('expanded-content');
                }
            }
        });

        // 新增：timeline__expand__control 按钮
        const timelineExpandButtons = document.querySelectorAll('a.timeline__expand__control');
        timelineExpandButtons.forEach(button => {
            if (!button.classList.contains('expanded-by-script')) {
                button.classList.add('expanded-by-script');
                button.click();
            }
        });

        // 新增：unfold 按钮
        const unfoldButtons = document.querySelectorAll('a.unfold');
        unfoldButtons.forEach(button => {
            if (!button.classList.contains('expanded-by-script')) {
                button.classList.add('expanded-by-script');
                button.click();
            }
        });
    }

    // 优化页面布局的额外调整
    function optimizeLayout() {
        // 调整主内容区域
        const mainContent = document.querySelector('.home__main');
        if (mainContent) {
            mainContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
            mainContent.style.borderRadius = '10px';
        }

        // 优化帖子标题
        const postTitles = document.querySelectorAll('.status__title');
        postTitles.forEach(title => {
            title.style.fontSize = '18px';
            title.style.fontWeight = '600';
            title.style.color = '#1d2129';
            title.style.marginBottom = '10px';
        });

        // 优化帖子元信息
        const postMetas = document.querySelectorAll('.status__meta');
        postMetas.forEach(meta => {
            meta.style.color = '#86909c';
            meta.style.fontSize = '13px';
            meta.style.marginBottom = '15px';
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                closePopups();
                expandShowMore();
                optimizeLayout();
            }
        });
    });

    // 开始观察整个文档
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 初始执行
    closePopups();
    expandShowMore();
    optimizeLayout();

    // 延时执行确保所有元素加载完毕
    setTimeout(() => {
        closePopups();
        expandShowMore();
        optimizeLayout();
    }, 3000);

    // 额外的延时执行，确保动态加载的内容也能被处理
    setTimeout(() => {
        expandShowMore();
    }, 5000);

//     // 添加脚本标识
//     const scriptTag = document.createElement('div');
//     scriptTag.innerHTML = `
//         <div style="position:fixed; bottom:20px; right:20px; background:#1e80ff; color:white; padding:8px 15px; border-radius:20px; font-size:12px; z-index:9999; box-shadow:0 3px 10px rgba(30,128,255,0.3);">
//             雪球优化脚本已启用 ✓
//         </div>
//     `;
//     document.body.appendChild(scriptTag);

//     // 5秒后移除标识
//     setTimeout(() => {
//         scriptTag.remove();
//     }, 5000);
})();