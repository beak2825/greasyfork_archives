// ==UserScript==
// @name         Universal Game Keyboard — Mobile & Desktop Virtual Keyboard Emulator
// @namespace    https://universal-game-keyboard
// @version      1.5.0
// @description  Full virtual hardware keyboard emulator for games, apps, and virtual machines. Now uses DRAG-TO-OPEN/CLOSE: You MUST drag the ⌨️ toggle button and release it to open or close the keyboard (tapping does nothing). Includes iOS-safe dragging, key hold, WASD, arrows, F-keys, modifiers, sound, glow, and no text selection.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557307/Universal%20Game%20Keyboard%20%E2%80%94%20Mobile%20%20Desktop%20Virtual%20Keyboard%20Emulator.user.js
// @updateURL https://update.greasyfork.org/scripts/557307/Universal%20Game%20Keyboard%20%E2%80%94%20Mobile%20%20Desktop%20Virtual%20Keyboard%20Emulator.meta.js
// ==/UserScript==

(() => {
'use strict';

if (window.__USK_INSTALLED__) return;
window.__USK_INSTALLED__ = true;

// -------------------------------------------------------------
// GLOBAL CSS TO PREVENT TEXT SELECTION / CALLOUTS / HIGHLIGHT
// -------------------------------------------------------------
const style = document.createElement("style");
style.textContent = `
#usk-kb, #usk-kb * , #usk-toggle {
    -webkit-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
    touch-action: none !important;
}
`;
document.head.appendChild(style);

// UTILITIES
const make = (t, props = {}) => Object.assign(document.createElement(t), props);
const css  = (el, rules) => Object.assign(el.style, rules);

// AUDIO CLICK
let audioCtx = null;
function playClick() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'triangle';
        o.frequency.value = 750;
        g.gain.value = 0.06;
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
        o.connect(g); g.connect(audioCtx.destination);
        o.start();
        o.stop(audioCtx.currentTime + 0.09);
    } catch(e){}
}

// ---------------------------------------------
// KEY DATABASE AND EVENT GENERATION
// ---------------------------------------------
const KEYDB = (() => {
    const db = {};
    const add = (key, code, keyCode, location=0) =>
        db[key] = { key, code, keyCode, location };

    for (let i=65; i<=90; i++) {
        const ch = String.fromCharCode(i).toLowerCase();
        add(ch, 'Key'+ch.toUpperCase(), i);
    }

    for (let i=0;i<=9;i++) add(String(i), "Digit"+i, 48+i);

    const sym = {
        '`':192,'-':189,'=':187,'[':219,']':221,'\\':220,
        ';':186,"'":222,',':188,'.':190,'/':191
    };
    for (const k in sym) add(k, "", sym[k]);

    add('Space','Space',32);
    add('Enter','Enter',13);
    add('Tab','Tab',9);
    add('Backspace','Backspace',8);
    add('Escape','Escape',27);
    add('Delete','Delete',46);

    add('ArrowLeft','ArrowLeft',37);
    add('ArrowUp','ArrowUp',38);
    add('ArrowRight','ArrowRight',39);
    add('ArrowDown','ArrowDown',40);

    for (let i=1;i<=12;i++) add("F"+i, "F"+i, 111+i);

    add('Shift','ShiftLeft',16);
    add('Control','ControlLeft',17);
    add('Ctrl','ControlLeft',17);
    add('Alt','AltLeft',18);
    add('Meta','MetaLeft',91);

    return db;
})();

const SHIFT_MAP = {
    '`':'~','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')',
    '-':'_','=':'+','[':'{',']':'}','\\':'|',';':':',"'":'"',',':'<','.':'>','/':'?'
};

// CREATE KEYBOARD EVENTS SAFE
function makeKeyboardEvent(type, opts={}) {
    const ev = new KeyboardEvent(type, {
        key: opts.key || "",
        code: opts.code || "",
        keyCode: opts.keyCode || 0,
        which: opts.which || opts.keyCode || 0,
        location: opts.location || 0,
        ctrlKey: !!opts.ctrlKey,
        shiftKey: !!opts.shiftKey,
        altKey: !!opts.altKey,
        metaKey: !!opts.metaKey,
        bubbles: true,
        cancelable: true,
        composed: true
    });

    try { Object.defineProperty(ev, "keyCode", { get:() => opts.keyCode }) } catch(e){}
    try { Object.defineProperty(ev, "which",   { get:() => opts.keyCode }) } catch(e){}

    return ev;
}

function dispatchToTargets(ev) {
    const targets = [];

    if (document.activeElement) targets.push(document.activeElement);
    const mid = document.elementFromPoint(innerWidth/2, innerHeight/2);
    if (mid && !targets.includes(mid)) targets.push(mid);
    if (!targets.includes(document)) targets.push(document);
    if (!targets.includes(window)) targets.push(window);

    for (const t of targets) {
        try { t.dispatchEvent(ev); } catch(e){}
    }
}

const modifierState = { Shift:false, Control:false, Alt:false, Meta:false, Caps:false };

