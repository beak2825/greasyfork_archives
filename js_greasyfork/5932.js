// ==UserScript==
// @name      Nicopedia-Resanchor-Popup
// @namespace https://github.com/kosh04/userscript
// @version   0.20190308
// @description  ニコニコ大百科 掲示板のレスアンカーをポップアップ表示する
// @grant     GM_addStyle
// @grant     GM_getResourceURL
// @grant     GM_getResourceText
// @match     http://dic.nicovideo.jp/*
// @match     https://dic.nicovideo.jp/*
// @require   https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require   https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js
// @resource  jquery-ui.css https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/jquery-ui.css
// @resource  images/ui-bg_flat_75_ffffff_40x100.png https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_flat_75_ffffff_40x100.png
// @author    kosh (mono)
// @license   Public domain
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/5932/Nicopedia-Resanchor-Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/5932/Nicopedia-Resanchor-Popup.meta.js
// ==/UserScript==

// ChangeLog
// =========
// * 0.20190308 PC版サイトのデザインリニューアルに伴うCSSセレクタの修正
// * 0.20141021 初版

/* global jQuery, $ */

// https://stackoverflow.com/a/17606289/4499880
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

let css = GM_getResourceText("jquery-ui.css");
[
    "images/ui-bg_flat_75_ffffff_40x100.png",
].forEach(resource => {
    css = css.replaceAll(resource, GM_getResourceURL(resource));
});
GM_addStyle(css);
GM_addStyle(`
.ui-tooltip {
  min-width: 600px;
  font-size: small;
  line-height: 1.3em;
  text-align: left;
}
`);

function getAnchorContent(id, context) {
    let doc = document;
    // jQueryによるHTML解析は<script>が実行されるらしい
    // var $anchor = $(context || document).find("a[name=" + id + "]");

    if (typeof context === "string") {
        let parser = new DOMParser();
        doc = parser.parseFromString(context, "text/html");
    }

    let $anchor = $(doc).find(`a[name=${id}]`);
    if ($anchor.length === 0) {
        return null;
    }

    let $parent = $anchor.parent();
    let dt = $parent[0].outerHTML;
    let dd = $parent.next()[0].outerHTML;
    return `<dl>${dt}${dd}</dl>`;
}

$(".st-bbs_resbody a.dic").filter(function() {
    return this.hash.match(/^#[0-9]+$/);
}).tooltip({
    items: "[href]",
    content: "読み込み中",
    open: function(event, ui) {
        let $elem = $(this);
        let url = this.href;
        let anchor_id = this.hash.substring(1);
        let content = getAnchorContent(anchor_id);
        let popup = function(content) {
            $elem.tooltip("option", "content", content);
        };
        if (content && !content.includes("全て読むにはこのリンクをクリック！")) {
            // console.log("同じページ");
            popup(content);
        } else {
            // console.log("別のページ");
            $.get(url, null, function(data) {
                let content = getAnchorContent(anchor_id, data) || "見つかりません";
                popup(content);
            });
        }
    },
    /*
    // 表示位置をカーソルの右上にするとレスと被らなくて見やすい
    // ただし、カーソルのフォーカスと表示が引っかかる気がする
    position: {
        at: "right top-20",
        my: "right bottom"
    }
*/
});
