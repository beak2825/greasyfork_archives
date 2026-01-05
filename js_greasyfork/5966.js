// ==UserScript==
// @name        RYM google current album
// @namespace   https://greasyfork.org/en/scripts/5966-rym-google-current-album
// @version     1.23
// @description	populate RYM album page with tons of warez searches
// @author       rick shide
// @match     https://rateyourmusic.com/release/*
// @include     https://rateyourmusic.com/release/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5966/RYM%20google%20current%20album.user.js
// @updateURL https://update.greasyfork.org/scripts/5966/RYM%20google%20current%20album.meta.js
// ==/UserScript==

//$(".coverart_img").css( "visibility", "visible" );

(function() {
    'use strict';
var x;
var tit = encodeURIComponent(x=$('.album_title')[0].firstChild.textContent.trim());
var name = encodeURIComponent($('span[itemProp=\'byArtist\']').text());
var whereAppend = $($('.album_title').siblings(0)[0]);
var lbWarez = $("<select id='lbWarez'>");
var lbTorrent = $("<select id='lbTorrent'>");
var lbSearch = $("<select id='lbSearch'>");
var lbSingles = $("<select id='lbSingles'>");
var lbUsenet = $("<select id='lbUsenet'>");


$([lbWarez,lbTorrent,lbUsenet,lbSingles,lbSearch]).each(function() {
	var o = $("<option title='Select Search'>Select Search</option>");
	this.append(o);

    this.change(function() {
        if  (this.selectedIndex > 0)
            window.open(this.options[this.selectedIndex].title, '_blank');
    });
});


/* set RYM stars and notes if going in again and it's not yet set
*/
$("#more_btn")[0].click();
if ($("span[id^=catalog_text_")[0].textContent=="In collection") {
  var txt = $("#notes")[0].value;
  if ($("div[id^=rating_stars_l")[0].attributes["class"].value == "rating_stars star-0m") {
    if (!txt.match(/.*NR.*/)) {
      if (txt.length)
        txt += ", ";
      $("#notes")[0].value = txt + "NR";
      $("#notes_save_btn")[0].click();
    }
	var id = window.rating_info_album_id;
	var rat = window["rating_l_" + id];
	rat.setRating(6);
  }
}


function addButton(name, url)
{
  if (name == null) {
       whereAppend.append($('<br><span style="font-size:10px;padding: 0 5px 0 0;">' + url + ':</div>'));
  }
  else {
    var btn = $('<button title="' + url + '">' + name + '</button>').click(function () {
      window.open(url, '_blank');
    });
    whereAppend.append(btn);
  }
}

function addLb(lb, name, url)
{
	var o = $("<option title='" + url + "'>" + name + "</option>");
//	$(o).click(function() {
//		window.open(url, '_blank');
//	});
	lb.append(o);
}


// general search
addButton('Google', 'https://google.com/search?q="' + tit + '" "' + name + '"');
addButton('Google blogspot&wordpress', 'https://google.com/search?q=(site%3Awordpress.com+OR+site%3Ablogspot.com)+"' + tit + '" "' + name + '"');
addButton('Yandex', 'https://yandex.com/search/?text="' + tit + '" "' + name + '"');
addButton('duckDuckGo', 'https://duckduckgo.com/?ia=audio&q="' + tit + '" "' + name + '"');
addButton('Google Image', 'https://www.google.com/searchbyimage?image_url=' + (($('.coverart_img') && $('.coverart_img')[0]) ? $('.coverart_img')[0].src :  ""));
addButton('yandex Image', 'https://www.yandex.com/images/search?rpt=imageview&img_url=' + (($('.coverart_img') && $('.coverart_img')[0]) ? $('.coverart_img')[0].src :  ""));
addButton('tineye', '  http://tineye.com/search?url=' + (($('.coverart_img') && $('.coverart_img')[0]) ? $('.coverart_img')[0].src :  ""));
addButton('spinitron artist', 'https://spinitron.com/m/search?q=' + name);
addButton('spinitron title', 'https://spinitron.com/m/search?q=' + tit);

// play
addButton(null, "play/buy");
addButton('Spotify artist', 'https://open.spotify.com/search/artists/' + name);
addButton('Spotify title', 'https://open.spotify.com/search/albums/' + tit);
addButton('Spotify artist web', 'https://play.spotify.com/search/artists/' + name);
addButton('Spotify title web', 'https://play.spotify.com/search/albums/' + tit);
addButton('bandcamp', 'http://bandcamp.com/search?q=' + name);
addButton('Soundcloud', 'https://soundcloud.com/search?q=' + name);
addButton('tidal', 'https://listen.tidal.com/search/"' + tit + '" "' + name + '"');
addButton('youtube', 'https://www.youtube.com/results?search_query="' + tit + '" "' + name + '"');
addButton(null, "play/buy");
addButton('7digital', 'https://www.7digital.com/search?q=' + name);
addButton('artistxite', 'http://artistxite.co.uk/search?term=' + name);
addButton('cdBaby', 'http://www.cdbaby.com/?q=' + name);
addButton('cduniverse', 'http://www.cduniverse.com/sresult.asp?HT_Search=ARTIST&HT_Search_Info=' + name);
addButton('googlePlay', 'https://play.google.com/store/search?c=music&q=' + name);
addButton('hearthis', 'https://hearthis.at/search/?q=' + name);
addButton('hmvdigital', 'https://store.hmv.com/search-results?searchtext=' + name);
addButton('hounk', 'https://hounk.com/search/' + name);
addButton('iheartRadio', 'http://www.iheart.com/?search=' + name);
addButton('itunes', 'https://fnd.io/#/us/search?mediaType=music&term=' + name);
addButton('google play', 'https://play.google.com/music/listen#/sr/' + name);
addButton('play store', 'https://play.google.com/store/search?c=music&q=' + name);
addButton('last.fm', 'http://www.last.fm/music/' + name);
addButton('mail.ru/music', 'https://my.mail.ru/music/search/' + name + ' ' + tit);
addButton('mail.ru/zaycev', 'http://go.mail.ru/zaycev?q=' + name + ' ' + tit);
addButton('onetwo.tv', 'https://onetwo.tv/search/artists/?query=' + name);
addButton('playvk', 'http://playvk.com/search?q=' + name);
//addButton('vk-muz.ru', 'http://vk-muz.ru/search/' + name + '/');
addButton('vk-music.ru', 'http://vk-music.ru/?q=' + name);
addButton('datmusic.xyz (vk)', 'https://datmusic.xyz/?q=' + name);



addButton(null, "database");
addButton('MBrainz', 'http://musicbrainz.org/search?type=release&query=' + tit + ' ' + name);
addButton('Discogs', 'http://www.discogs.com/search/?type=all&q=' + tit + ' ' + name);
addButton('AllMusic', 'http://www.allmusic.com/search/all/"' + name + '" "' + tit + '"');

// etc & info
addButton(null, "etc");
//addButton('chewbone', 'http://richardshide.com?"' + name + '" "' + tit + '"&type=+');
//addButton('Ranker', 'http://www.ranker.com/app/search.htm?q=' + tit + ' ' + name);
addButton('Inoreader', 'http://www.inoreader.com/search/"' + tit + '" AND "' + name + '"/public');
//addButton('Feedly', 'http://feedly.com/i/search/' + name + '/all/newest/any/-/topic/global.popular');
addButton('Feedly', 'https://feedly.com/i/search/' + name + '/-/-/-/forever/-');
//addButton('ddlsearch', 'http://ddlsearch.free.fr/ddl.php#' + name + '<-- your search term');
addButton('metacritic', 'http://www.metacritic.com/search/all/' + name + '/results');
addButton('ADM', 'http://www.anydecentmusic.com/search-results.aspx?search=' + name);
addButton('AOTY', 'https://www.albumoftheyear.org/search.php?q=' + name);
addButton('DR Meter', 'http://dr.loudness-war.info/album/list?artist=' + name);



// warez forums and blogs
addButton(null, "warez");
addLb(lbWarez, 'alllossless.net', 'http://www.alllossless.net/?do=search&subaction=search&story=' + name); /*very good,42750*/
addLb(lbWarez, 'avxhm.se (rapu.rocks)', 'https://rapu.rocks/search/?category_slug=&query=' + name);
addLb(lbWarez, 'avxhm.is (tavaz.xyz)', 'https://avxhm.is/search?q=' + name);
addLb(lbWarez, 'bloodsuckerz.cx', 'https://www.bloodsuckerz.cx/search.php?securitytoken=1588633513-bee4c534b2f9f3154ebbd3704a59bf52bf93da0c&titleonly=1&forumchoic[]=176&do=process&query=' + name);
addLb(lbWarez, 'flac.st', 'http://flac.st/?s=' + name);
addLb(lbWarez, 'flac24.fun', 'https://flac24.fun/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'flac24music', 'https://flac24music.com/?s=' + name);
addLb(lbWarez, 'freealbums.biz', 'http://freealbums.biz/?do=search&subaction=search&titleonly=3&story=' + name);	/*good, 3509*/
addLb(lbWarez, 'gangster.su', 'https://gangster.su/en/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'good-music.kiev.ua', 'http://good-music.kiev.ua/search/?q=' + name);
addLb(lbWarez, 'hd24bit', 'https://hd24bit.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'jazzmusic.cool', 'https://jazzmusic.cool/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'jazzsound.ru', 'http://jazzsound.ru/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'losslessalbums.club', 'https://losslessalbums.club/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'musicrider', 'https://musicrider.org/?s=' + name);
addLb(lbWarez, 'onceddl', 'https://onceddl.com/?s=' + name);
addLb(lbWarez, 'sanet.st', 'https://my.sanet.st/search/?category=2&filehosting=any&age=Any+time&q=' + name);
addLb(lbWarez, 'theflacmusic', 'http://www.theflacmusic.com/?s=' + name);
addLb(lbWarez, 'wwwhdflac', 'https://wwwhdflac.com/?category=&year=&month=&format=&go=&sortby=DESC&s=' + name);

addLb(lbWarez, '-----more-------', '');
addLb(lbWarez, '2013zone', 'http://www.2013zone.com/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&result_num=15&story=' + name);
addLb(lbWarez, '2ddl.io', 'http://2ddl.io/?s=' + name);	/*ok,15950*/
addLb(lbWarez, 'adamsFile', 'http://www.adamsfile.com/index.php?s_string=' + name);
addLb(lbWarez, 'anyjazz', 'https://anyjazz.com/?s=' + name);
addLb(lbWarez, 'avxhome.in', 'http://avaxsearch.pro/?q=' + name);
addLb(lbWarez, 'batzbatz.ru', 'http://batzbatz.ru/en/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'bitmuzic', 'http://bitmuzic.com/search/' + name.replace(/%20/g, "+"));
//addLb(lbWarez, 'boerse.sx', 'http://www.boerse.sx/search.php?do=process&quicksearch=1&titleonly=1&childforums=1&securitytoken=1512883565-d356887175edb70578d6ed46dec7c932ccdbbda3&forumchoice[]=25&query=' + name);
addLb(lbWarez, 'boxalbums', 'http://boxalbums.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'bunalti', 'http://www.bunalti.net/?s=' + name);
addLb(lbWarez, 'canna.to', 'http://uu.canna.to/links.php?action=suche&s_kat_id=alle&s_filename=1&s_sort=filename+asc&s_string=' + name);
addLb(lbWarez, 'chomikuj', 'http://chomikuj.pl/action/SearchFiles/?IsGallery=False&FileType=music&FileName=' + name);
addLb(lbWarez, 'darksound.ru', 'http://darksound.ru/?s=' + name);	/*very good,184305*/
addLb(lbWarez, 'darkwarez.pl', 'http://darkwarez.pl/forum/search.php?mode=results&show_results=topics&search_terms=all&only_topics=topics&search_fields=all&search2=1&search_keywords=' + name);	/*excellent,457880*/
addLb(lbWarez, 'downturk.net', 'http://www.downturk.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=66&story=' + name); /*very good,102590*/
addLb(lbWarez, 'eboerse.org', 'http://eboerse.org/search.php?keywords=' + name + '# <-- enter manually');
addLb(lbWarez, 'exystence', 'http://exystence.net/?s=' + name);
addLb(lbWarez, 'flac24', 'https://flac24.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'flacit', 'http://flacit.com/?search=' + name);
addLb(lbWarez, 'freake.ru', 'http://freake.ru/search/?q=' + name);	/*excellent,119020*/
addLb(lbWarez, 'funkysouls', 'http://forum.funkysouls.com/search/FTT100000/' + name);
addLb(lbWarez, 'idata.ws', 'http://www.idata.ws/index.php?do=search&subaction=search&search_start=1&full_search=1&result_from=1&titleonly=3&beforeafter=after&sortby=date&resorder=desc&showposts=0&catlist[]=6&story=' + name);
addLb(lbWarez, 'ifolderlinks.ru', 'http://ifolderlinks.ru/search-content?keys=' + name);
addLb(lbWarez, 'imaginariumsland', 'http://imaginariumsland.com/foro/search.php?action=do_search&postthread=2&keywords=' + name);
addLb(lbWarez, 'impactus.info', 'http://www.impactus.info/index.php?s=' + name);
addLb(lbWarez, 'intmusic', 'http://intmusic.net/?s=' + name);	/*very good,37040*/
addLb(lbWarez, 'inwarez', 'http://www.inwarez.org/search.php?titleonly=1&do=process&query=' + name);
addLb(lbWarez, 'iplusfree', 'http://iplusfree.com/search/' + name);
addLb(lbWarez, 'israbox.ch', 'http://www.israbox.ch/?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'itsonlyrockandroll', 'http://itrockandroll.com/?s=' + name);
addLb(lbWarez, 'iyanbox.co', 'http://iyanbox.co/search/' + name);
addLb(lbWarez, 'jazz-jazz', 'http://jazz-jazz.ru/?action=search&search=' + name);
addLb(lbWarez, 'jazznblues.club', 'http://jazznblues.club/search.php?submit=Search&keywords=' + name);
addLb(lbWarez, 'karaflachd', 'https://karaflachd.com/?s=' + name); /*good,2150*/
addLb(lbWarez, 'kayana.download', 'http://kayana.download/search/' + name.replace(/%20/g, "+"));
addLb(lbWarez, 'kpnemo.eu', 'http://www.kpnemo.eu/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'lossless.fun', 'http://lossless.fun/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'megamusic.download', 'https://megamusic.download/?s=' + name);
addLb(lbWarez, 'metalarea.org', 'https://metalarea.org/forum/index.php?act=Search&CODE=01&forums=all&search_in=titles&keywords=' + name);
addLb(lbWarez, 'mfmm.ru', 'http://mfmm.ru/search/?q=' + name);
addLb(lbWarez, 'mp3-flac', 'http://mp3-flac.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'mp3rally', 'http://mp3rally.com/?s=' + name);	/*very good, 156460*/
addLb(lbWarez, 'music314', 'https://music314.com/?s=' + name);
addLb(lbWarez, 'musicloverparadise', 'http://musicloverparadise.com/index.php?do=search&subaction=search&full_search=1&titleonly=3&story=' + name);
addLb(lbWarez, 'musics.scene-rls.com', 'http://musics.scene-rls.com/?s=' + name);	/*very good,134720, also .net*/
addLb(lbWarez, 'muz-tracker', 'http://www.muz-tracker.net/browse.php?search=' + name);
addLb(lbWarez, 'myboerse.bz', 'http://myboerse.bz/search.php?titleonly=1&dosearch=Suchen&sortby=relevance&order=descending&securitytoken=1473454702-ff9a29ce08be3917b102a03689c73f37230aabcb&do=process&query=' + name);
addLb(lbWarez, 'newalbumreleases.net', 'http://newalbumreleases.net/?s=' + name);	/*excellent,58590*/
addLb(lbWarez, 'new-best-music.org', 'http://new-best-music.org/?s=' + name);
addLb(lbWarez, 'newflac.com', 'http://newflac.com/?s=' + name);
addLb(lbWarez, 'ngatap.download', 'http://ngatap.download?s=' + name);
addLb(lbWarez, 'nodata.tv', 'http://nodata.tv/?s=' + name);/*excellent,29920*/
addLb(lbWarez, 'NoNaMe', 'http://txapela.ru/search/?q=' + name);
addLb(lbWarez, 'notonlylossless', 'http://notonlylossless.blogs.sapo.pt/search?q=' + name);
addLb(lbWarez, 'odi-music.net', 'http://www.odi-music.net/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'paulwells.download', 'http://paulwells.download/?s=' + name);
addLb(lbWarez, 'paulito.download', 'http://paulito.download/?s=' + name);
addLb(lbWarez, 'plixid', 'http://plixid.com/?s=' + name);
addLb(lbWarez, 'reisix.net', 'http://reisix.net/?s=' + name); /*307272*/
addLb(lbWarez, 'rlsbb.ru', 'http://rlsbb.ru/search/' + name);	/*good*/
addLb(lbWarez, 'scnlog.me', 'http://scnlog.me/music/?s=' + name);
addLb(lbWarez, 'septian.download', 'http://septian.download/search/' + name); /*68665*/
addLb(lbWarez, 'soek.pw', 'https://soek.pw/search/?category_slug=music&query=' + name);
addLb(lbWarez, 'themusicfire', 'http://themusicfire.com/?s=' + name);	/*electronic,164912*/
addLb(lbWarez, 'towkayzone', 'http://www.towkayzone.com.sg/search.php?titleonly=1&do=process&query=' + name);
addLb(lbWarez, 'tunesies.pro', 'https://tunesies.pro/?s=' + name); /*also .top, .me*/
addLb(lbWarez, 'ulozto.net', 'http://www.ulozto.net/hledej?q=' + name);
addLb(lbWarez, 'vagoslatino', 'http://www.vagoslatino.com/search.php?titleonly=1&dosearch=Search+now&securitytoken=guest&do=process&query=' + name);
addLb(lbWarez, 'wrzwtf', 'https://wrzwtf.com/?s=' + name);
addLb(lbWarez, 'wtfflac', 'https://wtfflac.com/?s=' + name);
addLb(lbWarez, 'wrzwtf24bit', 'https://wrzwtf24bit.com/?s=' + name);
addLb(lbWarez, 'xorosho', 'http://www.xorosho.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'zajefajna', 'http://www.zajefajna.com/search.php?do=process&titleonly=1&forumchoice[]=16&sortby=dateline&order=descending&dosearch=Search+now&securitytoken=1469140652-15a81c3e8cdfe2e1a5e9ea1bc2eba873ef0fadad&query=' + name);
addLb(lbWarez, 'zhmak.info', 'http://zhmak.info/index.php?do=search&subaction=search&&full_search=1&titleonly=3&sortby=date&catlist[]=19&story=' + name);
//addLb(lbWarez, 'zone-telechargement-albums artist', 'https://www.google.com/search?q=site%3Ahttp%3A%2F%2Fzone-telechargement-albums.com+' + name);
//addLb(lbWarez, 'zone-telechargement-albums title', 'https://www.google.com/search?q=site%3Ahttp%3A%2F%2Fzone-telechargement-albums.com+' + tit);
addLb(lbWarez, '-----others-------', '');
addLb(lbWarez, '0daymusic', 'https://www.0daymusic.org/rasti.php?ka_rasti=' + name);	/*rock,3887*/
addLb(lbWarez, '0dayrox.blogspot.com', 'http://0dayrox.blogspot.com/search?q=' + name);	/*rock,3910*/
addLb(lbWarez, '0dayroxx.blogspot.com', 'http://0dayroxx.blogspot.com/search?q=' + name); /*rock,4005*/
addLb(lbWarez, '0dayrox2.blogspot.com', 'http://0dayrox2.blogspot.com/search?q=' + name);
addLb(lbWarez, '100-mp3.ru', 'http://100-mp3.ru/google_search.html?cx=partner-pub-0644545758255659%3Awjkqqrvwhx9&cof=FORID%3A10&q=' + name);
addLb(lbWarez, '2013zone', 'http://www.2013zone.com/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&result_num=15&story=' + name);
addLb(lbWarez, '24bit-music.info', 'https://24bit-music.info/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, '24bitvinyl', 'http://24bitvinyl.com/?s=' + name);
addLb(lbWarez, '24bithd.biz', 'http://24bithd.biz/?s=' + name);	/*poor,1260*/
addLb(lbWarez, '24flac.com', 'https://24flac.com/index.php?do=search&subaction=search&full_search=1&titleonly=3&story=' + name);
addLb(lbWarez, '2olega.ru', 'http://2olega.ru/search/?q=' + name);
addLb(lbWarez, '320k.me', 'http://320k.me/index.php?surf=search&orderby=timestamp&orderway=desc&str=' + name);
addLb(lbWarez, '38share', 'http://www1.38share.com/?s=' + name);
addLb(lbWarez, '4clubbers.com.pl', 'http://www.4clubbers.com.pl/search.php?do=process&titleonly=1&query=' + name);
addLb(lbWarez, '4shared', 'https://www.4shared.com/web/q#query=' + name);
addLb(lbWarez, '80-e.ru', 'http://80-e.ru/index.php?act=Search&CODE=01&forums=all&search_in=titles&keywords=' + name);
addLb(lbWarez, '9clacks.org', 'https://9clacks.org/?s==' + name);
addLb(lbWarez, 'ace-bootlegs', 'http://ace-bootlegs.com/?s=' + name);
addLb(lbWarez, 'acervodoreggae', 'http://www.acervodoreggae.com/search?q=' + name);		/*reggae*/
addLb(lbWarez, 'adowns.net', 'http://adowns.net/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=9&story=' + name);
addLb(lbWarez, 'ahtuo', 'http://ahtuo.com/search.php?q=' + name);
addLb(lbWarez, 'album-music', 'http://www.album-music.ru/index.php?do=search&subaction=search&result_num=100&story=' + name);
addLb(lbWarez, 'albumcrush', 'http://albumcrush.com/?s=' + name);
addLb(lbWarez, 'albumdabster', 'http://albumdabster.com/?s=' + name);
addLb(lbWarez, 'albumdl.xyz', 'http://albumdl.xyz/?s=' + name);	/*excellent,194025*/
addLb(lbWarez, 'albumkings1', 'https://www.albumkings1.com/search?q=' + name);
addLb(lbWarez, 'albumlord', 'http://albumlord.com/?s=' + name);
addLb(lbWarez, 'albummusic.net', 'http://albummusic.net/search/?cx=partner-pub-2547580494028569%3A4572509033&cof=FORID%3A10&ie=UTF-8&q=' + name);
addLb(lbWarez, 'albumstreams', 'http://albumstreams.com/q?q=' + name);
addLb(lbWarez, 'albumwash', 'http://albumwash.com/index.php?mod=listalbums&by=artist&search=' + name);
addLb(lbWarez, 'albumzipdownload', 'http://albumzipdownload.com/?s=' + name);
addLb(lbWarez, 'alfa.ucoz.org', 'http://alfa.ucoz.org/search/?q=' + name);
addLb(lbWarez, 'aliked', 'http://aliked.com/?s=' + name);	/*poor,dance,9632*/
addLb(lbWarez, 'alldj.org', 'http://alldj.org/?s=' + name);
addLb(lbWarez, 'allmedley', 'http://allmedley.com/search/?q=' + name);
addLb(lbWarez, 'allrussian.info', 'http://www.allrussian.info/index.php?form=Search&types[]=post&boardIDs[]=*&q=' + name);
addLb(lbWarez, 'allsoftmac', 'http://ww.allsoftmac.com/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'allthingsoldschool.blogspot.com', 'http://allthingsoldschool.blogspot.com/search?q=' + name);
addLb(lbWarez, 'allwarez4dl.download', 'http://www.allwarez4dl.download/index.php?do=search&subaction=search&titleonly=3&catlist[]=15&story=' + name);
addLb(lbWarez, 'allyoulike.com', 'http://www.allyoulike.com/?s=' + name);
addLb(lbWarez, 'allyoulike.pw', 'http://www.allyoulike.pw/do=search&subaction=search&story=' + name);
addLb(lbWarez, 'alt-files.ru', 'http://alt-files.ru/search/?q=' + name);
addLb(lbWarez, 'alt-land.info', 'http://alt-land.info/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'alter-side', 'http://alter-side.net/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'alterportal.ru', 'http://alterportal.ru/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'altworld.ru', 'http://altworld.ru/dir/?query=' + name + '# <-- must search manually');
//addLb(lbWarez, 'americawarez', 'http://americawarez.com/buscador/?e=web&cat=-1&q=' + name + '&q=' + name);
addLb(lbWarez, 'anarcho-punk.net', 'http://www.anarcho-punk.net/search.php?sf=all&sr=posts&keywords=' + name);
addLb(lbWarez, 'antoshki.net', 'http://antoshki.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'antosoft.net', 'http://antosoft.net/index.php?do=search&titleonly=3&subaction=search&catlist[]=5&story=' + name);
addLb(lbWarez, 'anydown.info', 'http://www.anydown.info/music/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'armazemdorocknacional.blogspot.com', 'http://armazemdorocknacional.blogspot.com/search?q=' + name); /*mpb*/
addLb(lbWarez, 'art-download.org', 'http://art-download.org/?a=f&q=' + name); /*very good*/
addLb(lbWarez, 'arhsam.blogspot.com', 'http://arhsam.blogspot.com/search?q=' + name); /*mpb*/
addLb(lbWarez, 'atomload.to', 'http://atomload.to/?c=88&t=1&e=1&q=' + name);
addLb(lbWarez, 'audiodim.me', 'http://www.audiodim.me/search?q=' + name);
addLb(lbWarez, 'audioheavy', 'http://audioheavy.com/?s=' + name);
addLb(lbWarez, 'aw-jazz.blogspot.com', 'http://aw-jazz.blogspot.com/search?q=' + name);
addLb(lbWarez, 'avaxhomesos', 'http://www.avaxhomesos.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'babada.ru', 'http://babada.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name); /*very good,308100*/
addLb(lbWarez, 'baixarcdsgratis', 'http://www.baixarcdsgratis.com/?s=' + name);
addLb(lbWarez, 'baixarsomgratis', 'http://www.baixarsomgratis.com/?s=' + name);	/*latin*/
addLb(lbWarez, 'balkandownload', 'http://www.balkandownload.org/index.php?app=core&module=search&section=search&do=search&fromsearch=1&search_app=forums&search_content=titles&search_app_filters[forums][forums][]=20&search_term=' + name);
addLb(lbWarez, 'baringan.download', 'http://baringan.download/?s=' + name);
addLb(lbWarez, 'bbpradi02.eklablog.com', 'http://bbpradi02.eklablog.com/search?q=' + name);
addLb(lbWarez, 'bemetal.org', 'http://bemetal.org/?s=' + name);
addLb(lbWarez, 'bestblackhatforum.eu', 'http://bestblackhatforum.eu/search.php?action=do_search&forums[]=59&keywords=' + name);
addLb(lbWarez, 'binmovie.org', 'http://binmovie.org/index.php?do=search&subaction=search&titleonly=3&catlist[]=98&story=' + name);
addLb(lbWarez, 'bisound', 'http://www.bisound.com/index.php?op=albums&search_album=' + name);
addLb(lbWarez, 'bloodsuckerz', 'http://www.board.bloodsuckerz.net/search.php?securitytoken=1465607144-ff8d0f0309140611d2e856eca1518ff818014dc8&do=process&titleonly=1&&forumchoice[]=0&childforums=1&query=' + name);
addLb(lbWarez, 'blues.at.ua', 'http://blues.at.ua/search/?q=' + name); /*ok,good for blues,7997*/
addLb(lbWarez, 'bluesgambler.blogspot.com', 'http://bluesgambler.blogspot.com/search?q=' + name);
addLb(lbWarez, 'bluewarez.pl', 'http://www.bluewarez.pl/search.php?do=process&titleonly=1&forumchoice[]=17&childforums=1&query=' + name);
addLb(lbWarez, 'bochincheros.net', 'https://bochincheros.net/google.php?cx=partner-pub-005344344500043451104%3Aqmr795eeyl4&cof=FORID%3A9&ie=ISO-8859-1&q=' + name);
addLb(lbWarez, 'bootlegs.party', 'https://bootlegs.party/search/' + name);
addLb(lbWarez, 'borguez.com/uabab', 'http://www.borguez.com/uabab/?s=' + name);
addLb(lbWarez, 'boxset.ru', 'http://boxset.ru/?s=' + name);
addLb(lbWarez, 'btarena', 'http://forum.btarena.org/search.php?fid[]=5&sf=titleonly&keywords=' + name);
addLb(lbWarez, 'byDuck', 'http://www.byduck.com/?s="' + name + '"');
addLb(lbWarez, 'byte.to', 'http://byte.to/?q=' + name);
addLb(lbWarez, 'caseyoc.info', 'https://caseyoc.info/?s=' + name);
addLb(lbWarez, 'cherrysoft.ru', 'http://cherrysoft.ru/index.php?do=search&subaction=search&titleonly=3&catlist[]=3&story=' + name);
addLb(lbWarez, 'citysmile.org', 'http://www.citysmile.org/index.php?do=search&subaction=search&titleonly=3&catlist[]=15&story=' + name);
addLb(lbWarez, 'clarinel', 'http://www.clarinel.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=5&story=' + name);
addLb(lbWarez, 'club4you.pl', 'http://club4you.pl/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'cool-mp3', 'http://cool-mp3.net/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'coreradio.ru', 'http://coreradio.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'cottoc.net', 'http://www.cottoc.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=6&story=' + name);
addLb(lbWarez, 'creamusic', 'http://creamusic.net/index.php?do=search&subaction=search&titleonly=3&story=' + name); 	/*ok,1380*/
addLb(lbWarez, 'crown6', 'http://www.crown6.org/search/?q=' + name);
addLb(lbWarez, 'crust-demos.blogspot.com', 'http://crust-demos.blogspot.com/search?q=' + name);
addLb(lbWarez, 'csakbennhajogerendazatto.blog.hu', 'http://csakbennhajogerendazatto.blog.hu/search?searchmode=AND&searchterm=' + name);
addLb(lbWarez, 'cwer.ws', 'http://cwer.ws/sphinx/?s=' + name);	/*very good,6000*/
addLb(lbWarez, 'cyberphoenix', 'http://www.cyberphoenix.org/forum/index.php?app=core&module=search&do=search&fromMainBar=1&search_app=forums&search_term=' + name);
addLb(lbWarez, 'daleide', 'http://www.daleide.com/index.php?do=search&subaction=search&catlist[]=5&story=' + name);
addLb(lbWarez, 'darkabyss.org', 'http://darkabyss.org/index.php?action=search2&search_focus=all&search=' + name);
addLb(lbWarez, 'darkarea.pl', 'http://darkarea.pl/search.php?s=&securitytoken=1466308017-ab7839e5c22c980df2f394c5049dcd8e655f1b48&do=process&query=' + name);
addLb(lbWarez, 'darkport.org', 'http://darkport.org/?s=' + name);
addLb(lbWarez, 'darkreloaded.org', 'https://darkreloaded.org/search/?type=forums_topic&nodes=6&q=' + name);
addLb(lbWarez, 'darksage.ru', 'http://www.forum.darksage.ru/forum/0-0-0-6?fid=0&user=&o1=0&o2=0&o3=0&a=6&kw=' + name);
addLb(lbWarez, 'darktunes.top', 'https://darktunes.top/?s=' + name);
addLb(lbWarez, 'dasolo', 'http://www.dasolo.org/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'datpiff.fun', 'https://datpiff.fun/?s=' + name);
addLb(lbWarez, 'davidbowieworld.nl', 'http://www.davidbowieworld.nl/?s=' + name);
addLb(lbWarez, 'ddl-music.to', 'http://ddl-music.to/?search=' + name);
addLb(lbWarez, 'ddlspot', 'http://www.ddlspot.com/search/?m=1&q=' + name);
addLb(lbWarez, 'ddlvalley.cool', 'http://www.ddlvalley.cool/search/' + name + '/');	/*good,3521*/
addLb(lbWarez, 'ddlvillage.org', 'http://www.ddlvillage.org/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'deadmauss', 'http://deadmauss.com/?s=' + name);
addLb(lbWarez, 'deadmauss forum', 'http://deadmauss.com/forum/search.php?action=do_search&keywords=#' + name + ' <-- must use manual search');
addLb(lbWarez, 'deadpulpit', 'http://www.deadpulpit.com/search?q=' + name);
addLb(lbWarez, 'death-music.ru', 'http://death-music.ru/search/?q=' + name);
addLb(lbWarez, 'deathgrind.club', 'https://deathgrind.club/index.php?do=search&subaction=search&search_start=0&full_search=0&result_from=1&story=' + name);
addLb(lbWarez, 'deepsouthernsoul.blogspot', 'https://deepsouthernsoul.blogspot.com/search?q=' + name);
addLb(lbWarez, 'dflforall.biz', 'http://dflforall.biz/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'domovenokedic.ru', 'http://domovenokedic.ru/index.php?do=search&subaction=search&search_start=1&full_search=1&result_from=1&titleonly=3&catlist[]=5&story=' + name);
addLb(lbWarez, 'densoft.cc', 'http://densoft.cc/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=19&story=' + name);
addLb(lbWarez, 'denunciando', 'http://www.denunciando.com/search.php?s=&securitytoken=1466867275-154a45f3527f76630a4f5d5acf7f510a5816a22d&do=process&titleonly=1&exactname=1&prefixchoice[]=1&forumchoice[]=9&childforums=1&query=' + name);
addLb(lbWarez, 'descargandofull.org', 'http://descargandofull.org/index.php?app=core&module=search&do=search&fromMainBar=1&search_app=forums&search_term=' + name);
addLb(lbWarez, 'descargarz', 'http://www.descargarz.com/?s=' + name);
addLb(lbWarez, 'desire2music.net', 'http://www.desire2music.net/search-filter/?_sf_s=' + name);
addLb(lbWarez, 'desmix.net', 'http://desmix.net/?s=' + name); /*ok,6320*/
addLb(lbWarez, 'diemilitarmusik.clan.su', 'http://diemilitarmusik.clan.su/search/?q=' + name);
addLb(lbWarez, 'digitalcrakex', 'http://www.digitalcrakex.com/index.php?do=search&subaction=search&full_search=1&catlist[]=6&story=' + name);
addLb(lbWarez, 'direct-download.org', 'http://www.direct-download.org/search.php?titleonly=1&forumchoice[]=21&childforums=1&query=' + name + '# <-- SEARCH MANUALLY USING CAPTCHA "V1+SHUTDOWN+ON+2018-03-31"');
addLb(lbWarez, 'dirtywarez', 'http://forum.dirtywarez.com/search.php?terms=all&fid[]=17&sc=1&sf=titleonly&sr=posts&sk=t&sd=d&st=0&ch=300&t=0&submit=Search&keywords=' + name);
addLb(lbWarez, 'dl4all.co.in', 'http://dl4all.co.in/index.php?do=search&subaction=search&titleonly=3&catlist[]=14&story=' + name);	/*good,6960*/
addLb(lbWarez, 'dl4all.org', 'http://www.dl4all.org/?do=search&subaction=search&catlist[]=19&titleonly=3&story=' + name);
addLb(lbWarez, 'dl4all.ws', 'http://www.dl4all.ws/?do=search&subaction=search&catlist[]=19&titleonly=3&story=' + name);
addLb(lbWarez, 'DLEBook.me', 'http://dlebook.me/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=19&story=' + name);
addLb(lbWarez, 'dlera.club', 'http://dlera.club/do=search&subaction=search&story=' + name);
addLb(lbWarez, 'dlfirstx', 'http://www.dlfirstx.com/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'dlnewalbum', 'http://dlnewalbum.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'dload.net.ru', 'http://dload.net.ru/index.php?do=search&subaction=search&titleonly=3&catlist[]=13&story=' + name);
addLb(lbWarez, 'dlmetal.bid', 'https://dlmetal.bid/?s=' + name);
addLb(lbWarez, 'dlwarez.in', 'http://www.dlwarez.in/index.php?do=search&subaction=search&titleonly=3&catlist[]=26&story=' + name);
//addLb(lbWarez, 'dnafile.top', 'http://dnafile.top/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'dodatak', 'http://www.dodatak.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'doom-black.org', 'http://doom-black.org/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'down-soft.info', 'http://down-soft.info/index.php?do=search&subaction=search&titleonly=3&catlist[]=8&story=' + name);
addLb(lbWarez, 'downarchive.org', 'http://downarchive.org/index.php?do=search&subaction=searchtitleonly=3&catlist[]=18&story=' + name);
addLb(lbWarez, 'downcrackserial', 'http://downcrackserial.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=7&story=' + name);
addLb(lbWarez, 'downduck', 'http://www.downduck.com/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'downeu.xyz', 'http://www.downeu.xyz/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'downflare', 'http://downflare.com/?s=' + name);
addLb(lbWarez, 'download-cd.livejournal.com', 'http://www.livejournal.com/gsearch/?engine=google&cx=partner-pub-5600223439108080%3A3711723852&cof=FORID%3A10&as_sitesearch=download-cd.livejournal.com&ie=UTF-8&sa=Search&q=' + name);	/*excellent*/
addLb(lbWarez, 'download-discography', 'http://download-discography.com/?s=' + name);
addLb(lbWarez, 'download-flow', 'http://download-flow.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=5&story=' + name);
addLb(lbWarez, 'download-soundtracks', 'http://download-soundtracks.com/search/' + name);
addLb(lbWarez, 'downloadbox', 'http://downloadbox.org/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'downserv.net', 'http://www.downserv.net/music/&do=search&subaction=search&story=' + name); /*good,28930*/
addLb(lbWarez, 'downsong.net', 'http://downsong.net/?s=' + name);
addLb(lbWarez, 'dragula.space', 'https://dragula.space/?s=' + name);
addLb(lbWarez, 'drumpills.eu', 'http://drumpills.eu/?s=' + name);
addLb(lbWarez, 'dvd-audio.net', 'http://dvd-audio.net/?do=search&subaction=search&story=' + name); /*very good,1260*/
addLb(lbWarez, 'dx-team.org', 'https://dx-team.org/search.php?do=process&query=' + name);
addLb(lbWarez, 'eargasm.ir', 'http://eargasm.ir/?s=' + name);
addLb(lbWarez, 'ebookcomplite', 'http://ebookcomplite.com/search/' + name);
addLb(lbWarez, 'ebookee.org', 'https://ebookee.org/search.php?sa=Search&q=' + name);
addLb(lbWarez, 'edmbeasts', 'http://edmbeasts.com/?s=' + name);
addLb(lbWarez, 'ellinomania.eu', 'http://www.ellinomania.eu/index.php?app=core&module=search&section=search&do=search&fromsearch=1&search_app=forums&search_content=titles&search_term=' + name);
addLb(lbWarez, 'elrancho--1.blogspot.com', 'http://elrancho--1.blogspot.com/search?q=' + name); /*good,country,4992*/
addLb(lbWarez, 'elrincondelosrecuerdos4.blogspot.com', 'http://elrincondelosrecuerdos4.blogspot.com/search?q=' + name);	/*mixed-bag,11119*/
addLb(lbWarez, 'epidemz.co', 'http://epidemz.co/index.php?do=search&subaction=search&story=' + name);	/*ok,24360*/
addLb(lbWarez, 'esparaelmetal.ucoz.es', 'http://esparaelmetal.ucoz.es/forum/0-0-0-6?kw=' + name + '# <-- must search manually');
addLb(lbWarez, 'essentialmusic.eu', 'http://essentialmusic.eu/?s=' + name);
addLb(lbWarez, 'estrenosli.org', 'http://estrenosli.org/descarga-0-0-0-0-fx-1-1-sch-titulo-' + name + '-sch.fx');	/*good,17132*/
addLb(lbWarez, 'euescuto.com.br', 'http://www.euescuto.com.br/?s=' + name);
addLb(lbWarez, 'excluzive.net', 'http://www.excluzive.net/index.php?do=search&subaction=search&search_start=0&titleonly=3&catlist[]=9&story=' + name);	/*very good,48465*/
addLb(lbWarez, 'exitosm4a', 'http://www.exitosm4a.com/?s=' + name);
addLb(lbWarez, 'extreme-down.im', 'https://www.extreme-down.im/index.php?do=search&subaction=search&titleonly=3&story=' + name); /*ok,11190*/
addLb(lbWarez, 'exvagos1.com', 'http://www.exvagos1.com/search.php?s=&securitytoken=1466487433-8286a4c730cee3449fc1857b8982d20046b1b128&do=process&titleonly=1&forumchoice"%"5B"%"5D=37&childforums=1&query=' + name);
addLb(lbWarez, 'eyny', 'http://www02.eyny.com/search.php?kw=' + name);
addLb(lbWarez, 'ezhevika.blogspot.com', 'http://ezhevika.blogspot.com/search?q=' + name); /*very good,3276*/
addLb(lbWarez, 'ezdown.org', 'http://ezdown.org/?s=' + name);	/*good,10620*/
addLb(lbWarez, 'ffshrine.org', 'http://forums.ffshrine.org/search.php?do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'files4you.org', 'http://www.files4you.org/search.php?do=process&quicksearch=1&titleonly=1&childforums=1&exactname=1&query=' + name);
addLb(lbWarez, 'fittie.net', 'http://fittie.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=6&story=' + name);
addLb(lbWarez, 'flabbergasted-vibes.org', 'http://flabbergasted-vibes.org/?s=' + name);
addLb(lbWarez, 'flac.link', 'http://flac.link/?s=' + name);
addLb(lbWarez, 'flac.xyz', 'http://flac.xyz/?s=' + name);
addLb(lbWarez, 'flac-music.org', 'http://flac-music.org/s=' + name);
addLb(lbWarez, 'flacattack.net', 'http://flacattack.net/home?t=' + name);
addLb(lbWarez, 'flaclossless.top', 'http://flaclossless.top/index.php?do=search&subaction=search&titleonly=3&story=' + name); /*good,9960*/
addLb(lbWarez, 'flacmusic.info', 'http://flacmusic.info/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'flacworld', 'http://flacworld.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'forindy', 'http://board.forindy.com/search.html?cx=partner-pub-6871562276833027%3Anq5hp9-fd9z&cof=FORID%3A10&ie=UTF-8&q=' + name);
addLb(lbWarez, 'forosindicedonkey', 'http://forosindicedonkey.com/search.php?show_results=topics&search_keywords=' + name);
addLb(lbWarez, 'forum.ge', 'https://forum.ge/?act=Search&CODE=01&namesearch=&forums[]=21&searchsubs=1&search_in=titles&result_type=posts&keywords=' + name);	/*forum*/
addLb(lbWarez, 'francais-gratuit1.fr', 'http://francais-gratuit1.fr/french/' + name + '/');	/*ok,26613*/
addLb(lbWarez, 'frboard', 'http://www.frboard.com/search.php?do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'free-admin.net', 'http://free-admin.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=7&story=' + name);
addLb(lbWarez, 'free-war.net', 'http://free-war.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'freeallmusic.ltd', 'http://freeallmusic.ltd/Search?query=' + name);
addLb(lbWarez, 'freemp3flac', 'http://freemp3flac.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'freehd.me', 'http://freehd.me/diend@n/index.php?app=core&module=search&section=search&do=search&fromsearch=1&search_app=forums&search_app=forums&andor_type=and&search_content=titles&search_tags=&search_author=&search_date_start=&search_date_end=&search_app_filters%5Bcore%5D%5BsortKey%5D=date&search_app_filters%5Bcore%5D%5BsortDir%5D=0&search_app_filters%5Bforums%5D%5BliveOrArchive%5D=live&search_app_filters%5Bforums%5D%5Bforums%5D%5B%5D=34&search_app_filters%5Bforums%5D%5BnoPreview%5D=1&search_app_filters%5Bforums%5D%5BpCount%5D=&search_app_filters%5Bforums%5D%5BpViews%5D=&search_app_filters%5Bforums%5D%5BsortKey%5D=date&search_app_filters%5Bforums%5D%5BsortDir%5D=0&submit=Search+Now&search_term=' + name);
addLb(lbWarez, 'freemusic.lofter.com', 'http://freemusic.lofter.com/search?q=' + name);
addLb(lbWarez, 'freemusicarchive', 'http://freemusicarchive.org/search/?quicksearch=' + name);
addLb(lbWarez, 'freerls.org', 'http://freerls.org/?s=' + name);
addLb(lbWarez, 'freerockme', 'http://www.freerockme.com/search/?q=' + name);
addLb(lbWarez, 'freevideomusic.3dn.ru', 'http://freevideomusic.3dn.ru/search/?q=' + name);
addLb(lbWarez, 'fresh-music-only.ru', 'http://fresh-music-only.ru/?s=' + name);	/*poor,9570*/
addLb(lbWarez, 'freshalbums.net', 'http://freshalbums.net');
addLb(lbWarez, 'freshaudio.xyz', 'http://freshaudio.xyz/show?cat=0&q=' + name); /*good*/
addLb(lbWarez, 'freshmusic.download', 'https://freshmusic.download/?s=' + name); /*good*/
addLb(lbWarez, 'freshprogs.ru', 'http://freshprogs.ru/index.php?do=search&subaction=search&titleonly=3&catlist[]=8&story=' + name); /*poor,13660*/
addLb(lbWarez, 'freshrls.org', 'http://freshrls.org/index.php?do=search&subaction=search&titleonly=3&catlist[]=9&catlist[]=37&catlist[]=28&catlist[]=29&catlist[]=24&catlist[]=10&story=' + name);
addLb(lbWarez, 'freshsound', 'http://www.freshsound.org/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'freshwap.us', 'http://www.freshwap.us/index.php?do=search&subaction=search&catlist[]=29&story=' + name);
addLb(lbWarez, 'fullmacosx', 'http://fullmacosx.com/index.php?do=search&subaction=search&titleonly=3&showposts=0&catlist[]=7&story=' + name);
addLb(lbWarez, 'fullsoftebook', 'http://fullsoftebook.com/index.php?do=search&subaction=search&full_search=1&titleonly=3&showposts=0&catlist[]=7&story=' + name);
addLb(lbWarez, 'funkmysoul.gr', 'http://www.funkmysoul.gr/?s=' + name);
addLb(lbWarez, 'get-albums.ru', 'http://get-albums.ru/?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'getalbums.co', 'http://getalbums.co/?s=' + name);
addLb(lbWarez, 'getleaks.net', 'http://getleaks.net/index.php?do=search&subaction=search&story=' + name);	/*ok,2400*/
addLb(lbWarez, 'getmetal.stream', 'https://getmetal.stream/?s=' + name);
addLb(lbWarez, 'getmetal.club', 'https://getmetal.club/?do=search&subaction=search&titleonly=3&story=' + name);/*very good,17712*/
addLb(lbWarez, 'getrock.me', 'http://getrock.me/?s=' + name);
addLb(lbWarez, 'getrockmusic.net', 'http://www.getrockmusic.net/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'gfxhome.co', 'http://gfxhome.co/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'gfxhome.ws', 'http://gfxhome.ws/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'gfxtra.ch', 'http://gfxtra.ch/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'globalgroovers', 'http://www.globalgroovers.com/?s=' + name);
addLb(lbWarez, 'glorybeats', 'http://glorybeats.com/?s=' + name); /*good,netlabel,12990*/
addLb(lbWarez, 'gnwp.ru', 'http://gnwp.ru/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=0&story=' + name);
addLb(lbWarez, 'godika.net', 'http://godika.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'gold-song.ru', 'http://gold-song.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'gold-warez', 'http://gold-warez.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'goldhiphop,net', 'http://goldhiphop.net/?s=' + name);
addLb(lbWarez, 'goldesel.to', 'http://goldesel.to/suche/' + name);	/*excellent*/
addLb(lbWarez, 'gps-sonoro.blogspot.com', 'http://gps-sonoro.blogspot.com/search/?q=' + name);
addLb(lbWarez, 'gratisdiscos', 'http://gratisdiscos.com/?s=' + name);
addLb(lbWarez, 'gugo.info', 'https://gugo.info/?s=' + name);
addLb(lbWarez, 'guitars101', 'https://www.guitars101.com/forums/search.php?do=process&childforums=1&query=' + name);
addLb(lbWarez, 'hd-download', 'http://www.hd-download.com/search/?q=' + name);
addLb(lbWarez, 'hdmusic.cc', 'https://hdmusic.cc/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'hdmusic.xyz', 'http://hdmusic.xyz/?s=' + name);
addLb(lbWarez, 'hdmusik.org', 'http://hdmusik.org/?s=' + name);
addLb(lbWarez, 'hdreactor.info', 'http://hdreactor.info/4/?do=search&titleonly=3&subaction=search&story=' + name); /*good,5380*/
addLb(lbWarez, 'hdsound.xyz', 'http://hdsound.xyz/index.php?do=search&subaction=search&titleonly=3&story=' + name); /*very good,3080*/
addLb(lbWarez, 'hdvietnam', 'http://www.hdvietnam.com/search/search?keywords=' + name);
addLb(lbWarez, 'headbangers.to', 'https://headbangers.to/search?search_query=' + name);
addLb(lbWarez, 'heavy-music.ru', 'http://www.heavy-music.ru/forum/search.php?submit=Search&keywords=' + name);		/*metal*/
addLb(lbWarez, 'heroturko.cz', 'http://heroturko.cz/index.php?do=search&subaction=search&full_search=1&catlist[]=1&story=' + name);
addLb(lbWarez, 'heroturko.net', 'http://www.heroturko.net/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'heroturkos.me', 'http://www.heroturkos.me/?do=search&subaction=search&story=' + name + '/');
addLb(lbWarez, 'hexmetal.org', 'https://hexmetal.org/?s=' + name);
addLb(lbWarez, 'hi-res.pw', 'http://hi-res.pw/?s=' + name);
addLb(lbWarez, 'hiphopisdream.stream', 'https://hiphopisdream.stream/?s=' + name);
addLb(lbWarez, 'hiphopjakz', 'http://hiphopjakz.com/?s=' + name);
addLb(lbWarez, 'hireszone', 'https://hireszone.com/?s=' + name);
addLb(lbWarez, 'hituribelea', 'http://www.hituribelea.com/cauta/' + name + '/');
addLb(lbWarez, 'hotfileserve.ws', 'http://hotfileserve.ws/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'house-exclusive.me', 'http://www.house-exclusive.me/?s=' + name);
addLb(lbWarez, 'house-language.me', 'http://house-language.me/?s=' + name);
addLb(lbWarez, 'hqjazz.club', 'https://hqjazz.club/?s=' + name);
addLb(lbWarez, 'hqsite.org', 'http://www.hqsite.org/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'ibelief.ru', 'http://ibelief.ru/search/?q=' + name);	/*poor,699*/
addLb(lbWarez, 'icyboy', 'http://www.icyboy.com/search.php?titleonly=1&dosearch=Search+Now&securitytoken=1478514166-f1d7567dcfb791f4b0873e5e9cfce78c07a9ca06&do=process&query=' + name);
addLb(lbWarez, 'identi.li', 'http://www.identi.li/index.php?action=buscador&search=' + name);
addLb(lbWarez, 'iloveitunesmusic.net', 'http://www.iloveitunesmusic.net/?s=' + name);
addLb(lbWarez, 'imp3all', 'http://imp3all.com/?s=' + name);
addLb(lbWarez, 'inevil', 'http://inevil.com/?s=' + name);
addLb(lbWarez, 'intoclassics', 'http://intoclassics.net/search/?q=' + name);
addLb(lbWarez, 'inwarez.org', 'http://www.inwarez.org/search.php?&do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'iplusall.com', 'http://iplusall.com/?s=' + name);	/*ok,13750*/
addLb(lbWarez, 'iplusfree.biz', 'http://iplusfree.biz/?s=' + name);
addLb(lbWarez, 'iplushub', 'http://iplushub.com/?s=' + name);	/* good,15270*/
addLb(lbWarez, 'israblog.download', 'http://israblog.download/search/' + name);
addLb(lbWarez, 'itdmusic.in', 'http://www.itdmusic.in/?s=' + name);	/*vey good,13788, also itdmusic.site */
addLb(lbWarez, 'itopmusic', 'https://www.itopmusic.com/?s=' + name);
addLb(lbWarez, 'itumusicaplus.com', 'http://www.itumusicaplus.com/search?q=' + name); /*ok,2278*/
addLb(lbWarez, 'itunesplusaacm4a.com', 'http://www.itunesplusaacm4a.com/?s=' + name);
addLb(lbWarez, 'jackfreakz', 'http://jackfreakz.com/search.php?securitytoken=guest&do=process&query=' + name);
addLb(lbWarez, 'jambitiket', 'https://jambitiket.com/?s=' + name);
addLb(lbWarez, 'jarochos.net', 'https://www.jarochos.net/search/search?title_only=1&_xfToken=11480%2C1521837509%2Cf7d373721940c1ed7c69471cfef888beccc37e5d&keywords=' + name);
addLb(lbWarez, 'jazz-music.cool', 'https://jazz-music.net/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'jazz-rock-fusion-guitar.blogspot.com', 'http://jazz-rock-fusion-guitar.blogspot.com/search?q=' + name);
addLb(lbWarez, 'jazzsolooconleche.blogspot.com', 'http://jazzsolooconleche.blogspot.com/search?q=' + name);		/*jazz*//*blogsot*/
addLb(lbWarez, 'jpddl', 'https://jpddl.com/search?utf8=%E2%9C%93&q=' + name);
addLb(lbWarez, 'kccryptredux.blogspot.com', 'http://kccryptredux.blogspot.com/search?q=' + name);
addLb(lbWarez, 'keeperlink.info', 'http://keeperlink.info/index.php?do=search&subaction=search&titleonly=3&catlist[]=15&story=' + name);
addLb(lbWarez, 'ketmokin7audio.blogspot.com', 'http://ketmokin7audio.blogspot.com/search?q=' + name); /*very good,jazz,6784*/
addLb(lbWarez, 'kidsofthestreets.ru', 'http://kidsofthestreets.ru/search/node/' + name);
addLb(lbWarez, 'kingdom-leaks', 'http://kingdom-leaks.com/index.php?/search/&q=' + name); /*very good,4632*/
addLb(lbWarez, 'klodius.livejournal.com', 'http://www.livejournal.com/gsearch/?engine=google&cx=partner-pub-5600223439108080:3711723852&cof=FORID:10&as_sitesearch=klodius.livejournal.com&q=' + name);
addLb(lbWarez, 'kobdasoft', 'http://kobdasoft.com/index.php?name=search&do=search&subaction=search&story=' + name);
addLb(lbWarez, 'kudav.ru', 'http://kudav.ru/search/?q=' + name);
addLb(lbWarez, 'laciteedessourd.blogspot.com', 'http://laciteedessourd.blogspot.com/search?q=' + name);	/*r7b,funk,3972*/
addLb(lbWarez, 'lairsofthedragon', 'http://www.lairsofthedragon.com/forum/index.php?app=core&module=search&do=search&fromMainBar=1&search_app=forums:forum:56&search_term=' + name);
addLb(lbWarez, 'lalap.download', 'http://lalap.download/?s=' + name);
addLb(lbWarez, 'lanovaboticadelaleman.blogspot.com', 'http://lanovaboticadelaleman.blogspot.com/search/?q=' + name);	/*latin,tango,folklorico,2460*/
addLb(lbWarez, 'lapaj.net', 'http://warez.lapaj.net/search.php?terms=all&fid[]=44&sf=titleonly&keywords=' + name);
addLb(lbWarez, 'lastrale', 'http://www.lastrale.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'latestmusic.party', 'https://latestmusic.party/search/' + name);
addLb(lbWarez, 'laybize', 'http://laybize.com/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'leadrly', 'http://www.leadrly.com/music/?do=search&titleonly=3&subaction=search&story=' + name);
addLb(lbWarez, 'leakedearly.review', 'https://leakedearly.review/?s=' + name);
addLb(lbWarez, 'leaker.se', 'http://leaker.se/search/page/' + name);
addLb(lbWarez, 'legionmusica.org', 'http://www.legionmusica.org/?s=' + name);
addLb(lbWarez, 'lessbuzz', 'http://lessbuzz.com/?s=' + name);
addLb(lbWarez, 'link4file', 'http://www.link4file.com/download-search.php?q=' + name);
addLb(lbWarez, 'listentomusic.club', 'https://listentomusic.club/?s=' + name);
addLb(lbWarez, 'livejazzlounge', 'http://livejazzlounge.com/?s=' + name);
addLb(lbWarez, 'livenumetal.es', 'http://livenumetal.es/?s=' + name);
addLb(lbWarez, 'loadedbaze.co', 'https://loadedbaze.co/music/search/' + name);
addLb(lbWarez, 'lobosolitario', 'http://www.lobosolitario.com/foro/search?q=' + name);	/*very good,59700*/
addLb(lbWarez, 'lol54.ru', 'http://lol54.ru/?s=' + name);
addLb(lbWarez, 'lolymusic', 'http://lolymusic.com/?do=pro&subaction=search&story=' + name);
addLb(lbWarez, 'lossless.fun', 'https://lossless.fun/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'lossless.site', 'http://lossless.site/?s=' + name);
addLb(lbWarez, 'lossless-galaxy.ru', 'http://lossless-galaxy.ru/index.php?do=search&subaction=search&full_search=1&titleonly=3&story=' + name);
addLb(lbWarez, 'lossless24', 'http://lossless24.com/?s=' + name);	/*very good,lossless,37500*/
addLb(lbWarez, 'losslessflac.com', 'http://losslessflac.com/s=' + name);
addLb(lbWarez, 'losslessma.net', 'http://losslessma.net/?s=' + name);
addLb(lbWarez, 'losslessmusics', 'http://losslessmusics.org/search/?q=' + name); /*very good,lossless,22612*/
addLb(lbWarez, 'luigis50s60svinylcorner.blogspot.com', 'http://luigis50s60svinylcorner.blogspot.com/search?q=' + name);	/*vintage,vinyl,1810*/
addLb(lbWarez, 'luigismooth.blogspot.com', 'http://luigismooth.blogspot.com/search?q=' + name);	/*jazz,3510*/
//addLb(lbWarez, 'm-hddl', 'http://www.m-hddl.com/search.php?securitytoken=1465635444-b4f2f7843c0231c1973961cfc1e47e6e03fbefa0&do=process&query=' + name);
addLb(lbWarez, 'm-hddl', 'https://www.google.com/search?q=site%3Am-hddl.com+inurl%3Alossless-music+' + name);
addLb(lbWarez, 'mademp3', 'http://www.mademp3.com/?s=' + name);
//addLb(lbWarez, 'magemp3', 'http://magemp3.com/albums/' + name);
addLb(lbWarez, 'marapcana.pw', 'http://marapcana.pw/?s="' + name + '"');
addLb(lbWarez, 'markovka.pp.ua', 'https://www.markovka.pp.ua/?do=search&subaction=search&titleonly=3&story=' + name);
//addLb(lbWarez, '3Amarkovka.pp.ua', 'https://www.google.com/search?q=site%3Amarkovka.pp.ua+intitle%3A' + name);
addLb(lbWarez, 'mechopirate', 'https://www.mechopirate.com/search/112352/?c[title_only]=1&q=' + name);
addLb(lbWarez, 'mechoportal', 'http://www.mechoportal.com/index.php?do=search&subaction=search&catlist[]=1&titleonly=3&story=' + name);
addLb(lbWarez, 'media-collector', 'https://media-collector.com/?s=' + name);
addLb(lbWarez, 'megadescargas', 'http://www.megadescargas.info/?s=' + name);
addLb(lbWarez, 'megascene.win', 'https://megascene.win/?s=' + name);
addLb(lbWarez, 'masalahusaha', 'http://masalahusaha.com/?s=' + name);
addLb(lbWarez, 'metalargentum', 'http://www.metalargentum.com/search.php?mode=results&search_fields=titleonly&show_results=topics&search_keywords=' + name);
addLb(lbWarez, 'metalrock.org', 'https://metalrock.org/?s=' + name);
addLb(lbWarez, 'metaltoxiccity.ucoz', 'http://metaltoxiccity.ucoz.com/search/?q=' + name); /*ok,metal,460*/
addLb(lbWarez, 'minimalistica.biz', 'http://minimalistica.biz' + name);
addLb(lbWarez, 'mizikisa.com', 'https://mizikisa.com/?s=' + name);
addLb(lbWarez, 'mlamir.download', 'http://mlamir.download/?s=' + name);
addLb(lbWarez, 'moborusak.download', 'http://moborusak.download/search/' + name);
addLb(lbWarez, 'moyako.download', 'http://moyako.download?s=' + name);
addLb(lbWarez, 'mov-world.net', 'http://mov-world.net/?c=7&q=' + name);
addLb(lbWarez, 'movie-forum.co', 'http://movie-forum.co/search.php?securitytoken=1471566849-68643315e1e492f2fb329e71a15ccbf94d3fc491&do=process&query=' + name);
addLb(lbWarez, 'mp3-ogg.ru', 'http://www.mp3-ogg.ru/search.php?&return_chars=2000&search_keywords=' + name);
addLb(lbWarez, 'mp3andlosslessmusic', 'http://mp3andlosslessmusic.com/?s=' + name);	/*good,41570*/
addLb(lbWarez, 'mp3db.pro', 'http://mp3db.pro/search.php?s=' + name);
addLb(lbWarez, 'mp3dj.eu', 'http://mp3dj.eu/index.php?do=search&subaction=search&story=' + name);	/*excellent*/
addLb(lbWarez, 'mp3face', 'http://mp3face.com/?s=' + name);
addLb(lbWarez, 'mp3forum.com.ua', 'http://mp3forum.com.ua/index.php?act=Search# --> enter manually"' + name + '" "' + tit + '"');
addLb(lbWarez, 'mp3kutusu.org', 'http://www.mp3kutusu.org/search.php?securitytoken=guest&do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'mp3musicfree.co', 'http://mp3musicfree.co/?s=' + name);
addLb(lbWarez, 'mp3okno.net', 'http://www.mp3okno.net/?do=search&slovo=' + name);
addLb(lbWarez, 'mp3s.su', 'http://mp3s.su/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'mp3s-djrafn.ru', 'http://mp3s-djrafn.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'mp3sort.biz', 'http://mp3sort.biz/search.php?mode=results&search_keywords=' + name); /*good,15150*/
addLb(lbWarez, 'mqs.link', 'http://mqs.link/?s=' + name);
addLb(lbWarez, 'museorosenbach.blogspot.com', 'http://museorosenbach.blogspot.com/search?q=' + name);	/*prog*/
addLb(lbWarez, 'musflat.kamrbb.ru', 'http://musflat.kamrbb.ru/?x=find&type=messages&f=' + name);
addLb(lbWarez, 'music-lossless.top', 'http://music-lossless.top/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'music-sbornik.ru', 'http://music-sbornik.ru/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'music.is-amazing', 'http://music.is-amazing.com/search/node/' + name);
addLb(lbWarez, 'music3p.com', 'http://www.music3p.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=0&full_search=1&story=' + name);
addLb(lbWarez, 'music4newgen.org', 'https://music4newgen.org/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'musicabest.ru', 'http://musicabest.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'musicalala', 'http://musicalala.com/index.php?do=search&subaction=search&titleonly=3&sortby=date&story=' + name);
addLb(lbWarez, 'musicalbee', 'http://musicalbee.com/?s=' + name);
addLb(lbWarez, 'musicalbums.org', 'http://musicalbums.org/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'musicaltreasure.blogspot.com', 'http://musicaltreasure.blogspot.com/search?q=' + name);
addLb(lbWarez, 'musicalworld.co', 'https://www.musicalworld.co/?s=' + name);
addLb(lbWarez, 'musiceffect.ru', 'http://musiceffect.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'musickingz.net', 'https://musickingz.net/?s=' + name);
addLb(lbWarez, 'musicletter', 'http://musicletter.tistory.com/search/' + name);
addLb(lbWarez, 'musicrls.net', 'https://musicrls.net/?s=' + name);
addLb(lbWarez, 'musicyeah.net', 'http://www.musicyeah.net/?s=' + name);
addLb(lbWarez, 'musikfestival.info', 'https://www.musikfestival.info/?s=' + name);
addLb(lbWarez, 'muzica', 'http://www.muzica.com/caut/' + name.replace(/%20/g, "-"));
addLb(lbWarez, 'mvaleryi.blogspot.com', 'http://mvaleryi.blogspot.com/search?q=' + name);
addLb(lbWarez, 'mydeep.org', 'http://mydeep.org/?s=' + name);
addLb(lbWarez, 'mygully', 'http://mygully.com/search.php?s=&securitytoken=1460773665-3ad28a80c8aee9b0cb8d30c053b9a327dea45d81&do=process&query=' + name); /*excellent,125800*/
addLb(lbWarez, 'mygully', 'https://myklad.org/search/# must enter manually -->' + name); /*good,68145*/
addLb(lbWarez, 'n-stars.pl', 'http://www.n-stars.pl/search.php?securitytoken=1472557010-beded72caf741754bdf90b491276c7100822706b&do=process&titleonly=1&forumchoice[]=11&childforums=1&query=' + name);
addLb(lbWarez, 'nasze-kino.pl', 'http://nasze-kino.pl/search.php?titleonly=1&securitytoken=guest&do=process&query=' + name);
addLb(lbWarez, 'neformat', 'http://www.neformat.com.ua/forum/search.php?do=process&quicksearch=1&childforums=1&titleonly=1&s=&securitytoken=guest&query=' + name);
addLb(lbWarez, 'nemo-crack.org', 'http://nemo-crack.org/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'neolera.org', 'http://www.neolera.org/search?search_keywords=' + name);
addLb(lbWarez, 'neomaks.ru', 'http://neomaks.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);	/*very good,31168*/
addLb(lbWarez, 'neurime', 'http://www.neurime.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=5&story=' + name);
addLb(lbWarez, 'newagestyle.net', 'http://newagestyle.net/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'newbestmusic.bid', 'https://newbestmusic.bid/?s=' + name);
addLb(lbWarez, 'newbum.net', 'http://newbum.net/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'newmusic.trade', 'https://newmusic.trade/search/' + name);
addLb(lbWarez, 'newothermusic.blogspot.com', 'http":/newothermusic.blogspot.com/search?s=' + name);	/*modern-clasical,experimental,electronic,7173*/
addLb(lbWarez, 'newreleases.fullalbums.org', 'http://newreleases.fullalbums.org/blogs/?s=' + name);
addLb(lbWarez, 'newwebstar', 'http://www.newwebstar.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'nightclubber', 'https://www.nightclubber.com.ar/foro/search.php?titleonly=1&dosearch=Buscar+ahora&do=process&query=' + name);
addLb(lbWarez, 'nightquest.net', 'http://nightquest.net/search/search?nodes[]=2&child_nodes=1&keywords=' + name);
addLb(lbWarez, 'nirmoladda', 'http://www.nirmoladda.com/search/search?keywords=' + name);
addLb(lbWarez, 'nitki2.net', 'http://nitki2.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'nk-team.net', 'http://nk-team.net/search.php?nkq=' + name);
addLb(lbWarez, 'nolamers.net', 'http://nolamers.net/index.php?do=search&subaction=search&story=' + name);	/*ok,17620*/
addLb(lbWarez, 'nowa.cc', 'http://www.nowa.cc/search.php?s=&securitytoken=guest&do=process&exactname=1&forumchoice[]=27&childforums=1&query=' + name);
addLb(lbWarez, 'nowdl.org', 'http://nowdl.org/?s=' + name);
addLb(lbWarez, 'nudeemo.info', 'https://nudeemo.info/?s=' + name); /*16296*/
//addLb(lbWarez, 'nulledfilez', 'http://nulledfilez.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=1&story=' + name);
addLb(lbWarez, 'nwcod.com', 'http://www.nwcod.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'nydus.org', 'http://u.nydus.org/search.php?s=&securitytoken=1465844276-01c7efd04b3d0a5aba1a097cbffcb32dc83add06&do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'nwf.cz', 'http://www.nwf.cz/index.php?action=search2&advanced=1&subject_only=1&search=' + name);
addLb(lbWarez, 'onsaft.cm', 'http://www.onsaft.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=18&story=' + name);	/*poor,12160*/
addLb(lbWarez, 'onur-board.de', 'http://www.onur-board.de/index.php?form=Search&q=' + name);
addLb(lbWarez, 'osreformados', 'http://osreformados.com/index.php?action=search2&search=' + name);
addLb(lbWarez, 'pandopuntokualda', 'http://www.pandopuntokualda.com/search.php?titleonly=1&securitytoken=1466899182-f213b22ba81f238a6fd2e04bf52f0b6bbe1a0b15&do=process&query=' + name);
addLb(lbWarez, 'pebay.ru', 'http://pebay.ru/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=16&story=' + name);
addLb(lbWarez, 'pebx.pl', 'https://pebx.pl/search/4924428/?c[title_only]=1&q=' + name);
addLb(lbWarez, 'phazeddl.me', 'http://phazeddl.me/?s=' + name);
addLb(lbWarez, 'phoenix-wz.cc', 'https://www.phoenix-wz.cc/search.php?action=search&search=Submit&keywords=' + name);
addLb(lbWarez, 'phuongdzu', 'http://phuongdzu.com/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'piratarockk.blogspot.com', 'https://piratarockk.blogspot.com/search?q=' + name);
addLb(lbWarez, 'pirate-punk.net', 'http://www.pirate-punk.net/search.php?do=process&dosearch=Search&titleonly=1&childforums=1&forumchoice[]=43&query=' + name);
addLb(lbWarez, 'plastinka.org', 'http://plastinka.org/?titleonly=3&do=search&subaction=search&story=' + name);
addLb(lbWarez, 'plastinka-rip.ru', 'http://plastinka-rip.ru/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'ploooomysunday.blogspot.com', 'http://ploooomysunday.blogspot.com/search?q=' + name);
addLb(lbWarez, 'plotn08.org', 'http://plotn08.org/?s=' + name);
addLb(lbWarez, 'pobieramy24.pl', 'http://pobieramy24.pl/search.php?do=process&titleonly=1&securitytoken=guest&query=' + name);
addLb(lbWarez, 'pockethp.info', 'https://pockethp.info/?s=' + name);
addLb(lbWarez, 'portalnet.cl', 'http://www.portalnet.cl/comunidad/busqueda.php?cx=partner-pub-9172359646728920&cof=FORID%3A9&ss=2593j2228801j5&q=' + name);
addLb(lbWarez, 'postland.com.mx', 'http://www.postland.com.mx/buscador/?e=web&cat=23&q=' + name);
addLb(lbWarez, 'pqpbach.sul21.com.br', 'http://pqpbach.sul21.com.br/?s=' + name);
addLb(lbWarez, 'pravoholding.ru', 'http://pravoholding.ru/index.php?do=search&subaction=search&titleonly=3&catlist[]=6&story=' + name);
addLb(lbWarez, 'progrockworld.ru', 'http://progrockworld.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'promakashka.ru', 'http://promakashka.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'psy-wave', 'http://www.psy-wave.com/search/?q=' + name);
addLb(lbWarez, 'punksandskins', 'http://punksandskins.com/search.php?fid[]=1&sf=titleonly&sr=topics&keywords=' + name);
addLb(lbWarez, 'qiqru.org', 'http://qiqru.org/s.php?scat[]=33&q=' + name); /*ok*/
addLb(lbWarez, 'quebecunderground.net', 'http://www.quebecunderground.net/search.php?do=process&childforums=1&forumchoice[]=43&query=' + name);
addLb(lbWarez, 'rapid-rls.site', 'http://rapid-rls.site/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'rapide-telechargement.fr', 'http://rapide-telechargement.fr/rapide/' + name + '/');
addLb(lbWarez, 'rapidmoviez', 'http://www.rapidmoviez.biz/index.php?do=search&subaction=search&titleonly=3&sortby=date&resorder=desc&catlist[]=14&story=' + name);
addLb(lbWarez, 'raplist.ru', 'http://raplist.ru/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&story=' + name);
addLb(lbWarez, 'raritetno', 'http://raritetno.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'razvratu.net', 'http://www.razvratu.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);	/*ok,11650	*/
addLb(lbWarez, 'rdlinks.xyz', 'http://rdlinks.xyz/search/search?title_only=1&nodes[]=53&keywords=' + name);
addLb(lbWarez, 'readernews.net', 'http://readernews.net/?s=' + name);
addLb(lbWarez, 'recantomp3', 'http://site.recantomp3.com/search?q=' + name);
addLb(lbWarez, 'reduson', 'https://www.reduson.com/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=5&story=' + name);	/*good,22240*/
addLb(lbWarez, 'releasesmusic', 'http://releasesmusic.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'remusic.ru', 'http://remusic.ru/index.php?do=search&subaction=search&full_search=1&titleonly=3&showposts=0&story=' + name);
addLb(lbWarez, 'republicofjazz.blogspot.com', 'http://republicofjazz.blogspot.com/search?q=' + name);
addLb(lbWarez, 'respecta.is', 'http://respecta.is/index.php?do=search&subaction=search&full_search=1&titleonly=3&story=' + name);
addLb(lbWarez, 'reverbhd.co', 'https://reverbhd.co/?s=' + name);
addLb(lbWarez, 'rezedio', 'http://www.rezedio.com/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=5&story=' + name);
addLb(lbWarez, 'rgf.is', 'http://rgf.is/index.php?option=com_search&searchphrase=all&searchword=' + name);
//addLb(lbWarez, 'riverwarez.net', 'http://riverwarez.net/?s=' + name);
//addLb(lbWarez, 'rls-movies', 'http://forum.rls-movies.com/search.php?titleonly=1&sortby=relevance&securitytoken=1490080940-897226b7d0c8c869e9cff45764079845c0c76b29&do=process&query=' + name); /*excellent,185400*/
addLb(lbWarez, 'rlslog.eu', 'http://www.rlslog.eu/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'rnbxclusive.stream', 'http://rnbxclusive.stream/?s=' + name);	/*good,16470*/
addLb(lbWarez, 'rock60-70.ru', 'http://rock60-70.ru/?s=' + name);
addLb(lbWarez, 'rockandrollarchives', 'http://www.rockandrollarchives.net/search?q=' + name);
addLb(lbWarez, 'rockaor', 'http://rockaor.com/?s=' + name);
addLb(lbWarez, 'rockasteria.blogspot.com', 'http://rockasteria.blogspot.com/search?q=' + name);	/*1670*/
addLb(lbWarez, 'rockoldies blog', 'http://rockoldies.net/?s=' + name);
addLb(lbWarez, 'rockoldies', 'http://rockoldies.net/forum/search.php#NO SEARCH GET, USE SEARCHBOX ' + name);
addLb(lbWarez, 'rslinks.org', 'http://rslinks.org/search/' + name);
addLb(lbWarez, 'ru-admin.net', 'http://ru-admin.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=6&story=' + name);
addLb(lbWarez, 'ru-board', 'http://forum.ru-board.com/google.cgi?cx=partner-pub-3191513952494802%3A7041921594&cof=FORID%3A10&q=' + name);
//addLb(lbWarez, 'ru-talk', 'http://ru-talk.com/search.php?titleonly=1&securitytoken=1466151478-d06bdcd6da6df6cacbb0798719f2115b5718546d&do=process&query=' + name);
addLb(lbWarez, 'ru-video.ws', 'http://ru-video.ws/index.php?do=search&subaction=search&titleonly=3&catlist[]=94&story=' + name);
addLb(lbWarez, 'rupsy.ru', 'http://www.rupsy.ru/index.php?id=4&search=' + name);
addLb(lbWarez, 'rusfree.net', 'http://rusfree.net/index.php?do=search&subaction=search&full_search=1&titleonly=3&story=' + name);
addLb(lbWarez, 'samoylenko.info', 'http://www.samoylenko.info/index.php?do=search&subaction=search&titleonly=3&catlist[]=4&story=' + name);
addLb(lbWarez, 'scenedownloads.pw', 'https://scenedownloads.pw/Music?search=' + name);
addLb(lbWarez, 'sceper.ws', 'https://www.google.com/search?num=30&newwindow=1&q=site%3Asceper.ws+' + name);
addLb(lbWarez, 'scn4u.com', 'http://www.scn4u.com/category/music/?s=' + name);
addLb(lbWarez, 'scnsrc.me', 'http://www.scnsrc.me/?s=' + name);
addLb(lbWarez, 'schrabbel-punk.me', 'http://schrabbel-punk.me/index.php?search_all=' + name);
addLb(lbWarez, 'sent.su', 'http://sent.su/index.php?do=search&subaction=search&search_start=1&titleonly=3&catlist[]=12&story=' + name);
addLb(lbWarez, 'serbianforum.org', 'http://serbianforum.org/search/11111111/?q=' + name);
//addLb(lbWarez, 'shaanig.org', 'http://www.shaanig.org/search.php?do=process&securitytoken=guest&titleonly=1&query=' + name);
addLb(lbWarez, 'shanson-e.tk', 'http://shanson-e.tk/forum/search.php?do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'sharethefiles', 'http://sharethefiles.com/forum/search.php?fid[]=115&sf=titleonly&keywords=' + name);
addLb(lbWarez, 'sharingdb.me', 'http://sharingdb.me/?s=' + name);
addLb(lbWarez, 'sharemania.us', 'http://sharemania.us/search/2613559/?o=date&c[title_only]=1&c[node]=135+136+145+137+144+138+139+142+143+148+149+141&q=' + name);
addLb(lbWarez, 'siempreporcompartir.blogspot.com', 'http://siempreporcompartir.blogspot.com/search?q=' + name);
addLb(lbWarez, 'skatay', 'http://skatay.com/search/?q=' + name);
//addLb(lbWarez, 'skdown.net', 'http://skdown.net/forum/index.php?search_content=titles&search_term=' + name);
addLb(lbWarez, 'so-name.info', 'https://so-name.info/?s=' + name);	/*excellent,12000*/
addLb(lbWarez, 'softarchive.la', 'http://my.softarchive.la/search/?q=' + name);	/*excellent,12000*/
addLb(lbWarez, 'softsova.ru', 'http://softsova.ru/search/?q=' + name);	/*excellent,12000*/
addLb(lbWarez, 'solisearch.net', 'http://www.solisearch.net/index.php?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'soulnmusic', 'http://soulnmusic.com/?s=' + name);
addLb(lbWarez, 'specialfordjs.org', 'http://specialfordjs.org/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'speedlounge.in', 'http://speedlounge.in/download/listSearch/category/19?genre=&search=' + name);
addLb(lbWarez, 'stampsom.blogspot.com', 'http://stampsom.blogspot.com/search?q=' + name); /*blues*/
addLb(lbWarez, 'stardancer.at.ua', 'http://stardancer.at.ua/search/?m=site&m=publ&t=0&q=' + name);
addLb(lbWarez, 'straightnochaser67.blogspot.com', 'http://straightnochaser67.blogspot.com/search?q=' + name);	/*jazz*/
addLb(lbWarez, 'streamloadforum', 'http://www.streamloadforum.com/index.php?action=search2&search=' + name);
addLb(lbWarez, 'sugarmegs', 'http://tela.sugarmegs.org/?showid=&bandid=&tbSearch=' + name);
addLb(lbWarez, 'super-warez.eu', 'http://super-warez.eu/?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'super-warez.net', 'http://super-warez.net/index.php?do=search&subaction=search&titleonly=3&catlis[]=3&story=' + name);
addLb(lbWarez, 'supoza', 'http://www.supoza.com/music/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'surfingtheodyssey.blogspot.com', 'http://surfingtheodyssey.blogspot.com/search?q=' + name);	/*eclectic,cnt=4115*/
addLb(lbWarez, 'takemetal.org', 'http://takemetal.org/?s=' + name);	/*very good,11664*/
addLb(lbWarez, 'techdeephouse', 'http://techdeephouse.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
//addLb(lbWarez, 'tehparadox', 'http://tehparadox.com/forum/search.php?titleonly=1&do=process&quicksearch=1&securitytoken=1471290588-8b4613d392e4afea5840814b7197125dfb3f0af2&query=' + name);	/*excellent,1116325*/
addLb(lbWarez, 'telecharger-file.fr', 'http://telecharger-file.fr/recherche/' + name + '/');
addLb(lbWarez, 'telechargement-sos.fr', 'http://telechargement-sos.fr/recherche/' + name + '/'); /*good,26610*/
addLb(lbWarez, 'telecharger-goldz.fr', 'http://telecharger-goldz.fr/france/' + name + '/');
addLb(lbWarez, 'telechargerzoneu.fr', 'http://telechargerzoneu.fr/?do=search&subaction=search&titleonly=3&story=' + name);	/*OK,12940*/
addLb(lbWarez, 'terabiz.org', 'http://terabiz.org/index.php?do=search&subaction=search&titleonly=3&story=' + name);	/*ok*/
addLb(lbWarez, 'thebest-music', 'http://thebest-music.com/?s=' + name);
addLb(lbWarez, 'theblues-thatjazz', 'http://www.theblues-thatjazz.com/en/component/search/?ordering=newest&searchphrase=exact&searchword=' + name);
addLb(lbWarez, 'themidnightcafe.org', 'https://themidnightcafe.org/?s=' + name);
addLb(lbWarez, 'themfire', 'http://themfire.com/?s=' + name); /*very good,165930*/
addLb(lbWarez, 'thetickletest.blogspot.com', 'http://thetickletest.blogspot.com/search?q=' + name);	/*r&b,jazz,4200*/
addLb(lbWarez, 'thiendia', 'http://thiendia.com/diendan/search/search?title_only=1&_xfToken=1896521%2C1518129935%2Cfb3805011cadc7115c06b983e0e6a3fe6243f5f7&keywords=' + name);
addLb(lbWarez, 'tonitop', 'http://www.tonitop.org/music/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'topalbums.ru', 'http://topalbums.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name); /*good,154245*/
addLb(lbWarez, 'topmuzik.info', 'http://topmuzik.info/?s=' + name);
addLb(lbWarez, 'toprels', 'http://toprels.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'toptun.net', 'http://toptun.net/index.php?do=search&subaction=search&search_start=0&full_search=0&result_from=1&story=' + name);
addLb(lbWarez, 'torrentebook.net', 'http://torrentebook.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=7&story=' + name);
addLb(lbWarez, 'torrentmusic.download', 'http://www.torrentmusic.download/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'trance-music.org', 'http://trance-music.org/?s=' + name);
addLb(lbWarez, 'trix360', 'https://trix360.com/search.php?mod=forum&searchsubmit=yes&srchtxt=' + name);
addLb(lbWarez, 'turkuk.ru', 'http://www.turkuk.ru/ara?searchword=' + name);
addLb(lbWarez, 'tvrels', 'http://tvrels.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);	/*very good,19460*/
addLb(lbWarez, 'twistysdownload.com', 'http://www.twistysdownload.com/index.php?do=search&subaction=search&catlist[]=5&story=' + name); /*gppd,30150*/
addLb(lbWarez, 'ulitka.kz', 'http://ulitka.kz/index.php?do=search&subaction=search&titleonly=3&catlist[]=6&catlist[]=78&story=' + name);
addLb(lbWarez, 'uu.canna.to', 'http://uu.canna.to/links.php?action=suche&s_sort=datum+desc&s_beschreibung=1&s_kat_id=alle&s_filename=1&action=suche&s_string=' + name);
addLb(lbWarez, 'uploadedrls.download', 'https://uploadedrls.download/?s=' + name);
addLb(lbWarez, 'va-album', 'http://va-album.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'vapemat.xyz', 'https://vapemat.xyz/?s=' + name);
addLb(lbWarez, 'veverel.net', 'http://veverel.net/index.php?do=search&subaction=search&titleonly=3&catlist[]=2&story=' + name);
addLb(lbWarez, 'vid-kor.ru', 'http://vid-kor.ru/index.php?do=search&subaction=search&titleonly=30&story=' + name);	/*ok,9160*/
addLb(lbWarez, 'vip-files.ru', 'http://vip-files.ru/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'viperial.win', 'https://viperial.win/?s=' + name);
addLb(lbWarez, 'vitanclub.site', 'http://www.vitanclub.site/descarca-mp3/' + name + '.html');
//addLb(lbWarez, 'vuidown.pw', 'http://www.vuidown.pw/index.php?do=search&subaction=search&titleonly=3&catlist[]=5&story=' + name + '.html'); /*excellent,28771*/
addLb(lbWarez, 'viz4u', 'http://www.viz4u.net/v3/?s=' + name);
addLb(lbWarez, 'vsetutonline', 'http://vsetutonline.com/forum/search.php?do=process&titleonly=1&query=' + name);
addLb(lbWarez, 'vtoroy.ucoz.ru', 'http://vtoroy.ucoz.ru/search/?q=' + name);
addLb(lbWarez, 'warez-bb.org', 'https://www.warez-bb.org/search.php?search_terms=all&search_fields=titleonly&sort_dir=DESC&show_results=topics&search_keywords=' + name); /*vg,38500*/
addLb(lbWarez, 'warez-load.org', 'http://www.warez-load.org/search.php?action=do_search# <-- manually search for' + name);
addLb(lbWarez, 'warez-serbia', 'http://warez-serbia.com/?do=search&subaction=search&story=' + name);
addLb(lbWarez, 'warez-vislovo.ru', 'http://warez-vislovo.ru/search/?q=' + name);
//addLb(lbWarez, 'warezaz', 'http://warezaz.com/?s=' + name);
addLb(lbWarez, 'viz4u', 'http://www.viz4u.net/v3/?s=' + name);
addLb(lbWarez, 'warezlinks.us', 'http://warezlinks.us/bb/index.php?app=core&module=search&do=search&fromMainBar=1&search_content=titles&search_app=forums&search_term=' + name);
addLb(lbWarez, 'warezlover.in', 'http://warezlover.in/?do=search&subaction=search&titleonly=3&catlist[]=26&story=' + name); /*very good,56790*/
addLb(lbWarez, 'warezluan', 'http://warezluan.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=29&story=' + name);
addLb(lbWarez, 'wawa-unlocked.fr', 'http://wawa-unlocked.fr/ddl/' + name + '/');
addLb(lbWarez, 'wayw2', 'http://wayw2.com/search/' + name);
addLb(lbWarez, 'win7dl.org', 'http://win7dl.org/index.php?do=search&subaction=search&catlist[]=22&titleonly=3&story=' + name);
addLb(lbWarez, 'wiwika', 'http://wiwika.com/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=18&story=' + name);
addLb(lbWarez, 'wolixs.at.ua', 'http://wolixs.at.ua/search/?q=' + name);
//addLb(lbWarez, 'wickedmetal.org', 'http://wickedmetal.org/?s=' + name);
//addLb(lbWarez, 'wrzko.ws', 'http://wrzko.ws/?s=' + name);	/*ok,2576*/
addLb(lbWarez, 'x-caleta2', 'http://www.x-caleta2.com/index.php?do=search&subaction=search&titleonly=3&story=' + name);
addLb(lbWarez, 'xclusivejams', 'https://www1.xclusivejams.com/?s=' + name);
addLb(lbWarez, 'xclusivejams.win', 'https://xclusivejams.win/?s=' + name);
addLb(lbWarez, 'xdownload.pl', 'http://www.xdownload.pl/?do=search&subaction=search&full_search=1&titleonly=3&story=' + name);
addLb(lbWarez, 'xfobo', 'http://www.xfobo.com/search.php?query=' + name);
addLb(lbWarez, 'xtragfx', 'http://xtragfx.com/index.php?do=search&subaction=search&search_start=0&full_search=1&titleonly=0&showposts=0&catlist[]=32&story=' + name);
addLb(lbWarez, 'y2o5w.info', 'http://y2o5w.info/search?q=' + name);
addLb(lbWarez, 'yeucontrai', 'http://www.yeucontrai.com/search.php?securitytoken=1472562280-e85635cc457870abc186ae6cb8b0b2aaa48c805e&do=process&query=' + name);
//addLb(lbWarez, 'zenekucko.ucoz.com', 'http://zenekucko.ucoz.com/search/?q=' + name);
addLb(lbWarez, 'zippy4shared.download', 'https://zippy4shared.download/?s=' + name); /*ok,3093*/
addLb(lbWarez, 'zippysharealbums.win', 'https://zippysharealbums.win/search/' + name);
addLb(lbWarez, 'zippysharemediafire.club', 'https://zippysharemediafire.club/search/' + name);
addLb(lbWarez, 'zippysharesearch.info', 'https://zippysharesearch.info/?q=' + name);
addLb(lbWarez, 'zippysharestream.stream', 'https://zippysharestream.stream/search/' + name);
addLb(lbWarez, 'zonambulos.co', 'http://zonambulos.co/search.php?q=' + name);
addLb(lbWarez, 'zone-telechargement.link', 'https://zone-telechargement.link/?s=' + name);
addLb(lbWarez, 'zonez-telecharger.fr', 'http://zonez-telecharger.fr/france/' + name + '/');	/*very good,26614*/
whereAppend.append(lbWarez);


// torrents
addButton(null, "torrents");
addLb(lbTorrent, '1337x', 'http://www.1337x.to/search/' + name + '/1/');
addLb(lbTorrent, '7tor.org', 'http://7tor.org/search.php?sr=topics&sf=titleonly&fp=0&tracker_search=torrent&keywords=' + name);
addLb(lbTorrent, 'bittorrent.am', "http://www.bittorrent.am/search.php?cat=5&kwds=" + name);
addLb(lbTorrent, 'bthad', "http://www.bthad.com/s/" + name);
addLb(lbTorrent, 'btscene.org', 'https://bt-scene.cc/results_.php?q=' + name);  // also bt-scene.cc and btstor.cc
addLb(lbTorrent, 'demonoid', 'http://www.demonoid.pw/files/?query=' + name);
addLb(lbTorrent, 'isohunt2.net', 'http://www.isohunt2.net/torrents/?ihq=' + name);
addLb(lbTorrent, 'kickass.cd (kat.cr mirror)', 'https://kickass.cd/search.php?q=' + name); /*also kickass.cm*/
addLb(lbTorrent, 'krutor.org', 'http://krutor.org/search/0/8/0/0/' + name);
addLb(lbTorrent, 'limetorrents.cc', 'https://www.limetorrents.cc/search/all/' + name);
addLb(lbTorrent, 'monova', 'https://monova.org/search?term=' + name); // also monova.to
addLb(lbTorrent, 'pirate.ws', 'https://pirate.ws/search.php?nm=' + name);
addLb(lbTorrent, 'rutracker.org', 'http://rutracker.org/forum/tracker.php?nm=' + name + ' ' + tit);
addLb(lbTorrent, 'seedpeer', 'https://www.seedpeer.com/search/' + name);
addLb(lbTorrent, 'soundpark.online', 'https://soundpark.online/search?q=' + name);
addLb(lbTorrent, 'sumotorrent.sx', 'http://www.sumotorrent.sx/en/search/' + name);
addLb(lbTorrent, 'thepiratebay', 'https://thepiratebay.org/search/' + name + '/0/99/0');
addLb(lbTorrent, 'torlock', 'https://www.torlock.com/all/torrents/' + name);
addLb(lbTorrent, 'torrent.cd', 'http://torrent.cd/torrents/search/?s_p_cat=5&q=' + name);
addLb(lbTorrent, 'torrentbit.net', 'http://www.torrentbit.net/search/?cat_id=3&torrent=' + name);
addLb(lbTorrent, 'torrentc.info', 'http://torrentc.info/tracker.php?nm="' + name + '"');
addLb(lbTorrent, 'torrentdownload.me', 'http://www.torrentdownload.me/search?q=' + name);
addLb(lbTorrent, 'torrentdownloads.me', 'http://www.torrentdownloads.me/search/?search=' + name);
addLb(lbTorrent, 'torrentfunk', 'https://www.torrentfunk.com/music/torrents/' + name + '.html?v=&smi=&sma=&i=250');
addLb(lbTorrent, 'torrentino', 'https://torrentino.top/search?type=torrents&search=' + name);
addLb(lbTorrent, 'torrents.in.ua', 'http://torrents.in.ua/search.php?nm=' + name);
addLb(lbTorrent, 'torrents.org.ua', 'http://torrents.org.ua/search.php?to=1&nm=' + name);
addLb(lbTorrent, 'torrents.me', 'https://torrents.me/s/' + name);
addLb(lbTorrent, 'torrentz.cd', 'http://torrentz.cd/' + name);
addLb(lbTorrent, 'torrentz.to', 'http://torrentz.to/search.php?category_id_input=Music&category_id=5&q=' + name);
addLb(lbTorrent, 'torrentz2.eu', 'http://torrentz2.eu/search?f=' + name);	/*excellent,DB*/
addLb(lbTorrent, 'treetorrent', 'http://treetorrent.com/search/' + name); /*meta*/
addLb(lbTorrent, 'vanila.org', 'http://vanila.org/search.php?tracker_search=torrent&sf=titleonly&sr=topics&keywords=' + name);
addLb(lbTorrent, 'wmtorrent', 'https://www.wmtorrent.com/' + name); /*meta*/
addLb(lbTorrent, '------others------', '');
addLb(lbTorrent, 'a8bt', 'http://a8bt.com/a8/' + name + '/1-0-0.html');
addLb(lbTorrent, 'bringingtheheatabq', 'http://bringingtheheatabq.com/search?q=' + name); /*meta*/
addLb(lbTorrent, 'btanv', "http://www.btanv.com/search/" + name + '-first-asc-1');
addLb(lbTorrent, 'btcat', 'http://btcat.org/search/' + name + '.html');
addLb(lbTorrent, 'btdb.to', 'http://btdb.to/q/' + name);
addLb(lbTorrent, 'bteye', 'http://www.bteye.org/q/' + name);
addLb(lbTorrent, 'bt4g', 'https://bt4g.com/search/' + name);
addLb(lbTorrent, 'btgun.com', 'http://www.btgun.com/list/' + name + '-s1d-1.html');
addLb(lbTorrent, 'bthand.net', 'http://www.bthand.net/s/' + name + '.html');
addLb(lbTorrent, 'btkitty.fyi', 'http://btkitty.fyi/?keyword=' + name + '#post not working, use search box');
addLb(lbTorrent, 'btku.org', 'http://btku.org/q/' + name +'/');  // also btku.me
addLb(lbTorrent, 'btloft', 'http://www.btloft.com/search?query=' + name);
addLb(lbTorrent, 'btpeer', 'http://www.btpeer.com/list/' + name + '-first-asc-1');
addLb(lbTorrent, 'btput', 'http://www.btput.com/search/' + name);
addLb(lbTorrent, 'btso.pw', "https://btso.pw/search/" + name);
addLb(lbTorrent, 'btspider', "http://www.btspider.com/" + name + "-first-asc-1.html?f=h");
addLb(lbTorrent, 'bttit.com', 'http://www.bttit.com/torrent/' + name + '.html');
addLb(lbTorrent, 'btuse.com', 'http://www.btuse.com/search/' + name + '.html');
addLb(lbTorrent, 'cili.jp', 'https://cili.jp/search/' + name + '.html');
addLb(lbTorrent, 'digbt.org', 'http://digbt.org/search/' + name);
addLb(lbTorrent, 'storebt.biz', 'http://storebt.biz/s/' + name + '/0/0/1.html');
addLb(lbTorrent, 'toreye', 'http://toreye.com/search/' + name);
addLb(lbTorrent, 'torrentkit', 'http://torrentkit.com/' + name); /*meta*/
addLb(lbTorrent, '------------------', '');
addLb(lbTorrent, '0day.kiev.ua', 'http://0day.kiev.ua/modules.php?name=News&file=search&topic=9type=1&query=' + name);
addLb(lbTorrent, '21torrent', 'http://www.21torrent.com/search/?q=' + name);
addLb(lbTorrent, 'agusiq-torrents', 'http://agusiq-torrents.pl/szukaj-torrenta?search=' + name);
addLb(lbTorrent, 'alicili.pw', 'http://alicili.pw/list/' + name + '/1-0-0/');
addLb(lbTorrent, 'alltorrents.net', 'http://alltorrents.net/search.php?to=1&nm=' + name);
addLb(lbTorrent, 'besttorrent.org', 'http://besttorrent.org/search/?q=' + name); /*ok,2496*/
addLb(lbTorrent, 'bigfangroup', 'http://www.bigfangroup.org/browse.php?search=' + name);
addLb(lbTorrent, 'bitcq', 'https://bitcq.com/search?category[]=2&q=' + name);
addLb(lbTorrent, 'bitfinder.net', 'http://www.bitfinder.net/search/all/' + name);
addLb(lbTorrent, 'bitlord', 'http://www.bitlordsearch.com/search?q=' + name);
addLb(lbTorrent, 'bitru', 'http://bitru.org/browse.php?tmp=music&s=' + name);
addLb(lbTorrent, 'bitnova.info', 'http://bitnova.info/search?cid=25&q=' + name);
addLb(lbTorrent, 'bowiestation', "http://www.bowiestation.com/TT2/torrents-search.php?incldead=1&search=" + name);
addLb(lbTorrent, 'bt.etree.org', "http://bt.etree.org/?cat=0&incldead=1&searchzz=" + name);
addLb(lbTorrent, 'btarena', "http://tracker.btarena.org/torrents-search.php?search=" + name);
addLb(lbTorrent, 'btdigg.xyz', 'http://btdigg.xyz/search?info_hash=&q=' + name);
addLb(lbTorrent, 'btfuli.net', 'http://www.btfuli.net/list/' + name + '-s1d-1.html');
addLb(lbTorrent, 'bthad', 'http://www.bthad.com/s/' + name);
addLb(lbTorrent, 'btlibrary.net', 'http://btlibrary.net/?keyword=' + name);
addLb(lbTorrent, 'btmango', 'http://www.btmango.com/list/' + name + '/1');
addLb(lbTorrent, 'btmon', 'http://www.btmon.com/torrent/?f=' + name); /*excellent*/
addLb(lbTorrent, 'btsay.org', 'http://www.btsay.org/page/' + name);
addLb(lbTorrent, 'btstor.cc', 'http://www.btstor.cc/results_.php?q=' + name);
addLb(lbTorrent, 'burn.to', 'https://burn.to/search.dll?f=' + name);
addLb(lbTorrent, 'dark-os.com', 'https://dark-os.com/search.php?to=1&allw=1&f[]=0&nm=' + name);
addLb(lbTorrent, 'darkos.club', 'https://darkos.club/search.php?to=1&allw=1&f[]=0&nm=' + name);
addLb(lbTorrent, 'darmowe-torenty.pl', 'http://darmowe-torenty.pl/torrenty.php?category=38&search=' + name);
addLb(lbTorrent, 'datetorrent', 'https://datetorrent.com/usearch/' + name);
addLb(lbTorrent, 'ddgroupclub.com', 'http://ddgroupclub.com/tracker.php?nm=' + name); /*ok*/
addLb(lbTorrent, 'depechemode-live', 'https://www.depechemode-live.com/index.php?search=' + name);
addLb(lbTorrent, 'diggbt.ws', 'http://diggbt.ws/?keyword=' + name + '#must%20enter%20manually'); /*very good*/
addLb(lbTorrent, 'dimeadozen', 'http://www.dimeadozen.org/torrents-browse.php?searchscope=1&search=' + name);
addLb(lbTorrent, 'doutdess.org', 'http://doutdess.org/tracker.php?nm=' + name);
addLb(lbTorrent, 'download-pedia', 'http://download-pedia.com/?a=f&q=' + name);
addLb(lbTorrent, 'dugtor.ru', 'http://dugtor.ru/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&story=' + name);
addLb(lbTorrent, 'dwowd.net', 'http://dwowd.net/search/0/50/' + name);
addLb(lbTorrent, 'elitetorrent.pl', 'http://elitetorrent.pl/torrents.php?search=' + name);
addLb(lbTorrent, 'etorrent.co.kr', 'http://etorrent.co.kr/bbs/board.php?bo_table=music&sca=&sfl=wr_subject&stx=' + name);
addLb(lbTorrent, 'fanhaozhushou', 'http://www.fanhaozhushou.com/search/' + name + '/1.html');
addLb(lbTorrent, 'fast-torrent.ru', 'http://fast-torrent.ru/search/' + name);
addLb(lbTorrent, 'feifeibt', 'http://feifeibt.com/#--> search for ' + name);
addLb(lbTorrent, 'filebase.ws', 'http://www.filebase.ws/torrents/search/?c=0&t=liveonly&search=' + name); /*poor*/
addLb(lbTorrent, 'fileclub.ws', 'http://fileclub.ws/browse.php?cat=10&incldead=1&sort=0&type=desc&gr=0&s=0&search=' + name);
addLb(lbTorrent, 'filedron', 'http://filedron.com/' + name);
addLb(lbTorrent, 'filelisting', 'http://filelisting.com/result?q=' + name);
addLb(lbTorrent, 'firebit.net', 'http://firebit.net/index.php?do=search&type=simple&q=' + name);
addLb(lbTorrent, 'foreverdrowning', 'http://www.foreverdrowning.nl/tracker/index.php?page=torrents&search=' + name);
addLb(lbTorrent, 'forums.questionablecontent.net', 'https://forums.questionablecontent.net/index.php?action=search2&search=' + name);
addLb(lbTorrent, 'frtorrenta.fr', 'https://frtorrenta.fr/' + name + '.html');
addLb(lbTorrent, 'funkytorrents', 'http://funkytorrents.com/browse.php?search=' + name);
addLb(lbTorrent, 'genesis-movement', 'http://torrent.genesis-movement.org/torrents-search.php?search=' + name);
addLb(lbTorrent, 'glodls.to', 'http://glodls.to/search.php?c22=1&cat=22&incldead=1&inclexternal=0&search=' + name);
addLb(lbTorrent, 'goldenshara', 'http://goldenshara.net/razdachi.php?nm=' + name);
addLb(lbTorrent, 'hdreactor.club', 'http://hdreactor.club/index.php?do=search&subaction=search&full_search=1&titleonly=3&catlist[]=2004&story=' + name);
addLb(lbTorrent, 'helltorrents', 'http://helltorrents.com/torrenty.php?category=38&search=' + name);
addLb(lbTorrent, 'hitmuzik.ru', 'http://hitmuzik.ru/browse.php?search=' + name);
addLb(lbTorrent, 'idope.se', 'https://www.idope.se/torrent-list/' + name);
addLb(lbTorrent, 'ilcorsaronero.info', 'http://ilcorsaronero.info/argh.php?search=' + name);
addLb(lbTorrent, 'immortaltorrent', 'http://www.immortaltorrent.pl/torrents.php?category=18&search=' + name);
addLb(lbTorrent, 'jamtothis', 'http://www.jamtothis.com/search.php?titleonly=1&query=' + name);
addLb(lbTorrent, 'jijibt', 'http://jijibt.com/jiji/' + name + '.html');
addLb(lbTorrent, 'ju8.me', 'http://www.ju8.me/s/' + name);
addLb(lbTorrent, 'jungleland', 'http://jungleland.dnsalias.com/torrents-browse.php?incldead=1&search=' + name);
addLb(lbTorrent, 'kat.cr DOWN!', 'https://kat.cr/usearch/' + name + "/");
addLb(lbTorrent, 'kat.cr feed DOWN!', 'https://kat.cr/usearch/' + name + "/?rss=1");
addLb(lbTorrent, 'dxtorrent.com (kat.cr mirror)', 'http://dxtorrent.com/usearch/' + name + "/");
addLb(lbTorrent, 'kinozal.me', 'http://kinozal.me/browse.php?c=1004&s=' + name);
addLb(lbTorrent, 'kinozal.tv', 'http://kinozal.tv/browse.php?c=1004&s=' + name); /*good*/
addLb(lbTorrent, 'klad.life', 'https://klad.life/search/' + name); /*good*/
addLb(lbTorrent, 'krutor.net', 'http://krutor.net/?do=search&subaction=search&story=' + name);
addLb(lbTorrent, 'krutor.org', 'http://krutor.org/search/' + name);
addLb(lbTorrent, 'katushka.net', 'http://katushka.net/torrent/?c5=1&type_search=torrents&incldead=7&search=' + name);
addLb(lbTorrent, 'kubyshka.org', 'http://bt.kubyshka.org/search.php?sr=topics&sf=titleonly&fp=1&tracker_search=torrent&sid=936bbeaf92e385b6688ed615c151d98c#sr&keywords=' + name);
addLb(lbTorrent, 'legittorrents', 'http://www.legittorrents.info/index.php?page=torrents&search=' + name);
addLb(lbTorrent, 'live-rutor.org', 'http://live-rutor.org/search/0/2/000/0/' + name);
addLb(lbTorrent, 'liveshownation', 'http://liveshownation.com/index.php?page=torrents&search=' + name);
addLb(lbTorrent, 'losslessclub', 'http://losslessclub.com/browse.php?search=' + name);
addLb(lbTorrent, 'lykreciy.ru', 'http://lykreciy.ru/index.php?do=search&subaction=search&full_search=1&titleonly=3&sortby=date&catlist[]=2&story=' + name);
addLb(lbTorrent, 'magatorrentx', 'http://www.magatorrentx.com/music/?do=search&subaction=search&story=' + name);
addLb(lbTorrent, 'mediafirefile.com', 'http://www.magnetdl.com/' + name.toLowerCase()[0] + '/' + name + '/');
addLb(lbTorrent, 'magnetdl', 'http://www.magnetdl.com/' + name.substr(0,1) + '/' + name);
addLb(lbTorrent, 'magnetfox', 'http://magnetfox.com/search/0/50/' + name);
addLb(lbTorrent, 'magnetlink.be', 'https://magnetlink.be/search.php?f=' + name);
addLb(lbTorrent, 'megashara', 'http://megashara.com/search/?text=' + name);
addLb(lbTorrent, 'metal-tracker', 'http://en.metal-tracker.com/torrents/search.html?q=' + name + '# <-- must search manually');
addLb(lbTorrent, 'metaltrap.ru', 'http://metaltrap.ru/index.php?do=search&subaction=search&result_ajax=0&story=' + name);
addLb(lbTorrent, 'metallifukinca', 'http://www.metallifukinca.com/search.php?titleonly=1&query=' + name);
addLb(lbTorrent, 'mirmegashara', 'http://mirmegashara.com/search/?text=' + name);
addLb(lbTorrent, 'mixtapetorrent', 'http://www.mixtapetorrent.com/search/node/' + name);
addLb(lbTorrent, 'mixtapetorrent', 'http://www.mixtapetorrent.com/search/node/' + name);
addLb(lbTorrent, 'mrutor.org', 'http://mrutor.org/search/' + name);
addLb(lbTorrent, 'mtorrents.com', 'http://www.mtorrents.com/search?utf8=%E2%9C%93&category=music&commit=Search&keywords=' + name);
addLb(lbTorrent, 'muerbt.com', 'http://muerbt.com/q/' + name + '.html');
addLb(lbTorrent, 'music-site.ru', 'http://music-site.ru/music-data-play/' + name);
addLb(lbTorrent, 'musicktorrent', 'http://www.musicktorrent.com/buscar?searchword=' + name);
addLb(lbTorrent, 'muz-tracker', 'http://www.muz-tracker.net/browse.php?cat=0&incldead=1&sort=0&type=desc&gr=0&kp=0&im=0&os=o&s=0&search=' + name + "&post=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA#results");
addLb(lbTorrent, 'my-tfile.org', 'http://search.my-tfile.org/?q=' + name);
addLb(lbTorrent, 'my-torrentz.eu', 'https://my-torrentz.eu/search?term=' + name);
addLb(lbTorrent, 'myklad.org', 'https://myklad.org/search/?search=' + name);
addLb(lbTorrent, 'mytoot.ru', 'http://mytoot.ru/browse.php?search=' + name);
addLb(lbTorrent, 'natorrents', 'http://natorrents.com/usearch/' + name);
addLb(lbTorrent, 'netlab.e2k.ru', 'http://netlab.e2k.ru/forum/index.php?act=Search&CODE=01&forums[]=all&searchsubs=1&prune=0&prune_type=newer&keywords=' + name); /*very good*/
addLb(lbTorrent, 'netorrents', 'http://netorrents.com/usearch/' + name);
addLb(lbTorrent, 'new-team.org', 'http://new-team.org/search?q=' + name + "&post=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA#results");
addLb(lbTorrent, 'newage-music.ru', 'http://newage-music.ru/?do=search&subaction=search&story=' + name);
addLb(lbTorrent, 'newtorrents.info', 'http://www.newtorrents.info/search/' + name);
addLb(lbTorrent, 'nnm-club.name', 'http://nnm-club.name/forum/tracker.php?nm=' + name);	/*excellent*/
addLb(lbTorrent, 'nnm-club.name 2', 'http://nnmclub.to/?w=title&q=' + name);
addLb(lbTorrent, 'oldfield.es', 'http://btt.oldfield.es/torrents-search.php?incldead=1&search=' + name);
addLb(lbTorrent, 'omegatorrents.cc', 'http://www.omegatorrents.cc/search.php?q=' + name);
addLb(lbTorrent, 'omn-omn-omn.ru', 'http://omn-omn-omn.ru/browse.php?incldead=1&search=' + name);
addLb(lbTorrent, 'open.cd', 'https://open.cd/torrents.php?spstate=0&search=' + name);
addLb(lbTorrent, 'opensharing', 'http://opensharing.org/newsearch.php?search_word=' + name);
addLb(lbTorrent, 'opentorrent.ru', 'http://opentorrent.ru/tracker.php?nm=' + name);
addLb(lbTorrent, 'ostorrent', 'http://torrentaai.info/ser.php?q=' + name);
addLb(lbTorrent, 'ourrelease.org', 'http://www.ourrelease.org/bittorrent/plus/search.php?kwtype=0&keyword=' + name);
addLb(lbTorrent, 'p2pdl', 'http://p2pdl.com/torrents/search/' + name);
addLb(lbTorrent, 'phantomp2p', 'http://phantomp2p.com/forum/search.php?sf=titleonly&submit=Search&keywords=' + name);
addLb(lbTorrent, 'picktorrent', 'https://www.picktorrent.com/torrents/' + name);
addLb(lbTorrent, 'pirat.ca', 'http://pirat.ca/tracker.php?&nm=' + name);
addLb(lbTorrent, 'piratbit.ru', 'https://piratbit.ru/tracker/?ss=' + name); /*ok*/
addLb(lbTorrent, 'pirate.ws', 'https://pirate.ws/tracker.php?nm=' + name);
addLb(lbTorrent, 'piratepublic', 'https://piratepublic.com/index.php?page=torrents&category=24%3B44%3B65%3B66&search=' + name);
addLb(lbTorrent, 'planetrocklosslessbootlegs', 'http://www.planetrocklosslessbootlegs.com/search.php?titleonly=1&securitytoken=1467577994-06fa8960e607eca78b77e1872f2e387107381618&do=process&query=' + name);
addLb(lbTorrent, 'predb.me', 'http://predb.me/?search=' + name);
addLb(lbTorrent, 'pro-jazz', 'http://pro-jazz.com/search?q=' + name);	/*very good*/
addLb(lbTorrent, 'prostylex', 'http://prostylex.com/torrents-search.php?c20=1&search=' + name);
addLb(lbTorrent, 'psychocydd.co.uk', 'http://psychocydd.co.uk/torrents.php?search=' + name);
addLb(lbTorrent, 'punktorrents', 'http://www.punktorrents.com/search.php?keywords=' + name);
addLb(lbTorrent, 'pushbt.org', 'http://www.pushbt.org/s/' + name);
addLb(lbTorrent, 'qstud.ru', 'http://qstud.ru/Search/' + name); /*very good*/
addLb(lbTorrent, 'queentorrent.net', 'http://www.queentorrent.net/' + name);
addLb(lbTorrent, 'queenzone', 'http://www.queenzone.com/search_results.aspx?sa=Search&cx=partner-pub-9128238322672228%3Aetyq8xu6k93&cof=FORID%3A10&ie=ISO-8859-1&siteurl=www.queenzone.com%2F&ref=&ss=0j0j1&q=' + name);
addLb(lbTorrent, 'rapidzona', 'http://rapidzona.com/?q=' + name); /*poor*/
addLb(lbTorrent, 'rarbg.to', 'https://rarbg.to/torrents.php?category[]=23&category[]=25&search=' + name);
addLb(lbTorrent, 'rarbgmirror.com', 'https://rarbgmirror.com/torrents.php?category[]=23&category[]=25&search=' + name);
addLb(lbTorrent, 'realmt.org', 'http://realmt.org/tracker.php?max=1&to=1&nm=' + name);
addLb(lbTorrent, 'riperam.org', 'http://riperam.org/search.php?tracker_search=torrent&fid[]=243&sf=titleonly&sr=topics&keywords=' + name);
addLb(lbTorrent, 'psychocydd.co.uk', 'http://psychocydd.co.uk/torrents.php?search=' + name);
addLb(lbTorrent, 'romania-inedit.3xforum.ro', 'http://romania-inedit.3xforum.ro/search.php?action=search&keywords=' + name);
addLb(lbTorrent, 'rus-media.org', 'http://rus-media.org/search.php?sr=topics&sf=titleonly&keywords=' + name);
addLb(lbTorrent, 'rustorka', 'http://rustorka.com/forum/tracker.php?max=1&to=1&nm=' + name);
addLb(lbTorrent, 'rutor.info', 'http://rutor.info/search/0/2/000/0/' + name);
addLb(lbTorrent, 'rutor.is', 'http://rutor.is/search/0/2/000/0/' + name);
addLb(lbTorrent, 'rutorka.net', 'http://rutorka.net/search.php?sr=topics&sf=titleonly&fp=1&tracker_search=torrent&keywords=' + name); /*good*/
addLb(lbTorrent, 'rutracker.online', 'http://rutracker.online/' + name + '.html');
addLb(lbTorrent, 'seedoff.tv', 'http://www.seedoff.tv/?page=torrents&search=' + name);
addLb(lbTorrent, 'servmix.ru', 'http://www.servmix.ru/index.php?do=search&subaction=search&titleonly=3&catlist[]=51&story=' + name); /*good,29682*/
addLb(lbTorrent, 'sexwal.net', 'https://sexwal.net/bbs/search.php?stx=' + name);
addLb(lbTorrent, 'shnflac.net', 'http://www.shnflac.net/torrents.php?active=0&search=' + name);
addLb(lbTorrent, 'slowtorrent', 'http://slowtorrent.com/search/' + name);
addLb(lbTorrent, 'smithstorrents', 'http://www.smithstorrents.co.uk/tracker.php?max=1&to=1&nm=' + name);
addLb(lbTorrent, 'sobt5', 'http://www.sobt5.com/q/' + name + '.html');
//addLb(lbTorrent, 'sovtor', 'http://sovtor.com/search.php?max=1&to=1&nm=' + name);
http://ssec.life/new/torrents-search.php?incldead=1&search=
addLb(lbTorrent, 'ssec.life', 'http://ssec.life/new/torrents-search.php?incldead=1&search=' + name);
addLb(lbTorrent, 'tapedown', 'http://www.tapedown.com/torrents.php?search=' + name);
addLb(lbTorrent, 'telecharger-cool.fr', 'http://telecharger-cool.fr/telecharger/' + name + '/');
addLb(lbTorrent, 'tfile.co', 'http://search.tfile.co/?q=' + name);
addLb(lbTorrent, 'th.ju8.me', 'http://th.ju8.me/s/' + name);
addLb(lbTorrent, 'thetradersden.org', 'http://www.thetradersden.org/forums/search.php?do=process&quicksearch=1&childforums=1&securitytoken=1472689576-dc801dc7050ad9917861fe6688b3d528e0898eb5&titleonly=1&query=' + name);
addLb(lbTorrent, 'torbt', 'http://torbt.com/index.php?u=magnetsearch-index&keyword=' + name);
addLb(lbTorrent, 'torrnado.ru', 'http://www.torrnado.ru/search.php?fid[]=4&sf=titleonly&submit=Search&keywords=' + name);
addLb(lbTorrent, 'torrent.ee', 'http://www.torrent.ee/srch?search=' + name);
addLb(lbTorrent, 'torrent.eval.hu', 'http://torrent.eval.hu/torrent-kereso/' + name);
addLb(lbTorrent, 'torrent.tm', 'https://torrent.tm/search?q=' + name);
addLb(lbTorrent, 'torrent9.bz', 'http://www.torrent9.bz/search_torrent/' + name + '.html');
addLb(lbTorrent, 'torrentdownload.ch', 'http://www.torrentdownload.ch/search?q=' + name);
addLb(lbTorrent, 'torrentdownloads.be', 'http://torrentdownloads.be/?search=' + name);
addLb(lbTorrent, 'torrentdownloads.me', 'https://torrentdownloads.me/?search=' + name);
addLb(lbTorrent, 'torrenthaja', 'https://torrenthaja.com/bbs/search.php?search_flag=search&stx=' + name);
addLb(lbTorrent, 'torrentino.me', 'http://www.torrentino.me/search?kind%5B%5D=7&search=' + name);
addLb(lbTorrent, 'torrentkim12', 'https://torrentkim12.com/bbs/google.php?k=&b=&q=' + name);
addLb(lbTorrent, 'torrentleech.org', 'https://www.torrentleech.org/torrents/browse/index/query/' + name + '/categories/4,31/page/1/orderby/score');
addLb(lbTorrent, 'torrentmole', 'https://torrentmole.com/?s=' + name);
addLb(lbTorrent, 'torrentroom', 'http://www.torrentroom.com/search?k=' + name);
addLb(lbTorrent, 'torrents-tracker', 'http://torrents-tracker.com/index.php?do=search&subaction=search&titleonly=3&catlist[]=33&story=' + name); /*ok,1500*/
addLb(lbTorrent, 'torrents43', 'http://torrents43.com/?q=' + name);
addLb(lbTorrent, 'torrentsdownload.co', 'http://torrentsdownload.co/search/?search=' + name);
addLb(lbTorrent, 'torrentseeker', 'https://torrentseeker.com/search.php?q=' + name);
addLb(lbTorrent, 'torrentset', 'http://www.torrentset.com/torrents/' + name.replace(/\s+/g, "-").substr(0,2) + '/' + name.replace(/\s+/g, "-") + '.html');
addLb(lbTorrent, 'torrentv.org', 'http://www.torrentv.org/results/' + name + '/');
addLb(lbTorrent, 'torrentzcc.me', 'http://torrentzcc.me/' + name);
addLb(lbTorrent, 'torrforme', 'http://www.torrforme.com/torrents/' + name.replace(/\s+/g, "-").substr(0,2) + '/' + name.replace(/\s+/g, "-") + '.html');
addLb(lbTorrent, 'toshare.space', 'https://toshare.space/torrent/music?keyword=' + name);
addLb(lbTorrent, 'tparser.org', 'http://tparser.org/' + name);	/*excellent*/
addLb(lbTorrent, 'tpb.run', 'https://tpb.run/search/' + name + '/0/99/100');
addLb(lbTorrent, 'thetradersden.org', 'http://www.thetradersden.org/forums/search.php?do=process&titleonly=1&query=' + name);
addLb(lbTorrent, 'trackerok', 'http://www.trackerok.com/?do=search&subaction=search&story=' + name);
addLb(lbTorrent, 'u2torrents', 'http://u2torrents.com/search?search=' + name);
addLb(lbTorrent, 'underverse.su', 'http://underverse.su/tracker.php?nm=' + name);
addLb(lbTorrent, 'uniondht.org', 'http://uniondht.org/tracker.php?nm=' + name);
addLb(lbTorrent, 'yeeshkul', 'http://yeeshkul.com/forum/search.php?titleonly=1&securitytoken=1467572119-727ec80ceab9302c48bb877fa5a94aeae1caf12a&do=process&query=' + name);
addLb(lbTorrent, 'youtor.org', 'http://youtor.org/index.php?do=search&subaction=search&full_search=1&titleonly=3&sortby=date&story=' + name);
addLb(lbTorrent, 'yourbittorrent', 'http://yourbittorrent.com/?q=' + name);
addLb(lbTorrent, 'zappateers', 'http://zappateers.com/bb/search.php?mode=results&search_fields=titleonly&search_keywords=' + name);
addLb(lbTorrent, 'zetorrento.fr', 'http://zetorrento.fr/telecharger/' + name + '/');
addLb(lbTorrent, 'zhongzicili', 'http://zhongzicili.com/zhongzi/' + name + '/1-0-0.html');
addLb(lbTorrent, 'zitor.org', 'http://zitor.org/search/' + name);
addLb(lbTorrent, 'zooqle', 'https://zooqle.com/search?q=' + name + '+category%3AMusic');
addLb(lbTorrent, 'zoozle', 'http://torrent.zoozle.org/search.php?q=' + name);
whereAppend.append(lbTorrent);


// archive search engines
addButton(null, "search engines");
addLb(lbSearch, '3dl.tv', 'https://music.3dl.tv/index.php?action=search&detail=true&search=true&query=' + name);
addLb(lbSearch, 'binnews.in', 'http://www.binnews.in/_bin/search2.php#  !NO GET, USE FORM FOR "' + name + '"');
addLb(lbSearch, 'Ebookee', 'http://www.ebookee.net/search.php?cx=005418540955315608444%3Ahzcbi9hnswe&cof=FORID%3A11&sa=Search&q=' + tit + ' ' + name);
addLb(lbSearch, 'FBug', 'http://www.filesbug.com/search/' + tit + ' ' + name);
addLb(lbSearch, 'FDeck', 'http://filesdeck.com/search.php?q=' + tit + ' ' + name);
addLb(lbSearch, 'fileCatch', 'http://filecatch.com/?q=' + name + ' ' + tit);
addLb(lbSearch, 'filediva', 'http://www.filediva.com/results.php?search=' + name);
addLb(lbSearch, 'fileKnow', 'http://fileknow.org/' + name);
addLb(lbSearch, 'filemirrors.info', 'http://www.filemirrors.info/index.php?q=' + name);
addLb(lbSearch, 'filepoch', 'http://filepoch.com/?q=' + name);
addLb(lbSearch, 'filesloop hosts', 'https://www.filesloop.com/search/' + name + '.html');
addLb(lbSearch, 'filesloop torrent', 'https://www.filesloop.com/torrent/' + name + '.html');
addLb(lbSearch, 'filewish', 'http://www.filewish.com/results.php?search=' + name);
addLb(lbSearch, 'general-catalog', 'http://www.general-catalog.net/tag/' + name);
addLb(lbSearch, 'generalfil.es', 'http://www.generalfil.es/files-' + name.toLowerCase()[0] + '/' + name);
addLb(lbSearch, 'ifolderlinks.ru', 'http://ifolderlinks.ru/isearch.html?size=1&search=' + name);
addLb(lbSearch, 'katzddl', 'http://katzddl.ws/index.php?q=' + name);
addLb(lbSearch, 'Kvaz', 'http://cognitivefiles.com/index.php?q="' + name + '"');
addLb(lbSearch, 'mediafirefile.com', 'http://mediafirefile.com/' + name.toLowerCase()[0] + '/' + name + '.html');
addLb(lbSearch, 'mediafiretrend', 'http://mediafiretrend.com/?q="' + name + '"');
addLb(lbSearch, 'megasearch.co', 'http://megasearch.co/?q="' + name + '"');
addLb(lbSearch, 'p-naka', 'http://p-naka.com/files-' + name.toLowerCase()[0] + '/' + name + '/');
addLb(lbSearch, 'pleer.net', 'http://pleer.net/search?q=' + name);
addLb(lbSearch, 'rapid-search-engine', 'http://rapid-search-engine.com/index-s=' + name + ".html");
addLb(lbSearch, 'rapid4me', 'http://rapid4me.com/?q=' + name);
addLb(lbSearch, 'rapidshare.zoozle.net', 'http://rapidshare.zoozle.net/suche.php?q=' + name);
//addLb(lbSearch, 'rapidsharemix', 'http://rapidsharemix.com/?x=1&q=' + name); /*old*/
addLb(lbSearch, 'searchshared', 'https://cse.google.com/cse?cx=partner-pub-2575147436387499:4670662664&q=' + name);
addLb(lbSearch, 'sharedir', 'http://sharedir.com/index.php?s=' + tit + ' ' + name);
addLb(lbSearch, 'tagoo.ru', 'http://tagoo.ru/ru/search.php?for=audio&search=' + name);
addLb(lbSearch, 'Taringa', 'http://www.taringa.net/buscar/?q="' + name + '" "' + tit + '"');
addLb(lbSearch, 'tfile.me', 'http://tfile.me/forum/ssearch.php?q=' + name);
addLb(lbSearch, 'tradownload', 'http://tradownload.com/results/' + name + ".html");
//addLb(lbSearch, 'tshare', 'https://tshare.to/#!p=sdef&scat=music&q=' + name);
addLb(lbSearch, 'uploadedtrend', 'http://uploadedtrend.com/search.php?q=' + name);
addLb(lbSearch, 'usemeplz', 'http://www.usemeplz.com/?s=' + name);
addLb(lbSearch, 'zippysharesearch', 'https://zippysharesearch.com/results.php?q=' + name);
addLb(lbSearch, 'zoozle', 'http://rapidshare.zoozle.org/search.php?q=' + name);
addLb(lbSearch, 'торрнадо', 'http://торрнадо.org/browse.php?incldead=1&search=' + name);
whereAppend.append(lbSearch);



// singles
addButton(null, "singles");
addLb(lbSingles, 'flacmusicfinder', 'http://flacmusicfinder.com/index.html?s=' + name);
addLb(lbSingles, 'muzlan.top', 'http://en.muzlan.top/search/' + name);
addLb(lbSingles, 'datmusic.xyz', 'https://datmusic.xyz/?q=' + name);
addLb(lbTorrent, '------others------', '');
addLb(lbSingles, 'bluemp3.ru', 'https://bluemp3.ru/mp3-' + name + '-online');
addLb(lbSingles, 'carshampoo.ru', 'https://carshampoo.ru/' + name + '/');
addLb(lbSingles, 'davidhirst.net', 'http://davidhirst.net/music/' + name + '/');
addLb(lbSingles, 'get-tune.cc', 'https://get-tune.cc/search/f/' + name);
addLb(lbSingles, 'ipleer.fm', 'https://ipleer.fm/search/q/' + name);
addLb(lbSingles, 'joeblackuk', 'http://joeblackuk.com/music/' + name);
addLb(lbSingles, 'liefond.com', 'http://liefond.com/song/' + name);
addLb(lbSingles, 'musice.me', 'http://musice.me/mp3/' + name + '/');
addLb(lbSingles, 'myzuka.fm', 'https://myzuka.fm/Search?SearchText=' + name);
addLb(lbSingles, 'n-mp3.com', 'https://n-mp3.com/en/download-music/' + name + '.html');
addLb(lbSingles, 'petamusic', 'http://petamusic.ru/?string=' + name);
addLb(lbSingles, 'rucadcam.ru', 'http://rucadcam.ru/artist/' + name);
addLb(lbSingles, 'vmuzike.online', 'http://vmuzike.online/search/' + name);
addLb(lbSingles, 'vk.com', 'https://vk.com/search?c[section]=audio&c[q]=' + name);
addLb(lbSingles, 'vkmp3.pro', 'http://vkmp3.pro/mp3/' + name);
addLb(lbSingles, 'zf.fm', 'http://zf.fm/mp3/search?keywords=' + name);
addLb(lbSingles, '------------------', '');
addLb(lbSingles, '123music.to', 'http://123music.to/search/' + name);
addLb(lbSingles, '5music.net', 'http://www.5music.net/free/' + name);
addLb(lbSingles, 'aladifi', 'http://aladifi.com/#/search/' + name);
addLb(lbSingles, 'albummusic.net', 'http://albummusic.net/search/?ss=14484j209149928j3&cx=partner-pub-2547580494028569%3A4572509033&cof=FORID%3A10&ie=UTF-8&q=' + name);
addLb(lbSingles, 'allflac', 'https://allflac.com/?search=' + name);
addLb(lbSingles, 'amsox', 'http://amsox.com/mp3-download-free/' + name);
addLb(lbSingles, 'audiodeep', 'http://audiodeep.com/' + name);
addLb(lbSingles, 'audiotut.ru', 'http://audiotut.ru/music-file/' + name);	/*very good,192kbps*/
addLb(lbSingles, 'bluemp3.ru', 'https://bluemp3.ru/mp3-/' + name + '-online');
addLb(lbSingles, 'butzz', 'http://www.butzz.org/mp3-download/' + name);
addLb(lbSingles, 'darkmp3.ru', 'http://darkmp3.ru/slushat-' + name + ".html");	/* very good,192kbps*/
addLb(lbSingles, 'deepmp3.ru', 'http://deepmp3.ru/' + name); /*very good,192kbps*/
addLb(lbSingles, 'deezer', 'http://www.deezer.com/search/' + name);		/* add to button */
addLb(lbSingles, 'discos9', 'http://discos9.com/mp3/' + name + '.html');
addLb(lbSingles, 'emotionmusic.ru', 'http://emotionmusic.ru/mp3/' + name); /*excellent,320kbps*/
addLb(lbSingles, 'emp3world', 'http://emp3world.one/r.php?submit=Search&phrase=' + name);
addLb(lbSingles, 'emp3z', 'https://www.emp3z.com/mp3/' + (name + " " + tit).replace(/%20/g,"-") + ".html");
addLb(lbSingles, 'experiamusic.top', 'http://experiamusic.top/mp3/' + name);
addLb(lbSingles, 'fastmp3', 'http://fastmp3.org/' + name + '.html');
addLb(lbSingles, 'findflac.com', 'http://findflac.com/index.html?s=' + name);
addLb(lbSingles, 'fmusic', 'http://fmusic.mobi/' + name);
addLb(lbSingles, 'free-mp3-download', 'http://www.free-mp3-download.me/music/' + name);
addLb(lbSingles, 'freeallmusic2', 'http://freeallmusic2.com/Search?query=' + name);
addLb(lbSingles, 'freemp3now.me', 'http://freemp3now.me/catalog/' + name);
addLb(lbSingles, 'goldenmp3.ru', 'https://www.goldenmp3.ru/search.html?text=' + name);
addLb(lbSingles, 'grab-mp3.xyz', 'http://grab-mp3.xyz/?q=' + name);
addLb(lbSingles, 'groovesharky', 'http://www.groovesharky.com/' + name);
addLb(lbSingles, 'homemp3', 'http://homemp3.ru/?q=' + name);
addLb(lbSingles, 'ibetop', 'http://ibetop.com/music/' + name);
addLb(lbSingles, 'imusic.am', 'http://imusic.am/music/search_key/' + name + '/');
addLb(lbSingles, 'iplayer.fm', 'http://iplayer.fm/search/q/' + name);
addLb(lbSingles, 'ishimp3', 'http://ishimp3.com/?q=' + name);
addLb(lbSingles, 'itunespedia', 'http://itunespedia.com/search/' + name);
addLb(lbSingles, 'jetune', 'http://www.jetune.ru/searchnow?ms_search_text=' + name);
addLb(lbSingles, 'junglevibe20.net', 'http://junglevibe20.net/tracks/' + name + ".html");
addLb(lbSingles, 'ketnooi', 'http://video.ketnooi.com/MP3-' + name);
addLb(lbSingles, 'kibergrad', 'http://kibergrad.com/search?q=' + name);
addLb(lbSingles, 'kloudmusik', 'https://www.kloudmusik.com/artist/' + name);
addLb(lbSingles, 'lalamus', 'http://lalamus.com/music/' + name);
addLb(lbSingles, 'laudios.ru', 'http://laudios.ru/search/' + name); /*good*/
addLb(lbSingles, 'letsloop', 'https://letsloop.com/search/index?q=' + name);
addLb(lbSingles, 'lostamusic', 'http://lostamusic.com/mp3/' + name + '.html');
addLb(lbSingles, 'magemp3', 'http://magemp3.com/track/' + name);
addLb(lbSingles, 'mail.ru', 'http://my.mail.ru/music/search/' + name);
addLb(lbSingles, 'markmp3', 'http://markmp3.com/search?q=' + name);
addLb(lbSingles, 'mixpromo.net', 'http://mixpromo.net/search/' + name);
addLb(lbSingles, 'mp3-mus.net', 'http://mp3-mus.net/music/' + name);
addLb(lbSingles, 'mp3.open', 'http://mp3.open.az/search.php?q=' + name);
addLb(lbSingles, 'mp3-pesnja', 'http://mp3-pesnja.com/mp3-music/' + name);
addLb(lbSingles, 'mp3.pm', 'http://mp3.pm/s/f/' + name);
addLb(lbSingles, 'mp3albums.me', 'http://mp3albums.me/albums/' + name + '.html');
addLb(lbSingles, 'mp3answer.ru', 'http://mp3answer.ru/mp3-download-' + name + '/');
addLb(lbSingles, 'mp3azur', 'http://mp3azur.online/search/' + name + '/');
addLb(lbSingles, 'mp3boo', 'http://mp3boo.cc/search/artist/' + name);
addLb(lbSingles, 'mp3cat', 'http://mp3cat.net/q/' + name);
addLb(lbSingles, 'mp3clan', 'http://mp3clan.im/mp3/' + name + '.html');
addLb(lbSingles, 'mp3co', 'http://mp3co.net/s/' + name + '/');
addLb(lbSingles, 'mp3cube', 'http://mp3cube.net/search/' + name + '.html');
addLb(lbSingles, 'mp3days', 'https://www.mp3days.net/download/lagu/' + name + '/mp3.html');
addLb(lbSingles, 'mp3ees', 'https://mp3ees.com/search?search_query=' + name);
addLb(lbSingles, 'mp3ford', 'http://mp3ford.com/mp3/' + name.replace(/%20/g,"-") + ".html");
addLb(lbSingles, 'mp3freex', 'http://mp3freex.me/' + name.replace(/%20/g, "-") + "-download");
addLb(lbSingles, 'mp3freex mp3', 'http://mp3freex.me/?inmp3=' + name);
addLb(lbSingles, 'mp3get.xyz', 'http://mp3get.xyz/search?q=' + name);
addLb(lbSingles, 'mp3goears', 'https://mp3goears.xyz/mp3/' + name.replace(/%20/g, "-") + ".html");
addLb(lbSingles, 'mp3indirse', 'http://mp3indirse.com/ara/?query=' + name);
addLb(lbSingles, 'mp3li2', 'http://mp3li2.com/index.php?q=' + name);
addLb(lbSingles, 'mp3music-free', 'http://mp3music-free.ru/music/' + name);
addLb(lbSingles, 'mp3prima.com', 'http://mp3prima.com/mp3poisk/' + name);
addLb(lbSingles, 'mp3prima.net', 'http://mp3prima.net/?q=' + name);
addLb(lbSingles, 'mp3red.co', 'http://mp3red.co/# must manually enter -->' + name);	/*excellent,192kbps*/
addLb(lbSingles, 'mp3red.ru', 'http://mp3red.ru/mp3-' + name);
addLb(lbSingles, 'mp3s.cc', 'http://mp3s.cc/search/?query=' + name);
addLb(lbSingles, 'mp3shuk.download', 'http://mp3shuk.download/artist/' + name);
addLb(lbSingles, 'mp3searched.net', 'http://www.mp3searched.net/mp3/' + name);
addLb(lbSingles, 'mp3skull.onl', 'https://mp3skull.onl/?q=' + name + '# no post, use searchbox');
addLb(lbSingles, 'mp3skulls', 'http://mp3skulls.review/?s=' + name);
addLb(lbSingles, 'mp3take', 'http://mp3take.biz/mp3/' + name.replace(/%20/g,"_") + ".html");
addLb(lbSingles, 'mp3taringa.net', 'http://mp3taringa.net/mp3/' + name);
addLb(lbSingles, 'mp3trekov', 'http://mp3trekov.net/poisk/' + name);
addLb(lbSingles, 'mp3vega', 'http://mp3vega.com/?text=' + name);
addLb(lbSingles, 'mp3wp', 'http://mp3wp.com/playlist/track/single/' + name + ".html");
addLb(lbSingles, 'mp3wtf.tk', 'http://mp3wtf.tk/play/' + (name + " " + tit).replace(/%20/g,"-") + ".html");
addLb(lbSingles, 'mp3xl.org', 'http://mp3xl.org/search/?query=' + name);
addLb(lbSingles, 'mp3yum.xyz', 'http://mp3yum.xyz/search?q=' + name);
addLb(lbSingles, 'mrtzc4.net', 'http://mrtzc4.net/?q=' + name);
addLb(lbSingles, 'mullts', 'http://mullts.com/index.php?search2=1&s=' + name);
addLb(lbSingles, 'mus.ge', 'http://mus.ge/search ' + name);
addLb(lbSingles, 'musezone.ru', 'http://www.musezone.ru/music/' + name + '/ist');
addLb(lbSingles, 'music-site.ru', 'http://music-site.ru/music-data-play/' + name);
addLb(lbSingles, 'musica-libera.lol', 'http://musica-libera.lol/melody/' + name);
addLb(lbSingles, 'music7s.live', 'https://music7s.live/search.php?count=50&sort=2&search=' + name);
addLb(lbSingles, 'musicalypse', 'http://musicalypse.com/label/' + name + '.html');
addLb(lbSingles, 'musicaq.net', 'http://musicaq.net/descargar_musica/' + name + '-1.html');
addLb(lbSingles, 'musicdownloadmp3.su', 'http://musicdownloadmp3.su/trackid/' + name);
addLb(lbSingles, 'musiclody', 'http://musiclody.com/search/' + name);
addLb(lbSingles, 'musicmp3.ru', 'http://musicmp3.ru/search.html?text=' + name);
addLb(lbSingles, 'musicmp3spb.org', 'http://musicmp3spb.org/search/?category=1&Content=' + name);
addLb(lbSingles, 'musico.cc', 'http://musico.cc/?string=' + name);
addLb(lbSingles, 'musicville.fm', 'http://musicville.fm/' + name + '.asp');
addLb(lbSingles, 'muzico', 'http://muzico.ru/music/' + name + '/');
addLb(lbSingles, 'muzikamp3', 'http://www.muzikamp3.ru/muzik/' + name + '/index.html');
addLb(lbSingles, 'muzikmp3', 'http://muzikmp3.biz/' + name);
addLb(lbSingles, 'muznew', 'http://muznew.net/?mp3=' + name);
addLb(lbSingles, 'muzofon', 'http://muzofon.com/search/' + name);
addLb(lbSingles, 'myfreemp3', 'http://www.myfreemp3.space/mp3/' + name);
addLb(lbSingles, 'my-hit', 'http://my-hit.com/' + name);
addLb(lbSingles, 'mymus.ge', 'http://mymus.ge/music.php?search=' + name);
addLb(lbSingles, 'nur.kz', 'http://music.nur.kz/search?q=' + name);
addLb(lbSingles, 'ok.ru', 'https://ok.ru/search?st.query=' + name);
addLb(lbSingles, 'ololo.ws', 'http://ololo.ws/' + name);
addLb(lbSingles, 'online-song', 'http://online-song.net/?song=' + name);
addLb(lbSingles, 'peggo', 'http://peggo.co/search/' + name);
addLb(lbSingles, 'pleer', 'http://pleer.com/search?q=' + name);
addLb(lbSingles, 'plicymusic', 'http://plicymusic.xyz/?s=' + name);
addLb(lbSingles, 'pobieramy', 'http://pobieramy.me/szukaj/' + name.replace(/%20/g, "-") + "/");
addLb(lbSingles, 'popmusicmp3s', 'http://popmusicmp3s.com/mp3/' + name + ".html");
addLb(lbSingles, 'radioedit', 'http://radioedit.net/' + name);
addLb(lbSingles, 'remixsear.ch', 'http://remixsear.ch/search/keyword/' + name + '/');
addLb(lbSingles, 'satori.moe', 'http://music.satori.moe/search.php?text=' + name);
addLb(lbSingles, 'saving-music.ru', 'http://saving-music.ru/search/' + name); /*excellent,320kbps*/
addLb(lbSingles, 'sharemp3.info', 'http://www.sharemp3.info/search/' + name + ".html");
addLb(lbSingles, 'slacker', 'http://www.slacker.com/fullsearch/' + name);		/* add to button */
addLb(lbSingles, 'slushat', 'http://slushat.com/music-search/' + name);
addLb(lbSingles, 'slushka', 'http://slushka.com/dload/' + name);
addLb(lbSingles, 'smoz.ru', 'http://smoz.ru/#/?q=' + name);
addLb(lbSingles, 'sociallymusic', 'http://www.sociallymusic.com/album/artist_' + name);
addLb(lbSingles, 'song365', 'https://www.song365.biz/search?keyword=' + name);
addLb(lbSingles, 'spotifytube', 'http://spotifytube.com/download-mp3/' + name);
addLb(lbSingles, 'soundcloud2mp3', 'http://soundcloud2mp3.space/search?q=' + name);
addLb(lbSingles, 'sourcemp3', 'http://sourcemp3.com/?search=' + name);
addLb(lbSingles, 'supermp3song', 'http://supermp3song.net/index.php?search=' + name);
addLb(lbSingles, 'tidido', 'http://tidido.com/search/all/' + name);
addLb(lbSingles, 'topmp3', 'http://www.topmp3.us/mp3/' + name + '.html');
addLb(lbSingles, 'tubidydb.cc', 'http://tubidydb.cc/mp3/' + name.replace(/%20/g, "-") + '.html');
addLb(lbSingles, 'tutaudio', 'http://tutaudio.su/music-file/' + name);
addLb(lbSingles, 'vmusice.net', 'http://vmusice.net/mp3/' + name);
addLb(lbSingles, 'vozmimp3', 'http://vozmimp3.com/?string=' + name);
addLb(lbSingles, 'wapzli', 'http://wapzli.web.id/search/musik/' + name + '/index.html');
addLb(lbSingles, 'weborama.ru', 'http://www.weborama.ru/search?look=allwords&from_component[]=content&from_component[]=forum&from_component[]=blogs&from_component[]=board&from_component[]=audio&query=' + name);
addLb(lbSingles, 'xmusik.me', 'https://xmusik.me/# must enter manually -->' + name); /*excellent,192-320*/
addLb(lbSingles, 'yapfiles', 'http://www.yapfiles.ru/search/?do_search_files&t=0&q=' + name + '&where=Музыка');
whereAppend.append(lbSingles);


addButton(null, "Usenet");
addLb(lbUsenet, 'nzbserver.eu', 'https://nzbserver.eu/?search%5Btree%5D=~cat0_z3&sortdir=ASC&sortby=&search%5Bvalue%5D%5B%5D=Title%3A%3D%3ADEF%3A' + name);
addLb(lbUsenet, 'easynews', 'http://members.easynews.com/2.0/index/basic?safeO=0&sb=1&pno=&chxu=1&pby=50&u=1&chxgx=1&st=basic&s1=dtime&s1d=-&fty%5B%5D=ARCHIVE&FileType=OTHER&SelectOther=ARCHIVE&gps=' + name);
addLb(lbUsenet, '------------------', '');
addLb(lbUsenet, 'binnews.in', 'http://www.binnews.in/_bin/search2.php?edTitre=' + name);
addLb(lbUsenet, 'binsearch.info', 'https://www.binsearch.info/?q=' + name);
addLb(lbUsenet, 'binzb', 'http://binzb.com/search?q=' + name);
addLb(lbUsenet, 'findnzb.net', 'http://findnzb.net/?q="' + name + '"');
addLb(lbUsenet, 'ghost-of-usenet.org', 'http://www.ghost-of-usenet.org/index.php/Search/#' + name + " <-- must search manually");
addLb(lbUsenet, 'newslord', 'http://www.newslord.com/index.php?q=' + name);
addLb(lbUsenet, 'nzbclub', 'http://www.nzbclub.com/search.aspx?q=' + name);
addLb(lbUsenet, 'nzbfriends', 'http://nzbfriends.com/?q=' + name);
addLb(lbUsenet, 'nzbgeek', 'https://nzbgeek.info/geekseek.php?browsecategory=3000&browseincludewords=' + name);
addLb(lbUsenet, 'nzbid.net', 'http://nzbid.net/?init=form&sort=relevance&q=' + name);
addLb(lbUsenet, 'nzbindex.nl', 'http://nzbindex.nl/search/?q="' + name + '"');
addLb(lbUsenet, 'nzbking', 'http://nzbking.com/search/?q="' + name + '"');
addLb(lbUsenet, 'nzbstars', 'http://nzbstars.com/?search[tree]=cat1&sortdir=ASC&sortby=&search[value][]=Title:=:DEF:' + name);
addLb(lbUsenet, 'usenet-crawler', 'https://www.usenet-crawler.com/search?index=3&val=' + tit + ' ' + name);
addLb(lbUsenet, 'usenet4ever.info', 'http://usenet4ever.info/vb4/search.php?titleonly=1&forumchoice[]=60&childforums=1&replyless=0&dosearch=Search&securitytoken=1473315787-b5c59f607ac1b987df20d17dd51906a04f98ffcb&searchfromtype=vBForum"%"3APost&do=process&contenttypeid=1&query=' + name);
whereAppend.append(lbUsenet);

    if ($("#scrobbleusername").length > 0)
        $("#scrobbleusername")[0].disabled=false, $("#scrobbleusername")[0].value='rshide'; // for scRYMble


})();
