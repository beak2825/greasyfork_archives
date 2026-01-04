// ==UserScript==
// @name         Auto selling resources phone
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Напівавтоматично крутимо реси з телефона
// @author       Riba
// @match        /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(object-info|map).php*/
// @include      /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(object-info|map).php*/
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556871/Auto%20selling%20resources%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/556871/Auto%20selling%20resources%20phone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styled_btn = 'border: none; overflow: hidden; width:350px; margin-bottom: 4px; margin-top: 4px; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s;transition: filter .15s;'

    const create_el = (el, style, textContent) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (textContent) element.textContent = textContent;
        return element;
    }

    const RESOURCE_KEY = "resourceTypeKey";

    const save_resource = (resource) => localStorage.setItem(RESOURCE_KEY, resource);
    const get_resource = () => localStorage.getItem(RESOURCE_KEY) || "Руда";
    const resource = get_resource();

    const link = location.origin;

    const map_data = [
        {
            id: 1,
            name: "Empire capital",
            x: 50,
            y: 50,
            factories: [
                {
                    id: "5",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "6",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "4",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "3",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "10",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: ["Древесина", "Руда", "Ртуть"],
                },
                {
                    id: "8",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "7",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "12",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "9",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
                {
                    id: "11",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "32",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: ["Кожа"],
                },
                {
                    id: "34",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "38",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: ["Кожа", "Волшебный порошок"],
                },
                {
                    id: "165",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=50",
                    resources: [],
                },
            ],
        },
        {
            id: 2,
            name: "East river",
            x: 51,
            y: 50,
            factories: [
                {
                    id: "26",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
                {
                    id: "23",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "25",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
                {
                    id: "24",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "28",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Кристаллы", "Сталь"],
                },
                {
                    id: "33",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "36",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "75",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
                {
                    id: "89",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Древесина", "Сталь"],
                },
                {
                    id: "87",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Древесина", "Волшебный порошок"],
                },
                {
                    id: "238",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
                {
                    id: "258",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
                {
                    id: "321",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Кожа"],
                },
                {
                    id: "342",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: ["Сталь", "Руда", "Самоцветы"],
                },
                {
                    id: "279",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
                {
                    id: "300",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=50",
                    resources: [],
                },
            ],
        },
        {
            id: 3,
            name: "Tiger lake",
            x: 50,
            y: 49,
            factories: [
                {
                    id: "13",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: [],
                },
                {
                    id: "16",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: [],
                },
                {
                    id: "14",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Кожа"],
                },
                {
                    id: "15",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: [],
                },
                {
                    id: "27",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Сталь", "Самоцветы", "Никель"],
                },
                {
                    id: "31",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Древесина", "Сталь", "Никель"],
                },
                {
                    id: "39",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Древесина", "Сталь"],
                },
                {
                    id: "35",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "84",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Мифрил", "Руда"],
                },
                {
                    id: "224",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "239",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: [],
                },
                {
                    id: "259",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: [],
                },
                {
                    id: "322",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Самоцветы", "Волшебный порошок", "Сера"],
                },
                {
                    id: "343",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Древесина", "Руда", "Ртуть"],
                },
                {
                    id: "280",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Древесина", "Руда", "Ртуть"],
                },
                {
                    id: "301",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=49",
                    resources: ["Древесина", "Кристаллы", "Сталь"],
                },
            ],
        },
        {
            id: 4,
            name: "Rogues wood",
            x: 51,
            y: 49,
            factories: [
                {
                    id: "22",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "18",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Кожа", "Древесина", "Ртуть"],
                },
                {
                    id: "19",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: [],
                },
                {
                    id: "21",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Древесина", "Руда", "Ртуть"],
                },
                {
                    id: "20",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Кожа", "Древесина", "Ртуть"],
                },
                {
                    id: "30",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Древесина", "Сталь"],
                },
                {
                    id: "37",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "78",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "90",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "240",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Обсидиан", "Сталь"],
                },
                {
                    id: "260",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: [],
                },
                {
                    id: "323",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "344",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: [],
                },
                {
                    id: "225",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: ["Никель", "Сталь"],
                },
                {
                    id: "281",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: [],
                },
                {
                    id: "302",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=49",
                    resources: [],
                },
            ],
        },
        {
            id: 5,
            name: "Wolf dale",
            x: 50,
            y: 51,
            factories: [
                {
                    id: "43",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: [],
                },
                {
                    id: "44",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: [],
                },
                {
                    id: "45",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "46",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Обсидиан", "Кожа", "Волшебный порошок"],
                },
                {
                    id: "47",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Самоцветы", "Волшебный порошок", "Сера"],
                },
                {
                    id: "48",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Орихалк", "Руда"],
                },
                {
                    id: "74",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: [],
                },
                {
                    id: "85",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "86",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "261",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "324",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "345",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "226",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: [],
                },
                {
                    id: "282",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: [],
                },
                {
                    id: "241",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: ["Руда", "Ртуть", "Никель", "Сталь"],
                },
                {
                    id: "303",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=51",
                    resources: [],
                },
            ],
        },
        {
            id: 6,
            name: "Peacful camp",
            x: 50,
            y: 48,
            factories: [
                {
                    id: "49",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: [],
                },
                {
                    id: "51",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "54",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Мифрил", "Самоцветы"],
                },
                {
                    id: "53",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "50",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: [],
                },
                {
                    id: "52",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "55",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "79",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Самоцветы", "Сталь"],
                },
                {
                    id: "73",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: [],
                },
                {
                    id: "82",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Никель", "Сталь", "Руда"],
                },
                {
                    id: "141",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "262",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: [],
                },
                {
                    id: "325",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "346",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: ["Самоцветы", "Волшебный порошок", "Никель"],
                },
                {
                    id: "283",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: [],
                },
                {
                    id: "304",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=48",
                    resources: [],
                },
            ],
        },
        {
            id: 7,
            name: "Lizard lowland",
            x: 49,
            y: 51,
            factories: [
                {
                    id: "56",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: [],
                },
                {
                    id: "57",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Мифрил", "Сталь", "Самоцветы"],
                },
                {
                    id: "64",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "59",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: [],
                },
                {
                    id: "58",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "60",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Мифрил", "Самоцветы"],
                },
                {
                    id: "61",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "63",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Сталь", "Самоцветы", "Никель"],
                },
                {
                    id: "80",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Древесина", "Кристаллы", "Самоцветы", "Никель"],
                },
                {
                    id: "83",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Мифрил", "Руда", "Самоцветы"],
                },
                {
                    id: "263",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "326",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: [],
                },
                {
                    id: "347",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Руда", "Никель", "Мифрил"],
                },
                {
                    id: "305",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Руда", "Ртуть", "Никель", "Сталь"],
                },
                {
                    id: "242",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Сера", "Кристаллы", "Сталь", "Никель"],
                },
                {
                    id: "284",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=51",
                    resources: ["Обсидиан", "Сталь"],
                },
            ],
        },
        {
            id: 8,
            name: "Green wood",
            x: 49,
            y: 50,
            factories: [
                {
                    id: "67",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Мифрил", "Кристаллы", "Ртуть", "Самоцветы"],
                },
                {
                    id: "69",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Орихалк", "Самоцветы", "Сталь"],
                },
                {
                    id: "81",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Орихалк", "Кристаллы", "Самоцветы", "Сталь"],
                },
                {
                    id: "72",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Обсидиан", "Сталь"],
                },
                {
                    id: "68",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "76",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Сталь", "Кристаллы", "Сера"],
                },
                {
                    id: "70",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Орихалк", "Кристаллы", "Самоцветы", "Сталь"],
                },
                {
                    id: "71",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "77",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Сера", "Кристаллы", "Сталь", "Никель"],
                },
                {
                    id: "88",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Руда", "Волшебный порошок", "Никель", "Сталь"],
                },
                {
                    id: "327",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Сталь", "Самоцветы", "Никель"],
                },
                {
                    id: "348",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Руда", "Ртуть", "Никель", "Сталь"],
                },
                {
                    id: "264",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Самоцветы", "Сталь"],
                },
                {
                    id: "306",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "243",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: [],
                },
                {
                    id: "285",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=50",
                    resources: [],
                },
            ],
        },
        {
            id: 9,
            name: "Eagle nest",
            x: 49,
            y: 48,
            factories: [
                {
                    id: "98",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "95",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "94",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: [],
                },
                {
                    id: "101",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Руда", "Самоцветы", "Сталь"],
                },
                {
                    id: "97",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "120",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "119",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Мифрил", "Самоцветы"],
                },
                {
                    id: "139",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "140",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Мифрил", "Сталь"],
                },
                {
                    id: "244",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: [],
                },
                {
                    id: "328",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: [],
                },
                {
                    id: "349",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "227",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: [],
                },
                {
                    id: "265",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: [],
                },
                {
                    id: "286",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: [],
                },
                {
                    id: "307",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=48",
                    resources: ["Мифрил", "Самоцветы"],
                },
            ],
        },
        {
            id: 10,
            name: "Portal ruins",
            x: 50,
            y: 52,
            factories: [
                {
                    id: "92",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: [],
                },
                {
                    id: "93",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: [],
                },
                {
                    id: "100",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Самоцветы", "Волшебный порошок", "Сера"],
                },
                {
                    id: "99",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Древесина", "Кристаллы", "Сталь"],
                },
                {
                    id: "102",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "118",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "228",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: [],
                },
                {
                    id: "245",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: [],
                },
                {
                    id: "329",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "350",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "217",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Обсидиан", "Руда", "Самоцветы"],
                },
                {
                    id: "287",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Кожа", "Сталь", "Мифрил"],
                },
                {
                    id: "308",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "211",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "266",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: [],
                },
                {
                    id: "163",
                    path: "https://my.lordswm.com/map.php?cx=50&cy=52",
                    resources: ["Ртуть", "Сера"],
                },
            ],
        },
        {
            id: 11,
            name: "Dragon caves",
            x: 51,
            y: 51,
            factories: [
                {
                    id: "167",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: [],
                },
                {
                    id: "168",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: [],
                },
                {
                    id: "169",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: [],
                },
                {
                    id: "171",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Сталь", "Ртуть"],
                },
                {
                    id: "172",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Кожа", "Сталь"],
                },
                {
                    id: "218",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Мифрил", "Самоцветы"],
                },
                {
                    id: "229",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Орихалк", "Самоцветы", "Сталь"],
                },
                {
                    id: "330",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "351",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Мифрил", "Самоцветы"],
                },
                {
                    id: "209",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Сталь", "Кристаллы", "Сера"],
                },
                {
                    id: "210",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "267",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "288",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Волшебный порошок", "Кожа"],
                },
                {
                    id: "309",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Орихалк"],
                },
                {
                    id: "170",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Мифрил", "Сталь"],
                },
                {
                    id: "246",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=51",
                    resources: ["Орихалк", "Кристаллы"],
                },
            ],
        },
        {
            id: 12,
            name: "Shining spring",
            x: 49,
            y: 49,
            factories: [
                {
                    id: "108",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "109",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "113",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "110",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "117",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "111",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Кристаллы", "Сера"],
                },
                {
                    id: "112",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "114",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Орихалк", "Руда"],
                },
                {
                    id: "219",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: [],
                },
                {
                    id: "230",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Волшебный порошок", "Кожа"],
                },
                {
                    id: "247",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: [],
                },
                {
                    id: "331",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: [],
                },
                {
                    id: "352",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Сталь", "Самоцветы", "Никель"],
                },
                {
                    id: "268",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Обсидиан", "Кожа", "Волшебный порошок"],
                },
                {
                    id: "310",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: ["Кожа", "Никель", "Мифрил"],
                },
                {
                    id: "289",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=49",
                    resources: [],
                },
            ],
        },
        {
            id: 13,
            name: "Sunny city",
            x: 48,
            y: 49,
            factories: [
                {
                    id: "103",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Мифрил"],
                },
                {
                    id: "104",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: [],
                },
                {
                    id: "105",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "107",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Орихалк", "Руда"],
                },
                {
                    id: "116",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "115",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "106",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Мифрил", "Руда"],
                },
                {
                    id: "213",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Мифрил", "Сталь", "Самоцветы"],
                },
                {
                    id: "220",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: [],
                },
                {
                    id: "248",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "332",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "353",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Руда", "Никель", "Мифрил"],
                },
                {
                    id: "231",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Сталь", "Кожа"],
                },
                {
                    id: "269",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: [],
                },
                {
                    id: "290",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: ["Мифрил", "Сталь", "Самоцветы"],
                },
                {
                    id: "311",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=49",
                    resources: [],
                },
            ],
        },
        {
            id: 14,
            name: "Magma mines",
            x: 52,
            y: 50,
            factories: [
                {
                    id: "144",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "143",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Кожа", "Никель", "Мифрил"],
                },
                {
                    id: "145",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Мифрил", "Сера", "Самоцветы"],
                },
                {
                    id: "122",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: [],
                },
                {
                    id: "121",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "164",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "135",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Ртуть", "Сера"],
                },
                {
                    id: "142",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Мифрил", "Сера", "Самоцветы"],
                },
                {
                    id: "249",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: [],
                },
                {
                    id: "333",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "354",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "270",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: [],
                },
                {
                    id: "291",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "312",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: [],
                },
                {
                    id: "216",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "232",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=50",
                    resources: ["Руда", "Кожа", "Никель", "Мифрил"],
                },
            ],
        },
        {
            id: 15,
            name: "Bear mountain",
            x: 52,
            y: 49,
            factories: [
                {
                    id: "0",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "2",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "1",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "17",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "29",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "41",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "40",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "147",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Мифрил", "Руда", "Самоцветы"],
                },
                {
                    id: "146",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Орихалк", "Руда"],
                },
                {
                    id: "149",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Кожа", "Сталь", "Мифрил"],
                },
                {
                    id: "148",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Обсидиан", "Сталь"],
                },
                {
                    id: "124",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: [],
                },
                {
                    id: "123",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "125",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: [],
                },
                {
                    id: "136",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Древесина", "Руда"],
                },
                {
                    id: "214",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: [],
                },
                {
                    id: "334",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: [],
                },
                {
                    id: "355",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Волшебный порошок", "Самоцветы", "Сталь"],
                },
                {
                    id: "62",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "292",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Сталь", "Кожа"],
                },
                {
                    id: "250",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "313",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Руда", "Сталь"],
                },
                {
                    id: "215",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Обсидиан", "Древесина", "Сера"],
                },
                {
                    id: "66",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "271",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "65",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "96",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
                {
                    id: "91",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=49&st=mn",
                    resources: [],
                },
            ],
        },
        {
            id: 16,
            name: "Fairy trees",
            x: 52,
            y: 48,
            factories: [
                {
                    id: "127",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "150",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Руда", "Никель", "Мифрил"],
                },
                {
                    id: "152",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Волшебный порошок"],
                },
                {
                    id: "126",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: [],
                },
                {
                    id: "134",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "153",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Руда", "Никель", "Сталь"],
                },
                {
                    id: "212",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Волшебный порошок"],
                },
                {
                    id: "335",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: [],
                },
                {
                    id: "356",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Никель", "Самоцветы"],
                },
                {
                    id: "151",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Руда", "Волшебный порошок", "Никель", "Сталь"],
                },
                {
                    id: "221",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "293",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Сталь", "Кожа"],
                },
                {
                    id: "233",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: [],
                },
                {
                    id: "251",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: [],
                },
                {
                    id: "314",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "272",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=48",
                    resources: [],
                },
            ],
        },
        {
            id: 17,
            name: "Harbour city",
            x: 53,
            y: 50,
            factories: [
                {
                    id: "158",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "160",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Орихалк", "Кристаллы", "Руда"],
                },
                {
                    id: "159",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Кожа", "Никель", "Мифрил"],
                },
                {
                    id: "131",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: [],
                },
                {
                    id: "133",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Руда", "Никель", "Сталь"],
                },
                {
                    id: "132",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Мифрил", "Кристаллы", "Ртуть", "Самоцветы"],
                },
                {
                    id: "222",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Обсидиан", "Кожа", "Волшебный порошок"],
                },
                {
                    id: "234",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Орихалк", "Кристаллы", "Руда"],
                },
                {
                    id: "336",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Мифрил"],
                },
                {
                    id: "161",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Кожа", "Никель", "Мифрил"],
                },
                {
                    id: "294",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Никель", "Сталь"],
                },
                {
                    id: "162",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Руда", "Никель", "Мифрил"],
                },
                {
                    id: "315",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Обсидиан", "Мифрил", "Волшебный порошок"],
                },
                {
                    id: "252",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: [],
                },
                {
                    id: "357",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: ["Мифрил", "Сталь"],
                },
                {
                    id: "273",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=50",
                    resources: [],
                },
            ],
        },
        {
            id: 18,
            name: "Mithril coast",
            x: 53,
            y: 49,
            factories: [
                {
                    id: "154",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Мифрил", "Руда"],
                },
                {
                    id: "155",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "156",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "157",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Самоцветы", "Волшебный порошок", "Сера"],
                },
                {
                    id: "130",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: [],
                },
                {
                    id: "128",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Руда", "Никель", "Мифрил"],
                },
                {
                    id: "129",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: [],
                },
                {
                    id: "137",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Древесина", "Руда", "Ртуть"],
                },
                {
                    id: "138",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "235",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: [],
                },
                {
                    id: "253",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: [],
                },
                {
                    id: "337",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "274",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "316",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Мифрил", "Сталь", "Самоцветы"],
                },
                {
                    id: "295",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: ["Орихалк", "Самоцветы", "Сталь"],
                },
                {
                    id: "358",
                    path: "https://my.lordswm.com/map.php?cx=53&cy=49",
                    resources: [],
                },
            ],
        },
        {
            id: 19,
            name: "Great wall",
            x: 51,
            y: 52,
            factories: [
                {
                    id: "173",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Кожа", "Древесина", "Ртуть"],
                },
                {
                    id: "178",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "179",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "192",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Обсидиан", "Кожа", "Волшебный порошок"],
                },
                {
                    id: "194",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "193",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "202",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Сталь", "Кристаллы", "Сера"],
                },
                {
                    id: "195",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "203",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Мифрил", "Руда", "Самоцветы"],
                },
                {
                    id: "254",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Сталь"],
                },
                {
                    id: "338",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "201",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Обсидиан"],
                },
                {
                    id: "275",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Кристаллы", "Самоцветы", "Сталь"],
                },
                {
                    id: "317",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "296",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "359",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=52",
                    resources: ["Орихалк", "Кристаллы"],
                },
            ],
        },
        {
            id: 20,
            name: "Titans valley",
            x: 51,
            y: 53,
            factories: [
                {
                    id: "176",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "177",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Обсидиан"],
                },
                {
                    id: "188",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "191",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Обсидиан", "Мифрил", "Волшебный порошок"],
                },
                {
                    id: "189",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Обсидиан", "Древесина", "Сера"],
                },
                {
                    id: "255",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Волшебный порошок", "Самоцветы", "Сталь"],
                },
                {
                    id: "339",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Волшебный порошок", "Самоцветы", "Сталь"],
                },
                {
                    id: "187",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Обсидиан", "Руда", "Самоцветы"],
                },
                {
                    id: "206",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк"],
                },
                {
                    id: "208",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "360",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "318",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "207",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Кристаллы", "Сера"],
                },
                {
                    id: "276",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Руда"],
                },
                {
                    id: "297",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "190",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=53",
                    resources: ["Самоцветы", "Волшебный порошок", "Сера"],
                },
            ],
        },
        {
            id: 21,
            name: "Fisshing village",
            x: 52,
            y: 53,
            factories: [
                {
                    id: "174",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Обсидиан", "Мифрил", "Волшебный порошок"],
                },
                {
                    id: "223",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Волшебный порошок", "Самоцветы", "Сталь"],
                },
                {
                    id: "236",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Руда", "Ртуть", "Сталь", "Никель"],
                },
                {
                    id: "256",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Кристаллы", "Мифрил", "Сталь"],
                },
                {
                    id: "319",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Орихалк", "Кристаллы", "Руда"],
                },
                {
                    id: "340",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Мифрил", "Сталь", "Самоцветы"],
                },
                {
                    id: "166",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Кожа"],
                },
                {
                    id: "196",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "198",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Орихалк"],
                },
                {
                    id: "200",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Древесина", "Сталь", "Никель"],
                },
                {
                    id: "199",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "277",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Кожа", "Древесина", "Ртуть"],
                },
                {
                    id: "361",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "175",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "298",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Обсидиан", "Сталь"],
                },
                {
                    id: "197",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=53",
                    resources: ["Мифрил", "Руда", "Самоцветы"],
                },
            ],
        },
        {
            id: 22,
            name: "Kingdom castle",
            x: 52,
            y: 54,
            factories: [
                {
                    id: "181",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "180",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "185",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Обсидиан", "Мифрил", "Волшебный порошок"],
                },
                {
                    id: "186",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: [],
                },
                {
                    id: "205",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "204",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Мифрил"],
                },
                {
                    id: "257",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Обсидиан", "Древесина", "Сера"],
                },
                {
                    id: "320",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Древесина", "Руда", "Мифриловая руда"],
                },
                {
                    id: "341",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "184",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: [],
                },
                {
                    id: "278",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "182",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "237",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Кристаллы", "Сталь"],
                },
                {
                    id: "299",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "183",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Мифрил", "Руда"],
                },
                {
                    id: "362",
                    path: "https://my.lordswm.com/map.php?cx=52&cy=54",
                    resources: ["Волшебный порошок", "Кожа"],
                },
            ],
        },
        {
            id: 23,
            name: "Ungovernable steppe",
            x: 48,
            y: 48,
            factories: [
                {
                    id: "372",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "373",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "375",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Мифрил", "Руда", "Самоцветы"],
                },
                {
                    id: "376",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Самоцветы", "Сталь"],
                },
                {
                    id: "378",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "377",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Обсидиан", "Древесина", "Сера"],
                },
                {
                    id: "380",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Обсидиан"],
                },
                {
                    id: "379",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Обсидиан", "Кожа", "Волшебный порошок"],
                },
                {
                    id: "364",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: [],
                },
                {
                    id: "363",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: [],
                },
                {
                    id: "365",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: [],
                },
                {
                    id: "366",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Волшебный порошок", "Кожа"],
                },
                {
                    id: "374",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Орихалк", "Кристаллы"],
                },
                {
                    id: "369",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Орихалк", "Кристаллы", "Сталь"],
                },
                {
                    id: "371",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: ["Кожа", "Сталь", "Мифрил"],
                },
                {
                    id: "370",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=48",
                    resources: [],
                },
            ],
        },
        {
            id: 24,
            name: "Crystal garden",
            x: 51,
            y: 48,
            factories: [
                {
                    id: "381",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "385",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Кристаллы", "Сера"],
                },
                {
                    id: "387",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "386",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Самоцветы", "Руда"],
                },
                {
                    id: "388",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Кожа", "Древесина", "Ртуть"],
                },
                {
                    id: "389",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "393",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "390",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Обсидиан", "Руда", "Самоцветы"],
                },
                {
                    id: "392",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Кристаллы", "Руда"],
                },
                {
                    id: "391",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Никель", "Сталь", "Руда"],
                },
                {
                    id: "367",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Обсидиан", "Мифрил", "Волшебный порошок"],
                },
                {
                    id: "383",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Руда"],
                },
                {
                    id: "368",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "382",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Обсидиан", "Руда", "Самоцветы"],
                },
                {
                    id: "394",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Орихалк", "Самоцветы"],
                },
                {
                    id: "384",
                    path: "https://my.lordswm.com/map.php?cx=51&cy=48",
                    resources: ["Мифрил", "Самоцветы"],
                },
            ],
        },
        {
            id: 25,
            name: "East island",
            x: 0,
            y: 0,
        },
        {
            id: 26,
            name: "The wilderness",
            x: 49,
            y: 52,
            factories: [
                {
                    id: "395",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Мифрил", "Руда", "Самоцветы"],
                },
                {
                    id: "396",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Кристаллы", "Мифрил", "Сталь"],
                },
                {
                    id: "398",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Обсидиан", "Сталь"],
                },
                {
                    id: "399",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Обсидиан"],
                },
                {
                    id: "402",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "401",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "404",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Орихалк", "Самоцветы", "Ртуть", "Руда"],
                },
                {
                    id: "410",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Сталь", "Руда", "Самоцветы"],
                },
                {
                    id: "408",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Кожа", "Древесина", "Ртуть"],
                },
                {
                    id: "409",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "406",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "405",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Орихалк", "Сталь", "Никель", "Самоцветы"],
                },
                {
                    id: "400",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Орихалк", "Кристаллы", "Сталь"],
                },
                {
                    id: "403",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "407",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Мифрил", "Сталь", "Ртуть"],
                },
                {
                    id: "397",
                    path: "https://my.lordswm.com/map.php?cx=49&cy=52",
                    resources: ["Кристаллы", "Мифрил", "Сталь"],
                },
            ],
        },
        {
            id: 27,
            name: "Sublime arbor",
            x: 48,
            y: 50,
            factories: [
                {
                    id: "415",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Мифрил", "Самоцветы"],
                },
                {
                    id: "416",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Орихалк"],
                },
                {
                    id: "417",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Кожа", "Сталь"],
                },
                {
                    id: "421",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Древесина", "Кристаллы", "Самоцветы", "Никель"],
                },
                {
                    id: "422",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Орихалк", "Кристаллы", "Сталь"],
                },
                {
                    id: "411",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Орихалк", "Сталь", "Самоцветы", "Кожа"],
                },
                {
                    id: "425",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Сталь", "Ртуть"],
                },
                {
                    id: "424",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "413",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Кожа", "Никель", "Мифрил"],
                },
                {
                    id: "412",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Древесина", "Волшебный порошок"],
                },
                {
                    id: "418",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Орихалк", "Руда", "Самоцветы"],
                },
                {
                    id: "419",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Обсидиан", "Руда", "Сера", "Кристаллы", "Самоцветы"],
                },
                {
                    id: "420",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Руда", "Кожа", "Никель", "Мифрил"],
                },
                {
                    id: "423",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Самоцветы", "Волшебный порошок", "Сера"],
                },
                {
                    id: "414",
                    path: "https://my.lordswm.com/map.php?cx=48&cy=50",
                    resources: ["Орихалк", "Кристаллы", "Самоцветы", "Сталь"],
                },
            ],
        },
    ];

    window.addEventListener('load', () => {
        if (location.pathname.includes("map.php")) {
            const elements = [
                {name: 'Руда', img: 'https://cfcdn.lordswm.com/i/r/48/ore.png?v=3.23de65'},
                {name: 'Древесина', img: 'https://cfcdn.lordswm.com/i/r/48/wood.png?v=3.23de65'},
                {name: 'Ртуть', img: 'https://cfcdn.lordswm.com/i/r/48/mercury.png?v=3.23de65'},
                {name: 'Сера', img: 'https://cfcdn.lordswm.com/i/r/48/sulfur.png?v=3.23de65'},
                {name: 'Кристаллы', img: 'https://cfcdn.lordswm.com/i/r/48/crystals.png?v=3.23de65'},
                {name: 'Самоцветы', img: 'https://cfcdn.lordswm.com/i/r/48/gems.png?v=3.23de65'},
            ];
            const style = document.createElement('style');
            style.textContent = `
            .resource-item {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: background 0.2s;
            }
            .resource-item.active {
                background: #d9ac25;
            }
            .resource-item img {
                width: 25px;
                height: 25px;
             }`;

            document.head.appendChild(style);

            let my_coordinate;
            let found;
            let factories;
            if (window.capt) {
                my_coordinate = window.capt;
                my_coordinate = my_coordinate.replaceAll("'", "");
                found = map_data.find(obj => obj.name.toLowerCase() === my_coordinate.toLowerCase());
                factories = found.factories;
            } else {
                let sec_id = document.getElementsByClassName("map_sector map_sector_selected")[0].id;
                sec_id = sec_id.match(/\d+/gi)[0];
                my_coordinate = Number(sec_id);
                found = map_data.find(obj => obj.id === my_coordinate);
                factories = found.factories;
            }


            const parent_block_auto_selling = document.querySelector('#map_right_block_inside');
            parent_block_auto_selling.style.removeProperty('height');
            const parent_block_auto_selling2 = document.querySelector('#map_right_block');
            parent_block_auto_selling2.style.removeProperty('height');

            const panel_container = create_el('div', 'z-index: 10000;display: flex;; justify-content: space-around; width: 250px; height: 40px;', '');
            const list_of_factories = create_el('div', 'display: flex; flex-direction: column');

            parent_block_auto_selling.appendChild(panel_container);

            let selectedResource = resource;

            const set_factoies_list_func = () => {
                list_of_factories.innerHTML = "";
                let factories_count = factories.filter(el => el.resources.includes(selectedResource));
                if (factories_count.length === 0) {
                    list_of_factories.textContent = `Немає заводів, які купляють ${selectedResource}`;
                    return;
                }
                factories.forEach(el => {
                    if (el.resources.includes(selectedResource)) {
                        let item = create_el('div', 'cursor: pointer',`Завод №${el.id}`);
                        item.href = `${link}/object-info.php?id=${el.id}`;
                        item.addEventListener('click', () => {
                            window.open(`${link}/object-info.php?id=${el.id}`, '_blank')
                        });
                        list_of_factories.appendChild(item);
                    }
                });
            }
            set_factoies_list_func();

            elements.forEach(el => {
                let container = create_el('div', 'width: 35px; height: 35px; border-radius: 50%; display: flex; justify-content: center; align-items: center;');
                container.className = 'resource-item';

                let elem = create_el('img', 'cursor: pointer; width: 25px; height: 25px;');
                elem.src = el.img;
                container.appendChild(elem);
                panel_container.appendChild(container);
                if (el.name === selectedResource) {
                    container.classList.add('active');
                }
                container.addEventListener('click', () => {
                    selectedResource = el.name;
                    save_resource(el.name);
                    selectedResource = el.name;
                    document.querySelectorAll('.resource-item').forEach(c => c.classList.remove('active'));
                    container.classList.add('active');
                    set_factoies_list_func();
                })
            })

            parent_block_auto_selling.appendChild(list_of_factories);
        }
    });

    if (location.pathname.includes("object-info.php")) {
        const randomDelay = (min = 5000, max = 10000) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const integer = randomDelay();

        const rows = document.querySelectorAll("tr.wblight");
        let elementRow;

        for (const row of rows) {
            const firstTd = row.querySelector("td");
            if (firstTd && firstTd.innerText.includes(resource)) {
                elementRow = row;
                break;
            }
        }

        const tds = elementRow.querySelectorAll("td");
        const buyCell = tds[4]; // 5-та колонка — кнопка/інпут або "-";

        const input = buyCell.querySelector("input[type='text'], input[type='number']");
        const button = buyCell.querySelector("input[type='submit'], button");

        // Друга колонка — скільки одиниць можна продати
        const availableAmount = 50;

        // Вводимо кількість і клікаємо
        if (input) {
            input.value = availableAmount;
            button.click();
        } else {
            setTimeout(() => {
                location.reload(true);
            }, integer)
        }
    }
})();