// ==UserScript==
// @name         Drawaria Cat On Dekstop V2
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Интерактивный питомец на экране, много багов!
// @author       𝙎𝙞𝙡𝙡𝙮 𝘾𝙖𝙩`
// @match        https://drawaria.online/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550735/Drawaria%20Cat%20On%20Dekstop%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/550735/Drawaria%20Cat%20On%20Dekstop%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let currency = GM_getValue('murik_currency', 0);
    let lang = GM_getValue('murik_lang','ru');

    const phrasesRU = [
        "Ммм вкусно!","Ням-ням","Где моя еда?","Люблю спать после еды",
        "Поиграем?","Погладь меня","Хочу игрушку","Сонный мурик"
    ];
    const phrasesEN = [
        "Mmm tasty!","Yum-yum","Where's my food?","Love to sleep after eating",
        "Let's play!","Pet me","I want a toy","Sleepy Murik"
    ];
    let phrases = lang==='ru'? [...phrasesRU] : [...phrasesEN];

   
    const phone = document.createElement('div');
    Object.assign(phone.style,{
        position:'fixed', width:'280px', height:'520px', bottom:'20px', right:'20px',
        background:'#1a1a1a', borderRadius:'25px', border:'3px solid #444', zIndex:'9999',
        color:'#fff', fontFamily:'Arial, sans-serif', display:'flex', flexDirection:'column',
        boxShadow:'0 0 15px #000', cursor:'grab', padding:'10px'
    });
    document.body.appendChild(phone);

    const header = document.createElement('div');
    header.innerText = (lang==='ru'?'Монеты: ':'Coins: ')+currency;
    header.style.fontWeight='bold';
    header.style.fontSize='16px';
    header.style.marginBottom='8px';
    phone.appendChild(header);

    const buttonsContainer = document.createElement('div');
    Object.assign(buttonsContainer.style,{
        flex:'1', display:'flex', flexDirection:'column', gap:'6px', overflowY:'auto'
    });
    phone.appendChild(buttonsContainer);

    function createButton(text, onClick){
        const btn=document.createElement('button');
        btn.innerText=text;
        Object.assign(btn.style,{
            padding:'8px', borderRadius:'10px', border:'none', background:'#ffcc66',
            cursor:'pointer', fontWeight:'bold', fontSize:'14px', transition:'0.2s'
        });
        btn.onmouseover=()=>btn.style.background='#ffd966';
        btn.onmouseout=()=>btn.style.background='#ffcc66';
        btn.onclick=onClick;
        buttonsContainer.appendChild(btn);
        return btn;
    }

 
    const murik = document.createElement('div');
    Object.assign(murik.style,{
        position:'fixed', left:'200px', top:'200px', fontSize:'70px',
        userSelect:'none', zIndex:'999'
    });
    murik.innerText='😺';
    document.body.appendChild(murik);

    const murikText = document.createElement('div');
    Object.assign(murikText.style,{
        position:'fixed', left:'0px', top:'0px', background:'white', color:'#000', padding:'3px 6px',
        borderRadius:'6px', opacity:'0', transition:'opacity 0.3s', zIndex:'1000',
        pointerEvents:'none', fontSize:'14px'
    });
    document.body.appendChild(murikText);

    function showPhrase(text){
        murikText.innerText=text;
        murikText.style.opacity='1';
        const rect=murik.getBoundingClientRect();
        murikText.style.left=(rect.left)+'px';
        murikText.style.top=(rect.top-30)+'px';
        setTimeout(()=>{ murikText.style.opacity='0'; },3000);
    }


    setInterval(()=>{
        currency+=5;
        header.innerText=(lang==='ru'?'Монеты: ':'Coins: ')+currency;
        GM_setValue('murik_currency',currency);
    },1000);


    let draggingPhone=false, offsetX=0, offsetY=0;


