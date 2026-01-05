// ==UserScript==
// @name        MangafoxCensor
// @namespace   *mangafox.*/*
// @include     *mangafox.*/*
// @exclude    *mangafox.*/manga*
// @version     1.2.5
// @author        KatzSmile
// @description	  Excludes manga from listing by genre. Shows additional information on each item.
// @require        https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/8705/MangafoxCensor.user.js
// @updateURL https://update.greasyfork.org/scripts/8705/MangafoxCensor.meta.js
// ==/UserScript==
var styles = "<style type=\"text/css\">.cfmanga{background:#222;width: 600px;font-size: 11px;color: #fff;text-align: left;}.cfmangaheader{background:#000;padding: 4px;height: 16px;margin: 0;display: block;}.cfmangalink{color: #ff5400;display: block;font-size: 14px;font-weight: 700;line-height: 7px;float:left}.cfmangaupdate{float: right;line-height: 14px;padding-right: 10px;}.cfmangadata{clear:both;width:auto;display:table-row;font-size: 11px;margin: 0;}.cfmangadatacolumn{float:left;position: relative;display:table-column;}.cfmangarank{top: 0.4em;color: #333;float: right;font-size: 1000%;line-height: 0;position: relative;z-index: 0;}#updates dt {width:100% !important;padding-left: 0px !important}#updates span.chapter:before{content: \"\\2022  \";}#updates span.chapter{padding-left: 0px !important;width:330px !important;}.click-nav {float: left;margin-top: 21px;position: absolute;z-index: 100;width:138px;}.click-nav ul {position:relative;font-weight:900;}.click-nav ul li {background: #fff;position:relative;list-style:none;cursor:pointer;}.click-nav ul li ul {position:absolute;left:0;right:0;}.click-nav ul .clicker {height: 21px;position:relative;background:#2284B5;color:#FFF;}.click-nav ul .clicker:hover,.click-nav ul .active {background:#196F9A;}.click-nav ul li a {transition:background-color 0.2s ease-in-out;-webkit-transition:background-color 0.2s ease-in-out;-moz-transition:background-color 0.2s ease-in-out;display:block;padding:6px 0 6px 25px;background:#2284b5;color:#FFF;text-decoration:none;}.click-nav ul li a:hover {background:#F2F2F2;color:#000;}.click-nav .no-js ul {display:none;}.click-nav .no-js:hover ul {display:block;}</style>";
$('head').append(styles);

var menuscript=document.createElement("script");
menuscript.type = "text/javascript";
menuscript.innerHTML = "function createCookie(name,value,days){if (days) {var date = new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires = \"; expires=\"+date.toGMTString();}else var expires = \"\"; document.cookie = name+\"=\"+value+expires+\"; path=/\";}function setgenre(){var genres = [];$('span.genres').find('input[name]').each(function(){if (this.checked){genres.push(this.value);}});createCookie('cfgenres',genres.toString(),365);} function applysettings(){var settings = [];$('span.settings').find('input[name]').each(function(){if (this.checked){settings.push(this.value);}});createCookie('cfsettings',settings.toString(),365);} $(function (){$('.click-nav > ul').toggleClass('no-js cfjs');$('.click-nav .cfjs ul').hide();$('.click-nav .cfjs').click(function(e){$('.click-nav .cfjs ul').slideToggle(100);$('.clicker').toggleClass('active');  e.stopPropagation();});$(document).click(function(){if ($('.click-nav .cfjs ul').is(':visible')){$('.click-nav .cfjs ul', this).slideUp();$('.clicker').removeClass('active');}});});";
document.getElementsByTagName('head')[0].appendChild(menuscript);

var ul = $("ul#updates");
var table = $("table#listing");

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var genreslist = ["Action","Adult","Adventure","Comedy","Doujinshi","Drama","Ecchi","Fantasy","Gender Bender","Harem","Historical","Horror","Josei","Martial Arts","Mature","Mecha","Mystery","One Shot","Psychological","Romance","School Life","Sci-Fi","Seinen","Shoujo","Shoujo Ai","Shounen","Shounen Ai","Slice Of Life","Smut","Sports","Supernatural","Tragedy","Webtoons","Yaoi","Yuri"];
var inputs = "";
for (var i=0; i<genreslist.length; i++){
	inputs += "<li style=\"padding-left: 10px;\"><label style=\"display: block;padding-left: 15px;text-indent: -15px;\"><input style=\"width: 13px;height: 13px;padding: 0;margin:0;vertical-align: bottom;position: relative;top: -2px;*overflow: hidden;\" type=\"checkbox\" name=\""+genreslist[i]+"\" value=\""+genreslist[i]+"\" onClick=\"setgenre()\" />&nbsp;"+genreslist[i]+"</label></li>"
}
var settings = "<li style=\"padding-left: 10px;\" title=\"Toggle show additional information on each item in list\"><label style=\"display: block;padding-left: 15px;text-indent: -15px;\"><input style=\"width: 13px;height: 13px;padding: 0;margin:0;vertical-align: bottom;position: relative;top: -2px;*overflow: hidden;\" type=\"checkbox\" name=\"Extended\" value=\"Extended\" onClick=\"applysettings()\" />&nbsp;Extended view</label></li>";

