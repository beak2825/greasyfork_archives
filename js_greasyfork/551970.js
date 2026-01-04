// ==UserScript==
// @name         флепи берд лол
// @namespace    http://tampermonkey.net/
// @version      1
// @description  флепи борд лолзовский
// @author       Патруль
// @match        https://lolz.live/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551970/%D1%84%D0%BB%D0%B5%D0%BF%D0%B8%20%D0%B1%D0%B5%D1%80%D0%B4%20%D0%BB%D0%BE%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/551970/%D1%84%D0%BB%D0%B5%D0%BF%D0%B8%20%D0%B1%D0%B5%D1%80%D0%B4%20%D0%BB%D0%BE%D0%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.style.position = 'fixed';
    btn.style.bottom = '15px';
    btn.style.right = '80px';
    btn.style.zIndex = '9999';
    btn.style.padding = '0';
    btn.style.backgroundColor = 'transparent';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = 'none';
    btn.style.borderRadius = '50%';

    const img = document.createElement('img');
    img.src = 'https://vectorified.com/images/flappy-bird-icon-21.png';
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.borderRadius = '50%';
    img.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    btn.appendChild(img);

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        unsafeWindow.XenForo.alert(
            '<iframe src="https://nb-ga.github.io/games-site/projects/flappy-bird/index.html" style="width: 800px; height: 500px; margin: -15px -20px; background: #fff"></iframe>',
            'Flappy Bird'
        );
    });
})();
