// ==UserScript==
// @name        FWItems
// @namespace   InGame
// @include     https://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     0.182
// @grant       none
// @author      Odul
// @description Voir des silhouettes personnalisées ainsi que des objets customs. 0.17 suppression d'un bug par le vide : perte de la fonctionnalité de voir les skins pour les objets dans les meubles, ça viendra dès que j'ai le temps
// @downloadURL https://update.greasyfork.org/scripts/9967/FWItems.user.js
// @updateURL https://update.greasyfork.org/scripts/9967/FWItems.meta.js
// ==/UserScript==

var silhouettesId = new Array();
var silhouettesNom = new Array();

var itemsImg = new Array();
var itemsImgGrand = new Array();
var itemsNomsBase = new Array();
var itemsNoms = new Array();
var itemsDesc = new Array();

var eqNoms = new Array();
var copies = new Array();

function initItems()
{
   $('.case_objet').each(function () {
       var idItem = $(this).find('.infoBox_content div').last().text().substring(2);
       if(idItem != "")
       {
           if(copies[idItem])
               idItem = copies[idItem];
         if(itemsImg[idItem])
           $(this).find('img').last().attr('src','http://bit.ly/'+itemsImg[idItem]);
         if(itemsImgGrand[idItem])
           $(this).find('.conteneur_image img').attr('src','http://bit.ly/'+itemsImgGrand[idItem]);
         if(itemsNoms[idItem] && eqNoms[itemsNomsBase[idItem]] && $(this).find('.infoBox_content .titreinfo').text().indexOf(itemsNoms[idItem])==-1)
           $(this).find('.infoBox_content .titreinfo').text(itemsNoms[idItem]+$(this).find('.infoBox_content .titreinfo').text().substring(eqNoms[itemsNomsBase[idItem]].length));
         if(itemsDesc[idItem])
           $(this).find('.infoBox_content .description').text(itemsDesc[idItem]);
      }   
   });
}

