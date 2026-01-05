// ==UserScript==
// @name        Yarportal Ignore 2
// @namespace   http://yarportal.ru
// @description Игнор для форумов на IPB 1.3
// @include     http://yarportal.ru/*
// @include     http://www.yarportal.ru/*
// @version     2.2.150622
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6347/Yarportal%20Ignore%202.user.js
// @updateURL https://update.greasyfork.org/scripts/6347/Yarportal%20Ignore%202.meta.js
// ==/UserScript==

// что за страничка? Для списка тем и треда — разные обработчики
var curPageName = window.location.pathname.toString();

// инициализируем список игнора из локального хранилища
// localStorage.clear();
var ignoreList = localStorage.ignoreList ? JSON.parse(localStorage.ignoreList)  : {};
var ypignoreFlags = localStorage.ypignoreFlags ? JSON.parse(localStorage.ypignoreFlags) : {};
if (ypignoreFlags.ShowNames === undefined) ypignoreFlags.ShowNames = true;
if (ypignoreFlags.HideQuotes === undefined) ypignoreFlags.HideQuotes = true;

// alert (JSON.stringify(ignoreList));
// alert (JSON.stringify(ypignoreFlags));


// чистим список. Если все флаги стоят false, то незачем их хранить. Только место занимают.
for (var k in ignoreList)
  {
    if (!ignoreList[k].hidePost && !ignoreList[k].hideQuote && !ignoreList[k].hideThread ) delete ignoreList[k];
  }
localStorage.ignoreList = JSON.stringify(ignoreList);


// работаем со списком тем или списком активных тем
if (~curPageName.indexOf('forum') || ~window.location.search.toString().indexOf('act=Search&CODE=getactive')) {
  
// Сначала вставляем внизу DIV в который мы потом будем запихивать имена игнорируемых. Если таковые будут
var afterID = ~curPageName.indexOf('forum') ? "div.darkrow2:last" : "div.titlemedium:last";
if (ypignoreFlags.ShowNames) $(afterID).after('<div class="row2" id="ignoreNamesHere" style="padding:4px" align="left"><strong>В игноре темы от: </strong> </div>');

// список тем, перебираем имена авторов
var authList = {};
var authors = $('div.tableborder > table > tbody > tr > td.row2 > a[href*="showuser"]');
authors.each(function ()
{
  // вылущиваем имя и ID
  var authorName = $(this).text();
  authorName = spcharReplace(authorName);
  var authorID = $(this).attr('href');
  var authorID = authorID.substring(authorID.indexOf('=') + 1);

  //собираем найденные уникальные пары ID:имя
  authList[authorID] = authorName;

  // и присваиваем строкам ID их авторов, чтоб потом проще прятать
  $(this).closest('tr').addClass(authorID);
  // за никами вставляем ссылку-кнопку, инициирующую удаление
  $(this).after(' <strong><a class="ignoreAdd" id="' + authorID + '" href="#" style="text-decoration: none" title="Игнорировать все темы этого пользователя">[-]</a></strong>');
});

//Прячем темы, если есть что. Чтобы два раза не вставать выводим список игнора внизу
//Выводим только тех кого реально прятали на этой странице, так проще если список игнора большой
for (var k in ignoreList)
  {
    if (ignoreList[k].hideThread) 
      {
        var hidelen = $('.' + k).length;
        $('.' + k).hide();
        if (hidelen > 0 && ypignoreFlags.ShowNames) putName(k, 'Перестать игнорировать темы пользователя');
      }
  }
}
// закончили со списком тем



// Работаем с сообщениями
if (~curPageName.indexOf('topic')) 
{
// Сначала вставляем внизу DIV в который мы потом будем запихивать имена игнорируемых, если таковые будут
if (ypignoreFlags.ShowNames) $("div.activeuserstrip:last").after('<div class="row2" id="ignoreNamesHere" style="padding:4px" align="left"><strong>В игноре посты от: </strong> </div>');

// список постов, перебираем имена авторов
var authList = {};
var authors = $('div.tableborder > table');
// > td.row4 > a[href*="javascript:ins"]
authors.each(function ()
{
  // вылущиваем имя и ID
  var authorName = $(this).find('span.normalname > a').filter(':first').text();
  // имя может быть пустым, если пост от удаленного пользователя, такие пропускаем
  if (authorName)
    {
      authorName = spcharReplace(authorName);
      var authorID = $(this).find('tr > td > span.postdetails > a').filter(':first').attr('href');
      var authorID = authorID.substring(authorID.indexOf('=') + 1);

      authList[authorID] = authorName;

      // и присваиваем целым таблицам ID их авторов, чтоб потом проще прятать
      $(this).addClass(authorID);
      // туда где жалоба вставляем ссылку на игнорирование пользователя
      $(this).find('td.row4 > div > a').filter(':first').before(' <strong><a class="ignoreAdd" id="' + authorID + '" href="#" style="text-decoration: none" title="Игнорировать все сообщения этого пользователя">[В игнор]</a></strong>&nbsp;&nbsp;&nbsp;');
    }
});
var authors = $('div.tableborder > table');
  
//прячем посты, если есть что, и чтобы два раза не вставать выводим список игнора вконце
//Выводим только тех кого реально прятали на этой странице, так проще если список игнора большой
for (var k in ignoreList)
  {
    if (ignoreList[k].hidePost) 
    {
      var check = $('.' + k).length;
      $('.' + k).hide();
      if (check > 0 && ypignoreFlags.ShowNames) putName(k, 'Перестать игнорировать сообщения пользователя');

      if (ypignoreFlags.HideQuotes) 
      {
        var hideUser = ignoreList[k].Name;
        var hideUserN = '(' + hideUser + ' @';
        var hideUserM = '[QUOTE=' + hideUser + ',';

        hideUserN = hideUserN.replace(/\&nbsp;/g, ' ');
        hideUserM = hideUserM.replace(/\&nbsp;/g, ' ');

        authors.each(function()
                 {
                   var post = $(this);
                   var check = checkEquals(post.find('b'), hideUser);
                   check = check + checkContains(post.find('td'), hideUserN);
                   check = check + checkContains(post.find('td'), hideUserM);
                   if (check > 0) post.hide();
                 });
      }

    }
  }
}
// закончили с сообщениями



