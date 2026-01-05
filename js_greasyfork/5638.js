// ==UserScript==
// @name        	/r/leagueoflegends red tracker
// @license			BSD License
// @description 	turn links red if rioter comments. tracks rioter comments on comment page.
// @version     	1.0.2
// @include			*://*.reddit.com/r/leagueoflegends*
// @require       	https://code.jquery.com/jquery-1.11.0.min.js
// @grant       	none
// @namespace https://greasyfork.org/users/5966
// @downloadURL https://update.greasyfork.org/scripts/5638/rleagueoflegends%20red%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/5638/rleagueoflegends%20red%20tracker.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(function () {
  if (window.location.href.search('comments') == - 1) {
    var lastPost = searchPosts('');		//last comment on each page. used as reference to load next page.
    var page = [];		//for RES, keep track of what pages have been loaded already
    page.push('#page=1');
    $(window).on('hashchange', function () {
      if (page.indexOf(window.location.hash) == - 1) {		//when on a new page that hasn't been loaded before, make titles red
        //update loaded pages
        page.push(window.location.hash);
        //keep track of last comment so next page loads from correct spot
        lastPost = searchPosts(lastPost);
      }
    });
  } 
  else {
    addMarkup();
    trackComments(0);
    $('span.morecomments a').click(function () {
      $('#openRiotNav,.closeRiot,.downRiot,.upRiot').off();
      setTimeout(function () {
        trackComments(parseInt($('.counterRiot').text().substring(0, 1)));
      }, 3000);
    });
  }
});

/********************
***Start Functions***
********************/
function addMarkup() {
  //if there are no comments, stop
  if ($('p>span.flair-riot').length == 0) {
    return;
  }
  
  //add markup for comment tracker
  $('body').append('<div class=\'riotNav\'></div>');
  $('.riotNav').append('<div class=\'closeRiot\'>X</div>');
  $('.riotNav').append('<div class=\'upRiot\'></div>');
  $('.riotNav').append('<div class=\'counterRiot\'>1/' + $('p>span.flair-riot').length + '</div>');
  $('.riotNav').append('<div class=\'downRiot\'></div>');
  $('.riotNav').append('<p class=\'navAlert\'>Comment Minimized</p>');
  
  //add button on nav toggle menu to make comment tracker appear if closed
  if ($('#REScommentNavToggle').length) {
    $('#REScommentNavToggle').append('<span>|</span><div id=\'openRiotNav\' class=\'flair flair-riot\' title=\'Navigate through comments by Rioters\'></div>');
  } 
  else {
    $('.menuarea').append('<div id=\'openRiotNav\' class=\'flair flair-riot\' title=\'Navigate through comments by Rioters\'></div>');
  }
  
  //style
  $('#openRiotNav').css({
    'margin-left': '6px',
    'cursor': 'pointer'
  });
  $('.closeRiot').css({
    'margin': '2px 3px 0 0',
    'float': 'right',
    'content': '¹6',
    'font-size': '9px',
    'font-weight': 'bold',
    'cursor': 'pointer',
    'color': 'white',
    'opacity': '.3',
    'text-indent': '0'
  });
  $('.closeRiot').hover(function () {
    $(this).css({
      'opacity': 0.8
    });
  }, function () {
    $(this).css({
      'opacity': 0.3
    });
  });
  $('.counterRiot').css({
    'width': '50px',
    'height': '40px',
    'margin': '0px auto 0px auto',
    'color': 'white',
    'text-align': 'center',
    'line-height': '37px'
  });
  $('.downRiot').css({
    'width': '0px',
    'height': '0px',
    'border-right': '20px solid transparent',
    'border-left': '20px solid transparent',
    'border-top': '20px solid rgb(224, 189, 3)',
    'margin': '0px auto 0px auto',
    'position': 'relative',
    'overflow': 'hidden',
    'cursor': 'pointer'
  });
  $('.navAlert').css({
    'display': 'none',
    'position': 'relative',
    'bottom': '21px',
    'left': '8px',
    'color': 'white',
    'font-size': '8px'
  });
  $('.riotNav').css({
    'position': 'fixed',
    'background-color': '#2F4F4F',
    'top': '215px',
    'right': '450px',
    'width': '100px',
    'height': '100px',
    'border': '2px solid rgb(224, 189, 3)',
    'opacity': 0.1,
    '-moz-transition': 'opacity 0.5s, box-shadow 0.5s',
    '-o-transition': 'opacity 0.5s, box-shadow 0.5s',
    '-webkit-transition': 'opacity 0.5s, box-shadow 0.5s'
  });
  $('.riotNav').hover(function () {
    $(this).css({
      'opacity': 1,
      'box-shadow': '4px 4px 1px rgb(133, 128, 128)'
    });
  }, function () {
    $(this).css({
      'opacity': 0.1,
      'box-shadow': 'none'
    });
  });
  $('.upRiot').css({
    'width': '0px',
    'height': '0px',
    'border-right': '20px solid transparent',
    'border-left': '20px solid transparent',
    'border-bottom': '20px solid rgb(224, 189, 3)',
    'margin-top': '8px',
    'left': '30px',
    'position': 'relative',
    'overflow': 'hidden',
    'cursor': 'pointer'
  });
  $(".downRiot").mousedown(function() { $(this).css({'border-top': '20px solid rgb(119, 101, 3)'}); });
  $(".downRiot").mouseup(function() { $(this).css({'border-top': '20px solid rgb(224, 189, 3)'}); });
  $(".upRiot").mousedown(function() { $(this).css({'border-bottom': '20px solid rgb(119, 101, 3)'}); });
  $(".upRiot").mouseup(function() { $(this).css({'border-bottom': '20px solid rgb(224, 189, 3)'}); });
}