phone.addEventListener('mousedown', e=>{
        draggingPhone=true;
        offsetX=e.clientX-phone.getBoundingClientRect().left;
        offsetY=e.clientY-phone.getBoundingClientRect().top;
        phone.style.cursor='grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', e=>{
        if(draggingPhone){
            phone.style.left=(e.clientX-offsetX)+'px';
            phone.style.top=(e.clientY-offsetY)+'px';
            phone.style.bottom='auto'; phone.style.right='auto';
        }
    });
    document.addEventListener('mouseup', ()=>{ if(draggingPhone){ draggingPhone=false; phone.style.cursor='grab'; } });


    let draggingMurik=false, mOffsetX=0, mOffsetY=0;
    murik.addEventListener('mousedown', e=>{
        draggingMurik=true;
        mOffsetX=e.clientX-murik.getBoundingClientRect().left;
        mOffsetY=e.clientY-murik.getBoundingClientRect().top;
        murik.innerText='😾';
        e.preventDefault();
    });
    document.addEventListener('mousemove', e=>{
        if(draggingMurik){
            murik.style.left=(e.clientX-mOffsetX)+'px';
            murik.style.top=(e.clientY-mOffsetY)+'px';
            murikText.style.left=(e.clientX-mOffsetX)+'px';
            murikText.style.top=(e.clientY-mOffsetY-30)+'px';
        }
    });
    document.addEventListener('mouseup', ()=>{ if(draggingMurik){ draggingMurik=false; murik.innerText='😺'; } });

   
    let dirX=1, dirY=1;
    setInterval(()=>{
        if(!draggingMurik){
            let left=parseInt(murik.style.left);
            let top=parseInt(murik.style.top);
            left+=dirX*1;
            top+=dirY*1;
            if(left<0||left>window.innerWidth-50) dirX*=-1;
            if(top<0||top>window.innerHeight-50) dirY*=-1;
            murik.style.left=left+'px';
            murik.style.top=top+'px';
            murikText.style.left=left+'px';
            murikText.style.top=(top-30)+'px';
        }
    },20);

    
    setInterval(()=>{
        const phrase=phrases[Math.floor(Math.random()*phrases.length)];
        showPhrase(phrase);
    },4000);


    function openShop(items,title){
        const existing=document.getElementById('murikShop'); if(existing){ existing.remove(); return; }
        const shop=document.createElement('div'); shop.id='murikShop';
        Object.assign(shop.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            background:'#333', color:'#fff', padding:'15px', borderRadius:'10px', zIndex:'10001', minWidth:'250px'
        });
        const h=document.createElement('div'); h.innerText=title; h.style.fontWeight='bold'; h.style.marginBottom='8px'; shop.appendChild(h);

        items.forEach(item=>{
            const btn=document.createElement('button');
            btn.innerText=`${item.name} - ${item.cost} монет;`
            Object.assign(btn.style,{margin:'2px', padding:'5px', borderRadius:'5px', cursor:'pointer', width:'100%'});
            btn.onclick=()=>{
                if(currency>=item.cost){
                    currency-=item.cost; GM_setValue('murik_currency',currency);
                    header.innerText=(lang==='ru'?'Монеты: ':'Coins: ')+currency;
                    reactToPurchase(item.name);
                } else showPhrase('Недостаточно монет!');
            };
            shop.appendChild(btn);
        });

        const close=document.createElement('button'); close.innerText='❌ Закрыть';
        Object.assign(close.style,{marginTop:'5px',padding:'5px',borderRadius:'5px',cursor:'pointer', width:'100%'});
        close.onclick=()=>shop.remove(); shop.appendChild(close);
        document.body.appendChild(shop);
    }


