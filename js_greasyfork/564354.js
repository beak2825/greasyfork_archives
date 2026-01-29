// ==UserScript==
// @name         Github Simple enhance
// @name:zh-CN   GIthub 本地化增强
// @version      1.2.2
// @description  Github enhance,Change date formats to your local,2. Customize GitHub SSH clone alias
// @description:zh-CN  Github 增强，改写时间格式，增加仓库复制按钮。Git Clone 前缀可在设置中修改。
// @author       cosing
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @license MIT
// @namespace https://greasyfork.org/users/1316484
// @downloadURL https://update.greasyfork.org/scripts/564354/Github%20Simple%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/564354/Github%20Simple%20enhance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'github_git_prefix';
    let cloneCommandTemplate = GM_getValue(STORAGE_KEY, "git clone ssh://github/{user}/{repo}.git")

    const COPY_BUTTON = copyButtonLi_init();
    GM_registerMenuCommand("⚙️ set ", function () {
        let newPrefix = prompt(
            'input your  (git clone ssh://github/{user}/{repo})',
            cloneCommandTemplate
        );

        if (newPrefix !== null) {
            GM_setValue(STORAGE_KEY, newPrefix);
            cloneCommandTemplate = newPrefix;
        }
    });

    window.addEventListener("turbo:load", function (event) {
        console.log("event begin")
        locale_time();
        insertCopyButtonToNavbar();
    });

    function locale_time() {
        if (document.documentElement.lang != navigator.language) {
            document.documentElement.lang = `${navigator.language}`;
            for (const time of document.getElementsByTagName('relative-time')) {
                time.update();
            }
        }
    }

    function insertCopyButtonToNavbar() {
        const navbar = document.querySelector('nav[aria-label="Repository"]') || document.querySelector('nav[aria-label="Gist"]');
        // 如果找不到导航栏，或者按钮已经存在，则直接返回
        if (!navbar || navbar.querySelector('#git-url-copy-button-li')) {
            return;
        }
        
        (navbar.querySelector('nav > ul') || navbar.querySelector('.UnderlineNav-body')).appendChild(COPY_BUTTON);
    }

    function copyButtonLi_init() {
        // 创建按钮并设置样式
        const button = document.createElement('button');
        button.textContent = 'copy Git URL';
        button.className = 'UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item copy-button';

        // 创建 SVG 图标
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("aria-hidden", "true");
        svgIcon.setAttribute("height", "16");
        svgIcon.setAttribute("width", "16");
        svgIcon.setAttribute("viewBox", "0 0 503.607 503.607");
        svgIcon.setAttribute("version", "1.1");
        svgIcon.setAttribute("data-view-component", "true");
        svgIcon.setAttribute("class", "octicon octicon-gear UnderlineNav-octicon d-none d-sm-inline");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M386.098,58.754h-41.967v-8.393c0-9.233-7.554-16.787-16.787-16.787h-25.18V25.18c0-13.43-10.911-25.18-25.18-25.18 h-50.361c-14.269,0-25.18,10.911-25.18,25.18v8.393h-25.18c-9.233,0-16.787,7.554-16.787,16.787v8.393h-41.967 c-23.502,0-41.967,18.466-41.967,41.967v360.918c0,23.502,18.466,41.967,41.967,41.967h268.59 c23.502,0,41.967-18.466,41.967-41.967V100.721C428.066,78.059,409.6,58.754,386.098,58.754z M176.262,67.148V50.361h33.574 c5.036,0,8.393-3.357,8.393-8.393V25.18c0-5.036,3.357-8.393,8.393-8.393h50.361c5.036,0,8.393,3.357,8.393,8.393v16.787 c0,5.036,3.357,8.393,8.393,8.393h33.574v58.754H176.262V67.148z M344.131,428.066H159.475c-5.036,0-8.393-3.357-8.393-8.393 s3.357-8.393,8.393-8.393h184.656c5.036,0,8.393,3.357,8.393,8.393S349.167,428.066,344.131,428.066z M344.131,352.525H159.475 c-5.036,0-8.393-3.357-8.393-8.393c0-5.036,3.357-8.393,8.393-8.393h184.656c5.036,0,8.393,3.357,8.393,8.393 C352.525,349.167,349.167,352.525,344.131,352.525z M344.131,276.984H159.475c-5.036,0-8.393-3.357-8.393-8.393 s3.357-8.393,8.393-8.393h184.656c5.036,0,8.393,3.357,8.393,8.393S349.167,276.984,344.131,276.984z M344.131,201.443H159.475 c-5.036,0-8.393-3.357-8.393-8.393s3.357-8.393,8.393-8.393h184.656c5.036,0,8.393,3.357,8.393,8.393 S349.167,201.443,344.131,201.443z");

        svgIcon.appendChild(path);
        button.prepend(svgIcon);
        button.addEventListener('click', function () {
            const url = window.location.href;
            const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
            const matches = url.match(regex);

            if (matches) {
                const data = {
                    user: matches[1],
                    repo: matches[2]
                };

                const result = cloneCommandTemplate.replace(/{(\w+)}/g, (match, key) => {
                    if (data.hasOwnProperty(key)) {
                        // 如果存在，返回对应的值
                        return data[key];
                    }
                    return match;
                });

                GM_setClipboard(result);

                this.classList.add('flash-animation');
                setTimeout(() => {
                    this.classList.remove('flash-animation');
                }, 500);
            }
        });

        const copyButtonLi = document.createElement('li');
        copyButtonLi.id = 'git-url-copy-button-li';
        copyButtonLi.className = 'd-inline-flex';
        copyButtonLi.appendChild(button);

        const style = document.createElement('style');
        style.textContent = `
            .flash-animation {
                animation: copy-flash 0.5s;
            }
            @keyframes copy-flash {
                0% { opacity: 1; }
                33% { opacity: 0.3; }
                50% { opacity: 0.8; }
                66% { opacity: 0.3; }
                100% { opacity: 1; }
            }`;
        document.head.appendChild(style);
        return copyButtonLi;
    }
})();