// здесь обрабатывается страница настроек
if (~curPageName.indexOf('index') && ~window.location.search.toString().indexOf('act=Msg&CODE=02')) 
{
  //вставляем новую плашку куда мы будем выводить список игнорируемых
  var txt = '';
  var txt2 = '';
  if (ypignoreFlags.ShowNames) txt = ' checked="checked" ';
  if (ypignoreFlags.HideQuotes) txt2 = ' checked="checked" ';
  $("div.pformstrip:last").after('<br><div class="row2" id="ignoreNamesHere" style="padding:4px" align="left"><strong>&nbsp;В игноре темы и/или посты от: </strong></div><div class="row2" style="padding:4px" align="left">&nbsp;<b>Выводить список игнорируемых в списке тем/сообщений: <input type="checkbox" class="ShowNames" ' + txt + ' /></b></div><div class="row2" style="padding:4px" align="left">&nbsp;<b>Прятать цитаты: <input type="checkbox" class="HideQuotes" ' + txt2 + ' /></b></div>');
  for (var k in ignoreList)
    {
      var txt = "Игнорируются ";
      var appx = '';
      if (ignoreList[k].hidePost) {
        txt = txt + "сообщения";
        appx = " и ";
      }
      if (ignoreList[k].hideThread) txt = txt + appx + "темы";
      putName(k, txt + ". Удалить из списка.");
    }
}



//обработчик изменения чекбоксов
$('input.ShowNames').on("click", function () {
  if (ypignoreFlags.ShowNames) { 
    ypignoreFlags.ShowNames = false;
  } else ypignoreFlags.ShowNames = true;
  localStorage.ypignoreFlags = JSON.stringify(ypignoreFlags);
});

$('input.HideQuotes').on("click", function () {
  if (ypignoreFlags.HideQuotes) { 
    ypignoreFlags.HideQuotes = false;
  } else ypignoreFlags.HideQuotes = true;
  localStorage.ypignoreFlags = JSON.stringify(ypignoreFlags);
});




// обработчик нажатия на [-]
$('a.ignoreAdd').click(function ()
{
  var authorID = $(this).attr('id');
  $('.' + authorID).hide();
  // если в списке игнора не было раньше такого ID, то создаём;
  if (ignoreList[authorID] === undefined)
  {
    ignoreList[authorID] = {};
    ignoreList[authorID]['Name'] = authList[authorID];
    ignoreList[authorID]['hidePost'] = false;
    ignoreList[authorID]['hideQuote'] = false;
    ignoreList[authorID]['hideThread'] = false;
  }
  if (~curPageName.indexOf('forum') || ~window.location.search.toString().indexOf('act=Search&CODE=getactive')) 
  {
    ignoreList[authorID].hideThread = true;
  } else 
    {
      ignoreList[authorID].hidePost = true;
      ignoreList[authorID].hideQuote = true;
    }
  localStorage.ignoreList = JSON.stringify(ignoreList);
  putName(authorID, 'Перестать игнорировать темы пользователя');

  return (false);
});




// обработчик нажатия на имя в списке игнора
$("body").on('click', '.ignoreRemove', function (){
  var authorID = $(this).attr('id');
  if (~curPageName.indexOf('forum') || ~window.location.search.toString().indexOf('act=Search&CODE=getactive')) 
  {
    $('.' + authorID).show();
    ignoreList[authorID].hideThread = false;
  } else if (~curPageName.indexOf('topic')) 
    {
      $('.' + authorID).show();
      ignoreList[authorID].hidePost = false;
      ignoreList[authorID].hideQuote = false;
    } else
      {
        delete ignoreList[authorID];
      }
  localStorage.ignoreList = JSON.stringify(ignoreList);
  $(this).remove();
  return (false);
});





// функция вывода имен игнорируемых со ссылками 
function putName(authorID, text)
{
  $("div.row2#ignoreNamesHere").append('<a href="#" class="ignoreRemove" id="' + authorID +'" title="' + text + '" style="text-decoration: none">'+ ignoreList[authorID].Name + ' :</a> ');
}



// поиск неполного совпадения внутри элементов, потребуется если надо найти в цитатах
function checkContains(elem, text) {
  var result = 0;
  elem.each(function () {
    if (~this.innerHTML.indexOf(text)) result++;
  });
  return result;
}

// поиск полного совпадения внутри элементов, потребуется если надо найти в обращениях к юзеру
function checkEquals(elem, text) {
  var result = 0;
  elem.each(function () {
    var i = $(this).html();
    if (i == text) result++;
  });
  return result;
}


// заменяем всякие разные символы на спецполседовательности
function spcharReplace (text) {
  text = text.replace(/&/g, '&amp;');
  text = text.replace(/\s/ig, '&nbsp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = text.replace(/"/g, '&quot;')
  return (text);
}
