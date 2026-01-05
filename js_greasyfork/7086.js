// ==UserScript==
// @name			Jurablogs Unframe
// @namespace		reibuehl
// @description		Unframe posts on Jurablogs.com.
// @include			http://www.jurablogs.com/go/*
// @grant none
// @version 0.0.1.20141221065927
// @downloadURL https://update.greasyfork.org/scripts/7086/Jurablogs%20Unframe.user.js
// @updateURL https://update.greasyfork.org/scripts/7086/Jurablogs%20Unframe.meta.js
// ==/UserScript==

window.location = document.getElementById("sp").src;