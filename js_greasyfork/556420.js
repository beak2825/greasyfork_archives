// ==UserScript==
// @name         BlackRussia | New Year ULTRA PACK 2025 by A.Vendetta
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Полный Новый Год на форуме — огни, снег, шапки, анимации, звуки, искры 🎅❄️
// @match        https://forum.blackrussia.online/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556420/BlackRussia%20%7C%20New%20Year%20ULTRA%20PACK%202025%20by%20AVendetta.user.js
// @updateURL https://update.greasyfork.org/scripts/556420/BlackRussia%20%7C%20New%20Year%20ULTRA%20PACK%202025%20by%20AVendetta.meta.js
// ==/UserScript==

(function () {

 
    const clickSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-small-snow-crunch-1903.mp3");
    clickSound.volume = 0.4;
    let interacted = false;

    document.addEventListener("click", () => {
        if (!interacted) interacted = true;
        clickSound.currentTime = 0;
        clickSound.play().catch(()=>{});
    });

    const bar = document.createElement("div");
    bar.style.position = "fixed";
    bar.style.top = "0";
    bar.style.left = "0";
    bar.style.height = "4px";
    bar.style.background = "linear-gradient(90deg,#00d4ff,#ffffff,#00d4ff)";
    bar.style.backgroundSize = "200% 200%";
    bar.style.animation = "snowLoad 2s infinite linear";
    bar.style.zIndex = "999999";
    bar.style.width = "0%";
    document.body.appendChild(bar);

    window.addEventListener("load", () => {
        bar.style.transition = "1s";
        bar.style.width = "100%";
        setTimeout(()=>bar.remove(),1500);
    });

   
    const garland = document.createElement("div");
    garland.innerHTML = `<div class="garland">${"<span></span>".repeat(45)}</div>`;
    document.body.appendChild(garland);

    addStyle(`
        .message-inner {
            border: 2px solid rgba(255,255,255,0.4) !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px);
            box-shadow: 0 0 10px #aeeaff inset;
        }
    `);

  
    addStyle(`
        .message-avatar img {
            border: 3px solid #b8ecff !important;
            box-shadow: 0 0 15px #89d6ff;
            border-radius: 10px;
        }
    `);

  
   
    const hatURL = "https://i.pinimg.com/originals/87/59/7f/87597febae3c6689d3dda22b7fd16b28.png";
    addStyle(`
        .message-avatar {
            position: relative !important;
        }
        .message-avatar::after {
            content: "";
            position: absolute;
            top: -18px;
            left: -5px;
            width: 60px;
            height: 60px;
            background-image: url('${hatURL}');
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 5;
            pointer-events: none;
        }
    `);

  
    setInterval(() => {
        const logo = document.querySelector(".p-header-logo img");
        if (logo) logo.src = "https://cdn.jsdelivr.net/gh/ArsenyVendetta/media/newyear-logo.png";
    }, 800);

   
    addStyle(`
        .userTitle {
            background: linear-gradient(90deg,#ff2a2a,#ffb92a,#33d4ff);
            -webkit-background-clip: text;
            color: transparent !important;
            font-weight: 900;
        }
    `);

    
    addStyle(`
        .message {
            animation: msgAppear .6s ease forwards;
        }
    `);

    document.addEventListener("click", function(e) {
        const spark = document.createElement("div");
        spark.className = "spark";
        spark.style.left = e.pageX + "px";
        spark.style.top = e.pageY + "px";
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
    });

    
    addSnow();

    addStyle(`
        @keyframes avatarLights {
            0% { box-shadow: 0 0 10px red; }
            50% { box-shadow: 0 0 15px yellow; }
            100% { box-shadow: 0 0 10px red; }
        }

        @keyframes snowLoad {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        .garland {
            position: fixed;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            z-index: 9999;
        }
        .garland span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: blink 1s infinite;
            background: red;
        }
        @keyframes blink {
            0% { opacity: .2; transform: scale(.8); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: .2; transform: scale(.8); }
        }

        @keyframes msgAppear {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .spark {
            position: absolute;
            width: 10px;
            height: 10px;
            background: radial-gradient(white, transparent);
            border-radius: 50%;
            transform: scale(2);
            animation: sparkAnim .6s ease-out;
            pointer-events: none;
        }
        @keyframes sparkAnim {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(3); }
        }

        .snowflake {
            position: fixed;
            top: -10px;
            color: white;
            font-size: 12px;
            animation: fall linear infinite;
            z-index: 99999;
        }
        @keyframes fall {
            0% { transform: translateY(0); }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    `);

   
    function addStyle(css) {
        const s = document.createElement("style");
        s.innerHTML = css;
        document.head.appendChild(s);
    }

    function addSnow() {
        setInterval(() => {
            const f = document.createElement("div");
            f.innerHTML = "❄";
            f.className = "snowflake";
            f.style.left = Math.random() * 100 + "vw";
            f.style.animationDuration = (3 + Math.random()*5) + "s";
            document.body.appendChild(f);
            setTimeout(() => f.remove(), 8000);
        }, 200);
    }

})()