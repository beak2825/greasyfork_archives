// ==UserScript==
// @name        SBS VOD FFMPEG details parser
// @namespace   sbs
// @description Click the FFMPEG button and it will either show you the details needed to download with FFMPEG or it will give you the direct download link.
// @include     http://www.sbs.com.au/ondemand/video/*
// @version     0.8
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/7914/SBS%20VOD%20FFMPEG%20details%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/7914/SBS%20VOD%20FFMPEG%20details%20parser.meta.js
// ==/UserScript==

function createInitButton(){

    let menuTab = document.createElement('li');
    menuTab.setAttribute('class', 'vod_menu_tab');

    let menuItem = document.createElement('a');
    menuItem.setAttribute('class', 'vod_menu_item');
    menuItem.innerHTML = "FFMPEG";

    menuTab.appendChild(menuItem);

    let vMenu = document.querySelector('.vod_menu');

    if(vMenu){
        vMenu.appendChild(menuTab);

        menuTab.addEventListener('mouseup', function(e) {
            parseScripts();
        }, false);

    }

}

GM_registerMenuCommand("Get FFMPEG details", parseScripts);

function parseScripts(){

    let scripts = document.querySelectorAll('script');

    [].forEach.call(scripts, function(item, index, arr){

        let scText = item.textContent;

        if(scText.indexOf('playerParams')>-1){
            let firstSlice = scText.slice(scText.indexOf('playerParams.releaseUrls'));
            let secondSlice = firstSlice.slice(firstSlice.indexOf('http'));
            let initialPlaylistURL = secondSlice.slice(0,secondSlice.indexOf("'"));
            getFirstM3U(initialPlaylistURL);
        }
    });

}

function getFirstM3U(initialPlaylistURL){

    GM_xmlhttpRequest({
        method: "GET",
        url: initialPlaylistURL,
        onload: function(response) {

            let xhrResponse = response.responseText;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xhrResponse, "application/xml");
            let xmlVideoElem = xml.querySelector('video');
            let xmlVideoSrc = xmlVideoElem.getAttribute('src');
            let videoTitle = xmlVideoElem.getAttribute('title');
            let sanitizedTitle = sanitizeTitle(videoTitle);

            //if it's an M3U playlist
            if(xml.querySelector('meta[name="refreshToken"]')){
                getSecondM3U(xmlVideoSrc, sanitizedTitle);
            }
            else{   //else it's a direct download
                let availableVideoBandwidth = [];
                let streamURLS = [];
                let subtitleElem = xml.querySelector('textstream[type="text/srt"]');
                let subtitle = null;
                //sometimes there's no subtitle, so check first
                if(subtitleElem){
                    subtitle = subtitleElem.getAttribute('src');
                }
                let vidSourceSlice = xmlVideoSrc.slice(0, xmlVideoSrc.indexOf('.mp4')+4);
                let sliceForBandwidthArr = vidSourceSlice.slice(vidSourceSlice.indexOf(',')+1, vidSourceSlice.lastIndexOf(','));
                let bandwidthArray = sliceForBandwidthArr.split(',');
                let vidStartingURL = 'http://sbsauvod-f.akamaihd.net/SBS_Production'+vidSourceSlice.slice(vidSourceSlice.indexOf('/managed/')).split(',')[0];

                bandwidthArray.forEach(function(item, index, arr){
                    streamURLS.push(vidStartingURL+item+'K.mp4?v=&fp=&r=&g=');
                    availableVideoBandwidth.push(item);
                });

                let isM3U = false;

                createModal(isM3U, sanitizedTitle, subtitle, streamURLS, availableVideoBandwidth, null);
            }

        },
        onerror: function(response) {
            console.log(response);
        }
    });

}

