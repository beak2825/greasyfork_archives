// ==UserScript==
// @name        AutoFurnitureLabel
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     1.01
// @grant       none
// @description Permet l'ajout d'annotations sur les meubles
// @downloadURL https://update.greasyfork.org/scripts/7716/AutoFurnitureLabel.user.js
// @updateURL https://update.greasyfork.org/scripts/7716/AutoFurnitureLabel.meta.js
// ==/UserScript==

function addClickEventAddTag(node, i, idd) {
  node.onclick = function () {
    var auth = localStorage.getItem('SIF_FurnitureLabel');
    if(auth!=null && auth=="on") 
    {
      var saisie = prompt('Saisissez une information à associer à ce meuble :', 'Merci SIF!')
      if (saisie != null)
      {
        if (typeof localStorage != 'undefined') {
          localStorage.setItem('infoMeuble_' + i, saisie);
          $('#'+idd+" .interieur p:first span:first").text(saisie);
        }
      }
    }
    else
      alert("Vous n'avez pas l'autorisation d'utiliser ce programme. Achetez une licence au 420 rue Hoblet ou contactez Odul.");
  };
}

idcourant = null;
Engine.prototype.updateBuildingInfos = function (typeInfo, idInfo, parent, action) {
    idcourant = idInfo;
    var engine = this;
    typeInfo || (typeInfo = 'default'),
    $.post('Building/Update/Information', {
      type: typeInfo,
      id: idInfo
    }, function (html) {
      if ($(html).hasClass('infoBoxFixed')) {
        var id = $(html).attr('id');
        $('#' + id).length || engine.displayInfoBox(html, parent),
        isset(action) && action !== !0 && (action = '$(\'#' + id + '\')' + action, eval(action))
      } else $(html).hasClass('dataBox') ? engine.displayDataBox(html)  : 'default' == typeInfo ? engine.displayMapInfo('default')  : engine.displayMapInfo(html, !1, !0, typeInfo);

      var idd = $(html).attr('id');
      $('#'+idd+" .interieur p:first").html("<span>"+$('#'+idd+" .interieur p:first").html()+"</span>");

      var t = document.createElement('div');
      t.id = 'plus_meuble' + idcourant;
      t.className = 'link';
      $('#'+idd+" .interieur p:first")[0].appendChild(t);
      $('#plus_meuble' + idcourant).text('+');
      $('#plus_meuble' + idcourant).css('position', 'absolute').css('left', '-8px').css('top', '0px').css('font-size', '12px').css('color', 'red');
      addClickEventAddTag(t, idcourant, idd);
      
      var textDescription = localStorage.getItem("infoMeuble_"+idcourant);
      if(textDescription!=null) {
        $('#'+idd+" .interieur p:first span:first").text(textDescription);
      }
      
      var auth = localStorage.getItem('SIF_FurnitureLabel');
      if(auth==null && auth=="on") 
        $('#'+idd+" .interieur p:first span:first").text("Vous n'avez pas l'autorisation d'utiliser ce programme. Achetez une licence au 420 rue Hoblet ou contactez Odul.");

    });
}