function normalize(label) {
    if (label === 'Space') return ' ';
    if (label === 'Esc') return 'Escape';
    if (label === 'Back') return 'Backspace';
    if (label === 'Left') return 'ArrowLeft';
    if (label === 'Right') return 'ArrowRight';
    if (label === 'Up') return 'ArrowUp';
    if (label === 'Down') return 'ArrowDown';
    if (label === 'Caps') return 'CapsLock';
    return label;
}

function getKeyInfo(label, withShift=false) {
    label = String(label);
    if (label.length === 1) {
        const lower = label.toLowerCase();
        if (KEYDB[lower]) {
            const d = KEYDB[lower];
            let key = d.key;

            if (/[a-z]/i.test(label)) {
                if (withShift || modifierState.Caps) key = label.toUpperCase();
                else key = label.toLowerCase();
            } else {
                if (withShift && SHIFT_MAP[label]) key = SHIFT_MAP[label];
                else key = label;
            }

            return { key, code:d.code, keyCode:d.keyCode, location:d.location, isPrintable:true };
        }
        return { key:label, code:"Unknown", keyCode:label.charCodeAt(0), location:0, isPrintable:true };
    }

    const norm = normalize(label);
    const d = KEYDB[label] || KEYDB[norm] || KEYDB[label.toUpperCase()];
    if (d)
        return { key:d.key, code:d.code, keyCode:d.keyCode, location:d.location, isPrintable:false };

    return { key:norm, code:norm, keyCode:0, location:0, isPrintable:false };
}

function simulateKeyPress(label, opts={}) {
    const useShift = opts.shift || modifierState.Shift;
    const info = getKeyInfo(label, useShift);

    const lower = label.toLowerCase();
    if (['shift','control','ctrl','alt','meta','caps','capslock'].includes(lower)) {
        const keyName = (lower==='ctrl'?'Control': lower==='caps'?'Caps': lower.charAt(0).toUpperCase()+lower.slice(1));
        modifierState[keyName] = !modifierState[keyName];
        highlightModifier(label, modifierState[keyName]);
        return;
    }

    const key = info.key;
    const code = info.code;
    const keyCode = info.keyCode;
    const loc = info.location;

    const down = makeKeyboardEvent("keydown", {
        key, code, keyCode, which:keyCode, location:loc,
        ctrlKey:modifierState.Control,
        shiftKey:modifierState.Shift,
        altKey:modifierState.Alt,
        metaKey:modifierState.Meta
    });
    dispatchToTargets(down);

    if (info.isPrintable) {
        const press = makeKeyboardEvent("keypress", {
            key,
            code,
            keyCode:key.charCodeAt(0) || keyCode,
            which: key.charCodeAt(0) || keyCode,
            location:loc,
            ctrlKey:modifierState.Control,
            shiftKey:modifierState.Shift,
            altKey:modifierState.Alt,
            metaKey:modifierState.Meta
        });
        dispatchToTargets(press);
    }

    const up = makeKeyboardEvent("keyup", {
        key, code, keyCode, which:keyCode, location:loc,
        ctrlKey:modifierState.Control,
        shiftKey:modifierState.Shift,
        altKey:modifierState.Alt,
        metaKey:modifierState.Meta
    });

    if (opts.holdFor) setTimeout(()=>dispatchToTargets(up), opts.holdFor);
    else dispatchToTargets(up);
}

