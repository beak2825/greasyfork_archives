// ==UserScript==
// @name	Roll
// @author	丧失A
// @version	0.0.4
// @description	匿名版ROLL点工具
// @match	*.nimingban.com/*
// @include	*.nimingban.com/*
// @require http://code.jquery.com/jquery-1.11.2.min.js
// @grant none
// @namespace https://greasyfork.org/users/8781
// @downloadURL https://update.greasyfork.org/scripts/7824/Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/7824/Roll.meta.js
// ==/UserScript==

function rnd(seed){
seed = ( seed * 9301 + 49297 ) % 233280;
return seed;
}
function roll(commentList){
    for(var i=0;i<commentList.length;i++){
        var ID=parseInt(commentList.parent().find(".h-threads-info").find(".h-threads-info-id")[i].innerHTML.substring(3));
        var Time=parseInt(commentList.parent().find(".h-threads-info").find(".h-threads-info-createdat")[i].innerHTML.slice(-2));
        var rollQuest=commentList[i].innerHTML.match(/roll\(\d+D\d+\)+/g);
            if(rollQuest!=null){
                for(var j=0;j<rollQuest.length;j++){
                    var rolltime = parseInt(rollQuest[j].substring(5,rollQuest[j].indexOf('D')));
                    var rollmax = parseInt(rollQuest[j].substring(rollQuest[j].indexOf('D')+1));
                    var rollresult = 0;
                        for(var p=0;p<rolltime;p++) rollresult+= (rnd(ID+Time*(p+1))%rollmax + 1);
                    commentList[i].innerHTML=commentList[i].innerHTML.replace(rollQuest[j],rollQuest[j]+"<font color='#FF3333'>="+rollresult+"</font>");
                }
            }
    
       }
}
roll($(".h-threads-content"));