var menudiv = "<div class=\"click-nav\"><ul class=\"no-js\"><li><a href=\"#\" class=\"clicker\" style=\"padding: 10px 0 6px 12px;\">Mangafox Censor</a><ul><span class=\"genres\"><form action=\"#\"><li style=\"padding-left: 4px;\" title=\"Select genres to exclude\"><u>..::filter by genre::..</u></li>"+inputs+"</form></span><span class=\"settings\"><form action=\"#\"><li style=\"padding-left: 25px;\"><u>..::settings::..</u></li>"+settings+"</form></span><li style=\"padding-left: 7px;\"><u>..::version 1.2.5::..</u></li><li><a href=\"#\" onClick=\"window.location.reload()\">Apply changes</a></li></ul></li></ul></div>";
$(menudiv).insertBefore( $( "ul#menu" ) );

var censored = [];
var cfgenres = readCookie('cfgenres')
if (cfgenres) {
	censored = cfgenres.split(",");
	
	var menu = $("span.genres");
	$(menu)
		.find('input[name]') 
			.each(function() {	
				if (censored!=[]){
					if (new RegExp(censored.join("|")).test(this.value)){
						this.checked = true;
					}
				}
			});
}

var opts = [];
var cfsettings = readCookie('cfsettings')
if (cfsettings) {
	opts = cfsettings.split(",");

	var optmenu = $("span.settings");
	$(optmenu)
		.find('input[name]') 
			.each(function() {
				if (opts!=[]){
					if (new RegExp(opts.join("|")).test(this.value)){
						this.checked = true;
					}
				}
			});
}

function mangablock(thislink, data){
	var link = thislink.href;
	var lclass = thislink.className;
	var sid = thislink.rel;
	var em = thislink.parentNode.getElementsByTagName("em");
	var updated = "";
	var i = 0;
	for (i=em.length; i>=0; i--){
		if (em[i] && em[i].innerHTML!==null){
			updated = em[i].innerHTML;
		}
	}
	var span = thislink.parentNode.getElementsByTagName("span");
	var tag = "";
	for (i=span.length; i>=0; i--){
		if (span[i] && span[i].innerHTML!==null){
			tag = span[i].outerHTML;
		}
	}

	var childs = thislink.parentNode.parentNode.children[1].innerHTML;
	var block = "<div class=\"cfmanga\" style=\"width: 600px;\"><h3 class=\"cfmangaheader\"><a rel=\""+sid+"\" href=\""+link+"\" class=\""+lclass+" cfmangalink\" style=\"font-weight: 700;position: absolute;z-index: 1;\">"+data[0]+" ("+data[8]+") "+tag+"</a><span style=\"float: right;\" title=\""+data[7]+"\" class=\"stars star"+data[6]+"\"></span><span class=\"cfmangaupdate\">"+updated+"</span></h3><div class=\"cfmangadata\"  style=\"width: 600px;\"><h5 class=\"cfmangarank\">"+data[5]+"</h5><div class=\"cfmangadatacolumn\" style=\"width:100px;\"><a rel=\""+sid+"\" href=\""+link+"\"><img border=\"0\" width=\"100\" src=\"http://l.mfcdn.net/store/manga/"+sid+"/cover.jpg\"></a></div><div class=\"cfmangadatacolumn\" style=\"padding: 10px;width:480px;\"><span title=\""+data[1]+"\">"+data[1].substring(0, 60)+"...</span><hr>Genre: <i>"+data[2]+"</i><hr>"+data[9].substring(0, 256)+"...<br><hr>"+childs+"</div></div>";
	return block;
}

$(ul)
	.find('a[rel]')
        .each(function() {
			var thislink = this;

			jQuery.post('http://mangafox.me/ajax/series.php', {'sid': thislink.rel}, function (data) {	
						if (!data) return;
						if (data[2]!==''){
							if (new RegExp(censored.join("|")).test(data[2])){
								thislink.parentNode.parentNode.remove();
							}
						}
						if (opts.length > 0 && new RegExp(opts.join("|")).test("Extended")){									
							thislink.parentNode.parentNode.innerHTML = mangablock(thislink, data);	
						}
                    }, "json");
        })
;

$(table)
	.find('a[rel]')
        .each(function() {
			var thislink = this;
			jQuery.post('http://mangafox.me/ajax/series.php', {'sid': thislink.rel}, function (data) {	
						if (!data) return;
						if (data[2]!==''){
							if (new RegExp(censored.join("|")).test(data[2])){
								thislink.parentNode.parentNode.remove();
							}
						}
                    }, "json");
        })
;