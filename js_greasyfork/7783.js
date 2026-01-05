// ==UserScript==
// @name       bbs网址标准化
// @description  www.tvboxnow.com（公仔箱）、www.city9x.com（城市风情）、141hongkong.com、www.hd1080.org网址标准化
// @include     http://www.tvboxnow.com/forum*
// @include     http://www.city9x.com/bbs/forumdisplay.php?fid=*
// @include     http://141hongkong.com/home.php?mod=*
// @include     http://141hongkong.com/forum-*
// @include     http://141hongkong.com/forum.php?mod=viewthread*
// @include     http://141hongkong.com/forum.php?mod=forumdisplay&fid=*
// @include     http://www.hd1080.org/forum.php?mod=forumdisplay&fid=*
// @include     http://youiv.top/u15-*
// @include     http://www.5xfile.com/*
// @include     http://ypan.cc/down2-*
// @include     http://www.72bbb.com/view-*
// @include     http://58ndd.com/forum.php?mod=forumdisplay&fid=*
// @include     http://vip.lepan.cc/file-*
// @include     http://www.lepan.cc/file-*
// @include     http://www.sx566.com/
// @include     http://www.97pan.com/file/*
// @include     http://go141.com/zh/weekly.php
// @include     http://mo.nightlife141.com/zh/weekly.php
// @include     http://www.youiv.top/forum.php?mod=forumdisplay*
// @include     http://www.cnxici8.com/thread*
// @include     http://bbs.dsqnw.net/forum.php?mod=*
// @include     http://cl.bearhk.info/thread0806.php?fid=21&search=&page=1
// @include     http://isangna.cc/forum.php*
// @include     http://go141.com/zh*
// @include     http://www.sex8.cc/*
// @include     http://www.guomoba.com/*
// @include     http://www.itokoo.com/thread-htm-*
// @include     http://bbs.btfq.com/forum.php?mod=forumdisplay&fid*
// @include     http://go141.com/zh/*.html
// @include     http://www.tvboxnow.com/thread-*
// @include     http://showgirl88.net/*
// @include    http://www.xunfile.com/f/*
// @include    http://www.163file.com/file-*
// @version     1.6
// @author      Youngcc
// @grant       none


// @namespace https://greasyfork.org/users/8717
// @downloadURL https://update.greasyfork.org/scripts/7783/bbs%E7%BD%91%E5%9D%80%E6%A0%87%E5%87%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/7783/bbs%E7%BD%91%E5%9D%80%E6%A0%87%E5%87%86%E5%8C%96.meta.js
// ==/UserScript==


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  加载成功显示图标
var af=document.createElement("link");
af.rel="stylesheet";
//af.href="//192.168.88.1/usb/usb/font-awesome.css";
af.href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
document.head.appendChild(af);
var tp=document.createElement("span");
tp.className="fa fa-chevron-circle-up fa-4x top";
tp.setAttribute("style","cursor: pointer; opacity:0; position: fixed; Left: 30px; bottom: 40px; transition: opacity 0.01s;z-index: 999999;color:#32CD32;");
document.body.appendChild(tp);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   加载成功显示图标


//~~~~~~~~~~ 判断初始化
var wz = location.href
var bt = document.title
var value = "";
var panduan = "";
//~~~~~~~~~~ 判断初始化

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~关闭没用
if (wz.indexOf("go141.com")!=-1) 
{
if (bt.indexOf("樓上骨")!=-1||bt.indexOf("一樓一")!=-1||bt.indexOf("中醫保健")!=-1||bt.indexOf("足浴保健")!=-1||bt.indexOf("水療SPA")!=-1|bt.indexOf("上門推拿")!=-1) 
{window.close()
}}

if (wz.indexOf("141hongkong.com/forum.php?mod=viewthread")!=-1 && bt.indexOf("提示信息")!=-1) 
{
pd =document.getElementById("messagetext").childNodes[1].innerHTML
if (pd.indexOf("囡囡正在休息中")!=-1) 
{
 window.close()
}
    }
if (wz.indexOf("fh77.net")!=-1) 
    {
        window.close()
  }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~关闭没用