MenuInventaire.prototype.checkDeplacement = function(idDest) {
    var inventaire = this,
        currentDrag = this.currentDrag;
    if (currentDrag) {
        var idInit = currentDrag.parent().attr("id");
        if (idInit == idDest) $("#" + idInit + " .item").css({
            left: this.initPos.x,
            top: this.initPos.y
        });
        else if ("poubelleInventaire" == idDest) engine.validation("Voulez-vous vraiment jeter cet objet ?", "nav.getInventaire().deleteObjet('" + idInit + "', '" + currentDrag.attr("id") + "', '" + inventaire.initPos.x + "', '" + inventaire.initPos.y + "');", "$('#" + idInit + " .item').css({left: '" + this.initPos.x + "', top: '" + this.initPos.y + "'});");
        else if ("ciseauxInventaire" == idDest) this.diviseObjets();
        else if ("window_chat" == idDest) {
            var id_objet = currentDrag.attr("id").replace(/([0-9]+)_[0-9]+/g, "$1"),
                nom_objet = currentDrag.parent().find(".titreinfo").text();
            "Votre message..." == $("#" + idDest).find("input").val() ? $("#" + idDest).find("input").val("[objet_" + id_objet + "_" + nom_objet + "]").css("color", "black") : $("#" + idDest).find("input").val($("#" + idDest).find("input").val() + "[objet_" + id_objet + "_" + nom_objet + "]"), currentDrag.css({
                left: this.initPos.x,
                top: this.initPos.y
            })
        } else if ("customisation_0_1" == idDest) {
            if ($("#" + idInit).parents(".dataBox").length) return engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1;
            if (!$("#" + idInit + " .infoBox .technoinfo").length) return engine.displayLightInfo("Cet objet ne peut pas Ãªtre amÃ©liorÃ©."), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1;
            $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), reg = new RegExp("([0-9]*)_([34])", "g");
            var tav;
            (tab = $("#" + idInit + " .item").attr("id").split(reg)) && (3 == tab[2] ? $("#" + tab[1] + "_4").length && $("#" + tab[1] + "_4").addClass("objet_flou").draggable("disable").parent().addClass("gris") : $("#" + tab[1] + "_3").length && $("#" + tab[1] + "_3").addClass("objet_flou").draggable("disable").parent().addClass("gris")), engine.getCtlById("db_customisation").placeItem(currentDrag)
        } else if ("reparation_0_1" == idDest) {
            if ($("#" + idInit).parents(".dataBox").length) return engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1;
            if (!$("#" + idInit + " .infoBox .durabiliteinfo").length) return engine.displayLightInfo("Cet objet ne peut pas Ãªtre rÃ©parÃ©."), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1;
            $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), reg = new RegExp("([0-9]*)_([34])", "g");
            var tav;
            (tab = $("#" + idInit + " .item").attr("id").split(reg)) && (3 == tab[2] ? $("#" + tab[1] + "_4").length && $("#" + tab[1] + "_4").addClass("objet_flou").draggable("disable").parent().addClass("gris") : $("#" + tab[1] + "_3").length && $("#" + tab[1] + "_3").addClass("objet_flou").draggable("disable").parent().addClass("gris"));
            var idDB = $("#" + idDest).parents(".dataBox").attr("id");
            engine.getCtlById(idDB).placeItem(currentDrag, idInit)
        } else if (test = idDest.match(/meuble_[0-9]+/)) {
            $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            });
            var infos = $("#" + idInit + " .item").attr("id").split(/_/g);
            $.post("Item/Clean/Neuvopack", {
                id_objet: infos[0]
            }, function(a) {
                if (xml_result(a, 8)) {
                    var b = $(a).find("id_item").xml();
                    $(".contenance_appareil_" + b).html("0"), engine.useAjaxReturn(a)
                }
            })
        } else {
            var reg = new RegExp("echange_.*", "g");
            if (idDest.match(reg)) {
                $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), reg = new RegExp("([0-9]*)_([34])", "g");
                var tab;
                (tab = $("#" + idInit + " .item").attr("id").split(reg)) && (3 == tab[2] ? $("#" + tab[1] + "_4").length && $("#" + tab[1] + "_4").addClass("objet_flou").draggable("disable").parent().addClass("gris") : $("#" + tab[1] + "_3").length && $("#" + tab[1] + "_3").addClass("objet_flou").draggable("disable").parent().addClass("gris"))
            }
            var defered = null;
            if ($("#" + idDest).parent(".meuble_inventaire").length) {
                var action = $("#" + idDest).parent(".meuble_inventaire").attr("data-action-meuble");
                if (26 == action) {
                    var defered = $.Deferred(),
                        nom_objet = currentDrag.parent().find(".titreinfo").text(),
                        actions = {
                            valider: function() {
                                defered.resolve()
                            },
                            annuler: function() {
                                defered.reject()
                            }
                        },
                        formulaire = [{
                            type: "text",
                            id: "centrale_vente_prix",
                            label: "Prix",
                            postlabel: "Cr",
                            direction: "right",
                            value: 0
                        }];
                    if (idInit.match(/^meubleInventaire/g)) defered.reject();
                    else {
                        var lb = new LightBox(idDest, 1, "Mise en vente d'un objet", 'Vous allez mettre en vente l\'objet <span class="couleur4">' + nom_objet + "</span>.<br />Remplissez le formulaire ci-dessous :", actions, formulaire);
                        lb.display()
                    }
                }
            }
            var effectue_deplacement = function(custom_data) {
                $.post("./Item/Move", {
                    item: idInit + "_" + currentDrag.attr("id"),
                    box: idDest,
                    custom_data: custom_data
                }, function(xml) {
                    if (xml_result(xml)) {
                        inventaire.binding[idInit] = !1, inventaire.binding[idDest] = !1, currentDrag.parents(".case_objet").removeClass("active"), currentDrag.parent().find(".typeinfo").text().match("Deck") && engine.closeDataBox("db_deck_" + currentDrag.parent().find(".info_objet").attr("id_item")), $(xml).find("callback").length && eval($(xml).find("callback").xml()), $(xml).find("reload").length && nav.getTravail().updateItemsToSell(), $(xml).find("achat").length && (currentDrag.parent().replaceWith($(xml).find("caseEntreprise").xml()), $("#zone_cases_achat .case_objet_vide_type_inv_vide").droppable() && $("#zone_cases_achat .case_objet_vide_type_inv_vide").droppable("destroy"), $("#zone_cases_achat .case_objet_vide_type_inv_vide").droppable({
                            accept: ".objet_stock",
                            activeClass: "case_main_hover",
                            hoverClass: "case_main_drop",
                            drop: function() {
                                nav.getTravail().mise_en_vente($(this).attr("id"))
                            }
                        }), $("#contenance_item_" + $(xml).find("idIBConteneur").xml()).html(parseInt($("#contenance_item_" + $(xml).find("idIBConteneur").xml()).html()) + 1)), $(xml).find("pilules").length && Interface.setPilules($(xml).find("pilules").xml()), engine.useAjaxReturn(xml);
                        var ctl = engine.getCtlById("db_combat");
                        if (ctl && ctl.checkAttaqueDistance(3), $(xml).find("case_objet").length) {
                            var tmp;
                            $(xml).find("case_objet").each(function() {
                                tmp = $(this).attr("id").split(/^numConteneur_([0-9]+)_([\-0-9]+)$/), tmp2 = $(this).attr("id").split(/^quantiteObjet_([0-9]+)_([0-9]+)$/), tmp.length > 1 ? $("#contenance_item_" + tmp[1]).html(parseInt($("#contenance_item_" + tmp[1]).html()) + parseInt(tmp[2])) : tmp2.length > 1 ? $(".quantite_" + tmp2[1]).html("x" + tmp2[2]) : inventaire.updateCaseObjet($(this))
                            })
                        }
                    } else $("#" + idInit + " .item").css({
                        left: inventaire.initPos.x,
                        top: inventaire.initPos.y
                    });
                   ///// modif ici
                 //  var idItem = currentDrag.attr("id").substring(0,currentDrag.attr("id").indexOf('_'));
                  //if(itemsImg[idItem])
                  //{
                    //$('#ib_itemBox_'+idItem).parent().find('img').last().attr('src','http://bit.ly/'+itemsImg[idItem]);
                    //$('#ib_itemBox_'+idItem).parent().find('.conteneur_image img').attr('src','http://bit.ly/'+itemsImg[idItem]);
                  //}
                  //if(itemsNoms[idItem])
//                    $(this).find('.infoBox_content .titreinfo').text(itemsNoms[idItem]+$(this).find('.infoBox_content .titreinfo').text().substring(eqNoms[itemsNomsBase[idItem]].length));
//                  if(itemsDesc[idItem])
//                    $(this).find('.infoBox_content .description').text(itemsDesc[idItem]);
                    initItems();
                });
            };
            isset(defered) ? defered.then(function() {
                effectue_deplacement.call(inventaire, lb.formData())
            }, function() {
                $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                })
            }) : effectue_deplacement.call()
        }
    }
}

