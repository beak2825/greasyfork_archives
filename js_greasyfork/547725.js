// ==UserScript==
// @name         LZT_CreateThreadTemplatesButton
// @namespace    MeloniuM/LZT
// @version      1.1
// @description  Добавляет кнопку "Шаблоны" в редактор на странице создания темы
// @match        https://zelenka.guru/forums/*/create-thread
// @match        https://lolz.live/forums/*/create-thread
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547725/LZT_CreateThreadTemplatesButton.user.js
// @updateURL https://update.greasyfork.org/scripts/547725/LZT_CreateThreadTemplatesButton.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function ensureTemplatesBox(ed) {
        if ($("#ConversationTemplates").length) return;
        let parsed;
        try {
            parsed = JSON.parse(localStorage.getItem("conversation_templates") || "{}");
        } catch (e) {
            console.error("Ошибка чтения conversation_templates", e);
            return;
        }
        if (!parsed.templates) return;
        const $box = $(`
        <div style="display: none">
			<div id="ConversationTemplates" class="ConversationTemplates conversationTemplatesBox">				<div class="header">
					<span class="title bold">Шаблоны</span>
					<div class="fl_r">
						<a href="conversations/template" class="OverlayTrigger"><svg viewBox="0 0 24 24" width="16" height="16" stroke="rgb(214,214,214)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></a>
					</div>
				</div>
				<div id="ConversationTemplateList" class="templateList">
                    ${parsed.templates}
				</div>
				<div class="NoTemplates noConversationTemplates muted hidden">
					Вы пока что не добавили ни одного шаблона
				</div>
            </div>
        </div>
        `);
        $("body").append($box);
    }

    function ensureButton(ed) {
        if (ed.$tb.find('[data-cmd="lztTemplate"]').length) return;
        const $smilieBtn = ed.$tb.find('[data-cmd="xfSmilie"]');
        const $tplBtn = $(`<button type="button" class="fr-command fr-btn" data-cmd="lztTemplate" title="Шаблоны">
                <i class="fa fa-file-alt"></i>
            </button>`);
        if ($smilieBtn.length) {
            $smilieBtn.after($tplBtn.get(0));
        } else {
            ed.$tb.append($tplBtn);
        }
        $tplBtn.xfActivate();
        const $templatesBox = $('#ConversationTemplates').clone().show();
        if ($templatesBox.length) {
            $templatesBox.data('lzt-fe-ed', ed);
            $tplBtn.data('tippy-content', $templatesBox[0]);
            XenForo.tippy($tplBtn[0], {
                content: $templatesBox[0],
                onShown: function () {
                    $templatesBox.xfActivate();
                },
                onShow() {
                    ed.selection.save();
                },
                onHide() {
                    ed.selection.restore();
                }
            }, 'popup');
        }
    }

    $(document).ready(() => {
        const editor = XenForo.editorStart && XenForo.editorStart.editor;
        if (!editor || !editor.ed) {
            return;
        }
        const ed = editor.ed;
        ensureTemplatesBox(ed);
        ensureButton(ed);
    })
})();