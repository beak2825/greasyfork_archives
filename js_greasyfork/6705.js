// ==UserScript==
// @name        oldFUP
// @namespace   http://forum.pravda.com.ua
// @version     0.6
// @description ignore script
// @match       https://forum.pravda.com.ua/index.php?board*
// @match       https://forum.pravda.com.ua/index.php?topic*
// @grant       GM_getValue
// @grant       GM_setValue
// @copyright   2014+, forum.pravda.com.ua
// @author		тарадайка
// @downloadURL https://update.greasyfork.org/scripts/6705/oldFUP.user.js
// @updateURL https://update.greasyfork.org/scripts/6705/oldFUP.meta.js
// ==/UserScript==

(function ignore(dialog) {

    var ignored,

        load = function () {
            ignored = [];
            var str = GM_getValue('FUP_IGNORED', '');
            if (str !== '')
                try {
                    ignored = JSON.parse(str);
                } catch (error) {
                    console.error("Ігнор список пошкоджено: ", error);
                    GM_setValue('FUP_IGNORED', "");
                }
        },

        save = function () {
            GM_setValue('FUP_IGNORED', JSON.stringify(ignored));
        },

        getUserIndex = function (name) {
            for (var i = 0; i < ignored.length; i++)
                if (ignored[i].name == name)
                    return i;
            return -1;
        },

        createLink = function (id, innerHTML, title, target) {
            var result = document.createElement('a');
            result.style.cursor = 'pointer';
            result.id = id;
            result.innerHTML = innerHTML;
            result.title = title;
            if (typeof target == 'string')
                result.href = target;
            else
                result.addEventListener('click', target);
            return result;
        },

        updateDialog = function () {
            if (dialog.style.display != 'inline')
                return;
            while (dialog.firstChild)
                dialog.removeChild(dialog.firstChild);
            load();
            if (ignored.length === 0)
                dialog.appendChild(document.createElement('div')).innerHTML = '(пусто)';
            else
                for (i = 0; i < ignored.length; i++) {
                    var userDiv = document.createElement('div');
                    var userLink = createLink(null, ignored[i].name, 'Перегляд профілю ' + ignored[i].name, ignored[i].profile);
                    userDiv.appendChild(userLink);
                    userDiv.appendChild(createToggleButton(userLink, false));
                    dialog.appendChild(userDiv);
                }
            var link = document.getElementById('ignored-link');
			var linkRect = link.getBoundingClientRect();
        	dialog.style.left = linkRect.right - 158 + 'px';
    	    dialog.style.top = linkRect.bottom + 'px';
        },

        createToggleButton = function (userLink, toIgnore) {
            var result = createLink(null, 'x', toIgnore ? 'Ігнорувати ' : 'Не ігнорувати ' + userLink.innerHTML,
                function () {
                    load();
                    var ignoredIndex = getUserIndex(userLink.innerHTML);
                    if (toIgnore == (ignoredIndex == -1)) {
                        if (toIgnore)
                            ignored.push({profile: userLink.href, name: userLink.innerHTML});
                        else
                            ignored.splice(ignoredIndex, 1);
                        save();
                        ignore(dialog);
                        updateDialog();
                    }
                }
            );
            result.style.fontWeight = 'normal';
            result.style.paddingLeft = toIgnore ? '5px' : '9px';
            return result;
        };

    function findAncestor (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    load();
    if (document.location.href.indexOf('board') !== -1) {
        var i, topicRows = document.getElementsByClassName('list')[0].rows;
        for (i = 1; i < topicRows.length; i++) {
            var autherLink = topicRows[i].cells[3].getElementsByTagName('a')[0];
            if (dialog == null) {
                if (autherLink != null)
                    topicRows[i].cells[3].appendChild(createToggleButton(autherLink, true));
                var lastWriterLink = topicRows[i].cells[4].getElementsByTagName('a')[1];
                if (lastWriterLink != null)
                    topicRows[i].cells[4].appendChild(createToggleButton(lastWriterLink, true));
            }
            if (autherLink != null)
                topicRows[i].style.display = getUserIndex(autherLink.innerHTML) == -1 ? 'table-row' : 'none';
        }
    } else {
        var userDivs = document.getElementsByClassName('message-author');
        for (i = 0; i < userDivs.length; i++) {
            var userLink = userDivs[i].getElementsByTagName('a')[0];
            if(userLink == null)
                continue;
            if (dialog == null)
                userDivs[i].appendChild(createToggleButton(userLink, true));
            findAncestor(userDivs[i], "message").style.display = getUserIndex(userLink.innerHTML) == -1 ? 'inline' : 'none';
        }
    }
    if (dialog == null) {
        dialog = document.createElement('div');
        dialog.id = 'dialog';
        var container = document.getElementById('user-info') || document.getElementById('user-info-nl');
        container.innerHTML += " » ";
        var link = createLink('ignored-link', 'Ігноровані', 'Показати/сховати',
            function () {
                dialog.style.display = dialog.style.display == 'none' ? 'inline' : 'none';
                updateDialog();
            }
        );
        container.appendChild(link);
        dialog.style.display = 'none';
        dialog.style.position = 'absolute';
        dialog.style.textAlign = 'left';
        dialog.style.width = '150px';
        dialog.style.padding = '5px';
        dialog.style.border = '1px solid black';
        dialog.style.backgroundColor = 'white';
        container.appendChild(dialog);
    }
})(null);