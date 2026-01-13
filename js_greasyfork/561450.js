
// ==UserScript==
// @name         X-GUI CLIENT FOR BLOOKET
// @namespace    http://tampermonkey.net/
// @version      6.70x
// @description  NOT PATCHED ANYMORE, THE BEST GUI ON THE WEB! ADVANCED ANTIBAN AND TONS OF FEATURES {CHEAT} {HACK} {CLIENT}
// @author       Tony-the-best
// @run-at       document-end
// @match        *://*.blooket.com/*
// @match        *://blooket.com/*
// @license      APGL-3.0
// @icon         https://i.ibb.co/LhDtzNd1/icon512.png
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/561450/X-GUI%20CLIENT%20FOR%20BLOOKET.user.js
// @updateURL https://update.greasyfork.org/scripts/561450/X-GUI%20CLIENT%20FOR%20BLOOKET.meta.js
// ==/UserScript==







/*!
* sweetalert2 v11.26.17
* Released under the MIT License.
*/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Sweetalert2=t()}(this,function(){"use strict";function e(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object")}function t(t,n){return t.get(e(t,n))}function n(e,t,n){(function(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")})(e,t),t.set(e,n)}const o={},i=e=>new Promise(t=>{if(!e)return t();const n=window.scrollX,i=window.scrollY;o.restoreFocusTimeout=setTimeout(()=>{o.previousActiveElement instanceof HTMLElement?(o.previousActiveElement.focus(),o.previousActiveElement=null):document.body&&document.body.focus(),t()},100),window.scrollTo(n,i)}),s="swal2-",r=["container","shown","height-auto","iosfix","popup","modal","no-backdrop","no-transition","toast","toast-shown","show","hide","close","title","html-container","actions","confirm","deny","cancel","footer","icon","icon-content","image","input","file","range","select","radio","checkbox","label","textarea","inputerror","input-label","validation-message","progress-steps","active-progress-step","progress-step","progress-step-line","loader","loading","styled","top","top-start","top-end","top-left","top-right","center","center-start","center-end","center-left","center-right","bottom","bottom-start","bottom-end","bottom-left","bottom-right","grow-row","grow-column","grow-fullscreen","rtl","timer-progress-bar","timer-progress-bar-container","scrollbar-measure","icon-success","icon-warning","icon-info","icon-question","icon-error","draggable","dragging"].reduce((e,t)=>(e[t]=s+t,e),{}),a=["success","warning","info","question","error"].reduce((e,t)=>(e[t]=s+t,e),{}),l="SweetAlert2:",c=e=>e.charAt(0).toUpperCase()+e.slice(1),u=e=>{console.warn(`${l} ${"object"==typeof e?e.join(" "):e}`)},d=e=>{console.error(`${l} ${e}`)},p=[],m=(e,t=null)=>{var n;n=`"${e}" is deprecated and will be removed in the next major release.${t?` Use "${t}" instead.`:""}`,p.includes(n)||(p.push(n),u(n))},h=e=>"function"==typeof e?e():e,g=e=>e&&"function"==typeof e.toPromise,f=e=>g(e)?e.toPromise():Promise.resolve(e),b=e=>e&&Promise.resolve(e)===e,y=()=>document.body.querySelector(`.${r.container}`),v=e=>{const t=y();return t?t.querySelector(e):null},w=e=>v(`.${e}`),C=()=>w(r.popup),A=()=>w(r.icon),E=()=>w(r.title),k=()=>w(r["html-container"]),B=()=>w(r.image),$=()=>w(r["progress-steps"]),L=()=>w(r["validation-message"]),P=()=>v(`.${r.actions} .${r.confirm}`),x=()=>v(`.${r.actions} .${r.cancel}`),T=()=>v(`.${r.actions} .${r.deny}`),S=()=>v(`.${r.loader}`),O=()=>w(r.actions),M=()=>w(r.footer),j=()=>w(r["timer-progress-bar"]),H=()=>w(r.close),I=()=>{const e=C();if(!e)return[];const t=e.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'),n=Array.from(t).sort((e,t)=>{const n=parseInt(e.getAttribute("tabindex")||"0"),o=parseInt(t.getAttribute("tabindex")||"0");return n>o?1:n<o?-1:0}),o=e.querySelectorAll('\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n'),i=Array.from(o).filter(e=>"-1"!==e.getAttribute("tabindex"));return[...new Set(n.concat(i))].filter(e=>ee(e))},D=()=>N(document.body,r.shown)&&!N(document.body,r["toast-shown"])&&!N(document.body,r["no-backdrop"]),V=()=>{const e=C();return!!e&&N(e,r.toast)},q=(e,t)=>{if(e.textContent="",t){const n=(new DOMParser).parseFromString(t,"text/html"),o=n.querySelector("head");o&&Array.from(o.childNodes).forEach(t=>{e.appendChild(t)});const i=n.querySelector("body");i&&Array.from(i.childNodes).forEach(t=>{t instanceof HTMLVideoElement||t instanceof HTMLAudioElement?e.appendChild(t.cloneNode(!0)):e.appendChild(t)})}},N=(e,t)=>{if(!t)return!1;const n=t.split(/\s+/);for(let t=0;t<n.length;t++)if(!e.classList.contains(n[t]))return!1;return!0},_=(e,t,n)=>{if(((e,t)=>{Array.from(e.classList).forEach(n=>{Object.values(r).includes(n)||Object.values(a).includes(n)||Object.values(t.showClass||{}).includes(n)||e.classList.remove(n)})})(e,t),!t.customClass)return;const o=t.customClass[n];o&&("string"==typeof o||o.forEach?z(e,o):u(`Invalid type of customClass.${n}! Expected string or iterable object, got "${typeof o}"`))},R=(e,t)=>{if(!t)return null;switch(t){case"select":case"textarea":case"file":return e.querySelector(`.${r.popup} > .${r[t]}`);case"checkbox":return e.querySelector(`.${r.popup} > .${r.checkbox} input`);case"radio":return e.querySelector(`.${r.popup} > .${r.radio} input:checked`)||e.querySelector(`.${r.popup} > .${r.radio} input:first-child`);case"range":return e.querySelector(`.${r.popup} > .${r.range} input`);default:return e.querySelector(`.${r.popup} > .${r.input}`)}},F=e=>{if(e.focus(),"file"!==e.type){const t=e.value;e.value="",e.value=t}},U=(e,t,n)=>{e&&t&&("string"==typeof t&&(t=t.split(/\s+/).filter(Boolean)),t.forEach(t=>{Array.isArray(e)?e.forEach(e=>{n?e.classList.add(t):e.classList.remove(t)}):n?e.classList.add(t):e.classList.remove(t)}))},z=(e,t)=>{U(e,t,!0)},W=(e,t)=>{U(e,t,!1)},K=(e,t)=>{const n=Array.from(e.children);for(let e=0;e<n.length;e++){const o=n[e];if(o instanceof HTMLElement&&N(o,t))return o}},Y=(e,t,n)=>{n===`${parseInt(`${n}`)}`&&(n=parseInt(n)),n||0===parseInt(`${n}`)?e.style.setProperty(t,"number"==typeof n?`${n}px`:n):e.style.removeProperty(t)},X=(e,t="flex")=>{e&&(e.style.display=t)},Z=e=>{e&&(e.style.display="none")},J=(e,t="block")=>{e&&new MutationObserver(()=>{Q(e,e.innerHTML,t)}).observe(e,{childList:!0,subtree:!0})},G=(e,t,n,o)=>{const i=e.querySelector(t);i&&i.style.setProperty(n,o)},Q=(e,t,n="flex")=>{t?X(e,n):Z(e)},ee=e=>Boolean(e&&(e.offsetWidth||e.offsetHeight||e.getClientRects().length)),te=e=>Boolean(e.scrollHeight>e.clientHeight),ne=e=>{const t=window.getComputedStyle(e),n=parseFloat(t.getPropertyValue("animation-duration")||"0"),o=parseFloat(t.getPropertyValue("transition-duration")||"0");return n>0||o>0},oe=(e,t=!1)=>{const n=j();n&&ee(n)&&(t&&(n.style.transition="none",n.style.width="100%"),setTimeout(()=>{n.style.transition=`width ${e/1e3}s linear`,n.style.width="0%"},10))},ie=`\n <div aria-labelledby="${r.title}" aria-describedby="${r["html-container"]}" class="${r.popup}" tabindex="-1">\n   <button type="button" class="${r.close}"></button>\n   <ul class="${r["progress-steps"]}"></ul>\n   <div class="${r.icon}"></div>\n   <img class="${r.image}" />\n   <h2 class="${r.title}" id="${r.title}"></h2>\n   <div class="${r["html-container"]}" id="${r["html-container"]}"></div>\n   <input class="${r.input}" id="${r.input}" />\n   <input type="file" class="${r.file}" />\n   <div class="${r.range}">\n     <input type="range" />\n     <output></output>\n   </div>\n   <select class="${r.select}" id="${r.select}"></select>\n   <div class="${r.radio}"></div>\n   <label class="${r.checkbox}">\n     <input type="checkbox" id="${r.checkbox}" />\n     <span class="${r.label}"></span>\n   </label>\n   <textarea class="${r.textarea}" id="${r.textarea}"></textarea>\n   <div class="${r["validation-message"]}" id="${r["validation-message"]}"></div>\n   <div class="${r.actions}">\n     <div class="${r.loader}"></div>\n     <button type="button" class="${r.confirm}"></button>\n     <button type="button" class="${r.deny}"></button>\n     <button type="button" class="${r.cancel}"></button>\n   </div>\n   <div class="${r.footer}"></div>\n   <div class="${r["timer-progress-bar-container"]}">\n     <div class="${r["timer-progress-bar"]}"></div>\n   </div>\n </div>\n`.replace(/(^|\n)\s*/g,""),se=()=>{o.currentInstance&&o.currentInstance.resetValidationMessage()},re=e=>{const t=(()=>{const e=y();return!!e&&(e.remove(),W([document.documentElement,document.body],[r["no-backdrop"],r["toast-shown"],r["has-column"]]),!0)})();if("undefined"==typeof window||"undefined"==typeof document)return void d("SweetAlert2 requires document to initialize");const n=document.createElement("div");n.className=r.container,t&&z(n,r["no-transition"]),q(n,ie),n.dataset.swal2Theme=e.theme;const i=(e=>{if("string"==typeof e){const t=document.querySelector(e);if(!t)throw new Error(`Target element "${e}" not found`);return t}return e})(e.target||"body");i.appendChild(n),e.topLayer&&(n.setAttribute("popover",""),n.showPopover()),(e=>{const t=C();t&&(t.setAttribute("role",e.toast?"alert":"dialog"),t.setAttribute("aria-live",e.toast?"polite":"assertive"),e.toast||t.setAttribute("aria-modal","true"))})(e),(e=>{"rtl"===window.getComputedStyle(e).direction&&(z(y(),r.rtl),o.isRTL=!0)})(i),(()=>{const e=C();if(!e)return;const t=K(e,r.input),n=K(e,r.file),o=e.querySelector(`.${r.range} input`),i=e.querySelector(`.${r.range} output`),s=K(e,r.select),a=e.querySelector(`.${r.checkbox} input`),l=K(e,r.textarea);t&&(t.oninput=se),n&&(n.onchange=se),s&&(s.onchange=se),a&&(a.onchange=se),l&&(l.oninput=se),o&&i&&(o.oninput=()=>{se(),i.value=o.value},o.onchange=()=>{se(),i.value=o.value})})()},ae=(e,t)=>{e instanceof HTMLElement?t.appendChild(e):"object"==typeof e?le(e,t):e&&q(t,e)},le=(e,t)=>{"jquery"in e?ce(t,e):q(t,e.toString())},ce=(e,t)=>{if(e.textContent="",0 in t)for(let n=0;n in t;n++)e.appendChild(t[n].cloneNode(!0));else e.appendChild(t.cloneNode(!0))},ue=(e,t)=>{const n=O(),o=S();n&&o&&(t.showConfirmButton||t.showDenyButton||t.showCancelButton?X(n):Z(n),_(n,t,"actions"),function(e,t,n){const o=P(),i=T(),s=x();if(!o||!i||!s)return;pe(o,"confirm",n),pe(i,"deny",n),pe(s,"cancel",n),function(e,t,n,o){if(!o.buttonsStyling)return void W([e,t,n],r.styled);z([e,t,n],r.styled),o.confirmButtonColor&&e.style.setProperty("--swal2-confirm-button-background-color",o.confirmButtonColor);o.denyButtonColor&&t.style.setProperty("--swal2-deny-button-background-color",o.denyButtonColor);o.cancelButtonColor&&n.style.setProperty("--swal2-cancel-button-background-color",o.cancelButtonColor);de(e),de(t),de(n)}(o,i,s,n),n.reverseButtons&&(n.toast?(e.insertBefore(s,o),e.insertBefore(i,o)):(e.insertBefore(s,t),e.insertBefore(i,t),e.insertBefore(o,t)))}(n,o,t),q(o,t.loaderHtml||""),_(o,t,"loader"))};function de(e){const t=window.getComputedStyle(e);if(t.getPropertyValue("--swal2-action-button-focus-box-shadow"))return;const n=t.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/,"rgba($1, $2, $3, 0.5)");e.style.setProperty("--swal2-action-button-focus-box-shadow",t.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/,` ${n}`))}function pe(e,t,n){const o=c(t);Q(e,n[`show${o}Button`],"inline-block"),q(e,n[`${t}ButtonText`]||""),e.setAttribute("aria-label",n[`${t}ButtonAriaLabel`]||""),e.className=r[t],_(e,n,`${t}Button`)}const me=(e,t)=>{const n=y();n&&(!function(e,t){"string"==typeof t?e.style.background=t:t||z([document.documentElement,document.body],r["no-backdrop"])}(n,t.backdrop),function(e,t){if(!t)return;t in r?z(e,r[t]):(u('The "position" parameter is not valid, defaulting to "center"'),z(e,r.center))}(n,t.position),function(e,t){if(!t)return;z(e,r[`grow-${t}`])}(n,t.grow),_(n,t,"container"))};var he={innerParams:new WeakMap,domCache:new WeakMap};const ge=["input","file","range","select","radio","checkbox","textarea"],fe=e=>{if(!e.input)return;if(!Ee[e.input])return void d(`Unexpected type of input! Expected ${Object.keys(Ee).join(" | ")}, got "${e.input}"`);const t=Ce(e.input);if(!t)return;const n=Ee[e.input](t,e);X(t),e.inputAutoFocus&&setTimeout(()=>{F(n)})},be=(e,t)=>{const n=C();if(!n)return;const o=R(n,e);if(o){(e=>{for(let t=0;t<e.attributes.length;t++){const n=e.attributes[t].name;["id","type","value","style"].includes(n)||e.removeAttribute(n)}})(o);for(const e in t)o.setAttribute(e,t[e])}},ye=e=>{if(!e.input)return;const t=Ce(e.input);t&&_(t,e,"input")},ve=(e,t)=>{!e.placeholder&&t.inputPlaceholder&&(e.placeholder=t.inputPlaceholder)},we=(e,t,n)=>{if(n.inputLabel){const o=document.createElement("label"),i=r["input-label"];o.setAttribute("for",e.id),o.className=i,"object"==typeof n.customClass&&z(o,n.customClass.inputLabel),o.innerText=n.inputLabel,t.insertAdjacentElement("beforebegin",o)}},Ce=e=>{const t=C();if(t)return K(t,r[e]||r.input)},Ae=(e,t)=>{["string","number"].includes(typeof t)?e.value=`${t}`:b(t)||u(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof t}"`)},Ee={};Ee.text=Ee.email=Ee.password=Ee.number=Ee.tel=Ee.url=Ee.search=Ee.date=Ee["datetime-local"]=Ee.time=Ee.week=Ee.month=(e,t)=>{const n=e;return Ae(n,t.inputValue),we(n,n,t),ve(n,t),n.type=t.input,n},Ee.file=(e,t)=>{const n=e;return we(n,n,t),ve(n,t),n},Ee.range=(e,t)=>{const n=e,o=n.querySelector("input"),i=n.querySelector("output");return o&&(Ae(o,t.inputValue),o.type=t.input,we(o,e,t)),i&&Ae(i,t.inputValue),e},Ee.select=(e,t)=>{const n=e;if(n.textContent="",t.inputPlaceholder){const e=document.createElement("option");q(e,t.inputPlaceholder),e.value="",e.disabled=!0,e.selected=!0,n.appendChild(e)}return we(n,n,t),n},Ee.radio=e=>(e.textContent="",e),Ee.checkbox=(e,t)=>{const n=C();if(!n)throw new Error("Popup not found");const o=R(n,"checkbox");if(!o)throw new Error("Checkbox input not found");o.value="1",o.checked=Boolean(t.inputValue);const i=e.querySelector("span");if(i){const e=t.inputPlaceholder||t.inputLabel;e&&q(i,e)}return o},Ee.textarea=(e,t)=>{const n=e;Ae(n,t.inputValue),ve(n,t),we(n,n,t);return setTimeout(()=>{if("MutationObserver"in window){const e=C();if(!e)return;const o=parseInt(window.getComputedStyle(e).width);new MutationObserver(()=>{if(!document.body.contains(n))return;const e=n.offsetWidth+(i=n,parseInt(window.getComputedStyle(i).marginLeft)+parseInt(window.getComputedStyle(i).marginRight));var i;const s=C();s&&(e>o?s.style.width=`${e}px`:Y(s,"width",t.width))}).observe(n,{attributes:!0,attributeFilter:["style"]})}}),n};const ke=(e,t)=>{const n=k();n&&(J(n),_(n,t,"htmlContainer"),t.html?(ae(t.html,n),X(n,"block")):t.text?(n.textContent=t.text,X(n,"block")):Z(n),((e,t)=>{const n=C();if(!n)return;const o=he.innerParams.get(e),i=!o||t.input!==o.input;ge.forEach(e=>{const o=K(n,r[e]);o&&(be(e,t.inputAttributes),o.className=r[e],i&&Z(o))}),t.input&&(i&&fe(t),ye(t))})(e,t))},Be=(e,t)=>{for(const[n,o]of Object.entries(a))t.icon!==n&&W(e,o);z(e,t.icon&&a[t.icon]),Pe(e,t),$e(),_(e,t,"icon")},$e=()=>{const e=C();if(!e)return;const t=window.getComputedStyle(e).getPropertyValue("background-color"),n=e.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");for(let e=0;e<n.length;e++)n[e].style.backgroundColor=t},Le=(e,t)=>{if(!t.icon&&!t.iconHtml)return;let n=e.innerHTML,o="";if(t.iconHtml)o=xe(t.iconHtml);else if("success"===t.icon)o=(e=>`\n  ${e.animation?'<div class="swal2-success-circular-line-left"></div>':""}\n  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n  <div class="swal2-success-ring"></div>\n  ${e.animation?'<div class="swal2-success-fix"></div>':""}\n  ${e.animation?'<div class="swal2-success-circular-line-right"></div>':""}\n`)(t),n=n.replace(/ style=".*?"/g,"");else if("error"===t.icon)o='\n  <span class="swal2-x-mark">\n    <span class="swal2-x-mark-line-left"></span>\n    <span class="swal2-x-mark-line-right"></span>\n  </span>\n';else if(t.icon){o=xe({question:"?",warning:"!",info:"i"}[t.icon])}n.trim()!==o.trim()&&q(e,o)},Pe=(e,t)=>{if(t.iconColor){e.style.color=t.iconColor,e.style.borderColor=t.iconColor;for(const n of[".swal2-success-line-tip",".swal2-success-line-long",".swal2-x-mark-line-left",".swal2-x-mark-line-right"])G(e,n,"background-color",t.iconColor);G(e,".swal2-success-ring","border-color",t.iconColor)}},xe=e=>`<div class="${r["icon-content"]}">${e}</div>`;let Te=!1,Se=0,Oe=0,Me=0,je=0;const He=e=>{const t=C();if(!t)return;const n=A();if(e.target===t||n&&n.contains(e.target)){Te=!0;const n=Ve(e);Se=n.clientX,Oe=n.clientY,Me=parseInt(t.style.insetInlineStart)||0,je=parseInt(t.style.insetBlockStart)||0,z(t,"swal2-dragging")}},Ie=e=>{const t=C();if(t&&Te){let{clientX:n,clientY:i}=Ve(e);const s=n-Se;t.style.insetInlineStart=`${Me+(o.isRTL?-s:s)}px`,t.style.insetBlockStart=`${je+(i-Oe)}px`}},De=()=>{const e=C();Te=!1,W(e,"swal2-dragging")},Ve=e=>{let t=0,n=0;return e.type.startsWith("mouse")?(t=e.clientX,n=e.clientY):e.type.startsWith("touch")&&(t=e.touches[0].clientX,n=e.touches[0].clientY),{clientX:t,clientY:n}},qe=(e,t)=>{const n=y(),o=C();if(n&&o){if(t.toast){Y(n,"width",t.width),o.style.width="100%";const e=S();e&&o.insertBefore(e,A())}else Y(o,"width",t.width);Y(o,"padding",t.padding),t.color&&(o.style.color=t.color),t.background&&(o.style.background=t.background),Z(L()),Ne(o,t),t.draggable&&!t.toast?(z(o,r.draggable),(e=>{e.addEventListener("mousedown",He),document.body.addEventListener("mousemove",Ie),e.addEventListener("mouseup",De),e.addEventListener("touchstart",He),document.body.addEventListener("touchmove",Ie),e.addEventListener("touchend",De)})(o)):(W(o,r.draggable),(e=>{e.removeEventListener("mousedown",He),document.body.removeEventListener("mousemove",Ie),e.removeEventListener("mouseup",De),e.removeEventListener("touchstart",He),document.body.removeEventListener("touchmove",Ie),e.removeEventListener("touchend",De)})(o))}},Ne=(e,t)=>{const n=t.showClass||{};e.className=`${r.popup} ${ee(e)?n.popup:""}`,t.toast?(z([document.documentElement,document.body],r["toast-shown"]),z(e,r.toast)):z(e,r.modal),_(e,t,"popup"),"string"==typeof t.customClass&&z(e,t.customClass),t.icon&&z(e,r[`icon-${t.icon}`])},_e=e=>{const t=document.createElement("li");return z(t,r["progress-step"]),q(t,e),t},Re=e=>{const t=document.createElement("li");return z(t,r["progress-step-line"]),e.progressStepsDistance&&Y(t,"width",e.progressStepsDistance),t},Fe=(e,t)=>{var n;qe(0,t),me(0,t),((e,t)=>{const n=$();if(!n)return;const{progressSteps:o,currentProgressStep:i}=t;o&&0!==o.length&&void 0!==i?(X(n),n.textContent="",i>=o.length&&u("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"),o.forEach((e,s)=>{const a=_e(e);if(n.appendChild(a),s===i&&z(a,r["active-progress-step"]),s!==o.length-1){const e=Re(t);n.appendChild(e)}})):Z(n)})(0,t),((e,t)=>{const n=he.innerParams.get(e),o=A();if(!o)return;if(n&&t.icon===n.icon)return Le(o,t),void Be(o,t);if(!t.icon&&!t.iconHtml)return void Z(o);if(t.icon&&-1===Object.keys(a).indexOf(t.icon))return d(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${t.icon}"`),void Z(o);X(o),Le(o,t),Be(o,t),z(o,t.showClass&&t.showClass.icon),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",$e)})(e,t),((e,t)=>{const n=B();n&&(t.imageUrl?(X(n,""),n.setAttribute("src",t.imageUrl),n.setAttribute("alt",t.imageAlt||""),Y(n,"width",t.imageWidth),Y(n,"height",t.imageHeight),n.className=r.image,_(n,t,"image")):Z(n))})(0,t),((e,t)=>{const n=E();n&&(J(n),Q(n,Boolean(t.title||t.titleText),"block"),t.title&&ae(t.title,n),t.titleText&&(n.innerText=t.titleText),_(n,t,"title"))})(0,t),((e,t)=>{const n=H();n&&(q(n,t.closeButtonHtml||""),_(n,t,"closeButton"),Q(n,t.showCloseButton),n.setAttribute("aria-label",t.closeButtonAriaLabel||""))})(0,t),ke(e,t),ue(0,t),((e,t)=>{const n=M();n&&(J(n),Q(n,Boolean(t.footer),"block"),t.footer&&ae(t.footer,n),_(n,t,"footer"))})(0,t);const i=C();"function"==typeof t.didRender&&i&&t.didRender(i),null===(n=o.eventEmitter)||void 0===n||n.emit("didRender",i)},Ue=()=>{var e;return null===(e=P())||void 0===e?void 0:e.click()},ze=Object.freeze({cancel:"cancel",backdrop:"backdrop",close:"close",esc:"esc",timer:"timer"}),We=e=>{if(e.keydownTarget&&e.keydownHandlerAdded&&e.keydownHandler){const t=e.keydownHandler;e.keydownTarget.removeEventListener("keydown",t,{capture:e.keydownListenerCapture}),e.keydownHandlerAdded=!1}},Ke=(e,t)=>{var n;const o=I();if(o.length)return-2===(e+=t)&&(e=o.length-1),e===o.length?e=0:-1===e&&(e=o.length-1),void o[e].focus();null===(n=C())||void 0===n||n.focus()},Ye=["ArrowRight","ArrowDown"],Xe=["ArrowLeft","ArrowUp"],Ze=(e,t,n)=>{e&&(t.isComposing||229===t.keyCode||(e.stopKeydownPropagation&&t.stopPropagation(),"Enter"===t.key?Je(t,e):"Tab"===t.key?Ge(t):[...Ye,...Xe].includes(t.key)?Qe(t.key):"Escape"===t.key&&et(t,e,n)))},Je=(e,t)=>{if(!h(t.allowEnterKey))return;const n=C();if(!n||!t.input)return;const o=R(n,t.input);if(e.target&&o&&e.target instanceof HTMLElement&&e.target.outerHTML===o.outerHTML){if(["textarea","file"].includes(t.input))return;Ue(),e.preventDefault()}},Ge=e=>{const t=e.target,n=I();let o=-1;for(let e=0;e<n.length;e++)if(t===n[e]){o=e;break}e.shiftKey?Ke(o,-1):Ke(o,1),e.stopPropagation(),e.preventDefault()},Qe=e=>{const t=O(),n=P(),o=T(),i=x();if(!(t&&n&&o&&i))return;const s=[n,o,i];if(document.activeElement instanceof HTMLElement&&!s.includes(document.activeElement))return;const r=Ye.includes(e)?"nextElementSibling":"previousElementSibling";let a=document.activeElement;if(a){for(let e=0;e<t.children.length;e++){if(a=a[r],!a)return;if(a instanceof HTMLButtonElement&&ee(a))break}a instanceof HTMLButtonElement&&a.focus()}},et=(e,t,n)=>{e.preventDefault(),h(t.allowEscapeKey)&&n(ze.esc)};var tt={swalPromiseResolve:new WeakMap,swalPromiseReject:new WeakMap};const nt=()=>{Array.from(document.body.children).forEach(e=>{e.hasAttribute("data-previous-aria-hidden")?(e.setAttribute("aria-hidden",e.getAttribute("data-previous-aria-hidden")||""),e.removeAttribute("data-previous-aria-hidden")):e.removeAttribute("aria-hidden")})},ot="undefined"!=typeof window&&Boolean(window.GestureEvent),it=()=>{const e=y();if(!e)return;let t;e.ontouchstart=e=>{t=st(e)},e.ontouchmove=e=>{t&&(e.preventDefault(),e.stopPropagation())}},st=e=>{const t=e.target,n=y(),o=k();return!(!n||!o)&&(!rt(e)&&!at(e)&&(t===n||!(te(n)||!(t instanceof HTMLElement)||((e,t)=>{let n=e;for(;n&&n!==t;){if(te(n))return!0;n=n.parentElement}return!1})(t,o)||"INPUT"===t.tagName||"TEXTAREA"===t.tagName||te(o)&&o.contains(t))))},rt=e=>Boolean(e.touches&&e.touches.length&&"stylus"===e.touches[0].touchType),at=e=>e.touches&&e.touches.length>1;let lt=null;const ct=e=>{null===lt&&(document.body.scrollHeight>window.innerHeight||"scroll"===e)&&(lt=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")),document.body.style.paddingRight=`${lt+(()=>{const e=document.createElement("div");e.className=r["scrollbar-measure"],document.body.appendChild(e);const t=e.getBoundingClientRect().width-e.clientWidth;return document.body.removeChild(e),t})()}px`)};function ut(e,t,n,s){V()?yt(e,s):(i(n).then(()=>yt(e,s)),We(o)),ot?(t.setAttribute("style","display:none !important"),t.removeAttribute("class"),t.innerHTML=""):t.remove(),D()&&(null!==lt&&(document.body.style.paddingRight=`${lt}px`,lt=null),(()=>{if(N(document.body,r.iosfix)){const e=parseInt(document.body.style.top,10);W(document.body,r.iosfix),document.body.style.top="",document.body.scrollTop=-1*e}})(),nt()),W([document.documentElement,document.body],[r.shown,r["height-auto"],r["no-backdrop"],r["toast-shown"]])}function dt(e){e=gt(e);const t=tt.swalPromiseResolve.get(this),n=pt(this);this.isAwaitingPromise?e.isDismissed||(ht(this),t(e)):n&&t(e)}const pt=e=>{const t=C();if(!t)return!1;const n=he.innerParams.get(e);if(!n||N(t,n.hideClass.popup))return!1;W(t,n.showClass.popup),z(t,n.hideClass.popup);const o=y();return W(o,n.showClass.backdrop),z(o,n.hideClass.backdrop),ft(e,t,n),!0};function mt(e){const t=tt.swalPromiseReject.get(this);ht(this),t&&t(e)}const ht=e=>{e.isAwaitingPromise&&(delete e.isAwaitingPromise,he.innerParams.get(e)||e._destroy())},gt=e=>void 0===e?{isConfirmed:!1,isDenied:!1,isDismissed:!0}:Object.assign({isConfirmed:!1,isDenied:!1,isDismissed:!1},e),ft=(e,t,n)=>{var i;const s=y(),r=ne(t);"function"==typeof n.willClose&&n.willClose(t),null===(i=o.eventEmitter)||void 0===i||i.emit("willClose",t),r&&s?bt(e,t,s,Boolean(n.returnFocus),n.didClose):s&&ut(e,s,Boolean(n.returnFocus),n.didClose)},bt=(e,t,n,i,s)=>{o.swalCloseEventFinishedCallback=ut.bind(null,e,n,i,s);const r=function(e){var n;e.target===t&&(null===(n=o.swalCloseEventFinishedCallback)||void 0===n||n.call(o),delete o.swalCloseEventFinishedCallback,t.removeEventListener("animationend",r),t.removeEventListener("transitionend",r))};t.addEventListener("animationend",r),t.addEventListener("transitionend",r)},yt=(e,t)=>{setTimeout(()=>{var n;"function"==typeof t&&t.bind(e.params)(),null===(n=o.eventEmitter)||void 0===n||n.emit("didClose"),e._destroy&&e._destroy()})},vt=e=>{let t=C();if(t||new Qn,t=C(),!t)return;const n=S();V()?Z(A()):wt(t,e),X(n),t.setAttribute("data-loading","true"),t.setAttribute("aria-busy","true"),t.focus()},wt=(e,t)=>{const n=O(),o=S();n&&o&&(!t&&ee(P())&&(t=P()),X(n),t&&(Z(t),o.setAttribute("data-button-to-replace",t.className),n.insertBefore(o,t)),z([e,n],r.loading))},Ct=e=>e.checked?1:0,At=e=>e.checked?e.value:null,Et=e=>e.files&&e.files.length?null!==e.getAttribute("multiple")?e.files:e.files[0]:null,kt=(e,t)=>{const n=C();if(!n)return;const o=e=>{"select"===t.input?function(e,t,n){const o=K(e,r.select);if(!o)return;const i=(e,t,o)=>{const i=document.createElement("option");i.value=o,q(i,t),i.selected=Lt(o,n.inputValue),e.appendChild(i)};t.forEach(e=>{const t=e[0],n=e[1];if(Array.isArray(n)){const e=document.createElement("optgroup");e.label=t,e.disabled=!1,o.appendChild(e),n.forEach(t=>i(e,t[1],t[0]))}else i(o,n,t)}),o.focus()}(n,$t(e),t):"radio"===t.input&&function(e,t,n){const o=K(e,r.radio);if(!o)return;t.forEach(e=>{const t=e[0],i=e[1],s=document.createElement("input"),a=document.createElement("label");s.type="radio",s.name=r.radio,s.value=t,Lt(t,n.inputValue)&&(s.checked=!0);const l=document.createElement("span");q(l,i),l.className=r.label,a.appendChild(s),a.appendChild(l),o.appendChild(a)});const i=o.querySelectorAll("input");i.length&&i[0].focus()}(n,$t(e),t)};g(t.inputOptions)||b(t.inputOptions)?(vt(P()),f(t.inputOptions).then(t=>{e.hideLoading(),o(t)})):"object"==typeof t.inputOptions?o(t.inputOptions):d("Unexpected type of inputOptions! Expected object, Map or Promise, got "+typeof t.inputOptions)},Bt=(e,t)=>{const n=e.getInput();n&&(Z(n),f(t.inputValue).then(o=>{n.value="number"===t.input?`${parseFloat(o)||0}`:`${o}`,X(n),n.focus(),e.hideLoading()}).catch(t=>{d(`Error in inputValue promise: ${t}`),n.value="",X(n),n.focus(),e.hideLoading()}))};const $t=e=>{const t=[];return e instanceof Map?e.forEach((e,n)=>{let o=e;"object"==typeof o&&(o=$t(o)),t.push([n,o])}):Object.keys(e).forEach(n=>{let o=e[n];"object"==typeof o&&(o=$t(o)),t.push([n,o])}),t},Lt=(e,t)=>Boolean(t)&&null!=t&&t.toString()===e.toString(),Pt=(e,t)=>{const n=he.innerParams.get(e);if(!n.input)return void d(`The "input" parameter is needed to be set when using returnInputValueOn${c(t)}`);const o=e.getInput(),i=((e,t)=>{const n=e.getInput();if(!n)return null;switch(t.input){case"checkbox":return Ct(n);case"radio":return At(n);case"file":return Et(n);default:return t.inputAutoTrim?n.value.trim():n.value}})(e,n);n.inputValidator?xt(e,i,t):o&&!o.checkValidity()?(e.enableButtons(),e.showValidationMessage(n.validationMessage||o.validationMessage)):"deny"===t?Tt(e,i):Mt(e,i)},xt=(e,t,n)=>{const o=he.innerParams.get(e);e.disableInput();Promise.resolve().then(()=>f(o.inputValidator(t,o.validationMessage))).then(o=>{e.enableButtons(),e.enableInput(),o?e.showValidationMessage(o):"deny"===n?Tt(e,t):Mt(e,t)})},Tt=(e,t)=>{const n=he.innerParams.get(e);if(n.showLoaderOnDeny&&vt(T()),n.preDeny){e.isAwaitingPromise=!0;Promise.resolve().then(()=>f(n.preDeny(t,n.validationMessage))).then(n=>{!1===n?(e.hideLoading(),ht(e)):e.close({isDenied:!0,value:void 0===n?t:n})}).catch(t=>Ot(e,t))}else e.close({isDenied:!0,value:t})},St=(e,t)=>{e.close({isConfirmed:!0,value:t})},Ot=(e,t)=>{e.rejectPromise(t)},Mt=(e,t)=>{const n=he.innerParams.get(e);if(n.showLoaderOnConfirm&&vt(),n.preConfirm){e.resetValidationMessage(),e.isAwaitingPromise=!0;Promise.resolve().then(()=>f(n.preConfirm(t,n.validationMessage))).then(n=>{ee(L())||!1===n?(e.hideLoading(),ht(e)):St(e,void 0===n?t:n)}).catch(t=>Ot(e,t))}else St(e,t)};function jt(){const e=he.innerParams.get(this);if(!e)return;const t=he.domCache.get(this);Z(t.loader),V()?e.icon&&X(A()):Ht(t),W([t.popup,t.actions],r.loading),t.popup.removeAttribute("aria-busy"),t.popup.removeAttribute("data-loading"),t.confirmButton.disabled=!1,t.denyButton.disabled=!1,t.cancelButton.disabled=!1}const Ht=e=>{const t=e.loader.getAttribute("data-button-to-replace"),n=t?e.popup.getElementsByClassName(t):[];n.length?X(n[0],"inline-block"):ee(P())||ee(T())||ee(x())||Z(e.actions)};function It(){const e=he.innerParams.get(this),t=he.domCache.get(this);return t?R(t.popup,e.input):null}function Dt(e,t,n){const o=he.domCache.get(e);t.forEach(e=>{o[e].disabled=n})}function Vt(e,t){const n=C();if(n&&e)if("radio"===e.type){const e=n.querySelectorAll(`[name="${r.radio}"]`);for(let n=0;n<e.length;n++)e[n].disabled=t}else e.disabled=t}function qt(){Dt(this,["confirmButton","denyButton","cancelButton"],!1)}function Nt(){Dt(this,["confirmButton","denyButton","cancelButton"],!0)}function _t(){Vt(this.getInput(),!1)}function Rt(){Vt(this.getInput(),!0)}function Ft(e){const t=he.domCache.get(this),n=he.innerParams.get(this);q(t.validationMessage,e),t.validationMessage.className=r["validation-message"],n.customClass&&n.customClass.validationMessage&&z(t.validationMessage,n.customClass.validationMessage),X(t.validationMessage);const o=this.getInput();o&&(o.setAttribute("aria-invalid","true"),o.setAttribute("aria-describedby",r["validation-message"]),F(o),z(o,r.inputerror))}function Ut(){const e=he.domCache.get(this);e.validationMessage&&Z(e.validationMessage);const t=this.getInput();t&&(t.removeAttribute("aria-invalid"),t.removeAttribute("aria-describedby"),W(t,r.inputerror))}const zt={title:"",titleText:"",text:"",html:"",footer:"",icon:void 0,iconColor:void 0,iconHtml:void 0,template:void 0,toast:!1,draggable:!1,animation:!0,theme:"light",showClass:{popup:"swal2-show",backdrop:"swal2-backdrop-show",icon:"swal2-icon-show"},hideClass:{popup:"swal2-hide",backdrop:"swal2-backdrop-hide",icon:"swal2-icon-hide"},customClass:{},target:"body",color:void 0,backdrop:!0,heightAuto:!0,allowOutsideClick:!0,allowEscapeKey:!0,allowEnterKey:!0,stopKeydownPropagation:!0,keydownListenerCapture:!1,showConfirmButton:!0,showDenyButton:!1,showCancelButton:!1,preConfirm:void 0,preDeny:void 0,confirmButtonText:"OK",confirmButtonAriaLabel:"",confirmButtonColor:void 0,denyButtonText:"No",denyButtonAriaLabel:"",denyButtonColor:void 0,cancelButtonText:"Cancel",cancelButtonAriaLabel:"",cancelButtonColor:void 0,buttonsStyling:!0,reverseButtons:!1,focusConfirm:!0,focusDeny:!1,focusCancel:!1,returnFocus:!0,showCloseButton:!1,closeButtonHtml:"&times;",closeButtonAriaLabel:"Close this dialog",loaderHtml:"",showLoaderOnConfirm:!1,showLoaderOnDeny:!1,imageUrl:void 0,imageWidth:void 0,imageHeight:void 0,imageAlt:"",timer:void 0,timerProgressBar:!1,width:void 0,padding:void 0,background:void 0,input:void 0,inputPlaceholder:"",inputLabel:"",inputValue:"",inputOptions:{},inputAutoFocus:!0,inputAutoTrim:!0,inputAttributes:{},inputValidator:void 0,returnInputValueOnDeny:!1,validationMessage:void 0,grow:!1,position:"center",progressSteps:[],currentProgressStep:void 0,progressStepsDistance:void 0,willOpen:void 0,didOpen:void 0,didRender:void 0,willClose:void 0,didClose:void 0,didDestroy:void 0,scrollbarPadding:!0,topLayer:!1},Wt=["allowEscapeKey","allowOutsideClick","background","buttonsStyling","cancelButtonAriaLabel","cancelButtonColor","cancelButtonText","closeButtonAriaLabel","closeButtonHtml","color","confirmButtonAriaLabel","confirmButtonColor","confirmButtonText","currentProgressStep","customClass","denyButtonAriaLabel","denyButtonColor","denyButtonText","didClose","didDestroy","draggable","footer","hideClass","html","icon","iconColor","iconHtml","imageAlt","imageHeight","imageUrl","imageWidth","preConfirm","preDeny","progressSteps","returnFocus","reverseButtons","showCancelButton","showCloseButton","showConfirmButton","showDenyButton","text","title","titleText","theme","willClose"],Kt={allowEnterKey:void 0},Yt=["allowOutsideClick","allowEnterKey","backdrop","draggable","focusConfirm","focusDeny","focusCancel","returnFocus","heightAuto","keydownListenerCapture"],Xt=e=>Object.prototype.hasOwnProperty.call(zt,e),Zt=e=>-1!==Wt.indexOf(e),Jt=e=>Kt[e],Gt=e=>{Xt(e)||u(`Unknown parameter "${e}"`)},Qt=e=>{Yt.includes(e)&&u(`The parameter "${e}" is incompatible with toasts`)},en=e=>{const t=Jt(e);t&&m(e,t)},tn=e=>{!1===e.backdrop&&e.allowOutsideClick&&u('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'),e.theme&&!["light","dark","auto","minimal","borderless","bootstrap-4","bootstrap-4-light","bootstrap-4-dark","bootstrap-5","bootstrap-5-light","bootstrap-5-dark","material-ui","material-ui-light","material-ui-dark","embed-iframe","bulma","bulma-light","bulma-dark"].includes(e.theme)&&u(`Invalid theme "${e.theme}"`);for(const t in e)Gt(t),e.toast&&Qt(t),en(t)};function nn(e){const t=y(),n=C(),o=he.innerParams.get(this);if(!n||N(n,o.hideClass.popup))return void u("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");const i=on(e),s=Object.assign({},o,i);tn(s),t&&(t.dataset.swal2Theme=s.theme),Fe(this,s),he.innerParams.set(this,s),Object.defineProperties(this,{params:{value:Object.assign({},this.params,e),writable:!1,enumerable:!0}})}const on=e=>{const t={};return Object.keys(e).forEach(n=>{if(Zt(n)){const o=e;t[n]=o[n]}else u(`Invalid parameter to update: ${n}`)}),t};function sn(){var e;const t=he.domCache.get(this),n=he.innerParams.get(this);n?(t.popup&&o.swalCloseEventFinishedCallback&&(o.swalCloseEventFinishedCallback(),delete o.swalCloseEventFinishedCallback),"function"==typeof n.didDestroy&&n.didDestroy(),null===(e=o.eventEmitter)||void 0===e||e.emit("didDestroy"),rn(this)):an(this)}const rn=e=>{an(e),delete e.params,delete o.keydownHandler,delete o.keydownTarget,delete o.currentInstance},an=e=>{e.isAwaitingPromise?(ln(he,e),e.isAwaitingPromise=!0):(ln(tt,e),ln(he,e),delete e.isAwaitingPromise,delete e.disableButtons,delete e.enableButtons,delete e.getInput,delete e.disableInput,delete e.enableInput,delete e.hideLoading,delete e.disableLoading,delete e.showValidationMessage,delete e.resetValidationMessage,delete e.close,delete e.closePopup,delete e.closeModal,delete e.closeToast,delete e.rejectPromise,delete e.update,delete e._destroy)},ln=(e,t)=>{for(const n in e)e[n].delete(t)};var cn=Object.freeze({__proto__:null,_destroy:sn,close:dt,closeModal:dt,closePopup:dt,closeToast:dt,disableButtons:Nt,disableInput:Rt,disableLoading:jt,enableButtons:qt,enableInput:_t,getInput:It,handleAwaitingPromise:ht,hideLoading:jt,rejectPromise:mt,resetValidationMessage:Ut,showValidationMessage:Ft,update:nn});const un=(e,t,n)=>{t.popup.onclick=()=>{e&&(dn(e)||e.timer||e.input)||n(ze.close)}},dn=e=>Boolean(e.showConfirmButton||e.showDenyButton||e.showCancelButton||e.showCloseButton);let pn=!1;const mn=e=>{e.popup.onmousedown=()=>{e.container.onmouseup=function(t){e.container.onmouseup=()=>{},t.target===e.container&&(pn=!0)}}},hn=e=>{e.container.onmousedown=t=>{t.target===e.container&&t.preventDefault(),e.popup.onmouseup=function(t){e.popup.onmouseup=()=>{},(t.target===e.popup||t.target instanceof HTMLElement&&e.popup.contains(t.target))&&(pn=!0)}}},gn=(e,t,n)=>{t.container.onclick=o=>{pn?pn=!1:o.target===t.container&&h(e.allowOutsideClick)&&n(ze.backdrop)}},fn=e=>e instanceof Element||(e=>"object"==typeof e&&e.jquery)(e);const bn=()=>{if(o.timeout)return(()=>{const e=j();if(!e)return;const t=parseInt(window.getComputedStyle(e).width);e.style.removeProperty("transition"),e.style.width="100%";const n=t/parseInt(window.getComputedStyle(e).width)*100;e.style.width=`${n}%`})(),o.timeout.stop()},yn=()=>{if(o.timeout){const e=o.timeout.start();return oe(e),e}};let vn=!1;const wn={};const Cn=e=>{for(let t=e.target;t&&t!==document;t=t.parentNode)for(const e in wn){const n=t.getAttribute&&t.getAttribute(e);if(n)return void wn[e].fire({template:n})}};o.eventEmitter=new class{constructor(){this.events={}}_getHandlersByEventName(e){return void 0===this.events[e]&&(this.events[e]=[]),this.events[e]}on(e,t){const n=this._getHandlersByEventName(e);n.includes(t)||n.push(t)}once(e,t){const n=(...o)=>{this.removeListener(e,n),t.apply(this,o)};this.on(e,n)}emit(e,...t){this._getHandlersByEventName(e).forEach(e=>{try{e.apply(this,t)}catch(e){console.error(e)}})}removeListener(e,t){const n=this._getHandlersByEventName(e),o=n.indexOf(t);o>-1&&n.splice(o,1)}removeAllListeners(e){void 0!==this.events[e]&&(this.events[e].length=0)}reset(){this.events={}}};var An=Object.freeze({__proto__:null,argsToParams:e=>{const t={};return"object"!=typeof e[0]||fn(e[0])?["title","html","icon"].forEach((n,o)=>{const i=e[o];"string"==typeof i||fn(i)?t[n]=i:void 0!==i&&d(`Unexpected type of ${n}! Expected "string" or "Element", got ${typeof i}`)}):Object.assign(t,e[0]),t},bindClickHandler:function(e="data-swal-template"){wn[e]=this,vn||(document.body.addEventListener("click",Cn),vn=!0)},clickCancel:()=>{var e;return null===(e=x())||void 0===e?void 0:e.click()},clickConfirm:Ue,clickDeny:()=>{var e;return null===(e=T())||void 0===e?void 0:e.click()},enableLoading:vt,fire:function(...e){return new this(...e)},getActions:O,getCancelButton:x,getCloseButton:H,getConfirmButton:P,getContainer:y,getDenyButton:T,getFocusableElements:I,getFooter:M,getHtmlContainer:k,getIcon:A,getIconContent:()=>w(r["icon-content"]),getImage:B,getInputLabel:()=>w(r["input-label"]),getLoader:S,getPopup:C,getProgressSteps:$,getTimerLeft:()=>o.timeout&&o.timeout.getTimerLeft(),getTimerProgressBar:j,getTitle:E,getValidationMessage:L,increaseTimer:e=>{if(o.timeout){const t=o.timeout.increase(e);return oe(t,!0),t}},isDeprecatedParameter:Jt,isLoading:()=>{const e=C();return!!e&&e.hasAttribute("data-loading")},isTimerRunning:()=>Boolean(o.timeout&&o.timeout.isRunning()),isUpdatableParameter:Zt,isValidParameter:Xt,isVisible:()=>ee(C()),mixin:function(e){return class extends(this){_main(t,n){return super._main(t,Object.assign({},e,n))}}},off:(e,t)=>{o.eventEmitter&&(e?t?o.eventEmitter.removeListener(e,t):o.eventEmitter.removeAllListeners(e):o.eventEmitter.reset())},on:(e,t)=>{o.eventEmitter&&o.eventEmitter.on(e,t)},once:(e,t)=>{o.eventEmitter&&o.eventEmitter.once(e,t)},resumeTimer:yn,showLoading:vt,stopTimer:bn,toggleTimer:()=>{const e=o.timeout;return e&&(e.running?bn():yn())}});class En{constructor(e,t){this.callback=e,this.remaining=t,this.running=!1,this.start()}start(){return this.running||(this.running=!0,this.started=new Date,this.id=setTimeout(this.callback,this.remaining)),this.remaining}stop(){return this.started&&this.running&&(this.running=!1,clearTimeout(this.id),this.remaining-=(new Date).getTime()-this.started.getTime()),this.remaining}increase(e){const t=this.running;return t&&this.stop(),this.remaining+=e,t&&this.start(),this.remaining}getTimerLeft(){return this.running&&(this.stop(),this.start()),this.remaining}isRunning(){return this.running}}const kn=["swal-title","swal-html","swal-footer"],Bn=e=>{const t={};return Array.from(e.querySelectorAll("swal-param")).forEach(e=>{Mn(e,["name","value"]);const n=e.getAttribute("name"),o=e.getAttribute("value");n&&o&&(t[n]=n in zt&&"boolean"==typeof zt[n]?"false"!==o:n in zt&&"object"==typeof zt[n]?JSON.parse(o):o)}),t},$n=e=>{const t={};return Array.from(e.querySelectorAll("swal-function-param")).forEach(e=>{const n=e.getAttribute("name"),o=e.getAttribute("value");n&&o&&(t[n]=new Function(`return ${o}`)())}),t},Ln=e=>{const t={};return Array.from(e.querySelectorAll("swal-button")).forEach(e=>{Mn(e,["type","color","aria-label"]);const n=e.getAttribute("type");if(n&&["confirm","cancel","deny"].includes(n)){if(t[`${n}ButtonText`]=e.innerHTML,t[`show${c(n)}Button`]=!0,e.hasAttribute("color")){const o=e.getAttribute("color");null!==o&&(t[`${n}ButtonColor`]=o)}if(e.hasAttribute("aria-label")){const o=e.getAttribute("aria-label");null!==o&&(t[`${n}ButtonAriaLabel`]=o)}}}),t},Pn=e=>{const t={},n=e.querySelector("swal-image");return n&&(Mn(n,["src","width","height","alt"]),n.hasAttribute("src")&&(t.imageUrl=n.getAttribute("src")||void 0),n.hasAttribute("width")&&(t.imageWidth=n.getAttribute("width")||void 0),n.hasAttribute("height")&&(t.imageHeight=n.getAttribute("height")||void 0),n.hasAttribute("alt")&&(t.imageAlt=n.getAttribute("alt")||void 0)),t},xn=e=>{const t={},n=e.querySelector("swal-icon");return n&&(Mn(n,["type","color"]),n.hasAttribute("type")&&(t.icon=n.getAttribute("type")),n.hasAttribute("color")&&(t.iconColor=n.getAttribute("color")),t.iconHtml=n.innerHTML),t},Tn=e=>{const t={},n=e.querySelector("swal-input");n&&(Mn(n,["type","label","placeholder","value"]),t.input=n.getAttribute("type")||"text",n.hasAttribute("label")&&(t.inputLabel=n.getAttribute("label")),n.hasAttribute("placeholder")&&(t.inputPlaceholder=n.getAttribute("placeholder")),n.hasAttribute("value")&&(t.inputValue=n.getAttribute("value")));const o=Array.from(e.querySelectorAll("swal-input-option"));return o.length&&(t.inputOptions={},o.forEach(e=>{Mn(e,["value"]);const n=e.getAttribute("value");if(!n)return;const o=e.innerHTML;t.inputOptions[n]=o})),t},Sn=(e,t)=>{const n={};for(const o in t){const i=t[o],s=e.querySelector(i);s&&(Mn(s,[]),n[i.replace(/^swal-/,"")]=s.innerHTML.trim())}return n},On=e=>{const t=kn.concat(["swal-param","swal-function-param","swal-button","swal-image","swal-icon","swal-input","swal-input-option"]);Array.from(e.children).forEach(e=>{const n=e.tagName.toLowerCase();t.includes(n)||u(`Unrecognized element <${n}>`)})},Mn=(e,t)=>{Array.from(e.attributes).forEach(n=>{-1===t.indexOf(n.name)&&u([`Unrecognized attribute "${n.name}" on <${e.tagName.toLowerCase()}>.`,""+(t.length?`Allowed attributes are: ${t.join(", ")}`:"To set the value, use HTML within the element.")])})},jn=e=>{var t,n;const i=y(),s=C();if(!i||!s)return;"function"==typeof e.willOpen&&e.willOpen(s),null===(t=o.eventEmitter)||void 0===t||t.emit("willOpen",s);const r=window.getComputedStyle(document.body).overflowY;if(Vn(i,s,e),setTimeout(()=>{In(i,s)},10),D()&&(Dn(i,void 0!==e.scrollbarPadding&&e.scrollbarPadding,r),(()=>{const e=y();Array.from(document.body.children).forEach(t=>{t.contains(e)||(t.hasAttribute("aria-hidden")&&t.setAttribute("data-previous-aria-hidden",t.getAttribute("aria-hidden")||""),t.setAttribute("aria-hidden","true"))})})()),V()||o.previousActiveElement||(o.previousActiveElement=document.activeElement),"function"==typeof e.didOpen){const t=e.didOpen;setTimeout(()=>t(s))}null===(n=o.eventEmitter)||void 0===n||n.emit("didOpen",s)},Hn=e=>{const t=C();if(!t||e.target!==t)return;const n=y();n&&(t.removeEventListener("animationend",Hn),t.removeEventListener("transitionend",Hn),n.style.overflowY="auto",W(n,r["no-transition"]))},In=(e,t)=>{ne(t)?(e.style.overflowY="hidden",t.addEventListener("animationend",Hn),t.addEventListener("transitionend",Hn)):e.style.overflowY="auto"},Dn=(e,t,n)=>{(()=>{if(ot&&!N(document.body,r.iosfix)){const e=document.body.scrollTop;document.body.style.top=-1*e+"px",z(document.body,r.iosfix),it()}})(),t&&"hidden"!==n&&ct(n),setTimeout(()=>{e.scrollTop=0})},Vn=(e,t,n)=>{var o;null!==(o=n.showClass)&&void 0!==o&&o.backdrop&&z(e,n.showClass.backdrop),n.animation?(t.style.setProperty("opacity","0","important"),X(t,"grid"),setTimeout(()=>{var e;null!==(e=n.showClass)&&void 0!==e&&e.popup&&z(t,n.showClass.popup),t.style.removeProperty("opacity")},10)):X(t,"grid"),z([document.documentElement,document.body],r.shown),n.heightAuto&&n.backdrop&&!n.toast&&z([document.documentElement,document.body],r["height-auto"])};var qn=(e,t)=>/^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(e)?Promise.resolve():Promise.resolve(t||"Invalid email address"),Nn=(e,t)=>/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(e)?Promise.resolve():Promise.resolve(t||"Invalid URL");function _n(e){!function(e){e.inputValidator||("email"===e.input&&(e.inputValidator=qn),"url"===e.input&&(e.inputValidator=Nn))}(e),e.showLoaderOnConfirm&&!e.preConfirm&&u("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"),function(e){(!e.target||"string"==typeof e.target&&!document.querySelector(e.target)||"string"!=typeof e.target&&!e.target.appendChild)&&(u('Target parameter is not valid, defaulting to "body"'),e.target="body")}(e),"string"==typeof e.title&&(e.title=e.title.split("\n").join("<br />")),re(e)}let Rn;var Fn=new WeakMap;class Un{constructor(...t){if(n(this,Fn,Promise.resolve({isConfirmed:!1,isDenied:!1,isDismissed:!0})),"undefined"==typeof window)return;Rn=this;const o=Object.freeze(this.constructor.argsToParams(t));var i,s,r;this.params=o,this.isAwaitingPromise=!1,i=Fn,s=this,r=this._main(Rn.params),i.set(e(i,s),r)}_main(e,t={}){if(tn(Object.assign({},t,e)),o.currentInstance){const e=tt.swalPromiseResolve.get(o.currentInstance),{isAwaitingPromise:t}=o.currentInstance;o.currentInstance._destroy(),t||e({isDismissed:!0}),D()&&nt()}o.currentInstance=Rn;const n=Wn(e,t);_n(n),Object.freeze(n),o.timeout&&(o.timeout.stop(),delete o.timeout),clearTimeout(o.restoreFocusTimeout);const i=Kn(Rn);return Fe(Rn,n),he.innerParams.set(Rn,n),zn(Rn,i,n)}then(e){return t(Fn,this).then(e)}finally(e){return t(Fn,this).finally(e)}}const zn=(e,t,n)=>new Promise((i,s)=>{const r=t=>{e.close({isDismissed:!0,dismiss:t,isConfirmed:!1,isDenied:!1})};tt.swalPromiseResolve.set(e,i),tt.swalPromiseReject.set(e,s),t.confirmButton.onclick=()=>{(e=>{const t=he.innerParams.get(e);e.disableButtons(),t.input?Pt(e,"confirm"):Mt(e,!0)})(e)},t.denyButton.onclick=()=>{(e=>{const t=he.innerParams.get(e);e.disableButtons(),t.returnInputValueOnDeny?Pt(e,"deny"):Tt(e,!1)})(e)},t.cancelButton.onclick=()=>{((e,t)=>{e.disableButtons(),t(ze.cancel)})(e,r)},t.closeButton.onclick=()=>{r(ze.close)},((e,t,n)=>{e.toast?un(e,t,n):(mn(t),hn(t),gn(e,t,n))})(n,t,r),((e,t,n)=>{if(We(e),!t.toast){const o=e=>Ze(t,e,n);e.keydownHandler=o;const i=t.keydownListenerCapture?window:C();if(i){e.keydownTarget=i,e.keydownListenerCapture=t.keydownListenerCapture;const n=o;e.keydownTarget.addEventListener("keydown",n,{capture:e.keydownListenerCapture}),e.keydownHandlerAdded=!0}}})(o,n,r),((e,t)=>{"select"===t.input||"radio"===t.input?kt(e,t):["text","email","number","tel","textarea"].some(e=>e===t.input)&&(g(t.inputValue)||b(t.inputValue))&&(vt(P()),Bt(e,t))})(e,n),jn(n),Yn(o,n,r),Xn(t,n),setTimeout(()=>{t.container.scrollTop=0})}),Wn=(e,t)=>{const n=(e=>{const t="string"==typeof e.template?document.querySelector(e.template):e.template;if(!t)return{};const n=t.content;return On(n),Object.assign(Bn(n),$n(n),Ln(n),Pn(n),xn(n),Tn(n),Sn(n,kn))})(e),o=Object.assign({},zt,t,n,e);return o.showClass=Object.assign({},zt.showClass,o.showClass),o.hideClass=Object.assign({},zt.hideClass,o.hideClass),!1===o.animation&&(o.showClass={backdrop:"swal2-noanimation"},o.hideClass={}),o},Kn=e=>{const t={popup:C(),container:y(),actions:O(),confirmButton:P(),denyButton:T(),cancelButton:x(),loader:S(),closeButton:H(),validationMessage:L(),progressSteps:$()};return he.domCache.set(e,t),t},Yn=(e,t,n)=>{const o=j();Z(o),t.timer&&(e.timeout=new En(()=>{n("timer"),delete e.timeout},t.timer),t.timerProgressBar&&o&&(X(o),_(o,t,"timerProgressBar"),setTimeout(()=>{e.timeout&&e.timeout.running&&oe(t.timer)})))},Xn=(e,t)=>{if(!t.toast)return h(t.allowEnterKey)?void(Zn(e)||Jn(e,t)||Ke(-1,1)):(m("allowEnterKey"),void Gn())},Zn=e=>{const t=Array.from(e.popup.querySelectorAll("[autofocus]"));for(const e of t)if(e instanceof HTMLElement&&ee(e))return e.focus(),!0;return!1},Jn=(e,t)=>t.focusDeny&&ee(e.denyButton)?(e.denyButton.focus(),!0):t.focusCancel&&ee(e.cancelButton)?(e.cancelButton.focus(),!0):!(!t.focusConfirm||!ee(e.confirmButton))&&(e.confirmButton.focus(),!0),Gn=()=>{document.activeElement instanceof HTMLElement&&"function"==typeof document.activeElement.blur&&document.activeElement.blur()};Un.prototype.disableButtons=Nt,Un.prototype.enableButtons=qt,Un.prototype.getInput=It,Un.prototype.disableInput=Rt,Un.prototype.enableInput=_t,Un.prototype.hideLoading=jt,Un.prototype.disableLoading=jt,Un.prototype.showValidationMessage=Ft,Un.prototype.resetValidationMessage=Ut,Un.prototype.close=dt,Un.prototype.closePopup=dt,Un.prototype.closeModal=dt,Un.prototype.closeToast=dt,Un.prototype.rejectPromise=mt,Un.prototype.update=nn,Un.prototype._destroy=sn,Object.assign(Un,An),Object.keys(cn).forEach(e=>{Un[e]=function(...t){if(Rn&&Rn[e])return Rn[e](...t)}}),Un.DismissReason=ze,Un.version="11.26.17";const Qn=Un;return Qn.default=Qn,Qn}),void 0!==this&&this.Sweetalert2&&(this.swal=this.sweetAlert=this.Swal=this.SweetAlert=this.Sweetalert2);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,":root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}");



/**
 * @license AGPL-3.0
 * Blooket Cheats
 * Copyright (C) 2023-present 05Konz/Xullys/redhorse26/landsedge/Tony-the-best
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Source: TAKEN DOWN! * EMAIL: 05konz994@gmail.com
 * Source: https://github.com/xgui-client/X-GUI-BLOOKET-CLIENT/ * EMAIL slinkingfox@outlook.com

*/

/* THE UPDATE CHECKER IS ADDED DURING COMMIT PREP, THERE MAY BE REDUNDANT CODE, DO NOT TOUCH */

console.log("%c X-GUI CLIENT LOADED! ENJOY! %c\n Created by Xullys on GitHub", "color: #0bc2cf; font-size: 3rem", "color: #8000ff; font-size: 1rem");
console.log("%c gui.js", "color: #0bc2cf; font-size: 1rem");
console.log("%c Star the GitHub repo! %c https://github.com/xgui-client/X-GUI-BLOOKET-CLIENT", "color: #ffd000; font-size: 1rem", "color: #8000ff; font-size: 1rem");

(() => {
    let iframe = document.querySelector("iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.append(iframe);

    }
    /* By CryptoDude3 */
    if (window.fetch.call.toString() == 'function call() { [native code] }') {
        const call = window.fetch.call;
        window.fetch.call = function() {
            if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
        }
    }
    const timeProcessed = 1747005941679;
    let latestProcess = -1;
    const cheat = (async () => {
        const versionName = "6.70x";
        const gui = document.createElement("div");
        Object.assign(gui.style, {
            top: window.innerHeight / 2 - 250 + "px",
            left: innerWidth / 2 - 400 + "px",
        });
        const variables = {
            "--highlight": "#8A2BE2",
            "--highlight2": "#4B0082",
            "--background": "#0B0B1E",
            "--background2": "#151534",
            "--textColor": "#E0E0FF",
            "--textColor2": "#9A8CFF",
            "--toggleOff": "#2C273F",
            "--toggleOn": "#5FA3FF",
        };

        let settings,
            settingsKey = "KGUI.BenIsASillyGoose";
        const Settings = {
            data: null,
            setItem(k, v) {
                k.split(".").reduce((obj, k, i, a) => (++i == a.length && (obj[k] = v), k in obj ? obj[k] : (obj[k] = {})), this.data);
                localStorage.setItem(settingsKey, JSON.stringify(this.data));
                return v;
            },
            deleteItem(k) {
                k.split(".").reduce((obj, k, i, a) => (++i == a.length && delete obj[k], obj[k]), this.data);
                localStorage.setItem(settingsKey, JSON.stringify(this.data));
                return this.data;
            },
            setData(v) {
                this.data = v;
                localStorage.setItem(settingsKey, JSON.stringify(this.data));
            },
        };
        const defaultHideKey = {
            ctrl: true,
            shift: false,
            alt: false,
            key: "e"
        };
        const defaultCloseKey = {
            ctrl: true,
            shift: false,
            alt: false,
            key: "x"
        };

        for (const variable in variables) gui.style.setProperty(variable, variables[variable]);
        try {
            Settings.data = JSON.parse(localStorage.getItem(settingsKey) || "{}");
        } catch {
            localStorage.setItem(settingsKey, "{}");
            Settings.data = {};
        } finally {
            for (const variable in Settings.data.theme || {}) gui.style.setProperty("--" + variable, Settings.data.theme[variable]);
            Settings.data.hideKey ??= defaultHideKey;
            Settings.data.closeKey ??= defaultCloseKey;
        }

        const CookieHelper = {
            setCookie: (name, value, days = 365) => {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                const expires = "expires=" + date.toUTCString();
                document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; domain=.blooket.com; ${expires};path=/`;
            },
            getCookie: (name) => {
                const nameEQ = name + "=";
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    cookie = cookie.trim();
                    if (cookie.indexOf(nameEQ) === 0) {
                        try {
                            return JSON.parse(decodeURIComponent(cookie.substring(nameEQ.length)));
                        } catch {
                            return null;
                        }
                    }
                }
                return null;
            }
        };

        const styles = document.createElement("style");
        const classes = {},
            datasets = {};
        styles.innerHTML =

            "@import url('https://fonts.googleapis.com/css?family=Titan+One');\n@import url('https://fonts.googleapis.com/css?family=Nunito');" +
            `.bigTextContainer,.version{align-items:center;user-select:none}.cheatsList>div,.settingsPage>div{padding:5px 10px}.gamemode,.gui,.leaderboardList,.sidebar{box-sizing:border-box}.controls>div,.credit,.pathText,.runCheat,.sidebarPath,.version{user-select:none}.noScroll::-webkit-scrollbar{display:none}.noScroll{-ms-overflow-style:none;scrollbar-width:none}.gui {
  position: fixed;
  z-index: 100;
  background: var(--background);
  height: 500px;
  width: 800px;
  color: #fff;
  padding-left: 50px;
  font-size: 16px;

  /* clean corners */
  border-radius: 20px;
  overflow: hidden; /* hides overlapping sidebar edges */

  /* strobing purple edge */
  box-shadow: 0 0 15px var(--highlight);
  animation: edgePulse 2s ease-in-out infinite;
}

/* add a wrapper to keep glow around full rounded border */
.gui::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 2px solid var(--highlight);
  pointer-events: none; /* lets you click through it */
  animation: edgePulse 2s ease-in-out infinite;
}

/* animate border glow */
@keyframes edgePulse {
  0% {
    border-color: var(--highlight);
    box-shadow: 0 0 10px var(--highlight);
  }
  50% {
    border-color: var(--highlight2);
    box-shadow: 0 0 25px var(--highlight2);
  }
  100% {
    border-color: var(--highlight);
    box-shadow: 0 0 10px var(--highlight);
  }
}
button,
.runCheat,
.cheatToggle,
.toggleTrigger,
.controls > div,
.searchbarButton {
    border-radius: 12px !important;
}

.controls,.credit,.gamemodesList,.guiContent,.guiTopBar,.sidebar,.sidebarShadow,.version{position:absolute}.sidebarShadow{inset:0;background:#000;opacity:0%;pointer-events:none;transition:.2s;z-index:9}.controls>div,.guiContent,.sidebar,select[data-type] option{background:var(--background2)}.sidebarShadow:has(~ .sidebar:hover){opacity:40%}.credit{bottom:0;left:0;right:0;height:0;transition:.1s;overflow:hidden;text-align:center}.sidebar {
  top: 0;
  left: 0;
  height: 100%;
  width: 50px;

  /* ORIGINAL POSITIONING */
  position: absolute;
  z-index: 10;

  /* visuals */
  background: var(--background2);
  box-sizing: border-box;
  padding-bottom: 30px;

  /* animation */
  transition: width .2s .1s;

  /* COLLAPSED */
  overflow-x: hidden;
  overflow-y: hidden;
}

/* EXPANDED */
.sidebar:hover {
  width: 200px;
  overflow-y: auto;
}

/* Chrome scrollbar */
.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar:hover::-webkit-scrollbar {
  width: 6px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 6px;
}

.sidebar:hover{width:200px;transition-delay:0s}.sidebar:hover>.credit{height:25px;transition:.4s 0.2s}.guiContent{inset:20px;left:70px;top:40px;z-index:1;padding-top:32px}.guiTopBar{z-index:1;top:0;left:50px;right:0;height:25px}.version{top:0;left:0;margin-inline:10px;color:#888;font-size:.9em;letter-spacing:.5px;height:100%;display:flex}.controls{top:0;right:0;display:grid;grid-template-columns:1fr 1fr 1fr;height:25px;width:122px;gap:1px;border:1px solid var(--background);z-index:2}.controls>div{display:grid;place-items:center;font-weight:100}.closeControl{transition:.1s}.closeControl:hover{background:red}.creditsPage,.gamemodesPage,.searchPage{position:absolute;inset:0;top:32px}.gamemodesList{display:grid;gap:0 30px;padding-inline:30px;margin-top:0;padding-top:15px;margin-bottom:0;grid-template-columns:1fr 1fr;overflow-y:scroll;inset:0}.leaderboardPage,.logsPage{inset:10px;position:absolute}.pathText{position:absolute;top:40px;left:70px;right:20px;z-index:3;padding:7px 10px;height:22px}.clearLogsButton,.refreshControl{z-index:5;place-items:center;cursor:pointer}.leaderboardPage{top:42px}.leaderboardList{list-style:none;margin:0;padding:20px 40px 10px;height:100%;overflow:scroll;font-size:1.5em}.logsPage{top:37px;background:#000d;border-radius:2.5px}.logMessages{list-style:none;margin:10px;padding:0;display:flex;flex-direction:column-reverse;overflow-y:scroll;word-wrap:break-word;position:absolute;inset:0}.clearLogsButton{position:absolute;top:5px;right:5px;width:25px;height:25px;display:grid;scale:-1 1 1;transition:.2s}.searchbarHolder{display:flex;outline:2px solid var(--highlight);margin:10px 20px;height:30px;font-size:2em}.searchbarInput{outline:0;border:none;background:0 0;color:#fff;flex:1;font-size:.5em;font-family:Nunito;padding-inline:5px}.gamemode,.settingsPage>div{border-radius:2.5px;background:var(--background)}.searchbarButton{color:#fff;font-size:.6em;aspect-ratio:1/1;height:30px;display:grid;place-items:center;cursor:pointer}.bigText,.bigTextContainer{height:50px;width:200px;font-family:Titan One}.searchResults{position:absolute;inset:0;top:45px;padding-inline:20px;overflow-y:scroll}.favoritesPage,.settingsPage{inset:0;top:32px;overflow-y:scroll;position:absolute}.noResult{margin:20px 10px;font-size:.85em}.clearLogsButton:hover,.licenseMessage{font-size:1.25em}.favoritesPage{padding-block:10px;padding-inline:20px}.licenseMessage{font-weight:900;padding-inline:20px;margin-top:10px}.copyrightTag{font-size:.7em;font-weight:200;position:absolute;bottom:0;left:0;padding:5px 8px}.codingCredits,.creditLinks,.uploadDates{list-style:none;padding-inline:20px;margin-block:16px}.settingsPage{padding:10px;display:flex;flex-direction:column;gap:10px}.sidebarPaths{display:flex;flex-direction:column;width:200px}.bigTextContainer{display:flex;font-size:2em;margin-block:10px;transition:font-size .2s .1s,margin-block .2s .1s}.bigText{display:flex;align-items:center;justify-content:center}.refreshControl{position:absolute;top:45px;right:25px;width:25px;height:25px;display:grid}.gamemode{width:100%;height:200px;margin-bottom:30px;cursor:pointer;display:flex;justify-content:center;align-items:center;padding-top:10px;position:relative;overflow:hidden;padding-bottom:35px;transition:.4s}.contentPage,.gamemode>div{position:absolute;bottom:0}.gamemode:hover{box-shadow:0 0 10px var(--highlight);transition:.2s}.gamemode>img{width:85%;max-width:100%;max-height:100%}.gamemode>div{left:0;right:0;height:25px;background:var(--highlight);display:flex;justify-content:center;align-items:center;box-shadow:0 -5px 5px #0004;font-weight:800;font-size:1.1em;transition:.25s}.contentPage{inset-inline:0;top:35px}.cheatsList{display:flex;flex-direction:column;height:100%;overflow-y:scroll;padding-inline:10px}.cheatToggle,.cheatToggle>.toggleTrigger,.runCheat{height:35px;border-radius:2.5px}.cheatsList>div{display:grid;margin-bottom:10px;position:relative;background:var(--background);border-radius:2.5px}.cheatInfo,.cheatInputs,.cheatName,.cheatTop,.logMessage>span,.runCheat,.sidebarPath,.sidebarPath>i{display:flex}.cheatInfo{flex-direction:column;flex:1}.cheatName{font-size:1.5em;font-weight:700}.cheatDescription{font-size:.8em;margin-right:25px}.runCheat{--buttonColor:var(--highlight);width:20%;background:var(--buttonColor);margin-block:auto;cursor:pointer;align-items:center;justify-content:center;font-weight:800;transition:.5s;color:#fff!important}.runCheat:hover{box-shadow:0 0 10px 0 var(--buttonColor);transition:.3s}.runCheat:active{box-shadow:0 0 0 0 var(--buttonColor);transition:50ms}.cheatInputs{margin:5px 0 5px 5px;flex-direction:column;gap:5px}.searchResult,.standing{margin-bottom:10px;transition:.2s}.creditsPage>ul>li>strong,.logMessage img,.standingBlook{margin-right:5px}.cheatInputs>div{display:flex;flex-direction:row;font-size:.8rem;color:var(--highlight);font-weight:700;align-items:center}.cheatInputs>div>span{flex:1}.cheatToggle{width:20%;background:var(--highlight2);margin-block:auto;cursor:pointer;position:relative}.cheatToggle>.toggleTrigger{width:45px;position:absolute;top:0;left:0;background:var(--highlight);pointer-events:none;transition:left .2s,box-shadow .5s;z-index:1}.cheatToggle:hover>.toggleTrigger{box-shadow:0 0 10px 0 var(--highlight);transition:left .2s,box-shadow .2s}.toggleTrigger.active{left:calc(100% - 45px)}.toggleColor{position:absolute;inset:10px 20px;background:rgb(from var(--toggleOff) r g b / 25%);border-radius:2.5px;transition:.2s}.toggleTrigger.active+.toggleColor{background:rgb(from var(--toggleOn) r g b / 25%)}input[data-type],select[data-type]{width:20%;height:25px;outline:0;border:2px solid var(--highlight);box-sizing:border-box;background:0 0;color:#fff;font-size:.9em;padding-left:5px;font-family:Nunito;border-radius:2px;font-weight:800}.logo,.sidebarPath>i{width:50px;height:50px}select[data-type]{-webkit-appearance:none;-moz-appearance:none;text-indent:1px;text-overflow:''}input::placeholder{color:rgb(from var(--textColor) r g b / 50%)}input[data-type]::-webkit-inner-spin-button,input[data-type]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[data-type][type=number]{-moz-appearance:textfield}select[data-type] option{border-radius:0}select[data-type]::-ms-expand{display:none}.sidebarPath{align-items:center;cursor:pointer;transition:.2s 0.1s}.searchResult:hover,.sidebarPath:hover{color:var(--highlight);text-shadow:0 0 5px var(--highlight)}.sidebarPath>i{justify-content:center;align-items:center;font-size:1.5em}.sidebarPath>span{padding-left:5px}.sidebar:hover .sidebarPath{padding-left:20px;transition-delay:0s}.logo{left:0;transition:left .2s .1s;display:grid;place-items:center;min-width:50px;position:absolute}.sidebar:hover .logo{left:28px;transition:left .2s}.bigText{margin-top:-150px;transition:margin-top .1s}.sidebar:hover .bigText{margin-top:0;transition:margin-top .4s 0.1s}.sidebar:hover .bigTextContainer{font-size:2.5em;margin-block:20px;transition:font-size .2s,margin-block .2s}/* === Glowing title effect === */
.bigText {
  text-shadow: 0 0 10px var(--highlight), 0 0 20px var(--highlight2);
  animation: glowPulse 2s ease-in-out infinite alternate;
}
@keyframes glowPulse {
  from { text-shadow: 0 0 10px var(--highlight); }
  to { text-shadow: 0 0 25px var(--highlight2), 0 0 40px var(--highlight); }
}
/* === Search animation effects === */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(30px);
  }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
/* === GUI fade animations === */
@keyframes guiFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes guiFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
/* === Page transition animations === */
@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.gui {
  animation: guiFadeIn 0.3s ease-out;
}
.gui.hiding {
  animation: guiFadeOut 0.3s ease-out;
}
.creditsPage>ul>li>span{color:var(--textColor2);font-weight:800}.creditsPage>ul>li i{margin-inline:2px;line-height:1}.creditsPage a{color:var(--highlight);text-decoration:none}.creditsPage a:hover,.pathPage:hover{text-decoration:underline}.warning{color:var(--highlight2);font-size:.85em}.searchResult{cursor:pointer}.searchResultName{font-weight:800}.searchResultDescription{font-size:.8em}.searchResultSeparator{font-size:1.5em;font-weight:800;margin-block:10px;cursor:pointer;transition:.2s;border-bottom:2px solid #fff;padding-inline:5px;filter:drop-shadow(0px 0px 0px var(--highlight))}.searchResultSeparator:hover{color:var(--highlight);border-bottom:2px solid var(--highlight);filter:drop-shadow(0px 0px 2.5px var(--highlight))}.toggleCheat{--buttonColor:var(--toggleOff)}.toggleCheat.active{--buttonColor:var(--toggleOn)}.logMessage img{height:1em;align-self:center}.standing{display:flex;font-weight:800;align-items:center;position:relative;padding:5px 10px 5px 50px;border-radius:2.5px;background:var(--highlight2)}.standing:before{content:attr(data-place) ".";margin-right:10px}.standing::after{content:attr(data-value);flex:1;text-align:right;font-weight:100}.standing:hover{background:var(--standingColor);box-shadow:0 0 7.5px var(--standingColor)}.standingBlook{height:1.25em;align-self:center;position:absolute;left:10px}.favoriteButton,.favoriteButton>i{transition:.2s;display:grid;place-items:center;width:32px;height:32px}.favoriteButton{font-size:.8em;padding-left:5px;cursor:pointer}.favoriteButton:hover{color:#ff0}.favoriteButton>i{position:absolute;scale:0;transform-origin:50% 55%}.favoriteButton>i.filled{scale:1}.pathPage{cursor:pointer;color:var(--highlight)}[data-favorited=false],[data-favorites="0"]{display:none}
        [data-mode][data-name][data-description] {}`
            .replace(/\.([^0-9][\w-]+)/gm, (x, y) => "." + (classes[y] ??= randString(10)))
            .replace(/data-(\w+)/gm, (x, y) => "data-" + (datasets[y] ??= randString(10)));

        gui.className = classes.gui;


        gui.append(styles);

        function roundGamemodeBoxes() {
            // Select only the gamemode tiles via the obfuscated class name
            const gamemodes = gui.querySelectorAll("." + classes.gamemode);

            gamemodes.forEach(tile => {
                tile.style.borderRadius = "15px"; // clean rounded edges
                tile.style.overflow = "hidden"; // keeps images clipped cleanly
            });
        }
        // delay ensures elements exist
        setTimeout(roundGamemodeBoxes, 50);


        const sidebarShadow = document.createElement("div");
        sidebarShadow.className = classes.sidebarShadow;

        gui.appendChild(sidebarShadow);
        const credit = document.createElement("div");
        credit.className = classes.credit;


        const sidebar = document.createElement("div");
        sidebar.className = classes.sidebar;

        sidebar.append(credit);
        const guiContent = document.createElement("div");
        guiContent.className = classes.guiContent;

        const guiTopBar = document.createElement("div");
        guiTopBar.className = classes.guiTopBar;
        guiTopBar.style.cursor = "grab"; // Make it clear the top bar is draggable
        dragElement(guiTopBar, gui); // Allow dragging from the entire top bar

        const version = document.createElement("span");
        version.className = classes.version;
        version.innerText = "Tony-the-best - X-GUI " + versionName;
        guiTopBar.append(version);

        const style = document.createElement("style");
        style.textContent = `
.xgui-i {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px 16px;
  pointer-events: none;
}

/* MOVE <--> */
.xgui-move {
  background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>\
<path d='M4 12l4-4v3h8V8l4 4-4 4v-3H8v3z'/>\
</svg>");
}

/* MINUS */
.xgui-min {
  background-image: url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>\
<rect x='4' y='11' width='16' height='2'/>\
</svg>\");
}

/* FULLSCREEN */
.xgui-full {
  background-image: url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>\
<path d='M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-16 6h6v-2H6v-4H4v6z'/>\
</svg>\");
}

/* CLOSE X */
.xgui-close {
  background-image: url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='white' stroke-width='2' fill='none'>\
<line x1='4' y1='4' x2='20' y2='20'/>\
<line x1='20' y1='4' x2='4' y2='20'/>\
</svg>\");
}
`;
        document.head.appendChild(style);




        const controls = document.createElement("div");
        controls.className = classes.controls;

        // MOVE
        const moveControl = document.createElement("div");
        moveControl.style.cursor = "grab";
        moveControl.innerHTML = `<i class="xgui-i xgui-move"></i>`;
        dragElement(moveControl, gui);

        // MINIMIZE
        const minimizeControl = document.createElement("div");
        minimizeControl.minimized = false;
        let hideAnimation = false;

        function setMinIcon(min) {
            minimizeControl.innerHTML =
                `<i class="xgui-i ${min ? "xgui-min" : "xgui-full"}"></i>`;
        }
        setMinIcon(true);

        minimizeControl.onclick = () => {
            if (hideAnimation) return;
            hideAnimation = true;

            const hidden = minimizeControl.minimized;
            setMinIcon(hidden);

            gui.animate(
                [{
                        width: hidden ? "122px" : "800px",
                        height: hidden ? "27px" : "500px",
                        left: gui.style.left
                    },
                    {
                        width: hidden ? "800px" : "122px",
                        height: hidden ? "500px" : "27px",
                        left: `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px`
                    }
                ], {
                    duration: 200,
                    easing: "ease"
                }
            );

            gui.style.width = hidden ? "800px" : "122px";
            gui.style.height = hidden ? "500px" : "27px";

            setTimeout(() => {
                for (const child of gui.children) {
                    if (child === controls) continue;
                    if (hidden) child.style.display = child._display;
                    else {
                        child._display = child.style.display;
                        child.style.display = "none";
                    }
                }
                hideAnimation = false;
            }, hidden ? 200 : 0);

            gui.style.left = `${parseInt(gui.style.left) + (hidden ? -678 : 678)}px`;
            minimizeControl.minimized = !hidden;
        };

        // CLOSE
        const closeControl = document.createElement("div");
        closeControl.innerHTML = `<i class="xgui-i xgui-close"></i>`;
        closeControl.onclick = () => {
            // Check if animations are enabled
            const animationsEnabled = getCookieValue("animationsEnabled");
            
            if (animationsEnabled) {
                // Add fade out animation before closing
                const animationDuration = 0.3; // 300ms
                gui.style.animation = `guiFadeOut ${animationDuration}s ease-out forwards`;
                gui.style.pointerEvents = 'none'; // Prevent interaction during animation
                setTimeout(() => {
                    gui.remove();
                }, animationDuration * 1000);
            } else {
                // No animation, immediately close
                gui.remove();
            }
        };

        // APPEND
        controls.append(moveControl, minimizeControl, closeControl);
        gui.appendChild(controls);




        // ======= PERSISTENCE =======
        const PERSIST_KEY = "xgui_state_v4";
        const SHIFT = 678; // minimize offset

        function saveGUIState() {
            try {
                if (gui.dataset.mobileMode === "true") return; // skip in mobile mode
                const rect = gui.getBoundingClientRect();
                const isMin = minimizeControl.minimized;
                let left = parseInt(gui.style.left) || rect.left;
                let top = parseInt(gui.style.top) || rect.top;
                if (isMin) left -= SHIFT;
                const state = {
                    left,
                    top,
                    minimized: isMin
                };
                document.cookie = PERSIST_KEY + "=" + encodeURIComponent(JSON.stringify(state)) + "; path=/; domain=.blooket.com; expires=Tue, 19 Jan 2038 03:14:07 GMT";
            } catch {}
        }

        function loadGUIState() {
            try {
                if (gui.dataset.mobileMode === "true") return {}; // skip in mobile mode
                const m = document.cookie.match(new RegExp(PERSIST_KEY + "=([^;]+)"));
                return m ? JSON.parse(decodeURIComponent(m[1])) : {};
            } catch {
                return {};
            }
        }

        // Restore position and minimized state
        (async function restoreGUI() {
            while (!gui || !minimizeControl || !moveControl || gui.children.length < 2) {
                await new Promise(r => setTimeout(r, 25));
            }

            if (gui.dataset.mobileMode === "true") return; // skip in mobile mode

            const s = loadGUIState();
            if (s.left || s.top) {
                gui.style.width = "800px";
                gui.style.height = "500px";
                gui.style.left = s.left + "px";
                gui.style.top = s.top + "px";
                await new Promise(r => setTimeout(r, 20));
                if (s.minimized) minimizeControl.onclick(); // trigger minimize animation
            }
        })();

        // Save after drag
        document.addEventListener("pointerup", () => {
            if (gui.dataset.mobileMode === "true") return;
            setTimeout(saveGUIState, 30);
        });
        // Save before unload
        window.addEventListener("beforeunload", () => {
            if (gui.dataset.mobileMode === "true") return;
            saveGUIState();
        });



        const gamemodesPage = document.createElement("div");
        gamemodesPage.className = classes.gamemodesPage;

        const gamemodesList = document.createElement("div");
        gamemodesList.className = classes.noScroll + " " + classes.gamemodesList;

        const path = [
            ["Gamemodes", gamemodesPage]
        ];

        // Global animation settings
        window.xguiAnimationsEnabled = true; // Default to true
        const getCookieValue = (name) => {
            const cookieValue = getCookie(name);
            return cookieValue === null ? true : cookieValue === "true";
        };
        // Check if animations are enabled from cookie
        setTimeout(() => {
            window.xguiAnimationsEnabled = getCookieValue("animationsEnabled");
        }, 10);

        const pathText = document.createElement("div");
        pathText.className = classes.pathText;

        path.createPage = function(name, index, current) {
            const page = document.createElement("span");

            page.innerText = name;
            if (!current) page.className = classes.pathPage;
            page.onclick = () => this.goto(index);
            return page;
        };
        path.updatePath = function() {
            pathText.innerHTML = "";
            pathText.append(this.createPage(this[0][0], 0, this.length == 1));
            for (let i = 1; i < this.length; i++) {
                pathText.append(" > ");
                pathText.append(this.createPage(this[i][0], i, this.length - 1 == i));
            }
            guiContent.innerHTML = "";
            const newPage = this[this.length - 1][1];
            guiContent.append(newPage);
            // Add page transition animation if enabled
            if (window.xguiAnimationsEnabled && newPage) {
                newPage.style.animation = "pageIn 0.3s ease-out";
            } else if (newPage) {
                // Clear animation if disabled
                newPage.style.animation = "none";
            }
            this[this.length - 1][1]?.onPath?.();
        };
        path.push = function(key, page) {
            Array.prototype.push.call(this, [key, page]);
            this.updatePath();
            return this.length;
        };

        path.goto = function(index) {
            while (this.length - 1 > index) this.pop();
            this.updatePath();
        };

        path.sidebar = function(key, page) {
            while (this.length > 0) this.pop();
            return this.push(key, page);
        };

        const leaderboardPage = document.createElement("div");
        leaderboardPage.className = classes.leaderboardPage;

        const leaderboardList = document.createElement("ul");
        leaderboardList.className = classes.noScroll + " " + classes.leaderboardList;

        leaderboardPage.append(leaderboardList);

        const logsPage = document.createElement("div");
        logsPage.className = classes.logsPage;

        const logMessages = document.createElement("ul");
        logMessages.className = classes.noScroll + " " + classes.logMessages;

        const clearLogsButton = document.createElement("div");
        clearLogsButton.className = classes.clearLogsButton;
        clearLogsButton.innerHTML = `<i class="fas fa-ban" style="line-height: 1"></i>`;

        logsPage.append(logMessages, clearLogsButton);

        let leaderboardPath;
        const Logs = {
            connection: null,
            standings: [],
            data: {},
            gamemodeData: {
                gold: {
                    sort: "g",
                },
                hack: {
                    sort: "cr",
                },
                fish: {
                    sort: "w",
                },
                pirate: {
                    sort: "d",
                },
                defense2: {
                    sort: "d",
                },
                brawl: {
                    sort: "xp",
                    upgrades: {
                        egg: "Rapid Eggs",
                        nut: "Crazy Acorns",
                        slime: "Bouncing Slime",
                        jesterBall: "Juggling Spheres",
                        horseshoe: "Revolving Horseshoes",
                        shell: "Rebounding Shell",
                        pizza: "Boomerang Pizza",
                        banana: "Curving Banana",
                        arrow: "Speeding Arrows",
                        peacock: "Peacock Feathers",
                        bone: "Whirling Bones",
                        bee: "Buzzing Bees",
                        bubble: "Booming Bubbles",
                        card: "Slicing Cards",
                        laser: "Rapid-fire Lasers",
                        darkEnergy: "Dark Energy",
                        syrup: "Sticky Syrup",
                        birdFeather: "Flying Feathers",
                    },
                },
                dino: {
                    sort: "f",
                },
                royale: {
                    sort: "e",
                },
                defense: {
                    sort: "d",
                },
                cafe: {
                    sort: "ca",
                },
                factory: {
                    sort: "ca",
                    glitches: {
                        lb: "Lunch Break",
                        as: "Ad Spam",
                        e37: "Error 37",
                        nt: "Night Time",
                        lo: "#LOL",
                        j: "Jokester",
                        sm: "Slow Mo",
                        dp: "Dance Party",
                        v: "Vortex",
                        r: "Reverse",
                        f: "Flip",
                        m: "Micro"
                    },
                },
                racing: {
                    sort: "pr",
                },
                rush: {
                    sort: "bs",
                },
                classic: {
                    sort: "p",
                },
                tower: {},
                kingdom: {},
                toy: {
                    sort: "t",
                    sabotages: {
                        c: "Oh Canada",
                        b: "Blizzard",
                        f: "Fog Spell",
                        d: "Dark & Dusk",
                        w: "Howling Wind",
                        g: "Gift Time!",
                        t: "TREES",
                        s: "Snow Plow",
                        fr: "Use The Force"
                    },
                },
            },
            exponents: ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"],
            formatNumber(input) {
                const [number, exponent] = (input = parseFloat(input)).toLocaleString(undefined, {
                    notation: "engineering"
                }).toLowerCase().split("e");
                if (exponent < 15) return number + ["", "k", "M", "B", "T"][exponent / 3];
                const [num, exp] = input.toLocaleString(undefined, {
                    notation: "scientific"
                }).toLowerCase().split("e");
                return num + " \xd7 10" + exp.split("").reduce((a, b) => a + Logs.exponents[b], "");
            },
            leaderboardCache: {},
            createStandingElement(name) {
                const element = document.createElement("li");
                element.className = classes.standing;
                element.innerText = name;
                const blook = document.createElement("img");
                blook.className = classes.standingBlook;
                element.prepend(blook);
                return (Logs.leaderboardCache[name] = element);
            },
            setLeaderboard(standings) {
                if (standings.length > 0) leaderboardPath.style.display = "flex";
                leaderboardList.innerHTML = "";
                let place = 1;
                let blookInfo;
                for (let i = 0; i < standings.length; i++) {
                    const standing = standings[i];
                    const standingEl = Logs.leaderboardCache[standing.name] || Logs.createStandingElement(standing.name);
                    standingEl.firstChild.src = (blookInfo = Logs.blookData[Logs.data[standing.name]?.b || "Black"]).url;
                    standingEl.style.setProperty("--standingColor", blookInfo.color);
                    standingEl.dataset[datasets.value] = Logs.formatNumber(standing.value);
                    if (standings[i - 1]?.value != standings[i].value) place = i + 1;
                    standingEl.dataset[datasets.place] = place;
                    leaderboardList.append(standingEl);
                }
            },
            blookData: null,
            fetchBlooks() {
                return (
                    Logs.blookData ??
                    new Promise((r) => {
                        var i = document.createElement("iframe");
                        i.style.display = "none";
                        var s = document.createElement("script");
                        s.type = "module";
                        s.src = document.querySelector("script[src*='ac.blooket.com']").src + "?" + Date.now();
                        const a = document.createElement("div");
                        a.id = "app";
                        let blooks = {};
                        document.body.appendChild(i);
                        let finish;
                        i.contentWindow.Object.prototype.hasOwnProperty.call = function(a, b) {
                            if (a[b]?.rarity && a in blooks == false) Object.assign(blooks, a);
                            finish ??= setTimeout(() => {
                                document.body.removeChild(i);
                                r((Logs.blookData = blooks));
                            });
                            return Object.prototype.hasOwnProperty.call(a, b);
                        };
                        i.contentDocument.body.appendChild(a);
                        i.contentDocument.body.appendChild(s);
                    })
                );
            },
            async connect() {
                try {
                    const stateNode = getStateNode();
                    if (!stateNode?.props?.liveGameController?._liveGameCode) return false;
                    Logs.connection = await stateNode.props.liveGameController.getDatabaseRef("c");
                    if (!Logs.connection) return false;
                    await Logs.fetchBlooks();
                    const gamemode = Logs.getGamemode();
                    Logs.connection.on("value", (snapshot) => {
                        const players = snapshot.val() || {};
                        let added;
                        if (!players || !(added = Logs.diffObjects(Logs.data, players))) return;
                        Logs.data = players;
                        if (Logs.gamemodeData[gamemode].sort) {
                            Logs.standings = Object.entries(players)
                                .map(([name, data]) => ({
                                    name,
                                    blook: data.b,
                                    value: data[Logs.gamemodeData[gamemode].sort] || 0
                                }))
                                .sort((a, b) => b.value - a.value);
                            Logs.setLeaderboard(Logs.standings);
                        }
                        try {
                            let addedPlayer;
                            switch (gamemode) {
                                case "brawl":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).up) continue;
                                        const upgrade = addedPlayer.up.split(":");
                                        if (upgrade.length == 2 && upgrade[0] in Logs.gamemodeData.brawl.upgrades) Logs.addAlert(player, `upgraded ${Logs.gamemodeData.brawl.upgrades[upgrade[0]]} to level ${upgrade[1]}`);
                                    }
                                    break;
                                case "gold":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, amount] = addedPlayer.tat.split(":");
                                        if (amount == "swap") Logs.addAlert(player, `just swapped ${document.querySelector("[src*='assets/candy']") ? "candy" : "gold"} with ${tat}`);
                                        else Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} ${document.querySelector("[src*='assets/candy']") ? "candy" : "gold"} from ${tat}`);
                                    }
                                    break;
                                case "toy":
                                    for (const player in added) {
                                        if ((addedPlayer = added[player]).s) Logs.addAlert(player, `sabotaged with "${Logs.gamemodeData.toy.sabotages[addedPlayer.s]}"`);
                                        else if (addedPlayer.tat) {
                                            const [tat, amount] = addedPlayer.tat.split(":");
                                            if (amount == "swap") Logs.addAlert(player, `just swapped toys with ${tat}`);
                                            else Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} toy${amount == 1 ? "" : "s"} from ${tat}`);
                                        }
                                    }
                                    break;
                                case "hack":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, amount] = addedPlayer.tat.split(":");
                                        Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} crypto from ${tat}`);
                                    }
                                    break;
                                case "pirate":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, amount] = addedPlayer.tat.split(":");
                                        Logs.addAlert(player, `just took ${Logs.formatNumber(parseInt(amount))} doubloons from ${tat}`);
                                    }
                                    break;
                                case "defense2":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).r) continue;
                                        Logs.addAlert(player, `just completed Round ${addedPlayer.r}!`);
                                    }
                                    break;
                                case "fishing":
                                    for (const player in added) {
                                        if ((addedPlayer = added[player]).f == "Frenzy") Logs.addAlert(player, `just started a frenzy`);
                                        else if (addedPlayer.s) Logs.addAlert(player, `just sent a ${addedPlayer.f} distraction`);
                                    }
                                    break;
                                case "dino":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).tat) continue;
                                        const [tat, caught] = addedPlayer.tat.split(":");
                                        if (caught == "true") Logs.addAlert(player, `just caught ${tat} CHEATING!`);
                                        else Logs.addAlert(player, `investigated ${tat}`);
                                    }
                                    break;
                                case "cafe":
                                    for (const player in added) {
                                        if (!(addedPlayer = added[player]).up) continue;
                                        const [upgrade, level] = addedPlayer.up.split(":");
                                        if (level) Logs.addAlert(player, `upgraded ${upgrade} to level ${level}`);
                                    }
                                    break;
                                case "factory":
                                    for (const player in added) {
                                        if ((addedPlayer = added[player]).g) Logs.addAlert(player, `activated the ${Logs.gamemodeData.factory.glitches[addedPlayer.g]} glitch!`);
                                        else if (addedPlayer.s) {
                                            const [amount, synergy] = addedPlayer.s.split("-");
                                            Logs.addAlert(player, `has a ${amount} ${synergy} synergy!`);
                                        } else if (addedPlayer.t) Logs.addAlert(player, `now has 10 Blooks!`);
                                    }
                                    break;
                            }
                        } catch (e) {
                            console.error(e);
                            Logs.addLog("Error adding an alert", "red");
                        }
                    });
                    return true;
                } catch (e) {
                    console.warn(e);
                    return false;
                }
            },
            diffObjects(obj1, obj2) {
                const changed = {};

                for (const key in obj1) {
                    if (!(key in obj2)) continue;
                    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
                        const recChanged = Logs.diffObjects(obj1[key], obj2[key]);
                        if (recChanged && Object.keys(recChanged).length !== 0) changed[key] = recChanged;
                    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) changed[key] = obj2[key];
                }

                for (const key in obj2)
                    if (!(key in obj1)) changed[key] = obj2[key];

                if (Object.keys(changed).length == 0) return null;
                return changed;
            },
            getGamemode() {
                const gamemode = getStateNode().props?.client?.type;
                if (typeof gamemode == "string") return gamemode.toLowerCase();
                switch (window.location.pathname) {
                    case "/play/gold":
                    case "/play/gold/final":
                    case "/gold/play/landing":
                        return "gold";
                    case "/play/hack":
                    case "/play/hack/final":
                    case "/hack/play/landing":
                        return "hack";
                    case "/play/fishing":
                    case "/play/fishing/final":
                    case "/fish/play/landing":
                        return "fish";
                    case "/play/pirate":
                    case "/play/pirate/final":
                    case "/pirate/play/landing":
                        return "pirate";
                    case "/play/defense2/load":
                    case "/play/defense2":
                    case "/play/defense2/final":
                    case "/defense2/play/landing":
                        return "defense2";
                    case "/play/brawl/start":
                    case "/play/brawl/settings":
                    case "/play/brawl":
                    case "/play/brawl/final":
                    case "/brawl/play/landing":
                        return "brawl";
                    case "/play/dino":
                    case "/play/dino/final":
                    case "/dino/play/landing":
                        return "dino";
                    case "/play/battle-royale/match/preview":
                    case "/play/battle-royale/question":
                    case "/play/battle-royale/answer/sent":
                    case "/play/battle-royale/answer/result":
                    case "/play/battle-royale/match/result":
                    case "/play/battle-royale/final":
                    case "/royale/play/landing":
                        return "royale";
                    case "/defense/load":
                    case "/defense":
                    case "/defense/final":
                    case "/defense/play/landing":
                        return "defense";
                    case "/cafe/load":
                    case "/cafe":
                    case "/cafe/shop":
                    case "/cafe/final":
                    case "/cafe/play/landing":
                        return "cafe";
                    case "/play/factory":
                    case "/play/factory/settings":
                    case "/play/factory/start":
                    case "/play/factory/final":
                    case "/factory/play/landing":
                        return "factory";
                    case "/play/racing":
                    case "/play/racing/final":
                    case "/racing/play/landing":
                        return "racing";
                    case "/play/rush":
                    case "/play/rush/final":
                    case "/rush/play/landing":
                        return "rush";
                    case "/play/classic/get-ready":
                    case "/play/classic/question":
                    case "/play/classic/answer/sent":
                    case "/play/classic/answer/result":
                    case "/play/classic/standings":
                    case "/play/classic/final":
                    case "/classic/play/landing":
                        return "classic";
                    case "/tower/load":
                    case "/tower/start":
                    case "/tower/map":
                    case "/tower/battle":
                    case "/tower/rest":
                    case "/tower/risk":
                    case "/tower/shop":
                    case "/tower/victory":
                    case "/tower/final":
                    case "/tower/play/landing":
                        return "tower";
                    case "/kingdom/start":
                    case "/kingdom":
                    case "/kingdom/final":
                    case "/kingdom/play/landing":
                        return "kingdom";
                    case "/play/toy":
                    case "/play/toy/final":
                    case "/toy/play/landing":
                        return "toy";
                }
                return "";
            },
            sanitizer: document.createElement("div"),
            sanitizeText(text) {
                Logs.sanitizer.textContent = text;
                return Logs.sanitizer.innerHTML;
            },
            addAlert(name, message) {
                const element = document.createElement("li");
                element.className = classes.logMessage;
                const span = document.createElement("span");
                Logs.lastLog.setTime(Date.now());
                span.innerHTML = `<strong>${Logs.sanitizeText(name)}</strong>&nbsp;${Logs.sanitizeText(message)}<span style="opacity: 50%; flex: 1; text-align: right;">${parseTime(Logs.lastLog)}</span>`;
                let blook;
                if ((blook = Logs.blookData?.[Logs.data[name].b])) {
                    const img = document.createElement("img");
                    img.src = blook.url;
                    span.prepend(img);
                }
                element.append(span);
                logMessages.prepend(element);
            },
            lastLog: new Date(),
            addLog(message, color) {
                const element = document.createElement("li");
                element.className = classes.logMessage;
                const span = document.createElement("span");
                if (color) span.style.color = color;
                span.style.display = "flex";
                Logs.lastLog.setTime(Date.now());
                span.innerHTML = "[LOG] " + Logs.sanitizeText(message) + `<span style="opacity: 50%; flex: 1; text-align: right;">${parseTime(Logs.lastLog)}</span>`;
                element.append(span);
                logMessages.prepend(element);
            },
            interval: null,
        };

        if (window.location.host != "dashboard.blooket.com" && window.location.host != "blooket.com") Logs.interval = setInterval(() => Logs.connect().then((connected) => connected && clearInterval(Logs.interval)), 5000);

        clearLogsButton.onclick = () => {
            clearLogsButton.animate([{
                rotate: "0deg"
            }, {
                rotate: "360deg"
            }], {
                duration: 750,
                easing: "ease"
            });
            logMessages.innerHTML = "";
            Logs.addLog("Cleared Logs");
        };

        // Helper function to create a function from user code
        // Handles various input formats: function declarations, arrow functions, IIFEs, or raw code
        function createFunctionFromCode(code, ...params) {
            try {
                // Trim the code
                code = code.trim();
                
                // Check if it's an IIFE (Immediately Invoked Function Expression)
                // Pattern: (function(...) {...})() or ((...) => {...})() or (() => {...})()
                const iifePattern = /^\(.*\)\(\);?$/s;
                if (iifePattern.test(code)) {
                    // Wrap the IIFE in a function that will execute it when called
                    // This allows us to store the IIFE and run it later
                    return new Function(code);
                }
                
                // Check if it's a complete function definition (function(...) { ... })
                if (code.startsWith('function')) {
                    // Extract the function by evaluating it
                    // Wrap in parentheses to make it an expression
                    return eval(`(${code})`);
                }
                
                // Check if it's an arrow function
                if (code.includes('=>')) {
                    // Wrap in parentheses to make it an expression
                    return eval(`(${code})`);
                }
                
                // Otherwise, treat it as a function body
                // If params are provided, use them
                if (params.length > 0) {
                    return new Function(...params, code);
                } else {
                    return new Function(code);
                }
            } catch (error) {
                console.error('Error creating function from code:', error);
                console.error('Code:', code);
                // Return a no-op function on error
                return function() {
                    console.error('Failed to execute custom module due to syntax error');
                };
            }
        }

        const cheats = {
            global: {
                img: "https://ac.blooket.com/dashclassic/assets/Blooket-M6jYh_hk.png",
                name: "Global",
                cheats: [{
                        name: "Auto Answer",
                        description: "Toggles auto answer on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    const Question = stateNode.state.question || stateNode.props.client.question;
                                    if (stateNode.state.question.qType != "typing") {
                                        if (stateNode.state.stage != "feedback" && !stateNode.state.feedback) {
                                            let ind;
                                            for (ind = 0; ind < Question.answers.length; ind++) {
                                                let found = false;
                                                for (let j = 0; j < Question.correctAnswers.length; j++)
                                                    if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                        found = true;
                                                        break;
                                                    }
                                                if (found) break;
                                            }
                                            document.querySelectorAll("[class*='answerContainer']")[ind].click();
                                        } else document.querySelector("[class*='feedback'], [id*='feedback']").firstChild.click();
                                    } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(Question.answers[0]);
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Highlight Answers",
                        description: "Toggles highlight answers on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    const Question = stateNode.state.question || stateNode.props.client.question;
                                    let ind = 0;
                                    while (ind < Question.answers.length) {
                                        let found = false;
                                        for (let j = 0; j < Question.correctAnswers.length; j++)
                                            if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                found = true;
                                                break;
                                            }
                                        ind++;
                                        document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.backgroundColor = found ? "rgb(0, 207, 119)" : "rgb(189, 15, 38)";
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Subtle Highlight Answers",
                        description: "Toggles subtle highlight answers on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    const Question = stateNode.state.question || stateNode.props.client.question;
                                    let ind = 0;
                                    while (ind < Question.answers.length) {
                                        let j = 0;
                                        let found = false;
                                        while (j < Question.correctAnswers.length) {
                                            if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                found = true;
                                                break;
                                            }
                                            j++;
                                        }
                                        ind++;
                                        if (found) document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.boxShadow = "unset";
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    }, {
                        name: "Learn Auto Answer",
                        description: "Toggles Learn Auto Answer on. This version works in the modes that auto answer doesnt work in, but can only learn answers if you've seen them before.",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                (() => {
                                    console.log("🧠 Learn Auto Answer v3.3\n");

                                    if (!window.answerDatabase) {
                                        window.answerDatabase = {};
                                    }

                                    function autoContinue() {
                                        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
                                        const feedbackText = document.querySelector('[class*="feedbackText"]');
                                        const isFeedback = feedbackContainer || (feedbackText && feedbackText.offsetParent !== null);

                                        if (isFeedback) {
                                            if (feedbackContainer) feedbackContainer.click();
                                            else document.body.click();

                                            const event = new KeyboardEvent('keydown', {
                                                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
                                            });
                                            document.dispatchEvent(event);
                                        }
                                    }

                                    function learn() {
                                        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');

                                        wrappers.forEach(wrapper => {
                                            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
                                            if (!questionTextEl) return;

                                            let questionMedia = wrapper.querySelector('[class*="questionImage"]');
                                            let qMediaSrc = questionMedia ? questionMedia.src : "none";

                                            let questionMath = wrapper.querySelector('[class*="mq-selectable"]');
                                            let qMathText = questionMath ? questionMath.innerText.trim() : "none";

                                            const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

                                            const correctBtn = Array.from(wrapper.querySelectorAll('[class*="answerButton"]')).find(btn =>
                                                btn.innerHTML.includes('fa-check') ||
                                                (btn.style.backgroundColor && btn.style.backgroundColor.includes('rgb(139, 220, 111)')) ||
                                                (btn.querySelector('[class*="answerFront"]') && btn.querySelector('[class*="answerFront"]').style.backgroundColor.includes('rgb(139, 220, 111)'))
                                            );

                                            if (correctBtn) {
                                                const textEl = correctBtn.querySelector('[class*="answerText"]');
                                                const mathEl = correctBtn.querySelector('[class*="mq-selectable"]');

                                                const answer = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : null);

                                                if (answer && !window.answerDatabase[question]) {
                                                    window.answerDatabase[question] = [answer];
                                                    console.log(`✓ Learned (MC): "${question}" → "${answer}"`);
                                                }
                                            }

                                            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
                                            const realTypingAnswers = rawTypingEls.filter(el => {
                                                const cls = el.getAttribute('class') || "";
                                                return !cls.includes('Answers') && !cls.includes('Icon');
                                            });

                                            if (realTypingAnswers.length > 0) {
                                                const answer = realTypingAnswers[0].textContent.trim();
                                                if (!window.answerDatabase[question]) {
                                                    window.answerDatabase[question] = [answer];
                                                    console.log(`✓ Learned (Typing): "${question}" → "${answer}"`);
                                                }
                                            }
                                        });
                                    }

                                    function answer() {
                                        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
                                        if (wrappers.length === 0) return;

                                        let activeWrapper = wrappers[wrappers.length - 1];
                                        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
                                        if (!questionTextEl) return;

                                        let questionMedia = activeWrapper.querySelector('[class*="questionImage"]');
                                        let qMediaSrc = questionMedia ? questionMedia.src : "none";
                                        let questionMath = activeWrapper.querySelector('[class*="mq-selectable"]');
                                        let qMathText = questionMath ? questionMath.innerText.trim() : "none";

                                        const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

                                        if (window.answerDatabase[question]) {
                                            const knownAnswer = window.answerDatabase[question][0];

                                            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
                                            for (const btn of buttons) {
                                                const textEl = btn.querySelector('[class*="answerText"]');
                                                const mathEl = btn.querySelector('[class*="mq-selectable"]');
                                                const btnText = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : "");

                                                if (btnText === knownAnswer && !btn.className.includes('Disabled')) {
                                                    console.log(`🎯 Answering (MC): "${question}"`);
                                                    btn.click();
                                                    return;
                                                }
                                            }

                                            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
                                            if (input && !input.disabled) {
                                                if (input.value !== knownAnswer) {
                                                    console.log(`🎯 Typing: "${knownAnswer}"`);
                                                    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                                                    setter.call(input, knownAnswer);
                                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                                }

                                                const submitBtn = activeWrapper.querySelector('button[class*="typingAnswerButton"]');
                                                if (submitBtn && (!submitBtn._lastClick || Date.now() - submitBtn._lastClick > 200)) {
                                                    submitBtn.click();
                                                    submitBtn._lastClick = Date.now();
                                                }
                                            }
                                        }
                                    }

                                    this.data = setInterval(() => {
                                        autoContinue();
                                        learn();
                                        answer();
                                    }, 50);

                                    console.log("✅ Script Active.");
                                })();
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    }, {
                        name: "Learn Highlight Answer",
                        description: "Toggles Learn Highlight Answer on. This version works in the modes that highlight answers doesnt work in, but can only learn answers if you've seen them before.",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                (() => {
                                    console.log("🎨 Highlight Answers Active (Green = Correct, Red = Wrong)\n");

                                    if (!window.answerDatabase) {
                                        window.answerDatabase = {};
                                    }

                                    function autoContinue() {
                                        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
                                        const feedbackText = document.querySelector('[class*="feedbackText"]');

                                        const isFeedback = feedbackContainer ||
                                                        (feedbackText && feedbackText.offsetParent !== null);

                                        if (isFeedback) {
                                            if (feedbackContainer) {
                                                feedbackContainer.click();
                                            } else {
                                                document.body.click();
                                            }

                                            const event = new KeyboardEvent('keydown', {
                                                key: 'Enter',
                                                code: 'Enter',
                                                keyCode: 13,
                                                which: 13,
                                                bubbles: true
                                            });
                                            document.dispatchEvent(event);
                                        }
                                    }

                                    function learn() {
                                        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');

                                        wrappers.forEach(wrapper => {
                                            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
                                            if (!questionTextEl) return;

                                            let questionMedia = wrapper.querySelector('[class*="questionImage"]');
                                            let qMediaSrc = questionMedia ? questionMedia.src : "none";

                                            let questionMath = wrapper.querySelector('[class*="mq-selectable"]');
                                            let qMathText = questionMath ? questionMath.innerText.trim() : "none";

                                            const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

                                            const correctBtn = Array.from(wrapper.querySelectorAll('[class*="answerButton"]')).find(btn =>
                                                btn.innerHTML.includes('fa-check') ||
                                                (btn.style.backgroundColor && btn.style.backgroundColor.includes('rgb(139, 220, 111)')) ||
                                                (btn.querySelector('[class*="answerFront"]') && btn.querySelector('[class*="answerFront"]').style.backgroundColor.includes('rgb(139, 220, 111)'))
                                            );

                                            if (correctBtn) {
                                                const textEl = correctBtn.querySelector('[class*="answerText"]');
                                                const mathEl = correctBtn.querySelector('[class*="mq-selectable"]');

                                                const answer = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : null);

                                                if (answer && !window.answerDatabase[question]) {
                                                    window.answerDatabase[question] = [answer];
                                                    console.log(`✓ Learned (MC): "${question}" → "${answer}"`);
                                                }
                                            }

                                            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
                                            const realTypingAnswers = rawTypingEls.filter(el => {
                                                const cls = el.getAttribute('class') || "";
                                                return !cls.includes('Answers') && !cls.includes('Icon');
                                            });

                                            if (realTypingAnswers.length > 0) {
                                                const answer = realTypingAnswers[0].textContent.trim();
                                                if (!window.answerDatabase[question]) {
                                                    window.answerDatabase[question] = [answer];
                                                    console.log(`✓ Learned (Typing): "${question}" → "${answer}"`);
                                                }
                                            }
                                        });
                                    }

                                    function highlight() {
                                        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
                                        if (wrappers.length === 0) return;

                                        const activeWrapper = wrappers[wrappers.length - 1];

                                        if (activeWrapper.className.includes('slideOut')) return;

                                        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
                                        if (!questionTextEl) return;

                                        let questionMedia = activeWrapper.querySelector('[class*="questionImage"]');
                                        let qMediaSrc = questionMedia ? questionMedia.src : "none";
                                        let questionMath = activeWrapper.querySelector('[class*="mq-selectable"]');
                                        let qMathText = questionMath ? questionMath.innerText.trim() : "none";

                                        const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

                                        if (window.answerDatabase[question]) {
                                            const knownAnswer = window.answerDatabase[question][0];

                                            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
                                            if (buttons.length > 0) {
                                                buttons.forEach(btn => {
                                                    const textEl = btn.querySelector('[class*="answerText"]');
                                                    const mathEl = btn.querySelector('[class*="mq-selectable"]');
                                                    const btnText = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : "");

                                                    const front = btn.querySelector('[class*="answerFront"]');
                                                    const back = btn.querySelector('[class*="answerBack"]');

                                                    const correctColor = '#00ff00';
                                                    const wrongColor = '#ff0000';

                                                    if (btnText === knownAnswer) {
                                                        if (front) {
                                                            front.style.backgroundColor = correctColor;
                                                            front.style.color = 'black';
                                                        }
                                                        if (back) back.style.backgroundColor = '#00cc00';
                                                    } else if (btnText) {
                                                        if (front) {
                                                            front.style.backgroundColor = wrongColor;
                                                            front.style.opacity = '0.7';
                                                        }
                                                        if (back) back.style.backgroundColor = '#cc0000';
                                                    }
                                                });
                                            }

                                            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
                                            if (input) {
                                                input.setAttribute('placeholder', `ANSWER: ${knownAnswer}`);

                                                const subHeader = activeWrapper.querySelector('[class*="typingAnswerSubheader"]');
                                                if (subHeader) {
                                                    subHeader.textContent = `ANSWER: ${knownAnswer}`;
                                                    subHeader.style.color = '#00ff00';
                                                    subHeader.style.fontWeight = 'bold';
                                                    subHeader.style.fontSize = '20px';
                                                }
                                            }
                                        }
                                    }

                                    this.data=setInterval(() => {
                                        autoContinue();
                                        learn();
                                        highlight();
                                    }, 100);

                                    console.log("✅ Highlighting Active. Play manually to populate database.");
                                })();

                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    }, {
                        name: "Learn Subtle Highlight Answers",
                        description: "Toggles auto answer on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                (() => {
                                    console.log("🕵️ Subtle Highlight Active (Lighter Shadow = Correct)\n");

                                    if (!window.answerDatabase) {
                                        window.answerDatabase = {};
                                    }

                                    function lightenColor(color) {
                                        const rgb = color.match(/\d+/g);
                                        if (!rgb) return color;

                                        const r = Math.round(parseInt(rgb[0]) + (255 - parseInt(rgb[0])) * 0.1);
                                        const g = Math.round(parseInt(rgb[1]) + (255 - parseInt(rgb[1])) * 0.1);
                                        const b = Math.round(parseInt(rgb[2]) + (255 - parseInt(rgb[2])) * 0.1);

                                        return `rgb(${r}, ${g}, ${b})`;
                                    }

                                    function autoContinue() {
                                        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
                                        const feedbackText = document.querySelector('[class*="feedbackText"]');

                                        const isFeedback = feedbackContainer ||
                                                        (feedbackText && feedbackText.offsetParent !== null);

                                        if (isFeedback) {
                                            if (feedbackContainer) {
                                                feedbackContainer.click();
                                            } else {
                                                document.body.click();
                                            }

                                            const event = new KeyboardEvent('keydown', {
                                                key: 'Enter',
                                                code: 'Enter',
                                                keyCode: 13,
                                                which: 13,
                                                bubbles: true
                                            });
                                            document.dispatchEvent(event);
                                        }
                                    }

                                    function learn() {
                                        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');

                                        wrappers.forEach(wrapper => {
                                            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
                                            if (!questionTextEl) return;

                                            let questionMedia = wrapper.querySelector('[class*="questionImage"]');
                                            let qMediaSrc = questionMedia ? questionMedia.src : "none";

                                            let questionMath = wrapper.querySelector('[class*="mq-selectable"]');
                                            let qMathText = questionMath ? questionMath.innerText.trim() : "none";

                                            const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

                                            const correctBtn = Array.from(wrapper.querySelectorAll('[class*="answerButton"]')).find(btn =>
                                                btn.innerHTML.includes('fa-check') ||
                                                (btn.style.backgroundColor && btn.style.backgroundColor.includes('rgb(139, 220, 111)')) ||
                                                (btn.querySelector('[class*="answerFront"]') && btn.querySelector('[class*="answerFront"]').style.backgroundColor.includes('rgb(139, 220, 111)'))
                                            );

                                            if (correctBtn) {
                                                const textEl = correctBtn.querySelector('[class*="answerText"]');
                                                const mathEl = correctBtn.querySelector('[class*="mq-selectable"]');

                                                const answer = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : null);

                                                if (answer && !window.answerDatabase[question]) {
                                                    window.answerDatabase[question] = [answer];
                                                    console.log(`✓ Learned: "${question}" → "${answer}"`);
                                                }
                                            }

                                            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
                                            const realTypingAnswers = rawTypingEls.filter(el => {
                                                const cls = el.getAttribute('class') || "";
                                                return !cls.includes('Answers') && !cls.includes('Icon');
                                            });

                                            if (realTypingAnswers.length > 0) {
                                                const answer = realTypingAnswers[0].textContent.trim();
                                                if (!window.answerDatabase[question]) {
                                                    window.answerDatabase[question] = [answer];
                                                    console.log(`✓ Learned: "${question}" → "${answer}"`);
                                                }
                                            }
                                        });
                                    }

                                    function highlight() {
                                        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
                                        if (wrappers.length === 0) return;

                                        const activeWrapper = wrappers[wrappers.length - 1];
                                        if (activeWrapper.className.includes('slideOut')) return;

                                        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
                                        if (!questionTextEl) return;

                                        let questionMedia = activeWrapper.querySelector('[class*="questionImage"]');
                                        let qMediaSrc = questionMedia ? questionMedia.src : "none";
                                        let questionMath = activeWrapper.querySelector('[class*="mq-selectable"]');
                                        let qMathText = questionMath ? questionMath.innerText.trim() : "none";

                                        const question = questionTextEl.textContent.trim() + " " + qMediaSrc + " " + qMathText;

                                        if (window.answerDatabase[question]) {
                                            const knownAnswer = window.answerDatabase[question][0];

                                            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
                                            if (buttons.length > 0) {
                                                buttons.forEach(btn => {
                                                    const textEl = btn.querySelector('[class*="answerText"]');
                                                    const mathEl = btn.querySelector('[class*="mq-selectable"]');
                                                    const btnText = textEl ? textEl.textContent.trim() : (mathEl ? mathEl.innerText.trim() : "");

                                                    const back = btn.querySelector('[class*="answerBack"]');

                                                    if (back && btnText === knownAnswer) {
                                                        const currentColor = window.getComputedStyle(back).backgroundColor;
                                                        back.style.backgroundColor = lightenColor(currentColor);
                                                    }
                                                });
                                            }

                                            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
                                            if (input) {
                                                input.setAttribute('placeholder', knownAnswer);
                                            }
                                        }
                                    }

                                    this.data = setInterval(() => {
                                        autoContinue();
                                        learn();
                                        highlight();
                                    }, 100);

                                    console.log("✅ Subtle Highlight Active.");
                                })();


                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {


                        name: "Freeze Leaderboard",
                        description: "Freezes the leaderboard on the host's screen",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            var e = Object.values(function e(t = document.querySelector("#app")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                                }
                                ())[1].children[0]._owner.stateNode;
                            if (this.enabled)
                                this.enabled = !1, clearInterval(this.data), this.data = null, e.props.liveGameController.removeVal(`c/${e.props.client.name}/tat`);
                            else {
                                this.enabled = !0;
                                let t = () => {
                                    e.props.liveGameController.setVal({
                                        path: `c/${e.props.client.name}/tat/Freeze`,
                                        val: "freeze"
                                    })
                                };
                                this.data = setInterval(t, 25)
                            }
                        }
                    }, {
                        name: "Anti Kick",
                        description: "Prevents the host from kicking you, Although cheats stop working and you can't win.",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            const stateNode = getStateNode();
                            const lgc = stateNode?.props?.liveGameController;

                            if (!lgc) return alert("Not in a game.");

                            if (!this.enabled) {
                                // TURN ON
                                this.enabled = true;

                                const playerName = stateNode.props.client.name;
                                const savedBlook = stateNode.props.client.blook;

                                this.data = setInterval(() => {
                                    lgc.getDatabaseRef("c").once("value", (snap) => {
                                        const players = snap.val() || {};

                                        // Host kicked you → your entry removed
                                        if (!players[playerName]) {
                                            lgc.setVal({
                                                path: `c/${playerName}`,
                                                val: {
                                                    n: playerName,
                                                    b: savedBlook
                                                }
                                            });
                                        }
                                    });
                                }, 500);

                            } else {
                                // TURN OFF
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        }
                    }, {



                        name: "Percent Auto Answer",
                        description: "Answers questions correctly or incorrectly depending on the goal grade given (Disable and re-enable to update goal)",
                        inputs: [{
                            name: "Target Grade",
                            type: "number",
                        }, ],
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function(target) {
                            if (!this.enabled) {
                                this.enabled = true;
                                const stateNode = getStateNode();
                                this.data = setInterval(
                                    (TARGET) => {
                                        try {
                                            const question = stateNode.state.question || stateNode.props.client.question;
                                            if (stateNode.state.stage == "feedback" || stateNode.state.feedback) return document.querySelector('[class*="feedback"], [id*="feedback"]')?.firstChild?.click?.();
                                            else if (document.querySelector("[class*='answerContainer']") || document.querySelector("[class*='typingAnswerWrapper']")) {
                                                let correct = 0,
                                                    total = 0;
                                                for (let corrects in stateNode.corrects) correct += stateNode.corrects[corrects];
                                                for (let incorrect in stateNode.incorrects) total += stateNode.incorrects[incorrect];
                                                total += correct;
                                                const yes = total == 0 || Math.abs(correct / (total + 1) - TARGET) >= Math.abs((correct + 1) / (total + 1) - TARGET);
                                                if (stateNode.state.question.qType != "typing") {
                                                    const answerContainers = document.querySelectorAll("[class*='answerContainer']");
                                                    for (let i = 0; i < answerContainers.length; i++) {
                                                        const contains = question.correctAnswers.includes(question.answers[i]);
                                                        if (yes == contains) return answerContainers[i]?.click?.();
                                                    }
                                                    answerContainers[0].click();
                                                } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(yes ? question.answers[0] : Math.random().toString(36).substring(2));
                                            }
                                        } catch {}
                                    },
                                    100,
                                    (target ?? 100) / 100
                                );
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Auto Answer",
                        description: "Click the correct answer for you",
                        run: function() {
                            const stateNode = getStateNode();
                            const Question = stateNode.state.question || stateNode.props.client.question;
                            if (stateNode.state.question.qType != "typing") {
                                if (stateNode.state.stage != "feedback" && !stateNode.state.feedback) {
                                    let ind;
                                    for (ind = 0; ind < Question.answers.length; ind++) {
                                        let found = false;
                                        for (let j = 0; j < Question.correctAnswers.length; j++)
                                            if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                found = true;
                                                break;
                                            }
                                        if (found) break;
                                    }
                                    document.querySelectorAll("[class*='answerContainer']")[ind].click();
                                } else document.querySelector("[class*='feedback'], [id*='feedback']").firstChild.click();
                            } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(Question.answers[0]);
                        },
                    },
                    {
                        name: "Highlight Answers",
                        description: "Colors answers to be red or green highlighting the correct ones",
                        run: function() {
                            const stateNode = getStateNode();
                            const Question = stateNode.state.question || stateNode.props.client.question;
                            let ind = 0;
                            while (ind < Question.answers.length) {
                                let found = false;
                                for (let j = 0; j < Question.correctAnswers.length; j++)
                                    if (Question.answers[ind] == Question.correctAnswers[j]) {
                                        found = true;
                                        break;
                                    }
                                ind++;
                                document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.backgroundColor = found ? "rgb(0, 207, 119)" : "rgb(189, 15, 38)";
                            }
                        },
                    },
                    {
                      name: "Free Folder!",
                            description: "Gives you plus perks like folders, does not unlock plus gamemodes! (ONLY WORKS ON THE ~MY SETS~ PAGE!)",
                            run: function () {

    const reactHandler = () => Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
    const component = reactHandler();

    if (!component) return console.error("React component not found!");

    component.getIsPlus = e => e();
    component.plus = true;

    if (component.props && component.props.user && component.props.user.data) {
        component.props.user.data.plan = "Plus";
        component.props.user.data.hasPlus = true;
        component.props.user.data.planName = "Plus";
    }

    component.setState({
        hasPlus: true,
        noFolder: false,
        noMerge: false,
        copying: false
    });

    console.log("Folders unlocked!");

                        },
                    },{


                        name: "Simulate Unlock",
                        description: "Simulates unlocking a certain blook",
                        inputs: [{
                            name: "Blook (Case Sensitive)"
                        }],
                        run: (unlockedBlook) => {
                            const stateNode = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                            stateNode.setState({
                                loadingPack: !1,
                                openPack: !0,
                                unlockedBlook,
                                newUnlock: !0,
                                canOpen: !1
                            });
                            setTimeout(() => stateNode.setState({
                                canOpen: !0
                            }), 200);
                        }
                    }, {
                        name: "Simulate Pack",
                        description: "Simulates unlocking a pack",
                        inputs: [{
                            name: "Pack",
                            type: "options",
                            options: () => [...document.querySelector("[class*=packsWrapper]")?.children]?.map(e => e.children[0].children[0].alt)
                        }],
                        run: async (packName) => {
                            let i = document.createElement('iframe');
                            document.body.append(i);
                            const alert = i.contentWindow.alert.bind(window);
                            i.remove();
                            if (window.location.pathname !== "/market") {
                                alert("You must be on the market page to run this cheat!");
                                return;
                            }
                            const stateNode = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                            const getProbs = (pack) => (new Promise(res => {
                                if (!Array.prototype.map2) {
                                    Array.prototype.map2 = Array.prototype.map;
                                }
                                Array.prototype.map = function() {
                                    if (typeof this[0]?.[1] == "number") {
                                        res(this);
                                        Array.prototype.map = Array.prototype.map2;
                                    }
                                    return Array.prototype.map2.apply(this, arguments);
                                }
                                var a = new(stateNode.constructor)();
                                a.state.currentPack = pack;
                                a.render();
                                res(null);
                            }));
                            async function pickRandom(pack) {
                                let probs = (await getProbs(pack));
                                const choice = pickW(probs.map(e => e[1]));
                                return probs[choice];
                            }

                            function pickW(a) {
                                let v = 0;
                                let sum = [];
                                const rand = Math.floor(Math.random() * a.reduce((a, b) => a + b, 0));
                                a.forEach(e => (sum.push(v), v += e));
                                return sum.map(e => rand < e).findLastIndex(e => e ? 0 : 1);
                            }
                            stateNode.setState({
                                loadingPack: !1,
                                openPack: !0,
                                unlockedBlook: (await pickRandom(packName))[0],
                                newUnlock: !0,
                                canOpen: !1
                            });
                            setTimeout(() => stateNode.setState({
                                canOpen: !0
                            }), 200);
                        }
                    }, {
                        name: "Spam Buy Blooks",
                        description: "Opens a box an amount of times",
                        inputs: [{
                                name: "Box",
                                type: "options",
                                options: () =>
                                    Array.from(document.querySelectorAll("[class*='packsWrapper'] > div")).reduce((a, b) => {
                                        b.querySelector("[class*='blookContainer'] > img") || a.push(b.querySelector("[class*='packImgContainer'] > img").alt);
                                        return a;
                                    }, []),
                            },
                            {
                                name: "Amount",
                                type: "number",
                            },
                            {
                                name: "Show Unlocks",
                                type: "options",
                                options: [{
                                        name: "Show Unlocks",
                                        value: true,
                                    },
                                    {
                                        name: "Don't Show Unlocks",
                                        value: false,
                                    },
                                ],
                            },
                        ],
                        run: async function(box, amountToOpen, alertBlooks) {
                            if (window.location.pathname.startsWith("/market")) {
                                const stateNode = getStateNode();
                                const prices = Array.prototype.reduce.call(
                                    document.querySelectorAll("[class*='packsWrapper'] > div"),
                                    (a, b) => {
                                        b.querySelector("[class*='blookContainer'] > img") || (a[b.querySelector("[class*='packImgContainer'] > img").alt] = parseInt(b.querySelector("[class*='packBottom']").textContent));
                                        return a;
                                    }, {}
                                );
                                box = box
                                    .split(" ")
                                    .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
                                    .join(" ");
                                const cost = prices[box];
                                if (!cost) return alert("I couldn't find that box!");

                                const canOpen = Math.floor(stateNode.state.tokens / cost);
                                if (canOpen <= 0) return alert("You do not have enough tokens!");
                                const amount = Math.min(canOpen, amountToOpen || 0);

                                const blooks = {},
                                    now = Date.now();

                                for (let i = 0; i < amount; i++) {
                                    await stateNode.buyPack(true, box);

                                    blooks[stateNode.state.unlockedBlook] ||= 0;
                                    blooks[stateNode.state.unlockedBlook]++;

                                    stateNode.startOpening();
                                    clearTimeout(stateNode.openTimeout);
                                    const rarity = stateNode.state.purchasedBlookRarity;

                                    stateNode.setState({
                                        canOpen: true,
                                        currentPack: "",
                                        opening: alertBlooks,
                                        doneOpening: alertBlooks,
                                        openPack: alertBlooks
                                    });
                                    clearTimeout(stateNode.canOpenTimeout);
                                    if (rarity == "Chroma") break;
                                }
                                await new Promise((r) => setTimeout(r));
                                alert(
                                    `(${Date.now() - now}ms) Results:\n${Object.entries(blooks)
                                        .map(([blook, amount]) => `    ${blook} ${amount}`)
                                        .join(`\n`)}`
                                );
                            } else alert("This can only be ran in the Market page.");
                        },
                    },
                    {

                        name: "Bypass Filter",
                        description: "Bypasses the name filter",
                        inputs: [{
                            name: "Text",
                            type: "text",
                        }],
                        run: function(e) {
                            var t,
                                a,
                                o;
                            let r;
                            a = function e(t) {
                                    for (var a = t.split(""), o = "", r = 0; r < a.length; r++)
                                        o += "\xad" + a[r];
                                    return o
                                }
                                (t = e),
                                r = document.createElement("iframe"),
                                document.body.appendChild(r),
                                window.alert = r.contentWindow.alert.bind(r.contentWindow),
                                (o = document.createElement("textarea")).value = a,
                                o.style.position = "fixed",
                                o.style.top = 0,
                                o.style.left = 0,
                                o.style.opacity = 0,
                                document.body.appendChild(o),
                                o.select(),
                                document.execCommand("copy"),
                                alert("Bypassed text copied to clipboard!"),
                                r.remove(),
                                document.body.removeChild(o)
                        }
                    }, {
                        name: "Use any Banner",
                        description: "Unlocked all banners",
                        inputs: [{
                            name: "Banner",
                            type: "options",
                            options: Object.entries({
                                Starter: "starter",
                                Fire: "fire",
                                "Tech Chip": "techChip",
                                Shamrocks: "shamrocks",
                                "Orange Ice Pop": "orangeIcePop",
                                Slime: "slime",
                                Sushi: "sushi",
                                "Falling Blocks": "fallingBlocks",
                                Racetrack: "racetrack",
                                "Football Field": "footballField",
                                "Ice Cream Sandwich": "iceCreamSandwich",
                                "Winter Landscape": "winterLandscape",
                                Leaves: "leaves",
                                "Music Class": "musicClass",
                                "Science Class": "scienceClass",
                                "Art Class": "artClass",
                                Clockwork: "clockwork",
                                "Hockey Rink": "hockeyRink",
                                "Outer Space": "outerSpace",
                                "Soccer Field": "soccerField",
                                Ice: "ice",
                                "Toaster Pastry": "toasterPastry",
                                "Fish Tank": "fishTank",
                                Theater: "theater",
                                Farm: "farm",
                                Spooky: "spooky",
                                "Spooky Cat": "spookyCat",
                                "Spooky Window": "spookyWindow",
                                Frankenstein: "frankenstein",
                                Ghosts: "ghosts",
                                Mummy: "mummy",
                                Spiders: "spiders",
                                Coffin: "coffin",
                                Pumpkins: "pumpkins",
                                "Christmas Tree": "christmasTree",
                                Chalkboard: "chalkboard",
                                Balloons: "balloons",
                                Skateboard: "skateboard",
                                Sunset: "sunset",
                                Tiger: "tiger",
                                "Pirate Map": "pirateMap",
                                Pencil: "pencil",
                                "Road Sign": "roadSign",
                                "Corn Dog": "cornDog",
                                Leaf: "leaf",
                                "Chili Pepper": "chiliPepper",
                                "Love Letter": "loveLetter",
                                Gifts: "gifts",
                                "Winter Train": "winterTrain",
                                "Winter Drive": "winterDrive",
                                Workbench: "workbench",
                                Harvest: "harvest",
                                Chocolate: "chocolate",
                                "Fall Picnic": "fallPicnic",
                                Bookshelf: "bookshelf",
                                "Easter Pattern": "easterPattern",
                                Carrot: "carrot",
                                "Easter Field": "easterField",
                                Garden: "garden",
                                Bakery: "bakery",
                                "Gummy Worm": "gummyWorm",
                                "Basketball Court": "basketballCourt",
                                "Flying Kite": "flyingKite",
                                "Hot Dog": "hotDog",
                                "Japanese Garden": "japaneseGarden",
                                Sandwich: "sandwich",
                                Ruler: "ruler",
                                "Ball Pit": "ballPit",
                                "Xylophone": "xylophone",
                                "Holiday Lights": "holidayLights",
                                "Ice Cream Truck": "iceCreamTruck",
                                "Holiday Gift Wrap": "holidayGiftWrap",
                                "Winter Sweater": "winterSweater",
                                "Holiday Ornaments": "holidayOrnaments",
                                Watermelon: "watermelon",
                                Baguette: "baguette",
                                Rollerblades: "rollerblades",
                                Surfboard: "surfboard",
                                Cookout: "cookout",
                                Comic: "comic",
                                Crayon: "crayon",
                                Lightning: "lightning",
                                Baseball: "baseball",
                                "Shamrock Coins": "shamrockCoins",
                                "End Of The Rainbow": "endRainbow",
                                "Easter Field": "easterField",
                                Marker: "marker",
                                Pizza: "pizza",
                                Leaf: "leaf",
                                "Alphabet Soup": "alphabetSoup"
                            }).map(([e, t]) => ({
                                name: e,
                                value: t
                            }))
                        }],
                        run: function(e) {
                            var t = document.createElement("iframe");

                            function a() {
                                return Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner
                            }
                            document.head.appendChild(t),
                                window.alert = t.contentWindow.alert.bind(window),
                                window.prompt = t.contentWindow.prompt.bind(window),
                                t.remove(),
                                a().stateNode.props.liveGameController.setVal({
                                    path: "c/" + a().stateNode.props.client.name + "/bg",
                                    val: e
                                })
                        }
                    }, {
                        name: "Change Blook Ingame",
                        description: "Changes your blook",
                        inputs: [{
                            name: "Blook (case sensitive)",
                            type: "string",
                        }, ],
                        run: function(blook) {
                            let {
                                props
                            } = getStateNode();
                            props.liveGameController.setVal({
                                path: `c/${props.client.name}/b`,
                                val: (props.client.blook = blook)
                            });
                        },
                    },
                    {



                        name: "Free Player Slots",
                        description: "Allows more players to join if the game is full",
                        run: async () => {
                            let i = document.createElement('iframe');
                            document.body.append(i);
                            const alert = i.contentWindow.alert.bind(window);
                            i.remove();
                            const stateNode = Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
                            const players = await stateNode.props.liveGameController.getDatabaseVal("c");
                            let freed = 0;
                            if (!stateNode.state.blockedUsers) {
                                stateNode.state.blockedUsers = [];
                            }
                            async function wait(time) {
                                return new Promise(e => {
                                    setTimeout(e, time);
                                });
                            }
                            async function blockUser(name) {
                                if (stateNode.state.blockedUsers.includes(name)) {
                                    return;
                                }
                                const res = await fetch("https://fb.blooket.com/c/firebase/block", {
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    method: "POST",
                                    body: JSON.stringify({
                                        g: stateNode.props.host.id,
                                        u: name
                                    }),
                                    credentials: "include"
                                });
                                if (res.status !== 200) {
                                    return;
                                }
                                stateNode.state.blockedUsers.push(name);
                                freed++;
                                if (freed % parseInt("15") == 0) {
                                    await wait(600);
                                }
                                C.alerts?.[0].addLog("Freed user: " + name);
                            }
                            for (let i in players) {
                                await blockUser(i);
                            }
                            alert(`Freed slots: ${freed}`);
                        }
                    }, {

                        name: "Get Daily Rewards",
                        description: "Gets max daily tokens and xp",
                        run: async function() {
                            if (!window.location.href.includes("play.blooket.com")) alert("This cheat only works on play.blooket.com, opening a new tab."), window.open("https://play.blooket.com/");
                            else {
                                const gameId = [
                                    "60101da869e8c70013913b59",
                                    "625db660c6842334835cb4c6",
                                    "60268f8861bd520016eae038",
                                    "611e6c804abdf900668699e3",
                                    "60ba5ff6077eb600221b7145",
                                    "642467af9b704783215c1f1b",
                                    "605bd360e35779001bf57c5e",
                                    "6234cc7add097ff1c9cff3bd",
                                    "600b1491d42a140004d5215a",
                                    "5db75fa3f1fa190017b61c0c",
                                    "5fac96fe2ca0da00042b018f",
                                    "600b14d8d42a140004d52165",
                                    "5f88953cdb209e00046522c7",
                                    "600b153ad42a140004d52172",
                                    "5fe260e72a505b00040e2a11",
                                    "5fe3d085a529560004cd3076",
                                    "5f5fc017aee59500041a1456",
                                    "608b0a5863c4f2001eed43f4",
                                    "5fad491512c8620004918ace",
                                    "5fc91a9b4ea2e200046bd49a",
                                    "5c5d06a7deebc70017245da7",
                                    "5ff767051b68750004a6fd21",
                                    "5fdcacc85d465a0004b021b9",
                                    "5fb7eea20bd44300045ba495",
                                ][Math.floor(Math.random() * 24)];
                                const rand = (l, h) => Math.floor(Math.random() * (h - l + 1)) + l;
                                const {
                                    t
                                } = await fetch("https://play.blooket.com/api/playersessions/solo", {
                                        body: JSON.stringify({
                                            gameMode: "Factory",
                                            questionSetId: gameId
                                        }),
                                        method: "POST",
                                        credentials: "include",
                                    })
                                    .then((x) => x.json())
                                    .catch(() => alert("There was an error creating a solo game."));
                                await fetch("https://play.blooket.com/api/playersessions/landings", {
                                    body: JSON.stringify({
                                        t
                                    }),
                                    method: "POST",
                                    credentials: "include",
                                }).catch(() => alert("There was an error when landing."));
                                await fetch("https://play.blooket.com/api/playersessions/questions?t=" + t, {
                                    credentials: "include"
                                });
                                await fetch("https://play.blooket.com/api/gamequestionsets?gameId=" + gameId, {
                                    credentials: "include"
                                });
                                await fetch("https://play.blooket.com/api/users/factorystats", {
                                    body: JSON.stringify({
                                        t,
                                        place: 1,
                                        cash: rand(10000000, 100000000),
                                        playersDefeated: 0,
                                        correctAnswers: rand(500, 2000),
                                        upgrades: rand(250, 750),
                                        blookUsed: "Chick",
                                        nameUsed: "You",
                                        mode: "Time-Solo"
                                    }),
                                    method: "PUT",
                                    credentials: "include",
                                }).catch(() => alert("There was an error when spoofing stats."));
                                await fetch("https://play.blooket.com/api/users/add-rewards", {
                                        body: JSON.stringify({
                                            t,
                                            addedTokens: 500,
                                            addedXp: 300
                                        }),
                                        method: "PUT",
                                        credentials: "include",
                                    })
                                    .then((x) => x.json())
                                    .then(({
                                        dailyReward
                                    }) => alert(`Added max tokens and xp, and got ${dailyReward} daily wheel tokens!`))
                                    .catch(() => alert("There was an error when adding rewards."));
                            }
                        },
                    },
                    {
                        name: "Blooket Bot",
                        description: "Opens Blooket Bot",
                        run: function() {
                            function getGameCode() {
                                const appDiv = document.querySelector('#app>div>div');
                                if (appDiv) {
                                    const reactComponent = Object.values(appDiv)[1]?.children[0]?._owner;
                                    return reactComponent?.stateNode?.props?.client?.hostId || null;
                                }
                                return null;
                            }

                            const gameCode = getGameCode();
                            const url = gameCode ? "https://blooketbot.schoolcheats.net/" + gameCode : "https://blooketbot.schoolcheats.net/";
                            window.open(url, "_blank", "width=500,height=500,resizable=yes,scrollbars=yes,status=yes");
                        }
                    }, {
                        name: "Blooket Stream Finder",
                        description: "Opens Stream Finder",
                        run: function() {
                            function getGameCode() {
                                const appDiv = document.querySelector('#app>div>div');
                                if (appDiv) {
                                    const reactComponent = Object.values(appDiv)[1]?.children[0]?._owner;
                                    return reactComponent?.stateNode?.props?.client?.hostId || null;
                                }
                                return null;
                            }

                            const gameCode = getGameCode();
                            const url = gameCode ? "https://0alter0.github.io/blooketstreamfinderV2/" + gameCode : "https://0alter0.github.io/blooketstreamfinderV2/";
                            window.open(url, "_blank", "width=500,height=500,resizable=yes,scrollbars=yes,status=yes");
                        }
                    }, {
                        name: "Open Chat (Global)",
                        description: "Opens The X-GUI Chat, Not Ingame",
                        run: function() {
                            window.open(
                                "https://hack.chat/?xgui",
                                "_blank",
                                "width=500,height=500,resizable=yes,scrollbars=yes,status=yes"
                            );
                        }

                    }, {



                        name: "Open Chat (Ingame)",
                        description: "Opens X-GUI Ingame Chat",
                        run: function() {

                            (function() {
                                function getGameCode() {
                                    const appDiv = document.querySelector('#app>div>div');
                                    if (appDiv) {
                                        const reactComponent = Object.values(appDiv)[1]?.children[0]?._owner;
                                        return reactComponent?.stateNode?.props?.client?.hostId || null;
                                    }
                                    return null;
                                }

                                function getGameCodeFromURL() {
                                    const parts = window.location.pathname.split('/').filter(Boolean);
                                    return parts.length >= 3 ? parts[0] : null;
                                }

                                let gameCode = getGameCode();

                                if (!gameCode) {
                                    gameCode = getGameCodeFromURL();
                                }

                                const url = gameCode ?
                                    "https://hack.chat/?xgui" + gameCode :
                                    "https://hack.chat/?xgui";

                                window.open(
                                    url,
                                    "_blank",
                                    "width=500,height=500,resizable=yes,scrollbars=yes,status=yes"
                                );
                            })();
                        }
                    }, {
                        name: "Crash Game (Gold Quest, Crypto, Frenzy)",
                        description: "Crashes the host's game",
                        run: function() {
                            var e = Object.values(function e(t = document.querySelector("#app")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                                }
                                ())[1].children[0]._owner.stateNode;
                            e.props.liveGameController.setVal({
                                path: `c/${e.props.client.name}/b/toString`,
                                val: "Crashed"
                            })
                        }
                    },{
                        name: "Universal Game Crasher",
                        description: "Crashes the host's game. Works only on Enter Nickname menu or if you have the extension. And if your in Gold Quest, Crypto, Frenzy then it will crash when the game starts.",
                        run: async function() {
        'use strict';
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        async function crashGame() {
            await wait(500);

            const nameInput = document.querySelector('.Form_longInput__Kyk9e');
            const submitButton = document.querySelector('.FormSubmitButton_submitButton__MK2LJ');

            if (nameInput && submitButton) {
                await wait(200);
                nameInput.value = "toString";
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                await wait(100);
                submitButton.click();
            }
        }

        const onPlayPage = window.location.href.includes('play.blooket.com/play');

        if (onPlayPage) {
            await crashGame();
        } else {
            await wait(500);
            const nameInput = document.querySelector('.Form_longInput__Kyk9e');
            const submitButton = document.querySelector('.FormSubmitButton_submitButton__MK2LJ');

            if (!nameInput || !submitButton) {
                window.postMessage({ type: "FROM_PAGE_CRASH_GAME" }, "*");
            } else {
                await crashGame();
            }
        }
    }
},

 {




                        name: "Use Any Blook",
                        description: "Allows you to play as any blook",
                        run: function() {
                            const lobby = window.location.pathname.startsWith("/play/lobby"),
                                dashboard = !lobby && window.location.pathname.startsWith("/blooks");
                            if (dashboard) {
                                let key = "konzpack",
                                    propCall = Object.prototype.hasOwnProperty.call;
                                let webpack = webpackChunk_N_E.push([
                                    [key],
                                    {
                                        [key]: () => {}
                                    },
                                    function(func) {
                                        Object.prototype.hasOwnProperty.call = function() {
                                            Object.defineProperty(arguments[0], key, {
                                                set: () => {},
                                                configurable: true
                                            });
                                            return (Object.prototype.hasOwnProperty.call = propCall).apply(this, arguments);
                                        };
                                        return func;
                                    },
                                ]);
                                const blookData = webpack(4927).nK;
                                const blooksHook = Object.values(document.querySelector("[class*=BlooksWrapper_content]"))[0].return.memoizedState.next;
                                const showBlooks = blooksHook.memoizedState;
                                const seen = {},
                                    userBlooks = [],
                                    prices = {
                                        Uncommon: 5,
                                        Rare: 20,
                                        Epic: 75,
                                        Legendary: 200,
                                        Chroma: 300,
                                        Unique: 350,
                                        Mystical: 1000,
                                    };
                                for (const data of blooksHook.next.memoizedState) {
                                    userBlooks.push(data);
                                    seen[data.blook] = true;
                                }
                                for (const blook in blookData) {
                                    if (blookData[blook].rarity != "Common" && !seen[blook])
                                        userBlooks.push({
                                            blook,
                                            quantity: 1,
                                            sellPrice: prices[blookData[blook].rarity],
                                        });
                                }
                                blooksHook.next.queue.dispatch(userBlooks);
                                blooksHook.queue.dispatch(!showBlooks);
                                setTimeout(() => blooksHook.queue.dispatch(showBlooks), 1);
                            } else if (lobby) getStateNode().setState({
                                unlocks: {
                                    includes: () => !0
                                }
                            });
                            else alert("This only works in lobbies or the dashboard blooks page.");

                        },
                    },
                    {
                        name: "Every Answer Correct",
                        description: "Sets every answer to be correct",
                        run: function() {
                            const stateNode = getStateNode();
                            for (let i = 0; i < stateNode.freeQuestions.length; i++) {
                                stateNode.freeQuestions[i].correctAnswers = stateNode.freeQuestions[i].answers;
                                stateNode.questions[i].correctAnswers = stateNode.questions[i].answers;
                                stateNode.props.client.questions[i].correctAnswers = stateNode.questions[i].answers;
                            }
                            try {
                                stateNode.forceUpdate();
                            } catch {}
                        },
                    },
                    {
                        name: "Remove all Taken Blooks",
                        description: "Removes all taken blooks, allowing you to use any taken blook. Only works in lobby.",
                        run: function() {
                            const stateNode = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner.stateNode;
                            stateNode.setState({
                                takenBlooks: {
                                    includes: e => !1
                                }
                            });
                            stateNode.setState = function(a, b) {
                                if (a?.takenBlooks) {
                                    return;
                                }
                                stateNode.updater.enqueueSetState(stateNode, a, b, "setState");
                            }
                        }
                    }, {


                        name: "Kick All Players HOST ONLY",
                        description: "Kicks all players from your game.",
                        run: function() {
                            (async function() {
                                const app = document.querySelector('#app>div>div');
                                if (!app) return;

                                const sn = Object.values(app)[1]?.children?.[0]?._owner?.stateNode;
                                if (!sn || !sn.props?.liveGameController) return;

                                const controller = sn.props.liveGameController;

                                const db = await controller.getDatabaseVal("");
                                if (!db || !db.c) return;

                                // Mark all players as kicked
                                controller.setVal({
                                    path: "bu",
                                    val: Object.keys(db.c).reduce(
                                        (acc, id) => (acc[id] = 1, acc),
                                        db.bu ? db.bu : {}
                                    )
                                });

                                // Clear player list
                                controller.setVal({
                                    path: "c",
                                    val: {}
                                });
                            })();
                        }
                    }, {


                        name: "Enable Mobile Hosting",
                        description: "Makes it so that you can host on mobile",
                        run: function() {
                            (function() {
                                var metaViewport = document.querySelector('meta[name="viewport"]');
                                if (metaViewport) {
                                    metaViewport.parentNode.removeChild(metaViewport);
                                }
                                var newMetaViewport = document.createElement('meta');
                                newMetaViewport.name = 'viewport';
                                newMetaViewport.content = 'width=1280, initial-scale=1';
                                document.head.appendChild(newMetaViewport);
                            })();
                        }
                    }, {

                        name: "Remove Host Time Limit",
                        description: "Removes the host time limit",
                        run: function() {
                            (() => {
                                const sn = Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
                                sn.onAmountUpdate = function(t) {
                                    let settings = sn.state.settings;
                                    settings.amount = parseInt(t.target.value);
                                    sn.setState({
                                        settings
                                    });
                                }
                            })();
                        }
                    }, {

                        name: "Freeze Timer",
                        description: "Makes the host timer stop ingame",
                        run: function() {
                            (() => {
                                const {
                                    stateNode
                                } = Object.values(document.querySelector("#app>div>div"))[1].children[0]._owner;
                                clearInterval(stateNode.timerInterval);
                                stateNode.timerInterval = setInterval(function() {
                                    stateNode?.getClients?.(!1);
                                }, 4000);
                            })();
                        }
                    }, {

                        name: "Subtle Highlight Answers",
                        description: "Removes the shadow from correct answers",
                        run: function() {
                            const stateNode = getStateNode();
                            const Question = stateNode.state.question || stateNode.props.client.question;
                            let ind = 0;
                            while (ind < Question.answers.length) {
                                let j = 0;
                                let found = false;
                                while (j < Question.correctAnswers.length) {
                                    if (Question.answers[ind] == Question.correctAnswers[j]) {
                                        found = true;
                                        break;
                                    }
                                    j++;
                                }
                                ind++;
                                if (found) document.querySelector("[class*='answersHolder'] :nth-child(" + ind + ") > div").style.boxShadow = "unset";
                            }
                        },
                    },
                    {
                        name: "Remove Random Name",
                        description: "Allows you to put a custom name",
                        run: function() {
                            getStateNode().setState({
                                isRandom: false,
                                client: {
                                    name: ""
                                }
                            });
                            document.querySelector('[class*="nameInput"]')?.focus?.();
                        },
                    },
                    {
                        name: "Host Any Gamemode",
                        description: "Change the selected gamemode on the host settings page",
                        inputs: [{
                            name: "Gamemode",
                            type: "options",
                            options: ["Racing", "Classic", "Factory", "Cafe", "Defense2", "Defense", "Royale", "Gold", "Candy", "Brawl", "Hack", "Pirate", "Fish", "Dino", "Toy", "Rush"]
                        }],
                        run: function(e) {
                            let t = document.createElement("iframe");
                            if (document.body.append(t), window.alert = t.contentWindow.alert.bind(window), window.prompt = t.contentWindow.prompt.bind(window), t.remove(), "/host/settings" != location.pathname)
                                return alert("Run this script on the host settings page");
                            let {
                                stateNode: a
                            } = Object.values(function e(t = document.querySelector("body>div")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                                }
                                ())[1].children[0]._owner;
                            a.setState({
                                settings: {
                                    type: e
                                }
                            })
                        }
                    }, {
                        name: "Sell Duplicate Blooks",
                        description: "Sell all duplicate blooks leaving you with 1 each",
                        run: async function() {
                            if (!window.location.pathname.startsWith("/blooks")) {
                                alert("This can only be run on the Blooks page. Please go to https://dashboard.blooket.com/blooks");
                            } else {
                                if (confirm("Are you sure you want to sell your duplicates? This will sell everything except Legendary and above, leaving you with 1 of each blook.")) {
                                    
                                    async function sellBlook(blookName, quantity) {
                                        const formData = new FormData();
                                        formData.append('1_blook', blookName);
                                        formData.append('1_quantity', quantity.toString());
                                        formData.append('0', '[{"status":"UNSET","message":"","fieldErrors":{}},"$K1"]');
                                        try {
                                            const response = await fetch('https://dashboard.blooket.com/blooks', {
                                                method: 'POST',
                                                headers: {
                                                    'next-action': '504d5bfe3d4b01def79630a2138ec4f50f85bee9',
                                                    'accept': 'text/x-component',
                                                    'next-router-state-tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22(routes)%22%2C%7B%22children%22%3A%5B%22(dashboard)%22%2C%7B%22children%22%3A%5B%22blooks%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D'
                                                },
                                                body: formData
                                            });
                                            if (response.ok) {
                                                console.log(`Successfully sold ${quantity}x ${blookName}`);
                                            } else {
                                                console.error(`Failed to sell ${blookName}: ${response.status}`);
                                            }
                                        } catch (err) {
                                            console.error("Network error during sale:", err);
                                        }
                                    }
                                    
                                    window.blookslist = (() => {
                                        const anyEl = document.querySelector('*');
                                        const fiberKey = Object.keys(anyEl).find(k => k.startsWith('__reactFiber$'));
                                        let fiber = anyEl[fiberKey];
                                        while (fiber && fiber.return) {
                                            fiber = fiber.return;
                                        }
                                        const path = "child.child.child.child.child.child.child.child.child.child.sibling.child.child.child.child.child.child.child.child.sibling.child.child.sibling.child.child.child.child.sibling.child.sibling.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.sibling.child.sibling.sibling.sibling.sibling.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.sibling.child.child";
                                        let target = fiber;
                                        path.split('.').forEach(key => {
                                            target = target ? target[key] : null;
                                        });
                                        return target?.memoizedProps?.blooks;
                                    })();
                                    
                                    let key = "konzpack",
                                        propCall = Object.prototype.hasOwnProperty.call;
                                    let webpack = webpackChunk_N_E.push([
                                        [key],
                                        { [key]: () => {} },
                                        function (func) {
                                            Object.prototype.hasOwnProperty.call = function () {
                                                Object.defineProperty(arguments[0], key, { set: () => {}, configurable: true });
                                                return (Object.prototype.hasOwnProperty.call = propCall).apply(this, arguments);
                                            };
                                            return func;
                                        },
                                    ]);
                                    
                                    const blookData = webpack(4927).nK;
                                    const prices = {
                                        Uncommon: 5,
                                        Rare: 20,
                                        Epic: 75,
                                        Legendary: 200,
                                        Chroma: 300,
                                        Unique: 350,
                                        Mystical: 1000,
                                    };
                                    
                                    let sellAmt = 0;
                                    let sellBlookAmt = 0;
                                    
                                    for (let blook of blookslist) {
                                        console.log(blook);
                                        let rarity = blookData[blook.blook].rarity;
                                        console.log(rarity);
                                        if (blook.quantity > 1 && ["Uncommon","Rare","Epic"].includes(rarity)){
                                            await sellBlook(blook.blook, blook.quantity - 1);
                                            sellBlookAmt += blook.quantity - 1;
                                            sellAmt += prices[rarity] * (blook.quantity - 1);
                                        }
                                    }
                                    
                                    alert("Sold " + sellBlookAmt + " blooks for " + sellAmt + " Tokens.");
                                }
                            }
                        }
                    }
                ],
            },
            extras: {
                img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gZmlsbD0iI2ZkZDAyOSIgcG9pbnRzPSIxMjAsMTggMTUxLDk0IDI0MCw5NCAxNjgsMTQ4IDE5NSwyMzAgMTIwLDE4MyA0NSwyMzAgNzIsMTQ4IDAsOTQgODksOTQiLz48L3N2Zz4=",

                name: "Extras",
                cheats: [{

                       name: "EXECUTOR",
                       description: "Opens an advanced, sleek, GUI with countless features, made by @landsedge",
                       run: function() {

    try {
        if (typeof window.ExecutorUserScriptVersion === "function") {
            console.log("Executor Userscript detected — running the built-in version.");
            ExecutorUserScriptVersion();
        } else {
            new Function("var testCSP='CSP check'")();

            var s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/gh/CidCaribou/Executor-Menu@main/menu.js';
            s.onload = function(){ s.remove(); };
            s.onerror = function(){
                alert('Error loading the script.\n\nTry:\n1. Visiting a different site (some block scripts)\n2. Reinstall the bookmarklet\n3. Contact the owner.');
                console.error('Script load error via <script src>');
            };
            document.body.appendChild(s);
        }
    } catch(e) {
        if (e.message.includes('Content Security Policy')) {
            var i = document.querySelector('iframe');
            var m = 'Script blocked by Content Security Policy.\n\nTry:\n1. Visit a different site\n2. Use the Spoofer\n3. Contact the owner.';
            i ? i.contentWindow.alert(m) : alert(m);
        } else {
            alert('Script execution failed.\n\nTry:\n1. Visit a different site\n2. Reinstall the bookmarklet\n3. Contact the owner.');
            console.error('Execution error:', e);
        }
    }
                        },
                    },
                    {


                        name: "Toggle Invert Colors",
                        description: "Toggle between inverting and restoring colors on the page",
                        run: function() {
                            const html = document.documentElement;
                            html.style.filter = html.style.filter === "invert(1)" ? "" : "invert(1)";
                            const elems = document.querySelectorAll("a, img, video");
                            for (let i = 0; i < elems.length; i++) {
                                const el = elems[i];
                                if ((el.nodeName === "A" && (el.style.background !== "" || el.style.backgroundImage !== "")) || el.nodeName !== "A") {
                                    el.style.filter = el.style.filter === "invert(1)" ? "" : "invert(1)";
                                }
                            }
                        },
                    },
                    {
                        name: "Toggle Dark Mode",
                        description: "Toggles Dark Mode",
                        run: function() {
                            var e = document.createElement("iframe");
                            document.body.append(e),
                                window.alert = e.contentWindow.alert.bind(window),
                                e.remove(),
                                ! function e() {
                                    let t = document.querySelectorAll("#nightify");
                                    if (t.length)
                                        t[0].parentNode.removeChild(t[0]);
                                    else {
                                        var a = document.getElementsByTagName("head")[0],
                                            o = document.createElement("style");
                                        o.setAttribute("type", "text/css"),
                                            o.setAttribute("id", "nightify"),
                                            o.appendChild(document.createTextNode(`html{-webkit-filter:invert(100%) hue-rotate(180deg) contrast(70%) !important; background: #222;} .line-content {background-color: #333;} html img{-webkit-filter:invert(100%) hue-rotate(0deg) contrast(100%) !important;}`)),
                                            a.appendChild(o)
                                    }
                                }
                                ()
                        }
                    }, {
                        name: "3D Page",
                        description: "Makes the page 3D",
                        run: function() {
                            var e = {
                                menu: document.createElement("div"),
                                limit: document.createElement("input"),
                                gap: document.createElement("input"),
                                sag: document.createElement("input"),
                                fov: document.createElement("input"),
                                flo: document.createElement("input"),
                                off: document.createElement("input"),
                                non: document.createElement("input"),
                                end: document.createElement("input"),
                                tgl: document.createElement("input"),
                                cssStatic: document.createElement("style"),
                                cssDynamic: document.createElement("style"),
                                orientation: {
                                    yaw: 0,
                                    pitch: 0,
                                    roll: 0
                                },
                                mouseMove: function(t) {
                                    e.orientation.yaw = -(180 * Math.cos(Math.PI * t.clientX / innerWidth)) * e.limit.value,
                                        e.orientation.pitch = 180 * Math.cos(Math.PI * t.clientY / innerHeight) * e.limit.value,
                                        e.updateBody()
                                },
                                gyroMove: function(t) {
                                    innerWidth > innerHeight ? (e.orientation.yaw = -(t.alpha + t.beta), e.orientation.pitch = t.gamma - 90 * Math.sign(90 - Math.abs(t.beta))) : (e.orientation.yaw = -(t.alpha + t.gamma), e.orientation.pitch = t.beta - 90),
                                        e.updateBody()
                                },
                                updateOrigin: function(e) {
                                    document.body.style.transformOrigin = innerWidth / 2 + pageXOffset + "px " + (innerHeight / 2 + pageYOffset) + "px"
                                },
                                updateBody: function() {
                                    document.body.style.transform = "perspective(" + Math.pow(2, e.fov.value) + "px) translateZ(-" + e.gap.value + "px) rotateX(" + e.orientation.pitch + "deg) rotateY(" + e.orientation.yaw + "deg)"
                                },
                                updateCSS: function() {
                                    if (e.non.checked)
                                        e.cssDynamic.innerHTML = "";
                                    else if (e.off.checked)
                                        e.cssDynamic.innerHTML = "* { transform-style: preserve-3d; }";
                                    else {
                                        for (var t = 0; document.querySelector("body" + " > *".repeat(t)); t++);
                                        var a = e.gap.value / t,
                                            o = -Math.PI * e.sag.value / t;
                                        e.cssDynamic.innerHTML = ` * { transform: translateZ(${a}px) rotateX(${o}rad); transform-style: preserve-3d; transition: transform 1s; outline: 1px solid rgba(0, 0, 0, 0.0625); ${e.flo.checked ? "overflow: visible !important;" : ""} } *:hover { transform: translateZ(${2 * a}px) rotateX(${2 * o}rad); ${e.flo.checked ? "" : "overflow: visible;"} } `
                                    }
                                },
                                toggle: function() {
                                    "active" == e.menu.className ? e.menu.removeAttribute("class") : e.menu.className = "active"
                                },
                                quit: function() {
                                    window.removeEventListener("deviceorientation", e.gyroMove),
                                        window.removeEventListener("mousemove", e.mouseMove),
                                        window.removeEventListener("scroll", e.updateOrigin),
                                        window.addEventListener("resize", e.updateOrigin),
                                        e.menu.remove(),
                                        e.cssStatic.remove(),
                                        e.cssDynamic.remove(),
                                        document.body.removeAttribute("style")
                                },
                                newRange: function(t, a, o, r, i, n, s) {
                                    e.menu.appendChild(t),
                                        t.type = "range",
                                        t.min = o,
                                        t.max = i,
                                        t.step = r,
                                        t.value = n,
                                        t.addEventListener("input", s),
                                        e.menu.appendChild(document.createElement("span")).innerHTML = a,
                                        e.menu.appendChild(document.createElement("br"))
                                },
                                newCheckbox: function(t, a, o) {
                                    e.menu.appendChild(t),
                                        t.type = "checkbox",
                                        t.addEventListener("click", o),
                                        e.menu.appendChild(document.createElement("span")).innerHTML = a,
                                        e.menu.appendChild(document.createElement("br"))
                                },
                                newButton: function(t, a, o) {
                                    e.menu.appendChild(t),
                                        t.type = "button",
                                        t.value = a,
                                        t.addEventListener("click", o)
                                },
                                init: function() {
                                    document.body.parentNode.appendChild(e.menu).id = "tri-menu",
                                        e.newRange(e.limit, "limit", 0, .03125, 1, .125, e.updateBody),
                                        e.newRange(e.gap, "gap / distance", 0, 32, 512, 128, function() {
                                            e.updateCSS(),
                                                e.updateBody()
                                        }),
                                        e.newRange(e.sag, "sag", -.25, .03125, .25, 0, e.updateCSS),
                                        e.newRange(e.fov, "field of view", 7, 1, 13, 10, e.updateBody),
                                        e.newCheckbox(e.flo, "force overflow", e.updateCSS),
                                        e.flo.setAttribute("checked", ""),
                                        e.newCheckbox(e.off, "flatten layers", e.updateCSS),
                                        e.newCheckbox(e.non, "flatten everything", e.updateCSS),
                                        e.newButton(e.end, "Quit", e.quit),
                                        e.newButton(e.tgl, "≡", e.toggle),
                                        e.tgl.id = "tri-toggle",
                                        e.menu.appendChild(e.cssStatic).innerHTML = " html, body { transition-property: none; height: 100%25; width: 100%25; } html, html:hover, #tri-menu, #tri-menu > *, #tri-menu > *:hover { transform: none; outline: none; overflow: auto !important; float: none; } #tri-menu { position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(255, 255, 255, 0.5);; border-radius: 0 0 16px 0; padding: 8px; transform: translate(-100%25, -100%25) translate(32px, 32px); } #tri-menu.active { transform: none; } #tri-toggle { position: absolute; bottom: 0; right: 0; height: 32px; width: 32px; background: transparent; color: white; border: none; cursor: pointer; } #tri-menu.active > #tri-toggle { background: white; color: black; border-radius: 8px 0 0 0; }",
                                        e.menu.appendChild(e.cssDynamic),
                                        e.updateCSS(),
                                        window.addEventListener("deviceorientation", e.gyroMove),
                                        window.addEventListener("mousemove", e.mouseMove),
                                        window.addEventListener("scroll", e.updateOrigin),
                                        window.addEventListener("resize", e.updateOrigin),
                                        window.scrollBy(0, 1)
                                }
                            };
                            e.init()
                        }
                    }, {

                        name: "Auto Clicker",
                        description: "Automatically clicks for you. Press S to toggle.",
                        inputs: [{
                            name: "Click Delay",
                            type: "number"
                        }],
                        run: function(inputs) {
                            clicker: {
                                "use strict";

                                let clickInterval = null;
                                let clickingEnabled = true;

                                const {
                                    Number,
                                    self
                                } = window;
                                const milliseconds = Number.parseInt(inputs, 10);

                                if (false === Number.isSafeInteger(milliseconds)) {
                                    self.alert("Input was not an integer");
                                    break clicker;
                                }

                                let clientX = 0,
                                    clientY = 0;
                                const {
                                    document
                                } = self;

                                function startClicking() {
                                    clickInterval = self.setInterval(() => {
                                        document.elementFromPoint(clientX, clientY)?.click?.();
                                    }, milliseconds);
                                }

                                function stopClicking() {
                                    self.clearInterval(clickInterval);
                                    clickInterval = null;
                                }

                                startClicking();

                                document.addEventListener("mousemove", event => {
                                    ({
                                        clientX,
                                        clientY
                                    } = event);
                                }, {
                                    passive: true
                                });

                                self.addEventListener("keydown", event => {
                                    if (event.key === "s") {
                                        if (clickingEnabled) {
                                            stopClicking();
                                        } else {
                                            startClicking();
                                        }
                                        clickingEnabled = !clickingEnabled;
                                    }
                                });
                            }
                        }
                    }, {
                        name: "Tab Cloaker",
                        description: "Changes the tab image and name",
                        inputs: [{
                            name: "Icon URL",
                            type: "text",
                        }, {
                            name: "Tab Title",
                            type: "text",
                        }],
                        run: function(e, t) {
                            var a = document.querySelector("link[rel*='icon']") || document.createElement("link");
                            a.type = "image/x-icon",
                                a.rel = "shortcut icon",
                                a.href = e || "https://www.blooket.com/favicon.ico",
                                document.getElementsByTagName("head")[0].appendChild(a),
                                document.title = t || "Blooket"
                        }
                    }, {



                        /* ========== COLOR & FILTER MODES ========== */


                        name: "Grayscale Mode",
                        description: "Turns the page grayscale",
                        run: function() {
                            const html = document.documentElement;
                            html.style.filter =
                                html.style.filter === "grayscale(1)" ? "" : "grayscale(1)";
                        }
                    },

                    {
                        name: "Sepia Mode",
                        description: "Applies a sepia filter",
                        run: function() {
                            const html = document.documentElement;
                            html.style.filter =
                                html.style.filter === "sepia(1)" ? "" : "sepia(1)";
                        }
                    },

                    {
                        name: "High Contrast",
                        description: "Boosts contrast for readability",
                        run: function() {
                            const html = document.documentElement;
                            html.style.filter =
                                html.style.filter === "contrast(1.5)" ? "" : "contrast(1.5)";
                        }
                    },

                    {
                        name: "Soft Blur",
                        description: "Applies subtle blur",
                        run: function() {
                            const html = document.documentElement;
                            html.style.filter =
                                html.style.filter.includes("blur") ? "" : "blur(3px)";
                        }
                    },

                    {
                        name: "Pastel Theme",
                        description: "Soft pastel color palette",
                        run: function() {
                            if (document.getElementById("pastel-ui")) {
                                document.getElementById("pastel-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "pastel-ui";
                            style.innerHTML = `* { filter: saturate(0.8) brightness(1.05); }`;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Rainbow Hue Cycle",
                        description: "Smooth color cycling",
                        run: function() {
                            if (window._rainbow) {
                                clearInterval(window._rainbow);
                                window._rainbow = null;
                                document.documentElement.style.filter = "";
                                return;
                            }
                            let i = 0;
                            window._rainbow = setInterval(() => {
                                document.documentElement.style.filter = `hue-rotate(${i++}deg)`;
                                if (i > 360) i = 0;
                            }, 40);
                        }
                    },

                    /* ========== UI MODS ========== */

                    {
                        name: "Rounded UI",
                        description: "Extra rounded corners",
                        run: function() {
                            if (document.getElementById("rounded-ui")) {
                                document.getElementById("rounded-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "rounded-ui";
                            style.innerHTML = `* { border-radius: 16px !important; }`;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Outline UI",
                        description: "Outlines UI elements",
                        run: function() {
                            if (document.getElementById("outline-ui")) {
                                document.getElementById("outline-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "outline-ui";
                            style.innerHTML = `* { outline: 1px solid rgba(255,255,255,0.12); }`;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Flat UI",
                        description: "Removes shadows for a flat look",
                        run: function() {
                            if (document.getElementById("flat-ui")) {
                                document.getElementById("flat-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "flat-ui";
                            style.innerHTML = `* { box-shadow: none !important; text-shadow: none !important; }`;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Wobbly UI",
                        description: "UI gently wobbles",
                        run: function() {
                            if (document.getElementById("wobbly-ui")) {
                                document.getElementById("wobbly-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "wobbly-ui";
                            style.innerHTML = `
      * { animation: wobble 2s infinite alternate; }
      @keyframes wobble { 0% { transform: rotate(-1deg); } 100% { transform: rotate(1deg); } }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Floating UI",
                        description: "UI gently floats up and down",
                        run: function() {
                            if (document.getElementById("float-ui")) {
                                document.getElementById("float-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "float-ui";
                            style.innerHTML = `
      * { animation: floaty 3s ease-in-out infinite; }
      @keyframes floaty { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Tiny UI",
                        description: "Slightly shrinks UI",
                        run: function() {
                            const html = document.documentElement;
                            html.style.zoom = html.style.zoom === "0.9" ? "" : "0.9";
                        }
                    },

                    /* ========== FUN VISUALS ========== */

                    {
                        name: "Mirror Page",
                        description: "Flips page horizontally",
                        run: function() {
                            const html = document.documentElement;
                            html.style.transform = html.style.transform === "scaleX(-1)" ? "" : "scaleX(-1)";
                        }
                    },

                    {



                        name: "Outline Elements (Black)",
                        description: "Toggles black outlines on all page elements",
                        run: function() {
                            if (document.getElementById("outline-elements-black")) {
                                document.getElementById("outline-elements-black").remove();
                                return;
                            }

                            const style = document.createElement("style");
                            style.id = "outline-elements-black";
                            style.innerHTML = `
      * {
        outline: 1px solid black !important;
        outline-offset: -1px !important;
      }
    `;
                            document.head.appendChild(style);
                        }
                    }, {


                        name: "Outline Elements (Red)",
                        description: "Toggles red outlines on all page elements",
                        run: function() {
                            if (document.getElementById("outline-elements-red")) {
                                document.getElementById("outline-elements-red").remove();
                                return;
                            }

                            const style = document.createElement("style");
                            style.id = "outline-elements-red";
                            style.innerHTML = `
      * {
        outline: 1px solid red !important;
        outline-offset: -1px !important;
      }
    `;
                            document.head.appendChild(style);
                        }
                    }, {



                        name: "Light Screen Shake",
                        description: "Subtle screen shake",
                        run: function() {
                            document.body.animate(
                                [{
                                    transform: "translate(0,0)"
                                }, {
                                    transform: "translate(-2px,1px)"
                                }, {
                                    transform: "translate(2px,-1px)"
                                }, {
                                    transform: "translate(0,0)"
                                }], {
                                    duration: 200
                                }
                            );
                        }
                    },

                    {
                        name: "Jello UI",
                        description: "UI elements wobble like jello",
                        run: function() {
                            if (document.getElementById("jello-ui")) {
                                document.getElementById("jello-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "jello-ui";
                            style.innerHTML = `
      * { animation: jello 1s infinite; }
      @keyframes jello {
        0%,100%{transform:scale3d(1,1,1);}
        25%{transform:scale3d(1.05,0.95,1);}
        50%{transform:scale3d(0.95,1.05,1);}
        75%{transform:scale3d(1.02,0.98,1);}
      }
    `;
                            document.head.appendChild(style);
                        }
                    },


                    {
                        name: "Rotate Page",
                        description: "Rotates the entire page slowly",
                        run: function() {
                            const html = document.documentElement;
                            html.style.transition = "transform 0.5s";
                            html.style.transform = html.style.transform === "rotate(180deg)" ? "" : "rotate(180deg)";
                        }
                    },

                    {
                        name: "Scale Up Page",
                        description: "Slightly zooms in page",
                        run: function() {
                            const html = document.documentElement;
                            html.style.transform = html.style.transform === "scale(1.1)" ? "" : "scale(1.1)";
                        }
                    },

                    {
                        name: "Spin Slowly",
                        description: "Page spins continuously",
                        run: function() {
                            if (window._spin) {
                                clearInterval(window._spin);
                                window._spin = null;
                                document.documentElement.style.transform = "";
                                return;
                            }
                            let deg = 0;
                            window._spin = setInterval(() => {
                                deg += 1;
                                document.documentElement.style.transform = `rotate(${deg}deg)`;
                            }, 50);
                        }
                    },

                    {
                        name: "Flip Vertically",
                        description: "Flips page upside down",
                        run: function() {
                            const html = document.documentElement;
                            html.style.transform = html.style.transform === "scaleY(-1)" ? "" : "scaleY(-1)";
                        }
                    },


                    {
                        name: "Shake UI",
                        description: "UI elements shake slightly",
                        run: function() {
                            if (document.getElementById("shake-ui")) {
                                document.getElementById("shake-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "shake-ui";
                            style.innerHTML = `
      * { animation: shake 0.2s infinite alternate; }
      @keyframes shake { 0%{transform:translate(0,0);} 50%{transform:translate(2px,-2px);} 100%{transform:translate(0,0);} }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Flip Horizontally Random",
                        description: "UI flips left and right repeatedly",
                        run: function() {
                            if (window._flipH) {
                                clearInterval(window._flipH);
                                window._flipH = null;
                                document.documentElement.style.transform = "";
                                return;
                            }
                            let flip = 1;
                            window._flipH = setInterval(() => {
                                document.documentElement.style.transform = `scaleX(${flip})`;
                                flip *= -1;
                            }, 500);
                        }
                    },

                    {
                        name: "Glow UI Pulse",
                        description: "UI elements glow and pulse gently",
                        run: function() {
                            if (document.getElementById("pulse-ui")) {
                                document.getElementById("pulse-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "pulse-ui";
                            style.innerHTML = `
      * { animation: pulse 2s infinite; }
      @keyframes pulse { 0%,100%{box-shadow:none;} 50%{box-shadow:0 0 10px rgba(0,255,255,0.5);} }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "UI Zoom Pulse",
                        description: "UI elements pulse bigger and smaller",
                        run: function() {
                            if (document.getElementById("zoom-pulse-ui")) {
                                document.getElementById("zoom-pulse-ui").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "zoom-pulse-ui";
                            style.innerHTML = `
      * { animation: zoomPulse 2s infinite; }
      @keyframes zoomPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {

                        name: "Flip Random UI",
                        description: "UI elements flip randomly THIS WILL BREAK GUI, YOU WILL NEED TO RELOAD!",
                        run: function() {
                            if (window._flipUI) {
                                clearInterval(window._flipUI);
                                window._flipUI = null;
                                document.querySelectorAll("*").forEach(el => el.style.transform = "");
                                return;
                            }
                            window._flipUI = setInterval(() => {
                                document.querySelectorAll("*").forEach(el => {
                                    if (Math.random() < 0.05) el.style.transform = `rotate(${Math.random()*360}deg)`;
                                });
                            }, 200);
                        }
                    },



                    {
                        name: "Tilted Page",
                        description: "Page tilts left and right slowly",
                        run: function() {
                            if (window._tiltPage) {
                                clearInterval(window._tiltPage);
                                window._tiltPage = null;
                                document.documentElement.style.transform = "";
                                return;
                            }
                            let deg = -3;
                            let dir = 1;
                            window._tiltPage = setInterval(() => {
                                document.documentElement.style.transform = `rotate(${deg}deg)`;
                                deg += dir;
                                if (deg > 3 || deg < -3) dir *= -1;
                            }, 50);
                        }
                    },




                    {
                        name: "Page Flip Slowly",
                        description: "Page rotates slowly 360 degrees",
                        run: function() {
                            if (window._pageFlip) {
                                clearInterval(window._pageFlip);
                                window._pageFlip = null;
                                document.documentElement.style.transform = "";
                                return;
                            }
                            let deg = 0;
                            window._pageFlip = setInterval(() => {
                                deg += 1;
                                document.documentElement.style.transform = `rotate(${deg}deg)`;
                                if (deg >= 360) deg = 0;
                            }, 50);
                        }
                    }, {

                        /* ========== CUSTOM CURSORS ========== */


                        /* ========== FUN CUSTOM CURSORS ========== */


                        name: "Cursor: Crosshair",
                        description: "Changes mouse cursor to crosshair",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "crosshair";
                        }
                    },
                    {
                        name: "Cursor: Pointer",
                        description: "Changes mouse cursor to pointer",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "pointer";
                        }
                    },
                    {
                        name: "Cursor: Grab",
                        description: "Changes mouse cursor to grab",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "grab";
                        }
                    },
                    {
                        name: "Cursor: Move",
                        description: "Changes mouse cursor to move",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "move";
                        }
                    },
                    {
                        name: "Cursor: Wait",
                        description: "Changes mouse cursor to wait",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "wait";
                        }
                    },
                    {
                        name: "Cursor: Help",
                        description: "Changes mouse cursor to help",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "help";
                        }
                    },
                    {
                        name: "Cursor: Text",
                        description: "Changes mouse cursor to text (I-beam)",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "text";
                        }
                    },
                    {
                        name: "Cursor: Progress",
                        description: "Changes mouse cursor to progress",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "progress";
                        }
                    },
                    {
                        name: "Cursor: Not-allowed",
                        description: "Changes mouse cursor to not-allowed",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "not-allowed";
                        }
                    },
                    {
                        name: "Cursor: Alias",
                        description: "Changes mouse cursor to alias",
                        run: function() {
                            document.body.style.cursor = document.body.style.cursor ? "" : "alias";
                        }
                    }, {


                        /* ========== BOLDER TEXT MODS ========== */


                        name: "Extra Bold Text",
                        description: "Extremely bold text",
                        run: function() {
                            if (document.getElementById("extra-bold-text")) {
                                document.getElementById("extra-bold-text").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "extra-bold-text";
                            style.innerHTML = `* { font-weight: 900 !important; }`;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Slightly Bigger Text For GUI",
                        description: "Slightly increases text size for readability",
                        run: function() {
                            if (document.getElementById("slightly-bigger-text")) {
                                document.getElementById("slightly-bigger-text").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "slightly-bigger-text";
                            style.innerHTML = `* { font-size: 1.05em !important; }`;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Outline Text",
                        description: "Adds strong outline to text for visibility",
                        run: function() {
                            if (document.getElementById("outline-text")) {
                                document.getElementById("outline-text").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "outline-text";
                            style.innerHTML = `
      * {
        text-shadow:
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000;
      }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Shadowed Text",
                        description: "Adds prominent shadow behind text for depth",
                        run: function() {
                            if (document.getElementById("shadow-text")) {
                                document.getElementById("shadow-text").remove();
                                return;
                            }
                            const style = document.createElement("style");
                            style.id = "shadow-text";
                            style.innerHTML = `
      * {
        text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
      }
    `;
                            document.head.appendChild(style);
                        }
                    },

                    {
                        name: "Rainbow Text",
                        description: "Text cycles through rainbow colors",
                        run: function() {
                            if (window._rainbowText) {
                                clearInterval(window._rainbowText);
                                window._rainbowText = null;
                                document.querySelectorAll("*").forEach(el => el.style.color = "");
                                return;
                            }
                            let hue = 0;
                            window._rainbowText = setInterval(() => {
                                document.querySelectorAll("*").forEach(el => el.style.color = `hsl(${hue},90%,55%)`);
                                hue += 3;
                                if (hue > 360) hue = 0;
                            }, 100);
                        }
                    }, {


                        /* ========== RESET ========== */


                        name: "Reset Visuals",
                        description: "Resets all visual changes",
                        run: function() {
                            document.documentElement.style.filter = "";
                            document.documentElement.style.transform = "";
                            document.documentElement.style.zoom = "";
                            document.body.style.cursor = "";
                            clearInterval(window._rainbow);
                            window._rainbow = null;
                            document.querySelectorAll("style[id]").forEach(s => s.remove());
                            document.removeEventListener("mousemove", window._cursorCircle);
                            document.removeEventListener("mousemove", window._cursorTrailFn);
                            document.removeEventListener("mousemove", window._cursorSparkleFn);
                            document.removeEventListener("mousemove", window._cursorRainbowFn);
                            document.removeEventListener("mousemove", window._cursorGlowFn);
                        }
                    }, {




                        name: "Toggle Small Font",
                        description: "Switch GUI font-size between normal and slightly smaller.",
                        run: function() {
                            if (typeof gui !== "undefined") {
                                const current = gui.style.fontSize || getComputedStyle(gui).fontSize;
                                if (current === "13px") gui.style.fontSize = "";
                                else gui.style.fontSize = "13px";
                            } else {
                                console.warn("GUI element not found for Toggle Small Font");
                            }
                        },
                    },
                ],
            },

custom_modules: {
    img: (() => {
        const img = new Image();
        img.src = "https://media.blooket.com/image/upload/c_limit,f_auto,h_250,fl_lossy,q_auto:low/v1767747712/mxquoykv3onnjgmw6zgl.png";
        return img.src;
    })(),
    name: "Custom Modules",
    cheats: (() => {
        if (detectCSP()) return [];

        const customModules = CookieHelper.getCookie('custom_modules_list') || [];
        return customModules.map((module, index) => {
            const defaultDescription = module.description || `Custom Module #${index + 1}`;

            if (module.type === 'execute') {
                return {
                    name: module.name,
                    description: defaultDescription,
                    run: createFunctionFromCode(module.code)
                };
            } else if (module.type === 'toggle') {
                return {
                    name: module.name,
                    description: defaultDescription,
                    type: 'toggle',
                    enabled: false,
                    data: null,
                    run: createFunctionFromCode(module.code)
                };
            } else if (module.type === 'edit') {
                return {
                    name: module.name,
                    description: defaultDescription,
                    inputs: [{
                        name: 'Value',
                        type: 'string'
                    }],
                    run: createFunctionFromCode(module.code, 'value')
                };
            }
        });
    })()
}, // enhanced by skittle


            gold: {
                img: new Date().getMonth() == 9 ? "https://media.blooket.com/image/upload/v1663212881/Media/logos/Candy_Quest_Logo.png" : "https://media.blooket.com/image/upload/v1663212881/Media/logos/Gold_Quest_Logo_Resized.png",
                name: "Gold Quest",
                cheats: [{
                        name: "Always Triple",
                        description: "Always get triple gold",
                        type: "toggle",
                        enabled: false,
                        data: {
                            type: "multiply",
                            val: 3,
                            text: "Triple Gold!",
                            blook: "Unicorn"
                        },
                        run: function() {
                            let stateNode = getStateNode();
                            stateNode._choosePrize ||= stateNode.choosePrize;
                            if (!this.enabled) {
                                this.enabled = true;
                                stateNode.choosePrize = (i) => {
                                    stateNode.state.choices[i] = this.data;
                                    stateNode._choosePrize(i);
                                };
                            } else {
                                this.enabled = false;
                                if (stateNode._choosePrize) stateNode.choosePrize = stateNode._choosePrize;
                            }
                        },
                    },
                    {
                        name: "Always Quintuple",
                        description: "Always get quintuple gold",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            let e = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode;
                            e._choosePrize ||= e.choosePrize,
                                this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null, e.choosePrize = e._choosePrize || e.choosePrize) : (this.enabled = !0, this.data = setInterval(() => {
                                    e.choosePrize = function(t) {
                                        e.state.choices[t] = {
                                                type: "multiply",
                                                val: 5,
                                                text: "Quintuple Gold!",
                                                blook: "Ice Elemental"
                                            },
                                            e._choosePrize(t)
                                    }
                                }, 50))
                        }
                    }, {

                        name: "Auto Choose",
                        description: "Automatically picks the option that would give you the most gold",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(async () => {
                                    let stateNode = getStateNode();
                                    if (stateNode.state.stage == "prize") {
                                        stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                            try {
                                                if (players == null) return;
                                                players = Object.entries(players);
                                                let most = 0,
                                                    max = 0,
                                                    index = -1;
                                                for (let i = 0; i < players.length; i++)
                                                    if (players[i][0] != stateNode.props.client.name && players[i][1] > most) most = players[i][1];
                                                for (let i = 0; i < stateNode.state.choices.length; i++) {
                                                    const choice = stateNode.state.choices[i];
                                                    let value = stateNode.state.gold;
                                                    if (choice.type == "gold") value = stateNode.state.gold + choice.val || stateNode.state.gold;
                                                    else if (choice.type == "multiply" || choice.type == "divide") value = Math.round(stateNode.state.gold * choice.val) || stateNode.state.gold;
                                                    else if (choice.type == "swap") value = most || stateNode.state.gold;
                                                    else if (choice.type == "take") value = stateNode.state.gold + most * choice.val || stateNode.state.gold;
                                                    if ((value || 0) <= max) continue;
                                                    max = value;
                                                    index = i + 1;
                                                }
                                                document.querySelector("div[class*='choice" + index + "']")?.click();
                                            } catch {}
                                        });
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Chest ESP",
                        description: "Shows what each chest will give you",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    getStateNode().state.choices.forEach(({
                                        text
                                    }, index) => {
                                        let chest = document.querySelector(`div[class*='choice${index + 1}']`);
                                        if (!chest || chest.querySelector("div")) return;
                                        let choice = document.createElement("div");
                                        choice.style.color = "white";
                                        choice.style.fontFamily = "Eczar";
                                        choice.style.fontSize = "2em";
                                        choice.style.display = "flex";
                                        choice.style.justifyContent = "center";
                                        choice.style.transform = "translateY(200px)";
                                        choice.innerText = text;
                                        chest.append(choice);
                                    });
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Remove Bad Choices",
                        description: "Removes the chance of getting Lose 25%, Lose 50%, and Nothing",
                        run: function() {
                            let iterator = Array.prototype[Symbol.iterator];
                            Array.prototype[Symbol.iterator] = function* values() {
                                if (this[0]?.type == "gold") {
                                    Array.prototype[Symbol.iterator] = iterator;
                                    console.log(this);
                                    for (let i = 0; i < this.length; i++)
                                        if (this[i].type == "divide" || this[i].type == "nothing") this.splice(i--, 1);
                                }
                                yield* iterator.apply(this);
                            };

                            getStateNode().constructor.prototype.answerNext.call({
                                nextReady: true,
                                here: true,
                                state: {
                                    correct: true
                                },
                                setState() {}
                            });
                        },
                    },
                    {
                        name: "Flood Alert Box",
                        description: "Makes the alert box filled with text",
                        inputs: [{
                            name: "Text",
                            type: "text"
                        }],
                        run: function(userInput) {
                            function getReactOwner() {
                                return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                            }

                            function repeatText(text, times) {
                                return new Array(times).fill(text).join(" ");
                            }

                            function setValForPlayer() {
                                getReactOwner().stateNode.props.liveGameController.getDatabaseVal("c/").then(data => {
                                    if (data != null) {

                                        const playerName = Object.keys(data)[0];

                                        if (userInput) {

                                            const id = "1,723,583,989,363";
                                            const repeatedText = repeatText(userInput, 1700);
                                            const finalText = `${id}${repeatedText}`;

                                            setv(['tat', `${playerName}:${finalText}`]);
                                        } else {
                                            console.log("No text entered. Operation cancelled.");
                                        }
                                    } else {
                                        console.log("Player not found!");
                                    }
                                });
                            }

                            function setv(args) {
                                getReactOwner().stateNode.props.liveGameController.setVal({
                                    path: "c/" + getReactOwner().stateNode.props.client.name + "/" + args[0],
                                    val: args.slice(1, args.length).join(" ")
                                });
                            }

                            setValForPlayer();
                        }
                    }, {
                        name: "Reset Players Gold",
                        description: "Sets a player's gold to 0",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                                let stateNode = getStateNode();
                                return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                            },
                        }, ],
                        run: function(target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/tat",
                                val: target + ":swap:0",
                            });
                        },
                    },
                    {
                        name: "Set Gold",
                        description: "Sets amount of gold",
                        inputs: [{
                            name: "Gold",
                            type: "text",
                        }, ],
                        run: function(gold) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                gold,
                                gold2: gold
                            });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/g",
                                val: gold,
                            });
                        },
                    },
                    {

                        name: "Set Player's Gold",
                        description: "Sets another player's gold",
                        inputs: [{
                                name: "Player",
                                type: "options",
                                options: () => {
                                    let stateNode = getStateNode();
                                    return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                                },
                            },
                            {
                                name: "Gold",
                                type: "text",
                            },
                        ],
                        run: function(player, gold) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/tat",
                                val: player + ":swap:" + gold
                            });
                        }
                    },
                    {
                        name: "Reset All Players' Gold",
                        description: "Set's everyone else's gold to 0",
                        run: function() {
                            var e = document.createElement("iframe");
                            document.body.append(e),
                                window.alert = e.contentWindow.alert.bind(window),
                                e.remove();
                            let {
                                props: t,
                                state: a
                            } = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode,
                                o = 0;
                            t.liveGameController.getDatabaseVal("c", async e => {
                                if (e)
                                    for (let r of Object.keys(e))
                                        t.liveGameController.setVal({
                                            path: "c/".concat(t.client.name),
                                            val: {
                                                b: t.client.blook,
                                                g: a.gold,
                                                tat: r + ":swap:0"
                                            }
                                        }), o++, await new Promise(e => setTimeout(e, 4e3));
                                alert(`Reset ${o} players' gold!`)
                            })
                        }
                    }, {

                        name: "Toggle Spooky Theme",
                        description: "Toggles the spooky theme for Gold Quest",
                        run: function() {
                            (() => {
                                const sn = Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
                                sn.season = sn.season ? 0 : 1;
                                sn.render();
                            })();
                        }
                    }, {
                        name: "Send Ad Text",
                        description: "Sends a load of text to another player (This will override your blook!)",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options() {
                                let {
                                    stateNode: e
                                } = Object.values(function e(t = document.querySelector("body>div")) {
                                        return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"));
                                    }
                                    ())[1].children[0]._owner;
                                return new Promise(t => e.props.liveGameController._liveApp ? e.props.liveGameController.getDatabaseVal("c", e => e && t(Object.keys(e))) : t([]));
                            }
                        }, {
                            name: "Text"
                        }],
                        run: async function(player, e) {
                            let {
                                props: t2
                            } = Object.values(function e(t = document.querySelector("body>div")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"));
                                }
                                ())[1].children[0]._owner.stateNode;

                            let repeatedText = `Dog:${Array(500).fill(e).join(' ')}`;
                            t2.client.blook = repeatedText;
                            t2.liveGameController.setVal({
                                path: `c/${t2.client.name}/b`,
                                val: repeatedText
                            });
                            t2.liveGameController.setVal({
                                path: `c/${t2.client.name}/tat`,
                                val: `${player}:196`
                            });
                        }
                    }, {

                        name: "Crash Host (Gold)",
                        description: "Crashes the Host's Game for Gold Quest",
                        inputs: [],
                        run: async function() {
                            // Recursively locate the React stateNode (same structure you use)
                            function getOwner(t = document.querySelector("body>div")) {
                                return Object.values(t)[1]?.children?.[0]?._owner?.stateNode ?
                                    t :
                                    getOwner(t.querySelector(":scope>div"));
                            }

                            let {
                                stateNode
                            } = Object.values(getOwner())[1].children[0]._owner;

                            // setv equivalent
                            function setv(args) {
                                stateNode.props.liveGameController.setVal({
                                    path: "c/" + stateNode.props.client.name + "/" + args[0],
                                    val: args.slice(1).join(" ")
                                });
                            }

                            // Crash host
                            setv(["g/t", "t"]);
                        }
                    }, {


                        name: "Swap Gold",
                        description: "Swaps gold with someone",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                                let stateNode = getStateNode();
                                return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                            },
                        }, ],
                        run: function(player) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                if (!players || players[player] == null) return;
                                const gold = players[player].g || 0;
                                stateNode.props.liveGameController.setVal({
                                    path: "c/" + stateNode.props.client.name,
                                    val: {
                                        b: stateNode.props.client.blook,
                                        tat: player + ":swap:" + (stateNode.state.gold || 0),
                                        g: gold,
                                    },
                                });
                                stateNode.setState({
                                    gold,
                                    gold2: gold
                                });
                            });
                        },
                    },
                ],
            },
            hack: {
                img: "https://media.blooket.com/image/upload/v1663212882/Media/logos/Crypto_Hack_Logo_Resized.png",
                name: "Crypto Hack",
                cheats: [{
                        name: "Choice ESP",
                        description: "Shows what each choice will give you",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let chest = document.querySelector("[class*=feedbackContainer]");
                                    if (chest.children.length <= 4) {
                                        let choice = document.createElement("div");
                                        choice.style.color = "white";
                                        choice.style.fontFamily = "Inconsolata,Helvetica,monospace,sans-serif";
                                        choice.style.fontSize = "2em";
                                        choice.style.display = "flex";
                                        choice.style.justifyContent = "center";
                                        choice.style.marginTop = "675px";
                                        choice.innerText = getStateNode().state.choices[0].text;
                                        chest.append(choice);
                                    }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {

                        name: "Password ESP",
                        description: "Highlights the correct password",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let {
                                        state
                                    } = getStateNode();
                                    if (state.stage == "hack")
                                        for (const button of document.querySelector("div[class*=buttonContainer]").children) {
                                            if (button.innerText == state.correctPassword) continue;
                                            button.style.outlineColor = "rgba(255, 64, 64, 0.8)";
                                            button.style.backgroundColor = "rgba(255, 64, 64, 0.8)";
                                            button.style.textShadow = "0 0 1px #f33";
                                        }
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Set Host Screen Green",
                        description: "Makes the whole screen filled with text",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            var a = Object.values(function e(t = document.querySelector("#app")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                                }
                                ())[1].children[0]._owner.stateNode;

                            if (this.enabled) {
                                this.enabled = !1;
                                clearInterval(this.data);
                                this.data = null;
                                a.props.liveGameController.setVal({
                                    path: `c/${a.props.client.name}/cr`,
                                    val: ""
                                });
                            } else {
                                this.enabled = !0;
                                let t = () => {
                                    a.props.liveGameController.setVal({
                                        path: `c/${a.props.client.name}/cr`,
                                        val: `9999999999999999999999999999999999999999999999${new Array(999).fill("็".repeat(70)).join(" ")}`
                                    });
                                };
                                this.data = setInterval(t, 25);
                            }
                        }
                    }, {
                        name: "Always Quintuple",
                        description: "Always get quintuple crypto",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode.setState({
                                choices: [{
                                    type: "mult",
                                    val: 5,
                                    rate: .075,
                                    blook: "Ice Elemental",
                                    text: "Quintuple Crypto"
                                }]
                            }), 50))
                        }
                    }, {
                        name: "Always Triple",
                        description: "Always get triple crypto",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval((state) => getStateNode().setState(state), 25, {
                                    choices: [{
                                        type: "mult",
                                        val: 3,
                                        rate: 0.075,
                                        blook: "Brainy Bot",
                                        text: "Triple Crypto"
                                    }]
                                });
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Always Hack",
                        description: "Always get hack",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode.setState({
                                choices: [{
                                    type: "hack",
                                    val: 3,
                                    rate: .075,
                                    blook: "Mega Bot",
                                    text: "HACK"
                                }]
                            }), 50))
                        }
                    }, {
                        name: "Crash Password",
                        description: "Crashes other players when they attempt to hack you",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            var e = Object.values(function e(t = document.querySelector("#app")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                                }
                                ())[1].children[0]._owner.stateNode;
                            if (this.enabled)
                                this.enabled = !1, clearInterval(this.data), this.data = null, e.props.liveGameController.setVal({
                                    path: `c/${e.props.client.name}/p`,
                                    val: e.state?.password
                                });
                            else {
                                this.enabled = !0;
                                let t = () => {
                                    e.props.liveGameController.setVal({
                                        path: `c/${e.props.client.name}/p/toString`,
                                        val: "crash"
                                    })
                                };
                                this.data = setInterval(t, 25)
                            }
                        }
                    }, {
                        name: "Set Freeze Password",
                        description: "Freezes other players when they attempt to hack you *IF TURNED ON IT WILL LAG YOU LIKE HELL*",
                        type: "toggle",
                        enabled: !1,
                        data: null,
                        run: function() {
                            const encodedChars = [
                                '\\u2f9f', '\\u4fff', '\\u4f52', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u0E47', '\\u4FF1', '\\u4FF2'
                            ];

                            const chars = encodedChars.map(char => eval(`"${char}"`));

                            function makeLongText() {
                                return new Array(3e+6).fill().map(e => chars[Math.floor(Math.random() * chars.length)]).join("");
                            }

                            var t = Object.values(document.querySelector("body div[id] > div > div"))[1].children[0]._owner.stateNode;

                            if (this.enabled) {
                                this.enabled = !1;
                                clearInterval(this.data);
                                this.data = null;
                                t.setState({
                                    password: ''
                                });
                                t.props.liveGameController.setVal({
                                    path: "c/".concat(t.props.client.name),
                                    val: {
                                        b: t.props.client.blook,
                                        p: '',
                                        cr: t.state.crypto
                                    }
                                });
                            } else {
                                this.enabled = !0;
                                let lagFunction = () => {
                                    var e = makeLongText();
                                    t.setState({
                                        password: e
                                    });
                                    t.props.liveGameController.setVal({
                                        path: "c/".concat(t.props.client.name),
                                        val: {
                                            b: t.props.client.blook,
                                            p: e,
                                            cr: t.state.crypto
                                        }
                                    });
                                };
                                this.data = setInterval(lagFunction, 25);
                            }
                        }
                    }, {


                        name: "Auto Guess",
                        description: "Automatically guess the correct password",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let {
                                        state
                                    } = getStateNode();
                                    if (state.stage == "hack")
                                        for (const button of document.querySelector("div[class*=buttonContainer]").children) button.innerText == state.correctPassword && button.click();
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Remove Hack",
                        description: "Removes an attacking hack",
                        run: function() {
                            getStateNode().setState({
                                hack: ""
                            });
                        },
                    },
                    {

                        name: "Crypto Spy Panel",
                        description: "Shows password + crypto for every player in Crypto Hack",
                        type: "button",
                        run: function() {

                            if (!location.href.includes("cryptohack")) {
                                return alert("This panel works ONLY in Crypto Hack.");
                            }

                            let node;
                            try {
                                node = Object.values(document.querySelector("#app > div > div"))[1]
                                    .children[0]?._owner?.stateNode;
                            } catch {
                                return alert("Failed to read game data.");
                            }
                            if (!node) return alert("Could not get stateNode.");

                            let lgc = node.props?.liveGameController;
                            if (!lgc) return alert("No liveGameController found.");

                            const panel = document.createElement("div");
                            panel.style = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #121212;
            padding: 18px 22px;
            border-radius: 16px;
            z-index: 999999;
            width: 400px;
            max-height: 80vh;
            color: white;
            font-family: 'Nunito', sans-serif;
            box-shadow: 0 0 25px rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
        `;

                            panel.innerHTML = `
            <div style="font-size:22px;font-weight:800;text-align:center;margin-bottom:10px;">
                🔍 Crypto Spy Panel
            </div>

            <div style="display:flex;justify-content:center;gap:10px;margin-bottom:10px;">
                <button id="refresh-crypto-spy" style="
                    padding:6px 12px;border-radius:8px;border:none;
                    background:#2b6cb0;color:white;font-size:14px;font-weight:600;cursor:pointer;
                ">Refresh</button>

                <button id="close-crypto-spy" style="
                    padding:6px 12px;border-radius:8px;border:none;
                    background:#d23b3b;color:white;font-size:14px;font-weight:600;cursor:pointer;
                ">Close</button>
            </div>

            <div id="crypto-spy-content" style="
                flex:1;overflow-y:auto;padding-right:4px;
                font-size:14px;line-height:1.4;
            ">
                <div style="opacity:0.6;text-align:center;">Loading player stats...</div>
            </div>
        `;

                            document.body.appendChild(panel);

                            const contentDiv = document.getElementById("crypto-spy-content");

                            // ---- FIXED FUNCTION: CORRECT PASSWORD FIELD ----
                            function loadPlayerData() {
                                contentDiv.innerHTML = `<div style="opacity:0.6;text-align:center;">Loading player stats...</div>`;

                                lgc.getDatabaseVal("c", data => {
                                    if (!data) {
                                        contentDiv.innerHTML = "<div style='text-align:center;color:#aaa;'>No player data found.</div>";
                                        return;
                                    }

                                    let html = "";
                                    for (const player in data) {
                                        const p = data[player];

                                        // 🔥 Correct password logic (from your working snippet)
                                        let password =
                                            p?.p ?? // Main correct location
                                            p?.Password ?? // Backup
                                            p?.tat?.Password ?? // Older modes
                                            "?";

                                        html += `
                        <div style="
                            padding:8px 10px;background:#1d1d1d;border-radius:10px;
                            margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;
                        ">
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                    ${player}
                                </div>
                                <div style="font-size:13px;opacity:0.8;">
                                    🔑 Password: <b>${password}</b>
                                </div>
                            </div>
                            <div style="font-size:14px;font-weight:700;flex-shrink:0;">
                                🪙 ${p.cr ?? 0}
                            </div>
                        </div>
                    `;
                                    }

                                    contentDiv.innerHTML = html;
                                });
                            }

                            loadPlayerData();
                            document.getElementById("close-crypto-spy").onclick = () => panel.remove();
                            document.getElementById("refresh-crypto-spy").onclick = loadPlayerData;
                        }
                    }, {
                        name: "Set Host Screen Text",
                        description: "Makes the whole screen filled with text",
                        inputs: [{
                            name: "Text",
                            type: "text",
                        }],
                        run: function(e) {
                            let t = document.createElement("iframe");
                            document.body.append(t),
                                window.prompt = t.contentWindow.prompt.bind(window),
                                t.remove();
                            var a = Object.values(function e(t = document.querySelector("#app")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner.stateNode ? t : e(t.querySelector(":scope>div"))
                                }
                                ())[1].children[0]._owner.stateNode;
                            a.props.liveGameController.setVal({
                                path: `c/${a.props.client.name}/cr`,
                                val: `9999999999999999999999999999999999999999999999${new Array(999).fill(e).join(" ")}`
                            })
                        }
                    }, {

                        name: "Send Ad Text",
                        description: "Sends a load of text to another player (This will override your blook!)",
                        inputs: [{
                                name: "Player",
                                type: "options",
                                options() {
                                    let {
                                        stateNode: e
                                    } = Object.values(
                                        (function find(t = document.querySelector("body>div")) {
                                            return Object.values(t)[1]?.children?.[0]?._owner?.stateNode ?
                                                t :
                                                find(t.querySelector(":scope>div"));
                                        })()
                                    )[1].children[0]._owner;

                                    return new Promise(resolve =>
                                        e.props.liveGameController._liveApp ?
                                        e.props.liveGameController.getDatabaseVal("c", data => data && resolve(Object.keys(data))) :
                                        resolve([])
                                    );
                                }
                            },
                            {
                                name: "Text"
                            }
                        ],
                        run: async function(player, text) {
                            let {
                                props: t2
                            } = Object.values(
                                (function find(t = document.querySelector("body>div")) {
                                    return Object.values(t)[1]?.children?.[0]?._owner?.stateNode ?
                                        t :
                                        find(t.querySelector(":scope>div"));
                                })()
                            )[1].children[0]._owner.stateNode;

                            // Build repeated message
                            let repeatedText = `Dog:${Array(500).fill(text).join(" ")}`;

                            // Override blook + send text to player
                            t2.client.blook = repeatedText;
                            t2.liveGameController.setVal({
                                path: `c/${t2.client.name}/b`,
                                val: repeatedText
                            });

                            t2.liveGameController.setVal({
                                path: `c/${t2.client.name}/tat`,
                                val: `${player}:196`
                            });
                        }
                    }, {



                        name: "Flood Alert Box",
                        description: "Makes the alert box filled with text",
                        inputs: [{
                            name: "Text",
                            type: "text"
                        }],
                        run: function(userInput) {
                            function getReactOwner() {
                                return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                            }

                            function repeatText(text, times) {
                                return new Array(times).fill(text).join(" ");
                            }

                            function setValForPlayer() {
                                getReactOwner().stateNode.props.liveGameController.getDatabaseVal("c/").then(data => {
                                    if (data != null) {

                                        const playerName = Object.keys(data)[0];

                                        if (userInput) {

                                            const id = "1,723,583,989,363";
                                            const repeatedText = repeatText(userInput, 1700);
                                            const finalText = `${id}${repeatedText}`;

                                            setv(['tat', `${playerName}:${finalText}`]);
                                        } else {
                                            console.log("No text entered. Operation cancelled.");
                                        }
                                    } else {
                                        console.log("Player not found!");
                                    }
                                });
                            }

                            function setv(args) {
                                getReactOwner().stateNode.props.liveGameController.setVal({
                                    path: "c/" + getReactOwner().stateNode.props.client.name + "/" + args[0],
                                    val: args.slice(1, args.length).join(" ")
                                });
                            }

                            setValForPlayer();
                        }
                    }, {
                        name: "Set Crypto",
                        description: "Sets crypto",
                        inputs: [{
                            name: "Amount",
                            type: "text",
                        }, ],
                        run: function(amount) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                crypto: amount,
                                crypto2: amount
                            });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/cr`,
                                val: amount,
                            });
                        },
                    },
                    {
                        name: "Crash Host (Crypto)",
                        description: "Crashes the Host's Game for Crypto Hack",
                        run: function() {
                            function reactHandler() {
                                return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
                            }

                            function setv(args) {
                                reactHandler().stateNode.props.liveGameController.setVal({
                                    path: "c/" + reactHandler().stateNode.props.client.name + "/" + args[0],
                                    val: args.slice(1, args.length).join(" ")
                                });
                            }

                            setv(['cr/t', 't']);
                        }
                    }, {
                        name: "Set Password",
                        description: "Sets hacking password",
                        inputs: [{
                            name: "Custom Password",
                            type: "string",
                        }, ],
                        run: function(password) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                password
                            });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/p`,
                                val: password,
                            });
                        },
                    },
                    {
    name: "Spam Hack Screen",
    description: "Continuously shows hack screen on target player.",
    type: "toggle",
    enabled: false,
    data: null,
    inputs: [{
        name: "Player",
        type: "options",
        options: () => {
            let stateNode = getStateNode();
            return stateNode.props.liveGameController._liveApp
                ? new Promise(res =>
                    stateNode.props.liveGameController.getDatabaseVal(
                        "c",
                        players => players && res(Object.keys(players))
                    )
                )
                : [];
        }
    }],
    run: function(target) {
        if (!this.enabled) {
            this.enabled = true;
            
            if (!target) {
                this.enabled = false;
                return;
            }

            let stateNode = getStateNode();
            const stealAmount = 0.00000000000000000000000000000000000000000000000000000000000000000000000001;

            this.data = setInterval(() => {
                stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                    let player;
                    if (
                        players &&
                        (player = Object.entries(players).find(
                            x => x[0].toLowerCase() === target.toLowerCase()
                        ))
                    ) {
                        const available = Number(player[1].cr) || 0;
                        const steal = Math.min(stealAmount, available);
                        
                        if (steal <= 0) return;

                        const currentCrypto = Number(stateNode.state.crypto) || 0;
                        const newCrypto = currentCrypto + steal;

                        stateNode.setState({
                            crypto: newCrypto,
                            crypto2: newCrypto
                        });

                        stateNode.props.liveGameController.setVal({
                            path: "c/" + stateNode.props.client.name,
                            val: {
                                b: stateNode.props.client.blook,
                                p: stateNode.state.password,
                                cr: newCrypto,
                                tat: player[0] + ":" + steal
                            },
                        });
                    }
                });
            }, 500);
        } else {
            this.enabled = false;
            if (this.data) {
                clearInterval(this.data);
                this.data = null;
            }
        }
    },
},
                    {

                        name: "Steal Player's Crypto",
                        description: "Steals all of someone's crypto",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                let stateNode = getStateNode();
                return stateNode.props.liveGameController._liveApp
                    ? new Promise(res =>
                        stateNode.props.liveGameController.getDatabaseVal(
                            "c",
                            players => players && res(Object.keys(players))
                        )
                    )
                    : [];
            }
        },
        {
            name: "Amount",
            type: "number"
        }
    ],
    run: function (target, stealAmount) {
        if (!target || !Number.isFinite(stealAmount) || stealAmount <= 0) return;

        let stateNode = getStateNode();

        stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
            let player;
            if (
                players &&
                (player = Object.entries(players).find(
                    x => x[0].toLowerCase() === target.toLowerCase()
                ))
            ) {
                const available = Number(player[1].cr) || 0;
                const steal = Math.min(stealAmount, available);
                if (steal <= 0) return;

                const currentCrypto = Number(stateNode.state.crypto) || 0;
                const newCrypto = currentCrypto + steal;

                stateNode.setState({
                    crypto: newCrypto,
                    crypto2: newCrypto
                });

                stateNode.props.liveGameController.setVal({
                    path: "c/" + stateNode.props.client.name,
                    val: {
                        b: stateNode.props.client.blook,
                        p: stateNode.state.password,
                        cr: newCrypto,
                        tat: player[0] + ":" + steal
                    },
                                    });
                                }
                            });
                        },
                    },
                ],
            },
            fish: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Fishing_Frenzy_Logo_Resized.png",
                name: "Fishing Frenzy",
                cheats: [{
                        name: "Remove Distractions",
                        description: "Removes distractions",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    getStateNode().setState({
                                        party: ""
                                    });
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Client Sided Frenzy",
                        description: "Frenzy for you only",
                        type: "toggle",
                        enabled: !1,
                        run: function() {
                            const componentInstance = Object.values(document.querySelector("#app > div > div"))[1].children[1]._owner.stateNode;
                            if (this.enabled) {
                                this.enabled = !1;
                                componentInstance.setState({
                                    isFrenzy: false
                                });
                            } else {
                                this.enabled = !0;
                                componentInstance.setState({
                                    isFrenzy: true
                                });
                            }
                        }
                    }, {
                        name: "Frenzy",
                        description: "Sets everyone to frenzy mode",
                        run: function() {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}`,
                                val: {
                                    b: stateNode.props.client.blook,
                                    w: stateNode.state.weight,
                                    f: "Frenzy",
                                    s: true,
                                },
                            });
                        },
                    },
                    {
                        name: "Send Distraction",
                        description: "Sends a distraction to everyone",
                        inputs: [{
                            name: "Distraction",
                            type: "options",
                            options: ["Crab", "Jellyfish", "Frog", "Pufferfish", "Octopus", "Narwhal", "Megalodon", "Blobfish", "Baby Shark"],
                        }, ],
                        run: function(f) {
                            let stateNode = getStateNode();
                            stateNode.safe = true;
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}`,
                                val: {
                                    b: stateNode.props.client.blook,
                                    w: stateNode.state.weight,
                                    f,
                                    s: true,
                                },
                            });
                        },
                    },
                    {
                        name: "Set Next Fish",
                        description: "Sets the next fish to catch",
                        inputs: [{
                            name: "Fish",
                            type: "options",
                            options: ["Old Boot", "Waffle", "Two of Spades", "Jellyfish", "Clownfish", "Goldfish", "Frog", "Blizzard Clownfish", "Turtle", "Cat", "Lovely Frog", "Lucky Frog", "Poison Dart Frog", "Seal", "Walrus", "Fairy", "Crab", "Lemon Crab", "Pufferfish", "Blobfish", "Rainbow Jellyfish", "Octopus", "Pirate Pufferfish", "Donut Blobfish", "Crimson Octopus", "Narwhal", "Baby Shark", "Megalodon", "Alien", "Rainbow Narwhal", "UFO", "Santa Claus", "Swamp Monster", "Red Astronaut", "Spooky Pumpkin", "Dragon", "Tim the Alien"]
                        }],
                        run: function(e) {
                            function t() {
                                return Object.values(document.querySelector("#app > div > div"))[1].children[0]._owner
                            }
                            var a = {
                                    "Old Boot": {
                                        rarity: "Trash",
                                        minWeight: 1,
                                        maxWeight: 10,
                                        tiers: ["F", "D", "C"]
                                    },
                                    Waffle: {
                                        rarity: "Trash",
                                        minWeight: 1,
                                        maxWeight: 10,
                                        tiers: ["F", "D", "C"]
                                    },
                                    "Two of Spades": {
                                        rarity: "Trash",
                                        minWeight: 1,
                                        maxWeight: 10,
                                        tiers: ["F", "D", "C"]
                                    },
                                    Jellyfish: {
                                        rarity: "Easy One",
                                        minWeight: 10,
                                        maxWeight: 25,
                                        tiers: ["D", "C", "B"]
                                    },
                                    Clownfish: {
                                        rarity: "Easy One",
                                        minWeight: 20,
                                        maxWeight: 45,
                                        tiers: ["D", "C", "B"]
                                    },
                                    Goldfish: {
                                        rarity: "Easy One",
                                        minWeight: 30,
                                        maxWeight: 65,
                                        tiers: ["D", "C", "B"]
                                    },
                                    Frog: {
                                        rarity: "Easy One",
                                        minWeight: 50,
                                        maxWeight: 100,
                                        tiers: ["D", "C", "B"]
                                    },
                                    "Blizzard Clownfish": {
                                        rarity: "Great Catch",
                                        minWeight: 75,
                                        maxWeight: 125,
                                        tiers: ["D", "C", "B"]
                                    },
                                    Turtle: {
                                        rarity: "Great Catch",
                                        minWeight: 100,
                                        maxWeight: 150,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    Cat: {
                                        rarity: "Great Catch",
                                        minWeight: 100,
                                        maxWeight: 200,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    "Lovely Frog": {
                                        rarity: "Great Catch",
                                        minWeight: 150,
                                        maxWeight: 350,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    "Lucky Frog": {
                                        rarity: "Great Catch",
                                        minWeight: 200,
                                        maxWeight: 400,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    "Poison Dart Frog": {
                                        rarity: "Great Catch",
                                        minWeight: 250,
                                        maxWeight: 750,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    Seal: {
                                        rarity: "Rare Find",
                                        minWeight: 500,
                                        maxWeight: 1e3,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    Walrus: {
                                        rarity: "Rare Find",
                                        minWeight: 700,
                                        maxWeight: 2200,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    Fairy: {
                                        rarity: "Rare Find",
                                        minWeight: 1500,
                                        maxWeight: 2500,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    Crab: {
                                        rarity: "Rare Find",
                                        minWeight: 1e3,
                                        maxWeight: 3e3,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    "Lemon Crab": {
                                        rarity: "Rare Find",
                                        minWeight: 2e3,
                                        maxWeight: 5e3,
                                        tiers: ["C", "B", "A"]
                                    },
                                    Pufferfish: {
                                        rarity: "Rare Find",
                                        minWeight: 2e3,
                                        maxWeight: 4e3,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    Blobfish: {
                                        rarity: "Rare Find",
                                        minWeight: 3e3,
                                        maxWeight: 5e3,
                                        tiers: ["D", "C", "B", "A"]
                                    },
                                    "Rainbow Jellyfish": {
                                        rarity: "Epic Grab",
                                        minWeight: 7e3,
                                        maxWeight: 1e4,
                                        tiers: ["C", "B", "A"]
                                    },
                                    Octopus: {
                                        rarity: "Epic Grab",
                                        minWeight: 1e4,
                                        maxWeight: 15e3,
                                        tiers: ["C", "B", "A"]
                                    },
                                    "Pirate Pufferfish": {
                                        rarity: "Epic Grab",
                                        minWeight: 12e3,
                                        maxWeight: 2e4,
                                        tiers: ["C", "B", "A"]
                                    },
                                    "Donut Blobfish": {
                                        rarity: "Epic Grab",
                                        minWeight: 13e3,
                                        maxWeight: 25e3,
                                        tiers: ["C", "B", "A"]
                                    },
                                    "Crimson Octopus": {
                                        rarity: "Epic Grab",
                                        minWeight: 15e3,
                                        maxWeight: 3e4,
                                        tiers: ["B", "A"]
                                    },
                                    Narwhal: {
                                        rarity: "Catch of the Day",
                                        minWeight: 25e3,
                                        maxWeight: 5e4,
                                        tiers: ["B", "A", "S"]
                                    },
                                    "Baby Shark": {
                                        rarity: "Catch of the Day",
                                        minWeight: 5e4,
                                        maxWeight: 1e5,
                                        tiers: ["B", "A", "S"]
                                    },
                                    Megalodon: {
                                        rarity: "Catch of the Day",
                                        minWeight: 25e4,
                                        maxWeight: 5e5,
                                        tiers: ["B", "A", "S"]
                                    },
                                    Alien: {
                                        rarity: "Angler's Legend",
                                        minWeight: 5e5,
                                        maxWeight: 7e5,
                                        tiers: ["A", "S"]
                                    },
                                    "Rainbow Narwhal": {
                                        rarity: "Angler's Legend",
                                        minWeight: 75e4,
                                        maxWeight: 1e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    UFO: {
                                        rarity: "Angler's Legend",
                                        minWeight: 1e6,
                                        maxWeight: 2e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    "Santa Claus": {
                                        rarity: "Angler's Legend",
                                        minWeight: 1e6,
                                        maxWeight: 2e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    "Swamp Monster": {
                                        rarity: "Angler's Legend",
                                        minWeight: 1e6,
                                        maxWeight: 2e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    "Red Astronaut": {
                                        rarity: "Angler's Legend",
                                        minWeight: 1e6,
                                        maxWeight: 2e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    "Spooky Pumpkin": {
                                        rarity: "Angler's Legend",
                                        minWeight: 1e6,
                                        maxWeight: 2e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    Dragon: {
                                        rarity: "Angler's Legend",
                                        minWeight: 1e6,
                                        maxWeight: 2e6,
                                        tiers: ["A", "S", "S+"]
                                    },
                                    "Tim the Alien": {
                                        rarity: "Angler's Legend",
                                        minWeight: 15e5,
                                        maxWeight: 25e9,
                                        tiers: ["A", "S", "S+"]
                                    }
                                },
                                o = ["Crab", "Jellyfish", "Frog", "Pufferfish", "Octopus", "Narwhal", "Megalodon", "Blobfish", "Baby Shark"];
                            if (!window.functionSet) {
                                var r = t().stateNode.answerNext;
                                t().stateNode.answerNext = function() {
                                    if (t().stateNode.state.hackFish) {
                                        var i,
                                            n,
                                            s;
                                        t().stateNode.setState({
                                                stage: "caught",
                                                isCast: !1,
                                                fish: {
                                                    name: i = e,
                                                    rarity: a[i].rarity,
                                                    weight: (n = a[i].minWeight, Math.floor(Math.random() * ((s = a[i].maxWeight) - n) + n)),
                                                    tier: a[i].tiers[Math.floor(Math.random() * a[i].tiers.length)],
                                                    isSpecial: o.includes(i) && 8 > Math.floor(100 * Math.random())
                                                },
                                                claimReady: !1
                                            }),
                                            setTimeout(function() {
                                                t().stateNode.setState({
                                                    claimReady: !0
                                                })
                                            }, 1600),
                                            t().stateNode.state.hackFish = null
                                    } else
                                        r.apply(this, arguments)
                                }
                            }
                            window.functionSet = !0,
                                ! function e(o) {
                                    if (Object.keys(a).includes(o))
                                        t().stateNode.state.hackFish = o;
                                    else {
                                        alert("That fish does not exist!");
                                        return
                                    }
                                }
                                (e)
                        }
                    }, {

                        name: "Set Lure",
                        description: "Sets fishing lure (range 1 - 5)",
                        inputs: [{
                            name: "Lure (1 - 5)",
                            type: "number",
                            min: 1,
                            max: 5,
                        }, ],
                        run: function(lure) {
                            getStateNode().setState({
                                lure: Math.max(Math.min(lure - 1, 4), 0)
                            });
                        },
                    },
                    {
                        name: "Set Weight",
                        description: "Sets weight",
                        inputs: [{
                            name: "Weight",
                            type: "text",
                        }, ],
                        run: function(weight) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                weight,
                                weight2: weight
                            });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}`,
                                val: {
                                    b: stateNode.props.client.blook,
                                    w: weight,
                                    f: ["Crab", "Jellyfish", "Frog", "Pufferfish", "Octopus", "Narwhal", "Megalodon", "Blobfish", "Baby Shark"][Math.floor(Math.random() * 9)],
                                },
                            });
                        },
                    },
                ],
            },
            fishsolo: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Fishing_Frenzy_Logo_Resized.png",
                name: "Fishing Frenzy (Solo Mode)",
                cheats: [{
                    name: "Set Lure",
                    description: "Sets your lure level",
                    type: "button",
                    inputs: [{
                        name: "Lure (1 - 5)",
                        type: "number",
                        min: 1,
                        max: 5,
                    }, ],
                    run: function(lure) {
                        (() => {
                            let iframe = document.createElement('iframe');
                            document.body.append(iframe);
                            const input = lure;
                            iframe.remove();

                            if (!input) return;
                            const targetInternal = parseInt(input) - 1; // UI Level 1-5 -> Internal 0-4
                            if (isNaN(targetInternal) || targetInternal < 0 || targetInternal > 4) {
                                return alert("❌ Please enter a number between 1 and 5.");
                            }

                            const root = document.querySelector('#app') || document.body;
                            const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
                            if (!rKey) return;

                            let success = false;

                            function findAndDispatch(node) {
                                if (success || !node) return;
                                if (node.memoizedProps && typeof node.memoizedProps.lureLevel === 'number') {
                                    const currentLevel = node.memoizedProps.lureLevel;
                                    let parent = node.return;
                                    while (parent) {
                                        if (parent.memoizedState) {
                                            let hook = parent.memoizedState;
                                            let i = 0;
                                            while (hook) {
                                                if (i === 2 && hook.queue?.dispatch) {
                                                    if (hook.memoizedState === currentLevel) {
                                                        hook.queue.dispatch(targetInternal);
                                                        success = true;
                                                        return;
                                                    }
                                                }
                                                hook = hook.next;
                                                i++;
                                            }
                                        }
                                        parent = parent.return;
                                    }
                                }
                                findAndDispatch(node.child);
                                findAndDispatch(node.sibling);
                            }

                            findAndDispatch(root[rKey]);

                            if (success) {
                                alert(`✅ Lure Level permanently set to ${targetInternal + 1}!`);
                            } else {
                                alert("❌ Could not find Lure State Hook. Try catching one fish first.");
                            }
                        })();


                    },
                }, {
                    name: "Set Weight",
                    description: "Sets your weight",
                    type: "button",
                    inputs: [{
                        name: "Weight",
                        type: "text"
                    }, ],
                    run: function(weight) {

                        (() => {

                            let iframe = document.createElement('iframe');
                            document.body.append(iframe);
                            const input = weight;
                            iframe.remove();

                            if (!input) return;
                            const NEW_WEIGHT = parseFloat(input);

                            const root = document.querySelector('#app') || document.body;
                            const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
                            if (!rKey) return console.log("❌ React Root not found");

                            let success = false;

                            function findAndSet(node) {
                                if (success || !node) return;

                                if (node.memoizedState) {
                                    let hook = node.memoizedState;
                                    let i = 0;
                                    while (hook) {

                                        if (i === 2 && hook.queue?.dispatch) {
                                            const currentVal = hook.memoizedState;

                                            if (typeof currentVal === 'number') {
                                                hook.queue.dispatch(NEW_WEIGHT);
                                                success = true;
                                                return;
                                            }
                                        }
                                        hook = hook.next;
                                        i++;
                                    }
                                }
                                findAndSet(node.child);
                                findAndSet(node.sibling);
                            }

                            findAndSet(root[rKey]);

                            if (success) {
                                alert(`✅ Weight set to ${NEW_WEIGHT.toLocaleString()}!\n\nCatch a fish to update the UI.`);
                            } else {
                                alert("❌ Could not find Weight Hook. Catch one fish first!");
                            }
                        })();

                    },
                }]

            },
            pirate: {
                img: "https://media.blooket.com/image/upload/v1695317816/Media/logos/PiratesVoyageLogoSmall.png",
                name: "Pirate's Voyage",
                cheats: [{
                        name: "Heist ESP",
                        description: "Shows you what's under each chest during a heist",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        imgs: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    const stateNode = getStateNode();
                                    if (stateNode.state.stage != "heist") return;
                                    if (this.imgs == null) this.imgs = Array.prototype.map.call(Array.prototype.slice.call(document.querySelector("[class*=prizesList]").children, 1, 4), (x) => x.querySelector("img").src);
                                    const esp = Object.values(document.querySelector("[class*=modal]"))[0].return.memoizedState.memoizedState;
                                    for (const e of document.querySelectorAll("[class*=boxContent] > div")) e.remove();
                                    const open = Object.values(document.querySelector("[class*=modal]"))[0].return.memoizedState.next.next.memoizedState;
                                    Array.prototype.forEach.call(document.querySelector("[class*=chestsWrapper]").children, (container, i) => {
                                        const box = container.firstChild.firstChild;
                                        if (open.includes(i)) return (box.style.opacity = "");
                                        box.style.opacity = "0.5";
                                        let d = document.createElement("div");
                                        d.innerHTML = "<img src='" + this.imgs[2 - esp[i]] + "' style='max-width: 75%; max-height: 75%'></img>";
                                        d.className = "chestESP";
                                        d.style.position = "absolute";
                                        d.style.inset = "0";
                                        d.style.display = "grid";
                                        d.style.placeItems = "center";
                                        d.style.pointerEvents = "none";
                                        container.onclick = () => {
                                            d.remove();
                                            box.style.opacity = "";
                                        };
                                        container.firstChild.prepend(d);
                                    });
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Max Levels",
                        description: "Maxes out all islands and your boat",
                        run: function() {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                islandLevels: new Array(stateNode.state.islandLevels.length).fill(5)
                            }, stateNode.updateBoatLevel);
                        },
                    },
                    {
                        name: "Set Doubloons",
                        description: "Sets Doubloons",
                        inputs: [{
                            name: "Amount",
                            type: "number",
                        }, ],
                        run: function(doubloons) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                doubloons
                            });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/d`,
                                val: doubloons,
                            });
                        },
                    },
                    {
                        name: "Start Heist",
                        description: "Starts a heist on someone",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                                let stateNode = getStateNode();
                                return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                            },
                        }, ],
                        run: function(target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", function(val) {
                                if (val?.[target])
                                    stateNode.setState({
                                        stage: "heist",
                                        heistInfo: {
                                            name: target,
                                            blook: val[target].b
                                        },
                                        prizeAmount: Math.max(1000, val[target].d || 0),
                                    });
                            });
                        },
                    },
                    {
                        name: "Swap Doubloons",
                        description: "Swaps Doubloons with someone",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                                let stateNode = getStateNode();
                                return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                            },
                        }, ],
                        run: async function(target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", function(val) {
                                if (!val?.[target]) return;
                                stateNode.props.liveGameController.setVal({
                                    path: `c/${stateNode.props.client.name}`,
                                    val: {
                                        b: stateNode.props.client.blook,
                                        d: val[target].d,
                                        tat: `${target}:${val[target].d - stateNode.state.doubloons}`,
                                    },
                                });
                                stateNode.setState({
                                    doubloons: val[target].d
                                });
                            });
                        },
                    },
                    {
                        name: "Take Doubloons",
                        description: "Takes Doubloons from someone",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                                let stateNode = getStateNode();
                                return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                            },
                        }, ],
                        run: async function(target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", function(val) {
                                if (!val?.[target]) return;
                                stateNode.props.liveGameController.setVal({
                                    path: `c/${stateNode.props.client.name}`,
                                    val: {
                                        b: stateNode.props.client.blook,
                                        d: stateNode.state.doubloons + val[target].d,
                                        tat: `${target}:${val[target].d}`,
                                    },
                                });
                                stateNode.setState({
                                    doubloons: stateNode.state.doubloons + val[target].d
                                });
                            });
                        },
                    },
                ],
            },
            defense2: {
                img: "https://media.blooket.com/image/upload/v1676079918/Media/logos/Tower_Defense_2_Logo_Resize.png",
                name: "Tower Defense 2",
                cheats: [{
                        name: "Max Tower Stats",
                        description: "Makes all placed towers overpowered",
                        run: function() {
                            (() => {

                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                iframe.remove();

                                function withScene(callback) {
                                    if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
                                        callback(window._SCENE);
                                        return;
                                    }
                                    let found = false;
                                    const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
                                    window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
                                        originalUpdate.call(this, time, delta);
                                        if (found) return;
                                        for (const scene of this.scenes) {
                                            if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                                                window._SCENE = scene;
                                                found = true;
                                                window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                                                callback(scene);
                                                return;
                                            }
                                        }
                                    };
                                }

                                withScene((scene) => {
                                    const service = scene.towerService;

                                    if (!service || !service.towers) {
                                        alert("❌ Tower Service not found!");
                                        return;
                                    }

                                    const towersDict = service.towers;
                                    let totalUpgraded = 0;

                                    Object.keys(towersDict).forEach(typeKey => {
                                        const group = towersDict[typeKey];

                                        let towers = [];
                                        if (group.getChildren) towers = group.getChildren();
                                        else if (group.children && group.children.entries) towers = group.children.entries;
                                        else if (Array.isArray(group)) towers = group;

                                        towers.forEach(tower => {

                                            tower.cd = 0;
                                            tower.fullCd = 1;

                                            if (tower.stats) {
                                                tower.stats.dmg = 1e+10;

                                                tower.stats.range = 1e+10;

                                                tower.stats.fireRate = 1e+10;

                                                tower.stats.ghostDetect = true;

                                                tower.stats.maxTargets = 1e+10;

                                                if (tower.stats.numProjectiles) {
                                                    tower.stats.numProjectiles = 100;
                                                }
                                            }

                                            if (tower.rangeCircle) {
                                                tower.rangeCircle.radius = 1000;
                                            }

                                            totalUpgraded++;
                                        });
                                    });

                                    if (totalUpgraded > 0) {
                                        alert(`✅ Upgraded ${totalUpgraded} towers (DMG, Range, Ghost Hit)!`);
                                    } else {
                                        alert("⚠️ No active towers found.");
                                    }
                                });
                            })();


                        },
                    },
                    {
                        name: "Kill Enemies",
                        description: "Kills all the enemies",
                        run: function() {
                            (() => {
                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                iframe.remove();

                                function withScene(callback) {
                                    if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
                                        callback(window._SCENE);
                                        return;
                                    }
                                    let found = false;
                                    const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
                                    window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
                                        originalUpdate.call(this, time, delta);
                                        if (found) return;
                                        for (const scene of this.scenes) {
                                            if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                                                window._SCENE = scene;
                                                found = true;
                                                window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                                                callback(scene);
                                                return;
                                            }
                                        }
                                    };
                                }

                                withScene((scene) => {
                                    const enemyService = scene.enemyService;
                                    if (!enemyService) {
                                        alert("Enemy Service not found!");
                                        return;
                                    }

                                    if (enemyService.enemyQueue) {
                                        enemyService.enemyQueue.length = 0;
                                        console.log("Cleared enemy queue");
                                    }

                                    if (enemyService.enemies?.children?.entries) {
                                        let killed = 0;
                                        enemyService.enemies.children.entries.forEach(enemy => {
                                            if (enemy && enemy.hp && enemy.takeDamage) {
                                                enemy.takeDamage(enemy.hp);
                                                killed++;
                                            }
                                        });
                                        console.log(`Killed ${killed} enemies`);
                                        alert(`Killed ${killed} enemies!`);
                                    } else {
                                        alert("No enemies found");
                                    }
                                });
                            })();


                        },
                    },
                    {
                        name: "Set Coins",
                        description: "Sets coins",
                        inputs: [{
                            name: "Coins",
                            type: "number",
                        }, ],
                        run: function(coins) {

                            (() => {

                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                window.prompt = iframe.contentWindow.prompt.bind(window);
                                iframe.remove();

                                function withScene(callback) {
                                    if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
                                        callback(window._SCENE);
                                        return;
                                    }
                                    let found = false;
                                    const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
                                    window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
                                        originalUpdate.call(this, time, delta);
                                        if (found) return;
                                        for (const scene of this.scenes) {
                                            if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                                                window._SCENE = scene;
                                                found = true;
                                                window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                                                callback(scene);
                                                return;
                                            }
                                        }
                                    };
                                }

                                withScene((scene) => {
                                    const manager = scene.gameManager;

                                    if (!manager) {
                                        alert("❌ Game Manager not found! (Wait for game to load)");
                                        return;
                                    }

                                    const current = manager.coins;
                                    const input = coins;

                                    if (input !== null) {
                                        const amount = parseInt(input);
                                        if (!isNaN(amount)) {
                                            manager.coins = amount;

                                            alert(`✅ Coins set to ${amount}!\n\nNote: Buy something to update the display counter.`);
                                        }
                                    }
                                });
                            })();


                        },
                    },
                    {
                        name: "Set Health",
                        description: "Sets the amount of health you have",
                        inputs: [{
                            name: "Health",
                            type: "number",
                        }, ],
                        run: function(health) {
                            (() => {

                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                window.prompt = iframe.contentWindow.prompt.bind(window);
                                iframe.remove();

                                function withScene(callback) {
                                    if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
                                        callback(window._SCENE);
                                        return;
                                    }
                                    let found = false;
                                    const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
                                    window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
                                        originalUpdate.call(this, time, delta);
                                        if (found) return;
                                        for (const scene of this.scenes) {
                                            if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                                                window._SCENE = scene;
                                                found = true;
                                                window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                                                callback(scene);
                                                return;
                                            }
                                        }
                                    };
                                }

                                withScene((scene) => {
                                    const manager = scene.gameManager;

                                    if (!manager) {
                                        alert("❌ Game Manager not found!");
                                        return;
                                    }

                                    let healthTarget = manager;
                                    if (manager.health === undefined && scene.gameData && scene.gameData.health !== undefined) {
                                        healthTarget = scene.gameData;
                                    }

                                    const current = healthTarget.health;
                                    const input = health;

                                    if (input !== null) {
                                        const amount = parseInt(input);
                                        if (!isNaN(amount)) {
                                            healthTarget.health = amount;

                                            alert(`✅ Health set to ${amount}!\n\nNote: only changes the health that it shows if you take any damage.`);
                                        }
                                    }
                                });
                            })();
                        },
                    },
                    {
                        name: "Set Round",
                        description: "Sets the current round",
                        inputs: [{
                            name: "Round",
                            type: "number",
                        }, ],
                        run: function(round) {
                            (() => {

                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                window.prompt = iframe.contentWindow.prompt.bind(window);
                                iframe.remove();

                                function withScene(callback) {
                                    if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
                                        callback(window._SCENE);
                                        return;
                                    }
                                    let found = false;
                                    const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
                                    window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
                                        originalUpdate.call(this, time, delta);
                                        if (found) return;
                                        for (const scene of this.scenes) {
                                            if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                                                window._SCENE = scene;
                                                found = true;
                                                window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                                                callback(scene);
                                                return;
                                            }
                                        }
                                    };
                                }

                                withScene((scene) => {
                                    const enemyService = scene.enemyService;

                                    if (!enemyService) {
                                        alert("❌ Enemy Service not found! (Wait for game to load)");
                                        return;
                                    }

                                    const current = enemyService.waveNum;
                                    const input = round;

                                    if (input !== null) {
                                        const amount = parseInt(input);
                                        if (!isNaN(amount)) {

                                            enemyService.waveNum = amount;

                                            alert(`✅ Round/Wave set to ${amount}!\n\nNote: You must finish the current wave for the game to jump to the new round.`);

                                            if (enemyService.isWaveActive === false) {

                                                if (scene.hud && scene.hud.updateWave) scene.hud.updateWave();
                                            }
                                        }
                                    }
                                });
                            })();


                        },
                    },
                ],
            },
            brawl: {
                img: "https://media.blooket.com/image/upload/v1663366470/Media/logos/Monster_Brawl_270x156_1.png",
                name: "Monster Brawl",
                cheats: [{
                        name: "Double Enemy XP",
                        description: "Doubles enemy XP drop value",
                        run: function() {
                            (() => {
                                console.log("💎 Double Enemy XP - Continuous Mode\n");

                                if (!window.Phaser) {
                                    alert("Phaser not found!");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                let totalModified = 0;
                                window._processedEnemies = window._processedEnemies || new Set();

                                if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHooked) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._groups) window._groups = new Set();
                                            window._groups.add(this);
                                            return originalUpdate?.apply(this, args);
                                        };
                                        console.log("✓ Group hook installed");
                                        window._groupHooked = true;
                                    }
                                }

                                const monitor = setInterval(() => {
                                    if (!window._groups) return;

                                    window._groups.forEach(group => {
                                        if (!group.children?.entries) return;

                                        group.children.entries.forEach(enemy => {

                                            if (window._processedEnemies.has(enemy)) return;

                                            if (enemy.val !== undefined && enemy.val !== null) {
                                                const oldVal = enemy.val;
                                                enemy.val *= 2;
                                                window._processedEnemies.add(enemy);
                                                totalModified++;

                                                if (totalModified <= 10) {
                                                    console.log(`✓ Doubled enemy: ${oldVal} → ${enemy.val}`);
                                                }
                                            }
                                        });
                                    });

                                }, 5);

                                setTimeout(() => {
                                    console.log("\n=== STATUS ===");
                                    console.log(`Enemies modified: ${totalModified}`);

                                    if (totalModified > 0) {
                                        console.log("\n✅ DOUBLE XP ACTIVE!");
                                        alert(`✅ Double Enemy XP Activated!\n\n${totalModified} enemies modified!\n\n🔄 Continuous monitoring: New enemies auto-doubled every 5ms`);
                                    }

                                    console.log("\n🔄 Continuous monitoring active (every 5ms)");
                                }, 2000);

                                console.log("⏳ Monitoring started...");
                                console.log("Play the game normally!");

                                window._xpMonitor = monitor;
                            })();


                        },
                    },
                    {
                        name: "Half Enemy Speed",
                        description: "Makes enemies move 2x slower",
                        run: function() {
                            (() => {
                                console.log("🐌 Half Enemy Speed - Continuous Mode\n");

                                if (!window.Phaser) {
                                    alert("Phaser not found!");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                let totalSlowed = 0;
                                window._processedSpeeds = window._processedSpeeds || new Set();

                                if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHookedSpeed) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._groups) window._groups = new Set();
                                            window._groups.add(this);
                                            return originalUpdate?.apply(this, args);
                                        };
                                        console.log("✓ Group hook installed");
                                        window._groupHookedSpeed = true;
                                    }
                                }

                                const monitor = setInterval(() => {
                                    if (!window._groups) return;

                                    window._groups.forEach(group => {
                                        if (!group.children?.entries) return;

                                        group.children.entries.forEach(enemy => {

                                            if (window._processedSpeeds.has(enemy)) return;

                                            if (enemy.speed !== undefined && enemy.speed !== null) {
                                                const oldSpeed = enemy.speed;
                                                enemy.speed *= 0.5;
                                                window._processedSpeeds.add(enemy);
                                                totalSlowed++;

                                                if (totalSlowed <= 10) {
                                                    console.log(`✓ Slowed enemy: ${oldSpeed} → ${enemy.speed}`);
                                                }
                                            }
                                        });
                                    });

                                }, 5);

                                setTimeout(() => {
                                    console.log("\n=== STATUS ===");
                                    console.log(`Enemies slowed: ${totalSlowed}`);

                                    if (totalSlowed > 0) {
                                        console.log("\n✅ HALF SPEED ACTIVE!");
                                        alert(`✅ Half Enemy Speed Activated!\n\n${totalSlowed} enemies slowed!\n\n🔄 Continuous monitoring: New enemies auto-slowed every 5ms`);
                                    }

                                    console.log("\n🔄 Continuous monitoring active (every 5ms)");
                                }, 2000);

                                console.log("⏳ Monitoring started...");
                                console.log("Play the game normally!");

                                window._speedMonitor = monitor;
                            })();


                        },
                    },
                    {
                        name: "Instant Kill",
                        description: "Sets all enemies health to 1",
                        run: function() {
                            (() => {
                                console.log("⚡ Instant Kill - Continuous Mode\n");

                                if (!window.Phaser) {
                                    alert("❌ Phaser not found! Make sure you're in Monster Brawl.");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                let totalModified = 0;
                                window._processedInstantKill = window._processedInstantKill || new Set();

                                if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHookedInstantKill) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._groups) window._groups = new Set();
                                            window._groups.add(this);
                                            return originalUpdate?.apply(this, args);
                                        };
                                        console.log("✓ Group hook installed");
                                        window._groupHookedInstantKill = true;
                                    }
                                }

                                if (window.Phaser.GameObjects?.GameObjectFactory?.prototype?.existing && !window._factoryHookedInstantKill) {
                                    const originalExisting = window.Phaser.GameObjects.GameObjectFactory.prototype.existing;

                                    window.Phaser.GameObjects.GameObjectFactory.prototype.existing = function(gameObject) {
                                        const result = originalExisting.apply(this, arguments);

                                        if (result && result.hp !== undefined && !window._processedInstantKill.has(result)) {
                                            result.hp = 1;
                                            window._processedInstantKill.add(result);
                                            console.log(`✓ Auto-set new enemy HP to 1`);
                                        }

                                        return result;
                                    };
                                    console.log("✓ GameObjectFactory.existing hooked");
                                    window._factoryHookedInstantKill = true;
                                }

                                const monitor = setInterval(() => {
                                    if (!window._groups) return;

                                    window._groups.forEach(group => {
                                        if (!group.children?.entries) return;

                                        group.children.entries.forEach(enemy => {

                                            if (window._processedInstantKill.has(enemy)) return;

                                            if (enemy.hp !== undefined && enemy.hp !== null) {
                                                const oldHp = enemy.hp;
                                                enemy.hp = 1;
                                                window._processedInstantKill.add(enemy);
                                                totalModified++;

                                                if (totalModified <= 10) {
                                                    console.log(`✓ Enemy HP: ${oldHp} → 1`);
                                                }
                                            }
                                        });

                                        if (group.classType?.prototype && !group.classType.prototype._instantKillHooked) {
                                            const methods = ['start', 'init', 'create'];

                                            methods.forEach(method => {
                                                if (group.classType.prototype[method]) {
                                                    const original = group.classType.prototype[method];

                                                    group.classType.prototype[method] = function(...args) {
                                                        const result = original.apply(this, args);

                                                        if (this.hp !== undefined) {
                                                            this.hp = 1;
                                                        }

                                                        return result;
                                                    };
                                                }
                                            });

                                            group.classType.prototype._instantKillHooked = true;
                                        }
                                    });

                                }, 5);

                                setTimeout(() => {
                                    console.log("\n=== STATUS ===");
                                    console.log(`Enemies modified: ${totalModified}`);

                                    if (totalModified > 0) {
                                        console.log("\n✅ INSTANT KILL ACTIVE!");
                                        alert(`✅ Instant Kill Activated!\n\n${totalModified} enemies now have 1 HP!\n\n🔄 Continuous monitoring: New enemies auto-modified every 5ms`);
                                    } else {
                                        console.log("\n⚠️ No enemies found yet");
                                        console.log("Play a bit and enemies will be modified automatically!");
                                    }

                                    console.log("\n🔄 Continuous monitoring active (every 5ms)");
                                    console.log("All enemies will die in one hit!");
                                }, 2000);

                                console.log("⏳ Monitoring started...");
                                console.log("Play the game normally!");

                                window._instantKillMonitor = monitor;
                            })();


                        },
                    },
                    {
                        name: "Invincibility",
                        description: "Makes you invincible",
                        run: function() {
                            (() => {
                                console.log("🎮 Blooket Brawl Invincibility - Continuous Mode\n");

                                if (!window.Phaser) {
                                    alert("Phaser not found!");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                let playerFound = false;
                                let collidersDisabled = 0;

                                const monitor = setInterval(() => {

                                    if (window.Phaser.GameObjects?.Sprite) {
                                        const originalUpdate = window.Phaser.GameObjects.Sprite.prototype.preUpdate;

                                        if (!window._invincibilityHooked) {
                                            window.Phaser.GameObjects.Sprite.prototype.preUpdate = function(time, delta) {
                                                if (!window._sprites) window._sprites = new Set();
                                                window._sprites.add(this);

                                                if (this.texture?.key?.includes('player') ||
                                                    this.texture?.key?.includes('blook') ||
                                                    this.name?.includes('player')) {

                                                    if (!window._player) {
                                                        console.log("✓✓✓ FOUND PLAYER!");
                                                        window._player = this;
                                                        playerFound = true;
                                                    }

                                                    if (this.setData) {
                                                        this.setData('invulnerable', true);
                                                        this.setData('invulnerableTime', Infinity);
                                                        this.setData('dmgCd', Infinity);
                                                    }
                                                }

                                                return originalUpdate?.apply(this, arguments);
                                            };

                                            window._invincibilityHooked = true;
                                            console.log("✓ Sprite hook installed");
                                        }
                                    }

                                    if (window.Phaser.Physics?.Arcade?.Body && !window._bodyHooked) {
                                        const originalUpdate = window.Phaser.Physics.Arcade.Body.prototype.preUpdate;

                                        window.Phaser.Physics.Arcade.Body.prototype.preUpdate = function() {
                                            if (this.gameObject?.texture?.key?.includes('player') ||
                                                this.gameObject?.texture?.key?.includes('blook')) {

                                                if (!window._playerBody) {
                                                    window._playerBody = this;
                                                }

                                                this.onCollide = false;
                                                this.onWorldBounds = false;
                                            }

                                            return originalUpdate?.apply(this, arguments);
                                        };

                                        window._bodyHooked = true;
                                        console.log("✓ Body hook installed");
                                    }

                                    if (window.Phaser.Physics?.Arcade?.World && !window._worldHooked) {
                                        const proto = window.Phaser.Physics.Arcade.World.prototype;

                                        if (proto.collideObjects) {
                                            const originalCollide = proto.collideObjects;

                                            proto.collideObjects = function(body1, body2, collideCallback, processCallback, callbackContext) {
                                                if (body1 === window._playerBody || body2 === window._playerBody) {
                                                    return false;
                                                }
                                                return originalCollide.apply(this, arguments);
                                            };
                                        }

                                        if (proto.separate) {
                                            const originalSeparate = proto.separate;

                                            proto.separate = function(body1, body2, processCallback, callbackContext, overlapOnly) {
                                                if (body1 === window._playerBody || body2 === window._playerBody) {
                                                    return false;
                                                }
                                                return originalSeparate.apply(this, arguments);
                                            };
                                        }

                                        window._worldHooked = true;
                                        console.log("✓ World collision hooks installed");
                                    }

                                }, 5);

                                setTimeout(() => {
                                    console.log("\n=== STATUS ===");
                                    console.log("Player found:", playerFound ? "✓" : "✗");

                                    if (playerFound) {
                                        console.log("\n✅ INVINCIBILITY ACTIVE!");
                                        alert("✅ Invincibility Activated!\n\nYou are now invincible!");

                                        console.log("\n🔄 Continuous monitoring active (every 5ms)");
                                        console.log("New enemies will be handled automatically!");
                                    }
                                }, 3000);

                                console.log("⏳ Monitoring started...");
                                console.log("Move around in the game!");

                                window._invincibilityMonitor = monitor;
                            })();


                        },
                    },
                    {
                        name: "Kill Enemies",
                        description: "Kills all current enemies",
                        run: function() {
                            (() => {
                                console.log("💀 Kill All Enemies - Starting...\n");

                                if (!window.Phaser) {
                                    alert("❌ Phaser not found! Make sure you're in Monster Brawl.");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                if (!window._groups || window._groups.size === 0) {
                                    console.log("⏳ Collecting groups first...");

                                    if (window.Phaser.GameObjects?.Group?.prototype) {
                                        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                            window.Phaser.GameObjects.Group.prototype.update;

                                        if (originalUpdate && !window._groupHookedKill) {
                                            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                                if (!window._groups) window._groups = new Set();
                                                window._groups.add(this);
                                                return originalUpdate?.apply(this, args);
                                            };
                                            window._groupHookedKill = true;
                                        }
                                    }

                                    setTimeout(killAllEnemies, 500);
                                } else {
                                    killAllEnemies();
                                }

                                function killAllEnemies() {
                                    console.log("\n=== KILLING ALL ENEMIES (WITH XP DROPS) ===\n");

                                    if (!window._groups || window._groups.size === 0) {
                                        alert("❌ No groups found! Play a bit first, then run this script again.");
                                        return;
                                    }

                                    let totalKilled = 0;
                                    let killedWithXP = 0;
                                    let totalAttempted = 0;

                                    const groups = Array.from(window._groups);
                                    console.log(`Checking ${groups.length} groups...\n`);

                                    groups.forEach((group, groupIndex) => {
                                        if (!group.children?.entries) return;

                                        const children = group.children.entries;
                                        if (children.length === 0) return;

                                        children.forEach((enemy, enemyIndex) => {

                                            const texture = enemy.texture?.key || "";
                                            if (texture.includes('player')) return;

                                            totalAttempted++;

                                            if (typeof enemy.receiveDamage === 'function' && enemy.hp !== undefined) {
                                                try {
                                                    const hp = enemy.hp || 9999;
                                                    enemy.receiveDamage(hp, 1);
                                                    totalKilled++;
                                                    killedWithXP++;

                                                    if (killedWithXP <= 5) {
                                                        console.log(`✓ Killed enemy (HP: ${hp}) - XP will drop`);
                                                    }
                                                    return;
                                                } catch (e) {
                                                    console.log(`  ⚠️ receiveDamage failed:`, e.message);
                                                }
                                            }

                                            if (enemy.hp !== undefined) {
                                                try {
                                                    const oldHp = enemy.hp;
                                                    enemy.hp = 0;

                                                    if (typeof enemy.die === 'function') {
                                                        enemy.die();
                                                        totalKilled++;
                                                        killedWithXP++;

                                                        if (killedWithXP <= 5) {
                                                            console.log(`✓ Killed via die() method`);
                                                        }
                                                        return;
                                                    } else if (typeof enemy.death === 'function') {
                                                        enemy.death();
                                                        totalKilled++;
                                                        killedWithXP++;

                                                        if (killedWithXP <= 5) {
                                                            console.log(`✓ Killed via death() method`);
                                                        }
                                                        return;
                                                    }
                                                } catch (e) {}
                                            }

                                            if (enemy.body) {
                                                try {

                                                    if (typeof enemy.receiveDamage === 'function') {
                                                        enemy.receiveDamage(99999, 1);
                                                        totalKilled++;
                                                        killedWithXP++;
                                                        return;
                                                    }
                                                } catch (e) {}
                                            }

                                            try {
                                                enemy.hp = 0;
                                                enemy.setVisible(false);
                                                enemy.setActive(false);

                                                if (enemy.emit) {
                                                    enemy.emit('death');
                                                    enemy.emit('killed');
                                                }

                                                totalKilled++;

                                                if (totalKilled <= 5) {
                                                    console.log(`✓ Disabled enemy (may not drop XP)`);
                                                }
                                            } catch (e) {}
                                        });
                                    });

                                    console.log("\n\n=== SUMMARY ===");
                                    console.log(`Enemies found: ${totalAttempted}`);
                                    console.log(`Enemies killed: ${totalKilled}`);
                                    console.log(`Killed with XP drops: ${killedWithXP}`);

                                    if (killedWithXP > 0) {
                                        console.log("\n✅ SUCCESS!");
                                        alert(`✅ Killed All Enemies!\n\n${killedWithXP} enemies eliminated!\n💎 XP should drop normally!`);
                                    } else if (totalKilled > 0) {
                                        console.log("\n⚠️ Killed enemies but XP drops not guaranteed");
                                        alert(`⚠️ Killed ${totalKilled} enemies!\n\nHowever, XP drops may not work properly.\nTry using Instant Kill for guaranteed one-hit kills with XP!`);
                                    } else {
                                        console.log("\n⚠️ No enemies found");
                                        alert("⚠️ No enemies found on screen!\nMake sure you're actively playing.");
                                    }
                                }

                            })();


                        },
                    },
                    {
                        name: "Magnet",
                        description: "Pulls all xp towards you",
                        run: function() {
                            (() => {
                                console.log("🧲 Permanent Magnet\n");

                                if (!window.Phaser) {
                                    alert("❌ Phaser not found!");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHooked) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._groups) window._groups = new Set();
                                            window._groups.add(this);
                                            return originalUpdate?.apply(this, args);
                                        };
                                        console.log("✓ Group hook installed");
                                        window._groupHooked = true;
                                    }
                                }

                                console.log("\n⏳ Waiting for scene...");

                                setTimeout(() => {
                                    if (!window._groups || window._groups.size === 0) {
                                        alert("❌ Scene not found! Make sure you're playing!");
                                        return;
                                    }

                                    const scene = Array.from(window._groups)[0].scene;

                                    if (!scene || !scene.playerService || !scene.playerService.player) {
                                        alert("❌ Player not found!");
                                        return;
                                    }

                                    const player = scene.playerService.player;

                                    console.log("\n🧲 Current magnetTime:", player.magnetTime);

                                    player.magnetTime = 999999;

                                    console.log("✅ New magnetTime:", player.magnetTime);
                                    console.log("\n🧲 Permanent magnet activated!");
                                    console.log("All drops will now be attracted to you!");

                                    alert("✅ Permanent Magnet!\n\n🧲 You now have a magnet effect for 999999 seconds!\n\nAll XP and items will be pulled to you automatically!");

                                }, 1000);

                            })();

                        },
                    },
                    {
                        name: "Make Abilities OP",
                        description: "Maxes out all your current abilities and makes them insanely powerful",
                        run: function() {
                            (() => {

                                const SIZE_MULTIPLIER = 5;

                                const CHECK_INTERVAL = 3000;

                                if (window._autoOpAbilitiesRunning) {
                                    alert("❌ Script is already running!");
                                    return;
                                }
                                window._autoOpAbilitiesRunning = true;

                                console.log(`💥 Auto OP Abilities (${SIZE_MULTIPLIER}x Size)\n`);
                                console.log("⏰ Checking every 3 seconds for new abilities...\n");

                                if (!window.Phaser) {
                                    alert("❌ Phaser not found!");
                                    return;
                                }

                                console.log("✓ Phaser", window.Phaser.VERSION);

                                window._processedAbilities = window._processedAbilities || new Set();
                                window._originalWidths = window._originalWidths || {};

                                if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHooked) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._groups) window._groups = new Set();
                                            window._groups.add(this);
                                            return originalUpdate?.apply(this, args);
                                        };
                                        console.log("✓ Group hook installed");
                                        window._groupHooked = true;
                                    }
                                }

                                let totalUnlocked = 0;
                                let totalModified = 0;

                                const processAbilities = () => {
                                    if (!window._groups || window._groups.size === 0) return;

                                    const scene = Array.from(window._groups)[0].scene;

                                    if (!scene || !scene.abilityService) return;

                                    Object.keys(scene.abilityService.abilityStats).forEach(ability => {

                                        if (window._processedAbilities.has(ability)) return;

                                        const stats = scene.abilityService.abilityStats[ability];

                                        console.log(`\n🆕 New ability detected: ${ability}`);

                                        if (stats.width !== undefined) {
                                            window._originalWidths[ability] = stats.width;
                                        }

                                        if (scene.abilityService.abilityLevels[ability] === undefined) {
                                            scene.abilityService.abilityLevels[ability] = 1;
                                            console.log(`  🔓 Unlocked!`);
                                            totalUnlocked++;
                                        }

                                        if (stats.dmg !== undefined) {
                                            stats.dmg = 9999;
                                        }

                                        if (stats.fireRate !== undefined) {
                                            stats.fireRate = 50;
                                        }

                                        if (stats.maxTargets !== undefined) {
                                            stats.maxTargets = 999;
                                        }

                                        if (stats.numProjectiles !== undefined) {
                                            stats.numProjectiles = 50;
                                        }

                                        if (stats.speed !== undefined) {
                                            stats.speed = 2000;
                                        }

                                        if (stats.lifespan !== undefined && stats.lifespan > 0) {
                                            stats.lifespan = 10000;
                                        }

                                        if (stats.knockback !== undefined) {
                                            stats.knockback = 5;
                                        }

                                        if (stats.width !== undefined && window._originalWidths[ability]) {
                                            const originalWidth = window._originalWidths[ability];
                                            stats.width = Math.round(originalWidth * SIZE_MULTIPLIER);
                                            console.log(`  📏 Size: ${originalWidth} → ${stats.width} (${SIZE_MULTIPLIER}x)`);
                                        }

                                        if (stats.intervalRate !== undefined) {
                                            stats.intervalRate = 10;
                                        }

                                        console.log(`  ✅ ${ability} is now OP!`);

                                        window._processedAbilities.add(ability);
                                        totalModified++;
                                    });
                                };

                                setTimeout(() => {
                                    console.log("\n🔍 Initial scan...");
                                    processAbilities();

                                    if (totalModified > 0) {
                                        console.log(`\n✅ Initial scan complete!`);
                                        console.log(`🔓 Unlocked: ${totalUnlocked}`);
                                        console.log(`💥 Modified: ${totalModified}`);
                                    }
                                }, 1000);

                                const monitor = setInterval(() => {
                                    processAbilities();
                                }, CHECK_INTERVAL);

                                window._autoOpMonitor = monitor;

                                console.log("\n✅ Auto OP script started!");
                                console.log(`⏰ Monitoring every ${CHECK_INTERVAL/1000} seconds`);
                                console.log(`📏 Size multiplier: ${SIZE_MULTIPLIER}x`);
                                console.log("\n💡 New abilities will be automatically made OP!");
                                console.log("💡 To stop: clearInterval(window._autoOpMonitor)");

                            })();


                        },
                    },
                    {
                        name: "Set XP",
                        description: "Sets your XP",
                        inputs: [{
                            name: "Amount",
                            type: "number"
                        }],
                        run: function(xp) {
                            (() => {
                                console.log("💎 Set XP\n");

                                if (window.Phaser?.GameObjects?.Group?.prototype && !window._xpSceneHook) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._scene && this.scene) {
                                                window._scene = this.scene;
                                                console.log("✓ Scene captured!");
                                            }
                                            return originalUpdate?.apply(this, args);
                                        };
                                        window._xpSceneHook = true;
                                    }
                                }

                                console.log("✓ Phaser hook installed");
                                console.log("⏳ Waiting for scene...");
                                console.log("\nMove around in the game to activate!");

                                let checkCount = 0;

                                const checkInterval = setInterval(() => {
                                    checkCount++;

                                    if (checkCount % 10 === 0) {
                                        console.log(`  Still waiting... (${checkCount / 2}s) - Move around!`);
                                    }

                                    if (window._scene?.gameManager) {
                                        clearInterval(checkInterval);

                                        const gm = window._scene.gameManager;

                                        console.log("\n✓✓✓ Scene found!");
                                        console.log("Current XP:", gm.totalXp);
                                        console.log("Current Level:", gm.level);
                                        console.log("Status:", gm.status);

                                        const newXp = xp;

                                        if (newXp !== null) {
                                            const xp = parseInt(newXp);

                                            if (isNaN(xp)) {
                                                alert("❌ Invalid number!");
                                                return;
                                            }

                                            gm.totalXp = xp;
                                            gm.curXp = xp;

                                            window._scene.eventBus.emit('xp-updated', xp);

                                            console.log("✅ XP set to:", xp);
                                            alert(`✅ XP Set!\n\nNew XP: ${xp}\nLevel: ${gm.level}`);
                                        } else {
                                            console.log("Cancelled");
                                        }
                                    }

                                }, 200);

                                setTimeout(() => {
                                    if (window._scene?.gameManager) return;

                                    clearInterval(checkInterval);
                                    console.log("\n❌ Timeout - scene not found after 60 seconds");
                                    alert("❌ Timeout!\n\nMove around in the game and try again.");
                                }, 60000);
                            })();

                        },
                    },
                    {
                        name: "Reset Health",
                        description: "Resets health and gives invincibility for 3 seconds",
                        run: function() {
                            (() => {
                                console.log("❤️ Reset Health\n");

                                if (window.Phaser?.GameObjects?.Group?.prototype && !window._healthHook) {
                                    const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate ||
                                        window.Phaser.GameObjects.Group.prototype.update;

                                    if (originalUpdate) {
                                        window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                                            if (!window._scene && this.scene) {
                                                window._scene = this.scene;
                                            }
                                            return originalUpdate?.apply(this, args);
                                        };
                                        window._healthHook = true;
                                    }
                                }

                                setTimeout(() => {
                                    if (!window._scene?.eventBus) {
                                        alert("❌ Scene not found! Move around and try again.");
                                        return;
                                    }

                                    try {

                                        const respawnEvent = window._scene.eventBus._events?.respawn;

                                        if (respawnEvent?.fn) {
                                            console.log("✓ Found respawn event");
                                            respawnEvent.fn();
                                            console.log("✅ Health reset!");
                                            alert("✅ Health Reset!\n\nYour health is now full!");
                                        } else if (respawnEvent && typeof respawnEvent === 'function') {
                                            respawnEvent();
                                            console.log("✅ Health reset!");
                                            alert("✅ Health Reset!\n\nYour health is now full!");
                                        } else {

                                            window._scene.eventBus.emit('respawn');
                                            console.log("✅ Respawn event emitted!");
                                            alert("✅ Health Reset!\n\nRespawn triggered!");
                                        }
                                    } catch (e) {
                                        console.log("❌ Error:", e);
                                        alert(`❌ Error: ${e.message}`);
                                    }

                                }, 1000);

                                console.log("⏳ Getting scene...");
                            })();


                        },
                    },
                ],
            },
            dino: {
               // img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Deceptive_Dinos_Logo_Resized.png",
                img: "data:image/png;base64,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",
                name: "Deceptive Dinos",
                cheats: [{
                        name: "Auto Choose",
                        description: "Automatically choose the best fossil when excavating",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        rand(e, t) {
                            const s = [];
                            while (s.length < t) {
                                const i = Math.random();
                                let r = 0,
                                    g = null;
                                for (let o = 0; o < e.length; o++) {
                                    r += e[o].rate;
                                    if (r >= i) {
                                        g = e[o];
                                        break;
                                    }
                                }
                                g && !s.includes(g) && s.push(g);
                            }
                            return s;
                        },
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    try {
                                        let stateNode = getStateNode();
                                        if (stateNode.state.stage === "excavate") {
                                            stateNode.state.choices.length ||
                                                (stateNode.state.choices = this.rand(
                                                    [{
                                                            type: "fossil",
                                                            val: 10,
                                                            rate: 0.1,
                                                            blook: "Amber"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 25,
                                                            rate: 0.1,
                                                            blook: "Dino Egg"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 50,
                                                            rate: 0.175,
                                                            blook: "Dino Fossil"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 75,
                                                            rate: 0.175,
                                                            blook: "Stegosaurus"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 100,
                                                            rate: 0.15,
                                                            blook: "Velociraptor"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 125,
                                                            rate: 0.125,
                                                            blook: "Brontosaurus"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 250,
                                                            rate: 0.075,
                                                            blook: "Triceratops"
                                                        },
                                                        {
                                                            type: "fossil",
                                                            val: 500,
                                                            rate: 0.025,
                                                            blook: "Tyrannosaurus Rex"
                                                        },
                                                        {
                                                            type: "mult",
                                                            val: 1.5,
                                                            rate: 0.05
                                                        },
                                                        {
                                                            type: "mult",
                                                            val: 2,
                                                            rate: 0.025
                                                        },
                                                    ],
                                                    3
                                                ));
                                            let max = 0,
                                                index = -1;
                                            for (let i = 0; i < stateNode.state.choices.length; i++) {
                                                const {
                                                    type,
                                                    val
                                                } = stateNode.state.choices[i];
                                                const value = (type == "fossil" ? stateNode.state.fossils + val * stateNode.state.fossilMult : stateNode.state.fossils * val) || 0;
                                                if (value <= max && type != "mult") continue;
                                                (max = value), (index = i + 1);
                                            }
                                            document.querySelector('div[class*=rockRow] > div[role="button"]:nth-child(' + index + ")").click();
                                        }
                                    } catch {}
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Rock ESP",
                        description: "Shows what is under the rocks",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: (() => {
                            function rand(e, t) {
                                const s = [];
                                while (s.length < t) {
                                    const i = Math.random();
                                    let r = 0;
                                    let g;
                                    for (let o = 0; o < e.length; o++) {
                                        r += e[o].rate;
                                        if (r >= i) {
                                            g = e[o];
                                            break;
                                        }
                                    }
                                    if (g && !s.includes(g)) s.push(g);
                                }
                                return s;
                            }
                            const exps = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
                            const getExpAscii = (num) => {
                                let res = "";
                                while (num > 0) {
                                    res = exps[num % 10] + res;
                                    num = ~~(num / 10);
                                }
                                return res;
                            };

                            function shortNum(value) {
                                let newValue = value.toString();
                                if (value >= 1000) {
                                    const suffixes = ["", "K", "M", "B", "T"];
                                    const suffixNum = Math.floor(Math.floor((Math.log(value) / Math.log(10)).toPrecision(14)) / 3);
                                    if (suffixNum < suffixes.length) {
                                        let shortValue = "";
                                        for (let precision = 3; precision >= 1; precision--) {
                                            shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)).toString();
                                            const dotLessShortValue = shortValue.replace(/[^a-zA-Z 0-9]+/g, "");
                                            if (dotLessShortValue.length <= 3) break;
                                        }
                                        if (Number(shortValue) % 1 != 0) shortValue = Number(shortValue).toFixed(1);
                                        newValue = shortValue + suffixes[suffixNum];
                                    } else {
                                        let num = value;
                                        let exp = 0;
                                        while (num >= 100) {
                                            num = Math.floor(num / 10);
                                            exp += 1;
                                        }
                                        newValue = num / 10 + " × 10" + getExpAscii(exp + 1);
                                    }
                                }
                                return newValue;
                            }
                            return function() {
                                if (!this.enabled) {
                                    this.enabled = true;
                                    this.data = setInterval(() => {
                                        let stateNode = getStateNode();
                                        const rocks = document.querySelector('[class*="rockButton"]').parentElement.children;

                                        if (!Array.prototype.every.call(rocks, (element) => element.querySelector("div")))
                                            stateNode.setState({
                                                    choices: rand(
                                                        [{
                                                                type: "fossil",
                                                                val: 10,
                                                                rate: 0.1,
                                                                blook: "Amber"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 25,
                                                                rate: 0.1,
                                                                blook: "Dino Egg"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 50,
                                                                rate: 0.175,
                                                                blook: "Dino Fossil"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 75,
                                                                rate: 0.175,
                                                                blook: "Stegosaurus"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 100,
                                                                rate: 0.15,
                                                                blook: "Velociraptor"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 125,
                                                                rate: 0.125,
                                                                blook: "Brontosaurus"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 250,
                                                                rate: 0.075,
                                                                blook: "Triceratops"
                                                            },
                                                            {
                                                                type: "fossil",
                                                                val: 500,
                                                                rate: 0.025,
                                                                blook: "Tyrannosaurus Rex"
                                                            },
                                                            {
                                                                type: "mult",
                                                                val: 1.5,
                                                                rate: 0.05
                                                            },
                                                            {
                                                                type: "mult",
                                                                val: 2,
                                                                rate: 0.025
                                                            },
                                                        ],
                                                        3
                                                    ),
                                                },
                                                () => {
                                                    Array.prototype.forEach.call(rocks, (element, index) => {
                                                        const rock = stateNode.state.choices[index];
                                                        if (element.querySelector("div")) element.querySelector("div").remove();
                                                        const choice = document.createElement("div");
                                                        choice.style.color = "white";
                                                        choice.style.fontFamily = "Macondo";
                                                        choice.style.fontSize = "1em";
                                                        choice.style.display = "flex";
                                                        choice.style.justifyContent = "center";
                                                        choice.style.transform = "translateY(25px)";
                                                        choice.innerText =
                                                            rock.type === "fossil" ?
                                                            `+${
                                                                      Math.round(rock.val * stateNode.state.fossilMult) > 99999999 ? shortNum(Math.round(rock.val * stateNode.state.fossilMult)) : Math.round(rock.val * stateNode.state.fossilMult)
                                                                  } Fossils` :
                                                            `x${rock.val} Fossils Per Excavation`;
                                                        element.append(choice);
                                                    });
                                                }
                                            );
                                    }, 50);
                                } else {
                                    this.enabled = false;
                                    clearInterval(this.data);
                                    this.data = null;
                                }
                            };
                        })(),
                    },
                    {
                        name: "Set Fossils",
                        description: "Sets the amount of fossils you have",
                        inputs: [{
                            name: "Fossils",
                            type: "number",
                        }, ],
                        run: function(fossils) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                fossils
                            });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/f`,
                                val: fossils,
                            });
                        },
                    },
                    {
                        name: "Set Multiplier",
                        description: "Sets fossil multiplier",
                        inputs: [{
                            name: "Multiplier",
                            type: "number",
                        }, ],
                        run: function(fossilMult) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                fossilMult
                            });
                        },
                    },
                    {
                        name: "Stop Cheating",
                        description: "Undoes cheating so that you can't be caught",
                        run: function() {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                isCheating: false
                            });
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/ic`,
                                val: false,
                            });
                        },
                    },
                ],
            },
            royale: {
               // img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Battle_Royale_Logo_Resized.png",
                img: "data:image/png;base64,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",
                name: "Battle Royale",
                cheats: [{
                        name: "Auto Answer (Toggle)",
                        description: "Toggles auto answer on",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(() => {
                                    let stateNode = getStateNode();
                                    stateNode?.onAnswer?.(true, stateNode.props.client.question.correctAnswers[0]);
                                }, 50);
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Auto Answer",
                        description: "Chooses the correct answer for you",
                        run: function() {
                            let stateNode = getStateNode();
                            stateNode?.onAnswer?.(true, stateNode.props.client.question.correctAnswers[0]);
                        },
                    },
                ],
            },
            defense: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Tower_Defense_Logo_Resized.png",
                name: "Tower Defense",
                cheats: [{
                        name: "Max Tower Stats",
                        description: "Makes all placed towers overpowered",
                        run: function() {
                            (() => {
                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                iframe.remove();

                                function searchDOM(element = document.body, depth = 0) {
                                    if (depth > 5) return null;
                                    const keys = Object.keys(element);
                                    const reactKey = keys.find(k => k.includes('react'));
                                    if (reactKey) {
                                        try {
                                            let fiber = element[reactKey];
                                            while (fiber) {
                                                const node = fiber.stateNode || (fiber._owner ? fiber._owner.stateNode : null);

                                                if (node) {

                                                    if (node.towers && Array.isArray(node.towers)) return node;

                                                    if (node.state && node.state.round !== undefined) return node;
                                                }
                                                fiber = fiber.return;
                                            }
                                        } catch (e) {}
                                    }
                                    for (const child of element.children) {
                                        const result = searchDOM(child, depth + 1);
                                        if (result) return result;
                                    }
                                    return null;
                                }

                                const comp = searchDOM();

                                if (!comp) {
                                    alert("❌ Component not found!");
                                    return;
                                }

                                if (!comp.towers || comp.towers.length === 0) {
                                    alert("⚠️ No towers found! Place a tower first.");
                                    return;
                                }

                                console.log("Found Towers:", comp.towers);

                                comp.towers.forEach(tower => {
                                    tower.range = 100;
                                    tower.cd = 0;
                                    tower.damage = 1000000;

                                    if (tower.stats) {
                                        tower.stats.damage = 1000000;
                                        tower.stats.range = 100;
                                        tower.stats.fireRate = 0.01;
                                    }
                                });

                                alert(`✅ Upgraded ${comp.towers.length} towers!`);

                                if (comp.forceUpdate) comp.forceUpdate();

                            })();


                        },
                    },
                    {
                        name: "Remove Enemies",
                        description: "Removes all the enemies",
                        run: function() {
                            (() => {

                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                iframe.remove();

                                function searchDOM(element = document.body, depth = 0) {
                                    if (depth > 5) return null;
                                    const keys = Object.keys(element);
                                    const reactKey = keys.find(k => k.includes('react'));
                                    if (reactKey) {
                                        try {
                                            let fiber = element[reactKey];
                                            while (fiber) {
                                                const node = fiber.stateNode || (fiber._owner ? fiber._owner.stateNode : null);

                                                if (node) {

                                                    if (node.enemies && Array.isArray(node.enemies)) return node;

                                                    if (node.state && node.state.enemies) return node;
                                                }
                                                fiber = fiber.return;
                                            }
                                        } catch (e) {}
                                    }
                                    for (const child of element.children) {
                                        const result = searchDOM(child, depth + 1);
                                        if (result) return result;
                                    }
                                    return null;
                                }

                                const comp = searchDOM();

                                if (!comp) {
                                    alert("❌ Component not found! Make sure you are in-game.");
                                    return;
                                }

                                if (comp.enemies) {
                                    const count = comp.enemies.length;
                                    comp.enemies = [];

                                    comp.futureEnemies = [];

                                    if (comp.state && comp.state.enemies) {
                                        comp.setState({
                                            enemies: [],
                                            futureEnemies: []
                                        });
                                    }

                                    alert(`✅ Removed ${count} enemies and cleared the wave!`);
                                } else {
                                    alert("⚠️ No enemies found to remove.");
                                }

                            })();


                        },
                    },
                    {
                        name: "Remove Obstacles",
                        description: "Lets you place towers anywhere",
                        run: function() {
                            (() => {

                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.alert = iframe.contentWindow.alert.bind(window);
                                iframe.remove();

                                function searchDOM(element = document.body, depth = 0) {
                                    if (depth > 5) return null;
                                    const keys = Object.keys(element);
                                    const reactKey = keys.find(k => k.includes('react'));
                                    if (reactKey) {
                                        try {
                                            let fiber = element[reactKey];
                                            while (fiber) {
                                                const node = fiber.stateNode || (fiber._owner ? fiber._owner.stateNode : null);

                                                if (node) {

                                                    if (node.tiles && Array.isArray(node.tiles)) return node;
                                                }
                                                fiber = fiber.return;
                                            }
                                        } catch (e) {}
                                    }
                                    for (const child of element.children) {
                                        const result = searchDOM(child, depth + 1);
                                        if (result) return result;
                                    }
                                    return null;
                                }

                                const comp = searchDOM();

                                if (!comp) {
                                    alert("❌ Component not found! Make sure you are in-game.");
                                    return;
                                }

                                if (comp.tiles && comp.tiles.length > 0) {

                                    comp.tiles = comp.tiles.map(row => {
                                        if (Array.isArray(row)) {

                                            return new Array(row.length).fill(0);
                                        }
                                        return row;
                                    });

                                    if (comp.forceUpdate) comp.forceUpdate();

                                    alert("✅ All obstacles removed! You can now place towers anywhere.");
                                } else {
                                    alert("⚠️ No map tiles found.");
                                }

                            })();


                        },
                    },
                    {
                        name: "Set Damage",
                        description: "Sets damage",
                        inputs: [{
                            name: "Damage",
                            type: "number",
                        }, ],
                        run: function(dmg) {
                            (() => {
                                function getComp(element = document.body, depth = 0) {
                                    if (depth > 20) return null;
                                    const fiber = element[Object.keys(element).find(k => k.includes('react'))];
                                    if (fiber) {
                                        let curr = fiber;
                                        while (curr) {
                                            const sn = curr.stateNode || curr._owner?.stateNode;
                                            if (sn?.state?.totalDamage !== undefined) return sn;
                                            curr = curr.return;
                                        }
                                    }
                                    for (const child of element.children) {
                                        const result = getComp(child, depth + 1);
                                        if (result) return result;
                                    }
                                }

                                const sn = getComp();
                                if (!sn) return;

                                sn.setState({
                                    totalDamage: Number(dmg)
                                });
                            })();
                        }
                    },
                    {
                        name: "Set Round",
                        description: "Sets the current round",
                        inputs: [{
                            name: "Round",
                            type: "number",
                        }, ],
                        run: function(round) {
                            (() => {
                                let iframe = document.createElement('iframe');
                                document.body.append(iframe);
                                window.prompt = iframe.contentWindow.prompt.bind(window);
                                iframe.remove();

                                function searchDOM(element = document.body, depth = 0) {
                                    if (depth > 5) return null;
                                    const keys = Object.keys(element);
                                    const reactKey = keys.find(k => k.includes('react'));
                                    if (reactKey) {
                                        try {
                                            let fiber = element[reactKey];
                                            while (fiber) {
                                                if (fiber._owner && fiber._owner.stateNode && fiber._owner.stateNode.state) {
                                                    const state = fiber._owner.stateNode.state;
                                                    if (state.round !== undefined) return fiber._owner.stateNode;
                                                }
                                                if (fiber.stateNode && fiber.stateNode.state) {
                                                    const state = fiber.stateNode.state;
                                                    if (state.round !== undefined) return fiber.stateNode;
                                                }
                                                fiber = fiber.return;
                                            }
                                        } catch (e) {}
                                    }
                                    for (const child of element.children) {
                                        const result = searchDOM(child, depth + 1);
                                        if (result) return result;
                                    }
                                    return null;
                                }

                                const comp = searchDOM();
                                if (!comp) {
                                    alert("❌ Component not found!");
                                    return;
                                }

                                comp.setState({
                                    round
                                });
                                alert(`✅ Round set to ${round}!`);
                            })();


                        },
                    },
                    {
                        name: "Set Tokens",
                        description: "Sets the amount of tokens you have",
                        inputs: [{
                            name: "Tokens",
                            type: "number",
                        }, ],
                        run: function(tokens) {
                            (() => {
                                function getComp(element = document.body, depth = 0) {
                                    if (depth > 20) return null;

                                    const fiber = element[Object.keys(element).find(k => k.includes('react'))];
                                    if (fiber) {
                                        let curr = fiber;
                                        while (curr) {
                                            const sn = curr.stateNode || curr._owner?.stateNode;
                                            if (sn?.state?.tokens !== undefined) return sn;
                                            curr = curr.return;
                                        }
                                    }

                                    for (const child of element.children) {
                                        const result = getComp(child, depth + 1);
                                        if (result) return result;
                                    }
                                }

                                const sn = getComp();
                                if (!sn) return;

                                sn.setState({
                                    tokens: Number(tokens)
                                });
                            })();
                        }
                    },
                ],
            },
            cafe: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Cafe_Logo_Resized.png",
                name: "Café",
                cheats: [{
                        name: "Max Items",
                        description: "Maxes out items in the shop (solo only)",
                        run: function() {
                            (() => {

                                let iframe = document.querySelector("iframe");
                                if (!iframe) {
                                    iframe = document.createElement("iframe");
                                    iframe.style.display = "none";
                                    document.body.append(iframe);
                                }
                                const alert = iframe.contentWindow.alert.bind(window);

                                const cheat = () => {
                                    const root = document.querySelector('#app') || document.body;
                                    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));

                                    if (!rKey) return alert("❌ React Root not found. Please reload.");

                                    let success = false;

                                    function traverse(node) {
                                        if (success || !node) return;

                                        if (node.memoizedState) {
                                            let hook = node.memoizedState;
                                            let index = 0;
                                            let levelHook = null;

                                            while (hook) {
                                                if (index === 4) {
                                                    levelHook = hook;
                                                    break;
                                                }
                                                hook = hook.next;
                                                index++;
                                            }

                                            if (levelHook) {
                                                const val = levelHook.memoizedState;
                                                if (val && typeof val === 'object' && !Array.isArray(val) && val.Toast !== undefined) {

                                                    const newLevels = {
                                                        ...val
                                                    };
                                                    Object.keys(newLevels).forEach(key => {
                                                        if (typeof newLevels[key] === 'number') {
                                                            newLevels[key] = 5;

                                                        }
                                                    });

                                                    if (levelHook.queue && levelHook.queue.dispatch) {
                                                        levelHook.queue.dispatch(newLevels);
                                                        success = true;
                                                        alert("✅ All items upgraded to Level 5!");
                                                    }
                                                }
                                            }
                                        }
                                        traverse(node.child);
                                        traverse(node.sibling);
                                    }

                                    traverse(root[rKey]);

                                    if (!success) alert("❌ Cheat failed. Make sure you are in the game.");
                                };

                                cheat();

                            })();


                        },
                    },
                    {
                        name: "Set Cash",
                        description: "Sets cafe cash (only works in solo)",
                        inputs: [{
                            name: "Amount",
                            type: "number",
                        }, ],
                        run: function(cafeCash) {
                            (() => {

                                const iframe = document.createElement('iframe');
                                document.body.appendChild(iframe);
                                const prompt = iframe.contentWindow.prompt;

                                const amountStr = prompt("💸 ENTER DESIRED CASH AMOUNT:", "1000000");
                                document.body.removeChild(iframe);

                                if (!amountStr) return;

                                const newAmount = cafeCash;

                                if (isNaN(newAmount)) {
                                    alert("❌ Invalid number entered.");
                                    return;
                                }

                                console.clear();
                                console.log(`%c☕ APPLYING CASH HACK: $${newAmount.toLocaleString()}`, "color: #ff9900; font-weight: bold; font-size: 1.2em;");

                                function findCashDispatcher() {
                                    const root = document.querySelector('#app') || document.body;
                                    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
                                    if (!rKey) return null;

                                    let result = null;

                                    function traverse(node) {
                                        if (result || !node) return;

                                        if (node.memoizedState) {
                                            let hook = node.memoizedState;
                                            let depth = 0;

                                            while (hook) {
                                                const val = hook.memoizedState;

                                                if (typeof val === 'number' && hook.queue && hook.queue.dispatch) {

                                                    if (depth > 5) {

                                                        if (!result) result = [];
                                                        result.push(hook.queue.dispatch);
                                                    }
                                                }
                                                hook = hook.next;
                                                depth++;
                                            }
                                        }
                                        traverse(node.child);
                                        traverse(node.sibling);
                                    }

                                    traverse(root[rKey]);
                                    return result;
                                }

                                function setCashByStructure() {
                                    const root = document.querySelector('#app') || document.body;
                                    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));

                                    let found = false;

                                    function traverse(node) {
                                        if (found || !node) return;

                                        if (node.memoizedState) {

                                            let h = node.memoizedState;
                                            try {

                                                for (let i = 0; i < 8; i++) {
                                                    if (h) h = h.next;
                                                }

                                                if (h && h.memoizedState !== undefined && typeof h.memoizedState === 'number') {

                                                    let count = 0;
                                                    let temp = node.memoizedState;
                                                    while (temp) {
                                                        count++;
                                                        temp = temp.next;
                                                    }

                                                    if (count > 10 && h.queue && h.queue.dispatch) {
                                                        console.log(`%c⚡ Found candidate Hook (Value: ${h.memoizedState})`, "color: #00ff00");
                                                        h.queue.dispatch(newAmount);
                                                        found = true;
                                                    }
                                                }
                                            } catch (e) {}
                                        }
                                        traverse(node.child);
                                        traverse(node.sibling);
                                    }

                                    if (rKey) traverse(root[rKey]);
                                    return found;
                                }

                                const success = setCashByStructure();

                                if (success) {
                                    console.log("%c✅ SUCCESS: Money Updated!", "background: green; color: white; padding: 5px; font-size: 1.2em");
                                    alert(`💰 Cash set to ${newAmount.toLocaleString()}!\n\n(If it doesn't show immediately, buy something cheap to refresh)`);
                                } else {
                                    console.log("❌ Could not pinpoint the exact hook automatically.");
                                    console.log("⚠️ Fallback: Trying to set ALL deep numeric states...");

                                    const dispatchers = findCashDispatcher();
                                    if (dispatchers && dispatchers.length > 0) {
                                        dispatchers.forEach(d => d(newAmount));
                                        alert("⚠️ Brute-force update sent. Check your cash.");
                                    } else {
                                        alert("❌ Failed to find game state. Are you in the Café game?");
                                    }
                                }
                            })();


                        },
                    },
                    {
                        name: "Stock Food",
                        description: "Stocks all food to 99 (Not usable in the shop) (Solo only)",
                        run: function() {
                            (() => {
                                const root = document.querySelector('#app') || document.body;
                                const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
                                if (!rKey) return;

                                let success = false;

                                function traverse(node) {
                                    if (success || !node) return;

                                    if (node.memoizedState) {
                                        let hook = node.memoizedState;
                                        let index = 0;
                                        let hook4 = null;

                                        let hook5 = null;

                                        while (hook) {
                                            if (index === 4) hook4 = hook;
                                            if (index === 5) hook5 = hook;
                                            if (index > 5) break;
                                            hook = hook.next;
                                            index++;
                                        }

                                        if (hook4 && hook5) {
                                            const val4 = hook4.memoizedState;
                                            const val5 = hook5.memoizedState;

                                            if (val4 && val5 && typeof val4 === 'object' && typeof val5 === 'object' && val4.Toast !== undefined) {

                                                const newLevels = {
                                                    ...val4
                                                };
                                                Object.keys(newLevels).forEach(key => {
                                                    if (typeof newLevels[key] === 'number') newLevels[key] = 5;
                                                });

                                                const newStock = {
                                                    ...val5
                                                };
                                                Object.keys(newStock).forEach(key => {
                                                    if (typeof newStock[key] === 'number') newStock[key] = 999;
                                                });

                                                hook4.queue.dispatch(newLevels);
                                                hook5.queue.dispatch(newStock);

                                                success = true;
                                            }
                                        }
                                    }
                                    traverse(node.child);
                                    traverse(node.sibling);
                                }

                                traverse(root[rKey]);
                            })();


                        },
                    }, {
                        name: "Make Customers OP",
                        description: "Makes all customers pay a LOT (only works in solo)",
                        run: function() {
                            (() => {

                                if (window.opCustomerInterval) {
                                    clearInterval(window.opCustomerInterval);
                                    console.log("%c[makeCustomersOP] Restarting loop...", "color: orange");
                                }

                                const OP_VALUE = 99999999999999;

                                function scanAndModify() {
                                    const root = document.querySelector('#app') || document.body;
                                    const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
                                    if (!rKey) return;

                                    let totalModified = 0;

                                    function traverse(node) {
                                        if (!node) return;

                                        if (node.memoizedState && typeof node.type === 'function') {
                                            let hook = node.memoizedState;
                                            while (hook) {
                                                const data = hook.memoizedState;

                                                if (data instanceof Map && data.size > 0) {
                                                    data.forEach((val) => {

                                                        if (val && typeof val === 'object' && val.order && typeof val.order.value === 'number') {

                                                            if (val.order.value !== OP_VALUE) {
                                                                val.order.value = OP_VALUE;
                                                                totalModified++;
                                                            }
                                                        }
                                                    });
                                                }
                                                hook = hook.next;
                                            }
                                        }

                                        traverse(node.child);
                                        traverse(node.sibling);
                                    }

                                    traverse(root[rKey]);

                                    if (totalModified > 0) {
                                        console.log(`%c[makeCustomersOP] Upgraded ${totalModified} new customers!`, 'color: #00ff00; font-weight: bold');
                                    }
                                }

                                console.clear();
                                console.log("%c[makeCustomersOP] Activated! New customers will be rich.", "color: #00ff00; font-size: 16px; font-weight: bold");

                                window.opCustomerInterval = setInterval(scanAndModify, 500);
                            })();


                        }
                    }, {
                        name: "Make Upgrades Cheap",
                        description: "Makes most upggrades cheap",
                        run: function() {

                            (() => {
                                console.clear();
                                console.log("%c💸 SETTING COST: 1 | PROFIT: 9e99", "color: #ff00ff; font-weight: bold;");

                                const root = document.querySelector('#app') || document.body;
                                const rKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
                                if (!rKey) return console.log("❌ React Root not found");

                                let success = false;

                                function traverse(node) {
                                    if (success || !node) return;

                                    if (node.memoizedState) {
                                        let hook = node.memoizedState;
                                        let index = 0;

                                        while(hook) {
                                            if (index === 1) {
                                                const val = hook.memoizedState;

                                                if (val && typeof val === 'object' && val.toast && val.toast.prices) {
                                                    const newDefs = { ...val };
                                                    const items = Object.keys(newDefs);

                                                    items.forEach(key => {
                                                        const item = newDefs[key];
                                                        if (item && item.prices && item.profits) {
                                                            const cheapPrices = new Array(item.prices.length).fill(1);
                                                            const insaneProfits = new Array(item.profits.length).fill(9e99);
                                                            insaneProfits[0] = 0; // Keep lvl 0 safe

                                                            newDefs[key] = {
                                                                ...item,
                                                                prices: cheapPrices,
                                                                profits: insaneProfits
                                                            };
                                                        }
                                                    });

                                                    if (hook.queue && hook.queue.dispatch) {
                                                        hook.queue.dispatch(newDefs);
                                                        success = true;
                                                        console.log("%c✅ DONE. Try upgrading now.", "color: #00ff00; font-weight: bold;");
                                                    }
                                                }
                                            }
                                            hook = hook.next;
                                            index++;
                                        }
                                    }
                                    traverse(node.child);
                                    traverse(node.sibling);
                                }

                                traverse(root[rKey]);

                                if (!success) console.log("❌ Failed to find definitions hook.");
                            })();
                        }
                    }
                ],
            },
            factory: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Factory_Logo_Resized.png",
                name: "Factory",
                cheats: [{
                        name: "Choose Blook",
                        description: "Gives you a blook",
                        inputs: [{
                            name: "Blook",
                            type: "options",
                            options: [{
                                    name: "Chick",
                                    color: "#ffcd05",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [3, 7, 65, 400, 2500],
                                    time: [1, 1, 1, 1, 1],
                                    price: [300, 3e3, 3e4, 2e5]
                                },
                                {
                                    name: "Chicken",
                                    color: "#ed1c24",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [10, 40, 200, 1400, 1e4],
                                    time: [5, 4, 3, 2, 1],
                                    price: [570, 4e3, 5e4, 8e5]
                                },
                                {
                                    name: "Cow",
                                    color: "#58595b",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [25, 75, 1500, 25e3, 25e4],
                                    time: [15, 10, 10, 10, 5],
                                    price: [500, 9500, 16e4, 4e6]
                                },
                                {
                                    name: "Duck",
                                    color: "#4ab96d",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [4, 24, 200, 3e3, 4e4],
                                    time: [3, 3, 3, 3, 3],
                                    price: [450, 4200, 7e4, 11e5]
                                },
                                {
                                    name: "Goat",
                                    color: "#c59a74",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [5, 28, 200, 1300, 12e3],
                                    time: [3, 3, 2, 2, 2],
                                    price: [500, 6400, 45e3, 5e5]
                                },
                                {
                                    name: "Horse",
                                    color: "#995b3c",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [5, 20, 270, 1800, 15e3],
                                    time: [2, 2, 2, 2, 2],
                                    price: [550, 8200, 65e3, 6e5]
                                },
                                {
                                    name: "Pig",
                                    color: "#f6a9cb",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [20, 50, 1300, 8e3, 8e4],
                                    time: [7, 7, 7, 7, 5],
                                    price: [400, 11e3, 8e4, 13e5]
                                },
                                {
                                    name: "Sheep",
                                    color: "#414042",
                                    class: "\uD83C\uDF3D",
                                    rarity: "Common",
                                    cash: [6, 25, 250, 1500, 11e3],
                                    time: [3, 3, 3, 2, 2],
                                    price: [500, 5e3, 5e4, 43e4]
                                },
                                {
                                    name: "Cat",
                                    color: "#f49849",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [5, 18, 170, 1700, 13e3],
                                    time: [2, 2, 2, 2, 2],
                                    price: [480, 5500, 6e4, 5e5]
                                },
                                {
                                    name: "Dog",
                                    color: "#995b3c",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [7, 25, 220, 1900, 9e3],
                                    time: [3, 3, 2, 2, 1],
                                    price: [460, 6600, 7e4, 73e4]
                                },
                                {
                                    name: "Goldfish",
                                    color: "#f18221",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [5, 40, 350, 3500, 35e3],
                                    time: [3, 3, 3, 3, 3],
                                    price: [750, 7200, 84e3, 95e4]
                                },
                                {
                                    name: "Rabbit",
                                    color: "#e7bf9a",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [3, 18, 185, 800, 7e3],
                                    time: [2, 2, 2, 1, 1],
                                    price: [500, 5800, 56e3, 55e4]
                                },
                                {
                                    name: "Hamster",
                                    color: "#ce9176",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [10, 45, 450, 4500, 45e3],
                                    time: [4, 4, 4, 4, 4],
                                    price: [650, 6500, 8e4, 93e4]
                                },
                                {
                                    name: "Turtle",
                                    color: "#619a3c",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [23, 120, 1400, 15e3, 17e4],
                                    time: [10, 10, 10, 10, 10],
                                    price: [700, 8500, 11e4, 13e5]
                                },
                                {
                                    name: "Puppy",
                                    color: "#414042",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [4, 10, 75, 500, 3e3],
                                    time: [1, 1, 1, 1, 1],
                                    price: [450, 4e3, 35e3, 25e4]
                                },
                                {
                                    name: "Kitten",
                                    color: "#58595b",
                                    class: "\uD83D\uDC3E",
                                    rarity: "Common",
                                    cash: [4, 8, 60, 400, 2e3],
                                    time: [1, 1, 1, 1, 1],
                                    price: [350, 3500, 26e3, 17e4]
                                },
                                {
                                    name: "Bear",
                                    color: "#995b3c",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [12, 70, 550, 4500, 1e5],
                                    time: [7, 7, 6, 5, 5],
                                    price: [550, 5500, 63e3, 16e5]
                                },
                                {
                                    name: "Moose",
                                    color: "#995b3c",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [8, 45, 400, 3500, 26e3],
                                    time: [5, 5, 4, 4, 3],
                                    price: [520, 6500, 58e3, 7e5]
                                },
                                {
                                    name: "Fox",
                                    color: "#f49849",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [7, 15, 80, 550, 3e3],
                                    time: [2, 2, 1, 1, 1],
                                    price: [400, 4e3, 36e3, 24e4]
                                },
                                {
                                    name: "Raccoon",
                                    color: "#6d6e71",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [5, 14, 185, 1900, 19e3],
                                    time: [2, 2, 2, 2, 2],
                                    price: [400, 5e3, 71e3, 8e5]
                                },
                                {
                                    name: "Squirrel",
                                    color: "#d25927",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [3, 10, 65, 470, 2600],
                                    time: [1, 1, 1, 1, 1],
                                    price: [420, 3600, 32e3, 21e4]
                                },
                                {
                                    name: "Owl",
                                    color: "#594a42",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [4, 17, 155, 1500, 15e3],
                                    time: [2, 2, 2, 2, 2],
                                    price: [500, 4800, 55e3, 58e4]
                                },
                                {
                                    name: "Hedgehog",
                                    color: "#3f312b",
                                    class: "\uD83C\uDF32",
                                    rarity: "Common",
                                    cash: [11, 37, 340, 2200, 3e4],
                                    time: [5, 4, 3, 2, 2],
                                    price: [540, 7e3, 77e3, 12e5]
                                },
                                {
                                    name: "Seal",
                                    color: "#7ca1d5",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [6, 17, 150, 1200, 13e3],
                                    time: [2, 2, 2, 2, 2],
                                    price: [480, 4500, 43e3, 52e4]
                                },
                                {
                                    name: "Arctic Fox",
                                    color: "#7ca1d5",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [5, 18, 180, 850, 8500],
                                    time: [2, 2, 2, 1, 1],
                                    price: [520, 550, 61e3, 68e4]
                                },
                                {
                                    name: "Snowy Owl",
                                    color: "#feda3f",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [5, 20, 190, 1900, 16e3],
                                    time: [3, 3, 2, 2, 2],
                                    price: [370, 5300, 76e3, 62e4]
                                },
                                {
                                    name: "Arctic Hare",
                                    color: "#7ca1d5",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [6, 19, 85, 900, 7e3],
                                    time: [2, 2, 1, 1, 1],
                                    price: [540, 5200, 66e3, 55e4]
                                },
                                {
                                    name: "Penguin",
                                    color: "#fb8640",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [4, 21, 310, 3200, 33e3],
                                    time: [3, 3, 3, 3, 3],
                                    price: [400, 6500, 76e3, 87e4]
                                },
                                {
                                    name: "Baby Penguin",
                                    color: "#414042",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [3, 8, 70, 450, 2700],
                                    time: [1, 1, 1, 1, 1],
                                    price: [420, 3300, 33e3, 23e4]
                                },
                                {
                                    name: "Polar Bear",
                                    color: "#7ca1d5",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [12, 75, 700, 6500, 85e3],
                                    time: [8, 7, 6, 5, 5],
                                    price: [630, 7e3, 91e3, 14e5]
                                },
                                {
                                    name: "Walrus",
                                    color: "#7d4f33",
                                    class: "❄️",
                                    rarity: "Common",
                                    cash: [11, 46, 420, 3700, 51e3],
                                    time: [5, 5, 4, 4, 4],
                                    price: [550, 6200, 68e3, 1e6]
                                },
                                {
                                    name: "Tiger",
                                    color: "#f18221",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [6, 20, 100, 975, 7500],
                                    time: [3, 3, 1, 1, 1],
                                    price: [390, 6e3, 7e4, 61e4]
                                },
                                {
                                    name: "Jaguar",
                                    color: "#fbb040",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [8, 28, 230, 1600, 17e3],
                                    time: [3, 3, 2, 2, 2],
                                    price: [390, 6e3, 7e4, 61e4]
                                },
                                {
                                    name: "Toucan",
                                    color: "#ffca34",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [9, 20, 175, 625, 3800],
                                    time: [2, 2, 2, 1, 1],
                                    price: [520, 4800, 42e3, 3e5]
                                },
                                {
                                    name: "Cockatoo",
                                    color: "#7ca1d5",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [6, 35, 160, 1700, 18e3],
                                    time: [4, 4, 2, 2, 2],
                                    price: [500, 5e3, 63e3, 7e5]
                                },
                                {
                                    name: "Macaw",
                                    color: "#00aeef",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [3, 8, 85, 850, 8500],
                                    time: [1, 1, 1, 1, 1],
                                    price: [480, 5400, 62e3, 63e4]
                                },
                                {
                                    name: "Parrot",
                                    color: "#ed1c24",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [3, 9, 90, 900, 9e3],
                                    time: [1, 1, 1, 1, 1],
                                    price: [540, 5700, 65e3, 69e4]
                                },
                                {
                                    name: "Panther",
                                    color: "#2f2c38",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [12, 28, 215, 2100, 21e3],
                                    time: [5, 3, 2, 2, 2],
                                    price: [530, 6500, 76e3, 87e4]
                                },
                                {
                                    name: "Anaconda",
                                    color: "#8a9143",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [3, 15, 85, 1500, 7600],
                                    time: [1, 2, 1, 2, 1],
                                    price: [410, 5100, 58e3, 59e4]
                                },
                                {
                                    name: "Orangutan",
                                    color: "#bc6234",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [13, 52, 570, 4300, 7e4],
                                    time: [5, 5, 5, 4, 4],
                                    price: [600, 7e3, 8e4, 14e5]
                                },
                                {
                                    name: "Capuchin",
                                    color: "#e0b0a6",
                                    class: "\uD83C\uDF34",
                                    rarity: "Common",
                                    cash: [4, 14, 160, 780, 8200],
                                    time: [2, 2, 2, 1, 1],
                                    price: [390, 4700, 57e3, 68e4]
                                },
                                {
                                    name: "Elf",
                                    color: "#a7d054",
                                    class: "⚔️",
                                    rarity: "Uncommon",
                                    cash: [5e3, 15e3, 15e4, 15e5, 1e7],
                                    time: [1, 1, 1, 1, 1],
                                    price: [8e5, 9e6, 11e7, 8e8]
                                },
                                {
                                    name: "Witch",
                                    color: "#4ab96d",
                                    class: "⚔️",
                                    rarity: "Uncommon",
                                    cash: [18e3, 6e4, 4e4, 4e6, 35e6],
                                    time: [3, 3, 2, 2, 2],
                                    price: [11e5, 12e6, 15e7, 14e8]
                                },
                                {
                                    name: "Wizard",
                                    color: "#5a459c",
                                    class: "⚔️",
                                    rarity: "Uncommon",
                                    cash: [19500, 65e3, 44e4, 46e5, 4e6],
                                    time: [3, 3, 2, 2, 2],
                                    price: [13e5, 135e5, 16e7, 16e8]
                                },
                                {
                                    name: "Fairy",
                                    color: "#df6d9c",
                                    class: "⚔️",
                                    rarity: "Uncommon",
                                    cash: [18500, 6e4, 62e4, 44e5, 38e6],
                                    time: [3, 3, 3, 2, 2],
                                    price: [12e5, 125e5, 15e6, 15e8]
                                },
                                {
                                    name: "Slime Monster",
                                    color: "#2fa04a",
                                    class: "⚔️",
                                    rarity: "Uncommon",
                                    cash: [35e3, 14e4, 1e6, 11e6, 11e7],
                                    time: [5, 5, 4, 4, 4],
                                    price: [16e5, 15e6, 2e8, 23e8]
                                },
                                {
                                    name: "Jester",
                                    color: "#be1e2d",
                                    class: "⚔️",
                                    rarity: "Rare",
                                    cash: [25e3, 1e5, 68e4, 65e5, 32e6],
                                    time: [3, 3, 2, 2, 1],
                                    price: [2e6, 21e6, 23e7, 26e8]
                                },
                                {
                                    name: "Dragon",
                                    color: "#2fa04a",
                                    class: "⚔️",
                                    rarity: "Rare",
                                    cash: [36e3, 15e4, 15e5, 15e6, 15e7],
                                    time: [4, 4, 4, 4, 4],
                                    price: [23e5, 24e6, 27e7, 3e9]
                                },
                                {
                                    name: "Unicorn",
                                    color: "#f6afce",
                                    class: "⚔️",
                                    rarity: "Epic",
                                    cash: [24e3, 15e4, 14e5, 7e6, 75e6],
                                    time: [2, 2, 2, 1, 1],
                                    price: [45e5, 45e6, 55e7, 65e8]
                                },
                                {
                                    name: "Queen",
                                    color: "#9e1f63",
                                    class: "⚔️",
                                    rarity: "Rare",
                                    cash: [24e3, 95e3, 95e4, 97e5, 95e6],
                                    time: [3, 3, 3, 3, 3],
                                    price: [19e5, 2e7, 23e7, 25e8]
                                },
                                {
                                    name: "King",
                                    color: "#ee2640",
                                    class: "⚔️",
                                    rarity: "Legendary",
                                    cash: [75e3, 4e5, 6e6, 9e7, 125e7],
                                    time: [5, 5, 5, 5, 5],
                                    price: [6e6, 95e6, 16e8, 25e9]
                                },
                                {
                                    name: "Two of Spades",
                                    color: "#414042",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Uncommon",
                                    cash: [4500, 14e3, 14e4, 14e5, 9e6],
                                    time: [1, 1, 1, 1, 1],
                                    price: [77e4, 83e5, 98e6, 71e7]
                                },
                                {
                                    name: "Eat Me",
                                    color: "#d58c55",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Uncommon",
                                    cash: [13e3, 45e3, 45e4, 45e5, 5e7],
                                    time: [2, 2, 2, 2, 2],
                                    price: [13e5, 14e6, 16e7, 2e9]
                                },
                                {
                                    name: "Drink Me",
                                    color: "#dd7399",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Uncommon",
                                    cash: [12e3, 4e4, 4e5, 4e6, 45e6],
                                    time: [2, 2, 2, 2, 2],
                                    price: [12e5, 12e6, 14e7, 18e8]
                                },
                                {
                                    name: "Alice",
                                    color: "#4cc9f5",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Uncommon",
                                    cash: [13e3, 42e3, 21e4, 21e5, 23e6],
                                    time: [2, 2, 1, 1, 1],
                                    price: [12e5, 13e6, 15e7, 19e8]
                                },
                                {
                                    name: "Queen of Hearts",
                                    color: "#d62027",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Uncommon",
                                    cash: [23e3, 87e3, 62e4, 75e5, 9e7],
                                    time: [4, 4, 3, 3, 3],
                                    price: [13e5, 13e6, 18e7, 24e8]
                                },
                                {
                                    name: "Dormouse",
                                    color: "#89d6f8",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Rare",
                                    cash: [17e3, 68e3, 7e5, 35e5, 35e6],
                                    time: [2, 2, 1, 1, 1],
                                    price: [2e6, 22e6, 25e7, 28e8]
                                },
                                {
                                    name: "White Rabbit",
                                    color: "#ffcd05",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Rare",
                                    cash: [26e3, 105e3, 11e6, 77e5, 72e6],
                                    time: [3, 3, 3, 2, 2],
                                    price: [2e6, 23e6, 28e7, 29e8]
                                },
                                {
                                    name: "Cheshire Cat",
                                    color: "#dd7399",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Rare",
                                    cash: [32e3, 1e5, 9e5, 9e6, 6e7],
                                    time: [4, 3, 3, 3, 2],
                                    price: [18e5, 19e6, 22e7, 24e8]
                                },
                                {
                                    name: "Caterpillar",
                                    color: "#00c0f3",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Epic",
                                    cash: [1e4, 7e4, 65e4, 75e5, 85e6],
                                    time: [1, 1, 1, 1, 1],
                                    price: [42e5, 42e6, 54e7, 69e8]
                                },
                                {
                                    name: "Mad Hatter",
                                    color: "#914f93",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Epic",
                                    cash: [38e3, 25e4, 15e5, 14e6, 8e7],
                                    time: [3, 3, 2, 2, 1],
                                    price: [48e5, 48e6, 52e7, 66e8]
                                },
                                {
                                    name: "King of Hearts",
                                    color: "#c62127",
                                    class: "\uD83C\uDFF0",
                                    rarity: "Legendary",
                                    cash: [8e4, 42e4, 68e5, 1e8, 15e8],
                                    time: [5, 5, 5, 5, 5],
                                    price: [7e6, 11e7, 18e8, 3e10]
                                },
                                {
                                    name: "Earth",
                                    color: "#416eb5",
                                    class: "\uD83D\uDE80",
                                    rarity: "Uncommon",
                                    cash: [15e3, 45e3, 6e5, 65e5, 65e6],
                                    time: [3, 3, 3, 3, 3],
                                    price: [1e6, 11e6, 15e7, 17e8]
                                },
                                {
                                    name: "Meteor",
                                    color: "#c68c3c",
                                    class: "\uD83D\uDE80",
                                    rarity: "Uncommon",
                                    cash: [23e3, 65e3, 7e5, 45e5, 2e7],
                                    time: [5, 4, 3, 2, 1],
                                    price: [95e4, 13e6, 16e7, 16e8]
                                },
                                {
                                    name: "Stars",
                                    color: "#19184d",
                                    class: "\uD83D\uDE80",
                                    rarity: "Uncommon",
                                    cash: [1e4, 4e4, 2e5, 2e6, 18e6],
                                    time: [2, 2, 1, 1, 1],
                                    price: [14e5, 14e6, 15e7, 15e8]
                                },
                                {
                                    name: "Alien",
                                    color: "#8dc63f",
                                    class: "\uD83D\uDE80",
                                    rarity: "Uncommon",
                                    cash: [3e4, 1e5, 1e6, 11e6, 85e6],
                                    time: [4, 4, 4, 4, 4],
                                    price: [15e5, 17e6, 19e7, 17e8]
                                },
                                {
                                    name: "Planet",
                                    color: "#9dc6ea",
                                    class: "\uD83D\uDE80",
                                    rarity: "Rare",
                                    cash: [25e3, 1e5, 9e5, 9e6, 9e7],
                                    time: [3, 3, 3, 3, 3],
                                    price: [2e6, 21e6, 21e7, 24e8]
                                },
                                {
                                    name: "UFO",
                                    color: "#a15095",
                                    class: "\uD83D\uDE80",
                                    rarity: "Rare",
                                    cash: [17e3, 7e4, 7e5, 7e6, 7e7],
                                    time: [2, 2, 2, 2, 2],
                                    price: [21e5, 23e6, 25e7, 28e8]
                                },
                                {
                                    name: "Spaceship",
                                    color: "#ffcb29",
                                    class: "\uD83D\uDE80",
                                    rarity: "Epic",
                                    cash: [6e4, 32e4, 21e5, 15e6, 85e6],
                                    time: [5, 4, 3, 2, 1],
                                    price: [48e5, 46e6, 54e7, 68e8]
                                },
                                {
                                    name: "Astronaut",
                                    color: "#9bd4ee",
                                    class: "\uD83D\uDE80",
                                    rarity: "Legendary",
                                    cash: [45e3, 26e4, 25e5, 38e6, 55e7],
                                    time: [3, 3, 2, 2, 2],
                                    price: [65e5, 1e8, 17e8, 27e9]
                                },
                                {
                                    name: "Lil Bot",
                                    color: "#3e564a",
                                    class: "\uD83E\uDD16",
                                    rarity: "Uncommon",
                                    cash: [4e3, 12e3, 18e4, 19e5, 25e6],
                                    time: [1, 1, 1, 1, 1],
                                    price: [73e4, 12e6, 13e7, 19e8]
                                },
                                {
                                    name: "Lovely Bot",
                                    color: "#f179af",
                                    class: "\uD83E\uDD16",
                                    rarity: "Uncommon",
                                    cash: [16e3, 65e3, 65e4, 48e5, 42e6],
                                    time: [3, 3, 3, 2, 2],
                                    price: [13e5, 14e6, 17e7, 16e8]
                                },
                                {
                                    name: "Angry Bot",
                                    color: "#f1613a",
                                    class: "\uD83E\uDD16",
                                    rarity: "Uncommon",
                                    cash: [22e3, 85e3, 8e5, 62e5, 65e6],
                                    time: [4, 4, 4, 3, 3],
                                    price: [12e5, 13e6, 15e7, 17e8]
                                },
                                {
                                    name: "Happy Bot",
                                    color: "#51ba6b",
                                    class: "\uD83E\uDD16",
                                    rarity: "Uncommon",
                                    cash: [11e3, 45e3, 5e5, 25e5, 3e7],
                                    time: [2, 2, 2, 1, 1],
                                    price: [14e5, 15e6, 18e7, 24e8]
                                },
                                {
                                    name: "Watson",
                                    color: "#d69b5a",
                                    class: "\uD83E\uDD16",
                                    rarity: "Rare",
                                    cash: [24e3, 1e5, 1e6, 1e7, 1e8],
                                    time: [3, 3, 3, 3, 3],
                                    price: [2e6, 22e6, 24e7, 26e8]
                                },
                                {
                                    name: "Buddy Bot",
                                    color: "#9dc6ea",
                                    class: "\uD83E\uDD16",
                                    rarity: "Rare",
                                    cash: [22e3, 95e3, 65e4, 65e5, 65e6],
                                    time: [3, 3, 2, 2, 2],
                                    price: [19e5, 21e6, 23e7, 25e8]
                                },
                                {
                                    name: "Brainy Bot",
                                    color: "#9ecf7a",
                                    class: "\uD83E\uDD16",
                                    rarity: "Epic",
                                    cash: [5e4, 25e4, 21e5, 21e6, 17e7],
                                    time: [4, 3, 3, 3, 2],
                                    price: [5e6, 46e6, 5e8, 67e8]
                                },
                                {
                                    name: "Mega Bot",
                                    color: "#d71f27",
                                    class: "\uD83E\uDD16",
                                    rarity: "Legendary",
                                    cash: [8e4, 43e4, 42e5, 62e6, 1e9],
                                    time: [5, 5, 3, 3, 3],
                                    price: [7e6, 12e7, 19e8, 35e9]
                                },
                            ].map((x) => ({
                                name: x.name,
                                value: JSON.stringify(x)
                            })),
                        }, ],
                        run: function(blook) {
                            (() => {
                                console.clear();
                                console.log("🏭 Factory: Choose Blook...");

                                const factoryBlooks = [{
                                        name: "Chick",
                                        color: "#ffcd05",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [3, 7, 65, 400, 2500],
                                        time: [1, 1, 1, 1, 1],
                                        price: [300, 3000, 30000, 200000]
                                    },
                                    {
                                        name: "Chicken",
                                        color: "#ed1c24",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [10, 40, 200, 1400, 10000],
                                        time: [5, 4, 3, 2, 1],
                                        price: [570, 4000, 50000, 800000]
                                    },
                                    {
                                        name: "Cow",
                                        color: "#58595b",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [25, 75, 1500, 25000, 250000],
                                        time: [15, 10, 10, 10, 5],
                                        price: [500, 9500, 160000, 4000000]
                                    },
                                    {
                                        name: "Duck",
                                        color: "#4ab96d",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [4, 24, 200, 3000, 40000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [450, 4200, 70000, 1100000]
                                    },
                                    {
                                        name: "Goat",
                                        color: "#c59a74",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [5, 28, 200, 1300, 12000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [500, 6400, 45000, 500000]
                                    },
                                    {
                                        name: "Horse",
                                        color: "#995b3c",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [5, 20, 270, 1800, 15000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [550, 8200, 65000, 600000]
                                    },
                                    {
                                        name: "Pig",
                                        color: "#f6a9cb",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [20, 50, 1300, 8000, 80000],
                                        time: [7, 7, 7, 7, 5],
                                        price: [400, 11000, 80000, 1300000]
                                    },
                                    {
                                        name: "Sheep",
                                        color: "#414042",
                                        class: "🌽",
                                        rarity: "Common",
                                        cash: [6, 25, 250, 1500, 11000],
                                        time: [3, 3, 3, 2, 2],
                                        price: [500, 5000, 50000, 430000]
                                    },
                                    {
                                        name: "Cat",
                                        color: "#f49849",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [5, 18, 170, 1700, 13000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [480, 5500, 60000, 500000]
                                    },
                                    {
                                        name: "Dog",
                                        color: "#995b3c",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [7, 25, 220, 1900, 9000],
                                        time: [3, 3, 2, 2, 1],
                                        price: [460, 6600, 70000, 730000]
                                    },
                                    {
                                        name: "Goldfish",
                                        color: "#f18221",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [5, 40, 350, 3500, 35000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [750, 7200, 84000, 950000]
                                    },
                                    {
                                        name: "Rabbit",
                                        color: "#e7bf9a",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [3, 18, 185, 800, 7000],
                                        time: [2, 2, 2, 1, 1],
                                        price: [500, 5800, 56000, 550000]
                                    },
                                    {
                                        name: "Hamster",
                                        color: "#ce9176",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [10, 45, 450, 4500, 45000],
                                        time: [4, 4, 4, 4, 4],
                                        price: [650, 6500, 80000, 930000]
                                    },
                                    {
                                        name: "Turtle",
                                        color: "#619a3c",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [23, 120, 1400, 15000, 170000],
                                        time: [10, 10, 10, 10, 10],
                                        price: [700, 8500, 110000, 1300000]
                                    },
                                    {
                                        name: "Puppy",
                                        color: "#414042",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [4, 10, 75, 500, 3000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [450, 4000, 35000, 250000]
                                    },
                                    {
                                        name: "Kitten",
                                        color: "#58595b",
                                        class: "🐾",
                                        rarity: "Common",
                                        cash: [4, 8, 60, 400, 2000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [350, 3500, 26000, 170000]
                                    },
                                    {
                                        name: "Bear",
                                        color: "#995b3c",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [12, 70, 550, 4500, 100000],
                                        time: [7, 7, 6, 5, 5],
                                        price: [550, 5500, 63000, 1600000]
                                    },
                                    {
                                        name: "Moose",
                                        color: "#995b3c",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [8, 45, 400, 3500, 26000],
                                        time: [5, 5, 4, 4, 3],
                                        price: [520, 6500, 58000, 700000]
                                    },
                                    {
                                        name: "Fox",
                                        color: "#f49849",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [7, 15, 80, 550, 3000],
                                        time: [2, 2, 1, 1, 1],
                                        price: [400, 4000, 36000, 240000]
                                    },
                                    {
                                        name: "Raccoon",
                                        color: "#6d6e71",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [5, 14, 185, 1900, 19000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [400, 5000, 71000, 800000]
                                    },
                                    {
                                        name: "Squirrel",
                                        color: "#d25927",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [3, 10, 65, 470, 2600],
                                        time: [1, 1, 1, 1, 1],
                                        price: [420, 3600, 32000, 210000]
                                    },
                                    {
                                        name: "Owl",
                                        color: "#594a42",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [4, 17, 155, 1500, 15000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [500, 4800, 55000, 580000]
                                    },
                                    {
                                        name: "Hedgehog",
                                        color: "#3f312b",
                                        class: "🌲",
                                        rarity: "Common",
                                        cash: [11, 37, 340, 2200, 30000],
                                        time: [5, 4, 3, 2, 2],
                                        price: [540, 7000, 77000, 1200000]
                                    },
                                    {
                                        name: "Seal",
                                        color: "#7ca1d5",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [6, 17, 150, 1200, 13000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [480, 4500, 43000, 520000]
                                    },
                                    {
                                        name: "Arctic Fox",
                                        color: "#7ca1d5",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [5, 18, 180, 850, 8500],
                                        time: [2, 2, 2, 1, 1],
                                        price: [520, 550, 61000, 680000]
                                    },
                                    {
                                        name: "Snowy Owl",
                                        color: "#feda3f",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [5, 20, 190, 1900, 16000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [370, 5300, 76000, 620000]
                                    },
                                    {
                                        name: "Arctic Hare",
                                        color: "#7ca1d5",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [6, 19, 85, 900, 7000],
                                        time: [2, 2, 1, 1, 1],
                                        price: [540, 5200, 66000, 550000]
                                    },
                                    {
                                        name: "Penguin",
                                        color: "#fb8640",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [4, 21, 310, 3200, 33000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [400, 6500, 76000, 870000]
                                    },
                                    {
                                        name: "Baby Penguin",
                                        color: "#414042",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [3, 8, 70, 450, 2700],
                                        time: [1, 1, 1, 1, 1],
                                        price: [420, 3300, 33000, 230000]
                                    },
                                    {
                                        name: "Polar Bear",
                                        color: "#7ca1d5",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [12, 75, 700, 6500, 85000],
                                        time: [8, 7, 6, 5, 5],
                                        price: [630, 7000, 91000, 1400000]
                                    },
                                    {
                                        name: "Walrus",
                                        color: "#7d4f33",
                                        class: "❄️",
                                        rarity: "Common",
                                        cash: [11, 46, 420, 3700, 51000],
                                        time: [5, 5, 4, 4, 4],
                                        price: [550, 6200, 68000, 1000000]
                                    },
                                    {
                                        name: "Tiger",
                                        color: "#f18221",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [6, 20, 100, 975, 7500],
                                        time: [3, 3, 1, 1, 1],
                                        price: [390, 6000, 70000, 610000]
                                    },
                                    {
                                        name: "Jaguar",
                                        color: "#fbb040",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [8, 28, 230, 1600, 17000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [390, 6000, 70000, 610000]
                                    },
                                    {
                                        name: "Toucan",
                                        color: "#ffca34",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [9, 20, 175, 625, 3800],
                                        time: [2, 2, 2, 1, 1],
                                        price: [520, 4800, 42000, 300000]
                                    },
                                    {
                                        name: "Cockatoo",
                                        color: "#7ca1d5",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [6, 35, 160, 1700, 18000],
                                        time: [4, 4, 2, 2, 2],
                                        price: [500, 5000, 63000, 700000]
                                    },
                                    {
                                        name: "Macaw",
                                        color: "#00aeef",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [3, 8, 85, 850, 8500],
                                        time: [1, 1, 1, 1, 1],
                                        price: [480, 5400, 62000, 630000]
                                    },
                                    {
                                        name: "Parrot",
                                        color: "#ed1c24",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [3, 9, 90, 900, 9000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [540, 5700, 65000, 690000]
                                    },
                                    {
                                        name: "Panther",
                                        color: "#2f2c38",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [12, 28, 215, 2100, 21000],
                                        time: [5, 3, 2, 2, 2],
                                        price: [530, 6500, 76000, 870000]
                                    },
                                    {
                                        name: "Anaconda",
                                        color: "#8a9143",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [3, 15, 85, 1500, 7600],
                                        time: [1, 2, 1, 2, 1],
                                        price: [410, 5100, 58000, 590000]
                                    },
                                    {
                                        name: "Orangutan",
                                        color: "#bc6234",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [13, 52, 570, 4300, 70000],
                                        time: [5, 5, 5, 4, 4],
                                        price: [600, 7000, 80000, 1400000]
                                    },
                                    {
                                        name: "Capuchin",
                                        color: "#e0b0a6",
                                        class: "🌴",
                                        rarity: "Common",
                                        cash: [4, 14, 160, 780, 8200],
                                        time: [2, 2, 2, 1, 1],
                                        price: [390, 4700, 57000, 680000]
                                    },
                                    {
                                        name: "Elf",
                                        color: "#a7d054",
                                        class: "⚔️",
                                        rarity: "Uncommon",
                                        cash: [5000, 15000, 150000, 1500000, 10000000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [800000, 9000000, 110000000, 800000000]
                                    },
                                    {
                                        name: "Witch",
                                        color: "#4ab96d",
                                        class: "⚔️",
                                        rarity: "Uncommon",
                                        cash: [18000, 60000, 40000, 4000000, 35000000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [1100000, 12000000, 150000000, 1400000000]
                                    },
                                    {
                                        name: "Wizard",
                                        color: "#5a459c",
                                        class: "⚔️",
                                        rarity: "Uncommon",
                                        cash: [19500, 65000, 440000, 4600000, 4000000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [1300000, 13500000, 160000000, 1600000000]
                                    },
                                    {
                                        name: "Fairy",
                                        color: "#df6d9c",
                                        class: "⚔️",
                                        rarity: "Uncommon",
                                        cash: [18500, 60000, 620000, 4400000, 38000000],
                                        time: [3, 3, 3, 2, 2],
                                        price: [1200000, 12500000, 15000000, 1500000000]
                                    },
                                    {
                                        name: "Slime Monster",
                                        color: "#2fa04a",
                                        class: "⚔️",
                                        rarity: "Uncommon",
                                        cash: [35000, 140000, 1000000, 11000000, 110000000],
                                        time: [5, 5, 4, 4, 4],
                                        price: [1600000, 15000000, 200000000, 2300000000]
                                    },
                                    {
                                        name: "Jester",
                                        color: "#be1e2d",
                                        class: "⚔️",
                                        rarity: "Rare",
                                        cash: [25000, 100000, 680000, 6500000, 32000000],
                                        time: [3, 3, 2, 2, 1],
                                        price: [2000000, 21000000, 230000000, 2600000000]
                                    },
                                    {
                                        name: "Dragon",
                                        color: "#2fa04a",
                                        class: "⚔️",
                                        rarity: "Rare",
                                        cash: [36000, 150000, 1500000, 15000000, 150000000],
                                        time: [4, 4, 4, 4, 4],
                                        price: [2300000, 24000000, 270000000, 3000000000]
                                    },
                                    {
                                        name: "Unicorn",
                                        color: "#f6afce",
                                        class: "⚔️",
                                        rarity: "Epic",
                                        cash: [24000, 150000, 1400000, 7000000, 75000000],
                                        time: [2, 2, 2, 1, 1],
                                        price: [4500000, 45000000, 550000000, 6500000000]
                                    },
                                    {
                                        name: "Queen",
                                        color: "#9e1f63",
                                        class: "⚔️",
                                        rarity: "Rare",
                                        cash: [24000, 95000, 950000, 9700000, 95000000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [1900000, 20000000, 230000000, 2500000000]
                                    },
                                    {
                                        name: "King",
                                        color: "#ee2640",
                                        class: "⚔️",
                                        rarity: "Legendary",
                                        cash: [75000, 400000, 6000000, 90000000, 1250000000],
                                        time: [5, 5, 5, 5, 5],
                                        price: [6000000, 95000000, 1600000000, 25000000000]
                                    },
                                    {
                                        name: "Two of Spades",
                                        color: "#414042",
                                        class: "🃏",
                                        rarity: "Uncommon",
                                        cash: [4500, 14000, 140000, 1400000, 9000000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [770000, 8300000, 98000000, 710000000]
                                    },
                                    {
                                        name: "Eat Me",
                                        color: "#d58c55",
                                        class: "🃏",
                                        rarity: "Uncommon",
                                        cash: [13000, 45000, 450000, 4500000, 50000000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [1300000, 14000000, 160000000, 2000000000]
                                    },
                                    {
                                        name: "Drink Me",
                                        color: "#dd7399",
                                        class: "🃏",
                                        rarity: "Uncommon",
                                        cash: [12000, 40000, 400000, 4000000, 45000000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [1200000, 12000000, 140000000, 1800000000]
                                    },
                                    {
                                        name: "Alice",
                                        color: "#4cc9f5",
                                        class: "🃏",
                                        rarity: "Uncommon",
                                        cash: [13000, 42000, 210000, 2100000, 23000000],
                                        time: [2, 2, 1, 1, 1],
                                        price: [1200000, 13000000, 150000000, 1900000000]
                                    },
                                    {
                                        name: "Queen of Hearts",
                                        color: "#d62027",
                                        class: "🃏",
                                        rarity: "Uncommon",
                                        cash: [23000, 87000, 620000, 7500000, 90000000],
                                        time: [4, 4, 3, 3, 3],
                                        price: [1300000, 13000000, 180000000, 2400000000]
                                    },
                                    {
                                        name: "Dormouse",
                                        color: "#89d6f8",
                                        class: "🃏",
                                        rarity: "Rare",
                                        cash: [17000, 68000, 700000, 3500000, 35000000],
                                        time: [2, 2, 1, 1, 1],
                                        price: [2000000, 22000000, 250000000, 2800000000]
                                    },
                                    {
                                        name: "White Rabbit",
                                        color: "#ffcd05",
                                        class: "🃏",
                                        rarity: "Rare",
                                        cash: [26000, 105000, 11000000, 7700000, 72000000],
                                        time: [3, 3, 3, 2, 2],
                                        price: [2000000, 23000000, 280000000, 2900000000]
                                    },
                                    {
                                        name: "Cheshire Cat",
                                        color: "#dd7399",
                                        class: "🃏",
                                        rarity: "Rare",
                                        cash: [32000, 100000, 900000, 9000000, 60000000],
                                        time: [4, 3, 3, 3, 2],
                                        price: [1800000, 19000000, 220000000, 2400000000]
                                    },
                                    {
                                        name: "Caterpillar",
                                        color: "#00c0f3",
                                        class: "🃏",
                                        rarity: "Epic",
                                        cash: [10000, 70000, 650000, 7500000, 85000000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [4200000, 42000000, 540000000, 6900000000]
                                    },
                                    {
                                        name: "Mad Hatter",
                                        color: "#914f93",
                                        class: "🃏",
                                        rarity: "Epic",
                                        cash: [38000, 250000, 1500000, 14000000, 80000000],
                                        time: [3, 3, 2, 2, 1],
                                        price: [4800000, 48000000, 520000000, 6600000000]
                                    },
                                    {
                                        name: "King of Hearts",
                                        color: "#c62127",
                                        class: "🃏",
                                        rarity: "Legendary",
                                        cash: [80000, 420000, 6800000, 100000000, 1500000000],
                                        time: [5, 5, 5, 5, 5],
                                        price: [7000000, 110000000, 1800000000, 30000000000]
                                    },
                                    {
                                        name: "Earth",
                                        color: "#416eb5",
                                        class: "🚀",
                                        rarity: "Uncommon",
                                        cash: [15000, 45000, 600000, 6500000, 65000000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [1000000, 11000000, 150000000, 1700000000]
                                    },
                                    {
                                        name: "Meteor",
                                        color: "#c68c3c",
                                        class: "🚀",
                                        rarity: "Uncommon",
                                        cash: [23000, 65000, 700000, 4500000, 20000000],
                                        time: [5, 4, 3, 2, 1],
                                        price: [950000, 13000000, 160000000, 1600000000]
                                    },
                                    {
                                        name: "Stars",
                                        color: "#19184d",
                                        class: "🚀",
                                        rarity: "Uncommon",
                                        cash: [10000, 40000, 200000, 2000000, 18000000],
                                        time: [2, 2, 1, 1, 1],
                                        price: [1400000, 14000000, 150000000, 1500000000]
                                    },
                                    {
                                        name: "Alien",
                                        color: "#8dc63f",
                                        class: "🚀",
                                        rarity: "Uncommon",
                                        cash: [30000, 100000, 1000000, 11000000, 85000000],
                                        time: [4, 4, 4, 4, 4],
                                        price: [1500000, 17000000, 190000000, 1700000000]
                                    },
                                    {
                                        name: "Planet",
                                        color: "#9dc6ea",
                                        class: "🚀",
                                        rarity: "Rare",
                                        cash: [25000, 100000, 900000, 9000000, 90000000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [2000000, 21000000, 210000000, 2400000000]
                                    },
                                    {
                                        name: "UFO",
                                        color: "#a15095",
                                        class: "🚀",
                                        rarity: "Rare",
                                        cash: [17000, 70000, 700000, 7000000, 70000000],
                                        time: [2, 2, 2, 2, 2],
                                        price: [2100000, 23000000, 250000000, 2800000000]
                                    },
                                    {
                                        name: "Spaceship",
                                        color: "#ffcb29",
                                        class: "🚀",
                                        rarity: "Epic",
                                        cash: [60000, 320000, 2100000, 15000000, 85000000],
                                        time: [5, 4, 3, 2, 1],
                                        price: [4800000, 46000000, 540000000, 6800000000]
                                    },
                                    {
                                        name: "Astronaut",
                                        color: "#9bd4ee",
                                        class: "🚀",
                                        rarity: "Legendary",
                                        cash: [45000, 260000, 2500000, 38000000, 550000000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [6500000, 100000000, 1700000000, 27000000000]
                                    },
                                    {
                                        name: "Lil Bot",
                                        color: "#3e564a",
                                        class: "🤖",
                                        rarity: "Uncommon",
                                        cash: [4000, 12000, 180000, 1900000, 25000000],
                                        time: [1, 1, 1, 1, 1],
                                        price: [730000, 12000000, 130000000, 1900000000]
                                    },
                                    {
                                        name: "Lovely Bot",
                                        color: "#f179af",
                                        class: "🤖",
                                        rarity: "Uncommon",
                                        cash: [16000, 65000, 650000, 4800000, 42000000],
                                        time: [3, 3, 3, 2, 2],
                                        price: [1300000, 14000000, 170000000, 1600000000]
                                    },
                                    {
                                        name: "Angry Bot",
                                        color: "#f1613a",
                                        class: "🤖",
                                        rarity: "Uncommon",
                                        cash: [22000, 85000, 800000, 6200000, 65000000],
                                        time: [4, 4, 4, 3, 3],
                                        price: [1200000, 13000000, 150000000, 1700000000]
                                    },
                                    {
                                        name: "Happy Bot",
                                        color: "#51ba6b",
                                        class: "🤖",
                                        rarity: "Uncommon",
                                        cash: [11000, 45000, 500000, 2500000, 30000000],
                                        time: [2, 2, 2, 1, 1],
                                        price: [1400000, 15000000, 180000000, 2400000000]
                                    },
                                    {
                                        name: "Watson",
                                        color: "#d69b5a",
                                        class: "🤖",
                                        rarity: "Rare",
                                        cash: [24000, 100000, 1000000, 10000000, 100000000],
                                        time: [3, 3, 3, 3, 3],
                                        price: [2000000, 22000000, 240000000, 2600000000]
                                    },
                                    {
                                        name: "Buddy Bot",
                                        color: "#9dc6ea",
                                        class: "🤖",
                                        rarity: "Rare",
                                        cash: [22000, 95000, 650000, 6500000, 65000000],
                                        time: [3, 3, 2, 2, 2],
                                        price: [1900000, 21000000, 230000000, 2500000000]
                                    },
                                    {
                                        name: "Brainy Bot",
                                        color: "#9ecf7a",
                                        class: "🤖",
                                        rarity: "Epic",
                                        cash: [50000, 250000, 2100000, 21000000, 170000000],
                                        time: [4, 3, 3, 3, 2],
                                        price: [5000000, 46000000, 500000000, 6700000000]
                                    },
                                    {
                                        name: "Mega Bot",
                                        color: "#d71f27",
                                        class: "🤖",
                                        rarity: "Legendary",
                                        cash: [80000, 430000, 4200000, 62000000, 1000000000],
                                        time: [5, 5, 3, 3, 3],
                                        price: [7000000, 120000000, 1900000000, 35000000000]
                                    }
                                ];

                                let targetObj = null;

                                function scanDeep(obj, depth = 0) {
                                    if (depth > 8 || targetObj) return;
                                    if (!obj || typeof obj !== 'object') return;

                                    if (obj.factories && Array.isArray(obj.factories)) {
                                        targetObj = obj;
                                        return;
                                    }

                                    if (Array.isArray(obj)) {
                                        obj.forEach(item => scanDeep(item, depth + 1));
                                    } else {
                                        if (obj.props) scanDeep(obj.props, depth + 1);
                                        if (obj.children) scanDeep(obj.children, depth + 1);
                                        if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
                                        if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
                                    }
                                }

                                const root = document.querySelector('#app') || document.body;

                                function traverseDOM(node) {
                                    if (targetObj) return;
                                    const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
                                    if (k) scanDeep(node[k]);
                                    for (const child of node.children) traverseDOM(child);
                                }
                                traverseDOM(root);

                                if (targetObj) {

                                    let iframe = document.createElement('iframe');
                                    document.body.append(iframe);
                                    const input = blook.name;
                                    iframe.remove();

                                    if (!input) return;

                                    const chosenBlook = factoryBlooks.find(b => b.name.toLowerCase() === input.toLowerCase());

                                    if (chosenBlook) {

                                        const maxSlots = 10;
                                        const currentLen = targetObj.factories.length;

                                        const newBlook = {
                                            ...chosenBlook,
                                            level: 4,
                                            bonus: 1
                                        };

                                        if (currentLen < maxSlots) {
                                            targetObj.factories.push(newBlook);
                                            alert(`✅ Added ${chosenBlook.name}!`);
                                        } else {

                                            targetObj.factories[maxSlots - 1] = newBlook;
                                            alert(`✅ Replaced last slot with ${chosenBlook.name}!`);
                                        }

                                        alert("IMPORTANT: Buy any upgrade or click a blook to see the change!");

                                    } else {
                                        alert("❌ Invalid Blook Name! Check spelling.");
                                    }
                                } else {
                                    alert("❌ Could not find factories container.");
                                }
                            })();


                        },
                    },
                    {
                        name: "Free Upgrades",
                        description: "Sets upgrade prices to 0 for all current blooks",
                        run: function() {
                            const prices = [0, 0, 0, 0];
                            let stateNode = getStateNode();
                            stateNode.setState({
                                blooks: stateNode.state.blooks.map((blook) => ((blook.price = prices), blook))
                            });
                        },
                    },
                    {
                        name: "Max Blooks",
                        description: "Maxes out all your blooks' levels",
                        run: function() {
                            (() => {
                                console.clear();
                                console.log("💉 Factory: Maxing Levels...");

                                let foundFactories = null;

                                function scanDeep(obj, depth = 0) {
                                    if (depth > 8 || foundFactories) return;
                                    if (!obj || typeof obj !== 'object') return;

                                    if (obj.factories && Array.isArray(obj.factories) && obj.factories.length > 0) {
                                        const sample = obj.factories[0];
                                        if (sample.cash && sample.level !== undefined) {
                                            foundFactories = obj.factories;
                                            return;
                                        }
                                    }

                                    if (Array.isArray(obj)) {
                                        obj.forEach(item => scanDeep(item, depth + 1));
                                    } else {
                                        if (obj.props) scanDeep(obj.props, depth + 1);
                                        if (obj.children) scanDeep(obj.children, depth + 1);
                                        if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
                                        if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
                                    }
                                }

                                const root = document.querySelector('#app') || document.body;

                                function traverseDOM(node) {
                                    if (foundFactories) return;
                                    const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
                                    if (k) scanDeep(node[k]);
                                    for (const child of node.children) traverseDOM(child);
                                }
                                traverseDOM(root);

                                if (foundFactories) {
                                    let count = 0;
                                    foundFactories.forEach(factory => {
                                        factory.level = 4;

                                        count++;
                                    });

                                    let iframe = document.createElement('iframe');
                                    document.body.append(iframe);
                                    iframe.contentWindow.alert(`✅ Set ${count} blooks to Level 4!\n\nIMPORTANT: Perform any action (buy/upgrade) to see the visual change.`);
                                    iframe.remove();
                                } else {
                                    alert("❌ Could not find factories. Make sure you have at least one blook!");
                                }
                            })();


                        },
                    },
                    {
                        name: "Make Blooks OP",
                        description: "Make all your blooks OP",
                        run: function() {
                            (() => {
                                console.clear();
                                console.log("💉 Factory: Making Blooks OP...");

                                let foundFactories = null;

                                function scanDeep(obj, depth = 0) {
                                    if (depth > 8 || foundFactories) return;
                                    if (!obj || typeof obj !== 'object') return;

                                    if (obj.factories && Array.isArray(obj.factories) && obj.factories.length > 0) {
                                        const sample = obj.factories[0];
                                        if (sample.cash && Array.isArray(sample.cash) && sample.name) {
                                            foundFactories = obj.factories;
                                            return;
                                        }
                                    }

                                    if (Array.isArray(obj)) {
                                        obj.forEach(item => scanDeep(item, depth + 1));
                                    } else {
                                        if (obj.props) scanDeep(obj.props, depth + 1);
                                        if (obj.children) scanDeep(obj.children, depth + 1);
                                        if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
                                        if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
                                    }
                                }

                                const root = document.querySelector('#app') || document.body;

                                function traverseDOM(node) {
                                    if (foundFactories) return;
                                    const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
                                    if (k) {
                                        scanDeep(node[k]);
                                    }
                                    for (const child of node.children) traverseDOM(child);
                                }
                                traverseDOM(root);

                                if (foundFactories) {
                                    let count = 0;
                                    foundFactories.forEach(factory => {

                                        factory.cash = [1e9, 1e9, 1e9, 1e9, 1e9];

                                        factory.time = [0.01, 0.01, 0.01, 0.01, 0.01];

                                        count++;
                                    });

                                    let iframe = document.createElement('iframe');
                                    document.body.append(iframe);
                                    iframe.contentWindow.alert(`✅ Made ${count} blooks OP!\n\nIMPORTANT: Buy an upgrade or a new blook to force the stats to update.`);
                                    iframe.remove();
                                } else {
                                    alert("❌ Could not find factories. Make sure you have at least one blook!");
                                }
                            })();


                        }
                    },
                    {
                        name: "Remove Glitches",
                        description: "Removes all enemy glitches",
                        run: function() {
                            (() => {
                                console.clear();
                                console.log("🛡️ HUNTING GLITCH STRINGS IN MEMORY...");

                                const glitchNames = [
                                    "Lunch Break", "Ad Spam", "Error 37", "Night Time", "#LOL",
                                    "Jokester", "Slow Mo", "Dance Party", "Vortex", "Reverse", "Flip", "Micro"
                                ];

                                let foundCount = 0;
                                let visited = new Set();

                                function clearState(obj, key) {
                                    console.log(`%c🔥 FOUND GLITCH: "${obj[key]}" in key "${key}"`, "color: red; font-weight: bold;");
                                    console.log("   Object:", obj);

                                    obj[key] = "";

                                    if (Array.isArray(obj.ads)) obj.ads = [];
                                    if (Array.isArray(obj.hazards)) obj.hazards = [];
                                    if (typeof obj.lol === 'boolean') obj.lol = false;
                                    if (typeof obj.night === 'boolean') obj.night = false;
                                    if (typeof obj.joke === 'boolean') obj.joke = false;
                                    if (typeof obj.slow === 'boolean') obj.slow = false;
                                    if (typeof obj.dance === 'boolean') obj.dance = false;
                                    if (typeof obj.color === 'string') obj.color = "";

                                    foundCount++;
                                }

                                function scanDeep(obj, depth = 0) {
                                    if (!obj || typeof obj !== 'object' || depth > 10) return;
                                    if (visited.has(obj)) return;
                                    visited.add(obj);

                                    for (const key in obj) {
                                        const val = obj[key];

                                        if (typeof val === 'string') {

                                            for (const gName of glitchNames) {
                                                if (val === gName) {
                                                    clearState(obj, key);

                                                }
                                            }
                                        }

                                        if (key.startsWith('_') && key !== '_owner') continue;

                                        if (typeof val === 'object') {
                                            scanDeep(val, depth + 1);
                                        }
                                    }
                                }

                                const root = document.querySelector('#app') || document.body;

                                function traverseDOM(node) {
                                    const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
                                    if (k) {
                                        const fiber = node[k];

                                        if (fiber.memoizedState) scanDeep(fiber.memoizedState);

                                        if (fiber.memoizedProps) scanDeep(fiber.memoizedProps);
                                    }
                                    for (const child of node.children) traverseDOM(child);
                                }
                                traverseDOM(root);

                                if (foundCount > 0) {
                                    let iframe = document.createElement('iframe');
                                    document.body.append(iframe);
                                    iframe.contentWindow.alert(`✅ Found and cleared ${foundCount} glitch objects in memory!`);
                                    iframe.remove();
                                } else {
                                    alert("❌ No active glitch strings found in memory. \n(Wait until you actually have a glitch active, then run this!)");
                                }
                            })();


                        },
                    },
                    {
                        name: "Set All MegaBot",
                        description: "Sets all your blooks to maxed out Mega Bots",
                        run: function() {
                            (() => {
                                console.clear();
                                console.log("🏭 Factory: Setting all to Mega Bots...");

                                let targetObj = null;

                                function scanDeep(obj, depth = 0) {
                                    if (depth > 8 || targetObj) return;
                                    if (!obj || typeof obj !== 'object') return;

                                    if (obj.factories && Array.isArray(obj.factories)) {
                                        targetObj = obj;
                                        return;
                                    }

                                    if (Array.isArray(obj)) {
                                        obj.forEach(item => scanDeep(item, depth + 1));
                                    } else {
                                        if (obj.props) scanDeep(obj.props, depth + 1);
                                        if (obj.children) scanDeep(obj.children, depth + 1);
                                        if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
                                        if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
                                    }
                                }

                                const root = document.querySelector('#app') || document.body;

                                function traverseDOM(node) {
                                    if (targetObj) return;
                                    const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
                                    if (k) scanDeep(node[k]);
                                    for (const child of node.children) traverseDOM(child);
                                }
                                traverseDOM(root);

                                if (targetObj) {

                                    const megaBot = {
                                        name: "Mega Bot",
                                        color: "#d71f27",
                                        class: "🤖",
                                        rarity: "Legendary",
                                        cash: [80000, 430000, 4200000, 62000000, 1000000000],
                                        time: [5, 5, 3, 3, 3],
                                        price: [7000000, 120000000, 1900000000, 35000000000],
                                        active: false,
                                        level: 4,
                                        bonus: 5.0
                                    };

                                    const arr = targetObj.factories;
                                    arr.length = 0;

                                    for (let i = 0; i < 10; i++) {

                                        arr.push({
                                            ...megaBot
                                        });
                                    }

                                    let iframe = document.createElement('iframe');
                                    document.body.append(iframe);
                                    iframe.contentWindow.alert("✅ Factory replaced with 10 Mega Bots!\n\nIMPORTANT: Buy an upgrade or click a blook to refresh the visuals.");
                                    iframe.remove();

                                } else {
                                    alert("❌ Could not find factories container. Place at least one blook first.");
                                }
                            })();


                        },
                    },
                    {
                        name: "Set Cash",
                        description: "Sets amount of cash you have",
                        inputs: [{
                            name: "Cash",
                            type: "number",
                        }, ],
                        run: function(cash) {
                            (() => {
                                console.clear();
                                console.log("🏦 Factory: Setting Exact Cash...");

                                let gameState = null;

                                function scanDeep(obj, depth = 0) {
                                    if (depth > 8 || gameState) return;
                                    if (!obj || typeof obj !== 'object') return;

                                    if (obj.factories && typeof obj.addCash === 'function' && obj.cash !== undefined) {
                                        gameState = obj;
                                        return;
                                    }

                                    if (Array.isArray(obj)) {
                                        obj.forEach(item => scanDeep(item, depth + 1));
                                    } else {
                                        if (obj.props) scanDeep(obj.props, depth + 1);
                                        if (obj.children) scanDeep(obj.children, depth + 1);
                                        if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
                                        if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
                                    }
                                }

                                const root = document.querySelector('#app') || document.body;

                                function traverseDOM(node) {
                                    if (gameState) return;
                                    const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
                                    if (k) scanDeep(node[k]);
                                    for (const child of node.children) traverseDOM(child);
                                }
                                traverseDOM(root);

                                if (gameState) {
                                    const current = gameState.cash;

                                    let iframe = document.createElement('iframe');
                                    document.body.append(iframe);
                                    const input = cash;
                                    iframe.remove();

                                    if (input !== null) {
                                        const target = parseFloat(input);
                                        if (!isNaN(target)) {
                                            const diff = target - gameState.cash;

                                            gameState.addCash(diff);

                                            alert(`✅ Cash set to ${target}!`);
                                        }
                                    }
                                } else {
                                    alert("❌ Could not find Game Controller.");
                                }
                            })();


                        },
                    },
                ],
            },
            racing: {
               // img: "https://media.blooket.com/image/upload/v1663212882/Media/logos/Racing_Logo_Resized.png",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ0AAACbCAYAAAB4Ws7iAAAQAElEQVR4AeydB5ydRfWwZ3cTSAwgCH8pKkRQKSpSRJpgkE8FEUSQqiIqShPp0gRDC6ACMfSmoIDSAohKVXoREBBBmkhEKVICKCCk7fc8J/dc373ZTXbTSHn3d889M2fOnJk5M3PmzMx7320v9V+tgVoDtQb6oIHaaPRBWTVrrYFaA6XURqMeBbUGag30SQO10eiTumrmWgN908CcyF0bjTmxV+s21RqYgRqojcYMVG4tutbAnKiB2mjMib1at6nWwAzUQG00ZqBya9F900DNPXtooDYas0c/1bWsNTDLaKA2GrNMV9QVqTUwe2igNhqzRz/Vtaw1MMtooDYas0xX9K0iNXetgbdKA7XReKs0X5dba2A21UBtNGbTjqurXWvgrdJAbTTeKs3X5dYamE01MFcYjdm0b+pq1xqYJTVQG41ZslvqStUamHU1UBuNWbdv6prVGpglNVAbjVmyW+pK1RqYdTUwidGYdata16zWQK2BWUEDtdGYFXqhrkOtgdlIA7XRmI06q65qrYFZQQO10ZgVeqGuw9yjgTmgpbXRmAM6sW5CrYGZqYHaaMxMbddl1RqYAzRQG405oBPrJtQamJkaqI3GzNR2XVbfNFBzz5IaqI3GLNktdaVqDcy6GqiNxqzbN3XNag3MkhqojcYs2S11pWoNzLoaqI3GrNs3fatZzV1rYCZpoDYaM0nRdTG1BuYUDdRGY07pybodtQZmkgZqozGTFD07FnPbbbcNHDp0aD1GZsfOm4F1njsHRC8Vetxxxw0cPnz4iieccMK2wNARI0b8DLzThRde2NFLEbM123//+98l1llnnUtvueWW+WfrhtSVn64aqI1GQ52dnZ1tBx544OLf+973Nj344IOPPeSQQ279z3/+89yrr776p9dff/28MWPGfB+er8B+ynPPPXfziSeeuCbhWf5z9dVXD7ryyivXvPzyy/caOXLkRfyNvOSSS04lvA/wCQzgwJ4asf766z/e0dHRj78Te+Kp6XOfBuZqo7Hffvt9GANxOMbiIozFX9va2p5iCFyKcdhrwoQJa40bN24+jEVhxS0YjvLaa68FHj9+/Jrw3nrSSSddeeqpp67bkws/YsSIZU477bRvn8GffMie6Z/PfOYzr2244Ya3f/7znz9uoYUW2oZ2nUb9F6FtxwA3YBSev+yyy8694oorPtZd5Wjn39rb27/0xz/+ccXu0mva3KeBudZoMNH79e/ffwgT6Akmxki6/rvgzTAYmwCbMlG2Jv5t4GTC95I+hglXmGhhON588802aBuQ/8b/+7//e+zkk08+5eSTTz4cD2QY+EyMxV/mmWeeR+E5gXw7IGMY4bf0s956643baqutrt5yyy2/SL0/SmVupW6Dxo4d+yWM4+0YjkvxTN4DPT9t6GgwhqUDPRyNzuba8ZIKqXEpUx4Ec6iWmADjjjjiiBOGDRv2kyOPPPIXwCXELwNfAVx+2GGHXQCcdOihh+7KVmUVJtm7mDxbo45fYlTeYJIVgbifpaHtROB78BzABPsGk3F54u3QC3GCZZBfLdB+zDHHrEEdvnLUUUftAt4D2PHoo4/eEvgIhqd/C/90i26zzTb3vvTSS+tR32HAWOrZPnbs2E0xivddd91137n55ptX5yxjG+q+QaPQDTfeeOMR6G2uHTMNPcz1qB4AUxgCHoYyUeYBXjjggAMuOOigg7Yhy7uZTGdgSDoJNz/QmuEMSGNCFuAfSUuMwRiEB/Kv0aNHj/z3v/99ETwXYGz+DHarcPsrr7zy/I9+9KPzjz/++E05e5gn8/UWc2bxSc4vdgA2YQtS9SBCxI477jh2s802O4jIKngU92E8CobjHdThxxiPO6CfRxv7QSNYNH67ss0594477lig1H9zrQZmdaPRtttuu837rW9962277LLLfN/97nfnF4xvv/32A5jI7VtssUWHcSZa2/TuRTyPz7MN+du88857I57AQimfM5AXOQ/ZkYnmRA9yGoeI8GUcFJ9G2EkY8fxCxn/23XffJzAMryH/eQzSM5yt3IZx2gfZn4RvDLANbbv02WeffQLP4/s///nPF4c2xQ9GZk3yXQvjGRimy8FPYDj+AoxgG7Ir8DF4whBhOB6AZ214rgXHFqxRZ0ilYEQC+4XMbdDHvZxxbHbfffetfM899yzh1Sxp013/yKw/s6AGZimjgRFYAKOwGXAsk+l3wJMM0BcWWGCBFwcNGvQSA/ZlYPTb3/72lzhHeOG11157bvDgwf8iPpoJ+AT5Tt9///0/jZx+06prtiSfZ7W9hAPQxYDVgVswFh+qyO1kZb7UyQV08TjkoZ6iJhD/QzPSi8Dee+99B4Zj2wEDBoynnMJkXoJyhpL1b+eee+55GI91kNnjRCXPv+AdC+jlCF4TL4+M3TAC3ob84W1ve9szGI+LgW9yQ/JODOTnuDHahhujK8Hj4DO7eZsggXKXRs4lpN9D/Cnq+ALG49r7779/OeL1p08amP2YZwmjwYRfCwPxS4zA4wzIfRmM70aV/yb8KoPzbcAA4hoC6yuehzTPCBaGLsxLfCnC3wSuhv/xww8/fPdcSaH16TNkyBBd8sM5s7gcw/EF6vND5TMR7+aM46CUSzmuzk6oHievBZO3E953GO4L7LnnntdhMM9fcMEFC0azYEDdIgxA1rbU5aZf/vKXD15wwQXfoz4rtRrKzTff/G/wnd8ob0wDmz+gEX8Hxmhz4HTq+MT8889/L7Aq+Y6gzUvR/n2g30/cbUthqxJeB7TADRmit/G1OEbHviDY50/b3Xff3V+gLRq3PguoM8w8DTgJZ15p3ZSEsdiZQXgUcAeDc+kf/vCHa+KubwX+AngF6O8j2/VAlw+8zbhhgcFfWDEd0Esy6Ic/8sgjd3OY+YkmYy8CTL5F1l577Z8gbzFk7Me2wcPR/ZC7BrQXEHEEcu/kwPI3TKJdiMeHelYnY9Dyi3x+puoBKdp0GpmjXRiKFJl4eep4OHDv8ssv/xQT7qqLLrro+IsvvvggYH/q9B7zwjyPmDaE4dEA4WUUPIQmcNNTkL8CtH3mm2++WzFQt5HnXRiCnZDvVucO2htbFzFpiJ34IXwp5y+rr7baardOpJTy4IMPznP77bcPvummm9bnQPUbwAHEf3TrrbeeAb4YuO4Pf/jDPcBfOSN5CplPA8/gOT4FbdSdd955z1133fVb8IlshXYFr/vQQw8tTJsma6Cz/BrPOA285UYD43DKD37wg09gIIaD/9PS1E7oTzCYvw44qHXTuwADNiYrkyvo5meQx+DGS/gw8d9xNnE8xkBvheikHwzLLgcffPCxbD9OZXU9i/yPcvi3IjcYf01u8j8AbWXK25nBfS08yzCh4nYkeRjQGeyCpcM/Vc85MJk1ps+kQMrPYBM3aO+knM9A3IOyjgAfBfw/QP3E9ol6x43PG2+8EZ6D+TAO4cXg0ZSFFlqo6NUIGJal0PmeGJrbyHcOcBdyJ4BDz+ZVNmU+B+1rXOe+dv31138UI3EkcAuHu8+i/8fpl+vgOxP+YeTfG7wDeTaHtj54ZWAZwouDFyFNT2VR8FKAaRuCdyXfici5EU/0aQzIw3gk54K/jSFZiXy1Z4ICZ+bnLTcavWkskzUGPQMk2BlIgY0bZkDFQE7MQI8V1Tg8HQy6PTgfuOmYY45ZIjK2fHF+ccrDDz/8XSao156fx7s4AmP2bLL9+Mc/XtVbFOjPw3sqBmRfzlQ+zGT5XfJYD4HynKRJbmLq8pUzzjhj0Sahl4Ett9xyPDL/lOyEMxg4yzRiuIoNyw+0AW6j9MLCoKLTeGjt5ZdfLngJhTOboJsHXRU9ETyOMCjo5QPodDcMTDvh0LV8ygTfBXwYD+ImeP4A7UDq4bZtIXCMLzAsk37gbRLlqcYNS5Phf7htHuIfIP4l8AmUd8+99977D85TzsSQrIfRcutKUv2ZkRqITp2RBUwP2QziLR1EAgagurcmOuHPTN6RpN3OxHzDQc2gigliGHc7XHvSV2Oi3HTkkUeu1E2dOnHrx2MMJrSmYSw+iLzrGaDXnXLKKe/MdK8rke+5QZKiTHgDJ5FyM/gO0r6bkd5ibkw8L/hAT/wpXyy08lHmJEZMWvIaxiMIA8IBaMF7atYffYZ3h7EotDWMBd5HFGF+8wKrA79Bz2sD7fLKAy34/JJXLM2w2LhgPHGVLq0VkjfpxN2qLE78G9T1dxyIa0R2wICoM8j1Z0ZoYJY3GltwpYpl+CrQHMwoQs/jCgbZ6ngEK7Kt2RwvYC1O/N8F7XsMoNcB2EoM+oEDB4bnwWBeBrgNj2MXJuMkD06dcMIJS+BVrDVixIj9jj/++KXB82Iszkfm/MCaTK67ofkMRZEXY9b8/QkDuDk54Y2y/TIsGKYNO1DukoZ7C9TdrcbSyZ+yMi6WJhgWrEtiw0I13bRqXK+CCRfbE8oL41BNl18Z4oRKutsKn9toQ7cFnYSuNR4aGmnZF8qo5At9ZVxsesoXZzyxPELG5UmA3kbY7ahXzA/jgez+pz/9ycNyyPVnempgljcaSy211FYMkg9WGv0w4c9iLDbBWNxNuPlhoo8+6KCDjmRyrstA/bsJeCHhkjP5YzCDBwIn4Y7/Bf6jhw8f/k0MxcHgO8n3T/LcSnlHk98r0p8SX5E4qDgo3wP9FgzHGQzSOwg360W8adQa/OZppS1AHh/WWjASp/D1s5/9zCdQd6uyVWUnvZVmXUxLbLiVx7gTunF+EZ6E/ELyy2NYSLph6QL6ivYZznSxoGz0HEYkjYf0zC82Lp/pCcalZ3oDu0iMoxy3apIC5IMWYbFxI+D3EB9O3z9033337eihrPQapo8GZmmjse+++27BADi90dQ3GaQHs9qvgsG4qkHrFnHu8EcG3/qsen8nf5OHCRuehxi6tzL7keh142HEVyOsYQDFZxG+ffqzkBaTg7i4P/l3gOYTllX+4JOnCvCZJ9IYyCatzVnBzWeddZa//TDeLfz0pz8dQnvPJLHLPl150EKmuBUaZZRS/peSeZIiD20o1CO2btKlCYarQB3C6IrRaRgXtiHNWxd0HJ5J5lWuxkIwTWOQ+QxLk8cyzKNcQboej3USjMtj3eFTz009NGhddCBN/gTjwHuQ7eH2nWxZPp5pNZ42DbwlRoNbivX322+/H2IUrv7ud797Jvjr++yzz5r777//4L333ns54EvQrqZpFzBgdDFfAK937LHHHoF38F/oU/wg93EG3ueAlx2kDKAYZGIBeTGRuxNkepXeHa80eao4w6355ROkywP+EPhWDkaP/8lPfuLWw0khSwAGYwvq7PbLtgctv8gXQWQ0seEqPcNVLI8ZxIITGd3EhKeswNLNI7BKh7GQh5uUuFURu+1I0HjkRBfPP//8YYgMC251xNITlKFRMK91EKwXnl8cxjLJw7DLY17rYr3kATdvSghH/yWWT5Cvik2H9hHK+f199913KGmTbEtJrz990MBMNxpMnMzHFAAAEABJREFU5o/iLfyawbEP9fw0nfgN8FnArQzUJxjADwHnEv80QJ+3PQvP+ly93k68T5/dd9/9ATJ8DUCEHm4Jw0EE0sRwBFq+Ml0yFRBFvgjwZbr0xJCaA9hw0sXGuwPSfHZiD/CjeB0PYzxGYixOB65Htj+Kmy/zEc9gE0tLkGhYLGQ4sTTKEUU70G9xEjORot6m0R9xwGxYQ2G6V7BOcuPSFdCdTGnyiOVpBfOaZnl6GxoMjYLXvIalaYjk0Xh4GKsMadZDunW2DOnKa8XyCNJbsTSgH/kO5pzjV3gdepGQ6s/UaGCmGg28Cc8HfkPnDaCyTwNXAJcCd9PR48Gtn39gYD6Nwbi/NaG38T333PMyeH+KfNDET4armDrFhJrIMfG7SqvyGjZtItfE74xXcfIlNi3DYnNCc/X0duQLhL8JfQj0Zr9A61Iv0kmeaPBMc7KLJTrJFl544fKud72rcCUcWwjpQuaTxzS9ACeieRPkcWIbd+K+9tprxWc6DHPzFFeypilPkF9chUxPbFp3fNIsS6OhR2G93NJIsyzLZhGJ7ZMGRjnG5ZXPuDKynMTSq1ChhzdH/FOUcd2f//xnt5dV1jrcSw00B2cv+aeaDYPh1ZzewtsRstcrr7wymLOJTYDNgNUY/IszCPYBNCrn0Ll7ssqtwHbkz/BP04cB6ePQ5yH7dSAmofh/QkusuFWa4YTCH/WJfGKi8TE9Ao0v01ppxpNeDTeyRLkZFstbxeYRkm5aFUxz4i2yyCJlscUWK+94xzuKNyGG3//+95f3ve99Qc/0d77znTERlYHOo00ZdlJqIDQUhpVtmmUL8mPEm3lMa4XMk7g1vae4hmDAgAHxfIieh2XpdYwZM6a5XVGmdTNdsE7SlCk2bjixYeniBk3DoZFegXZcec899/jTA5Nr6IMGZqjR8LqUs4vPcEbh/vwW6mWnaSSOP/3008cSb344r3iB25Bjgc/hWWwPDB86dOirTYaWADcYKx933HF7c+ux3UknndR05VvYIrrLLru8hMfxZQbO+4BTGEgTwJHml2HBcCsknTzNCS7NuDj5jWdYbNx0wXhiw1XoiW7+5JMn44aTLjbuRH/xxRfLU089Vf7+97+Xp59+uowePTqevXByaSg0InohGNBoB5MmziycnGkg5HUln2+++eKMI3lYmePmyfTcImTZ4ipYH+U52Z3gTnzffGZYmmmt/Bk3r96PxsNtieXZNvPbfuslzbj1ti3VvPIYT2w4oYXmuYYPiV2K4ej2gb/MV+NJNTBDjAbnFvNzkLn74MGDr6NzffvVHRS9EavJUngVvyU8zR8G8mMMhBcZaCfizj6GR/J1hGqUQN1/MBzPALuQui0wDmh+kBXhxMiNFTXjkdj4kma6uEEK1F08aVVs3sjAV9IJdvup8lYZ9CbQb1l++eXLhz/84bLiiiuWD37wg2XZZZctSy65ZDxz4aRyEqYMy5LmWYL5NRCCYT0U6Xh3sa1xgjp56b84oHS7gJ6jCsoxkFiD8NJLL5Xnn3++/Pvf/45H1S3TsjUy9HsYIWU54f/zn/+EQVNeyqjKy7B1tX4aGss3v3XSoJhPgyJOfssUjCc23ANoOD5MHS+4+eabF+qBZ3Ymty3IH31r2/SupltbZojRYJDMx4A4BwOxHrAxXsOR4GuOOuqo56dXzXfddddXMQBnM2j2ZoAsyoA683Of+9zj7373u69mRb14cnD44YdvceaZZz568cUXl1a46KKLyiWXXFJ+9atflauuuqowoMojjzwSk4FyovqJI9L4kiY0omFwMk4dI25a0gwnUPfyl7/8pdx4443lhhtumASuv/768vvf/z7gd7/7XdTpzjvvLNdcc025/PLLi3UeOXJk0dtA9+HOiwWMaxbTBZvmuYaT0tXbOiaDddQroA/DGzFN2dddd13BwysHHXRQ+cY3vlE++9nPlo9//OPl//2//1fQffnCF75QNtpoo7LhhhuWbbfdttA/BWMeevznP//ZNEYaJutlGT6FajlZdhWzhS2//e1vy2WXXRb9dPbZZ5dzzjmn/OIXvyiXXnpp9JHttr8uuOCC0IP9qT7Ef/zjH0Oc7TEgfuihh4p5LrzwQvn7kW/t888//1bOgQ5gC7dPA/Zt4Iy34k8orzeAnE9gkPcCK6Mqd1/G6G7M66neIjHWB+JFro38PYGzKOP3wN+A14A36ON/YbSfpZzXib8Iz+Pge4lfQr7DiH9GGb1pR5VnKoxGNXv34WHDhj0zfPjwl7tPnb7Ul19++Sxc8WfZqrTdcccd72XV+zSDfPMpwb/+9a8VHn744ZLgYEpwAnPKXu66666YqAysGPxHHnlkTJrf/OY38YMvB2G2hvIyGNi4II8QxMaX9EawOGlOPvnk8vOf/7xceeWVMcHEguU4aRIyfhmT6LTTTiunnHJKE5zMTuR/s9JneW4v0E94AM8++2xsW9y6PPPMM0W66VkPscYL/RU9AVfxv/3tb+Xcc88tO++8cxgB2+9kuxHjNmrUqDBOHqrq2YgZjPEwl3LRb1GHGt9jjjmmbLfddoXtaqGfyv333x/ei2XqTWg89CTMJ01Q91tuuWUx76mnnlow8oUbpsI1dbPN6sD4WWedVc7GoHDzFDzG5f3e975X1Jn61lth4Sp77bVXYWtc5JUP3IYBWh7DdQR6O5KyBZ/CFR9ZoUW8kX7NQgsttDXhyX3mRR8Xw3AN3ow/HjR/axk/YmLfucQSSywCX68+iy666DuZ+N9E31fTVy/QZ79Hvg8jfhlZa+NZvJv0/u95z3va2JK24TH6nldlzwefr5xYgcjnyLcfevkVMp6B/1zkbQi9Vx7JDDEaFD7TPvPPP/+HWXkWQyHlxz/+cQzMTTfdtGw6leDq+elPf7oMGTKkfOQjHylLLbVUrJA2yIGnG86VXcFritUO5Zs0CTDYJqFJoKOaXod5qXsYoM9//vNRZ7GwySabTBKXLpgmGF5//fWb8jQE9zMhxRoHjeDfOeNwAr/wwgtxzmH9BQ3HE088ER6U7dJIOHFfffXVcu2115bvfOc7ZaeddopV3bZ84hOfKF/96lcLZ1SFc6eC91gOO+ywcsghhxS2ouX73/9+GTp0aBgFdePk/OIXv1hWXnnlokdj2y3TVf7b3/52YQtbbr311jBQpuvtMIDjty8aPuVpjGyjbU2oxlvDxq2z+SxPUB9iPbIbbrghvCPHhrzilEu4fbPNNuuHt9RRBWjNOJMrfvinPDylT4p7AngPYBJvTDnN/MpVHu2PyelYIP+C6H4l8GQ/yFsPuJC+GgXjiXgo662++urzbL311h3ov9/RRx/dn4VjHjGedP8DDzywPzrsj6Hsf8IJJ8xj2hFHHNEf/fTbYIMNOvCsKD528wPp3y2Ay5D/BHAY4O95KKb7z2xtNFDQkkyMO5gkvhYwJvknP/nJ8pnPfGaqYeONNw43e6uttopJs//++8dEcNWiwwudFZp0wruSOnncpwexmy96phvqRJIr9j/+8Y/y9a9/vXzqU5/qAhquKq01bprbgg984AOFDm+CE19j8Nxzz8VzF5aU6YargMGNqHn0LnTpNQxuKWyfKz0DMIyCBuCjH/1owZ0NI8CEKKykZdFFFy2ehYSgxherW3nve99bNDS2Dc8zvJVVVlmleXOjN6fRUa/0YXgobpX0Ns4///yi8bJ822hbE6rx1rDxNdZYIw6DrYrtXmaZZcIQ6SF57uPWSb6ElCtGx+1AR08waNCgOERWNjAe6PbDar8Q/f5t6tLuBK3Kw0h1sGVoU7+NzGMxQD3eEOLRfI5JfDe8V+ENbMqiNg86649O+2+//fb90HHH0ksv3U6ZFNkWz9/YJ+/kloxyyDbxY5j+amMhbMdAdihDo2LdKCOsB5z+CtunpB+D96eM9W63TrOt0WBAtLEy9WOP3+kAxqIXJyAN79PHvCgoJoDYAd8qgN6IZx8cWFjrQsc3B48TTvfZQSCfeRNTx5jMScu46XoA1L1Yb1xJWaYK9CIyY7ZF+QKDMQ4gDSdPYld3wXpbjx122CHOC1ZYYYXwJjyPWHfddeP6NvOIlaWeNAoM5jCiiy++eNMbk6cVrJdyv/a1r4Vn4jmIdVMfegJuf9wC6i2a1+2XBkb5xnsL9t3VV1/d7BvjGgnPpjwfcTHprazu+NxGWedGWo9PJtPeXdDT/JQXHkWDP5A6Z7yMs60NWb/EwPtqxkgvpQSm7asCv0dPlyy33HIf4Qaw36GHHtqfRa1DLyGYKl96anpYbHWiTzAEhe1JhWPSIOltej9sO/t/61vf6sf1fHpS/an/trTjsklzldnrXxgwkAfSwE+hvBFM3keYMH9lhRy44447xoNHrk7dNXJyNDqguFovy62D2JsIV6ee8tCJcdCnJ5I8eDrl9ttvDwPhQBBMQ/HNAVyNew3pyudEchtk2tQCOmiWwSCLcwZlaQwEw1kfw9afA7B4noPBWg4++ODwpAYPHhxhDzD1JuTtDjQQluOgt33J40qW4clhB7O604PTK5TXenpmYf+5XROzAprUJ7Btv/zlL5v6YFUOr8iDUvt3WoyzFWEbEbLVJ/C6tFZglR+EXnbF6LXjGbRV0z2/wUhOcKEhv7J8FcMPqzzofiBG2f+RczOG+eNs8/rtvvvu/RiX7citsjbDGiINhrhJJMCk53vKH/ty5ZVXbmfr2Z9to0/OZqZlCUziWExCgGmW+mAc1sJF/gGu7N0MuNHs6a5BebvR0PffdNNNBNuKbqyn832puB3nrQgHYMVDQuOZH7csgz1i3MJwwZPhtttuiyAVcjBEuPrlIBGkuZI6UTwclF/a1IJGw7zKYeVoPhyFfiQ3bz+cULiwxUnvNsDbGFd48++9995xXqExiUw9fGlg3dLg4RXb4C2Kh4quwG4resjWLVnDTH820wbh+msslMsEiXo2E3sRsE2Mh2ivenaCsooWvSivgtkm9ELK5FkcK3Koa3C3ngb9ugNpC3fnZdhGzhbCy2jIGMlZ0yPwxwf9r8BW1xc+7/3lL395Xs4q+r///e+f7BwdMGBAbBnt70cffbSTreV4th7jOHfr7Guf2LfcPGnIoj7o8SYCzTjh+Ey2QsHxFn1xyj4Qg/FdOuEWKr8v1fCFtwNUjhbVSe6Ad+I5ITw8g6fXHwcnCo7tgQNqrbXWiqtMBVCmaIrwsY99LLwLGfF44kDTMPUVNdOMOEgEr0rdz3t24CAybVpAHZjfMl1tnIhObldVVr3i3lZDIU2j4UDytubYY4+NMwdWljjsVcbkQO9Cd/8Pf/hD0VM46aSTim3xHMSbHg3J5PK3pqkL8ybdrZ8HsB7SMuGS3Guse85NSBhsZevBscDEQS4rdjwZ22thPTBqHEnSe3DevAuPYP0qMOk3oB8OwOh14DHIB/vEj/Xj7KaTcWpewXONP5Jnc3S7DXL8T353shVZwbOGtddeu0fPYqLEEudD9qseEAvrBJJoVi8AABAASURBVLYYE6644orCAtZGv07IsZH8k8PqDM+zkxuzppFgrg3vLk97d8SeaAzAtRmI7+0pfVroQ4cOXQAjoVexMwo4n1XnZSbvMTTGT+zNNQ6uKLpdDlTLwyLHk5CGewsOTLcTCO6SRYVLcPsgnhK4f6zK8HkKn+sQbrnlliJI83kK99oaKq8g1+fGQ3c55bta2KaM9xY7UW0LeooV9r777iscDsfNjjcc3iaJ8dIKq0/cWGyzzTbxfAcDLJ6tUKdTKs8ViEEd3gUubNx4OCE1QMKDDz7YxUBOSZ5eAAM7DmrNL7hd0xCxr+6VEWuUEUj9acBYpWObqkfgOQZbrU6fktUgBeM0fiG3P0bBh8L60e/fQtyVVYD2a+KLsghNcpahDk888URY2nT/+8HXQeRo4BfI/Dl4Z+o5iK1IB8a9i8GBt9uP4882cyPiowHM8XbL7UBeYG+rus3YDZEyy9lnnz2eeoThheVBPLSrwZN8+mI0OqiVvwt5DDf4LFz4bk9WJylh8oQ2DMSynFEMR/bTNNYX4JwM3oZs/go0BiNp8R4HPQwb9corr8Shp+6nq/Xo0aNh7/3HSeygb82hbGk+yCSeElivKo8TwQegBFdNwW2ARkRwYOsNcJjVzKYM9BmDvUnsZcBtVRoMdBa3BnoCGivL0123TB9yuueee4pGxbMHJ/6HPlT9Fy49F9jR0RE3JL/+9a/L8OHDw3jLbXnqS6whl9ZbcJL7jETmFzdW8Tgv6q2c5LN8DhejbtYHeZ30ry/tCde9t21Ned1h9axxQ3YkW04EKl+ktbOdKNxmVKglbob++te/FlbymJDwOa5jRSeMijs69Ji9nSPeJW9PEY24ad/85jej3x1HxgH/XYb/kyduUoj36oOn3MmWZkKWT/uOI2MnMMmnfRJKDwSsmv9bpD/Wu2PVVVf9EqvF4wz2nyy88ML+z9LIxWBcknv7XTECPwF+zwp3MUbB8ImEjyI8FPow8OnELwH+QuX+QkV3R8AgwqD/fYyrDAe6kCk+7GR41113jecMcO/i9kNcBepWMp5hB+yttzbftK+Y6EgDtCtWbOrTzGf+zGtYyLh1M1+C9c1wK3bQObi5P49JqBwOyuKxb91+w0LSW8PGq4DX1zQ01teyJwdMoni83CtiHzdPWdXyuqN5WKtx4r4/JmW2i5EeQcv2NqRVjnFBmYkNM2bC4OslKcD8gnV3wuGWxy905a3mM14F22+cbUAZNWpUXNGmPGTFG77AbYzXLvpuldkaV2aVZjnG3fYhzyK6BdKcS23bb7991N88gvJcKPAyYpzBZ34no5O7Aw+z3cNob+TkzTytYeMJttmDa+ZPnMc5DpUL+JuqcRTQpsfGnI26ZBvMX5WfcWXhuYeXQV4/T7FwXmCgO7Ch3dEnoT399NOv454dzIR9kxPueTmR7qCDv0SFH2T/fC2VWe+YY455koacxJ7s60zyLbDMl7KCLATenrz7E/4+g/cA8DeJbwZeDmgH4vcK7s0Skubg8vxC78JbCgewzyF4lcZ+UIsdb8zW4xCcmILhhIyL3SZQdrN9DtiMrLfeenGnL18VUo5YupNc7LVp5hVXZRlPoDMjuP/++8fVbcrR+Oi2coBVlKcnJRYMyycWkmZY0Pi5Z80yxUIU1PKlwfJcwzMctpfNspRjGa2ypZlm/ZTpk6ZpJGyLYemG5fX3L1UZhgXTlGNYMKxMxkkYIPMrJ6vrMx3yCfJmfsNJMyzYfjEeb+FGrXlrhExX8JiQThoPrOXN/AsssEBx3JhXsIxMMy5IEwuZ1zMJ64r8rK4TP8O2J7yMlVZaKfSrTOU4VnDziwf15heQ4TMenlm0s4CW1VdfPfJYnvkEw+YXC0kTe47BgWXc2DH/sg62W7mxtRkyZEjIlD/boBxlSjMsGLc/kRdeBnVT3gl8dflBKfHmp9dGwxxsA05gAj/D4Ov04JCC/Ic4WvMhWMxraMwTDIr9WE3+jxX1RQzIeSjlCxiAdwFfAi7HCLwJDiPh5K0CxiVWT3HSCXcSJsuYNwi/yRkB7eos7smffPLJcM18PqMVTJMmtsMMe1ty6aWX2pQEZWmdw43F8JXHHnusVPOYT5AmKEsszW1ACpocppCivrTs5tXYuN+kPfHcgmFppgnVsHGhO9oDDzwQRrO1bAdmgmW7Su62227hHitHUKZtqIalCdJMe+ONN+LJUHGW4QDLsJhDv5gQ5jOPOEE51bC608tzEpnXOlI/1pHxnYydeCZE/mo+40J3NBcQb0dcTJTXACePE6fNB7jMWwXc8C71TbnVuietms+fGyjfOotbwP9/0+ZZVTWPcjj4jKdlzUdb7S+NDdG2Ds/j7Bv5hMxbDbfSbKsPFXp2pcFoyLTNGgyrFXNag2neVlnGBdNss33x85//fHz2KxV7BSFnAj1+ooAeUydNGMvs3YUDtk7dKe/B3YvhffTDEvfjUGYwjRjGIHuWQXA5BsRHbdtYWV4Bzgc2ZdXzv5/tAd8thJ8EvwIex8h5FXwf8bOAPQlvxKT6IIpZHNlvBwbRuMU53R2vZUZ+uGbwxpaiig1XAVl2VjweTd2arYJHN1aFx1OZKhCjGLyZB56IJ066E91DthSGsjPYBcuPEY1rYROUI5bmWQO6CxdSWiskbys949YB/US0u/It28HgcywOzmCsfKV8sVBJitX4pptuit/fVMvIcpJ/lVVWaWZLWuJmQiPgKu9vRaxTgwRrp15Bm89lpOxGWug9w91hvTQPT82HIPntSydlu+31dquaz3LNo16kmydxho13B4z7LmTLrBDanaQ+cSotZak3++iRRybeqjbyuKJ3+IyKC0nymq8VWtOUpw65GdGzCXZk2t40GG6B2vQq3ZIEw2S+lK9M5lVsTYwj74wXXnih9Z+WdZHSV6Phj5+uZALfyO1D5/333x/7SfY/4SHoBgHtpLczOTdh0l9HA55jhT0al/A9lsye+jn2xz/mVH8d8FJsNRZm//U2rN+CxFeGvgMwnPBvuRb8y7Bhw/7FzcobwARuNX6AjH577rlnsTNsJPFefTBo8SvSCrPKdsB2cD5T3JpofSvpkw162ImCJ8tjIh5Y/CLUMowL6CKuZ73R8JCuL+0wv+DA92DNsNAqw3RpW2+9dfH3M/L0FhxI1ps+aA5O8iKuU+NOt44bi5GfoGemAdcFdzCLnZSCYWkZFltfPTkEIa44yR3sHcrxEfUg9vLL+rGAlJYtmkaDbmlr18uQpyrOG4K+3vRkfo1G1lua+hUDltfmNTEBov/7aLh8jkV9NtIcb+0elHro+T/O3oWU5w1fttn6AOowBYSH5S+N1bd9kGBcqMbVh4ef9GXkp45vEnBrAur5095zUs8pjJqdKKiTbUO3THaWk+Rtb3tbG/vdRbgn3wPaExzg/JoBsgmZ5gXiwxZnPCvhWHEQevgi70CSvuIk88EgFUe81x+2NUUvAsVEHpVNOJS81157hRHqqT2RofKlkfSWokLSwlejEXZgOTioe8T9wqjGKs6BcRgOJzR1MalPYB3oh2oeipswni+6ZrweVLxjg3OnKk+vwg5OfyXq+ZIZrB+gTFCnxtb2tn/pS18qnGfFOc3iiy8e2BVX0BOUVg2zooURQu8aDCeQ4sPLcGIZ6S044NPLaOSJuiG73X36Ouus0yBPRNDjB3t9HTcTc5fYTiuDQoJk2AC4A4+6tBo96PGqAhdWw/IKLKhxWKrXY7y3oH7sb2+JKvI0ktEfDTmekxTHXOrdfnD8GReMC4atN0ZtXNaFsXM+3vazDVk9oqkyGrgvj2IURjA6rXSPwm0cnoQ/+Z6XK7sOrkg3GDhw4MUMphdxz3/GirsBmb33BsWnfe+9914hQi1fKPtkSPOSXtzLUjbR3n0c/BoN65M56ATvsvtpgLxN8KA100opkw2ed9554VklE7Iy2MTWT3fVA6kkykfb4x0Y9913nxMvTvYzvS/YwV9tD4PZs5mENieONwd9kSmvdXz11VfjXRU5mCjH1aw5OInHuOnJIJGuqC5gn3n9W0mzru0eZK655ppdeKcUsV6ej+Cdhg4b/NaxjXC7ZwscxBP83ycNIeNIg/W/hF6G9DRkrdQ/onyF0bNOhJsf2+W1svqUSP+I2vytEZ634T6BRtKtXUsm29wkUbc2vQwXJsJNeqPsZjwD7hZcSBtxt03DG+HJouj8yXL0kMikOARFvco2pAeOiWQnrD+H1hJzFtLBTUF/VrFBnIlsiydyBRbvJU70z8MD2ZjrvX409gv77rvvTcApwI/Yv12Aobibrcn2TnAP3hyAE6X37tu9uQdgVW4U2Ub946yhNa3K1xr2uQuf6GylV+NY7Hhz1le+8pXqoI6nM53s6KF52t+bvWdVdoarOqAtknNSo8K2dvQbB4sm9AWcXP4OBCE5uRDf2bo4MBfa430Z6kODXIUqLcM+41GVSZ30NLrdRpA22Y8TyHeJKE9GKwi2/e0sSqVqqKFHH9jHeod4vNkuk3oN6YVSVuaJ8tyCtRo962V5VSMpjbE+Sd1S2JSw88xDX+UI1KOLwSC/BjN+cKbOheyTDCdWjml4amMbstTJb/FeH0bOFD9TbTTwNjws2YMJ4meyBXFF20zHQ4mfreNmdbC/7Yc11oB8EfrIl1566YWf/exny9Ooc2mMHodv5doSF29VXTOMR9wAGG4KnELAzvYhK+RNwunj0N6hT5LQA8E9OVfNMQiThdkTQTqxU0VgTLXYcbDq/jES+XI/6YDGEIaLDsmO6vEQ1PTJgWc62SawAzjZO/RmfHYiCb3FGlEHu7dCyMx2thoMxfkIdDniiCPinRrckjXxoYce2gxX6TmBlIuu1FFM8HXXXVd5vQb1jQtdHnrooayfea2jk6bdK1b1LDHBie3P7S17ao1GN54G4tq69Wo0ar68yPJpqyjgi1/8YrPvg9DLLw151r8hz/62zU0JVMYbnHjpEDeWpdoPxu2LxPYb4fEuYOQLPdL3P2oKm0Jgqo2Gcum8c3CFHk2FSusOvK7ypqA1DUMRBuS0006bh0HQjxV4fg4kt+CA69Szzz57RTyUXzCA98SVf81foOoOOyHWWGON0ltwAHntVS2bOhe3GE7g3srBCyo+oINRqIpq2InxYwn4BGJMBg574wdgno4n6CH5aHPVQ3BvqSudPH3B7kftcCvDQHIQGbQ/29BnvIavL/Lk9VDTOlblIrvL4LSQBPmcxOKEjMsjrRqXhjzrKrT7sh69AsvuLVhH38bFIFecoKzQu8aByRDX21V5Lgy5cHDGVlZbbbVJeKr83YW97bA9UeDEY512x6IPZrXye4bgSl5tO1vzOBBv5e1NXHlXXnllTG7rgA4n6RNoem6xEMmTZRsWrLc4gfgEecDmOYUF8XbDvQEHWW/4euKZMGbMmK8zkTqntPprKXsSIt1VWUuMVzLPgQce2IbMBfE8tv7zn/98HBNyENe1oTQb2ltQQU5ny5vRAAAQAElEQVRgsWV4iLr77rv7nH4x3Fs5KDTefYmRjDooi07yYFBodiDldPiuTA2BPFUYNWpU/AQdnqaMT33qU1WWPoW9q6cOXfIgu10Pw8PVLgm9jIwePbr4XotkR16zbUkTU65PHTpZCcYMamLSI0zeSDcuGCdBl9q8cSXaelgJ3xQ/1lGjgTwHu5B1bPdWzTOLViF6h/a1dD0NcV/BbbZ5aEP0H+W3u+hUjJfJAf48PwKVL99XUon2KcicaHoolK9es81VOdI0nqY3ocGvQQlaI/5vMt5D+Br08g22JXsS7/VnWo2GJ9K34zFcgtGwUj0W7FVR64rfE/NXv/rV+Pd+dEgbstucBF5T0ciesnRLp2OLP4Ryggl6Fz516CFhtxlaiBiuyO8zBB4OZjL1iA7KeAN34Dm0HXDAATGoGrRADrg837BOEpERtxuG+wp6dhqhlEV+da973uZr+oj3+WN98qBNucT92M7uZJmmZ6UB6IJJaNIMVwFBykN8WzsLQ/xKE1qfPmxfm/wIst1OlLg299qzmdgIcBYWryaENyhTazRYuCJ/yuEQP7y5IFa+HCcjRoyoTvJ48bLeQoWtxyDzKLZe/j5K8Dke5WW5ZFSHoEk/6NpFLPqDcGC4Alfj0HbheGENjMXGLIj+N0P1CLl3n2k2GhbD5NoDPM7BDO72Y+dddtll3aa1EjkULa5C6YJXvYVW3hkRt+P98Zmuo/u/Soe5srlaCtWivepqP+GEE8LYVRPorOLTe9XbGWgO9HgKtcrb2zAeWJMVWYbt9PbBgwcXf78hoa+gTPfhrDyRlTb3ODiDYSq/kNvuNkKPqK8i1CGH6E2jTNuzjrHq6622yvS9oNkm+JsH0K18U4pr+Ks8Lg4saFVShDmPaxoMCbS3eDVtuCewXb4mwMXSCwM9bt9V4rnE97///fixpnmtP9i+jps/wv5atgtQXpd4Kw/peh1fZY79llucoxgzA+Dp02e6GA0s1lN4BYdhJSeA4+bAfaT7eCeeK4CK8JCNc4v4rcB+++1Xdtlll+KjtF5DuWd0r7nccsvF3T+WsPhEn4bD84yGwvrUuL4y+0tEV0Dr7M+NPbFGyU0x1MFVNAdq0l3hOzxo8nYniYnvvvvueP2+cgRkNJ++s23J1xeMvoMdWc0JhOz2HXfccaonhTcLyEi5iJ7kxiTSpsNXTHBuzvosijOuyNOop5PHvmh3zHW31fOBPid3ZOLLfGlAiPbpkwsiiol3onq+1irAhdEzDsuRz/RBgwaVFVbwTN9YV/DKWOPguQ5neEXsC5C9ThY424ufNPgsjDmR64TvB3aRctwR7PqBr0k3bGriRrgDr+kT0NanjnuxQO5LuE+f6WI0LBHl/Ah4Ztddd+3kHMIXgfh8Rrj33JCU4cOHF9KKB21el7lV8N0SrgQeknIVGw9Y0Yh4LFyaT11y5Rrvy3Cb0RNcdNFFUY7pGRareK14K914d+CgzP0yCrZZASjXZwr8AY8DNWiVrw6NowPUvWeCOuBwt/hezIos808gb5uD96677oqXxGSe3uLqoRiylBlXbXoLvZVR5fP3IA52ZMWH+iozwtP5i/ndEf++oFr+lMKeETzwwAOxzVBv1sk+EVNXX94bY60qx4NPV28mSNOwyu+tU5Wvt2H7yvyUFz/fd+xW83qd6XkQ9ZKtWaa/nPb3TlXec845p/jzC3906fj38Pb2228vLlgezFcNqu3NbT2y2zwI3n///Ysgv7gVNJTSusPMvY6qN4p+3hUV7sPXdDMao0aNYmF+49t4EuOdrD3VoTcPHLHdCcOhDJXoVsHrIfZf8dhwK3722WeDLo9hDyydsJ5uq/SkV7EyBGliwQFhmQl0kh+NRet2JFjg7+Ampk1X2zL1APSQxD4bopG0fPiCH2FNOe5xH3/88XhqMPOIJwfKNd0VKgQ2vpDr+yiLRsP03oCyBHmdSLrflXpq2BrSm8gVzBfHuNJNFsjRTCesKw2KTzyX0aor65B1MdwKLEax2GBxQkjjyzo6fttciVvz+HCVC5X6lx8dieLJTnktT2gNG0/IdOPqVgHWwStQaZkudsvF2I+tiWUBYXj1PuVNcFx6u3XvvffGmQ6Tpiy22GLxdLDyW8GHr7Js+8d3sXilm+AWKWVPCXuIjJEo3mZSvygK/fw2An34Uul9YJ88K8q7jIbddsghhzjRumXedNNN4ye73SZCtFE2CDnF5zK0sk5okkrSxRkXy1vFHnp61SpdpVbTpBlXhlANJ6+0BrgdaQS7IvI6idq33nrr5tOh0IJJzDVxPFOS5ZlA2MnkE7Bt7CUlRZsMmId0gwHdhZPHXydmOrROOr7N7V1kbPlKvlZMvijbCZC3Cw2akzEGfEWU7rB7ZceL7dazCQxPYPIGNk5ZEZZG2DwajthGvPe9E1/8Rhqs8fuTJoY3wn5lWKzx1303bBp50/i2u01wkZGe6ezXiwbZLQW8JgkEO5seAJFofyOhGTYuKEueDLP1Dh5vxgxLN10+H9DzNy3VekAnuTPey0JY9lgg3H74S1X6LLaSjnc9aj3VYGr5euyxx4KCsLjB80Eyt+2C23m9kpSfODI0vpImVvcjR46MX7QaBx7F0Pi2sQZ375Ad2jvOKXBxmrwGyjsRto+wyranYol3+fiQk08rdiFWIipRBalU3Tf3dVpiB444wbhQjS+66KLFp+7uuOOO5ktZPC2XL9Oq/NWwPK7+laoYdPCLJwHqF9ernt2Yl5uTKNuwZdl+O1X31F+CCiuvvHL88yDDgrzmS2x9rL/xxIaFarzqadDxUceVVlopVix5U6bhBGVX6RkWu5WygcgSaTTECZDbOnSnPbfxYG7o0KHx8NBQsHHBtIy7NXRykTFkgP3ENoLDt9BTtsfyraPYOiY9sft8Jw4CYtKGwFI8SNaQxc/RzS+/+Q1rQI8//vhY9Rv55Pc8IB7bl8fyxIJ5xdIynLIy7jjSy9DzlZYgnw+U+QwPYyLqyPhVh/EinBwfektuYRwXLk7y2hZ44xEAt+XGW0Gv3Wtk2/Htb387HgZUh4LejZ6Kdbc+1sWw7RC3gmcrbNviTK1RznFg6wrq/WeajAYVfz9WfSjG4hkm+20obweuh97OIOxQyT1Vo6ctigpETmTTy1DBumYqzA4TVLayxULSxEI+eagrFoL4UummKUcwnHkNC8ZNsw5kiQ/lxApJJCYmOD7wdeASt3nSXc0HPVYP5elG+szGRhttFP8nxbgHvhpMw67w5rU8sYLFgnIyrqwMm2bcFVRaFeiLmCSmK1MsfxWSX5phse6y4QZ0ggVQ8+M/4olX2GXfKN/UKnaVNW65rn4MzphAFb42V0fLtH1iwTxi+cSC6Rm3XUcddVS0rUHPQR5ehjTBfIITxvMxDyWV0YDME3Lkky6ugnWpyrIt8klT5y5ihgXziX0cQC/DyZu8YMtr89URHv77CgW3JI5lxhTJ//sow+3ajTfe+D9iJeQTzfIMGDCgMK+KL5FK0EPsrs7SrLt1TPDcDS/HeqX0Zyn3/Iz0BffZaGAgFuXU/ztYsYdQ5KNU8GAGzGJsB9qwhPP6CzvCk62Dq+zyyy8/CQ9yYqCppA022KD4HgLkh0uZA9ZMGZavmm7cg1Z5UEjkk+aPl8TSVaI442JlSBNrvQ0Lyy67bNvSSy/tu1H7UWZ/jI/bi350SLsv6JXf/ILeRXoVGhPDYsH2Gk9s2D23+QTLSlmU06y3NEEe6fKh80g3LJAe/6vTydWIRzr00GXmU4bp1fbr9TGQwtCZRp5Wg0G2tmZbSQ/Z8lblwhST0XQHpwd/0gR5xa7+phsWm9+wII80w1U6ui96jabJIxB2a+K4jS0Z8aiT+Uw3D9vjZn1Id6I022UZ8lUxPJJCjmHB9Cp2+6DnKF3mLE9PIsuTTh7LM1iW4yZQY3D66aeH56vBUP/wRHpiI/ZDNS5NsF9dPDVKXgr4QNk+++wT//XOLZj1sE5i+ZVhXCwkXU+HesS/T5APGAH4U3hQ3z4qf4o5mBCDMBRfxn2/iQOzZ8hwPI1YTuuHq9UOhMI95SatVx8nXZWx2sCddtopXsbqoaY8KiGVbViQX8iw6Z5lSDPP008/LYqJo9GQ3goySBMrR+ygEwu0N/4BsS/p/chHPuKrAGMv78QdNmxYOemkk+JZfw+WFuMw673s16ugrGo8w9I9yLJDs3zrn2HLroatW6Z7xmM80w37+w37oEpThnlMN2xaK7iKuQpmOrzNAS8NiEelWSCif0mPA2rlGCY99GvYtlieC4arqrRGuhO2zbMH4/KZJhhWlnTzZti4Ycv1ORnTGrSoH3nb3Y5JJxx1MMwYjStKFwz5TQNHHrB9F+1QtgAt8oobvGFslJXp0gV/CS1f1lmaWwKv6b2hS354LC88U/9VhA9nQYvxLBbMm9h89gNb+vi3oixU8fo/H1PwpcF6ExoN+eUVm7+joyOeajYsvbXO8kkz3cNY5DcfGyftFRboM8FT9Zmc0eiHlduQyfBLKv0SyjoHl28dBqdPacaPjax4tVSvAqvbgmpaa1iPRKOTdBoRHWgjTXMiGjadsptpKkgwTTAsGPapU7F5siONa+GTxzRBepVmGdIdCGIhB58n2D5446Pn7ml9QlQYPHiwT8QWB4YHvB5S+RpCtmjxT3rS6CmrCpbr4a51sGNNkyaWJhjPNOtmXHrKNCy/oItsPEHeBGnyGM+wccNeY2YZ0uBxghsUYGlr90lW6GEsJMpPQkw+46YJhl1Z3ZbIY1yQV53lWMk06ULGU4Y0ge1fSbc/05CXE7JNT1Q+0xIsv5tVv9km+QXkRP3Nl3F1LF0sXci4PC4gxq2vcUHj77Vn0shj/Tw78bwlHvTzwS4XLfnNL8AnCmBuBWZrH0+YugWyj10Avdb1Ony++ebzyt9zGXG0xy2+cqpgGUIrjd1B+cEPfjDONAsj/Qy2Sr7Wz2ifYRKjgVexOoWcyOR5Hnf8cvbgm1PB/qwg7U5yJ2BPpbgCewjWU3qVrnvufj9pGg3D/rc098QeAEnLThQnyJdhFGC0+HP17IAg8GV9QE33u5pH2eYVSzcsuFqZR7DjvB1xgHqX7hOtGibv3PWqNBber+smupVyhXVFdU/tb1z0AHRpfbDNF/0cd9xx8aCXcvUYLNtVRlwF22E806yXccG3i9n50qhjDCB16aQ03byC6ca7k2GaPB7MISM/DvgMO6k6fMiNMRC3Q+pIeearYmUZF7u1qz69C836ta233nohQ77Mn/VKbFqCPJ5N+OyIE9JKIcv6gTo7XI2diMlvumPGq2PHjXEBPZnHYACZw/iJLcP8iaXZRkGaOMG4vEKG1bnviuHGMGTnF/Xqz6VAWz4j4bmGfZPplkO9ImrbjTu+NBoaPRcAx6085ltxxRUncC7ilsxHxMWdzNHigmV9BIVlvcSCck1j4fcVBvHbMGnwvolOTwBP9aeL0WDCfAHBt9KAb7JaIk6+1AAAEABJREFULsjg73/qqaf287V0KKNXhfziF78Ir6A3zBijYLORBlSU2xYfpHF7ocV1ICRk3DRpiX3WwgmtjCqwlYqoJ9PJa74E5QkZl4f2Rx6/HDQqXhrbscJ1leRugQPh4lOJ7js1nFtssUVcLZtPg+YK7HsqfAJQb8SH2zzQ8mrW2xDrUQXbpDcizfqJpWmcrIC6sl6GuTYrlmO6fObLPIalZTzDelFuTSpynOCKEzpY3doYsPH8i3lSdjUsLeWqK9tonQSFKHt5zq6sg7zmFQwLhk0TV8G2eKCtYU05YFdaH4pr05hZrqAc+436Fg27ZQrwU434MR3BiR/p5hEsz7LNb1iaYFi62HimJ5Zu2AXU2yImYIx3F1MMV7u3TJwdxC9pLc9zIz1Qa0CFNMYG47kMdeYio6FQrmD/mk8w7+9+9zsNReThi+La2z1It26CdbH9YkEZ1t80w2RQL/HeDGUi4zz6/lnwVH+6GA0s2+fZjvivCufxgSW8ixCstXJCRGQKX+7x7HC3Bw5KT+eNu6pddtllxVe+eRbgibhxb0l8eg3PJt7TaVluTSxGJYsFG5xxw9IEwyopDUTymKbFNu5qKZ+0xIZNEwwnZJszLn/yaBCTPiWs8bPDLFuZiQ2zzYvnCHzEXB347wQ1NN7XqyuMddEQuBJlOdZDaNn+xUR3gDBgm///NOtr3gyb13hijaFxoUHLVZlqt7f7rhGNeeYXN/hikphPmljwvIaFJs4EGnzWLSa48eTtLixNGYJhn1gcPnx4c4KR17opz393GA9FySvI7wRWV+rNuHTyVCebpEkAnmZbJklsEOQxKE7Z6lpDr95RVlzjev7gouBvphyPep/3339/cXvhguLNmTrdfvvtiwfiGhnPLTw4TrmWY79blmEW6k4XPMPweE7S4TaYsKSAajgIfGV+DSmekP8KMnWpHo+HZZo+XYwGlm8EDT6DSfzMhz70Ia3lG9yIxIGfHem+3qccdb38EZZ30/7q0BXYVcbfL7gP9eEjD4585FVj4xmFFlhZ5tVgaDg0IPLaSDvAA1BXXgd0KiOxPLbUeDVs3LJNE4xnukZDmhM2aYnlM03IsNjOlJYgv3SxBtD/VJZpk8MaXVeQVh4Mc/wASePBoIj/2WLnHnroocVtjG75qFGj4nV7Pm6sbn03gwbGZ1asR8ok7ESKN4YTLh4OKt906ywWDJtuOLE6rsYNA+7FO9wimod4DjaDXSZYppvgpLBuTlzjguVoSOQTpAnSxUKGE8unLthvx4NQxuUDHOxOmuaNCbSom3n9bZI/VZAmQFMvgtEAaIHzqyI75EhPWpU3aaY7gb321NB7QKsn4JbMBcvyPf/xf8Q4zr3l0BNxS+rNiGdgvlPDLY3GxLMLz0SUm+VZlmUwD4v9g+cQbYDuPO1nHnXtdb35oHfpk5STae973/t8B0x4GY20X2GUHjV9WsDKNPMj8B5cmp3ZFy5BIStgTb+Hgu7gcGk8RmIC1nOcJ7Hu8/2hmVbPqzTv33VDHfDeCvh8grgpeDIBD3u8onPvn4dfslO+qKkUFSQh6Rl2gLHnMzoJpNFwcmZiVU41bLqy7TCx8YRqfErvBck8ylZPGZ8ctkzb4NZGQ6GBQPdFz8OHptwXq08HrEbB+tgmIPrPJwx9LNkVMA8d5ckyq2HrJV05hgXjYOxlv/hfHE4EaVUgPaKJlakMx4PGSi8j02D0MLCNbS7B0uzDiDS+kjdxg1w0AP5aOOOUo8FQXrsThoP4TAq56CDOrFxsXPUbieZpBLtHyG0aC8NyJa7WSY/ZhdDfJNn3es9uKdyCaCTsNyENZncy7F+N/x577OH5QnF+OFcss1qW8TQIyiHNTz/a1aGX4mGsi7lnRPLKIxZgFAUYdqFk/He6dTEuwH9sMEzjVwy67mTg1jyEETmWQtdkNC1IxTfnzvkcthPPr7DCCp1U/L+cyBZ/WKZVrMrQXdSqVmndhc1np7gd0TK7wnKuEm622yTBazcPfgTjCdIFJ5YK6U5+0uwI88vPIW9JGa3YLZLpTtDMm7JReJA0cg6SiEzhy452UE+BLZLd+mQZEpwcuq6u+h4I+gM7jYbbP/XOgIgrYOunHn2Phl4d/RM/FvSwVV76MFYtPRuNgff1uUKuuuqqFhWTD6+wzZfYuD10tZdXPsOtWA/CfxHgwjFkyJDCGIl/j2ldFGg71CUHgvGLUPMrLyFlGs+wPPaH+fU+GW8GndjeGOhlxHtPk9+85vG8QN3Jb7lkcnWexGhk3czTEyhTGRpsD7jdMnrgbdxth8ZMsE8cS3qTAwZM/GV5yk+sHOoSH7d5Hpo7tjzH89kO62B52R7jhjXAjlcz0qY2ym3T2Lgou0i7QDs+zWuexOY1Lhh28TjjjDOaT39Sn5tefPHFO5U7rdCj0agK5uDkVQq8DHdpByztO1HCSlzXHcoW4w+sghMYRGNZVcdwaBrXZFSwqJyqjNawPA526VpPXTUfoNHb0AprVTOskjNcpdtBLXt8xTnQAqP02GMvuOCC8XN75SpHecpxYIuliTPuahcC+LKeluNqQTR+oYn3ZXCK4CBxck2REQYnuAfABCf7cZC4L8Zwx0GrRkmD4EAxrD5cdX0oirv5OLz1zMTB7rsodJU9X7Is9eG20UHpY99Vg+LgS7BMbyzcg9PPxYM4y3fwWiZeaKz26slJhN7bPAg2v/VKnGHlVcPG5XEF90dfylEJ6D4+xONNX/abfPKbX8/DuO2EJ/qdDJMYDGUlOCGttzLsU7fFGlgntePXZyt8Lse+U8/+5kWaZ1SOE8tRFuUU9c6kNhqGNwKNL/nk0birI/+HjFsYvS/Lt/7W3XoIGZbuAuB21cfzvVlxa6PBsHzPw5RtHiHzJZbmwqungYfk4XHUCK+w1+8AjQyT+eqV0WjNz5bgfozIMawIa5D2dvZ0mzIQT2DwPMx2pZPzjzFcvY1V8WkY4OvywfCEolWACuIsJU6UVXQyGq4CgzGS7GzDHjyZX6J8iTPsKbw0PKUcUEZj5ZXHvMoxbIJxcfUsImnJY7puqrg34GDrDZ883qiIpwTWqVWuNNvpYHEwC8adxG579MjcXzsR3AraHs9nbIt0t0F6ME4cvZpbbrmleE6hIXeiOZitl/kE+jxcbW+C7LtME7sA4InGgZ9PxOrRCIY9BBQbN+zvcQxLY1zF1bltsQxkeZhJtK3dK2v55RXkxzsqGsIGr+OpWy8DOXoqoFLcRumZMFbjwT11rm5YBIsepB6ek9qJaxv0lpRPJWIMhRC+jEvPRcE4ZOsgKhoLQXm+qtItiX3jguTZhB6S40xaZOBLeYIGgDkUz22wKMdvdRynGjfL87kh26/u1InYeIb1MujHpsFA5p/po2soYrp8pspoVEvWCwF+ixu8z5NPPrk8Svg/thzbXHXVVWdC+4cTl4E3QexAc8KbX6yi8VKKd84ObgdbK7hnlke6WJCGIuI9G8qqgjIFaZYpnyto5lOO+QXDli0W5BE7KM2foIwMi90mCIanBK4sruhT4jPdfbPnE4Z7Ao2wPE4YD5sdfK5Em2++eby7Y7fddov3MjhQXSE9bHYFd9JpnF3JXT091XeVtR80LqxE8c+kbKuenzp02+g7KVzx3L9bjgZH/SjTGwMP9RzQ5nNFVeeuvl4dMh7iQJP+jxsPy3Al1Ai5DUp92wdOII2W5SoLrAGIsww9Ra9Z0xB6WMgYK5796Dkpt5HHcnxdQT/GE83q1x96f2T1o9z4XzA+YckKHG11QltnGONw2rBtwaMunhGRN7qB/E1jkDSxdCe39Q9GvtQn47yTOo1DHt01ftx+++03Tu+P5DA8nj3p1TrR9drcym+yySbxGyUvDdxm2gfqCDmx9eM2aQLbwTHIH4PQotflWK3qMMOer3BV23yYi3r6wzT1aRWmGabZaLTWgO0LTsiLIzlQ3YUD1SVR3BI0fDuMyc/Box1AuFjjbZiKP/LII+3ookulZ+LZQyt2r5s001WmLjfK6FK88iQkppzoJAeH+apQlWdYyHRXA+UkWE7KTJordIYnh2lz8WxDHnQR/13NDvcZCCeeq46uvKfu3h659WGQlZ133jneauZgcsVzgLlFcHI5oBxsvvnMfberrcbA5xTMK90nETOvhsWJR9/EOzcYeKEX6yTYPuvp5KHzYoXzBsDnc/RCPJz1IM+bMrakxVsBH17TkJhfQ2F/itWTfaN3Yxush661K6Rt1Yjabo2e7dDwaYg8v/F8zPzKZJVuwxvtD25nlYw6+bCc2ygnlucK/gbDSa7bTv5O0js32mijdtLadthhhzbPgnzgTsNn3X16k3EYBkJsXssS1IFYMMykCx1lfaRlWJ4qaEzVKcZCD6OTReoC+noJeIYDJE2YwDZwDLqL609oIVssKNv6kCe209IE5wo3Z52cG43hfCJ+NyKvRsN0IeuUWBqLgh5aGronWbwvlD69YLobjdaKUeFngPMwItvR+QuzAiyDcnZESW+qAGixYrhq6C6LHTyJ3XsbF5LmiuxBVZalwpTlwE+a2MfazZNyDVflZDxpxgXLNH8VnFCukK4qTnjaFI+K68q7TXJyOWlzsrh9cGI7SX79618XV+28bvOlQu6hfdMTg6H4M269ACeBE0iX2SdPfauTdfen4egvVsdqnXSzq/HuwhpOtxkeoDF6m4NVnSV/a9gJY5p09WpYrOHR4DnZXfmZoMVVkj4tGmb6Nc427AeBPi6mubKarmeirrx50As69thj4w3teQ2vDgW2tvEKAWUoU1CWMvQ2lCeWZr00klyBepDb7ouj9bo0Uv5eyANL+862eA6TXp9x2yV0F3YM6NEpXx7BsGA4QY8Hj6oT4zaBej1GvdbhYHgb+ut5xsgB8OW2oI12t2EAisbYMQBfGHGNg+C2Qy9HL/aUU06ZgI7H4Dlij8eGXpEVn5EjR07Ak+8Urrnmms6rr76689prr+00jHGfwLgYr0G0rrRNw9Xje2FCYB+/ZrjRaK0PSvkbtN8A8wDFQzhXWcEOF1eBFSP+8VCVptJViPlRSkwEsYNDWqbpupqvKrcarqZZjnFB1145gm6kk9hTdDvTvb4T3smu8dLtd+V1sLuq6YE44W+++eZwcbmmLj505MGk8qYErryeoE+Jz3S3GJ7sG66CumDAxqG0brbbEI2Ge+XkSx0ZN2yeDGusmARNvUrP9NawK7/5k94Tn4PYA0s9Oj1HvQNde8H22m6fK0hw4tufGg7B/ILlJFiWZTNhkhQ46aYZFkwwrjHJsFiQXuWRhpcT77lIemLTDLtFYnJ2Mm7GcSbyOHXdGj0vyyJ4qzwNGEs/fJFzkXspw5cvxeP0jh89Oc8rMCLj6ZsxLBZjOIsYgz7HsOCMwahShXHheZBXr8HfivzNsjG841icxnLjOJaFJoBbs7HCIYccEtsS+ajD89TrbPB0/cx0o2HtWTFUwHjD0wIOJpRcfOhM1xNLXmugy/YAABAASURBVIYPHx6u/bTIzbyuZG4ZXOk8qU964m233TaDU8QakykyNRh6K9eBkXINe5DoLUw+VZorpYPOtjBAHXxRivwGEstjXPBAUCOXadISpMkrSNMA6HkZliYYTj7DgnENqN6W4YRMSyxdGRoSdW7cNGmJW2mu2k5ieUwTy5th44I0t3pMpEn0kOnymE+sx5Vh44LeAbcgnV/72tfGXXrppX/FuG4F7QOjR4++iPQu5wZsLebDsP+Q7dpqbufc/jpm9fgEZHud3PQKNIoJ1kdA5uvwnUqdPwT+aYMGuYRRz7hYML8YGMs2ZmcW6dfKdP57S4wGZx3/pVFfpi1/RxEv9gJehudV4E0AfU8omGFdX/+nwwRcwviXBx4guW92YPhmbgcee90ieCJO3hgsU8IeKGmM9Dj8EZETbumll6a6XT95ztCV2n2M26WCy9p9YgvVR47ztqIlaZIoq138nwwNhb9xYaXrcjuUGWyzbULvQWrFEuURC7i6kwxK0zOfYUFeV+8MGxeSz3AV0iswXTBfFRuWX8xNXNTBeBVMM25esWcJejHGq2kZlsc0MQei8dPzTEtsWvIYFvAc4jZHutuVgw46aALnNG4F7sJYbI2xWI4zoJHwdjEW8LdTn80ZNw+SthvQ7pjEeyjIKHpVbGX+A1+8FhPcpZ0M8H+S51LqthMTfzBl7M7kfw48HN7DSbsO+D3wOwG+DAcmfibGY20WkStIn+6ft8Ro2ApuXC7AdVMhi6CMKcFC8MwPDAA8HR9Eh6zN6rL3jTfe+Ass+V9x9SZwSDiew79XuTHQgsf/m9AD8UDMKzSUadEBGU4s0bDglkSj4/7XPblGRyxPK+BKtpK6jWvk3OJ0m9hC5CAtTtJbyBFl0MQvNRlMYTg1Ep7dGJfBdMF2iAXpglsCjWCVJj3j5jEu9pF5jLvRAHmki4PAl3FQ/KsJjbLhano1nLxMJh9KkzVAunxiCYYF4xo5Br/kMPYGTBML8iRmi2Aw+OQxTdxZ+c2acenKDebGl3SDepRu4TwH8XbNA3HPnejj8cOGDRvDNvOn8H6YA+XV8SwuIU+XZ0L23HPPgRxCfoM8D3I+cTHpSwLNj16GN08cjA8fNWrUAoz/gdDeg8yVYVqTtq5A/RZG9jKkbc0c+SkTX6+c5PiMYfwfQdpGwIbAZxuQ4cDk25Vx8afIMQO+3jKjMS1twcK/jlJuQ4EjwF+mE9+Pst/OxBnCYD+YSXQhp+V/Z8/XyTXVBA7a3uDKq9PVmw5q7hPpsAjTWXHQhIyw+B6G6r04aNhrFgdST/V17812q6fkLnQGU0z4LsQeItUtCitPoW1hJMSC7cisrau37TBNLFTDemNJU4aQcfkEaYITUSwtQV5pYmmGnWyf/OQnjYb+pBmRJ8PGDXsw63bCcNKST5phwTS3J3qLSZdmmnHDCcYZE3GGo3fgNsirYA/L3WL4FK8H1t4CcYNRrrnmmuK2U0/Sh95YdOLfUcrjLZTeKjofw1jyPOpRDil3J/5/yN6BCa33kEUXDioX4ID3m1tvvfXNDzzwwEuMRV9usxx5mjyVwBjqvyNl579B7NSDQOZfmPz3MJYfZ8K/WuGfJYOzpdHoTpMqG7iFDhjONmAbVsnB8GlIPsntw0GcMF/EMfQ/GGCdurNMvPGs/p3QYnWiM+Pq1wkATzy4pMehYUFOjx9vVPByekyvJvzjH/8orrRVWmvYujF4wlDhOYWhYMBGHZPXulpH42IMYqHtRoNPWiuYKM3rV1xjozHBlRURvkwHBV18ww03hLEyLF9ruvGku0WRT5AmFroLa+SkZ37b7PmLE5++KraHs4D47Y1nJqz08QyKh4ccAMZLjX2mQ3ffCe9k14tjUsf/1pHHZ0t8CjN5NNgejGtENCbq2ENYvUn1e/311/t8y5jtt9++89xzz/0nhudo6r8CRmBZbjJ+gnFZaNddd/0sB5/f4QztDOp0I9vIpx588MHRjzzyyOmU/XHaMa9yyRcPKjLGDCY8w+L0SW5ETk/C7IrnGKPRXQdgvf8D3IghOY4BuRUDYEncvQF03krAdhiEY5hAN4B9fqTztddei6szOr94HejtiAd3Dqru5CfNZxEyPCXs4E4ejFbxyg4DF+9Ddd/s9a8TB8NXqm60EyzziZ10iU3TK8i4aa0gjzS3WV4Dy1uFTE+acd9n4QQzXKVnWOyzGeg0jItemU8n+hyGRsTnM5hcxRsrt4dOZq+WmXgFd78wQcuWW25Z5PHWSqPgcyY+neq1K5M1XqSrLJ+o1JvhhiH+B663LBoUt0Vp6H2ojP60WmH4bK+R7jDeaNHgYAiiHj7L8e53v3seym+j7xc68cQTd8cruZ/+6qT/X+cgchSe7W/Yovx41KhR/pxiXdq9BH3oy6ebHiSeQ5Stzirexi0YkFUx2NWbFas2W8IcbTR66JExL7/88p8wJuezOh+AIVmPjl6YLcYCDL41yLMjg2w4BuTub33rWy/7EBJnAeMYkK8TH+cK58rmBGcQwV7iYG2ZZZaJcE9fDiLBweorBHz+wsNLXNp4r6WyOFyL7JQfA2/dddeNB5EkSjO/YSHDiT1oZWCGp2G6YJpguAppjNyC+VAd7SuedayyyirxEJVbGB+gcoukJ6bL7usMuM6LF9pyGBj/Icyf8jvhNQIaBc6Z4hkErv7iBsuHv3xwzQmvoXLCez6krrxx8ZZG+dW6Zdj2GmZSFr0D47ZFkF7Fhk2nD4sGy/QE0wwrR/1anouCBlGvj8WjeM5w6qmnFrYY8Rsl+AcBb0em/+uF4MRf6nrWYSRlkm40+irDehr2gwkYVJ+POJQxNoS+fEbanABzo9Hott8wIP4o706MiY+/74lnshou50IMxEUYaJ96+OGH9+WK7eQRI0Zcy934kxtvvPE4f3m45JJLjmVAvI7Q8a4sDkj4Y+VlhQrsgHUgiU13VZOXPDHgWgehdGlO6uokyIFpuuczPhk7ePDgYj3EPkOi6++j0rjY5cwzzyxO+GHDhhUPg32mxAk/dOjQ5u8uzjjjjCaPJ/vysOcuTniNgqf+uN/xzg5c8Xh5EEY23q5tHbNOYo2hhsD6GRcMJ5844+gsXrabPNKr4eSVptFQl4aF5JXHuCBNyKczU9f2hTpX/273fCDN60+N4C677FI0jp6b+ACchkTDohxlKj/DYp8xkW64CsknzXLxbD0r+zN9vDr9NxRvapofL1D2rAK10ZhCT7BKvIghuQFP4GRgd4zJp9lOLMWK4sn3MhzsfU6DwqHZCFz/G/FW/sXAGw/dJzgnMGiFOEchHHtdvQL2zMWtj9ekbklc9a666qrihOcQt+QzJ8o54ogj4qlRaabJww1R8WEyHyrzUXwnPAauuGL6MJo8ejXcLsUTt5aDWx2v73Nia1xseg54J4MgTSxdMJ6eiWHTxKYJhgXDThjPQQwLSc88iaV79annkXzSEqRVeTVS/ljLdNMEwxoSH25Td+rFcwy3P+jfSVuc5Ho1HniOHDmyeL6h0fTXuno8H/vYx4pbHrdRPt/iQamGVkPq8y8+0u+2z/MVD1btC5+18GCcLW0Xry7rSx+8yZbzUOq3Mp7LPeA57lMbjanv0nEM5r+xqlyDMTkZw7IXnskQziIWY9DMw6B6L/vrz+D+7kr4WK5Rr2KiPMygeomB3qk7z366kz30BAb6BLY9nXoF7rP9PYlPDTrhPVPQq8CjiX/xZ7haZQerk0jwTMGDWdOlV7HpxgXT9EqcBMYT5BGMy5Og0aANk0wS0+UVMuwky3CVrlyhStMrkDfpiaXJJ0gT1AmH2cWJfdRRRxX1xwru7UUYTw0H3mL8BzJ/7emWQ4OhN+aBNgZdcT2CB6ImWrbGnfOK+IfknGE0D2btD7du2223XfFK/mtf+1rh+jT+XeKQIUPGsAW7kD54LwZ8jvMu1E1CbTRSE33Fk+efwLnJKIzKdRiTU4F98VA2fPLJJ5fHqLwDQzMvk3ApBvI6DNJtgL05aDseg3A5xuUhvJWXGbjjdavZF5c99thjPAbmDbYYY370ox9NcDXkgK7omXh96bmINzMYq6Lb7yTL6mWYMpIUGNc53l8pXR7BsGA4mPgy7G9OnISmQWoaD9Na43hh8bBZlVc+40Ly65U4mb1W1WOgveGF2V49BeJ6aPHraON4cp16Tug0zh022WST4sGq9crtmRP/He94hw/9xbbPsgR0L5osmFcG6yoWugvTf832u33kTOhVtoYjPvrRjy59+OGHb8VWcI45u1AH3UFtNLrTyoynjWUle5Itzq0YkAuB4RiWvfFUNmU7tAL0hdhf+/PuxRmYqzCpvsDA3xMX/cibb775RLYWF3F9eAsu+V+HDx/+Im75GG8euAqMf5GAQXA7NIHJNoG9fABhb4YKafHmcuLxkmfPV/RqXMV9fkEPJIGyiucUlFtctZ3oTOa4Bu4OS1Mutw7hEYi5quw8+uijxx544IFvavi4MXmTw9FxniVYX9rlzcN4DOVoPLOHgF9hQIdjVL8LbKdh5YB1CbyIdm403o6hWI+Vfm9W/PPY3jyKkZ1ib6HTKfJobNB109ikgcuMGhBp9E2QCD+CF3kAsBTexu6ccT0VCXPBV200ZuFOZqL4/zbvxaBcAZyKcTmMrZDnKlviWayD5/J+Jt0iDOR5mXTzMYDfzWD+IJNsbSbcRsS3BXamiQeSfjST8Xi2R6czOS7Eq7kST+Z2zj7u4ND0IQzQIz/5yU+e4KD3WSa68C/xD3/4w5c5M3kdz+Z1ZL+J3FeRNboVkPt35D7OpP8j3sCNGKIr2Kr8FDidW6LjOEQ9jMm7J23Yjgm4IfVaFWP4XvDbMaD9aMPCtGUFVvLP09Y9gWMBX7d/CzhWb4zEv7nFuoHDxeOALwPLrrXWWovjaezKIecFbEUepu1v0N4uH+R2iXcXoW3xshvqFsmJpUsQDxw48FUM49UYsnUxFMuxPToaGG363AS10ZhDepuJ+hoG5Skm5V+A24GrAB/VPx36MRigA5l8ewE7wrsVE/izwFoYnzWBFTBAy7G1WJoJtrhA2mJieBfCAxoEHoScAeSf3wneCkz2wfC9jzwfBQ8h/yaU+XXqsBN4f/IOI6+G70JkXUf4HrdwpP97WroAz+PZ448//mQOhbfmcHj5X/3qVwO5zl1t2WWXPYhzoCvwIB6n7DeZ7FMsxu2STBoIMYbwDbYfD7P9OP+DH/zgZ9kOzs9B8wYcnN5s+twKM8dozK3ardv9lmiAQ+W7OVQexm3TJtyCvI9bkAEYtWUxBpsBPsL9YzyJn1E5f5kq/JL4aRiZE5deeulTMTi7aHjYBg7k1mV5vLAvnXLKKVfCX3/QQG00UEL9mfM1wPXno2xlLgWGs63Z4+Mf//hXwVs2YBviO3HestvZZ5+9M8bmFM5P7p7ztTJ1LayNxtTprc5Va2Cu1UBtNObarq8bPudoYOa2pDYaM1ffdWm1BmZ7DdRlvjBAAAAB4ElEQVRGY7bvwroBtQZmrgZqozFz9V2XVmtgttdAbTRm+y6sG9A3DdTc06qB2mhMqwbr/LUG5jIN1EZjLuvwurm1BqZVA7XRmFYN1vlrDcxlGqiNxlzW4X1rbs1da2BSDdRGY1Kd1JRaA7UGJqOB2mhMRjl1Uq2BWgOTaqA2GpPqpKbUGqg1MBkN1EZjMsrpW1LNXWtg7tBAbTTmjn6uW1lrYLppoDYa002VtaBaA3OHBmqjMXf0c93KWgPTTQNvkdGYbvWvBdUaqDUwkzVQG42ZrPC6uFoDs7sGaqMxu/dgXf9aAzNZA7XRmMkKr4urNTATNDBDi6iNxgxVby281sCcp4HaaMx5fVq3qNbADNVAbTRmqHpr4bUG5jwN1EZjzuvTukV900DN3UcN1Eajjwqr2WsNzO0aqI3G3D4C6vbXGuijBmqj0UeF1ey1BuZ2DdRGY24fAX1rf81da6DURqMeBLUGag30SQO10eiTumrmWgO1BmqjUY+BWgO1Bvqkgdpo9EldfWKumWsNzJEaqI3GHNmtdaNqDcw4DdRGY8bptpZca2CO1EBtNObIbq0bVWtgxmlgVjEaM66FteRaA7UGpqsGaqMxXdVZC6s1MOdroDYac34f1y2sNTBdNfD/AQAA//+dHES2AAAABklEQVQDADeaurtpg7pmAAAAAElFTkSuQmCC",
                name: "Racing",
                cheats: [{
                        name: "Instant Win",
                        description: "Instantly Wins the race",
                        run: function() {
                            const stateNode = getStateNode();
                            stateNode.setState({
                                progress: stateNode.state.goalAmount
                            });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/pr",
                                val: stateNode.state.goalAmount,
                            });
                        },
                    },
                    {
                        name: "Set Questions",
                        description: "Sets the number of questions left",
                        inputs: [{
                            name: "Questions",
                            type: "number",
                        }, ],
                        run: function(progress) {
                            let stateNode = getStateNode();
                            progress = stateNode.props.client.amount - progress;
                            stateNode.setState({
                                progress
                            });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/pr",
                                val: progress,
                            });
                        },
                    },
                ],
            },
            rush: {
                // img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Blook_Rush_Logo_Resized.png",
                img: "data:image/png;base64,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",
                name: "Blook Rush",
                cheats: [{
                        name: "Set Blooks",
                        description: "Sets amount of blooks you or your team has",
                        inputs: [{
                            name: "Blooks",
                            type: "number",
                        }, ],
                        run: function(numBlooks) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                numBlooks
                            });
                            stateNode.props.liveGameController.setVal({
                                path: (stateNode.isTeam ? "a/" : "c/") + stateNode.props.client.name + "/bs",
                                val: numBlooks,
                            });
                        },
                    },
                    {
                        name: "Set Defense",
                        description: "Sets amount of defense you or your team has (Max 4)",
                        inputs: [{
                            name: "Defense (max 4)",
                            type: "number",
                            max: 4,
                        }, ],
                        run: function(defense) {
                            let numDefense = Math.min(defense, 4);
                            let stateNode = getStateNode();
                            stateNode.setState({
                                numDefense
                            });
                            stateNode.props.liveGameController.setVal({
                                path: (stateNode.isTeam ? "a/" : "c/") + stateNode.props.client.name + "/d",
                                val: numDefense,
                            });
                        },
                    },
                ],
            },
            tower: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Tower_Of_Doom_Logo_Resized.png",
                name: "Tower of Doom",
                cheats: [{
                        name: "Fill Deck",
                        description: "Fills your deck with every maxed out card and artifact (Only works on towers page)",
                        run: function() {
                            if (window.location.pathname == "/tower/map") {
                                const stateNode = getStateNode();
                                stateNode.props.tower.artifacts =
                                    "Medical Kit|Fury Relic|Survival Guide|Steel Socks|Piggy Bank|Lucky Feather|Coupon|Cheese|Tasty Egg|Training Weights|Mighty Shield|Toxic Waste|Lifeline Totem|Cursed Hourglass|Band-Aid|Elder Coins|Captain's Anchor|Chess Pieces|Pink Hippo|Anorak's Wizard Cap|Dave's Doggo|Anubis' Obelisk|Farm Tractor|Magic Seedling|Just A Bone|Cozy Igloo|King's Crown|Sacred Scroll".split(
                                        "|"
                                    );
                                stateNode.props.tower.cards =
                                    "Chick,🌽|Chicken,🌽|Cow,🌽|Goat,🌽|Horse,🌽|Pig,🌽|Sheep,🌽|Duck,🌽|Dog,🌽|Cat,🐾|Rabbit,🐾|Goldfish,🐾|Hamster,🐾|Turtle,🐾|Kitten,🐾|Puppy,🐾|Bear,🌲|Moose,🌲|Fox,🌲|Raccoon,🌲|Squirrel,🌲|Owl,🌲|Hedgehog,🌲|Baby Penguin,❄️|Penguin,❄️|Arctic Fox,❄️|Snowy Owl,❄️|Polar Bear,❄️|Arctic Hare,❄️|Seal,❄️|Walrus,❄️|Tiger,🌴|Panther,🌴|Cockatoo,🌴|Orangutan,🌴|Anaconda,🌴|Macaw,🌴|Jaguar,🌴|Capuchin,🌴|Toucan,🌴|Parrot,🌴|Elf,⚔️|Witch,⚔️|Wizard,⚔️|Fairy,⚔️|Slime Monster,⚔️|Jester,⚔️|Dragon,⚔️|Unicorn,⚔️|Queen,⚔️|King,⚔️|Snow Globe,☃️|Holiday Gift,☃️|Hot Chocolate,☃️|Gingerbread Man,☃️|Gingerbread House,☃️|Holiday Wreath,☃️|Snowman,☃️|Santa Claus,☃️|Two of Spades,🏰|Eat Me,🏰|Drink Me,🏰|Alice,🏰|Queen of Hearts,🏰|Dormouse,🏰|White Rabbit,🏰|Cheshire Cat,🏰|Caterpillar,🏰|Mad Hatter,🏰|King of Hearts,🏰"
                                    .split("|")
                                    .map((x) => {
                                        const [blook, c] = x.split(",");
                                        return {
                                            strength: 20,
                                            charisma: 20,
                                            wisdom: 20,
                                            class: c,
                                            blook
                                        };
                                    });
                                try {
                                    stateNode.props.addTowerNode();
                                } catch {}
                                stateNode.setState({
                                    showDeck: false
                                });
                            } else alert("You need to be on the map to run this cheat!");
                        },
                    },
                    {
                        name: "Max Cards",
                        description: "Maxes out all the cards in your deck",
                        run: function() {
                            if (window.location.pathname == "/tower/map") {
                                const stateNode = getStateNode();
                                stateNode.props.tower.cards.forEach((card) => {
                                    card.strength = 20;
                                    card.charisma = 20;
                                    card.wisdom = 20;
                                });
                                try {
                                    stateNode.forceUpdate();
                                } catch {}
                            } else alert("You need to be on the map to run this cheat!");
                        },
                    },
                    {
                        name: "Max Health",
                        description: "Fills the player's health",
                        run: function() {
                            if (window.location.pathname == "/tower/battle") getStateNode().setState({
                                myHealth: 100,
                                myLife: 100
                            });
                            else alert("You need to be in battle to run this cheat!");
                        },
                    },
                    {
                        name: "Max Card Stats",
                        description: "Maxes out player's current card (Only works on attribute select page)",
                        run: function() {
                            const stateNode = getStateNode();
                            if (stateNode.state.phase !== "select") alert("You must be on the attribute selection page!");
                            else stateNode.setState({
                                myCard: {
                                    ...stateNode.state.myCard,
                                    strength: 20,
                                    charisma: 20,
                                    wisdom: 20
                                }
                            });
                        },
                    },
                    {
                        name: "Min Enemy Stats",
                        description: "Makes the enemy card stats all 0 (Only works on attribute select page)",
                        run: function() {
                            const stateNode = getStateNode();
                            if (stateNode.state.phase !== "select") alert("You must be on the attribute selection page!");
                            else stateNode.setState({
                                enemyCard: {
                                    ...stateNode.state.enemyCard,
                                    strength: 0,
                                    charisma: 0,
                                    wisdom: 0
                                }
                            });
                        },
                    },
                    {
                        name: "Set Coins",
                        description: "Try's to set amount of tower coins you have",
                        inputs: [{
                            name: "Coins",
                            type: "number",
                        }, ],
                        run: function(coins) {
                            if (window.location.pathname == "/tower/battle")
                                try {
                                    getStateNode().props.setTowerCoins(coins);
                                } catch {}
                            else alert("You need to be in battle to run this cheat!");
                        },
                    },
                ],
            },
            kingdom: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Crazy_Kingdom_Logo_Resized.png",
                name: "Crazy Kingdom",
                cheats: [{
                        name: "Choice ESP",
                        description: "Shows you what will happen if you say Yes or No",
                        type: "toggle",
                        enabled: false,
                        data: null,
                        run: function() {
                            if (!this.enabled) {
                                this.enabled = true;
                                this.data = setInterval(
                                    (stats) => {
                                        let stateNode = getStateNode();
                                        let elements = Array.prototype.reduce.call(document.querySelectorAll("[class*=statContainer]"), (obj, container, i) => ((obj[stats[i]] = container), obj), {});
                                        if (stateNode.state.phase == "choice") {
                                            Array.prototype.forEach.call(document.querySelectorAll(".choiceESP"), (x) => x.remove());
                                            Object.keys(stateNode.state.guest.yes || {}).forEach((x) => {
                                                if (elements[x] == null) return;
                                                let element = document.createElement("div");
                                                element.className = "choiceESP";
                                                element.style = "font-size: 24px; color: rgb(75, 194, 46); font-weight: bolder;";
                                                element.innerText = String(stateNode.state.guest.yes[x]);
                                                elements[x].appendChild(element);
                                            });
                                            Object.keys(stateNode.state.guest.no || {}).forEach((x) => {
                                                if (elements[x] == null) return;
                                                let element = document.createElement("div");
                                                element.className = "choiceESP";
                                                element.style = "font-size: 24px; color: darkred; font-weight: bolder;";
                                                element.innerText = String(stateNode.state.guest.no[x]);
                                                elements[x].appendChild(element);
                                            });
                                            Array.prototype.forEach.call(
                                                document.querySelectorAll("[class*=guestButton][role=button]"),
                                                (x) => (x.onclick = () => Array.prototype.forEach.call(document.querySelectorAll(".choiceESP"), (x) => x.remove()))
                                            );
                                        }
                                    },
                                    50,
                                    ["materials", "people", "happiness", "gold"]
                                );
                            } else {
                                this.enabled = false;
                                clearInterval(this.data);
                                Array.prototype.forEach.call(document.querySelectorAll(".choiceESP"), (x) => x.remove());
                                this.data = null;
                            }
                        },
                    },
                    {
                        name: "Disable Tax Toucan",
                        description: "Tax evasion",
                        run: function() {
                            getStateNode().taxCounter = Number.MAX_VALUE;
                        },
                    },
                    {
                        name: "Max Stats",
                        description: "Sets all resources to the max",
                        run: function() {
                            getStateNode().setState({
                                materials: 100,
                                people: 100,
                                happiness: 100,
                                gold: 100
                            });
                        },
                    },
                    {
                        name: "Set Guests",
                        description: "Sets the amount of guests you've seen",
                        inputs: [{
                            name: "Guests",
                            type: "number",
                        }, ],
                        run: function(guestScore) {
                            getStateNode().setState({
                                guestScore
                            });
                        },
                    },
                    {
                        name: "Skip Guest",
                        description: "Skips the current guest",
                        run: function() {
                            getStateNode().nextGuest();
                        },
                    },
                ],
            },
            toy: {
                img: "https://media.blooket.com/image/upload/v1663212881/Media/logos/Santas_Workshop_Logo_Resized.png",
                name: "Santa's Workshop",
                cheats: [{
                        name: "Remove Distractions",
                        description: "Removes all enemy distractions",
                        run: function() {
                            getStateNode().setState({
                                fog: !1,
                                dusk: !1,
                                wind: !1,
                                plow: !1,
                                blizzard: !1,
                                force: !1,
                                canada: !1,
                                trees: [!1, !1, !1, !1, !1, !1, !1, !1, !1, !1]
                            });
                        },
                    },
                    {
                        name: "Send Distraction",
                        description: "Sends a distraction to everyone else playing",
                        inputs: [{
                            name: "Distraction",
                            type: "options",
                            options: Object.entries({
                                c: "Oh Canada",
                                b: "Blizzard",
                                f: "Fog Spell",
                                d: "Dark & Dusk",
                                w: "Howling Wind",
                                g: "Gift Time!",
                                t: "TREES",
                                s: "Snow Plow",
                                fr: "Use The Force"
                            }).map(([value, name]) => ({
                                name,
                                value,
                            })),
                        }, ],
                        run: function(val) {
                            let stateNode = getStateNode();
                            stateNode.safe = true;
                            stateNode.props.liveGameController.setVal({
                                path: `c/${stateNode.props.client.name}/tat`,
                                val
                            });
                        },
                    },
                    {
                        name: "Set Toys",
                        description: "Sets amount of toys",
                        inputs: [{
                            name: "Toys",
                            type: "number",
                        }, ],
                        run: function(toys) {
                            let stateNode = getStateNode();
                            stateNode.setState({
                                toys
                            });
                            stateNode.props.liveGameController.setVal({
                                path: "c/" + stateNode.props.client.name + "/t",
                                val: toys,
                            });
                        },
                    },
                    {
                        name: "Set Toys Per Question",
                        description: "Sets amount of toys per question",
                        inputs: [{
                            name: "Toys Per Question",
                            type: "number",
                        }, ],
                        run: function(toysPerQ) {
                            getStateNode().setState({
                                toysPerQ
                            });
                        },
                    },
                    {
                        name: "Swap Toys",
                        description: "Swaps toys with someone",
                        inputs: [{
                            name: "Player",
                            type: "options",
                            options: () => {
                                let stateNode = getStateNode();
                                return stateNode.props.liveGameController._liveApp ? new Promise((res) => stateNode.props.liveGameController.getDatabaseVal("c", (players) => players && res(Object.keys(players)))) : [];
                            },
                        }, ],
                        run: function(target) {
                            let stateNode = getStateNode();
                            stateNode.props.liveGameController.getDatabaseVal("c", (players) => {
                                if (!players || players[target] == null) return;
                                stateNode.props.liveGameController.setVal({
                                    path: "c/" + stateNode.props.client.name + "/tat",
                                    val: `${target}:swap:${stateNode.state.toys}`,
                                });
                                stateNode.setState({
                                    toys: players[target].t
                                });
                            });
                        },
                    },
                ],
            },
            flappy: {
                img: "https://ac.blooket.com/marketassets/blooks/chick.svg",
                name: "Flappy Blook",
                cheats: [{
                        name: "Toggle Ghost",
                        description: "Lets you go through the pipes",
                        type: "toggle",
                        enabled: false,
                        run: function() {
                            this.enabled = !this.enabled;
                            for (const body of Object.values(document.querySelector("#phaser-bouncy"))[0].return.updateQueue.lastEffect.deps[0].current.config.sceneConfig.physics.world.bodies.entries) {
                                if (!body.gameObject.frame.texture.key.startsWith("blook")) continue;
                                body.checkCollision.none = this.enabled;
                                body.gameObject.setAlpha(this.enabled ? 0.5 : 1);
                                break;
                            }
                        },
                    },
                    {

                        name: "Change Settings",
                        description: "Changes various game mechanics and lets you play with the spacebar",
                        inputs: [{
                                name: "Bird Gravity",
                                type: "number",
                                value: 800
                            },
                            {
                                name: "Bird Speed",
                                type: "number",
                                value: 125
                            },
                            {
                                name: "Bird Flap Power",
                                type: "number",
                                value: 300
                            }
                        ],
                        run: function(birdGravity, birdSpeed, birdFlapPower) {
                            (function() {
                                const canvas = document.querySelector("#phaser-bouncy");
                                if (!canvas) return;

                                const scene = Object.values(canvas)[0].return.updateQueue.lastEffect.deps[0].current.config.sceneConfig;
                                if (!scene) return;

                                // Apply custom settings
                                scene.birdGravity = birdGravity;
                                scene.birdSpeed = birdSpeed;
                                scene.birdFlapPower = birdFlapPower;

                                // Override flap function
                                scene.flap = function() {
                                    if (!this.isStarted) {
                                        this.bird.body.gravity.y = this.birdGravity;
                                        this.pipeGroup.setVelocityX(-this.birdSpeed);
                                        this.groundGroup.setVelocityX(-this.birdSpeed);
                                        this.isStarted = true;
                                    }
                                    this.bird.body.velocity.y = -this.birdFlapPower;
                                };

                                // Clear previous pointer events
                                scene.input._events.pointerdown = [];

                                // Recreate the scene
                                scene.create();

                                // Add spacebar flap
                                scene.input.keyboard.addKey('SPACE').on("down", () => {
                                    scene.flap.call(scene);
                                });
                            })();
                        }
                    },
                    {
                        name: "Change Game Code",
                        description: "Replace the old game with new HTML content",
                        inputs: [{
                            name: "HTML Code",
                            type: "text"
                        }],
                        run: function(newHtml) {
                            (function() {

                                if (newHtml) {

                                    var canvas = document.querySelector('canvas[width="320"][height="480"]');

                                    if (canvas) {

                                        var tempContainer = document.createElement('div');
                                        tempContainer.innerHTML = newHtml;

                                        var wrapperDiv = document.createElement('div');
                                        wrapperDiv.style.width = '320px';
                                        wrapperDiv.style.height = '480px';
                                        wrapperDiv.style.overflow = 'auto';
                                        wrapperDiv.style.boxSizing = 'border-box';
                                        wrapperDiv.style.position = canvas.style.position;
                                        wrapperDiv.style.marginLeft = canvas.style.marginLeft;
                                        wrapperDiv.style.marginTop = canvas.style.marginTop;
                                        wrapperDiv.style.cursor = canvas.style.cursor;
                                        wrapperDiv.style.backgroundColor = '#f0f0f0';

                                        while (tempContainer.firstChild) {
                                            wrapperDiv.appendChild(tempContainer.firstChild);
                                        }

                                        canvas.parentNode.replaceChild(wrapperDiv, canvas);
                                    }

                                    var scoreTextDiv = document.querySelector('div._scoreText_e2c5l_7');
                                    if (scoreTextDiv) {
                                        scoreTextDiv.parentNode.removeChild(scoreTextDiv);
                                    }
                                }
                            })();
                        }
                    }, {
                        name: "Set Score",
                        description: "Sets flappy blook score",
                        inputs: [{
                            name: "Score",
                            type: "number",
                        }, ],
                        run: function(score) {
                            Object.values(document.querySelector("#phaser-bouncy"))[0].return.updateQueue.lastEffect.deps[1](score || 0);
                        },
                    },
                ],
            },
        };

        const searchPage = document.createElement("div");
        searchPage.className = classes.searchPage;

        const searchbarHolder = document.createElement("form");
        searchbarHolder.className = classes.searchbarHolder;

        const searchbarInput = document.createElement("input");
        searchbarInput.placeholder = "Search Cheats";
        searchbarInput.className = classes.searchbarInput;

        const searchbarButton = document.createElement("div");
        searchbarButton.onclick = () => (searchbarInput.value = "");
        searchbarButton.innerHTML = '<i class="fas fa-times" style="line-height: 1;"></i>';
        searchbarButton.className = classes.searchbarButton;

        searchbarHolder.append(searchbarInput, searchbarButton);

        const searchResults = document.createElement("div");
        searchResults.className = classes.noScroll + " " + classes.searchResults;

        const noResult = document.createElement("div");
        noResult.className = classes.noResult;

        searchPage.append(searchbarHolder, searchResults);

        let searchThrottle,
            gamemodeResults = {};
        searchPage.onPath = searchbarHolder.onsubmit = (e) => {
            clearTimeout(searchThrottle);
            e?.preventDefault?.();
            const query = searchbarInput.value.toLowerCase();
            let hasResults = false;
            const animEnabled = window.xguiAnimationsEnabled;

            for (const child of searchResults.children) {
                if (child != noResult) {
                    if (child.dataset[datasets.mode]?.includes?.(query) || child.dataset[datasets.name].includes(query) || child.dataset[datasets.description]?.includes?.(query)) {
                        hasResults = true;
                        // Add smooth slide-in animation if enabled
                        if (animEnabled) {
                            child.style.animation = "slideInLeft 0.3s ease-out";
                        }
                        child.style.display = "block";
                        if (child.dataset[datasets.mode]) {
                            if (animEnabled) {
                                gamemodeResults[child.dataset[datasets.mode]].style.animation = "slideInLeft 0.3s ease-out";
                            }
                            gamemodeResults[child.dataset[datasets.mode]].style.display = "block";
                        }
                    } else {
                        // Add smooth slide-out animation if enabled
                        if (animEnabled) {
                            child.style.animation = "slideOutRight 0.3s ease-out";
                            setTimeout(() => {
                                child.style.display = "none";
                            }, 300);
                        } else {
                            child.style.display = "none";
                        }
                    }
                }
            }
            if (!hasResults) {
                noResult.innerText = `No results found for "${query}"`;
                if (animEnabled) {
                    noResult.style.animation = "fadeIn 0.3s ease-out";
                }
                noResult.style.display = "block";
            } else {
                if (animEnabled) {
                    noResult.style.animation = "fadeOut 0.3s ease-out";
                    setTimeout(() => {
                        noResult.style.display = "none";
                    }, 300);
                } else {
                    noResult.style.display = "none";
                }
            }
        };

        searchbarInput.oninput = (e) => {
            clearTimeout(searchThrottle);
            searchThrottle = setTimeout(searchbarHolder.onsubmit, 100); // Reduced from 1000ms to 100ms for instant search
        };

        const favoritesPage = document.createElement("div");
        favoritesPage.className = classes.noScroll + " " + classes.favoritesPage;

        const noFavorites = document.createElement("span");
        noFavorites.innerText = "You have no favorites.";

        favoritesPage.append(noFavorites);

        favoritesPage.onPath = () => {
            noFavorites.style.display = favoritesPage.querySelector("[data-" + datasets.favorited + "='true']") == null ? "block" : "none";
        };

        gamemodesList.innerHTML = "";
        searchResults.innerHTML = "";
        searchResults.append(noResult);
        for (const mode in cheats) {
            const gamemode = document.createElement("div");
            gamemode.className = classes.gamemode;
            const image = document.createElement("img");
            image.src = cheats[mode].img;
            const name = document.createElement("div");
            image.alt = name.innerText = cheats[mode].name;
            gamemode.append(image, name);

            const cheatsPage = document.createElement("div");
            cheatsPage.className = classes.contentPage;
            
            if (mode === 'custom_modules') {
                cheatsPage.dataset.customModulesPage = 'true';
                customModulesPageRef = cheatsPage;
            }

            const cheatsList = document.createElement("div");
            cheatsList.className = classes.cheatsList + " " + classes.noScroll;
            
            if (mode === 'custom_modules') {
                customModulesCheatsList = cheatsList;
            }

            const inputElements = [];
            cheatsPage.onPath = () => inputElements.forEach((x) => x());

            const searchResultSeparator = document.createElement("div");
            searchResultSeparator.onclick = () => path.push(cheats[mode].name, cheatsPage);
            searchResultSeparator.className = classes.searchResultSeparator;
            searchResultSeparator.dataset[datasets.name] = (searchResultSeparator.innerText = cheats[mode].name).toLowerCase();
            gamemodeResults[cheats[mode].name.toLowerCase()] = searchResultSeparator;
            searchResults.append(searchResultSeparator);

            const favoritesSeparator = searchResultSeparator.cloneNode(true);
            favoritesSeparator.dataset[datasets.favorites] = 0;
            favoritesSeparator.onclick = searchResultSeparator.onclick;
            favoritesPage.append(favoritesSeparator);

            for (const cheat of cheats[mode].cheats) {
                const cheatId = `${mode}.${cheat.name.toLowerCase()}.${cheat.type == "toggle" ? "toggle" : "execute"}`;
                const cheatElement = document.createElement("div");

                const searchResult = document.createElement("div");
                searchResult.className = classes.searchResult;

                const searchResultInfo = document.createElement("div");
                searchResultInfo.className = classes.searchResultInfo;

                const searchResultName = document.createElement("div");
                searchResultName.className = classes.searchResultName;
                searchResult.dataset[datasets.name] = (searchResultName.innerText = cheat.name + (cheat.type == "toggle" && !cheat.name.includes("toggle") ? " (Toggle)" : "")).toLowerCase();
                searchResult.dataset[datasets.mode] = cheats[mode].name.toLowerCase();
                const searchResultDescription = document.createElement("div");
                searchResultDescription.className = classes.searchResultDescription;
                searchResult.dataset[datasets.description] = (searchResultDescription.innerText = cheat.description).toLowerCase();

                searchResultInfo.append(searchResultName, searchResultDescription);

                searchResult.onclick = () => {
                    path.push(searchResultName.innerText, cheatsPage);
                    cheatElement.scrollIntoView();
                    cheatElement.animate(
                        [{
                                color: "var(--textColor)",
                                textShadow: "0 0 0px var(--highlight)",
                            },
                            {
                                color: "var(--highlight)",
                                textShadow: "0 0 5px var(--highlight)",
                                offset: 0.25,
                            },
                            {
                                color: "var(--textColor)",
                                textShadow: "0 0 0px var(--highlight)",
                            },
                        ],
                        1500
                    );
                };

                searchResult.append(searchResultInfo);

                searchResults.append(searchResult);

                const cheatTop = document.createElement("div");
                cheatTop.className = classes.cheatTop;
                const cheatInfo = document.createElement("div");
                cheatInfo.className = classes.cheatInfo;
                const cheatName = document.createElement("span");
                cheatName.innerText = cheat.name;
                cheatName.className = classes.cheatName;

                const favoriteButton = document.createElement("i");
                favoriteButton.className = "far fa-star " + classes.favoriteButton;

                const favoriteInner = document.createElement("i");
                favoriteInner.className = "fas fa-star";
                favoriteButton.append(favoriteInner);

                let favoritesPageCopy = searchResult.cloneNode(true);
                favoritesPageCopy.dataset[datasets.favorited] = false;
                favoritesPageCopy.onclick = searchResult.onclick;
                favoritesPage.append(favoritesPageCopy);

                favoriteButton.onclick = () => {
                    const favorited = cheatId in Settings.data.favorites;
                    favoriteInner.classList.toggle(classes.filled, !favorited);
                    if (favorited) {
                        delete Settings.data.favorites[cheatId];
                        favoritesPageCopy.dataset[datasets.favorited] = false;
                        favoritesSeparator.dataset[datasets.favorites]--;
                    } else {
                        Settings.data.favorites[cheatId] = 1;
                        favoritesPageCopy.dataset[datasets.favorited] = true;
                        favoritesSeparator.dataset[datasets.favorites]++;
                    }
                    favoritesPage.onPath();
                    Settings.setData(Settings.data);
                };

                if (cheatId in (Settings.data.favorites ??= {})) {
                    favoriteInner.classList.toggle(classes.filled, true);
                    favoritesPageCopy.dataset[datasets.favorited] = true;
                    favoritesSeparator.dataset[datasets.favorites]++;
                }

                cheatName.append(favoriteButton);

                const cheatDescription = document.createElement("span");
                cheatDescription.innerText = cheat.description;
                cheatDescription.className = classes.cheatDescription;
                cheatInfo.append(cheatName, cheatDescription);
                cheatElement.append(cheatTop);
                const inputs = [];
                if (Array.isArray(cheat.inputs)) {
                    const cheatInputs = document.createElement("div");
                    cheatInputs.className = classes.cheatInputs;
                    for (const input of cheat.inputs) {
                        const inputElement = document.createElement("div");
                        const inputName = document.createElement("span");
                        inputName.innerText = input.name;
                        inputElement.append(inputName);
                        cheatInputs.append(inputElement);

                        if (input.type == "options") {
                            const inputField = document.createElement("select");
                            inputField.dataset[datasets.type] = "options";
                            inputElement.append(inputField);
                            inputs.push(inputField);
                            let curField = inputField;
                            const updateOptions = () => {
                                let choose = input.options;

                                const newInputField = document.createElement("select");
                                newInputField.dataset[datasets.type] = "options";
                                inputs[inputs.indexOf(curField)] = newInputField;
                                curField.replaceWith(newInputField);
                                curField = newInputField;

                                if (typeof choose == "function")
                                    try {
                                        choose = choose();
                                    } catch {
                                        choose = [];
                                    }
                                if (choose instanceof Promise) {
                                    const waiting = document.createElement("option");
                                    waiting.value = '""';
                                    waiting.innerHTML = "Loading Options...";
                                    curField.append(waiting);
                                    choose.then((choices) => {
                                        if (choices?.length > 0) {
                                            curField.innerHTML = "";
                                            for (const choice of choices) {
                                                const option = document.createElement("option");
                                                option.value = JSON.stringify(choice?.value ?? choice);
                                                option.innerHTML = choice?.name || choice;
                                                curField.append(option);
                                            }
                                        } else {
                                            const newInputField = document.createElement("input");
                                            inputs[inputs.indexOf(curField)] = newInputField;
                                            curField.replaceWith(newInputField);
                                            newInputField.dataset[datasets.type] = "string";
                                            newInputField.placeholder = input.name;
                                            curField = newInputField;
                                        }
                                    });
                                } else {
                                    if (choose?.length > 0) {
                                        for (const choice of choose) {
                                            const option = document.createElement("option");
                                            option.value = JSON.stringify(choice?.value ?? choice);
                                            option.innerHTML = choice?.name || choice;
                                            curField.append(option);
                                        }
                                    } else {
                                        const newInputField = document.createElement("input");
                                        inputs[inputs.indexOf(curField)] = newInputField;
                                        curField.replaceWith(newInputField);
                                        newInputField.dataset[datasets.type] = "string";
                                        newInputField.placeholder = input.name;
                                        curField = newInputField;
                                    }
                                }
                            };
                            updateOptions();
                            inputElements.push(updateOptions);
                        } else {
                            const inputField = document.createElement("input");
                            inputField.dataset[datasets.type] = input.type;
                            if (input.type == "number") {
                                inputField.type = "number";
                                inputField.min = input.min;
                                inputField.max = input.max;
                                inputField.value = input.value || (input.min ?? 0);
                            }
                            inputField.placeholder = input.name;
                            inputElement.append(inputField);
                            inputs.push(inputField);
                        }
                    }
                    cheatElement.append(cheatInputs);
                }
                cheatTop.append(cheatInfo);
                const runButton = document.createElement("div");
                runButton.className = classes.runCheat;
                if (cheat.type == "toggle") {
                    runButton.innerText = "Toggle On";
                    runButton.classList.add(classes.toggleCheat);
                } else runButton.innerText = "Execute";
                runButton.onclick = () => {
                try {
                    cheat.run.apply(
                        cheat,
                        inputs.map((x) => (x.dataset[datasets.type] == "number" ? parseFloat("0" + x.value) : x.dataset[datasets.type] == "options" ? JSON.parse(x.value) : x.value))
                    );
                    if (cheat.type == "toggle") {
                        runButton.innerText = "Toggle " + (cheat.enabled ? "Off" : "On");
                        runButton.classList.toggle(classes.active, cheat.enabled);
                        Logs.addLog(`Toggled "${cheat.name}" ${cheat.enabled ? "on" : "off"}`, cheat.enabled ? "var(--toggleOn)" : "var(--toggleOff)");
                        if (areSweetAlertsEnabled()) {
                            Swal.fire({title:'Cheat Toggled',text:`${cheat.name} is now ${cheat.enabled?'Enabled':'Disabled'}.`,icon:cheat.enabled?'success':'warning',toast:true,position:'bottom',timer:3000,timerProgressBar:true,showConfirmButton:false,background:'#151534',color:'#ffffff',iconColor:'#ffffff'});
                        }
                    } else {
                    Logs.addLog(`Ran "${cheat.name}"`, "var(--highlight)");
                    if (areSweetAlertsEnabled()) {
                        Swal.fire({title:'Cheat Executed',text:`${cheat.name} has been Executed.`,icon:'info',toast:true,position:'bottom',timer:3000,timerProgressBar:true,showConfirmButton:false,background:'#151534',color:'#ffffff',iconColor:'#ffffff'});
                    }
                    }
                } catch (err) {
                    Logs.addLog(`Error running "${cheat.name}": ${err.message}`, "var(--error)");
                    if (areSweetAlertsEnabled()) {
                        Swal.fire({title:'Cheat Error',text:`An error occurred while running ${cheat.name} make sure you are on the right page!`,icon:'error',toast:true,position:'bottom',timer:3000,timerProgressBar:true,showConfirmButton:false,background:'#151534',color:'#ffffff',iconColor:'#ff0000'});
                    }
                }
            };
                cheatTop.append(runButton);
                cheatsList.append(cheatElement);
            }

            cheatsPage.append(cheatsList);

            gamemode.onclick = () => {
                const unsupportedModes = ["racing", "royale", "dino", "rush"]; // <-- Unsuported Gamemodes go here

                // Check for CSP on custom_modules gamemode
                if (mode === "custom_modules") {
                    let cspDetected = false;
                    try {
                        const testScript = document.createElement('script');
                        testScript.textContent = 'window.__cspTestPassed2 = true;';
                        document.head.appendChild(testScript);
                        document.head.removeChild(testScript);
                        if (!window.__cspTestPassed2) {
                            cspDetected = true;
                        }
                        delete window.__cspTestPassed2;
                    } catch (e) {
                        cspDetected = true;
                    }
                    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                    if (cspMeta && cspMeta.content.includes('script-src')) {
                        cspDetected = true;
                    }

                    if (cspDetected) {
                        path.push(cheats[mode].name, cheatsPage);

                        try {
                            if (cheatsPage && cheatsPage.style) {
                                let blurTarget = cheatsPage.querySelector && cheatsPage.querySelector('.xgui-blur-target');
                                if (!blurTarget) {
                                    blurTarget = document.createElement('div');
                                    blurTarget.className = 'xgui-blur-target';
                                    while (cheatsPage.firstChild) {
                                        blurTarget.appendChild(cheatsPage.firstChild);
                                    }
                                    cheatsPage.appendChild(blurTarget);
                                }
                                blurTarget.style.filter = 'blur(8px)';
                                blurTarget.style.pointerEvents = 'none';
                            }
                        } catch (e) {}

                        if (cheatsPage.querySelector && cheatsPage.querySelector('.xgui-csp-notice')) return;
                        const notice = document.createElement("div");
                        notice.className = 'xgui-csp-notice';
                        try { 
                            if (!cheatsPage.style.position || cheatsPage.style.position === 'static') cheatsPage.style.position = 'relative';
                            // Allow content to extend beyond the cheatsPage bounds
                            cheatsPage.style.overflow = 'visible';
                        } catch (e) {}
                        notice.style.cssText = `
                            position: absolute;
                            inset: 0;
                            display: flex !important;
                            align-items: flex-start !important;
                            justify-content: center !important;
                            z-index: 2000;
                            pointer-events: auto;
                            text-align: center;
                            background: transparent;
                            padding: 20px;
                            overflow: visible !important;
                        `;

                        const content = document.createElement('div');
                        content.className = 'xgui-csp-notice-content';
                        content.style.cssText = `
                            box-sizing: border-box !important;
                            display: block !important;
                            max-width: 380px !important;
                            width: 100% !important;
                            padding: 40px 35px !important;
                            border-radius: 20px !important;
                            backdrop-filter: blur(24px) saturate(180%) !important;
                            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
                            background: linear-gradient(145deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.1)) !important;
                            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
                            box-shadow:
                                0 10px 40px rgba(0, 0, 0, 0.5),
                                0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                                0 25px 70px rgba(138, 43, 226, 0.2) !important;
                            text-align: center !important;
                            margin-top: -40px !important;
                        `;

                        const iconWrapper = document.createElement("div");
                        iconWrapper.innerHTML = `
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        `;
                        iconWrapper.style.cssText = `
                            display: block !important;
                            color: #FFFFFF !important;
                            margin: 0 auto 20px auto !important;
                            padding: 0 !important;
                            line-height: 1 !important;
                            filter: drop-shadow(0 4px 16px rgba(255, 255, 255, 0.3)) !important;
                        `;

                        const noticeTitle = document.createElement("div");
                        noticeTitle.textContent = "CSP Detected";
                        noticeTitle.style.cssText = `
                            display: block !important;
                            color: #FFFFFF !important;
                            font-size: 32px !important;
                            font-weight: 800 !important;
                            line-height: 1.1 !important;
                            margin: 0 0 16px 0 !important;
                            padding: 0 !important;
                            text-align: center !important;
                            letter-spacing: -0.5px !important;
                            text-shadow: 0 2px 20px rgba(138, 43, 226, 0.6) !important;
                        `;

                        const noticeText = document.createElement("div");
                        noticeText.innerHTML = "This is not supported on your version. Please use the extension version or get the CSP unblock extension.";
                        noticeText.style.cssText = `
                            display: block !important;
                            color: #FFFFFF !important;
                            font-size: 15px !important;
                            margin: 0 0 30px 0 !important;
                            padding: 0 !important;
                            text-align: center !important;
                            line-height: 1.6 !important;
                            font-weight: 400 !important;
                        `;

                        const buttonContainer = document.createElement("div");
                        buttonContainer.style.cssText = `
                            display: flex !important;
                            flex-direction: column !important;
                            gap: 12px !important;
                        `;

                        const extensionButton = document.createElement("a");
                        extensionButton.href = "https://github.com/xgui-client/X-GUI-BLOOKET-CLIENT/raw/refs/heads/main/extension/x-gui-extension.zip";
                        extensionButton.target = "_blank";
                        extensionButton.textContent = "Get Extension";
                        extensionButton.style.cssText = `
                            display: inline-flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            background: linear-gradient(135deg, #5865F2, #4752C4) !important;
                            color: #FFFFFF !important;
                            border: none !important;
                            font-size: 15px !important;
                            font-weight: 600 !important;
                            cursor: pointer !important;
                            padding: 14px 32px !important;
                            border-radius: 12px !important;
                            transition: all 0.3s ease !important;
                            box-shadow: 0 6px 20px rgba(88, 101, 242, 0.4) !important;
                            margin: 0 !important;
                            letter-spacing: 0.3px !important;
                            text-decoration: none !important;
                        `;

                        extensionButton.addEventListener('mouseenter', function() {
                            this.style.transform = 'translateY(-3px) scale(1.02)';
                            this.style.boxShadow = '0 10px 30px rgba(88, 101, 242, 0.6)';
                        });

                        extensionButton.addEventListener('mouseleave', function() {
                            this.style.transform = 'translateY(0) scale(1)';
                            this.style.boxShadow = '0 6px 20px rgba(88, 101, 242, 0.4)';
                        });

                        buttonContainer.appendChild(extensionButton);

                        content.appendChild(iconWrapper);
                        content.appendChild(noticeTitle);
                        content.appendChild(noticeText);
                        content.appendChild(buttonContainer);

                        notice.append(content);
                        try { cheatsPage.append(notice); } catch (e) { document.body.append(notice); }
                        return;
                    }
                }

                if (unsupportedModes.includes(mode)) {
                    path.push(cheats[mode].name, cheatsPage);

                    try {
                        if (cheatsPage && cheatsPage.style) {
                            let blurTarget = cheatsPage.querySelector && cheatsPage.querySelector('.xgui-blur-target');
                            if (!blurTarget) {
                                blurTarget = document.createElement('div');
                                blurTarget.className = 'xgui-blur-target';
                                while (cheatsPage.firstChild) {
                                    blurTarget.appendChild(cheatsPage.firstChild);
                                }
                                cheatsPage.appendChild(blurTarget);
                            }
                            blurTarget.style.filter = 'blur(8px)';
                            blurTarget.style.pointerEvents = 'none';
                        } else if (typeof gui !== 'undefined' && gui.style) {
                            gui.style.filter = "blur(8px)";
                            gui.style.pointerEvents = "none";
                        }
                    } catch (e) {}

                    if (cheatsPage.querySelector && cheatsPage.querySelector('.xgui-blur-notice')) return;
                    const notice = document.createElement("div");
                    notice.className = 'xgui-blur-notice';
                    try { if (!cheatsPage.style.position || cheatsPage.style.position === 'static') cheatsPage.style.position = 'relative'; } catch (e) {}
                    notice.style.cssText = `
                        position: absolute;
                        inset: 0;
                        display: flex !important;
                        align-items: flex-start !important;
                        justify-content: center !important;
                        z-index: 2000;
                        pointer-events: auto;
                        text-align: center;
                        background: transparent;
                        padding: 20px;
                    `;

                    const content = document.createElement('div');
                    content.className = 'xgui-blur-notice-content';
                    content.style.cssText = `
                        box-sizing: border-box !important;
                        display: block !important;
                        max-width: 380px !important;
                        width: 100% !important;
                        padding: 40px 35px !important;
                        border-radius: 20px !important;
                        backdrop-filter: blur(24px) saturate(180%) !important;
                        -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
                        background: linear-gradient(145deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.1)) !important;
                        border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
                        box-shadow:
                            0 10px 40px rgba(0, 0, 0, 0.5),
                            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                            0 25px 70px rgba(138, 43, 226, 0.2) !important;
                        text-align: center !important;
                        margin-top: -40px !important;

                    `;

                    const iconWrapper = document.createElement("div");
                    iconWrapper.innerHTML = `
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                        </svg>
                    `;
                    iconWrapper.style.cssText = `
                        display: block !important;
                        color: #FFFFFF !important;
                        margin: 0 auto 20px auto !important;
                        padding: 0 !important;
                        line-height: 1 !important;
                        filter: drop-shadow(0 4px 16px rgba(255, 255, 255, 0.3)) !important;
                    `;

                    const noticeTitle = document.createElement("div");
                    noticeTitle.textContent = "Not Supported";
                    noticeTitle.style.cssText = `
                        display: block !important;
                        color: #FFFFFF !important;
                        font-size: 32px !important;
                        font-weight: 800 !important;
                        line-height: 1.1 !important;
                        margin: 0 0 16px 0 !important;
                        padding: 0 !important;
                        text-align: center !important;
                        letter-spacing: -0.5px !important;
                        text-shadow: 0 2px 20px rgba(138, 43, 226, 0.6) !important;
                    `;

                    const noticeText = document.createElement("div");
                    noticeText.innerHTML = "Cheats for this gamemode are still in development. Join the discord to find out when its done.";
                    noticeText.style.cssText = `
                        display: block !important;
                        color: #FFFFFF !important;
                        font-size: 15px !important;
                        margin: 0 0 30px 0 !important;
                        padding: 0 !important;
                        text-align: center !important;
                        line-height: 1.6 !important;
                        font-weight: 400 !important;
                    `;

                    const discordButton = document.createElement("a");
                    discordButton.href = "https://discord.gg/A7CRUz8vFR";
                    discordButton.target = "_blank";
                    discordButton.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        <span style="margin-left: 8px;">Join Discord</span>
                    `;
                    discordButton.style.cssText = `
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: linear-gradient(135deg, #5865F2, #4752C4) !important;
                        color: #FFFFFF !important;
                        border: none !important;
                        font-size: 15px !important;
                        font-weight: 600 !important;
                        cursor: pointer !important;
                        padding: 14px 32px !important;
                        border-radius: 12px !important;
                        transition: all 0.3s ease !important;
                        box-shadow: 0 6px 20px rgba(88, 101, 242, 0.4) !important;
                        margin: 0 !important;
                        letter-spacing: 0.3px !important;
                        text-decoration: none !important;
                    `;

                    discordButton.addEventListener('mouseenter', function() {
                        this.style.transform = 'translateY(-3px) scale(1.02)';
                        this.style.boxShadow = '0 10px 30px rgba(88, 101, 242, 0.6)';
                    });

                    discordButton.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0) scale(1)';
                        this.style.boxShadow = '0 6px 20px rgba(88, 101, 242, 0.4)';
                    });

                    content.appendChild(iconWrapper);
                    content.appendChild(noticeTitle);
                    content.appendChild(noticeText);
                    content.appendChild(discordButton);

                    notice.append(content);
                    try { cheatsPage.append(notice); } catch (e) { document.body.append(notice); }
                } else {
                    path.push(cheats[mode].name, cheatsPage);
                }
            };
            gamemodesList.append(gamemode);
        }
        gamemodesPage.append(gamemodesList);

        const creditsPage = document.createElement("div");
        creditsPage.className = classes.creditsPage;




        // Create sleek Changelog Page
        const changelogPage = document.createElement("div");
        changelogPage.className = classes.favoritesPage || "favoritesPage";
        Object.assign(changelogPage.style, {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "25px 20px 50px 20px", // <-- add extra bottom padding
            overflowY: "auto"
        });


        // Add custom scrollbar style
        const styleEl = document.createElement("style");
        styleEl.textContent = `
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar {
  width: 8px;
}
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar-thumb {
  background: var(--highlight2);
  border-radius: 4px;
}
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar-track {
  background: transparent;
}`;
        document.head.appendChild(styleEl);

        // Title
        const title = document.createElement("div");
        title.className = "bigTextContainer";
        title.innerHTML = `<div class="bigText">📜 Changelog</div>`;
        Object.assign(title.style, {
            fontSize: "2.2em",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "15px",
            textShadow: `0 0 12px var(--highlight), 0 0 24px var(--highlight2)`
        });
        changelogPage.appendChild(title);

        // Versions array (30 versions, highest to lowest)
        const versions = [
            ["Version 6.70x", "ADDED SMOOTH GUI ANIMATIONS, FIXED CUSTOM MODULE BUGS, ALLOWED TEXT VALUES FOR STATS, FIXED CRYPTO STEALING, ADDED SPAM CRYPTO HACK, UPDATED ICONS, FIXED STORAGE SYNC, AND UPDATED CREDITS.", "null"],
            ["Version 6.69x", "ADDED CSP DETECTOR FOR CUSTOM MODULES, FIXED CUSTOM MODULES BUG, FIXED STORAGE ISSUE ADDED IMAGE FIX AND ADDED FREE PLUS!.", "null"],
            ["Version 6.68x", "ADDED SMOOTH ANIMATIONS FOR X-GUI, ADDED CUSTOM MODULES, AND NOW YOU CAN DRAG THE TOP AREA.", "null"],
            ["Version 6.67x", "ADDED SWAL ALERTS! TOGGLE, ADDED UNSUPPORTED GAMEMODE WARNINGS, AND MOVED SETTINGS MENU.", "null"],
            ["Version 6.66x", "ADDED SWAL ALERTS!", "null"],
            ["Version 6.65x", "ADDED CLIENT SIDED BLOOK EDITOR", "null"],
            ["Version 6.64x", "FIXED MOST GAMEMODES", "null"],
            ["Version 6.63x", "ADDED BLOOK EDITOR AND UPDATED MOBILE MODE", "null"],
            ["Version 6.62x", "ADDED ACCOUNT GENERATOR", "null"],
            ["Version 6.61x", "ADDED BLOOKET STREAM FINDER AND ALT MANAGER", "null"],
            ["Version 6.60x", "fixed ping display! ADDED CONSOLE MESSAGE AND ADDED PIN GUESSER!!", "null"],
            ["Version 6.50x", "FIXED KEYBINDS!! ADDED CHEATS AND ADDED 8 NEW THEMES, HAPPY HOLIDAYS GUYSS <3", "null"],
            ["Version 6.40x", "UPDATED REFRESH SVG AND ADDED CHEAT", "null"],
            ["Version 6.30x", "ADDED CHEATS AND UPDATED GUI", "null"],
            ["Version 6.20x", "ADDED MORE CHEATS+++", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 6.10x", "ADDED WHAT YOU ARE READING RN", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 6.00x", "ADDED MOBILE MODE + A BUNCH MORE CRAP", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.90x", "ROUNDED CORNERS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.80x", "UPDATED XTRAS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.70x", "ADDED EXTRAS TAB", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.60x", "STOP COMPLAINING (FIXED BUGS)", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.50x", "BUGS AND MORE BUGS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.40x", "UPDATED VERSIONNAME VARIABLE", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.30x", "UPDATED BLOOKET BOT", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.20x", "ADDED REMOVE ALL TAKEN BLOOKS TO THE GLOBAL STATENODE", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.10x", "ADDED BLOOKET BOT", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 5.00x", "ADDED FREEZE LEADERBOARD", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.90x", "ADDED CHANGE GAME CODE TO FLAPPY BLOOK", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.80x", "ADDED CLIENT SIDE FRENZY", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.70x", "REMOVED THE . FROM THE TITLE", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.60x", "ADDED FLOOD ALERT BOX", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.50x", "FIXED SEVERAL BUGS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.40x", "FIXED THE DOUBLE ERROR (SORRY GUYS!)", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.30x", "FIXED SPELLING ERROR", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.20x", "ADDED USERSCRIPT IMAGE!!!", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.10x", "BUGS FIXED (AGAIN)", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 4.00x", "BUGS FIXED", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.90x", "FIXED A SPELLING ERROR", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.80x", "BUGS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.70x", "ATTEMPTED AN UPDATE BUT FAILED :(", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.60x", "DID SOME UI STUFF", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.50x", "FIXED A FEW BUS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.40x", "NEW CHEATS ADDED", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.30x", "FIXED SUBDOMAIN ISSUE", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.20x", "ADDED SIMULATE UNLOCK, ALWAYS HACK, HOST ANY GAMEMODE, BYPASS FILTER, CRASH HOST, STEAL ALL PLAYERS GOLD AND BYPASS JOIN LIMIT", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.10x", "ADDED 7 NEW CHEATS", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 3.00x", "BUG FIXED", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.90x", "ADDED BYPASS NAME FILTER", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.80x", "ADDED 3 NEW CHEATS TO CRYPTO AND GOLD QUEST", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.70x", "ADDED WELCOME MESSAGE", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.60x", "ADDED GLOW EFFECT TO TITLE", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.50x", "REVAMPED COLORS AND UI", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.40x", "STARTED WITH NEW COLOR SCHEME", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.30x", "FIXED USE ANY BLOOK", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.20x", "BUG FIXED", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"],
            ["Version 2.10x", "STARTED NEW MENU", "https://greasyfork.org/en/scripts/553301-x-gui-client-for-blooket/versions"]
        ];



        // Add each version as a sleek card
        versions.forEach(([ver, desc, link]) => {
            const card = document.createElement("div");
            Object.assign(card.style, {
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "16px 20px",
                borderRadius: "14px",
                background: "var(--background2)",
                boxShadow: "0 5px 20px rgba(0,0,0,0.28)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default"
            });
            card.onmouseover = () => {
                card.style.transform = "translateY(-4px)";
                card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
            };
            card.onmouseleave = () => {
                card.style.transform = "translateY(0)";
                card.style.boxShadow = "0 5px 20px rgba(0,0,0,0.28)";
            };

            const verTitle = document.createElement("span");
            verTitle.style.fontWeight = "700";
            verTitle.style.fontSize = "1.2em";
            verTitle.style.color = "var(--highlight)";
            verTitle.innerText = ver;

            const verDesc = document.createElement("span");
            verDesc.style.fontSize = "0.95em";
            verDesc.style.color = "var(--textColor2)";
            verDesc.innerText = desc;


            card.append(verTitle, verDesc);
            changelogPage.appendChild(card);
        });

        // Append to GUI content
        guiContent.appendChild(changelogPage);

        // ================= ALT MANAGER PAGE =================
        const altPage = document.createElement("div");
        altPage.className = classes.favoritesPage || "favoritesPage";

        Object.assign(altPage.style, {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "25px 20px 50px 20px",
            overflowY: "auto"
        });

        // ===== Styles =====
        const altStyle = document.createElement("style");
        altStyle.textContent = `
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar {
  width: 8px;
}
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar-thumb {
  background: var(--highlight2);
  border-radius: 4px;
}
.${classes.favoritesPage || "favoritesPage"}::-webkit-scrollbar-track {
  background: transparent;
}
.altInput {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--textColor);
  font-size: .95em;
  outline: none;
  transition: border .2s ease, box-shadow .2s ease, background .2s ease;
}
.altInput::placeholder { color: rgba(255,255,255,.45); }
.altInput:focus {
  border-color: var(--highlight);
  background: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 2px rgb(from var(--highlight) r g b / 35%);
}
.altBtn {
  padding: 10px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  color: #000;
  background: linear-gradient(135deg, var(--highlight), var(--highlight2));
  box-shadow: 0 6px 20px rgb(from var(--highlight) r g b / 45%);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}
.altBtn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 30px rgb(from var(--highlight) r g b / 55%);
}
.altBtn:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgb(from var(--highlight) r g b / 35%);
}
.altSmallBtn { padding: 6px 10px; border-radius: 10px; font-weight: 700; font-size: .8em; }
`;
        document.head.appendChild(altStyle);

        // ===== Title =====
        const altTitle = document.createElement("div");
        altTitle.className = "bigTextContainer";
        altTitle.innerHTML = `<div class="bigText">👥 Alt Manager</div>`;
        Object.assign(altTitle.style, {
            fontSize: "2.2em",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "10px",
            textShadow: `0 0 12px var(--highlight), 0 0 24px var(--highlight2)`
        });
        altPage.appendChild(altTitle);

        // ===== Add Alt Card =====
        const addAltCard = document.createElement("div");
        Object.assign(addAltCard.style, {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "var(--background2)",
            boxShadow: "0 5px 20px rgba(0,0,0,0.28)"
        });
        addAltCard.innerHTML = `
  <span style="font-weight:800;color:var(--highlight)">Add Alt</span>
  <input id="altUser" class="altInput" placeholder="Username">
  <div style="display:flex;gap:8px;align-items:center">
    <input id="altPass" class="altInput" type="password" placeholder="Password" style="flex:1">
    <button id="toggleAddPass" class="altBtn altSmallBtn">👁</button>
  </div>
  <button id="saveAltBtn" class="altBtn">➕ Save Alt</button>
`;
        altPage.appendChild(addAltCard);

        // ===== Alt List =====
        const altList = document.createElement("div");
        Object.assign(altList.style, {
            display: "flex",
            flexDirection: "column",
            gap: "12px"
        });
        altPage.appendChild(altList);

        // ===== Cookie Storage Helpers =====
        function setCookie(name, value, days = 365) {
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            const domain = location.hostname.split('.').slice(-2).join('.'); // save on root domain
            document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=.blooket.com; SameSite=Lax`;
        }

        function getCookie(name) {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : null;
        }

        function areSweetAlertsEnabled() {
            const cookieValue = getCookie("sweetAlertsEnabled");
            return cookieValue === null ? true : cookieValue === "true";
        }

        // ===== Storage =====
        const ALT_KEY = "xgui_alts";
        const getAlts = () => {
            const cookie = getCookie(ALT_KEY);
            return cookie ? JSON.parse(cookie) : [];
        };
        const setAlts = (alts) => setCookie(ALT_KEY, JSON.stringify(alts));

        // ===== Render =====
        function renderAlts() {
            altList.innerHTML = "";
            const alts = getAlts();
            if (!alts.length) {
                const empty = document.createElement("div");
                empty.style.opacity = ".6";
                empty.innerText = "No alts saved";
                altList.appendChild(empty);
                return;
            }
            alts.forEach((alt, index) => {
                let visible = false;
                const card = document.createElement("div");
                Object.assign(card.style, {
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: "var(--background2)",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.28)",
                    transition: "transform .2s ease, box-shadow .2s ease"
                });
                card.onmouseover = () => {
                    card.style.transform = "translateY(-4px)";
                    card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
                };
                card.onmouseleave = () => {
                    card.style.transform = "translateY(0)";
                    card.style.boxShadow = "0 5px 20px rgba(0,0,0,0.28)";
                };

                const passSpan = document.createElement("span");
                passSpan.style.opacity = ".6";
                passSpan.innerText = "••••••••";

                const viewBtn = document.createElement("button");
                viewBtn.className = "altBtn altSmallBtn";
                viewBtn.innerText = "👁 View";
                viewBtn.onclick = () => {
                    visible = !visible;
                    passSpan.innerText = visible ? alt.pass : "••••••••";
                    viewBtn.innerText = visible ? "🙈 Hide" : "👁 View";
                };

                const removeBtn = document.createElement("button");
                removeBtn.className = "altBtn altSmallBtn";
                removeBtn.innerText = "Remove";
                removeBtn.onclick = () => {
                    const all = getAlts();
                    all.splice(index, 1);
                    setAlts(all);
                    renderAlts();
                };

                card.append(
                    Object.assign(document.createElement("span"), {
                        innerText: alt.user,
                        style: "font-weight:800;color:var(--highlight)"
                    }),
                    passSpan,
                    viewBtn,
                    removeBtn
                );

                altList.appendChild(card);
            });
        }

        // ===== Add Alt Logic =====
        const addPassInput = addAltCard.querySelector("#altPass");
        addAltCard.querySelector("#toggleAddPass").onclick = () => {
            addPassInput.type = addPassInput.type === "password" ? "text" : "password";
        };
        addAltCard.querySelector("#saveAltBtn").onclick = () => {
            const user = addAltCard.querySelector("#altUser").value.trim();
            const pass = addPassInput.value.trim();
            if (!user || !pass) return;

            const alts = getAlts();
            alts.push({
                user,
                pass
            });
            setAlts(alts);

            addAltCard.querySelector("#altUser").value = "";
            addPassInput.value = "";
            addPassInput.type = "password";

            renderAlts();
        };

        // Refresh on open
        altPage.onPath = renderAlts;




        const blookPage = document.createElement("div");
        blookPage.className = classes.favoritesPage || "favoritesPage";

        Object.assign(blookPage.style, {
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "25px 20px 50px 20px",
            overflowY: "auto"
        });

        const Blookstyle = document.createElement("style");
        Blookstyle.textContent = `
.blookPage::-webkit-scrollbar { width: 6px; }
.blookPage::-webkit-scrollbar-thumb { background: #5b4bdb; border-radius: 4px; }

.editorContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(18,22,46,0.85);
}

.blookInput {
  width: 70px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(120,100,255,0.25);
  background: rgba(20,25,55,0.65);
  color: #fff;
  text-align: center;
}

.previewBox {
  width: 220px;
  height: 220px;
  margin: 0 auto;
  background: rgba(10,12,30,0.7);
  border-radius: 20px;
  border: 1px solid rgba(120,100,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.previewStack {
  position: relative;
  width: 180px;
  height: 180px;
}

.previewStack img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.finalConfigInput {
  width: 92%;
  margin: 0 auto;
  padding: 12px;
  border-radius: 14px;
  background: rgba(20,25,55,0.75);
  border: 1px solid rgba(120,100,255,0.25);
  color: #fff;
  font-weight: 700;
  text-align: center;
}

.blookBtn {
  margin: 14px auto 0;
  padding: 12px 26px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #8f6bff, #5b4bdb);
}
`;
        document.head.appendChild(Blookstyle);

        blookPage.innerHTML += `
<div style="text-align:center">
  <div style="font-size:2em;font-weight:900;color:#fff">🖌️ Blook Editor</div>
</div>
`;

        const editorContainer = document.createElement("div");
        editorContainer.className = "editorContainer";
        blookPage.appendChild(editorContainer);

        function createInput(label) {
            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.flexDirection = "column";
            wrap.style.alignItems = "center";
            wrap.style.gap = "6px";

            const l = document.createElement("label");
            l.textContent = label;
            l.style.color = "#fff";
            l.style.fontWeight = "600";

            const i = document.createElement("input");
            i.type = "number";
            i.min = 0;
            i.value = 0;
            i.className = "blookInput";

            wrap.append(l, i);
            editorContainer.appendChild(wrap);
            return i;
        }

        const parts = {
            base: createInput("Base"),
            clothing: createInput("Clothing"),
            eyes: createInput("Eyes"),
            glasses: createInput("Glasses"),
            hair: createInput("Hair"),
            hairColor: createInput("Hair Color"),
            hat: createInput("Hat"),
            item: createInput("Item"),
            mouth: createInput("Mouth"),
            nose: createInput("Nose"),
            cheeks: createInput("Cheeks"),
            eyebrows: createInput("Eyebrows"),
            eyebrowsColor: createInput("Eyebrows Color")
        };

        const previewBox = document.createElement("div");
        previewBox.className = "previewBox";

        const previewStack = document.createElement("div");
        previewStack.className = "previewStack";

        previewBox.appendChild(previewStack);
        blookPage.appendChild(previewBox);

        const GITHUB_BASE =
            "https://raw.githubusercontent.com/0alter0/blook-parts/241bda5908c9355caef55ac994b1c2ec21124eb7";

        const PART_FOLDER_MAP = {
            base: "base",
            clothing: "clothing",
            eyes: "eyes",
            glasses: "glasses",
            hair: "hair",
            hat: "hats",
            item: "items",
            mouth: "mouths",
            nose: "nose",
            cheeks: "cheeks",
            eyebrows: "eyebrows"
        };

        const RENDER_ORDER = [
            "base",
            "clothing",
            "cheeks",
            "nose",
            "eyes",
            "eyebrows",
            "mouth",
            "glasses",
            "hair",
            "hat",
            "item"
        ];

        function renderStack() {
            previewStack.innerHTML = "";

            RENDER_ORDER.forEach(part => {
                const input = parts[part];
                if (!input) return;

                const id = Number(input.value);
                const folder = PART_FOLDER_MAP[part];
                if (!folder) return;

                if (part === "base") {
                    if (id < 0) return;
                } else {
                    if (id <= 0) return;
                }

                const img = document.createElement("img");
                img.src = `${GITHUB_BASE}/${folder}/item${id}.svg`;
                img.onerror = () => img.remove();

                previewStack.appendChild(img);
            });
        }

        const finalConfig = document.createElement("input");
        finalConfig.className = "finalConfigInput";
        blookPage.appendChild(finalConfig);

        function updateConfig() {
            const v = Object.values(parts).map(i => i.value || 0);
            finalConfig.value =
                `${v[0]}#${v[1]}#${v[2]}#${v[3]}#${v[4]}` +
                `$${v[5]}#${v[6]}#${v[7]}#${v[8]}#${v[9]}` +
                `#${v[10]}#${v[11]}$${v[12]}`;
        }

        Object.values(parts).forEach(i => {
            i.addEventListener("input", () => {
                updateConfig();
                renderStack();
            });
        });

        updateConfig();
        renderStack();

        const setBtn = document.createElement("button");
        setBtn.className = "blookBtn";
        setBtn.textContent = "Set Blook";
        blookPage.appendChild(setBtn);

        setBtn.onclick = () => {
            const blook = finalConfig.value;
            let t = Object.values(function e(t = document.querySelector("body>div")) {
                return Object.values(t)[1]?.children?.[0]?._owner?.stateNode ?
                    t :
                    e(t.querySelector(":scope>div"));
            }())[1].children[0]._owner.stateNode;

            if (!t.state.unlocks) t.props.client.blook = blook;
            t.props.liveGameController.setVal({
                path: `c/${t.props.client.name}/b`,
                val: blook
            });
        };
        //Written by Lil Skittle

        // ================= CLIENT PAGE =================
        const clientPage = document.createElement("div");
        clientPage.className = classes.favoritesPage || "favoritesPage";

        Object.assign(clientPage.style, {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
            padding: "40px 20px",
            overflowY: "auto"
        });

        // ===== STYLE =====
        const clientStyle = document.createElement("style");
        clientStyle.textContent = `
.clientCard {
  background: var(--background2);
  border-radius: 22px;
  padding: 36px 34px;
  box-shadow: 0 12px 40px rgba(0,0,0,.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.clientLaunchBtn {
  padding: 18px 46px;
  border-radius: 18px;
  font-size: 1.15em;
  font-weight: 900;
  cursor: pointer;
  border: none;
  color: #fff;
  background: linear-gradient(135deg,#8f6bff,#5b4bdb);
  box-shadow: 0 10px 30px rgba(120,100,255,.45);
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
}

.clientLaunchBtn:hover {
  transform: translateY(-4px);
  filter: brightness(1.12);
  box-shadow: 0 18px 45px rgba(120,100,255,.6);
}

.clientLaunchBtn:active {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(120,100,255,.4);
}
`;
        document.head.appendChild(clientStyle);

        // ===== TITLE =====
        const clienttitle = document.createElement("div");
        clienttitle.innerHTML = `
  <div style="
    font-size:2.4em;
    font-weight:900;
    text-align:center;
    color:#fff;
    text-shadow:0 0 14px var(--highlight),0 0 28px var(--highlight2);
  ">🧩 Client Sided Blook Menu</div>
  <div style="opacity:.65;font-weight:600;text-align:center;margin-top:6px">
    Customize your Blook to your style!
  </div>
`;

        // ===== CARD =====
        const card = document.createElement("div");
        card.className = "clientCard";

        // ===== LAUNCH BUTTON =====
        const launchBtn = document.createElement("button");
        launchBtn.className = "clientLaunchBtn";
        launchBtn.textContent = "Open Blook Customizer";

        launchBtn.onclick = () => {
            if (document.getElementById("xgui-blook-customizer")) return;

            // ===== DRAGGABLE CUSTOMIZER GUI =====
            const gui = document.createElement("div");
            gui.id = "xgui-blook-customizer";

            Object.assign(gui.style, {
                position: "fixed",
                top: "120px",
                left: "120px",
                zIndex: "99999",
                width: "250px",
                padding: "12px",
                background: "linear-gradient(180deg,#140f1f,#0b0812)",
                color: "#eee",
                borderRadius: "14px",
                border: "1px solid #2a1f3d",
                fontFamily: "Inter, system-ui, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: "0 12px 40px rgba(120,80,255,.25)",
                userSelect: "none"
            });

            // ===== HEADER =====
            const header = document.createElement("div");
            Object.assign(header.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "28px",
                padding: "0 4px",
                fontWeight: "700",
                fontSize: "13px",
                color: "#cdbbff",
                cursor: "grab"
            });
            header.textContent = "Blook Customizer";

            const close = document.createElement("button");
            close.textContent = "✕";
            Object.assign(close.style, {
                background: "none",
                border: "none",
                color: "#7f6ab8",
                fontSize: "16px",
                cursor: "pointer"
            });
            close.onclick = () => gui.remove();

            header.appendChild(close);
            gui.appendChild(header);

            // ===== DRAG =====
            let drag = false,
                dx = 0,
                dy = 0;
            header.onmousedown = e => {
                drag = true;
                dx = e.clientX - gui.offsetLeft;
                dy = e.clientY - gui.offsetTop;
                header.style.cursor = "grabbing";
            };
            document.onmousemove = e => {
                if (!drag) return;
                gui.style.left = e.clientX - dx + "px";
                gui.style.top = e.clientY - dy + "px";
            };
            document.onmouseup = () => {
                drag = false;
                header.style.cursor = "grab";
            };

            // ===== STACK =====
            const stack = () => {
                const d = document.createElement("div");
                Object.assign(d.style, {
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                });
                return d;
            };

            // ===== INPUT =====
            const input = ph => {
                const i = document.createElement("input");
                i.placeholder = ph;
                Object.assign(i.style, {
                    width: "100%",
                    height: "36px",
                    padding: "0 12px",
                    background: "#0f0b18",
                    color: "#eee",
                    border: "1px solid #2e2450",
                    borderRadius: "10px",
                    fontSize: "12.5px",
                    boxSizing: "border-box",
                    outline: "none"
                });
                i.onfocus = () => i.style.borderColor = "#8b5cf6";
                i.onblur = () => i.style.borderColor = "#2e2450";
                return i;
            };

            // ===== BUTTON =====
            const btn = (t, bg) => {
                const b = document.createElement("button");
                b.textContent = t;
                Object.assign(b.style, {
                    height: "38px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "700",
                    color: "#fff",
                    background: bg
                });
                b.onmouseenter = () => b.style.filter = "brightness(1.12)";
                b.onmouseleave = () => b.style.filter = "none";
                return b;
            };

            const custom = stack();
            const imgIn = input("Blook Image URL");
            const bgIn = input("Background URL");
            const nameIn = input("Blook Name");
            const rareIn = input("Rarity Name");
            const colIn = input("Rarity Color");
            custom.append(imgIn, bgIn, nameIn, rareIn, colIn);

            const apply = btn("Apply Custom", "linear-gradient(135deg,#7c3aed,#5b21b6)");

            const seedStack = stack();
            const seedIn = input("Seed");
            const load = btn("Load Seed", "linear-gradient(135deg,#22c55e,#16a34a)");
            const get = btn("Get Seed", "#1a1626");
            seedStack.append(seedIn, load, get);

            gui.append(custom, apply, seedStack);
            document.body.appendChild(gui);

            // ===== LOGIC (UNCHANGED) =====
            const updateBlook = (img, bg, name, rare, col) => {
                const b = document.querySelector('img[class*="blook"]');
                const g = document.querySelector('img[class*="_rightBackground"]');
                const n = document.querySelector('div[style*="white-space: nowrap"]');
                const r = document.querySelector('div[class*="Rarity"]');

                if (b && img) b.src = img;
                if (g && bg) g.src = bg;
                if (r) {
                    if (rare) r.textContent = rare;
                    if (col) r.style.color = col;
                }
                if (n && name) {
                    n.textContent = name;
                    let s = 39;
                    n.style.fontSize = s + "px";
                    while (n.scrollWidth > n.parentElement.clientWidth && s > 1) {
                        n.style.fontSize = --s + "px";
                    }
                }
            };

            apply.onclick = () =>
                updateBlook(imgIn.value, bgIn.value, nameIn.value, rareIn.value, colIn.value);

            get.onclick = () => {
                const b = document.querySelector('img[class*="blook"]');
                const g = document.querySelector('img[class*="_rightBackground"]');
                const n = document.querySelector('div[style*="white-space: nowrap"]');
                const r = document.querySelector('div[class*="Rarity"]');
                seedIn.value = btoa(unescape(encodeURIComponent(JSON.stringify({
                    img: b?.src,
                    bg: g?.src,
                    name: n?.textContent,
                    rare: r?.textContent,
                    col: r?.style.color
                }))));
            };

            load.onclick = () => {
                try {
                    const d = JSON.parse(decodeURIComponent(escape(atob(seedIn.value))));
                    updateBlook(d.img, d.bg, d.name, d.rare, d.col);
                } catch {
                    alert("Invalid Seed");
                }
            };
        };

        // ===== BUILD =====
        card.append(launchBtn);
        clientPage.append(clienttitle, card);

// ================= CUSTOM MODULES PAGE =================
const modulePage = document.createElement("div");
modulePage.className = classes.favoritesPage || "favoritesPage";

// JavaScript minification function
function minifyJS(code) {
    try {
        return code
            // Remove single-line comments
            .replace(/\/\/.*$/gm, '')
            // Remove multi-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around operators and punctuation
            .replace(/\s*([{}();,:<>!=+\-*/%&|?])\s*/g, '$1')
            // Remove whitespace after keywords
            .replace(/\b(return|var|let|const|if|else|for|while|function|class)\s+/g, '$1 ')
            .trim();
    } catch (e) {
        console.error('Minification error:', e);
        return code; // Return original code if minification fails
    }
}

Object.assign(modulePage.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "28px",
    padding: "40px 20px",
    overflowY: "auto",
    minHeight: "100vh"
});

const moduleStyle = document.createElement("style");
moduleStyle.textContent = `
.moduleCard {
    background: linear-gradient(135deg, rgba(30, 25, 50, 0.8), rgba(20, 18, 35, 0.9));
    border-radius: 18px;
    padding: 36px;
    box-shadow: 0 8px 24px rgba(0,0,0,.25);
    border: 1px solid rgba(143,107,255,.15);
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 650px;
}

.moduleBtn {
    padding: 15px 36px;
    border-radius: 10px;
    font-size: 1.05em;
    font-weight: 700;
    cursor: pointer;
    border: none;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    box-shadow: 0 4px 12px rgba(99,102,241,.3);
    transition: all .2s ease;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.moduleBtn:hover {
    background: linear-gradient(135deg, #4f46e5, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99,102,241,.4);
}

.moduleBtn:active {
    transform: translateY(0);
}

.moduleSecondaryBtn {
    background: linear-gradient(135deg, #374151, #1f2937);
    border: 1px solid rgba(255,255,255,.1);
    box-shadow: 0 4px 12px rgba(0,0,0,.2);
}

.moduleSecondaryBtn:hover {
    background: linear-gradient(135deg, #4b5563, #374151);
    border-color: rgba(255,255,255,.15);
}

.moduleDangerBtn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 4px 12px rgba(239,68,68,.3);
}

.moduleDangerBtn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    box-shadow: 0 6px 16px rgba(239,68,68,.4);
}

.buttonGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
    width: 100%;
}

.buttonGrid.centered {
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
}

.clearAllContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 4px;
}

.clearAllBtn {
    max-width: 300px;
}

.moduleManageBtn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    box-shadow: 0 4px 12px rgba(139,92,246,.3);
}

.moduleManageBtn:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 6px 16px rgba(139,92,246,.4);
}

.swal2-popup {
    background: #1a1625 !important;
    border: 1px solid rgba(143,107,255,.2) !important;
}

.swal2-title {
    color: #fff !important;
}

.swal2-html-container {
    color: rgba(255,255,255,.85) !important;
}

.swal2-container .moduleItemCard {
    background: linear-gradient(135deg, rgba(40, 35, 60, 0.6), rgba(30, 25, 50, 0.8));
    border: 1px solid rgba(143,107,255,.2);
    border-radius: 14px;
    padding: 22px;
    margin-bottom: 14px;
    transition: all .2s ease;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.swal2-container .moduleItemCard:hover {
    border-color: rgba(143,107,255,.4);
    background: linear-gradient(135deg, rgba(50, 45, 70, 0.7), rgba(40, 35, 60, 0.9));
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0,0,0,.3);
}

.swal2-container .moduleItemInfo {
    flex: 1;
}

.swal2-container .moduleItemActions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
}

.swal2-container .moduleActionBtn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease;
}

.swal2-container .moduleEditBtn {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    box-shadow: 0 2px 8px rgba(99,102,241,.3);
}

.swal2-container .moduleEditBtn:hover {
    background: linear-gradient(135deg, #4f46e5, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99,102,241,.4);
}

.swal2-container .moduleDeleteBtn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 2px 8px rgba(239,68,68,.3);
}

.swal2-container .moduleDeleteBtn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239,68,68,.4);
}

.swal2-container .moduleItemTitle {
    font-size: 1.15em;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
}

.swal2-container .moduleItemDesc {
    color: rgba(255,255,255,.65);
    font-size: 0.92em;
    line-height: 1.5;
    margin-bottom: 10px;
}

.swal2-container .moduleItemType {
    display: inline-block;
    padding: 5px 12px;
    background: rgba(99,102,241,.2);
    border: 1px solid rgba(99,102,241,.35);
    border-radius: 14px;
    font-size: 0.78em;
    font-weight: 700;
    color: #a5b4fc;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.swal2-confirm, .swal2-deny, .swal2-cancel {
    font-weight: 600 !important;
    padding: 10px 24px !important;
    border-radius: 8px !important;
}

.swal2-select {
    color: #000 !important;
    background: #fff !important;
}

.helpBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(99,102,241,.15);
    border: 1.5px solid rgba(99,102,241,.3);
    color: #a5b4fc;
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s ease;
    margin-left: 10px;
    vertical-align: middle;
}

.helpBtn:hover {
    background: rgba(99,102,241,.25);
    border-color: rgba(99,102,241,.5);
    transform: scale(1.1);
}

.docContainer {
    max-height: 500px;
    overflow-y: auto;
    text-align: left;
    padding: 20px;
    background: rgba(20, 18, 35, 0.4);
    border-radius: 12px;
    margin-bottom: 20px;
}

.docSection {
    margin-bottom: 24px;
}

.docTitle {
    font-size: 1.3em;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.docSubtitle {
    font-size: 1.1em;
    font-weight: 600;
    color: #a5b4fc;
    margin-bottom: 8px;
    margin-top: 16px;
}

.docText {
    color: rgba(255,255,255,.75);
    line-height: 1.6;
    margin-bottom: 12px;
}

.docCode {
    background: rgba(0,0,0,.3);
    border: 1px solid rgba(99,102,241,.2);
    border-radius: 8px;
    padding: 12px;
    font-family: monospace;
    font-size: 0.9em;
    color: #e0e7ff;
    overflow-x: auto;
    margin: 8px 0;
}

.docHighlight {
    color: #a5b4fc;
    font-weight: 600;
}

.docList {
    margin-left: 20px;
    color: rgba(255,255,255,.75);
    line-height: 1.8;
}
`;
document.head.appendChild(moduleStyle);

const modTitle = document.createElement("div");
modTitle.innerHTML = `
    <div style="
        font-size:2.5em;
        font-weight:800;
        text-align:center;
        color:#fff;
        margin-bottom: 10px;
        text-shadow: 0 2px 8px rgba(143,107,255,.3);
    ">Custom Module Manager</div>
    <div style="
        opacity:.7;
        font-weight:600;
        text-align:center;
        font-size:1.05em;
        color:rgba(255,255,255,.85);
    ">
        Create and manage your custom modules.<br>
        Refresh to update custom modules.
    </div>
`;

const buttonGrid = document.createElement("div");
buttonGrid.className = "buttonGrid";

// Count modules to determine if we should center
// If you find a more optomized way please tell me
const updateButtonGrid = () => {
    const moduleCount = (CookieHelper.getCookie('custom_modules_list') || []).length;
    const buttonCount = moduleCount > 0 ? 3 : 3;
    if (buttonCount <= 3) {
        buttonGrid.classList.add('centered');
    } else {
        buttonGrid.classList.remove('centered');
    }
};

const createBtn = document.createElement("button");
createBtn.className = "moduleBtn";
createBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Create Module
`;
createBtn.onclick = async () => {
    const { value: formValues, isDismissed } = await Sweetalert2.fire({
        title: '<span>Create New Module</span><button class="helpBtn" id="help-btn" type="button">?</button>',
        html:
            '<input id="swal-name" class="swal2-input" placeholder="Module Name" style="margin-bottom: 10px;">' +
            '<textarea id="swal-desc" class="swal2-textarea" placeholder="Description (optional)" style="height: 80px; margin-bottom: 10px;"></textarea>' +
            '<select id="swal-type" class="swal2-select" style="background: #1a1625 !important; border: 1px solid #fff !important; color: rgba(255,255,255,.75) !important; padding: 10px 15px; border-radius: 8px; line-height: 1.6;"><option value="execute" style="background: #1a1625; color: #e0e7ff;">Execute Button</option><option value="toggle" style="background: #1a1625; color: #e0e7ff;">Toggle</option><option value="edit" style="background: #1a1625; color: #e0e7ff; margin-bottom: 10px;">Value Edit</option></select>' +
            '<textarea id="swal-code" class="swal2-textarea" placeholder="JavaScript Code" style="height: 150px; font-family: monospace;"></textarea>',
        focusConfirm: false,
        width: '600px',
        didOpen: () => {
            const helpBtn = document.getElementById('help-btn');
            if (helpBtn) {
                helpBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    Sweetalert2.close();
                    showDocumentation();
                });
            }
        },
        preConfirm: () => {
            const name = document.getElementById('swal-name').value;
            const code = document.getElementById('swal-code').value;
            if (!name || !code) {
                Sweetalert2.showValidationMessage('Name and code are required');
                return false;
            }
            return {
                name: name,
                description: document.getElementById('swal-desc').value,
                type: document.getElementById('swal-type').value,
                code: minifyJS(code) 
            };
        }
    });
    if (formValues) {
        const saved = CookieHelper.getCookie('custom_modules_list') || [];
        saved.push(formValues);
        CookieHelper.setCookie('custom_modules_list', saved);
        updateButtonGrid();
        refreshClearButton();

        refreshCustomModulesUI();

        Sweetalert2.fire('Success', 'Module created successfully', 'success');
    }
};

const manageBtn = document.createElement("button");
manageBtn.className = "moduleBtn moduleManageBtn";
manageBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
    Manage Modules
`;
manageBtn.onclick = () => {
    showModuleManager();
};

const importBtn = document.createElement("button");
importBtn.className = "moduleBtn moduleSecondaryBtn";
importBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Import
`;
importBtn.onclick = async () => {
    const { value: code } = await Sweetalert2.fire({
        title: 'Import Module(s)',
        input: 'textarea',
        inputPlaceholder: 'Paste your module JSON here...',
        width: '600px',
        inputAttributes: {
            style: 'font-family: monospace; height: 200px;'
        }
    });
    if (code) {
        try {
            const parsed = JSON.parse(code);
            const saved = CookieHelper.getCookie('custom_modules_list') || [];
            if (Array.isArray(parsed)) saved.push(...parsed);
            else saved.push(parsed);
            CookieHelper.setCookie('custom_modules_list', saved);
            updateButtonGrid();
            refreshClearButton();
            Sweetalert2.fire('Success', 'Module(s) imported successfully', 'success');
            refreshCustomModulesUI();
        } catch (e) {
            Sweetalert2.fire('Error', 'Invalid JSON format', 'error');
        }
    }
};

const exportBtn = document.createElement("button");
exportBtn.className = "moduleBtn moduleSecondaryBtn";
exportBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
    Export
`;
exportBtn.onclick = () => {
    const modules = JSON.stringify(CookieHelper.getCookie('custom_modules_list') || []);
    Sweetalert2.fire({
        title: 'Export Your Modules',
        input: 'textarea',
        inputValue: modules,
        width: '600px',
        inputAttributes: {
            style: 'font-family: monospace; height: 200px;',
            readonly: true
        },
        showCancelButton: true,
        confirmButtonText: 'Copy to Clipboard',
        preConfirm: () => {
            navigator.clipboard.writeText(modules);
            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Sweetalert2.fire('Copied', 'Modules copied to clipboard', 'success');
        }
    });
};

buttonGrid.append(createBtn, manageBtn, importBtn, exportBtn);

// Clear All button
const clearAllContainer = document.createElement("div");
clearAllContainer.className = "clearAllContainer";

const clearBtn = document.createElement("button");
clearBtn.className = "moduleBtn moduleDangerBtn clearAllBtn";
clearBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
    Clear All Modules
`;
clearBtn.onclick = async () => {
    const result = await Sweetalert2.fire({
        title: 'Delete All Modules?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Delete All'
    });
    if (result.isConfirmed) {
        CookieHelper.setCookie('custom_modules_list', []);
        updateButtonGrid();
        clearAllContainer.style.display = 'none';
        Sweetalert2.fire('Deleted', 'All modules have been removed', 'success');
    }
};

function refreshClearButton() {
    const modules = CookieHelper.getCookie('custom_modules_list') || [];
    if (modules.length > 0) {
        clearAllContainer.style.display = 'flex';
    } else {
        clearAllContainer.style.display = 'none';
    }
}

clearAllContainer.appendChild(clearBtn);

function refreshCustomModulesUI() {
    const customModules = CookieHelper.getCookie('custom_modules_list') || [];

    const customCheats = customModules.map((module, index) => {
        const defaultDescription = module.description || `Custom Module #${index + 1}`;

        if (module.type === 'execute') {
            return {
                name: module.name,
                description: defaultDescription,
                run: createFunctionFromCode(module.code)
            };
        } else if (module.type === 'toggle') {
            return {
                name: module.name,
                description: defaultDescription,
                type: 'toggle',
                enabled: false,
                data: null,
                run: createFunctionFromCode(module.code)
            };
        } else if (module.type === 'edit') {
            return {
                name: module.name,
                description: defaultDescription,
                inputs: [{
                    name: 'Value',
                    type: 'string'
                }],
                run: createFunctionFromCode(module.code, 'value')
            };
        }
    });

    cheats.custom_modules.cheats = customCheats;

    // Rebuild the custom modules list in the UI
    // Use the stored reference to the custom modules page
    if (customModulesPageRef && customModulesCheatsList) {
        // Clear existing cheats
        customModulesCheatsList.innerHTML = '';

        // Rebuild all custom module cheats
        for (const cheat of customCheats) {
                const cheatElement = document.createElement("div");
                const cheatTop = document.createElement("div");
                cheatTop.className = classes.cheatTop;

                const cheatInfo = document.createElement("div");
                cheatInfo.className = classes.cheatInfo;
                const cheatName = document.createElement("span");
                cheatName.innerText = cheat.name;
                cheatName.className = classes.cheatName;

                const cheatDescription = document.createElement("span");
                cheatDescription.innerText = cheat.description;
                cheatDescription.className = classes.cheatDescription;
                cheatInfo.append(cheatName, cheatDescription);
                cheatElement.append(cheatTop);

                // Handle inputs if the cheat has them
                const inputs = [];
                if (Array.isArray(cheat.inputs)) {
                    const cheatInputs = document.createElement("div");
                    cheatInputs.className = classes.cheatInputs;
                    for (const input of cheat.inputs) {
                        const inputElement = document.createElement("div");
                        const inputName = document.createElement("span");
                        inputName.innerText = input.name;
                        inputElement.append(inputName);
                        cheatInputs.append(inputElement);

                        if (input.type == "options") {
                            const inputField = document.createElement("select");
                            inputField.dataset[datasets.type] = "options";
                            inputElement.append(inputField);
                            inputs.push(inputField);
                            let curField = inputField;
                            const updateOptions = () => {
                                let choose = input.options;

                                const newInputField = document.createElement("select");
                                newInputField.dataset[datasets.type] = "options";
                                inputs[inputs.indexOf(curField)] = newInputField;
                                curField.replaceWith(newInputField);
                                curField = newInputField;

                                if (typeof choose == "function")
                                    try {
                                        choose = choose();
                                    } catch {
                                        choose = []
                                    }
                                if (choose instanceof Promise) {
                                    const waiting = document.createElement("option");
                                    waiting.value = '""';
                                    waiting.innerHTML = "Loading Options...";
                                    curField.append(waiting);
                                    choose.then((choices) => {
                                        if (choices?.length > 0) {
                                            curField.innerHTML = "";
                                            for (const choice of choices) {
                                                const option = document.createElement("option");
                                                option.value = JSON.stringify(choice?.value ?? choice);
                                                option.innerHTML = choice?.name || choice;
                                                curField.append(option);
                                            }
                                        } else {
                                            const newInputField = document.createElement("input");
                                            inputs[inputs.indexOf(curField)] = newInputField;
                                            curField.replaceWith(newInputField);
                                            newInputField.dataset[datasets.type] = "string";
                                            newInputField.placeholder = input.name;
                                            curField = newInputField;
                                        }
                                    });
                                } else {
                                    if (choose?.length > 0) {
                                        for (const choice of choose) {
                                            const option = document.createElement("option");
                                            option.value = JSON.stringify(choice?.value ?? choice);
                                            option.innerHTML = choice?.name || choice;
                                            curField.append(option);
                                        }
                                    } else {
                                        const newInputField = document.createElement("input");
                                        inputs[inputs.indexOf(curField)] = newInputField;
                                        curField.replaceWith(newInputField);
                                        newInputField.dataset[datasets.type] = "string";
                                        newInputField.placeholder = input.name;
                                        curField = newInputField;
                                    }
                                }
                            };
                            updateOptions();
                        } else {
                            const inputField = document.createElement("input");
                            inputField.dataset[datasets.type] = input.type;
                            if (input.type == "number") {
                                inputField.type = "number";
                                inputField.min = input.min;
                                inputField.max = input.max;
                                inputField.value = input.value || (input.min ?? 0);
                            }
                            inputField.placeholder = input.name;
                            inputElement.append(inputField);
                            inputs.push(inputField);
                        }
                    }
                    cheatElement.append(cheatInputs);
                }
                cheatTop.append(cheatInfo);

                const runButton = document.createElement("div");
                runButton.className = classes.runCheat;
                if (cheat.type == "toggle") {
                    runButton.innerText = "Toggle On";
                    runButton.classList.add(classes.toggleCheat);
                } else {
                    runButton.innerText = "Execute";
                }

                runButton.onclick = () => {
                    try {
                        cheat.run.apply(
                            cheat,
                            inputs.map((x) => (x.dataset[datasets.type] == "number" ? parseFloat("0" + x.value) : x.dataset[datasets.type] == "options" ? JSON.parse(x.value) : x.value))
                        );
                        if (cheat.type == "toggle") {
                            cheat.enabled = !cheat.enabled;
                            runButton.innerText = "Toggle " + (cheat.enabled ? "Off" : "On");
                            runButton.classList.toggle(classes.active, cheat.enabled);
                            Logs.addLog(`Toggled "${cheat.name}" ${cheat.enabled ? "on" : "off"}`, cheat.enabled ? "var(--toggleOn)" : "var(--toggleOff)");
                        } else {
                            Logs.addLog(`Ran "${cheat.name}"`, "var(--highlight)");
                        }
                    } catch (err) {
                        Logs.addLog(`Error running "${cheat.name}": ${err.message}`, "var(--error)");
                    }
                };

                cheatTop.append(runButton);
                customModulesCheatsList.append(cheatElement);
            }
    }
}

// Documentation function
function showDocumentation(editIndex = null) {
    const docHTML = `
        <div class="docContainer">
            <div class="docSection">
                <div class="docTitle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Custom Module Documentation
                </div>
                <div class="docText">
                    Learn how to create custom modules for your cheat menu. There are three types of modules available:
                </div>
            </div>

            <div class="docSection">
                <div class="docSubtitle">1. Execute Button</div>
                <div class="docText">
                    A simple button that runs code once when clicked. Perfect for one-time actions.
                </div>
                <div class="docText"><span class="docHighlight">Key points:</span></div>
                <ul class="docList">
                    <li>Code runs immediately when button is clicked</li>
                    <li>No state management needed</li>
                    <li>Use for instant actions like toggling dark mode or showing alerts</li>
                </ul>
                <div class="docCode">
// Example: Toggle Dark Mode
function() {
    let darkMode = document.getElementById('nightify');
    if (darkMode) {
        darkMode.remove();
    } else {
        let style = document.createElement('style');
        style.id = 'nightify';
        style.textContent = 'html { filter: invert(100%) hue-rotate(180deg); }';
        document.head.appendChild(style);
    }
}</div>
            </div>

            <div class="docSection">
                <div class="docSubtitle">2. Toggle</div>
                <div class="docText">
                    A button that can be turned on and off. Great for continuous actions or intervals.
                </div>
                <div class="docText"><span class="docHighlight">Important properties:</span></div>
                <ul class="docList">
                    <li><span class="docHighlight">this.enabled</span> - Boolean indicating if toggle is on/off</li>
                    <li><span class="docHighlight">this.data</span> - Store data like intervals or timers</li>
                    <li>Check <span class="docHighlight">this.enabled</span> to determine current state</li>
                    <li>Set <span class="docHighlight">this.enabled</span> to true when turning on</li>
                    <li>Set <span class="docHighlight">this.enabled</span> to false when turning off</li>
                    <li>Clean up intervals/timers when disabled</li>
                </ul>
                <div class="docCode">
// Example: Auto Answer Toggle
function() {
    if (!this.enabled) {
        // Turn ON
        this.enabled = true;
        this.data = setInterval(() => {
            // Your repeated code here
            console.log('Running...');
        }, 100);
    } else {
        // Turn OFF
        this.enabled = false;
        clearInterval(this.data);
        this.data = null;
    }
}</div>
            </div>

            <div class="docSection">
                <div class="docSubtitle">3. Value Edit</div>
                <div class="docText">
                    A module that accepts user input before running. Perfect for setting custom values.
                </div>
                <div class="docText"><span class="docHighlight">Usage:</span></div>
                <ul class="docList">
                    <li><span class="docHighlight">function(parameterName)</span> - Your function receives the user's input as a parameter</li>
                    <li><span class="docHighlight">parameterName</span> - Can be any name you choose (e.g., amount, value, number)</li>
                    <li>User enters a value in a prompt before the module executes</li>
                    <li>The entered value is passed directly to your function</li>
                </ul>
                <div class="docText"><span class="docHighlight">Key points:</span></div>
                <ul class="docList">
                    <li>Great for setting game values, amounts, or custom settings</li>
                    <li>Parameter can be used anywhere in your function code</li>
                    <li>Input type is determined by module configuration (number, string, etc.)</li>
                </ul>
                <div class="docCode">
// Example: Set Crypto Amount
function(amount) {
    let stateNode = getStateNode();
    stateNode.setState({
        crypto: amount,
        crypto2: amount
    });
    stateNode.props.liveGameController.setVal({
        path: \`c/\${stateNode.props.client.name}/cr\`,
        val: amount
    });
}</div>
            </div>

            <div class="docSection">
                <div class="docSubtitle">Code Format Options</div>
                <div class="docText">
                    You can write your code in any of these formats:
                </div>
                <ul class="docList">
                    <li><span class="docHighlight">Function declaration:</span> function() { /* code */ } or function(param) { /* code */ }</li>
                    <li><span class="docHighlight">Arrow function:</span> () => { /* code */ } or (param) => { /* code */ }</li>
                    <li><span class="docHighlight">Function body only:</span> Just write the code without function wrapper</li>
                </ul>
                <div class="docText">
                    All three formats work equally well - choose whichever you prefer!
                </div>
            </div>

            <div class="docSection">
                <div class="docSubtitle">Tips & Best Practices</div>
                <ul class="docList">
                    <li>Test your modules in a safe environment first</li>
                    <li>Always clean up intervals and timers in toggle modules</li>
                    <li>Use descriptive names and descriptions for your modules</li>
                    <li>For toggles, always check <span class="docHighlight">this.enabled</span> first</li>
                    <li>Store interval IDs in <span class="docHighlight">this.data</span> for toggle modules</li>
                </ul>
            </div>
        </div>
    `;

    Sweetalert2.fire({
        title: 'Module Documentation',
        html: docHTML,
        width: '750px',
        showConfirmButton: true,
        confirmButtonText: 'Back',
        confirmButtonColor: '#6366f1',
        customClass: {
            popup: 'doc-popup'
        }
    }).then(() => {
        if (editIndex !== null) {
            editModule(editIndex);
        } else {
            createBtn.click();
        }
    });
}

function showModuleManager() {
    const modules = CookieHelper.getCookie('custom_modules_list') || [];

    if (modules.length === 0) {
        Sweetalert2.fire({
            title: 'No Modules',
            text: 'You haven\'t created any modules yet',
            icon: 'info',
            confirmButtonColor: '#6366f1'
        });
        return;
    }

    let moduleListHTML = '<div style="max-height: 450px; overflow-y: auto; padding-right: 8px;">';
    modules.forEach((module, index) => {
        const escapedName = module.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const escapedDesc = (module.description || 'No description').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        moduleListHTML += `
            <div class="moduleItemCard">
                <div class="moduleItemInfo">
                    <div class="moduleItemTitle">${escapedName}</div>
                    <div class="moduleItemDesc">${escapedDesc}</div>
                    <span class="moduleItemType">${module.type}</span>
                </div>
                <div class="moduleItemActions">
                    <button class="moduleActionBtn moduleEditBtn" data-index="${index}" data-action="edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="moduleActionBtn moduleDeleteBtn" data-index="${index}" data-action="delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    moduleListHTML += '</div>';

    Sweetalert2.fire({
        title: 'Manage Modules',
        html: moduleListHTML,
        width: '700px',
        showConfirmButton: false,
        showCloseButton: true,
        confirmButtonColor: '#6366f1',
        didOpen: () => {
            const actionBtns = document.querySelectorAll('.moduleActionBtn');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    const action = btn.dataset.action;

                    if (action === 'edit') {
                        editModule(index);
                    } else if (action === 'delete') {
                        deleteModule(index);
                    }
                });
            });
        }
    });
}

async function editModule(index) {
    const modules = CookieHelper.getCookie('custom_modules_list') || [];
    const module = modules[index];

    const { value: formValues, isDismissed } = await Sweetalert2.fire({
        title: '<span>Edit Module</span><button class="helpBtn" id="help-btn-edit" type="button">?</button>',
        html:
            `<input id="swal-name" class="swal2-input" placeholder="Module Name" value="${module.name.replace(/"/g, '&quot;')}" style="margin-bottom: 10px;">` +
            `<textarea id="swal-desc" class="swal2-textarea" placeholder="Description (optional)" style="height: 80px; margin-bottom: 10px;">${module.description || ''}</textarea>` +
            `<select id="swal-type" class="swal2-select" style="margin-bottom: 10px;">
                <option value="execute" ${module.type === 'execute' ? 'selected' : ''}>Execute Button</option>
                <option value="toggle" ${module.type === 'toggle' ? 'selected' : ''}>Toggle</option>
                <option value="edit" ${module.type === 'edit' ? 'selected' : ''}>Value Edit</option>
            </select>` +
            `<textarea id="swal-code" class="swal2-textarea" placeholder="JavaScript Code" style="height: 150px; font-family: monospace;">${module.code}</textarea>`,
        focusConfirm: false,
        width: '600px',
        confirmButtonColor: '#6366f1',
        didOpen: () => {
            const helpBtn = document.getElementById('help-btn-edit');
            if (helpBtn) {
                helpBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    Sweetalert2.close();
                    showDocumentation(index);
                });
            }
        },
        preConfirm: () => {
            const name = document.getElementById('swal-name').value;
            const code = document.getElementById('swal-code').value;
            if (!name || !code) {
                Sweetalert2.showValidationMessage('Name and code are required');
                return false;
            }
            return {
                name: name,
                description: document.getElementById('swal-desc').value,
                type: document.getElementById('swal-type').value,
                code: minifyJS(code) // Minify code before saving
            };
        }
    });

    if (formValues) {
        modules[index] = formValues;
        CookieHelper.setCookie('custom_modules_list', modules);

        // Refresh the modules in the gamemodes list
        refreshCustomModulesUI();

        await Sweetalert2.fire({
            title: 'Updated',
            text: 'Module updated successfully',
            icon: 'success',
            confirmButtonColor: '#6366f1'
        });
        showModuleManager();
    } else if (isDismissed) {
        showModuleManager();
    }
}

async function deleteModule(index) {
    const modules = CookieHelper.getCookie('custom_modules_list') || [];
    const module = modules[index];

    const confirm = await Sweetalert2.fire({
        title: 'Delete Module?',
        text: `Are you sure you want to delete "${module.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Delete'
    });

    if (confirm.isConfirmed) {
        modules.splice(index, 1);
        CookieHelper.setCookie('custom_modules_list', modules);

        // Refresh the modules in the gamemodes list
        refreshCustomModulesUI();

        updateButtonGrid();
        refreshClearButton();
        await Sweetalert2.fire({
            title: 'Deleted',
            text: 'Module has been removed',
            icon: 'success',
            confirmButtonColor: '#6366f1'
        });
        showModuleManager();
    } else {
        showModuleManager();
    }
}

updateButtonGrid();

// Only show clear button if modules exist
refreshClearButton();

modulePage.append(modTitle, buttonGrid, clearAllContainer);

        const licenseMessage = document.createElement("div");
        licenseMessage.className = classes.licenseMessage;
        licenseMessage.innerHTML = `<i class="fas fa-file-alt" style="line-height: 1;aspect-ratio: 1 / 1;height: 20px;display: inline-grid;place-items: center;"></i> This script is licensed under <a style="color: var(--highlight);" target="_blank" href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0</a>, read more <a style="color: var(--highlight);" target="_blank" href="https://github.com/Blooket-Council/Blooket-Cheats?tab=readme-ov-file#licensing">here</a>.<br>`;

        const copyrightTag = document.createElement("span");
        copyrightTag.className = classes.copyrightTag;

        copyrightTag.innerText = `Copyright © ${new Date().getFullYear()} Tony-the-best`;

        const codingCredits = document.createElement("ul");
        codingCredits.className = classes.codingCredits;

        codingCredits.append(createCredit("Owner", "Tony-the-best"));
        codingCredits.append(createCredit("Full GUI Dev", "Cathead+landsedge"));
        codingCredits.append(createCredit("Module Dev", "redhorse26"));
        codingCredits.append(createCredit("Design+Module Dev", "Lil Skittle"));
        codingCredits.append(createCredit("Contributor", "DannyDan"));
        codingCredits.append(createCredit("Original Blooket Cheats", 'gliz <i class="fas fa-long-arrow-alt-right"></i> Minesraft2 <i class="fas fa-long-arrow-alt-right"></i> 05Konz'));

        const creditLinks = document.createElement("ul");
        creditLinks.className = classes.creditLinks;

        creditLinks.append(createCredit("Our Github", '<a target="_blank" href="https://github.com/Tony-the-the-best/blooket-gui">X-GUI CHEATS/GITHUB</a>'));
        creditLinks.append(createCredit("Our Website", '<a target="_blank" href="https://xgui-client.github.io">More Info/Website</a>'));
        creditLinks.append(createCredit("Discord", '<a target="_blank" href="https://discord.gg/A7CRUz8vFR">JOIN THE SERVER</a>'));

        function parseTime(d) {
            const hour = d.getHours() % 12 == 0 ? 12 : d.getHours() % 12;
            const minutes = d.getMinutes().toString().padStart(2, "0");
            return `${hour}:${minutes} ${d.getHours() >= 12 ? "PM" : "AM"}`;
        }

        function parseDate(d) {
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()];
            return `${month} ${d.getDate()}${getOrdinal(d.getDate())}, ${d.getFullYear()} - ${parseTime(d)}`;
        }

        const uploadDates = document.createElement("ul");
        uploadDates.className = classes.uploadDates;

        try {
            let currentDate = new Date(null),
                latestDate = new Date(null);
            if (latestProcess != -1) uploadDates.append(createCredit("", parseDate(null)));
            if (currentDate < latestDate) {
                const warning = document.createElement("");
                warning.className = classes.warning;
                warning.innerText = "";
                uploadDates.append(warning);
            }
        } catch {
            const warning = document.createElement("");
            warning.className = classes.warning;
            warning.innerText = "";
            uploadDates.append(warning);
        }

        creditsPage.append(licenseMessage, codingCredits, creditLinks, uploadDates, copyrightTag);

        function getOrdinal(n) {
            if (n % 10 == 1 && n % 100 != 11) return "st";
            if (n % 10 == 2 && n % 100 != 12) return "nd";
            if (n % 10 == 3 && n % 100 != 13) return "rd";
            return "th";
        }

        function createCredit(contribution, html) {
            const listItem = document.createElement("li");
            const contributionText = document.createElement("strong");
            contributionText.innerText = contribution + ":";
            const right = document.createElement("span");
            right.innerHTML = html;
            listItem.append(contributionText, right);
            return listItem;
        }
        // --- Create Centered, Large Ping Display ---
        const pingDisplay = document.createElement("div");
        pingDisplay.id = "xguiPingDisplay";
        pingDisplay.style.cssText = `
    margin-top: 40px;
    text-align: center;
    font-size: 1.4em;
    font-weight: 700;
    color: var(--highlight);
    font-family: Nunito, sans-serif;
    width: 100%;
`;

        pingDisplay.innerText = "Server Ping: Calculating...";
        creditsPage.appendChild(pingDisplay);

        function updatePing() {
            const start = performance.now();
            const img = new Image();

            img.onload = () => {
                const latency = Math.round(performance.now() - start);
                pingDisplay.innerText = `Server Ping: ${latency} ms`;
            };

            img.onerror = () => {
                pingDisplay.innerText = "Server Ping: Offline";
            };

            img.src = "https://ac.blooket.com/dashclassic/favicon.ico?cb=" + Date.now();
        }

        updatePing();
        setInterval(updatePing, 5000);

        // ===== RESET GUI POSITION BUTTON =====
        if (!document.querySelector("#resetGuiBtn")) {
            const resetGuiBtn = document.createElement("button");
            resetGuiBtn.id = "resetGuiBtn";
            resetGuiBtn.textContent = "Reset GUI Position";

            Object.assign(resetGuiBtn.style, {
                display: "block", // makes centering easier
                margin: "10px auto 0 auto", // centers the button horizontally
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #8A2BE2, #4B0082)", // gradient for modern look
                color: "#fff",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)", // subtle shadow
                transition: "all 0.3s ease", // smooth hover effect
            });

            // Hover effect
            resetGuiBtn.onmouseenter = () => {
                resetGuiBtn.style.transform = "scale(1.05)";
                resetGuiBtn.style.boxShadow = "0 6px 14px rgba(0,0,0,0.3)";
            };
            resetGuiBtn.onmouseleave = () => {
                resetGuiBtn.style.transform = "scale(1)";
                resetGuiBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
            };

            resetGuiBtn.onclick = () => {
                // center GUI
                gui.style.left = (window.innerWidth / 2 - 400) + "px";
                gui.style.top = (window.innerHeight / 2 - 250) + "px";

                // un-minimize if needed
                if (minimizeControl?.minimized) {
                    minimizeControl.onclick();
                }

                // clear saved position
                document.cookie =
                    "xgui_state_v4=; path=/; domain=.blooket.com; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            };

            // place directly under ping display
            pingDisplay.parentElement.appendChild(resetGuiBtn);
        }




        const settingsPage = document.createElement("div");
        settingsPage.className = classes.noScroll + " " + classes.settingsPage;

        const searchResultSeparator = document.createElement("div");
        searchResultSeparator.onclick = () => path.push("Settings", settingsPage);
        searchResultSeparator.className = classes.searchResultSeparator;
        searchResultSeparator.innerText = "Settings";
        searchResultSeparator.dataset[datasets.name] = "settings";
        gamemodeResults.settings = searchResultSeparator;
        searchResults.append(searchResultSeparator);

        const settingRefresh = [];

        function addSetting(name, description, input, onUpdate) {
            const settingElement = document.createElement("div");

            const searchResult = document.createElement("div");
            searchResult.className = classes.searchResult;

            const searchResultInfo = document.createElement("div");
            searchResultInfo.className = classes.searchResultInfo;

            const searchResultName = document.createElement("div");
            searchResultName.className = classes.searchResultName;
            searchResult.dataset[datasets.name] = (searchResultName.innerText = name).toLowerCase();
            searchResult.dataset[datasets.mode] = "settings";
            const searchResultDescription = document.createElement("div");
            searchResultDescription.className = classes.searchResultDescription;
            searchResult.dataset[datasets.description] = (searchResultDescription.innerText = description).toLowerCase();

            searchResultInfo.append(searchResultName, searchResultDescription);

            searchResult.onclick = () => {
                path.push(name, settingsPage);
                settingElement.scrollIntoView();
                settingElement.animate(
                    [{
                            color: "var(--textColor)",
                            textShadow: "0 0 0px var(--highlight)",
                        },
                        {
                            color: "var(--highlight)",
                            textShadow: "0 0 5px var(--highlight)",
                            offset: 0.25,
                        },
                        {
                            color: "var(--textColor)",
                            textShadow: "0 0 0px var(--highlight)",
                        },
                    ],
                    1500
                );
            };

            searchResult.append(searchResultInfo);

            searchResults.append(searchResult);

            const settingTop = document.createElement("div");
            settingTop.className = classes.cheatTop;
            const settingInfo = document.createElement("div");
            settingInfo.className = classes.cheatInfo;
            const settingName = document.createElement("span");
            settingName.innerText = name;
            settingName.className = classes.cheatName;
            const settingDescription = document.createElement("span");
            settingDescription.innerText = description;
            settingDescription.className = classes.cheatDescription;
            settingInfo.append(settingName, settingDescription);
            settingElement.append(settingTop);



            const settingInputs = document.createElement("div");
            settingInputs.className = classes.cheatInputs;

            const inputElement = document.createElement("div");
            const inputName = document.createElement("span");
            inputName.innerText = input.name;
            inputElement.append(inputName);
            settingInputs.append(inputElement);

            let inputField = document.createElement("input");
            inputField.dataset[datasets.type] = input.type;
            if (input.type == "keybind") {
                inputField.readOnly = true;
                let locked = false;
                inputField.data = input.data;
                inputField.onclick = async () => {
                    if (locked) return;
                    inputField.value = "Waiting for input...";
                    locked = true;
                    inputField.data = await input.listen((e) => (inputField.value = e + "..."));
                    locked = false;
                    inputField.value = inputField.value.slice(0, -3);
                };
                (settingRefresh[settingRefresh.length] = () => (inputField.value = input.value()))();
            } else if (input.type == "options") {
                inputField = document.createElement("select");
                inputField.dataset[datasets.type] = "options";

                const defaultOption = document.createElement("option");
                defaultOption.value = "{}";
                defaultOption.innerHTML = "Select a Theme";
                (settingRefresh[settingRefresh.length] = () => (defaultOption.selected = true))();
                inputField.append(defaultOption);

                for (const choice of input.options) {
                    const option = document.createElement("option");
                    option.value = JSON.stringify(choice?.value ?? choice);
                    option.innerHTML = choice?.name || choice;
                    inputField.append(option);
                }
            } else if (input.type == "toggle") {
                // Handle toggle type - no input field needed, hide the inputs section
                inputField = null;
                settingInputs.style.display = "none";
            } else {
                if (input.type == "number") {
                    inputField.type = "number";
                    inputField.min = input.min;
                    inputField.max = input.max;
                }
                (settingRefresh[settingRefresh.length] = () => (inputField.value = input.value()))();
                inputField.placeholder = input.name;
            }
            if (inputField) {
                inputElement.append(inputField);
            }

            settingElement.append(settingInputs);

            settingTop.append(settingInfo);

            const runButton = document.createElement("div");
            runButton.className = classes.runCheat;
            if (input.type == "toggle") {
                runButton.classList.add(classes.toggleCheat);
                runButton.innerText = input.enabled ? "Toggle Off" : "Toggle On";
                runButton.classList.toggle(classes.active, input.enabled);
                runButton.style.width = "20%";
                runButton.style.margin = "10px auto";
                runButton.onclick = () => {
                    input.enabled = !input.enabled;
                    runButton.innerText = input.enabled ? "Toggle Off" : "Toggle On";
                    runButton.classList.toggle(classes.active, input.enabled);
                    onUpdate(input.enabled);
                };
                (settingRefresh[settingRefresh.length] = () => {
                    const currentEnabled = input.value();
                    input.enabled = currentEnabled;
                    runButton.innerText = currentEnabled ? "Toggle Off" : "Toggle On";
                    runButton.classList.toggle(classes.active, currentEnabled);
                })();
            } else {
                runButton.innerText = "Update";
                runButton.onclick = () =>
                    onUpdate(inputField.dataset[datasets.type] == "number" ? parseFloat("0" + inputField.value) : inputField.dataset[datasets.type] == "options" ? JSON.parse(inputField.value) : inputField.data ?? inputField.value);
            }
            settingTop.append(runButton);

            settingsPage.append(settingElement);
        }

        function setCookie(name, value, days = 365) {
            const expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${encodeURIComponent(value)}; domain=.blooket.com; expires=${expireDate.toUTCString()}; path=/`; 
        }


        settingsPage.onPath = () => settingRefresh.forEach((x) => x());


        addSetting(
            "Hide Keybind",
            "Shortcut to hide to GUI", {
                type: "keybind",
                name: "Shortcut",
                data: defaultHideKey,
                value: () => parseKeybind(Settings.data.hideKey),
                listen: (change) => createKeybindListener((keys) => change(parseKeybind(keys))),
            },
            (x) => {
                Settings.setItem("hideKey", x);
            }
        );
        addSetting(
            "Close Keybind",
            "Shortcut to disable all toggles and close GUI", {
                type: "keybind",
                name: "Shortcut",
                data: defaultCloseKey,
                value: () => parseKeybind(Settings.data.closeKey),
                listen: (change) => createKeybindListener((keys) => change(parseKeybind(keys))),
            },
            (x) => {
                Settings.setItem("closeKey", x);
            }
        );
        addSetting(
            "Toggle Animations",
            "Enable or disable smooth animations", {
                type: "toggle",
                name: "Animations",
                enabled: (() => {
                    const cookieValue = getCookie("animationsEnabled");
                    return cookieValue === null ? true : cookieValue === "true";
                })(),
                value: () => {
                    const cookieValue = getCookie("animationsEnabled");
                    return cookieValue === null ? true : cookieValue === "true";
                },
            },
            (enabled) => {
                setCookie("animationsEnabled", enabled.toString(), 365);
                window.xguiAnimationsEnabled = enabled;
            }
        );
        addSetting(
            "Toggle Sweet Alerts",
            "Toggles sweet alerts on and off", {
                type: "toggle",
                name: "Sweet Alerts",
                enabled: true,
                value: () => {
                    const cookieValue = getCookie("sweetAlertsEnabled");
                    return cookieValue === null ? true : cookieValue === "true";
                },
            },
            (enabled) => {
                setCookie("sweetAlertsEnabled", enabled.toString(), 365);
            }
        );
        addSetting(
            "Theme",
            "A preset look for X-GUI", {
                type: "options",
                name: "Preset",
                options: [{

                        name: "Cyber Blue",
                        value: {
                            highlight: "#00bfff",
                            highlight2: "#0077aa",
                            background: "radial-gradient(circle at top, #0f2027, #000000)",
                            background2: "#020b14",
                            toggleOn: "#00ffcc",
                            toggleOff: "#ff4d4d",
                            textColor: "#e6f7ff",
                            textColor2: "#00bfff",
                        },
                    },
                    {
                        name: "Inferno",
                        value: {
                            highlight: "#ff6a00",
                            highlight2: "#c0392b",
                            background: "linear-gradient(135deg, #2b0000, #7a1c00)",
                            background2: "#3a0f0f",
                            toggleOn: "#ff9f1a",
                            toggleOff: "#5c1a1a",
                            textColor: "#fff2e6",
                            textColor2: "#ff6a00",
                        },
                    },
                    {
                        name: "Emerald Night",
                        value: {
                            highlight: "#2ecc71",
                            highlight2: "#1e824c",
                            background: "linear-gradient(180deg, #051f14, #020b08)",
                            background2: "#03140c",
                            toggleOn: "#2ecc71",
                            toggleOff: "#8b1e1e",
                            textColor: "#eafff3",
                            textColor2: "#2ecc71",
                        },
                    },
                    {
                        name: "Midnight Purple",
                        value: {
                            highlight: "#8e44ad",
                            highlight2: "#5e3370",
                            background: "linear-gradient(160deg, #120018, #000000)",
                            background2: "#1a0022",
                            toggleOn: "#bb6bd9",
                            toggleOff: "#7a1a1a",
                            textColor: "#f5e6ff",
                            textColor2: "#bb6bd9",
                        },
                    },
                    {
                        name: "Frozen Ice",
                        value: {
                            highlight: "#7ed6df",
                            highlight2: "#22a6b3",
                            background: "linear-gradient(180deg, #e8f9ff, #b8ecff)",
                            background2: "#dff6ff",
                            toggleOn: "#22a6b3",
                            toggleOff: "#be2edd",
                            textColor: "#003344",
                            textColor2: "#22a6b3",
                        },
                    },
                    {
                        name: "Crimson Void",
                        value: {
                            highlight: "#e74c3c",
                            highlight2: "#96281b",
                            background: "radial-gradient(circle, #2b0000, #000000)",
                            background2: "#1a0000",
                            toggleOn: "#ff7675",
                            toggleOff: "#3d0000",
                            textColor: "#ffecec",
                            textColor2: "#e74c3c",
                        },
                    },
                    {
                        name: "Matrix",
                        value: {
                            highlight: "#00ff41",
                            highlight2: "#00aa2a",
                            background: "radial-gradient(circle, #003300, #000000)",
                            background2: "#001a00",
                            toggleOn: "#00ff41",
                            toggleOff: "#660000",
                            textColor: "#ccffcc",
                            textColor2: "#00ff41",
                        },
                    },
                    {
                        name: "Sunset Vapor",
                        value: {
                            highlight: "#ff77aa",
                            highlight2: "#ffb347",
                            background: "linear-gradient(135deg, #ff5f6d, #845ec2)",
                            background2: "#2a1a40",
                            toggleOn: "#ffb347",
                            toggleOff: "#5a1a1a",
                            textColor: "#fff0f7",
                            textColor2: "#ff77aa",
                        },
                    },
                    {

                        name: "Neon Purple",
                        value: {
                            highlight: "#9a49aa",
                            highlight2: "#7a039d",
                            background: "rgb(11, 194, 207)",
                            background2: "rgb(64, 17, 95)",
                            toggleOn: "#47A547",
                            toggleOff: "#A02626",
                            textColor: "white",
                            textColor2: "#9a49aa",
                        },
                    },
                    {
                        name: "Landscapes (Random)",
                        value: {
                            highlight: "rgba(0,0,0,0.3)",
                            highlight2: "rgba(0,0,0,0.3)",
                            background: "url(https://source.unsplash.com/1600x900/?landscape)",
                            background2: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))",
                            toggleOn: "linear-gradient(rgba(0,128,0,0.3), rgba(0,128,0,0.3))",
                            toggleOff: "linear-gradient(rgba(225,0,0,0.3), rgba(225,0,0,0.3))",
                            textColor: "white",
                            textColor2: "white",
                        },
                    },
                    {
                        name: "Blacket",
                        value: {
                            highlight: "#2f2f2f",
                            highlight2: "#3f3f3f",
                            background: "#4f4f4f",
                            background2: "#2f2f2f",
                            toggleOn: "#00c20c",
                            toggleOff: "#eb6234",
                            textColor: "white",
                            textColor2: "white",
                        },
                    },
                    {
                        name: "Ploopit",
                        value: {
                            highlight: "#204DD0",
                            highlight2: "#3C75F5",
                            background: "url(https://i.ibb.co/6vvdq3f/ploopit.png)",
                            background2: "#3C75F5",
                            toggleOn: "#47A547",
                            toggleOff: "#A02626",
                            textColor: "white",
                            textColor2: "#3C75F5",
                        },
                    },
                    {

                        name: "Midnight Bloom",
                        value: {
                            highlight: "#bb2d5b",
                            highlight2: "#682c44",
                            background: "linear-gradient(135deg, #1b1b2f, #2a2a45)",
                            background2: "#3e3e5c",
                            toggleOn: "#bb2d5b",
                            toggleOff: "#682c44",
                            textColor: "#e0e0e0",
                            textColor2: "#bb2d5b",
                        },
                    },
                    {
                        name: "Silver Horizon",
                        value: {
                            highlight: "#d1d1d1",
                            highlight2: "#b0b0b0",
                            background: "linear-gradient(135deg, #4e4e5d, #2f2f38)",
                            background2: "#3c3c44",
                            toggleOn: "#d1d1d1",
                            toggleOff: "#5a5a60",
                            textColor: "#ffffff",
                            textColor2: "#d1d1d1",
                        },
                    },
                    {
                        name: "Deep Ocean",
                        value: {
                            highlight: "#006994",
                            highlight2: "#003b57",
                            background: "linear-gradient(180deg, #003b57, #011c2a)",
                            background2: "#002433",
                            toggleOn: "#006994",
                            toggleOff: "#004d6a",
                            textColor: "#cce7ff",
                            textColor2: "#006994",
                        },
                    },
                    {
                        name: "Rustic Copper",
                        value: {
                            highlight: "#a65c5c",
                            highlight2: "#7b4b4b",
                            background: "linear-gradient(135deg, #e57c73, #7b4b4b)",
                            background2: "#9e6e6e",
                            toggleOn: "#a65c5c",
                            toggleOff: "#5e2f2f",
                            textColor: "#ffffff",
                            textColor2: "#a65c5c",
                        },
                    },
                    {
                        name: "Frostbite",
                        value: {
                            highlight: "#85c7e0",
                            highlight2: "#6d9db1",
                            background: "linear-gradient(135deg, #2a4d6f, #1f3e50)",
                            background2: "#3e5a70",
                            toggleOn: "#85c7e0",
                            toggleOff: "#3e5a70",
                            textColor: "#ffffff",
                            textColor2: "#85c7e0",
                        },
                    },
                    {
                        name: "Citrus Mist",
                        value: {
                            highlight: "#f6a500",
                            highlight2: "#f67f1e",
                            background: "linear-gradient(135deg, #f0a500, #ff6600)",
                            background2: "#d05f20",
                            toggleOn: "#f6a500",
                            toggleOff: "#a34317",
                            textColor: "#ffffff",
                            textColor2: "#f6a500",
                        },
                    },
                    {
                        name: "Mossy Forest",
                        value: {
                            highlight: "#728c5f",
                            highlight2: "#3d6c3d",
                            background: "linear-gradient(180deg, #3d6c3d, #2b4d2b)",
                            background2: "#4f7037",
                            toggleOn: "#728c5f",
                            toggleOff: "#4f7037",
                            textColor: "#ffffff",
                            textColor2: "#728c5f",
                        },
                    },
                    {
                        name: "Astral Journey",
                        value: {
                            highlight: "#a0a2d0",
                            highlight2: "#6b6c9f",
                            background: "linear-gradient(135deg, #2c3e5c, #1b2a3b)",
                            background2: "#3e4b72",
                            toggleOn: "#a0a2d0",
                            toggleOff: "#4d5176",
                            textColor: "#ffffff",
                            textColor2: "#a0a2d0",
                        },
                    },
                    {
                        name: "Crimson Ember",
                        value: {
                            highlight: "#ff4c4c",
                            highlight2: "#b73838",
                            background: "linear-gradient(135deg, #ff4c4c, #b73838)",
                            background2: "#8f3030",
                            toggleOn: "#ff4c4c",
                            toggleOff: "#8f3030",
                            textColor: "#ffffff",
                            textColor2: "#ff4c4c",
                        },
                    },
                    {
                        name: "Obsidian Wave",
                        value: {
                            highlight: "#4e5d6b",
                            highlight2: "#2c3e4f",
                            background: "linear-gradient(135deg, #2c3e4f, #1b2a35)",
                            background2: "#3e4b5a",
                            toggleOn: "#4e5d6b",
                            toggleOff: "#2c3e4f",
                            textColor: "#ffffff",
                            textColor2: "#4e5d6b",
                        },
                    },
                    {
                        name: "Twilight Ember",
                        value: {
                            highlight: "#ff7f50",
                            highlight2: "#f14d27",
                            background: "linear-gradient(135deg, #ff7f50, #f14d27)",
                            background2: "#d24020",
                            toggleOn: "#ff7f50",
                            toggleOff: "#d24020",
                            textColor: "#ffffff",
                            textColor2: "#ff7f50",
                        },
                    },
                    {
                        name: "Garnet Eclipse",
                        value: {
                            highlight: "#9b2d20",
                            highlight2: "#6b1f14",
                            background: "linear-gradient(135deg, #9b2d20, #6b1f14)",
                            background2: "#6f2923",
                            toggleOn: "#9b2d20",
                            toggleOff: "#6f2923",
                            textColor: "#ffffff",
                            textColor2: "#9b2d20",
                        },
                    },
                    {
                        name: "Sapphire Twilight",
                        value: {
                            highlight: "#0f4b73",
                            highlight2: "#006282",
                            background: "linear-gradient(135deg, #0f4b73, #006282)",
                            background2: "#003e5d",
                            toggleOn: "#0f4b73",
                            toggleOff: "#003e5d",
                            textColor: "#ffffff",
                            textColor2: "#0f4b73",
                        },
                    },
                    {
                        name: "Betastar",
                        value: {
                            highlight: "#282828",
                            highlight2: "gray",
                            background: "url(https://i.ibb.co/8bkDpCn/GIFMaker-me.gif)",
                            background2: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))",
                            toggleOn: "#013220",
                            toggleOff: "#9D0000",
                            textColor: "black",
                            textColor2: "black",
                        },
                    },
                    {
                        name: "Skool.lol",
                        value: {
                            highlight: "#36393e",
                            highlight2: "#1e2124",
                            background: "linear-gradient(90deg, rgba(104,45,140,1) 220px, rgba(237,30,121,1) 100%)",
                            background2: "#292929",
                            toggleOn: "#9c9a9a",
                            toggleOff: "#171717",
                            textColor: "white",
                            textColor2: "white",
                        },
                    },

                    {
                        name: "X-GUI ORIGINAL",
                        value: {
                            highlight: variables["--highlight"],
                            highlight2: variables["--highlight2"],
                            background: variables["--background"],
                            background2: variables["--background2"],
                            textColor: variables["--textColor"],
                            textColor2: variables["--textColor2"],
                            toggleOff: variables["--toggleOff"],
                            toggleOn: variables["--toggleOn"],
                        },
                    },
                    {
                        name: "Crypto Hack",
                        value: {
                            highlight: "rgb(88 175 88)",
                            toggleOn: "#0b601b",
                            background: "radial-gradient(#11581e,#041607)",
                            background2: "#1a1a1a",
                            toggleOff: "#A02626",
                            highlight2: "#49d149",
                            textColor2: "#49d149",
                        },
                    },
                    {
                        name: "Deceptive Dinos",
                        value: {
                            highlight: "#af8942",
                            toggleOn: "#2fb62f",
                            background: "radial-gradient(rgba(220, 184, 86, 0), rgba(220, 184, 86, 0.4)), url(https://ac.blooket.com/play/111cb7e0ee6607ac3d1a13d534c0e0f1.png), #ead49a",
                            background2: "radial-gradient(rgba(1,104,162,.6),rgba(24,55,110,.5)),radial-gradient(#2783b4 1.5px,#18376e 0) center / 24px 24px",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#FFFFFF",
                        },
                    },
                    {
                        name: "Blook Rush",
                        value: {
                            highlight: "#888",
                            toggleOn: "#47A547",
                            background: "repeating-linear-gradient(45deg,white,white 8%,#e6e6e6 0,#e6e6e6 16%)",
                            background2: "#36c",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#FFFFFF",
                        },
                    },
                    {
                        name: "Factory",
                        value: {
                            highlight: "#1563bf",
                            toggleOn: "rgb(75, 194, 46)",
                            background: "#3a3a3a",
                            background2: "#2d313d",
                            toggleOff: "#9a49aa",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#a5aabe",
                        },
                    },
                    {
                        name: "Cafe",
                        value: {
                            highlight: "#0bc2cf",
                            toggleOn: "#47A547",
                            background: "linear-gradient(90deg,rgba(200,0,0,.5) 50%,transparent 0) center / 50px 50px,linear-gradient(rgba(200,0,0,0.5) 50%,transparent 0) white center / 50px 50px",
                            background2: "rgb(64, 64, 64)",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#ac7339",
                            textColor: "#FFFFFF",
                        },
                    },
                    {
                        name: "Tower of Doom",
                        value: {
                            highlight: "#9a49aa",
                            toggleOn: "#4bc22e",
                            background: "rgb(41 41 41)",
                            background2: "#404040",
                            toggleOff: "rgb(151, 15, 5)",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#9a49aa",
                            textColor: "#FFFFFF",
                        },
                    },
                    {
                        name: "Monster Brawl",
                        value: {
                            highlight: "#2966a6",
                            toggleOn: "#47A547",
                            background: "rgb(45, 51, 67)",
                            background2: "#374154",
                            toggleOff: "#A02626",
                            highlight2: "#264d99",
                            textColor2: "#264d99",
                            textColor: "#FFFFFF",
                        },
                    },
                    {
                        name: "Tower Defense 2",
                        value: {
                            highlight: "#40b1d8",
                            toggleOn: "#47A547",
                            background: "url(https://media.blooket.com/image/upload/v1676164454/Media/defense/backgroundTd1-02.svg) center / cover",
                            background2: "#293c82",
                            toggleOff: "#A02626",
                            highlight2: "rgb(0 0 0 / 25%)",
                            textColor2: "#a33c22",
                            textColor: "#FFFFFF",
                        },
                    },
                ],
            },
            (x) => {
                Settings.setItem("theme", {
                    ...Settings.data.theme,
                    ...x
                });
                for (const prop in x) gui.style.setProperty(`--${prop}`, x[prop]);
                path.updatePath();
            }
        );
        addSetting("Highlight 1", "Hover color, sub-text color, button color, and input outlines", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--highlight")
            }, (x) =>
            gui.style.setProperty("--highlight", Settings.setItem("theme.highlight", x || variables["--highlight"]))
        );
        addSetting("Highlight 2", "Credits page's warning message color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--highlight2")
            }, (x) =>
            gui.style.setProperty("--highlight2", Settings.setItem("theme.highlight2", x || variables["--highlight2"]))
        );
        addSetting("Background", "Main GUI background color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--background")
            }, (x) =>
            gui.style.setProperty("--background", Settings.setItem("theme.background", x || variables["--background"]))
        );
        addSetting("Background 2", "Secondary GUI background color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--background2")
            }, (x) =>
            gui.style.setProperty("--background2", Settings.setItem("theme.background2", x || variables["--background2"]))
        );
        addSetting("Text Color", "Main text color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--textColor")
            }, (x) =>
            gui.style.setProperty("--textColor", Settings.setItem("theme.textColor", x || variables["--textColor"]))
        );
        addSetting("Text Color 2", "Credit page's contributor color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--textColor2")
            }, (x) =>
            gui.style.setProperty("--textColor2", Settings.setItem("theme.textColor2", x || variables["--textColor2"]))
        );
        addSetting("Toggle (On)", "Enabled toggle button color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--toggleOn")
            }, (x) =>
            gui.style.setProperty("--toggleOn", Settings.setItem("theme.toggleOn", x || variables["--toggleOn"]))
        );
        addSetting("Toggle (Off)", "Disabled toggle button color", {
                type: "string",
                name: "CSS Value",
                value: () => gui.style.getPropertyValue("--toggleOff")
            }, (x) =>
            gui.style.setProperty("--toggleOff", Settings.setItem("theme.toggleOff", x || variables["--toggleOff"]))
        );

        const sidebarPaths = document.createElement("div");
        sidebarPaths.className = classes.sidebarPaths;

        function createSidebarPath(name, iconKey, page) {
            const sidebarPath = document.createElement("div");
            sidebarPath.className = classes.sidebarPath;

            // Clean and consistent spacing
            sidebarPath.style.display = "flex";
            sidebarPath.style.alignItems = "center";
            sidebarPath.style.gap = "12px";
            sidebarPath.style.cursor = "pointer";

            // Icon wrapper — matches your original 50×50 FA container
            const iconWrapper = document.createElement("div");
            iconWrapper.style.width = "50px";
            iconWrapper.style.height = "50px";
            iconWrapper.style.display = "flex";
            iconWrapper.style.alignItems = "center";
            iconWrapper.style.justifyContent = "center";
            iconWrapper.style.flexShrink = "0";
            iconWrapper.style.fontSize = "1.5em"; // 1.5em scaling matches FA behavior

            // --- CSP-SAFE SVG ICON SET (OUTLINE STYLE) ---
            const svgMap = {
                search: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21"/>
      </svg>`,

                gamepad: `
    <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" width="1em" height="1em"
       fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19.07 1.29l-1.41 1.41 1.11 1.11-2.22 2.22-3.84-3.84-1.41 1.42 1.11 1.11L2.2 14.93l6.14 6.14 10.21-10.2 1.11 1.11 1.41-1.41-3.84-3.84 2.22-2.22 1.11 1.11 1.41-1.41-2.83-2.83z"/>
    <line x1="1.29" y1="21.29" x2="4.22" y2="18.36"/>
    <line x1="7.66" y1="16.34" x2="5.64" y2="14.32"/>
    <line x1="9.48" y1="14.52" x2="7.05" y2="12.09"/>
    <line x1="11.29" y1="12.71" x2="9.88" y2="11.29"/>
    <line x1="13.11" y1="10.89" x2="11.7" y2="9.48"/>
  </svg>
`,

                star: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.2 6.7L22 9.3l-5 4.3L18.4 22 12 18.3 5.6 22 7 13.6 2 9.3l6.8-.6L12 2z"/>
      </svg>`,

                trophy: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 21h8M8 17v4M16 17v4"/>
        <path d="M7 3h10v4a5 5 0 01-10 0V3z"/>
      </svg>`,
                alt: `
    <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" width="1em" height="1em"
       fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="5.8" cy="16.32" r="2.39"/>
    <path d="M1.5,23.48V23a4.3,4.3,0,0,1,4.3-4.3h0A4.3,4.3,0,0,1,10.09,23v.48"/>
    <circle cx="18.2" cy="3.91" r="2.39"/>
    <path d="M13.91,11.07v-.48A4.29,4.29,0,0,1,18.2,6.3h0a4.29,4.29,0,0,1,4.3,4.29v.48"/>
    <polyline points="15.7 15.72 18.68 12.75 21.66 15.72"/>
    <path d="M18.68,13v2.86A5.73,5.73,0,0,1,13,21.57h0"/>
    <polyline points="8.3 8.32 5.32 11.3 2.34 8.32"/>
    <path d="M5.32,11.07V8.2a5.72,5.72,0,0,1,5.73-5.72h0"/>
  </svg>
`,
                client: `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="1em" height="1em"
     fill="none"
     stroke="currentColor"
     stroke-width="1.8"
     stroke-linecap="round"
     stroke-linejoin="round">

  <!-- wrench head -->
  <path d="M14.5 3a4.5 4.5 0 00-3.8 6.8l-7.3 7.3a2 2 0 102.8 2.8l7.3-7.3A4.5 4.5 0 0019.5 7l-3 3-4-4 3-3z"/>

</svg>
`,



                editor: `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="1em" height="1em"
     fill="none"
     stroke="currentColor"
     stroke-width="1.8"
     stroke-linecap="round"
     stroke-linejoin="round">

  <!-- Box -->
  <rect x="3" y="3" width="18" height="18" rx="4" ry="4"/>

  <!-- Eyes -->
  <circle cx="8" cy="10" r="1.2"/>
  <circle cx="16" cy="10" r="1.2"/>

  <!-- Smile -->
  <path d="M7 15c1.5 1.5 4.5 1.5 6 0"/>
</svg>
`,




                terminal: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>`,

                // === NEW PERFECT OUTLINE COG ===
                cog: `
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" width="1em" height="1em"
       fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"/>
  </svg>
`,

                mobile: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2"></rect>
        <circle cx="12" cy="18" r="1" fill="currentColor"></circle>
      </svg>`,

                info: `
       <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" width="1em" height="1em"
       fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <line x1="12" y1="11" x2="12" y2="17"/>
    <circle cx="12" cy="8" r="0.5" fill="currentColor"/>
  </svg>`,

                // === NEW CHANGELOG SVG ===
                changelog: `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="1em" height="1em"
           viewBox="0 0 24 24"
           fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="14" height="18" rx="2"/>
        <path d="M7 7h6M7 11h6M7 15h4"/>
        <polyline points="17 3 21 3 21 7"/>
        <line x1="21" y1="3" x2="17" y2="7"/>
      </svg>
    `,

                default: `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" width="1em" height="1em"
           fill="currentColor">
        <circle cx="12" cy="12" r="8"/>
      </svg>`,
      module: `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 16 16"
     width="1em" height="1em"
     fill="currentColor"
     preserveAspectRatio="xMidYMid meet">
  <path d="M8.01005 0.858582L6.01005 14.8586L7.98995 15.1414L9.98995 1.14142L8.01005 0.858582Z"></path>
  <path d="M12.5 11.5L11.0858 10.0858L13.1716 8L11.0858 5.91422L12.5 4.5L16 8L12.5 11.5Z"></path>
  <path d="M2.82843 8L4.91421 10.0858L3.5 11.5L0 8L3.5 4.5L4.91421 5.91422L2.82843 8Z"></path>
</svg>
`
            };

            iconWrapper.innerHTML = svgMap[iconKey] || svgMap.default;

            const svg = iconWrapper.querySelector("svg");
            if (svg) {
                svg.style.display = "block";
            }

            const label = document.createElement("span");
            label.innerText = name;

            sidebarPath.append(iconWrapper, label);

            sidebarPath.onclick = () => path.sidebar(name, page);

            sidebarPaths.append(sidebarPath);

            return sidebarPath;
        }


        createSidebarPath("Search", "search", searchPage);
        createSidebarPath("Gamemodes", "gamepad", gamemodesPage);
        createSidebarPath("Favorites", "star", favoritesPage);

        // Hidden leaderboard entry stays exactly as you had it
        (leaderboardPath = createSidebarPath("Leaderboard", "trophy", leaderboardPage)).style.display = "none";

        createSidebarPath("Logs", "terminal", logsPage);
        createSidebarPath("Alt Manager", "alt", altPage);
        createSidebarPath("Blook Editor", "editor", blookPage);
        createSidebarPath("Client Blooks", "client", clientPage);
        createSidebarPath("Custom Modules", "module", modulePage);
        createSidebarPath("Changelog", "changelog", changelogPage);
        createSidebarPath("Settings", "cog", settingsPage);
        createSidebarPath("Info/Credits", "info", creditsPage);




        sidebar.append(sidebarPaths);

        const bigTextContainer = document.createElement("div");
        bigTextContainer.className = classes.bigTextContainer;


        const dummyK = document.createElement("span");
        dummyK.innerText = "X";
        dummyK.style.opacity = "0";

        const bigText = document.createElement("span");
        bigText.className = classes.bigText;
        bigText.innerText = "-GUI";

        const logo = document.createElement("span");
        logo.className = classes.logo;
        logo.innerHTML = "X";

        bigTextContainer.append(logo, dummyK, bigText);

        sidebar.prepend(bigTextContainer);

        const refreshControl = document.createElement("div");
        refreshControl.className = classes.refreshControl;
        refreshControl.innerHTML = `
<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"
     xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"/>
</svg>
`;
        refreshControl.onclick = () => {
            refreshControl.animate(
                [{
                    transform: "rotate(0deg)"
                }, {
                    transform: "rotate(360deg)"
                }], {
                    duration: 600,
                    easing: "ease"
                }
            );
            path.updatePath();
        };

        gui.append(controls, guiTopBar, sidebar, guiContent, pathText, refreshControl);
        path.updatePath();
        document.body.appendChild(gui);

        // CSP Detection Function
        function detectCSP() {
            let cspDetected = false;

            // Method 1: Try to execute inline script
            try {
                const testScript = document.createElement('script');
                testScript.textContent = 'window.__cspTestPassed = true;';
                document.head.appendChild(testScript);
                document.head.removeChild(testScript);

                if (!window.__cspTestPassed) {
                    cspDetected = true;
                }
                delete window.__cspTestPassed;
            } catch (e) {
                cspDetected = true;
            }

            // Method 2: Check for CSP meta tags
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta && cspMeta.content.includes('script-src')) {
                cspDetected = true;
            }

            return cspDetected;
        }

        // Function to create CSP overlay (similar to blur notice)
        function createCSPOverlay(targetPage) {
            // Check if overlay already exists
            if (targetPage.querySelector && targetPage.querySelector('.xgui-csp-notice')) return;

            // Apply blur to background content
            try {
                if (targetPage && targetPage.style) {
                    let blurTarget = targetPage.querySelector && targetPage.querySelector('.xgui-blur-target');
                    if (!blurTarget) {
                        blurTarget = document.createElement('div');
                        blurTarget.className = 'xgui-blur-target';
                        while (targetPage.firstChild) {
                            blurTarget.appendChild(targetPage.firstChild);
                        }
                        targetPage.appendChild(blurTarget);
                    }
                    blurTarget.style.filter = 'blur(8px)';
                    blurTarget.style.pointerEvents = 'none';
                }
            } catch (e) {}

            // Create notice overlay
            const notice = document.createElement("div");
            notice.className = 'xgui-csp-notice';
            try { 
                if (!targetPage.style.position || targetPage.style.position === 'static') targetPage.style.position = 'relative';
                // Allow content to extend beyond the targetPage bounds
                targetPage.style.overflow = 'visible';
            } catch (e) {}
            notice.style.cssText = `
                position: absolute;
                inset: 0;
                display: flex !important;
                align-items: flex-start !important;
                justify-content: center !important;
                z-index: 2000;
                pointer-events: auto;
                text-align: center;
                background: transparent;
                padding: 20px;
                overflow: visible !important;
            `;

            const content = document.createElement('div');
            content.className = 'xgui-csp-notice-content';
            content.style.cssText = `
                box-sizing: border-box !important;
                display: block !important;
                max-width: 380px !important;
                width: 100% !important;
                padding: 40px 35px !important;
                border-radius: 20px !important;
                backdrop-filter: blur(24px) saturate(180%) !important;
                -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
                background: linear-gradient(145deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.1)) !important;
                border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
                box-shadow:
                    0 10px 40px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                    0 25px 70px rgba(138, 43, 226, 0.2) !important;
                text-align: center !important;
                margin-top: -40px !important;
            `;

            const iconWrapper = document.createElement("div");
            iconWrapper.innerHTML = `
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            iconWrapper.style.cssText = `
                display: block !important;
                color: #FFFFFF !important;
                margin: 0 auto 20px auto !important;
                padding: 0 !important;
                line-height: 1 !important;
                filter: drop-shadow(0 4px 16px rgba(255, 255, 255, 0.3)) !important;
            `;

            const noticeTitle = document.createElement("div");
            noticeTitle.textContent = "CSP Detected";
            noticeTitle.style.cssText = `
                display: block !important;
                color: #FFFFFF !important;
                font-size: 32px !important;
                font-weight: 800 !important;
                line-height: 1.1 !important;
                margin: 0 0 16px 0 !important;
                padding: 0 !important;
                text-align: center !important;
                letter-spacing: -0.5px !important;
                text-shadow: 0 2px 20px rgba(138, 43, 226, 0.6) !important;
            `;

            const noticeText = document.createElement("div");
            noticeText.innerHTML = "This is not supported on your version. Please use the extension version or get the CSP unblock extension.";
            noticeText.style.cssText = `
                display: block !important;
                color: #FFFFFF !important;
                font-size: 15px !important;
                margin: 0 0 30px 0 !important;
                padding: 0 !important;
                text-align: center !important;
                line-height: 1.6 !important;
                font-weight: 400 !important;
            `;

            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = `
                display: flex !important;
                flex-direction: column !important;
                gap: 12px !important;
            `;

            const extensionButton = document.createElement("a");
            extensionButton.href = "https://github.com/xgui-client/X-GUI-BLOOKET-CLIENT/raw/refs/heads/main/extension/x-gui-extension.zip";
            extensionButton.target = "_blank";
            extensionButton.textContent = "Get Extension";
            extensionButton.style.cssText = `
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: linear-gradient(135deg, #5865F2, #4752C4) !important;
                color: #FFFFFF !important;
                border: none !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                padding: 14px 32px !important;
                border-radius: 12px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 6px 20px rgba(88, 101, 242, 0.4) !important;
                margin: 0 !important;
                letter-spacing: 0.3px !important;
                text-decoration: none !important;
            `;

            extensionButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 10px 30px rgba(88, 101, 242, 0.6)';
            });

            extensionButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 6px 20px rgba(88, 101, 242, 0.4)';
            });

            buttonContainer.appendChild(extensionButton);

            content.appendChild(iconWrapper);
            content.appendChild(noticeTitle);
            content.appendChild(noticeText);
            content.appendChild(buttonContainer);

            notice.append(content);
            try { targetPage.append(notice); } catch (e) { document.body.append(notice); }
        }

        // Add the CSP overlay if it detects CSP and Logs it
        if (detectCSP()) {
            Logs.addLog("CSP Detected - Custom modules disabled", "red");

            createCSPOverlay(modulePage);
        }

        Logs.addLog("Opened X-GUI!");
        /* Anti-Suspend By CryptoDude3 */
        if (window.fetch.call.toString() == "function call() { [native code] }") {
            const call = window.fetch.call;
            window.fetch.call = function() {
                if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
                Logs.addLog("Blocked Suspension API!", "red");
            };
            Logs.addLog("Enabled Anti-BAN!");
        }

        if (gui.querySelector("i").clientHeight == 0) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://ka-f.fontawesome.com/releases/v6.5.1/css/pro.min.css";
            gui.prepend(link);
        }

        function randString(length) {
            return Array.from({
                length
            }, () => String.fromCharCode(Math.floor(Math.random() * 25) + 97)).reduce((a) => a + String.fromCharCode(Math.floor(Math.random() * 25) + 97), "");
        }

        function dragElement(element, parent) {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            element.onpointerdown = function(e = window.event) {
                element.style.cursor = "grabbing";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onpointerup = function() {
                    element.style.cursor = "grab";
                    document.onpointerup = null;
                    document.onpointermove = null;
                };
                document.onpointermove = function(e = window.event) {
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    parent.style.top = parent.offsetTop - pos2 + "px";
                    parent.style.left = parent.offsetLeft - pos1 + "px";
                };
            };
        }

        const keys = ["shift", "control", "alt", "meta"];

        function createKeybindListener(onpress, element = window) {
            return new Promise((resolve) => {
                const pressed = new Set();
                let shift, ctrl, alt, key;
                const keydown = (e) => {
                    e.preventDefault();
                    pressed.add(e.code);
                    shift ||= e.shiftKey;
                    ctrl ||= e.ctrlKey;
                    alt ||= e.altKey;
                    if (!keys.includes(e.key.toLowerCase())) key = e.key.toLowerCase();
                    onpress?.({
                        shift,
                        ctrl,
                        alt,
                        key
                    });
                };
                const keyup = (e) => {
                    pressed.delete(e.code);
                    if (pressed.size > 0) return;
                    element.removeEventListener("keydown", keydown);
                    element.removeEventListener("keyup", keyup);
                    resolve({
                        shift,
                        ctrl,
                        alt,
                        key
                    });
                };
                element.addEventListener("keydown", keydown);
                element.addEventListener("keyup", keyup);
            });
        }

        function parseKeybind({
            shift,
            ctrl,
            alt,
            key
        }) {
            return [ctrl && "Ctrl", shift && "Shift", alt && "Alt", key && key.toUpperCase()].filter(Boolean).join(" + ");
        }

        function compareKeybind(keybind, event) {
            return keybind.ctrl == event.ctrlKey && keybind.shift == event.shiftKey && keybind.alt == event.altKey && event.key.toLowerCase() == keybind.key;
        }

        function keydown(e) {
            if (compareKeybind(Settings.data.hideKey ?? defaultHideKey, e)) {
                e.preventDefault();
                const isHiding = gui.style.display === "block";

                if (window.xguiAnimationsEnabled) {
                    const animationDuration = 0.1;
                    if (isHiding) {
                        gui.style.animation = `guiFadeOut ${animationDuration}s ease-out`;
                        setTimeout(() => {
                            gui.style.display = "none";
                            gui.style.animation = ""; 
                        }, animationDuration * 1000);
                    } else {
                        gui.style.display = "block";
                        gui.style.animation = `guiFadeIn ${animationDuration}s ease-out`;
                        setTimeout(() => {
                            gui.style.animation = "";
                        }, animationDuration * 0.1);
                    }
                } else {
                    gui.style.animation = "none";
                    gui.style.display = isHiding ? "none" : "block";
                }
                return;
            }
            if (compareKeybind(Settings.data.closeKey ?? defaultCloseKey, e)) {
                e.preventDefault();
                close();
            }
        }

        function close() {
            const animationsEnabled = getCookieValue("animationsEnabled");
            
            if (animationsEnabled) {
                const animationDuration = 0.3; 
                gui.style.animation = `guiFadeOut ${animationDuration}s ease-out forwards`;
                gui.style.pointerEvents = 'none'; 
                setTimeout(() => {
                    gui.remove();
                    clearInterval(Logs.interval);
                    for (const category in cheats)
                        for (const cheat of cheats[category].cheats)
                            if (cheat.enabled) cheat.run();
                    window.removeEventListener("keydown", keydown);
                }, animationDuration * 1000);
            } else {
                gui.remove();
                clearInterval(Logs.interval);
                for (const category in cheats)
                    for (const cheat of cheats[category].cheats)
                        if (cheat.enabled) cheat.run();
                window.removeEventListener("keydown", keydown);
            }
        }

        function getStateNode() {
            return Object.values(
                (function react(r = document.querySelector("body>div")) {
                    return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div"));
                })()
            )[1].children[0]._owner.stateNode;
        }


        window.addEventListener("keydown", keydown);

    });
    let img = new Image;
    img.src = "https://cdn.jsdelivr.net/gh/Blooket-Council/Blooket-Cheats@main/autoupdate/timestamps/KGui.png?" + Date.now();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, this.width, this.height);
        let {
            data
        } = ctx.getImageData(0, 0, this.width, this.height), decode = "", last;
        let i = 0;
        while (i < data.length) {
            let char = String.fromCharCode(data[i % 4 == 3 ? (i++, i++) : i++] + data[i % 4 == 3 ? (i++, i++) : i++] * 256);
            decode += char;
            if (char == "/" && last == "*") break;
            last = char;
        }
        let _, time = timeProcessed,
            error = "There was an error checking for script updates. Run cheat anyway?";
        try {
            [_, time, error] = decode.match(/LastUpdated: (.+?); ErrorMessage: "((.|\n)+?)"/);
        } catch (e) {}
        if ((latestProcess = parseInt(time)) <= timeProcessed || iframe.contentWindow.confirm(error)) cheat();
    }
    img.onerror = img.onabort = () => {
        img.onerror = img.onabort = null;
        cheat();
        let iframe = document.querySelector("iframe");


    }
})();
