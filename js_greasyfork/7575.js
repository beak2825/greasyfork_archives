// ==UserScript==
// @name         HackForums Profile Image/Signature Blocker
// @namespace    https://www.hackforums.net/member.php?action=profile&uid=2525478
// @version      0.7
// @description  This allows you to hide HF profile images and signatures
// @author       TyrantKingBen
// @match        https://hackforums.net/showthread.php*
// @match        https://hackforums.net/member.php?action=profile*
// @match        https://hackforums.net/private.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_log
// @grant        GM_deleteValue
// @require      https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/622-super-gm-setvalue-and-gm-getvalue-js/code/Super_GM_setValue_and_GM_getValuejs.js?version=1786
// @downloadURL https://update.greasyfork.org/scripts/7575/HackForums%20Profile%20ImageSignature%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/7575/HackForums%20Profile%20ImageSignature%20Blocker.meta.js
// ==/UserScript==

//Setup configuration popup
var title = "HackForums Profile Image/Signature Blocker by TyrantKingBen - v" + GM_info.script.version;
var configInit = {
    'fixLinks':{
        'label':'Fix quick links?',
        'type':'checkbox',
        'default':false,
        'section':['','Settings']
    },
    'reloadImage':{
        'label':'Reload image on unblock?',
        'type':'checkbox',
        'default':true,
        'section':['','Profile Images']
    },
    /*'saveProfileImage':{
        'label':'Store image?',
        'type':'checkbox',
        'default':false
    },*/
    'useCustomBlock':{
        'label':'Use a custom block image?',
        'type':'checkbox',
        'default':false
    },
    'useCustomBlockImage':{
        'label':'Custom block image:',
        'type':'textbox',
        'default':''
    },
    'useCustomBlockImageWidth':{
        'label':'Custom block image width:',
        'type':'textbox',
        'default':'0'
    },
    'useCustomBlockImageHeight':{
        'label':'Custom block image height:',
        'type':'textbox',
        'default':'0'
    },
    'reloadSignature':{
        'label':'Reload signature on unblock?',
        'type':'checkbox',
        'default':true,
        'section':['','Signatures']
    },
    'useCustomSignature':{
        'label':'Use a custom signature?',
        'type':'checkbox',
        'default':false
    },
    'useCustomSignatureText':{
        'label':'Custom signature:',
        'type':'textarea',
        'default':''
    }
};

//Add white reset link and textarea styling. Minified. Thanks to Emylbus. https://www.hackforums.net/member.php?action=profile&uid=956054
var HFPIH_CSS = "#HFPIH_config{background:#333;color:#CCC;font-size:14px}#HFPIH_config_header{color:#FFF}#HFPIH_config .section_desc{background:#072948;color:#FFF;border:none;font-size:14px}#HFPIH_config .section_header{display:none!important}#HFPIH_config .config_var{text-align:left}#HFPIH_config .field_label{font-size:14px;font-weight:400}#HFPIH_config *{font-family:Verdana,Arial,Sans-Serif;font-weight:400}#HFPIH_config .reset{color:#fff}#HFPIH_config_field_useCustomSignatureText{resize:none;width:50%;height:100px}#HFPIH_config_useCustomSignatureText_field_label{vertical-align:top}";

//Setup configuration popup
GM_config.init({
    'id':'HFPIH_config',
    'title':title,
    'fields':configInit,
    'css':HFPIH_CSS,
    'events':
    {
        'open': function() { //Remove textarea block class
            document.getElementById("HFPIH_config").contentDocument.getElementById("HFPIH_config_field_useCustomSignatureText").removeAttribute("class");
        },
        'save': function() {
            location.reload();
        },
        'reset': function() {
            GM_deleteValue("blockedProfileIDs");
            //GM_deleteValue("blockedProfileImages");
            GM_deleteValue("blockedSignatureIDs");
            GM_config.save();
        }
    }
});

