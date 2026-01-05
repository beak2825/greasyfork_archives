// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      1.1.5
// @license      http://www.wtfpl.net/txt/copying/
// @homepageURL  https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer
// @supportURL   https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer/issues
// @icon         http://torviet.com/pic/salad.png
// @description  A small script to tweak the shoutbox
// @author       Salad
// @match        http://torviet.com/qa.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9780/TorViet%20Shoutbox%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/9780/TorViet%20Shoutbox%20Enhancer.meta.js
// ==/UserScript==

((window, document) => {
  const allWrapper = document.getElementById('all-wrapper');
  const boxHead = document.getElementById('boxHead');
  const marquee = document.getElementById('marquee');
  const sltTheme = document.getElementById('sltTheme');
  const clock = document.getElementById('clock');
  const idQuestion = document.getElementById('idQuestion');
  const emoGroup = document.getElementById('emo-group');
  const emoGroupDetail = document.getElementById('emo-group-detail');
  const apiPath = 'qa_smiley_ajax.php';

  class DomElementHelper {
    static appendSibling(newElement, referenceElement) {
      if (!newElement || !referenceElement) {
        return false;
      }

      referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);

      return true;
    }

    static remove(element) {
      if (!element) {
        return false;
      }

      element.parentNode.removeChild(element);

      return true;
    }
  }

  class EmoticonService {
    static getEmoticon(emoticonName) {
      if (isNaN(emoticonName) || !this.isInteger(emoticonName)) {
        return Promise.resolve('');
      }

      return Promise.resolve(`<div style="height:43px;width:43px;float:left;display:inline-block;margin: 0 0 1px 1px;"><img style="max-width:43px;max-height:43px;cursor:pointer;" src="/pic/smilies/${emoticonName}.gif" alt="[em${emoticonName}]"></div>`);
    }

    static isInteger(number) {
      return number === parseInt(number, 10) || number === parseInt(number, 10).toString();
    }

    static getEmoticons(url, emoticonGroupName) {
      if (!url || !emoticonGroupName || !isNaN(emoticonGroupName)) {
        return null;
      }

      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open('POST', url);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        request.onload = () => {
          if (request.status === 200) {
            resolve(JSON.parse(request.responseText).str);
          } else {
            reject(Error(request.statusText));
          }
        };

        request.onerror = () => {
          reject(Error('Network error'));
        };

        request.send(`group=${emoticonGroupName}`);
      });
    }
  }

  const EMOTICON = (() => {
    let cachedEmoticonList = GM_getValue('emoticonList');
    let cachedEmoticonListHtml = GM_getValue('emoticonListHtml') || '';

    const promptForEmoticonList = (action, emoticonList) => {
      let message = `Chọn bộ emoticon bạn muốn ${action}:\n`;
      let answer = '';

      message += emoticonList.reduce((previous, current, index) =>
        previous + `${index + 1}. ${current}\n`, '');

      message += 'Điền tên bộ emoticon, ngăn cách bằng dấu phẩy, phân biệt hoa/thường. Có thể điền emoticon đơn bằng cách điền tên tập tin emoticon đó.\nVí dụ: Voz,707,Rage';

      answer = prompt(message);

      if (!answer || !answer.trim()) { return null; }

      return answer.trim().split(',');
    };

    const initEmoticonList = () => {
      const availableEmoticonList = [...emoGroup.options].map(element => element.text);

      cachedEmoticonList = promptForEmoticonList('sử dụng', availableEmoticonList);

      if (!cachedEmoticonList) { return; }

      GM_setValue('emoticonList', cachedEmoticonList);
    };

    return {
      emoticonListExists: () => {
        if (!cachedEmoticonList) initEmoticonList();
      },
      addToDom: async () => {
        emoGroupDetail.innerHTML = '';

        if (!cachedEmoticonListHtml) {
          cachedEmoticonListHtml = (await Promise.all(cachedEmoticonList.map(async (item) => {
            return isNaN(item) ?
              await EmoticonService.getEmoticons(apiPath, item) :
              await EmoticonService.getEmoticon(item);
          }))).join('');

          GM_setValue('emoticonListHtml', cachedEmoticonListHtml);
        }

        emoGroupDetail.innerHTML = cachedEmoticonListHtml;
      },
      add: () => {
        const availableEmoticonList = [...emoGroup.options]
          .map(item => item.text)
          .filter(item => !cachedEmoticonList.includes(item));

        const emoticonListToAdd = promptForEmoticonList('thêm', availableEmoticonList);

        if (!emoticonListToAdd) { return; }

        cachedEmoticonList = [
          ...cachedEmoticonList,
          ...emoticonListToAdd.filter(item => !cachedEmoticonList.includes(item))
        ];

        GM_setValue('emoticonList', cachedEmoticonList);
        GM_deleteValue('emoticonListHtml');
        window.location.href = window.location.pathname;
      },
      remove: () => {
        const emoticonListToRemove = promptForEmoticonList('xóa', cachedEmoticonList);

        if (!emoticonListToRemove) { return; }

        cachedEmoticonList =
          cachedEmoticonList.filter(item => !emoticonListToRemove.includes(item));

        GM_setValue('emoticonList', cachedEmoticonList);
        GM_deleteValue('emoticonListHtml');
        window.location.href = window.location.pathname;
      },
      clear: () => {
        GM_deleteValue('emoticonList');
        GM_deleteValue('emoticonListHtml');
        window.location.href = window.location.pathname;
      },
    };
  })();

  function isFirefoxBrowser() {
    return typeof InstallTrigger !== 'undefined';
  }

  function createButton(text, event) {
    const button = document.createElement('input');
    button.type = 'button';
    button.value = text;
    button.addEventListener('click', event);

    return button;
  }

  allWrapper.className = '';
  DomElementHelper.remove(boxHead);
  DomElementHelper.remove(marquee);
  DomElementHelper.remove(sltTheme);
  while (clock.lastChild) {
    DomElementHelper.remove(clock.lastChild);
  }

  const stylesheet = isFirefoxBrowser() ?
    `
      #wrapper-below {
          height: calc(100% - 67px);
      }

      #emo-section {
          height: calc(100% - 74px);
      }
      ` :
    `
      #wrapper-below {
          height: calc(100% - 62px);
      }

      #emo-section {
          height: calc(100% - 69px);
      }
      `;

  GM_addStyle(
    `
      .slimScrollDiv, #emo-group-detail {
          height: 100% !important;
      }
      ${stylesheet}`);

  const clockChild = document.createDocumentFragment();
  const span = document.createElement('span');

  span.innerHTML = 'For custom emoticon group<br>';

  clockChild.appendChild(emoGroup.parentNode);
  clockChild.appendChild(span)
    .parentNode.appendChild(createButton('Add', EMOTICON.add))
    .parentNode.appendChild(createButton('Remove', EMOTICON.remove))
    .parentNode.appendChild(createButton('Clear', EMOTICON.clear));
  clock.appendChild(clockChild);

  EMOTICON.emoticonListExists();
  EMOTICON.addToDom();

  idQuestion.focus();
})(window, document);
