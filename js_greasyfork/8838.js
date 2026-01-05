// ==UserScript==
// @name        Plus7 VOD FFMPEG download details
// @namespace   plsu7
// @description Plus7 VOD FFMPEG download detailss
// @include     https://au.tv.yahoo.com/plus7/*/-/watch/*
// @version     0.3
// @noframes
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/8838/Plus7%20VOD%20FFMPEG%20download%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/8838/Plus7%20VOD%20FFMPEG%20download%20details.meta.js
// ==/UserScript==

// based on https://gist.github.com/adammw/5635106

GM_registerMenuCommand("Get FFMPEG details", function(e) {
  getVideoData();
});

function sanitizeTitle(vTitle){
    //try to sanitize the title a bit
    let sanitizedTitle = '';

    for (let i = 0, len = vTitle.length; i < len; i++) {
        sanitizedTitle +=vTitle[i].replace(/[^a-zA-Z0-9]/,"_");
    }
    return sanitizedTitle;

}

function getVideoData(){

    document.querySelector('object').style.display='none';

    let videoElem = document.querySelector('object[id^="y7module"]');
    let flashObjectData = decodeURIComponent(document.querySelector('object[id^="y7module"]').data);
    let videoPlayerRef = flashObjectData.split('@videoPlayer=ref:')[1].split('&')[0];
    let playerKey = flashObjectData.split('&playerKey=')[1].split('&')[0];
    let publisherID = "2376984108001";
    let apiGetMediaURL = "http://c.brightcove.com/services/json/player/media/?command=find_media_by_reference_id";

    GM_xmlhttpRequest({
        method: 'GET',
        url: apiGetMediaURL+'&playerKey='+playerKey+'&pubId='+publisherID+'&refId='+videoPlayerRef,
        onload: function(res) {

            let xhrResp = res.responseText;
            let jsonResponse = JSON.parse(xhrResp);
            let sanitizedTitle = sanitizeTitle(jsonResponse.displayName);

            let videos = jsonResponse.IOSRenditions;

            //http://stackoverflow.com/a/19326174
            var sortedVideos = videos.slice(0);

            sortedVideos.sort(function(a,b) {
                return b.encodingRate - a.encodingRate;
            });

            createModal(sanitizedTitle, sortedVideos);

        },
        onerror: function(res) {
            console.log(msg);
        }
    });

}

function createInitButton(){

    let menuTab = document.createElement('li');
    menuTab.setAttribute('class', 'plus7-navigation-item');

    let menuItem = document.createElement('a');
    menuItem.setAttribute('class', 'plus7-navigation-item-link');
    menuItem.setAttribute('href', '#');
    menuItem.innerHTML = "FFMPEG";

    menuTab.appendChild(menuItem);

    let vMenu = document.querySelector('.plus7-navigation-list');

    if(vMenu){
        vMenu.appendChild(menuTab);

        menuTab.addEventListener('mouseup', function(e) {
          getVideoData();
        }, false);

    }

}

function createModal(sanitizedTitle, videos){

    let modalStyles = `
        #gm_modalContainer {
            height: 100%;
           width: 100%;
            overflow: auto;
            margin: auto;
            position: absolute;
            z-index: 1000;
            background: rgba(0,0,0,.5);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }
        #gm_modal{
            background-color: grey;
            border: 10px solid grey;
            bottom: 0;
            display: flex;
            flex-direction: row;
            height: 360px;
            left: 0;
            margin: auto;
            overflow: auto;
            position: relative;
            right: 0;
            top: 150px;
            width: 800px;
        }
        #gm_button_containers {
            display: flex;
            flex-direction: column;
        }
        #gm_textArea {
            margin-left: 20px;
            width: 680px;
        }
        #gm_closeModal {
            color: black;
            font-size: 5em;
            height: 20px;
            margin-left: 25px;
            margin-top: -18px;
        }
        #gm_closeModal:hover {
            text-decoration: none;
            cursor: pointer;
        }
        .gm_modalButtons {
            cursor: pointer;
            margin-bottom: 10px;
            margin-right: 10px;
            padding: 5px;
            text-align: left;
            border: 2px solid white;
            color: white;
            font-size: 1.2em;
        }
        .gm_modalButtons:hover {
            border: 2px solid blue;
        }
        .gm_vidDownLink{
            color: white;
            font-size: 2em;
            margin-bottom: 10px;
            text-decoration: none;
            margin-right: 10px;
        }`;

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

    modalContainer.appendChild(gmModal);

    let gmTextArea = document.createElement('textarea');
    gmTextArea.setAttribute('id', 'gm_textArea');

    gmModal.appendChild(gmTextArea);

    videos.forEach(function(item){

        let buttonDiv = document.createElement('div');
        buttonDiv.setAttribute('class', 'gm_modalButtons');
        buttonDiv.setAttribute('data-streamurl', item.defaultURL);

        let bandwidthDetails = document.createElement('div');
        bandwidthDetails.innerHTML = 'Video Bandwidth: '+item.encodingRate;

        let resolutionDetails = document.createElement('div');
        resolutionDetails.innerHTML = 'Resolution: '+item.frameHeight+'x'+item.frameWidth;

        buttonDiv.appendChild(bandwidthDetails);
        buttonDiv.appendChild(resolutionDetails);

        gmButtonCon.appendChild(buttonDiv);

        buttonDiv.addEventListener('mouseup', function(e) {
            let streamAtt = decodeURIComponent(e.currentTarget.getAttribute('data-streamurl'));
            gmTextArea.value = 'ffmpeg -i "'+streamAtt+'" -c copy '+sanitizedTitle+'.ts';
        }, false);

    });

    gmModal.appendChild(gmcloseModal);

    gmcloseModal.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(modalContainer);
    }, false);

    document.body.appendChild(modalContainer);
}

createInitButton();

