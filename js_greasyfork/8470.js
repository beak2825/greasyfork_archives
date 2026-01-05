// ==UserScript==
// @name        Anti-DMCA script for KAT
// @include     http*://kickass.so/*.html*
// @include     http*://kickass.to/*.html*
// @include     http*://kat.ph/*.html*
// @include     http*://kat.cr/*.html*
// @include     http*://kickassto.co/*.html*
// @include     http*://katproxy.is/*.html*
// @include     http*://thekat.tv/*.html*
// @version     2.6
// @grant       none
// @description Started by PXgamer & Chev.Chelios
// @namespace   https://greasyfork.org/users/9596
// @downloadURL https://update.greasyfork.org/scripts/8470/Anti-DMCA%20script%20for%20KAT.user.js
// @updateURL https://update.greasyfork.org/scripts/8470/Anti-DMCA%20script%20for%20KAT.meta.js
// ==/UserScript==
 
// if on torrent page and if DMCA'd
if (/-t\d+\.html($|#.*)/.test(window.location.pathname)&&$('#mainDetailsTable .alertfield').length) {
    var torrent_id = window.location.pathname.match(/-t(\d+)\.html($|#.*)/)[1];
    var logged_in = $('#navigation > li:last > a[href^="/user/"]').length>0;
    $('.tabs .tabNavigation li:first').after(' <li><a href="#technical" rel="technical" class="darkButton"><span>Technical</span></a></li>');
    var hash = $('#tab-technical .lightgrey').text().split(': ')[1];
    var name = window.location.pathname.split('/')[1];
    name = name.substring(0, name.lastIndexOf("-"));
    var values = '<div class="seedLeachContainer"><div class="leechBlock"><i class="ka kaBox ka-DMCA"></i>Anti-DMCA</div><div class="seedBlock"><i class="ka kaBox ka-idea"></i>Created by: <strong>PXgamer, Chev.Chelios &amp; KLOSENTAR</strong></div><div class="timeBlock"><i class="ka kaBox ka-faq"></i>How to: <strong><a class="plain" href="https://www.google.com/search?q=how+to+download+magnet+links&amp;ie=utf-8&amp;oe=utf-8" target="_blank">Download magnet links</a></strong></div></div>';
    var trackers = '';
    $('#trackers_table tr:not(.firstr)').each(function() {
        if ($(this).find('td.green').length) trackers += '&tr='+euc($(this).find('td:first').text());
    });
    if (trackers.length === 0) tr = '&tr='+euc('udp://tracker.publicbt.com:80/announce');
    var verified = $('.tabs.tabSwitcher').prev().text().indexOf('Torrent verified') >= 0;
    var messagetext = "Hey,\nyou can still download this torrent:\n[torrent="+torrent_id+"]\nby using one of these methods (I use method 3):\n[thread=bb7595776]\nSpread the word\n\nP.S. Screw [url=\"/dmca/\"]DMCA[/url] [:Qpirate]";
    var buttons = '<div class="buttonsline downloadButtonGroup clearleft novertpad">'+(logged_in?'<a class="kaGiantButton ajaxLink" href="/messenger/create/?text='+euc(messagetext)+'" title="Send in a private message"><i class="ka ka-message"></i></a>':'')+' <a class="kaGiantButton magnet_fb" data-nop="" title="Magnet link" href="magnet:?xt=urn:btih:'+hash+'&dn='+name+trackers+'" data-id="'+hash+'"><i class="ka ka-magnet"></i></a> <a rel="nofollow" class="kaGiantButton siteButton'+(verified?' iconButton':'')+'" title="Download'+(verified?' verified':'')+' torrent file)" href="http://torcache.net/torrent/'+hash+'.torrent">'+(verified?'<i class="ka ka-verify"></i>':'')+'<span>Download torrent</span></a> <span style="margin-top: 6px; display: inline-block;" class="lightgrey font11px">(Try magnet link if Torcache doesn\'t work)</span></div>';
    var magnetfb = '<div id="magnet_fb" style="display:none;"><h2 class="center">Thank you for choosing Anti-<i style="line-height: 19px ! important; margin-left: -3px;" title="(DMCA)" class="ka ka-DMCA statusIcon"></i></h2><div style="width: 550px;" class="center">We hope your download works.<br>Keep in mind that it is mainly up to whether or not people remain seeding this torent.<br>If you need any assistance, check out the thread:<br><a href="/community/show/95496/"><strong>Various methods to download a DMCA\'ed torrent</strong></a></div></div>';
    $('.alertfield').after(values+buttons+magnetfb);
    $('.downloadButtonGroup .ajaxLink').fancybox();
    $(document).delegate('.magnet_fb', 'click', function() {
       $('<a/>').attr('href', '#magnet_fb').fancybox().click();
    });
}
 
function euc(str) {
    return encodeURIComponent(str);
}
function padNum(num) { // 123 ==> 000123
    num = '00000000'+num;
    return num.substring(num.length-7, num.length);
}