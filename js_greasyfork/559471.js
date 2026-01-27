// ==UserScript==
// @name         Wnacg下载按钮恢复
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  给浏览器无法单独放行广告拦截的，恢复下载按钮。
// @author       Aloazny
// @match        *://*.99xmh.*/*
// @match        *://*.wnacg.*/*
// @match        *://99mh.men/*
// @match        *://99xmh.*/*
// @match        *://99xmh.top/*
// @match        *://hentaicomic.ru/*
// @match        *://hm15.lol/*
// @match        *://hm16.lol/*
// @match        *://hm17.lol/*
// @match        *://hm18.lol/*
// @match        *://hm19.lol/*
// @match        *://htcomic.top/*
// @match        *://htmanga.top/*
// @match        *://htmanga2.top/*
// @match        *://htmanga3.top/*
// @match        *://htmanga4.top/*
// @match        *://htmanga5.top/*
// @match        *://ssmh01.top/*
// @match        *://ssmh02.top/*
// @match        *://wn01.cc/*
// @match        *://wn01.ru/*
// @match        *://wn01.uk/*
// @match        *://wn02.cc/*
// @match        *://wn02.ru/*
// @match        *://wn02.uk/*
// @match        *://wn03.cc/*
// @match        *://wn03.ru/*
// @match        *://wn03.uk/*
// @match        *://wn04.cc/*
// @match        *://wn04.ru/*
// @match        *://wn04.uk/*
// @match        *://wn05.uk/*
// @match        *://wnacg.*/*
// @match        *://wnacg.com/*
// @match        *://wnacg.men/*
// @match        *://wnacg.one/*
// @match        *://wnacg.ru/*
// @match        *://wnacg.top/*
// @match        *://wnacg.vip/*
// @match        *://wnacg01.cc/*
// @match        *://wnacg01.ru/*
// @match        *://wnacg02.cc/*
// @match        *://wnacg02.ru/*
// @match        *://wnacg03.cc/*
// @match        *://wnacg03.ru/*
// @match        *://wnacg04.cc/*
// @match        *://wnacg04.ru/*
// @match        *://www.99xmh.*/*
// @match        *://www.wnacg.*/*
// @match        *://www.wnacg.com/*
// @match        *://www.wnacg.men/*
// @match        *://www.wnacg.one/*
// @match        *://www.wnacg.ru/*
// @match        *://www.wnacg.top/*
// @match        *://www.wnacg.vip/*
// @run-at         document-start
// @license         MIT
// @icon           data:image/jpeg;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AN5hCZneYQn33mEJ8d5hCfHeYQnx3mEJ8d5hCfHeYQnx3mEJ995hCf3eYQn93mEJ895hCfHeYQnx3mEJ995hCZnfZQjv32UI/99lCP/fZQj/32UI/99lCP/fZQj/32UI/99lCN3fZQij32UIsd9lCPHfZQj/32UI/99lCP/fZQjv4WoI7+FqCP/hagj/4WoI/+FqCP/hagj/4WoI/+FqCIXhaggA4WoICOFqCADhaggW4WoIxeFqCP/hagj/4WoI7+NwB+/jcAf/43AH/+NwB//jcAf/43AH/+NwB7XjcAcA43AHi+NwB//jcAfx43AHRONwBxjjcAfx43AH/+NwB+/ldQbv5XUG/+V1Bv/ldQb/5XUG/+V1Bv/ldQZY5XUGNuV1Bv/ldQZY5XUGm+V1BuXldQYA5XUGseV1Bv/ldQbv5nsF7+Z7Bf/mewX/5nsF/+Z7Bf/mewX/5nsFVOZ7BTjmewX/5nsFTOZ7BZHmewXp5nsFAOZ7Ba/mewX/5nsF7+iCBO/oggT/6IIE/+iCBP/oggT/6IIE/+iCBK/oggQA6IIEleiCBP/oggT36IIETOiCBBToggTt6IIE/+iCBO/qhwP36ocDzeqHAxbqhwMM6ocDQOqHA/vqhwP/6ocDeuqHAwDqhwMQ6ocDBuqHAw7qhwO76ocD/+qHA//qhwPv7I0D8+yNA+/sjQOP7I0DheyNA6fsjQP/7I0D/+yNA//sjQPP7I0DkeyNA5/sjQPp7I0D/+yNA//sjQP/7I0D7+6SAqPukgL/7pIC/+6SAv/ukgL/7pIC+e6SAv3ukgL/7pIC/+6SAv/ukgL/7pIC/+6SAv/ukgL77pIC/+6SAqPvlgEA75YBYu+WAf/vlgH/75YB7++WAR7vlgFU75YB+e+WAf/vlgH/75YB/++WAf/vlgHT75YBKu+WARLvlgEE8JkBAPCZARDwmQFW8JkBXPCZAUTwmQEA8JkBAPCZAU7wmQHp8JkB8/CZAffwmQHF8JkBHPCZAQDwmQEA8JkBAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAP//AAAAAAAAAAAAAADwAAABGAAAA0gAAANIAAABGAAAOfAAAAAAAAAAAAAAxgcAAP8PAAD//wAA//8AAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559471/Wnacg%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/559471/Wnacg%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isDownloadPage() {
        return location.pathname.includes('download-index-aid-');
    }

    function blockAds() {
        const isDL = isDownloadPage();
        ['#btimgid1', '#btmad1', 'script[src$="/js/jads.js"] + ins[id]', 'iframe[width="300"][height="250"]', 'iframe[src*="/smartpop/"]', 'iframe[src*="/herebyad"]', 'iframe[src*="/HereByAD"]', 'iframe[style*="300"][style*="250"]', 'div[style*="z-index: 9999"][style*="justify-content: center;"]:not([class]):not([id])', 'a[href][target="_blank"] > img[src*="t4"][src*=".ru/data/t/"]'].forEach(s => {
            document.querySelectorAll(s).forEach(e => {
                if (isDL && e.closest('.as_bt_l')) return;
                e.remove();
            });
        });
        const killPatterns = [
            /view[_-]?booster\.js/i,
            /\/bn\.js($|\?|#)/i,
            /\/on\.js($|\?|#)/i,
            /angularpoppyrobbing/i,
            /vertigovitalitywieldable/i,
            /orbsrv\.com/i,
            /eda437/i,
            /jads\.js/i,
            /lv[\/_-]esnk/i
        ];
        const suspiciousDatasets = ['cfasync', 'clbaid', 'clocid', 'clpid'];
        document.querySelectorAll('script').forEach(script => {
            const src = (script.src || '').toLowerCase();
            if (killPatterns.some(p => p.test(src))) {
                script.remove();
                return;
            }
            const dataset = script.dataset || {};
            if (script.type === 'text/javascript' && (dataset.cfasync === 'false' || suspiciousDatasets.some(key => key in dataset))) {
                script.remove();
            }
        });
    }

    function blockAdFunctions() {
        function disableAdFunctions() {
            ['createFixedBottomBannerWithClose', 'addImageAd', 'loadNewPopupAd', 'loadScriptDynamically', 'nbnsfxdm', 'fanwt'].forEach(fn => {
                try {
                    Object.defineProperty(window, fn, {
                        get: () => () => {},
                        set: () => {},
                        configurable: false
                    })
                } catch {}
            });
        }
        disableAdFunctions();
        const originalOpen = window.open;
        window.open = function(url, target, ...features) {
            if (url && !url.includes('wnacg')) {
                return null;
            }
            return originalOpen.call(this, url, target, ...features);
        };
    }

    function blockExternalLinks() {
        const currentHostname = window.location.hostname;
        const fuzzyDomain = currentHostname.replace(/\d+/g, '').replace(/\.+$/, '');
        document.addEventListener('click', function(e) {
            let target = e.target;
            while (target && target.nodeName !== 'A' && target.nodeName !== 'AREA') {
                target = target.parentElement;
            }
            if (target && target.href) {
                try {
                    const url = new URL(target.href, window.location.href);
                    const isDownload = url.pathname.includes('transmit');
                    const isInternal = url.hostname.includes('wnacg') || url.hostname.includes(fuzzyDomain);
                    if (!isDownload && !isInternal && (target.target === '_blank' || e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }
                } catch (err) {}
            }
        }, true);
    }

    function createBtn(href, text) {
        const btn = document.createElement('div');
        btn.textContent = text;
        btn.style.cssText = 'cursor:pointer;padding:14px 20px;margin:8px auto;width:90%;max-width:500px;background:#1296db;color:white;border-radius:10px;font-size:17px;font-weight:bold;text-align:center;box-shadow:0 4px 10px rgba(0,0,0,0.15);transition:background 0.3s,transform 0.2s;';
        btn.onmouseover = () => {
            btn.style.background = '#1177b0';
            btn.style.transform = 'translateY(-2px)';
        };
        btn.onmouseout = () => {
            btn.style.background = '#1296db';
            btn.style.transform = 'translateY(0)';
        };
        btn.onclick = () => {
            if (href.includes('wfile.uk')) window.open(href, '_blank');
            else location.href = href;
        };
        return btn;
    }

    function handleNormalPage() {
        document.querySelectorAll('.hlol_ad, .download_btn, .btn-row-left, div[id*="ad"], div[class*="ad"]').forEach(container => {
            if (container.dataset.tmProcessed) return;
            const origLink = container.querySelector('a[href*="download-index-aid-"]');
            if (!origLink) return;
            const downloadHref = origLink.href;
            if (container.classList.contains('btn-row-left')) {
                const adBtn = container.querySelector('a.ad-site');
                if (adBtn) {
                    const newBtn = document.createElement('a');
                    newBtn.className = 'Btn-Fixed';
                    newBtn.textContent = '下载本子';
                    newBtn.style.cssText = 'cursor:pointer; background:#4CAF50 !important; color:white !important; margin-right:5px;';
                    newBtn.onclick = (e) => {
                        e.preventDefault();
                        location.href = downloadHref;
                    };
                    adBtn.replaceWith(newBtn);
                }
            } else {
                container.innerHTML = '';
                container.style.cssText = 'padding:10px 0;text-align:center;';
                const btn = document.createElement('div');
                btn.textContent = '下载本子';
                btn.style.cssText = 'display:inline-block;cursor:pointer;padding:11px 28px;background:#4CAF50;color:white;border-radius:6px;font-size:15px;font-weight:bold;';
                btn.onmouseover = () => btn.style.background = '#45a049';
                btn.onmouseout = () => btn.style.background = '#4CAF50';
                btn.onclick = () => location.href = downloadHref;
                container.appendChild(btn);
            }
            container.dataset.tmProcessed = '1';
            if (!container.classList.contains('btn-row-left')) {
                container.removeAttribute('class');
                container.removeAttribute('id');
            }
        });
    }

    function handleDownloadPage() {
        const downloadContainer = document.querySelector('.as_bt_l');
        if (downloadContainer) {
            downloadContainer.style.cssText = 'display: block !important; visibility: visible !important;';
            const links = downloadContainer.querySelectorAll('a[href*="transmit"]');
            links.forEach(link => {
                link.style.cssText = 'display: inline-block !important; visibility: visible !important;';
                link.onclick = (e) => e.stopPropagation();
            });
        }
    }

    function run() {
        if (isDownloadPage()) handleDownloadPage();
        else handleNormalPage();
        blockAds();
        blockAdFunctions();
        blockExternalLinks();
    }

    function setupObserver() {
        if (document.body) {
            new MutationObserver(run).observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    observer.disconnect();
                    setupObserver();
                }
            });
            observer.observe(document.documentElement, {
                childList: true
            });
        }
    }

    run();
    setTimeout(run, 1000);
    setTimeout(run, 3000);
    setupObserver();
    document.addEventListener('DOMContentLoaded', run);
})();