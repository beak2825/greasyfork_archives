// ==UserScript==
// @name         Inline Audio Player
// @version      1.3
// @description  Add to every link to an audio file (.mp3 .wav .ogg .m4a .mp4) on page a tiny button for play music with inline player. Use Html5 <audio> tag.
// @author       Restpeace
// @match        *
// @include      *
// @exclude      http://www.inoreader.com/*
// @exclude      https://www.inoreader.com/*
// @exclude      http://instagram.com/*
// @exclude      https://instagram.com/*
// @grant        none
// @require 	 http://code.jquery.com/jquery-2.1.3.js
// @namespace https://greasyfork.org/users/8668
// @downloadURL https://update.greasyfork.org/scripts/8218/Inline%20Audio%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/8218/Inline%20Audio%20Player.meta.js
// ==/UserScript==

	$("body").before ("<style>" +
                      ".buttonPlay {font-size: 11px; background-color: #fff0a0; font-family: Trebuchet MS; padding: 2px 5px; margin-right: 6px;}" +
                      ".infoSong { margin: 4px; font-size: 11px; font-family: Trebuchet MS; font-style: italic;}" +
                      "</style>");

    var audio_links = $("a[href*='.mp3'], a[href*='.wav'], a[href*='.ogg'], a[href*='.m4a'], a[href*='.mp4']");
    var hasMp3 =  audio_links.length > 0;
	var NrAudio  =  audio_links.length;
	if (hasMp3) {
		$("body").children().first().before("<div id='ButtStartIAP'>" + 
                  " * <button style='background-color: #b0e0e6;'>" +
                  NrAudio + " Audio links. Click for start inline play</button> * </div>");
        $("#ButtStartIAP").click (InsPlayButtons);
    }

function InsPlayButtons() {
	// console.log("Inline Mp3 Player start.... N. page links: " + audio_links.length);
    $("#ButtStartIAP").remove();
	if (hasMp3) {
		for (var i = 0; i < audio_links.length; i++) {
            $(audio_links[i]).before ("<button id='B"+i+"' class=\"buttonPlay\">Play</Button>");
            $("#B"+i).attr("formaction", audio_links[i].href);
            $("#B"+i).click (startPlay);  
            } 
    } //if hasMp3
}            

function DestroyPlayer() {
        if ( $("#NewAudioPlayer").size() > 0) { 
             var buttonId = $("#NewAudioPlayer").attr("buttonId");
             $("#"+buttonId).html("Play")
             $("#"+buttonId).css ("background-color","#fff0a0");  
    		 $("#"+buttonId).click(startPlay)
             $("#NewAudioPlayer").parent().remove()
        }
}            

function startPlay() {
    if (!hasMp3) {return false}
	DestroyPlayer();
	$ ("#" + this.id + " + a").after ("<div id='div" + this.id + "'></div>");
    $ ("#div"+this.id).append("<audio id='NewAudioPlayer'></audio>");
    $("#" + this.id).html("Stop")
    $("#" + this.id).css ("background-color","#ffa0f0");  
    $("#" + this.id).click(stopPlay)
    $("#NewAudioPlayer").attr("controls", "controls");
    $("#NewAudioPlayer").attr("src", $("#"+this.id).attr("formaction"));
    $("#NewAudioPlayer").attr("buttonId", this.id);
    $("#NewAudioPlayer").bind('durationchange', function() { WritePlayInfo(this); } );
    $("#NewAudioPlayer").bind('ended'		  , function() { PlayNext(this); 	  } );
    $("#NewAudioPlayer").bind('error'		  , function() { ErrorEvent("error"  );  } );
    $("#NewAudioPlayer").bind('stalled'		  , function() { ErrorEvent("stalled");  } );
    $("#NewAudioPlayer").get(0).play();
}

function ErrorEvent(evento) {
   // console.debug ("Error! (Event:" + evento + ")", divId );
   if (evento == "error") { evento = evento + " during the loading" }
   $("#NewAudioPlayer").parent().after("<div>*** Error! (Event:" + evento + ") ***</div>");
   stopPlay();
}


function WritePlayInfo(NAP) {
    durata = NAP.duration; 
    // console.debug (NAP.src, durata);
    durata_min = parseInt(durata/60); 
    durata_sec = parseInt(durata-(parseInt(durata/60)*60));
    durataf = durata_min + ":" + durata_sec;
    buttonId = $("#"+NAP.id).attr("buttonId");
    divId = "#div" + buttonId;
    // console.debug (buttonId, divId);
    urlplayed = $("#" + buttonId + " + a").attr("href");
    $ (divId).append("<br/><div class='infoSong'>url: " + decodeURI (urlplayed) + " - durata:" + durataf + "</div>");
}

function PlayNext(NAP) {
    buttonId = $("#"+NAP.id).attr("buttonId");
    nId = parseInt( buttonId.substring (1,buttonId.length) );
    if (nId >= NrAudio-1) {
        console.debug ("Stop Playing"); return false 
    } 
    nId = nId+1;
    console.debug ("---- Play next. Song n.", nId+1, " of ", NrAudio);
    $("#B" + nId).click();
}

function stopPlay() {
    DestroyPlayer();
    $("#" + this.id).html("Play")
    $("#" + this.id).click(startPlay)
}