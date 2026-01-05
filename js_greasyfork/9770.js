// ==UserScript==
// @name        KAT - Noob Radar [MOD]
// @namespace   PXgamer
// @description Noob spotted :P
// @include     *kickass.to/usearch/*/*
// @include     *kickass.to/search/*/*
// @include     *kickass.to/movies/*
// @include     *kickass.to/games/*
// @include     *kickass.to/tv/*
// @include     *kickass.to/applications/*
// @include     *kickass.to/other/*
// @include     *kickass.to/xxx/*
// @include     *kickass.to/new/*
// @include     *kickass.to/latest/*
// @include     *kat.cr/usearch/*/*
// @include     *kat.cr/search/*/*
// @include     *kat.cr/movies/*
// @include     *kat.cr/games/*
// @include     *kat.cr/tv/*
// @include     *kat.cr/applications/*
// @include     *kat.cr/other/*
// @include     *kat.cr/xxx/*
// @include     *kat.cr/new/*
// @include     *kat.cr/latest/*
// @include     *localhost:999/kat/search
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9770/KAT%20-%20Noob%20Radar%20%5BMOD%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9770/KAT%20-%20Noob%20Radar%20%5BMOD%5D.meta.js
// ==/UserScript==

$('.data').before('<style>.redden,.redden:hover{background-color:rgba(255,0,0,0.25) !important;}</style><h5 id="reddenCount"></h5>');
$('.data tr:not(.fristr)').each(function() {
  var date = $('.markeredBlock .lightgrey', $(this)).html();
  if (/year/.test(date)==false&&(/\b[1-2] month/.test(date)||/month/.test(date)==false)&&/class="plain" href="\/user\//.test(date))
    $(this).closest('tr').addClass('redden');
});
$('#reddenCount').html($('.redden').length+' users less than 3 months old found');

$('.data').before('<div class="buttonsline"><button class="siteButton bigButton" id="hideShow"><span>Hide/Show Old Users</span></button></div>');
$('#hideShow').click(function() {
  $('.odd').toggle();
  $('.even').toggle();
  $('.redden').show();
});
                     