// ----------------------------------------------------------
// KEYBOARD UI BUILD
// ----------------------------------------------------------
const UI_LAYOUT = [
 ['Esc','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Del'],
 ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
 ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
 ['Caps','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
 ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
 ['Ctrl','Alt','Meta','Space','Left','Down','Up','Right']
];

const kb = make("div", { id:"usk-kb" });
css(kb, {
    position:"fixed",
    left:"50%",
    bottom:"12px",
    transform:"translateX(-50%)",
    background:"rgba(12,12,12,0.96)",
    padding:"10px",
    borderRadius:"10px",
    border:"1px solid rgba(255,255,255,0.06)",
    display:"none",
    zIndex:2147483646,
    color:"#fff",
    fontFamily:"system-ui,Segoe UI,Roboto,Arial",
    boxShadow:"0 6px 30px rgba(0,0,0,0.6)",
    touchAction:"none"
});
document.body.appendChild(kb);

const keyStyle = {
    display:"inline-flex",
    alignItems:"center",
    justifyContent:"center",
    background:"#333",
    color:"#fff",
    padding:"8px 10px",
    margin:"3px",
    borderRadius:"6px",
    minWidth:"36px",
    cursor:"pointer",
    userSelect:"none",
    boxSizing:"border-box",
    transition:"box-shadow 0.06s, transform 0.06s"
};

function makeKey(label) {
    const k = make("div",{className:"usk-key",textContent:label});
    css(k,keyStyle);

    if (label==="Space") css(k,{minWidth:"240px"});
    if (["Enter","Shift","Caps","Tab"].includes(label)) css(k,{minWidth:"64px"});
    if (label==="Backspace") css(k,{minWidth:"72px"});

    k.dataset.keyLabel = label;
    return k;
}

UI_LAYOUT.forEach(row=>{
    const r = make("div");
    css(r,{display:"flex",justifyContent:"center",marginBottom:"4px",alignItems:"center"});
    row.forEach(label=>r.appendChild(makeKey(label)));
    kb.appendChild(r);
});

// ----------------------------------------------------------
// TOGGLE BUTTON — DRAG TO OPEN/CLOSE ONLY
// ----------------------------------------------------------
const toggle = make("div", { id:"usk-toggle", textContent:"⌨️" });
css(toggle, {
    position:"fixed",
    top:"12px",
    right:"12px",
    width:"48px",
    height:"48px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"22px",
    background:"rgba(0,0,0,0.68)",
    color:"#fff",
    borderRadius:"10px",
    zIndex:2147483647,
    cursor:"grab",
    boxShadow:"0 6px 18px rgba(0,0,0,0.45)",
    touchAction:"none"
});
document.body.appendChild(toggle);

let dragStartX = null;
let dragStartY = null;
let dragging = false;

toggle.addEventListener("pointerdown", (ev)=>{
    ev.preventDefault();
    dragStartX = ev.clientX;
    dragStartY = ev.clientY;
    toggle.setPointerCapture(ev.pointerId);
    dragging = false;
});

toggle.addEventListener("pointermove", (ev)=>{
    if (dragStartX == null) return;

    const dx = ev.clientX - dragStartX;
    const dy = ev.clientY - dragStartY;

    if (!dragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        dragging = true;
    }

    if (dragging) {
        toggle.style.left = `${ev.clientX - 24}px`;
        toggle.style.top  = `${ev.clientY - 24}px`;
        toggle.style.right = "auto";
        toggle.style.bottom = "auto";
    }
});

toggle.addEventListener("pointerup", () => {
    if (dragging) {
        if (kb.style.display === "none") {
            kb.style.display = "block";
            toggle.style.boxShadow = "0 8px 30px rgba(0,170,255,0.25)";
        } else {
            kb.style.display = "none";
            toggle.style.boxShadow = "0 6px 18px rgba(0,0,0,0.45)";
        }
    }
    dragStartX = dragStartY = null;
    dragging = false;
});

// ----------------------------------------------------------
// KEY PRESS / HOLD
// ----------------------------------------------------------
function flashKey(el) {
    el.style.boxShadow = "0 0 14px 3px rgba(0,170,255,0.85)";
    el.style.transform = "translateY(1px)";
    setTimeout(()=>{
        el.style.boxShadow="";
        el.style.transform="";
    },120);
}

function highlightModifier(label, on) {
    const l = label.toLowerCase();
    document.querySelectorAll(".usk-key").forEach(k=>{
        const kl = k.dataset.keyLabel.toLowerCase();
        if ((l==="shift" && kl==="shift") ||
            (l==="ctrl" && (kl==="ctrl"||kl==="control")) ||
            (l==="control" && (kl==="ctrl"||kl==="control")) ||
            (l==="alt" && kl==="alt") ||
            (l==="meta" && kl==="meta") ||
            (l==="caps" && kl==="caps")) {
            if (on) {
                k.style.background="#0b6";
                k.style.color="#001";
                k.style.boxShadow="0 0 10px 2px rgba(11,204,119,0.25)";
            } else {
                k.style.background="#333";
                k.style.color="#fff";
                k.style.boxShadow="";
            }
        }
    });
}

const activeRepeat = new Map();

function startPress(label, el) {
    simulateKeyPress(label);
    flashKey(el);
    playClick();

    const repeatDelay = 400;
    const repeatInterval = 55;

    let timeoutId = setTimeout(()=>{
        let intervalId = setInterval(()=>{
            simulateKeyPress(label);
            flashKey(el);
            playClick();
        }, repeatInterval);
        activeRepeat.set(el, intervalId);
    }, repeatDelay);

    activeRepeat.set(el, timeoutId);
}

function stopPress(el) {
    const id = activeRepeat.get(el);
    if (!id) return;
    clearTimeout(id);
    clearInterval(id);
    activeRepeat.delete(el);
}

// LISTENERS
document.querySelectorAll(".usk-key").forEach(el=>{
    el.addEventListener("pointerdown", (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        startPress(el.dataset.keyLabel, el);
    });

    ["pointerup","pointercancel","pointerleave"].forEach(evt=>{
        el.addEventListener(evt, (ev)=>{
            ev.preventDefault();
            stopPress(el);
        });
    });
});

// DRAG KEYBOARD BODY
(function draggable(el) {
    let draggin = false, ox=0, oy=0;
    el.addEventListener("pointerdown", ev=>{
        if (ev.target.closest(".usk-key")) return;
        draggin = true;
        ox = ev.clientX - el.offsetLeft;
        oy = ev.clientY - el.offsetTop;
        el.setPointerCapture(ev.pointerId);
    });
    document.addEventListener("pointermove", ev=>{
        if (!draggin) return;
        css(el,{ left:`${ev.clientX-ox}px`, top:`${ev.clientY-oy}px`, transform:"none" });
    });
    document.addEventListener("pointerup", ()=> draggin=false);
})(kb);

console.info("Universal Game Keyboard loaded with DRAG-TO-OPEN/CLOSE enabled.");
})();