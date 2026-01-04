// ==UserScript==
// @name         洛谷私信markdown图片渲染
// @version      0.1
// @description  私信markdown图片渲染
// @match        https://www.luogu.com.cn/chat$
// @match        https://www.luogu.com.cn/chat/*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/548006/%E6%B4%9B%E8%B0%B7%E7%A7%81%E4%BF%A1markdown%E5%9B%BE%E7%89%87%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/548006/%E6%B4%9B%E8%B0%B7%E7%A7%81%E4%BF%A1markdown%E5%9B%BE%E7%89%87%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function text(s){
        let x=document.createElement('Mathew');
        x.textContent=s;
        return x;
    }
    function image(s){
        let x=document.createElement('img');
        x.src=s;
        x.style="width:100%;height:auto;";
        return x;
    }
    function sol(x,s){
        let p=0;
        for(let i=0;i<s.length;i++)
        {
            if(i+3<s.length&&s.substr(i,2)=="!["){
                if(p<=i-1){
                    x.appendChild(text(s.substr(p,i-p)));
                    p=i;
                }
                let pos=0;
                for(let j=i+2;j<s.length;j++)
                {
                    if(s[j]==']'&&s[j+1]=='('){
                        pos=j;
                        break;
                    }
                }
                if(!pos){
                    continue;
                }
                i=pos;
                pos=0;
                for(let j=i+2;j<s.length;j++)
                {
                    if(s[j]==')'){
                        pos=j;
                        break;
                    }
                }
                if(!pos){
                    continue;
                }
                p=pos+1;
                let t=s.substr(i+2,pos-i-2);
                x.appendChild(image(t));
            }
        }
        if(p<=s.length-1){
            x.appendChild(text(s.substr(p,s.length-p)));
        }
    }
    function work(){
        setTimeout(function(){
            let loadmore=document.querySelector('.load-more');
            loadmore.addEventListener("click",work);
            const mes=document.querySelectorAll('[class="message"]');
            for(let cur of mes)
            {
                let txt=cur.textContent;
                cur.textContent="";
                let x=document.createElement('Mathew');
                while(cur.children.length)
                {
                    let chd=cur.children[0];
                }
                sol(x,txt);
                cur.appendChild(x);
            }
        },500)
    }
    window.addEventListener('load',function(){
        const but=document.querySelector("#app > div.main-container > main > div > div.card.wrapper.padding-none > div.side > div.panel-content > div").childNodes;
        for(let i=0;i<but.length;i++)
        {
            but[i].addEventListener("click",work);
        }
    },false);
})();