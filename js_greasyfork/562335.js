// ==UserScript==
// @name           Fake kick (Mobile Fixed)
// @name:tr        Fake kick (Mobil Düzeltme)
// @name:az        Fake kick
// @description    Fake kick at - Mobile optimized
// @description:tr Fake kick at - Mobil optimize
// @description:az Fake kick at
// @version        1.4
// @author         AsadovSc
// @license        
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://gartic.io/static/images/avatar/svg/0.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/1220697
// @downloadURL https://update.greasyfork.org/scripts/562335/Fake%20kick%20%28Mobile%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562335/Fake%20kick%20%28Mobile%20Fixed%29.meta.js
// ==/UserScript==

function fa(hv){return document.querySelectorAll(hv)}

if(window.location.href.indexOf("gartic.io")!=-1){
    let readyc=0,botc=0,otoeven=0,roomusers=[]
    let WebSocket=window.WebSocket
    window.ginterval=0
    window.selectlevel=-1
    let originalSend = WebSocket.prototype.send,setTrue=false;
    window.wsObj={}
    console.log("running")
    
    WebSocket.prototype.send=function(data){
        originalSend.apply(this, arguments)
        if(Object.keys(window.wsObj).length==0){window.wsObj=this;window.eventAdd()}
    };
    
    function updatespeckicks(){
        f(".userkickmenu").innerHTML=""
        roomusers.forEach(user=>{
            // Beyaz kutucuk içinde kullanıcı adı göster
            user.nick.split("‏").join("")!="RED"?f(".userkickmenu").innerHTML+=`<button type="button" class="kickmenubtn" data-userid="`+user.id+`"><span class="username-box">`+user.nick+`</span></button>`:0
        })
        
        // Mobil için touch event'leri ekle - SADECE TOUCHEND KULLAN
        fa(".kickmenubtn").forEach(btn => {
            let touching = false;
            
            // Click event'ini tamamen devre dışı bırak (çift oy önleme)
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);
            
            // iOS için sadece touchend kullan
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                touching = true;
                this.style.opacity = '0.7';
                this.style.transform = 'scale(0.95)';
            }, {passive: false});
            
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
                
                if(touching) {
                    touching = false;
                    window.postMessage('kickuser.'+this.getAttribute('data-userid'),'*');
                }
                return false;
            }, {passive: false});
            
            btn.addEventListener('touchcancel', function(e) {
                touching = false;
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    window.eventAdd=()=>{
        if(!setTrue){
            setTrue=1
            window.wsObj.addEventListener("message",(msg)=>{
                // İlk odaya girişte tüm kullanıcıları al
                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    
                    // Mevcut kullanıcıları temizle ve yeniden ekle
                    roomusers = [];
                    objlist[5].forEach(item=>{roomusers.push(item)})
                    updatespeckicks()
                    
                    window.addEventListener("message",function(event){
                        if(typeof(event.data)==="string"){
                            if(event.data.indexOf("kickuser.")!=-1){
                                let userid=event.data.split("kickuser.")[1]
                                let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                                var longID = objlist[1]
                                var id = objlist[2]
                                window.wsObj.send('42[45,'+id+',["'+userid+'",true]]')
                                window.wsObj.send('42[45,'+id+',["'+userid+'",false]]')
                            }
                        }
                    })
                }
                
                // Yeni kullanıcı katıldığında
                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    // Duplikasyon kontrolü - aynı ID varsa ekleme
                    let exists = roomusers.some(u => u.id === user.id);
                    if(!exists) {
                        roomusers.push(user)
                        updatespeckicks()
                    }
                    if(document.querySelector("body > div:nth-child(19) > input:nth-child(12)")) {
                        document.querySelector("body > div:nth-child(19) > input:nth-child(12)").value = user.nick
                    }
                }
                
                // Kullanıcı ayrıldığında
                if(msg.data.indexOf('42["24"')!=-1){
                    let user=msg.data.split(",")[1].split('"')[1]
                    for(let i=0;i<roomusers.length;i++){
                        typeof(roomusers[i].id)==='undefined'?0:roomusers[i].id==user?roomusers.splice(i,1):0
                    }
                    updatespeckicks()
                }
            })
        }
    }
    
    let html=`
    <div class="userlist">
    <div class="userlist-header">Oyuncular</div>
    <div class="userkickmenu"></div>
    </div>
    `
    
    function setCSS(){
        var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');
        .rb4 *{box-sizing:border-box;}
        
        /* iOS Safari için özel düzeltmeler */
        .userlist * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }
        
        .userlist {
            display:block;
            text-align:center;
            position:fixed;
            left:50%;
            top:8px;
            padding:12px 10px !important;
            margin:0px;
            background:rgba(20,20,20,0.98);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Roboto', sans-serif;
            border:2px solid rgba(255,255,255,0.15);
            transform:translate(-50%,0);
            border-radius:16px;
            z-index:999999999;
            display:block !important;
            height:auto !important;
            width:auto !important;
            min-width:260px;
            max-width:90vw;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        .userlist-header {
            font-size:13px;
            font-weight:600;
            color:rgba(255,255,255,0.6);
            text-transform:uppercase;
            letter-spacing:0.5px;
            margin-bottom:10px;
            -webkit-font-smoothing: antialiased;
        }
        
        .userkickmenu {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 60vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 2px;
        }
        
        .kickmenubtn {
            min-height:50px !important;
            height:auto !important;
            padding:4px !important;
            border-radius:12px !important;
            background:transparent !important;
            color:#000000 !important;
            border:none !important;
            font-size:17px !important;
            font-weight:700 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Roboto', sans-serif !important;
            cursor:pointer;
            transition: all 0.15s ease;
            width: 100%;
            -webkit-appearance: none;
            appearance: none;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform, opacity;
            touch-action: manipulation;
            -webkit-user-select: none;
            user-select: none;
        }
        
        /* Beyaz kutucuk stil - İlk resimdeki gibi */
        .username-box {
            display: inline-block;
            background: #FFFFFF;
            color: #000000;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            /* iOS için net görünüm */
            -webkit-font-smoothing: subpixel-antialiased !important;
            -moz-osx-font-smoothing: auto !important;
            text-rendering: optimizeLegibility !important;
            border: 2px solid #E0E0E0;
        }
        
        .kickmenubtn:active {
            transform: scale(0.96) translateZ(0);
        }
        
        .kickmenubtn:active .username-box {
            background: #F5F5F5;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        
        .userlist input[type=text]{
            height:40px;
            min-height:40px;
            border-radius:8px;
            font-size:15px;
            background:white;
            color:black;
            padding:8px 12px;
            border:2px solid #FFD700;
        }
        
        .userlist input[type=submit]{
            height:44px;
            min-height:44px;
            border-radius:8px;
            background:#FFD700;
            color:#000000;
            font-size:15px;
            font-weight:600;
            border:2px solid #000000;
        }
        
        .userlist input[type=checkbox]{
            margin-top:2px;
            width:24px;
            height:24px;
        }
        
        #background{
            z-index:999;
            width:0px;
            height:0px;
            position:fixed;
            left:0px;
            top:0px;
        }
        
        /* Scrollbar styling */
        .userkickmenu::-webkit-scrollbar {
            width: 6px;
        }
        
        .userkickmenu::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
        }
        
        .userkickmenu::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.4);
            border-radius: 3px;
        }
        
        .userkickmenu::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.6);
        }
        `;
        GM_addStyle(css);
    }
    
    setInterval(()=>{
        if(f("#users")){
            // Oyundaki kullanıcı listesini kontrol et ve senkronize et
            let gameUsers = [];
            fa(".nick").forEach(nick => {
                if(nick.innerText && nick.innerText.trim() !== "") {
                    gameUsers.push(nick.innerText.trim());
                }
            });
            
            // Oyunda olmayan kullanıcıları listeden kaldır
            fa(".kickmenubtn").forEach(ele=>{
                if(!gameUsers.includes(ele.textContent.trim())) {
                    ele.remove();
                }
            })
            
            // Eksik kullanıcıları ekle
            gameUsers.forEach(userName => {
                let buttonExists = false;
                fa(".kickmenubtn").forEach(btn => {
                    if(btn.textContent.trim() === userName) {
                        buttonExists = true;
                    }
                });
                
                // Eğer buton yoksa ve kullanıcı roomusers'da varsa güncelle
                if(!buttonExists) {
                    let userInRoom = roomusers.find(u => u.nick === userName);
                    if(userInRoom) {
                        updatespeckicks();
                    }
                }
            });
            
            f("g")?f("g").remove():0;
        }
        
        if(f("#background")&&!f(".userlist")){
            f("#background").innerHTML+=html
            setCSS()
        }
    },100)
}

let m_s, a_i, m_a, m_z, m_b;

const f = x => document.querySelector(x),
    sendMessage = (inputSelector, mesaj) => {
        a_i = document.querySelector(inputSelector);
        m_a = a_i.value;
        const invisibleChars = ["\u200B", "\u200C", "\u200D", "\u2060", "\u180E", "\uFEFF"];
        const randomChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
        a_i.value = randomChar + mesaj + m_a;
        m_z = new Event("input", { bubbles: !0 });
        m_z.simulated = !0;
        m_b = new Event("submit", { bubbles: !0 });
        m_b.simulated = !0;
        m_s = a_i._valueTracker;
        m_s && m_s.setValue(m_a);
        a_i.dispatchEvent(m_z);
        a_i.form.dispatchEvent(m_b);
    },
    rand = x => Math.floor(Math.random() * 1000000),
    GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),
    GM_sendMessage = (label, ...data) => GM_setValue(label, data);

GM_onMessage('ucur', (atılacak, _) => {
    atılacak && document.querySelectorAll(".nick").forEach(nick => {
        nick.innerText === atılacak && (nick.click(), f(".ic-votekick")?.click())
    })
});

GM_onMessage('msg', (i, w, _) => {
    sendMessage(i, w)
})

GM_onMessage('skip', (_, __) => {
    let leButton = document.evaluate('//*[@id="notification"]/div/div[2]/div[1]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (leButton) {
        leButton.click();}
    let reportButton = document.evaluate('//*[@id="tools"]/div/div[1]/button[4]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (reportButton) {
        reportButton.click();
        let confirmButton = document.evaluate('//*[@id="popUp"]/div/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (confirmButton) {
            confirmButton.click();
        }
    }
});

GM_onMessage('report', (_, __) => {
    let reportButton = document.evaluate('//*[@id="canvas"]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (reportButton) {
        reportButton.click();
        let confirmButton = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (confirmButton) {
            confirmButton.click();
        }
    }
});

GM_onMessage('exit', (_, __) => {
    let exitButton = document.evaluate('//*[@id="exit"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (exitButton) {
        setTimeout(function () {
            exitButton.click();
            let confirmButton = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (confirmButton) {
                confirmButton.click();
            }
        }, 0);
    }
});

window.onload = function () {
    const roomConsole = document.createElement("div");
    roomConsole.style = "color:#FFD700;margin-top:5px;font-size:14px;";
    container.appendChild(roomConsole);
    let currentGarticRoom;
    
    function getGarticRoom() {
        let garticRegex = /gartic\.io\/(.+)$/;
        let match = window.location.href.match(garticRegex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }
    
    function updateCurrentRoom() {
        let room = getGarticRoom();
        if (room !== currentGarticRoom) {
            currentGarticRoom = room;
            roomConsole.innerText = `Current Room: ${currentGarticRoom || 'No room found'}`;
        }
    }
    
    updateCurrentRoom();
    setInterval(updateCurrentRoom, 1000);
};

function createInput(width, height) {
    const input = document.createElement("input");
    input.style = `width:${width};height:${height};border-radius:5px;padding:5px;border:1px solid #FFD700;background-color:#333333;color:#FFD700;font-size:15px;`;
    return input;
}

function createButton(width, height, text, clickHandler) {
    const button = document.createElement("button");
    button.style = `width:${width};height:${height};background-color:#FFD700;color:black;border-radius:5px;border:1px solid black;margin-top:5px;font-size:15px;min-height:44px;`;
    button.textContent = text;
    button.addEventListener("mousedown", clickHandler);
    button.addEventListener("touchstart", clickHandler);
    return button;
}