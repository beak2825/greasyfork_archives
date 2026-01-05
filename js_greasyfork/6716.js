// ==UserScript==
// @name        Donate Dr. Meth
// @name:de     Spenden Dr. Meth
// @namespace   *
// @author      Klajo
// @description Unlocks the "Donare" achievement, when you click a button. You can remove the script after you have the achievement.
// @description:de Schaltet das "Donare" Achievement frei. Das Script kann entfernt werden, wenn das Achievement freigeschaltet ist.
// @include     http://drmeth.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6716/Donate%20Dr%20Meth.user.js
// @updateURL https://update.greasyfork.org/scripts/6716/Donate%20Dr%20Meth.meta.js
// ==/UserScript==


donButt = document.createElement("input");
donButt.type = "button";
donButt.value = "unlock Donor";
donButt.addEventListener('click',	
						function() {createCookie("donate","2",30);}
						);
placeHolder = document.getElementById("button");
placeHolder.appendChild(donButt);