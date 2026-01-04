// ==UserScript==
// @name         Burning Vocabulary彭博社版
// @namespace    http://tampermonkey.net/
// @version      16
// @description  仿真Burning Vocabulary，没有翻译功能，仅限于在经济学人网站上对单词进行标注
// @author       TCH
// @match        *://www.economist.com
// @match        *://www.bloomberg.com
// @include      *://*economist.com/*
// @include      *://*bloomberg.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      tangchuanhui
// @downloadURL https://update.greasyfork.org/scripts/550611/Burning%20Vocabulary%E5%BD%AD%E5%8D%9A%E7%A4%BE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550611/Burning%20Vocabulary%E5%BD%AD%E5%8D%9A%E7%A4%BE%E7%89%88.meta.js
// ==/UserScript==




(function() {
  var elmGetter = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = new WeakMap();
    let mode = 'css';
    let $;
    const elProto = win.Element.prototype;
    const matches = elProto.matches ||
      elProto.matchesSelector ||
      elProto.webkitMatchesSelector ||
      elProto.mozMatchesSelector ||
      elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver ||
      win.WebkitMutationObserver ||
      win.MozMutationObserver;

    function addObserver(target, callback) {
      const observer = new MutationObs(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes') {
            callback(mutation.target);
            if (observer.canceled) return;
          }
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) callback(node);
            if (observer.canceled) return;
          }
        }
      });
      observer.canceled = false;
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true
      });
      return () => {
        observer.canceled = true;
        observer.disconnect();
      };
    }

    function addFilter(target, filter) {
      let listener = listeners.get(target);
      if (!listener) {
        listener = {
          filters: new Set(),
          remove: addObserver(target, el => listener.filters.forEach(f => f(el)))
        };
        listeners.set(target, listener);
      }
      listener.filters.add(filter);
    }

    function removeFilter(target, filter) {
      const listener = listeners.get(target);
      if (!listener) return;
      listener.filters.delete(filter);
      if (!listener.filters.size) {
        listener.remove();
        listeners.delete(target);
      }
    }

    function query(all, selector, parent, includeParent, curMode) {
      switch (curMode) {
        case 'css':
          const checkParent = includeParent && matches.call(parent, selector);
          if (all) {
            const queryAll = parent.querySelectorAll(selector);
            return checkParent ? [parent, ...queryAll] : [...queryAll];
          }
          return checkParent ? parent : parent.querySelector(selector);
        case 'jquery':
          let jNodes = $(includeParent ? parent : []);
          jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
          if (all) return $.map(jNodes, el => $(el));
          return jNodes.length ? $(jNodes.get(0)) : null;
        case 'xpath':
          const ownerDoc = parent.ownerDocument || parent;
          selector += '/self::*';
          if (all) {
            const xPathResult = ownerDoc.evaluate(selector, parent, null, 7, null);
            const result = [];
            for (let i = 0; i < xPathResult.snapshotLength; i++) {
              result.push(xPathResult.snapshotItem(i));
            }
            return result;
          }
          return ownerDoc.evaluate(selector, parent, null, 9, null).singleNodeValue;
      }
    }

    function isJquery(jq) {
      return jq && jq.fn && typeof jq.fn.jquery === 'string';
    }

    function getOne(selector, parent, timeout) {
      const curMode = mode;
      return new Promise(resolve => {
        const node = query(false, selector, parent, false, curMode);
        if (node) return resolve(node);
        let timer;
        const filter = el => {
          const node = query(false, selector, el, true, curMode);
          if (node) {
            removeFilter(parent, filter);
            timer && clearTimeout(timer);
            resolve(node);
          }
        };
        addFilter(parent, filter);
        if (timeout > 0) {
          timer = setTimeout(() => {
            removeFilter(parent, filter);
            resolve(null);
          }, timeout);
        }
      });
    }
    return {
      get currentSelector() {
        return mode;
      },
      get(selector, ...args) {
        let parent = typeof args[0] !== 'number' && args.shift() || doc;
        if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
        const timeout = args[0] || 0;
        if (Array.isArray(selector)) {
          return Promise.all(selector.map(s => getOne(s, parent, timeout)));
        }
        return getOne(selector, parent, timeout);
      },
      each(selector, ...args) {
        let parent = typeof args[0] !== 'function' && args.shift() || doc;
        if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
        const callback = args[0];
        const curMode = mode;
        const refs = new WeakSet();
        for (const node of query(true, selector, parent, false, curMode)) {
          refs.add(curMode === 'jquery' ? node.get(0) : node);
          if (callback(node, false) === false) return;
        }
        const filter = el => {
          for (const node of query(true, selector, el, true, curMode)) {
            const _el = curMode === 'jquery' ? node.get(0) : node;
            if (refs.has(_el)) break;
            refs.add(_el);
            if (callback(node, true) === false) {
              return removeFilter(parent, filter);
            }
          }
        };
        addFilter(parent, filter);
      },
      create(domString, ...args) {
        const returnList = typeof args[0] === 'boolean' && args.shift();
        const parent = args[0];
        const template = doc.createElement('template');
        template.innerHTML = domString;
        const node = template.content.firstElementChild;
        if (!node) return null;
        parent ? parent.appendChild(node) : node.remove();
        if (returnList) {
          const list = {};
          node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
          list[0] = node;
          return list;
        }
        return node;
      },
      selector(desc) {
        switch (true) {
          case isJquery(desc):
            $ = desc;
            return mode = 'jquery';
          case !desc || typeof desc.toLowerCase !== 'function':
            return mode = 'css';
          case desc.toLowerCase() === 'jquery':
            for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
              if (isJquery(jq)) {
                $ = jq;
                break;
              };
            }
            return mode = $ ? 'jquery' : 'css';
          case desc.toLowerCase() === 'xpath':
            return mode = 'xpath';
          default:
            return mode = 'css';
        }
      }
    };
  }();




  elmGetter.get('p[class="ArticleBodyText_articleBodyContent__17wqE typography_articleBody__3UcBa paywall"]').then(div1 => {

    ////删除广告
    document.querySelector('.media-ui-FullWidthAd_fullWidthAdWrapper-fClHZteIk3k-').style.display = 'none';
    //删除浏览器版本低的提示
    const targetElement1 = document.querySelector('.unsupported-browser-notification-container');
    if (targetElement1) {
      targetElement1.style.display = 'none';
      targetElement1.style.visibility = 'hidden';
    } else {
      alert('未找到浏览器版本低的提示');
    }
    
    rendering();
  });





  //window.addEventListener("load", rendering());

  function rendering() {
    var allsText = document.querySelector('.body-content').innerHTML;


    function makeallcolor(searchVal, nColor, tot) {
      searchVal = " " + searchVal;
      var sKey = "<span name='addSpan' style='color:" + nColor + "';>" + " " + "<sup>" + tot + "</sup>" + searchVal + "</span>";
      var num = -1;
      var rStr = new RegExp(searchVal, "g");
      var rHtml = new RegExp("\<.*?\>", "ig"); //匹配html元素
      var aHtml = allsText.match(rHtml); //存放html元素的数组
      allsText = allsText.replace(rHtml, '{~}'); //替换html标签
      allsText = allsText.replace(rStr, sKey); //替换key
      allsText = allsText.replace(/{~}/g, function() { //恢复html标签
        num++;
        return aHtml[num];
      });
    }


    function makecolor(searchVal, nColor, tot) {
      var oDiv = document.querySelector('.body-content');
      var sText = oDiv.innerHTML;

      var sKey = "<span name='addSpan' style='color:" + nColor + "';>" + " <sup>" + tot + "</sup> " + searchVal + "</span>";
      searchVal = " " + searchVal;

      var num = -1;
      var rStr = new RegExp(searchVal, "g");
      var rHtml = new RegExp("\<.*?\>", "ig"); //匹配html元素
      var aHtml = sText.match(rHtml); //存放html元素的数组
      sText = sText.replace(rHtml, '{~}'); //替换html标签
      sText = sText.replace(rStr, sKey); //替换key
      sText = sText.replace(/{~}/g, function() { //恢复html标签
        num++;
        return aHtml[num];
      });
      oDiv.innerHTML = sText;
    }


    //alert("开始整体染色1");



    let list_value = GM_listValues();

    for (var i = 0; i < list_value.length; i++) {

      let tot = GM_getValue(list_value[i], 0);

      makeallcolor(list_value[i], "red", tot);
    }
    document.querySelector('.body-content').innerHTML = allsText;


    //监听选择文本的动作
    var selectionFirst = null;
    var selectionSecond = null;
    document.addEventListener("selectionchange", () => {
      selectionFirst = selectionSecond;
      selectionSecond = document.getSelection()
        .toString();

    });


    //alert("整体染色结束1");


    //alert("开始渲染按钮");
    let div = document.createElement("div");
    div.style = "position:fixed; z-index:90;bottom:20px; left: 0; margin: auto; right: 0;text-align:center;"
    div.innerHTML = '<span id="biaozhubiaozhu"style="width:150rpx;z-index:100;margin:15px;background-color: red;font-size: 30px;border-color: red;border-radius: 5px;" >标注</span><span id="quxiaobiaozhu" style="width:150rpx;margin:15px;background-color: black;font-size: 30px;color: white;border-radius: 5px;">取消</span>';


    document.onclick = function(event) {
      if (event.target.id == "biaozhubiaozhu") {

        selectionFirst = selectionSecond; //在有些浏览器，需要把这句去除
        if (selectionFirst !== null && selectionFirst !== void 0 && selectionFirst.toString()) {
          let tot = GM_getValue(selectionFirst, 0);

          GM_setValue(selectionFirst, tot + 1);
          if (tot == 0)
            makecolor(selectionFirst, "red", tot + 1);
        }

      } else if (event.target.id == "quxiaobiaozhu") {

        selectionFirst = selectionSecond; //在有些浏览器，需要把这句去除

        if (selectionFirst !== null && selectionFirst !== void 0 && selectionFirst.toString()) {
          GM_deleteValue(selectionFirst)
        }
      }
    };
    document.body.append(div);




  }




})();