// ==UserScript==
// @name        DailyWTF HTML comments shower
// @description Shows the HTML comments in the article body
// @include     https://thedailywtf.com/Articles/*
// @include     http://thedailywtf.com/Articles/*
// @version     1.4
// @namespace https://greasyfork.org/users/6282
// @downloadURL https://update.greasyfork.org/scripts/7713/DailyWTF%20HTML%20comments%20shower.user.js
// @updateURL https://update.greasyfork.org/scripts/7713/DailyWTF%20HTML%20comments%20shower.meta.js
// ==/UserScript==

// 1.1 @namespace   http://www.pathofexile.com/passive-skill-tree/
// 1.1 https://greasyfork.org/en/scripts/5238-dailywtf-html-comments-shower

// 1.0 http://thedailywtf.com/Articles/Connected-to-the-Connector-to-the-Connection-to-the-System.aspx

// 0.3 @namespace   niet.us
// 0.3 @Author Daan <daan@niet.us>
// 0.3 Cornify Highlights 
// 0.3 http://userscripts-mirror.org/scripts/show/142086

// Select main area
var b = document.querySelector('#articlePage,#article-page');

// Show comments in red
b.innerHTML=b.innerHTML.replace(/<!--/g,'<span style="color:red;">').replace(/-->/g,'</span>');

// Highlight cornification spans
var spans = b.getElementsByTagName('span');
if (spans.length > 0)
{
  for (var i = 0; i < spans.length; i++)
  {
    if (spans[i].title == 'click me!')
    {
      spans[i].style.color = '#FFFFFF';
      spans[i].style.backgroundColor = '#E01B6A';
      spans[i].style.outline = '1px dotted #E01B6A';
    }
  }
}