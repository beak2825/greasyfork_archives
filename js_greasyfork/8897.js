// ==UserScript==
// @name         RARBG Plus
// @description  Removes adv links
// @include      http*rarbg*/torrents.php?*
// @version      1.0.1
// @namespace    https://greasyfork.org/users/3779
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8897/RARBG%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/8897/RARBG%20Plus.meta.js
// ==/UserScript==


jQuery('.lista2').has('img[src*="green_arrow_small.png"]').remove();

jQuery('.lista2t a[href^="\/torrent\/"]').each(function(){
  var $a = jQuery(this);
  var name = $a.text();
  var id = $a.attr('href').substring(9);
  var href = './download.php?id='+id+'&f='+name+'-[rarbg.com].torrent';
  $a.before('<a href="'+href+'"><button style="padding: 0px; margin: 0px 5px; border: solid thin #666; background: #DFDFDF;" type=button><i class="icon-arrow-down"></i></button></a>');
  jQuery.get($a.attr('href'), function(d){
    $a.before('<a href="'+jQuery(d).find('[href^="magnet:"]').attr('href')+'" style="display: inline-"><button style="padding: 0px; margin: 0px 5px; border: solid thin #666; background: #DFDFDF;" type=button><img src="//dyncdn.me/static/20/img/magnet.gif" alt="M"></button></a>')
  })
});