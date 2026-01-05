// ==UserScript==
// @name                WME GetNodeID
// @namespace           https://greasyfork.org/fr/scripts/9909-wme-getnodeid
// @description         Gives NodeID of selected segments
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @author              Fafa114
// @version             0.3
// @grant               na
// @copyright           2015 Fafa114
// @downloadURL https://update.greasyfork.org/scripts/9909/WME%20GetNodeID.user.js
// @updateURL https://update.greasyfork.org/scripts/9909/WME%20GetNodeID.meta.js
// ==/UserScript==

//V0.3 Suppression scroll automatique bas de page
//V0.3 Ajout lien pour sélectionner tous les n° de noeuds
//V0.3 Divers

if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
	(function page_scope_runner() {
		var my_src = "(" + page_scope_runner.caller.toString() + ")();"; // If we're _not_ already running in the page, grab the full source of this script.

		// Create a script node holding this script, plus a marker that lets us know we are running in the page scope (not the Greasemonkey sandbox).
		// Note that we are intentionally *not* scope-wrapping here.
		var script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;

		// Insert the script node into the page, so it will run, and immediately remove it to clean up.  Use setTimeout to force execution "outside" of the user script scope completely.
		setTimeout(function() {
			document.body.appendChild(script);
			document.body.removeChild(script);
		}, 0);
	})();
	return; // Stop running, because we know Greasemonkey actually runs us in an anonymous wrapper.
}

function bootstrap(){
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	/* begin running the code! */
	setTimeout(init, 700);
}

function NodesID() {
	var Nbr = Waze.selectionManager.selectedItems.length;
	var NbrSeg = 0;
	var Texte = "";
	var Mem = [];
	if (Nbr > 0) {
        for(i = 0; i<Nbr; i++){ 
        	if (Waze.selectionManager.selectedItems[i].model.type == "segment") { 
				var TrouveFrom = false;
				var TrouveTo = false;
				for(u = 0; u<Mem.length; u++){
					if (Waze.selectionManager.selectedItems[i].model.attributes.fromNodeID == Mem[u]){
						TrouveFrom = true;
					}
					if (Waze.selectionManager.selectedItems[i].model.attributes.toNodeID == Mem[u]){
						TrouveTo = true;
					}
				}
				if (TrouveFrom == false){
					Mem[Mem.length] = Waze.selectionManager.selectedItems[i].model.attributes.fromNodeID;
					if (i == 0){
						Texte = Waze.selectionManager.selectedItems[i].model.attributes.fromNodeID;
					}else{
						Texte = Texte + ', ' + Waze.selectionManager.selectedItems[i].model.attributes.fromNodeID;
					}
				}
				if (TrouveTo == false){
					Mem[Mem.length] = Waze.selectionManager.selectedItems[i].model.attributes.toNodeID;
					Texte = Texte + ', ' + Waze.selectionManager.selectedItems[i].model.attributes.toNodeID;
				}
				NbrSeg++;
			}
		}
        if (NbrSeg > 0) {
			segeditgen = document.getElementById("segment-edit-general");
			segextra = document.getElementById("segment-extra-details");
			if (!segextra) {
				segextra = document.createElement('div');
				segextra.id = 'segment-extra-details';
				segeditgen.appendChild(segextra);
			}

			segextra.innerHTML = '<div{width:20px;}><A HREF="https://www.waze.com/forum/viewtopic.php?f=1316&t=141844"><B>WME GetNodeID</B></A><br>Segment(s) sélectionné(s) : ' + NbrSeg + '<br><br><div id="GNTitre" title="Sélectionner les noeuds" style="cursor: pointer" onclick="javascript:$(\'#GNID\').selectText();">Liste des IDs de Noeuds:</div><div id="GNID">' + Texte + '</div></div>';
			//$("#sidebar").animate({ scrollTop: $("#sidebar").offset().top + 5000 }, 1); //5000 pour être sûr d'être tout en bas...
    	}
  	}
	
  	return true;
}

jQuery.fn.selectText = function(){
   var doc = document;
   var element = this[0];
   if (doc.body.createTextRange) {
       var range = document.body.createTextRange();
       range.moveToElementText(element);
       range.select();
   } else if (window.getSelection) {
       var selection = window.getSelection();        
       var range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       selection.addRange(range);
   }
};

function init(){
	Waze = unsafeWindow.Waze;
	if(typeof(Waze) == 'undefined'){
		window.setTimeout(init, 700);
		return;
	}
	Waze.selectionManager.events.register("selectionchanged", null, NodesID);
	NodesID(); // exécution de la fonction dès le lancement du script pour fonctionnement avec un permalink
}

bootstrap();
