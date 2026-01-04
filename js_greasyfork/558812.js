// ==UserScript==
// @name         dmhy动漫花园批量复制助手
// @namespace    https://github.com/yourname
// @description  动漫花园：在日期前插入复选框，全选/反选/批量复制（已美化）
// @author       you
// @version      5.0.0
// @match        *://*.dmhy.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558812/dmhy%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558812/dmhy%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const INTERVAL = 800;
    let barAdded = false;

    const $  = (s, p = document) => p.querySelectorAll(s);
    const copy = async txt => {
        try { await navigator.clipboard.writeText(txt); return true; }
        catch { return false; }
    };

    function injectBox() {
        $('a[href^="magnet:?xt="]').forEach(a => {
            const tr = a.closest('tr');
            if (!tr || tr.dataset.injected) return;
            const firstTd = tr.querySelector('td');
            if (!firstTd) return;
            const ck = document.createElement('input');
            ck.type = 'checkbox';
            ck.dataset.magnet = a.href;
            ck.style.marginRight = '6px';
            firstTd.insertBefore(ck, firstTd.firstChild);
            tr.dataset.injected = '1';
        });
    }

    function addBar() {
        if (barAdded) return;
        const bar = document.createElement('div');
        bar.id = 'dmhy-bar';
        bar.innerHTML = `
            <style>
            #dmhy-bar{
                position:fixed; top:0; left:0; right:0;
                background:#fffffffa; backdrop-filter:blur(8px);
                border-bottom:1px solid #e5e7eb;
                padding:10px 20px; font-size:14px; z-index:9999;
                box-shadow:0 2px 6px rgba(0,0,0,.06);
                display:flex; align-items:center; gap:10px;
            }
            .dmhy-btn{
                border:none; border-radius:6px; padding:6px 14px;
                font-size:13px; cursor:pointer; transition:all .2s ease;
                box-shadow:0 1px 2px rgba(0,0,0,.05);
            }
            .dmhy-btn.all  {background:#409eff; color:#fff;}
            .dmhy-btn.inv  {background:#909399; color:#fff;}
            .dmhy-btn.copy {background:#67c23a; color:#fff;}
            .dmhy-btn:hover{filter:brightness(1.1);}
            .dmhy-btn.copy.ok{animation:ok .4s;}
            @keyframes ok{50%{background:#85ce61;}}
            </style>

            <button class="dmhy-btn all">全选</button>
            <button class="dmhy-btn inv">反选</button>
            <button class="dmhy-btn copy">批量复制</button>
            <span id="dmhy-info" style="margin-left:auto;color:#666;"></span>
        `;
        document.body.appendChild(bar);
        document.body.style.paddingTop = bar.offsetHeight + 'px';

        const $b = s => bar.querySelector(s);
        $b('.all').onclick  = () => $('input[data-magnet]').forEach(i => i.checked = true);
        $b('.inv').onclick  = () => $('input[data-magnet]').forEach(i => i.checked = !i.checked);
        $b('.copy').onclick = async () => {
            const list = Array.from(document.querySelectorAll('input[data-magnet]:checked'))
                              .map(i => i.dataset.magnet);
            if (!list.length) return alert('请先勾选资源！');
            const ok = await copy(list.join('\n'));
            const btn = $b('.copy'), info = $b('#dmhy-info');
            if (ok) {
                btn.classList.add('ok');
                info.textContent = `已复制 ${list.length} 条`;
                setTimeout(() => btn.classList.remove('ok'), 500);
            } else {
                info.textContent = '复制失败，请检查权限';
            }
        };
        barAdded = true;
    }

    const loop = () => { injectBox(); addBar(); };
    setInterval(loop, INTERVAL);
    loop();
})();
