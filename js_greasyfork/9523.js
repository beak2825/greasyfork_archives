// ==UserScript==
// @name            twitter列表维护
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    0.3
// @description    维护twitter列表
// @include         https://twitter.com/virtualmi/lists/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/9523/twitter%E5%88%97%E8%A1%A8%E7%BB%B4%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/9523/twitter%E5%88%97%E8%A1%A8%E7%BB%B4%E6%8A%A4.meta.js
// ==/UserScript==
(function () {
  timer = setTimeout(onSub, 3000);
  //.find(".username.js-action-profile-name")
}) ();
function onSub() {
  var xc = '';
  $('.header-inner').click(function () {
    $('.account-group.js-user-profile-link').each(function () {
      xc = xc + $(this).attr("href").replace("/","@") + '\n';
    //$('#content-main-heading').text($('#content-main-heading').text() + $(this).text() + '\n')
    });
    //alert(xc);
    
    winobj = window.open('', 'tdb', 'width=512, height=384, menubar=no, toolbar=no, location=no, status=no, resizable=yes, scrollbars=no');
    winobj.document.open();
    winobj.document.write(xc);
    winobj.document.close();
  });
};
