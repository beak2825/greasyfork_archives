// ==UserScript==
// @author James Edward Lewis II
// @description This makes the browser support emoji by using native fonts if possible and a fallback if not.
// @name Emoji Polyfill
// @namespace greasyfork.org
// @version 1.0.28
// @icon https://rawgit.com/lewisje/Chromoji/simple/icon16.png
// @include *
// @license MIT
// @grant none
// @run-at document-start
// @copyright 2015 James Edward Lewis II
// @downloadURL https://update.greasyfork.org/scripts/8598/Emoji%20Polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/8598/Emoji%20Polyfill.meta.js
// ==/UserScript==

/*!
 * Shim for MutationObserver interface
 * Author: Graeme Yeates (github.com/megawac)
 * Repository: https://github.com/megawac/MutationObserver.js
 * License: WTFPL V2, 2004 (wtfpl.net).
 * Though credit and staring the repo will make me feel pretty, you can modify and redistribute as you please.
 * Attempts to follow spec (http:// www.w3.org/TR/dom/#mutation-observers) as closely as possible for native javascript
 * See https://github.com/WebKit/webkit/blob/master/Source/WebCore/dom/MutationObserver.cpp for current webkit source c++ implementation
 */
/**
 * prefix bugs:
    - https://bugs.webkit.org/show_bug.cgi?id=85161
    - https://bugzilla.mozilla.org/show_bug.cgi?id=749920
 * Don't use WebKitMutationObserver as Safari (6.0.5-6.1) use a buggy implementation
*/
window.MutationObserver = window.MutationObserver || window.MozMutationObserver || (function (window, undefined) {
  'use strict';
  var hasOwn = Object.hasOwnProperty;
  /**
   * @param {function(Array.<mutationRecord>, MutationObserver)} listener
   * @constructor
   */
  function MutationObserver(listener) {
    /**
     * @type {Array.<Object>}
     * @private
     */
    if (!(this instanceof MutationObserver)) return new MutationObserver(listener);
    this._watched = [];
    /** @private */
    this._listener = listener;
  }
  /**
   * Start a recursive timeout function to check all items being observed for mutations
   * @type {MutationObserver} observer
   * @private
   */
  function startMutationChecker(observer) {
    function check() {
      var mutations = observer.takeRecords();
      if (mutations.length) // fire away
        // calling the listener with context is not spec but currently consistent with FF and WebKit
        observer._listener(mutations, observer);
      /** @private */
      observer._timeout = setTimeout(check, MutationObserver._period);
    }
    check();
  }
  /**
   * Period to check for mutations (~32 times/sec)
   * @type {number}
   * @expose
   */
  MutationObserver._period = 30; /*ms+runtime*/
  /**
   * Exposed API
   * @expose
   * @final
   */
  MutationObserver.prototype = {
    /**
     * see http:// dom.spec.whatwg.org/#dom-mutationobserver-observe
     * not going to throw here but going to follow the current spec config sets
     * @param {Node|null} $target
     * @param {Object|null} config : MutationObserverInit configuration dictionary
     * @expose
     * @return undefined
     */
    observe: function ($target, config) {
      /**
       * Using slightly different names so closure can go ham
       * @type {!Object} : A custom mutation config
       */
      var settings = {
        attr: !!(config.attributes || config.attributeFilter || config.attributeOldValue),
        // some browsers are strict in their implementation that config.subtree and childList must be set together. We don't care - spec doesn't specify
        kids: !!config.childList, descendents: !!config.subtree,
        charData: !!(config.characterData || config.characterDataOldValue)
      }, watched = this._watched, i = 0;
      // remove already observed target element from pool
      for (; i < watched.length; i++) if (watched[i].tar === $target) watched.splice(i, 1);
      if (config.attributeFilter)
        /**
         * converts to a {key: true} dict for faster lookup
         * @type {Object.<String,Boolean>}
         */
        settings.afilter = reduce(config.attributeFilter, function (a, b) {
          a[b] = true;
          return a;
        }, {});
      watched.push({
        tar: $target,
        fn: createMutationSearcher($target, settings)
      });
      // reconnect if not connected
      if (!this._timeout) startMutationChecker(this);
    },
    /**
     * Finds mutations since last check and empties the "record queue" i.e. mutations will only be found once
     * @expose
     * @return {Array.<mutationRecord>}
     */
    takeRecords: function () {
      var mutations = [], watched = this._watched, wl = watched.length, i = 0;
      for (; i < wl; i++) watched[i].fn(mutations);
      return mutations;
    },
    /**
     * @expose
     * @return undefined
     */
    disconnect: function () {
      this._watched = []; // clear the stuff being observed
      clearTimeout(this._timeout); // ready for garbage collection
      /** @private */
      this._timeout = null;
    }
  };
  /**
   * @param {Object} obj
   * @param {(string|number)} prop
   * @return {boolean}
   */
  function has(obj, prop) {
    return hasOwn.call(obj, prop) && typeof obj[prop] !== 'undefined'; // will be nicely inlined by gcc
  }
  /**
   * Simple mutationRecord pseudoclass. No longer exposing as its not fully compliant
   * @param {Object} data
   * @return {Object} a mutationRecord
   */
  function mutationRecord(data) {
    var settings = { // technically these should be on proto so hasOwnProperty will return false for non explicitly set props
      type: null, target: null, addedNodes: [], removedNodes: [], previousSibling: null,
      nextSibling: null, attributeName: null, attributeNamespace: null, oldValue: null
    }, prop;
    for (prop in data) if (has(settings, prop) && has(data, prop)) settings[prop] = data[prop];
    return settings;
  }
  /**
   * Creates a func to find all the mutations
   *
   * @param {Node} $target
   * @param {!Object} config : A custom mutation config
   */
  function createMutationSearcher($target, config) {
    /** type {Elestuct} */
    var $oldstate = clone($target, config); // create the cloned datastructure
    /**
     * consumes array of mutations we can push to
     *
     * @param {Array.<mutationRecord>} mutations
     */
    return function (mutations) {
      var olen = mutations.length, dirty;
      // Alright we check base level changes in attributes... easy
      if (config.attr && $oldstate.attr) findAttributeMutations(mutations, $target, $oldstate.attr, config.afilter);
      // check childlist or subtree for mutations
      if (config.kids || config.descendents) dirty = searchSubtree(mutations, $target, $oldstate, config);
      // reclone data structure if theres changes
      if (dirty || mutations.length !== olen) /** type {Elestuct} */ $oldstate = clone($target, config);
    };
  }
  /* attributes + attributeFilter helpers */
  /**
   * fast helper to check to see if attributes object of an element has changed
   * doesnt handle the textnode case
   *
   * @param {Array.<mutationRecord>} mutations
   * @param {Node} $target
   * @param {Object.<string, string>} $oldstate : Custom attribute clone data structure from clone
   * @param {Object} filter
   */
  function findAttributeMutations(mutations, $target, $oldstate, filter) {
    var checked = {}, attributes = $target.attributes, i = attributes.length, attr, name;
    while (i--) {
      attr = attributes[i];
      name = attr.name;
      if (!filter || has(filter, name)) {
        if (attr.value !== $oldstate[name])
          // The pushing is redundant but gzips very nicely
          mutations.push(mutationRecord({
            type: 'attributes', target: $target, attributeName: name, oldValue: $oldstate[name],
            attributeNamespace: attr.namespaceURI // in ie<8 it incorrectly will return undefined
          }));
        checked[name] = true;
      }
    }
    for (name in $oldstate)
      if (!(checked[name]) && $oldstate.hasOwnProperty(name))
        mutations.push(mutationRecord({target: $target, type: 'attributes', attributeName: name, oldValue: $oldstate[name]}));
  }
  /**
   * searchSubtree: array of mutations so far, element, element clone, bool
   * synchronous dfs comparision of two nodes
   * This function is applied to any observed element with childList or subtree specified
   * Sorry this is kind of confusing as shit, tried to comment it a bit...
   * codereview.stackexchange.com/questions/38351 discussion of an earlier version of this func
   *
   * @param {Array} mutations
   * @param {Node} $target
   * @param {!Object} $oldstate : A custom cloned node from clone()
   * @param {!Object} config : A custom mutation config
   */
  function searchSubtree(mutations, $target, $oldstate, config) {
    // Track if the tree is dirty and has to be recomputed (#14).
    var dirty;
    /*
     * Helper to identify node rearrangment and stuff...
     * There is no gaurentee that the same node will be identified for both added and removed nodes
     * if the positions have been shuffled.
     * conflicts array will be emptied by end of operation
     */
    function resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes) {
      // the distance between the first conflicting node and the last
      var distance = conflicts.length - 1,
      // prevents same conflict being resolved twice consider when two nodes switch places.
      // only one should be given a mutation event (note -~ is used as a math.ceil shorthand)
        counter = -~((distance - numAddedNodes) / 2), conflict = conflicts.pop(), $cur, oldstruct;
      while (conflict) {
        $cur = $kids[conflict.i];
        oldstruct = $oldkids[conflict.j];
        // attempt to determine if there was node rearrangement... won't gaurentee all matches
        // also handles case where added/removed nodes cause nodes to be identified as conflicts
        if (config.kids && counter && Math.abs(conflict.i - conflict.j) >= distance) {
          mutations.push(mutationRecord({
            type: 'childList', target: node, addedNodes: [$cur], removedNodes: [$cur],
            // haha don't rely on this please
            nextSibling: $cur.nextSibling, previousSibling: $cur.previousSibling
          }));
          counter--; // found conflict
        }
        // Alright we found the resorted nodes now check for other types of mutations
        if (config.attr && oldstruct.attr) findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
        if (config.charData && $cur.nodeType === 3 && $cur.nodeValue !== oldstruct.charData)
          mutations.push(mutationRecord({type: 'characterData', target: $cur}));
        // now look @ subtree
        if (config.descendents) findMutations($cur, oldstruct);
        conflict = conflicts.pop();
      }
    }
    /**
     * Main worker. Finds and adds mutations if there are any
     * @param {Node} node
     * @param {!Object} old : A cloned data structure using internal clone
     */
    function findMutations(node, old) {
      var $kids = node.childNodes, $oldkids = old.kids, klen = $kids.length,
        olen = $oldkids ? $oldkids.length : 0; // $oldkids will be undefined for text and comment nodes
      // if (!olen && !klen) return; // both empty; clearly no changes
      // we delay the intialization of these for marginal performance in the expected case (actually quite signficant on large subtrees when these would be otherwise unused)
      // map of checked element of ids to prevent registering the same conflict twice
      var map, // array of potential conflicts (ie nodes that may have been re arranged)
        conflicts, id, // element id from getElementId helper
        idx, // index of a moved or inserted element
        oldstruct, $cur, $old, // current and old nodes
        numAddedNodes = 0, // track the number of added nodes so we can resolve conflicts more accurately
        i = 0, j = 0; // iterate over both old and current child nodes at the same time
      while (i < klen || j < olen) { // while there is still anything left in $kids or $oldkids (same as i < $kids.length || j < $oldkids.length;)
        $cur = $kids[i]; // current and old nodes at the indexes
        oldstruct = $oldkids[j];
        $old = oldstruct && oldstruct.node;
        if ($cur === $old) { // expected case - optimized for this case
          // check attributes as specified by config
          if (config.attr && oldstruct.attr) /* oldstruct.attr instead of textnode check */ findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
          // check character data if node is a comment or textNode and it's being observed
          if (config.charData && oldstruct.charData !== undefined && $cur.nodeValue !== oldstruct.charData)
            mutations.push(mutationRecord({type: 'characterData', target: $cur}));
          // resolve conflicts; it will be undefined if there are no conflicts - otherwise an array
          if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
          // recurse on next level of children. Avoids the recursive call when there are no children left to iterate
          if (config.descendents && ($cur.childNodes.length || oldstruct.kids && oldstruct.kids.length)) findMutations($cur, oldstruct);
          i++; j++;
        } else { // (uncommon case) lookahead until they are the same again or the end of children
          dirty = true;
          if (!map) { // delayed initalization (big perf benefit)
            map = {};
            conflicts = [];
          }
          if ($cur) {
            // check id is in the location map otherwise do a indexOf search
            if (!(map[id = getElementId($cur)])) { // to prevent double checking
              // mark id as found
              map[id] = true;
              // custom indexOf using comparitor checking oldkids[i].node === $cur
              if ((idx = indexOfCustomNode($oldkids, $cur, j)) === -1)
                if (config.kids) {
                  mutations.push(mutationRecord({
                    type: 'childList', target: node,
                    addedNodes: [$cur], // $cur is a new node
                    nextSibling: $cur.nextSibling, previousSibling: $cur.previousSibling
                  }));
                  numAddedNodes++;
                }
              else conflicts.push({i: i, j: idx}); // add conflict
            }
            i++;
          }
          if ($old &&
           // special case: the changes may have been resolved: i and j appear congurent so we can continue using the expected case
           $old !== $kids[i]
          ) {
            if (!(map[id = getElementId($old)])) {
              map[id] = true;
              if ((idx = indexOf($kids, $old, i)) === -1)
                if (config.kids) {
                  mutations.push(mutationRecord({
                    type: 'childList', target: old.node, removedNodes: [$old],
                    nextSibling: $oldkids[j + 1], // praise no indexoutofbounds exception
                    previousSibling: $oldkids[j - 1]
                  }));
                  numAddedNodes--;
                }
              else conflicts.push({i: idx, j: j});
            }
            j++;
          }
        }// end uncommon case
      }// end loop
      // resolve any remaining conflicts
      if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
    }
    findMutations($target, $oldstate);
    return dirty;
  }
  /**
   * Utility
   * Clones a element into a custom data structure designed for comparision. https://gist.github.com/megawac/8201012
   *
   * @param {Node} $target
   * @param {!Object} config : A custom mutation config
   * @return {!Object} : Cloned data structure
   */
  function clone($target, config) {
    var recurse = true; // set true so childList we'll always check the first level
    function copy($target) {
      var elestruct = {/** @type {Node} */ node: $target};
      // Store current character data of target text or comment node if the config requests
      // those properties to be observed.
      if (config.charData && ($target.nodeType === 3 || $target.nodeType === 8)) elestruct.charData = $target.nodeValue;
      // its either a element, comment, doc frag or document node
      else {
        // Add attr only if subtree is specified or top level and avoid if
        // attributes is a document object (#13).
        if (config.attr && recurse && $target.nodeType === 1)
          /**
           * clone live attribute list to an object structure {name: val}
           * @type {Object.<string, string>}
           */
          elestruct.attr = reduce($target.attributes, function(memo, attr) {
            if (!config.afilter || config.afilter[attr.name]) memo[attr.name] = attr.value;
            return memo;
          }, {});
        // whether we should iterate the children of $target node
        if (recurse && ((config.kids || config.charData) || (config.attr && config.descendents)))
          /** @type {Array.<!Object>} : Array of custom clone */
          elestruct.kids = map($target.childNodes, copy);
        recurse = config.descendents;
      }
      return elestruct;
    }
    return copy($target);
  }
  // GCC hack see http://stackoverflow.com/a/23202438/1517919
  function jsCompiler_renameProperty(a) {
    return a;
  }
  /**
   * **indexOf** find index of item in collection.
   * @param {Array|NodeList} set
   * @param {Object} item
   * @param {number} idx
   * @param {string} [prop] Property on set item to compare to item
   */
  function indexOf(set, item, _idx, prop) {
    var sl = set.length, idx = ~~_idx; // start idx is always given as this is internal
    for (; idx < sl; idx++) if ((prop ? set[idx][prop] : set[idx]) === item) return idx;
    return -1;
  }
  /**
   * indexOf an element in a collection of custom nodes
   *
   * @param {NodeList} set
   * @param {!Object} $node : A custom cloned node
   * @param {number} idx : index to start the loop
   * @return {number}
   */
  function indexOfCustomNode(set, $node, idx) {
    return indexOf(set, $node, idx, jsCompiler_renameProperty('node'));
  }
  // using a non id (eg outerHTML or nodeValue) is extremely naive and will run into issues with nodes that may appear the same like <li></li>
  var counter = 1, // don't use 0 as id (falsy)
  /** @const */
    expando = 'mo_id';
  /**
   * Attempt to uniquely id an element for hashing. We could optimize this for legacy browsers but it hopefully wont be called enough to be a concern
   *
   * @param {Node} $ele
   * @return {(string|number)}
   */
  function getElementId($ele) {
    try {return $ele.id || ($ele[expando] = $ele[expando] || counter++);}
    catch (o_O) { // ie <8 will throw if you set an unknown property on a text node
      try {return $ele.nodeValue;} // naive
      catch (shitie) {return counter++;} // when text node is removed: https://gist.github.com/megawac/8355978 :(
    }
  }
  /**
   * **map** Apply a mapping function to each item of a set
   * @param {Array|NodeList} set
   * @param {Function} iterator
   */
  function map(set, iterator) {
    var results = [], sl = set.length, index = 0;
    for (; index < sl; index++) results[index] = iterator(set[index], index, set);
    return results;
  }
  /**
   * **Reduce** builds up a single result from a list of values
   * @param {Array|NodeList|NamedNodeMap} set
   * @param {Function} iterator
   * @param {*} [memo] Initial value of the memo.
   */
  function reduce(set, iterator, mem) {
    var sl = set.length, memo = mem, index = 0;
    for (; index < sl; index++) memo = iterator(memo, set[index], index, set);
    return memo;
  }
  return MutationObserver;
})(window);
// main code
(function (Object, Function, Array, window, document, undefined) {
  'use strict';
  /* jshint elision: true */
  var emo = {
    /*And: ['https://lewisje.github.io/fonts/emojiAnd.eot?#iefix', , 'https://lewisje.github.io/fonts/emojiAnd.woff', , 'https://lewisje.github.io/fonts/emojiAnd.ttf',
      'https://lewisje.github.io/fonts/emojiAnd.svg#emojiAnd'],
    OSns: ['https://lewisje.github.io/fonts/emojiOSns.eot?#iefix', 'https://lewisje.github.io/fonts/emojiOSns.woff2', 'https://lewisje.github.io/fonts/emojiOSns.woff',
      'https://lewisje.github.io/fonts/emojiOSns.otf', 'https://lewisje.github.io/fonts/emojiOSns.ttf', 'https://lewisje.github.io/fonts/emojiOSns.svg#emojiOSns'],
    Sym: ['https://lewisje.github.io/fonts/emojiSym.eot?#iefix', 'https://lewisje.github.io/fonts/emojiSym.woff2', 'https://lewisje.github.io/fonts/emojiSym.woff', ,
      'https://lewisje.github.io/fonts/emojiSym.ttf', 'https://lewisje.github.io/fonts/emojiSym.svg#emojiSym'],*/
    Symb: ['https://lewisje.github.io/fonts/emojiSymb.eot?#iefix', 'https://lewisje.github.io/fonts/emojiSymb.woff2', 'https://lewisje.github.io/fonts/emojiSymb.woff', ,
      'https://lewisje.github.io/fonts/emojiSymb.ttf', 'https://lewisje.github.io/fonts/emojiSymb.svg#emojiSymb']
  }, /* jshint elision: false */ fontEmoRegex = /\s*(?:(?:"|')?Segoe\sUI\s(?:Emoji|Symbol)(?:"|')?|Symbola|EmojiSymb),?/g, headingRegex = /^h[1-6]$/i,
    roughEmoRegex = /[^\s\w\x00-\x22\x24-\x29\x2B-\x2F\x3A-\u203B\u2050-\u2116\u3040-\u31FF\u3299-\uD83B\uD83F-\uDBFF\uE537-\uF8FE\uF900-\uFFFF]/,
    upperRegex = /[\uD840-\uD869]/g, lowerRegex = /[\uDC00-\uDFFF]/g, surrogate = false, constructorRegex = /\s*class /,
    textRegex = /^(?:i?frame|link|(?:no)?script|style|textarea|#text)$/i, typs = ['embedded-opentype', 'woff2', 'woff', 'opentype', 'truetype', 'svg'],
    css = ['/* Injected by Emoji Polyfill */'], style = document.createElement('style'), arrProto = Array.prototype,
    funcProto = Function.prototype, fnToString = funcProto.toString, _toString = Object.prototype.toString,
    hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol',
    hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol',
    head = document.head || document.getElementsByTagName('head')[0], MutationObserver = window.MutationObserver,
    emoProp = hasSymbols ? Symbol('$emoji$') : '$emoji$' + (10 * Math.random()) + '$',
    observer = {}, observerConfig, body, fontExtender, addHandler, removeHandler, setImmediate,
    bind, filter, getStyle, delStyle, fnt, emofnt, typ, r, NATIVE_MUTATION_EVENTS;
  for (fnt in emo) if (emo.hasOwnProperty(fnt)) {
    if (fnt === 'Sym') css.push('\n/* Emoji Symbols Font (C) Blockworks - Kenichi Kaneko http://emojisymbols.com/ */');
    css.push('\n@font-face {\n  font-family: "Emoji' + fnt + '";\n  src: local("\u263A\uFE0E")');
    emofnt = emo[fnt];
    for (typ in emofnt) if (emofnt.hasOwnProperty(typ) && emofnt[typ]) css.push(',\n       url("' + emofnt[typ] + '") format("' + typs[typ] + '")');
    css.push(';\n}');
  }
  css = css.join('');
  style.type = 'text/css';
  if (style.styleSheet) style.styleSheet.cssText = css;
  else style.appendChild(document.createTextNode(css));
  head.appendChild(style);
  // part of a pair of functions intended to isolate code that kills the optimizing compiler
  // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
  function functionize(func, arg) { /* jshint evil: true */
    var typ = typeof func, thunk;
    if ('function' === typ || isCallable(func)) return func;
    if (func && 'string' === typ || ('object' === typ && '[object String]' === _toString.apply(func))) {
      trial(function () {thunk = arg ? new Function(String(arg), func) : new Function(func);}); // jshint evil: true
    }
    thunk = thunk || function thunk() {return func;};
    return thunk;
  }
  // The first argument to the toCatch callback is the caught error;
  // if toCatch is passed as a string, this argument must be named "e"
  function trial(toTry, toCatch, toFinal) {
    var _try = functionize(toTry),
      _catch = functionize(toCatch, '_'),
      _final = functionize(toFinal);
    try {_try();}
    catch (_) {_catch(_);}
    finally {_final();}
  }
  function tryFunctionObject(value) {
    try {fnToString.apply(value); return true;}
    catch (_) {return false;}
  }
  // Reference: https://github.com/ljharb/is-callable/
  function isCallable(fn) {
    var typ = typeof fn, callable = false, strClass;
    if (!fn) return false;
    if ('function' !== typ && 'object' !== typ && 'unknown' !== typ) return false;
    if (constructorRegex.test(fn)) return false; // 'unknown' means callable ActiveX in IE<9
    if (hasToStringTag) return tryFunctionObject(fn);
    strClass = _toString.apply(fn);
    trial(function () {fn.apply(this, new Array(fn.length || 0)); callable = true;});
    return '[object Function]' === strClass || '[object GeneratorFunction]' === strClass || callable;
  }
  function hasMethod(obj, key) {
    return key in obj && isCallable(obj[key]);
  }
  // Production steps of ECMA-262, Edition 5, 15.3.4.5
  // Reference: https://es5.github.io/#x15.3.4.5
  if (hasMethod(funcProto, 'bind')) bind = funcProto.call.bind(funcProto.bind);
  else bind = function bind(func, oThis) {
    var i = arguments.length - 2, aArgs = i < 1 ? [] : new Array(i), fToBind = functionize(func), FNOP, fBound;
    if (i >= 0) while (i--) aArgs[i] = arguments[i + 2];
    FNOP = function FNOP() {};
    if (fToBind.prototype) FNOP.prototype = fToBind.prototype;
    fBound = function fBound() { // jshint validthis: true
      var i = arguments.length, args = new Array(i);
      while (i--) args[i] = arguments[i];
      return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(args));
    };
    fBound.prototype = new FNOP();
    return fBound;
  };
  // Production steps of ECMA-262, Edition 5, 15.4.4.20
  // Reference: https://es5.github.io/#x15.4.4.20
  if (hasMethod(arrProto, 'filter')) filter = bind(funcProto.call, arrProto.filter);
  else filter = function filter(arr, callback, thisArg) { // jshint validthis: true
    if (!arr) return arr;
    if (!isCallable(callback)) throw new TypeError('callback must be a function');
    var t = (typeof arr === 'string') ? arr.split('') : Object(arr), len = t.length >>> 0,
      res = [], i = 0, val;
    for (; i < len; i++) if (i in t) {
      val = t[i];
      if (callback.call(thisArg, val, i, t)) res[res.length] = val;
    }
    return res;
  };
  // via Douglas Crockford
  function walk(nod, fnc) {
    var func = functionize(fnc), node = nod;
    if (!func(node)) return;
    node = node.firstChild;
    while (node) {
      walk(node, func);
      node = node.nextSibling;
    }
  }
  /*!
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   *
   */
  // @win window reference
  // @fn function reference
  function contentLoaded(win, fn, cap) {
    var done = false, _top = true, doc = win.document, root = doc.documentElement,
      w3c = 'addEventListener' in doc, add = w3c ? 'addEventListener' : 'attachEvent',
      rem = w3c ? 'removeEventListener' : 'detachEvent', pre = w3c ? '' : 'on',
      capt = w3c && cap, startPoll;
    function init(e) {
      if (e.type === 'readystatechange' && doc.readyState !== 'complete') return;
      (e.type === 'load' ? win : doc)[rem](pre + e.type, init, capt);
      if (!done && (done = true)) fn.call(win, e.type || e);
    }
    function poll() {
      startPoll = true;
      trial(function () {root.doScroll('left');}, function () {setTimeout(poll, 50); startPoll = false;});
      if (startPoll) init('poll');
    }
    if (doc.readyState === 'complete') fn.call(win, 'lazy');
    else {
      if (doc.createEventObject && root.doScroll) {
        trial(function () {_top = !win.frameElement;});
        if (_top) poll();
      }
      doc[add](pre + 'DOMContentLoaded', init, capt);
      doc[add](pre + 'readystatechange', init, capt);
      win[add](pre + 'load', init, capt);
    }
    return init;
  }
  // partly inspired by cb_addEventListener from Eduardo Cereto, partly by EventUtil from Nicolas C. Zakas
  // https://gist.github.com/eduardocereto/955642
  // http://www.wrox.com/WileyCDA/WroxTitle/Professional-JavaScript-for-Web-Developers-3rd-Edition.productCd-1118026691,descCd-DOWNLOAD.html
  addHandler = function (obj, evt, fnc, cap) {
    if (hasMethod(window, 'addEventListener')) {
      addHandler = function addHandler(obj, evt, fnc, cap) { // W3C model
        var objt = Object(obj), evnt = String(evt), func = functionize(fnc), capt = !!cap;
        if (evnt === 'DOMContentLoaded') return contentLoaded(window, func, capt);
        objt.addEventListener(evnt, func, capt);
        return func;
      };
    } else if (hasMethod(window, 'attachEvent')) {
      addHandler = function addHandler(obj, evt, fnc/*, cap*/) { // old Microsoft model
        var objt = Object(obj), evnt = String(evt), func = functionize(fnc), bound;
        if (evnt === 'DOMContentLoaded') return contentLoaded(window, func, false);
        bound = bind(func, objt, evnt);
        objt.attachEvent('on' + evnt, bound);
        return bound;
      };
    } else { // Browser doesn't support W3C or MSFT model, go on with traditional
      addHandler = function addHandler(obj, evt, fnc/*, cap*/) {
        var objt = Object(obj), evnt = 'on' + String(evt), func = functionize(fnc);
        if (evnt === 'onDOMContentLoaded') {
          objt = window;
          evnt = 'onload';
        }
        if (hasMethod(objt, evnt)) {
          // Object already has a function on traditional
          // Let's wrap it with our own function inside another function
          func = (function (f1, f2) {
            function wrapped() { // jshint validthis: true
              var args = [], len = arguments.length, i = 0;
              for (; i < len; i++) args.push(arguments[i]);
              f1.apply(this, args);
              f2.apply(this, args);
            }
            return wrapped;
          })(objt[evnt], func);
        }
        objt[evnt] = func;
        return func;
      };
    }
    return addHandler(obj, evt, fnc, cap);
  };
  removeHandler = function (obj, evt, fnc, cap) {
    if (hasMethod(window, 'removeEventListener')) {
      removeHandler = function removeHandler(obj, evt, fnc, cap) {  // W3C model
        var objt = Object(obj), evnt = String(evt), func = functionize(fnc), capt = !!cap;
        if (evnt === 'DOMContentLoaded') {
          window.removeEventListener('load', func, capt);
          document.removeEventListener('readystatechange', func, capt);
        }
        objt.removeEventListener(evnt, func, capt);
        return func;
      };
    } else if (hasMethod(window, 'detachEvent')) {
      removeHandler = function removeHandler(obj, evt, fnc/*, cap*/) {  // old Microsoft model
        var objt = Object(obj), evnt = 'on' + String(evt), func = functionize(fnc);
        if (evnt === 'onDOMContentLoaded') {
          window.detachEvent('onload', func);
          document.detachEvent('onreadystatechange', func);
        }
        objt.detachEvent(evnt, func);
        return func;
      };
    } else {
      removeHandler = function removeHandler(obj, evt/*, fnc, cap*/) { // traditional
        var objt = Object(obj), evnt = 'on' + String(evt), func;
        if (evnt === 'onDOMContentLoaded') {
          objt = window;
          evnt = 'onload';
        }
        if (hasMethod(objt, evnt)) {
          func = objt[evnt];
          objt[evnt] = null;
        }
        return func;
      };
    }
    return removeHandler(obj, evt, fnc, cap);
  };
  // https://github.com/lewisje/setImmediate-shim-demo/blob/gh-pages/setImmediate.js
  setImmediate = (function (Object, Array, global, undefined) {
    var noNative, doc, slice, toString, timer, polyfill;
    // See http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
    function notUseNative() {
      return global.navigator && /Trident/.test(global.navigator.userAgent);
    }
    noNative = notUseNative();
    if (!noNative && (global.msSetImmediate || global.setImmediate)) {
      if (!global.setImmediate) {
        global.setImmediate = global.msSetImmediate;
        global.clearImmediate = global.msClearImmediate;
      }
      return global.setImmediate;
    }
    doc = global.document;
    slice = Array.prototype.slice;
    toString = Object.prototype.toString;
    timer = {polyfill: {}, nextId: 1, tasks: {}, lock: false};
    timer.run = function (handleId) {
      var task;
      if (timer.lock) global.setTimeout(timer.wrap(timer.run, handleId), 1);
      else {
        task = timer.tasks[handleId];
        if (task) {
          timer.lock = true;
          trial(task, null, function () {
            timer.clear(handleId);
            timer.lock = false;
          });
        }
      }
    };
    timer.wrap = function (handler) {
      var i = arguments.length - 1, args = i < 0 ? [] : new Array(i),
        func = typeof handler === 'function' ? handler : functionize(String(handler));
      if (i >= 0) while (i--) args[i] = arguments[i + 1];
      function wrapped() {
        return func.apply(null, args);
      }
      return wrapped;
    };
    timer.create = function (args) {
      timer.tasks[timer.nextId] = timer.wrap.apply(null, args);
      return timer.nextId++;
    };
    timer.clear = function (handleId) {
      delete timer.tasks[handleId];
    };
    timer.polyfill.messageChannel = function () {
      var channel = new global.MessageChannel();
      channel.port1.onmessage = function (event) {
        timer.run(+event.data);
      };
      function setImmediate() {
        var i = arguments.length, args = new Array(i), handleId;
        while (i--) args[i] = arguments[i];
        handleId = timer.create(args);
        channel.port2.postMessage(handleId);
        return handleId;
      }
      return setImmediate;
    };
    timer.polyfill.nextTick = function () {
      function setImmediate() {
        var i = arguments.length, args = new Array(i), handleId;
        while (i--) args[i] = arguments[i];
        handleId = timer.create(args);
        global.process.nextTick(timer.wrap(timer.run, handleId));
        return handleId;
      }
      return setImmediate;
    };
    timer.polyfill.postMessage = function () {
      var messagePrefix = 'setImmediate$' + Math.random() + '$';
      function onGlobalMessage(event) {
        if (event.source === global && typeof event.data === 'string' &&
            event.data.indexOf(messagePrefix) === 0) timer.run(+event.data.slice(messagePrefix.length));
      }
      function setImmediate() {
        var i = arguments.length, args = new Array(i), handleId;
        while (i--) args[i] = arguments[i];
        handleId = timer.create(args);
        global.postMessage(messagePrefix + handleId, '*');
        return handleId;
      }
      if (global.addEventListener) global.addEventListener('message', onGlobalMessage, false);
      else global.attachEvent('onmessage', onGlobalMessage);
      return setImmediate;
    };
    timer.polyfill.readyStateChange = function readyStateChange() {
      var html = doc.documentElement;
      function setImmediate() {
        var i = arguments.length, args = new Array(i), handleId,
          script = doc.createElement('script');
        while (i--) args[i] = arguments[i];
        handleId = timer.create(args);
        script.onreadystatechange = function () {
          timer.run(handleId);
          script.onreadystatechange = null;
          html.removeChild(script);
          script = null;
        };
        html.appendChild(script);
        return handleId;
      }
      return setImmediate;
    };
    timer.polyfill.setTimeout = function () {
      function setImmediate() {
        var i = arguments.length, args = new Array(i), handleId;
        while (i--) args[i] = arguments[i];
        handleId = timer.create(args);
        global.setTimeout(timer.wrap(timer.run, handleId), 1);
        return handleId;
      }
      return setImmediate;
    };
    function canUsePostMessage() {
      if (global.postMessage && !global.importScripts) {
        var asynch = true, oldOnMessage = global.onmessage;
        global.onmessage = function () {
          asynch = false;
        };
        global.postMessage('', '*');
        global.onmessage = oldOnMessage;
        return asynch;
      }
    }
    // Don't get fooled by e.g. browserify environments.
    // For Node.js before 0.9
    if (toString.call(global.process) === '[object process]') polyfill = 'nextTick';
    // For non-IE10 modern browsers
    else if (canUsePostMessage()) polyfill = 'postMessage';
    // For web workers, where supported
    else if (!noNative && global.MessageChannel) polyfill = 'messageChannel';
    // For IE 6-8
    else if (doc && ('onreadystatechange' in doc.createElement('script'))) polyfill = 'readyStateChange';
    // For older browsers
    else polyfill = 'setTimeout';
    // If supported, we should attach to the prototype of global,
    // since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && hasMethod(attachTo, 'setTimeout') ? attachTo : global;
    attachTo.setImmediate = timer.polyfill[polyfill]();
    attachTo.setImmediate.usepolyfill = polyfill;
    attachTo.msSetImmediate = attachTo.setImmediate;
    attachTo.clearImmediate = attachTo.msClearImmediate = timer.clear;
    return attachTo.setImmediate;
  })(Object, Array, window);
  function isEdit(el) {
    var n = el.nodeName.toLowerCase();
    return (n === 'input' && el.type === 'text') || (n === 'textarea') || el.isContentEditable;
  }
  function astralTest(str) {
    if (surrogate) {
      surrogate = upperRegex.test(str);
      return !surrogate && !lowerRegex.test(str);
    }
    surrogate = upperRegex.test(str);
    return !surrogate;
  }
  function hasText(el) {
    var nodes = el.childNodes, n = nodes.length, nam = el.nodeName.toLowerCase(), node, val;
    if (n && nam !== 'select' && nam !== 'noframes')
      while (n--) {
        node = nodes[n];
        val = (node.nodeType === 3) ? node.nodeValue.match(roughEmoRegex) : null;
        if (val && val.length && filter(val, astralTest).join('')) return true;
      }
    return false;
  }
  getStyle = function (el, cssprop) {
    if (document.defaultView && hasMethod(document.defaultView, 'getComputedStyle'))
      getStyle = function getStyle(el, cssprop) {return document.defaultView.getComputedStyle(el, '')[cssprop];}; // W3C
    else if ('currentStyle' in el) getStyle = function getStyle(el, cssprop) {return el.currentStyle[cssprop];}; // IE8 and earlier
    else getStyle = function getStyle(el, cssprop) {return el.style[cssprop];}; // try to get inline style
    return getStyle(el, cssprop);
  };
  delStyle = function (el, cssprop) {
    var es = el.style;
    if (hasMethod(es, 'removeProperty')) delStyle = function delStyle(el, cssprop) {return el.style.removeProperty(cssprop);};
    else if (hasMethod(es, 'removeAttribute')) delStyle = function delStyle(el, cssprop) {return el.style.removeAttribute(cssprop);};
    else delStyle = function delStyle(el, cssprop) {el.style[cssprop] = ''; return null;};
    return delStyle(el, cssprop);
  };
  function fontExtend(el) {
    var font = getStyle(el, 'fontFamily').replace(fontEmoRegex, '') || 'monospace',
      newfont = 'font-family: ' + font + ", 'Segoe UI Emoji', 'Segoe UI Symbol', Symbola, EmojiSymb !important;";
    el[emoProp] = true;
    delStyle(el, 'fontFamily');
    if (headingRegex.test(el.nodeName)) {
      el.innerHTML = ['<span style="', newfont, '">', el.innerHTML, '</span>'].join('');
      el.firstChild[emoProp] = true;
    }
    else el.style.cssText += '; ' + newfont;
  }
  function fontExtendEdit(e) {
    var evt = e || window.event, el = evt.target || evt.srcElement;
    if (!el[emoProp] && isEdit(el)) fontExtend(el);
  }
  function fontExtendLoad(el) {
    if (!el) return false;
    if (!textRegex.test(el.nodeName) && !isEdit(el)) {
      if (!el[emoProp] && hasText(el)) setImmediate(bind(fontExtend, null, el));
      return true;
    }
    return false;
  }
  function fontExtendNode(e) {
    var evt = e || window.event;
    walk(evt.target || evt.srcElement, fontExtendLoad);
  }
  function init(/*e*/) {
    removeHandler(document, 'readystatechange', init, false);
    removeHandler(document, 'DOMContentLoaded', init, false);
    removeHandler(window, 'load', init, false);
    body = document.body || document.getElementsByTagName('body')[0] || document.getElementsByTagName('frameset')[0];
    fontExtender = bind(fontExtendNode, null, {target: body});
    fontExtender();
    observer.start();
  }
  addHandler(document, 'focus', fontExtendEdit, true);
  NATIVE_MUTATION_EVENTS = (function () {
    var f = false, root = document.documentElement, l = root.id;
    function e() {
      removeHandler(root, 'DOMAttrModified', e, false);
      NATIVE_MUTATION_EVENTS = true;
      root.id = l;
    }
    addHandler(root, 'DOMAttrModified', e, false);
    root.id = 'nw'; // now modify a property
    f = (root.id !== 'nw');
    root.id = l;
    return f;
  })();
  var mutate = function (e) {
    if (typeof e.length === 'number') mutate = function mutate(mutations) {
      var i = mutations.length, nodes, j;
      while (i--) {
        nodes = mutations[i].addedNodes;
        j = nodes.length;
        while (j--) walk(nodes[j], fontExtendLoad);
      }
    };
    else if (typeof e.target !== 'undefined') mutate = function mutate(e) {walk(e.target, fontExtendLoad);};
    else if (typeof e.srcElement !== 'undefined') mutate = function mutate(e) {walk(e.srcElement, fontExtendLoad);};
    else mutate = fontExtender;
    return mutate(e);
  };
  function onMutation(mutations) {
    observer.stop();
    mutate(mutations);
    observer.start();
  }
  if (MutationObserver) {
    observer = new MutationObserver(onMutation);
    observerConfig = {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true
    };
    observer.start = function () {
      observer.start = bind(observer.observe, observer, body, observerConfig);
      observer.start();
    };
    observer.stop = bind(observer.disconnect, observer);
  } else if (NATIVE_MUTATION_EVENTS) {
    observer.start = function () {
      //addHandler(body, 'DOMAttrModified', onMutation, false);
      //addHandler(body, 'DOMCharacterDataModified', onMutation, false);
      addHandler(body, 'DOMNodeInserted', onMutation, false);
      addHandler(body, 'DOMSubtreeModified', onMutation, false);
    };
    observer.stop = function () {
      //removeHandler(body, 'DOMAttrModified', onMutation, false);
      //removeHandler(body, 'DOMCharacterDataModified', onMutation, false);
      removeHandler(body, 'DOMNodeInserted', onMutation, false);
      removeHandler(body, 'DOMSubtreeModified', onMutation, false);
    };
  } else {
    observer.start = function () {
      observer.start = bind(addHandler, null, body, 'propertychange', onMutation, false);
      observer.start();
    };
    observer.stop = function () {
      observer.stop = bind(removeHandler, null, body, 'propertychange', onMutation, false);
      observer.stop();
    };
  }
  r = document.readyState;
  if (r === 'complete' || r === 'loaded' || r === 'interactive') init();
  else addHandler(document, 'DOMContentLoaded', init, false);
})(Object, Function, Array, window, document);
