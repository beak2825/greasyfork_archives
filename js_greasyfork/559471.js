// ==UserScript==
// @name         Wnacg下载按钮恢复
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  给浏览器无法单独放行广告拦截的，恢复下载按钮。
// @author       Aloazny
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
        if (isDownloadPage()) return;
        ['#btimgid1', '#btmad1', 'script[src$="/js/jads.js"] + ins[id]', 'iframe[width="300"][height="250"]', 'iframe[src*="/herebyad"]', 'iframe[src*="/HereByAD"]', 'div[style*="z-index: 9999"][style*="justify-content: center;"]:not([class]):not([id])', 'a[href][target="_blank"] > img[src*="t4"][src*=".ru/data/t/"]'].forEach(s => document.querySelectorAll(s).forEach(e => e.remove()));
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
        document.querySelectorAll('.hlol_ad, .download_btn, div[id*="ad"], div[class*="ad"]').forEach(container => {
            if (container.dataset.tmProcessed) return;
            const origLink = container.querySelector('a[href*="download-index-aid-"]');
            if (!origLink) return;
            container.innerHTML = '';
            container.style.cssText = 'padding:10px 0;text-align:center;';
            const btn = document.createElement('div');
            btn.textContent = '下载本子';
            btn.style.cssText = 'display:inline-block;cursor:pointer;padding:11px 28px;background:#4CAF50;color:white;border-radius:6px;font-size:15px;font-weight:bold;';
            btn.onmouseover = () => btn.style.background = '#45a049';
            btn.onmouseout = () => btn.style.background = '#4CAF50';
            btn.onclick = () => location.href = origLink.href;
            container.appendChild(btn);
            container.dataset.tmProcessed = '1';
            container.removeAttribute('class');
            container.removeAttribute('id');
        });
    }

    function handleDownloadPage() {
        const e = document.querySelector(".adbox");
        if (!e) return;
        const t = document.querySelector(".download_filename"),
            n = t ? t.textContent.trim() : "未知文件";
        const r = [];
        document.querySelectorAll("a.down_btn").forEach(e => {
            const t = e.querySelector("span"),
                a = t ? t.textContent.trim().replace(/\s+/g, " ") : "下载";
            r.push({
                url: e.href,
                text: a.replace(/^\s+|\s+$/g, "").replace(/&nbsp;/g, ""),
                isExternal: e.href.includes("wfile.uk")
            })
        });
        if (0 === r.length) return;
        const o = document.createElement("div");
        o.className = "tm-download-page";
        o.innerHTML = `<div class="c"><div class="card"><div class="h"><div class="t">下载</div><div class="f" title="${n}">${n}</div></div><div class="b">${r.map(e=>`<a href="${e.url}" class="btn${e.isExternal?" be":" bp"}"${e.isExternal?' target="_blank" rel="noopener noreferrer"':""}>${e.text||"开始下载"}</a>`).join("")}</div><div class="fo"><small>建议使用单线程下载工具</small></div></div></div>`;
        const a = document.createElement("style");
        a.textContent = `:root{--md-sys-color-background:244 246 252;--md-sys-color-surface:255 255 255;--md-sys-color-on-surface:28 27 31;--md-sys-color-outline:121 118 130;--md-sys-color-primary:33 150 243;--md-sys-color-on-primary:255 255 255;--md-elevation-level2:0 3px 10px rgba(0,0,0,0.16),0 2px 6px rgba(0,0,0,0.12);--md-elevation-level3:0 6px 20px rgba(0,0,0,0.22)}@media (prefers-color-scheme:dark){:root{--md-sys-color-background:18 18 24;--md-sys-color-surface:28 27 35;--md-sys-color-on-surface:235 230 235;--md-sys-color-outline:140 135 145;--md-sys-color-primary:138 180 248;--md-sys-color-on-primary:255 255 255;--md-elevation-level2:0 6px 18px rgba(0,0,0,0.45);--md-elevation-level3:0 10px 28px rgba(0,0,0,0.52)}}*,*::before,*::after{box-sizing:border-box}html,body{height:100%;margin:0;padding:0;background:rgb(var(--md-sys-color-background));color:rgb(var(--md-sys-color-on-surface));font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}.tm-download-page{min-height:100dvh;padding:16px;display:grid;place-items:center}.c{width:100%;max-width:520px}.card{background:rgba(var(--md-sys-color-surface),0.75);backdrop-filter:blur(32px) saturate(200%);-webkit-backdrop-filter:blur(32px) saturate(200%);border-radius:32px;padding:36px 20px 48px;box-shadow:var(--md-elevation-level2);border:1px solid rgba(var(--md-sys-color-outline),0.18)}.h{text-align:center;margin-bottom:36px}.t{font-size:2.25rem;font-weight:500;letter-spacing:-0.025em}.f{margin-top:14px;font-size:1.125rem;line-height:1.45;color:rgba(var(--md-sys-color-on-surface),0.78);word-break:break-word;max-height:5em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical}.b{display:flex;flex-direction:column;gap:18px;margin:28px 0 36px}.btn{display:flex;align-items:center;justify-content:center;padding:18px 32px;border-radius:28px;font-size:1.25rem;font-weight:600;text-decoration:none;transition:all 0.28s cubic-bezier(0.4,0,0.2,1);box-shadow:var(--md-elevation-level2);user-select:none}.bp{background:rgb(var(--md-sys-color-primary));color:rgb(var(--md-sys-color-on-primary))}.bp:hover{box-shadow:var(--md-elevation-level3);transform:translateY(-1px)}.bp:active{transform:scale(0.97)}.be{background:rgb(130,80,245);color:#ffffff !important;box-shadow:0 4px 14px rgba(130,80,245,0.42)}.be:hover{background:rgb(110,60,230);box-shadow:0 8px 24px rgba(130,80,245,0.55);transform:translateY(-1px)}.be:active{transform:scale(0.97)}.fo{text-align:center;font-size:0.875rem;color:rgba(var(--md-sys-color-on-surface),0.60)}@media (max-width:600px){.tm-download-page{align-items:flex-end;padding:0}.c{width:100%;max-width:none;padding:0 10px 8px}.card{border-radius:32px 32px 0 0;padding:40px 16px 64px;box-shadow:0 -8px 32px rgba(0,0,0,0.38)}.btn{padding:20px 36px;font-size:1.3125rem;border-radius:32px}}`;
        document.body.innerHTML = "";
        document.body.appendChild(a);
        document.body.appendChild(o)
    }

    function run() {
        blockAds();
        if (isDownloadPage()) handleDownloadPage();
        else handleNormalPage();
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