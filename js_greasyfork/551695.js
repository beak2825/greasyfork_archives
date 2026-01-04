// ==UserScript==
// @name         AniList Integration
// @author       Mitsuki Haruko
// @namespace    AnimeBytes Nightly
// @version      1.0
// @description  AniList Integration seamlessly adds a direct link to the anime or manga’s AniList page in the links section and displays a "Next Episode Airing in" timer for ongoing series, pulled from AniList’s GraphQL API. With smart matching based on release year and format (e.g., TV, OVA, Movie), it ensures accurate results for both anime and manga Part of the AnimeBytes Nightly userscript collection, this script enhances your browsing experience with minimal setup and robust error handling.
// @grant        GM_xmlhttpRequest
// @match        https://animebytes.tv/torrents.php*
// @icon         http://animebytes.tv/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551695/AniList%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/551695/AniList%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findSeriesElements(callback) {
        const h2Element = document.querySelector('#content div.thin h2');
        const h3Element = document.querySelector('#content div.thin h3');
        if (!h2Element || !h3Element) {
            console.log('AniList: Missing H2 or H3 elements. H2:', !!h2Element, 'H3:', !!h3Element);
            return false;
        }
        callback(h2Element, h3Element);
        return true;
    }

    function runWhenReady() {
        if (findSeriesElements(startScript)) {
            return;
        }
        let attempts = 0;
        const maxAttempts = 40; // 40 * 50ms = 2 seconds
        const interval = setInterval(() => {
            attempts++;
            if (findSeriesElements(startScript)) {
                clearInterval(interval);
            } else if (attempts >= maxAttempts) {
                console.error('AniList: Failed to find series elements after 2s. H2:', !!document.querySelector('#content div.thin h2'), 'H3:', !!document.querySelector('#content div.thin h3'), 'DOM snippet:', document.querySelector('#content')?.innerHTML.substring(0, 500));
                clearInterval(interval);
            }
        }, 50);
    }

    function insertAfter(newNode, refNode) {
        if (refNode && refNode.parentNode) {
            refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
        } else {
            console.error('AniList: Invalid refNode for insertAfter:', refNode);
        }
    }

    function startScript(h2Element, h3Element) {
        // Extract series title, type, and year
        const h2HTML = h2Element.innerHTML;
        const match = h2HTML.match(/>(.*?)<\/a>\s*-\s*(.*?)\s*\[(\d{4})\]/);
        let seriesTitle = '';
        let typeText = '';
        let releaseYear = null;

        if (match) {
            seriesTitle = match[1].trim();
            typeText = match[2].trim();
            releaseYear = parseInt(match[3], 10);
        } else {
            // Fallback extraction
            const seriesNameElement = h2Element.querySelector('a');
            seriesTitle = seriesNameElement ? seriesNameElement.textContent.trim() : h2Element.textContent.trim();
            const yearMatch = h2Element.textContent.match(/\[(\d{4})\]/);
            releaseYear = yearMatch ? parseInt(yearMatch[1], 10) : null;
        }

        console.log('AniList: Started for series:', seriesTitle, 'Type:', typeText, 'Year:', releaseYear);

        // Determine mediaType and format
        let mediaType = 'ANIME';
        let format = null;
        const printedMedia = ["Manga", "Oneshot", "Manhwa", "Manhua", "Light Novel", "Anthology"];
        const animeFormats = {
            'TV': 'TV',
            'OVA': 'OVA',
            'Movie': 'MOVIE',
            'Special': 'SPECIAL',
            'ONA': 'ONA'
        };
        if (printedMedia.includes(typeText)) {
            mediaType = 'MANGA';
        } else if (typeText in animeFormats) {
            format = animeFormats[typeText];
            console.log('AniList: Detected anime format:', format);
        }

        // Set searchTitle, prefer Romaji for manga
        let searchTitle = seriesTitle;
        let shortTitle = seriesTitle.split(':')[0].trim(); // Base title for API and fallback
        if (mediaType === 'MANGA') {
            const mangaStats = document.getElementsByClassName("stats nobullet")[0];
            if (mangaStats) {
                const romajiMatch = mangaStats.innerHTML.match(/Romaji Title:<\/strong>\s*<br>\s*(.*?)\s*<\/li>/i);
                if (romajiMatch && romajiMatch[1].trim()) {
                    searchTitle = romajiMatch[1].trim();
                    shortTitle = searchTitle.split(':')[0].trim(); // Update short title with Romaji base
                    console.log('AniList: Using Romaji title for manga:', searchTitle, 'Short title:', shortTitle);
                } else {
                    console.log('AniList: No Romaji title found, using series title:', searchTitle, 'Short title:', shortTitle);
                }
            } else {
                console.log('AniList: No manga stats section found, using series title:', searchTitle, 'Short title:', shortTitle);
            }
        }

        function fetchAniListData(searchTitle, shortTitle, mediaType, releaseYear, format, retryCount = 2, useShortTitle = true) {
            let queryTitle = useShortTitle ? shortTitle : searchTitle;
            const cleanSeriesName = queryTitle
                .replace(/\[.*?\]|\(.*?\)/g, '') // Remove brackets and parentheses
                .replace(/[^a-zA-Z0-9\s:]/g, '') // Remove special characters
                .trim();

            console.log('AniList: Cleaned search title:', cleanSeriesName, 'Media type:', mediaType, 'Format:', format, 'Using short title:', useShortTitle);

            const query = `
                query ($search: String, $type: MediaType, $format: MediaFormat) {
                    Page(perPage: 15) {
                        media(search: $search, type: $type, format: $format) {
                            id
                            title { romaji english }
                            startDate { year }
                            format
                            nextAiringEpisode {
                                airingAt
                                timeUntilAiring
                                episode
                            }
                            status
                        }
                    }
                }
            `;
            const variables = { search: cleanSeriesName, type: mediaType, ...(format && { format }) };
            const url = 'https://graphql.anilist.co';

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: JSON.stringify({ query, variables }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                onload: function (response) {
                    console.log('AniList: API response status:', response.status);
                    if (response.status !== 200) {
                        if (retryCount > 0) {
                            console.log('AniList: Retrying API request, attempts left:', retryCount);
                            setTimeout(() => fetchAniListData(searchTitle, shortTitle, mediaType, releaseYear, format, retryCount - 1, useShortTitle), 1000);
                            return;
                        }
                        console.error('AniList: API request failed after retries:', response.status);
                        appendFallbackLink(shortTitle, mediaType, h3Element);
                        appendAiringInfo('', h2Element);
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        const mediaList = data.data?.Page?.media || [];

                        console.log('AniList: Media results count:', mediaList.length);
                        console.log('AniList: Media titles:', mediaList.map(m => ({ title: m.title.romaji, format: m.format })));

                        if (mediaList.length === 0) {
                            if (useShortTitle && retryCount > 0) {
                                console.log('AniList: No results with short title, trying full title');
                                fetchAniListData(searchTitle, shortTitle, mediaType, releaseYear, format, retryCount - 1, false);
                                return;
                            }
                            console.log('AniList: No media found for:', cleanSeriesName);
                            appendFallbackLink(shortTitle, mediaType, h3Element);
                            appendAiringInfo('', h2Element);
                            return;
                        }

                        let chosenMedia = null;
                        if (releaseYear && format) {
                            chosenMedia = mediaList.find(m => m.startDate?.year === releaseYear && m.format === format);
                            console.log('AniList: Year and format match attempted, found:', chosenMedia ? `${chosenMedia.title.romaji} (${chosenMedia.format})` : 'none');
                        }
                        if (!chosenMedia && releaseYear) {
                            chosenMedia = mediaList.find(m => m.startDate?.year === releaseYear);
                            console.log('AniList: Year match attempted, found:', chosenMedia ? `${chosenMedia.title.romaji} (${chosenMedia.format})` : 'none');
                        }
                        if (!chosenMedia) {
                            chosenMedia = mediaList.find(m => m.status === 'RELEASING' || m.status === 'NOT_YET_RELEASED');
                            console.log('AniList: Status match attempted, found:', chosenMedia ? `${chosenMedia.title.romaji} (${chosenMedia.format})` : 'none');
                        }
                        if (!chosenMedia) {
                            chosenMedia = mediaList[0];
                            console.log('AniList: Fallback to first result:', chosenMedia.title.romaji, `(${chosenMedia.format})`);
                        }

                        console.log('AniList: Chosen media:', chosenMedia.title.romaji, 'ID:', chosenMedia.id, 'Format:', chosenMedia.format);

                        const status = chosenMedia.status;
                        const nextAiring = chosenMedia.nextAiringEpisode;
                        console.log('AniList: Media status:', status);
                        console.log('AniList: Next airing data:', nextAiring ? { episode: nextAiring.episode, airingAt: nextAiring.airingAt, timeUntilAiring: nextAiring.timeUntilAiring } : 'null');

                        let airingText = '';

                        if (status === 'FINISHED') {
                            console.log('AniList: Status is FINISHED, no airing info');
                            airingText = '';
                        } else if (status === 'RELEASING' && nextAiring?.timeUntilAiring) {
                            console.log('AniList: Using RELEASING timeUntilAiring:', nextAiring.timeUntilAiring, 'seconds');
                            airingText = formatTimeUntil(nextAiring.timeUntilAiring, false, mediaType);
                        } else if (status === 'NOT_YET_RELEASED' && nextAiring?.airingAt) {
                            console.log('AniList: Using NOT_YET_RELEASED airingAt:', nextAiring.airingAt);
                            const now = Math.floor(Date.now() / 1000);
                            const secondsUntil = nextAiring.airingAt - now;
                            console.log('AniList: Calculated seconds until:', secondsUntil);
                            airingText = formatTimeUntil(secondsUntil, true, mediaType);
                        } else {
                            console.log('AniList: No valid airing data - status:', status, 'nextAiring:', !!nextAiring, 'timeUntilAiring:', nextAiring?.timeUntilAiring);
                        }

                        console.log('AniList: Computed airing text:', airingText || 'empty');

                        if (airingText) {
                            appendAiringInfo(airingText, h2Element);
                        } else {
                            console.log('AniList: Skipping airing info append (empty text)');
                        }
                        appendAniListButton(chosenMedia.id, h3Element, mediaType);
                    } catch (e) {
                        console.error('AniList: Error parsing response:', e);
                        appendFallbackLink(shortTitle, mediaType, h3Element);
                        appendAiringInfo('', h2Element);
                    }
                },
                onerror: function () {
                    console.error('AniList: API request error');
                    if (retryCount > 0) {
                        console.log('AniList: Retrying API request, attempts left:', retryCount);
                        setTimeout(() => fetchAniListData(searchTitle, shortTitle, mediaType, releaseYear, format, retryCount - 1, useShortTitle), 1000);
                    } else {
                        console.error('AniList: API request failed after retries');
                        appendFallbackLink(shortTitle, mediaType, h3Element);
                        appendAiringInfo('', h2Element);
                    }
                }
            });
        }

        function formatTimeUntil(seconds, isAiring = false, mediaType) {
            console.log('AniList: Formatting time until:', seconds, 'seconds, isAiring:', isAiring);
            const diffTime = seconds * 1000;
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

            let parts = [];
            if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
            if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
            if (minutes > 0 || parts.length === 0) {
                parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
            }

            const prefix = isAiring ? 'Airing in ' : (mediaType === 'ANIME' ? 'Next ep in ' : 'Next ch in ');
            const formatted = prefix + parts.join(' ');
            console.log('AniList: Formatted airing text:', formatted);
            return formatted;
        }

        function appendAiringInfo(text, h2Element) {
            if (!text) {
                console.log('AniList: appendAiringInfo called with empty text, skipping');
                return;
            }
            const span = document.createElement('span');
            span.textContent = ' | ' + text;
            span.style.fontWeight = '900';
            span.style.fontSize = '15px';
            h2Element.appendChild(span);
            console.log('AniList: Appended airing info to H2:', text);
        }

        function appendAniListButton(mediaId, h3Element, mediaType) {
            console.log('AniList: H3 content before appending:', h3Element.innerHTML);
            let lastLink = h3Element.querySelectorAll('a');
            lastLink = lastLink[lastLink.length - 1];

            if (!lastLink) {
                console.log('AniList: No links in H3, appending directly to H3');
                const separator = document.createTextNode(' | ');
                const link = document.createElement('a');
                link.href = `https://anilist.co/${mediaType.toLowerCase()}/${mediaId}`;
                link.textContent = 'AniList';
                link.target = '_blank';
                h3Element.appendChild(separator);
                h3Element.appendChild(link);
                console.log('AniList: Appended link directly to H3:', link.href);
                return;
            }

            console.log('AniList: Appending link after last anchor:', lastLink.outerHTML);

            const separator = document.createTextNode(' | ');
            const link = document.createElement('a');
            link.href = `https://anilist.co/${mediaType.toLowerCase()}/${mediaId}`;
            link.textContent = 'AniList';
            link.target = '_blank';

            insertAfter(separator, lastLink);
            insertAfter(link, separator);
            console.log('AniList: Appended link:', link.href);
        }

        function appendFallbackLink(shortTitle, mediaType, h3Element) {
            console.log('AniList: H3 content before appending fallback:', h3Element.innerHTML);
            let lastLink = h3Element.querySelectorAll('a');
            lastLink = lastLink[lastLink.length - 1];

            const cleanSearch = encodeURIComponent(shortTitle.toLowerCase());
            const searchUrl = `https://anilist.co/search/${mediaType.toLowerCase()}?search=${cleanSearch}`;
            console.log('AniList: Using fallback search URL:', searchUrl);

            if (!lastLink) {
                console.log('AniList: No links in H3 for fallback, appending directly to H3');
                const separator = document.createTextNode(' | ');
                const link = document.createElement('a');
                link.href = searchUrl;
                link.textContent = 'AniList Search';
                link.target = '_blank';
                h3Element.appendChild(separator);
                h3Element.appendChild(link);
                console.log('AniList: Appended fallback link directly to H3:', link.href);
                return;
            }

            const separator = document.createTextNode(' | ');
            const link = document.createElement('a');
            link.href = searchUrl;
            link.textContent = 'AniList Search';
            link.target = '_blank';

            insertAfter(separator, lastLink);
            insertAfter(link, separator);
            console.log('AniList: Appended fallback link:', link.href);
        }

        fetchAniListData(searchTitle, shortTitle, mediaType, releaseYear, format);
    }

    runWhenReady();
})();