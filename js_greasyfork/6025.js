// ==UserScript==
// @name         DCFever+
// @namespace    http://www.dcfever.com/
// @version      1.6
// @description	 Enhancement for trading forum in DCFever.
// @author       lacek
// @match        http*://www.dcfever.com/trading/listing.php*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6025/DCFever%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/6025/DCFever%2B.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function ($) {
  var queryParams = function (url) {
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    var result = {};
    for (var i = 0; i < qs.length; i++) {
      qs[i] = qs[i].split('=');
      result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
  };

  // report shortcut
  var types = [
    {
      reason: '類別不正確',
      label: '錯'
    },
    {
      reason: '廣告內容',
      label: '廣'
    },
    {
      reason: '重覆刊登',
      label: '重'
    },
    {
      reason: '濫用關鍵字',
      label: '濫'
    }
  ];
  $('.item_list_wrap > .item_list > li.clearfix > a').each(function (index, a) {
    var $a = $(a);
    var $col2 = $a.find('.col_2');
    var $container = $('<div class="trade_report"></div>').appendTo($col2);
    var id = queryParams($a.attr('href')).id;
    $.each(types, function(index, type) {
      var $button = $('<span><a href="#">' + type.label + ' </a></span>');
      $button.click(function (e) {
        e.preventDefault();
        $.post('report.php', {
            reason: type.reason,
            comment: type.reason,
            form_action: 'report_action',
            id: id,
            submit: '確認',
        }).done(function() {
            $container.remove();
        });
      });
      $container.append($button);
    });
  });

  // keyboard navigation
  var $pagination = $('.lt_pagination > .pages');
  var $currentPage = $pagination.find('.current');
  $(document).keyup(function(e) {
    if (e.keyCode === 37 && !$currentPage.is(':first-child')) { // left
      location.href = $currentPage.prev().attr('href');
    } else if (e.keyCode === 39 && !$currentPage.is(':last-child')) { // right
      location.href = $currentPage.next().attr('href');
    }
  });

  // retain order and type
  var params = queryParams(location.href);
  var queryString = '';
  if (params.order) {
    queryString += '&order=' + params.order;
  }
  if (params.type) {
    queryString += '&type=' + params.type;
  }
  if (params.view) {
    queryString += '&view=' + params.view;
  }
  if (queryString.length > 0) {
    $('.listing_cat_list li a, .trade_cat li a').each(function(i, e) {
      var $e = $(e);
      var url = $e.attr('href');
      $e.attr('href', url + queryString);
    });
  }
}) (window.jQuery);
