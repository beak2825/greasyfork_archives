// ==UserScript==
// @name           Reddit - side-by-side editor and RES preview
// @description    Show the edit box and preview next to each other when writing comments if you have RES installed
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @match          *://*.reddit.com/r/*/comments/*
// @match          *://*.reddit.com/comments/*
// @match          *://*.reddit.com/message/*
// @version        0.1.0
// @grant          none
// @require        https://greasyfork.org/scripts/7602-mutation-observer/code/mutation-observer.js
// @downloadURL https://update.greasyfork.org/scripts/9078/Reddit%20-%20side-by-side%20editor%20and%20RES%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/9078/Reddit%20-%20side-by-side%20editor%20and%20RES%20preview.meta.js
// ==/UserScript==


jQuery.fn.contentExpand = (function() {
  let $hidden = jQuery('<div>')
    .css({
      display: 'none',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'hidden'
    })
    .appendTo('body');

  return function() {
    return this.each(function() {
      let $ta = jQuery(this).css({
        overflow: 'hidden',
        resize: 'none'
      });
      
      $ta.on('keyup', ev => {
        let content = $ta.val().replace(/\n/g, '<br>') + '<br style="line-height: 3px">';
        
        $hidden
          .css({
            width: $ta.width(),
            minHeight: $ta.css('min-height'),
            font: $ta.css('font'),
            lineHeight: $ta.css('line-height')
          })
          .html(content);
          
        $ta.css('height', $hidden.height());
      });
    });
  }
})();


var observer = new MutationSummary({
  callback: function(summaries) {
    //console.info('Added %d forms', summaries[0].added.length);
    
    try {
      jQuery(summaries[0].added).each(function() {
        var $form = jQuery(this),
          $editWrapper = $form.children('.usertext-edit'),
          $mdWrapper = $editWrapper.children('.markdownEditor-wrapper'),
          $edit = $editWrapper.children('.md'),
          $res = $form.find('.livePreview');
          
        //console.log($form[0].outerHTML);
        //console.info($mdWrapper);
        //console.info($edit);
        //console.info($res);
        
        $editWrapper.css({
          width: '100%',
          padding: '0px',
          marginLeft: '15px'
        });
        
        $res.css({
          margin: '0 15px 15px'
        });

        // Move RES editor next to textarea, wrap each in divs for positioning
        $edit
          .css({
            maxWidth: '100%',
            width: '100%',
            clear: 'both'
          })
            .append($res)
            .children()
              .first()
                .css({
                  width: '100%'
                })
                .contentExpand()
                .wrap('<div style="float: left; width: 50%;">')
                .end()
              .last()
                .wrap('<div style="display: inline-block; width: 50%;">');


        // Wrap toolbar, extras in divs for positioning side-by-side
        $mdWrapper
          .css({
            maxWidth: '100%',
            width: '100%',
            clear: 'both'
          })
            .children()
              .slice(1)
                .wrapAll('<div style="display: inline-block; width: 50%;">')
                .end()
              .first()
                .wrap('<div style="float: left; width: 50%;">');


        // Swap macro dropdown and name around, float left and right respectively
        let $commentAs = $mdWrapper.find('.commentingAs'),
          $macro = $commentAs.next();
          
        $macro
          .css({
            'float': 'left',
            margin: '0 0 0 15px'
          });
          
        $commentAs
          .css({
            'float': 'right',
            clear: 'none',
            margin: '0 15px 0 0'
          })
          .insertAfter($macro);
      });
    }
    catch (ex) {
      console.error(ex);
    }
  },
  rootNode: document.body,
  queries: [
    { element: 'form.usertext' }
  ]
});
