// ==UserScript==
// @name           Pokec.sk - zvyrazni spravy podla mesta
// @namespace      http://
// @description    Zvyraznenie správ na skle od užívateľov z vybraného mesta
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        https://pokec-sklo.azet.sk/miestnost/*
// @date           2013-12-14
// @author         pompom
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/7835/Pokecsk%20-%20zvyrazni%20spravy%20podla%20mesta.user.js
// @updateURL https://update.greasyfork.org/scripts/7835/Pokecsk%20-%20zvyrazni%20spravy%20podla%20mesta.meta.js
// ==/UserScript==


/* ************************************************************************** */
/* ************************************************************************** */
/* ************************************************************************** */


var w_mesta = new Array ("Bratislava", "Trnava" );

var w_color = new Array ("00ff22", "ffbb22");

/* ************************************************************************** */
/* ************************************************************************** */
/* ************************************************************************** */


var sklo = document.getElementById("sklo");
sklo.addEventListener('DOMNodeInserted', function(event) {
	var array;

	array = event.relatedNode.getElementsByClassName("lokalita");
	for(var num=0; num<array.length; num++)
	{
	
        for ( var i=0; i<w_mesta.length; i++)
        {
            if (array[num].innerHTML.search(w_mesta[i]) != -1) 
            {
               array[num].parentNode.parentNode.parentNode.setAttribute('style','position: relative; background-color: '+w_color[i]+' !important;');
            }
//            else {
//               array[num].parentNode.parentNode.parentNode.parentNode.setAttribute('style','display:none !important!'); 
//            }    
        }
    }   
    
    
}, true);

