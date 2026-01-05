// ==UserScript==
// @name         Фарм молний/карт 2
// @description  Активация F3 или Авто
// @version      1.4 (2дня работы)
// @author       Я
// @match        https://remanga.org/*
// @grant        none
// @license      GNU AGPLv3
// @namespace    Потерялось
// @downloadURL https://update.greasyfork.org/scripts/558961/%D0%A4%D0%B0%D1%80%D0%BC%20%D0%BC%D0%BE%D0%BB%D0%BD%D0%B8%D0%B9%D0%BA%D0%B0%D1%80%D1%82%202.user.js
// @updateURL https://update.greasyfork.org/scripts/558961/%D0%A4%D0%B0%D1%80%D0%BC%20%D0%BC%D0%BE%D0%BB%D0%BD%D0%B8%D0%B9%D0%BA%D0%B0%D1%80%D1%82%202.meta.js
// ==/UserScript==

let running = false;
let busy = false;
let bottomCheckCounter = 0; // счетчик двойной проверки низа

function isScrollable(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    return (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        el.scrollHeight > el.clientHeight
    );
}

function findScrollableContainer() {
    const elements = document.querySelectorAll('div');
    for (const el of elements) {
        if (isScrollable(el)) return el;
    }
    return null;
}

function scrollToBottom(target) {
    target.scrollTop = target.scrollHeight;
}

function clickAllEyes(container) {
    const buttons = container.querySelectorAll('button');
    let clicked = 0;

    buttons.forEach(btn => {
        const svg = btn.querySelector('svg');
        const isEyeButton = btn.clientHeight <= 30 && btn.clientWidth <= 30 && svg;
        if (isEyeButton) {
            btn.click();
            clicked++;
        }
    });

    console.log(`Нажато глазиков: ${clicked}`);
    return clicked;
}

// Открытие ленты в начале
function openFeed() {
    const feedButton = document.querySelector('button[data-sentry-component="AsideTrigger"]');
    if (feedButton) {
        feedButton.click();
        console.log('Лента открыта');
    }
}

// Нажатие на первую главу после окончания
function openFirstChapter() {
    const chapter = document.querySelector('a[data-testid="chapter_918692"]');
    if (chapter) {
        chapter.click();
        console.log('Открыта первая глава');
    }
}

// Симуляция нажатия клавиши F4
function simulateF4KeyPress() {
    const event = new KeyboardEvent('keydown', {
        key: 'F4',
        code: 'F4',
        keyCode: 115,
        which: 115,
        bubbles: true,
        cancelable: true,
    });

    document.dispatchEvent(event); // Отправляем событие нажатия F4
}

function mainLoop() {
    if (!running || busy) return;

    const target = findScrollableContainer();
    if (!target) {
        requestAnimationFrame(mainLoop);
        return;
    }

    busy = true;
    scrollToBottom(target);

    setTimeout(() => {
        // двойная проверка низа
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
            bottomCheckCounter++;
        } else {
            bottomCheckCounter = 0;
        }

        // если дважды подряд достигнут низ, кликаем глазики и открываем главу
        if (bottomCheckCounter >= 2) {
            console.log('Достигнут низ ленты, начинаем клик по глазикам.');
            clickAllEyes(target);
            openFirstChapter();
            running = false; // останавливаем цикл

            // Добавляем задержку перед нажатием F4 (например, 1 секунда)
            setTimeout(() => {
                simulateF4KeyPress(); // Нажимаем F4 после завершения работы
            }, 1000); // Задержка 1 секунда (1000 миллисекунд)
        }

        busy = false;

        if (running) {
            requestAnimationFrame(mainLoop);
        }
    }, 500); // ждем 500ms, чтобы новые элементы успели подгрузиться
}

document.addEventListener('keydown', e => {
    if (e.code !== 'F3') return;

    e.preventDefault();

    running = !running;
    bottomCheckCounter = 0;

    if (running) {
        openFeed(); // сначала открываем ленту
        mainLoop();
    }
});
