// ==UserScript==
// @name         Drawaria Cat On Dekstop
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Рыжий мурик бегает, кушает еду, эмоции и фразы.
// @author       𝙎𝙞𝙡𝙡𝙮 𝘾𝙖𝙩`
// @match        https://drawaria.online/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550589/Drawaria%20Cat%20On%20Dekstop.user.js
// @updateURL https://update.greasyfork.org/scripts/550589/Drawaria%20Cat%20On%20Dekstop.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
    let lang = null;
    const phrases = {
        "ru":["Ммм вкусно!","Ой я устал, перетащи меня до еды","Ням-ням","Где моя еда?","Люблю спать после еды"],
        "en":["Yum!","I'm tired, drag me to food","Nom nom","Where's my food?","I love sleeping after food"]
    };

  
    const menuLang = document.createElement("div");
    menuLang.style.position = "fixed";
    menuLang.style.top = "50%";
    menuLang.style.left = "50%";
    menuLang.style.transform = "translate(-50%,-50%)";
    menuLang.style.background = "#ffcc66";
    menuLang.style.padding = "20px";
    menuLang.style.borderRadius = "10px";
    menuLang.style.textAlign = "center";
    menuLang.style.zIndex = "9999";

    const title = document.createElement("h2");
    title.innerText = "Выберите язык | Choose language";
    menuLang.appendChild(title);

    const btnRu = document.createElement("button");
    btnRu.innerText = "Русский";
    btnRu.style.margin = "10px";
    btnRu.onclick = ()=>{ lang="ru"; menuLang.remove(); startMurik(); };
    menuLang.appendChild(btnRu);

    const btnEn = document.createElement("button");
    btnEn.innerText = "English";
    btnEn.style.margin = "10px";
    btnEn.onclick = ()=>{ lang="en"; menuLang.remove(); startMurik(); };
    menuLang.appendChild(btnEn);

    document.body.appendChild(menuLang);

 
    function startMurik(){
       
        const murik = document.createElement("div");
        murik.style.position="fixed";
        murik.style.left="200px";
        murik.style.top="200px";
        murik.style.fontSize="40px";
        murik.style.cursor="grab";
        murik.innerText = "😺";
        document.body.appendChild(murik);

      
        const murikText = document.createElement("div");
        murikText.style.position="fixed";
        murikText.style.left="0px";
        murikText.style.top="0px";
        murikText.style.background="white";
        murikText.style.padding="2px 6px";
        murikText.style.borderRadius="5px";
        murikText.style.opacity="0";
        murikText.style.transition="opacity 0.3s";
        murikText.style.zIndex="10000";
        document.body.appendChild(murikText);

        function updateTextPosition(){
            const rect = murik.getBoundingClientRect();
            murikText.style.left = rect.left + "px";
            murikText.style.top = (rect.top - 30) + "px";
        }

       
        const foodEmojis = ["🍄","🍫","🍜","🍔","🦑","🍘","🌭","🥝","🍟","🧀","🍍","🥐"];
        const foods = [];

        function spawnFood(){
            const food = document.createElement("div");
            food.style.position="fixed";
            food.style.fontSize="30px";
            food.style.left = Math.random()*window.innerWidth + "px";
            food.style.top = Math.random()*window.innerHeight + "px";
            food.innerText = foodEmojis[Math.floor(Math.random()*foodEmojis.length)];
            food.style.cursor="pointer";
            document.body.appendChild(food);
            foods.push(food);

            
            let draggingFood=false, offsetX=0, offsetY=0;
            food.addEventListener("mousedown", e=>{
                draggingFood=true;
                offsetX=e.clientX - food.getBoundingClientRect().left;
                offsetY=e.clientY - food.getBoundingClientRect().top;
                });
            document.addEventListener("mousemove", e=>{
                if(draggingFood){
                    food.style.left = e.clientX - offsetX + "px";
                    food.style.top = e.clientY - offsetY + "px";
                }
            });
            document.addEventListener("mouseup", ()=>{draggingFood=false;});
        }

        
        spawnFood();
        setInterval(spawnFood, 60000);

       
        let dragging=false, offsetX=0, offsetY=0;
        murik.addEventListener("mousedown", e=>{
            dragging=true;
            offsetX=e.clientX - murik.getBoundingClientRect().left;
            offsetY=e.clientY - murik.getBoundingClientRect().top;
            murik.innerText="😾"; // злое лицо при перетаскивании
        });
        document.addEventListener("mousemove", e=>{
            if(dragging){
                murik.style.left = e.clientX - offsetX + "px";
                murik.style.top = e.clientY - offsetY + "px";
                updateTextPosition();
            }
        });
        document.addEventListener("mouseup", ()=>{
            if(dragging){
                dragging=false;
                murik.innerText="😺"; // нормальное лицо
            }
        });

      
        function randomMove(){
            if(!dragging){
                const x = Math.random()*window.innerWidth;
                const y = Math.random()*window.innerHeight;
                const rect = murik.getBoundingClientRect();
                const dx = x - rect.left;
                const dy = y - rect.top;
                const steps = 50;
                let step=0;
                const interval = setInterval(()=>{
                    if(dragging){ clearInterval(interval); return; }
                    murik.style.left = rect.left + dx*(step/steps) + "px";
                    murik.style.top = rect.top + dy*(step/steps) + "px";
                    updateTextPosition();
                    step++;
                    if(step>steps) clearInterval(interval);
                },50);
            }
        }
        setInterval(()=>{
            randomMove();
            if(Math.random()<0.5){ // с 50% шансом говорит
                const phrase = phrases[lang][Math.floor(Math.random()*phrases[lang].length)];
                murikText.innerText = phrase;
                murikText.style.opacity="1";
                updateTextPosition();
                setTimeout(()=>{murikText.style.opacity="0";},3000);
            }
        },5000);

       
        function checkFoodCollision() {
            const murikRect = murik.getBoundingClientRect();
            foods.forEach((food,index)=>{
                const foodRect = food.getBoundingClientRect();
                const overlap = !(murikRect.right < foodRect.left ||
                                  murikRect.left > foodRect.right ||
                                  murikRect.bottom < foodRect.top ||
                                  murikRect.top > foodRect.bottom);
                if(overlap){
                    food.remove();
                    foods.splice(index,1);
                    const oldEmoji = murik.innerText;
                    murik.innerText="😻";
                    setTimeout(()=>{murik.innerText=oldEmoji},3000);
                    const phrase = phrases[lang][Math.floor(Math.random()*phrases[lang].length)];
                    murikText.innerText=phrase;
                    murikText.style.opacity="1";
                    updateTextPosition();
                    setTimeout(()=>{murikText.style.opacity="0";},3000);
                }
            });
        }
        setInterval(checkFoodCollision,200);
    }
})();