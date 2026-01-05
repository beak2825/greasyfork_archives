// ==UserScript==
// @name GGn Quick Crafter
// @description Craft multiple items more easily including equipment repair
// @namespace https://gazellegames.net/
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://unpkg.com/lunr/lunr.js
// @require https://unpkg.com/react@18/umd/react.development.js
// @require https://unpkg.com/react-dom@18/umd/react-dom.development.js
// @match https://gazellegames.net/user.php?action=crafting
// @version 3.5.5
// @license ISC
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/561476/GGn%20Quick%20Crafter.user.js
// @updateURL https://update.greasyfork.org/scripts/561476/GGn%20Quick%20Crafter.meta.js
// ==/UserScript==

/*
ISC License

Copyright (c) 2022 FinalDoom

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/

/* globals lunr, React, ReactDOM */
(function (React, require$$0, lunr) {
'use strict';



function ___$insertStylesToHeader(css) {
if (!css) {
return
}
if (typeof window === 'undefined') {
return
}

const style = document.createElement('style');

style.setAttribute('type', 'text/css');
style.innerHTML = css;
document.head.appendChild(style);
return css
}

function getDefaultExportFromCjs (x) {
return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var client = {};

var hasRequiredClient;
function requireClient() {
if (hasRequiredClient) return client;
hasRequiredClient = 1;
var m = require$$0;
{
client.createRoot = m.createRoot;
client.hydrateRoot = m.hydrateRoot;
}
return client;
}

var clientExports = requireClient();

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

function __classPrivateFieldGet(receiver, state, kind, f) {
if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
if (kind === "m") throw new TypeError("Private method is not writable");
if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
var e = new Error(message);
return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const universal = typeof globalThis !== "undefined" ? globalThis : global;
const performance = universal.performance;

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp) {
const clocktime = performance.now() * 1e-3;
let seconds = Math.floor(clocktime);
let nanoseconds = Math.floor(clocktime % 1 * 1e9);
return [seconds, nanoseconds];
}
// The current timestamp in whole milliseconds
function getMilliseconds() {
const [seconds, nanoseconds] = hrtime();
return seconds * 1e3 + Math.floor(nanoseconds / 1e6);
}
// Wait for a specified number of milliseconds before fulfilling the returned promise.
function wait(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* A hierarchical token bucket for rate limiting. See
* http://en.wikipedia.org/wiki/Token_bucket for more information.
*
* @param options
* @param options.bucketSize Maximum number of tokens to hold in the bucket.
* Also known as the burst rate.
* @param options.tokensPerInterval Number of tokens to drip into the bucket
* over the course of one interval.
* @param options.interval The interval length in milliseconds, or as
* one of the following strings: 'second', 'minute', 'hour', day'.
* @param options.parentBucket Optional. A token bucket that will act as
* the parent of this bucket.
*/
class TokenBucket {
constructor({
bucketSize,
tokensPerInterval,
interval,
parentBucket
}) {
this.bucketSize = bucketSize;
this.tokensPerInterval = tokensPerInterval;
if (typeof interval === "string") {
switch (interval) {
case "sec":
case "second":
this.interval = 1000;
break;
case "min":
case "minute":
this.interval = 1000 * 60;
break;
case "hr":
case "hour":
this.interval = 1000 * 60 * 60;
break;
case "day":
this.interval = 1000 * 60 * 60 * 24;
break;
default:
throw new Error("Invalid interval " + interval);
}
} else {
this.interval = interval;
}
this.parentBucket = parentBucket;
this.content = 0;
this.lastDrip = getMilliseconds();
}
/**
* Remove the requested number of tokens. If the bucket (and any parent
* buckets) contains enough tokens this will happen immediately. Otherwise,
* the removal will happen when enough tokens become available.
* @param count The number of tokens to remove.
* @returns A promise for the remainingTokens count.
*/
async removeTokens(count) {
// Is this an infinite size bucket?
if (this.bucketSize === 0) {
return Number.POSITIVE_INFINITY;
}
// Make sure the bucket can hold the requested number of tokens
if (count > this.bucketSize) {
throw new Error(`Requested tokens ${count} exceeds bucket size ${this.bucketSize}`);
}
// Drip new tokens into this bucket
this.drip();
const comeBackLater = async () => {
// How long do we need to wait to make up the difference in tokens?
const waitMs = Math.ceil((count - this.content) * (this.interval / this.tokensPerInterval));
await wait(waitMs);
return this.removeTokens(count);
};
// If we don't have enough tokens in this bucket, come back later
if (count > this.content) return comeBackLater();
if (this.parentBucket != undefined) {
// Remove the requested from the parent bucket first
const remainingTokens = await this.parentBucket.removeTokens(count);
// Check that we still have enough tokens in this bucket
if (count > this.content) return comeBackLater();
// Tokens were removed from the parent bucket, now remove them from
// this bucket. Note that we look at the current bucket and parent
// bucket's remaining tokens and return the smaller of the two values
this.content -= count;
return Math.min(remainingTokens, this.content);
} else {
// Remove the requested tokens from this bucket
this.content -= count;
return this.content;
}
}
/**
* Attempt to remove the requested number of tokens and return immediately.
* If the bucket (and any parent buckets) contains enough tokens this will
* return true, otherwise false is returned.
* @param {Number} count The number of tokens to remove.
* @param {Boolean} True if the tokens were successfully removed, otherwise
* false.
*/
tryRemoveTokens(count) {
// Is this an infinite size bucket?
if (!this.bucketSize) return true;
// Make sure the bucket can hold the requested number of tokens
if (count > this.bucketSize) return false;
// Drip new tokens into this bucket
this.drip();
// If we don't have enough tokens in this bucket, return false
if (count > this.content) return false;
// Try to remove the requested tokens from the parent bucket
if (this.parentBucket && !this.parentBucket.tryRemoveTokens(count)) return false;
// Remove the requested tokens from this bucket and return
this.content -= count;
return true;
}
/**
* Add any new tokens to the bucket since the last drip.
* @returns {Boolean} True if new tokens were added, otherwise false.
*/
drip() {
if (this.tokensPerInterval === 0) {
const prevContent = this.content;
this.content = this.bucketSize;
return this.content > prevContent;
}
const now = getMilliseconds();
const deltaMS = Math.max(now - this.lastDrip, 0);
this.lastDrip = now;
const dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
const prevContent = this.content;
this.content = Math.min(this.content + dripAmount, this.bucketSize);
return Math.floor(this.content) > Math.floor(prevContent);
}
}

/**
* A generic rate limiter. Underneath the hood, this uses a token bucket plus
* an additional check to limit how many tokens we can remove each interval.
*
* @param options
* @param options.tokensPerInterval Maximum number of tokens that can be
* removed at any given moment and over the course of one interval.
* @param options.interval The interval length in milliseconds, or as
* one of the following strings: 'second', 'minute', 'hour', day'.
* @param options.fireImmediately Whether or not the promise will resolve
* immediately when rate limiting is in effect (default is false).
*/
class RateLimiter {
constructor({
tokensPerInterval,
interval,
fireImmediately
}) {
this.tokenBucket = new TokenBucket({
bucketSize: tokensPerInterval,
tokensPerInterval,
interval
});
// Fill the token bucket to start
this.tokenBucket.content = tokensPerInterval;
this.curIntervalStart = getMilliseconds();
this.tokensThisInterval = 0;
this.fireImmediately = fireImmediately !== null && fireImmediately !== void 0 ? fireImmediately : false;
}
/**
* Remove the requested number of tokens. If the rate limiter contains enough
* tokens and we haven't spent too many tokens in this interval already, this
* will happen immediately. Otherwise, the removal will happen when enough
* tokens become available.
* @param count The number of tokens to remove.
* @returns A promise for the remainingTokens count.
*/
async removeTokens(count) {
// Make sure the request isn't for more than we can handle
if (count > this.tokenBucket.bucketSize) {
throw new Error(`Requested tokens ${count} exceeds maximum tokens per interval ${this.tokenBucket.bucketSize}`);
}
const now = getMilliseconds();
// Advance the current interval and reset the current interval token count
// if needed
if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
this.curIntervalStart = now;
this.tokensThisInterval = 0;
}
// If we don't have enough tokens left in this interval, wait until the
// next interval
if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
if (this.fireImmediately) {
return -1;
} else {
const waitMs = Math.ceil(this.curIntervalStart + this.tokenBucket.interval - now);
await wait(waitMs);
const remainingTokens = await this.tokenBucket.removeTokens(count);
this.tokensThisInterval += count;
return remainingTokens;
}
}
// Remove the requested number of tokens from the token bucket
const remainingTokens = await this.tokenBucket.removeTokens(count);
this.tokensThisInterval += count;
return remainingTokens;
}
/**
* Attempt to remove the requested number of tokens and return immediately.
* If the bucket (and any parent buckets) contains enough tokens and we
* haven't spent too many tokens in this interval already, this will return
* true. Otherwise, false is returned.
* @param {Number} count The number of tokens to remove.
* @param {Boolean} True if the tokens were successfully removed, otherwise
* false.
*/
tryRemoveTokens(count) {
// Make sure the request isn't for more than we can handle
if (count > this.tokenBucket.bucketSize) return false;
const now = getMilliseconds();
// Advance the current interval and reset the current interval token count
// if needed
if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
this.curIntervalStart = now;
this.tokensThisInterval = 0;
}
// If we don't have enough tokens left in this interval, return false
if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) return false;
// Try to remove the requested number of tokens from the token bucket
const removed = this.tokenBucket.tryRemoveTokens(count);
if (removed) {
this.tokensThisInterval += count;
}
return removed;
}
/**
* Returns the number of tokens remaining in the TokenBucket.
* @returns {Number} The number of tokens remaining.
*/
getTokensRemaining() {
this.tokenBucket.drip();
return this.tokenBucket.content;
}
}

