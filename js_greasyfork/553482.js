// ==UserScript==
// @name         Auto GT
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Auto GT  :)
// @author       LeeRoY73
// @match        https://www.heroeswm.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553482/Auto%20GT.user.js
// @updateURL https://update.greasyfork.org/scripts/553482/Auto%20GT.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const baseUserUrl = 'https://www.heroeswm.ru/home.php?info'
    const baseUserUrlPathname = '/home.php'
    const basePVPPathname = '/pvp_guild.php'
    const baseWarPathname = '/war.php'
    const waitingPVP = 'Вы заявлены, ждите распределения. Отказаться'
    const localstorageBase = 'theLazyHeroScript'

    const localstorageNames = {
        isAutoGTStart: localstorageBase + 'isAutoGTStart',
        isClickMakeButton: localstorageBase + 'IsClickMakeButton',
        isClickStartBattleButton: localstorageBase + 'isClickStartBattleButton',
        isClickMirrorButton: localstorageBase + 'isClickMirrorButton'
    }
    const InfoElement = document.createElement('div');
    InfoElement.style.cssText = `
          position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 10000;
        line-height: 1.4;
        text-align: center;
    `;
    try {

        document.getElementById('hwm_no_zoom').appendChild(InfoElement);

    } catch (error) {
        console.log(error)
    }

    const autoGT = () => {
        createCheckBoxesAutoGT()

        const isAutoGTStart = localStorage.getItem(localstorageNames.isAutoGTStart) === 'true';

        if (isAutoGTStart) {
            if (checkUrlByPathname(baseUserUrlPathname) === true) {

                localStorage.removeItem(localstorageNames.isClickMakeButton);
                localStorage.removeItem(localstorageNames.isClickStartBattleButton);
                localStorage.removeItem(localstorageNames.isClickMirrorButton);

                baseUserUrlLogic()

                return;
            }

            if (checkUrlByPathname(basePVPPathname) === true) {
                const isWaitPVP = findElementByExactText(waitingPVP) ?? false

                if (isWaitPVP) {
                    InfoElement.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 3px;">Вступили в дуэль</div>
                        <div style="font-weight: bold; margin-bottom: 3px;">Ждем ПВП</div>
                    `;

                    setTimeout(()=>{
                        window.location.reload()
                    }, 10000)
                    return
                }

                clickDuelSubmitButton()
            }

            if (checkUrlByPathname(baseWarPathname) === true) {
                baseWarUrlLogic()
            }
        }

    }

    function startScript() {
        localStorage.setItem(localstorageNames.isAutoGTStart, 'true')
        window.location.reload()
    }

    function endScript() {
        localStorage.setItem(localstorageNames.isAutoGTStart, 'false')
        window.location.reload()
    }


    const baseWarUrlLogic = () => {
        InfoElement.innerHTML = ``
        // Использование
        setInterval(() => {
            console.log('start')

            const makeDiv = findDivById('make_ins');
            const fastBattleDiv = findDivById('fastbattle_on');
            const btnContinue = findDivById('btn_continue_WatchBattle');
            const winBattleResultDiv = findDivById('win_BattleResult');

            const isBattleStart = localStorage.getItem(localstorageNames.isClickMirrorButton) === 'true';
            const isClickStartBattleButton = localStorage.getItem(localstorageNames.isClickStartBattleButton) === 'true';

            const isFastBattleDivShow = fastBattleDiv ? fastBattleDiv.style.display !== 'none' : false;
            const isMakeDivDivShow = makeDiv ? makeDiv.style.display !== 'none' : false;
            const isWinBattleResultDiv = winBattleResultDiv ? btnContinue.style.display !== 'none' : false;
            const isBtnContinue = winBattleResultDiv ? winBattleResultDiv.style.display !== 'none' : false;

            if (isWinBattleResultDiv && isBtnContinue) {
                window.location.href = baseUserUrl
            }

            if (!isBattleStart) {

                if (isFastBattleDivShow) {
                    console.log('!!!', 'Кнопка Зеркала найден:', fastBattleDiv);

                    simulateRealisticMouseClick(fastBattleDiv).then((isClickSuccess) => {


                        if (isClickSuccess) {
                            localStorage.setItem(localstorageNames.isClickMirrorButton, 'true')
                        } else {
                            console.log('!!!', 'Кнопка Зеркала с id "fastbattle_on" не найден');
                        }
                    })
                } else {
                    if (isMakeDivDivShow) {
                        console.log('!!!', 'Кнопка расстановки найден:', makeDiv);

                        simulateRealisticMouseClick(makeDiv).then((isClickSuccess) => {
                            if (isClickSuccess) {
                                localStorage.setItem(localstorageNames.isClickMakeButton, 'true')
                                const confirmDiv = findDivById('confirm_ins');
                                if (confirmDiv) {
                                    console.log('!!!', 'Кнопка начала батла найден:', confirmDiv);

                                    simulateRealisticMouseClick(confirmDiv).then((isClickSuccess) => {
                                        if (isClickSuccess) {
                                            localStorage.setItem(localstorageNames.isClickStartBattleButton, 'true')
                                            console.log('!!!', 'Кнопка начала батла с id "confirm_ins" кликнута');
                                        } else {
                                            console.log('!!!', 'Кнопка начала батла с id "confirm_ins" не кликнута');
                                        }
                                    })
                                } else {
                                    console.log('!!!', 'Кнопка начала батла с id "confirm_ins" не найден');
                                }
                            } else {
                                console.log('!!!', 'Кнопка начала батла с id "make_ins" не кликнута');
                            }
                        })
                    } else {
                        console.log('!!!', 'Кнопка расстановки с id "make_ins" не найден');
                    }
                }
            }
        }, 3000)
    }

    const baseUserUrlLogic = () => {

        const buttonGT = findPvpGuildButton();
        const isItemFull = slotsCheck()
        const isHPFull = hpCheck()

        if (!isItemFull) {
            localStorage.setItem(localstorageNames.isAutoGTStart, 'false')
            alert('Не все артефакты одеты')

            return;
        }

        if (buttonGT) {

            if (isHPFull && isItemFull) {
                setTimeout(() => {
                    buttonGT.click()
                }, 2000)

                return;
            }

        }

        windowReloadTimer()
    }

// Имитация мышки
    function simulateRealisticMouseClick(element, options = {}) {
        if (!element) {
            console.warn('Элемент не найден');
            return false;
        }

        // Настройки по умолчанию
        const config = {
            moveSteps: 10,          // Количество шагов движения
            moveDuration: 800,      // Длительность движения в ms
            clickDelay: 200,        // Задержка перед кликом после наведения
            randomMove: true,       // Случайные отклонения в движении
            ...options
        };

        // Получаем текущее положение мыши
        const currentX = window.mouseX || 0;
        const currentY = window.mouseY || 0;

        // Получаем позицию элемента
        const rect = element.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        // Функция для создания случайного отклонения
        function getRandomOffset(maxOffset = 15) {
            return (Math.random() - 0.5) * 2 * maxOffset;
        }

        // Функция для отправки события мыши
        function dispatchMouseEvent(type, x, y) {
            const event = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                buttons: type === 'mousedown' ? 1 : 0
            });

            // Обновляем глобальные координаты
            window.mouseX = x;
            window.mouseY = y;

            document.elementFromPoint(x, y)?.dispatchEvent(event);
        }

        // Анимация движения мыши
        function moveMouse() {
            return new Promise((resolve) => {
                let step = 0;

                function animate() {
                    if (step >= config.moveSteps) {
                        resolve();
                        return;
                    }

                    const progress = step / config.moveSteps;

                    // Квадратичная easing функция для более естественного движения
                    const easing = progress < 0.5
                        ? 2 * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                    let x = currentX + (targetX - currentX) * easing;
                    let y = currentY + (targetY - currentY) * easing;

                    // Добавляем случайные отклонения
                    if (config.randomMove && step > 0 && step < config.moveSteps - 1) {
                        x += getRandomOffset(8);
                        y += getRandomOffset(8);
                    }

                    // Отправляем событие mousemove
                    dispatchMouseEvent('mousemove', x, y);

                    step++;
                    setTimeout(animate, config.moveDuration / config.moveSteps);
                }

                animate();
            });
        }

        // Основная функция
        async function performClick() {
            try {
                // Двигаем мышь к элементу
                await moveMouse();

                // Небольшая пауза перед кликом (как бы человек думает)
                await new Promise(resolve => setTimeout(resolve, config.clickDelay));

                // Небольшое финальное движение (микро-коррекция)
                const finalX = targetX + getRandomOffset(3);
                const finalY = targetY + getRandomOffset(3);
                dispatchMouseEvent('mousemove', finalX, finalY);

                // Пауза перед кликом
                await new Promise(resolve => setTimeout(resolve, 100));

                // Последовательность событий клика
                dispatchMouseEvent('mousedown', finalX, finalY);
                await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
                dispatchMouseEvent('mouseup', finalX, finalY);
                dispatchMouseEvent('click', finalX, finalY);

                console.log('Реалистичный клик выполнен успешно');
                return true;

            } catch (error) {
                console.error('Ошибка при имитации клика:', error);
                return false;
            }
        }

        return performClick();
    }

// поиск флажка ГТ, возвращаем кнопку
    function findPvpGuildButton() {
        // Поиск кнопки/ссылки
        const pvpButton = document.querySelectorAll('a[href="pvp_guild.php"], a[href*="pvp_guild.php"]');

        if (pvpButton.length === 2) {
            console.log('Кнопка ГТ найдена:', pvpButton);

            return pvpButton[1];
        } else {
            console.log('Кнопка ГТ не найдена');
        }
    }

// смотрим, все ли слоты одеты
    const slotsCheck = () => {
        const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7', 'slot8', 'slot9', 'slot11'];

        const isItemFull = slots.flatMap((slot) => {
            const divSlot = findDivById(slot);

            return divSlot.childNodes.length === 0 ? false : [];

        })

        return isItemFull.length === 0
    }

// проверяем есть ли хп не работает для старых интерфейсов
    const hpCheck = () => {
        // так и надо, heart зашит в коде
        const hp = heart
        if (typeof hp === 'number') {
            return hp === 100

        }

        const hpDiv = findDivById('health_amount')

        return hpDiv?.childNodes[0]?.nodeValue === '100'
    }

    function clickDuelSubmitButton() {
        // Поиск input с type="submit" и value содержащим "Вступить в дуэли!"
        const submitButtons = document.querySelectorAll('input[type="submit"]');
        const duelButton = Array.from(submitButtons).find(button => {
            return button.value && button.value.includes('Вступить в дуэли!');
        });

        if (duelButton?.disabled) {
            randomDelay(() => {
                window.location.href = baseUserUrl;
            })
        }

        if (duelButton) {
            console.log('Найдена кнопка вступления в дуэли:', duelButton);

            randomDelay(() => {
                duelButton.click();
            })

            return true;
        } else {

            randomDelay(() => {
                window.location.href = baseUserUrl;
            })
            console.log('Кнопка вступления в дуэли не найдена');
            return false;
        }
    }

    // просто проверка по id
    function findDivById(id) {
        // Самый простой и эффективный способ
        return document.getElementById(id);
    }

    function checkUrl(url) {
        return window.location.href === url
    }

    function checkUrlByPathname(pathname) {
        return window.location.pathname === pathname
    }

    function findElementByExactText(text) {
        const elements = document.querySelectorAll('*');
        return Array.from(elements).find(el => el.textContent?.trim() === text);
    }


    function windowReloadTimer() {
        randomDelayWithTimer(() => {
            window.location.reload()
        }, 100000, 110000)
    }

    function randomDelay(callback, startTime = 2000, endTime = 3000) {
        const delay = Math.floor(Math.random() * endTime) + startTime; // 2000-5000 мс
        console.log(`Ждем ${Math.floor(delay / 1000)} секунд (${Math.floor(delay / 1000 / 60)} минут) randomDelay`)

        setTimeout(callback, delay);
    }

    function randomDelayWithTimer(callback, startTime = 2000, endTime = 3000) {
        const delay = Math.floor(Math.random() * endTime) + startTime; // 2000-5000 мс
        console.log(`Ждем ${Math.floor(delay / 1000)} секунд (${Math.floor(delay / 1000 / 60)} минут) randomDelayWithTimer`)
        const timer = createTimer(delay);
        document.getElementById('hwm_no_zoom').appendChild(timer);
        setTimeout(callback, delay);
    }

    const createCheckBoxesAutoGT = () => {
        const isAutoGTStart = localStorage.getItem(localstorageNames.isAutoGTStart) === 'true';
        let button = document.createElement("input");
        button.type = "button";
        button.value = isAutoGTStart ? 'Выключить Авто ГТ' : 'Включить Авто ГТ'
        button.onclick = isAutoGTStart ? endScript : startScript;

        InfoElement.appendChild(button)
    }

    function createTimer(ms) {
        const timerElement = document.createElement('div');
        timerElement.style.cssText = `
          position: fixed;
        top: 100px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 10000;
        line-height: 1.4;
        text-align: center;
    `;

        let timeLeft = ms

        function updateTimer() {
            const minutesLeft = Math.floor(timeLeft / 60000);
            const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

            timerElement.innerHTML = `
            <div style="margin-bottom: 3px;">Кнопка ГТ не найдена</div>
            <div style="font-weight: bold; margin-bottom: 3px;">Таймер Auto GT</div>
            <div>Осталось: ${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}</div>
        `;

            if (timeLeft <= 0) {
                timerElement.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 3px;">Таймер auto Work</div>
                <div style="color: #ff4444;">Время вышло!</div>
            `;
                clearInterval(intervalId);
            }

            timeLeft -= 1000;
        }

        updateTimer(); // начальное отображение
        const intervalId = setInterval(updateTimer, 1000);

        return timerElement;
    }

    autoGT()
})();