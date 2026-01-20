// ==UserScript==
// @name         Game server Recorder
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @version      1
// @description  Record ur game easily using the script
// @author       3lectr0N!nj@
// @match        https://www.pucks.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pucks.io
// @require      https://update.greasyfork.org/scripts/539331/1638884/BumpyballioPucksio%20Decoder.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563351/Game%20server%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/563351/Game%20server%20Recorder.meta.js
// ==/UserScript==
let Rec=window.Rec=[]
let counter = null
function save(data) {
  const blob = new Blob(
    [new TextEncoder().encode(JSON.stringify(data))],
    { type: "application/octet-stream" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "replay.dat";
  a.click();
}
let server = window.server = {
    rec:false,
    t:null,
    p:null,
    o:null,
    l:null,
    s:null,
    count:0,
    state:null,
    time:300,
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
        let PID =j[8][2]
        switch(PID){
            case 2:
                server.time = Math.floor(d[34][2][13][2])
                server.state= d[24][2]
                break;
            case 12:
                server.time = Math.floor(d[13][2])
                server.state=d[24][2]
                if(server.state==5){
                    server.rec=false
                    let dat = Rec[Rec.length-1]
                    save(dat)
                    Rec[Rec.length]={}
                    server.count = 0
                }
                if(server.state==0){
                    console.log("Recording Has Started")
                    server.rec=true
                }
                break;
        }

    },
}
WebSocket.prototype.s = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
   if (!this.om){
       server.rec=true
       counter = setInterval(()=>{
           if(server.state==3){
               server.time-=1
           }
       },999)
       Rec[Rec.length]={}
       console.log("Recording Has Started")
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
           ServerPacketHandler.PacketSplitter(json)
           if(server.rec==true){
           Rec[Rec.length-1][server.count]= [json,server.time]
           server.count+=1
       }
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
           return
           }
   }
    data= new Uint8Array(data)
    let json = new BR().Sdecoder(data)
    let arr= new BR([]).Sencoder(json)
    data = new Uint8Array(arr)
    this.s(data);
    if (!this._closeBound) {
           this._closeBound = true;
           this.addEventListener('close', () => {
               let dat = Rec[Rec.length-1];
               if (server.rec && Object.keys(dat).length) {
                   save(dat);
                   clearInterval(counter);
                   counter = null;
               }
               server.count = 0;
           });
       }
}