// ==UserScript==
// @name         Import Bugs.co.kr releases to MusicBrainz
// @version      2025.10.30
// @description  Add button to Bugs.co.kr album pages to import releases to MusicBrainz
// @namespace    http://tampermonkey.net/
// @author       peepincreepin
// @match        http*://music.bugs.co.kr/album/*
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/554244/Import%20Bugscokr%20releases%20to%20MusicBrainz.user.js
// @updateURL https://update.greasyfork.org/scripts/554244/Import%20Bugscokr%20releases%20to%20MusicBrainz.meta.js
// ==/UserScript==

// Run the script once the page is loaded
(function() {

    function addButton() {

        'use strict';

        // Get Release URL
        const bugsUrlRegexPattern = /https?:\/\/music\.bugs\.co\.kr\/album\/\d+/g;
        const bugsReleaseUrl = window.location.href.match(bugsUrlRegexPattern)[0];

        // Extract Bugs release object
        let release = fnCreateReleaseObj(bugsReleaseUrl);

        // Form parameters
        const parameters = fnBuildFormParameters(release, `Imported from ${bugsReleaseUrl}`);

        // Build form button
        let btn = document.createElement('button');
        btn.innerHTML = `<div id="mb_button_gm">${fnBuildFormHTML(parameters)}</div>`;

        // Positions the button in a specific place
        let positionEl = document.querySelector('header.sectionPadding.pgTitle.noneLNB > div > h1')
        if (positionEl) {
           positionEl.after(btn);
        } else {
        document.body.appendChild(btn);
        }
    }

    // Add styling for the button
    GM_addStyle(`
    #mb_button_gm {
        z-index: 9999;
        padding: 10px 15px;
        background-color: #FF3B30; /* Bugs.co.kr brand color */
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        height: 10px;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: background-color 0.2s, transform 0.2s;
    }
    #mb_button_gm:hover {
        background-color: #E0302A;
        transform: translateY(-2px);
    }
    `);

    //////////////////////////////////
    // Create the MB release object
    /////////////////////////////////
    function fnCreateReleaseObj(url_address) {
        let mbReleaseObj = {
            // Set release status to official
            status: 'official',
            // Set release packaging to none since it is a digital release
            packaging: 'none',
            artist_credit: [],
            labels: [],
            discs: []
        };

        // Get Release Title
        let titleEl = document.querySelector('header.sectionPadding.pgTitle.noneLNB > div.innerContainer > h1');
        mbReleaseObj.title = titleEl ? titleEl.textContent.trim() : 'Unknown';
        mbReleaseObj.urls = [
            {url: url_address, link_type: 74 }, //purchase for download
            {url: url_address, link_type: 980 } //streaming
        ];

        // Get Album Summary Info
        let releaseInfoEl = document.querySelector('section.sectionPadding.summaryInfo.summaryAlbum > div.innerContainer > div.basicInfo > table.info > tbody');

        for (const tblrowEl of releaseInfoEl.querySelectorAll('tr')) {
            let tblrowtypeEl = tblrowEl.querySelector('th')

            // Release Artist
            if (tblrowtypeEl.textContent.trim() == '아티스트') {
                let artistsArr = tblrowEl.querySelectorAll('td > a').length > 0 ? tblrowEl.querySelectorAll('td > a') : tblrowEl.querySelectorAll('td');
                artistsArr.forEach( function (artistEl, artistIndex){
                    let ac = {
                        artist_name: artistEl.textContent.trim(),
                        credited_name: artistEl.textContent.trim(),
                        joinphrase: fnCalculateSeparator(artistIndex + 1, artistsArr.length),
                        //mbid: MBIDfromUrl(artist.resource_url, 'artist'),
                    }
                    mbReleaseObj.artist_credit.push(ac);
                });
            }

            // Release Type
            else if (tblrowtypeEl.textContent.trim() == '유형') {
                let release_type = tblrowEl.querySelector('td').textContent.trim();
                if (release_type == '컴필레이션') {
                    mbReleaseObj.secondary_types = ['compilation'];
                }
                if (release_type == 'OST') {
                    mbReleaseObj.secondary_types = ['soundtrack'];
                }
                if (release_type == '정규') {
                    mbReleaseObj.type = 'album';
                }
                if (release_type == '싱글') {
                    mbReleaseObj.type = 'single';
                }
                if (release_type == 'EP(미니)') {
                    mbReleaseObj.type = 'ep';
                }
            }

            // Release Date
            else if (tblrowtypeEl.textContent.trim() == '발매일') {
                let release_date = tblrowEl.querySelector('td > time').getAttribute('datetime').trim().split('.');
                mbReleaseObj.year = parseInt(release_date[0], 10);
                mbReleaseObj.month = parseInt(release_date[1], 10);
                mbReleaseObj.day = parseInt(release_date[2], 10);
            }
            // Labels
            else if (['유통사', '기획사'].includes(tblrowtypeEl.textContent.trim())) {
                let label = {
                    name: tblrowEl.querySelector('td').textContent.trim(),
                };
                mbReleaseObj.labels.push(label);
            }
        }

        // Get discs (mediums)
        let mediumList = document.querySelectorAll('table.list.trackList.byAlbum > tbody');
        mediumList.forEach(mediumEl => {
            let medium = {
                format: 'digital media',
                tracks: [],
            };

            // Get Tracks (수록곡)
            let trackList = mediumEl.querySelectorAll('tr');
            trackList.forEach(trackEl => {
                // Skip rows that are not track info (e.g., "disc 1" headers)
                if (trackEl.classList.contains('cd')) {
                    return;
                }

                var track = {
                    artist_credit: [],
                    duration: '?:??',
                };

                // Get Track Number (번호)
                let indexEl = trackEl.querySelector('td > p.trackIndex');
                track.number = indexEl ? parseInt(indexEl.textContent.trim(), 10) : null;

                // Get Track Name (곡)
                let titleEl = trackEl.querySelector('th > p.title > a');
                track.title = titleEl ? titleEl.getAttribute('title').trim() : 'Unknown';

                // Get Track Artists (아티스트)
                let track_artists = [];
                // Get main artist
                let mainartistEl = trackEl.querySelector('td.left > p.artist > a');
                let artist = mainartistEl ? mainartistEl.getAttribute('title').trim() : 'Unknown';
                track_artists.push(artist);

                // Get additional artists, if they exist
                let multiartistEl = trackEl.querySelector('td.left > p.artist > a.more');
                let multiartistStr = multiartistEl ? multiartistEl.getAttribute('onclick').replaceAll("\\\\n", "") : 'Unknown';
                if (multiartistStr !== 'Unknown') {
                    let multiartistArr = multiartistStr.match(/(?<=\|\|OK)[^\|]+(?=\|\|)/g);
                    multiartistArr.forEach(artist=> {
                        track_artists.push(artist);
                    })
                };

                track_artists.forEach( function (artistName, artistIndex){
                    let ac = {
                        artist_name: artistName,
                        credited_name: artistName,
                        joinphrase: fnCalculateSeparator(artistIndex + 1, track_artists.length),
                        //mbid: MBIDfromUrl(artist.resource_url, 'artist'),
                    }
                    track.artist_credit.push(ac);
                });

                // Get Track Duration (Track length) // Can't get it to work
                // let trackinfoEl = trackEl.querySelector('td > a.trackInfo');
                // let popup = window.open(trackinfoEl.getAttribute('href'), '_blank');
                // popup.onload = (ev) => {
                //     let lengthEl = popup.document.querySelector('table.info > tbody > tr > td > time');
                //     track.duration = lengthEl ? lengthEl.getAttribute('datetime').trim() : '??:??';
                //     setTimeout(()=>{
                //         popup.close();
                //     }, 2500)
                // };
                // let lengthEl = popup.document.querySelector('table.info > tbody > tr > td > time');
                // track.length = lengthEl ? lengthEl.getAttribute('datetime').trim() : '??:??';

                // Add the track object to our array if it's a valid track
                if (track.name !== 'Unknown' && track.index !== null) {
                    medium.tracks.push(track);
                };
            });

            mbReleaseObj.discs.push(medium);

        });

        return mbReleaseObj;
    }

    ///////////////////////////////////
    // Calculate artist separator
    ///////////////////////////////////
    function fnCalculateSeparator(artistIndex, artistCount) {
        if (artistIndex == artistCount){
            return '';
        } else if (artistIndex == artistCount - 1){
            return ' & ';
        } else {
            return ', ';
        }
    }

    // Append parameters
    function fnAppendParameter(parameters, paramName, paramValue) {
        if (!paramValue) return;
        parameters.push({ name: paramName, value: paramValue });
    }

    // build form POST parameters that MB is waiting
    function fnBuildFormParameters(release, edit_note) {
        // Form parameters
        let parameters = new Array();
        fnAppendParameter(parameters, 'name', release.title);

        // Release Artist credits
        fnBuildArtistCreditsFormParameters(parameters, '', release.artist_credit);

        if (release['secondary_types']) {
            for (let i = 0; i < release.secondary_types.length; i++) {
                fnAppendParameter(parameters, 'type', release.secondary_types[i]);
            }
        }
        fnAppendParameter(parameters, 'status', release.status);
        fnAppendParameter(parameters, 'language', release.language);
        fnAppendParameter(parameters, 'script', release.script);
        fnAppendParameter(parameters, 'packaging', release.packaging);

        // ReleaseGroup
        fnAppendParameter(parameters, 'release_group', release.release_group_mbid);

        // Date + country
        fnAppendParameter(parameters, 'country', release.country);
        if (!isNaN(release.year) && release.year != 0) {
            fnAppendParameter(parameters, 'date.year', release.year);
        }
        if (!isNaN(release.month) && release.month != 0) {
            fnAppendParameter(parameters, 'date.month', release.month);
        }
        if (!isNaN(release.day) && release.day != 0) {
            fnAppendParameter(parameters, 'date.day', release.day);
        }

        // Barcode
        fnAppendParameter(parameters, 'barcode', release.barcode);

        // Disambiguation comment
        fnAppendParameter(parameters, 'comment', release.comment);

        // Annotation
        fnAppendParameter(parameters, 'annotation', release.annotation);

        // Label + catnos
        if (Array.isArray(release.labels)) {
            for (let i = 0; i < release.labels.length; i++) {
                let label = release.labels[i];
                fnAppendParameter(parameters, `labels.${i}.name`, label.name);
                fnAppendParameter(parameters, `labels.${i}.mbid`, label.mbid);
                if (label.catno != 'none') {
                    fnAppendParameter(parameters, `labels.${i}.catalog_number`, label.catno);
                }
            }
        }

        // URLs
        if (Array.isArray(release.urls)) {
            for (let i = 0; i < release.urls.length; i++) {
                let url = release.urls[i];
                fnAppendParameter(parameters, `urls.${i}.url`, url.url);
                fnAppendParameter(parameters, `urls.${i}.link_type`, url.link_type);
            }
        }

        // Mediums
        let total_tracks = 0;
        let total_tracks_with_duration = 0;
        let total_duration = 0;
        for (let i = 0; i < release.discs.length; i++) {
            let disc = release.discs[i];
            fnAppendParameter(parameters, `mediums.${i}.format`, disc.format);
            fnAppendParameter(parameters, `mediums.${i}.name`, disc.title);

            // Tracks
            for (let j = 0; j < disc.tracks.length; j++) {
                let track = disc.tracks[j];
                total_tracks++;
                fnAppendParameter(parameters, `mediums.${i}.track.${j}.number`, track.number);
                fnAppendParameter(parameters, `mediums.${i}.track.${j}.name`, track.title);
                let tracklength = '?:??';
                fnAppendParameter(parameters, `mediums.${i}.track.${j}.length`, tracklength);
                fnAppendParameter(parameters, `mediums.${i}.track.${j}.recording`, track.recording);
                fnBuildArtistCreditsFormParameters(parameters, `mediums.${i}.track.${j}.`, track.artist_credit);
            }
        }

        // Guess release type if not given
        if (!release.type) {
            release.type = 'album';
        }
        fnAppendParameter(parameters, 'type', release.type);

        // Add Edit note parameter
        fnAppendParameter(parameters, 'edit_note', edit_note);

        return parameters;
    }

    function fnBuildArtistCreditsFormParameters(parameters, paramPrefix, artist_credit) {
        if (!artist_credit) return;
        for (let i = 0; i < artist_credit.length; i++) {
            let ac = artist_credit[i];
            fnAppendParameter(parameters, `${paramPrefix}artist_credit.names.${i}.name`, ac.credited_name);
            fnAppendParameter(parameters, `${paramPrefix}artist_credit.names.${i}.artist.name`, ac.artist_name);
            fnAppendParameter(parameters, `${paramPrefix}artist_credit.names.${i}.mbid`, ac.mbid);
            if (typeof ac.joinphrase != 'undefined' && ac.joinphrase != '') {
                fnAppendParameter(parameters, `${paramPrefix}artist_credit.names.${i}.join_phrase`, ac.joinphrase);
            }
        }
    }

    // compute HTML of import form
    function fnBuildFormHTML(parameters) {
        // Build form
        let innerHTML = `<form class="musicbrainz_import musicbrainz_import_add" action="https://musicbrainz.org/release/add" method="post" target="_blank" accept-charset="UTF-8" charset="${document.characterSet}">`;
        parameters.forEach(function (parameter) {
            let value = `${parameter.value}`;
            innerHTML += `<input type='hidden' value='${value.replace(/'/g, '&apos;')}' name='${parameter.name}'/>`;
        });

        innerHTML +=
            '<button type="submit" title="Import this release into MusicBrainz (open a new tab)"><img src="https://raw.githubusercontent.com/metabrainz/design-system/master/brand/logos/MusicBrainz/SVG/MusicBrainz_logo_icon.svg" width="16" height="16" />Import to MusicBrainz</button>';
        innerHTML += '</form>';

        return innerHTML;
    }

    // Run the script once the page is loaded
    window.addEventListener('load', addButton);

})();