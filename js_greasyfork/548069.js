// ==UserScript==
// @name         Open2ch カラーテーマチェンジャー
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  おんJの背景色を変えられます
// @match        https://hayabusa.open2ch.net/test/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548069/Open2ch%20%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%86%E3%83%BC%E3%83%9E%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8%E3%83%A3%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/548069/Open2ch%20%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%86%E3%83%BC%E3%83%9E%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8%E3%83%A3%E3%83%BC.meta.js
// ==/UserScript==

/*コードの大部分はAIに書いてもらいました*/



(function () {
  'use strict';

  const cssForState = [
    /* 0: light */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #efefef;
  color: #161616;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #505ce5 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #cd3333 !important;
}
dd.body a:link, dd.body a:visited {
  color: #cd3333 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #161616 !important;
}
.name {
  color: #228b22 !important;
}
  a.num {
    color: #16161 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #c8c8c8;
  margin: 12px 0 4px;
}







    `,



    /* 1: spring */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #fdf2fb;
  color: #090909;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #505ce5 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #cd3333 !important;
}
dd.body a:link, dd.body a:visited {
  color: #cd3333 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #090909 !important;
}
.name {
  color: #079c2c !important;
}
  a.num {
    color: #090909 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #f3b0e6;
  margin: 12px 0 4px;
}


.formset, .fotmset_inner {
  background-color: #ffe5fc !important;
}
.tm-ui button, .tm-ui-list {
  background-color: #fdf2fb !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #ffe5fc;
  }
.MESSAGE_BOTTOM {
  display: none;




/* .formset, .fotmset_inner { background-color: #f4ecf7 !important; } */
/*.tm-ui button, .tm-ui-list {*/
/*  background-color: #f9f6ff !important;*/
/*  color: #1a1a1a !important;*/
/*  border-color: #8e44ad !important;*/
/*}*/
/*.tm-ui-list li:hover { background-color: #8e44ad !important; color: #fff !important; }*/
/*.form_menu, #MESSAGE, .MESSAGE_BOTTOM, #map { background-color: #f4ecf7; }*/
/*.MESSAGE_BOTTOM { display: none; }*/


    `,

          /* 3: summer */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #dbe3ff;
  color: #090909;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #505ce5 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #cd3333 !important;
}
dd.body a:link, dd.body a:visited {
  color: #cd3333 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #090909 !important;
}
.name {
  color: #079c2c !important;
}
  a.num {
    color: #090909 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #8fa7ff;
  margin: 12px 0 4px;
}


.formset, .fotmset_inner {
  background-color: #adc6ff !important;
}
.tm-ui button, .tm-ui-list {
  background-color: fef4ec !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #adc6ff;
  }
.MESSAGE_BOTTOM {
  display: none;

    `,

                /* 3: autumn */
          `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #ffffee;
  color: #800000;
}

a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #505ce5 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #cd3333 !important;
}
dd.body a:link, dd.body a:visited {
  color: #cd3333 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #800000 !important;
}
.name {
  color: #117743 !important;
}
  a.num {
    color: #800000 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #ffffa1;
  margin: 12px 0 4px;
}




.formset, .fotmset_inner {
  background-color: #f4d0ba !important;
}
.tm-ui button, .tm-ui-list {
  background-color: fef4ec !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #f4d0ba;
  }
.MESSAGE_BOTTOM {
  display: none;

    `,

                /* 3: winter */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #f6fafe;
  color: #043a86;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #505ce5 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #cd3333 !important;
}
dd.body a:link, dd.body a:visited {
  color: #cd3333 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #043a86 !important;
}
.name {
  color: #0f7acc !important;
}
  a.num {
    color: #043a86 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #b1d4f6;
  margin: 12px 0 4px;
}

.formset, .fotmset_inner {
  background-color: #dae3ec !important;
}
.tm-ui button, .tm-ui-list {
  background-color: fef4ec !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #ffffff ;
  }
.MESSAGE_BOTTOM {
  display: none;
    `,
                /* 3: Solarzed light */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #fdf6e3;
  color: #202020;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #6c71c4 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #d33682 !important;
}
dd.body a:link, dd.body a:visited {
  color: #d33682 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #202020 !important;
}
.name {
  color: #2aa198 !important;
}
  a.num {
    color: #202020 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #f7df9b;
  margin: 12px 0 4px;
}

