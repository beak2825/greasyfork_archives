// ==UserScript==
// @name        DocsKeys (Vim for Google Docs)
// @namespace   http://tampermonkey.net/
// @version     1.3.4
// @description Vim-style keyboard shortcuts for Google Docs. Ported from the DocsKeys extension.
// @author      tirthd16 (Ported by icemoss)
// @license     MIT
// @match       https://docs.google.com/document/*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/562026/DocsKeys%20%28Vim%20for%20Google%20Docs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562026/DocsKeys%20%28Vim%20for%20Google%20Docs%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*
   * ======================================================================================
   * PART 1: INJECTED PAGE SCRIPT
   * This logic runs in the main page context to simulate keystrokes on the Docs iframe.
   * ======================================================================================
   */
  function pageContextScript() {
    // This script gets inserted into the page.
    // It receives requests from the content script to simulate keypresses.

    const simulateKeyEvent = function (eventType, el, args) {
      const event = document.createEvent('KeyboardEvent');
      Object.defineProperty(event, 'keyCode', {
        get() {
          return this.keyCodeVal;
        },
      });
      Object.defineProperty(event, 'which', {
        get() {
          return this.keyCodeVal;
        },
      });
      const mods = args.mods || {};
      event.initKeyboardEvent(
        eventType, // eventName
        true, // canBubble
        true, // canceleable
        document.defaultView, // view
        '', // keyIdentifier string
        false, // (not sure)
        !!mods.control, // control
        !!mods.alt, // alt
        !!mods.shift, // shift
        !!mods.meta, // meta
        args.keyCode, // keyCode
        args.keyCode // (not sure)
      );
      event.keyCodeVal = args.keyCode;
      Object.defineProperty(event, 'altKey', {
        get() {
          return !!mods.alt;
        },
      });
      Object.defineProperty(event, 'metaKey', {
        get() {
          return !!mods.meta;
        },
      });
      el.dispatchEvent(event);
    };

    // Helper to get the editor element dynamically
    function getEditorElement() {
      const iframe = document.querySelector('.docs-texteventtarget-iframe');
      if (iframe && iframe.contentDocument) {
        return iframe.contentDocument.activeElement;
      }
      return null;
    }

    window.addEventListener('doc-keys-simulate-keypress', function (event) {
      const args = event.detail;
      const editorEl = getEditorElement();
      if (editorEl) {
        simulateKeyEvent('keydown', editorEl, args);
        simulateKeyEvent('keyup', editorEl, args);
      }
    });
  }

  // Inject the page script
  const scriptElement = document.createElement('script');
  scriptElement.textContent = '(' + pageContextScript.toString() + ')();';
  document.documentElement.appendChild(scriptElement);

  /*
   * ======================================================================================
   * PART 2: CONTENT SCRIPT LOGIC
   * Handles Vim state, mode indication, and logic processing.
   * ======================================================================================
   */

  function initDocsKeys() {
    const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');

    if (!iframe || !iframe.contentDocument || !iframe.contentDocument.body) {
      setTimeout(initDocsKeys, 500);
      return;
    }

    console.log('DocsKeys: Initializing...');

    iframe.contentDocument.addEventListener('keydown', eventHandler, true);

    const cursorTop = document.getElementsByClassName('kix-cursor-top')[0];
    let mode = 'normal';
    let tempnormal = false;
    let replaceCharMode = false;
    let multipleMotion = {
      times: 0,
      mode: 'normal',
    };

    const isMac = /Mac/.test(navigator.platform || navigator.userAgent);

    const keyCodes = {
      backspace: 8,
      enter: 13,
      esc: 27,
      pageup: 33,
      pagedown: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
    };

    const wordModifierKey = isMac ? 'alt' : 'control';
    const paragraphModifierKey = isMac ? 'alt' : 'control';

    function wordMods(shift = false) {
      return { shift, [wordModifierKey]: true };
    }

    function paragraphMods(shift = false) {
      return { shift, [paragraphModifierKey]: true };
    }

    function sendKeyEvent(key, mods = {}) {
      const keyCode = keyCodes[key];
      const defaultMods = { shift: false, control: false, alt: false, meta: false };
      const args = { keyCode, mods: { ...defaultMods, ...mods } };

      let detailData = args;
      if (typeof cloneInto === 'function') {
        detailData = cloneInto(args, window);
      }

      window.dispatchEvent(
        new CustomEvent('doc-keys-simulate-keypress', {
          detail: detailData,
        })
      );
    }

    function repeatMotion(motion, times, key) {
      for (let i = 0; i < times; i++) {
        motion(key);
      }
    }

    function switchModeToVisual() {
      mode = 'visual';
      sendKeyEvent('right', { shift: true });
    }

    function switchModeToVisualLine() {
      mode = 'visualLine';
      sendKeyEvent('home');
      sendKeyEvent('end', { shift: true });
    }

    function switchModeToNormal() {
      if (mode == 'visualLine' || mode == 'visual') {
        sendKeyEvent('right');
        sendKeyEvent('left');
      }

      mode = 'normal';

      replaceCharMode = false;

      if(cursorTop) {
        cursorTop.style.opacity = 1;
        cursorTop.style.display = 'block';
        cursorTop.style.backgroundColor = 'black';
      }
    }

    function switchModeToInsert() {
      mode = 'insert';
      if(cursorTop) cursorTop.style.opacity = 0;
    }

    let longStringOp = '';

    function goToStartOfLine() { sendKeyEvent('home'); }
    function goToEndOfLine() { sendKeyEvent('end'); }
    function selectToStartOfLine() { sendKeyEvent('home', { shift: true }); }
    function selectToEndOfLine() { sendKeyEvent('end', { shift: true }); }
    function selectToStartOfWord() { sendKeyEvent('left', wordMods(true)); }
    function selectToEndOfWord() { sendKeyEvent('right', wordMods(true)); }
    function goToEndOfWord() { sendKeyEvent('right', wordMods()); }
    function goToStartOfWord() { sendKeyEvent('left', wordMods()); }
    function selectInnerWord() {
      sendKeyEvent('left');
      sendKeyEvent('left', wordMods());
      sendKeyEvent('right', wordMods(true));
    }
    function goToTop() {
      sendKeyEvent('home', { control: true, shift: true });
      longStringOp = '';
    }
    function selectToEndOfPara() { sendKeyEvent('down', paragraphMods(true)); }
    function goToEndOfPara(shift = false) {
      sendKeyEvent('down', paragraphMods(shift));
      sendKeyEvent('right', { shift });
    }
    function goToStartOfPara(shift = false) { sendKeyEvent('up', paragraphMods(shift)); }
    function addLineTop() {
      goToStartOfLine();
      sendKeyEvent('enter');
      sendKeyEvent('up');
      switchModeToInsert();
    }
    function addLineBottom() {
      goToEndOfLine();
      sendKeyEvent('enter');
      switchModeToInsert();
    }
    function handleAppend() {
      const cursor = document.getElementsByClassName('kix-cursor-top')[0];
      if (!cursor) {
        sendKeyEvent('right');
        switchModeToInsert();
        return;
      }
      const originalTop = cursor.getBoundingClientRect().top;
      sendKeyEvent('right');
      setTimeout(() => {
        const newTop = cursor.getBoundingClientRect().top;
        if (newTop > originalTop + 10) {
          sendKeyEvent('left');
        }
        switchModeToInsert();
      }, 20);
    }
    function runLongStringOp(operation = longStringOp) {
      switch (operation) {
        case 'c': clickMenu(menuItems.cut); switchModeToInsert(); break;
        case 'd': clickMenu(menuItems.cut); mode = 'normal'; switchModeToNormal(); break;
        case 'y': clickMenu(menuItems.copy); sendKeyEvent('left'); switchModeToNormal(); break;
        case 'p': clickMenu(menuItems.paste); switchModeToNormal(); break;
        case 'v': break;
        case 'g': goToTop(); break;
      }
    }

    function waitForSecondInput(key) {
      switch (key) {
        case 'w': goToStartOfWord(); waitForFirstInput(key); break;
        case 'p': goToStartOfPara(); waitForFirstInput(key); break;
        default: switchModeToNormal(); break;
      }
    }

    function waitForTextObject(key) {
      switch (key) {
        case 'w': selectInnerWord(); runLongStringOp(); break;
        default: switchModeToNormal(); break;
      }
    }

    function waitForFirstInput(key) {
      switch (key) {
        case 'i': mode = 'waitForTextObject'; break;
        case 'a': mode = 'waitForTextObject'; break;
        case 'w': selectToEndOfWord(); runLongStringOp(); break;
        case 'p': selectToEndOfPara(); runLongStringOp(); break;
        case '^': case '_': case '0': selectToStartOfLine(); runLongStringOp(); break;
        case '$': selectToEndOfLine(); runLongStringOp(); break;
        case longStringOp: goToStartOfLine(); selectToEndOfLine(); runLongStringOp(); break;
        default: switchModeToNormal();
      }
    }

    function waitForVisualInput(key) {
      switch (key) {
        case 'w': sendKeyEvent('left', { control: true }); goToStartOfWord(); selectToEndOfWord(); break;
        case 'p': goToStartOfPara(); goToEndOfPara(true); break;
      }
      mode = 'visualLine';
    }

    function handleMutlipleMotion(key) {
      if (/[0-9]/.test(key)) {
        multipleMotion.times = Number(String(multipleMotion.times) + key);
        return;
      }
      switch (multipleMotion.mode) {
        case 'normal': repeatMotion(handleKeyEventNormal, multipleMotion.times, key); break;
        case 'visualLine': case 'visual': repeatMotion(handleKeyEventVisualLine, multipleMotion.times, key); break;
      }
      mode = multipleMotion.mode;
    }

    function eventHandler(e) {
      if (['Shift', 'Meta', 'Control', 'Alt', ''].includes(e.key)) return;

      if (e.ctrlKey && mode === 'normal') {
        if (e.key === 'u') { e.preventDefault(); sendKeyEvent('pageup'); return; }
        if (e.key === 'd') { e.preventDefault(); sendKeyEvent('pagedown'); return; }
        if (e.key === 'r') { e.preventDefault(); clickMenu(menuItems.redo); return; }
      }

      if (e.ctrlKey && mode == 'insert' && e.key == 'o') {
        e.preventDefault(); e.stopImmediatePropagation();
        switchModeToNormal(); tempnormal = true; return;
      }


      if (mode === 'insert' && replaceCharMode) {
          if (e.key === 'Escape') {
              e.preventDefault();
              switchModeToNormal();
              return;
          }
          if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
              sendKeyEvent('delete');


              setTimeout(() => {
                  sendKeyEvent('left');
                  switchModeToNormal();
              }, 10);

              return;
          }
      }

      if (e.altKey || e.ctrlKey || e.metaKey) return;

      if (e.key == 'Escape') {
        e.preventDefault();
        if (mode == 'visualLine' || mode == 'visual') {
          sendKeyEvent('right');
        }
        switchModeToNormal();
        return;
      }

      if (mode != 'insert') {
        e.preventDefault();
        switch (mode) {
          case 'normal': handleKeyEventNormal(e.key); break;
          case 'visual': case 'visualLine': handleKeyEventVisualLine(e.key); break;
          case 'waitForFirstInput': waitForFirstInput(e.key); break;
          case 'waitForSecondInput': waitForSecondInput(e.key); break;
          case 'waitForVisualInput': waitForVisualInput(e.key); break;
          case 'waitForTextObject': waitForTextObject(e.key); break;
          case 'multipleMotion': handleMutlipleMotion(e.key); break;
        }
      }
    }

    function handleKeyEventNormal(key) {
      if (/[1-9]/.test(key)) {
        mode = 'multipleMotion'; multipleMotion.mode = 'normal'; multipleMotion.times = Number(key); return;
      }

      switch (key) {
        case 'h': sendKeyEvent('left'); break;
        case 'j': sendKeyEvent('down'); break;
        case 'k': sendKeyEvent('up'); break;
        case 'l': sendKeyEvent('right'); break;
        case '}': goToEndOfPara(); break;
        case '{': goToStartOfPara(); break;
        case 'b': goToStartOfWord(); break;
        case 'e': case 'w': goToEndOfWord(); break;
        case 'g': sendKeyEvent('home', { control: true }); break;
        case 'G': sendKeyEvent('end', { control: true }); break;
        case 'c': case 'd': case 'y': longStringOp = key; mode = 'waitForFirstInput'; break;
        case 'p': clickMenu(menuItems.paste); break;
        case 'a': handleAppend(); break;
        case 'i': switchModeToInsert(); break;
        case '^': case '_': case '0': goToStartOfLine(); break;
        case '$': goToEndOfLine(); break;
        case 'I': goToStartOfLine(); switchModeToInsert(); break;
        case 'A': goToEndOfLine(); switchModeToInsert(); break;
        case 'v': switchModeToVisual(); break;
        case 'V': switchModeToVisualLine(); break;
        case 'o': addLineBottom(); break;
        case 'O': addLineTop(); break;
        case 'u': clickMenu(menuItems.undo); break;

        case 'r':
          replaceCharMode = true;
          switchModeToInsert();
          break;

        case '/': clickMenu(menuItems.find); break;
        case 'x': sendKeyEvent('delete'); break;
        default: return;
      }
      if (tempnormal) {
        tempnormal = false;
        if (mode != 'visual' && mode != 'visualLine' && mode != 'waitForFirstInput' && mode != 'waitForTextObject') {
          switchModeToInsert();
        }
      }
    }

    function handleKeyEventVisualLine(key) {
      if (/[1-9]/.test(key)) {
        mode = 'multipleMotion'; multipleMotion.mode = 'visualLine'; multipleMotion.times = Number(key); return;
      }
      switch (key) {
        case '': break;
        case 'h': sendKeyEvent('left', { shift: true }); break;
        case 'j': sendKeyEvent('down', { shift: true }); break;
        case 'k': sendKeyEvent('up', { shift: true }); break;
        case 'l': sendKeyEvent('right', { shift: true }); break;
        case 'p': clickMenu(menuItems.paste); switchModeToNormal(); break;
        case '}': goToEndOfPara(true); break;
        case '{': goToStartOfPara(true); break;
        case 'b': selectToStartOfWord(); break;
        case 'e': case 'w': selectToEndOfWord(); break;
        case '^': case '_': case '0': selectToStartOfLine(); break;
        case '$': selectToEndOfLine(); break;
        case 'G': sendKeyEvent('end', { control: true, shift: true }); break;
        case 'g': sendKeyEvent('home', { control: true, shift: true }); break;
        case 'c': case 'd': case 'y': runLongStringOp(key); break;
        case 'i': case 'a': mode = 'waitForVisualInput'; break;
        case 'x': clickMenu(menuItems.cut); switchModeToNormal(); break;
      }
    }

    let menuItemElements = {};
    let menuItems = {
      copy: { parent: 'Edit', caption: 'Copy' },
      cut: { parent: 'Edit', caption: 'Cut' },
      paste: { parent: 'Edit', caption: 'Paste' },
      redo: { parent: 'Edit', caption: 'Redo' },
      undo: { parent: 'Edit', caption: 'Undo' },
      find: { parent: 'Edit', caption: 'Find' },
    };

    function clickMenu(itemCaption) {
      const item = getMenuItem(itemCaption);
      if(item) simulateClick(item);
    }

    function getMenuItem(menuItem, silenceWarning = false) {
      const caption = menuItem.caption;
      let el = menuItemElements[caption];
      if (el) return el;
      el = findMenuItem(menuItem);
      if (!el) {
        if (!silenceWarning) console.error('DocsKeys: Could not find menu item', menuItem.caption);
        return null;
      }
      return (menuItemElements[caption] = el);
    }

    function findMenuItem(menuItem) {
      activateTopLevelMenu(menuItem.parent);
      const menuItemEls = document.querySelectorAll('.goog-menuitem');
      const caption = menuItem.caption;
      const isRegexp = caption instanceof RegExp;
      for (const el of Array.from(menuItemEls)) {
        const label = el.innerText;
        if (!label) continue;
        if (isRegexp) { if (caption.test(label)) return el; }
        else { if (label.startsWith(caption)) return el; }
      }
      return null;
    }

    function simulateClick(el, x = 0, y = 0) {
      const eventSequence = ['mouseover', 'mousedown', 'mouseup', 'click'];
      for (const eventName of eventSequence) {
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent(eventName, true, true, window, 1, x, y, x, y, false, false, false, false, 0, null);
        el.dispatchEvent(event);
      }
    }

    function activateTopLevelMenu(menuCaption) {
      const buttons = Array.from(document.querySelectorAll('.menu-button'));
      const button = buttons.find((el) => el.innerText.trim() == menuCaption);
      if (!button) { console.error(`DocsKeys: Couldn't find top-level button ${menuCaption}`); return; }
      simulateClick(button);
      simulateClick(button);
    }

    switchModeToNormal();
  }

  function waitForDocs() {
    const editor = document.querySelector('.docs-texteventtarget-iframe');
    if (editor) { initDocsKeys(); }
    else { setTimeout(waitForDocs, 500); }
  }

  waitForDocs();
})();