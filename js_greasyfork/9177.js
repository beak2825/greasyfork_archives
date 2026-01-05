// ==UserScript==
// @name        Italian AO3 Interface translation
// @description:en  translates AO3 Interface into Italian
// @namespace   cz.sipral.ao3.translate.it
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @include     archiveofourown.org/*
// @include     http://ao3.org/*
// @require     https://greasyfork.org/scripts/9168-library-for-translating-ao3-interface/code/Library%20for%20translating%20AO3%20interface.js?version=45990
// @version     0.0.0.2
// @grant       none
// @description translates AO3 Interface into Italian
// @downloadURL https://update.greasyfork.org/scripts/9177/Italian%20AO3%20Interface%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/9177/Italian%20AO3%20Interface%20translation.meta.js
// ==/UserScript==
//<---translation tables -->
var warnings_tr = new tranTable({
 'No Archive Warnings Apply': 'Nessun Avvertimento dell\'Archivio È Applicabile',
 'Creator Chose Not To Use Archive Warnings': 'L\'Autore Ha Scelto di Non Usare Avvertimenti dell\'Archivio',
 'Graphic Depictions Of Violence': 'Descrizioni Esplicite di Violenza',
 'Major Character Death': 'Morte di un Personaggio Principale',
 'Rape/Non-Con': 'Stupro/Non Consensuale',
 'Underage': 'Underage',
 'Choose Not To Use Archive Warnings': 'L\'Autore Ha Scelto di Non Usare Avvertimenti dell\'Archivio'
});
var dropdowns_tr = new tranTable({
 'Hi,': 'Ciao,',
 'My Dashboard': 'La Mia Bacheca',
 'My Subscriptions': 'Iscrizioni',
 'My Works': 'I Miei Lavori',
 'My Bookmarks': 'I Miei Segnalibri',
 'My History': 'Cronologia',
 'My Preferences': 'Preferenze',
 'Post': 'Pubblica',
 'New Work': 'Nuovo Lavoro',
 'Import Work': 'Importa un Lavoro',
 'All Fandoms': 'Tutti i Fandom',
 'Anime & Manga': 'Anime & Manga',
 'Books & Literature': 'Libri & Letteratura',
 'Cartoons & Comics & Graphic Novels': 'Cartoni & Comic & Graphic Novel',
 'Celebrities & Real People': 'Celebrità & Persone Reali',
 'Movies': 'Film',
 'Music & Bands': 'Musica & Gruppi',
 'Other Media': 'Altri Media',
 'Theater': 'Teatro',
 'TV Shows': 'Serie TV',
 'Video Games': 'Videogame',
 'Uncategorized Fandoms': 'Fandom Non Categorizzati',
 'Browse': 'Scorri',
 'Search': 'Cerca',
 'About Us': 'Riguardo AO3',
 'About': 'Informazioni',
 'FAQ': 'FAQ',
 'News': 'News',
 'Wrangling Guidelines': 'Linee Guida per l\'Organizzazione Tag',
 'Donate or Volunteer': 'Fai un Donazione o Diventa Volontari@',
 'Fandoms': 'Fandom',
 'Works': 'Lavori',
 'Bookmarks': 'Segnalibri',
 'Tags': 'Tag',
 'Collections': 'Collezioni',
 'People': 'Persone'
}); 
//<--end of translation tables-->
processDropDowns(dropdowns_tr);
processArchiveWarnings(warnings_tr);