// ==UserScript==
// @name        SGW Fixer (Chrome)
// @namespace   https://greasyfork.org
// @match       http://sellers.shopgoodwill.com
// @match       http://localhost/sgw.html
// @version     1
// @description Fixes SGW by removing things that don't matter.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7862/SGW%20Fixer%20%28Chrome%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7862/SGW%20Fixer%20%28Chrome%29.meta.js
// ==/UserScript==


	

    var html = document.getElementById('form1').children[0].children[0].children[1].children[1];
    var html2 = document.getElementById('form1').children[2].children[0].children[0].children[0];
     
    html.innerHTML = html.innerHTML.replace(/<hr align="center" noshade="" width="350">/g,"");
    html.innerHTML = html.innerHTML.replace(/One line((.|\n)*)find your item\.|You may use((.|\n)*)do not use HTML\.|For |Dutch auctions((.|\n)*)selling a single set\.|This is the price((.|\n)*)and commas \(','\)|Bid increment is((.|\n)*)each bid\.|Reserve Price is((.|\n)*)Reserve Price!|Buy Now allows((.|\n)*)Buy Now!/g, "");
    html.innerHTML = html.innerHTML.replace(/Item Quantity((.|\n)*)itemQuantity" size="3" value="1">/g, "<span id=\"qtyBox\" style=\"display:none;\"><input maxlength=\"3\" name=\"itemQuantity\" size=\"3\" value=\"1\"></span></strong>");
    html.innerHTML = html.innerHTML.replace(/per item((.|\n)*): 3\.00/g, "");    
    html.innerHTML = html.innerHTML.replace(/Bid Increment((.|\n)*)10\.00/g, "<span id=\"bidBox\" style=\"display:none;\"><input maxlength=\"11\" name=\"itemBidIncrement\" size=\"11\" value=\"1\"><input maxlength=\"11\" name=\"itemReserve\" size=\"11\" value=\"0\"><input maxlength=\"11\" name=\"itemBuyNowPrice\" size=\"11\" value=\"0\"></span></strong>");
//    html.innerHTML = html.innerHTML.replace(/<option value="7" selected="">7<\/option>/g, "<option value=\"7\">7</option>");
//    html.innerHTML = html.innerHTML.replace(/<option value="4">4<\/option>/g, "<option value=\"4\" selected=\"\">7</option>");
    html.innerHTML = html.innerHTML.replace(/Box Selection((.|\n)*)willing to ship your item\./g, "<span id=\"boxBox\" style=\"display:none;\"><select name=\"itembox\"><option value=\"-1\">No Boxes Defined</option></select><select name=\"itemShipping\" id=\"itemShipping\" size=\"1\"><option value=\"2\">U.S. and Canada Only</option><option value=\"0\" selected=\"\">No international shipments (U.S. Only)</option><option value=\"1\">Will ship internationally</option></select></span></strong></b>")
    html.innerHTML = html.innerHTML.replace(/Handling Charge((.|\n)*)final item selling price\)\./g, "</strong><span id=\"handleBox\" style=\"display:none;\"><input maxlength=\"11\" name=\"itemHandlingPrice\" size=\"11\" value=\"2\"></span></b>");
    html.innerHTML = html.innerHTML.replace(/<input name="itemNoCombineShipping" value="ON" type="checkbox">/g, "</strong><input name=\"itemNoCombineShipping\" value=\"ON\" type=\"checkbox\" CHECKED></strong>");
    html2.innerHTML = html2.innerHTML.replace(/You will be((.|\n)*)before you list\.|Press <input tabindex="-99" id="reset1" name="reset1" type="reset" value="Reset Form">((.|\n)*) to start over\./g, "");
