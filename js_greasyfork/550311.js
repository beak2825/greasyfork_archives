// ==UserScript==
// @name            Flickr - Sort Galleries by Number of items / Views / Comments
// @version         1.00
// @description	    in Galleries add Sort function
// @author          decembre
// @icon            https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico
// @namespace       https://greasyfork.org/fr/users/8-decembre
// @include         http*://www.flickr.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant           GM_addStyle
// @run-at          document-end
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/550311/Flickr%20-%20Sort%20Galleries%20by%20Number%20of%20items%20%20Views%20%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/550311/Flickr%20-%20Sort%20Galleries%20by%20Number%20of%20items%20%20Views%20%20Comments.meta.js
// ==/UserScript==

(function() {
  'use strict';
// Add styles
  GM_addStyle(`
/* === FLICKR- TEST - For GM "Flickr - Sort Galleries by Number of items / Views / Comments" === */

/* (new323) TEST - GM "Flickr - Sort Galleries by Number of items / Views / Comments" */
.fluid.html-galleries-list-page-view body:has(.fluid-subnav.with-overflow-menu) .sort-buttons {
    position: fixed !important;
    top: 7vh ;
    left: 35% ;
    bottom: unset !important;
    font-size: 21px !important;
    z-index: 5000000 !important;
/*background: white;*/
}
/* AFTER SCROLL */
.fluid.html-galleries-list-page-view body:has(.fluid-subnav.with-overflow-menu.fixed) .sort-buttons {
    position: fixed !important;
    top: 2vh ;
    left: 35% ;
    bottom: unset !important;
    font-size: 21px !important;
/*background: white;*/
}


.fluid.html-galleries-list-page-view .sort-buttons + .fluid-centered {
    max-width: 98% !important;
    min-width: 98% !important;
    padding: 0px 20px !important;
    margin-bottom: 40px;
    margin-top: 6vh ;
}

html #content .galleries-list-container.fluid-centered .photo-list-gallery-view {
    position: relative !important;
    display: inline-block !important;
    margin: -40px 0px 65px 35px !important;
    opacity: 1 !important;
    transform: none !important;
}
  `);
  // Add sort buttons
  const galleriesListContainer = $('.galleries-list-container.fluid-centered');
  if (galleriesListContainer.length > 0) {
    const sortButtonsHtml = `
      <div class="sort-buttons">
        <button class="sort-by-items">Sort by Items <span class="sort-direction">↑</span></button>
        <button class="sort-by-views">Sort by Views <span class="sort-direction">↑</span></button>
        <button class="sort-by-comments">Sort by Comments <span class="sort-direction">↑</span></button>
      </div>
    `;
    galleriesListContainer.before(sortButtonsHtml);

    let sortDirection = {
      items: 'desc',
      views: 'desc',
      comments: 'desc'
    };

    // Add event listeners to sort buttons
    $('.sort-by-items').on('click', function() {
      sortDirection.items = sortDirection.items === 'desc' ? 'asc' : 'desc';
      $(this).find('.sort-direction').text(sortDirection.items === 'desc' ? '↑' : '↓');
      sortGalleriesByItems(sortDirection.items);
    });
    $('.sort-by-views').on('click', function() {
      sortDirection.views = sortDirection.views === 'desc' ? 'asc' : 'desc';
      $(this).find('.sort-direction').text(sortDirection.views === 'desc' ? '↑' : '↓');
      sortGalleriesByViews(sortDirection.views);
    });
    $('.sort-by-comments').on('click', function() {
      sortDirection.comments = sortDirection.comments === 'desc' ? 'asc' : 'desc';
      $(this).find('.sort-direction').text(sortDirection.comments === 'desc' ? '↑' : '↓');
      sortGalleriesByComments(sortDirection.comments);
    });
  }

  function sortGalleriesByItems(direction) {
    const galleries = $('.photo-list-gallery-view');
    galleries.sort(function(a, b) {
      const aCount = parseInt($(a).find('.item-count').text().replace(/[^0-9]/g, ''));
      const bCount = parseInt($(b).find('.item-count').text().replace(/[^0-9]/g, ''));
      return direction === 'desc' ? bCount - aCount : aCount - bCount;
    });
    galleriesListContainer.empty().append(galleries);
  }

  function sortGalleriesByViews(direction) {
    const galleries = $('.photo-list-gallery-view');
    galleries.sort(function(a, b) {
      const aCount = parseInt($(a).find('.view-count').text().replace(/[^0-9]/g, ''));
      const bCount = parseInt($(b).find('.view-count').text().replace(/[^0-9]/g, ''));
      return direction === 'desc' ? bCount - aCount : aCount - bCount;
    });
    galleriesListContainer.empty().append(galleries);
  }

  function sortGalleriesByComments(direction) {
    const galleries = $('.photo-list-gallery-view');
    galleries.sort(function(a, b) {
      const aCount = parseInt($(a).find('.comment-count').text().replace(/[^0-9]/g, ''));
      const bCount = parseInt($(b).find('.comment-count').text().replace(/[^0-9]/g, ''));
      return direction === 'desc' ? bCount - aCount : aCount - bCount;
    });
    galleriesListContainer.empty().append(galleries);
  }
})();
