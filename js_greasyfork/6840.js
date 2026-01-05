// ==UserScript==
// @name        SimpleQuotes
// @namespace   forum.pravda.com.ua
// @description Provides ability of original 'oldschool' quotation
// @include     http://forum.pravda.com.ua/index.php?topic=*
// @version     1.27
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6840/SimpleQuotes.user.js
// @updateURL https://update.greasyfork.org/scripts/6840/SimpleQuotes.meta.js
// ==/UserScript==
function replaceQuotes() {
  var textarea = document.getElementById('body');
  var links = document
    .getElementById('phorum')
    .getElementsByTagName('a');

  for (var i = 0; i < links.length; i++) {
    var target = links[i];
    var onClick = target.getAttribute('onclick');

    if (onClick && onClick.indexOf('doQuote') == 0) {
      var quoteLink = target;

      while (target && target.className != 'message') {
        target = target.parentNode;
      }

      if (target) {
        quoteLink.href = '#quickreply';
        quoteLink.onclick = function (message, editor) {
          return function () {
            quoteMessage(message, editor);
            return true;
          }
        }(target, textarea);
      }
    }
  }
}

function quoteMessage(message, editor) {
  var who = '';
  var what = '';
  var nodes = message.getElementsByTagName('div');
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].className == 'message-author icon-user') {
      who = nodes[i].firstElementChild.innerHTML;
    }
    else if (nodes[i].className == 'msg') {
      var body = nodes[i].cloneNode(true);
      var node = body.firstChild;
      while (node) {
        var next = node.nextSibling;
        if (node.nodeType == 1) {
          if (node.className == 'quoteheader'
            || node.className == 'bbc_standard_quote'
            || node.className == 'quotefooter'
            || node.className == 'signature') {
            body.removeChild(node);
          }
        }
        node = next;
      }
      what = body.innerHTML;
    }
  }

  editor.value = who + ' Написав:\n-------------------------------------------------------\n' + quoteHtml(what) + '\n';
  setTimeout(function (editor) {
    return function () {
      editor.focus();
    }
  }(editor), 200);
}

function quoteHtml(htmlText) {
  var limit = 115;
  var text = '> ' + htmlText.trim()
    .replace(/&gt;/g, '>')
    .replace(/\s{2,}/g, ' ')
    .replace(/\r?\n|\r/g, '')
    .replace(/<br\s*[\/]?>\s*/gi, '\n> ')
    .replace(/(<([^>]+)>)/ig, '')
    .replace(/&nbsp;/ig, String.fromCharCode(160));

  var lines = text.split(/\r\n|\n|\r/);
  if (lines.length > 0 && lines[0] == '> ') {
    lines.splice(0, 1);
  }

  for (i = 0; i < lines.length; i++) {
    var j;
    var line = lines[i];
    lines[i] = '';
    while (line.length > limit) {
      j = (j = line.slice(0, limit + 1)
        .match(/\S*(\s)?$/))[1] ? limit : j.input.length - j[0].length || limit || j.input.length + (j = line.slice(limit)
        .match(/^\S*/))[0].length;
      lines[i] += line.slice(0, j) + ((line = line.slice(j)).length ? '\n> ' : '');
    }
    lines[i] += line;
  }
  return lines.join('\n');
}

replaceQuotes();