// ==UserScript==
// @name         Bonk.io – Mute/Hide Toxic Users (Safe Client-side)
// @namespace    https://github.com/thebestg5
// @version      1.2.0
// @description  Adds buttons to Mute/Unmute users in Bonk.io chat and hides messages containing offensive/banned words. Saves list in localStorage. Muted users appear in red, report links to Bonk Discord.
// @author       thebestg5
// @match        https://bonk.io/*
// @match        https://www.bonk.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548333/Bonkio%20%E2%80%93%20MuteHide%20Toxic%20Users%20%28Safe%20Client-side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548333/Bonkio%20%E2%80%93%20MuteHide%20Toxic%20Users%20%28Safe%20Client-side%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEYS = {
        muted: 'bonk_mute_list_v1',
        badwords: 'bonk_badwords_v1'
    };

    const DEFAULT_BADWORDS = [
        'idiot','imbecile','stupid','moron','dumb','bastard','shit','fuck','noob','stfu','kys'
    ];

    const state = {
        muted: new Set(loadJSON(STORAGE_KEYS.muted, [])),
        badwords: new Set(loadJSON(STORAGE_KEYS.badwords, DEFAULT_BADWORDS))
    };

    function saveSets() {
        saveJSON(STORAGE_KEYS.muted, Array.from(state.muted));
        saveJSON(STORAGE_KEYS.badwords, Array.from(state.badwords));
    }

    function loadJSON(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
    function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'bonk-mute-panel';
        Object.assign(panel.style,{
            position:'fixed',right:'12px',bottom:'12px',zIndex:99999,
            background:'rgba(0,0,0,0.75)',color:'#fff',padding:'10px 12px',
            borderRadius:'12px',fontFamily:'sans-serif',fontSize:'12px',maxWidth:'320px',backdropFilter:'blur(2px)'
        });

        panel.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <strong style="font-size:13px;">Bonk Mute Helper</strong>
            <button id="bm-toggle" title="Hide/Show" style="margin-left:auto;">−</button>
        </div>
        <div id="bm-body">
            <div style="margin-bottom:8px;opacity:0.9">Click <em>Mute</em> next to a username in chat to add them to the list.</div>
            <div style="display:flex;gap:6px;margin-bottom:8px;">
                <input id="bm-user" placeholder="Username" style="flex:1;padding:4px;border-radius:6px;border:1px solid #333;background:#111;color:#fff;" />
                <button id="bm-add-user">Add</button>
            </div>
            <div style="margin-bottom:8px;">
                <div style="margin-bottom:4px;opacity:0.9">Muted users</div>
                <div id="bm-users" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
            </div>
            <hr style="border:none;border-top:1px solid #333;margin:8px 0;"/>
            <div style="margin-bottom:6px;opacity:0.9">Banned words (comma-separated)</div>
            <textarea id="bm-badwords" rows="3" style="width:100%;padding:6px;border-radius:6px;border:1px solid #333;background:#111;color:#fff;"></textarea>
            <div style="display:flex;gap:6px;margin-top:6px;">
                <button id="bm-save-bw">Save words</button>
                <button id="bm-reset-bw" title="Reset to default list">Reset</button>
            </div>
        </div>`;

        document.body.appendChild(panel);

        const body = panel.querySelector('#bm-body');
        const toggleBtn = panel.querySelector('#bm-toggle');
        toggleBtn.addEventListener('click', ()=>{
            const hidden = body.style.display==='none';
            body.style.display = hidden?'':'none';
            toggleBtn.textContent = hidden?'−':'+';
        });

        const userInput = panel.querySelector('#bm-user');
        panel.querySelector('#bm-add-user').addEventListener('click',()=>{
            const name=(userInput.value||'').trim();
            if(!name) return;
            state.muted.add(name);
            saveSets();
            userInput.value='';
            renderMutedUsers();
        });

        const ta = panel.querySelector('#bm-badwords');
        ta.value = Array.from(state.badwords).join(', ');
        panel.querySelector('#bm-save-bw').addEventListener('click',()=>{
            const parts=ta.value.split(',').map(s=>s.trim()).filter(Boolean);
            state.badwords = new Set(parts);
            saveSets();
            alert('Words saved!');
        });
        panel.querySelector('#bm-reset-bw').addEventListener('click',()=>{
            state.badwords = new Set(DEFAULT_BADWORDS);
            saveSets();
            ta.value = Array.from(state.badwords).join(', ');
        });

        function renderMutedUsers(){
            const wrap = panel.querySelector('#bm-users');
            wrap.innerHTML='';
            Array.from(state.muted).sort((a,b)=>a.localeCompare(b)).forEach(name=>{
                const chip = document.createElement('span');
                chip.textContent = name;
                chip.style.color='red';
                Object.assign(chip.style,{
                    padding:'4px 8px',borderRadius:'999px',background:'#222',
                    border:'1px solid #333',display:'inline-flex',gap:'6px',alignItems:'center'
                });

                const x = document.createElement('button');
                x.textContent='✕';x.title='Unmute';
                Object.assign(x.style,{marginLeft:'6px',cursor:'pointer'});
                x.addEventListener('click',()=>{
                    state.muted.delete(name);
                    saveSets();
                    renderMutedUsers();
                });
                chip.appendChild(x);

                const reportBtn = document.createElement('button');
                reportBtn.textContent='[Report]';
                Object.assign(reportBtn.style,{marginLeft:'6px',cursor:'pointer',fontSize:'11px',background:'transparent',color:'#f99',border:'none'});
                reportBtn.addEventListener('click',()=>window.open('https://discord.gg/bonk','_blank'));
                chip.appendChild(reportBtn);

                wrap.appendChild(chip);
            });
        }

        renderMutedUsers();
    }

    function containsBadword(text){
        const t=(text||'').toLowerCase();
        for(const w of state.badwords){
            if(!w) continue;
            if(t.includes(w.toLowerCase())) return true;
        }
        return false;
    }

    function enhanceChat(){
        const candidates = Array.from(document.querySelectorAll('*'))
        .filter(el=>{
            const id=(el.id||'').toLowerCase();
            const cls=(el.className||'').toString().toLowerCase();
            const looksLikeChat = id.includes('chat') || cls.includes('chat');
            const manyLines = el.childElementCount>3 && el.scrollHeight>100;
            return looksLikeChat && manyLines;
        });
        const chatBox = candidates[0] || document.body;
        const processed = new WeakSet();

        const observer = new MutationObserver(muts=>{
            muts.forEach(m=>{
                m.addedNodes.forEach(node=>{
                    if(!(node instanceof HTMLElement)) return;
                    const lineEls = node.querySelectorAll? [node,...node.querySelectorAll('*')]:[node];
                    lineEls.forEach(el=>tryProcessLine(el));
                });
            });
        });
        observer.observe(chatBox,{childList:true,subtree:true});

        function tryProcessLine(el){
            if(processed.has(el)) return;
            const text = el.textContent||'';
            const idx = text.indexOf(':');
            if(idx<=0||idx>30) return;
            const name = text.slice(0,idx).trim();
            const message = text.slice(idx+1).trim();
            if(!name||!message) return;
            processed.add(el);

            if(state.muted.has(name)||containsBadword(message)) el.style.display='none';

            const btnWrap=document.createElement('span');btnWrap.style.marginLeft='8px';
            const muteBtn=document.createElement('button');
            muteBtn.textContent = state.muted.has(name)?'[Unmute]':'[Mute]';
            Object.assign(muteBtn.style,{cursor:'pointer',fontSize:'11px',background:'transparent',color:'#9cf',border:'none'});
            muteBtn.addEventListener('click',ev=>{
                ev.stopPropagation();
                if(state.muted.has(name)) state.muted.delete(name); else state.muted.add(name);
                saveSets();
                muteBtn.textContent=state.muted.has(name)?'[Unmute]':'[Mute]';
                el.style.display = state.muted.has(name)?'none':'';
            });
            btnWrap.appendChild(muteBtn);

            const reportBtn = document.createElement('button');
            reportBtn.textContent='[Report]';
            Object.assign(reportBtn.style,{marginLeft:'6px',cursor:'pointer',fontSize:'11px',background:'transparent',color:'#f99',border:'none'});
            reportBtn.addEventListener('click',()=>window.open('https://discord.gg/bonk','_blank'));
            btnWrap.appendChild(reportBtn);

            el.appendChild(btnWrap);
        }
    }

    function hideMutedInLobby(){
        const observer = new MutationObserver(()=>{
            const nameNodes = Array.from(document.querySelectorAll('div,span,li'))
            .filter(el=>el.childElementCount===0 && el.textContent && el.textContent.length<=20);
            nameNodes.forEach(el=>{
                const name=el.textContent.trim();
                if(state.muted.has(name)) el.style.opacity='0.35';
            });
        });
        observer.observe(document.body,{childList:true,subtree:true});
    }

    function init(){
        createControlPanel();
        enhanceChat();
        hideMutedInLobby();
        console.log('[Bonk Mute Helper] active');
    }

    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded',init);
    } else init();
})();
