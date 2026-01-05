// ==UserScript==
// @name         2ch code preview
// @author       7sIV799F
// @version      0.4.0
// @include      /https:\/\/2ch\.(hk|pm|re|tf|wj)/
// @include      http://2-ch.so
// @grant        none
// @description  Add code preview to 2ch.hk
// @namespace https://greasyfork.org/users/10379
// @downloadURL https://update.greasyfork.org/scripts/9147/2ch%20code%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/9147/2ch%20code%20preview.meta.js
// ==/UserScript==

$(function() {
  $('<button>', {
    text: 'code',
    click: function() {
      var ta    = $('#shampoo')[0],
          start = ta.selectionStart,
          end   = ta.selectionEnd;

      ta.value =
        ta.value.slice(0, start) +
        '[code]\n' +
        ta.value.slice(start, end)
          // replace * with look like * symbol
          .replace(/\*/g, '٭')
          // add zero-width space to BB-code
          .replace(/\[([bius])\]/g, '[​$1]')
          .replace(/\t/g, '  ')
          // replace space with non-break space
          .replace(/ /g, ' ') +
        '\n[/code]' +
        ta.value.slice(end)
      ;

      return false;
    }
  }).appendTo('.symbol-counter');

  getIframe();

  $('.posts').bind('DOMSubtreeModified', getIframe);
});

function getIframe() {
  var re = new RegExp(
    '(pastebin\\.com|ideone\\.com|jsfiddle\\.net|codepen\\.io)\/' +
    '(\\w+\/pen\/)?' +       // http://codepen.io/(username/pen/)id
    '(\\w+\/)?' +            // http://jsfiddle.net/(username/)id
    '(\\w+)\/?$'             // id
  );

  $('a[href^="http"')
    .filter(function() {
      return !$(this).hasClass('code-embedded') && re.test(this.href);
    })
    .addClass('code-embedded')
    .after(' <button class="embed-code">view code</button>')
    .next('button.embed-code')
      .click(function() {
        var $this = $(this),
            match = $this.prev().attr('href').match(re);

        if (!match) return;

        var host = match[1],
            id   = match[4],
            src  = {
              'pastebin.com': '//pastebin.com/embed_iframe.php?i=' + id,
              'ideone.com'  : '//ideone.com/embed/' + id,
              'jsfiddle.net': '//jsfiddle.net/' + id + '/embedded/',
              'codepen.io'  : '//codepen.io/anon/embed/' + id + '/?height=500'
            };

        $('<div>', {
          class: 'code-embedded',
          html: $('<iframe>', {
            src  : src[host],
            style: 'border:none; width:800px; height:500px'
          })
        }).insertAfter($this);

        $this.remove();
      })
  ;

  $('.post-message:contains("[code"):not(.compiled)')
    .addClass('compiled')
    .html(function(_i, html) {
      return html
        .replace(/\[code[^\]]*\]/g, '<pre class="code">')
        .replace(/<br>/g, '\n')
        .replace(/(<\/?em>|٭)/g, '*')
        .replace(/\t/g, '  ')
        .replace(/\[\/code\]/g, '</pre>')
      ;
    });
}