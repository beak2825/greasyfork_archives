// ==UserScript==
// @name       我跟你讲，紫荆的种子，赞！
// @namespace  https://greasyfork.org/zh-CN/users/5433-hsinchu
// @version    2.1
// @description  紫荆点赞党们，来战个痛
// @include        http://www.zijingbt.org/*
// @include        http://zijingbt.njuftp.org/
// @include        http://zijingbt.njuftp.org/index.html
// @copyright  2012+, Hsinchu
// @downloadURL https://update.greasyfork.org/scripts/8795/%E6%88%91%E8%B7%9F%E4%BD%A0%E8%AE%B2%EF%BC%8C%E7%B4%AB%E8%8D%86%E7%9A%84%E7%A7%8D%E5%AD%90%EF%BC%8C%E8%B5%9E%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/8795/%E6%88%91%E8%B7%9F%E4%BD%A0%E8%AE%B2%EF%BC%8C%E7%B4%AB%E8%8D%86%E7%9A%84%E7%A7%8D%E5%AD%90%EF%BC%8C%E8%B5%9E%EF%BC%81.meta.js
// ==/UserScript==

var thxing = false;
var started_id,ended_id,torrentid,keeping_thx;
var td_tool=document.getElementById("tdTool");
var start,state;

function thank_one(){
    if(thxing){
        return;          //如果前一个赞没有完成不会进行新的赞
    }
    thxing = true;
	state.innerText="正在赞"+torrentid+"号";
	showToolLeft('tdTool','tdToolTrigger');
    var query = "/query.html?type=thanks&action=do&id="+torrentid;
    xmlhttp.open("GET",query,false);
    xmlhttp.send();
    if(xmlhttp.status!=200){
        console.log("error:"+torrentid);
    }
    torrentid++;
    thxing = false;
    if(torrentid>ended_id){
        clearInterval(keeping_thx);
        alert("从"+started_id+"到"+ended_id+"的种子已经赞完了。");
        location.href = "http://zijingbt.njuftp.org/index.html";           //赞完之后刷新回到主页面。
    }
}

function start_thx (){
    showToolLeft('tdTool','tdToolTrigger');
	started_id = prompt("请在下面输入开始的种子id",2162);
    showToolLeft('tdTool','tdToolTrigger');
    ended_id = prompt("请在下面输入结束的种子id",2162);
    started_id++;started_id--;ended_id++;ended_id--;   //如果没有这一行下面判断大小有可能出错，原理应该是这样处理了一下变量类型，但又似乎不是，因为从我测试来看出错的几率较小。
	showToolLeft('tdTool','tdToolTrigger');
	if(started_id<=ended_id){
        state=document.createElement("a");
		state.setAttribute("class","top_menu");
        td_tool.removeChild(start);
        td_tool.appendChild(state);
        torrentid = started_id;
		keeping_thx = setInterval(thank_one,50);
	}
    
    
}

start=document.createElement("a");
start.setAttribute("class","top_menu");
start.setAttribute("href","#");
start.innerText="我可要开始赞了";
start.onclick=start_thx;

td_tool.appendChild(start);               //点赞功能的启动键被我放在工具图标的附属菜单最底部。