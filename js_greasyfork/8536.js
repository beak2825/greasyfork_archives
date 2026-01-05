// ==UserScript==
// @name           SL-plusminus
// @name:ru        СЛ-плюсминус
// @namespace      Reshpekt Fund Russia
// @author         Reshpekt Fund Russia
// @description    Shows who the fuck did it!
// @description:ru Отображает, кто оценил комментарий при наведении на оценку (с нажатой клавишей Alt)
// @version        0.3
// @include        http://smart-lab.ru/*
// @exclude        http://smart-lab.ru/uploads/*
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/8536/SL-plusminus.user.js
// @updateURL https://update.greasyfork.org/scripts/8536/SL-plusminus.meta.js
// ==/UserScript==

(function () {

  var t = document.querySelector('div.comments');

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
    })('div.Whodidit{z-index:9999;display:none;position:absolute;font-size:11'
      +'px;border:1px solid #606060;background:#ffffe1;color:#303030;'
      +'padding:4px 8px 4px 6px;box-shadow:4px 4px 4px rgba(0,0,0,0.5);}'
    );

    var s  = document.createElement('div'),
        a  = document.querySelectorAll('div.total a'),
        rq = [],
        key;
    s.className = 'Whodidit';
    document.body.appendChild(s);
    for (var i = 0; i < a.length; ++i) {
      F(a[i]);
    }

    (function (v, d, m, p) {
      GM_registerMenuCommand(m, function() {
        var val = prompt(p, GM_getValue(v, d));
        if (!val) return;
        GM_setValue(v, val);
        location.reload();
      });
    })('SL-plusminus-key',
       '1',
       'СЛ-плюсминус - настройка клавиш',
       'Клавиша, введите число:\r\n\r\n0 - нет клавиши\r\n'
      +'1 - клавиша Alt (по умолчанию)\r\n2 - клавиша Ctrl\r\n'
    );

    switch (GM_getValue('SL-plusminus-key')) {
      case '0':
        key = 'none';    break;
      case '1':
        key = 'altKey';  break;
      case '2':
        key = 'ctrlKey'; break;
      default:
        key = 'altKey';
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].nodeType == 1 &&
            mutation.addedNodes[i].className == 'comment') {
              F(mutation.addedNodes[i].querySelector('div.total a'));
          }
        }
      });
    });
    observer.observe(t, {childList: true, subtree: true});
  }

  function F(a) {
    if (!a) return;
    a.onmouseout = function () {
      s.style.display = '';
      s.innerHTML = '';
      var i = rq.length;
      while (i--) {
        rq[i].abort();
        rq.splice(i, 1);
      }
    };
    a.onmouseover = function (e) {
      if(key == 'none' || e[key]) {
        s.style.display = 'block';
        s.style.left    = e.pageX + 'px';
        s.style.top     = e.pageY + 16 + 'px';
        s.innerHTML     = 'загрузка...';
        G(this.href);
      }
    };
  }
  
  function G(url, k) {
    var x = new XMLHttpRequest();
    x.open('GET', url, true);
    rq[rq.length] = x;
    x.onreadystatechange = function () {
      if (x.readyState == 4) {
        if(x.status == 200) {
          D((new DOMParser()).parseFromString(x.responseText,'text/html'), k);
        } else {
          s.style.display = s.innerHTML = '';
        }
      }
    };
    x.send(null);
  }

  function D(d, k) {
    var t = d.querySelectorAll('td.user'),
        x = [],
        a,
        p;
    if (t.length) {
      for (var i = 0; i < t.length; ++i) {
        if (a = t[i].querySelector('a.link')) {
          x[x.length] = ((t[i].parentNode.className == 'minus')
            ? '<div style="float:left;width:16px;text-align:center;' +
                'color:darkred">&#8211;</div><span style="color:darkred">' +
                  a.textContent + '</span>'
            : '<div style="float:left;width:16px;text-align:center;' +
                'color:darkgreen">&#43;</div><span style="color:darkgreen">' +
                  a.textContent + '</span>'
          );
        }
      }
      s.innerHTML = s.innerHTML.replace('загрузка...', '');
      s.innerHTML += x.join('<br>') + '<br>';
      // если нет ключа, но есть разбивка на страницы и страниц > 2
      // запрашиваем страницы по всем ссылкам, кроме первой и последней
      if (!k && (p = d.querySelectorAll('#pagination a')) && p.length > 2) {
        s.innerHTML += 'загрузка...';
        for (var l = 1; l < p.length - 1; ++l) {
          //после 4-ой страницы (4*15=60 голосов) выход
          if (l == 4) break;
          G(p[l].href, 1);
        }
      }
    } else {
      s.innerHTML = 'нет данных';
    }
  }

})();