// ==UserScript==
// @namespace          hankcolewu
// @name               Particle Swirls
// @version            1.0.1
// @description        Makes a cool particle effect with math
// @author             Hank
// @license            MIT
// @minecraft          1.20.1
// @match              https://customnpcs.com
// @scripttype         npc
// @downloadURL https://update.greasyfork.org/scripts/549324/Particle%20Swirls.user.js
// @updateURL https://update.greasyfork.org/scripts/549324/Particle%20Swirls.meta.js
// ==/UserScript==

function interact(t){
t.setCanceled(true)
ParticleOrbit(t.npc)
}

function ParticleOrbit(npc){
var Thread = Java.type("java.lang.Thread");
var HankThread = Java.extend(Thread,{
run: function(){
for(var j = 0;j<3;++j){
for(var i = 0;i<30;++i){
var d = FrontVectors(npc,i*12,0,1.3,0)
Thread.sleep(8);
npc.world.spawnParticle("smoke",npc.x+d[0],npc.y+(j+i*0.01)+d[1],npc.z+d[2], 0,0,0,0,1);
npc.world.spawnParticle("flame",npc.x+d[0],npc.y+(j+i*0.01)+d[1],npc.z+d[2], 0.1,0.1,0.1,0.01,3);}}}});
var H = new HankThread();
H.start();}

function FrontVectors(entity,dr,dp,distance,mode){
if(mode == 1){var angle = dr + entity.getRotation();
var pitch = (-entity.getPitch()+dp)*Math.PI/180}
if(mode == 0){var angle = dr;var pitch = dp*Math.PI/180}
var dx = -Math.sin(angle*Math.PI/180)*(distance*Math.cos(pitch))
var dy = Math.sin(pitch)*distance
var dz = Math.cos(angle*Math.PI/180)*(distance*Math.cos(pitch))
return [dx,dy,dz]}

//end