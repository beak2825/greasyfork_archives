// ==UserScript==
// @name         Homiak-virus
// @namespace    homiakvirus
// @version      1.0
// @description  Заменяет все аватарки на хомиака
// @author       loosle
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon         https://nztcdn.com/files/d189311d-039c-4992-bd48-33defd421581.webp
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555728/Homiak-virus.user.js
// @updateURL https://update.greasyfork.org/scripts/555728/Homiak-virus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const avatarUrl = 'https://nztcdn.com/files/d189311d-039c-4992-bd48-33defd421581.webp';

    function debounce(func, delay) {
        let timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    }

    function isInsideMessage(el) {
        return el.closest('article, .messageContent, blockquote, .bbCodeBlock, .messageText');
    }

    function looksLikeAvatar(url) {
        if (!url || url === 'none') return false;
        if (url.includes('/background/')) return false;
        return url.includes('/avatar/');
    }

    function replaceAll() {
        let imgs = document.querySelectorAll('img.avatar, .avatar img, .avatarHolder img, img.menuAvatar, img.LbImage, img[src*="/avatar/"]');
        imgs.forEach(function(img) {
            if (isInsideMessage(img)) return;
            if (img.src !== avatarUrl && !img.classList.contains('emoji') && looksLikeAvatar(img.src)) {
                img.src = avatarUrl;
                img.srcset = '';
            }
        });

        let containers = document.querySelectorAll('.avatar, .avatarHolder, [class*="avatar"], span.img');
        containers.forEach(function(el) {
            if (el.classList.contains('profileBackground') || el.classList.contains('memberCustomBackground')) return;
            if (isInsideMessage(el)) return;

            let bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg !== 'none' && !bg.includes(avatarUrl) && looksLikeAvatar(bg)) {
                el.style.backgroundImage = `url('${avatarUrl}')`;
                el.style.backgroundSize = 'cover';
            }
        });

        let styled = document.querySelectorAll('[style*="background-image"]');
        styled.forEach(function(el) {
            if (el.classList.contains('profileBackground') || el.classList.contains('memberCustomBackground')) return;
            if (isInsideMessage(el)) return;

            let styleAttr = el.getAttribute('style');
            if (styleAttr && looksLikeAvatar(styleAttr) && !styleAttr.includes(avatarUrl)) {
                el.style.backgroundImage = `url('${avatarUrl}')`;
                el.style.backgroundSize = 'cover';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceAll);
    } else {
        replaceAll();
    }

    window.addEventListener('load', function() {
        setTimeout(replaceAll, 500);
    });

    let debouncedReplace = debounce(replaceAll, 200);

    let obs = new MutationObserver(function(mutations) {
        let needUpdate = false;

        for (let mut of mutations) {
            if (mut.addedNodes.length > 0) {
                needUpdate = true;
                break;
            }
            if (mut.type === 'attributes' && (mut.attributeName === 'style' || mut.attributeName === 'src')) {
                needUpdate = true;
                break;
            }
        }

        if (needUpdate) {
            debouncedReplace();
        }
    });

    function startWatching() {
        if (document.body) {
            obs.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'src']
            });
        } else {
            setTimeout(startWatching, 100);
        }
    }

    startWatching();

    let oldHref = location.href;
    let hrefObserver = new MutationObserver(function() {
        if (oldHref !== location.href) {
            oldHref = location.href;
            setTimeout(replaceAll, 500);
        }
    });

    hrefObserver.observe(document, {subtree: true, childList: true});

    setInterval(replaceAll, 3000);

})();