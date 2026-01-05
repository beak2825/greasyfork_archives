// ==UserScript==
// @name          EmSc2.tv ciemny chat gaminglive.tv
// @namespace     http://userstyles.org
// @description:pl	  EmSc2.tv ciemny chat gaminglive.tv 2.0
// @author        robert843
// @homepage      https://userstyles.org/styles/105528
// @include       http://gaminglive.tv/embed-chat/emil
// @include       http://www.gaminglive.tv/embed-chat/emil
// @include       http://www.gaminglive.tv/embed-player/emil
// @include       http://gaminglive.tv/embed-player/emil
// @include       http://emsc2.tv/
// @include       http://www.emsc2.tv/
// @require       http://code.jquery.com/jquery-latest.min.js
// @run-at        document-start
// @version       0.20150407163612
// @description EmSc2.tv ciemny chat gaminglive.tv 2.0
// @downloadURL https://update.greasyfork.org/scripts/9212/EmSc2tv%20ciemny%20chat%20gaminglivetv.user.js
// @updateURL https://update.greasyfork.org/scripts/9212/EmSc2tv%20ciemny%20chat%20gaminglivetv.meta.js
// ==/UserScript==

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.getElementById("js-player").requestFullscreen) {
      document.getElementById("js-player").requestFullscreen();
    } else if (document.getElementById("js-player").msRequestFullscreen) {
      document.getElementById("js-player").msRequestFullscreen();
    } else if (document.getElementById("js-player").mozRequestFullScreen) {
      document.getElementById("js-player").mozRequestFullScreen();
    } else if (document.getElementById("js-player").webkitRequestFullscreen) {
      document.getElementById("js-player").webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

$( document ).ready(function() {
	$("#pobj").attr("allowfullscreen","");
});

(function() {
var i = null;
var btn = jQuery('<div/>', {
    id: 'hidde_btn',
    onclick:'flowplayer().mute();',
});	
    $(document).bind('DOMNodeInserted', function(event) {
          if (event.target.id == 'js-player_api') {
          	
          	flowplayer().onLoad(function() {
          			btn.appendTo("#js-player");
          			var plugin = this.getPlugin("controls");
				plugin.css("progressColor", "#0092FD");
				plugin.css("volumeColor", "#0092FD");
				plugin.css("buttonOverColor", "#0092FD");
				
          	
          	});
          	flowplayer().onStart(function() {this.getClip().update({"live":false});});
          	
          	flowplayer().onBeforeFullscreen(function(){
			toggleFullScreen();
		  	return false;
          	});
          	
          	flowplayer().onMute(function(){
          		console.log("onMute");
          		btn.removeClass('volume_unmute');
          		btn.attr('onclick', 'flowplayer().unmute();');
		  	return false;
          	});
          	flowplayer().onUnmute(function(){
          		btn.addClass('volume_unmute');
          		btn.attr('onclick', 'flowplayer().mute();');
		  	return false;
          	});		
          	$("#js-player").on( "mousemove", function() {
          		clearTimeout(i);
          		$("#hidde_btn").fadeIn();
          		i = setTimeout('$("#hidde_btn").fadeOut();', 2500);
		});
		$("#js-player").on( "mouseleave", function() {
          		clearTimeout(i);
          		$("#hidde_btn").fadeOut();
		});
          }
    });

console.log("Step1");	
	//flowplayer().setVolume(0);
	var css = [
	".embed-notification-green { background-color: #0092fd !important;}",
	"#hidde_btn{background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQMEDEVJ0xdCwAAAJdJREFUSMftlMsRgCAMBR0rsBRLogRLSimWRAfrRWcgQow/TuwR4nvmxzB0OsAMxF/FAX4V/9xAi6cGQNiPpPDdcRdqwhOwUCCJSZGCeJ6x/tMaSbxoEy2eZYcTlakYoaLLctvAMDn1ZXwxC6t3YuKDEgV3iSpTFI0mh0KTxW3i2IPamIrVM/cmXyyamIvW9C1q8pp2Oi42aXJIgpGKlZkAAAAASUVORK5CYII=') no-repeat scroll 0 0 rgba(0, 0, 0, 0);color: #ffffff;cursor: pointer;height: 30px;margin: 11px;position: absolute;right: 0;top: 0;width: 30px;}",
	".volume_unmute{background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQLDicdvmDWLQAAATRJREFUSMe9VlF1xCAQnMRAqQMcFAmVEAmVkDqog0bCSTgJJ4E6iIPmFEw/Otzt8biENrT73r6wwJtZ5sFuOpJoaB7AbCf6huAjgAgg3MySbOGe5MJvi3ZtL3AgOWk88GpjC4Jgsh40d1S8kHS1BAkolwSSwwJ6c4qXGgKbZQKOcqf1ZG/ZKeIWgQVnQecEeFA8F/b4WnCatUMmiz1F0J6LTDmw0w0omdX/Rmdlb091Ujz1ABYAlH8CeN94UDOAD42f9T1lcdQ39AAefvFqj6Y0IC8PSrp5qShaawJfIjg3JJhLBA5AJ38E8FpBOmSAeebunkQLgEm34bwiw9Od25PicLlNP3zJux/aVi0KrUrFWjWdWhW7Gt9drmvb5K6Gs+bOSNO8Zf5L07c+iiTY+e6vf7y+ANyvBw4Enu20AAAAAElFTkSuQmCC') no-repeat scroll 0 0 rgba(0, 0, 0, 0) !important;}",
	".embed .tab-content {",
	"         background-color: #0D0D09 !important;",	
	"    }",
	"    ",
	"    .chat-messages .arr-side-right:after {",
	"        border-left-color: #131313 !important;",
	"    }",
	"    .chat-messages .content {",
	"        border: 1px solid #131313 !important;",
	"",
	"    }",
	"",
	"    .chat-messages .arr-side-left:after {",
	"        border-right-color: #131313 !important;",
	"    }",
	"    #js-chat{",
	"        background:#0D0D09 !important;",
	"    }",
	"    .btn-transparent{",
	"        color:#fff;",
	"",
	"    }",
	"    ",
	"    .btn-default {",
	"        background-color: #000 !important;",
	"        border: 1px solid #2F2F2F;",
	"    }",
	"    body{",
	"        color:#ffffff !important;",
	"    }",
	"    .author[style*=\"color: rgb(0, 0, 0)\"],.author[style*=\"color: black\"]{",
	"	     color:#FFF !important;",
	"    }",
	"    .theme-blue-dark {",
	"       color:#FFF !important;",
	"    }",
	"    .theme-blue-dark{",
	"        color:#fff !important;",
	"    }"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.appendChild(node);
	}
}
})();