//Setup Variables
var blockedProfileIDs = GM_SuperValue.get("blockedProfileIDs", []);
//var blockedProfileImages = GM_SuperValue.get("blockedProfileImages", []);
var reloadImage = GM_config.get('reloadImage');
var useCustomBlock = GM_config.get('useCustomBlock');
var useCustomBlockImage = GM_config.get('useCustomBlockImage');
var useCustomBlockImageWidth = parseInt(GM_config.get('useCustomBlockImageWidth'));
var useCustomBlockImageHeight = parseInt(GM_config.get('useCustomBlockImageHeight'));
//var saveProfileImage = GM_config.get('saveProfileImage');

var blockedSignatureIDs = GM_SuperValue.get("blockedSignatureIDs", []);
var reloadSignature = GM_config.get('reloadSignature');
var useCustomSignature = GM_config.get('useCustomSignature');
var useCustomSignatureText = GM_config.get('useCustomSignatureText');

var fixLinks = GM_config.get('fixLinks');

//Mostly found online. Minimized.
GM_addStyle(".xButton{border:2px solid #fff;border-radius:9px;box-shadow:1px 1px 3px rgba(0,0,0,.5);color:#fff;cursor:pointer;font-family:verdana;font-size:12px;font-weight:700;height:14px;line-height:10px;opacity:0;position:absolute;right:2px;text-align:center;text-shadow:1px 1px 3px rgba(0,0,0,.5);-webkit-transition:all .2s ease-in;-webkit-transform:perspective(600px) translateX(14px) rotateY(90deg) rotateZ(90deg);top:2px;width:14px}#xButtonBlock{background-color:#8b0000}#xButtonBlock:hover{background-color:red}#xButtonUnblock{background-color:#006400}#xButtonUnblock:hover{background-color:green}" + 
            "div:hover>.xButton{opacity:1;-webkit-transform:perspective(600px)}.buttonContainer{position:absolute}");

