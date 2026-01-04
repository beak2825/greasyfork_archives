// ==UserScript==
// @name         GrabCAD SignUp Autofill (Realistic Name + Random Email + School + Afghanistan)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动填充 GrabCAD 注册表单（拟真英文姓名 + 随机邮箱 + Location=Afghanistan + 随机学校名）
// @match        *://*/*
// @grant        window.open
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552099/GrabCAD%20SignUp%20Autofill%20%28Realistic%20Name%20%2B%20Random%20Email%20%2B%20School%20%2B%20Afghanistan%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552099/GrabCAD%20SignUp%20Autofill%20%28Realistic%20Name%20%2B%20Random%20Email%20%2B%20School%20%2B%20Afghanistan%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 随机字符串生成 **/
  function randomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  /** 随机英文名生成 **/
  function randomEnglishName() {
    const firstNames = [
      'James', 'John', 'Robert', 'Michael', 'William',
      'David', 'Richard', 'Joseph', 'Charles', 'Thomas',
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth',
      'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Daniel', 'Paul', 'Mark', 'Donald', 'George',
      'Steven', 'Edward', 'Brian', 'Kevin', 'Jason'
    ];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
      'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
      'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
    ];

    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return { first, last };
  }

  /** 模拟手动输入 **/
  function simulateInput(element, text) {
    if (!element) return;
    element.focus();
    element.value = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      element.value += char;
      element.dispatchEvent(new InputEvent('input', { data: char, bubbles: true }));
    }
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.blur();
  }

  /** 填充表单 **/
  function fillForm() {
    const firstName = document.querySelector('input[placeholder="First"], input[name="firstName"]');
    const lastName = document.querySelector('input[placeholder="Last"], input[name="lastName"]');
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[type="password"]');
    const phone = document.querySelector('input[type="tel"], input[name="phone"], input[placeholder*="phone"]');
    const universityInput = document.querySelector('input[name="university_name"], input[placeholder*="school"]');

    // 拟真姓名 & 邮箱
    const { first, last } = randomEnglishName();
    const randStr = randomString(8);
    const mail = `${first.toLowerCase()}.${last.toLowerCase()}${randStr.slice(0, 3)}@linshiyou.com`;

    const randomSchool = [
      'Global Tech University',
      'Skyline College',
      'Everest Institute',
      'Riverdale University',
      'Brightway Academy',
      'Northern State University',
      'Summit Polytechnic',
      'Harmony International College'
    ][Math.floor(Math.random() * 8)];

    // 填充基础输入
    simulateInput(firstName, first);
    simulateInput(lastName, last);
    simulateInput(email, mail);
    simulateInput(password, 'Test1234!');
    simulateInput(phone, '+1234567890');
    simulateInput(universityInput, randomSchool);

    // ===== Location 选择 Afghanistan =====
    setTimeout(() => {
      const countryBox = [...document.querySelectorAll('.multiselect')].find(e =>
        e.textContent.includes('Select your country') || e.textContent.includes('Select location')
      );
      if (countryBox) {
        countryBox.click();
        setTimeout(() => {
          const input = countryBox.querySelector('input[type="text"]');
          if (input) {
            input.focus();
            input.value = 'Afghanistan';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 200);
        setTimeout(() => {
          const option = [...document.querySelectorAll('.multiselect__option')].find(o =>
            o.textContent.includes('Afghanistan')
          );
          if (option) option.click();
        }, 800);
      }
    }, 800);

    // ===== Role 选择 Student =====
    setTimeout(() => {
      const roleBox = [...document.querySelectorAll('.multiselect')].find(e =>
        e.textContent.includes('Select response') || e.textContent.includes('Sales')
      );
      if (roleBox) {
        roleBox.click();
        setTimeout(() => {
          const input = roleBox.querySelector('input[type="text"]');
          if (input) {
            input.focus();
            input.value = 'Student';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 200);
        setTimeout(() => {
          const option = [...document.querySelectorAll('.multiselect__option')].find(o =>
            o.textContent.includes('Student')
          );
          if (option) option.click();
        }, 900);
      }
    }, 1600);

    // 打开 linshiyou 邮箱
    window.open(`https://linshiyou.com/#/${mail}`, '_blank', 'noopener,noreferrer');
    console.log('✅ 已模拟输入并打开邮箱：', mail, '| 学校：', randomSchool);

  }

  /** 等待页面加载完成 **/
  const observer = new MutationObserver(() => {
    if (document.querySelector('input[placeholder="First"], input[name="firstName"]')) {
      observer.disconnect();
      fillForm();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
