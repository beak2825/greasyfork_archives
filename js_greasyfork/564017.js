// ==UserScript==
// @version 5.8
// @name Bandcamp upload helper
// @description Bandcamp helper for getting info to RED uploads - improved version
// @license      MIT
// @include http*://*.bandcamp.com/album/*
// @include http*://*.bandcamp.com/track/*
// @include http*://*redacted.sh/upload.php*_buh*
// @include http*://*redacted.sh/requests.php*_buh*
// @grant GM_openInTab
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/195861
// @downloadURL https://update.greasyfork.org/scripts/564017/Bandcamp%20upload%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/564017/Bandcamp%20upload%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use a unique URL parameter to know when to insert into upload.php
    var urlIdentifier = '_buh';
    var uploadUrl = 'https://redacted.sh/upload.php?' + urlIdentifier + '=true';
    var requestUrl = 'https://redacted.sh/requests.php?action=new&' + urlIdentifier + '=true';

    var trackArtists = new Set();

    // Dynamic button styles - will be updated based on page theme
    var buttonStyles = `
        .buh-container {
            display: flex;
            gap: 8px;
            margin: 12px 0;
            flex-wrap: wrap;
        }
        .buh-button {
            display: inline-block;
            padding: 7px 14px;
            border: 1px solid;
            border-radius: 2px;
            font-size: 13px;
            font-weight: normal;
            text-decoration: none;
            cursor: pointer;
            transition: opacity 0.15s ease;
            font-family: inherit;
            line-height: 1.2;
        }
        .buh-button:hover {
            opacity: 0.75;
        }
        .buh-button:active {
            opacity: 0.6;
        }
    `;

    // Get theme colors from the page's Follow button or page styles
    function getThemeColors() {
        // Try to find the Follow button
        var followBtn = document.querySelector('.follow-unfollow button, #follow-unfollow button, .follow-button button');
        
        if (followBtn) {
            var styles = window.getComputedStyle(followBtn);
            return {
                border: styles.borderColor,
                text: styles.color,
                background: styles.backgroundColor
            };
        }
        
        // Fallback: try to get colors from page CSS variables or link colors
        var pageBody = document.body;
        var bodyStyles = window.getComputedStyle(pageBody);
        
        // Try to find any styled link for color reference
        var styledLink = document.querySelector('.tralbumData a, .inline_player a, a.artist-name');
        var linkColor = '#0687f5';
        if (styledLink) {
            linkColor = window.getComputedStyle(styledLink).color;
        }
        
        // Get background - usually the page has a themed background
        var bgColor = bodyStyles.backgroundColor || 'transparent';
        
        return {
            border: linkColor,
            text: linkColor,
            background: bgColor === 'rgba(0, 0, 0, 0)' ? 'transparent' : bgColor
        };
    }

    // Apply theme colors to buttons
    function applyThemeToButtons() {
        var colors = getThemeColors();
        var buttons = document.querySelectorAll('.buh-button');
        
        buttons.forEach(function(btn) {
            btn.style.borderColor = colors.border;
            btn.style.color = colors.text;
            // Use same background as page or transparent
            btn.style.backgroundColor = 'transparent';
        });
    }

    // Generate the description from the Bandcamp description and tracklist
    function yadgTrack(track) {
        return '[b]' + track.num + '[/b]. ' + track.name + ' [i](' + track.duration + ')[/i]';
    }

    function yadg(info) {
        var res = '';

        if (info.desc) {
            res += '[size=4][b]Description[/b][/size]\n\n';
            res += info.desc + '\n\n';
        }

        res += '[size=4][b]Tracklist[/b][/size]\n\n';
        for (var i = 0; i < info.tracks.length; i++) {
            res += yadgTrack(info.tracks[i]) + '\n';
        }
        res += '\n';

        res += 'More information: [url]' + info.url.split('?')[0] + '[/url]';

        return res;
    }

    // Format tag for RED: lowercase, spaces/hyphens to dots
    function redifyTag(tag) {
        return tag.trim().toLowerCase().split(/[\s-]+/g).join('.');
    }

    // Format all tags and set them directly
    function formatAndSetTags(tags) {
        var formattedTags = tags.map(redifyTag).join(',');
        $('#tags').val(formattedTags);
    }

    // Parse duration from ISO 8601 format
    function parseDuration(isoDuration) {
        // Handle missing duration (pre-orders, etc.)
        if (!isoDuration) {
            return '?:??';
        }
        
        // Handle PT format: PT3M40S, PT1H2M30S, etc.
        var match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
            var hours = parseInt(match[1]) || 0;
            var minutes = parseInt(match[2]) || 0;
            var seconds = parseInt(match[3]) || 0;
            
            if (hours > 0) {
                return hours + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
            }
            return minutes + ':' + String(seconds).padStart(2, '0');
        }
        // Fallback for old format
        var fallback = isoDuration.replace(/P(\d+)H(\d+)M(\d+)S/g, '$2:$3');
        return fallback || '?:??';
    }

    // Check if track name contains artist (format: "artist - track")
    function parseTrackWithArtist(trackName) {
        // Look for " - " separator (artist - track format)
        var separatorIndex = trackName.indexOf(' - ');
        if (separatorIndex > 0 && separatorIndex < trackName.length - 3) {
            return {
                artist: trackName.substring(0, separatorIndex).trim(),
                name: trackName.substring(separatorIndex + 3).trim()
            };
        }
        return null;
    }

    // Extract info from each track
    function trToTrack(tr, isCompilation) {
        // Handle missing or malformed track data
        if (!tr || !tr.item) {
            return null;
        }
        
        var tracknum = tr.position || 0;
        var rawName = tr.item.name || 'Unknown Track';
        var displayName = rawName;
        var trackArtist = null;

        // Check if track has its own artist in metadata
        if (tr.item.byArtist && tr.item.byArtist.name) {
            trackArtist = tr.item.byArtist.name;
            displayName = trackArtist + ' - ' + rawName;
        } else if (isCompilation) {
            // Try to parse artist from track name
            var parsed = parseTrackWithArtist(rawName);
            if (parsed) {
                trackArtist = parsed.artist;
                displayName = rawName; // Keep original format
            }
        }

        if (trackArtist) {
            trackArtists.add(trackArtist);
        }

        var duration = parseDuration(tr.item.duration);

        return {
            num: tracknum,
            name: displayName,
            duration: duration,
            artist: trackArtist
        };
    }

    // Process single track page
    function processSingleTrack(metadata) {
        var trackName = metadata.name;
        var duration = parseDuration(metadata.duration);
        
        return [{
            num: 1,
            name: trackName,
            duration: duration,
            artist: null
        }];
    }

    // Determine release type
    function determineReleaseType(trackCount, uniqueArtistCount, mainArtist) {
        // Single: 1 track
        if (trackCount === 1) {
            return 'single';
        }
        
        // Compilation: multiple different artists (more than 2 unique track artists)
        // or main artist is "Various Artists" or similar
        if (uniqueArtistCount > 2) {
            return 'compilation';
        }
        
        if (mainArtist.toLowerCase() === 'various artists' || 
            mainArtist.toLowerCase() === 'various' ||
            mainArtist.toLowerCase() === 'v/a') {
            return 'compilation';
        }
        
        // EP: 2-6 tracks, typically under 30 minutes (but we'll use track count)
        if (trackCount >= 2 && trackCount <= 6) {
            return 'ep';
        }
        
        // Album: 7+ tracks
        return 'album';
    }

    // Get label name from the page
    function getLabelName() {
        // Method 1: Find the "more from [Label]" link (back-to-label-link class)
        // This appears when release is hosted on artist page but belongs to a label
        var btlLink = document.querySelector('a.back-to-label-link');
        if (btlLink) {
            var textSpan = btlLink.querySelector('.back-link-text');
            if (textSpan) {
                var text = textSpan.textContent || textSpan.innerText || '';
                var cleaned = text.replace(/more\s*from\s*/i, '').trim();
                if (cleaned) {
                    return cleaned;
                }
            }
            var fullText = btlLink.textContent || btlLink.innerText || '';
            var match = fullText.replace(/[\s\n]+/g, ' ').match(/more\s*from\s+(.+)/i);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        
        // Method 2: Search for any link with from=btl parameter
        var btlLinks = document.querySelectorAll('a[href*="from=btl"]');
        for (var i = 0; i < btlLinks.length; i++) {
            var link = btlLinks[i];
            var text = (link.textContent || link.innerText || '').replace(/[\s\n]+/g, ' ');
            var match = text.match(/more\s*from\s+(.+)/i);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        
        // Method 3: Check JSON-LD - if publisher differs from byArtist, publisher is the label
        // This handles cases where release is on a label's Bandcamp page
        try {
            var metadataScript = document.querySelector('script[type="application/ld+json"]');
            if (metadataScript) {
                var metadata = JSON.parse(metadataScript.innerText);
                
                // If recordLabel exists, use it (most explicit)
                if (metadata.recordLabel && metadata.recordLabel.name) {
                    return metadata.recordLabel.name;
                }
                
                // If publisher differs from byArtist, publisher is the label
                var publisherName = metadata.publisher && metadata.publisher.name;
                var artistName = metadata.byArtist && metadata.byArtist.name;
                
                if (publisherName && artistName && publisherName !== artistName) {
                    return publisherName;
                }
            }
        } catch (e) {
            // Ignore parsing errors
        }
        
        // Method 4: Check og:site_name meta tag vs artist name
        try {
            var siteName = document.querySelector('meta[property="og:site_name"]');
            var artistElem = document.querySelector('#name-section h3 span a, #name-section h3 a');
            if (siteName && artistElem) {
                var siteNameText = siteName.content || '';
                var artistText = artistElem.textContent || '';
                // If site name differs from artist, site name is the label
                if (siteNameText && artistText && siteNameText.trim().toLowerCase() !== artistText.trim().toLowerCase()) {
                    return siteNameText.trim();
                }
            }
        } catch (e) {
            // Ignore errors
        }
        
        // Return empty - don't guess
        return '';
    }

    // Check if this looks like a label page (compilation indicator)
    function isLikelyLabelPage(mainArtist, trackArtistCount) {
        // If there are multiple track artists and main artist seems like a label
        if (trackArtistCount > 2) {
            return true;
        }
        
        // Common label-like patterns in name
        var labelPatterns = [
            /records$/i,
            /recordings$/i,
            /music$/i,
            /label$/i,
            /collective$/i,
            /radio$/i
        ];
        
        for (var i = 0; i < labelPatterns.length; i++) {
            if (labelPatterns[i].test(mainArtist)) {
                return true;
            }
        }
        
        return false;
    }

    // Get cover art URL from the page
    function getCoverArtUrl() {
        var metadata = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);
        
        // Try to get image from metadata
        if (metadata.image) {
            return metadata.image;
        }
        
        // Fallback: try to find the album art image on the page
        var albumArt = document.querySelector('#tralbumArt img.popupImage');
        if (albumArt && albumArt.src) {
            return albumArt.src;
        }
        
        // Another fallback
        var popupImage = document.querySelector('a.popupImage');
        if (popupImage && popupImage.href) {
            return popupImage.href;
        }
        
        return '';
    }

    function generateInfo(isRequest) {
        try {
            var metadataScript = document.querySelector('script[type="application/ld+json"]');
            if (!metadataScript) {
                alert('BUH Error: Could not find metadata on this page');
                return;
            }
            
            var metadata = JSON.parse(metadataScript.innerText);
            var mainArtist = (metadata.byArtist && metadata.byArtist.name) ? metadata.byArtist.name : '';
            var isTrackPage = location.href.indexOf('/track/') !== -1;
            
            trackArtists.clear();
            
            var tracks = [];
            var isCompilation = false;
            
            // Check if we have track data
            var hasTrackList = !isTrackPage && metadata.track && metadata.track.itemListElement && metadata.track.itemListElement.length > 0;
            
            // First pass: check if this might be a compilation
            if (hasTrackList) {
                // Check tracks for artist separators
                var tracksWithArtists = 0;
                metadata.track.itemListElement.forEach(function(tr) {
                    if (tr && tr.item) {
                        if ((tr.item.byArtist && tr.item.byArtist.name) || parseTrackWithArtist(tr.item.name || '')) {
                            tracksWithArtists++;
                        }
                    }
                });
                
                // If most tracks have artists in their names, it's likely a compilation
                if (tracksWithArtists > metadata.track.itemListElement.length * 0.5) {
                    isCompilation = true;
                }
            }
            
            // Check for Various Artists
            if (mainArtist === 'Various Artists' || mainArtist === 'Various' || mainArtist === 'V/A') {
                isCompilation = true;
            }
            
            if (isTrackPage) {
                tracks = processSingleTrack(metadata);
            } else if (hasTrackList) {
                tracks = metadata.track.itemListElement
                    .map(function(tr) {
                        return trToTrack(tr, isCompilation);
                    })
                    .filter(function(t) {
                        return t !== null;
                    });
            }
            
            // If no tracks found, create a placeholder
            if (tracks.length === 0) {
                tracks = [{
                    num: 1,
                    name: metadata.name || 'Unknown',
                    duration: '?:??',
                    artist: null
                }];
            }
            
            var description = metadata.description || '';
            var year = '';
            
            // Try to get year from datePublished or dateModified
            var dateStr = metadata.datePublished || metadata.dateModified || '';
            if (dateStr) {
                var yearMatch = dateStr.match(/\d{4}/);
                if (yearMatch) {
                    year = yearMatch[0];
                }
            }
        
            var album = metadata.name || 'Unknown Album';
            var tags = metadata.keywords || [];
            
            // Determine artists array
            var artistArray = [];
            var trackArtistArray = Array.from(trackArtists);
            
            if (isCompilation && trackArtistArray.length > 0) {
                // For compilations, use track artists
                artistArray = trackArtistArray;
            } else {
                artistArray = [mainArtist];
            }
            
            // Get label name
            var labelName = getLabelName();
            
            // For compilations where main artist is the label, use label name
            if (isCompilation && isLikelyLabelPage(mainArtist, trackArtistArray.length)) {
                labelName = mainArtist;
            }
            
            // Determine release type
            var releaseType = determineReleaseType(tracks.length, trackArtistArray.length, mainArtist);
            
            // Get cover art URL
            var coverUrl = getCoverArtUrl();
            
            var info = {
                tracks: tracks,
                desc: description,
                url: window.location.href,
                year: year,
                album: album,
                artist: artistArray,
                tags: tags,
                releaseType: releaseType,
                label: labelName,
                isCompilation: isCompilation,
                coverUrl: coverUrl,
                isRequest: isRequest || false
            };

            saveInfo(info);
            
            if (isRequest) {
                GM_openInTab(requestUrl);
            } else {
                GM_openInTab(uploadUrl);
            }
        } catch (error) {
            console.error('BUH Error:', error);
            alert('BUH Error: ' + error.message + '\n\nThis page might have incomplete data (e.g., pre-order). Check console for details.');
        }
    }

    // Save the info locally to be used on the upload page
    function saveInfo(info) {
        var markup = yadg(info);

        Promise.all([
            GM_setValue('artists', info.artist),
            GM_setValue('album', info.album),
            GM_setValue('year', info.year),
            GM_setValue('desc', markup),
            GM_setValue('tags', JSON.stringify(info.tags)),
            GM_setValue('releaseType', info.releaseType),
            GM_setValue('label', info.label),
            GM_setValue('coverUrl', info.coverUrl),
            GM_setValue('isRequest', info.isRequest)
        ]).then(function() {
            return GM_listValues();
        });
    }

    // Inject button styles
    function injectStyles() {
        if (document.getElementById('buh-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'buh-styles';
        style.textContent = buttonStyles;
        document.head.appendChild(style);
    }

    // On Bandcamp, get info
    function initBandcamp() {
        // Prevent duplicate initialization
        if (document.getElementById('buh-container')) {
            return;
        }
        
        injectStyles();
        
        // Create container for buttons
        var container = document.createElement('div');
        container.id = 'buh-container';
        container.className = 'buh-container';
        
        // Upload button
        var uploadBtn = document.createElement('button');
        uploadBtn.type = 'button';
        uploadBtn.id = 'buh-upload-btn';
        uploadBtn.textContent = 'RED Upload';
        uploadBtn.className = 'buh-button';
        uploadBtn.onclick = function() { generateInfo(false); };
        
        // Request button
        var requestBtn = document.createElement('button');
        requestBtn.type = 'button';
        requestBtn.id = 'buh-request-btn';
        requestBtn.textContent = 'RED Request';
        requestBtn.className = 'buh-button';
        requestBtn.onclick = function() { generateInfo(true); };
        
        container.appendChild(uploadBtn);
        container.appendChild(requestBtn);
        
        // Find the best place to insert the buttons
        var targetContainer = null;
        
        // For albums: insert after the track list
        var trackTable = document.querySelector('#track_table');
        if (trackTable) {
            targetContainer = trackTable.parentElement;
            if (targetContainer) {
                targetContainer.insertBefore(container, trackTable.nextSibling);
                applyThemeToButtons();
                return;
            }
        }
        
        // For single tracks: insert after the track info
        var trackInfo = document.querySelector('.trackView');
        if (trackInfo) {
            trackInfo.appendChild(container);
            applyThemeToButtons();
            return;
        }
        
        // Fallback: insert after the first tralbumData
        var tralbumData = document.querySelector('.tralbumData');
        if (tralbumData) {
            tralbumData.parentElement.insertBefore(container, tralbumData);
            applyThemeToButtons();
            return;
        }
        
        // Last resort: append to body
        document.body.appendChild(container);
        applyThemeToButtons();
    }

    // Get release type dropdown value
    function getReleaseTypeValue(type) {
        // RED release type values (check actual values on the site)
        var typeMap = {
            'album': '1',
            'soundtrack': '3',
            'ep': '5',
            'anthology': '6',
            'compilation': '7',
            'single': '9',
            'live.album': '11',
            'remix': '13',
            'bootleg': '14',
            'interview': '15',
            'mixtape': '16',
            'demo': '17',
            'concert.recording': '18',
            'dj.mix': '19',
            'unknown': '21'
        };
        
        return typeMap[type] || '1';
    }

    // On RED Upload page, insert info
    function initRedacted() {
        Promise.all([
            GM_getValue('year'),
            GM_getValue('artists'),
            GM_getValue('album'),
            GM_getValue('desc'),
            GM_getValue('tags'),
            GM_getValue('releaseType'),
            GM_getValue('label'),
            GM_getValue('coverUrl')
        ]).then(function(vals) {
            var year = vals[0];
            var artists = vals[1];
            var album = vals[2];
            var desc = vals[3];
            var tags = vals[4];
            var releaseType = vals[5];
            var label = vals[6];
            var coverUrl = vals[7];
            
            // Set year (initial year)
            if (year) {
                $('#year').prop('value', year);
            }
            
            // Set edition year (same as initial year for Bandcamp releases)
            if (year) {
                $('#remaster_year').prop('value', year);
            }
            
            // Set artists
            if (artists && artists.length > 0) {
                $('#artist').prop('value', artists.pop());
                
                for (var i = 1; i <= artists.length; i++) {
                    if (typeof AddArtistField === 'function') {
                        AddArtistField();
                    }
                    $('#artist_' + i).prop('value', artists[i - 1]);
                }
            }
            
            // Set album title
            if (album) {
                $('#title').prop('value', album);
            }
            
            // Set description
            if (desc) {
                $('#album_desc').prop('value', desc);
            }
            
            // Set release type
            if (releaseType) {
                var releaseTypeVal = getReleaseTypeValue(releaseType);
                $('#releasetype').val(releaseTypeVal);
            } else {
                // Default to Album
                $('#releasetype > option:nth-child(2)').prop('selected', true);
            }
            
            // Set record label
            if (label) {
                $('#remaster_record_label, #record_label').prop('value', label);
            }
            
            // Set cover image URL
            if (coverUrl) {
                $('#image').prop('value', coverUrl);
            }
            
            // Set tags - format and insert all of them
            if (tags) {
                var parsedTags = JSON.parse(tags);
                formatAndSetTags(parsedTags);
            }
            
            // Set format defaults
            $('#format').val('FLAC');
            $('#bitrate').val('Lossless');
            $('#media').val('WEB');
        });
    }

    // On RED Request page, insert info
    function initRequest() {
        Promise.all([
            GM_getValue('year'),
            GM_getValue('artists'),
            GM_getValue('album'),
            GM_getValue('desc'),
            GM_getValue('tags'),
            GM_getValue('releaseType'),
            GM_getValue('label'),
            GM_getValue('coverUrl')
        ]).then(function(vals) {
            var year = vals[0];
            var artists = vals[1];
            var album = vals[2];
            var desc = vals[3];
            var tags = vals[4];
            var releaseType = vals[5];
            var label = vals[6];
            var coverUrl = vals[7];
            
            // Set artists
            if (artists && artists.length > 0) {
                // Request page artist field - may have different ID
                var artistField = $('#artist, input[name="artists[]"]').first();
                if (artistField.length) {
                    artistField.prop('value', artists.pop());
                }
                
                // Add additional artists if available
                for (var i = 1; i <= artists.length; i++) {
                    if (typeof AddArtistField === 'function') {
                        AddArtistField();
                    }
                    $('#artist_' + i + ', input[name="artists[]"]').eq(i).prop('value', artists[i - 1]);
                }
            }
            
            // Set title
            if (album) {
                $('#title, input[name="title"]').first().prop('value', album);
            }
            
            // Set record label
            if (label) {
                $('#recordlabel, input[name="recordlabel"]').first().prop('value', label);
            }
            
            // Set year
            if (year) {
                $('#year, input[name="year"]').first().prop('value', year);
            }
            
            // Set cover image URL
            if (coverUrl) {
                $('#image, input[name="image"]').first().prop('value', coverUrl);
            }
            
            // Set tags - format and insert all of them
            if (tags) {
                var parsedTags = JSON.parse(tags);
                var formattedTags = parsedTags.map(redifyTag).join(',');
                $('#tags, input[name="tags"]').first().val(formattedTags);
            }
            
            // Set release type
            if (releaseType) {
                var releaseTypeVal = getReleaseTypeValue(releaseType);
                $('#releasetype, select[name="releasetype"]').first().val(releaseTypeVal);
            }
            
            // Set description
            if (desc) {
                $('#description, textarea[name="description"]').first().prop('value', desc);
            }
            
            // Note: Allowed formats, bitrates, and media are left for manual selection
        });
    }

    // Check where the script is running
    function isOnBandcamp() {
        return location.href.indexOf('bandcamp') !== -1;
    }

    function isOnUploadPage() {
        return location.href.indexOf('redacted') !== -1 && 
               location.href.indexOf('upload.php') !== -1 && 
               location.href.indexOf(urlIdentifier) !== -1;
    }

    function isOnRequestPage() {
        return location.href.indexOf('redacted') !== -1 && 
               location.href.indexOf('requests.php') !== -1 && 
               location.href.indexOf(urlIdentifier) !== -1;
    }

    // Execute when page is finished loading
    $(document).ready(function() {
        if (isOnBandcamp()) {
            // Small delay to ensure page is fully rendered
            setTimeout(initBandcamp, 500);
        } else if (isOnUploadPage()) {
            initRedacted();
        } else if (isOnRequestPage()) {
            initRequest();
        }
    });
    
    // Also watch for dynamic page updates (Bandcamp uses some AJAX)
    if (isOnBandcamp()) {
        var observer = new MutationObserver(function(mutations) {
            if (!document.getElementById('buh-container')) {
                initBandcamp();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();