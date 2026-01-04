// ==UserScript==
// @name         Florr.io build manager
// @namespace    http://tampermonkey.net/
// @version      2025-9-12
// @description  Manage your builds in florr.io
// @author       You
// @match        https://florr.io/
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549338/Florrio%20build%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/549338/Florrio%20build%20manager.meta.js
// ==/UserScript==

(function() {

    // console.log('script running')


    const mainContainer = document.createElement('div')
    mainContainer.id = 'mainContainer-000'
    mainContainer.innerHTML = `
        <div id='content-container'>
            <button id='menu-button' class='mod-btn'>Build Manager</button>
            <div id='menu-container'>
                <button id='copyBuild-btn' class='mod-btn'>Copy</button>
                <button id='loadBuild-btn' class='mod-btn'>Load</button>
            </div>
        </div>
    `





    var styles = `


        #content-container {
            width: 500px;
            height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;


        }

        #content-container span, button {
            font-family: Ubuntu;
            color: white;
        }


        #menu-container {
            position: absolute;
            display: flex;
            width: auto;
            height: auto;
            background-color: rgba(0, 0, 0, 0.4);
            /*top: 50px;*/
            z-index: 1;
            transition: top 0.2s ease;
            border-radius: 5px;

            flex-direction: row;
            align-items: start;
            justify-content: start;
            padding: 8px;
            gap: 10px;
        }



        #menu-button {
            position: absolute;
            display: flex;
            top: 10px;

            z-index: 2;
        }


        .mod-btn {
            cursor: pointer;
            padding: 8px;
            border-radius: 5px;

            flex-grow: 0;

            height: auto;
            width: auto;

            border: none;
            background-color: rgba(0, 0, 0, 0.4);

            transition: background-color 0.1s ease;
            outline: none;
        }
        .mod-btn:hover {
            background-color: rgba(0, 0, 0, 0.5);
        }
        .mod-btn:active {
            background-color: rgba(0, 0, 0, 0.6);
        }




        #mainContainer-000 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;

            display: flex;

            flex-direction: column;
            align-items: center;
            justify-content: start;
        }

        #mainContainer-000 * {
            pointer-events: auto;
        }

    `

    const styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    document.body.append(mainContainer)






    const menuBtn = document.getElementById('menu-button')
    const menuCtn = document.getElementById('menu-container')
    const menuCtnHiddenTop = `-${menuCtn.getBoundingClientRect().height + 50}px`
    menuCtn.style.top = menuCtnHiddenTop

    let menuOpen = false
    menuBtn.addEventListener('click', (e) => {
        menuOpen = !menuOpen

        if (menuOpen) {
            menuCtn.style.top = '50px'
        } else {
            menuCtn.style.top = menuCtnHiddenTop
        }

    })


    const copyBuildBtn = document.getElementById('copyBuild-btn')
    let copyBuildTimeout = ''
    copyBuildBtn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(localStorage.saved_loadouts)
        const oldTxt = copyBuildBtn.innerHTML
        copyBuildBtn.innerHTML = 'Copied!'
        if (!copyBuildTimeout) {
            copyBuildTimeout = setTimeout(() => {
                copyBuildTimeout = ''
                copyBuildBtn.innerHTML = oldTxt
            }, 5000)
        }
    })


    const loadBuildBtn = document.getElementById('loadBuild-btn')
    loadBuildBtn.addEventListener('click', (e) => {
        const buildCode = prompt('Enter the build code:')
        localStorage.saved_loadouts = buildCode
        window.location.reload()
    })



    window.addEventListener('contextmenu', (e) => { e.preventDefault() })



})();