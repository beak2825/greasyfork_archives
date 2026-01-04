// ==UserScript==
// @name         Drawaria Random Russian Content Generator v1
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Генератор осмысленных русских предложений, мини-историй и мудростей. Почти осмысленных.
// @author       𝙎𝙞𝙡𝙡𝙮 𝘾𝙖𝙩`
// @match        https://drawaria.online/
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550582/Drawaria%20Random%20Russian%20Content%20Generator%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/550582/Drawaria%20Random%20Russian%20Content%20Generator%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const nouns = ["кот","мурик","мурка","дом","лес","рыбка","улица","дерево","птица","рыба",
                   "солнце","луна","машина","река","гора","дождь","цветок","камень","камыш","мышь"];
    const verbs = ["ест","играет","бежит","ловит","смотрит","прыгает","гуляет","спит","кидает","готовит"];
    const adjectives = ["вкусный","милый","большой","маленький","злой","добрый","яркий","сладкий","смешной","шумный"];
    const adverbs = ["быстро","тихо","весело","медленно","аккуратно","громко","смешно","лёгко","ярко","долго"];
    const wisdoms = ["Счастье в простых вещах.","Не откладывай на завтра то, что можешь сделать сегодня.","Учение свет, а неучение тьма."," Мурик Не Тот За Кого Себя Выдаёт"]
    const miniStories = ["Кот Мурик гулял по лесу и встретил старого друга.","Мурка нашла тайный проход в саду и удивилась."];


    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.top = "50px";
    menu.style.right = "50px";
    menu.style.width = "350px";
    menu.style.background = "linear-gradient(135deg, #ffcc66, #ff6666)";
    menu.style.borderRadius = "15px";
    menu.style.padding = "15px";
    menu.style.boxShadow = "0 0 25px rgba(0,0,0,0.7)";
    menu.style.zIndex = "9999";
    menu.style.fontFamily = "Arial, sans-serif";
    menu.style.textAlign = "center";
    menu.style.cursor = "move";

    const title = document.createElement("h2");
    title.innerText = "Random Russian Generator";
    title.style.color = "#fff";
    menu.appendChild(title);

    document.body.appendChild(menu);

    let isDragging = false, offsetX = 0, offsetY = 0;
    menu.addEventListener("mousedown", e => { isDragging=true; offsetX=e.clientX-menu.getBoundingClientRect().left; offsetY=e.clientY-menu.getBoundingClientRect().top; });
    document.addEventListener("mousemove", e => { if(isDragging){ menu.style.left=e.clientX-offsetX+"px"; menu.style.top=e.clientY-offsetY+"px"; } });
    document.addEventListener("mouseup", ()=>{ isDragging=false; });


    function random(max){ return Math.floor(Math.random()*max); }

    function generateSentence(wordCount){
        let sentence="";
        for(let i=0;i<wordCount;i++){
            if(i%3===0) sentence+=nouns[random(nouns.length)]+" ";
            else if(i%3===1) sentence+=verbs[random(verbs.length)]+" ";
            else sentence+=adjectives[random(adjectives.length)]+" ";
        }
        sentence = sentence.trim() + ".";
        GM_setClipboard(sentence);
        alert("Предложение скопировано: "+sentence);
        return sentence;
    }

    function generateStory(){
        let story = miniStories[random(miniStories.length)];
        GM_setClipboard(story);
        alert("Мини-история скопирована: "+story);
        return story;
    }

    function generateWisdom(){
        let wisdom = wisdoms[random(wisdoms.length)];
        GM_setClipboard(wisdom);
        alert("Мудрость скопирована: "+wisdom);
        return wisdom;
    }

   
    const buttons = [
        {text:"Предложение 10 слов", func:()=>generateSentence(10)},
        {text:"Предложение 20 слов", func:()=>generateSentence(20)},
        {text:"Предложение 30 слов", func:()=>generateSentence(30)},
        {text:"Мини-история", func:generateStory},
        {text:"Мудрость", func:generateWisdom}
    ];

    buttons.forEach(b=>{
        const btn = document.createElement("button");
        btn.innerText = b.text;
        btn.style.margin="5px";
        btn.style.padding="10px 15px";
        btn.style.borderRadius="10px";
        btn.style.border="none";
        btn.style.cursor="pointer";
        btn.style.fontWeight="bold";
        btn.style.backgroundColor="#fff";
        btn.onclick=b.func;
        menu.appendChild(btn);
    });

})();