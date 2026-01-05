// ==UserScript==
// @name        AméliorationAITL
// @namespace InGame
// @author Odul
// @date 30/04/2015
// @version 0.081
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Des ajouts sur l'aitl
// @downloadURL https://update.greasyfork.org/scripts/9595/Am%C3%A9liorationAITL.user.js
// @updateURL https://update.greasyfork.org/scripts/9595/Am%C3%A9liorationAITL.meta.js
// ==/UserScript==

topcat = undefined;
bottomcat = undefined;
annulation = {};
stared = {};


(function () {
  annulation = JSON.parse(localStorage.getItem("annulation"));
    if(annulation == null)
        annulation ={};
  for(var idannul in annulation) {
    if((new Date().getTime()) - annulation[idannul] > 1000*60*60*24*3)
      delete annulation[idannul];
  }
  
   stared = JSON.parse(localStorage.getItem("aitlStared"));
    if(stared == null)
      stared ={};

  localStorage.setItem("annulation", JSON.stringify(annulation));

  $.ajax({
    type: 'GET',
    url: 'http://docs.google.com/uc?export=download&id=0B5SS13RZj6nZSEZvazVJMjRuaDg',
    async: false,
    jsonpCallback: 'jsonCallbackAitl_0',
    contentType: 'application/json',
    dataType: 'jsonp',
    success: function (json) {
      topcat = json.top;
      bottomcat = json.bottom;
    },
    error: function (e) {
      console.log(e.message);
    }
  });
}) ();


 AITL.prototype.showAnnonce = function(a) {
        var b = this.id;
        $.post("ItemAITL/Annonce/Get", {
            id: a
        }, function(a) {
          
          var nom = $(a).find("enteteAnnonce").xml();
          nom = nom.substring(nom.indexOf("de")+3);
          var entete = $(a).find("enteteAnnonce").xml();
          
          var texta = $(a).find("texteAnnonce").xml();
          var triggetaitlcatstate = localStorage.getItem('triggerAitlCat');
          var tmpTrigger = document.getElementById("triggerAitlCat");
          if(triggetaitlcatstate ==null || triggetaitlcatstate =="on")
          {
              entete += "<img src='http://i2.cdscdn.com/pdt2/9/7/4/1/700x700/auc0757979521974/rw/tampon-etoile-psx.jpg' style='width:11px;margin-left:3px;' class='stareannonce link'>";
              if(stared.hasOwnProperty(nom))
                entete = $(a).find("enteteAnnonce").xml()+"<img src='http://zupimages.net/up/15/19/gd0o.jpg' style='width:11px;margin-left:3px;' class='stareannonce link'>";

              while(texta.indexOf("[lien=") != -1)
              {
                 var indexof = texta.indexOf("[lien=");
                 var avant = texta.substring(0,indexof);
                 var tmp = texta.substring(indexof+6);
                 indexof = tmp.indexOf("]");
                 var lien = tmp.substring(0,indexof);
                 tmp = tmp.substring(indexof+1);
                 indexof = tmp.indexOf("[/lien]");
                 var apres = tmp.substring(indexof+7);
                 var textlien = tmp.substring(0,indexof);
                 texta = avant+"<a href='"+lien+"' target='_blank'>"+textlien+"</a>"+apres;
              }

              while(texta.indexOf("[youtube=") != -1)
              {
                 var indexof = texta.indexOf("[youtube=");
                 var avant = texta.substring(0,indexof);
                 var tmp = texta.substring(indexof+9);
                 indexof = tmp.indexOf("]");
                 var lien = tmp.substring(0,indexof);
                 var apres = tmp.substring(indexof+1);
                 texta = avant+'<iframe src="https://www.youtube.com/embed/'+lien+'?rel=0&amp;autoplay=0&amp;loop=1" style="width: 375px; height: 215px;"></iframe>'+apres;
              }

              while(texta.indexOf("[taille=") != -1)
              {
                 var indexof = texta.indexOf("[taille=");
                 var avant = texta.substring(0,indexof);
                 var tmp = texta.substring(indexof+8);
                 indexof = tmp.indexOf("]");
                 var taille = tmp.substring(0,indexof);
                 tmp = tmp.substring(indexof+1);
                 indexof = tmp.indexOf("[/taille]");
                 var apres = tmp.substring(indexof+9);
                 var texttaille = tmp.substring(0,indexof);
                 var tailleint = 10+parseInt(taille);
                  texta = avant+"<span style='font-size:"+tailleint+"px;'>"+texttaille+"</span>"+apres;
            }
         }
        $("#" + b + " .principal").children().each(function() {
                "annonce" != $(this).attr("class") && $(this).fadeOut()
            });
          
            $("#" + b + " .actions .menu1, #" + b + " .actions .menu2").fadeOut(), $("#" + b + " .annonce").fadeIn(), $("#" + b + " .annonce .titre span:first").html(entete), $("#" + b + " .annonce .titre span:last").html($(a).find("titreAnnonce").xml()), $("#" + b + " .annonce .texte span:first").html(texta), $("#" + b + " .annonce .texte span:last").unbind("click"), $("#" + b + " .annonce .texte span:last").click(function() {
                $(a).find("auteurAnnonce").xml() ? nav.getMessagerie().newMessage($(a).find("auteurAnnonce").xml()) : engine.displayLightInfo("Auteur inconnu")
            });
          
            $(".stareannonce")[0].onclick = function(){  
              if($(this).attr("src") == "http://zupimages.net/up/15/19/gd0o.jpg")
              {
                 delete stared[nom]; 
                 localStorage.setItem("aitlStared", JSON.stringify(stared)); 
                 $(this).attr("src", "http://i2.cdscdn.com/pdt2/9/7/4/1/700x700/auc0757979521974/rw/tampon-etoile-psx.jpg");
              }
              else
              {
                 stared[nom] = "ll";
                 localStorage.setItem("aitlStared", JSON.stringify(stared)); 
                 $(this).attr("src", "http://zupimages.net/up/15/19/gd0o.jpg"); 
              }
           };
        });
}

 
AITL.prototype.showPetitesAnnonces = function() {
        var aitl =this;
        $("#" + this.id + " .principal").children().each(function() {
            "petites_annonces" != $(this).attr("class") && $(this).fadeOut()
        }), $("#" + this.id + " .actions .menu1, #" + this.id + " .actions .menu2").fadeOut(), $("#" + this.id + " .actions .menu3").fadeIn(), $("#" + this.id + " .petites_annonces").fadeIn();
        var a = this.id;
        $.get("ItemAITL/Annonce/Find", function(b) {
          var triggetaitlcatstate = localStorage.getItem('triggerAitlCat');
          var tmpTrigger = document.getElementById("triggerAitlCat");
          if(tmpTrigger != null)
            tmpTrigger.parentElement.removeChild(tmpTrigger);
          if(triggetaitlcatstate ==null || triggetaitlcatstate =="on")
          {
              var warning = '<table style="text-align:center;width:100%;color:red;border-bottom:4px solid rgb(154, 209, 229);">';
              var top = '<table style="text-align:center;width:100%;color:#AF5D00;border-bottom:4px solid rgb(154, 209, 229);">';
              var sponso = '<table style="text-align:center;width:100%;color:#40A46A;border-bottom:4px solid rgb(154, 209, 229);">';
              var body = '<table style="text-align:center;width:100%;border-bottom:4px solid rgb(154, 209, 229);">';
              var bottom = '<table style="text-align:center;width:100%;color:grey;">';

              var nodes = $(b).find('tr');
              for (var i = 0; i < nodes.length; ++i) {
                 var node = nodes[i].innerHTML;
                 var id = node.substring(node.indexOf("showAnnonce(")+12);
                 id = id.substring(0,id.indexOf(")"));
                 var nom = node.substring(node.indexOf("<td>")+4);
                 nom = nom.substring(0,nom.indexOf("</td>"));

                 if(stared.hasOwnProperty(nom))
                 {
                    var nomstared = "<img src='http://zupimages.net/up/15/19/gd0o.jpg' style='width:13px;margin-right:4px;' class='staredaitl link staredaitl"+nom+"'>"+nom;
                    var apres = node.substring(node.indexOf("</td>")+5);
                    node = "<td>"+nomstared+"</td>"+apres;
                 }
                
                if ($.inArray(id, bottomcat) != -1 || $.inArray(nom, bottomcat) != -1)
                    bottom += "<tr>"+node+"</tr>";
                else if(node.indexOf("Ø") != -1 && !annulation.hasOwnProperty(id)){
                    warning += "<tr><td class='topaitl link couleur2' style='font-size:6px;width: 3%;'>x<span style='display:none'>"+id+"</span></td>"+node+"</tr>";console.log(id);}
                else if(node.indexOf("$") != -1)
                   body += '<tr style="color:#40A46A;">'+node+"</tr>";
                else
                {
                 if ($.inArray(id, topcat) != -1 && !annulation.hasOwnProperty(id))
                   top += "<tr><td class='topaitl link couleur2' style='font-size:6px;width: 3%;'>x<span style='display:none'>"+id+"</span></td>"+node+"</tr>";
                 else 
                    body += "<tr>"+node+"</tr>";
                }
              }
              warning += '</table>';      
              top += '</table>';     
              sponso += '</table>'; 
              body += '</table>';          
              bottom += '</table>';          
              $("#" + a + " .petites_annonces .texte").html(warning + top + sponso + body + bottom);
            
            
              var divTrigger = document.createElement('div');
              divTrigger.id = "triggerAitlCat";
              $(".aitl .actions")[0].appendChild(divTrigger);
              divTrigger.className="menu2";
              $("#triggerAitlCat").text("Script On");
              divTrigger.onclick = function(){
                 localStorage.setItem("triggerAitlCat", 'off');  
                 $("#triggerAitlCat").css('font-size','9px').text("Redémarres ton aitl ou va au menu pour prise en compte");
              };
            
              $(".topaitl").each(function(){
                this.onclick = function(){  
                  annulation[$(this).text().substring(1)] = new Date().getTime();
                  localStorage.setItem("annulation", JSON.stringify(annulation));
                  $(this).css("font-size","10px").text('OK');
                  this.className = "";
                };
              });
            
            $(".staredaitl").each(function(){
                this.onclick = function(){  
                  delete stared[$(this).parent().text()];
                  localStorage.setItem("aitlStared", JSON.stringify(stared));
                    $(".staredaitl"+$(this).parent().text()).each(function(){
                        $(this).css("display","none");
                        this.className = "";
                    });
                };
              });
          }
          else
          {
             $("#" + a + " .petites_annonces .texte").html(b);
            if(triggetaitlcatstate !=null && triggetaitlcatstate =="off")
            { 
              var divTrigger = document.createElement('div');
              divTrigger.id = "triggerAitlCat";
              $(".aitl .actions")[0].appendChild(divTrigger);
              divTrigger.className="menu2";
              $("#triggerAitlCat").text("Script Off");
              divTrigger.onclick = function(){
                 localStorage.setItem("triggerAitlCat", 'on');  
                 $("#triggerAitlCat").css('font-size','9px').text("Redémarres ton aitl ou va au menu pour prise en compte");
              };
            }
          }
        })
}