function getSecondM3U(xmlVideoSrc, sanitizedTitle){

    GM_xmlhttpRequest({
        method: "GET",
        url: xmlVideoSrc,
        onload: function(res) {

            let xhrResp = res.responseText;
            let streamURLS = [];
            let availableVideoBandwidth = [];
            let availableVideoResolution = [];

            xhrResp.split('\n').forEach(function(item, index, arr){
                let textTrim = item.trim();
                //return if it's an empty string or the #EXTM3U
                if(!textTrim.length || textTrim.startsWith('#EXTM3U')){
                    return;
                }
                if(textTrim.startsWith('#EXT-X-STREAM-INF')){
                    availableVideoBandwidth.push(textTrim.split('BANDWIDTH=')[1].split(',')[0]);
                    availableVideoResolution.push(textTrim.split('RESOLUTION=')[1].split(',')[0]);
                }
                if(textTrim.startsWith('https')){
                    streamURLS.push(item);
                }
            });

            let firstSlice = streamURLS[0].slice(0, streamURLS[0].indexOf(','));
            let showNum = firstSlice.slice(firstSlice.indexOf('_')+1, firstSlice.lastIndexOf('_'));
            let showDate = firstSlice.slice(firstSlice.indexOf('/managed/')+9, firstSlice.lastIndexOf('/'));
            let subtitle = 'http://videocdn.sbs.com.au/u/video/SBS/managed/closedcaptions/'+showDate+'/'+showNum+'.srt';
            let isM3U = true;

            createModal(true, sanitizedTitle, subtitle, streamURLS, availableVideoBandwidth, availableVideoResolution);

        },
        onerror: function(res) {
            console.log(msg);
        }
    });

}

function sanitizeTitle(vTitle){
    //try to sanitize the title a bit
    let sanitizedTitle = '';

    for (let i = 0, len = vTitle.length; i < len; i++) {
        sanitizedTitle +=vTitle[i].replace(/[^a-zA-Z0-9]/,"_");
    }
    return sanitizedTitle;

}

