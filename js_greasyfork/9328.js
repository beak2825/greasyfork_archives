// ==UserScript==
// @name        MAL Hide non-Japanese voice actors
// @namespace   MAL
// @include     /^(http|https):\/\/myanimelist\.net\/(anime|character)(\.php\?id=|\/)\d+/
// @description Hides non-Japanese voice actors from show page
// @version     1.5.13
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/9328/MAL%20Hide%20non-Japanese%20voice%20actors.user.js
// @updateURL https://update.greasyfork.org/scripts/9328/MAL%20Hide%20non-Japanese%20voice%20actors.meta.js
// ==/UserScript==

var hiddenLanguages = ['English', 'Korean', 'French', 'German', 'Italian', 'Brazilian', 'Spanish', 'Hungarian', 'Hebrew'];
var moreText = '';
var hasMore = [];
var hideAfter = 9000;
var spaceTables = document.getElementsByClassName('space_table');
var voiceActors = xpath("//td[@valign='top'][@style='padding-left: 5px;']/div[contains(@class, 'js-scrollfix-bottom-rel')]/table[@width='100%'][@cellspacing='0'][@cellpadding='0'][@border='0']//table[@cellspacing='0'][@cellpadding='0'][@border='0']//tr[descendant::td[@valign='top'][@align='right']/small[not(contains(., 'Japanese'))]]");
if (voiceActors.snapshotLength == 0) {
    voiceActors = xpath("//td[@valign='top'][@style='padding-left: 5px;']//table[@width='100%'][@cellspacing='0'][@cellpadding='0'][@border='0'][descendant::div[@style='margin-top: 2px;']/small[not(contains(., 'Japanese'))]]");
}
function showJap() {
    for (var i = 0; i < spaceTables.length; i++) {
        var trTags = spaceTables.item(i).getElementsByTagName('tr');
        if (trTags.length > 2 && trTags.item(2).textContent == '...') {
            hasMore.push(i);
            hasMore.push(spaceTables.item(i).parentNode.previousElementSibling.firstElementChild.outerHTML);
            moreText = trTags.item(2).innerHTML;
        }
        for (var j = trTags.length - 1; j >= 0; j--) {
            var trTag = trTags.item(j);
            var smallTags = trTag.getElementsByTagName('small');
            if (smallTags.length > 0) {
                var languageText = smallTags.item(0).innerHTML;
                if (hiddenLanguages.indexOf(languageText) > -1) {
                    trTag.style.display="none";
                } else {
                    trTag.removeAttribute('style');
                }
            }
        }
    }

    var moreLink = xpath("//a[contains(@href, '/anime/')][contains(@href, '/characters')][@style='font-weight: normal;']");
    if (hasMore.length > 0 && moreLink.snapshotLength > 0) {
        moreLink = moreLink.snapshotItem(0).href;
        GM_xmlhttpRequest({
            method: 'GET',
            url: moreLink,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var matchCharacterLinks = responseDetails.responseText.match(/<a href="\/character\/([\u0000-\u0FFF]+?)<\/a>/igm);
                var matchCharacter = responseDetails.responseText.match(/<table border="0" cellpadding="0" cellspacing="0" class="space_table">([\u0000-\uFFFF]+?)<\/table>/igm);
                do {
                    var characterLink = hasMore.pop();
                    var matchedIndex = -1;
                    do {
                        matchedIndex = matchedIndex + 2;
                    } while (characterLink != matchCharacterLinks[matchedIndex]);
                    matchedIndex = (matchedIndex - 1) / 2;
                    var matchActor = matchCharacter[matchedIndex].match(/<tr>[\u0000-\uFFFF]+?<\/tr>/igm);
                    var JapaneseActor = [];
                    for (var i = 0; i < matchActor.length; i++) {
                        if (matchActor[i].indexOf('<small>Japanese</small>') > -1) {
                            JapaneseActor.push(matchActor[i]);
                        }
                    }
                    var emptyCharacter = spaceTables.item(hasMore.pop());
                    trTags = emptyCharacter.getElementsByTagName('tr');
                    for (var j = trTags.length - 1; j >= 0; j--) {
                        trTag = trTags.item(j);
                        smallTags = trTag.getElementsByTagName('small');
                        if (smallTags.length > 0) {
                            languageText = smallTags.item(0).innerHTML;
                            if (hiddenLanguages.indexOf(languageText) == -1) {
                                JapaneseActor.shift();
                            }
                        }
                    }
                    while (JapaneseActor.length > 0) {
                        emptyCharacter.innerHTML = emptyCharacter.innerHTML.replace(moreText, JapaneseActor.shift() + moreText);
                    }
                } while (hasMore.length > 0);
                hideAfter = 2;
            }
        });
    }

    for (var i = 0; i < voiceActors.snapshotLength; i++) {
        voiceActors.snapshotItem(i).style.display="none";
    }
}