function makePostRed(toBeRed) {
  //make link red
  toBeRed.style.setProperty('color', 'red', 'important');
  //mouseover turn pink, mouseoff turn red again
  $(toBeRed).hover(function () {
    this.style.setProperty('color', '#ff69b4', 'important');
  }, function () {
    this.style.setProperty('color', 'red', 'important');
  });
}

function searchPosts(afterPost) {
  var url;			//to be used in the json request
  var postArray;	//array of reddit post objects from json request
  var jqXHR;		//jQuery XMLHttpRequest object
  var selfPost;		//jQuery object of the reddit self post <a> tag to be made red
  var decodedURL;	//external link url used to select <a> tag
  var externalPost;	//jQuery object of the external link <a> tag to be made red
  
  //form json request url
  if (window.location.search.indexOf('after') == -1) {
		if (window.location.search == "") {
			url = 'http://' + window.location.hostname + window.location.pathname + '.json?after=' + afterPost;
		} else {
			url = 'http://' + window.location.hostname + window.location.pathname + '.json'+window.location.search+'&after=' + afterPost;
		}
  } else {
    url = 'http://' + window.location.hostname + window.location.pathname + '.json' + window.location.search;	//not RES
  }
  
  //json request. Synchronous because "jqXHR" is reference in the return statement
  jqXHR = $.ajax({
    dataType: 'json',
    async: false,
    url: url
  });
  postArray = jqXHR.responseJSON.data.children;
  
  //loop through each reddit post retrieved 
  for (var i = 0; i < postArray.length; i++) {
    //get json from all the posts' comment pages
    $.getJSON('http://www.reddit.com' + postArray[i].data.permalink + '.json')
    //when done, traverse comments looking for riot
    .done(function (commentTree) {
      if (traverse(commentTree[1].data.children)) {	//if riot comment is found..
        selfPost = $('a[href="' + commentTree[0].data.children[0].data.permalink + '"]');
        decodedURL = $('<div/>').html(commentTree[0].data.children[0].data.url).text();//decode html symbols in url, specifically "&"
        externalPost = $('a[href="' + decodedURL + '"]');
        if (selfPost.length > 0) {
          makePostRed(selfPost.get(1));
        } 
        else if (externalPost.length > 0) {
          makePostRed(externalPost.get(externalPost.length - 1));
        }
      }
    });
  }
  return jqXHR.responseJSON.data.after;		//ID for the last comment
};

