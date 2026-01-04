// ==UserScript==
// @name         Luogu User Introduction Viewer
// @namespace    https://smkttl.github.io/
// @version      1.2
// @description  在洛谷个人主页显示被隐藏的个人介绍
// @author       smktll
// @match        *://luogu.com.cn/user/*
// @match        *://*.luogu.com.cn/user/*
// @license      CC-BY-NC-ND
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552348/Luogu%20User%20Introduction%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/552348/Luogu%20User%20Introduction%20Viewer.meta.js
// ==/UserScript==

function latexToHtml(latex,displayStyle)
{
    latex=katex.renderToString(latex,{throwOnError:false});
    if(displayStyle) {
        latex=`<span class="katex-display katex">${latex}</span>`
    } else {
        latex=`<span class="katex">${latex}</span>`
    }
    return latex;
}
function markdownToHtmlWithoutCode(markdown)
{
    markdown=markdown.replace(/^(#{1,6})\s*(.*)$/gm,function(_,level,text){return '<h'+level.length+'>'+text+'</h'+level.length+'>';});
    markdown=markdown.replace(/^(\s*)(-|\d+\.)\s+(.*)$/gm,function(_,spaces,bullet,text)
                              {
        if(bullet==='-')
        {
            return spaces+'<ul><li>'+text+'</li></ul>';
        }
        else
        {
            return spaces+'<ol><li>'+text+'</li></ol>';
        }
    });
    markdown=markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1"></img>');
    markdown=markdown.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2">$1</a>');
    markdown=markdown.replace(/\&lt;(.*?)\&gt;/g,'<a href="$1">$1</a>');
    markdown=markdown.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    markdown=markdown.replace(/\*(.*?)\*/g,'<em>$1</em>');
    markdown=markdown.replace(/__(.*?)__/g,'<strong>$1</strong>');
    markdown=markdown.replace(/_(.*?)_/g,'<em>$1</em>');
    markdown=markdown.replace(/~~(.*?)~~/g,'<s>$1</s>');
    markdown=markdown.replace(/^-{3,}$/gm,'<hr>');
    return markdown;
}
function generateUUID() {
    if(typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    if(typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
let seperateParser={}
function codeblockToId(code,enableDiv)
{
    let id=`{${generateUUID()}}`;
    if(enableDiv){
        code=code.replaceAll('\n','<br />')
    }
    seperateParser[id]=`<code>${code}</code>`;
    if(enableDiv){
        seperateParser[id]=`<pre>${seperateParser[id]}</pre>`;
    }
    return id;
}
function latexToId(code,enableDiv)
{
    let id=`{${generateUUID()}}`;
    seperateParser[id]=latexToHtml(code,enableDiv);
    return id;
}
function replaceSeperateParser(text){
    for (const [key, value] of Object.entries(seperateParser)) {
        text=text.replace(key,value);
    }
    return text;
}
function markdownToHtml(markdown,id)
{
    let result="";
    for(let i=0;i<markdown.length;i++)
    {
        if(i+2<markdown.length && markdown[i]=='`' && markdown[i+1]=='`' && markdown[i+2]=='`')
        {
            let codeblock="";
            i+=3;
            while(i<markdown.length && markdown[i]!='\n')
            {
                i++;
            }
            i++;
            while(i+3<markdown.length && !(markdown[i]=='\n' && markdown[i+1]=='`'&&markdown[i+2]=='`'&&markdown[i+3]=='`'))
            {
                codeblock+=markdown[i++];
            }
            i+=3;
            result+=codeblockToId(codeblock,true);
        }
        else if(markdown[i]=='`'&&(i==0||markdown[i-1]!='\\'))
        {
            let codeblock="";
            i++;
            while(i<markdown.length && !(markdown[i]=='`'&&markdown[i-1]!='\\'))
            {
                codeblock+=markdown[i++];
            }
            result+=codeblockToId(codeblock,false);
        }
        else if(i+1<markdown.length && markdown[i]=='$' && markdown[i+1]=='$')
        {
            let codeblock="";
            i+=2;
            while(i+1<markdown.length && !(markdown[i]=='$' && markdown[i+1]=='$'))
            {
                codeblock+=markdown[i++];
            }
            i++;
            result+=latexToId(codeblock,true);
        }
        else if(markdown[i]=='$' && (i==0 || markdown[i-1]!='\\'))
        {
            let codeblock="";
            i++;
            while(i<markdown.length && !(markdown[i]=='$' && markdown[i-1]!='\\'))
            {
                codeblock+=markdown[i++];
            }
            result+=latexToId(codeblock,false);
        }
        else result+=markdown[i];
    }
    result=markdownToHtmlWithoutCode(result);
    result=replaceSeperateParser(result);
    return result;
}
(function() {
    'use strict';

    const observer=new MutationObserver(function(mutationsList,observer){
        let par=Array.from(document.querySelectorAll('div.main')).filter(x=>x.className=='main')[0];
        console.log(par)
        if(par && par.children.length>1 && !document.getElementById('smkttl-user-intro-preview'))
        {
            let e=document.createElement('div');
            let data=JSON.parse(document.getElementById('lentille-context').innerText).data.user.introduction;
            data=markdownToHtml(data)
            e.setAttribute('data-v-b62e56e7','')
            e.setAttribute('data-v-bdfb92aa','')
            e.setAttribute('data-v-754e1ea4-s','')
            e.setAttribute('id','smkttl-user-intro-preview');
            e.className="l-card"
            e.innerHTML=`<div data-v-bdfb92aa="" class="header"><h3 data-v-bdfb92aa="" style="margin: 0px;">个人介绍（插件预览，注意修改后需要刷新）</h3></div><div data-v-bdfb92aa="" class="lfe-marked-wrap introduction"><div class="lfe-marked">${data}</div></div>`
            par.appendChild(e)
        }
    });
    observer.observe(document,{childList:true,subtree:true});
})();
