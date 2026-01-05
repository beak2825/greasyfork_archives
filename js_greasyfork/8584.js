// ==UserScript==
// @name        sg_farmer
// @namespace   farmer.sgamer
// @description 打开http://bbs.sgamer.com/forum-44-2.html 自动回复,可在用户脚本命令里 +/- 伐木速度
// @include     http://bbs.sgamer.com/forum-44-2.html
// @version     1.0.3
// @grant       GM_addStyle
// @grant       GM_notification
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @license     GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @downloadURL https://update.greasyfork.org/scripts/8584/sg_farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/8584/sg_farmer.meta.js
// ==/UserScript==

GM_registerMenuCommand("增加伐木速度", fastSpeed);
GM_registerMenuCommand("减慢伐木速度", lowSpeed);

//var previewThread = unsafeWindow.previewThread;
var $ = (typeof unsafeWindow.$=='function')?unsafeWindow.$ : function (e){document.getElementById(e);};

var reply_duration = (GM_getValue('sg_re_dur')==undefined)? 35 : GM_getValue('sg_re_dur'); // 回复间隔(s)  大于20s 
var emotion = ['{:5_168:}','{:5_183:}','{:5_191:}','{:6_354:}','{:6_357:}'];

function fastSpeed(){
    if(reply_duration > 20){
        reply_duration -= 1;
        GM_setValue('sg_re_dur', reply_duration);
    }
}
function lowSpeed(){
    reply_duration += 1;
    GM_setValue('sg_re_dur', reply_duration);
}

function checkDate(tid){
    var tm;
    var td = $(tid).getElementsByTagName('tr')[0].getElementsByTagName('td');
    var tc = td[td.length -1].getElementsByTagName('span')[0];
    var ts = tc.getAttribute('title');
    var d = new Date();
    var tt = (d.getYear()+1900) +'-'+(d.getMonth()+1);
    console.log('ts='+ts+' tt='+tt+' '+ts.indexOf(tt));
    if(ts.indexOf(tt) == -1) //最后回复不是本月，坟贴
        return 1;
}

