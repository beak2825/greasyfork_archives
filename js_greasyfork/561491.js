// ==UserScript==
// @name         Translate Tool
// @namespace    KoBtCode-!code
// @version      1.2
// @description  Smart
// @match        *://sploop.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561491/Translate%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/561491/Translate%20Tool.meta.js
// ==/UserScript==


const Vars={loaded:false};
const statusMode={
    sendLang:"none",
    myLang:"vi",
    ui:true
};


const LANGS=[
 ["none","No Translate"],["auto","Auto Detect"],
 ["en","English"],["vi","Vietnamese"],["ja","Japanese"],["ko","Korean"],["zh","Chinese"],
 ["fr","French"],["de","German"],["ru","Russian"],["es","Spanish"],["pt","Portuguese"],
 ["it","Italian"],["th","Thai"],["id","Indonesian"],["tr","Turkish"],["pl","Polish"],
 ["nl","Dutch"],["sv","Swedish"],["fi","Finnish"],["ar","Arabic"],["hi","Hindi"],
 ["bn","Bengali"],["ur","Urdu"],["uk","Ukrainian"],["el","Greek"],["he","Hebrew"],
 ["fa","Persian"],["ms","Malay"],["ta","Tamil"],["te","Telugu"],["mr","Marathi"],
 ["pa","Punjabi"],["gu","Gujarati"],["kn","Kannada"],["ml","Malayalam"],
 ["si","Sinhala"],["ne","Nepali"],["my","Burmese"],["km","Khmer"],["lo","Lao"],
 ["am","Amharic"],["sw","Swahili"],["zu","Zulu"]
];


let toastRoot;
function notify(type="info",title="",msg="",time=3500){
    if(!toastRoot){
        toastRoot=document.createElement("div");
        Object.assign(toastRoot.style,{
            position:"fixed",top:"16px",right:"16px",
            display:"flex",flexDirection:"column",gap:"8px",
            zIndex:999999,pointerEvents:"none"
        });
        document.body.appendChild(toastRoot);
    }
    const c={info:"#6ddcff",translate:"#7cffb2",error:"#ff6b6b"}[type]||"#fff";
    const n=document.createElement("div");
    n.innerHTML=`<b>${title}</b><br>${msg}`;
    Object.assign(n.style,{
        background:"rgba(25,25,30,.82)",
        borderLeft:`4px solid ${c}`,
        padding:"10px 14px",
        borderRadius:"14px",
        color:"#fff",fontSize:"12px",
        backdropFilter:"blur(16px)",
        boxShadow:"0 12px 30px rgba(0,0,0,.45)",
        opacity:"0",transform:"translateY(-6px)",
        transition:"all .25s ease"
    });
    toastRoot.appendChild(n);
    requestAnimationFrame(()=>{
        n.style.opacity="1";
        n.style.transform="translateY(0)";
    });
    setTimeout(()=>{
        n.style.opacity="0";
        n.style.transform="translateY(-6px)";
        setTimeout(()=>n.remove(),250);
    },time);
}


class Tools{
    static translateFull(text,to){
        if(!text||to==="none"){
            return Promise.resolve({text});
        }
        return fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
        )
        .then(r=>r.json())
        .then(d=>({
            text:d?.[0]?.map(x=>x[0]).join("")||text
        }))
        .catch(()=>({text}));
    }
    static parse(buf){
        const d=new Uint8Array(buf);
        d.type=d[0];
        return d;
    }
}


const server={entity_chat:30};

class Packets{
    static ws=null;
    static init(ws){
        this.ws=ws;
        ws.addEventListener("message",this.onMessage.bind(this));
    }
    static onMessage(e){
        if(!(e.data instanceof ArrayBuffer)) return;
        const d=Tools.parse(e.data);
        if(d.type===server.entity_chat && statusMode.myLang!=="none"){
            const msg=new TextDecoder().decode(d.slice(3)).trim();
            if(!msg) return;
            Tools.translateFull(msg,statusMode.myLang).then(r=>{
                if(r.text!==msg){
                    notify(
                        "translate",
                        "Incoming Translation",
                        `${msg} → ${r.text}`,
                        6000
                    );
                }
            });
        }
    }
    static sendmsg(msg){
        if(this.ws?.readyState===1){
            this.ws.send(
                new Uint8Array([7,...new TextEncoder().encode(msg)])
            );
        }
    }
}


