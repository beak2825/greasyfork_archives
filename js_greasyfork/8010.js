// ==UserScript==
// @name         Redmine Wiki Auto Preview
// @namespace    https://greasyfork.org/ja/scripts/8010
// @version      1.0.9
// @description  Show and update preview in Redmine wiki
// @author       k.bigwheel
// @match        *://*/projects/*/wiki/*/edit*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @licence      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/8010/Redmine%20Wiki%20Auto%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/8010/Redmine%20Wiki%20Auto%20Preview.meta.js
// ==/UserScript==

function moveEditor(parentDiv) {
    var editorFrame = $("<div></div>");
    var editor = $("form.edit_content#wiki_form");
    editor.detach();
    editorFrame.append(editor);
    editorFrame.css("width", "50%");
    editorFrame.css("float", "left");
    parentDiv.append(editorFrame);
}    

function movePreview(parentDiv) {
    var preview = $("div#preview");
    preview.detach();
    preview.css("width", "50%");
    preview.css("float", "right");
    preview.css("overflow", "scroll");
    preview.css("height", "600px");
    preview.css("resize", "vertical");
    parentDiv.append(preview);
}

function renderPreview() {
    $("form.edit_content>p>a").click();
}

$(document).ready(function() {
    if ($('meta[name="description"]').attr("content") == "Redmine") {
        var newFrame = $("<div></div>");
        $("div#content h2").after(newFrame);
        
        moveEditor(newFrame);
        movePreview(newFrame);
        
        // http://memocarilog.info/jquery/7203 ここで言及されてるideom
        // 本当は直近でリクエストを出した直後の場合、出したリクエストがまだ帰ってきていない場合、
        // リクエストが帰ってきた直後の場合などはリクエストを出さないようにしたほうがRedMineへの負荷は下がるが
        // そこまでするの面倒。それ用のプラグインかライブラリが間違いなくあるはずなのでそれを使う。
        var timer = false;
        $("textarea#content_text").keyup(function() {
            if (timer !== false)
                clearTimeout(timer);
            timer = setTimeout(renderPreview, 1000);
        });
        
        renderPreview(); // 最初から描画しておく
    }
});