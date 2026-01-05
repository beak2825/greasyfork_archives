// ==UserScript==
// @name        Weasyl nested messages
// @namespace   binarte.com.weasylmessages
// @description Will group messages on the notification center - journals are grouped by user and the rest is grouped by submission
// @include     https://www.weasyl.com/messages/notifications*
// @version     1
// @grant       none
// permitir colagem
// @downloadURL https://update.greasyfork.org/scripts/8945/Weasyl%20nested%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/8945/Weasyl%20nested%20messages.meta.js
// ==/UserScript==
try {
    //console.log(journals);
    function compactItems(journals, refClass) {
        var newjournals = document.createElement('div');
        journals.parentNode.insertBefore(newjournals, journals);
        var journalDivs = {
        };
        var cur = journals.firstChild;
        while (cur) {
            var next = cur.nextSibling;
            if (cur.className === 'item') {
                var user
                if (refClass) {
                    user = cur.getElementsByClassName(refClass) [0].href;
                } else {
                    user = cur.getElementsByTagName('a');
                    user = user[user.length - 1].href;
                }
                var jdiv = journalDivs[user];
                if (typeof jdiv == 'undefined') {
                    jdiv = journalDivs[user] = document.createElement('div');
                    jdiv.style.overflow = 'hidden';
                    newjournals.appendChild(jdiv);
                } else if (!jdiv.ExpandButton) {
                    var btn = document.createElement('span');
                    jdiv.Counter = document.createElement('span');
                    jdiv.Counter.textContent = '(2)';
                    jdiv.Count = 2;

                    var ref = jdiv.firstChild.getElementsByClassName('date')[0];          
                    ref.parentNode.insertBefore(jdiv.Counter,ref);
                    jdiv.ExpandButton = btn;
                    btn.innerHTML = '⨁';
                    btn.title = 'Expand';
                    btn.style.display = 'block';
                    btn.style.position = 'absolute';
                    btn.style.zIndex = '10';
                    btn.style.cursor='pointer';
                    btn.style.marginLeft='-1em';
                    btn.Div = jdiv;
                    btn.Collapsed = true;
                    btn.CollapsedHeight = '' + (cur.offsetHeight - 3) + 'px';
                    btn.onclick = function () {
                        if (this.Collapsed) {
                            this.Div.style.maxHeight = '';
                            if (this.Div.Counter){
                                this.Div.Counter.style.display = 'none';
                            }
                            this.Collapsed = false;
                            this.innerHTML = '⨀';
                            this.title = 'Collapse';
                        } else {
                            this.Div.style.maxHeight = this.CollapsedHeight;              
                            if (this.Div.Counter){
                                this.Div.Counter.style.display = '';
                            }
                            this.Collapsed = true;
                            this.innerHTML = '⨁';
                            this.title = 'Expand';
                        }
                    }
                    var checkbox = jdiv.getElementsByTagName('input') [0];
                    console.log(checkbox);
                    checkbox.ExpandButton = btn;
                    checkbox.Div = jdiv;
                    checkbox.onchange = function () {
                        if (this.ExpandButton.Collapsed) {
                            var inputs = this.Div.getElementsByTagName('input');
                            for (var i = 1; i < inputs.length; i++) {
                                var cur = inputs[i];
                                cur.checked = this.checked;
                                cur = cur.nextSibling;
                            }
                        }
                    }
                    jdiv.style.maxHeight = btn.CollapsedHeight;
                    jdiv.insertBefore(btn, jdiv.firstChild);
                } else {
                    jdiv.Counter.textContent = '(' + (++jdiv.Count) + ')';
                }
                jdiv.appendChild(cur);
            }
            cur = next;
        }
        newjournals.id = journals.id;
        journals.parentNode.removeChild(journals);
    }
    var journals = document.getElementById('journals');
    if (journals) {
        compactItems(journals, 'username');
    }
    var types = [
        'shouts',
        'submission_comments',
        'user_favorites',
        'character_comments',
        'journal_comments'
    ];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var shouts = document.getElementById(type);
        if (shouts) {
            compactItems(shouts, false);
        }
    }
} catch (ex) {
    console.log(ex);
}
