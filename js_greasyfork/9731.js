// ==UserScript==
// @name         AnimaKai.tv
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.9
// @description  Renove o tempo de espera no site Animakai.tv
// @author       ShinobuChan - Felippe
// @include      http://www.animakai.me/*.php?*
// @include      http://www.otakai.com.br/*.php?*
// @include      http://www.animakai.tv/*.php?*
// @include      http://www.comicon.com.br/*.php?*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/9731/AnimaKaitv.user.js
// @updateURL https://update.greasyfork.org/scripts/9731/AnimaKaitv.meta.js
// ==/UserScript==

$(document).ready(function(){
  $('.iframe_cpmstar a').on('mousedown',function(e){
    $.post('', { type: 'img' }, function() {  
      $('#link').css('display','block');
      $('#frase').html('Link liberado - Como é bom saber JAVA:');
    }).on('contextmenu',function(e){
      e.preventDefault();
    });
  });
  
  $('.iframe_cpmstar iframe').iframeTracker({
    blurCallback: function(){
      $.post('', { type: 'iframe' }, function() {  
        $('#link').css('display','block');
        $('#frase').html('Link liberado - Como é bom saber JAVA:');
      });
    }
  });
  
  $('.iframe_cpmstar object').iframeTracker({
    blurCallback: function(){
      $.post('', { type: 'object' }, function() {  
        $('#link').css('display','block');
        $('#frase').html('Link liberado - Como é bom saber JAVA:');
      });
    }
  });
  
  var t = 0;
  $('#tempo').html(t);
  var interval = setInterval(function(){
    t = t - 0;
    $('#tempo').html(t);
    if(t == 0){
      clearInterval(interval);
      $.post('', { type: 'waited' }, function(){
       $('#link').css('display','block');
       $('#frase').html('Link liberado - Como é bom saber JAVA:');
      });
    }
  },10);
});