// ==UserScript==
// @name           BBCodes for MAL
// @namespace      No Page
// @description    Add BBCode to MAL Forum posts
// @author         Al_eXs
// @include        *myanimelist.net/forum/?topicid=*
// @include        *myanimelist.net/forum/?action=message&msgid=*
// @include        *myanimelist.net/forum/?action=message&topic_id=*
// @include        *myanimelist.net/mymessages.php?go=send*
// @include        *myanimelist.net/editprofile.php*
// @include        *myanimelist.net/myblog.php*
// @include        *myanimelist.net/forum/?action=post*
// @include        *myanimelist.net/forum/index.php?action=post&boardid=*
// @include        *myanimelist.net/clubs.php?cid=*
// @include        *myanimelist.net/profile/*
// @include        *myanimelist.net/modules.php?go=report&type=forummessage&id=*
// @include        *myanimelist.net/mymessages.php?toname=*
// @include        *myanimelist.net/comtocom.php?id1=*
// @include        *myanimelist.net/comments.php?id=*
// @include        *myanimelist.net/editlist.php?type=anime&id=*
// @include        *myanimelist.net/panel.php?go=editmanga&id=*
// @include        *myanimelist.net/panel.php?go=add&selected_series_id=*
// @include        *myanimelist.net/panel.php?go=addmanga&selected_manga_id=*
// @include        *myanimelist.net/panel.php?go=anime_series&do=add
// @include        *myanimelist.net/panel.php?go=mangadb&do=add
// @include        *myanimelist.net/people.php?id=*
// @include        *myanimelist.net/people/*
// @include        *myanimelist.net/myfriends.php?go=add&id=*
// @include        *myanimelist.net/blog.php?eid=*
// @include        *myanimelist.net/forum/index.php?topicid=*
// @include        *myanimelist.net/ownlist/anime/*
// @include        *myanimelist.net/ownlist/manga/*
// @exclude        *myanimelist.net/editprofile.php?go=stylepref&do=cssadv&id=*
// @version        1.0.45
// @downloadURL https://update.greasyfork.org/scripts/5709/BBCodes%20for%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/5709/BBCodes%20for%20MAL.meta.js
// ==/UserScript==

function addtag(snap, tag) {
    var textareaNumber = getXpathSnapNumber(snap);
    obj = document.getElementsByTagName("textarea")[textareaNumber];

    beforeText = obj.value.substring(0, obj.selectionStart);
    selectedText = obj.value.substring(obj.selectionStart, obj.selectionEnd);
    afterText = obj.value.substring(obj.selectionEnd, obj.value.length);
    newText = null;

    switch(tag) {

        case "bold":
            tagOpen = "[b]";
            tagClose = "[/b]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "strike":
            tagOpen = "[s]";
            tagClose = "[/s]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "italic":
            tagOpen = "[i]";
            tagClose = "[/i]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "underline":
            tagOpen = "[u]";
            tagClose = "[/u]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "code":
            tagOpen = "[code]";
            tagClose = "[/code]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "centre":
            tagOpen = "[center]";
            tagClose = "[/center]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "right":
            tagOpen = "[right]";
            tagClose = "[/right]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "spoiler":
            spoiler = prompt("Enter spoiler name (or leave blank)", "");

            if (spoiler == null) {
                break;
            }

            if (spoiler) {
                spoiler = '="' + spoiler + '"';
            }

            tagOpen = "[spoiler" + spoiler + "]";
            tagClose = "[/spoiler]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "url":
            urlOrDesc = prompt("Enter URL or URL description", "");

            if (urlOrDesc == null) {
                break;
            }

            if (!urlOrDesc) {
                urlOrDesc = selectedText;
                selectedText = '';
            }

            if (urlOrDesc.indexOf("http://") == 0 || urlOrDesc.indexOf("https://") == 0) {
                tagOpen = "[url=" + urlOrDesc + "]";
                tagClose = "[/url]";
            } else {
                tagOpen = "[url=";
                tagClose = "]" + urlOrDesc + "[/url]";
            }

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "image":
            imgURL = prompt("Enter image URL", "");

            if (imgURL == null) {
                break;
            }

            if (imgURL) {
                selectedText = imgURL;
            }

            tagOpen = "[img]";
            tagClose = "[/img]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "image left":
            imgURL = prompt("Enter image URL", "");

            if (imgURL == null) {
                break;
            }

            if (imgURL) {
                selectedText = imgURL;
            }

            tagOpen = "[img align=left]";
            tagClose = "[/img]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "image right":
            imgURL = prompt("Enter image URL", "");

            if (imgURL == null) {
                break;
            }

            if (imgURL) {
                selectedText = imgURL;
            }

            tagOpen = "[img align=right]";
            tagClose = "[/img]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "size":
            txtSize = document.getElementById("Size");

            if (txtSize == "Size") {
                break;
            }

            if (txtSize.value == "enter") {
                txtSizeName = prompt("Enter the size (1 is minimum, 100 is default)", "");
            } else {
                txtSizeName = txtSize.value;
            }

            if (txtSizeName == null) {
                break;
            }

            tagOpen = "[size=" + String(txtSizeName) + "]";
            tagClose = "[/size]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "profile":
            profile = prompt("Enter profile name", "");

            if (profile == null) {
                break;
            }

            tagOpen = "[profile=" + profile + "]";
            tagClose = "[/profile]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "youtube":
            yt = prompt("Enter complete youtube url", "");

            if (yt == null) {
                break;
            }

            yt = yt.replace("https://", "http://");
            yt = yt.replace("http://www.youtube.com/watch?v=", "http://youtube.com/watch?v=");
            yt = yt.replace("http://youtube.com/watch?v=", "");
            yt = yt.substring(0,11);

            tagOpen = "[yt]";
            tagClose = "[/yt]";

            newText = beforeText + tagOpen + yt + tagClose + afterText;
            break;

        case "colour":
            colour = document.getElementById("Colour");

            if (colour == "Select") {
                break;
            }

            if (colour.value == "enter") {
                colourName = prompt("Enter the colour name or hex value (e.g. #abc123)", "");
            } else {
                colourName = colour.value;
            }

            if (colourName == null) {
                break;
            }

            tagOpen = "[color=" + String(colourName) + "]";
            tagClose = "[/color]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "quote":
            quote = prompt("Enter quoted person name", "");

            if (quote == null) {
                break;
            }

            if (quote) {
                quote = "=" + quote;
            }

            tagOpen = "[quote" + quote + "]";
            tagClose = "[/quote]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "list":
            tagOpen = "[list][*]";
            tagClose = "[/list]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "list=1":
            tagOpen = "[list=1][*]";
            tagClose = "[/list]";

            newText = beforeText + tagOpen + selectedText + tagClose + afterText;
            break;

        case "[*]":
            tagOpen = "[*]";
            tagClose = "";

            newText = beforeText + tagOpen + selectedText + afterText;
            break;

        case "lenny face":
            tagOpen = "( ͡° ͜ʖ ͡°)";
            tagClose = "";

            newText = beforeText + selectedText + tagOpen + afterText;
            break;
    }

    if (newText != null) {
        caretStart = obj.selectionStart;
        caretEnd = obj.selectionEnd;
        if (selectedText.length == 0) {
            caretEnd -= tagClose.length;
        }
        caretEnd += newText.length - obj.value.length;
        caretStart = caretEnd;
        obj.value = newText;
        obj.setSelectionRange(caretStart, caretEnd);
    }
    obj.focus();
}