function loadArray()
{
     $.ajax({
               type: 'GET',
               url: "https://docs.google.com/uc?export=download&id=0ByK4ISi_fO8uUFRjRnh1RWhILVU",
               async: true,
               jsonpCallback: 'jsonCallbackSilouhette0',
               contentType: "application/json",
               dataType: 'jsonp',
               success: function(json) {
                  for (var i=0 ; i < json.personnage.length ; i++)
                  {
                     silhouettesId[json.personnage[i][0]] = json.personnage[i][1];
                      if(json.personnage[i].length >= 3)
                          silhouettesNom[(json.personnage[i][2]).toLowerCase()] = json.personnage[i][1];
                  }
                   
                   var pseudo = $("#txt_pseudo").text().toLowerCase();
                   if(silhouettesNom[pseudo])
                      $('.personnage_image').css('background-image','url(http://bit.ly/'+silhouettesNom[pseudo]+')').css('background-position','0px 0px');
               },
                error: function(e) {
                   console.log(e.message);
                }
           });
  
  
       $.ajax({
               type: 'GET',
               url: "https://docs.google.com/uc?export=download&id=0B5SS13RZj6nZdUJCWnFOeHNsQXc",
               async: false,
               jsonpCallback: 'jsonCallbackItems0',
               contentType: "application/json",
               dataType: 'jsonp',
               success: function(json) {
                  for (var i=0 ; i < json.items.length ; i++)
                  {
                     itemsImg[json.items[i][0]] = json.items[i][1][0][0];
                     if(json.items[i][1][0].length > 1)
                         itemsImgGrand[json.items[i][0]] = json.items[i][1][0][1];
                      else
                         itemsImgGrand[json.items[i][0]] = json.items[i][1][0][0];

                     itemsNomsBase[json.items[i][0]] = json.items[i][1][1];
                     itemsNoms[json.items[i][0]] = json.items[i][1][2];
                     itemsDesc[json.items[i][0]] = json.items[i][1][3];
                  }
                   
                   eqNoms = json.eq;
                   
                for (var i=0 ; i < json.copies.length ; i++)
                   copies[json.copies[i][0]] = json.copies[i][1];
                   
                  initItems();
               },
                error: function(e) {
                   console.log(e.message);
                }
           });
}

 MenuInventaire.prototype.activeObjet = function(idObj) {
    if (this.binding[idObj] && $("#" + this.binding[idObj]).length) return $("#" + this.binding[idObj]).remove(), !0;
    var thecase;
    $(".case_objet").each(function() {
        $(this).find("#" + idObj).length && ($(this).find(".objetLoader").show(), thecase = $(this).attr("id"))
    }), $("#infoBox").hide(), clearTimeout($("#" + idObj).parent().data("timeout"));
    var inventaire = this,
        url = "Item/Activate",
        id_personnage = 0;
    (id_personnage = $("#" + idObj).parents(".conteneur").attr("alt")) && (url = "Interface/Steal/Item", engine.closeDataBox("db_steal_" + id_personnage)), $.post("./" + url, {
        id: idObj,
        id_personnage: id_personnage
    }, function(xml) {
        if ($("#" + thecase + " .objetLoader").hide(), engine.useAjaxReturn(xml), xml_result(xml))
            if ($(xml).find("content").length) {
                var html = $(xml).find("content").xml();
                if ($(html).hasClass("conteneur")) {
                    var id = $(html).attr("id"),
                        idPerso = $(html).attr("alt");
                    inventaire.binding[idObj] = id;
                    var mon_inventaire = !isset(idPerso);
                    idPerso = idPerso ? ".perso_" + idPerso + " " : "", $(".zone_conteneurs_displayed" + idPerso).find("#" + id).length ? $(".zone_conteneurs_displayed" + idPerso).find("#" + id).remove() : ("none" == $("#zone_inventaire").css("display") && mon_inventaire && nav.ouvre_menu("inventaire"), mon_inventaire ? $("#zone_conteneurs_displayed").append(html) : $(".zone_conteneurs_displayed" + idPerso).append(html), $("#" + id).hide().css({
                        left: "50%",
                        marginLeft: -$("#" + id).width() / 2 + 105 - (mon_inventaire ? 0 : 20) + "px",
                        top: $("#main_fight").length ? 20 : -$("#" + id).height() + "px"
                    }).fadeIn("fast"), $(".zone_conteneurs_displayed" + idPerso + " .conteneur").draggable({
                        cancel: ".case_objet"
                    }), $("#" + id + " .case_objet").each(function() {
                        inventaire.updateEffectsCaseObjet($(this), null, !0, mon_inventaire);
                         ///modif ici
                         var idItem = $(this).find('.infoBox_content div').last().text().substring(2);
                         if(idItem != "")
                         {
                             if(copies[idItem])
                              idItem = copies[idItem];
                            if(itemsImg[idItem])
                              $(this).find('img').last().attr('src','http://bit.ly/'+itemsImg[idItem]);
                            if(itemsImgGrand[idItem])
                              $(this).find('.conteneur_image img').attr('src','http://bit.ly/'+itemsImgGrand[idItem]);
                           if(itemsNoms[idItem] && eqNoms[itemsNomsBase[idItem]] && $(this).find('.infoBox_content .titreinfo').text().indexOf(itemsNoms[idItem])==-1)
                              $(this).find('.infoBox_content .titreinfo').text(itemsNoms[idItem]+$(this).find('.infoBox_content .titreinfo').text().substring(eqNoms[itemsNomsBase[idItem]].length));
                           if(itemsDesc[idItem])
                             $(this).find('.infoBox_content .description').text(itemsDesc[idItem]);                             
                         }
                    }))
                } else if ($(html).hasClass("dataBox")) {
                    if (engine.displayDataBox(html) === !1) return !1;
                    var id = $(html).attr("id");
                    preload(id), ("db_map_1" == id || "db_map_2" == id) && evolution.unlock(5), $(xml).find("content").attr("update") && $("#" + id + " " + $(xml).find("content").attr("update")).load($(xml).find("content").attr("url")), $(xml).find("content").attr("controller") && engine.setCtl(id, eval("new " + $(xml).find("content").attr("controller") + "()"))
                }
            } else if ($(xml).find("case_objet").length) {
            var tmp;
            $(xml).find("case_objet").each(function() {
                tmp = $(this).attr("id").split(/^numConteneur_([0-9]+)_([\-0-9]+)$/), tmp2 = $(this).attr("id").split(/^chargeurArme_([0-9]+)_([0-9]+)$/), tmp3 = $(this).attr("id").split(/^quantiteObjet_([0-9]+)_([0-9]+)$/), tmp.length > 1 ? $("#contenance_item_" + tmp[1]).html(parseInt($("#contenance_item_" + tmp[1]).html()) + parseInt(tmp[2])) : tmp2.length > 1 ? $(".balles_munitions_" + tmp2[1]).html(tmp2[2]) : tmp3.length > 1 ? $(".quantite_" + tmp3[1]).html("x" + tmp3[2]) : inventaire.updateCaseObjet($(this)), $("#" + $(this).attr("id")).hasClass("linkBox_vide") && $("#" + $(this).attr("id")).removeClass("active");
            }), $(".active").each(function() {
                $(this).find("#" + idObj).length && $(this).removeClass("active")
            })
        } else $(xml).find("switch").length && $(".item_" + $(xml).find("switch").xml() + "_switch").toggleClass("hidden");
        else $(".active").each(function() {
            $(this).find("#" + idObj).length && $(this).removeClass("active")
        })
    })
}
 
 Engine.prototype.displayDataBox = function(html, update) {
    var id = $(html).attr("id");
    if (!update && $("#" + id).length) return engine.closeDataBox(id), !1;
    if ($(html).toggleClass("focused"), update) $("#" + id + " .content").html($(html).children(".content").xml());
    else {
        $("#zone_dataBox").prepend(html), $("#" + id).hide();
        var max_zindex = 0,
            zindex;
        $("#zone_dataBox .dataBox").each(function() {
            zindex = parseInt($(this).css("z-index")), max_zindex = zindex > max_zindex ? zindex : max_zindex
        }), zindex = max_zindex + 1
    }
    $(".dataBox").removeClass("focused"), zindex && $("#zone_dataBox .dataBox:first").addClass("focused").css("z-index", zindex);
    var id = $("#zone_dataBox .dataBox:first").attr("id");
    $("#" + id + " .head .reduce").length && $("#" + id).draggable({
        handle: ".head"
    }), engine.activeForm(id), engine.updateToolTip("#" + id + " .content .info1, #" + id + " .content .link_info1"), engine.updateToolTip("#" + id + " .content .info2, #" + id + " .content .link_info2", 2), engine.updateToolTip("#" + id + " .content .infoAide", "aide", .3), engine.activeLinkBox("#" + id + " .content"), $(html).attr("controller") && engine.setCtl(id, eval("new " + $(html).attr("controller") + "()")), update ? (engine.activeScrollPane(id), (ctl = engine.getCtlById(id)) && ctl.update()) : $("#" + id).fadeIn("fast", function() {
        $("#" + id).trigger("displayed"), $("#" + id).attr("onOpen") && eval($("#" + id).attr("onOpen")), engine.activeScrollPane($(this).attr("id"))
    })
    
   if($(html).attr('id').indexOf('db_fouille_meuble_')==0)
   {
       $("#"+$(html).attr('id')+" .case_objet").each(function() {
           var idItem = $(this).find('.infoBox_content div').last().text().substring(2);
           if(idItem != "")
           {
              if(copies[idItem])
                 idItem = copies[idItem];
              if(itemsImg[idItem])
                $(this).find('img').last().attr('src','http://bit.ly/'+itemsImg[idItem]);
              if(itemsImgGrand[idItem])
                $(this).find('.conteneur_image img').attr('src','http://bit.ly/'+itemsImgGrand[idItem]);
              if(itemsNoms[idItem] && eqNoms[itemsNomsBase[idItem]] && $(this).find('.infoBox_content .titreinfo').text().indexOf(itemsNoms[idItem])==-1)
                 $(this).find('.infoBox_content .titreinfo').text(itemsNoms[idItem]+$(this).find('.infoBox_content .titreinfo').text().substring(eqNoms[itemsNomsBase[idItem]].length));
              if(itemsDesc[idItem])
                 $(this).find('.infoBox_content .description').text(itemsDesc[idItem]);
              }
      });
   }
}
 
 

