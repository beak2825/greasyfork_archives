// ==UserScript==
// @name         Украшения для Лолза
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Круглая главная аватарка + 26 эксклюзивных рамок
// @author       Forest
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560196/%D0%A3%D0%BA%D1%80%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%BB%D0%B7%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/560196/%D0%A3%D0%BA%D1%80%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%BB%D0%B7%D0%B0.meta.js
// ==/UserScript==

(function() {
'use strict';

const PRESETS = [
{ name: "Без рамки", url: "" },
{ name: "Синяя Аура", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_a53c1f92a2a6eeb44a1a5903706d95d5.png?size=240&passthrough=true" },
{ name: "Луна", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_7e68c00aa5c50a066b4eb66209204315.png?size=240&passthrough=true" },
{ name: "Сумерки", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_17e170cd07a325877152cc0ae31c3219.png?size=240&passthrough=true" },
{ name: "Галлюцинация", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_57807030ab60f7ac0c4a1998aa091bbf.png?size=240&passthrough=true" },
{ name: "Сакуна", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_d7cf411174a2bb037544c8517fbafa66.png?size=240&passthrough=true" },
{ name: "Сатора", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_e018d593f1b7da324878339a50e23f36.png?size=240&passthrough=true" },
{ name: "Глаз", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_e27ca3c6b6846cdc0ea84f13ad6c4812.png?size=240&passthrough=true" },
{ name: "Гнев", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_3c97a2d37f433a7913a1c7b7a735d000.png?size=240&passthrough=true" },
{ name: "Кошачьи Ушки", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c3cffc19e9784f7d0b005eecdf1b566e.png?size=240&passthrough=true" },
{ name: "Ангел", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c86b11a49bb8057ce9c974a6f7ad658a.png?size=240&passthrough=true" },
{ name: "Голографический дракон", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_94febf08c37b21ee5ed92c49ef98bf00.png?size=240&passthrough=true" },
{ name: "Гирлянды", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_dff769a0f922bb56ab0d4ba2bcbacfae.png?size=240&passthrough=true" },
{ name: "Цветение сердца", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_3e1fc3c7ee2e34e8176f4737427e8f4f.png?size=240&passthrough=true" },
{ name: "Медведь пекарь", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_1953da70cb693d9a27178eca180f8cb5.png?size=240&passthrough=true" },
{ name: "Пришла любовь", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_8ffa2ba9bff18e96b76c2e66fd0d7fa3.png?size=240&passthrough=true" },
{ name: "Идет буферизация", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_780cd1b7e878dce85d20c7ee495a86fe.png?size=240&passthrough=true" },
{ name: "Голодный котик", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_b524fa5c3f80fbea3865a5d130ab5aef.png?size=240&passthrough=true" },
{ name: "Просто милашка", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_4774e1f97ebd4a8cc8f71668f3b418e4.png?size=240&passthrough=true" },
{ name: "Lofi cat", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_96f65d0aacc4a94b50ef7fb656d5826d.png?size=240&passthrough=true" },
{ name: "Lofi Girl", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_60cb281fac6d8f558efaf6dd9fe4dbe4.png?size=240&passthrough=true" },
{ name: "Сердечные дела", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_63a69109db554a66764cbe61c6e556ef.png?size=240&passthrough=true" },
{ name: "Дьявол", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_b4dcf63b6af2e20cba91af61c0e3a8a7.png?size=240&passthrough=true" },
{ name: "Мини-Гоку", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_32b48fb7742f69d1f870bccfeb42044d.png?size=240&passthrough=true" },
{ name: "Попрыгунчик", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_e22efcfce93b573d94278f00967d1f5e.png?size=240&passthrough=true" }
];

let currentFrameUrl = GM_getValue('myFrameUrl', '');
let disableProfileFrame = GM_getValue('disableProfileFrame', false);

const style = document.createElement('style');
style.textContent = `
.lzt-frame-overlay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;background-size:contain;background-repeat:no-repeat;background-position:center;z-index:100}
.lzt-frame-overlay{width:120%;height:120%}
.lzt-frame-overlay.is-profile{width:115%;height:115%}
.lzt-frame-overlay.is-micro{width:200%;height:200%}
.avatar::before,.navTab--visitorAvatar::before,.menuAvatar::before,.content-check::before{display:none!important;content:none!important}
.user-avatar-block.has-custom-frame{width:152px!important;height:152px!important;position:relative!important;overflow:visible!important;display:block!important}
.user-avatar-block.has-custom-frame>a{display:block!important;width:152px!important;height:152px!important;border-radius:50%!important;overflow:hidden!important;position:relative!important}
.user-avatar-block.has-custom-frame img.Av{width:152px!important;height:152px!important;border-radius:50%!important;object-fit:cover!important;display:block!important}
.user-avatar-block.has-custom-frame>.lzt-frame-overlay.is-profile{position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:175px!important;height:175px!important;z-index:100!important}
.unfurl_avatar-title-subtitle{overflow:hidden!important}
`;
document.head.appendChild(style);

function getMyId() {
if (typeof XenForo !== 'undefined' && XenForo.visitor) return XenForo.visitor.user_id;
const visitorAvatar = document.querySelector('.navTab--visitorAvatar');
if (visitorAvatar) {
const m = visitorAvatar.src.match(/\/(\d+)\.webp/);
if (m) return m[1];
}
return null;
}

const myId = getMyId();

function isInsideUnfurlAncestor(node) {
let p = node;
while (p && p !== document.documentElement) {
if (p.className && typeof p.className === 'string') {
for (let c of p.className.split(/\s+/)) {
if (c.indexOf('unfurl') === 0) return true;
}
}
p = p.parentElement;
}
return false;
}

function applyFrames() {
if (!myId) return;
const selector = `img[src*="/${myId}.webp"],img[src*="/${myId}.jpg"],img[src*="/${myId}.gif"],img[src*="/${myId}/"],span.img[style*="/${myId}.webp"]`;
document.querySelectorAll(selector).forEach(el => {
if (isInsideUnfurlAncestor(el) || el.classList.contains('unfurl_user-avatar')) return;

let container = el.parentElement;
const w = el.offsetWidth || el.width || 0;
const h = el.offsetHeight || el.height || 0;
if ((w > 0 && w < 25) || (h > 0 && h < 25)) return;

const profileBlock = el.closest('.user-avatar-block');
const isProfile = !!profileBlock;
const isMicro = ((h >= 25 && h < 36) || (w >= 25 && w < 36));

if (!currentFrameUrl || (isProfile && disableProfileFrame)) return;

if (isProfile) {
if (!profileBlock.querySelector('.lzt-frame-overlay')) {
const frame = document.createElement('div');
frame.className = 'lzt-frame-overlay is-profile';
frame.style.backgroundImage = `url('${currentFrameUrl}')`;
profileBlock.classList.add('has-custom-frame');
profileBlock.appendChild(frame);
}
} else {
if (!container.querySelector('.lzt-frame-overlay')) {
const frame = document.createElement('div');
frame.className = 'lzt-frame-overlay' + (isMicro ? ' is-micro' : '');
frame.style.backgroundImage = `url('${currentFrameUrl}')`;
container.style.overflow = 'visible';
if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
container.appendChild(frame);
}
}
});
}

setInterval(applyFrames, 1000);
})();
