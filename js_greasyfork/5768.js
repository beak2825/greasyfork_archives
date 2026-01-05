// ==UserScript==
// @name        dA_top_menu_links
// @namespace   dA_top_menu_links
// @description additional liks in the top-bar
// @match     http://*.deviantart.com/*
// @match     https://*.deviantart.com/*
// @require  	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @version     0.61
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/5768/dA_top_menu_links.user.js
// @updateURL https://update.greasyfork.org/scripts/5768/dA_top_menu_links.meta.js
// ==/UserScript==

var linkScheme="<a href='##1##' class='mi iconset-gruser' data-ga_click_event='{&quot;category&quot;:&quot;BetterBrowse&quot;,&quot;action&quot;:&quot;appbar_user_profile&quot;,&quot;nofollow&quot;:0}'><i class='i##3##'></i><span>##2##</span></a>";

//1:profile, 2:gallery, 3:shop, 4:Favourites ...
var plusimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAR2wAAEdsBLB24oQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIESURBVDiNnZS%2Fa1RBEMc%2FM7Pv0MhB8ET8QQpBaysLwUqwVcHCVDaCja2NtamtVOxFiGBjae8fYJUmhWJzFokSosbc252xePcu7%2FQumNtul5nPfOfHjkQEs871x%2F3np08u3Upm3r6pCNmLbn%2Ffe%2Fd%2BbefhLL80kwZUYoMHq5fP90%2F08AjCwSPY2d3nxeuPg3l%2Bc4FikHNQZ8c9xtAgZyeZznM7RGFS6lKoa8WDCTRnx0yODjSTfxS6Q12cahGFKRk5F0a1EhFTCqvDFN5eG7w0tVMCqAkCiEJxv%2BIe1LmMYRAeFA8cuXr%2F2cpbBAxAFWlibMm9p2eHN29cPOMBtEoAAXqVddKNsVL4PcqUEo19tMFg8%2FO3ryn1rPQqmxqNFjKqC9FpSAsVBFVwbwJLBCGQzEpKKn8VPmZCvBPsoKaNXYxt1YSkKtR1mRqN%2F4K09059TcfAUfZJlHmQ6ASbvE3dxwpFxHZ%2FjPAIiAYWEQRCUpmqqXsDyd3f04IDTMVSLr6%2Bsbk10Lb1Cori7tdWzvUvCNPQUoJfP%2BtPanwQbRxUQQUQ2ZZ52%2BbRq0vrg%2BVjd5E2XSbpFXjz5M7G6pF%2BSlUpuXjT8fFiaCegVy3y9UQ6tTqAEnB8qVoAWCn7dcHL9LiIsNhyMFPyXm7S7o6G6GLrq1IdLvd7XwgcAREQFDU0mQ3n%2Bf0Bhyn%2B7DYGIGsAAAAASUVORK5CYII%3D";
var delimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAS3gAAEt4BMgl5kwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANsSURBVDiNfVTfbxRVFP7Onbnzc4e2Cws1qDEQY9S2u9WY2CglLSD0AUwI4cVITDRGkfoPoKENEn3RB2OoT7744D9gFB4Q6cbEF8JS%2F4ZqqaE%2FoN2lc38cH3ZmmZ0QT3Izufd8891zvvPNgJlRXEcrwdzxOFh8FYjKuXydBKL3wsriB0FlrpwTKMRbSTj%2FWurNnntUmdgfBTdOEUUoxSmiaE8Y%2F1bX3sSwdS5cCJP5Yp6YGQAwE4eXx7V%2F%2FqgKq5oYy8LoX7327c12%2B8h15m0AOEcUyzC%2BOaq98YiFq8H4R5j724IXvulsft4jPJGEX7yS%2Bh9Pq7BqiKEBGDBWhNFN2bmz02lPA8BAGN98SXuNkIWb4zQYm2TXlMDCl52Nz2imElxppP5HUzqo5gADQFP3%2BS8Z05I7LYLAi9ptBEyOoX6cBpCC1wTwvSstHXvBysE0q0oXwWBUIJwx7TcMAA9wFD0ZZwmDkumY89Sg%2Fulvi5madfZ5IMqrVNS9XQEgQIAgFLrVqEK7igBLbEMWLZPKKWJmnCWq%2BGF0a0KFjYRJ5C1pAEVNy1UZAhhsYxYtlcrDl3h1qzfls0SVJIwXR7VXj1iInMBkxLmmunAOwCYs7g6kcvI8r2712aZLureyJ%2Bw0Dxg5JpmEKVWZV6UzsgErlgaUPJSTAYBbNGUNgGt7t%2FdVZUrtChBcUNn3j7%2BU96mWSL%2FTHGZ3jJiEygaSZsKnyPbU3W%2BTFctCj2lpmj9QLen7Uj6l3buEr5o1dkZcQJTbK2tXlCFisnXjLcUKh9%2Fh%2Bw9oFtVdrq%2BaVXZGnIzsfwfyhMknTPYNFf61T9tJ55Av%2FxxiZ5Tyyoh7PlPZC06Xjx8JFpqy84IfH5KlFWH2PgP%2FhHCJftkBbypwV5%2BSVg7DPG3dpYPWWwpZGJVp2tM4wx007oZrcU181dm4KASuWmBdgZEiBzNchn7Wypav3ElHickR491NWOgujnu415W%2F9rIOFs6Y1Ys9H17xhy6n4E%2FWhR3SYARM%2Bjkr7wwpOfUur2wDwI80HBvX3PrD7dSXHeNqMN5UwdqI9q6eNquPf195fO0PzW%2BBZ9eFTZ438rZUwfSHvNwu%2Buxn2h9tOer3a157%2FIBxH9S1%2F93b5t6lPtsU41u5e84hHJEqOF4mK5IqR19nxo3T5t5cMfcf2%2F8%2BXPr5xm0AAAAASUVORK5CYII%3D";
var upimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAANXAAADVwB7ig%2B4wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIvSURBVDiNjdI9UxNBGAfw%2F7P3kuQuOiCEg6BWgryon8DGUVKKNn4EP4RN2MbWj8FYEBjrII2thY0TCxxHRQljgLwdl%2BR2H4vEmLc72Gbv5nZ%2F9%2Fx3H2JmxA0pSdQ95y0BlC77L%2FJ51nHrKQ6UkkTVcwoP7rsbzEDpy0XR%2Bdl4HodGglKSaMw7hfV77sbiou1oDRwdtfzDr0HR%2FhaNTgSlJNFccHbW1t1cNms7WjO0BrQGyuW2%2F%2BN7q0iH9YnoGCglCT%2Fr7KyuubmF%2BUHs%2F1w5Df3fx%2B19Xao9G0WHQClJXCymCyurqQ3Ps5xRaHCuniv%2FtBLutz6fD6F9UEoSwc307vLd5BPPG44ZhTYbyq%2FV1Xv%2F0%2FnmP5SYuYe5e0vLqcfe3OSYUXMQsB%2B09EHt49nTfJ41bW1BBLfcd3eWUo%2FmMvExo76FIXzWfODVTzfN9u307tQ1I0cM6%2BSkA2bAdQ0YRnxcpRgqZDAAZjgkkKtMzxTMtsKbs6rarjUUAMAQlJ3NmK8ys9ZMHNgJuUKM1xD8yzS7BRBwPN4229dXbkyZH6amrZm4swOjYhE9fJn7Uxrcb442pg0A1I0UBxqCeouHxxgIGyAAKhwEx1EjMdGbVKENkEao4lvGBgGJq1SY6GZWo6BiaEb%2FmQAkrhI5YQNgQIXxDQ3q%2F%2F2SCtFd27nkUrrHc4UKbQAd6l0K96JOQKPEMdBKclNogm2ZRyCACDAIgCBQ750ISCWNpEloju7%2FC7GBED0wwi%2FRAAAAAElFTkSuQmCC";
var downimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAANOgAADToBAyIehQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJPSURBVDiNjdQ%2FTxRBGMfx7zOze3u3Bxycika00ljYKI0FURP%2FhMJCgYSC1tqKN3C5wk5Lw6sgZ4x2CDHR%2BKcx0TdgNBIkhzSyELmZx2JZWdi9wJNsdrPZ%2Bcxvn9kdUVXy9fBxfD6q6udGw%2B6IAQFEBAQkO4Ak8dXtRMefzSc%2F8uMDDpUaV79wseYmJhpj3iuq4D1k1%2BrBq%2FL1y9b66ndXPzy%2BAAIIgnNaCmVnEaBSHFsAs2d6vXLIe8i6VOKVJKwAAt6VQ1ni4yeM0qY7pzlwH0phBQzgjpFwr1KwCGVJxUAUHSNhVIkQgZ4rh7IJ%2BlV5QgHnyqH%2FryxQKevh%2FELthhUZw1osUAn0rBDiXLbK2avnJ1AMYLD3nnSaV7FgASw%2Fg3ocPBoYsNMnT4UhCgrEscW7csj79FOqxWY0COQpgKK4nu6qSMcE3%2F7M7Wz7l85p0hgOaAxZrIWeSxfmwNHbv6cK1qaLoypbgnm1%2BfH3nKgq7bYYc6mxOHo6nBwasnEhUdbDvU8oa4N6cKpbgix132%2FMtFrqJdsc2m0xlcuNxWYznIzrEh8FeVVQEpCl7oeN6VZLPYDkd5t2W0x8ZXhxcMBOViKJ%2B0HpUBIbyNL6u32sAGbo4Phwp1azd60lPgx5VYxIEobyeu3txlQeKwUzdOTayHNrzB1E4zxojSRhZJbXbncftDiIQfpDFqrVUr%2F5aXMKWFZPkq4sGCtJVDUr%2FbC%2BCfNJz1xvvvi7yy0UqnWzsnqze78fdiQI0EbMuTcnOiLC4K%2FuzOysFreYXP0DXyvXcr82O8gAAAAASUVORK5CYII%3D";