.formset, .fotmset_inner {
  background-color: #fcf0cf !important;
}
.tm-ui button, .tm-ui-list {
  background-color: fef4ec !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #fcf0cf ;
  }
.MESSAGE_BOTTOM {
  display: none;
    `,
                /* 3: orange */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #fef4ec;
  color: #161616;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #4d549e !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #c81919 !important;
}
dd.body a:link, dd.body a:visited {
  color: #c81919 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #161616 !important;
}
.name {
  color: #228b22 !important;
}
  a.num {
    color: #161616 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #fbcaa4;
  margin: 12px 0 4px;
}


.formset, .fotmset_inner {
  background-color: #feca80 !important;
}
.tm-ui button, .tm-ui-list {
  background-color: fef4ec !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}

  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #feca80 ;
  }
.MESSAGE_BOTTOM {
  display: none;

    `,

                      /* 3: Light purple */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #fcf7fd;
  color: #410e53;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #6c71c4 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #d33682 !important;
}
dd.body a:link, dd.body a:visited {
  color: #d33682 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ff0000 !important;
}
span.idValue, .id {
  color: #410e53 !important;
}
.name {
  color: #2fc12f !important;
}
  a.num {
    color: #410e53 !important;
  }
  span.dateTime {
  color: #888888 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #e5baee;
  margin: 12px 0 4px;
}

.formset, .fotmset_inner {
  background-color: #f4dbfa !important;
}
.tm-ui button, .tm-ui-list {
  background-color: fef4ec !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #f3ebf5 ;
  }
