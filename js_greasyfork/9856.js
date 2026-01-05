// ==UserScript==
// @name        AutoEdit (IMDB) [KAT]
// @namespace   PXgamer
// @include     *localhost:999/kat/upload2
// @include     *kickass.to/*.html
// @include     *kickass.to/torrents/edit/*
// @include     *kat.cr/*.html
// @include     *kat.cr/torrents/edit/*
// @description If possible, will provide the IMDb and will  provide the best detected quality
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9856/AutoEdit%20%28IMDB%29%20%5BKAT%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9856/AutoEdit%20%28IMDB%29%20%5BKAT%5D.meta.js
// ==/UserScript==

//var title = $('#torrent_title').html();
//console.log(title);
//title = title.match(/.*[0-9]{4}/)[0];
//console.log(title);
//title = title.replace(/\s/g, '+');
//console.log(title);

//gUrl = 'https://www.google.com/search?q='+title+'+site%3Aimdb.com';

var pathname = window.location.pathname;
var hash = window.location.hash;
if (pathname.contains('/torrents/edit/')) {
    $('#tvrage_id').focus();
    $('#tvrage_id').select();
    if (hash.contains('#tvrage-')) {
      $('#tvrage_id').val(hash.split('-')[1]);
      setTimeout(function() {$('#butupload').click();},250);
    }
    if ($('#bbcode').val().contains("imdb.com/title/tt")) {
      var txt = $('#bbcode').val();
      txt = txt.split("imdb.com/title/tt")[1];
      txt = txt.substring(0, 7);
      $('#imdbid').after(' <span class="pointer" id="setIMDbId">'+txt+'</span> <span class="pointer" id="setIMDbIdAndQuality">[Set both]</span>');
    }
    var t = $('#output a').first().text().toLowerCase().split("-").join("").split(".").join(" ");
    dq = "Unknown";
		if (t.contains('camrip')||t.contains(' cam ')||t.contains('hdcam')||t.contains('hqcam')) {
			dq = "Cam";
		} else if (t.contains('dvdscr')||t.contains(' scr ')) {
			dq = "Screener";
		} else if (t.contains(' ts ')||t.contains('telesync')||t.contains('hdts')) {
			dq = "TeleSync";
		} else if (t.contains('dvd')) {
			dq = "DVDRip";
		} else if (t.contains('hdtv')) {
			dq = "TVRip";
		} else if (t.contains('vcdrip')||t.contains(' vcd ')) {
			dq = "VCD";
		} else if (t.contains('bdrip')) {
			dq = "BDRip";
		} else if (t.contains('hdrip')) {
			dq = "HDRiP";
		} else if (t.contains('vhsrip')) {
			dq = "VHSRip";
		} else if (t.contains('bluray')||t.contains('brrip')||t.contains('webrip')||t.contains('webdl')) {
			if (t.contains('webrip')||t.contains('webdl')||t.contains('webhd')) {
				dq = "WEB-DL";
			}else if (t.contains('720')&&t.contains('720x')==false){
				dq = "720p";
			}else if (t.contains('1080')){
        dq = "1080p";
      }else{
        dq = "Blu-Ray";
      }
		}
    if (dq == "Unknown") {
      if (t.contains('264')) {
        dq = "x264";
      }else if (t.contains("xvid")||t.contains("divx")){
        dq = "MPEG-4";
      }else{
        dq = "Unknown";
      }
    }
    $('#quality').after(' <span class="pointer" id="setQuality">'+dq+'</span>');

    $('#aquality').attr('onchange', "$('#anidbid').focus().select();");
    $('#quality').attr('onchange', "$('#imdbid').focus().select();");
}

function selectItemByValue(elmnt, value){
  for(var i=0; i < elmnt.options.length; i++) {
    if(elmnt.options[i].value == value)
      elmnt.selectedIndex = i;
  }
}
$('#setIMDbId').click(function() {
  $('#imdbid').val($('#setIMDbId').html());
  //$('#imdbid').focus();
  setTimeout(function() {$('#butupload').click();},250);
});
$('#setQuality').click(function() {
  selectItemByValue(document.getElementById('quality'), $(this).text());
  $('#imdbid').focus();
});
$('#setIMDbIdAndQuality').click(function(){
  $('#setQuality').click();
  $('#setIMDbId').click();
});
$('#autoEditTorrents').click(function() {
  $('[href^="/torrents/edit/"]').each(function() {
    $(this).attr('href', $(this).attr('href')+"#autoFill");
  });
});
$('#addTvRageId').click(function() {
  $('[href^="/torrents/edit/"]').each(function() {
    $(this).attr('href', $(this).attr('href').split('#')[0]+"#tvrage-"+$('#tvRageId input').val());
  });
});
$('#toggleTvRageAdd').click(function() {
  $('#tvRageId').toggle();
});
if (hash=="#autoFill"){
  $('#setIMDbIdAndQuality').click();
}

if (pathname.contains('.html')) {
  if ($('span[id^="cat_"]').html().indexOf('Movies') >= 0) {
    if ($('#desc').html().contains("imdb.com/title/tt")) {
      var txt = $('#desc').html();
      txt = txt.split("imdb.com/title/tt")[1];
      txt = txt.substring(0, 7);
      var editLink = $('li a[href^="/torrents/edit/"]').first();
      editLink.addClass('inlineblock');
      if ($('.dataList a[href*="www.imdb.com/title/tt'+txt+'"]').length > 0) {
        editLink.parent().append(' <a style="opacity:0.33;" class="inlineblock" href="'+editLink.attr('href')+'"><i class="menuValue"> Correct IMDb set</i></a>');
      }else {
        editLink.parent().append(' <a class="inlineblock" href="'+editLink.attr('href')+'#autoFill"><i class="menuValue"> Auto Edit</i></a>');
      }
      
    }else{
      printNull('IMDb not found');
    }
    
  }else{
    printNull('Not Movies cat');
  }
}

function printNull(ptxt) {
  var editLink = $('li a[href^="/torrents/edit/"]').first();
  editLink.addClass('inlineblock');
  editLink.parent().append(' <a style="opacity:0.33;" class="inlineblock" href="'+editLink.attr('href')+'"><i class="menuValue"> '+ptxt+'</i></a>');
}