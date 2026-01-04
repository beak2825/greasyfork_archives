// ==UserScript==
// @name         DegenIdle Market Scraper - Telegram 
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  1 msg por item (agrupado), sem travar tela, continua mesmo sem ofertas, muda de página corretamente, retorna após popup e envia resumo final.
// @author       Unknown
// @match        https://degenidle.com/market
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557264/DegenIdle%20Market%20Scraper%20-%20Telegram.user.js
// @updateURL https://update.greasyfork.org/scripts/557264/DegenIdle%20Market%20Scraper%20-%20Telegram.meta.js
// ==/UserScript==

(function () {
'use strict';

const BOT_TOKEN = '8212301892:AAFGNTLNXhzo04DPfpd-VbgUdKUru6KxN44';
const CHAT_ID = '-1003066433402';

let maxXPValue = null;

// ================================
//  ACUMULADORES (NOVO)
// ================================
let TOTAL_GASTO = 0;
let TOTAL_XP = 0;
let TOTAL_QTD = 0;
// ================================

const ITEMS_TO_WATCH = [
        {
            "Name": "Copper Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Copper Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Copper Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Copper Helmet",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Copper Sword",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 }
            ]
        },
        {
            "Name": "Copper Shield",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 }
            ]
        },
        {
            "Name": "Leather Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Leather Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Leather Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Leather Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Leather Bow",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 }
            ]
        },
        {
            "Name": "Wool Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Wool Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Wool Robe",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Wool Shoes",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 },
                { "Rarity": "Legendary", "Value": 576, "XP": 288 },
                { "Rarity": "Mythic", "Value": 628, "XP": 312 }
            ]
        },
        {
            "Name": "Wool Staff",
            "Variants": [
                { "Rarity": "Common", "Value": 480, "XP": 240 },
                { "Rarity": "Uncommon", "Value": 504, "XP": 252 },
                { "Rarity": "Rare", "Value": 528, "XP": 264 },
                { "Rarity": "Epic", "Value": 552, "XP": 276 }
            ]
        },
        {
            "Name": "Iron Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Iron Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Iron Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Iron Helmet",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Iron Sword",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 }
            ]
        },
        {
            "Name": "Iron Shield",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 }
            ]
        },
        {
            "Name": "Thick Leather Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Thick Leather Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Thick Leather Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Thick Leather Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Thick Leather Bow",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 }
            ]
        },
        {
            "Name": "Silk Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Silk Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Silk Robe",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Silk Shoes",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 },
                { "Rarity": "Epic", "Value": 736, "XP": 368 }
            ]
        },
        {
            "Name": "Silk Staff",
            "Variants": [
                { "Rarity": "Common", "Value": 640, "XP": 320 },
                { "Rarity": "Uncommon", "Value": 672, "XP": 336 },
                { "Rarity": "Rare", "Value": 704, "XP": 352 }
            ]
        },
        {
            "Name": "Silver Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Silver Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Silver Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Silver Helmet",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Silver Sword",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 }
            ]
        },
        {
            "Name": "Silver Shield",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 }
            ]
        },
        {
            "Name": "Sturdy Leather Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Sturdy Leather Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Sturdy Leather Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Sturdy Leather Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Sturdy Leather Bow",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 }
            ]
        },
        {
            "Name": "Moonlit Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Moonlit Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Moonlit Robe",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Moonlit Shoes",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 },
                { "Rarity": "Uncommon", "Value": 1008, "XP": 504 },
                { "Rarity": "Rare", "Value": 1056, "XP": 528 }
            ]
        },
        {
            "Name": "Moonlit Staff",
            "Variants": [
                { "Rarity": "Common", "Value": 960, "XP": 480 }
            ]
        },
        {
            "Name": "Gold Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Gold Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Gold Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Gold Helmet",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Heavy Leather Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Heavy Leather Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Heavy Leather Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Heavy Leather Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Etheric Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Etheric Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Etheric Robe",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Etheric Shoes",
            "Variants": [
                { "Rarity": "Common", "Value": 1280, "XP": 640 },
                { "Rarity": "Uncommon", "Value": 1344, "XP": 672 },
                { "Rarity": "Rare", "Value": 1459, "XP": 704 }
            ]
        },
        {
            "Name": "Platinum Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Platinum Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Platinum Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Platinum Helmet",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Tough Leather Bodyarmor",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Tough Leather Boots",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Tough Leather Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Tough Leather Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Shadow Gloves",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Shadow Hat",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Shadow Robe",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        {
            "Name": "Shadow Shoes",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 }
            ]
        },
        // Itens base
        { "Name": "Leather", "Variants": [{ "Rarity": "Common", "Value": 30, "XP": 15 }] },
        { "Name": "Wool Cloth", "Variants": [{ "Rarity": "Common", "Value": 30, "XP": 15 }] },
        { "Name": "Copper Bar", "Variants": [{ "Rarity": "Common", "Value": 30, "XP": 15 }] },

        { "Name": "Thick Leather", "Variants": [{ "Rarity": "Common", "Value": 40, "XP": 20 }] },
        { "Name": "Silk Cloth", "Variants": [{ "Rarity": "Common", "Value": 40, "XP": 20 }] },
        { "Name": "Iron Bar", "Variants": [{ "Rarity": "Common", "Value": 40, "XP": 20 }] },

        { "Name": "Sturdy Leather", "Variants": [{ "Rarity": "Common", "Value": 60, "XP": 30 }] },
        { "Name": "Moonlit Cloth", "Variants": [{ "Rarity": "Common", "Value": 60, "XP": 30 }] },
        { "Name": "Silver Bar", "Variants": [{ "Rarity": "Common", "Value": 60, "XP": 30 }] },

        { "Name": "Heavy Leather", "Variants": [{ "Rarity": "Common", "Value": 80, "XP": 40 }] },
        { "Name": "Etheric Cloth", "Variants": [{ "Rarity": "Common", "Value": 80, "XP": 40 }] },
        { "Name": "Gold Bar", "Variants": [{ "Rarity": "Common", "Value": 80, "XP": 40 }] },

        { "Name": "Tough Leather", "Variants": [{ "Rarity": "Common", "Value": 100, "XP": 50 }] },
        { "Name": "Shadow Cloth", "Variants": [{ "Rarity": "Common", "Value": 100, "XP": 50 }] },
        { "Name": "Platinum Bar", "Variants": [{ "Rarity": "Common", "Value": 100, "XP": 50 }] },

        { "Name": "Reinforced Leather", "Variants": [{ "Rarity": "Common", "Value": 120, "XP": 60 }] },
        { "Name": "Mystweave Cloth", "Variants": [{ "Rarity": "Common", "Value": 120, "XP": 60 }] },
        { "Name": "Mithril Bar", "Variants": [{ "Rarity": "Common", "Value": 120, "XP": 60 }] },

        { "Name": "Shadowhide Leather", "Variants": [{ "Rarity": "Common", "Value": 140, "XP": 70 }] },
        { "Name": "Arcane Cloth", "Variants": [{ "Rarity": "Common", "Value": 140, "XP": 70 }] },
        { "Name": "Adamantite Bar", "Variants": [{ "Rarity": "Common", "Value": 140, "XP": 70 }] },

        { "Name": "Dragonhide Leather", "Variants": [{ "Rarity": "Common", "Value": 160, "XP": 80 }] },
        { "Name": "Aether Cloth", "Variants": [{ "Rarity": "Common", "Value": 160, "XP": 80 }] },
        { "Name": "Eternium Bar", "Variants": [{ "Rarity": "Common", "Value": 160, "XP": 80 }] },

        { "Name": "Abyssal Leather", "Variants": [{ "Rarity": "Common", "Value": 180, "XP": 90 }] },
        { "Name": "Astral Cloth", "Variants": [{ "Rarity": "Common", "Value": 180, "XP": 90 }] },
        { "Name": "Nyxium Bar", "Variants": [{ "Rarity": "Common", "Value": 180, "XP": 90 }] },

        // Itens para armas
        { "Name": "Wool Bowstring", "Variants": [{ "Rarity": "Common", "Value": 240, "XP": 120 }] },
        { "Name": "Copper Gemstone", "Variants": [{ "Rarity": "Common", "Value": 240, "XP": 120 }] },
        { "Name": "Leather Handle", "Variants": [{ "Rarity": "Common", "Value": 240, "XP": 120 }] },

        { "Name": "Silk Bowstring", "Variants": [{ "Rarity": "Common", "Value": 320, "XP": 160 }] },
        { "Name": "Iron Gemstone", "Variants": [{ "Rarity": "Common", "Value": 320, "XP": 160 }] },
        { "Name": "Thick Leather Handle", "Variants": [{ "Rarity": "Common", "Value": 320, "XP": 160 }] },

        { "Name": "Moonlit Bowstring", "Variants": [{ "Rarity": "Common", "Value": 480, "XP": 240 }] },
        { "Name": "Silver Gemstone", "Variants": [{ "Rarity": "Common", "Value": 480, "XP": 240 }] },
        { "Name": "Sturdy Leather Handle", "Variants": [{ "Rarity": "Common", "Value": 480, "XP": 240 }] },

        { "Name": "Etheric Bowstring", "Variants": [{ "Rarity": "Common", "Value": 640, "XP": 320 }] },
        { "Name": "Gold Gemstone", "Variants": [{ "Rarity": "Common", "Value": 640, "XP": 320 }] },
        { "Name": "Heavy Leather Handle", "Variants": [{ "Rarity": "Common", "Value": 640, "XP": 320 }] },

        { "Name": "Shadow Bowstring", "Variants": [{ "Rarity": "Common", "Value": 800, "XP": 400 }] },
        { "Name": "Platinum Gemstone", "Variants": [{ "Rarity": "Common", "Value": 800, "XP": 400 }] },
        { "Name": "Tough Leather Handle", "Variants": [{ "Rarity": "Common", "Value": 800, "XP": 400 }] },

        //craft

        {
            "Name": "Copper Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 6000, "XP": 3000 },
                { "Rarity": "Uncommon", "Value": 6300, "XP": 3150 },
                { "Rarity": "Rare", "Value": 6930, "XP": 3465 },
                { "Rarity": "Epic", "Value": 7970, "XP": 3985 },
                { "Rarity": "Legendary", "Value": 9563, "XP": 4782 },
                { "Rarity": "Mythic", "Value": 12432, "XP": 6216 }
            ]
        },
        {
            "Name": "Copper Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 6000, "XP": 3000 },
                { "Rarity": "Uncommon", "Value": 6300, "XP": 3150 },
                { "Rarity": "Rare", "Value": 6930, "XP": 3465 },
                { "Rarity": "Epic", "Value": 7970, "XP": 3985 },
                { "Rarity": "Legendary", "Value": 9563, "XP": 4782 },
                { "Rarity": "Mythic", "Value": 12432, "XP": 6216 }
            ]
        },
        {
            "Name": "Copper Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 6000, "XP": 3000 },
                { "Rarity": "Uncommon", "Value": 6300, "XP": 3150 },
                { "Rarity": "Rare", "Value": 6930, "XP": 3465 },
                { "Rarity": "Epic", "Value": 7970, "XP": 3985 },
                { "Rarity": "Legendary", "Value": 9563, "XP": 4782 },
                { "Rarity": "Mythic", "Value": 12432, "XP": 6216 }
            ]
        },
        {
            "Name": "Copper Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 6000, "XP": 3000 },
                { "Rarity": "Uncommon", "Value": 6300, "XP": 3150 },
                { "Rarity": "Rare", "Value": 6930, "XP": 3465 },
                { "Rarity": "Epic", "Value": 7970, "XP": 3985 },
                { "Rarity": "Legendary", "Value": 9563, "XP": 4782 },
                { "Rarity": "Mythic", "Value": 12432, "XP": 6216 }
            ]
        },
        {
            "Name": "Leather Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 6000, "XP": 3000 },
                { "Rarity": "Uncommon", "Value": 6300, "XP": 3150 },
                { "Rarity": "Rare", "Value": 6930, "XP": 3465 },
                { "Rarity": "Epic", "Value": 7970, "XP": 3985 },
                { "Rarity": "Legendary", "Value": 9563, "XP": 4782 },
                { "Rarity": "Mythic", "Value": 12432, "XP": 6216 }
            ]
        },
        {
            "Name": "Wool Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 6000, "XP": 3000 },
                { "Rarity": "Uncommon", "Value": 6300, "XP": 3150 },
                { "Rarity": "Rare", "Value": 6930, "XP": 3465 },
                { "Rarity": "Epic", "Value": 7970, "XP": 3985 },
                { "Rarity": "Legendary", "Value": 9563, "XP": 4782 },
                { "Rarity": "Mythic", "Value": 12432, "XP": 6216 }
            ]
        },
        {
            "Name": "Iron Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 8000, "XP": 4000 },
                { "Rarity": "Uncommon", "Value": 8400, "XP": 4200 },
                { "Rarity": "Rare", "Value": 9240, "XP": 4620 },
                { "Rarity": "Epic", "Value": 10626, "XP": 5313 },
                { "Rarity": "Legendary", "Value": 12751, "XP": 6313 },
                { "Rarity": "Mythic", "Value": 16577, "XP": 8288 }
            ]
        },
        {
            "Name": "Iron Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 8000, "XP": 4000 },
                { "Rarity": "Uncommon", "Value": 8400, "XP": 4200 },
                { "Rarity": "Rare", "Value": 9240, "XP": 4620 },
                { "Rarity": "Epic", "Value": 10626, "XP": 5313 },
                { "Rarity": "Legendary", "Value": 12751, "XP": 6313 },
                { "Rarity": "Mythic", "Value": 16577, "XP": 8288 }
            ]
        },
        {
            "Name": "Iron Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 8000, "XP": 4000 },
                { "Rarity": "Uncommon", "Value": 8400, "XP": 4200 },
                { "Rarity": "Rare", "Value": 9240, "XP": 4620 },
                { "Rarity": "Epic", "Value": 10626, "XP": 5313 },
                { "Rarity": "Legendary", "Value": 12751, "XP": 6313 },
                { "Rarity": "Mythic", "Value": 16577, "XP": 8288 }
            ]
        },
        {
            "Name": "Iron Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 8000, "XP": 4000 },
                { "Rarity": "Uncommon", "Value": 8400, "XP": 4200 },
                { "Rarity": "Rare", "Value": 9240, "XP": 4620 },
                { "Rarity": "Epic", "Value": 10626, "XP": 5313 },
                { "Rarity": "Legendary", "Value": 12751, "XP": 6313 },
                { "Rarity": "Mythic", "Value": 16577, "XP": 8288 }
            ]
        },
        {
            "Name": "Thick Leather Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 8000, "XP": 4000 },
                { "Rarity": "Uncommon", "Value": 8400, "XP": 4200 },
                { "Rarity": "Rare", "Value": 9240, "XP": 4620 },
                { "Rarity": "Epic", "Value": 10626, "XP": 5313 },
                { "Rarity": "Legendary", "Value": 12751, "XP": 6313 },
                { "Rarity": "Mythic", "Value": 16577, "XP": 8288 }
            ]
        },
        {
            "Name": "Silk Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 8000, "XP": 4000 },
                { "Rarity": "Uncommon", "Value": 8400, "XP": 4200 },
                { "Rarity": "Rare", "Value": 9240, "XP": 4620 },
                { "Rarity": "Epic", "Value": 10626, "XP": 5313 },
                { "Rarity": "Legendary", "Value": 12751, "XP": 6313 },
                { "Rarity": "Mythic", "Value": 16577, "XP": 8288 }
            ]
        },
        {
            "Name": "Silver Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 12000, "XP": 6000 },
                { "Rarity": "Uncommon", "Value": 12600, "XP": 6300 },
                { "Rarity": "Rare", "Value": 13860, "XP": 6930 },
                { "Rarity": "Epic", "Value": 15939, "XP": 7970 },
                { "Rarity": "Legendary", "Value": 19127, "XP": 9563 },
                { "Rarity": "Mythic", "Value": 24865, "XP": 12432 }
            ]
        },
        {
            "Name": "Silver Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 12000, "XP": 6000 },
                { "Rarity": "Uncommon", "Value": 12600, "XP": 6300 },
                { "Rarity": "Rare", "Value": 13860, "XP": 6930 },
                { "Rarity": "Epic", "Value": 15939, "XP": 7970 },
                { "Rarity": "Legendary", "Value": 19127, "XP": 9563 },
                { "Rarity": "Mythic", "Value": 24865, "XP": 12432 }
            ]
        },
        {
            "Name": "Silver Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 12000, "XP": 6000 },
                { "Rarity": "Uncommon", "Value": 12600, "XP": 6300 },
                { "Rarity": "Rare", "Value": 13860, "XP": 6930 },
                { "Rarity": "Epic", "Value": 15939, "XP": 7970 },
                { "Rarity": "Legendary", "Value": 19127, "XP": 9563 },
                { "Rarity": "Mythic", "Value": 24865, "XP": 12432 }
            ]
        },
        {
            "Name": "Silver Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 12000, "XP": 6000 },
                { "Rarity": "Uncommon", "Value": 12600, "XP": 6300 },
                { "Rarity": "Rare", "Value": 13860, "XP": 6930 },
                { "Rarity": "Epic", "Value": 15939, "XP": 7970 },
                { "Rarity": "Legendary", "Value": 19127, "XP": 9563 },
                { "Rarity": "Mythic", "Value": 24865, "XP": 12432 }
            ]
        },
        {
            "Name": "Sturdy Leather Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 12000, "XP": 6000 },
                { "Rarity": "Uncommon", "Value": 12600, "XP": 6300 },
                { "Rarity": "Rare", "Value": 13860, "XP": 6930 },
                { "Rarity": "Epic", "Value": 15939, "XP": 7970 },
                { "Rarity": "Legendary", "Value": 19127, "XP": 9563 },
                { "Rarity": "Mythic", "Value": 24865, "XP": 12432 }
            ]
        },
        {
            "Name": "Moonlit Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 12000, "XP": 6000 },
                { "Rarity": "Uncommon", "Value": 12600, "XP": 6300 },
                { "Rarity": "Rare", "Value": 13860, "XP": 6930 },
                { "Rarity": "Epic", "Value": 15939, "XP": 7970 },
                { "Rarity": "Legendary", "Value": 19127, "XP": 9563 },
                { "Rarity": "Mythic", "Value": 24865, "XP": 12432 }
            ]
        },
        {
            "Name": "Gold Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 16000, "XP": 8000 },
                { "Rarity": "Uncommon", "Value": 16800, "XP": 8400 },
                { "Rarity": "Rare", "Value": 18480, "XP": 9240 },
                { "Rarity": "Epic", "Value": 21252, "XP": 10626 },
                { "Rarity": "Legendary", "Value": 25502, "XP": 12751 },
                { "Rarity": "Mythic", "Value": 22153, "XP": 16577 }
            ]
        },
        {
            "Name": "Gold Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 16000, "XP": 8000 },
                { "Rarity": "Uncommon", "Value": 16800, "XP": 8400 },
                { "Rarity": "Rare", "Value": 18480, "XP": 9240 },
                { "Rarity": "Epic", "Value": 21252, "XP": 10626 },
                { "Rarity": "Legendary", "Value": 25502, "XP": 12751 },
                { "Rarity": "Mythic", "Value": 22153, "XP": 16577 }
            ]
        },
        {
            "Name": "Gold Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 16000, "XP": 8000 },
                { "Rarity": "Uncommon", "Value": 16800, "XP": 8400 },
                { "Rarity": "Rare", "Value": 18480, "XP": 9240 },
                { "Rarity": "Epic", "Value": 21252, "XP": 10626 },
                { "Rarity": "Legendary", "Value": 25502, "XP": 12751 },
                { "Rarity": "Mythic", "Value": 22153, "XP": 16577 }
            ]
        },
        {
            "Name": "Gold Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 16000, "XP": 8000 },
                { "Rarity": "Uncommon", "Value": 16800, "XP": 8400 },
                { "Rarity": "Rare", "Value": 18480, "XP": 9240 },
                { "Rarity": "Epic", "Value": 21252, "XP": 10626 },
                { "Rarity": "Legendary", "Value": 25502, "XP": 12751 },
                { "Rarity": "Mythic", "Value": 22153, "XP": 16577 }
            ]
        },
        {
            "Name": "Heavy Leather Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 16000, "XP": 8000 },
                { "Rarity": "Uncommon", "Value": 16800, "XP": 8400 },
                { "Rarity": "Rare", "Value": 18480, "XP": 9240 },
                { "Rarity": "Epic", "Value": 21252, "XP": 10626 },
                { "Rarity": "Legendary", "Value": 25502, "XP": 12751 },
                { "Rarity": "Mythic", "Value": 22153, "XP": 16577 }
            ]
        },
        {
            "Name": "Etheric Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 16000, "XP": 8000 },
                { "Rarity": "Uncommon", "Value": 16800, "XP": 8400 },
                { "Rarity": "Rare", "Value": 18480, "XP": 9240 },
                { "Rarity": "Epic", "Value": 21252, "XP": 10626 },
                { "Rarity": "Legendary", "Value": 25502, "XP": 12751 },
                { "Rarity": "Mythic", "Value": 22153, "XP": 16577 }
            ]
        },
        {
            "Name": "Platinum Amulet",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 },
                { "Rarity": "Uncommon", "Value": 1680, "XP": 840 }
            ]
        },
        {
            "Name": "Platinum Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 20000, "XP": 10000 },
                { "Rarity": "Uncommon", "Value": 21000, "XP": 10500 },
                { "Rarity": "Rare", "Value": 23100, "XP": 11550 },
                { "Rarity": "Epic", "Value": 26565, "XP": 13283 },
                { "Rarity": "Legendary", "Value": 31878, "XP": 15939 },
                { "Rarity": "Mythic", "Value": 41441, "XP": 20721 }
            ]
        },
        {
            "Name": "Platinum Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 20000, "XP": 10000 },
                { "Rarity": "Uncommon", "Value": 21000, "XP": 10500 },
                { "Rarity": "Rare", "Value": 23100, "XP": 11550 },
                { "Rarity": "Epic", "Value": 26565, "XP": 13283 },
                { "Rarity": "Legendary", "Value": 31878, "XP": 15939 },
                { "Rarity": "Mythic", "Value": 41441, "XP": 20721 }
            ]
        },
        {
            "Name": "Platinum Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 20000, "XP": 10000 },
                { "Rarity": "Uncommon", "Value": 21000, "XP": 10500 },
                { "Rarity": "Rare", "Value": 23100, "XP": 11550 },
                { "Rarity": "Epic", "Value": 26565, "XP": 13283 },
                { "Rarity": "Legendary", "Value": 31878, "XP": 15939 },
                { "Rarity": "Mythic", "Value": 41441, "XP": 20721 }
            ]
        },
        {
            "Name": "Platinum Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 20000, "XP": 10000 },
                { "Rarity": "Uncommon", "Value": 21000, "XP": 10500 },
                { "Rarity": "Rare", "Value": 23100, "XP": 11550 },
                { "Rarity": "Epic", "Value": 26565, "XP": 13283 },
                { "Rarity": "Legendary", "Value": 31878, "XP": 15939 },
                { "Rarity": "Mythic", "Value": 41441, "XP": 20721 }
            ]
        },
        {
            "Name": "Tough Leather Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 20000, "XP": 10000 },
                { "Rarity": "Uncommon", "Value": 21000, "XP": 10500 },
                { "Rarity": "Rare", "Value": 23100, "XP": 11550 },
                { "Rarity": "Epic", "Value": 26565, "XP": 13283 },
                { "Rarity": "Legendary", "Value": 31878, "XP": 15939 },
                { "Rarity": "Mythic", "Value": 41441, "XP": 20721 }
            ]
        },
        {
            "Name": "Shadow Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 20000, "XP": 10000 },
                { "Rarity": "Uncommon", "Value": 21000, "XP": 10500 },
                { "Rarity": "Rare", "Value": 23100, "XP": 11550 },
                { "Rarity": "Epic", "Value": 26565, "XP": 13283 },
                { "Rarity": "Legendary", "Value": 31878, "XP": 15939 },
                { "Rarity": "Mythic", "Value": 41441, "XP": 20721 }
            ]
        },
        {
            "Name": "Platinum Ring",
            "Variants": [
                { "Rarity": "Common", "Value": 1600, "XP": 800 },
                { "Rarity": "Uncommon", "Value": 1680, "XP": 840 }
            ]
        },
        {
            "Name": "Mithril Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 24000, "XP": 12000 },
                { "Rarity": "Uncommon", "Value": 25200, "XP": 12600 },
                { "Rarity": "Rare", "Value": 27720, "XP": 13860 },
                { "Rarity": "Epic", "Value": 31878, "XP": 15939 },
                { "Rarity": "Legendary", "Value": 38254, "XP": 19127 },
                { "Rarity": "Mythic", "Value": 49730, "XP": 24865 }
            ]
        },
        {
            "Name": "Mithril Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 24000, "XP": 12000 },
                { "Rarity": "Uncommon", "Value": 25200, "XP": 12600 },
                { "Rarity": "Rare", "Value": 27720, "XP": 13860 },
                { "Rarity": "Epic", "Value": 31878, "XP": 15939 },
                { "Rarity": "Legendary", "Value": 38254, "XP": 19127 },
                { "Rarity": "Mythic", "Value": 49730, "XP": 24865 }
            ]
        },
        {
            "Name": "Mithril Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 24000, "XP": 12000 },
                { "Rarity": "Uncommon", "Value": 25200, "XP": 12600 },
                { "Rarity": "Rare", "Value": 27720, "XP": 13860 },
                { "Rarity": "Epic", "Value": 31878, "XP": 15939 },
                { "Rarity": "Legendary", "Value": 38254, "XP": 19127 },
                { "Rarity": "Mythic", "Value": 49730, "XP": 24865 }
            ]
        },
        {
            "Name": "Mithril Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 24000, "XP": 12000 },
                { "Rarity": "Uncommon", "Value": 25200, "XP": 12600 },
                { "Rarity": "Rare", "Value": 27720, "XP": 13860 },
                { "Rarity": "Epic", "Value": 31878, "XP": 15939 },
                { "Rarity": "Legendary", "Value": 38254, "XP": 19127 },
                { "Rarity": "Mythic", "Value": 49730, "XP": 24865 }
            ]
        },
        {
            "Name": "Reinforced Leather Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 24000, "XP": 12000 },
                { "Rarity": "Uncommon", "Value": 25200, "XP": 12600 },
                { "Rarity": "Rare", "Value": 27720, "XP": 13860 },
                { "Rarity": "Epic", "Value": 31878, "XP": 15939 },
                { "Rarity": "Legendary", "Value": 38254, "XP": 19127 },
                { "Rarity": "Mythic", "Value": 49730, "XP": 24865 }
            ]
        },
        {
            "Name": "Celestial Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 24000, "XP": 12000 },
                { "Rarity": "Uncommon", "Value": 25200, "XP": 12600 },
                { "Rarity": "Rare", "Value": 27720, "XP": 13860 },
                { "Rarity": "Epic", "Value": 31878, "XP": 15939 },
                { "Rarity": "Legendary", "Value": 38254, "XP": 19127 },
                { "Rarity": "Mythic", "Value": 49730, "XP": 24865 }
            ]
        },
        {
            "Name": "Adamantite Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 28000, "XP": 14000 },
                { "Rarity": "Uncommon", "Value": 29400, "XP": 14700 },
                { "Rarity": "Rare", "Value": 32340, "XP": 16170 },
                { "Rarity": "Epic", "Value": 37191, "XP": 18596 },
                { "Rarity": "Legendary", "Value": 44629, "XP": 22315 },
                { "Rarity": "Mythic", "Value": 58018, "XP": 29009 }
            ]
        },
        {
            "Name": "Adamantite Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 28000, "XP": 14000 },
                { "Rarity": "Uncommon", "Value": 29400, "XP": 14700 },
                { "Rarity": "Rare", "Value": 32340, "XP": 16170 },
                { "Rarity": "Epic", "Value": 37191, "XP": 18596 },
                { "Rarity": "Legendary", "Value": 44629, "XP": 22315 },
                { "Rarity": "Mythic", "Value": 58018, "XP": 29009 }
            ]
        },
        {
            "Name": "Adamantite Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 28000, "XP": 14000 },
                { "Rarity": "Uncommon", "Value": 29400, "XP": 14700 },
                { "Rarity": "Rare", "Value": 32340, "XP": 16170 },
                { "Rarity": "Epic", "Value": 37191, "XP": 18596 },
                { "Rarity": "Legendary", "Value": 44629, "XP": 22315 },
                { "Rarity": "Mythic", "Value": 58018, "XP": 29009 }
            ]
        },
        {
            "Name": "Adamantite Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 28000, "XP": 14000 },
                { "Rarity": "Uncommon", "Value": 29400, "XP": 14700 },
                { "Rarity": "Rare", "Value": 32340, "XP": 16170 },
                { "Rarity": "Epic", "Value": 37191, "XP": 18596 },
                { "Rarity": "Legendary", "Value": 44629, "XP": 22315 },
                { "Rarity": "Mythic", "Value": 58018, "XP": 29009 }
            ]
        },
        {
            "Name": "Arcane Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 28000, "XP": 14000 },
                { "Rarity": "Uncommon", "Value": 29400, "XP": 14700 },
                { "Rarity": "Rare", "Value": 32340, "XP": 16170 },
                { "Rarity": "Epic", "Value": 37191, "XP": 18596 },
                { "Rarity": "Legendary", "Value": 44629, "XP": 22315 },
                { "Rarity": "Mythic", "Value": 58018, "XP": 29009 }
            ]
        },
        {
            "Name": "Shadowhide Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 28000, "XP": 14000 },
                { "Rarity": "Uncommon", "Value": 29400, "XP": 14700 },
                { "Rarity": "Rare", "Value": 32340, "XP": 16170 },
                { "Rarity": "Epic", "Value": 37191, "XP": 18596 },
                { "Rarity": "Legendary", "Value": 44629, "XP": 22315 },
                { "Rarity": "Mythic", "Value": 58018, "XP": 29009 }
            ]
        },
        {
            "Name": "Eternium Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 32000, "XP": 16000 },
                { "Rarity": "Uncommon", "Value": 33600, "XP": 16800 },
                { "Rarity": "Rare", "Value": 36960, "XP": 18480 },
                { "Rarity": "Epic", "Value": 42504, "XP": 21252 },
                { "Rarity": "Legendary", "Value": 51005, "XP": 25502 },
                { "Rarity": "Mythic", "Value": 66306, "XP": 33153 }
            ]
        },
        {
            "Name": "Eternium Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 32000, "XP": 16000 },
                { "Rarity": "Uncommon", "Value": 33600, "XP": 16800 },
                { "Rarity": "Rare", "Value": 36960, "XP": 18480 },
                { "Rarity": "Epic", "Value": 42504, "XP": 21252 },
                { "Rarity": "Legendary", "Value": 51005, "XP": 25502 },
                { "Rarity": "Mythic", "Value": 66306, "XP": 33153 }
            ]
        },
        {
            "Name": "Eternium Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 32000, "XP": 16000 },
                { "Rarity": "Uncommon", "Value": 33600, "XP": 16800 },
                { "Rarity": "Rare", "Value": 36960, "XP": 18480 },
                { "Rarity": "Epic", "Value": 42504, "XP": 21252 },
                { "Rarity": "Legendary", "Value": 51005, "XP": 25502 },
                { "Rarity": "Mythic", "Value": 66306, "XP": 33153 }
            ]
        },
        {
            "Name": "Eternium Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 32000, "XP": 16000 },
                { "Rarity": "Uncommon", "Value": 33600, "XP": 16800 },
                { "Rarity": "Rare", "Value": 36960, "XP": 18480 },
                { "Rarity": "Epic", "Value": 42504, "XP": 21252 },
                { "Rarity": "Legendary", "Value": 51005, "XP": 25502 },
                { "Rarity": "Mythic", "Value": 66306, "XP": 33153 }
            ]
        },
        {
            "Name": "Dragonhide Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 32000, "XP": 16000 },
                { "Rarity": "Uncommon", "Value": 33600, "XP": 16800 },
                { "Rarity": "Rare", "Value": 36960, "XP": 18480 },
                { "Rarity": "Epic", "Value": 42504, "XP": 21252 },
                { "Rarity": "Legendary", "Value": 51005, "XP": 25502 },
                { "Rarity": "Mythic", "Value": 66306, "XP": 33153 }
            ]
        },
        {
            "Name": "Aether Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 32000, "XP": 16000 },
                { "Rarity": "Uncommon", "Value": 33600, "XP": 16800 },
                { "Rarity": "Rare", "Value": 36960, "XP": 18480 },
                { "Rarity": "Epic", "Value": 42504, "XP": 21252 },
                { "Rarity": "Legendary", "Value": 51005, "XP": 25502 },
                { "Rarity": "Mythic", "Value": 66306, "XP": 33153 }
            ]
        },
        {
            "Name": "Nyxium Axe",
            "Variants": [
                { "Rarity": "Common", "Value": 36000, "XP": 18000 },
                { "Rarity": "Uncommon", "Value": 37800, "XP": 18900 },
                { "Rarity": "Rare", "Value": 41580, "XP": 20790 },
                { "Rarity": "Epic", "Value": 47817, "XP": 23909 },
                { "Rarity": "Legendary", "Value": 57380, "XP": 28690 },
                { "Rarity": "Mythic", "Value": 74595, "XP": 37297 }
            ]
        },
        {
            "Name": "Nyxium Fishing Rod",
            "Variants": [
                { "Rarity": "Common", "Value": 36000, "XP": 18000 },
                { "Rarity": "Uncommon", "Value": 37800, "XP": 18900 },
                { "Rarity": "Rare", "Value": 41580, "XP": 20790 },
                { "Rarity": "Epic", "Value": 47817, "XP": 23909 },
                { "Rarity": "Legendary", "Value": 57380, "XP": 28690 },
                { "Rarity": "Mythic", "Value": 74595, "XP": 37297 }
            ]
        },
        {
            "Name": "Nyxium Pickaxe",
            "Variants": [
                { "Rarity": "Common", "Value": 36000, "XP": 18000 },
                { "Rarity": "Uncommon", "Value": 37800, "XP": 18900 },
                { "Rarity": "Rare", "Value": 41580, "XP": 20790 },
                { "Rarity": "Epic", "Value": 47817, "XP": 23909 },
                { "Rarity": "Legendary", "Value": 57380, "XP": 28690 },
                { "Rarity": "Mythic", "Value": 74595, "XP": 37297 }
            ]
        },
        {
            "Name": "Nyxium Trap",
            "Variants": [
                { "Rarity": "Common", "Value": 36000, "XP": 18000 },
                { "Rarity": "Uncommon", "Value": 37800, "XP": 18900 },
                { "Rarity": "Rare", "Value": 41580, "XP": 20790 },
                { "Rarity": "Epic", "Value": 47817, "XP": 23909 },
                { "Rarity": "Legendary", "Value": 57380, "XP": 28690 },
                { "Rarity": "Mythic", "Value": 74595, "XP": 37297 }
            ]
        },
        {
            "Name": "Abyssal Pouch",
            "Variants": [
                { "Rarity": "Common", "Value": 36000, "XP": 18000 },
                { "Rarity": "Uncommon", "Value": 37800, "XP": 18900 },
                { "Rarity": "Rare", "Value": 41580, "XP": 20790 },
                { "Rarity": "Epic", "Value": 47817, "XP": 23909 },
                { "Rarity": "Legendary", "Value": 57380, "XP": 28690 },
                { "Rarity": "Mythic", "Value": 74595, "XP": 37297 }
            ]
        },
        {
            "Name": "Astral Basket",
            "Variants": [
                { "Rarity": "Common", "Value": 36000, "XP": 18000 },
                { "Rarity": "Uncommon", "Value": 37800, "XP": 18900 },
                { "Rarity": "Rare", "Value": 41580, "XP": 20790 },
                { "Rarity": "Epic", "Value": 47817, "XP": 23909 },
                { "Rarity": "Legendary", "Value": 57380, "XP": 28690 },
                { "Rarity": "Mythic", "Value": 74595, "XP": 37297 }
            ]
        },
        { "Name": "Minor Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 60 }] },
  { "Name": "Minor Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 60 }] },
  { "Name": "Minor Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 60 }] },
  { "Name": "Whisperleaf Extract", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 15 }] },

  { "Name": "Briarthorn Resin", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 20 }] },
  { "Name": "Greater Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 80 }] },
  { "Name": "Greater Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 80 }] },
  { "Name": "Greater Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 80 }] },

  { "Name": "Emberroot Essence", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 30 }] },
  { "Name": "Mighty Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 120 }] },
  { "Name": "Mighty Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 120 }] },
  { "Name": "Mighty Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 120 }] },

  { "Name": "Frostleaf Distillate", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 40 }] },
  { "Name": "Resource Efficiency Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 320 }] },
  { "Name": "Superior Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 160 }] },
  { "Name": "Superior Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 160 }] },
  { "Name": "Superior Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 160 }] },
  { "Name": "Task Efficiency Potion I", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 320 }] },

  { "Name": "Dreamvine Sap", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 50 }] },
  { "Name": "Grand Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 200 }] },
  { "Name": "Grand Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 200 }] },
  { "Name": "Grand Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 200 }] },

  { "Name": "Spiritthorn Powder", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 60 }] },
  { "Name": "Spirit Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 240 }] },
  { "Name": "Spirit Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 240 }] },
  { "Name": "Spirit Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 240 }] },

  { "Name": "Shadowbloom Essence", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 70 }] },
  { "Name": "Umbral Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 280 }] },
  { "Name": "Umbral Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 280 }] },
  { "Name": "Umbral Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 280 }] },
  { "Name": "Defense Penetration Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 560 }] },
  { "Name": "Task Efficiency Potion II", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 560 }] },

  { "Name": "Sunpetal Infusion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 80 }] },
  { "Name": "Radiant Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 320 }] },
  { "Name": "Radiant Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 320 }] },
  { "Name": "Radiant Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 320 }] },

  { "Name": "Starlotus Extract", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 90 }] },
  { "Name": "Celestial Attack Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 360 }] },
  { "Name": "Celestial Defense Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 360 }] },
  { "Name": "Celestial Speed Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 360 }] },
  { "Name": "Critical Hit Potion", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 720 }] },
  { "Name": "Task Efficiency Potion III", "Variants": [{ "Rarity": "Common", "Value": 0, "XP": 720 }]

        }

    ];

const processedItems = new Set();
let stopScript = false;

function logAction(msg) { console.log(`[LOG] ${msg}`); }

function sendTelegramMessage(message) {
    logAction(`Enviando mensagem para o Telegram: ${message}`);
    GM_xmlhttpRequest({
        method: 'POST',
        url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ chat_id: CHAT_ID, text: message }),
        onload: res => logAction(`Mensagem enviada com sucesso: ${res.responseText}`),
        onerror: res => logAction(`Erro ao enviar mensagem: ${res.responseText}`)
    });
}

function convertPrice(text) {
    if (!text) return 0;
    const cleaned = text.toLowerCase().replace(/[^\d.km]/g, '');
    const num = parseFloat(cleaned.replace(/[km]/, '')) || 0;
    const result = text.includes('m') ? num * 1_000_000 : text.includes('k') ? num * 1_000 : num;
    logAction(`Convertendo preço "${text}" -> ${result}`);
    return result;
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                logAction(`Elemento encontrado: ${selector}`);
                resolve(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                logAction(`Elemento NÃO encontrado (timeout): ${selector}`);
                reject(new Error(`Elemento "${selector}" não encontrado.`));
            }
        }, 200);
    });
}

async function goToPage(targetPage) {
    logAction(`Indo para página ${targetPage}`);
    let actual = getCurrentPage();
    while (actual < targetPage) {
        const nextBtn = Array.from(document.querySelectorAll('button'))
            .find(b => b.innerText.trim() === 'Next' && !b.disabled);

        if (!nextBtn) {
            logAction('Botão Next não encontrado ou desabilitado');
            break;
        }

        nextBtn.click();
        logAction("Clicando no botão Next");
        await new Promise(r => setTimeout(r, 700));

        actual = getCurrentPage();
        logAction(`Página atual após Next: ${actual}`);
    }
}

function parseTotalPages() {
    const el = Array.from(document.querySelectorAll('div, span'))
        .find(x => x.innerText && /Showing\s+\d+\-\d+\s+of\s+\d+/i.test(x.innerText));
    if (!el) return 1;

    const match = el.innerText.match(/Showing\s+\d+\-\d+\s+of\s+(\d+)/i);
    if (!match) return 1;

    const total = parseInt(match[1], 10);
    const perPage = Array.from(document.querySelectorAll('.bg-\\[\\#252B3B\\]\\/30')).length || 25;

    const pages = Math.ceil(total / perPage);
    logAction(`Total de páginas: ${pages}`);
    return pages;
}

function getCurrentPage() {
    const el = Array.from(document.querySelectorAll('div, span'))
        .find(x => /Showing\s+\d+\-\d+\s+of\s+\d+/i.test(x.innerText));

    if (!el) return 1;

    const match = el.innerText.match(/Showing\s+(\d+)\-/i);
    if (!match) return 1;

    const start = parseInt(match[1], 10);
    const perPage = Array.from(document.querySelectorAll('.bg-\\[\\#252B3B\\]\\/30')).length || 25;

    const page = Math.floor((start - 1) / perPage) + 1;

    logAction(`Página atual: ${page}`);
    return page;
}

async function closeItemDetails() {
    try {
        const closeBtn = document.querySelector("button.mb-4 > span");
        if (closeBtn && closeBtn.parentElement) {
            closeBtn.parentElement.click();
            logAction("Fechando detalhes do item");
            await new Promise(r => setTimeout(r, 350));
        }
    } catch (err) {
        logAction(`Erro ao fechar detalhes: ${err}`);
    }
}

async function processItemElement(el, item) {
    logAction(`Processando item: ${item.Name}`);

    el.click();
    await waitForElement('div.bg-\\[\\#1E2330\\]\\/40', 6000).catch(() => {});

    let container;
    try {
        container = await waitForElement('div.space-y-3', 5000);
    } catch {
        logAction("Nenhum container encontrado");
        await closeItemDetails();
        return;
    }

    const orders = container.querySelectorAll('button.grid');
    logAction(`${orders.length} ordens encontradas`);

    let grouped = new Map();

    for (const order of orders) {
        const priceEl = order.querySelector('.text-yellow-400.font-mono');
        const qtyEl = order.querySelector('span.text-gray-300');
        const rarityEl = order.querySelector('.text-right.text-sm');

        const price = priceEl ? convertPrice(priceEl.textContent.trim()) : 0;
        const qty = qtyEl ? parseInt(qtyEl.textContent.replace("x", "").trim()) : 1;
        const rarity = rarityEl ? rarityEl.textContent.trim() : "Unknown";

        const variant = item.Variants.find(v => v.Rarity.toLowerCase() === rarity.toLowerCase());
        if (!variant) continue;

        const custoGX = price / variant.XP;

        logAction(`Item: ${item.Name}, Raridade: ${rarity}, Preço: ${price}, XP: ${variant.XP}, Custo G/XP: ${custoGX.toFixed(2)}`);

        if (custoGX <= maxXPValue) {
            const key = `${price}_${rarity}`;
            if (!grouped.has(key)) grouped.set(key, { price, rarity, xp: variant.XP, qty: 0 });

            grouped.get(key).qty += qty;
        }
    }

    if (grouped.size > 0) {
        let msg = `⚠️ Item encontrado ⚠️\n\n❗ Item: ${item.Name}\n\n`;

        let first = true;
        for (const g of grouped.values()) {
            if (!first) msg += "----------------------\n";
            first = false;

            const custo = (g.price / g.xp).toFixed(2);

            msg +=
                `💰Valor: ${g.price}\n` +
                `✨XP: ${g.xp}\n` +
                `🔢Custo: ${custo} G/XP\n` +
                `🎨Raridade: ${g.rarity}\n` +
                `📦Qtd: ${g.qty}\n`;

            // =======================================
            // ACUMULADORES DO RESUMO FINAL (NOVO)
            // =======================================
            TOTAL_GASTO += g.price * g.qty;
            TOTAL_XP += g.xp * g.qty;
            TOTAL_QTD += g.qty;
        }

        sendTelegramMessage(msg);
    }

    await closeItemDetails();
}

async function processPage(pageNumber) {
    logAction(`Processando página ${pageNumber}`);
    await goToPage(pageNumber);
    await new Promise(r => setTimeout(r, 300));

    function getNames() {
        return Array.from(document.querySelectorAll('.bg-\\[\\#252B3B\\]\\/30'))
            .map(c => c.querySelector('h3.font-medium')?.innerText?.trim())
            .filter(Boolean);
    }

    let namesOnPage = getNames();

    let remaining = namesOnPage.filter(name =>
        ITEMS_TO_WATCH.some(i => i.Name === name) &&
        !processedItems.has(name)
    );

    while (remaining.length > 0) {
        for (const name of remaining) {
            const item = ITEMS_TO_WATCH.find(i => i.Name === name);
            if (!item) continue;

            const card = Array.from(document.querySelectorAll('.bg-\\[\\#252B3B\\]\\/30'))
                .find(c => c.querySelector('h3.font-medium')?.innerText?.trim() === name);

            if (!card) continue;

            processedItems.add(name);
            await processItemElement(card, item);

            await new Promise(r => setTimeout(r, 200));

            let tries = 0;
            while (
                !Array.from(document.querySelectorAll("button"))
                    .some(b => b.innerText.trim() === "Next") &&
                tries < 15
            ) {
                logAction("Aguardando botão Next reaparecer...");
                await new Promise(r => setTimeout(r, 150));
                tries++;
            }

            logAction("Botão Next pronto, voltando para página " + pageNumber);
            await goToPage(pageNumber);
            await new Promise(r => setTimeout(r, 300));

            namesOnPage = getNames();
            remaining = namesOnPage.filter(n =>
                ITEMS_TO_WATCH.some(i => i.Name === n) &&
                !processedItems.has(n)
            );
        }
    }
}

async function processAllPages() {
    logAction("Iniciando varredura de todas as páginas");
    const totalPages = parseTotalPages();

    for (let page = 1; page <= totalPages; page++) {
        await processPage(page);
    }

    logAction("Varredura finalizada");

    // =============================
    // RESUMO FINAL (NOVO)
    // =============================
    if (TOTAL_QTD === 0) {
        sendTelegramMessage("⚠️ Nenhum item abaixo do limite foi encontrado.");
        return;
    }

    const custo_total = (TOTAL_GASTO / TOTAL_XP).toFixed(3);

    const resumo =
        "📊 *RESUMO FINAL DA VARREDURA*\n\n" +
        `💰 *Total gasto*: ${TOTAL_GASTO}\n` +
        `✨ *XP total ganho*: ${TOTAL_XP}\n` +
        `📦 *Quantidade total de itens*: ${TOTAL_QTD}\n` +
        `⚖️ *Custo médio*: ${custo_total} G/XP\n\n` +
        "✔️ Fim da análise.";

    sendTelegramMessage(resumo);
}

function createStartButton() {
    const btn = document.createElement('button');
    btn.innerText = 'Iniciar Scraper';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';

    btn.onclick = () => {
        const val = parseFloat(prompt("Digite o máximo G/XP (ex: 2):"));
        if (isNaN(val) || val <= 0) return alert("Valor inválido");

        maxXPValue = val;
        logAction("Valor máximo G/XP definido: " + maxXPValue);

        btn.disabled = true;
        btn.innerText = "Rodando...";

        processedItems.clear();
        stopScript = false;

        // reset acumuladores
        TOTAL_GASTO = 0;
        TOTAL_XP = 0;
        TOTAL_QTD = 0;

        processAllPages().then(() => {
            btn.disabled = false;
            btn.innerText = "Iniciar Scraper";
            logAction("Script finalizado");
        });
    };

    document.body.appendChild(btn);
}

window.addEventListener('load', () => {
    setTimeout(createStartButton, 800);
});

})();
