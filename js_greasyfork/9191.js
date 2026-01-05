// ==UserScript==
// @name        AO3 Interface translation testing
// @description testing translations of AO3 Interface
// @namespace   cz.sipral.ao3.translate.testing
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @include     archiveofourown.org/*
// @include     http://ao3.org/*
// @require     https://greasyfork.org/scripts/9168-library-for-translating-ao3-interface/code/Library%20for%20translating%20AO3%20interface.js?version=46123
// @version     0.0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9191/AO3%20Interface%20translation%20testing.user.js
// @updateURL https://update.greasyfork.org/scripts/9191/AO3%20Interface%20translation%20testing.meta.js
// ==/UserScript==
//<---translation tables -->
var warnings_tr = new tranTable({
  'No Archive Warnings Apply': 'No Archive Warnings Apply_tr',
  'Creator Chose Not To Use Archive Warnings': 'Creator Chose Not To Use Archive Warnings_tr',
  'Graphic Depictions Of Violence': 'Graphic Depictions Of Violence_tr',
  'Major Character Death': 'Major Character Death_tr',
  'Rape/Non-Con': 'Rape/Non-Con_tr',
  'Underage': 'Underage_tr',
  'Choose Not To Use Archive Warnings' : 'Choose Not To Use Archive Warnings_tr'
});
var dropdowns_tr = new tranTable({
  'Hi,': 'Hi,_tr',
  'My Dashboard': 'My Dashboard_tr',
  'My Subscriptions': 'My Subscriptions_tr',
  'My Works': 'My Works_tr',
  'My Bookmarks': 'My Bookmarks_tr',
  'My History': 'My History_tr',
  'My Preferences': 'My Preferences_tr',
  'Post': 'Post_tr',
  'New Work': 'New Work_tr',
  'Import Work': 'Import Work_tr',
  'All Fandoms': 'All Fandoms_tr',
  'Anime & Manga': 'Anime & Manga_tr',
  'Books & Literature': 'Books & Literature_tr',
  'Cartoons & Comics & Graphic Novels': 'Cartoons & Comics & Graphic Novels_tr',
  'Celebrities & Real People': 'Celebrities & Real People_tr',
  'Movies': 'Movies_tr',
  'Music & Bands': 'Music & Bands_tr',
  'Other Media': 'Other Media_tr',
  'Theater': 'Theater_tr',
  'TV Shows': 'TV Shows_tr',
  'Video Games': 'Video Games_tr',
  'Uncategorized Fandoms': 'Uncategorized Fandoms_tr',
  'Browse': 'Browse_tr',
  'Search': 'Search_tr',
  'About Us': 'About Us_tr',
  'About': 'About_tr',
  'FAQ': 'FAQ_tr',
  'News': 'News_tr',
  'Wrangling Guidelines': 'Wrangling Guidelines_tr',
  'Donate or Volunteer': 'Donate or Volunteer_tr',
  'Fandoms': 'Fandoms_tr',
  'Works': 'Works_tr',
  'Bookmarks': 'Bookmarks_tr',
  'Tags': 'Tags_tr',
  'Collections': 'Collections_tr',
  'People': 'People_tr'
});
var blurb_tr = new tranTable({
  'Rating' : 'Rating_tr',
  'Archive Warnings' : 'Archive Warnings_tr',
  'Category' : 'Category_tr',
  'Fandom' : 'Fandom_tr',
  'Relationship' : 'Relationship_tr',
  'Characters' : 'Characters_tr',
  'Additional Tags' : 'Additional Tags_tr',
  'Language' : 'Language_tr',
  'Stats' : 'Stats_tr',
  'Published' : 'Published_tr',
  'Updated' : 'Updated_tr',
  'Words' : 'Words_tr',
  'Chapters' :'Chapters_tr',
  'Kudos' :'Kudos_tr',
  'Bookmarks' :'Bookmarks_tr',
  'Hits' :'Hits_tr'
});
//<--end of translation tables-->
processBlurb(blurb_tr);
processDropDowns(dropdowns_tr);
processArchiveWarnings(warnings_tr);