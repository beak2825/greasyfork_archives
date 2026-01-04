// ==UserScript==
// @name         Synology NAS - Enrich Share-List
// @description  Add the description of each share behind the volume.
// @author       Andreas Kreisl
// @namespace    https://github.com/Indiana8000
// @license      MIT
// @include      http://192.168.5.21:5000/*
// @version  	 1.0
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550349/Synology%20NAS%20-%20Enrich%20Share-List.user.js
// @updateURL https://update.greasyfork.org/scripts/550349/Synology%20NAS%20-%20Enrich%20Share-List.meta.js
// ==/UserScript==


document.addEventListener('click', function(event) {
  let elm = event.target;
  let par = elm.parentElement;
  par = par.parentElement;
  par = par.parentElement;
  let attr = par.getAttribute("tree-root-id");
  //console.log("DEBUG-1: [" + par.id + "] / [" + attr + "]");
  if(attr == "tree:leaf_sharefolder") {
    getShareList()
  }
}, true);


function getShareList() {
	let e = document.getElementsByClassName("syno-admincenter-share-listview");
  if(e.length == 1) {
	  //console.log("DEBUG-2: " + e[0].id);
    let l = e[0].getElementsByClassName("item-wrap");
	  //console.log("DEBUG-3: " + l.length);
    for(i=0;i<l.length;i++) {
      let e = l[i];
      e.getElementsByClassName("item-status ")[0].textContent += " // " + e.getElementsByClassName("share-info-value")[0].textContent;
    }
  }
}
