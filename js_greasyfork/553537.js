// ==UserScript==
// @name         L-tike 智能填写（v5 多Profile快捷+信用卡自动选择）
// @namespace    https://zhl.dev/
// @version      5.2
// @description  一键填写＋信用卡付款＋多Profile菜单＋快捷切换＋自动模式（修复同行者 q_1_companions / q_2_companions 兼容）
// @match        https://l-tike.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553537/L-tike%20%E6%99%BA%E8%83%BD%E5%A1%AB%E5%86%99%EF%BC%88v5%20%E5%A4%9AProfile%E5%BF%AB%E6%8D%B7%2B%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553537/L-tike%20%E6%99%BA%E8%83%BD%E5%A1%AB%E5%86%99%EF%BC%88v5%20%E5%A4%9AProfile%E5%BF%AB%E6%8D%B7%2B%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 默认资料 ==========
  const defaultProfiles = {
    '测试': {
      elPhone: '07015404071',
      nameSei: '测试',
      nameMei: '测试',
      kanaSei: 'プー',
      kanaMei: 'プー',
      birthY: '2000',
      birthM: '11',
      birthD: '10',
      gender: '1',
      zip: '1200023',
      pref: '東京都',
      city: '足立区千住曙町',
      lnum: 'プー',
      oth: '123',
      companionPlusId: 'E1234552351',
      companionRegPhone: '1231231231',
      companionTicketPhone: '1231231231',
      autoAgree: true,
      autoSubmit: false
    },
    '展示用 Profile': {
      elPhone: '08012345678',
      nameSei: '山田',
      nameMei: '花子',
      kanaSei: 'ヤマダ',
      kanaMei: 'ハナコ',
      birthY: '1995',
      birthM: '05',
      birthD: '20',
      gender: '2',
      zip: '1500001',
      pref: '東京都',
      city: '渋谷区神宮前',
      lnum: '1-2-3',
      oth: '青山マンション201',
      companionPlusId: 'E01099999999',
      companionRegPhone: '08099999999',
      companionTicketPhone: '08088888888',
      autoAgree: true,
      autoSubmit: false
    }
  };

  // ========== 初始化状态 ==========
  let profiles = JSON.parse(localStorage.getItem('ltikeProfiles') || 'null') || defaultProfiles;
  let currentProfile = localStorage.getItem('ltikeCurrentProfile') || Object.keys(profiles)[0];
  let autoFill = localStorage.getItem('ltikeAutoFill') === 'true';

  // ========== 工具函数 ==========
  const setVal = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // 新增：多选择器写入，兼容不同页面的 id/name
  const setValAny = (sels, val) => {
    const selectors = Array.isArray(sels) ? sels : [sels];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;

      // 直接赋值 + 触发事件（兼容各种验证/联动）
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));

      // 额外走一次原生 setter（更稳，兼容某些框架/监听）
      try {
        const proto = Object.getPrototypeOf(el);
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc && typeof desc.set === 'function') {
          desc.set.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } catch (e) {}

      return true; // 成功写入一个就结束
    }
    return false;
  };

  const setChecked = (sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const saveAll = () => {
    localStorage.setItem('ltikeProfiles', JSON.stringify(profiles));
    localStorage.setItem('ltikeCurrentProfile', currentProfile);
    localStorage.setItem('ltikeAutoFill', autoFill);
  };

  // ========== 自动填写核心 ==========
  const fillForm = (d) => {
    // 自动选择“クレジットカード”
    const credit = document.querySelector('input[value="02"], input[name="PAYMENT_MTHD_SEL"][value="2"]');
    if (credit) {
      credit.checked = true;
      credit.dispatchEvent(new Event('change', { bubbles: true }));
    }

    setVal('#EL_TAKE_OVER_FR_TEL', d.elPhone);
    setVal('#EL_TAKE_OVER_FR_TEL_CNF', d.elPhone);
    setVal('#APLCT_FIRST_NAME', d.nameSei);
    setVal('#APLCT_LAST_NAME', d.nameMei);
    setVal('#APLCT_FIRST_NAME_KANA', d.kanaSei);
    setVal('#APLCT_LAST_NAME_KANA', d.kanaMei);
    setVal('#APLCT_BIRTHDAY_YEAR', d.birthY);
    setVal('#APLCT_BIRTHDAY_MONTH', d.birthM);
    setVal('#APLCT_BIRTHDAY_DAY', d.birthD);
    setChecked('#APLCT_GENDER-' + d.gender);
    setVal('#APLCT_ZIP', d.zip);
    setVal('#APLCT_PREF', d.pref);
    setVal('#APLCT_CITY', d.city);
    setVal('#APLCT_LNUM', d.lnum);
    setVal('#APLCT_OTH', d.oth);

    // ===== 同行人（修复：你这页是 q_1_companions[1]，同时兼容 q_2_* 页面）=====
    setValAny(
      [
        '#q_1_companions-1-emtg_id',
        '#q_2_companions-1-emtg_id',
        'input[name="q_1_companions[1][emtg_id]"]',
        'input[name="q_2_companions[1][emtg_id]"]'
      ],
      d.companionPlusId
    );

    setValAny(
      [
        '#q_1_companions-1-emtg_tel',
        '#q_2_companions-1-emtg_tel',
        'input[name="q_1_companions[1][emtg_tel]"]',
        'input[name="q_2_companions[1][emtg_tel]"]'
      ],
      d.companionRegPhone
    );

    setValAny(
      [
        '#q_1_companions-1-emtg_phone',
        '#q_2_companions-1-emtg_phone',
        'input[name="q_1_companions[1][emtg_phone]"]',
        'input[name="q_2_companions[1][emtg_phone]"]'
      ],
      d.companionTicketPhone
    );

    if (d.autoAgree) setChecked('#q_1-同意する');
    if (d.autoSubmit) {
      const next = document.querySelector('#NEXT_BUTTON');
      if (next) next.click();
    }
  };

  // ========== 编辑窗口 ==========
  const showEditor = () => {
    const overlay = document.createElement('div');
    overlay.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;
      z-index:9999;
    `;
    const p = profiles[currentProfile];
    const box = document.createElement('div');
    box.style = `
      background:#fff;padding:20px;border-radius:10px;width:440px;
      max-height:90vh;overflow-y:auto;font-family:sans-serif;
    `;
    box.innerHTML = `
      <h2>编辑：${currentProfile}</h2>
      ${Object.entries(p).map(([k, v]) => {
        if (typeof v === 'boolean') {
          return `<label><input type="checkbox" id="edit-${k}" ${v ? 'checked' : ''}/> ${k}</label><br>`;
        } else {
          return `<label>${k}:<br><input id="edit-${k}" value="${String(v).replace(/"/g, '&quot;')}" style="width:100%;padding:4px;margin-bottom:4px;"></label>`;
        }
      }).join('')}
      <div style="text-align:right;margin-top:8px;">
        <button id="save" style="${btnMini('#007aff')}">保存</button>
        <button id="cancel" style="${btnMini('#aaa')}">取消</button>
      </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector('#save').onclick = () => {
      Object.keys(p).forEach(k => {
        const el = document.querySelector(`#edit-${k}`);
        if (!el) return;
        p[k] = el.type === 'checkbox' ? el.checked : el.value;
      });
      profiles[currentProfile] = p;
      saveAll();
      document.body.removeChild(overlay);
    };
    box.querySelector('#cancel').onclick = () => document.body.removeChild(overlay);
  };

  // ========== 创建主菜单 ==========
  const createMenu = () => {
    const container = document.createElement('div');
    container.style = `
      position:fixed;top:20px;right:20px;z-index:9999;
      font-family:sans-serif;
    `;

    const mainBtn = document.createElement('button');
    mainBtn.textContent = '⚙ 一键填写';
    Object.assign(mainBtn.style, mainStyle('#007aff'));

    const menu = document.createElement('div');
    menu.style = `
      display:none;position:absolute;top:48px;right:0;
      background:#fff;border:1px solid #ccc;border-radius:8px;
      box-shadow:0 4px 10px rgba(0,0,0,0.15);
      padding:8px;width:260px;max-height:80vh;overflow-y:auto;
    `;

    // 动态渲染菜单内容
    const renderMenu = () => {
      menu.innerHTML = `
        <b>快速切换 Profile：</b><br>
        ${Object.keys(profiles)
          .map(p => `<button class="profileBtn" data-name="${p}"
              style="width:100%;text-align:left;${btnMini(p === currentProfile ? '#007aff' : '#8e8e93')}">
              ${p}
            </button>`)
          .join('')}
        <hr>
        <button id="editBtn" style="width:100%;${btnMini('#34c759')}">📝 编辑当前</button>
        <button id="addBtn" style="width:100%;${btnMini('#007aff')}">➕ 新建</button>
        <button id="delBtn" style="width:100%;${btnMini('#ff3b30')}">🗑 删除</button>
        <hr>
        <label style="display:flex;align-items:center;justify-content:space-between;">
          <span>⚡ 自动填写</span>
          <input type="checkbox" id="autoFillChk" ${autoFill ? 'checked' : ''}>
        </label>
      `;

      menu.querySelectorAll('.profileBtn').forEach(btn => {
        btn.onclick = () => {
          currentProfile = btn.dataset.name;
          saveAll();
          fillForm(profiles[currentProfile]);
          renderMenu();
        };
      });

      menu.querySelector('#editBtn').onclick = showEditor;
      menu.querySelector('#addBtn').onclick = () => {
        const n = prompt('新 Profile 名称：');
        if (n && !profiles[n]) {
          profiles[n] = JSON.parse(JSON.stringify(profiles[currentProfile]));
          currentProfile = n;
          saveAll();
          renderMenu();
        }
      };
      menu.querySelector('#delBtn').onclick = () => {
        if (confirm(`确定删除「${currentProfile}」吗？`)) {
          delete profiles[currentProfile];
          currentProfile = Object.keys(profiles)[0];
          saveAll();
          renderMenu();
        }
      };
      menu.querySelector('#autoFillChk').onchange = e => {
        autoFill = e.target.checked;
        saveAll();
      };
    };

    renderMenu();

    mainBtn.onclick = () => {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };
    document.addEventListener('click', e => {
      if (!container.contains(e.target)) menu.style.display = 'none';
    });

    container.appendChild(mainBtn);
    container.appendChild(menu);
    document.body.appendChild(container);
  };

  const mainStyle = (bg) => ({
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
  });

  const btnMini = (bg) => `
    background:${bg};color:#fff;border:none;border-radius:6px;
    padding:6px 8px;margin-top:4px;cursor:pointer;
  `;

  // ========== 初始化 ==========
  window.addEventListener('load', () => {
    setTimeout(() => {
      createMenu();
      if (autoFill) fillForm(profiles[currentProfile]);
    }, 1000);
  });
})();