// ==UserScript==
// @name        GF 论坛引用增强
// @namespace   org.jixun.gf.better.quote
// @description 对论坛的引用功能进行增强 (自认)
// @include     https://greasyfork.org/*/forum/discussion/*
// @version     1.0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/7839/GF%20%E8%AE%BA%E5%9D%9B%E5%BC%95%E7%94%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/7839/GF%20%E8%AE%BA%E5%9D%9B%E5%BC%95%E7%94%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/// 脚本配置:开始 ///

// 是否移除之前的引用而非替换掉?
var removePrevQuote  = 0;

// 当获取用户名失败时 (Markdown 模式) 使用的用户名。
var defaultUnsername = '无名氏';

// 同级引用次数
var sameLevelQuotes  = 2;

/// 脚本配置:结束 ///

;(function ($, txt, trim) {
  $(function () {
    var quoteAQT = window.Gdn_Quotes.prototype.ApplyQuoteText;

    window.Gdn_Quotes.prototype.ApplyQuoteText = function (QuoteText) {
      var $dummy = $('<div>').html(QuoteText);

      var quoteElement = $dummy.children();
      var childQuotes  = quoteElement.children('blockquote');

      if (childQuotes.length) {
        if (removePrevQuote) {
          childQuotes.remove();
          quoteElement.html(quoteElement.html().trim());
        } else {
          childQuotes.each(function (i) {
            var self = $(this);

            if (i >= sameLevelQuotes) {
              self.remove();
              return ;
            }

            // 移除子引用
            self.children('blockquote').remove();

            // 裁剪文本
            self.children().each(function () {
              this.innerHTML = this.innerHTML.trim();
            });

            // 精简引用内容
            self.text(
              '> 引用自: ' + (self.attr('rel') || defaultUnsername) + '\n' +
              '>> ' + trim(self.text().trim()).replace(/\n/g, '\n>> ')
            );

            self.html(self.html().trim().replace(/\n/g, '<br>'));
          });
        }
      }
      QuoteText = $dummy.html().replace(/(blockquote>)\s+/g, '$1') + '\n';

      return quoteAQT.call(this, QuoteText);
    };
  });
}) (window.jQuery, document.createTextNode.bind(document), function (src) {
  if (src.length > 20) {
    return src.slice(0, 17).trim() + ' ..';
  } else {
    return src;
  }
});
