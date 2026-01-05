// ==UserScript==
// @name        Tumblr. quiet your post
// @namespace   http://www.sharkpp.net/
// @version     0.5
// @description  Quiet the post with 'is_mine' or 'is_you' tag for tumblr dashboard
// @author      sharkpp
// @copyright   2014-2015, sharkpp
// @license     MIT License
// @include     https://www.tumblr.com/dashboard*
// @downloadURL https://update.greasyfork.org/scripts/6721/Tumblr%20quiet%20your%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/6721/Tumblr%20quiet%20your%20post.meta.js
// ==/UserScript==
(function () {
  // from http://ash.jp/web/css/js_style.htm
  var addStyleRule = function(selector, declaration) {
      var isMSIE = /*@cc_on!@*/false;
      var sheet;
      if (document.styleSheets.length) {
        sheet = document.styleSheets[document.styleSheets.length - 1];
      } else {  // StyleSheetがない場合、StyleSheetを作成
        if (isMSIE) {  // for IE8, Sleipnir
          sheet = document.createStyleSheet();
        } else {  // for FireFox, Opera, Safari, Crome
          var head = document.getElementsByTagName('head')[0];
          if (head === null) { return; }
          var style = document.createElement('style');
          head.appendChild(style);
          sheet = style.sheet;
        }
      }
      if (isMSIE) {  // for IE8, Sleipnir
        sheet.addRule(selector, declaration);
      } else {  // for FireFox, Opera, Safari, Crome
        sheet.insertRule(selector + '{' + declaration + '}', sheet.cssRules.length);
      }
  };
  //------------------------------------------
  // apply custom style sheet
  //------------------------------------------
  var BGn = '#36465d';
  var BGh  = '#3c4b61';
  var H = '32px';
  // varriable define for LINE COMPACTION ...
  var eI = ' !important';
  var pc = 'li[class="post_container"]';
  var is_mine = 'div[class*="is_mine"]';
  var is_you  = 'div[data-json*=\'"is_you":true\']';
  var post_c  = 'div[class*="post_content"]';
  var post_f  = 'div[class*="post_footer"]';
  var post_a  = 'div[class*="post_avatar"]';
  var post_i  = 'div[class*="post_info"]';
  var post_s  = 'div[class*="post_source"]';
  // ... end
  var cssList = [
      [ pc+' > '+is_mine,                              'background-color: '+BGn+eI+'; height: 32px'+eI+';' ],
      [ pc+':hover > '+is_mine,                        'background-color: '+BGh+eI+'; height: 32px'+eI+';' ],
      [ pc+' > '+is_you+' '+is_mine,                   'left: 7px'+eI+'; width: 32px'+eI+'; height: 32px'+eI+';' ],
      [ pc+':hover > '+is_mine+' '+post_a,             'background-color: '+BGh+eI+';' ],
      [ pc+':hover > '+is_mine+' '+post_a+'> a',       'background-color: '+BGh+eI+';' ],
      [ pc+' > '+is_mine+' '+post_i,                   'margin-left: 30px'+eI+'; margin-top: 0px'+eI+'; vertical-align: top'+eI+';' ],
      [ pc+' > '+is_mine+' div[class*="post_header"]', 'line-height: 20px'+eI+'; height: 20px'+eI+';' ],
      [ pc+' > '+is_mine+' '+post_c,                   'display: none;' ],
      [ pc+' > '+is_mine+' '+post_f,                   'display: none;' ],
      [ pc+' > '+is_you,                               'background-color: '+BGn+eI+'; height: 32px'+eI+';' ],
      [ pc+':hover > '+is_you,                         'background-color: '+BGh+eI+'; height: 32px'+eI+';' ],
      [ pc+' > '+is_you+' '+post_a,                    'left: 7px'+eI+'; width: 32px'+eI+'; height: 32px'+eI+';' ],
      [ pc+':hover > '+is_you+' '+post_a,              'background-color: '+BGh+eI+';' ],
      [ pc+':hover > '+is_you+' '+post_a+'> a',        'background-color: '+BGh+eI+';' ],
      [ pc+' > '+is_you+' '+post_i,                    'margin-left: 30px'+eI+'; margin-top: 0px'+eI+'; vertical-align: top'+eI+';' ],
      [ pc+' > '+is_you+' div[class*="post_header"]',  'line-height: 20px'+eI+'; height: 20px'+eI+';' ],
      [ pc+' > '+is_you+' '+post_c,                    'display: none;' ],
      [ pc+' > '+is_you+' '+post_f,                    'display: none;' ],
      null
    ];
  for (var i = 0, css; css = cssList[i]; i++) {
    addStyleRule(css[0], css[1]);
  }

  //------------------------------------------
  // remove pageable attr, when dom changed
  //------------------------------------------
      pc = 'li[@class="post_container"][@data-pageable]';
  var xpath_of_is_mmine_or_is_you_post
      = '//'+pc+'/div[contains(concat(" ",normalize-space(@class)," ")," is_mine ")]|' +
        '//'+pc+'/div[contains(@data-json,\'"is_you":true\')]';
  function update_of_is_mmine_or_is_you_post(objects, sender) {
    var post_of_is_mmine_or_is_you
        = document.evaluate(xpath_of_is_mmine_or_is_you_post, document,
                            null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, item; item = post_of_is_mmine_or_is_you.snapshotItem(i); i++) {
      item.parentNode.removeAttribute('data-pageable');
    }
  }
  var posts = document.getElementById('posts');
  if (posts) {
    var mo = new MutationObserver(update_of_is_mmine_or_is_you_post);
        mo.observe(posts, { childList: true });
    update_of_is_mmine_or_is_you_post(null, null);
  }
})();
