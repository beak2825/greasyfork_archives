// ==UserScript==
// @name        sredniaWazona
// @namespace   http*
// @description Liczy srednią ważoną wszystkich ocen z indeksu na edukacji, z pominięciem 2.0
// @include     https://edukacja.pwr.wroc.pl/EdukacjaWeb/indeks.do
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7704/sredniaWazona.user.js
// @updateURL https://update.greasyfork.org/scripts/7704/sredniaWazona.meta.js
// ==/UserScript==

var arr = document.evaluate('//table[preceding::b[contains(.,"realizowanych w semestrach")]]/tbody/tr/td/table/tbody/tr[position()>1]',document.documentElement,
    null,
    XPathResult.ANY_TYPE,
    null);
var dzielna=0;
var dzielnik=0;
var ocen=0;
var waga=0;

var match = arr.iterateNext();
while(match)
  {
    //alert("!!!");
    if(match.children[4].innerHTML.indexOf('2.0')== -1) //odrzucenie ocen 2.0
      {
        //alert("!!!");
        ocena=Number(match.children[4].innerHTML);
        waga=Number(match.children[3].innerHTML);
        dzielna=dzielna+(ocena*waga);
        dzielnik=dzielnik+waga;
      }
    match=arr.iterateNext();
  }
var srednia=dzielna/dzielnik;
alert("Średnia ważona wynosi "+srednia.toFixed(3));