class PlayerManager{}
class MouseManager{}
const Client=new PlayerManager();
const Mouse=new MouseManager();
Object.assign(window,{Client,Mouse,Packets,Tools});


let menuEl,drag=false,dx=0,dy=0;
function createMenu(){
    menuEl=document.createElement("div");
    Object.assign(menuEl.style,{
        position:"fixed",left:"20px",top:"120px",
        width:"260px",padding:"12px",
        borderRadius:"18px",
        background:"rgba(30,30,36,.85)",
        color:"#fff",zIndex:99999,
        backdropFilter:"blur(22px)"
    });

    const head=document.createElement("div");
    head.textContent="Translate Tool";
    head.style.cssText="font-weight:700;color:#6ddcff;cursor:move;margin-bottom:10px";
    head.onmousedown=e=>{
        drag=true;
        dx=e.clientX-menuEl.offsetLeft;
        dy=e.clientY-menuEl.offsetTop;
    };

    document.addEventListener("mousemove",e=>{
        if(!drag) return;
        menuEl.style.left=e.clientX-dx+"px";
        menuEl.style.top=e.clientY-dy+"px";
    });
    document.addEventListener("mouseup",()=>drag=false);

    function sel(label,cb){
        const w=document.createElement("div");
        const t=document.createElement("div");
        t.textContent=label;
        t.style.cssText="font-size:11px;opacity:.7;margin-bottom:4px";
        const s=document.createElement("select");
        LANGS.forEach(([v,n])=>{
            const o=document.createElement("option");
            o.value=v;o.textContent=n;
            s.appendChild(o);
        });
        s.onchange=()=>cb(s.value);
        Object.assign(s.style,{
            width:"100%",padding:"6px",
            borderRadius:"10px",
            background:"#0e0f14",color:"#7cffb2"
        });
        w.append(t,s);
        return w;
    }

    const help=document.createElement("div");
    help.style.cssText="font-size:11px;opacity:.65;margin-top:8px";
    help.innerHTML=
        "Usage:<br>"+
        "• Enter → normal chat<br>"+
        "• F2 → toggle menu";

    const foot=document.createElement("div");
    foot.textContent="!code (KoBtCode)";
    foot.style.cssText="text-align:center;font-size:11px;opacity:.45;margin-top:6px";

    menuEl.append(
        head,
        sel("Outgoing Language",v=>statusMode.sendLang=v),
        sel("Incoming Language",v=>statusMode.myLang=v),
        help,
        foot
    );
    document.body.appendChild(menuEl);
}


document.addEventListener("keydown",async e=>{
    if(e.code==="Numpad1"){
        const chat=document.getElementById("chat");
        if(!chat||!chat.value.trim()) return;

        if(statusMode.sendLang==="none"){
            notify("error","Translate","No outgoing language selected",2000);
            return;
        }

        const raw=chat.value;
        notify("info","Translate","Translating...",1000);

        const r=await Tools.translateFull(raw,statusMode.sendLang);
        chat.value="";
        Packets.sendmsg(r.text);

        notify(
            "translate",
            "Translate Success",
            `${raw} → ${r.text}`,
            3500
        );
        e.preventDefault();
    }

    if(e.code==="F2" && menuEl){
        statusMode.ui=!statusMode.ui;
        menuEl.style.display=statusMode.ui?"block":"none";
    }
});


window.WebSocket=new Proxy(window.WebSocket,{
    construct(t,a){
        const ws=new t(...a);
        Packets.init(ws);
        return ws;
    }
});


document.addEventListener("DOMContentLoaded",()=>{
    if(Vars.loaded) return;
    Vars.loaded=true;
    createMenu();
    notify("info","Translate Tool","Loaded successfully ✔",3000);
});
