// ==UserScript==
// @name           UnfollowHaterFixd
// @namespace      UFHFd
// @description    Shows who unfollowed you on Tumblr.
// @include        http://www.tumblr.com/blog/*
// @include        https://www.tumblr.com/blog/*
// @author         Original: Adrian Sanchez / Fix: rno
// @version        1.1.0
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @license        GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/5478/UnfollowHaterFixd.user.js
// @updateURL https://update.greasyfork.org/scripts/5478/UnfollowHaterFixd.meta.js
// ==/UserScript==

//***********************************************************************************      
//      This program is free software: you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation, either version 3 of the License, or
//      (at your option) any later version.
//
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//
//      You should have received a copy of the GNU General Public License
//      along with this program.  If not, see http://www.gnu.org/licenses/gpl-3.0.html
//***********************************************************************************

//--UTIL
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

function getElementsByClass(clase){
	return getElementsByClassInTag(clase,document);
}

function getElementsByClassInTag(clase, doc){
	var elementos = new Array();
	var a=0;
	var htmlTags = new Array();
	var htmlTags= doc.getElementsByTagName('*');
	for(var i=0; i<htmlTags.length; i++){
		if(htmlTags[i].className == clase){
			elementos[a] = htmlTags[i];
			a++;
		}
	}
	return elementos;
}

function borraElPrimero(array){
	if(array[0]=="")array.shift();
	return array;
}
//FIN UTIL
//*****
//*****
//---COOKIE
function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var object = {val: value, time: exdate.getTime()}
    GM_setValue(c_name, JSON.stringify(object));
}
function getCookie(c_name)
{
    var object = JSON.parse(GM_getValue(c_name));
    if(object != null){
		var dateString = object.time;
		var now = new Date().getTime();
		if (parseInt(dateString)>parseInt(now))
			return object.val;
	}
    return null;
}
//---FIN COOKIE
//*****
//--AJAX
function ajax(url, iddiv, listado, contador, paginasTotales, tumblelog, tipoAxa){
	GM_xmlhttpRequest({
	  method: "GET",
	  url: url,
	  onerror: function(response) {
		crearBotonError(response.status);
	  },
	  onload: function(response) {
		//console.log(url); // DEBUG
		if(tipoAxa=="axa1"){
			crearListadoDesdePagina(response, tumblelog, iddiv, listado, contador, paginasTotales);
			++_FollowerPagesLoaded;
			//console.log(_FollowerPagesLoaded + "\n" + _NrOfSimultaneousRequests + "\n")
			if (_FollowerPagesLoaded % _NrOfSimultaneousRequests == 0){
				loadNextFollowerPages(tumblelog, listado)
			}
		}else if(tipoAxa=="axa2"){
			obtenerCantidadSeguidores(response, tumblelog, listado);
		}
	  }
  });
}

function crearListadoDesdePagina (response, tumblelog, iddiv, listado, contador, paginasTotales){
	if(!error){
		var div = document.createElement("div");
		div.innerHTML = response.responseText;
		listado = alimentarLista(div,listado);
		i++;
		document.getElementById('pageCounter').innerHTML = i+"/"+paginasTotales;
		if (_CritError){
			crearBotonError("1000")
			return;
		}
		if(i==paginasTotales){
			i=0;
			setListas(tumblelog, listado);
			realizarComparacion(tumblelog);
			crearBoton();
			cerrarListado();
			if(virgen)
				window.location = document.URL;
		}
	}
	//console.log("crearListadoDesdePagina : done"); //DEBUG 
}

function obtenerCantidadSeguidores(response, tumblelog, listado){
		var tempDiv = document.createElement("div");
        
		tempDiv.innerHTML = response.responseText;
		var head = getElementsByClassInTag('title_and_controls',tempDiv)[0].getElementsByTagName("h1")[0].innerHTML;
        //console.log(head); //DEBUG
        head = head.replace(/\,/g,'');
		head = head.replace(/\./g,'');
		head = head.replace(/\ /g,'');
		head = head.match("[0-9]+");		
        
		crearLista(head, tumblelog, listado);
		cerrarListado();
		//console.log("obtenerCantidadSeguidores : done"); //DEBUG 
}

