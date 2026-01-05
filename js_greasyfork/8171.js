// ==UserScript==
// @name          Goodreads giveaways arrow pager
// @namespace     randomecho.com
// @description   Navigate giveaway pages with left and right arrow keys
// @include       https://www.goodreads.com/giveaway*
// @include       http://www.goodreads.com/giveaway*
// @grant         none
// @copyright     2014 Soon Van
// @author        Soon Van - randomecho.com
// @license       http://opensource.org/licenses/BSD-3-Clause
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/8171/Goodreads%20giveaways%20arrow%20pager.user.js
// @updateURL https://update.greasyfork.org/scripts/8171/Goodreads%20giveaways%20arrow%20pager.meta.js
// ==/UserScript==

function arrowPager(e) {
  pager_class = detectArrowKeyPressed(e);

  if (pager_class !== false) {
    changeToPage(document.getElementsByClassName(pager_class));
  }
}

function changeToPage(pager_node) {
  if (typeof(pager_node[0]) != 'undefined') {
    page_url = pager_node[0].getAttribute('href');

    // First and last pager links will not have a URL set
    if (page_url) {
      document.location = page_url;
    }
  }
}

function detectArrowKeyPressed(e) {
  if (e.keyCode == 39) {
    return 'next_page';
  } else if (e.keyCode == 37) {
    return 'previous_page';
  }

  return false;
}

document.addEventListener('keydown', arrowPager, false);
