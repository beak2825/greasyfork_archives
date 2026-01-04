// ==UserScript==
// @name         Pornolab image preview
// @description  Lets you preview torrents first image by showing on hover on the tracker listing
// @namespace    https://pornolab.net/forum/index.php
// @version      0.3
// @description  try to take over the world!
// @author       tobij12 - pingu2
// @match        https://pornolab.net/forum/tracker.php*
// @require      https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @require
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555703/Pornolab%20image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/555703/Pornolab%20image%20preview.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const blockedSources = ['vsexshop', 'static.pornolab.net', 'yadro', 'vpipi', '9bee784100d7c6108d51fd70e9b79a50.gif', 'nodrink', 'rimg', '9ac78b9bb3e82339391d223a64daf18f', '4f9a8a86a785326a0a3d1560404a6fdc', '73ea7145a1b7d011589c849c5391c7b6', '5772513e239a6a8ee48af36544313a06'];
    const imageCache = {};
    let sources = [];
    const imageFetchCache = new Map();
    let onlink = false;
    let linkno = 0;
    let imgSize = {};
    let links = window.document.querySelectorAll('.med .tLink');
    $(window).bind('mousewheel DOMMouseScroll', function (e) {
        e.preventDefault();
        e.stopPropagation(); return false
    }, { passive: false });

   const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
