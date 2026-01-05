// ==UserScript==
// @name        dA_clear_watchlist
// @namespace   dA_clear_watchlist
// @include     http://*.deviantart.com/modals/watchers/*
// @include     https://www.deviantart.com/settings/general*
// @require    	http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version     1
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @description experimental userscript: checks user that watch you how long they have been inactive. was dismissed in this state. originally planned: temp. block users that were offline too long so they "unwatch" you.
// @downloadURL https://update.greasyfork.org/scripts/5807/dA_clear_watchlist.user.js
// @updateURL https://update.greasyfork.org/scripts/5807/dA_clear_watchlist.meta.js
// ==/UserScript==

var helpicon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QADgCSAK6JiudvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QUMFBk32NCSIgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACWUlEQVQ4y52T30tTYRjHP0e2CxsrWDXr5M7KmSg5sxgDCwLNRR3wRq%2B92H3Xg%2F6CoH%2FCC6%2B1dHAoNnYhRSVLwR85Vmaeo9OlIbkEkWBd5Pv6nrUR9sCB877P83x4vt%2F3fTWU8CeMqrquZGztNHkAj1qcHBmVCaewRpbXVdGk5vfK3%2Fm5t%2B%2FKi3AVzy7kKe9%2B42ZnFG3%2FF%2BWvWywerAIgYG8%2BvKOw%2FJEH8X6ZV6FNApbOWcR7YgwNmBh6iMKXIgBRX0TCnmem8Xo9tJwPApBfmiPqi7isaBI%2FQwMmAOmcBUBnWwcrqwUpZeLVC4KBIM7WhtyLdd9W1d53Ae2SA8DgnX4AXs5k6Yp0yuorQZ3Do0OutV498Xl7o%2FZMToCGHiKds1gsLgPw8N6gq6G0s4UevEy7EeFurA%2BA0KXWxsB0zmJowCTeEwPg7fysq%2BFHZZ%2BwbnDW7wegvLtDfmmuMVB4aJcc0jmLvltxl4fJkVHONDez%2FGkFgJYLF2s9dANnF%2FJSuoCrHgKMTYxz43oXM%2B%2FbmCv2snn0iIYXW0gVd7FX78LZ3pCy7ZJDwPuYqWk4GDYlYHMSAl6okHID7ZKDoYck2CmsuTycz3dLUDLRfjI1f%2FbCkF23UppHPeWxiXHX%2BFFf5C9JyUQ7Y5nPDdce1R%2F1LYu9qC%2FC1PQ5OZ3arMbBsEkYqpp4NpWM%2FaReoT9hPA14H7t8azSdb9LCc%2FywO4BQPWAlYw8GTLL%2FgtVKLh5%2FdWPdSmlhqNabUp1u3UppTfxnNPJSOw0kbD6rigMQkn2TllRxamAtWAWJ%2BA2r3AJr3QFa6gAAAABJRU5ErkJggg%3D%3D";

//start: insertElems() -> scan() -> sorting() -> display()

var act = []; //list of users [0] and text of last visit [1]
var actO=[],actI=[]; //online/invisible , user-index [0] and a 0 [1]
var actM=[],actH=[],actD=[],actW=[]; //Minute, Hour, Day, Week, user-index [0] and number of M/H/D/W [1]

