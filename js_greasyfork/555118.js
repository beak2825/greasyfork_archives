// ==UserScript==
// @name            从豆包下载无水印原图实验版 Download Original Raw Image from doubao.com without Watermark Experimental
// @name:en         Download Origin Image from Doubao without Watermark Experimental 从豆包下载无水印原图实验版
// @namespace       https://github.com/catscarlet/Download-Original-Raw-Image-from-Doubao-without-Watermark-Experimental
// @description     这个脚本可以让你尝试从豆包（www.doubao.com）下载无水印原图 You can try this userscript to Download Original Raw Image from doubao.com without Watermark.
// @description:en  You can try this userscript to Download Original Raw Image from doubao.com without Watermark. 这个脚本可以让你尝试从豆包（www.doubao.com）下载无水印原图
// @version         0.0.2
// @author          catscarlet
// @license         GNU Affero General Public License v3.0
// @match           https://www.doubao.com/chat/*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/555118/%E4%BB%8E%E8%B1%86%E5%8C%85%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%8E%9F%E5%9B%BE%E5%AE%9E%E9%AA%8C%E7%89%88%20Download%20Original%20Raw%20Image%20from%20doubaocom%20without%20Watermark%20Experimental.user.js
// @updateURL https://update.greasyfork.org/scripts/555118/%E4%BB%8E%E8%B1%86%E5%8C%85%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%8E%9F%E5%9B%BE%E5%AE%9E%E9%AA%8C%E7%89%88%20Download%20Original%20Raw%20Image%20from%20doubaocom%20without%20Watermark%20Experimental.meta.js
// ==/UserScript==

const removeDefaultDownloadButton = 0; //Set 1 to hide Original Download Button.
const customPostfixName = '';
const OriginalXHR = window.XMLHttpRequest;
window.globalImageBucket = {};

(function() {
    'use strict';

    let throttleTimer;
    let debounceTimer;

    const observer = new MutationObserver((mutationsList) => {
        const now = Date.now();

        if (!throttleTimer || now - throttleTimer > 300) {
            throttleTimer = now;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {

                        if (removeDefaultDownloadButton) {
                            const EditImageDownloadButtons = document.querySelectorAll('div[data-testid="edit_image_download_button"]');

                            EditImageDownloadButtons.forEach((EditImageDownloadButton) => {
                                if (EditImageDownloadButton && EditImageDownloadButton.style.display != 'none') {
                                    EditImageDownloadButton.style.display = 'none';
                                }
                            });
                        }

                        let images = [];
                        //const imagesOldVersion = document.querySelectorAll('img.preview-img-IlQuCi.img-bg-fz6Iim');
                        const imagesNewVersion = document.querySelectorAll('div.img-preview-container-aIXnUl');

                        /*
                        for (const imageValue of imagesOldVersion.values()) {
                            images.push(imageValue);
                        }
                        */

                        for (const imageValue of imagesNewVersion.values()) {
                            images.push(imageValue);
                        }

                        if (images.length == 0) {
                            return false;
                        }

                        images.forEach((image) => {

                            if (!image.parentNode.querySelector('.imagelink-nowatermark')) {

                                const link = document.createElement('a');

                                link.textContent = '点击下载「会话名-会话ID-下载时间」为文件名的无水印原图';
                                link.style.whiteSpace = 'break-spaces';

                                link.classList.add('imagelink-nowatermark');

                                link.style.position = 'absolute';
                                link.style.backgroundColor = 'darkviolet';
                                link.style.color = 'white';
                                link.style.padding = '7px 14px';
                                link.style.border = 'none';
                                link.style.borderRadius = '5px';

                                link.style.zIndex = 1;
                                link.style.textDecoration = 'none';
                                link.style.opacity = '0.8';

                                const x = 0;
                                const y = 0;

                                link.style.left = x + 'px';
                                link.style.top = y + 'px';

                                link.addEventListener('mouseover', function() {
                                    if (this.style.cursor == 'not-allowed') {
                                        return;
                                    }
                                    this.style.backgroundColor = 'violet';
                                    this.style.cursor = 'pointer';
                                });

                                link.addEventListener('mouseout', function() {
                                    if (this.style.cursor == 'not-allowed') {
                                        return;
                                    }
                                    this.style.backgroundColor = 'darkviolet';
                                    this.style.cursor = '';
                                });

                                link.addEventListener('click', async () => {
                                    getCrossOriginImage(link);
                                });

                                image.parentNode.appendChild(link);
                            } else {
                                //console.log('added, skip.');
                            }
                        });
                    }
                }
            }, 300);
        }
    });

    const config = {
        childList: true,
        attributes: false,
        subtree: true,
    };

    observer.observe(document.documentElement, config);

    window.XMLHttpRequest = function() {
        return createModifiedXHR();
    };

})();

