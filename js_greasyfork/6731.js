// ==UserScript==
// @name           Cinematik Enhancer
// @namespace      surrealmoviez.info
// @description    Display changes for Cinematik
// @include        https://www.cinematik.net/details.php?id=*
// @include        https://www.cinematik.net/upload.php
// @require        https://code.jquery.com/jquery-3.2.0.min.js
// @version        1.1.0
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/6731/Cinematik%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/6731/Cinematik%20Enhancer.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
  if (document.location.pathname === "/details.php") {
    // Add a link to IMDb next to every listed IMDb ID
    $('.pbox2_table').each(function() {
      console.log('one box');
      let $imdbLink = $(this).find('.gr_vsep3 .awom').first();
      let imdbID = $imdbLink.text();
      // Make sure that we have something that looks like an ID
      if (!/^\d+$/.test(imdbID)) {
        return true;
      }
      $imdbLink.after(
        '<a href="https://www.imdb.com/title/tt' + imdbID + '/" ' +
        'rel="noreferrer" style="text-decoration: none;">' +
          ' &#x1F517;' +
        '</a>'
      );
    });
  } else if (document.location.pathname === "/upload.php") {
    // Add shortcut to check all "Understand?" requirements prior to upload
    $('td.outer > form').prepend(
      '<center>' +
        '<input id="express-checkbox" type="checkbox" value="99" name="">' +
          '<label style="font-size:1.1em" for="express-checkbox">' +
            'I know the rules. The part about <b>getting banned</b> ' +
            'if I don\'t, too.' +
          '</label><br><br>' +
        '<input type="submit" value="I have read the rules">' +
      '<center>'
    );
    $('#express-checkbox').click(function() {
      $('form > div > div > input').prop('checked', $(this).prop('checked'));
    });
  }
});
