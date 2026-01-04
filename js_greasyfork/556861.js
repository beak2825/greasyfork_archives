// ==UserScript==
// @name         虫部落 UI补充
// @license MIT
// @namespace    https://greasyfork.org/zh-CN/users/1272865
// @version      0.3
// @description  快捷按钮，对权限图标加上更直观的颜色
// @author       brewin
// @match        https://www.chongbuluo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556861/%E8%99%AB%E9%83%A8%E8%90%BD%20UI%E8%A1%A5%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/556861/%E8%99%AB%E9%83%A8%E8%90%BD%20UI%E8%A1%A5%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ////////////////////////////////////////////////////// 导航按钮  ///////////////////////////////////////////////

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找目标容器元素
        const myinfo = document.getElementById('myinfo');
        if (!myinfo) {
            console.log('未找到myinfo元素，无法添加快捷链接');
            return;
        }

        // 查找插入位置的参考点(br标签)
        const brTag = myinfo.querySelector('br');
        if (!brTag) {
            console.log('未找到br标签，无法添加快捷链接');
            return;
        }

        // 定义要添加的快捷链接 - 数据驱动，便于维护
        const linkGroups = [
            [
                { text: '好友', href: 'home.php?mod=space&do=friend' },
                { text: '访客', href: 'home.php?mod=space&do=friend&view=visitor' },
                { text: '足迹', href: 'home.php?mod=space&do=friend&view=trace' },
                { text: '我的帖子', href: 'home.php?mod=space&do=thread&view=me&type=reply' },
                { text: '草稿箱', href: 'home.php?mod=space&do=thread&view=me&type=thread&from=&filter=save' }

            ],
            [
                { text: '悬赏', href: 'forum.php?mod=forumdisplay&fid=112&filter=lastpost&orderby=lastpost&specialtype=reward' },
                { text: '反馈', href: 'forum.php?mod=forumdisplay&fid=123' }
            ]
        ];

        // 链接样式 - 统一设置
        const linkStyle = 'margin-right: 2px; text-decoration: none;';

        // 当前插入的参考元素
        let currentRefElement = brTag;

        // 循环创建链接组
        linkGroups.forEach((group, groupIndex) => {

            // 创建组内链接
            group.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.style = linkStyle;
                linkElement.href = link.href;
                linkElement.textContent = link.text;

                // 插入到当前参考元素后面
                currentRefElement.insertAdjacentElement('afterend', linkElement);
                currentRefElement = linkElement;
            });

            // 在每组链接后添加换行
            const br = document.createElement('br');
            currentRefElement.insertAdjacentElement('afterend', br);
            currentRefElement = br;
        });

       ////////////////////////////////////////////////////// 优化UI  ///////////////////////////////////////////////

        // 设置myinfo元素的高度和宽度
        //myinfo.style.height = '115px';
        myinfo.style.width = '140px';

        // 1. 处理“勾选图标”：未设置color时添加绿色
        const checkIcons = document.querySelectorAll(
            'span.iconfont.icon-check-circle-fill:not([style*="color"])'  // 筛选无color样式的勾选图标
        );
        checkIcons.forEach(icon => {
            icon.style.color = 'green';
        });

        // 2. 处理“关闭图标”：未设置color时添加红色
        const closeIcons = document.querySelectorAll(
            'span.iconfont.icon-close-circle-fill:not([style*="color"])'  // 筛选无color样式的关闭图标
        );
        closeIcons.forEach(icon => {
            icon.style.color = 'red';
        });



    }, false);
})();