var previewTbody = null, previewTid = null, previewDiv = null;
function previewThread(tidd, tbody, mmsg) {
    if(!$('threadPreviewTR_'+tidd)) {
        newTr = document.createElement('tr');
        newTr.id = 'threadPreviewTR_'+tidd;
        //newTr.className = 'threadpre';
        $(tbody).appendChild(newTr);
        newTd = document.createElement('td');
        //newTd.colSpan = 5;
        //newTd.className = 'threadpretd';
        newTr.appendChild(newTd);
        newTr.style.display = 'none';

        previewTbody = tbody;
        previewTid = tidd;

        previewDiv = document.createElement('div');
        previewDiv.id = 'threadPreview_'+tidd;
        previewDiv.style.id = 'none';
        var reg=/<img.+?src=.+?onerror=.+?\/>/gim;
        mmsg = mmsg.replace(reg, '');
        previewDiv.innerHTML = mmsg;
        newTd.appendChild(previewDiv);
        newTr.style.display = 'none';
    }
    else{
        $(tbody).removeChild($('threadPreviewTR_'+tidd));
    }
}
var ii = 0;
function startAutoReply(){
    var tb = document.getElementById('threadlisttableid');
    if(typeof tb != 'object')
        window.location.reload();
    var tbl = tb.getElementsByTagName('tbody');
    var i;
    for(i=ii; i<tbl.length; i++){
        var tid = tbl[i].id;
        
        if( (tid==null) || (tid.indexOf('normalthread_')==-1)){
            continue;   
        }
        else{
            var tidd = tid.split("_")[1];
            console.log('i='+i+'/'+tbl.length+' tidd='+ tidd + " gmValue= "+GM_getValue(tidd));
            if(GM_getValue(tidd) == 1) //是否已经自动回复
                continue;
            if(checkDate(tid) == 1) //检测坟贴
                window.location.reload();
            ii = i + 1;                 
            //previewThread(tidd, tid);
            //unsafeWindow.ajaxget('forum.php?mod=viewthread&tid='+tid+'&from=preview', 'threadPreview_'+tid, null, null, null, function() {newTr.style.display = '';});
            //http://bbs.sgamer.com/forum.php?mod=viewthread&tid=12360286&from=preview&inajax=1&ajaxtarget=threadPreview_12360286
            var xhr =new XMLHttpRequest();
            xhr.open('GET','forum.php?mod=viewthread&tid='+tidd+'&from=preview&inajax=1&ajaxtarget=threadPreview_'+tidd,true);
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4){
　　                if(xhr.status==200){
　　　                  var msg = xhr.responseXML;
                        var mmsg = msg.getElementsByTagName('root')[0].textContent;
                        //alert(mmsg);
                        previewThread(tidd, tid, mmsg);
                        var t = unsafeWindow.document.getElementsByClassName('t_f');
                        var r = Math.ceil(Math.random()*t.length);
                        r = (r==t.length) ? r-1 : r;
                        var text = '';
                        if(r>0 && t[r]!=undefined){
                            var bq = t[r].getElementsByTagName('div');
                            if(bq.length>0)
                                t[r].removeChild(bq[0]);
                            var bp = t[r].getElementsByTagName('i');
                            if(bp.length>0)
                                t[r].removeChild(bp[0]);
                            text = t[r].innerText;
                        }
                        else{
                            var bi = t[0].getElementsByTagName('i');
                            if(bi.length>0)
                                t[0].removeChild(bi[0]);
                            text = t[0].innerText;
                        }
                        
                        if((undefined==text) || (text==' '))
                            text += "{:6_357:}{:6_357:}               ";
                        else if((text.length>0) && (text.length<15)){
                            if(Math.random() > 0.7)
                                text += emotion[Math.floor(Math.random()*emotion.length)];
                            text += '                 ';
                        }
                        else if(text.length>50)
                            text = text.substr(0, 20);
                        document.getElementById('vmessage_'+tidd).value = text;
                        document.getElementById('vreplysubmit_'+tidd).click();
                        GM_setValue(tidd, 1);
                        previewThread(tidd, tid, null);
                        ralert(tid, text);
                        setTimeout(startAutoReply, (reply_duration+Math.ceil(Math.random()*15))*1000);
                   }
                }
            }
            xhr.send(null);
            break;
            return;
        }
    }
    if(i >= tbl.length)
        window.location.reload();
}

function ralert(tid, text){
    if(!$('replyalert')){
        var a = document.createElement('div');
        a.id = 'replyalert';
        document.getElementsByTagName('body')[0].appendChild(a);
        GM_addStyle("#replyalert{top:0; right:0;position:fixed;width:180px; height:600px;overflow-y:auto;border:1px solid grey; background:rgba(130,255,0, 0.9);z-index:999;}");
        GM_addStyle(".replylist{width:100%; border-bottom:1px solid black;}");
    }
    var l=document.createElement('div');
    l.setAttribute('class', 'replylist');
    $('replyalert').appendChild(l);
    var t = $(tid);
    var ttt = t.getElementsByTagName('th')[0].getElementsByTagName('a')[3].innerText;
    console.log(ttt + "  "+text);
    l.innerHTML += '<p style="color:grey;">'+new Date().toLocaleTimeString()+'</p>' + ttt + '</br>' + text;
}
(function startReply(){
    var iff = document.getElementsByTagName('iframe')[0];
    if(iff)
        document.getElementById('ct').getElementsByClassName('mn')[0].removeChild(iff);
    // Database error, 502等
    var tb = document.getElementById('threadlisttableid');
    if(typeof tb != 'object')
        window.location.reload();
    
    unsafeWindow.appendscript(unsafeWindow.JSPATH + 'forum_viewthread.js?' + unsafeWindow.VERHASH);
    setTimeout(startAutoReply, reply_duration*1000);
    //var replyInterval = setInterval(startAutoReply, reply_duration*1000 + Math.floor(Math.random()*15));
})()
