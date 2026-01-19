// ==UserScript==
// @name         老魔-预览
// @version      0.5.4
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  老王论坛·魔性论坛·司机社·GCBT·U9A9·(预览图片·自动签到)
// @match        https://laowang.vip/*
// @match        https://moxing.app/*
// @match        https://xsijishe.net/*
// @match        https://gcbt.net/*
// @match        https://u9a9.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moxing.app
// @license      GPL-3.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      gcbt.net
// @connect      bt.bxmho.cn
// @connect      bt.ivcbt.com
// @connect      rmdown.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551848/%E8%80%81%E9%AD%94-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/551848/%E8%80%81%E9%AD%94-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

!function(){"use strict";var _a,_b;const registry=new class{constructor(){this.modules=[]}register(module){this.modules.push(module)}registerAll(modules2){modules2.forEach(m=>this.register(m))}
matchByHost(hostname){for(const module of this.modules){const pattern=module.config.domain||module.config.domainPattern;if(pattern&&pattern.test(hostname)){return module}}return null}
detectPageType(module){const{pathname:pathname,href:href,search:search}=location,{pages:pages}=module.config;if(pages.content?.some(p=>p.test(pathname))){return"content"}
if(pages.search?.some(p=>p.test(href))){return"search"}if(pages.list.some(p=>p.test(pathname)||p.test(href))){return pages.home.some(p=>p.test(pathname))&&!search&&"gcbt"!==module.type?"home":"list"}
if(pages.home.some(p=>p.test(pathname))){if(!search){return"home"}if(!search.includes("mod=forumdisplay")&&!search.includes("fid=")){return"home"}}return"other"}getAll(){return[...this.modules]}
},_Lightbox=class{static init(){this.overlay||(this.overlay=document.createElement("div"),
this.overlay.style.cssText="\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.95);\n      z-index: 999999;\n      display: none;\n      align-items: center;\n      justify-content: center;\n    ",
this.img=document.createElement("img"),
this.img.style.cssText="\n      width: 80vw;\n      height: 80vh;\n      max-width: 90%;\n      max-height: 90%;\n      object-fit: contain;\n      border-radius: 4px;\n    ",
this.counter=document.createElement("div"),
this.counter.style.cssText="\n      position: absolute;\n      top: 20px;\n      left: 50%;\n      transform: translateX(-50%);\n      color: white;\n      background: rgba(0, 0, 0, 0.6);\n      padding: 8px 16px;\n      border-radius: 20px;\n      font-size: 14px;\n    ",
this.prevBtn=this.createNavButton("‹","left"),this.nextBtn=this.createNavButton("›","right"),this.closeBtn=this.createCloseButton(),this.overlay.appendChild(this.img),
this.overlay.appendChild(this.counter),this.overlay.appendChild(this.prevBtn),this.overlay.appendChild(this.nextBtn),this.overlay.appendChild(this.closeBtn),document.body.appendChild(this.overlay),
this.setupEvents())}static createNavButton(content,position){const btn=document.createElement("button")
;return btn.innerHTML="‹"===content?'<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>':'<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
btn.style.cssText=`\n      position: fixed;\n      ${position}: 20px;\n      top: 50%;\n      transform: translateY(-50%);\n      width: 60px;\n      height: 240px;\n      background: rgba(255, 255, 255, 0.1);\n      border-radius: 30px;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: all 0.3s;\n      backdrop-filter: blur(4px);\n    `,
btn.onmouseover=()=>{btn.style.background="rgba(255, 255, 255, 0.2)",btn.style.width="70px"},btn.onmouseout=()=>{btn.style.background="rgba(255, 255, 255, 0.1)",btn.style.width="60px"},btn}
static createCloseButton(){const btn=document.createElement("button")
;return btn.innerHTML='<svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
btn.style.cssText="\n      position: fixed;\n      right: 20px;\n      top: 20px;\n      width: 50px;\n      height: 50px;\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 50%;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: background 0.2s;\n    ",
btn.onmouseover=()=>{btn.style.background="rgba(255, 255, 255, 0.3)"},btn.onmouseout=()=>{btn.style.background="rgba(255, 255, 255, 0.2)"},btn}static setupEvents(){this.overlay.onclick=()=>{
this.close()},this.prevBtn.onclick=e=>{e.stopPropagation(),this.prev()},this.nextBtn.onclick=e=>{e.stopPropagation(),this.next()},this.closeBtn.onclick=e=>{e.stopPropagation(),this.close()},
document.addEventListener("keydown",e=>{"flex"===this.overlay?.style.display&&("Escape"===e.key?this.close():"ArrowLeft"===e.key?this.prev():"ArrowRight"===e.key&&this.next())})}
static show(images,index=0){this.init(),this.images=images,this.currentIndex=index,this.updateImage(),this.overlay.style.display="flex"}static close(){this.overlay&&(this.overlay.style.display="none")
}static prev(){this.currentIndex=(this.currentIndex-1+this.images.length)%this.images.length,this.updateImage()}static next(){this.currentIndex=(this.currentIndex+1)%this.images.length,
this.updateImage()}static updateImage(){const url=this.images[this.currentIndex];this.img.style.display="none",this.img.src="",
this.counter.textContent=`${this.currentIndex+1} / ${this.images.length}`,this.images.length<=1?(this.prevBtn.style.display="none",this.nextBtn.style.display="none",
this.counter.style.display="none"):(this.prevBtn.style.display="flex",this.nextBtn.style.display="flex",this.counter.style.display="block"),this.img.onload=()=>{this.img.style.display="block"},
this.img.onerror=()=>{this.img.alt="图片加载失败"},this.img.src=url}};_Lightbox.overlay=null,_Lightbox.img=null,_Lightbox.counter=null,_Lightbox.prevBtn=null,_Lightbox.nextBtn=null,_Lightbox.closeBtn=null,
_Lightbox.images=[],_Lightbox.currentIndex=0;let Lightbox=_Lightbox;class Storage{static get(key,defaultValue=null){try{const value=GM_getValue(key);if(null==value){return defaultValue}try{
return JSON.parse(value)}catch{return value}}catch(error){return defaultValue}}static set(key,value){try{const jsonValue=JSON.stringify(value);return GM_setValue(key,jsonValue),!0}catch(error){
return!1}}static delete(key){try{return GM_deleteValue(key),!0}catch(error){return!1}}static listKeys(){try{return GM_listValues()}catch(error){return[]}}
static migrateFromLocalStorage(key,deleteAfterMigration=!0){try{const localValue=localStorage.getItem(key);if(null!==localValue){try{const parsed=JSON.parse(localValue);this.set(key,parsed)}catch{
GM_setValue(key,localValue)}return deleteAfterMigration&&localStorage.removeItem(key),!0}return!1}catch(error){return!1}}}class BasePreview{constructor(siteConfig){if(this.pendingRequests=0,
this.maxConcurrent=3,this.requestQueue=[],!siteConfig.preview){throw new Error("PreviewConfig is required")}this.siteConfig=siteConfig,this.config=siteConfig.preview}async processListPage(){
!function(){if(document.getElementById("lm-preview-styles")){return}const style=document.createElement("style");style.id="lm-preview-styles",
style.textContent="\n/* 预览容器 */\n.lm-preview-container {\n  display: flex;\n  gap: 8px;\n  width: 100%;\n  margin-top: 10px;\n}\n\n/* 图片包装器 */\n.lm-preview-img-wrapper {\n  flex: 1;\n  min-width: 0;\n  height: 180px;\n  background: #f5f5f5;\n  border-radius: 6px;\n  overflow: hidden;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.lm-preview-img-wrapper:hover {\n  box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n}\n\n/* 预览图片 */\n.lm-preview-img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n\n/* 加载占位 */\n.lm-preview-placeholder {\n  color: #999;\n  font-size: 12px;\n}\n\n/* 错误状态 */\n.lm-preview-error {\n  color: #f56c6c;\n  font-size: 12px;\n}\n\n/* 无图提示 */\n.lm-preview-empty {\n  width: 100%;\n  padding: 20px;\n  text-align: center;\n  background: #f9f9f9;\n  border-radius: 6px;\n  color: #999;\n  font-size: 13px;\n}\n\n/* 磁力链接 */\n.lm-magnet-block {\n  margin-top: 10px;\n  padding: 10px 12px;\n  background: #f0f9ff;\n  border: 1px solid #e0f2fe;\n  border-radius: 6px;\n  font-size: 13px;\n  word-break: break-all;\n  cursor: pointer;\n}\n\n.lm-magnet-block:hover {\n  background: #e0f2fe;\n}\n",
document.head.appendChild(style)}();const container=document.querySelector(this.config.listContainer);if(!container){return}
const items=container.querySelectorAll(this.config.itemSelector),tasks=Array.from(items).map(item=>this.processItem(item));await Promise.allSettled(tasks)}async processItem(item){
if(item.dataset.lmProcessed){return}item.dataset.lmProcessed="1";const link=item.querySelector(this.config.linkSelector);if(!link?.href){return}
const url=link.href,previewContainer=document.createElement("div");previewContainer.className="lm-preview-container",previewContainer.innerHTML='<div class="lm-preview-placeholder">加载中...</div>',
item.appendChild(previewContainer);try{const cached=this.getCache(url);if(cached){return void this.renderPreview(previewContainer,cached)}await this.waitForSlot()
;const data=await this.fetchDetail(url);this.releaseSlot(),(data.images.length>0||data.magnet)&&this.setCache(url,data),this.renderPreview(previewContainer,data)}catch(error){this.releaseSlot(),
previewContainer.innerHTML='<div class="lm-preview-error">加载失败</div>'}}async fetchDetail(url){const response=await fetch(url,{credentials:"include"
}),html=await response.text(),doc=(new DOMParser).parseFromString(html,"text/html");let images;images=this.config.extractImages?this.config.extractImages(doc):this.defaultExtractImages(doc)
;let magnet=null;return magnet=this.config.extractMagnet?this.config.extractMagnet(doc):this.defaultExtractMagnet(doc),{images:images,magnet:magnet}}defaultExtractImages(doc){
const maxImages=this.config.maxImages||4,imgs=doc.querySelectorAll(this.config.imageSelector);return Array.from(imgs).slice(0,maxImages).map(img=>{const el=img
;return el.getAttribute("zoomfile")||el.getAttribute("data-src")||el.getAttribute("data-original")||el.src}).filter(src=>src&&!src.includes("none.gif")&&!src.includes("icon"))}
defaultExtractMagnet(doc){const magnetLink=doc.querySelector('a[href^="magnet:?xt=urn:btih:"]');if(magnetLink){return magnetLink.href}
const text=doc.body.innerText||"",match=text.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/i);if(match){return match[0]}const hashMatch=text.match(/\b[a-fA-F0-9]{40}\b/)
;return hashMatch?`magnet:?xt=urn:btih:${hashMatch[0]}`:null}renderPreview(container,data){if(container.innerHTML="",0!==data.images.length||data.magnet){if(data.images.length>0){
const imagesContainer=document.createElement("div");imagesContainer.className="lm-preview-container",data.images.forEach((src,index)=>{const wrapper=document.createElement("div")
;wrapper.className="lm-preview-img-wrapper";const img=document.createElement("img");img.className="lm-preview-img",img.src=src,img.loading="lazy",img.onerror=()=>{
wrapper.innerHTML='<span class="lm-preview-error">加载失败</span>'},wrapper.appendChild(img),wrapper.onclick=()=>Lightbox.show(data.images,index),imagesContainer.appendChild(wrapper)}),
container.appendChild(imagesContainer)}if(data.magnet){const magnetDiv=document.createElement("div");magnetDiv.className="lm-magnet-block",magnetDiv.textContent=data.magnet,magnetDiv.title="点击复制",
magnetDiv.onclick=()=>{navigator.clipboard.writeText(data.magnet),magnetDiv.textContent="✓ 已复制",setTimeout(()=>{magnetDiv.textContent=data.magnet},1500)},container.appendChild(magnetDiv)}}else{
container.innerHTML='<div class="lm-preview-empty">📝 暂无预览</div>'}}waitForSlot(){return this.pendingRequests<this.maxConcurrent?(this.pendingRequests++,Promise.resolve()):new Promise(resolve=>{
this.requestQueue.push(()=>{this.pendingRequests++,resolve()})})}releaseSlot(){this.pendingRequests--;const next=this.requestQueue.shift();next&&setTimeout(next,200+200*Math.random())}getCache(url){
const key=this.getCacheKey(url),cached=Storage.get(key,null);return cached?Date.now()-cached.timestamp>864e5?(Storage.delete(key),null):cached.data:null}setCache(url,data){
const key=this.getCacheKey(url);Storage.set(key,{data:data,timestamp:Date.now()})}getCacheKey(url){const match=url.match(/(?:tid|id)=(\d+)/),id=match?match[1]:btoa(url).slice(0,16)
;return`lm_preview_${this.siteConfig.type}_${id}`}static clearCache(siteType){Storage.listKeys().forEach(key=>{
key.startsWith("lm_preview_")&&(siteType&&!key.includes(`_${siteType}_`)||Storage.delete(key))})}}class CheckInBar{constructor(config,stats,onSignClick){this.config=config,this.stats=stats,
this.onSignClick=onSignClick}render(){return function(){if(document.getElementById("lm-checkin-styles")){return}const style=document.createElement("style");style.id="lm-checkin-styles",
style.textContent="\n/* 签到信息栏 - 完整版 */\n.lm-checkin-bar {\n  margin-bottom: 10px;\n  width: 100%;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  border-radius: 10px;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n  box-sizing: border-box;\n}\n\n.lm-checkin-bar-inner {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 20px;\n  color: #fff;\n  font-size: 13px;\n}\n\n.lm-checkin-stats {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n\n.lm-checkin-stat-item {\n  text-align: center;\n  border-right: 1px solid rgba(255, 255, 255, 0.25);\n  padding-right: 20px;\n}\n\n.lm-checkin-stat-item:last-child {\n  border-right: none;\n  padding-right: 0;\n}\n\n.lm-checkin-stat-label {\n  font-size: 10px;\n  opacity: 0.85;\n  margin-bottom: 2px;\n}\n\n.lm-checkin-stat-value {\n  font-size: 18px;\n  font-weight: 700;\n}\n\n.lm-checkin-actions {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.lm-checkin-status {\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.lm-checkin-status.signed {\n  color: rgba(144, 238, 144, 0.9);\n}\n\n.lm-checkin-status.unsigned {\n  color: rgba(255, 215, 0, 0.9);\n}\n\n.lm-checkin-btn {\n  padding: 6px 18px;\n  border: none;\n  border-radius: 6px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.lm-checkin-btn.active {\n  background: rgba(255, 255, 255, 0.95);\n  color: #667eea;\n}\n\n.lm-checkin-btn.active:hover {\n  background: #fff;\n  transform: translateY(-1px);\n}\n\n.lm-checkin-btn.disabled {\n  background: rgba(255, 255, 255, 0.15);\n  color: rgba(255, 255, 255, 0.6);\n  cursor: not-allowed;\n}\n\n/* 签到信息栏 - 精简版 */\n.lm-checkin-bar-compact {\n  display: inline-block;\n  margin: 0 15px;\n  color: #666;\n  font-size: 12px;\n}\n\n/* 响应式 */\n@media (max-width: 768px) {\n  .lm-checkin-bar-inner {\n    flex-direction: column;\n    gap: 12px;\n    padding: 12px 16px;\n  }\n  .lm-checkin-stats {\n    flex-wrap: wrap;\n    gap: 12px;\n  }\n}\n",
document.head.appendChild(style)}(),"compact"===(this.config.checkIn?.infoBar?.style||"full")?this.renderCompact():this.renderFull()}renderFull(){const bar=document.createElement("div")
;bar.className="lm-checkin-bar",bar.id="lm-checkin-bar";const inner=document.createElement("div");inner.className="lm-checkin-bar-inner";const statsDiv=document.createElement("div")
;statsDiv.className="lm-checkin-stats",statsDiv.appendChild(this.createStatItem("连续",`${this.stats.lxdays}天`)),statsDiv.appendChild(this.createStatItem("等级",`Lv.${this.stats.lxlevel}`)),
statsDiv.appendChild(this.createStatItem("总天数",`${this.stats.lxtdays}天`));const actionsDiv=document.createElement("div");actionsDiv.className="lm-checkin-actions"
;const statusDiv=document.createElement("div");statusDiv.className="lm-checkin-status "+(this.stats.alreadySigned?"signed":"unsigned"),statusDiv.textContent=this.stats.alreadySigned?"✅ 今日已签":"⏰ 待签到"
;const btn=document.createElement("button");return btn.className="lm-checkin-btn "+(this.stats.alreadySigned?"disabled":"active"),btn.textContent=this.stats.alreadySigned?"已签到":"签到",
!this.stats.alreadySigned&&this.onSignClick&&(btn.onclick=()=>this.onSignClick?.()),actionsDiv.appendChild(statusDiv),actionsDiv.appendChild(btn),inner.appendChild(statsDiv),
inner.appendChild(actionsDiv),bar.appendChild(inner),bar}renderCompact(){const bar=document.createElement("div");return bar.className="lm-checkin-bar-compact",bar.id="lm-checkin-bar",
bar.innerHTML=`连续${this.stats.lxdays}天 | 总${this.stats.lxtdays}天 | ${this.stats.alreadySigned?"✓已签":"待签"}`,bar}createStatItem(label,value){const item=document.createElement("div")
;return item.className="lm-checkin-stat-item",item.innerHTML=`\n      <div class="lm-checkin-stat-label">${label}</div>\n      <div class="lm-checkin-stat-value">${value}</div>\n    `,item}
insertTo(target,position="beforebegin"){const bar=this.render();target.insertAdjacentElement(position,bar)}update(stats){this.stats=stats;const oldBar=document.getElementById("lm-checkin-bar")
;if(oldBar){const newBar=this.render();oldBar.replaceWith(newBar)}}}const _Toast=class{static initContainer(){return this.container||(this.container=document.createElement("div"),
this.container.id="toast-container",Object.assign(this.container.style,{position:"fixed",top:"20px",right:"20px",zIndex:"99999",pointerEvents:"none"}),document.body.appendChild(this.container)),
this.container}static show(message,type="info",duration=4e3){const container=this.initContainer(),toast=document.createElement("div");return toast.textContent=message,Object.assign(toast.style,{
padding:"12px 20px",marginBottom:"10px",borderRadius:"6px",color:"white",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",opacity:"0",transform:"translateX(100%)",transition:"all 0.3s ease-out",
fontSize:"14px",fontWeight:"400",maxWidth:"300px",wordWrap:"break-word",pointerEvents:"auto",cursor:"pointer"}),toast.style.backgroundColor={success:"#10B981",error:"#EF4444",warning:"#F59E0B",
info:"#3B82F6"}[type],toast.addEventListener("click",()=>{this.removeToast(toast)}),container.appendChild(toast),setTimeout(()=>{toast.style.opacity="1",toast.style.transform="translateX(0)"},10),
duration>0&&setTimeout(()=>{this.removeToast(toast)},duration),toast}static removeToast(toast){toast.style.opacity="0",toast.style.transform="translateX(100%)",setTimeout(()=>{
toast.parentNode&&toast.remove()},300)}static success(message,duration=4e3){return this.show(message,"success",duration)}static error(message,duration=5e3){return this.show(message,"error",duration)}
static warning(message,duration=4e3){return this.show(message,"warning",duration)}static info(message,duration=3e3){return this.show(message,"info",duration)}};_Toast.container=null;let Toast=_Toast
;class BaseCheckIn{constructor(config){this.checkInBarInstance=null,this.config=config,this.cacheKey=config.checkIn?.cacheKey||`LM_CHECKIN_${config.type.toUpperCase()}`}async init(){
if(this.config.checkIn?.enabled){try{const cachedStats=Storage.get(this.cacheKey);cachedStats&&this.showCheckInBar(cachedStats);const stats=await this.getStats();if(!stats){return}
if(Storage.set(this.cacheKey,stats),"auto"===this.config.checkIn.type&&!stats.alreadySigned&&stats.signUrl){return void(await this.autoSign(stats.signUrl))}await this.showCheckInBar(stats)
}catch(error){}}}async getStats(){const statsUrl=this.config.checkIn?.statsUrl;if(!statsUrl){return null}try{
const fullUrl=statsUrl.startsWith("http")?statsUrl:`${location.origin}/${statsUrl}`,response=await fetch(fullUrl,{credentials:"include"
}),html=await response.text(),doc=(new DOMParser).parseFromString(html,"text/html");return this.config.checkIn?.parseStats?this.config.checkIn.parseStats(doc):this.defaultParseStats(doc,html)
}catch(error){return null}}defaultParseStats(doc,html){
const signedBtn=doc.querySelector('.btnvisted, .signed, [class*="signed"]'),signBtn=doc.querySelector("a.btn.J_chkitot, #fx_checkin_b a[onclick]"),alreadySigned=!!signedBtn||html.includes("已签到")||html.includes("今日已签"),lxdaysMatch=html.match(/连续签到.*?(\d+).*?天/)||html.match(/lxdays['"]?\s*[:=]\s*(\d+)/),lxdays=lxdaysMatch?parseInt(lxdaysMatch[1]):0,lxlevelMatch=html.match(/等级.*?(\d+)/)||html.match(/lxlevel['"]?\s*[:=]\s*(\d+)/),lxlevel=lxlevelMatch?parseInt(lxlevelMatch[1]):0,lxtdaysMatch=html.match(/总.*?签到.*?(\d+).*?天/)||html.match(/lxtdays['"]?\s*[:=]\s*(\d+)/),lxtdays=lxtdaysMatch?parseInt(lxtdaysMatch[1]):0
;let signUrl;if(signBtn){const href=signBtn.getAttribute("href"),onclick=signBtn.getAttribute("onclick");if(href&&"javascript:;"!==href){
signUrl=href.startsWith("http")?href:`${location.origin}/${href}`}else if(onclick){const urlMatch=onclick.match(/['"]([^'"]+sign[^'"]*)['"]/i)
;urlMatch&&(signUrl=urlMatch[1].startsWith("http")?urlMatch[1]:`${location.origin}/${urlMatch[1]}`)}}return{alreadySigned:alreadySigned,lxdays:lxdays,lxlevel:lxlevel,lxtdays:lxtdays,signUrl:signUrl}}
async showCheckInBar(stats){if(this.checkInBarInstance){return void this.checkInBarInstance.update(stats)}if(document.getElementById("lm-checkin-bar")){
return this.checkInBarInstance=new CheckInBar(this.config,stats,()=>this.execute()),void this.checkInBarInstance.update(stats)}const infoBarConfig=this.config.checkIn?.infoBar
;if(!infoBarConfig?.target){return}const target=await this.waitForElement(infoBarConfig.target,5e3)
;target&&(this.checkInBarInstance?this.checkInBarInstance.update(stats):(this.checkInBarInstance=new CheckInBar(this.config,stats,()=>this.execute()),
this.checkInBarInstance.insertTo(target,infoBarConfig.position||"beforebegin")))}async execute(){if(this.config.checkIn?.execute){return await this.config.checkIn.execute()}
if("manual"===this.config.checkIn?.type){const statsUrl=this.config.checkIn.statsUrl;return statsUrl&&(window.location.href=statsUrl.startsWith("http")?statsUrl:`${location.origin}/${statsUrl}`),!0}
const stats=await this.getStats();return!!stats?.signUrl&&await this.autoSign(stats.signUrl)}async autoSign(signUrl){try{return(await fetch(signUrl,{method:"GET",credentials:"include",headers:{
"X-Requested-With":"XMLHttpRequest"}})).ok?(Toast.success(`${this.config.name} 签到成功`),setTimeout(()=>location.reload(),1e3),!0):(Toast.error(`${this.config.name} 签到失败`),!1)}catch(error){
return Toast.error(`${this.config.name} 签到异常`),!1}}waitForElement(selector,timeout=5e3){return new Promise(resolve=>{const element=document.querySelector(selector);if(element){
return void resolve(element)}const observer=new MutationObserver(()=>{const el=document.querySelector(selector);el&&(observer.disconnect(),resolve(el))});observer.observe(document.body,{childList:!0,
subtree:!0}),setTimeout(()=>{observer.disconnect(),resolve(null)},timeout)})}}function createSiteModule(config,hooks){let previewProcessor2=null
;config.preview&&(previewProcessor2=new BasePreview(config));let checkInProcessor=null;return config.checkIn?.enabled&&(checkInProcessor=new BaseCheckIn(config)),{type:config.type,name:config.name,
config:config,hasCheckIn:!!config.checkIn?.enabled,hasPreview:!!config.preview,async init(){if(config.styles){const style=document.createElement("style");style.id=`lm-styles-${config.type}`,
style.textContent=config.styles,document.head.appendChild(style)}hooks?.onInit&&await hooks.onInit()},async handlePage(pageType){switch(pageType){case"home":
checkInProcessor&&await checkInProcessor.init(),hooks?.onHome&&await hooks.onHome();break;case"list":hooks?.onList&&await hooks.onList(),previewProcessor2&&(await previewProcessor2.processListPage(),
hooks?.onPreviewDone&&hooks.onPreviewDone());break;case"search":hooks?.onSearch&&await hooks.onSearch(),previewProcessor2&&await previewProcessor2.processListPage();break;case"content":
hooks?.onContent&&await hooks.onContent()}},async checkIn(){if(checkInProcessor){const success=await checkInProcessor.execute();hooks?.onCheckInDone&&hooks.onCheckInDone(success)}},destroy(){
hooks?.onDestroy&&hooks.onDestroy();const style=document.getElementById(`lm-styles-${config.type}`);style&&style.remove()}}}const laowangConfig={type:"laowang",name:"老王论坛",
domain:/laowang\.vip|laowangwnr3p\.com|y6ptsn8\.com/,pages:{home:[/^\/$/,/^\/index\.php$/,/^\/forum\.php$/],list:[/forum\.php\?mod=forumdisplay/],search:[/\/search\/s\.php/]},preview:{
listContainer:"#threadlist .bm_c",itemSelector:"li",linkSelector:'div.c.cl a[href*="viewthread"]',imageSelector:".pcb img.zoom[zoomfile], .pattl img.zoom[zoomfile]",maxImages:4},checkIn:{enabled:!0,
type:"manual",statsUrl:"plugin.php?id=k_misign:sign",buttonSelector:"a.btn.J_chkitot",signedSelector:"span.btn.btnvisted",cacheKey:"LAOWANG_CHECKIN_STATUS",infoBar:{target:".xxbt2",
position:"beforebegin",style:"full"}},styles:'\n    /* 老王论坛特定样式 */\n    .deanbkms[id^="forum_rules_"] {\n      display: none;\n    }\n  '};class LaowangPreview{constructor(){this.pending=0,
this.maxConcurrent=3,this.queue=[]}async processListPage(){this.injectStyles(),this.convertToListLayout();const items=document.querySelectorAll(".lw-item");for(const item of items){
this.processItem(item)}}async processSearchPage(){this.injectStyles();const items=document.querySelectorAll('.result-item[class*="uid_hidden_"]');for(const item of items){this.processSearchItem(item)}
}async processSearchItem(item){if(item.dataset.lwPreview){return}item.dataset.lwPreview="1";const link=item.querySelector('.result-title a[href*="viewthread"]');if(!link?.href){return}
const url=link.href,tid=this.getTid(url);if(!tid){return}const preview=document.createElement("div");preview.className="lw-preview",preview.innerHTML='<span class="lw-loading">加载预览...</span>'
;const titleEl=item.querySelector(".result-title");titleEl?titleEl.after(preview):item.appendChild(preview);try{const cacheKey=`lw_prev_${tid}`,cached=Storage.get(cacheKey,null)
;if(cached&&Date.now()-cached.time<864e5){return void this.render(preview,cached.images)}await this.acquireSlot();const images=await this.fetchImages(url);this.releaseSlot(),
images.length>0&&Storage.set(cacheKey,{images:images,time:Date.now()}),this.render(preview,images)}catch{preview.innerHTML='<span class="lw-error">加载失败</span>'}}convertToListLayout(){
const waterfall=document.querySelector("#waterfall");if(!waterfall||waterfall.classList.contains("lw-converted")){return}waterfall.classList.add("lw-converted")
;const items=Array.from(waterfall.querySelectorAll('li[class*="uid_hidden_"]'));waterfall.innerHTML="",items.forEach(li=>{
const titleLink=li.querySelector("h3.xw0 a"),coverImg=li.querySelector(".c.cl img");if(!titleLink){return}const item=document.createElement("div");item.className="lw-item",
item.dataset.url=titleLink.href;const title=document.createElement("div");title.className="lw-title",title.innerHTML=`<a href="${titleLink.href}">${titleLink.textContent}</a>`
;const preview=document.createElement("div")
;preview.className="lw-preview",coverImg?.src&&!coverImg.src.includes("nophoto")?preview.innerHTML=`<div class="lw-thumb"><img src="${coverImg.src}" loading="lazy"></div>`:preview.innerHTML='<span class="lw-loading">加载预览...</span>',
item.appendChild(title),item.appendChild(preview),waterfall.appendChild(item)})}async processItem(item){if(item.dataset.processed){return}item.dataset.processed="1";const url=item.dataset.url
;if(!url){return}const tid=this.getTid(url);if(!tid){return}const preview=item.querySelector(".lw-preview");if(preview){try{const cacheKey=`lw_prev_${tid}`,cached=Storage.get(cacheKey,null)
;if(cached&&Date.now()-cached.time<864e5){return void this.render(preview,cached.images)}await this.acquireSlot();const images=await this.fetchImages(url);this.releaseSlot(),
images.length>0&&Storage.set(cacheKey,{images:images,time:Date.now()}),this.render(preview,images)}catch{preview.innerHTML='<span class="lw-error">加载失败</span>'}}}async fetchImages(url){
const res=await fetch(url,{credentials:"include"}),html=await res.text(),imgs=(new DOMParser).parseFromString(html,"text/html").querySelectorAll(".t_fsz img[zoomfile], .pcb img[zoomfile]"),images=[]
;return imgs.forEach(img=>{const el=img,src=el.getAttribute("zoomfile")||el.src;!src||src.includes("none.gif")||src.includes("icon")||images.includes(src)||images.push(src)}),images.slice(0,4)}
render(container,images){container.innerHTML="",0!==images.length?images.forEach((src,idx)=>{const thumb=document.createElement("div");thumb.className="lw-thumb"
;const img=document.createElement("img");img.src=src,img.loading="lazy",img.onclick=e=>{e.preventDefault(),e.stopPropagation(),Lightbox.show(images,idx)},img.onerror=()=>{thumb.remove()},
thumb.appendChild(img),container.appendChild(thumb)}):container.innerHTML='<span class="lw-empty">暂无预览</span>'}getTid(url){const m=url.match(/tid[=\/](\d+)/);return m?m[1]:null}acquireSlot(){
return this.pending<this.maxConcurrent?(this.pending++,Promise.resolve()):new Promise(r=>this.queue.push(()=>{this.pending++,r()}))}releaseSlot(){this.pending--;const next=this.queue.shift()
;next&&setTimeout(next,100)}injectStyles(){if(document.getElementById("lw-css")){return}const style=document.createElement("style");style.id="lw-css",
style.textContent="\n      /* 转换瀑布流为列表 */\n      #waterfall.lw-converted {\n        display: block !important;\n        height: auto !important;\n        width: 100% !important;\n      }\n\n      /* 帖子项 */\n      .lw-item {\n        padding: 12px 0;\n        border-bottom: 1px solid #eee;\n      }\n\n      /* 标题 */\n      .lw-title a {\n        font-size: 14px;\n        color: #333;\n        text-decoration: none;\n        line-height: 1.5;\n      }\n      .lw-title a:hover { color: #1890ff; }\n\n      /* 预览区 */\n      .lw-preview {\n        display: flex;\n        gap: 8px;\n        margin: 8px 0;\n      }\n\n      /* 缩略图 */\n      .lw-thumb {\n        width: 200px;\n        height: 180px;\n        border-radius: 4px;\n        cursor: pointer;\n        background: #f5f5f5;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      }\n      .lw-thumb img {\n        max-width: 100%;\n        max-height: 100%;\n        object-fit: contain;\n      }\n\n\n\n      .lw-loading, .lw-empty, .lw-error {\n        font-size: 12px;\n        color: #ccc;\n      }\n      .lw-error { color: #f56c6c; }\n    ",
document.head.appendChild(style)}static clearCache(){Storage.listKeys().forEach(k=>{k.startsWith("lw_prev_")&&Storage.delete(k)})}}const _PopupWindow=class{static open(url,config={}){
this.currentOverlay&&this.close(),this.currentConfig={width:1200,height:800,title:"详情预览",closeOnOverlay:!0,closeOnEsc:!0,className:"popup-window",...config};const overlay=document.createElement("div")
;overlay.className=`${this.currentConfig.className}-overlay`,
overlay.style.cssText="\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: rgba(0, 0, 0, 0.7);\n      z-index: 99999;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      animation: fadeIn 0.2s ease-in;\n    "
;const popup=document.createElement("div");popup.className=`${this.currentConfig.className}-container`,
popup.style.cssText=`\n      width: ${this.currentConfig.width}px;\n      height: ${this.currentConfig.height}px;\n      max-width: 95vw;\n      max-height: 90vh;\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n      animation: slideIn 0.3s ease-out;\n    `
;const header=document.createElement("div")
;header.style.cssText="\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 12px 16px;\n      background: #f5f5f5;\n      border-bottom: 1px solid #e0e0e0;\n    "
;const title=document.createElement("div");title.style.cssText="\n      font-size: 14px;\n      color: #333;\n      font-weight: 500;\n    ",title.textContent=this.currentConfig.title
;const closeBtn=document.createElement("button")
;closeBtn.innerHTML="✕",closeBtn.style.cssText="\n      width: 28px;\n      height: 28px;\n      border: none;\n      background: #e0e0e0;\n      border-radius: 4px;\n      cursor: pointer;\n      font-size: 16px;\n      color: #666;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s;\n    ",
closeBtn.onmouseover=()=>{closeBtn.style.background="#d0d0d0",closeBtn.style.color="#333"},closeBtn.onmouseout=()=>{closeBtn.style.background="#e0e0e0",closeBtn.style.color="#666"},
closeBtn.onclick=()=>this.close(),header.appendChild(title),header.appendChild(closeBtn);const iframe=document.createElement("iframe");if(iframe.src=url,
iframe.style.cssText="\n      flex: 1;\n      border: none;\n      width: 100%;\n      height: 100%;\n    ",this.currentConfig.onLoad&&(iframe.onload=()=>{
this.currentConfig?.onLoad&&this.currentConfig.onLoad(iframe)}),popup.appendChild(header),popup.appendChild(iframe),overlay.appendChild(popup),this.currentConfig.closeOnOverlay&&(overlay.onclick=e=>{
e.target===overlay&&this.close()}),this.currentConfig.closeOnEsc){const handleEsc=e=>{"Escape"===e.key&&(this.close(),document.removeEventListener("keydown",handleEsc))}
;document.addEventListener("keydown",handleEsc)}document.body.appendChild(overlay),this.currentOverlay=overlay,this.injectStyles()}static close(){this.currentOverlay&&(this.currentOverlay.remove(),
this.currentOverlay=null,this.currentConfig=null)}static isOpen(){return null!==this.currentOverlay}static injectStyles(){if(document.getElementById("popup-window-styles")){return}
const style=document.createElement("style")
;style.id="popup-window-styles",style.textContent="\n      @keyframes fadeIn {\n        from { opacity: 0; }\n        to { opacity: 1; }\n      }\n      \n      @keyframes slideIn {\n        from {\n          opacity: 0;\n          transform: scale(0.9) translateY(-20px);\n        }\n        to {\n          opacity: 1;\n          transform: scale(1) translateY(0);\n        }\n      }\n    ",
document.head.appendChild(style)}};_PopupWindow.currentOverlay=null,_PopupWindow.currentConfig=null;let PopupWindow=_PopupWindow;const previewProcessor$1=new LaowangPreview
;async function showCheckInStatus$1(){try{const statsUrl=laowangConfig.checkIn?.statsUrl;if(!statsUrl){return}
const fullUrl=statsUrl.startsWith("http")?statsUrl:`${location.origin}/${statsUrl}`,response=await fetch(fullUrl,{credentials:"include"
}),html=await response.text(),alreadySigned=html.includes("btnvisted")||html.includes("已签到");let stats={lxdays:"0",lxlevel:"0",lxreward:"0",lxtdays:"0",signUrl:fullUrl};try{
const doc=(new DOMParser).parseFromString(html,"text/html");stats.lxdays=doc.querySelector("#lxdays")?.value||"0",stats.lxlevel=doc.querySelector("#lxlevel")?.value||"0",
stats.lxreward=doc.querySelector("#lxreward")?.value||"0",stats.lxtdays=doc.querySelector("#lxtdays")?.value||"0";const fastSignBtn=doc.querySelector("a.J_chkitot");if(fastSignBtn){
const href=fastSignBtn.getAttribute("href");href&&(stats.signUrl=href.startsWith("http")?href:`${location.origin}/${href}`)}}catch(e){}const target=await function(selector,timeout=5e3){
return new Promise(resolve=>{const element=document.querySelector(selector);if(element){return resolve(element)}const observer=new MutationObserver(()=>{const el=document.querySelector(selector)
;el&&(observer.disconnect(),resolve(el))});observer.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>{observer.disconnect(),resolve(document.querySelector(selector))},timeout)})
}(".xxbt2",1e4);if(target&&!document.getElementById("lm-checkin-info")){const info=document.createElement("div");info.id="lm-checkin-info",
info.style.cssText="margin-bottom:15px;padding:12px 16px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:8px;font-size:14px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 6px rgba(0,0,0,0.1);"
;const statsContainer=document.createElement("div");statsContainer.style.cssText="display:flex;gap:16px;align-items:center;"
;const createStatItem=(label,value,unit="")=>`\n                    <div style="text-align:center;">\n                        <div style="font-size:11px;opacity:0.8;margin-bottom:2px;">${label}</div>\n                        <div style="font-size:15px;font-weight:bold;">${value}<span style="font-size:11px;font-weight:normal;margin-left:1px">${unit}</span></div>\n                    </div>\n                `
;statsContainer.innerHTML=`\n                ${createStatItem("连续签到",stats.lxdays,"天")}\n                <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>\n                ${createStatItem("签到等级","Lv."+stats.lxlevel)}\n                <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>\n                ${createStatItem("积分奖励",stats.lxreward)}\n                <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>\n                ${createStatItem("总天数",stats.lxtdays,"天")}\n            `,
info.appendChild(statsContainer);const rightContainer=document.createElement("div");rightContainer.style.cssText="display:flex;align-items:center;gap:12px;"
;const statusSpan=document.createElement("span");if(statusSpan.innerHTML=alreadySigned?"✅ 今日已签":"⏰ 待签到",statusSpan.style.cssText="font-weight:500;font-size:13px;",
rightContainer.appendChild(statusSpan),!alreadySigned){const btn=document.createElement("a");btn.href="javascript:void(0)",btn.textContent="去签到",
btn.style.cssText="color:#fff;background:rgba(255,255,255,0.2);padding:6px 16px;border-radius:4px;text-decoration:none;cursor:pointer;font-weight:bold;transition:background 0.2s;",btn.onclick=e=>{
var url;e.preventDefault(),url=stats.signUrl,PopupWindow.open(url,{width:500,height:400,title:"🎯 签到验证",onLoad:iframe=>{try{Toast.success("✅ 请完成验证");let isSubmitting=!1
;const checkInterval=setInterval(()=>{try{const doc=iframe.contentDocument||iframe.contentWindow?.document;if(!doc){return}if(isSubmitting){return}
const captchaInput=doc.querySelector("#clicaptcha-submit-info");if(captchaInput&&captchaInput.value){clearInterval(checkInterval),isSubmitting=!0,Toast.info("✅ 验证完成，正在签到...")
;const form=doc.querySelector("#v2_captcha_form"),signBtn=doc.querySelector(".J_chkitot");if(form){form.submit()}else if(signBtn){signBtn.click()}else{
const btn=doc.querySelector('button[type="submit"]');btn&&btn.click()}return void setTimeout(()=>{window.location.reload()},1e3)}const bodyText=doc.body?.textContent||""
;(bodyText.includes("签到成功")||bodyText.includes("恭喜")||bodyText.includes("已签到"))&&(clearInterval(checkInterval),PopupWindow.close(),window.location.reload())}catch(e){}},500)
;setTimeout(()=>clearInterval(checkInterval),6e4)}catch(error){}}})},btn.onmouseover=()=>btn.style.background="rgba(255,255,255,0.3)",btn.onmouseout=()=>btn.style.background="rgba(255,255,255,0.2)",
rightContainer.appendChild(btn)}info.appendChild(rightContainer);const blockContainer=target.closest(".block")
;blockContainer&&blockContainer.parentNode?blockContainer.parentNode.insertBefore(info,blockContainer):target.parentNode&&target.parentNode.insertBefore(info,target)}}catch(error){}}
const LaowangModule={type:"laowang",name:"老王论坛",config:laowangConfig,hasCheckIn:!0,hasPreview:!0,async init(){if(laowangConfig.styles){const style=document.createElement("style")
;style.id="lm-styles-laowang",style.textContent=laowangConfig.styles,document.head.appendChild(style)}"undefined"!=typeof GM_registerMenuCommand&&GM_registerMenuCommand("🗑️ 清空图片缓存",()=>{
LaowangPreview.clearCache(),Toast.success("图片缓存已清空"),setTimeout(()=>location.reload(),500)}),function(){const remove=()=>{const viewer=document.getElementById("image-viewer");viewer&&viewer.remove()}
;remove(),new MutationObserver(remove).observe(document.body,{childList:!0,subtree:!1})}(),document.querySelectorAll('.deanbkms[id^="forum_rules_"]').forEach(el=>{el.style.display="none"})},
async handlePage(pageType){switch(pageType){case"home":await showCheckInStatus$1();break;case"list":!function(){const url=new URL(location.href)
;"forumdisplay"===url.searchParams.get("mod")&&url.searchParams.has("fid")&&(url.searchParams.has("orderby")||(url.searchParams.set("filter","author"),url.searchParams.set("orderby","dateline"),
location.href=url.toString()))}(),await previewProcessor$1.processListPage();break;case"search":await previewProcessor$1.processSearchPage()}},async checkIn(){await showCheckInStatus$1()}
},moxingConfig={type:"moxing",name:"魔性论坛",domain:/moxing\.app|moxing\.vip|moxing\.lol/,pages:{home:[/^\/$/,/^\/index\.php$/,/^\/forum\.php$/],
list:[/forum-\d+-\d+\.html/,/forum\.php\?mod=forumdisplay/],search:[/search\.php\?mod=forum/]},preview:{listContainer:"#threadlisttableid",itemSelector:'tbody[id^="normalthread_"]',
linkSelector:"a.s.xst",imageSelector:".t_fsz img.zoom, .t_fsz img.inline-image, .t_fsz img.attach-img, .ql-editor img.inline-image, .ql-snow img.attach-img, .pct img.inline-image",maxImages:4},
checkIn:{enabled:!1,type:"auto",statsUrl:"plugin.php?id=k_misign:sign",buttonSelector:"a.btn.J_chkitot",signedSelector:"span.btn.btnvisted",cacheKey:"MOXING_CHECKIN_STATUS",infoBar:{
target:'a[href*="/home.php?mod=task"]',position:"beforebegin",style:"compact"}}};class MoxingPreview{constructor(){this.pending=0,this.maxConcurrent=3,this.queue=[],this.imageObserver=null,
this.imageObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const img=entry.target,lazySrc=img.dataset.lazySrc;lazySrc&&!img.src&&(img.src=lazySrc,
this.imageObserver?.unobserve(img))}})},{rootMargin:"200px 0px",threshold:0})}async processListPage(){if(location.search.includes("forumdefstyle=no")){const url=new URL(location.href)
;return url.searchParams.set("forumdefstyle","yes"),void location.replace(url.href)}this.injectStyles();const getTable=()=>document.querySelectorAll('#threadlisttableid tbody[id^="normalthread_"]')
;let tbodies=getTable();if(0===tbodies.length){for(let i=0;i<10&&(await new Promise(r=>setTimeout(r,500)),tbodies=getTable(),!(tbodies.length>0));i++){}}for(const tbody of tbodies){
this.processThreadRow(tbody)}}async processThreadRow(tbody){if(tbody.dataset.mxProcessed){return}tbody.dataset.mxProcessed="1"
;const link=tbody.querySelector("a.s.xst")||tbody.querySelector('a[href^="thread-"]')||tbody.querySelector('th div a[href^="thread-"]');if(!link?.href){return}const url=link.href,tid=this.getTid(url)
;if(!tid){return}const previewTr=document.createElement("tr");previewTr.className="mx-preview-row";const previewTd=document.createElement("td");previewTd.colSpan=5,previewTd.className="mx-preview-td"
;const previewContainer=document.createElement("div");previewContainer.className="mx-preview-container",previewContainer.innerHTML='<span class="mx-loading">加载预览...</span>',
previewTd.appendChild(previewContainer),previewTr.appendChild(previewTd),tbody.appendChild(previewTr),this.loadPreview(previewContainer,url,tid)}async processSearchPage(){this.injectStyles()
;const getItems=()=>document.querySelectorAll("#threadlist li.pbw.z");let items=getItems();if(0===items.length){for(let i=0;i<10&&(await new Promise(r=>setTimeout(r,500)),items=getItems(),
!(items.length>0));i++){}}for(const item of items){this.processSearchItem(item)}}async processSearchItem(item){if(item.dataset.mxProcessed){return}item.dataset.mxProcessed="1"
;const link=item.querySelector("h3.xs3 a");if(!link?.href){return}const url=link.href,tid=this.getTid(url);if(!tid){return}const previewContainer=document.createElement("div")
;previewContainer.className="mx-preview-container mx-search-preview",previewContainer.innerHTML='<span class="mx-loading">加载预览...</span>',item.appendChild(previewContainer),
this.loadPreview(previewContainer,url,tid)}async loadPreview(container,url,tid){try{container.setAttribute("data-url",url);const cacheKey=`mx_prev_v2_${tid}`,cached=Storage.get(cacheKey,null)
;if(cached&&Date.now()-cached.time<864e5){return void this.render(container,cached.images,cached.magnet)}await this.acquireSlot();try{const data=await this.fetchPreviewData(url)
;(data.images.length>0||data.magnet)&&Storage.set(cacheKey,{...data,time:Date.now()}),this.render(container,data.images,data.magnet)}finally{this.releaseSlot()}}catch(e){
container.innerHTML='<span class="mx-error">加载失败</span>'}}async fetchPreviewData(url){const res=await fetch(url,{credentials:"include"
}),html=await res.text(),doc=(new DOMParser).parseFromString(html,"text/html"),selector=[".t_fsz img",".pcb img",".mbn img",".t_f img",".zoom",".attm img",'img[id^="aimg_"]',"img[zoomfile]","img[file]","img[data-src]","img[data-actualsrc]","img[actualsrc]"].join(","),imgs=doc.querySelectorAll(selector),images=[],baseUrl=new URL(url,location.origin)
;imgs.forEach(img=>{const el=img
;let src=el.getAttribute("zoomfile")||el.getAttribute("file")||el.getAttribute("data-actualsrc")||el.getAttribute("actualsrc")||el.getAttribute("data-src")||el.getAttribute("src");if(!src){return}
if(!src.startsWith("http")&&!src.startsWith("//")&&!src.startsWith("data:")){try{src=new URL(src,baseUrl.href).href}catch(e){return}}const lower=src.toLowerCase()
;["avatar","usergroup","smiley","common/","icon","none.gif","pixel.png","uc_server","online_","rank"].some(key=>lower.includes(key))||images.includes(src)||images.push(src)});let magnet=null
;const magnetLink=doc.querySelector('a[href^="magnet:?xt=urn:btih:"]');if(magnetLink){magnet=magnetLink.href}else{
const text=doc.body.innerText||"",match=text.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/i);if(match){magnet=match[0]}else{const hashMatch=text.match(/\b[a-fA-F0-9]{40}\b/)
;hashMatch&&(magnet=`magnet:?xt=urn:btih:${hashMatch[0]}`)}}return{images:images.slice(0,4),magnet:magnet}}render(container,images,magnet){container.innerHTML=""
;const hasImages=images.length>0,hasMagnet=!!magnet;if(!hasImages&&!hasMagnet){container.innerHTML="";const emptyTip=document.createElement("div");emptyTip.className="mx-empty",
emptyTip.innerText="暂无预览 ";const retryBtn=document.createElement("a");return retryBtn.innerText="[重试]",retryBtn.style.cursor="pointer",retryBtn.onclick=e=>{e.preventDefault(),
container.innerHTML='<span class="mx-loading">重试中...</span>';const url=container.getAttribute("data-url");url&&this.fetchPreviewData(url).then(data=>{this.render(container,data.images,data.magnet)})},
emptyTip.appendChild(retryBtn),void container.appendChild(emptyTip)}const wrapper=document.createElement("div");if(wrapper.style.cssText="display:flex;flex-direction:column;gap:8px;",hasImages){
const imgBox=document.createElement("div");imgBox.style.cssText="display:flex;gap:10px;flex-wrap:nowrap;overflow:hidden;",images.forEach((src,idx)=>{const thumb=document.createElement("div")
;thumb.className="mx-thumb";let fullSrc=src.startsWith("http")?src:`${location.origin}/${src}`;src.startsWith("//")&&(fullSrc="https:"+src);const img=document.createElement("img")
;img.dataset.lazySrc=fullSrc,img.referrerPolicy="origin",img.style.cssText="display:block;opacity:0;transition:opacity 0.3s;",img.onclick=e=>{e.preventDefault(),e.stopPropagation(),
Lightbox.show(images.map(s=>s.startsWith("http")?s:s.startsWith("//")?"https:"+s:`${location.origin}/${s}`),idx)},img.onload=()=>{thumb.style.background="none",img.style.opacity="1"},img.onerror=()=>{
thumb.innerHTML='<span style="color:#999;font-size:11px;">加载失败</span>',thumb.style.background="#f5f5f5"},thumb.appendChild(img),imgBox.appendChild(thumb),
this.imageObserver?this.imageObserver.observe(img):img.src=fullSrc}),wrapper.appendChild(imgBox)}if(hasMagnet){const magBox=document.createElement("div")
;magBox.style.cssText="padding:8px 12px;background:#f0f7ff;border:1px solid #cceeff;border-radius:4px;color:#0066cc;font-size:12px;cursor:pointer;word-break:break-all;display:flex;justify-content:space-between;align-items:center;",
magBox.innerHTML=`\n                <span>${magnet}</span>\n                <span class="mx-copy-tip" style="margin-left:8px;font-weight:bold;color:#f69;">📋</span>\n            `,
magBox.title="点击复制磁力链接",magBox.onclick=e=>{e.preventDefault(),e.stopPropagation(),navigator.clipboard.writeText(magnet);const tip=magBox.querySelector(".mx-copy-tip");tip&&(tip.textContent="✅ 已复制"),
setTimeout(()=>{tip&&(tip.textContent="📋")},1500)},wrapper.appendChild(magBox)}container.appendChild(wrapper)}getTid(url){const m=url.match(/(?:thread-|tid=)(\d+)/);return m?m[1]:null}acquireSlot(){
return this.pending<this.maxConcurrent?(this.pending++,Promise.resolve()):new Promise(r=>this.queue.push(()=>{this.pending++,r()}))}releaseSlot(){this.pending--;const next=this.queue.shift()
;next&&setTimeout(next,100)}injectStyles(){if(document.getElementById("mx-css")){return}const style=document.createElement("style");style.id="mx-css",
style.textContent="\n            .mx-preview-row td {\n                border-bottom: 1px solid #f0f0f0;\n                padding: 5px 10px 15px 10px !important;\n            }\n            .mx-preview-container {\n                display: flex;\n                flex-direction: column;\n                gap: 8px;\n            }\n            .mx-search-preview {\n                margin-top: 10px;\n                padding-top: 10px;\n                border-top: 1px dashed #eee;\n            }\n            .mx-thumb {\n                width: 200px;\n                height: 150px;\n                border-radius: 4px;\n                overflow: hidden;\n                background: #f9f9f9;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                border: 1px solid #eee;\n                cursor: pointer;\n                flex-shrink: 0;\n            }\n            .mx-thumb img {\n                max-width: 100%;\n                max-height: 100%;\n                object-fit: contain;\n                transition: transform 0.2s;\n            }\n            .mx-thumb:hover img {\n                transform: scale(1.05);\n            }\n            .mx-loading, .mx-empty, .mx-error {\n                font-size: 13px;\n                color: #999;\n                padding: 10px;\n            }\n            .mx-copy-tip {\n                color: #28a745;\n            }\n        ",
document.head.appendChild(style)}static clearCache(){Storage.listKeys().forEach(k=>{k.startsWith("mx_prev_v2_")&&Storage.delete(k)})}}const previewProcessor=new MoxingPreview
;function createManualButton(container,url){const btn=document.createElement("a");btn.textContent="去签到",
btn.style.cssText="color:#fff;background:rgba(255,255,255,0.2);padding:6px 16px;border-radius:4px;text-decoration:none;cursor:pointer;font-weight:bold;transition:background 0.2s;",btn.onclick=e=>{
e.preventDefault(),PopupWindow.open(url,{width:500,height:400,title:"签到"})},btn.onmouseover=()=>btn.style.background="rgba(255,255,255,0.3)",
btn.onmouseout=()=>btn.style.background="rgba(255,255,255,0.2)",container.appendChild(btn)}const MoxingModule={...createSiteModule(moxingConfig),init:async()=>{
GM_registerMenuCommand("🧹 清除魔性预览缓存",()=>{MoxingPreview.clearCache(),Toast.success("缓存已清除")});const path=location.pathname+location.search;let pageType="other"
;moxingConfig.pages.home.some(r=>r.test(path))?pageType="home":moxingConfig.pages.list.some(r=>r.test(path))?pageType="list":moxingConfig.pages.search?.some(r=>r.test(path))&&(pageType="search"),
"home"===pageType?await async function(){try{const statsUrl="plugin.php?id=k_misign:sign",fullUrl=`${location.origin}/${statsUrl}`,response=await fetch(fullUrl,{credentials:"include"
}),html=await response.text(),alreadySigned=html.includes("btnvisted")||html.includes("已签到");let stats={lxdays:"0",lxlevel:"0",lxreward:"0",lxtdays:"0",signUrl:fullUrl};try{
const doc=(new DOMParser).parseFromString(html,"text/html");stats.lxdays=doc.querySelector("#lxdays")?.value||"0",stats.lxlevel=doc.querySelector("#lxlevel")?.value||"0",
stats.lxreward=doc.querySelector("#lxreward")?.value||"0",stats.lxtdays=doc.querySelector("#lxtdays")?.value||"0";const fastSignBtn=doc.querySelector('a.J_chkitot, a[href*="operation=qiandao"]')
;if(fastSignBtn){const href=fastSignBtn.getAttribute("href");href&&(stats.signUrl=href.startsWith("http")?href:`${location.origin}/${href}`)}else{
const onClickSignBtn=doc.querySelector('a[onclick*="qiandao"]');if(onClickSignBtn){
const urlMatch=(onClickSignBtn.getAttribute("onclick")||"").match(/['"]([^'"]+?plugin\.php[^'"]*?operation=qiandao[^'"]*?)['"]/i)
;urlMatch&&(stats.signUrl=urlMatch[1].startsWith("http")?urlMatch[1]:`${location.origin}/${urlMatch[1]}`)}}}catch(e){}if(stats.signUrl===fullUrl||!stats.signUrl.includes("operation=qiandao")){
const navSignBtn=document.querySelector('a[href*="id=k_misign:sign"][href*="operation=qiandao"], a:has(#fx_checkin_b)'),href=navSignBtn?.getAttribute("href")
;href&&(stats.signUrl=href.startsWith("http")?href:`${location.origin}/${href}`)}let target=await function(selector,timeout=1e4){return new Promise(resolve=>{const el=document.querySelector(selector)
;if(el){return resolve(el)}const observer=new MutationObserver(()=>{const el2=document.querySelector(selector);el2&&(observer.disconnect(),resolve(el2))});observer.observe(document.body,{childList:!0,
subtree:!0}),setTimeout(()=>{observer.disconnect(),resolve(document.querySelector(selector))},timeout)})}("#portal_block_305",1e4);if(!target){if(target=document.querySelector("#pt"),target){
const parent=target.parentNode;if(parent){const placeholder=document.createElement("div");parent.insertBefore(placeholder,target.nextSibling),target=placeholder}}else{
target=document.querySelector(".wp")}}if(target&&!document.getElementById("mx-checkin-info")){const info=document.createElement("div");info.id="mx-checkin-info",
info.style.cssText="margin-bottom:15px;padding:12px 16px;background:linear-gradient(135deg,#c471ed,#f64f59);color:#fff;border-radius:8px;font-size:14px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 6px rgba(0,0,0,0.1);"
;const createStatItem=(label,value,unit="")=>`\n                <div style="text-align:center;">\n                    <div style="font-size:11px;opacity:0.8;margin-bottom:2px;">${label}</div>\n                    <div style="font-size:15px;font-weight:bold;">${value}<span style="font-size:11px;font-weight:normal;margin-left:1px">${unit}</span></div>\n                </div>\n            `
;info.innerHTML=`\n                <div style="display:flex;gap:16px;align-items:center;">\n                    ${createStatItem("连续签到",stats.lxdays,"天")}\n                    <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>\n                    ${createStatItem("签到等级","Lv."+stats.lxlevel)}\n                    <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>\n                    ${createStatItem("积分奖励",stats.lxreward)}\n                    <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>\n                    ${createStatItem("总天数",stats.lxtdays,"天")}\n                </div>\n            `
;const rightDiv=document.createElement("div");rightDiv.style.cssText="display:flex;align-items:center;gap:12px;";const statusSpan=document.createElement("span");statusSpan.id="mx-status-text",
statusSpan.textContent=alreadySigned?"✅ 今日已签":"🚀 自动签到中...",statusSpan.style.fontWeight="500",rightDiv.appendChild(statusSpan),
!alreadySigned&&stats.signUrl&&stats.signUrl.includes("operation=qiandao")?fetch(stats.signUrl,{credentials:"include",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async res=>{
const text=await res.text();text.includes("签到成功")||text.includes("已签到")||text.includes("恭喜")||text.includes("CDATA")?(statusSpan.textContent="✅ 签到成功",Toast.success("✅ 魔性论坛自动签到成功"),
setTimeout(()=>location.reload(),2e3)):(statusSpan.textContent="❌ 自动失败",createManualButton(rightDiv,stats.signUrl))}).catch(err=>{statusSpan.textContent="❌ 网络错误",
createManualButton(rightDiv,stats.signUrl)}):alreadySigned||(statusSpan.textContent="⏰ 待签到",createManualButton(rightDiv,fullUrl)),info.appendChild(rightDiv),
target.parentNode?.insertBefore(info,target)}}catch(e){}}():"list"===pageType?await previewProcessor.processListPage():"search"===pageType&&await previewProcessor.processSearchPage()},
handlePage:async()=>{}},SjsModule=createSiteModule({type:"sjs",name:"司机社",domain:/sjs47\.com|xsijishe\.net/,pages:{home:[/^\/$/,/^\/index\.php$/,/^\/forum\.php$/],
list:[/forum-\d+-\d+\.html/,/thread-\d+-\d+-\d+\.html/,/forum\.php\?mod=forumdisplay/,/forum\.php\?mod=viewthread/,/\.php/],search:[/search\.php\?mod=forum/]},checkIn:{enabled:!0,type:"auto",
statsUrl:"plugin.php?id=k_misign:sign",buttonSelector:"a.btn.J_chkitot",signedSelector:"span.btn.btnvisted",cacheKey:"SJS_CHECKIN_STATUS",infoBar:{target:".nex_top_bg",position:"beforeend",
style:"full"}},
styles:"\n        /* 司机社预览图增强：完整显示不裁剪 */\n        .nex_thread_pics a {\n            background-size: contain !important;\n            background-color: #000 !important;\n        }\n        \n        /* 确保背景容器是相对定位 */\n        .nex_top_bg {\n            position: relative !important;\n        }\n\n        /* 签到台绝对定位在背景图右下角 */\n        #lm-checkin-bar {\n            position: absolute;\n            right: 50px;\n            bottom: 25px; \n            width: 480px;  /* 固定宽度，防止挤压 */\n            z-index: 100;\n            border-radius: 10px;\n            box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n            margin: 0 !important; /* 清除可能的外边距 */\n        }\n    "
},{async onInit(){(/misc\.php\?mod=mobile/.test(location.href)||/mobile=1/.test(location.href))&&(location.href=location.origin+"/forum.php")},async onList(){initSjsLightbox()},async onHome(){
initSjsLightbox()}});function initSjsLightbox(){document.querySelectorAll(".nex_thread_pics a").forEach(el=>(el=>{el.dataset.lmLightboxInit||(el.dataset.lmLightboxInit="true",
el.style.cursor="zoom-in",el.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation();let groupContainer=el.closest(".nex_forumlist_pics")
;groupContainer||(groupContainer=el.closest("tr")||el.closest("li")||el.parentNode);const group=groupContainer?.querySelectorAll(".nex_thread_pics a")||[el],images=[];let currentIndex=0
;group.forEach(item=>{const htmlItem=item;let url="";const bgImg=window.getComputedStyle(htmlItem).backgroundImage
;url=bgImg&&"none"!==bgImg?bgImg.slice(4,-1).replace(/["']/g,""):htmlItem.querySelector("img")?.src||"",url&&(images.push(url),item===el&&(currentIndex=images.length-1))}),
images.length>0&&Lightbox.show(images,currentIndex)},!0))})(el))}const GCBT_CONFIG={DEBUG_MODE:!0,selectors:{postList:"article.post-list",contentArea:".content-area",entryTitle:"h2.entry-title a",
metaDate:"li.meta-date time",pagination:"main .numeric-pagination",entryContent:".entry-content, .entry-wrapper, .article-content",imageSelectors:[".entry-content img",".entry-wrapper img"],
contentPageTitle:"h1, h2.entry-title, .entry-title, article h1, article h2",contentPageContainer:"article, .entry-content, .content-area, main"},cacheTTL:864e5,maxPreviewImages:4,concurrentLimit:20,
DATA_VERSION:4,hasCheckIn:!1,hasPreview:!0,btSites:[{name:"bxmho",pattern:/(?:\/\/bt\.bxmho\.cn\/list\.php\?name=|userscript\.html\?name=)([0-9a-z]+)/i,url:"https://bt.bxmho.cn/list.php",method:"GET",
paramName:"name",getHash:match=>{const hashMatch=match.match(/([0-9a-z]+)$/i);return hashMatch?hashMatch[1]:""}},{name:"ivcbt",
pattern:/(?:\/\/bt\.ivcbt\.com\/list\.php\?name=|userscript\.html\?name=)([0-9a-z]+)/i,url:"https://bt.ivcbt.com/list.php",method:"GET",paramName:"name",getHash:match=>{
const hashMatch=match.match(/([0-9a-z]+)$/i);return hashMatch?hashMatch[1]:""}},{name:"rmdown",pattern:/\/\/(?:www\.)?rmdown\.com\/link\.php\?hash=([0-9a-fA-F]+)/i,
url:"https://www.rmdown.com/link.php",paramName:"hash",method:"GET",getHash:match=>{const hashMatch=match.match(/hash=([0-9a-fA-F]+)/i);return hashMatch?hashMatch[1]:""}}]}
;let StyleManager$1=((_a=class{static init(){this.styleInjected||(this.injectStyles(),this.styleInjected=!0)}static injectStyles(){const styleSheet=document.createElement("style")
;styleSheet.id="gcbt-styles",
styleSheet.textContent='.gcbt-card-list{display:flex;flex-direction:column;gap:18px;margin-top:12px}.gcbt-card{background:#fff;border:1px solid #e6eaf3;border-radius:14px;padding:18px;box-shadow:0 8px 24px rgba(15,23,42,.05)}.gcbt-card__title{font-size:18px;line-height:1.4;margin:0 0 10px;font-weight:600}.gcbt-card__title a{color:#111;text-decoration:none}.gcbt-card__title a:hover{color:#2563eb}.gcbt-card__images{display:flex;gap:12px;flex-wrap:nowrap;overflow-x:auto;margin-bottom:12px;scrollbar-width:thin}.gcbt-card__img,.gcbt-card__img-placeholder,.gcbt-card__placeholder{flex:0 0 calc(25% - 9px);height:190px;border-radius:10px;border:1px solid #e5e8f0;background:#0b111f;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:13px;color:#c6cedf;position:relative}.gcbt-card__img img{width:100%;height:100%;object-fit:contain;background:#000}.gcbt-card__img img.is-broken{filter:grayscale(1);opacity:.6}.gcbt-card__more{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.65);color:#fff;font-size:12px;padding:2px 8px;border-radius:12px}.gcbt-card__placeholder{cursor:default}.gcbt-card__placeholder.is-error{border-color:#f0978f;background:#fff5f4;color:#d93025}.gcbt-card__magnet-block{border-top:1px dashed #e2e6ef;padding-top:10px}.gcbt-card__magnet-title{font-size:13px;font-weight:600;color:#343a4c;margin-bottom:6px}.gcbt-card__magnet-list{display:flex;flex-direction:column;gap:6px;font-size:13px}.gcbt-card__magnet-row{display:flex;gap:8px;align-items:flex-start}.gcbt-card__magnet-label{font-weight:600;color:#6b7280;min-width:50px}.gcbt-card__magnet-text{color:#1f2937;word-break:break-all;text-decoration:none}.gcbt-card__magnet-text:hover{color:#2563eb;text-decoration:underline}.gcbt-card__magnet-empty{color:#a0a7b6;font-size:13px}.gcbt-detail-magnets{margin-bottom:18px;padding:14px;border:1px solid #e4ecf6;border-radius:12px;background:#f8fbff;box-shadow:0 4px 12px rgba(15,23,42,.05)}.gcbt-detail-magnets__title{font-weight:600;font-size:14px;color:#1f2a37;margin-bottom:6px}.gcbt-detail-magnets__item{font-size:13px;color:#111;word-break:break-all;padding:4px 0;border-top:1px dashed #e1e7f0}.gcbt-detail-magnets__item:first-of-type{border-top:none;padding-top:0}.rollbar-item.tap-dark,.navbar-button:has(.mdi-brightness-4){display:none!important}body[class*="dark"],html[class*="dark"]{background:#f5f6f8!important;color:#333!important}',
document.documentElement.appendChild(styleSheet)}static unhidePosts(){const styleSheet=document.getElementById("gcbt-styles")
;styleSheet&&(styleSheet.textContent=styleSheet.textContent?.replace("article.post-list { visibility: hidden; }","")||"")}}).styleInjected=!1,_a),DomManager$1=class{static cleanPage(){
document.body.classList.remove("dark","dark-mode","night-mode"),document.documentElement.classList.remove("dark","dark-mode","night-mode"),document.body.style.backgroundColor="#fff",
document.body.style.color="#333"}static isContentPage(){
const path=window.location.pathname,looksLikeDetail=/\/(download|post)\//i.test(path),listPage=null!==document.querySelector(GCBT_CONFIG.selectors.postList),hasArticleContent=null!==document.querySelector(".article-content, .single, .single-post, .page")
;return!!looksLikeDetail||!(listPage&&!looksLikeDetail)&&hasArticleContent&&!listPage}static async displayMagnetLinkOnContentPage(){if(!this.isContentPage()){return}
const titleEl=document.querySelector(GCBT_CONFIG.selectors.contentPageTitle),contentRoot=document.querySelector(GCBT_CONFIG.selectors.entryContent);if(!titleEl&&!contentRoot){return}
const anchorParent=contentRoot||titleEl?.parentElement||document.body;if(anchorParent.querySelector(".gcbt-detail-magnets")){return}
const insertBeforeNode=titleEl||anchorParent.firstElementChild||anchorParent.firstChild;try{
const content=document.querySelector(GCBT_CONFIG.selectors.entryContent)||document.body,magnets=await this.extractMagnetsFromContent(content);if(!magnets.length){return}
const container=document.createElement("div");container.className="gcbt-detail-magnets",magnets.forEach(magnet=>{const row=document.createElement("div");if(row.className="gcbt-detail-magnets__item",
magnet.startsWith("http://")||magnet.startsWith("https://")){const tip=document.createElement("span");tip.textContent="⚠️ 需手动访问：",tip.style.color="#ff6b6b",tip.style.marginRight="8px",
row.appendChild(tip);const link=document.createElement("a");return link.href=magnet,link.textContent=magnet,link.className="gcbt-detail-magnets__link",link.style.cursor="pointer",
link.style.textDecoration="underline",link.style.color="#2563eb",link.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),GCBT_CONFIG.DEBUG_MODE;try{GM_openInTab(magnet,{active:!0,
insert:!0,setParent:!0})}catch(err){window.open(magnet,"_blank")}}),row.appendChild(link),void container.appendChild(row)}}),
insertBeforeNode instanceof Node?anchorParent.insertBefore(container,insertBeforeNode):anchorParent.prepend(container)}catch(e){}}static async extractMagnetsFromContent(content){
const directMagnet=this.findDirectMagnet(content);if(directMagnet){return[directMagnet]}const externalMagnet=await this.findExternalMagnet(content);if(externalMagnet){return[externalMagnet]}
const hashMagnet=this.findHashMagnet(content);return hashMagnet?[hashMagnet]:[]}static findDirectMagnet(content){const anchor=content.querySelector('a[href^="magnet:?xt=urn:btih:"]');if(anchor?.href){
return anchor.href.replace(/&amp;/gi,"&").trim()}const match=(content.innerHTML||document.documentElement.innerHTML).match(/magnet:\?xt=urn:btih:[0-9a-fA-F]{32,40}/i)
;return match?match[0].replace(/&amp;/gi,"&").trim():null}static findHashMagnet(content){
const text=content.textContent||"",hashMatch=text.match(/[0-9a-fA-F]{40}/)?.[0]||text.match(/[0-9a-fA-F]{32}/)?.[0]||null;return hashMatch?`magnet:?xt=urn:btih:${hashMatch}`:null}
static async findExternalMagnet(content){const html=content.innerHTML||document.documentElement.innerHTML,btLinks=[];for(const site of GCBT_CONFIG.btSites){const match=html.match(site.pattern)?.[0]
;if(match){const fullUrl=match.startsWith("http")?match:`https:${match}`;btLinks.push(fullUrl)}}if(!btLinks.length){return null}for(const url of btLinks){try{
const magnet=await this.fetchExternalMagnet(url);if(magnet){return magnet}}catch(error){}}return btLinks.length>0?btLinks[0]:null}static async fetchExternalMagnet(url){try{
const site=GCBT_CONFIG.btSites.find(s=>url.match(s.pattern));if(!site){return GCBT_CONFIG.DEBUG_MODE,null}const btMatch=url.match(site.pattern),raw=btMatch?.[0];if(!raw){return null}
const hash=site.getHash(raw);return hash?(GCBT_CONFIG.DEBUG_MODE,await new Promise(resolve=>{
const paramName=site.paramName||"name",requestUrl="GET"===site.method?`${site.url}?${paramName}=${hash}`:site.url,requestConfig={method:site.method,url:requestUrl,headers:{
Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8",DNT:"1",
Connection:"keep-alive","Upgrade-Insecure-Requests":"1"},onload:response=>{if(response.status>=200&&response.status<400){try{
const responseText=response.responseText,doc=(new DOMParser).parseFromString(responseText,"text/html"),codeMatch=(doc.body?.innerText||responseText).match(/Code:\s*([0-9a-fA-F]{32,40})/i)
;if(codeMatch){return void resolve(`magnet:?xt=urn:btih:${codeMatch[1]}`)}const magnetInput=doc.querySelector("#magnetInput");if(magnetInput){
const value=magnetInput.value||magnetInput.getAttribute("value")||void 0;if(value){const cleaned=value.replace(/&amp;/g,"&").trim();return void resolve(cleaned)}}
const magnetBoxInput=doc.querySelector(".magnet-box input");if(magnetBoxInput){const value=magnetBoxInput.getAttribute("value")||magnetBoxInput.value||void 0;if(value){
const cleaned=value.replace(/&amp;/g,"&").trim();return void resolve(cleaned)}}const magnetMatch=responseText.match(/magnet:\?xt=urn:btih:[0-9a-fA-F]{40}[^"'\s]*/i);if(magnetMatch){
const cleaned=magnetMatch[0].replace(/&amp;/g,"&").trim();return void resolve(cleaned)}resolve(null)}catch(parseError){GCBT_CONFIG.DEBUG_MODE,resolve(null)}}else{GCBT_CONFIG.DEBUG_MODE,resolve(null)}
},onerror:error=>{GCBT_CONFIG.DEBUG_MODE,resolve(null)},ontimeout:()=>{GCBT_CONFIG.DEBUG_MODE,resolve(null)}};GM_xmlhttpRequest(requestConfig)})):null}catch(error){return null}}
},PreviewProcessor$1=((_b=class{static async processAll(){const postsWrapper=document.querySelector(".posts-wrapper");if(!postsWrapper){return}
const articles=Array.from(postsWrapper.querySelectorAll("article.post"));if(!articles.length){return}const list=articles.map(article=>{const titleA=article.querySelector(".entry-title a")
;return titleA?.href?{title:titleA.textContent?.trim()||"未命名",url:titleA.href}:null}).filter(item=>!!item);if(!list.length){return}const listContainer=document.createElement("div")
;listContainer.className="gcbt-card-list",list.forEach((item,index)=>{listContainer.appendChild(this.createCard(item,index))}),postsWrapper.replaceWith(listContainer),list.forEach(async(item,index)=>{
const card=listContainer.querySelector(`[data-index="${index}"]`);if(card){this.setLoadingState(card);try{const data=await this.fetchDetail(item.url);this.renderPreview(card,data)}catch(e){
this.setErrorState(card)}}})}static createCard(item,index){const placeholderCount=Math.max(4,GCBT_CONFIG.maxPreviewImages),card=document.createElement("article");return card.className="gcbt-card",
card.dataset.index=String(index),
card.innerHTML=`\n      <h2 class="gcbt-card__title">\n        <a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>\n      </h2>\n      <div class="gcbt-card__images">\n        ${Array.from({
length:placeholderCount
}).map(()=>'<div class="gcbt-card__img-placeholder">预览图</div>').join("")}\n      </div>\n      <div class="gcbt-card__magnet-block">\n        <div class="gcbt-card__magnet-list">磁力解析中...</div>\n      </div>\n    `,
card}static setLoadingState(card){const images=card.querySelector(".gcbt-card__images");images&&(images.innerHTML='<div class="gcbt-card__placeholder">正在拉取详情...</div>')
;const magnets=card.querySelector(".gcbt-card__magnet-list");magnets&&(magnets.textContent="磁力解析中...")}static setErrorState(card){const images=card.querySelector(".gcbt-card__images")
;images&&(images.innerHTML='<div class="gcbt-card__placeholder is-error">加载失败</div>');const magnets=card.querySelector(".gcbt-card__magnet-list");magnets&&(magnets.textContent="磁力获取失败")}
static renderPreview(card,data){if(card.querySelector(".gcbt-card__images")){const domainGroups=this.groupImagesByDomain(data.images);this.renderImageGroup(card,domainGroups,0,data.images.length)}
const magnetsEl=card.querySelector(".gcbt-card__magnet-list");magnetsEl&&(magnetsEl.innerHTML="",data.magnets.length?data.magnets.forEach(magnet=>{const row=document.createElement("div")
;if(row.className="gcbt-card__magnet-row",magnet.startsWith("http://")||magnet.startsWith("https://")){const tip=document.createElement("span");tip.textContent="⚠️ 需手动访问：",tip.style.color="#ff6b6b",
tip.style.marginRight="4px",tip.style.fontSize="12px",row.appendChild(tip);const link=document.createElement("a");link.href=magnet,link.textContent=magnet,link.className="gcbt-card__magnet-text",
link.style.cursor="pointer",link.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation();try{GM_openInTab(magnet,{active:!0,insert:!0,setParent:!0})}catch(err){window.open(magnet,"_blank")
}}),row.appendChild(link)}else{const link=document.createElement("a");link.href=magnet,link.textContent=magnet,link.className="gcbt-card__magnet-text",link.target="_blank",link.rel="noopener",
row.appendChild(link)}magnetsEl.appendChild(row)}):magnetsEl.innerHTML='<span class="gcbt-card__magnet-empty">暂无磁力</span>')}static groupImagesByDomain(images){const groups=new Map
;return images.forEach(src=>{const domain=this.getDomain(src);groups.has(domain)||groups.set(domain,[]),groups.get(domain).push(src)}),groups}static getDomain(src){try{
return new URL(src,location.href).hostname||"unknown"}catch{return"unknown"}}static renderImageGroup(card,domainGroups,domainIndex,totalImages){const imagesEl=card.querySelector(".gcbt-card__images")
;if(!imagesEl){return}const domains=Array.from(domainGroups.keys());if(!domains.length){return void(imagesEl.innerHTML='<div class="gcbt-card__placeholder">暂无预览图</div>')}
if(domainIndex>=domains.length){return void(imagesEl.innerHTML='<div class="gcbt-card__placeholder is-error">图片加载失败</div>')}
const currentDomain=domains[domainIndex],sources=domainGroups.get(currentDomain)||[],maxImages=GCBT_CONFIG.maxPreviewImages,display=sources.slice(0,maxImages);if(!display.length){
return void this.renderImageGroup(card,domainGroups,domainIndex+1,totalImages)}imagesEl.innerHTML="";let failed=0,loaded=0;const total=display.length;display.forEach((src,idx)=>{
const imgWrap=document.createElement("div");imgWrap.className="gcbt-card__img";const img=document.createElement("img");if(img.src=src,img.loading="lazy",img.referrerPolicy="no-referrer",
img.dataset.index=String(idx),img.dataset.src=src,imgWrap.appendChild(img),img.onload=()=>{loaded+=1},img.onerror=()=>{failed+=1,
failed+loaded===total&&(failed>=Math.ceil(total/2)&&domainIndex<domains.length-1?setTimeout(()=>{this.renderImageGroup(card,domainGroups,domainIndex+1,totalImages)
},300):failed===total&&domainIndex<domains.length-1&&this.renderImageGroup(card,domainGroups,domainIndex+1,totalImages))},idx===display.length-1&&totalImages>display.length){
const more=document.createElement("span");more.className="gcbt-card__more",more.textContent="+"+(totalImages-display.length),imgWrap.appendChild(more)}imgWrap.addEventListener("click",e=>{
e.preventDefault(),Lightbox.show(display,idx)}),imagesEl.appendChild(imgWrap)})}static async fetchDetail(url){const cacheKey=this.CACHE_PREFIX+url,cached=Storage.get(cacheKey)
;if(cached&&cached.version===GCBT_CONFIG.DATA_VERSION&&!location.search.includes("nocache")){return cached}
const response=await fetch(url),text=await response.text(),doc=(new DOMParser).parseFromString(text,"text/html");doc.querySelectorAll("style, script").forEach(el=>el.remove())
;const content=doc.querySelector(".entry-content, .entry-wrapper, .article-content")||doc.body,sizeMatch=content.textContent?.match(/【(?:影片|档案|檔案|资源|資源)(?:大小|容量)】\s*(?:：|:)*\s*([0-9.]+\s*(?:MB|GB|M|G|T|TB))/i),durationMatch=content.textContent?.match(/【(?:影片|资源|資源)(?:时间|時間|时长|時長)】\s*(?:：|:)*\s*(\d+:\d+(:\d+)?)/i),maxImages=GCBT_CONFIG.maxPreviewImages,images=Array.from(content.querySelectorAll("img")).slice(0,maxImages).map(img=>img.getAttribute("data-src")||img.getAttribute("src")).filter(Boolean).map(src=>this.normalizeImageSrc(src,url)),magnets=await DomManager$1.extractMagnetsFromContent(content),uniqueMagnets=[...new Set(magnets.map(m=>m.toLowerCase()))],data={
images:[...new Set(images)],magnets:uniqueMagnets,size:sizeMatch?.[1],duration:durationMatch?.[1],version:GCBT_CONFIG.DATA_VERSION};return Storage.set(cacheKey,data),data}
static normalizeImageSrc(src,base){const proxyMatch=src.match(/\/plugin\/img_layer\/data\/\?src=([^&]+)/i);if(proxyMatch){try{const decoded=decodeURIComponent(proxyMatch[1])
;return this.normalizeImageSrc(decoded,base)}catch{}}try{const urlObj=new URL(src,base),inner=urlObj.searchParams.get("src");return inner?this.normalizeImageSrc(inner,base):urlObj.href}catch{
return src}}}).CACHE_PREFIX="gcbt_preview_",_b);const GcbtModule=createSiteModule({type:"gcbt",name:"GCBT",domain:/gcbt\.net/,pages:{home:[/^\/$/,/^\/index\.php$/],
list:[/^\/$/,/^\/page\/\d+/,/^\/category\//,/^\/tag\//],content:[/^\/(download|post)\//]}},{onInit:async()=>{StyleManager$1.init()},onList:async()=>{try{DomManager$1.cleanPage(),
await PreviewProcessor$1.processAll()}finally{StyleManager$1.unhidePosts()}},onContent:async()=>{try{DomManager$1.cleanPage(),setTimeout(async()=>{await DomManager$1.displayMagnetLinkOnContentPage()
},500)}finally{StyleManager$1.unhidePosts()}}}),U9A9_CONFIG={MAX_PREVIEW_IMAGES:5,PREVIEW_IMAGE_HEIGHT:200,IMAGE_BORDER:"1px solid #ddd",IMAGE_BORDER_RADIUS:"4px",IMAGE_OBJECT_FIT:"contain",
IMAGE_CURSOR:"pointer",IMAGE_TRANSITION:"transform 0.2s ease",selectors:{listTable:"table.torrent-list",listRows:"table.torrent-list tbody tr.default",titleLinks:"td:nth-child(2) a",
imgContainer:"div.img-container",images:"div.img-container img",adContainers:[".row.ad",".row .ad",".col-md-6 .adclick","a.adclick",'img[src*="/image/a/"]','img[src*="/image/b/"]']},regex:{
viewUrl:/^\/view\/\d+\/[a-f0-9]+$/,imageUrl:/\.(jpg|jpeg|png|gif|webp)$/i},styles:{previewImages:"display: flex; gap: 4px; flex-wrap: nowrap; overflow: hidden; width: 100%; padding: 4px; margin: 0;",
previewRow:"\n            .u9a9-preview-row {\n                background-color: #f8f9fa !important;\n            }\n            .u9a9-preview-row td {\n                padding: 10px !important;\n                text-align: center !important;\n            }\n            .u9a9-preview-row img {\n                border-radius: 4px;\n                transition: transform 0.2s ease;\n            }\n            .u9a9-preview-row img:hover {\n                transform: scale(1.05);\n            }\n        "
},getPreviewImageStyle(imageCount=1){const width=imageCount<=3?"auto":Math.floor(100/imageCount)-1+"%"
;return`height: ${this.PREVIEW_IMAGE_HEIGHT}px; width: ${width}; object-fit: ${this.IMAGE_OBJECT_FIT}; cursor: ${this.IMAGE_CURSOR}; border: ${this.IMAGE_BORDER}; border-radius: ${this.IMAGE_BORDER_RADIUS}; flex-shrink: 0; transition: ${this.IMAGE_TRANSITION};`
}},_StyleManager=class{static init(){this.applyStyles(),"loading"===document.readyState&&document.addEventListener("DOMContentLoaded",()=>{this.applyStyles()})}static applyStyles(){
this.styleElement&&this.styleElement.remove(),this.styleElement=document.createElement("style"),this.styleElement.type="text/css",this.styleElement.textContent=U9A9_CONFIG.styles.previewRow,
(document.head||document.getElementsByTagName("head")[0]).appendChild(this.styleElement)}static destroy(){this.styleElement&&(this.styleElement.remove(),this.styleElement=null)}}
;_StyleManager.styleElement=null;let StyleManager=_StyleManager;const _DomManager=class{static init(){this.removeAds(),this.removeTorrentLinks(),this.setupObservers()}static setupObservers(){
document.body&&(this.adObserver=new MutationObserver(()=>{this.removeAds()}),this.adObserver.observe(document.body,{childList:!0,subtree:!0}),this.torrentObserver=new MutationObserver(mutations=>{
let hasNewNodes=!1;mutations.forEach(mutation=>{"childList"===mutation.type&&mutation.addedNodes.length>0&&mutation.addedNodes.forEach(node=>{
node instanceof HTMLElement&&("A"===node.tagName&&node.getAttribute("href")?.includes(".torrent")||node.querySelector&&node.querySelector('a[href*=".torrent"]'))&&(hasNewNodes=!0)})}),
hasNewNodes&&this.removeTorrentLinks()}),this.torrentObserver.observe(document,{childList:!0,subtree:!0}))}static removeAds(){U9A9_CONFIG.selectors.adContainers.forEach(selector=>{
document.querySelectorAll(selector).forEach(element=>{"true"!==element.dataset.u9a9AdRemoved&&(element.dataset.u9a9AdRemoved="true",element.style.setProperty("display","none","important"))})})}
static removeTorrentLinks(){document.querySelectorAll('a[href*=".torrent"]:not([href^="magnet:"])').forEach(link=>{try{const href=link.getAttribute("href")
;if(href&&href.includes(".torrent")&&!href.startsWith("magnet:")){const nextSibling=link.nextElementSibling;if(nextSibling&&nextSibling.classList.contains("ext-push-resource-to-115")){
const resourceUrl=nextSibling.getAttribute("data-resource-url");resourceUrl&&resourceUrl.includes(".torrent")&&nextSibling.remove()}link.remove()}}catch(error){}})}static destroy(){
this.adObserver?.disconnect(),this.torrentObserver?.disconnect(),this.adObserver=null,this.torrentObserver=null}};_DomManager.adObserver=null,_DomManager.torrentObserver=null
;let DomManager=_DomManager;const _SimpleCache=class{static get(key){return this.cache.get(key)||null}static set(key,value){this.cache.set(key,value)}static clear(){this.cache.clear()}}
;_SimpleCache.cache=new Map;let SimpleCache=_SimpleCache;const _PreviewProcessor=class{static async processAll(){const rows=document.querySelectorAll(U9A9_CONFIG.selectors.listRows)
;if(!rows||0===rows.length){return}const promises=Array.from(rows).map(row=>this.processRow(row));await Promise.all(promises)}static async processRow(row){
const linkElement=row.querySelector(U9A9_CONFIG.selectors.titleLinks);if(!linkElement){return}const pageUrl=linkElement.href;if("true"===row.dataset.previewProcessed){return}
row.dataset.previewProcessed="true";const cached=SimpleCache.get(pageUrl);if(cached){this.insertPreviewRow(row,cached)}else if(!this.loading.has(pageUrl)){this.loading.add(pageUrl);try{
const images=await this.fetchImages(pageUrl);SimpleCache.set(pageUrl,images),this.insertPreviewRow(row,images)}catch(error){}finally{this.loading.delete(pageUrl)}}}static async fetchImages(pageUrl){
const response=await fetch(pageUrl);if(!response.ok){throw new Error(`HTTP 错误！状态: ${response.status}`)}
const html=await response.text(),imgContainer=(new DOMParser).parseFromString(html,"text/html").querySelector(U9A9_CONFIG.selectors.imgContainer)
;return imgContainer?Array.from(imgContainer.querySelectorAll("img")).map(img=>this.getFullImageUrl(img.src)).filter(src=>src&&this.isImageUrl(src)).slice(0,U9A9_CONFIG.MAX_PREVIEW_IMAGES):[]}
static insertPreviewRow(row,images){const nextRow=row.nextElementSibling;if(nextRow&&nextRow.classList.contains("u9a9-preview-row")){return void this.updatePreviewRow(nextRow,images)}
const newRow=document.createElement("tr");newRow.className="u9a9-preview-row";const newCell=document.createElement("td"),colCount=row.cells.length;newCell.setAttribute("colspan",colCount.toString()),
newCell.style.cssText="padding: 10px; text-align: center; background: #f8f9fa;",0===images.length?newCell.textContent="无预览图":this.renderImages(newCell,images),newRow.appendChild(newCell),
row.insertAdjacentElement("afterend",newRow)}static updatePreviewRow(previewRow,images){const cell=previewRow.querySelector("td");cell&&(cell.innerHTML="",
0===images.length?cell.textContent="无预览图":this.renderImages(cell,images))}static renderImages(cell,images){const container=document.createElement("div")
;container.style.cssText=U9A9_CONFIG.styles.previewImages,images.forEach((src,index)=>{const img=document.createElement("img");img.src=src,img.loading="lazy",img.alt=`预览图 ${index+1}`,
img.style.cssText=U9A9_CONFIG.getPreviewImageStyle(images.length),img.addEventListener("click",()=>{Lightbox.show(images,index)}),img.addEventListener("error",()=>{img.style.display="none"}),
img.addEventListener("mouseenter",()=>{img.style.transform="scale(1.05)"}),img.addEventListener("mouseleave",()=>{img.style.transform="scale(1)"}),container.appendChild(img)}),
cell.appendChild(container)}static getFullImageUrl(src){return src.startsWith("//")?`https:${src}`:src.startsWith("/")?`${window.location.origin}${src}`:src}static isImageUrl(url){
return U9A9_CONFIG.regex.imageUrl.test(url)}};_PreviewProcessor.loading=new Set;let PreviewProcessor=_PreviewProcessor;!async function(modules2){try{registry.registerAll(modules2)
;const module=registry.matchByHost(location.hostname);if(!module){return}await module.init(),await new Promise(resolve=>{
"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>resolve(),{once:!0}):resolve()});const pageType=registry.detectPageType(module);await module.handlePage(pageType)
}catch(error){}}([LaowangModule,MoxingModule,SjsModule,GcbtModule,createSiteModule({type:"u9a9",name:"U9A9",domain:/u9a9\.com$/,pages:{home:[/^\/$/],list:[/^\//,/^\/category\//,/^\/search\//],
content:[/^\/view\/\d+\//]},preview:{listContainer:"table.torrent-list",itemSelector:"tr.default",linkSelector:"td:nth-child(2) a",imageSelector:"div.img-container img"}},{onInit:async()=>{
StyleManager.init(),DomManager.init()},onList:async()=>{await PreviewProcessor.processAll()},onHome:async()=>{await PreviewProcessor.processAll()},onDestroy:()=>{DomManager.destroy(),
StyleManager.destroy()}})])}();
