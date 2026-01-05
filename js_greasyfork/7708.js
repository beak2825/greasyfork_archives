// ==UserScript==
// @name         bangumi sort
// @name:zh-CN   Bangumi 番组计划 - 排序
// @namespace    http://ladio.me/
// @version      0.2
// @description  sort items in alphabet order so you won't confuse any more
// @description:zh-CN  按字母顺序排序观看中的节目单, 不再晕菜了
// @author       Xuefer
// @include      http://bangumi.tv/*
// @include      http://bgm.tv/*
// @include      http://chii.in/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/7708/bangumi%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/7708/bangumi%20sort.meta.js
// ==/UserScript==

function changeLayout() {
    // wait for element to finish
    if (!unsafeWindow.loadXML) {
        setTimeout(changeLayout, 1);
        return;
    }
    var list = document.getElementById("cloumnSubjectInfo");
	var link = document.createElement("a");
	link.href = "https://greasyfork.org/en/scripts/382353-bangumi-enhancement"
	var text = document.createTextNode("请替换 bangumi sort 为另一个脚本");
	link.style.color = "red";
	link.style.textDecoration = "underline";
	link.appendChild(text);
	list.insertBefore(link, list.childNodes[0]);
}
changeLayout();