// ==UserScript==
// @name         Music Player Lite
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Простой музыкальный плеер в стиле оригинала
// @author       𝙎𝙞𝙡𝙡𝙮 𝘾𝙖𝙩`
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560095/Music%20Player%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/560095/Music%20Player%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentAudio = null;
    let currentSongName = '';

    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '15px',
        background: '#333',
        border: '2px solid #fff',
        borderRadius: '10px',
        zIndex: 9999,
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        cursor: 'move',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        width: '220px'
    });

    const currentSong = document.createElement('div');
    currentSong.id = 'currentSong';
    currentSong.style.marginBottom = '10px';
    currentSong.textContent = 'Current song: None';
    menu.appendChild(currentSong);

    function createButton(text, onClick){
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style,{
            color: '#fff',
            background: '#555',
            border: '1px solid #fff',
            borderRadius: '5px',
            padding: '5px',
            cursor: 'pointer'
        });
        btn.onclick = onClick;
        menu.appendChild(btn);
        return btn;
    }

    createButton('Play Song', ()=> {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mp3,.wav';
        input.onchange = e => {
            const file = e.target.files[0];
            if(file) playSong(file);
        };
        input.click();
    });

    createButton('Stop Music', ()=> stopAudio());

    const visualizer = document.createElement('div');
    visualizer.id = 'visualizer';
    Object.assign(visualizer.style, {
        marginTop: '10px',
        width: '100%',
        height: '20px',
        background: '#333'
    });
    menu.appendChild(visualizer);

    document.body.appendChild(menu);

   
    let isDragging = false, offsetX, offsetY;
    menu.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
    });

    document.addEventListener('mouseup', () => isDragging = false);

    document.addEventListener('mousemove', e => {
        if(isDragging) {
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
            menu.style.transform = 'translate(0,0)';
        }
    });

   
    function playSong(file){
        if(currentAudio) stopAudio();

        currentAudio = new Audio(URL.createObjectURL(file));
        currentSongName = file.name;
        currentSong.textContent = 'Current song: ' + currentSongName;
        currentAudio.loop = true;
        currentAudio.play();

        setupVisualizer(currentAudio);
    }

    function stopAudio(){
        if(currentAudio){
            currentAudio.pause();
            currentAudio = null;
            currentSongName = '';
            currentSong.textContent = 'Current song: None';

            // Сброс визуализатора
            visualizer.style.background = '#333';
            menu.style.background = '#333';
        }
    }

    
    function setupVisualizer(audio){
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();

        src.connect(analyser);
        analyser.connect(ctx.destination);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function animate(){
            if(!currentAudio) return;

            requestAnimationFrame(animate);
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for(let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }

            let avg = sum / bufferLength;
            let level = Math.min(100, (avg / 255) * 100);

           
            visualizer.style.background = "linear-gradient(to right, #00ff00 " + level + "%, #333 " + level + "%)";

           
            let hue = Math.floor((avg / 255) * 360);
            menu.style.background = "hsl(" + hue + ",50%,30%)";
        }

        animate();
    }

})();