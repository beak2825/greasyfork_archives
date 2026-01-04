// ==UserScript==
// @namespace          hankcolewu
// @name               Fog Wall
// @version            1.0.1
// @description        Makes dark souls like fog wall
// @author             Hank
// @license            MIT
// @minecraft          1.12.2
// @match              https://customnpcs.com
// @scripttype         block
// @downloadURL https://update.greasyfork.org/scripts/549322/Fog%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/549322/Fog%20Wall.meta.js
// ==/UserScript==

var direction = "north" //use north/south/east/west or barrier
var message = "You cannot leave!"
var particle = "cloud"

/* For block above
function init(t){
t.block.setModel("minecraft:barrier")
t.block.setIsPassible(true)}
*/

var dx,dz
function init(t){
DD(t);
t.block.setModel("minecraft:barrier")
if(direction == "barrier")t.block.setIsPassible(false)
else{t.block.setIsPassible(true)}}

function collide(t){
if(t.entity.getType() == 2){t.entity.setMotionX(dx);t.entity.setMotionZ(dz)}
if(t.entity.getType() == 1){
var inside = t.block.world.getBlock(t.block.x+dx,t.block.y,t.block.z+dz).getPos()
var outside = t.block.world.getBlock(t.block.x-dx,t.block.y,t.block.z-dz).getPos()
if(!t.block.timers.has(1) && t.entity.getPos().distanceTo(inside) <= t.entity.getPos().distanceTo(outside)){
if(!t.block.timers.has(2))t.entity.message(message)
t.block.timers.forceStart(2,20,false)
t.entity.setMotionX(dx)
t.entity.setMotionZ(dz)}
else{
t.block.timers.forceStart(1,1,false)}}}

function DD(t){
if(direction == "north"){dx = 0;dz = -1;}
else if(direction == "south"){dx = 0;dz = 1;}
else if(direction == "east"){dx = 1;dz = 0;}
else if(direction == "west"){dx = -1;dz = 0;}
else{dx=0,dz=0}}

function tick(t){
t.block.world.spawnParticle(particle,t.block.x+0.5,t.block.y+1,t.block.z+0.5,0.3,0.7,0.3,0,50)}

//end