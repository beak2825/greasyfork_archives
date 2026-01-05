// ==UserScript==
// @name         Mirrorek+
// @namespace    http://www.wykop.pl/
// @version      1.0.0
// @description  Narzędzie do mirrorowania wpisów i znalezisk. 
// @author       http://www.wykop.pl/ludzie/rok2015/
// @match        http://*.wykop.pl/wpis/*
// @match        http://*.wykop.pl/moj/*
// @match        http://*.wykop.pl/link/*
// @require 	 https://greasyfork.org/scripts/7223-moment-js/code/Momentjs.js?version=29866
// @require      https://greasyfork.org/scripts/7243-spin-js/code/Spinjs.js?version=29979
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7273/Mirrorek%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/7273/Mirrorek%2B.meta.js
// ==/UserScript==


(function() {

	//////

	// Jeżeli nie chcesz dodawać automatycznie mirrora w powiązane znaleziska zmień poniżej true na false i zapisz. 

	var automatyczne_Powiazane = true;

	/////



	//settings
	moment.locale("pl");
	var entryNumber = parseInt(localStorage.getItem('mirrorek.Number')) || 0; //liczba wpisów
	var entryCounter = parseInt(localStorage.getItem('mirrorek.Counter')) || 0; //licznik localstorage 
	var thisLink = $('#itemsStream > li > div.wblock.lcontrast.dC > div > div.author.ellipsis > a:last-of-type').attr('href'); //link wpisu


	// dane o wpisie ładowane do tablicy
	function entryData() {
		var arrayLocaldata = new Array();
		arrayLocaldata[0] = $('.showProfileSummary:first > b').text(); //nick 
		arrayLocaldata[1] = $('.showProfileSummary:first > b').css('color'); //kolor nicka
		arrayLocaldata[2] = $('#itemsStream > li > div.wblock.lcontrast.dC > a.profile > img').attr('data-original'); //avatar 
		arrayLocaldata[3] = $('#itemsStream > li > div.wblock.lcontrast.dC > div > div.author.ellipsis > a:last-of-type > small > time').attr('title'); //data dodania wpisu
		arrayLocaldata[4] = $('#itemsStream > li > div.wblock.lcontrast.dC > div > div.author.ellipsis > a:last-of-type').attr('href'); //link do wpisu 
		arrayLocaldata[5] = $('#itemsStream > li > div.wblock.lcontrast.dC').data("id"); //id wpisu
		arrayLocaldata[6] = $('#itemsStream > li:nth-child(1) > div > div > div.text > p').html(); //treść wpisu
		arrayLocaldata[7] = $('a.profile > img').attr('class'); // kolor paska
		arrayLocaldata[8] = $('#itemsStream > li > div.wblock.lcontrast.dC > div > div.text > div.media-content > a').attr('href') || 0; //link do zdjęcia/video/gifa 

		arrayLocaldataJSON = JSON.stringify(arrayLocaldata); // tablica do JSON
	};




	//sprawdzenie dostępności mirrora na web.history 
	function title() {
		var requestLink = encodeURI("http://archive.org/wayback/available?url="+thisLink+"&callback=?");
    	$.getJSON(requestLink, function(result) {
    		$("li.mirror > a").prop('title','Brak mirrora');
    		$("li.mirror > a> i").css("color","#F62817");
        	available = result.archived_snapshots.closest.available;
        	timestamp = result.archived_snapshots.closest.timestamp;
        	ago = moment(timestamp + 0000, "YYYYMMDDhhmmss Z").fromNow();
        	if (available == true) {
            	$("li.mirror > a").prop('title','ostatni mirror: '+ago);
            	$("li.mirror > a> i").css("color","#85BB65");
        	};

    	});
	};


	//zapisywanie Wpisu 
	function saveMirror() {
		Dim();
		entryData();
		var saveLink = "http://web.archive.org/save/" + thisLink;
    	console.log('data '+arrayLocaldataJSON);
    	$.ajax({
         url: saveLink,
         type: "GET",
         crossDomain: true,
         beforeSend: function(xhr){xhr.setRequestHeader('Access-Control-Allow-Origin', '*');},
         success: console.log('sukces'),
         complete: function(data) {
         	entryCounter++;
        	localStorage.setItem('mirrorek.link'+entryCounter+'n', arrayLocaldataJSON );
        	localStorage.setItem('mirrorek.Counter', entryCounter);
        	entryNumber++;
        	localStorage.setItem('mirrorek.Number', entryNumber);
        	unDim();
        	alert("Mirror wykonany");
         	}
		});

	};





	if (document.location.pathname.match('/wpis/')) {

		//tworzymy ikonkę mirrora we wpisie 
		$('#itemsStream > li > div.wblock.lcontrast.dC > div > div.row.elements.actions > ul').append('<li class="mirror"><a href class="affect hide ajax"><i class="fa fa-flag-o"></i> mirror</a></li>');
		title();

		//wywołanie zapisywania 
		$("li.mirror > a").click(function() {
			saveMirror();
		});

	};






	// dim background & spinner
	var opts = {lines: 13, length: 13, width: 6, radius: 19, corners: 1, rotate: 0, direction: 1, color: '#000', speed: 1, trail: 64, shadow: true, hwaccel: false, className: 'spinner', zIndex: 2e9, top: '50%', left: '50%'};	
	var spinner; 

	function Dim() {
		$('body').append('<div id="spinOverlay" class="overlay" style="display: block;"></div><div id="spinnerek" class="lightbox" style="display: block; top: 300px; left: 0px;"></div>');
		var target = document.getElementById('spinnerek');
		spinner = new Spinner(opts).spin(target);
	};

	function unDim() {
		spinner.stop();
		$('#spinOverlay').remove();
		$('spinnerek').remove();
	};







	// tworzenie menu "mirrorek"
	if (document.location.pathname.match('/moj/')) {
    	$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block > ul:nth-child(3) > li:nth-child(3)').after('<li id=mir><a href="http://www.wykop.pl/moj/mirrorek"><span>mirrory <b>('+entryNumber+')</b></span></a></li>');
	};








	//zakładka mirrorek - lista wpisów 
	if (document.location.pathname.match('/mirrorek/')) {
		//menu
    	$('ul:nth-child(3) > li.active').removeClass('active');
    	$('#mir').addClass('active');
    	$('.entry.iC ').remove();
    	$('.link.iC ').remove();
    	$('div.wblock ').remove();

    	$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block > ul:nth-child(2) > li:nth-child(1)').removeClass('active').html('<a href="#" id="zapisz" class="ajax">zapisz</a>');  //zakładka zapisz
		$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block > ul:nth-child(2) > li:nth-child(2)').removeClass('active').html('<a href="#" id="import" class="ajax">importuj</a>'); //zakładka importuj 

	    //wypisuje listę mirrów 
	    x = 1
	    while (x <= entryCounter) {
	        var getArray = JSON.parse(localStorage.getItem('mirrorek.link'+x+'n')) || 0; 
	        console.log(x);
	        if (getArray == 0) {
	        	x++;
	        } else {
	        	var author = getArray[0]; //autor
	        	var color = getArray[1]; //kolor nicka
	        	var avatar = getArray[2]; //avatar 
	        	var addDate = getArray[3]; //data wpisu
	        	var link = getArray[4]; //link do wpisu
	        	var idWpis = getArray[5]; //id wpisu
	        	var paragraf = getArray[6]; //treść wpisu 
	        	var avatarClass = getArray[7]; //kolor paska
	        	var mediaWpis = getArray[8]; //załącznik wpisu
	        	var linkToMirror = "http://web.archive.org/web/"+link; //link do mirrora 
	        	var linkToAll = "http://web.archive.org/web/*/"+link; //link do wszystkich 
				var timeMoment = moment(addDate, "YYYY-MM-DD HH:mm:ss").fromNow(); 

				// dodawanie załącznika do wpisu 
	        	var divMedia;
	        	if (mediaWpis === undefined) {
	        		divMedia = "";
	        	}
	        	else if (mediaWpis !== 0 ) {
	        		divMedia = '<div class="media-content hide-image" data-type="entry"><a href="'+mediaWpis+'" data-open="1" class="ajax" data-ajaxurl="http://www.wykop.pl/ajax2/embed/html/type/entry/id/'+idWpis+'/">[zobacz media]</a></div>'
	        	}
	        	else {
	        		divMedia = "";
	        	}


	        	//ładowanie wpisu 
	        	$('#site > div > div.grid.m-reset-float > div > div.nav.bspace.rbl-block').after('<ul id="itemsStream" class="comments-stream"><li class="entry iC"><div class="wblock lcontrast dC  " data-id="'+idWpis+'" data-type="entry"><a name="" style="position: relative; top: -120px">&nbsp;</a><a class="profile" href="http://www.wykop.pl/ludzie/'+author+'/" title=""><img class="'+avatarClass+'" alt="" src="'+avatar+'"></a><div><div class="author ellipsis "><a class="showProfileSummary" href="http://www.wykop.pl/ludzie/'+author+'/" title=""><b style="color:'+color+'">'+author+' </b></a><a href="'+link+'"><small class="affect"><time title="'+addDate+'" pubdate="">'+timeMoment+'</time></small></a><small class="affect"></small></div><div class="text"><p>'+paragraf+'</br>'+divMedia+'</p></div><div class="row elements actions"><a href="'+linkToMirror+'" class="affect hide"><i class="fa fa-chain"></i> Ostatni</a><a href="'+linkToAll+'" class="affect hide"><i class="fa fa-chain"></i> Wszystkie</a><a href="'+link+'" class="affect hide"><i class="fa fa-chain"></i> Wykop</a><a href=" " class="affect hide ajax" id="mirrorek.link'+x+'n"><i class="fa fa-trash-o"></i> Usuń</a></div></div></div></div></li></ul>');
	        	x++;
	        };
	    };



	    // usuwanie wpisu z localstorage, zmiana liczby mirrorów 
	    $('a.affect.hide.ajax').click(function() {
	        localStorage.removeItem($(this).attr('id'));
	        $(this).closest('.comments-stream').hide();
	        entryNumber--;
	        localStorage.setItem('mirrorek.Number', entryNumber);
	    });



	    // naprawianie spoilerów w /mirrorek/
	    $('.showSpoiler').click(function() {
	    	$(this).css('display','none');
	    	$(this).next().addClass('spoilerBody').css('display','inline');
	    });




	    //zapisz mirrory do pliku 
	    $('#zapisz').click(function() {
		    text = [];
			var x = 1;
			while (x <= entryCounter) {
				var linkNumber = 'mirrorek.link'+x+'n';
				var storageItem = JSON.parse(localStorage.getItem('mirrorek.link'+x+'n')) || 0;
					if (entryCounter == 0) {
						alert("brak wpisów");
						return false;
					} else if (storageItem == 0) {
						x++;
					} 
					else {
						text[x] = [linkNumber, storageItem];
						console.log(text[x]);
						console.log("długość tablicy "+text.length);
						x++;
					}
			};
			textJSON = JSON.stringify(text);
			this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textJSON));
			this.setAttribute('download', "mirrorek-save.json");
			$(this).removeClass('ajax');
	    });



	    // importowanie wpisów z pliku, nie do końca wiem co tu sie dzieje
	    $('#import').click(function() {
			$('body').prepend('<div id="violationContainer"><div class="overlay" style="display: block;"></div><div id="zgloszenie" class="normal m-set-fullwidth m-reset-top m-reset-margin m-reset-left" style="height: 300px; width: 400px"><div style="position: absolute; top: 4%; left: 96%;"><a href="#" title="zamknij" class="fright close"><span class="icon inlblk mini closepreview"><i class="fa fa-times"></i></span></a></div><input type="file" id="input" style="position: absolute; left: 35%; top: 50%;"/></div></div>');
			function readSingleFile(e) {
				  var file = e.target.files[0];
				  if (!file) {
				    return;
				  }
				  var reader = new FileReader();
				  reader.onload = function(e) {
				    var contents = e.target.result;
				    displayContents(contents);
				  };
				  reader.readAsText(file);
			};

			function displayContents(contents) {
				var entryNumber = 0;
				localStorage.setItem('mirrorek.Number', entryNumber);

			 	listaJSON = JSON.parse(contents);
			  	
			  	var x = 1; 
			  	while (x <= listaJSON.length-1) {
			  		if (listaJSON[x] == null) {
			  			x++;
			  		}
			  		else {
			  		  	var klucz = listaJSON[x][0];
			  			console.log("klucz "+klucz);
			  			var wartosc = JSON.stringify(listaJSON[x][1]);
			  			localStorage.setItem(klucz, wartosc);
			  			console.log("liczkik = "+x);
			  			entryNumber++;
			  			localStorage.setItem('mirrorek.Number',entryNumber);
			  			x++;
			  		}
			  	localStorage.setItem('mirrorek.Counter', x);
			  	};
			  	if (x = listaJSON.length-1) {
			  		$('#violationContainer').remove();
			  		location.reload();
			  	}

			};

			document.getElementById('input')
			  .addEventListener('change', readSingleFile, false);
		});
	};



	// mirrorowanie znalezisk 
	if (document.location.pathname.match('/link/')) {

		//tworzymy przycisk
		$('#site > div > div.grid.m-reset-float > div > div:nth-child(1) > div.bspace > div > div.lcontrast.m-reset-float.m-reset-margin > div.row.elements.actions > ul').append('<li><a href="#" class="affect" id="mirror"><i class="fa fa-flag-o"></i> mirror</a></li>');

		var linkZnaleziskoSave = "http://web.archive.org/save/" + $('div.fix-tagline > span:nth-child(2) > a').attr('href');
		var linkZnalezisko = "http://web.archive.org/web/" + $('div.fix-tagline > span:nth-child(2) > a').attr('href');

		$('#mirror').click(function() {
			Dim();
			$.ajax({
	        url: linkZnaleziskoSave,
	        type: "GET",
	        crossDomain: true,
	        beforeSend: function(xhr){xhr.setRequestHeader('Access-Control-Allow-Origin', '*');},
	        success: console.log('link zapisany na web.history.org'),
	        complete: function(data) {
				console.log("sukces"+data);
				
					if (automatyczne_Powiazane == true) {

						(function sendPowiazane() {

							var request;
							var params;

							request = new XMLHttpRequest();

							var token = $('#__token').val();
							var title = "Mirror (web.archive.org) by #mirrorek"
							var url = linkZnalezisko;
							var link_id = $('input[name="trackback[link_id]"').val();
							var action = $('#addRelatedForm > form').attr('action');

							params = "&__token=" + token+ "&trackback[title]=" + title + "&trackback[url]=" + url + "&trackback[link_id]=" + link_id;
							console.log(params);

							request.open("POST", action, true);

							request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

							request.send(params);
							request.responseType = "document";

							request.onreadystatechange = function() {
								console.log(request.status);
								console.log(request.readyState);
								if(request.readyState == 4 && request.status == 200) {
									console.log(request.responseXML);
									(function() {
										if ($(request.responseXML).find('#site > div > div.grid.m-reset-float > div > div > div > div > div.row.buttons.text-right > div > a').attr('href') == "http://www.wykop.pl/") {
											unDim();
											alert('Przekroczony limit dodawania powiązanych, error');
										}
										else if ($(request.responseXML).find('#realted-add-form > fieldset:nth-child(1) > div').hasClass('error') == true) {
											unDim();
											alert('Link o tym adresie już istnieje, ale mirror został zaktualizowany');
										}
										else {
											unDim();
											alert('Mirror zapisany');
											location.reload();
										}
									})();
								}
							};

						})();
					};

				}
			});

		});
	}

})();