// ==UserScript==
// @name dd-ignore-tempermonkey
// @namespace https://greasyfork.org/en/scripts/6473-dd-ignore-tempermonkey
// @version 0.4.7
// @description Hide blacklisted users and their data.
// @include *darkdiary.ru/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant GM.getValue
// @grant GM.setValue
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/6473/dd-ignore-tempermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/6473/dd-ignore-tempermonkey.meta.js
// ==/UserScript==


var noticeStyle;
var ignoreListStyle;
var ignoreListContainerType;
var ignoreListContainer;
var ignoreListContainerHolder;
var loggedIn;
var currentListValues;
var leftmenu;
var loginMenu;

var removeFromList = async function (nick) {
  console.log("remove "+nick);
  currentListValues = currentListValues.replace(' ' + nick + ' ', ' ');
  await GM.setValue('dd_ignore', currentListValues);
  fillList(currentListValues.split(' '));
  $('div[data-user = "' + nick + '"]').parent().siblings().attr('style', '')
		.siblings('div[class!="leftPane"][class!="rightPane rightPaneOffset"]').attr('style', 'clear:both;');
  $('div[data-user = "' + nick + '"]').parent().remove();
  $('a[title^="Профиль"][href="/users/' + nick + '/profile"] + a' + (loggedIn ? ' + a' : ''))
		.attr('title', 'В игнор').unbind('click').bind('click', magic).next().remove();
  $('a[title^="Профиль пользователя"][href="/users/' + nick + '/profile"] + a' + (loggedIn ? ' + a' : ''))
		.closest('div[class="userlistRow"]').attr('style', '');
};

var antimagic = function (event) {
  var nick = $(this).siblings('a[href $= "/profile"]').attr('href').replace('/users/', '').replace('/profile', '');
  removeFromList(nick);
  event.preventDefault();
};

var toggle = function (event) {
  var pObjects = $(this).parents('article').children().siblings('[class!="notice"]');
  var strStyle = pObjects.attr('style');
  //console.log(strStyle);
  var strQ = 'Скрыть?'
  if (strStyle == 'display:none') {
    pObjects.attr('style', 'padding-bottom:3px')
  } else {
    pObjects.attr('style', 'display:none')
    strQ = 'Показать?'
  }
  $(this).parents('article').find('a[class="igShow"]').html(strQ);
  event.preventDefault();
};

var hide = function (ignoreList) {
  ignoreList.forEach(function (value, index, array) {
	//console.log("hide "+value);
    $('a[title^="Профиль пользователя"][href="/users/' + value + '/profile"] + a' + (loggedIn ? ' + a' : ''))
		.closest('div[class="userlistRow"]').attr('style', 'display:none');
    var pToHide = $('a[title^="Профиль пользователя"][href="/users/' + value + '/profile"] + a' + (loggedIn ? ' + a' : ''))
					.attr('title', 'Скрыть').unbind('click')
					.bind('click', toggle)
					.after(' <a title="Амнистировать" class="forgive friendreqButton" href = "#"></a>')
					.closest('article[class^="block comment"]');
    var strPrevEl = 'div[class!="notice"]';
    if (pToHide.size() < 1) {
      pToHide = $('a[title^="Профиль пользователя"][href="/users/' + value + '/profile"] + a' + (loggedIn ? ' + a' : ''))
					.closest('article[class^="block entry"]');
      strPrevEl = 'div[class^="rightPane"]';
    }
    pToHide.children().siblings('[class!="notice"]').attr('style', 'display:none').siblings(strPrevEl).after('<section class="notice" style="' +
			noticeStyle + '" ><div class="textBg" data-user="' + value +
			'" style="border:solid 1px #ddddcc; padding-left: 120px">Пользователь <b>' +
			value + '</b> написал какую-то глупость. <a class="igShow" href="#">Показать?</a></div></section>');
    //console.log(pToHide);
  });
  $('a.igShow').unbind('click').bind('click', toggle);
  $('a.forgive').unbind('click').bind('click', antimagic);
};

var magic = async function (event) {
  var nick = $(this).siblings('a[href $= "/profile"]').attr('href').replace('/users/', '').replace('/profile', '');
  currentListValues = currentListValues.replace(' ' + nick + ' ', ' ') + nick + ' ';
  await GM.setValue('dd_ignore',currentListValues);
  fillList(currentListValues.split(' '));
  hide([nick]);
  console.log("hide " + nick);
  event.preventDefault();
};

var antimagicByName = function (event) {
  var nick = $(this).closest('div').prev().attr('href').replace('/users/', '').replace('/profile', '').replace('/', '');
  removeFromList(nick);
  event.preventDefault();
};

