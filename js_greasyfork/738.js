// ==UserScript==
// @name Rotten Tomatoes Movie ID Logger
// @description This script will simply console log the movie ID of the rotten tomatoes entry you are viewing.
//
// @author Matthew Sanders <matthew@button-mashers.net>
// @namespace https://github.com/Clearmist
//
// @license GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
//
// @include http://www.rottentomatoes.com/m/*/
//
// @require http://code.jquery.com/jquery-1.8.0.min.js
//
// @version 1.0
//
// @run-at document-start|document-end
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/738/Rotten%20Tomatoes%20Movie%20ID%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/738/Rotten%20Tomatoes%20Movie%20ID%20Logger.meta.js
// ==/UserScript==
 
/**
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
 
/**
* SCRIPT DESCRIPTION.
*
* @see http://wiki.greasespot.net/API_reference
* @see http://wiki.greasespot.net/Metadata_Block
*/
(function() {
	$(document).ready( function() {
		console.log( "======== Rotten Tomatoes Movie ID ========" );
		console.log( $('meta[name=movieID]').attr("content") );
		console.log( "==========================================" );
	});
})();