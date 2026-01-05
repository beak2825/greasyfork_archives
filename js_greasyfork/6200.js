// ==UserScript==
// @name       Focus mTurk IFrame
// @namespace  http://mturkconsultant.com
// @version    1.0
// @description Focus the Mechanical Turk IFrame. Useful for many HITs, especially those that use keyboard controls.
// @match      https://*.mturk.com/mturk/*
// @copyright  Public domain
// @downloadURL https://update.greasyfork.org/scripts/6200/Focus%20mTurk%20IFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/6200/Focus%20mTurk%20IFrame.meta.js
// ==/UserScript==

var mturk_iframe = document.querySelector("iframe")

if (mturk_iframe){mturk_iframe.focus()}