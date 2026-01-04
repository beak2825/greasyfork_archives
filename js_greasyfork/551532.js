// ==UserScript==
// @name           Tsu-Wings
// @namespace      https://github.com/GameSketchers/TsuWings
// @version        tech-demo
// @description    for wings.io Player-esp, Aimbot, Background-image
// @author         Qwyua
// @match          *://wings.io/*
// @icon           https://github.com/GameSketchers/TsuWings/raw/main/assets/header.png
// @grant          unsafeWindow
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/551532/Tsu-Wings.user.js
// @updateURL https://update.greasyfork.org/scripts/551532/Tsu-Wings.meta.js
// ==/UserScript==
unsafeWindow.asd=false
/*    console.log("v (nesne):", JSON.stringify(v));*/
class Wings{
    static injectHTML=async()=>{
        try{
            document.open();
                      document.write(
                (await (await fetch(location.href)).text())
                    .replace(`<script>
(function(w,x,s){`,`<script>(function(w,x,s){let rightMousePressed=!1;let tsuTargetPlayer = "";let myID;let myX;let myY;`)
                    .replace(`b.mousedown=function(a){`,`b.mousedown=function(a){a.button===2&&(rightMousePressed=!0);`)
                    .replace(`b.mouseup=function(a){`,`b.mouseup=function(a){a.button===2&&(rightMousePressed=!1);`)
                    .replaceAll(`x.create`,`document.create`)
                    .replace(
    /if\s*\(V\.mouseMoved\)\s*\{[\s\S]*?\}/,
`if (V.mouseMoved) {
  //  console.log("=== BLOK CALISTI ===");
  //  console.log("mc (mouseX):", mc, "nc (mouseY):", nc);
   // console.log("z:", JSON.stringify(z), "d:", JSON.stringify(d));
   // console.log(B)

    a = 1;
    Ga || (a = 2);
 //   console.log("Ga:", Ga, "a (scaleee):", a);

    let keys = Object.keys(B);

    if (rightMousePressed) {
        // sag click basiliysa en yakini bul (biz haric)
        if (tsuTargetPlayer === "") {
            let nearestplayerTsu = null;
            let nearestDistance = Infinity;

            for (let i = 0; i < keys.length; i++) {
                let playerTsu = B[keys[i]];
                if (playerTsu && playerTsu.name && playerTsu.id !== myID) {
                    let Distance = Math.sqrt(Math.pow(playerTsu.x - myX, 2) + Math.pow(playerTsu.y - myY, 2));
                    if (Distance < nearestDistance) {
                        nearestDistance = Distance;
                        nearestplayerTsu = playerTsu;
                    }
                }
            }

            if (nearestplayerTsu) {
                tsuTargetPlayer = nearestplayerTsu.name;
               // console.log("target playerTsu saved:", tsuTargetPlayer, "Distance:", nearestDistance);
            }
        } else {
            // Kayitli playerTsunun koordinatlarini al
            for (let i = 0; i < keys.length; i++) {
                let playerTsu = B[keys[i]];
                if (playerTsu && playerTsu.name === tsuTargetPlayer) {
                    Yb = playerTsu.origX;
                    Zb = playerTsu.origY;
                 //   console.log("target player", tsuTargetPlayer, "X:", Yb, "Y:", Zb);
                    break;
                }
            }
        }
    } else {
        if (tsuTargetPlayer !== "") {
         //   console.log("reset target player:", tsuTargetPlayer);
            tsuTargetPlayer = "";
        }
        Yb = (mc + (z.x * z.zoom - d.width * a / 2)) / z.zoom;
        Zb = (nc + (z.y * z.zoom - d.height * a / 2)) / z.zoom;
    }

    a = Yb - v.x;
    var s = Zb - v.y;
    var f = Math.sqrt(a * a + s * s);
   // console.log("dx:", a, "dy:", s, "distance f:", f);

    a /= f;
    s /= f;
  //  console.log("asd:", {ax: a, sy: s});

    V.hover = 75 < f ? 0 : 1;
 //   console.log("hover :", V.hover);

    var t = f = 0;
    wa && (f = a, t = -s);
 //   console.log("wa:", wa, "f:", f, "t:", t);

    if (0 != f) {
        a = Math.atan(t / f);
        if (0 > f) a = Math.PI + a;
        a += Math.PI / 2;
        V.angle = a;
      //  console.log("xxxxxxx (V.angle):", V.angle);
    }
  //  console.log("=== BLOT BITTI ===");
}`)
                    /*.replace(`this.sendInput=function(){var b=new ArrayBuffer(10),a=new DataView(b);`,`this.sendInput=function(){var b=new ArrayBuffer(10),a=new DataView(b);console.log(V);`)*/
                          /*
.replaceAll(`e.send(a)`,
  `e.send(a);
   console.log("a as Uint8:", new Uint8Array(a),
               "Uint16:", a.byteLength%2===0?new Uint16Array(a):"length not multiple of 2",
               "Uint32:", a.byteLength%4===0?new Uint32Array(a):"length not multiple of 4");console.trace();`)*/
/*.replaceAll(`e.send(b)`,
  `e.send(b);
   console.log("b as Uint8:", new Uint8Array(b),
               "Uint16:", b.byteLength%2===0?new Uint16Array(b):"length not multiple of 2",
               "Uint32:", b.byteLength%4===0?new Uint32Array(b):"length not multiple of 4");console.trace();`)*/
/*.replaceAll(`e.send(c)`,
  `e.send(c);
   console.log("c as Uint8:", new Uint8Array(c),
               "Uint16:", c.byteLength%2===0?new Uint16Array(c):"length not multiple of 2",
               "Uint32:", c.byteLength%4===0?new Uint32Array(c):"length not multiple of 4");console.trace();`)*/

                    .replace(`this.sentHello=this.hasConnection=!1;`,`this.sentHello = this.hasConnection =true;`)
                    .replace(`a.fill();a.restore();`,`a.fill();myID=this.id;myX=this.x;myY=this.y;a.restore();Object.values(B).forEach(p=>{let dx=p.dstX-this.x,dy=p.dstY-this.y,px=this.x+dx,py=this.y+dy,dist=Math.sqrt(dx*dx+dy*dy),ratio=Math.min(1,dist/1000),r=Math.round(255*ratio),g=Math.round(255*(1-ratio/1.5)),oldS=a.strokeStyle,oldW=a.lineWidth;a.lineWidth=0.5;a.strokeStyle='rgb('+r+','+g+',0)';a.beginPath();a.moveTo(this.x,this.y);a.lineTo(px,py);a.stroke();a.strokeStyle=oldS;a.lineWidth=oldW;});
`)
                         .replace(
    /b\.mousemove\s*=\s*function\s*\(a\)\s*\{[\s\S]*?\};/,
    `b.mousemove = function(a) {

        if (!Y && (b.mouseMoved = true,
        mc = a.clientX,
        nc = a.clientY,
        f)) {
            alert("asd");
            var c = a.clientY - d,
                g = z.x,
                h = z.y;
            g = g - (a.clientX - e);
            h = h - c;
            console.log(c, g, h);
            h < -E/2 ? h = -E/2 : h > E/2 && (h = E/2);
            g < -$ ? g = -$ : g > $ && (g = $);
            z.setPosition(g, h);
            e = a.clientX;
            d = a.clientY;
        }
    };`
)
                    .replace(`"LEADERBOARD";`, `"LEADERBOARD";
console.log(B);
//console.log(a);
window.asd && Object.values(B).forEach(p => ((scale=0.1, x=a.canvas.width/2+p.dstX*scale, y=a.canvas.height/2+p.dstY*scale, a.beginPath(), a.moveTo(a.canvas.width/2,a.canvas.height/2), a.lineTo(x,y), a.strokeStyle="red", a.lineWidth=2, a.stroke(), a.fillStyle="yellow", a.beginPath(), a.arc(x,y,6,0,2*Math.PI), a.fill(), p.name && (a.fillStyle="white", a.font="12px Arial", a.fillText(p.name,x+8,y-8)))));

`)
///.replace(`this.addShot=function(f,e,d,a){`,`this.addShot=function(f,e,d,a){console.log(f,e,d,a);`)


                    .replaceAll(
                        `sendShooting=function(b){`,
                        `sendShooting=function(b){console.log(b);`
                    )
                          .replace(`PlayerFollowing=function(a){`,`PlayerFollowing=function(a){console.log(a);`)
            );
            document.close();
            console.log(`Active!`)
        }catch(e){console.error(e)}
    };
}
Wings.injectHTML()


/*
.replace(/this\.drawGradient\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\};/,`
this.backgroundImage = new Image();
this.backgroundImage.src = "https://tse1.mm.bing.net/th/id/OIP.JbiMJV8JCTVhd-5gM10ASAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3";
this.drawGradient = function(a) {
    var c = (canvas.width / 2 + (z.x * z.zoom - canvas.width / 2)) / z.zoom;
    var b = (canvas.height / 2 + (z.y * z.zoom - canvas.height / 2)) / z.zoom;
    var width = canvas.width / z.zoom;
    var height = canvas.height / z.zoom;
    if (this.backgroundImage.complete) {
        a.drawImage(this.backgroundImage, c - width / 2, b - height / 2, width, height);
    }
};
`)
*/