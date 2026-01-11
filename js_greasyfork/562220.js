// ==UserScript==
// @name         Bangumi 快捷关联角色/条目
// @version      1.0
// @description  在角色介绍和关联条目旁添加快捷关联入口
// @author       墨云
// @match        *://bangumi.tv/subject/*
// @match        *://bgm.tv/subject/*
// @match        *://chii.in/subject/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1354622
// @downloadURL https://update.greasyfork.org/scripts/562220/Bangumi%20%E5%BF%AB%E6%8D%B7%E5%85%B3%E8%81%94%E8%A7%92%E8%89%B2%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/562220/Bangumi%20%E5%BF%AB%E6%8D%B7%E5%85%B3%E8%81%94%E8%A7%92%E8%89%B2%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const subjectId = window.location.pathname.split('/')[2];
    if (!subjectId) return;

    const subtitles = document.querySelectorAll('h2.subtitle');

    subtitles.forEach(h2 => {
        const titleText = h2.textContent.trim();

        if (titleText === '角色介绍') {
            const charLink = document.createElement('a');
            charLink.href = `/subject/${subjectId}/add_related/character`;
            charLink.className = 'l';
            charLink.style.marginLeft = '10px';
            charLink.style.fontSize = '12px';
            charLink.style.fontWeight = 'normal';
            charLink.textContent = '[关联角色]';
            h2.appendChild(charLink);
        }

        if (titleText === '关联条目') {
            const relLink = document.createElement('a');
            relLink.href = `/subject/${subjectId}/add_related/subject/anime`;
            relLink.className = 'l';
            relLink.style.marginLeft = '10px';
            relLink.style.fontSize = '12px';
            relLink.style.fontWeight = 'normal';
            relLink.textContent = '[关联条目]';
            h2.appendChild(relLink);
        }
    });
})();