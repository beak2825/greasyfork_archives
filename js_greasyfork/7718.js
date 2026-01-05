// ==UserScript==
// @name        Anti-DMCA (Download DMCA'd Torrents from KAT)
// @namespace   pxgamer
// @include     *kickass.so/*
// @include     *kickass.to/*
// @include     *kat.ph/*
// @include     *kat.cr/*
// @include     *kickassto.co/*
// @include     *katproxy.is/*
// @include     *thekat.tv/*
// @version     5.0.1
// @grant       none
// @description Created by pxgamer & Dr.YeTii
// @author      pxgamer
// @contributor q1k
// @downloadURL https://update.greasyfork.org/scripts/7718/Anti-DMCA%20%28Download%20DMCA%27d%20Torrents%20from%20KAT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7718/Anti-DMCA%20%28Download%20DMCA%27d%20Torrents%20from%20KAT%29.meta.js
// ==/UserScript==

if ($('.alertfield').length==1) {
    var hash = $('#tab-technical .lightgrey').text().split(': ')[1];
    var name = window.location.pathname.split('/')[1];
    name = name.substring(0, name.lastIndexOf("-"));
    var trackers = [];
    $('#trackers_table tr').each(function() {
      trackers.push({'url':$('td:eq(0)', $(this)).text(), 'seed':$('td:eq(3)', $(this)).text(), 'leech':$('td:eq(4)', $(this)).text()});
    });
    trackers.sort(function(a, b) {
    var x = a['seed']; var y = b['seed'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    for (var i=0;i<trackers.length;i++){
      console.log(trackers[i].url + ' - ' + trackers[i].val);
    }
    var tracker = trackers[trackers.length-1].url;
    
    var values = '<div class="seedLeachContainer px" title="These are the last updated values, they are likely not up to date"><div class="seedBlock"><span class="seedLeachIcon"></span>seeders: <strong itemprop="seeders">'+trackers[trackers.length-1].seed+'</strong></div><div class="leechBlock"><span class="seedLeachIcon"></span>leechers: <strong itemprop="leechers">'+trackers[trackers.length-1].leech+'</strong></div></div>';
    
    var style = '.alertfield {margin: 5px auto 2px auto}'+
        '.px {margin-left: 6px;}'+'.kaGiantButton {margin-right: 0 !important;}'+
        '.rotate-arrow .arrow-bg {-webkit-transform: rotate(180deg);-moz-transform: rotate(180deg);filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);}'+
        '.arrow-bg {display: inline-block; width: 15px; height: 13px; margin-left: 7px; margin-bottom: -2px; margin-top: 7px;'+
            ' background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA4CAMAAACMj4vYAAAAilBMVEX////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6DghSAAAALXRSTlMAAQYHDxAZHCAsLTA4Q0daW1xebXF+f4SFiJGXm6GirbLFx9fa5ujr8/X5/P2bXtDGAAABa0lEQVQYGZXBCSIkMQAF0N9pghGkkJqxpBBiCf/+15vu0kst2fo93F8vUW15fY+GH3enqHJ690EN4cmf58sFChaXzz+kF0DLtbfbY2Qc375xzQCQgb2vx3MknD9+sRckVjpuvVwtMbO8euGWxZri3vu/E4yc/H3nnkLPceD76WKBjcXF0zcHHH41HHu9OcLK0c0rxzR+Cc+Jz4c/Zw+fnPACGy2rGGzJwApBYqdjBYs9xQoKA45FDkMNizSGhGeBFxhpWWAwJgOzgsRExyyLKcUshRnHDIc5zQyNOeGZ5AUiDJMMYmRgQpCIskywiFNMUEhwjHJI0YzSSBGeEV4gyTDCIE0GzgSJDMuZDjmKMwpZjhMOeZoTDfKE54gXKDAcaVEiAweCRJHlQIcyxQGFCo47DjU0dxrUEJ4bXqCK4UaLOjKwFyQqWfY61FLsKVRzXHGop7nSoJ7wpBc4gCFbHEKGIHEQ2+EwSiHuPzAdwcxnoJtVAAAAAElFTkSuQmCC);'+
            ' background-repeat: no-repeat; background-position: center center; background-size: 11px auto;}'+
        
        '.more-arrow-pointer {float: left; position: absolute; height: 12px; width: 12px; transform: rotate(45deg); margin-top: -13px; left: 471px; background: #f4f1e7;  border: 1px solid; border-bottom-color: transparent; border-right-color: transparent; border-radius: 0px 0px 100% 0px;}'+
        '.more-dialog-container {display:inline-block !important; background: #f4f1e7; border: 1px solid; margin: 0 auto 8px 5px; padding: 5px 6px 5px 6px;}'+
        '.torrenthash {margin: 6px auto 10px auto; padding-left: 5px;}'+'#more-options {padding: 0px 7px 0px 10px ! important;}'+
        '.downloadButtonGroup { display : flex; align-items : center; margin-top: 3px !important;}';
    
    var verified = '';
    if ($('.tabs.tabSwitcher').prev().text().indexOf('Torrent verified') >= 0) {
        verified = '<em title="Torrent is Verified" class="kaGiantButton px" data-nop=""><i class="ka ka-verify"></i></em>';
    }
    var boxopusURL = 'http://boxopus.com/landing/download?link=' + encodeURIComponent('magnet:?xt=urn:btih:'+hash+'&amp;dn='+name+'&amp;tr='+tracker);
    
    var buttonGroup = '<div id="123" class="buttonsline downloadButtonGroup clearleft novertpad"><style>'+style+
        '</style><a class="kaGiantButton ajaxLink px" href="/messenger/create/?text=Hey,%0Acheck%20out%20[torrent='+hash+']" title="Send in a Private Message"><i class="ka ka-message"></i></a>'+verified+
        '<a href="magnet:?xt=urn:btih:'+hash+'&amp;dn='+name+'&amp;tr='+tracker+'" rel="nofollow" title="Magnet link download" class="kaGiantButton px" data-nop="" ><i class="ka ka-magnet"></i></a><a href="http://torcache.net/torrent/'+hash+
        '.torrent?title='+name+'" class="siteButton kaGiantButton px" rel="nofollow" title="Torcache download"><span>Torcache</span></a><a href="http://thetorrent.org/'+hash+
        '.torrent?#" class="siteButton kaGiantButton px" rel="nofollow" title="TheTorrent download"><span>TheTorrent</span></a><a href="http://itorrents.org/torrent/'+hash+
        '.torrent?title='+name+'" class="siteButton kaGiantButton px" rel="nofollow" title="iTorrents download"><span>iTorrents</span></a><a title="More Locations" rel="nofollow" id="more-options" class="siteButton kaGiantButton px moreButton"'+
        '><span class="more-arrow">Show More<div class="arrow-bg"></div></span></a><a href="/community/show/95496/" class="kaGiantButton px" title="More Information?"><i class="ka ka-faq"></i></a>'+
    '</div>'+
    '<div id="more-dialog" title="More Locations" style="display: none;">'+
        '<div class="more-dialog-container"><div class="more-arrow-pointer"></div>'+
        '<a href="https://torrentz.eu/'+hash+
        '" class="siteButton kaGiantButton " rel="nofollow" title="Torrentz"><span>Torrentz</span></a><a href="'+boxopusURL+
        '" target="_blank" class="siteButton kaGiantButton px" rel="nofollow" title="Boxopus download"><span>Boxopus</span></a><a href="http://www.btcache.me/torrent/'+hash+
        '" class="siteButton kaGiantButton px" rel="nofollow" title="BT Cache"><span>BTCache</span></a><a href="http://torrage.info/torrent.php?h='+hash+
        '" class="siteButton kaGiantButton px" rel="nofollow" title="Torrage"><span>Torrage</span></a><a href="http://www.torrenthound.com/hash/'+hash+
        '" class="siteButton kaGiantButton px" rel="nofollow" title="Torrent Hound"><span>TorrentHound</span></a><a href="https://torrentproject.se/'+hash+
        '" class="siteButton kaGiantButton px" rel="nofollow" title="Torrent Project"><span>TorrentProject</span></a>'+
        '</div></div>'+
    '<div class="torrenthash px"><b>Hash: </b><span style="background-color: #faf9f1;">'+hash+'</span></div>';
    
    $('.alertfield').after(values+buttonGroup);
    
    $(document).delegate('#more-options', 'click', function() {
        $('#more-dialog').toggle(250);
        $('.more-arrow').toggleClass('rotate-arrow');
        var cache = $('.more-arrow').children();
        if ($('.more-arrow').hasClass('rotate-arrow')) {
            $('.more-arrow').text('Show Less').append(cache);
        }
        else {
            $('.more-arrow').text('Show More').append(cache);
        }
    });
}
