// ==UserScript==
// @name         Dragon Cave - Large Dragons
// @namespace    https://github.com/BleatBytes/DragCave-Large-Dragons
// @version      v1.4
// @description  Makes dragons in Dragon Cave appear larger on their View page, on a User's page, and on a user's Dragons page.
// @author       Valen
// @match        *://dragcave.net/view/*
// @match        *://dragcave.net/user/*
// @match        *://dragcave.net/dragons
// @match        *://dragcave.net/dragons/*
// @match        *://dragcave.net/group/*
// @icon         https://icons.duckduckgo.com/ip2/dragcave.net.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558846/Dragon%20Cave%20-%20Large%20Dragons.user.js
// @updateURL https://update.greasyfork.org/scripts/558846/Dragon%20Cave%20-%20Large%20Dragons.meta.js
// ==/UserScript==

function viewBig($N = 2){ // $N <- This is by how much you want to enlargen the images. E.g. $N = 2 makes images twice as big.
    const calcAt = function($N, param){
        let ele = document.querySelector('img[class="spr _6i_2"]');
        let check = ele.hasAttribute(param);
        let ret;
        if (!check){
            console.log("Running new Image()...")
            let newImg = new Image();
            newImg.onload = function(){
                if (param.test(/(width)/)) {
                    ret = this.width;
                    console.log("Tested parameter is 'width' at: ", ret);
                } else if (param.test(/(height)/)) {
                    ret = this.height;
                    console.log("Tested parameter is 'height' at: ", ret);
                };
            };
            newImg.src = ele.src;
        } else {
            ret = ele.getAttribute(param);
            console.log(ret);
        }
        return ret * $N;
    };

    let growthCheck = document.querySelector("._6i_0 section > p").textContent.match(/(will die)/);
    let tinyBabies = false; // <- Makes eggs and hatchlings appear small on View pages. Turn to "false" if you want them to look big too! Note that frozen hatchlings will get big anyways.

    if ((growthCheck && (tinyBabies == false)) || !growthCheck){
        GM_addStyle(`
        img[class='spr _6i_2'] {
            width: ${calcAt($N, "width")}px!important;
            height: ${calcAt($N, "height")}px!important;
            image-rendering: crisp-edges;
        };
    `);
    };
};

function listBig($N = 2){
    let imgs;
    if (location.href.match(/\/(dragons)$/) || location.href.match(/\/(dragons)\S+/)) {
        imgs = document.querySelectorAll("#dragonlist img[class='_11_2']");
    } else if (location.href.match(/\/(user)\S+/)) {
        imgs = document.querySelectorAll("._1l_0 img[class='_11_2']");
    } else if (location.href.match(/\/(group)\S+/)) {
        imgs = document.querySelectorAll("#udragonlist img[class='_11_2']");
    };

    let w;
    let h;
    let tinyBabies = true; // <- Makes eggs and hatchlings appear small on Dragons and User pages. Turn to "false" if you want them to look big too! Note that frozen hatchlings will get big anyways.

    for(var i=0; i < imgs.length; i++){
        let ele = imgs[i];
        if (ele.hasAttribute('width') || ele.hasAttribute('height')){
            w = ele.getAttribute('width');
            h = ele.getAttribute('height');
            ele.setAttribute('width', w * $N);
            ele.setAttribute('height', h * $N);
        } else {
            let newImg = new Image();
            newImg.onload = function(){
                const imageWidth = this.width;
                const imageHeight = this.height;

                console.log(imageWidth,"x",imageHeight);
                if (tinyBabies == true) {
                    ele.setAttribute('width', imageWidth);
                    ele.setAttribute('height', imageHeight);
                } else {
                    ele.setAttribute('width', imageWidth * $N);
                    ele.setAttribute('height', imageHeight * $N);
                };
            };
            newImg.src = ele.src;
        };
    };

    GM_addStyle(`
        #dragonlist img[class='_11_2'], ._1l_0 img[class='_11_2'], #udragonlist img[class='_11_2']{
            image-rendering: crisp-edges;
        };
    `);
};


const exec = function() {
    if (location.href.match(/\/(dragons)$/) || location.href.match(/\/(dragons)\S+/) || location.href.match(/\/(user)\S+/) || location.href.match(/\/(group)\S+/)) {
        if (document.readyState !== 'loading') {
            listBig();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                listBig();
            });
        };
    } else if (location.href.match(/\/(view)\S+/)){
        if (document.readyState !== 'loading') {
            viewBig();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                viewBig();
            });
        };
    };
}();

