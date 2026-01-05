// ==UserScript==
// @name         CISM++
// @namespace    http://eepp.ca/
// @version      0.2
// @description  Améliorations variées du site Web de CISM
// @author       Philippe Proulx
// @match        *://cism893.ca/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6235/CISM%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/6235/CISM%2B%2B.meta.js
// ==/UserScript==

// sauvegarde de l'initialisation originale de FicheEmission
var ficheEmissionInit = FicheEmission.prototype.initialize;

// modification des temps
function alterTimes() {
    // HH:MM:SS -> nombre de secondes
    function hhmmss2secs(hhmmss) {
        var tokens = hhmmss.split(':');
        var mul = 1;
        var secs = 0;
        
        for (var i = tokens.length - 1; i >= 0; --i) {
            secs += parseInt(tokens[i]) * mul;
            mul *= 60;
        }
        
        return secs;
    }

    // étiquettes de temps
    var $times = $('.episodes-list time');
    
    $times.each(function() {
        var $time = $(this);
     
        // changer seulement si ce n'est pas déjà fait
        if (!$time.attr('data-secs')) {
            // attribut "data-secs" contient le nombre de secondes
            $time.attr('data-secs', hhmmss2secs($time.text()));
            
            // style
            $time.css('color', '#ee393e');
            $time.hover(function() {
                $(this).css('color', '#6d090c');
            }, function() {
                $(this).css('color', '#ee393e');
            });
            
            // action (sauter au bon endroit dans l'audio en cours de lecture)
            $time.click(function(ev) {
                ev.stopPropagation();
                player.seekTo(parseInt($time.attr('data-secs')) / player.duration * 100);
            });
        }
    });
}

// nouvelle initialisation de FicheEmission
FicheEmission.prototype.initialize = function() {
    // modifier les temps de la fiche chargée
    alterTimes();
    
    // appeler l'initialisation originale de FicheEmission
    ficheEmissionInit.call(this);
};

$(document).ready(function() {
    // modifier les temps chargés avec la page
    alterTimes();
});