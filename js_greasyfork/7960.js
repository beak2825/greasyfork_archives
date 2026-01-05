// ==UserScript==
// @name          DC - AITL Libre - La Plume Libre
// @namespace          DreadCast
// @include          http://www.dreadcast.net/Main
// @grant          none
// @author                 La plume - xaios & un autre plumé
// @user                   hacker inconnu
// @date                   02/11/2015
// @version                   2.0
// @description          AITL libre, canal de la plume libre 2.0
// @compat                   Firefox, Chrome
// @require          http://code.jquery.com/jquery-1.10.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/7960/DC%20-%20AITL%20Libre%20-%20La%20Plume%20Libre.user.js
// @updateURL https://update.greasyfork.org/scripts/7960/DC%20-%20AITL%20Libre%20-%20La%20Plume%20Libre.meta.js
// ==/UserScript==

jQuery.noConflict();

docAnnoncesForAITLLibre = 'http://docs.google.com/uc?export=download&id=0B-Av7SO5FgugbXdnV3ZnWUVNUW8';


function getAnnoncesForAITLLibre(aitlID){
         jQuery.ajax({
                  type: 'GET',
                  url: docAnnoncesForAITLLibre,
                  async: false,
                  jsonpCallback: 'AnnoncesForAITLLibre',
                  contentType: "application/json",
                  dataType: 'jsonp',
                  success: function(json){
                           $("#nbAnnoncesAITLLibre").html(json.annonces.length);
                           htmlAnnoncesForAITLLibre = $("#"+aitlID+" .AnnoncesForAITLLibre .texte table tbody");
                           htmlAnnoncesForAITLLibre.html('');
                           jQuery.each(json.annonces, function(key, val){
                                    htmlAnnoncesForAITLLibre.append('<tr><td style="padding: 10px">'+val[0]+'</td><td style="padding: 10px">'+val[1]+'</td></tr>');
                                    htmlAnnoncesForAITLLibre.append('<tr><td colspan="2" style="text-align:left;border-bottom: 1px solid #9AD1E5;padding: 10px 0 5px;">'+val[2]+'</td></tr>');
                           });
                  }
         });
}

AITL.prototype.startSave = AITL.prototype.start;
AITL.prototype.start = function (a) {
         this.startSave(a);
         $("#"+this.id+" .principal .canaux_imperiaux .texte .paragraphe:last table:last tbody tr:last").after('<tr><td class="link couleur2 type1" onclick="engine.getCtl(this).showAnnoncesForAITLLibre();">La Plume Libre 2.0</td><td class="type3" id="nbAnnoncesAITLLibre">0</td></tr>');
         $("#"+this.id+" .deces").after('<div class="AnnoncesForAITLLibre" style="display:none;"><div class="titre">La Plume Libre 2.0</div><div class="texte" style="margin-top:5px;height:222px;left:12px;width:404px;"><table style="border-collapse:collapse;text-align:center;width:100%;"><tbody></tbody></table></div></div>');
         getAnnoncesForAITLLibre(this.id);
}

AITL.prototype.showAnnoncesForAITLLibre=function(){
         $("#"+this.id+" .principal").children().each(function(){
                  "AnnoncesForAITLLibre"!=$(this).attr("class")&&$(this).fadeOut()
         }),
         $("#"+this.id+" .actions .menu1, #"+this.id+" .actions .menu2, #"+this.id+" .actions .menu3").fadeOut(),
         $("#"+this.id+" .AnnoncesForAITLLibre").fadeIn();
         getAnnoncesForAITLLibre(this.id);
}