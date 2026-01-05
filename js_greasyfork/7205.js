// ==UserScript==
// @name        FilmWebTitlesFormatAndCopy
// @namespace   jahuu.info
// @author      Jahuu
// @description Prosty skrypt do sformatowania i przygotowania tytułu filmu do skopiowania - używam do spójnego nazywania filmów w swojej kolekcji. / Simple script, to format and prepare to copy title of movie.
// @include     *filmweb.pl*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7205/FilmWebTitlesFormatAndCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/7205/FilmWebTitlesFormatAndCopy.meta.js
// ==/UserScript==
// Data aktualizacji / Update date 23.06.2021
// Uproszczenie i dostosowanie do obecnego modelu DOM / Simplification and adaptation to the current DOM model

var elements = document.getElementsByClassName('filmCoverSection__title text--uppercase ');
var output = document.getElementsByClassName("page__container filmCoverSection__ratings afterPremiere");

var Title = elements[0].childNodes[0].innerHTML;
var date = document.getElementsByClassName('filmCoverSection__year')[0].innerHTML;
var Rating = document.getElementsByClassName('filmRating__rateValue')[0].innerHTML;

var valueName='"'+Title+' '+'('+date+')'+'['+Rating+']"';
var DivCustom = '<input type="text" size="'+valueName.length+'" style="background-color:Black; border:none;" id="divcustom" value='+valueName+'>';

output[0].innerHTML = output[0].innerHTML + DivCustom;

document.getElementById("divcustom").select();
