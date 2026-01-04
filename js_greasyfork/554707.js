// ==UserScript==
// @name         Discord ENTER
// @namespace    https://example.com/discord-enter
// @version      2.4
// @description  Adds a badass button to Discord that simulates pressing Enter in the chat input.
// @author       Justn
// @match        https://discord.com/*
// @grant        none
// @locale       en
// @license      MIT
// @icon         https://discord.com/assets/favicon.ico
// ==/UserScript==

(() => {
  const btn = Object.assign(document.createElement('button'), {
    textContent: 'E',
    id: 'nuke-enter',
    onclick: () => {
      const box = document.querySelector('[data-slate-editor="true"]') ||
                  document.querySelector('div[role="textbox"]') ||
                  document.querySelector('textarea');
      if (!box) return console.log('no box');

      box.focus();
      ['keydown', 'keypress', 'keyup'].forEach(type => {
        box.dispatchEvent(new KeyboardEvent(type, {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        }));
      });
      console.log('NUKED');
    },
    style: `
      position:fixed; bottom:25px; right:20px; z-index:999999;
      padding:8px 10px; background:#5865F2; color:white;
      border:none; border-radius:4px; font-weight:bold; cursor:pointer;
      font-size:14px; line-height:14px;
    `
  });
  document.body.appendChild(btn);
  console.log('E NUKE armed');
})();