// ==UserScript==
// @name         Annoyer Bot
// @version      0.5
// @namespace    
// @description  Annoys you
// @author       EthanSpoon
// @match        https://www.youtube.com/*
 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558166/Annoyer%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/558166/Annoyer%20Bot.meta.js
// ==/UserScript==
 
 
 
 
(function() {
    'use strict';
 
    function createPopup(message, yOffset) {
        const popup = document.createElement('div');
        popup.textContent = message;
         let rand = Math.floor(Math.random() * 15) + 1;
if (rand==1) {
        popup.textContent = "hello";
    } else if(rand==2){
        popup.textContent = "ping";
    } else if(rand==3){
        popup.textContent = "never gonna give you up";
    } else if(rand==4){
        popup.textContent = "get back to work";
    } else if(rand==5){
        popup.textContent = "take a chill pill";
    }else if(rand==6){
        popup.textContent = "meow";
    }else if(rand==7){
        popup.textContent = "made by spoonstudios";
    }else if(rand==8){
        popup.textContent = "learn more coding";
    }else if(rand==9){
        popup.textContent = "qwerty123456";
    }else if(rand==10){
        popup.textContent = "how are you?";
    }else if(rand==11){
        popup.textContent = "buy army's hair insurance!";
    }else if(rand==12){
        popup.textContent = "this is painful eh?";
    }else if(rand==13){
        popup.textContent = "USE THE CODE 'ANNOY' TO GAIN 0% OFF NORDVPN";
    }else if(rand==14){
        popup.textContent = "running out of ideas";
    }else if(rand==15){
        popup.textContent = "eeeeeeeeeeeeeeeee";
    }
        const randomTop = Math.floor(Math.random() * 80) + 10;
        const randomLeft = Math.floor(Math.random() * 80) + 10;
        Object.assign(popup.style, {
        position: 'fixed',
        top: `${randomTop}%`,
         left: `${randomLeft}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px 40px',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        zIndex: 99999,
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center',
    });
 
        // Click to remove
        popup.addEventListener('click', () => popup.remove());
        document.body.appendChild(popup);
 
        // Optional: remove after 5 seconds
 
    }
    function createPopup2(message, yOffset) {
        const popup = document.createElement('div');
        popup.textContent = message;
         let rand = Math.floor(Math.random() * 15) + 1;
if (rand==1) {
        popup.textContent = "hello >:)";
    } else if(rand==2){
        popup.textContent = "PING";
    } else if(rand==3){
        popup.textContent = "never gonna let you down";
    } else if(rand==4){
        popup.textContent = "GET BACK TO WORK";
    } else if(rand==5){
        popup.textContent = "thinking of original idea";
    }else if(rand==6){
        popup.textContent = "what is brown and sticky";
    }else if(rand==7){
        popup.textContent = "a stick hahaha";
    }else if(rand==8){
        popup.textContent = "amoung us is awesome";
    }else if(rand==9){
        popup.textContent = "I'M INVINCIBLE";
    }else if(rand==10){
        popup.textContent = "If your code is running into a TLE, then make sure to check the constant factors!";
    }else if(rand==11){
        popup.textContent = "did you know that '\n' is faster than endl?";
    }else if(rand==12){
        popup.textContent = "its a bird its a plane its a thing!";
    }else if(rand==13){
        popup.textContent = "USE THE CODE 'HAWHAW' TO LOSE ALL YOUR MONEY";
    }else if(rand==14){
        popup.textContent = "aaaaaaaaaaaa";
    }else if(rand==15){
        popup.textContent = "spammers sux";
    }
        const randomTop = Math.floor(Math.random() * 80) + 10;
        const randomLeft = Math.floor(Math.random() * 80) + 10;
        Object.assign(popup.style, {
        position: 'fixed',
        top: `${randomTop}%`,
         left: `${randomLeft}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px 40px',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        zIndex: 99999,
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center',
    });
 
        // Click to remove
        document.body.appendChild(popup);
 
    }
    function createPopup22(message, yOffset) {
        let rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand);rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand);
 
    }
 
    // Display 3 popups stacked vertically
     let rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand); rand = Math.floor(Math.random() * 300) -150;
    createPopup("yay", rand);
    setInterval(createPopup, 1000);
    setInterval(createPopup2, 10000);
    setInterval(createPopup22, 100000);
})();