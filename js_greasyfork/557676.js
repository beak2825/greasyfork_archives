// ==UserScript==
// @name         VSOL BBCode Helper
// @namespace    http://tampermonkey.net/
// @version      1.351
// @description  BBCode панель для новостей президентов VSOL
// @author       meedel
// @license      MIT
// @run-at       document-end
// @icon         https://vfliga.com/favicon.ico

// @match        *://*.vfliga.com/fed_news.php*
// @match        *://*.virtualsoccer.ru/fed_news.php*
// @match        *://*.virtualsoccer.su/fed_news.php*
// @match        *://*.vfliga.su/fed_news.php*
// @match        *://*.vfleague.su/fed_news.php*
// @match        *://*.vsol.su/fed_news.php*
// @match        *://*.vfleague.ru/fed_news.php*
// @match        *://*.simsoccer.ru/fed_news.php*
// @match        *://*.fifa08.ru/fed_news.php*
// @match        *://*.vfliga.ru/fed_news.php*
// @match        *://*.virtualsoccer.info/fed_news.php*
// @match        *://*.virtualsoccer.biz/fed_news.php*
// @match        *://*.virtualsoccer.ws/fed_news.php*
// @match        *://*.vfliga.net/fed_news.php*
// @match        *://*.vfliga.org/fed_news.php*
// @match        *://*.vfliga.info/fed_news.php*
// @match        *://*.vfliga.biz/fed_news.php*
// @match        *://*.vfliga.cc/fed_news.php*
// @match        *://*.vfliga.name/fed_news.php*
// @match        *://*.vfleague.com/fed_news.php*
// @match        *://*.vfleague.net/fed_news.php*
// @match        *://*.vfleague.org/fed_news.php*
// @match        *://*.vfleague.info/fed_news.php*
// @match        *://*.vfleague.biz/fed_news.php*
// @match        *://*.vfleague.name/fed_news.php*
// @match        *://*.vsol.org/fed_news.php*
// @match        *://*.vsol.info/fed_news.php*
// @match        *://*.vsol.ws/fed_news.php*
// @match        *://*.vsol.biz/fed_news.php*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557676/VSOL%20BBCode%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557676/VSOL%20BBCode%20Helper.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Удаляем блок <ul class="lh16">
    document.querySelectorAll('ul.lh16').forEach(el => el.remove());

    const textarea = document.getElementById("memo");
    if(!textarea) return;
    textarea.style.resize = "vertical";
    textarea.style.overflow = "auto";
    textarea.rows = 6;

    function insertTag(open, close="") {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start,end);
        textarea.value = text.substring(0,start) + open + selected + close + text.substring(end);
        textarea.focus();
        if(selected.length === 0) {
            const pos = start + open.length;
            textarea.setSelectionRange(pos,pos);
        } else {
            textarea.setSelectionRange(start + open.length, end + open.length);
        }
    }

    function createButton(label, callback, tip="") {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.title = tip;
        btn.type = "button";
        btn.style.padding = "2px 5px";
        btn.style.margin = "1px";
        btn.style.border = "1px solid #888";
        btn.style.borderRadius = "3px";
        btn.style.background = "#d9e7f7";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "11px";
        btn.addEventListener("mouseover",()=>btn.style.background="#c0daf0");
        btn.addEventListener("mouseout",()=>btn.style.background="#d9e7f7");
        btn.addEventListener("click", e => { e.preventDefault(); callback(btn); });
        return btn;
    }

    const panel = document.createElement("div");
    panel.style.marginTop = "5px";
    panel.style.background = "#e7e7e7";
    panel.style.padding = "4px";
    panel.style.border = "1px solid #aaa";
    panel.style.borderRadius = "5px";
    panel.style.display = "flex";
    panel.style.flexWrap = "wrap";

    const bbTags = [
        ["B","[b]","[/b]"], ["I","[i]","[/i]"], ["U","[u]","[/u]"], ["S","[s]","[/s]"],
        ["small","[small]","[/small]"], ["tt","[tt]","[/tt]"], ["sub","[sub]","[/sub]"], ["sup","[sup]","[/sup]"],
        ["HR","[hr]",""], ["LIST","[list]\n","\n[/list]"], ["[*]","[*] ",""], ["QUOTE","[quote]","[/quote]"]
    ];
    bbTags.forEach(([l,o,c]) => panel.appendChild(createButton(l,()=>insertTag(o,c))));

    const dropContainer = document.createElement("div");
    dropContainer.style.position = "absolute";
    dropContainer.style.zIndex = "999";
    dropContainer.style.display = "flex";
    dropContainer.style.flexDirection = "column";
    dropContainer.style.background = "#f5f5f5";
    dropContainer.style.border = "1px solid #aaa";
    dropContainer.style.borderRadius = "5px";
    dropContainer.style.padding = "4px";
    dropContainer.style.transition = "height 0.25s";
    dropContainer.style.overflow = "hidden";
    dropContainer.style.height = "0px";
    document.body.appendChild(dropContainer);

    function togglePanel(inner, btn) {
        if(dropContainer.style.height==="0px" || dropContainer.style.height==="") {
            dropContainer.innerHTML="";
            dropContainer.appendChild(inner);
            const rect = btn.getBoundingClientRect();
            dropContainer.style.top = (window.scrollY + rect.bottom + 2) + "px";
            dropContainer.style.left = rect.left + "px";
            dropContainer.style.height = inner.scrollHeight + "px";
        } else {
            dropContainer.style.height="0px";
            setTimeout(()=>dropContainer.innerHTML="",250);
        }
    }

    document.addEventListener('click', function(event) {
        if (!panel.contains(event.target) && !dropContainer.contains(event.target)) {
            dropContainer.style.height = "0px";
            setTimeout(() => dropContainer.innerHTML = "", 250);
        }
    });

    // Цвета
    function generateColors(){
        const out=[]; const rows=5, cols=16;
        for(let r=0;r<rows;r++){
            for(let c=0;c<cols;c++){
                const rr=Math.round(255*(r/(rows-1)));
                const gg=Math.round(255*(c/(cols-1)));
                const bb=Math.round(255*((rows-1-r)/(rows-1)));
                out.push("#"+rr.toString(16).padStart(2,"0")+gg.toString(16).padStart(2,"0")+bb.toString(16).padStart(2,"0"));
            }
        }
        return out;
    }
    const colorGrid = document.createElement("div");
    colorGrid.style.display="grid"; colorGrid.style.gridTemplateColumns="repeat(16,12px)"; colorGrid.style.gridGap="1px";
    generateColors().forEach(c=>{
        const d=document.createElement("div");
        d.style.width="12px"; d.style.height="12px"; d.style.background=c;
        d.style.border="1px solid #333"; d.style.cursor="pointer"; d.title=c;
        d.addEventListener("click",()=>{ insertTag(`[color="${c}"]`,`[/color]`); });
        colorGrid.appendChild(d);
    });
    const colorBtn=createButton("Color ▼",()=>togglePanel(colorGrid,colorBtn));

    // URL
    const urlBox=document.createElement("div"); urlBox.style.display="flex"; urlBox.style.flexDirection="column";
    const urlInput=document.createElement("input"); urlInput.placeholder="https://..."; urlInput.style.marginBottom="2px"; urlInput.style.fontSize="11px";
    const urlText=document.createElement("input"); urlText.placeholder="Текст ссылки"; urlText.style.marginBottom="2px"; urlText.style.fontSize="11px";
    const urlInsert=document.createElement("button"); urlInsert.textContent="Вставить"; urlInsert.style.fontSize="11px";
    urlInsert.addEventListener("click",()=>{
        const u=urlInput.value.trim(), t=urlText.value.trim()||u;
        if(u) insertTag(`[a href="${u}" target="_blank"]${t}`,`[/a]`);
    });
    urlBox.append(urlInput,urlText,urlInsert);
    const urlBtn=createButton("URL ▼",()=>togglePanel(urlBox,urlBtn));

    // Table, TR, TD/TH
    const tableBox = document.createElement("div");
    tableBox.style.display="flex"; tableBox.style.flexDirection="column"; tableBox.style.fontSize="11px";
    const tBtn=createButton("TABLE",()=>insertTag("[table]","[/table]"));
    const trBtn=createButton("TR",()=>insertTag("[tr]","[/tr]"));
    const tdBtn=createButton("TD",()=>insertTag("[td]","[/td]"));
    const thBtn=createButton("TH",()=>insertTag("[th]","[/th]"));

    // Генератор таблиц
    const genBox=document.createElement("div");
    genBox.style.display="flex"; genBox.style.flexDirection="column"; genBox.style.width="450px"; genBox.style.fontSize="11px";

    const genTextarea = document.createElement("textarea");
    genTextarea.placeholder="Таблицу сюда";
    genTextarea.rows=6;
    genTextarea.style.marginBottom="4px";
    genTextarea.style.width="100%";

    const chkRemoveTabs = document.createElement("label");
    const inputRemoveTabs = document.createElement("input");
    inputRemoveTabs.type="checkbox"; inputRemoveTabs.checked=false;
    chkRemoveTabs.appendChild(inputRemoveTabs);
    chkRemoveTabs.appendChild(document.createTextNode(" Убрать пустые табы"));

    const chkFirstRowTh = document.createElement("label");
    const inputFirstRowTh = document.createElement("input");
    inputFirstRowTh.type="checkbox"; inputFirstRowTh.checked=true;
    chkFirstRowTh.appendChild(inputFirstRowTh);
    chkFirstRowTh.appendChild(document.createTextNode(" Первая строка заголовком (TH)"));

    const chkFirstColTh = document.createElement("label");
    const inputFirstColTh = document.createElement("input");
    inputFirstColTh.type="checkbox"; inputFirstColTh.checked=false;
    chkFirstColTh.appendChild(inputFirstColTh);
    chkFirstColTh.appendChild(document.createTextNode(" Первый столбик заголовком (TH)"));

    const genInsert = document.createElement("button");
    genInsert.textContent="Сгенерировать";
    genInsert.style.fontSize="11px";
    genInsert.addEventListener("click",()=>{
        let lines = genTextarea.value.split("\n");
        if(inputRemoveTabs.checked) lines = lines.map(l => l.replace(/\t+/g,"\t"));
        let out=`[table width="90%" border="1"]\n`;
        lines.forEach((line,rowIdx)=>{
            out+="[tr]";
            const cells = line.split("\t");
            cells.forEach((c,colIdx)=>{
                let tag = "[td]";
                if(rowIdx===0 && inputFirstRowTh.checked) tag = "[th]";
                if(colIdx===0 && inputFirstColTh.checked) tag = "[th]";
                out+=`${tag}${c}${tag.replace("[","[/")}`;
            });
            out+="[/tr]\n";
        });
        out+="[/table]";
        insertTag(out);
    });

    genBox.append(genTextarea, chkRemoveTabs, chkFirstRowTh, chkFirstColTh, genInsert);
    const genBtn=createButton("Генератор ▼",()=>togglePanel(genBox,genBtn));

    const tableGroup = document.createElement("div");
    tableGroup.style.display = "flex"; tableGroup.style.flexWrap = "wrap"; tableGroup.style.marginRight = "5px";
    tableGroup.append(tBtn,trBtn,tdBtn,thBtn,genBtn);

    panel.append(tableGroup,colorBtn,urlBtn);
    textarea.insertAdjacentElement("afterend",panel);

})();