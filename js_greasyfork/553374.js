// ==UserScript==
// @name         Word Definition Tooltip
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show definition of selected word in a tooltip (works on mobile selection)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @author       word
// @downloadURL https://update.greasyfork.org/scripts/553374/Word%20Definition%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/553374/Word%20Definition%20Tooltip.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // --- Elements ---
    const btn = document.createElement("div");
    Object.assign(btn.style,{
        position:"absolute",
        zIndex:2147483647,
        fontSize:"20px",
        padding:"2px 6px",
        background:"rgba(0,0,0,0.85)",
        color:"#fff",
        borderRadius:"6px",
        cursor:"pointer",
        display:"none",
        userSelect:"none"
    });
    btn.textContent = "❔";
    document.body.appendChild(btn);

    const tip = document.createElement("div");
    Object.assign(tip.style,{
        position:"absolute",
        zIndex:2147483647,
        maxWidth:"320px",
        background:"rgba(0,0,0,.88)",
        color:"#fff",
        padding:"8px 10px",
        borderRadius:"8px",
        fontSize:"14px",
        lineHeight:"1.4",
        whiteSpace:"pre-wrap",
        display:"none",
        boxShadow:"0 6px 18px rgba(0,0,0,0.35)"
    });
    document.body.appendChild(tip);

    function hideAll(){
        btn.style.display="none";
        tip.style.display="none";
    }

    // --- Selection checker ---
    function getSelectionInfo(){
        const sel = window.getSelection();
        if(!sel || sel.isCollapsed) return null;
        const text = sel.toString().trim();
        if(!/^[\p{L}\p{M}0-9'’-]+$/u.test(text)) return null;
        if(text.split(/\s+/).length !== 1) return null;
        if(sel.rangeCount===0) return null;
        const r = sel.getRangeAt(0);
        const br = r.getBoundingClientRect();
        if(br.width===0 && br.height===0) return null;
        return {word:text, rect:br};
    }

    let last = null;
    let debounce;

    document.addEventListener("selectionchange",()=>{
        clearTimeout(debounce);
        debounce = setTimeout(()=>{
            const info = getSelectionInfo();
            if(!info){ hideAll(); last=null; return; }
            last = info;
            // Position ❔ below or above
            const {rect} = info;
            const spaceBelow = window.innerHeight - rect.bottom;
            const y = (spaceBelow>40? rect.bottom+6 : rect.top-30);
            btn.style.left = Math.min(Math.max(rect.left,6), window.innerWidth-40)+"px";
            btn.style.top = y+"px";
            btn.style.display="block";
            tip.style.display="none";
        },250);
    });

    // --- On ❔ tap: lookup & show definition ---
    btn.addEventListener("click",()=>{
        if(!last) return;
        tip.textContent="Looking up…";
        const r = last.rect;
        tip.style.left = r.left+"px";
        tip.style.top  = (r.bottom+10)+"px";
        tip.style.display="block";

        GM_xmlhttpRequest({
            method:"GET",
            url:`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(last.word)}`,
            onload(res){
                try{
                    const data = JSON.parse(res.responseText);
                    const m = data[0]?.meanings?.[0];
                    const def = m?.definitions?.[0]?.definition;
                    tip.textContent = def || "No definition found.";
                }catch(e){
                    tip.textContent="Error.";
                }
            },
            onerror(){ tip.textContent="Lookup failed."; }
        });
    });

    // Hide on outside tap
    document.addEventListener("pointerdown",e=>{
        if(!btn.contains(e.target) && !tip.contains(e.target)){
            hideAll();
        }
    },true);

})();