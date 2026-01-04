// ==UserScript==
// @name            Rejoiner Kicked Room
// @namespace       Violentmonkey Scripts
// @description     Adds a Rejoin button to automatically return to the room if you get kicked
// @description:tr  Atıldığınız odaya otomatik dönmeniz için Rejoin butonu ekler
// @match           *://gartic.io/*
// @author          Qwyua
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @version         0.2
// @run-at          document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/553460/Rejoiner%20Kicked%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/553460/Rejoiner%20Kicked%20Room.meta.js
// ==/UserScript==
// yıldıztorunu istegi uzerine yapilmistir
const [observer,GM_req,parseName]=[
  (s, c)=>{const seen=new WeakSet();const w=()=>{document.querySelectorAll(s).forEach(e=>{if(!seen.has(e)){seen.add(e);c(e)}})};const o=new MutationObserver(w);if(document.body){o.observe(document.body,{childList:1,subtree:1})}else{new MutationObserver((_,obs)=>{if(document.body){obs.disconnect();o.observe(document.body,{childList:1,subtree:1})}}).observe(document.documentElement,{childList:1})}w()},
  q=>GM_xmlhttpRequest({...q,onerror:e=>console.error(e)}),
  ()=>{try{const d=JSON.parse(window.name??'{}');return d.kicked?d:null}catch{return null}}
];

(()=>{
    if(localStorage.name==='pastel'&&localStorage.value==='1') return;
    (()=>{
        let w = window.name;
        if (!w) return;
        let d = JSON.parse(w || "{}");
        if (!Object.keys(d).length || !d.kicked) return;
        unsafeWindow && (unsafeWindow.timeExit = 0);
        observer('button.btYellowBig.ic-playHome',y=>{
            let w = window.name;
            if (!w) return;
            let d = JSON.parse(w || "{}");
            if (!Object.keys(d).length || !d.kicked) return;
            unsafeWindow && (unsafeWindow.timeExit = 0);
            HTMLElement.prototype.click.call(y);
            const wait = setInterval(() => {
                const user = unsafeWindow?.CACHE_DATA?.user;
                if (user) {
                    clearInterval(wait);
                    Object.assign(user,{nome:d.nome,avatar:d.avatar});
                    window.name = "{}";
                }
            }, 100);
        });
    })();
    observer('#popUp .content',t=>{
        if (unsafeWindow.CACHE_DATA.lang.play.kickedOut==t.querySelector(".title")?.textContent){
            const b=document.createElement("button");
            Object.assign(b,{
                className:"btBlueBig smallButton ic-yes",
                innerHTML:"<strong>Rejoin</strong>",
                onclick:()=>{
                    const u=unsafeWindow?.CACHE_DATA?.user;
                    history.go(-1);
                    GM_req({
                        method:"POST",
                        url:"https://gartic.io/logout",
                        onload:()=>{window.name=JSON.stringify({kicked:true,nome:u?.nome,avatar:u?.avatar});document.write("");location.reload()}
                    });
                }
            });
            t.querySelector(".buttons")?.appendChild(b);
        }
    });
})();