function createModal(isM3U, sanitizedTitle, subtitle, streamURLS, availableVideoBandwidth, availableVideoResolution){

    let modalStyles = ""+
        "#gm_modalContainer {"+
        "    height: 100%;"+
        "   width: 100%;"+
        "    overflow: auto;"+
        "    margin: auto;"+
        "    position: absolute;"+
        "    z-index: 100;"+
        "    background: rgba(0,0,0,.5);"+
        "    top: 0;"+
        "    left: 0;"+
        "    bottom: 0;"+
        "    right: 0;"+
        "}"+
        "#gm_modal{"+
        "    background-color: grey;"+
        "    border: 10px solid grey;"+
        "    bottom: 0;"+
        "    display: flex;"+
        "    flex-direction: row;"+
        "    height: 360px;"+
        "    left: 0;"+
        "    margin: auto;"+
        "    overflow: auto;"+
        "    position: absolute;"+
        "    right: 0;"+
        "    top: 0;"+
        "    width: 800px;"+
        "}"+
        "#gm_button_containers {"+
        "    display: flex;"+
        "    flex-direction: column;"+
        "}"+
        "#gm_textArea {"+
        "    margin-left: 20px;"+
        "    width: 680px;"+
        "}"+
        "#gm_closeModal {"+
        "    color: black;"+
        "    font-size: 5em;"+
        "    height: 20px;"+
        "    margin-left: 25px;"+
        "    margin-top: -18px;"+
        "}"+
        "#gm_closeModal:hover {"+
        "    text-decoration: none;"+
        "}"+
        ".gm_modalButtons {"+
        "    cursor: pointer;"+
        "    margin-bottom: 10px;"+
        "    margin-right: 10px;"+
        "    padding: 5px;"+
        "    text-align: left;"+
        "    border: 2px solid white;"+
        "    color: white;"+
        "    font-size: 1.2em;"+
        "}"+
        ".gm_modalButtons:hover {"+
        "    border: 2px solid blue;"+
        "}"+
        ".gm_vidDownLink{"+
        "    color: white;"+
        "    font-size: 2em;"+
        "    margin-bottom: 10px;"+
        "    text-decoration: none;"+
        "    margin-right: 10px;"+
        "}"+
        "#gm_subDownLink {"+
        "    color: white;"+
        "    font-size: 2em;"+
        "    margin-bottom: 10px;"+
        "    text-decoration: none;"+
        "}"+
        "#gm_subDownLink:hover {"+
        "    text-decoration: underline;"+
        "}";

    GM_addStyle(modalStyles);

    let modalContainer = document.createElement('div');
    modalContainer.setAttribute('id', 'gm_modalContainer');

    let gmModal = document.createElement('div');
    gmModal.setAttribute('id', 'gm_modal');

    let gmButtonCon = document.createElement('div');
    gmButtonCon.setAttribute('id', 'gm_button_containers');

    gmModal.appendChild(gmButtonCon);

    let gmcloseModal = document.createElement('a');
    gmcloseModal.setAttribute('id', 'gm_closeModal');
    gmcloseModal.innerHTML = '&#10005';

    let subDownLink;

    if(subtitle){

        subDownLink = document.createElement('a');
        subDownLink.setAttribute('id', 'gm_subDownLink');
        subDownLink.setAttribute('href', subtitle);

        let subDownFileName = sanitizedTitle+'.srt';
        subDownLink.setAttribute('download', subDownFileName);
        subDownLink.innerHTML = 'Download Subtitles';

    }

    modalContainer.appendChild(gmModal);

    if(isM3U){

        let gmTextArea = document.createElement('textarea');
        gmTextArea.setAttribute('id', 'gm_textArea');

        gmModal.appendChild(gmTextArea);

        if(subtitle){
            subDownLink.setAttribute('style', 'font-size: 1.3em;text-align: left;');
        }
        //sort them, sometimes the highest bandwidth one isn't the first
        let videos = {};

        availableVideoBandwidth.forEach(function(item, index, arr){
            videos[Number(item)] = {
                bandwidth: item,
                url: streamURLS[index],
                resolution: availableVideoResolution[index]
            }
        });

        let vidBandNumberArr = availableVideoBandwidth.map(function(item, index, arr){
            return Number(item);
        }).sort(function(a, b) {
            return b - a;
        });

        vidBandNumberArr.forEach(function(item, index, arr){
            let buttonDiv = document.createElement('div');
            buttonDiv.setAttribute('class', 'gm_modalButtons');
            buttonDiv.setAttribute('data-streamurl', videos[item].url);

            let bandwidthDetails = document.createElement('div');
            bandwidthDetails.innerHTML = 'Video Bandwidth: '+videos[item].bandwidth;

            let resolutionDetails = document.createElement('div');
            resolutionDetails.innerHTML = 'Resolution: '+videos[item].resolution;

            buttonDiv.appendChild(bandwidthDetails);
            buttonDiv.appendChild(resolutionDetails);

            gmButtonCon.appendChild(buttonDiv);

            buttonDiv.addEventListener('mouseup', function(e) {
                let streamAtt = decodeURIComponent(e.currentTarget.getAttribute('data-streamurl'));
                gmTextArea.value = 'ffmpeg -i "'+streamAtt+'" -c copy '+sanitizedTitle+'.ts';
            }, false);

        });

    }
    else{

        gmButtonCon.setAttribute('style', 'flex-direction: row;');

        streamURLS.forEach(function(item, index, arr){
            let vidDownLink = document.createElement('a');
            vidDownLink.setAttribute('class', 'gm_vidDownLink');
            vidDownLink.setAttribute('href', item);

            let vidDownFileName = sanitizedTitle+'.mp4';

            vidDownLink.setAttribute('download', vidDownFileName);
            vidDownLink.innerHTML = 'Download '+availableVideoBandwidth[index]+'K';

            gmButtonCon.appendChild(vidDownLink);
        });

        if(subtitle){
            gmButtonCon.appendChild(subDownLink);
        }
    }
    //append subtitle-doesn't seem to work for non direct downloads
    //gmButtonCon.appendChild(subDownLink);

    gmModal.appendChild(gmcloseModal);

    gmcloseModal.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(modalContainer);
    }, false);

    document.body.appendChild(modalContainer);
}

createInitButton();

