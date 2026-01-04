// ==UserScript==
// @name         L-tike AutoFill Pro
// @namespace    https://pzl233.dev/
// @version      5.1
// @description  一键填写 L-tike 表单 + 自动选择信用卡付款 + Profile 管理 + 折叠菜单快捷切换 + 自动模式
// @author       pzl233
// @license      MIT
// @homepage     https://github.com/pzl233/ltike-autofill
// @supportURL   https://github.com/pzl233/ltike-autofill/issues
// @icon         https://l-tike.com/favicon.ico
// @match        https://l-tike.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553537/L-tike%20AutoFill%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/553537/L-tike%20AutoFill%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    // 默认只有一个展示用 Profile
    const defaultProfiles = {
      '展示用 Profile': {
        elPhone: '08012345678',
        nameSei: '前桑',
        nameMei: '实力深不可测',
        kanaSei: 'ヤマダ',
        kanaMei: 'ハナコ',
        birthY: '1995',
        birthM: '05',
        birthD: '17',
        gender: '1',
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
  
    let profiles = JSON.parse(localStorage.getItem('ltikeProfiles') || 'null') || defaultProfiles;
    let currentProfile = localStorage.getItem('ltikeCurrentProfile') || Object.keys(profiles)[0];
    let autoFill = localStorage.getItem('ltikeAutoFill') === 'true';
  
    const setVal = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
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
  
    const fillForm = (d) => {
      // 自动选择信用卡付款
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
      setVal('#q_2_companions-1-emtg_id', d.companionPlusId);
      setVal('#q_2_companions-1-emtg_tel', d.companionRegPhone);
      setVal('#q_2_companions-1-emtg_phone', d.companionTicketPhone);
      if (d.autoAgree) setChecked('#q_1-同意する');
      if (d.autoSubmit) {
        const next = document.querySelector('#NEXT_BUTTON');
        if (next) next.click();
      }
    };
  
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
        ${Object.entries(p).map(([k, v]) =>
          typeof v === 'boolean'
            ? `<label><input type="checkbox" id="edit-${k}" ${v ? 'checked' : ''}/> ${k}</label><br>`
            : `<label>${k}:<br><input id="edit-${k}" value="${v}" style="width:100%;padding:4px;margin-bottom:4px;"></label>`
        ).join('')}
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
  
    const createMenu = () => {
      const container = document.createElement('div');
      container.style = `
        position:fixed;top:20px;right:20px;z-index:9999;font-family:sans-serif;
      `;
  
      const mainBtn = document.createElement('button');
      mainBtn.textContent = '⚙ 一键填写';
      Object.assign(mainBtn.style, mainStyle('#007aff'));
  
      const menu = document.createElement('div');
      menu.style = `
        display:none;position:absolute;top:48px;right:0;
        background:#fff;border:1px solid #ccc;border-radius:8px;
        box-shadow:0 4px 10px rgba(0,0,0,0.15);
        padding:8px;width:260px;
      `;
  
      menu.innerHTML = `
        <button id="doFill" style="width:100%;${btnMini('#007aff')}">🟦 一键填写</button>
        <button id="editBtn" style="width:100%;${btnMini('#34c759')}">📝 编辑</button>
        <hr>
        <label style="display:flex;align-items:center;justify-content:space-between;">
          <span>⚡ 自动填写</span>
          <input type="checkbox" id="autoFillChk" ${autoFill ? 'checked' : ''}>
        </label>
      `;
  
      menu.querySelector('#doFill').onclick = () => fillForm(profiles[currentProfile]);
      menu.querySelector('#editBtn').onclick = showEditor;
      menu.querySelector('#autoFillChk').onchange = e => {
        autoFill = e.target.checked;
        saveAll();
      };
  
      mainBtn.onclick = () => menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
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
  
    window.addEventListener('load', () => {
      setTimeout(() => {
        createMenu();
        if (autoFill) fillForm(profiles[currentProfile]);
      }, 1000);
    });
  })();
  