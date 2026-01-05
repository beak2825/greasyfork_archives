// ==UserScript==
// @name        Wanikani Audio Button Sizer
// @namespace   wk_audiobuttonsizer
// @description Makes the audio button 30x30 and bordered so it's easier to press
// @author      Hunter Pankey
// @include     http://www.wanikani.com/lesson/session*
// @include     https://www.wanikani.com/lesson/session*
// @version     1.0.0
// @grant       GM_addStyle
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require     http://code.jquery.com/jquery-2.0.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/9702/Wanikani%20Audio%20Button%20Sizer.user.js
// @updateURL https://update.greasyfork.org/scripts/9702/Wanikani%20Audio%20Button%20Sizer.meta.js
// ==/UserScript==

/*
 *  ====  Wanikani Audio Button Sizer  ====
 *    ==    by Hunter Pankey     ==
 *
 *  The button to press to play the audio sample is way too small. It's bounded
 *  by the size of the speaker icon that's displayed by default. This changes it
 *  30x30 pixels with a black border to signify that the clickable/tappable area
 *  is significantly larger.
 */
 
/*
 *	This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
/*
 *	=== Changelog ===
 *  1.0.0 (5 May 2015)
 *  - First release.
 */
GM_addStyle('.audio-btn { width: 30px; height: 30px; border: 1px solid black; }');