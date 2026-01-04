// ==UserScript==
// @name         ГавГав Сборщик
// @namespace    http://tampermonkey.net/
// @version      4.4.4.4
// @description  Справа снизу там кнопка будет, кликнишеь пон
// @author       Твой батя педик
// @include      *://ok.ru/*
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557159/%D0%93%D0%B0%D0%B2%D0%93%D0%B0%D0%B2%20%D0%A1%D0%B1%D0%BE%D1%80%D1%89%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557159/%D0%93%D0%B0%D0%B2%D0%93%D0%B0%D0%B2%20%D0%A1%D0%B1%D0%BE%D1%80%D1%89%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ГавГавСборщикПисков {
        constructor() {
            this.пиздюлины = {
                окошкоПиздец: 'link-window',
                заголовочекМилый: 'link-title',
                крестикПиздит: 'link-close',
                кнопочкаШинен: 'link-toggle',
                паттернуля: 'link-pattern',
                текстаркаГигант: 'link-output',
                циферкиБля: 'link-counter',
                стартПоехали: 'link-start',
                копипастаЛол: 'link-copy',
                выебонОчистки: 'link-clear'
            };

            this.пиздючки = {
                собранныеПиздюли: new Set(),
                таймерчикПиздец: null,
                паттернПиздит: 'ok.ru/messages/join'
            };

            this.запустиПиздец();
        }

        запустиПиздец() {
            this.вставьСтилиху();
            this.создайКнопочкуШинен();
        }

        вставьСтилиху() {
            GM_addStyle(this.получиСтильПиздец());
        }

        получиСтильПиздец() {
            const пиздюлины = this.пиздюлины;
            return `
                #${пиздюлины.окошкоПиздец} {
                    position: fixed;
                    bottom: 60px;
                    right: 20px;
                    z-index: 10001;
                    width: 380px;
                    background: linear-gradient(180deg, #0a246a 0%, #1084d7 100%);
                    border: 2px solid;
                    border-color: #dfdfdf #808080 #808080 #dfdfdf;
                    box-shadow: 1px 1px 0 0 #ffffff inset;
                    font-family: 'MS Sans Serif', Arial, sans-serif;
                    font-size: 11px;
                    color: #000;
                    user-select: none;
                    display: none;
                }

                #${пиздюлины.окошкоПиздец}.visible {
                    display: block;
                }

                #${пиздюлины.заголовочекМилый} {
                    background: linear-gradient(90deg, #000080 0%, #1084d7 100%);
                    color: #fff;
                    padding: 2px 2px 2px 4px;
                    font-weight: bold;
                    font-size: 11px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    height: 20px;
                }

                #${пиздюлины.заголовочекМилый}-text {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                #${пиздюлины.крестикПиздит} {
                    width: 18px;
                    height: 14px;
                    background: linear-gradient(180deg, #dfdfdf 0%, #808080 100%);
                    border: 1px solid;
                    border-color: #dfdfdf #808080 #808080 #dfdfdf;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 10px;
                    color: #000;
                    font-weight: bold;
                }

                #${пиздюлины.крестикПиздит}:active {
                    border-color: #808080 #dfdfdf #dfdfdf #808080;
                }

                #${пиздюлины.окошкоПиздец} .link-content {
                    background: #ecebeb;
                    padding: 6px;
                    border: 2px solid;
                    border-color: #ffffff #808080 #808080 #ffffff;
                }

                .link-group {
                    background: linear-gradient(180deg, #0a246a 0%, #1084d7 100%);
                    border: 2px solid;
                    border-color: #dfdfdf #808080 #808080 #dfdfdf;
                    padding: 4px;
                    margin-bottom: 6px;
                    color: #000;
                    font-size: 10px;
                    font-weight: bold;
                }

                .link-group-label {
                    position: relative;
                    top: -8px;
                    left: 4px;
                    background: #ecebeb;
                    padding: 0 2px;
                    display: inline-block;
                    color: #000;
                }

                .link-input, .link-textarea {
                    width: 100%;
                    padding: 3px;
                    border: 2px solid;
                    border-color: #808080 #dfdfdf #dfdfdf #808080;
                    background: #fff;
                    font-family: 'MS Sans Serif', Arial, sans-serif;
                    font-size: 10px;
                    color: #000;
                    box-sizing: border-box;
                    margin-bottom: 4px;
                }

                .link-input {
                    height: 20px;
                }

                .link-textarea {
                    height: 120px;
                    font-family: 'Courier New', monospace;
                    resize: vertical;
                }

                .link-input:focus, .link-textarea:focus {
                    outline: none;
                }

                .link-button-group {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 6px;
                }

                .link-button {
                    flex: 1;
                    padding: 4px 8px;
                    background: linear-gradient(180deg, #dfdfdf 0%, #808080 100%);
                    border: 2px solid;
                    border-color: #dfdfdf #808080 #808080 #dfdfdf;
                    color: #000;
                    font-family: 'MS Sans Serif', Arial, sans-serif;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                    user-select: none;
                    text-align: center;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .link-button:hover {
                    background: linear-gradient(180deg, #e8e8e8 0%, #898989 100%);
                }

                .link-button:active {
                    border-color: #808080 #dfdfdf #dfdfdf #808080;
                    background: linear-gradient(180deg, #c0c0c0 0%, #707070 100%);
                }

                .link-counter {
                    background: #ecebeb;
                    border: 1px solid #808080;
                    padding: 4px;
                    font-size: 10px;
                    color: #000;
                    text-align: center;
                    font-weight: 900;
                }

                .link-info {
                    background: #ecebeb;
                    border: 1px solid #808080;
                    padding: 4px;
                    margin-bottom: 6px;
                    font-size: 9px;
                    color: #000;
                    line-height: 1.4;
                }

                #${пиздюлины.кнопочкаШинен} {
                    position: fixed;
                    bottom: 60px;
                    right: 20px;
                    z-index: 10002;
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(180deg, #dfdfdf 0%, #808080 100%);
                    border: 2px solid;
                    border-color: #dfdfdf #808080 #808080 #dfdfdf;
                    color: #000;
                    font-size: 18px;
                    cursor: pointer;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Arial, sans-serif;
                }

                #${пиздюлины.кнопочкаШинен}:hover {
                    background: linear-gradient(180deg, #e8e8e8 0%, #898989 100%);
                }

                #${пиздюлины.кнопочкаШинен}:active {
                    border-color: #808080 #dfdfdf #dfdfdf #808080;
                }
            `;
        }

        создайКнопочкуШинен() {
            const кнопочка = document.createElement('button');
            Object.assign(кнопочка, {
                id: this.пиздюлины.кнопочкаШинен,
                textContent: '🔍',
                title: 'УУУэээээээ шине',
                onclick: () => this.покажиСпрячьОкошко()
            });
            document.body.appendChild(кнопочка);
        }

        покажиСпрячьОкошко() {
            const окошко = document.getElementById(this.пиздюлины.окошкоПиздец);
            if (окошко) {
                окошко.classList.toggle('visible');
            } else {
                this.создайОкошкоПиздец();
            }
        }

        создайОкошкоПиздец() {
            const окошко = document.createElement('div');
            окошко.id = this.пиздюлины.окошкоПиздец;

            окошко.innerHTML = `
                <div id="${this.пиздюлины.заголовочекМилый}">
                    <div id="${this.пиздюлины.заголовочекМилый}-text">
                        <span style="font-size: 12px;">🔍</span>
                        <span>ГАВГАВГАВГАГВГАВ 777</span>
                    </div>
                    <div id="${this.пиздюлины.крестикПиздит}">×</div>
                </div>
                <div class="link-content">
                    <div class="link-info">
                        <h4><strong style="color: #000; font-weight: 900;">
                            Слыш поц, Добавь меня в друзья в Одноклассники
                            <u><a style="color:blue" href="https://ok.ru/profile/910108178260" target="_blank">КЛИК</a></u>
                        </strong></h4>
                    </div>
                    <div class="link-group"><div class="link-group-label">Шаблон поиска</div>
                        <input id="${this.пиздюлины.паттернуля}" class="link-input"
                               placeholder="ok.ru/messages/join или другой шаблон" value="${this.пиздючки.паттернПиздит}">
                    </div>
                    <div class="link-group"><div class="link-group-label">Результат</div>
                        <textarea id="${this.пиздюлины.текстаркаГигант}" class="link-textarea" readonly></textarea>
                    </div>
                    <div id="${this.пиздюлины.циферкиБля}" class="link-counter">Собрано: 0 (${this.пиздючки.паттернПиздит})</div>
                    <div class="link-button-group">
                        <button id="${this.пиздюлины.стартПоехали}" class="link-button">Старт</button>
                        <button id="${this.пиздюлины.копипастаЛол}" class="link-button">Копировать</button>
                        <button id="${this.пиздюлины.выебонОчистки}" class="link-button" style="flex: none;">Очистить</button>
                    </div>
                </div>
            `;

            document.body.appendChild(окошко);

            this.повесьПиздюли(окошко);
            окошко.classList.add('visible');
        }

        повесьПиздюли(окошко) {
            document.getElementById(this.пиздюлины.крестикПиздит).onclick = () => окошко.classList.remove('visible');

            const заголовок = document.getElementById(this.пиздюлины.заголовочекМилый);
            let тащимсяПиздец = false, дхПиздец = 0, дyПиздец = 0;

            заголовок.onmousedown = (e) => {
                тащимсяПиздец = true;
                дхПиздец = e.clientX - окошко.offsetLeft;
                дyПиздец = e.clientY - окошко.offsetTop;
            };

            document.onmousemove = (e) => {
                if (тащимсяПиздец) {
                    окошко.style.left = (e.clientX - дхПиздец) + 'px';
                    окошко.style.top = (e.clientY - дyПиздец) + 'px';
                    окошко.style.bottom = окошко.style.right = 'auto';
                }
            };

            document.onmouseup = () => тащимсяПиздец = false;

            const паттернчик = document.getElementById(this.пиздюлины.паттернуля);
            паттернчик.oninput = () => {
                this.пиздючки.паттернПиздит = паттернчик.value.trim() || 'ok.ru/messages/join';
                document.getElementById(this.пиздюлины.циферкиБля).textContent =
                    `Собрано: 0 (${this.пиздючки.паттернПиздит})`;
            };

            document.getElementById(this.пиздюлины.стартПоехали).onclick = () => {
                const кнопкаСтарт = document.getElementById(this.пиздюлины.стартПоехали);
                if (this.пиздючки.таймерчикПиздец) {
                    clearInterval(this.пиздючки.таймерчикПиздец);
                    this.пиздючки.таймерчикПиздец = null;
                    кнопкаСтарт.textContent = 'Старт';
                } else {
                    this.пиздючки.собранныеПиздюли.clear();
                    this.пиздючки.паттернПиздит = паттернчик.value.trim() || 'ok.ru/messages/join';
                    this.обновиПиздюли();
                    this.пиздючки.таймерчикПиздец = setInterval(() => this.обновиПиздюли(), 200);
                    кнопкаСтарт.textContent = 'Пауза';
                }
            };

            document.getElementById(this.пиздюлины.копипастаЛол).onclick = () => {
                const текстПиздец = document.getElementById(this.пиздюлины.текстаркаГигант).value;
                if (текстПиздец) {
                    GM_setClipboard(текстПиздец);
                    const кнопкаКопипаста = document.getElementById(this.пиздюлины.копипастаЛол);
                    const оригиналчик = кнопкаКопипаста.textContent;
                    кнопкаКопипаста.textContent = 'OK!';
                    setTimeout(() => кнопкаКопипаста.textContent = оригиналчик, 1500);
                }
            };

            document.getElementById(this.пиздюлины.выебонОчистки).onclick = () => {
                this.пиздючки.собранныеПиздюли.clear();
                document.getElementById(this.пиздюлины.текстаркаГигант).value = '';
                document.getElementById(this.пиздюлины.циферкиБля).textContent =
                    `Собрано: 0 (${this.пиздючки.паттернПиздит})`;
            };
        }

        собериПиздюли(паттерн) {
            if (!паттерн) return [];
            const писички = Array.from(document.querySelectorAll('a[href]'))
                .map(a => a.href)
                .filter(href => href.includes(паттерн));

            писички.forEach(пиздюля => {
                if (!this.пиздючки.собранныеПиздюли.has(пиздюля)) {
                    this.пиздючки.собранныеПиздюли.add(пиздюля);
                }
            });

            return [...this.пиздючки.собранныеПиздюли];
        }

        обновиПиздюли() {
            const писички = this.собериПиздюли(this.пиздючки.паттернПиздит);
            const текстарка = document.getElementById(this.пиздюлины.текстаркаГигант);
            const циферки = document.getElementById(this.пиздюлины.циферкиБля);

            if (текстарка) текстарка.value = писички.join('\n');
            if (циферки) циферки.textContent = `Собрано: ${писички.length} уникальных (${this.пиздючки.паттернПиздит})`;
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('load', () => new ГавГавСборщикПисков());
    } else {
        new ГавГавСборщикПисков();
    }
})();