AITL.prototype.start = function(a) {
        this.id = a, $("#" + a).draggable() && $("#" + a).draggable("destroy"), $("#" + a).draggable({
            handle: "#" + a + "_contenu",
            cancel: ".titre, .texte, form"
        });
        
        $($("#"+a+" .canaux_imperiaux .titre")[0]).css('margin-top','10px').html("AITL <i><span style='font-size:9px;'></br>par SIF</span></i>");
//        $($("#"+a+" .canaux_imperiaux .paragraphe")[0]).
        ($("#"+a+" .canaux_imperiaux .paragraphe")[0]).parentElement.removeChild($("#"+a+" .canaux_imperiaux .paragraphe")[0]);
        ($("#"+a+" .canaux_imperiaux .paragraphe")[0]).parentElement.removeChild($("#"+a+" .canaux_imperiaux .paragraphe")[0]);
        ($("#"+a+" .canaux_imperiaux .paragraphe")[0]).parentElement.removeChild($("#"+a+" .canaux_imperiaux .paragraphe")[0]);
        $("#"+a+" .canaux_imperiaux .paragraphe").css("margin-top","-3px");

         ($("#"+a+" .canaux_imperiaux .paragraphe tr")[0]).parentElement.removeChild($("#"+a+" .canaux_imperiaux .paragraphe tr")[0]);
         $("#"+a+" .canaux_imperiaux .texte").html($("#"+a+" .canaux_imperiaux .texte").html()+ '<div class="paragraph" style="margin-top:15px;"><iframe style="border:0px; width:120px; height:100px;" frameborder="0" scrolling="no" src="http://radionomy.letoptop.fr/player/?radiouid=977de491-c18b-46b9-a665-9c40bf24ff6a&color=000000&bgcolor=FFFFFF&width=120&size=8&font=Arial&autoplay=false"> Votre navigateur ne supporte pas les IFrames</iframe></br><span style="font-size:10px;"><a href="http://kaliko1908.wix.com/dc-tube" target="_blank">DC Tube</a></span></div>');
          
}