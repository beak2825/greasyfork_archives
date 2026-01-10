// ==UserScript==
// @name         Semprot Helpers
// @description  Semprot Helper
// @author       Pommpol
// @version      2026-01-10
// @match        https://www.semprot.com/threads/*
// @match        https://www.semprot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=semprot.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant GM_xmlhttpRequest
// @license MIT
// @namespace https://greasyfork.org/users/1558525
// @downloadURL https://update.greasyfork.org/scripts/562069/Semprot%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/562069/Semprot%20Helpers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Load saved states ---
    let panelPos = GM_getValue('panelPos', null); // saved position
    let allSettings_var = [
        {
            name : "imageBamLoader",
            tip : "Click to get full size of an image",
            value : GM_getValue('imageBamLoader', true),
            type : 'checkbox',
            callback : null
        },
        {
            name : "videoEmbeder",
            tip : "Click to embed element of video stream",
            value : GM_getValue('videoEmbeder', true),
            type : 'checkbox',
            callback : null
        },
    ];


    // --- Create small Tools button ---
    function createToolsBtn(){
        const toolsBtn = document.createElement('button');
        toolsBtn.innerText = 'Tools';
        toolsBtn.style.position = 'fixed';

        toolsBtn.style.zIndex = 9999;
        toolsBtn.style.padding = '8px 12px';
        toolsBtn.style.borderRadius = '5px';
        toolsBtn.style.border = '1px solid white';
        toolsBtn.style.backgroundColor = 'rgba(0,0,0,0.8)';
        toolsBtn.style.color = 'white';
        toolsBtn.style.cursor = 'pointer';
        toolsBtn.style.fontFamily = 'Arial, sans-serif';
        toolsBtn.style.fontSize = '14px';
        toolsBtn.style.left = '20px';
        toolsBtn.style.bottom = '20px';

        return toolsBtn;
    }
    var toolsBtn = createToolsBtn();
    document.body.appendChild(toolsBtn);

    // --- Create settings panel ---
    function CreatePanel(){
        const panel = document.createElement('div');
        panel.classList.add("panelwkwk");
        panel.style.position = 'fixed';
        panel.style.width = '220px';
        panel.style.padding = '10px';
        panel.style.backgroundColor = 'rgba(0,0,0,0.85)';
        panel.style.color = 'white';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = 9999;
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontSize = '14px';
        panel.style.display = 'none'; // hidden initially
        panel.style.cursor = 'grab'; // show draggable cursor

        // Restore saved position
        if (panelPos) {
            panel.style.left = panelPos.left;
            panel.style.top = panelPos.top;
        } else {
            panel.style.bottom = '20px';
            panel.style.right = '20px';
        }

        return panel;
    }
    let panel = CreatePanel()
    document.body.appendChild(panel);


    // --- Back button ---
    function createBackBtnPanel(){
        const backBtn = document.createElement('button');
        backBtn.innerText = '← Back';
        backBtn.style.marginBottom = '10px';
        backBtn.style.padding = '5px 8px';
        backBtn.style.borderRadius = '4px';
        backBtn.style.border = '1px solid white';
        backBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
        backBtn.style.color = 'white';
        backBtn.style.cursor = 'pointer';
        backBtn.style.fontSize = '13px';


        backBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            toolsBtn.style.display = 'block';
        });
        return backBtn;
    }

    // --- Settings list ---
    function createSettingList(){
        const settingsList = document.createElement('div');
        settingsList.className = "allSet";
        settingsList.style.display = 'flex';
        settingsList.style.flexDirection = 'column';
        return settingsList;
    }
    let settingsList = createSettingList();
    let backBtn = createBackBtnPanel();
    panel.appendChild(backBtn);
    panel.appendChild(settingsList)
    // --- Toggle panel on Tools button click ---
    toolsBtn.addEventListener('click', () => {
        toolsBtn.style.display = 'none';
        panel.style.display = 'block';
    });

    // --- Draggable logic ---
    let isDragging = false;
    let offsetX, offsetY;

    panel.addEventListener('mousedown', (e) => {
        // Only drag if clicked outside input elements
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        document.body.style.userSelect = 'none'; // prevent text selection
        panel.style.cursor = 'grabbing';

    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = e.clientX - offsetX + 'px';
        panel.style.top = e.clientY - offsetY + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            GM_setValue('panelPos', { left: panel.style.left, top: panel.style.top });
            document.body.style.userSelect = '';
            panel.style.cursor = 'grab';
        }
    });


    function addSetting(name,tiptxt,var_set,type,callback = null){
        const label = document.createElement('label');
        label.innerText = `${name}: `;
        label.style.cursor = "pointer";
        settingsList.appendChild(label);

        const tip = document.createElement('div');
        tip.innerText = tiptxt;
        tip.id = "tooltip";
        tip.classList.add("hidden");

        let input;
        switch(type){
            case "checkbox":
                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = var_set;
                input.style.marginLeft = '5px';

                input.addEventListener('change', () => {
                    var_set = input.checked;
                    GM_setValue(`${name}`, var_set);
                    console.log(`${name} is now`, var_set ? 'ON' : 'OFF');
                    if(callback){
                        callback()
                    }
                });
                break;
            case "textArea":
                input = document.createElement('textarea');
                input.style.cssText = 'padding: 2px;width : 100%; height:30px;word-wrap : break-word;'
                input.wrap="hard";
                input.rows = 5;
                input.cols = 15;
                input.innerText = var_set;

                // Expand when the user clicks into it
                input.addEventListener('mouseover', () => {
                    input.style.height = '300px';
                });

                // Shrink back when they click away
                input.addEventListener('mouseout', () => {
                    input.style.height = '30px';
                });
                input.addEventListener('change', (event) => {
                    const content = event.target.value;
                    GM_setValue(name,content);
                });

        }
        label.appendChild(input);
        label.appendChild(tip);

        // Show tip on hover
        label.addEventListener('mouseenter', () => {
            tip.classList.remove('hidden');
        });

        // Hide tip when mouse leaves
        label.addEventListener('mouseleave', () => {
            tip.classList.add('hidden');
        });

    }
    function getImageBoxSrc(url){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    // Manually add the "Cookie" header
                    "User-Agent":  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
                    // You can add other headers here too
                },
                onload: function(response) {
                    if (response.status !== 200) {
                        return reject('Failed to fetch page: ' + response.status);
                    }

                    // Parse the HTML into a DOM
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Query the image element
                    const img = doc.querySelector('#img')

                    if (!img) {
                        resolve(null);
                    } else {
                        resolve(img.src);
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }
    function getImageBamSrc(url) {
        var expires = '';
        var date = new Date();
        date.setTime(date.getTime() + (6 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
        var image_bam_cookies = "nsfw_inter=1" + expires + "; path=/";

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    // Manually add the "Cookie" header
                    "Cookie": image_bam_cookies
                    // You can add other headers here too
                },
                onload: function(response) {
                    if (response.status !== 200) {
                        return reject('Failed to fetch page: ' + response.status);
                    }

                    // Parse the HTML into a DOM
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Query the image element
                    const img = doc.querySelector('#app > main > div.container > div > div.view-image > a > img.main-image');

                    if (!img) {
                        resolve(null);
                    } else {
                        resolve(img.src);
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }


    allSettings_var.forEach(setting => {
        addSetting(setting.name,setting.tip,setting.value,setting.type,setting.callback);
    });


    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.pendingSrc) {
                const img = entry.target;
                const newUrl = img.dataset.pendingSrc;

                // Actual Loading starts here
                img.src = newUrl;

                img.onload = () => {
                    img.classList.remove('swapping');
                    img.style.filter = 'blur(0px)'; // Smoothly reveal
                    delete img.dataset.pendingSrc;
                };

                obs.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });



    //add css
    const style = document.createElement('style');
    style.innerHTML = `
        #tooltip {
            position: relative;
            top: -40px;
            right: -120px;
            background: #595959db;
            color: #ededed;
            padding: 5px;
            border-radius: 4px;
            font-size: 12px;
            white-space: normal;
            word-wrap: break-word;
        }
        .hidden {
          display: none;       /* Hides the tip by default */
        }
        .img-stack-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px;
        }
        .swapping {
            filter: blur(5px) grayscale(50%); /* Hides the old image content */
            transition: filter 0.5s ease;
            cursor: wait;
        }
        .loading-overlay {
            position: absolute;
            color: white;
            background: rgba(0,0,0,0.4);
            padding: 5px 10px;
            font-family: sans-serif;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    function imgSwapperElement(target,from,to){
        target.classList.add('swapping');
        target.dataset.before=from;
        target.dataset.pendingSrc = to;
        // Step B: Store the URL but DON'T set img.src yet (Lazy Load)
        observer.observe(target);
        console.log('Image blurred and waiting for scroll to load...');
    }
    function imgSpawner(url){
        const container = document.createDocumentFragment();
        const br = document.createElement('br');
        const img = document.createElement('img');
        img.src = url
        img.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            img.remove();
            br.remove();
        };
        container.append(br, img);
        return container;
    }
    function iframeSpawn(url){

        const container = document.createElement("div")
        container.classList.add("container-iframe");

        const iframe = document.createElement("iframe");
        iframe.width = "560";
        iframe.height = "315";
        iframe.src = url;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;

        const closeBtn = document.createElement("button");
        closeBtn.innerText = '✕';
        closeBtn.style.cssText = `
            position: relative;
            top: -300px;
            left: 560px;
            z-index: 10;
            border-radius: 50%;
            cursor: pointer;
            width: 30px;
            height: 30px;
        `;
        container.appendChild(closeBtn);
        container.appendChild(iframe);

        closeBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            container.remove();
        };
        return container
    }
    // Listen for clicks anywhere on the document
    document.addEventListener('click', function(event) {
        var url
        switch (event.target.tagName.toLowerCase()){
            case 'a':
                if(GM_getValue('videoEmbeder', false)){
                    var iframe = undefined;
                    var embedurl = null;
                    url = new URL(event.target.href);
                    if(url.hostname=="sendvid.com"){
                        event.preventDefault();
                        event.stopPropagation();
                        embedurl = `https://${url.hostname}/embed/${url.pathname}`
                    }
                    else if(url.hostname == "streamtape.com" || url.hostname == "streamtape.cc"){
                        event.preventDefault();
                        event.stopPropagation();
                        embedurl = `https://${url.hostname}/e/${url.pathname.split("/")[2]}`
                    }
                    else if(url.hostname == "dsvplay.com"){
                        event.preventDefault();
                        event.stopPropagation();
                        embedurl = `https://${url.hostname}/e/${url.pathname.split("/")[2]}`

                    }
                    else if(url.hostname == "imgbox.com"){
                        event.preventDefault();
                        event.stopPropagation();
                        getImageBoxSrc(event.target.href)
                            .then(src => {
                            event.target.after(imgSpawner(src));
                            if (src) console.log('Image src:', src);
                            else console.log('Image not found : ',event.target.href);
                        })
                            .catch(err => console.error('Error:', err));
                    }
                    break;
                    if (embedurl){
                        iframe = iframeSpawn(embedurl);
                        event.target.appendChild(iframe);
                    }
                }
                break;
                // Check if the clicked element is an <img>
            case 'img':
                url = new URL(event.target.src);
                if(url.hostname == "imagebam.com"){
                    if(GM_getValue('imageBamLoader', false)){
                        const parentLink = event.target.closest('a');
                        if(parentLink){
                            event.preventDefault();
                            event.stopPropagation();
                            if(event.target.dataset.before !== undefined){
                                imgSwapperElement(event.target,event.target.src,event.target.dataset.before);
                            }
                            else {

                                getImageBamSrc(parentLink.href)
                                    .then(src => {
                                    imgSwapperElement(event.target,event.target.src,src);

                                    if (src) console.log('Image src:', src);
                                    else console.log('Image not found : ',parentLink.href);})
                                    .catch(err => console.error('Error:', err));
                            }
                        }
                    }
                    break;
                }
        }
    }, true);


})();