// ==UserScript==
// @author         Lightwave
// @name           Habrahabr topics highlighter
// @description    Выделяет заголовки топиков жёлтым цветом определённых авторов
// @version        2.6.5
// @include        http://habrahabr.ru/*
// @include        https://habrahabr.ru/*
// @include        http://geektimes.ru/*
// @include        https://geektimes.ru/*
// @include        http://megamozg.ru/*
// @include        https://megamozg.ru/*
// @namespace      https://greasyfork.org/users/9366
// @license        MIT License
// @run-at         document-end
// @grant          none
// @icon           data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/8255/Habrahabr%20topics%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/8255/Habrahabr%20topics%20highlighter.meta.js
// ==/UserScript==
(function () {
  var posts = document.querySelectorAll('div.post');
  var dailyPosts = document.querySelectorAll('#broadcast_posts_now > .content-list > .content-list__item');
  var authors = [
    'alizar',
    'marks',
    'SLY_G',
    'ragequit', // keepcalm 
    'ivansychev',
    'jeston',
    'FakeFactFelis',
    'atomlib',
    'andorro', // out of order
    'ilya42', // out of order
    'itNews',
    'semen_grinshtein',
    'Shapelez', // out of order
    'jasiejames' // out of order   
  ];
  for (var i = 0; i < posts.length; i++) {
    var author = posts[i].querySelector('.post-author__link');
    var authorName = '';
    if (author !== null) {
      authorName = author.innerHTML;
      authorName = authorName.slice(authorName.indexOf('@') + 1, authorName.length).trim();
    } else {
      var authorNickname = posts[i].querySelector('.author-info__nickname');
      if (authorNickname !== null) { // у постов с новым дезигном вообще нигде автор не пишется, например geektimes.ru/article/262244/
        authorName = authorNickname.innerHTML
        authorName = authorName.replace('@', '').trim();
      }
    }
    if (authors.indexOf(authorName) != - 1) {
      var postName = posts[i].querySelector('.post_title').textContent;
      posts[i].querySelector('.post_title').textContent = '(' + authorName + ') ' + postName;
      posts[i].querySelector('.post_title').style.backgroundColor = '#ff0';
    }
  }
  function UpdateDailyPost(request, index) {
    return function () {
      if (request.readyState != 4) return;
      if (request.status != 200) return;
      var dummy = document.createElement('div');
      dummy.innerHTML = request.responseText;
      var dailyPost = dailyPosts[index].querySelector('.content-list__item-link');
      var dailyPostName = dailyPost.textContent;
      var dailyPostAuthorName = dummy.querySelector('.author-info__nickname').innerHTML;
      dailyPostAuthorName = dailyPostAuthorName.replace('@', '').trim();
      if (authors.indexOf(dailyPostAuthorName) != - 1) {
        dailyPost.textContent = '(' + dailyPostAuthorName + ') ' + dailyPostName;
        dailyPost.style.backgroundColor = '#ff0';
      }
      request = null;
    };
  }
  var xhr = new Array(dailyPosts.length);
  for (var j = 0; j < dailyPosts.length; j++) {
    var baseUri = dailyPosts[j].querySelector('a').baseURI;
    var dpUrl = dailyPosts[j].querySelector('a').href;
    if (baseUri.indexOf('https') != - 1) {
      dpUrl = dpUrl.indexOf('https') == - 1 ? dpUrl.replace('http', 'https')  : dpUrl;
    }
    xhr[j] = new XMLHttpRequest();
    xhr[j].onreadystatechange = UpdateDailyPost(xhr[j], j);
    xhr[j].open('GET', dpUrl, true);
    xhr[j].send(null);
  }
}) ();
