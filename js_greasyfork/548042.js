// ==UserScript==
// @name        EcoleDirecte - Consultation
// @namespace   Violentmonkey Scripts
// @match       https://www.ecoledirecte.com/Consultation*
// @grant       GM_addStyle
// @version     1.15
// @author      OB - Education Nationale / Académie de Bordeaux - FRANCE
// @icon        https://www.ecoledirecte.com/assets/images/logoEcoleDirecte.png
// @description Numérotation de la liste des élèves sur la page 'Consultation'. Dans la console : donne la liste des élèves et le lien de la photographie - Utilisé pour faire les plans de classe avec https://booklageolivier.forge.apps.education.fr/plandeclasse/
// @run-at      document-idle
// @license : MIT
// @downloadURL https://update.greasyfork.org/scripts/548042/EcoleDirecte%20-%20Consultation.user.js
// @updateURL https://update.greasyfork.org/scripts/548042/EcoleDirecte%20-%20Consultation.meta.js
// ==/UserScript==

/* Fonctions */

function ConsolePrint(message)
{
  var startTime = new Date();
  console.log('[ED-Consultation] '+ startTime.toLocaleTimeString() + ' ' + message) ;
}

function SearchStudentsList() {

  let students = 0;
  let result = "\n";

  // ConsolePrint('ED - CONSULTATION : SearchStudentsList');

  var eleves = document.getElementsByClassName("eleve");
  for (var i = 0; i < eleves.length; ++i) {
    let eleve = eleves[i]; /* .innerHTML; */
    var buttons = eleve.getElementsByTagName('button');

    /* Captation */
    for (var j= 0; j < buttons.length; ++j) {
      let button = buttons[j];
      var captions = button.getElementsByClassName("caption");
      for (var l= 0; l < captions.length; ++l) {
        var student_name = captions[l].textContent.trim();

        /* Si il y a déjà le numéro d'élève entre crochets, on arrête */
        if (student_name.includes("[")) {
          return;
        }
        captions[l].innerHTML =  student_name + " <p style='background-color: rgb(255, 255, 128) !important;'>["+(i+1)+"]</p>";
        students++;
      }
    }

    /* Picture */
    for (var j= 0; j < buttons.length; ++j) {
      let button = buttons[j];
      var imgs = button.getElementsByTagName("img");
      for (var k= 0; k < imgs.length; ++k) {
        var image_URL = imgs[k].src;
      }
    }

    // result += `${i+1} <a href=\"${image_URL}\">${student_name}</a><br>\n`; /* HTML */
    result += `${i+1};${student_name};${image_URL}\n`; /* CSV */

  }

  if(students) {
      ConsolePrint(result);
  }

}

/* Application */
if (self == top) { /* run only in the top frame. we do our own frame parsing */
  ConsolePrint('STARTED');
  setInterval(SearchStudentsList, 3000);
}
