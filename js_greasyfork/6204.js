// ==UserScript==
// @name                Text Captcha Alert
// @namespace           No-one
// @author              DCI
// @version             0.1
// @description         Alerts when a captcha is encountered.
// @include             https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/continue*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/return*
// @require             http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/6204/Text%20Captcha%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/6204/Text%20Captcha%20Alert.meta.js
// ==/UserScript==


if ($('input[name="userCaptchaResponse"]').length > 0) {
alert("Captcha");}