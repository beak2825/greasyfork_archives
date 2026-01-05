// ==UserScript==
// @name        OKC Piclist
// @version     0.1.22
// @description Makes a list of photos.
// @namespace   https://github.com/phracker
// @require     https://code.jquery.com/jquery-latest.min.js
// @grant       none
// @include     http*://www.okcupid.com/profile/*photos*
// @include     http*://www.okcupid.com/profile/*pictures*
// @downloadURL https://update.greasyfork.org/scripts/7707/OKC%20Piclist.user.js
// @updateURL https://update.greasyfork.org/scripts/7707/OKC%20Piclist.meta.js
// ==/UserScript==

// var pic_list = document.createElement('textarea');
// pic_list.setAttribute('style','width: 1200px; height: 200px; display: block; margin: 1em auto;')
// pic_list.setAttribute('id','pic_list');

var img;
var src, newSrc, split, pic_list;
var username = $('#basic_info_sn')[0].textContent;

function listify() {
  pic_list = document.createElement('textarea');
  pic_list.setAttribute('style','width: 1200px; height: 200px; display: block; margin: 1em auto;');
  pic_list.id = 'pic_list';
  pic_list.textContent = 'mkdir ' + username + ' && cd ' + username + ' && wget'
  img = $('div[id^="album_"] > div[id^="photo_"] > div img');
  if (img.length > 0) {
    for(var n = 0; n < img.length; n++) {
      split=img[n].src.split("/");
      pic_list.textContent = pic_list.textContent + ' http://ak1.okccdn.com/php/load_okc_image.php/images/' + split[split.length-1].replace(/\?.*$/,'').replace(/\.webp$/,'.jpg');
    }
    pic_list.textContent = pic_list.textContent + ' && cd ..;';
    document.body.appendChild(pic_list);
  }
}

var listify_script = document.createElement('script');
// listify_script.appendChild(document.createTextNode('(' + listify + ')();'));
listify_script.appendChild(document.createTextNode( listify ));
(document.body || document.head || document.documentElement).appendChild(listify_script);

var b = document.createElement('button');
b.setAttribute('class','action flatbutton teal');
b.textContent = 'Listify!';
b.onclick = listify;

$('#user_pane > div.actions')[0].appendChild(b);