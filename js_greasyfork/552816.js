// ==UserScript==
// @name         图片浏览助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在图片站点上提供简洁清爽的浏览体验（含导航栏）
// @author       Your Name
// @match        *://*.pandadiu.com/*
// @match        *://*.pptcg.com/*
// @match        *://*.mt123.cc/*
// @match        *://*.coserlab.io/*
// @match        *://*.bisipic.xyz/*
// @match        *://*.jb9.es/*
// @match        *://*.xchina.co/*
// @match        *://*.615ku.com/*
// @match        *://*.52doll.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552816/%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552816/%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
!function(){"use strict";let e={SCROLL_TRIGGER_DISTANCE:200,DRAG_SWITCH_THRESHOLD:80,ANIMATION_DELAY:100,SCROLL_THROTTLE_DELAY:200,ZOOM_STEP:.1,MIN_ZOOM:.5,MAX_ZOOM:5,IMAGE_CONCURRENT_LOAD:5,COSERLAB_CARD_CHECK_INTERVAL:100,COSERLAB_CARD_MAX_CHECKS:300};if(window.location.hostname.includes("coserlab.io")){let t=()=>{"#google_vignette"===window.location.hash&&history.replaceState(null,null,window.location.pathname+window.location.search)};t(),window.addEventListener("hashchange",t);let i=new MutationObserver(()=>{let e=document.getElementById("card");e&&e.remove();let t=document.querySelectorAll('[class*="vignette"], [id*="vignette"]');t.length>0&&t.forEach(e=>e.remove())});document.body?i.observe(document.body,{childList:!0,subtree:!0}):document.addEventListener("DOMContentLoaded",()=>{i.observe(document.body,{childList:!0,subtree:!0})})}let a=[{id:"pandadiu",icon:"\uD83D\uDC3C",name:"Pandadiu",url:"https://www.pandadiu.com/list-30-1.html",mobileName:"Panda"},{id:"pptcg",icon:"\uD83D\uDCDA",name:"PPTCG",url:"https://www.pptcg.com/shaonvmanhua/"},{id:"mt123",icon:"\uD83C\uDFAD",name:"MT123",url:"https://mt123.cc/"},{id:"coserlab",icon:"\uD83C\uDFA8",name:"CoserLab",url:"https://coserlab.io/",mobileName:"Coser"},{id:"bisipic",icon:"\uD83D\uDCAC",name:"Bisipic",url:"https://bisipic.xyz/",mobileName:"Bisi"},{id:"jb9",icon:"\uD83C\uDFAC",name:"JB9",url:"https://jb9.es/"},{id:"xchina",icon:"\uD83D\uDCF8",name:"XChina",url:"https://xchina.co/"},{id:"615ku",icon:"\uD83D\uDDBC️",name:"615KU",url:"https://615ku.com/625ku-tupianqu/index/"},{id:"52doll",icon:"\uD83D\uDCAC",name:"52DOLL",url:"https://52doll.com/",mobileName:"52Doll"}],o={pandadiu:[{name:"COS",url:"https://www.pandadiu.com/list-30-1.html"},{name:"写真",url:"https://www.pandadiu.com/list-26-1.html"}],pptcg:[{name:"少女漫画",url:"https://www.pptcg.com/shaonvmanhua/"},{name:"CosPlay",url:"https://www.pptcg.com/cosplay/"},{name:"AI绘画",url:"https://www.pptcg.com/ai/"},{name:"动漫壁纸",url:"https://www.pptcg.com/donmanbizhi/"}],mt123:[{name:"国漫壁纸",url:"https://mt123.cc/category-4.html"},{name:"游戏壁纸",url:"https://mt123.cc/category-5.html"},{name:"次元动漫",url:"https://mt123.cc/category-8.html"},{name:"电脑壁纸",url:"https://mt123.cc/category-2.html"},{name:"美女COS",url:"https://mt123.cc/category-24.html"},{name:"美女壁纸",url:"https://mt123.cc/category-3.html"},{name:"COS壁纸",url:"https://mt123.cc/category-6.html"}],bisipic:[{name:"秀人套图",url:"https://bisipic.xyz/forum-2-1.html"},{name:"COSPLAY",url:"https://bisipic.xyz/forum-47-1.html"},{name:"網絡美女",url:"https://bisipic.xyz/forum-49-1.html"}],jb9:[{name:"人体艺术",url:"https://jb9.es/category/%e4%ba%ba%e4%bd%93%e8%89%ba%e6%9c%af/"},{name:"秀人旗下",url:"https://jb9.es/category/xiurenwang/"},{name:"大尺度",url:"https://jb9.es/category/dachidu/"},{name:"AI图区",url:"https://jb9.es/category/ai/"}],xchina:[{name:"秀人网特色",url:"https://xchina.co/photos/album-1.html"},{name:"大尺度",url:"https://xchina.co/photos/album-2.html"},{name:"性爱主题",url:"https://xchina.co/photos/album-3.html"},{name:"露出主题",url:"https://xchina.co/photos/album-4.html"},{name:"Cosplay",url:"https://xchina.co/photos/album-5.html"},{name:"道具主题",url:"https://xchina.co/photos/album-6.html"},{name:"捆绑主题",url:"https://xchina.co/photos/album-7.html"},{name:"白虎主题",url:"https://xchina.co/photos/album-8.html"},{name:"女同主题",url:"https://xchina.co/photos/album-9.html"},{name:"有原图",url:"https://xchina.co/photos/album-10.html"},{name:"有视频",url:"https://xchina.co/photos/album-11.html"},{name:"业余自拍",url:"https://xchina.co/photos/album-12.html"}],coserlab:[{name:"Cosplay",url:"https://coserlab.io/archives/category/cosplay"},{name:"写真",url:"https://coserlab.io/archives/category/portrait"}],"615ku":[{name:"亚洲色图",url:"https://615ku.com/625ku-tupianqu/YSE/"},{name:"偷拍自拍",url:"https://615ku.com/625ku-tupianqu/TSE/"},{name:"欧美色图",url:"https://615ku.com/625ku-tupianqu/OSE/"},{name:"清纯唯美",url:"https://615ku.com/625ku-tupianqu/QSE/"},{name:"美腿丝袜",url:"https://615ku.com/625ku-tupianqu/MSE/"},{name:"少妇熟女",url:"https://615ku.com/625ku-tupianqu/SSE/"},{name:"明星淫乱",url:"https://615ku.com/625ku-tupianqu/MXSE/"},{name:"卡通动漫",url:"https://615ku.com/625ku-tupianqu/KSE/"}],"52doll":[{name:"国内娃娃",url:"https://bbs.52doll.com/forum-39-1.html"},{name:"次元人偶",url:"https://bbs.52doll.com/forum-155-1.html"},{name:"精选作品",url:"https://bbs.52doll.com/forum-105-1.html"}]},l={"pandadiu.com":{name:"Pandadiu",list:{urlPattern:/\/(?:m\/)?list-(\d+)-(\d+)\.html/,containerSelector:".cos_list_con li, .pic_list_con li, .list li, ul li",linkSelector:'.text a.elli, a.imgholder, a[href*="/show-"], a[href*="/m/show-"]',imageSelector:"img",titleSelector:".text a.elli, a",subtitleSelectors:[".cover .elli",".tag span",".info"],nextPageUrl:(e,t)=>`/list-${e}-${t}.html`},detail:{urlPattern:/\/(?:m\/)?show-/,titleSelector:".show_cos .title h1, .list_title, h1, .title",metaSelector:null,contentSelector:".show_cos .con, .article_ct, .content, article",imageSelector:".show_cos .con img, .article_ct img, .content img, article img"}},"pptcg.com":{name:"PPTCG",list:{urlPattern:/\/[a-z]+\/(?:page\/(\d+)\/)?$/,containerSelector:"article.picture",linkSelector:".grid-title a, .picture-img a",imageSelector:"img",titleSelector:".grid-title a",subtitleSelectors:[".g-cat a",".date"],nextPageUrl(e,t){let i=window.location.pathname.replace(/\/page\/\d+\/$/,"/");return`${i}page/${t}/`}},detail:{urlPattern:/\/\d+\.html$/,titleSelector:"h1.post-title, h1.entry-title, article h1, .single-title",metaSelector:".post-meta, .entry-meta, .single-meta",contentSelector:"article .entry, article p, .single-content, .entry-content, .post-content",imageSelector:"article img, .entry img, .single-content img, .entry-content img, .post-content img, p img"}},"mt123.cc":{name:"MT123",list:{urlPattern:/\/category-/,containerSelector:".erx-w-item, section > div",linkSelector:"a",imageSelector:"img",titleSelector:"h3, .m-title",subtitleSelectors:[],nextPageUrl(e,t){let i=window.location.pathname.match(/\/category-(\d+)/);return i?`/category-${i[1]}-${t}.html`:null}},detail:{urlPattern:/\/post\//,titleSelector:"h1, h2, article h1",metaSelector:null,contentSelector:"body, #content, article, main",imageSelector:"table img, article img, .post img, p img, img"}},"coserlab.io":{name:"CoserLab",list:{urlPattern:/\/archives\/category\//,containerSelector:'article, .post-item, [class*="post"]',linkSelector:"a",imageSelector:"img",titleSelector:"h2, h3, .title",subtitleSelectors:[],nextPageUrl:null},detail:{urlPattern:/\/archives\/\d+/,titleSelector:"h1, .title, article h1",metaSelector:null,contentSelector:"article, .post-content, main, .content",imageSelector:".image-container img, .post-content img, .entry-content img, article > img, figure img"}},"bisipic.xyz":{name:"Bisipic",list:{urlPattern:/\/forum-\d+-\d+\.html/,containerSelector:".cacklist ul li",linkSelector:"a",imageSelector:"img",titleSelector:"h2",subtitleSelectors:[],nextPageUrl(e,t){let i=window.location.pathname.match(/\/forum-(\d+)-\d+\.html/);return i?`/forum-${i[1]}-${t}.html`:null}},detail:{urlPattern:/\/thread-\d+-\d+-\d+\.html/,titleSelector:"#thread_subject, .ts h1, h1",metaSelector:null,contentSelector:'.t_fsz, .pcb, td[id^="postmessage_"]',imageSelector:'.t_fsz img, .pcb img, td[id^="postmessage_"] img, .zoom'}},"jb9.es":{name:"JB9",list:{urlPattern:/\/category\/[^/]+(?:\/page\/(\d+))?/,containerSelector:'article, .post-item, [class*="post"]',linkSelector:"a",imageSelector:"img",titleSelector:"h3, .title, h2",subtitleSelectors:[],nextPageUrl(e,t){let i=window.location.pathname.match(/\/category\/([^/]+)/);if(i){let a=i[1];return`/category/${a}/page/${t}/`}return null}},detail:{urlPattern:/^\/[^/]+\/$/,titleSelector:"h1, .title, article h1",metaSelector:null,contentSelector:".content, article, .post-content, .entry-content, main",imageSelector:".content img, article img, .post-content img, .entry-content img, p img"}},"xchina.co":{name:"XChina",list:{urlPattern:/\/photos\/album-(\d+)(?:\/(\d+))?\.html/,containerSelector:".item.photo",linkSelector:'a[href*="/photo/"]',imageSelector:".img",titleSelector:".text .title a",subtitleSelectors:[".subs"],nextPageUrl:(e,t)=>`/photos/album-${e}/${t}.html`},detail:{urlPattern:/\/photo\/id-[^.]+\.html/,titleSelector:"h1, .title, .photo-title",metaSelector:null,contentSelector:".list.photo-waterfall, article, main, body",imageSelector:".item.photo-image .img, .img"}},"615ku.com":{name:"615KU",list:{urlPattern:/\/625ku-tupianqu\/[A-Z]+/,containerSelector:".col-60 li, ul.row li",linkSelector:'a[href*="/625ku-tttppp/"]',imageSelector:null,titleSelector:'a[href*="/625ku-tttppp/"]',subtitleSelectors:[],nextPageUrl:(e,t)=>e&&"index"!==e?1===t?`/625ku-tupianqu/${e}/`:`/625ku-tupianqu/${e}/index_${t}/`:1===t?"/625ku-tupianqu/index/":`/625ku-tupianqu/index_${t}/`},detail:{urlPattern:/\/625ku-tttppp\/\d+/,titleSelector:"h1, .title, main h1",metaSelector:null,contentSelector:"main, body",imageSelector:"main img, .img img, img"}},"52doll.com":{name:"52DOLL论坛",list:{urlPattern:/\/forum-(\d+)-(\d+)\.html/,containerSelector:'li.forumlist_li, li.comiis_znalist, tbody[id^="normalthread_"], tbody[id^="stickthread_"]',linkSelector:'.mmlist_li_box h2 a, a[href*="thread-"], a.s.xst',imageSelector:'.comiis_pyqlist_img img, .comiis_pyqlist_imgs img, img[comiis_loadimages], img[id^="coverimg_"]',titleSelector:'.mmlist_li_box h2 a, a[href*="thread-"], a.s.xst',subtitleSelectors:[],nextPageUrl:(e,t)=>`/forum-${e}-${t}.html`},detail:{urlPattern:/\/thread-(\d+)-(\d+)-(\d+)\.html/,titleSelector:'.comiis_z_title_text, #thread_subject, span[id^="thread_subject"], h1, .title',metaSelector:null,contentSelector:'.comiis_message, td[id^="postmessage_"], .t_fsz, .pcb, .post_content, article, main',imageSelector:'.comiis_message img, img[src*="album"], img[file], img.zoom, td[id^="postmessage_"] img, img'}}},n=function e(){let t=window.location.hostname;for(let[i,a]of Object.entries(l))if(t.includes(i))return{domain:i,config:a};return null}();function r(e){return e?e.startsWith("http")?e:e.startsWith("//")?window.location.protocol+e:e.startsWith("/")?window.location.origin+e:window.location.origin+"/"+e:""}function s(e){var t;let i=(t=e).split(",").map(e=>e.trim());for(let a of i){let o=document.querySelector(a);if(o)return o}return null}function c(e,t=""){if(!e)return"";let i=e;if(["ai绘画","二次元","动漫壁纸","精美手机锁屏壁纸","ai生成","aigc","游戏美女图片壁纸","壁纸","超酷帅美图壁纸","二次元游戏壁纸","游戏角色手机壁纸","二次元少女壁纸","游戏","游戏美女壁纸","手机锁屏","游戏壁纸","游戏二创","国风","二次元游戏超美壁纸","二次元动漫美图分享推荐","动漫美图","手机壁纸","超酷超帅冷色调壁纸","二次元壁纸","屏保该换了系列","动漫壁纸","国漫女神","动漫美女壁纸图片","古风","壁纸美图分享推荐","壁纸分享","电脑壁纸","电脑桌面壁纸分享","AI作图：","AI作画：","AI：","AI生成："].forEach(e=>{let t=RegExp(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");i=i.replace(t,"")}),i=(i=i.replace(/\[[^\]]*(?:AI艺术|P)[^\]]*\]/g,"")).replace(/\(\d+\)/g,""),"52doll.com"===t){let a=i.indexOf("#");-1!==a&&(i=i.substring(a+1));let o=i.indexOf("】");-1!==o&&(i=i.substring(o+1))}return i.trim()}function d(e,t){let i=[],a=t.list,o=new Set;return e.forEach((e,t)=>{let l=e.querySelector(a.linkSelector),s=e.querySelector(a.imageSelector),c=e.querySelector(a.titleSelector);if(!l&&e.hasAttribute("onclick")){let d=e.getAttribute("onclick"),p=d.match(/['"](\/[^'"]+)['"]/);if(p){let m=document.createElement("a");m.href=p[1],l=m}}let g="";if("pptcg.com"!==n.domain)for(let h of a.subtitleSelectors){let u=e.querySelector(h);u?.textContent.trim()&&(g&&(g+=" "),g+=u.textContent.trim())}if(l&&c){let $=r(l.getAttribute("href")),f="";if(s){if("IMG"===s.tagName){if("52doll.com"===n.domain){let b=s.getAttribute("comiis_loadimages");b?(f=b)&&!f.startsWith("http")&&(f=f.startsWith("data/attachment/")?"https://web06-oss.gtao.cc/"+f:"https://bbs.52doll.com/"+f):f=s.getAttribute("data-original")||s.getAttribute("data-src")||s.getAttribute("data-lazy")||s.src}else f=s.getAttribute("data-original")||s.getAttribute("data-src")||s.getAttribute("data-lazy")||s.src}else{let x=s.getAttribute("style");if(x){let y=x.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);y&&(f=y[1])}}}if(!o.has($)){if(o.add($),"52doll.com"===n.domain&&t<3)return;let _=c.textContent.trim();_=_.replace(/\s+/g," "),i.push({url:$,image:f||"",title:_,subtitle:g})}}}),i}function p(e,t,i){let a=document.createElement("div");if(a.className="work-item",a.setAttribute("data-url",e.url),"615ku.com"===n.domain)a.classList.add("no-image");else if(e.image){let o=document.createElement("img");o.src=e.image,o.alt=e.title,o.loading="lazy",a.appendChild(o)}else if("52doll.com"===n.domain){let l=document.createElement("img");l.src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"%3E%3Crect fill="%23f0f0f0" width="400" height="350"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" fill="%23999"%3E\uD83D\uDCF7%3C/text%3E%3C/svg%3E',l.alt=e.title,l.loading="lazy",a.appendChild(l)}let r=document.createElement("div");if(r.className="info",e.subtitle){let s=document.createElement("div");s.className="subtitle",s.textContent=e.subtitle,r.appendChild(s)}let d=document.createElement("div");d.className="title";let p=e.title;return"jb9.es"===n.domain&&(p=e.title.replace(/【[^】]*】/g,"").trim()),p=c(p,n.domain),d.textContent=p,r.appendChild(d),a.appendChild(r),a.addEventListener("click",a=>{a.preventDefault(),function e(t,i){let a=document.querySelector(".works-grid");if(!a)return;let o=[],l=a.querySelectorAll(".work-item");l.forEach(e=>{let t=e.querySelector("img"),i=e.querySelector(".title"),a=e.querySelector(".subtitle"),l=e.getAttribute("data-url")||"";i&&(t||"52doll.com"===n.domain)&&o.push({url:l,image:t?t.src:"",title:i.textContent,subtitle:a?a.textContent:""})}),m(t,o,i)}(t,i),window.location.href=e.url}),a}function m(e,t,i){let a={workItems:t,currentPage:i,scrollPosition:window.scrollY||document.documentElement.scrollTop},o=`${n.domain}_list_state_${e}`;return sessionStorage.setItem(o,JSON.stringify(a)),a}class g{constructor(e=5){this.maxConcurrent=e,this.queue=[],this.active=0,this.completed=0,this.total=0,this.onProgressCallback=null}onProgress(e){this.onProgressCallback=e}add(e,t){this.queue.push({imgElement:e,src:t}),this.total++,this.processQueue()}async processQueue(){for(;this.active<this.maxConcurrent&&this.queue.length>0;){let e=this.queue.shift();this.active++,this.loadImage(e).finally(()=>{this.active--,this.completed++,this.onProgressCallback&&this.onProgressCallback(this.completed,this.total),this.processQueue()})}}loadImage(e){return new Promise(t=>{let{imgElement:i,src:a}=e,o=new Image;o.onload=()=>{i.src=a,i.classList.add("loaded"),t()},o.onerror=()=>{i.src=a,i.classList.add("error"),t()},o.src=a})}}function h(){return`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          display: block !important;
          background-color: #f5f5f5;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
    `}let u=document.createElement("style");if(u.id="page-hide-style",u.textContent="body { display: none !important; }",document.head)document.head.appendChild(u);else{let $=new MutationObserver((e,t)=>{document.head&&(document.head.appendChild(u),t.disconnect())});$.observe(document.documentElement,{childList:!0,subtree:!0})}function f(){if(!n)return"other";let e=window.location.pathname,t=n.config;return t.list.urlPattern.test(e)?"list":t.detail.urlPattern.test(e)?"detail":"other"}function b(){let e=document.getElementById("page-hide-style");e&&e.remove(),document.body.style.display=""}function x(t,i,a,o=0){let l=document.createElement("style");l.textContent=h()+`
      #clean-list-view {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .works-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 60px;
      }
      
      .work-item {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
      }
      
      .work-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
      
      .work-item img {
        width: 100%;
        height: 350px;
        object-fit: cover;
        display: block;
      }
      
      .work-item .info {
        padding: 12px 16px;
      }
      
      .work-item .subtitle {
        font-size: 12px;
        color: #999;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .work-item .title {
        font-size: 14px;
        color: #333;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .work-item.no-image {
        min-height: auto;
      }
      
      .work-item.no-image img {
        display: none !important;
      }
      
      .work-item.no-image .info {
        padding: 20px 16px;
      }
      
      .loading-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 9999;
        display: none;
      }
      
      @media (max-width: 768px) {
        .loading-indicator {
          bottom: 80px;
        }

        .works-grid {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }
        
        .work-item img {
          height: 200px;
        }
        
        .work-item .title {
          font-size: 13px;
          padding: 10px 12px;
        }
        
        #clean-list-view {
          padding: 12px;
        }
      }
    `;let r=document.createElement("div");r.id="clean-list-view";let s=document.createElement("div");s.className="works-grid";let c=document.createDocumentFragment();t.forEach(e=>{c.appendChild(p(e,i,a))}),s.appendChild(c),r.appendChild(s),document.head.innerHTML="";let g=document.createElement("meta");g.setAttribute("charset","utf-8");let u=document.createElement("meta");u.setAttribute("name","viewport"),u.setAttribute("content","width=device-width, initial-scale=1.0"),document.head.appendChild(g),document.head.appendChild(u),document.head.appendChild(l),b(),document.body.innerHTML="",document.body.appendChild(r),o>0&&setTimeout(()=>{window.scrollTo(0,o)},e.ANIMATION_DELAY);let $=n.config.list;null===$.nextPageUrl||!1===$.nextPageUrl?y():function t(i,a,o){let l=!1,r=a,s=!0,c=[...o];function g(){if(l||!s)return;let t=document.documentElement.scrollHeight,i=document.documentElement.scrollTop||document.body.scrollTop,a=document.documentElement.clientHeight;t-i-a<e.SCROLL_TRIGGER_DISTANCE&&h()}async function h(){l=!0;let e=r+1,t=n.config.list,a=t.nextPageUrl(i,e),o=document.querySelector(".loading-indicator");o||((o=document.createElement("div")).className="loading-indicator",document.body.appendChild(o)),o.textContent=`正在加载第 ${e} 页...`,o.style.display="block";try{let g=await fetch(a);if(!g.ok)throw Error("加载失败");let h=await g.text(),u=new DOMParser,$=u.parseFromString(h,"text/html"),f=d($.querySelectorAll(t.containerSelector),n.config);if(0===f.length){s=!1,o.textContent="没有更多内容了",setTimeout(()=>{o.style.display="none"},2e3);return}if("52doll.com"===n.domain&&f.length>0&&c.length>0){let b=c[c.length-1].url,x=f[0].url;b===x&&f.shift()}let y=document.querySelector(".works-grid"),_=document.createDocumentFragment();f.forEach(e=>{_.appendChild(p(e,i,r))}),y.appendChild(_),c=c.concat(f),r=e,m(i,c,r),o.textContent=`第 ${e} 页加载完成`,setTimeout(()=>{o.style.display="none"},1e3)}catch(v){o.textContent="加载失败，请刷新重试",setTimeout(()=>{o.style.display="none"},2e3)}finally{l=!1}}let u;window.addEventListener("scroll",()=>{u&&clearTimeout(u),u=setTimeout(g,e.SCROLL_THROTTLE_DELAY)})}(i,a,t)}function y(){let t=!1;function i(){if(t)return;let i=document.documentElement.scrollHeight,a=document.documentElement.scrollTop||document.body.scrollTop,o=document.documentElement.clientHeight;i-a-o<e.SCROLL_TRIGGER_DISTANCE&&function e(){let i=document.querySelector('.load-more, .more-link, [class*="load-more"], [class*="more-btn"]');if(!i){let a=document.querySelectorAll('button, a, .btn, [role="button"]');i=Array.from(a).find(e=>{let t=e.textContent.trim();return/加载更多|加载|more|load\s*more|查看更多|显示更多/i.test(t)})}if(i&&null!==i.offsetParent){t=!0;let o=document.querySelectorAll('article, .post-item, [class*="picture"], .card').length;i.click();let l=setInterval(()=>{let e=document.querySelectorAll('article, .post-item, [class*="picture"], .card').length;e>o&&(clearInterval(l),t=!1)},500);setTimeout(()=>{clearInterval(l),t=!1},5e3)}}()}let a;window.addEventListener("scroll",()=>{a&&clearTimeout(a),a=setTimeout(i,e.SCROLL_THROTTLE_DELAY)})}function _(t,i){let a=s(i.contentSelector);if(!a){let o=document.querySelectorAll("article, .post, .entry, .content, main");for(let l of o){let d=l.querySelectorAll("img");if(d.length>=3){a=l;break}}}if(!t&&!a){b();return}if("pandadiu.com"===n.domain&&a){let p=a.parentElement;if(p){let m=p.querySelector(".meta, .info, .list_info_i");m&&m.remove();let u=p.querySelector(".share");u&&u.remove();let $=p.querySelectorAll("h1, h4");$.forEach(e=>{if(e!==t&&(e.textContent.includes("标签")||e.textContent.includes("相关推荐")||e.textContent.includes("相关作品"))){let i=e.nextElementSibling;for(e.remove();i;){let a=i.nextElementSibling;i.remove(),i=a}}})}let f=document.querySelector("#more_about");f&&f.remove();let x=document.querySelector("#us_panel_menu");x&&x.remove();let y=document.querySelector("#us_panel2");y&&y.remove()}let _=document.createElement("div");_.id="clean-detail-view";let v=document.createElement("style");if(v.textContent=h()+`
      #clean-detail-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          background-color: #ffffff;
          min-height: 100vh;
          text-align: center;
        }
        
      #clean-detail-view h1 {
          font-size: 32px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }
        
      #clean-detail-view .meta-info {
          list-style: none;
          margin-bottom: 40px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          text-align: center;
        }
        
      #clean-detail-view .meta-info li {
          display: inline-block;
          margin: 5px 15px;
          color: #666;
          font-size: 14px;
        }
        
      #clean-detail-view .meta-info li span {
          color: #999;
          margin-right: 5px;
        }
        
      #clean-detail-view .meta-info div {
        margin: 8px 0;
        color: #555;
        font-size: 14px;
        line-height: 1.8;
      }
      
      #clean-detail-view .images {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
      #clean-detail-view .images img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, opacity 0.3s ease;
        cursor: pointer;
        }

      #clean-detail-view .images img.lazy-img:not(.loaded) {
        min-height: 300px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        opacity: 0.6;
      }

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      #clean-detail-view .images img.loaded {
        opacity: 1;
        animation: fadeIn 0.5s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      #clean-detail-view .images img.error {
        opacity: 0.5;
        filter: grayscale(100%);
      }
        
      #clean-detail-view .images img:hover {
          transform: scale(1.02);
        }
      
      #clean-detail-view .video-wrapper {
        width: 100%;
        max-width: 100%;
        margin: 20px 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      #clean-detail-view .video-wrapper video {
        width: 100%;
        height: auto;
        display: block;
        background-color: #000;
      }
      
      #clean-detail-view .video-wrapper iframe {
        width: 100%;
        height: 500px;
        border: none;
        display: block;
      }
      
      #clean-detail-view .video-wrapper .ckplayer-video,
      #clean-detail-view .video-wrapper [class*="player"],
      #clean-detail-view .video-wrapper [class*="video"] {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto;
      }
      
      @media (max-width: 768px) {
        #clean-detail-view .video-wrapper iframe {
          height: 300px;
        }

        .image-loading-progress {
          top: auto !important;
          bottom: 80px !important;
          right: 10px !important;
          font-size: 12px !important;
          padding: 10px 16px !important;
        }

        #clean-detail-view .images img.lazy-img:not(.loaded) {
          min-height: 200px;
        }
      }
      
      .image-viewer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .image-viewer-overlay.active {
        opacity: 1;
      }
      
      .image-viewer-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        cursor: grab;
      }
      
      .image-viewer-container.dragging {
        cursor: grabbing;
      }
      
      .image-viewer-img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        user-select: none;
        transition: transform 0.3s ease;
      }
      
      .image-viewer-info {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 16px;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 8px 16px;
        border-radius: 20px;
        z-index: 10001;
      }
      
      .image-viewer-close {
        position: absolute;
        top: 20px;
        right: 20px;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 10001;
        width: 56px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.75);
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }
      
      .image-viewer-close:hover {
        background-color: rgba(255, 59, 48, 0.9);
        transform: scale(1.1);
        border-color: rgba(255, 255, 255, 0.6);
        }
        
        @media (max-width: 768px) {
        #clean-detail-view {
            padding: 20px 10px;
          }
          
        #clean-detail-view h1 {
            font-size: 24px;
          }
          
        #clean-detail-view .meta-info li {
            display: block;
            margin: 8px 0;
          }
        
        .image-viewer-info {
          font-size: 14px;
          padding: 6px 12px;
        }
        
        .image-viewer-close {
          font-size: 30px;
          width: 40px;
          height: 40px;
        }
      }
    `,t){let w=document.createElement("h1"),S=t.textContent.trim();"jb9.es"===n.domain&&(S=S.replace(/【[^】]*】/g,"").trim()),S=c(S,n.domain),w.textContent=S,_.appendChild(w)}let k=document.createElement("div");if(k.className="meta-info","pptcg.com"===n.domain){let E=document.querySelectorAll("p, div, article, section");for(let C of E){let L=C.textContent;if(L.includes("原作")||L.includes("角色")||L.includes("Cn")||L.includes("CN")){let A=L.split("\n").map(e=>e.trim()).filter(e=>e);A.forEach(e=>{let t=e.replace(/日期[：:][^\s]+/g,""),i=t.match(/原作[：:]\s*([^原角CN\s]+(?:\s+[^原角CN]+)?)/);if(i&&i[1]){let a=i[1].trim();if(a&&!a.includes("摘 要")&&!a.includes("皮皮兔")&&a.length<50){let o=document.createElement("div");o.textContent=`原作： ${a}`,k.appendChild(o)}}let l=t.match(/角色[：:]\s*([^原角CN\s]+(?:\s+[^原角CN]+)?)/);if(l&&l[1]){let n=l[1].trim();if(n&&!n.includes("摘 要")&&!n.includes("皮皮兔")&&n.length<50){let r=document.createElement("div");r.textContent=`角色： ${n}`,k.appendChild(r)}}let s=t.match(/(?:Cn|CN|cn)[：:]\s*([^原角日\s]+(?:\s+[^原角日]+)?)/i);if(s&&s[1]){let c=s[1].trim();if(c&&!c.includes("摘 要")&&!c.includes("皮皮兔")&&c.length<50){let d=document.createElement("div");d.textContent=`Cn： ${c}`,k.appendChild(d)}}});break}}}if(i.metaSelector){let q=document.querySelector(i.metaSelector);if(q){let z=q.cloneNode(!0);Array.from(z.children).forEach(e=>{k.appendChild(e)})}}k.children.length>0&&_.appendChild(k);let P=document.createElement("div");P.className="images";let T=[];if(a){if("xchina.co"===n.domain){let N=Array.from(document.querySelectorAll("script"));for(let I of N){let O=I.innerHTML;if(O.includes("var videos")&&O.includes("var domain")){try{let j=O.match(/var domain\s*=\s*["']([^"']+)["']/),M=O.match(/var videos\s*=\s*(\[.*?\]);/s);if(j&&M){let D=j[1],R=JSON.parse(M[1]);R.forEach(e=>{if(e.url){let t=document.createElement("div");t.className="video-wrapper";let i=document.createElement("video");i.className="vid",i.controls=!0,i.controlsList="nodownload",i.preload="metadata";let a=document.createElement("source");if(a.src=D+e.url,a.type="video/mp4",i.appendChild(a),t.appendChild(i),e.filesize){let o=document.createElement("div");o.className="video-info",o.style.cssText="text-align: center; margin-top: 8px; color: #666; font-size: 14px;",o.textContent=`文件大小: ${e.filesize}`,t.appendChild(o)}P.appendChild(t)}})}}catch(H){}break}}}else{let X=a.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="vimeo"], iframe[src*="bilibili"], iframe[src*="player"], [class*="video"][id*="player"], [class*="player"][id*="video"], .ckplayer-video, [id^="ckplayer"]');X.forEach(e=>{let t=e.closest(".related, .related-posts, .widget, .sidebar, aside, .recommended");if(t)return;let i=document.createElement("div");if(i.className="video-wrapper","VIDEO"===e.tagName){let a=e.cloneNode(!0);a.controls=!0,i.appendChild(a)}else if("IFRAME"===e.tagName){let o=e.cloneNode(!0);i.appendChild(o)}else if("DIV"===e.tagName&&(e.className.includes("video")||e.className.includes("player"))){let l=e.cloneNode(!0);if(i.appendChild(l),e.id){let n=document.querySelectorAll('script[src*="ckplayer"], script:not([src])');n.forEach(t=>{if(t.textContent.includes(e.id)||t.src.includes("ckplayer")){let a=t.cloneNode(!0);i.appendChild(a)}})}}P.appendChild(i)})}let Y=a.querySelectorAll("img");if(0===Y.length&&(Y=document.querySelectorAll("article img, .post img, .entry img, main img, p img")),"xchina.co"===n.domain){let B=e=>{let t=[],i=e.querySelectorAll('.item.photo-image .img, .img[role="img"]');return i.forEach(e=>{let i=e.getAttribute("style");if(i){let a=i.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);if(a){let o=a[1];(o=r(o))&&!o.includes("upload.xchina.io/media")&&t.push(o)}}}),t},U=B(a);U.forEach(e=>{let i=document.createElement("img");i.alt=t?.textContent||"",i.src=e,i.dataset.index=T.length,T.push(e),P.appendChild(i)});let W=document.querySelector('.pagination, .page-navigator, .pagenavi, .pager, [class*="page"]');if(W){let G=W.querySelectorAll('a[href*="/photo/"]'),Z=1;if(G.forEach(e=>{let t=e.href.match(/\/(\d+)\.html$/);if(t){let i=parseInt(t[1]);i>Z&&(Z=i)}}),Z>1){let F=document.createElement("div");F.style.cssText="text-align: center; padding: 20px; color: #3b82f6; font-size: 16px; background: #f0f9ff; border-radius: 12px; margin: 20px 0; font-weight: 600;",F.textContent=`正在加载第 2 页 / 共 ${Z} 页...`,P.appendChild(F);let K=window.location.href,Q=K.match(/\/photo\/(id-[^\/\.]+)/);if(Q){let V=Q[1];(async()=>{let e=0;for(let i=2;i<=Z;i++)try{F.textContent=`正在加载第 ${i} 页 / 共 ${Z} 页...`;let a=`https://xchina.co/photo/${V}/${i}.html`,o=await fetch(a),l=await o.text(),n=new DOMParser,r=n.parseFromString(l,"text/html"),s=r.querySelector(".list.photo-waterfall, article, main");if(s||(s=r.body),s){let c=B(s);if(c.length>0){let d=document.createElement("div");d.style.cssText="text-align: center; padding: 15px; margin: 30px 0 15px; color: #666; font-size: 14px; border-top: 2px solid #e5e5e5; border-bottom: 2px solid #e5e5e5; background: #fafafa; font-weight: 600;",d.textContent=`第 ${i} 页`,P.insertBefore(d,F),c.forEach(i=>{let a=document.createElement("img");a.alt=t?.textContent||"",a.src=i,a.dataset.index=T.length,T.push(i),P.insertBefore(a,F),e++})}}}catch(p){}F.remove();let m=document.createElement("div");m.style.cssText="text-align: center; padding: 20px; color: #10b981; font-size: 16px; background: #f0fdf4; border-radius: 12px; margin: 20px 0; font-weight: 600;",m.textContent=`✅ 成功加载 ${Z} 页，共 ${T.length} 张图片`,P.appendChild(m)})()}}}}else Y.forEach((e,i)=>{let a=e.getAttribute("data-original")||e.getAttribute("data-src")||e.getAttribute("src");if("52doll.com"===n.domain){let o=null,l=e.closest(".comiis_postimg");if(l){let s=l.previousElementSibling;if(s&&s.classList.contains("ui-artZoom-buttons")){let c=s.querySelector("a.ui-artZoom-source");c&&c.href&&(o=c.href)}}if(!o){let d=e.getAttribute("comiis_loadimages");d&&(o=d.replace(".thumb.jpg",".jpg").replace(".thumb.jpeg",".jpeg").replace(".thumb.png",".png"))}if(!o){let p=e.getAttribute("file")||e.getAttribute("zoomfile");p&&(o=p)}o&&(a=o)}if("jb9.es"===n.domain){let m=e.closest("a");m&&m.href&&m.href.match(/\.(jpg|jpeg|png|webp|gif)$/i)?a=m.href:a&&a.match(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i)&&(a=a.replace(/-\d+x\d+\./,"."))}a=r(a);let g=e.closest(".related, .related-posts, .single-related, .widget, .sidebar, aside, .recommended, .article-tags, .post-tags"),h="coserlab.io"===n.domain&&a.match(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i)&&!a.includes("-scaled."),u="jb9.es"===n.domain&&e.naturalWidth>0&&e.naturalWidth<150,$="615ku.com"===n.domain&&a.toLowerCase().endsWith(".gif"),f="52doll.com"===n.domain&&(a.includes("/static/image/smiley")||a.includes("/static/image/common")||a.includes("smilies/")||a.includes("icon.gif")||a.includes("stamp.gif")||a.toLowerCase().endsWith(".gif")&&(a.includes("/static/")||a.includes("/image/")||e.width<50)),b=a&&!a.includes("logo")&&!a.includes("icon")&&!a.includes("avatar")&&!a.includes("timthumb.php")&&!a.includes("default")&&!a.includes("placeholder")&&!h&&!u&&!$&&!f&&!g;if(b){let x=document.createElement("img");x.alt=e.alt||t?.textContent||"",x.dataset.src=a,x.dataset.index=T.length,x.classList.add("lazy-img"),T.push(a),P.appendChild(x)}else if("52doll.com"===n.domain&&i<10){let y=[];a||y.push("无URL"),a&&a.includes("logo")&&y.push("logo"),a&&a.includes("icon")&&y.push("icon"),a&&a.includes("avatar")&&y.push("avatar"),h&&y.push("缩略图"),u&&y.push("小图"),$&&y.push("615ku过滤"),f&&y.push("52doll表情/图标"),g&&y.push("相关推荐区域")}})}_.appendChild(P);let J=Array.from(document.querySelectorAll('script[src*="ckplayer"], script[src*="player"], link[href*="ckplayer"], link[href*="player"]')),ee=Array.from(document.querySelectorAll("script:not([src])")).filter(e=>e.textContent.includes("ckplayer")||e.textContent.includes("player"));document.head.innerHTML="",document.head.appendChild(v),J.forEach(e=>{document.head.appendChild(e.cloneNode(!0))}),ee.forEach(e=>{document.head.appendChild(e.cloneNode(!0))}),b(),document.body.innerHTML="",document.body.appendChild(_),T.length>0?setTimeout(()=>{let t=document.querySelector("#clean-detail-view .images");t&&(function t(i,a){let o=document.createElement("div");o.className="image-viewer-overlay",o.style.display="none";let l=document.createElement("div");l.className="image-viewer-container";let n=document.createElement("img");n.className="image-viewer-img";let r=document.createElement("div");r.className="image-viewer-info";let s=document.createElement("div");s.className="image-viewer-close",s.innerHTML="\xd7",l.appendChild(n),o.appendChild(l),o.appendChild(r),o.appendChild(s),document.body.appendChild(o);let c=0,d=1,p=!1,m=0,g=0,h=0,u=0,$=0;function f(){o.classList.remove("active"),setTimeout(()=>{o.style.display="none",d=1,u=0,$=0,n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`},300)}function b(e){e<0&&(e=i.length-1),e>=i.length&&(e=0),c=e,d=1,u=0,$=0,n.src=i[c],n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`,r.textContent=`${c+1} / ${i.length}`}let x=a.querySelectorAll("img");x.forEach(e=>{e.addEventListener("click",function(e){var t;e.preventDefault(),e.stopPropagation();let a=parseInt(this.dataset.index);c=t=a,d=1,h=0,u=0,$=0,n.src=i[c],n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`,r.textContent=`${c+1} / ${i.length}`,o.style.display="flex",setTimeout(()=>o.classList.add("active"),10)})}),s.addEventListener("click",e=>{e.stopPropagation(),f()}),o.addEventListener("click",e=>{e.target===o&&f()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&o.classList.contains("active")&&f()}),l.addEventListener("wheel",t=>{t.preventDefault();let i=t.deltaY>0?-e.ZOOM_STEP:e.ZOOM_STEP,a=d;d+=i,1===(d=Math.max(e.MIN_ZOOM,Math.min(e.MAX_ZOOM,d)))&&(u=0,$=0),n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`},{passive:!1}),l.addEventListener("mousedown",e=>{(e.target===n||e.target===l)&&(p=!0,m=e.clientX,g=e.clientY,h=0,l.classList.add("dragging"),e.preventDefault())}),document.addEventListener("mousemove",e=>{if(p){if(d>1){let t=e.clientX-m,i=e.clientY-g;u+=t/d,$+=i/d,m=e.clientX,g=e.clientY,n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`}else{h=e.clientX-m;let a=Math.max(.5,1-Math.abs(h)/500);n.style.opacity=a}}}),document.addEventListener("mouseup",t=>{p&&(p=!1,l.classList.remove("dragging"),n.style.opacity="1",1===d&&Math.abs(h)>e.DRAG_SWITCH_THRESHOLD&&(h>0?b(c-1):b(c+1)),h=0)});let y=0,_=0,v=0,w=0,S=1;function k(e,t){let i=e.clientX-t.clientX,a=e.clientY-t.clientY;return Math.sqrt(i*i+a*a)}l.addEventListener("touchstart",e=>{1===e.touches.length?(y=e.touches[0].clientX,_=e.touches[0].clientY,v=0):2===e.touches.length&&(e.preventDefault(),w=k(e.touches[0],e.touches[1]),S=d)},{passive:!1}),l.addEventListener("touchmove",t=>{if(2===t.touches.length){t.preventDefault();let i=k(t.touches[0],t.touches[1]),a=i/w;1===(d=Math.max(e.MIN_ZOOM,Math.min(e.MAX_ZOOM,S*a)))&&(u=0,$=0),n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`}else if(1===t.touches.length){if(d>1){t.preventDefault();let o=t.touches[0].clientX-y,l=t.touches[0].clientY-_;u+=o/d,$+=l/d,y=t.touches[0].clientX,_=t.touches[0].clientY,n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`}else{v=t.touches[0].clientX-y;let r=Math.max(.5,1-Math.abs(v)/500);n.style.opacity=r}}},{passive:!1}),l.addEventListener("touchend",t=>{n.style.opacity="1",0===t.touches.length&&(1===d&&Math.abs(v)>e.DRAG_SWITCH_THRESHOLD&&(v>0?b(c-1):b(c+1)),v=0)},{passive:!0}),n.addEventListener("dblclick",e=>{e.preventDefault(),1===d?d=2:(d=1,u=0,$=0),n.style.transform=`scale(${d}) translate(${u}px, ${$}px)`})}(T,t),function e(t){let i=t.querySelectorAll(".lazy-img");if(0===i.length)return;let a=new g(5),o=document.createElement("div");o.className="image-loading-progress",o.style.cssText="position: fixed; top: 70px; right: 20px; background: rgba(0, 0, 0, 0.85); color: white; padding: 12px 20px; border-radius: 20px; font-size: 13px; z-index: 99999; display: none; backdrop-filter: blur(10px);",document.body.appendChild(o),a.onProgress((e,t)=>{e<t?(o.textContent=`图片加载中 ${e}/${t}`,o.style.display="block"):(o.textContent=`✓ 全部加载完成 (${t})`,setTimeout(()=>{o.style.display="none"},2e3))});let l=Array.from(i).slice(0,10),n=Array.from(i).slice(10);if(l.forEach(e=>{let t=e.dataset.src;t&&a.add(e,t)}),n.length>0){let r=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target,i=t.dataset.src;!i||t.classList.contains("loaded")||t.classList.contains("loading")||(t.classList.add("loading"),a.add(t,i),r.unobserve(t))}})},{root:null,rootMargin:"500px",threshold:.01});n.forEach(e=>{r.observe(e)})}}(t))},e.ANIMATION_DELAY):b(),setTimeout(()=>{let e=document.querySelectorAll(".ckplayer-video");e.length>0&&window.ckplayer&&e.forEach(e=>{let t=e.id,i=e.getAttribute("data-key");if(t&&i)try{new window.ckplayer({container:`#${t}`,video:atob(i)})}catch(a){}})},500)}function v(){if(!n){b();return}if(!function e(){if(!n)return!1;let t=f();if("other"!==t)return!1;let i=n.domain,a=null;for(let l in o)if(i.includes(l)){a=l;break}if(!a)return!1;let r=S(a);if(!r)return!1;let s=o[a],c=s.find(e=>e.name===r);return!!c&&!!c.url&&(window.location.href=c.url,!0)}())try{let e=f();"list"===e?"mt123.cc"===n.domain?function e(){document.body.classList.add("mt123-list-page");let t=document.getElementById("mt123-clean-style");t&&t.remove();let i=document.createElement("style");i.id="mt123-clean-style",i.textContent=`
      body.mt123-list-page .erx-side-nav { display: none !important; }
      
      body.mt123-list-page .erx-header { display: none !important; }
      body.mt123-list-page .erx-home-nav { display: none !important; }
      body.mt123-list-page header, 
      body.mt123-list-page nav:not(.erx-w-inner), 
      body.mt123-list-page .navbar, 
      body.mt123-list-page #navbar { display: none !important; }
      
      body.mt123-list-page aside, 
      body.mt123-list-page .sidebar, 
      body.mt123-list-page #sidebar { display: none !important; }
      
      body.mt123-list-page footer, 
      body.mt123-list-page .footer, 
      body.mt123-list-page #footer { display: none !important; }
      
      body.mt123-list-page .ad, 
      body.mt123-list-page .ads, 
      body.mt123-list-page [class*="ad-"], 
      body.mt123-list-page [id*="ad-"],
      body.mt123-list-page ins.adsbygoogle { display: none !important; }
      body.mt123-list-page .banner { display: none !important; }
      
      body.mt123-list-page .breadcrumb, 
      body.mt123-list-page [class*="bread"] { display: none !important; }
      body.mt123-list-page h1:not(.m-title), 
      body.mt123-list-page h2:not(.m-title), 
      body.mt123-list-page .page-title { display: none !important; }
      
      body.mt123-list-page {
        background-color: #f5f5f5 !important;
        padding: 10px !important;
        margin: 0 !important;
      }
      
      @media (max-width: 768px) {
        body.mt123-list-page {
          padding: 0 !important;
          padding-bottom: 60px !important;
        }
        
        body.mt123-list-page .erx-main-wrap {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
      }
      
      @media (min-width: 769px) {
        body.mt123-list-page .erx-main-wrap {
          padding-top: 70px !important;
        }
      }
      
      body.mt123-list-page > *:not(.site-nav-desktop):not(.site-nav-mobile):not(#floating-tool-button):not(#category-overlay):not(.erx-header):not(.erx-side-nav) { display: block !important; }
      body.mt123-list-page section:has(.erx-w-item) { display: block !important; }
      body.mt123-list-page .erx-main-wrap > *:not(.erx-list-box):not(.page-load-status) { display: none !important; }
      body.mt123-list-page .erx-list-box { display: block !important; }
      
      body.mt123-list-page section:not(.erx-side-nav) {
        max-width: 1400px !important;
        margin: 0 auto !important;
      }
      
      body.mt123-list-page .erx-w-item {
        background: white !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        transition: transform 0.2s, box-shadow 0.2s !important;
        margin-bottom: 10px !important;
      }
      
      body.mt123-list-page .erx-w-item:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
      
      body.mt123-list-page .m-thumb img {
        width: 100% !important;
        height: 200px !important;
        object-fit: cover !important;
      }
      
      body.mt123-list-page .m-title {
        padding: 10px !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
      }
      
      body.mt123-list-page .o-meta {
        display: none !important;
      }
    `,document.head.appendChild(i),b()}():"coserlab.io"===n.domain?function e(){let t=document.createElement("style");t.id="coserlab-clean-style",t.textContent=`
      header, nav:not([class*="post"]), .navbar, .site-header { display: none !important; }
      
      aside, .sidebar, .widget-area { display: none !important; }
      
      footer, .site-footer { display: none !important; }
      
      .login-btn, .register-btn, [class*="login"], [class*="register"] { 
        display: none !important; 
      }
      
      .ad, .ads, [class*="ad-"], [id*="ad-"] { display: none !important; }
      ins, ins.adsbygoogle { display: none !important; }
      #noir-leaderboard, #noir-leaderboard > div { display: none !important; }
      body > ins { display: none !important; }
      [class*="adsbygoogle"] { display: none !important; }
      [id*="google_ads"] { display: none !important; }
      iframe[src*="ads"], iframe[src*="doubleclick"] { display: none !important; }
      
      .modal, .popup, .dialog, .lightbox { display: none !important; }
      .overlay, .backdrop, .mask, .dimmer { display: none !important; }
      [class*="popup"], [class*="modal"], [class*="overlay"] { display: none !important; }
      [class*="pop-up"], [id*="popup"], [id*="modal"] { display: none !important; }
      
      #card,
      div#card,
      body > #card,
      body #card { 
        display: none !important; 
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -9999px !important;
      }
      [id*="vignette"], [class*="vignette"] { display: none !important; }
      .google-vignette { display: none !important; }
      
      body > div[style*="position: fixed"][style*="z-index"] { display: none !important; }
      body > div[style*="position:fixed"][style*="z-index"] { display: none !important; }
      
      body {
        background-color: #f5f5f5 !important;
        padding: 20px !important;
        margin: 0 !important;
      }
      
      main, .main-content, [role="main"] {
        max-width: 1400px !important;
        margin: 0 auto !important;
      }
      
      article, .post-item {
        background: white !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        transition: transform 0.2s, box-shadow 0.2s !important;
        margin-bottom: 15px !important;
      }
      
      article:hover, .post-item:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
      
      article img, .post-item img {
        width: 100% !important;
        height: 250px !important;
        object-fit: cover !important;
      }
      
      .load-more, .more-link, [class*="load-more"], .btn-load-more {
        display: block !important;
        margin: 30px auto !important;
        text-align: center !important;
      }
    `,document.head.appendChild(t),b(),y()}():function e(){let t=window.location.pathname,i=n.config.list,a=t.match(i.urlPattern),o,l;if("pandadiu.com"===n.domain)o=a?a[1]:"30",l=a?parseInt(a[2]):1;else if("pptcg.com"===n.domain)o=t.split("/")[1]||"shaonvmanhua",l=a&&a[1]?parseInt(a[1]):1;else if("bisipic.xyz"===n.domain){let r=t.match(/\/forum-(\d+)-(\d+)\.html/);o=r?r[1]:"2",l=r?parseInt(r[2]):1}else if("jb9.es"===n.domain){let s=t.match(/\/category\/([^/]+)/);o=s?s[1]:"default",l=a&&a[1]?parseInt(a[1]):1}else"xchina.co"===n.domain?(o=a?a[1]:"1",l=a&&a[2]?parseInt(a[2]):1):"615ku.com"===n.domain?(o=a&&a[1]?a[1]:"index",l=a&&a[2]?parseInt(a[2]):1):"52doll.com"===n.domain&&(o=a?a[1]:"39",l=a?parseInt(a[2]):1);let c=()=>{let e=document.querySelector(i.containerSelector);if(!e&&"complete"!==document.readyState){setTimeout(c,100);return}let t=`${n.domain}_list_state_${o}`;if("52doll.com"===n.domain){let a=sessionStorage.getItem("52doll_cache_version");if("5.6.2"!==a){let r=[];for(let s=0;s<sessionStorage.length;s++){let p=sessionStorage.key(s);p&&p.startsWith("52doll.com_list_state_")&&r.push(p)}r.forEach(e=>sessionStorage.removeItem(e)),sessionStorage.setItem("52doll_cache_version","5.6.2")}}let m=sessionStorage.getItem(t);if(m)try{var g,h;let u=JSON.parse(m);g=u,h=o,x(g.workItems,h,g.currentPage,g.scrollPosition);return}catch($){sessionStorage.removeItem(t)}let f=d(document.querySelectorAll(i.containerSelector),n.config);if(0===f.length){b();return}x(f,o,l)};c()}():"detail"===e?function e(){let t=n.config.detail,i=0,a=()=>{i++;let e=s(t.titleSelector),o=s(t.contentSelector);e&&o?_(e,t):i<10?setTimeout(a,500):_(e,t)};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{setTimeout(a,300)}):setTimeout(a,300)}():b()}catch(t){b()}}function w(e){try{let t=e+"=",i=document.cookie.split(";");for(let a=0;a<i.length;a++){let o=i[a];for(;" "===o.charAt(0);)o=o.substring(1,o.length);if(0===o.indexOf(t))return decodeURIComponent(o.substring(t.length,o.length))}return null}catch(l){return null}}function S(e){let t=`cleanBrowser_${e}_lastCategory`;try{return localStorage.getItem(t)||w(t)}catch(i){return w(t)}}function k(e,t){let i=`cleanBrowser_${e}_lastCategory`;try{localStorage.setItem(i,t)}catch(a){!function e(t,i,a=365){try{let o=new Date;return o.setTime(o.getTime()+864e5*a),document.cookie=`${t}=${encodeURIComponent(i)};expires=${o.toUTCString()};path=/;SameSite=Lax`,!0}catch(l){return!1}}(i,t)}}function E(){let e=a.map(e=>`<a href="${e.url}" class="nav-tab" data-site="${e.id}"><span class="nav-icon">${e.icon}</span><span class="nav-text">${e.name}</span></a>`).join(""),t=a.map(e=>`<a href="${e.url}" class="nav-tab-mobile" data-site="${e.id}"><span class="nav-icon">${e.icon}</span><span class="nav-text">${e.mobileName||e.name}</span></a>`).join(""),i=`
      <div id="site-nav-bar" class="site-nav-desktop">
        <div class="nav-container">
          <div class="nav-logo">🎨</div>
          <div class="nav-tabs">${e}</div>
          <div class="nav-toggle" id="nav-toggle">☰</div>
        </div>
      </div>
      <div id="site-nav-bar-mobile" class="site-nav-mobile">${t}</div>
    `,l=`
      <style id="site-nav-styles">
        .site-nav-desktop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .nav-container {
          display: flex;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          height: 60px;
          gap: 30px;
        }

        .nav-logo {
          font-size: 28px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .nav-tabs {
          display: flex;
          gap: 5px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .nav-tabs::-webkit-scrollbar {
          display: none;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          color: #64748b;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 500;
          position: relative;
          flex-shrink: 0;
        }

        .nav-tab::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 80%;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          border-radius: 3px 3px 0 0;
          transition: transform 0.3s ease;
        }

        .nav-tab:hover {
          background: rgba(0, 0, 0, 0.04);
          color: #1e293b;
        }

        .nav-tab.active {
          color: #3b82f6;
          font-weight: 600;
        }

        .nav-tab.active::before {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-toggle {
          color: #64748b;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          display: none;
        }

        body {
          padding-top: 60px !important;
          padding-bottom: 0 !important;
        }

        .site-nav-mobile {
          display: none !important;
        }

        @media (max-width: 768px) {
          .site-nav-desktop {
            display: none !important;
          }

          body:not(.mt123-list-page) {
            padding-top: 0 !important;
            padding-bottom: 60px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          body.has-subtabs {
            padding-top: 0 !important;
          }

          body.has-subtabs-mobile {
            padding-bottom: 120px !important;
          }

          #clean-list-view, #clean-detail-view {
            padding: 10px !important;
          }

          .site-nav-mobile {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            z-index: 999999;
            display: flex !important;
            justify-content: space-around;
            padding: 8px 5px;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .site-nav-mobile::-webkit-scrollbar {
            display: none;
          }

          .nav-tab-mobile {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 6px 10px;
            color: #64748b;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s ease;
            min-width: 60px;
            font-size: 11px;
            position: relative;
          }

          .nav-tab-mobile .nav-icon {
            font-size: 20px;
          }

          .nav-tab-mobile:hover {
            background: rgba(0, 0, 0, 0.04);
            color: #1e293b;
          }

          .nav-tab-mobile.active {
            color: #3b82f6;
            font-weight: 600;
          }

          .nav-tab-mobile.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            border-radius: 0 0 3px 3px;
          }

          body:not(.mt123-list-page) {
            padding-top: 0 !important;
            padding-bottom: 60px !important;
          }
        }

        #floating-tool-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          z-index: 999998;
          transition: all 0.3s ease;
          user-select: none;
        }

        #floating-tool-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }

        #floating-tool-button .button-icon {
          font-size: 24px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        #category-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        #category-overlay.show {
          opacity: 1;
        }

        #category-overlay .category-panel {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transform: scale(0.95);
          transition: transform 0.3s ease;
        }

        #category-overlay.show .category-panel {
          transform: scale(1);
        }

        #category-overlay .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        #category-overlay .category-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        #category-overlay .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        #category-overlay .close-btn:hover {
          background: #f1f5f9;
          color: #64748b;
        }

        #category-overlay .categories-section {
          padding: 24px;
          overflow-y: auto;
        }

        #category-overlay .categories-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        #category-overlay .category-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #475569;
        }

        #category-overlay .category-item:hover {
          background: #f0f9ff;
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
        }

        #category-overlay .category-item.saved {
          background: #f0fdf4;
          border-color: #22c55e;
          color: #16a34a;
        }

        #category-overlay .check-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        #category-overlay .category-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #category-overlay .no-categories {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          #floating-tool-button {
            bottom: 80px;
            right: 20px;
            width: 52px;
            height: 52px;
          }

          #floating-tool-button .button-icon {
            font-size: 20px;
            line-height: 1;
          }

          #category-overlay .category-panel {
            max-width: 100%;
            max-height: 100%;
            height: 100vh;
            border-radius: 0;
          }

          #category-overlay .categories-section {
            padding: 16px;
          }

          #category-overlay .categories-list {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 10px;
          }

          #category-overlay .category-item {
            padding: 10px 14px;
            font-size: 13px;
          }
        }
      </style>
    `;document.head.insertAdjacentHTML("beforeend",l),document.body.insertAdjacentHTML("afterbegin",i);let r=n?.domain;r&&document.querySelectorAll(".nav-tab, .nav-tab-mobile").forEach(e=>{r.includes(e.dataset.site)&&e.classList.add("active")});let s=[...document.querySelectorAll(".nav-tab"),...document.querySelectorAll(".nav-tab-mobile")];s.forEach(e=>{e.addEventListener("click",t=>{let i=e.dataset.site;if(!o[i])return;t.preventDefault();let a=o[i];if(!a||0===a.length)return;let l=Math.floor(Math.random()*a.length),n=a[l];k(i,n.name),window.location.href=n.url})});let c=document.getElementById("nav-toggle");c&&c.addEventListener("click",()=>{let e=document.querySelector(".nav-tabs");e&&(e.style.display="none"===e.style.display?"flex":"none")}),function e(){let t=function e(){try{let t=localStorage.getItem("floatingButtonPosition");return t?JSON.parse(t):null}catch(i){return null}}(),i=document.createElement("div");i.id="floating-tool-button",i.innerHTML=`<div class="button-icon">⚙️</div>`,t&&(i.style.right=t.right,i.style.bottom=t.bottom);let l=null,r=!1,s=0,c=0,d=0,p=0,m=e=>{let t=e.touches?e.touches[0]:e;s=t.clientX,c=t.clientY,l=setTimeout(()=>{r=!0,i.style.opacity="0.8",i.style.cursor="move"},500)},g=e=>{if(!r){let t=e.touches?e.touches[0]:e,a=Math.abs(t.clientX-s),o=Math.abs(t.clientY-c);(a>10||o>10)&&clearTimeout(l);return}e.preventDefault();let n=e.touches?e.touches[0]:e;d=n.clientX,p=n.clientY;let m=i.getBoundingClientRect(),g=window.innerWidth-d-m.width/2,h=window.innerHeight-p-m.height/2;i.style.right=Math.max(10,Math.min(window.innerWidth-m.width-10,g))+"px",i.style.bottom=Math.max(10,Math.min(window.innerHeight-m.height-10,h))+"px"},h=e=>{clearTimeout(l),r?(r=!1,i.style.opacity="",i.style.cursor="",function e(t){try{localStorage.setItem("floatingButtonPosition",JSON.stringify(t))}catch(i){}}({right:i.style.right,bottom:i.style.bottom})):function e(){let t=n?.domain,i=null,l=[];for(let[r,s]of Object.entries(o))if(t&&t.includes(r)){i=r,l=s;break}let c=i?S(i):null,d=i?a.find(e=>e.id===i)?.name:"",p=document.createElement("div");p.id="category-overlay",p.innerHTML=`
      <div class="category-panel">
        <div class="category-header">
          <h2>📂 ${d?d+" - ":""}分类导航</h2>
          <button class="close-btn">✕</button>
        </div>
        ${i&&l.length>0?`
          <div class="categories-section">
            <div class="categories-list">
              ${l.map(e=>`
                <div class="category-item ${c===e.name?"saved":""}" data-url="${e.url}" data-name="${e.name}">
                  <span class="check-icon">${c===e.name?"✨":"⭐"}</span>
                  <span class="category-name">${e.name}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `:'<div class="no-categories">该站点暂无分类导航</div>'}
      </div>
    `,document.body.appendChild(p),setTimeout(()=>p.classList.add("show"),10);let m=p.querySelector(".close-btn");i&&l.length>0&&p.querySelectorAll(".category-item").forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.url,a=e.dataset.name;k(i,a),window.location.href=t})}),m.addEventListener("click",()=>{p.classList.remove("show"),setTimeout(()=>p.remove(),300)}),p.addEventListener("click",e=>{e.target===p&&(p.classList.remove("show"),setTimeout(()=>p.remove(),300))})}()};return i.addEventListener("mousedown",m),i.addEventListener("touchstart",m,{passive:!1}),i.addEventListener("mousemove",g),i.addEventListener("touchmove",g,{passive:!1}),i.addEventListener("mouseup",h),i.addEventListener("touchend",h),i.addEventListener("mouseleave",()=>{clearTimeout(l),r&&(r=!1,i.style.opacity="",i.style.cursor="")}),document.body.appendChild(i),i}()}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",v):v(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{setTimeout(E,100)}):setTimeout(E,100)}();