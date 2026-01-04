// ==UserScript==
// @name         Krunker.io Aimbot
// @namespace    https://krunker.io/
// @version      1.0
// @description  Krunker.io aimbot script
// @author       Punit Tiwari
// @match        https://krunker.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554330/Krunkerio%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/554330/Krunkerio%20Aimbot.meta.js
// ==/UserScript==
var aimbot = {
enabled: true,
sensitivity: 1.0,
smoothness: 1.0
};
function toggleAimbot() {
aimbot.enabled = !aimbot.enabled;
if (aimbot.enabled) {
console.log('Aimbot ON');
} else {
console.log('Aimbot OFF');
}
}
function createToggleMenu() {
var menu = document.createElement('div');
menu.style.position = 'absolute';
menu.style.top = '0px';
menu.style.right = '0px';
menu.style.background = 'rgba(0, 0, 0, 0.5)';
menu.style.color = 'white';
menu.style.padding = '10px';
menu.style.fontSize = '18px';
menu.style.cursor = 'pointer';
menu.textContent = 'Aimbot: ON';
menu.onclick = function() {
toggleAimbot();
if (aimbot.enabled) {
menu.textContent = 'Aimbot: ON';
} else {
menu.textContent = 'Aimbot: OFF';
}
};
document.body.appendChild(menu);
}
setInterval(function() {
if (aimbot.enabled) {
var enemies = document.querySelectorAll('.player');
for (var i = 0; i < enemies.length; i++) {
var enemy = enemies[i];
var rect = enemy.getBoundingClientRect();
var x = rect.left + rect.width / 2;
var y = rect.top + rect.height / 2;
document.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
}
}
}, 10);
createToggleMenu();