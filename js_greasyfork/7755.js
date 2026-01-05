// ==UserScript==
// @name         佳禮綠色高效版 Chinese.cari.com.my High Performance and Green version
// @namespace    https://greasyfork.org/en/scripts/7755-佳禮綠色高效版-chinese-cari-com-my-high-performance-and-green-version/
// @version      0.19
// @description  優化cari界面，把垃圾廣告統統移除。 從新開啓一些被cari强制關掉的功能。
// @author       megablue
// @match        http://*.cari.com.my/forum.php*
// @match        http://*.cari.com.my/portal.php*
// @grant        none
// @require		https://code.jquery.com/jquery-1.11.2.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7755/%E4%BD%B3%E7%A6%AE%E7%B6%A0%E8%89%B2%E9%AB%98%E6%95%88%E7%89%88%20Chinesecaricommy%20High%20Performance%20and%20Green%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/7755/%E4%BD%B3%E7%A6%AE%E7%B6%A0%E8%89%B2%E9%AB%98%E6%95%88%E7%89%88%20Chinesecaricommy%20High%20Performance%20and%20Green%20version.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var currentURL = document.URL.split('://');

$(function(){
    $("#fixedtop").css({ 'position' : 'static'});
    $("#fixedtop1").css({ 'position' : 'static'});

	if(currentURL[1].match(/portal.php/)){
	    $('body').css('webkit-touch-callout', 'all');
	    $('body').css('webkit-user-select', 'all');
	    $('body').css('khtml-user-select', 'all');
	    $('body').css('moz-user-select', 'all');
	    $('body').css('ms-user-select', 'all');
	   	$('#cari-rightside').remove();
	}

	if(currentURL[1].match(/forum.php/)){
        $('body').css('background-image','url("paper.gif")');
		$('#mfLOCApi').remove();
		$('#openchannelnavipanel').remove();
	    $("#toptb").remove();
	    $('#cari-rightside').parent().remove();
	    $('.cari_notification_thread2').remove();
	    $('.mtw.mbw').remove();
	    $('#threadlisttableid tbody:not(tbody[id*="_"]):not(tbody[id="separatorline"])').remove();
        $('marquee').remove();
	}
});