.spinner {
    border: 5px solid rgba(0,0,0,0.1);
    border-left-color: #888;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}
.spinner-text {
    font-size: 14px;
    color: #eee;
    font-weight: normal;
    font-family: sans-serif;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
.imageCounterLabel {
    color: #fff;
    font-weight: normal;
    font-family: verdana;
    background-color:  rgba(0, 0, 0, 0.6);
}
`;

document.head.appendChild(spinnerStyle);


    // window.addEventListener('wheel', function(e) { if (onlink) {
    // e.preventDefault(); return false;}}, {passive:false})

    document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
         let nodes = document.querySelectorAll('.appendedHoverImgContainer');
                nodes.forEach(n => n.remove());
    }
});

    links.forEach((el) => {
        el.opened = false

        el.addEventListener('wheel', function (e) {
            axios.get(el.href).then(function (res) {
                1
                if (el.opened !== true) return;

                let div = document.createElement('div');
                div.innerHTML = res.data;
                let l = sources.length;

                // Adjust linkno based on scroll direction
                if (e.deltaY < 0) linkno = Math.max(0, linkno - 1);
                if (e.deltaY > 0) linkno = Math.min(l - 1, linkno + 1);

                // Loop until a valid image is found or exhausted
                let index = linkno;
                let direction = e.deltaY > 0 ? 1 : -1;

                let element = sources[linkno];
                let validSource = element?.title || '';
                let parenthref = element?.parentNode?.href || null;
                console.log("validSource: " + validSource);
                if (!validSource) return;
                let img = document.createElement('div');
                let y = el.getBoundingClientRect().top;

                if (el.opened) {
                    loadImage(el, y, sources, index, validSource, parenthref);
                }
            });

            e.preventDefault();
            return false;
        }, { passive: false });

        el.addEventListener('mouseenter', function () {
            el.opened = true;
            linkno = 0;

            axios.get(el.href).then(function (res) {

                let div = document.createElement('div');
                div.innerHTML = res.data;
                sources = Array.from(div.getElementsByClassName('postImg')).filter(el => {
                   const title = el?.title || '';

                   // Skip blocked sources
                   const isBlocked = blockedSources.some(blocked => title.includes(blocked));
                   if (isBlocked) return false;

                   // Ensure one of the parents has class 'row1'
                   return el.closest('.row1') !== null;
               });
                let l = sources.length;

                // Loop forward through sources to find a valid image
              
                let index = 0;
                let element = sources[linkno];
                let validSource = element?.title || '';
                let parenthref = element?.parentNode?.href || null;

                if (!validSource) return;

                console.log("validSource " + validSource);
                let img = document.createElement('div');
                let y = el.getBoundingClientRect().top;

                if (el.opened) {
                 loadImage(el, y, sources, index, validSource, parenthref);
                }
            });
        });


        const row = el.closest('tr');
        if (row) {
            row.addEventListener('mouseout', function (event) {
                const related = event.relatedTarget;
                // If moving inside the same row, ignore
                if (related && row.contains(related)) return;

                // Otherwise, mouse truly left the row
                console.log("Mouse left the table row - hiding image");
                el.opened = false;
                linkno = 0;
                onlink = false;

                let nodes = document.querySelectorAll('.appendedHoverImgContainer');
                nodes.forEach(n => n.remove());
                imgSize = {};
            });


        }
    });

    function loadImage(el, y, sources, index, validSource, parenthref)
    {
        imgSize[index] = 0;
        console.log("loadImage: validSource = " + validSource);
         let thumbSource = validSource;
         if (validSource.includes('fastpic.org') && parenthref != null) {
             showSpinner(el);
             console.log("fastpic:" + parenthref);
             showImageWhileLoadingFastPic(validSource, parenthref, el, y, index, sources.length);
         }
        else if (validSource.includes('imgbox') && validSource.includes('thumb')) {
            console.log("imgbox: " + validSource);
            showSpinner(el);
            validSource = validSource.replace('thumbs', 'images').replace('_t','_o');
            showImageWhileLoading(validSource, el, y, index, sources.length, thumbSource, 'imgbox');
        }
        else if (validSource.includes('imgbox')) {
            console.log("imgbox: " + parenthref);
            showSpinner(el);
            showImageWhileLoadingHostImg(validSource, parenthref, el, y, index, sources.length, 'imgbox');
        }
         if (validSource.includes('imagevenue.com') && validSource.includes('thumbs') && parenthref != null) {
             showSpinner(el);
             console.log("imagevenue:" + parenthref);
             showImageWhileLoadingHostImg(validSource, parenthref, el, y, index, sources.length, 'imagevenue');
         }
        else if (validSource.includes('imgdrive') && validSource.includes('small')) {
            console.log("imgdrive: " + validSource);
            showSpinner(el);
            validSource = validSource.replace('small', 'big');
            showImageWhileLoading(validSource, el, y, index, sources.length, thumbSource, 'imgdrive');
        }
        else if (validSource.includes('freescreens.ru') && validSource.includes('thumb')) {
            console.log("freescreens: " + validSource);
            showSpinner(el);
            validSource = validSource.replace('freescreens.','picforall.').replace('-thumb', '');
            showImageWhileLoading(validSource, el, y, index, sources.length, thumbSource, 'freescreens.ru');
        }
        else if (validSource.includes('turboimg.net') && validSource.includes('/t/') && parenthref != null) {
             showSpinner(el);
             console.log("turboimg:" + parenthref);
             showImageWhileLoadingHostImg(validSource, parenthref, el, y, index, sources.length, 'turboimg');
        }
        else if (validSource.includes('picshick') && validSource.includes('/th/')) {
             showSpinner(el);
             console.log("picshick:" + parenthref);
             showImageWhileLoadingHostImg(validSource, parenthref, el, y, index, sources.length, 'picshick');
        }
        else if (validSource.includes('picturelol') && validSource.includes('/th/')) {
             showSpinner(el);
             console.log("picturelol:" + parenthref);
             showImageWhileLoadingHostImg(validSource, parenthref, el, y, index, sources.length, 'picturelol');
        }
        else {
            if (validSource.includes('.gif'))
            {
                showSpinner(el, 'gif');
                loadImageBase64(null, el, y, index, sources.length, validSource, validSource);
            }
            else
            {
                const url = new URL(validSource);
                const host = url.hostname;
                showSpinner(el, host);
                getImageBase64Cached(validSource, base64data => {
                loadImageBase64(base64data, el, y, index, sources.length, validSource);
                });
            }
        }
    }

    function showSpinner(el, host) {
            const container = document.createElement('div');
            container.className = 'appendedHoverImgContainer';
            container.style.position = 'absolute';
            container.style.left = '350px';
            container.style.marginTop = '32px';
            container.style.marginLeft = '2px';
            container.style.zIndex = 10;
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';

            const spinner = document.createElement('div');
            spinner.className = 'spinner';

            const loadingText = document.createElement('span');
            loadingText.className = 'spinner-text';
        if (host == null)
            loadingText.textContent = '';
        else
            loadingText.textContent = 'Loading from ' + host + '...';
        console.log("host: " + host);
            container.appendChild(spinner);
            container.appendChild(loadingText);
            el.appendChild(container);
    }


    function showImageWhileLoading(url, el, y, index = 0, total = 1, thumbSource = '', host) {
        // Show GIF immediately from URL
        //if (thumbSource == '') thumbSource = url;
        loadImageBase64('', el, y, index, total, '', thumbSource, false);
        showSpinner(el);
        // Then load base64 cached image and update when ready
        getImageBase64Cached(url, base64Str => {
            if (!el.opened) return;
            loadImageBase64(base64Str, el, y, index, total, url);
        });
    }

    function showImageWhileLoadingFastPic(url, parenthref, el, y, index = 0, total = 1, host) {
        // Show GIF immediately from URL
        loadImageBase64('', el, y, index, total, '', url, false);
        showSpinner(el,host);
        // Then load base64 cached image and update when ready
        fetchFastpicBigImage64Cached(parenthref, index).then(
                 base64data => loadImageBase64(base64data, el, y, index, total, url)
             );
    }

    function showImageWhileLoadingHostImg(url, parenthref, el, y, index = 0, total = 1, host) {
        // Show GIF immediately from URL
        loadImageBase64('', el, y, index, total, '', url, false);
        showSpinner(el,host);
        // Then load base64 cached image and update when ready
        fetchHostImage64Cached(parenthref, index).then(
                 base64data => loadImageBase64(base64data, el, y, index, total, url)
             );
    }

    function fetchHostImage64Cached(viewPageUrl, index) {
        if (imageFetchCache.has(viewPageUrl)) {
            return imageFetchCache.get(viewPageUrl);
        }

        const promise = fetchHostImage64(viewPageUrl, index);
        imageFetchCache.set(viewPageUrl, promise);
        return promise;
    }

    function fetchFastpicBigImage64Cached(viewPageUrl, index) {
        if (imageFetchCache.has(viewPageUrl)) {
            return imageFetchCache.get(viewPageUrl);
        }

        const promise = fetchFastpicBigImage64(viewPageUrl, index);
        imageFetchCache.set(viewPageUrl, promise);
        return promise;
    }

    function fetchFastpicBigImage64(viewPageUrl, index) {

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: viewPageUrl,
                responseType: 'blob',
                onload: function (response) {
                    const contentType = response.responseHeaders
                        .toLowerCase()
                        .split('\r\n')
                        .find(header => header.startsWith('content-type:')) || '';
console.log("in fastpic reader");
                    if (contentType.includes('text/html')) {
                        // The response is HTML: parse it to find the image URL
                        const reader = new FileReader();
                        reader.onload = () => {
                            const html = reader.result;
                            const div = document.createElement('div');
                            div.innerHTML = html;

                            const images = Array.from(div.querySelectorAll('img'));
                            const validImage = images.find(img =>
                                img.src.includes('md5=') && img.src.includes('expires=')
                            );

                            if (!validImage) {
                                resolve(null);
                                return;
                            }
console.log("in fastpic html reader");
                            // Fetch the image blob now
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: validImage.src,
                                responseType: 'blob',
                                onload: function (imageResponse) {
                                    const blob = imageResponse.response;
                                    const reader2 = new FileReader();
                                    reader2.onloadend = () => resolve(reader2.result); // Base64 data URI
                                    reader2.onerror = e => reject(e);
                                    reader2.readAsDataURL(blob);
                                },
                                onerror: err => reject(err)
                            });
                        };
                        reader.onerror = e => reject(e);
                        reader.readAsText(response.response);
                    } else if (contentType.includes('image/')) {
                        // The response is the image blob itself, convert to base64
                        console.log("in fastpic img reader");
                        const blob = response.response;
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = e => reject(e);
                        reader.readAsDataURL(blob);
                    } else {
                        // Unknown content type
                        resolve(null);
                    }
                },
                onerror: err => reject(err)
            });
        });
    }

     function fetchHostImage64(viewPageUrl) {

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: viewPageUrl,
                responseType: 'blob',
                onload: function (response) {
                    const contentType = response.responseHeaders
                        .toLowerCase()
                        .split('\r\n')
                        .find(header => header.startsWith('content-type:')) || '';

                    if (contentType.includes('text/html')) {
                        // The response is HTML: parse it to find the image URL
                        const reader = new FileReader();
                        reader.onload = () => {
                            const html = reader.result;
                            const div = document.createElement('div');
                            div.innerHTML = html;

                            const images = Array.from(div.querySelectorAll('img'));
                            const validImage = images.find(img =>(
                                img.src.includes('turboimg.net') && img.src.includes('/sp/')) ||
                                                           img.src.includes('cdn-images.imagevenue')
                                                           || img.src.includes('picshick.com/i')
                                                           || img.src.includes('picturelol.com/i')
                            );

                            if (!validImage) {
                                resolve(null);
                                return;
                            }

                            // Fetch the image blob now
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: validImage.src,
                                responseType: 'blob',
                                onload: function (imageResponse) {
                                    const blob = imageResponse.response;
                                    const reader2 = new FileReader();
                                    reader2.onloadend = () => resolve(reader2.result); // Base64 data URI
                                    reader2.onerror = e => reject(e);
                                    reader2.readAsDataURL(blob);
                                },
                                onerror: err => reject(err)
                            });
                        };
                        reader.onerror = e => reject(e);
                        reader.readAsText(response.response);
                    } else if (contentType.includes('image/')) {
                        // The response is the image blob itself, convert to base64
                        const blob = response.response;
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = e => reject(e);
                        reader.readAsDataURL(blob);
                    } else {
                        // Unknown content type
                        resolve(null);
                    }
                },
                onerror: err => reject(err)
            });
        });
    }

     function getImageBase64Cached(url, callback) {
        if (imageCache[url]) {
            console.log("Cache hit for", url);
            callback(imageCache[url]);
            return;
        }
console.log("getting " + url);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function (response) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const base64data = reader.result.split(',')[1]; // strip header
                    imageCache[url] = base64data;
                    callback(base64data);
                };
                reader.readAsDataURL(response.response);
            }
        });
    }

    function loadImageBase64(base64Str, el, y, index = 0, total = 1, link='', url='', removespinner=true) {
        
        if (!el.opened) return;
        if (base64Str != null)
        {
            console.log("base64Str length: " + base64Str.length);
            console.log("url: " + url);
            if (imgSize[index] > base64Str.length)
            {
                console.log("image is smaller than before");
                return;
            }
            imgSize[index] = base64Str.length;
        }
        if (index != linkno) return;
        // Adjust image size and position logic as before
        let adjustedHeight = 400;
        let topMargin = 15;
        const windowHeight = window.innerHeight;

        if (windowHeight < y + 1800 - 15) {
            adjustedHeight = windowHeight - y - 45;
            if (adjustedHeight < 200) {
                adjustedHeight = 200;
                topMargin = windowHeight - y - 225;
            }
        }


        // Remove previous appended image 
        [...el.querySelectorAll('.appendedHoverImgContainer')].forEach(n => n.remove());

        // Create container div to hold image and label
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '350px';
        container.style.marginTop = `${topMargin}px`;
        container.style.height = `${adjustedHeight}px`;
        container.style.width = 'auto';
        container.style.zIndex = 10;
        container.className = 'appendedHoverImgContainer';

        // Create the image
        const img = document.createElement('img');
        if (url)
        {
            img.src = url;
        }
        else
        {
            if (base64Str.startsWith("data")) {
                base64Str = base64Str.split(',')[1];
            }
            img.src = 'data:image/png;base64,' + base64Str;
        }
        
        img.style.height = '100%';
        img.style.width = 'auto';
        img.style.display = 'block';

        // Create the counter label
        const label = document.createElement('div');
        label.textContent = `Image ${index + 1}/${total}`;
        label.className = 'imageCounterLabel';
        label.style.position = 'absolute';
        label.style.top = '5px';
        label.style.left = '5px';
        label.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        label.style.padding = '2px 6px';
        label.style.fontSize = '12px';
        label.style.borderRadius = '4px';
        label.style.pointerEvents = 'none';

        // Add image and label to container
        container.appendChild(img);
        container.appendChild(label);

        // Append container to el
        el.appendChild(container);

//         el.style.textDecoration = 'underline';
        if (removespinner)
            [...el.querySelectorAll('.appendedHoverImgContainer.spinner')].forEach(n => n.remove());

    }


})();