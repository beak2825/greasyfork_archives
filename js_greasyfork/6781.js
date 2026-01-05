// ==UserScript==
// @name         ThumbCollectV3
// @namespace    http://kamal-q.deviantart.com/
// @version      0.6
// @description	 This script allows you to quickly collect thumb-codes on deviantart, and grab usernames
// @author       Kamal-Q
// @match        http://*.deviantart.com/*
// @match        https://*.deviantart.com/*
// @exclude	 	  http://*.sta.sh/*
// @exclude	 	  http://*.deviantart.com/
// @exclude	 	  http://shop.deviantart.com/*
// @exclude	 	  http://chat.deviantart.com/*
// @exclude	 	  http://*.deviantart.com/messages/*
// @exclude	 	  http://*.deviantart.com/notifications/*
// @exclude	 	  http://*.deviantart.com/art/*
// @exclude	 	  http://*.deviantart.com/watch/*
// @exclude	 	  http://*.deviantart.com/submit/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant        metadata
// @downloadURL https://update.greasyfork.org/scripts/6781/ThumbCollectV3.user.js
// @updateURL https://update.greasyfork.org/scripts/6781/ThumbCollectV3.meta.js
// ==/UserScript==
var thumbCollectVars = {
    allThumbs: [
    ],
    selectedThumbs: [
    ],
    allUsers: [
    ],
    selectedUsers: [
    ]
};
//create the css classes used in for thumbcollect
function makeCssClasses() {
    var zIdx = 125;
    var thStyle = document.createElement('style');
    thStyle.innerHTML = '#thumbCollectBtn{width: 30px; height:30px; position: absolute; top: 10px; left:680px; border-radius: 0px 5px 5px 0px; z-index:' + zIdx + '}';
    thStyle.innerHTML += '#thumbCollectBar{width: 230px; height:30px; line-height:30px; background: #687; display: inline-block; overflow: hidden; border-radius: 0px 5px 5px 0px}';
    thStyle.innerHTML += '#tcCollections{display:none; height: 150px; width:180px; background:#687; position: absolute; z-Index:' + zIdx + '; top: 40px; left:680px; border-radius:0px 0px 5px 5px}';
    thStyle.innerHTML += '#tcTextarea{display:block;width:90%; margin:auto; height:114px; margin-top:5px;background-color:#DED; resize:none;text-align:center; border-radius:0px 0px 8px 8px;}';
    thStyle.innerHTML += '#tcBarText{width: 30px; float:left; cursor: move}';
    thStyle.innerHTML += '#tcCopyBtn{width: 40px; float:right;}';
    thStyle.innerHTML += '.tcTextareaBtn{width: 20px; height:20px; line-height:20px; text-align:center; float:left; cursor: pointer; background:#c00; color:#fff; margin:3px; border-radius:5px}';
    thStyle.innerHTML += '.tcTextareaBtn:hover{background:#e00;}';
    thStyle.innerHTML += '.toggleBarBtns{width: 45px; height:26px; background: #465; margin: 2px; float:right; cursor:pointer; font-size:10px; color:#fff; text-align:center; border-radius: 5px;}';
    thStyle.innerHTML += '.toggleBarBtns:hover{background: #798;}';
    thStyle.innerHTML += '.selectedBtn{background: #6b7;}';
    thStyle.innerHTML += '.tcThumbid{z-index: 7; display:inline-block; position:absolute; top:5px; left:3px; color:#f33; background:rgba(0,0,0,.75); border-radius: 2px; cursor:pointer}';
    thStyle.innerHTML += '.tcThumbid:hover{color:#f55}';
    thStyle.innerHTML += '.tcGallery{top:2px; left:2px; height: 24px ;line-height: 24px}';
    thStyle.innerHTML += '.tcForum{top:2px; left:2px; position:relative; display: block}';
    thStyle.innerHTML += '.tcIdSelected{color:#3f3;}';
    thStyle.innerHTML += '.tcIdSelected:hover{color:#7f7;}';
    thStyle.innerHTML += '.tcBrowse{width: 125px; height: 24px ;line-height: 24px; text-align: center}';
    document.head.appendChild(thStyle);
} //create an element with passed in classname and/or id

function createElement(element, className, id, text) {
    var createdElement = document.createElement(element);
    if (className) createdElement.className = className;
    if (id) createdElement.id = id;
    if (text) createdElement.innerHTML = text;
    return createdElement;
} //create the elements related to the UI, ie the bar, buttons, and text area

