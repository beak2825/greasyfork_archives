// ==UserScript==
// @name           tieba autosign v2
// @description    貼吧自動簽到
// @include        http://tieba.baidu.com/f?*
// @version 0.0.2
// @namespace https://greasyfork.org/users/6037
// @downloadURL https://update.greasyfork.org/scripts/5833/tieba%20autosign%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/5833/tieba%20autosign%20v2.meta.js
// ==/UserScript==
if(document.querySelector(".cancel_focus")){
    if(document.querySelector(".j_cansign")){
        document.querySelector(".j_cansign").onclick=undefined;
        document.querySelector(".j_cansign").click();
    }}
