// ==UserScript==
// @name         Windsurf Form Helper
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Hiển thị form hỗ trợ trên windsurf.com
// @author       You
// @match        https://*.windsurf.com/*
// @match        https://windsurf.com/*
// @connect      tinyhost.shop
// @grant        GM_xmlhttpRequest
// @license MIT
// @copyright 2025, vietquang99 (https://openuserjs.org/users/vietquang99)
/* jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/558691/Windsurf%20Form%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558691/Windsurf%20Form%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Danh sách tên ngẫu nhiên
  var firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia', 'Daniel', 'Isabella', 'Matthew', 'Mia', 'Andrew', 'Charlotte', 'Joseph', 'Amelia'];
  var lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  // Password mặc định
  var DEFAULT_PASSWORD = 'Qwert113@@@';

  // Danh sách domain cần ignore
  var IGNORE_DOMAINS = [];

  // Hàm lấy random item từ array
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Hàm simulate input event (để trigger React/Vue state update)
  function setInputValue(element, value) {
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(element, value);
    element.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    element.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  // Hàm tạo random số
  function getRandomNumbers(length) {
    var result = '';
    for (var i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  // Hàm tạo random username
  function generateRandomUsername() {
    var firstName = getRandomItem(firstNames).toLowerCase();
    var lastName = getRandomItem(lastNames).toLowerCase();
    var numbers = getRandomNumbers(4);
    return firstName + lastName + numbers;
  }

  // Hàm gọi API lấy random domains
  async function fetchRandomDomains() {
    try {
      var responseText = await new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://tinyhost.shop/api/random-domains/?limit=3',
          onload: function (res) {
            if (res.status >= 200 && res.status < 300) {
              resolve(res.responseText);
            } else {
              reject(new Error('HTTP ' + res.status));
            }
          },
          onerror: function () {
            reject(new Error('Request failed'));
          },
          ontimeout: function () {
            reject(new Error('Request timeout'));
          },
          timeout: 15000
        });
      });

      var data = JSON.parse(responseText);
      return (data && data.domains) ? data.domains : [];
    } catch (error) {
      console.error('❌ Lỗi khi gọi API:', error);
      return [];
    }
  }

  // Hàm lấy domain hợp lệ (không thuộc ignore list)
  async function getValidDomain() {
    var maxAttempts = 10; // Giới hạn số lần thử để tránh vòng lặp vô hạn
    var attempts = 0;

    while (attempts < maxAttempts) {
      var domains = await fetchRandomDomains();

      if (domains.length === 0) {
        console.log('⚠️ Không lấy được domain từ API');
        attempts++;
        continue;
      }

      // Lọc các domain không thuộc ignore list (chỉ kiểm tra nếu IGNORE_DOMAINS có giá trị)
      var validDomains = IGNORE_DOMAINS.length > 0
        ? domains.filter(function (domain) {
          return IGNORE_DOMAINS.indexOf(domain) === -1;
        })
        : domains;

      if (validDomains.length > 0) {
        // Lấy random 1 domain từ danh sách hợp lệ
        return getRandomItem(validDomains);
      }

      console.log('⚠️ Tất cả domain đều thuộc ignore list, thử lại...');
      attempts++;
    }

    throw new Error('Không thể lấy được domain hợp lệ sau ' + maxAttempts + ' lần thử');
  }

  // Hàm copy text vào clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        console.log('✅ Đã copy: ' + text);
        showMessage('✅ Đã copy email url!', 'success');
      }).catch(function (err) {
        console.error('❌ Lỗi khi copy:', err);
        showMessage('❌ Lỗi khi copy!', 'error');
      });
    } else {
      // Fallback cho các trình duyệt cũ
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('✅ Đã copy: ' + text);
        showMessage('✅ Đã copy email url!', 'success');
      } catch (err) {
        console.error('❌ Lỗi khi copy:', err);
        showMessage('❌ Lỗi khi copy!', 'error');
      }
      document.body.removeChild(textArea);
    }
  }

  // Hàm hiển thị thông báo trên UI
  function showMessage(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;

    var messageEl = document.getElementById('wh-message');
    if (!messageEl) return;

    // Xóa các class type cũ
    messageEl.className = 'wh-message';
    messageEl.classList.add(type);
    messageEl.textContent = message;
    messageEl.style.display = 'flex';

    // Tự động ẩn sau duration ms
    if (duration > 0) {
      setTimeout(function () {
        messageEl.style.display = 'none';
      }, duration);
    }
  }

  // Hàm click checkbox
  function setCheckbox(element, checked) {
    if (element.checked !== checked) {
      element.click();
    }
  }

  // Hàm click button Continue
  function clickContinueButton() {
    setTimeout(function () {
      var continueBtn = document.querySelector('button.bg-sk-aqua');

      if (continueBtn && !continueBtn.disabled) {
        continueBtn.click();
        console.log('✅ Đã click button Continue');
      }
      else {
        console.log('⚠️ Button Continue đang disabled hoặc không tìm thấy');
      }
    }, 300);
  }

  // Tạo container cho form
  var formContainer = document.createElement('div');
  formContainer.id = 'windsurf-helper-form';
  formContainer.innerHTML =
    '<div id="wh-form-wrapper">' +
    '<div id="wh-header">' +
    '<span>🏄 Windsurf Helper</span>' +
    '<button id="wh-toggle-btn">−</button>' +
    '</div>' +
    '<div id="wh-content">' +
    '<div class="wh-field">' +
    '<label for="wh-email">Email:</label>' +
    '<input type="email" id="wh-email" placeholder="Nhập email của bạn...">' +
    '<div id="wh-email-url-container" style="display: none; margin-top: 8px; padding: 8px; background: #f0f0f0; border-radius: 6px;">' +
    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
    '<span id="wh-email-url-label" style="font-size: 12px; color: #555; word-break: break-all;"></span>' +
    '<button id="wh-copy-email" title="Copy Email" style="background: transparent; border: none; cursor: pointer; font-size: 18px; padding: 4px 8px; margin-left: 8px;">📋</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="wh-otp-container" style="display: none; margin-top: 8px; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px;">' +
    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
    '<span id="wh-otp-label" style="font-size: 16px; color: white; font-weight: bold;"></span>' +
    '<button id="wh-copy-otp" title="Copy OTP" style="background: rgba(255,255,255,0.2); border: none; cursor: pointer; font-size: 16px; padding: 6px 10px; border-radius: 4px; color: white;">📋</button>' +
    '</div>' +
    '</div>' +
    '<div id="wh-message" class="wh-message" style="display: none;"></div>' +
    '<div class="wh-buttons">' +
    '<button id="wh-generate-email" class="wh-btn wh-btn-success">Generate Random Email</button>' +
    '<button id="wh-fill-random" class="wh-btn wh-btn-primary">Fill Random Info</button>' +
    '<button id="wh-fill-password" class="wh-btn wh-btn-secondary">Fill Password</button>' +
    '<button id="wh-fill-otp" class="wh-btn wh-btn-info">Fill OTP</button>' +
    '</div>' +
    '</div>' +
    '</div>';

  // CSS styles
  var styles = document.createElement('style');
  styles.textContent =
    '#windsurf-helper-form {' +
    'position: fixed;' +
    'bottom: 10px;' +
    'right: 10px;' +
    'z-index: 999999;' +
    'font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;' +
    '}' +
    '#wh-form-wrapper {' +
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
    'border-radius: 12px;' +
    'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);' +
    'overflow: hidden;' +
    'min-width: 280px;' +
    'max-width: 320px;' +
    '}' +
    '@media (max-width: 480px) {' +
    '#wh-form-wrapper {' +
    'min-width: 200px;' +
    'max-width: 220px;' +
    '}' +
    '#wh-header {' +
    'padding: 8px 10px;' +
    'font-size: 12px;' +
    '}' +
    '#wh-content {' +
    'padding: 10px;' +
    '}' +
    '.wh-field label {' +
    'font-size: 11px;' +
    '}' +
    '.wh-field input {' +
    'padding: 6px 8px;' +
    'font-size: 12px;' +
    '}' +
    '.wh-btn {' +
    'padding: 6px 10px;' +
    'font-size: 11px;' +
    '}' +
    '#wh-email-url-container {' +
    'padding: 6px !important;' +
    '}' +
    '#wh-email-url-label {' +
    'font-size: 10px !important;' +
    '}' +
    '#wh-otp-container {' +
    'padding: 6px !important;' +
    '}' +
    '#wh-otp-label {' +
    'font-size: 12px !important;' +
    '}' +
    '.wh-message {' +
    'padding: 6px 8px;' +
    'font-size: 10px;' +
    '}' +
    '}' +
    '#wh-header {' +
    'display: flex;' +
    'justify-content: space-between;' +
    'align-items: center;' +
    'padding: 12px 15px;' +
    'background: rgba(0, 0, 0, 0.2);' +
    'color: white;' +
    'font-weight: bold;' +
    'font-size: 14px;' +
    'cursor: move;' +
    '}' +
    '#wh-toggle-btn {' +
    'background: rgba(255, 255, 255, 0.2);' +
    'border: none;' +
    'color: white;' +
    'width: 24px;' +
    'height: 24px;' +
    'border-radius: 50%;' +
    'cursor: pointer;' +
    'font-size: 16px;' +
    'line-height: 1;' +
    'transition: background 0.3s;' +
    '}' +
    '#wh-toggle-btn:hover {' +
    'background: rgba(255, 255, 255, 0.4);' +
    '}' +
    '#wh-content {' +
    'padding: 15px;' +
    'background: white;' +
    '}' +
    '#wh-content.collapsed {' +
    'display: none;' +
    '}' +
    '.wh-field {' +
    'margin-bottom: 15px;' +
    '}' +
    '.wh-field label {' +
    'display: block;' +
    'margin-bottom: 5px;' +
    'font-weight: 600;' +
    'color: #333;' +
    'font-size: 13px;' +
    '}' +
    '.wh-field input {' +
    'width: 100%;' +
    'padding: 10px 12px;' +
    'border: 2px solid #e0e0e0;' +
    'border-radius: 8px;' +
    'font-size: 14px;' +
    'transition: border-color 0.3s, box-shadow 0.3s;' +
    'box-sizing: border-box;' +
    '}' +
    '.wh-field input:focus {' +
    'outline: none;' +
    'border-color: #667eea;' +
    'box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);' +
    '}' +
    '.wh-buttons {' +
    'display: flex;' +
    'flex-direction: column;' +
    'gap: 10px;' +
    '}' +
    '.wh-btn {' +
    'padding: 10px 15px;' +
    'border: none;' +
    'border-radius: 8px;' +
    'font-size: 13px;' +
    'font-weight: 600;' +
    'cursor: pointer;' +
    'transition: transform 0.2s, box-shadow 0.2s;' +
    '}' +
    '.wh-btn:hover {' +
    'transform: translateY(-2px);' +
    'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);' +
    '}' +
    '.wh-btn:active {' +
    'transform: translateY(0);' +
    '}' +
    '.wh-btn-primary {' +
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
    'color: white;' +
    '}' +
    '.wh-btn-secondary {' +
    'background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);' +
    'color: white;' +
    '}' +
    '.wh-btn-success {' +
    'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);' +
    'color: white;' +
    '}' +
    '.wh-message {' +
    'padding: 10px 12px;' +
    'border-radius: 6px;' +
    'margin-bottom: 10px;' +
    'font-size: 12px;' +
    'font-weight: 500;' +
    'display: flex;' +
    'align-items: center;' +
    'gap: 6px;' +
    '}' +
    '.wh-message.success {' +
    'background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);' +
    'color: #155724;' +
    'border: 1px solid #c3e6cb;' +
    '}' +
    '.wh-message.error {' +
    'background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);' +
    'color: #721c24;' +
    'border: 1px solid #f5c6cb;' +
    '}' +
    '.wh-message.warning {' +
    'background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);' +
    'color: #856404;' +
    'border: 1px solid #ffeeba;' +
    '}' +
    '.wh-message.info {' +
    'background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);' +
    'color: #0c5460;' +
    'border: 1px solid #bee5eb;' +
    '}' +
    '.wh-btn-info {' +
    'background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);' +
    'color: white;' +
    '}';

  // Thêm vào DOM
  document.head.appendChild(styles);
  document.body.appendChild(formContainer);

  // Toggle form content
  var toggleBtn = document.getElementById('wh-toggle-btn');
  var content = document.getElementById('wh-content');
  var isCollapsed = false;

  toggleBtn.addEventListener('click', function () {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      content.classList.add('collapsed');
      toggleBtn.textContent = '+';
    }
    else {
      content.classList.remove('collapsed');
      toggleBtn.textContent = '−';
    }
  });

  // Fill Random Info
  document.getElementById('wh-fill-random').addEventListener('click', function () {
    var userEmail = document.getElementById('wh-email').value;

    if (!userEmail || userEmail.indexOf('@') === -1) {
      showMessage('⚠️ Vui lòng nhập email hợp lệ trước!', 'warning');
      document.getElementById('wh-email').focus();
      return;
    }

    var firstNameInput = document.getElementById('firstName');
    var lastNameInput = document.getElementById('lastName');
    var emailInput = document.getElementById('email');
    var termsCheckbox = document.getElementById('terms');

    if (!firstNameInput || !lastNameInput || !emailInput) {
      showMessage('❌ Không tìm thấy các input fields trên trang!', 'error');
      return;
    }

    var randomFirstName = getRandomItem(firstNames);
    var randomLastName = getRandomItem(lastNames);

    setInputValue(firstNameInput, randomFirstName);
    setInputValue(lastNameInput, randomLastName);
    setInputValue(emailInput, userEmail);

    if (termsCheckbox) {
      setCheckbox(termsCheckbox, true);
    }

    clickContinueButton();
    console.log('✅ Đã điền: ' + randomFirstName + ' ' + randomLastName + ' - ' + userEmail);
  });

  // Fill Password
  document.getElementById('wh-fill-password').addEventListener('click', function () {
    var passwordInput = document.getElementById('password');
    var passwordConfirmInput = document.getElementById('passwordConfirmation');

    if (!passwordInput || !passwordConfirmInput) {
      showMessage('❌ Không tìm thấy các input password trên trang!', 'error');
      return;
    }

    setInputValue(passwordInput, DEFAULT_PASSWORD);
    setInputValue(passwordConfirmInput, DEFAULT_PASSWORD);

    clickContinueButton();
    console.log('✅ Đã điền password thành công!');
  });

  // Generate Random Email
  document.getElementById('wh-generate-email').addEventListener('click', async function () {
    var generateBtn = this;
    var emailInput = document.getElementById('wh-email');
    var emailUrlContainer = document.getElementById('wh-email-url-container');
    var emailUrlLabel = document.getElementById('wh-email-url-label');

    // Disable button và hiển thị loading
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
      // Bước 1 & 2: Lấy domain hợp lệ
      var domain = await getValidDomain();
      console.log('✅ Domain được chọn:', domain);

      // Bước 3: Tạo random username
      var username = generateRandomUsername();
      console.log('✅ Username được tạo:', username);

      // Bước 4: Tạo email và fill vào input
      var fullEmail = username + '@' + domain;
      setInputValue(emailInput, fullEmail);
      console.log('✅ Email đã được tạo:', fullEmail);

      // Hiển thị Email URL
      var emailUrl = 'tinyhost.shop/' + fullEmail;
      emailUrlLabel.textContent = 'Email URL: ' + emailUrl;
      emailUrlContainer.style.display = 'block';

      showMessage('✅ Đã tạo email: ' + fullEmail, 'success');
    } catch (error) {
      console.error('❌ Lỗi:', error);
      showMessage('❌ Có lỗi xảy ra: ' + error.message, 'error', 5000);
    } finally {
      // Enable lại button
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Random Email';
    }
  });

  // Copy Email
  document.getElementById('wh-copy-email').addEventListener('click', function () {
    var emailInput = document.getElementById('wh-email');
    var info = `Email: ${emailInput.value} | Password: Qwert113@@@ | Email: tinyhost.shop/${emailInput.value}`;

    if (email) {
      copyToClipboard(info);
    } else {
      showMessage('⚠️ Chưa có email để copy!', 'warning');
    }
  });

  // Ẩn Email URL khi người dùng tự nhập email
  document.getElementById('wh-email').addEventListener('input', function () {
    var emailUrlContainer = document.getElementById('wh-email-url-container');
    var otpContainer = document.getElementById('wh-otp-container');
    // Chỉ ẩn nếu không phải từ script fill
    if (this.value && !this.value.match(/^[a-z]+[a-z]+\d{4}@/)) {
      emailUrlContainer.style.display = 'none';
      otpContainer.style.display = 'none';
    }
  });

  // Hàm gọi API lấy OTP từ email
  async function fetchOTPFromEmail(domain, username) {
    try {
      var url = 'https://tinyhost.shop/api/email/' + domain + '/' + username + '/?page=1&limit=20';
      var responseText = await new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function (res) {
            if (res.status >= 200 && res.status < 300) {
              resolve(res.responseText);
            } else {
              reject(new Error('HTTP ' + res.status));
            }
          },
          onerror: function () {
            reject(new Error('Request failed'));
          },
          ontimeout: function () {
            reject(new Error('Request timeout'));
          },
          timeout: 15000
        });
      });

      var data = JSON.parse(responseText);
      return (data && data.emails) ? data.emails : [];
    } catch (error) {
      console.error('❌ Lỗi khi gọi API email:', error);
      throw error;
    }
  }

  // Hàm extract OTP từ subject
  function extractOTPFromSubject(subject) {
    // Subject format: "016339 - Verify your Email with Windsurf"
    var match = subject.match(/^(\d{6})\s*-/);
    if (match) {
      return match[1];
    }
    return null;
  }

  // Fill OTP vào các input và click Create account
  document.getElementById('wh-fill-otp').addEventListener('click', async function () {
    var fillOtpBtn = this;
    var emailInput = document.getElementById('wh-email');
    var otpContainer = document.getElementById('wh-otp-container');
    var email = emailInput.value;

    if (!email || email.indexOf('@') === -1) {
      showMessage('⚠️ Vui lòng tạo email trước!', 'warning');
      return;
    }

    // Parse email để lấy username và domain
    var emailParts = email.split('@');
    var username = emailParts[0];
    var domain = emailParts[1];

    // Disable button và hiển thị loading
    fillOtpBtn.disabled = true;
    fillOtpBtn.textContent = 'Filling...';

    try {
      var emails = await fetchOTPFromEmail(domain, username);

      if (emails.length === 0) {
        showMessage('⚠️ Chưa có email nào trong hộp thư!', 'warning');
        return;
      }

      // Tìm email có subject chứa "Verify your Email with Windsurf"
      var verifyEmail = null;
      for (var i = 0; i < emails.length; i++) {
        if (emails[i].subject && emails[i].subject.indexOf('Verify your Email with Windsurf') !== -1) {
          verifyEmail = emails[i];
          break;
        }
      }

      if (!verifyEmail) {
        showMessage('⚠️ Không tìm thấy email xác thực Windsurf!', 'warning');
        return;
      }

      // Extract OTP từ subject
      var otp = extractOTPFromSubject(verifyEmail.subject);

      if (!otp) {
        showMessage('❌ Không thể lấy mã OTP từ email!', 'error');
        return;
      }

      // Hiển thị OTP trong container
      var otpLabel = document.getElementById('wh-otp-label');
      otpLabel.textContent = 'OTP: ' + otp;
      otpContainer.style.display = 'block';
      otpContainer.setAttribute('data-otp', otp);

      // Tìm các input OTP trên trang
      var otpInputs = document.querySelectorAll('div.flex.justify-between.gap-2 input[maxlength="1"]');

      if (otpInputs.length === 0) {
        showMessage('❌ Không tìm thấy các input OTP trên trang!', 'error');
        return;
      }

      // Fill OTP vào từng input
      for (var j = 0; j < otpInputs.length && j < otp.length; j++) {
        setInputValue(otpInputs[j], otp[j]);
      }

      console.log('✅ Đã điền OTP:', otp);

      // Đợi một chút rồi click button Create account
      setTimeout(function () {
        var createAccountBtn = document.querySelector('button[type="submit"].bg-sk-aqua');

        if (createAccountBtn && !createAccountBtn.disabled) {
          createAccountBtn.click();
          console.log('✅ Đã click button Create account');
          showMessage('✅ Đã điền OTP và click Create account!', 'success');
        } else {
          console.log('⚠️ Button Create account đang disabled hoặc không tìm thấy');
          showMessage('✅ Đã điền OTP! Button Create account chưa sẵn sàng.', 'warning');
        }
      }, 500);

    } catch (error) {
      console.error('❌ Lỗi:', error);
      showMessage('❌ Có lỗi xảy ra: ' + error.message, 'error', 5000);
    } finally {
      // Enable lại button
      fillOtpBtn.disabled = false;
      fillOtpBtn.textContent = 'Fill OTP';
    }
  });

  // Copy OTP
  document.getElementById('wh-copy-otp').addEventListener('click', function () {
    var otpContainer = document.getElementById('wh-otp-container');
    var otp = otpContainer.getAttribute('data-otp');

    if (otp) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(otp).then(function () {
          showMessage('✅ Đã copy OTP: ' + otp, 'success');
        }).catch(function (err) {
          showMessage('❌ Lỗi khi copy!', 'error');
        });
      } else {
        var textArea = document.createElement('textarea');
        textArea.value = otp;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showMessage('✅ Đã copy OTP: ' + otp, 'success');
        } catch (err) {
          showMessage('❌ Lỗi khi copy!', 'error');
        }
        document.body.removeChild(textArea);
      }
    } else {
      showMessage('⚠️ Chưa có OTP để copy!', 'warning');
    }
  });

  console.log('✅ Windsurf Helper Form đã được tải thành công!');
})();
