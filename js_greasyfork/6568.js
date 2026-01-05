// ==UserScript==
// @name         OcUK Ignore Feature
// @namespace    http://xbenjii.co.uk
// @version      0.3
// @description  Allows you to hide posts by the username in the OcUK forum.
// @author       Benjamin Fortune
// @match        forums.overclockers.co.uk/showthread.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6568/OcUK%20Ignore%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/6568/OcUK%20Ignore%20Feature.meta.js
// ==/UserScript==

//Extend the localstorage prototype to store JSON to allow array storage.
Storage.prototype.setJSON = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getJSON = function(key) {
    return JSON.parse(this.getItem(key));
};

if (!localStorage.getJSON('ocukignored')) {
    localStorage.setJSON('ocukignored', []);
}

function addClickEvents() {
    var posts = document.getElementById("posts");
    for (var i = 0; i < posts.children.length; i++) {
        posts.children[i].className = "post-parent";
        posts.children[i].addEventListener("click", function(e) {
            if (e.target && e.target.nodeName == "A") {
                var classes = e.target.className.split(" ");
                if (classes) {
                    for (var x = 0; x < classes.length; x++) {
                        if (classes[x] == "ignore-user") {
                            var ignoredUsers = localStorage.getJSON("ocukignored");
                            if (ignoredUsers.indexOf(e.target.dataset.username) == -1) {
                                ignoredUsers.push(e.target.dataset.username);
                                localStorage.setJSON("ocukignored", ignoredUsers);
                                checkAndHide();
                            }
                        }
                    }
                }
            }
        }, false);
    }
}

function checkAndHide() {
    var posts = document.getElementById("posts");
    var postNames = posts.getElementsByClassName("bigusername");
    for (var i = 0; i < postNames.length; i++) {
        var el = postNames[i];
        if (localStorage.getJSON('ocukignored').indexOf(el.innerHTML) != -1) {
            (function(el) {
                hideFound(el, "post-parent");
            })(el);
        }
    }
}

function addIgnoreButtons() {
    var posts = document.getElementById("posts");
    var postNames = posts.getElementsByClassName("bigusername");
    for (var i = 0; i < postNames.length; i++) {
        var el = postNames[i];
        var ignoreWrapper = document.createElement("div");
        ignoreWrapper.className = "smallfont";
        ignoreWrapper.style.float = "right";
        var ignoreLink = document.createElement("a");
        ignoreLink.className = "ignore-user";
        ignoreLink.innerText = "[Ignore User]";
        ignoreLink.href = "javascript:;";
        ignoreLink.dataset.username = el.innerHTML;
        ignoreWrapper.appendChild(ignoreLink);
        el.parentNode.parentNode.insertBefore(ignoreWrapper, el.parentNode.nextSibling);
    }
}

function hideFound(el, classSel) {
    var parent = el.parentNode;
    while (parent !== null) {
        var o = parent;
        if(o.className == classSel) {
            return o.style.display = "none";
        }
        parent = o.parentNode;
    }
    return null;
}


(function(){
    addIgnoreButtons();
    addClickEvents();
})();

document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        checkAndHide();
    }
}