var fillList = function (ignoreList) {
  ignoreListContainer.html('<h1 class="section">Список игнора</h1><hr class="divider"></hr></div>');
  ignoreListContainer.next().remove();
  var tmpList = '<div>';
  ignoreList.forEach(function (value, index, array) {
    if (value != ''){ 
		tmpList += '<div class="userlistRow"><a href="/users/' + value + '/">' + value + '</a>' +
					'<div class="controls"><a title="Амнистировать" class="forgiveFromList friendreqButton" ></a></div></div>';
	}
  });
  tmpList += '</div>';
  ignoreListContainer.after(tmpList);
  $('a.forgiveFromList').unbind('click').bind('click', antimagicByName);
};

var showIgnore = async function (event) {
  ignoreListStyle = (ignoreListStyle == 'display:none' ? 'padding-bottom:3px' : 'display:none');
  ignoreListContainer.closest('h1').parent().attr('style', ignoreListStyle);
  $(this).text(ignoreListStyle == 'display:none' ? 'Показать список' : 'Скрыть список');
  await GM.setValue('ignoreListStyle', ignoreListStyle);
  fillList(currentListValues);
  event.preventDefault();
};

var toggleNotices = async function (event) {
  noticeStyle = (noticeStyle == 'display:none' ? 'padding-bottom:3px' : 'display:none');
  $('.notice').attr('style', noticeStyle);
  $(this).text(noticeStyle == 'display:none' ? 'Показать оповещения' : 'Скрыть оповещения');
  await GM.setValue('noticeStyle', noticeStyle);
  event.preventDefault();
};

var initSystem = async function () {
  console.log("Ignoring starting...");
  noticeStyle = await GM.getValue('noticeStyle', 'padding-bottom:3px');
  ignoreListStyle = await GM.getValue('ignoreListStyle', 'display:none');
  currentListValues = await GM.getValue('dd_ignore', ' ')
  ignoreListContainerType = 0;
  
  ignoreListContainerHolder = $('h1.section:contains("Наши интересы")').parent().parent();
  if (ignoreListContainerHolder.prop('baseURI') == undefined) {
	ignoreListContainerType = 1;
	ignoreListContainerHolder = $('h1.section:contains(" теги")').parent().parent();
	if (ignoreListContainerHolder.prop('baseURI') == undefined) {
	  ignoreListContainerHolder = $('h1.section:contains(" друзья")').parent().parent();
      if (ignoreListContainerHolder.prop('baseURI') == undefined) {
		  ignoreListContainerHolder = $('h1.section:contains("Дневники")').parent().parent();
        if (ignoreListContainerHolder.prop('baseURI') == undefined) {
		    ignoreListContainerType = - 1;
		    return;
		}
      }
    }
  }
  if (ignoreListContainerType >= 0) {
    var sHTMLTemplate = '<div class="block"><h1 class="section">1</h1>';
    ignoreListContainerHolder.children().last().after(sHTMLTemplate);
    ignoreListContainer = ignoreListContainerHolder.find('h1.section').last();
  }
   leftmenu = $('a.dropdown-toggle:contains("DarkDiary.ru")').parent();
  loggedIn = false;
  loginMenu= $('a.dropdown-toggle:contains("Вход")').parent();
  if (loginMenu.prop('baseURI') == undefined) {
    loggedIn = true;
  }
  if (leftmenu.prop('baseURI') == undefined) {
    return;
  }
  ignoreListContainer.closest('h1').parent().attr('style', ignoreListStyle);
  fillList(currentListValues.split(' '));
  $('a[class ^= "profileButton"][href $= "/profile"]' + (loggedIn ? ' + a' : ''))
	.after(' <a title="В игнор" class = "clIgnore deleteButton inline" href = "#"></a>');
  $('.clIgnore').bind('click', magic);
  leftmenu.after('<li class="dropdown">'+
                 '<a aria-expanded="false" class="dropdown-toggle" href="#" data-toggle="dropdown">Игнор <strong class="caret"></strong></a>'+
          	     '<ul class="dropdown-menu" role="menu">'+
          		'<li><a id="showIgnoreList" href="#">' + (ignoreListStyle == 'display:none' ? 'Показать список' : 'Скрыть список') +'</a></li>'+
          		'<li><a id="toggleNotices" href="#">' + (noticeStyle == 'display:none' ? 'Показать оповещения' : 'Скрыть оповещения') + '</a></li>'+
          	'</ul></li>');
  $('#showIgnoreList').bind('click', showIgnore);
  $('#toggleNotices').bind('click', toggleNotices);
  hide(currentListValues.split(' '));
  console.log("Ignoring started");
}

initSystem();
