// ==UserScript==
// @name         Conscience Stream (Global in-browser chat)
// @namespace    https://greasyfork.org/en/scripts/549770-conscience-stream-global-in-browser-chat
// @version      1.4a
// @description  Slide out menu with Ctrl+Shift+;, username support using GM storage, colored usernames, basic emotes, bottom-aligned chat
// @author       You
// @match        *://*/*
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/549770/Conscience%20Stream%20%28Global%20in-browser%20chat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549770/Conscience%20Stream%20%28Global%20in-browser%20chat%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Add styles for slide-out menu + chat
    GM.addStyle(`
        #tm-slideout-menu {
            position: fixed;
            top: 0;
            right: -380px;
            width: 380px;
            height: 100%;
            backdrop-filter: blur(18px) saturate(160%);
            -webkit-backdrop-filter: blur(18px) saturate(160%);
            background: linear-gradient(135deg, rgba(25,25,30,0.85) 0%, rgba(15,15,20,0.78) 60%, rgba(10,10,15,0.72) 100%);
            border-left: 1px solid rgba(255,255,255,0.08);
            color: #f5f7fa;
            box-shadow: -4px 0 14px rgba(0,0,0,0.55);
            transition: right 0.45s cubic-bezier(.4,.0,.2,1), opacity 0.45s ease, transform 0.5s cubic-bezier(.4,.0,.2,1);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif;
            box-sizing: border-box;
            overflow-x: hidden;
            transform: scale(.985);
        }
        /* Ensure all children use border-box to prevent width overflow in Chrome */
        #tm-slideout-menu *, #tm-slideout-menu *::before, #tm-slideout-menu *::after { box-sizing: border-box; }
        #tm-slideout-menu.active { right: 0; opacity: 1; pointer-events: auto; transform: scale(1); }
        /* Reduced motion: strip transitions */
        .tm-reduced-motion #tm-slideout-menu { transition: none !important; transform: none !important; }
        .tm-reduced-motion #tm-slideout-menu.active { transition: none !important; }
        .tm-reduced-motion #tm-jump-latest-btn, .tm-reduced-motion #tm-new-msg-badge, .tm-reduced-motion .tm-chat-message { transition: none !important; animation: none !important; }
        #tm-slideout-menu h2 {
            margin: 0;
            padding: 18px 22px 10px;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: .5px;
            background: linear-gradient(90deg,#8f5fff,#6a5af9,#4d65f9);
            -webkit-background-clip: text;
            color: transparent;
            user-select: none;
        }
        #tm-username-container { padding: 4px 18px 10px; display: flex; gap: 8px; }
        #tm-username-input {
            flex: 1; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.06); color: #fff; font-size: 14px; outline: none; transition: border .2s, background .2s;
        }
        #tm-username-input:focus { border-color: #7f6bff; background: rgba(255,255,255,0.12); box-shadow: 0 0 0 3px rgba(127,107,255,0.25); }
        #tm-save-username-btn {
            padding: 10px 14px; border-radius: 10px; border: 0; background: linear-gradient(135deg,#7c5bff,#5b8dff);
            color: #fff; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing:.3px; display:inline-flex; align-items:center; gap:6px;
            box-shadow: 0 4px 12px -2px rgba(91,141,255,0.45);
            transition: transform .15s ease, box-shadow .3s ease;
        }
        #tm-save-username-btn:hover { transform: translateY(-2px); box-shadow:0 6px 18px -2px rgba(91,141,255,0.55); }
        #tm-info { padding: 0 20px 10px; font-size: 12px; color: #c7ced7; line-height: 1.5; }
        #tm-info p { margin: 4px 0; }
    #tm-chat-container { flex: 1; min-height:0; display: flex; flex-direction: column; justify-content: flex-end; overflow-y: auto; padding: 10px 18px 70px; gap: 10px; position: relative; }
    #tm-jump-latest-btn { position: absolute; left: 50%; bottom: 90px; /* dynamic bottom */ transform: translate(-50%,70px); opacity:0; pointer-events:none; transition: opacity .25s, transform .35s cubic-bezier(.4,.0,.2,1); background: rgba(45,55,85,0.7); backdrop-filter: blur(10px) saturate(160%); color:#fff; font-size:12px; font-weight:600; letter-spacing:.5px; padding:8px 16px; border-radius:24px; border:1px solid rgba(255,255,255,0.18); cursor:pointer; box-shadow:0 4px 12px -2px rgba(0,0,0,0.45); z-index: 2; outline: none; display:flex; align-items:center; justify-content:center; line-height:1; }
    #tm-jump-latest-btn:focus { outline: none; }
    #tm-jump-latest-btn:focus-visible { box-shadow:0 0 0 3px rgba(127,107,255,0.55), 0 4px 12px -2px rgba(0,0,0,0.45); }
    #tm-jump-latest-btn:hover { background: rgba(90,110,190,0.82); }
    #tm-jump-latest-btn.active { opacity:1; pointer-events:auto; transform: translate(-50%,0); }
    /* New message badge (subtle) */
    #tm-new-msg-badge { position:absolute; left: 50%; bottom: 90px; transform: translate(-50%,70px); opacity:0; pointer-events:none; transition: opacity .25s, transform .35s cubic-bezier(.4,.0,.2,1); background: rgba(70,90,150,0.78); backdrop-filter: blur(10px) saturate(160%); color:#fff; font-size:11px; font-weight:600; letter-spacing:.5px; padding:6px 14px; border-radius:20px; border:1px solid rgba(255,255,255,0.18); box-shadow:0 4px 12px -2px rgba(0,0,0,0.45); z-index: 2; cursor:pointer; }
    #tm-new-msg-badge.active { opacity:1; pointer-events:auto; transform: translate(-50%,0); }
        #tm-chat-container::-webkit-scrollbar { width: 10px; }
        #tm-chat-container::-webkit-scrollbar-track { background: transparent; }
        #tm-chat-container::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#4d4f5a,#2f3138); border-radius: 20px; border:2px solid transparent; background-clip: padding-box; }
        #tm-chat-container::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg,#636672,#3b3d45); border-radius: 20px; border:2px solid transparent; background-clip: padding-box; }
    .tm-chat-message { display: flex; flex-direction: column; gap: 4px; animation: tmFadeIn .4s ease; position:relative; overflow:visible; z-index:1; }
        .tm-bubble { max-width: 92%; padding: 10px 14px; border-radius: 16px; line-height: 1.4; font-size: 14px; position: relative; word-break: break-word; backdrop-filter: blur(4px); }
    /* Swap sides: user (tm-me) now left, others right */
    .tm-me { align-items: flex-start; }
    .tm-other { align-items: flex-end; }
    .tm-me .tm-bubble { background: linear-gradient(135deg,#5a7dff,#866bff); color:#fff; border-bottom-left-radius: 4px; box-shadow: 0 4px 10px -2px rgba(90,125,255,0.4); }
    .tm-other .tm-bubble { background: rgba(255,255,255,0.08); color:#f2f5fa; border:1px solid rgba(255,255,255,0.08); border-bottom-right-radius:4px; }
    .tm-username { font-size: 11px; font-weight:600; letter-spacing:.5px; text-transform: uppercase; opacity:.85; padding:0 2px 2px; user-select:none; width:100%; }
    .tm-me .tm-username { text-align: left; background: linear-gradient(90deg,#a9b8ff,#d2c2ff); -webkit-background-clip:text; color:transparent; }
    .tm-other .tm-username { text-align: right; color:#8fa0b3; }
    #tm-chat-box { padding: 14px 16px 18px; border-top: 1px solid rgba(255,255,255,0.08); background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0)); box-sizing: border-box; }
    #tm-chat-input { resize: none; width: 100%; max-width:100%; height:40px; min-height:40px; max-height:40px; overflow-y:auto; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; color: #fff; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; transition: border .2s, background .25s, box-shadow .25s; display:block; line-height:18px; }
        #tm-chat-input:focus { border-color: #7f6bff; background: rgba(255,255,255,0.12); box-shadow: 0 0 0 3px rgba(127,107,255,0.25); }
        @keyframes tmFadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
        /* Checkbox styling (remove Firefox dotted outline, keep accessible focus-visible) */
        #tm-settings-popup input[type=checkbox] { outline: none !important; box-shadow:none; accent-color:#7f6bff; }
        #tm-settings-popup input[type=checkbox]:focus { outline: none; box-shadow:none; }
        #tm-settings-popup input[type=checkbox]:focus-visible { outline: 2px solid rgba(127,107,255,0.85); outline-offset: 2px; border-radius:4px; }
        /* High contrast fallback */
        @media (forced-colors: active) {
            #tm-settings-popup input[type=checkbox]:focus-visible { outline: 2px solid Highlight; }
        }
        /* Rainbow animation for /rainbow command */
        @keyframes tmRainbowShift { 0% { filter:hue-rotate(0deg);} 100% { filter:hue-rotate(360deg);} }
        .tm-rainbow-bubble { position:relative; }
        .tm-rainbow-bubble::before { content:""; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(135deg,#ff6ab7,#ffcd56,#64ff8f,#5bbdff,#b07bff,#ff6ab7); background-size:400% 400%; animation: tmRainbowGrad 8s linear infinite; opacity:0.9; z-index:0; }
        .tm-rainbow-bubble > * { position:relative; z-index:1; }
        @keyframes tmRainbowGrad { 0%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } 100%{ background-position:0% 50%; } }
    .tm-mention { background:rgba(255,255,255,0.18); padding:0 4px; border-radius:6px; font-weight:600; }
    .tm-mention-self { background:linear-gradient(135deg,#ff8a6b,#ffb36b); color:#1a1c22; padding:0 6px; border-radius:8px; font-weight:700; box-shadow:0 2px 6px -2px rgba(0,0,0,0.4); }
    /* Reactions */
    .tm-reaction-bar { display:none; }
    .tm-react-chip, .tm-react-btn { font-size:12px; line-height:1; padding:4px 8px; border-radius:14px; background:rgba(255,255,255,0.12); color:#fff; cursor:pointer; user-select:none; display:inline-flex; align-items:center; gap:4px; border:1px solid rgba(255,255,255,0.18); transition:background .25s,border .25s,opacity .25s,transform .25s; }
    .tm-react-chip:hover { background:rgba(255,255,255,0.22); }
    /* Side floating + button (appears on message hover) */
    .tm-react-btn { position:absolute; top:50%; transform:translateY(-50%); width:26px; height:26px; padding:0; justify-content:center; font-weight:700; letter-spacing:.5px; opacity:0; pointer-events:none; background:rgba(40,45,60,0.85); backdrop-filter:blur(10px) saturate(180%); -webkit-backdrop-filter:blur(10px) saturate(180%); box-shadow:0 4px 14px -4px rgba(0,0,0,0.55); transition:opacity .25s,background .25s; }
    /* Show button when hovering message wrapper or bubble or button itself */
    .tm-chat-message:hover .tm-react-btn, .tm-react-btn:hover { opacity:1; pointer-events:auto; }
    /* Orientation: self (left) gets + on right side of bubble; others (right) get + on left side */
    .tm-chat-message.tm-me .tm-bubble { position:relative; }
    .tm-chat-message.tm-other .tm-bubble { position:relative; }
    .tm-chat-message.tm-me .tm-react-btn { left:100%; margin-left:8px; border-top-left-radius:8px; border-bottom-left-radius:8px; }
    .tm-chat-message.tm-other .tm-react-btn { right:100%; margin-right:8px; border-top-right-radius:8px; border-bottom-right-radius:8px; }
    .tm-react-btn:hover { background:rgba(70,80,110,0.95); }
    /* Corner reaction chips */
    .tm-reaction-corner { position:absolute; bottom:-12px; display:flex; gap:4px; align-items:flex-end; }
    .tm-chat-message.tm-me .tm-reaction-corner { right:6px; }
    .tm-chat-message.tm-other .tm-reaction-corner { left:6px; }
    .tm-reaction-corner .tm-react-chip { background:rgba(40,45,60,0.9); border:1px solid rgba(255,255,255,0.25); padding:4px 6px; font-size:11px; box-shadow:0 4px 10px -3px rgba(0,0,0,0.55); }
    .tm-reaction-corner .tm-react-chip:hover { transform:translateY(-2px); }
    .tm-react-palette { display:flex; gap:6px; padding:6px 6px 4px; background:rgba(20,24,34,0.97); backdrop-filter:blur(18px) saturate(200%); -webkit-backdrop-filter:blur(18px) saturate(200%); border:1px solid rgba(255,255,255,0.25); border-radius:12px; position:absolute; z-index:1000002; box-shadow:0 14px 36px -10px rgba(0,0,0,0.65); }
    .tm-react-emoji-option { font-size:18px; cursor:pointer; line-height:1; padding:4px 4px 2px; border-radius:8px; transition:background .2s; }
    .tm-react-emoji-option:hover { background:rgba(255,255,255,0.15); }
    .tm-react-chip-count { font-size:11px; font-weight:600; opacity:.75; }
    `);

    // Basic emotes map
    const emotes = {
        ":)": "😊",
        ":-)": "😊",
        ":(": "☹️",
        ":-(": "☹️",
        ":D": "😄",
        ":-D": "😄",
        ":P": "😛",
        ":-P": "😛",
        ";)": "😉",
        ";-)": "😉",
        "<3": "❤️",
        ":o": "😮",
        ":O": "😮",
        "B)": "😎",
        "B-)": "😎"
    };

    function parseEmotes(msg) {
        const pattern = new RegExp(Object.keys(emotes).map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join("|"), "g");
        return msg.replace(pattern, (match) => emotes[match]);
    }

    // Username color hashing (deterministic pastel-ish but distinct hues)
    const usernameColorCache = new Map();
    function hashUsername(name){
        let h = 0; for(let i=0;i<name.length;i++){ h = (h*131 + name.charCodeAt(i)) >>> 0; }
        return h;
    }
    function usernameToColor(name){
        if(usernameColorCache.has(name)) return usernameColorCache.get(name);
        const h = hashUsername(name);
        // Spread across hue wheel; avoid clustering: use golden ratio conjugate offset
        const hue = ( (h % 360) + ((h/360)%1)*222 ) % 360; // pseudo scramble
        const sat = 62 + (h % 24); // 62-85%
        const light = 52 + (h % 14); // 52-65%
        const color = `hsl(${hue.toFixed(1)}, ${sat}%, ${light}%)`;
        usernameColorCache.set(name, color);
        return color;
    }
    function usernameGradient(name){
        const base = usernameToColor(name); // hsl(h,s%,l%)
        // Slightly rotate hue and adjust lightness for second stop
        const m = /hsl\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/.exec(base);
        if(!m) return base;
        let h = parseFloat(m[1]);
        let s = m[2];
        let l = parseFloat(m[3]);
        const h2 = (h + 18) % 360;
        const l2 = Math.min(78, l + 14);
        return `linear-gradient(135deg, ${base}, hsl(${h2.toFixed(1)}, ${s}, ${l2.toFixed(1)}))`;
    }
    function ensureContrast(fgHsl){
        // Convert HSL to RGB then compute relative luminance for deciding dark/light text
        // We only need to know whether to use light overlay gradient or muted grey fallback.
        return fgHsl; // For now we rely on chosen lightness range (52-65%) which contrasts on dark bg.
    }
    // Client ID generation for dedup (double Enter) & offline queue
    function generateClientId(){
        if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
        // Fallback simple UUID v4-ish
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{
            const r = Math.random()*16|0; const v = c==='x'?r:(r&0x3|0x8); return v.toString(16);
        });
    }
    let inFlightMessage = { text:'', clientId:null, time:0 };
    const offlineQueue = []; // {clientId, username, text, createdAt, attempts}
    let flushingQueue = false;
    const recentSent = []; // track recent sent texts for self-detection heuristic

    // Create the menu element
    const menu = document.createElement("div");
    menu.id = "tm-slideout-menu";
    // Manual DOM build to satisfy strict Trusted Types CSP (e.g., YouTube)
    const titleEl = document.createElement('h2');
    titleEl.textContent = 'Conscience Stream';
    menu.appendChild(titleEl);
    const userContainer = document.createElement('div'); userContainer.id='tm-username-container';
    const usernameInputEl = document.createElement('input'); usernameInputEl.type='text'; usernameInputEl.id='tm-username-input'; usernameInputEl.placeholder='Username';
    const saveButtonEl = document.createElement('button'); saveButtonEl.id='tm-save-username-btn'; saveButtonEl.type='button'; saveButtonEl.textContent='Save';
    userContainer.appendChild(usernameInputEl); userContainer.appendChild(saveButtonEl); menu.appendChild(userContainer);
    const settingsAnchor = document.createElement('div'); settingsAnchor.id='tm-settings-anchor'; settingsAnchor.style.height='2px'; menu.appendChild(settingsAnchor);
    const chatContainerDiv = document.createElement('div'); chatContainerDiv.id='tm-chat-container'; menu.appendChild(chatContainerDiv);
    // Presence indicator (always visible). Will be updated by heuristic + optional backend /presence endpoint.
    const presenceBar = document.createElement('div');
    presenceBar.id='tm-presence-bar';
    presenceBar.style.cssText='position:absolute;top:0;left:0;right:0;height:20px;padding:2px 10px;font-size:11px;display:flex;align-items:center;gap:8px;color:#cfd6e0;opacity:.85;pointer-events:none;';
    presenceBar.textContent = 'Active: 0';
    chatContainerDiv.appendChild(presenceBar);
    const chatBoxDiv = document.createElement('div'); chatBoxDiv.id='tm-chat-box';
    chatBoxDiv.style.position='relative';
    // Input row (textarea + emoji button) for better alignment vs overlaid button
    const inputRow = document.createElement('div');
    inputRow.style.cssText='display:flex;align-items:stretch;gap:6px;width:100%;';
    const chatTextarea = document.createElement('textarea'); chatTextarea.id='tm-chat-input'; chatTextarea.placeholder='Send a message...';
    chatTextarea.style.flex='1 1 auto';
    // Remove earlier right padding hack; natural padding already set via CSS block at top
    const composeEmojiBtn = document.createElement('button');
    composeEmojiBtn.type='button';
    composeEmojiBtn.id='tm-compose-emoji-btn';
    composeEmojiBtn.textContent='😀';
    composeEmojiBtn.setAttribute('aria-label','Insert emoji');
    composeEmojiBtn.title='Insert emoji (click)';
    composeEmojiBtn.style.cssText='flex:0 0 40px;width:40px;height:40px;border:1px solid rgba(255,255,255,0.18);border-radius:12px;background:linear-gradient(140deg,rgba(110,99,255,0.32),rgba(150,133,255,0.18));color:#fff;font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px) saturate(160%);-webkit-backdrop-filter:blur(10px) saturate(160%);transition:background .25s,border-color .25s,transform .15s;box-shadow:0 2px 8px -2px rgba(0,0,0,0.55);padding:0;line-height:1;';
    composeEmojiBtn.style.alignSelf='stretch';
    composeEmojiBtn.addEventListener('mouseenter',()=>{ composeEmojiBtn.style.background='linear-gradient(140deg,rgba(130,119,255,0.55),rgba(170,153,255,0.38))'; });
    composeEmojiBtn.addEventListener('mouseleave',()=>{ composeEmojiBtn.style.background='linear-gradient(140deg,rgba(110,99,255,0.35),rgba(150,133,255,0.22))'; composeEmojiBtn.style.transform='translateY(0)'; });
    composeEmojiBtn.addEventListener('mousedown',()=>{ composeEmojiBtn.style.transform='translateY(1px)'; });
    composeEmojiBtn.addEventListener('mouseup',()=>{ composeEmojiBtn.style.transform='translateY(0)'; });
    composeEmojiBtn.addEventListener('focus',()=>{ composeEmojiBtn.style.boxShadow='0 0 0 3px rgba(127,107,255,0.45)'; });
    composeEmojiBtn.addEventListener('blur',()=>{ composeEmojiBtn.style.boxShadow='0 3px 10px -3px rgba(0,0,0,0.55)'; });
    // Send icon button
    const sendBtn = document.createElement('button');
    sendBtn.type='button';
    sendBtn.id='tm-send-btn';
    sendBtn.setAttribute('aria-label','Send message');
    sendBtn.title='Send (Enter)';
    sendBtn.innerHTML='\u27A4'; // arrow icon
    sendBtn.style.cssText='flex:0 0 40px;width:40px;height:40px;border:1px solid rgba(255,255,255,0.18);border-radius:12px;background:linear-gradient(140deg,rgba(90,150,255,0.35),rgba(130,170,255,0.20));color:#fff;font-size:18px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px) saturate(160%);-webkit-backdrop-filter:blur(10px) saturate(160%);transition:background .25s,transform .15s,opacity .25s;box-shadow:0 2px 8px -2px rgba(0,0,0,0.55);padding:0;line-height:1;';
    const sendBtnBaseBg='linear-gradient(140deg,rgba(90,150,255,0.35),rgba(130,170,255,0.20))';
    const sendBtnHoverBg='linear-gradient(140deg,rgba(110,170,255,0.55),rgba(150,190,255,0.32))';
    sendBtn.addEventListener('mouseenter',()=>{ sendBtn.style.background=sendBtnHoverBg; });
    sendBtn.addEventListener('mouseleave',()=>{ sendBtn.style.background=sendBtnBaseBg; sendBtn.style.transform='translateY(0)'; });
    sendBtn.addEventListener('mousedown',()=>{ sendBtn.style.transform='translateY(1px)'; });
    sendBtn.addEventListener('mouseup',()=>{ sendBtn.style.transform='translateY(0)'; });
    function updateSendBtnState(){
        if(chatTextarea.value.trim()){
            sendBtn.style.opacity='1';
            sendBtn.disabled=false;
        } else {
            sendBtn.style.opacity='.45';
            sendBtn.disabled=true;
        }
    }
    sendBtn.addEventListener('click',()=>{
        const val = chatTextarea.value.trim();
        if(!val) return; sendMessage(val); chatTextarea.value=''; updateSendBtnState();
    });
    chatTextarea.addEventListener('input', updateSendBtnState);
    inputRow.appendChild(chatTextarea);
    inputRow.appendChild(composeEmojiBtn);
    inputRow.appendChild(sendBtn);
    chatBoxDiv.appendChild(inputRow);
    menu.appendChild(chatBoxDiv);
    document.body.appendChild(menu);

    let isOpen = false;

    // Stable user identity (userId) independent of username; persisted via GM storage
    let userId = await GM.getValue('tmUserId', null);
    if(!userId){
        userId = (window.crypto && crypto.randomUUID)? crypto.randomUUID(): 'uid-'+Date.now()+'-'+Math.random().toString(16).slice(2);
        await GM.setValue('tmUserId', userId);
    }

    // Load username from GM storage
    const usernameInput = menu.querySelector("#tm-username-input");
    let username = await GM.getValue("tmChatUsername", "Anonymous");
    usernameInput.value = username;
    function normalizedName(v){ return (v||'').trim().toLowerCase(); }
    let usernameLower = normalizedName(username);

    const saveBtn = menu.querySelector("#tm-save-username-btn");
    saveBtn.addEventListener("click", async () => {
        const prev = username;
        username = usernameInput.value.trim() || "Anonymous";
        usernameLower = normalizedName(username);
        await GM.setValue("tmChatUsername", username);
        if(prev !== username){
            try { await httpRequest('POST', `${BACKEND_URL}/users/rename`, { userId, username }); } catch {}
            const notice = `* ${prev} is now known as ${username}`;
            sendMessage(notice);
            document.querySelectorAll(`.tm-chat-message[data-user-id="${userId}"] .tm-username`).forEach(el=>{
                const txt = el.textContent||''; const selfTag = txt.includes('• you');
                el.textContent = username + (selfTag? ' • you':'');
            });
        } else {
            showStatus('Username unchanged','info',1800);
        }
    });

    // Preferences & settings popup
    let notificationsEnabled = await GM.getValue('tmNotificationsEnabled', true);
    let notificationSoundEnabled = await GM.getValue('tmNotificationSoundEnabled', true);
    let showStartupHint = await GM.getValue('tmShowStartupHint', true);
    let reducedMotion = await GM.getValue('tmReducedMotion', false);

    (function buildSettings(){
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'tm-settings-btn';
        settingsBtn.type = 'button';
        settingsBtn.setAttribute('aria-label','Chat settings');
    settingsBtn.textContent = '⚙️';
        settingsBtn.style.cssText='position:absolute;top:10px;right:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#f5f7fa;width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:background .25s,border .25s;z-index:3;';
        settingsBtn.addEventListener('mouseenter', ()=>{ settingsBtn.style.background='rgba(255,255,255,0.15)'; });
        settingsBtn.addEventListener('mouseleave', ()=>{ settingsBtn.style.background='rgba(255,255,255,0.08)'; });
        menu.appendChild(settingsBtn);

        const popup = document.createElement('div');
        popup.id = 'tm-settings-popup';
        popup.style.cssText='position:absolute;top:54px;right:16px;width:270px;padding:14px 16px;display:none;flex-direction:column;gap:10px;background:rgba(25,28,40,0.92);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border:1px solid rgba(255,255,255,0.12);border-radius:14px;box-shadow:0 10px 28px -8px rgba(0,0,0,0.55);font-size:12px;z-index:1000000;';
        // Build popup content manually
        const header = document.createElement('div');
        header.style.cssText='font-size:13px;font-weight:600;letter-spacing:.5px;opacity:.85;display:flex;align-items:center;justify-content:space-between;';
        const headerSpan = document.createElement('span'); headerSpan.style.userSelect='none'; headerSpan.textContent='Options';
        const closeBtn = document.createElement('button'); closeBtn.id='tm-close-settings'; closeBtn.style.cssText='background:transparent;border:0;color:#c7ced7;font-size:18px;cursor:pointer;line-height:1;padding:2px 6px;border-radius:8px;'; closeBtn.textContent='×';
        header.appendChild(headerSpan); header.appendChild(closeBtn); popup.appendChild(header);
        function addCheckbox(id,label){ const lab=document.createElement('label'); lab.style.cssText='display:flex;align-items:center;gap:8px;cursor:pointer;'; const cb=document.createElement('input'); cb.type='checkbox'; cb.id=id; cb.style.cssText='width:14px;height:14px;cursor:pointer;'; const span=document.createElement('span'); span.style.flex='1'; span.textContent=label; lab.appendChild(cb); lab.appendChild(span); popup.appendChild(lab); return cb; }
        const notifCb = addCheckbox('tm-enable-notifications','Show pop-up notifications');
        const soundCb = addCheckbox('tm-enable-sound','Play notification sound');
        const hintCb = addCheckbox('tm-show-startup-hint','Show startup hint');
    const reducedMotionCb = addCheckbox('tm-reduced-motion','Reduced motion');
        const hintInfo = document.createElement('div'); hintInfo.style.cssText='font-size:11px;line-height:1.4;opacity:.6;'; hintInfo.textContent='Startup hint shows a toast explaining the hotkey (Ctrl+Shift+;).'; popup.appendChild(hintInfo);
        menu.appendChild(popup);

    // Elements already created above
        notifCb.checked = notificationsEnabled;
        soundCb.checked = notificationSoundEnabled;
        hintCb.checked = showStartupHint;
    reducedMotionCb.checked = reducedMotion;

        notifCb.addEventListener('change', async ()=>{ notificationsEnabled = notifCb.checked; await GM.setValue('tmNotificationsEnabled', notificationsEnabled); showStatus('Notifications ' + (notificationsEnabled? 'enabled':'disabled'),'info',2000); });
        soundCb.addEventListener('change', async ()=>{ notificationSoundEnabled = soundCb.checked; await GM.setValue('tmNotificationSoundEnabled', notificationSoundEnabled); showStatus('Sound ' + (notificationSoundEnabled? 'enabled':'disabled'),'info',2000); });
        hintCb.addEventListener('change', async ()=>{ showStartupHint = hintCb.checked; await GM.setValue('tmShowStartupHint', showStartupHint); showStatus('Startup hint ' + (showStartupHint? 'enabled':'disabled'),'info',2000); });
    reducedMotionCb.addEventListener('change', async ()=>{ reducedMotion = reducedMotionCb.checked; await GM.setValue('tmReducedMotion', reducedMotion); applyReducedMotion(); showStatus('Reduced motion ' + (reducedMotion? 'on':'off'),'info',2000); });

        function togglePopup(){ popup.style.display = (popup.style.display==='flex')?'none':'flex'; }
        settingsBtn.addEventListener('click', (e)=>{ e.stopPropagation(); togglePopup(); });
    closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); popup.style.display='none'; });
        document.addEventListener('mousedown', (e)=>{ if(!popup.contains(e.target) && e.target !== settingsBtn){ popup.style.display='none'; } });
    })();

    // Function to toggle menu
    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            menu.classList.add("active");
            // Focus chat input shortly after opening to ensure element is rendered
            setTimeout(()=>{ try { chatInput.focus(); chatInput.selectionStart = chatInput.value.length; } catch {} }, 30);
        } else {
            menu.classList.remove("active");
        }
    }

    function applyReducedMotion(){
        if(reducedMotion){
            document.documentElement.classList.add('tm-reduced-motion');
        } else {
            document.documentElement.classList.remove('tm-reduced-motion');
        }
    }
    applyReducedMotion();

    // Close panel on outside click (ignore internal floating palettes/toasts)
    document.addEventListener('mousedown', (e) => {
        if(!isOpen) return;
        if(menu.contains(e.target)) return;
        if(e.target.closest && (
            e.target.closest('.tm-toast') ||
            e.target.closest('.tm-react-palette') ||
            e.target.closest('.tm-compose-emoji-palette')
        )) return;
        isOpen = false;
        menu.classList.remove('active');
    });

    // Keyboard shortcut: Ctrl+Shift+; (semicolon). Shift+; produces ':' on many layouts, so check code & both keys.
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && (e.code === "Semicolon" || e.key === ";" || e.key === ":")) {
            e.preventDefault();
            toggleMenu();
        }
        if(e.key === 'Escape' && isOpen){
            e.preventDefault();
            isOpen = false; menu.classList.remove('active');
        }
    });

    // Outside click close disabled: panel persists until hotkey toggle

    // Chat handling + backend integration (HTTP polling)
    const chatContainer = menu.querySelector("#tm-chat-container");
    const chatInput = menu.querySelector("#tm-chat-input");
    const chatBox = menu.querySelector('#tm-chat-box');
    // Jump to latest button (outside scroll area, positioned relative to panel)
    const jumpBtn = document.createElement('button');
    jumpBtn.id = 'tm-jump-latest-btn';
    jumpBtn.textContent = 'Jump to latest';
    menu.appendChild(jumpBtn);
    // New messages badge (appears when new messages arrive while user idle & slightly above bottom)
    const newMsgBadge = document.createElement('div');
    newMsgBadge.id = 'tm-new-msg-badge';
    newMsgBadge.textContent = 'New messages below';
    menu.appendChild(newMsgBadge);
    function updateJumpPosition(){
        // Place button just above chat box with 12px gap
        if (!chatBox) return;
        const boxHeight = chatBox.getBoundingClientRect().height;
        jumpBtn.style.bottom = (boxHeight + 12) + 'px';
        newMsgBadge.style.bottom = (boxHeight + 12) + 'px';
    }

    const BACKEND_URL = window.TM_CHAT_BACKEND || "http://157.245.39.77:9092"; // allow override
    // lastTimestamp tracks latest seen update time (created or modified) from server
    let lastTimestamp = 0;
    let polling = false;
    let backoff = 3000; // start 3s
    const maxBackoff = 30000;
    let stopped = false;
    let initialHistoryLoaded = false; // suppress notifications until first poll finishes
    // Track messages we've already rendered to avoid duplicate DOM entries & notifications
    const seenMessages = new Set();
    let pendingNewMessages = false; // unseen messages below viewport
    const clientIdToServerId = new Map();
    function messageKey(m){
        if(!m) return '';
        if(m.id) return 'id:'+m.id;
        if(m.clientId && clientIdToServerId.has(m.clientId)) return 'id:'+clientIdToServerId.get(m.clientId);
        if(m.clientId) return 'cid:'+m.clientId;
        return `${m.createdAt}|${m.username}|${m.text}`;
    }

    function atBottom() {
        return (chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight) < 8;
    }
    function nearBottom(){
        // Within 300px of bottom considered near
        return (chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight) < 300;
    }
    function distanceToBottom(){
        return chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
    }
    let lastUserScrollTime = Date.now();
    const autoStickIdleMs = 4000; // user idle threshold for auto-scrolling when near bottom
    const closeBottomPx = 180; // if within this distance show subtle badge instead of jump button
    let suppressScrollMark = false;
    function markUserScroll(){
        if(suppressScrollMark) return; // ignore programmatic scrolls
        lastUserScrollTime = Date.now();
    }
    function scrollToBottom(behavior='smooth'){
        if(reducedMotion) behavior = 'auto';
        suppressScrollMark = true;
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior });
        // allow next tick to re-enable user scroll mark
        setTimeout(()=>{ suppressScrollMark = false; }, 60);
    }
    function showNewMsgBadge(){
        if(!pendingNewMessages) return;
        jumpBtn.classList.remove('active');
        newMsgBadge.classList.add('active');
    }
    function hideNewMsgBadge(){
        newMsgBadge.classList.remove('active');
    }
    function updateJumpBtn() {
        if(atBottom()){
            jumpBtn.classList.remove('active');
            hideNewMsgBadge();
            pendingNewMessages = false;
            return;
        }
        const dist = distanceToBottom();
        if(dist < closeBottomPx){
            if(pendingNewMessages){
                showNewMsgBadge();
            } else {
                hideNewMsgBadge();
                jumpBtn.classList.add('active');
            }
        } else {
            hideNewMsgBadge();
            jumpBtn.classList.add('active');
        }
    }
    function renderMessage(m, highlightSelf=false, fragmentTarget=null, suppressNotify=false, allowUpdate=false) {
        const key = messageKey(m);
        const already = seenMessages.has(key);
        if(already && !allowUpdate) return; // skip duplicate if not updating
        if(!already) seenMessages.add(key);
            let existingWrapper = chatContainer.querySelector(`[data-msg-key="${CSS.escape(key)}"]`);
            if(already) existingWrapper = chatContainer.querySelector(`[data-msg-key="${CSS.escape(key)}"]`);
        const wrapper = document.createElement("div");
        wrapper.className = `tm-chat-message ${highlightSelf? 'tm-me':'tm-other'}`;
    wrapper.dataset.msgKey = key;
    if(m.userId) wrapper.dataset.userId = m.userId;
        const safeUser = m.username.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
        const safeText = m.text.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
        const parsed = parseEmotes(safeText);
        const userColor = !highlightSelf ? ensureContrast(usernameToColor(m.username)) : null;
        const isAction = parsed.startsWith('* ');
        const userDiv = document.createElement('div');
        userDiv.className='tm-username';
        if(!highlightSelf && userColor) userDiv.style.color = userColor;
        userDiv.textContent = safeUser + (highlightSelf ? ' • you' : '');
        const bubble = document.createElement('div');
        bubble.className='tm-bubble';
        if(!highlightSelf){
            // Apply gradient background + subtle border tint for others dynamically
            const grad = usernameGradient(m.username);
            bubble.style.background = grad;
            bubble.style.border = '1px solid rgba(255,255,255,0.12)';
            bubble.style.color = '#fff';
        }
        if(highlightSelf && rainbowMode){
            bubble.classList.add('tm-rainbow-bubble');
            bubble.style.background='transparent';
            bubble.style.border='1px solid rgba(255,255,255,0.18)';
        }
        if(isAction){ bubble.style.fontStyle='italic'; bubble.style.opacity='.9'; }
        if(m.offlineQueued){
            bubble.style.opacity='.7';
            bubble.style.borderStyle='dashed';
        }
        // Timestamp
        const created = m.createdAt ? new Date(m.createdAt) : new Date();
        const hh = created.getHours().toString().padStart(2,'0');
        const mm = created.getMinutes().toString().padStart(2,'0');
        const timeLabel = `${hh}:${mm}`;
        const timeSpan = document.createElement('span');
        timeSpan.textContent = timeLabel;
        timeSpan.title = created.toISOString();
        timeSpan.style.cssText='font-size:10px;opacity:.55;margin-left:8px;white-space:nowrap;align-self:flex-end;font-weight:500;';
        // Message body wrapper to place timestamp inline (flex)
        const msgLine = document.createElement('div');
        msgLine.style.cssText='display:flex;align-items:flex-end;gap:4px;flex-wrap:wrap;';
        const msgTextSpan = document.createElement('span');
        // Mention highlighting: split on @word boundaries
        const mentionRegex = /@([A-Za-z0-9_]{2,24})/g;
        let lastIndex = 0; let match;
        while((match = mentionRegex.exec(parsed))){
            const start = match.index; const end = start + match[0].length;
            if(start > lastIndex){
                const chunk = document.createElement('span'); chunk.textContent = parsed.slice(lastIndex,start); msgTextSpan.appendChild(chunk);
            }
            const mentionSpan = document.createElement('span');
            const mentioned = match[1];
            const isSelf = mentioned.toLowerCase() === username.toLowerCase();
            mentionSpan.className = isSelf ? 'tm-mention-self' : 'tm-mention';
            mentionSpan.textContent = match[0];
            msgTextSpan.appendChild(mentionSpan);
            lastIndex = end;
        }
        if(lastIndex < parsed.length){
            const tail = document.createElement('span'); tail.textContent = parsed.slice(lastIndex); msgTextSpan.appendChild(tail);
        }
        msgLine.appendChild(msgTextSpan);
        msgLine.appendChild(timeSpan);
        if(m.offlineQueued){
            const queuedSpan = document.createElement('span');
            queuedSpan.textContent='(queued)';
            queuedSpan.style.cssText='font-size:10px;opacity:.55;margin-left:4px;';
            msgLine.appendChild(queuedSpan);
        }
        bubble.appendChild(msgLine);

    // Floating add reaction button (inside bubble so hover over bubble keeps it visible)
    const addBtn = document.createElement('div');
    addBtn.className='tm-react-btn';
    addBtn.textContent='+';
    bubble.appendChild(addBtn);
    // Corner reaction chips container
    const cornerHolder = document.createElement('div');
    cornerHolder.className='tm-reaction-corner';
    bubble.appendChild(cornerHolder);

        wrapper.appendChild(userDiv);
        wrapper.appendChild(bubble);
        if(already && existingWrapper){
            // Replace bubble while preserving scroll position roughly
            existingWrapper.replaceWith(wrapper);
        } else {
            (fragmentTarget || chatContainer).appendChild(wrapper);
        }
        if(!highlightSelf && !suppressNotify) maybeNotifyNewMessage(m);

        // Auto-scroll / indicator logic
        const now = Date.now();
        const idle = (now - lastUserScrollTime) > autoStickIdleMs;
        const dist = distanceToBottom();
        if(highlightSelf || atBottom() || (nearBottom() && idle)){
            scrollToBottom('smooth');
            hideNewMsgBadge();
            pendingNewMessages = false;
        } else {
            if(dist < closeBottomPx){
                pendingNewMessages = true;
                showNewMsgBadge();
            } else {
                updateJumpBtn();
            }
        }
        // updatePresence() removed in backend-authoritative presence refactor; call suppressed
    }
    // --- Presence Tracking (backend authoritative) -------------------------
    async function presenceHeartbeat(){ try { await httpRequest('POST', `${BACKEND_URL}/presence/heartbeat`, { userId }); } catch {} }
    async function presencePoll(){ try { const res = await httpRequest('GET', `${BACKEND_URL}/presence/active`); if(res.ok){ const data = await res.json(); presenceBar.textContent = `Active: ${typeof data.count==='number'?data.count:0}`; } } catch {} }
    setInterval(presenceHeartbeat, 15000); // heartbeat every 15s (server TTL 30s)
    setInterval(presencePoll, 10000); // poll count every 10s
    presenceHeartbeat(); presencePoll();

    // Local reaction state: key -> { emoji -> count, selfSet: Set(emoji) }
    const reactionState = new Map();
    const defaultEmojis = ['👍','❤️','😂','🔥','😮','🎉'];
    function ensureReactionBucket(msgKey){
        if(!reactionState.has(msgKey)){
            reactionState.set(msgKey, { counts: new Map(), self: new Set() });
        }
        return reactionState.get(msgKey);
    }
    function renderReactionsForMessage(msgKey){
        const bucket = reactionState.get(msgKey);
        const wrapper = chatContainer.querySelector(`[data-msg-key="${CSS.escape(msgKey)}"]`);
        if(!wrapper) return;
        const bubble = wrapper.querySelector('.tm-bubble');
        if(!bubble) return;
        const corner = bubble.querySelector('.tm-reaction-corner');
        if(!corner) return;
        corner.innerHTML='';
        if(!bucket || bucket.counts.size===0) return;
        for(const [emoji,count] of bucket.counts.entries()){
            const chip = document.createElement('div');
            chip.className='tm-react-chip';
            chip.dataset.emoji=emoji;
            chip.textContent=emoji;
            const span = document.createElement('span'); span.className='tm-react-chip-count'; span.textContent=String(count);
            chip.appendChild(span);
            if(bucket.self.has(emoji)) chip.style.background='rgba(90,110,190,0.6)';
            corner.appendChild(chip);
        }
    }
    async function toggleReaction(msgKey, emoji, sendNetwork){
        const bucket = ensureReactionBucket(msgKey);
        const alreadyHad = bucket.self.has(emoji);
        if(alreadyHad){
            // Remove current reaction (toggle off)
            bucket.self.delete(emoji);
            bucket.counts.set(emoji, Math.max(0,(bucket.counts.get(emoji)||1)-1));
            if(bucket.counts.get(emoji)===0) bucket.counts.delete(emoji);
        } else {
            // Enforce single reaction: remove any existing self reactions first
            for(const e of Array.from(bucket.self)){
                bucket.self.delete(e);
                const cur = bucket.counts.get(e) || 0;
                if(cur <= 1) bucket.counts.delete(e); else bucket.counts.set(e, cur-1);
            }
            bucket.self.add(emoji);
            bucket.counts.set(emoji, (bucket.counts.get(emoji)||0)+1);
        }
        renderReactionsForMessage(msgKey);
        if(sendNetwork){
            let messageId='';
            if(msgKey.startsWith('id:')) messageId = msgKey.slice(3);
            else if(msgKey.startsWith('cid:')) {
                const provisional = msgKey.slice(4);
                if(clientIdToServerId.has(provisional)) messageId = clientIdToServerId.get(provisional);
            }
            if(!messageId) return; // wait until server id known
            try { await httpRequest('POST', `${BACKEND_URL}/reactions`, { messageId, emoji, username }); } catch {}
        }
    }
    // Event delegation for reactions
    chatContainer.addEventListener('click', (e)=>{
        const chip = e.target.closest('.tm-react-chip');
        if(chip){
            const wrapper = chip.closest('.tm-chat-message');
            if(!wrapper) return; const msgKey = wrapper.dataset.msgKey; const emoji = chip.dataset.emoji;
            toggleReaction(msgKey, emoji, true);
            return;
        }
        const addBtn = e.target.closest('.tm-react-btn');
        if(addBtn){
            const wrapper = addBtn.closest('.tm-chat-message');
            if(!wrapper) return; const msgKey = wrapper.dataset.msgKey;
            showReactionPalette(addBtn, msgKey);
        }
    });
    function showReactionPalette(anchorEl, msgKey){
        hideReactionPalette();
        const palette = document.createElement('div');
        palette.className='tm-react-palette';
        defaultEmojis.forEach(em=>{
            const opt = document.createElement('div'); opt.className='tm-react-emoji-option'; opt.textContent=em; opt.dataset.emoji=em; palette.appendChild(opt);
        });
        document.body.appendChild(palette);
        const rect = anchorEl.getBoundingClientRect();
        // Position slightly above and aligned right to the button
        requestAnimationFrame(()=>{
            const palRect = palette.getBoundingClientRect();
            const top = window.scrollY + rect.top - palRect.height - 8;
            const left = Math.min(window.scrollX + rect.right - palRect.width, window.scrollX + rect.left);
            palette.style.top = Math.max(4, top) + 'px';
            palette.style.left = Math.max(4, left) + 'px';
        });
        const handler = (ev)=>{
            if(ev.target.classList && ev.target.classList.contains('tm-react-emoji-option')){
                const emoji = ev.target.dataset.emoji; toggleReaction(msgKey, emoji, true); hideReactionPalette();
            } else if(!palette.contains(ev.target)){
                hideReactionPalette();
            }
        };
        setTimeout(()=>{ document.addEventListener('mousedown', handler, { once:true }); },0);
        palette.dataset.handler='1';
    }
    function hideReactionPalette(){
        const existing = document.querySelector('.tm-react-palette');
        if(existing) existing.remove();
    }

    function httpRequest(method, url, jsonBody) {
        return new Promise((resolve, reject) => {
            const doFetchFallback = () => {
                fetch(url, {
                    method,
                    headers: jsonBody ? { 'Content-Type': 'application/json' } : {},
                    body: jsonBody ? JSON.stringify(jsonBody) : undefined,
                }).then(resp => resolve(resp)).catch(err => reject(err));
            };
            if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
                try {
                    GM.xmlHttpRequest({
                        method,
                        url,
                        headers: jsonBody ? { 'Content-Type': 'application/json' } : {},
                        data: jsonBody ? JSON.stringify(jsonBody) : undefined,
                        onload: (resp) => {
                            resolve({
                                ok: resp.status >=200 && resp.status <300,
                                status: resp.status,
                                json: () => { try { return JSON.parse(resp.responseText); } catch { return {}; } },
                                text: () => resp.responseText
                            });
                        },
                        onerror: () => {
                            console.warn('[tm-chat] GM.xmlHttpRequest network error, falling back to fetch', method, url);
                            doFetchFallback();
                        },
                        ontimeout: () => {
                            console.warn('[tm-chat] GM.xmlHttpRequest timeout, falling back to fetch', method, url);
                            doFetchFallback();
                        }
                    });
                } catch(err){
                    console.warn('[tm-chat] GM.xmlHttpRequest threw, using fetch fallback', err);
                    doFetchFallback();
                }
            } else {
                doFetchFallback();
            }
        });
    }

    // Lightweight ephemeral status banner
    let statusTimer = null;
    function showStatus(msg, kind='info', timeout=4000){
        let el = document.getElementById('tm-status-banner');
        if(!el){
            el = document.createElement('div');
            el.id = 'tm-status-banner';
            el.style.cssText = 'position:absolute;left:12px;right:12px;bottom:140px;z-index:3;padding:10px 14px;border-radius:12px;font-size:12px;font-weight:600;letter-spacing:.4px;display:flex;align-items:center;gap:8px;backdrop-filter:blur(10px) saturate(160%);-webkit-backdrop-filter:blur(10px) saturate(160%);box-shadow:0 6px 18px -4px rgba(0,0,0,.45);transition:opacity .3s,transform .3s;opacity:0;transform:translateY(6px);';
            menu.appendChild(el);
        }
        const colors = {
            info: 'linear-gradient(135deg,rgba(90,110,190,.85),rgba(110,140,230,.85))',
            warn: 'linear-gradient(135deg,rgba(190,140,60,.9),rgba(230,170,90,.9))',
            error:'linear-gradient(135deg,rgba(190,70,70,.92),rgba(230,100,100,.9))'
        };
        el.style.background = colors[kind] || colors.info;
        el.textContent = msg;
        requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; });
        if(statusTimer) clearTimeout(statusTimer);
        statusTimer = setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(6px)'; }, timeout);
    }

    // Toast notifications (bottom-right when panel closed)
    let toastQueue = [];
    let toastActive = false;
    // Notification chime: use Web Audio API for higher reliability across browsers (unlock after user gesture)
    let audioCtx = null;
    let audioUnlocked = false;
    let pendingChime = false; // if a notification arrives before unlock
    let lastChimeTime = 0;
    const chimeMinIntervalMs = 4000; // throttle interval
    function unlockAudio(){
        if(audioUnlocked) return;
        try {
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            const buf = audioCtx.createBuffer(1, 1, 22050); // silent buffer
            const src = audioCtx.createBufferSource();
            src.buffer = buf; src.connect(audioCtx.destination); src.start(0);
            audioUnlocked = true;
            document.removeEventListener('pointerdown', unlockAudio, true);
            document.removeEventListener('keydown', unlockAudio, true);
            if(pendingChime){
                pendingChime = false;
                // play queued chime now that we're unlocked
                setTimeout(()=>playChime(), 0);
            }
        } catch {}
    }
    // Use pointerdown which fires earlier than click and covers touch + mouse
    document.addEventListener('pointerdown', unlockAudio, true);
    document.addEventListener('keydown', unlockAudio, true);
    function playChime(){
        try {
            const nowMs = Date.now();
            if(nowMs - lastChimeTime < chimeMinIntervalMs){
                // Too soon; skip this sound but still allow visual toast
                return;
            }
            if(!audioUnlocked){ pendingChime = true; return; }
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            if(audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.linearRampToValueAtTime(1320, now + 0.18); // quick up-chirp
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.4);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.42);
            lastChimeTime = nowMs;
        } catch {}
    }
    function maybeNotifyNewMessage(m){
        if(!notificationsEnabled) return;
        if(isOpen) return; // panel visible
        toastQueue.push({user:m.username, text:m.text, system:false});
        if(notificationSoundEnabled) playChime();
        if(!toastActive) showNextToast();
    }
    function showNextToast(){
        if(!toastQueue.length){ toastActive=false; return; }
        toastActive=true;
        const item = toastQueue.shift();
        let t = document.createElement('div');
        t.className='tm-toast';
        t.style.cssText='position:fixed;bottom:18px;right:18px;width:300px;max-width:300px;min-height:86px;box-sizing:border-box;background:'+(item.system? 'linear-gradient(135deg,#42506a,#2c3444)':'rgba(25,28,40,0.88)')+';backdrop-filter:blur(14px) saturate(180%);-webkit-backdrop-filter:blur(14px) saturate(180%);color:#fff;padding:12px 16px;border-radius:14px;font-size:13px;line-height:1.35;box-shadow:0 8px 24px -6px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:6px;z-index:999998;opacity:0;transform:translateY(8px);transition:opacity .35s,transform .35s;cursor:pointer;border:1px solid rgba(255,255,255,0.12);overflow:hidden;';
    const safeUser = (item.user||'').replace(/[&<>]/g,c=>({'&':'&','<':'<','>':'>'}[c]));
    const safeText = (item.text||'').replace(/[&<>]/g,c=>({'&':'&','<':'<','>':'>'}[c]));
    const uDiv = document.createElement('div');
    uDiv.style.cssText='font-weight:600;font-size:11px;letter-spacing:.5px;opacity:.85;text-transform:uppercase;';
    uDiv.textContent = safeUser;
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText='font-size:13px;';
    msgDiv.textContent = safeText;
    t.appendChild(uDiv); t.appendChild(msgDiv);
        document.body.appendChild(t);
        requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateY(0)'; });
        let hideTimer = setTimeout(()=>{ hideToast(t); }, 5000);
        t.addEventListener('click', ()=>{ hideToast(t); toggleMenu(); });
        function hideToast(el){
            el.style.opacity='0'; el.style.transform='translateY(8px)';
            setTimeout(()=>{ el.remove(); showNextToast(); }, 380);
        }
    }

    // System toast (startup hint)
    function showStartupHintToast(){
        if(!notificationsEnabled) return;
        if(!showStartupHint) return;
        toastQueue.push({user:'Tip', text:'Press Ctrl+Shift+; to open the chat panel.', system:true});
        if(notificationSoundEnabled) playChime();
        if(!toastActive) showNextToast();
    }

    async function sendMessage(text) {
        try {
            // Slash command preprocessing
            if(text.startsWith('/')) {
                const trimmed = text.trim();
                const firstSpace = trimmed.indexOf(' ');
                const cmd = (firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace)).toLowerCase();
                const rest = firstSpace === -1 ? '' : trimmed.slice(firstSpace+1);
                switch(cmd){
                    case '/help':
                        showStatus('Commands: /me <action>, /shrug <text>, /rainbow, /help','info',6000);
                        return; // do not send to server
                    case '/me':
                        if(!rest){ showStatus('Usage: /me <action>','warn',2500); return; }
                        text = `* ${username} ${rest}`;
                        break;
                    case '/shrug':
                        text = (rest? rest + ' ' : '') + '¯\\_(ツ)_/¯';
                        break;
                    case '/rainbow':
                        enableRainbowMode();
                        showStatus('Rainbow mode on for 60s','info',2500);
                        return;
                    default:
                        showStatus('Unknown command. Try /help','warn',2500);
                        return;
                }
            }
            // In-flight dedup: if same text & still sending within 1500ms, ignore duplicate trigger
            const now = Date.now();
            if(inFlightMessage.text === text && (now - inFlightMessage.time) < 1500){
                return; // duplicate rapid send
            }
            const clientId = generateClientId();
        recentSent.push({text, t: Date.now()});
        if(recentSent.length>25) recentSent.splice(0, recentSent.length-25);
            inFlightMessage = { text, clientId, time: now };
            const res = await httpRequest('POST', `${BACKEND_URL}/messages`, { userId, username, text });
            if (!res.ok) {
                let bodyText = await res.text();
                let err = {};
                try { err = JSON.parse(bodyText); } catch {}
                const code = res.status;
                const reason = (err && err.error) ? err.error : 'send failed';
                let friendly = '';
                const now = Date.now();
                switch(reason){
                    case 'rate limit':
                        // per-IP: 5 / 5s
                        friendly = 'Too fast (IP limit). Wait ~5s and try again.'; break;
                    case 'user rate limit':
                        friendly = 'You sent too many messages. Cooldown about 30s.'; break;
                    case 'duplicate message':
                        friendly = 'Duplicate blocked. Change it or wait ~12s.'; break;
                    case 'too many urls':
                        friendly = 'Too many links (max 3). Remove some and resend.'; break;
                    case 'empty message':
                        friendly = 'Cannot send an empty message.'; break;
                    default:
                        friendly = 'Send failed ('+reason+').';
                }
                showStatus(friendly, (code===400||code===409)?'warn':'error');
                console.warn('Send failed', code, reason);
                // Non-network error: clear in-flight (avoid blocking future sends)
                inFlightMessage = { text:'', clientId:null, time:0 };
            } else {
                const data = await res.json();
                const m = data.message;
                if (m && m.createdAt) {
                    if (m.createdAt > lastTimestamp) lastTimestamp = m.createdAt;
                    if(m.id) clientIdToServerId.set(clientId, m.id);
                    m.clientId = clientId; // retain provisional reference
                    renderMessage(m, true);
                }
                inFlightMessage = { text:'', clientId:null, time:0 };
            }
        } catch (e) {
            // Network-level error (no HTTP response). Probe /health to differentiate backend down vs endpoint-specific failure.
            console.warn('[tm-chat] send network error', e);
            let backendReachable = false;
            try {
                const probe = await httpRequest('GET', `${BACKEND_URL}/health`);
                backendReachable = probe && probe.ok;
            } catch {}
            if(!backendReachable){
                const queued = { clientId: inFlightMessage.clientId || generateClientId(), username, text, createdAt: Date.now(), offlineQueued:true, attempts:0 };
                offlineQueue.push(queued);
                renderMessage(queued, true);
                showStatus('Offline: message queued ('+offlineQueue.length+')','warn',4000);
            } else {
                showStatus('Send failed (network/CORS). Check console.','error',4000);
            }
            inFlightMessage = { text:'', clientId:null, time:0 };
        }
    }

    async function flushOfflineQueue(){
        if(flushingQueue || !offlineQueue.length) return;
        flushingQueue = true;
        try {
            for(let i=0;i<offlineQueue.length;i++){
                const item = offlineQueue[i];
                const res = await httpRequest('POST', `${BACKEND_URL}/messages`, { userId, username:item.username, text:item.text });
                if(res.ok){
                    // Replace queued placeholder styling by re-rendering message with same key suppressed
                    const data = await res.json();
                    const m = data.message || { username:item.username, text:item.text, createdAt: Date.now(), clientId:item.clientId };
                    if(m.id) clientIdToServerId.set(item.clientId, m.id);
                    m.clientId = item.clientId;
                    renderMessage(m, m.username===username, null, true); // suppress notify (already saw)
                    renderReactionsForMessage(messageKey(m));
                    offlineQueue.splice(i,1); i--;
                } else {
                    item.attempts++;
                    if(item.attempts > 5){
                        showStatus('Failed to send queued message after retries','error',4000);
                        offlineQueue.splice(i,1); i--;
                    }
                }
                await new Promise(r=>setTimeout(r, 350)); // small spacing to avoid rate limits
            }
            if(!offlineQueue.length){
                showStatus('All queued messages sent','info',2000);
            }
        } catch(err){
            // stay queued
        } finally {
            flushingQueue = false;
        }
    }

    // Rainbow mode state
    let rainbowMode = false;
    let rainbowTimer = null;
    function enableRainbowMode(){
        rainbowMode = true;
        if(rainbowTimer) clearTimeout(rainbowTimer);
        rainbowTimer = setTimeout(()=>{ rainbowMode = false; }, 60000); // 60s
    }

    async function pollMessages(){
        if(polling || stopped) return;
        polling = true;
        try {
            const res = await httpRequest('GET', `${BACKEND_URL}/messages?since=${lastTimestamp}`);
            if(res.ok){
                const data = await res.json();
                const messages = data.messages || [];
                if(messages.length){
                    // Build fragment for performance
                    const wasAtBottom = atBottom();
                    const idle = (Date.now() - lastUserScrollTime) > autoStickIdleMs;
                    const autoStickCandidate = wasAtBottom || (nearBottom() && idle);
                    const frag = document.createDocumentFragment();
                    for(const m of messages){
                        // Determine server update time (modifiedAt preferred)
                        const updatedAt = m.modifiedAt && m.modifiedAt > m.createdAt ? m.modifiedAt : m.createdAt;
                        if(updatedAt && updatedAt > lastTimestamp) lastTimestamp = updatedAt;
                        // markUserActive() removed (server authoritative presence); no-op
                        let isSelf = (m.userId && m.userId === userId) || false;
                        if(!isSelf && !m.userId){
                            isSelf = normalizedName(m.username) === usernameLower;
                            if(!isSelf){
                                const nowT = Date.now();
                                for(let i=recentSent.length-1;i>=0;i--){
                                    const rs = recentSent[i];
                                    if(nowT - rs.t > 5000) break;
                                    if(rs.text === m.text){ isSelf = true; break; }
                                }
                            }
                        }
                        const key = messageKey(m);
                        const already = seenMessages.has(key);
                        // Render (allow update path to replace existing DOM and not notify)
                        renderMessage(m, isSelf, frag, (!initialHistoryLoaded) || already, already);
                        // Merge reaction summaries
                        try {
                            const rx = m.reactions || m.Reactions;
                            if(Array.isArray(rx)){
                                const bucket = ensureReactionBucket(key);
                                // Overwrite counts from server
                                bucket.counts.clear();
                                for(const r of rx){
                                    if(!r) continue; const e = r.emoji || r.Emoji || r.E || r.e; const c = r.count || r.Count || r.c;
                                    if(e && typeof c === 'number' && c>0) bucket.counts.set(e, c);
                                }
                                // If we previously thought we reacted but server count says otherwise (e.g., lost due to server reject), adjust self set
                                for(const e of Array.from(bucket.self)){
                                    if(!bucket.counts.has(e)) bucket.self.delete(e);
                                }
                                renderReactionsForMessage(key);
                            }
                        } catch {}
                    }
                    chatContainer.appendChild(frag);
                    if(autoStickCandidate){
                        scrollToBottom('auto');
                        hideNewMsgBadge();
                        pendingNewMessages = false;
                    } else if(!wasAtBottom){
                        const dist = distanceToBottom();
                        if(dist < closeBottomPx){
                            pendingNewMessages = true;
                            showNewMsgBadge();
                        } else {
                            updateJumpBtn();
                        }
                    }
                    // updatePresence() removed
                }
                // After first successful history load, enable notifications
                if(!initialHistoryLoaded){
                    initialHistoryLoaded = true;
                }
                // After a successful poll, try flushing any offline queued messages
                if(initialHistoryLoaded && offlineQueue.length){
                    flushOfflineQueue();
                }
                // updatePresence() removed
                backoff = 3000; // reset backoff on success
            } else {
                console.warn('Poll failed status', res.status);
                backoff = Math.min(backoff * 1.6, maxBackoff);
            }
        } catch(err){
            console.warn('Polling error', err);
            backoff = Math.min(backoff * 1.6, maxBackoff);
        } finally {
            polling = false;
            if(!stopped){
                setTimeout(pollMessages, backoff);
            }
        }
    }

    // Kick off polling shortly after load
    setTimeout(()=>{ pollMessages(); }, 250);

    // Show startup hint toast after slight delay so queue system ready
    setTimeout(()=>{ showStartupHintToast(); }, 1200);

    // Input key handling (Enter to send, Shift+Enter newline)
    chatInput.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            const val = chatInput.value.trim();
            if(!val) return;
            sendMessage(val);
            chatInput.value='';
            chatInput.style.height='';
        }
    });

    // Compose emoji picker
    const composeBtn = document.getElementById('tm-compose-emoji-btn');
    const composeEmojis = ['😀','😄','😁','😊','😉','😍','🤔','😎','🤯','😅','😭','👍','👎','🔥','🎉','❤️','😮','😂','🤖','💡'];
    let composePalette = null;
    function closeComposePalette(){ if(composePalette){ composePalette.remove(); composePalette=null; } }
    function openComposePalette(anchor){
        closeComposePalette();
        const pal = document.createElement('div');
        pal.className='tm-compose-emoji-palette';
        pal.style.cssText='position:absolute;bottom:60px;right:12px;display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:10px 10px 8px;background:rgba(25,28,40,0.94);backdrop-filter:blur(18px) saturate(180%);-webkit-backdrop-filter:blur(18px) saturate(180%);border:1px solid rgba(255,255,255,0.18);border-radius:14px;box-shadow:0 14px 36px -10px rgba(0,0,0,0.65);z-index:1000003;font-size:20px;';
        // Prevent outside-click handler from seeing palette interactions
        pal.addEventListener('mousedown', e=> e.stopPropagation());
        composeEmojis.forEach(em=>{
            const cell = document.createElement('button');
            cell.type='button';
            cell.textContent=em; cell.style.cssText='background:transparent;border:0;cursor:pointer;width:32px;height:32px;font-size:20px;line-height:1;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:background .2s;';
            cell.addEventListener('mouseenter',()=>{ cell.style.background='rgba(255,255,255,0.15)'; });
            cell.addEventListener('mouseleave',()=>{ cell.style.background='transparent'; });
            cell.addEventListener('click',()=>{
                insertEmojiAtCursor(em);
                if(reducedMotion){ closeComposePalette(); } else { pal.style.opacity='0'; pal.style.transform='translateY(6px)'; setTimeout(closeComposePalette,180); }
            });
            pal.appendChild(cell);
        });
        chatBoxDiv.appendChild(pal);
        requestAnimationFrame(()=>{ pal.style.opacity='1'; pal.style.transform='translateY(0)'; });
        composePalette = pal;
        const outsideHandler = (ev)=>{
            if(!pal.contains(ev.target) && ev.target !== anchor){ closeComposePalette(); document.removeEventListener('mousedown', outsideHandler, true); }
        };
        setTimeout(()=> document.addEventListener('mousedown', outsideHandler, true),0);
    }
    function insertEmojiAtCursor(em){
        const start = chatInput.selectionStart;
        const end = chatInput.selectionEnd;
        const v = chatInput.value;
        chatInput.value = v.slice(0,start) + em + v.slice(end);
        const newPos = start + em.length;
        chatInput.selectionStart = chatInput.selectionEnd = newPos;
        chatInput.dispatchEvent(new Event('input'));
        chatInput.focus();
    }
    if(composeBtn){
        composeBtn.addEventListener('mousedown', e=> e.stopPropagation());
        composeBtn.addEventListener('click',(e)=>{
            e.stopPropagation();
            if(composePalette){ closeComposePalette(); return; }
            openComposePalette(composeBtn);
        });
    }

    // Fixed single-line input: only adjust jump position on input
    chatInput.addEventListener('input', ()=>{
        if(composeBtn){ composeBtn.style.height = chatInput.offsetHeight + 'px'; }
        updateJumpPosition();
    });

    // Scroll handling
    chatContainer.addEventListener('scroll', ()=>{
        updateJumpBtn();
        markUserScroll();
        if(atBottom()) hideNewMsgBadge();
    });

    jumpBtn.addEventListener('click', ()=>{
        scrollToBottom('smooth');
        pendingNewMessages = false;
        hideNewMsgBadge();
    });
    newMsgBadge.addEventListener('click', ()=>{
        scrollToBottom('smooth');
        pendingNewMessages = false;
        hideNewMsgBadge();
    });

    // Observe chat box height changes to reposition jump button
    if(window.ResizeObserver){
        const ro = new ResizeObserver(()=>{ updateJumpPosition(); });
        ro.observe(chatBox);
    } else {
        window.addEventListener('resize', updateJumpPosition);
    }

    // Initial layout adjustments
    updateJumpPosition();
    updateJumpBtn();

})();
