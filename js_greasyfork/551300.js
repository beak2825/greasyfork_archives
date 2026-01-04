// ==UserScript==
// @name           Tyranu Evavu Player [Chrome Fixed]
// @version        1.2
// @description    Autoplays Tyranu Evavu remembering which cards have been played
// @match          https://www.neopets.com/games/tyranuevavu.phtml*
// @namespace      https://greasyfork.org/users/1521429
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/551300/Tyranu%20Evavu%20Player%20%5BChrome%20Fixed%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/551300/Tyranu%20Evavu%20Player%20%5BChrome%20Fixed%5D.meta.js
// ==/UserScript==

var KEY_PLAY = 'playTyranuEvavu';
var KEY_CARDS = 'cards';

addToggleButton();

if (JSON.parse(localStorage.getItem(KEY_PLAY) || "false")) {
    setTimeout(execute, 800 + Math.random() * 1200);
}

function execute() {
    startGame();
    playGame();
    endGame();
}

function addToggleButton() {
    var toggleButton = document.createElement('button');
    toggleButton.id = 'autoplayer';
    toggleButton.style.display = 'block';
    toggleButton.style.margin = '0 auto';
    toggleButton.addEventListener('click', toggleAutoPlay);

    var content = document.querySelector('.content, #content, body');
    if (content && content.firstChild) {
        content.insertBefore(toggleButton, content.firstChild);
    } else {
        document.body.insertBefore(toggleButton, document.body.firstChild);
    }

    updateButtonText();
}

function updateButtonText() {
    var autoplayIsOn = JSON.parse(localStorage.getItem(KEY_PLAY) || "false");
    var btn = document.getElementById('autoplayer');
    if (!btn) return;
    btn.textContent = autoplayIsOn ? 'Stop AP' : 'Start AP';
}

function toggleAutoPlay() {
    var autoplayIsOn = JSON.parse(localStorage.getItem(KEY_PLAY) || "false");
    localStorage.setItem(KEY_PLAY, !autoplayIsOn);
    updateButtonText();

    if (!autoplayIsOn) {
        setTimeout(execute, 500);
    }
}

function startGame() {
    var form = document.querySelector('form[action*="tyranuevavu.phtml"]');
    if (form && form.querySelector('input[name="type"][value="play"]')) {
        var suits = ['hearts', 'clubs', 'diamonds', 'spades'];
        var cards = [];
        for (var i = 2; i <= 14; i++) {
            for (var s of suits) cards.push(i + '_' + s);
        }
        localStorage.setItem(KEY_CARDS, JSON.stringify(cards));
        form.submit();
    }
}

function playGame() {
    var tyranuButton = document.querySelector('a[href*="action=higher"]');
    var evavuButton = document.querySelector('a[href*="action=lower"]');

    if (!tyranuButton) return;

    updateRound();
    var img = document.querySelector('img[src*="images.neopets.com/games/cards/"]');
    if (!img) return;

    var card = img.src.match(/cards\/(.+)\.gif/);
    if (!card) return;

    var cards = JSON.parse(localStorage.getItem(KEY_CARDS) || "[]");
    var length = cards.length;
    var index = cards.indexOf(card[1]);

    if (index > -1) cards.splice(index, 1);
    localStorage.setItem(KEY_CARDS, JSON.stringify(cards));

    if (length > 1) {
        // Chrome-safe click
        setTimeout(() => {
            (index / (length - 1) > 0.5 ? evavuButton : tyranuButton).click();
        }, 300 + Math.random() * 400);
    } else {
        alert('You have won the game!');
    }
}

function updateRound() {
    var b = document.querySelector('.content center b');
    if (b) {
        var n = parseInt(b.textContent);
        if (!isNaN(n)) document.title = 'Tyranu Evavu (' + n + ')';
    }
}

function endGame() {
    var form = document.querySelector('form[action*="tyranuevavu.phtml"]');
    if (form && form.querySelector('input[name="type"][value="intro"]')) {
        form.submit();
    } else {
        limitReached();
    }
}

function limitReached() {
    if (document.querySelector('form[action="/gameroom.phtml"]')) {
        document.title = 'Tyranu Evavu (Limit Reached)';
    }
}