//Since signature images sometimes take too long to load
(function() {
    var postTableData = document.getElementsByClassName("post_avatar");
    var quickLinks = document.getElementsByClassName('links')[0];

    //Create Settings
    var settingsAnchor = document.createElement("a");
    settingsAnchor.id = "settingsLink";
    settingsAnchor.innerHTML = "PISB Settings";
    settingsAnchor.href = "javascript:void(0);";
    quickLinks.innerHTML += ' | ';
    quickLinks.appendChild(settingsAnchor);

    $("#settingsLink").live("click", function() {
        GM_config.open();
    });

    //Fix quick links incase using another script
    if (fixLinks) {
        quickLinks.style.width = "50%";
        quickLinks.style.marginTop = "-18px";
    }

    //Initialize blocking
    for (var i = 0; i < postTableData.length; i++) {
        var anchorTag = postTableData[i].getElementsByTagName("a")[0];
        if (anchorTag) { //Incase profile has no image
            var profileID = anchorTag.href.split("uid=")[1];
            var profileImage = postTableData[i].getElementsByTagName("img")[0];

            //Create block container
            var buttonContainer = document.createElement("div");
            buttonContainer.className = "buttonContainer";
            buttonContainer.style.width = profileImage.width + "px";
            buttonContainer.style.height = profileImage.height + "px";

            //Create block button
            var xButton = document.createElement("div");
            xButton.className = "xButton";

            //If it's blocked setup the unblocking
            if (blockedProfileIDs.indexOf(profileID) != -1) {
                xButton.id = "xButtonUnblock";
                xButton.innerHTML = "&#10003;";
                if (useCustomBlock) {
                    var scale_width = parseInt(profileImage.width) / useCustomBlockImageWidth;
                    var scale_height = parseInt(profileImage.height) / useCustomBlockImageHeight;
                    var scale = Math.min(scale_width, scale_height);
                    profileImage.width = useCustomBlockImageWidth * scale;
                    profileImage.height = useCustomBlockImageHeight * scale;
                    profileImage.src = useCustomBlockImage;
                }
                else profileImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABaCAQAAADZCVpkAAAAbklEQVR42u3PAQEAAAgCoPx/ugkOEB6QGxNhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh4e4BZKoAW/0XvkQAAAAASUVORK5CYII=";
            } else { //Otherwise setup the blocking
                xButton.id = "xButtonBlock";
                xButton.innerHTML = "x";
            }

            //Event listeners
            (function (xButton, anchorTag) {
                xButton.addEventListener("mouseover", function() {
                    changeLink(0, anchorTag);
                });
            })(xButton, anchorTag);

            (function (xButton, profileID, anchorTag) {
                xButton.addEventListener("mouseout", function() {
                    changeLink(profileID, anchorTag);
                });
            })(xButton, profileID, anchorTag);

            (function (xButton, profileID, profileImage) {
                xButton.addEventListener("click", function() {
                    var status;
                    var xButtonID = xButton.id;
                    if (xButtonID == "xButtonBlock") status = "blocking";
                    else status = "unblocking";
                    blockManager(xButton, profileID, status, profileImage);
                });
            })(xButton, profileID, profileImage);

            //Append nodes
            buttonContainer.appendChild(xButton);
            anchorTag.insertBefore(buttonContainer, anchorTag.firstChild);
        }
    }

    var postContent = document.getElementsByClassName("trow2 post_content ");
    for (var i = 0; i < postContent.length; i++) {
        var signature = postContent[i].children[2];
        if (postContent[i].lastChild.previousSibling.previousSibling.previousSibling.className != "post_body") { //Incase profile has no signature
            var profileID = signature.parentNode.parentNode.parentNode.getElementsByClassName("post_author")[0].getElementsByTagName("a")[0].href.split("uid=")[1];

            //Create block container
            var buttonContainer = document.createElement("div");
            buttonContainer.className = "buttonContainer";
            buttonContainer.style.width = signature.offsetWidth + "px";
            buttonContainer.style.height = signature.offsetHeight + "px";
            buttonContainer.style.pointerEvents = "none";

            //Create block button
            var xButton = document.createElement("div");
            xButton.className = "xButton";
            xButton.style.pointerEvents = "all";

            //If it's blocked setup the unblocking
            if (blockedSignatureIDs.indexOf(profileID) != -1) {
                xButton.id = "xButtonUnblock";
                xButton.innerHTML = "&#10003;";
                if (useCustomSignature) { //Use custom signature
                    signature.innerHTML = useCustomSignatureText;
                }
                else signature.innerHTML = "&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>"; //No custom signature
            } else { //Otherwise setup the blocking
                xButton.id = "xButtonBlock";
                xButton.innerHTML = "x";
            }

            //Event listener
            (function (xButton, profileID) {
                xButton.addEventListener("click", function() {
                    var status;
                    var xButtonID = xButton.id;
                    if (xButtonID == "xButtonBlock") status = "blocking";
                    else status = "unblocking";
                    blockManager2(profileID, status);
                });
            })(xButton, profileID);

            (function (xButton, signature) {
                signature.addEventListener("mouseenter", function() {
                    $(xButton).css("opacity", "1");
                    $(xButton).css("-webkit-transform", "perspective(600px)");
                });
            })(xButton, signature);

            (function (xButton, signature) {
                signature.addEventListener("mouseleave", function() {
                    setTimeout(function() {
                        if ($("#xButtonBlock:hover").length == 0 && $("#xButtonUnblock:hover").length == 0) {
                            $(xButton).css("opacity", "0");
                            $(xButton).css("-webkit-transform", "");
                        }
                    }, 100);
                });
            })(xButton, signature);

            //Append nodes
            buttonContainer.appendChild(xButton);
            signature.parentNode.insertBefore(buttonContainer, signature);
            postContent[i].children[2].style.height = signature.offsetHeight + "px"; //Fix hover area
        }
    }

    if (document.location.href.indexOf("member.php?action=profile") != -1) {
        var profilePage = document.getElementsByClassName("quick_keys")[0];
        var profileID = document.location.href.split("uid=")[1].split("&")[0];
        var profileImage = profilePage.children[0].getElementsByTagName("img");
        profileImage = profileImage[profileImage.length - 1];

        if (profileImage != null && profileImage.parentNode.align == "right") {
            //Create block container
            var buttonContainer = document.createElement("div");
            buttonContainer.className = "buttonContainer";
            buttonContainer.style.width = profileImage.width + "px";
            buttonContainer.style.height = profileImage.height + "px";

            //Create block button
            var xButton = document.createElement("div");
            xButton.className = "xButton";

            //If it's blocked setup the unblocking
            if (blockedProfileIDs.indexOf(profileID) != -1) {
                xButton.id = "xButtonUnblock";
                xButton.innerHTML = "&#10003;";
                if (useCustomBlock) {
                    var scale_width = parseInt(profileImage.width) / useCustomBlockImageWidth;
                    var scale_height = parseInt(profileImage.height) / useCustomBlockImageHeight;
                    var scale = Math.min(scale_width, scale_height);
                    profileImage.width = useCustomBlockImageWidth * scale;
                    profileImage.height = useCustomBlockImageHeight * scale;
                    profileImage.src = useCustomBlockImage;
                }
                else profileImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABaCAQAAADZCVpkAAAAbklEQVR42u3PAQEAAAgCoPx/ugkOEB6QGxNhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh4e4BZKoAW/0XvkQAAAAASUVORK5CYII=";
            } else { //Otherwise setup the blocking
                xButton.id = "xButtonBlock";
                xButton.innerHTML = "x";
            }

            (function (xButton, profileID, profileImage) {
                xButton.addEventListener("click", function() {
                    var status;
                    var xButtonID = xButton.id;
                    if (xButtonID == "xButtonBlock") status = "blocking";
                    else status = "unblocking";
                    blockManager3(xButton, profileID, status, profileImage);
                });
            })(xButton, profileID, profileImage);

            //Append nodes
            buttonContainer.appendChild(xButton);
            buttonContainer.style.display = "inline-block";
            buttonContainer.style.position = "relative";
            buttonContainer.style.left = profileImage.width + "px";
            profileImage.parentNode.insertBefore(buttonContainer, profileImage.parentNode.firstChild);
        }

        var signature = profilePage.children[2].getElementsByTagName("tr")[0].children[2].getElementsByTagName("table");
        signature = signature[signature.length - 1];

        if (signature != null && signature.innerHTML.indexOf("Signature") != -1) {
            signature = signature.getElementsByTagName("tr")[1].children[0];

            //Create block container
            var buttonContainer = document.createElement("div");
            buttonContainer.className = "buttonContainer";
            buttonContainer.style.width = signature.offsetWidth + "px";
            buttonContainer.style.height = signature.offsetHeight + "px";
            buttonContainer.style.pointerEvents = "none";

            //Create block button
            var xButton = document.createElement("div");
            xButton.className = "xButton";
            xButton.style.pointerEvents = "all";

            //If it's blocked setup the unblocking
            if (blockedSignatureIDs.indexOf(profileID) != -1) {
                xButton.id = "xButtonUnblock";
                xButton.innerHTML = "&#10003;";
                if (useCustomSignature) { //Use custom signature
                    signature.innerHTML = useCustomSignatureText;
                }
                else signature.innerHTML = "&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>"; //No custom signature
            } else { //Otherwise setup the blocking
                xButton.id = "xButtonBlock";
                xButton.innerHTML = "x";
            }

            //Event listener
            (function (xButton, profileID, signature) {
                xButton.addEventListener("click", function() {
                    var status;
                    var xButtonID = xButton.id;
                    if (xButtonID == "xButtonBlock") status = "blocking";
                    else status = "unblocking";
                    blockManager4(profileID, status, signature);
                });
            })(xButton, profileID, signature);

            (function (xButton, signature) {
                signature.addEventListener("mouseenter", function() {
                    $(xButton).css("opacity", "1");
                    $(xButton).css("-webkit-transform", "perspective(600px)");
                });
            })(xButton, signature);

            (function (xButton, signature) {
                signature.addEventListener("mouseleave", function() {
                    setTimeout(function() {
                        if ($("#xButtonBlock:hover").length == 0 && $("#xButtonUnblock:hover").length == 0) {
                            $(xButton).css("opacity", "0");
                            $(xButton).css("-webkit-transform", "");
                        }
                    }, 100);
                });
            })(xButton, signature);

            //Append nodes
            buttonContainer.appendChild(xButton);
            signature.parentNode.parentNode.insertBefore(buttonContainer, signature.parentNode);
            signature.parentNode.parentNode.children[1].style.height = signature.offsetHeight + "px"; //Fix hover area
        }
    }
})();

