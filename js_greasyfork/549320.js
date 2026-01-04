// ==UserScript==
// @name         BlobMod JS
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  Sig GMA
// @author       Imix
// @match        https://one.sigmally.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sigmally.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549320/BlobMod%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/549320/BlobMod%20JS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    

    //popups or other

    /*let shopPopup = document.getElementById('shop-popup')
    let adsPopup = document.getElementsByClassName('text-block')
    let bottomAdPopup = document.getElementById('ad_bottom')
    let otherPopup = document.getElementById('div-gpt-ad-1622841396282-0')

    let adLeft = document.getElementsByClassName('ad-block-left')
    let adRight = document.getElementsByClassName('ad-block-right')

    
    function hideElement(e) {
        e.style.display = "none"
    }

    function showElement(e) {
        e.style.display = "initial"
    }

    

    setInterval(mainLoop, 1);
    function mainLoop() {
        hideElement(bottomAdPopup);
        hideElement(shopPopup);
        for (let i = 0; i < adsPopup.length; i++) {
            hideElement(adsPopup[i])
        }
        for (let i = 0; i < adLeft.length; i++) {
            hideElement(adLeft[i])
        }
        for (let i = 0; i < adRight.length; i++) {
            hideElement(adRight[i])
        }
        let lvlProgressFull = document.getElementsByClassName("new-meter")
        lvlProgressFull[0].style.border = "2px solid rgba(194, 194, 194, 0.8)"
        lvlProgressFull[0].querySelector("span").style.backgroundColor = "rgba(194, 194, 194, 0.8)"
    }*/

    


    /*let nameGen = document.createElement("div")
    nameGen.id = "namegen"
    nameGen.style.width = "185px"
    nameGen.style.height = "33px"


    let nameGenSelect = document.createElement("input")
    nameGenSelect.id = "namegen-select"
    nameGenSelect.style.borderRadius = "10px"
    nameGenSelect.maxLength = "10000"
    nameGenSelect.style.width = "147px"
    nameGenSelect.style.height = "33px"
    nameGenSelect.style.outline = "none"
    nameGenSelect.style.padding = "12px"
    nameGenSelect.readOnly = "true"

    let nameGenStart = document.createElement("button")
    nameGenStart.id = "namegen-start"
    nameGenStart.style.borderRadius = "10px"
    nameGenStart.style.marginLeft = "5px"
    nameGenStart.style.width = "33px"
    nameGenStart.style.height = "33px"
    nameGenStart.style.outline = "none"
    nameGenStart.style.border = "0px"
    let nameGenStartImg = document.createElement("img")
    nameGenStartImg.src = "https://cdn-icons-png.flaticon.com/512/32/32339.png"
    nameGenStartImg.style.width = "18px"
    nameGenStartImg.style.height = "18px"
    nameGenStartImg.style.margin = "auto"
    nameGenStartImg.style.verticalAlign = "center"



    nameGenStart.addEventListener('click', function() {

        nameGenSelect.value = generateName()
    })


    function generateName() {
        let val = '';
        let length = Math.round(Math.random() * 4) + 4

        for (let i = 0; i < length; i++) {
            let font;
            let fontNumber = Math.round(Math.random() * 3) + 1
            switch (fontNumber) {
                case 1:
                    font = font1list;
                    break;
                case 2:
                    font = font2list;
                    break;
                case 3:
                    font = font3list;
                    break;
                case 4:
                    font = font4list;
                    break;
                default:
                    font = font1list;
            }
            let letter = Math.round(Math.random() * 24) + 1
            //console.log(fontNumber + ", " + letter + ", " + font[letter])
            val = val + encodeURIComponent(font[letter])
        }
        return decodeURIComponent(val);
    }


    //let font1 = "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"
    let font1 = "₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ"
    //let font3 = "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"
    let font2 = "ᗩᗷᑕᗪᗴᖴǤᕼIᒎᛕᒪᗰᑎᗝᑭɊᖇᔕ丅ᑌᐯᗯ᙭Ƴ乙"
    let font3 = "卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ҩ尺丂ㄒㄩᐯ山乂ㄚ乙"
    let font4 = "αႦƈԃҽϝɠԋιʝƙʅɱɳσρϙɾʂƚυʋɯxყȥ"

    //let font1list = font1.split('')
    let font1list = font1.split('')
    //let font3list = font3.split('')
    let font2list = font2.split('')
    let font3list = font3.split('')
    let font4list = font4.split('')*/


    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })


    //keybinds

    let keybinds = {
        fastfeed: "q",
        doublesplit: "e",
        triplesplit: "r",
        sendteam: "f",
        autorespawn: "h"
    };

    let keybindsActive = {
        fastfeed: false,
        doublesplit: false,
        triplesplit: false,
        sendteam: false,
        autorespawn: false
    };

    let autoRespawn = false




    function keypress(key, keycode) {
        const keyDownEvent = new KeyboardEvent("keydown", { key: key, code: keycode });
        const keyUpEvent = new KeyboardEvent("keyup", { key: key, code: keycode });

        //console.log(key, keycode)

        window.dispatchEvent(keyDownEvent);
        window.dispatchEvent(keyUpEvent);
    }

    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        for (const property in keybinds) {
            if (key == keybinds[property]) {
                if (keybindsActive[property] == false) {
                    keybindsActive[property] = true
                    if (property == "fastfeed") {
                        fastFeed(keybindsActive, property)
                    }
                    else if (property == "doublesplit") {
                        keypress(" ", "Space");
                        keypress(" ", "Space");
                    }
                    else if (property == "triplesplit") {
                        keypress(" ", "Space");
                        keypress(" ", "Space");
                        keypress(" ", "Space");
                    }
                    else if (property == "sendteam") {
                        document.getElementById("chat_textbox").value = "team"
                        keypress("Enter", "Enter");
                        keypress("Enter", "Enter");
                    }
                    else if (property == "autorespawn") {
                        autoRespawn = !autoRespawn;
                        console.log(autoRespawn)
                    }
                }
            }
        }
    });

    function fastFeed(values, property) {
        const intervalId = setInterval(() => {
            if (values[property] == true) { keypress("w", "KeyW"); } else { clearInterval(intervalId); }
        }, 10);
    }

    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();
        for (const property in keybinds) {
            if (key == keybinds[property]) {
                keybindsActive[property] = false
            }
        }
    });

    function getIndexByName(obj, key) {
        const keys = Object.keys(obj);
        return keys.indexOf(key);
    }


    
})();
