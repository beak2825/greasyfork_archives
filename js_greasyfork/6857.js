// ==UserScript==
// @name        ExpandQuotes
// @namespace   forum.pravda.com.ua
// @description Expand structured quotes into old-fashioned unstructured ones
// @include     http://forum.pravda.com.ua/index.php?topic=*
// @version     1.27
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6857/ExpandQuotes.user.js
// @updateURL https://update.greasyfork.org/scripts/6857/ExpandQuotes.meta.js
// ==/UserScript==
var divs = document
  .getElementById('phorum')
  .getElementsByTagName('div');

for (var i = 0; i < divs.length; i++) {
  var div = divs[i];
  if (div.className == 'msg') {
    expandQuotes(div, 115);
  }
}

function expandQuotes(element, wrapLimit) {
  var node = element.firstChild;
  while (node) {
    var next = node.nextSibling;

    if (node.className == 'quoteheader') {
      var quoteheader = node;

      do {
        node = node.nextSibling;
      }
      while (node.nodeName.toLowerCase() != 'blockquote');
      var blockquote = node;

      do {
        node = node.nextSibling;
      }
      while (node.className != 'quotefooter');
      var quotefooter = node;

      node = node.nextSibling;

      element.removeChild(quoteheader);
      element.removeChild(blockquote);
      element.removeChild(quotefooter);

      var who_node = quoteheader.getElementsByTagName('b');
      var who = (who_node.length === 1) ? who_node[0].innerHTML : '';

      var what = expandQuotes(blockquote, wrapLimit - 5);

      var div = document.createElement('div');
      div.innerHTML = who + ' Написав:<br>-------------------------------------------------------<br>' + what;

      var innerNode = div.firstChild;
      while (innerNode) {
        next = innerNode.nextSibling;
        div.removeChild(innerNode);
        element.insertBefore(innerNode, node);
        innerNode = next;
      }

      next = node.nextSibling;
    }
    else if (node.className == 'link') {
      // Check if 'expand quotes' link is here
      element.removeChild(node);
    }
    else if (node.nodeName.toLowerCase() == 'i') {
      // Check if 'show images' link is here
      var spans = node.getElementsByTagName('span');
      for (var i = 0; i < spans.length; i++) {
        if (spans[i].className == 'link') {
          element.removeChild(node);
          break;
        }
      }
    }
    node = next;
  }

  var elementHTML = element.innerHTML;

  if (element.className != 'msg') {
    elementHTML = quoteHtml(elementHTML, wrapLimit) + '\n';
    elementHTML = elementHTML.replace(/\n/g, '<br>');
  }

  return elementHTML;
}

function quoteHtml(htmlText, limit) {
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