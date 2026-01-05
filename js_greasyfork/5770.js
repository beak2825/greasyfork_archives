// ==UserScript==
// @name       dev_broken_thumbs
// @namespace  dev_broken_thumbs
// @version    1.01
// @description  remove broken thumb-code within your custom-boxes on deviantart.
// @include    http://*.deviantart.com/
// @include    http://*.deviantart.com/journal/*
// @author      Dediggefedde
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/5770/dev_broken_thumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/5770/dev_broken_thumbs.meta.js
// ==/UserScript==

(function(){
var thumblist=new Array();
var corr_list=new Array();
var dellist=new Array();
var storlist=new Array();
var eingabenaktiv;
var aktivbox;
var uberset;
var journal=false;
var temp_thumblist=GM_getValue("thumblist");
var temp_corrlist=GM_getValue("corrlist");

function start(){
	if(document.getElementById("journal-entry-form")!=null){
		if(temp_thumblist!=null)temp_thumblist=JSON.parse(temp_thumblist);
		if(temp_corrlist!=null)temp_corrlist=JSON.parse(temp_corrlist);
		if(temp_thumblist.length==0)return;
		thumblist=temp_thumblist;
		corr_list=temp_corrlist;
		GM_deleteValue("thumblist");
		GM_deleteValue("corrlist");
		journal=true;
		showbox();
	}else if(location.href.indexOf("/journal/")!=-1){ //remove thumbs in journal: addition to script
		journal=true;
		var editbut=document.getElementsByClassName("edit-button");
		if(editbut.length==0)return;
		editbut[0].setAttribute("onclick","return false");
		editbut[0].addEventListener("click",analyse);
	}else{
		var customcont = document.getElementsByClassName("gr-box");
		var customedit;
		for(var i=0;i<customcont.length;i++){
			customedit=customcont[i].parentNode.getElementsByClassName("gmbutton2chaos")[0];
			if(typeof customedit =="undefined"||customedit.getAttribute("dev_broken_thumbs"))continue;
			customedit.setAttribute("dev_broken_thumbs","true");
			customedit.addEventListener("click",analyse);
		}
	}
}
function analyse(){
    var rex=/(:thumb\d+:)|(class="instorage)|(a class="thumb)/g;
	corr_list=new Array();
	
    if(!journal){
		aktivbox=this.parentNode.parentNode.parentNode;
		
		if(aktivbox.getElementsByClassName("grf-mirror").length>0)
			thumblist=aktivbox.getElementsByClassName("grf-mirror")[0].innerHTML.match(rex);
		else if(document.getElementById("aboutme-info") != null)
			thumblist=document.getElementById("aboutme-info").innerHTML.match(rex);
		else
			return;
	}else{
		// if(document.getElementsByClassName("journaltext").length==0){setTimeout(analyse,1000);return;}
		thumblist=document.getElementsByClassName("journaltext")[0].innerHTML.match(rex);
	}
    if(!thumblist)return;
    for(var i=0;i<thumblist.length;i++){
        switch(thumblist[i]){
            case "class=\"instorage":corr_list.push(new Array(i,0));break; 
            case "a class=\"thumb":break; 
            default: corr_list.push(new Array(i,1));break; 
        }
    }
    if(!journal){
		detektbutton();
		eingabenaktiv=setInterval(detektbutton,1000);
	}else{
		// showbox();
		//page change when journal-edit is clicked. solution: temporary store thumblist and corr_list and use showbox on load when there is stored data
		GM_setValue("thumblist",JSON.stringify(thumblist));
		GM_setValue("corrlist",JSON.stringify(corr_list));
		location.href=this.getAttribute("href");
	}
}
function detektbutton(){
    if(document.getElementsByClassName("blockmenu").length==0){clearInterval(eingabenaktiv);return;}
	document.getElementsByClassName("blockmenu")[0].getElementsByClassName("edit_link")[0].addEventListener("click",showbox);  
}
function showbox(){
    if(corr_list.length==0)return;
	if(!journal){
		if(typeof aktivbox.getElementsByTagName("textarea")[0]=="undefined"){setTimeout(showbox,1000);return;}
		uberset=aktivbox.getElementsByTagName("textarea")[0].innerHTML.match(/(:thumb\d+:)|(class="instorage)/g);
	}else{
		if(document.getElementById("journal-entry-form")==null||document.getElementById("journal-entry-form").getElementsByClassName("writer").length==0){setTimeout(showbox,1000);return;}
		uberset=document.getElementById("journal-entry-form").getElementsByClassName("writer")[0].innerHTML.match(/(:thumb\d+:)|(class="instorage)/g);
	}
    dellist=new Array();
    storlist=new Array();    
    for(var i=0;i<corr_list.length;i++){
        if(corr_list[i][1]==0)storlist.push(uberset[corr_list[i][0]]);
        else dellist.push(uberset[corr_list[i][0]]);;
    }
    
    var nbox=document.createElement("div");
    nbox.id="dev_broken_thumb_alert";
    nbox.setAttribute("class","loading modal modal-rounded");
    nbox.setAttribute("style","display:block;z-index:999999;top: 60%; left: 60%; width: 400px; height: 400px; margin-left: -339px; margin-top: -298px; position: fixed; box-shadow: rgba(0, 0, 0, 0.496094) 0px 1px 4px, rgb(255, 255, 255) 0px 1px 1px inset; ");
    nbox.innerHTML="<a href='' onclick='document.body.removeChild(document.getElementById(\"dev_broken_thumb_alert\"));return false;' class='x'></a>"+
        "<div class='fakedeepee-box'>"+
        "<div class='deepee-title'><strong>Corrupted thumbnails detected!</strong></div>"+
        "<span style='font-weight:bold;'><input type='checkbox' checked='checked' name='rem_del_thumb' id='rem_del_thumb'/><label for='rem_del_thumb'>Remove "+dellist.length+" deleted thumbs</label><br/>"+
        "<ul style='height: 100px;overflow-y:scroll;'><li>"+dellist.join("</li><li>")+"</li></ul><br/>"+
        "<span style='font-weight:bold;'><input type='checkbox' checked='checked' name='rem_stor_thumb' id='rem_stor_thumb'/><label for='rem_stor_thumb'>Remove "+storlist.length+" thumbs in storage</label><br/>"+
        "<ul style='height: 100px;overflow-y:scroll;'><li>"+storlist.join("</li><li>")+"</li></ul><br/>"+
        "<div style='margin:0px auto;text-align:center;'>"+
        "<a href='' onclick='return false;' class='gmbutton2 gmbutton2s' style='margin-right:10px;width:100px;display:inline-block' id='dev_broken_thumb_execute'>Remove<b></b></a>"+
        "<a href='' onclick='document.body.removeChild(document.getElementById(\"dev_broken_thumb_alert\"));return false;' class='gmbutton2 gmbutton2c' style='width:100px;display:inline-block' id='dev_broken_thumb_execute'>Cancel<b></b></a>"+
        "</div>"+
        "</div>";
    document.body.appendChild(nbox);
    document.getElementById("dev_broken_thumb_execute").addEventListener("click",remover);
}
function remover(){
    var remstor=(document.getElementById("rem_stor_thumb").checked);
    var remdel=(document.getElementById("rem_del_thumb").checked);
	var tex;
	
	if(!journal)tex=aktivbox.getElementsByTagName("textarea")[0].innerHTML;
	else tex=document.getElementById("journal-entry-form").getElementsByClassName("writer")[0].innerHTML;

	for(var i=corr_list.length-1; i>=0;i--){
		if((corr_list[i][1]==0&&remstor)||(corr_list[i][1]==1&&remdel)){tex=tex.replace(uberset[corr_list[i][0]],"");}
	}
	if(!journal)aktivbox.getElementsByTagName("textarea")[0].innerHTML=tex;
	else document.getElementById("journal-entry-form").getElementsByClassName("writer")[0].innerHTML=tex;

	
    document.body.removeChild(document.getElementById("dev_broken_thumb_alert"));
}

window.onload=start;
// setInterval(start,1000);
})();