function blockManager(xButton, profileID, status, profileImage2) {
    var profileImages = [];
    var blockedIDIndex;
    var postTableData = document.getElementsByClassName("post_avatar");

    for (var i = 0; i < postTableData.length; i++) {
        var anchorTag = postTableData[i].getElementsByTagName("a")[0];
        if (anchorTag) { //Incase profile has no image
            var profileID2 = anchorTag.href.split("uid=")[1];
            var profileImage = postTableData[i].getElementsByTagName("img")[0];
            if (profileID == profileID2 || profileImage == profileImage2) { //If this is a blocked profile
                blockedIDIndex = blockedProfileIDs.indexOf(profileID);
                if (status == "blocking") { //If we are blocking
                    if (blockedIDIndex == -1) {
                        blockedProfileIDs.push(profileID);
                        GM_SuperValue.set("blockedProfileIDs", blockedProfileIDs);
                        /*if (saveProfileImage) {
                            blockedProfileImages.push(profileImage.src);
                            GM_SuperValue.set("blockedProfileImages", blockedProfileImages);
                        }*/
                    }
                    if (useCustomBlock) { //Use custom block image
                        //Scales custom block image to maintain page layout
                        var scale_width = parseInt(xButton.parentNode.style.width) / useCustomBlockImageWidth;
                        var scale_height = parseInt(xButton.parentNode.style.height) / useCustomBlockImageHeight;
                        var scale = Math.min(scale_width, scale_height);
                        profileImage.width = useCustomBlockImageWidth * scale;
                        profileImage.height = useCustomBlockImageHeight * scale;
                        profileImage.src = useCustomBlockImage;
                    }
                    else profileImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABaCAQAAADZCVpkAAAAbklEQVR42u3PAQEAAAgCoPx/ugkOEB6QGxNhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh4e4BZKoAW/0XvkQAAAAASUVORK5CYII="; //No custom block image
                    profileImage.parentNode.firstChild.firstChild.id = "xButtonUnblock";
                    profileImage.parentNode.firstChild.firstChild.innerHTML = "&#10003;";
                } else if (status == "unblocking") { //If we are unblocking
                    //Scales spinner image to maintain page layout
                    var scale_width = parseInt(xButton.parentNode.style.width) / 50;
                    var scale_height = parseInt(xButton.parentNode.style.height) / 50;
                    var scale = Math.min(scale_width, scale_height);
                    profileImage.width = 50 * scale;
                    profileImage.height = 50 * scale;
                    if (blockedIDIndex != -1) {
                        blockedProfileIDs.splice(blockedIDIndex, 1);
                        GM_SuperValue.set("blockedProfileIDs", blockedProfileIDs);
                    }
                    profileImages.push(profileImage);
                    if (reloadImage) profileImage.src = "https://i.imgur.com/uJvKSoX.gif"; //My custom spinner
                    //if (!saveProfileImage) profileImage.src = "https://i.imgur.com/uJvKSoX.gif";
                    //else profileImage.src = blockedProfileImages[blockedIDIndex];
                    profileImage.parentNode.firstChild.firstChild.id = "xButtonBlock";
                    profileImage.parentNode.firstChild.firstChild.innerHTML = "x";
                }
            }
        }
        /*if (i == postTableData.length && saveProfileImage && status == "unblocking") {
            blockedProfileImages.splice(blockedIDIndex, 1);
            GM_SuperValue.set("blockedProfileImages", blockedProfileImages);
        }*/
    }

    //Updates an unblocked profile
    if (reloadImage && status == "unblocking") {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.hackforums.net/member.php?action=profile&uid=" + profileID,
            onload: function(response) {
                var regexp = /class="tborder">[\n\w\W]+?valign="middle"><img src="([\w\W]+?)"/;
                var m = regexp.exec(response.responseText);
                for (var i = 0; i < profileImages.length; i++) {
                    //Fixes back to original dimensions
                    profileImages[i].width = parseInt(xButton.parentNode.style.width);
                    profileImages[i].height = parseInt(xButton.parentNode.style.height);
                    profileImages[i].src = m[1];
                }
            }
        });
    }
}

