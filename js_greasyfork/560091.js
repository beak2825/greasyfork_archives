// ==UserScript==
// @name        金投网专注看数据
// @namespace   蒋晓楠
// @version     20251224
// @description 就看黄金和白银走势
// @author      蒋晓楠
// @license     MIT
// @match       https://quote.cngold.org/gjs/gjhj_xh*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=cngold.org
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560091/%E9%87%91%E6%8A%95%E7%BD%91%E4%B8%93%E6%B3%A8%E7%9C%8B%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/560091/%E9%87%91%E6%8A%95%E7%BD%91%E4%B8%93%E6%B3%A8%E7%9C%8B%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
["topInfo","head","cur-location","fl.left","fl.right>div:last-child","footer+.jams","footer+.jams","actGotop_fixed"].forEach((样式)=>{
    document.querySelector("."+样式).remove();
});
//移除顶部黑条
setTimeout(()=>{
    document.querySelector("iframe").remove();},300);
//让信息块居中
let 信息块样式=document.querySelector(".content").style;
信息块样式.position="relative";
信息块样式.left="30%";