//---FIN AJAX
//************
function crearNotificador(unfollowers){
	if(unfollowers>0){
		var divNotif = document.createElement("div");
		divNotif.id='unfollow_notif';
		divNotif.setAttribute("style","left:25px; border: 2px solid #364650; border-radius: 4px; min-width: 21px; height: 21px;");
		divNotif.setAttribute("class","tab_notice tab-notice--outlined tab-notice--active");
		var notifValue = document.createElement("span");
		notifValue.setAttribute("class","tab_notice_value");
		notifValue.innerHTML = unfollowers;
		divNotif.appendChild(notifValue);
		var nipple = document.createElement("span");
		nipple.setAttribute("class","tab_notice_nipple");
		divNotif.appendChild(nipple);
		document.getElementById("unfollow_button").appendChild(divNotif);
	}
}

function crearEstilo(){
	//AGREGAR ESTILO
	//legacy
	var header = document.getElementsByTagName("head")[0];
	if (!header) { setTimeout(crearBoton,100); }
	
	//new
	var style = "#header #unfollow_button img {opacity: 0.5; width:24px; margin-top:8px; margin-left:10px;}";
	style += "\n#header #unfollow_button img:hover {opacity: 1;cursor:pointer;}";
	style += "#header #error_button img {opacity: 0.5; width:24px; margin-top:8px; margin-left:10px;}";
	style += "\n#header #error_button img:hover {opacity: 1;cursor:pointer;}";
	GM_addStyle(style);
}

function crearBoton(){
	//BOTON
	if(!icon){
		var newDiv = document.createElement("div");
		newDiv.id="unfollow_button";
		newDiv.setAttribute("class","tab iconic");
		newDiv.setAttribute("style","padding-top:5px");
		var unfButton = document.createElement("img");
		unfButton.setAttribute("src","http://media.tumblr.com/tumblr_ltol2vLsnl1qzkqhi.png");
		unfButton.setAttribute("style","width: 24px; height: 24px; opacity: 0.6; cursor: pointer; margin-right: -9px; margin-left: -9px;");
		unfButton.addEventListener("click", mostrarUnfollows, false);
		newDiv.appendChild(unfButton);
		
		document.getElementById('pageCounter').parentNode.style.display="none";
		document.getElementById('pageCounter').innerHTML="";
		var userTools = document.getElementById("user_tools");
		userTools.appendChild(newDiv); 
		if(GM_getValue(getTumblelog()+"_unfollowersList")!=null){
			var unfollowers = GM_getValue(getTumblelog()+"_unfollowersList").split("|||");
			unfollowers = borraElPrimero(unfollowers);
			crearNotificador(unfollowers.length);
		}
		icon=true;
	}
}

function crearBotonError(statusCode){
	error = true;
	try {
		document.getElementById('pageCounter').parentNode.style.display="none";
		document.getElementById('pageCounter').innerHTML="";
	} catch(e){}
	if(document.getElementById("error_button")==null){
		var errDiv = document.createElement("div");
		errDiv.id="error_button";
		errDiv.setAttribute("class","tab iconic");
		errDiv.setAttribute("style","padding-top:5px");
		var errButton = document.createElement("img");
		errButton.setAttribute("src","http://media.tumblr.com/tumblr_luxy5iWv8H1qzkqhi.png");
		errButton.setAttribute("style","width: 24px; height: 24px; opacity: 0.6; cursor: pointer; margin-right: -9px; margin-left: -9px;");
		errButton.addEventListener("click", function(event){mostrarError(statusCode);}, false);
		errDiv.appendChild(errButton);
		document.getElementById('pageCounter').innerHTML="";
		var userTools = document.getElementById("user_tools");
		userTools.appendChild(errDiv); 
	}
}

