// ==UserScript==
// @name           Nederlandse tekst en links op het officiële De Sims forum
// @namespace      Pinguïntech
// @author         Pinguïntech
// @description    Hiermee worden de Italiaanse teksten en links die onderaan forums.thesims.com staan aangepast naar Nederlandse teksten en links.
// @include        http://forums.thesims.com/nl_NL/*
// @grant          none
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/7838/Nederlandse%20tekst%20en%20links%20op%20het%20offici%C3%ABle%20De%20Sims%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/7838/Nederlandse%20tekst%20en%20links%20op%20het%20offici%C3%ABle%20De%20Sims%20forum.meta.js
// ==/UserScript==
var els = document.getElementsByClassName("container");
for(var i = 0, l = els.length; i < l; i++) {
  var el = els[i];
  el.innerHTML = el.innerHTML.replace(/AIUTO/, 'Help');
  el.innerHTML = el.innerHTML.replace(/TIENITI IN CONTATTO CON NOI/i, 'Volg ons');
  el.innerHTML = el.innerHTML.replace(/PIATTAFORME/, 'Populaire platforms');
  el.innerHTML = el.innerHTML.replace(/GENERI/, 'Populaire genres');
  el.innerHTML = el.innerHTML.replace(/Azione/, 'Actie en avontuur');
  el.innerHTML = el.innerHTML.replace(/Musicali/, 'Muziek');
  el.innerHTML = el.innerHTML.replace(/Famiglia/, 'Familie');
  el.innerHTML = el.innerHTML.replace(/Guida/, 'Racen');
  el.innerHTML = el.innerHTML.replace(/GDR/, 'RPG');
  el.innerHTML = el.innerHTML.replace(/Sparatutto/, 'Shooter');
  el.innerHTML = el.innerHTML.replace(/Simulazione/, 'Simulatie');
  el.innerHTML = el.innerHTML.replace(/Sportivi/, 'Sport');
  el.innerHTML = el.innerHTML.replace(/Compra su Origin/, 'Download Origin');
  el.innerHTML = el.innerHTML.replace(/Battlefield/, 'EA-games kopen');
  el.innerHTML = el.innerHTML.replace(/Need for speed/, 'EA-nieuws');
  el.innerHTML = el.innerHTML.replace(/EA Italia/, 'EA-account');
  el.innerHTML = el.innerHTML.replace(/The Sims 3/, 'Gratis games spelen');
  el.innerHTML = el.innerHTML.replace(/FIFA/, 'Werken bij EA');
  el.innerHTML = el.innerHTML.replace(/Assistenza EA/, 'Support');
  el.innerHTML = el.innerHTML.replace(/Facebook/, 'Kennisgeving online diensten');
  el.innerHTML = el.innerHTML.replace(/Youtube/, 'Mobiele games downloaden');
  el.innerHTML = el.innerHTML.replace(/Twitter/, 'Patches en updates');
  el.innerHTML = el.innerHTML.replace(/The Sims Forums/, 'Online Pass');
  el.innerHTML = el.innerHTML.replace(/Patch e Aggiornamenti/, 'Facturering');
  el.innerHTML = el.innerHTML.replace(/Billing/, '');
  el.innerHTML = el.innerHTML.replace(/Impressum/, '');
  el.innerHTML = el.innerHTML.replace(/Lavora con Noi/, 'Over EA');
  el.innerHTML = el.innerHTML.replace(/Politica sulla privacy e sui cookie/, 'Privacy- en cookiebeleid');
  el.innerHTML = el.innerHTML.replace(/Termini di Servizio/, 'Dienstvoorwaarden');
  el.innerHTML = el.innerHTML.replace(/Note Legali/, 'Veilig Online');
  el.innerHTML = el.innerHTML.replace(/Mappa Sito/, 'Juridische kennisgevingen');
  el.innerHTML = el.innerHTML.replace(/Tutti i diritti riservati/, 'Alle rechten voorbehouden');
}