function makeAllUiElements() {
    //create the elements used by thumb collect    
    var thumbCollectBtn = createElement('div', null, 'thumbCollectBtn');
    var thumbCollectBar = createElement('div', null, 'thumbCollectBar');
    var tcBarText = createElement('div', 'toggleBarBtns', 'tcBarText', 'TC:');
    var collectedToggle = createElement('div', 'toggleBarBtns', 'collectedThumbs', 'Picked');
    var allThumbsToggle = createElement('div', 'toggleBarBtns', 'allThumbs', 'Thumbs');
    var collectedUsersToggle = createElement('div', 'toggleBarBtns', 'collectedUsers', 'Picked');
    var allUsersToggle = createElement('div', 'toggleBarBtns', 'allUsers', 'Users');
    var collections = createElement('div', null, 'tcCollections');
    var tcTextarea = createElement('textarea', null, 'tcTextarea');
    var tcCloseBtn = createElement('div', 'tcTextareaBtn', 'tcCloseBtn', 'x');
    var tcCopyBtn = createElement('div', 'tcTextareaBtn', 'tcCopyBtn', 'copy');
    thumbCollectBar.appendChild(collectedToggle);
    thumbCollectBar.appendChild(allThumbsToggle);
    thumbCollectBar.appendChild(collectedUsersToggle);
    thumbCollectBar.appendChild(allUsersToggle);
    thumbCollectBar.appendChild(tcBarText);
    thumbCollectBtn.appendChild(thumbCollectBar);
    collections.appendChild(tcTextarea);
    collections.appendChild(tcCloseBtn);
    collections.appendChild(tcCopyBtn);
    document.body.appendChild(collections);
    document.body.appendChild(thumbCollectBtn);
} //show and hide the div containing the textarea with the thumbcodes

function showCollections(btnName) {
    if ($('#tcCollections').is(':hidden')) {
        $('#tcCollections').slideDown(200).select();
    } else if ($('#' + btnName).hasClass('selectedBtn')) {
        $('.toggleBarBtns').removeClass('selectedBtn');
        $('#tcCollections').slideUp(200);
        return;
    }
    $('.toggleBarBtns').removeClass('selectedBtn');
    $('#' + btnName).addClass('selectedBtn');
}
function hideCollections() {
    $('#tcCollections').slideUp(200);
    $('.toggleBarBtns').removeClass('selectedBtn');
} //create the events which the app listens for

function thumbCollectUiEvents() {
    $('#thumbCollectBtn').draggable({
        drag: function (e) {
            var collection = document.getElementById('tcCollections');
            collection.style.top = e.target.getBoundingClientRect().bottom + 'px';
            collection.style.left = e.target.getBoundingClientRect().left + 'px';
        }
    });
    $('#collectedThumbs').click(function (e) {
        e.preventDefault();
        $('#tcTextarea').html(makeStringFromArray(thumbCollectVars.selectedThumbs));
        showCollections('collectedThumbs');
        return false;
    });
    $('#allThumbs').click(function (e) {
        e.preventDefault();
        $('#tcTextarea').html(makeStringFromArray(thumbCollectVars.allThumbs));
        showCollections('allThumbs');
        return false;
    });
    $('#collectedUsers').click(function (e) {
        e.preventDefault();
        $('#tcTextarea').html(makeStringFromArray(thumbCollectVars.selectedUsers));
        showCollections('collectedUsers');
        return false;
    });
    $('#allUsers').click(function (e) {
        e.preventDefault();
        $('#tcTextarea').html(makeStringFromArray(thumbCollectVars.allUsers));
        showCollections('allUsers');
        return false;
    });
    $('#tcCloseBtn').click(function () {
        hideCollections();
        return false;
    });
    $('#tcCopyBtn').click(function () {
        $('#tcTextarea').select();
        document.execCommand('copy');
    });
}
function makeStringFromArray(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        str += arr[i] + ' \n';
    }
    return str;
} //takes a deviant art style link and parses it for user names
//da style links are: username.deviantart.com