function changeLink(profileID, anchorTag) {
    if (profileID == 0) anchorTag.removeAttribute("href");
    else anchorTag.href = "member.php?action=profile&uid=" + profileID;
}

function blockManager2(profileID, status) {
    var profileSignatures = [];
    var blockedIDIndex;
    var postContent = document.getElementsByClassName("trow2 post_content ");
    var postIndices = [];
    for (var i = 0; i < postContent.length; i++) {
        var signature = postContent[i].children[3];
        if (postContent[i].lastChild.previousSibling.previousSibling.previousSibling.className != "post_body") { //Incase profile has no signature
            var profileID2 = signature.parentNode.parentNode.parentNode.getElementsByClassName("post_author")[0].getElementsByTagName("a")[0].href.split("uid=")[1];
            var profileSignature = signature;
            if (profileID == profileID2) { //If this is a blocked profile
                postIndices.push(i);
                blockedIDIndex = blockedSignatureIDs.indexOf(profileID);
                if (status == "blocking") { //If we are blocking
                    if (blockedIDIndex == -1) {
                        blockedSignatureIDs.push(profileID);
                        GM_SuperValue.set("blockedSignatureIDs", blockedSignatureIDs);
                    }
                    if (useCustomSignature) { //Use custom signature
                        profileSignature.innerHTML = useCustomSignatureText;
                    }
                    else profileSignature.innerHTML = "&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>"; //No custom signature
                    postContent[i].children[2].firstChild.id = "xButtonUnblock";
                    postContent[i].children[2].firstChild.innerHTML = "&#10003;";
                    postContent[i].children[2].style.height = profileSignature.offsetHeight + "px"; //Fix hover area
                } else if (status == "unblocking") { //If we are unblocking
                    if (blockedIDIndex != -1) {
                        blockedSignatureIDs.splice(blockedIDIndex, 1);
                        GM_SuperValue.set("blockedSignatureIDs", blockedSignatureIDs);
                    }
                    profileSignatures.push(profileSignature);
                    if (reloadSignature) profileSignature.innerHTML = "<div style=\"text-align: center;\"><img src=\"https://i.imgur.com/uJvKSoX.gif\"></div>"; //My custom spinner
                    postContent[i].children[2].firstChild.id = "xButtonBlock";
                    postContent[i].children[2].firstChild.innerHTML = "x";
                }
            }
        }
    }

    //Updates an unblocked profile
    if (reloadSignature && status == "unblocking") {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.hackforums.net/member.php?action=profile&uid=" + profileID,
            onload: function(response) {
                var regexp = /<!-- start: member_profile_signature -->[\n\w\W]+?class="trow1">([\n\w\W]+?)<\/td>/;
                var m = regexp.exec(response.responseText);
                for (var i = 0; i < profileSignatures.length; i++) {
                    profileSignatures[i].innerHTML = m[1];
                    postContent[postIndices[i]].children[2].style.height = profileSignatures[i].offsetHeight + "px"; //Fix hover area
                }
            }
        });
    }
}

