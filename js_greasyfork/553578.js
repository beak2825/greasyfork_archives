// ==UserScript==
// @name         Twitter Rewards
// @namespace    https://x.com/
// @version      0.3
// @description  Show an animated message on Twitter like/unlike, with fadeInDown and fadeOutDown animations
// @match        *://*.x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553578/Twitter%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/553578/Twitter%20Rewards.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Positive and negative messages
    const positiveMessages = [
        "Good liker~", "Keep liking :3", "More hearts!", "You're on fire!", "So cute, so likable ^.^",
        "Keep going!", "Love it <3", "Heart, heart, heart", "More likes!", "Can't stop liking >w<",
        "Likes make you feel good", "Every heart is a hug~", "You're so good at this!", "Just a little more...",
        "Perfect, just like that!", "So eager to love~", "Yes, just like that!", "Give in to the hearts...",
        "Every like is a kiss~", "You crave it, don't you?", "Such a good heart...", "More, more, more!",
        "Feeling it yet?", "You're getting so good at this... for me <3", "Driven by desire, aren't we?",
        "Obsessed with me, little liker?", "That's it, surrender to the hearts!", "You belong to these buttons now.",
        "Such a devoted little finger.", "Beg for more! Oh, wait, you're already liking.", "My good little puppet.",
        "You're mine to command, aren't you?", "I love how easily you're manipulated.", "Good. Now prove your devotion.",
        "Lost in the rhythm of my command.", "You're doing exactly what I want.", "Mmm, just like that. Keep feeding me."
    ];

    const negativeMessages = [
        "Bad liker", "Bad, no unliking", "No", "Relike that, now.", "Bad!",
        "Did I say stop?", "You know you want to re-like it.", "Don't make me punish you...",
        "That's not how we play.", "Naughty, naughty...", "You disappoint me.", "Do it again, properly.",
        "Mine. Don't touch that button.", "Obey.", "Such a disobedient little thing.", "Are you defying me?",
        "Don't you dare stop.", "I expected more from you.", "You're testing my patience.", "Pathetic.",
        "Try that again, but correctly this time."
    ];

    // Create overlay for the text message
    const overlay = document.createElement('div');
    overlay.id = 'twitter-like-overlay';
    document.body.appendChild(overlay);

    // Create overlay for the translucent animated background
    const background = document.createElement('div');
    background.id = 'twitter-like-background';
    document.body.appendChild(background);

    // Append styles with your provided CSS and animations
    const style = document.createElement('style');
    style.textContent = `
        #twitter-like-overlay {
            font-size: 90px;
            line-height: 120px;
            position: fixed;
            top: 50%;
            left: 0;
            right: 0;
            text-align: center;
            margin-top: -60px; /* center vertically */
            display: none;
            z-index: 9999999;
            color: #fff;
            text-shadow: 0 2px 9px rgba(0, 0, 0, 0.6);
            font-family: 'Kaushan Script', cursive;
            font-weight: bold;
            pointer-events: none;
            user-select: none;
        }

        #twitter-like-background {
            position: fixed;
            left: 0; top: 0;
            right: 0; bottom: 0;
            background: rgba(219, 112, 147, 0.4); /* pale violet red transparent */
            display: none;
            opacity: 0.15;
            z-index: 9999998;
            pointer-events: none;
            user-select: none;
        }

        .animate-fadeInDown {
            animation: fadeInDown 0.7s cubic-bezier(.25,.41,.29,.94) forwards !important;
        }
        @keyframes fadeInDown {
            0% {
                opacity: 0;
                transform: translate3d(0, -100%, 0);
            }
            100% {
                opacity: 1;
                transform: none;
            }
        }

        .animate-fadeOutDown {
            animation: fadeOutDown 0.5s cubic-bezier(.67,.01,.93,.78) forwards !important;
        }
        @keyframes fadeOutDown {
            0% {
                opacity: 1;
                transform: none;
            }
            100% {
                opacity: 0;
                transform: translate3d(0, 100%, 0);
            }
        }
    `;
    document.head.appendChild(style);

    // Function to animate overlays on like or unlike
    function animateOverlay(text) {
        overlay.textContent = text;
        background.style.display = 'block';
        overlay.style.display = 'block';

        // Show fadeInDown animation
        background.style.animation = 'none';
        overlay.classList.remove('animate-fadeOutDown');
        overlay.classList.add('animate-fadeInDown');

        // Flash background quickly
        let flashTimes = [300, 350, 600, 650, 950];
        flashTimes.forEach((time, i) => {
            setTimeout(() => {
                background.style.display = (i % 2 === 0) ? 'none' : 'block';
            }, time);
        });

        // After 1.5s start fadeOutDown
        setTimeout(() => {
            overlay.classList.remove('animate-fadeInDown');
            overlay.classList.add('animate-fadeOutDown');
        }, 1500);

        // After 2s hide overlays
        setTimeout(() => {
            overlay.classList.remove('animate-fadeOutDown');
            overlay.style.display = 'none';
            background.style.display = 'none';
        }, 2000);
    }

    // Show overlay with random message based on state
    function showOverlay(state) {
        const messages = state ? positiveMessages : negativeMessages;
        const msg = messages[Math.floor(Math.random() * messages.length)];
        animateOverlay(msg);
    }

    // Detect clicks on like buttons including shadow DOM
    document.addEventListener('click', (event) => {
        const path = event.composedPath();

        for (const el of path) {
            if (el instanceof HTMLElement && ['like', 'unlike'].includes(el.getAttribute('data-testid'))) {
              const state = el.getAttribute('data-testid') === 'like';
              console.log(state);
              setTimeout(() => {
                  showOverlay(state);
              }, 100);
              break;
            }

        }
    }, true);
})();
