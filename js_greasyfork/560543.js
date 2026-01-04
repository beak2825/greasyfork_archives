// ==UserScript==
// @name         ShopHelper Library
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Core constants
// @author       Marcin
// @grant        none
// ==/UserScript==

(function(window) {
    'use strict';

    const CONFIG = {
        API_URL: "https://butosklep.cfolks.pl/app_test",
        PROXY_URL: "https://butosklep.cfolks.pl/app/proxy",
        AUTH_TOKEN: "833035369cc0563dbe15a9b3781a240d8c6f7d9ac8e54a39e39117d0d857989b"
    };

    const DATA = {
        LANGUAGES: {
            pol: "Polski", bul: "Bułgarski", cze: "Czeski", dut: "Niderlandzki",
            eng: "Angielski", est: "Estoński", fre: "Francuski", ger: "Niemiecki",
            gre: "Grecki", hun: "Węgierski", ita: "Włoski", lav: "Łotewski",
            lit: "Litewski", rum: "Rumuński", scr: "Chorwacki", slo: "Słowacki",
            slv: "Słoweński", spa: "Hiszpański", ukr: "Ukraiński"
        },
        LANG_KEYS: ["pol", "bul", "cze", "dut", "eng", "est", "fre", "ger", "gre", "hun", "ita", "lav", "lit", "rum", "scr", "slo", "slv", "spa", "ukr"],
        COLORS: {
            Beżowy: "beżowy", Złoty: "złoty", Srebrny: "srebrny", Czarny: "czarny",
            Biały: "biały", Szary: "szary", Brązowy: "brązowy", Granatowy: "granatowy",
            Żółty: "żółty", Różowy: "różowy", Niebieski: "niebieski", Zielony: "zielony",
            Fioletowy: "fioletowy", Pomarańczowy: "pomarańczowy", Czerwony: "czerwony",
            Wielokolorowy: "wielokolorowy", Bezbarwny: "bezbarwny"
        },
        BRANDS_SHOES: {
            Seastar: ["option[value='248811_1955863']", ""],
            "Big Star": ["option[value='248811_1944280']", ""],
            "bez marki": ["option[value='248811_958954']", ""],
            Maciejka: ["option[value='248811_1974760']", ""],
            "4F": ["option[value='248811_1131479']", ""],
            inna: ["option[value='248811_950468']", ""],
            "Inna marka": ["", "option[value='7174_400']"],
            "Butosklep": ["option[value='248811_2042532']", ""]
        },
        BRANDS_CLOTHING: {
            "bez marki": ["option[value='3786_1704209']", "option[value='7174_1704213']"],
            "4F": ["option[value='3786_189']", "option[value='7174_217317']"],
            inna: ["option[value='3786_85']", ""],
            "Inna marka": ["", "option[value='7174_400']"]
        },
        CLOTHING_KEYWORDS: [
            "Okrycia wierzchnie", "Garnitury", "Kamizelki", "Koszule", "Marynarki",
            "Spodnie", "Bluzy", "Dresy", "Koszulki", "Komplety", "Spodenki",
            "Swetry", "T-shirty", "Jeansy", "Bluzki", "Body", "Bolerka", "Garsonki",
            "Golfy", "Gorsety", "Kombinezony", "Legginsy", "Żakiety", "Spódnice",
            "Sukienki", "Topy", "Tuniki", "Zestawy", "Kurtki"
        ],
        IDS: {
            SHOES: "248811",
            CLOTHING: "3786",
            KIDS: "7174"
        }
    };

    const CSS = `
        #customDockedToolbar { position: fixed; bottom: 0; left: 0; width: 100%; height: 50px; background: #f0f0f0; border-top: 1px solid #ddd; z-index: 990; padding: 10px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; }
        .toolbar-buttons { display: flex; justify-content: center; align-items: center; flex-grow: 1; }
        .dropdown { position: relative; display: inline-block; margin-right: 10px; }
        .dropbtn { background-color: #834333; color: white; padding: 10px; border: none; cursor: pointer; }
        .dropbtn:hover { background-color: #CC5500; }
        .dropdown-content, .sub-dropdown-content { display: none; position: absolute; background-color: #f9f9f9; min-width: 160px; box-shadow: 0px 8px 16px rgba(0,0,0,0.2); z-index: 999; }
        .dropdown-content { bottom: 100%; }
        .sub-dropdown-content { left: 100%; bottom: 0; }
        .dropdown:hover .dropdown-content, .sub-dropdown:hover .sub-dropdown-content { display: block; }
        .dropdown-content a { color: black; padding: 12px 16px; text-decoration: none; display: block; cursor: pointer; }
        .dropdown-content a:hover { background-color: #f1f1f1; }
        .message-area { padding: 10px; border-radius: 5px; text-align: center; visibility: hidden; opacity: 0; transition: opacity 0.5s; width: 30%; font-weight: bold; }
        .message-area.success { background: #d4edda; color: #155724; }
        .message-area.error { background: #ffcccc; color: #d8000c; }
        .dropdown-input-group { padding: 5px; display: flex; flex-direction: column; gap: 5px; }
    `;

    const HTML = {
        TOOLBAR: `
            <div class="toolbar-buttons">
                <div class="dropdown">
                    <button class="dropbtn">Allegro Ubrania</button>
                    <div class="dropdown-content">
                        <div class="sub-dropdown">
                            <a class="dropa">Główny kolor</a>
                            <div class="sub-dropdown-content">
                                ${Object.keys(DATA.COLORS).map(c => `<a data-action="setColor" data-payload='{"type":"main","val":"${c}","id":"249512"}'>${c}</a>`).join("")}
                            </div>
                        </div>
                        <a data-action="setSizesClothing">Rozmiary</a>
                        <a data-action="setEanClothing">EANy</a>
                        <div class="sub-dropdown">
                            <a class="dropa">Marka</a>
                            <div class="sub-dropdown-content">
                                <div class="dropdown-input-group">
                                    <input type="text" id="customBrandInputClothing" placeholder="Inna marka">
                                    <button data-action="setCustomBrand" data-payload='{"inputId":"customBrandInputClothing","isClothing":true}'>Wstaw</button>
                                </div>
                                <a data-action="setBrand" data-payload='{"brand":"bez marki","isClothing":true}'>Bez marki</a>
                                <a data-action="setBrand" data-payload='{"brand":"4F","isClothing":true}'>4F</a>
                            </div>
                        </div>
                         <div class="sub-dropdown">
                            <a class="dropa">Kod producenta</a>
                            <div class="sub-dropdown-content">
                                <div class="dropdown-input-group">
                                    <input type="text" id="customProducerInputClothing" placeholder="Kod">
                                    <button data-action="setProducerCode" data-payload='{"inputId":"customProducerInputClothing","isClothing":true}'>Wstaw</button>
                                </div>
                                <a data-action="setProducerCode" data-payload='{"isClothing":true}'>Standardowy kod</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="dropbtn">Allegro</button>
                    <div class="dropdown-content">
                        <div class="sub-dropdown">
                            <a class="dropa">Główny kolor</a>
                            <div class="sub-dropdown-content">
                                ${Object.keys(DATA.COLORS).map(c => `<a data-action="setColor" data-payload='{"type":"main","val":"${c}","id":"249512"}'>${c}</a>`).join("")}
                            </div>
                        </div>
                        <div class="sub-dropdown">
                            <a class="dropa">Kolor podeszwy</a>
                            <div class="sub-dropdown-content">
                                ${Object.keys(DATA.COLORS).map(c => `<a data-action="setColor" data-payload='{"type":"insole","val":"${c}","id":"232289"}'>${c}</a>`).join("")}
                            </div>
                        </div>
                        <a data-action="processTableAllegro">Długości wkładek</a>
                        <a data-action="setEan">EANy</a>
                        <div class="sub-dropdown">
                            <a class="dropa">Marka</a>
                            <div class="sub-dropdown-content">
                                <div class="dropdown-input-group">
                                    <input type="text" id="customBrandInput" placeholder="Inna marka">
                                    <button data-action="setCustomBrand" data-payload='{"inputId":"customBrandInput"}'>Wstaw</button>
                                </div>
                                ${['Big Star', 'Butosklep', 'Seastar', 'bez marki', '4F', 'Maciejka'].map(b => 
                                    `<a data-action="setBrand" data-payload='{"brand":"${b}"}'>${b}</a>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="sub-dropdown">
                            <a class="dropa">Kod producenta</a>
                            <div class="sub-dropdown-content">
                                <div class="dropdown-input-group">
                                    <input type="text" id="customProducerInput" placeholder="Kod">
                                    <button data-action="setProducerCode" data-payload='{"inputId":"customProducerInput"}'>Wstaw</button>
                                </div>
                                <a data-action="setProducerCode">Standardowy kod</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="dropbtn">Opis</button>
                    <div class="dropdown-content">
                        <a data-action="copyTable">Wstaw tabele</a>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="dropbtn">Tłumaczenie</button>
                    <div class="dropdown-content">
                        <div class="sub-dropdown">
                            <a class="dropa">Opisy</a>
                            <div class="sub-dropdown-content">
                                ${DATA.LANG_KEYS.map((k, i) => `<a data-action="translate" data-payload='{"type":"desc","langId":${i}}'>${k}</a>`).join("")}
                                <a data-action="translate" data-payload='{"type":"desc","all":true}'>Wszystkie</a>
                            </div>
                        </div>
                        <div class="sub-dropdown">
                            <a class="dropa">Nazwy</a>
                            <div class="sub-dropdown-content">
                                ${DATA.LANG_KEYS.map((k, i) => `<a data-action="translate" data-payload='{"type":"name","langId":${i}}'>${k}</a>`).join("")}
                                <a data-action="translate" data-payload='{"type":"name","all":true}'>Wszystkie</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="message-area" id="messageArea"></div>`
    };

    window.ShopHelperLib = { CONFIG, DATA, CSS, HTML };
})(window);