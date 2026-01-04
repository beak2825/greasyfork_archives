// ==UserScript==
// @name         ニコニココメント苗字表示
// @namespace    https://greasyfork.org/users/prozent55
// @version      0.2.3
// @description  ニコニコ動画のコメント欄で、同一userIdの複数コメントに対して苗字ラベルを表示します
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561143/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E8%8B%97%E5%AD%97%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561143/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E8%8B%97%E5%AD%97%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /**********************************************************************
   * 設定
   **********************************************************************/

  const SURNAMES = [
    '三又', '三木谷', '三村', '三浦', '三田', '上原', '中居', '中山', '中村', '中田', '中西', '中野', '久保', '久保田', '五十嵐', '井上', '今田', '伊原木', '伊尻', '伊藤', '伊達', '佐々木', '佐久間', '佐川', '佐田', '佐野', '内村', '内藤', '剛', '加納', '加藤', '勝又', '北島', '北浦', '南', '南原', '友永', '吉川', '吉永', '吉田',
    '向井', '在原', '坂ノ上', '坂口', '坂本', '堀', '多田', '多田野', '大久保', '大坊', '大塚', '大山', '大江', '大畑', '大谷', '天谷', '太田', '宮本', '宮根', '宮永', '対馬', '小暮', '小栗', '小森', '小籔', '小野', '小野寺', '尾木', '山中', '山崎', '山川', '山本', '岡崎', '岡村', '岡田', '岡野', '岩瀬', '岸田', '島田', '川合',
    '左慈', '平野', '幸田', '広瀬', '後藤', '徳川', '我修院', '戸田', '手越', '斉藤', '新今', '新庄', '新田', '星', '有田', '木村', '本田', '朴', '杉山', '杉田', '村上', '東', '東郷', '松尾', '松平', '松田', '板倉', '林', '桜井', '森', '森崎', '森林', '楢崎', '榎本', '権藤', '横井', '横山', '橋本', '橘', '正岡',
    '武内', '武田', '水谷', '氷崎', '永谷', '池内', '池田', '河野', '津田', '清水', '清野', '滝沢', '澤村', '濱口', '熊田', '玉木', '田中', '田亀', '田所', '白井', '白野', '真崎', '石井', '石原', '石川', '石橋', '福島', '秋元', '秋吉', '秋田', '稲吉', '竹前', '竹本', '竹野内', '織田', '羽生', '羽田野', '舘', '舛添', '花岡',
    '花澤', '草薙', '荒川', '菅野', '菊地', '蒼', '藤井', '西寺', '西岡', '西嶋', '西条', '西田', '谷岡', '赤城', '赤沼', '越前', '軍畑', '近藤', '遠野', '野中', '金', '金子', '鈴木', '長井', '長友', '長田', '長谷川', '関本', '阿部', '露崎', '靍野', '青木', '青柳', '風間', '高橋', '高田', '高見沢', '鴻野', '黒野', '齋藤',
  ]

  const SINGLE_MARK = '[-]';

  /**********************************************************************
   * 内部キャッシュ（ソート変更時に全破棄）
   **********************************************************************/

  const userToName = new Map();     // userId -> 表示名
  const surnameUsage = new Map();   // 苗字 -> 使用人数

  /**********************************************************************
   * ユーティリティ
   **********************************************************************/

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  /**********************************************************************
   * 苗字割当
   **********************************************************************/

  function assignSurname(userId) {
    if (userToName.has(userId)) {
      return userToName.get(userId);
    }

    const base = SURNAMES[hashString(userId) % SURNAMES.length];
    const used = surnameUsage.get(base) || 0;
    surnameUsage.set(base, used + 1);

    const name =
      used === 0
        ? base
        : base + String.fromCharCode(65 + used - 1);

    userToName.set(userId, name);
    return name;
  }

  /**********************************************************************
   * React state 取得
   **********************************************************************/

  function findCommentState() {
    const el = document.querySelector('[data-index]');
    if (!el) return null;

    const fiberKey = Object.keys(el).find(k =>
      k.startsWith('__reactFiber')
    );
    if (!fiberKey) return null;

    let fiber = el[fiberKey];
    while (fiber) {
      const s = fiber.memoizedState;
      const p = fiber.memoizedProps;
      if (s && Array.isArray(s.comments)) return s;
      if (p && Array.isArray(p.comments)) return p;
      fiber = fiber.return;
    }
    return null;
  }

  /**********************************************************************
   * 表示処理（X/N 正式対応）
   **********************************************************************/

  function applyLabels(state) {
    /* ---------- N（総コメント数） ---------- */
    const userCount = new Map();
    state.comments.forEach(c => {
      if (!c || !c.userId) return;
      userCount.set(c.userId, (userCount.get(c.userId) || 0) + 1);
    });

    /* ---------- X（通し番号：state.comments 基準） ---------- */
    const indexToOrder = new Map();
    const seen = new Map();

    state.comments.forEach((c, idx) => {
      if (!c || !c.userId) return;
      const n = (seen.get(c.userId) || 0) + 1;
      seen.set(c.userId, n);
      indexToOrder.set(idx, n);
    });

    /* ---------- DOM 反映 ---------- */
    document.querySelectorAll('[data-index]').forEach(row => {
      const idx = Number(row.dataset.index);
      const comment = state.comments[idx];
      if (!comment || !comment.userId) return;

      const body =
        row.querySelector('p') ||
        row.querySelector('[class*="text"]') ||
        row.firstElementChild;
      if (!body) return;

      if (body.querySelector('.tm-user-label')) return;

      const total = userCount.get(comment.userId) || 0;
      const order = indexToOrder.get(idx);

      const label = document.createElement('span');
      label.className = 'tm-user-label';
      label.style.opacity = '0.6';
      label.style.whiteSpace = 'nowrap';
      label.style.cursor = 'pointer';

      if (total <= 1) {
        label.textContent = ` ${SINGLE_MARK}`;
      } else {
        const name = assignSurname(comment.userId);
        label.textContent = ` [${name} ${order}/${total}]`;
      }

      /* --- クリックで userId を一時表示（検証用） --- */
      let opened = false;
      let idLine = null;

      label.addEventListener('click', e => {
        e.stopPropagation();
        opened = !opened;

        if (opened) {
          if (!idLine) {
            idLine = document.createElement('div');
            idLine.className = 'tm-userid-line';
            idLine.textContent = comment.userId;
            idLine.style.fontSize = '0.85em';
            idLine.style.opacity = '0.7';
            idLine.style.marginTop = '2px';
            idLine.style.paddingLeft = '1em';
            idLine.style.wordBreak = 'break-all';
          }
          row.append(idLine);
        } else if (idLine) {
          idLine.remove();
        }
      });

      body.append(label);
    });
  }

  /**********************************************************************
   * 監視（ソート変更検知 + 全リセット）
   **********************************************************************/

  let lastSortKey = null;
  let rafId = null;

  function getSortKey(state) {
    return `${state.sortType}|${state.isReversed}`;
  }

  const observer = new MutationObserver(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      rafId = null;

      const state = findCommentState();
      if (!state) return;

      const sortKey = getSortKey(state);

      if (sortKey !== lastSortKey) {
        lastSortKey = sortKey;

        // DOM ラベルを全削除
        document
          .querySelectorAll('.tm-user-label')
          .forEach(el => el.remove());
        document
          .querySelectorAll('.tm-userid-line')
          .forEach(el => el.remove());

        // 内部キャッシュを全破棄
        userToName.clear();
        surnameUsage.clear();
      }

      applyLabels(state);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

let lastVpos = -1;

    function watchVpos() {
        const state = findCommentState();
        if (state && typeof state.vposMs === 'number') {
            if (state.vposMs !== lastVpos) {
                lastVpos = state.vposMs;
                applyLabels(state);
            }
        }
        requestAnimationFrame(watchVpos);
    }

    requestAnimationFrame(watchVpos);

})();
