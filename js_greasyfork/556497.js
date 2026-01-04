// ==UserScript==
// @name         Anidl Downloader (Beta)
// @namespace    http://cozian.net/
// @version      1.2
// @description  A modular Script to extract original Download links from anidl.
// @author       Cozian
// @run-at       document-end
// @match        https://new.anidl.org/*/*
// @include      https://anidl.*.*/dl/*
// @include      https://ouo.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556497/Anidl%20Downloader%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556497/Anidl%20Downloader%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.resetTimoutId=null;
    let EpisodeData=[];
    
    let Downloadurls=[];
    const qualityMap = {
        'SD': '480p',
        'HD': '720p',
        'FHD': '1080p'
    };

    function Listener() {
        const {fetch: origFetch} = window;
        window.fetch = async (...args) => {
            console.log('Endpoint: ',args[0]);
            const response = await origFetch(...args);
            if(args[0].includes("/api/shorten-url")) {
                response.clone().json()
                    .then(data =>  processResponseData(data))
                    .catch(err => alert("Error1 : " +err.name+" \n "+err.message+" \n "+err.stack));
                return response;
            }
            return response;
        };
    }

    function processResponseData(data) {
        console.log('Response Data: ', JSON.stringify(data, null, 2));
        let url='';
        if(data && data.originalUrl) {
            url=data.originalUrl;
        }else if(data && data.shortenedUrl){
            url=data.shortenedUrl;
        }
        if(url){
            Downloadurls.push(url);
            clearTimeout(window.resetTimoutId);
            window.resetTimoutId=setTimeout(openAllDownloadUrls,3000);
        }
    }
    async function openAllDownloadUrls(){
        if( window.innerWidth <= 768){
            copyMyText(Downloadurls.join('\n'));
        }else{
            for(let url of Downloadurls){
                window.open(url,'_blank');
                //triggerFileDownload(url);
            }
        }
        await delay(7000);
        Downloadurls=[];
    }

    function processAnidlUrl() {
        let maindownlaodbtn=document.querySelector('a.download-btn');
        if(maindownlaodbtn){
            maindownlaodbtn.click();
        }
    }
    function triggerFileDownload(fileUrl) {
        const anchorElement = document.createElement('a');
        anchorElement.href = fileUrl;
        //anchorElement.download = document.title;
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function processOUOUrl() {
        let buttonExists = document.querySelector('button#btn-main');
        if(buttonExists){
            buttonExists.click();
        }else{
            alert("OUO URL detected. Please complete the captcha on the new tab to proceed to the download link.");
        }
    }
    function mouseEvent(evento,element) {
        if(!element) return;
        const mouseUpEvent = new MouseEvent(evento, {
            view: window,       // Standard view
            bubbles: true,      // Essential: allows the event to bubble up the DOM
            cancelable: true,   // Allows the event to be canceled
            button: 0,          // 0 corresponds to the left mouse button
            clientX: element.getBoundingClientRect().left + 1, // Optional: coordinates
            clientY: element.getBoundingClientRect().top + 1
        });
        element.dispatchEvent(mouseUpEvent);
    }

    async function processAnidlclick(labelText) {
        Listener();
        await delay(100);

        mouseEvent('mousedown',document.querySelector('[id$="-trigger-post"]'));

        window.scrollTo(0, document.body.scrollHeight+5000 || document.documentElement.scrollHeight+5000);

        console.log(qualityMap[labelText] ,'scrolled and clicked');
        await delay(500);
        let x=0;
        document.querySelectorAll('button.w-full.p-6.flex.items-center.justify-between').forEach(button => {button.click();x++;});
        console.log('open box count:', x);
        x=0;
        await delay(100);

        document.querySelectorAll('div[role="tablist"][data-slot="tabs-list"]').forEach(element => {
            x++;
            mouseEvent('mousedown',element.querySelector(`[id$="-trigger-${qualityMap[labelText]}"]`));
        });
        await delay(100);
        console.log('quality select count:', x);
        
        let genrateLink =document.querySelectorAll('button.py-2.px-3')
        for(let button of genrateLink){
            await delay(500);
            button.click(); x++;
        }
        console.log('download click count:', x);
    }

    function decodeAnidlPage(){
        for(let a of document.querySelectorAll('script')){
            let str=a.textContent;
            if(str.includes('https://anidl.ddlserverv1.me.in/dl/')){
                str=str.substring(str.indexOf('{'),str.lastIndexOf('}')+1).replace(/\\"/g, '"');
                console.log(str);
                EpisodeData=JSON.parse(str).children[1][3].children[1][3].episodes;
                console.log('been to this'+EpisodeData.length,EpisodeData);
                break;
            }
        }
    }

    function copyMyText(textData) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textData)
                .then(() => {
                    alert('All URLs successfully copied to clipboard!');
                })
                .catch(err => {
                    alert('Copy failed Retrying with Download txt file \n ERROR :'+err.message);
                    fallbackcopyhandle(textData);
                    //alert(textData);
                });
        } 
    }
    
    function fallbackcopyhandle(text) {
        
        let filename=document.title;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const anchorElement = document.createElement('a');
        anchorElement.href = url;
        anchorElement.download = filename;
        
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        URL.revokeObjectURL(url);
    }

    function processDownload(labelText){
        try {
            let quality=qualityMap[labelText];
            for(let episode of EpisodeData){
                episode.downloads
                    .filter(download => download.quality==quality)
                    .forEach(download => Downloadurls.push(download.url));
            }
            if(Downloadurls.length>0){
                openAllDownloadUrls();
            }else{
                processAnidlclick(labelText);
            }
        } catch (error) {
            console.error('An error occurred phase 1:', error);
            processAnidlclick(labelText);
        }
        
    }

    if(document.location.href.includes("https://anidl.ddlserver")) {
        processAnidlUrl();
    }else if(document.location.href.includes("https://ouo.")) {
        processOUOUrl();
    }else if(document.location.href.includes("https://new.anidl.org")) {
        createSimpleSnackBar(['SD','HD','FHD']);
    }

    // UI Part for the Buttons
    function createSimpleSnackBar(buttonLabels) {
    // Inject minimal CSS styles dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            .snackbar-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
            }
            .all-button {
                min-width: 3rem;
                height: 3rem;
                border-radius: 10rem;
                cursor: pointer;
                background-color: rgba(149, 0, 255, 0.8);
                border: 1px solid rgba(63, 26, 230, 0.8);
                font-size: 16px;
                text-align: center;
            }
            .action-button {
                display: none;
                font-size: 14px;
            }
            .snackbar-container.is-open .action-button {
                display: block;
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.classList.add('snackbar-container');
        document.body.appendChild(container);

        const toggleButtons = () => {
            container.classList.toggle('is-open');
            mainButton.textContent = mainButton.textContent === '=' ? 'X' : '=';
        };
        // Create action buttons first so they appear above the main button
        buttonLabels.forEach(labelText => {
            const button = document.createElement('button');
            button.classList.add('action-button', 'all-button');
            button.textContent = labelText;
            button.onclick = () => {
                toggleButtons();
                processDownload(labelText);
            };
            container.appendChild(button);
        });

        // Then create the main button and append it last so it stays at the bottom
        const mainButton = document.createElement('button');
        mainButton.classList.add('all-button', 'main-button');
        mainButton.textContent = '=';
        mainButton.onclick = toggleButtons;
        container.appendChild(mainButton);
    }
    decodeAnidlPage();

})();