function blockManager3(xButton, profileID, status, profileImage) {
    var profileImages = [];
    var blockedIDIndex = blockedProfileIDs.indexOf(profileID);

    if (status == "blocking") { //If we are blocking
        if (blockedIDIndex == -1) {
            blockedProfileIDs.push(profileID);
            GM_SuperValue.set("blockedProfileIDs", blockedProfileIDs);
            /*if (saveProfileImage) {
                blockedProfileImages.push(profileImage.src);
                GM_SuperValue.set("blockedProfileImages", blockedProfileImages);
            }*/
        }
        if (useCustomBlock) { //Use custom block image
            //Scales custom block image to maintain page layout
            var scale_width = parseInt(xButton.parentNode.style.width) / useCustomBlockImageWidth;
            var scale_height = parseInt(xButton.parentNode.style.height) / useCustomBlockImageHeight;
            var scale = Math.min(scale_width, scale_height);
            profileImage.width = useCustomBlockImageWidth * scale;
            profileImage.height = useCustomBlockImageHeight * scale;
            profileImage.src = useCustomBlockImage;
        }
        else profileImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABaCAQAAADZCVpkAAAAbklEQVR42u3PAQEAAAgCoPx/ugkOEB6QGxNhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh4e4BZKoAW/0XvkQAAAAASUVORK5CYII="; //No custom block image
        profileImage.parentNode.firstChild.firstChild.id = "xButtonUnblock";
        profileImage.parentNode.firstChild.firstChild.innerHTML = "&#10003;";
    } else if (status == "unblocking") { //If we are unblocking
        //Scales spinner image to maintain page layout
        var scale_width = parseInt(xButton.parentNode.style.width) / 50;
        var scale_height = parseInt(xButton.parentNode.style.height) / 50;
        var scale = Math.min(scale_width, scale_height);
        profileImage.width = 50 * scale;
        profileImage.height = 50 * scale;
        if (blockedIDIndex != -1) {
            blockedProfileIDs.splice(blockedIDIndex, 1);
            GM_SuperValue.set("blockedProfileIDs", blockedProfileIDs);
        }
        profileImages.push(profileImage);
        if (reloadImage) profileImage.src = "https://i.imgur.com/uJvKSoX.gif"; //My custom spinner
        //if (!saveProfileImage) profileImage.src = "https://i.imgur.com/uJvKSoX.gif";
        //else profileImage.src = blockedProfileImages[blockedIDIndex];
        profileImage.parentNode.firstChild.firstChild.id = "xButtonBlock";
        profileImage.parentNode.firstChild.firstChild.innerHTML = "x";
    }

    //Updates an unblocked profile
    if (reloadImage && status == "unblocking") {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.hackforums.net/member.php?action=profile&uid=" + profileID,
            onload: function(response) {
                var regexp = /class="tborder">[\n\w\W]+?valign="middle"><img src="([\w\W]+?)"/;
                var m = regexp.exec(response.responseText);
                for (var i = 0; i < profileImages.length; i++) {
                    //Fixes back to original dimensions
                    profileImages[i].width = parseInt(xButton.parentNode.style.width);
                    profileImages[i].height = parseInt(xButton.parentNode.style.height);
                    profileImages[i].src = m[1];
                }
            }
        });
    }
}

