// ==UserScript==
// @name         DC Météo
// @namespace    https://greasyfork.org/scripts/9244-dc-m%C3%A9t%C3%A9o/code/DC%20M%C3%A9t%C3%A9o.user.js
// @version      0.3
// @description  Et maintenant la météo!
// @author       Linil
// @match        http://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9244/DC%20M%C3%A9t%C3%A9o.user.js
// @updateURL https://update.greasyfork.org/scripts/9244/DC%20M%C3%A9t%C3%A9o.meta.js
// ==/UserScript==

jQuery.noConflict();

docMeteo = 'https://docs.google.com/uc?authuser=0&id=0B__ztRpH4-vmUi1MdVk5NDVIb3M';


function getMeteo(aitlID){
         jQuery.ajax({
                  type: 'GET',
                  url: docMeteo,
                  async: false,
                  jsonpCallback: 'Meteo',
                  contentType: "application/json",
                  dataType: 'jsonp',
                  success: function(json){
                           $("#nbMeteo").html(json.annonces.length);
                           htmlMeteo = $("#"+aitlID+" .Meteo .texte table tbody");
                           htmlMeteo.html('');
                           jQuery.each(json.annonces, function(key, val){
                                    htmlMeteo.append('<tr><td style="padding: 10px">'+val[0]+'</td><td style="padding: 10px">'+val[1]+'</td></tr>');
                                    htmlMeteo.append('<tr><td colspan="2" style="text-align:left;border-bottom: 1px solid #9AD1E5;padding: 10px 0 5px;">'+val[2]+'</td></tr>');
                           });
                  }
         });
}

AITL.prototype.startSave = AITL.prototype.start;
AITL.prototype.start = function (a) {
         this.startSave(a);
         $("#"+this.id+" .principal .canaux_imperiaux .texte .paragraphe:last table:last tbody tr:last").after('<tr><td class="link couleur2 type1" onclick="engine.getCtl(this).showMeteo();">Météo</td><td class="type3" id="nbMeteo">0</td></tr>');
         $("#"+this.id+" .deces").after('<div class="Meteo" style="display:none;"><div class="titre">Météo</div><div class="texte" style="margin-top:5px;height:222px;left:12px;width:404px;"><table style="border-collapse:collapse;text-align:center;width:100%;"><tbody></tbody></table></div></div>');
         getMeteo(this.id);
}

AITL.prototype.showMeteo=function(){
         $("#"+this.id+" .principal").children().each(function(){
                  "Meteo"!=$(this).attr("class")&&$(this).fadeOut()
         }),
         $("#"+this.id+" .actions .menu1, #"+this.id+" .actions .menu2, #"+this.id+" .actions .menu3").fadeOut(),
         $("#"+this.id+" .Meteo").fadeIn();
         getMeteo(this.id);
}