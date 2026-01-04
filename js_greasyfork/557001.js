// ==UserScript==
// @name         Vider les champs de "Ma recherche"
// @namespace    http://tampermonkey.net/
// @version      2025-11-26
// @description  c'est impossible a supprimer sans ce script...
// @author       calculatortamer
// @match        https://www.hellowork.com/fr-fr/candidat/mon-profil/recherche.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hellowork.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557001/Vider%20les%20champs%20de%20%22Ma%20recherche%22.user.js
// @updateURL https://update.greasyfork.org/scripts/557001/Vider%20les%20champs%20de%20%22Ma%20recherche%22.meta.js
// ==/UserScript==


function supprimer(){
    Object.values(document.querySelectorAll('[data-autocomplete-multiple-target="hiddenInput"]')).forEach(a=>a.value=" ");
}


function creerBouton() {
    const bouton = document.createElement("button");
    bouton.innerHTML = "Supprimer champs";
    //mettre en bas a droite de l'écran
    bouton.style.position = "fixed";
    bouton.style.bottom = "3em";
    bouton.style.right = "3em";
    bouton.style.padding = "1em";
    bouton.style.zIndex = "9999999";
    bouton.style.backgroundColor = "black";
    bouton.style.color = "red";
    bouton.style.borderRadius = "1em";

    bouton.onclick = supprimer;
    document.body.appendChild(bouton);
}

creerBouton()