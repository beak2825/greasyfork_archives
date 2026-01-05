// ==UserScript==
// @name        KissAnime Ajaxify
// @namespace   kissanime.com.ajax
// @description Ajaxify the next and previous buttons on the page for watching anime of KissAnime.com. For more information, visit http://imetal.nl/.
// @icon        http://www.imetal.nl/wp-content/uploads/2015/02/kissanime.png
// @include     http://kissanime.com/Anime/*/*
// @include     https://kissanime.com/Anime/*/*
// @version     1.1
// @grant       none
// @run-at document-end
// @noframes
// @author      Faust iMetal
// @website     http://imetal.nl/
// @downloadURL https://update.greasyfork.org/scripts/8277/KissAnime%20Ajaxify.user.js
// @updateURL https://update.greasyfork.org/scripts/8277/KissAnime%20Ajaxify.meta.js
// ==/UserScript==
// - Remove annoying ads
/*$('#adsIfrme6').remove();
$('#adsIfrme7').remove();
$('#adsIfrme8').remove();
$('#adsIfrme10').remove();
$('.divCloseBut').remove();
$('#adsIfrme').find('.clear2').remove();
$('#adsIfrme').find('span').remove();
$('#adsIfrme11').remove();*/
// - Functions

var timer = -1;

function replaceVideo()
{
  newEmbed = $('#iframeLoader').contents().find('#divContentVideo').html();
  if(newEmbed != null)
    {
      clearInterval(timer);
      console.log('Remove check');
      //Update video
      $('#divContentVideo').html('');
      console.log('Remove old video');
      $(newEmbed).appendTo('#divContentVideo');
      console.log('Place new video');
      //Update buttons
      $('#btnNext').parent().attr('href', $('#iframeLoader').contents().find('#btnNext').parent().attr('href'));
      $('#btnPrevious').parent().attr('href', $('#iframeLoader').contents().find('#btnPrevious').parent().attr('href'));
      // - Ajax Buttons
      nextEpisode = $('#btnNext').parent().attr('href');
      previousEpisode =  $('#btnPrevious').parent().attr('href');
      //Clean up
      $('#iframeLoader').remove();
      console.log('Remove iframe');
      //Update episode count
      $("#selectEpisode")[0].selectedIndex = currentEpisode;
      console.log('Current episode updated');
      //Update history
      url = $('#iframeLoader').attr('src');
      window.history.pushState({'href':url}, $('#iframeLoader').contents().find('title').text(), url);
      console.log('History is updated');
    }
  console.log('Iframe Check');
}
// - Ajax Buttons
var nextEpisode = $('#btnNext').parent().attr('href');
var previousEpisode =  $('#btnPrevious').parent().attr('href');

var currentEpisode = $("#selectEpisode")[0].selectedIndex;

if(nextEpisode != 'undefined')
  {
    var nextBtn = $('#btnNext').parent();
    console.log('Hook Next Button');
    nextBtn.click(function(e) {
      e.preventDefault();
      
      $('<iframe />', {
        name: 'iframeLoader',
        id:   'iframeLoader',
        src: nextEpisode,
      }).appendTo('body');
      console.log('Load Iframe')
      timer = setInterval(replaceVideo, 1000);
      console.log('Start Check');
      if(currentEpisode == 0)
        {
          $('<a href="'+window.location.href+'"><img border="0" title="Previous episode" src="http://kissanime.com/Content/images/previous.png" id="btnPrevious"></a>').insertBefore($('#btnNext').parent());
        } else if(currentEpisode >= $('#selectEpisode').children('option').length-2) {
          $('#btnNext').parent().remove();
        }
      currentEpisode = $("#selectEpisode")[0].selectedIndex + 1;
    });
  }
if(previousEpisode != 'undefined')
  {
    var previousBtn = $('#btnPrevious').parent();
    console.log('Hook Previous Button');
    previousBtn.click(function(e) {
      e.preventDefault();
      
      $('<iframe />', {
        name: 'iframeLoader',
        id:   'iframeLoader',
        src: previousEpisode,
      }).appendTo('body');
      console.log('Load Iframe')
      timer = setInterval(replaceVideo, 1000);
      console.log('Start Check');
      if(currentEpisode >= $('#selectEpisode').children('option').length-2)
        {
          $('<a href="'+window.location.href+'"><img border="0" title="Next episode" src="http://kissanime.com/Content/images/next.png" id="btnNext"></a>').insertAfter($('#btnPrevious').parent())
        } else if(currentEpisode == 1) {
          $('#btnPrevious').parent().remove();
        }
      currentEpisode = $("#selectEpisode")[0].selectedIndex - 1;
    });
  }