Engine.prototype.openPersoBox = function (a, b) {
    var c = this;
    return $("#zone_infoBoxFixed #ib_persoBox_" + a).length ? ($("#zone_infoBoxFixed #ib_persoBox_" + a).remove(), !0) : void $.post("./Main/FixedBox/PersoBox", {
        id: a
    }, function (d) {
        if ("ERROR1" != d) {
                   $("#zone_infoBoxFixed").prepend(d);
               
                    var e = nav.getInventaire();
                    $("#zone_infoBoxFixed #ib_persoBox_" + a + " .case_objet").each(function () {
                        
                        e.updateEffectsCaseObjet($(this));
                          var idItem = $(this).find('.infoBox_content div').last().text().substring(2);
           if(idItem != "")
           {
              if(copies[idItem])
                idItem = copies[idItem];
              if(itemsImg[idItem])
                $(this).find('img').last().attr('src','http://bit.ly/'+itemsImg[idItem]);
              if(itemsImgGrand[idItem])
                $(this).find('.conteneur_image img').attr('src','http://bit.ly/'+itemsImgGrand[idItem]);
              if(itemsNoms[idItem] && eqNoms[itemsNomsBase[idItem]] && $(this).find('.infoBox_content .titreinfo').text().indexOf(itemsNoms[idItem])==-1)
                 $(this).find('.infoBox_content .titreinfo').text(itemsNoms[idItem]+$(this).find('.infoBox_content .titreinfo').text().substring(eqNoms[itemsNomsBase[idItem]].length));
              if(itemsDesc[idItem])
                 $(this).find('.infoBox_content .description').text(itemsDesc[idItem]);
              }
                    });
                    $("#zone_infoBoxFixed #ib_persoBox_" + a).hide().fadeIn("fast").draggable(), setOnTop("#zone_infoBoxFixed #ib_persoBox_" + a, "infoBoxFixed"), $("#zone_infoBoxFixed #ib_persoBox_" + a).click(function () {
                        $(this).hasClass("onTop") || setOnTop(this, "infoBoxFixed")
                    }), centrageBox(b, "#zone_infoBoxFixed #ib_persoBox_" + a, 30, 15), c.updateToolTip(".info1, .link_info1"), c.updateToolTip(".info2, .link_info2", 2);
                    var f = parseFloat($("#stat_6_entier").text() + $("#stat_6_decimal").text());
                    0 == f && $("#ib_persoBox_" + a + " .interaction_3").addClass("np").attr("onClick", "");
                   
                    if(silhouettesId[a])
                         $("#zone_infoBoxFixed #ib_persoBox_" + a +" .personnage_image").css('background-image','url(http://bit.ly/'+silhouettesId[a]+')').css('background-position','0px 0px');
       }
    })
}


$(document).ready(function() {
   $.ajaxSetup({async: false});
   loadArray();
   $.ajaxSetup({async: true});
})();

