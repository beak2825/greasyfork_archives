// ==UserScript==
// @name         Hide videos seen on Youtube
// @namespace    http://youtube.com
// @version      1.0
// @description  Hide videos seen on Youtube, on any page, by X'ing them
// @include      https://www.youtube.com/*
// @exclude      https://www.youtube.com/user/*/playlists
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/5623/Hide%20videos%20seen%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/5623/Hide%20videos%20seen%20on%20Youtube.meta.js
// ==/UserScript==


// replace old style localStorage from past version
var storedHiddenVideos = JSON.parse(localStorage.getItem('HideVideosList') || '{}');
for (var key in localStorage)
    if (key.match(/^https:\/\/www.youtube.com\/user\//)) {
        for (var url in JSON.parse(localStorage.getItem(key) || '{}'))
            storedHiddenVideos[url.replace(/(.*?)&.*/,'\$1')] = true;
        localStorage.setItem('HideVideosList', JSON.stringify(storedHiddenVideos));
        localStorage.removeItem(key);
    }

$('head').append(
    '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">' +
    '<style>' +
        '#show-all-hidden-videos {' +
            'margin-left: 20px;' +
        '}' +
    '</style>'
);

function getNewVideoLinks() {
    var vids = $('a').filter(function(){
        if (!$(this).attr('href'))
            return;
        if (!$(this).attr('href').match(/^\/watch/))
            return;
        if ($(this).hasClass('youtube-mark-read'))
            return;
        return true;
    });
    return vids
}

function findClosest(element, searchSelector) {
    if (element.length == 0)
        return $();
    var selected = element.parent().find(searchSelector);
    if (selected.length != 0)
        return selected.first();
    else
        return findClosest(element.parent(), searchSelector);
}

// Set hide link hover event
function hideLinkShow() { findClosest($(this).parent(), 'a.hide-link').show(); }
function hideLinkHide() { findClosest($(this).parent(), 'a.hide-link').hide(); }
$('body').on('mouseenter', '.video-thumb, .addto-watch-later-button, .watched-badge, .yt-uix-simple-thumb-wrap', hideLinkShow);
$('body').on('mouseleave', '.video-thumb, .addto-watch-later-button, .watched-badge, .yt-uix-simple-thumb-wrap', hideLinkHide);

// Set hide link click event
$('body').on('click', 'a.hide-link', function(e){
    e.preventDefault();
    var currentLink = findClosest($(this), 'a.yt-uix-sessionlink');
    setLinkHidden(currentLink.attr('href').replace(/(.*?)&.*/,'\$1'));
    hideLink(currentLink);
});

function setLinkHidden(currentLink, deleteFlag) {
    var storedHiddenVideos = JSON.parse(localStorage.getItem('HideVideosList') || '{}');
    if (deleteFlag)
        delete storedHiddenVideos[currentLink];
    else
        storedHiddenVideos[currentLink] = true;
    localStorage.setItem('HideVideosList', JSON.stringify(storedHiddenVideos));
}

function hideLink(currentLink) {
    var td = currentLink.closest('td');
    if (td.hasClass('pl-video-title') || td.hasClass('pl-video-thumbnail'))
        var elementToHide = currentLink.closest('tr');
    else
        var elementToHide = currentLink.closest('li');
    elementToHide.addClass('youtube-mark-read-hidden').hide();
}

function linkIsHidden(currentLink) {
    var storedHiddenVideos = JSON.parse(localStorage.getItem('HideVideosList') || '{}');
    if (storedHiddenVideos[currentLink] !== undefined)
        return true
    return false
}

function processLink() {
    var currentLink = $(this);
    currentLink.addClass('youtube-mark-read');
    var currentImage = currentLink.find('img');
    var wrapper = '<div style="display: inline-block;"></div>';
    if (currentImage.parent().hasClass('yt-uix-simple-thumb-related'))
        wrapper = '<div class="yt-uix-simple-thumb-related" style="display: inline-block;"></div>';
    currentImage.wrap(wrapper).parent().prepend('<a class="hide-link"><i class="fa fa-close"></i></a><div style="clear:both;"></div>').css('position','relative');
    // inline the CSS to override inherited YouTube styles that mess stuff up
    var hideLinkCSS = {
        'display': 'none',
        'background': 'rgba(255,255,255,1)',
        'font-size': '20px',
        'color': '#000',
        'z-index': '100000000',
        'position': 'absolute',
        'right': '0',
        'padding': '3px',
    };
    $('.hide-link').css(hideLinkCSS);
    if (currentImage.parent().closest('a').hasClass('playlist-video')) {
        currentImage.parent().find('.hide-link').css('margin-top', '5px');
    }
    if (currentImage.closest('td').hasClass('pl-video-thumbnail'))
        currentImage.closest('td').find('.watched-badge').css({'bottom': '1px', 'top': 'initial'});
    if (linkIsHidden(currentLink.attr('href').replace(/(.*?)&.*/,'\$1')))
        hideLink(currentLink);
}

// Do these every 5 seconds
var intervalID = setInterval(function() {
    getNewVideoLinks().each(processLink);

    // Add show/hide button to player page
    if (window.location.href.match(/youtube\.com\/watch/)) {
        var buttonHTML = '<button id="hide" class="show-hide-current-video-url yt-uix-button yt-uix-button-default" style="margin-left: 5px; float: right;">Hide</button>'
        if ($('.show-hide-current-video-url').length == 0) {
            $('#watch-headline-title').append(buttonHTML + buttonHTML);
            $('.show-hide-current-video-url').first().text('Show').attr('id', 'show');
        }
        currentVideoUrl = window.location.href.replace(/.*youtube\.com(\/watch[^&]+).*/,'$1');
        updatePlayerShowHideButton();
    }

    updatePlayerShowHideButton();
}, 5000);

// Add show hidden button
waitForKeyElements('button.yt-google-help-link', function() {
    var showButton = '<button id="show-all-hidden-videos" class="yt-uix-button yt-uix-button-default"><span>Show hidden</span></button>';
    $('button.yt-google-help-link').after(showButton);
    $('button#show-all-hidden-videos').click(function(){
        $('.youtube-mark-read-hidden').show();
    });
});

function updatePlayerShowHideButton() {
    if (window.location.href.match(/youtube\.com\/watch/)) {
        if (linkIsHidden(currentVideoUrl)) {
            $('.show-hide-current-video-url#show').show();
            $('.show-hide-current-video-url#hide').hide();
        }
        else {
            $('.show-hide-current-video-url#hide').show();
            $('.show-hide-current-video-url#show').hide();
        }
    }
}

// Set player show/hide button click events
$('body').on('click', '.show-hide-current-video-url#hide', function() {
    setLinkHidden(currentVideoUrl);
    updatePlayerShowHideButton();
});
$('body').on('click', '.show-hide-current-video-url#show', function() {
    setLinkHidden(currentVideoUrl, true);
    updatePlayerShowHideButton();
});
