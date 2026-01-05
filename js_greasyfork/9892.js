// ==UserScript==
// @name         Mirko Live
// @namespace    http://www.wykop.pl/
// @version      0.4.5.1
// @description  stream wpisów na żywo
// @author       You
// @match        http://www.wykop.pl/mikroblog/*
// @match        http://www.wykop.pl/wpis/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9892/Mirko%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/9892/Mirko%20Live.meta.js
// ==/UserScript==

var interwal_ms, sound_1;
var audio = new Audio();

handleDefaultAjaxRefresh = function($el, data) {

	if (data.html) {
		$el = $("#itemsStream");
		var list = $($(data.html).html());
		list.find('.dC').addClass('newComment');
		$d = list.prependTo($el);
		$e = $d.find('div.media-content');
		$e.hide();
		//console.log('length ' + $d.length);

		var h = 0;
		$d.each(function(){
			h += $(this).outerHeight();
			//console.log(h);
		});
		//console.log('B ' + h);

		var t = $(window).scrollTop();


		if (t){
        	$(window).scrollTop(t + h + 3);

        	$e.each(function(i){
        		$(this).find('img').one('load', function(){
        			var $Dd = $(this).closest('.media-content');
        			$Dd.show();
        			var heiHgt = $Dd.outerHeight();
        			//console.log(heiHgt);
        			$(window).scrollTop($(window).scrollTop() + heiHgt + 13);
        		});
        	});
    	} else {
    		$e.show();
    	}

		$el.find('.newComment').animate({
			"border-left-color": 'transparent'
		}, 2000);

		if (sound_1) {
			audio.play();
		}

		$("#newEntriesCounter").text("");
		//$("#rightFooterBoxCounter").find(".active-counter").text("");
		//$("#rightFooterBoxCounter").hide();
		console.log('nowy wpis - dodałem');
		wykop.bindLazy();

		setTimeout(function(){
			wykop.checkNewEntries();
		}, interwal_ms);

	} else {
		if (data.count > 0) {
			var lastItem = $(wykop.params.ajaxAutoRefresh.selector);
			var link = wykop.params.ajaxAutoRefresh.url + 'type/' + lastItem.data().type + '/id/' + lastItem.data().id + '/hash/' + wykop.params.hash + '/html/1';
			$("#newEntriesCounter").html("<div class=\"type-light-warning active-annotation\"><a href=\"#\" class=\"dark ajax space\" data-ajaxurl=\"" + link + "\">" + wykop.varietyFromNumber(data.count, ["PojawiĹ siÄ", "PojawiĹy siÄ", "PojawiĹo siÄ"]) + " <b class=\"red\">" + data.count + " " + wykop.varietyFromNumber(data.count, ["nowy wpis", "nowe wpisy", "nowych wpisĂłw"]) + "</b>, " + wykop.varietyFromNumber(data.count, ["pokaĹź go", "pokaĹź je", "pokaĹź je"]) + "</a></div>");
			console.log('nowe wpisy - klikam!');
			$('#newEntriesCounter > div > a').trigger("click");
			//$("#newEntriesCounter").fadeIn();
			//$("#rightFooterBoxCounter").show();
			//$("#rightFooterBoxCounter").find(".active-counter").text(data.count);
		} else {
			$("#rightFooterBoxCounter").hide();
			$("#newEntriesCounter").hide().text("");
			console.log('brak nowych wpisów!');
			setTimeout(function(){
				wykop.checkNewEntries();
			}, interwal_ms);
		}
	}
};

