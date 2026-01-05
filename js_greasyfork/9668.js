// ==UserScript==
// @name        SSC v.2.0
// @description Ogarnięcie burdelu na SSC v.2.0
// @include     http://www.skyscrapercity.com/forumdisplay.php?f=45
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     2.0
// @grant       none
// @namespace https://greasyfork.org/users/11062
// @downloadURL https://update.greasyfork.org/scripts/9668/SSC%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/9668/SSC%20v20.meta.js
// ==/UserScript==

/*
 * Konfiguracja
 *
 * Odstęp między działem głównym a subforami w pikselach:
 */

var margin = 5;

/*
 * Tablica z działami, które mają być przeniesione:
 */

var hide = {'Łódzkie, Mazowsze, Podlasie': ['Warszawa', 'Łódź', 'Białystok'], 'Lubelskie, Małopolska, Podkarpacie i Świętokrzyskie': ['Kraków', 'Lublin'], 'Pomorze, Warmia i Mazury': ['Trójmiasto', 'Szczecin'], 'Śląsk': ['Wrocław', 'Katowice'], 'Wielkopolska, Kujawy, Lubuskie': ['Poznań', 'Bydgoszcz', 'Toruń']};

/**
 * Tablica z działami - NIE RUSZAĆ ;]
 */

var subforum = {
 'Łódzkie, Mazowsze, Podlasie': 704,
 'Białystok': 3968,
 'Łódź': 3969,
 'Warszawa': 708,
 'Lubelskie, Małopolska, Podkarpacie i Świętokrzyskie': 705,
 'Kraków': 3970,
 'Lublin': 3971,
 'Pomorze, Warmia i Mazury': 706,
 'Szczecin': 3972,
 'Trójmiasto': 3973,
 'Śląsk': 707,
 'Katowice': 3974,
 'Wrocław': 3975,
 'Wielkopolska, Kujawy, Lubuskie': 709,
 'Bydgoszcz': 3976,
 'Poznań': 3977,
 'Toruń': 3978,
 'Inwestycje ukończone': 637
}

/**
 * Skrypt
 */

if (Object.keys(hide).length > 0) {
   $.each(hide, function(index, value) {
      if (value.length > 0) {
         //dodawanie diva, w którym mają być trzymane subfora
         var parent = $('#f' + subforum[index]);
         parent.append('<div class="smallfont" style="margin-top: '+margin+'px;"></div>');

         $.each(value, function(index2, value2) {
             //pobieranie nazwy i linku subfora
             var moveIt = $('#f' + subforum[value2]);
             var name = moveIt.children().children().children().text().replace('» ', '');
             var link = moveIt.children().children().attr('href');

             //oddzielamy je pionowa kreska
             if (index2 > 0)
                parent.children('.smallfont').append(' | ');

             //dodajemy link pod parentem
             parent.children('.smallfont').append('» <a href="'+link+'">'+name+'</a>');

             //usuwanie niepotrzebnego diva
             moveIt.parent().remove();
         });
      }
   });
}