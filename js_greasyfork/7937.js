// ==UserScript==
// @name	zhongce
// @author	辞友缘心
// @version	1.0.0
// @description	众测按键en
// @include		http://test.baidu.com/crowdtesteva/eva/doEva/eva_id/*
// @include   http://test.baidu.com/crowdtest/eva/doEva/eva_id/*
// @namespace https://greasyfork.org/users/8939
// @downloadURL https://update.greasyfork.org/scripts/7937/zhongce.user.js
// @updateURL https://update.greasyfork.org/scripts/7937/zhongce.meta.js
// ==/UserScript==
function addButton(test,width,height,left,top,fontsize,callback){
	bt = document.createElement("div");

	if(top == true){
		bt.setAttribute("style", "position:fixed;top:0;left:"+left+";width:"+width+";height:"+height+";background:black;opacity:0.4;z-index:9999;text-align:center;line-height:100%;");
	}else{
		bt.setAttribute("style", "position:fixed;bottom:0;left:"+left+";width:"+width+";height:"+height+";background:black;opacity:0.4;z-index:9999;text-align:center;line-height:100%;");
	}
	sp = document.createElement("span");
	sp.setAttribute("style","line-height:"+height+";color:red;font-size:"+fontsize+";");
	sp.innerHTML = test;
	bt.appendChild(sp);
	bt.onclick = callback;
	document.body.appendChild(bt);

}
window.onload=function(){
	addButton("第1项","15%","80px","0",false,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[0].click();
		document.getElementById("next_eva").click();
	});
	addButton("第2项","15%","80px","20%",false,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[1].click();
		document.getElementById("next_eva").click();
	});
	addButton("第3项","15%","80px","40%",false,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[2].click();
		document.getElementById("next_eva").click();
	});
	addButton("第4项","15%","80px","60%",false,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[3].click();
		document.getElementById("next_eva").click();
	});
	addButton("第5项","15%","80px","0",true,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[4].click();
		document.getElementById("next_eva").click();
	});
	addButton("第6项","15%","80px","20%",true,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[5].click();
		document.getElementById("next_eva").click();
	});
	addButton("第7项","15%","80px","40%",true,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[6].click();
		document.getElementById("next_eva").click();
	});
	addButton("第8项","15%","80px","60%",true,"25px",function(){
		window.onbeforeunload='javascript:return true;';
		document.getElementById("eva_form").getElementsByTagName("label")[7].click();
		document.getElementById("next_eva").click();
	});
		addButton("跳过","15%","80px","85%",false,"25px",function(){
		location.href=location.href;
	});
} 
