// ==UserScript==
// @name         WOS Giftcode Helper
// @version      2.5.0
// @author       IlIl
// @match        *://wos-giftcode.centurygame.com/*
// @match        *://wos-giftcode.centurygame.com
// @icon         https://wos-giftcode.centurygame.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/373220
// @description Adds multi-ID management and fast switching to the WOS Giftcode site
// @downloadURL https://update.greasyfork.org/scripts/556314/WOS%20Giftcode%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556314/WOS%20Giftcode%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const tag = document.createElement('div');
  tag.textContent = 'WOS ID Helper Loaded';
  tag.style.position = 'fixed';
  tag.style.right = '8px';
  tag.style.bottom = '8px';
  tag.style.zIndex = '99999';
  tag.style.padding = '4px 8px';
  tag.style.background = 'rgba(0,0,0,.6)';
  tag.style.color = '#fff';
  tag.style.fontSize = '12px';
  tag.style.borderRadius = '4px';
  document.documentElement.appendChild(tag);

  const IDS_KEY = 'wos_multi_ids';
  const INDEX_KEY = 'wos_current_idx';

  let sessionGiftCode = '';

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function loadIds() {
    try {
      const raw = localStorage.getItem(IDS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr
        .map((x) => String(x).trim())
        .filter((x, i, a) => x && a.indexOf(x) === i);
    } catch (e) {
      return [];
    }
  }

  function saveIds(list) {
    const clean = list
      .map((x) => String(x).trim())
      .filter((x, i, a) => x && a.indexOf(x) === i);
    localStorage.setItem(IDS_KEY, JSON.stringify(clean));
    return clean;
  }

  function loadIndex(max) {
    const v = parseInt(localStorage.getItem(INDEX_KEY), 10);
    if (isNaN(v) || v < 0) return 0;
    if (typeof max === 'number' && max > 0 && v >= max) return 0;
    return v;
  }

  function saveIndex(idx) {
    localStorage.setItem(INDEX_KEY, String(idx || 0));
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rects = el.getClientRects();
    return rects && rects.length > 0;
  }

  function bindGiftCodePersistence() {
    const giftInput =
      document.querySelector('.code_con input[placeholder="请输入兑换码"]') ||
      document.querySelector('.code_con input[type="text"]');

    const exchangeBtn = document.querySelector('.btn.exchange_btn');

    if (!giftInput) return;

    if (sessionGiftCode) {
      giftInput.value = sessionGiftCode;
      giftInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (!giftInput._wosGiftBound) {
      giftInput._wosGiftBound = true;
      giftInput.addEventListener('input', () => {
        sessionGiftCode = giftInput.value;
      });
    }

    if (exchangeBtn && !exchangeBtn._wosGiftBound) {
      exchangeBtn._wosGiftBound = true;
      exchangeBtn.addEventListener('click', () => {
        sessionGiftCode = giftInput.value;
      });
    }
  }

  const I18N = {
    'zh-CN': {
      addIdButton: '添加ID',
      manageTitle: '管理ID',
      switchTitle: '切换ID',
      save: '保存',
      hint: '提示：第一个ID会在打开页面时自动登录。',
      onlyOneId: '当前只保存了一个ID，无法切换。',
      atLeastOne: '至少保留一个ID'
    },
    'zh-TW': {
      addIdButton: '新增ID',
      manageTitle: '管理ID',
      switchTitle: '切換ID',
      save: '儲存',
      hint: '提示：第一個ID會在打開頁面時自動登入。',
      onlyOneId: '目前只儲存了一個ID，無法切換。',
      atLeastOne: '至少保留一個ID'
    },
    'en': {
      addIdButton: 'Add ID',
      manageTitle: 'Manage IDs',
      switchTitle: 'Switch ID',
      save: 'Save',
      hint: 'Hint: the first ID will be auto-logged in when you open the page.',
      onlyOneId: 'Only one ID saved, cannot switch.',
      atLeastOne: 'Please keep at least one ID.'
    },
    'fr': {
      addIdButton: 'Ajouter ID',
      manageTitle: 'Gérer les ID',
      switchTitle: 'Changer d’ID',
      save: 'Enregistrer',
      hint: 'Astuce : le premier ID sera automatiquement connecté à l’ouverture de la page.',
      onlyOneId: 'Un seul ID est enregistré, impossible de changer.',
      atLeastOne: 'Veuillez garder au moins un ID.'
    },
    'ja': {
      addIdButton: 'IDを追加',
      manageTitle: 'ID管理',
      switchTitle: 'ID切り替え',
      save: '保存',
      hint: 'ヒント：一番上のIDはページを開いたとき自動的にログインされます。',
      onlyOneId: '保存されているIDは1つだけのため、切り替えできません。',
      atLeastOne: '少なくとも1つのIDを残してください。'
    },
    'ko': {
      addIdButton: 'ID 추가',
      manageTitle: 'ID 관리',
      switchTitle: 'ID 전환',
      save: '저장',
      hint: '팁: 첫 번째 ID는 페이지를 열면 자동으로 로그인됩니다.',
      onlyOneId: '저장된 ID가 하나뿐이어서 전환할 수 없습니다.',
      atLeastOne: '최소한 하나의 ID는 남겨 두세요.'
    },
    'de': {
      addIdButton: 'ID hinzufügen',
      manageTitle: 'IDs verwalten',
      switchTitle: 'ID wechseln',
      save: 'Speichern',
      hint: 'Hinweis: Die erste ID wird beim Öffnen der Seite automatisch eingeloggt.',
      onlyOneId: 'Es ist nur eine ID gespeichert, ein Wechsel ist nicht möglich.',
      atLeastOne: 'Bitte behalten Sie mindestens eine ID.'
    },
    'ar': {
      addIdButton: 'إضافة معرّف',
      manageTitle: 'إدارة المعرّفات',
      switchTitle: 'تبديل المعرّف',
      save: 'حفظ',
      hint: 'ملاحظة: سيتم تسجيل الدخول تلقائيًا باستخدام أوّل معرّف عند فتح الصفحة.',
      onlyOneId: 'يوجد معرّف واحد فقط، لا يمكن التبديل.',
      atLeastOne: 'يجب الاحتفاظ بمعرّف واحد على الأقل.'
    },
    'es': {
      addIdButton: 'Añadir ID',
      manageTitle: 'Gestionar ID',
      switchTitle: 'Cambiar ID',
      save: 'Guardar',
      hint: 'Consejo: el primer ID se iniciará sesión automáticamente al abrir la página.',
      onlyOneId: 'Solo hay un ID guardado, no se puede cambiar.',
      atLeastOne: 'Mantén al menos un ID.'
    },
    'pt': {
      addIdButton: 'Adicionar ID',
      manageTitle: 'Gerir IDs',
      switchTitle: 'Trocar ID',
      save: 'Salvar',
      hint: 'Dica: o primeiro ID será conectado automaticamente ao abrir a página.',
      onlyOneId: 'Há apenas um ID salvo, não é possível trocar.',
      atLeastOne: 'Mantenha pelo menos um ID.'
    }
  };

  let currentLang = null;

  function detectLang() {
    const cur = document.querySelector('.lang_switch .cur_lang');
    if (cur) {
      const txt = cur.textContent.trim();
      if (txt.includes('简体')) return 'zh-CN';
      if (txt.includes('繁體') || txt.includes('繁体')) return 'zh-TW';
      if (/English/i.test(txt)) return 'en';
      if (txt.includes('Français')) return 'fr';
      if (txt.includes('日本')) return 'ja';
      if (txt.includes('한국')) return 'ko';
      if (txt.includes('Deutsch')) return 'de';
      if (txt.includes('العربية') || txt.includes('عرب')) return 'ar';
      if (txt.includes('Español') || txt.includes('Espa')) return 'es';
      if (txt.includes('Português') || txt.includes('Portugu')) return 'pt';
    }

    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('zh-tw') || nav.startsWith('zh-hk')) return 'zh-TW';
    if (nav.startsWith('zh')) return 'zh-CN';
    if (nav.startsWith('fr')) return 'fr';
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('ko')) return 'ko';
    if (nav.startsWith('de')) return 'de';
    if (nav.startsWith('ar')) return 'ar';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('pt')) return 'pt';
    if (nav.startsWith('en')) return 'en';

    return 'en';
  }

  function t(key) {
    let lang = currentLang || detectLang();
    if (!I18N[lang]) lang = 'en'; 
    const dict = I18N[lang] || I18N['en'];
    return dict[key] || I18N['en'][key] || key;
  }

  currentLang = detectLang();

  let loginInited = false;

  function setupLoginPage() {
    if (loginInited) return;

    const idInput =
      document.querySelector('.roleId_con input[type="text"]') ||
      document.querySelector('.roleId_con input[placeholder]') ||
      document.querySelector('input[placeholder="角色ID"]') ||
      document.querySelector('input[placeholder="请输入角色ID"]');

    const loginBtn = document.querySelector('.btn.login_btn');

    if (!idInput || !loginBtn) return;

    loginInited = true;

    let ids = loadIds();
    if (ids.length > 0) {
      const idx = loadIndex(ids.length);
      const id = ids[idx] || ids[0];

      if (id) {
        idInput.value = id;
        idInput.dispatchEvent(new Event('input', { bubbles: true }));
        if (loginBtn.classList.contains('disabled')) {
          loginBtn.classList.remove('disabled');
        }
        loginBtn.click();
      }
    }

    loginBtn.addEventListener('click', () => {
      const val = idInput.value.trim();
      if (!val) return;

      let list = loadIds();
      let idx = list.indexOf(val);
      if (idx === -1) {
        list.push(val);
        list = saveIds(list);
        idx = list.indexOf(val);
      }
      saveIndex(idx);
    });
  }

  let loggedInInited = false;
  let btnWrap = null;
  let managerContainer = null;
  let isManaging = false;

  const ADD_ICON = (() => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<rect x="10" y="4" width="4" height="16" fill="white"/>' +
      '<rect x="4" y="10" width="16" height="4" fill="white"/>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  })();

  const SWITCH_ICON = (() => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<path d="M5 7h11l-3-3 1.4-1.4L20.8 7 14.4 11.4 13 10l3-3H5z" fill="white"/>' +
      '<path d="M19 17H8l3 3-1.4 1.4L3.2 17 9.6 12.6 11 14l-3 3h11z" fill="white"/>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  })();

  function styleSmallSquareButton(btn, iconDataUrl) {
    btn.style.width = '0.64rem';
    btn.style.height = '0.6rem';
    btn.style.borderRadius = '0.16rem';
    btn.style.border = 'none';
    btn.style.backgroundColor = '#20609f';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.cursor = 'pointer';
    btn.style.padding = '0';

    if (iconDataUrl) {
      btn.style.backgroundImage = `url("${iconDataUrl}")`;
      btn.style.backgroundRepeat = 'no-repeat';
      btn.style.backgroundPosition = 'center';
      btn.style.backgroundSize = '.48rem auto';
    } else {
      btn.style.backgroundImage = 'none';
    }
  }

  function buildManagerUI(container) {
    container.innerHTML = '';

    const templateInput =
      document.querySelector('.code_con input[type="text"]') ||
      document.querySelector('.code_con .input_wrap input') ||
      document.querySelector('.code_con input');
    const inputStyle = templateInput ? window.getComputedStyle(templateInput) : null;

    const exchangeBtnTemplate = document.querySelector('.btn.exchange_btn');
    const exchangeStyle = exchangeBtnTemplate ? window.getComputedStyle(exchangeBtnTemplate) : null;

    const listWrapper = document.createElement('div');
    listWrapper.style.display = 'flex';
    listWrapper.style.flexDirection = 'column';
    listWrapper.style.gap = '0.1rem';
    listWrapper.style.maxHeight = '3.2rem';
    listWrapper.style.overflowY = 'auto';

    function refreshIndexesAndDeleteButton() {
      const rows = Array.from(listWrapper.children);
      rows.forEach((row, i) => {
        const label = row.querySelector('.wos-id-label');
        if (label) label.textContent = (i + 1) + '.';

        const delBtn = row.querySelector('button[data-del]');
        if (delBtn) {
          delBtn.style.visibility = rows.length > 1 ? 'visible' : 'hidden';
        }
      });
    }

    function createRow(value) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '0.08rem';

      const label = document.createElement('span');
      label.className = 'wos-id-label';
      label.style.width = '0.35rem';
      label.style.fontSize = '0.35rem';
      label.style.color = '#fff';

      const input = document.createElement('input');
      input.type = 'text';
      input.setAttribute('data-wos-id-input', '1');
      input.value = value || '';
      input.maxLength = 20;
      input.style.flex = '1';

      if (inputStyle) {
        input.style.height = inputStyle.height;
        input.style.fontSize = inputStyle.fontSize;
        input.style.padding = inputStyle.padding;
        input.style.borderRadius = inputStyle.borderRadius;
        input.style.border = inputStyle.border;
      } else {
        input.style.height = '0.44rem';
        input.style.fontSize = '0.18rem';
        input.style.borderRadius = '0.06rem';
        input.style.border = 'none';
        input.style.padding = '0 0.1rem';
      }

      const delBtn = document.createElement('button');
      delBtn.setAttribute('data-del', '1');

      const minusBar = document.createElement('span');
      minusBar.style.display = 'block';
      minusBar.style.width = '70%';           
      minusBar.style.height = '0.08rem';      
      minusBar.style.borderRadius = '500px';  
      minusBar.style.background = '#1b3b5d';  
      delBtn.appendChild(minusBar);

      const inputHeight = inputStyle ? inputStyle.height : '0.4rem';
      delBtn.style.height = inputHeight;
      delBtn.style.width = inputHeight; 
      delBtn.style.borderRadius = inputStyle ? inputStyle.borderRadius : '0.06rem';
      delBtn.style.border = 'none';
      delBtn.style.background = '#d0d7e6';
      delBtn.style.color = '#1b3b5d';
      delBtn.style.fontSize = '0.35rem';
      delBtn.style.fontWeight = 'bold';
      delBtn.style.display = 'flex';
      delBtn.style.alignItems = 'center';
      delBtn.style.justifyContent = 'center';
      delBtn.style.cursor = 'pointer';

      delBtn.addEventListener('click', () => {
        listWrapper.removeChild(row);
        refreshIndexesAndDeleteButton();
      });

      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(delBtn);
      listWrapper.appendChild(row);
      refreshIndexesAndDeleteButton();
    }

    const ids = loadIds();
    if (ids.length > 0) {
      ids.forEach((id) => createRow(id));
    } else {
      createRow('');
    }

    const addRowBtn = document.createElement('button');
    addRowBtn.textContent = '+ ' + t('addIdButton');
    addRowBtn.style.marginTop = '0.16rem';
    addRowBtn.style.width = '100%';
    addRowBtn.style.height = inputStyle ? inputStyle.height : '0.44rem';
    addRowBtn.style.borderRadius = inputStyle ? inputStyle.borderRadius : '0.06rem';
    addRowBtn.style.border = 'none';
    addRowBtn.style.background = '#e5edf9';
    addRowBtn.style.color = '#1b3b5d';
    addRowBtn.style.fontSize = inputStyle ? inputStyle.fontSize : '0.18rem';
    addRowBtn.style.cursor = 'pointer';

    addRowBtn.addEventListener('click', () => {
      const inputs = listWrapper.querySelectorAll('input[data-wos-id-input]');
      const lastInput = inputs[inputs.length - 1];
      if (lastInput && !lastInput.value.trim()) {
        lastInput.focus();
        return;
      }
      createRow('');
      const rows = listWrapper.querySelectorAll('input[data-wos-id-input]');
      const newest = rows[rows.length - 1];
      if (newest) newest.focus();
    });

    const saveBtn = document.createElement('button');
    saveBtn.textContent = t('save');
    saveBtn.style.marginTop = '0.16rem';
    saveBtn.style.width = '100%';

    if (exchangeStyle) {
      saveBtn.style.height = exchangeStyle.height;
      saveBtn.style.borderRadius = exchangeStyle.borderRadius;
      saveBtn.style.fontSize = exchangeStyle.fontSize;
      saveBtn.style.fontWeight = exchangeStyle.fontWeight;
      saveBtn.style.lineHeight = exchangeStyle.lineHeight;
      saveBtn.style.backgroundColor = exchangeStyle.backgroundColor;
      saveBtn.style.backgroundImage = exchangeStyle.backgroundImage;
      saveBtn.style.backgroundSize = exchangeStyle.backgroundSize;
      saveBtn.style.backgroundRepeat = exchangeStyle.backgroundRepeat;
      saveBtn.style.color = exchangeStyle.color;
      saveBtn.style.border = exchangeStyle.border;
    } else {
      saveBtn.style.height = '0.44rem';
      saveBtn.style.borderRadius = '0.06rem';
      saveBtn.style.border = 'none';
      saveBtn.style.background = '#c2ccd8';
      saveBtn.style.color = '#1b3b5d';
      saveBtn.style.fontSize = '0.18rem';
    }
    saveBtn.style.cursor = 'pointer';

    const hint = document.createElement('div');
    hint.textContent = t('hint');
    hint.style.marginTop = '0.12rem';
    hint.style.fontSize = '0.16rem';
    hint.style.color = '#c5d3ea';

    container.appendChild(listWrapper);
    container.appendChild(addRowBtn);
    container.appendChild(saveBtn);
    container.appendChild(hint);

    saveBtn.addEventListener('click', () => {
      const inputs = listWrapper.querySelectorAll('input[data-wos-id-input]');
      const list = [];
      inputs.forEach((inp) => {
        const v = inp.value.trim();
        if (v && !list.includes(v)) list.push(v);
      });

      if (list.length === 0) {
        alert(t('atLeastOne'));
        return;
      }

      saveIds(list);
      saveIndex(0);
      leaveManageMode();
    });
  }

  let originalTitle = '';
  let originalButtonText = '';

  function enterManageMode() {
    if (isManaging) return;
    isManaging = true;

    const mainContent = document.querySelector('.content_wrapper .main_content');
    const titleEl = document.querySelector('.content_wrapper .title');
    const exchangeBtn = document.querySelector('.btn.exchange_btn');

    if (!mainContent || !titleEl || !exchangeBtn || !managerContainer) return;

    originalTitle = titleEl.textContent.trim();
    originalButtonText = exchangeBtn.textContent.trim();

    Array.from(mainContent.children).forEach((child) => {
      if (child !== managerContainer) {
        child.style.display = 'none';
      }
    });

    exchangeBtn.style.display = 'none';

    titleEl.textContent = t('manageTitle');

    buildManagerUI(managerContainer);
    managerContainer.style.display = 'block';

    updateButtonsVisibility();
  }

  function leaveManageMode() {
    if (!isManaging) return;
    isManaging = false;

    const mainContent = document.querySelector('.content_wrapper .main_content');
    const titleEl = document.querySelector('.content_wrapper .title');
    const exchangeBtn = document.querySelector('.btn.exchange_btn');

    if (!mainContent || !titleEl || !exchangeBtn || !managerContainer) return;

    Array.from(mainContent.children).forEach((child) => {
      if (child !== managerContainer) {
        child.style.display = '';
      }
    });

    managerContainer.style.display = 'none';

    if (originalTitle) titleEl.textContent = originalTitle;
    exchangeBtn.textContent = originalButtonText || exchangeBtn.textContent;
    exchangeBtn.style.display = '';

    bindGiftCodePersistence();
    updateButtonsVisibility();
  }

  function updateButtonsVisibility() {
    if (!btnWrap) return;
    const exitCon = document.querySelector('.roleInfo_con .exit_con');
    const roleIdCon = document.querySelector('.roleId_con');
    const shouldShow = exitCon && isVisible(exitCon) && !roleIdCon && !isManaging;
    btnWrap.style.display = shouldShow ? 'flex' : 'none';
  }

  function setupLoggedInPage() {
    if (loggedInInited) {
      bindGiftCodePersistence();
      updateButtonsVisibility();
      return;
    }

    const roleBar = document.querySelector('.roleInfo_con');
    const exitCon = roleBar && roleBar.querySelector('.exit_con');
    const mainContent = document.querySelector('.content_wrapper .main_content');

    if (!roleBar || !exitCon || !mainContent) return;

    loggedInInited = true;

    const rbStyle = window.getComputedStyle(roleBar);
    if (rbStyle.position === 'static' || !rbStyle.position) {
      roleBar.style.position = 'relative';
    }

    btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.flexDirection = 'row';
    btnWrap.style.alignItems = 'center';
    btnWrap.style.gap = '0.2rem';
    btnWrap.style.zIndex = '5';

    const addBtn = document.createElement('button');
    addBtn.textContent = '';
    addBtn.title = t('manageTitle');
    styleSmallSquareButton(addBtn, ADD_ICON);

    const switchBtn = document.createElement('button');
    switchBtn.textContent = '';
    switchBtn.title = t('switchTitle');
    styleSmallSquareButton(switchBtn, SWITCH_ICON);

    btnWrap.appendChild(addBtn);
    btnWrap.appendChild(switchBtn);
    roleBar.appendChild(btnWrap);

    function adjustButtonsPosition() {
      const roleRect = roleBar.getBoundingClientRect();
      const exitRect = exitCon.getBoundingClientRect();
      const top = exitRect.top - roleRect.top;
      const gapPx = 12;
      const rightDist = roleRect.right - exitRect.left + gapPx;
      btnWrap.style.position = 'absolute';
      btnWrap.style.top = top + 'px';
      btnWrap.style.right = rightDist + 'px';
    }

    adjustButtonsPosition();
    window.addEventListener('resize', adjustButtonsPosition);

    managerContainer = document.createElement('div');
    managerContainer.id = 'wos-id-manager';
    managerContainer.style.display = 'none';
    managerContainer.style.marginTop = '0.3rem';
    mainContent.appendChild(managerContainer);

    addBtn.addEventListener('click', () => {
      enterManageMode();
    });

    switchBtn.addEventListener('click', async () => {
      const ids = loadIds();
      if (ids.length <= 1) {
        alert(t('onlyOneId'));
        return;
      }

      const idx = loadIndex(ids.length);
      const nextIdx = (idx + 1) % ids.length;
      saveIndex(nextIdx);
      const targetId = ids[nextIdx];

      exitCon.click();

      let idInput, loginBtn;
      const timeout = 8000;
      const start = Date.now();

      while (Date.now() - start < timeout) {
        idInput =
          document.querySelector('.roleId_con input[type="text"]') ||
          document.querySelector('.roleId_con input[placeholder]') ||
          document.querySelector('input[placeholder="角色ID"]') ||
          document.querySelector('input[placeholder="请输入角色ID"]');

        loginBtn = document.querySelector('.btn.login_btn');

        if (idInput && loginBtn && isVisible(idInput) && isVisible(loginBtn)) {
          break;
        }
        await sleep(100);
      }

      if (!idInput || !loginBtn) {
        console.warn('没有在预期时间内找到登录页面元素，切换失败。');
        return;
      }

      idInput.value = targetId;
      idInput.dispatchEvent(new Event('input', { bubbles: true }));
      if (loginBtn.classList.contains('disabled')) {
        loginBtn.classList.remove('disabled');
      }

      await sleep(150);
      loginBtn.click();
    });

    bindGiftCodePersistence();
    updateButtonsVisibility();
  }


  function onLanguageChanged() {
    if (btnWrap) {
      const buttons = btnWrap.querySelectorAll('button');
      if (buttons[0]) buttons[0].title = t('manageTitle');
      if (buttons[1]) buttons[1].title = t('switchTitle');
    }

    if (isManaging && managerContainer) {
      const titleEl = document.querySelector('.content_wrapper .title');
      if (titleEl) {
        titleEl.textContent = t('manageTitle');
      }
      managerContainer.innerHTML = '';
      buildManagerUI(managerContainer);
    }
  }


  function detectAndInit() {
    const roleIdInput =
      document.querySelector('.roleId_con input[type="text"]') ||
      document.querySelector('.roleId_con input[placeholder]') ||
      document.querySelector('input[placeholder="角色ID"]') ||
      document.querySelector('input[placeholder="请输入角色ID"]');

    const loggedRoleBar = document.querySelector('.roleInfo_con');

    if (roleIdInput && !isVisible(loggedRoleBar)) {
      setupLoginPage();
      updateButtonsVisibility();
    } else if (loggedRoleBar && isVisible(loggedRoleBar)) {
      setupLoggedInPage();
    } else {
      updateButtonsVisibility();
    }
  }

  const observer = new MutationObserver(() => {
    const newLang = detectLang();
    if (newLang !== currentLang) {
      currentLang = newLang;
      onLanguageChanged();
    }
    detectAndInit();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  detectAndInit();
})();