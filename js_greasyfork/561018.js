// ==UserScript==
// @name         MineFun Combined Script Astolfo.wtf and MineFun King 零式 and MineFunreg
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combined script of Astolfo.wtf and MineFun King 零式 and MineFunreg
// @match        *://minefun.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561018/MineFun%20Combined%20Script%20Astolfowtf%20and%20MineFun%20King%20%E9%9B%B6%E5%BC%8F%20and%20MineFunreg.user.js
// @updateURL https://update.greasyfork.org/scripts/561018/MineFun%20Combined%20Script%20Astolfowtf%20and%20MineFun%20King%20%E9%9B%B6%E5%BC%8F%20and%20MineFunreg.meta.js
// ==/UserScript==

(()=>{"use strict";var __webpack_modules__={679:(e,t,n)=>{n.d(t,{A:()=>r});var o=n(601),s=n.n(o),i=n(314),a=n.n(i)()(s());a.push([e.id,`@font-face {
    font-family: "Product Sans";
    src: url(https://fonts.gstatic.com/s/productsans/v19/pxiDypQkot1TnFhsFMOfGShVF9eO.woff2);
}

:root {
    --Minebuns-accent-color: linear-gradient(135deg, rgb(255, 105, 180) 0%, rgb(255, 182, 193) 50%, rgb(255, 105, 180) 100%);
    --button-color: rgba(30, 30, 30, 0.95);
    --hover-color: rgba(50, 50, 50, 0.95);
    --panel-bg: rgba(20, 20, 20, 0.92);
    --text-color: #ffffff;
    --header-text-size: 22px;
    --button-text-size: 16px;
    --setting-text-size: 14px;
    --border-radius: 12px;
    --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.gui-panel {
    position: fixed;
    z-index: 1000;
    width: 280px;
    border-radius: var(--border-radius);
    background: var(--panel-bg);
    box-shadow: var(--shadow);
    font-family: 'Product Sans', sans-serif;
    color: var(--text-color);
    overflow: hidden;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.gui-header {
    background: var(--Minebuns-accent-color);
    height: 50px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--header-text-size);
    cursor: grab;
    position: relative;
    overflow: hidden;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.gui-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
}

.gui-header:hover::before {
    left: 100%;
}

.gui-header:active {
    cursor: grabbing;
}

.gui-button {
    height: 45px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: var(--button-text-size);
    font-weight: 500;
    outline: none;
    background: var(--button-color);
    color: var(--text-color);
    margin: 4px 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
}

.gui-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
}

.gui-button:hover::before {
    left: 100%;
}

.gui-button.enabled {
    background: var(--Minebuns-accent-color);
    box-shadow: 0 4px 16px rgba(255, 105, 180, 0.3);
    transform: translateY(-1px);
}

.gui-button:not(.enabled):hover {
    background: var(--hover-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.gui-background {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(25px);
    background: rgba(0, 0, 0, 0.4);
}

.gui-setting-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(30, 30, 30, 0.6);
    padding: 8px 12px;
    margin: 2px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.gui-setting-label {
    font-size: var(--setting-text-size);
    font-weight: 400;
    color: var(--text-color);
    flex: 1;
}

.gui-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: var(--button-color);
    position: relative;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.gui-checkbox.enabled {
    background: var(--Minebuns-accent-color);
    box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
}

.gui-checkbox.enabled::after {
    content: '✓';
    color: white;
    font-size: 14px;
    font-weight: bold;
}

.gui-color-picker {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
}

.gui-color-input {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.gui-button-container {
    background: transparent;
    display: flex;
    flex-direction: column;
    padding: 8px 0;
}

.gui-text-input {
    background: var(--button-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    font-family: 'Product Sans', sans-serif;
    font-size: var(--setting-text-size);
    width: 60px;
    border-radius: 6px;
    outline: none;
    transition: all 0.3s;
    text-align: center;
    padding: 4px 8px;
}

.gui-text-input:hover {
    background: var(--hover-color);
    border-color: rgba(255, 255, 255, 0.2);
}

.gui-text-input:focus {
    background: var(--hover-color);
    border-color: var(--Minebuns-accent-color);
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
}

.with-animations .gui-panel {
    animation: fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.with-animations .gui-background {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.with-animations .gui-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.with-animations .gui-button:hover {
    transform: translateY(-2px);
}

.with-animations .gui-setting-container {
    will-change: transform, opacity;
    transform-origin: top;
    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.gui-category-tag {
    background: var(--Minebuns-accent-color);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    margin-left: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
`,""]);const r=a},314:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",o=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),o&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),o&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,o,s,i){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(o)for(var r=0;r<this.length;r++){var l=this[r][0];null!=l&&(a[l]=!0)}for(var d=0;d<e.length;d++){var c=[].concat(e[d]);o&&a[c[0]]||(void 0!==i&&(void 0===c[5]||(c[1]="@layer".concat(c[5].length>0?" ".concat(c[5]):""," {").concat(c[1],"}")),c[5]=i),n&&(c[2]?(c[1]="@media ".concat(c[2]," {").concat(c[1],"}"),c[2]=n):c[2]=n),s&&(c[4]?(c[1]="@supports (".concat(c[4],") {").concat(c[1],"}"),c[4]=s):c[4]="".concat(s)),t.push(c))}},t}},601:e=>{e.exports=function(e){return e[1]}},72:e=>{var t=[];function n(e){for(var n=-1,o=0;o<t.length;o++)if(t[o].identifier===e){n=o;break}return n}function o(e,o){for(var i={},a=[],r=0;r<e.length;r++){var l=e[r],d=o.base?l[0]+o.base:l[0],c=i[d]||0,u="".concat(d," ").concat(c);i[d]=c+1;var p=n(u),h={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==p)t[p].references++,t[p].updater(h);else{var m=s(h,o);o.byIndex=r,t.splice(r,0,{identifier:u,updater:m,references:1})}a.push(u)}return a}function s(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,s){var i=o(e=e||[],s=s||{});return function(e){e=e||[];for(var a=0;a<i.length;a++){var r=n(i[a]);t[r].references--}for(var l=o(e,s),d=0;d<i.length;d++){var c=n(i[d]);0===t[c].references&&(t[c].updater(),t.splice(c,1))}i=l}}},659:e=>{var t={};e.exports=function(e,n){var o=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(n)}},540:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},56:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},825:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var o="";n.supports&&(o+="@supports (".concat(n.supports,") {")),n.media&&(o+="@media ".concat(n.media," {"));var s=void 0!==n.layer;s&&(o+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),o+=n.css,s&&(o+="}"),n.media&&(o+="}"),n.supports&&(o+="}");var i=n.sourceMap;i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),t.styleTagTransform(o,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},113:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},548:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={init:async function(){let safeImport=src=>eval(`(async () => { return await import("${src}")})()`),preloadedModules=Array.from(document.querySelectorAll('link[rel="modulepreload"]')).map((e=>e.href));preloadedModules.push(Object.values(document.scripts).find((e=>e?.src?.includes(location.origin))).src);let importedModules=await Promise.all(preloadedModules.map((e=>safeImport(e)))),allModuleExports=importedModules.flatMap((e=>Object.values(e)));this.stores=Object.values(allModuleExports).filter((e=>e?.$id)).reduce(((e,t)=>(e[t.$id]=t(),e)),{}),this.network=Object.values(allModuleExports).find((e=>e?.service))},get gameWorld(){return this?.stores?.gameState?.gameWorld||null}}}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={id:e,exports:{}};return __webpack_modules__[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.nc=void 0;var __webpack_exports__={};const events={listeners:{},activeKeys:new Set,on:function(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)},remove:function(e,t){this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter((e=>e!==t)))},emit:function(e,t){this.listeners[e]&&this.listeners[e].forEach((e=>e(t)))},trackKey:function(e,t,n){"keydown"===e&&moduleManager.handleKeyPress(n),"keydown"!==e||this.activeKeys.has(t)||(this.activeKeys.add(t),this.emit("keyPress",{key:t,code:n})),"keyup"===e&&this.activeKeys.has(t)&&(this.activeKeys.delete(t),this.emit("keyRelease",{key:t,code:n}))}};class Module{constructor(e,t,n,o){this.name=e,this.category=t,this.options=n,this.keybind=o,this.waitingForBind=!1,this.isEnabled=!1,this.toggle=this.toggle.bind(this)}onEnable(){}onDisable(){}onRender(){}onSettingUpdate(){}enable(){this.isEnabled=!0,events.emit("module.update",this),this.onEnable()}disable(){this.isEnabled=!1,events.emit("module.update",this),this.onDisable()}toggle(){this.isEnabled?this.disable():this.enable()}}class ArrayList extends Module{constructor(){super("Arraylist","Visual"),this.namesMap={},this.arraylistContainer=null,this.initialized=!1}update(e,t){if(t){if(!this.namesMap[e]){let t=document.createElement("div");t.style.backgroundColor="rgba(10, 10, 10, 0.7)",t.style.color="white",t.style.padding="2px 10px 2px 10px",t.style.display="flex",t.style.alignItems="center",t.style.boxSizing="border-box",t.style.margin="0",t.style.fontFamily="'Product Sans', sans-serif",t.style.boxShadow="rgb(0, 0, 0, 0.05) -5px 1px",t.style.transition="max-height 0.2s ease-in-out, opacity 0.2s ease-in-out",t.style.overflow="hidden",t.style.maxHeight="0",t.style.opacity="0";let n=document.createElement("span");n.style.fontWeight="800",n.style.fontSize="16px",n.style.backgroundImage="linear-gradient(135deg, rgb(255, 105, 180) 0%, rgb(255, 182, 193) 50%, rgb(255, 105, 180) 100%)",n.style.color="transparent",n.style.backgroundClip="text",n.innerHTML=e,t.appendChild(n),this.arraylistContainer.appendChild(t),setTimeout((()=>{t.style.maxHeight="50px",t.style.opacity="1"}),1),this.namesMap[e]=t}}else if(this.namesMap[e]){const t=this.namesMap[e];t.style.maxHeight="0",t.style.opacity="0",setTimeout((()=>{this.arraylistContainer.removeChild(t),delete this.namesMap[e]}),5)}const n=Object.values(this.namesMap).sort(((e,t)=>this.measureElementWidth(t)-this.measureElementWidth(e)));this.arraylistContainer.innerHTML="",n.forEach((e=>{this.arraylistContainer.appendChild(e)}))}onEnable(){this.initialized?this.arraylistContainer.style.opacity="1":(this.arraylistContainer=document.createElement("div"),this.arraylistContainer.style.flexDirection="column",this.arraylistContainer.style.position="absolute",this.arraylistContainer.style.zIndex="1000",this.arraylistContainer.style.display="flex",this.arraylistContainer.style.right="5px",this.arraylistContainer.style.top="5px",this.arraylistContainer.style.alignItems="flex-end",this.arraylistContainer.style.pointerEvents="none",this.arraylistContainer.style.textTransform="lowercase",this.arraylistContainer.style.border="2px solid transparent",this.arraylistContainer.style.borderImage="linear-gradient(135deg, rgb(255, 105, 180) 0%, rgb(255, 182, 193) 50%, rgb(255, 105, 180) 100%)",this.arraylistContainer.style.borderImageSlice="1",this.arraylistContainer.style.borderBottom="0",this.arraylistContainer.style.borderLeft="0",document.body.appendChild(this.arraylistContainer),events.on("module.update",(e=>{this.update(e.name,e.isEnabled)})),this.initialized=!0)}measureElementWidth(e){return e.getBoundingClientRect().width}onDisable(){this.arraylistContainer.style.opacity="0"}}var hooks=__webpack_require__(548);class Watermark extends Module{constructor(){super("Watermark","Visual",{Text:"Astolfo.wtf"})}onSettingUpdate(){let e=document.querySelector(".Minebuns-overlay-title");e&&(e.textContent=this.options.Text)}onEnable(){let e=document.querySelector(".Minebuns-overlay-title");e||(e=document.createElement("div"),e.className="Minebuns-overlay-title",e.textContent=this.options.Text,e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.padding="0.5em",e.style.userSelect="none",e.style.display="none",e.style.zIndex="1000",e.style.textShadow="linear-gradient(135deg, rgb(255, 105, 180) 0%, rgb(255, 182, 193) 50%, rgb(255, 105, 180) 100%) 0px 0px 10px",e.style.fontFamily="'Product Sans', sans-serif",e.style.fontSize="24px",e.style.background="linear-gradient(135deg, rgb(255, 105, 180) 0%, rgb(255, 182, 193) 50%, rgb(255, 105, 180) 100%)",e.style.backgroundClip="text",e.style.webkitFontSmoothing="antialiased",e.style.webkitTextFillColor="transparent",document.body.appendChild(e)),document.querySelector(".Minebuns-overlay-title").style.display="flex"}onDisable(){document.querySelector(".Minebuns-overlay-title").style.display="none"}}class ModuleSettings{constructor(e,t){this.module=e,this.container=t,this.components=[],this.initialized=!1,this.isOpen=!1}initialize(){!this.initialized&&this.module?.options&&(Object.keys(this.module.options).forEach((e=>{const t=this.module.options[e],n=typeof t;e.toLowerCase().includes("color")?this.addColorPicker(e):"boolean"===n||"true"===t||"false"===t?this.addCheckbox(e):"string"===n?this.addStringInput(e):this.addNumberInput(e)})),this.components.forEach((e=>e.style.display="none")),this.initialized=!0)}toggle(){this.isOpen=!this.isOpen,this.components.forEach((e=>{e.style.display=this.isOpen?"flex":"none",this.isOpen?this.container.style.marginBottom="5px":this.container.style.marginBottom="0px"}))}addNumberInput(e){const t=document.createElement("div");t.className="gui-setting-container";const n=document.createElement("span");n.className="gui-setting-label",n.textContent=e;const o=document.createElement("input");o.type="text",o.className="gui-text-input",o.value=this.module.options[e];let s=o.value;o.addEventListener("input",(()=>{const t=o.value.trim();isNaN(t)||""===t||(s=t,this.module.options[e]=t,events.emit("setting.update",this.module))})),o.addEventListener("blur",(()=>{(isNaN(o.value)||""===o.value.trim())&&(o.value=s)})),o.addEventListener("keydown",(e=>{"Enter"===e.key&&o.blur()})),t.appendChild(n),t.appendChild(o),this.container.appendChild(t),this.components.push(t)}addStringInput(e){const t=document.createElement("div");t.className="gui-setting-container";const n=document.createElement("span");n.className="gui-setting-label",n.textContent=e;const o=document.createElement("input");o.type="text",o.className="gui-text-input",o.value=this.module.options[e],o.addEventListener("input",(()=>{const t=o.value.trim();this.module.options[e]=t,events.emit("setting.update",this.module)})),t.appendChild(n),t.appendChild(o),this.container.appendChild(t),this.components.push(t)}addCheckbox(e){const t=document.createElement("div");t.className="gui-setting-container";const n=document.createElement("span");n.className="gui-setting-label",n.textContent=e;const o=document.createElement("div");o.className="gui-checkbox",o.classList.toggle("enabled",!0===this.module.options[e]||"true"===this.module.options[e]),o.addEventListener("click",(()=>{const t=o.classList.contains("enabled");o.classList.toggle("enabled"),this.module.options[e]=(!t).toString(),events.emit("setting.update",this.module)})),t.appendChild(n),t.appendChild(o),this.container.appendChild(t),this.components.push(t)}addColorPicker(e){const t=document.createElement("div");t.className="gui-setting-container";const n=document.createElement("span");n.className="gui-setting-label",n.textContent=e;const o=document.createElement("div");o.className="gui-color-picker",o.style.background=this.module.options[e];const s=document.createElement("input");s.type="color",s.className="gui-color-input",o.appendChild(s),s.addEventListener("input",(t=>{o.style.background=t.target.value,this.module.options[e]=t.target.value,events.emit("setting.update",this.module)})),t.appendChild(n),t.appendChild(o),this.container.appendChild(t),this.components.push(t)}}class Panel{constructor(e,t={top:"200px",left:"200px"}){this.panel=document.createElement("div"),this.panel.className="gui-panel",this.panel.style.top=t.top,this.panel.style.left=t.left,this.header=document.createElement("div"),this.header.className="gui-header",this.header.textContent=e,this.panel.appendChild(this.header),document.body.appendChild(this.panel),this.buttons=[],this.setupDragHandling()}setupDragHandling(){let e=!1,t={x:0,y:0};this.header.addEventListener("mousedown",(n=>{e=!0,t.x=n.clientX-this.panel.offsetLeft,t.y=n.clientY-this.panel.offsetTop})),document.addEventListener("mousemove",(n=>{e&&(this.panel.style.left=n.clientX-t.x+"px",this.panel.style.top=n.clientY-t.y+"px")})),document.addEventListener("mouseup",(()=>e=!1))}addButton(e){const t=document.createElement("div");t.className="gui-button-container";const n=document.createElement("div");n.className="gui-button "+(e.isEnabled?"enabled":"");const o=document.createElement("span");o.textContent=e.name,o.style.flex="1";const s=document.createElement("span");s.className="gui-category-tag",s.textContent=e.category,n.appendChild(o),n.appendChild(s);const i=new ModuleSettings(e,t);return n.addEventListener("mousedown",(t=>{0===t.button&&(e.toggle(),n.classList.toggle("enabled",e.isEnabled)),1===t.button&&(o.textContent="waiting for bind..",s.style.display="none",e.waitingForBind=!0)})),n.addEventListener("contextmenu",(e=>{e.preventDefault(),i.initialize(),i.toggle()})),n.setAttribute("tabindex",-1),n.addEventListener("keydown",(t=>{if(e.waitingForBind){t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation();let n="Escape"===t.key?null:String(t.code);e.keybind=n,e.waitingForBind=!1,o.textContent=e.name,s.style.display="inline"}})),t.appendChild(n),this.panel.appendChild(t),this.buttons.push(n),n}show(){this.panel.style.display="block"}hide(){this.panel.style.display="none"}}var injectStylesIntoStyleTag=__webpack_require__(72),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__(825),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__(659),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__(56),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__(540),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__(113),styleTagTransform_default=__webpack_require__.n(styleTagTransform),clickgui=__webpack_require__(679),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();var update=injectStylesIntoStyleTag_default()(clickgui.A,options);const styles_clickgui=clickgui.A&&clickgui.A.locals?clickgui.A.locals:void 0;class ClickGUI extends Module{constructor(){super("ClickGUI","Visual",{"Accent Color 1":"rgb(255, 105, 180)","Accent Color 2":"rgb(255, 182, 193)","Button Color":"rgba(30, 30, 30, 0.95)","Hover Color":"rgba(50, 50, 50, 0.95)","Panel Color":"rgba(20, 20, 20, 0.92)","Text Color":"#ffffff","Enable Animations":!0},"ShiftRight"),this.GUILoaded=!1,this.panels=[],this.blurredBackground=null,this.updateColors()}updateAnimations(){this.options["Enable Animations"]?document.body.classList.add("with-animations"):document.body.classList.remove("with-animations")}updateColors(){document.body.style.setProperty("--Minebuns-accent-color",`linear-gradient(135deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 50%, ${this.options["Accent Color 1"]} 100%)`),document.body.style.setProperty("--button-color",this.options["Button Color"]),document.body.style.setProperty("--hover-color",this.options["Hover Color"]),document.body.style.setProperty("--panel-bg",this.options["Panel Color"]),document.body.style.setProperty("--text-color",this.options["Text Color"])}onEnable(){document.pointerLockElement&&document.exitPointerLock(),this.GUILoaded?(this.showGUI(),this.updateAnimations()):(this.setupBackground(),this.createPanels(),this.setupEventListeners(),this.GUILoaded=!0,this.updateAnimations())}setupBackground(){this.blurredBackground=document.createElement("div"),this.blurredBackground.className="gui-background",document.body.appendChild(this.blurredBackground)}createPanels(){this.panels.forEach((e=>{e.panel&&e.panel.parentNode&&e.panel.parentNode.removeChild(e.panel)})),this.panels=[],[{title:"Combat",position:{top:"120px",left:"120px"}},{title:"Movement",position:{top:"120px",left:"420px"}},{title:"Visual",position:{top:"120px",left:"720px"}},{title:"Misc",position:{top:"120px",left:"1020px"}}].forEach((e=>{const t=new Panel(e.title,e.position);this.panels.push(t)}));const e={};Object.values(module_moduleManager.modules).forEach((t=>{e[t.category]||(e[t.category]=[]),e[t.category].push(t)})),Object.entries(e).forEach((([e,t])=>{const n=this.panels.find((t=>t.header.textContent===e));n&&(t.sort(((e,t)=>t.name.length-e.name.length)),t.forEach((e=>n.addButton(e))))}))}setupEventListeners(){events.on("module.update",(e=>{const t=this.panels.find((t=>t.header.textContent===e.category));if(!t)return;const n=t.buttons.find((t=>{const n=t.querySelector("span:first-child");return n&&n.textContent===e.name}));n&&n.classList.toggle("enabled",e.isEnabled)}))}showGUI(){this.panels.forEach((e=>e.show())),this.blurredBackground.style.display="block"}onDisable(){this.panels.forEach((e=>e.hide())),this.blurredBackground.style.display="none"}onSettingUpdate(){this.updateColors(),this.updateAnimations()}}class Airjump extends Module{constructor(){super("Airjump","Movement",null)}onRender(){hooks.A?.gameWorld?.player&&(hooks.A.gameWorld.player.collision.isGrounded=!0)}}class Instabreak extends Module{constructor(){super("Instabreak","Misc",null),this.originalHardness=new Map}onEnable(){Object.values(hooks.A.gameWorld.items).forEach((e=>{e?.destruction&&(this.originalHardness.has(e)||this.originalHardness.set(e,e.destruction.durability),e.destruction.durability=0)}))}onDisable(){Object.values(hooks.A.gameWorld.items).forEach((e=>{e?.destruction&&this.originalHardness.has(e)&&(e.destruction.durability=this.originalHardness.get(e))}))}}class Nuker extends Module{constructor(){super("Nuker","Misc",{Radius:3,"Chunk Interval":1e3}),this.lastExecutionTime=0}onRender(){if(!hooks.A?.gameWorld?.player)return;let e=this.options.Radius;const t=this.options["Chunk Interval"],n=Date.now();if(n-this.lastExecutionTime>=t){this.lastExecutionTime=n;let t=Object.values(hooks.A.gameWorld.player.position).splice(0,3).map(Math.floor);for(let n=-e;n<=e;n++)for(let o=-e;o<=e;o++)for(let s=-e;s<=e;s++){const[e,i,a]=[t[0]+n,t[1]+o,t[2]+s];0!==hooks.A.gameWorld.chunkManager.getBlock(e,i,a)&&hooks.A.gameWorld.chunkManager.setBlock(e,i,a,0,!0,!0)}}}}class AdBypass extends Module{constructor(){super("AdBypass","Misc")}onEnable(){this._reward=this._reward||hooks.A.stores.adsStore.rewardCommercialVideoWrapper,hooks.A.stores.adsStore.rewardCommercialVideoWrapper=()=>!0}onDisable(){hooks.A.stores.adsStore.rewardCommercialVideoWrapper=()=>this._reward}}class Fly extends Module{constructor(){super("Fly","Movement",{"Vertical Speed":5})}onRender(){hooks.A?.gameWorld?.player&&(hooks.A.gameWorld.player.velocity.gravity=0,hooks.A?.gameWorld?.player?.inputs.jump?hooks.A.gameWorld.player.velocity.velVec3.y=this.options["Vertical Speed"]:hooks.A?.gameWorld?.player?.inputs.crouch?hooks.A.gameWorld.player.velocity.velVec3.y=-this.options["Vertical Speed"]:hooks.A.gameWorld.player.velocity.velVec3.y=0)}onDisable(){hooks.A.gameWorld.player.velocity.gravity=23}}class Speed extends Module{constructor(){super("Speed","Movement",{Speed:15})}onRender(){hooks.A?.gameWorld?.player&&(hooks.A.gameWorld.player.velocity.moveSpeed=this.options.Speed,hooks.A.gameWorld.player.velocity.fastMoveSpeed=this.options.Speed)}onDisable(){hooks.A.gameWorld.player.velocity.moveSpeed=4.5,hooks.A.gameWorld.player.velocity.fastMoveSpeed=6.4}}class FreeHeadcoins extends Module{constructor(){super("FreeHeadcoins","Misc")}async onEnable(){let e=await hooks.A.network.get("users/freeSpinner");hooks.A.stores.userState.user.balance.headcoins+=e.data.amount,module_moduleManager.modules.FreeHeadcoins.disable()}}class Fill extends Module{constructor(){super("Fill","Misc",{Radius:4,"Block ID":652,"Chunk Interval":500}),this.lastExecutionTime=0}onRender(){if(!hooks.A?.gameWorld?.player)return;let e=this.options.Radius;const t=this.options["Chunk Interval"],n=Date.now();if(n-this.lastExecutionTime>=t){this.lastExecutionTime=n;let t=Object.values(hooks.A.gameWorld.player.position).splice(0,3).map(Math.floor);for(let n=-e;n<=e;n++)for(let o=-e;o<=e;o++)for(let s=-e;s<=e;s++){const[e,i,a]=[t[0]+n,t[1]+o,t[2]+s];0==hooks.A.gameWorld.chunkManager.getBlock(e,i,a)&&hooks.A.gameWorld.chunkManager.setBlock(e,i,a,this.options["Block ID"],!0,!0)}}}}class Chams extends Module{constructor(){super("Chams","Visual",null)}onRender(){hooks.A?.gameWorld?.player&&hooks.A.gameWorld.server.players.forEach((e=>{e.playerMaterial.depthTest=!1,e.playerMaterial.wireframe=!0}))}onDisable(){hooks.A.gameWorld.server.players.forEach((e=>{e.playerMaterial.depthTest=!0,e.playerMaterial.wireframe=!1}))}}class FOVChanger extends Module{constructor(){super("FOVChanger","Visual",{FOV:120})}onRender(){let e=hooks.A?.gameWorld?.threeScene?.camera||null;e?.updateProjectionMatrix&&e.fov!==parseFloat(this.options.FOV)&&(e.fov=parseFloat(this.options.FOV),e.updateProjectionMatrix(),hooks.A.gameWorld.player.settings.__defineGetter__("fov",(()=>parseFloat(this.options.FOV))))}onDisable(){hooks.A.gameWorld.threeScene.camera=70,hooks.A.gameWorld.threeScene.camera.updateProjectionMatrix(),delete hooks.A.gameWorld.player.settings.fov,hooks.A.gameWorld.player.settings.fov=70}}class Scaffold extends Module{constructor(){super("Scaffold","Movement",{"Extend Distance":3}),this.lastPlacedPositions=new Set}onRender(){if(!hooks.A?.gameWorld?.player)return;let e=Object.values(hooks.A.gameWorld.player.position).splice(0,3).map(Math.floor),t=this.options["Extend Distance"],n=hooks.A.gameWorld.player.currentInventoryItemId;if(!n)return;for(let o=-t;o<=t;o++){for(let s=-t;s<=t;s++){let i=[e[0]+o,e[1]-1,e[2]+s],a=hooks.A.gameWorld.chunkManager.getBlock(...i),r=hooks.A.gameWorld.items[a]?.replaceable||!1;if((0==a||r)&&!this.lastPlacedPositions.has(i.join(","))){hooks.A.gameWorld.chunkManager.setBlock(...i,n,!0,!0),this.lastPlacedPositions.add(i.join(","));setTimeout((()=>{this.lastPlacedPositions.delete(i.join(","))}),200)}}}}}class Nofall extends Module{constructor(){super("Nofall","Movement",{"Fall Speed":0.5})}onRender(){if(!hooks.A?.gameWorld?.player) return;        if(hooks.A.gameWorld.player.velocity.velVec3.y < 0) {            hooks.A.gameWorld.player.velocity.velVec3.y *= this.options["Fall Speed"];        }        if(!hooks.A.gameWorld.player.collision.isGrounded) {            hooks.A.gameWorld.player.inputs.jump = false;        }    }}class HighJump extends Module {
    constructor() {
        super("HighJump", "Movement", {"Jump Height": 3.0})
    }

    onEnable() {
        if (hooks.A?.gameWorld?.player?.collision.isGrounded) {
            hooks.A.gameWorld.player.velocity.velVec3.y = this.options["Jump Height"];
        }

        // Выключение через 5 секунд
        setTimeout(() => {
            this.disable();
        }, 5000);
}}const mathUtils={normalizeVector(e){const t=e.x*e.x+e.y*e.y+e.z*e.z;if(t>0){const n=1/Math.sqrt(t);return[e.x*n,e.y*n,e.z*n]}return e},distanceBetween(e,t){const n=t.x-e.x,o=t.y-e.y,s=t.z-e.z;return n*n+o*o+s*s},distanceBetweenSqrt(e,t){return Math.sqrt(this.distanceBetween(e,t))},calculateDistance:(e,t)=>Math.hypot(t.x-e.x,t.y-e.y,t.z-e.z)},gameUtils={getClosestPlayer(){let e=hooks.A.gameWorld.player.position,t=hooks.A.gameWorld.server.players,n=[];return t.forEach((function(t,o){let s=mathUtils.distanceBetween(e,{x:t._model.position.x,y:t._model.position.y,z:t._model.position.z});t.id=o,n.push({player:t,distance:s})})),n.sort(((e,t)=>e.distance-t.distance)),n.map((e=>e.player))[0]},hexToRgb(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}};class Killaura extends Module{constructor(){super("Killaura","Combat",{"Y Offset":1.62,Reach:5,Delay:100,Instakill:!1,"Attack Count":10}),this.lastExecutionTime=null}onRender(){const e=Date.now();hooks.A?.gameWorld?.player&&e-this.lastExecutionTime>=this.options.Delay&&(this.lastExecutionTime=e,this.tryKill())}tryKill(){let e=this.options.Reach,t=this.options["Y Offset"],n=gameUtils.getClosestPlayer();if(!n)return;var o={x:hooks.A.gameWorld.player.position.x,y:hooks.A.gameWorld.player.position.y+t,z:hooks.A.gameWorld.player.position.z},s=n._model.position,i={x:o.x-s.x,y:o.y-s.y,z:o.z-s.z},a=Math.sqrt(i.x*i.x+i.y*i.y+i.z*i.z);0!==a&&(i.x/=a,i.y/=a,i.z/=a),i.x=-i.x,i.y=-i.y,i.z=-i.z;var r=Math.sqrt(Math.pow(o.x-s.x,2)+Math.pow(o.y-s.y,2)+Math.pow(o.z-s.z,2));if(r<e){if(this.options.Instakill){for(let e=0;e<this.options["Attack Count"];e++){hooks.A.gameWorld.server.sendData(13,[hooks.A.gameWorld.time.localServerTimeMs,o.x,o.y,o.z,i.x,i.y,i.z,r,n.id])}}else{hooks.A.gameWorld.server.sendData(13,[hooks.A.gameWorld.time.localServerTimeMs,o.x,o.y,o.z,i.x,i.y,i.z,r,n.id])}}}}class GunModifier extends Module{constructor(){super("GunModifier","Combat",{Spread:.5,"Bullets per shot":100,"Firerate (ms)":1,"Bullet distance":1e3,"Reload Time":1,Recoil:!1})}get gunSystem(){return hooks.A.stores.gameState.gameWorld.systemsManager.activeSystems.find((e=>e?.bulletsSystem))}onEnable(){let e=this.gunSystem.playerShooter.currPlayerWeaponSpec;e.bulletsPerShot=this.options["Bullets per shot"],e.firerateMs=this.options["Firerate (ms)"],e.distance=this.options["Bullet distance"],e.startSpread=this.options.Spread,e.reloadTimeMs=this.options["Reload Time"],this.options.Recoil||(e.recoilAttackY=0,e.recoilAttackY=0)}}class Disabler extends Module{constructor(){super("Disabler","Misc"),this.packetID=null}insaneBypass(){}onRender(){if(!hooks.A?.gameWorld?.player)return;let e=hooks.A.stores.gameState.gameWorld.server.msgsListeners;this.packetID||(this.packetID=Object.keys(e).find((t=>e[t].toString().includes("correct pos")))),e[this.packetID]!==this.insaneBypass&&(e[this.packetID]=this.insaneBypass)}}class Aimbot extends Module{constructor(){super("Aimbot","Combat",{"On Aim":"true","On Shoot":"true","Y Offset":.5}),this.lastExecutionTime=null}getClosestEnemy(e,t){let n=null,o=1/0;return t.forEach((t=>{if(t?.model?.position&&t.isAlive){let s=mathUtils.calculateDistance(e.position,t.model.position);s<o&&(o=s,n=t)}})),n}aimAtEnemy(){let e=hooks.A.stores.gameState,t=e.gameWorld.player,n=e.gameWorld.server.players;if(!t||!n)return;let o=this.getClosestEnemy(t,n);if(o){let e=o.model.position,n=t.position,s={x:e.x-n.x,z:e.z-n.z},i=Math.atan2(s.x,s.z),a=parseFloat(this.options["Y Offset"]),r=e.y+a-n.y,l=Math.hypot(s.x,s.z),d=Math.atan2(r,l);d=Math.max(Math.min(d,Math.PI/2),-Math.PI/2);let c=(i+Math.PI)%(2*Math.PI);t.rotation.y=c,t.rotation.x=d}}onRender(){hooks.A?.stores?.gameState?.gameWorld?.server&&("true"==this.options["On Aim"]&&hooks.A.stores.gameState.gameWorld.player.inputs.rightMB||"true"==this.options["On Shoot"]&&hooks.A.stores.gameState.gameWorld.player.inputs.leftMB||"true"!==this.options["On Shoot"]&&"true"!==this.options["On Aim"])&&this.aimAtEnemy()}}class NoClip extends Module{constructor(){super("NoClip","Movement")}get playerPhysicsSystem(){return hooks.A.gameWorld.systemsManager.activeSystems.find((e=>e?.playerPhysicsSystem)).playerPhysicsSystem}onRender(){hooks.A?.gameWorld?.player&&(this._og=this._og||this.playerPhysicsSystem.resolveBlockCollision,this.playerPhysicsSystem.resolveBlockCollision==this._og&&(this.playerPhysicsSystem.resolveBlockCollision=()=>{}))}onDisable(){this.playerPhysicsSystem.resolveBlockCollision=()=>this._og}}class Timer extends Module{constructor(){super("Timer","Movement",{Multiplier:1.2}),this.interval=null}onEnable(){this.interval&&clearInterval(this.interval),this.interval=setInterval((()=>{hooks.A.stores.gameState.gameWorld.time.elapsedTimeMs+=20*this.options.Multiplier}),20)}onDisable(){this.interval&&clearInterval(this.interval)}}const module_moduleManager={modules:{},addModules:function(...e){for(const t of e)this.modules[t.name]=t},addModule:function(e){this.modules[e.name]=e},handleKeyPress:function(e){for(let t in this.modules){let n=this.modules[t];n.waitingForBind?(n.keybind=e,n.waitingForBind=!1):n.keybind==e&&n.toggle()}},init(){this.addModules(new ArrayList,new Watermark,new ClickGUI,new Airjump,new Instabreak,new Nuker,new AdBypass,new Fly,new Speed,new FreeHeadcoins,new Fill,new Chams,new FOVChanger,new Scaffold,new Nofall,new HighJump,new Killaura,new GunModifier,new Disabler,new Aimbot,new NoClip,new Timer),events.on("render",(()=>{for(let e in this.modules)this.modules[e].isEnabled&&this.modules[e].onRender()})),events.on("keydown",this.handleKeyPress.bind(this)),events.on("setting.update",(()=>{for(let e in this.modules)this.modules[e].isEnabled&&this.modules[e].onSettingUpdate()})),this.modules.Arraylist.enable(),this.modules.Watermark.enable()}};class Minebuns{constructor(){this.version="1.0.0",this.init()}init(){setInterval((()=>{events.emit("render")}),1e3/60),document.addEventListener("keydown",(e=>{events.emit("keydown",e.code)})),hooks.A.init(),module_moduleManager.init(),window.hooks=hooks.A}disable(){}}const main=new Minebuns})();

