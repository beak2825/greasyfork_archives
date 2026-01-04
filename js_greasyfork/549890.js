// ==UserScript==
// @name         AWBW Game Filter
// @namespace    https://awbw.amarriner.com/
// @version      2025-05-28
// @description  Hide specific game types when looking at "join game"
// @author       Kupie
// @match        https://awbw.amarriner.com/gameswait.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amarriner.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549890/AWBW%20Game%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/549890/AWBW%20Game%20Filter.meta.js
// ==/UserScript==


$('b:contains(" (FOG)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_FOG');
$('b:contains(" (HFOG)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_HFOG');
$('b:contains(" (HTAG)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_HTAG');
$('b:contains(" (HF)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_HF');
$('b:contains(" (No COP)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_NoCOP');
$('b:contains(" (TAG)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_TAG');
$('b:contains(" (FTAG)")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_FTAG');
$('b:contains(" [T0] ")').parent().parent().parent().parent().parent().parent().parent().parent().addClass('filters_T0');
$('span').filter(function() {
  return /\(0\/\d joined\)/.test($(this).text());
}).parent().parent().parent().parent().parent().parent().addClass('filters_Empty');

$('span').filter(function() {
  return /\((0|\d{1,2})\/\d{1,2} joined\)/.test($(this).text());
}).parent().parent().parent().parent().parent().parent().addClass('filters_non_z_games');
$('b:contains("Z - ")').parent().parent().parent().parent().parent().parent().parent().parent().removeClass('filters_non_z_games');

//	$( ".filters_FOG" ).addClass('filtersDisplayNone');
//	$( ".filters_HFOG" ).addClass('filtersDisplayNone');
//	$( ".filters_HTAG" ).addClass('filtersDisplayNone');
//	$( ".filters_HF" ).addClass('filtersDisplayNone');
//	$( ".filters_NoCOP" ).addClass('filtersDisplayNone');

//	$( ".filtersDisplayNone" ).css({"display": "none"});

var $tableSelectFilters = $( ' \
	<table class="filtersTable" border="1"> \
		<tr> \
			<td><b>Hide:</b></td> \
			<td>FOG <input type="checkbox" id="filters_FOG_checkbox"></td> \
			<td>HFOG <input type="checkbox" id="filters_HFOG_checkbox"></td> \
			<td>HTAG <input type="checkbox" id="filters_HTAG_checkbox"></td> \
			<td>HF <input type="checkbox" id="filters_HF_checkbox"/></td> \
			<td>NoCOP <input type="checkbox" id="filters_NoCOP_checkbox"></td> \
			<td>TAG <input type="checkbox" id="filters_TAG_checkbox"></td> \
			<td>FTAG <input type="checkbox" id="filters_FTAG_checkbox"></td> \
			<td>T0 <input type="checkbox" id="filters_T0_checkbox"></td> \
			<td>Empty <input type="checkbox" id="filters_Empty_checkbox"></td> \
			<td>Non-Z <input type="checkbox" id="filters_nonzgames_checkbox"></td> \
		</tr> \
	</table> \
	');
//$('td.bordertitle').prepend($tableSelectFilters);
$('#top-header-nav').prepend($tableSelectFilters);

$( "#logo-background2" ).css({"display": "none"});

//$('#nav-options').insertBefore($tableSelectFilters, $('#nav-options').children[4]);

//$( ".logo-background2" ).css({"display": "none"});

$('#filters_FOG_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_FOG" ).css({"display": "none"});
	}else{
		$( ".filters_FOG" ).css({"display": ""});
	}
});

$('#filters_HFOG_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_HFOG" ).css({"display": "none"});
	}else{
		$( ".filters_HFOG" ).css({"display": ""});
	}
});

$('#filters_HTAG_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_HTAG" ).css({"display": "none"});
	}else{
		$( ".filters_HTAG" ).css({"display": ""});
	}
});
$('#filters_HF_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_HF" ).css({"display": "none"});
	}else{
		$( ".filters_HF" ).css({"display": ""});
	}
});

$('#filters_NoCOP_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_NoCOP" ).css({"display": "none"});
	}else{
		$( ".filters_NoCOP" ).css({"display": ""});
	}
});

$('#filters_TAG_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_TAG" ).css({"display": "none"});
	}else{
		$( ".filters_TAG" ).css({"display": ""});
	}
});

$('#filters_FTAG_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_FTAG" ).css({"display": "none"});
	}else{
		$( ".filters_FTAG" ).css({"display": ""});
	}
});
$('#filters_T0_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_T0" ).css({"display": "none"});
	}else{
		$( ".filters_T0" ).css({"display": ""});
	}
});

$('#filters_Empty_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_Empty" ).css({"display": "none"});
	}else{
		$( ".filters_Empty" ).css({"display": ""});
	}
});

$('#filters_nonzgames_checkbox').bind('change', function () {
	if ($(this).is(':checked')) {
		$( ".filters_non_z_games" ).css({"display": "none"});
	}else{
		$( ".filters_non_z_games" ).css({"display": ""});
	}
});



$('#filters_FOG_checkbox').trigger( "click" );;
$('#filters_HFOG_checkbox').trigger( "click" );;
$('#filters_HF_checkbox').trigger( "click" );;
$('#filters_HTAG_checkbox').trigger( "click" );;
$('#filters_NoCOP_checkbox').trigger( "click" );;
$('#filters_TAG_checkbox').trigger( "click" );;
$('#filters_FTAG_checkbox').trigger( "click" );;
$('#filters_T0_checkbox').trigger( "click" );;

