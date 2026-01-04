// ==UserScript==
// @name         Prune Amazon Vine
// @namespace    http://tampermonkey.net/
// @version      2025-10-11
// @description  Remove things you don't want to see from Amazon Vine listings
// @author       ZetaGecko
// @license      MIT
// @match        https://www.amazon.com/vine/vine-items?queue=encore*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/552487/Prune%20Amazon%20Vine.user.js
// @updateURL https://update.greasyfork.org/scripts/552487/Prune%20Amazon%20Vine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var i,showmode,remove,exceptions,temp,el1,el2,el3,removeedit,exceptionedit,hidecount,pvexpanded,pvcollapsed;

    function PVUpdateDisplay() {
        var j,k,hid,titleel,title,matched;

        hid=0;
        for (i=0;i<items.length;i++){
            titleel=items[i].getElementsByClassName('a-truncate-full');
            if (titleel.length) {
                title = titleel[0].innerText.toLowerCase();
                for (j=0;j<remove.length;j++) {
                    matched=0;
                    if (typeof(remove[j]) === 'string') {
                        if (title.indexOf(remove[j])>-1) matched=1;
                    } else {
                        for (k=0;k<remove[j].length;k++) if (title.indexOf(remove[j][k])<0) break;
                        if (k==remove[j].length) matched=1;
                    }
                    if (matched) {
                        for (k=0;k<exceptions.length;k++) {
                            if (title.indexOf(exceptions[k])>-1) break;
                        }
                        if (k<exceptions.length) matched=0;
                        else break;
                    }
                }
                if ((matched == 1) == (showmode == 0)) {
                    items[i].style.display='none';
                    hid++;
                } else items[i].style.display='block';
            }
        }
        hidecount.innerText = 'Pruned: '+hid;
    }

    function PVSortSettings(a,b) {
        var i;
        if (typeof(a) === 'string') {
            if (typeof(b) === 'string') return (a<b)?-1:((b<a)?1:0);
            return -1;
        }
        if (typeof(b) === 'string') return 1;
        for (i=0;(i<a.length)&&(i<b.length);i++) if (a[i]!=b[i]) break;
        return (i<a.length) ? ((i<b.length) ? ((a[i]<b[i])?-1:((b[i]<a[i])?1:0)) : 1) : -1;
    }
    function PVSetJSON() {
        var t = JSON.parse(removeedit.value.trim().toLowerCase());
        if ((typeof(t) !== 'object') || !t.length) {
            alert('JSON error or no settings found.');
            return;
        }
        if (!confirm('Replace entire contents of prune list?')) return;
        GM_setValue('hidethese',JSON.stringify(t));
        PVUpdateDisplay();
    }
    function PVGetJSON() {
        removeedit.value = JSON.stringify(remove);
    }
    function PVSetJSONEx() {
       var t = JSON.parse(exceptionedit.value.trim().toLowerCase());
       if ((typeof(t) !== 'object') || !t.length) {
           alert('JSON error or no settings found.');
           return;
       }
       if (!confirm('Replace entire contents of exceptions list?')) return;
       GM_setValue('showthese',JSON.stringify(t));
       PVUpdateDisplay();
   }
   function PVGetJSONEx() {
       exceptionedit.value = JSON.stringify(exceptions);
   }
   function PVAddBlock() {
        var newone;
        newone = removeedit.value.replaceAll("\r","\n").replace(/\n{2,}/g,"\n").toLowerCase().split("\n");
        remove.push((newone.length == 1) ? newone[0] : newone);
        remove.sort(PVSortSettings);
        GM_setValue('hidethese',JSON.stringify(remove));
        PVUpdateDisplay();
    }
    function PVAddException() {
        var newone;
        newone = exceptionedit.value.replaceAll("\r","\n").replace(/\n{2,}/g,"\n").toLowerCase().split("\n");
        exceptions.push((newone.length == 1) ? newone[0] : newone);
        exceptions.sort(PVSortSettings);
        GM_setValue('showthese',JSON.stringify(exceptions));
        PVUpdateDisplay();
    }
    function PVRemoveBlock(event) {
        var n = parseInt(event.target.id.substr(13));
        remove.splice(n,1);
        GM_setValue('hidethese',JSON.stringify(remove));
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        PVUpdateDisplay();
    }
    function PVRemoveException(event) {
        var n = parseInt(event.target.id.substr(13));
        exceptions.splice(n,1);
        GM_setValue('showthese',JSON.stringify(exceptions));
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        PVUpdateDisplay();
    }
    function PVToggleShowMode() {
        showmode = 1 - showmode;
        PVUpdateDisplay();
    }
    function PVCollapse() {
        pvexpanded.style.display='none';
        pvcollapsed.style.display='block';
    }
    function PVExpand() {
        pvexpanded.style.display='block';
        pvcollapsed.style.display='none';
    }

    showmode = 0;
    temp = GM_getValue('hidethese','');
    remove = temp.length ? JSON.parse(temp) : [];
    temp = GM_getValue('showthese','');
    exceptions = temp.length ? JSON.parse(temp) : [];

    var items=document.getElementsByClassName('vvp-item-tile');

    temp=document.createElement('div');
    temp.style.zIndex=100000;
    temp.style.position='fixed';
    temp.style.top='3px';
    temp.style.left='3px';
    temp.style.backgroundColor='#ccc';
    temp.style.padding='2px 12px 8px 12px';
    temp.style.borderRadius='5px';
    temp.style.width='250px';

    temp.appendChild(pvexpanded = document.createElement('div'));

    pvexpanded.appendChild(hidecount = document.createElement('div'));
    hidecount.style.float='right';

    pvexpanded.appendChild(el1 = document.createElement('span'));
    el1.innerText = '-';
    el1.style.display='inline-block';
    el1.style.color='#fff';
    el1.style.backgroundColor='#555';
    el1.style.padding='2px 10px';
    el1.style.borderRadius='20px';
    el1.addEventListener('click',PVCollapse);

    pvexpanded.appendChild(el1 = document.createElement('span'));
    el1.innerText = ' Prune';
    pvexpanded.appendChild(document.createElement('br'));
    pvexpanded.appendChild(removeedit = document.createElement('textarea'));
    removeedit.style.width='100%';
    removeedit.style.height='60px';
    removeedit.style.overflow='auto';
    pvexpanded.appendChild(el1 = document.createElement('button'));
    el1.innerText='Add';
    el1.addEventListener('click',PVAddBlock);
    pvexpanded.appendChild(el1 = document.createElement('button'));
    el1.innerText='Set (JSON)';
    el1.addEventListener('click',PVSetJSON);
    pvexpanded.appendChild(el1 = document.createElement('button'));
    el1.innerText='Get JSON';
    el1.addEventListener('click',PVGetJSON);

    pvexpanded.appendChild(el1 = document.createElement('div'));
    el1.innerText = 'Exceptions';
    pvexpanded.appendChild(exceptionedit = document.createElement('textarea'));
    exceptionedit.style.width='100%';
    exceptionedit.style.height='60px';
    exceptionedit.style.overflow='auto';
    pvexpanded.appendChild(el1 = document.createElement('button'));
    el1.innerText='Add';
    el1.addEventListener('click',PVAddException);
    pvexpanded.appendChild(el1 = document.createElement('button'));
    el1.innerText='Set (JSON)';
    el1.addEventListener('click',PVSetJSONEx);
    pvexpanded.appendChild(el1 = document.createElement('button'));
    el1.innerText='Get JSON';
    el1.addEventListener('click',PVGetJSONEx);

    pvexpanded.appendChild(el1 = document.createElement('div'));
    el1.innerHTML = '<b>Prune List</b>';
    pvexpanded.appendChild(el1 = document.createElement('div'));
    el1.style.height='150px';
    el1.style.overflow='auto';
    for (i=0;i<remove.length;i++) {
        el1.appendChild(el2=document.createElement('div'));
        el2.appendChild(el3=document.createElement('span'));
        el3.style.color='#fff';
        el3.style.backgroundColor='#555';
        el3.style.padding='2px 8px';
        el3.style.borderRadius='30px';
        el3.style.cursor='pointer';
        el3.innerText='X';
        el3.id='PruneVineRDel'+i;
        el3.addEventListener('click',PVRemoveBlock);
        el2.appendChild(el3=document.createElement('span'));
        el3.innerHTML = ' ' + ((typeof(remove[i]) === 'string') ? remove[i] : remove[i].join(', '));
    }

    pvexpanded.appendChild(el1 = document.createElement('div'));
    el1.innerHTML = '<b>Exception List</b>';
    pvexpanded.appendChild(el1 = document.createElement('div'));
    el1.style.height='60px';
    el1.style.overflow='auto';
    for (i=0;i<exceptions.length;i++) {
        el1.appendChild(el2=document.createElement('div'));
        el2.appendChild(el3=document.createElement('span'));
        el3.style.color='#fff';
        el3.style.backgroundColor='#555';
        el3.style.padding='2px 8px';
        el3.style.borderRadius='30px';
        el3.style.cursor='pointer';
        el3.innerText='X';
        el3.id='PruneVineEDel'+i;
        el3.addEventListener('click',PVRemoveException);
        el2.appendChild(el3=document.createElement('span'));
        el3.innerHTML = ' ' + ((typeof(exceptions[i]) === 'string') ? exceptions[i] : exceptions[i].join(', '));
    }

    pvexpanded.appendChild(el1=document.createElement('div'));
    el1.style.color='#fff';
    el1.style.backgroundColor='#555';
    el1.style.padding='2px 12px';
    el1.style.borderRadius='15px';
    el1.innerText='hide <-> show';
    el1.align='center';
    el1.addEventListener('click',PVToggleShowMode);

    temp.appendChild(pvcollapsed = document.createElement('div'));
    pvcollapsed.style.display='none';
    pvcollapsed.appendChild(el1 = document.createElement('span'));
    el1.innerText = '+';
    el1.style.display='inline-block';
    el1.style.color='#fff';
    el1.style.backgroundColor='#555';
    el1.style.padding='2px 10px';
    el1.style.borderRadius='20px';
    el1.addEventListener('click',PVExpand);

    document.getElementById('a-page').appendChild(temp);

    PVUpdateDisplay();
})();
