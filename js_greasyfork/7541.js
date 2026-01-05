//
//	    NirvanaHQ Mod
//	Copyright © 2015    Anton Chugunov
//
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, either version 3 of the License, or
//	(at your option) any later version.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// ==UserScript==
// @name            NirvanaHQ Mod
// @namespace       trm81
// @description     Some modification for site nirvanahq.com.
// @version         0.01
// @include         https://*.nirvanahq.com/*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant           None
// @copyright       2015 Anton Chugunov (https://greasyfork.org/en/users/6997-trm81)
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/7541/NirvanaHQ%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/7541/NirvanaHQ%20Mod.meta.js
// ==/UserScript==

$(document).ready(function()
{
    var div_note_css = " \
        div.tasklist > ul.tasks > li.task div.infinity { \
        	font-size: 14px; \
        	max-width: 1800px; \
        }"

    var head = $(document.head);
    var style = $("<style></style>");
    style.html(div_note_css);
    head.append(style);
});
