// ==UserScript==
// @name        Canonical links
// @author      Guillaume
// @description Remove URL redirections added by some social networks. Use HTTPS for other shorteners. Improve privacy. 
// @namespace   https://greasyfork.org/fr/users/11386-guillaume
// @include     https://twitter.com/*
// @include     https://identi.ca/*
// @include     https://microca.st/*
// @include     https://m.facebook.com/*
// @version     1.5
// @grant       none
// @run-at      document-start
// @license     CC by-sa http://creativecommons.org/licenses/by-sa/3.0/
// @downloadURL https://update.greasyfork.org/scripts/9871/Canonical%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/9871/Canonical%20links.meta.js
// ==/UserScript==

// Credits:
//
// - getVisibleText, textContentVisible:
//   This is derived from a work by Ethan Brown.
//   Original license: cc-by sa
//   Source: http://stackoverflow.com/questions/19985306/get-the-innertext-of-an-element-but-exclude-hidden-children

function getVisibleText( node )
{
  if ( node.nodeType === 1 ) // Element
  {
    var rect = node.getBoundingClientRect();
    if ( rect.width === 0 || rect.height === 0 )
      return '';
  }
  else if ( node.nodeType === 3 ) // Text
  {
    return node.textContent;
  }
  var text = '';
  for( var i = 0; i < node.childNodes.length; i++ ) 
    text += getVisibleText( node.childNodes[i] );
  return text;
}

if ( ! Node.prototype.hasOwnProperty('textContentVisible') )
{
  Object.defineProperty(Node.prototype, 'textContentVisible', {
      get: function() { 
         return getVisibleText( this );
      }, 
      enumerable: true
  });
}

if ( ! HTMLAnchorElement.prototype.hasOwnProperty('getSearchParam') )
{
  Object.defineProperty(HTMLAnchorElement.prototype, 'getSearchParam', {
    get: function()
    {
      var a = this;
      return function(b)
      {
        var res = a.search.match('[\?&]' + b + '=([^=]*)(?:&[^;=]*=|$)') || [];
        return res[1];
      }
    },
    enumerable: true
  });
}

var hostRules = {};

var applyHostRules = function(el)
{
  // normalize host
  el.host = el.host;
  
  var i = 0;
  var limit = 3;
  while ( hostRules[el.hostname] && i < limit )
  {
    var urlFactory = hostRules[el.hostname];
    el = urlFactory(el);
    i++;
  }
}

hostRules['youtu.be'] = function(el)
{
  el.href = 'https://www.youtube.com/watch?v=' + el.pathname.substr(1);
  return el;
};
hostRules['lm.facebook.com']
 = hostRules['m.facebook.com']
 = function(el)
{
  var uParam = el.getSearchParam('u');
  if ( el.pathname == '/l.php' && uParam !== undefined )
  {
    el.href = unescape(uParam);
  }
  return el;
};

var makeLinkHTTPS = function(el)
{
  if ( el.protocol == 'http:' )
    el.protocol = 'https:';
  
  return el;
}

hostRules = [
  'ask.fm', 'awe.sm', 'bit.ly', 'bc.vc',
  'd.pr', 'db.tt', 'dlvr.it',
  'fb.me',
  'goo.gl', 'grnpc.org',
  'identi.ca', 'is.gd', 'j.mp',
  'lnkd.in', 't.co',
  'tinyurl.com', 'tr.im',
  'v.gd', 'vur.me',
  'wp.me', 'x.co'
].reduce(function(o, a) { o[a] = makeLinkHTTPS; return o; }, hostRules);

var makeLinkExpanded = function(el)
{
  var textNode = document.createTextNode(el.textContentVisible);
  var url = el.dataset.expandedUrl;
  
  var newLink = document.createElement('a');
  newLink.href = url;
  newLink.title = el.title;
  newLink.className = el.className;
  newLink.dir = el.dir;
  newLink.appendChild(textNode);
  
  el.parentNode.replaceChild(newLink, el);
};

var makeLinkFromTitle = function(el)
{
  var url = el.title;
  var text = el.textContentVisible;
  if ( text.indexOf('http:') === 0 || text.indexOf('https:') )
    text = url;
  var textNode = document.createTextNode(text);
  
  var newLink = document.createElement('a');
  newLink.href = url;
  newLink.title = el.title;
  newLink.className = el.className;
  newLink.dir = el.dir;
  newLink.appendChild(textNode);
  
  el.parentNode.replaceChild(newLink, el);
};

var onLink = function(el)
{
  var updateText = false;
  if ( el.childNodes.length == 1
      && el.childNodes[0].nodeType === 3
      && el.childNodes[0].textContent == el.href )
    updateText = true;
  
  applyHostRules(el);
  
  // disable referers
  el.rel = 'noreferrer';
  
  if ( updateText )
  {
    var textNode = document.createTextNode(el.href);
    el.replaceChild(textNode, el.childNodes[0]);
  }
  
}

var onTwitterLink = function(el)
{
  makeLinkExpanded(el);
}

var onPumpIOLink = function(el)
{
  makeLinkFromTitle(el);
}

window.addEventListener("load", function(ev) {
  // unshadow for better debugging
  delete console.log;
  
  // initial pass
  if ( window.Pump )
    [].slice.call(document.querySelectorAll('a[title^=http]')).forEach(onPumpIOLink);
  [].slice.call(document.querySelectorAll('a[data-expanded-url]')).forEach(onTwitterLink);
  [].slice.call(document.querySelectorAll('a[href]')).forEach(onLink);
  
  // watch changes
  var observer = new MutationObserver(function(mutations)
  {
    mutations.forEach(function(mutation)
    {
      for ( var i = 0; i < mutation.addedNodes.length; i++ )
      {
        var node = mutation.addedNodes[i];
        if ( node.querySelectorAll )
        {
          [].slice.call(node.querySelectorAll('a[data-expanded-url]')).forEach(onTwitterLink);
          [].slice.call(node.querySelectorAll('a[href]')).forEach(onLink);
        }
      }
    });    
  });

  var config = { childList: true, subtree: true };
  observer.observe(document, config);
  
}, true);