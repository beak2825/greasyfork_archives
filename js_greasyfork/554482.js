// ==UserScript==
// @name         mebuki-thread-emoji-name-popup
// @namespace    https://mebuki.moe/
// @version      0.1.5
// @description  めぶきちゃんねるのスレッドでレスに絵文字があればホバー時に絵文字の名前をポップアップ表示します
// @author       ame-chan
// @match        https://mebuki.moe/app*
// @license      MIT
// @run-at       document-idle
// @require      https://update.greasyfork.org/scripts/552225/1688437/mebuki-page-state.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554482/mebuki-thread-emoji-name-popup.user.js
// @updateURL https://update.greasyfork.org/scripts/554482/mebuki-thread-emoji-name-popup.meta.js
// ==/UserScript==
(() => {
  'use strict';
  if (typeof window.USER_SCRIPT_MEBUKI_STATE === 'undefined') {
    return;
  }
  const { subscribe, getState } = window.USER_SCRIPT_MEBUKI_STATE;
  const userjsStyle = `
    <style id="userjs-emojiNamePopup">
    .userjs-emojiNamePopup {
      position: absolute;
      padding: 8px 12px;
      color: inherit;
      font-size: 14px;
      background-color: var(--background, #333);
      border: 1px solid var(--border, #404040);
      border-radius: 4px;
      box-shadow: 0 1px 4px #111;
      z-index: 9999;
      display: none;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }

    html.light .userjs-emojiNamePopup {
      box-shadow: 0 1px 4px #ccc;
    }
    </style>
  `;
  let observer = null;
  let emojiListCache = null;
  let isInitialEmojiChecked = false;
  const getEmojiList = async () => {
    // キャッシュがあれば返す
    if (emojiListCache) {
      return emojiListCache;
    }
    const url = 'https://mebuki.moe/api/custom-emoji';
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest === 'undefined') {
        reject(new Error('GM_xmlhttpRequest is not available'));
        return;
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'json',
        onload: (response) => {
          try {
            const responseText = JSON.parse(response.responseText);
            emojiListCache = responseText; // キャッシュに保存
            return resolve(responseText);
          } catch (e) {
            return resolve({});
          }
        },
        onerror: (error) => {
          reject(new Error(`Failed to Emoji: ${url} - ${error.statusText || 'Unknown error'}`));
        },
        ontimeout: () => {
          reject(new Error(`Timeout while fetching Emoji: ${url}`));
        },
        timeout: 10000,
      });
    });
  };
  // 個別の絵文字要素を処理する関数
  const processEmojiElement = async (emojiElm, emojiList, wrapperElm) => {
    // 既にポップアップが設定されている場合はスキップ
    if (emojiElm.getAttribute('data-emoji-popup-available')) {
      return;
    }
    const imgElm = emojiElm.querySelector('img');
    if (!imgElm || !imgElm.src) {
      return;
    }
    const imgSrc = imgElm.src;
    let emojiName = '';
    // 全カテゴリを走査して一致する絵文字を探す
    for (const category of emojiList.categories || []) {
      for (const emoji of category.emojis || []) {
        if (emoji.skins?.[0]?.src === imgSrc) {
          emojiName = emoji.name;
          break;
        }
      }
      if (emojiName) break;
    }
    // 一致する絵文字が見つかった場合のみポップアップを作成
    if (emojiName) {
      const popup = document.createElement('div');
      popup.textContent = emojiName;
      popup.classList.add('userjs-emojiNamePopup');
      wrapperElm.appendChild(popup);
      emojiElm.setAttribute('data-emoji-popup-available', 'true');
      let hideTimeout;
      emojiElm.addEventListener('mouseover', () => {
        // 進行中の非表示処理をキャンセル
        if (hideTimeout !== undefined) {
          clearTimeout(hideTimeout);
          hideTimeout = undefined;
        }
        const { left, top } = emojiElm.getBoundingClientRect();
        popup.style.left = `${left + window.scrollX}px`;
        popup.style.display = 'block';
        // ポップアップの高さを取得して、その分上に配置
        const popupHeight = popup.offsetHeight;
        popup.style.top = `${top + window.scrollY - popupHeight - 4}px`;
        // 次のフレームでopacityを変更してトランジションを有効にする
        requestAnimationFrame(() => {
          popup.style.opacity = '1';
        });
      });
      emojiElm.addEventListener('mouseout', () => {
        popup.style.opacity = '0';
        // トランジション完了後にdisplay: noneに設定
        if (hideTimeout !== undefined) {
          clearTimeout(hideTimeout);
        }
        hideTimeout = window.setTimeout(() => {
          popup.style.display = 'none';
          hideTimeout = undefined;
        }, 200); // transition時間と同じ
      });
    }
  };
  const setEmojiPopup = async () => {
    const threadLiElms = document.querySelectorAll('.thread-messages > [id^="message-"]');
    const allButtons = document.querySelectorAll('button');
    const emojiElms = [...allButtons].filter(
      (btn) => btn.querySelector('.custom-emoji-image') && btn.querySelector('span.font-semibold.text-lg'),
    );
    const emojiList = await getEmojiList();
    let wrapperElm = document.querySelector('#userjs-emojiNamePopup-wrapper');
    if (threadLiElms.length && document.querySelector('#userjs-emojiNamePopup') === null) {
      document.head.insertAdjacentHTML('beforeend', userjsStyle);
    }
    if (wrapperElm === null) {
      const popupWrapper = document.createElement('div');
      popupWrapper.id = 'userjs-emojiNamePopup-wrapper';
      document.body.appendChild(popupWrapper);
      wrapperElm = popupWrapper;
    }
    // 各絵文字要素に対してポップアップを作成
    for (const emojiElm of emojiElms) {
      await processEmojiElement(emojiElm, emojiList, wrapperElm);
    }
    if (observer) return;
    // MutationObserverでDOM変化を監視（仮想スクロール対応）
    observer = new MutationObserver(async (mutations) => {
      const currentWrapperElm = document.querySelector('#userjs-emojiNamePopup-wrapper');
      if (!currentWrapperElm) return;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // 新しく追加されたノードをチェック
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              const element = addedNode;
              // 絵文字ボタンが追加された場合
              const allNewButtons = element.querySelectorAll('button');
              const newEmojiElms = Array.from(allNewButtons).filter(
                (btn) => btn.querySelector('.custom-emoji-image') && btn.querySelector('span.font-semibold.text-lg'),
              );
              if (newEmojiElms.length > 0) {
                for (const newEmojiElm of newEmojiElms) {
                  await processEmojiElement(newEmojiElm, emojiList, currentWrapperElm);
                }
              }
              // 追加された要素自体が絵文字ボタンの場合
              if (
                element.matches('button') &&
                element.querySelector('.custom-emoji-image') &&
                element.querySelector('span.font-semibold.text-lg')
              ) {
                await processEmojiElement(element, emojiList, currentWrapperElm);
              }
            }
          }
        }
      }
    });
    // .thread-messagesを監視
    const threadMessages = document.querySelector('.thread-messages');
    if (threadMessages) {
      observer.observe(threadMessages, {
        childList: true,
        subtree: true,
      });
    }
  };
  const cleanupEmojiPopup = () => {
    const wrapperElm = document.querySelector('#userjs-emojiNamePopup-wrapper');
    wrapperElm?.remove();
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    isInitialEmojiChecked = false;
  };
  const wait = (delay = 100) => new Promise((resolve) => setTimeout(resolve, delay));
  // 絵文字ボタンが見つかるまでリトライする関数
  const setEmojiPopupWithRetry = async (maxRetries = 5, delay = 100) => {
    for (let i = 0; i < maxRetries; i++) {
      const allButtons = document.querySelectorAll('button');
      const emojiElms = [...allButtons].filter(
        (btn) => btn.querySelector('.custom-emoji-image') && btn.querySelector('span.font-semibold.text-lg'),
      );
      if (emojiElms.length > 0) {
        await setEmojiPopup();
        isInitialEmojiChecked = true;
        return;
      }
      if (i < maxRetries - 1) {
        await wait(delay);
      }
    }
    isInitialEmojiChecked = true;
  };
  subscribe((state) => {
    if (state.isThreadPage) {
      isInitialEmojiChecked ? setEmojiPopup() : setEmojiPopupWithRetry();
    } else if (!state.isThreadPage) {
      cleanupEmojiPopup();
    }
  });
  const state = getState();
  if (state.isThreadPage) {
    isInitialEmojiChecked ? setEmojiPopup() : setEmojiPopupWithRetry();
  }
})();
