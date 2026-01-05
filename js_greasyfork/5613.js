// ==UserScript==
// @name        KAT - Long usernames lister
// @namespace   Dr.YeTii
// @description Extracts long usernames (and 'Mr.' prefixed usernames) from community page and achievement pages
// @include     http*://kickass.so/achievements/*
// @include     http*://kickass.so/community/
// @include     http*://kickass.so/community/#*
// @version     1.55
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/5613/KAT%20-%20Long%20usernames%20lister.user.js
// @updateURL https://update.greasyfork.org/scripts/5613/KAT%20-%20Long%20usernames%20lister.meta.js
// ==/UserScript==

var pathname = window.location.pathname;
var MINLENGTH = 14; // Minimum length this application will pick up (inclusive)
var oldList = GM_getValue('usernames', '');

var list = ''; // Long names
var count = ''; // Count of long names
var listMr = ''; // Mr. prefixed names
var blacklistAdmins = 'Mr.White|Mr.Red|Mr.Tol|Mr.Pink|Mr.Blonde|Mr.Gray|Mr.Gooner|Mr.Green|Mr.Woffort|Mr.Black|Mr.Chill|Mr.Wolf|Mr.Brown|Mr.Pin'; // Add more 'Mr.' prefixed admins/ex-mod/staff
var el = ''; // Chosen element to prepend to which is dependant on the page

function nameCheck(name, clss) {
  var prefix = name.toLowerCase().substr(0, 3);
  if ((prefix == 'mr.' || prefix == 'mr-' || prefix == 'mr_') && clss.indexOf('aclColor_10') == - 1 && blacklistAdmins.indexOf(name) == - 1) {
    listMr = listMr+'<a class="'+clss+'" href="/user/'+name+'/">'+name+'</a> | ';
    //alert(listMr);
  }
  if (name.length >= MINLENGTH) {
    list = list+'[user="'+name+'"]\n';
    count++;
  }
}

if (pathname.indexOf('/achievements/') == 0) { // Achivement pages
  el = 'accentbox';
  $('.accentbox > ul > li span a').each(function () {
    var name = $(this).html();
    if ($(this).is('.plain') && $(this).parent().is('.linethrough') == false && oldList.indexOf('[user="'+name+'"]') == -1) {
      var clss = $(this).parent().attr('class');
      nameCheck(name, clss);
    }
  });
} else { // Community page
  el = 'communityLayout h2:last';
  $('.tag1').each(function () {
    var name = $(this).html();
    var clss = $(this).attr('class');
    if (oldList.indexOf('[user="'+name+'"]') == -1) {
      nameCheck(name, clss);
    }
  });
}

if (listMr.length > 0) {
  listMr = '<div id="mrPrefixes"><h3 style="color: red;">Mr. prefix found!</h3><small>'+listMr.substring(0, listMr.length - 3)+'</small></div>';
}

var resetNameHtml = '<span title="Reset all remembered names" class="aclColor_1 floatright" id="resetNames"><a class="plain font12px pointer">Reset memory</a></span>';
var saveNamesHtml = '<button class="siteButton bigButton" id="saveNames"><span>Remember these names</span></button>';

if (count > 0) {
  var plural = '';
  if (count > 1) {
    plural = 's';
  }
  var textbox = '<br id="longUsernames">'+resetNameHtml+'<h2>'+count+' username'+plural+' '+MINLENGTH+' characters long or longer</h2><textarea id="longUsernamesList" onclick="select()" name="content" class="botmarg5px" style="height:30px;">'+list+'</textarea><br>'+saveNamesHtml+'<br>'+listMr;
  $('.'+el).prepend(textbox);
  var s_height = document.getElementById('longUsernamesList').scrollHeight;
  document.getElementById('longUsernamesList').setAttribute('style', 'height:'+s_height+'px');
  if (pathname.indexOf('/achievements/') >= 0) { // Auto remember names for achievements pages
    $('#saveNames').remove();
    GM_setValue('usernames', oldList+list);
  }
}else{
  var textbox = '<br id="longUsernames">'+resetNameHtml+'<h2>There were NO new usernames '+MINLENGTH+' characters long or longer</h2><br>'+listMr+'<br>';
  $('.'+el).prepend(textbox);
}

$('#saveNames').click(function() {
  GM_setValue('usernames', oldList+list);
  list = '';
  $(this).slideUp();
});

$('#resetNames').click(function() {
  GM_setValue('usernames', '');
  $(this).slideUp();
});