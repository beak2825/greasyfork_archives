// ==UserScript==
// @name        Test-u4k
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   homoklikus84@gmail.com
// @include     http://s1.universe4k.com/*
// @description Wtyczka do u4k
// @version     1.1.3
// @grant       Krzysztof Krajewski z wymiatacze24.pl
// @downloadURL https://update.greasyfork.org/scripts/8275/Test-u4k.user.js
// @updateURL https://update.greasyfork.org/scripts/8275/Test-u4k.meta.js
// ==/UserScript==



$(document).ready(function() {
//Nagłówek//
$('div:eq(2)').prepend('<div class="menu-gora">   <div class="naglowek">   <div class="NaglowekContent">   <a href="http://wymiatacze24.pl" target="_blank"><img src= "http://graj.wymiatacze24.pl/grafika/logo.png" class="logo-w24"></a>    <div id="reklama"><p>Precell poleca: | <a href="http://ad.gameflow.pl/klik/strefa/399/kreacja/1130/" target="_blank">Anno Online</a> | <a href="http://ad.gameflow.pl/klik/strefa/399/kreacja/1756/" target="_blank">Shards of War PL</a> | <a href="http://ad.gameflow.pl/klik/strefa/399/kreacja/1528/" target="_blank">War Thunder PL</a> |</p>     </div><div id="toppanel"> 	<div class="tab"> 		<ul class="login"> 			<li id="toggle"> 				<a id="open" class="open" href="#">Więcej Gier</a> 				<a id="close" style="display: none;" class="close" href="#">Schowaj Panel</a>			 			</li> 		</ul> 	</div><div id="panel"> 	<div class="left"> 	<iframe id="wp_pro_ad_system_ad_zone" frameborder="0" src="http://wymiatacze24.pl/wp-content/plugins/wp_pro_ad_system/includes/api/load_adzone.php?zoneID=3" width="300" height="250" scrolling="no"></iframe>  			</div> 			<div class="left">			  				<iframe id="wp_pro_ad_system_ad_zone" frameborder="0" src="http://wymiatacze24.pl/wp-content/plugins/wp_pro_ad_system/includes/api/load_adzone.php?zoneID=3" width="300" height="250" scrolling="no"></iframe> 			</div> 			 				<div class="left">			  				<iframe id="wp_pro_ad_system_ad_zone" frameborder="0" src="http://wymiatacze24.pl/wp-content/plugins/wp_pro_ad_system/includes/api/load_adzone.php?zoneID=3" width="300" height="250" scrolling="no"></iframe> 			</div> </div></div>   </div>    </div>   <div class="info">  <div class="surowce"><br />   <div class="magazyny"><div class="mag">Magazyny:</div> <div class="hm"></div><div class="wm"></div><div class="lm"></div><div class="zm"></div></div>   </div>    <div class="czas"></div>   </div>');

//Reklama 2//
	$("#open").click(function(){
		$("div#panel").slideDown("slow");
	});	
	$("#close").click(function(){
		$("div#panel").slideUp("slow");	
	});		
	$("#toggle a").click(function () {
		$("#toggle a").toggle();
	});	
//Koniec Reklamy 2//

//Czas Serwera//
$('#SvrTime').appendTo('.czas'); 
//Surowce na poszczególnych planetach//
$('div[id="bea"]:eq(0)').prependTo('.surowce'); //Wodór
$('div[id="ola"]').prependTo('.surowce'); //Woda
$('div[id="spa"]').prependTo('.surowce'); //Lutinum
$('div[id="mea"]').prependTo('.surowce'); //Żelazo
//Magazyny//
$('.zm').load('res.php td[width="15%"]:eq(4)'); //Żelazo
$('.lm').load('res.php td[width="15%"]:eq(5)'); //Lutinum
$('.wm').load('res.php td[width="15%"]:eq(6)'); //Woda
$('.hm').load('res.php td[width="15%"]:eq(7)'); //Wodór

//Lista Planet//
$('form[action="/game/overview.php"]').addClass('listaP');


//$("td:contains('The Command Center is the base for the best engineers of your Empire. They develop new construction strategies for new, effective buildings. Effect: The construction time of your buildings will be lowered.')").prependTo('.surowce');

//Statystyki Wydobycia//
$('div:eq(2)').prepend('<div class="s-wydobycia"><table class="staty">  <tr><th colspan="5">Wydobycie</th></tr>  <tr><th></th><th>H</th><th>24H</th><th>7 Dni</th><th>30 Dni</th></tr>  <tr><td>Żelazo</td><td class="Zh"></td><td class="Z24h"></td><td class="Z7dni"></td><td class="Z30dni"></td></tr>  <tr><td>Lutinum</td><td class="Lh"></td><td></td><td></td><td></td></tr>  <tr><td>Woda</td><td class="Wh"></td><td></td><td></td><td></td></tr>  <tr><td>Wodór</td><td class="Hh"></td><td></td><td></td><td></td></tr>  <tr><th colspan="5">Na wszystkich planetach</th></tr>  <tr><td>Żelazo</td><td class="wZh"></td><td></td><td></td><td></td></tr>  <tr><td>Lutinum</td><td class="wLh"></td><td></td><td></td><td></td></tr>  <tr><td>Woda</td><td class="wWh"></td><td></td><td></td><td></td></tr>  <tr><td>Wodór</td><td class="wHh"></td><td></td><td></td><td></td></tr>  <tr><th colspan="5">Stan magazynów <br /> na wszystkich planetach</th></tr>  <tr><td>Żelazo</td><td colspan="4" class="magazyny-z"></td></tr>  <tr><td>Lutinum</td><td colspan="4" class="magazyny-l"></td></tr>  <tr><td>Woda</td><td colspan="4" class="magazyny-w"></td></tr>  <tr><td>Wodór</td><td colspan="4" class="magazyny-h"></td></tr>  </table></div>');

$('.Zh').load('res.php td[align="center"]:eq(24)');
$('.Lh').load('res.php td[align="center"]:eq(25)');
$('.Wh').load('res.php td[align="center"]:eq(26)');
$('.Hh').load('res.php td[align="center"]:eq(27)');

$('.wZh').load('empire.php tr:eq(24) td:last-child');
$('.wLh').load('empire.php tr:eq(25) td:last-child');
$('.wWh').load('empire.php tr:eq(26) td:last-child');
$('.wHh').load('empire.php tr:eq(27) td:last-child');

//Surowce na wszystkich planetach//
$('.magazyny-z').load('empire.php tr:eq(2) td:last-child');
$('.magazyny-l').load('empire.php tr:eq(3) td:last-child');
$('.magazyny-w').load('empire.php tr:eq(4) td:last-child');
$('.magazyny-h').load('empire.php tr:eq(5) td:last-child');

///////////////////////////Strona Główna////////////////////////////////////////
if (location.pathname.search('overview.php') != -1 ) {	
//Stocznia//
       var set = setInterval(function(){
		$('td[width="50%"]:eq(1)').load('deff.php table[class="main"]:eq(4)'); //Stocznia
		$('td[width="50%"]:eq(0)').load('off.php table[class="main"]:eq(4)'); //Obrona
}, 1000);

}
///////////////////////////Koniec Strony Głównej////////////////////////////////////////

//Podmienione obrazki//	
	//Flota//
$('img[src="inc/universe4k/img/U1K.jpg"]').attr('src','http://u4k.web-24.pl/szakal.gif');
$('img[src="inc/universe4k/img/U2K.jpg"]').attr('src','http://u4k.web-24.pl/renegat.gif');
$('img[src="inc/universe4k/img/U3K.jpg"]').attr('src','http://u4k.web-24.pl/darwin.gif');
$('img[src="inc/universe4k/img/U4K.jpg"]').attr('src','http://u4k.web-24.pl/raider.gif');
$('img[src="inc/universe4k/img/U5K.jpg"]').attr('src','http://u4k.web-24.pl/kolonek.gif');
$('img[src="inc/universe4k/img/U6K.jpg"]').attr('src','http://u4k.web-24.pl/sonda.gif');
$('img[src="inc/universe4k/img/U7K.jpg"]').attr('src','http://u4k.web-24.pl/tjuger.jpg');
$('img[src="inc/universe4k/img/U8K.jpg"]').attr('src','http://u4k.web-24.pl/cougar.gif');
$('img[src="inc/universe4k/img/U9K.jpg"]').attr('src','http://u4k.web-24.pl/handlowiec.gif');
$('img[src="inc/universe4k/img/U10K.jpg"]').attr('src','http://u4k.web-24.pl/transportowiec.gif');
$('img[src="inc/universe4k/img/U11K.jpg"]').attr('src','http://u4k.web-24.pl/bombowiec.gif');
$('img[src="inc/universe4k/img/U12K.jpg"]').attr('src','http://u4k.web-24.pl/longv.gif');
$('img[src="inc/universe4k/img/U13K.jpg"]').attr('src','http://u4k.web-24.pl/noah.gif');
$('img[src="inc/universe4k/img/U14K.jpg"]').attr('src','http://u4k.web-24.pl/longx.gif');
$('img[src="inc/universe4k/img/U15K.jpg"]').attr('src','http://u4k.web-24.pl/spit.gif');
$('img[src="inc/universe4k/img/U16K.jpg"]').attr('src','http://u4k.web-24.pl/sentih.gif');
$('img[src="inc/universe4k/img/U17K.jpg"]').attr('src','http://u4k.web-24.pl/sondaB.png');

	
	//Obrona//
$('img[src="inc/universe4k/img/V1K.jpg"]').attr('src','http://u4k.web-24.pl/ldlaserowe.gif');
$('img[src="inc/universe4k/img/V2K.jpg"]').attr('src','http://u4k.web-24.pl/dzialo%20laserowe.gif');
$('img[src="inc/universe4k/img/V3K.jpg"]').attr('src','http://u4k.web-24.pl/emp.gif');
$('img[src="inc/universe4k/img/V4K.jpg"]').attr('src','http://u4k.web-24.pl/dzialo%20palzmowe.gif');
$('img[src="inc/universe4k/img/V5K.jpg"]').attr('src','http://u4k.web-24.pl/wr.gif');
	//Budynki//
$('img[src="inc/universe4k/img/B1K.jpg"]').attr('src','http://u4k.web-24.pl/B1K.gif');
$('img[src="inc/universe4k/img/B2K.jpg"]').attr('src','http://u4k.web-24.pl/B2K.gif');
$('img[src="inc/universe4k/img/B3K.jpg"]').attr('src','http://u4k.web-24.pl/B3K.gif');
$('img[src="inc/universe4k/img/B4K.jpg"]').attr('src','http://u4k.web-24.pl/B4K.gif');
$('img[src="inc/universe4k/img/B5K.jpg"]').attr('src','http://u4k.web-24.pl/B5K.gif');
$('img[src="inc/universe4k/img/B6K.jpg"]').attr('src','http://u4k.web-24.pl/B6K.gif');
$('img[src="inc/universe4k/img/B7K.jpg"]').attr('src','http://u4k.web-24.pl/B7K.gif');
$('img[src="inc/universe4k/img/B8K.jpg"]').attr('src','http://u4k.web-24.pl/B8K.gif');
$('img[src="inc/universe4k/img/B9K.jpg"]').attr('src','http://u4k.web-24.pl/B9K.gif');
$('img[src="inc/universe4k/img/B10K.jpg"]').attr('src','http://u4k.web-24.pl/B10K.gif');
$('img[src="inc/universe4k/img/B11K.jpg"]').attr('src','http://u4k.web-24.pl/B11K.gif');
$('img[src="inc/universe4k/img/B12K.jpg"]').attr('src','http://u4k.web-24.pl/B12K.gif');
$('img[src="inc/universe4k/img/B13K.jpg"]').attr('src','http://u4k.web-24.pl/B13K.gif');
$('img[src="inc/universe4k/img/B14K.jpg"]').attr('src','http://u4k.web-24.pl/B14K.gif');
$('img[src="inc/universe4k/img/B15K.jpg"]').attr('src','http://u4k.web-24.pl/B15K.gif');

	//Inne//
$('img[src="inc/universe4k/skin/nobase.jpg"]').attr('src','http://w3si1.spaceinvasion.info/img/planet/big/planet_25_big.jpg');
$('img[src="inc/universe4k/skin//gear.png"]').attr('src','http://www.barclaysmanager.ct8.pl/templates/CreateGraf/images/strzalka.png');

//Obrazki wstawione na sztywno//
//Zakładka Statki//
if (location.pathname.search('off.php') != -1 ) {	 
    $('td[width=70]').eq(0).html('<img src=http://u4k.web-24.pl/szakal.gif>');
	$('td[width=70]').eq(1).html('<img src=http://u4k.web-24.pl/renegat.gif>');
	$('td[width=70]').eq(2).html('<img src=http://u4k.web-24.pl/darwin.gif>');
	$('td[width=70]').eq(3).html('<img src=http://u4k.web-24.pl/raider.gif>');
 	$('td[width=70]').eq(4).html('<img src=http://u4k.web-24.pl/kolonek.gif>');
	$('td[width=70]').eq(5).html('<img src=http://u4k.web-24.pl/sonda.gif>');
	$('td[width=70]').eq(6).html('<img src=http://u4k.web-24.pl/tjuger.jpg>');
	$('td[width=70]').eq(7).html('<img src=http://u4k.web-24.pl/cougar.gif>');
	$('td[width=70]').eq(8).html('<img src=http://u4k.web-24.pl/handlowiec.gif>');
	$('td[width=70]').eq(9).html('<img src=http://u4k.web-24.pl/transportowiec.gif>');
	$('td[width=70]').eq(10).html('<img src=http://u4k.web-24.pl/bombowiec.gif>');
	$('td[width=70]').eq(11).html('<img src=http://u4k.web-24.pl/longv.gif>');
	$('td[width=70]').eq(12).html('<img src=http://u4k.web-24.pl/noah.gif>');
} 

//Zakładka Obrona//
if (location.pathname.search('deff.php') != -1 ) {	
 
    $('td[width=70]').eq(0).html('<img src=http://u4k.web-24.pl/ldlaserowe.gif>');
	$('td[width=70]').eq(1).html('<img src=http://u4k.web-24.pl/dzialo%20laserowe.gif>');
	$('td[width=70]').eq(2).html('<img src=http://u4k.web-24.pl/emp.gif>');
	$('td[width=70]').eq(3).html('<img src=http://u4k.web-24.pl/dzialo%20palzmowe.gif>');
 	$('td[width=70]').eq(4).html('<img src=http://u4k.web-24.pl/wr.gif>');

}

//Zakładka Badania//
if (location.pathname.search('forsch.php') != -1 ) {	
 
    $('td[width=70]').eq(0).html('<img src=http://u4k.web-24.pl/f1k.gif>');
	$('td[width=70]').eq(1).html('<img src=http://u4k.web-24.pl/f2k.gif>');
	$('td[width=70]').eq(2).html('<img src=http://u4k.web-24.pl/f3k.gif>');	
	$('td[width=70]').eq(3).html('<img src=http://u4k.web-24.pl/f4k.gif>');	
	$('td[width=70]').eq(4).html('<img src=http://u4k.web-24.pl/f5k.gif>');	
	$('td[width=70]').eq(5).html('<img src=http://u4k.web-24.pl/f6k.gif>');
	$('td[width=70]').eq(6).html('<img src=http://u4k.web-24.pl/f7k.gif>');	
	$('td[width=70]').eq(7).html('<img src=http://u4k.web-24.pl/f8k.gif>');	

}

//Usunięcie brzydkiego tła//
$('td[width="600px"]').css('background','none');
$('td[width="53px"]').remove();
$('td[width="28px"]').remove();
$('td[width="150px"]').css('background','none');

//Zakładka Badania//
$('a[href="info.php?t=f&w=1"]').addClass('tip_trigger').append('<div class="tip">Napęd Odrzutowy<br />Zwiększa prędkość: <br /><img class="badania" src="http://u4k.web-24.pl/szakal.gif"><img class="badania" src="http://u4k.web-24.pl/renegat.gif"><img class="badania" src="http://u4k.web-24.pl/darwin.gif"><img class="badania" src="http://u4k.web-24.pl/sonda.gif"><img class="badania" src="http://u4k.web-24.pl/handlowiec.gif"><br />Punkty: 6</div>');//Napęd Odrzutowy

$('a[href="info.php?t=f&w=2"]').addClass('tip_trigger').append('<div class="tip">Napęd Jonowy<br />Zwiększa prędkość: <br /><img class="badania" src="http://u4k.web-24.pl/raider.gif"><img class="badania" src="http://u4k.web-24.pl/kolonek.gif"><img class="badania" src="http://u4k.web-24.pl/bombowiec.gif"><img class="badania" src="http://u4k.web-24.pl/spit.gif"><br />Punkty: 27</div>');//Napęd Jonowy

$('a[href="info.php?t=f&w=3"]').addClass('tip_trigger').append('<div class="tip">Napęd pod przestrzenny<br />Zwiększa prędkość: <br /><img class="badania" src="http://u4k.web-24.pl/tjuger.jpg"><img class="badania" src="http://u4k.web-24.pl/cougar.gif"><img class="badania" src="http://u4k.web-24.pl/transportowiec.gif"><img class="badania" src="http://u4k.web-24.pl/longv.gif"><br />Punkty: 301</div>');//Napęd pod przestrzenny
//Koniec Zakładki Badania//

//Zakładka Stocznia//
$('a[href="info.php?t=u&w=1"]').addClass('tip_trigger').append('<div class="tip szakal" id="obrona"></div>');
$('.szakal').load('info.php?t=u&w=1 table[style="text-align:center;"]:eq(2)'); //Szakal

$('a[href="info.php?t=u&w=2"]').addClass('tip_trigger').append('<div class="tip renegat" id="obrona"></div>');
$('.renegat').load('info.php?t=u&w=2 table[style="text-align:center;"]:eq(2)'); //Renegat

$('a[href="info.php?t=u&w=3"]').addClass('tip_trigger').append('<div class="tip darwin" id="obrona"></div>');
$('.darwin').load('info.php?t=u&w=3 table[style="text-align:center;"]:eq(2)'); //Darwin

$('a[href="info.php?t=u&w=4"]').addClass('tip_trigger').append('<div class="tip raider" id="obrona"></div>');
$('.raider').load('info.php?t=u&w=4 table[style="text-align:center;"]:eq(2)'); //Raider

$('a[href="info.php?t=u&w=5"]').addClass('tip_trigger').append('<div class="tip kolonizator" id="obrona"></div>');
$('.kolonizator').load('info.php?t=u&w=5 table[style="text-align:center;"]:eq(2)'); //Statek Kolonizacyjny

$('a[href="info.php?t=u&w=6"]').addClass('tip_trigger').append('<div class="tip sondaSz" id="obrona"></div>');
$('.sondaSz').load('info.php?t=u&w=6 table[style="text-align:center;"]:eq(2)'); //Sonda Szpiegowska

$('a[href="info.php?t=u&w=7"]').addClass('tip_trigger').append('<div class="tip Tjuger" id="obrona"></div>');
$('.Tjuger').load('info.php?t=u&w=7 table[style="text-align:center;"]:eq(2)'); //Tjuger

$('a[href="info.php?t=u&w=8"]').addClass('tip_trigger').append('<div class="tip Cougar" id="obrona"></div>');
$('.Cougar').load('info.php?t=u&w=8 table[style="text-align:center;"]:eq(2)'); //Cougar

$('a[href="info.php?t=u&w=9"]').addClass('tip_trigger').append('<div class="tip StatekH" id="obrona"></div>');
$('.StatekH').load('info.php?t=u&w=9 table[style="text-align:center;"]:eq(2)'); //Statek Handlowy

$('a[href="info.php?t=u&w=10"]').addClass('tip_trigger').append('<div class="tip Transportowiec" id="obrona"></div>');
$('.Transportowiec').load('info.php?t=u&w=10 table[style="text-align:center;"]:eq(2)'); //Transportowiec

$('a[href="info.php?t=u&w=11"]').addClass('tip_trigger').append('<div class="tip Bombowiec" id="obrona"></div>');
$('.Bombowiec').load('info.php?t=u&w=11 table[style="text-align:center;"]:eq(2)'); //Zakamuflowany Bombowiec

$('a[href="info.php?t=u&w=12"]').addClass('tip_trigger').append('<div class="tip LV" id="obrona"></div>');
$('.LV').load('info.php?t=u&w=12 table[style="text-align:center;"]:eq(2)'); //Longeagle V

$('a[href="info.php?t=u&w=13"]').addClass('tip_trigger').append('<div class="tip noah" id="obrona"></div>');
$('.noah').load('info.php?t=u&w=13 table[style="text-align:center;"]:eq(2)'); //Noah

$('a[href="info.php?t=u&w=14"]').addClass('tip_trigger').append('<div class="tip LX" id="obrona"></div>');
$('.LX').load('info.php?t=u&w=14 table[style="text-align:center;"]:eq(2)'); //Longeagle X

$('a[href="info.php?t=u&w=15"]').addClass('tip_trigger').append('<div class="tip Spit" id="obrona"></div>');
$('.Spit').load('info.php?t=u&w=15 table[style="text-align:center;"]:eq(2)'); //Spit

$('a[href="info.php?t=u&w=16"]').addClass('tip_trigger').append('<div class="tip sentih" id="obrona"></div>');
$('.sentih').load('info.php?t=u&w=16 table[style="text-align:center;"]:eq(2)'); //Sentih

$('a[href="info.php?t=u&w=17"]').addClass('tip_trigger').append('<div class="tip SondaB" id="obrona"></div>');
$('.SondaB').load('info.php?t=u&w=17 table[style="text-align:center;"]:eq(2)'); //Sonda Bojowa

//Koniec zakładki Stocznia//

//Zakłdka Obrona//	
$('a[href="info.php?t=d&w=1"]').addClass('tip_trigger').append('<div class="tip LWL" id="obrona"></div>');
$('.LWL').load('info.php?t=d&w=1 table[style="text-align:center;"]:eq(2)'); //Lekka wieża laserowa

$('a[href="info.php?t=d&w=2"]').addClass('tip_trigger').append('<div class="tip WL" id="obrona"></div>');
$('.WL').load('info.php?t=d&w=2 table[style="text-align:center;"]:eq(2)'); //Wieża laserowa

$('a[href="info.php?t=d&w=3"]').addClass('tip_trigger').append('<div class="tip EMP" id="obrona"></div>');
$('.EMP').load('info.php?t=d&w=3 table[style="text-align:center;"]:eq(2)'); //Wieża EMP

$('a[href="info.php?t=d&w=4"]').addClass('tip_trigger').append('<div class="tip WP" id="obrona"></div>');
$('.WP').load('info.php?t=d&w=4 table[style="text-align:center;"]:eq(2)'); //Wieża plazmowa

$('a[href="info.php?t=d&w=5"]').addClass('tip_trigger').append('<div class="tip WR" id="obrona"></div>');
$('.WR').load('info.php?t=d&w=5 table[style="text-align:center;"]:eq(2)'); //Wieża rakietowa
//Koniec Zakładki Obrona//
//$('.c0').addClass('tip_trigger');
//$('table[width="304"]').appendTo('.c0');
//$('table[width="304"]').addClass('tip');

//Wyskakujące Okienka//
	$(".tip_trigger").hover(function(){
		tip = $(this).find('.tip');
		tip.show(); //Show tooltip
	}, function() {
		tip.hide(); //Hide tooltip		  
	}).mousemove(function(e) {
		var mousex = e.clientX + 20; //Get X coodrinates
		var mousey = e.clientY + 20; //Get Y coordinates
		var tipWidth = tip.width(); //Find width of tooltip
		var tipHeight = tip.height(); //Find height of tooltip
		
		//Distance of element from the right edge of viewport
		var tipVisX = $(window).width() - (mousex + tipWidth);
		//Distance of element from the bottom of viewport
		var tipVisY = $(window).height() - (mousey + tipHeight);
		  
		if ( tipVisX < 0 ) { //If tooltip exceeds the X coordinate of viewport
			mousex = e.pageX - tipWidth - 0;
		} if ( tipVisY < 0 ) { //If tooltip exceeds the Y coordinate of viewport
			mousey = e.pageY - tipHeight - 0;
		} 
		tip.css({  top: mousey, left: mousex });
	});

//Koniec Wyskakujących okienek//


//Czat//
$('div:eq(2)').append('<div id="box"> <div id="box_submit"></div><div id="box_tresc"><iframe src="http://u4k.web-24.pl/czat/blab.php" width="500px" height="400px">Twoja przeglądarka nie akceptuje ramek!</iframe> </div></div>');

  $('#box_submit, #box_tresc')
   .mouseover(function(){
     $('#box').stop().animate({left: "0px"}, 500);
   })
   .mouseout(function(){
      $('#box').stop().animate({left: "-510px"}, 500);
   })
//Koniec czatu//


//Skasowane//
$('table[class="main"]:eq(2)').remove(); //Surowce
//$('td[width="150px"]:eq(0)').remove(); //Menu

//$('td[onmouseover="tooltipp('precell')"]').addClass('red');

});

