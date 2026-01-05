// ==UserScript==
// @name         Easier Zulily Input
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.3.1
// @description  helps find PO numbers on Zulily's site
// @match        https://portal.zulily.com/shipments/addSmallShipment/*
// @match        https://portal.zulily.com/shipments/addEdi204/*
// @match        https://portal.zulily.com/shipments/submitTracking/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7392/Easier%20Zulily%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/7392/Easier%20Zulily%20Input.meta.js
// ==/UserScript==

a = document.createElement("div");
function paint(){
    var count=0, text, regexp, col;
    text=prompt("Search regexp:", "");
    col=prompt("Choose a color:","");
    if(text===null || text.length===0)return;
    if(col==="")col="yellow";
    try{regexp=new RegExp("(" + text +")", "i");}
    catch(er){alert("Unable to create regular expression using text '"+text+"'.\n\n"+er);return;}
    function searchWithinNode(node, re){
        var pos, skip, spannode, middlebit, endbit, middleclone;
        skip=0;
        if( node.nodeType==3 ){
            pos=node.data.search(re);
            if(pos>=0){
                spannode=document.createElement("SPAN");
                spannode.style.backgroundColor=col;
                middlebit=node.splitText(pos);
                endbit=middlebit.splitText(RegExp.$1.length);
                middleclone=middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode,middlebit);
                
                var b=spannode.parentNode.parentNode.childNodes[17].childNodes[0];
                b.focus();
                
                ++count;skip=1;
            }
        }else if( node.nodeType==1 && node.childNodes && node.tagName.toUpperCase()!="SCRIPT" && node.tagName.toUpperCase!="STYLE"){
            for (var child=0; child < node.childNodes.length; ++child){
                child=child+searchWithinNode(node.childNodes[child], re);
            }
        }
        return skip;
    }
    window.status="Searching for "+regexp+"...";
    searchWithinNode(document.body, regexp);
    window.status="Found "+count+" match"+(count==1?"":"es")+" for "+regexp+".";
}
//unsafeWindow.paint = paint;
window.wrappedJSObject.paint = paint;
a.style.cssText="position:fixed;top:10px;left:10px;border:1px solid royalblue;padding:5px;z-index:2000;font-family:Tahoma;font-size:10pt;";
a.innerHTML='<a onclick="paint()">find</a>';
document.body.appendChild(a);


mysum = function(){c=document.querySelectorAll('.quantity-to-ship');z=0;for(var b in c){try{z+=Number(c[b].firstChild.value);}catch(e){}}return z;};
window.wrappedJSObject.mysum = mysum;