function parseUserFromUrl(link) {
    var i1 = link.indexOf('/') + 2;
    var i2 = link.indexOf('.');
    return link.substring(i1, i2);
}
function parseDevIdFromUrl(link) {
    var i1 = link.lastIndexOf('-') + 1;
    var i2 = link.length;
    return link.substring(i1, i2);
}
function addSelection(element) {
    hideCollections();
    var thumbid = element.getAttribute('thumbid');
    var user = element.getAttribute('user');
    if (!thumbCollectVars.selectedUsers.includes(user)) thumbCollectVars.selectedUsers.push(user);
    if (!thumbCollectVars.selectedThumbs.includes(thumbid)) thumbCollectVars.selectedThumbs.push(thumbid);
}
function removeSelection(element) {
    hideCollections();
    var thumbid = element.getAttribute('thumbid');
    var user = element.getAttribute('user');
    var tIdx = thumbCollectVars.selectedUsers.indexOf(user);
    var uIdx = thumbCollectVars.selectedThumbs.indexOf(thumbid);
    if (tIdx !== - 1) thumbCollectVars.selectedUsers.splice(tIdx, 1);
    if (uIdx !== - 1) thumbCollectVars.selectedThumbs.splice(uIdx, 1);
}
function thumbidClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if ($(this).hasClass('tcIdSelected')) {
        $(this).removeClass('tcIdSelected');
        removeSelection(this);
    } else {
        $(this).addClass('tcIdSelected');
        addSelection(this);
    }
    return false;
}
function appendThumbToImg(element, user, thumbid, location) {
    if (user && thumbid) {
        if (!thumbCollectVars.allUsers.includes(user)) thumbCollectVars.allUsers.push(user);
        if (!thumbCollectVars.allThumbs.includes(thumbid)) thumbCollectVars.allThumbs.push(thumbid);
        var collectId = $('<div>' + thumbid + '</div>');
        collectId.attr('thumbid', thumbid);
        collectId.attr('user', user);
        collectId.click(thumbidClick);
        if (location == 'gallery') {
            collectId.addClass('tcThumbid tcGallery');
            collectId.appendTo(element);
        } else if (location == 'browse') {
            collectId.addClass('tcThumbid tcBrowse');
            collectId.appendTo(element);
        } else if (location == 'forum') {
            collectId.addClass('tcThumbid tcForum');
            collectId.appendTo(element);
        } else if (location == 'journal-a') {
            collectId.addClass('tcThumbid tcForum');
            collectId.appendTo(element);
        }
    }
} //finds the thumbs on the page and adds them to the 

function getAllThumbsAndUsers() {
    if (window.location.href.indexOf('/gallery/') !== - 1 || window.location.href.indexOf('/favourites/') !== - 1){
        getGalleryThumbs();
        return;
    }
    var thumbs = $('.thumb, .embedded-deviation').not('.tt-a');
    for (var i = 0; i < thumbs.length; i++) {
        var user,
            link,
            thumbid,
            devId;
        if (window.location.href.indexOf('/browse/') !== - 1) {
            devId = thumbs[i].getAttribute('data-deviationid');
            if (devId) thumbid = ':thumb' + devId + ':';
            link = thumbs[i].querySelector('a.username');
            user = link.innerHTML;
            appendThumbToImg(thumbs[i], user, thumbid, 'browse');
        } else if (window.location.href.indexOf('/today/') !== - 1) {
            link = thumbs[i].getAttribute('href');
            user = parseUserFromUrl(link);
            devId = parseDevIdFromUrl(link);
            if (devId) thumbid = ':thumb' + devId + ':';
            appendThumbToImg(thumbs[i], user, thumbid, 'browse');
        } else if (window.location.href.indexOf('forum.') !== - 1 || window.location.href.indexOf('/dailydeviations/') !== - 1) {
            link = thumbs[i].getAttribute('href');
            user = parseUserFromUrl(link);
            devId = parseDevIdFromUrl(link);
            if (devId) thumbid = ':thumb' + devId + ':';
            appendThumbToImg(thumbs[i], user, thumbid, 'forum');
        } else if (window.location.href.indexOf('/journal/') !== - 1) {
            //in journals you have the contents of the journal (links) as well as the side bar divs 
            if (thumbs[i].tagName === 'A') {
                link = thumbs[i].getAttribute('href');
                if (link.indexOf('/sta.sh/') == - 1) {
                    devId = parseDevIdFromUrl(link);
                    if (devId) thumbid = ':thumb' + devId + ':';
                    user = parseUserFromUrl(link);
                    appendThumbToImg(thumbs[i], user, thumbid, 'journal-a');
                }
            } else if (thumbs[i].tagName === 'DIV') {
                devId = thumbs[i].getAttribute('data-deviationid');
                if (devId) thumbid = ':thumb' + devId + ':';
                var journalA = thumbs[i].querySelector('a');
                if (journalA) {
                    link = journalA.getAttribute('href');
                    user = parseUserFromUrl(link);
                    appendThumbToImg(thumbs[i], user, thumbid, 'journal-div');
                }
            }
        }
    }
}

function getGalleryThumbs(){
    var thumbs = $('.torpedo-thumb-link');
    for (var i = 0; i < thumbs.length; i++) {
        if (thumbs[i].tagName == 'A') {
            link = thumbs[i].getAttribute('href');
            if (link.indexOf('?') !== - 1) devId = parseDevIdFromUrl(link.substring(0, link.indexOf('?')));
            else devId = parseDevIdFromUrl(link);
            if (devId) thumbid = ':thumb' + devId + ':';
            user = parseUserFromUrl(link);
            appendThumbToImg(thumbs[i], user, thumbid, 'gallery');
        }
    }
}

//initialize the app once da is loaded
$(document).ready(function () {
    makeCssClasses();
    makeAllUiElements();
    thumbCollectUiEvents();
    getAllThumbsAndUsers();
});
