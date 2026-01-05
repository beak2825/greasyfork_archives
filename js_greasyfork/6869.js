// ==UserScript==
// @name       Chatwork emoticon killer
// @name:ja    チャットワーク 絵文字キラー
// @namespace  https://greasyfork.org/users/5795
// @version    0.2
// @description  Replaces all emoticons with their text.
// @description:ja    すべての絵文字を文字列で置き換えます。
// @copyright  2014+, Ikeyan
// @license    Creative Commons Attribution License
// @run-at document-end
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @match      https://www.chatwork.com/
// @downloadURL https://update.greasyfork.org/scripts/6869/Chatwork%20emoticon%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/6869/Chatwork%20emoticon%20killer.meta.js
// ==/UserScript==

function $(s, context) { return (context || document).querySelector(s) }
function $$(s, context) { return (context || document).querySelectorAll(s) }

var lang = unsafeWindow.LANGUAGE;
var _deemoticonize_text = {
    ja: 'Chatwork emoticon killerを有効にする',
    en: 'Enable Chatwork emoticon killer',
    'zh-tw': '啟用Chatwork emoticon killer的',
    'zh-cn': '启用Chatwork emoticon killer的',
    vi: 'cho phép các Chatwork emoticon killer',
};

function deemoticonize() {
    var elems = $$('.ui_emoticon');
    for (var i = 0; i < elems.length; ++i)
        elems[i].outerHTML = '<span class="text_emoticon" data-old="' + escape(elems[i].outerHTML) + '">' +  elems[i].alt + '</span>';
}
function emoticonize() {
    var elems = $$('.text_emoticon');
    for (var i = 0; i < elems.length; ++i)
        elems[i].outerHTML = unescape(elems[i].getAttribute('data-old'));
}

var config = {
    enabled: false,
};
var observer;
function disable() {
    emoticonize();
    if (MutationObserver) {
        observer.disconnect();
    } else {
        clearInterval(observer);
    }
}
function enable() {
    deemoticonize();
    if (MutationObserver) {
        if (!observer)
	        observer = new MutationObserver(deemoticonize);
        observer.observe(document.body, {
            //attributes: true,
            childList: true,
            subtree: true,
        });
    } else {
	    observer = setInterval(deemoticonize, 100);
    }
}

function set_enabled(value) {
    if (value != config.enabled) {
        config.enabled = value;
        GM_setValue('enabled', value);
        if (value)
            enable();
        else
            disable();
    }
}
set_enabled(GM_getValue("enabled", true));

var addSettingViewInterval = setInterval(function() {
    var ul = $('DIV.dialogBase>DIV.dialogContent>#_chatSetting>DIV>#_settingForm>#_settingView>.controlGroup>DIV>UL');
    if (ul == null)return;
    clearInterval(addSettingViewInterval);
    
    var li = document.createElement("LI");
    li.class = "_cwSelectableRow";
    li.innerHTML = '<span role="checkbox" type="checkbox" id="_deemoticonize" value="1" class="_cwCB _cwCBChecked ico15CheckboxActive"><input type="hidden" value="1"></span><label for="_deemoticonize" class="ecfFCheckboxLbl">' + (_deemoticonize_text[lang] || _deemoticonize_text.en) + '</label>';
    var _deemoticonize = $('#_deemoticonize', li);
    function _deemoticonize_setChecked(checked) {
        if (checked) {
            _deemoticonize.setAttribute('aria-checked', "true");
            _deemoticonize.setAttribute('class', "_cwCB _cwCBChecked ico15CheckboxActive");
        } else {
            _deemoticonize.setAttribute('aria-checked', "false");
            _deemoticonize.setAttribute('class', "_cwCB _cwCBUnchecked ico15Checkbox");
        }
    }
    ul.appendChild(li);
    
    var saveConfigButton = $('._cwDGButton.btnPrimary', $('#_chatSetting').parentNode);
    saveConfigButton.addEventListener('mouseup', function() {
        set_enabled($('#_deemoticonize').classList.contains("_cwCBChecked"));
    });

    _deemoticonize_setChecked(config.enabled);
    var _setting = $('#_setting');
    _setting.addEventListener('mouseup', function() {
        _deemoticonize_setChecked(config.enabled);
    });
}, 500);