function createModifiedXHR() {
    const xhr = new OriginalXHR();

    const originalOpen = xhr.open;

    xhr.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = xhr.send;

    xhr.send = function(body) {

        if (this._method && this._method.toUpperCase() === 'POST' &&
            this._url && this._url.includes('/im/chain/single?')) {

            xhr.addEventListener('load', function() {
                if (xhr.readyState === 4) {
                    try {
                        const jsonData = JSON.parse(xhr.responseText);
                        window.result = jsonData;

                        if (Object.hasOwn(jsonData, 'downlink_body')) {
                            let messages = jsonData.downlink_body.pull_singe_chain_downlink_body.messages;

                            messages.forEach((message, i) => {

                                if (message.user_type == 2) {
                                    content = JSON.parse(message.content);

                                    if (Array.isArray(content)) {
                                        let creations = content[1].content.creation_block.creations;

                                        creations.forEach((item, j) => {
                                            window.globalImageBucket[item.image.key] = item.image;
                                        });
                                    } else if (Object.hasOwn(content, 'image_list')) {
                                        let imageList = content.image_list;
                                        imageList.forEach((image, j) => {
                                            window.globalImageBucket[image.key] = image.image;
                                        });

                                    } else {

                                    }

                                } else {
                                    console.log('content.length == ' + content.length);
                                }

                            });

                        } else {
                            console.log('jsonData does not have downlink_body');
                        }

                    } catch (jsonError) {
                        console.warn(jsonError);
                    }
                }
            });
        }

        return originalSend.apply(this, arguments);
    };

    return xhr;
}

async function getCrossOriginImage(link) {

    const btnOriginStyle = {};
    btnOriginStyle.cursor = link.style.cursor;
    btnOriginStyle.backgroundColor = link.style.backgroundColor;
    link.style.cursor = 'not-allowed';
    link.style.backgroundColor = 'grey';

    const currentTitle = document.title.replace('- 豆包', '').trim();
    const chatID = document.location.pathname.replace('/chat/', '').trim();
    const timeStr = getYmdHMS();

    const imageNodelist = link.parentNode.querySelectorAll('img');
    const imageUrl = Array.from(imageNodelist).find((element) => element.alt == 'preview').src;

    const imageUrlV2 = getImageOriRawUrl(imageUrl);

    if (imageUrlV2 === false) {
        console.error('抱歉，不支持这张图片的无水印原图下载。');
        alert('抱歉，不支持这张图片的无水印原图下载。');

        return false;
    }

    let imageName = currentTitle + '-' + chatID + '-' + timeStr;
    if (customPostfixName) {
        imageName = imageName + '-' + customPostfixName;
    }
    imageName = imageName + '.png';

    try {
        const response = await fetch(imageUrlV2, {mode: 'cors'});
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imageName;
        a.style.display = 'none';
        document.body.appendChild(a);
        setTimeout(() => {
            a.click();
        }, 10);
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            link.style.cursor = btnOriginStyle.cursor;
            link.style.backgroundColor = btnOriginStyle.backgroundColor;
        }, 1000);

    } catch (error) {
        console.error('图片加载失败，请确保图片服务器开启了 CORS 支持。');
        alert('图片加载失败，请确保图片服务器开启了 CORS 支持。');
        link.style.cursor = btnOriginStyle.cursor;
        link.style.backgroundColor = btnOriginStyle.backgroundColor;
    }

}

function getImageOriRawUrl(imageUrl) {
    const url = new URL(imageUrl);
    let pathAndQuery = url.pathname + url.search + url.hash;

    const postfixIndex = pathAndQuery.indexOf('preview.jpeg~tplv');
    if (postfixIndex !== -1) {
        pathAndQuery = pathAndQuery.substring(0, postfixIndex); // +4是因为"pppp"长度为4
        pathAndQuery = pathAndQuery.substring(1);
        pathAndQuery = pathAndQuery + '.jpeg';
    }

    if (Object.hasOwn(window.globalImageBucket, pathAndQuery)) {
        const image_ori_raw = window.globalImageBucket[pathAndQuery].image_ori_raw.url;
        return image_ori_raw;
    } else {
        console.log('pathAndQuery not found');

        return false;
    }

}

function getYmdHMS() {
    const date = new Date();
    const Y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const H = String(date.getHours()).padStart(2, '0');
    const M = String(date.getMinutes()).padStart(2, '0');
    const S = String(date.getSeconds()).padStart(2, '0');

    const result = `${Y}${m}${d}${H}${M}${S}`;

    return result;
}
