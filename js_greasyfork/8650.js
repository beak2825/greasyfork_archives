// ==UserScript==
// @name            Youtube: Download MP3
// @description     Download video from Youtube as MP3
// @author          Chris H (Zren / Shade)
// @icon            https://youtube.com/favicon.ico
// @namespace       http://xshade.ca
// @version         11
// @include         http*://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @downloadURL https://update.greasyfork.org/scripts/8650/Youtube%3A%20Download%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/8650/Youtube%3A%20Download%20MP3.meta.js
// ==/UserScript==

(function (window) {
    "use strict";
    
    //--- Imported Globals
    // yt
    // ytcenter
    // ytplayer
    var uw = window.top;
    
    var YTMP3 = function() {
        this.scriptShortName = 'ytmp3';
        this.isPageReady = false;
        this.isWatchPage = false;
    };
    YTMP3.prototype.log_ = function(logger, args) { logger.apply(console, ['[' + this.scriptShortName + '] '].concat(Array.prototype.slice.call(args))); return 1; };
    YTMP3.prototype.log = function() { return this.log_(console.log, arguments); };
    YTMP3.prototype.error = function() { return this.log_(console.error, arguments); };
    
    YTMP3.prototype.main = function() {
        try {
            this.registerYoutubePubSubListeners();
        } catch(e) {
            this.error("Could not hook yt.pubsub", e);
            setTimeout(this.main, 1000);
        }
        this.init();
    };

    YTMP3.prototype.isWatchUrl = function(url) {
        if (!url)
            url = uw.location.href;
        return url.match(/https?:\/\/(www\.)?youtube.com\/watch\?/);
    };
    
    YTMP3.prototype.init = function() {
        var style = '';
        style += '.action-panel-trigger-downloadmp3:before { width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wMSBysqOojDpAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAASklEQVQ4y2NgGOyAkQg1/0nRw0iCQUTpZSTTMJz6GcnwIl55RjLDC6c6JjLDF6ccE7WTDRMFyYlgLP8n0VCs6unm5VEDB9DAEQgAA2wJHY4qxL0AAAAASUVORK5CYII=); }';
        style += '.ytmp3-download-button, .ytmp3-open-button, .ytmp3-input { margin-bottom: 10px; width:100%; box-sizing: border-box; }';
        style += '.ytmp3-open-button { text-align: right; width: 28%; }';
        style += '.ytmp3-download-button { text-align: center; margin-left: 2%; width: 70%; }';
        style += '#watch-action-panels #action-panel-downloadmp3:not(.hid) ~ #action-panel-dismiss { display: none; }';
        GM_addStyle(style);
    };
    
    YTMP3.prototype.onInitWatch = function() {
        this.injectElements();
        this.initForm();
        this.updateLinks();
        //this.log(this.showPanelButton);
        //this.showPanelButton.click();
    };
    
    YTMP3.prototype.injectElements = function() {
        var html;

        if (!document.querySelector('.action-panel-trigger-downloadmp3')) {
            var button = document.createElement('div');
            html = '<button';
            // html += ' class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup action-panel-trigger action-panel-trigger-downloadmp3 yt-uix-tooltip"';
            html += ' class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup action-panel-trigger action-panel-trigger-downloadmp3 yt-uix-tooltip yt-uix-button-toggled"'
            html += ' type="button"';
            // html += ' onclick="location.href=\'#body-container\';return false;"';
            html += ' title="Download MP3"';
            html += ' data-trigger-for="action-panel-downloadmp3"';
            html += ' data-button-toggle="true"';
            html += ' aria-pressed="true"'
            html += '>';
                html += '<span class="yt-uix-button-content">MP3</span>';
            html += '</button>';
            button.innerHTML = html;
            button = button.firstChild;
            
            var secondaryActions = document.querySelector('#watch8-secondary-actions');
            if (secondaryActions) {
                secondaryActions.insertBefore(button, secondaryActions.firstChild);
            }
            this.showPanelButton = button;
        }
        
        if (!document.querySelector('#action-panel-downloadmp3')) {
            var buildDownloadSiteButtons = function(site) {
                var siteKey = site.toLowerCase();
                var html = '';
                html += '<a data-site="' + siteKey +'" id="ytmp3-open-button" class="yt-uix-button yt-uix-button-size-default ytmp3-open-button" type="button" target="_blank" href="javascript:void;">';
                    html += '<span  class="yt-uix-button-content">' + site + '</span>';
                html += '</a>';
                html += '<a data-site="' + siteKey +'" class="yt-uix-button yt-uix-button-size-default yt-uix-button-primary ytmp3-download-button" type="button" href="javascript:void;">';
                    html += '<span  class="yt-uix-button-content">Download</span>';
                html += '</a>';
                return html;
            };
            
            var actionPanel = document.createElement('div');
            html = '<div id="action-panel-downloadmp3" class="action-panel-content hid" data-panel-loaded="true">';
                html += '<div id="watch-actions-downloadmp3-loading" class="hid" style="display: none;">';
                    html += '<div class="action-panel-loading">';
                        html += '<p class="yt-spinner ">';
                            html += '<span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>';
                            html += '<span class="yt-spinner-message">Loading...</span>';
                        html += '</p>';
                    html += '</div>';
                html += '</div>';
                html += '<div id="watch-actions-downloadmp3-panel">';
                    html += '<div class="downloadmp3-panel">';
                        html += '<span class="yt-uix-form-label">Title <a href="javascript:none;" onclick="ytmp3.swapTitleAndArtist();">(Swap with Artist)</a></span><input id="ytmp3-title" placeholder="Title" class="yt-uix-form-input-text ytmp3-input" onchange="ytmp3.updateLinks()">';
                        html += '<span class="yt-uix-form-label">Artist</span><input id="ytmp3-artist" placeholder="Artist" class="yt-uix-form-input-text ytmp3-input" onchange="ytmp3.updateLinks()">';
                        html += '<span class="yt-uix-form-label">Album</span><input id="ytmp3-album" placeholder="Album" class="yt-uix-form-input-text ytmp3-input" onchange="ytmp3.updateLinks()">';
                        html += '<span class="yt-uix-form-label">Comment</span><input id="ytmp3-comment" placeholder="Comment" class="yt-uix-form-input-text ytmp3-input" onchange="ytmp3.updateLinks()">';
                        html += '<h2>Download Locations</h2>';
                        html += buildDownloadSiteButtons('YoutubeInMP3');
                        html += buildDownloadSiteButtons('Dirpy');
                    html += '</div>';
                html += '</div>';
            html += '</div>';
            actionPanel.innerHTML = html;
            actionPanel = actionPanel.firstChild;
            
            var actionPanels = document.querySelector('#watch-action-panels');
            if (actionPanels) {
                actionPanels.insertBefore(actionPanel, actionPanels.firstChild);
            }
        }
    };
    
    YTMP3.prototype.initForm = function() {
        var title = '';
        var artist = '';
        var albumn = '';
        var comment = '';

        title = ytplayer.config.args.title;;
        var titleTokens = title.split(' - ');
        if (titleTokens.length > 1) {
            artist = titleTokens[0];
            title = titleTokens[1];
        }

        comment = 'https://www.youtube.com/watch?v=' + ytplayer.config.args.video_id;
        album = 'Youtube';

        document.querySelector('#ytmp3-title').value = title;
        document.querySelector('#ytmp3-artist').value = artist;
        document.querySelector('#ytmp3-album').value = album;
        document.querySelector('#ytmp3-comment').value = comment;
    };

    

    YTMP3.prototype.swapTitleAndArtist = function() {
        var temp = document.querySelector('#ytmp3-title').value;
        document.querySelector('#ytmp3-title').value = document.querySelector('#ytmp3-artist').value;
        document.querySelector('#ytmp3-artist').value = temp;
    };

    YTMP3.prototype.updateLinks = function() {
        var title = document.querySelector('#ytmp3-title').value;
        var artist = document.querySelector('#ytmp3-artist').value;
        var album = document.querySelector('#ytmp3-album').value;
        var comment = document.querySelector('#ytmp3-comment').value;
        
        //--- Dirpy
        // Download
        var type = 'audio';
        var ext = 'mp3';
        var format_id = 0;
        var start_time = '00:00:00';
        var end_time = '23:59:59';
        var filename = artist.length ? artist + ' - ' + title : title;
        filename = filename.replace(/\//g,'');
        var youtubeUrl = encodeURIComponent('https://www.youtube.com/watch?v=' + ytplayer.config.args.video_id);
        var audio_format = '192K';
        var downloadToken = Date.now();
        var url = "?url=" + youtubeUrl +
                        "&filename=" + encodeURIComponent(filename) +
                        "&ext=" + ext +
                        "&format_id=" + format_id +
                        "&audio_format=" + audio_format +
                        "&start_time=" + start_time +
                        "&end_time=" + end_time +
                        "&type=" + type +
                        "&" + encodeURIComponent('ID3[title]') + '=' + encodeURIComponent(title) +
                        "&" + encodeURIComponent('ID3[artist]') + '=' + encodeURIComponent(artist) +
                        "&" + encodeURIComponent('ID3[comment]') + '=' + encodeURIComponent(comment) +
                        "&" + encodeURIComponent('ID3[genre]') + '=' + '' +
                        "&" + encodeURIComponent('ID3[album]') + '=' + encodeURIComponent(album) +
                        "&" + encodeURIComponent('ID3[genre]') + '=' + '' +
                        "&" + encodeURIComponent('ID3[track]') + '=' + '0' +
                        "&" + encodeURIComponent('ID3[year]') + '=' + '' +
                        "&downloadToken=" + downloadToken +
                        "";
        url = 'http://dirpy.com/download' + url;
        var downloadBtn = document.querySelector('.ytmp3-download-button[data-site="dirpy"]');
        var filepath = filename + '.' + ext;
        downloadBtn.setAttribute('href', url);
        downloadBtn.setAttribute('download', filepath);
        
        // Open
        var url = 'http://dirpy.com/studio?url=' + youtubeUrl;
        var openBtn = document.querySelector('.ytmp3-open-button[data-site="dirpy"]');
        openBtn.setAttribute('href', url);
        
        //--- YoutubeInMP3
        // Download
        var url = 'http://youtubeinmp3.com/fetch/?video=' + youtubeUrl + '&hq=1';
        var downloadBtn = document.querySelector('.ytmp3-download-button[data-site="youtubeinmp3"]');
        var filepath = filename + '.' + ext;
        downloadBtn.setAttribute('href', url);
        downloadBtn.setAttribute('download', filepath);
        
        // Open
        var url = 'https://www.youtubeinmp3.com/watch?v=' + ytplayer.config.args.video_id;
        var openBtn = document.querySelector('.ytmp3-open-button[data-site="youtubeinmp3"]');
        openBtn.setAttribute('href', url);
    };

    
    YTMP3.prototype.registerYoutubePubSubListeners = function() {
        // Subscribe
        var pubsubListeners = {
            'init-watch': this.onInitWatch.bind(this),
        };
        for (var eventName in pubsubListeners) {
            var eventListener = pubsubListeners[eventName];
            uw.yt.pubsub.instance_.subscribe(eventName, eventListener);
        }
    };
    
    //--- Already Loaded?
    // GreaseMonkey loads this script twice for some reason.
    if (uw.ytmp3) return;
    
    var ytmp3 = uw.ytmp3 = new YTMP3(); 
    ytmp3.main();
    
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
