// ==UserScript==
// @name        VaultLabel
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     1.042
// @grant       none
// @description Ajouter des noms aux coffres en banque
// @downloadURL https://update.greasyfork.org/scripts/6927/VaultLabel.user.js
// @updateURL https://update.greasyfork.org/scripts/6927/VaultLabel.meta.js
// ==/UserScript==
authorizedBanks = undefined;
function addClickEventAddTag(node, i) {
  node.onclick = function () {
    var saisie = prompt('Saisissez un nom à associer à ce coffre :', 'Divers')
    if (saisie != null)
    {
      if (typeof localStorage != 'undefined') {
        localStorage.setItem('nomcoffre' + i, saisie);
        $('.stock' + i + ' .nom_item .couleur4').first().text(saisie);
      }
    }
  };
}

Achat_stock.prototype.changeMenuSave = Achat_stock.prototype.changeMenu;

Achat_stock.prototype.changeMenu = function (a, b) {
  this.changeMenuSave(a, b);
  refresh(this.type_entreprise);
}

function refresh(type_entreprise)
{
  if (type_entreprise == 2)
  {
    var lieu = $('#lieu_actuel .titre1').text();
    var auth = localStorage.getItem('SIF_VaultLabel');
    if(auth!=null && auth=="on") 
    {
      if ($.inArray(lieu, authorizedBanks) != - 1)
      {
        $("<span style='color:#D2C556;'>VaultLabel vous est proposé par SIF.</span>").insertBefore('#liste_stocks .sp');
        for (var i = 1; i <= 10; i++)
        {
          var t = document.createElement('div');
          t.id = 'nomcoffre_' + i;
          t.className = 'link';
          $('.stock' + i + ' .nom_item') [0].appendChild(t);
          $('#nomcoffre_' + i).text('+');
          $('#nomcoffre_' + i).css('position', 'absolute').css('left', '-10px').css('top', '0px').css('font-size', '10px').css('color', '#D2C556');
          addClickEventAddTag(t, i);
          if (typeof localStorage != 'undefined') {
            var nom = localStorage.getItem('nomcoffre' + i);
            if (nom != null)
            {
              $('.stock' + i + ' .nom_item .couleur4').first().text(nom);
              var img = $('.stock' + i + ' .item') [0];
              if (img != null)
              $(img).click({
                compteur: i,
                nom: nom
              }, changeName);
            }
          }
        }
      }
      else
      {
        $("<span style='color:red;'>Cette banque n'est pas équipée pour VaultLabel</span>").insertBefore('#liste_stocks .sp');
      }
    }
    else
      $("<span style='color:red;'>Vous n'êtes pas autorisé à utiliser VaultLabel. Récupérez la licence au 420 Rue Hoblet ou contactez Odul.</span>").insertBefore('#liste_stocks .sp');
  }
}

function changeName(e) {
  var idBox = $($('.stock' + e.data.compteur + ' .info_objet') [0]).attr('id_item');
  setTimeout(change, 1000, idBox, e.data.nom, 0);
};

function change(idBox, nom, compteur) {
  var coffre = $('#conteneur_' + idBox) [0];
  if (coffre == undefined && compteur < 10)
  setTimeout(change, 1000, idBox, nom, compteur + 1);
   else
  $('#conteneur_' + idBox + ' ' + '.titreConteneur').text(nom);
}

(function () {
  $.ajax({
    type: 'GET',
    url: 'https://docs.google.com/uc?export=download&id=0B4Igp0h82K3ycFNFOUtWQkR2eU0',
    async: false,
    jsonpCallback: 'jsonCallbackNames_0',
    contentType: 'application/json',
    dataType: 'jsonp',
    success: function (json) {
      authorizedBanks = json.banques;
    },
    error: function (e) {
      console.log(e.message);
    }
  });
}) ();
