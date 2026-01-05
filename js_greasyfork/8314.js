// ==UserScript==
// @description Заполняет вики-шаблон Cite web для текущей страницы.
// @exclude https://ru.wikipedia.org/*
// @exclude https://commons.wikimedia.org/*
// @exclude http://books.google.com/*
// @exclude http://books.google.ru/*
// @grant GM_xmlhttpRequest
// @icon http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-insert-link-icon.png
// @match http://*/*
// @match https://*/*
// @name vvCiteWeb
// @namespace https://ru.wikipedia.org/wiki/User:Neolexx
// @run-at document-end
// @version 2.0
// @downloadURL https://update.greasyfork.org/scripts/8314/vvCiteWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/8314/vvCiteWeb.meta.js
// ==/UserScript==
/*
 * "THE BEER-WARE LICENSE" (Revision 42):
 * Neolexx wrote this file. As long as you retain this notice you can do
 * whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.
 *
 * Icon by Oxygen Team, GNU LGPL https://www.gnu.org/licenses/lgpl.html
 */
 
 
 
'use strict';
void(function(){
if ( (typeof window != 'object') || (window.top != window.self) ) {return;}
if ( /wikipedia.org/.test(document.location.hostname) ) {return;}
 
 
 
var fontStyle = 'margin:4px;white-space:nowrap;font:normal normal normal 14px Arial,sans-serif;';
 
var voidValue = 'добавить';
 
var languageList = {
  'ru' : 'русский',
  'en' : 'английский',
  'be' : 'белорусский',
  'de' : 'немецкий',
  'uk' : 'украинский',
  'fr' : 'французский',
  'jp' : 'японский'
}
 
var publisherList = {
  'lenta.ru'        : 'Лента.Ру',
  'ria.ru'          : 'РИА Новости',
  'regnum.ru'       : 'ИА REGNUM',
  'rosbalt.ru'      : 'Росбалт',
  'km.ru'           : 'KM.RU',
  'cnn.com'         : 'CNN',
  'foxnews.com'     : 'FOX News',
  'bbc.com'         : 'BBC',
  'theguardian.com' : 'Guardian',
  'nytimes.com'     : 'New York Times',
  'wsj.com'         : 'Wall Street Journal'
}
 
var jsonData = null;
 
var isoDate, isoTimestamp, pageUrl = '';
 
var nodeText = ( 'innerText' in document.body )? 'innerText' : 'textContent';
 
var Container = document.createElement('DIV');
 
Container.style.position = 'fixed';
Container.style.zIndex   = '1001';
Container.style.left = '0';
Container.style.top  = '0';
Container.style.width  = '34px';
Container.style.height = '34px';
Container.style.margin = '0';
Container.style.padding  = '1px';
Container.style.overflow = 'hidden';
Container.style.backgroundColor  = '#FFFFFF';
Container.style.backgroundImage  =
  'url(http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-insert-link-icon.png)';
Container.style.backgroundRepeat = 'no-repeat';
Container.style.cursor = 'pointer';
 
document.body.appendChild(Container).addEventListener('click', vvCiteWeb, true, false);
 
 
 
function vvCiteWeb(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  Container.removeEventListener('click', vvCiteWeb, true);
 
  Container.style.width  = '300px';
  Container.style.height = 'auto';
  Container.style.border  = '1px solid silver';
  Container.style.margin  = '2px';
  Container.style.padding = '5px 10px';
  Container.style.overflowX = 'auto';
  Container.style.overflowY = 'visible';
  Container.style.backgroundImage  = 'none';
  Container.style.backgroundRepeat = 'initial';
  Container.style.cursor = 'auto';
 
  window.setTimeout(fillData, 1);
}
 
 
 
function fillData() {
  getDatePoint();
 
  pageUrl = getTemplateSafeString(document.location.href);
 
  Container.innerHTML = ''.concat(
    '<table border="0" cellspacing="0" cellpadding="0"><tbody>',
      getSelectableDataRow('vvLanguage', 'Язык', languageList, getSourceLanguage()),
      getStaticDataRow('vvArchive', 'Архивная копия', 'проверяется...'),
      getStaticDataRow('vvArchiveDate', 'Дата архивации:', 'проверяется...'),
      getEditableDataRow('vvPublisher', 'Издание / сайт', getSourcePublisher()),
      getEditableDataRow('vvTitle', 'Заглавие', getSourceTitle()),
      getEditableDataRow('vvAuthor', 'Автор(ы)', voidValue, 'Фамилия И. О. через запятую'),
      getEditableDataRow('vvDate', 'Дата публикации', voidValue, 'В формате ГГГГ-ММ-ДД'),
      getEditableDataRow('vvQuote', 'Цитата', voidValue, 'Краткая цитата без кавычек'),
    '</tbody></table>',
    '<p style="margin-top:5px;">',
    '<button style="width:90%;" type="button" id="vvGet1">Шаблон одной строкой</button></p>',
    '<p style="margin-top:5px;">',
    '<button style="width:90%;" type="button" id="vvGet2">Шаблон c pretty-print</button></p>'
  );
 
  window.setTimeout(checkArchiveCopy, 1);
}
 
 
 
function getDatePoint() {
  var now = new Date();
  var yyyy = now.getUTCFullYear();
  var m = now.getUTCMonth() + 1;
  var mm = m < 10 ? '0'+m : m;
  var d = now.getUTCDate();
  var dd = d < 10 ? '0'+d : d;
  var h = now.getUTCHours();
  var hh = h < 10 ? '0'+h : h;
  var n = now.getUTCMinutes();
  var mn = n < 10 ? '0'+n : n;
  var s = now.getUTCSeconds();
  var ss = s < 10 ? '0'+s : s;
  isoDate = ''.concat(yyyy, '-', mm, '-', dd);
  isoTimestamp = ''.concat(yyyy,mm,dd,hh,mn,ss);
}
 
 
 
function getSourceTitle() {
  var title;
  var header = _('H1');
  if ( header != null ) {
    title = getTemplateSafeString(header[nodeText].trim()) || '?';
  }
  else if ( !!document.title ) {
    title = document.title.trim() || '?';
  }
  else {
    title = '?';
  }
  return title;
}
 
 
 
function getSourceLanguage() {
  var l = _('HTML').getAttribute('lang') || _('HTML').getAttribute('xml:lang') || '';
  var lng;
  if ( !!l.length ) {
    lng = l.substr(0,2).toLowerCase();
  }
  else if ( !/[\u0400-\u04FF]/.test(getSourceTitle()) ) {
    lng = 'en'; // an educated guess...
  }
  else {
    lng = 'ru';
  }
  return lng;
}
 
 
 
function getSourcePublisher() {
  var domain = document.location.hostname.match(/\w+\.\w+$/);
  return (domain in publisherList)? publisherList[domain] : voidValue;
}
 
 
 
function getStaticDataRow(id, label, defaultValue) {
  return '<tr><td>'.concat(getLabel(label),
    '</td><td>', getKeyValueDivider(), '</td><td>',
    getStaticField(id, defaultValue),
    '</td></tr>'
  );
}
 
 
 
function getEditableDataRow(id, label, defaultValue, promptMessage) {
  return '<tr><td>'.concat(getLabel(label),
    '</td><td>', getKeyValueDivider(), '</td><td>',
    getEditableField(id, defaultValue, promptMessage||label),
    '</td></tr>'
  );
}
 
 
 
function getSelectableDataRow(id, label, values, def) {
  return '<tr><td>'.concat(getLabel(label),
    '</td><td>', getKeyValueDivider(), '</td><td>',
    getSelectableField(id, values, def),
    '</td></tr>'
  );
}
 
 
 
function getKeyValueDivider() {
  return '<var'.concat(' style="', fontStyle,
    'color:black;cursor:default;">=</var>'
  );
}
 
 
 
function getLabel(label) {
  return '<dfn'.concat(' style="', fontStyle,
    'color:black;cursor:default;">',
    label, '</dfn>'
  );
}
 
 
 
function getStaticField(id, defaultValue) {
  return '<var id="'.concat(id, '" style="', fontStyle,
    'color:black;cursor:default;">',
    defaultValue, '</var>'
  );
}
 
 
 
function getEditableField(id, defaultValue, promptMessage) {
  return '<var id="'.concat(id, '" style="',
    fontStyle, 'color:#0645AD;cursor:pointer;" ',
    'onmouseover="this.style.textDecoration=\'underline\';" ',
    'onmouseout="this.style.textDecoration=\'none\';" ',
    'onclick="',
    'var t = ( \'innerText\' in document.body )? \'innerText\' : \'textContent\';',
    'var txt = window.prompt(\'', extend_prompt(), '\',',
    'this[t]==\'', voidValue, '\'?\'\'\:this[t]);',
    'if ( !!txt && !!txt.trim() ) {this[t] = txt.trim();}">',
    defaultValue, '</var>'
  );
 
  function extend_prompt() {
    var w = 150;
    var len = promptMessage.length;
    if ( len >= w-2) {
      return promptMessage;
    }
    else {
      var ext = Math.round((w-len)/2);
      return (new Array(ext).join('\u00A0')).concat(
        promptMessage, (new Array(ext).join('\u00A0'))
      )
    }
  }
}
 
 
 
function getSelectableField(id, values, def) {
  var sel = '<select id="'.concat(id, '" style="', fontStyle, '">');
  for (var k in values) {
    sel+= '<option value="'.concat(
      k, '"', k==def?' selected>':'>', values[k], '</option>'
    );
  }
  return sel + '</select>';
}
 
 
 
function checkArchiveCopy() {
  if ( typeof GM_xmlhttpRequest == 'undefined' ) {
    alert('Вызовы между доменами запрещены.');
    return;
  }
 
  GM_xmlhttpRequest({
    method: 'GET',
    url   : 'https://archive.org/wayback/available?url='.concat(
      pageUrl, '&timestamp=', isoTimestamp
    ),
    onload: function(que) {
      jsonData = JSON.parse(que.responseText);
      if ( !!jsonData.archived_snapshots.closest ) {
        $('vvArchive').innerHTML = '<a href="'.concat(
          jsonData.archived_snapshots.closest.url,
          '" target="_blank" title="проверить" style="',
          fontStyle, 'color:#0645AD;text-decoration:underline;">',
          jsonData.archived_snapshots.closest.url, '</a>'
        );
        var s = jsonData.archived_snapshots.closest.timestamp;
        $('vvArchiveDate')[nodeText] = ''+s.substr(0,4)+'-'+s.substr(4,2)+'-'+s.substr(6,2);
      }
      else {
        $('vvArchive').innerHTML = '<var '.concat(
          'style="', fontStyle, 'color:black;cursor:default;">нет</var>\u00A0',
          '<a href="https://web.archive.org/save/', pageUrl,
          '" target="_blank" style="',
          fontStyle, 'color:#0645AD;text-decoration:underline;">',
          'создать вручную</a>'
        );
        $('vvArchiveDate')[nodeText] = 'нет';
      }
    }
  });
 
  $('vvGet1').onclick = getSingleLineSource;
 
  $('vvGet2').onclick = getPrettyPrintSource;
}
 
 
 
function getSingleLineSource() {
  var out = '{{cite web';
  out+=     '|url='+pageUrl+'\n';
  out+=     '|title='+$('vvTitle')[nodeText];
  if ( $('vvAuthor')[nodeText] != voidValue ) {
    out+=   '|author='+$('vvAuthor')[nodeText];
  }
  if ( $('vvQuote')[nodeText] != voidValue ) {
    out+=   '|quote'+$('vvQuote')[nodeText];
  }
  if ( $('vvDate')[nodeText] != voidValue ) {
    out+=   '|date='+$('vvDate')[nodeText];
  }
  if ( $('vvPublisher')[nodeText] != voidValue ) {
    out+=   '|publisher'+$('vvPublisher')[nodeText];
  }
  out+=     '|accessdate='+isoDate;
  if ( $('vvLanguage').options[$('vvLanguage').selectedIndex].value != 'ru' ) {
    out+=   '|language='+$('vvLanguage').options[$('vvLanguage').selectedIndex].value;
  }
  out+=     '|deadlink=';
  if ( $('vvArchiveDate')[nodeText] != 'нет' ) {
    out+=   '|archiveurl='+$('vvArchive')[nodeText];
    out+=   '|archivedate='+$('vvArchiveDate')[nodeText]+'\n';
  }
  out+= '}}';
  Container.innerHTML = '<form action="" onsubmit="return false">'.concat(
    '<textarea cols="32" rows="12" onclick="this.select();">',
    out, '</textarea></form>'
  );
}
 
 
 
function getPrettyPrintSource() {
  var out = '{{cite web\n';
  out+=     ' |url         = '+pageUrl+'\n';
  out+=     ' |title       = '+$('vvTitle')[nodeText]+'\n';
  if ( $('vvAuthor')[nodeText] != voidValue ) {
    out+=   ' |author      = '+$('vvAuthor')[nodeText]+'\n';
  }
  if ( $('vvQuote')[nodeText] != voidValue ) {
    out+=   ' |quote       = '+$('vvQuote')[nodeText]+'\n';
  }
  if ( $('vvDate')[nodeText] != voidValue ) {
    out+=   ' |date        = '+$('vvDate')[nodeText]+'\n';
  }
  if ( $('vvPublisher')[nodeText] != voidValue ) {
    out+=   ' |publisher   = '+$('vvPublisher')[nodeText]+'\n';
  }
  out+=     ' |accessdate  = '+isoDate+'\n';
  if ( $('vvLanguage').options[$('vvLanguage').selectedIndex].value != 'ru' ) {
    out+=   ' |language    = '+$('vvLanguage').options[$('vvLanguage').selectedIndex].value+'\n';
  }
  out+=     ' |deadlink    = \n';
  if ( $('vvArchiveDate')[nodeText] != 'нет' ) {
    out+=   ' |archiveurl  = '+$('vvArchive')[nodeText]+'\n';
    out+=   ' |archivedate = '+$('vvArchiveDate')[nodeText]+'\n';
  }
  out+= '}}';
  Container.innerHTML = '<form action="" onsubmit="return false">'.concat(
    '<textarea cols="32" rows="12" onclick="this.select();">',
    out, '</textarea></form>'
  );
}
 
 
 
function getTemplateSafeString(str) {
  return str.
  replace(/\n/g, ' ');
  replace(/\|/g, '%7C').
  replace(/\{/g, '%7B').
  replace(/\[/g, '%5B');
}
 
 
 
function _(tag) {
  try {
    return document.getElementsByTagName(tag)[0];
  }
  catch(e) {
    return null;
  }
}
 
 
 
function $(id) {
  return document.getElementById(id);
}
 
 
 
})()