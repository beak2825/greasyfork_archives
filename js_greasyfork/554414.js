// ==UserScript==
// @name         mikanani 批量复制磁力
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  按字幕组批量复制磁力链接，支持平级容器、折叠列表、筛选与设置记忆
// @icon         https://mikanani.me/images/favicon.ico
// @match        https://mikanani.me/Home/Bangumi/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554414/mikanani%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/554414/mikanani%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = `
    .mcml-btn { border: 1px solid #f39c12; border-radius: 4px; background: #fff; color: #f39c12; cursor: pointer; font-size: 12px; padding: 2px 6px; margin-left: 6px; }
    .mcml-btn:hover { background:#f39c12;color:#fff; }
    .mcml-popup { position: fixed; top: 80px; right: 20px; width: 400px; max-height: 60%; background: #fff; border: 1px solid #ccc; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); padding: 12px; font-size: 13px; overflow: auto; z-index: 99999; display:none; }
    .mcml-popup textarea { width: 100%; height: 160px; margin-top: 8px; font-family: monospace; font-size: 12px; resize: vertical; }
    .mcml-popup label { font-size: 12px; margin-right:4px;}
    .mcml-popup input { width: 120px; font-size:12px; margin-right:8px; }
    .mcml-popup button { font-size:12px; margin-left:4px; }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    const SETTINGS_KEY = 'mikanani_mcml_settings';
    let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    if (!settings.include) settings.include = '';
    if (!settings.exclude) settings.exclude = '';
    function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

    const globalBtn = document.createElement('button');
    globalBtn.textContent = '磁力筛选设置';
    globalBtn.style.position = 'fixed';
    globalBtn.style.top = '60px';
    globalBtn.style.right = '20px';
    globalBtn.style.zIndex = 99999;
    globalBtn.style.fontSize = '12px';
    document.body.appendChild(globalBtn);

    const settingsPopup = document.createElement('div');
    settingsPopup.className = 'mcml-popup';
    settingsPopup.innerHTML = `
        <div>
            <label>包含关键字:</label><input id="mcml-include" value="${settings.include}">
            <label>排除关键字:</label><input id="mcml-exclude" value="${settings.exclude}">
            <button id="mcml-save">保存</button>
            <button id="mcml-close">关闭</button>
        </div>
    `;
    document.body.appendChild(settingsPopup);

    globalBtn.addEventListener('click', () => { settingsPopup.style.display = 'block'; });
    settingsPopup.querySelector('#mcml-close').addEventListener('click', () => { settingsPopup.style.display = 'none'; });
    settingsPopup.querySelector('#mcml-save').addEventListener('click', () => {
        settings.include = settingsPopup.querySelector('#mcml-include').value.trim();
        settings.exclude = settingsPopup.querySelector('#mcml-exclude').value.trim();
        saveSettings();
        alert('设置已保存');
    });

    function showTempMessage(msg, dur=1500){
        const tmp = document.createElement('div');
        tmp.style.position='fixed'; tmp.style.right='20px'; tmp.style.top='100px';
        tmp.style.background='rgba(0,0,0,0.7)'; tmp.style.color='#fff';
        tmp.style.padding='6px 12px'; tmp.style.borderRadius='6px'; tmp.style.fontSize='12px';
        tmp.style.zIndex=99999; tmp.innerText=msg;
        document.body.appendChild(tmp);
        setTimeout(()=>tmp.remove(), dur);
    }

    async function copyToClipboard(text){
        if(!text){showTempMessage('无链接可复制'); return;}
        try{
            if(navigator.clipboard && navigator.clipboard.writeText){await navigator.clipboard.writeText(text);}
            else{const ta=document.createElement('textarea'); ta.style.position='fixed'; ta.style.left='-9999px';
            ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);}
            showTempMessage('已复制到剪贴板');
        }catch(e){showTempMessage('复制失败');}
    }

    function addBatchButtons(){
        const titles = document.querySelectorAll('div.subgroup-text');
        const tables = document.querySelectorAll('table.table.table-striped.tbl-border.fadeIn');
        if(titles.length !== tables.length) console.warn('字幕组标题与文件列表数量不匹配！');

        titles.forEach((titleEl, idx)=>{
            if(titleEl.querySelector('.mcml-btn')) return;
            const btn = document.createElement('button');
            btn.textContent = '批量复制磁力';
            btn.className = 'mcml-btn';
            titleEl.appendChild(btn);

            const table = tables[idx];
            if(!table) return;

            btn.addEventListener('click', ()=>{
                let magnetLinks = [];
                const rows = table.querySelectorAll('tr');
                rows.forEach(row=>{
                    const el = row.querySelector('a[data-clipboard-text]');
                    if(!el) return;
                    const link = el.dataset.clipboardText;
                    if(link) magnetLinks.push({link,row});
                });

                const includeRe = settings.include?new RegExp(settings.include,'i'):null;
                const excludeRe = settings.exclude?new RegExp(settings.exclude,'i'):null;
                magnetLinks = magnetLinks.filter(({link,row})=>{
                    const titleEl = row.querySelector('.title') || row.querySelector('.bangumi-title');
                    const title = titleEl ? titleEl.innerText : '';
                    if(includeRe && !includeRe.test(title)) return false;
                    if(excludeRe && excludeRe.test(title)) return false;
                    return true;
                }).map(obj=>obj.link);

                magnetLinks=[...new Set(magnetLinks)];

                if(magnetLinks.length===0){showTempMessage('无符合筛选条件的磁力链接'); return;}
                copyToClipboard(magnetLinks.join('\n'));
            });
        });
    }

    addBatchButtons();

    const observer = new MutationObserver(()=>{ addBatchButtons(); });
    observer.observe(document.body, {childList:true,subtree:true});

})();