// ~~~~~~~~

    
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~公仔箱+城市风情
    if (wz.indexOf("http://www.tvboxnow.com/forumdisplay.php")!=-1||wz.indexOf("www.tvboxnow.com/forum-")!=-1||wz.indexOf("city9x")!=-1 ) 
    { 
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("viewthread.php?tid=")!=-1  )  
        { value = _el[i].href;             
         var re = /viewthread.php\?tid\=([^\&]*)/i;
            var r = value.match(re);
            value = r[1];
_el[i].href= "viewthread.php?tid="+value
panduan = "1"
        }
        if (str.indexOf("thread-")!=-1  ) 
        { value = _el[i].href;             
         var re = /thread\-([^\-]*)/i;
            var r = value.match(re);
            value = r[1];
_el[i].href= "viewthread.php?tid="+value
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~公仔箱+城市风情
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~141
    if (wz.indexOf("141hongkong.com/forum-")!=-1||wz.indexOf("141hongkong.com/home.php")!=-1||wz.indexOf("141hongkong.com/forum.php?mod=forumdispla")!=-1) 
    {
         var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("viewthread&tid=")!=-1  )  
        { value = _el[i].href;             
         var re = /viewthread\&tid\=([^\&]*)/i;
            var r = value.match(re);
            value = r[1];
_el[i].href= "forum.php?mod=viewthread&tid="+value
panduan = "1"
        }
        if (str.indexOf("thread-")!=-1  ) 
        { value = _el[i].href;             
         var re = /thread\-([^\-]*)/i;
            var r = value.match(re);
            value = r[1];
_el[i].href= "forum.php?mod=viewthread&tid="+value
panduan = "1"
        }
    } 
        
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~141
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~141 2
    if (wz.indexOf("141hongkong.com/forum.php?mod=viewthread")!=-1) 
    {
         var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
    
        if  (str.indexOf("go141.com/zh/")!=-1 && str.indexOf("report=")!=-1 ) 
        { value = _el[i].href;             
_el[i].href= value.split("?report=",1)
panduan = "1"
        }
        
        if  (str.indexOf("go141.com/zh/")!=-1 && str.indexOf("ref=")!=-1 ) 
        { value = _el[i].href;             
_el[i].href= value.split("?ref=",1)
panduan = "1"
        }
        
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
        }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~141 2
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~hd1080 + isangna.cc 、你懂得
    if (wz.indexOf("hd1080")!=-1||wz.indexOf("isangna.cc/forum.php?")!=-1|wz.indexOf("58ndd.com")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("viewthread&tid=")!=-1  )  
        { value = _el[i].href;             
         var re = /viewthread\&tid\=([^\&]*)/i;
            var r = value.match(re);
            value = r[1];
_el[i].href= "forum.php?mod=viewthread&tid="+value
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~hd1080 + isangna.cc  、你懂得
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~youiv.top
    if (wz.indexOf("youiv.top/forum.php")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("forum.php?mod=viewthread&tid=")!=-1 ) 
        { value = _el[i].href;   
        value = value.substr(50, 6)
_el[i].href=  "forum.php?mod=viewthread&tid=" + value 
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~youiv.top
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~youiv.top 2
    if (wz.indexOf("youiv.top/u15-")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("thread-")!=-1 ) 
        { value = _el[i].href;             
         var re = /thread\-([^\-]*)/i;
            var r = value.match(re);
            value = r[1];
_el[i].href= "forum.php?mod=viewthread&tid=" + value
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~youiv.top 2   
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~性吧
    if (wz.indexOf("www.sex8.cc/thread")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("read-htm-tid")!=-1 ) 
        { value = _el[i].href;   
        value = value.substr(32, 7)
_el[i].href=  "read.php?tid=" + value 
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~性吧
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~性吧
    if (wz.indexOf("showgirl88.net/thread")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("read-htm-tid")!=-1 ) 
        { value = _el[i].href;   
        value = value.substr(35, 7)
_el[i].href=  "read.php?tid=" + value 
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~性吧
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~屌丝青年、东莞桑拿资讯论坛(http://isangna.org)   
    if (wz.indexOf("bbs.dsqnw.net/forum.php?mod")!=-1|wz.indexOf("isangna.org")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('a');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].href
        if (str.indexOf("forum.php?mod=viewthread&tid=")!=-1 ) 
        { value = _el[i].href;   
        value = value.substr(50, 5)
_el[i].href=  "forum.php?mod=viewthread&tid=" + value 
panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~屌丝青年、东莞桑拿资讯论坛(http://isangna.org)     
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~http://go141.com/图片放大化 
    if (wz.indexOf("go141.com/zh")!=-1) 
    {
    var el = [],
        _el = document.getElementsByTagName('img');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].src


        if (str.indexOf("/small/")!=-1 ) 
{ _el[i].src=str.replace(/small/g,"main");
 

panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~http://go141.com/图片放大化    
// ~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~guomoba、草榴、爱图客 网址去颜色
    if (wz.indexOf("www.guomoba.com")!=-1|wz.indexOf("bearhk.info")!=-1|wz.indexOf("itokoo.com")!=-1|wz.indexOf("bbs.btfq.com/")!=-1|wz.indexOf("141hongkong.com/forum.php?mod")!=-1|wz.indexOf("showgirl88.net/thread")!=-1|wz.indexOf("www.sex8.cc/thread")!=-1|wz.indexOf("141hongkong.com/forum.php?mod=")!=-1)
    {
        
    var el = [],
        _el = document.getElementsByTagName('font');
    for (var i=0; i<_el.length; i++ ) {
    var str = _el[i].color

        if ( _el[i].color ==  "#0000FF" |_el[i].color ==  "red"|_el[i].color ==  "blue"|_el[i].color ==  "green"|_el[i].color ==  "#FF00FF"|_el[i].color ==  "#FF0000"|_el[i].color ==  "#8F2A90"|_el[i].color ==  "#4B0082"|_el[i].color ==  "#EE1B2E"|_el[i].color ==  "#EC1282"|_el[i].color ==  "#FF1493"|_el[i].color ==  "#00FFFF") 
{ _el[i].color=  "" 
 

panduan = "1"
        }
    } 
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~guomoba、草榴、爱图客 网址去颜色
// ~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~更改go141.com标题
    if (wz.indexOf("go141.com")!=-1) 
    {
str=document.title; //这是一字符串
var strs= new Array(); //定义一数组
strs=str.split("-"); //字符分割     
str2=window.location.pathname; //这是一字符串
var strs2= new Array(); //定义一数组
strs2=str2.split("/"); //字符分割 
str3=strs2[2]; //这是一字符串
var strs3= new Array(); //定义一数组
strs3=str3.split("-"); //字符分割 
document.title =strs[strs.length-1] + " "+ strs3[0];    //分割后的字符输出


panduan = "1"
      
  
    if (panduan != ""  )  
        {    
document.querySelector("span.top").style.opacity=1; 
         }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~更改go141.com标题
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~网盘免等待
    if (wz.indexOf("www.xunfile.com/f/")!=-1|wz.indexOf("www.163file.com/file-")!=-1|wz.indexOf("www.97pan.com/file/")!=-1) 
    {javascript:var downpage_link = document.getElementById('downpage_link');window.location=downpage_link.href;void(0)}

    if (wz.indexOf("ypan.cc/down2-")!=-1) 
    {var btns = document.getElementsByTagName("a"); for (var n = 0; n < btns.length; n ++) { if (btns[n].className == "down_btn") {btns[n].click(); }  }  }

    if (wz.indexOf("vip.lepan.cc/file-")!=-1||wz.indexOf("www.lepan.cc/file-")!=-1||wz.indexOf("www.sx566.com/file-")!=-1) 
    {    lnk = document.getElementById("down_a1"); lnk.click(); }

    if (wz.indexOf("www.5xfile.com/file-")!=-1) 
    {    lnk = document.getElementById("come_down"); lnk.click(); }
    if (wz.indexOf("http://www.72bbb.com/view-")!=-1) 
    {    lnk = document.getElementById("hsdownload"); lnk.click(); }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~网盘免等待
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~141下一页
    if (wz.indexOf("mo.nightlife141.com/zh/weekly.php")!=-1||wz.indexOf("go141.com/zh/weekly.php")!=-1) 
    {loadpage();loadpage();loadpage();
    }
    if (wz.indexOf("go141.com/zh/weekly.php")!=-1) 
    {loadpage();loadpage();loadpage();loadpage();
     setTimeout(function(){ window.location.href='javascript:scroll(0,0)';},8000);
     setTimeout(function(){ window.location.href='javascript:scroll(0,850)';},9000);
     setTimeout(function(){ window.location.href='javascript:scroll(0,1700)';},9500);
     setTimeout(function(){ window.location.href='javascript:scroll(0,2550)';},10000);
     setTimeout(function(){ window.location.href='javascript:scroll(0,3400)';},10500);
     setTimeout(function(){ window.location.href='javascript:scroll(0,4250)';},11000);
     setTimeout(function(){ window.location.href='javascript:scroll(0,5100)';},11500);
     setTimeout(function(){ window.location.href='javascript:scroll(0,5950)';},13000);
     setTimeout(function(){ window.location.href='javascript:scroll(0,6800)';},13500);
     setTimeout(function(){ window.location.href='javascript:scroll(0,7650)';},14000);
     setTimeout(function(){ window.location.href='javascript:scroll(0,0)';},14500);
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~141下一页

    if (wz.indexOf("www.tvboxnow.com/thread")!=-1) 
    {
var para=document.getElementById("para").innerHTML;
para = para.replace(/[<]br[^>]*[>]/gi,"");
        }





window.onload = get