function trackComments(currentNum) {
  var allRiotComments = $('p>span.flair-riot');		//array of references to <p> tags that are riot comments
  var commentNum = currentNum;		//current comment number, start at 0 because no comment is navigated to by default.
  //if there are no comments, stop
  if (allRiotComments.length == 0) {
    return;
  }
  
  //doing this operation up front makes it faster the first time the up/down arrow is clicked
  $(allRiotComments[0]).is(':visible');
  
  //make button open nav on click
  $('#openRiotNav').click(function () {
    $('.riotNav').css({
      'display': 'block'
    });
  });
  //close button functionality
  $('.closeRiot').click(function () {
    $('.riotNav').css({
      'display': 'none'
    });
  });
  //Up/down arrow functionality
  $('.downRiot').click(function () {
    //remove 'comment minimized' alert
    $('.navAlert').css({
      'display': 'none'
    });
    //un-highlight previous comment
    if (commentNum != 0) {
      $(allRiotComments[commentNum - 1]).parent().parent().parent().get(0).style.setProperty('border-color', 'rgb(230, 230, 230)', 'important');
    }
    
	//update comment number -- if at last comment, go to 1st. Otherwise, go up 1.
    commentNum = (commentNum == allRiotComments.length) ? 1 : (commentNum + 1);
	
    if ($(allRiotComments[commentNum - 1]).is(':visible')) {
      //scroll to comment
      $('html,body').animate({
        scrollTop: $(allRiotComments[commentNum - 1]).offset().top - ($(window).height()) / 3
      }, 'slow');
      //highlight comment in red
      $(allRiotComments[commentNum - 1]).parent().parent().parent().get(0).style.setProperty('border-color', 'red', 'important');
    } 
    else {
      //if comment is minimized, it cannot be scrolled to. Alert user
      $('.navAlert').css({
        'display': 'block'
      });
    }
    //update counter
    $('.counterRiot').text(commentNum + '/' + allRiotComments.length);
  });
  
  $('.upRiot').click(function () {
    $('.navAlert').css({
      'display': 'none'
    });
    if (commentNum != 0) {
      $(allRiotComments[commentNum - 1]).parent().parent().parent().get(0).style.setProperty('border-color', 'rgb(230, 230, 230)', 'important');
    }
    
	//if at first comment or not yet at a comment (commentNum=0), go to last. Otherwise, go down 1.
    commentNum = (commentNum < 2) ? allRiotComments.length : (commentNum - 1);
    if ($(allRiotComments[commentNum - 1]).is(':visible')) {
      $('html,body').animate({
        scrollTop: $(allRiotComments[commentNum - 1]).offset().top - ($(window).height()) / 3
      }, 'slow');
      $(allRiotComments[commentNum - 1]).parent().parent().parent().get(0).style.setProperty('border-color', 'red', 'important');
    } 
    else {
      $('.navAlert').css({
        'display': 'block'
      });
    }
    $('.counterRiot').text(commentNum + '/' + allRiotComments.length);
  });
  //Change styling on arrows when clicked
  $('.downRiot,.upRiot').mousedown(function () {
    $(this).toggleClass('changed');
  });
  $('.downRiot,.upRiot').mouseup(function () {
    $(this).toggleClass('changed');
  });
  //update counter - only applies when trackComments is called again after more comments are loaded
  $('.counterRiot').text(commentNum + '/' + allRiotComments.length);
}
function traverse(obj) {
  var flag = 0;
  for (var i in obj) {
    //go through all comments in this level
    if (obj[i].data.author_flair_css_class == 'riot') {
      //return 1 if any riot comments are found
      return 1;
    } 
    else if (typeof (obj[i].data.replies) == 'object') {
      //if there are replies to this comment, traverse them as well
      flag = traverse(obj[i].data.replies.data.children);
      if (flag) {
        return 1;
      }
    }
  }
  return flag;
};