// ==UserScript==
// @name        DotalHelperMin
// @namespace   dotal.or.kr
// @description dotal helper
// @version     0.1
// @grant    none
// @include       *://dotal.or.kr/*
// @include       *://*.dotal.or.kr/*

// @downloadURL https://update.greasyfork.org/scripts/8941/DotalHelperMin.user.js
// @updateURL https://update.greasyfork.org/scripts/8941/DotalHelperMin.meta.js
// ==/UserScript==


//Youtube
$('#writeContents embed').each(function () {
  $(this) [0].src = $(this) [0].src.replace('embed', 'v');
});
//Postimg
if ($('#writeContents').html().indexOf('postimg.org') != - 1) {
  var btn = $('<button type="button" style="position:fixed;float:left;width:100px;top:50%;left:10%;">이미지 변환</button>').click(function () {
    $('#writeContents img').each(function () {
      var url = $(this) [0].src;
      if (url.indexOf('postimg.org') != - 1) {
        if (url.indexOf('.jpg') != - 1) {
          $(this) [0].src = $(this) [0].src.replace('.jpg', '.png');
        } else {
          $(this) [0].src = $(this) [0].src.replace('.png', '.jpg');
        }
      }
    });
  });
  $('#writeContents').after(btn);
}