.MESSAGE_BOTTOM {
  display: none;
    `,


                            /* 3: dqrk gry */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #323234;
  color: #cfcfcf;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #424ed7 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #b71d1e !important;
}
dd.body a:link, dd.body a:visited {
  color: #b71d1e !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ffcccc !important;
}
span.idValue, .id {
  color: #cfcfcf !important;
}
.name {
  color: #3ca45c !important;
}
  a.num {
    color: #cfcfcf !important;
  }
  span.dateTime {
  color: #a2a2a2 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #4a4a4c;
  margin: 12px 0 4px;
}

.formset, .fotmset_inner {
  background-color: #343232 !important;
}
.tm-ui button, .tm-ui-list {
  background-color: #ffffff !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #343232 ;
  color: #999999;
  }
.MESSAGE_BOTTOM {
  display: none;
    `,

                            /* 3: darkplus */
    `
html, body, .MAIN_WRAP, .thread, ol {
  background-color: #020202;
  color: #6e6e6e;
}
a:not(.num):not(.id):not(.floatCloseButton a):link {
  color: #5d71c4 !important;
}
a:not(.num):not(.id):not(.floatCloseButton a):visited {
  color: #7a1f25 !important;
}
dd.body a:link, dd.body a:visited {
  color: #7a1f25 !important;
}
h1 font[color="#FF0000"], a.num {
  color: #ffcccc !important;
}
span.idValue, .id {
  color: #6e6e6e !important;
}
.name {
  color: #557b35 !important;
}
  a.num {
    color: #6e6e6e !important;
  }
  span.dateTime {
  color: #696969 !important;
}


dt.hd {
  font-size: 0.85em !important;
}
dt.hd:not([res="1"]) a.num,
dt.hd:not([res="1"]) font.name {
  font-size: 1.2em !important;
}
dt.hd[res="1"] a.num {
  font-size: 1.2em !important;
}
dt.hd[res="1"] font.name {
  font-size: 1em !important;
}
dt.hd + dd.body {
  margin-top: -2px !important;
}
dd.body {
  margin-bottom: 0px !important;
}


dt.hd::before {
  content: "";
  display: block;
  height: 1px;
  background-color: #1b1b1b;
  margin: 12px 0 4px;
}

.formset, .fotmset_inner {
  background-color: #020202 !important;
}
.tm-ui button, .tm-ui-list {
  background-color: #ffffff !important;
  color: #161616 !important;
  border-color: #555 !important;
}
.tm-ui-list li:hover {
  background-color: #444 !important;
  color: #fff !important;
}
  .form_menu,
  #MESSAGE,
  .MESSAGE_BOTTOM,
  #map {
    background-color: #020202 ;
  color: #999999;
  }
.MESSAGE_BOTTOM {
  display: none;
    `,

    /* 8: なし */
    ``
  ];

    const stateLabels = ['Light', 'Spring', 'Summer', 'Autumn', 'Winter', 'Solarized light', 'Orange', 'Light purple', 'Dark gray', 'Dark+', 'なし'];
  let toggleState = loadThemeState();

      function wrapDateTimeByDt() {
    document.querySelectorAll('dt.hd').forEach(dt => {
      if (dt.querySelector('span.dateTime')) return;
      const numEl = dt.querySelector('a.num'),
            idEl  = dt.querySelector('._id');
      if (!numEl || !idEl) return;
      const toWrap = [];
      let node = numEl.nextSibling;
      while (node && node !== idEl) {
        toWrap.push(node);
        node = node.nextSibling;
      }
      if (!toWrap.length) return;
      const span = document.createElement('span');
      span.className = 'dateTime';
      dt.insertBefore(span, idEl);
      toWrap.forEach(n => span.appendChild(n));
    });
  }

  function insertDropdownUI() {
    const aaBtnLabel = document.querySelector('label.aa_btn');
    if (!aaBtnLabel) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'tm-dropdown-wrapper';
    wrapper.className = 'tm-ui';
    wrapper.style = 'position:relative;width:120px;display:inline-block;margin-left:8px;font-size:14px;vertical-align:middle;';

    wrapper.innerHTML = `
     <button id="tm-dropdown-btn" style="
        width: 100%;
        padding: 4px;
        font-size: 13px;
        cursor: pointer;
        border: 1px solid #aaa;
        border-radius: 4px;
      ">色: 通常</button>
      <ul id="tm-dropdown-list" class="tm-ui-list" style="
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        border: 1px solid #aaa;
        border-top: none;
        display: none;
        z-index: 9999;
      ">
        <li data-value="0" style="padding:5px;cursor:pointer;">Light</li>
        <li data-value="1" style="padding:5px;cursor:pointer;">Spring</li>
        <li data-value="2" style="padding:5px;cursor:pointer;">summer</li>
        <li data-value="3" style="padding:5px;cursor:pointer;">autumn</li>
        <li data-value="4" style="padding:5px;cursor:pointer;">winter</li>
        <li data-value="5" style="padding:5px;cursor:pointer;">Solarized light</li>
        <li data-value="6" style="padding:5px;cursor:pointer;">Orange</li>
        <li data-value="7" style="padding:5px;cursor:pointer;">Light purple</li>
        <li data-value="8" style="padding:5px;cursor:pointer;">Dark gray</li>
        <li data-value="9" style="padding:5px;cursor:pointer;">Dark+</li>
        <li data-value="10" style="padding:5px;cursor:pointer;">なし</li>
      </ul>

    `;
    aaBtnLabel.parentNode.insertBefore(wrapper, aaBtnLabel.nextSibling);
  }

  const colorStyle = document.createElement('style');
  document.head.appendChild(colorStyle);

  function applyColorScheme(state) {
    colorStyle.textContent = cssForState[state] || '';
    const btn = document.getElementById('tm-dropdown-btn');
    if (btn) btn.textContent = `色: ${stateLabels[state]}`;
  }

  function setupDropdownLogic() {
    const btn = document.getElementById('tm-dropdown-btn');
    const list = document.getElementById('tm-dropdown-list');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });

    list.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const value = parseInt(li.dataset.value, 10);
        toggleState = value;
        applyColorScheme(toggleState);
        saveThemeState(toggleState);
        list.style.display = 'none';
      });
    });

    document.addEventListener('click', (e) => {
      const wrap = document.getElementById('tm-dropdown-wrapper');
      if (wrap && !wrap.contains(e.target)) {
        list.style.display = 'none';
      }
    });
  }

  function saveThemeState(state) {
    localStorage.setItem('bgThemeState', state);
  }

  function loadThemeState() {
    const saved = localStorage.getItem('bgThemeState');
    return saved !== null ? parseInt(saved, 10) : 0;
  }

  insertDropdownUI();
  setupDropdownLogic();
  applyColorScheme(toggleState);
        wrapDateTimeByDt();
})();
