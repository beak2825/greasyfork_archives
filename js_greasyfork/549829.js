// ==UserScript==
// @name         jav已读标记
// @version      1.2.5
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  JAV Library 已读标记功能
// @match        *://www.javlibrary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549829/jav%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/549829/jav%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function(){"use strict";const CONFIG={DEBUG_MODE:!0,STORAGE_KEY:"laomo_read_topics",UNFINISHED_STORAGE_KEY:"laomo_unfinished_topics",
HIGHLIGHT_STORAGE_KEY:"laomo_jav_highlight_words",STORAGE:{GM_GITHUB_TOKEN_KEY:"jav_readmark_github_token",GM_GIST_ID_KEY:"jav_readmark_gist_id"},
GIST:{FILENAME:"jav_readmark_backup.json",DESCRIPTION:"JAV已读标记备份数据"},UI:{DIALOG:{SETTINGS_Z_INDEX:"99999"}},STYLES:{READ_TOPIC:{opacity:"0.6",
background:"#f0f0f0",color:"#888"},READ_BADGE:{color:"#666",fontSize:"12px",marginLeft:"8px",fontWeight:"normal"},UNFINISHED_BADGE:{color:"#d2691e",
fontSize:"12px",marginLeft:"8px",fontWeight:"bold"},UNFINISHED_TOPIC:{opacity:"1",background:"#fff7e6",color:"#c05000"},FAV_BUTTON:{color:"#999",
fontSize:"12px",marginLeft:"4px",fontWeight:"normal",cursor:"pointer",textDecoration:"underline"},HIGHLIGHT_WORD:{background:"#fffb8f",
color:"#d48806",padding:"0 2px",borderRadius:"2px"}},SELECTORS:{topicTable:"table.pubgroup",topicRows:"table.pubgroup tbody tr:not(#header)",
topicLinks:'a.topictitle[href*="publictopic.php"]',allTopicLinks:'a[href*="publictopic.php"]',topicTitleCell:"td.left"},REGEX:{
topicId:/publictopic\.php\?id=(\d+)/},TEXT:{readBadge:"[已读]",unfinishedBadge:"[已读未完]",favButton:"[收藏]",unfavButton:"[取消收藏]"}};class Storage{
static get(t,e=null){try{const n=GM_getValue(t);if(null==n)return e;try{return JSON.parse(n)}catch{return n}}catch(n){return void 0,e}}
static set(t,e){try{const n=JSON.stringify(e);return GM_setValue(t,n),!0}catch(n){return void 0,!1}}static delete(t){try{return GM_deleteValue(t),!0
}catch(e){return void 0,!1}}static listKeys(){try{return GM_listValues()}catch(t){return void 0,[]}}static migrateFromLocalStorage(t,e=!0){try{
const n=localStorage.getItem(t);if(null!==n){try{const e=JSON.parse(n);this.set(t,e)}catch{GM_setValue(t,n)}return e&&localStorage.removeItem(t),!0}
return!1}catch(n){return void 0,!1}}}function t(t){const e=t.match(CONFIG.REGEX.topicId);return e?e[1]:null}function e(){try{
const t=Storage.get(CONFIG.STORAGE_KEY,[])||[];return new Set(t)}catch(t){return void 0,new Set}}function n(t){try{
Storage.set(CONFIG.STORAGE_KEY,Array.from(t))}catch(e){void 0}}function i(t){const i=e();i.add(t),n(i)}function o(t){return e().has(t)}function r(){
try{const t=Storage.get(CONFIG.UNFINISHED_STORAGE_KEY,[])||[];return new Set(t)}catch(t){return void 0,new Set}}function a(t){try{
Storage.set(CONFIG.UNFINISHED_STORAGE_KEY,Array.from(t))}catch(e){void 0}}function s(t){const e=r();e.add(t),a(e)}function l(t){const e=r()
;e.has(t)&&(e.delete(t),a(e))}function c(t){return r().has(t)}function d(t){try{return(Storage.get(CONFIG.HIGHLIGHT_STORAGE_KEY,{})||{})[t]||[]
}catch(e){return void 0,[]}}function u(t,e){try{const n=Storage.get(CONFIG.HIGHLIGHT_STORAGE_KEY,{})||{}
;n[t]=Array.from(new Set(e.filter(t=>t&&t.trim().length>0))),Storage.set(CONFIG.HIGHLIGHT_STORAGE_KEY,n)}catch(n){void 0}}class ReadMarkManager{
constructor(){this.lastSelectMouseDownX=null,this.lastSelectMouseDownY=null,this.lastSelectMouseDownTime=null,this.lastClickTime=0,
this.lastUnhighlightedText=null,this.readTopics=e(),this.unfinishedTopics=r()}init(){void 0,
"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{this.handleCurrentPage()}):this.handleCurrentPage()}
handleCurrentPage(){const t=window.location.href;t.includes("publicgroupsearch.php")||t.includes("publicgroup.php")?(this.setupReadMarks(),
this.bindEvents()):t.includes("publictopic.php")&&this.markCurrentTopicAsRead()}markCurrentTopicAsRead(){const e=t(window.location.href);if(e){
this.markAsRead(e);const t=document.querySelector(CONFIG.SELECTORS.topicLinks);t&&(this.markAsReadVisually(t,e),
this.isUnfinished(e)&&this.markAsUnfinishedVisually(t,e)),this.initContentHighlight(e)}}initContentHighlight(t){
const e=document.querySelector("div#video_jacket, div#video, table#video_jacket, table#video, body");if(!e)return void 0,void 0;const n=d(t)
;n.length>0&&n.forEach(t=>{this.applyHighlightToContent(e,t)}),document.addEventListener("mousedown",t=>{
if(0!==t.button)return this.lastSelectMouseDownX=null,this.lastSelectMouseDownY=null,this.lastSelectMouseDownTime=null,void 0;const n=t.target
;n&&e.contains(n)?(this.lastSelectMouseDownX=t.clientX,this.lastSelectMouseDownY=t.clientY,
this.lastSelectMouseDownTime=Date.now()):(this.lastSelectMouseDownX=null,this.lastSelectMouseDownY=null,this.lastSelectMouseDownTime=null)}),
document.addEventListener("mouseup",n=>{if(0!==n.button)return;const i=window.getSelection();if(!i)return;const o=i.toString().trim();if(!o)return
;if(!this.isSelectionInsideRoot(i,e))return;const r=o;let a=d(t)
;if(null===this.lastSelectMouseDownX||null===this.lastSelectMouseDownY||null===this.lastSelectMouseDownTime)return
;const s=Date.now(),l=s-this.lastSelectMouseDownTime,c=n.clientX-this.lastSelectMouseDownX,h=Math.abs(n.clientY-this.lastSelectMouseDownY),g=s-this.lastClickTime<300&&Math.abs(c)<5&&h<5
;return this.lastClickTime=s,
g?(void 0,void 0):c>10&&h<50&&l>50&&l<3e3?this.lastUnhighlightedText&&this.lastUnhighlightedText.text===o&&s-this.lastUnhighlightedText.timestamp<5e3?(void 0,
void 0):this.isValidCodeNumber(o)?(this.copyToClipboard(o),this.removeHighlightFromContent(e,o),a.includes(o)||(a=[...a,o],u(t,a)),
this.applyHighlightToContentWithLink(e,o),setTimeout(()=>{this.restoreSelection(e,r)},10),void 0):(void 0,
void 0):(c<-10&&h<50&&l>50&&l<3e3&&(a.includes(o)||this.hasHighlightInContent(e,o))&&(a=a.filter(t=>t!==o),u(t,a),
this.removeHighlightFromContent(e,o),this.lastUnhighlightedText={text:o,timestamp:Date.now()},setTimeout(()=>{this.restoreSelectionForText(e,r)},10)),
void 0)})}applyHighlightToContent(t,e){if(!e)return;const n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null),i=[];for(;n.nextNode();){
const t=n.currentNode;if(t.nodeValue&&t.nodeValue.includes(e)){if(t.parentElement){const e=t.parentElement
;if(e.dataset&&"true"===e.dataset.javHighlight||"A"===e.tagName&&"true"===e.dataset.javHighlightLink)continue}i.push(t)}}i.forEach(t=>{
const n=t.parentElement;if(!n)return;const i=t.nodeValue.split(e);if(i.length<=1)return;const o=document.createDocumentFragment();i.forEach((t,n)=>{
if(t&&o.appendChild(document.createTextNode(t)),n<i.length-1){const t=document.createElement("span");t.dataset.javHighlight="true",t.textContent=e,
t.style.background=CONFIG.STYLES.HIGHLIGHT_WORD.background,t.style.color=CONFIG.STYLES.HIGHLIGHT_WORD.color,
t.style.padding=CONFIG.STYLES.HIGHLIGHT_WORD.padding,t.style.borderRadius=CONFIG.STYLES.HIGHLIGHT_WORD.borderRadius,o.appendChild(t)}}),
n.replaceChild(o,t)})}applyHighlightToContentWithLink(t,e){if(!e)return;const n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null),i=[]
;for(;n.nextNode();){const t=n.currentNode;if(t.nodeValue&&t.nodeValue.includes(e)){if(t.parentElement){const e=t.parentElement
;if(e.dataset&&"true"===e.dataset.javHighlight||"A"===e.tagName&&"true"===e.dataset.javHighlightLink)continue}i.push(t)}}i.forEach(t=>{
const n=t.parentElement;if(!n)return;const i=t.nodeValue.split(e);if(i.length<=1)return;const o=document.createDocumentFragment();i.forEach((t,n)=>{
if(t&&o.appendChild(document.createTextNode(t)),n<i.length-1){const t=document.createElement("a");t.dataset.javHighlightLink="true",t.textContent=e,
t.href=`https://javdb.com/search?q=${encodeURIComponent(e)}&f=all`,t.target="_blank",t.rel="noopener noreferrer",
t.style.background=CONFIG.STYLES.HIGHLIGHT_WORD.background,t.style.color=CONFIG.STYLES.HIGHLIGHT_WORD.color,
t.style.padding=CONFIG.STYLES.HIGHLIGHT_WORD.padding,t.style.borderRadius=CONFIG.STYLES.HIGHLIGHT_WORD.borderRadius,
t.style.textDecoration="underline",t.style.cursor="pointer",t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),
GM_openInTab(t.href,{active:!0,insert:!0});const i=document.createElement("span");i.dataset.javHighlight="true",i.textContent=e,
i.style.background=CONFIG.STYLES.HIGHLIGHT_WORD.background,i.style.color=CONFIG.STYLES.HIGHLIGHT_WORD.color,
i.style.padding=CONFIG.STYLES.HIGHLIGHT_WORD.padding,i.style.borderRadius=CONFIG.STYLES.HIGHLIGHT_WORD.borderRadius;const o=t.parentElement
;o&&o.replaceChild(i,t)}),o.appendChild(t)}}),n.replaceChild(o,t)})}removeHighlightFromContent(t,e){
e&&(t.querySelectorAll('span[data-jav-highlight="true"]').forEach(t=>{if(t.textContent===e){
const e=document.createTextNode(t.textContent||""),n=t.parentElement;if(!n)return;n.replaceChild(e,t),n.normalize()}}),
t.querySelectorAll('a[data-jav-highlight-link="true"]').forEach(t=>{if(t.textContent===e){
const e=document.createTextNode(t.textContent||""),n=t.parentElement;if(!n)return;n.replaceChild(e,t),n.normalize()}}))}copyToClipboard(t){
navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).catch(()=>{this.fallbackCopyToClipboard(t)
}):this.fallbackCopyToClipboard(t)}fallbackCopyToClipboard(t){const e=document.createElement("textarea");e.value=t,e.style.position="fixed",
e.style.top="-1000px",e.style.left="-1000px",document.body.appendChild(e),e.focus(),e.select();try{document.execCommand("copy")}catch(n){void 0}
document.body.removeChild(e)}hasHighlightInContent(t,e){if(!e)return!1;const n=t.querySelectorAll('a[data-jav-highlight-link="true"]')
;for(const o of Array.from(n))if(o.textContent===e)return!0;const i=t.querySelectorAll('span[data-jav-highlight="true"]')
;for(const o of Array.from(i))if(o.textContent===e)return!0;return!1}restoreSelection(t,e){if(!e)return;const n=window.getSelection();if(!n)return
;const i=t.querySelectorAll('a[data-jav-highlight-link="true"]');let o=null;for(const a of Array.from(i))if(a.textContent===e){o=a;break}if(!o){
const n=t.querySelectorAll('span[data-jav-highlight="true"]');for(const t of Array.from(n))if(t.textContent===e){o=t;break}}if(o)try{
const t=document.createRange();t.selectNodeContents(o),n.removeAllRanges(),n.addRange(t)}catch(r){void 0}}restoreSelectionForText(t,e){if(!e)return
;const n=window.getSelection();if(!n)return;const i=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null);let o=null;for(;i.nextNode();){
const t=i.currentNode;if(t.nodeValue&&t.nodeValue.includes(e)){const e=t.parentElement
;if(e&&("true"===e.dataset?.javHighlight||"true"===e.dataset?.javHighlightLink))continue;o=t;break}}if(o&&o.nodeValue)try{
const t=o.nodeValue.indexOf(e);if(-1!==t){const i=document.createRange();i.setStart(o,t),i.setEnd(o,t+e.length),n.removeAllRanges(),n.addRange(i)}
}catch(r){void 0}}isSelectionInsideRoot(t,e){const n=t.anchorNode,i=t.focusNode;return!(!n||!i)&&e.contains(n)&&e.contains(i)}isValidCodeNumber(t){
if(!t||0===t.trim().length)return!1;const e=t.trim();if(/[\u4e00-\u9fa5]/.test(e))return void 0,!1
;if(/^(https?:\/\/|ftp:\/\/|www\.|magnet:|ed2k:|thunder:)/i.test(e))return void 0,!1
;if(e.includes("://")||e.includes("www.")||e.match(/\.(com|net|org|cn|co|io|me|tv|cc|xyz|top|site|online|info|app|dev)(\/|$|\?|#)/i))return void 0,!1
;const n=/[a-zA-Z]/.test(e),i=/\d/.test(e);return!!(n&&i&&e.length>=3&&e.length<=50)||(void 0,!1)}setupReadMarks(){void 0
;let e=document.querySelectorAll(CONFIG.SELECTORS.topicLinks);if(void 0,0===e.length){e=document.querySelectorAll(CONFIG.SELECTORS.allTopicLinks)
;const t=document.querySelectorAll('a[href*="publictopic.php"]');void 0,document.querySelectorAll("table"),void 0,t.forEach((t,e)=>{e<5,0})}
e.forEach(e=>{const n=e;n.target="_blank",n.rel="noopener noreferrer";const i=t(n.href);i&&(this.isRead(i)&&this.markAsReadVisually(n,i),
this.isUnfinished(i)&&this.markAsUnfinishedVisually(n,i))})}bindEvents(){let e=null;document.addEventListener("mousedown",t=>{e={time:Date.now(),
x:t.clientX,y:t.clientY,target:t.target}}),document.addEventListener("click",n=>{const i=n.target
;if(i.closest('span[data-read-fav-button="true"]'))return;const o=i.closest(CONFIG.SELECTORS.allTopicLinks);if(o&&0===n.button){const i=t(o.href)
;i&&this.isValidClick(n,e)&&(this.markAsRead(i),this.markAsReadVisually(o,i))}}),document.addEventListener("auxclick",e=>{
const n=e.target.closest(CONFIG.SELECTORS.allTopicLinks);if(n&&1===e.button){const e=t(n.href);e&&(this.markAsRead(e),this.markAsReadVisually(n,e))}
}),document.addEventListener("contextmenu",e=>{const n=e.target.closest(CONFIG.SELECTORS.allTopicLinks);if(n){const e=t(n.href);e&&setTimeout(()=>{
this.markAsRead(e),this.markAsReadVisually(n,e)},100)}}),document.addEventListener("click",e=>{
const n=e.target.closest(CONFIG.SELECTORS.allTopicLinks);if(n&&(e.ctrlKey||e.metaKey)){const i=t(n.href);i&&(this.markAsRead(i),
this.markAsReadVisually(n,i),e.ctrlKey)}})}isValidClick(t,e){if(!e)return!0
;const n=Date.now()-e.time,i=Math.sqrt(Math.pow(t.clientX-e.x,2)+Math.pow(t.clientY-e.y,2)),o=window.getSelection()
;return o&&o.toString().length>0?(void 0,!1):!(void 0,n>500||i>5)}markAsRead(t){this.isRead(t)||(this.readTopics.add(t),i(t))}isRead(t){
return this.readTopics.has(t)||o(t)}isUnfinished(t){return this.unfinishedTopics.has(t)||c(t)}markAsReadVisually(e,n){
if("true"===e.dataset.readMarked)return;e.dataset.readMarked="true";let i=e.querySelector('span[data-read-badge="true"]')
;i||(i=document.createElement("span"),i.dataset.readBadge="true",e.appendChild(i)),i.textContent=CONFIG.TEXT.readBadge,
i.style.color=CONFIG.STYLES.READ_BADGE.color,i.style.fontSize=CONFIG.STYLES.READ_BADGE.fontSize,
i.style.marginLeft=CONFIG.STYLES.READ_BADGE.marginLeft,i.style.fontWeight=CONFIG.STYLES.READ_BADGE.fontWeight
;let o=e.querySelector('span[data-read-fav-button="true"]')
;o?o.textContent=this.isUnfinished(n)?CONFIG.TEXT.unfavButton:CONFIG.TEXT.favButton:(o=document.createElement("span"),o.dataset.readFavButton="true",
o.textContent=CONFIG.TEXT.favButton,o.style.color=CONFIG.STYLES.FAV_BUTTON.color,o.style.fontSize=CONFIG.STYLES.FAV_BUTTON.fontSize,
o.style.marginLeft=CONFIG.STYLES.FAV_BUTTON.marginLeft,o.style.fontWeight=CONFIG.STYLES.FAV_BUTTON.fontWeight,
o.style.cursor=CONFIG.STYLES.FAV_BUTTON.cursor,o.style.textDecoration=CONFIG.STYLES.FAV_BUTTON.textDecoration,o.addEventListener("click",i=>{
i.stopPropagation(),i.preventDefault();const o=n||t(e.href);o&&(this.isUnfinished(o)?(this.unfinishedTopics.delete(o),l(o),
this.restoreReadVisualState(e)):(this.unfinishedTopics.add(o),s(o),this.markAsUnfinishedVisually(e,o)))}),e.appendChild(o)),
this.applyRowStyle(e,CONFIG.STYLES.READ_TOPIC)}markAsUnfinishedVisually(t,e){let n=t.querySelector('span[data-read-badge="true"]')
;n||(n=document.createElement("span"),n.dataset.readBadge="true",t.appendChild(n)),n.textContent=CONFIG.TEXT.unfinishedBadge,
n.style.color=CONFIG.STYLES.UNFINISHED_BADGE.color,n.style.fontSize=CONFIG.STYLES.UNFINISHED_BADGE.fontSize,
n.style.marginLeft=CONFIG.STYLES.UNFINISHED_BADGE.marginLeft,n.style.fontWeight=CONFIG.STYLES.UNFINISHED_BADGE.fontWeight
;const i=t.querySelector('span[data-read-fav-button="true"]');i&&(i.textContent=CONFIG.TEXT.unfavButton),
this.applyRowStyle(t,CONFIG.STYLES.UNFINISHED_TOPIC)}restoreReadVisualState(t){const e=t.querySelector('span[data-read-badge="true"]')
;e&&(e.textContent=CONFIG.TEXT.readBadge,e.style.color=CONFIG.STYLES.READ_BADGE.color,e.style.fontSize=CONFIG.STYLES.READ_BADGE.fontSize,
e.style.marginLeft=CONFIG.STYLES.READ_BADGE.marginLeft,e.style.fontWeight=CONFIG.STYLES.READ_BADGE.fontWeight)
;const n=t.querySelector('span[data-read-fav-button="true"]');n&&(n.textContent=CONFIG.TEXT.favButton),this.applyRowStyle(t,CONFIG.STYLES.READ_TOPIC)}
applyRowStyle(t,e){const n=t.closest("tr");n&&(void 0!==e.opacity&&(n.style.opacity=e.opacity),
void 0!==e.background&&(n.style.background=e.background),void 0!==e.color&&(n.style.color=e.color))}}const h=class{static initContainer(){
return this.container||(this.container=document.createElement("div"),this.container.id="toast-container",Object.assign(this.container.style,{
position:"fixed",top:"20px",right:"20px",zIndex:"99999",pointerEvents:"none"}),document.body.appendChild(this.container)),this.container}
static show(t,e="info",n=4e3){const i=this.initContainer(),o=document.createElement("div");o.textContent=t,Object.assign(o.style,{padding:"12px 20px",
marginBottom:"10px",borderRadius:"6px",color:"white",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",opacity:"0",transform:"translateX(100%)",
transition:"all 0.3s ease-out",fontSize:"14px",fontWeight:"400",maxWidth:"300px",wordWrap:"break-word",pointerEvents:"auto",cursor:"pointer"})
;const r={success:"#10B981",error:"#EF4444",warning:"#F59E0B",info:"#3B82F6"};return o.style.backgroundColor=r[e],o.addEventListener("click",()=>{
this.removeToast(o)}),i.appendChild(o),setTimeout(()=>{o.style.opacity="1",o.style.transform="translateX(0)"},10),n>0&&setTimeout(()=>{
this.removeToast(o)},n),o}static removeToast(t){t.style.opacity="0",t.style.transform="translateX(100%)",setTimeout(()=>{t.parentNode&&t.remove()
},300)}static success(t,e=4e3){return this.show(t,"success",e)}static error(t,e=5e3){return this.show(t,"error",e)}static warning(t,e=4e3){
return this.show(t,"warning",e)}static info(t,e=3e3){return this.show(t,"info",e)}};h.container=null;let g=h;class GistAPI{
static async request(t,config){if(!t)throw new Error("GitHub Token 未提供");const e={...config,headers:{...config.headers,Authorization:`token ${t}`,
Accept:"application/vnd.github.v3+json"}};return new Promise((t,n)=>{GM_xmlhttpRequest({...e,onload:e=>{e.status>=200&&e.status<300?t(e):n(e)},
onerror:t=>n(t)})})}static async getFile(t,e,n){if(!e)throw new Error("Gist ID 未提供");try{const i=await this.request(t,{method:"GET",
url:`https://api.github.com/gists/${e}`}),o=JSON.parse(i.responseText);return o.files&&o.files[n]?o.files[n]:null}catch(i){throw i}}
static async updateFile(t,e,n,i){if(!e)throw new Error("Gist ID 未提供");try{return await this.request(t,{method:"PATCH",
url:`https://api.github.com/gists/${e}`,headers:{"Content-Type":"application/json"},data:JSON.stringify({files:{[n]:{content:i}}})}),!0}catch(o){
throw o}}static async createGist(t,e,n,i,o=!1){try{const r=await this.request(t,{method:"POST",url:"https://api.github.com/gists",headers:{
"Content-Type":"application/json"},data:JSON.stringify({description:i,public:o,files:{[e]:{content:n}}})});return JSON.parse(r.responseText).id
}catch(r){throw r}}static async deleteGist(t,e){if(!e)throw new Error("Gist ID 未提供");try{return await this.request(t,{method:"DELETE",
url:`https://api.github.com/gists/${e}`}),!0}catch(n){throw n}}}class GistSync{static getGitHubToken(){
return Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY,"")||""}static getGistId(){return Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY,"")||""}
static async getGistFile(){const t=this.getGitHubToken(),e=this.getGistId();if(!t)return void 0,null;if(!e)return void 0,null;try{
const n=await GistAPI.getFile(t,e,CONFIG.GIST.FILENAME);return n?(CONFIG.DEBUG_MODE,0,n):(CONFIG.DEBUG_MODE,0,null)}catch(n){
return 404===n.status?g.show("Gist 未找到，请检查Gist ID配置","warning",5e3):g.show(`获取Gist文件失败: ${n.statusText||"Unknown error"}`,"error"),null}}
static async updateGistFile(t){const e=this.getGitHubToken(),n=this.getGistId();if(!e||!n)return g.show("GitHub Token 或 Gist ID 未配置","error"),!1;try{
return await GistAPI.updateFile(e,n,CONFIG.GIST.FILENAME,t),CONFIG.DEBUG_MODE,!0}catch(i){
return g.show(`更新Gist文件失败: ${i.statusText||"Unknown error"}`,"error"),!1}}static async createGist(t){const e=this.getGitHubToken()
;if(!e)return g.show("GitHub Token 未配置","error"),null;try{const n=await GistAPI.createGist(e,CONFIG.GIST.FILENAME,t,CONFIG.GIST.DESCRIPTION,!1)
;return CONFIG.DEBUG_MODE,0,n}catch(n){let t="Unknown error";void 0;try{if(n.responseText)try{const e=JSON.parse(n.responseText)
;t=e.message||e.error||n.statusText||"Unknown error",CONFIG.DEBUG_MODE}catch(i){t=n.responseText.substring(0,200)||n.statusText||"Unknown error"
}else n.statusText?t=n.statusText:n.message&&(t=n.message)}catch(o){t=n.statusText||n.message||"Unknown error"}
return 401===n.status?t="Token 无效或已过期，请检查 GitHub Token":403===n.status?t="Token 权限不足，需要 gist 权限":422===n.status&&(t=t||"请求参数错误"),
g.show(`创建Gist失败: ${t}`,"error",5e3),null}}static getBackupData(){
const t=Storage.get(CONFIG.STORAGE_KEY,[]),e=Storage.get(CONFIG.UNFINISHED_STORAGE_KEY,[]),n=Storage.get(CONFIG.HIGHLIGHT_STORAGE_KEY,{}),i=Array.isArray(t)?t:[],o=Array.isArray(e)?e:[],r=n&&"object"==typeof n?n:{}
;return void 0,{timestamp:(new Date).toISOString(),version:"1.0.0",javLibrary:i,unfinishedLibrary:o,highlightWords:r}}static mergeArrays(t,e){
const n=new Set([...t,...e]);return Array.from(n)}static mergeHighlightWords(t,e){const n={...t}
;for(const[i,o]of Object.entries(e))n[i]?n[i]=this.mergeArrays(n[i],o):n[i]=o;return n}static async importBackupData(t){void 0
;const e=Storage.get(CONFIG.STORAGE_KEY,[]),n=Storage.get(CONFIG.UNFINISHED_STORAGE_KEY,[]),i=Storage.get(CONFIG.HIGHLIGHT_STORAGE_KEY,{}),o=Array.isArray(t.javLibrary)?t.javLibrary:[],r=Array.isArray(t.unfinishedLibrary)?t.unfinishedLibrary:[],a=t.highlightWords&&"object"==typeof t.highlightWords?t.highlightWords:{},s=this.mergeArrays(e,o),l=this.mergeArrays(n,r),c=this.mergeHighlightWords(i,a)
;Storage.set(CONFIG.STORAGE_KEY,s),Storage.set(CONFIG.UNFINISHED_STORAGE_KEY,l),Storage.set(CONFIG.HIGHLIGHT_STORAGE_KEY,c),s.length,e.length,
l.length,n.length,Object.keys(c).length,Object.keys(i).length,void 0,setTimeout(()=>{window.location.reload()},1e3)}static async uploadToGist(){
if(!this.getGitHubToken())return g.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。","error"),void 0
;const t=this.getGistId(),e=g.show("上传数据到Gist中...","info",0);try{let i,o=!1,r=!1;if(t){CONFIG.DEBUG_MODE,0;try{const t=await this.getGistFile()
;if(t&&t.content){
const e=JSON.parse(t.content),n=this.getBackupData(),o=this.mergeArrays(n.javLibrary,e.javLibrary||[]),r=this.mergeArrays(n.unfinishedLibrary,e.unfinishedLibrary||[]),a=this.mergeHighlightWords(n.highlightWords,e.highlightWords||{})
;i={timestamp:(new Date).toISOString(),version:"1.0.0",javLibrary:o,unfinishedLibrary:r,highlightWords:a},CONFIG.DEBUG_MODE
}else i=this.getBackupData()}catch(n){CONFIG.DEBUG_MODE,0,i=this.getBackupData()}}else i=this.getBackupData();const a=JSON.stringify(i,null,2)
;if(t)o=await this.updateGistFile(a);else{CONFIG.DEBUG_MODE,0;const t=await this.createGist(a);t?(Storage.set(CONFIG.STORAGE.GM_GIST_ID_KEY,t),o=!0,
r=!0,CONFIG.DEBUG_MODE):(CONFIG.DEBUG_MODE,0)}
e.remove(),o?r?g.show("新Gist已创建并自动保存！","success",7e3):g.show("数据已合并并同步到Gist！","success"):t&&g.show("上传失败，请检查网络连接和Token权限","error",5e3)}catch(n){
e.remove(),g.show(`上传失败: ${n.message||"Unknown error"}`,"error",5e3)}}static async downloadFromGist(){
if(!this.getGitHubToken())return g.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。","error"),void 0
;if(!this.getGistId())return g.show("Gist ID 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置，或先上传一次。","warning",5e3),void 0;const t=g.show("从Gist下载数据中...","info",0)
;try{const n=await this.getGistFile();if(t.remove(),!n||!n.content)throw new Error("从Gist下载数据失败，未找到有效内容");{let t;try{t=JSON.parse(n.content)}catch(e){
throw new Error(`JSON解析失败: ${e.message}`)}await this.importBackupData(t),g.show("已从Gist下载并合并到本地数据！","success",3e3)}}catch(n){t.remove(),
g.show(n.message||"从Gist下载时发生错误。","error")}}}function p(t,e){{const t=document.getElementById(e);if(t)return t}const n=document.createElement("style")
;return n.id=e,n.textContent=t,document.head.appendChild(n),n}class SettingsPanel{static show(){void 0
;const t=document.getElementById("jav-readmark-settings-dialog");t&&t.remove();const e=document.createElement("div")
;e.id="jav-readmark-settings-dialog";const n=document.createElement("div");n.id="jav-readmark-settings-dialog-content",
n.innerHTML=`\n      <button id="jav-readmark-settings-close-btn" title="关闭">&times;</button>\n      <h3>Gist 同步参数配置</h3>\n      <div>\n        <label for="gist_token_input_jav">GitHub 个人访问令牌 (Token):</label>\n        <input type="password" id="gist_token_input_jav" value="${Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY,"")}" placeholder="例如 ghp_xxxxxxxxxxxxxxxxx">\n        <small>Token 用于授权访问您的Gist。需要 Gist 读写权限。</small>\n      </div>\n      <div>\n        <label for="gist_id_input_jav">Gist ID:</label>\n        <input type="text" id="gist_id_input_jav" value="${Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY,"")}" placeholder="例如 123abc456def7890">\n        <small>Gist ID 是备份用Gist的标识。若为空，首次上传时将自动创建并保存。</small>\n      </div>\n      <div class="rw-dialog-buttons">\n        <button id="settings_cancel_btn_jav" class="rw-cancel-btn">取消</button>\n        <button id="settings_save_btn_jav" class="rw-save-btn">保存配置</button>\n      </div>\n    `,
e.appendChild(n),document.body.appendChild(e),this.applyStyles();const i=t=>{"Escape"===t.key&&o()},o=()=>{document.removeEventListener("keydown",i),
e.remove()},r=()=>{const t=document.getElementById("gist_token_input_jav").value.trim(),e=document.getElementById("gist_id_input_jav").value.trim()
;Storage.set(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY,t),Storage.set(CONFIG.STORAGE.GM_GIST_ID_KEY,e);let n="Gist参数已保存!"
;t||e?t?e||(n="Gist ID已清空, Token已保存。"):n="Token已清空, Gist ID已保存。":n="Gist参数已清空。",g.show(n,"success"),o()},a=()=>{o(),g.show("参数设置已取消。","info")}
;document.getElementById("settings_save_btn_jav")?.addEventListener("click",r),
document.getElementById("settings_cancel_btn_jav")?.addEventListener("click",a),
document.getElementById("jav-readmark-settings-close-btn")?.addEventListener("click",a),document.addEventListener("keydown",i)}static applyStyles(){
p(`\n      #jav-readmark-settings-dialog {\n        position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n        background-color: rgba(0,0,0,0.6); z-index: ${CONFIG.UI?.DIALOG?.SETTINGS_Z_INDEX};\n        display: flex; justify-content: center; align-items: center; font-family: sans-serif;\n      }\n      #jav-readmark-settings-dialog-content {\n        background: white; padding: 25px; border-radius: 8px;\n        box-shadow: 0 5px 20px rgba(0,0,0,0.3); width: 400px; max-width: 90%;\n        position: relative;\n      }\n      #jav-readmark-settings-dialog-content h3 { margin-top: 0; margin-bottom: 20px; text-align: center; color: #333; font-size: 1.3em; }\n      #jav-readmark-settings-dialog-content label { display: block; margin-bottom: 5px; color: #555; font-size: 0.95em; }\n      #jav-readmark-settings-dialog-content input[type="text"], #jav-readmark-settings-dialog-content input[type="password"] {\n        width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 0; font-size: 1em;\n      }\n      #jav-readmark-settings-dialog-content small { font-size:0.8em; color:#777; display:block; margin-top:4px; margin-bottom:12px; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons { text-align: right; margin-top: 15px; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons button { padding: 10px 18px; border-radius: 4px; border: none; cursor: pointer; font-size: 0.95em; transition: background-color 0.2s ease; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn { margin-right: 10px; background-color: #f0f0f0; color: #333; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn:hover { background-color: #e0e0e0; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-save-btn { background-color: #4CAF50; color: white; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-save-btn:hover { background-color: #45a049; }\n      #jav-readmark-settings-close-btn { position: absolute; top: 10px; right: 10px; font-size: 1.5em; color: #aaa; cursor: pointer; background: none; border: none; padding: 5px; line-height: 1; }\n      #jav-readmark-settings-close-btn:hover { color: #777; }\n    `,"jav-readmark-settings-styles")
}}class JavReadMarkApp{static main(){
void 0,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",this.initialize.bind(this)):this.initialize()}static initialize(){
try{const t=window.location.href;this.isJavLibraryPage(t)?(void 0,(new ReadMarkManager).init()):void 0,this.registerMenuCommands()}catch(t){void 0}}
static registerMenuCommands(){GM_registerMenuCommand("⚙️ 配置Gist同步参数",()=>{void 0,SettingsPanel.show()}),GM_registerMenuCommand("📤 上传数据到Gist",()=>{
void 0,GistSync.uploadToGist()}),GM_registerMenuCommand("📥 从Gist下载数据",()=>{void 0,GistSync.downloadFromGist()})}static isJavLibraryPage(t){
return t.includes("javlibrary.com")&&(t.includes("publicgroupsearch.php")||t.includes("publictopic.php")||t.includes("publicgroup.php"))}}
JavReadMarkApp.main()})();
