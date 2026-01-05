// ==UserScript==
// @name        Kickass Torrent Age Color
// @name:ar     Kickass Torrent Age Color
// @namespace   Majed Alotaibi
// @author      ماجد العتيبي
// @description Change "age" column colors on Kickass Torrent website.
// @description:ar تغيير لون عمود عمر التورنت في موقع كيك آس
// @include     https://kickass.*/*
// @include     https://kickass.*/*
// @include     https://kat.cr/*
// @include     http://katproxy.*/*
// @version     1.0.2
// @grant       none
// @icon        
// @downloadURL https://update.greasyfork.org/scripts/8529/Kickass%20Torrent%20Age%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/8529/Kickass%20Torrent%20Age%20Color.meta.js
// ==/UserScript==


$(document).ready(function() {                     


$('tr > td[class="center"]').each(function()
{
  if ( $(this).html().indexOf( 'hour' ) > -1 ) {  
     $(this).css('background-color','#00ff55');      
  }
  if ( $(this).html().indexOf( 'day' ) > -1 ) {   
     $(this).css('background-color','#6ef99c');      
  }    
  if ( $(this).html().indexOf( 'week' ) > -1 ) {    
     $(this).css('background-color','#78fda4');     
  }
  if ( $(this).html().indexOf( 'month' ) > -1 ) {    
     $(this).css('background-color','#79daff');     
  }
  if ( $(this).html().indexOf( 'year' ) > -1 ) {  
     $(this).css('background-color','#fdd558');     
  }
});


  
});