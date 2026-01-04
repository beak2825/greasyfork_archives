// ==UserScript==
// @name         共享账号搜索
// @description  获取共享账号并自动填写
// @namespace    http://tampermonkey.net/
// @connect        bugmenot.com
// @connect        freeaccount.biz
// @connect        password-login.com
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @version      1.7
// @author       Hồng Minh Tâm & Gemini
// @license      GPLv3
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA6lBMVEVHcEz9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH7SD/9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkH9SkEk7mAFAAAATXRSTlMABrJ4kx/v8ffNAVx0RPn4qGVZv/uIPa7EdiAOYIqh3DjX4VdjuPPoE+5YTtSHYsB5gMj6FDsjpEDTZjzdmsIanuT0BdqLnAsERlPskaOVQUwAAACxSURBVBjTbc/VDsJQEATQKdTQFooVK+7u7g77/7/D7SUBEpiHTc68TBb4m2wGyBe/ikJOLlVrH1fKxKKM3kWdeAIvBUVh0LC9WAtikBUxWk615nAeJutEMVZIphqaAIKDQpopAXFpv9twO8P+sxSHoh7Iw40rWaoCMX2kADdu9EiL9s52xQ39fmE3kYyySdszomgygRTJ3jG5up026V6ZUogYPrg9PX/f1XLDZ0R+Hn8C9iYYIKWYFpsAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/553059/%E5%85%B1%E4%BA%AB%E8%B4%A6%E5%8F%B7%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/553059/%E5%85%B1%E4%BA%AB%E8%B4%A6%E5%8F%B7%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const icons = {
    mail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>'
  }

  GM_addStyle([
    '.bmn-list { display:none; list-style: none; border: 1px solid rgba(128, 128, 128, 0.5); padding: 0; margin: 0; background-color: rgb(58, 58, 58); color: rgb(203, 203, 203); position: fixed; cursor: default; z-index: 9999999999; box-sizing: border-box; overflow: auto; text-align: left; width: 300px; }',
    '.bmn-list.show { display:block; }',
    // --- 账号数据项样式 ---
    '.bmn-list .bmn-item { position: relative; padding: 8px 10px 8px 15px; margin: 0; cursor: pointer; border-bottom: 1px solid rgba(128, 128, 128, 0.2); font-size: 9pt; line-height: 1.4;}',
    '.bmn-list .bmn-item:last-child { border-bottom: 0; }',
    '.bmn-list .bmn-item:hover { background-color: rgba(255, 255, 255, 0.1); }',
    '.bmn-list .bmn-item:before { position: absolute; content: ""; width: 5px; top: 0; left: 0; bottom: 0; background-color: #f7704f; }',
    '.bmn-list .bmn-item .bmn-label { font-weight: 600; }',
    '.bmn-list .bmn-item .bmn-username { color: rgb(246, 182, 78); }',
    '.bmn-list .bmn-item .bmn-password { color: rgb(118, 202, 83); }',
    '.bmn-list .bmn-item .bmn-email-entry { cursor: pointer; }',
    '.bmn-list .bmn-item .bmn-email-entry .bmn-value { color: rgb(138, 180, 248); text-decoration: none; }',
    '.bmn-list .bmn-item .bmn-email-entry:hover .bmn-value { text-decoration: underline; }',
    '.bmn-list .bmn-item .bmn-success-rate { float: right; font-weight: 700; margin-left: 10px; }',
    '.bmn-list .bmn-item.bmn-success-100 .bmn-success-rate { color: rgb(0,198,0); }',
    '.bmn-list .bmn-item.bmn-success-100:before { background-color: rgb(0,198,0); }',
    '.bmn-list .bmn-item.bmn-success-90 .bmn-success-rate { color: rgb(50,180,0); }',
    '.bmn-list .bmn-item.bmn-success-90:before { background-color: rgb(50,180,0); }',
    '.bmn-list .bmn-item.bmn-success-80 .bmn-success-rate { color: rgb(99,164,0); }',
    '.bmn-list .bmn-item.bmn-success-80:before { background-color: rgb(99,164,0); }',
    '.bmn-list .bmn-item.bmn-success-70 .bmn-success-rate { color: rgb(149,146,0); }',
    '.bmn-list .bmn-item.bmn-success-70:before { background-color: rgb(149,146,0); }',
    '.bmn-list .bmn-item.bmn-success-60 .bmn-success-rate { color: rgb(199,129,0); }',
    '.bmn-list .bmn-item.bmn-success-60:before { background-color: rgb(199,129,0); }',
    '.bmn-list .bmn-item.bmn-success-50 .bmn-success-rate { color: rgb(247,112,0); }',
    '.bmn-list .bmn-item.bmn-success-50:before { background-color: rgb(247,112,0); }',
    '.bmn-list .bmn-item.bmn-success-40 .bmn-success-rate { color: rgb(247,90,0); }',
    '.bmn-list .bmn-item.bmn-success-40:before { background-color: rgb(247,90,0); }',
    '.bmn-list .bmn-item.bmn-success-30 .bmn-success-rate { color: rgb(247,67,0); }',
    '.bmn-list .bmn-item.bmn-success-30:before { background-color: rgb(247,67,0); }',
    '.bmn-list .bmn-item.bmn-success-20 .bmn-success-rate { color: rgb(247,45,0); }',
    '.bmn-list .bmn-item.bmn-success-20:before { background-color: rgb(247,45,0); }',
    '.bmn-list .bmn-item.bmn-success-10 .bmn-success-rate { color: rgb(247,22,0); }',
    '.bmn-list .bmn-item.bmn-success-10:before { background-color: rgb(247,22,0); }',
    '.bmn-list .bmn-no-logins-found, .bmn-list .bmn-loading, .bmn-list .bmn-error { padding: 10px 15px; margin: 0; cursor: default; text-align: center; color: #fff; font-size: 9pt; }',
    '.bmn-list .bmn-no-logins-found { background-color: #555; }',
    '.bmn-list .bmn-loading { background-color: #007bff; }',
    '.bmn-list .bmn-error { background-color: #a90000; }',

    // --- 分隔行样式 ---
    '.bmn-separator { background-color: #2C2C2C; padding: 6px 10px; font-size: 9pt; line-height: 1.4; border-bottom: 1px solid rgba(128, 128, 128, 0.2); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }',
    '.bmn-separator:hover { background-color: #444; }',
    '.bmn-separator a { color: rgb(178, 139, 247) !important; text-decoration: none; cursor: pointer; }',
    '.bmn-separator a:hover { text-decoration: underline; }',
    '.bmn-separator .bmn-count { color: #aaa; font-size: 9pt; }',

    // --- 顶部关闭栏样式 ---
    '.bmn-header { position: sticky; top: 0; z-index: 1000; background-color: #242424; padding: 8px 10px; border-bottom: 1px solid #555; display: flex; justify-content: space-between; align-items: center; font-size: 10pt; font-weight: bold; color: #fff; }',
    '.bmn-close-btn { cursor: pointer; font-size: 14pt; line-height: 1; color: #aaa; padding: 0 5px; }',
    '.bmn-close-btn:hover { color: #fff; }',

    // --- 分组容器 ---
    '.bmn-group-container { display: none; }',
    '.bmn-group-container.expanded { display: block; }',

    // --- 按钮样式 ---
    '.bmn-floating-button { position: fixed !important; background: transparent !important; border: none !important; cursor: pointer !important; padding: 2px !important; display: none; align-items: center; justify-content: center; z-index: 999999 !important; opacity: 0.5; transition: opacity 0.2s ease, transform 0.2s ease !important; color: grey !important; pointer-events: auto !important; margin: 0 !important; width: 24px; height: 24px; box-sizing: border-box !important; }',
    '.bmn-floating-button:hover { opacity: 1 !important; transform: scale(1.1); }',
    '.bmn-floating-button svg { width: 18px; height: 18px; display: block; }',
    '.bmn-list::-webkit-scrollbar { width: 8px; }',
    '.bmn-list::-webkit-scrollbar-track { background: rgb(44, 44, 44); }',
    '.bmn-list::-webkit-scrollbar-thumb { background-color: rgb(159, 159, 159); border-radius: 4px; }',
    '.bmn-list::-webkit-scrollbar-thumb:hover { background-color: rgb(190, 190, 190); }',

    // --- Toast 提示样式 ---
    '.bmn-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.8); color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; z-index: 9999999999; opacity: 0; transition: opacity 0.3s; pointer-events: none; }',
    '.bmn-toast.show { opacity: 1; }'
  ].join(''));

  // --- 工具函数 ---

  Object.defineProperty(String.prototype, 'toDOM', {
    value: function (isFull) {
      var parser = new DOMParser(),
        dom = parser.parseFromString(this, 'text/html');
      return isFull ? dom : dom.body.childNodes[0];
    },
    enumerable: false
  });

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  function setValueInput(input, value, isInputSimulate) {
    var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setValue.call(input, value);
    if (isInputSimulate) {
      var e = new Event('input', {
        bubbles: true
      });
      input.dispatchEvent(e);
    }
  }

  function getOffset(element) {
    var elementRect = element.getBoundingClientRect();
    return {
      left: elementRect.left,
      right: elementRect.right,
      top: elementRect.top,
      bottom: elementRect.bottom,
      width: elementRect.width,
      height: elementRect.height
    };
  }

  function handleEvent(func, data) {
    return function (event) {
      func.bind(this)(event, data);
    };
  }

  function isVisible(el) {
      return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  }

  function getRootDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname;

    const sld = parts[parts.length - 2];
    const secondLevelDomains = ['com', 'co', 'net', 'org', 'edu', 'gov', 'mil', 'ac'];

    if (secondLevelDomains.includes(sld)) {
        return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }

  function cfDecodeEmail(encodedString) {
      var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
      for (n = 2; encodedString.length - n; n += 2) {
          i = parseInt(encodedString.substr(n, 2), 16) ^ r;
          email += String.fromCharCode(i);
      }
      return email;
  }

  function getTextContentWithCF(cell) {
      if (!cell) return '';
      const cfElem = cell.querySelector('[data-cfemail]');
      if (cfElem) {
          return cfDecodeEmail(cfElem.getAttribute('data-cfemail'));
      }
      return cell.innerText.trim();
  }

  function copyToClipboard(text) {
      if (!text) return;
      GM_setClipboard(text);
      showToast(`已复制: ${text.length > 20 ? text.substring(0, 20) + '...' : text}`);
  }

  function showToast(message) {
      let toast = document.querySelector('.bmn-toast');
      if (!toast) {
          toast = document.createElement('div');
          toast.className = 'bmn-toast';
          document.body.appendChild(toast);
      }
      toast.innerText = message;
      toast.classList.add('show');
      setTimeout(() => {
          toast.classList.remove('show');
      }, 2000);
  }

  // [新增] Shadow DOM 穿透辅助函数
  function diveIntoShadow(element) {
      let current = element;
      let depth = 0;
      const maxDepth = 20;

      while (current && current.shadowRoot && depth < maxDepth) {
          const internal = current.shadowRoot.querySelector('input, textarea, button, a, select, [role="button"], [tabindex]:not([tabindex="-1"])');
          if (internal) {
              current = internal;
              depth++;
          } else {
              break;
          }
      }
      return current;
  }

  // [新增] 递归查找所有 Input (支持 Shadow DOM)
  function queryAllInputs(root = document) {
      let inputs = Array.from(root.querySelectorAll('input'));

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
          acceptNode: node => node.shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      });

      while (walker.nextNode()) {
          inputs = inputs.concat(queryAllInputs(walker.currentNode.shadowRoot));
      }
      return inputs;
  }

  // --- 来源配置 ---

  const SOURCES = [
      {
          key: 'bugmenot',
          name: 'BugMeNot',
          url: (domain) => `https://bugmenot.com/view/${domain}`,
          parser: parseBugMeNot
      },
      {
          key: 'freeaccount',
          name: 'FreeAccount',
          url: (domain) => `https://freeaccount.biz/accounts/${domain}`,
          parser: parseFreeAccount
      },
      {
          key: 'passwordlogin',
          name: 'Password-login',
          url: (domain) => `https://password-login.com/passwords/${domain}`,
          parser: parsePasswordLogin
      }
  ];

  // --- 解析函数 ---

  function parseBugMeNot(responseText) {
      var bmnEl = responseText.toDOM(true);
      var accountEls = bmnEl.getElementsByClassName('account');
      const list = [];
      for (var i = 0; i < accountEls.length; i++) {
          var accountEl = accountEls[i];
          var infoEl = accountEl.getElementsByTagName('kbd');
          var statsEl = accountEl.getElementsByClassName('stats')[1].getElementsByTagName('li');

          if (infoEl.length < 2) continue;

          list.push({
              username: infoEl[0].innerHTML || '',
              password: infoEl[1].innerHTML || '',
              email: (infoEl[2] && infoEl[2].innerHTML) ? infoEl[2].innerHTML : '',
              success: parseInt(statsEl[0].innerHTML.match(/\d+(?=%)/) ? statsEl[0].innerHTML.match(/\d+(?=%)/)[0] : 0),
              time: statsEl[2].innerHTML
          });
      }
      return list;
  }

  function parseFreeAccount(responseText) {
      const doc = responseText.toDOM(true);
      const tables = doc.querySelectorAll('table.prettyTable');
      const list = [];

      tables.forEach(tbl => {
          const successSpan = tbl.querySelector('span[id^="succ"]');
          const successRate = successSpan ? parseInt(successSpan.innerText.replace('%', '')) : 0;
          const loginPassCells = tbl.querySelectorAll('td.loginpass');

          if (loginPassCells.length >= 2) {
              const username = getTextContentWithCF(loginPassCells[0]);
              const password = getTextContentWithCF(loginPassCells[1]);

              if (username && password) {
                  list.push({
                      username: username,
                      password: password,
                      email: '',
                      success: isNaN(successRate) ? 0 : successRate,
                      time: ''
                  });
              }
          }
      });
      return list;
  }

  function parsePasswordLogin(responseText) {
      const doc = responseText.toDOM(true);
      const tables = doc.querySelectorAll('table[width="100%"]');
      const list = [];

      tables.forEach(tbl => {
          const font = tbl.querySelector('td[align="center"] font');
          if (!font) return;

          const successRate = parseInt(font.innerText.replace('%', '').trim()) || 0;

          const innerTable = tbl.querySelector('td[width="400"] table');
          if (!innerTable) return;

          const rows = innerTable.querySelectorAll('tr');
          if (rows.length >= 3) {
              const userCell = rows[0].querySelectorAll('td')[1];
              const passCell = rows[1].querySelectorAll('td')[1];
              const commentCell = rows[2].querySelectorAll('td')[1];

              if (userCell && passCell) {
                  list.push({
                      // [修改] 使用 getTextContentWithCF 以支持 CF 邮箱解密
                      username: getTextContentWithCF(userCell),
                      password: getTextContentWithCF(passCell),
                      email: getTextContentWithCF(commentCell),
                      success: successRate,
                      time: ''
                  });
              }
          }
      });
      return list;
  }

  // --- 核心变量 ---

  var sourceData = {};
  var sourceStatus = {};

  var hasFetchedData = false;
  var firstGroupExpanded = false;

  var inputUsernameCurrentEl, inputPasswordCurrentEl;
  var listBMNEl = null;

  var sharedButton = null;
  var currentTargetInput = null;
  var hideTimer = null;

  var isMenuMode = false;

  // --- 核心逻辑 ---

  function initListContainer() {
    if (listBMNEl) return;
    listBMNEl = document.createElement('ul');
    listBMNEl.classList.add('bmn-list');

    // [新增] 事件隔离：防止事件冒泡到宿主网页
    ['click', 'mousedown', 'keydown', 'keyup', 'contextmenu', 'focus', 'focusin', 'wheel'].forEach(evtName => {
        listBMNEl.addEventListener(evtName, function(e) {
            e.stopPropagation();
        }, false);
    });

    document.body.appendChild(listBMNEl);
  }

  function resetData() {
      sourceData = {};
      sourceStatus = {};
      SOURCES.forEach(source => {
          sourceData[source.key] = [];
          sourceStatus[source.key] = { pending: 0 };
      });
      hasFetchedData = false;
  }

  function initSourceSkeleton() {
      if (!listBMNEl) return;
      listBMNEl.innerHTML = '';

      // [新增] 重置展开标记
      firstGroupExpanded = false;

      if (isMenuMode) {
          const header = document.createElement('li');
          header.className = 'bmn-header';
          header.innerHTML = `
            <span>共享账号</span>
            <span class="bmn-close-btn" title="关闭">×</span>
          `;
          header.querySelector('.bmn-close-btn').onclick = function(e) {
              e.stopPropagation();
              hideListBMNEl();
          };
          listBMNEl.appendChild(header);
      }

      SOURCES.forEach((source, index) => {
          if (!sourceData[source.key]) {
              sourceData[source.key] = [];
              sourceStatus[source.key] = { pending: 0 };
          }

          const separator = document.createElement('li');
          separator.className = 'bmn-separator';
          separator.dataset.source = source.key;

          const link = document.createElement('a');
          link.href = source.url(location.hostname);
          link.target = '_blank';
          link.innerText = source.name;
          link.onclick = (e) => e.stopPropagation();

          const countSpan = document.createElement('span');
          countSpan.className = 'bmn-count';
          countSpan.innerText = '等待...';
          countSpan.id = `bmn-count-${source.key}`;
          countSpan.style.color = '#aaa';

          separator.appendChild(link);
          separator.appendChild(countSpan);

          separator.onclick = () => toggleGroup(source.key);

          const container = document.createElement('li');
          container.className = 'bmn-group-container';
          container.id = `bmn-container-${source.key}`;

          // [修改] 移除默认展开第一个分组的逻辑
          // if (index === 0) {
          //    container.classList.add('expanded');
          // }

          listBMNEl.appendChild(separator);
          listBMNEl.appendChild(container);
      });
  }

  function toggleGroup(sourceKey) {
      const container = document.getElementById(`bmn-container-${sourceKey}`);
      if (container) {
          container.classList.toggle('expanded');
      }
  }

  function updateSourceUI(sourceKey) {
      const container = document.getElementById(`bmn-container-${sourceKey}`);
      const countSpan = document.getElementById(`bmn-count-${sourceKey}`);
      if (!container || !countSpan) return;

      if (sourceStatus[sourceKey].pending > 0) {
          countSpan.innerText = '加载中...';
          countSpan.style.color = '#17a2b8';
      } else {
          const count = sourceData[sourceKey].length;
          countSpan.innerText = count;
          countSpan.style.color = count > 0 ? '#76CA53' : '#888';
      }

      if (sourceStatus[sourceKey].pending > 0 && sourceData[sourceKey].length === 0) {
          if (container.innerHTML === '') {
               container.innerHTML = '<div class="bmn-loading">正在加载...</div>';
          }
          return;
      }

      container.innerHTML = '';

      const accounts = sourceData[sourceKey];

      if (accounts.length === 0) {
          if (sourceStatus[sourceKey].pending === 0) {
             const msg = document.createElement('div');
             msg.className = 'bmn-no-logins-found';
             msg.innerText = '未找到账号';
             container.appendChild(msg);
          }
          return;
      }

      // [新增] 如果有数据且当前没有分组被展开 则展开此分组
      if (!firstGroupExpanded) {
          container.classList.add('expanded');
          firstGroupExpanded = true;
      }

      accounts.forEach(account => {
          var itemBMNEl = document.createElement('div');
          itemBMNEl.classList.add('bmn-item');
          itemBMNEl.classList.add(getClassSuccess(account.success));

          var emailHTML = '';
          if (account.email && account.email.trim() !== '') {
            emailHTML = `
              <div class="bmn-email-entry">
                <span class="bmn-label">信息:</span>
                <span class="bmn-value">${account.email}</span>
              </div>
            `;
          }

          var itemBMNElHTML = `
            <div>
              <span class="bmn-success-rate">${account.success}%</span>
              <span class="bmn-label">账号:</span>
              <span class="bmn-value bmn-username">${account.username}</span>
            </div>
            <div>
              <span class="bmn-label">密码:</span>
              <span class="bmn-value bmn-password">${account.password}</span>
            </div>
            ${emailHTML}
          `;
          itemBMNEl.innerHTML = itemBMNElHTML;

          itemBMNEl.onmousedown = handleEvent(onMouseDownItem);
          itemBMNEl.onclick = handleEvent(onClickItem, account);
          itemBMNEl.onmouseover = handleEvent(onMouseOverItem, account);
          itemBMNEl.onmouseout = handleEvent(onMouseOutItem);

          var emailEl = itemBMNEl.querySelector('.bmn-email-entry');
          if (emailEl) {
              emailEl.onmousedown = handleEvent(onMouseDownItem);
              emailEl.onclick = handleEvent(onClickEmailItem, account);
              emailEl.onmouseover = handleEvent(onMouseOverEmailItem, account);
          }

          container.appendChild(itemBMNEl);
      });
  }

  function fetchSourceDomain(source, domain) {
      sourceStatus[source.key].pending++;
      updateSourceUI(source.key);

      GM_xmlhttpRequest({
          method: 'GET',
          url: source.url(domain),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          onload: function(response) {
              try {
                  const newAccounts = source.parser(response.responseText);
                  if (newAccounts && newAccounts.length > 0) {
                      const existing = sourceData[source.key];
                      newAccounts.forEach(acc => {
                          const exists = existing.some(ex => ex.username === acc.username && ex.password === acc.password);
                          if (!exists) {
                              existing.push(acc);
                          }
                      });
                      existing.sort((a, b) => b.success - a.success);
                  }
              } catch (e) {
                  console.error(`Error parsing ${source.name} for ${domain}`, e);
              } finally {
                  sourceStatus[source.key].pending--;
                  updateSourceUI(source.key);
              }
          },
          onerror: function() {
              sourceStatus[source.key].pending--;
              updateSourceUI(source.key);
          }
      });
  }

  function fetchData() {
    if (hasFetchedData) {
        initSourceSkeleton();
        showListBMNEl();
        addStyleListBMNEl(inputUsernameCurrentEl);

        SOURCES.forEach(source => {
            updateSourceUI(source.key);
        });
        return;
    }

    resetData();
    initSourceSkeleton();
    showListBMNEl();
    addStyleListBMNEl(inputUsernameCurrentEl);

    const hostname = location.hostname;
    const rootDomain = getRootDomain(hostname);

    const domainsToCheck = [hostname];
    if (hostname !== rootDomain) {
        domainsToCheck.push(rootDomain);
    }

    SOURCES.forEach(source => {
        domainsToCheck.forEach(domain => {
            fetchSourceDomain(source, domain);
        });
    });

    hasFetchedData = true;
  }

  // --- 交互逻辑 ---

  function closeOnClickOutside(event) {
    if (isMenuMode) return;

    if (listBMNEl && !listBMNEl.contains(event.target) && !event.target.closest('.bmn-floating-button')) {
      hideListBMNEl();
    }
  }

  function showListBMNEl() {
    if (listBMNEl) {
      listBMNEl.classList.add('show');
      document.addEventListener('mousedown', closeOnClickOutside, true);
    }
  }

  function hideListBMNEl() {
    if (listBMNEl) {
      listBMNEl.classList.remove('show');
      document.removeEventListener('mousedown', closeOnClickOutside, true);
    }
  }

  var enableMouseOut = true;

  function setValueInputItem(inputUsernameEl, inputPasswordEl, username, password, isInputSimulate) {
    setValueInput(inputUsernameEl, username, isInputSimulate);
    setValueInput(inputPasswordEl, password, isInputSimulate);
  }

  function onMouseDownItem(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  function onClickItem(event, account) {
    event.stopPropagation();

    if (isMenuMode) {
        const target = event.target;
        if (target.closest('.bmn-username')) {
            copyToClipboard(account.username);
        } else if (target.closest('.bmn-password')) {
            copyToClipboard(account.password);
        } else if (target.closest('.bmn-email-entry')) {
            copyToClipboard(account.email);
        } else {
            copyToClipboard(account.password);
        }
        return;
    }

    enableMouseOut = false;
    if (inputUsernameCurrentEl && inputPasswordCurrentEl) {
      setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, account.username, account.password, true);
      inputUsernameCurrentEl.setAttribute('value', account.username);
      hideListBMNEl();
    }
  }

  function onClickEmailItem(event, account) {
    event.stopPropagation();

    if (isMenuMode) {
        copyToClipboard(account.email);
        return;
    }

    enableMouseOut = false;
    if (inputUsernameCurrentEl && inputPasswordCurrentEl) {
      setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, account.email, account.password, true);
      inputUsernameCurrentEl.setAttribute('value', account.email);
      hideListBMNEl();
    }
  }

  function onMouseOverItem(event, account) {
    if (!isMenuMode && inputUsernameCurrentEl && inputPasswordCurrentEl) {
      setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, account.username, account.password);
    }
  }

  function onMouseOverEmailItem(event, account) {
    event.stopPropagation();
    if (!isMenuMode && inputUsernameCurrentEl && inputPasswordCurrentEl) {
      setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, account.email, account.password);
    }
  }

  function onMouseOutItem(event) {
    if (isMenuMode) return;

    if (!enableMouseOut) {
      enableMouseOut = true;
      return;
    }
    if (inputUsernameCurrentEl && inputPasswordCurrentEl) {
      setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, '', '');
    }
  }

  function getClassSuccess(success) {
    if (success > 91) return 'bmn-success-100';
    else if (success > 81) return 'bmn-success-90';
    else if (success > 71) return 'bmn-success-80';
    else if (success > 61) return 'bmn-success-70';
    else if (success > 51) return 'bmn-success-60';
    else if (success > 31) return 'bmn-success-50';
    else if (success > 21) return 'bmn-success-30';
    else if (success > 11) return 'bmn-success-20';
    else return 'bmn-success-10';
  }

  function addStyleListBMNEl(inputEl) {
    if (!listBMNEl) return;

    if (isMenuMode || !inputEl) {
        listBMNEl.style.top = '10px';
        listBMNEl.style.right = '10px';
        listBMNEl.style.left = '';
        listBMNEl.style.bottom = '';
        listBMNEl.style.maxHeight = (window.innerHeight - 20) + 'px';
        return;
    }

    const offsetTarget = getOffset(inputEl);
    const windowHeight = document.documentElement.clientHeight;
    const windowWidth = document.documentElement.clientWidth;
    const listWidth = listBMNEl.offsetWidth || 300;
    const gap = 5;

    listBMNEl.style.top = offsetTarget.top + 'px';
    listBMNEl.style.bottom = '';
    listBMNEl.style.maxHeight = (windowHeight - offsetTarget.top - 10) + 'px';

    const spaceOnRight = windowWidth - offsetTarget.right;
    const spaceOnLeft = offsetTarget.left;

    if (spaceOnRight >= listWidth + gap) {
      listBMNEl.style.left = (offsetTarget.right + gap) + 'px';
      listBMNEl.style.right = '';
    }
    else if (spaceOnLeft >= listWidth + gap) {
      listBMNEl.style.left = (offsetTarget.left - listWidth - gap) + 'px';
      listBMNEl.style.right = '';
    }
    else {
      listBMNEl.style.right = gap + 'px';
      listBMNEl.style.left = '';
    }
  }

  // --- 共享按钮逻辑 ---

  function initSharedButton() {
      if (sharedButton) return;

      sharedButton = document.createElement('button');
      sharedButton.className = 'bmn-floating-button';
      sharedButton.type = 'button';
      sharedButton.title = '获取共享账号';
      sharedButton.innerHTML = icons.mail;

      // [新增] 事件隔离：防止事件冒泡
      ['click', 'mousedown', 'keydown', 'keyup', 'contextmenu', 'focus', 'focusin', 'wheel'].forEach(evtName => {
          sharedButton.addEventListener(evtName, function(e) {
              e.stopPropagation();
          }, false);
      });

      sharedButton.onmousedown = function(e) {
          e.preventDefault();
      };

      sharedButton.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();

          if (currentTargetInput) {
              const passwordInput = currentTargetInput._bmnPasswordEl;
              const data = {
                  inputUsernameEl: currentTargetInput,
                  inputPasswordEl: passwordInput
              };
              onButtonClick(e, data);
          }
      };

      document.body.appendChild(sharedButton);
  }

  function updateSharedButtonPosition() {
    if (!currentTargetInput || !sharedButton || sharedButton.style.display === 'none') return;

    // [修改] 使用 isConnected 替代 document.body.contains
    // document.body.contains 无法检测 Shadow DOM 中的元素 会导致图标在 Reddit 等网站自动消失
    if (!currentTargetInput.isConnected || !isVisible(currentTargetInput)) {
        hideSharedButton();
        return;
    }

    const rect = getOffset(currentTargetInput);
    const buttonSize = 24;
    const rightMargin = 10;

    sharedButton.style.top = (rect.top + (rect.height - buttonSize) / 2) + 'px';
    sharedButton.style.left = (rect.right - buttonSize - rightMargin) + 'px';
  }

  function showSharedButton(inputEl) {
      clearTimeout(hideTimer);
      initSharedButton();
      currentTargetInput = inputEl;
      sharedButton.style.display = 'flex';
      sharedButton.style.opacity = '0.8';
      updateSharedButtonPosition();
  }

  function hideSharedButton() {
      hideTimer = setTimeout(() => {
          if (sharedButton) {
              sharedButton.style.display = 'none';
              currentTargetInput = null;
          }
      }, 200);
  }

  function onButtonClick(event, data) {
    if (listBMNEl && listBMNEl.classList.contains('show')) {
        hideListBMNEl();
        return;
    }

    isMenuMode = false;

    inputUsernameCurrentEl = data.inputUsernameEl;
    inputPasswordCurrentEl = data.inputPasswordEl;

    initListContainer();
    addStyleListBMNEl(inputUsernameCurrentEl);

    fetchData();
  }

  function onMenuClick() {
      if (listBMNEl && listBMNEl.classList.contains('show')) {
          hideListBMNEl();
          return;
      }

      isMenuMode = true;
      inputUsernameCurrentEl = null;
      inputPasswordCurrentEl = null;

      initListContainer();
      addStyleListBMNEl(null);

      fetchData();
  }

  GM_registerMenuCommand('获取账号', onMenuClick);

  function onInputInput(event) {
    enableMouseOut = false;
    hideListBMNEl();
  }

  function onInputFocus(event) {
    const input = event.target;
    if (input.dataset.bmnChecked) {
        showSharedButton(input);
    }
  }

  function onInputBlur(event) {
    hideSharedButton();
  }

  function isValidUsernameInput(el) {
      if (!el || !(el instanceof Element) || el.dataset.bmnChecked) {
          return false;
      }
      const isPassword = el.type === 'password';
      const isInput = el.tagName.toLowerCase() === 'input';
      const isValidType = ['text', 'email', 'tel', 'url', 'number', undefined, ''].includes(el.type);
      return isInput && !isPassword && isValidType && isVisible(el);
  }

  function attachButton(inputUsernameEl, inputPasswordEl) {
      inputUsernameEl.dataset.bmnChecked = true;
      inputPasswordEl.dataset.bmnChecked = true;

      inputUsernameEl._bmnPasswordEl = inputPasswordEl;

      inputUsernameEl.addEventListener('input', onInputInput);
      inputUsernameEl.addEventListener('focus', onInputFocus);
      inputUsernameEl.addEventListener('blur', onInputBlur);

      initSharedButton();

      // [修改] 立即显示逻辑：支持 Shadow DOM 中的 activeElement
      const activeEl = diveIntoShadow(document.activeElement);
      if (activeEl === inputUsernameEl) {
          showSharedButton(inputUsernameEl);
      }
  }

  function checkAndEventToInput() {
      // 获取页面上所有的 input (包含 Shadow DOM 中的)
      const allInputs = queryAllInputs(document);

      // 过滤出所有密码框
      const passwordInputs = allInputs.filter(el => el.type === 'password' && !el.dataset.bmnChecked);

      if (passwordInputs.length === 0) return;

      passwordInputs.forEach(passwordInput => {
          if (!isVisible(passwordInput)) return;

          let foundUsernameInput = null;
          const currentRoot = passwordInput.getRootNode();

          // --- 策略 1: 尝试在同一个 Shadow Root/Document 下查找 (原有逻辑) ---

          // 1.1 查找紧邻的前一个输入框
          let siblingCandidate = passwordInput.previousElementSibling;
          for (let i = 0; i < 3 && siblingCandidate; i++) {
              if (isValidUsernameInput(siblingCandidate)) {
                  foundUsernameInput = siblingCandidate;
                  break;
              }
              siblingCandidate = siblingCandidate.previousElementSibling;
          }

          // 1.2 在当前 Root 中向前查找
          if (!foundUsernameInput) {
              // 仅在当前 Root 下查找潜在输入框
              const potentialInputsInRoot = Array.from(currentRoot.querySelectorAll(
                  'input:not([type]), input[type=text], input[type=email], input[type=tel], input[type=password]'
              ));

              const passwordDomIndex = potentialInputsInRoot.indexOf(passwordInput);
              if (passwordDomIndex > 0) {
                  for (let i = passwordDomIndex - 1; i >= 0; i--) {
                      const globalCandidate = potentialInputsInRoot[i];
                      if (isValidUsernameInput(globalCandidate)) {
                          foundUsernameInput = globalCandidate;
                          break;
                      }
                  }
              }
          }

          // --- 策略 2 (新增): 跨 Shadow DOM 查找 (针对 Reddit 等网站) ---
          // 如果在当前小圈子里没找到 就在全局大列表里找位于密码框之前的那个输入框
          if (!foundUsernameInput) {
              const passwordGlobalIndex = allInputs.indexOf(passwordInput);
              if (passwordGlobalIndex > 0) {
                  // 向前回溯查找 限制回溯范围以防误判（例如回溯最近的 5 个输入框）
                  for (let i = passwordGlobalIndex - 1; i >= 0 && i >= passwordGlobalIndex - 5; i--) {
                      const candidate = allInputs[i];
                      // 确保找到的输入框是可见的 且不是密码框
                      if (isValidUsernameInput(candidate)) {
                          foundUsernameInput = candidate;
                          break;
                      }
                  }
              }
          }

          // --- 策略 3: 通过 name/autocomplete 查找 (原有逻辑的补充) ---
          if (!foundUsernameInput) {
              const explicitUserInputs = currentRoot.querySelectorAll('input[name="username"], input[autocomplete="username"]');
              for (let i = explicitUserInputs.length - 1; i >= 0; i--) {
                  const candidate = explicitUserInputs[i];
                  if (isVisible(candidate) && (candidate.compareDocumentPosition(passwordInput) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                      foundUsernameInput = candidate;
                      break;
                  }
              }
          }

          if (foundUsernameInput) {
              attachButton(foundUsernameInput, passwordInput);
          }
      });
  }

  // --- 启动与监视 ---

  function initialScan() {
      checkAndEventToInput();
      setTimeout(checkAndEventToInput, 500);
  }

  if (document.readyState === 'complete') {
      initialScan();
  } else {
      window.addEventListener('load', initialScan);
  }

  const debouncedUpdatePosition = debounce(updateSharedButtonPosition, 10);

  window.addEventListener('scroll', debouncedUpdatePosition, true);
  window.addEventListener('resize', debouncedUpdatePosition);

  const observer = new MutationObserver(() => {
      checkAndEventToInput();
      updateSharedButtonPosition();
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
  });

})();