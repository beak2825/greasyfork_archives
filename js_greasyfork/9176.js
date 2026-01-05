// ==UserScript==
// @name        German AO3 Interface translation
// @description:en  translates AO3 Interface into German
// @namespace   cz.sipral.ao3.translate.de
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @include     archiveofourown.org/*
// @include     http://ao3.org/*
// @require     https://greasyfork.org/scripts/9168-library-for-translating-ao3-interface/code/Library%20for%20translating%20AO3%20interface.js?version=45990
// @version     0.0.0.2
// @grant       none
// @description translates AO3 Interface into German
// @downloadURL https://update.greasyfork.org/scripts/9176/German%20AO3%20Interface%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/9176/German%20AO3%20Interface%20translation.meta.js
// ==/UserScript==
//<---translation tables -->
var warnings_tr = new tranTable({
  'No Archive Warnings Apply': 'Keine Archivwarnungen treffen zu',
  'Creator Chose Not To Use Archive Warnings': 'Der/Die SchöpferIn hat keine Archivwarnungen angegeben',
  'Graphic Depictions Of Violence': 'Explizite Gewaltdarstellungen',
  'Major Character Death': 'Tod eines Hauptcharakters',
  'Rape/Non-Con': 'Vergewaltigung',
  'Underage': 'Minderjährig',
  'Choose Not To Use Archive Warnings': 'Der/Die SchöpferIn hat keine Archivwarnungen angegeben'
});
var dropdowns_tr = new tranTable({
  'Hi,': 'Hi',
  'My Dashboard': 'Mein Dashboard',
  'My Subscriptions': 'Meine Abos',
  'My Works': 'Meine Werke',
  'My Bookmarks': 'Meine Lesezeichen',
  'My History': 'Mein Verlauf',
  'My Preferences': 'Meine Einstellungen',
  'Post': 'Veröffentlichen',
  'New Work': 'Neues Werk',
  'Import Work': 'Werk Importieren',
  'All Fandoms': 'Alle Fandoms',
  'Anime & Manga': 'Anime & Manga',
  'Books & Literature': 'Bücher & Literatur',
  'Cartoons & Comics & Graphic Novels': 'Cartoons & Comics & Grafic Novels',
  'Celebrities & Real People': 'Prominente & Echte Personen',
  'Movies': 'Filme',
  'Music & Bands': 'Musik & Bands',
  'Other Media': 'Andere Medien',
  'Theater': 'Theater',
  'TV Shows': 'Fernsehsendungen',
  'Video Games': 'Videospiele',
  'Uncategorized Fandoms': 'Nicht zugeordnete Fandoms',
  'Browse': 'Stöbern',
  'Search': 'Suchen',
  'About Us': 'Über Uns',
  'About': 'Über',
  'FAQ': 'FAQ',
  'News': 'Neuigkeiten',
  'Wrangling Guidelines': 'Bändigungsrichtlinien',
  'Donate or Volunteer': 'Spenden oder Mithelfen',
  'Fandoms': 'Fandoms',
  'Works': 'Werke',
  'Bookmarks': 'Lesezeichen',
  'Tags': 'Tags',
  'Collections': 'Sammlungen',
  'People': 'Leute'
});
//<--end of translation tables-->
processDropDowns(dropdowns_tr);
processArchiveWarnings(warnings_tr);