// prettier-ignore
var INGREDIENTS = {
46: { name: 'Obsidian Plate Armor', image: 'static/common/items/Cover/Armor/2_black.png', category: 'Equipment', gold: 600, infStock: true },
66: { name: 'Upload Potion Sampler', image: 'static/common/items/Items/Potions/sample_green.png', category: 'Stat potions', gold: 2500, infStock: true },
72: { name: 'IRC Voice (2 Weeks)', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 10000, infStock: true },
98: { name: 'Small Upload Potion', image: 'static/common/items/Items/Potions/small_green.png', category: 'Stat potions', gold: 5000, infStock: true },
99: { name: 'Upload Potion', image: 'static/common/items/Items/Potions/green.png', category: 'Stat potions', gold: 10000, infStock: true },
100: { name: 'Large Upload Potion', image: 'static/common/items/Items/Potions/large_green.png', category: 'Stat potions', gold: 25000, infStock: true },
104: { name: 'Download-Reduction Potion Sampler', image: 'static/common/items/Items/Potions/sample_red.png', category: 'Stat potions', gold: 3000, infStock: true },
105: { name: 'Small Download-Reduction Potion', image: 'static/common/items/Items/Potions/small_red.png', category: 'Stat potions', gold: 6000, infStock: true },
106: { name: 'Download-Reduction Potion', image: 'static/common/items/Items/Potions/red.png', category: 'Stat potions', gold: 12000, infStock: true },
107: { name: 'Large Download-Reduction Potion', image: 'static/common/items/Items/Potions/large_red.png', category: 'Stat potions', gold: 30000, infStock: true },
111: { name: 'Purple Angelica Flowers', image: 'static/common/items/Items/Plants/angelica_flowers.png', category: 'Crafting Materials', gold: 2000, infStock: true },
112: { name: 'Head of Garlic', image: 'static/common/items/Items/Plants/garlic.png', category: 'Crafting Materials', gold: 1000, infStock: false },
113: { name: 'Yellow Hellebore Flower', image: 'static/common/items/Items/Plants/hellebore_flower.png', category: 'Crafting Materials', gold: 2500, infStock: true },
114: { name: 'Black Elderberries', image: 'static/common/items/Items/Plants/black_elder_berries.png', category: 'Crafting Materials', gold: 2000, infStock: true },
115: { name: 'Black Elder Leaves', image: 'static/common/items/Items/Plants/black_elder_leaves.png', category: 'Crafting Materials', gold: 1600, infStock: true },
116: { name: 'Emerald', image: 'static/common/items/Items/Gems/emerald.png', category: 'Crafting Materials', gold: 10000, infStock: true },
118: { name: 'Flawless Emerald', image: 'static/common/items/Items/Gems/flawless_emerald.png', category: 'Crafting Materials', gold: 100000, infStock: true },
120: { name: 'Green Onyx Gem', image: 'static/common/items/Items/Gems/green_onyx.png', category: 'Crafting Materials', gold: 20000, infStock: true },
121: { name: 'Flawless Amethyst', image: 'static/common/items/Items/Gems/flawless_amethyst.png', category: 'Crafting Materials', gold: 200000, infStock: true },
124: { name: 'Vial', image: 'static/common/items/Items/Vials/vial.png', category: 'Crafting Materials', gold: 1000, infStock: true },
125: { name: 'Test Tube', image: 'static/common/items/Items/Vials/test_tube.png', category: 'Crafting Materials', gold: 400, infStock: true },
126: { name: 'Bowl', image: 'static/common/items/Items/Vials/bowl.png', category: 'Crafting Materials', gold: 1500, infStock: true },
127: { name: 'Garlic Tincture', image: 'static/common/items/Items/Plants/garlic_tincture.png', category: 'Crafting Materials', gold: 2000, infStock: true },
175: { name: 'IRC Voice (2 Weeks) - Low Cost Option', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 5000, infStock: true },
925: { name: 'Orange Male Body', image: 'static/common/items/Cover/Body/Male_Orange.png', category: 'Bodies', gold: 1000, infStock: true },
1987: { name: 'Pile of Sand', image: 'static/common/items/Items/Vials/sand.png', category: 'Crafting Materials', gold: 250, infStock: true },
1988: { name: 'Glass Shards', image: 'static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 275, infStock: true },
2130: { name: "Monarch's Crown", image: 'static/common/items/Cover/Helmet/Helmet__Style_11_Yellow.png', category: 'Equipment', gold: 1500, infStock: true },
2135: { name: "Lucky Deity's Wings", image: 'static/common/items/Cover/Wings/White_Angel_Wings.png', category: 'Equipment', gold: 2000, infStock: true },
2149: { name: 'Yellow Monk Robe', image: 'static/common/items/Cover/Clothes/Yellow_Monk_Robe.png', category: 'Equipment', gold: 600, infStock: true },
2153: { name: "Farore's Flame", image: 'static/common/items/Items/Bling/flame_green.png', category: 'Crafting Materials', gold: 150000, infStock: false },
2154: { name: "Nayru's Flame", image: 'static/common/items/Items/Bling/flame_blue.png', category: 'Crafting Materials', gold: 150000, infStock: false },
2155: { name: "Din's Flame", image: 'static/common/items/Items/Bling/flame_red.png', category: 'Crafting Materials', gold: 150000, infStock: false },
2212: { name: 'IRC Voice (8 Weeks)', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 20000, infStock: true },
2225: { name: 'Bronze Alloy Mix', image: 'static/common/items/Items/Ore/bronze.png', category: 'Crafting Materials', gold: 1000, infStock: false },
2226: { name: 'Iron Ore', image: 'static/common/items/Items/Ore/iron.png', category: 'Crafting Materials', gold: 2000, infStock: false },
2227: { name: 'Gold Ore', image: 'static/common/items/Items/Ore/gold.png', category: 'Crafting Materials', gold: 3500, infStock: false },
2228: { name: 'Mithril Ore', image: 'static/common/items/Items/Ore/mithril.png', category: 'Crafting Materials', gold: 5500, infStock: false },
2229: { name: 'Adamantium Ore', image: 'static/common/items/Items/Ore/adamantium.png', category: 'Crafting Materials', gold: 16000, infStock: false },
2230: { name: 'Quartz Dust', image: 'static/common/items/Items/Ore/quartz.png', category: 'Crafting Materials', gold: 1250, infStock: false },
2231: { name: 'Jade Dust', image: 'static/common/items/Items/Ore/jade.png', category: 'Crafting Materials', gold: 2500, infStock: false },
2232: { name: 'Amethyst Dust', image: 'static/common/items/Items/Ore/amethyst.png', category: 'Crafting Materials', gold: 8000, infStock: false },
2233: { name: 'Lump of Coal', image: 'static/common/items/Items/Ore/coal.png', category: 'Crafting Materials', gold: 1250, infStock: true },
2234: { name: 'Lump of Clay', image: 'static/common/items/Items/Ore/clay.png', category: 'Crafting Materials', gold: 150, infStock: true },
2235: { name: 'Bronze Bar', image: 'static/common/items/Items/Ore/bronze_bar.png', category: 'Crafting Materials', gold: 2000, infStock: false },
2236: { name: 'Impure Bronze Bar', image: 'static/common/items/Items/Ore/impure_bronze_bar.png', category: 'Crafting Materials', gold: 1150, infStock: false },
2237: { name: 'Iron Bar', image: 'static/common/items/Items/Ore/iron_bar.png', category: 'Crafting Materials', gold: 4000, infStock: false },
2238: { name: 'Steel Bar', image: 'static/common/items/Items/Ore/steel_bar.png', category: 'Crafting Materials', gold: 4500, infStock: false },
2239: { name: 'Gold Bar', image: 'static/common/items/Items/Ore/gold_bar.png', category: 'Crafting Materials', gold: 7000, infStock: false },
2240: { name: 'Mithril Bar', image: 'static/common/items/Items/Ore/mithril_bar.png', category: 'Crafting Materials', gold: 11000, infStock: false },
2241: { name: 'Adamantium Bar', image: 'static/common/items/Items/Ore/adamantium_bar.png', category: 'Crafting Materials', gold: 32000, infStock: false },
2242: { name: 'Quartz Bar', image: 'static/common/items/Items/Ore/quartz_bar.png', category: 'Crafting Materials', gold: 2500, infStock: false },
2243: { name: 'Jade Bar', image: 'static/common/items/Items/Ore/jade_bar.png', category: 'Crafting Materials', gold: 5000, infStock: false },
2244: { name: 'Amethyst Bar', image: 'static/common/items/Items/Ore/amethyst_bar.png', category: 'Crafting Materials', gold: 16000, infStock: false },
2261: { name: 'Impure Bronze Cuirass', image: 'static/common/items/Cover/Body Armor/Impure_Bronze_Cuirass.png', category: 'Equipment', gold: 2300, infStock: false, equipLife: 2592000 },
2262: { name: 'Bronze Cuirass', image: 'https://ptpimg.me/3mf3lw.png', category: 'Equipment', gold: 4000, infStock: false, equipLife: 2592000 },
2263: { name: 'Iron Cuirass', image: 'static/common/items/Cover/Body Armor/Iron_Cuirass.png', category: 'Equipment', gold: 16000, infStock: false, equipLife: 2592000 },
2264: { name: 'Steel Cuirass', image: 'static/common/items/Cover/Body Armor/Steel_Cuirass.png', category: 'Equipment', gold: 18000, infStock: false, equipLife: 2592000 },
2265: { name: 'Gold Cuirass', image: 'static/common/items/Cover/Body Armor/Gold_Cuirass.png', category: 'Equipment', gold: 28000, infStock: false, equipLife: 2592000 },
2266: { name: 'Mithril Cuirass', image: 'static/common/items/Cover/Body Armor/Mithril_Cuirass.png', category: 'Equipment', gold: 55000, infStock: false, equipLife: 2592000 },
2267: { name: 'Adamantium Cuirass', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass.png', category: 'Equipment', gold: 160000, infStock: false, equipLife: 2592000 },
2268: { name: 'Quartz Chainmail', image: 'static/common/items/Cover/Body Armor/Quartz_Chainmail.png', category: 'Equipment', gold: 5000, infStock: false, equipLife: 2592000 },
2269: { name: 'Jade Chainmail', image: 'static/common/items/Cover/Body Armor/Jade_Chainmail.png', category: 'Equipment', gold: 20000, infStock: false, equipLife: 2592000 },
2270: { name: 'Amethyst Chainmail', image: 'static/common/items/Cover/Body Armor/Amethyst_Chainmail.png', category: 'Equipment', gold: 80000, infStock: false, equipLife: 2592000 },
2295: { name: 'Pile of Snow', image: 'static/common/items/Items/Christmas/snow.png', category: 'Crafting Materials', gold: 700, infStock: true },
2296: { name: 'Snowball', image: 'static/common/items/Items/Christmas/snowball_small.png', category: 'Crafting Materials', gold: 1400, infStock: false },
2297: { name: 'Candy Cane', image: 'static/common/items/Items/Christmas/candycane.png', category: 'Crafting Materials', gold: 1000, infStock: true },
2298: { name: 'Hot Chocolate', image: 'static/common/items/Items/Christmas/hotchoc.png', category: 'Stat potions', gold: 5500, infStock: false },
2299: { name: 'Peppermint Hot Chocolate', image: 'static/common/items/Items/Christmas/peremint_hotchoc.png', category: 'Stat potions', gold: 6500, infStock: false },
2300: { name: 'Pile of Charcoal', image: 'static/common/items/Items/Christmas/charcoal.png', category: 'Crafting Materials', gold: 5000, infStock: true },
2303: { name: 'Hyper Realistic Eggnog', image: 'static/common/items/Items/Christmas/eggnog.png', category: 'Stat potions', gold: 5500, infStock: false },
2305: { name: 'Large Snowball', image: 'static/common/items/Items/Christmas/snowball.png', category: 'Crafting Materials', gold: 4200, infStock: false },
2306: { name: 'Carrot', image: 'static/common/items/Items/Christmas/carrot.png', category: 'Crafting Materials', gold: 3500, infStock: true },
2307: { name: 'Snowman', image: 'static/common/items/Items/Christmas/snowman.png', category: 'Stat potions', gold: 27500, infStock: false },
2316: { name: 'A Very Special Mario and Luigi Christmas', image: 'static/common/items/Background/bkg-mariotree.png', category: 'Avatar Backgrounds', gold: 500, infStock: true },
2321: { name: 'Gold Power Gloves', image: 'static/common/items/Cover/Gloves/Power_Gloves.png', category: 'Equipment', gold: 105000, infStock: true, equipLife: 2592000 },
2323: { name: 'Ruby', image: 'static/common/items/Items/Gems/ruby.png', category: 'Crafting Materials', gold: 25000, infStock: true },
2333: { name: 'Gazelle Pet', image: 'static/common/items/Cover/Pets/gazelle.png', category: 'Equipment', gold: 12000, infStock: false },
2353: { name: 'Gazelle Pet (No Buffs)', image: 'static/common/items/Cover/Pets/gazelle.png', category: 'Equipment', gold: 6000, infStock: true },
2357: { name: 'The Golden Daedy', image: 'static/common/items/Items/Card/Staff_The_Golden_Daedy.png', category: 'Trading Cards', gold: 3000, infStock: false },
2358: { name: 'A Wild Artifaxx', image: 'static/common/items/Items/Card/Staff_A_Wild_Artifaxx.png', category: 'Trading Cards', gold: 3000, infStock: false },
2359: { name: 'A Red Hot Flamed', image: 'static/common/items/Items/Card/Staff_A_Red_Hot_Flamed.png', category: 'Trading Cards', gold: 3000, infStock: false },
2361: { name: 'Alpaca Out of Nowhere!', image: 'static/common/items/Items/Card/Staff_Alpaca_Out_of_Nowhere.png', category: 'Trading Cards', gold: 3000, infStock: false },
2364: { name: "thewhale's Kiss", image: 'static/common/items/Items/Card/Staff_thewhales_Kiss.png', category: 'Trading Cards', gold: 3000, infStock: false },
2365: { name: "Stump's Banhammer", image: 'static/common/items/Items/Card/Staff_Stumps_Banhammer.png', category: 'Trading Cards', gold: 3000, infStock: false },
2366: { name: "Neo's Ratio Cheats", image: 'static/common/items/Items/Card/Staff_Neos_Ratio_Cheats.png', category: 'Trading Cards', gold: 3000, infStock: false },
2367: { name: "Niko's Transformation", image: 'static/common/items/Items/Card/Staff_Nikos_Transformation.png', category: 'Trading Cards', gold: 3000, infStock: false },
2368: { name: 'lepik le prick', image: 'static/common/items/Items/Card/Staff_lepik_le_prick.png', category: 'Trading Cards', gold: 3000, infStock: false },
2369: { name: 'The Golden Throne', image: 'static/common/items/Items/Card/Staff_The_Golden_Throne.png', category: 'Trading Cards', gold: 10000, infStock: false },
2370: { name: 'The Biggest Banhammer', image: 'static/common/items/Items/Card/Staff_The_Biggest_Banhammer.png', category: 'Trading Cards', gold: 10000, infStock: false },
2371: { name: 'The Staff Beauty Parlor', image: 'static/common/items/Items/Card/Staff_The_Staff_Beauty_Parlor.png', category: 'Trading Cards', gold: 10000, infStock: false },
2372: { name: 'The Realm of Staff', image: 'static/common/items/Items/Card/Staff_The_Realm_of_Staff.png', category: 'Trading Cards', gold: 35000, infStock: false },
2373: { name: 'Cake', image: 'static/common/items/Items/Card/Portal_Cake.png', category: 'Trading Cards', gold: 3000, infStock: false },
2374: { name: 'GLaDOS', image: 'static/common/items/Items/Card/Portal_GLaDOS.png', category: 'Trading Cards', gold: 3000, infStock: false },
2375: { name: 'Companion Cube', image: 'static/common/items/Items/Card/Portal_Companion_Cube.png', category: 'Trading Cards', gold: 3000, infStock: false },
2376: { name: 'Portal Gun', image: 'static/common/items/Items/Card/Portal_Portal_Gun.png', category: 'Trading Cards', gold: 10000, infStock: false },
2377: { name: 'A Scared Morty', image: 'static/common/items/Items/Card/Portal_A_Scared_Morty.png', category: 'Trading Cards', gold: 3000, infStock: false },
2378: { name: 'Rick Sanchez', image: 'static/common/items/Items/Card/Portal_Rick_Sanchez.png', category: 'Trading Cards', gold: 3000, infStock: false },
2379: { name: 'Mr. Poopy Butthole', image: 'static/common/items/Items/Card/Portal_Mr_Poopy_Butthole.png', category: 'Trading Cards', gold: 3000, infStock: false },
2380: { name: "Rick's Portal Gun", image: 'static/common/items/Items/Card/Portal_Ricks_Portal_Gun.png', category: 'Trading Cards', gold: 10000, infStock: false },
2381: { name: 'Nyx class Supercarrier', image: 'static/common/items/Items/Card/Portal_Nyx_class_Supercarrier.png', category: 'Trading Cards', gold: 3000, infStock: false },
2382: { name: 'Chimera Schematic', image: 'static/common/items/Items/Card/Portal_Chimera_Schematic.png', category: 'Trading Cards', gold: 3000, infStock: false },
2383: { name: 'Covetor Mining Ship', image: 'static/common/items/Items/Card/Portal_Covetor_Mining_Ship.png', category: 'Trading Cards', gold: 3000, infStock: false },
2384: { name: 'Space Wormhole', image: 'static/common/items/Items/Card/Portal_Space_Wormhole.png', category: 'Trading Cards', gold: 10000, infStock: false },
2385: { name: 'Interdimensional Portal', image: 'static/common/items/Items/Card/Portal_Interdimensional_Portal.png', category: 'Trading Cards', gold: 35000, infStock: false },
2388: { name: "MuffledSilence's Headphones", image: 'static/common/items/Items/Card/Staff_MuffledSilences_Headphones.png', category: 'Trading Cards', gold: 3000, infStock: false },
2390: { name: 'Mario', image: 'static/common/items/Items/Card/Mario_Mario.png', category: 'Trading Cards', gold: 3000, infStock: false },
2391: { name: 'Luigi', image: 'static/common/items/Items/Card/Mario_Luigi.png', category: 'Trading Cards', gold: 3000, infStock: false },
2392: { name: 'Princess Peach', image: 'static/common/items/Items/Card/Mario_Princess_Peach.png', category: 'Trading Cards', gold: 3000, infStock: false },
2393: { name: 'Toad', image: 'static/common/items/Items/Card/Mario_Toad.png', category: 'Trading Cards', gold: 3000, infStock: false },
2394: { name: 'Yoshi', image: 'static/common/items/Items/Card/Mario_Yoshi.png', category: 'Trading Cards', gold: 3000, infStock: false },
2395: { name: 'Bowser', image: 'static/common/items/Items/Card/Mario_Bowser.png', category: 'Trading Cards', gold: 3000, infStock: false },
2396: { name: 'Goomba', image: 'static/common/items/Items/Card/Mario_Goomba.png', category: 'Trading Cards', gold: 3000, infStock: false },
2397: { name: 'Koopa Troopa', image: 'static/common/items/Items/Card/Mario_Koopa_Troopa.png', category: 'Trading Cards', gold: 3000, infStock: false },
2398: { name: 'Wario', image: 'static/common/items/Items/Card/Mario_Wario.png', category: 'Trading Cards', gold: 3000, infStock: false },
2400: { name: 'LinkinsRepeater Bone Hard Card', image: 'static/common/items/Items/Card/Staff_LinkinsRepeater_Bone_Hard_Card.png', category: 'Trading Cards', gold: 3000, infStock: false },
2401: { name: 'Super Mushroom', image: 'static/common/items/Items/Card/Mario_Super_Mushroom.png', category: 'Trading Cards', gold: 10000, infStock: false },
2402: { name: 'Fire Flower', image: 'static/common/items/Items/Card/Mario_Fire_Flower.png', category: 'Trading Cards', gold: 10000, infStock: false },
2403: { name: 'Penguin Suit', image: 'static/common/items/Items/Card/Mario_Penguin_Suit.png', category: 'Trading Cards', gold: 10000, infStock: false },
2404: { name: 'Goal Pole', image: 'static/common/items/Items/Card/Mario_Goal_Pole.png', category: 'Trading Cards', gold: 35000, infStock: false },
2410: { name: 'Zé do Caixão Coffin Joe Card', image: 'static/common/items/Items/Card/Staff_Ze_do_Caixao_Coffin_Joe_Card.png', category: 'Trading Cards', gold: 3000, infStock: false },
2421: { name: "Din's Lootbox", image: 'static/common/items/Items/Pack/Dins_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
2433: { name: 'Small Luck Potion', image: 'static/common/items/Items/Potions/small_purple.png', category: 'Buffs', gold: 5000, infStock: false },
2434: { name: 'Large Luck Potion', image: 'static/common/items/Items/Potions/large_purple.png', category: 'Buffs', gold: 14000, infStock: false },
2436: { name: 'Glass Shards x2', image: 'static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 550, infStock: true },
2437: { name: 'Glass Shards x3', image: 'static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 825, infStock: true },
2438: { name: 'Random Lvl2 Staff Card', image: 'static/common/items/Items/Pack/Random_Lvl2_Staff_Card.png', category: 'Trading Cards', gold: 10000, infStock: false },
2465: { name: "Farore's Lootbox", image: 'static/common/items/Items/Pack/Farores_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
2466: { name: "Nayru's Lootbox", image: 'static/common/items/Items/Pack/Nayrus_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
2468: { name: 'Random Lootbox (Din, Farore, or Nayru)', image: 'static/common/items/Items/Pack/Random_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
2508: { name: 'Dwarven Gem', image: 'static/common/items/Items/Gems/dwarven_gem.png', category: 'Crafting Materials', gold: 100000, infStock: false },
2509: { name: 'Bronze Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_bronze.png', category: 'Equipment', gold: 35000, infStock: true },
2510: { name: 'Iron Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_iron.png', category: 'Equipment', gold: 70000, infStock: false },
2511: { name: 'Gold Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_gold.png', category: 'Equipment', gold: 122500, infStock: false },
2512: { name: 'Sand Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_sand.png', category: 'Equipment', gold: 10000, infStock: true },
2513: { name: 'Mithril Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_mithril.png', category: 'Equipment', gold: 192500, infStock: false },
2515: { name: 'Adamantium Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_adamantium.png', category: 'Equipment', gold: 560000, infStock: false },
2523: { name: 'Dove Pet', image: 'static/common/items/Cover/Pets/bird_white.png', category: 'Equipment', gold: 6000, infStock: true },
2524: { name: 'Green IRC Slime Pet', image: 'static/common/items/Cover/Pets/slime_green.png', category: 'Equipment', gold: 50000, infStock: true },
2525: { name: 'Blue IRC Slime Pet', image: 'static/common/items/Cover/Pets/slime_blue.png', category: 'Equipment', gold: 25000, infStock: true },
2537: { name: 'Carbon-Crystalline Quartz', image: 'static/common/items/Items/Gems/carbonquartz.png', category: 'Crafting Materials', gold: 3750, infStock: false },
2538: { name: 'Carbon-Crystalline Quartz Necklace', image: 'static/common/items/Cover/Jewelry/crystalline.png', category: 'Equipment', gold: 4000, infStock: false },
2539: { name: 'Silver Ring of Gazellia', image: 'static/common/items/Cover/Jewelry/silvering.png', category: 'Equipment', gold: 1000, infStock: true },
2540: { name: 'Quartz Loop of Luck', image: 'static/common/items/Cover/Jewelry/quartzringluck.png', category: 'Equipment', gold: 4100, infStock: false },
2541: { name: 'Jade Loop of Luck', image: 'static/common/items/Cover/Jewelry/jaderingluck.png', category: 'Equipment', gold: 17000, infStock: false },
2542: { name: 'Amethyst Loop of Luck', image: 'static/common/items/Cover/Jewelry/amethystringluck.png', category: 'Equipment', gold: 67000, infStock: false },
2543: { name: 'Quartz Loop of Aggression', image: 'static/common/items/Cover/Jewelry/quartzringaggression.png', category: 'Equipment', gold: 4500, infStock: false },
2544: { name: 'Jade Loop of Aggression', image: 'static/common/items/Cover/Jewelry/jaderingaggression.png', category: 'Equipment', gold: 21000, infStock: false },
2545: { name: 'Amethyst Loop of Aggression', image: 'static/common/items/Cover/Jewelry/amethystringaggression.png', category: 'Equipment', gold: 79000, infStock: false },
2546: { name: 'Quartz Loop of Fortune', image: 'static/common/items/Cover/Jewelry/quartzringfortune.png', category: 'Equipment', gold: 6000, infStock: false },
2547: { name: 'Jade Loop of Fortune', image: 'static/common/items/Cover/Jewelry/jaderingfortune.png', category: 'Equipment', gold: 36000, infStock: false },
2548: { name: 'Amethyst Loop of Fortune', image: 'static/common/items/Cover/Jewelry/amethystringfortune.png', category: 'Equipment', gold: 124000, infStock: false },
2549: { name: 'Sapphire', image: 'static/common/items/Items/Gems/sapphire.png', category: 'Crafting Materials', gold: 6000, infStock: true },
2550: { name: 'Ruby Chip', image: 'static/common/items/Items/Gems/chip_ruby.png', category: 'Crafting Materials', gold: 2500, infStock: true },
2551: { name: 'Emerald Chip', image: 'static/common/items/Items/Gems/chip_emerald.png', category: 'Crafting Materials', gold: 1000, infStock: true },
2552: { name: 'Sapphire Chip', image: 'static/common/items/Items/Gems/chip_sapphire.png', category: 'Crafting Materials', gold: 600, infStock: true },
2554: { name: 'Unity Flame Necklet', image: 'static/common/items/Cover/Jewelry/unityneck.png', category: 'Equipment', gold: 1000000, infStock: false },
2555: { name: 'Gods Pennant', image: 'static/common/items/Cover/Back/gods_pennant.png', category: 'Equipment', gold: 1000000, infStock: false },
2556: { name: 'Gods Cradle', image: 'static/common/items/Cover/Helmet/gods_cradle.png', category: 'Equipment', gold: 1000000, infStock: false },
2563: { name: 'Exquisite Constellation of Rubies', image: 'static/common/items/Items/Jewelry/constellation_ruby.png', category: 'Crafting Materials', gold: 120000, infStock: false },
2564: { name: 'Exquisite Constellation of Sapphires', image: 'static/common/items/Items/Jewelry/constellation_sapphire.png', category: 'Crafting Materials', gold: 44000, infStock: false },
2565: { name: 'Exquisite Constellation of Emeralds', image: 'static/common/items/Items/Jewelry/constellation_emerald.png', category: 'Crafting Materials', gold: 60000, infStock: false },
2566: { name: 'Quartz Prism of Aggression', image: 'static/common/items/Cover/Jewelry/quartzneckaggression.png', category: 'Equipment', gold: 13400, infStock: false },
2567: { name: 'Quartz Prism of Luck', image: 'static/common/items/Cover/Jewelry/quartzneckluck.png', category: 'Equipment', gold: 11000, infStock: false },
2568: { name: 'Quartz Prism of Fortune', image: 'static/common/items/Cover/Jewelry/quartzneckfortune.png', category: 'Equipment', gold: 22400, infStock: false },
2569: { name: 'Jade Trifocal of Aggression', image: 'static/common/items/Cover/Jewelry/jadeneckaggression.png', category: 'Equipment', gold: 40750, infStock: false },
2570: { name: 'Jade Trifocal of Luck', image: 'static/common/items/Cover/Jewelry/jadeneckluck.png', category: 'Equipment', gold: 32750, infStock: false },
2571: { name: 'Jade Trifocal of Fortune', image: 'static/common/items/Cover/Jewelry/jadeneckfortune.png', category: 'Equipment', gold: 70750, infStock: false },
2572: { name: 'Amethyst Totality of Aggression', image: 'static/common/items/Cover/Jewelry/amethystneckaggression.png', category: 'Equipment', gold: 150750, infStock: false },
2573: { name: 'Amethyst Totality of Luck', image: 'static/common/items/Cover/Jewelry/amethystneckluck.png', category: 'Equipment', gold: 126750, infStock: false },
2574: { name: 'Amethyst Totality of Fortune', image: 'static/common/items/Cover/Jewelry/amethystneckfortune.png', category: 'Equipment', gold: 240750, infStock: false },
2579: { name: 'Ruby-Flecked Wheat', image: 'static/common/items/Items/Food/wheat_ruby.png', category: 'Crafting Materials', gold: 1200, infStock: false },
2580: { name: 'Ruby-Grained Baguette', image: 'static/common/items/Items/Food/baguette_ruby.png', category: 'Buffs', gold: 2400, infStock: false },
2581: { name: 'Garlic Ruby-Baguette', image: 'static/common/items/Items/Food/garlic_ruby.png', category: 'Buffs', gold: 4500, infStock: false },
2582: { name: 'Artisan Ruby-Baguette', image: 'static/common/items/Items/Food/artisan_ruby.png', category: 'Buffs', gold: 9500, infStock: false },
2584: { name: 'Unity Flame Band', image: 'static/common/items/Cover/Jewelry/unityring.png', category: 'Equipment', gold: 850000, infStock: false },
2585: { name: 'Amethyst', image: 'static/common/items/Items/Gems/amethyst.png', category: 'Crafting Materials', gold: 30000, infStock: true },
2589: { name: 'Ripe Pumpkin', image: 'static/common/items/Items/Card/Halloween_Ripe_Pumpkin.png', category: 'Trading Cards', gold: 3000, infStock: false },
2590: { name: 'Rotting Pumpkin', image: 'static/common/items/Items/Card/Halloween_Rotting_Pumpkin.png', category: 'Trading Cards', gold: 3000, infStock: false },
2591: { name: 'Carved Pumpkin', image: 'static/common/items/Items/Card/Halloween_Carved_Pumpkin.png', category: 'Trading Cards', gold: 3000, infStock: false },
2592: { name: 'Stormrage Pumpkin', image: 'static/common/items/Items/Card/Halloween_Stormrage_Pumpkin.png', category: 'Trading Cards', gold: 10000, infStock: false },
2593: { name: 'Russian Pumpkin', image: 'static/common/items/Items/Card/Halloween_Russian_Pumpkin.png', category: 'Trading Cards', gold: 10000, infStock: false },
2594: { name: 'Green Mario Pumpkin', image: 'static/common/items/Items/Card/Halloween_Green_Mario_Pumpkin.png', category: 'Trading Cards', gold: 10000, infStock: false },
2595: { name: 'Lame Pumpkin Trio', image: 'static/common/items/Items/Card/Halloween_Lame_Pumpkin_Trio.png', category: 'Trading Cards', gold: 35000, infStock: false },
2598: { name: 'Ghost Billie', image: 'static/common/items/Cover/Pets/ghost_white.png', category: 'Equipment', gold: 12000, infStock: false },
2599: { name: 'Ghost Billy', image: 'static/common/items/Cover/Pets/ghost_yellow.png', category: 'Equipment', gold: 120000, infStock: false },
2600: { name: 'Pumpkin Badge Bits', image: 'static/common/items/Items/Halloween/pumpkin_bits.png', category: 'Stat potions', gold: 2250, infStock: false },
2601: { name: 'Halloween Pumpkin Badge', image: 'static/common/items/Items/Badges/Halloween_Pumpkin_Badge.png', category: 'User badges', gold: 13500, infStock: false },
2627: { name: 'Blacksmith Tongs', image: 'static/common/items/Items/Recast/blacksmith_tongs.png', category: 'Crafting Materials', gold: 50, infStock: true },
2639: { name: 'Dwarven Disco Ball', image: 'static/common/items/Cover/Clothing/disco_ball.png', category: 'Equipment', gold: 900000, infStock: false },
2641: { name: 'Impure Bronze Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Impure_Bronze_Claymore.png', category: 'Equipment', gold: 2300, infStock: false, equipLife: 2592000 },
2642: { name: 'Bronze Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Bronze_Claymore.png', category: 'Equipment', gold: 4000, infStock: false, equipLife: 2592000 },
2643: { name: 'Iron Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Iron_Claymore.png', category: 'Equipment', gold: 16000, infStock: false, equipLife: 2592000 },
2644: { name: 'Steel Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Steel_Claymore.png', category: 'Equipment', gold: 18000, infStock: false, equipLife: 2592000 },
2645: { name: 'Gold Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Gold_Claymore.png', category: 'Equipment', gold: 28000, infStock: false, equipLife: 2592000 },
2646: { name: 'Mithril Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Mithril_Claymore.png', category: 'Equipment', gold: 55000, infStock: false, equipLife: 2592000 },
2647: { name: 'Adamantium Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Adamantium_Claymore.png', category: 'Equipment', gold: 160000, infStock: false, equipLife: 2592000 },
2648: { name: 'Quartz Khopesh', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Quartz_Khopesh.png', category: 'Equipment', gold: 5000, infStock: false, equipLife: 2592000 },
2649: { name: 'Jade Khopesh', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Jade_Khopesh.png', category: 'Equipment', gold: 20000, infStock: false, equipLife: 2592000 },
2650: { name: 'Amethyst Khopesh', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Amethyst_Khopesh.png', category: 'Equipment', gold: 80000, infStock: false, equipLife: 2592000 },
2653: { name: 'Flux', image: 'static/common/items/Items/Recast/flux.png', category: 'Crafting Materials', gold: 50, infStock: true },
2656: { name: 'Impure Bronze Bar x2', image: 'static/common/items/Items/Ore/impure_bronze_bar.png', category: 'Crafting Materials', gold: 2500, infStock: false },
2657: { name: 'Iron Bar x2', image: 'static/common/items/Items/Ore/iron_bar.png', category: 'Crafting Materials', gold: 8000, infStock: false },
2658: { name: 'Steel Bar x2', image: 'static/common/items/Items/Ore/steel_bar.png', category: 'Crafting Materials', gold: 9000, infStock: false },
2659: { name: 'Gold Bar x2', image: 'static/common/items/Items/Ore/gold_bar.png', category: 'Crafting Materials', gold: 14000, infStock: false },
2661: { name: 'Mithril Bar x2', image: 'static/common/items/Items/Ore/mithril_bar.png', category: 'Crafting Materials', gold: 22000, infStock: false },
2662: { name: 'Adamantium Bar x2', image: 'static/common/items/Items/Ore/adamantium_bar.png', category: 'Crafting Materials', gold: 64000, infStock: false },
2664: { name: 'Jade Bar x2', image: 'static/common/items/Items/Ore/jade_bar.png', category: 'Crafting Materials', gold: 10000, infStock: false },
2665: { name: 'Amethyst Bar x2', image: 'static/common/items/Items/Ore/amethyst_bar.png', category: 'Crafting Materials', gold: 32000, infStock: false },
2666: { name: 'Bronze Alloy Mix x2', image: 'static/common/items/Items/Ore/bronze.png', category: 'Crafting Materials', gold: 2000, infStock: false },
2668: { name: 'Iron Ore x2', image: 'static/common/items/Items/Ore/iron.png', category: 'Crafting Materials', gold: 4000, infStock: false },
2670: { name: 'Gold Ore x2', image: 'static/common/items/Items/Ore/gold.png', category: 'Crafting Materials', gold: 7000, infStock: false },
2671: { name: 'Mithril Ore x2', image: 'static/common/items/Items/Ore/mithril.png', category: 'Crafting Materials', gold: 11000, infStock: false },
2672: { name: 'Adamantium Ore x2', image: 'static/common/items/Items/Ore/adamantium.png', category: 'Crafting Materials', gold: 32000, infStock: false },
2673: { name: 'Quartz Dust x2', image: 'static/common/items/Items/Ore/quartz.png', category: 'Crafting Materials', gold: 2000, infStock: false },
2675: { name: 'Jade Dust x2', image: 'static/common/items/Items/Ore/jade.png', category: 'Crafting Materials', gold: 4000, infStock: false },
2676: { name: 'Amethyst Dust x2', image: 'static/common/items/Items/Ore/amethyst.png', category: 'Crafting Materials', gold: 16000, infStock: false },
2688: { name: 'Christmas Spices', image: 'static/common/items/Items/Christmas/spices.png', category: 'Crafting Materials', gold: 2600, infStock: true },
2689: { name: 'Old Scarf & Hat', image: 'static/common/items/Items/Christmas/hatscarf.png', category: 'Crafting Materials', gold: 2500, infStock: true },
2690: { name: 'Umaro', image: 'static/common/items/Cover/Pets/umaro_white.png', category: 'Equipment', gold: 12000, infStock: false },
2691: { name: 'Golden Umaro', image: 'static/common/items/Cover/Pets/umaro_yellow.png', category: 'Equipment', gold: 120000, infStock: false },
2698: { name: 'Perfect Snowball', image: 'static/common/items/Items/Card/Christmas_Perfect_Snowball.png', category: 'Trading Cards', gold: 3000, infStock: false },
2699: { name: 'Mistletoe', image: 'static/common/items/Items/Card/Christmas_Mistletoe.png', category: 'Trading Cards', gold: 3000, infStock: false },
2700: { name: 'Santa Suit', image: 'static/common/items/Items/Card/Christmas_Santa_Suit.png', category: 'Trading Cards', gold: 3000, infStock: false },
2701: { name: 'Abominable Santa', image: 'static/common/items/Items/Card/Christmas_Abominable_Santa.png', category: 'Trading Cards', gold: 10000, infStock: false },
2702: { name: 'Icy Kisses', image: 'static/common/items/Items/Card/Christmas_Icy_Kisses.png', category: 'Trading Cards', gold: 10000, infStock: false },
2703: { name: 'Sexy Santa', image: 'static/common/items/Items/Card/Christmas_Sexy_Santa.png', category: 'Trading Cards', gold: 10000, infStock: false },
2704: { name: 'Christmas Cheer', image: 'static/common/items/Items/Card/Christmas_Christmas_Cheer.png', category: 'Trading Cards', gold: 35000, infStock: false },
2708: { name: 'Icy Badge Bits', image: 'static/common/items/Items/Birthday/icy_bits.png', category: 'Stat potions', gold: 2250, infStock: false },
2709: { name: 'Christmas Icy Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/icy-badge.png', category: 'User badges', gold: 13500, infStock: false },
2711: { name: 'Jazz Pants', image: 'static/common/items/Cover/Leg Armor/Jazz_Pants.png', category: 'Equipment', gold: 11000, infStock: true },
2712: { name: 'Jazzier Pants', image: 'static/common/items/Cover/Leg Armor/Jazzier_Pants.png', category: 'Equipment', gold: 22000, infStock: false },
2713: { name: 'Disco Pants', image: 'static/common/items/Cover/Leg Armor/Disco_Pants.png', category: 'Equipment', gold: 800000, infStock: false },
2714: { name: "Devil's Pantaloons", image: 'static/common/items/Cover/Leg Armor/Devils_Pants.png', category: 'Equipment', gold: 1600000, infStock: false },
2717: { name: 'Emerald-Flecked Wheat', image: 'static/common/items/Items/Food/wheat_emerald.png', category: 'Crafting Materials', gold: 600, infStock: false },
2718: { name: 'Emerald-Grained Baguette', image: 'static/common/items/Items/Food/bagette_emerald.png', category: 'Buffs', gold: 1200, infStock: false },
2719: { name: 'Garlic Emerald-Baguette', image: 'static/common/items/Items/Food/garlic_emerald.png', category: 'Buffs', gold: 2500, infStock: false },
2720: { name: 'Artisan Emerald-Baguette', image: 'static/common/items/Items/Food/artisan_emerald.png', category: 'Buffs', gold: 6000, infStock: false },
2721: { name: 'Gazellian Emerald-Baguette', image: 'static/common/items/Items/Food/gazellian_emerald.png', category: 'Buffs', gold: 8000, infStock: false },
2729: { name: 'Empowered Quartz Loop of Luck', image: 'static/common/items/Cover/Jewelry/empoweredquartzringluck.png', category: 'Equipment', gold: 6600, infStock: false, equipLife: 7776000 },
2730: { name: 'Empowered Jade Loop of Luck', image: 'static/common/items/Cover/Jewelry/empoweredjaderingluck.png', category: 'Equipment', gold: 27000, infStock: false, equipLife: 7776000 },
2731: { name: 'Empowered Amethyst Loop of Luck', image: 'static/common/items/Cover/Jewelry/empoweredamethystringluck.png', category: 'Equipment', gold: 115000, infStock: false, equipLife: 7776000 },
2732: { name: 'Empowered Quartz Loop of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredquartzringaggression.png', category: 'Equipment', gold: 7000, infStock: false, equipLife: 7776000 },
2733: { name: 'Empowered Jade Loop of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredjaderingaggression.png', category: 'Equipment', gold: 31000, infStock: false, equipLife: 7776000 },
2734: { name: 'Empowered Amethyst Loop of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredamethystringaggression.png', category: 'Equipment', gold: 127000, infStock: false, equipLife: 7776000 },
2735: { name: 'Empowered Quartz Loop of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredquartzringfortune.png', category: 'Equipment', gold: 8500, infStock: false, equipLife: 7776000 },
2736: { name: 'Empowered Jade Loop of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredjaderingfortune.png', category: 'Equipment', gold: 46000, infStock: false, equipLife: 7776000 },
2737: { name: 'Empowered Amethyst Loop of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredamethystringfortune.png', category: 'Equipment', gold: 172000, infStock: false, equipLife: 7776000 },
2738: { name: 'Empowered Quartz Prism of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredquartzneckaggression.png', category: 'Equipment', gold: 18400, infStock: false, equipLife: 7776000 },
2739: { name: 'Empowered Quartz Prism of Luck', image: 'static/common/items/Cover/Jewelry/empoweredquartzneckluck.png', category: 'Equipment', gold: 16000, infStock: false, equipLife: 7776000 },
2740: { name: 'Empowered Quartz Prism of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredquartzneckfortune.png', category: 'Equipment', gold: 27400, infStock: false, equipLife: 7776000 },
2741: { name: 'Empowered Jade Trifocal of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredjadeneckaggression.png', category: 'Equipment', gold: 55750, infStock: false, equipLife: 7776000 },
2742: { name: 'Empowered Jade Trifocal of Luck', image: 'static/common/items/Cover/Jewelry/empoweredjadeneckluck.png', category: 'Equipment', gold: 47750, infStock: false, equipLife: 7776000 },
2743: { name: 'Empowered Jade Trifocal of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredjadeneckfortune.png', category: 'Equipment', gold: 85750, infStock: false, equipLife: 7776000 },
2744: { name: 'Empowered Amethyst Totality of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredamethystneckaggression.png', category: 'Equipment', gold: 230750, infStock: false, equipLife: 7776000 },
2745: { name: 'Empowered Amethyst Totality of Luck', image: 'static/common/items/Cover/Jewelry/empoweredamethystneckluck.png', category: 'Equipment', gold: 206750, infStock: false, equipLife: 7776000 },
2746: { name: 'Empowered Amethyst Totality of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredamethystneckfortune.png', category: 'Equipment', gold: 320750, infStock: false, equipLife: 7776000 },
2760: { name: 'Dwarven Disco Plate', image: 'static/common/items/Cover/Body Armor/Disco_Plate.png', category: 'Equipment', gold: 800000, infStock: false },
2761: { name: 'Impure Bronze Segmentata', image: 'static/common/items/Cover/Body Armor/Impure_Bronze_Segmentata.png', category: 'Equipment', gold: 1150, infStock: false },
2762: { name: 'Bronze Segmentata', image: 'static/common/items/Cover/Body Armor/Bronze_Segmentata.png', category: 'Equipment', gold: 2000, infStock: false },
2763: { name: 'Iron Segmentata', image: 'static/common/items/Cover/Body Armor/Iron_Segmentata.png', category: 'Equipment', gold: 8000, infStock: false },
2764: { name: 'Steel Segmentata', image: 'static/common/items/Cover/Body Armor/Steel_Segmentata.png', category: 'Equipment', gold: 9000, infStock: false },
2765: { name: 'Gold Segmentata', image: 'static/common/items/Cover/Body Armor/Gold_Segmentata.png', category: 'Equipment', gold: 14000, infStock: false },
2766: { name: 'Mithril Segmentata', image: 'static/common/items/Cover/Body Armor/Mithril_Segmentata.png', category: 'Equipment', gold: 22000, infStock: false },
2767: { name: 'Adamantium Segmentata', image: 'static/common/items/Cover/Body Armor/Adamantium_Segmentata.png', category: 'Equipment', gold: 64000, infStock: false },
2772: { name: 'Regenerate', image: 'static/common/items/Items/AdventureClub/attack_meditation.png', category: 'Attacks', gold: 200, infStock: false },
2774: { name: 'Hypnosis', image: 'static/common/items/Items/AdventureClub/attack_hypnosis.png', category: 'Attacks', gold: 250, infStock: false },
2775: { name: 'Muddle', image: 'static/common/items/Items/AdventureClub/attack_muddle.png', category: 'Attacks', gold: 250, infStock: false },
2776: { name: 'Parasite', image: 'static/common/items/Items/AdventureClub/attack_parasite.png', category: 'Attacks', gold: 800, infStock: false },
2801: { name: '3 Backpack Slots', image: 'static/common/items/Items/AdventureClub/backpack_3.png', category: 'Backpack (IRC)', gold: 300, infStock: false },
2802: { name: '4 Backpack Slots', image: 'static/common/items/Items/AdventureClub/backpack_4.png', category: 'Backpack (IRC)', gold: 400, infStock: false },
2803: { name: '6 Backpack Slots', image: 'static/common/items/Items/AdventureClub/backpack_6.png', category: 'Backpack (IRC)', gold: 600, infStock: false },
2813: { name: 'Scrap', image: 'static/common/items/Items/AdventureClub/craft_scrap.png', category: 'Items', gold: 500, infStock: false },
2814: { name: 'Cloth', image: 'static/common/items/Items/AdventureClub/craft_cloth.png', category: 'Items', gold: 500, infStock: false },
2816: { name: 'Hide', image: 'static/common/items/Items/AdventureClub/craft_hide.png', category: 'Items', gold: 500, infStock: false },
2822: { name: "Can't Believe This Is Cherry", image: 'static/common/items/Items/Birthday/chakefhake.png', category: 'Buffs', gold: 8000, infStock: false },
2825: { name: '9th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/9th_Birthday_Badge.png', category: 'User badges', gold: 13500, infStock: false },
2826: { name: 'Lick Badge Bits', image: 'static/common/items/Items/Birthday/licks_bits.png', category: 'Stat potions', gold: 2250, infStock: false },
2827: { name: '[Au]zelle Pet', image: 'static/common/items/Cover/Pets/gazelle_yellow.png', category: 'Equipment', gold: 120000, infStock: false },
2829: { name: 'Ripped Gazelle', image: 'static/common/items/Items/Card/Birthday_Ripped_Gazelle.png', category: 'Trading Cards', gold: 3000, infStock: false },
2830: { name: 'Fancy Gazelle', image: 'static/common/items/Items/Card/Birthday_Fancy_Gazelle.png', category: 'Trading Cards', gold: 3000, infStock: false },
2831: { name: 'Gamer Gazelle', image: 'static/common/items/Items/Card/Birthday_Gamer_Gazelle.png', category: 'Trading Cards', gold: 3000, infStock: false },
2833: { name: 'Future Gazelle', image: 'static/common/items/Items/Card/Birthday_Future_Gazelle.png', category: 'Trading Cards', gold: 10000, infStock: false },
2834: { name: 'Alien Gazelle', image: 'static/common/items/Items/Card/Birthday_Alien_Gazelle.png', category: 'Trading Cards', gold: 10000, infStock: false },
2835: { name: 'Lucky Gazelle', image: 'static/common/items/Items/Card/Birthday_Lucky_Gazelle.png', category: 'Trading Cards', gold: 10000, infStock: false },
2836: { name: 'Supreme Gazelle', image: 'static/common/items/Items/Card/Birthday_Supreme_Gazelle.png', category: 'Trading Cards', gold: 35000, infStock: false },
2841: { name: 'Condensed Light', image: 'static/common/items/Items/AdventureClub/craft_light.png', category: 'Items', gold: 500, infStock: false },
2842: { name: 'Bottled Ghost', image: 'static/common/items/Items/AdventureClub/craft_bottle_ghost.png.png', category: 'Items', gold: 500, infStock: false },
2844: { name: 'Glowing Leaves', image: 'static/common/items/Items/AdventureClub/craft_glowing_leaves.png.png', category: 'Items', gold: 50, infStock: false },
2845: { name: 'Dark Orb', image: 'static/common/items/Items/AdventureClub/attack_darkorb.png', category: 'Attacks', gold: 5000, infStock: false },
2846: { name: 'Burst of Light', image: 'static/common/items/Items/AdventureClub/attack_burstlight.png', category: 'Attacks', gold: 5000, infStock: false },
2847: { name: 'Scrappy Gauntlets', image: 'static/common/items/Cover/AdventureClub/scrappy_gauntlets.png', category: 'Items', gold: 2500, infStock: false },
2849: { name: 'Quartz Lamellar', image: 'static/common/items/Cover/Body Armor/Quartz_Lamellar.png', category: 'Equipment', gold: 2500, infStock: false },
2850: { name: 'Jade Lamellar', image: 'static/common/items/Cover/Body Armor/Jade_Lamellar.png', category: 'Equipment', gold: 10000, infStock: false },
2851: { name: 'Amethyst Lamellar', image: 'static/common/items/Cover/Body Armor/Amethyst_Lamellar.png', category: 'Equipment', gold: 32000, infStock: false },
2852: { name: 'Impure Bronze Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Impure_Bronze_Billhook.png', category: 'Equipment', gold: 1150, infStock: false },
2853: { name: 'Bronze Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Bronze_Billhook.png', category: 'Equipment', gold: 2000, infStock: false },
2854: { name: 'Iron Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Iron_Billhook.png', category: 'Equipment', gold: 8000, infStock: false },
2855: { name: 'Steel Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Steel_Billhook.png', category: 'Equipment', gold: 9000, infStock: false },
2856: { name: 'Gold Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Gold_Billhook.png', category: 'Equipment', gold: 14000, infStock: false },
2857: { name: 'Mithril Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Mithril_Billhook.png', category: 'Equipment', gold: 22000, infStock: false },
2858: { name: 'Adamantium Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Adamantium_Billhook.png', category: 'Equipment', gold: 64000, infStock: false },
2859: { name: 'Quartz Guandao', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Quartz_Guandao.png', category: 'Equipment', gold: 2500, infStock: false },
2860: { name: 'Jade Guandao', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Jade_Guandao.png', category: 'Equipment', gold: 10000, infStock: false },
2861: { name: 'Amethyst Guandao', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Amethyst_Guandao.png', category: 'Equipment', gold: 32000, infStock: false },
2862: { name: 'Impure Bronze Armguards', image: 'static/common/items/Cover/Arm Armor/Impure_Bronze_Armguards.png', category: 'Equipment', gold: 1250, infStock: false },
2863: { name: 'Bronze Armguards', image: 'static/common/items/Cover/Arm Armor/Bronze_Armguards.png', category: 'Equipment', gold: 3250, infStock: false },
2864: { name: 'Iron Armguards', image: 'static/common/items/Cover/Arm Armor/Iron_Armguards.png', category: 'Equipment', gold: 7250, infStock: false },
2865: { name: 'Steel Armguards', image: 'static/common/items/Cover/Arm Armor/Steel_Armguards.png', category: 'Equipment', gold: 11750, infStock: false },
2866: { name: 'Gold Armguards', image: 'static/common/items/Cover/Arm Armor/Gold_Armguards.png', category: 'Equipment', gold: 18750, infStock: false },
2867: { name: 'Mithril Armguards', image: 'static/common/items/Cover/Arm Armor/Mithril_Armguards.png', category: 'Equipment', gold: 29750, infStock: false, equipLife: 7776000 },
2868: { name: 'Adamantium Armguards', image: 'static/common/items/Cover/Arm Armor/Adamantium_Armguards.png', category: 'Equipment', gold: 61750, infStock: false, equipLife: 7776000 },
2892: { name: 'Glowing Ash', image: 'https://ptpimg.me/3i2xd1.png', category: 'Items', gold: 50, infStock: false },
2893: { name: 'Troll Tooth', image: 'https://ptpimg.me/mrr24x.png', category: 'Items', gold: 50, infStock: false },
2894: { name: 'Advanced Hide', image: 'https://ptpimg.me/1d6926.png', category: 'Items', gold: 50, infStock: false },
2900: { name: 'Burning Ash Cloud', image: 'https://ptpimg.me/n7900m.png', category: 'Attacks', gold: 7500, infStock: false },
2901: { name: 'Troll Tooth Necklace', image: 'https://ptpimg.me/480516.png', category: 'Items', gold: 3500, infStock: false },
2902: { name: 'Mithril Power Gloves', image: 'https://ptpimg.me/xiq9n9.png', category: 'Equipment', gold: 190000, infStock: false, equipLife: 2592000 },
2903: { name: 'Adamantium Power Gloves', image: 'https://ptpimg.me/850f5v.png', category: 'Equipment', gold: 305000, infStock: false, equipLife: 2592000 },
2905: { name: 'Steel Power Gloves', image: 'https://ptpimg.me/oqwww2.png', category: 'Equipment', gold: 37000, infStock: false },
2906: { name: 'Iron Power Gloves', image: 'https://ptpimg.me/999ex6.png', category: 'Equipment', gold: 22500, infStock: false },
2907: { name: 'Bronze Power Gloves', image: 'https://ptpimg.me/v98n53.png', category: 'Equipment', gold: 11000, infStock: false },
2908: { name: 'Impure Bronze Power Gloves', image: 'https://ptpimg.me/9d1e15.png', category: 'Equipment', gold: 4000, infStock: false },
2915: { name: 'Flame Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Flame_Badge.png', category: 'User badges', gold: 1000000, infStock: false },
2927: { name: 'Amethyst Dust Dwarf Companion', image: 'https://ptpimg.me/8n1o75.png', category: 'Equipment', gold: 280000, infStock: false },
2928: { name: 'Jade Dust Dwarf Companion', image: 'https://ptpimg.me/803l8j.png', category: 'Equipment', gold: 87500, infStock: false },
2929: { name: 'Quartz Dust Dwarf Companion', image: 'https://ptpimg.me/6zl54e.png', category: 'Equipment', gold: 43750, infStock: true },
2930: { name: "Nayru's Username", image: 'static/common/items/Items/Username/Nayru.png', category: 'Username customizations', gold: 270000, infStock: false },
2931: { name: "Farore's Username", image: 'static/common/items/Items/Username/Farore.png', category: 'Username customizations', gold: 270000, infStock: false },
2932: { name: "Din's Username", image: 'static/common/items/Items/Username/Din.png', category: 'Username customizations', gold: 270000, infStock: false },
2945: { name: 'Bloody Mario', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Bloody_Mario.png', category: 'Trading Cards', gold: 3000, infStock: false },
2946: { name: "Mommy's Recipe", image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Mommys_Recipe.png', category: 'Trading Cards', gold: 3000, infStock: false },
2947: { name: 'Memory Boost', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Memory_Boost.png', category: 'Trading Cards', gold: 6660, infStock: false },
2948: { name: 'Link was here!', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Link_was_here.png', category: 'Trading Cards', gold: 3000, infStock: false },
2949: { name: 'Gohma Sees You', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Gohma_sees_you.png', category: 'Trading Cards', gold: 3000, infStock: false },
2950: { name: 'Skultilla the Cake Guard', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Skultilla_the_cake_guard.png', category: 'Trading Cards', gold: 6660, infStock: false },
2951: { name: 'Who eats whom?', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Who_eats_whom.png', category: 'Trading Cards', gold: 15000, infStock: false },
2952: { name: 'Cupcake Crumbles', image: 'https://ptpimg.me/ckw9ad.png', category: 'Crafting Materials', gold: 2250, infStock: false },
2953: { name: 'Halloween Cupcake Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Halloween_Cupcake_Badge.png', category: 'User badges', gold: 13500, infStock: false },
2969: { name: 'Gingerbread Kitana', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Kitana.png', category: 'Trading Cards', gold: 3000, infStock: false },
2970: { name: 'Gingerbread Marston', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Marston.png', category: 'Trading Cards', gold: 3000, infStock: false },
2972: { name: 'Gingerbread Doomslayer', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Doomslayer.png', category: 'Trading Cards', gold: 6500, infStock: false },
2973: { name: 'Millenium Falcon Gingerbread', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Millenium_Falcon.png', category: 'Trading Cards', gold: 3000, infStock: false },
2974: { name: 'Gingerbread AT Walker', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_AT_Walker.png', category: 'Trading Cards', gold: 3000, infStock: false },
2975: { name: 'Mario Christmas', image: 'static/common/items/Items/Card/9th_Christmas_Mario_Christmas.png', category: 'Trading Cards', gold: 6500, infStock: false },
2976: { name: 'Baby Yoda with Gingerbread', image: 'static/common/items/Items/Card/9th_Christmas_Baby_Yoda.png', category: 'Trading Cards', gold: 14000, infStock: false },
2986: { name: 'Sonic and Amy', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Sonic_and_Amy.png', category: 'Trading Cards', gold: 2000, infStock: false },
2987: { name: 'Yoshi and Birdo', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Yoshi_and_Birdo.png', category: 'Trading Cards', gold: 2000, infStock: false },
2988: { name: 'Kirlia and Meloetta', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Kirlia_and_Meloetta.png', category: 'Trading Cards', gold: 4500, infStock: false },
2989: { name: 'Aerith and Cloud', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Aerith_and_Cloud.png', category: 'Trading Cards', gold: 2000, infStock: false },
2990: { name: 'Master Chief and Cortana', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Chief_and_Cortana.png', category: 'Trading Cards', gold: 2000, infStock: false },
2991: { name: 'Dom and Maria', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Dom_and_Maria.png', category: 'Trading Cards', gold: 4500, infStock: false },
2992: { name: 'Mr. and Mrs. Pac Man', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Mr_and_Mrs_Pac_Man.png', category: 'Trading Cards', gold: 10000, infStock: false },
2993: { name: 'Chainsaw Chess', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Chainsaw_Chess.png', category: 'Trading Cards', gold: 2000, infStock: false },
2994: { name: 'Chainsaw Wizard', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Chainsaw_Wizard.png', category: 'Trading Cards', gold: 2000, infStock: false },
2995: { name: 'Angelise Reiter', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Angelise_Reiter.png', category: 'Trading Cards', gold: 4500, infStock: false },
2996: { name: 'Ivy Valentine', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Ivy_Valentine.png', category: 'Trading Cards', gold: 2000, infStock: false },
2997: { name: 'Jill Valentine', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Jill_Valentine.png', category: 'Trading Cards', gold: 2000, infStock: false },
2998: { name: 'Sophitia', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Sophitia.png', category: 'Trading Cards', gold: 4500, infStock: false },
2999: { name: 'Yennefer', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Yennefer.png', category: 'Trading Cards', gold: 10000, infStock: false },
3000: { name: 'Valentine Sugar Heart', image: 'https://ptpimg.me/82osc2.png', category: 'Stat potions', gold: 500, infStock: false },
3001: { name: 'Valentine Chocolate Heart', image: 'https://ptpimg.me/gg9293.png', category: 'Stat potions', gold: 500, infStock: false },
3002: { name: 'Valentine Rose', image: 'https://ptpimg.me/o6mt84.png', category: 'Buffs', gold: 5000, infStock: false },
3004: { name: 'Special Box', image: 'static/common/items/Items/Valentine2022/special_box.png', category: 'Special Items', gold: 300000, infStock: false },
3023: { name: 'Exodus Truce', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Exodus_Truce.png', category: 'Trading Cards', gold: 3000, infStock: false },
3024: { name: 'Gazelle Breaking Bad', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Gazelle_Breaking_Bad.png', category: 'Trading Cards', gold: 3000, infStock: false },
3025: { name: 'A Fair Fight', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_A_Fair_Fight.png', category: 'Trading Cards', gold: 6500, infStock: false },
3026: { name: 'Home Sweet Home', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Home_Sweet_Home.png', category: 'Trading Cards', gold: 3000, infStock: false },
3027: { name: 'Birthday Battle Kart', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Birthday_Battle_Kart.png', category: 'Trading Cards', gold: 3000, infStock: false },
3028: { name: 'What an Adventure', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_What_an_Adventure.png', category: 'Trading Cards', gold: 6500, infStock: false },
3029: { name: 'After Party', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_After_Party.png', category: 'Trading Cards', gold: 15000, infStock: false },
3031: { name: 'Birthday Leaves (10th)', image: 'https://ptpimg.me/744jj8.png', category: 'Stat potions', gold: 2250, infStock: false },
3032: { name: '10th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/10th_Birthday_Badge.png', category: 'User badges', gold: 13500, infStock: false },
3105: { name: 'Cyberpunk 2077', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Cyberpunk_2077.png', category: 'Trading Cards', gold: 3000, infStock: false },
3106: { name: 'Watch Dogs Legion', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Watch_Dogs_Legion.png', category: 'Trading Cards', gold: 3000, infStock: false },
3107: { name: 'Dirt 5', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Dirt_5.png', category: 'Trading Cards', gold: 6000, infStock: false },
3108: { name: 'Genshin Impact', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Genshin_Impact.png', category: 'Trading Cards', gold: 3000, infStock: false },
3109: { name: 'Animal Crossing', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Animal_Crossing.png', category: 'Trading Cards', gold: 3000, infStock: false },
3110: { name: 'Gazelle', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Gazelle.png', category: 'Trading Cards', gold: 6000, infStock: false },
3111: { name: 'Mafia', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Mafia.png', category: 'Trading Cards', gold: 15000, infStock: false },
3112: { name: 'Christmas Bauble Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Bauble_Badge.png', category: 'User badges', gold: 8000, infStock: false },
3113: { name: 'Red Crewmate Bauble', image: 'https://ptpimg.me/43o3rh.png', category: 'Crafting Materials', gold: 5000, infStock: false },
3114: { name: 'Green Crewmate Bauble', image: 'https://ptpimg.me/sm003l.png', category: 'Crafting Materials', gold: 5001, infStock: false },
3115: { name: 'Cyan Crewmate Bauble', image: 'https://ptpimg.me/r85pwu.png', category: 'Crafting Materials', gold: 5000, infStock: false },
3117: { name: 'Christmas Impostor Bauble?', image: 'https://ptpimg.me/455r6g.png', category: 'Special Items', gold: 10000, infStock: false },
3118: { name: 'Christmas Impostor Bauble Badge', image: 'https://ptpimg.me/q3os85.png', category: 'User badges', gold: 10000, infStock: false },
3119: { name: 'Broken Bauble Fragment', image: 'https://ptpimg.me/w3544e.png', category: 'Crafting Materials', gold: 2250, infStock: false },
3120: { name: 'Wilted Four-Leaves Holly', image: 'https://ptpimg.me/nsth09.png', category: 'Crafting Materials', gold: 2250, infStock: false },
3121: { name: 'Lucky Four-Leaves Holly', image: 'https://ptpimg.me/136074.png', category: 'Buffs', gold: 8000, infStock: false },
3136: { name: "Cupid's Winged Boots", image: 'https://ptpimg.me/vlk630.png', category: 'Equipment', gold: 160000, infStock: false },
3143: { name: 'Symbol of Love', image: 'https://ptpimg.me/cf9vfc.png', category: 'Crafting Materials', gold: 100000, infStock: false },
3144: { name: 'Old Worn Boots', image: 'https://ptpimg.me/66unrh.png', category: 'Crafting Materials', gold: 10000, infStock: true },
3145: { name: "Cupid's Magical Feather", image: 'https://ptpimg.me/004ho6.png', category: 'Crafting Materials', gold: 21500, infStock: false },
3146: { name: "Cupid's Winged Boots of Luck", image: 'https://ptpimg.me/1bx3k2.png', category: 'Equipment', gold: 200000, infStock: false, equipLife: 5184000 },
3147: { name: "Cupid's Winged Boots of Aggression", image: 'https://ptpimg.me/3983q6.png', category: 'Equipment', gold: 200000, infStock: false, equipLife: 5184000 },
3148: { name: "Cupid's Winged Boots of Fortune", image: 'https://ptpimg.me/mopf18.png', category: 'Equipment', gold: 200000, infStock: false, equipLife: 5184000 },
3151: { name: 'Bill Rizer', image: 'static/common/items/Items/Card/11th_Birthday_Bill_Rizer.png', category: 'Trading Cards', gold: 3000, infStock: false },
3152: { name: 'Donkey Kong', image: 'static/common/items/Items/Card/11th_Birthday_Donkey_Kong.png', category: 'Trading Cards', gold: 3000, infStock: false },
3153: { name: 'Duck Hunt Dog', image: 'static/common/items/Items/Card/11th_Birthday_Duck_Hunt_Dog.png', category: 'Trading Cards', gold: 3000, infStock: false },
3154: { name: 'Dr. Mario', image: 'static/common/items/Items/Card/11th_Birthday_Dr_Mario.png', category: 'Trading Cards', gold: 10000, infStock: false },
3155: { name: 'Pit', image: 'static/common/items/Items/Card/11th_Birthday_Pit.png', category: 'Trading Cards', gold: 3000, infStock: false },
3156: { name: 'Little Mac', image: 'static/common/items/Items/Card/11th_Birthday_Little_Mac.png', category: 'Trading Cards', gold: 3000, infStock: false },
3157: { name: 'Mega Man', image: 'static/common/items/Items/Card/11th_Birthday_Mega_Man.png', category: 'Trading Cards', gold: 3000, infStock: false },
3158: { name: 'Link', image: 'static/common/items/Items/Card/11th_Birthday_Link.png', category: 'Trading Cards', gold: 10000, infStock: false },
3159: { name: 'Pac-Man', image: 'static/common/items/Items/Card/11th_Birthday_Pac_Man.png', category: 'Trading Cards', gold: 3000, infStock: false },
3160: { name: 'Samus Aran', image: 'static/common/items/Items/Card/11th_Birthday_Samus_Aran.png', category: 'Trading Cards', gold: 3000, infStock: false },
3161: { name: 'Simon Belmont', image: 'static/common/items/Items/Card/11th_Birthday_Simon_Belmont.png', category: 'Trading Cards', gold: 3000, infStock: false },
3162: { name: 'Kirby', image: 'static/common/items/Items/Card/11th_Birthday_Kirby.png', category: 'Trading Cards', gold: 10000, infStock: false },
3163: { name: 'Black Mage', image: 'static/common/items/Items/Card/11th_Birthday_Black_Mage.png', category: 'Trading Cards', gold: 35000, infStock: false },
3165: { name: '11th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/11th_Birthday_Badge.png', category: 'User badges', gold: 13500, infStock: false },
3166: { name: 'Party Pipe Badge Bit', image: 'https://ptpimg.me/r6vdr3.png', category: 'Crafting Materials', gold: 2250, infStock: false },
3215: { name: 'Farmer Dwarf Companion', image: 'https://ptpimg.me/igklmw.png', category: 'Equipment', gold: 25000, infStock: true },
3216: { name: 'Garlic Dwarf Companion', image: 'https://ptpimg.me/j8bub9.png', category: 'Equipment', gold: 25000, infStock: true },
3218: { name: 'Milk', image: 'https://ptpimg.me/raa068.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3219: { name: 'Cherries', image: 'https://ptpimg.me/x02af9.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3220: { name: 'Grapes', image: 'https://ptpimg.me/351721.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3221: { name: 'Coconuts', image: 'https://ptpimg.me/9c121y.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3222: { name: 'Marshmallows', image: 'https://ptpimg.me/6tl43k.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3223: { name: 'Cocoa beans', image: 'https://ptpimg.me/8h05tu.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3224: { name: 'Vanilla Pods', image: 'https://ptpimg.me/7c4us8.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3225: { name: 'Strawberries', image: 'https://ptpimg.me/gp622c.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3226: { name: '"Grape" Milkshake', image: 'static/common/items/Items/Birthday/grapeshake.png', category: 'Buffs', gold: 0, infStock: false },
3227: { name: ' Coco-Cooler Milkshake', image: 'static/common/items/Items/Birthday/coconutshake.png', category: 'Buffs', gold: 8000, infStock: false },
3228: { name: 'Cinnamon Milkshake', image: 'https://ptpimg.me/kl097r.png', category: 'Buffs', gold: 8000, infStock: false },
3229: { name: 'Rocky Road Milkshake', image: 'https://ptpimg.me/q8634k.png', category: 'Buffs', gold: 11000, infStock: false },
3230: { name: 'Neapolitan Milkshake', image: 'https://ptpimg.me/fr7433.png', category: 'Buffs', gold: 14000, infStock: false },
3237: { name: 'Rainbow IRC Slime Pet', image: 'https://ptpimg.me/kh1c5k.png', category: 'Equipment', gold: 100000, infStock: true },
3241: { name: 'Cinnamon', image: 'https://ptpimg.me/tol70u.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3263: { name: 'Blinky', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Blinky.png', category: 'Trading Cards', gold: 3000, infStock: false },
3264: { name: 'Halloween Tombstone Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Halloween2021_Thombstone_Badge.png', category: 'User badges', gold: 15000, infStock: false },
3265: { name: 'Clyde', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Clyde.png', category: 'Trading Cards', gold: 3000, infStock: false },
3266: { name: 'Pinky', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Pinky.png', category: 'Trading Cards', gold: 3000, infStock: false },
3267: { name: 'Inky', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Inky.png', category: 'Trading Cards', gold: 3000, infStock: false },
3268: { name: 'Ghostbusters', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Ghostbusters.png', category: 'Trading Cards', gold: 6500, infStock: false },
3269: { name: 'Boo', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Boo.png', category: 'Trading Cards', gold: 6500, infStock: false },
3270: { name: 'King Boo', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_King_Boo.png', category: 'Trading Cards', gold: 15000, infStock: false },
3281: { name: 'Haunted Tombstone Shard', image: 'https://gazellegames.net/static/common/items/Items/Halloween2021/Haunted_Tombstone_Shard.png', category: 'Special Items', gold: 2500, infStock: false },
3313: { name: 'Snowman Cookie', image: 'static/common/items/Items/Christmas2021/Christmas2021_Snowman_Cookie.png', category: 'Stat potions', gold: 650, infStock: false },
3314: { name: 'Tree Cookie', image: 'static/common/items/Items/Christmas2021/Christmas2021_Tree_Cookie.png', category: 'Stat potions', gold: 1300, infStock: false },
3317: { name: 'Candy Cane Cookie', image: 'static/common/items/Items/Christmas2021/Christmas2021_Candy_Cane_Cookie.png', category: 'Buffs', gold: 500, infStock: false },
3322: { name: 'Young Snowman', image: 'static/common/items/Items/Christmas2021/Christmas2021_Young_Snowman.png', category: 'Equipment', gold: 35000, infStock: false },
3323: { name: 'Frosty Snowman', image: 'static/common/items/Items/Christmas2021/Christmas2021_Frosty_Snowman.png', category: 'Equipment', gold: 70000, infStock: false },
3324: { name: 'Happy Snowman', image: 'static/common/items/Items/Christmas2021/Christmas2021_Happy_Snowman.png', category: 'Equipment', gold: 170000, infStock: false },
3325: { name: 'Snowflake', image: 'static/common/items/Items/Christmas2021/Christmas2021_Snowflake.png', category: 'Stat potions', gold: 825, infStock: false },
3326: { name: 'Penguin Snowglobe', image: 'static/common/items/Items/Christmas2021/Christmas2021_Penguin_Snowglobe.png', category: 'Stat potions', gold: 1375, infStock: false },
3327: { name: 'Owl Snowglobe', image: 'static/common/items/Items/Christmas2021/Christmas2021_Owl_Snowglobe.png', category: 'Stat potions', gold: 1625, infStock: false },
3328: { name: 'Santa Claus Is Out There', image: 'static/common/items/Items/Card/Christmas2021_Santa_Claus_Is_Out_There.png', category: 'Trading Cards', gold: 3000, infStock: false },
3329: { name: 'Back to the Future', image: 'static/common/items/Items/Card/Christmas2021_Back_to_the_Future.png', category: 'Trading Cards', gold: 3000, infStock: false },
3330: { name: 'Big Lebowski', image: 'static/common/items/Items/Card/Christmas2021_Big_Lebowski.png', category: 'Trading Cards', gold: 3000, infStock: false },
3331: { name: 'Picard', image: 'static/common/items/Items/Card/Christmas2021_Picard.png', category: 'Trading Cards', gold: 3000, infStock: false },
3332: { name: 'Braveheart', image: 'static/common/items/Items/Card/Christmas2021_Braveheart.png', category: 'Trading Cards', gold: 3000, infStock: false },
3333: { name: 'Indy', image: 'static/common/items/Items/Card/Christmas2021_Indy.png', category: 'Trading Cards', gold: 3000, infStock: false },
3334: { name: 'Gremlins', image: 'static/common/items/Items/Card/Christmas2021_Gremlins.png', category: 'Trading Cards', gold: 3000, infStock: false },
3335: { name: 'Die Hard', image: 'static/common/items/Items/Card/Christmas2021_Die_Hard.png', category: 'Trading Cards', gold: 3000, infStock: false },
3336: { name: 'Jurassic Park', image: 'static/common/items/Items/Card/Christmas2021_Jurassic_Park.png', category: 'Trading Cards', gold: 3000, infStock: false },
3338: { name: 'Mando', image: 'static/common/items/Items/Card/Christmas2021_Mando.png', category: 'Trading Cards', gold: 10000, infStock: false },
3339: { name: 'Doomguy ', image: 'static/common/items/Items/Card/Christmas2021_Doomguy.png', category: 'Trading Cards', gold: 10000, infStock: false },
3340: { name: 'Grievous', image: 'static/common/items/Items/Card/Christmas2021_Grievous.png', category: 'Trading Cards', gold: 10000, infStock: false },
3341: { name: 'Have a Breathtaking Christmas', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2021_Have_a_Breathtaking_Christmas.png', category: 'Trading Cards', gold: 35000, infStock: false },
3348: { name: "Cupid's Wings", image: 'static/common/items/Items/Valentine2022/cupids_wings_avatar.png', category: 'Equipment', gold: 10000, infStock: true, equipLife: 7776000 },
3349: { name: "Cupid's Gold Wings", image: 'static/common/items/Items/Valentine2022/cupids_gold_wings_avatar.png', category: 'Equipment', gold: 36000, infStock: false, equipLife: 7776000 },
3352: { name: "Cupid's Mithril Wings", image: 'static/common/items/Items/Valentine2022/cupids_mithril_wings_avatar.png', category: 'Equipment', gold: 87000, infStock: false, equipLife: 7776000 },
3353: { name: "Cupid's Adamantium Wings", image: 'static/common/items/Items/Valentine2022/cupids_adamantium_wings_avatar.png', category: 'Equipment', gold: 239000, infStock: false, equipLife: 7776000 },
3358: { name: "Valentine's Day 2022 Badge", image: 'static/common/items/Items/Valentine2022/valentines_badge_shop.png', category: 'User badges', gold: 15000, infStock: false },
3359: { name: 'Rose Petals', image: 'static/common/items/Items/Valentine2022/rose_petals.png', category: 'Crafting Materials', gold: 3750, infStock: false },
3360: { name: "Cupid's Tiara", image: 'static/common/items/Items/Valentine2022/cupids_tiara.png', category: 'Equipment', gold: 30000, infStock: false },
3361: { name: "Cupid's Cradle", image: 'static/common/items/Items/Valentine2022/cupids_cradle_avatar.png', category: 'Equipment', gold: 1030000, infStock: false },
3362: { name: 'Disassembled Adamantium Wings', image: 'static/common/items/Items/Valentine2022/cupids_mithril_wings_avatar.png', category: 'Crafting Materials', gold: 189000, infStock: false },
3363: { name: 'Disassembled Mithril Wings', image: 'static/common/items/Items/Valentine2022/cupids_gold_wings_avatar.png', category: 'Crafting Materials', gold: 64000, infStock: false },
3364: { name: 'Disassembled Gold Wings', image: 'static/common/items/Items/Valentine2022/cupids_wings_avatar.png', category: 'Crafting Materials', gold: 23000, infStock: false },
3365: { name: "Disassembled Cupid's Cradle", image: 'https://ptpimg.me/7itno5.png', category: 'Crafting Materials', gold: 1030000, infStock: false },
3368: { name: 'IRC Voice (1 Year)', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 130000, infStock: true },
3369: { name: 'Red Dragon', image: 'https://ptpimg.me/01y295.png', category: 'Equipment', gold: 500000, infStock: false },
3370: { name: 'Blue Dragon', image: 'https://ptpimg.me/g1t9wq.png', category: 'Equipment', gold: 500000, infStock: false },
3371: { name: 'Green Dragon', image: 'https://ptpimg.me/eb6p8q.png', category: 'Equipment', gold: 500000, infStock: false },
3373: { name: 'Gold Dragon', image: 'https://ptpimg.me/39xam3.png', category: 'Equipment', gold: 1000000, infStock: false },
3378: { name: '12th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/12th_Birthday_Badge.png', category: 'User badges', gold: 15000, infStock: false },
3379: { name: 'Slice of Birthday Cake', image: 'https://ptpimg.me/880dpt.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3384: { name: 'Golden Egg', image: 'https://ptpimg.me/vg48o6.png', category: 'Crafting Materials', gold: 1000000, infStock: true },
3400: { name: 'Sacred Cuirass (RGB)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_RGB.png', category: 'Equipment', gold: 704000, infStock: false, equipLife: 10368000 },
3401: { name: 'Sacred Cuirass (RG)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_RG.png', category: 'Equipment', gold: 576000, infStock: false, equipLife: 10368000 },
3402: { name: 'Sacred Cuirass (RB)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_RB.png', category: 'Equipment', gold: 576000, infStock: false, equipLife: 10368000 },
3403: { name: 'Sacred Cuirass (GB)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_GB.png', category: 'Equipment', gold: 576000, infStock: false, equipLife: 10368000 },
3404: { name: 'Sacred Cuirass (R)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_R.png', category: 'Equipment', gold: 576000, infStock: false, equipLife: 10368000 },
3405: { name: 'Sacred Cuirass (G)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_G.png', category: 'Equipment', gold: 576000, infStock: false, equipLife: 10368000 },
3406: { name: 'Sacred Cuirass (B)', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass_B.png', category: 'Equipment', gold: 576000, infStock: false, equipLife: 10368000 },
3407: { name: 'Sacred Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Adamantium_Claymore_RGB.png', category: 'Equipment', gold: 768000, infStock: false, equipLife: 10368000 },
3417: { name: 'White Pumpkin', image: 'https://ptpimg.me/8jo395.png', category: 'Crafting Materials', gold: 2100, infStock: false },
3423: { name: 'Christmas Tree Badge', image: 'https://ptpimg.me/60yj5b.png', category: 'User badges', gold: 15000, infStock: false },
3425: { name: 'Christmas Branch', image: 'https://ptpimg.me/36299d.png', category: 'Crafting Materials', gold: 3000, infStock: false },
3430: { name: 'Superior Luck Potion', image: 'https://ptpimg.me/ymulww.png', category: 'Buffs', gold: 280000, infStock: false },
3441: { name: 'Pumpkin Dwarf Companion', image: 'https://gazellegames.net/static/common/items/Cover/Pets/dwarf_pumpkin.png', category: 'Equipment', gold: 25000, infStock: false },
3442: { name: 'Flaming Knife Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/13th_Birthday_Badge.png', category: 'User badges', gold: 15000, infStock: false },
3443: { name: 'Shattered Blade Fragments', image: 'https://gazellegames.net/static/common/items/Items/Birthday2023/blade_fragments.png', category: 'Crafting Materials', gold: 2250, infStock: false },
3444: { name: 'Flaming Knife', image: 'https://gazellegames.net/static/common/items/Items/Birthday2023/flaming_knife.png', category: 'Crafting Materials', gold: 2100, infStock: false },
3477: { name: 'Halloween 2023 Holy Hand Grenade Badge', image: 'https://ptpimg.me/3pmks8.png', category: 'User badges', gold: 30000, infStock: false },
3478: { name: 'The Dark Lord', image: 'https://ptpimg.me/58q516.png', category: 'Stat potions', gold: 12000, infStock: false },
3479: { name: 'Vial of Holy Water', image: 'https://ptpimg.me/3pmks8.png', category: 'Stat potions', gold: 2500, infStock: false },
3480: { name: 'Wooden Stake', image: 'https://ptpimg.me/5tm3f7.png', category: 'Stat potions', gold: 2500, infStock: false },
3481: { name: 'Talisman of Summoning', image: 'https://ptpimg.me/0lkfh7.png', category: 'Stat potions', gold: 6000, infStock: false },
3482: { name: 'Elixir of the Forbidden', image: 'https://ptpimg.me/ieaw8p.png', category: 'Stat potions', gold: 2100, infStock: false },
3485: { name: 'Swarm of Bats', image: 'https://ptpimg.me/2r39q6.png', category: 'Stat potions', gold: 2500, infStock: false },
3487: { name: 'Bat Company', image: 'https://ptpimg.me/s78ysb.png', category: 'Equipment', gold: 23500, infStock: false },
3490: { name: 'Mario x Santa Claus', image: 'https://ptpimg.me/de3lmy.png', category: 'Special Items', gold: 2500, infStock: false },
3491: { name: 'Peach x Mrs. Claus', image: 'https://ptpimg.me/587nt2.png', category: 'Special Items', gold: 2500, infStock: false },
3492: { name: 'Luigi x Elf', image: 'https://ptpimg.me/5wvmc7.png', category: 'Special Items', gold: 2500, infStock: false },
3493: { name: 'Bowser x Grinch', image: 'https://ptpimg.me/ik0b6p.png', category: 'Special Items', gold: 2500, infStock: false },
3494: { name: 'Toy Soldier x Koopa Troopa', image: 'https://ptpimg.me/w84e09.png', category: 'Special Items', gold: 2500, infStock: false },
3495: { name: 'Wario x Scrooge', image: 'https://ptpimg.me/0fo10q.png', category: 'Special Items', gold: 2500, infStock: false },
3496: { name: 'Toad x Snowman', image: 'https://ptpimg.me/7de2qd.png', category: 'Special Items', gold: 1250, infStock: false },
3497: { name: 'Goomba x Snowman', image: 'https://ptpimg.me/0z6i40.png', category: 'Special Items', gold: 1250, infStock: false },
3498: { name: 'Yuletide Message #1', image: 'https://ptpimg.me/r09v04.png', category: 'Special Items', gold: 5500, infStock: false },
3499: { name: 'Yuletide Message #2', image: 'https://ptpimg.me/9we7t5.png', category: 'Special Items', gold: 5500, infStock: false },
3500: { name: 'Yuletide Message #3', image: 'https://ptpimg.me/w1wlxt.png', category: 'Special Items', gold: 5500, infStock: false },
3501: { name: 'Prismatic Shard', image: 'https://ptpimg.me/8k0hyp.png', category: 'Special Items', gold: 12000, infStock: false },
3502: { name: 'Mario Christmas Family Portrait', image: 'https://ptpimg.me/xp2gh2.png', category: 'Special Items', gold: 1300, infStock: false },
3503: { name: 'Mario Decoration', image: 'https://ptpimg.me/zw8q0q.png', category: 'Special Items', gold: 1300, infStock: false },
3504: { name: 'Rainbow Star Badge', image: 'https://ptpimg.me/2f8z5e.png', category: 'User badges', gold: 30000, infStock: false },
3505: { name: 'Prismatic Shard Badge', image: 'https://ptpimg.me/8k0hyp.png', category: 'User badges', gold: 30000, infStock: false },
3512: { name: 'Magical Fire Pit', image: 'https://ptpimg.me/yd3501.png', category: 'Stat potions', gold: 1300, infStock: false },
3513: { name: 'Magical De-Fusing Potion', image: 'https://ptpimg.me/5mu942.png', category: 'Stat potions', gold: 13000, infStock: false },
3514: { name: 'Mystical Firewood', image: 'https://ptpimg.me/zc3019.png', category: 'Stat potions', gold: 12000, infStock: false },
3515: { name: '14th Birthday Badge', image: 'https://ptpimg.me/59gqhd.png', category: 'User badges', gold: 30000, infStock: false },
3521: { name: 'Halloween 2024 Werewolf Badge', image: 'https://ptpimg.me/j05r9t.png', category: 'User badges', gold: 30000, infStock: false },
3522: { name: 'Spooky Bass Guitar', image: 'https://ptpimg.me/126c59.png', category: 'Stat potions', gold: 1800, infStock: false },
3523: { name: 'Haunted Snare Drum', image: 'https://ptpimg.me/faws0k.png', category: 'Stat potions', gold: 1800, infStock: false },
3524: { name: 'Spine Chilling Microphone', image: 'https://ptpimg.me/67i4rw.png', category: 'Stat potions', gold: 1800, infStock: false },
3525: { name: 'Eerie Orchestrion', image: 'https://ptpimg.me/fg78sb.png', category: 'Stat potions', gold: 6000, infStock: false },
3526: { name: 'Cursed Cerberus Puppy', image: 'https://ptpimg.me/2mh5y9.png', category: 'Buffs', gold: 1800, infStock: false },
3535: { name: 'Rudolph Pet', image: 'https://ptpimg.me/d10q93.png', category: 'Equipment', gold: 12000, infStock: false },
3540: { name: 'Maple Syrup', image: 'https://ptpimg.me/5lusjt.png', category: 'Special Items', gold: 12000, infStock: false },
3552: { name: 'Ominous Obelisk', image: 'https://ptpimg.me/cbu5om.png', category: 'Crafting Materials', gold: 500000, infStock: true },
3559: { name: 'Black Dragon', image: 'https://ptpimg.me/vyzxej.png', category: 'Equipment', gold: 2000000, infStock: false },
3577: { name: 'Pile of Asbestos', image: 'https://gazellegames.net/static/common/items/Items/Christmas/snow.png', category: 'Crafting Materials', gold: 700, infStock: true },
3578: { name: 'Plastic Shards', image: 'https://gazellegames.net/static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 275, infStock: true },
3579: { name: 'Totally Not Fake Milk', image: 'https://ptpimg.me/raa068.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3580: { name: 'Artificial Cherries', image: 'https://ptpimg.me/x02af9.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3581: { name: 'Pretend Grapes', image: 'https://ptpimg.me/351721.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3582: { name: 'Empty Coconuts', image: 'https://ptpimg.me/9c121y.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3583: { name: 'Stale Marshmallows', image: 'https://ptpimg.me/6tl43k.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3584: { name: 'Barely Moldy Cocoa Beans', image: 'https://ptpimg.me/8h05tu.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3585: { name: 'Vanillin Pods', image: 'https://ptpimg.me/7c4us8.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3586: { name: 'Freeze-Dried Strawberries', image: 'https://ptpimg.me/gp622c.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3587: { name: 'Half-Eaten Cinnamon', image: 'https://ptpimg.me/tol70u.png', category: 'Crafting Materials', gold: 3000, infStock: true },
3588: { name: "There's No Way This Is Cherry", image: 'https://gazellegames.net/static/common/items/Items/Birthday/chakefhake.png', category: 'Special Items', gold: 8000, infStock: false },
3589: { name: 'Not So Much Grape Milkshake', image: 'https://gazellegames.net/static/common/items/Items/Birthday/grapeshake.png', category: 'Special Items', gold: 8000, infStock: false },
3590: { name: 'Nut Free Coco-cooler Milkshake', image: 'https://gazellegames.net/static/common/items/Items/Birthday/coconutshake.png', category: 'Special Items', gold: 8000, infStock: false },
3591: { name: 'Half Empty Cinnamon Milkshake', image: 'https://ptpimg.me/kl097r.png', category: 'Special Items', gold: 8000, infStock: false },
3592: { name: 'Bumpy Path Milkshake', image: 'https://ptpimg.me/q8634k.png', category: 'Special Items', gold: 11000, infStock: false },
3593: { name: 'Brown, White, and Pink Milkshake', image: 'https://ptpimg.me/fr7433.png', category: 'Special Items', gold: 14000, infStock: false },
3600: { name: 'Angry Dinosaur Labubu', image: 'https://ptpimg.me/g8p1ae.png', category: 'Stats potions', gold: 10000, infStock: false },
3603: { name: 'Cirno Labubu', image: 'https://ptpimg.me/3fzc7e.png', category: 'Stats potions', gold: 10000, infStock: false },
3604: { name: 'Silly Cat Labubu', image: 'https://ptpimg.me/7ph069.png', category: 'Stats potions', gold: 10000, infStock: false },
3605: { name: 'InfoBot Labubu', image: 'https://ptpimg.me/1a2wdo.png', category: 'Stats potions', gold: 30000, infStock: false },
3606: { name: 'Sharg Labubu', image: 'https://ptpimg.me/87y2i9.png', category: 'Stats potions', gold: 60000, infStock: false },
3607: { name: 'Mighty Ghost Labubu', image: 'https://ptpimg.me/daojfc.png', category: 'Stats potions', gold: 10000, infStock: false },
3608: { name: 'Mario Labubu', image: 'https://ptpimg.me/3k4yx6.png', category: 'Stats potions', gold: 30000, infStock: false },
3609: { name: 'Monopoly Man Labubu', image: 'https://ptpimg.me/d15q79.png', category: 'Stats potions', gold: 10000, infStock: false },
3610: { name: 'Gazelle Labubu', image: 'https://ptpimg.me/4x759l.png', category: 'Stats potions', gold: 10000, infStock: false },
3615: { name: 'Frankenstein Labubu', image: 'https://ptpimg.me/1b1c5m.png', category: 'Stats potions', gold: 500000, infStock: false },
3616: { name: 'Voodoo Doll', image: 'https://ptpimg.me/5h2bb4.png', category: 'Special Items', gold: 10000, infStock: false },
3617: { name: 'Creepy Cauldron', image: 'https://ptpimg.me/c8l684.png', category: 'Special Items', gold: 5000, infStock: false },
3618: { name: 'Severed Eyeball', image: 'https://ptpimg.me/r1gv6i.png', category: 'Special Items', gold: 5000, infStock: false },
3619: { name: 'Mandrake Root', image: 'https://ptpimg.me/55x720.png', category: 'Special Items', gold: 5000, infStock: false },
3620: { name: 'Crumbling Casket', image: 'https://ptpimg.me/5zbfrb.png', category: 'Special Items', gold: 5000, infStock: false },
3621: { name: 'Phoenix Feathers', image: 'https://ptpimg.me/7zur88.png', category: 'Special Items', gold: 5000, infStock: false },
3622: { name: 'Witch Key', image: 'https://ptpimg.me/2d69v7.png', category: 'Special Items', gold: 5000, infStock: false },
3623: { name: 'Zombie Key', image: 'https://ptpimg.me/664oc6.png', category: 'Special Items', gold: 5000, infStock: false },
3624: { name: 'Gargoyle Statue', image: 'https://ptpimg.me/c370lg.png', category: 'Special Items', gold: 10000, infStock: false },
3626: { name: "Witch's Hat Badge", image: 'https://ptpimg.me/tr5147.png', category: 'User badges', gold: 30000, infStock: false },
3634: { name: 'Stay-Puft Marshmallow Man', image: 'https://ptpimg.me/w9tzag.png', category: 'Stat potions', gold: 2500, infStock: false },
3635: { name: 'Ghostly Librarian', image: 'https://ptpimg.me/y1d1et.png', category: 'Stat potions', gold: 2500, infStock: false },
3636: { name: 'Slimer', image: 'https://ptpimg.me/3v4akq.png', category: 'Stat potions', gold: 2500, infStock: false },
3637: { name: 'Slimer Santa', image: 'https://ptpimg.me/ado7cj.png', category: 'Stat potions', gold: 2500, infStock: false },
3638: { name: 'X-Mas Terror Dog', image: 'https://ptpimg.me/z3il2f.png', category: 'Stat potions', gold: 2500, infStock: false },
3639: { name: 'Ghost Trap', image: 'https://ptpimg.me/4sg84y.png', category: 'Stat potions', gold: 2500, infStock: false },
3640: { name: 'Gozer', image: 'https://ptpimg.me/o94lyc.png', category: 'Stat potions', gold: 2500, infStock: false },
3641: { name: 'Spirit Goggles', image: 'https://ptpimg.me/877r00.png', category: 'Stat potions', gold: 2500, infStock: false },
3642: { name: 'Ecto-1', image: 'https://ptpimg.me/3vw5jf.png', category: 'Stat potions', gold: 2500, infStock: false },
3643: { name: 'Santa Spirit Labubu', image: 'https://ptpimg.me/a47u7o.png', category: 'Stat potions', gold: 2500, infStock: false },
3644: { name: 'Elf Spirit Labubu', image: 'https://ptpimg.me/4qh2rl.png', category: 'Stat potions', gold: 2500, infStock: false },
3645: { name: 'Reindeer Labubu', image: 'https://ptpimg.me/50e47u.png', category: 'Stat potions', gold: 5000, infStock: false },
3646: { name: 'Slimer Labubu', image: 'https://ptpimg.me/4ieu00.png', category: 'Stat potions', gold: 5000, infStock: false },
3647: { name: 'Vinz Clortho Labubu', image: 'https://ptpimg.me/331ws0.png', category: 'Stat potions', gold: 5000, infStock: false },
3648: { name: 'Stay-Puft Labubu', image: 'https://ptpimg.me/65f6kt.png', category: 'Stat potions', gold: 5000, infStock: false },
3649: { name: 'Festive Ghostbuster Labubu', image: 'https://ptpimg.me/955ym9.png', category: 'Stat potions', gold: 10000, infStock: false },
3650: { name: 'Proton Pack', image: 'https://ptpimg.me/7ya2h0.png', category: 'Special Items', gold: 5000, infStock: false },
3651: { name: 'Disguise Kit 007', image: 'https://ptpimg.me/02085g.png', category: 'Special Items', gold: 5000, infStock: false },
3653: { name: 'Christmas 2025 Ghostbusters Badge', image: 'https://ptpimg.me/mw96q5.png', category: 'User badges', gold: 30000, infStock: false }
};

//
// Defines all the recipes with ingredients and results, from data.js
//
// recipe object:
// See https://gazellegames.net/wiki.php?action=article&id=401#_2452401087 for details
// name (optional) is the recipe display name. Item's name (via itemId) is used if omitted
//
// prettier-ignore
var RECIPES = [
{ itemId: 1988, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Glass Shards From Sand' },
{ itemId: 1988, recipe: 'EEEEEEEEEEEEEEEEEEEE00125EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards From Test Tube' },
{ itemId: 2436, recipe: 'EEEEEEEEEEEEEEEEEEEE00124EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards From Vial' },
{ itemId: 2437, recipe: 'EEEEEEEEEEEEEEEEEEEE00126EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards From Bowl' },
{ itemId: 125, recipe: 'EEEEE01988EEEEEEEEEE01988EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', requirement: 1 },
{ itemId: 124, recipe: 'EEEEE01988EEEEE0198801988EEEEE0198801988EEEEE', book: 'Glass', type: 'Standard', requirement: 1 },
{ itemId: 126, recipe: '01988019880198801988EEEEE01988019880198801988', book: 'Glass', type: 'Standard', requirement: 1 },
{ itemId: 124, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEE02230EEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Dust Ore Vial' },
{ itemId: 126, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEE02231EEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Dust Ore Bowl' },
{ itemId: 66, recipe: 'EEEEEEEEEE00115EEEEE0012500114EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 98, recipe: 'EEEEEEEEEE00115EEEEE0012400114EEEEEEEEEE00115', book: 'Potions', type: 'Standard' },
{ itemId: 99, recipe: '00115EEEEE0011500115001240011400115EEEEE00115', book: 'Potions', type: 'Standard' },
{ itemId: 100, recipe: 'EEEEE00113EEEEE000990012600099EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 104, recipe: 'EEEEEEEEEE00111EEEEE0012500127EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 105, recipe: 'EEEEEEEEEE00111EEEEE0012400127EEEEEEEEEE00111', book: 'Potions', type: 'Standard' },
{ itemId: 106, recipe: '00111EEEEE0011100111001240012700111EEEEE00111', book: 'Potions', type: 'Standard' },
{ itemId: 107, recipe: 'EEEEE00113EEEEE001060012600106EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 127, recipe: 'EEEEEEEEEEEEEEEEEEEE0012500112EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 2433, recipe: 'EEEEEEEEEEEEEEE001240011400114EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 2434, recipe: '001140011400114001140012600114EEEEE00113EEEEE', book: 'Potions', type: 'Standard' },
{ itemId: 3430, recipe: '024340254902434024340012602434024340012100113', book: 'Potions', type: 'Standard', requirement: 2 },
{ itemId: 2580, recipe: 'EEEEEEEEEEEEEEEEEEEE0257902579EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2581, recipe: 'EEEEEEEEEEEEEEE001120258000112EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2582, recipe: 'EEEEEEEEEEEEEEE025810011300113EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2718, recipe: 'EEEEEEEEEEEEEEEEEEEE0271702717EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2719, recipe: 'EEEEEEEEEEEEEEEEEEEE0271800112EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2720, recipe: 'EEEEEEEEEEEEEEE027190255100113EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2721, recipe: 'EEEEEEEEEEEEEEE027200255102551EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
{ itemId: 2822, recipe: '032180229503219EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
{ itemId: 3226, recipe: '032180229503220EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
{ itemId: 3227, recipe: '032180229503221EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
{ itemId: 3228, recipe: '032180229503241EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
{ itemId: 3229, recipe: '0321802295EEEEE0322303222EEEEE019880198801988', book: 'Food', type: 'Standard' },
{ itemId: 3230, recipe: '0321802295EEEEE032230322403225019880198801988', book: 'Food', type: 'Standard' },
{ itemId: 2719, recipe: '00116EEEEE00116EEEEE02718EEEEE00127EEEEE00127', book: 'Food', type: 'Standard', name: 'Garlic Emerald-Baguette from tincture' },
{ itemId: 3588, recipe: '035790357703580EEEEEEEEEEEEEEE035780357803578', book: 'Food', type: 'Standard', name: "There's No Way This Is Cherry" },
{ itemId: 3589, recipe: '035790357703581EEEEEEEEEEEEEEE035780357803578', book: 'Food', type: 'Standard', name: 'Not So Much Grape Milkshake' },
{ itemId: 3590, recipe: '035790357703582EEEEEEEEEEEEEEE035780357803578', book: 'Food', type: 'Standard', name: 'Nut Free Coco-cooler Milkshake' },
{ itemId: 3591, recipe: '035790357703587EEEEEEEEEEEEEEE035780357803578', book: 'Food', type: 'Standard', name: 'Half Empty Cinnamon Milkshake' },
{ itemId: 3592, recipe: '0357903577EEEEE0358403583EEEEE035780357803578', book: 'Food', type: 'Standard', name: 'Bumpy Path Milkshake' },
{ itemId: 3593, recipe: '0357903577EEEEE035840358503586035780357803578', book: 'Food', type: 'Standard', name: 'Brown, White, and Pink Milkshake' },
{ itemId: 2236, recipe: '0222502234EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2235, recipe: '0222502225EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2237, recipe: '0222602226EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2238, recipe: '0222602226EEEEEEEEEE02233EEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2238, recipe: 'EEEEE02237EEEEEEEEEE02233EEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1, name: 'Steel Bar From Iron Bar' },
{ itemId: 2239, recipe: '0222702227EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2240, recipe: '0222802228EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2241, recipe: '0222902229EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2242, recipe: '0223002230EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2243, recipe: '0223102231EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2244, recipe: '0223202232EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
{ itemId: 2261, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEE02236EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2262, recipe: 'EEEEE02235EEEEEEEEEEEEEEEEEEEE02235EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2263, recipe: 'EEEEE02237EEEEEEEEEE02237EEEEE02237EEEEE02237', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2264, recipe: 'EEEEE02238EEEEEEEEEE02238EEEEE02238EEEEE02238', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2265, recipe: 'EEEEE02239EEEEEEEEEE02239EEEEE02239EEEEE02239', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2266, recipe: 'EEEEE02240EEEEEEEEEE02240EEEEE022400224002240', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2267, recipe: 'EEEEE02241EEEEEEEEEE02241EEEEE022410224102241', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2268, recipe: 'EEEEE02242EEEEEEEEEEEEEEEEEEEE02242EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2269, recipe: 'EEEEE02243EEEEEEEEEE02243EEEEE02243EEEEE02243', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2270, recipe: 'EEEEE02244EEEEEEEEEE02244EEEEE022440224402244', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2761, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2762, recipe: 'EEEEE02235EEEEEEEEEEEEEEEEEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2763, recipe: 'EEEEE02237EEEEEEEEEE02237EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2764, recipe: 'EEEEE02238EEEEEEEEEE02238EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2765, recipe: 'EEEEE02239EEEEEEEEEE02239EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2766, recipe: 'EEEEE02240EEEEEEEEEE02240EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2767, recipe: 'EEEEE02241EEEEEEEEEE02241EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2849, recipe: 'EEEEE02242EEEEEEEEEEEEEEEEEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2850, recipe: 'EEEEE02243EEEEEEEEEE02243EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2851, recipe: 'EEEEE02244EEEEEEEEEE02244EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2261, recipe: 'EEEEEEEEEEEEEEE0223602761EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Segmentata To Cuirass' },
{ itemId: 2262, recipe: 'EEEEEEEEEEEEEEE0223502762EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Bronze Segmentata To Cuirass' },
{ itemId: 2263, recipe: '02237EEEEEEEEEE0223702763EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Iron Segmentata To Cuirass' },
{ itemId: 2264, recipe: '02238EEEEEEEEEE0223802764EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Steel Segmentata To Cuirass' },
{ itemId: 2265, recipe: '02239EEEEEEEEEE0223902765EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Gold Segmentata To Cuirass' },
{ itemId: 2266, recipe: '02240EEEEEEEEEE0224002766EEEEE02240EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Mithril Segmentata To Cuirass' },
{ itemId: 2267, recipe: '02241EEEEEEEEEE0224102767EEEEE02241EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Adamantium Segmentata To Cuirass' },
{ itemId: 2268, recipe: 'EEEEEEEEEEEEEEE0224202849EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Quartz Lamellar To Chainmail' },
{ itemId: 2269, recipe: '02243EEEEEEEEEE0224302850EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Jade Lamellar To Chainmail' },
{ itemId: 2270, recipe: '02244EEEEEEEEEE0224402851EEEEE02244EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Amethyst Lamellar To Chainmail' },
{ itemId: 2862, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEE02627EEEEE02627', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2863, recipe: 'EEEEE02235EEEEEEEEEE02862EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2864, recipe: 'EEEEE02237EEEEEEEEEE02863EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2865, recipe: 'EEEEE02238EEEEEEEEEE02864EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2866, recipe: 'EEEEE02239EEEEEEEEEE02865EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2867, recipe: 'EEEEE02240EEEEEEEEEE02866EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2868, recipe: 'EEEEE02241EEEEEEEEEE02867EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2908, recipe: 'EEEEE02236EEEEEEEEEEEEEEE0262702550EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 2907, recipe: '0255002235EEEEEEEEEE029080262702550EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2906, recipe: '0255002237EEEEE02550029070262702550EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2905, recipe: '0255002238EEEEE0255002906026270255002550EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2321, recipe: '0232302239EEEEE0232302905026270232302239EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2902, recipe: '0232302240EEEEEEEEEE02321026270232302240EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2903, recipe: '0232302241EEEEEEEEEE02902026270232302241EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
{ itemId: 2261, recipe: 'EEEEEEEEEEEEEEE0223602261EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Impure Bronze Cuirass' },
{ itemId: 2262, recipe: 'EEEEEEEEEEEEEEE0223502262EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Bronze Cuirass' },
{ itemId: 2263, recipe: '02237EEEEEEEEEE0223702263EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Iron Cuirass' },
{ itemId: 2264, recipe: '02238EEEEEEEEEE0223802264EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Steel Cuirass' },
{ itemId: 2265, recipe: '02239EEEEEEEEEE0223902265EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Gold Cuirass' },
{ itemId: 2266, recipe: '02240EEEEEEEEEE0224002266EEEEE02240EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Mithril Cuirass' },
{ itemId: 2267, recipe: '02241EEEEEEEEEE0224102267EEEEE02241EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Adamantium Cuirass' },
{ itemId: 2268, recipe: 'EEEEEEEEEEEEEEE0224202268EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Quartz Chainmail' },
{ itemId: 2269, recipe: '02243EEEEEEEEEE0224302269EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Jade Chainmail' },
{ itemId: 2270, recipe: '02244EEEEEEEEEE0224402270EEEEE02244EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Amethyst Chainmail' },
{ itemId: 2867, recipe: 'EEEEE02240EEEEEEEEEE02867EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Mithril Armguards' },
{ itemId: 2868, recipe: 'EEEEE02241EEEEEEEEEE02868EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Adamantium Armguards' },
{ itemId: 2321, recipe: 'EEEEE02323EEEEEEEEEE02321EEEEEEEEEE02239EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Gold Power Gloves' },
{ itemId: 2902, recipe: 'EEEEE02323EEEEEEEEEE02902EEEEEEEEEE02240EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Mithril Power Gloves' },
{ itemId: 2903, recipe: 'EEEEE02323EEEEEEEEEE02903EEEEEEEEEE02241EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Adamantium Power Gloves' },
{ itemId: 3400, recipe: '0224102241022410224102267EEEEE021550215302154', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3401, recipe: '0224102241022410224102267EEEEE0215502153EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3402, recipe: '02241022410224102241022670215402155EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3403, recipe: '0224102241022410224102267EEEEEEEEEE0215302154', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3404, recipe: '0224102241022410224102267EEEEE02155EEEEE02155', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3405, recipe: '0224102241022410224102267EEEEE02153EEEEE02153', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3406, recipe: '0224102241022410224102267EEEEE02154EEEEE02154', book: 'Armor', type: 'Standard', requirement: 1 },
{ itemId: 3400, recipe: '0224102241022410224103400EEEEE021550215302154', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (RGB)' },
{ itemId: 3401, recipe: '0224102241022410224103401EEEEE0215502153EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (RG)' },
{ itemId: 3402, recipe: '02241022410224102241034020215402155EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (RB)' },
{ itemId: 3403, recipe: '0224102241022410224103403EEEEEEEEEE0215302154', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (GB)' },
{ itemId: 3404, recipe: '0224102241022410224103404EEEEE02155EEEEE02155', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (R)' },
{ itemId: 3405, recipe: '0224102241022410224103405EEEEE02153EEEEE02153', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (G)' },
{ itemId: 3406, recipe: '0224102241022410224103406EEEEE02154EEEEE02154', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (B)' },
{ itemId: 2641, recipe: '02236EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02236EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2642, recipe: '02235EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02235EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2643, recipe: '02237EEEEE02237EEEEE02237EEEEEEEEEE02237EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2644, recipe: '02238EEEEE02238EEEEE02238EEEEEEEEEE02238EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2645, recipe: '02239EEEEE02239EEEEE02239EEEEEEEEEE02239EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2646, recipe: '022400224002240EEEEE02240EEEEEEEEEE02240EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2647, recipe: '022410224102241EEEEE02241EEEEEEEEEE02241EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2648, recipe: '02242EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02242EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2649, recipe: '02243EEEEE02243EEEEE02243EEEEEEEEEE02243EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2650, recipe: '022440224402244EEEEE02244EEEEEEEEEE02244EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2852, recipe: 'EEEEE02627EEEEEEEEEEEEEEEEEEEEEEEEE02236EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2853, recipe: 'EEEEE02627EEEEEEEEEEEEEEEEEEEEEEEEE02235EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2854, recipe: 'EEEEE02627EEEEEEEEEE02237EEEEEEEEEE02237EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2855, recipe: 'EEEEE02627EEEEEEEEEE02238EEEEEEEEEE02238EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2856, recipe: 'EEEEE02627EEEEEEEEEE02239EEEEEEEEEE02239EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2857, recipe: 'EEEEE02627EEEEEEEEEE02240EEEEEEEEEE02240EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2858, recipe: 'EEEEE02627EEEEEEEEEE02241EEEEEEEEEE02241EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2859, recipe: 'EEEEE02627EEEEEEEEEEEEEEEEEEEEEEEEE02242EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2860, recipe: 'EEEEE02627EEEEEEEEEE02243EEEEEEEEEE02243EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2861, recipe: 'EEEEE02627EEEEEEEEEE02244EEEEEEEEEE02244EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
{ itemId: 2641, recipe: 'EEEEEEEEEEEEEEE0223602852EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Billhook To Claymore' },
{ itemId: 2642, recipe: 'EEEEEEEEEEEEEEE0223502853EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Bronze Billhook To Claymore' },
{ itemId: 2643, recipe: '02237EEEEEEEEEE0223702854EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Iron Billhook To Claymore' },
{ itemId: 2644, recipe: '02238EEEEEEEEEE0223802855EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Steel Billhook To Claymore' },
{ itemId: 2645, recipe: '02239EEEEEEEEEE0223902856EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Gold Billhook To Claymore' },
{ itemId: 2646, recipe: '02240EEEEEEEEEE0224002857EEEEE02240EEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Mithril Billhook To Claymore' },
{ itemId: 2647, recipe: '02241EEEEEEEEEE0224102858EEEEE02241EEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Adamantium Billhook To Claymore' },
{ itemId: 2648, recipe: 'EEEEEEEEEEEEEEE0224202859EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Quartz Guandao To Khopesh' },
{ itemId: 2649, recipe: '02243EEEEEEEEEE0224302860EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Jade Guandao To Khopesh' },
{ itemId: 2650, recipe: '02244EEEEEEEEEE0224402861EEEEE02244EEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Amethyst Guandao To Khopesh' },
{ itemId: 2641, recipe: 'EEEEEEEEEEEEEEE0223602641EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Impure Bronze Claymore' },
{ itemId: 2642, recipe: 'EEEEEEEEEEEEEEE0223502642EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Bronze Claymore' },
{ itemId: 2643, recipe: '02237EEEEEEEEEE0223702643EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Iron Claymore' },
{ itemId: 2644, recipe: '02238EEEEEEEEEE0223802644EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Steel Claymore' },
{ itemId: 2645, recipe: '02239EEEEEEEEEE0223902645EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Gold Claymore' },
{ itemId: 2646, recipe: '02240EEEEEEEEEE0224002646EEEEE02240EEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Mithril Claymore' },
{ itemId: 2647, recipe: '02241EEEEEEEEEE0224102647EEEEE02241EEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Adamantium Claymore' },
{ itemId: 2648, recipe: 'EEEEEEEEEEEEEEE0224202648EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Quartz Khopesh' },
{ itemId: 2649, recipe: '02243EEEEEEEEEE0224302649EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Jade Khopesh' },
{ itemId: 2650, recipe: '02244EEEEEEEEEE0224402650EEEEE02244EEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Amethyst Khopesh' },
{ itemId: 3407, recipe: '022410224102241022410264702241021550215302154', book: 'Weapons', type: 'Upgrade', requirement: 1 },
{ itemId: 3407, recipe: 'EEEEEEEEEEEEEEEEEEEE03407EEEEE021550215302154', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Sacred Claymore' },
{ itemId: 2225, recipe: 'EEEEEEEEEEEEEEE026530223602653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Bar To Ore' },
{ itemId: 2666, recipe: 'EEEEEEEEEEEEEEE026530223502653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Bar To Ore' },
{ itemId: 2668, recipe: 'EEEEEEEEEEEEEEE026530223702653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Bar To Ore' },
{ itemId: 2668, recipe: 'EEEEEEEEEEEEEEE026530223802653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Bar To Ore' },
{ itemId: 2670, recipe: 'EEEEEEEEEEEEEEE026530223902653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Bar To Ore' },
{ itemId: 2671, recipe: 'EEEEEEEEEEEEEEE026530224002653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Bar To Ore' },
{ itemId: 2672, recipe: 'EEEEEEEEEEEEEEE026530224102653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Bar To Ore' },
{ itemId: 2673, recipe: 'EEEEEEEEEEEEEEE026530224202653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Bar To Dust' },
{ itemId: 2675, recipe: 'EEEEEEEEEEEEEEE026530224302653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Bar To Dust' },
{ itemId: 2676, recipe: 'EEEEEEEEEEEEEEE026530224402653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Bar To Dust' },
{ itemId: 2656, recipe: 'EEEEEEEEEEEEEEE022340223502234EEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Downgrade Bronze Bar' },
{ itemId: 2237, recipe: 'EEEEEEEEEEEEEEEEEEEE02238EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Downgrade Steel Bar' },
{ itemId: 1987, recipe: 'EEEEEEEEEEEEEEEEEEEE02508EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Melt Dwarven Gem' },
{ itemId: 2236, recipe: 'EEEEEEEEEEEEEEEEEEEE02261EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Cuirass To Bar' },
{ itemId: 2235, recipe: 'EEEEEEEEEEEEEEEEEEEE02262EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Cuirass To Bar' },
{ itemId: 2657, recipe: 'EEEEEEEEEEEEEEEEEEEE02263EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Cuirass To Bars' },
{ itemId: 2658, recipe: 'EEEEEEEEEEEEEEEEEEEE02264EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Cuirass To Bars' },
{ itemId: 2659, recipe: 'EEEEEEEEEEEEEEEEEEEE02265EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Cuirass To Bars' },
{ itemId: 2661, recipe: 'EEEEEEEEEEEEEEEEEEEE02266EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Cuirass To Bars' },
{ itemId: 2662, recipe: 'EEEEEEEEEEEEEEEEEEEE02267EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Cuirass To Bars' },
{ itemId: 2236, recipe: 'EEEEEEEEEEEEEEEEEEEE02641EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Claymore To Bar' },
{ itemId: 2235, recipe: 'EEEEEEEEEEEEEEEEEEEE02642EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Claymore To Bar' },
{ itemId: 2657, recipe: 'EEEEEEEEEEEEEEEEEEEE02643EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Claymore To Bars' },
{ itemId: 2658, recipe: 'EEEEEEEEEEEEEEEEEEEE02644EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Claymore To Bars' },
{ itemId: 2659, recipe: 'EEEEEEEEEEEEEEEEEEEE02645EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Claymore To Bars' },
{ itemId: 2661, recipe: 'EEEEEEEEEEEEEEEEEEEE02646EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Claymore To Bars' },
{ itemId: 2662, recipe: 'EEEEEEEEEEEEEEEEEEEE02647EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Claymore To Bars' },
{ itemId: 2242, recipe: 'EEEEEEEEEEEEEEEEEEEE02268EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Chainmail To Bar' },
{ itemId: 2664, recipe: 'EEEEEEEEEEEEEEEEEEEE02269EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Chainmail To Bars' },
{ itemId: 2665, recipe: 'EEEEEEEEEEEEEEEEEEEE02270EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Chainmail To Bars' },
{ itemId: 2242, recipe: 'EEEEEEEEEEEEEEEEEEEE02648EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Khopesh To Bar' },
{ itemId: 2664, recipe: 'EEEEEEEEEEEEEEEEEEEE02649EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Khopesh To Bars' },
{ itemId: 2665, recipe: 'EEEEEEEEEEEEEEEEEEEE02650EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: ' Amethyst Khopesh To Bars' },
{ itemId: 2642, recipe: '02653EEEEE0265302225026410222502653EEEEE02653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Claymore To Bronze' },
{ itemId: 2262, recipe: '02653EEEEE0265302225022610222502653EEEEE02653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Cuirass To Bronze' },
{ itemId: 2643, recipe: '02653EEEEE02653022370264202237026530223702653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Bronze Claymore To Iron' },
{ itemId: 2263, recipe: '02653EEEEE02653022370226202237026530223702653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Bronze Cuirass To Iron' },
{ itemId: 2644, recipe: '02653EEEEE02653022330264302233026530223302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Iron Claymore To Steel' },
{ itemId: 2264, recipe: '02653EEEEE02653022330226302233026530223302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Iron Cuirass To Steel' },
{ itemId: 2645, recipe: '02653EEEEE02653022390264402239026530223902653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Steel Claymore To Gold' },
{ itemId: 2265, recipe: '02653EEEEE02653022390226402239026530223902653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Steel Cuirass To Gold' },
{ itemId: 2646, recipe: '026530224002653022400264502240026530224002653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Gold Claymore To Mithril' },
{ itemId: 2266, recipe: '026530224002653022400226502240026530224002653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Gold Cuirass To Mithril' },
{ itemId: 2647, recipe: '026530224102653022410264602241026530224102653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Mithril Claymore To Adamantium' },
{ itemId: 2267, recipe: '026530224102653022410226602241026530224102653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Mithril Cuirass To Adamantium' },
{ itemId: 2649, recipe: '02653EEEEE02653022430264802243026530224302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Quartz Khopesh To Jade' },
{ itemId: 2269, recipe: '02653EEEEE02653022430226802243026530224302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Quartz Chainmail To Jade' },
{ itemId: 2650, recipe: '026530224402653022440264902244026530224402653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Jade Khopesh To Amethyst' },
{ itemId: 2270, recipe: '026530224402653022440226902244026530224402653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Jade Chainmail To Amethyst' },
{ itemId: 2543, recipe: 'EEEEE02653EEEEEEEEEE02732EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Loop of Aggression' },
{ itemId: 2546, recipe: 'EEEEE02653EEEEEEEEEE02735EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Loop of Fortune' },
{ itemId: 2540, recipe: 'EEEEE02653EEEEEEEEEE02729EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Loop of Luck' },
{ itemId: 2544, recipe: 'EEEEE02653EEEEEEEEEE02733EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Loop of Aggression' },
{ itemId: 2547, recipe: 'EEEEE02653EEEEEEEEEE02736EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Loop of Fortune' },
{ itemId: 2541, recipe: 'EEEEE02653EEEEEEEEEE02730EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Loop of Luck' },
{ itemId: 2545, recipe: 'EEEEE02653EEEEEEEEEE02734EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Loop of Aggression' },
{ itemId: 2548, recipe: 'EEEEE02653EEEEEEEEEE02737EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Loop of Fortune' },
{ itemId: 2542, recipe: 'EEEEE02653EEEEEEEEEE02731EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Loop of Luck' },
{ itemId: 2566, recipe: 'EEEEE02653EEEEEEEEEE02738EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Prism of Aggression' },
{ itemId: 2568, recipe: 'EEEEE02653EEEEEEEEEE02740EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Prism of Fortune' },
{ itemId: 2567, recipe: 'EEEEE02653EEEEEEEEEE02739EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Prism of Luck' },
{ itemId: 2569, recipe: 'EEEEE02653EEEEEEEEEE02741EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Trifocal of Aggression' },
{ itemId: 2571, recipe: 'EEEEE02653EEEEEEEEEE02743EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Trifocal of Fortune' },
{ itemId: 2570, recipe: 'EEEEE02653EEEEEEEEEE02742EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Trifocal of Luck' },
{ itemId: 2572, recipe: 'EEEEE02653EEEEEEEEEE02744EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Totality of Aggression' },
{ itemId: 2574, recipe: 'EEEEE02653EEEEEEEEEE02746EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Totality of Fortune' },
{ itemId: 2573, recipe: 'EEEEE02653EEEEEEEEEE02745EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Totality of Luck' },
{ itemId: 2761, recipe: 'EEEEE02653EEEEEEEEEE02261EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Cuirass To Segmentata' },
{ itemId: 2762, recipe: 'EEEEE02653EEEEEEEEEE02262EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Cuirass To Segmentata' },
{ itemId: 2763, recipe: 'EEEEE02653EEEEEEEEEE02263EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Cuirass To Segmentata' },
{ itemId: 2764, recipe: 'EEEEE02653EEEEEEEEEE02264EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Cuirass To Segmentata' },
{ itemId: 2765, recipe: 'EEEEE02653EEEEEEEEEE02265EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Cuirass To Segmentata' },
{ itemId: 2766, recipe: 'EEEEE02653EEEEEEEEEE02266EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Cuirass To Segmentata' },
{ itemId: 2767, recipe: 'EEEEE02653EEEEEEEEEE02267EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Cuirass To Segmentata' },
{ itemId: 2852, recipe: 'EEEEE02653EEEEEEEEEE02641EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Claymore To Billhook' },
{ itemId: 2853, recipe: 'EEEEE02653EEEEEEEEEE02642EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Claymore To Billhook' },
{ itemId: 2854, recipe: 'EEEEE02653EEEEEEEEEE02643EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Claymore To Billhook' },
{ itemId: 2855, recipe: 'EEEEE02653EEEEEEEEEE02644EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Claymore To Billhook' },
{ itemId: 2856, recipe: 'EEEEE02653EEEEEEEEEE02645EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Claymore To Billhook' },
{ itemId: 2857, recipe: 'EEEEE02653EEEEEEEEEE02646EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Claymore To Billhook' },
{ itemId: 2858, recipe: 'EEEEE02653EEEEEEEEEE02647EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Claymore To Billhook' },
{ itemId: 2849, recipe: 'EEEEE02653EEEEEEEEEE02268EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Chainmail To Lamellar' },
{ itemId: 2850, recipe: 'EEEEE02653EEEEEEEEEE02269EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Chainmail To Lamellar' },
{ itemId: 2851, recipe: 'EEEEE02653EEEEEEEEEE02270EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Chainmail To Lamellar' },
{ itemId: 2859, recipe: 'EEEEE02653EEEEEEEEEE02648EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Khopesh To Guandao' },
{ itemId: 2860, recipe: 'EEEEE02653EEEEEEEEEE02649EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Khopesh To Guandao' },
{ itemId: 2861, recipe: 'EEEEE02653EEEEEEEEEE02650EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Khopesh To Guandao' },
{ itemId: 2866, recipe: 'EEEEEEEEEEEEEEEEEEEE02867EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Armguards To Gold' },
{ itemId: 2866, recipe: 'EEEEEEEEEEEEEEEEEEEE02868EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Armguards To Gold' },
{ itemId: 2537, recipe: 'EEEEEEEEEEEEEEEEEEEE0224202233EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2538, recipe: 'EEEEE01988EEEEEEEEEE02537EEEEEEEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2565, recipe: 'EEEEEEEEEEEEEEE001160224400116001160224400116', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2564, recipe: 'EEEEEEEEEEEEEEE025490224402549025490224402549', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2563, recipe: 'EEEEEEEEEEEEEEE023230224402323023230224402323', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2566, recipe: '025510224202551025510253802551025510223602551', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2568, recipe: '025500224202550025500253802550025500223602550', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2567, recipe: '025520224202552025520253802552025520223602552', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2543, recipe: 'EEEEE02551EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2546, recipe: 'EEEEE02550EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2540, recipe: 'EEEEE02552EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2569, recipe: '022430224302243001160253800116EEEEE02235EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2571, recipe: '022430224302243023230253802323EEEEE02235EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2570, recipe: '022430224302243025490253802549EEEEE02235EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2544, recipe: 'EEEEE00116EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2547, recipe: 'EEEEE02323EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2541, recipe: 'EEEEE02549EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2572, recipe: '0224402244022440011602538001160256502239EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2574, recipe: '0224402244022440232302538023230256302239EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2573, recipe: '0224402244022440254902538025490256402239EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2545, recipe: '001160011600116022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2548, recipe: '023230232302323022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2542, recipe: '025490254902549022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
{ itemId: 2732, recipe: 'EEEEEEEEEEEEEEEEEEEE02543EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2735, recipe: 'EEEEEEEEEEEEEEEEEEEE02546EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2729, recipe: 'EEEEEEEEEEEEEEEEEEEE02540EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2733, recipe: 'EEEEE02243EEEEEEEEEE02544EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2736, recipe: 'EEEEE02243EEEEEEEEEE02547EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2730, recipe: 'EEEEE02243EEEEEEEEEE02541EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2734, recipe: 'EEEEE02244EEEEEEEEEE0254502244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2737, recipe: 'EEEEE02244EEEEEEEEEE0254802244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2731, recipe: 'EEEEE02244EEEEEEEEEE0254202244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2738, recipe: 'EEEEEEEEEEEEEEE022420256602242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2740, recipe: 'EEEEEEEEEEEEEEE022420256802242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2739, recipe: 'EEEEEEEEEEEEEEE022420256702242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2741, recipe: 'EEEEE02243EEEEE022430256902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2743, recipe: 'EEEEE02243EEEEE022430257102243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2742, recipe: 'EEEEE02243EEEEE022430257002243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2744, recipe: '022440224402244022440257202244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2746, recipe: '022440224402244022440257402244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2745, recipe: '022440224402244022440257302244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
{ itemId: 2732, recipe: 'EEEEEEEEEEEEEEEEEEEE02732EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Loop of Aggression' },
{ itemId: 2735, recipe: 'EEEEEEEEEEEEEEEEEEEE02735EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Loop of Fortune' },
{ itemId: 2729, recipe: 'EEEEEEEEEEEEEEEEEEEE02729EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Loop of Luck' },
{ itemId: 2733, recipe: 'EEEEE02243EEEEEEEEEE02733EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Loop of Aggression' },
{ itemId: 2736, recipe: 'EEEEE02243EEEEEEEEEE02736EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Loop of Fortune' },
{ itemId: 2730, recipe: 'EEEEE02243EEEEEEEEEE02730EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Loop of Luck' },
{ itemId: 2734, recipe: 'EEEEE02244EEEEEEEEEE0273402244EEEEE02244EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Loop of Aggression' },
{ itemId: 2737, recipe: 'EEEEE02244EEEEEEEEEE0273702244EEEEE02244EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Loop of Fortune' },
{ itemId: 2731, recipe: 'EEEEE02244EEEEEEEEEE0273102244EEEEE02244EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Loop of Luck' },
{ itemId: 2738, recipe: 'EEEEEEEEEEEEEEE022420273802242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Prism of Aggression' },
{ itemId: 2740, recipe: 'EEEEEEEEEEEEEEE022420274002242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Prism of Fortune' },
{ itemId: 2739, recipe: 'EEEEEEEEEEEEEEE022420273902242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Prism of Luck' },
{ itemId: 2741, recipe: 'EEEEE02243EEEEE022430274102243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Trifocal of Aggression' },
{ itemId: 2743, recipe: 'EEEEE02243EEEEE022430274302243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Trifocal of Fortune' },
{ itemId: 2742, recipe: 'EEEEE02243EEEEE022430274202243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Trifocal of Luck' },
{ itemId: 2744, recipe: '022440224402244022440274402244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Totality of Aggression' },
{ itemId: 2746, recipe: '022440224402244022440274602244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Totality of Fortune' },
{ itemId: 2745, recipe: '022440224402244022440274502244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Totality of Luck' },
{ itemId: 2369, recipe: 'EEEEEEEEEEEEEEE023580235902357EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2370, recipe: 'EEEEEEEEEEEEEEE023650236402366EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2371, recipe: 'EEEEEEEEEEEEEEE023610236702368EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2438, recipe: 'EEEEEEEEEEEEEEE024000238802410EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2372, recipe: 'EEEEEEEEEEEEEEE023690237002371EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2376, recipe: 'EEEEEEEEEEEEEEE023730237402375EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2384, recipe: 'EEEEEEEEEEEEEEE023810238302382EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2380, recipe: 'EEEEEEEEEEEEEEE023780237702379EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2385, recipe: 'EEEEEEEEEEEEEEE023760238402380EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2401, recipe: 'EEEEEEEEEEEEEEE023900239202393EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2402, recipe: 'EEEEEEEEEEEEEEE023910239702394EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2403, recipe: 'EEEEEEEEEEEEEEE023950239602398EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2404, recipe: 'EEEEEEEEEEEEEEE024010240202403EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
{ itemId: 2468, recipe: '02372EEEEEEEEEEEEEEE02404EEEEE02385EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2, name: 'Random Lootbox' },
{ itemId: 2421, recipe: '02372EEEEEEEEEEEEEEE02404EEEEE02372EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2 },
{ itemId: 2465, recipe: '02404EEEEEEEEEEEEEEE02372EEEEE02404EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2 },
{ itemId: 2466, recipe: '02385EEEEEEEEEEEEEEE02372EEEEE02385EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2 },
{ itemId: 3107, recipe: 'EEEEEEEEEEEEEEEEEEEE0310503106EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3110, recipe: 'EEEEEEEEEEEEEEEEEEEE0310803109EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3111, recipe: 'EEEEEEEEEEEEEEEEEEEE0310703110EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3112, recipe: 'EEEEE0311903119EEEEE0311903119EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3117, recipe: 'EEEEEEEEEEEEEEE031130311403115EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3121, recipe: 'EEEEEEEEEE00114EEEEE0312000114EEEEEEEEEE00114', book: 'Xmas Crafting', type: 'Standard', requirement: 2 },
{ itemId: 2296, recipe: 'EEEEEEEEEEEEEEEEEEEE02295EEEEEEEEEE02295EEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2305, recipe: 'EEEEE02295EEEEE022950229602295EEEEE02295EEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2298, recipe: 'EEEEE02688EEEEEEEEEE02296EEEEEEEEEE00126EEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2299, recipe: 'EEEEE02297EEEEEEEEEE02298EEEEEEEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2303, recipe: 'EEEEE00126EEEEEEEEEE02296EEEEEEEEEE02688EEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2300, recipe: 'EEEEE02233EEEEE022330223302233EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard', requirement: 2 },
{ itemId: 2701, recipe: 'EEEEEEEEEEEEEEEEEEEE0269802700EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2702, recipe: 'EEEEEEEEEEEEEEEEEEEE0269802699EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2703, recipe: 'EEEEEEEEEEEEEEEEEEEE0270002699EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2704, recipe: 'EEEEEEEEEEEEEEE027010270202703EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2972, recipe: 'EEEEEEEEEEEEEEEEEEEE0296902970EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2975, recipe: 'EEEEEEEEEEEEEEEEEEEE0297302974EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2976, recipe: 'EEEEEEEEEEEEEEEEEEEE0297202975EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3340, recipe: 'EEEEEEEEEEEEEEE033280332903334EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3338, recipe: '033310333203333EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3339, recipe: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE033300333503336', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3341, recipe: 'EEEEE03340EEEEEEEEEE03338EEEEEEEEEE03339EEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3535, recipe: 'EEEEEEEEEE023060354002353EEEEEEEEEEEEEEE00114', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 2709, recipe: '027080270802708027080270802708EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3118, recipe: 'EEEEE03111EEEEE031130311403115EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3423, recipe: 'EEEEE03425EEEEEEEEEE03425EEEEE034250342503425', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3505, recipe: '023230230600113001180350300118025490258500121', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3501, recipe: '034980349903500EEEEEEEEEEEEEEE033170331402316', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3504, recipe: '025500092502149025510255202433001110350203501', book: 'Xmas Crafting', type: 'Standard' },
{ itemId: 3653, recipe: '036340363503636036370365003638036390364003642', book: 'Xmas Crafting', type: 'Standard', name: 'Christmas 2025 Ghostbusters Badge' },
{ itemId: 3535, recipe: 'EEEEEEEEEE023060365102353EEEEEEEEEEEEEEE00114', book: 'Xmas Crafting', type: 'Standard', name: 'Rudolph Pet (Alternate Recipe)' },
{ itemId: 3645, recipe: '03643EEEEE03644EEEEE03641EEEEEEEEEE02353EEEEE', book: 'Xmas Crafting', type: 'Standard', name: 'Reindeer Labubu' },
{ itemId: 3646, recipe: '03643EEEEE03644EEEEE03641EEEEE03636EEEEE03637', book: 'Xmas Crafting', type: 'Standard', name: 'Slimer Labubu' },
{ itemId: 3647, recipe: '03643EEEEE03644EEEEE03641EEEEE03638EEEEE03640', book: 'Xmas Crafting', type: 'Standard', name: 'Vinz Clortho Labubu' },
{ itemId: 3648, recipe: '03643EEEEE03644EEEEE03641EEEEE03634EEEEE03635', book: 'Xmas Crafting', type: 'Standard', name: 'Stay-Puft Labubu' },
{ itemId: 3648, recipe: '036430364203644036390364103645036460364703648', book: 'Xmas Crafting', type: 'Standard', name: 'Festive Ghostbuster Labubu' },
{ itemId: 2833, recipe: 'EEEEEEEEEEEEEEE0282902831EEEEEEEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 2834, recipe: 'EEEEEEEEEEEEEEE0282902830EEEEEEEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 2835, recipe: 'EEEEEEEEEEEEEEEEEEEE0283002831EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 2836, recipe: 'EEEEEEEEEEEEEEE028330283402835EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 2825, recipe: 'EEEEEEEEEEEEEEE028260282602826028260282602826', book: 'Birthday', type: 'Standard', name: 'Birthday Licks Badge - 9th' },
{ itemId: 3025, recipe: 'EEEEEEEEEEEEEEEEEEEE0302303024EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 3028, recipe: 'EEEEEEEEEEEEEEEEEEEE0302603027EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 3029, recipe: 'EEEEEEEEEEEEEEEEEEEE0302503028EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 3032, recipe: '03031EEEEE0303103031EEEEE0303103031EEEEE03031', book: 'Birthday', type: 'Standard', name: 'Birthday Gazelle Badge - 10th' },
{ itemId: 3154, recipe: 'EEEEEEEEEEEEEEE031510315203153EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 3158, recipe: 'EEEEEEEEEEEEEEE031550315603157EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 3162, recipe: 'EEEEEEEEEEEEEEE031590316003161EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 3163, recipe: '03154EEEEEEEEEEEEEEE03158EEEEEEEEEEEEEEE03162', book: 'Birthday', type: 'Standard' },
{ itemId: 3165, recipe: '03166EEEEEEEEEEEEEEE0316603166EEEEEEEEEE03166', book: 'Birthday', type: 'Standard', name: 'Birthday Gazelle Badge - 11th' },
{ itemId: 3378, recipe: '03379EEEEE03379EEEEE03379EEEEE03379EEEEE03379', book: 'Birthday', type: 'Standard' },
{ itemId: 3441, recipe: 'EEEEEEEEEEEEEEEEEEEE03444EEEEE032160341703215', book: 'Birthday', type: 'Standard' },
{ itemId: 3442, recipe: '03443EEEEEEEEEEEEEEE0344303443EEEEE0344303443', book: 'Birthday', type: 'Standard' },
{ itemId: 3513, recipe: '034900349103492034930351203494034950349603497', book: 'Birthday', type: 'Standard' },
{ itemId: 3515, recipe: 'EEEEE03513EEEEEEEEEE02627EEEEEEEEEE03514EEEEE', book: 'Birthday', type: 'Standard' },
{ itemId: 2988, recipe: 'EEEEEEEEEEEEEEE029860300002987EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
{ itemId: 2991, recipe: 'EEEEEEEEEEEEEEE029890300002990EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
{ itemId: 2992, recipe: 'EEEEEEEEEEEEEEE029880300002991EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
{ itemId: 2995, recipe: 'EEEEEEEEEEEEEEE029930300102994EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
{ itemId: 2998, recipe: 'EEEEEEEEEEEEEEE029960300102997EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
{ itemId: 2999, recipe: 'EEEEEEEEEEEEEEE029950300102998EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
{ itemId: 3143, recipe: 'EEEEE03002EEEEE03002EEEEE03002EEEEE03002EEEEE', book: 'Valentines', type: 'Standard', name: 'Vegetal Symbol' },
{ itemId: 3143, recipe: '02323EEEEE02323EEEEEEEEEEEEEEE02323EEEEE02323', book: 'Valentines', type: 'Standard', requirement: 2, name: 'Mineral Symbol' },
{ itemId: 3145, recipe: '022420224302242EEEEE02227EEEEEEEEEE02232EEEEE', book: 'Valentines', type: 'Standard', requirement: 2 },
{ itemId: 3358, recipe: '03359EEEEE03359EEEEE03359EEEEE03359EEEEE03359', book: 'Valentines', type: 'Standard', name: 'Valentine 2022 Badge' },
{ itemId: 3004, recipe: '02992EEEEE03163EEEEEEEEEEEEEEE02999EEEEE03270', book: 'Valentines', type: 'Standard' },
{ itemId: 3136, recipe: 'EEEEE03143EEEEEEEEEE03144EEEEE03145EEEEE03145', book: 'Valentines', type: 'Standard', requirement: 2 },
{ itemId: 3147, recipe: 'EEEEE02551EEEEEEEEEE03136EEEEEEEEEE03145EEEEE', book: 'Valentines', type: 'Upgrade', requirement: 2 },
{ itemId: 3148, recipe: 'EEEEE02550EEEEEEEEEE03136EEEEEEEEEE03145EEEEE', book: 'Valentines', type: 'Upgrade', requirement: 2 },
{ itemId: 3146, recipe: 'EEEEE02552EEEEEEEEEE03136EEEEEEEEEE03145EEEEE', book: 'Valentines', type: 'Upgrade', requirement: 2 },
{ itemId: 3136, recipe: 'EEEEE02653EEEEE026530314702653EEEEE02653EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2, name: "Downgrade Cupid's Winged Boots of Aggression" },
{ itemId: 3136, recipe: 'EEEEE02653EEEEE026530314802653EEEEE02653EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2, name: "Downgrade Cupid's Winged Boots of Fortune" },
{ itemId: 3136, recipe: 'EEEEE02653EEEEE026530314602653EEEEE02653EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2, name: "Downgrade Cupid's Winged Boots of Luck" },
{ itemId: 3349, recipe: '02549EEEEE02549EEEEE03348EEEEE02239EEEEE02239', book: 'Valentines', type: 'Upgrade', requirement: 2 },
{ itemId: 3352, recipe: '025490254902549EEEEE03349EEEEE022400224002240', book: 'Valentines', type: 'Upgrade', requirement: 2 },
{ itemId: 3353, recipe: '025490254902549025490335202241022410224102241', book: 'Valentines', type: 'Upgrade', requirement: 2 },
{ itemId: 3348, recipe: 'EEEEE02549EEEEEEEEEE03348EEEEEEEEEEEEEEEEEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: "Repair Cupid's Wings" },
{ itemId: 3349, recipe: 'EEEEE02549EEEEEEEEEE03349EEEEEEEEEE02239EEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: "Repair Cupid's Gold Wings" },
{ itemId: 3352, recipe: '02549EEEEE02549EEEEE03352EEEEEEEEEE02240EEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: "Repair Cupid's Mithril Wings" },
{ itemId: 3353, recipe: '025490254902549EEEEE03353EEEEEEEEEE02241EEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: "Repair Cupid's Adamantium Wings" },
{ itemId: 3364, recipe: 'EEEEE02653EEEEEEEEEE03349EEEEEEEEEE02627EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2 },
{ itemId: 3363, recipe: '02653EEEEE02653EEEEE03352EEEEE02627EEEEE02627', book: 'Valentines', type: 'Downgrade', requirement: 2 },
{ itemId: 3362, recipe: '026530265302653EEEEE03353EEEEE026270262702627', book: 'Valentines', type: 'Downgrade', requirement: 2 },
{ itemId: 3361, recipe: 'EEEEEEEEEEEEEEEEEEEE0255603360EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard', requirement: 2 },
{ itemId: 3365, recipe: '026530265302653026530336102627026270262702627', book: 'Valentines', type: 'Downgrade', requirement: 2 },
{ itemId: 2592, recipe: 'EEEEEEEEEEEEEEEEEEEE0259002591EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2593, recipe: 'EEEEEEEEEEEEEEEEEEEE0259102589EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2594, recipe: 'EEEEEEEEEEEEEEEEEEEE0258902590EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2595, recipe: 'EEEEEEEEEEEEEEE025920259302594EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2601, recipe: 'EEEEEEEEEEEEEEE026000260002600026000260002600', book: 'Halloween', type: 'Standard' },
{ itemId: 2947, recipe: 'EEEEEEEEEEEEEEEEEEEE0294502946EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2950, recipe: 'EEEEEEEEEEEEEEEEEEEE0294802949EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2951, recipe: 'EEEEEEEEEEEEEEEEEEEE0294702950EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 2953, recipe: 'EEEEEEEEEEEEEEE029520295202952029520295202952', book: 'Halloween', type: 'Standard' },
{ itemId: 3268, recipe: 'EEEEEEEEEEEEEEE0326303265EEEEEEEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 3269, recipe: 'EEEEEEEEEEEEEEE0326603267EEEEEEEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 3270, recipe: 'EEEEEEEEEEEEEEE0326803269EEEEEEEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 3264, recipe: '032810328103281EEEEEEEEEEEEEEE032810328103281', book: 'Halloween', type: 'Standard', name: 'Tombstone Badge' },
{ itemId: 3525, recipe: '03522EEEEEEEEEEEEEEE03523EEEEEEEEEEEEEEE03524', book: 'Halloween', type: 'Standard' },
{ itemId: 3521, recipe: 'EEEEE03525EEEEEEEEEEEEEEEEEEEEEEEEE03526EEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 3477, recipe: 'EEEEEEEEEEEEEEE034790347803480EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
{ itemId: 3482, recipe: '03485EEEEE03485EEEEE00126EEEEE00113EEEEE00113', book: 'Halloween', type: 'Standard' },
{ itemId: 3487, recipe: '03481EEEEEEEEEEEEEEE02523EEEEEEEEEEEEEEE03482', book: 'Halloween', type: 'Standard' },
{ itemId: 2772, recipe: 'EEEEEEEEEEEEEEEEEEEE02844EEEEEEEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2774, recipe: 'EEEEEEEEEEEEEEE028440284402844EEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2775, recipe: 'EEEEE02844EEEEEEEEEE02844EEEEEEEEEE02844EEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2776, recipe: '028440284402844EEEEEEEEEEEEEEE028440284402844', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2846, recipe: 'EEEEEEEEEEEEEEEEEEEE02841EEEEEEEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2845, recipe: 'EEEEEEEEEEEEEEEEEEEE02842EEEEEEEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2900, recipe: 'EEEEE02892EEEEE028920289202892EEEEE02892EEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2801, recipe: 'EEEEEEEEEEEEEEE028160281402816EEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2802, recipe: 'EEEEE02816EEEEE028160281402816EEEEE02816EEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2803, recipe: '028140281602814028160289402816028140281602814', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2847, recipe: 'EEEEE02813EEEEEEEEEE02813EEEEEEEEEE02813EEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2901, recipe: 'EEEEE02816EEEEE028930289302893EEEEE02813EEEEE', book: 'Adventure Club', type: 'Standard' },
{ itemId: 2712, recipe: 'EEEEEEEEEEEEEEEEEEEE0271102711EEEEEEEEEEEEEEE', book: 'Bling', type: 'Upgrade' },
{ itemId: 2713, recipe: 'EEEEE02154EEEEE021530271202155EEEEEEEEEEEEEEE', book: 'Bling', type: 'Upgrade', requirement: 2 },
{ itemId: 2714, recipe: 'EEEEE02154EEEEE021530271302155EEEEEEEEEEEEEEE', book: 'Bling', type: 'Upgrade', requirement: 2 },
{ itemId: 2554, recipe: '021550215302154022390012102243025370253702537', book: 'Bling', type: 'Standard', requirement: 2, name: 'Unity Necklace' },
{ itemId: 2584, recipe: '021550215302154022390253902243025850253702585', book: 'Bling', type: 'Standard', requirement: 2, name: 'Unity Band' },
{ itemId: 2556, recipe: '021550215302154025370213002537025370012102537', book: 'Bling', type: 'Upgrade', requirement: 2 },
{ itemId: 2555, recipe: '021550215302154025370213502537025370012102537', book: 'Bling', type: 'Upgrade', requirement: 2 },
{ itemId: 2915, recipe: '02155EEEEE02154EEEEE00121EEEEEEEEEE02153EEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
{ itemId: 2930, recipe: 'EEEEEEEEEEEEEEE0215400120EEEEEEEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
{ itemId: 2931, recipe: 'EEEEEEEEEEEEEEE0215300120EEEEEEEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
{ itemId: 2932, recipe: 'EEEEEEEEEEEEEEE0215500120EEEEEEEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
{ itemId: 2639, recipe: '025080250802508025080250802508025080250802508', book: 'Bling', type: 'Standard', requirement: 2 },
{ itemId: 2760, recipe: '025080250802508025080004602508025080250802508', book: 'Bling', type: 'Standard', requirement: 2 },
{ itemId: 2212, recipe: 'EEEEEEEEEEEEEEE000720007200072EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2, name: 'Irc Voice 8w' },
{ itemId: 2212, recipe: 'EEEEE00175EEEEE001750017500175EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2, name: 'Irc Voice 8w - Low Cost' },
{ itemId: 3368, recipe: '022120221202212022120221202212EEEEE02549EEEEE', book: 'Bling', type: 'Standard', requirement: 2, name: 'Irc Voice 1y' },
{ itemId: 2509, recipe: 'EEEEEEEEEEEEEEEEEEEE0251202508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Bronze Dwarf' },
{ itemId: 2929, recipe: 'EEEEEEEEEEEEEEEEEEEE02512EEEEE02508EEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Quartz Dwarf' },
{ itemId: 2510, recipe: 'EEEEEEEEEEEEEEEEEEEE0250902508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Bronze To Iron Dwarf' },
{ itemId: 2510, recipe: 'EEEEEEEEEEEEEEEEEEEE0292902508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Quartz To Iron Dwarf' },
{ itemId: 2511, recipe: 'EEEEEEEEEEEEEEEEEEEE0251002508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Gold Dwarf' },
{ itemId: 2928, recipe: 'EEEEEEEEEEEEEEEEEEEE02510EEEEE02508EEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Jade Dwarf' },
{ itemId: 2513, recipe: 'EEEEEEEEEEEEEEEEEEEE0251102508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Gold To Mithril Dwarf' },
{ itemId: 2513, recipe: 'EEEEEEEEEEEEEEEEEEEE0292802508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Jade To Mithril Dwarf' },
{ itemId: 2515, recipe: 'EEEEEEEEEEEEEEEEEEEE0251302508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Adamantium Dwarf' },
{ itemId: 2927, recipe: 'EEEEEEEEEEEEEEEEEEEE02513EEEEE02508EEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Amethyst Dwarf' },
{ itemId: 2524, recipe: 'EEEEEEEEEEEEEEEEEEEE0252502525EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Green Slime' },
{ itemId: 3237, recipe: '0252502524EEEEEEEEEEEEEEEEEEEEEEEEE0198702323', book: 'Pets', type: 'Standard', name: 'Rainbow Slime' },
{ itemId: 2307, recipe: '023060268902234022960230502300001260230502300', book: 'Pets', type: 'Standard' },
{ itemId: 3322, recipe: 'EEEEE03313EEEEE033130230703313EEEEE03313EEEEE', book: 'Pets', type: 'Upgrade' },
{ itemId: 3323, recipe: 'EEEEE03325EEEEE033250332203325EEEEE03325EEEEE', book: 'Pets', type: 'Upgrade' },
{ itemId: 3324, recipe: '033270332603327033260332303326033270332603327', book: 'Pets', type: 'Upgrade' },
{ itemId: 2598, recipe: 'EEEEEEEEEEEEEEEEEEEE02595EEEEE02385EEEEE02404', book: 'Pets', type: 'Standard' },
{ itemId: 2599, recipe: '02585EEEEEEEEEE025950270402836EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Ghost Billie (gold)' },
{ itemId: 2690, recipe: 'EEEEEEEEEEEEEEEEEEEE02704EEEEE02385EEEEE02404', book: 'Pets', type: 'Standard' },
{ itemId: 2691, recipe: 'EEEEE02585EEEEE025950270402836EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard' },
{ itemId: 2333, recipe: 'EEEEEEEEEEEEEEEEEEEE02836EEEEE02385EEEEE02404', book: 'Pets', type: 'Standard' },
{ itemId: 2827, recipe: 'EEEEEEEEEE02585025950270402836EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: '[Au]zelle' },
{ itemId: 3369, recipe: '029510297603029EEEEE02155EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
{ itemId: 3371, recipe: '029510297603029EEEEE02153EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
{ itemId: 3370, recipe: '029510297603029EEEEE02154EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
{ itemId: 3373, recipe: '029510297603029EEEEE03384EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
{ itemId: 3559, recipe: 'EEEEE03369EEEEEEEEEE03552EEEEE03371EEEEE03370', book: 'Pets', type: 'Standard', requirement: 2 },
{ itemId: 3605, recipe: 'EEEEE03600EEEEE03610EEEEE03604EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', name: 'InfoBot Labubu' },
{ itemId: 3606, recipe: 'EEEEEEEEEEEEEEE03605EEEEE03608EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', name: 'Sharg Labubu' },
{ itemId: 3608, recipe: 'EEEEE03607EEEEE03609EEEEE03603EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', name: 'Mario Labubu' },
{ itemId: 3615, recipe: '03622EEEEEEEEEEEEEEE03552EEEEEEEEEEEEEEE03623', book: 'Halloween', type: 'Standard', name: 'Frankenstein Labubu' },
{ itemId: 3622, recipe: '03619EEEEE03618EEEEE03621EEEEEEEEEE03617EEEEE', book: 'Halloween', type: 'Standard', name: 'Witch Key' },
{ itemId: 3623, recipe: '03620036200362003620EEEEE03620EEEEE03622EEEEE', book: 'Halloween', type: 'Standard', name: 'Zombie Key' },
{ itemId: 3626, recipe: 'EEEEEEEEEEEEEEE03616EEEEE03622EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard', name: "Witch's Hat Badge" }
];

const CATEGORIES = Array.from(new Set(Object.values(INGREDIENTS).map(({ category }) => category)));
const BOOKS = Array.from(new Set(RECIPES.map(({ book }) => book)));
const RECIPE_TYPES = Array.from(new Set(RECIPES.map(({ type }) => type)));
const ITEM_ID_MATCHER = /.{5}/g;
const recipeInfo = RECIPES.map((recipe, id) => {
const ingredientCounts = new Map();
recipe.recipe.match(ITEM_ID_MATCHER).forEach((item) => {
if (item !== 'EEEEE') {
const itemId = Number(item);
if (!ingredientCounts.has(itemId))
ingredientCounts.set(itemId, 0);
ingredientCounts.set(itemId, ingredientCounts.get(itemId) + 1);
}
});
return {
name: INGREDIENTS[recipe.itemId].name,
id: id,
category: INGREDIENTS[recipe.itemId].category,
ingredientCounts: ingredientCounts,
ingredients: [...ingredientCounts.entries()].map(([id, _]) => ({ ...INGREDIENTS[id], id: id })),
...recipe,
};
});
const ingredients = INGREDIENTS;

var loglevel$1 = {exports: {}};

/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
var loglevel = loglevel$1.exports;
var hasRequiredLoglevel;
function requireLoglevel() {
if (hasRequiredLoglevel) return loglevel$1.exports;
hasRequiredLoglevel = 1;
(function (module) {
(function (root, definition) {

if (module.exports) {
module.exports = definition();
} else {
root.log = definition();
}
})(loglevel, function () {

// Slightly dubious tricks to cut down minimized file size
var noop = function () {};
var undefinedType = "undefined";
var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
var logMethods = ["trace", "debug", "info", "warn", "error"];
var _loggersByName = {};
var defaultLogger = null;

// Cross-browser bind equivalent that works at least back to IE6
function bindMethod(obj, methodName) {
var method = obj[methodName];
if (typeof method.bind === 'function') {
return method.bind(obj);
} else {
try {
return Function.prototype.bind.call(method, obj);
} catch (e) {
// Missing bind shim or IE8 + Modernizr, fallback to wrapping
return function () {
return Function.prototype.apply.apply(method, [obj, arguments]);
};
}
}
}

// Trace() doesn't print the message in IE, so for that case we need to wrap it
function traceForIE() {
if (console.log) {
if (console.log.apply) {
console.log.apply(console, arguments);
} else {
// In old IE, native console methods themselves don't have apply().
Function.prototype.apply.apply(console.log, [console, arguments]);
}
}
if (console.trace) console.trace();
}

// Build the best logging method possible for this env
// Wherever possible we want to bind, not wrap, to preserve stack traces
function realMethod(methodName) {
if (methodName === 'debug') {
methodName = 'log';
}
if (typeof console === undefinedType) {
return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
} else if (methodName === 'trace' && isIE) {
return traceForIE;
} else if (console[methodName] !== undefined) {
return bindMethod(console, methodName);
} else if (console.log !== undefined) {
return bindMethod(console, 'log');
} else {
return noop;
}
}

// These private functions always need `this` to be set properly

function replaceLoggingMethods() {
/*jshint validthis:true */
var level = this.getLevel();

// Replace the actual methods.
for (var i = 0; i < logMethods.length; i++) {
var methodName = logMethods[i];
this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
}

// Define log.log as an alias for log.debug
this.log = this.debug;

// Return any important warnings.
if (typeof console === undefinedType && level < this.levels.SILENT) {
return "No console available for logging";
}
}

// In old IE versions, the console isn't present until you first open it.
// We build realMethod() replacements here that regenerate logging methods
function enableLoggingWhenConsoleArrives(methodName) {
return function () {
if (typeof console !== undefinedType) {
replaceLoggingMethods.call(this);
this[methodName].apply(this, arguments);
}
};
}

// By default, we use closely bound real methods wherever possible, and
// otherwise we wait for a console to appear, and then try again.
function defaultMethodFactory(methodName, _level, _loggerName) {
/*jshint validthis:true */
return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
}
function Logger(name, factory) {
// Private instance variables.
var self = this;
/**
* The level inherited from a parent logger (or a global default). We
* cache this here rather than delegating to the parent so that it stays
* in sync with the actual logging methods that we have installed (the
* parent could change levels but we might not have rebuilt the loggers
* in this child yet).
* @type {number}
*/
var inheritedLevel;
/**
* The default level for this logger, if any. If set, this overrides
* `inheritedLevel`.
* @type {number|null}
*/
var defaultLevel;
/**
* A user-specific level for this logger. If set, this overrides
* `defaultLevel`.
* @type {number|null}
*/
var userLevel;
var storageKey = "loglevel";
if (typeof name === "string") {
storageKey += ":" + name;
} else if (typeof name === "symbol") {
storageKey = undefined;
}
function persistLevelIfPossible(levelNum) {
var levelName = (logMethods[levelNum] || 'silent').toUpperCase();
if (typeof window === undefinedType || !storageKey) return;

// Use localStorage if available
try {
window.localStorage[storageKey] = levelName;
return;
} catch (ignore) {}

// Use session cookie as fallback
try {
window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
} catch (ignore) {}
}
function getPersistedLevel() {
var storedLevel;
if (typeof window === undefinedType || !storageKey) return;
try {
storedLevel = window.localStorage[storageKey];
} catch (ignore) {}

// Fallback to cookies if local storage gives us nothing
if (typeof storedLevel === undefinedType) {
try {
var cookie = window.document.cookie;
var cookieName = encodeURIComponent(storageKey);
var location = cookie.indexOf(cookieName + "=");
if (location !== -1) {
storedLevel = /^([^;]+)/.exec(cookie.slice(location + cookieName.length + 1))[1];
}
} catch (ignore) {}
}

// If the stored level is not valid, treat it as if nothing was stored.
if (self.levels[storedLevel] === undefined) {
storedLevel = undefined;
}
return storedLevel;
}
function clearPersistedLevel() {
if (typeof window === undefinedType || !storageKey) return;

// Use localStorage if available
try {
window.localStorage.removeItem(storageKey);
} catch (ignore) {}

// Use session cookie as fallback
try {
window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
} catch (ignore) {}
}
function normalizeLevel(input) {
var level = input;
if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
level = self.levels[level.toUpperCase()];
}
if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
return level;
} else {
throw new TypeError("log.setLevel() called with invalid level: " + input);
}
}

/*
*
* Public logger API - see https://github.com/pimterry/loglevel for details
*
*/

self.name = name;
self.levels = {
"TRACE": 0,
"DEBUG": 1,
"INFO": 2,
"WARN": 3,
"ERROR": 4,
"SILENT": 5
};
self.methodFactory = factory || defaultMethodFactory;
self.getLevel = function () {
if (userLevel != null) {
return userLevel;
} else if (defaultLevel != null) {
return defaultLevel;
} else {
return inheritedLevel;
}
};
self.setLevel = function (level, persist) {
userLevel = normalizeLevel(level);
if (persist !== false) {
// defaults to true
persistLevelIfPossible(userLevel);
}

// NOTE: in v2, this should call rebuild(), which updates children.
return replaceLoggingMethods.call(self);
};
self.setDefaultLevel = function (level) {
defaultLevel = normalizeLevel(level);
if (!getPersistedLevel()) {
self.setLevel(level, false);
}
};
self.resetLevel = function () {
userLevel = null;
clearPersistedLevel();
replaceLoggingMethods.call(self);
};
self.enableAll = function (persist) {
self.setLevel(self.levels.TRACE, persist);
};
self.disableAll = function (persist) {
self.setLevel(self.levels.SILENT, persist);
};
self.rebuild = function () {
if (defaultLogger !== self) {
inheritedLevel = normalizeLevel(defaultLogger.getLevel());
}
replaceLoggingMethods.call(self);
if (defaultLogger === self) {
for (var childName in _loggersByName) {
_loggersByName[childName].rebuild();
}
}
};

// Initialize all the internal levels.
inheritedLevel = normalizeLevel(defaultLogger ? defaultLogger.getLevel() : "WARN");
var initialLevel = getPersistedLevel();
if (initialLevel != null) {
userLevel = normalizeLevel(initialLevel);
}
replaceLoggingMethods.call(self);
}

/*
*
* Top-level API
*
*/

defaultLogger = new Logger();
defaultLogger.getLogger = function getLogger(name) {
if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
throw new TypeError("You must supply a name when creating a logger.");
}
var logger = _loggersByName[name];
if (!logger) {
logger = _loggersByName[name] = new Logger(name, defaultLogger.methodFactory);
}
return logger;
};

// Grab the current global log variable in case of overwrite
var _log = typeof window !== undefinedType ? window.log : undefined;
defaultLogger.noConflict = function () {
if (typeof window !== undefinedType && window.log === defaultLogger) {
window.log = _log;
}
return defaultLogger;
};
defaultLogger.getLoggers = function getLoggers() {
return _loggersByName;
};

// ES6 default export, for compatibility
defaultLogger['default'] = defaultLogger;
return defaultLogger;
});
})(loglevel$1);
return loglevel$1.exports;
}

var loglevelExports = requireLoglevel();
var log = /*@__PURE__*/getDefaultExportFromCjs(loglevelExports);

var loglevelPluginPrefix$1 = {exports: {}};

var loglevelPluginPrefix = loglevelPluginPrefix$1.exports;
var hasRequiredLoglevelPluginPrefix;
function requireLoglevelPluginPrefix() {
if (hasRequiredLoglevelPluginPrefix) return loglevelPluginPrefix$1.exports;
hasRequiredLoglevelPluginPrefix = 1;
(function (module) {
(function (root, factory) {
if (module.exports) {
module.exports = factory();
} else {
root.prefix = factory(root);
}
})(loglevelPluginPrefix, function (root) {

var merge = function (target) {
var i = 1;
var length = arguments.length;
var key;
for (; i < length; i++) {
for (key in arguments[i]) {
if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
target[key] = arguments[i][key];
}
}
}
return target;
};
var defaults = {
template: '[%t] %l:',
levelFormatter: function (level) {
return level.toUpperCase();
},
nameFormatter: function (name) {
return name || 'root';
},
timestampFormatter: function (date) {
return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
},
format: undefined
};
var loglevel;
var configs = {};
var reg = function (rootLogger) {
if (!rootLogger || !rootLogger.getLogger) {
throw new TypeError('Argument is not a root logger');
}
loglevel = rootLogger;
};
var apply = function (logger, config) {
if (!logger || !logger.setLevel) {
throw new TypeError('Argument is not a logger');
}

/* eslint-disable vars-on-top */
var originalFactory = logger.methodFactory;
var name = logger.name || '';
var parent = configs[name] || configs[''] || defaults;
/* eslint-enable vars-on-top */

function methodFactory(methodName, logLevel, loggerName) {
var originalMethod = originalFactory(methodName, logLevel, loggerName);
var options = configs[loggerName] || configs[''];
var hasTimestamp = options.template.indexOf('%t') !== -1;
var hasLevel = options.template.indexOf('%l') !== -1;
var hasName = options.template.indexOf('%n') !== -1;
return function () {
var content = '';
var length = arguments.length;
var args = Array(length);
var key = 0;
for (; key < length; key++) {
args[key] = arguments[key];
}

// skip the root method for child loggers to prevent duplicate logic
if (name || !configs[loggerName]) {
/* eslint-disable vars-on-top */
var timestamp = options.timestampFormatter(new Date());
var level = options.levelFormatter(methodName);
var lname = options.nameFormatter(loggerName);
/* eslint-enable vars-on-top */

if (options.format) {
content += options.format(level, lname, timestamp);
} else {
content += options.template;
if (hasTimestamp) {
content = content.replace(/%t/, timestamp);
}
if (hasLevel) content = content.replace(/%l/, level);
if (hasName) content = content.replace(/%n/, lname);
}
if (args.length && typeof args[0] === 'string') {
// concat prefix with first argument to support string substitutions
args[0] = content + ' ' + args[0];
} else {
args.unshift(content);
}
}
originalMethod.apply(undefined, args);
};
}
if (!configs[name]) {
logger.methodFactory = methodFactory;
}

// for remove inherited format option if template option preset
config = config || {};
if (config.template) config.format = undefined;
configs[name] = merge({}, parent, config);
logger.setLevel(logger.getLevel());
if (!loglevel) {
logger.warn('It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md');
}
return logger;
};
var api = {
reg: reg,
apply: apply
};
var save;
if (root) {
save = root.prefix;
api.noConflict = function () {
if (root.prefix === api) {
root.prefix = save;
}
return api;
};
}
return api;
});
})(loglevelPluginPrefix$1);
return loglevelPluginPrefix$1.exports;
}

var loglevelPluginPrefixExports = requireLoglevelPluginPrefix();
var prefix = /*@__PURE__*/getDefaultExportFromCjs(loglevelPluginPrefixExports);

const TEMPLATE_PLACEHOLDERS = {
prefix: '%c%p%c',
timestamp: '%c[%t]%c',
logLevel: '%c%l%c',
name: '%c(%n)%c',
};
const SCRIPT_PREFIX = '[Quick Crafter]';
const MESSAGE_TEMPLATE = `${TEMPLATE_PLACEHOLDERS.prefix}${TEMPLATE_PLACEHOLDERS.name} ${TEMPLATE_PLACEHOLDERS.logLevel}:%c`;
const backgroundStyled = (backgroundColor, color) => `background-color:${backgroundColor};color:${color};border-radius:2px;padding:2px`;
const colors = {
prefix: backgroundStyled('darkolivegreen', 'white'),
timestamp: 'color:gray',
logLevel: (methodName, _, __) => {
switch (methodName) {
case 'trace':
return 'color:magenta';
case 'debug':
return 'color:cyan';
case 'info':
return '';
case 'warn':
return 'color:yellow';
case 'error':
return 'color:red';
}
},
name: backgroundStyled('darkolivegreen', 'white'),
message: (_, __, loggerName) => {
switch (loggerName) {
case 'critical':
return 'color:red;font-weight:bold';
case 'GM Mock':
return backgroundStyled('chocolate', 'black');
default:
return '';
}
},
};
log.setDefaultLevel('INFO');
prefix.reg(log);
prefix.apply(log, {
template: MESSAGE_TEMPLATE.replace(/%p/, SCRIPT_PREFIX),
levelFormatter(level) {
return level.toLocaleUpperCase();
},
nameFormatter(name) {
return name || 'root';
},
timestampFormatter(date) {
return date.toISOString();
},
});
const placeholderIndex = (type) => {
return [type, MESSAGE_TEMPLATE.indexOf(TEMPLATE_PLACEHOLDERS[type])];
};
const placeholderOrder = new Map([
placeholderIndex('prefix'),
placeholderIndex('timestamp'),
placeholderIndex('logLevel'),
placeholderIndex('name'),
['message', MESSAGE_TEMPLATE.match(/(?<!%\w)%c$/) ? 999 : -1],
].sort(([_, aIndex], [__, bIndex]) => aIndex - bIndex));
// Supplement above formatter with browser css color args
const originalFactory = log.methodFactory;
log.methodFactory = function addCssColors(methodName, logLevel, loggerName) {
const rawMethod = originalFactory(methodName, logLevel, loggerName);
const colorArgs = [];
for (let [key, value] of placeholderOrder) {
if (!!~value) {
const colorVal = colors[key];
const colorArg = typeof colorVal === 'string' ? colorVal : colorVal(methodName, logLevel, loggerName);
if (key === 'message') {
colorArgs.push(colorArg);
}
else {
colorArgs.push(colorArg, '');
}
}
}
return function colorTemplate(...messages) {
rawMethod(messages.shift(), ...colorArgs, ...messages);
};
};

var _GazelleApi_instances, _GazelleApi_key, _GazelleApi_limiter, _GazelleApi_log, _GazelleApi_sleep, _GazelleApi_fetchAndRetryIfNecessary, _GazelleApi_acquireToken;
const API_THROTTLE_WINDOW_MILLLIS = 10000;
const MAX_QUERIES_PER_WINDOW = 5;
const BACKOFF_TIME_MILLIS = 2000;
const isFailureResponse = (response) => response.status === 'failure';
class GazelleApi {
constructor(apiKey) {
_GazelleApi_instances.add(this);
_GazelleApi_key.set(this, void 0);
_GazelleApi_limiter.set(this, void 0);
_GazelleApi_log.set(this, void 0);
__classPrivateFieldSet(this, _GazelleApi_key, apiKey, "f");
__classPrivateFieldSet(this, _GazelleApi_log, log.getLogger('API'), "f");
__classPrivateFieldSet(this, _GazelleApi_limiter, new RateLimiter({
tokensPerInterval: MAX_QUERIES_PER_WINDOW,
interval: API_THROTTLE_WINDOW_MILLLIS,
}), "f");
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Built API with throttle %d queries per %d milliseconds.', MAX_QUERIES_PER_WINDOW, API_THROTTLE_WINDOW_MILLLIS);
}
async call(data) {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Call attempt', data);
return __classPrivateFieldGet(this, _GazelleApi_instances, "m", _GazelleApi_fetchAndRetryIfNecessary).call(this, () => __classPrivateFieldGet(this, _GazelleApi_instances, "m", _GazelleApi_acquireToken).call(this, () => {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Call executing fetch', data);
return fetch('/api.php?' + new URLSearchParams(data).toString(), {
method: 'GET',
headers: {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'X-API-Key': __classPrivateFieldGet(this, _GazelleApi_key, "f"),
},
});
}));
}
async unequip(equipid) {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Unequipping equipment id', equipid);
return await this.call({ request: 'items', type: 'unequip', equipid: String(equipid) })
.then((response) => response.json())
.then((response) => {
if (isFailureResponse(response)) {
const fail = `Failed to unequip equip id ${equipid}: ${response.error}`;
__classPrivateFieldGet(this, _GazelleApi_log, "f").error(fail);
throw fail;
}
return true;
});
}
async equip(equipid) {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Equipping equipment id', equipid);
return await this.call({ request: 'items', type: 'equip', equipid: String(equipid) })
.then((response) => response.json())
.then((response) => {
if (isFailureResponse(response)) {
const fail = `Failed to re-equip equip id ${equipid}: ${response.error}`;
__classPrivateFieldGet(this, _GazelleApi_log, "f").error(fail);
throw fail;
}
return true;
});
}
// Caller needs:
// window.noty({type: 'error', text: 'Quick Crafting loading inventory failed. Please check logs and reload.'});
async getInventoryCounts() {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Getting inventory counts');
return await this.call({ request: 'items', type: 'inventory' })
.then((response) => response.json())
.then((response) => {
if (isFailureResponse(response)) {
const fail = 'Loading inventory failed';
__classPrivateFieldGet(this, _GazelleApi_log, "f").error(fail);
throw fail;
}
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Got inventory', response.response);
return new Map(response.response
.filter(({ equipid }) => !(equipid && Number(equipid)))
.map(({ itemid, amount }) => [Number(itemid), Number(amount)]));
});
}
async getEquippedIds() {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Getting equipment IDs');
return await this.call({ request: 'items', type: 'users_equipped' })
.then((response) => response.json())
.then((response) => {
if (isFailureResponse(response)) {
const fail = 'Loading equipped IDs failed.';
__classPrivateFieldGet(this, _GazelleApi_log, "f").error(fail);
throw fail;
}
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Got equipment IDs', response.response);
return response.response.map(({ equipid }) => Number(equipid));
});
}
async getEquipmentInfo() {
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Getting equipment info');
const equippedIds = (await this.getEquippedIds()) || [];
return await this.call({ request: 'items', type: 'users_equippable' })
.then((response) => response.json())
.then((response) => {
if (isFailureResponse(response)) {
const fail = 'Loading equipment Info failed.';
__classPrivateFieldGet(this, _GazelleApi_log, "f").error(fail);
throw fail;
}
__classPrivateFieldGet(this, _GazelleApi_log, "f").debug('Got equipment info', response.response);
return response.response
.filter(({ itemid }) => itemid in ingredients)
.map(({ itemid, id, experience, timeUntilBreak }) => ({
itemId: Number(itemid),
id: Number(id),
experience: Number(experience),
equipLife: ingredients[Number(itemid)].equipLife,
equipped: equippedIds.includes(Number(id)),
...(timeUntilBreak !== 'Null' ? { timeUntilBreak: Number(timeUntilBreak) } : {}),
}))
.sort(({ id: idA }, { id: idB }) => idA - idB)
.reduce((grouped, equip) => {
if (!grouped.has(equip.itemId))
grouped.set(equip.itemId, []);
grouped.get(equip.itemId).push(equip);
return grouped;
}, new Map());
});
}
}
_GazelleApi_key = new WeakMap(), _GazelleApi_limiter = new WeakMap(), _GazelleApi_log = new WeakMap(), _GazelleApi_instances = new WeakSet(), _GazelleApi_sleep = async function _GazelleApi_sleep(millisToSleep) {
await new Promise((resolve) => setTimeout(resolve, millisToSleep));
}, _GazelleApi_fetchAndRetryIfNecessary = async function _GazelleApi_fetchAndRetryIfNecessary(callFn) {
const response = await callFn();
if (response.status === 429) {
await __classPrivateFieldGet(this, _GazelleApi_instances, "m", _GazelleApi_sleep).call(this, BACKOFF_TIME_MILLIS);
return __classPrivateFieldGet(this, _GazelleApi_instances, "m", _GazelleApi_fetchAndRetryIfNecessary).call(this, callFn);
}
return response;
}, _GazelleApi_acquireToken = async function _GazelleApi_acquireToken(fn) {
if (__classPrivateFieldGet(this, _GazelleApi_limiter, "f").tryRemoveTokens(1)) {
return fn();
}
else {
await __classPrivateFieldGet(this, _GazelleApi_instances, "m", _GazelleApi_sleep).call(this, API_THROTTLE_WINDOW_MILLLIS);
return __classPrivateFieldGet(this, _GazelleApi_instances, "m", _GazelleApi_acquireToken).call(this, fn);
}
};

function r(e) {
var t,
f,
n = "";
if ("string" == typeof e || "number" == typeof e) n += e;else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);else for (t in e) e[t] && (n && (n += " "), n += t);
return n;
}
function clsx() {
for (var e, t, f = 0, n = ""; f < arguments.length;) (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
return n;
}

const IsCraftingContext = React.createContext({ isCrafting: undefined, setIsCrafting: () => { } });

function isGMValue(value) {
const type = typeof value;
return type === 'string' || type === 'number' || type === 'boolean';
}
async function getGMStorageValue(key, defaultValue) {
// getting stored value
const saved = await GM.getValue(key);
let initial;
if (saved !== undefined) {
if (typeof saved === 'string') {
try {
initial = JSON.parse(saved);
}
catch (e) {
initial = saved;
}
}
else {
initial = saved;
}
}
return initial === undefined ? defaultValue : initial;
}
async function setGMStorageValue(key, value) {
if (value === undefined) {
await GM.deleteValue(key);
}
else {
await GM.setValue(key, isGMValue(value) ? value : JSON.stringify(value));
}
}
const useAsyncGMStorage = (key, defaultValue) => {
const [value, setValue] = React.useState(defaultValue);
const fetched = React.useRef(false);
// Fetch theh value once asynchronously
React.useEffect(() => {
getGMStorageValue(key, defaultValue).then((ret) => {
if (ret !== value)
setValue(ret);
// Prevent setting the value on initial render, until default has been fetched
fetched.current = true;
});
}, []);
// Update GM store on any change
React.useEffect(() => {
if (fetched.current)
setGMStorageValue(key, value);
}, [key, value]);
return [value, setValue];
};

var Sort;
(function (Sort) {
Sort["alpha"] = "Alphabetical";
Sort["gold"] = "Gold Value";
Sort["book"] = "Book Order";
Sort["book-alpha"] = "Books / Alphabetical";
Sort["book-gold"] = "Books / Gold";
})(Sort || (Sort = {}));
const GM_KEYS = {
apiKey: 'forumgames_apikey',
currentCraft: 'current-craft',
extraSpace: 'SEG',
repairEquipped: 'repair-equipped',
repairThreshold: 'repair-threshold',
selectedBooks: 'selected-books',
selectedCategories: 'selected-categories',
selectedCraftable: 'selected-craftable',
selectedTypes: 'selected-types',
search: 'search-string',
searchIngredients: 'search-ingredients',
sort: 'recipe-sort',
switchNeedHave: 'NHswitch', // TODO double check key.. if we care
};

const bookIndexName = 'book';
const categoryIndexName = 'category';
const ingredientsIndexName = 'ingredients';
const nameIndexName = 'name';
const resultIndexName = 'result';
const typeIndexName = 'type';
const normalizer = (token) => token.update((str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, ''));
lunr.Pipeline.registerFunction(normalizer, 'normalizer');
const recipeSearchIndex = lunr(function () {
this.ref('id');
this.field(nameIndexName);
this.field(resultIndexName, {
extractor: (doc) => String(doc.itemId) + ' ' + ingredients[doc.itemId].name,
});
this.field(bookIndexName);
this.field(categoryIndexName);
this.field(typeIndexName);
this.field(ingredientsIndexName, {
extractor: (doc) => doc.ingredients.map((ingredient) => ingredient.name + ' ' + ingredient.id).join(' '),
});
this.pipeline.remove(lunr.stopWordFilter);
this.pipeline.before(lunr.stemmer, normalizer);
recipeInfo.forEach((recipe) => this.add(recipe));
});
const recipeSearchHelper = {
query: function getRecipeQueryBuilder() {
let search = '';
const metadataSearch = (indexName, metadata, allMetadata) => {
if (search.length)
search += ' ';
const metadataSet = new Set(metadata);
const excludedMetadata = allMetadata.filter((data) => !metadataSet.has(data));
search += excludedMetadata.map((data) => '-' + indexName + ':' + data.split(/\s+/)[0]).join(' ');
};
return {
forText: function (text, includeIngredients) {
if (text.length) {
if (search.length)
search += ' ';
search += text
.split(/\s+/)
.map((token) => {
if (/:/.test(token))
return token;
return token.replace(/^([-+]?)(.*)$/, `$1${nameIndexName}:$2 $1${resultIndexName}:$2` +
(includeIngredients ? ` $1${ingredientsIndexName}:$2` : ''));
})
.join(' ');
}
return this;
},
inBooks: function (books) {
metadataSearch(bookIndexName, books, BOOKS);
return this;
},
inCategories: function (categories) {
metadataSearch(categoryIndexName, categories, CATEGORIES);
return this;
},
ofTypes: function (types) {
metadataSearch(typeIndexName, types, RECIPE_TYPES);
return this;
},
get: function () {
return recipeSearchIndex.search(search).map((result) => Number(result.ref));
},
};
},
};

___$insertStylesToHeader("button {\n border-radius: 3px;\n border: none;\n height: 20px;\n padding-bottom: 1px;\n padding-left: 5px;\n vertical-align: middle;\n}\n\nbutton:disabled {\n background-color: #333 !important;\n color: #666 !important;\n pointer-events: none;\n}");

function Button(props) {
const { classNameBase, additionalClassNames, text, ...htmlProps } = props;
return (React.createElement("button", { ...htmlProps, className: clsx(classNameBase, additionalClassNames) }, text));
}

___$insertStylesToHeader(".crafting-panel-filters__books-button {\n border-radius: 3px;\n border: none;\n padding: 2px 5px;\n background: gray;\n opacity: 0.4;\n}\n.crafting-panel-filters__books-button input {\n display: none;\n}\n.crafting-panel-filters__books-button--repair {\n border: 1px solid green;\n border-width: 2px;\n}\n.crafting-panel-filters__books-button--downgrade {\n border: 1px solid red;\n border-width: 2px;\n}\n.crafting-panel-filters__books-button--upgrade {\n border: 1px solid purple;\n border-width: 2px;\n}\n.crafting-panel-filters__books-button--book-potions {\n background-color: green;\n color: white;\n}\n.crafting-panel-filters__books-button--book-glass {\n background-color: white;\n color: black;\n}\n.crafting-panel-filters__books-button--book-material-bars {\n background-color: purple;\n color: white;\n}\n.crafting-panel-filters__books-button--book-armor {\n background-color: darkblue;\n color: white;\n}\n.crafting-panel-filters__books-button--book-xmas-crafting {\n background-color: red;\n color: lightgreen;\n}\n.crafting-panel-filters__books-button--book-jewelry {\n background-color: deeppink;\n color: white;\n}\n.crafting-panel-filters__books-button--book-food {\n background-color: wheat;\n color: black;\n}\n.crafting-panel-filters__books-button--book-halloween {\n background-color: gray;\n color: black;\n}\n.crafting-panel-filters__books-button--book-trading-decks {\n background-color: #15273f;\n color: white;\n}\n.crafting-panel-filters__books-button--book-bling {\n background-color: gold;\n color: darkgray;\n}\n.crafting-panel-filters__books-button--book-weapons {\n background-color: darkred;\n color: white;\n}\n.crafting-panel-filters__books-button--book-recasting {\n background-color: gray;\n color: white;\n}\n.crafting-panel-filters__books-button--book-adventure-club {\n background-color: yellow;\n color: black;\n}\n.crafting-panel-filters__books-button--book-birthday {\n background-color: darkgray;\n color: gold;\n}\n.crafting-panel-filters__books-button--book-pets {\n background-color: brown;\n color: beige;\n}\n.crafting-panel-filters__books-button--book-valentines {\n background-color: pink;\n color: deeppink;\n}\n.crafting-panel-filters__books-button--on {\n opacity: 1;\n}");

___$insertStylesToHeader("");

function ToggleableButton(props) {
const { additionalClassNames, selectedChanged, selected, ...otherProps } = props;
function click(e) {
selectedChanged && selectedChanged(!selected);
otherProps.onClick && otherProps.onClick(e);
}
return (React.createElement(Button, { ...otherProps, additionalClassNames: clsx(additionalClassNames, props.classNameBase + (selected ? '--on' : '--off')), onClick: click }));
}

function BookButton(props) {
const base = 'crafting-panel-filters__books-button';
const { book, ...otherProps } = props;
return (React.createElement(ToggleableButton, { ...otherProps, additionalClassNames: base + '--book-' + props.book.toLocaleLowerCase().replace(/ /g, '-'), classNameBase: base, text: props.book }));
}

___$insertStylesToHeader(".crafting-panel-actions__max-craft-button {\n border-radius: 3px;\n border: none;\n padding: 2px 5px;\n background: gray;\n margin-left: 2rem;\n background-color: orange;\n}\n.crafting-panel-actions__max-craft-button--confirm {\n background-color: red;\n}");

var ConfirmState;
(function (ConfirmState) {
ConfirmState["DEFAULT"] = "Craft Maximum";
ConfirmState["CONFIRM"] = "** CONFIRM **";
ConfirmState["CRAFTING"] = "-- Crafting --";
})(ConfirmState || (ConfirmState = {}));
function MaxCraftButton(props) {
const base = 'crafting-panel-actions__max-craft-button';
const [state, setState] = React.useState(ConfirmState.DEFAULT);
const isCraftingContext = React.useContext(IsCraftingContext);
const { additionalClassNames, executeCraft, setMaxCraft, onClick, ...otherProps } = props;
React.useEffect(() => {
if (!isCraftingContext.isCrafting)
setState(ConfirmState.DEFAULT);
}, [isCraftingContext.isCrafting]);
function click(e) {
onClick && onClick(e);
if (state === ConfirmState.DEFAULT) {
setState(ConfirmState.CONFIRM);
setMaxCraft();
}
else if (state === ConfirmState.CONFIRM) {
setState(ConfirmState.CRAFTING);
executeCraft();
}
}
return (React.createElement(Button, { ...otherProps, additionalClassNames: clsx(additionalClassNames, state === ConfirmState.CONFIRM && base + '--confirm'), classNameBase: base, text: state.toString(), onClick: click }));
}

___$insertStylesToHeader(".recipes__recipe {\n border-radius: 3px;\n border: none;\n padding: 2px 5px;\n background: gray;\n border: 2px solid transparent;\n}\n.recipes__recipe--repair {\n border: 1px solid green;\n border-width: 2px;\n}\n.recipes__recipe--downgrade {\n border: 1px solid red;\n border-width: 2px;\n}\n.recipes__recipe--upgrade {\n border: 1px solid purple;\n border-width: 2px;\n}\n.recipes__recipe--book-potions {\n background-color: green;\n color: white;\n}\n.recipes__recipe--book-glass {\n background-color: white;\n color: black;\n}\n.recipes__recipe--book-material-bars {\n background-color: purple;\n color: white;\n}\n.recipes__recipe--book-armor {\n background-color: darkblue;\n color: white;\n}\n.recipes__recipe--book-xmas-crafting {\n background-color: red;\n color: lightgreen;\n}\n.recipes__recipe--book-jewelry {\n background-color: deeppink;\n color: white;\n}\n.recipes__recipe--book-food {\n background-color: wheat;\n color: black;\n}\n.recipes__recipe--book-halloween {\n background-color: gray;\n color: black;\n}\n.recipes__recipe--book-trading-decks {\n background-color: #15273f;\n color: white;\n}\n.recipes__recipe--book-bling {\n background-color: gold;\n color: darkgray;\n}\n.recipes__recipe--book-weapons {\n background-color: darkred;\n color: white;\n}\n.recipes__recipe--book-recasting {\n background-color: gray;\n color: white;\n}\n.recipes__recipe--book-adventure-club {\n background-color: yellow;\n color: black;\n}\n.recipes__recipe--book-birthday {\n background-color: darkgray;\n color: gold;\n}\n.recipes__recipe--book-pets {\n background-color: brown;\n color: beige;\n}\n.recipes__recipe--book-valentines {\n background-color: pink;\n color: deeppink;\n}\n.recipes__recipe input {\n display: none;\n}\n.recipes__recipe--selected {\n background-image: linear-gradient(rgba(255, 255, 255, 0.4) 0 0);\n}\n.recipes__recipe:focus {\n border: 2px solid red;\n}");

___$insertStylesToHeader(".crafting-panel-filters__books-show, .crafting-panel-filters__books-hide {\n border-radius: 3px;\n border: none;\n padding: 2px 5px;\n background: gray;\n}\n.crafting-panel-filters__books-show input, .crafting-panel-filters__books-hide input {\n display: none;\n}\n.crafting-panel-filters__books-show--selected, .crafting-panel-filters__books-hide--selected {\n opacity: 1;\n}\n.crafting-panel-filters__books-show {\n background-color: green;\n}\n.crafting-panel-filters__books-hide {\n background-color: red;\n}\n\n.recipes__recipe {\n border-radius: 3px;\n border: none;\n padding: 2px 5px;\n background: gray;\n border: 2px solid transparent;\n}\n.recipes__recipe--repair {\n border: 1px solid green;\n border-width: 2px;\n}\n.recipes__recipe--downgrade {\n border: 1px solid red;\n border-width: 2px;\n}\n.recipes__recipe--upgrade {\n border: 1px solid purple;\n border-width: 2px;\n}\n.recipes__recipe--book-potions {\n background-color: green;\n color: white;\n}\n.recipes__recipe--book-glass {\n background-color: white;\n color: black;\n}\n.recipes__recipe--book-material-bars {\n background-color: purple;\n color: white;\n}\n.recipes__recipe--book-armor {\n background-color: darkblue;\n color: white;\n}\n.recipes__recipe--book-xmas-crafting {\n background-color: red;\n color: lightgreen;\n}\n.recipes__recipe--book-jewelry {\n background-color: deeppink;\n color: white;\n}\n.recipes__recipe--book-food {\n background-color: wheat;\n color: black;\n}\n.recipes__recipe--book-halloween {\n background-color: gray;\n color: black;\n}\n.recipes__recipe--book-trading-decks {\n background-color: #15273f;\n color: white;\n}\n.recipes__recipe--book-bling {\n background-color: gold;\n color: darkgray;\n}\n.recipes__recipe--book-weapons {\n background-color: darkred;\n color: white;\n}\n.recipes__recipe--book-recasting {\n background-color: gray;\n color: white;\n}\n.recipes__recipe--book-adventure-club {\n background-color: yellow;\n color: black;\n}\n.recipes__recipe--book-birthday {\n background-color: darkgray;\n color: gold;\n}\n.recipes__recipe--book-pets {\n background-color: brown;\n color: beige;\n}\n.recipes__recipe--book-valentines {\n background-color: pink;\n color: deeppink;\n}\n.recipes__recipe input {\n display: none;\n}\n.recipes__recipe--selected {\n background-image: linear-gradient(rgba(255, 255, 255, 0.4) 0 0);\n}\n.recipes__recipe:focus {\n border: 2px solid red;\n}");

function SelectableButton(props) {
const { additionalClassNames, classNameBase, selected, ...otherProps } = props;
return (React.createElement(Button, { ...otherProps, classNameBase: classNameBase, additionalClassNames: clsx(additionalClassNames, selected && classNameBase + '--selected') }));
}

function RecipeButton(props) {
const base = 'recipes__recipe';
return (React.createElement(IsCraftingContext.Consumer, null, ({ isCrafting }) => (React.createElement(SelectableButton, { ...props, disabled: isCrafting, additionalClassNames: base + '--book-' + props.book.toLocaleLowerCase().replace(/ /g, '-'), classNameBase: base, selected: props.selected, text: props.name }))));
}

___$insertStylesToHeader("");

function Checkbox(props) {
const { prefix, suffix, className, ...htmlProps } = props;
return (React.createElement("label", { className: className },
prefix,
React.createElement("input", { ...htmlProps, className: "", type: "checkbox" }),
suffix));
}

const authKey = new URLSearchParams(document.querySelector('link[rel="alternate"]')?.href).get('authkey');
const urlBase = (customRecipe) => `/user.php?action=ajaxtakecraftingresult&recipe=${customRecipe}&auth=${authKey}`;
function take_craft(recipe) {
const craftName = recipe.name || ingredients[recipe.itemId].name;
fetch(urlBase(recipe.recipe))
.then((response) => response.json())
.then((data) => {
if (data === '{}' || data.EquipId !== '') {
unsafeWindow.noty({ type: 'success', text: `${craftName} was crafted successfully.` });
}
else {
unsafeWindow.noty({ type: 'error', text: `${craftName} failed.` });
alert(`Crafting failed. Response from server: ${data}`);
}
});
}

___$insertStylesToHeader(".crafting-panel-info__ingredient-quantity {\n display: inline-flex;\n flex-direction: row;\n}\n.crafting-panel-info__ingredient-quantity.crafting-panel-info__ingredient-quantity--swapped {\n flex-direction: row-reverse;\n}");

const defaultProps = { switchNeedHave: false };
function IngredientQuantity(propsIn) {
const props = { ...defaultProps, ...propsIn };
const base = 'crafting-panel-info__ingredient-quantity';
return (React.createElement("div", { className: clsx(base, props.switchNeedHave && base + '--swapped') },
React.createElement("span", null, props.countOnHand),
"/",
React.createElement("span", null, props.countPerCraft)));
}

var DefaultContext = {
color: undefined,
size: undefined,
className: undefined,
style: undefined,
attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) {
if (source == null) return {};
var target = _objectWithoutPropertiesLoose(source, excluded);
var key, i;
if (Object.getOwnPropertySymbols) {
var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
for (i = 0; i < sourceSymbolKeys.length; i++) {
key = sourceSymbolKeys[i];
if (excluded.indexOf(key) >= 0) continue;
if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
target[key] = source[key];
}
}
return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
if (source == null) return {};
var target = {};
for (var key in source) {
if (Object.prototype.hasOwnProperty.call(source, key)) {
if (excluded.indexOf(key) >= 0) continue;
target[key] = source[key];
}
}
return target;
}
function _extends() {
_extends = Object.assign ? Object.assign.bind() : function (target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) {
if (Object.prototype.hasOwnProperty.call(source, key)) {
target[key] = source[key];
}
}
}
return target;
};
return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
var t = Object.keys(e);
if (Object.getOwnPropertySymbols) {
var o = Object.getOwnPropertySymbols(e);
r && (o = o.filter(function (r) {
return Object.getOwnPropertyDescriptor(e, r).enumerable;
})), t.push.apply(t, o);
}
return t;
}
function _objectSpread(e) {
for (var r = 1; r < arguments.length; r++) {
var t = null != arguments[r] ? arguments[r] : {};
r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
_defineProperty(e, r, t[r]);
}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
});
}
return e;
}
function _defineProperty(obj, key, value) {
key = _toPropertyKey(key);
if (key in obj) {
Object.defineProperty(obj, key, {
value: value,
enumerable: true,
configurable: true,
writable: true
});
} else {
obj[key] = value;
}
return obj;
}
function _toPropertyKey(t) {
var i = _toPrimitive(t, "string");
return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
if ("object" != typeof t || !t) return t;
var e = t[Symbol.toPrimitive];
if (void 0 !== e) {
var i = e.call(t, r || "default");
if ("object" != typeof i) return i;
throw new TypeError("@@toPrimitive must return a primitive value.");
}
return ("string" === r ? String : Number)(t);
}
function Tree2Element(tree) {
return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
key: i
}, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
return props => /*#__PURE__*/React.createElement(IconBase, _extends({
attr: _objectSpread({}, data.attr)
}, props), Tree2Element(data.child));
}
function IconBase(props) {
var elem = conf => {
var {
attr,
size,
title
} = props,
svgProps = _objectWithoutProperties(props, _excluded);
var computedSize = size || conf.size || "1em";
var className;
if (conf.className) className = conf.className;
if (props.className) className = (className ? className + " " : "") + props.className;
return /*#__PURE__*/React.createElement("svg", _extends({
stroke: "currentColor",
fill: "currentColor",
strokeWidth: "0"
}, conf.attr, attr, svgProps, {
className: className,
style: _objectSpread(_objectSpread({
color: props.color || conf.color
}, conf.style), props.style),
height: computedSize,
width: computedSize,
xmlns: "http://www.w3.org/2000/svg"
}), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
};
return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function HiCurrencyDollar(props) {
return GenIcon({
"tag": "svg",
"attr": {
"viewBox": "0 0 20 20",
"fill": "currentColor",
"aria-hidden": "true"
},
"child": [{
"tag": "path",
"attr": {
"d": "M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
},
"child": []
}, {
"tag": "path",
"attr": {
"fillRule": "evenodd",
"d": "M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z",
"clipRule": "evenodd"
},
"child": []
}]
})(props);
}
function HiInformationCircle(props) {
return GenIcon({
"tag": "svg",
"attr": {
"viewBox": "0 0 20 20",
"fill": "currentColor",
"aria-hidden": "true"
},
"child": [{
"tag": "path",
"attr": {
"fillRule": "evenodd",
"d": "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
"clipRule": "evenodd"
},
"child": []
}]
})(props);
}

___$insertStylesToHeader(".crafting-panel-info__ingredient-shop-link {\n color: #2196f3;\n}\n.crafting-panel-info__ingredient-shop-link--purchasable {\n color: gold;\n}");

function ShopLink(props) {
const base = 'crafting-panel-info__ingredient-shop-link';
return (React.createElement("a", { className: clsx(base, props.availableInStore && base + '--purchasable'), target: "_blank", href: `/shop.php?ItemID=${props.ingredientId}` }, props.availableInStore ? React.createElement(HiCurrencyDollar, { size: "1rem" }) : React.createElement(HiInformationCircle, { size: "1rem" })));
}

___$insertStylesToHeader(".crafting-panel-info__ingredient-row {\n display: flex;\n flex-direction: row;\n gap: 0.25rem;\n align-items: center;\n align-self: center;\n}\n.crafting-panel-info__ingredient--purchasable {\n color: lightGreen;\n}");

function IngredientLine(props) {
const base = 'crafting-panel-info__ingredient';
return (React.createElement("div", { className: clsx(base + '-row', props.purchasable && base + '--purchasable'), onClick: props.click },
React.createElement(ShopLink, { ingredientId: props.id, availableInStore: props.availableInStore }),
props.name,
':',
React.createElement(IngredientQuantity, { countOnHand: props.quantityAvailable, countPerCraft: props.quantityPerCraft, switchNeedHave: props.switchNeedHave }),
props.maxCraftableWithPurchase > props.quantityAvailable / props.quantityPerCraft && (React.createElement("span", { title: "Needed for max possible crafts" },
' (',
props.maxCraftableWithPurchase * props.quantityPerCraft - props.quantityAvailable,
')'))));
}

___$insertStylesToHeader(".crafting-panel {\n display: flex;\n flex-direction: column;\n gap: 1rem;\n margin-bottom: 1rem;\n text-align: center;\n}\n.crafting-panel__title {\n margin-bottom: 0.5rem;\n}\n\n.crafting-panel-info__ingredients-header {\n align-items: center;\n margin-bottom: 0.5rem;\n}\n.crafting-panel-info__ingredients-column {\n display: flex;\n flex-direction: column;\n}\n.crafting-panel-info__ingredients-max {\n margin-bottom: 1rem;\n}\n.crafting-panel-info__ingredients-max span {\n margin-left: 5px;\n}\n\n.crafting-panel-actions {\n display: flex;\n flex-direction: row;\n gap: 0.25rem;\n text-align: center;\n align-items: center;\n align-self: center;\n margin-bottom: 1rem;\n}");

const CRAFT_TIME = 1000;
var CraftingSubmenu = (props) => {
const craftNumberSelect = React.useRef(null);
const [purchasable, setPurchasable] = React.useState([]);
async function doCraft() {
let count = Number(craftNumberSelect.current.value);
const resultId = props.recipe.itemId;
for (let i = 0; i < count; i++) {
await new Promise((resolve) => setTimeout(() => {
take_craft(props.recipe);
props.inventory.set(resultId, (props.inventory.get(resultId) || 0) + 1);
[...props.recipe.ingredientCounts.entries()].forEach(([id, count]) => props.inventory.set(id, props.inventory.get(id) - count));
resolve();
}, CRAFT_TIME));
}
}
let available = Number.MAX_SAFE_INTEGER;
for (let [id, perCraft] of props.recipe.ingredientCounts.entries()) {
const onHand = props.inventory.get(id) || 0;
const avail = Math.floor(onHand / perCraft);
if (avail < available) {
available = avail;
}
}
const maxWithPurchase = purchasable.length
? Math.min(...props.recipe.ingredients.map((ingredient) => purchasable.includes(ingredient.name)
? Number.MAX_SAFE_INTEGER
: Math.floor((props.inventory.get(ingredient.id) || 0) / props.recipe.ingredientCounts.get(ingredient.id))))
: available;
return (React.createElement(IsCraftingContext.Consumer, null, ({ isCrafting, setIsCrafting }) => {
const wrappedDoCraft = async () => {
setIsCrafting(true);
await doCraft();
setIsCrafting(false);
};
return (React.createElement("div", { className: "crafting-panel", id: "crafting-submenu" },
React.createElement("div", { className: "crafting-panel__title" },
ingredients[props.recipe.itemId].name,
props.inventory.get(props.recipe.itemId) > 0
? ` (${props.inventory.get(props.recipe.itemId)} in inventory)`
: ''),
React.createElement("div", { className: "crafting-panel-info__ingredients-header" }, "Ingredients:"),
React.createElement("div", { className: "crafting-panel-info__ingredients-column" }, [...props.recipe.ingredientCounts.entries()].map(([id, count], index) => {
const name = props.recipe.ingredients[index].name;
return (React.createElement(IngredientLine, { key: id, availableInStore: props.recipe.ingredients[index].infStock, click: () => {
if (purchasable.includes(name)) {
setPurchasable(purchasable.filter((p) => p !== name));
}
else if (purchasable.length < props.recipe.ingredients.length - 1) {
setPurchasable([...purchasable, name]);
}
}, id: id, maxCraftableWithPurchase: maxWithPurchase, name: name, purchasable: purchasable.includes(ingredients[id].name), quantityAvailable: props.inventory.get(id) || 0, quantityPerCraft: count, switchNeedHave: props.switchNeedHave }));
})),
React.createElement("span", { className: "crafting-panel-info__ingredients-max" },
"Max available craft(s): ",
available,
available !== maxWithPurchase ? (React.createElement("span", { title: "Max possible if additional ingredients are purchased" },
"(",
maxWithPurchase,
")")) : (''),
React.createElement("sup", null,
React.createElement("a", { title: "Click ingredients to mark as purchasable and calculate +purchase needed and max possible crafted." }, "?"))),
available > 0 && (React.createElement("div", { className: "crafting-panel-actions" },
React.createElement("select", { ref: craftNumberSelect, disabled: isCrafting, className: 'crafting-panel-actions__craft-number' }, Array(available)
.fill(undefined)
.map((_, i) => (React.createElement("option", { key: i, value: i + 1 }, i + 1)))),
React.createElement(Button, { disabled: isCrafting, classNameBase: "crafting-panel-actions__craft-button", onClick: wrappedDoCraft, text: "Craft" }),
React.createElement(MaxCraftButton, { disabled: isCrafting, executeCraft: wrappedDoCraft, setMaxCraft: () => craftNumberSelect.current && (craftNumberSelect.current.value = String(available)) })))));
}));
};

___$insertStylesToHeader(".credits {\n display: flex;\n flex-direction: row;\n gap: 0.25rem;\n align-items: center;\n float: right;\n margin-top: -1rem;\n margin-right: 0.25rem;\n}");

// THIS FILE IS AUTO GENERATED
function FaGithub(props){return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"},"child":[]}]})(props);}

function Credits() {
return (React.createElement("div", { className: "credits" },
React.createElement("a", { target: "_blank", href: 'github:FinalDoom/Quick_Craft.git' + 'releases/tag/v' + '3.5.4', className: "credits__version-link", title: 'Built on Fri, 03 Jan 2025 17:14:27 GMT' }, 'v' + '3.5.4'),
React.createElement("a", { target: "_blank", href: "github:FinalDoom/Quick_Craft.git", className: "credits__github-link" },
React.createElement(FaGithub, null))));
}

___$insertStylesToHeader(".crafting-panel-search {\n margin-bottom: 0.25rem;\n}\n.crafting-panel-search__searchbox-wrapper {\n position: relative;\n display: inline-flex;\n flex-grow: 1;\n align-items: center;\n max-width: 412.5px;\n}\n.crafting-panel-search__searchbox-wrapper span {\n position: absolute;\n display: block;\n right: 3px;\n width: 15px;\n height: 15px;\n border-radius: 50%;\n color: #fff;\n background-color: gray;\n opacity: 0.7;\n font: 13px monospace;\n text-align: center;\n line-height: 1em;\n cursor: pointer;\n}\n.crafting-panel-search__searchbox {\n flex-grow: 1;\n}");

function SearchBox(searchProps) {
const base = 'crafting-panel-search__searchbox';
const props = { placeholder: 'Search...', ...searchProps };
let input = null;
return (React.createElement("span", { className: base + '-wrapper' },
React.createElement("input", { className: base, defaultValue: props.initialSearch, onChange: (event) => props.changeSearch(event.target.value), placeholder: props.placeholder, ref: (el) => (input = el), role: "search", type: "search" }),
React.createElement("span", { role: "button", onClick: () => {
if (input) {
input.value = '';
input.focus();
}
props.changeSearch('');
} }, "x")));
}

___$insertStylesToHeader("#quick-crafter {\n display: block;\n margin: 0 auto 1rem;\n background-color: rgba(19, 9, 0, 0.7);\n padding: 5px;\n width: 100%;\n max-width: 1100px;\n min-width: 200px;\n}\n\n.recipe-buttons {\n display: flex;\n flex-direction: row;\n flex-wrap: wrap;\n gap: 0.25rem;\n margin-bottom: 1rem;\n}\n.recipe-buttons--book-sort {\n display: flex;\n flex-direction: column;\n}\n.recipe-buttons--book-sort.recipe-buttons--extra-space {\n gap: 1rem;\n}\n.recipe-buttons__book-section {\n display: flex;\n flex-direction: row;\n flex-wrap: wrap;\n gap: 0.25rem;\n}\n.recipe-buttons__book-section--disabled {\n display: none;\n}\n\n.crafting-panel-filters {\n display: flex;\n flex-direction: column;\n flex: 1;\n gap: 0.5rem;\n margin-bottom: 0.125rem;\n}\n.crafting-panel-filters__books {\n display: flex;\n flex-direction: column;\n gap: 0.25rem;\n}\n.crafting-panel-filters__books-row {\n display: flex;\n flex-direction: row;\n gap: 0.25rem;\n margin-top: 0.5rem;\n margin-bottom: 2rem;\n align-items: center;\n}\n\n.crafting-panel-actions__craft-row {\n display: flex;\n flex-direction: row;\n gap: 0.25rem;\n align-items: center;\n}\n\n.crafting-panel-search {\n display: flex;\n flex-direction: row;\n gap: 0.25rem;\n}");

function getSortedRecipes(filteredRecipes) {
// Sort however
filteredRecipes.sort((a, b) => {
const recipeA = recipeInfo[a];
const recipeB = recipeInfo[b];
return recipeA.book === recipeB.book
? recipeA.id - recipeB.id
: BOOKS.indexOf(recipeA.book) - BOOKS.indexOf(recipeB.book);
});
// if book sort
let currentBook;
const sortedRecipes = filteredRecipes.reduce((arr, id) => {
if (currentBook !== recipeInfo[id].book) {
arr.push([]);
currentBook = recipeInfo[id].book;
}
arr[arr.length - 1].push(id);
return arr;
}, []);
return sortedRecipes;
}
function QuickCrafter(props) {
const [currentCraft, setCurrentCraft] = useAsyncGMStorage(GM_KEYS.currentCraft, undefined);
const [isCrafting, setIsCrafting] = React.useState(false);
const [extraSpace, setExtraSpace] = useAsyncGMStorage(GM_KEYS.extraSpace, false);
const [filteredRecipes, setFilteredRecipes] = React.useState(getSortedRecipes(recipeInfo.map(({ id }) => id)));
const [inventory, setInventory] = React.useState(new Map());
const [search, setSearch] = useAsyncGMStorage(GM_KEYS.search, '');
const [searchIngredients, setSearchIngredients] = useAsyncGMStorage(GM_KEYS.searchIngredients, true);
const [selectedBooks, setSelectedBooks] = useAsyncGMStorage(GM_KEYS.selectedBooks, BOOKS);
const [switchNeedHave, setSwitchNeedHave] = useAsyncGMStorage(GM_KEYS.switchNeedHave, false);
// Fetch async state
React.useEffect(() => {
props.api.getInventoryCounts().then((inventory) => {
setInventory(inventory);
});
}, []);
// Update recipes when filters are updated
React.useEffect(() => {
try {
setFilteredRecipes(getSortedRecipes(recipeSearchHelper.query().inBooks(selectedBooks).forText(search, searchIngredients).get()));
}
catch (err) {
if (!('name' in err && err.name === 'QueryParseError'))
throw err;
}
}, [search, searchIngredients, selectedBooks]);
// Build all the recipe buttons
const recipeButtons = recipeInfo.map((recipe) => (React.createElement(RecipeButton, { key: recipe.id, book: recipe.book, onClick: () => setCurrentCraft(recipe.id), name: recipe.name, selected: currentCraft === recipe.id })));
return (React.createElement(React.StrictMode, null,
React.createElement(IsCraftingContext.Provider, { value: { isCrafting, setIsCrafting } },
currentCraft !== undefined && ( // 0 is a valid currentCraft
React.createElement(React.Fragment, null,
React.createElement(CraftingSubmenu, { inventory: inventory, recipe: recipeInfo[currentCraft], switchNeedHave: switchNeedHave }),
React.createElement(Button, { disabled: isCrafting, classNameBase: "crafting-panel-actions__clear-craft-button", onClick: () => setCurrentCraft(undefined), text: "Clear" }))),
React.createElement("div", { className: "crafting-panel-actions__craft-row" },
React.createElement("span", null, "Click on the buttons below to show or hide crafting categories - "),
React.createElement(Button, { classNameBase: "crafting-panel-filters__books-hide", onClick: () => setSelectedBooks([]), text: "Hide all" }),
React.createElement(Button, { classNameBase: "crafting-panel-filters__books-show", onClick: () => setSelectedBooks(BOOKS), text: "Show all" }),
React.createElement(Checkbox, { checked: extraSpace, onChange: (event) => setExtraSpace(event.target.checked), suffix: "Blank line between books" }),
React.createElement(Checkbox, { title: "Switches between needed/have and have/needed", checked: switchNeedHave, onChange: (event) => setSwitchNeedHave(event.target.checked), suffix: "NH switch" })),
React.createElement("div", { className: "crafting-panel-filters__books-row" }, BOOKS.map((name) => (React.createElement(BookButton, { key: name, book: name, selectedChanged: (nowSelected) => {
const currentBooks = new Set(selectedBooks);
// Hide/show book sections
if (nowSelected) {
currentBooks.add(name);
}
else {
currentBooks.delete(name);
}
setSelectedBooks([...currentBooks]);
}, selected: selectedBooks.includes(name) })))),
React.createElement("div", { className: "crafting-panel-search" },
React.createElement(SearchBox, { changeSearch: setSearch, initialSearch: search }),
React.createElement(Checkbox, { checked: searchIngredients, prefix: "Include ingredients", onChange: (event) => setSearchIngredients(event.target.checked) })),
React.createElement("div", { className: clsx('recipe-buttons recipe-buttons--book-sort', extraSpace && 'recipe-buttons--extra-space') }, filteredRecipes.map((idOrArray) => {
if (Array.isArray(idOrArray)) {
return (React.createElement("div", { key: recipeInfo[idOrArray[0]].book, className: "recipe-buttons__book-section" }, idOrArray.map((id) => recipeButtons[id])));
}
else {
return recipeButtons[idOrArray];
}
})),
React.createElement(Credits, null))));
}

/**
* Handles adding greasemonkey menu items to set logging level for the script.
*/
const buildMenu = () => {
GM.registerMenuCommand('Set Log Level to Trace', () => log.setLevel('TRACE'), 'T');
GM.registerMenuCommand('Set Log Level to Debug', () => log.setLevel('DEBUG'), 'D');
GM.registerMenuCommand('Set Log Level to Warning', () => log.setLevel('WARN'), 'W');
GM.registerMenuCommand('Set Log Level to Log', () => log.setLevel('INFO'), 'L');
GM.registerMenuCommand('Set Log Level to Error', () => log.setLevel('ERROR'), 'E');
GM.registerMenuCommand('Turn off logging', () => log.setLevel('SILENT'), 'o');
};

___$insertStylesToHeader(".crafting-clear {\n clear: both;\n margin-bottom: 1rem;\n}");

(async function () {
const log$1 = log.getLogger('index');
buildMenu();
async function getApiKey() {
const apiKey = await getGMStorageValue(GM_KEYS.apiKey, undefined);
if (apiKey)
return apiKey;
log$1.debug('Querying for API key');
const input = window.prompt(`Please input your GGn API key.
If you don't have one, please generate one from your Edit Profile page: https://gazellegames.net/user.php?action=edit.
The API key must have "Items" permission

Please disable this userscript until you have one as this prompt will continue to show until you enter one in.`);
const trimmed = input.trim();
if (/[a-f0-9]{64}/.test(trimmed)) {
log$1.debug('API key is valid length, storing');
setGMStorageValue(GM_KEYS.apiKey, trimmed);
return trimmed;
}
else {
log.getLogger('critical').error('API key entered is not valid. It must be 64 hex characters 0-9a-f.');
throw 'No API key found.';
}
}
const API = new GazelleApi(await getApiKey());
const clearDiv = document.createElement('div');
clearDiv.classList.add('crafting-clear');
const quickCrafter = document.createElement('div');
quickCrafter.id = 'quick-crafter';
document.getElementById('crafting_recipes').before(clearDiv, quickCrafter);
clientExports.createRoot(quickCrafter).render(React.createElement(QuickCrafter, { api: API }));
})();

})(React, ReactDOM, lunr);