$(document).ready(function(){

	if (document.location.pathname.match('/mikroblog/')){

		// button/link do live
		$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block > ul:last-child').append('<li id="live"><a href="http://www.wykop.pl/mikroblog/live/"><span style="font-weight: bold; font-size: 30px; vertical-align: middle;" id="green_icon">•</span><span> live</span></a></li>');

		if (document.location.pathname.match('/live')){

			//ładowanie ustawień użytkownika z localstorage
			if (localStorage.mirkoLiveSound !== undefined && localStorage.mirkoLiveInterval !== undefined){
				interwal_ms = +localStorage.mirkoLiveInterval;
				sound_1 = +localStorage.mirkoLiveSound;

				// ładowanie panelu ustawień czita po prawej
				$('#site > div > div.grid-right.m-reset-float.m-reset-margin.m-reset-width.m-hide').prepend('<div class="r-block mirko-live"><h4>Mirko live ustawienia <a id="mirko-live-rozwin" href=""><i class="fa fa-chevron-down"></i></a> </h4><ul id="ukryte-ustawienia" <="" ul="" style="display: block;"><li><p>odświeżanie (ms)</p><select> <option value="50">50ms</option><option value="100">100ms</option><option value="150">150ms</option><option value="250">250ms</option><option value="350">350ms</option><option value="500">500ms</option><option value="1000">1000ms</option><option value="2000">2000ms</option><option value="5000">5000ms</option></select><p>dźwięk </p><select><option value="1">wł.</option><option value="0">wył.</option></select><br><p>zmień dźwięk (link do .mp3, .wav)</p><input type="text" name="audio_url" id="audio_url"><br><a href="#" style="color:red" id="deafult_audio">przywróć domyślny dźwięk</a><br><br><button class="submit " tabindex="2" id="mirko-live-save">zapisz</button></li></ul></div>');
				$("#ukryte-ustawienia > li > select:nth-child(2) > option[value='" + interwal_ms + "']").attr("selected","selected");
				$("#ukryte-ustawienia > li > select:nth-child(4) > option[value='" + sound_1 + "']").attr("selected","selected");
			} else {
				interwal_ms = 250;
				sound_1 = 1;
				localStorage.mirkoLiveInterval = 250;
				localStorage.mirkoLiveSound = 1;
				$('#site > div > div.grid-right.m-reset-float.m-reset-margin.m-reset-width.m-hide').prepend('<div class="r-block mirko-live"><h4>Mirko live ustawienia <a id="mirko-live-rozwin" href=""><i class="fa fa-chevron-down"></i></a> </h4><ul id="ukryte-ustawienia" <="" ul="" style="display: block;"><li><p>odświeżanie (ms)</p><select> <option value="50">50ms</option><option value="100">100ms</option><option value="150">150ms</option><option value="250" selected>250ms</option><option value="350">350ms</option><option value="500">500ms</option><option value="1000">1000ms</option><option value="2000">2000ms</option><option value="5000">5000ms</option></select><p>dźwięk </p><select><option value="1" selected>wł.</option><option value="0">wył.</option></select><br><p>zmień dźwięk (mp3, wav)</p><input type="text" name="audio_url" id="audio_url"><br><br><button class="submit " tabindex="2" id="mirko-live-save">zapisz</button></li></ul></div>');
			}

			//zwiń panel ustawień
			$('#ukryte-ustawienia').hide();

			// ładowanie Audio
			if (localStorage.mirkoLiveAudio !== undefined){
				audio.setAttribute('src', localStorage.mirkoLiveAudio);
				audio.load();
			} else {
				//default audio
				audio.setAttribute('src', 'http://www.soundjay.com/switch/switch-7.wav');
				audio.load();
			}


			// start funkcji 
			wykop.handleDefaultAjaxRefresh = handleDefaultAjaxRefresh;
			setTimeout(function(){
				wykop.ajaxAutoRefreshJob = function(){};
			},4000);

			// button "live"
			$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block > ul:nth-child(3) > li.active').removeClass('active');
			$('#live').html('<li class="active"><a href="http://www.wykop.pl/mikroblog/live/"><span style="color: green; font-weight: bold; font-size: 30px; vertical-align: middle;" id="green_icon">•</span><span> live</span></a></li>');

			// rozwijanie panelu ustawień
			$('#mirko-live-rozwin').on('click', function(e){
				e.preventDefault();
				var t = $(this);
				 t.children(':first').toggleClass('fa-chevron-down fa-chevron-up');
				 $('#ukryte-ustawienia').toggle();
			});


			// zapisywanie ustawień
			$('#mirko-live-save').on('click', function(e){
				e.preventDefault();

				interwal_ms = +$('#ukryte-ustawienia > li > select:nth-child(2)').val();
				sound_1 = +$('#ukryte-ustawienia > li > select:nth-child(4)').val();
				localStorage.mirkoLiveInterval = interwal_ms;
				localStorage.mirkoLiveSound = sound_1;

				var t = $('#audio_url').val();
				if (t.length > 0){
					audio.setAttribute('src', t);
					localStorage.mirkoLiveAudio = t;
					audio.load();
				}

				$('#ukryte-ustawienia').slideUp('1000', function(){
					$('#mirko-live-rozwin > i').toggleClass('fa-chevron-down fa-chevron-up');
				});

			});

			// przywracanie domyślnego dźwięku

			$('#deafult_audio').on('click', function(e){
				e.preventDefault();
				localStorage.removeItem('mirkoLiveAudio');
				alert('Przywrócono domyślny dźwięk, odźwież stronę');
			});


			// animacja buttona "live"
			setInterval(function(){
				$('#green_icon').css('visibility','hidden');
				setTimeout(function(){
					$('#green_icon').css('visibility','visible');
				},1000);
			},2000);


			// czyszczenie starych wpisów
			setInterval(function(){
				$('#itemsStream > li:nth-child(n+50)').remove();
				console.log('usunięto stare wpisy');
			},30000);

		}
	}

	if (document.location.pathname.match('/wpis/')){
		$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block > ul:last-child').append('<li id="live"><a href="http://www.wykop.pl/mikroblog/live/"><span style="font-weight: bold; font-size: 30px; vertical-align: middle;" id="green_icon">•</span><span> live</span></a></li>');
	}

	/*
	if (document.location.pathname.match('/tag/')){
		var tagName = $('#input-tag').val();
		$('div.rbl-block.media-header > div > ul:nth-child(4)').append('<li id="live"><a href="http://www.wykop.pl/tag/wpisy/' + tagName + '/#live"><span style="font-weight: bold; font-size: 30px; vertical-align: middle;" id="green_icon">•</span><span> live</span></a></li>');

		if (location.hash == '#live' || location.hash == '#live/') {
			$('div.rbl-block.media-header > div > ul:nth-child(4) > li').removeClass('active');
			$('#live').html('<li class="active"><a href="http://www.wykop.pl/tag/wpisy/' + tagName + '/#live"><span style="color: green; font-weight: bold; font-size: 30px; vertical-align: middle;" id="green_icon">•</span><span> live</span></a></li>');
		}
	}
	*/
});