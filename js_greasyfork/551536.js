// ==UserScript==
// @name         Bumpyball.io/Pucks.io MOD
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @version      2
// @description  Enjoy the MOD
// @author       3lectr0N!nj@
// @match        https://www.pucks.io/*
// @match        https://www.bumpyball.io/*
// @require      https://update.greasyfork.org/scripts/539331/1638884/BumpyballioPucksio%20Decoder.js
// @require      https://update.greasyfork.org/scripts/545370/1639418/Bumpyball%20Server%20Unlimiter.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pucks.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551536/BumpyballioPucksio%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/551536/BumpyballioPucksio%20MOD.meta.js
// ==/UserScript==
let MOD = window.MOD = {
    changeteam:false,
    changeskin:false,
    movefree:false,
    movespeed:0.5,
    team:null,
    skin:null,
    hanleclient(j){
    server.client.name = j[18][2]
    server.client.pid = j[8][2]
    server.client.team = j[40][2]
    server.client.goals = j[24][2]
    server.client.assits = j[32][2]
    if(!localStorage.player){
    server.client.exp = j[64][2]
    }
    },
    handleplayers(j){
        let json = {}
    json.name=j[18][2]
    json.skin=j[48][2]
    json.team=j[40][2]
    json.id=j[8][2]
    json.bot=j[56][2]
        server.playerdetails[json.id] = json
    },
    handlepackets(j){
        let js = {}
        let data = j[18][2]
        if(j[8][2]==1){
            server.client.name = data[10][2]
            server.client.uid = data[18][2]
            server.client.skin = data[32][2]
        }
        if(j[8][2]==2){
            if(this.changeteam==true){
            data[18][2][10][2].forEach(t=>{t[40][2]=this.team})
            }
            if(this.changeskin==true){
            data[18][2][10][2].forEach(s=>{s[48][2]=this.skin})
            data[18][2][10][2].forEach(b=>{b[56][2]=(0)})
            }
            let p = data[18][2][10][2]
            let l = p.length
            let c = p[l-1]
            this.hanleclient(c)
            if(localStorage.player){
            data[18][2][10][2][l-1][64][2]=server.client.exp
            }
            server.players=p
            server.playerdetails=[]
            p.forEach(i=>{this.handleplayers(i)})
            data[10][2][10][2].forEach(i=>{
                let id = i[18][2][24][2]
                server.playerdetails.forEach(e=>{
             if(e.id==id){
             e.eid = i[8][2]
             }
         })
            })
        }
        if(j[8][2]==3){
            if(localStorage.player){
            data[10][2].forEach(i=>{if(i[8][2]==server.client.pid){i[64][2]=server.client.exp}})
            }
            if(this.changeteam==true){
            data[10][2].forEach(t=>{t[40][2]=this.team})
            }
            if(this.changeskin==true){
            data[10][2].forEach(t=>{t[48][2]=this.skin})
            data[10][2].forEach(t=>{t[56][2]=0})
            }
             let p = data[10][2]
             p.forEach(i=>{this.handleplayers(i)})
             server.players.push(p[0])
        }
        if(j[8][2]==4){
            delete server.playerdetails[(data[8][2])]
        }
        if(j[8][2]==6){
            if(data[8][2]==server.client.eid){
                if(this.movefree==true){
                    data[29][2] = server.client.entity.angle + (0.3/2)*server.client.z
                    let angle = data[29][2]
                    data[18][2][13][2] = server.client.entity.x + (server.client.command ? this.movespeed + 1.5 :this.movespeed)*server.client.x*Math.cos(angle+Math.PI/2)
                    data[18][2][21][2] = server.client.entity.z + (server.client.command ? this.movespeed + 1.5 :this.movespeed)*server.client.x*Math.sin(angle+Math.PI/2)
                }
                server.client.entity.x =data[18][2][13][2]
                server.client.entity.z =data[18][2][21][2]
                server.client.entity.angle =data[29][2]
            }
        }
        if(j[8][2]==7){
            let[command,x]=[data[8][2],data[18][2][13][2]]
            if(command==1&&Math.sign(x)==1&&server.client.command==0){
                      server.client.command=1
                      server.client.x=1
                    }
                    if(command==1&&Math.sign(x)==0&&server.client.command==1){
                      server.client.command=0
                      server.client.x=0
                    }
                    if(server.client.command==0&&command==0)server.client.x=Math.sign(x)
            server.client.z=data[18][2][21][2]
            server.client.eid=data[24][2]
        }
        if(j[8][2]==8){
            let id = data[26][2][24][2]
            if(id==server.client.pid){
                server.client.entity.x = data[26][2][10][2][13][2]
                server.client.entity.z = data[26][2][10][2][21][2]
                server.client.entity.angle = data[26][2][37][2]
            }
         server.playerdetails.forEach(i=>{
             if(i.id==id){
             i.eid = data[16][2]
             }
         })
            if(data[26][2][16][2]==1){
                server.ball.id=data[16][2]
            }
        }
        if(j[8][2]==9){
            let e = data[18][2][16][2]
            if(e==0){
                data[24][2]=4
            }
        }
        if(j[8][2]==13){
            server.playerdetails.forEach(i=>{
            if(i.id==data[16][2]){
            i.team=data[8][2]
            }
        })
            if(this.changeteam==true){
            data[8][2]=this.team
            }
        }
        if(j[8][2]==14){
            if(this.changeteam==true){
                data[10][2].forEach(t=>{t[40][2]=this.team})
            }
            if(this.changeskin==true){
                data[10][2].forEach(s=>{s[48][2]=this.skin})
                data[10][2].forEach(b=>{b[56][2]=0})
            }
        }
        if(j[8][2]==17){
        //    data[10][2][96][2]=13
        //    data[10][2][88][2]=22081850
        //    data[10][2][72][2]=0
        //    data[10][2][64][2]=0
        //    data[10][2][48][2]=0
        //    data[10][2][56][2]=1
        //    data[10][2][40][2]=9999999
        }
        js[8] = ["packetid","int",j[8][2]]
        js[18]=["data","dict",data]
        return js
    },
    handleomp(j){
        for (let b in j) {
        let _j = j[b]
        j[b]=this.handlepackets(_j)
            if(_j[8][2]==5){
                let data = _j[18][2]
            let msg = data[18][2]
            console.log(msg)
            if(msg.includes("!magic8ball")){
                const responses = [
        "Yes, definitely!",
        "Absolutely not.",
        "Ask again later.",
        "I'm not sure, try again.",
        "Yes, but with caution.",
        "No way!",
        "Probably.",
        "Very likely!",
        "Don't count on it.",
        "Yes, but it's complicated."
    ];
               let r = {
        8: ["PacketId","int",5],
        18: ["Data","dict",{
        8: ["playerId", "uint",server.client.pid+1000],
        18: ["message", "string","Mr.Magic8Ball:"+responses[Math.floor(Math.random() * responses.length)]]
        }]
    }
               server.ws.s(new Uint8Array(new BR().Sencoder(r)))
            }
        }
        }
        return j
    },
    switchteam(){
        this.changeteam =true
        this.team= Number(prompt('Enter team code\nRed team-0\nBlue team-1\nSpectator team-2\nGhost team-3'))
        let p =server.players
        p.forEach(i=>{
            let id = i[8][2]
            let js = {}
            let l = {
                8:['team', 'uint', this.team],
                16:['id', 'uint', id]
            }
            js[8]=["PacketID","int",13]
            js[18] = ["Data","dict",l]
            let a =new BR().Mencoder({0:js})
        let arr = new Uint8Array(a)
        server.om(arr)
            return arr
                     })
    },
    switchskin(){
        this.changeskin =true
        this.skin = Number(prompt('Choose the car you want:\n'+
                    'Level:Car-Code\nLevel-:Cruiser-1\nLevel-2:Tricked Out-2\nLevel-3:Bugged Out-3\nLevel-4:Taxi Cab-4\nLevel-5:Hot Rod-5\nLevel-7:Drag Racer-6\nLevel-10:Classic-7\nLevel-12:Soccer-Van-8\nLevel-15:Cement Mixer-9\nLevel-20:Apocalypse-10\nLevel-25:Dump Truck-11\nLevel-30:Steam Roller-12\nLevel-35:Box Car-14\nLevel-50:Pusher-13'))
    },
    stopteam(){
        this.changeteam=false
    },
    stopskin(){
        this.changeteam=false
    },
    movefreely(){
    this.movefree = true
    },
    stopmovefree(){
        this.movefree = false
    },
    changemovespeed(){
        this.movespeed== prompt("Enter the speed u want")
    },
    chat(){
    let msg = prompt("Enter ur message")
    let j = {
        8: ["PacketId","int",5],
        18: ["Data","dict",{
        8: ["playerId", "uint",server.client.pid],
        18: ["message", "string",msg]
        }]
    }
    let a = new BR().Sencoder(j)
    let arr = new Uint8Array(a)
    server.ws.s(arr)
    }
}
let server = {
    ws:null,
    t:null,
    p:null,
    o:null,
    l:null,
    s:null,
    client:{
        entity:{
        x:0,
        z:0,
        },
        command:0
    },
    ball:{
        id:0,
        x:0,
        z:0,
    },
    players:[],
    playerdetails:[],
    om(uint8Array){
    const m = new Blob([uint8Array], { type: "" });
               const msg = new MessageEvent(this.t, {
                data: m,
                ports: this.p,
                origin: this.o,
                lastEventId: this.l,
                source: this.s,
            })
               this.ws.om(msg);
    }
}
WebSocket.prototype.s = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
   if (!this.om) {
           server.ws = this;
           this.om = this.onmessage;
           this.onmessage = async (e) => {
               server.t = e.type
               server.p = e.ports
               server.o = e.origin
               server.l = e.lastEventID
               server.s = e.source
               const arrayBuffer = await e.data.arrayBuffer();
               let uint8Array = new Uint8Array(arrayBuffer);
               let json = new BR().Mdecoder(uint8Array)
               json = MOD.handleomp(json)
               let arr = new BR([]).Mencoder(json)
               uint8Array = new Uint8Array(arr)
               const m = new Blob([uint8Array], { type: "" });
               const msg = new MessageEvent(e.type, {
                data: m,
                ports: e.ports,
                origin: e.origin,
                lastEventId: e.lastEventId,
                source: e.source,
            })
               this.om(msg);
           }
   }
    data= new Uint8Array(data)
    let json = new BR().Sdecoder(data)
    json = MOD.handlepackets(json)
    let arr= new BR([]).Sencoder(json)
    data = new Uint8Array(arr)
   this.s(data);
}

let bboost = null;
let t = 130;

function Space_down() {
    const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        which: 32,
        keyCode: 32,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

function Space_up() {
    const event = new KeyboardEvent('keyup', {
        key: ' ',
        code: 'Space',
        which: 32,
        keyCode: 32,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

function startBoost() {
    if (bboost) return; // prevent multiple intervals
    bboost = setInterval(() => {
        Space_down();
        setTimeout(Space_up, t);
    }, t);
}

function stopBoost() {
    if (bboost) {
        clearInterval(bboost);
        bboost = null;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "KeyS" || e.code === "ArrowDown") {
        startBoost();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "KeyS" || e.code === "ArrowDown") {
        stopBoost();
    }
});