function scan(offset,end){
	var zwiact=[];
	$('a.u').slice(offset, end).each(function () {
		var usn = $(this).html();
		
		data=GM_xmlhttpRequest({     
			method: "GET",
			url:$(this).attr("href"),
			// synchronous: true
			onload:function(data){
				zwiact.push([usn, $(data.responseText).find('#super-secret-activity div.pbox strong').html()]);
				$("#dAcw_progress").html(zwiact.length +"/"+(parseInt(end)-parseInt(offset)));
				if(zwiact.length==end-offset)sorting(parseInt(act.length),zwiact);
			},
			onerror:function(data){
				 var msg = "An error occurred."
					+ "\nresponseText: " + res.responseText
					+ "\nreadyState: " + res.readyState
					+ "\nresponseHeaders: " + res.responseHeaders
					+ "\nstatus: " + res.status
					+ "\nstatusText: " + res.statusText
					+ "\nfinalUrl: " + res.finalUrl;
				alert(msg);
			}
		}).responseText;          
		// act.push([usn, $(data).find('#super-secret-activity div.pbox strong').html()]);
	});
}
function sorting(offset,zwiact){
	$("#dAcw_overlay").remove();
	for(var i=0;i<zwiact.length;i++){
		if(zwiact[i][1].indexOf("Last Visit:")!=-1)zwiact[i][1]=zwiact[i][1].substr(zwiact[i][1].indexOf("Last Visit:")+"Last Visit: ".length);
		if(zwiact[i][1].indexOf("Unknown")!=-1)actI.push([i+offset,0]);else
		if(zwiact[i][1].indexOf("Online")!=-1)actO.push([i+offset,0]);else
		if(zwiact[i][1].indexOf("minute")!=-1)actM.push([i+offset,parseInt(zwiact[i][1])]);else
		if(zwiact[i][1].indexOf("hour")!=-1)actH.push([i+offset,parseInt(zwiact[i][1])]);else
		if(zwiact[i][1].indexOf("day")!=-1)actD.push([i+offset,parseInt(zwiact[i][1])]);else
		if(zwiact[i][1].indexOf("week")!=-1)actW.push([i+offset,parseInt(zwiact[i][1])]);
	}
	act=act.concat(zwiact);
	function arrsort(a, b){
	  return a[1]>b[1];
	}
	console.log(act);
	actO=$(actO).each(function(){act[$(this)[0]][1]="Online";});
	actI=$(actI).each(function(){console.log($(this)[0]);act[$(this)[0]][1]="Invisible";});
	actM=actM.sort(arrsort);
	actH=actH.sort(arrsort);
	actD=actD.sort(arrsort);
	actW=actW.sort(arrsort);
	
	display();
}
function parseact(gact, appd){
	$(gact).each(function(){
		appd.append("<tr class='dAcw_row'><td><input type='checkbox'/></td><td>"+act[$(this)[0]][0]+"</td><td>"+act[$(this)[0]][1]+"</td></tr>");
		// console.log($(this),$(this)[0]);
	});
}
function display(){
	$("#dAcw_table tbody tr").slice(1).remove();
	
	var apdiv=$("#dAcw_table tbody");
	parseact(actI,apdiv); //invisible
	parseact(actO,apdiv); //online
	parseact(actM,apdiv);
	parseact(actH,apdiv);
	parseact(actD,apdiv);
	parseact(actW,apdiv);
	
	$("#dAcw_remove.disabled").removeClass("disabled");
	$("#dAcw_min").val(parseInt($("#dAcw_min").val())+10);
	$("#dAcw_max").val(parseInt($("#dAcw_max").val())+10);
	
}
function startScan(){

	 act=[];actO=[];actI=[];actM=[];actH=[];actD=[];actW=[];

	var cont=$("<div id='dAcw_overlay'>");
	cont.html("<div id='dAcw_closeP'>x</div><div>Progress</div><div id='dAcw_progress'>0/"+(parseInt($("#dAcw_max").val())-parseInt($("#dAcw_min").val()))+"</div>");

	$("body").append(cont);
	$("#dAcw_closeP").click(function(){$("#dAcw_overlay").remove();});
	scan($("#dAcw_min").val(),$("#dAcw_max").val());	
}
function showHelp(){
	var cont=$("<div id='dAcw_overlayH'>");
	cont.html("<div id='dAcw_closeP'>x</div><div>Press 'Scan Range!' to check people on this page for their last activity on dA. Which people are checked is specified via 'from' and 'to'. From 0 to 10 will check the first 10 People listed on this page.<br/>If you want to force someone listed to 'unwatch' you, check his row and press 'Remove checked!'. This will block this person for a short time and then unblock him again. The person then will no longer watch you. You won't be able to block him again within 2 days.<br/>Try not to scan more than 20 People at a time, otherwise you might get identified as bot and be unable to access dA for a 1-2 Minutes.</div>");

	$("body").append(cont);
	$("#dAcw_closeP").click(function(){$("#dAcw_overlayH").remove();});
}
function insertMenu(){
	// button and menu
	var men=$("<div id='dAcw_menu'>");
	men.html(""+
		"<div id='dAcw_title'>dA_Clear_Watchlist</div>"+
		"<span id='dAcw_close'>x</span><img id='dAcw_help' src='"+helpicon+"' title='manual' alt='manual'/>"+
		"<div>from: <input type='number' min='0' max='99' value='0' id='dAcw_min'/> to: <input type='number' min='1' max='100' value='10' id='dAcw_max'/></div>"+
		"<div id='dAcw_start'>Scan Range!</div>"+
		"<table id='dAcw_table'><thead><tr><th></th><th>name</th><th>last visit</th></tr></thead><tbody></tbody></table>"+
		"<div id='dAcw_remove' class='disabled'>Remove checked!</div>"+
	"");
	$("body").append(men);
	$("#dAcw_start").click(startScan);
	$("#dAcw_remove").click(injectblockpage);
	$("#dAcw_help").click(showHelp);
	$("#dAcw_close").click(function(){$("#dAcw_menu").remove();});
	$("#dAcw_min").change(function(){if(parseInt($(this).val())>=parseInt($("#dAcw_max").val()))$("#dAcw_max").val(parseInt($(this).val())+1);});
	$("#dAcw_max").change(function(){if(parseInt($(this).val())<=parseInt($("#dAcw_min").val()))$("#dAcw_min").val(parseInt($(this).val())-1);});
	
	
	var sty=$("<style>");
	sty.html(""+
	"#dAcw_overlay{position:fixed;width:200px;height:100px;top:50%;left:50%;margin-top:-50px;margin-left:-100px;background-color:#D7DFD3;border-radius:10px;border:2px ridge #A6B79D}"+
	"#dAcw_overlayH{position:fixed;width:280px;height:250px;top:50%;left:50%;margin-top:-125px;margin-left:-140px;background-color:#D7DFD3;border-radius:10px;border:2px ridge #A6B79D;overflow:auto;text-align:justify;padding:10px;}"+
	"#dAcw_overlay div{text-align:center;height:50px;line-height:50px;color:#000;font-size:30px;}"+
	"#dAcw_menu { background-color: #d7dfd3; border: 2px ridge #A6B79D; border-radius: 10px; height: 330px; left: 50%; margin-left: -150px; margin-top: -165px; padding: 10px; position: fixed; top: 50%; width: 300px; }"+
	"#dAcw_menu>div{width:300px;clear:both;}#dAcw_menu>img{float:right;width:20px;}"+
	"#dAcw_menu input{width:100px;}"+
	"#dAcw_start,#dAcw_remove{line-height:20px;cursor:pointer;background-color:#c7dfc3;border-radius:5px;border:2px ridge #A6B79D;height:20px;width:200px!important;text-align:center;margin:auto;}"+
	"#dAcw_start:hover,#dAcw_remove:hover{background-color:#D7DFD3;}"+
	"div.disabled{background-color:#ccc!important;cursor:default!important;}"+
	"#dAcw_table tbody{width:300px;height:200px;overflow:auto;display:block;}"+
	"#dAcw_table tr td{display:inline-block;}"+
	"#dAcw_table tr {display:block;}"+
	"#dAcw_table tr td:nth-of-type(1),#dAcw_table tr th:nth-of-type(1), #dAcw_table input{width:20px;}"+
	"#dAcw_table tr td:nth-of-type(2),#dAcw_table tr th:nth-of-type(2){width:140px;}"+
	"#dAcw_table tr td:nth-of-type(3),#dAcw_table tr th:nth-of-type(3){width:100px;}"+
	"#dAcw_table thead{width:300px;height:20px;overflow:auto;display:block;}"+
	"#dAcw_title {float: left;font-size: 16pt;font-weight: bold;width: 200px !important;}"+
	"#dAcw_menu > * {margin-bottom: 5px;}"+
	"#dAcw_closeP,#dAcw_close { border: 2px ridge #a6b79d; border-radius: 5px; float: right; height: 15px; line-height: 15px; margin: 5px; text-align: center; width: 15px; cursor:pointer;background-color:#c7dfc3}"+
	"#dAcw_help{cursor:pointer;}"+
	"");
	$("head").append(sty);
	
	
}
function insertButton(){
	var but=$("<div style='border: 2px ridge #a6b79d; border-radius: 5px; float: right; height: 15px; line-height: 15px; margin-top: -15px; text-align: center; width: 100px; cursor:pointer;background-color:#c7dfc3'>Clean List</div>");
	but.click(insertMenu);
	$("body").append(but);
}
function injectblockpage(){
	if($(this).hasClass("disabled"))return;
	var forceunwatch=[];
	$("#dAcw_table tr.dAcw_row").each(function(){
		if($(this).find("input").prop('checked'))forceunwatch.push($(this).find("td").eq(1).html());
	});
	if(!confirm("Warning!\n\n"+forceunwatch.join(", ")+"\n will be removed from your watchers. Continue?"))return;
	// console.log(forceunwatch);
	// return;
	$('<iframe>').attr('src',
		'https://www.deviantart.com/settings/general?blockuser='+forceunwatch.join("_")).css({'display': 'none', 'height': 0, 'width': 0}).appendTo('body');
}
function automation(){
	
	var blockfield=$("#blockedusers");
	if(blockfield.length==0){insertButton();return};
	var blockuser=[];
	if(typeof GM_getValue("blockuser")!="undefined" && GM_getValue("blockuser")!=""){
		blockuser=GM_getValue("blockuser").split("_");
		for(var i=0;i<blockuser.length;i++)
			blockfield.val(blockfield.val().replace(blockuser[i],"").replace("\n\n","\n"));
		GM_deleteValue("blockuser");
	}else if(location.href.indexOf("blockuser")!=-1){
		blockuser=location.href.substr(location.href.indexOf("blockuser")+"blockuser".length+1).split("_");
		blockfield.val(blockfield.val()+"\n"+blockuser.join("\n"));	
		GM_setValue("blockuser",blockuser.join("_"));
	}else return;
	
	blockfield.parents("form").submit();
}
automation();