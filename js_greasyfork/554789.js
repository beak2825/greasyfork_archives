// ==UserScript==
// @name         bg image replacer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ezez
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554789/bg%20image%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/554789/bg%20image%20replacer.meta.js
// ==/UserScript==

/*
to get any image link:
1. Find an image on the internet
2. Right click
3. Select "Copy Image Adress"
*/

const image_link = 'https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2025/01/360noscope420blazeitMLG-2-gID_7.jpeg@webp'; //<-- insert image link between the '
function await_image_element(){
    let image_element = document.querySelector("#backdrop-asset");
    if(!image_element){
        setTimeout(await_image_element, 100);
    }else{
        image_element.src = image_link;
    }
}
await_image_element();