// ==UserScript==
// @name           iCheckMovies - Internal IMDB links
// @namespace      icheckmovies.com
// @description    Open IMDB links in the same tabs when using icheckmovies
// @include        http://*.icheckmovies.com/movie*
// @include        https://*.icheckmovies.com/movie*
// @version 1.02
//
// @history	1.02 removed external update checker dependency. fixed for imdb https. support for beta site
// @history	1.01 Restored IMDB icon & altered support for the beta
// @history	1.00 Initial release
// @downloadURL https://update.greasyfork.org/scripts/7846/iCheckMovies%20-%20Internal%20IMDB%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/7846/iCheckMovies%20-%20Internal%20IMDB%20links.meta.js
// ==/UserScript==


//Replace external link opening code
var html = document.body.innerHTML;
//Visit IMDB page (menu link)
html = html.replace( /class="optionIcon optionIMDB external" /g, '/class="optionIcon optionIMDB"' );
//View IMDB information (main link)
html = html.replace( /class="icon iconSmall iconIMDB external" /g, '/class="icon iconSmall iconIMDB"' );
html = html.replace( /class="button is-imdb external" /g, '/class="button is-imdb"' );

document.body.innerHTML = html;