var menu=document.querySelector("#oh-menu-deviant ul.oh-menu-list");
var items=menu.querySelectorAll("li.oh-menu-list-item");
var username=document.querySelector("#oh-menu-deviant span.username-with-symbol span.username").innerHTML;

var iconlink="https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37";
var data=[];//[[title,url,img],[ " ],...];JSON.stringify

function addStyle(tex){
	var sty=document.getElementById("dA_top_menu_links_style");
	if(sty===null){
		sty=document.createElement("style");
		sty.id="dA_top_menu_links_style";
		sty.innerHTML=tex;
		document.head.appendChild(sty);
	}else{
		sty.innerHTML+="\n"+tex;
	}
}

async function loadSettings(){
	data=await GM.getValue("data","");
	if(data!="")data=JSON.parse(data);
	else
		data=[
			["Gallery","https://"+username+".deviantart.com/gallery/",2],
			["Favourites","https://"+username+".deviantart.com/favourites/",4],
			["","",0]
		];
}
function insertLinks(){
	for(var i=data.length-1;i>-1;i--){
		var d = document.createElement('li');
		d.className="oh-menu-list-item";
		if(data[i][0]=="")continue;
		if(data[i][0]=="<hr>")d.innerHTML="<hr>";
		else d.innerHTML =linkScheme.replace("##1##",data[i][1]).replace("##2##",data[i][0]).replace("##3##",data[i][2]);
		menu.insertBefore(d, items[1]);
	}
}

