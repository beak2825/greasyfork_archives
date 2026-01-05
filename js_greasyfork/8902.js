// ==UserScript==
// @name         Scratch Forums Composer Swag
// @namespace    http://aputurk.tk/
// @version      0.2.2
// @description  Adds more posting tools to the Scratch forums composer
// @author       MegaApuTurkUltra
// @include      http://scratch.mit.edu/discuss*
// @include      https://scratch.mit.edu/discuss*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8902/Scratch%20Forums%20Composer%20Swag.user.js
// @updateURL https://update.greasyfork.org/scripts/8902/Scratch%20Forums%20Composer%20Swag.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var startScript = function () {
  // buttons for google, wikipedia, and wiki
  $('<li class="markItUpButton markItUpButtonSwag10 "><a href="" title="Google link">Google link</a></li>').insertAfter('.markItUpButton6').find('a').css('background-image', 'url(http://i.cubeupload.com/zBWOi5.png)').click(function (e) {
    var term = prompt('Enter a search term');
    if (term === null || term === '') {
      e.preventDefault();
      return false;
    }
    $('#id_body').replaceSel('[google]' + term + '[/google]');
    e.preventDefault();
    return false;
  });
    $('<li class="markItUpButton markItUpButtonSwag11 "><a href="" title="Scratch wiki link">Scratch wiki link</a></li>').insertAfter('.markItUpButtonSwag10').find('a').css('background-image', 'url(http://i.cubeupload.com/sxxPE3.png)').click(function (e) {
    var term = prompt('Enter an article');
    if (term === null || term === '') {
      e.preventDefault();
      return false;
    }
    $('#id_body').replaceSel('[wiki]' + term + '[/wiki]');
    e.preventDefault();
    return false;
  });
    $('<li class="markItUpButton markItUpButtonSwag12 "><a href="" title="Wikipedia article">Wikipedia article</a></li>').insertAfter('.markItUpButtonSwag11').find('a').css('background-image', 'url(http://i.cubeupload.com/2Jwmpr.png)').click(function (e) {
    var term = prompt('Enter an article');
    if (term === null || term === '') {
      e.preventDefault();
      return false;
    }
    $('#id_body').replaceSel('[wp]' + term + '[/wp]');
    e.preventDefault();
    return false;
  });
  // buttons for color, center, and code
  $('<li class="markItUpButton markItUpButtonSwag1 "><a href="" title="Color">Color</a></li>').insertAfter('.markItUpButton7').find('a').css('background-image', 'url(http://i.cubeupload.com/PsGwu4.png)').click(function (e) {
    var color = prompt('Enter a hex color, rgb(a) color, or CSS color name');
    if (color === null || color === '') {
      e.preventDefault();
      return false;
    }
    $('#id_body').replaceSel('[color=' + color + ']' + $('#id_body').getSel() + '[/color]');
    e.preventDefault();
    return false;
  });
  $('<li class="markItUpButton markItUpButtonSwag3 "><a href="" title="Center">Center</a></li>').insertAfter('.markItUpButtonSwag1').find('a').css('background-image', 'url(http://i.cubeupload.com/tfrXFd.png)').click(function (e) {
    $('#id_body').replaceSel('[center]' + $('#id_body').getSel() + '[/center]');
    e.preventDefault();
    return false;
  });
  $('<li class="markItUpButton markItUpButtonSwag3 "><a href="" title="Code">Code</a></li>').insertAfter('.markItUpButton14').find('a').css('background-image', 'url(http://i.cubeupload.com/XqOaKz.png)').click(function (e) {
    var code = prompt('Enter a language');
    if (code === null || code === '') {
      e.preventDefault();
      return false;
    }
    $('#id_body').replaceSel('[code=' + code + ']\n' + $('#id_body').getSel() + '\n[/code]');
    e.preventDefault();
    return false;
  });
  // and now for the swaggy sticky quoter
  var currentStickyTitle = '';
  var currentStickyLink = '';
  var onSelectionPage = false;
  var cannedDlg = $('<div id=\'canned-dlg\' title=\'Insert Canned Quote\'>Loading...<br/><div id=\'canned-progress\'></div></div>').dialog({
    autoOpen: false,
    buttons: {
      'Cancel': function () {
        $(this).dialog('close');
      }
    },
    width: 500,
    height: 500,
    show: 'fade',
    hide: 'fade',
    dialogClass: 'jqui-modal canned-dlg'
  });
  var menu;
  var select = $('<div id=\'canned-page2\'><p>Select the part of the post you want, then click OK</p><textarea id=\'canned-select\'>Loading...</textarea><br/><button id=\'canned-ok\'>Use selection</button></div>'
  );
  var ajaxLoading = false;
  function loadAjax() {
    if (ajaxLoading) return;
    ajaxLoading = true;
    $.get('/discuss/', {
      dataType: 'html'
    }, function (data) {
      menu = $('<ul id=\'canned-menu\'></ul>');
      $(data).find('.tclcon a').each(function () {
        menu.append($('<li></li>').addClass('canned-menu-item').attr('data-link', $(this).attr('href')).append($('<button></button').text($(this).text()).addClass('canned-menu-button canned-primary')));
      });
      var completeXHRs = 0;
      var totalXHRs = menu.find('li').length;
      var complete = function () {
        completeXHRs++;
        $('#canned-progress').progressbar({
          value: Math.round(100 * completeXHRs / totalXHRs)
        });
        if (completeXHRs >= totalXHRs) {
          $('#canned-dlg').html('');
          $('#canned-dlg').append(menu);
          cannedDlg.append(select);
          $('#canned-select').css({
            'width': '100%'
          }).attr('rows', '10');
          $('#canned-ok').click(function (e) {
            var sel = $('#canned-select').getSel();
            console.log(sel);
            if (sel === null || sel === '') return;
            $('#id_body').replaceSel('[quote]\n[b]As stated on the sticky [url=https://scratch.mit.edu' + currentStickyLink + ']'
            + currentStickyTitle.replace('(New Posts)', '') + '[/url]:[/b]\n\n' + sel + '\n[/quote]');
            cannedDlg.dialog('close');
            e.preventDefault();
            return false;
          });
          select.hide();
          $('.canned-menu-button').button().css('width', '100%');
          $('.canned-menu-button.canned-primary').click(function () {
            $(this).parent().find('.canned-submenu').slideToggle();
            cannedDlg.dialog({
              title: 'Select a sticky topic'
            });
          });
          $('.canned-menu-button.canned-secondary').click(function () {
            cannedDlg.dialog({
              title: 'Select the part of the sticky you want'
            });
            $('#canned-select').val('Loading...');
            var url = $(this).parent().attr('data-sticky-link');
            currentStickyTitle = $(this).parent().attr('data-sticky-title');
            currentStickyLink = $(this).parent().attr('data-sticky-link');
            menu.fadeOut(700, function () {
              select.fadeIn();
            });
            onSelectPage = true;
            $.get(url, {
              dataType: 'html'
            }, function (data3) {
              var source = $(data3).find('.firstpost').eq(0).find('.conr').next().attr('href');
              $.get(source + 'source/', function (data4) {
                $('#canned-select').val(data4);
              });
            });
          });
          $('.canned-submenu').hide();
          menu.css('list-style-type', 'none');
          $('.canned-submenu').css('list-style-type', 'none');
        }
      };
      menu.find('li').each(function () {
        var thisLi = $(this);
        $.get($(this).attr('data-link'), {
          dataType: 'html'
        }, function (data2) {
          var submenu = $('<ul class=\'canned-submenu\'></ul');
          $(data2).find('.isticky').each(function () {
            var a = $(this).next().find('a');
            submenu.append($('<li></li>').addClass('canned-menu-item').attr('data-sticky-link', a.attr('href')).attr('data-sticky-title', a.text()).append($('<button></button').text(a.text()).addClass('canned-menu-button canned-secondary')));
          });
          thisLi.append(submenu);
        }).always(function () {
          complete();
        });
      });
    });
  }
  $('.canned-dlg button.ui-dialog-titlebar-close').hide();
  $('<li class="markItUpButton markItUpButtonSwag2 "><a href="" title="Canned quotes">Canned quotes</a></li>').insertAfter('.markItUpButton11').find('a').css('background-image', 'url(http://i.cubeupload.com/l6I5Sk.png)').click(function (e) {
    loadAjax();
    cannedDlg.dialog({
      title: 'Select a forum section to find stickies in'
    }).dialog('open');
    if (typeof menu !== 'undefined') menu.show();
    select.hide();
    onSelectPage = false;
    e.preventDefault();
    return false;
  });
  var draftStatus = $('<span></span>').css({'display':'inline-block','width':'150px','height':'1.4em','overflow':'hidden'});
  var currentSessionRnd = Math.round(Math.random() * 1000000000);
  $('<li class="markItUpButton markItUpButtonSwag3 "><a href="javascript:void(0)" title="Save draft">Save draft</a></li>').insertAfter('.markItUpButton16').find('a').css('background-image', 'url(http://i.cubeupload.com/NY2bfk.png)').click(function (e) {
    var title = 'draft_' + currentSessionRnd;
    if ($('#id_name').length > 0) title = $('#id_name').val();
    var content = $('#id_body').val();
    var drafts = {
    };
    if (typeof localStorage['forumSwagDrafts'] !== 'undefined')
    drafts = JSON.parse(localStorage['forumSwagDrafts']);
    if (drafts.hasOwnProperty(title)) {
      if (!confirm('Overwrite draft \'' + title + '\'?')) {
        e.preventDefault();
        return false;
      }
    }
    drafts[title] = content;
    localStorage['forumSwagDrafts'] = JSON.stringify(drafts);
    draftStatus.text('Saved draft: ' + title).show().fadeOut(1000);
    e.preventDefault();
    return false;
  });
  $('<li class="markItUpButton markItUpButtonSwag4 "><a href="javascript:void(0)" title="Open draft">Open draft</a></li>').insertAfter('.markItUpButton16').find('a').css('background-image', 'url(http://i.cubeupload.com/BSsouH.png)').click(function (e) {
    if (typeof localStorage['forumSwagDrafts'] === 'undefined') localStorage['forumSwagDrafts'] = JSON.stringify({
    });
    var drafts = JSON.parse(localStorage['forumSwagDrafts']);
    var select = $('<select><option value=\'__internal_default\'>&gt; Select a draft</option></select').css({'height': '16px', 'width':'150px'});
    select.append('<option value=\'__internal_del\'>&gt; Delete a draft</option>');
    var hasItems = false;
    for (var key in drafts) {
      if (drafts.hasOwnProperty(key)) {
        select.append($('<option></option>').attr('value', key).text(key));
        hasItems = true;
      }
    }
    if (!hasItems) {
      draftStatus.text('No drafts!').show().fadeOut(1000);
      e.preventDefault();
      return false;
    }
    select.append($('<option></option>').attr('value', '__internal_none').text('Cancel'));
    draftStatus.html('').append(select).show();
    select.on('change', function () {
      var value = $(this).val();
      if (value === '__internal_none') {
        draftStatus.fadeOut();
        return;
      }
      if(value === '__internal_default'){
        return;
      }
      var is_del = typeof $(this).attr('data-delete') !== 'undefined';
      if (is_del) {
        if (!confirm('Delete \'' + value + '\'?')) {
          $(this).val('__internal_default');
          return;
        }
        var drafts = JSON.parse(localStorage['forumSwagDrafts']);
        delete drafts[value];
        localStorage['forumSwagDrafts'] = JSON.stringify(drafts);
        draftStatus.fadeOut();
        return;
      }
      if (value === '__internal_del') {
        $(this).attr('data-delete', 'yes');
        $(this).find('option').eq(0).text('Select a draft to delete');
        $(this).find('option').eq(1).remove();
        $(this).val('__internal_default');
        return;
      }
      if ($('#id_body').val().trim() !== '') {
        if (!confirm('Overwrite text in editor?')) {
          $(this).val('__internal_default');
          return;
        }
      }
      var drafts2 = JSON.parse(localStorage['forumSwagDrafts']);
      if ($('#id_name').length > 0) {
        $('#id_name').val(value);
      }
      $('#id_body').val(drafts2[value]);
      draftStatus.text('Loaded draft: ' + value).show().fadeOut(1000);
    });
    e.preventDefault();
    return false;
  });
  draftStatus.insertAfter('.markItUpButtonSwag4');
  
  /************* was an april fools joke :P
  $('.postsignature').each(function () {
    var img = $('<img/>').attr('src', 'http://i.cubeupload.com/h1KKLg.gif').css({
      'height': $(this).height(),
      'position': 'absolute',
      'top': '0px',
      'left': '-110px' //////////// DANKRUDE - SWAGSTORM ////////////////
    }).addClass('es').click(window.open.bind(window, 'http://scratch.mit.edu/discuss/youtube/2HQaBWziYvY', '_blank', ''));
    $(this).css('position', 'relative').append(img);
    (function (img, width) {
      setInterval(function () {
        img.css('left', '-110px').delay(Math.round(Math.random() * 1000)).animate({
          left: width + 100
        }, 5000, 'linear');
      }, 6000);
    }) (img, $(this).width());
  });
  */
  
  // mostly from http://stackoverflow.com/a/3966822/1021196
  function getInputSelection(el) {
    var start = 0,
    end = 0,
    normalizedValue,
    range,
    textInputRange,
    len,
    endRange;
    if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
      start = el.selectionStart;
      end = el.selectionEnd;
    } else {
      range = document.selection.createRange();
      if (range && range.parentElement() == el) {
        len = el.value.length;
        normalizedValue = el.value.replace(/\r\n/g, '\n');
        // Create a working TextRange that lives only in the input
        textInputRange = el.createTextRange();
        textInputRange.moveToBookmark(range.getBookmark());
        // Check if the start and end of the selection are at the very end
        // of the input, since moveStart/moveEnd doesn't return what we want
        // in those cases
        endRange = el.createTextRange();
        endRange.collapse(false);
        if (textInputRange.compareEndPoints('StartToEnd', endRange) > - 1) {
          start = end = len;
        } else {
          start = - textInputRange.moveStart('character', - len);
          start += normalizedValue.slice(0, start).split('\n').length - 1;
          if (textInputRange.compareEndPoints('EndToEnd', endRange) > - 1) {
            end = len;
          } else {
            end = - textInputRange.moveEnd('character', - len);
            end += normalizedValue.slice(0, end).split('\n').length - 1;
          }
        }
      }
    }
    return {
      start: start,
      end: end
    };
  }
  function getSelectedText(el) {
    var sel = getInputSelection(el),
    val = el.value;
    return val.slice(sel.start, sel.end);
  }
  function replaceSelectedText(el, text) {
    var sel = getInputSelection(el),
    val = el.value;
    el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
  }
  $.fn.getSel = function () {
    return getSelectedText($(this).get(0));
  };
  $.fn.replaceSel = function (text) {
    replaceSelectedText($(this).get(0), text);
  };
}
$(document).ready(function () {
  var interval;
  interval = setInterval(function () {
    if ($('.markItUpButton').html() != null) {
      clearInterval(interval);
      startScript();
    }
  }, 200);
});
