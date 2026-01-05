// ==UserScript==
// @name         Armas Market Receipt
// @name:de      Armas Market Kassenbon
// @namespace    http://vankash.de/
// @version      0.5
// @description  This Script will sum up every G1 Credit you spent and calculate how much $ it is worth!
// @description:de  Das Skript berechnet die G1Credits die ihr ausgegeben habt und berechnet euch wieviel diese in $ Wert wären.
// @author       Vankash
// @match        https://www.gamersfirst.com/marketplace/ingame/purchase_history.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9571/Armas%20Market%20Receipt.user.js
// @updateURL https://update.greasyfork.org/scripts/9571/Armas%20Market%20Receipt.meta.js
// ==/UserScript==

javascript:(function(){if (location.href.match('gamersfirst.com/marketplace/ingame/purchase_history.php')){var g1ctotal = [];var g1c = 0;var dollars;var dollar;$("tr").each(function(){if(!$(this).find(".price_column").text().replace(" G1C", "").replace(",", "").replace("Price","") == ""){g1ctotal.push(Number($(this).find(".price_column").text().replace(" G1C", "").replace(",", "")));g1c += Number($(this).find(".price_column").text().replace(" G1C", "").replace(",", ""));$('.right-content').each(function(){dollar = g1c*0.0125;});$('#armasmoneywrapper').remove();$('#store_header').append('<div id="armasmoneywrapper" style="background-color: rgb(232, 177, 0); height=50px;border: 19px;margin: 10px;padding: 0.5em;border-radius: 5px;box-shadow: 0px 0px 13px 3px rgb(18, 16, 2);"><b style="text-align:right;color: rgb(6, 4, 0);height:18px;">You spent a total of '+g1c+' G1 Credits which are equal to $'+parseInt(dollar)+'</b></div>');jQuery('head').append('<style type="text/css">#purchase_history{top: 185px !important;}</style>');}});}else{alert('Wrong Page! \n Try visiting http://www.gamersfirst.com/marketplace/ingame/purchase_history.php');}})();