// ==UserScript==
// @name         Colourlovers to Imgur
// @namespace    https://github.com/phracker
// @version      0.2.16
// @description  Upload a colourlovers pattern tile to imgur
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
//
// @require      https://code.jquery.com/jquery-latest.min.js
//
// @include      http*://*colourlovers.com/pattern/*/*
// @downloadURL https://update.greasyfork.org/scripts/7703/Colourlovers%20to%20Imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/7703/Colourlovers%20to%20Imgur.meta.js
// ==/UserScript==

var pattern_panel = $("body > div.content > div > div.col-300 > div.sub-panel-dark")[0];
var pattern_panel_share = $("body > div.content > div > div.col-300 > div.sub-panel-dark > div.clear")[0];
var pattern_image_url = $("body > div.content > div > div.col-300 > div > div.wallpaper-links > a")[1].href;
var imgur_upload_url = 'https://imgur.com/upload?url=' + pattern_image_url;

function upload_image() {
  $.ajax({ 
    url: 'https://api.imgur.com/3/image',
    headers: {
        'Authorization': 'Client-ID cfaa3a5bd24320f'
    },
    type: 'POST',
    data: {
        'image': pattern_image_url
    },
    success: function(result) {
      var imgur_link = result.data.link.replace(/^http:/,'https:');
      $('body > div.content > div > div.col-300 > div > h5')[1].textContent = 'Imgur Link';
      $('body > div.content > div > div.col-300 > div > input')[0].value = imgur_link;
      GM_setClipboard(imgur_link);
    }
  });
};

function direct_clipboard() {
  GM_setClipboard(pattern_image_url);
}

var share_buttons = $('body > div.content > div > div.col-300 > div > a');
share_buttons[0].remove();
share_buttons[1].remove();
share_buttons[2].remove();
share_buttons[3].remove();

$('body > div.content > div > div.col-300 > div > h5.share-on')[0].textContent = "Imgur / URL";

$('body > div.content > div > div.col-300 > div > h5')[1].textContent = 'Direct Link';
$('body > div.content > div > div.col-300 > div > input')[0].value = pattern_image_url;

var upload_script = document.createElement('script');
upload_script.appendChild(document.createTextNode('(' + upload_image + ')();'));
(document.body || document.head || document.documentElement).appendChild(upload_script);

var clipboard_script = document.createElement('script');
clipboard_script.appendChild(document.createTextNode('(' + direct_clipboard + ')();'));
(document.body || document.head || document.documentElement).appendChild(clipboard_script);

var i = document.createElement('img');
i.src = 'https://i.imgur.com/n0Av9iq.png';

var a = document.createElement('a');
a.href = '#';
a.setAttribute('class','left mr-5');
a.setAttribute('title','Upload to imgur and copy link');
a.onclick = upload_image;
a.appendChild(i);

var i2 = document.createElement('img');
i2.src = 'https://i.imgur.com/UsJQDag.png';

var a2 = document.createElement('a');
a2.href = '#';
a2.setAttribute('class','left mr-5');
a2.setAttribute('title','Copy URL');
a2.onclick = direct_clipboard;
a2.appendChild(i2);

pattern_panel.insertBefore(a, pattern_panel_share);
pattern_panel.insertBefore(a2, pattern_panel_share);