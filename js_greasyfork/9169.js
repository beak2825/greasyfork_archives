// ==UserScript==
// @name        Czech AO3 Interface translation
// @description:en  translates AO3 Interface into Czech
// @namespace   cz.sipral.ao3.translate.cs
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @include     archiveofourown.org/*
// @include     http://ao3.org/*
// @require     https://greasyfork.org/scripts/9168-library-for-translating-ao3-interface/code/Library%20for%20translating%20AO3%20interface.js?version=45990
// @version     0.0.0.1.5
// @grant       none
// @description translates AO3 Interface into Czech
// @downloadURL https://update.greasyfork.org/scripts/9169/Czech%20AO3%20Interface%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/9169/Czech%20AO3%20Interface%20translation.meta.js
// ==/UserScript==
//<---translation tables -->
var warnings_tr = new tranTable({
  'No Archive Warnings Apply': 'K práci se nevztahují žádná varování',
  'Creator Chose Not To Use Archive Warnings': 'Autor neuvedl žádná varování',
  'Graphic Depictions Of Violence': 'Explicitní vyobrazení násilí',
  'Major Character Death': 'Smrt hlavní postavy',
  'Rape/Non-Con': 'Znásilnění/ Nekonsensuální sex',
  'Underage': 'Sexuální aktivita postavy mladší 18 let',
  'Choose Not To Use Archive Warnings' : 'Autor neuvedl žádná varování'
});
var dropdowns_tr = new tranTable({
  'Hi,': 'Ahoj',
  'My Dashboard': 'Můj panel uživatele ',
  'My Subscriptions': 'Moje odebírání ',
  'My Works': 'Moje práce',
  'My Bookmarks': 'Moje záložky',
  'My History': 'Historie',
  'My Preferences': 'Nastavení',
  'Post': 'Zveřejnit',
  'New Work': 'Nová práce',
  'Import Work': 'Importovat práci',
  'All Fandoms': 'Všechny fandomy',
  'Anime & Manga': 'Anime & Manga',
  'Books & Literature': 'Knihy & Literatůra',
  'Cartoons & Comics & Graphic Novels': 'translation',
  'Celebrities & Real People': 'translation',
  'Movies': 'Filmy',
  'Music & Bands': 'translation',
  'Other Media': 'translation',
  'Theater': 'Divadlo',
  'TV Shows': 'translation',
  'Video Games': 'Video hry',
  'Uncategorized Fandoms': 'translation',
  'Browse': 'translation',
  'Search': 'Vyhledat',
  'About Us': 'O nás',
  'About': 'translation',
  'FAQ': 'FAQ - často kladené otázky',
  'News': 'translation',
  'Wrangling Guidelines': 'translation',
  'Donate or Volunteer': 'translation',
  'Fandoms': 'Fandomy',
  'Works': 'Práce',
  'Bookmarks': 'Záložky',
  'Tags': 'Tagy',
  'Collections': 'Kolekce',
  'People': 'translation'
});
//<--end of translation tables-->
processDropDowns(dropdowns_tr);
processArchiveWarnings(warnings_tr);