function reactToPurchase(name){
        let reaction='';
        switch(name){
            case '🍕 Пепперони': reaction='Ооо, Пепперони!'; break;
            case '🪓 Топор': reaction='Эм? Зачем он мне?'; break;
            case '⛑ Каска': reaction='Эм… защита?'; break;
            case '🍎 Яблоко': reaction='Яблочко, спасибо!'; break;
            case '💻 ПК': reaction='Вау, ПК!'; break;
            case '🐟 Рыба': reaction='Рыбка, ням!'; break;
            case '🎂 Торт': reaction='Тортик!'; break;
            case '🥟 Пирожок с Мясом': reaction='Пирожок, вкусно!'; break;
            case '🧸 Игрушки Starter': reaction='Игрушка!'; break;
            case '🎁 Игрушки Luxury': reaction='Люкс игрушка!'; break;
            case '🏠 Большая Клетка': reaction='Большая клетка!'; break;
            case '🍲 Миска с Едой': reaction='Миска с едой!'; break;
            default: reaction=`Куплено: ${name};`
        }
        showPhrase(reaction);
    }

    createButton('🛒 Магазин', ()=>{
        openShop([
            {name:'🍎 Яблоко', cost:10},
            {name:'🐟 Рыба', cost:20},
            {name:'⛑ Каска', cost:50},
            {name:'🪓 Топор', cost:60


},
            {name:'🎂 Торт', cost:40},
            {name:'🥟 Пирожок с Мясом', cost:30},
            {name:'💻 ПК', cost:500}
        ], lang==='ru'?'Магазин':'Shop');
    });

    createButton('🍕 Доставка Пиццы', ()=>{
        openShop([
            {name:'🧀 4 Сыра', cost:50},
            {name:'🍕 Пепперони', cost:70},
            {name:'🍫 Вкуснятина', cost:40}
        ], lang==='ru'?'Доставка Пиццы':'Pizza Delivery');
    });

    createButton('🌐 Браузер', ()=>{
        openBrowser();
    });

    createButton('🐾 ЗооДоставка', ()=>{
        openShop([
            {name:'🏠 Большая Клетка', cost:100},
            {name:'🎁 Игрушки Luxury', cost:200},
            {name:'🧸 Игрушки Starter', cost:50},
            {name:'🍲 Миска с Едой', cost:20}
        ], lang==='ru'?'ЗооДоставка':'Zoo Delivery');
    });

    createButton('🌐 Language', ()=>{
        openLanguageMenu();
    });

    createButton('🎵 Плеер', ()=>{
        openPlayer();
    });

    createButton('🍳 Рецепты', ()=>{
        openRecipes();
    });

    createButton('🛠 Крафт', ()=>{
        openCrafting();
    });

    createButton('🎮 Мини-игры', ()=>{
        openMiniGames();
    });

    

    function openBrowser(){
        const existing=document.getElementById('murikBrowser'); if(existing){ existing.remove(); return; }
        const browser=document.createElement('div'); browser.id='murikBrowser';
        Object.assign(browser.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            width:'350px', height:'400px', background:'#222', color:'#fff', borderRadius:'10px', padding:'10px', zIndex:'10001', display:'flex', flexDirection:'column'
        });
        const input=document.createElement('input'); input.placeholder=lang==='ru'?'Введите запрос...':'Type query...';
        Object.assign(input.style,{width:'100%', padding:'5px', marginBottom:'5px', borderRadius:'5px', border:'none'});
        const out=document.createElement('div'); out.style.flex='1'; out.style.background='#111'; out.style.borderRadius='5px'; out.style.padding='5px'; out.style.overflow='auto';
        out.innerText=lang==='ru'?'Нет Интернета. Проверьте подключение.':'No Internet. Check connection.';
        input.addEventListener('keydown', e=>{
            if(e.key==='Enter'){
                out.innerText='🦖 Мини-игра динозаврика!';
            }
        });
        browser.appendChild(input);
        browser.appendChild(out);

        const close=document.createElement('button'); close.innerText='❌ '+(lang==='ru'?'Закрыть':'Close');
        Object.assign(close.style,{marginTop:'5px',padding:'5px',borderRadius:'5px',cursor:'pointer', width:'100%'});
        close.onclick=()=>browser.remove(); browser.appendChild(close);
        document.body.appendChild(browser);
    }

    function openLanguageMenu(){
        const existing=document.getElementById('murikLang'); if(existing){ existing.remove(); return; }
        const langMenu=document.createElement('div'); langMenu.id='murikLang';
        Object.assign(langMenu.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            background:'#333', color:'#fff', padding:'15px', borderRadius:'10px', zIndex:'10001', minWidth:'200px'
        });
        const ruBtn=document.createElement('button'); ruBtn.innerText='Русский'; ruBtn.style.width='100%';
        ruBtn.onclick=()=>{ lang='ru'; GM_setValue('murik_lang','ru'); phrases=[...phrasesRU]; langMenu.remove(); };
        const enBtn=document.createElement('button'); enBtn.innerText='English'; enBtn.style.width='100%';
        enBtn.onclick=()=>{ lang='en'; GM_setValue('murik_lang','en'); phrases=[...phrasesEN]; langMenu.remove(); };
        langMenu.appendChild(ruBtn); langMenu.appendChild(enBtn);

        document.body.appendChild(langMenu);
    }

