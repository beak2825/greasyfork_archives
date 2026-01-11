// ==UserScript==
// @name         Ravenloft theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  recolore du site kraland selon le thème de la famille Ravenloft
// @author       KinuHotaru
// @match        http://*.kraland.org/*
// @match        https://*.kraland.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kraland.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562188/Ravenloft%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/562188/Ravenloft%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gradientTitle = 'linear-gradient(180deg,rgba(31, 15, 43, 1) 1%, rgba(68, 31, 97, 1) 83%, rgba(145, 22, 3, 1) 100%)';
    let bodyColor = 'linear-gradient(180deg,#1b1625 0%,#16121f 100%)';

    const body=document.querySelector('body')
    body.style.backgroundImage = bodyColor
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundSize = '100% 100%';


//Navbar Style
    const navbar=document.querySelector('.navbar-default');
    if(navbar){
        navbar.style.background = gradientTitle;
    }
    const navbarVanilla=document.querySelector('.navbar');
    if(navbarVanilla){
        navbarVanilla.style.background = gradientTitle;
    }

    const navbarDefaultSelected=document.querySelector('.navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus');
    if(navbarDefaultSelected){
        navbarDefaultSelected.style.backgroundColor = 'transparent';
    }


//Side List
    const list=document.querySelector('.list-group-item.active');
    if(list){
        list.style.backgroundColor = '#911603';
        list.style.borderColor = '#691103'
    }
    const listButtons=document.querySelectorAll('.btn-primary');
    if(listButtons){
        for(let i=0;i<listButtons.length;i++){
            listButtons[i].style.backgroundColor = '#5B217D';
            listButtons[i].style.borderColor = '#492161'
        }
    }

//Popup color
    let popup = document.querySelectorAll('.alert');
    if(popup){
        for(let i=0;i<popup.length;i++){
            popup[i].style.backgroundColor = "#4e1099"
            popup[i].style.borderColor = "#691103"
        }
    }

    let links = document.querySelectorAll('a').forEach(a=>{a.style.color='#FF6908';});

    let pagination = document.querySelectorAll('.pagination > li > a');
    let paginationDisabled = document.querySelectorAll('.pagination > .disabled');
    let paginationActive = document.querySelectorAll('.pagination > .active');
    if(pagination){
        for(let i=0;i<pagination.length;i++){
            pagination[i].style.backgroundColor = "#B45B26";
            pagination[i].style.color = "#fff";
        }
        for (let j = 0; j < paginationDisabled.length; j++) {
            const a = paginationDisabled[j].querySelector('a');
            if (a) {
                a.style.backgroundColor = '#51321A';
            }
        }
        for (let k = 0; k < paginationActive.length; k++) {
            const a = paginationActive[k].querySelector('a');
            if (a) {
                a.style.backgroundColor = '#FF7800';
            }
        }
    }

    let bigLinks = document.querySelectorAll('.list-group-item-heading').forEach(occBL=>{occBL.style.color='#FF6908'});

    //Image de fond
    /*
    const bgUrl = 'https://i.imgur.com/F5ceAUX.png';
    const bg = document.createElement('div');
    bg.style.position = 'fixed';
    bg.style.top = '0';
    bg.style.left = '0';
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.backgroundImage = `url("${bgUrl}")`;
    bg.style.backgroundSize = 'contain';
    bg.style.backgroundRepeat = 'no-repeat';
    bg.style.backgroundPosition = 'center';
    bg.style.zIndex = '-1';
    bg.style.filter = 'blur(10px)';
    bg.style.pointerEvents = 'none';
    document.body.appendChild(bg);
*/

    // Sélection de la navbar container
    const thumbUrl = 'https://i.imgur.com/6lXHTTJ.png';
    const navbarContainer = document.querySelector('.navbar > .container');

    //Image bandeau
    if (navbarContainer) {
        // Création de l'élément image fixe à gauche
        const leftItem = document.createElement('div');
        leftItem.style.position = 'absolute';
        leftItem.style.left = '0';
        leftItem.style.top = '0';
        leftItem.style.height = '100%';
        leftItem.style.width = '60px';
        leftItem.style.backgroundImage = `url("${thumbUrl}")`;
        leftItem.style.backgroundSize = 'cover';
        leftItem.style.backgroundPosition = 'center center';
        leftItem.style.b
        leftItem.style.zIndex = '0';
        leftItem.style.pointerEvents = 'none';

        // Ajouter l'élément au container
        navbarContainer.style.position = 'relative';
        navbarContainer.style.paddingLeft = '60px';
        navbarContainer.append(leftItem); // prepend pour le mettre au début, à gauche

        function handleNavbarResize() {
            if (window.innerWidth < 1200) {
                leftItem.style.display = 'none';
                navbarContainer.style.paddingLeft = '0px';
            } else {
                leftItem.style.display = 'block';
                leftItem.style.width = '60px';
                navbarContainer.style.position = 'relative';
                navbarContainer.style.paddingLeft = '60px';
            }
        }

        window.addEventListener('resize', handleNavbarResize);
        handleNavbarResize();



    }
})();


/*

MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/