function blockManager4(profileID, status, profileSignature) {
    var blockedIDIndex = blockedSignatureIDs.indexOf(profileID);

    if (status == "blocking") { //If we are blocking
        if (blockedIDIndex == -1) {
            blockedSignatureIDs.push(profileID);
            GM_SuperValue.set("blockedSignatureIDs", blockedSignatureIDs);
        }
        if (useCustomSignature) { //Use custom signature
            profileSignature.innerHTML = useCustomSignatureText;
        }
        else profileSignature.innerHTML = "&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>"; //No custom signature
        profileSignature.parentNode.parentNode.children[1].firstChild.id = "xButtonUnblock";
        profileSignature.parentNode.parentNode.children[1].firstChild.innerHTML = "&#10003;";
        profileSignature.parentNode.parentNode.children[1].style.height = profileSignature.offsetHeight + "px"; //Fix hover area
    } else if (status == "unblocking") { //If we are unblocking
        if (blockedIDIndex != -1) {
            blockedSignatureIDs.splice(blockedIDIndex, 1);
            GM_SuperValue.set("blockedSignatureIDs", blockedSignatureIDs);
        }
        if (reloadSignature) profileSignature.innerHTML = "<div style=\"text-align: center;\"><img src=\"https://i.imgur.com/uJvKSoX.gif\"></div>"; //My custom spinner
        profileSignature.parentNode.parentNode.children[1].firstChild.id = "xButtonBlock";
        profileSignature.parentNode.parentNode.children[1].firstChild.innerHTML = "x";
    }

    //Updates an unblocked profile
    if (reloadSignature && status == "unblocking") {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.hackforums.net/member.php?action=profile&uid=" + profileID,
            onload: function(response) {
                var regexp = /<!-- start: member_profile_signature -->[\n\w\W]+?class="trow1">([\n\w\W]+?)<\/td>/;
                var m = regexp.exec(response.responseText);
                profileSignature.innerHTML = m[1];
                profileSignature.parentNode.parentNode.children[1].style.height = profileSignature.offsetHeight + "px"; //Fix hover area
            }
        });
    }
}