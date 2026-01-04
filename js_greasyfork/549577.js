// ==UserScript==
// @name         洛谷钩子修改器
// @namespace    http://tampermonkey.net/
// @version      1.1.10
// @description  将指定用户的钩子改为金钩
// @author       Cby
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549577/%E6%B4%9B%E8%B0%B7%E9%92%A9%E5%AD%90%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549577/%E6%B4%9B%E8%B0%B7%E9%92%A9%E5%AD%90%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var To="Segment_Treap";
    function f(element){
        const children=element.children;
        var t=element;
        console.log(element.innerText);
        if(element.innerText=='7 级 '){
             element.innerHTML='\n              10 级\n              <span data-v-69e27492="" data-v-8b7f80ba=""><a data-v-0640126c="" href="https://help.luogu.com.cn/manual/luogu/account/award-certify" target="_blank" colorscheme="none" class="color-none"><svg data-v-0640126c="" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="badge-check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-badge-check" style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;"><g data-v-0640126c="" class="fa-duotone-group"><path data-v-0640126c="" fill="currentColor" d="M256 0c36.8 0 68.8 20.7 84.9 51.1C373.8 41 411 49 437 75s34 63.3 23.9 96.1C491.3 187.2 512 219.2 512 256s-20.7 68.8-51.1 84.9C471 373.8 463 411 437 437s-63.3 34-96.1 23.9C324.8 491.3 292.8 512 256 512s-68.8-20.7-84.9-51.1C138.2 471 101 463 75 437s-34-63.3-23.9-96.1C20.7 324.8 0 292.8 0 256s20.7-68.8 51.1-84.9C41 138.2 49 101 75 75s63.3-34 96.1-23.9C187.2 20.7 219.2 0 256 0zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" class="fa-secondary"></path><path data-v-0640126c="" fill="currentColor" d="M369 175c9.4 9.4 9.4 24.6 0 33.9L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0z" class="fa-primary"></path></g></svg></a></span>';
        }
        if(element.innerHTML=="\n  "+To+"\n"){
            t=element.parentNode.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     if(t.children.length>=1){
                         t=t.children[0];
                         t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                     }
                 }
             }
        }
        if(element.innerHTML=="\n  "+To+"\n"){
            t=element.parentNode.parentNode.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                 }
             }
        }
        if(element.innerHTML=="\n  "+To+"\n"){
            t=element.parentNode.parentNode.parentNode.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     if(t.children.length>=1){
                         t=t.children[0];
                         t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                     }
                 }
             }
        }
        if(element.innerHTML=="\n  "+To+"\n"){
            t=element.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     if(t.children.length>=1){
                         t=t.children[0];
                         t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                     }
                 }
             }
        }
        if(element.innerHTML=="\n  "+To+"\n"){
            t=element.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     t.style.fill="gold";
                 }
             }
        }
        if(element.innerHTML==To){
            t=element.parentNode.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     if(t.children.length>=1){
                         t=t.children[0];
                         t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                     }
                 }
             }
        }
        if(element.innerHTML==To){
            t=element.parentNode.parentNode.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                 }
             }
        }
        if(element.innerHTML==To){
            t=element.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     if(t.children.length>=1){
                         t=t.children[0];
                         t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                     }
                 }
             }
        }
        if(element.innerHTML==To){
            t=element.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     t.style.fill="gold";
                 }
             }
        }
        if(element.innerHTML==To){
            t=element.parentNode.parentNode.parentNode.parentNode;
             if(t.children.length>1){
                 t=t.children[1];
                 if(t.children.length>=1){
                     t=t.children[0];
                     if(t.children.length>=1){
                         t=t.children[0];
                         t.style="--fa-primary-color: #fff; --fa-secondary-color: gold; --fa-secondary-opacity: 1;";
                     }
                 }
             }
        }
        for(let i=0;i<children.length;i++){
            f(children[i]);
        }
    }
    function g(){
        var feed=document.getElementsByClassName("feed");
        for(let i=0;i<feed.length;i++)f(feed[i]);
        var t2=document.getElementsByClassName("user-name");
        for(let i=0;i<t2.length;i++)f(t2[i]);
        var t3=document.getElementsByClassName("luogu-username user-name");
        for(let i=0;i<t3.length;i++)f(t3[i]);
        var t4=document.getElementsByClassName("user");
        for(let i=0;i<t4.length;i++)f(t4[i]);
        var t5=document.getElementsByClassName("title");
        for(let i=0;i<t5.length;i++)f(t5[i]);
        var t6=document.getElementsByClassName("item");
        for(let i=0;i<t6.length;i++)f(t6[i]);
        var t7=document.getElementsByClassName("feed-username");
        for(let i=0;i<t7.length;i++)f(t7[i]);
        var t8=document.getElementsByClassName("color-none");
        for(let i=0;i<t8.length;i++)f(t8[i]);
        var t9=document.getElementsByClassName("info-rows");
        for(let i=0;i<t9.length;i++)f(t9[i]);
        var t10=document.getElementsByClassName("l-card");
        for(let i=0;i<t10.length;i++)f(t10[i]);
    }
    g();
    const T = new MutationObserver(g);
    T.observe(document,{childList:true,subtree:true});
})();