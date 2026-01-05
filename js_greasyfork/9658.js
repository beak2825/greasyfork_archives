// ==UserScript==
// @name        MyAnimeList (MAL) Series Filter
// @namespace   https://greasyfork.org/users/7517
// @description Filter entries that already exist on your MAL lists
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     1.1
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/(anime|manga)\.php\?.*\S=/
// @include     /^https?:\/\/myanimelist\.net\/(anime|manga)\/(season|genre|producer|magazine)/
// @include     /^https?:\/\/myanimelist\.net\/top(anime|manga)\.php/
// @include     /^https?:\/\/myanimelist\.net\/search/
// @include     /^https?:\/\/myanimelist\.net\/(anime|manga)list/
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9658/MyAnimeList%20%28MAL%29%20Series%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/9658/MyAnimeList%20%28MAL%29%20Series%20Filter.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  const MSF_FILTER_CLASS = 'msf_filter';

  const main = (url) => {
    const myurl = new URL(url);

    let mylist = myurl.searchParams.get('mylist');
    if (!mylist) {
      mylist = [];
    } else {
      mylist = mylist.split(',').filter((el) => el.trim() !== '');
    }

    let mytags = myurl.searchParams.get('mytags');
    if (!mytags) {
      mytags = [];
    } else {
      mytags = mytags.split(',').filter((el) => el.trim() !== '');
    }

    let mylist_css = 'a.button_edit';
    let mylist_selector = 'tr';
    let mylist_filter = (status) => '.' + status;

    let mytags_css = '';
    let mytags_selector = null;
    let mytags_filter = (tag) => ':has(div[class^="tags-"]):not(:has(div > span > a:mytags_filter(' + tag + ')))';

    $.expr.pseudos.mytags_filter = $.expr.pseudos.mytags_filter || $.expr.createPseudo((text) => {
      return (el) => $(el).text().trim().toLowerCase() === text.trim().toLowerCase();
    });

    if (url.match(/^https?:\/\/myanimelist\.net\/search/)) {
      mylist_selector = 'div.list';
    } else if (url.match(/^https?:\/\/myanimelist\.net\/top(anime|manga)\.php/)) {
      mylist_css = '.top-ranking-table .status .btn-addEdit-large';
    } else if (url.match(/^https?:\/\/myanimelist\.net\/(anime|manga)list/)) {
      mylist_css = '.list-table-data .data.status';
      mylist_selector = '.list-item';

      mytags_css = '.list-table-data .data.tags';
      mytags_selector = '.list-item';
    }

    const filter = (e) => {
      const target = e.target || e;

      if (mylist_selector != null) {
        mylist.forEach((arg) => {
          $(mylist_css + mylist_filter(arg), target).each((i, el) => {
            $(el).closest(mylist_selector).removeClass().addClass(MSF_FILTER_CLASS);
          });
        });
      }

      if (mytags_selector != null) {
        mytags.forEach((arg) => {
          $(mytags_css + mytags_filter(arg), target).each((i, el) => {
            $(el).closest(mytags_selector).removeClass().addClass(MSF_FILTER_CLASS);
          });
        });
      }
    };

    filter($('body').on('DOMNodeInserted', filter));
  };

  if ($('#malLogin').length === 0) {
    main(document.URL);

    $('<style type="text/css" />').html(
      '.' + MSF_FILTER_CLASS + ' { display: none !important; }'
    ).appendTo('head');
  }
}(jQuery));