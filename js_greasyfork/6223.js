// ==UserScript==
// @name        CH Rental Insights
// @author      clickhappier
// @namespace   clickhappier
// @description Rental Insights interface improvements
// @version     1.5c
// @grant       none
// @include     https://rentalinsights.herokuapp.com*
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/6223/CH%20Rental%20Insights.user.js
// @updateURL https://update.greasyfork.org/scripts/6223/CH%20Rental%20Insights.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


// adjust main heights
addGlobalStyle('html, body, body div.row, div.span10 { height: 100% ! important; }');  // needed for relative heights of the below elements to work
addGlobalStyle('body { overflow: auto ! important; }');
addGlobalStyle('div.original { height: 90% ! important; }');
addGlobalStyle('div.span2.form-area { height: 90% ! important;  overflow: scroll; }');

// adjust main widths
addGlobalStyle('div.container, div.container div.row, div.span12 { width: 100% ! important; }');
addGlobalStyle('div.span10 { width: 65% ! important; }');
addGlobalStyle('body div.row { width: 100%;  margin-left: 0px; }');
addGlobalStyle('div.span2.form-area { width: auto;  margin-left: 5px;  padding-right: 5px; }');
addGlobalStyle('input#property_update_address { width: 200px ! important; }');


// hide/adjust superfluous elements from original pages:

// zillow
addGlobalStyle('div.nav-top-container, div.zsg-toolbar, form.zsg-searchbox, section#hdp-neighborhood, div#map-tabs, div#vmc, section#nearbySchools, div.similar-homes, div.resource-center, div.zsg-g, div.zsg-footer-nav, div#sort-control-container, footer, div#home-type-dropdown, div#search-filters, section#home-other-costs, div#other-costs-list, div.balpals.closer, div#monthly-payment-options, nav.nav-top { display: none ! important; }');

// google maps
addGlobalStyle('div#inline-tile-container { display: none ! important; }');

// appfolio
addGlobalStyle('div.noprint, div.hidden-container, div.one_third_column, iframe.map_frame { display: none ! important; }');

// oodle
addGlobalStyle('div.dfp-universal-header, div.wrapper-contextual-header, div#seller-image, a#credit-score-link, a#connect-home-link, div#similar-listings, div.wbgbr, div.wbgbr2, div#footer-container { display: none ! important; }');

// craigslist
addGlobalStyle('ul.clfooter, aside, a.tsb, a.bestoflink, ul.userlinks { display: none ! important; }');

// apartments.com
addGlobalStyle('div#mobile-prompt, section#toolbar, nav.top-bar, span#chat, section#nearby-listings, ul.footer-menu, div#modal-ad-choices { display: none ! important; }');
addGlobalStyle('div#content div.row { margin-left: 5px ! important; }');

// amli
addGlobalStyle('div.bottomFooterLinks, img.commModuleImage, div#topMainImage2, div#topMainImage3 { display: none ! important; }');
addGlobalStyle('table#commSEOTable, .commSeoText { visibility: visible ! important; }');
addGlobalStyle('img#ContentMain_MainImage1 { max-width: 25%; max-height: 25%; }');
addGlobalStyle('div#socialLinksCommunity table { width: auto ! important; }');

// essex
addGlobalStyle('div.corporate-top-nav, a.mobilemenubtn, div#coporate-footer, div.page_amenites, div#footer-nav, div#mobilemenu { display: none ! important; }');

// mlsmatrix
addGlobalStyle('div.aspNetHidden, div#_ctl0_m_pnlHeader, div#_ctl0_m_pnlSaveSearch { display: none ! important; }');
addGlobalStyle('div.portalPage div, div#m_ucBanner_m_divTopRight { position: static ! important;  height: auto ! important;  width: auto ! important; }');
addGlobalStyle('div.portalContent { width: 100% ! important; }');

// hotpads
addGlobalStyle('div#firstRowFilterBasic, div#mainHeader, div#actions-block, div#actions-float, div#areas, div#schoolAreas, div#actions-block-low, div#recommendedListings, div#footerSurround, div#advancedFilterDiv { display: none ! important; }');

// walkscore
addGlobalStyle('div#footer, div#nearby-and-faves, div#hood-promo, div#rentals, div#crime-grade, div#transit, div#getting-around, div#mobile-static-map, div#login-menu, div#address-bar { display: none ! important; }');

// avalon
addGlobalStyle('div.modal-dialog { display: none ! important; }');

// trulia
addGlobalStyle('div#recaptcha_tabber_modal, div#photoPlayerModal, div#tagPhotoModal, nav, li.streetviewTabContent, li.mapTabContent, div.send_email_to_agent_loader, p.contact_form_legalese, div#ratings_and_reviews, table#write_review_select_topics_popup, ul#places_map_module, div#rentCalculatorWidget, li#schoolsModule { display: none ! important; }');

// rent.com
addGlobalStyle('div.modal, div#mast-global-nav, nav, section#pdp-similar, section#pdp-neighborhood, section#pdp-movingcenter, form.modal, div.carousel, div.property-actions, a.btn-reward { display: none ! important; }');


// craigslist post search link - adapted from mmmturkeybacon Brittany Graham Revenue script

if ( $('p.postinginfo:contains("post id:")').length > 0 )
{ 
    var PostIdPara = $('p.postinginfo:contains("post id:")');
    var PostId = PostIdPara.text().replace("post id: ", "");
    var GoogleLuckyURL = "http://www.google.com/search?ie=UTF-8&oe=UTF-8&sourceid=navclient&gfns=1&btnI=745&q=" + PostId + " " + "site:craigslist.org";
    PostIdPara.html('<a href="' + GoogleLuckyURL + '" target="_blank">' + PostIdPara.text() + '</a>');
}
