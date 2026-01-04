// ==UserScript==
// @name         Mega Menu Ultra XXL 3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ultimate Mega Menu: websites, games, school, fun, themes, tools, network info, plus extra features! Draggable + shrinkable + mega features
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555845/Mega%20Menu%20Ultra%20XXL%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/555845/Mega%20Menu%20Ultra%20XXL%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----- Styles -----
    const style = document.createElement('style');
    style.textContent = `
    #megaMenu {position:fixed;top:50px;left:50px;width:520px;max-height:700px;background:#1a1a2e;color:white;border-radius:10px;box-shadow:0 0 25px rgba(0,0,0,0.8);z-index:999999;user-select:none;display:flex;flex-direction:column;font-family:Arial, sans-serif;overflow:hidden;transition:width .3s,height .3s;}
    #megaMenuHeader{padding:10px;background:rgba(30,30,60,0.95);cursor:grab;display:flex;justify-content:space-between;align-items:center;}
    #megaMenuHeader h2{margin:0;font-size:16px;}
    #megaMenuContent{flex:1;padding:10px;overflow-y:auto;}
    #megaMenuTabs{display:flex;justify-content:space-around;background:rgba(20,20,50,0.95);padding:5px 0;flex-wrap:wrap;}
    #megaMenuTabs button{background:transparent;border:none;color:white;padding:5px 8px;border-radius:5px;cursor:pointer;margin:2px;font-size:13px;}
    #megaMenuTabs button.active{background:rgba(255,255,255,0.2);}
    .tab{display:none;}
    .tab.active{display:block;}
    .menuButton{display:flex;align-items:center;padding:5px;margin:5px 0;background:rgba(50,50,80,0.8);border-radius:5px;cursor:pointer;transition:background .2s, transform .2s;}
    .menuButton:hover{background:rgba(80,80,120,0.9);transform:scale(1.05);}
    .menuButton img{width:24px;height:24px;margin-right:10px;}
    #megaShrinkBtn{position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#222;color:white;display:none;justify-content:center;align-items:center;cursor:pointer;z-index:999999;box-shadow:0 0 15px rgba(0,0,0,0.7);font-size:18px;}
    `;
    document.head.appendChild(style);

    // ----- HTML Structure -----
    const menu = document.createElement('div');
    menu.id = "megaMenu";
    menu.innerHTML = `
      <div id="megaMenuHeader">
        <h2>Mega Menu Ultra XXL</h2>
        <button id="megaCloseBtn">×</button>
      </div>
      <div id="megaMenuTabs">
        <button data-tab="websites" class="active">Websites</button>
        <button data-tab="games">Games</button>
        <button data-tab="school">School</button>
        <button data-tab="fun">Fun</button>
        <button data-tab="themes">Themes</button>
        <button data-tab="tools">Tools</button>
      </div>
      <div id="megaMenuContent">
        <div class="tab active" id="tab-websites"></div>
        <div class="tab" id="tab-games"></div>
        <div class="tab" id="tab-school"></div>
        <div class="tab" id="tab-fun"></div>
        <div class="tab" id="tab-themes"></div>
        <div class="tab" id="tab-tools"></div>
      </div>
    `;
    document.body.appendChild(menu);

    const shrinkBtn = document.createElement('div');
    shrinkBtn.id = "megaShrinkBtn";
    shrinkBtn.textContent = "M";
    document.body.appendChild(shrinkBtn);

    // ----- Drag Logic -----
    let dragging = false, dragX = 0, dragY = 0;
    const header = document.getElementById('megaMenuHeader');
    header.addEventListener('mousedown', e => {
        dragging = true;
        dragX = e.clientX - menu.offsetLeft;
        dragY = e.clientY - menu.offsetTop;
        header.style.cursor = "grabbing";
    });
    document.addEventListener('mouseup', () => { dragging = false; header.style.cursor = "grab"; });
    document.addEventListener('mousemove', e => {
        if (dragging) {
            menu.style.left = (e.clientX - dragX) + "px";
            menu.style.top = (e.clientY - dragY) + "px";
        }
    });

    // ----- Shrink / Expand -----
    document.getElementById('megaCloseBtn').onclick = () => { menu.style.display = "none"; shrinkBtn.style.display = "flex"; };
    shrinkBtn.onclick = () => { menu.style.display = "block"; shrinkBtn.style.display = "none"; };

    // ----- Tab Switching -----
    const tabButtons = document.querySelectorAll('#megaMenuTabs button');
    const tabContents = document.querySelectorAll('.tab');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        });
    });

    // ----- Mega Lists -----
    const websites = [
        {name:"Google",url:"https://google.com",icon:"https://www.google.com/favicon.ico"},
        {name:"YouTube",url:"https://youtube.com",icon:"https://www.youtube.com/s/desktop/6d038668/img/favicon_32x32.png"},
        {name:"Wikipedia",url:"https://wikipedia.org",icon:"https://en.wikipedia.org/static/favicon/wikipedia.ico"},
        {name:"Reddit",url:"https://reddit.com",icon:"https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png"},
        {name:"Twitter",url:"https://twitter.com",icon:"https://abs.twimg.com/favicons/twitter.ico"},
        {name:"Instagram",url:"https://instagram.com",icon:"https://www.instagram.com/static/images/ico/favicon-32x32.png/68d99ba29cc8.png"},
        {name:"Discord",url:"https://discord.com",icon:"https://discord.com/assets/32x32.png"},
        {name:"GitHub",url:"https://github.com",icon:"https://github.githubassets.com/favicons/favicon.png"},
        {name:"Khan Academy",url:"https://khanacademy.org",icon:"https://www.khanacademy.org/favicon.ico"},
        {name:"Stack Overflow",url:"https://stackoverflow.com",icon:"https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico"},
        {name:"Google Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"},
        {name:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"},
        {name:"Google Docs",url:"https://docs.google.com",icon:"https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico"},
        {name:"Netflix",url:"https://netflix.com",icon:"https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico"},
        {name:"Twitch",url:"https://twitch.tv",icon:"https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.ico"},
        {name:"Facebook",url:"https://facebook.com",icon:"https://www.facebook.com/favicon.ico"},
        {name:"LinkedIn",url:"https://linkedin.com",icon:"https://static.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico"},
        {name:"Pinterest",url:"https://pinterest.com",icon:"https://s.pinimg.com/webapp/favicon.ico"},
        {name:"DuckDuckGo",url:"https://duckduckgo.com",icon:"https://duckduckgo.com/favicon.ico"},
        {name:"Medium",url:"https://medium.com",icon:"https://medium.com/favicon.ico"}
    ];

    const games = [
        {name:"2048",url:"https://play2048.co",icon:"https://play2048.co/favicon.ico"},
        {name:"Slither.io",url:"https://slither.io",icon:"https://slither.io/favicon.ico"},
        {name:"Agar.io",url:"https://agar.io",icon:"https://agar.io/favicon.ico"},
        {name:"Tetris",url:"https://tetris.com/play-tetris",icon:"https://tetris.com/favicon.ico"},
        {name:"Skribbl.io",url:"https://skribbl.io",icon:"https://skribbl.io/favicon.ico"},
        {name:"Cookie Clicker",url:"https://orteil.dashnet.org/cookieclicker/",icon:"https://orteil.dashnet.org/cookieclicker/favicon.ico"}
    ];

    const school = [
        {name:"Magister",url:"https://magister.net",icon:"https://magister.net/favicon.ico"},
        {name:"itsLearning",url:"https://itslearning.com",icon:"https://itslearning.com/favicon.ico"},
        {name:"Kahoot",url:"https://kahoot.com",icon:"https://kahoot.com/favicon.ico"},
        {name:"Blooket",url:"https://blooket.com",icon:"https://blooket.com/favicon.ico"}
    ];

    const fun = [
        {name:"Rainbow Text",icon:"https://img.icons8.com/ios-filled/50/ffffff/rainbow.png",action:()=>{document.body.style.color=`hsl(${Math.random()*360},100%,50%)`}},
        {name:"Spin Page",icon:"https://img.icons8.com/ios-filled/50/ffffff/repeat.png",action:()=>{document.body.style.transition="transform 2s";document.body.style.transform="rotate(360deg)";setTimeout(()=>document.body.style.transform="",2000)}},
        {name:"Invert Colors",icon:"https://img.icons8.com/ios-filled/50/ffffff/invert-colors.png",action:()=>{document.body.style.filter=document.body.style.filter==="invert(1)"?"":"invert(1)"}},
        {name:"Confetti",icon:"https://img.icons8.com/ios-filled/50/ffffff/confetti.png",action:()=>{for(let i=0;i<100;i++){const e=document.createElement("div");e.textContent="🎉";e.style.position="fixed";e.style.left=Math.random()*window.innerWidth+"px";e.style.top=Math.random()*window.innerHeight+"px";e.style.fontSize="24px";document.body.appendChild(e);setTimeout(()=>e.remove(),2000)}}},
        {name:"Big Head Mode",icon:"https://img.icons8.com/ios-filled/50/ffffff/zoom-in.png",action:()=>{document.querySelectorAll("img, video").forEach(el=>el.style.transform="scale(1.5)")}},
        {name:"Mini Everything",icon:"https://img.icons8.com/ios-filled/50/ffffff/zoom-out.png",action:()=>{document.querySelectorAll("img, video").forEach(el=>el.style.transform="scale(0.5)")}},
        {name:"Page Disco",icon:"https://img.icons8.com/ios-filled/50/ffffff/party-balloons.png",action:()=>{let h=0;const iv=setInterval(()=>{document.body.style.backgroundColor=`hsl(${h},100%,60%)`;h+=30;if(h>=360)clearInterval(iv)},200)}},
        {name:"Flip Horizontally",icon:"https://img.icons8.com/ios-filled/50/ffffff/flip.png",action:()=>{document.body.style.transform=document.body.style.transform==="scaleX(-1)"?"":"scaleX(-1)"}},
        {name:"Surprise",icon:"https://img.icons8.com/ios-filled/50/ffffff/surprise.png",action:()=>{alert(["Boo! 👻","Haha! 😆","Gotcha! 😜","Surprise! 🎉"][Math.floor(Math.random()*4)])}}
    ];

    const themes = [
        {name:"Default",background:"linear-gradient(45deg,#1a1a1a,#333)"},
        {name:"Galaxy",background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"},
        {name:"Back",background:"linear-gradient(45deg,#111,#555)"},
        {name:"Sunset",background:"linear-gradient(45deg,#ff5f6d,#ffc371)"},
        {name:"Ocean",background:"linear-gradient(45deg,#00bfff,#1e90ff)"},
        {name:"Neon",background:"linear-gradient(45deg,#39ff14,#0ff0fc)"}
    ];

    const tools = [
        {name:"Network Info",icon:"https://img.icons8.com/ios-filled/50/ffffff/network.png",action:()=>{
            const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
            let info={};
            if(conn){info.type=conn.effectiveType;info.downlink=conn.downlink+"Mb/s";info.rtt=conn.rtt+"ms";info.saveData=conn.saveData;}else info={info:"Not supported by this browser"};
            alert(JSON.stringify(info,null,2));
        }},
        {name:"Ad Blocker",icon:"https://img.icons8.com/ios-filled/50/ffffff/block.png",action:()=>{alert("AdBlocker would be triggered (demo)");}},
        {name:"Translate Page",icon:"https://img.icons8.com/ios-filled/50/ffffff/google-translate.png",action:()=>{window.open(`https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(location.href)}`);}},
        {name:"Dev Tools",icon:"https://img.icons8.com/ios-filled/50/ffffff/developer.png",action:()=>{alert("Press F12 to open dev tools");}},
        {name:"Clear Cache",icon:"https://img.icons8.com/ios-filled/50/ffffff/eraser.png",action:()=>{caches.keys().then(names=>{for(let name of names)caches.delete(name);});localStorage.clear();sessionStorage.clear();alert("Cache & Storage cleared!");}},
        {name:"Night Mode",icon:"https://img.icons8.com/ios-filled/50/ffffff/moon-symbol.png",action:()=>{document.body.style.backgroundColor="#111";document.body.style.color="#eee";}},
        {name:"Quick Google Search",icon:"https://img.icons8.com/ios-filled/50/ffffff/google-logo.png",action:()=>{const q=prompt("Search Google:");if(q)window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`);}},
        {name:"Quick DuckDuckGo Search",icon:"https://img.icons8.com/ios-filled/50/ffffff/duckduckgo.png",action:()=>{const q=prompt("Search DuckDuckGo:");if(q)window.open(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`);}},
        {name:"Screenshot Page",icon:"https://img.icons8.com/ios-filled/50/ffffff/camera.png",action:()=>{html2canvas(document.body).then(canvas=>{const link=document.createElement('a');link.href=canvas.toDataURL();link.download="screenshot.png";link.click();});}},
        {name:"Page Word Count",icon:"https://img.icons8.com/ios-filled/50/ffffff/text.png",action:()=>{const wc=document.body.innerText.split(/\s+/).filter(Boolean).length;alert(`Word Count: ${wc}`);}},
        {name:"Quick Calculator",icon:"https://img.icons8.com/ios-filled/50/ffffff/calculator.png",action:()=>{const eq=prompt("Enter calculation:");if(eq)alert(eval(eq));}},
        {name:"Scroll to Top",icon:"https://img.icons8.com/ios-filled/50/ffffff/up-squared.png",action:()=>{window.scrollTo({top:0,behavior:"smooth"});}},
        {name:"Scroll to Bottom",icon:"https://img.icons8.com/ios-filled/50/ffffff/down-squared.png",action:()=>{window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});}}
    ];

    // ----- Function to add buttons -----
    function addButtons(list,containerId){
        const container=document.getElementById(containerId);
        list.forEach(item=>{
            const btn=document.createElement("div");
            btn.className="menuButton";
            if(item.icon){
                const img=document.createElement("img");
                img.src=item.icon;
                btn.appendChild(img);
            }
            const txt=document.createElement("span");
            txt.textContent=item.name;
            btn.appendChild(txt);
            btn.onclick=()=>{if(item.url)window.open(item.url,"_blank");if(item.action)item.action();}
            container.appendChild(btn);
        });
    }

    addButtons(websites,"tab-websites");
    addButtons(games,"tab-games");
    addButtons(school,"tab-school");
    addButtons(fun,"tab-fun");
    addButtons(tools,"tab-tools");

    // Themes
    const themesTab=document.getElementById("tab-themes");
    themes.forEach(t=>{
        const btn=document.createElement("div");
        btn.className="menuButton";
        const txt=document.createElement("span");
        txt.textContent=t.name;
        btn.appendChild(txt);
        btn.onclick=()=>{menu.style.background=t.background;}
        themesTab.appendChild(btn);
    });

})();
