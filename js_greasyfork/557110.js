// ==UserScript==
// @name         AO3 Enhancer: Autoscroll + Social buttons
// @name:ru      AO3: Автоскролл + социальные кнопки
// @namespace    https://greasyfork.org/ru/users/1542254-sergeigyr
// @version      1.1
// @description  Enhances functionality: infinite scroll, fast page loading, like/dislike/finished/remove buttons.
// @description:ru  Улучшает функциональность: бесконечный скролл, быстрая загрузка работ, кнопки: лайк, дизлайк, прочитано, удалить.
// @author       sergeigyr
// @license      MIT
// @match        https://archiveofourown.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557110/AO3%20Enhancer%3A%20Autoscroll%20%2B%20Social%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/557110/AO3%20Enhancer%3A%20Autoscroll%20%2B%20Social%20buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

GM_addStyle(`
.blurb {

     & * {
        pointer-events: none;
        user-select: none;
    }

    & :is(h4.heading *, .states *) {
        pointer-events: auto;
    }

  .heading {
    margin: 8px 0 !important;

    & a:hover {
      color: #fff;
      background: #900;
    }
  }

  h4 a {
    z-index: 2;
    position: relative;
  }
  & h4.heading {
        display: flex !important;
        flex-wrap: wrap;
        gap: 4px;
        overflow: hidden;
        font-size: 0;

        [href^="/works"] {
            display: inline-block;
            margin-right: 100%;
            white-space: normal;
            max-width: 80%;
            word-break: break-all;
            flex-shrink: 0;
        }

        & * {
            font-size: initial;
        }
        a:nth-of-type(2) {
            margin-left: -4px;
            &:before {
                content: "by ";
            }
        }
        a:nth-of-type(n+2):not(:last-of-type) {
            &:after {
                content: ","
            }
        }
    }

  .tags.commas {

    .warnings,
    .freeforms {
      display: none;
    }

    &:has(.relationships) .characters {
      display: none;
    }

    & li.relationships:not(:has(~ li.relationships)):after,
    & li.characters:not(:has(~ li.characters)):after,
    &:not(:has(li:not(.warnings):not(.freeforms)))::before {
      display: none;
    }
  }

  ul.required-tags {
    position: relative;
    width: auto;
    display: flex;
    gap: 10px;


    & li {
      display: inline-flex;

      &:has(.warnings) {
        display: none;
      }

      &:not(:last-child):after {
        content: ",";
        align-content: center;
      }

      span {
        background: none;
        font-size: 100%;
        color: inherit;
        font-weight: normal;
      }

      .category,
      &:has([href^="/tags/"]):not(:first-of-type) a {
        color: #900;
      }

      a {
        cursor: pointer;
        border-bottom: 1px dotted;
      }
    }

    & * {
      width: auto !important;
      height: auto !important;
      position: relative !important;
      top: unset !important;
      bottom: unset !important;
      left: unset !important;
      right: unset !important;
    }
  }

  .stats {
    width: 100%;
    dt, dd {
      top: 6px;
      position: relative;
    }
    &>*:not(.words,
      /*.chapters,*/
      div) {
      display: none;
    }

    .chapters a {
      border-bottom: none;
    }

    div {
      padding-left: 0;
      display: inline-flex;
      float: left;


      label {
        height: fit-content;
        width: fit-content;
        position: relative;
        margin-right: 20px;

        &:first-child {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1;

          span {
            display: none;
          }
        }

        &:not(:first-child) {
          z-index: 2;
        }

        span {
          scale: 0.8;
        }

        input {
          display: none;
        }
      }

      label:nth-child(2) {
        --like-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='%23' viewBox='0 0 28 28'%3E%3Cpath d='M5 24a1 1 0 1 1-2 0V12a1 1 0 1 1 2 0v12Z M13.081 4c-.548 0-1.048.316-1.282.812L9.353 9.98A3.667 3.667 0 0 0 9 11.549V20.5a2.5 2.5 0 0 0 2.5 2.5h7.009a2.5 2.5 0 0 0 2.323-1.576l2.982-7.5a2.5 2.5 0 0 0-2.323-3.424h-5.609A1.382 1.382 0 0 1 14.5 9.118v-3.7C14.5 4.636 13.865 4 13.081 4Zm-3.09-.044A3.419 3.419 0 0 1 16.5 5.42V8.5h4.991c3.18 0 5.357 3.208 4.182 6.163l-2.983 7.5A4.5 4.5 0 0 1 18.51 25H11.5A4.5 4.5 0 0 1 7 20.5v-8.951c0-.839.186-1.667.545-2.425L9.99 3.956Z' clip-rule='evenodd'/%3E%3C/svg%3E");
        --like-svg-chkd: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='%23' viewBox='0 0 28 28'%3E%3Cpath fill-rule='evenodd' d='M4.25 23.996a1.25 1.25 0 0 0 1.251-1.25v-11.5a1.25 1.25 0 0 0-2.501 0v11.5c0 .69.56 1.25 1.25 1.25ZM8.486 9.393l2.37-4.996a2.443 2.443 0 0 1 4.65 1.046v3.768c0 .158.13.287.288.287h5.704c2.456 0 4.149 2.465 3.266 4.757l-2.96 7.69a3.2 3.2 0 0 1-2.987 2.05h-7.213a3.6 3.6 0 0 1-3.6-3.6v-8.86a5 5 0 0 1 .482-2.142Z' clip-rule='evenodd'/%3E%3C/svg%3E");

        span {
          content: var(--like-svg);
        }

        & input:checked+span {
          content: var(--like-svg-chkd);
        }
      }

      label:nth-child(3) {
        --dislike-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='%23' viewBox='0 0 28 28'%3E%3Cpath fill-rule='evenodd' d='M16.201 23.188a1.419 1.419 0 0 1-2.701-.607v-3.699c0-.763-.619-1.382-1.382-1.382h-5.61a2.5 2.5 0 0 1-2.322-3.424l2.982-7.5A2.5 2.5 0 0 1 9.491 5H16.5A2.5 2.5 0 0 1 19 7.5v8.951c0 .543-.12 1.079-.352 1.569L16.2 23.188ZM14.92 26a3.419 3.419 0 0 0 3.09-1.956l2.446-5.168A5.667 5.667 0 0 0 21 16.45V7.5A4.5 4.5 0 0 0 16.5 3H9.491A4.5 4.5 0 0 0 5.31 5.837l-2.983 7.5C1.152 16.292 3.33 19.5 6.51 19.5h4.99v3.081A3.419 3.419 0 0 0 14.919 26ZM24 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1Z' clip-rule='evenodd'/%3E%3C/svg%3E");
        --dislike-svg-chkd: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='%23' viewBox='0 0 28 28'%3E%3Cpath fill-rule='evenodd' d='M23.75 4.004a1.25 1.25 0 0 0-1.251 1.25v11.5a1.25 1.25 0 0 0 2.5 0v-11.5c0-.69-.559-1.25-1.25-1.25Zm-4.235 14.602-2.37 4.997a2.443 2.443 0 0 1-4.65-1.046v-3.768a.287.287 0 0 0-.288-.287H6.503c-2.456 0-4.149-2.465-3.266-4.757l2.96-7.69a3.2 3.2 0 0 1 2.987-2.05h7.213a3.6 3.6 0 0 1 3.6 3.6v8.86a5 5 0 0 1-.482 2.141Z' clip-rule='evenodd'/%3E%3C/svg%3E");

        span {
          content: var(--dislike-svg);
        }

        & input:checked+span {
          content: var(--dislike-svg-chkd);
        }
      }

      label:nth-child(4) {
        --finish-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='%23' viewBox='0 0 28 28'%3E%3Cpath fill-rule='evenodd' d='M12.956 3h2.088c1.363 0 2.447 0 3.321.071.896.074 1.66.227 2.359.583a6 6 0 0 1 2.622 2.622c.356.7.51 1.463.583 2.359.071.874.071 1.958.071 3.321v8.645c0 1.007 0 1.832-.058 2.47-.058.633-.184 1.283-.59 1.795a3 3 0 0 1-2.326 1.138c-.654.006-1.245-.293-1.78-.636-.539-.346-1.19-.853-1.985-1.47l-1.91-1.487c-.776-.603-.943-.71-1.09-.749a1 1 0 0 0-.522 0c-.147.04-.314.146-1.09.75l-1.91 1.485c-.795.618-1.446 1.125-1.986 1.471-.534.343-1.125.642-1.779.636a3 3 0 0 1-2.326-1.138c-.406-.512-.532-1.162-.59-1.794C4 22.433 4 21.608 4 20.602v-8.646c0-1.363 0-2.447.071-3.321.074-.896.227-1.66.583-2.359a6 6 0 0 1 2.622-2.622c.7-.356 1.463-.51 2.359-.583C10.509 3 11.593 3 12.956 3ZM9.797 5.065c-.771.063-1.243.182-1.613.371a4 4 0 0 0-1.748 1.748c-.189.37-.308.842-.371 1.613C6 9.581 6 10.583 6 12v8.55c0 1.07.001 1.803.05 2.34.05.554.14.702.166.735a1 1 0 0 0 .775.38c.042 0 .214-.02.682-.32.454-.292 1.033-.74 1.878-1.397l1.87-1.456.124-.096c.577-.45 1.083-.845 1.671-1.004a3 3 0 0 1 1.568 0c.588.159 1.094.554 1.671 1.004l.123.096 1.871 1.456c.845.656 1.424 1.105 1.878 1.396.468.3.64.32.681.32a1 1 0 0 0 .776-.379c.026-.033.116-.18.166-.735.049-.537.05-1.27.05-2.34V12c0-1.417 0-2.419-.065-3.203-.063-.771-.182-1.243-.371-1.613a4 4 0 0 0-1.748-1.748c-.37-.189-.841-.308-1.613-.371C17.419 5 16.417 5 15 5h-2c-1.417 0-2.419 0-3.203.065Z' clip-rule='evenodd'/%3E%3C/svg%3E");
        --finish-svg-chkd: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='%23' viewBox='0 0 28 28'%3E%3Cpath fill-rule='evenodd' d='M15.044 3h-2.088c-1.363 0-2.447 0-3.321.071-.896.074-1.66.227-2.359.583a6 6 0 0 0-2.622 2.622c-.356.7-.51 1.463-.583 2.359C4 9.509 4 10.593 4 11.956v8.645c0 1.007 0 1.832.058 2.47.058.633.184 1.283.59 1.795a3 3 0 0 0 2.326 1.138c.654.006 1.245-.293 1.78-.636.539-.346 1.19-.853 1.985-1.47l1.91-1.487c.776-.603.943-.71 1.09-.749a1 1 0 0 1 .522 0c.147.04.314.146 1.09.75l1.91 1.485c.795.618 1.446 1.125 1.986 1.471.534.343 1.125.642 1.779.636a3 3 0 0 0 2.326-1.138c.406-.512.532-1.162.59-1.794.058-.639.058-1.464.058-2.47v-8.646c0-1.363 0-2.447-.071-3.321-.074-.896-.227-1.66-.583-2.359a6 6 0 0 0-2.622-2.622c-.7-.356-1.463-.51-2.359-.583C17.491 3 16.407 3 15.044 3Z' clip-rule='evenodd'/%3E%3C/svg%3E");

        span {
          content: var(--finish-svg);
        }

        & span:only-child {
          content: var(--finish-svg-chkd);
        }
      }

      label:nth-child(5) {
        --remove-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 28 28'%3E%3Cpath fill='%23900' fill-rule='evenodd' d='M7.2801 4.3661c-.4881-.4881-1.2796-.4881-1.7677 0-.4882.4882-.4882 1.2796 0 1.7678l1.677 1.677c-2.3166 1.3213-4.1752 3.2997-5.0804 5.7137-.0566.151-.0849.2265-.1003.333a1.1697 1.1697 0 0 0 0 .2848c.0154.1065.0437.182.1003.333C3.8072 19.0045 8.8614 22 14 22c2.0855 0 4.157-.4934 5.996-1.3825l2.0164 2.0164c.4881.4881 1.2796.4881 1.7677 0 .4882-.4882.4882-1.2796 0-1.7678l-16.5-16.5Zm10.6392 14.1747-2.1328-2.1328a2.987 2.987 0 0 1-1.7863.5896c-1.6569 0-3-1.3432-3-3a2.987 2.987 0 0 1 .5895-1.7864l-2.1328-2.1328c-.9078 1.0514-1.4567 2.4212-1.4567 3.9192 0 3.3137 2.6863 6 6 6 1.498 0 2.8678-.549 3.9191-1.4568Z M14.4618 8.015c2.9457.2242 5.2967 2.5753 5.5209 5.5209l4.0423 4.0423c.7996-.9218 1.4389-1.9638 1.866-3.1028.0566-.151.0849-.2265.1003-.333a1.1697 1.1697 0 0 0 0-.2848c-.0154-.1065-.0437-.182-.1003-.333C24.1928 8.9956 19.1386 6 14 6c-.4924 0-.984.0275-1.472.0812l1.9338 1.9339Z'/%3E%3C/svg%3E");

        span {
          content: var(--remove-svg);
        }
      }
    }
  }

  &:has(label:first-child input:checked) .header.module~*:not(.stats) {
    display: none;
  }

  &:has(label:nth-child(3) input:checked) {
    background: #ff000008;
  }

  &:has(label:nth-child(2) input:checked) {
    background: #00800010;
  }

  &:not(:has([data-field="c"])) {
    &:before {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      width: 60px;
      height: 100%;
      background: #0000ff16;
    }
  }
}
`);

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const html = (el, pos, str) => el.insertAdjacentHTML(pos, str);


  /* ----------------- DB Module ----------------- */

  const DB_KEYS = {
    HDB: 'HiddenDB',
    SDB: 'StatesDB'
  };

  const DB = {
    hdb: new Set(GM_getValue(DB_KEYS.HDB, [])),
    sdb: new Map(
    Object.entries(
        JSON.parse(GM_getValue(DB_KEYS.SDB, "{}"))
    )
),
    timer: null,

    save() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        GM_setValue(DB_KEYS.HDB, [...this.hdb]);
        GM_setValue(DB_KEYS.SDB,
    JSON.stringify(Object.fromEntries(this.sdb))
);
      }, 120);
    },
    get(id) {
      return this.sdb.get(id) || [1, 0, 0, 0];
    },
    set(id, state) {
      if (state[0] === 1 && state[1] === 0 && state[2] === 0 && state[3] === 0) {
        this.sdb.delete(id);
      } else {
        this.sdb.set(id, state);
      }
      this.save();
    },
    radio(state, changedIndex) {
      if (changedIndex === 1 && state[1]) state[2] = 0;
      if (changedIndex === 2 && state[2]) state[1] = 0;
    }
  };

  /* ----------------- UI Template ----------------- */

  const FIELDS = ['h', 'l', 'd', 'c', 'r'];
  const FIELD_ATTRS = FIELDS.map(f => `data-field="${f}"`);

  function uiElementHTML(i, type, checked) {
    return `<label><input ${type} ${FIELD_ATTRS[i]} ${checked ? 'checked' : ''}><span></span></label>`;
  }

  function uiContainerHTML(state) {
    return `<div class="states">
        ${[0,1,2].map(i => uiElementHTML(i, 'type="checkbox"', !!state[i])).join('')}
        ${state[3] ? '' : uiElementHTML(3, 'type="button"', false)}
        ${uiElementHTML(4, 'type="button"', false)}
    </div>`;
}

  /* ----------------- Helpers ----------------- */
  function extractIdFromElement(el) {
    // el is <li> element
    // id attribute format: work_12345 or bookmark_12345
    const idAttr = el.id || '';
    const m = idAttr.match(/(?:work|bookmark)_(\d+)/);
    return m ? m[1] : null;
  }

  /* ----------------- Container & initial scan ----------------- */

  const container = document.querySelector('.index.group');

  if (container) {

    const existing = container.querySelectorAll('.blurb:not(.mystery)');
    for (let i = 0; i < existing.length; i++) {
      const li = existing[i];
      const id = extractIdFromElement(li);
      if (!id) continue;
      if (DB.hdb.has(id)) {
        li.remove();
        continue;
      }
      if (!li.querySelector('.states')) {
        const state = DB.get(id);
        html($('.stats', li) || li, $('.stats', li) ? 'afterbegin' : 'beforeend', uiContainerHTML(state));
      }
    }
  }

  /* ----------------- scroll-info element ----------------- */

  function ensureInfoElement() {
    let info = document.getElementById('scroll-info');
    if (!info) {
      info = document.createElement('li');
      info.id = 'scroll-info';
      info.style.display = 'none';
      info.style.textAlign = 'center';
      info.style.padding = '12px';
      info.style.fontWeight = 'bold';
      if (container) container.insertAdjacentElement('afterend', info);
    } else {
      if (container && info.parentElement !== container.parentElement) container.insertAdjacentElement('afterend', info);
    }
    return info;
  }

  const INFO = ensureInfoElement();

  /* ----------------- Event Delegation (fast) ----------------- */

  if (container) {

    let rCooldown = false;

    container.addEventListener('change', function (ev) {
      const t = ev.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.type !== 'checkbox') return;

      const li = t.closest('.blurb');
      if (!li) return;
      const id = extractIdFromElement(li);
      if (!id) return;

      const field = t.getAttribute('data-field');
      const idx = field === 'h' ? 0 : field === 'l' ? 1 : field === 'd' ? 2 : -1;
      if (idx < 0) return;

      const state = DB.get(id);
      state[idx] = t.checked ? 1 : 0;
      DB.radio(state, idx);
      DB.set(id, state);

      const cbox = li.querySelectorAll('input[type="checkbox"]');
      for (let j = 0; j < cbox.length; j++) {
        const f = cbox[j].getAttribute('data-field');
        const fi = f === 'h' ? 0 : f === 'l' ? 1 : f === 'd' ? 2 : -1;
        if (fi >= 0) cbox[j].checked = !!state[fi];
      }
    });

    container.addEventListener('click', function (ev) {
      const t = ev.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.type !== 'button') return;

      const li = t.closest('.blurb');
      if (!li) return;
      const id = extractIdFromElement(li);
      if (!id) return;

      const field = t.getAttribute('data-field');
      if (field === 'c') {
        const state = DB.get(id);
        state[3] = 1;
        DB.set(id, state);
        t.remove();
      } else if (field === 'r') {

    if (rCooldown) {
        return;
    }

    rCooldown = true;
    document.querySelectorAll('label:has([data-field="r"])').forEach(btn => {
        btn.style.opacity = '0.5';
        btn.disabled = true;
    });

    setTimeout(() => {
        rCooldown = false;
        document.querySelectorAll('label:has([data-field="r"])').forEach(btn => {
            btn.style.opacity = '';
            btn.disabled = false;
        });
    }, 3500);

    DB.hdb.add(id);
    DB.sdb.delete(id);
    DB.save();
    li.remove();
 }
    });
  }

  /* ----------------- Autoscroll / Fetch Module ----------------- */

  const Autoscroll = {
    busy: false,
    finished: false,
    minDelay: 3000,
    maxDelay: 5000,
    nextURL: (function () {
      const n = document.querySelector('.next > a');
      return n ? n.href : null;
    })(),
    infoEl: INFO,
    randDelay() {
      return Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) + this.minDelay;
    },
    setInfo(msg) {
      if (!this.infoEl) return;
      this.infoEl.style.display = '';
      this.infoEl.textContent = msg;
      if (container) container.insertAdjacentElement('afterend', this.infoEl);
    },
    hideInfo() {
      if (!this.infoEl) return;
      this.infoEl.style.display = 'none';
      if (container) container.insertAdjacentElement('afterend', this.infoEl);
    },

    async fetchNext() {
      if (this.busy || this.finished || !this.nextURL) return;
      this.busy = true;
      this.setInfo('Loading…');
      await new Promise(r => setTimeout(r, this.randDelay()));

      try {
        const resp = await fetch(this.nextURL, {
          credentials: 'include'
        });
        const text = await resp.text();

        // parse fetched page to document
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // gather next
        const nxEl = doc.querySelector('.next > a');

        // get all blurbs
        const fetchedNodes = doc.querySelectorAll('.blurb');

        if (!fetchedNodes || fetchedNodes.length === 0) {

          if (!nxEl) {
            this.setInfo('Работ больше не найдено');
            this.finished = true;
            this.busy = false;
            return;
          } else {

            let href = nxEl.getAttribute('href') || '';
            if (!href.startsWith('http')) href = new URL(href, location.origin).href;
            this.nextURL = href;
            this.hideInfo();
            this.busy = false;
            return;
          }
        }

        // collect ids and filter by HiddenDB in batch
        const toImport = [];
        for (let i = 0; i < fetchedNodes.length; i++) {
          const node = fetchedNodes[i];
          const id = extractIdFromElement(node);
          if (!id) continue;
          if (DB.hdb.has(id)) continue;
          toImport.push({
            node,
            id
          });
        }

        // import and prepare fragment
        if (toImport.length > 0 && container) {
          const frag = document.createDocumentFragment();
          for (let i = 0; i < toImport.length; i++) {
            const {
              node,
              id
            } = toImport[i];
            const imported = document.importNode(node, true);

            // insert UI states
            if (!imported.querySelector('.states')) {
              const state = DB.get(id);
              html($('.stats', imported) || imported, $('.stats', imported) ? 'afterbegin' : 'beforeend', uiContainerHTML(state));
            } else {
              // ensure checkboxes reflect DB state (safety)
              const state = DB.get(id);
              const cboxes = imported.querySelectorAll('input[type="checkbox"]');
              for (let j = 0; j < cboxes.length; j++) {
                const f = cboxes[j].getAttribute('data-field');
                const fi = f === 'h' ? 0 : f === 'l' ? 1 : f === 'd' ? 2 : -1;
                if (fi >= 0) cboxes[j].checked = !!state[fi];
              }
            }

            frag.appendChild(imported);
          }

          // append fragment once
          container.appendChild(frag);

        }

        // set nextURL strictly from .next > a in parsed doc
        if (!nxEl) {
          this.setInfo('Работ больше не найдено');
          this.finished = true;
          this.busy = false;
          return;
        } else {
          let href = nxEl.getAttribute('href') || '';
          if (!href.startsWith('http')) href = new URL(href, location.origin).href;
          this.nextURL = href;
          this.hideInfo();
          this.busy = false;
          return;
        }

      } catch (e) {
        this.setInfo('Ошибка загрузки');
        this.busy = false;
        return;
      }
    },

    lastTs: 0,
    // check remaining <= 5 after last visible
    loop(ts) {
      if (!this.infoEl) this.infoEl = ensureInfoElement();
      if (ts - this.lastTs > 300) {
        this.lastTs = ts;
        if (!this.busy && !this.finished && container) {
          const lis = container.querySelectorAll('.blurb');
          if (lis.length) {
            let idx = -1;
            for (let i = 0; i < lis.length; i++) {
              const r = lis[i].getBoundingClientRect();
              if (r.bottom > 0) {
                idx = i;
                break;
              }
            }
            if (idx === -1) idx = lis.length;
            const remaining = lis.length - idx;
            if (remaining <= 5) this.fetchNext();
          }
        }
      }
      requestAnimationFrame(this.loop.bind(this));
    }
  };

  /* ----------------- Start ----------------- */

  ensureInfoElement(); // ensure info exists and in right place
  requestAnimationFrame(Autoscroll.loop.bind(Autoscroll));

})();