function crearCaja(){

	var newDiv = document.createElement("div");
	newDiv.setAttribute("class","tab iconic");
	var pageCounter = document.createElement("span");
	pageCounter.id="pageCounter";
	pageCounter.setAttribute("title",(esEspanol)?"Páginas Revisadas":"Revised Pages");
	pageCounter.setAttribute("style","width: 25px; cursor: default; height: 25px; margin-right: -9px; margin-left: -9px;");
	newDiv.appendChild(pageCounter);
	pageCounter.innerHTML = "..."
	var userTools = document.getElementById("user_tools");
	userTools.appendChild(newDiv); 
		
	//console.log("crearCaja : 1"); //DEBUG 
	
	var borde = document.createElement("div");
	borde.id="containerA";
	borde.setAttribute("style","position:absolute;float:right;opacity:0.9;z-index:100;display:none; background-color:#21364A; padding:8px; margin-left:225px; width:350px; top:95px; -moz-border-radius:7px; -webkit-border-radius:7px;");
	var newDivA = document.createElement("div");
	newDivA.id="listA";
	newDivA.setAttribute("style","z-index:99;background-color:#F0F8FF;padding:6px;");
	var newTextA = document.createElement("div");
	newTextA.id="textA";
	var pageCounter = document.createElement("div");
	pageCounter.id="pageCounter";
	//console.log("crearCaja : 2"); //DEBUG 
	
	var imgLoading = document.createElement("img");
	imgLoading.id="imgLoading";
	imgLoading.setAttribute("src","http://media.tumblr.com/tumblr_ltol2rpeAN1qzkqhi.gif");
	imgLoading.setAttribute("style","display:block;width:225px;margin-left:65px;");
	
	var cerrar = document.createElement("a");
	cerrar.id="close";
	cerrar.setAttribute("href","#");
	cerrar.innerHTML="X";
	cerrar.setAttribute("style","font-weight: bold; height: 16px; border: 1px solid black; text-align: center; background-color: rgb(186, 196, 207); padding: 2px 5px;");
	cerrar.setAttribute("onclick","document.getElementById(\"textA\").innerHTML=\"\";document.getElementById(\"containerA\").style.display=\"none\";document.getElementById(\"imgLoading\").style.display=\"block\";document.getElementById(\"close\").style.display=\"block\"");
	GM_addStyle("#listA #close:hover {background-color:#AEB6BF !important}")
	
	//console.log("crearCaja : 3"); //DEBUG 
	var reset = document.createElement("a");
	reset.id="reset";
	reset.setAttribute("href","#");
	reset.innerHTML="Reset";
	reset.setAttribute("style","border: 1px solid black; background-color: rgb(186, 196, 207); font-weight: bold; text-align: center; padding: 2px 4px;");
	reset.addEventListener("click", function(event){
		var tumblelog = getTumblelog();
		GM_deleteValue(tumblelog+"_followersList");
		GM_deleteValue(tumblelog+"_unfollowersList");
		GM_deleteValue(tumblelog+"_newFollowers");
		GM_deleteValue(tumblelog+"_cantFollowers");
		GM_deleteValue(tumblelog+"_cantCompareList");
		GM_deleteValue(tumblelog+"_allUnfollowersList");
		GM_deleteValue("_NrOfSimultaneousRequests");
		
		window.location = blogUrl + getTumblelog();
	}, false);
	GM_addStyle("#listA #reset:hover {background-color:#AEB6BF !important}")
	
	var closeSettings = document.createElement("a");
	closeSettings.id="uhf_closeSettingsBtn";
	closeSettings.setAttribute("href","#");
	closeSettings.innerHTML="Back";
	closeSettings.setAttribute("style","border: 1px solid black; background-color: rgb(186, 196, 207); font-weight: bold; text-align: center; padding: 2px 4px; margin-right:1px;display:none;");
	closeSettings.addEventListener("click", function(event){
		var t = document.getElementById("textA");
		if (t)
			t.style.display = "inline";
		var s = document.getElementById("uhf_settingsContent");
		if (s)
			s.style.display = "none";
		var ss = document.getElementById("uhf_saveSettingsBtn");
		if (ss)
			ss.style.display = "none";
		var c = document.getElementById("uhf_closeSettingsBtn");
		c.style.display = "none";
		document.getElementById("uhf_settingsBtn").style.display = "inline";
	}, false);
	GM_addStyle("#listA #uhf_closeSettingsBtn:hover {background-color:#AEB6BF !important}");
	
	var saveSettings = document.createElement("a");
	saveSettings.id="uhf_saveSettingsBtn";
	saveSettings.setAttribute("href","#");
	saveSettings.innerHTML="Save";
	saveSettings.setAttribute("style","border: 1px solid black; background-color: rgb(186, 196, 207); font-weight: bold; text-align: center; padding: 2px 4px; margin-right:1px;display:none;");
	saveSettings.addEventListener("click", function(event){
		//
		var v = document.getElementById("uhf_settingsInput1");
		if (v){
			var vn = parseInt(v.value);
			if (vn>0){
				GM_setValue("_NrOfSimultaneousRequests",vn);
			} else {
				GM_setValue("_NrOfSimultaneousRequests",_defaultNrOfSimultaneousRequests);
			}
			_NrOfSimultaneousRequests = GM_getValue("_NrOfSimultaneousRequests");
			v.value = _NrOfSimultaneousRequests;
		}
	}, false);
	GM_addStyle("#listA #uhf_saveSettingsBtn:hover {background-color:#AEB6BF !important}");

	
	var settings = document.createElement("a");
	settings.id="uhf_settingsBtn";
	settings.setAttribute("href","#");
	settings.innerHTML="Settings";
	settings.setAttribute("style","border: 1px solid black; background-color: rgb(186, 196, 207); font-weight: bold; text-align: center; padding: 2px 4px; margin-right:1px");
	settings.addEventListener("click", function(event){
		var t = document.getElementById("textA");
		if (t)
			t.style.display = "none";
		var s = document.getElementById("uhf_settingsContent");
		if (s)
			s.style.display = "block";
		else 
		{
			var s_Wrapper = document.createElement("div");
			s_Wrapper.id = "uhf_settingsContent";
			s_Wrapper.setAttribute("style","padding:0 5px 10px 5px;display:block");
			
			var s_rWDiv = document.createElement("div");
			s_rWDiv.style.margin = "0 0 7px 0";
			var s_headerText = document.createElement("h2");
			s_headerText.innerHTML = "SETTINGS";
			s_headerText.setAttribute("style","text-align:center;margin-bottom:10px")
			s_Wrapper.appendChild(s_headerText);
			
			var s_resetText = document.createElement("span");
			s_resetText.innerHTML = "UnfollowHaterFixd";
			s_resetText.setAttribute("style","margin-left:5px;")
			s_rWDiv.appendChild(reset);
			s_rWDiv.appendChild(s_resetText)
			s_Wrapper.appendChild(s_rWDiv)
	
			var s_sWDiv = document.createElement("div");
			s_sWDiv.style.margin = "0 0 7px 0";
			var s_NrOfPagesLoadedAtOnceText = document.createElement("span");
			s_NrOfPagesLoadedAtOnceText.setAttribute("style","margin-right:5px");
			s_NrOfPagesLoadedAtOnceText.innerHTML = "Number of simultaneous requests when compiling follower list <a href='http://unfollowhaterfixd.tumblr.com/settingsInfo' target='_blank' style='text-decoration:underline'>(?)</a>";
			var s_NrOfPagesLoadedAtOnceInput = document.createElement("input");
			s_NrOfPagesLoadedAtOnceInput.id = "uhf_settingsInput1";
			s_NrOfPagesLoadedAtOnceInput.value = _NrOfSimultaneousRequests;
			s_NrOfPagesLoadedAtOnceInput.type = "number";
			s_NrOfPagesLoadedAtOnceInput.setAttribute("style","width:50px");
			s_sWDiv.appendChild(s_NrOfPagesLoadedAtOnceText);	
			s_sWDiv.appendChild(s_NrOfPagesLoadedAtOnceInput);	
			s_Wrapper.appendChild(s_sWDiv);	
			
			
			document.getElementById("listA").appendChild(s_Wrapper);
		}
		var c = document.getElementById("uhf_closeSettingsBtn");
		if (c)
		{
			c.style.display = "inline";
			
			document.getElementById("uhf_settingsBtn").style.display = "none";
		}
		var ss = document.getElementById("uhf_saveSettingsBtn");
		if (ss)
		{
		document.getElementById("uhf_saveSettingsBtn").style.display = "inline";
		}
	}, false);
	GM_addStyle("#listA #uhf_settingsBtn:hover {background-color:#AEB6BF !important}")
	
	var f_divFloatRight = document.createElement("div");
	f_divFloatRight.setAttribute("style","float:right");
	
	var f_divAlignRight = document.createElement("div");
	f_divAlignRight.setAttribute("style","text-align:right;margin-bottom:40px");
	
	f_divFloatRight.appendChild(settings);
	f_divFloatRight.appendChild(saveSettings);
	f_divFloatRight.appendChild(closeSettings);
	f_divFloatRight.appendChild(cerrar);
	f_divAlignRight.appendChild(f_divFloatRight);
	
	newDivA.appendChild(f_divAlignRight);
	newDivA.appendChild(newTextA);
	newDivA.appendChild(pageCounter);
	newDivA.appendChild(imgLoading);
	borde.appendChild(newDivA);
	//console.log("crearCaja : 4"); //DEBUG 
	
	var insDL = document.getElementsByClassName("l-content");
	if (insDL <1)
		insD = document.body;
	else 
		insD = insDL[0];
	insD.appendChild(borde);
}

