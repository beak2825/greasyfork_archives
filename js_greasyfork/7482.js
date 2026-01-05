// ==UserScript==
// @name Lectio autologin
// @namespace https://greasyfork.org/en/users/8372-sbares
// @description Automatisk login til Lectio
// @include http*://www.lectio.dk/*
// @version 1.0.2.5
// @noframes
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/7482/Lectio%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/7482/Lectio%20autologin.meta.js
// ==/UserScript==
var autologin = GM_getValue('lectio_autologin', true);
function toggleFunction() {
  GM_setValue('lectio_autologin', !autologin);
  location.reload();
}
exportFunction(toggleFunction, unsafeWindow, {
  defineAs: 'toggleFunction'
});
var elem = document.getElementById('s_m_mastermenu');
if (!elem) elem = document.getElementById('m_mastermenu');
var node = elem.childNodes[1];
var innerText = 'Slå autologin til';
if (autologin) {
  innerText = 'Slå autologin fra';
}
node.innerHTML = node.innerHTML + '<div class="button"><a id="m_toggle_autologin" href="javascript:toggleFunction();">' + innerText + '</a></div>';
if (!String.contains(location, 'login.aspx')) {
  return;
}
var usernameTextbox = document.getElementById('m_Content_username2');
var passwordTextbox = document.getElementById('password2');
var submitButton = document.getElementById('m_Content_submitbtn2');
var username = GM_getValue('lectio_username', '');
var password = GM_getValue('lectio_password', '');
if (autologin && username != '' && password != '') {
  usernameTextbox.value = username;
  passwordTextbox.value = password;
  submitButton.onclick();
} 
else {
  function submitFunction() {
    setTimeout(function () {
      GM_setValue('lectio_username', username);
      GM_setValue('lectio_password', password);
    });
  }
  function usernameFunction() {
    setTimeout(function () {
      username = usernameTextbox.value;
    });
  }
  function passwordFunction() {
    setTimeout(function () {
      password = passwordTextbox.value;
    });
  }
  exportFunction(submitFunction, unsafeWindow, {
    defineAs: 'submitFunction'
  });
  exportFunction(usernameFunction, unsafeWindow, {
    defineAs: 'usernameFunction'
  });
  exportFunction(passwordFunction, unsafeWindow, {
    defineAs: 'passwordFunction'
  });
  submitButton.setAttribute('onclick', 'submitFunction(); ' + submitButton.getAttribute('onclick'));
  usernameTextbox.setAttribute('onkeypress', usernameTextbox.getAttribute('onkeypress') + '; usernameFunction()');
  passwordTextbox.setAttribute('onkeypress', passwordTextbox.getAttribute('onkeypress') + '; passwordFunction()');
}
