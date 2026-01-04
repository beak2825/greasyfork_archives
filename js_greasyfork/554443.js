// ==UserScript==
// @name         adblock-newtoki
// @namespace    adblock-newtoki
// @version      0.2.10
// @description  all adblock
// @author       1984kg
// @include      /^https://(blacktoon|booktoki|newtoki|manatoki)\d+\.(com|net)/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554443/adblock-newtoki.user.js
// @updateURL https://update.greasyfork.org/scripts/554443/adblock-newtoki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://greasyfork.org/
    // @match       *://*/**/
    // @match        https://blacktoon395.com/
    // @include      /^https?:\/\/([^.]+\.)?blacktoon\d+\.com\//
    //if (!/blacktoon\d+\.com/.test(location.hostname)) return;

    const domains = ['blacktoon.com', 'booktoki.com', 'newtoki.com', 'manatoki.net'];
    const domain = document.domain.replace(/[0-9]/g, '');
    const pagename = location.pathname.split('/').slice(0, 3).join('/');
    const isBookmark = pagename.indexOf('/webtoon/') > -1 && document.querySelector('.bottom-navbar') == null;
    const isList = document.querySelector('.board-list') != null;

    let webtoon = {};

    if (domains.includes(domain) > -1) {
        adblock(domain);
    }

    loadLocalStorage();

    async function loadLocalStorage() {
        webtoon = JSON.parse(localStorage.getItem('webtoon'));

        if (webtoon == null || Object.keys(webtoon).length == 0) {
            const response = await fetch('https://raw.githubusercontent.com/neokwg/sample-webtoon-data/refs/heads/main/data.json');
            webtoon = await response.json();
        }

        document.querySelectorAll('.navbar-collapse.collapse > ul > li').forEach(e => e.remove());

        const ul = document.querySelector('.navbar-collapse.collapse > ul');

        Object.keys(webtoon).forEach(e => {

            const btn = document.createElement('span');
            btn.textContent = '❌';
            btn.style.position = 'absolute';
            btn.style.top = '10px';
            btn.style.right = '0px';
            btn.style.fontSize = '20px'
            btn.addEventListener('click', (event) => deleteWebtoon(event, e));

            const a = document.createElement('a');
            a.textContent = webtoon[e];
            a.href = e;

            const li = document.createElement('li');
            li.className = '_not';

            a.insertAdjacentElement('beforeend', btn);
            li.insertAdjacentElement('beforeend', a);
            ul.insertAdjacentElement('beforeend', li);
        });

        const a = document.createElement('a');
        a.textContent = '----------- 정보복사 -----------';
        a.addEventListener('click', copyWebtoon);

        const li = document.createElement('li');
        li.className = '_not _last';

        li.insertAdjacentElement('beforeend', a);
        ul.insertAdjacentElement('beforeend', li);

        page_render();
    }

    function page_render() {
        document.querySelector('.__btn')?.remove();

        if (isBookmark) {
            document.querySelector('.page-title').style.position = 'relative';

            const btn = document.createElement('a');
            btn.className = "__btn";
            btn.style.position = 'absolute';
            btn.style.top = '10px';
            btn.style.right = '10px';
            btn.style.fontSize = '20px'

            if (webtoon[pagename]) {
                btn.textContent = '❌';
                btn.addEventListener('click', deleteWebtoon);
            } else {
                btn.textContent = '➕';
                btn.addEventListener('click', addWebtoon);
            }
            document.querySelector('.page-desc').after(btn);
        } else if (isList) {
            document.querySelectorAll('.board-list .img-item a:last-child').forEach(e => {
                const pageid = "/" + e.href.split('/').slice(3, 5).join('/');

                if (webtoon[pageid]) {
                    e.closest('.img-item').insertAdjacentHTML('beforeend', '<span style="position: absolute; bottom: 3px; right: 3px;">⭐</span>')
                }
            })
        }
    }

    function addWebtoon() {
        webtoon[pagename] = document.querySelector('.page-desc').innerText.trim();
        localStorage.setItem('webtoon', JSON.stringify(webtoon));
        loadLocalStorage();
    }

    function deleteWebtoon(event, pageid) {
        event.preventDefault();

        delete webtoon[pageid || pagename];
        localStorage.setItem('webtoon', JSON.stringify(webtoon));
        loadLocalStorage();
    }

    function copyWebtoon() {
        navigator.clipboard.writeText(JSON.stringify(webtoon));
    }

    function adblock(domain) {
        switch (domain) {
            case "blacktoon.com":
                blacktoon();
                break;
            case "booktoki.com":
            case "manatoki.net":
                toki();
                break;
            case "newtoki.com":
                toki();
                bookmark();
                break;
        };
    }

    function blacktoon() {
        if (['/cookie.html', '/lander'].includes(document.location.pathname) == false) {
            document.querySelectorAll('div.banner, nav.mb-nav').forEach(e => e.remove());
        }
    }

    function toki() {
        document.querySelectorAll('#hd_pop, .sidebar-toggle, .navbar-custom-menu > ul > li:nth-child(n+2), nav .navbar-toggle, #main-banner-view, #id_mbv, .view-title, .basic-banner, .widget-side-line > div, .board-tail-banner').forEach(e => e.remove());
        document.querySelector('#id_mbv')?.parentNode.remove();
    }

    function bookmark() {
        document.querySelector('.navbar-custom-menu').insertAdjacentHTML('afterend', '<div class="at-navbar pull-left hidden-sm"><div class="navbar-collapse collapse" id="navbar-collapse" style=""><ul class="nav navbar-nav nav-13"></ul></div></div>');
        document.querySelector('.navbar-custom-menu').insertAdjacentHTML('beforebegin', '<button type="button" class="navbar-toggle btn-navbar-top" data-toggle="collapse" data-target="#navbar-collapse"><i class="fa fa-bars"></i></button>');
        document.querySelectorAll('.navbar-collapse.collapse > ul > li:not(._not)')?.forEach(e => e.remove());
    }

})();