function cerrarNotif(){
	if(document.getElementById("unfollow_notif")!=null)
		document.getElementById("unfollow_notif").style.display="none";
}

function cerrarListado(){
	document.getElementById("textA").innerHTML="";
	document.getElementById("containerA").style.display="none";
	document.getElementById("imgLoading").style.display="block";
	document.getElementById("close").style.display="inline";
	document.getElementById("uhf_settingsBtn").style.display="inline";
}

function openListado(){
	document.getElementById("containerA").style.display="block";
	document.getElementById("imgLoading").style.display="block";
	document.getElementById("close").style.display="none";
	document.getElementById("uhf_settingsBtn").style.display="none";
}

function crearDivDummy(){
	var newDiv = document.createElement("div");
	newDiv.id="nuevo";
	newDiv.setAttribute("style","display:none");
	
	var insDL = document.getElementsByClassName("l-header");
	//console.log(insDL.length); //DEBUG
	//console.log(insDL[0].innerHTML); //DEBUG
	if (insDL <1)
		insD = document.body;
	else 
		insD = insDL[0];
	insD.appendChild(newDiv);

	
	var div = document.createElement("div");
	div.setAttribute("class","post");
	insD.appendChild(div);
	//console.log("crearDivDummy : done"); //DEBUG 
}

