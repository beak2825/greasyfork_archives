// ==UserScript==
// @name        osu! Download from mirror
// @namespace   http://www.icycat.com
// @description Download beatbaps from mirror site
// @author      冻猫
// @include     *osu.ppy.sh/b*
// @include     *osu.ppy.sh/s*
// @version     1.6
// @downloadURL https://update.greasyfork.org/scripts/796/osu%21%20Download%20from%20mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/796/osu%21%20Download%20from%20mirror.meta.js
// ==/UserScript==

(function($) {

	var mirrorDown = '<div id="mirroDown" style="float:right;width:100px;"><button id="mirrorBloodcat" style="background-color:#78AB23;border:1px solid;border-radius:5px;color:#FFFFFF;cursor:pointer;font-size:1.5em;font-weight:bold;height:130px;margin:4px 1px 0 5px;width:96px;">Download from bloodcat</button></div>';

	$('.beatmapDownloadButton:first').before(mirrorDown);

	document.getElementById('mirrorBloodcat').onclick = function() {
		location.href = 'https://bloodcat.com/osu' + $('.beatmapDownloadButton:last a').attr('href').replace('d', 'm');
	}

})(unsafeWindow.$);