// ==UserScript==
// @name           SL-comment
// @name:ru        СЛ-коммент
// @namespace      Reshpekt Fund Russia
// author          Reshpekt Fund Russia
// description     Shows comment
// @description:ru Отображает текст комментария (на странице "Кто лайкнул?"), за который поставлена оценка
// @include        http://smart-lab.ru/profile/*
// @include        https://smart-lab.ru/profile/*
// @version        0.2
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
// @description Отображает текст комментария, за который поставлена оценка
// @downloadURL https://update.greasyfork.org/scripts/8595/SL-comment.user.js
// @updateURL https://update.greasyfork.org/scripts/8595/SL-comment.meta.js
// ==/UserScript==

(function () {

  var t = document.querySelector('div.vote_text a');

  if (t) {
    (function (st) {
      try {
        var h = document.getElementsByTagName('head')[0],
            s = document.createElement('style');
        s.type = 'text/css';
        h.appendChild(s);
        s.innerHTML = st;
      } catch (e) {
        if (!document.styleSheets.length) {
          document.createStyleSheet();
        }
        document.styleSheets[0].cssText += st;
      }
    })('div.Whatcomment{z-index:9999;display:none;position:absolute;'
      +'font-size:11px;border:1px solid #606060;background:#ffffe1;color:#303030;'
      +'padding:4px 10px 6px 8px;box-shadow:4px 4px 4px rgba(0,0,0,0.5);}'
    );

    var s  = document.createElement('div'),
        a  = document.querySelectorAll('.vote_text a'),
        rq = [],
        key;
    s.className = 'Whatcomment';
    document.body.appendChild(s);
    for (var i = 0; i < a.length; ++i) {
      F(a[i]);
    }

    (function (v, d, m, p) {
      GM_registerMenuCommand(m, function () {
        var val = prompt(p, GM_getValue(v, d));
        if (!val) return;
        GM_setValue(v, val);
        location.reload();
      });
    })('SL-comment-key',
       '1',
       'СЛ-коммент - настройка клавиш',
       'Клавиша, введите число:\r\n\r\n0 - нет клавиши\r\n'
      +'1 - клавиша Alt (по умолчанию)\r\n2 - клавиша Ctrl\r\n'
    );

    switch (GM_getValue('SL-comment-key')) {
      case '0':
        key = 'none';    break;
      case '1':
        key = 'altKey';  break;
      case '2':
        key = 'ctrlKey'; break;
      default:
        key = 'altKey';
    }
  }

  function F(a) {
    if (!a) return;
    a.onmouseout = function () {
      s.style.display = '';
      s.innerHTML     = '';
      var i = rq.length;
      while (i--) {
        rq[i].abort();
        rq.splice(i, 1);
      }
    };
    a.onmouseover = function (e) {
      if (key == 'none' || e[key]) {
        s.style.display = 'block';
        s.style.left    = e.pageX + 'px';
        s.style.top     = e.pageY + 16 + 'px';
        s.style.width   = '';
        s.innerHTML     = 'загрузка...';
        G(this.href);
      }
    };
  }

  function G(url) {
    var x = new XMLHttpRequest(),
        y = url.split('comment');
    if (y) {
      x.open('GET', url, true);
      rq[rq.length] = x;
      x.onreadystatechange = function () {
        if (x.readyState == 4) {
          if (x.status == 200) {
            D((new DOMParser())
            .parseFromString(x.responseText,'text/html'), y[1]);
          } else {
            s.style.display = s.innerHTML = '';
          }
        }
      };
      x.send(null);
    }
  }

  function D(d, k) {
    var t = d.querySelector(('#comment_id_' + k));
    if (t) {
      s.innerHTML = '<strong>Пост: ' + d.querySelector('h1.title span')
        .textContent + '</strong><br><br>' + t.querySelector('.text').innerHTML;
      s.style.width = 400 + 'px';
    } else {
      s.innerHTML = 'нет данных';
    }
  }

})();