// ==UserScript==
// @name         Cookie Manager PRO (Optimized + Import/Export)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Faster startup, optimized DOM, draggable UI, import/export, stable deletion.
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554033/Cookie%20Manager%20PRO%20%28Optimized%20%2B%20ImportExport%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554033/Cookie%20Manager%20PRO%20%28Optimized%20%2B%20ImportExport%29.meta.js
// ==/UserScript==

(function(){
'use strict';

const ready = f => /complete|interactive/.test(document.readyState) ? f() : document.addEventListener("DOMContentLoaded", f,{once:true});

ready(()=> setTimeout(()=> new CookieManager().init(),150));

class CookieManager {

    constructor(){
        this.cookies=[];
        this.filtered=[];
        this.shadow=null;
        this.panel=null;
    }

    init(){
        this.loadCookies();
        this.buildUI();
    }

    loadCookies(){
        const raw=document.cookie;
        if(!raw){ this.cookies=[]; this.filtered=[]; return; }

        this.cookies = raw.split(";").map(pair=>{
            const i = pair.indexOf("=");
            const name = decodeURIComponent(pair.slice(0,i).trim());
            const value = decodeURIComponent(pair.slice(i+1));
            return {name,value,domain:location.hostname,path:"/"};
        });

        this.filtered=[...this.cookies];
    }

    buildUI(){
        if(document.getElementById("cookieManagerHost")) return;

        const host = document.createElement("div");
        host.id="cookieManagerHost";
        document.body.appendChild(host);

        const shadow = host.attachShadow({mode:"open"});
        this.shadow = shadow;

        // STYLE
        shadow.innerHTML = `
        <style>
            :host{all:initial;}
            .btn-main{
                position:fixed;top:20px;right:20px;width:60px;height:60px;
                border-radius:50%;border:none;background:#673ab7d4;color:#fff;
                cursor:grab;display:flex;align-items:center;justify-content:center;
                font-size:28px;z-index:999999;box-shadow:0 4px 15px #0003;
                user-select:none;touch-action:none;
            }
            .btn-main:active{cursor:grabbing;}
            .panel{
                position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                width:95vw;max-width:900px;background:#222e;color:#fff;
                border-radius:16px;padding:12px;display:none;z-index:9999999;
                font-family:sans-serif;box-sizing:border-box;
            }
            .hdr{padding:8px;background:#fff2;border-radius:10px;margin-bottom:10px;cursor:move;}
            .search{width:100%;padding:7px;margin-bottom:8px;border:1px solid #fff4;background:#fff1;color:#fff;border-radius:5px;}
            .btn{padding:6px 8px;background:#fff3;border:none;border-radius:5px;color:#fff;cursor:pointer;margin:2px;}
            .btn:hover{background:#fff5;}
            table{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:10px;}
            th,td{padding:6px;border-bottom:1px solid #fff3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
            tr:hover{background:#fff1;}
        </style>
        `;

        // BUTTON
        const toggle = document.createElement("button");
        toggle.className="btn-main"; toggle.textContent="🍪";
        shadow.appendChild(toggle);

        // PANEL
        const panel = document.createElement("div");
        panel.className="panel";
        panel.innerHTML = `
            <div class="hdr" id="hdr"><h2 style="margin:0;">Cookie Manager</h2></div>
            <input class="search" id="search" placeholder="Search cookies...">
            <div>
                <button class="btn" id="add">Add</button>
                <button class="btn" id="refresh">Refresh</button>
                <button class="btn" id="export">Export</button>
                <button class="btn" id="import">Import</button>
                <button class="btn" id="delAll" style="background:#e055;">Delete All</button>
            </div>
            <table><thead><tr><th>Name</th><th>Value</th><th>Action</th></tr></thead>
            <tbody id="list"></tbody></table>
        `;
        shadow.appendChild(panel);
        this.panel=panel;

        // DRAG
        this.makeDraggable(toggle);
        this.makeDraggable(panel, panel.querySelector("#hdr"));

        // EVENTS
        toggle.onclick = (e)=> !toggle._dragged && (panel.style.display= panel.style.display==="block"?"none":"block", this.refresh());
        toggle.onmousedown = ()=> toggle._dragged=false;

        shadow.getElementById("add").onclick = ()=> this.addPrompt();
        shadow.getElementById("refresh").onclick = ()=> this.refresh();
        shadow.getElementById("delAll").onclick = ()=> this.deleteAll();
        shadow.getElementById("search").oninput = ()=> this.search();
        shadow.getElementById("export").onclick = ()=> this.exportCookies();
        shadow.getElementById("import").onclick = ()=> this.importPrompt();

        this.render();
    }

    makeDraggable(el, handle=null){
        let drag=false, moved=false, ox=0, oy=0, sx=0, sy=0;
        const h = handle||el;

        const start = e=>{
            const t = e.touches? e.touches[0]:e;
            sx=t.clientX; sy=t.clientY; moved=false; drag=true;

            const r = el.getBoundingClientRect();
            ox = t.clientX - r.left;
            oy = t.clientY - r.top;

            el.style.transform="none";
            document.addEventListener("mousemove",move);
            document.addEventListener("mouseup",end);
            document.addEventListener("touchmove",move);
            document.addEventListener("touchend",end);
        };

        const move = e=>{
            if(!drag) return;
            const t = e.touches? e.touches[0]:e;

            if(Math.abs(t.clientX-sx)>5||Math.abs(t.clientY-sy)>5) moved=true;

            const x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, t.clientX-ox));
            const y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, t.clientY-oy));
            el.style.left=x+"px"; el.style.top=y+"px"; el.style.right="auto";
        };

        const end = ()=>{
            drag=false;
            if(moved) el._dragged=true;
            document.removeEventListener("mousemove",move);
            document.removeEventListener("mouseup",end);
            document.removeEventListener("touchmove",move);
            document.removeEventListener("touchend",end);
        };

        h.addEventListener("mousedown",start);
        h.addEventListener("touchstart",start,{passive:false});
    }

    refresh(){ this.loadCookies(); this.render(); }

    search(){
        const q = this.shadow.getElementById("search").value.toLowerCase();
        this.filtered = this.cookies.filter(c=> c.name.toLowerCase().includes(q) || c.value.toLowerCase().includes(q) );
        this.render();
    }

    render(){
        const list = this.shadow.getElementById("list");
        if(!list) return;
        if(!this.filtered.length){
            list.innerHTML = `<tr><td colspan="3" style="text-align:center;">No cookies.</td></tr>`;
            return;
        }

        const rows=[];
        for(const c of this.filtered){
            const name=this.escape(c.name);
            const val=this.escape(c.value);
            rows.push(`
                <tr><td>${name}</td><td>${val.slice(0,40)}${c.value.length>40?'…':''}</td>
                <td><button class="btn edit" data-name="${name}">✎</button>
                    <button class="btn del" data-name="${name}">×</button></td></tr>
            `);
        }
        list.innerHTML=rows.join("");

        list.querySelectorAll(".del").forEach(b=>{
            const name=this.unescapeHTML(b.dataset.name);
            b.onclick=()=> this.delete(name);
        });

        list.querySelectorAll(".edit").forEach(b=>{
            const name=this.unescapeHTML(b.dataset.name);
            b.onclick=()=> this.editPrompt(name);
        });
    }

    addPrompt(){
        const n=prompt("Name:"); if(!n) return;
        const v=prompt("Value:")||"";
        document.cookie = `${encodeURIComponent(n)}=${encodeURIComponent(v)};path=/`;
        this.refresh();
    }

    editPrompt(name){
        const c = this.cookies.find(x=>x.name===name);
        const v = prompt("New value:", c?.value||"");
        if(v===null) return;
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(v)};path=/`;
        this.refresh();
    }

    delete(name){
        const paths=[];
        for(let p=location.pathname; p; ){
            paths.push(p);
            p=p.substring(0,p.lastIndexOf('/'))|| (p.length>1?'/':'');
        }
        if(!paths.includes('/')) paths.push('/');

        const domains=[];
        const parts=location.hostname.split('.');
        for(let i=0;i<parts.length-1;i++) domains.push('.'+parts.slice(i).join('.'));
        if(!domains.includes(location.hostname)) domains.push(location.hostname);

        const exp="Thu, 01 Jan 1970 00:00:00 GMT";

        for(const path of paths){
            for(const d of domains){
                const opts=[
                    `;domain=${d};path=${path};expires=${exp}`,
                    `;path=${path};expires=${exp}`
                ];
                for(const o of opts)
                    document.cookie = `${encodeURIComponent(name)}=;${o}`;
            }
        }
        this.refresh();
    }

    deleteAll(){
        if(!confirm(`Delete ALL ${this.cookies.length} cookies?`)) return;
        for(const c of this.cookies) this.delete(c.name);
    }

    exportCookies(){
        const blob = new Blob([JSON.stringify(this.cookies,null,2)],{type:"application/json"});
        const a=document.createElement("a");
        a.href=URL.createObjectURL(blob);
        a.download="cookies.json";
        a.click();
    }

    importPrompt(){
        const inp=document.createElement("input");
        inp.type="file"; inp.accept="application/json";
        inp.onchange = ()=>{
            const file=inp.files[0];
            if(!file) return;
            const r=new FileReader();
            r.onload = ()=>{
                try{
                    const arr=JSON.parse(r.result);
                    arr.forEach(c=>{
                        document.cookie=`${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)};path=/`;
                    });
                    this.refresh();
                }catch(e){ alert("Invalid JSON."); }
            };
            r.readAsText(file);
        };
        inp.click();
    }

    escape(s){ return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
    unescapeHTML(s){
        return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
                .replace(/&quot;/g,'"').replace(/&#39;/g,"'");
    }
}

})();