function openPlayer(){
        const existing=document.getElementById('murikPlayer'); if(existing){ existing.remove(); return; }
        const player=document.createElement('div'); player.id='murikPlayer';
        Object.assign(player.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            background:'#222', color:'#fff', padding:'15px', borderRadius:'10px', zIndex:'10001', minWidth:'250px'
        });

        const fileInput=document.createElement('input'); fileInput.type='file'; fileInput.accept='audio/mp3';
        fileInput.style.width='100%';
        const audio=document.createElement('audio'); audio.controls=false;
        const playBtn=document.createElement('button'); playBtn.innerText='Play'; playBtn.style.width='100%';
        const stopBtn=document.createElement('button'); stopBtn.innerText='Stop'; stopBtn.style.width='100%';
        playBtn.onclick=()=>{
            if(fileInput.files[0]){
                audio.src=URL.createObjectURL(fileInput.files[0]);
                audio.play();
            }
        };
        stopBtn.onclick=()=>{ audio.pause(); audio.currentTime=0; };

        player.appendChild(fileInput);
        player.appendChild(playBtn);
        player.appendChild(stopBtn);

        const close=document.createElement('button'); close.innerText='❌ '+(lang==='ru'?'Закрыть':'Close'); close.style.width='100%';
        close.onclick=()=>player.remove();
        player.appendChild(close);

        document.body.appendChild(player);
    }

    function openRecipes(){
        const existing=document.getElementById('murikRecipes'); if(existing){ existing.remove(); return; }
        const recipes=document.createElement('div'); recipes.id='murikRecipes';
        Object.assign(recipes.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            background:'#444', color:'#fff', padding:'15px', borderRadius:'10px', zIndex:'10001', minWidth:'250px', maxHeight:'400px', overflowY:'auto'
        });
        const rlist=[
            lang==='ru'? 'Торт: 🎂 + 🥟' : 'Cake: 🎂 + 🥟',
            lang==='ru'? 'Суп: 🍲 + 🐟' : 'Soup: 🍲 + 🐟',
            lang==='ru'? 'Пирожок с мясом: 🥟 + 🐟' : 'Meat Pie: 🥟 + 🐟'
        ];
        rlist.forEach(r=>{ const div=document.createElement('div'); div.innerText=r; div.style.margin='2px 0'; recipes.appendChild(div); });
        const close=document.createElement('button'); close.innerText='❌ '+(lang==='ru'?'Закрыть':'Close'); close.style.width='100%';
        close.onclick=()=>recipes.remove(); recipes.appendChild(close);
        document.body.appendChild(recipes);
    }

    function openCrafting(){
        const existing=document.getElementById('murikCraft'); if(existing){ existing.remove(); return; }
        const craft=document.createElement('div'); craft.id='murikCraft';
        Object.assign(craft.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            background:'#555', color:'#fff', padding:'15px', borderRadius:'10px', zIndex:'10001', minWidth:'250px'
        });

        const craftList=[
            {name:lang==='ru'?'Торт':'Cake', ingredients:['🎂 Торт','🥟 Пирожок с Мясом']},
            {name:lang==='ru'?'Суп':'Soup', ingredients:['🍲 Миска с Едой','🐟 Рыба']}
        ];

        craftList.forEach(c=>{
            const btn=document.createElement('button');
            btn.innerText=c.name; btn.style.width='100%'; btn.style.margin='3px 0';
            btn.onclick=()=>{
                const hasAll=c.ingredients.every(i=>currency>=10);
               if(hasAll) {
    showPhrase`(${lang==='ru' ? 'Скрафчено: ' : 'Crafted: '}${c.name});`
}
                else showPhrase(lang==='ru'?'Недостаточно ингредиентов':'Not enough ingredients');
            };
            craft.appendChild(btn);
        });

const close=document.createElement('button'); close.innerText='❌ '+(lang==='ru'?'Закрыть':'Close'); close.style.width='100%';
        close.onclick=()=>craft.remove(); craft.appendChild(close);
        document.body.appendChild(craft);
    }

    function openMiniGames(){
        const existing=document.getElementById('murikMini'); if(existing){ existing.remove(); return; }
        const mini=document.createElement('div'); mini.id='murikMini';
        Object.assign(mini.style,{
            position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
            background:'#666', color:'#fff', padding:'15px', borderRadius:'10px', zIndex:'10001', minWidth:'250px'
        });

        const btnDino=document.createElement('button'); btnDino.innerText=lang==='ru'?'Динозаврик':'Dino'; btnDino.style.width='100%';
        btnDino.onclick=()=>{ showPhrase('🦖 Мини-игра динозаврика!'); };

        mini.appendChild(btnDino);

        const close=document.createElement('button'); close.innerText='❌ '+(lang==='ru'?'Закрыть':'Close'); close.style.width='100%';
        close.onclick=()=>mini.remove(); mini.appendChild(close);
        document.body.appendChild(mini);
    }

})();