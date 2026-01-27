// ==UserScript==
// @name        Basic Gallery No Crap - Old Reddit old.reddit.com
// @namespace   MMM Scripts
// @match       https://old.reddit.com/r/*/comments/*
// @grant       none
// @version     1.0
// @author      mmm
// @license     mit
// @description This removes the gallery that is already on the page and makes a simpler, new one
// @require     https://code.jquery.com/jquery-4.0.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/564183/Basic%20Gallery%20No%20Crap%20-%20Old%20Reddit%20oldredditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/564183/Basic%20Gallery%20No%20Crap%20-%20Old%20Reddit%20oldredditcom.meta.js
// ==/UserScript==

const RdDirUrlPreamble = 'https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2F';
let NewGalBuilder = '<div id="newGal" style="text-align: center;margin-top: 57px;">';

$('div.media-preview-content.gallery-tile-content > img.preview').each(function(){
  //use the below around each
  //.wrap()
  //This will wrap everything inside
  //.wrapInner()
  let RdImSrcUrl = new URL($(this).attr('src'));
  //console.log('Hewwo URL is: '+RdImSrcUrl.pathname);
  let RdImFileNameExt = RdImSrcUrl.pathname.split('/').slice(-1)[0];
  //console.log('Hewwo File Name with Extension is: '+RdImFileNameExt);
  let RdImDirUrl = RdDirUrlPreamble+RdImFileNameExt;
  console.log('Hewwo Link is: '+RdImDirUrl);
  let RdImPre = '<a href="'+RdImDirUrl+'" target="_blank" style="margin:2px 2px;">';
  //console.log('Hewwo HTML is: '+RdImHtmlWrp);
  let RdImHtml = $(this).parent().html();
  console.log('Hewwo HTML is:'+RdImHtml);
  let RdImLnkd = RdImPre+RdImHtml+'</a>';
  console.log('Hewwo wrapping is done!');
  NewGalBuilder += RdImLnkd;
  console.log('Hewwo current building is: '+NewGalBuilder);
});

const NewGal = NewGalBuilder+'</div>';

$('div#siteTable').before(NewGal).remove ();
/*
THERE IS PROBABLY SOMETHING CLEVER TO BE DONE WITH THE ARRAY OF DATA MEDIA IDS AVAILABLE, HERE, BUT I AM DUMB:

$('div.media-preview[id^="media-preview-"][data-media-ids]').attr('data-media-ids').split(',').each();
//data-media-ids="khgfdifg9854,984365orgfldkf,oirute98tr705"

might need this require in the header to do it:
//https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
*/