function getTumblelog(){
	return document.URL.split("/")[4].replace(/[#]/gi,"");
}

function getFollowerElement(claseABuscar, elementoDondeBuscar){
	var elementosPorClase = new Array();
	var a=0;
	var htmlTags = new Array();
	var htmlTags= elementoDondeBuscar.getElementsByTagName('div');
	for(var i=0; i<htmlTags.length; i++){
		var tag = String(htmlTags[i].className);
		var classes = tag.split(" ");
		for(var j=0; j<classes.length; j++){
			if(classes[j]===claseABuscar){
				elementosPorClase[a] = htmlTags[i];
				a++;
			}
		}
	}
	return elementosPorClase;
}

function obtenerListadoFollowers(){
	crearEstilo();
	//console.log("crearEstilo"); //DEBUG
	crearDivDummy();
	//console.log("crearDivDummy"); //DEBUG
	crearCaja();
	//console.log("crearCaja"); //DEBUG
	var tumblelog = getTumblelog();
	if(virgen){
		openListado();
		var lista = document.getElementById("textA");
		var instruccion = "";
		instruccion = "<table align=\"center\" style=\"text-align:justify\" width=\"340px\">";
		instruccion+="<tr><td align=\"center\"><h2><a href=\"https://greasyfork.org/scripts/5478-unfollowhaterfixd\" target=\"_blank\">UNFOLLOW HATER (Fixd)</a></h2></td></tr>";
		if(esEspanol){
			instruccion+="<tr><td align=\"left\" style=\"padding:10px\"><p>No se ha detectado una ejecución anterior del Unfollow Hater desde este navegador para el tumblelog "+tumblelog;
			instruccion+=" por lo que se recopilara lista de followers actuales. Al concluir se refrescará esta página. Por favor espera...</p></td></tr>";
		}else{
			instruccion+="<tr><td align=\"left\" style=\"padding:10px\"><p>It appears Unfollow Hater is running in this browser for the tumblelog <b>" +tumblelog+ "</b> for the first time.</p><br>";
			instruccion+="<p>It will compile a list of your current followers. When it is ready this page will be refreshed.</p></td></tr>";	
			instruccion+="<tr><td align=\"center\" style=\"padding:10px\"><p>Please Wait...</p></td></tr>";
		}
		instruccion+="</table>";			
		lista.innerHTML += instruccion;
		GM_setValue(tumblelog+"_unfollowersList","");
	}
	buscarUnfollower();
		

}

function crearLista(cantFollowers, tumblelog, listadoFollowers){
	var follperpage = 40;
	if(GM_getValue(tumblelog+"_cantFollowers")==null)
		GM_setValue(tumblelog+"_cantFollowers",cantFollowers.toString());
	else{
		GM_setValue(tumblelog+"_newFollowers",cantFollowers.toString());
	}
	var paginaTotal = Math.ceil(cantFollowers/follperpage);
	if(paginaTotal == 0)
		paginaTotal = 1;
	_FollowerPagesTotal = paginaTotal
	loadNextFollowerPages(tumblelog, listadoFollowers)
}	

function setListas(tumblelog, listadoFollowers){
	var size = listadoFollowers.length;
	if(GM_getValue(tumblelog+"_followersList")==null){
		//console.log("setListas : if start"); //DEBUG 
		GM_setValue(tumblelog+"_followersList",listadoFollowers.unique().join("|||"));
		//console.log(GM_getValue(tumblelog+"_followersList")); //DEBUG
		
	}else{
		//console.log("setListas : else start"); //DEBUG 
		GM_setValue(tumblelog+"_compareList",listadoFollowers.unique().join("|||"));
	}
	//console.log("setListas : done"); //DEBUG 
}

function realizarComparacion(tumblelog){
	var unfollowers = new Array();
	var viejoListado = GM_getValue(tumblelog+"_followersList").split("|||");
	if(GM_getValue(tumblelog+"_compareList")!=null){
		var nuevoListado = GM_getValue(tumblelog+"_compareList").split("|||");
		GM_setValue(tumblelog+"_cantFollowersList",viejoListado.length);
		GM_setValue(tumblelog+"_cantCompareList",nuevoListado.length);
		
		if(GM_getValue(tumblelog+"_unfollowersList")!=null)
			unfollowers=GM_getValue(tumblelog+"_unfollowersList").split("|||");
		var c=unfollowers.length;
		for(var i=0; i<viejoListado.length; i++){
			var encontrado=false;
			for(var j=0; j<nuevoListado.length; j++){
				if(nuevoListado[j]==viejoListado[i]){
					encontrado=true;
					break;
				}
			}
			if(!encontrado){
				unfollowers[c]=viejoListado[i];
				c++;
			}
		}
		unfollowers = borraElPrimero(unfollowers);
		GM_setValue(tumblelog+"_followersList",nuevoListado.join("|||"));
		GM_setValue(tumblelog+"_unfollowersList",unfollowers.unique().join("|||"));
	}
	return unfollowers.length;
	
}

function guardarTotalUnfollowers(tumblelog){
	var unfollowers = new Array();
	var allUnfollowers = new Array();
	var actualFollowers = new Array();
	if(GM_getValue(tumblelog+"_followersList")!=null)
		actualFollowers = GM_getValue(tumblelog+"_followersList").split("|||");
	if(GM_getValue(tumblelog+"_unfollowersList")!=null)
		unfollowers=GM_getValue(tumblelog+"_unfollowersList").split("|||");
	if(GM_getValue(tumblelog+"_allUnfollowersList")!=null)
		allUnfollowers=GM_getValue(tumblelog+"_allUnfollowersList").split("|||");
	
	for(var i=0; i<actualFollowers.length; i++){
		for(var j=0; j<allUnfollowers.length; j++){
			if(allUnfollowers[j]==actualFollowers[i]){
				allUnfollowers.splice(j,1);
			}
		}
	}
	var c=allUnfollowers.length;
	for(var i=0; i<unfollowers.length; i++){
		var encontrado=false;
		for(var j=0; j<allUnfollowers.length; j++){
			if(allUnfollowers[j]==unfollowers[i]){
				encontrado=true;
				break;
			}
		}
		if(!encontrado){
			allUnfollowers[c]=unfollowers[i];
			c++;
		}
	}
		
	allUnfollowers = borraElPrimero(allUnfollowers);
	GM_setValue(tumblelog+"_followersList",actualFollowers.join("|||"));
	GM_setValue(tumblelog+"_allUnfollowersList",allUnfollowers.join("|||"));
}

function mostrarUnfollows(){
	cerrarListado();
	cerrarNotif();
	openListado();
	var tumblelog = getTumblelog();
	var actualFollowers=GM_getValue(tumblelog+"_cantFollowers");
	var nuevoFollowers=GM_getValue(tumblelog+"_newFollowers");
	if(!GM_getValue(tumblelog+"_allUnfollowersList"))
		GM_setValue(tumblelog+"_allUnfollowersList","")
	var oldUnfollowers = GM_getValue(tumblelog+"_allUnfollowersList").split("|||");
	var unfollowers = GM_getValue(tumblelog+"_unfollowersList").split("|||");
	unfollowers = borraElPrimero(unfollowers);
	GM_setValue(tumblelog+"_cantFollowers",nuevoFollowers);
	var cantViejoListado = GM_getValue(tumblelog+"_cantFollowersList");
	var cantNuevoListado = GM_getValue(tumblelog+"_cantCompareList");
	var lista = document.getElementById("textA");
	var listaStr="";
	listaStr+="<table align=\"center\"style=\"text-align:center; max-height:600px; overflow:auto;\" width=\"340px\">";
	listaStr+="<tr><td><h2 style=\"margin-bottom:5px\"><a href=\"https://greasyfork.org/scripts/5478-unfollowhaterfixd\" target=\"_blank\">UNFOLLOW HATER (Fixd)</a></h2></td></tr>";
	listaStr+="<tr><td>";
	listaStr+="<table align=\"center\"style=\"text-align:left; max-height:200px; overflow:auto;\" width=\"340px\">";
	listaStr+=(esEspanol)?"<tr><td colspan=\"3\"><b>Estado Followers:</b></td></tr>":"<tr><td><b>Followers Stats:</b></td></tr>";
	listaStr+="<tr><td></td>";
	listaStr+=(esEspanol)?"<tr><td><a title=\"Es la cantidad de usuarios que muestra Tumblr\"><b>Todos: </a></b></td>":"<tr><td><a title=\"Number of users that shows Tumblr\"><b>All: </b></td>";
	listaStr+="<td>"+nuevoFollowers+"</td></tr>";
	listaStr+=(esEspanol)?"<tr><td><b><a title=\"Cantidad de usuarios que no son spam, bots y que no están bloqueados\">No bloqueados:</a></b></td>":"<tr><td><a title=\"Number of users that aren't spam, bots or blocked.\"><b>Non-blocked:</a></b></td>";
	listaStr+="<td>"+cantNuevoListado+"</td></tr>";
	listaStr+="</table><hr/></td></tr>";
	listaStr+="<tr><td><b>Total "+(esEspanol?"Nuevos":"New")+" Unfollowers: </b>"+unfollowers.length+"</td></tr>";
	if(unfollowers.length>0)
		listaStr+="<tr><td style=\"font-size:11px\">"+((esEspanol)?"Estos blogs han dejado de seguirte, cambiaron su nombre, borraron su cuenta, fueron marcados como bloqueados o spam (por Tumblr) o simplemente dejaron de aparecer en la lista de followers y puede que aún te sigan: ":"These blogs have ceased to follow you, are renamed, deleted their account, have been blocked, marked as spam (by Tumblr) or simply they don't appear in your followers list anymore but maybe they still following you.")+"</td></tr>";
	for(var k=0; k<unfollowers.length; k++){
		var color=(k%2==0)?"#BAC4CF":"#F0F8FF";
		listaStr+="<tr><td style=\"text-align:center; background-color:"+color+"\"><a href=\"http://"+unfollowers[k]+".tumblr.com\" target=\"_blank\">"+unfollowers[k]+"</a></td></tr>";
	}
	listaStr+="</table>";
	if(oldUnfollowers.length>0){
		listaStr+="<div width=\"340px\">";
		listaStr+="<div onclick=\"if(document.getElementById('oldUnfollowers').style.display=='block'){document.getElementById('oldUnfollowers').style.display='none';}else{document.getElementById('oldUnfollowers').style.display='block';}\" style=\"background-color:#C0D7F0; width:100%; cursor: pointer; text-align:center;\" align=\"center\"><b>"+(esEspanol?"Antiguos Unfollowers":"Old Unfollowers")+"</b></div>";
		listaStr+="<table id=\"oldUnfollowers\" align=\"center\" width=\"340px\" style=\"text-align:center; background-color:#C0D7F0; display: none; max-height:200px; overflow:auto;\">";	
		listaStr+="<tr><td width=\"340px\"><b>Total: </b>"+oldUnfollowers.length+"</td></tr>";
		for(var k=0; k<oldUnfollowers.length; k++){
			var color=(k%2==0)?"#BAC4CF":"#F0F8FF";
			listaStr+="<tr><td width=\"340px\" style=\"background-color:"+color+"\"><a href=\"http://"+oldUnfollowers[k]+".tumblr.com\" target=\"_blank\">"+oldUnfollowers[k]+"</a></td></tr>";
		}
	}
	listaStr+="</table></div>";
	document.getElementById("imgLoading").style.display="none";
	lista.innerHTML += listaStr;
	document.getElementById("close").style.display="inline";
	document.getElementById("uhf_settingsBtn").style.display="inline";
	guardarTotalUnfollowers(tumblelog);
	GM_setValue(tumblelog+"_unfollowersList","");
}

function mostrarError(statusCode){
	openListado();
	document.getElementById("imgLoading").style.display="none";
	var cuadro = document.getElementById("textA");
	cuadro.innerHTML="";
	cuadro.setAttribute("style","padding:10px;")
	var instruccion="";
	instruccion += "<table align=\"center\" style=\"text-align:justify\" width=\"320px\">";
	instruccion+="<tr><td align=\"center\"><h2 style=\"margin-bottom:10px;\"><a href=\"https://greasyfork.org/scripts/5478-unfollowhaterfixd\" target=\"_blank\">UNFOLLOW HATER (Fixd)</a></h2></td></tr>";
	var intStatusCode = parseInt(statusCode);
	if(esEspanol){
		if(intStatusCode>=400 && intStatusCode<500){
			instruccion+="<tr><td><p><b>Error "+statusCode+".</b><br/>Error del script al intentar realizar la búsqueda, por favor envíame un <a href=\"http://openmindeo.tumblr.com/submit\">submit</a> con un screenshot de esta pantalla.</p></td></tr>";
		}else if(intStatusCode>=500 && intStatusCode<600){
			instruccion+="<tr><td><p><b>Error "+statusCode+".</b><br/>Error del servidor de tumblr al intentar realizar la búsqueda, el servidor no está aceptando las peticiones del script. Por favor intenta más tarde cuando el servicio de Tumblr funcione con normalidad.</p></td></tr>";
		}else if(intStatusCode==999 || !intStatusCode){
			instruccion+="<tr><td><p><b>Error.</b><br/>Tiempo agotado para la solicitud (conexión muy lenta), no se pudo obtener el listado de followers, refresca e intenta nuevamente.</p></td></tr>";
		}else if(intStatusCode==1000){
			instruccion+="<tr><td><p><span style=\"font-weight:bold;text-decoration:underline\">Error</span><br/>Compiling a list of followers unsuccesful (probably due to changes in Tumblr HTML). If the problem persists, please contact the developer with this message.</p></td></tr>";
		}
	}else{
		if(intStatusCode>=400 && intStatusCode<500){
			instruccion+="<tr><td><p><b>Error "+statusCode+".</b><br/>Script error while sending request to tumblr, please send me a screenshot with this message to my <a href=\"http://openmindeo.tumblr.com/submit\">Submit</a></p></td></tr>";
		}else if(intStatusCode>=500 && intStatusCode<600){
			instruccion+="<tr><td><p><b>Error "+statusCode+".</b><br/>Tumblr's server error while sending request to Tumblr, the server is not accepting the script'ss requests. Please try again later when the Tumblr service will operate normally.</p></td></tr>";
		}else if(intStatusCode==999 || !intStatusCode){
			instruccion+="<tr><td><p><b>Error.</b><br/>Timeout for the request (too slow connection), failed to get the list of followers, refresh and try again.</p></td></tr>";
		}else if(intStatusCode==1000){
			instruccion+="<tr><td><p><span style=\"font-weight:bold;text-decoration:underline\">Error</span><br/>Compiling a list of followers unsuccesful (probably due to changes in Tumblr HTML). If the problem persists, please contact the developer with this message.</p></td></tr>";
		}
	}
	instruccion+="</table>";			
	cuadro.innerHTML += instruccion;
	document.getElementById("close").style.display="inline";	
}

function alimentarLista(divHTML,listadoGuardar){
	var index = listadoGuardar.length;
	var paginaFollowers = getFollowerElement("follower",divHTML);
	for(var i=0; i<paginaFollowers.length; i++){
		var url;
		try {
			url = paginaFollowers[i].getElementsByClassName("name")[0].getElementsByTagName("a")[0].innerHTML;
		} catch(e) {
			_CritError = true;
		}
		listadoGuardar[index] = url;
		index++;
	}
	return listadoGuardar;
}

function buscarUnfollower(){
	i=0;
	setTimeout(function(){
		var tumblelog = getTumblelog();
		ajax(blogUrl+tumblelog+"/followers/", null, new Array(), null, null, tumblelog, "axa2");
	},2000);
}

function loadNextFollowerPages(tumblelog, listadoFollowers){
	for(var i=_FollowerPagesLoaded; (i<_FollowerPagesTotal && i<_FollowerPagesLoaded+_NrOfSimultaneousRequests); i++){
		ajax(blogUrl+tumblelog+"/followers/page/"+(i+1), "nuevo", listadoFollowers, i+1, _FollowerPagesTotal, tumblelog, "axa1"); 
	}
}

var _defaultNrOfSimultaneousRequests = 15;
var _NrOfSimultaneousRequests = GM_getValue("_NrOfSimultaneousRequests", _defaultNrOfSimultaneousRequests);
var _FollowerPagesLoaded = 0;
var _FollowerPagesTotal = 0;
var _CritError = false;
var error = false;
var icon = false;
var virgen = (GM_getValue(getTumblelog()+"_followersList")==null);
var blogUrl = window.location.protocol+"//www.tumblr.com/blog/";
var i=0;

var esEspanol = (navigator.language.indexOf("es")!=-1);
if(document.URL.indexOf(blogUrl)!=-1){
	obtenerListadoFollowers();
}