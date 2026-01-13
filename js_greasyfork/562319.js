// ==UserScript==
// @name         Universal Browser Performance Controller v1
// @namespace    https://tampermonkey.net
// @version      1.0
// @description  Fully reactive draggable performance panel with live FPS/RAM & live options
// @author       Rubystance
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562319/Universal%20Browser%20Performance%20Controller%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/562319/Universal%20Browser%20Performance%20Controller%20v1.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const KEY = "__UBPC__";
    const defaults = {
        x: 20, y: 20,
        minimized: false,
        disableAnimations: true,
        throttleTimers: true,
        pauseHiddenVideos: true,
        freezeHiddenIframes: true,
        rafLimiter: true,
        backgroundSleep: true,
        hideAds: true
    };

    const settings = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}"));
    const save = () => localStorage.setItem(KEY, JSON.stringify(settings));

    let visible = true;
    document.addEventListener("visibilitychange", () => visible = !document.hidden);

    const applyAnimations = () => {
        if (settings.disableAnimations) {
            if (!document.getElementById("UBPC_DISABLE_ANIM")) {
                const s = document.createElement("style");
                s.id = "UBPC_DISABLE_ANIM";
                s.textContent = `*{animation:none!important;transition:none!important}`;
                document.documentElement.appendChild(s);
            }
        } else {
            const s = document.getElementById("UBPC_DISABLE_ANIM");
            if (s) s.remove();
        }
    };

    let adObserver;
    const originalAdStyles = new WeakMap();

    const hideAdsFn = () => {
        document.querySelectorAll(
            '[id*="ad"], [class*="ad"], [class*="banner"], [class*="sponsor"], iframe[src*="ads"], iframe[src*="doubleclick"]'
        ).forEach(el => {
            if (!originalAdStyles.has(el)) {
                originalAdStyles.set(el, {
                    opacity: el.style.opacity,
                    pointerEvents: el.style.pointerEvents,
                    transition: el.style.transition
                });
            }
            if(settings.hideAds){
                el.style.transition = "opacity 0.2s";
                el.style.opacity = "0";
                el.style.pointerEvents = "none";
            } else {
                const original = originalAdStyles.get(el);
                el.style.opacity = original.opacity;
                el.style.pointerEvents = original.pointerEvents;
                el.style.transition = original.transition;
            }
        });
    };

    const applyHideAds = () => {
        hideAdsFn();
        if(settings.hideAds){
            if(!adObserver){
                adObserver = new MutationObserver(() => hideAdsFn());
                adObserver.observe(document.body, { childList: true, subtree: true });
            }
        } else if(adObserver){
            adObserver.disconnect();
            adObserver = null;
        }
    };

    const applyRAF = () => {
        const oRAF = requestAnimationFrame;
        window.requestAnimationFrame = cb => oRAF(t => {
            if (!visible && settings.backgroundSleep) return;
            cb(t);
        });
    };

    const applyTimers = () => {
        const oSI = setInterval, oST = setTimeout;
        window.setInterval = (f,d,...a)=>oSI(f, (!visible && settings.throttleTimers && d<2000)?2000:d, ...a);
        window.setTimeout = (f,d,...a)=>oST(f, (!visible && settings.throttleTimers && d<1000)?1000:d, ...a);
    };

    const createPanel = () => {
        if (document.getElementById("UBPC_PANEL")) return;
        if (!document.body) return false;

        let fps=0, last=performance.now(), frames=0;
        function fpsLoop(){
            frames++;
            const now=performance.now();
            if(now-last>=1000){ fps=frames; frames=0; last=now; }
            requestAnimationFrame(fpsLoop);
        }
        fpsLoop();

        const panel=document.createElement("div");
        panel.id = "UBPC_PANEL";
        panel.style.cssText=`
            all:initial;
            position:fixed;
            left:${settings.x}px;
            top:${settings.y}px;
            width:280px;
            background:#050505;
            color:#00ff99;
            font:12px monospace;
            z-index:2147483647 !important;
            border-radius:10px;
            box-shadow:0 0 25px rgba(0,255,150,.4);
            user-select:none;
        `;

        const header=document.createElement("div");
        header.style.cssText="padding:8px;background:#000;cursor:move;display:flex;justify-content:space-between;align-items:center;";
        const title=document.createElement("span"); title.textContent="Browser Optimizer By: Rubystanceﾠﾠﾠ ﾠ ﾠﾠﾠClick Twice To Hide/Show The Panel";
        const hideBtn=document.createElement("span"); hideBtn.textContent="✖"; hideBtn.style.cursor="pointer";
        hideBtn.onclick=()=>panel.style.display="none";
        header.append(title, hideBtn);

        const body=document.createElement("div"); body.style.padding="8px";
        const stats=document.createElement("div"); body.append(stats);

        function toggle(label,key){
            const d=document.createElement("div");
            const c=document.createElement("input"); c.type="checkbox"; c.checked=settings[key];
            c.onchange=()=>{
                settings[key]=c.checked; save();
                switch(key){
                    case "disableAnimations": applyAnimations(); break;
                    case "hideAds": applyHideAds(); break;
                    case "throttleTimers": applyTimers(); break;
                    case "rafLimiter": applyRAF(); break;
                }
            };
            d.append(c," ",label); return d;
        }

        Object.keys(defaults).forEach(k=>{
            if(k!=="x" && k!=="y" && k!=="minimized") body.append(toggle(k,k));
        });

        header.ondblclick=()=>{
            settings.minimized=!settings.minimized;
            save();
            body.style.display=settings.minimized?"none":"block";
            panel.style.opacity=settings.minimized?"0.2":"1";
        };

        let dx,dy,drag=false;
        header.onmousedown=e=>{drag=true;dx=e.clientX-panel.offsetLeft;dy=e.clientY-panel.offsetTop;}
        document.onmousemove=e=>{
            if(!drag) return;
            panel.style.left=(e.clientX-dx)+"px";
            panel.style.top=(e.clientY-dy)+"px";
        }
        document.onmouseup=()=>{
            if(drag){settings.x=panel.offsetLeft; settings.y=panel.offsetTop; save();}
            drag=false;
        };

        setInterval(()=>{
            if(settings.pauseHiddenVideos)
                document.querySelectorAll("video").forEach(v=>{
                    const r=v.getBoundingClientRect();
                    if((r.bottom<0||r.top>innerHeight)&&!v.matches(":hover")) v.pause();
                });

            if(settings.freezeHiddenIframes)
                document.querySelectorAll("iframe").forEach(f=>{
                    const r=f.getBoundingClientRect();
                    f.style.visibility=(r.bottom<0||r.top>innerHeight)?"hidden":"visible";
                });
        },1500);

        setInterval(()=>{
            let mem = "n/a";
            if (performance.memory) mem = (performance.memory.usedJSHeapSize/1048576).toFixed(1);
            stats.textContent=`FPS: ${fps} | RAM: ${mem} MB`;
        },500);

        panel.append(header,body);
        document.documentElement.appendChild(panel);

        applyAnimations();
        applyHideAds();
        applyTimers();
        applyRAF();

        return true;
    };

    const tryPanel = () => {
        if (createPanel()) clearInterval(timer);
    };
    const timer = setInterval(tryPanel, 500);
    tryPanel();

})();