function showForeign() {
    for (var i = 0; i < spaceTables.length; i++) {
        var trTags = spaceTables.item(i).getElementsByTagName('tr');
        for (var j = trTags.length - 1; j >= 0; j--) {
            var trTag = trTags.item(j);
            var smallTags = trTag.getElementsByTagName('small');
            if (smallTags.length > 0) {
                var languageText = smallTags.item(0).innerHTML;
                if (hiddenLanguages.indexOf(languageText) > -1) {
                    trTag.removeAttribute('style');
                } else {
                    if (j >= hideAfter) {
                        trTag.style.display="none";
                    }
                }
            }
        }
    }

    for (var i = 0; i < voiceActors.snapshotLength; i++) {
        voiceActors.snapshotItem(i).removeAttribute('style');
    }
}

function xpath(query, object) {
    if(!object) var object = document;
    return document.evaluate(query, object, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

if (voiceActors.snapshotLength == 0) {
    var voiceCheck = xpath("//table[@class='space_table'][descendant::td[contains(., '...')] or descendant::small[not(contains(., 'Japanese'))]]");
}

if (voiceActors.snapshotLength > 0 || voiceCheck.snapshotLength > 0) {
    //Elements placing
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.defaultChecked = false;

    var newElement = document.createElement('label');
    newElement.setAttribute('for','firstName');
    newElement.appendChild(document.createTextNode('Show all Japanese'));
    newElement.style.fontWeight="normal";
    newElement.style.fontSize="10px";

    var checkboxAnchor = xpath("//div[@class='floatRightHeader'][following-sibling::text()[1][.='Characters & Voice Actors']]");
    if (checkboxAnchor.snapshotLength > 0) {
        checkboxAnchor = checkboxAnchor.snapshotItem(0);
        checkboxAnchor.insertBefore(checkbox,checkboxAnchor.firstChild);
        checkboxAnchor.insertBefore(newElement,checkboxAnchor.firstChild);
    } else {
        checkboxAnchor = xpath("//div[@class='normal_header'][contains(., 'Voice Actors')]");
        checkboxAnchor = checkboxAnchor.snapshotItem(0);
        checkboxAnchor.appendChild(checkbox);
        checkboxAnchor.appendChild(newElement);
    }

    //Get or Set status of checkbox
    var checkboxmem = (localStorage.getItem('checkboxmem_jap_va') === "true"); //Get chceckbox status
    if(checkboxmem==null){
        checkboxmem=true;
        showJap();
        localStorage.setItem('checkboxmem_jap_va', checkboxmem);
        checkbox.checked=checkboxmem;
    }
    else{
        checkbox.checked=checkboxmem;
        if(checkbox.checked==true){
            showJap();
        }
    }

    //Listener
    checkbox.addEventListener('change',function () {

        if(checkbox.checked==true){
            showJap();
        }

        if(checkbox.checked==false){
            showForeign();
        }

        localStorage.setItem('checkboxmem_jap_va', checkbox.checked);

    },false);
}