function imgoverClick(){
  var ind=this.getAttribute("rowID");
  var imgover=document.getElementById("dA_top_menu_links_imgover");
  if(imgover===null){
    imgover=document.createElement("div");
    imgover.id="dA_top_menu_links_imgover";
    var imgEl;
    for(var i=0;i<53;i++){
      imgEl=document.createElement("img");
      imgEl.setAttribute("img-id",i);
      imgEl.style="background-image:url('"+iconlink+"');background-position:"+(-40*i)+"px center;display:inline-block;width:24px;height:24px;";
      imgEl.addEventListener("click",function(){
        var imgover=document.getElementById("dA_top_menu_links_imgover");
  			var ind=imgover.getAttribute("rowid");
        imgover.style.display="none";
        var imgind=this.getAttribute("img-id");
        var aktselect=document.getElementById("dA_top_menu_links_settings").querySelector('select.topmenu_input[rowid="'+ind+'"]');
        
        aktselect.style.backgroundPosition=(-40*imgind)+"px center";
        aktselect.setAttribute("img-id",imgind);
      	imgover.setAttribute("rowid",-1);
      },false);
      imgover.appendChild(imgEl);
    }
    this.parentNode.parentNode.appendChild(imgover,this);
  }else{
    if( imgover.getAttribute("rowID")==ind){
      imgover.style.display="none";
      imgover.setAttribute("rowID",-1);
      return;
    }
  }
 	imgover.setAttribute("rowID",ind); 
  imgover.style="display:none;width:400px;height:120px;position:absolute;background-color:white;left:"+this.offsetLeft+"px;top:"+(this.offsetTop-120)+"px";
  imgover.style.display="block";
}
function addBrowsing(){
	//design: head: title, url, image. body: count+1 rows: textinput, textinput, dropdown icons
	//at each row: move up/down, remove, add new row. at end, header "controls" ?
	//no dA-code found => formatting using own CSS.
	var menulinks='<div class="fooview ch" id="dA_top_menu_links_settings">' +
        '<div class="fooview-inner">' +
        '<h3>Top Links</h3>' +
        '<div class="altaltview">' +
        '<div class="rowhead">' +
		'<span class="topmenu_header topmenu_title">Title</span>'+
		'<span class="topmenu_header topmenu_url">URL</span>'+
		'<span class="topmenu_header">Image</span>'+
		'<span class="topmenu_header topmenu_options">Options</span>'+
		'</div>';
	for(var i=0;i<data.length;i++){
        menulinks+='<div class="row">' +
        '<input type="text" class="itext_uplifted topmenu_input topmenu_title" value="'+data[i][0]+'"/>'+
		'<input type="text" class="itext_uplifted topmenu_input topmenu_url" value="'+data[i][1]+'"/>'+
		'<select class="topmenu_input itext_uplifted" rowID="'+i+'" img-id=0>'+
		// '<option class="topmenu_input"></option>'+
		'</select>'+
		'<a class="push" onclick="return false;"><img src="'+plusimg+'" alt="add link" title="add link" class="pop plus"/></a>' +
		'<a class="push" onclick="return false;"><img src="'+delimg+'" alt="add link" title="add link" class="pop del"/></a>' +
		'<a class="push" onclick="return false;"><img src="'+upimg+'" alt="add link" title="add link" class="pop up"/></a>' +
		'<a class="push" onclick="return false;"><img src="'+downimg+'" alt="add link" title="add link" class="pop down"/></a>' +
        '</div>';
	}
	menulinks+='<div class=" buttons ch hh " id="submit">' +
        '<div style="text-align:right" class="rr">' +
        '<a class="smbutton smbutton-green" href="javascript:void(0)"><span id="da_ignore_savesettings">Save</span></a>' +
        '</div></div></div></div></div>';
	addStyle(""+
		"#dA_top_menu_links_settings div.row input.topmenu_url{width:40%;}"+
		"#dA_top_menu_links_settings div.row input.topmenu_title{width:20%;}"+
		"#dA_top_menu_links_settings div.rowhead span.topmenu_url{width:43%;}"+
		"#dA_top_menu_links_settings div.rowhead span.topmenu_title{width:23%;}"+
		"#dA_top_menu_links_settings div.rowhead span.topmenu_options{width:23%;}"+
		"#dA_top_menu_links_settings div.rowhead span.topmenu_header{display: inline-block; font-weight: bold; text-align: center;}"+
		"#dA_top_menu_links_settings div.row select option.topmenu_input{background: url('"+iconlink+"') no-repeat left center;width:20px;height:20px;}"+
		"#dA_top_menu_links_settings div.row select.topmenu_input{cursor:pointer;height: 33px;width:40px;background: url('"+iconlink+"') no-repeat left center;}"+
		"#dA_top_menu_links_settings div.row img{display:inline-block;height:20px;margin:0 6px;vertical-align:middle;width:20px;cursor:pointer;}"+
		"@keyframes pop {50% {transform: scale(1.2); }100% {transform: scale(1);}}"+
		"#dA_top_menu_links_settings .pop {display: inline-block;transform: translateZ(0);box-shadow: 0 0 1px rgba(0, 0, 0, 0);}"+
		"#dA_top_menu_links_settings .pop:hover{animation-name: pop;animation-duration: 0.3s;animation-timing-function: linear;animation-iteration-count: 1;}"+
		" @keyframes push { 50% {  transform: scale(0.8); } 100% {transform: scale(1); } } "+
		 ".push { display: inline-block; transform: translateZ(0); box-shadow: 0 0 1px rgba(0, 0, 0, 0); } "+
		 ".push:active,.push:focus { animation-name: push;animation-duration: 0.2s;animation-timing-function: linear; animation-iteration-count: 1; }"+
	"");
  
	var settingsForm=document.querySelector("div.settings_form form");
	var d2 = document.createElement('div');
	d2.innerHTML =menulinks;
	settingsForm.appendChild(d2.firstChild, null);//insert at end
	
	var aktselect=document.querySelectorAll("#dA_top_menu_links_settings div.row select.topmenu_input");
	var el="";
  /*
	for(var i=0;i<53;i++){
		el+="<option style='background-position:"+"-"+(40*i)+"px center' class='topmenu_input'></option>";
	}
	el+="<option style='background-position:"+""+(40*i)+"px center' class='topmenu_input'></option>";
	for(var j=0;j<aktselect.length;j++){	
		aktselect[j].innerHTML=el;
		aktselect[j].selectedIndex=(data[j][2]-1);
		aktselect[j].style.backgroundPosition="-"+(40*(data[j][2]-1))+"px center";
		aktselect[j].addEventListener("change",function(e){
			e.target.style.backgroundPosition=e.target.options[e.target.selectedIndex].style.backgroundPosition	
		},false);
	}*/
  for(var j=0;j<aktselect.length;++j){
    aktselect[j].addEventListener("click",imgoverClick,false);
    aktselect[j].setAttribute("img-id",data[j][2]-1);
    aktselect[j].style.backgroundPosition=(-40*(data[j][2]-1))+"px center";
  }
  
	var imgbuts=document.querySelectorAll("#dA_top_menu_links_settings div.row img.plus");
	for(var j=0;j<imgbuts.length;j++){
		imgbuts[j].parentNode.parentNode.setAttribute("j",j);
		imgbuts[j].addEventListener("click",plusclick,false);
	}
	var imgbuts=document.querySelectorAll("#dA_top_menu_links_settings div.row img.del");
	for(var j=0;j<imgbuts.length;j++){	
		imgbuts[j].addEventListener("click",delclick,false);
	}
	var imgbuts=document.querySelectorAll("#dA_top_menu_links_settings div.row img.up");
	for(var j=0;j<imgbuts.length;j++){	
		imgbuts[j].addEventListener("click",upclick,false);
	}
	var imgbuts=document.querySelectorAll("#dA_top_menu_links_settings div.row img.down");
	for(var j=0;j<imgbuts.length;j++){	
		imgbuts[j].addEventListener("click",downclick,false);
	}
	
	document.getElementById("da_ignore_savesettings").addEventListener("click",function(){
		var rows=document.querySelectorAll("#dA_top_menu_links_settings div.row");
		data=[];
		for(var i=0;i<rows.length;i++){
			var titleUrl=rows[i].getElementsByTagName("input");
			var img=rows[i].getElementsByTagName("select");
      var imgid=(parseInt(img[0].getAttribute("img-id"))+1);
			data.push([titleUrl[0].value,titleUrl[1].value,imgid]);
		}
		if(data.length==0)data=[["","",1]];
		var prom2=GM.setValue("data",JSON.stringify(data));
    prom2.then(()=>{location.reload();});
	},false)
	
}
	//events 