/**************** MineFun King Script ****************/

// ==/UserScript==

    (function() {
        'use strict';

        // IMMEDIATE ALERT TO CONFIRM SCRIPT IS LOADED
            console.log('%c[MineFun King] Script is loading...', 'color: #00ff00; font-size: 16px; font-weight: bold;');

            // Create visual status indicator with manual button
            function createStatusIndicator() {
                const indicator = document.createElement('div');
                indicator.id = 'minefun-king-status';
                indicator.style.cssText = `transition: transform 0.2s ease;
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.9);
                    color: #00ff00;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 14px;
                    z-index: 999999;
                    border: 2px solid #00ff00;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                </div>`;
indicator.innerHTML = `<div id="mfk-collapse-title" style="cursor:pointer;font-weight:bold;margin-bottom:8px;font-size:15px;color:#00ff00;display:flex;justify-content:space-between;align-items:center;"><span>MineFun King</span><span id="mfk-arrow">▼</span></div><div id="mfk-collapse-content">
                🎮 MineFun King v7.2<br>
                Status: <span id="mfk-status">Loading...</span><br>
                    <button id="mfk-manual-btn" style="
                        margin-top: 10px;
                        padding: 8px 15px;
                        background: #00ff00;
                        color: #000;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;
                    ">🔧 FORCE ACTIVATE</button>
                    <br>
                    <button id="mfk-scan-btn" style="
                        margin-top: 5px;
                        padding: 5px 10px;
                        background: #ffff00;
                        color: #000;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 11px;
                    ">🔍 Scan Now</button>
                `;
                document.body.appendChild(indicator);

                // Manual activation button
                document.getElementById('mfk-manual-btn').addEventListener('click', () => {
                    forceActivate();
                });

                // Scan button
                document.getElementById('mfk-scan-btn').addEventListener('click', () => {
                    aggressiveScan();
                    // Also run the detailed finder
                    setTimeout(() => {
                        console.log('%c[MineFun King] Running detailed search...', 'color: #00ffff;');
                        window.findAllGameObjects();
                    }, 1000);
                });

                return indicator;
            }

        function updateStatus(status, color = '#00ff00') {
            const statusEl = document.getElementById('mfk-status');
            if (statusEl) {
                statusEl.textContent = status;
                statusEl.style.color = color;
            }
        }

        // Create Hit All indicator (green/red dot) - TOP LEFT
        function createHitAllIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'mfk-hitall-indicator';
            indicator.style.cssText = `transition: transform 0.2s ease;
                position: fixed;
                top: 10px;
                left: 10px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff0000;
                border: 3px solid rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
                z-index: 999999;
                transition: all 0.3s ease;
            `;

            if (document.body) {
                document.body.appendChild(indicator);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(indicator);
                });
            }

            return indicator;
        }

        function updateHitAllIndicator(isActive) {
            const indicator = document.getElementById('mfk-hitall-indicator');
            if (indicator) {
                if (isActive) {
                    indicator.style.background = '#00ff00';
                    indicator.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
                } else {
                    indicator.style.background = '#ff0000';
                    indicator.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
                }
            }
        }

        // Create Infection Win indicator (green/red dot) - BOTTOM LEFT
        function createInfectionWinIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'mfk-infection-indicator';
            indicator.style.cssText = `transition: transform 0.2s ease;
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff0000;
                border: 3px solid rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
                z-index: 999999;
                transition: all 0.3s ease;
            `;

            if (document.body) {
                document.body.appendChild(indicator);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(indicator);
                });
            }

            return indicator;
        }

        function updateInfectionWinIndicator(isActive) {
            const indicator = document.getElementById('mfk-infection-indicator');
            if (indicator) {
                if (isActive) {
                    indicator.style.background = '#00ff00';
                    indicator.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
                } else {
                    indicator.style.background = '#ff0000';
                    indicator.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
                }
            }
        }

        // Create DEBUG overlay for Infection Win
        function createInfectionDebugOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'mfk-infection-debug';
            overlay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                padding: 20px;
                border-radius: 10px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                z-index: 10000000;
                border: 3px solid #ff0000;
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.7);
                display: none;
                min-width: 400px;
                max-width: 600px;
            `;
            overlay.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 20px; font-weight: bold; color: #ff0000;">🐛 INFECTION WIN DEBUG</div>
                </div>
                <div id="mfk-debug-content" style="line-height: 1.8; max-height: 400px; overflow-y: auto;">
                    <div>⏳ Waiting for H key press...</div>
                </div>
                <div style="text-align: center; margin-top: 15px; font-size: 12px; color: #888;">
                    Press H again to close this debug panel
                </div>
            `;

            if (document.body) {
                document.body.appendChild(overlay);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(overlay);
                });
            }

            return overlay;
        }

        function showInfectionDebug(message, isError = false) {
            const overlay = document.getElementById('mfk-infection-debug');
            const content = document.getElementById('mfk-debug-content');

            if (!overlay || !content) return;

            const color = isError ? '#ff0000' : '#00ff00';
            const timestamp = new Date().toLocaleTimeString();

            const newLine = document.createElement('div');
            newLine.style.color = color;
            newLine.innerHTML = `[${timestamp}] ${message}`;

            content.appendChild(newLine);
            content.scrollTop = content.scrollHeight;

            overlay.style.display = 'block';
        }

        function clearInfectionDebug() {
            const content = document.getElementById('mfk-debug-content');
            if (content) {
                content.innerHTML = '<div>⏳ Starting new debug session...</div>';
            }
        }

        function hideInfectionDebug() {
            const overlay = document.getElementById('mfk-infection-debug');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }

        // Create keybinds help menu (toggle with K)
        function createKeybindsMenu() {
            const menu = document.createElement('div');
            menu.id = 'mfk-keybinds-menu';
            menu.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                padding: 30px;
                border-radius: 15px;
                font-family: 'Courier New', monospace;
                font-size: 16px;
                z-index: 9999999;
                border: 3px solid #00ff00;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.7);
                display: none;
                min-width: 400px;
            `;
            menu.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 24px; font-weight: bold; color: #00ff00;">🎮 MineFun King v7.2</div>
                    <div style="font-size: 14px; color: #ffff00; margin-top: 5px;">Status: <span id="mfk-menu-status">ACTIVE</span></div>
                </div>

                <div style="border-top: 2px solid #00ff00; padding-top: 15px; margin-top: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #00ffff;">⌨️ KEYBINDS:</div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">SPACE</span>
                        <span>→</span>
                        <span>Super Jump / Fly 🚀</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">\` (Backtick)</span>
                        <span>→</span>
                        <span>Teleport to Block 📍</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">. (Period)</span>
                        <span>→</span>
                        <span>Toggle Hit All (Green Dot = ON) 🎯</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">, (Comma)</span>
                        <span>→</span>
                        <span>Remove Floor 🪓</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">H</span>
                        <span>→</span>
                        <span>SERVER TP K**l (Infection) 🌐💀</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">= or + (Equal)</span>
                        <span>→</span>
                        <span>Toggle All Hacks ON/OFF 🔥</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">K K (Double-Tap)</span>
                        <span>→</span>
                        <span>Toggle This Menu 📋</span>
                    </div>
                </div>

                <div style="border-top: 2px solid #00ff00; padding-top: 15px; margin-top: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00ffff;">✨ FEATURES:</div>
                    <div style="font-size: 14px; line-height: 1.6;">
                        <div>✅ ESP (See players through walls)</div>
                        <div>✅ No Fog</div>
                        <div>✅ Fast Crouch</div>
                        <div>✅ No Fall Damage</div>
                        <div>✅ Instant Block Breaking</div>
                        <div>✅ Auto-activation on server join</div>
                    </div>
                </div>

                <div style="border-top: 2px solid #00ff00; padding-top: 15px; margin-top: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00ffff;">📍 INDICATORS:</div>
                    <div style="font-size: 14px; line-height: 1.6;">
                        <div>🔴 <strong>Top-Left:</strong> Hit All OFF</div>
                        <div>🟢 <strong>Top-Left:</strong> Hit All ON</div>
                        <div>🔴 <strong>Bottom-Left:</strong> Infection Win Ready</div>
                        <div>🟢 <strong>Bottom-Left:</strong> Killing in Progress</div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
                    Double-tap K to close • Press H to WIN (Infection Mode)
                </div>
            `;

            if (document.body) {
                document.body.appendChild(menu);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(menu);
                });
            }

            return menu;
        }

        // Toggle menu with DOUBLE-TAP K key (press K twice within 2 seconds)
        let menuVisible = false;
        let lastKPress = 0;
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyK') {
                const now = Date.now();
                const timeSinceLastPress = now - lastKPress;

                // If pressed within 2 seconds, toggle menu
                if (timeSinceLastPress < 2000 && timeSinceLastPress > 100) {
                    const menu = document.getElementById('mfk-keybinds-menu');
                    if (menu) {
                        menuVisible = !menuVisible;
                        menu.style.display = menuVisible ? 'block' : 'none';

                        // Update status in menu
                        const statusEl = document.getElementById('mfk-menu-status');
                        if (statusEl && window.hooked) {
                            statusEl.textContent = cheatInterval ? 'ACTIVE ✅' : 'STANDBY ⏸️';
                            statusEl.style.color = cheatInterval ? '#00ff00' : '#ffff00';
                        }
                    }
                    lastKPress = 0; // Reset after successful toggle
                } else {
                    // First press or too long ago
                    lastKPress = now;
                    console.log('%c[MineFun King] Press K again within 2 seconds to open menu', 'color: #ffff00; font-size: 12px;');
                }
            }
        });

        // Wait for page to load before creating indicator and menu
        if (document.body) {
            createStatusIndicator();
            createKeybindsMenu();
            createHitAllIndicator();
            createInfectionWinIndicator();
            createInfectionDebugOverlay();
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                createStatusIndicator();
                createKeybindsMenu();
                createHitAllIndicator();
                createInfectionWinIndicator();
                createInfectionDebugOverlay();
            });
        }

            // TECHNIQUE 1: Hook POKI SDK - games must call these methods
            console.log('%c[MineFun King] 🎯 Hooking POKI SDK...', 'color: #00ffff; font-size: 14px;');

            // Create a proxy for the POKI SDK that will be set later
            const pokiHandler = {
                get(target, prop) {
                    if (prop === 'gameplayStart') {
                        return function(...args) {
                            console.log('%c[MineFun King] 🎮 POKI.gameplayStart called!', 'color: #00ff00; font-weight: bold;');
                            // Game is starting! Wait a moment then auto-activate
                            setTimeout(() => {
                                console.log('%c[MineFun King] 🔥 Gameplay started! Auto-activating cheats...', 'color: #ff00ff; font-weight: bold;');

                            // Don't auto-activate anymore - user must press = or + key
                            console.log('%c[MineFun King] 🎮 Game ready! Press = or + to activate cheats', 'color: #ffff00; font-size: 16px; font-weight: bold;');
                            updateStatus('Press = or + to start', '#ffff00');
                            }, 1000);

                            if (target[prop]) {
                                return target[prop].apply(target, args);
                            }
                        };
                    }
                    if (prop === 'gameplayStop') {
                        return function(...args) {
                            console.log('%c[MineFun King] 🛑 POKI.gameplayStop called!', 'color: #ff9900;');
                            if (target[prop]) {
                                return target[prop].apply(target, args);
                            }
                        };
                    }
                    return target[prop];
                }
            };

            // Intercept POKI SDK assignments - with safety checks
            Object.defineProperty(window, 'PokiSDK', {
                set(value) {
                    console.log('%c[MineFun King] 📦 PokiSDK assigned!', 'color: #00ff00;');
                    // Only create Proxy if value is an object
                    if (value && typeof value === 'object') {
                        this._pokiSDK = new Proxy(value, pokiHandler);
                    } else {
                        // If not an object, store directly
                        this._pokiSDK = value;
                    }
                },
                get() {
                    return this._pokiSDK;
                },
                configurable: true
            });

        // AUTO-ENABLE DEBUG MODE (this is what makes it work!)
        console.log('%c[MineFun King] 🔥 Auto-enabling debug mode...', 'color: #ff00ff; font-size: 14px; font-weight: bold;');

        // Hook Function.prototype.call to intercept ALL function calls
        const originalCall = Function.prototype.call;
        Function.prototype.call = function(thisArg, ...args) {
            // Check if thisArg looks like a game object
            if (thisArg && typeof thisArg === 'object') {
                if (thisArg.player && thisArg.gameWorld && !window.hooked) {
                    console.log('%c[MineFun King] 🎯 FOUND via function.call!', 'color: #00ff00; font-weight: bold;');
                    window.hooked = thisArg;
                    updateStatus('Game detected! 🎮', '#00ff00');
                }
            }
            return originalCall.apply(this, [thisArg, ...args]);
        };

        // Silent startup - no alerts!
        setTimeout(() => {
            console.log('%c[MineFun King] v5.5 loaded! DEBUG MODE: Press H to see why Infection Win works/fails!', 'color: #00ff00; font-size: 14px;');
            updateStatus('Auto-mode! 🔥', '#00ff00');
        }, 500);

    const { log, warn, error, debug } = window.console;

    const packetsOut = {
        TIME_STEP_INFO: 1,
        TIME_STEP: 2,
        DEATH: 3,
        REQUEST_RESPAWN: 4,
        PLAY_EMOTION: 5,
        PING: 7,
        PLACE_BLOCKS: 8,
        CHAT: 9,
        GET_PLAYERS: 10,
        CONVERT_MINEBUCKS: 11,
        FREE_AD: 12,
        HIT: 13,
        PASTE_CHUNK_BLOCKS: 22,
        FILL_AREA_WITH_BLOCKS: 23,
        PICKUP_DROP_ITEM: 24,
        SKIN_CHANGED: 25,
        USE_FOOD: 26,
        GOT_DAMAGE: 27,
        THROW_DYNAMITE: 28,
        THROW_PROJECTILE: 29,
        UPDATE_SIGN_TEXT: 30,
        SIGN_INPUT_REQUEST: 31,
        MODIFIERS_AMOUNT_TO_REQUEST: 500,
        GET_CHUNKS_MODIFIERS: 501,
        GET_ITEM_WITH_CREATE: 502,
        SHOOTER_CHANGE_WEAPON: 516,
        OPEN_LOOTBOX: 517,
        TRY_TO_USE_TNT: 520,
        USE_HAND_ITEM: 521,
        SET_CURRENT_ACTIVE_SLOT: 504,
        REPLACE_ITEMS_IN_BLOCK: 505,
        REPLACE_ITEMS: 506,
        MOVE_ITEMS_IN_BLOCK: 507,
        MOVE_ITEMS: 508,
        THROW_OUT_ITEM: 509,
        GET_BLOCK_VIA_WHEEL: 510,
        CHANGE_BLOCK_OPEN_STATE: 511,
        EXIT_FROM_STORAGE_BLOCK: 518,
        INST_DRAG_ITEM_TO_ARMOR: 519,
        OPEN_ITEM: 220,
        CRAFT: 221,
        START_TICKER: 222,
        ADD_PLAYER_TO_PRIVATE: 512,
        REMOVE_PLAYER_FROM_PRIVATE: 513,
        GET_PLAYER_PRIVATE_MEMBERS: 514,
        CREATE_PREFAB: 1101,
        DELETE_PREFAB: 1102,
        GET_PREFAB: 1103,
        GET_PREFABS: 1104,
        INSERT_PREFAB: 1105,
        ERASE_AREA: 1106,
        PUBLISH_PREFAB: 1107,
        HNS_ATTACK_BLOCK: 1200,
        HNS_PLAYER_LEFT_HIDED_STATE: 1201,
        CHOOSED_BLOCK: 1202,
        HNS_CHANGE_DOOR_STATE: 1203,
        HNS_GET_FREE_KIT: 1204,
        INFECTION_GET_WEAPON: 1300,
        INFECTION_SELECT_ZOMBIE: 1301,
        WAR_GET_WEAPON: 1400,
        SKY_WARS_SET_KIT: 1500,
        SKY_WARS_GET_FREE_KIT: 1501,
        ONE_BLOCK_PORTAL_REQUEST: 1550,
        ONE_BLOCK_GO_HOME: 1551
    };
    const packetsIn = {
        PLAYER_IN_CHUNK_RANGE: 1,
        PLAYER_OUT_OF_CHUNK_RANGE: 2,
        TIME_STEP: 3,
        UPD_SERVER_TIME: 4,
        PLAYERS_TIME_STEP_INFO: 5,
        PLAYER_DEAD: 6,
        PLAYER_RESPAWNED: 7,
        PLAYER_LEFT: 8,
        PLAY_PLAYER_EMOTION: 9,
        INIT_DATA: 10,
        CHANGE_PLAYER_SKIN: 11,
        PONG: 12,
        UPD_GAME_TIMER: 13,
        GAME_END: 14,
        ALERT: 16,
        CHAT_ALERT: 17,
        CONSOLE_LOG: 18,
        PLAYER_CURRENT_ITEM: 19,
        CHAT: 20,
        GET_PLAYERS: 21,
        UPDATE_SKIN: 22,
        UPDATE_PLAYER_SKIN: 23,
        SET_HEALTH: 24,
        SET_HUNGER: 25,
        PLAYER_FOOTSTEPS_HERABLE: 26,
        TNT_WAS_ACTIVATED: 27,
        TNT_EXPLODED: 28,
        UPD_TICKING_ENTITY_TRANSFORMS: 29,
        DYNAMITE_WAS_THROWN: 30,
        DYNAMITE_EXPLODED: 31,
        DEV_SPAWN_SMALL_CUBE_ON_XYZ: 32,
        PROJECTILE_WAS_THROWN: 33,
        PROJECTILE_COLLIDED: 34,
        SIGN_INPUT_REQUEST: 35,
        SIGN_CHANGE_TEXT: 36,
        CORRECT_POSITION: 37,
        INVENTORY: 501,
        UPDATE_ARMOR: 525,
        UPDATE_PLAYER_ARMOR: 526,
        INSIDE_ITEM_DATA: 527,
        CLOSE_ALL_MODALS: 528,
        UPDATE_DRAG_AND_OPENED_BLOCK: 529,
        BLOCK_STATE: 530,
        INIT_INFO: 502,
        UPDATE_NEAREST_CHUNKS: 503,
        ALL_MODIFIERS_SENT: 504,
        CHUNK_MODIFIERS: 505,
        BLOCKS_TO_SET_BY_COORDS: 506,
        ERASE_BLOCKS: 508,
        SET_BLOCKS_BY_BLOCKS_OFFSETS: 509,
        PRIVATE_MEMBERS_DATA: 510,
        SHOOTER_SHOOT: 511,
        GOT_DAMAGE: 512,
        UPDATE_BALANCE: 513,
        UPD_STARTING_TIME: 522,
        YOU_DEAD: 523,
        PLAYER_GOT_DAMAGE: 524,
        SET_POS: 531,
        SET_ROT: 532,
        LOOTBOX_DATA: 514,
        SHOOTER_CHANGE_PLAYER_WEAPON: 515,
        ADD_DROP_ITEMS: 516,
        UPDATE_DROP_ITEMS: 517,
        DELETE_DROP_ITEMS: 518,
        DELETE_DROP_ITEM_BY_PICKUP: 519,
        FAILED_DROP_ITEM_PICKUP_ATTEMPT: 520,
        CREATIVE_PLOT_MARKER: 1100,
        PREFABS: 1101,
        PREFAB: 1102,
        HNS_PLAYER_HIDED: 1200,
        HNS_HUNTERS_AND_HIDERS: 1204,
        HNS_YOU_ARE_HIDER: 1205,
        HNS_PLAYER_LEFT_HIDED_STATE: 1207,
        HNS_LOCATE_HIDERS: 1208,
        HNS_PLAYER_WAS_ATTACKED: 1209,
        HNS_YOU_ARE_HUNTER: 1210,
        HNS_CHANGE_PLAYER_TO_HUNTER: 1211,
        HNS_UPD_HUNTERS_AND_HIDERS_AMOUNT: 1212,
        HNS_KILL_INFO: 1213,
        HNS_SHOW_BLOCKS_CHOICE_OPTIONS: 1214,
        HNS_CHANGE_PLAYER_BLOCK_ID: 1219,
        HNS_SET_LOCAL_PLAYER_BLOCK_ID: 1220,
        HNS_YOU_WAS_ATTACKED: 1221,
        HNS_HUNTERS_UNLOCKED: 1222,
        HNS_ADD_PHYSICS_IMPULSE: 1223,
        HNS_YOU_CANT_HIDE_HERE: 1225,
        WAR_PLAYER_DEATH: 1300,
        WAR_HURTED_PLAYER: 1301,
        WAR_YOU_KILLED_PLAYER: 1302,
        WAR_YOU_RESPAWNED: 1303,
        INFECTION_ZOMBIES_AND_SHOOTERS: 1350,
        INFECTION_YOU_TURN_TO_ZOMBIE: 1351,
        INFECTION_PLAYER_TURNED_TO_ZOMBIE: 1352,
        INFECTION_UPD_ZOMBIES_AND_SHOOTERS_AMOUNT: 1354,
        INFECTION_YOU_RESPAWNED: 1356,
        INFECTION_HURTED_PLAYER: 1357,
        INFECTION_YOU_KILLED_PLAYER: 1358,
        INFECTION_DEATH_INFO: 1359,
        INFECTION_SHOOTER_WAS_ATTACKED: 1360,
        INFECTION_SET_WEAPON: 1361,
        INFECTION_SET_ZOMBIE_TYPE: 1362,
        INFECTION_UPDATE_HP: 1363,
        SKY_WARS_GAME_STARTED: 1400,
        SKY_WARS_NICKNAMES_DEPTH_TEST_FALSE: 1401,
        SKY_WARS_CHANGE_PLAYER_AVATAR: 1402,
        SKY_WARS_BOARD_PLACE: 1403,
        SKY_WARS_UPD_KILL_DEATH_BAR: 1404,
        ONE_BLOCK_PORTAL_REQUEST_REJECTED: 1450,
        ONE_BLOCK_DEATH: 1451,
        ONE_BLOCK_BLOCKS_DESTROYED: 1452,
        ONE_BLOCK_NEW_PHASE: 1453,
        ONE_BLOCK_LEADERBOARD: 1454
    };

    const invertedPacketsIn = Object.fromEntries(Object.entries(packetsIn).map(([key, value]) => [value, key]));
    const invertedPacketsOut = Object.fromEntries(Object.entries(packetsOut).map(([key, value]) => [value, key]));

    const _assign = Object.assign;
    const _create = Object.create;
    const _defineProperty = Object.defineProperty;
    const _parse = JSON.parse;

            // Store WebSocket for later use
            let gameWebSocket = null;
            let playerData = null;
            let gameActive = false;
            let packetLogging = false; // MUST be declared BEFORE WebSocket hook

            // TECHNIQUE: Network Packet Interception - MINIMAL VERSION
            const OriginalWebSocket = window.WebSocket;
            window.WebSocket = function(...args) {
                const ws = new OriginalWebSocket(...args);
                gameWebSocket = ws;
                console.log('%c[MineFun King] 🌐 WebSocket detected!', 'color: #00ffff; font-size: 14px;');

                // Store original send for packet interception (when logging enabled)
                const originalSend = ws.send.bind(ws);
                ws.send = function(data) {
                    // Only intercept if logging is enabled
                    if (packetLogging) {
                        try {
                            console.log('%c[MineFun King] 📤 Sending:', 'color: #ffff00;', data);
                        } catch (e) {}
                    }
                    return originalSend(data);
                };

                // Simple connection logging - no interference
                ws.addEventListener('open', () => {
                    console.log('%c[MineFun King] ✅ WebSocket connected!', 'color: #00ff00;');
                    updateStatus('Connected!', '#00ff00');
                    gameActive = true;
                });

                ws.addEventListener('close', (e) => {
                    console.log('%c[MineFun King] 🔴 WebSocket closed', 'color: #ff0000;');
                });

                return ws;
            };

            // Global function to send custom packets
            window.sendCustomPacket = function(packetType, ...args) {
                if (!gameWebSocket) {
                    console.log('%c[MineFun King] ❌ No WebSocket connection', 'color: #ff0000;');
                    return false;
                }

                console.log('%c[MineFun King] 📤 Sending custom packet type: ' + packetType, 'color: #00ff00;', args);

                // This would need to be implemented based on the game's protocol
                // For now, just log it
                return true;
            };

            // Packet logger - call this to enable detailed packet logging
            window.startPacketLogging = function() {
                packetLogging = true;
                console.log('%c[MineFun King] 📊 PACKET LOGGING ENABLED', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                console.log('%cAll WebSocket packets will be logged. This will generate A LOT of output!', 'color: #ffff00;');
                updateStatus('Logging packets...', '#ffff00');

                console.log('%c[MineFun King] ✅ Packet logging ON! Check console for packet data.', 'color: #00ff00; font-size: 14px;');
            };

            window.stopPacketLogging = function() {
                packetLogging = false;
                console.log('%c[MineFun King] 📊 Packet logging disabled', 'color: #888;');
            };

            // Analyze WebSocket status
            window.checkWebSocket = function() {
                console.log('%c=== WebSocket Status ===', 'color: #00ffff; font-size: 16px; font-weight: bold;');
                console.log('WebSocket exists:', !!gameWebSocket);
                console.log('Game active:', gameActive);

                if (gameWebSocket) {
                    console.log('WebSocket readyState:', gameWebSocket.readyState);
                    console.log('  0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED');
                    console.log('WebSocket URL:', gameWebSocket.url);
                    console.log('WebSocket protocol:', gameWebSocket.protocol);
                } else {
                    console.log('%c❌ No WebSocket found. Are you in a game?', 'color: #ff0000;');
                }

                return gameWebSocket;
            };

    Object.create = function create() {
        if (!arguments[0]) return {};
        return _create.apply(this, arguments);
    };

            // Hook Object.defineProperty to catch any 'player' property
    Object.defineProperty = function defineProperty() {
        const ret = _defineProperty.apply(this, arguments);

                // Log ALL defineProperty calls to see what's being defined
                if (arguments[0] && arguments[1]) {
                    const objName = arguments[0].constructor ? arguments[0].constructor.name : 'Unknown';
                    const propName = arguments[1];

                    // Look for game-related properties
                    if (propName === 'player' || propName === 'gameWorld' || propName === 'server') {
                        console.log('%c[MineFun King] 🎯 defineProperty caught: ' + objName + '.' + propName, 'color: #00ff00; font-weight: bold;');

                        if (propName === 'player') {
            window.hooked = ret;
                            console.log('%c[MineFun King] ✅ Player object hooked successfully!', 'color: #00ff00; font-size: 14px;');
                            updateStatus('Press = or + to start', '#ffff00');

                            // Don't auto-activate - wait for user to press = or +
                            console.log('%c[MineFun King] 🎉 GAME HOOKED! Press = or + to activate cheats!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                        }
                    }
                }

        return ret;
    };

            // Try to hook Object.prototype.player (might fail with modern security)
            try {
    Object.defineProperty(Object.prototype, 'player', {
        get() {
            return this.__player;
        },
        set(v) {
            this.__player = v;
                        // Also set window.hooked as backup
                        if (v && v.gameWorld) {
                            window.hooked = this;
                            console.log('%c[MineFun King] Player hooked via setter!', 'color: #00ff00; font-size: 14px;');
                            updateStatus('Game hooked! ✅', '#00ff00');
                        }
                    }
                });
            } catch (e) {
                console.log('%c[MineFun King] ⚠️ Object.prototype hooking blocked. Using fallback method...', 'color: #ff9900; font-size: 12px;');
            }

            // Aggressive scan function
            function aggressiveScan() {
                console.log('%c[MineFun King] 🔍 Starting aggressive scan...', 'color: #ffff00; font-size: 14px; font-weight: bold;');
                updateStatus('Scanning...', '#ffff00');

                let found = false;
                let potentialObjects = [];

                // Method 1: Direct window properties - look for game-specific names
                console.log('%c[MineFun King] Scanning window properties...', 'color: #00ffff;');
                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            // Check for game object with player/gameWorld
                            if (window[key].player && window[key].gameWorld) {
                                window.hooked = window[key];
                                console.log('%c[MineFun King] ✅ Found via window.' + key, 'color: #00ff00; font-size: 14px;');
                                found = true;
                                break;
                            }

                            // Look for properties that suggest it's a game object
                            if (window[key].player || window[key].gameWorld || window[key].server) {
                                potentialObjects.push({key: key, obj: window[key]});
                                console.log('%c[MineFun King] 🔍 Potential object: ' + key, 'color: #ffff00;');
                            }

                            // Deep scan - check nested properties
                            if (!found) {
                                for (let subKey in window[key]) {
                                    try {
                                        if (window[key][subKey] && typeof window[key][subKey] === 'object') {
                                            if (window[key][subKey].player && window[key][subKey].gameWorld) {
                                                window.hooked = window[key][subKey];
                                                console.log('%c[MineFun King] ✅ Found via window.' + key + '.' + subKey, 'color: #00ff00; font-size: 14px;');
                                                found = true;
                                                break;
                                            }
                                        }
                                    } catch (e) {}
                                }
                            }
                        }
                    } catch (e) {}
                }

                // Method 1.5: Check potential objects for nested game data
                if (!found && potentialObjects.length > 0) {
                    console.log('%c[MineFun King] Checking ' + potentialObjects.length + ' potential objects...', 'color: #00ffff;');
                    for (let item of potentialObjects) {
                        try {
                            // Try to access nested properties
                            if (item.obj.player && item.obj.player.position) {
                                window.hooked = item.obj;
                                console.log('%c[MineFun King] ✅ Found via potential object: ' + item.key, 'color: #00ff00; font-size: 14px;');
                                found = true;
                                break;
                            }
                        } catch (e) {}
                    }
                }

                // Method 2: Check THREE.js objects
                if (!found && window.THREE) {
                    try {
                        console.log('%c[MineFun King] Checking THREE.js scene...', 'color: #00ffff;');
                        for (let key in window) {
                            try {
                                if (window[key] && window[key].scene && window[key].scene.children) {
                                    console.log('%c[MineFun King] Found THREE scene at: ' + key, 'color: #00ffff;');
                                }
                            } catch (e) {}
                        }
                    } catch (e) {}
                }

                // Method 3: Check canvas elements for attached data
                if (!found) {
                    try {
                        console.log('%c[MineFun King] Checking canvas elements...', 'color: #00ffff;');
                        const canvases = document.getElementsByTagName('canvas');
                        for (let canvas of canvases) {
                            for (let key in canvas) {
                                try {
                                    if (canvas[key] && typeof canvas[key] === 'object' && canvas[key].player) {
                                        window.hooked = canvas[key];
                                        console.log('%c[MineFun King] ✅ Found via canvas.' + key, 'color: #00ff00; font-size: 14px;');
                                        found = true;
                                        break;
                                    }
                                } catch (e) {}
                            }
                        }
                    } catch (e) {}
                }

                if (found) {
                    updateStatus('Game found! ✅', '#00ff00');
                    return true;
                } else {
                    updateStatus('Not found ❌', '#ff0000');
                    console.log('%c[MineFun King] ❌ Could not find game object', 'color: #ff0000; font-size: 14px;');
                    return false;
                }
            }

            // Force activation (even without game object)
            function forceActivate() {
                console.log('%c[MineFun King] 🔧 FORCE ACTIVATION!', 'color: #ff00ff; font-size: 16px; font-weight: bold;');

                // Try aggressive scan first
                if (!window.hooked) {
                    aggressiveScan();
                }

                if (window.hooked) {
                    cheatingIsFun();
                    keybindsLoop();
                    updateStatus('FORCED ON! 🔥', '#00ff00');
                    console.log('%c[MineFun King] ✅ Cheats FORCE ACTIVATED! Press K to see keybinds.', 'color: #00ff00; font-size: 14px; font-weight: bold;');
                } else {
                    updateStatus('Can\'t find game ❌', '#ff0000');
                    console.log('%c[MineFun King] ❌ Could not find game object! Make sure you\'re IN a server.', 'color: #ff0000; font-size: 14px;');
                }
            }

            // Fallback: Search for game object in window
            function findGameObject() {
                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            if (window[key].player && window[key].gameWorld && window[key].gameWorld.server) {
                                window.hooked = window[key];
                                console.log('%c[MineFun King] Game object found via window scan!', 'color: #00ff00; font-size: 14px;');
                                updateStatus('Game found! ✅', '#00ff00');
                                return true;
                            }
                        }
                    } catch (e) {}
                }
                return false;
            }

            // DISABLED: RAF hook was too invasive and broke game
            // const originalRAF = window.requestAnimationFrame;
            // (hook code removed to prevent interference)

            // Alternative method: Hook canvas/WebGL context
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(...args) {
                const ctx = originalGetContext.apply(this, args);
                // Silently scan for game object after canvas creation
                if (!window.hooked) {
                    setTimeout(() => findGameObject(), 2000);
                }
                return ctx;
            };

            // DISABLED: Array.push hook was too invasive and slowed down game
            // const originalPush = Array.prototype.push;
            // (hook code removed to prevent interference)

            // Try to find game object every 500ms
            let findInterval = setInterval(() => {
                if (!window.hooked && findGameObject()) {
                    clearInterval(findInterval);
                }
            }, 500);

            // After 10 seconds, scan more aggressively
            setTimeout(() => {
                if (!window.hooked) {
                    console.log('%c[MineFun King] Trying aggressive scan...', 'color: #ffff00; font-size: 12px;');
                    // Deep scan through window properties
                    for (let key in window) {
                        try {
                            let obj = window[key];
                            if (obj && typeof obj === 'object') {
                                // Check nested properties
                                for (let subKey in obj) {
                                    try {
                                        if (obj[subKey] && obj[subKey].player && obj[subKey].gameWorld) {
                                            window.hooked = obj[subKey];
                                            console.log('%c[MineFun King] Found via deep scan!', 'color: #00ff00; font-size: 14px;');
                                            updateStatus('Game found! ✅', '#00ff00');
                                            break;
                                        }
                                    } catch (e) {}
                                }
                            }
                        } catch (e) {}
                    }
                }
            }, 10000);

    let cheatInterval;
    function cheatingIsFun() {
        if (cheatInterval) {
            clearInterval(cheatInterval);
            cheatInterval = false;
                    console.log('%c[MineFun King] Cheats DISABLED', 'color: #ff0000; font-size: 14px;');
                    updateStatus('Cheats OFF', '#ff0000');
            return;
        }

                console.log('%c[MineFun King] 🔥 Cheats STARTING!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                updateStatus('ACTIVE! 🔥', '#00ff00');

        cheatInterval = setInterval(() => {
            // ESP
            try {
                window.hooked.gameWorld.server.players.forEach((plr) => {
                    plr.playerMaterial.depthTest = false;
                    if (plr.isHided) plr.model.visible = true;
                });
            } catch {}

            // No Fog
            try {
                if (window?.hooked?.gameWorld?.threeScene?.scene?.fog) {
                    _assign(
                        window.hooked.gameWorld.threeScene.scene.fog,
                        {
                            near: 9999,
                            far: 10000
                        }
                    );
                }
            } catch {}

            // Crouch Speed, anti slip (for ice)
            try {
                _assign(window.hooked.player.velocity, {
                    crouchSpeedMultiplier: 1.5,
                });
                _defineProperty(window.hooked.player.velocity, 'slipperiness', {
                    get() {
                        return 1;
                    },
                    set(v) {}
                });
            } catch {}

            try {
                const weaponMod = {
                    // OP Weapons config
                    isAuto: true,
                    firerateMs: 15,
                    lastShootFirerateMs: 15,

                    timeToScopeSec: 0.01,
                    reloadTimeMs: 1,
                    currAmmo: 30,
                    distance: 9999,

                    recoilDecayRatio: 999,
                    recoilMax: 0.000001,
                    maxCrouchSpread: 0.000001,
                    maxStandSpread: 0.000001,

                    maxJumpInaccuracy: 0.000001,
                    maxMoveInaccuracy: 0.000001,

                    knifeLongAttackDelayMs: 10,
                    knifeLongAttackFirerateMs: 15,
                    recoilAttackX: 0.0001,
                    recoilAttackY: 0.0001,
                    secondAttackDistance: 9999,
                    swapTimeMs: 1
                };

                window.hooked.gameWorld.systemsManager.activeSystems.forEach(
                    (system) => {
                        // Reach
                        if (system?.far) system.far = 9999;

                        // Weapon mods
                        if (system?.playerShooter?.currPlayerWeapon) {
                            _assign(
                                system.playerShooter.currPlayerWeapon,
                                weaponMod
                            );
                        }
                        if (system?.playerShooter?.currPlayerWeaponSpec) {
                            _assign(
                                system.playerShooter.currPlayerWeaponSpec,
                                weaponMod
                            );
                        }
                        if (
                            system?.playerShooter?.currPlayerWeaponSpec
                            ?.bulletsQueue
                        ) {
                            _assign(
                                system.playerShooter.currPlayerWeaponSpec
                                .bulletsQueue,
                                {
                                    queueStepMs: 10
                                }
                            );
                        }
                        if (system?.playerShooter) {
                            _defineProperty(system, 'cooldownRemainderMs', {
                                get() {
                                    return 10;
                                },
                                set(v) {}
                            });
                            _defineProperty(system, 'shootPressedDelayer', {
                                get() {
                                    return 1;
                                },
                                set(v) {}
                            });
                        }
                    }
                );
            } catch {}

            try {
                if (typeof window.hooked.gameWorld.server.msgsToSend?._push !== 'function') {
                    window.hooked.gameWorld.server.msgsToSend._push = window.hooked.gameWorld.server.msgsToSend.push;
                    window.hooked.gameWorld.server.msgsToSend.push = function () {
                        if (arguments[0] === packetsOut.HIT && Array.isArray(arguments[1])) {
                            for (let i = 0; i < 15; i++) this._push.apply(this, arguments);
                        }
                        if (arguments[0] === packetsOut.HNS_ATTACK_BLOCK && Array.isArray(arguments[1])) {
                            for (let i = 0; i < 5; i++) this._push.apply(this, arguments);
                        }


                        return this._push.apply(this, arguments);
                    }
                }
            } catch {}


            try {
                let system = window.hooked.gameWorld.systemsManager.activeSystems.find(x => x?.infinityBlocks !== undefined);
                if (system) _defineProperty(system, 'instantBlockBreaking', {
                    get() { return true },
                    set(v) {}
                });
            } catch {}

            try {
                // Adel you're going to have to try a LOT harder than this if you want to stop me LOL
                let posCorrection = Object.entries(window.hooked.gameWorld.server.msgsListeners).find(([k,v]) => v.toString().includes('=this.player.physicsPosComp'));
                if (posCorrection) delete window.hooked.gameWorld.server.msgsListeners[posCorrection[0]];
            } catch {}
        }, 100);
    }

            // Debug function to check game status
            window.checkMineFunStatus = function() {
                console.log('%c=== MineFun King Debug Info ===', 'color: #ffff00; font-size: 16px; font-weight: bold;');
                console.log('window.hooked exists:', !!window.hooked);
                console.log('window.hooked value:', window.hooked);
                if (window.hooked) {
                    console.log('gameWorld exists:', !!window.hooked.gameWorld);
                    console.log('player exists:', !!window.hooked.player);
                    if (window.hooked.gameWorld) {
                        console.log('server exists:', !!window.hooked.gameWorld.server);
                        console.log('players count:', window.hooked.gameWorld.server?.players?.length);
                    }
                }
                console.log('cheatInterval active:', !!cheatInterval);
                console.log('%c=== End Debug ===', 'color: #ffff00; font-size: 16px; font-weight: bold;');

                if (!window.hooked) {
                    console.log('%c[MineFun King] ⚠️ Game object not found! Join a server first.', 'color: #ffff00; font-size: 14px;');
                } else {
                    console.log('%c[MineFun King] ✅ Game hooked successfully! Press K for keybinds.', 'color: #00ff00; font-size: 14px;');
                }
            };

            // TECHNIQUE 2: Deep game scan with multiple methods
            window.deepGameScan = function() {
                console.log('%c╔═══════════════════════════════════════╗', 'color: #ff00ff; font-weight: bold;');
                console.log('%c║   DEEP GAME SCAN - ALL TECHNIQUES    ║', 'color: #ff00ff; font-weight: bold;');
                console.log('%c╚═══════════════════════════════════════╝', 'color: #ff00ff; font-weight: bold;');

                let found = false;

                // Method 1: Canvas element inspection
                console.log('%c[1/6] 🎨 Inspecting Canvas elements...', 'color: #00ffff;');
                const canvases = document.querySelectorAll('canvas');
                canvases.forEach((canvas, idx) => {
                    console.log(`  Canvas ${idx}:`, canvas);

                    // Check all properties of canvas (including non-enumerable)
                    const allProps = Object.getOwnPropertyNames(canvas);
                    for (let prop of allProps) {
                        try {
                            const val = canvas[prop];
                            if (val && typeof val === 'object' && val.player && val.gameWorld) {
                                console.log('%c  🎯 FOUND via canvas.' + prop + '!', 'color: #00ff00; font-weight: bold;');
                                window.hooked = val;
                                found = true;
                                break;
                            }
                        } catch (e) {}
                    }

                    // Check Symbol properties
                    const symbols = Object.getOwnPropertySymbols(canvas);
                    if (symbols.length > 0) {
                        console.log('  Found ' + symbols.length + ' Symbol properties on canvas');
                        for (let sym of symbols) {
                            try {
                                const val = canvas[sym];
                                if (val && typeof val === 'object' && val.player) {
                                    console.log('%c  🎯 FOUND via Symbol!', 'color: #00ff00; font-weight: bold;');
                                    window.hooked = val;
                                    found = true;
                                    break;
                                }
                            } catch (e) {}
                        }
                    }
                });

                if (found) {
                    updateStatus('Found via canvas!', '#00ff00');
                    activateMineFunCheats();
                    return;
                }

                // Method 2: Event listener inspection (Chrome only)
                console.log('%c[2/6] 📡 Checking for event listeners...', 'color: #00ffff;');
                try {
                    if (typeof getEventListeners !== 'undefined') {
                        const listeners = getEventListeners(document);
                        if (listeners) {
                            Object.keys(listeners).forEach(eventType => {
                                console.log(`  Found ${listeners[eventType].length} ${eventType} listeners`);
                            });
                        }
                    } else {
                        console.log('  getEventListeners not available (use Chrome DevTools)');
                    }
                } catch (e) {
                    console.log('  Event listener inspection not available');
                }

                // Method 3: Stack trace analysis
                console.log('%c[3/6] 📚 Creating stack trace...', 'color: #00ffff;');
                try {
                    throw new Error('Trace');
                } catch (e) {
                    console.log('  Stack:', e.stack);
                }

                // Method 4: THREE.js scene inspection (if exists)
                console.log('%c[4/6] 🎭 Checking THREE.js...', 'color: #00ffff;');
                if (window.THREE) {
                    console.log('  THREE.js version:', window.THREE.REVISION);

                    // Look for scenes in window
                    for (let key in window) {
                        try {
                            if (window[key] && window[key].type === 'Scene') {
                                console.log('  Found THREE.Scene at window.' + key);
                                // Walk the scene tree
                                window[key].traverse((obj) => {
                                    if (obj.userData && obj.userData.gameObject) {
                                        console.log('%c  🎯 FOUND gameObject in THREE scene!', 'color: #00ff00; font-weight: bold;');
                                        window.hooked = obj.userData.gameObject;
                                        found = true;
                                    }
                                });
                            }
                        } catch (e) {}
                    }
                } else {
                    console.log('  THREE.js not found');
                }

                // Method 5: Prototype chain walking
                console.log('%c[5/6] 🔗 Walking prototype chains...', 'color: #00ffff;');
                const checkPrototype = (obj, depth = 0) => {
                    if (depth > 10 || !obj) return;
                    try {
                        const proto = Object.getPrototypeOf(obj);
                        if (proto && proto.constructor && proto.constructor.name) {
                            const name = proto.constructor.name;
                            if (name.includes('Game') || name.includes('Player') || name.includes('World')) {
                                console.log('  Found interesting constructor: ' + name);
                            }
                        }
                        checkPrototype(proto, depth + 1);
                    } catch (e) {}
                };

                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            checkPrototype(window[key]);
                        }
                    } catch (e) {}
                }

                // Method 6: Memory leak technique - create an error and inspect its context
                console.log('%c[6/6] 🧠 Memory inspection technique...', 'color: #00ffff;');
                const originalError = Error.prepareStackTrace;
                Error.prepareStackTrace = (error, structuredStackTrace) => {
                    console.log('  Stack frames:', structuredStackTrace.length);
                    structuredStackTrace.forEach((frame, idx) => {
                        try {
                            const thisVal = frame.getThis();
                            if (thisVal && typeof thisVal === 'object' && thisVal.player && thisVal.gameWorld) {
                                console.log('%c  🎯 FOUND via stack frame ' + idx + '!', 'color: #00ff00; font-weight: bold;');
                                window.hooked = thisVal;
                                found = true;
                            }
                        } catch (e) {}
                    });
                    return originalError ? originalError(error, structuredStackTrace) : error.stack;
                };

                try {
                    throw new Error();
                } catch (e) {
                    e.stack; // Trigger prepareStackTrace
                }

                Error.prepareStackTrace = originalError;

                console.log('%c════════════════════════════════════════', 'color: #ff00ff; font-weight: bold;');
                if (found) {
                    console.log('%c✅ GAME OBJECT FOUND!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                    updateStatus('Found! ✅', '#00ff00');
                    activateMineFunCheats();
                } else {
                    console.log('%c❌ Game object not found with any technique', 'color: #ff0000; font-size: 14px;');
                    console.log('%cThe game might be using advanced closure protection.', 'color: #ff9900;');
                    console.log('%cTry: enableDebugMode() for the nuclear option', 'color: #ffff00;');
                    updateStatus('Not found ❌', '#ff0000');
                }
            };

            // Legacy function (now calls deepGameScan)
            window.findAllGameObjects = function() {
                console.log('%c[MineFun King] Calling deepGameScan()...', 'color: #00ffff;');
                deepGameScan();
            };

            // Expose functions for debugging
            window.cheatingIsFun = cheatingIsFun;
            window.keybindsLoop = keybindsLoop;

            // Manual activation function
            window.activateMineFunCheats = function() {
                console.log('%c[MineFun King] Manual activation triggered!', 'color: #ff00ff; font-size: 14px;');
                if (!window.hooked) {
                    console.log('%c[MineFun King] ❌ Game not ready yet! Wait for game to load.', 'color: #ff0000; font-size: 14px;');
                    return;
                }
                console.log('%c[MineFun King] Starting cheat interval...', 'color: #ffff00;');
                cheatingIsFun();
                console.log('%c[MineFun King] Starting keybinds loop...', 'color: #ffff00;');
                keybindsLoop();
                console.log('%c[MineFun King] ✅ Cheats activated! Press K to see keybinds menu!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            };

            // Helper: Manually set game object
            window.setGameObject = function(objectName) {
                if (window[objectName]) {
                    window.hooked = window[objectName];
                    console.log('%c[MineFun King] ✅ Game object set to: ' + objectName, 'color: #00ff00; font-size: 14px;');
                    updateStatus('Hooked manually!', '#00ff00');
                    console.log('%c[MineFun King] Now type: activateMineFunCheats()', 'color: #00ffff; font-size: 14px;');
                    return true;
                } else {
                    console.log('%c[MineFun King] ❌ Object "' + objectName + '" not found! Use findAllGameObjects() to see available objects.', 'color: #ff0000; font-size: 14px;');
                    return false;
                }
            };

        // Debug mode is now AUTO-ENABLED! This function just confirms it's on
        window.enableDebugMode = function() {
            console.log('%c[MineFun King] ✅ DEBUG MODE IS ALREADY AUTO-ENABLED!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            console.log('%cDebug mode runs automatically to detect the game object.', 'color: #00ffff;');
            console.log('%cCheats will auto-activate when you join a server!', 'color: #00ffff;');
            return true;
        };

    setTimeout(() => {
                console.log('%c[MineFun King] Starting keybinds listener...', 'color: #ffff00; font-size: 14px;');

                // START keybindsLoop immediately so it can detect the = key press
                keybindsLoop();

                if (window.hooked) {
                    console.log('%c[MineFun King] Game ready! Press = or + to activate cheats!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                    updateStatus('Press = or + to start', '#ffff00');
                } else {
                    console.log('%c[MineFun King] ⚠️ Game not detected yet. Join a server!', 'color: #ff9900; font-size: 14px;');
                    console.log('%c[MineFun King] Once in game, press = or + to activate', 'color: #00ffff; font-size: 12px;');
                    updateStatus('Join a server!', '#ffff00');
                }
    }, 8000);

    /* Teleportation Stuff */
    function tp(x = 0, y = 0, z = 0, relative = true, sendToServer = true) {
        try {
                // FIXED: Use window.hooked.player (not gameWorld.player!)
                let position = window.hooked.player.position;
                let velocity = window.hooked.player.velocity.velVec3;

            if (relative) {
                position.x += x;
                position.y += y;
                position.z += z;
            } else {
                _assign(position, { x, y, z });
            }
                window.hooked.player.physicsPosComp.copyPos(position);

                // SEND POSITION TO SERVER so others can see you!
                if (sendToServer && window.hooked.gameWorld.server) {
                    try {
                        // Send TIME_STEP packet with new position
                        window.hooked.gameWorld.server.sendData(packetsOut.TIME_STEP, [
                            position.x,
                            position.y,
                            position.z,
                            velocity.x || 0,
                            velocity.y || 0,
                            velocity.z || 0,
                            window.hooked.gameWorld.time.localServerTimeMs
                        ]);
                    } catch (e) {
                        console.log('%c[MineFun King] Failed to send position to server:', 'color: #ff9900;', e);
                    }
                }
        } catch {}
    }

    function tpToSelectedBlock() {
        try {
            let outlineSystem = window.hooked.gameWorld.systemsManager.activeSystems.find(x => x.currBlockPos);
            if (!outlineSystem) return;
            outlineSystem.intersectAndShow(true, 500);
            if (!outlineSystem.currBlockPos) return;
            let { x, y, z } = outlineSystem.currBlockPos;
            tp(x, y + 1, z, false);
                    console.log(`%c[MineFun King] Teleported to ${x}, ${y+1}, ${z}`, 'color: #00ffff;');
        } catch {}
    }

    /* LOL */
    function hitAll() {
        try {
            let hitCount = 0;
            let skippedCount = 0;
            const mySessionId = window.hooked?.player?.sessionId;
            const totalPlayers = window.hooked.gameWorld.server.players.length;

            window.hooked.gameWorld.server.players.forEach(plr => {
                try {
                    // Don't hit yourself
                    if (plr.sessionId === mySessionId) {
                        skippedCount++;
                        return;
                    }

                    // Skip if no valid position
                    if (!plr.model || !plr.model.position) {
                        skippedCount++;
                        return;
                    }

                const { x, y, z } = plr.model.position;

                    // Get velocity if available (for moving players)
                    let vx = 0, vy = 0, vz = 0;
                    if (plr.velocity && plr.velocity.velVec3) {
                        vx = plr.velocity.velVec3.x || 0;
                        vy = plr.velocity.velVec3.y || 0;
                        vz = plr.velocity.velVec3.z || 0;
                    }

                    // SIMPLIFIED: Just hit their current position - no prediction to avoid kicks!
                    let hitSent = false;

                    // Hide and Seek mode - a****k blocks
                    if (plr.hasOwnProperty('isBlock') && !plr.isHunter) {
                    window.hooked.gameWorld.server.sendData(packetsOut.HNS_ATTACK_BLOCK, [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, window.hooked.gameWorld.time.localServerTimeMs, plr.sessionId]);
                        hitSent = true;
                    }
                    // Infection mode - hit humans only
                    else if (plr.hasOwnProperty('isZombie') && !plr.isZombie) {
                    window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
                        hitSent = true;
                    }
                    // All other modes
                    else if (!hitSent) {
                    window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
                    }

                    hitCount++;

                } catch (e) {
                    skippedCount++;
                    console.log('%c[MineFun King] Failed to hit player:', 'color: #ff9900;', e);
                }
            });

            console.log(`%c[MineFun King] ⚔️ Hit ${hitCount}/${totalPlayers} players! (Skipped: ${skippedCount})`, 'color: #ff00ff; font-weight: bold;');
        } catch (e) {
            console.log('%c[MineFun King] ❌ Hit All failed:', 'color: #ff0000;', e);
        }
    }

    function removeFloor() {
        try {
                    let floorCount = 0;
            window.hooked.gameWorld.server.players.forEach(plr => {
                if (!plr.isAlive) return;

                let { x, y, z } = plr.model.position;
                x = Math.round(x);
                y = Math.round(y - 1);
                z = Math.round(z);

                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z-1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z-1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z-1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z+1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z+1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z+1}`, 0]);
                        floorCount++;
            });
                    console.log(`%c[MineFun King] Removed floor under ${floorCount} players! 🕳️`, 'color: #ff6600;');
        } catch {}
    }

    // WIN CONDITION: K**l all humans in Infection mode (SAFE VERSION WITH DEBUG)
    function infectionWin() {
        try {
            clearInfectionDebug();
            showInfectionDebug('🔍 H key pressed! Starting checks...');

            // Check if game is loaded
            showInfectionDebug('📊 Checking if game is loaded...');
            if (!window.hooked) {
                showInfectionDebug('❌ window.hooked is undefined!', true);
                showInfectionDebug('⚠️ Game object not detected. Make sure you\'re in a game!', true);
                return;
            }
            showInfectionDebug('✅ window.hooked exists');

            if (!window.hooked.gameWorld) {
                showInfectionDebug('❌ gameWorld not found!', true);
                return;
            }
            showInfectionDebug('✅ gameWorld exists');

            if (!window.hooked.gameWorld.server) {
                showInfectionDebug('❌ server not found!', true);
                return;
            }
            showInfectionDebug('✅ server exists');

            if (!window.hooked.gameWorld.server.players) {
                showInfectionDebug('❌ players not found!', true);
                return;
            }
            showInfectionDebug('✅ players object exists');

            // Get players (it's already an array, we can forEach it)
            const playersData = window.hooked.gameWorld.server.players;
            const mySessionId = window.hooked?.player?.sessionId;

            // Count players and collect humans
            let totalCount = 0;
            let isInfectionMode = false;
            const humans = [];

            showInfectionDebug('🔍 Iterating through players...');

            playersData.forEach(plr => {
                if (plr) {
                    totalCount++;

                    // Check if Infection mode
                    if (plr.hasOwnProperty('isZombie')) {
                        isInfectionMode = true;

                        // If this is a human (not zombie, not yourself)
                        if (!plr.isZombie && plr.sessionId !== mySessionId) {
                            humans.push(plr);
                        }
                    }
                }
            });

            showInfectionDebug(`📊 Found ${totalCount} total players`);
            showInfectionDebug(`🎮 Your session ID: ${mySessionId || 'unknown'}`);

            if (totalCount === 0) {
                showInfectionDebug('❌ No players detected in forEach loop!', true);
                return;
            }

            // Check if we're in Infection mode
            showInfectionDebug('🔍 Checking if this is Infection mode...');
            if (!isInfectionMode) {
                showInfectionDebug('❌ NOT in Infection mode!', true);
                showInfectionDebug('⚠️ This feature only works in Infection mode', true);
                return;
            }
            showInfectionDebug('✅ Confirmed: Infection mode detected!');

            // Find all humans (not zombies, not yourself)
            showInfectionDebug('🔍 Searching for human players...');

            showInfectionDebug(`👥 Found ${humans.length} humans to eliminate`);

            if (humans.length === 0) {
                showInfectionDebug('✅ No humans left! You already won!');
                return;
            }

            showInfectionDebug(`🧟 Starting REINFORCED TELEPORT for ${humans.length} humans...`);
            showInfectionDebug('🔄 Strategy: 3× TP packets → Lock position → A****k!');
            showInfectionDebug('⚡ Position sent 3 times + during a****k to FORCE sync!');

            // Turn indicator GREEN (killing in progress)
            updateInfectionWinIndicator(true);

            // Save YOUR original position to return to
            const originalPos = {
                x: window.hooked.player.position.x,
                y: window.hooked.player.position.y,
                z: window.hooked.player.position.z
            };
            showInfectionDebug(`📍 Your original position: (${originalPos.x.toFixed(1)}, ${originalPos.y.toFixed(1)}, ${originalPos.z.toFixed(1)})`);

            // Show human positions and distances
            humans.forEach((human, idx) => {
                const dist = Math.sqrt(
                    Math.pow(human.model.position.x - originalPos.x, 2) +
                    Math.pow(human.model.position.y - originalPos.y, 2) +
                    Math.pow(human.model.position.z - originalPos.z, 2)
                );
                const pos = human.model.position;
                showInfectionDebug(`🎯 Human ${idx+1}: ${dist.toFixed(1)} blocks away at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`);
            });

            showInfectionDebug('🔥 STARTING STEALTH K**L SEQUENCE!');

            let currentIndex = 0;

            const killNextHuman = () => {
                if (currentIndex >= humans.length) {
                    showInfectionDebug('🏆 SEQUENCE COMPLETE!');
                    showInfectionDebug(`📊 Attacked ${currentIndex} humans`);
                    showInfectionDebug('🔙 Returning to original position...');

                    // Return to original position
                    tp(originalPos.x, originalPos.y, originalPos.z, false);

                    updateInfectionWinIndicator(false);
                    return;
                }

                const human = humans[currentIndex];

                try {
                    if (!human || !human.model || !human.model.position) {
                        showInfectionDebug(`⚠️ Human ${currentIndex+1} invalid, skipping...`, true);
                        currentIndex++;
                        setTimeout(killNextHuman, 200);
                        return;
                    }

                    const { x, y, z } = human.model.position;

                    showInfectionDebug(`\n🚀 [${currentIndex+1}/${humans.length}] Multi-step TP...`);
                    showInfectionDebug(`📍 Target: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`);

                    // Step 1: First position update
                    tp(x, y + 1, z, false, true);
                    showInfectionDebug(`✅ TP #1 sent! Waiting 200ms...`);

                    setTimeout(() => {
                        // Step 2: Second position update (reinforce)
                        tp(x, y + 1, z, false, true);
                        showInfectionDebug(`✅ TP #2 sent! Waiting 200ms...`);

                        setTimeout(() => {
                            // Step 3: Third position update (make it stick!)
                            tp(x, y + 1, z, false, true);
                            showInfectionDebug(`✅ TP #3 sent! Position should be locked!`);
                            showInfectionDebug(`⏱️ Waiting 300ms then attacking...`);

                            setTimeout(() => {
                                showInfectionDebug(`💥 A****K: Sending 8 hits over 320ms...`);

                                // Send 8 hits (40ms apart = 320ms total)
                                let hitCount = 0;
                                const rapidHitInterval = setInterval(() => {
                                    if (hitCount >= 8) {
                                        clearInterval(rapidHitInterval);
                                        showInfectionDebug(`💀 Human ${currentIndex+1} attacked (8 hits)!`);

                                        // Check if we should continue
                                        showInfectionDebug(`⏱️ Waiting 800ms before next target...`);
                                        currentIndex++;
                                        setTimeout(killNextHuman, 800);
                                        return;
                                    }

                                    try {
                                        // Send hit packet + resend position to keep it locked
                                        if (hitCount % 3 === 0) {
                                            tp(x, y + 1, z, false, true); // Resend position every 3rd hit
                                        }

                                        window.hooked.gameWorld.server.sendData(
                                            packetsOut.HIT,
                                            [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, human.sessionId]
                                        );
                                        hitCount++;
                                    } catch (e) {
                                        showInfectionDebug(`  ❌ Hit ${hitCount + 1} failed`, true);
                                    }
                                }, 40); // 40ms between hits (slower, safer)

                            }, 300); // Wait 300ms after last TP

                        }, 200); // Wait 200ms for TP #2

                    }, 200); // Wait 200ms for TP #1

                } catch (e) {
                    showInfectionDebug(`❌ Error on Human ${currentIndex+1}: ${e.message}`, true);
                    currentIndex++;
                    setTimeout(killNextHuman, 600);
                }
            };

            // Start the sequence
            killNextHuman();

        } catch (e) {
            showInfectionDebug(`❌ ERROR: ${e.message}`, true);
            showInfectionDebug(`📍 Error details: ${e.stack}`, true);
            console.log('%c[MineFun King] ❌ Infection Win failed:', 'color: #ff0000;', e);
        }
    }

    /* Keystokes Stuff */
    function allowBinds() {
        if (!document) return false;
        return (
            document?.pointerLockElement &&
            document?.activeElement?.tagName !== 'INPUT'
        );
    }

    // Hit All toggle system
    let hitAllActive = false;
    let hitAllInterval = null;

    function toggleHitAll() {
        hitAllActive = !hitAllActive;
        updateHitAllIndicator(hitAllActive);

        if (hitAllActive) {
            console.log('%c[MineFun King] 🔥 HIT ALL ENABLED! (450ms - ULTRA SAFE!)', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            // Run immediately
            hitAll();
            // Then run every 450ms (ULTRA SAFE - 1 hit per player only!)
            hitAllInterval = setInterval(() => {
                hitAll();
            }, 450);
        } else {
            console.log('%c[MineFun King] ⏹️ HIT ALL DISABLED', 'color: #ff9900; font-size: 16px; font-weight: bold;');
            if (hitAllInterval) {
                clearInterval(hitAllInterval);
                hitAllInterval = null;
            }
        }
    }

    const pressedKeys = {
        allowBackquote: true,
        allowPeriod: true,
        allowComma: true,
        allowKeyH: true,
        allowEqual: true
    };

    function unlockKey(code) {
        pressedKeys[`allow${code}`] = true;
    }

    window.addEventListener('keydown', (event) => {
        pressedKeys[event.code] = true;
    });

    // Event listener for when a key is released
    window.addEventListener('keyup', (event) => {
        pressedKeys[event.code] = false;
    });

    function keybindsLoop() {
        if (allowBinds()) {
            if (pressedKeys['Space']) {
                    // FIXED: Use window.hooked.player (not gameWorld.player!)
                    if (window?.hooked?.player?.velocity?.velVec3) {
                        try {
                            let { x, y, z } = window.hooked.player.velocity.velVec3;
                            window.hooked.player.velocity.velVec3.set(x, 8, z);
                            console.log('%c[MineFun King] 🚀 SUPER JUMP!', 'color: #00ff00; font-weight: bold;');
                        } catch (e) {
                            console.error('[MineFun King] Jump error:', e);
                        }
                    } else {
                        console.warn('[MineFun King] ⚠️ Player velocity not accessible!');
                }
            }
            if (pressedKeys['Backquote'] && pressedKeys.allowBackquote) {
                    // FIXED: Use window.hooked.player (not gameWorld.player!)
                    if (window?.hooked?.player?.velocity?.velVec3) {
                    pressedKeys.allowBackquote = false;
                    setTimeout(unlockKey.bind(this, ['Backquote']), 400);
                    tpToSelectedBlock();
                }
            }
            if (pressedKeys['Period'] && pressedKeys.allowPeriod) {
                if (window?.hooked?.gameWorld) {
                    pressedKeys.allowPeriod = false;
                    setTimeout(unlockKey.bind(this, ['Period']), 500); // Prevent double-toggle
                    toggleHitAll(); // Toggle on/off instead of single hit
                }
            }
            if (pressedKeys['Comma'] && pressedKeys.allowComma) {
                if (window?.hooked?.gameWorld?.server?.sendData) {
                    pressedKeys.allowComma = false;
                    setTimeout(unlockKey.bind(this, ['Comma']), 200);
                    removeFloor();
                }
            }
            if (pressedKeys['KeyH'] && pressedKeys.allowKeyH) {
                if (allowBinds()) {
                    pressedKeys.allowKeyH = false;
                    setTimeout(unlockKey.bind(this, ['KeyH']), 1000); // 1 second cooldown

                    // Toggle debug panel if it's already open
                    const debugPanel = document.getElementById('mfk-infection-debug');
                    if (debugPanel && debugPanel.style.display === 'block') {
                        hideInfectionDebug();
                    } else {
                        infectionWin();
                    }
                }
            }
            // = or + key to toggle all hacks ON/OFF
            if ((pressedKeys['Equal'] || pressedKeys['NumpadAdd']) && pressedKeys.allowEqual) {
                pressedKeys.allowEqual = false;
                setTimeout(unlockKey.bind(this, ['Equal']), 1000);

                if (!cheatInterval) {
                    // ACTIVATE hacks
                    console.log('%c[MineFun King] 🔥 ACTIVATING ALL HACKS!', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
                    cheatingIsFun();
                    updateStatus('ACTIVE! 🔥', '#00ff00');
                    console.log('%c[MineFun King] ✅ All hacks ON! Fly, ESP, No Fog, etc. Press = again to turn OFF.', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                } else {
                    // DEACTIVATE hacks
                    console.log('%c[MineFun King] ⏹️ DEACTIVATING ALL HACKS!', 'color: #ff9900; font-size: 16px; font-weight: bold;');
                    cheatingIsFun(); // This will turn off the interval (toggle)
                    updateStatus('Press = to start', '#ffff00');
                    console.log('%c[MineFun King] ❌ All hacks OFF! Press = to turn back ON.', 'color: #ff0000; font-size: 16px; font-weight: bold;');
                }
            }
        }
        requestAnimationFrame(keybindsLoop);
    }

    /* POKI SDK Stuff */
    function skipRewardedBreak() {
        return new Promise((resolve) => {
            resolve(true);
        });
    }

            // Wrap in try-catch to handle frozen objects
            try {
    Object.defineProperties(Object.prototype, {
        rewardedBreak: {
            get() {
                return skipRewardedBreak.bind(this);
            },
            set() {},
            enumerable: false
        },
        gameanalytics: {
            get() {
                return {
                    GameAnalytics: {
                        addAdEvent: () => {}
                    },
                    EGAErrorSeverity: {
                        0: 'Undefined',
                        1: 'Debug',
                        2: 'Info',
                        3: 'Warning',
                        4: 'Error',
                        5: 'Critical',
                        Undefined: 0,
                        Debug: 1,
                        Info: 2,
                        Warning: 3,
                        Error: 4,
                        Critical: 5
                    },
                    EGAProgressionStatus: {
                        0: 'Undefined',
                        1: 'Start',
                        2: 'Complete',
                        3: 'Fail',
                        Undefined: 0,
                        Start: 1,
                        Complete: 2,
                        Fail: 3
                    },
                    EGAResourceFlowType: {
                        0: 'Undefined',
                        1: 'Source',
                        2: 'Sink',
                        Undefined: 0,
                        Source: 1,
                        Sink: 2
                    },
                    EGAAdAction: {
                        0: 'Undefined',
                        1: 'Clicked',
                        2: 'Show',
                        3: 'FailedShow',
                        4: 'RewardReceived',
                        Undefined: 0,
                        Clicked: 1,
                        Show: 2,
                        FailedShow: 3,
                        RewardReceived: 4
                    },
                    EGAAdError: {
                        0: 'Undefined',
                        1: 'Unknown',
                        2: 'Offline',
                        3: 'NoFill',
                        4: 'InternalError',
                        5: 'InvalidRequest',
                        6: 'UnableToPrecache',
                        Undefined: 0,
                        Unknown: 1,
                        Offline: 2,
                        NoFill: 3,
                        InternalError: 4,
                        InvalidRequest: 5,
                        UnableToPrecache: 6
                    },
                    EGAAdType: {
                        0: 'Undefined',
                        1: 'Video',
                        2: 'RewardedVideo',
                        3: 'Playable',
                        4: 'Interstitial',
                        5: 'OfferWall',
                        6: 'Banner',
                        Undefined: 0,
                        Video: 1,
                        RewardedVideo: 2,
                        Playable: 3,
                        Interstitial: 4,
                        OfferWall: 5,
                        Banner: 6
                    },
                    http: {
                        EGAHTTPApiResponse: {
                            0: 'NoResponse',
                            1: 'BadResponse',
                            2: 'RequestTimeout',
                            3: 'JsonEncodeFailed',
                            4: 'JsonDecodeFailed',
                            5: 'InternalServerError',
                            6: 'BadRequest',
                            7: 'Unauthorized',
                            8: 'UnknownResponseCode',
                            9: 'Ok',
                            10: 'Created',
                            NoResponse: 0,
                            BadResponse: 1,
                            RequestTimeout: 2,
                            JsonEncodeFailed: 3,
                            JsonDecodeFailed: 4,
                            InternalServerError: 5,
                            BadRequest: 6,
                            Unauthorized: 7,
                            UnknownResponseCode: 8,
                            Ok: 9,
                            Created: 10
                        }
                    },
                    events: {
                        EGASdkErrorCategory: {
                            0: 'Undefined',
                            1: 'EventValidation',
                            2: 'Database',
                            3: 'Init',
                            4: 'Http',
                            5: 'Json',
                            Undefined: 0,
                            EventValidation: 1,
                            Database: 2,
                            Init: 3,
                            Http: 4,
                            Json: 5
                        },
                        EGASdkErrorArea: {
                            0: 'Undefined',
                            1: 'BusinessEvent',
                            2: 'ResourceEvent',
                            3: 'ProgressionEvent',
                            4: 'DesignEvent',
                            5: 'ErrorEvent',
                            9: 'InitHttp',
                            10: 'EventsHttp',
                            11: 'ProcessEvents',
                            12: 'AddEventsToStore',
                            20: 'AdEvent',
                            Undefined: 0,
                            BusinessEvent: 1,
                            ResourceEvent: 2,
                            ProgressionEvent: 3,
                            DesignEvent: 4,
                            ErrorEvent: 5,
                            InitHttp: 9,
                            EventsHttp: 10,
                            ProcessEvents: 11,
                            AddEventsToStore: 12,
                            AdEvent: 20
                        },
                        EGASdkErrorAction: {
                            0: 'Undefined',
                            1: 'InvalidCurrency',
                            2: 'InvalidShortString',
                            3: 'InvalidEventPartLength',
                            4: 'InvalidEventPartCharacters',
                            5: 'InvalidStore',
                            6: 'InvalidFlowType',
                            7: 'StringEmptyOrNull',
                            8: 'NotFoundInAvailableCurrencies',
                            9: 'InvalidAmount',
                            10: 'NotFoundInAvailableItemTypes',
                            11: 'WrongProgressionOrder',
                            12: 'InvalidEventIdLength',
                            13: 'InvalidEventIdCharacters',
                            15: 'InvalidProgressionStatus',
                            16: 'InvalidSeverity',
                            17: 'InvalidLongString',
                            18: 'DatabaseTooLarge',
                            19: 'DatabaseOpenOrCreate',
                            25: 'JsonError',
                            29: 'FailHttpJsonDecode',
                            30: 'FailHttpJsonEncode',
                            31: 'InvalidAdAction',
                            32: 'InvalidAdType',
                            33: 'InvalidString',
                            Undefined: 0,
                            InvalidCurrency: 1,
                            InvalidShortString: 2,
                            InvalidEventPartLength: 3,
                            InvalidEventPartCharacters: 4,
                            InvalidStore: 5,
                            InvalidFlowType: 6,
                            StringEmptyOrNull: 7,
                            NotFoundInAvailableCurrencies: 8,
                            InvalidAmount: 9,
                            NotFoundInAvailableItemTypes: 10,
                            WrongProgressionOrder: 11,
                            InvalidEventIdLength: 12,
                            InvalidEventIdCharacters: 13,
                            InvalidProgressionStatus: 15,
                            InvalidSeverity: 16,
                            InvalidLongString: 17,
                            DatabaseTooLarge: 18,
                            DatabaseOpenOrCreate: 19,
                            JsonError: 25,
                            FailHttpJsonDecode: 29,
                            FailHttpJsonEncode: 30,
                            InvalidAdAction: 31,
                            InvalidAdType: 32,
                            InvalidString: 33
                        },
                        EGASdkErrorParameter: {
                            0: 'Undefined',
                            1: 'Currency',
                            2: 'CartType',
                            3: 'ItemType',
                            4: 'ItemId',
                            5: 'Store',
                            6: 'FlowType',
                            7: 'Amount',
                            8: 'Progression01',
                            9: 'Progression02',
                            10: 'Progression03',
                            11: 'EventId',
                            12: 'ProgressionStatus',
                            13: 'Severity',
                            14: 'Message',
                            15: 'AdAction',
                            16: 'AdType',
                            17: 'AdSdkName',
                            18: 'AdPlacement',
                            Undefined: 0,
                            Currency: 1,
                            CartType: 2,
                            ItemType: 3,
                            ItemId: 4,
                            Store: 5,
                            FlowType: 6,
                            Amount: 7,
                            Progression01: 8,
                            Progression02: 9,
                            Progression03: 10,
                            EventId: 11,
                            ProgressionStatus: 12,
                            Severity: 13,
                            Message: 14,
                            AdAction: 15,
                            AdType: 16,
                            AdSdkName: 17,
                            AdPlacement: 18
                        }
                    },
                    logging: {},
                    utilities: {},
                    validators: {},
                    device: {},
                    threading: {},
                    store: {
                        EGAStoreArgsOperator: {
                            0: 'Equal',
                            1: 'LessOrEqual',
                            2: 'NotEqual',
                            Equal: 0,
                            LessOrEqual: 1,
                            NotEqual: 2
                        },
                        EGAStore: {
                            0: 'Events',
                            1: 'Sessions',
                            2: 'Progression',
                            Events: 0,
                            Sessions: 1,
                            Progression: 2
                        }
                    },
                    state: {},
                    tasks: {}
                };
            },
            set(v) {},
            enumerable: false
        }
    });
            } catch (e) {
                console.log('%c[MineFun King] ⚠️ Could not override rewardedBreak/gameanalytics (object frozen)', 'color: #ff9900; font-size: 11px;');
            }

    console.warn = function (...m) {
        if (m[0] && String(m[0]).includes('GameAnalytics')) {
            return;
        }
        return warn.apply(this, arguments);
    };

            console.log('%c[MineFun King] Script fully loaded and waiting for game...', 'color: #00ff00; font-size: 14px;');
        })();

// Add collapse behavior
(function(){
    const arrow = document.getElementById('mfk-arrow');
    const content = document.getElementById('mfk-collapse-content');
    const title = document.getElementById('mfk-collapse-title');
    if(title){
        title.addEventListener('click', ()=>{
            if(content.style.display==='none'){
                content.style.display='block';
                arrow.textContent='▼';
            } else {
                content.style.display='none';
                arrow.textContent='▲';
            }
        });
    }
})();


// Add drag behavior using collapse title as handle
(function(){
    const panel = document.getElementById('minefun-king-status');
    const handle = document.getElementById('mfk-collapse-title');
    if(panel && handle){
        panel.style.position = 'fixed';
        let offsetX=0, offsetY=0, dragging=false;

        handle.style.cursor='move';

        handle.addEventListener('mousedown', (e)=>{
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e)=>{
            if(dragging){
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', ()=> dragging=false);
    }
})();


// === Eight-direction resize for minefun-king-status ===
(function () {
    const panel = document.getElementById("minefun-king-status");
    if (!panel) return;

    panel.style.resize = "none";
    panel.style.position = "fixed";
    panel.style.overflow = "hidden";

    const handles = [
        { cursor: "nwse-resize", x: 0,   y: 0,   w: 12, h: 12, edge: "nw" },
        { cursor: "nesw-resize", x: 1,   y: 0,   w: 12, h: 12, edge: "ne" },
        { cursor: "nesw-resize", x: 0,   y: 1,   w: 12, h: 12, edge: "sw" },
        { cursor: "nwse-resize", x: 1,   y: 1,   w: 12, h: 12, edge: "se" },
        { cursor: "ns-resize",   x: 0.5, y: 0,   w: 20, h: 10, edge: "n" },
        { cursor: "ns-resize",   x: 0.5, y: 1,   w: 20, h: 10, edge: "s" },
        { cursor: "ew-resize",   x: 0,   y: 0.5, w: 10, h: 20, edge: "w" },
        { cursor: "ew-resize",   x: 1,   y: 0.5, w: 10, h: 20, edge: "e" }
    ];

    handles.forEach(h => {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = h.w + "px";
        div.style.height = h.h + "px";
        div.style.cursor = h.cursor;
        div.style.background = "rgba(0,255,0,0.35)";
        div.style.zIndex = "999999";
        div.style.left = `calc(${h.x * 100}% - ${h.w / 2}px)`;
        div.style.top = `calc(${h.y * 100}% - ${h.h / 2}px)`;
        panel.appendChild(div);

        let resizing = false;
        let startX, startY, startW, startH, startL, startT, currentEdge;

        div.addEventListener("mousedown", e => {
            e.preventDefault();
            resizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = panel.offsetWidth;
            startH = panel.offsetHeight;
            startL = panel.offsetLeft;
            startT = panel.offsetTop;
            currentEdge = h.edge;
        });

        document.addEventListener("mousemove", e => {
            if (!resizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (currentEdge.includes("e")) panel.style.width = startW + dx + "px";
            if (currentEdge.includes("s")) panel.style.height = startH + dy + "px";
            if (currentEdge.includes("w")) { panel.style.width = startW - dx + "px"; panel.style.left = startL + dx + "px"; }
            if (currentEdge.includes("n")) { panel.style.height = startH - dy + "px"; panel.style.top = startT + dy + "px"; }
        });

        document.addEventListener("mouseup", () => resizing = false);
    });
})();


// === Smart proximity fade in/out ===
(function () {
    const panel = document.getElementById("minefun-king-status");
    if (!panel) return;

    panel.style.transition = "opacity 0.35s ease";
    panel.style.opacity = "0";

    const ACTIVE_DISTANCE = 50;
    let forceVisible = false;

    function show() { panel.style.opacity = "1"; }
    function hide() { if (!forceVisible) panel.style.opacity = "0"; }

    document.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance <= ACTIVE_DISTANCE) show(); else hide();
    });

    panel.addEventListener("mousedown", () => { forceVisible = True; show(); });
    document.addEventListener("mouseup", () => { forceVisible = False; });
})();


// === Smart proximity fade in/out with 1s delay fade-out ===
(function () {
    const panel = document.getElementById("minefun-king-status");
    if (!panel) return;

    panel.style.transition = "opacity 0.35s ease";
    panel.style.opacity = "0";

    const ACTIVE_DISTANCE = 50;
    let forceVisible = false;
    let hideTimer = null;

    function show() {
        clearTimeout(hideTimer);
        panel.style.opacity = "1";
    }

    function hide() {
        if (!forceVisible) {
            hideTimer = setTimeout(() => {
                panel.style.opacity = "0";
            }, 1000);
        }
    }

    document.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance <= ACTIVE_DISTANCE) show(); else hide();
    });

    panel.addEventListener("mousedown", () => { forceVisible = true; show(); });
    document.addEventListener("mouseup", () => { forceVisible = false; hide(); });
})();


// === External indicator dot when panel hidden ===
(function () {
    const panel = document.getElementById("minefun-king-status");
    if (!panel) return;

    // create external dot
    const dot = document.createElement("div");
    dot.style.position = "fixed";
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.background = "#00ff00";
    dot.style.boxShadow = "0 0 6px #00ff00";
    dot.style.transition = "opacity 0.3s ease";
    dot.style.opacity = "1";
    dot.style.zIndex = "9999999";
    document.body.appendChild(dot);

    function updateDotPosition() {
        const rect = panel.getBoundingClientRect();
        dot.style.left = (rect.right - 4) + "px";
        dot.style.top = (rect.top - 4) + "px";
    }
    updateDotPosition();
    window.addEventListener("resize", updateDotPosition);
    window.addEventListener("scroll", updateDotPosition);

    // observer to update position on style changes (drag, resize)
    const obs = new MutationObserver(updateDotPosition);
    obs.observe(panel, { attributes: true, attributeFilter: ["style"] });

    // sync dot visibility with panel opacity
    const obs2 = new MutationObserver(() => {
        if (panel.style.opacity === "1") dot.style.opacity = "0";
        else dot.style.opacity = "1";
    });
    obs2.observe(panel, { attributes: true, attributeFilter: ["style"] });
})();

/**************** MineFunreg Script ****************/

// ==/UserScript==

(() => {
    "use strict";
    var __webpack_modules__ = {
            679: (e, t, n) => {
                n.d(t, {
                    A: () => r
                });
                var o = n(601),
                    s = n.n(o),
                    i = n(314),
                    a = n.n(i)()(s());
                a.push([e.id, "@font-face {\n    font-family: \"Product Sans\";\n    src: url(https://fonts.gstatic.com/s/productsans/v19/pxiDypQkot1TnFhsFMOfGShVF9eO.woff2);\n}\n\n:root {\n    --Minebuns-accent-color: linear-gradient(90deg, rgb(64, 190, 255) 0%, rgb(129, 225, 255) 100%);\n    --button-color: rgb(40, 40, 40, 0.9);\n    --hover-color: rgb(50, 50, 50, 0.9);\n    --panel-bg: rgb(34, 34, 34, 0.85);\n    --panel-bg: rgb(10, 10, 10, 0.85);\n    --text-color: #ffffff;\n    --header-text-size: 25px;\n    --button-text-size: 20px;\n    --setting-text-size: 15px;\n}\n\n.gui-panel {\n    position: fixed;\n    z-index: 1000;\n    width: 200px;\n    border-radius: 8px;\n    background-color: var(--panel-bg);\n    box-shadow: 0 4px 8px rgba(0,0,0,0.3);\n    font-family: 'Product Sans', sans-serif;\n    color: var(--text-color);\n    overflow: hidden;\n}\n\n.gui-header {\n    background-color: var(--header-bg);\n    height: 40px;\n    font-weight: 900;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: var(--header-text-size);\n    cursor: grab;\n}\n\n.gui-header:active {\n    cursor: grabbing;\n}\n\n.gui-button {\n    height: 35px;\n    display: flex;\n    align-items: center;\n    padding-left: 10px;\n    box-sizing: border-box;\n    cursor: pointer;\n    border-radius: 0;\n    transition: all 0.3s;\n    font-size: var(--button-text-size);\n    font-weight: 200;\n    outline: none;\n    background: var(--button-color);\n    color: var(--text-color);\n}\n\n.gui-button.enabled {\n    background: var(--Minebuns-accent-color);\n}\n\n.gui-button:not(.enabled):hover {\n    background: var(--hover-color);\n}\n\n.gui-background {\n    position: absolute;\n    left: 0;\n    top: 0;\n    z-index: 999;\n    height: 100%;\n    width: 100%;\n    backdrop-filter: blur(15px);\n    background: rgba(0, 0, 0, 0.3);\n}\n\n.gui-setting-container {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    background-color: var(--panel-bg);\n    padding: 2px;\n}\n\n.gui-setting-label {\n    font-size: var(--setting-text-size);\n    margin-left: 10px;\n    font-weight: 300;\n    color: var(--text-color);\n}\n\n.gui-checkbox {\n    width: 15px;\n    height: 15px;\n    border-radius: 4px;\n    background: var(--button-color);\n    position: relative;\n    margin: 8px;\n    cursor: pointer;\n    transition: background 0.3s;\n}\n\n.gui-checkbox.enabled {\n    background: var(--Minebuns-accent-color);\n}\n\n.gui-color-picker {\n    width: 15px;\n    height: 15px;\n    border-radius: 4px;\n    position: relative;\n    margin: 8px;\n    cursor: pointer;\n}\n\n.gui-color-input {\n    width: 20px;\n    height: 20px;\n    opacity: 0;\n    cursor: pointer;\n}\n\n.gui-button-container {\n    background-color: var(--panel-bg);\n    display: flex;\n    flex-direction: column;\n}\n\n.gui-text-input {\n    background: var(--button-color);\n    border: none;\n    color: var(--text-color);\n    font-family: 'Product Sans', sans-serif;\n    font-size: var(--setting-text-size);\n    width: 40px;\n    border-radius: 4px;\n    outline: none;\n    transition: background 0.3s;\n    text-align: center;\n    margin: 5px;\n    margin-right: 10px;\n}\n\n.gui-text-input:hover {\n    background: var(--hover-color);\n}\n\n.gui-text-input:focus {\n    background: var(--hover-color);\n}\n\n.with-animations .gui-panel {\n    animation: fadeInScale 0.3s ease-out;\n}\n\n@keyframes fadeInScale {\n    from {\n        opacity: 0;\n        transform: scale(0.9);\n    }\n    to {\n        opacity: 1;\n        transform: scale(1);\n    }\n}\n\n.with-animations .gui-background {\n    animation: fadeIn 0.3s ease-out;\n}\n\n@keyframes fadeIn {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n.with-animations .gui-button {\n    transition: transform 0.2s ease, background 0.2s ease;\n}\n\n.with-animations .gui-button:hover {\n    transform: scale(1.01);\n}\n\n.with-animations .gui-setting-container {\n    will-change: transform, opacity;\n    transform-origin: top;\n    animation: slideDown 0.25s ease-out forwards;\n}\n\n@keyframes slideDown {\n    from {\n        opacity: 0;\n        transform: scaleY(0.8);\n    }\n    to {\n        opacity: 1;\n        transform: scaleY(1);\n    }\n}\n", ""]);
                const r = a
            },
            314: e => {
                e.exports = function(e) {
                    var t = [];
                    return t.toString = function() {
                        return this.map((function(t) {
                            var n = "",
                                o = void 0 !== t[5];
                            return t[4] && (n += "@supports (".concat(t[4], ") {")), t[2] && (n += "@media ".concat(t[2], " {")), o && (n += "@layer".concat(t[5].length > 0 ? " ".concat(t[5]) : "", " {")), n += e(t), o && (n += "}"), t[2] && (n += "}"), t[4] && (n += "}"), n
                        })).join("")
                    }, t.i = function(e, n, o, s, i) {
                        "string" == typeof e && (e = [
                            [null, e, void 0]
                        ]);
                        var a = {};
                        if (o)
                            for (var r = 0; r < this.length; r++) {
                                var l = this[r][0];
                                null != l && (a[l] = !0)
                            }
                        for (var d = 0; d < e.length; d++) {
                            var c = [].concat(e[d]);
                            o && a[c[0]] || (void 0 !== i && (void 0 === c[5] || (c[1] = "@layer".concat(c[5].length > 0 ? " ".concat(c[5]) : "", " {").concat(c[1], "}")), c[5] = i), n && (c[2] ? (c[1] = "@media ".concat(c[2], " {").concat(c[1], "}"), c[2] = n) : c[2] = n), s && (c[4] ? (c[1] = "@supports (".concat(c[4], ") {").concat(c[1], "}"), c[4] = s) : c[4] = "".concat(s)), t.push(c))
                        }
                    }, t
                }
            },
            601: e => {
                e.exports = function(e) {
                    return e[1]
                }
            },
            72: e => {
                var t = [];

                function n(e) {
                    for (var n = -1, o = 0; o < t.length; o++)
                        if (t[o].identifier === e) {
                            n = o;
                            break
                        } return n
                }

                function o(e, o) {
                    for (var i = {}, a = [], r = 0; r < e.length; r++) {
                        var l = e[r],
                            d = o.base ? l[0] + o.base : l[0],
                            c = i[d] || 0,
                            u = "".concat(d, " ").concat(c);
                        i[d] = c + 1;
                        var p = n(u),
                            h = {
                                css: l[1],
                                media: l[2],
                                sourceMap: l[3],
                                supports: l[4],
                                layer: l[5]
                            };
                        if (-1 !== p) t[p].references++, t[p].updater(h);
                        else {
                            var m = s(h, o);
                            o.byIndex = r, t.splice(r, 0, {
                                identifier: u,
                                updater: m,
                                references: 1
                            })
                        }
                        a.push(u)
                    }
                    return a
                }

                function s(e, t) {
                    var n = t.domAPI(t);
                    return n.update(e),
                        function(t) {
                            if (t) {
                                if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap && t.supports === e.supports && t.layer === e.layer) return;
                                n.update(e = t)
                            } else n.remove()
                        }
                }
                e.exports = function(e, s) {
                    var i = o(e = e || [], s = s || {});
                    return function(e) {
                        e = e || [];
                        for (var a = 0; a < i.length; a++) {
                            var r = n(i[a]);
                            t[r].references--
                        }
                        for (var l = o(e, s), d = 0; d < i.length; d++) {
                            var c = n(i[d]);
                            0 === t[c].references && (t[c].updater(), t.splice(c, 1))
                        }
                        i = l
                    }
                }
            },
            659: e => {
                var t = {};
                e.exports = function(e, n) {
                    var o = function(e) {
                        if (void 0 === t[e]) {
                            var n = document.querySelector(e);
                            if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
                                n = n.contentDocument.head
                            } catch (e) {
                                n = null
                            }
                            t[e] = n
                        }
                        return t[e]
                    }(e);
                    if (!o) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                    o.appendChild(n)
                }
            },
            540: e => {
                e.exports = function(e) {
                    var t = document.createElement("style");
                    return e.setAttributes(t, e.attributes), e.insert(t, e.options), t
                }
            },
            56: (e, t, n) => {
                e.exports = function(e) {
                    var t = n.nc;
                    t && e.setAttribute("nonce", t)
                }
            },
            825: e => {
                e.exports = function(e) {
                    if ("undefined" == typeof document) return {
                        update: function() {},
                        remove: function() {}
                    };
                    var t = e.insertStyleElement(e);
                    return {
                        update: function(n) {
                            ! function(e, t, n) {
                                var o = "";
                                n.supports && (o += "@supports (".concat(n.supports, ") {")), n.media && (o += "@media ".concat(n.media, " {"));
                                var s = void 0 !== n.layer;
                                s && (o += "@layer".concat(n.layer.length > 0 ? " ".concat(n.layer) : "", " {")), o += n.css, s && (o += "}"), n.media && (o += "}"), n.supports && (o += "}");
                                var i = n.sourceMap;
                                i && "undefined" != typeof btoa && (o += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i)))), " */")), t.styleTagTransform(o, e, t.options)
                            }(t, e, n)
                        },
                        remove: function() {
                            ! function(e) {
                                if (null === e.parentNode) return !1;
                                e.parentNode.removeChild(e)
                            }(t)
                        }
                    }
                }
            },
            113: e => {
                e.exports = function(e, t) {
                    if (t.styleSheet) t.styleSheet.cssText = e;
                    else {
                        for (; t.firstChild;) t.removeChild(t.firstChild);
                        t.appendChild(document.createTextNode(e))
                    }
                }
            },
            548: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                __webpack_require__.d(__webpack_exports__, {
                    A: () => __WEBPACK_DEFAULT_EXPORT__
                });
                const __WEBPACK_DEFAULT_EXPORT__ = {
                    init: async function() {
                        let safeImport = src => eval(`(async () => { return await import("${src}")})()`),
                            preloadedModules = Array.from(document.querySelectorAll('link[rel="modulepreload"]')).map((e => e.href));
                        preloadedModules.push(Object.values(document.scripts).find((e => e?.src?.includes(location.origin))).src);
                        let importedModules = await Promise.all(preloadedModules.map((e => safeImport(e)))),
                            allModuleExports = importedModules.flatMap((e => Object.values(e)));
                        this.stores = Object.values(allModuleExports).filter((e => e?.$id)).reduce(((e, t) => (e[t.$id] = t(), e)), {}), this.network = Object.values(allModuleExports).find((e => e?.service))
                    },
                    get gameWorld() {
                        return this?.stores?.gameState?.gameWorld || null
                    }
                }
            }
        },
        __webpack_module_cache__ = {};

    function __webpack_require__(e) {
        var t = __webpack_module_cache__[e];
        if (void 0 !== t) return t.exports;
        var n = __webpack_module_cache__[e] = {
            id: e,
            exports: {}
        };
        return __webpack_modules__[e](n, n.exports, __webpack_require__), n.exports
    }
    __webpack_require__.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return __webpack_require__.d(t, {
            a: t
        }), t
    }, __webpack_require__.d = (e, t) => {
        for (var n in t) __webpack_require__.o(t, n) && !__webpack_require__.o(e, n) && Object.defineProperty(e, n, {
            enumerable: !0,
            get: t[n]
        })
    }, __webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), __webpack_require__.nc = void 0;
    var __webpack_exports__ = {};
    const events = {
        listeners: {},
        activeKeys: new Set,
        on: function(e, t) {
            this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t)
        },
        remove: function(e, t) {
            this.listeners[e] && (this.listeners[e] = this.listeners[e].filter((e => e !== t)))
        },
        emit: function(e, t) {
            this.listeners[e] && this.listeners[e].forEach((e => e(t)))
        },
        trackKey: function(e, t, n) {
            "keydown" === e && moduleManager.handleKeyPress(n), "keydown" !== e || this.activeKeys.has(t) || (this.activeKeys.add(t), this.emit("keyPress", {
                key: t,
                code: n
            })), "keyup" === e && this.activeKeys.has(t) && (this.activeKeys.delete(t), this.emit("keyRelease", {
                key: t,
                code: n
            }))
        }
    };
    class Module {
        constructor(e, t, n, o) {
            this.name = e, this.category = t, this.options = n, this.keybind = o, this.waitingForBind = !1, this.isEnabled = !1, this.toggle = this.toggle.bind(this)
        }
        onEnable() {}
        onDisable() {}
        onRender() {}
        onSettingUpdate() {}
        enable() {
            this.isEnabled = !0, events.emit("module.update", this), this.onEnable()
        }
        disable() {
            this.isEnabled = !1, events.emit("module.update", this), this.onDisable()
        }
        toggle() {
            this.isEnabled ? this.disable() : this.enable()
        }
    }
    class ArrayList extends Module {
        constructor() {
            super("Arraylist", "Visual"), this.namesMap = {}, this.arraylistContainer = null, this.initialized = !1
        }
        update(e, t) {
            if (t) {
                if (!this.namesMap[e]) {
                    let t = document.createElement("div");
                    t.style.backgroundColor = "rgba(10, 10, 10, 0.7)", t.style.color = "white", t.style.padding = "2px 10px 2px 10px", t.style.display = "flex", t.style.alignItems = "center", t.style.boxSizing = "border-box", t.style.margin = "0", t.style.fontFamily = "'Product Sans', sans-serif", t.style.boxShadow = "rgb(0, 0, 0, 0.05) -5px 1px", t.style.transition = "max-height 0.2s ease-in-out, opacity 0.2s ease-in-out", t.style.overflow = "hidden", t.style.maxHeight = "0", t.style.opacity = "0";
                    let n = document.createElement("span");
                    n.style.fontWeight = "800", n.style.fontSize = "16px", n.style.backgroundImage = "var(--Minebuns-accent-color)", n.style.color = "transparent", n.style.backgroundClip = "text", n.innerHTML = e, t.appendChild(n), this.arraylistContainer.appendChild(t), setTimeout((() => {
                        t.style.maxHeight = "50px", t.style.opacity = "1"
                    }), 1), this.namesMap[e] = t
                }
            } else if (this.namesMap[e]) {
                const t = this.namesMap[e];
                t.style.maxHeight = "0", t.style.opacity = "0", setTimeout((() => {
                    this.arraylistContainer.removeChild(t), delete this.namesMap[e]
                }), 5)
            }
            const n = Object.values(this.namesMap).sort(((e, t) => this.measureElementWidth(t) - this.measureElementWidth(e)));
            this.arraylistContainer.innerHTML = "", n.forEach((e => {
                this.arraylistContainer.appendChild(e)
            }))
        }
        onEnable() {
            this.initialized ? this.arraylistContainer.style.opacity = "1" : (this.arraylistContainer = document.createElement("div"), this.arraylistContainer.style.flexDirection = "column", this.arraylistContainer.style.position = "absolute", this.arraylistContainer.style.zIndex = "1000", this.arraylistContainer.style.display = "flex", this.arraylistContainer.style.right = "5px", this.arraylistContainer.style.top = "5px", this.arraylistContainer.style.alignItems = "flex-end", this.arraylistContainer.style.pointerEvents = "none", this.arraylistContainer.style.textTransform = "lowercase", this.arraylistContainer.style.border = "2px solid transparent", this.arraylistContainer.style.borderImage = "var(--Minebuns-accent-color)", this.arraylistContainer.style.borderImageSlice = "1", this.arraylistContainer.style.borderBottom = "0", this.arraylistContainer.style.borderLeft = "0", document.body.appendChild(this.arraylistContainer), events.on("module.update", (e => {
                this.update(e.name, e.isEnabled)
            })), this.initialized = !0)
        }
        measureElementWidth(e) {
            return e.getBoundingClientRect().width
        }
        onDisable() {
            this.arraylistContainer.style.opacity = "0"
        }
    }
    var hooks = __webpack_require__(548);
    class Watermark extends Module {
        constructor() {
            super("Watermark", "Visual", {
                Text: "Minebuns"
            })
        }
        onSettingUpdate() {
            let e = document.querySelector(".Minebuns-overlay-title");
            e && (e.textContent = this.options.Text)
        }
        onEnable() {
            let e = document.querySelector(".Minebuns-overlay-title");
            e || (e = document.createElement("div"), e.className = "Minebuns-overlay-title", e.textContent = this.options.Text, e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.padding = "0.5em", e.style.userSelect = "none", e.style.display = "none", e.style.zIndex = "1000", e.style.textShadow = "var(--Minebuns-accent-color) 0px 0px 10px", e.style.fontFamily = "'Product Sans', sans-serif", e.style.fontSize = "24px", e.style.background = "var(--Minebuns-accent-color)", e.style.backgroundClip = "text", e.style.webkitFontSmoothing = "antialiased", e.style.webkitTextFillColor = "transparent", document.body.appendChild(e)), document.querySelector(".Minebuns-overlay-title").style.display = "flex"
        }
        onDisable() {
            document.querySelector(".Minebuns-overlay-title").style.display = "none"
        }
    }
    class ModuleSettings {
        constructor(e, t) {
            this.module = e, this.container = t, this.components = [], this.initialized = !1, this.isOpen = !1
        }
        initialize() {
            !this.initialized && this.module?.options && (Object.keys(this.module.options).forEach((e => {
                const t = this.module.options[e],
                    n = typeof t;
                e.toLowerCase().includes("color") ? this.addColorPicker(e) : "boolean" === n || "true" === t || "false" === t ? this.addCheckbox(e) : "string" === n ? this.addStringInput(e) : this.addNumberInput(e)
            })), this.components.forEach((e => e.style.display = "none")), this.initialized = !0)
        }
        toggle() {
            this.isOpen = !this.isOpen, this.components.forEach((e => {
                e.style.display = this.isOpen ? "flex" : "none", this.isOpen ? this.container.style.marginBottom = "5px" : this.container.style.marginBottom = "0px"
            }))
        }
        addNumberInput(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("input");
            o.type = "text", o.className = "gui-text-input", o.value = this.module.options[e];
            let s = o.value;
            o.addEventListener("input", (() => {
                const t = o.value.trim();
                isNaN(t) || "" === t || (s = t, this.module.options[e] = t, events.emit("setting.update", this.module))
            })), o.addEventListener("blur", (() => {
                (isNaN(o.value) || "" === o.value.trim()) && (o.value = s)
            })), o.addEventListener("keydown", (e => {
                "Enter" === e.key && o.blur()
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
        addStringInput(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("input");
            o.type = "text", o.className = "gui-text-input", o.value = this.module.options[e], o.addEventListener("input", (() => {
                const t = o.value.trim();
                this.module.options[e] = t, events.emit("setting.update", this.module)
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
        addCheckbox(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("div");
            o.className = "gui-checkbox", o.classList.toggle("enabled", !0 === this.module.options[e] || "true" === this.module.options[e]), o.addEventListener("click", (() => {
                const t = o.classList.contains("enabled");
                o.classList.toggle("enabled"), this.module.options[e] = (!t).toString(), events.emit("setting.update", this.module)
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
        addColorPicker(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("div");
            o.className = "gui-color-picker", o.style.background = this.module.options[e];
            const s = document.createElement("input");
            s.type = "color", s.className = "gui-color-input", o.appendChild(s), s.addEventListener("input", (t => {
                o.style.background = t.target.value, this.module.options[e] = t.target.value, events.emit("setting.update", this.module)
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
    }
    class Panel {
        constructor(e, t = {
            top: "200px",
            left: "200px"
        }) {
            this.panel = document.createElement("div"), this.panel.className = "gui-panel", this.panel.style.top = t.top, this.panel.style.left = t.left, this.header = document.createElement("div"), this.header.className = "gui-header", this.header.textContent = e, this.panel.appendChild(this.header), document.body.appendChild(this.panel), this.buttons = [], this.setupDragHandling()
        }
        setupDragHandling() {
            let e = !1,
                t = {
                    x: 0,
                    y: 0
                };
            this.header.addEventListener("mousedown", (n => {
                e = !0, t.x = n.clientX - this.panel.offsetLeft, t.y = n.clientY - this.panel.offsetTop
            })), document.addEventListener("mousemove", (n => {
                e && (this.panel.style.left = n.clientX - t.x + "px", this.panel.style.top = n.clientY - t.y + "px")
            })), document.addEventListener("mouseup", (() => e = !1))
        }
        addButton(e) {
            const t = document.createElement("div");
            t.className = "gui-button-container";
            const n = document.createElement("div");
            n.className = "gui-button " + (e.isEnabled ? "enabled" : ""), n.textContent = e.name;
            const o = new ModuleSettings(e, t);
            return n.addEventListener("mousedown", (t => {
                0 === t.button && (e.toggle(), n.classList.toggle("enabled", e.isEnabled)), 1 === t.button && (n.textContent = "waiting for bind..", e.waitingForBind = !0)
            })), n.addEventListener("contextmenu", (e => {
                e.preventDefault(), o.initialize(), o.toggle()
            })), n.setAttribute("tabindex", -1), n.addEventListener("keydown", (t => {
                n.textContent = e.name, e.waitingForBind && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), "Escape" === t.key ? e.keybind = null : e.keybind = String(t.code), e.waitingForBind = !1)
            })), t.appendChild(n), this.panel.appendChild(t), this.buttons.push(n), n
        }
        show() {
            this.panel.style.display = "block"
        }
        hide() {
            this.panel.style.display = "none"
        }
    }
    var injectStylesIntoStyleTag = __webpack_require__(72),
        injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag),
        styleDomAPI = __webpack_require__(825),
        styleDomAPI_default = __webpack_require__.n(styleDomAPI),
        insertBySelector = __webpack_require__(659),
        insertBySelector_default = __webpack_require__.n(insertBySelector),
        setAttributesWithoutAttributes = __webpack_require__(56),
        setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes),
        insertStyleElement = __webpack_require__(540),
        insertStyleElement_default = __webpack_require__.n(insertStyleElement),
        styleTagTransform = __webpack_require__(113),
        styleTagTransform_default = __webpack_require__.n(styleTagTransform),
        clickgui = __webpack_require__(679),
        options = {};
    options.styleTagTransform = styleTagTransform_default(), options.setAttributes = setAttributesWithoutAttributes_default(), options.insert = insertBySelector_default().bind(null, "head"), options.domAPI = styleDomAPI_default(), options.insertStyleElement = insertStyleElement_default();
    var update = injectStylesIntoStyleTag_default()(clickgui.A, options);
    const styles_clickgui = clickgui.A && clickgui.A.locals ? clickgui.A.locals : void 0;
    class ClickGUI extends Module {
        constructor() {
            super("ClickGUI", "Visual", {
                "Accent Color 1": "rgb(64, 190, 255)",
                "Accent Color 2": "rgb(129, 225, 255)",
                "Button Color": "rgb(40, 40, 40, 0.9)",
                "Hover Color": "rgb(50, 50, 50, 0.9)",
                "Header Color": "rgb(0, 0, 0, 0.85)",
                "Panel Color": "rgb(18 18 18)",
                "Text Color": "#ffffff",
                "Enable Animations": !0
            }, "Comma"), this.GUILoaded = !1, this.panels = [], this.blurredBackground = null, this.updateColors()
        }
        updateAnimations() {
            this.options["Enable Animations"] ? document.body.classList.add("with-animations") : document.body.classList.remove("with-animations")
        }
        updateColors() {
            document.body.style.setProperty("--Minebuns-accent-color", `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`), document.body.style.setProperty("--button-color", this.options["Button Color"]), document.body.style.setProperty("--hover-color", this.options["Hover Color"]), document.body.style.setProperty("--header-bg", this.options["Header Color"]), document.body.style.setProperty("--panel-bg", this.options["Panel Color"]), document.body.style.setProperty("--text-color", this.options["Text Color"])
        }
        onEnable() {
            document.pointerLockElement && document.exitPointerLock(), this.GUILoaded ? (this.showGUI(), this.updateAnimations()) : (this.setupBackground(), this.createPanels(), this.setupEventListeners(), this.GUILoaded = !0, this.updateAnimations())
        }
        setupBackground() {
            this.blurredBackground = document.createElement("div"), this.blurredBackground.className = "gui-background", document.body.appendChild(this.blurredBackground)
        }
        createPanels() {
            this.panels.forEach((e => {
                e.panel && e.panel.parentNode && e.panel.parentNode.removeChild(e.panel)
            })), this.panels = [], [{
                title: "Combat",
                position: {
                    top: "100px",
                    left: "100px"
                }
            }, {
                title: "Movement",
                position: {
                    top: "100px",
                    left: "320px"
                }
            }, {
                title: "Visual",
                position: {
                    top: "100px",
                    left: "540px"
                }
            }, {
                title: "Misc",
                position: {
                    top: "100px",
                    left: "760px"
                }
            }].forEach((e => {
                const t = new Panel(e.title, e.position);
                this.panels.push(t)
            }));
            const e = {};
            Object.values(module_moduleManager.modules).forEach((t => {
                e[t.category] || (e[t.category] = []), e[t.category].push(t)
            })), Object.entries(e).forEach((([e, t]) => {
                const n = this.panels.find((t => t.header.textContent === e));
                n && (t.sort(((e, t) => t.name.length - e.name.length)), t.forEach((e => n.addButton(e))))
            }))
        }
        setupEventListeners() {
            events.on("module.update", (e => {
                const t = this.panels.find((t => t.header.textContent === e.category));
                if (!t) return;
                const n = t.buttons.find((t => t.textContent === e.name));
                n && n.classList.toggle("enabled", e.isEnabled)
            }))
        }
        showGUI() {
            this.panels.forEach((e => e.show())), this.blurredBackground.style.display = "block"
        }
        onDisable() {
            this.panels.forEach((e => e.hide())), this.blurredBackground.style.display = "none"
        }
        onSettingUpdate() {
            this.updateColors(), this.updateAnimations()
        }
    }
    class Airjump extends Module {
        constructor() {
            super("Airjump", "Movement", null)
        }
        onRender() {
            hooks.A?.gameWorld?.player && (hooks.A.gameWorld.player.collision.isGrounded = !0)
        }
    }
    class Instabreak extends Module {
        constructor() {
            super("Instabreak", "Misc", null), this.originalHardness = new Map
        }
        onEnable() {
            Object.values(hooks.A.gameWorld.items).forEach((e => {
                e?.destruction && (this.originalHardness.has(e) || this.originalHardness.set(e, e.destruction.durability), e.destruction.durability = 0)
            }))
        }
        onDisable() {
            Object.values(hooks.A.gameWorld.items).forEach((e => {
                e?.destruction && this.originalHardness.has(e) && (e.destruction.durability = this.originalHardness.get(e))
            }))
        }
    }
    class Nuker extends Module {
    constructor() {
        super("Nuker", "Misc", {
            Radius: 1,
            "Chunk Interval": 1000
        });
        this.lastExecutionTime = 0;
    }

    onRender() {
        const world = hooks.A?.gameWorld;
        if (!world?.player || !world?.chunkManager) return;

        // Garantir tipos numéricos
        const radius = Math.max(0, parseInt(this.options.Radius) || 0);
        const interval = Math.max(0, parseInt(this.options["Chunk Interval"]) || 1000);

        const now = Date.now();
        if (now - this.lastExecutionTime < interval) return;
        this.lastExecutionTime = now;

        // Extrai e floor das coordenadas do jogador corretamente
        const playerPos = world.player.position;
        const playerX = Math.floor(playerPos.x);
        const playerY = Math.floor(playerPos.y);
        const playerZ = Math.floor(playerPos.z);

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {

                    const x = playerX + dx;
                    const y = playerY + dy;
                    const z = playerZ + dz;

                    // NÃO destruir **nenhum** bloco que esteja exatamente uma unidade abaixo dos pés do jogador
                    if (y === playerY - 1) continue;

                    try {
                        const block = world.chunkManager.getBlock(x, y, z);
                        if (block !== 0) {
                            world.chunkManager.setBlock(x, y, z, 0, true, true);
                        }
                    } catch (err) {
                        // falhas silenciosas para não quebrar o loop (p.ex. coordenadas fora do mapa)
                        //console.warn("Nuker: erro ao acessar bloco", x,y,z, err);
                    }
                }
            }
        }
    }
}


    class AdBypass extends Module {
        constructor() {
            super("AdBypass", "Misc")
        }
        onEnable() {
            this._reward = this._reward || hooks.A.stores.adsStore.rewardCommercialVideoWrapper, hooks.A.stores.adsStore.rewardCommercialVideoWrapper = () => !0
        }
        onDisable() {
            hooks.A.stores.adsStore.rewardCommercialVideoWrapper = this._reward;
        }
    }


class Fly extends Module {
    constructor() {
        super("Fly", "Movement", {
            "Vertical Speed": 5
        });
        this.toggleKey = "KeyF"; // Tecla para ativar/desativar (F)
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (e.code === this.toggleKey && !e.repeat) {
            this.toggle(); // ativa ou desativa o módulo
        }
    }

    onRender() {
        const player = hooks.A?.gameWorld?.player;
        if (!player) return;

        player.velocity.gravity = 0;

        if (player.inputs.jump) {
            player.velocity.velVec3.y = this.options["Vertical Speed"];
        } else if (player.inputs.crouch) {
            player.velocity.velVec3.y = -this.options["Vertical Speed"];
        } else {
            player.velocity.velVec3.y = 0;
        }
    }

    onDisable() {
        const player = hooks.A?.gameWorld?.player;
        if (player) player.velocity.gravity = 23;
    }
}
    class Speed extends Module {
        constructor() {
            super("Speed", "Movement", {
                Speed: 6
            })
        }
        onRender() {
            hooks.A?.gameWorld?.player && (hooks.A.gameWorld.player.velocity.moveSpeed = this.options.Speed, hooks.A.gameWorld.player.velocity.fastMoveSpeed = this.options.Speed)
        }
        onDisable() {
            hooks.A.gameWorld.player.velocity.moveSpeed = 4.5, hooks.A.gameWorld.player.velocity.fastMoveSpeed = 6.4
        }
    }


    class FreeMinebucks extends Module {
        constructor() {
            super("Minebucks", "Misc")
        }
        onEnable() {
            hooks.A.network.get("/users/freeHeadcoins"), hooks.A.stores.userState.user.balance.minebucks += 10, module_moduleManager.modules.minebucks.disable()
        }
    }

    class FreeSpins extends Module {
        constructor() {
            super("freeSpins", "Misc")
        }
        onEnable() {
            hooks.A.network.get("/users/freeSpinner"), hooks.A.stores.userState.user.balance.freeSpinner += 10, module_moduleManager.modules.freeSpinner.disable()
        }
    }



    class FreeHeadcoins extends Module {
        constructor() {
            super("FreeHeadcoins", "Misc")
        }
        onEnable() {
            hooks.A.network.get("/users/freeHeadcoins"), hooks.A.stores.userState.user.balance.headcoins += 10, module_moduleManager.modules.FreeHeadcoins.disable()
        }
    }
    class Fill extends Module {
        constructor() {
            super("Fill", "Misc", {
                Radius: 4,
                "Block ID": 472,
                "Chunk Interval": 500
            }), this.lastExecutionTime = 0
        }
        onRender() {
            if (!hooks.A?.gameWorld?.player) return;
            let e = this.options.Radius;
            const t = this.options["Chunk Interval"],
                n = Date.now();
            if (n - this.lastExecutionTime >= t) {
                this.lastExecutionTime = n;
                let t = Object.values(hooks.A.gameWorld.player.position).splice(0, 3).map(Math.floor);
                for (let n = -e; n <= e; n++)
                    for (let o = -e; o <= e; o++)
                        for (let s = -e; s <= e; s++) {
                            const [e, i, a] = [t[0] + n, t[1] + o, t[2] + s];
                            0 == hooks.A.gameWorld.chunkManager.getBlock(e, i, a) && hooks.A.gameWorld.chunkManager.setBlock(e, i, a, this.options["Block ID"], !0, !0)
                        }
            }
        }
    }
    class Chams extends Module {
    constructor() {
        super("Chams", "Visual", null);
    }

    onRender() {
        try {
            hooks.A?.gameWorld?.server?.players.forEach((plr) => {
                plr.playerMaterial.depthTest = false;
                if (plr.isHided) plr.model.visible = true;
            });
        } catch {}
    }

    onDisable() {
        try {
            hooks.A?.gameWorld?.server?.players.forEach((plr) => {
                plr.playerMaterial.depthTest = true;
            });
        } catch {}
    }
}
    class FOVChanger extends Module {
    constructor() {
        super("FOVChanger", "Visual", {
            FOV: 120
        });
        this.originalFOV = null;
    }

    onEnable() {
        let cam = hooks.A?.gameWorld?.threeScene?.camera;
        if (cam) {
            this.originalFOV = cam.fov; // salva o FOV original
        }
    }

    onRender() {
        let cam = hooks.A?.gameWorld?.threeScene?.camera;
        if (!cam) return;

        const newFOV = parseFloat(this.options.FOV);
        if (cam.fov !== newFOV) {
            cam.fov = newFOV;
            cam.updateProjectionMatrix();
            hooks.A.gameWorld.player.settings.fov = newFOV;
        }
    }

    onDisable() {
        let cam = hooks.A?.gameWorld?.threeScene?.camera;
        if (cam && this.originalFOV) {
            cam.fov = this.originalFOV; // restaura o original
            cam.updateProjectionMatrix();
            hooks.A.gameWorld.player.settings.fov = this.originalFOV;
        }
    }
}
    class Scaffold extends Module {
        constructor() {
            super("Scaffold", "Movement", null)
        }
        onRender() {
            if (!hooks.A?.gameWorld?.player) return;
            let e = Object.values(hooks.A.gameWorld.player.position).splice(0, 3).map(Math.floor);
            e[1]--;
            let t = hooks.A.gameWorld.player.currentInventoryItemId,
                n = hooks.A.gameWorld.chunkManager.getBlock(...e),
                o = hooks.A.gameWorld.items[n]?.replaceable || !1;
            (0 == n || o) && t && hooks.A.gameWorld.chunkManager.setBlock(...e, t, !0, !0)
        }
    }
    const mathUtils = {
            normalizeVector(e) {
                const t = e.x * e.x + e.y * e.y + e.z * e.z;
                if (t > 0) {
                    const n = 1 / Math.sqrt(t);
                    return [e.x * n, e.y * n, e.z * n]
                }
                return e
            },
            distanceBetween(e, t) {
                const n = t.x - e.x,
                    o = t.y - e.y,
                    s = t.z - e.z;
                return n * n + o * o + s * s
            },
            distanceBetweenSqrt(e, t) {
                return Math.sqrt(this.distanceBetween(e, t))
            },
            calculateDistance: (e, t) => Math.hypot(t.x - e.x, t.y - e.y, t.z - e.z)
        },
        gameUtils = {
            getClosestPlayer() {
                let e = hooks.A.gameWorld.player.position,
                    t = hooks.A.gameWorld.server.players,
                    n = [];
                return t.forEach((function(t, o) {
                    let s = mathUtils.distanceBetween(e, {
                        x: t._model.position.x,
                        y: t._model.position.y,
                        z: t._model.position.z
                    });
                    t.id = o, n.push({
                        player: t,
                        distance: s
                    })
                })), n.sort(((e, t) => e.distance - t.distance)), n.map((e => e.player))[0]
            },
            hexToRgb(e) {
                var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
                return t ? {
                    r: parseInt(t[1], 16),
                    g: parseInt(t[2], 16),
                    b: parseInt(t[3], 16)
                } : null
            }
        };
    class Killaura extends Module {
  constructor() {
    super("Killaura", "Combat", {
      "Y Offset": 1.62,
      Reach: 50,
      Delay: 10
    });
    this.lastExecutionTime = 0; // more explicit
  }

  onRender() {
    const now = Date.now();
    // garante que jogador exista e que passou o delay
    if (!hooks?.A?.gameWorld?.player) return;

    const delay = Number(this.options?.Delay) || 100;
    if (now - this.lastExecutionTime < delay) return;

    this.lastExecutionTime = now;
    try {
      this.tryKill();
    } catch (err) {
      console.error("Killaura.tryKill erro:", err);
    }
  }

  tryKill() {
    // protege e converte opções
    const reach = Number(this.options?.Reach) || 5;
    const yOffset = Number(this.options?.["Y Offset"]) || 1.62;

    // pega o alvo mais próximo (pode retornar null)
    const target = (typeof gameUtils !== "undefined" && gameUtils.getClosestPlayer)
      ? gameUtils.getClosestPlayer()
      : null;
    if (!target) return;

    // aceita model ou _model (compatibilidade)
    const targetModel = target.model || target._model || null;
    const s = targetModel?.position;
    if (!s) return; // sem posição do alvo, sai

    const me = hooks?.A?.gameWorld?.player;
    if (!me?.position) return;

    const origin = {
      x: me.position.x,
      y: me.position.y + yOffset,
      z: me.position.z
    };

    const dx = origin.x - s.x;
    const dy = origin.y - s.y;
    const dz = origin.z - s.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist === 0) return;

    // normaliza e inverte (mantive sua inversão)
    const nx = -dx / dist;
    const ny = -dy / dist;
    const nz = -dz / dist;

    if (dist < reach) {
      // tenta pegar sessionId ou id (compatibilidade)
      const targetId = target.sessionId ?? target.id ?? target.sid ?? null;
      // pacote 13 preservado (se você tiver packetsOut.HIT prefira usar)
      hooks.A.gameWorld.server.sendData(
        13,
        [
          hooks.A.gameWorld.time.localServerTimeMs,
          origin.x, origin.y, origin.z,
          nx, ny, nz,
          dist,
          targetId
        ]
      );
    }
  }
}

class KnockbackDisabler extends Module {
    constructor() {
        super("KnockbackDisabler", "Misc");

        // Configurações internas
        this.blocks = 10;     // knockback
        this.damage = 2;      // dano
    }

    applyKnockbackAndDamage(target, attacker) {
        let dx = target.x - attacker.x;
        let dy = target.y - attacker.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        if (!length) return;

        dx /= length;
        dy /= length;

        // Knockback
        target.x += dx * this.blocks;
        target.y += dy * this.blocks;

        // Dano
        if (typeof target.health === "number") {
            target.health -= this.damage;
            if (target.health < 0) target.health = 0;
        }
    }

    onRender() {
        // Simulação de evento "onHit"
        if (window.player && window.attacker && window.playerWasHit) {
            this.applyKnockbackAndDamage(window.player, window.attacker);

            // Reseta evento
            window.playerWasHit = false;
        }
    }
}


  class GunModifier extends Module {
    constructor() {
        super("GunModifier", "Combat", {
            "Spread": 0.0,
            "Bullets per shot": 1,
            "Bullet distance": 1000,
            "Reload Time": 1,
            "Recoil": 0,
            "isAuto": true
        });

        this.originalValuesMap = new Map(); // Salva os valores por arma
        this.toggleKey = "KeyJ"; // Tecla para ativar/desativar
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (e.code === this.toggleKey && !e.repeat) {
            this.toggle();
        }
    }

    get gunSystem() {
        return hooks.A.stores.gameState.gameWorld.systemsManager.activeSystems.find(e => e?.bulletsSystem);
    }

    backupGun(gun) {
        if (!this.originalValuesMap.has(gun)) {
            this.originalValuesMap.set(gun, {
                bulletsPerShot: gun.bulletsPerShot,
                isAuto: gun.isAuto,
                distance: gun.distance,
                startSpread: gun.startSpread,
                reloadTimeMs: gun.reloadTimeMs,
                recoilAttackY: gun.recoilAttackY,
                recoilAttackX: gun.recoilAttackX,
            });
        }
    }

    applyMods(gun) {
        gun.bulletsPerShot = this.options["Bullets per shot"];
        gun.isAuto = this.options["isAuto"];
        gun.distance = this.options["Bullet distance"];
        gun.startSpread = this.options["Spread"];
        gun.reloadTimeMs = this.options["Reload Time"];
        if (this.options["Recoil"] === 0) {
            gun.recoilAttackY = 0;
            gun.recoilAttackX = 0;
        }
    }

    onEnable() {
        const gun = this.gunSystem?.playerShooter?.currPlayerWeaponSpec;
        if (!gun) return;

        this.backupGun(gun);
        this.applyMods(gun);
    }

    onDisable() {
        const gun = this.gunSystem?.playerShooter?.currPlayerWeaponSpec;
        if (!gun) return;

        const original = this.originalValuesMap.get(gun);
        if (!original) return;

        // Restaura valores originais
        gun.bulletsPerShot = original.bulletsPerShot;
        gun.isAuto = original.isAuto;
        gun.distance = original.distance;
        gun.startSpread = original.startSpread;
        gun.reloadTimeMs = original.reloadTimeMs;
        gun.recoilAttackY = original.recoilAttackY;
        gun.recoilAttackX = original.recoilAttackX;

        // Remove backup (opcional)
        this.originalValuesMap.delete(gun);
    }
}

    class Disabler extends Module {
        constructor() {
            super("Disabler", "Misc"), this.packetID = null
        }
        insaneBypass() {}
        onRender() {
            if (!hooks.A?.gameWorld?.player) return;
            let e = hooks.A.stores.gameState.gameWorld.server.msgsListeners;
            this.packetID || (this.packetID = Object.keys(e).find((t => e[t].toString().includes("correct pos")))), e[this.packetID] !== this.insaneBypass && (e[this.packetID] = this.insaneBypass)
        }
    }
     class Aimbot extends Module {
        constructor() {
            super("Aimbot", "Combat", {
                "On Aim": "true",
                "On Shoot": "false",
                "Y Offset": .1
            }), this.lastExecutionTime = null
        }
        getClosestEnemy(e, t) {
            let n = null,
                o = 1 / 0;
            return t.forEach((t => {
                if (t?.model?.position && t.isAlive) {
                    let s = mathUtils.calculateDistance(e.position, t.model.position);
                    s < o && (o = s, n = t)
                }
            })), n
        }
        aimAtEnemy() {
            let e = hooks.A.stores.gameState,
                t = e.gameWorld.player,
                n = e.gameWorld.server.players;
            if (!t || !n) return;
            let o = this.getClosestEnemy(t, n);
            if (o) {
                let e = o.model.position,
                    n = t.position,
                    s = {
                        x: e.x - n.x,
                        z: e.z - n.z
                    },
                    i = Math.atan2(s.x, s.z),
                    a = parseFloat(this.options["Y Offset"]),
                    r = e.y + a - n.y,
                    l = Math.hypot(s.x, s.z),
                    d = Math.atan2(r, l);
                d = Math.max(Math.min(d, Math.PI / 2), -Math.PI / 2);
                let c = (i + Math.PI) % (2 * Math.PI);
                t.rotation.y = c, t.rotation.x = d
            }
        }
        onRender() {
            hooks.A?.stores?.gameState?.gameWorld?.server && ("true" == this.options["On Aim"] && hooks.A.stores.gameState.gameWorld.player.inputs.rightMB || "true" == this.options["On Shoot"] && hooks.A.stores.gameState.gameWorld.player.inputs.leftMB || "true" !== this.options["On Shoot"] && "true" !== this.options["On Aim"]) && this.aimAtEnemy()
        }
    }

    class NoClip extends Module {
    constructor() {
        super("NoClip", "Movement");
        this.toggleKey = "KeyG"; // Tecla para ativar/desativar (letra N)
        this._og = null;

        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (e.code === this.toggleKey && !e.repeat) {
            this.toggle();
        }
    }

    get playerPhysicsSystem() {
        return hooks.A?.gameWorld?.systemsManager?.activeSystems?.find((e => e?.playerPhysicsSystem))?.playerPhysicsSystem;
    }

    onRender() {
        const system = this.playerPhysicsSystem;
        if (!system || !hooks.A?.gameWorld?.player) return;

        if (!this._og) this._og = system.resolveBlockCollision;

        if (system.resolveBlockCollision === this._og) {
            system.resolveBlockCollision = () => {};
        }
    }

    onDisable() {
        const system = this.playerPhysicsSystem;
        if (system && this._og) {
            system.resolveBlockCollision = this._og;
        }
    }
}



    class HitAllModule extends Module {
    constructor() {
        super("1HitAll", "Combat", null, "KeyU"); // Atalho: tecla U
    }

    hitAll() {
        try {
        window.hooked.gameWorld.server.players.forEach(plr => {
            const { x, y, z } = plr.model.position;
            if (plr.hasOwnProperty('isBlock')) { // HNS
                if (plr.isHunter) return;
                window.hooked.gameWorld.server.sendData(packetsOut.HNS_ATTACK_BLOCK, [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, window.hooked.gameWorld.time.localServerTimeMs, plr.sessionId]);
            } if (plr.hasOwnProperty('isZombie')) { // Infection
                if (plr.isZombie) return;
                window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
            } else { // Other
                window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
            }
        });
    } catch {}
    }

    onEnable() {
        this.hitAll();
    }
}

class TeleportModule extends Module {
    constructor() {
        super("Teleport", "Misc");

        // Atalho fixo: tecla T (não ativa/desativa o módulo)
        this.key = "KeyT";

        document.addEventListener("keydown", (e) => {
            if (e.code === this.key && !e.repeat) {
                this.tpToSelectedBlock();
            }
        });
    }

    /** Função de teleporte */
    tp(x = 0, y = 0, z = 0, relative = true) {
        try {
            const player = hooks.A?.gameWorld?.player;
            if (!player) return;

            const position = player.position;
            if (relative) {
                position.x += x;
                position.y += y;
                position.z += z;
            } else {
                Object.assign(position, { x, y, z });
            }
            player.physicsPosComp.copyPos(position);
        } catch (err) {
            console.warn("Teleport falhou:", err);
        }
    }

    /** Teleporta até o bloco selecionado (crosshair) */
    tpToSelectedBlock() {
        try {
            const gameWorld = hooks.A?.gameWorld;
            if (!gameWorld) return;

            const outlineSystem = gameWorld.systemsManager.activeSystems.find(s => s.currBlockPos);
            if (!outlineSystem) return;

            outlineSystem.intersectAndShow(true, 500);
            if (!outlineSystem.currBlockPos) return;

            const { x, y, z } = outlineSystem.currBlockPos;
            this.tp(x, y + 1, z, false);
        } catch (err) {
            console.warn("Erro ao teleportar:", err);
        }
    }
}



     class HitModule extends Module {
    constructor() {
        super("2HitAll", "Combat", null, "KeyX"); // Atalho: tecla X
    }

    hitAll() {
        try {
            hooks.A?.gameWorld?.server?.players.forEach(plr => {
                const { x, y, z } = plr.model.position;

                if (plr.hasOwnProperty('isBlock')) { // HNS
                    if (plr.isHunter) return;
                    hooks.A.gameWorld.server.sendData(
                        packetsOut.HNS_ATTACK_BLOCK,
                        [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001,
                         hooks.A.gameWorld.time.localServerTimeMs, plr.sessionId]
                    );
                } else if (plr.hasOwnProperty('isZombie')) { // Infection
                    if (plr.isZombie) return;
                    hooks.A.gameWorld.server.sendData(
                        packetsOut.HIT,
                        [hooks.A.gameWorld.time.localServerTimeMs, x, y + 0.1, z,
                         0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]
                    );
                } else { // Other
                    hooks.A.gameWorld.server.sendData(
                        packetsOut.HIT,
                        [hooks.A.gameWorld.time.localServerTimeMs, x, y + 0.1, z,
                         0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]
                    );
                }
            });
        } catch {}
    }

    onEnable() {
        this.hitAll(); // executa quando ativado pelo menu ou tecla X
    }
}



class CustomCrosshair extends Module {
    constructor() {
        super("CustomCrosshair", "Visual", {
            Style: "myrrr"
        });
        this.crosshair = null;
    }

    createCrosshair() {
        if (this.crosshair) return;

        const crosshair = document.createElement("div");
        crosshair.id = "custom-crosshair";
        crosshair.style.position = "fixed";
        crosshair.style.top = "50%";
        crosshair.style.left = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.zIndex = "9999";
        crosshair.style.pointerEvents = "none";
        document.body.appendChild(crosshair);

        this.crosshair = crosshair;
    }

    clearCrosshair() {
        if (!this.crosshair) return;
        this.crosshair.innerHTML = "";
        this.crosshair.style.background = "";
        this.crosshair.style.border = "";
        this.crosshair.style.borderRadius = "";
        this.crosshair.style.filter = "";
        this.crosshair.style.width = "";
        this.crosshair.style.height = "";
        this.crosshair.style.maskImage = "";
        this.crosshair.style.webkitMaskImage = "";
        this.crosshair.style.display = "none";
    }

    applyCrosshair(style) {
        if (!this.crosshair) this.createCrosshair();
        this.clearCrosshair();

        this.crosshair.style.display = "flex";
        this.crosshair.style.alignItems = "center";
        this.crosshair.style.justifyContent = "center";

        switch (style) {
            case "myrrr":
                this.crosshair.style.width = "15px";
                this.crosshair.style.height = "15px";
                this.crosshair.style.filter = "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #ccf) drop-shadow(0 0 15px #ddf)";
                const horiz = document.createElement("div");
                Object.assign(horiz.style, {
                    position: "absolute",
                    width: "15px",
                    height: "4px",
                    background: "linear-gradient(to bottom, #ffffff, #e0ccff)",
                    borderRadius: "1px"
                });
                const vert = document.createElement("div");
                Object.assign(vert.style, {
                    position: "absolute",
                    width: "4px",
                    height: "15px",
                    background: "linear-gradient(to bottom, #ffffff, #e0ccff)",
                    borderRadius: "1px"
                });
                this.crosshair.appendChild(horiz);
                this.crosshair.appendChild(vert);
                break;

            case "dot":
                this.crosshair.style.width = "8px";
                this.crosshair.style.height = "8px";
                this.crosshair.style.borderRadius = "50%";
                this.crosshair.style.background = "#fff";
                this.crosshair.style.filter = "drop-shadow(0 0 4px #66f)";
                break;

            case "shotgun":
                this.crosshair.style.width = "20px";
                this.crosshair.style.height = "20px";
                this.crosshair.style.border = "2px solid #0ff";
                this.crosshair.style.borderRadius = "50%";
                this.crosshair.style.boxSizing = "border-box";
                this.crosshair.style.background = "rgba(255, 255, 255, 0.1)";
                this.crosshair.style.filter = "drop-shadow(0 0 6px #0ff)";
                break;

            case "ceborix":
            default:
                this.crosshair.style.width = "12px";
                this.crosshair.style.height = "12px";
                const horizC = document.createElement("div");
                Object.assign(horizC.style, {
                    position: "absolute",
                    width: "12px",
                    height: "4px",
                    background: "#fff",
                    borderRadius: "1px"
                });
                const vertC = document.createElement("div");
                Object.assign(vertC.style, {
                    position: "absolute",
                    width: "4px",
                    height: "12px",
                    background: "#fff",
                    borderRadius: "1px"
                });
                this.crosshair.appendChild(horizC);
                this.crosshair.appendChild(vertC);
                break;
        }
    }

    onEnable() {
        this.createCrosshair();
        this.applyCrosshair(this.options.Style);
    }

    onSettingUpdate() {
        this.applyCrosshair(this.options.Style);
    }

    onDisable() {
        if (this.crosshair) this.crosshair.style.display = "none";
    }
}

 class GhostMode extends Module {
    constructor() {
        super("GhostMode", "Movement", {
            Fade: true,
            Duration: 500
        });
        this.isGhost = false;
    }

    onEnable() {
        const player = hooks.A?.gameWorld?.player;
        if (!player || !player.model) return;
        const model = player.model;

        if (this.settings.Fade) {
            this.fadeModel(model, this.settings.Duration, false);
        } else {
            model.visible = false;
        }

        this.isGhost = true;
        console.log("[GhostMode] Modelo oculto localmente.");
    }

    onDisable() {
        const player = hooks.A?.gameWorld?.player;
        if (!player || !player.model) return;
        const model = player.model;

        if (this.settings.Fade) {
            this.fadeModel(model, this.settings.Duration, true);
        } else {
            model.visible = true;
        }

        this.isGhost = false;
        console.log("[GhostMode] Modelo visível novamente.");
    }

    // Função utilitária para fade in/out do modelo (educacional)
    fadeModel(model, duration = 600, visible = false) {
        if (!model) return;
        const meshes = [];
        model.traverse(obj => {
            if (obj.isMesh) {
                obj.material = obj.material.clone();
                obj.material.transparent = true;
                obj.material.depthWrite = false;
                meshes.push(obj);
            }
        });

        const start = performance.now();
        const from = visible ? 0 : 1;
        const to = visible ? 1 : 0;

        function animate(now) {
            const t = Math.min(1, (now - start) / duration);
            const value = from + (to - from) * t;
            meshes.forEach(m => {
                m.material.opacity = value;
                m.visible = value > 0.01;
            });
            if (t < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }
}


class NoFog extends Module {
    constructor() {
        super("NoFog", "Visual", null);
    }

    onRender() {
        try {
            if (hooks.A?.gameWorld?.threeScene?.scene?.fog) {
                Object.assign(
                    hooks.A.gameWorld.threeScene.scene.fog,
                    {
                        near: 9999,
                        far: 10000
                    }
                );
            }
        } catch {}
    }
}

    const module_moduleManager = {
        modules: {},
        addModules: function(...e) {
            for (const t of e) this.modules[t.name] = t
        },
        addModule: function(e) {
            this.modules[e.name] = e
        },
        handleKeyPress: function(e) {
            for (let t in this.modules) {
                let n = this.modules[t];
                n.waitingForBind ? (n.keybind = e, n.waitingForBind = !1) : n.keybind == e && n.toggle()
            }
        },
        init() {
            this.addModules(new ArrayList, new Watermark, new ClickGUI, new Airjump, new Instabreak, new Nuker, new AdBypass, new Fly, new Speed, new FreeHeadcoins, new FreeMinebucks, new FreeSpins, new Fill, new Chams, new FOVChanger, new Scaffold, new Killaura, new GunModifier, new Disabler, new GhostMode, new Aimbot, new NoClip, new HitAllModule, new TeleportModule, new NoFog, new CustomCrosshair, new HitModule, new KnockbackDisabler), events.on("render", (() => {
                for (let e in this.modules) this.modules[e].isEnabled && this.modules[e].onRender()
            })), events.on("keydown", this.handleKeyPress.bind(this)), events.on("setting.update", (() => {
                for (let e in this.modules) this.modules[e].isEnabled && this.modules[e].onSettingUpdate()
            })), this.modules.Arraylist.enable(), this.modules.Watermark.disable()
        }
    };
    class Minebuns {
        constructor() {
            this.version = "1.0.0", this.init()
        }
        init() {
            setInterval((() => {
                events.emit("render")
            }), 1e3 / 60), document.addEventListener("keydown", (e => {
                events.emit("keydown", e.code)
            })), hooks.A.init(), module_moduleManager.init(), window.hooks = hooks.A
        }
        disable() {}
    }
    const main = new Minebuns
})();