// ==UserScript==
// @name         BLOODbot v1
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  URL tabanlı bot sokma ve random profil sistemi
// @author       Sen
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562774/BLOODbot%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/562774/BLOODbot%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rastgele isim havuzu
    const isimler = ["Bot"];

    // Mod Menü Tasarımı
    let menu = document.createElement('div');
    menu.id = "bot_menu_main";
    menu.innerHTML = `
        <div style="position:fixed; top:20px; right:20px; z-index:10000; background:#1a1a1a; color:#fff; padding:20px; border:2px solid #555; border-radius:12px; width:250px; font-family:sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <h2 style="text-align:center; font-size:16px; margin-top:0;">Gartic Bot Control</h2>

            <label style="font-size:12px;">Oda URL veya Kod:</label>
            <input type="text" id="room_url" placeholder="https://gartic.io/01234" style="width:100%; padding:8px; margin:5px 0 15px 0; border-radius:5px; border:none; color:#000;">

            <button id="btn_add_bot" style="width:100%; padding:10px; background:#28a745; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; margin-bottom:10px;">+ BOT EKLE</button>

            <div id="bot_status" style="font-size:11px; color:#aaa; text-align:center;">Bağlı Bot Sayısı: 0</div>
        </div>
    `;
    document.body.appendChild(menu);

    let botCount = 0;

    // Bot Ekleme Fonksiyonu
    document.getElementById('btn_add_bot').onclick = function() {
        let inputUrl = document.getElementById('room_url').value;
        let roomCode = inputUrl.split('/').pop(); // URL'den son kısmı (kodu) alır.

        if(!roomCode) {
            alert("Lütfen geçerli bir Oda URL'si girin!");
            return;
        }

        // Random Profil Oluşturma
        let randomIsim = isimler[Math.floor(Math.random() * isimler.length)] + "_" + Math.floor(Math.random() * 999);
        let randomAvatar = Math.floor(Math.random() * 30); // Gartic'te genelde 0-30 arası avatar indexleri olur.

        console.log(`Bot Hazırlanıyor: ${randomIsim}, Oda: ${roomCode}`);

        // Botu Odaya Sokma Mantığı (WebSocket Simülasyonu)
        connectBot(roomCode, randomIsim, randomAvatar);

        botCount++;
        document.getElementById('bot_status').innerText = `Bağlı Bot Sayısı: ${botCount}`;
    };

    function connectBot(code, nick, avatar) {
        // Burada gerçek WebSocket bağlantısı kurulacak.
        // Gartic'in kullandığı port ve server adresini çekmek gerekir.
        // Örnek: let socket = new WebSocket('wss://server.gartic.io/socket.io/?EIO=3&transport=websocket');

        console.log(`${nick} isimli bot ${code} kodlu odaya gönderiliyor...`);

        /* GELİŞTİRME NOTU:
           Burada socket.send('42[1, {"v": 20000, "nick": "'+nick+'", "avatar": '+avatar+', "room": "'+code+'"}]')
           benzeri bir veri paketi gönderilmelidir.
        */
    }

})();