function plusclick(e){
	var row=e.target.parentNode.parentNode;
	var clon=row.cloneNode(true); //img < a < div.row 
	
	var inp=clon.getElementsByTagName("input");
	inp[0].value=inp[1].value="";
	var sel=clon.getElementsByTagName("select")[0];
	sel.selectedIndex=0;
  sel.setAttribute("img-id",0);
	sel.backgroundPosition="0px center";
	var imgbuts=clon.getElementsByTagName("img");		
	imgbuts[0].addEventListener("click",plusclick,false);
	imgbuts[1].addEventListener("click",delclick,false);
	imgbuts[2].addEventListener("click",upclick,false);
	imgbuts[3].addEventListener("click",downclick,false);
	
	row.parentNode.insertBefore(clon,row.nextSibling);			

	var rows=document.querySelectorAll("#dA_top_menu_links_settings div.row");
  var j=0;
	for(j=0;j<rows.length;j++){
		rows[j].setAttribute("j",j);
	}
  sel.setAttribute("rowID",j-1);
  sel.addEventListener("click",imgoverClick,false);
}
function delclick(e){
	var imgbuts=document.querySelectorAll("#dA_top_menu_links_settings div.row img.plus");
	var row=e.target.parentNode.parentNode; //img < a < div.row 
	if(imgbuts.length==1){
		var inp=row.getElementsByTagName("input");
		inp[0].value=inp[1].value="";
		return;
	}
	row.parentNode.removeChild(row);
	var rows=document.querySelectorAll("#dA_top_menu_links_settings div.row");
	for(var j=0;j<rows.length;j++){
		rows[j].setAttribute("j",j);
	}
}
function upclick(e){
	var row=e.target.parentNode.parentNode; //img < a < div.row 
	if(row.getAttribute("j")==0)return;
	row.parentNode.insertBefore(row,row.previousSibling);
	var rows=document.querySelectorAll("#dA_top_menu_links_settings div.row");
	for(var j=0;j<rows.length;j++){
		rows[j].setAttribute("j",j);
	}
}
function downclick(e){
	if(row.getAttribute("j")==imgbuts.length-1)return;
	var row=e.target.parentNode.parentNode; //img < a < div.row 
	row.parentNode.insertBefore(row,row.nextSibling.nextSibling);
	var rows=document.querySelectorAll("#dA_top_menu_links_settings div.row");
	for(var j=0;j<rows.length;j++){
		rows[j].setAttribute("j",j);
	}
}

var prom=loadSettings();

prom.then(()=>{
	if (location.href.indexOf('https://www.deviantart.com/settings/browsing') == 0)addBrowsing();	
	insertLinks();
});

/*
GM_registerMenuCommand("dA_top_menu_links settings",function(){
	 window.open("https://www.deviantart.com/settings/browsing#dA_top_menu_links_settings");
},"");
*/