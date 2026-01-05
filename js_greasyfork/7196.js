// ==UserScript==
// @name          vOz Style
// @namespace     http://userstyles.org
// @description	  (Banh rộng, canh giữa hình, làm màu khung Reply, autohide logo...)
// @author        Kamikize
// @homepage      http://userstyles.org/styles/108529
// @include       *vozforums.com*
// @run-at        document-start
// @version 0.0.1.20141228104119
// @downloadURL https://update.greasyfork.org/scripts/7196/vOz%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/7196/vOz%20Style.meta.js
// ==/UserScript==
(function() {
var css = "/* Banh rộng  + xóa khung phải +  mở rộng tránh tên nick đụng time, bỏ scrollbar ngang) */\n.page {min-width: 99%; background: #5C7099} body {margin:auto} TD[width=\"160\"] {display:none}\n[style*=wrap] > STRONG {margin-right:100px} html {overflow-x:hidden}\n  \n/* Canh giữa hình, test: http://vozforums.com/showthread.php?t=2663169 */\n[id*=\"ncode_imageresizer\"],\ndiv[id*=\"post_message_\"] [onload=\"NcodeImageResizer.createOn(this);\"]:not([src*=\"vozforums.com/images/smilies\"])\n{margin-left: auto !Important; margin-right: auto !important; display:table !important}\n  \n/* Fix vụ vỡ bố cục trang khi mở ảnh to , test : http://vozforums.com/showthread.php?t=3687819 */\n.alt1 *  {margin-right: auto ;margin-left:auto}\n  \n/* Làm màu khung Reply */\n.panel , .fieldset, .vBulletin_editor, .button, [id$=smiliebox] {background: #E4E7F5 !important; border:none !important}\n.button {height: 30px} .button:hover, .imagebutton * {background: #F2F2FF} \n \n/* Banh rộng khung soạn thảo */\nDIV[style=\"width:640px\"], [type*=\"javascript\"] + TABLE, #vB_Editor_001_textarea {min-width:100% }\n\n/* Autohide Logo */\n#neo_logobar:not(:hover){opacity:0;margin-top:-100px;transition:0.4s}";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();