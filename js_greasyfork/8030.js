// ==UserScript==
// @name          ETN Ticketing custom script
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @author				Milan K.
// @include				https://ticket.etnetera.cz/*
// @version				1
// ==/UserScript==


/*
	--// Changelog //--
	10.8.2011 - Verze 1
	- skript obsahuje funkcionalitu predesleho skriptu s vyuzitim jQuery (krome zakomentovanych casti)
		 
*/


// definice promennych
var userName = 'JSz';					//jmeno uzivatele

// definice barev
var col_pink = '#ff8888';
var col_red = '#ff0000';
var col_green = '#00ff00';
var col_grey = '#666666';

$(document).ready(function(){
	// Notes - prevod textu na klikatelne odkazy
	$('.noteText').each(function(){
		var txt_original = $(this).html();
		$(this).html(replaceHTMLlinks($(this).html()));
		$(this).html(replaceBUGlinks($(this).html()));
		$(this).html(replaceTICKETlinks($(this).html()));
	});
	
	// Ticket info - zvyrazneni nevyplnene hodnoty Product
	$('#ticketInfo .form th').each(function(){
		if ($(this).html() == 'Product:'){
			var productVal = $(this).parent().find('td');			
			if (productVal.html() == ''){
				productVal.css('background', col_pink);
			}
		}
	});
	
	// 'lepsi' citelnost nekterych udaju
	$('.TITLE, .HANDLERTAG, .type, .REFERENCE, .assignee').css('font-family', 'monospace');
	
	// barevne odliseni garancnich a projektovych tiketu
	$('td.type:contains("Gar"), td:contains("Fau")').css('color', col_red);
	$('td.type:contains("Pro")').css('color', col_green);

	// barevne odliseni tiketu supportaka, ktere jsou predane dal do vyroby
	$('td.TITLE:contains("::")').css('color', col_red);
	
	// klikatelne tikety ve vyuctovani
	$('td[class=""]').each(function(){
		if ($(this).html().match(/^[A-Za-z2]{2,3}\d{5,6}$/)){
			$(this).html('<a target="_blank" href="/support/showTicket/' + $(this).html() + '">' + $(this).html() + '</a>');
		}
	});

  // na zaklade uzivatelova 3-pismenneho ETN id zvyraznuje v urcitych prehledech prislusne tikety
	$('td.HANDLERTAG').each(function(){
		var curElm = $(this).find(':first-child').data.match(userName);
		curElm.css('color', col_grey);		
	});

	$('td.assignee').each(function(){
		var curElm = $(this).find(':first-child').data.match(userName);
		curElm.css('color', col_red);		
	});
	
	
	// SUPPORT - tikety, ktere jsou assignovane jinemu oddeleni
	$('td.TITLE').each(function(){
		var curElm = $(this).find(':first-child').data.match('::');
		curElm.css('color', col_red);			
	});
});

// FUNKCE
// konverze textovych URL na klikatelne odkazy
function replaceHTMLlinks(text){
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp, "<a target='_blank' href='$1'>$1</a>"); 
}

// konverze textovych bugu na klikatelne odkazy do Bugzilly
function replaceBUGlinks(text){
	var exp = /([^\w]+)(BUG[u# ]{0,3})(\d{1,6})([^\w]+)/ig;
	return text.replace(exp, "$1<a href='http://bugzilla.etnetera.cz/show_bug.cgi?id=$3'>$2$3</a>$4"); 
}

// konverze textovych tiketu na klikatelne odkazy
function replaceTICKETlinks(text){
	var exp = /([^\w\/>]+)(TICKET#)?([A-Z]{2,3}\d{5,6})([^\w]+)/ig;
	return text.replace(exp, "$1<a target='_blank' href='https://ticket.etnetera.cz/support/showTicket/$3'>#$3</a>$4");
}