var els = document.getElementsByClassName("Title");
for(var i = 0, l = els.length; i < l; i++) {
  var el = els[i];
  el.innerHTML = el.innerHTML.replace(/noemde jouw in/gi, 'noemde jou in');
}

 var links = document.links;
    var link;
    for(var i=links.length-1; i >=0; i--){
      link = links[i];
      link.href = link.href.replace("https://www.facebook.com/thesimsitalia", 'https://www.facebook.com/desimsnlbe');
      link.href = link.href.replace("https://twitter.com/EAitalia", 'https://twitter.com/TheSims');
      link.href = link.href.replace("http://www.youtube.com/user/ElectronicArtsItalia", 'http://www.youtube.com/user/Eainsider');
      link.href = link.href.replace("http://www.ea.com/it/platform/pc-games", 'http://www.ea.com/nl/pc');
      link.href = link.href.replace("http://www.ea.com/it/xbox-one", 'http://www.ea.com/nl/xbox-one');
      link.href = link.href.replace("http://www.ea.com/it/ps4", 'http://www.ea.com/nl/ps4');
      link.href = link.href.replace("http://www.ea.com/it/platform/x360-games", 'http://www.ea.com/nl/xbox-360');
      link.href = link.href.replace("http://www.ea.com/it/platform/ps3-games", 'http://www.ea.com/nl/ps3');
      link.href = link.href.replace("http://www.ea.com/it/platform/psp-game", 'http://www.ea.com/nl/psp');
      link.href = link.href.replace("http://www.ea.com/it/platform/ps2-games", 'http://www.ea.com/nl/ps2');
      link.href = link.href.replace("http://www.ea.com/it/platform/wii-games", 'http://www.ea.com/nl/wii');
      link.href = link.href.replace("http://www.ea.com/it/platform/nds-games", 'http://www.ea.com/nl/nds');
      link.href = link.href.replace("http://www.ea.com/it/genre/action-games", 'http://www.ea.com/nl/genre/actie-games');
      link.href = link.href.replace("http://www.ea.com/it/genre/music-games", 'http://www.ea.com/nl/genre/muziek-games');
      link.href = link.href.replace("http://www.ea.com/it/family", 'http://www.ea.com/nl/family');
      link.href = link.href.replace("http://www.ea.com/it/genre/racing-games", 'http://www.ea.com/nl/genre/race-games');
      link.href = link.href.replace("http://www.ea.com/it/rpg", 'http://www.ea.com/nl/genre/rpg-games');
      link.href = link.href.replace("http://www.ea.com/it/sparatutto", 'http://www.ea.com/nl/genre/shooter-games');
      link.href = link.href.replace("http://www.ea.com/it/genre/simulation-games", 'http://www.ea.com/nl/genre/simulatie-games');
      link.href = link.href.replace("http://www.ea.com/it/genre/sports-games", 'http://www.ea.com/nl/genre/sport-games');
      link.href = link.href.replace("http://www.origin.com/", 'https://www.origin.com/nl-nl/download');
      link.href = link.href.replace("http://www.battlefield.com/it/", 'http://store.origin.com/store/eaemea/home');
      link.href = link.href.replace("http://www.needforspeed.com/it_IT", 'http://www.ea.com/nl/nieuws');
      link.href = link.href.replace("http://www.ea.com/it", 'https://profile.ea.com/');
      link.href = link.href.replace("http://it.thesims3.com/", 'http://www.ea.com/nl/1/play-free-games');
      link.href = link.href.replace("http://www.easportsfootball.it/", 'http://www.ea.com/nl/1/werken-bij-ea');
      link.href = link.href.replace("http://help.ea.com/it/", 'http://help.ea.com/nl/');
      link.href = link.href.replace("https://www.facebook.com/ea.it", 'http://www.ea.com/nl/1/kennisgeving-online-diensten');
      link.href = link.href.replace("http://www.youtube.com/electronicartsitalia", 'http://www.ea.com/nl/mobile');
      link.href = link.href.replace("http://twitter.com/eaitalia", 'http://help.ea.com/nl/tag/patches');
      link.href = link.href.replace("http://forum.thesims3.com/jforum/forums/list.page", 'http://www.ea.com/nl/1/ea-online-pass');
      link.href = link.href.replace("http://help.ea.com/it/tag/patches", 'http://help.ea.com/nl/tag/billing');
      link.href = link.href.replace("http://www.ea.com/it/2/about-ea", 'http://www.ea.com/nl/sitemap');     
      link.href = link.href.replace("http://careers.ea.com/", 'http://www.ea.com/nl/1/over-ea');
      link.href = link.href.replace("http://tos.ea.com/legalapp/WEBPRIVACY/US/it/PC/", 'http://tos.ea.com/legalapp/WEBPRIVACY/NL/nl/PC/');
      link.href = link.href.replace("http://tos.ea.com/legalapp/WEBTERMS/US/it/PC/", 'http://tos.ea.com/legalapp/WEBTERMS/NL/nl/PC/');
      link.href = link.href.replace("http://www.ea.com/global/legal/legalnotice.js?cb=887c900f&v=381214p", 'http://www.ea.com/nl/1/veilig-online');
      link.href = link.href.replace("http://www.ea.com/it/sitemap", 'http://www.ea.com/nl/1/juridische-kennisgevingen');
    }