function xpath(query, object) {
    if(!object) var object = document;
    return document.evaluate(query, object, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function getXpathSnap() {
    if (document.querySelectorAll('div.sceditor-toolbar').length) {
        return false;
    }
    var path = xpath("//textarea[contains(@class, 'textarea')]");
    if(path.snapshotLength == 0 || path.snapshotItem(0).id == "add_anime_tags" || path.snapshotItem(0).id == "add_manga_tags") {
        path = xpath("//textarea[@class = 'inputtext']");
        if (path.snapshotItem(j).previousElementSibling == null) {
            return (path.snapshotLength > 0) ?  path.snapshotItem(0) : false;
        }
    }
    for (var j = 0; j < path.snapshotLength; j++) {
        if (path.snapshotItem(j).previousElementSibling == null) {
            if (path.snapshotItem(j).id != "add_anime_tags" && path.snapshotItem(j).id != "add_manga_tags") {
                return path.snapshotItem(j);
            }
        } else {
            if (path.snapshotItem(j).previousElementSibling.id != 'myBBcode' && (path.snapshotItem(j).previousElementSibling.tagName != 'GRAMMARLY-GHOST' && (path.snapshotItem(j).previousElementSibling.previousElementSibling === null || path.snapshotItem(j).previousElementSibling.previousElementSibling.id != 'myBBcode') ) ) {
                return path.snapshotItem(j);
            }
        }
    }
    return false;
}

function getXpathSnapNumber(xpathToBeNumbered) {
    var path = xpath("//textarea");
    for (var i = 0; i < path.snapshotLength; i++) {
        if (path.snapshotItem(i) === xpathToBeNumbered) {
            return i;
        }
    }
}

setTimeout(function() {
    var allReplies = xpath("//a[@title = 'Reply to this comment'] | //a[contains(@class, 'ml8')][text() = 'Reply'] | //button[contains(@class, 'js-topic-message-quickedit')][text() = 'Quick Edit'] | //button[@class = 'mal-btn primary js-topic-reply'][text() = 'Reply']");
    for (var i = 0; i < allReplies.snapshotLength; i++) {
        (function(ind){allReplies.snapshotItem(ind).addEventListener("click", function(){

            var repeatCount0 = 0;
            var replyTimer0 = setInterval(function(){
                var replied;
                var replyButton = xpath("//input[@value = 'Submit Reply'] | //button[contains(@class, 'js-topic-message-quickedit')][text() = 'Quick Edit']");
                if (replyButton.snapshotLength > 0) {
                    xpathSnap = getXpathSnap();
                    createButtons();
                    replyButton.snapshotItem(0).addEventListener("click", function() {
                        replied = replyTimer();
                    }, false);  //Modern browsers
                }

                function replyTimer() {
                    var repeatCount = 0;
                    return setInterval(function(){
                        addCodeToEdits();
                        repeatCount += 1;
                        if (repeatCount >= 18) {
                            clearInterval(replied);
                        }
                    }, 500);
                }

                repeatCount0 += 1;
                if (repeatCount0 >= 72) {
                    clearInterval(replyTimer0);
                }
            }, 100);

        }, true);})(i);
    }

    addCodeToEdits();
}, 100);

function addCodeToEdits() {
    var allEdits = xpath("//a[@title = 'Edit Comment']");
    var toEdit;
    for (var i = 0; i < allEdits.snapshotLength; i++) {
        (function(ind) {
            allEdits.snapshotItem(ind).removeEventListener("click", function() {toEdit = editTimer();});
            allEdits.snapshotItem(ind).addEventListener("click", function() {toEdit = editTimer();}, true);
        })(i);
    }
    function editTimer() {
        var repeatCount = 0;
        return setInterval(function() {
            xpathSnap = getXpathSnap();
            createButtons();
            repeatCount += 1;
            if (repeatCount >= 16) {
                clearInterval(toEdit);
            }
        }, 400);
    }
}

while ( xpathSnap = getXpathSnap() ) {
    createButtons();
}

function createButtons() {
    if(xpathSnap){
        var xpathSnapCur = xpathSnap;

        var div1 = document.createElement("div");
        div1.style="margin: 0px; margin-top:5px; margin-bottom:5px";
        div1.align ="Left";
        div1.id = "myBBcode";
        div1.innerHTML = " ";
        div1.style.display = "block";

        xpathSnap.parentNode.insertBefore(div1, xpathSnap);

        var post = document.createElement("input");
        post.type = "button";
        post.value = "Bold";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'bold');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Italic";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'italic');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Strike";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'strike');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Underline";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'underline');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Code";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'code');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Centre";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'centre');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Right";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'right');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "URL";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'url');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Spoiler";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'spoiler');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "IMG";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'image');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "IMG left";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'image left');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "IMG right";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'image right');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Youtube";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'youtube');}, false);
        div1.appendChild(post);
    var post = document.createElement("BROKEN");
        post.type = "button";
        post.value = "Profile";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'profile');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "Quote";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'quote');}, false);
        div1.appendChild(post);
    var postSize = document.createElement("select");
        postSize.id = "Size";
        //postSize.value = "Size";
        var opt = document.createElement("option");
        opt.value = "Size";
        opt.appendChild(document.createTextNode('Size'));
        postSize.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "50";
        opt.appendChild(document.createTextNode('Small'));
        postSize.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "100";
        opt.appendChild(document.createTextNode('Normal'));
        postSize.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "300";
        opt.appendChild(document.createTextNode('Medium'));
        postSize.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "600";
        opt.appendChild(document.createTextNode('Big'));
        postSize.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "900";
        opt.appendChild(document.createTextNode('Ultra big'));
        postSize.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "enter";
        opt.appendChild(document.createTextNode('Enter size'));
            postSize.appendChild(opt);
    postSize.addEventListener('change', function() {document.getElementById("Size").value = postSize.value; addtag(xpathSnapCur,'size'); postSize.value = 'Size';}, false);
        div1.appendChild(postSize);
    var postColour = document.createElement("select");
        postColour.id = "Colour";
        //postColour.value = "Colour";
        var opt = document.createElement("option");
        opt.value = "Select";
        opt.appendChild(document.createTextNode('Select colour'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "grey";
        opt.appendChild(document.createTextNode('Grey'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "blue";
        opt.appendChild(document.createTextNode('Blue'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "red";
        opt.appendChild(document.createTextNode('Red'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "green";
        opt.appendChild(document.createTextNode('Green'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "yellow";
        opt.appendChild(document.createTextNode('Yellow'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "pink";
        opt.appendChild(document.createTextNode('Pink'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "navy";
        opt.appendChild(document.createTextNode('Navy'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "white";
        opt.appendChild(document.createTextNode('White'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "black";
        opt.appendChild(document.createTextNode('Black'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "orange";
        opt.appendChild(document.createTextNode('Orange'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "purple";
        opt.appendChild(document.createTextNode('Purple'));
        postColour.appendChild(opt);
        var opt = document.createElement("option");
        opt.value = "enter";
        opt.appendChild(document.createTextNode('Enter colour'));
        postColour.appendChild(opt);
        postColour.addEventListener('change', function() {document.getElementById("Colour").value = postColour.value; addtag(xpathSnapCur,'colour'); postColour.value = 'Select';}, false);
        div1.appendChild(postColour);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "list";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'list');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "list=1";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'list=1');}, false);
        div1.appendChild(post);
    var post = document.createElement("input");
        post.type = "button";
        post.value = "[*]";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'[*]');}, false);
        div1.appendChild(post);
    var post = document.createElement("DISABLED");
        post.type = "button";
        post.value = "( ͡° ͜ʖ ͡°)";
        post.addEventListener('click', function() {addtag(xpathSnapCur,'lenny face');}, false);
        div1.appendChild(post);
    }
}