// ==UserScript==
// @name              YT絕對時間
// @version           0.4.5
// @description       Show full upload dates in DD/MM/YYYY HH:MMam/pm format
// @author            Ignacio Albiol
// @namespace         https://greasyfork.org/en/users/1304094
// @match             https://www.youtube.com/*
// @icon      https://www.youtube.com/favicon.ico
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/555288/YT%E7%B5%95%E5%B0%8D%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/555288/YT%E7%B5%95%E5%B0%8D%E6%99%82%E9%96%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUploadDate() {
        let el = document.body.querySelector('player-microformat-renderer script');
        if (el) {
            let parts = el.textContent.split('"startDate":"',2);
            if (parts.length == 2) {
                return parts[1].split('"',1)[0];
            }
            parts = el.textContent.split('"uploadDate":"',2);
            if (parts.length == 2) {
                return parts[1].split('"',1)[0];
            }
        }
        return null;
    }

    function getIsLiveBroadcast() {
        let el = document.body.querySelector('player-microformat-renderer script');
        if (!el) {
            return null;
        }

        let parts = el.textContent.split('"isLiveBroadcast":',2);
        if (parts.length != 2) {
            return false;
        }

        let isLiveBroadcast = !!parts[1].split(',',1)[0];
        if (!isLiveBroadcast) {
            return false;
        }

        parts = el.textContent.split('"endDate":"',2);
        if (parts.length == 2) {
            return false;
        }

        return true;
    }

    function urlToVideoId(url) {
        let parts = url.split('/shorts/',2);
        if (parts.length === 2) {
            url = parts[1];
        } else {
            url = parts[0];
        }

        parts = url.split('v=',2);
        if (parts.length === 2) {
            url = parts[1];
        } else {
            url = parts[0];
        }

        return url.split('&',1)[0];
    }

    function getRemoteUploadDate(videoId, callback) {
        let body = {"context":{"client":{"clientName":"WEB","clientVersion":"2.20240416.01.00"}},"videoId":videoId};

        fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {
            let object = data.microformat.playerMicroformatRenderer;

            if (object.liveBroadcastDetails?.isLiveNow) {
                callback(object.liveBroadcastDetails.startTimestamp);
                return;
            } else if (object.publishDate) {
                callback(object.publishDate);
                return;
            }

            callback(object.uploadDate);
        })
            .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function isoToDate(iso) {
        let date = new Date(iso);

        // Format date components
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();

        // Format time components
        let hours = date.getHours();
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let ampm = hours >= 12 ? 'pm' : 'am';

        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12

        // Combine all components
        return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
    }

    function startTimers() {
        /* video page description */
        setInterval(() => {
            let uploadDate = getUploadDate();
            if (!uploadDate) {
                return;
            }

            uploadDate = isoToDate(uploadDate);
            let isLiveBroadcast = getIsLiveBroadcast();

            if (isLiveBroadcast) {
                document.body.classList.add('ytud-description-live');
            } else {
                document.body.classList.remove('ytud-description-live');
            }

            let el = document.querySelector('#info-container > #info > b');
            if (!el) {
                let span = document.querySelector('#info-container > #info > span:nth-child(1)');
                if (!span) {
                    return;
                }
                el = document.createElement('b');
                el.textContent = uploadDate;
                span.insertAdjacentElement('afterend', el);
            } else {
                if (el.parentNode.children[1] !== el) {
                    let container = el.parentNode;
                    el = container.removeChild(el);
                    container.children[0].insertAdjacentElement('afterend', el);
                }
                if (el.firstChild.nodeValue === uploadDate) {
                    return;
                }
                el.firstChild.nodeValue = uploadDate;
            }
        }, 1000);

        /* video page sidebar list */
        setInterval(() => {
            let vids = document.querySelectorAll('#items.ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');

                let holder;
                if (holders.length === 1) {
                    let copy = document.createElement('span');
                    copy.className = 'inline-metadata-item style-scope ytd-video-meta-block';
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[0].insertAdjacentElement('afterend', copy);
                    holder = copy;
                } else {
                    holder = holders[1];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text == dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.querySelector('a#thumbnail').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* homepage list - videos */
        setInterval(() => {
            let vids = document.querySelectorAll('#content > ytd-rich-grid-media > #dismissible > #details > #meta > ytd-video-meta-block > #metadata');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');
                if (holders.length === 0) {
                    return;
                }

                let holder;
                if (holders.length === 1) {
                    let copy = document.createElement('span');
                    copy.className = 'inline-metadata-item style-scope ytd-video-meta-block';
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[0].insertAdjacentElement('afterend', copy);
                    holder = copy;
                } else {
                    holder = holders[1];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#meta').querySelector('h3 > a#video-title-link').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* homepage list - shorts */
        setInterval(() => {
            let vids = document.querySelectorAll('#content > ytd-rich-grid-slim-media > #dismissible > #details > ytd-video-meta-block > #metadata');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');
                if (holders.length === 0) {
                    return;
                }
                let holder;
                if (holders.length === 1) {
                    let copy = document.createElement('span');
                    copy.className = 'inline-metadata-item style-scope ytd-video-meta-block';
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[0].insertAdjacentElement('afterend', copy);
                    holder = copy;
                } else {
                    holder = holders[1];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#details').querySelector('h3 > a').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* search list - videos */
        setInterval(() => {
            let vids = document.querySelectorAll('#contents ytd-video-renderer #metadata');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');
                if (holders.length === 0) {
                    return;
                }
                let holder;
                if (holders.length === 1) {
                    let copy = document.createElement('span');
                    copy.className = 'inline-metadata-item style-scope ytd-video-meta-block';
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[0].insertAdjacentElement('afterend', copy);
                    holder = copy;
                } else {
                    holder = holders[1];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#dismissible').querySelector('a#thumbnail').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* search list - shorts */
        setInterval(() => {
            let vids = document.querySelectorAll('#scroll-container > #items > ytd-reel-item-renderer > #dismissible > #details > ytd-video-meta-block > #metadata');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');
                if (holders.length === 0) {
                    return;
                }
                let holder;
                if (holders.length === 1) {
                    let copy = document.createElement('span');
                    copy.className = 'inline-metadata-item style-scope ytd-video-meta-block';
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[0].insertAdjacentElement('afterend', copy);
                    holder = copy;
                } else {
                    holder = holders[1];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#details').querySelector('h3 > a').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* search list - topic in sidebar */
        setInterval(() => {
            let vids = document.querySelectorAll('#contents > ytd-universal-watch-card-renderer > #sections > ytd-watch-card-section-sequence-renderer > #lists > ytd-vertical-watch-card-list-renderer > #items > ytd-watch-card-compact-video-renderer');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('div.text-wrapper > yt-formatted-string.subtitle');
                if (holders.length === 0) {
                    return;
                }

                let holder = holders[0];
                let separator = ' • ';
                let parts = holder.firstChild.nodeValue.split(separator, 2);
                if (parts.length < 2) {
                    return;
                }
                let prefix = parts[0] + separator;
                let dateText = parts[1];
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.querySelector('a#thumbnail').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = prefix + uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* channel page - home (featured video) */
        setInterval(() => {
            let vids = document.querySelectorAll('#contents > ytd-channel-video-player-renderer > #content > #metadata-container > ytd-video-meta-block > #metadata');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');
                if (holders.length === 0) {
                    return;
                }

                let holder = holders[1];
                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#metadata-container').querySelector('yt-formatted-string > a').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* channel page - home (for you videos) */
        setInterval(() => {
            let vids = document.querySelectorAll('#dismissible > #details > #text-metadata > #meta > #metadata-container > #metadata');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#metadata-line > span');
                if (holders.length === 0) {
                    return;
                }

                let holder;
                if (holders.length === 1) {
                    let copy = document.createElement('span');
                    copy.className = 'style-scope ytd-grid-video-renderer';
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[0].insertAdjacentElement('afterend', copy);
                    holder = copy;
                } else {
                    holder = holders[1];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#meta').querySelector('h3 > a#video-title').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);

        /* video playlist */
        setInterval(() => {
            let vids = document.querySelectorAll('#content > #container > #meta > ytd-video-meta-block > #metadata > #byline-container');
            if (vids.length === 0) {
                return;
            }

            vids.forEach((el) => {
                let holders = el.querySelectorAll('#video-info > span');
                if (holders.length <= 1) {
                    return;
                }

                let holder;
                let prefix = '';
                if (holders.length === 2) {
                    let copy = document.createElement('span');
                    copy.className = 'style-scope yt-formatted-string';
                    copy.setAttribute('dir', 'auto');
                    let textNode = document.createTextNode('');
                    copy.appendChild(textNode);
                    holders[1].insertAdjacentElement('afterend', copy);
                    holder = copy;
                    prefix = ' • ';
                } else {
                    holder = holders[2];
                }

                let dateText = holder.firstChild.nodeValue;
                let text = el.getAttribute('data-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('data-text', dateText);
                let link = el.closest('#meta').querySelector('h3 > a').getAttribute('href');
                let videoId = urlToVideoId(link);
                getRemoteUploadDate(videoId, (uploadDate) => {
                    uploadDate = prefix + isoToDate(uploadDate);
                    holder.firstChild.nodeValue = uploadDate;
                    el.setAttribute('data-text', uploadDate);
                });
            })
        }, 1000);
    }

    startTimers();

    let styleTag = document.createElement('style');
    let cssCode = "#info > span:nth-child(3) {display:none !important;}"
    + "#info > span:nth-child(4) {display:none !important;}"
    + "#info > b {font-weight:500 !important;margin-left:6px !important;}"
    + "#date-text {display:none !important;}"
    + ".ytud-description-live #info > span:nth-child(1) {display:none !important;}"
    + ".ytud-description-live #info > b {margin-left:0 !important;margin-right:6px !important;}";
    styleTag.textContent = cssCode;
    document.head.appendChild(styleTag);
})();