// ==UserScript==
// @name         Kushindo Luscious Faction Calendar Elite
// @namespace    kushindo.faction.calendar.elite
// @version      3.3
// @description  Elite faction calendar with purple & gold theme, hover effects, collapse toggle, and TCT synchronization
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560717/Kushindo%20Luscious%20Faction%20Calendar%20Elite.user.js
// @updateURL https://update.greasyfork.org/scripts/560717/Kushindo%20Luscious%20Faction%20Calendar%20Elite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= CONFIG =================
    const STORAGE_KEY='kushindoFactionEvents';
    const LOCK_KEY='kushindoFactionLock';
    const READONLY_KEY='kushindoFactionReadonly';
    const COLLAPSE_KEY='kushindoFactionCollapsed';
    const TCT_KEY='kushindoTCTOffset';
    const IMPORT_KEY='kushindoImportedEvents';

    const EVENT_TYPES={
        war:{label:'War',color:'#8e44ad'},
        chain:{label:'Chain',color:'#d4af37'},
        training:{label:'Training',color:'#5dade2'},
        other:{label:'Other',color:'#a569bd'}
    };

    // ================= STORAGE =================
    const loadEvents=()=>JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    const saveEvents=e=>localStorage.setItem(STORAGE_KEY,JSON.stringify(e));
    const isLocked=()=>localStorage.getItem(LOCK_KEY)==='true';
    const toggleLock=()=>localStorage.setItem(LOCK_KEY,!isLocked());
    const isReadonly=()=>localStorage.getItem(READONLY_KEY)==='true';
    const toggleReadonly=()=>localStorage.setItem(READONLY_KEY,!isReadonly());
    const isCollapsed=()=>localStorage.getItem(COLLAPSE_KEY)==='true';
    const toggleCollapse=()=>localStorage.setItem(COLLAPSE_KEY,!isCollapsed());
    const getImported=()=>JSON.parse(localStorage.getItem(IMPORT_KEY)||'[]');
    const markImported=id=>{ const imp=getImported(); if(!imp.includes(id)){imp.push(id); localStorage.setItem(IMPORT_KEY,JSON.stringify(imp));} }

    // ================= TCT =================
    function detectTCTOffset(){
        const serverClock=document.querySelector('[data-time], .server-time');
        if(!serverClock)return;
        const tctText=serverClock.innerText.match(/(\d{2}):(\d{2}):(\d{2})/);
        if(!tctText)return;
        const [h,m,s]=tctText.slice(1,4).map(Number);
        const now=new Date();
        const tct=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),h,m,s));
        localStorage.setItem(TCT_KEY,tct.getTime()-now.getTime());
    }
    function nowTCT(){return new Date(Date.now()+parseInt(localStorage.getItem(TCT_KEY)||0));}
    function toTCT(date){return new Date(date.getTime()+parseInt(localStorage.getItem(TCT_KEY)||0));}
    function fromTCT(date){return new Date(date.getTime()-parseInt(localStorage.getItem(TCT_KEY)||0));}

    // ================= HELPERS =================
    function countdown(tctDate){
        const diff=new Date(tctDate)-nowTCT();
        if(diff<=0)return'Started';
        const h=Math.floor(diff/36e5);
        const m=Math.floor((diff%36e5)/6e4);
        return `${h}h ${m}m (TCT)`;
    }

    function detectWarTCT(){
        const text=document.body.innerText;
        const match=text.match(/War ends in ([0-9]+)h ([0-9]+)m/i);
        if(!match)return null;
        const end=new Date(nowTCT().getTime()+(parseInt(match[1])*60+parseInt(match[2]))*60000);
        return end;
    }

    // ================= CREATE UI =================
    const ui=document.createElement('div');
    ui.id='kushindoCalendar';
    ui.style.cssText="background:#120817;border-bottom:2px solid #d4af37;padding:12px;position:relative;z-index:999;color:#e6dff0;font-family:Arial,Helvetica,sans-serif;";
    ui.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:18px;font-weight:bold;color:#d4af37;">Kushindo Luscious — Faction Calendar</div>
            <button id="collapseBtn" style="background:#1a0c24;color:#d4af37;border:1px solid #d4af37;cursor:pointer;">Collapse</button>
        </div>
        <div id="warBanner" style="display:none;margin-top:6px;padding:4px;border:1px solid #d4af37;color:#d4af37;text-align:center;font-weight:bold;"></div>
        <div id="contentArea">
            <div id="calendar" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:12px;text-align:center;margin-top:8px;"></div>
            <div style="margin-top:10px;border-top:1px solid #2a1238;padding-top:6px;">
                <b style="color:#d4af37;">Upcoming Events</b>
                <div id="eventList"></div>
            </div>
            <div id="editor" style="margin-top:10px;border-top:1px solid #2a1238;padding-top:6px;">
                <input id="eTitle" placeholder="Title">
                <input id="eDate" type="date">
                <input id="eTime" type="time">
                <select id="eType">
                    <option value="war">War</option>
                    <option value="chain">Chain</option>
                    <option value="training">Training</option>
                    <option value="other">Other</option>
                </select>
                <button id="addBtn">Add</button>
                <button id="lockBtn">Lock</button>
                <button id="roBtn">Read-Only</button>
                <textarea id="importBox" placeholder="Paste TCT or Torn event text here" style="width:100%;height:50px;margin-top:6px;"></textarea>
                <button id="importBtn">Import Events</button>
            </div>
        </div>
    `;
    const header=document.querySelector('#topHeader')||document.body;
    header.after(ui);

    const calendar=document.getElementById('calendar');
    const eventList=document.getElementById('eventList');
    const contentArea=document.getElementById('contentArea');
    const editor=document.getElementById('editor');
    const collapseBtn=document.getElementById('collapseBtn');
    const addBtn=document.getElementById('addBtn');
    const lockBtn=document.getElementById('lockBtn');
    const roBtn=document.getElementById('roBtn');
    const eTitle=document.getElementById('eTitle');
    const eDate=document.getElementById('eDate');
    const eTime=document.getElementById('eTime');
    const eType=document.getElementById('eType');
    const warBanner=document.getElementById('warBanner');
    const importBox=document.getElementById('importBox');
    const importBtn=document.getElementById('importBtn');

    // ================= RENDER =================
    function renderCalendar(el){
        el.innerHTML='';
        const now=new Date();
        const y=now.getFullYear();
        const m=now.getMonth();
        const first=new Date(y,m,1).getDay();
        const days=new Date(y,m+1,0).getDate();
        const events=loadEvents();
        for(let i=0;i<first;i++) el.appendChild(document.createElement('div'));
        for(let d=1;d<=days;d++){
            const cell=document.createElement('div');
            cell.style.cursor='pointer';
            cell.innerHTML=`<b style="color:#d4af37;">${d}</b>`;
            const dateStr=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            events.filter(e=>e.datetime.startsWith(dateStr)).forEach(e=>{
                cell.innerHTML+=`<div style="background:${EVENT_TYPES[e.type].color}; margin-top:2px;color:#fff;font-size:11px;">${e.title}</div>`;
            });
            el.appendChild(cell);
        }
    }

    function renderEvents(el){
        el.innerHTML='';
        const events=loadEvents().sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
        if(!events.length){ el.innerHTML=`<div style="color:#9c8cb3;">No upcoming events</div>`; return;}
        events.forEach((e,i)=>{
            const row=document.createElement('div');
            row.style.padding='6px 0';
            row.innerHTML=`
                <b style="color:${EVENT_TYPES[e.type].color};">${e.title}</b><br>
                <span style="color:#9c8cb3;">${new Date(e.datetime).toUTCString()} — ${countdown(e.datetime)}</span><br>
                <button ${isLocked()||isReadonly()?'disabled':''}>Delete</button>`;
            row.querySelector('button').onclick=()=>{
                const ev=loadEvents();
                ev.splice(i,1);
                saveEvents(ev);
                refresh();
            };
            el.appendChild(row);
        });
    }

    // ================= IMPORT =================
    importBtn.onclick=()=>{
        const text=importBox.value;
        if(!text)return;
        const dateMatch=text.match(/(\d{4}-\d{2}-\d{2})/);
        const timeMatch=text.match(/(\d{2}:\d{2})/);
        const titleMatch=text.split('\n')[0].slice(0,40);
        if(!dateMatch)return alert('No valid date found');
        const id=btoa(text).slice(0,12);
        if(getImported().includes(id))return;
        const events=loadEvents();
        events.push({
            title:titleMatch||'Imported Event',
            datetime:toTCT(new Date(`${dateMatch[1]}T${timeMatch?timeMatch[1]:'00:00'}`)).toISOString(),
            type:'other'
        });
        saveEvents(events);
        markImported(id);
        importBox.value='';
        refresh();
    };

    // ================= REFRESH =================
    function refresh(){
        renderCalendar(calendar);
        renderEvents(eventList);
        editor.style.display=isReadonly()?'none':'';
        contentArea.style.display=isCollapsed()?'none':'';
        collapseBtn.textContent=isCollapsed()?'Expand':'Collapse';
        lockBtn.textContent=isLocked()?'Unlock':'Lock';
        roBtn.textContent=isReadonly()?'Editable':'Read-Only';
        const warEnd=detectWarTCT();
        if(warEnd){ warBanner.style.display='block'; warBanner.textContent=`WAR ACTIVE — Ends in ${countdown(warEnd)}`; }
        else warBanner.style.display='none';
    }

    // ================= EVENTS =================
    collapseBtn.onclick=()=>{ toggleCollapse(); refresh(); };
    lockBtn.onclick=()=>{ toggleLock(); refresh(); };
    roBtn.onclick=()=>{ toggleReadonly(); refresh(); };
    addBtn.onclick=()=>{
        if(isLocked()||isReadonly()) return;
        if(!eTitle.value||!eDate.value) return alert('Title and date required');
        const ev=loadEvents();
        ev.push({
            title:eTitle.value,
            datetime:toTCT(new Date(`${eDate.value}T${eTime.value||'00:00'}`)).toISOString(),
            type:eType.value
        });
        saveEvents(ev);
        eTitle.value='';
        refresh();
    };

    // ================= INIT =================
    detectTCTOffset();
    refresh();
    setInterval(refresh,60000);

})();
