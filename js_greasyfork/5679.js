/**
 * @param obj - {
 *  sel: 'a',                    // the selector you want to wait for (optional)
 *  context: document.body,      // scope of search for selector or mutations (optional, default document.body)
 *  stop: true,                  // stop waiting after first result (optional, default false)
 *  mode: 'M',                   // M to use mutation observer, S to use setInterval (optional, default M)
 *  onchange: func,              // if using mode 'M' this function will be called whenever mutation handler triggers
 *  onmatch: func,               // if selector is specified function will be called for each match with element as parameter
 *  config: { attributes: true } // if using mode 'M' this object will override settings passed to mutation observer
 * }
 */
function waitForElems(obj) {
  var tick;
  var id = 'fke' + Math.floor(Math.random() * 12345);
  var type = window.MutationObserver ? (obj.mode || 'M') : 'S';
  var lastMutation = Date.now();
  var lastCall = Date.now();
  var context = obj.context || document.body;
  var sel = obj.sel;
  var config = obj.config || {
    subtree: true,
    childList: true
  };
  var onChange = obj.onchange;
  var queuedCall;

  function throttle(func) {
    var now = Date.now();
    clearTimeout(queuedCall);
    // less than 100ms since last mutation
    if (now - lastMutation < 100) {
      // 500ms or more since last query
      if (now - lastCall >= 500) {
        func();
      } else {
        queuedCall = setTimeout(func, 100);
      }
    } else {
      func();
    }
    lastMutation = now;
  }

  function findElem(sel) {
    lastCall = Date.now();
    var found = [].filter.call(context.querySelectorAll(sel), function(elem) {
      return elem.dataset[id] !== 'y';
    });
    if (found.length > 0) {
      if (obj.stop) {
        type === 'M' ? tick.disconnect() : clearInterval(tick);
      }
      found.forEach(function(elem) {
        elem.dataset[id] = 'y';
        obj.onmatch(elem);
      });
    }
  }
  if (type === 'M') {
    tick = new MutationObserver(function() {
      if (sel) throttle.call(null, findElem.bind(null, sel));
      if (onChange) onChange.apply(this, arguments);
    });
    tick.observe(context, config);
  } else {
    tick = setInterval(findElem.bind(null, sel), 300);
  }
  if (sel) findElem(sel);
  return {
    type: type,
    stop: function() {
      if (type === 'M') {
        tick.disconnect();
      } else {
        clearInterval(tick);
      }
    },
    resume: function() {
      if (type === 'M') {
        tick.observe(context, config);
      } else {
        tick = setInterval(findElem.bind(null, sel), 300);
      }
    }
  };
}
/**
 * @param regex - should match the site you're waiting for
 * @param action - the callback that will be executed when a matching url is visited
 * @param stopLooking - if true the function will stop waiting for another url match after the first match
 */
function waitForUrl(regex, action, stopLooking) {
  function checkUrl(urlTest) {
    var url = window.location.href;
    if (url !== lastUrl && urlTest(url)) {
      if (stopLooking) {
        clearInterval(tick);
      }
      lastUrl = url;
      action();
    }
    lastUrl = url;
  }
  var urlTest = (typeof regex === 'function' ? regex : regex.test.bind(regex)),
    tick = setInterval(checkUrl.bind(null, urlTest), 300),
    lastUrl;
  checkUrl(urlTest);
  return tick;
}
