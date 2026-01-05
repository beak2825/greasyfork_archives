// ==UserScript==
// @name        Kinozal Poster
// @namespace   KinozalTv
// @description Konozal.tv poster preview
// @include     http://kinozal.tv/browse.php*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6554/Kinozal%20Poster.user.js
// @updateURL https://update.greasyfork.org/scripts/6554/Kinozal%20Poster.meta.js
// ==/UserScript==

jQuery(document).ready(function ($) {
	var number = 0;
	$("table .bg").each(function (index) {

		var sitas = $(this);
		var blokas = sitas.find('.nam');
		var nuoroda = sitas.find('.r1, .r0, .r2, .r3').attr('href');

		setTimeout(function () {


			number += 1;
			//sitas.find('.tt').append('<div style="float:left;">' + number + nuoroda + '</div>');

			$.ajax({
				url: nuoroda,
				context: document.body
			}).done(function (data) {
				var result = '';
				var step = 5;
				var pradzia = data.indexOf('class="img');
				if (pradzia != -1) {
					var kerpam = data.substr(pradzia, 500);
					var url_start = kerpam.indexOf('src="') + step;
					kerpam = kerpam.substr(url_start, 400);
					var url_end = kerpam.indexOf('"');
					result = kerpam.substr(0, url_end);

					blokas.append('<a style="float: left; margin: 0 10px 0 0" href="' + nuoroda + '" target="_blank"><img style="border solid 2px #000000 !important;max-width:100px" src="' + result + '" alt="" /></a>');
					$.cookie(ckey, result, {expires: 7, path: '/'});
				}
			});


		}, index * 500);

	});

});