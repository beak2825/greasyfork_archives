// ==UserScript==
// @name         Game server Replayer
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @version      1
// @description  Record ur game easily using the script
// @author       3lectr0N!nj@
// @match        https://www.pucks.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pucks.io
// @require      https://update.greasyfork.org/scripts/539331/1638884/BumpyballioPucksio%20Decoder.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563352/Game%20server%20Replayer.user.js
// @updateURL https://update.greasyfork.org/scripts/563352/Game%20server%20Replayer.meta.js
// ==/UserScript==
let InReplay=false
let Rep=window.Rep={}
function load() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.dat";

  input.onchange = async () => {
    const data = JSON.parse(await input.files[0].text());
    window.Rep = data;
    console.log("Replay loaded");
  };

  input.click();
};
let server = window.server = {
    t:null,
    p:null,
    o:null,
    l:null,
    s:null,
    onmessage(j){
        let arr = new Uint8Array(new BR([]).Mencoder(j))
        const m = new Blob([arr], { type: "" });
        const msg = new MessageEvent(this.t, {
               data: m,
               ports: this.p,
               origin: this.o,
               lastEventId: this.l,
               source: this.s,
            })
           this.ws.om(msg);
    },
}
let ServerPacketHandler = window.ServerPacketHandler={
    PacketSplitter(j){
        for (let b in j) {
        let _j = j[b]
        this.HandlePackets(_j)
        }
    },
    HandlePackets(j){
        let d=j[18][2]
        switch(j[8][2]){
            case 2:
                server.clientID=d[24][2]
                server.players=[]
                d[18][2][10][2].forEach(i=>{server.players.push(i[8][2])})
                server.entities=[]
                d[10][2][10][2].forEach(i=>{server.entities.push(i[8][2])})
                ReplayHandler.score=d[34][2][18][2]
                break;
            case 3:
                d[10][2].forEach(i=>{if (!server.players.includes(i[8][2])) {server.players.push(i[8][2])}})
                break;
            case 8:
                if(j[18][2][26][2][24][2]==server.clientID){
                server.clientEID=d[16][2]
                }
                if(server.clientID!==d[26][2][24][2]){
                server.entities.push(d[16][2])}
                break;
            case 12:
                this.s = d[24][2]
                if(this.s==2){
                    ReplayHandler.play=false
                    setTimeout(()=>{
                        ReplayHandler.play=true
                        j[18][2][24][2]=3
                        server.onmessage({0:j})
                    },3500)
                }
                ReplayHandler.score=d[18][2]
        }

    },
}
let ReplayHandler = window.ReplayHandler={
    play:true,
    speed:75,
    frame:0,
    stop:false,
    HandleChat(j){
        let d=j[18][2]
        let m = d[18][2]
        switch(m){
            case "/play":
                this.StartReplay()
                break;
        }
    },
    PacketSplitter(j){
        for (let b in j) {
            let _j = j[b]
            j[b] = this.HandlePackets(_j)
            ServerPacketHandler.HandlePackets(_j)
            if(j[b][8][2]==2){
              delete (j[b])
          }
        }
        server.onmessage(j)
    },
    HandlePackets(j){
        let PID = j[8][2]
        let data = j[18][2]
        let cid;let eid
        if(PID==2){
                cid = data[24][2]
                data[18][2][10][2].forEach(i=>{
                    if(i[8][2]!==cid){
                        this.Connect(i[8][2],i[18][2],i[56][2],i[24][2],i[32][2],i[40][2],i[48][2],i[64][2])
                    }
                })
                data[10][2][10][2].forEach(i=>{
                    if(i[18][2][24][2]!==cid){
                        this.Modify(i[8][2],i[18][2][10][2][13][2],i[18][2][10][2][21][2],i[18][2][16][2],i[18][2][24][2],i[18][2][37][2],i[18][2][42][2][13][2],i[18][2][42][2][21][2])
                    }
                })
            this.Gamestate(data[34][2][13][2],data[34][2][18][2],data[34][2][24][2])
        }
        return j
    },
    AFK(){
        setInterval(() => {
            let j= {
        8: ["PacketId", "int",7],
        18: ["Data", "dict",{
        8: ["command", "bool",0],
        18: ["position", "dict", {
            13: ["x", "float",1],
            21: ["z", "float",0],
        }],
        24: ["EID", "uint",1099],
        }]
}
            let arr= new BR([]).Sencoder(j)
            let data = new Uint8Array(arr)
            server.ws.s(data)
        },5000)
    },
    StartReplay(){
        this.AFK()
        InReplay=true
        server.players.forEach(id=>{
                if(id==server.clientID){
                    let j={
        8: ["PacketId","int",5],
        18: ["Data","dict",{
        8: ["playerId", "uint",id],
        18: ["message", "string","/team spectator"]
        }]
    }
                    let c={
        8: ["PacketId","int",5],
        18: ["Data","dict",{
        8: ["playerId", "uint",2143],
        18: ["message", "string"," "]
        }]
    }
                    let arr= new BR([]).Sencoder(j)
                    let data = new Uint8Array(arr)
                    server.ws.s(data);
                    for (let i = 0; i < 11; i++) {
                        arr= new BR([]).Sencoder(c)
                        data = new Uint8Array(arr)
                        server.ws.s(data);
}
            }
                else{
                    ReplayHandler.ChangeTeam(3,id)
                }
            })
        server.entities.forEach(id=>{
                ReplayHandler.Destroy(id,1000,1000,4,0,0,0,0)
            })
        setInterval(()=>{
            if(this.play==true){
                if(Object.keys(window.Rep).length>=ReplayHandler.frame)ReplayHandler.PacketSplitter(window.Rep[ReplayHandler.frame][0])
            this.Gamestate(window.Rep[ReplayHandler.frame][1],ReplayHandler.score,3)
                this.frame+=1
            }
        },this.speed)
    },
    Connect(id,name,bot,goals,assits,team,skinId,experience){
        let j={0:{
        8:  ["PacketId","int",3],
        18: ["Data","dict",{
        10: ["list", "dict", {
            8: ["id", "int",id],
            18: ["name", "string",name],
            56: ["bot", "int",bot],
            24: ["goals", "uint",goals],
            32: ["assits", "uint",assits],
            40: ["team", "uint",team],
            48: ["skinId", "uint",skinId],
            64: ["experience", "uint",experience],
        }]
        }]
    }}
        server.onmessage(j)
    },
    Disconnect(id){
        let j={0:{
        8: ["PacketId", "uint",4],
        18: ["Data", "dict",{
        8: ["playerId", "uint",id],
        }]
    }}
        server.onmessage(j)
    },
    Transform(id,x,z,rotation){
        let j={0:{
        8:  ["PacketId","int",6],
        18: ["Data","dict",{
        8: ["id", "uint",id],
        18: ["position", "dict", {
            13: ["x", "float",x],
            21: ["z", "float",z]
        }],
        29: ["rotation", "float",rotation],
        }]
    }}
        server.onmessage(j)
    },
    Modify(id,px,pz,entityType,playerId,rotation,fx,fz){
        let j={0:{
        8: ["PacketId", "int",8],
        18: ["Data", "dict",{
        16: ["id", "uint",id],
        26: ["entity", "dict", {
            10: ["position", "dict", {
                13: ["x", "float",px],
                21: ["z", "float",pz],
            }],
            16: ["entityType", "uint",entityType],
            24: ["playerId", "uint",playerId],
            37: ["rotation", "float",rotation],
            42: ["forces", "dict", {
                13: ["x", "float",fx],
                21: ["z", "float",fz],
            }],
        }]
        }]
    }}
        server.onmessage(j)
    },
    Destroy(id,px,pz,entityType,playerId,rotation,fx,fz){
        let j={0:{
        8: ["PacketId", "uint",9],
        18: ["Data", "dict",{
        8: ["id", "uint",id],
        24: ["reason", "uint",3],
        18: ["entity", "dict", {
            10: ["position", "dict", {
                13: ["x", "float",px],
                21: ["z", "float",pz],
            }],
            24: ["playerId", "uint",playerId],
            16: ["entityType", "uint",entityType],
            37: ["rotation", "float",rotation],
            42: ["forces", "dict", {
                13: ["x", "float",fx],
                21: ["z", "float",fz],
            }],
        }],
        }]
    }}
        server.onmessage(j)
    },
    Announcement(message,playerIdA,playerIdB){
        let j={0:{
        8:  ["PacketId","int",11],
        18: ["Data","dict",{
        10: ["message", "string",message],
        16: ["playerIdA", "uint",playerIdA],
        24: ["playerIdB", "uint",playerIdB],
        }]
    }}
        server.onmessage(j)
    },
    Gamestate(timeRemaining,score,gameState){
        let j={0:{
        8: ["PacketId", "int",12],
        18: ["Data", "dict",{
        13: ["timeRemaining", "float",timeRemaining],
        18: score,
        24: ["gameState", "int",gameState],
        }]
    }}
        server.onmessage(j)
    },
    ChangeTeam(team,id){
        let j={0:{
        8: ["PacketId", "int",13],
        18: ["Data", "dict",{
        8: ["team", "uint",team],
        16: ["id", "uint",id]
        }]
    }}
        server.onmessage(j)
    },
}
WebSocket.prototype.s = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
   if (!this.om){
       load()
       server.ws = this;
       this.om = this.onmessage;
       this.onmessage = async (e) => {
           server.t = e.type
           server.p = e.ports
           server.o = e.origin
           server.l = e.lastEventId
           server.s = e.source
           const arrayBuffer = await e.data.arrayBuffer();
           let uint8Array = new Uint8Array(arrayBuffer);
           let json = new BR().Mdecoder(uint8Array)
           let arr
           if(InReplay==false){
               ServerPacketHandler.PacketSplitter(json)
               arr = new BR([]).Mencoder(json)
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
           return
           }
   }
    data= new Uint8Array(data)
    let json = new BR().Sdecoder(data)
    if(json[8][2]==5)ReplayHandler.HandleChat(json)
    let arr= new BR([]).Sencoder(json)
    data = new Uint8Array(arr)
    this.s(data);
}