// ==UserScript==
// @name            HWGiftHelper
// @namespace       HWGiftHelper
// @version         0.4.4
// @description     Gift helper for the game Hero Wars
// @author          FatSwan
// @license         Copyright FatSwan
// @match           https://www.hero-wars.com/*
// @match           https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/553478/HWGiftHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/553478/HWGiftHelper.meta.js
// ==/UserScript==

(function() {
const promoCodes = ['WEBHERO25','HWCENTRAL7','SOLFORS25','WINHERO25','WINNER25','SOLFORS4GINGER','SOLFORS4IRIS', 'HEROIRIS', 'ALEXANDREHERO', 'GETHERO25', 'OLYMPUS'];

function removeReCaptcha() {
    localStorage.removeItem('_grecaptcha');
}

/**
 * Start script
 */
console.log('%cStart ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
/**
 * remove reCaptcha
 */
removeReCaptcha();

/**
 * Script info
 */
this.GM_info = GM_info;

/**
 * Start time of the last battle in the company
 */
let lastMissionBattleStart = 0;

/**
 * yyyyMMdd格式的当日
 */
function getTodayString() {
    let date = new Date();
    date.setHours(date.getHours() - 4);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}
const today = getTodayString();

const i18nLangData = {
    /* English translation */
    en: {
        /* UI */
        SETTINGS: 'Settings',
        VALUES: 'Values',
        /* Checkboxes */
        /* Input fields */
        COMBAT_SPEED: 'Combat Speed Multiplier',
        /* Buttons */
        BTN_OK: 'OK',
        BTN_CANCEL: 'Cancel',
        BTN_PASS: 'PASS',

        /* Messages */
        NOTHING_TO_COLLECT: 'Nothing to collect',
        COLLECTED: 'Collected',
        REWARD: 'rewards',
        TIMER: 'Timer:',
        REPETITIONS: 'Repetitions',
		EXPEDITIONS_SENT: 'Expeditions:<br>Collected: {countGet}<br>Sent: {countSend}',
		EXPEDITIONS_NOTHING: 'Nothing to collect/send',
    },
    /* Chinese translation */
    zh_CN: {
        /* UI */
        SETTINGS: '设置',
        VALUES: '数值',
        /* Checkboxes */
        /* Input fields */
        COMBAT_SPEED: '快速战斗速度',
        /* Buttons */
        BTN_OK: 'OK',
        BTN_CANCEL: '取消',
        BTN_PASS: 'PASS',

        /* Messages */
        NOTHING_TO_COLLECT: '没有可收集的奖品',
        COLLECTED: '收集了',
        REWARD: '奖品',
        TIMER: 'Timer:',
        REPETITIONS: '重复',
		EXPEDITIONS_SENT: '远征:<br>收集: {countGet}<br>发送: {countSend}',
		EXPEDITIONS_NOTHING: '无可收集/发送远征',
    },
};

function getLang() {
    let lang = '';
    if (typeof NXFlashVars !== 'undefined') {
        lang = NXFlashVars.interface_lang
    }
    if (!lang) {
        lang = (navigator.language || navigator.userLanguage).substr(0, 2);
    }
    const { i18nLangData } = HWGData;
    if (i18nLangData[lang]) {
        return lang;
    }
    return 'en';
}

I18N_G = function (constant, replace) {
    const { i18nLangData } = HWGData;
    const selectLang = getLang();
    if (constant && constant in i18nLangData[selectLang]) {
        const result = i18nLangData[selectLang][constant];
        if (replace) {
            return result.sprintf(replace);
        }
        return result;
    }
    console.warn('Language constant not found', {constant, replace});
    if (i18nLangData['en'][constant]) {
        const result = i18nLangData[selectLang][constant];
        if (replace) {
            return result.sprintf(replace);
        }
        return result;
    }
    return `% ${constant} %`;
};

/**
 * Calculates the request signature
 *
 * Расчитывает сигнатуру запроса
 */
this.getSignature = function(headers, data) {
    const sign = {
        signature: '',
        length: 0,
        add: function (text) {
            this.signature += text;
            if (this.length < this.signature.length) {
                this.length = 3 * (this.signature.length + 1) >> 1;
            }
        },
    }
    sign.add(headers["X-Request-Id"]);
    sign.add(':');
    sign.add(headers["X-Auth-Token"]);
    sign.add(':');
    sign.add(headers["X-Auth-Session-Id"]);
    sign.add(':');
    sign.add(data);
    sign.add(':');
    sign.add('LIBRARY-VERSION=1');
    sign.add('UNIQUE-SESSION-ID=' + headers["X-Env-Unique-Session-Id"]);
    if (headers['X-Env-Unique-Session-Uuid']) {
        sign.add('UNIQUE-SESSION-UUID=' + headers['X-Env-Unique-Session-Uuid']);
    }

    return md5(sign.signature);
}

// 有输入框的popup
async function popupInputSimple(message, btnOk='OK', btnCancel='取消') {
    return await popup.confirm(
        message, 
        [
            {
                msg: btnOk,
                isInput: true,
                default: ''
            },
            {
                msg: btnCancel,
                result: false,
                isCancel: true
            },
        ]
    );
}

// 无输入框的popup
async function popupSimple(message, btnOk='OK', btnCancel='取消') {
    return await popup.confirm(
        message,
        [
            {
                msg: btnOk,
                result: true
            },
            {
                msg: btnCancel,
                result: false,
                isCancel: true
            },
        ]
    );
}


this.HWGFuncs = {
    I18N_G,
    isChecked,
    getInput,
};

this.HWGClasses = {
};

this.HWGData = {
    i18nLangData,
};

/**
 * Calculates HASH MD5 from string
 *
 * Расчитывает HASH MD5 из строки
 *
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.7.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function(){"use strict";function t(t){if(t)d[0]=d[16]=d[1]=d[2]=d[3]=d[4]=d[5]=d[6]=d[7]=d[8]=d[9]=d[10]=d[11]=d[12]=d[13]=d[14]=d[15]=0,this.blocks=d,this.buffer8=l;else if(a){var r=new ArrayBuffer(68);this.buffer8=new Uint8Array(r),this.blocks=new Uint32Array(r)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}var r="input is invalid type",e="object"==typeof window,i=e?window:{};i.JS_MD5_NO_WINDOW&&(e=!1);var s=!e&&"object"==typeof self,h=!i.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;h?i=global:s&&(i=self);var f=!i.JS_MD5_NO_COMMON_JS&&"object"==typeof module&&module.exports,o="function"==typeof define&&define.amd,a=!i.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,n="0123456789abcdef".split(""),u=[128,32768,8388608,-2147483648],y=[0,8,16,24],c=["hex","array","digest","buffer","arrayBuffer","base64"],p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),d=[],l;if(a){var A=new ArrayBuffer(68);l=new Uint8Array(A),d=new Uint32Array(A)}!i.JS_MD5_NO_NODE_JS&&Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),!a||!i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(t){return"object"==typeof t&&t.buffer&&t.buffer.constructor===ArrayBuffer});var b=function(r){return function(e){return new t(!0).update(e)[r]()}},v=function(){var r=b("hex");h&&(r=w(r)),r.create=function(){return new t},r.update=function(t){return r.create().update(t)};for(var e=0;e<c.length;++e){var i=c[e];r[i]=b(i)}return r},w=function(t){var e=eval("require('crypto')"),i=eval("require('buffer').Buffer"),s=function(s){if("string"==typeof s)return e.createHash("md5").update(s,"utf8").digest("hex");if(null===s||void 0===s)throw r;return s.constructor===ArrayBuffer&&(s=new Uint8Array(s)),Array.isArray(s)||ArrayBuffer.isView(s)||s.constructor===i?e.createHash("md5").update(new i(s)).digest("hex"):t(s)};return s};t.prototype.update=function(t){if(!this.finalized){var e,i=typeof t;if("string"!==i){if("object"!==i)throw r;if(null===t)throw r;if(a&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||a&&ArrayBuffer.isView(t)))throw r;e=!0}for(var s,h,f=0,o=t.length,n=this.blocks,u=this.buffer8;f<o;){if(this.hashed&&(this.hashed=!1,n[0]=n[16],n[16]=n[1]=n[2]=n[3]=n[4]=n[5]=n[6]=n[7]=n[8]=n[9]=n[10]=n[11]=n[12]=n[13]=n[14]=n[15]=0),e)if(a)for(h=this.start;f<o&&h<64;++f)u[h++]=t[f];else for(h=this.start;f<o&&h<64;++f)n[h>>2]|=t[f]<<y[3&h++];else if(a)for(h=this.start;f<o&&h<64;++f)(s=t.charCodeAt(f))<128?u[h++]=s:s<2048?(u[h++]=192|s>>6,u[h++]=128|63&s):s<55296||s>=57344?(u[h++]=224|s>>12,u[h++]=128|s>>6&63,u[h++]=128|63&s):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++f)),u[h++]=240|s>>18,u[h++]=128|s>>12&63,u[h++]=128|s>>6&63,u[h++]=128|63&s);else for(h=this.start;f<o&&h<64;++f)(s=t.charCodeAt(f))<128?n[h>>2]|=s<<y[3&h++]:s<2048?(n[h>>2]|=(192|s>>6)<<y[3&h++],n[h>>2]|=(128|63&s)<<y[3&h++]):s<55296||s>=57344?(n[h>>2]|=(224|s>>12)<<y[3&h++],n[h>>2]|=(128|s>>6&63)<<y[3&h++],n[h>>2]|=(128|63&s)<<y[3&h++]):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++f)),n[h>>2]|=(240|s>>18)<<y[3&h++],n[h>>2]|=(128|s>>12&63)<<y[3&h++],n[h>>2]|=(128|s>>6&63)<<y[3&h++],n[h>>2]|=(128|63&s)<<y[3&h++]);this.lastByteIndex=h,this.bytes+=h-this.start,h>=64?(this.start=h-64,this.hash(),this.hashed=!0):this.start=h}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,r=this.lastByteIndex;t[r>>2]|=u[3&r],r>=56&&(this.hashed||this.hash(),t[0]=t[16],t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.bytes<<3,t[15]=this.hBytes<<3|this.bytes>>>29,this.hash()}},t.prototype.hash=function(){var t,r,e,i,s,h,f=this.blocks;this.first?r=((r=((t=((t=f[0]-680876937)<<7|t>>>25)-271733879<<0)^(e=((e=(-271733879^(i=((i=(-1732584194^2004318071&t)+f[1]-117830708)<<12|i>>>20)+t<<0)&(-271733879^t))+f[2]-1126478375)<<17|e>>>15)+i<<0)&(i^t))+f[3]-1316259209)<<22|r>>>10)+e<<0:(t=this.h0,r=this.h1,e=this.h2,r=((r+=((t=((t+=((i=this.h3)^r&(e^i))+f[0]-680876936)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[1]-389564586)<<12|i>>>20)+t<<0)&(t^r))+f[2]+606105819)<<17|e>>>15)+i<<0)&(i^t))+f[3]-1044525330)<<22|r>>>10)+e<<0),r=((r+=((t=((t+=(i^r&(e^i))+f[4]-176418897)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[5]+1200080426)<<12|i>>>20)+t<<0)&(t^r))+f[6]-1473231341)<<17|e>>>15)+i<<0)&(i^t))+f[7]-45705983)<<22|r>>>10)+e<<0,r=((r+=((t=((t+=(i^r&(e^i))+f[8]+1770035416)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[9]-1958414417)<<12|i>>>20)+t<<0)&(t^r))+f[10]-42063)<<17|e>>>15)+i<<0)&(i^t))+f[11]-1990404162)<<22|r>>>10)+e<<0,r=((r+=((t=((t+=(i^r&(e^i))+f[12]+1804603682)<<7|t>>>25)+r<<0)^(e=((e+=(r^(i=((i+=(e^t&(r^e))+f[13]-40341101)<<12|i>>>20)+t<<0)&(t^r))+f[14]-1502002290)<<17|e>>>15)+i<<0)&(i^t))+f[15]+1236535329)<<22|r>>>10)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[1]-165796510)<<5|t>>>27)+r<<0)^r))+f[6]-1069501632)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[11]+643717713)<<14|e>>>18)+i<<0)^i))+f[0]-373897302)<<20|r>>>12)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[5]-701558691)<<5|t>>>27)+r<<0)^r))+f[10]+38016083)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[15]-660478335)<<14|e>>>18)+i<<0)^i))+f[4]-405537848)<<20|r>>>12)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[9]+568446438)<<5|t>>>27)+r<<0)^r))+f[14]-1019803690)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[3]-187363961)<<14|e>>>18)+i<<0)^i))+f[8]+1163531501)<<20|r>>>12)+e<<0,r=((r+=((i=((i+=(r^e&((t=((t+=(e^i&(r^e))+f[13]-1444681467)<<5|t>>>27)+r<<0)^r))+f[2]-51403784)<<9|i>>>23)+t<<0)^t&((e=((e+=(t^r&(i^t))+f[7]+1735328473)<<14|e>>>18)+i<<0)^i))+f[12]-1926607734)<<20|r>>>12)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[5]-378558)<<4|t>>>28)+r<<0))+f[8]-2022574463)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[11]+1839030562)<<16|e>>>16)+i<<0))+f[14]-35309556)<<23|r>>>9)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[1]-1530992060)<<4|t>>>28)+r<<0))+f[4]+1272893353)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[7]-155497632)<<16|e>>>16)+i<<0))+f[10]-1094730640)<<23|r>>>9)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[13]+681279174)<<4|t>>>28)+r<<0))+f[0]-358537222)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[3]-722521979)<<16|e>>>16)+i<<0))+f[6]+76029189)<<23|r>>>9)+e<<0,r=((r+=((h=(i=((i+=((s=r^e)^(t=((t+=(s^i)+f[9]-640364487)<<4|t>>>28)+r<<0))+f[12]-421815835)<<11|i>>>21)+t<<0)^t)^(e=((e+=(h^r)+f[15]+530742520)<<16|e>>>16)+i<<0))+f[2]-995338651)<<23|r>>>9)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[0]-198630844)<<6|t>>>26)+r<<0)|~e))+f[7]+1126891415)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[14]-1416354905)<<15|e>>>17)+i<<0)|~t))+f[5]-57434055)<<21|r>>>11)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[12]+1700485571)<<6|t>>>26)+r<<0)|~e))+f[3]-1894986606)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[10]-1051523)<<15|e>>>17)+i<<0)|~t))+f[1]-2054922799)<<21|r>>>11)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[8]+1873313359)<<6|t>>>26)+r<<0)|~e))+f[15]-30611744)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[6]-1560198380)<<15|e>>>17)+i<<0)|~t))+f[13]+1309151649)<<21|r>>>11)+e<<0,r=((r+=((i=((i+=(r^((t=((t+=(e^(r|~i))+f[4]-145523070)<<6|t>>>26)+r<<0)|~e))+f[11]-1120210379)<<10|i>>>22)+t<<0)^((e=((e+=(t^(i|~r))+f[2]+718787259)<<15|e>>>17)+i<<0)|~t))+f[9]-343485551)<<21|r>>>11)+e<<0,this.first?(this.h0=t+1732584193<<0,this.h1=r-271733879<<0,this.h2=e-1732584194<<0,this.h3=i+271733878<<0,this.first=!1):(this.h0=this.h0+t<<0,this.h1=this.h1+r<<0,this.h2=this.h2+e<<0,this.h3=this.h3+i<<0)},t.prototype.hex=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,i=this.h3;return n[t>>4&15]+n[15&t]+n[t>>12&15]+n[t>>8&15]+n[t>>20&15]+n[t>>16&15]+n[t>>28&15]+n[t>>24&15]+n[r>>4&15]+n[15&r]+n[r>>12&15]+n[r>>8&15]+n[r>>20&15]+n[r>>16&15]+n[r>>28&15]+n[r>>24&15]+n[e>>4&15]+n[15&e]+n[e>>12&15]+n[e>>8&15]+n[e>>20&15]+n[e>>16&15]+n[e>>28&15]+n[e>>24&15]+n[i>>4&15]+n[15&i]+n[i>>12&15]+n[i>>8&15]+n[i>>20&15]+n[i>>16&15]+n[i>>28&15]+n[i>>24&15]},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,i=this.h3;return[255&t,t>>8&255,t>>16&255,t>>24&255,255&r,r>>8&255,r>>16&255,r>>24&255,255&e,e>>8&255,e>>16&255,e>>24&255,255&i,i>>8&255,i>>16&255,i>>24&255]},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=this.h0,r[1]=this.h1,r[2]=this.h2,r[3]=this.h3,t},t.prototype.buffer=t.prototype.arrayBuffer,t.prototype.base64=function(){for(var t,r,e,i="",s=this.array(),h=0;h<15;)t=s[h++],r=s[h++],e=s[h++],i+=p[t>>>2]+p[63&(t<<4|r>>>4)]+p[63&(r<<2|e>>>6)]+p[63&e];return t=s[h],i+=p[t>>>2]+p[t<<4&63]+"=="};var _=v();f?module.exports=_:(i.md5=_,o&&define(function(){return _}))}();

// 创建表单对话框
function createFormDialog(titleText, inputs, callback) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('scriptMenu_text_window');

    const title = document.createElement('h4');
    title.textContent = titleText;

    // 创建表单
    const form = document.createElement('form');
    form.method = 'dialog';

    // inputs
    let inputElements = [];
    for (const i in inputs) {
        const label = document.createElement('label');
        label.textContent = inputs[i].name;

        const input = document.createElement('input');
        input.type = 'text';
        if (inputs[i].default != null) {
            input.value = inputs[i].default;
        }
        inputElements.push(input);

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
    }

    // 按钮容器
    const buttonContainer = document.createElement('div');

    const submitButton = document.createElement('button');
    submitButton.textContent = 'OK';
    submitButton.type = 'submit';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.type = 'button';
    cancelButton.onclick = function() {
        dialog.close();
        document.body.removeChild(dialog);
    };
    form.appendChild(buttonContainer);
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(cancelButton);

    // 组装对话框
    dialog.appendChild(title);
    dialog.appendChild(form);

    // 表单提交事件
    form.onsubmit = function(e) {
        e.preventDefault();
        callback(inputElements);
        dialog.close();
        document.body.removeChild(dialog);
        return false;
    };

    // 添加到页面并显示
    document.body.appendChild(dialog);
    dialog.showModal();
}

/**
 * Миксин EventEmitter
 * @param {Class} BaseClass Базовый класс (по умолчанию Object)
 * @returns {Class} Класс с методами EventEmitter
 */
const EventEmitterMixin = (BaseClass = Object) =>
    class EventEmitter extends BaseClass {
        constructor(...args) {
            super(...args);
            this._events = new Map();
        }

        /**
         * Подписаться на событие
         * @param {string} event Имя события
         * @param {function} listener Функция-обработчик
         * @returns {this} Возвращает экземпляр для чейнинга
         */
        on(event, listener) {
            if (typeof listener !== 'function') {
                throw new TypeError('Listener must be a function');
            }

            if (!this._events.has(event)) {
                this._events.set(event, new Set());
            }
            this._events.get(event).add(listener);
            return this;
        }

        /**
         * Отписаться от события
         * @param {string} event Имя события
         * @param {function} listener Функция-обработчик
         * @returns {this} Возвращает экземпляр для чейнинга
         */
        off(event, listener) {
            if (this._events.has(event)) {
                const listeners = this._events.get(event);
                listeners.delete(listener);
                if (listeners.size === 0) {
                    this._events.delete(event);
                }
            }
            return this;
        }

        /**
         * Вызвать событие
         * @param {string} event Имя события
         * @param {...any} args Аргументы для обработчиков
         * @returns {boolean} Было ли событие обработано
         */
        emit(event, ...args) {
            if (!this._events.has(event)) return false;
            const listeners = new Set(this._events.get(event));
            listeners.forEach((listener) => {
                try {
                    listener.apply(this, args);
                } catch (e) {
                    console.error(`Error in event handler for "${event}":`, e);
                }
            });

            return true;
        }

        /**
         * Подписаться на событие один раз
         * @param {string} event Имя события
         * @param {function} listener Функция-обработчик
         * @returns {this} Возвращает экземпляр для чейнинга
         */
        once(event, listener) {
            const onceWrapper = (...args) => {
                this.off(event, onceWrapper);
                listener.apply(this, args);
            };
            return this.on(event, onceWrapper);
        }

        /**
         * Удалить все обработчики для события
         * @param {string} [event] Имя события (если не указано - очистить все)
         * @returns {this} Возвращает экземпляр для чейнинга
         */
        removeAllListeners(event) {
            if (event) {
                this._events.delete(event);
            } else {
                this._events.clear();
            }
            return this;
        }

        /**
         * Получить количество обработчиков для события
         * @param {string} event Имя события
         * @returns {number} Количество обработчиков
         */
        listenerCount(event) {
            return this._events.has(event) ? this._events.get(event).size : 0;
        }
    };

this.HWGFuncs.EventEmitterMixin = EventEmitterMixin;

/**
 * Script control panel
 *
 * Панель управления скриптом
 */
class HWGScriptMenu extends EventEmitterMixin() {
    constructor() {
        if (HWGScriptMenu.instance) {
            return HWGScriptMenu.instance;
        }
        super();
        this.mainMenu = null;
        this.buttons = [];
        this.checkboxes = [];
        this.option = {
            showMenu: true,
            showDetails: {},
        };
        HWGScriptMenu.instance = this;
        return this;
    }

    static getInst() {
        if (!HWGScriptMenu.instance) {
            new HWGScriptMenu();
        }
        return HWGScriptMenu.instance;
    }

    init(option = {}) {
        this.emit('beforeInit', option);
        this.option = Object.assign(this.option, option);
        const saveOption = this.loadSaveOption();
        this.option = Object.assign(this.option, saveOption);
        this.addStyle();
        this.addBlocks();
        this.emit('afterInit', option);
    }

    addStyle() {
        const style = document.createElement('style');
        style.innerText = `
            .scriptMenu_status {
                position: absolute;
                z-index: 10001;
                top: -1px;
                left: 30%;
                cursor: pointer;
                border-radius: 0px 0px 10px 10px;
                background: #190e08e6;
                border: 1px #ce9767 solid;
                font-size: 18px;
                font-family: sans-serif;
                font-weight: 600;
                font-stretch: condensed;
                letter-spacing: 1px;
                color: #fce1ac;
                text-shadow: 0px 0px 1px;
                transition: 0.5s;
                padding: 2px 10px 3px;
            }
            .scriptMenu_statusHide {
                top: -35px;
                height: 30px;
                overflow: hidden;
            }
            .GscriptMenu_label {
                position: absolute;
                top: 30%;
                right: -4px;
                z-index: 9999;
                cursor: pointer;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, #47a41b 0%, #1a2f04 100%);
                border: 1px solid #1a2f04;
                border-radius: 5px;
                box-shadow:
                inset 0px 2px 4px #83ce26,
                inset 0px -4px 6px #1a2f04,
                0px 0px 2px black,
                0px 0px 0px 2px	#ce9767;
            }
            .GscriptMenu_label:hover {
                filter: brightness(1.2);
            }
            .scriptMenu_arrowLabel {
                width: 100%;
                height: 100%;
                background-size: 75%;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%2388cb13' d='M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z'/%3e%3cpath fill='%2388cb13' d='M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z'/%3e%3c/svg%3e");
                box-shadow: 0px 1px 2px #000;
                border-radius: 5px;
                filter: drop-shadow(0px 1px 2px #000D);
            }
            .scriptMenu_main {
                position: absolute;
                max-width: 285px;
                z-index: 9999;
                top: 40%;
                transform: translateY(-40%);
                background: #190e08e6;
                border: 1px #ce9767 solid;
                border-radius: 0px 10px 10px 0px;
                border-left: none;
                box-sizing: border-box;
                font-size: 15px;
                font-family: sans-serif;
                font-weight: 600;
                font-stretch: condensed;
                letter-spacing: 1px;
                color: #fce1ac;
                text-shadow: 0px 0px 1px;
                transition: 1s;
            }
            .scriptMenu_conteiner {
                max-height: 80vh;
                overflow: scroll;
                scrollbar-width: none; /* Для Firefox */
                -ms-overflow-style: none; /* Для Internet Explorer и Edge */
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                padding: 5px 10px 5px 5px;
            }
            .scriptMenu_conteiner::-webkit-scrollbar {
                display: none; /* Для Chrome, Safari и Opera */
            }
            .GscriptMenu_showMenu {
                display: none;
            }
            .GscriptMenu_showMenu:checked~.scriptMenu_main {
                right: 0px;
            }
            .GscriptMenu_showMenu:not(:checked)~.scriptMenu_main {
                right: -300px;
            }
            .scriptMenu_divInput {
                margin: 2px;
            }
            .scriptMenu_divInputText {
                margin: 2px;
                align-self: center;
                display: flex;
            }
            .scriptMenu_checkbox {
                position: absolute;
                z-index: -1;
                opacity: 0;
            }
            .scriptMenu_checkbox+label {
                display: inline-flex;
                align-items: center;
                user-select: none;
            }
            .scriptMenu_checkbox+label::before {
                content: '';
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 1px solid #cf9250;
                border-radius: 7px;
                margin-right: 7px;
            }
            .scriptMenu_checkbox:checked+label::before {
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2388cb13' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
            }
            .scriptMenu_close {
                width: 40px;
                height: 40px;
                position: absolute;
                right: -18px;
                top: -18px;
                border: 3px solid #c18550;
                border-radius: 20px;
                background: radial-gradient(circle, rgba(190,30,35,1) 0%, rgba(0,0,0,1) 100%);
                background-position-y: 3px;
                box-shadow: -1px 1px 3px black;
                cursor: pointer;
                box-sizing: border-box;
            }
            .scriptMenu_close:hover {
                filter: brightness(1.2);
            }
            .scriptMenu_crossClose {
                width: 100%;
                height: 100%;
                background-size: 65%;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23f4cd73' d='M 0.826 12.559 C 0.431 12.963 3.346 15.374 3.74 14.97 C 4.215 15.173 8.167 10.457 7.804 10.302 C 7.893 10.376 11.454 14.64 11.525 14.372 C 12.134 15.042 15.118 12.086 14.638 11.689 C 14.416 11.21 10.263 7.477 10.402 7.832 C 10.358 7.815 11.731 7.101 14.872 3.114 C 14.698 2.145 13.024 1.074 12.093 1.019 C 11.438 0.861 8.014 5.259 8.035 5.531 C 7.86 5.082 3.61 1.186 3.522 1.59 C 2.973 1.027 0.916 4.611 1.17 4.873 C 0.728 4.914 5.088 7.961 5.61 7.995 C 5.225 7.532 0.622 12.315 0.826 12.559 Z'/%3e%3c/svg%3e")
            }
            .scriptMenu_button {
                user-select: none;
                cursor: pointer;
                padding: 5px 14px 8px;
            }
            .scriptMenu_button:hover {
                filter: brightness(1.2);
            }
            .scriptMenu_buttonText {
                color: #fce5b7;
                text-shadow: 0px 1px 2px black;
                text-align: center;
            }
            .scriptMenu_header {
                text-align: center;
                align-self: center;
                font-size: 15px;
                margin: 0px 15px;
            }
            .scriptMenu_header a {
                color: #fce5b7;
                text-decoration: none;
            }
            .scriptMenu_InputText {
                text-align: center;
                width: 130px;
                height: 24px;
                border: 1px solid #cf9250;
                border-radius: 9px;
                background: transparent;
                color: #fce1ac;
                padding: 0px 10px;
                box-sizing: border-box;
            }
            .scriptMenu_InputText:focus {
                filter: brightness(1.2);
                outline: 0;
            }
            .scriptMenu_InputText::placeholder {
                color: #fce1ac75;
            }
            .scriptMenu_Summary {
                cursor: pointer;
                margin-left: 7px;
            }
            .scriptMenu_Details {
                align-self: center;
            }
            .scriptMenu_buttonGroup {
                display: flex;
                justify-content: center;
                user-select: none;
                cursor: pointer;
                padding: 0;
                margin: 3px 0;
            }
            .scriptMenu_buttonGroup .scriptMenu_button {
                width: 100%;
                padding: 5px 8px 8px;
            }
            .scriptMenu_mainButton {
                border-radius: 5px;
                margin: 3px 0;
            }
            .scriptMenu_combineButtonLeft {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                margin-right: 2px;
            }
            .scriptMenu_combineButtonCenter {
                border-radius: 0px;
                margin-right: 2px;
            }
            .scriptMenu_combineButtonRight {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
            .scriptMenu_beigeButton {
                border: 1px solid #442901;
                background: radial-gradient(circle, rgba(165,120,56,1) 80%, rgba(0,0,0,1) 110%);
                box-shadow: inset 0px 2px 4px #e9b282, inset 0px -4px 6px #442901, inset 0px 1px 6px #442901, inset 0px 0px 6px, 0px 0px 2px black, 0px 0px 0px 1px #ce9767;
            }
            .scriptMenu_beigeButton:active {
                box-shadow: inset 0px 4px 6px #442901, inset 0px 4px 6px #442901, inset 0px 0px 6px, 0px 0px 4px, 0px 0px 0px 1px #ce9767;
            }
            .scriptMenu_greenButton {
                border: 1px solid #1a2f04;
                background: radial-gradient(circle, #47a41b 0%, #1a2f04 150%);
                box-shadow: inset 0px 2px 4px #83ce26, inset 0px -4px 6px #1a2f04, 0px 0px 2px black, 0px 0px 0px 1px #ce9767;
            }
            .scriptMenu_greenButton:active {
                box-shadow: inset 0px 4px 6px #1a2f04, inset 0px 4px 6px #1a2f04, inset 0px 0px 6px, 0px 0px 4px, 0px 0px 0px 1px #ce9767;
            }
            .scriptMenu_redButton {
                border: 1px solid #440101;
                background: radial-gradient(circle, rgb(198, 34, 34) 80%, rgb(0, 0, 0) 110%);
                box-shadow: inset 0px 2px 4px #e98282, inset 0px -4px 6px #440101, inset 0px 1px 6px #440101, inset 0px 0px 6px, 0px 0px 2px black, 0px 0px 0px 1px #ce9767;
            }
            .scriptMenu_redButton:active {
                box-shadow: inset 0px 4px 6px #440101, inset 0px 4px 6px #440101, inset 0px 0px 6px, 0px 0px 4px, 0px 0px 0px 1px #ce9767;
            }
            .scriptMenu_attention {
                position: relative;
            }
            .scriptMenu_attention .scriptMenu_dot {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .scriptMenu_dot {
                position: absolute;
                top: -7px;
                right: -7px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #c18550;
                background: radial-gradient(circle, #f000 25%, black 100%);
                box-shadow: 0px 0px 2px black;
                background-position: 0px -1px;
                font-size: 10px;
                text-align: center;
                color: white;
                text-shadow: 1px 1px 1px black;
                box-sizing: border-box;
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    addBlocks() {
        const main = document.createElement('div');
        document.body.appendChild(main);

        this.status = document.createElement('div');
        this.status.classList.add('scriptMenu_status');
        this.setStatus('');
        main.appendChild(this.status);

        const label = document.createElement('label');
        label.classList.add('GscriptMenu_label');
        label.setAttribute('for', 'Gcheckbox_showMenu');
        main.appendChild(label);

        const arrowLabel = document.createElement('div');
        arrowLabel.classList.add('scriptMenu_arrowLabel');
        label.appendChild(arrowLabel);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'Gcheckbox_showMenu';
        checkbox.checked = this.option.showMenu;
        checkbox.classList.add('GscriptMenu_showMenu');
        checkbox.addEventListener('change', () => {
            this.option.showMenu = checkbox.checked;
            this.saveSaveOption();
        });
        main.appendChild(checkbox);

        const mainMenu = document.createElement('div');
        mainMenu.classList.add('scriptMenu_main');
        main.appendChild(mainMenu);

        this.mainMenu = document.createElement('div');
        this.mainMenu.classList.add('scriptMenu_conteiner');
        mainMenu.appendChild(this.mainMenu);

        const closeButton = document.createElement('label');
        closeButton.classList.add('scriptMenu_close');
        closeButton.setAttribute('for', 'Gcheckbox_showMenu');
        this.mainMenu.appendChild(closeButton);

        const crossClose = document.createElement('div');
        crossClose.classList.add('scriptMenu_crossClose');
        closeButton.appendChild(crossClose);
    }

    getButtonColor(color) {
        const buttonColors = {
            green: 'scriptMenu_greenButton',
            red: 'scriptMenu_redButton',
            beige: 'scriptMenu_beigeButton',
        };
        return buttonColors[color] || buttonColors['beige'];
    }

    setStatus(text, onclick) {
        if (this._currentStatusClickHandler) {
            this.status.removeEventListener('click', this._currentStatusClickHandler);
            this._currentStatusClickHandler = null;
        }

        if (!text) {
            this.status.classList.add('scriptMenu_statusHide');
            this.status.innerHTML = '';
        } else {
            this.status.classList.remove('scriptMenu_statusHide');
            this.status.innerHTML = text;
        }

        if (typeof onclick === 'function') {
            this.status.addEventListener('click', onclick, { once: true });
            this._currentStatusClickHandler = onclick;
        }
    }

    addStatus(text) {
        if (!this.status.innerHTML) {
            this.status.classList.remove('scriptMenu_statusHide');
        }
        this.status.innerHTML += text;
    }

    addHeader(text, onClick, main = this.mainMenu) {
        this.emit('beforeAddHeader', text, onClick, main);
        const header = document.createElement('div');
        header.classList.add('scriptMenu_header');
        header.innerHTML = text;
        if (typeof onClick === 'function') {
            header.addEventListener('click', onClick);
        }
        main.appendChild(header);
        this.emit('afterAddHeader', text, onClick, main);
        return header;
    }

    addButton(btn, main = this.mainMenu) {
        this.emit('beforeAddButton', btn, main);
        const { name, onClick, title, color, dot, classes = [], isCombine } = btn;
        const button = document.createElement('div');
        if (!isCombine) {
            classes.push('scriptMenu_mainButton');
        }
        button.classList.add('scriptMenu_button', this.getButtonColor(color), ...classes);
        button.title = title;
        button.addEventListener('click', onClick);
        main.appendChild(button);

        const buttonText = document.createElement('div');
        buttonText.classList.add('scriptMenu_buttonText');
        buttonText.innerText = name;
        button.appendChild(buttonText);

        if (dot) {
            const dotAtention = document.createElement('div');
            dotAtention.classList.add('scriptMenu_dot');
            dotAtention.title = dot;
            button.appendChild(dotAtention);
        }

        this.buttons.push(button);
        this.emit('afterAddButton', button, btn);
        return button;
    }

    addCombinedButton(buttonList, main = this.mainMenu) {
        this.emit('beforeAddCombinedButton', buttonList, main);
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('scriptMenu_buttonGroup');
        let count = 0;

        for (const btn of buttonList) {
            btn.isCombine = true;
            btn.classes ??= [];
            if (count === 0) {
                btn.classes.push('scriptMenu_combineButtonLeft');
            } else if (count === buttonList.length - 1) {
                btn.classes.push('scriptMenu_combineButtonRight');
            } else {
                btn.classes.push('scriptMenu_combineButtonCenter');
            }
            this.addButton(btn, buttonGroup);
            count++;
        }

        const dotAtention = document.createElement('div');
        dotAtention.classList.add('scriptMenu_dot');
        buttonGroup.appendChild(dotAtention);

        main.appendChild(buttonGroup);
        this.emit('afterAddCombinedButton', buttonGroup, buttonList);
        return buttonGroup;
    }

    addCheckbox(label, title, main = this.mainMenu) {
        this.emit('beforeAddCheckbox', label, title, main);
        const divCheckbox = document.createElement('div');
        divCheckbox.classList.add('scriptMenu_divInput');
        divCheckbox.title = title;
        main.appendChild(divCheckbox);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'scriptMenuCheckbox' + this.checkboxes.length;
        checkbox.classList.add('scriptMenu_checkbox');
        divCheckbox.appendChild(checkbox);

        const checkboxLabel = document.createElement('label');
        checkboxLabel.innerText = label;
        checkboxLabel.setAttribute('for', checkbox.id);
        divCheckbox.appendChild(checkboxLabel);

        this.checkboxes.push(checkbox);
        this.emit('afterAddCheckbox', label, title, main);
        return checkbox;
    }

    addInputText(title, placeholder, main = this.mainMenu) {
        this.emit('beforeAddCheckbox', title, placeholder, main);
        const divInputText = document.createElement('div');
        divInputText.classList.add('scriptMenu_divInputText');
        divInputText.title = title;
        main.appendChild(divInputText);

        const newInputText = document.createElement('input');
        newInputText.type = 'text';
        if (placeholder) {
            newInputText.placeholder = placeholder;
        }
        newInputText.classList.add('scriptMenu_InputText');
        divInputText.appendChild(newInputText);
        this.emit('afterAddCheckbox', title, placeholder, main);
        return newInputText;
    }

    addDetails(summaryText, name = null) {
        this.emit('beforeAddDetails', summaryText, name);
        const details = document.createElement('details');
        details.classList.add('scriptMenu_Details');
        this.mainMenu.appendChild(details);

        const summary = document.createElement('summary');
        summary.classList.add('scriptMenu_Summary');
        summary.innerText = summaryText;
        if (name) {
            details.open = this.option.showDetails[name] ?? false;
            details.dataset.name = name;
            details.addEventListener('toggle', () => {
                this.option.showDetails[details.dataset.name] = details.open;
                this.saveSaveOption();
            });
        }

        details.appendChild(summary);
        this.emit('afterAddDetails', summaryText, name);
        return details;
    }

    saveSaveOption() {
        try {
            localStorage.setItem('GscriptMenu_saveOption', JSON.stringify(this.option));
        } catch (e) {
            console.log('¯\\_(ツ)_/¯');
        }
    }

    loadSaveOption() {
        let saveOption = null;
        try {
            saveOption = localStorage.getItem('GscriptMenu_saveOption');
        } catch (e) {
            console.log('¯\\_(ツ)_/¯');
        }

        if (!saveOption) {
            return {};
        }

        try {
            saveOption = JSON.parse(saveOption);
        } catch (e) {
            return {};
        }

        return saveOption;
    }
}

this.HWGClasses.HWGScriptMenu = HWGScriptMenu;


/**
 * Game Library
 *
 * Игровая библиотека
 */
class Library {
    defaultLibUrl = 'https://heroesru-a.akamaihd.net/vk/v1101/lib/lib.json';

    constructor() {
        if (!Library.instance) {
            Library.instance = this;
        }

        return Library.instance;
    }

    async load() {
        try {
            await this.getUrlLib();
            console.log(this.defaultLibUrl);
            this.data = await fetch(this.defaultLibUrl).then(e => e.json())
        } catch (error) {
            console.error('Не удалось загрузить библиотеку', error)
        }
    }

    async getUrlLib() {
        try {
            const db = new Database('hw_cache', 'cache');
            await db.open();
            const cacheLibFullUrl = await db.get('lib/lib.json.gz', false);
            this.defaultLibUrl = cacheLibFullUrl.fullUrl.split('.gz').shift();
        } catch(e) {}
    }

    getData(id) {
        return this.data[id];
    }

    setData(data) {
        this.data = data;
    }
}

this.lib = new Library();
/**
 * Database
 *
 * База данных
 */
class Database {
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onerror = () => {
                reject(new Error(`Failed to open database ${this.dbName}`));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    async set(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);

            request.onerror = () => {
                reject(new Error(`Failed to save value with key ${key}`));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    async get(key, def) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => {
                resolve(def);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    async delete(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onerror = () => {
                reject(new Error(`Failed to delete value with key ${key}`));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }
}

/**
 * Returns the stored value
 *
 * Возвращает сохраненное значение
 */
function getSaveVal(saveName, def) {
    const result = storage.get(saveName, def);
    return result;
}
this.HWGFuncs.getSaveVal = getSaveVal;

/**
 * Stores value
 *
 * Сохраняет значение
 */
function setSaveVal(saveName, value) {
    storage.set(saveName, value);
}
this.HWGFuncs.setSaveVal = setSaveVal;

/**
 * Database initialization
 *
 * Инициализация базы данных
 */
const db = new Database(GM_info.script.name, 'settings');

/**
 * Data store
 *
 * Хранилище данных
 */
const storage = {
    userId: 0,
    /**
     * Default values
     *
     * Значения по умолчанию
     */
    values: {},
    name: GM_info.script.name,
    init: function () {
        const { checkboxes, inputs } = HWGH_UI;
        this.values = [
            ...Object.entries(checkboxes).map((e) => ({ [e[0]]: e[1].default })),
            ...Object.entries(inputs).map((e) => ({ [e[0]]: e[1].default })),
        ].reduce((acc, obj) => ({ ...acc, ...obj }), {});
    },
    get: function (key, def) {
        if (key in this.values) {
            return this.values[key];
        }
        return def;
    },
    set: function (key, value) {
        this.values[key] = value;
        db.set(this.userId, this.values).catch((e) => null);
        localStorage[this.name + ':' + key] = value;
    },
    delete: function (key) {
        delete this.values[key];
        db.set(this.userId, this.values);
        delete localStorage[this.name + ':' + key];
    },
};

/**
 * Returns all keys from localStorage that start with prefix (for migration)
 *
 * Возвращает все ключи из localStorage которые начинаются с prefix (для миграции)
 */
function getAllValuesStartingWith(prefix) {
    const values = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            const val = localStorage.getItem(key);
            const keyValue = key.split(':')[1];
            values.push({ key: keyValue, val });
        }
    }
    return values;
}

/**
 * Opens or migrates to a database
 *
 * Открывает или мигрирует в базу данных
 */
async function openOrMigrateDatabase(userId) {
    storage.init();
    storage.userId = userId;
    try {
        await db.open();
    } catch(e) {
        return;
    }
    let settings = await db.get(userId, false);

    if (settings) {
        storage.values = settings;
        return;
    }

    const values = getAllValuesStartingWith(GM_info.script.name);
    for (const value of values) {
        let val = null;
        try {
            val = JSON.parse(value.val);
        } catch {
            break;
        }
        storage.values[value.key] = val;
    }
    await db.set(userId, storage.values);
}

window.sign = a => {
    const i = this['\x78\x79\x7a'];
    return md5([i['\x6e\x61\x6d\x65'], i['\x76\x65\x72\x73\x69\x6f\x6e'], i['\x61\x75\x74\x68\x6f\x72'], ~(a % 1e3)]['\x6a\x6f\x69\x6e']('\x5f'))
}

/**
 * Sending expeditions
 */
function checkExpedition() {
	const { Expedition } = HWHClasses;
	return new Promise((resolve, reject) => {
		const expedition = new Expedition(resolve, reject);
		expedition.start();
	});
}

async function rewardsAndMailFarm() {
	try {
		const [questGetAll, mailGetAll, specialOffer, battlePassInfo, battlePassSpecial] = await Caller.send([
			'questGetAll',
			'mailGetAll',
			'specialOffer_getAll',
			'battlePass_getInfo',
			'battlePass_getSpecial',
		]);
		const questsFarm = questGetAll.filter((e) => e.state == 2);
		const mailFarm = mailGetAll?.letters || [];
		const stagesOffers = specialOffer.filter(e => e.offerType === "stagesOffer" && e.farmedStage == -1);

		const listBattlePass = battlePassInfo == null ? {} : {
            [battlePassInfo.id]: battlePassInfo.battlePass,
            ...battlePassSpecial,
		};

		for (const passId in listBattlePass) {
			const battlePass = listBattlePass[passId];
            if (battlePass == null) continue;
			const levels = Object.values(lib.data.battlePass.level).filter((x) => x.battlePass == passId);
			battlePass.level = Math.max(...levels.filter((p) => battlePass.exp >= p.experience).map((p) => p.level));
		}

		const specialQuests = lib.getData('quest').special;
		const questBattlePass = lib.getData('quest').battlePass;
		const { questChain: questChainBPass } = lib.getData('battlePass');
		const currentTime = Date.now();

		const farmCaller = new Caller();

		for (const offer of stagesOffers) {
			const offerId = offer.id;
			//const stage = 0 - offer.farmedStage;
			for (const stage of offer.offerData.stages) {
				if (stage.billingId) {
					break;
				}
				farmCaller.add({
					name: 'specialOffer_farmReward',
					args: { offerId },
				});
			}
		}

		const farmQuestIds = [];
		const questIds = [];
		for (let quest of questsFarm) {
			const questId = +quest.id;

			/*
			if ([20010001, 20010002, 20010004].includes(questId)) {
				farmCaller.add({
					name: 'questFarm',
					args: { questId },
				});
				farmQuestIds.push(questId);
				continue;
			}
			*/

			if (questId >= 2001e4 && questId < 14e8) {
				continue;
			}

			if (quest.reward?.battlePassExp && !specialQuests[questId]) {
				const questInfo = questBattlePass[questId];
				if (!questInfo) {
					continue;
				}
				const chain = questChainBPass[questInfo.chain];
				const battlePass = listBattlePass[chain.battlePass];
				if (!battlePass) {
					continue;
				}
				// Наличие золотого билета
				if (chain.requirement?.battlePassTicket && !battlePass.ticket) {
					continue;
				}
				// Соответствие требований по уровню
				if (chain.requirement?.battlePassLevel && battlePass.level < chain.requirement.battlePassLevel) {
					continue;
				}
				const startTime = battlePass.startDate * 1e3;
				const endTime = battlePass.endDate * 1e3;
				// Соответствие даты проведения
				if (startTime > currentTime || endTime < currentTime) {
					continue;
				}
			}

			if (questId >= 2e7 && questId < 14e8) {
				questIds.push(questId);
				farmQuestIds.push(questId);
				continue;
			}

			farmCaller.add({
				name: 'questFarm',
				args: { questId },
			});
			farmQuestIds.push(questId);
		}

		if (questIds.length) {
			farmCaller.add({
				name: 'quest_questsFarm',
				args: { questIds },
			});
		}

		const { Letters } = HWHClasses;
		const letterIds = Letters.filter(mailFarm);
		if (letterIds.length) {
			farmCaller.add({
				name: 'mailFarm',
				args: { letterIds },
			});
		}

		if (farmCaller.isEmpty()) {
			setProgress(I18N('NOTHING_TO_COLLECT'), true);
			return;
		}

		const farmResults = await farmCaller.send();

		let countQuests = 0;
		let countMail = 0;
		let questsIds = [];

		const questFarm = farmResults.result('questFarm', true);
		countQuests += questFarm.length;
		countQuests += questIds.length;
		countMail += Object.keys(farmResults.result('mailFarm')).length;

		const sideResult = farmResults.sideResult('questFarm', true);
		sideResult.push(...farmResults.sideResult('quest_questsFarm', true));

		for (let side of sideResult) {
			const quests = [...(side.newQuests ?? []), ...(side.quests ?? [])];
			for (let quest of quests) {
				if ((quest.id < 1e6 || (quest.id >= 2e7 && quest.id < 2001e4)) && quest.state == 2) {
					questsIds.push(quest.id);
				}
			}
		}
		questsIds = [...new Set(questsIds)];

		while (questsIds.length) {
			const recursiveCaller = new Caller();
			const newQuestIds = [];

			for (let questId of questsIds) {
				if (farmQuestIds.includes(questId)) {
					continue;
				}
				if (questId < 1e6) {
					recursiveCaller.add({
						name: 'questFarm',
						args: { questId },
					});
					farmQuestIds.push(questId);
					countQuests++;
				} else if (questId >= 2e7 && questId < 2001e4) {
					farmQuestIds.push(questId);
					newQuestIds.push(questId);
					countQuests++;
				}
			}

			if (newQuestIds.length) {
				recursiveCaller.add({
					name: 'quest_questsFarm',
					args: { questIds: newQuestIds },
				});
			}

			questsIds = [];
			if (recursiveCaller.isEmpty()) {
				break;
			}

			await recursiveCaller.send();
			const sideResult = recursiveCaller.sideResult('questFarm', true);
			sideResult.push(...recursiveCaller.sideResult('quest_questsFarm', true));

			for (let side of sideResult) {
				const quests = [...(side.newQuests ?? []), ...(side.quests ?? [])];
				for (let quest of quests) {
					if ((quest.id < 1e6 || (quest.id >= 2e7 && quest.id < 2001e4)) && quest.state == 2) {
						questsIds.push(quest.id);
					}
				}
			}
			questsIds = [...new Set(questsIds)];
		}

		setProgress(I18N('COLLECT_REWARDS_AND_MAIL', { countQuests, countMail }), true);
	} catch (error) {
		console.error('Error in questAllFarm:', error);
	}
}

async function collectAllStuff() {
    await rewardsAndMailFarm();
    await offerFarmAllReward();
    await Send('{"calls":[{"name":"subscriptionFarm","args":{},"ident":"body"},{"name":"grandFarmCoins","args":{},"ident":"grandFarmCoins"},{"name":"gacha_refill","args":{"ident":"heroGacha"},"ident":"gacha_refill"}]}');
    await mailGetAll();

    if (isServerOk(userInfo?.serverId)) {
        await Send('{"calls":[{"name":"zeppelinGiftFarm","args":{},"ident":"zeppelinGiftFarm"}]}');
    }
};

/**
 * Collect Easter eggs and event rewards
 *
 * Собрать пасхалки и награды событий
 */
function offerFarmAllReward() {
	const offerGetAllCall = '{"calls":[{"name":"offerGetAll","args":{},"ident":"offerGetAll"}]}';
	return Send(offerGetAllCall).then((data) => {
		const offerGetAll = data.results[0].result.response.filter(e => e.type == "reward" && !e?.freeRewardObtained && e.reward);
		if (!offerGetAll.length) {
			setProgress(`${I18N_G('NOTHING_TO_COLLECT')}`, true);
			return;
		}

		const calls = [];
		for (let reward of offerGetAll) {
			calls.push({
				name: "offerFarmReward",
				args: {
					offerId: reward.id
				},
				ident: "offerFarmReward_" + reward.id
			});
		}

		return Send(JSON.stringify({ calls })).then(e => {
			console.log(e);
			setProgress(`${I18N_G('COLLECTED')} ${e?.results?.length} ${I18N_G('REWARD')}`, true);
		});
	});
}

/**
 * Collect all rewards
 *
 * Собрать все награды
 */
async function questAllFarm() {
    return new Promise(function (resolve, reject) {
        let questGetAllCall = {
            calls: [{
                name: "questGetAll",
                args: {},
                ident: "body"
            }]
        }
		send(JSON.stringify(questGetAllCall), function (data) {
            let questGetAll = data.results[0].result.response;
            const questAllFarmCall = {
                calls: []
            }
            let number = 0;
            for (let quest of questGetAll) {
                if (quest.id < 1e6 && quest.state == 2) {
                    questAllFarmCall.calls.push({
                        name: "questFarm",
                        args: {
                            questId: quest.id
                        },
                        ident: `group_${number}_body`
                    });
                    number++;
                }
            }

            if (!questAllFarmCall.calls.length) {
                setProgress(`${I18N_G('COLLECTED')} ${number} ${I18N_G('REWARD')}`, true);
                resolve();
                return;
            }

			send(JSON.stringify(questAllFarmCall), function (res) {
                console.log(res);
                setProgress(`${I18N_G('COLLECTED')} ${number} ${I18N_G('REWARD')}`, true);
                resolve();
            });
        });
    })
}

/**
 * Collect all mail, except letters with energy and charges of the portal
 *
 * Собрать всю почту, кроме писем с энергией и зарядами портала
 */
function mailGetAll() {
    const getMailInfo = '{"calls":[{"name":"mailGetAll","args":{},"ident":"body"}]}';

    return Send(getMailInfo).then(dataMail => {
        const letters = dataMail.results[0]?.result?.response?.letters;
        const letterIds = [];
        for (let l in letters) {
            letterIds.push(~~letters[l].id);
        }

        if (!letterIds.length) {
            setProgress(I18N_G('NOTHING_TO_COLLECT'), true);
            return;
        }

        const calls = [
            { name: "mailFarm", args: { letterIds }, ident: "body" }
        ];

        return Send(JSON.stringify({ calls })).then(res => {
            const lettersIds = res.results[0].result.response;
            if (lettersIds) {
                const countLetters = Object.keys(lettersIds).length;
                setProgress(`Reveived ${countLetters} letters`, true);
            }
        });
    });
}

/**
 * MARK
 * Gift Helper
 */
/**
 * Creates an interface with controls
 */
function addControls() {
    popup.init();
    const { HWGScriptMenu } = HWGClasses;
    const scriptMenu = HWGScriptMenu.getInst();
    scriptMenu.init();
    scriptMenu.addHeader(GM_info.script.name);
    scriptMenu.addHeader('v' + GM_info.script.version);

    HWGH_UI.addControls();
}

// 超级用户
const isSupervisor = false;
// 激活出生服功能
const isBornSpecified = false;
// 强制转服功能(有钥匙的话花光钥匙)
const isForceChangeServer = false;

/**
 * Get the input
 */
function getInput(inputName) {
    return HWGH_UI.inputs[inputName]?.input?.value;
}

/**
 * Checks the checkbox
 */
function isChecked(checkBox) {
    return HWGH_UI.isChecked(checkBox);
}

class HWGH_UI {
    /**
     * Options
     */
    static checkboxes = {
    };

    /**
     * Input fields
     *
     * Поля ввода
     */
    static inputs = {
        userCount: {
            input: null,
            get title() { return '运行用户数量'; },
            default: "50",
        },
        userPrefix: {
            input: null,
            get title() { return '用户名'; },
            default: "hwu",
            supervisor: true,
        },
        userMail: {
            input: null,
            get title() { return '邮箱'; },
            default: "@hw.me",
            supervisor: true,
        },
        targetLevel: {
            input: null,
            get title() { return '队伍目标级别'; },
            default: "30",
            supervisor: true,
        },
        speedBattle: {
            input: null,
            get title() { return I18N_G('COMBAT_SPEED'); },
            default: 5,
            dot: true,
        },
        FPS: {
            input: null,
            title: 'FPS',
            default: 60,
            dot: true,
        },
    }

    /**
     * Buttons for Asgard boss simulation
     */
    static buttons = {
        newUser: {
            get name() { return '创建新用户'; },
            get title() { return '创建新用户'; },
            onClick: showNewUserTaskConfirm,
        },
        dailyTasks: {
            get name() { return '日常任务'; },
            get title() { return '日常任务'; },
            onClick: showDailyTaskConfirm,
        },
        giftKeys: {
            get name() { return '送钥匙'; },
            get title() { return '送钥匙'; },
            onClick: showGiftKeysConfirm,
        },
        skip: {
            get name() { return '跳过'; },
            get title() { return '跳过当前用户'; },
            onClick: skipConfirm,
        },
        stop: {
            get name() { return '停止'; },
            get title() { return '并不会马上停止,等待当前用户执行完毕后停止。'; },
            onClick: stopConfirm,
        },
        aoc: {
            get name() { return 'AoC'; },
            get title() { return 'Area of Conquest'; },
            onClick: async function () {
                const popupButtons = [
                    {
                        msg: '显示公会ID',
                        result: function () {
                            showGuildId();
                        },
                        get title() { return '显示公会ID'; },
                    },
                    {
                        msg: '加入公会',
                        result: function () {
                            confirmJoinGuild();
                        },
                        get title() { return '多个号连续加入公会'; },
                    },
                    {
                        msg: '自动登录',
                        result: function () {
                            confirmAutoLogin();
                        },
                        get title() { return '多个号连续登录并改名字,需要手动登出'; },
                    },
                    {
                        msg: '自动捐献城堡币',
                        result: function () {
                            confirmAoCAutoUpgrade();
                        },
                        get title() { return '多个号连续登录并捐献城堡币,需要手动停止'; },
                    },
                ];
                popupButtons.push({ result: false, isClose: true });
                const answer = await popup.confirm(`请选择:`, popupButtons);
                if (typeof answer === 'function') {
                    answer();
                }
            },
        },
        externalUser: {
            get name() { return '外部用户'; },
            get title() { return '外部用户功能'; },
            onClick: async function () {
                const popupButtons = [
                    {
                        msg: '连续登录(自动登出)',
                        result: function () {
                            extAutoLogin(true);
                        },
                        get title() { return '多用户连续自动登录/登出，适用于每月任务'; },
                    },
                    {
                        msg: '连续登录(手动登出)',
                        result: function () {
                            extAutoLogin(false);
                        },
                        get title() { return '多用户连续自动登录，需手动登出'; },
                    },
                    {
                        msg: '加入公会',
                        result: function () {
                            extJoinGuild();
                        },
                        get title() { return '多个号连续加入公会'; },
                    },
                ];
                popupButtons.push({ result: false, isClose: true });
                const answer = await popup.confirm(`请选择:`, popupButtons);
                if (typeof answer === 'function') {
                    answer();
                }
            },
            hide: (typeof HWExtUserVersion === 'undefined'),
        },
        decorateTreeByEmeralds: {
            get name() { return '绿宝放烟花'; },
            get title() { return '以万为单位用绿宝放烟花'; },
            onClick: decorateTreeByEmeralds,
            hide: ((typeof HWExtUserVersion === 'undefined') || !isInWinterfestPeriod()),
        },
        search: {
            get name() { return '查询'; },
            get title() { return '查询功能'; },
            onClick: async function () {
                const popupButtons = [
                    {
                        msg: '查找未完成用户',
                        result: function () {
                            findUnfinishedUser();
                        },
                        get title() { return '查找所有未完成的用户'; },
                    },
                    {
                        msg: '查找未创建用户',
                        result: function () {
                            findUncreatedUser();
                        },
                        get title() { return '查找所有未创建的用户'; },
                    },
                    {
                        msg: '查找用户的服务器ID',
                        result: function () {
                            findUsersServerId();
                        },
                        get title() { return '查找用户的服务器ID'; },
                    },
                ];
                popupButtons.push({ result: false, isClose: true });
                const answer = await popup.confirm(`请选择:`, popupButtons);
                if (typeof answer === 'function') {
                    answer();
                }
            },
        },
        other: {
            get name() { return '其他'; },
            get title() { return '其他功能'; },
            onClick: async function () {
                const popupButtons = [
                    {
                        msg: '开始记录地图路径',
                        result: function () {
                            startRecordMapRoute();
                        },
                        get title() { return '开始记录地图路径'; },
                    },
                    {
                        msg: '完成记录地图路径',
                        result: function () {
                            finishRecordMapRoute();
                        },
                        get title() { return '完成记录地图路径'; },
                    },
                    {
                        msg: '走地图',
                        result: function () {
                            routeMap();
                        },
                        get title() { return '走地图'; },
                    },
                ];
                popupButtons.push({ result: false, isClose: true });
                const answer = await popup.confirm(`请选择:`, popupButtons);
                if (typeof answer === 'function') {
                    answer();
                }
            },
        },
        temp: {
            get name() { return 'temp'; },
            get title() { return 'temp'; },
            onClick: doTemp,
            hide: true,
        },
    }

    /**
     * Add UI for Asgard boss simulation
     */
    static addControls() {
        const scriptMenu = HWGScriptMenu.getInst();
        const checkboxDetails = scriptMenu.addDetails(I18N_G('SETTINGS'), 'settings');

        // Add checkboxes
        const checkboxes = this.checkboxes;
        for (let name in checkboxes) {
            if (checkboxes[name].hide) {
                continue;
            }
            checkboxes[name].cbox = scriptMenu.addCheckbox(checkboxes[name].label, checkboxes[name].title, checkboxDetails);
            /**
             * Getting the state of checkboxes from storage
             */
            let val = storage.get(name, null);
            if (val != null) {
                checkboxes[name].cbox.checked = val;
            } else {
                storage.set(name, checkboxes[name].default);
                checkboxes[name].cbox.checked = checkboxes[name].default;
            }
            /**
             * Tracing the change event of the checkbox for writing to storage
             */
            checkboxes[name].cbox.dataset['name'] = name;
            checkboxes[name].cbox.addEventListener('change', async function (event) {
                const nameCheckbox = this.dataset['name'];
                storage.set(nameCheckbox, this.checked);
                HWGH_UI.checkOptions(nameCheckbox, this.checked);
            })
        }

        // Add inputs
        const inputDetails = scriptMenu.addDetails(I18N_G('VALUES'), 'values');
        const inputs = this.inputs;
        for (let name in inputs) {
            inputs[name].input = scriptMenu.addInputText(inputs[name].title, false, inputDetails);
            if (inputs[name].dot) {
                inputs[name].input.classList.add('scriptMenu_dot');
            } else if (inputs[name].supervisor && !isSupervisor) {
                inputs[name].input.classList.add('scriptMenu_dot');
            }
            /**
             * Get inputText state from storage
             */
            let val = storage.get(name, null);
            if (val != null) {
                inputs[name].input.value = val;
            } else {
                storage.set(name, inputs[name].default);
                inputs[name].input.value = inputs[name].default;
            }
            /**
             * Tracing a field change event for a record in storage
             */
            inputs[name].input.dataset['name'] = name;
            inputs[name].input.addEventListener('input', function () {
                const inputName = this.dataset['name'];
                let value = this.value;
                // let value = +this.value;
                // if (!value || Number.isNaN(value)) {
                //     value = storage.get(inputName, inputs[inputName].default);
                //     inputs[name].input.value = value;
                // }
                storage.set(inputName, value);
            })
        }

        // Add buttons
        const buttons = this.buttons;
        for (const name in buttons) {
            const button = buttons[name];
            if (button.hide) {
                continue;
            }
            if (button.isCombine) {
                button['button'] = scriptMenu.addCombinedButton(button.combineList);
                continue;
            }
            button['button'] = scriptMenu.addButton(button);
        }
    }

    /**
     * Get checkbox state
     *
     */
    static isChecked(checkbox) {
        if (!(checkbox in this.checkboxes)) {
            return false;
        }
        return this.checkboxes[checkbox].cbox?.checked;
    }

    static checkOptions(name, checked) {
        if (!checked) {
            return;
        }

        if (name === 'asgard_osh_150' || name === 'asgard_osh' ||
            name === 'asgard_maestro_150' || name === 'asgard_maestro') {
            let nameCheckboxes = ['asgard_osh_150', 'asgard_osh', 'asgard_maestro_150', 'asgard_maestro'];
            for (let no in nameCheckboxes) {
                if (name === nameCheckboxes[no]) continue;
                this.checkboxes[nameCheckboxes[no]].cbox.checked = false;
                storage.set(nameCheckboxes[no], false);
            }
        }
    }
}

/**
 * Class for show status in window
 */
class ScriptStatusWindow extends Object {
    constructor() {
        if (ScriptStatusWindow.instance) {
            return ScriptStatusWindow.instance;
        }
        super();
        this.mainMenu = null;
        this.buttons = [];
        this.checkboxes = [];
        this.option = {
            showMenu: false,
            showDetails: {},
        };

        this.init();
        ScriptStatusWindow.instance = this;
        return this;
    }

    static getInst() {
        if (!ScriptStatusWindow.instance) {
            new ScriptStatusWindow();
        }
        return ScriptStatusWindow.instance;
    }

    init() {
        this.addStyle();
        this.addBlocks();
        this.clearData();
    }

    addStyle() {
        const style = document.createElement('style');
        style.innerText = `
            .scriptMenu_text_window {
                position: absolute;
                z-index: 10001;
                top: -1px;
                left: 5%;
                cursor: pointer;
                border-radius: 0px 0px 10px 10px;
                background: #190e08e6;
                border: 1px #ce9767 solid;
                font-size: 16px;
                font-family: sans-serif;
                font-weight: 600;
                font-stretch: condensed;
                letter-spacing: 1px;
                color: #fce1ac;
                text-shadow: 0px 0px 1px;
                transition: 0.5s;
                padding: 2px 10px 3px;
            }
            .scriptMenu_text_windowHide {
                top: -35px;
                height: 30px;
                overflow: hidden;
            }

        `;
        document.head.appendChild(style);
    }

    addBlocks() {
        const main = document.createElement('div');
        document.body.appendChild(main);

        this.textarea = document.createElement('div');
        this.textarea.classList.add('scriptMenu_text_window');
        this.textarea.classList.add('scriptMenu_text_windowHide');
        main.appendChild(this.textarea);
        this.setTextarea('');
    }

    clearData() {
        this.headerData = [];
        this.resultsData = {};
        this.headerHtml = "";
        this.resultHtml = "";
        this.fotterHtml = "";

        this.setTextarea("");
    }

    show() {
        this.setTextarea(this.noticeHtml + this.headerHtml + this.resultHtml + this.fotterHtml);
    }

    setTableHeader(headerData) {
        this.noticeHtml = "Click here to stop or clear.<br>";
        this.headerData = headerData;

        this.headerHtml = "<table><tr>";
        this.headerData.forEach((header, index) => {
            this.headerHtml += "<td>" + header + "</td>";
        });
        this.headerHtml += "</tr>";
        this.fotterHtml = "</table>";

        this.show();
    }

    addResult(result) {
        let no = 1;
        if (this.resultsData) {
            no = Object.keys(this.resultsData).length + 1;
        }

        this.resultsData[no] = result;

        this.resultHtml = "";
        for (let index in this.resultsData) {
            this.resultHtml += "<tr>";
            this.resultHtml += "<td>" + index + "</td>";
            let resultData = this.resultsData[index];
            resultData.forEach((value) => {
                this.resultHtml += "<td>" + value + "</td>";
            });
            this.resultHtml += "</tr>";
        }

        this.show();
    }

    resetOnclick() {
        this.setOnclick(null);
    }

    setOnclick(onclick) {
        if (this._currentStatusClickHandler) {
            this.textarea.removeEventListener('click', this._currentStatusClickHandler);
            this._currentStatusClickHandler = null;
        }

        if (onclick == null) {
            onclick = this.clearData.bind(this);
        }
        if (typeof onclick === 'function') {
            this.textarea.addEventListener('click', onclick, { once: true });
            this._currentStatusClickHandler = onclick;
        }
    }

    setTextarea(text) {
        if (!text) {
            this.textarea.classList.add('scriptMenu_text_windowHide');
            this.textarea.innerHTML = '';
        } else {
            this.textarea.classList.remove('scriptMenu_text_windowHide');
            this.textarea.innerHTML = text;
        }
    }
}

this.HWAClasses = {
    ScriptStatusWindow,
};

class GiftStatusWindow extends ScriptStatusWindow {
    constructor() {
        if (GiftStatusWindow.instance) {
            return GiftStatusWindow.instance;
        }
        super();
        this.mainMenu = null;
        this.buttons = [];
        this.checkboxes = [];
        this.option = {
            showMenu: false,
            showDetails: {},
        };

        this.init();
        GiftStatusWindow.instance = this;
        return this;
    }

    static getInst() {
        if (!GiftStatusWindow.instance) {
            new GiftStatusWindow();
        }
        return GiftStatusWindow.instance;
    }

    show() {
        let taskText = StatusDataMana.getTaskStr(RunningTask);
        taskText += `: No.${StatusData.startNo} ~ `;
        if (StatusData.endNo > 0) {
            taskText += StatusData.endNo;
        }

        // Last task
        let taskFinishedText = '';
        let emailText = '';

        if (RunningTask == RunningTaskEnum.Stop) {
            let taskText = StatusDataMana.getTaskStr(LastTask);
            taskFinishedText = `${taskText}任务 已完成`;
        } else {
            let email = NXUserInfo?.email;
            if (email == null) {
                if (StatusData.doneNo > 0) {
                    email = getUserMail(StatusData.doneNo + 1);
                }
            }
            emailText = `当前用户: ${email}`;
        }
        this.noticeHtml = `${taskText} <br> ${taskFinishedText}${emailText} <br>`;

        // 今日已完成 & 待完成
        const finished = StatusData.doneNo - StatusData.startNo + 1;
        this.noticeHtml += `今日已完成: ${finished}    `;
        if (StatusData.endNo > 0) {
            const toFinish = StatusData.endNo - StatusData.doneNo;
            this.noticeHtml += `待完成:${toFinish}`;
        }
        this.noticeHtml += '<br>';

        // 新用户 或 日常任务
        let isNewOrDailyTask = false;
        if (RunningTask == RunningTaskEnum.Stop) {
            isNewOrDailyTask = (LastTask == RunningTaskEnum.NewUser || LastTask == RunningTaskEnum.Daily);
        } else {
            isNewOrDailyTask = (RunningTask == RunningTaskEnum.NewUser || RunningTask == RunningTaskEnum.Daily);
        }
        if (isNewOrDailyTask) {
            const result = StatusDataMana.getRunResult(StartUserNo);
            this.noticeHtml += `完全完成用户: ${result.over30WithKeys}`;
            // 显示目标出生服务器
            if (isSupervisor && isBornSpecified) {
                this.noticeHtml += `<br>目标出生服务器: ${BornServerId}`;
            }
        }

        this.setTextarea(this.noticeHtml);
    }
}

// 显示运行情况
function showRunningStatus() {
    const statusWindow = GiftStatusWindow.getInst();
    statusWindow.show();
}

// 转服(带人物)
this.transferServer = async function (serverId, sleepTime = 0) {
    if (userInfo == null)  {
        return false;
    }

    const res = await Send(`{"calls":[{"name":"userMigrate","args":{"serverId": ${serverId}},"ident":"body"}]}`);
    if (res != null) {
        if (res.results[0].result.response.error == null) {
            setProgress('Transfer server finished.', true);
            await sleep(sleepTime);
            return true;
        } 
        
        if (isForceChangeServer) {
            const res = await Send(`{"calls":[{"name":"serverGetAll","args":{},"ident":"body"}]}`);
            const usersInServer = res.results[0].result.response.users;

            if (usersInServer.length >= 2) {
                for (let i = 0; i < usersInServer.length; i++) {
                    if (usersInServer[i].serverId == serverId) {
                        await Send(`{"calls":[{"name":"userChange","args":{"id": ${usersInServer[i].id}},"ident":"body"}]}`);
                        return true;
                    }
                }
            }
        }

        if (isForceChangeServer && res.error?.description?.includes('artifact')) {
            const userData = await refreshUserData();
            const keys = (userData['inventoryGet']?.consumable == null) ? 0 : userData['inventoryGet']?.consumable[45];
            if (keys > 0) {
                // useup all keys
                await Send(`{"calls":[{"name":"artifactChestOpen","args":{"amount": ${keys}, "free": true},"ident":"body"}]}`);

                // in case chest level up
                await Send(`{"calls":[{"name":"artifactChestOpen","args":{"amount": 1, "free": true},"ident":"body"}]}`);
                return await transferServer(serverId, sleepTime);
            }
        }
    }

    setProgress('Transfer server failed.', true);
    return false;
}

// 转服(不带人物)
async function changeBornServer() {
    if (userInfo == null)  {
        return false;
    }
    const res = await Send(`{"calls":[{"name":"userCreate","args":{"serverId": ${BornServerId}},"ident":"body"}]}`);
    if (res != null && res.error == null) {
        await sleep(10e3);
        location.reload();
        return true;
    }
    return false;
}

/**
 * Mission auto repeat
 **/
this.sendsRepeatMission = async function (param) {
	if (isStopSendMission) {
		return;
	}
	lastMissionBattleStart = Date.now();

    const heroes = (param.hero != null) ? param.hero : [2,20];
	let missionStartCall = {
		"calls": [{
			"name": "missionStart",
            "args": {"id": param.id, "heroes": heroes, "favor": {}},
			"ident": "body"
		}]
	}
	/**
	 * Mission Request
	 */
	await SendRequest(JSON.stringify(missionStartCall), async e => {
		if (e?.error) {
			isSendsMission = false;
			console.log(e['error']);
			let msg = e['error'].name + ' ' + e['error'].description + `<br>${I18N_G('REPETITIONS')}: ${param.count}`;
			setProgress(msg);
            isStopSendMission = true;
            hasErrorInSendMission = true;
			return;
		}
		/**
		 * Mission data calculation
		 *
		 * Расчет данных мисии
		 */
		BattleCalc(e.results[0].result.response, 'get_tower', async r => {
			/** missionTimer */
			let timer = getTimer(r.battleTime) + 5;
			const period = Math.ceil((Date.now() - lastMissionBattleStart) / 1000);
			if (period < timer) {
				timer = timer - period;
                const isSuccess = await countdownTimer(timer, `Mission ${param.id}: `, () => {
                    isStopSendMission = true;
                });
				if (!isSuccess) {
                    setProgress('Mission failed.');
                    isStopSendMission = true;
                    hasErrorInSendMission = true;
					return;
				}
			}

			let missionEndCall = {
				"calls": [{
					"name": "missionEnd",
					"args": {
						"id": param.id,
						"result": r.result,
						"progress": r.progress
					},
					"ident": "body"
				}]
			}
			/**
			 * Mission Completion Request
			 *
			 * Запрос на завершение миссии
			 */
			SendRequest(JSON.stringify(missionEndCall), async (e) => {
                if (e == null) {
					isSendsMission = false;
                    isStopSendMission = true;
                    hasErrorInSendMission = true;
					return;
                }
				if (e?.error) {
					isSendsMission = false;
					console.log(e['error']);
					let msg = e['error'].name + ' ' + e['error'].description + `<br>${I18N_G('REPETITIONS')}: ${param.count}`;
        			setProgress(msg);
                    isStopSendMission = true;
                    hasErrorInSendMission = true;
					return;
				}
				r = e.results[0].result.response;
				if (r?.error) {
					isSendsMission = false;
					console.log(r['error']);
                    setProgress(r['error']);
                    isStopSendMission = true;
                    hasErrorInSendMission = true;
					return;
				}

				param.count++;
                if (param.count >= param.maxCount) {
                    isStopSendMission = true;
                    setProgress('Mission finished.');
                }
				setTimeout(sendsRepeatMission, 1, param);
			});
		})
	});
}

async function sendTutorialMissionEnd(seed) {
    let missionEndCall = {"calls": [{
        "name": "missionEnd",
        "args": {
            "id": 1,
            "result": {
                "win": true,
                "stars": 3
            },
            "progress": [
                {
                    "v": 271,
                    "b": 0,
                    "seed": seed,
                    "attackers": {
                        "input": [
                            "auto",
                            0,
                            0
                        ],
                        "heroes": {
                            "2": {
                                "hp": 1439,
                                "energy": 414,
                                "isDead": false
                            }
                        }
                    },
                    "defenders": {
                        "input": [],
                        "heroes": {}
                    }
                }
            ]
        },
        "ident": "body"
    }]};

    if (Calc != null) {
        this.Calc = function (data) {
            return {
                battleTimer: 10
            };
        }
    }

    // Mission Completion Request
    let result = await Send(JSON.stringify(missionEndCall)).then(
        (e) => e?.results
    );

    // after 10 seconds, end tutorial mission
    await sleep(1e3);
    location.reload();
}

// Arena相关
let lastArenaTime = 0;
let fightArenaCount = 0;
function getArenaWaitTime() {
    if (lastArenaTime != 0) {
        const now = Date.now();
        return 60e3 - (now - lastArenaTime);
    }
    return 0;
}

async function doArena(heroes) {
    // wait for arena time
    if (lastArenaTime != 0) {
        const now = Date.now();
        const waitTime = 60e3 - (now - lastArenaTime);
        if (waitTime > 0) {
            setProgress(`等待竞技场时间冷却(${parseInt(waitTime/1000)}s)...`);
            await sleep(waitTime);
        }
    }

    let arenaSetHeroesCall = {
        "calls": [{
            "name": "arenaSetHeroes",
            "args": {
                "heroes": heroes,
                "favor": {}
            },
            "ident": "arenaSetHeroes"
        }]
    }
    await Send(JSON.stringify(arenaSetHeroesCall)).then((e) => e?.results);

    let arenaFindCall = {
        "calls": [{
            "name": "arenaFindEnemies",
            "args": {},
            "ident": "arenaFindEnemies"
        }]
    }

    // start arena
    const result = await Send(JSON.stringify(arenaFindCall)).then((e) => e?.results);
    if (result == null || result.error) {
        setProgress('Do arena failed.');
        return;
    }

    const enemy = result[0].result.response[2].userId;
    const arenaAttackCall = {
        "calls": [{
            "name": "arenaAttack",
            "args": {
                "userId": enemy,
                "heroes": heroes,
                "favor": {}
            },
            "ident": "arenaAttack"
        }]
    };
    const result2 = await Send(JSON.stringify(arenaAttackCall)).then((e) => e?.results);
    if (result2?.error) {
        setProgress('Do arena failed.');
        return;
    }
    lastArenaTime = Date.now();
    fightArenaCount++;
    setProgress('Do arena finished.');
}

/**
 * Info from game loading
 */
let userInfo = null;
let tutorialChains = null;
// 神器宝箱的级别
let artifactChestLevel = 0;

/**
 * Get team level
 */
async function getTeamLevel() {
    const res = await Send('{"calls":[{"name":"userGetInfo","args":{},"ident":"body"}]}');
    userInfo = res.results[0].result.response;
    return userInfo?.level;
}
/**
 * Refresh user info
 */
async function refreshUserInfo() {
    const res = await Send('{"calls":[{"name":"userGetInfo","args":{},"ident":"body"}]}');
    userInfo = res.results[0].result.response;
}
/**
 * Refresh user data
 */
async function refreshUserData() {
    callsList = ['inventoryGet', 'userGetInfo'];

    const data = {};
    const calls = this.callsList.map((name) => ({
        name,
        args: {},
        ident: name,
    }));
    const result = await Send(JSON.stringify({ calls })).then((e) => e?.results);
    for (const call of result) {
        data[call.ident] = call.result.response;
    }

    return data;
}

async function activatePromocode() {
    let calls = [];
    for (i in promoCodes) {
        calls.push({
            name: 'activatePromocode',
            args: { promocode: promoCodes[i] },
            ident: 'group_' + i + 'body',
        });
    }
    if (calls.length) {
        await Send({ calls });
    }
}

class questUtils {
    // get all mission
    static async getAllMission() {
        const res = await Send('{"calls":[{"name":"missionGetAll","args":{},"ident":"body"}]}');
        const missionInfo = res?.results[0]?.result?.response;

        return missionInfo;
    }

    static async getBasicInfo() {
        await this.getTutorialChains();
        await this.getArtifactChestLevel();
        await this.getUserInfo();
    }

    static async getTutorialChains() {
        const res = await Send('{"calls":[{"name":"tutorialGetInfo","args":{},"ident":"body"}]}');
        tutorialChains = res?.results[0]?.result?.response.chains;
    }

    static async getArtifactChestLevel() {
        const res = await Send('{"calls":[{"name":"artifactGetChestLevel","args":{},"ident":"body"}]}');
        artifactChestLevel = res?.results[0]?.result?.response.level;
    }

    static async getUserInfo() {
        const res = await Send('{"calls":[{"name":"userGetInfo","args":{},"ident":"body"}]}');
        userInfo = res.results[0].result.response;
    }
}

/**
 * daily quest class
 */
class dailyQuests {
    callsList = ['inventoryGet', 'userGetInfo', 'heroGetAll', 'missionGetAll'];
    questInfo = null;
    heroes = null;
    missionHero = 5;
    missionNormal = 8;

    async init() {
        const quests = {};
        const calls = this.callsList.map((name) => ({
            name,
            args: {},
            ident: name,
        }));
        const result = await Send(JSON.stringify({ calls })).then((e) => e?.results);
        for (const call of result) {
            quests[call.ident] = call.result.response;
        }
        this.questInfo = quests;

        // Mission info
        const missionInfo = this.questInfo['missionGetAll'];
        if (missionInfo != null) {
            if (missionInfo?.length < 4) {
                this.missionHero = 1;
            }
            let maxMission = missionInfo.length + 1;
            if (maxMission == 5) {
                maxMission = 4;
            } else if (maxMission > 8) {
                maxMission = 8;
            }
            this.missionNormal = maxMission;
        }

        // summon hero if needed
        await this.summonHeroUntilFive();
    }

    async doDailyQuests() {
        if (this.questInfo == null) {
            await this.init();
        }

        // Perform 1 summon in the Soul Atrium
        await this.doSummon();

        // Use an experience potion
        await this.doExperiencePotion();

        // Upgrade the skills of heroes 3 times
        await this.doUpgradeSkills();

        // Use the exchange of emeralds 1 time
        await this.doExchangeEmeralds();
    }

    async checkTutorial() {
        // check for userInfo.tutorialStep
        if (tutorialChains[1] == 9999 && userInfo?.tutorialStep != 9999) {
            this.doTutorialSaveProgress(522);
            await sleep(1000);
            this.doTutorialSaveProgress(51);
            await sleep(1000);
        }

        // Lv10, arena
        if (tutorialChains[4] != 9999) {
            this.doTutorialSaveProgress(78);
            await sleep(1000);
            this.doTutorialSaveProgress(82);
            await sleep(1000);
        }

        // Lv20, expedition
        if (tutorialChains[9] != 9999 &&
            isServerOk(userInfo?.serverId)) {
            this.doTutorialSaveProgress(113);
            await sleep(1000);
            this.doTutorialSaveProgress(114);
            await sleep(1000);
        }
    }

    async getExpedition() {
        if (isServerOk(userInfo?.serverId)) {
            checkExpedition();
        }
    }

    async getLatestHeroes() {
        const calls = [{name: 'heroGetAll', args: {}, ident: 'heroGetAll'}];
        const result = await Send(JSON.stringify({ calls })).then((e) => e?.results);
        this.heroes = Object.keys(result[0].result.response);

        if (this.heroes?.length > 5) {
            this.heroes = this.heroes.slice(0, 5);
        }
    }

    // check raid is able or not
    async checkRaidAble(isMulti = false) {
        const count = isMulti ? 2 : 1;
        const calls = [{ name: 'missionRaid', args: { id: 2, times: count }, ident: 'group_1_body' }];
        const res = await Send(JSON.stringify({ calls })).then((e) => e?.results);
        if (res != null && res.error == null) {
            return true;
        }
        return false;
    }

    // raid mission (只能单次突袭)
    async doRaidMission(missionId, repeatTimes) {
        setProgress(`Raiding mission ${missionId} 0/${repeatTimes} ...`);
        let calls = [];
        let i = 0;
        for (i = 1; i <= repeatTimes; i++) {
            calls.push({ name: 'missionRaid', args: { id: missionId, times: 1 }, ident: 'group_' + i });
            if (i % 50 === 0) {
                const res = await Send(JSON.stringify({ calls })).then((e) => e?.results);
                if (res == null || res.error != null) {
                    break;
                }
                calls = [];
                setProgress(`Raiding mission ${missionId} ${i}/${repeatTimes} ...`);
            }
        }
        if (calls.length > 0) {
            await Send(JSON.stringify({ calls })).then((e) => e?.results);
            setProgress(`Raid mission ${missionId} for ${i} times.`);
        }
    }

    // raid mission (可多次突袭)
    async doRaidMissionMulti(missionId, repeatTimes) {
        setProgress(`Raiding mission ${missionId} 0/${repeatTimes} ...`);
        const calls = [{ name: 'missionRaid', args: { id: 2, times: repeatTimes }, ident: 'group_1_body' }];
        await Send(JSON.stringify({ calls })).then((e) => e?.results);
        setProgress(`Raid mission ${missionId} for ${repeatTimes} times.`);
    }


    async doMissionHero(times) {
        await passMission({id: this.missionHero, count: 0, maxCount: times, hero: this.heroes});
    }

    async doMissionNormal(times) {
        await passMission({id: this.missionNormal, count: 0, maxCount: times, hero: this.heroes});
    }

    // Perform 1 summon in the Soul Atrium
    async doSummon() {
        const soulCrystal = (this.questInfo['inventoryGet'].coin == null) ? 0 : this.questInfo['inventoryGet'].coin[38];
        if (soulCrystal > 0) {
            const calls = [{ name: 'gacha_open', args: { ident: 'heroGacha', free: true, pack: false }, ident: 'gacha_open' }];
            await Send(JSON.stringify({ calls })).then((e) => e?.results);

            setProgress('Perform 1 summon finished.');
        }
    }

    // Use an experience potion
    async doExperiencePotion() {
        const expHero = this.getExpHero();
        if (expHero.heroId && expHero.libId) {
            const calls = [{
                name: 'consumableUseHeroXp',
                args: {
                    heroId: expHero.heroId,
                    libId: expHero.libId,
                    amount: 1,
                },
                ident: 'consumableUseHeroXp',
            }];
            await Send(JSON.stringify({ calls })).then((e) => e?.results);

            setProgress('Use an experience potion finished.');
        }
    }

    // Upgrade the skills of heroes 3 times
    async doUpgradeSkills() {
        let isWeCanDo = true;
        const upgradeSkills = this.getUpgradeSkills();
        let sumGold = 0;
        for (const skill of upgradeSkills) {
            sumGold += this.skillCost(skill.value);
            if (!skill.heroId) {
                isWeCanDo = false;
                break;
            }
        }
        if (isWeCanDo) {
            isWeCanDo = this.questInfo['userGetInfo'].gold > sumGold;
        }

        if (isWeCanDo) {
            const upgradeSkills = this.getUpgradeSkills();
            const calls = upgradeSkills.map(({ heroId, skill }, index) => ({
                name: 'heroUpgradeSkill',
                args: { heroId, skill },
                ident: `heroUpgradeSkill_${index}`,
            }));
            await Send(JSON.stringify({"calls": calls})).then((e) => e?.results);

            setProgress('Upgrade the skills of heroes 3 times finished.');
        }
    }

    // Use the exchange of emeralds 1 time
    async doExchangeEmeralds() {
        const starMoney = this.questInfo['userGetInfo'].starMoney;
        if (starMoney >= 20) {
            const calls = [{
                name: 'refillableAlchemyUse',
                args: { multi: false },
                ident: 'refillableAlchemyUse',
            }];
            const result = await Send(JSON.stringify({ calls })).then((e) => e?.results);

            setProgress('Use the exchange of emeralds 1 time finished.');
        }
    }

    async doTutorialInsertItem() {
        // Thea, insert items
        const calls = [
            { name: 'heroInsertItem', args: { heroId: 7, slot: 0 }, ident: 'group_1_body' },
            { name: 'heroInsertItem', args: { heroId: 7, slot: 3 }, ident: 'group_4_body' },
            { name: 'heroInsertItem', args: { heroId: 7, slot: 4 }, ident: 'group_5_body' },
            { name: 'heroInsertItem', args: { heroId: 7, slot: 5 }, ident: 'group_6_body' },
        ];
        await Send(JSON.stringify({ calls })).then((e) => e?.results);
        await sleep(1000);

        // Save progress
        this.doTutorialSaveProgress(47);
        await sleep(1000);
        this.doTutorialSaveProgress(49);
        await sleep(1000);
        this.doTutorialSaveProgress(50);
        await sleep(1000);
        setProgress('Hero insert items finished.');
    }

    async doTutorialUpgradeSkills() {
        // Thea & Galahad
        const calls = [
            { name: 'heroUpgradeSkill', args: { heroId: 7, skill: 1 }, ident: 'group_1_body' },
            { name: 'heroUpgradeSkill', args: { heroId: 2, skill: 1 }, ident: 'group_2_body' },
            { name: 'heroUpgradeSkill', args: { heroId: 2, skill: 1 }, ident: 'group_3_body' },
        ];
        await Send(JSON.stringify({ calls })).then((e) => e?.results);
        await sleep(1000);

        // Save progress
        this.doTutorialSaveProgress(50);
        await sleep(1000);
        this.doTutorialSaveProgress(522);
        await sleep(1000);
        this.doTutorialSaveProgress(51);
        await sleep(1000);

        setProgress('Hero upgrade skills finished.');
    }

    // Save tutorial progress
    async doTutorialSaveProgress(targetTaskId) {
        const calls = [{ name: 'tutorialSaveProgress', args: { taskId: targetTaskId }, ident: 'tutorialSaveProgress' }];
        await Send(JSON.stringify({ calls })).then((e) => e?.results);
    }

    // Save tutorial progress for multi task id
    async doTutorialSaveProgresses(targetTaskIds) {
        for (const targetTaskId of targetTaskIds) {
            await this.doTutorialSaveProgress(targetTaskId);
            await sleep(1000);
        }
    }

	getExpHero() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const inventory = this.questInfo['inventoryGet'];
		const expHero = { heroId: 0, exp: 3625195, libId: 0 };
		/** зелья опыта (consumable 9, 10, 11, 12) */
		for (let i = 9; i <= 12; i++) {
			if (inventory.consumable[i]) {
				expHero.libId = i;
				break;
			}
		}

		for (const hero of heroes) {
			const exp = hero.xp;
			if (exp < expHero.exp) {
				expHero.heroId = hero.id;
			}
		}
		return expHero;
	}

	getUpgradeSkills() {
		const heroes = Object.values(this.questInfo['heroGetAll']);
		const upgradeSkills = [
			{ heroId: 0, slotId: 0, value: 130 },
			{ heroId: 0, slotId: 0, value: 130 },
			{ heroId: 0, slotId: 0, value: 130 },
		];
		const skillLib = lib.getData('skill');
		/**
		 * color - 1 (белый) открывает 1 навык
		 * color - 2 (зеленый) открывает 2 навык
		 * color - 4 (синий) открывает 3 навык
		 * color - 7 (фиолетовый) открывает 4 навык
		 */
        const colors = [1, 2, 4, 7];
        let index = 0;
        for (const hero of heroes) {
            if (index >= 3) break;

            const level = hero.level;
            const color = hero.color;
            for (let skillId in hero.skills) {
                const tier = skillLib[skillId].tier;
                const sVal = hero.skills[skillId];
                if (color < colors[tier - 1] || tier < 1 || tier > 4) {
                    continue;
                }

                let upSkill = upgradeSkills[index];
                if (sVal < upSkill.value && sVal < level) {
                    upSkill.value = sVal;
                    upSkill.heroId = hero.id;
                    upSkill.skill = tier;
                    index++;
                    break;
                }
            }
        }
        return upgradeSkills;
	}

    skillCost(lvl) {
        return 573 * lvl ** 0.9 + lvl ** 2.379;
    }

    async summonHeroUntilFive() {
        const heroCount = Object.keys(this.questInfo['heroGetAll']).length;
        if (heroCount >= 5) {
            return;
        }

        const inventoryGet = this.questInfo['inventoryGet'];
        if (inventoryGet == null || inventoryGet.fragmentHero == null) {
            return;
        }

        for (const key of Object.keys(inventoryGet.fragmentHero)) {
            // summon hero
            if (inventoryGet.fragmentHero[key] >= 30) {
                await Send('{"calls":[{"name":"heroCraft","args":{"heroId": ' + key + '},"ident":"heroCraft"}]}');
            }
        }
    }
}

class giftTasks {
    userData = null;
    
    async init() {
        this.userData = await refreshUserData();
    }

    async joinGuildForAoc(guildId) {
        if (userInfo.clanId != null) {
            await new dailyQuests().doTutorialSaveProgresses([91, 110, 112, 103]);

            setProgress('已加入公会');
            return true;
        }

        const res = await Send(`{"calls":[{"name":"clanJoin", "args": {"clanId": ${guildId}},"ident": "body"}]}`);
        if (res != null && res.error == null) {
            await new dailyQuests().doTutorialSaveProgresses([91, 110, 112, 103]);

            setProgress('加入公会成功');
            return true;
        } 
        
        setProgress('加入公会失败');
        return false;
    }

    async doGiftKeys(guildId) {
        // 确认是否够送钥匙
        if (await this.ableGiftKeys() == false) {
            setProgress('资源不够送钥匙');
            return false;
        }

        // 退出公会
        if (await this.quitGuild(guildId) == false) {
            setProgress('退出公会失败');
            return false;
        }

        // 加入公会
        if (await this.joinGuildForGift(guildId) == false) {
            setProgress('加入公会失败');
            return false;
        }

        // 送礼物
        await this.giftKeys();
    }

    async joinGuild(guildId) {
        if (userInfo.clanId == guildId) {
            setProgress('已加入公会');
            return true;
        }

        const res = await Send(`{"calls":[{"name":"clanJoin", "args": {"clanId": ${guildId}},"ident": "body"}]}`);
        if (res != null && res.error == null) {
            userInfo.clanId = guildId;
            await new dailyQuests().doTutorialSaveProgresses([91, 110, 112, 103]);

            setProgress('加入公会成功');
            return true;
        } 
        
        setProgress('加入公会失败');
        return false;
    }

    async quitGuild(guildId = 0) {
        if (userInfo.clanId == null) {
            return true;
        }
        if (userInfo.clanId == guildId) {
            setProgress('已在相同公会');
            return true;
        }

        const res = await Send(`{"calls":[{"name":"clanGetActivityStat", "args": {},"ident": "group_1_body"},{"name":"clanDismissMember", "args": {},"ident": "group_2_body"}]}`);
        if (res != null && res.error == null) {
            userInfo.clanId = null;
            setProgress('退出公会成功');
            return true;
        }

        return false;
    }

    // 加入公会
    // 失败时需要用户确认
    async joinGuildForGift(guildId) {
        if (await this.joinGuild(guildId) == false) {

            // 加入公会失败，需要用户确认
            const answer = await popup.confirm(
                '加入公会失败。<br>可能公会已满员。 ',
                [
                    {
                        msg: '重试',
                        result: true
                    },
                    {
                        msg: '跳过',
                        result: false,
                        isCancel: true
                    },
                ]
            );

            if (answer) {
                return await this.joinGuildForGift(guildId);
            }
            return false;
        }
        return true;
    }

    async ableGiftKeys() {
        let keys = (this.userData['inventoryGet']?.consumable == null) ? 0 : this.userData['inventoryGet']?.consumable[45];
        let starMoney = (this.userData['userGetInfo'] == null) ? 0 : this.userData['userGetInfo']?.starMoney;

        if (artifactChestLevel == 1) {
            if (starMoney >= 800 || keys >= 10) {
                return true;
            }
        } else if (artifactChestLevel == 2) {
            let keyOpen = parseInt(keys / 10);
            let starMoneyOpen = parseInt(starMoney / 800);
            if ((keyOpen + starMoneyOpen) >= 4) {
                return true;
            }
        }

        return false;
    }

    // 开神器宝箱，送钥匙流程
    async giftKeys() {
        let keys = (this.userData['inventoryGet']?.consumable == null) ? 0 : this.userData['inventoryGet']?.consumable[45];
        let starMoney = (this.userData['userGetInfo'] == null) ? 0 : this.userData['userGetInfo']?.starMoney;

        let useKeys = 0;
        let useStarMoney = 0;
        let isFree = true;
        let times = 0;
        let targetChestLevel = artifactChestLevel;
        if (targetChestLevel == 1) {
            // enough to lv 2
            // 优先使用800钻
            if (starMoney >= 800 || keys >= 10) {
                times = 1;
                targetChestLevel = 2;
                if (starMoney >= 800) {
                    useStarMoney = 800;
                    isFree = false;
                } else if (keys >= 10) {
                    useKeys = 10;
                    isFree = true;
                }
            }
        }
        if (times > 0) {
            await TaskHelper.sendArtifactChestOpen(isFree, times);
        }

        // collect rewards, and refresh userGetInfo
        await sleep(3e3);
        await collectAllStuff();
        await sleep(1e3);
        this.userData = await refreshUserData();
        keys = (this.userData['inventoryGet']?.consumable == null) ? 0 : this.userData['inventoryGet']?.consumable[45];
        starMoney = (this.userData['userGetInfo'] == null) ? 0 : this.userData['userGetInfo']?.starMoney;

        if (targetChestLevel == 2) {
            let keyOpen = parseInt(keys / 10);
            let starMoneyOpen = parseInt(starMoney / 800);

            // 之后优先使用钥匙
            if ((keyOpen + starMoneyOpen) >= 4) {
                keyOpen = (keyOpen > 4) ? 4 : keyOpen;
                await TaskHelper.sendArtifactChestOpen(true, keyOpen);

                starMoneyOpen = 4 - keyOpen;
                await TaskHelper.sendArtifactChestOpen(false, starMoneyOpen);

                useKeys += keyOpen * 10;
                useStarMoney += starMoneyOpen * 800;
                targetChestLevel = 3;
            }
        }
    }
}

/**
 * simulate text entry
 *
 * @param {*} inputField
 * @param {*} textToEnter
 */
function simulateTextEntry(inputField, textToEnter) {
    inputField.focus();
    inputField.value = "";

    for (let i = 0; i < textToEnter.length; i++) {
        var charCode = textToEnter.charCodeAt(i);

        let keydownEvent = new Event('keydown', { keyCode: charCode });
        inputField.dispatchEvent(keydownEvent);

        let keypressEvent = new Event('keypress', { keyCode: charCode });
        inputField.dispatchEvent(keypressEvent);

        inputField.value = inputField.value + textToEnter[i];

        let inputEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(inputEvent);

        let keyupEvent = new Event('keyup', { keyCode: charCode });
        inputField.dispatchEvent(keyupEvent);
    }
}

/**
 * check current screen is login
 * @returns true if is login
 */
function isInLoginScreen() {
    if (document.getElementsByName("email")[0]) {
        return true;
    }
    return false;
}

function getUserMail(userNo) {
    let formattedNum = userNo.toString().padStart(6, '0');
    return getInput('userPrefix') + formattedNum + getInput('userMail');
}

// 开始任务
async function startTask(nextAction = null) {
    StatusData = StatusDataMana.loadStatusData();
    if (RunningTask == RunningTaskEnum.Daily) {
        StatusData.doneNo = StatusDataMana.getNextRunnableDailyUserNo(StatusData.doneNo) - 1;
    }

    // reach max user
    if (StatusData.endNo > 0 && StatusData.doneNo >= StatusData.endNo) {
        finishRunningTask();
        return;
    }

    const param = {
        "username" : getUserMail(StatusData.doneNo + 1),
        "password" : DefaultPassword,
    };

    changeRunningTask(RunningTask);
    if (nextAction != null) {
        await nextAction(param);
    } else {
        await loginUser(param);
    }
}

/**
 * Register a single user
 * @param {*} param
 */
async function registerSingleUser(param) {
    try {
        // click 'Sign Up'
        document.getElementsByClassName("login clickable")[0].click();
        await sleep(1000);
        simulateTextEntry(document.getElementsByName("email")[0], param.username);
        await sleep(1000);
        // click 'Next'
        document.getElementsByClassName("holder next")[0].childNodes[0].click();
        await sleep(3 * 1000);
        // input password
        simulateTextEntry(document.getElementsByName("password")[0], param.password);
        await sleep(1000);
        document.getElementsByClassName("holder play reg")[0].childNodes[0].click();

        // check user name or password is not input
        await sleep(2e3);
        const errMail = document.getElementsByClassName("holder email")[0].childNodes[0].childNodes[2].childNodes[0].textContent;
        const errPass = document.getElementsByClassName("holder password")[0].childNodes[0].childNodes[2].childNodes[0].textContent;
        if (errMail.trim() != '' || errPass.trim() != '') {
            await registerSingleUser(param);
            return;
        }

        // wait for recaptcha
        await sleep(10 * 1000);
        // recaptcha exist
        let recaptchaDiv = document.getElementsByClassName("g-recaptcha")[0];
        if (recaptchaDiv.childNodes != null) {
            for (let i = 0; i < 50; i++) {
                await sleep(3 * 1000);
                document.getElementsByClassName("holder play reg")[0].childNodes[0].click();
            }
        } else {
            // recaptcha passed
            document.getElementsByClassName("holder play reg")[0].childNodes[0].click();
        }

        // login failed
        await sleep(10 * 1000);
        location.reload();
    } catch (e) {
        console.error(`Error in registerSingleUser:`, e);
        if (isInLoginScreen()) {
            await sleep(3e3);
            await registerSingleUser(param);
        }
    }
}

let loginExceptions = 0;
/**
 * Register a single user
 * @param {*} param
 */
async function loginUser(param) {
    try {
        // user name & password
        await sleep(1000);
        simulateTextEntry(document.getElementsByName("email")[0], param.username);
        await sleep(500);
        simulateTextEntry(document.getElementsByName("password")[0], param.password);
        await sleep(500);
        // Play now
        document.getElementsByClassName("holder play login")[0].childNodes[0].click();

        // check user name or password is not input
        await sleep(2e3);
        const errMail = document.getElementsByClassName("holder email")[0].childNodes[0].childNodes[2].childNodes[0].textContent;
        const errPass = document.getElementsByClassName("holder password")[0].childNodes[0].childNodes[2].childNodes[0].textContent;
        if (errMail.trim() != '' || errPass.trim() != '') {
            await loginUser(param);
            return;
        }

        // wait for recaptcha
        await sleep(8e3);
        // recaptcha exist
        let recaptchaDiv = document.getElementsByClassName("g-recaptcha invalid-captcha")[0];
        if (recaptchaDiv.childNodes != null) {
            for (let i = 0; i < 50; i++) {
                await sleep(3e3);
                document.getElementsByClassName("holder play login")[0].childNodes[0].click();
            }
        } else {
            // recaptcha passed
            document.getElementsByClassName("holder play login")[0].childNodes[0].click();
        }

        // login failed
        await sleep(10e3);
        location.reload();
    } catch (e) {
        console.error(`Error in loginUser:`, e);
        loginExceptions++;
        if (isInLoginScreen()) {
            if (loginExceptions >= 20) {
                location.reload();
                await sleep(10e3);
            }

            await loginUser(param);
        }
    }
}

class HWTask {
    /**
     * 新用户流程
     */
    static async doNewUserTasks() {
        const quests = new dailyQuests();

        try {
            await quests.init();
            // check mission info, if the mission is tutorial mission
            const missionInfo = quests.questInfo['missionGetAll'];
            if (missionInfo == null) {
                return;
            }
            if (missionInfo.length == 1 && missionInfo[0].wins == 0) {
                return;
            }

            // 走地图流程
            // farm all
            await questAllFarm();

            // pass missions (mission2 - 3)
            await passMission({id: 2, count: 0, maxCount: 1});
            await passMission({id: 3, count: 0, maxCount: 1});

            // Summon -> Thea
            await quests.doSummon();
            await sleep(1000);

            // promo
            await activatePromocode();
            await mailGetAll();

            // pass missions (mission4 - 5)
            await quests.getLatestHeroes();
            await passMission({id: 4, count: 0, maxCount: 1, hero: quests.heroes});
            await passMission({id: 5, count: 0, maxCount: 1, hero: quests.heroes});
            await sleep(1000);

            // Insert items (Thea)
            await quests.doTutorialInsertItem();

            await quests.doTutorialUpgradeSkills();
            await sleep(1000);

            // pass missions (mission6 - 8)
            await passMission({id: 6, count: 0, maxCount: 1, hero: quests.heroes});
            await passMission({id: 7, count: 0, maxCount: 1, hero: quests.heroes});
            await passMission({id: 8, count: 0, maxCount: 1, hero: quests.heroes});
            await sleep(1000);

            if (tutorialChains[2] != 9999) {
                // Save progress -> before summon Phobos
                quests.doTutorialSaveProgress(54);
                await sleep(1000);

                await quests.doSummon();
                await sleep(1000);
            }

            await quests.doExperiencePotion();
            await sleep(1000);

            if (tutorialChains[2] != 9999) {
                // Save progress -> after summon Phobos
                quests.doTutorialSaveProgress(57);
                await sleep(1000);
                quests.doTutorialSaveProgress(59);
                await sleep(1000);
                quests.doTutorialSaveProgress(78);
                await sleep(1000);
            }

            quests.getExpedition();
        } catch (e) {
            console.error('Error in doNewUserTasks');
        }

        // 判断是否转出生服
        if (shouldChangeBornServer(userInfo?.serverId)) {
            await changeBornServer();
            return;
        }

        // 建号时, 有突袭功能，打竞技场
        const raidable = await quests.checkRaidAble();
        if (raidable) {
            await this.raidNewUserTask(quests);
        } else {
            await passMission({id: 1, count: 0, maxCount: 2, hero: quests.heroes});
            await passMission({id: 5, count: 0, maxCount: 2, hero: quests.heroes});
            await passMission({id: 8, count: 0, maxCount: 4, hero: quests.heroes});
        }

        try {
            // check emperor quest
            let res = await Send('{"calls":[{"name":"quest_completeEmperorQuest","args":{"type":"consent"},"ident": "body"}]}');
            if (res?.results[0]?.result?.quests[0]) {
                const id = res?.results[0]?.result?.quests[0].id;
                await Send(`{"calls":[{"name": "questFarm","args": {"questId": ${id}},"ident": "body"}]}`);
            }
            // collect all
            await collectAllStuff();
            await quests.checkTutorial();

            // change server
            if (isServerOk(userInfo?.serverId) != true) {
                await transferServer(TargetServerId, 2 * 1000);
            }
        } catch (e) {
            console.error('Error in doNewUserTasks');
        }

        // Save status
        const userData = await refreshUserData();
        StatusData.doneNo = parseEmailToNo(NXUserInfo?.email);
        StatusDataMana.saveUserTaskStatus(NXUserInfo?.email, userData['userGetInfo'].level, 0, userData['userGetInfo'].starMoney, userData['userGetInfo'].serverId);
        StatusDataMana.saveUserNo(StatusDataMana.UserType.NewUser, NXUserInfo?.email);
        StatusDataMana.saveStatusData(TaskKeyEnum.NewUser);

        setProgress("New user tasks finish.");
        logout();
    }

    /**
     * 日常任务流程
     */
    static async doDailyTasks() {
        try {
            // change server
            if (isServerOk(userInfo?.serverId) != true) {
                if (await transferServer(TargetServerId, 2 * 1000)) {
                    location.reload();
                    await sleep(10e3);
                }
            }
        } catch (e) {
            console.error('Error in transferServer');
        }

        const quests = new dailyQuests();
        try {
            await quests.init();
            await quests.getLatestHeroes();

            // 检测并打完第8关
            await this.checkPassMission8(quests);

            // arena - 1
            await doArena(quests.heroes);

            await activatePromocode();
            await quests.getExpedition();

            // check raid is able or not
            const raidable = await quests.checkRaidAble();
            if (userInfo?.level < TargetLevel && raidable) {
                await this.raidDailyTask(quests);
            } else if (userInfo?.level < TargetLevel) {
                await this.normalDailyTask(quests);
            }
        } catch (e) {
            console.error('Error in doDailyTasks');
        }

        try {
            // farm all
            await collectAllStuff();

            // change server
            if (isServerOk(userInfo?.serverId) != true) {
                await transferServer(TargetServerId, 2 * 1000);
            }
        } catch (e) {
            console.error('Error in doDailyTasks');
        }

        // Save status
        const userData = await refreshUserData();
        const keys = (userData['inventoryGet']?.consumable == null) ? 0 : userData['inventoryGet']?.consumable[45];
        StatusData.doneNo = parseEmailToNo(NXUserInfo?.email);
        StatusDataMana.saveUserTaskStatus(NXUserInfo?.email, userData['userGetInfo'].level, keys, userData['userGetInfo'].starMoney, userData['userGetInfo'].serverId);
        StatusDataMana.saveUserNo(StatusDataMana.UserType.ExistUser, NXUserInfo?.email);
        StatusDataMana.saveStatusData(TaskKeyEnum.Daily);

        setProgress("Daily tasks finish.");

        logout();
    }

    /**
     * 检测第一关地图是否完成到第8关
     * 如未完成,则完成至第8关结束
     */
    static async checkPassMission8(quests) {
        if (quests.missionNormal >= 8) {
            return;
        }
        for (let i = quests.missionNormal; i <= 8; i++) {
            await passMission({id: i, count: 0, maxCount: 1, hero: quests.heroes});
        }
    }

    /**
     * 建号时打竞技场
     */
    static async raidNewUserTask(quests) {
        // 打竞技场
        try {
            await quests.doRaidMission(1, 2);

            // farm all
            await questAllFarm();

            await sleep(1e3);
            await refreshUserInfo();
            await quests.checkTutorial();

            // arena - 1
            await quests.getLatestHeroes();
            await doArena(quests.heroes);

            // pass missions
            await quests.doRaidMission(5, 2);

            await this.raidAllEnergy(quests);

            // collect all
            await collectAllStuff();
            await this.raidAllEnergy(quests);
            // arena - 2
            if (getArenaWaitTime() < 15e3) {
                await doArena(quests.heroes);
            }

            await refreshUserInfo();
            const level = await getTeamLevel();
            if (level == (TargetLevel - 2) || level == (TargetLevel - 1)) {
                // 使用能量瓶 * 2
                for (let i = 0; i < 2; i++) {
                    await Send('{"calls":[{"name": "refillableBuyStamina", "args": {}, "ident": "body"}]}');
                }
            }
            // raid all energy
            for (let i = 0; i < 2; i++) {
                await this.raidAllEnergy(quests);
            }
            // 只差一级, 并且经验差少于一个竞技场任务的情况，做完竞技场任务
            if (await getTeamLevel() == (TargetLevel - 1) && userInfo.experience >= (250 - 90)) {
                for (let i = fightArenaCount; i < 3; i++) {
                    // arena - 3
                    await doArena(quests.heroes);
                }
            }
        } catch (e) {
            console.error('Error in raidNewUserTask');
        }
    }

    // 突袭用光所有能量
    static async raidAllEnergy(quests) {
        await refreshUserInfo();
        const times = parseInt(userInfo?.refillable[0]?.amount / 6);
        await quests.doRaidMission(8, times);
    }

    // 突袭日常任务
    static async raidDailyTask(quests) {
        await collectAllStuff();
        await sleep(1e3);
        await refreshUserInfo();

        const missionNormal = quests.missionNormal;
        const missionHero   = quests.missionHero;

        // get all energy
        let energy = userInfo?.refillable[0]?.amount;
        if (energy >= 12 * 3) {
            await quests.doRaidMission(missionHero, 3);
        }
        energy -= 12 * 3;
        let totalTimes = parseInt(energy / 6);
        let times = parseInt(totalTimes / 2);
        await quests.doRaidMission(missionNormal, times);

        // check team level
        if (await getTeamLevel() >= TargetLevel) {
            return;
        }

        // arena - 2
        if (getArenaWaitTime() < 15e3) {
            await doArena(quests.heroes);
        }

        // daily quests
        await quests.checkTutorial();
        await quests.doDailyQuests();

        // use up energy
        for (let i = 0; i < 4; i++) {
            await refreshUserInfo();
            energy = userInfo?.refillable[0]?.amount;
            if (energy < 6) {
                break;
            }
            await quests.doRaidMission(missionNormal, parseInt(energy / 6));
        }

        // check team level
        if (await getTeamLevel() >= TargetLevel) {
            return;
        }
        // arena - 3
        if (getArenaWaitTime() < 15e3) {
            await doArena(quests.heroes);
        }

        if (fightArenaCount < 3) {
            await questAllFarm();
            const level = await getTeamLevel();
            // 只差一级, 并且经验差少于一个竞技场任务的情况，做完竞技场任务
            if (level == (TargetLevel - 1) && userInfo.experience >= (250 - 90)) {
                for (let i = fightArenaCount; i < 3; i++) {
                    await doArena(quests.heroes);
                }
            }
        }
    }

    // 普通日常任务
    static async normalDailyTask(quests) {
        // pass missions (mission5 * 3 times)
        await quests.doMissionHero(3);

        // pass missions (mission8 * 7 times)
        await quests.doMissionNormal(7);

        // arena - 2
        await doArena(quests.heroes);

        // daily quests
        await quests.checkTutorial();
        await quests.doDailyQuests();

        // check team level
        if (await getTeamLevel() >= TargetLevel) {
            return;
        }
        // pass missions
        await passMission({id: 1, count: 0, maxCount: 3, hero: quests.heroes});
        await quests.doMissionNormal(5);

        // arena - 3
        await doArena(quests.heroes);
    }

    /**
     * 送钥匙流程
     */
    static async doGiftKeysTask() {
        StatusData = StatusDataMana.loadStatusData();

        try {
            const tasks = new giftTasks();
            await tasks.init();
            // Disable "Quantity control" in HeroWarsHelper
            const { checkboxes } = HWHData;
            if (checkboxes) {
                checkboxes["countControl"].cbox.checked = false;
            }
            await tasks.doGiftKeys(StatusData.guildId);
            await TaskHelper.sendDailyGifts();

            // 退出公会
            if (await tasks.quitGuild() == false) {
                setProgress('退出公会失败');
                return false;
            }
        } catch (e) {}

        // Save status
        StatusData.doneNo = parseEmailToNo(NXUserInfo?.email);
        StatusDataMana.saveStatusData(TaskKeyEnum.GiftKey);

        logout();
    }

    // 加入公会任务
    static async doJoinGuildTasks() {
        try {
            // join guild
            StatusData = StatusDataMana.loadStatusData();
            await new giftTasks().joinGuildForAoc(StatusData.guildId);

            // save join guild status
            if (RunningTask == RunningTaskEnum.JoinGuild) {
                StatusData.doneNo = parseEmailToNo(NXUserInfo?.email);
                StatusDataMana.saveStatusData(TaskKeyEnum.JoinGuild);
            } else if (RunningTask == RunningTaskEnum.ExtUserJoinGuild) {
                const userManager = sharedWindow.userManagerUI.userManager;
                StatusData.doneNo = userManager.getIndexByMail(NXUserInfo?.email);

                // 自动改名字
                if (userInfo?.name.startsWith("Team ") && userInfo?.name.length >= 13) {
                    const atIndex = NXUserInfo.email.indexOf('@');
                    const username = NXUserInfo.email.substring(0, atIndex);
                    const match = username.match(/(\d{2,3})$/);
                    if (match) {
                        const firstChar = username.charAt(0);
                        const no = match[1].padStart(3, '0');
                        await Send(`{"calls":[{"name":"setName","args":{"name": "${firstChar}${no}"},"ident":"setName"}]}`);
                    }
                }
                StatusDataMana.saveStatusData(TaskKeyEnum.ExtUser);
            }

            logout();
        } catch (e) {
            location.reload();
        }
    }

    // 自动登录
    static async doAutoLogin() {
        const no = parseEmailToNo(NXUserInfo?.email);

        // 自动改名字
        if (userInfo?.name.startsWith("Team ") && userInfo?.name.length >= 13) {
            await Send(`{"calls":[{"name":"setName","args":{"name": "No${no}"},"ident":"setName"}]}`);
        }

        TaskHelper.sendDailyGifts();
        collectAllStuff();
        TaskHelper.collectAocCoins();

        // save join guild status
        StatusData.doneNo = no;
        StatusDataMana.saveStatusData(TaskKeyEnum.JoinGuild);
    }

    static async doAoCAutoUpgrade() {
        TaskHelper.sendDailyGifts();
        collectAllStuff();
        await TaskHelper.collectAocCoins();

        // save join guild status
        await sleep(1e3);
        StatusData.doneNo = parseEmailToNo(NXUserInfo?.email);
        StatusDataMana.saveStatusData(TaskKeyEnum.JoinGuild);
        logout();
    }

    // 外部用户登录
    static async doExtUserLogin() {
        // save ext user login status
        await sleep(1e3);
        const userManager = sharedWindow.userManagerUI.userManager;
        StatusData.doneNo = userManager.getIndexByMail(NXUserInfo?.email);
        StatusDataMana.saveStatusData(TaskKeyEnum.ExtUser);

        // 送每日礼物
        TaskHelper.sendDailyGifts();

        // 自动种地
        const winter = new WinterfestTask();
        await winter.doAllTasks();

        // 取得所有礼物
        await collectAllStuff();

        if (RunningTask == RunningTaskEnum.ExtUserLogin) {
            await sleep(1e3);
            logout();
        }
    }
}

class TaskHelper {
    static async collectAocCoins() {
        // update
        await Send('{"calls":[{"name":"clanDomination_passiveQueueReward","args":{},"ident":"body"}]}');
        await Send('{"calls":[{"name":"clanDomination_updateFarm","args":{},"ident":"body"}]}');

        await sleep(10e3);
        let res = await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"group_1_body"}]}');
        const allCoins = res.results[0].result?.response?.coin;
        const aocCoins = (allCoins == null) ? 0 : allCoins[46];

        if (aocCoins > 0) {
            res = await Send(`{"calls":[{"name":"clanCastle_upgrade","args":{"optionId": 1, "amount": ${aocCoins}},"ident":"clanCastle_upgrade"}]}`);
            if (res != null && res.error == null) {
                setProgress(`捐献城堡币 ${aocCoins}`);
            } else {
                setProgress(`捐献城堡币失败`);
            }
        }
    }

    // 送每日礼物
    static async sendDailyGifts() {
        return await Send('{"calls":[{"name":"clanSendDailyGifts","args":{},"ident":"body"}]}');
    }

    // 开神器宝箱，每次10个钥匙
    static async sendArtifactChestOpen(free, times) {
        for (let i = 0; i < times; i++) {
            await Send(`{"calls":[{"name":"artifactChestOpen","args":{"amount": 10, "free": ${free}},"ident":"body"}]}`);
        }
    }
}


/**
 * 判断是否是冬日节期间
 */
function isInWinterfestPeriod() {
    return !(today < "20251220" || today > "20260102");
}

// 冬日节相关任务
class WinterfestTask {
    async doAllTasks() {
        // 判断是否是圣诞活动区间
        if (!isInWinterfestPeriod()) return;

        // 升级圣诞树
        await this.decorateTree();

        // 种地 & 收集
        await this.seasonAdventureFarm2025();

        // 使用能量来突袭(100次)
        // await this.useRaid(100);

        // 走冒险岛地图
        // await this.seasonAdventureMap202512();

        // 升级圣诞树
        await this.decorateTree();
    }

    // 自动选礼物
    async autoSelectGifts() {
        //  2: 绿钻
        //  7: 突袭券/大皮石
        // 10: 图腾柱
        await Send('{"calls":[{"name": "newYear_selectGifts", "args": {"ids": [2,7,10]},"ident": "group_1_body"}]}');
    }

    // 绿宝升级圣诞树
    static async decorateTreeByEmeralds(times) {
        for (let i = 0; i < times; i++) {
            await Send('{"calls":[{"name": "newYear_fireworksLaunch", "args": {"hideName": true, "hideClan": true},"ident": "body"}]}');
        }
    }

    // 2025年冬日节期间 种地
    async seasonAdventureFarm2025() {
        try {
            const seasonAdventureId = 17;
            // 激活地图
            await Send(`{"calls":[{"name":"seasonAdventure_getMapState","args":{"seasonAdventureId": ${seasonAdventureId}},"ident":"body"}]}`);

            let levelId = 7118;
            if (today <= "20251226") {
                // 种糖果
                let i = 0;
                for ( ; i < 5; i++) {
                    if (await this.seasonAdventureFarm(seasonAdventureId, levelId)) {
                        break;
                    }
                }
                if (i > 0) setProgress(`种糖果 ${i} 次`);
            } 
            // 收集奖励
            await Send(`{"calls":[{"name":"seasonAdventure_collectDelayedRewards","args":{"seasonAdventureId": ${seasonAdventureId}, "levelId": ${levelId}},"ident":"body"}]}`);

            levelId = 6506;
            if (today <= "20251226") {
                // 种绿钻
                for (i = 0; i < 5; i++) {
                    if (await this.seasonAdventureFarm(seasonAdventureId, levelId)) {
                        break;
                    }
                }
                if (i > 0) setProgress(`种绿钻 ${i} 次`);
            }
            // 收集奖励
            await Send(`{"calls":[{"name":"seasonAdventure_collectDelayedRewards","args":{"seasonAdventureId": ${seasonAdventureId}, "levelId": ${levelId}},"ident":"body"}]}`);
        } catch (e) { }
    }

    // 查询种地情况，并开始种地
    async seasonAdventureFarm(seasonAdventureId, levelId) {
        // 查询
        let res = await Send(`{"calls":[{"name":"seasonAdventure_exploreLevel","args":{"seasonAdventureId": ${seasonAdventureId}, "levelId": ${levelId}},"ident":"body"}]}`);
        if (res == null || res.error != null || res.results[0].result.response.levels[levelId]?.steps[0].isProcessed == true) {
            return true;
        }

        // 种地
        res = await Send(`{"calls":[{"name":"seasonAdventure_processLevel","args":{"seasonAdventureId": ${seasonAdventureId}, "levelId": ${levelId}},"ident":"body"}]}`);
        return false;
    }

    // 走冒险岛地图
    async seasonAdventureMap202512() {
        // 2025/12地图及路径
        const seasonAdventureId = 17;
        const route = [2600,2774,2768,2588,2414,2246,2240,2234,2396,2564,2738,2918,3104,3296,3494,3698,3908,4124,4346,4574,4808,4802,4796,4556,4550,4544,4538,4772,5012,5006,5252,5510,5774,5780,2390,2222,2216,2210,2048,2042,1886,1880,1874,2024,2018,1862,1856,2006,2162,2324,2318,2312,2480,2660,2840,2834,2828,3014,3212];        
        let res = true;

        setProgress('开始走地图');
        const saTask = new SeasonAdventureTask();
        for (let i = 0; i < route.length; i++) {
            if (await saTask.seasonAdventureProcess(seasonAdventureId, route[i]) == false) {
                res = false;
                break;
            }
            setProgress(`走地图 ${i+1}/${route.length}`);
        }
        setProgress('走地图' + (res ? '完成' : '失败'));
    }

    // 使用能量 可以突袭的情况下
    async useRaid(times) {
        const quest = new dailyQuests();
        if (quest.checkRaidAble(true)) {
            quest.doRaidMissionMulti(2, times);
        } else if (quest.checkRaidAble(false)) {
            quest.doRaidMission(2, times);
        }
    }

    // 升级圣诞树
    async decorateTree() {
        // 取得当前糖果
        const res = await Send('{"calls":[{"name":"inventoryGet","args":{},"ident":"body"}]}');
        const coins = res.results[0]?.result?.response?.coin;
        if (coins != null && coins[17] != null) {
            // 捐献所有糖果
            await Send(`{"calls":[{"name":"newYear_decorateTree","args":{"optionId": 1, "amount": ${coins[17]}},"ident":"body"}]}`);
        }
    }
}

// 用于记录神秘岛地图路线
let seasonAdventureId = null;
let seasonAdventureRoute = [];
let originalSend = null;
const decoder = new TextDecoder("utf-8");

// 显示记录神秘岛地图路线
function showAdventureProcess(id=null, route=null) {
    let message = '正在记录冒险岛地图路径';
    if (id != null) {
        message += '<br>地图ID:' + id;
        message += '<br>路径:' + formatSeasonAdventureRoute(route);
    }

    setProgress(message, false);
}

function formatSeasonAdventureRoute(route) {
    let count = 0;
    let message = '';
    
    route.forEach(e => {
        message += e + ',';
        count++;
        if (count == 10) {
            count = 0;
            message += '<br>';
        }
    })
    return message;
}

// 神秘岛地图任务
class SeasonAdventureTask {
    // 开始记录地图路径
    async startRecordMapRoute() {
        // 初始化神秘岛地图路线
        seasonAdventureId = null;
        seasonAdventureRoute = [];

        // 显示开始记录
        showAdventureProcess();

        // 保存原始 send 方法
        originalSend = XMLHttpRequest.prototype.send;

        Object.defineProperty(XMLHttpRequest.prototype, 'send', {
            value: function(...args) {
                try {
                    let tempData = null;

                    if (args[0] == '') return;

                    if (getClass(args[0]) == "ArrayBuffer") {
                        tempData = decoder.decode(args[0]);
                    } else {
                        tempData = args[0];
                    }
                    const testData = JSON.parse(tempData);
                    // 在调用前拦截
                    for (const call of testData.calls) {
                        // console.log('send called with:', call);
                        if (call.name == 'seasonAdventure_exploreLevel') {
                            if (seasonAdventureId == null) seasonAdventureId = call.args.seasonAdventureId;
                            seasonAdventureRoute.push(call.args.levelId);

                            showAdventureProcess(seasonAdventureId, seasonAdventureRoute);
                        }
                    }
                } catch (error) {
                }

                // 调用原始方法
                return originalSend.apply(this, args);
            }
        });
    }

    // 完成记录地图路径
    async finishRecordMapRoute() {
        if (originalSend != null) {
            XMLHttpRequest.prototype.send = originalSend;
            originalSend = null;
        }

        // 显示地图路径
        let message = `路径如下，请拷贝保存。<br>${seasonAdventureId}-${formatSeasonAdventureRoute(seasonAdventureRoute)}`;
        await popupSimple(message);
    }

    // 解析地图格式
    parseRoute(routeStr) {
        // 分割ID和路径部分
        const parts = routeStr.split('-');

        if (parts.length !== 2) {
            throw new Error('Invalid format: should be "ID-Route1,Route2,..."');
        }

        const [id, routes] = parts;
        // 去除末尾的逗号
        const cleanedRouteStr = routes.replace(/,$/, '');
        
        // 分割路径字符串为数组
        const routeArray = cleanedRouteStr ? cleanedRouteStr.split(',').filter(item => item !== '') : [];

        // 构建JSON对象
        return {
            ID: id,
            Route: routeArray
        };
    }

    // 走冒险岛地图
    async routeSeasonAdventure(seasonAdventureId, route) {
        const answer = await popupSimple(`需要${route.length}放大镜,请确认有足够的放大镜。`);
        if (!answer) return;

        let res = true;
        setProgress('开始走地图');
        const saTask = new SeasonAdventureTask();
        for (let i = 0; i < route.length; i++) {
            if (await saTask.seasonAdventureProcess(seasonAdventureId, route[i]) == false) {
                res = false;
                break;
            }
            setProgress(`走地图 ${i+1}/${route.length}`);
        }
        setProgress('走地图' + (res ? '完成' : '失败'));
    }

    // 在神秘岛移动一步
    async seasonAdventureProcess(seasonAdventureId, levelId) {
        let res = await Send(`{"calls":[{"name":"seasonAdventure_exploreLevel","args":{"seasonAdventureId": ${seasonAdventureId}, "levelId": ${levelId}},"ident":"body"}]}`);
        if (res == null || res.error != null) {
            return false;
        }
        res = await Send(`{"calls":[{"name":"seasonAdventure_processLevel","args":{"seasonAdventureId": ${seasonAdventureId}, "levelId": ${levelId}},"ident":"body"}]}`);
        if (res == null || res.error != null) {
            return false;
        }
        return true;
    }
}


// TODO Not useful for now
// AoC attack
let aocTargetId = 0;
let autoRepeatAoCAttack = false;

async function startAutoRepeatAoCAttack() {
    if (autoRepeatAoCAttack == true) {
        return;
    }

    // do repeat
    autoRepeatAoCAttack = true;
    let count = 0;
    for (const refillable of userInfo.refillable) {
        if (refillable.id == 55) {
            count = refillable.amount;
            break;
        }
    }

    // battle
    for (let i = 0; i < count - 1; i++) {
        const sleepTime = (Math.random() * (15 - 10 + 1) + 10) * 1000;
        await sleep(sleepTime);

        const res = await Send(`{"calls":[{"name":"clanDomination_startBattle","args":{"targetId": "${aocTargetId}"},"ident":"body"}]}`);
        if (res == null || res.error != null) {
            break;
        }
        setProgress(`Attack ${i+1} times.`);
    }

    aocTargetId = 0;
    autoRepeatAoCAttack = false;

    setProgress(`Attack finished.`);
}


/**
 * Logout
 * @returns
 */
async function logout() {
    if (isExtensionAlive) {
        try {
            await callExtensionToClearCookies();
            location.reload();
        } catch (e) {
            NXLogout();
        }
    } else {
        for (let i = 0; i < 2; i++) {
            try {
                await sleep(2000);
                NXLogout();
                return;
            } catch (e) {}
        }

        // after 10s, reload
        await sleep(10e3);
        location.reload();
    }
}

// 判断清除Cookie扩展是否存在
let isExtensionAlive = false;
function callToCheckExtension() {
    return new Promise((resolve, reject) => {
        // 创建一次性消息监听器
        function handleResponse(event) {
            if (event.data.type === 'CHECK_ALIVE_RESPONSE') {
                window.removeEventListener('message', handleResponse);
                if (event.data.success) {
                    resolve(event.data);
                } else {
                    reject(new Error(event.data.message));
                }
            }
        }

        // 监听响应
        window.addEventListener('message', handleResponse);

        // 发送清除请求
        window.postMessage({
            type: 'CHECK_ALIVE_FROM_TAMPERMONKEY'
        }, '*');

        // 设置超时
        setTimeout(() => {
            window.removeEventListener('message', handleResponse);
            reject(new Error('Request timeout'));
        }, 5000);
    });
}

// 判断清除Cookie扩展是否存在
async function checkExtensionAlive() {
    try {
        await callToCheckExtension();
        isExtensionAlive = true;
    } catch (error) {
        isExtensionAlive = false;
    }
}

// 清除cookie
function callExtensionToClearCookies() {
    return new Promise((resolve, reject) => {
        // 创建一次性消息监听器
        function handleResponse(event) {
            if (event.data.type === 'CLEAR_COOKIES_RESPONSE') {
                window.removeEventListener('message', handleResponse);
                if (event.data.success) {
                    resolve(event.data);
                } else {
                    reject(new Error(event.data.message));
                }
            }
        }

        // 监听响应
        window.addEventListener('message', handleResponse);

        // 发送清除请求
        window.postMessage({
            type: 'CLEAR_COOKIES_FROM_TAMPERMONKEY'
        }, '*');

        // 设置超时
        setTimeout(() => {
            window.removeEventListener('message', handleResponse);
            reject(new Error('Request timeout'));
        }, 5000);
    });
}

// 判断HWH插件是否加载
function checkHWHLoaded() {
    if (typeof HWHFuncs == 'undefined') {
        return false;
    }

    // setup functions
    this.send = this.HWHFuncs.send;
    this.hideProgress = this.HWHFuncs.hideProgress;
    this.setProgress = this.HWHFuncs.setProgress;
    this.addProgress = this.HWHFuncs.addProgress;
    this.getTimer = this.HWHFuncs.getTimer;
    this.countdownTimer = this.HWHFuncs.countdownTimer;
    this.popup = this.HWHFuncs.popup;

    return true;
}

// 设置HWH插件的参数
function setupHWHelperOptions() {
    localStorage.setItem('HeroWarsHelper:repeatMission', false);
    localStorage.setItem('HeroWarsHelper:noOfferDonat', true);
    localStorage.setItem('HeroWarsHelper:sendExpedition', true);
    localStorage.setItem('HeroWarsHelper:countControl', false);
}

// pass mission
let isStopSendMission = false;
let hasErrorInSendMission = false;
async function passMission(param) {
    isStopSendMission = false;
    hasErrorInSendMission = false;
    sendsRepeatMission(param);
    while (isStopSendMission == false) {
        await sleep(2e3);
    }

    if (hasErrorInSendMission) {
        // resend mission once
        sendsRepeatMission(param);
        while (isStopSendMission == false) {
            await sleep(2e3);
        }
    }
}

class StatusDataMana {
    static UserType = {
        NewUser:    1,
        ExistUser:  2,
    };

    static UserStatus = {
        Done:   1,
    };

    // TODO load startup data ?
    // new method

    static getTaskStr(task) {
        switch(task) {
            case RunningTaskEnum.Stop:
                return "停止";
            case RunningTaskEnum.NewUser:
                return "创建新用户";
            case RunningTaskEnum.Daily:
                return "日常";
            case RunningTaskEnum.GiftKey:
                return "送钥匙";
            case RunningTaskEnum.WinterGift:
                return "送冬季礼物";
            case RunningTaskEnum.JoinGuild:
                return "加入公会";
            case RunningTaskEnum.JoinGuildAutoLogin:
                return "自动登录";
            case RunningTaskEnum.AoCAutoUpgrade:
                return "自动捐献城堡币";
            case RunningTaskEnum.ExtUserLogin:
            case RunningTaskEnum.ExtUserLoginNoLogout:
                return "外部用户登录";
            case RunningTaskEnum.ExtUserJoinGuild:
                return "外部用户加入公会";
            default:
        }
        return "";
    }

    static changeRunningTask(task) {
        RunningTask = task;
        // save Running Task status
        storage.set('RunningTask', {
            'date': today,
            'task': RunningTask,
        });

        if (RunningTask != RunningTaskEnum.Stop) {
            LastTask = RunningTask;
        }
        storage.set('LastTask', LastTask);
    }

    static getRunningTask() {
        const task = storage.get('RunningTask');
        if (task == null) {
            return RunningTaskEnum.Stop;
        // 跨天也可以继续执行
        // } else if (task.date != today) {
        //     return RunningTaskEnum.Stop;
        }

        return task.task;
    }

    // TODO load startup data
    static getLastTask() {
        return storage.get('LastTask');
    }

    // 取得运行用户的起始编号
    static getStartUserNo(no) {
        let userNo = no;
        const count = Number(getInput('userCount'));
        if (count == 1) {
            userNo = no;
        } else if (count < 100) {
            userNo = parseInt((no-1) / count) * count + 1;
        } else {
            userNo = parseInt((no-1) / 100) * 100 + 1;
        }

        return userNo;
    }

    // 保存运行用户的起始编号
    static saveStartUserNo(no) {
        const userNo = this.getStartUserNo(no);
        const subKey = getInput('userPrefix') + ":" + getInput('userMail');
        let value = {};
        value[subKey] = userNo;
        storage.set('StartUserNo', value);

        return userNo;
    }

    // 读取运行用户的起始编号
    static loadStartUserNo() {
        const subKey = getInput('userPrefix') + ":" + getInput('userMail');
        const value = storage.get('StartUserNo');

        if (value != null && value[subKey] != null) {
            return Number(value[subKey]);
        }
        return 1;
    }

    /**
     * 保存用户的任务运行状况
     *
     * @param {*} userEmail
     * @param {*} level
     */
    static saveUserTaskStatus(userEmail, level, keys = 0, starMoney = 0, serverId = 0) {
        if (userEmail == null) {
            return;
        }

        const key = 'users:' + userEmail;
        storage.set(key, {
            'date': today,
            'status': this.UserStatus.Done,
            'level': level,
            'keys': keys,
            'starMoney': starMoney,
            'serverId': serverId
        });
    }

    /**
     * 读取用户的任务运行状况
     *
     * @param {*} userEmail
     * @returns
     */
    static loadUserStatus(userEmail) {
        if (userEmail == null) {
            return null;
        }

        const key = 'users:' + userEmail;
        return storage.get(key);
    }

    /**
     * 保存已完成用户的编号
     *
     * @param {*} userType
     * @param {*} no
     */
    static saveUserNo(userType, email) {
        const key = (userType == this.UserType.NewUser) ? "userstatus:new" : "userstatus:exist";

        let value = {};
        const subKey = getInput('userPrefix') + ":" + getInput('userMail');
        // parse email to number
        value[subKey] = parseEmailToNo(email);

        storage.set(key, value);
    }

    /**
     * 取得下一个用户的编号
     *   (已完成用户编号+1)
     *
     * @param {*} prefix
     * @param {*} suffix
     * @param {*} userType
     * @returns
     */
    static getNextUserNo(userType) {
        const key = (userType == this.UserType.NewUser) ? "userstatus:new" : "userstatus:exist";
        const value = storage.get(key);
        if (value == null) {
            return StartUserNo;
        }

        const subKey = getInput('userPrefix') + ":" + getInput('userMail');
        if (value[subKey] >= StartUserNo && value[subKey] < StartUserNo + Number(getInput('userCount')) - 1) {
            return Number(value[subKey]) + 1;
        }
        return StartUserNo;
    }

    /**
     * 判断账户是否达到完成的状况
     * 级别 >= 指定级别，并且满足以下任一条件，账户完成。否则未完成
     *  钥匙 >= 10
     *  绿宝 >= 3000
     *  800 <= 绿宝 < 3000
     */
    static isAccountDone(level, keys, starMoney) {
        level = (level == null) ? 0 : parseInt(level);
        keys = (keys == null) ? 0 : parseInt(keys);
        starMoney = (starMoney == null) ? 0 : parseInt(starMoney);

        if (level >= TargetLevel) {
            if (keys >= 10 ||
                starMoney >= 3000 ||
                (starMoney >= 800 && starMoney < 3000)) {
                    return true;
            }
        }
        return false;
    }

    // 查找下一个可以运行的 日常任务 的用户编号
    static getNextRunnableDailyUserNo(startIndex = 1) {
        let i = (startIndex < StatusData.startNo) ? StatusData.startNo : startIndex;
        for ( ; i <= StatusData.endNo; i++) {
            let mail = getUserMail(i);

            const value = storage.get('users:' + mail);
            if (value == null) {
                return i;
            }
            if (value.date != today) {
                if (StatusDataMana.isAccountDone(value.level, value.keys, value.starMoney) == false) {
                    return i;
                }
            }
        }

        return StatusData.endNo + 1;
    }

    // 获取以下信息
    //  未创建用户
    //  30级以下用户
    //  30级及以上用户(无10钥匙)
    //  30级及以上用户(有10钥匙)
    static getRunResult(userNo) {
        // 获取以下信息
        // 未创建用户
        let none = 0;
        // 30级以下用户
        let lowerThan30 = 0;
        // 30级及以上用户(无10钥匙)
        let over30NoKeys = 0;
        // 30级及以上用户(有10钥匙)
        let over30WithKeys = 0;

        let startIndex = this.getStartUserNo(userNo);
        for (let i = startIndex; i < startIndex + Number(getInput('userCount')); i++) {
            let mail = getUserMail(i);
            const value = storage.get('users:' + mail);
            if (value == null) {
                none = Number(getInput('userCount')) - lowerThan30 - over30NoKeys - over30WithKeys;
                break;
            } else if (value.level >= TargetLevel) {
                if (this.isAccountDone(value.level, value.keys, value.starMoney)) {
                    over30WithKeys++;
                } else {
                    over30NoKeys++;
                }
            } else {
                lowerThan30++;
            }
        }

        return {
            'none': none,
            'lowerThan30': lowerThan30,
            'over30NoKeys': over30NoKeys,
            'over30WithKeys': over30WithKeys,
        };
    }

    // 查找所有未完成的用户
    static findUnfinishedUser(userNo) {
        let result = [];
        let startIndex = this.getStartUserNo(userNo);
        for (let i = startIndex; i < startIndex + Number(getInput('userCount')); i++) {
            const key = 'users:' + getUserMail(i);
            const value = storage.get(key);

            if (value == null) {
                result.push(i);
            } else if (StatusDataMana.isAccountDone(value.level, value.keys, value.starMoney) == false) {
                result.push(i);
            }
        }

        return result;
    }

    // 查找所有未创建的用户
    static findUncreatedUser(userNo) {
        let result = [];
        let startIndex = this.getStartUserNo(userNo);
        for (let i = startIndex; i < startIndex + Number(getInput('userCount')); i++) {
            const key = 'users:' + getUserMail(i);
            const value = storage.get(key);

            if (value == null) {
                result.push(i);
            }
        }

        return result;
    }

    // 查找用户的服务器ID
    static findUsersServerId(userNo) {
        let result = {"Unknown": []};
        let startIndex = this.getStartUserNo(userNo);
        for (let i = startIndex; i < startIndex + Number(getInput('userCount')); i++) {
            const key = 'users:' + getUserMail(i);
            const value = storage.get(key);

            if (value == null || value.serverId == null || value.serverId == 0) {
                result["Unknown"].push(i);
            } else {
                if (result[value.serverId] == null) result[value.serverId] = [];
                result[value.serverId].push(i);
            }
        }

        return result;
    }

    static saveStatusData(suffix = null) {
        StatusDataMana.changeRunningTask(RunningTask);

        const key = (suffix == null) ? 'StatusData' : `StatusData:${suffix}`;
        storage.set(key, {
            'guildId': StatusData.guildId,
            'startNo': StatusData.startNo,
            'endNo': StatusData.endNo,
            'doneNo': StatusData.doneNo
        });
    }

    static loadStatusData() {
        const task = (RunningTask == RunningTaskEnum.Stop) ? LastTask : RunningTask;

        const suffix = runningTaskToTaskKey(task);
        const key = (suffix == null) ? 'StatusData' : `StatusData:${suffix}`;
        const value = storage.get(key);
        if (value == null) {
            return {
                startNo: 1,
                endNo: 29,
                doneNo: 0,
                guildId: 0
            };
        }
        return value;
    }
}

// 开始新用户注册
async function showNewUserTaskConfirm() {
    const inputMsg = getInput('userPrefix') + "+用户编号" + getInput('userMail');
    let no = StatusDataMana.getNextUserNo(StatusDataMana.UserType.NewUser);

    const answer = await popup.confirm(
        '开始新用户登录。<br>请输入开始的用户编号,用户邮箱为: ' + inputMsg,
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: no
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    StartUserNo = StatusDataMana.saveStartUserNo(Number(answer));

    RunningTask = RunningTaskEnum.NewUser;
    StatusData.guildId = null;
    StatusData.startNo = StartUserNo;
    StatusData.endNo   = StatusData.startNo + Number(getInput('userCount')) - 1;
    StatusData.doneNo  = Number(answer) - 1;
    StatusDataMana.saveStatusData(TaskKeyEnum.NewUser);

    // start register new user
    await startTask(registerSingleUser);
}

// 开始日常任务
async function showDailyTaskConfirm() {
    const inputMsg = getInput('userPrefix') + "+用户编号" + getInput('userMail');
    let no = StatusDataMana.getNextUserNo(StatusDataMana.UserType.ExistUser);

    const answer = await popup.confirm(
        '开始用户每日任务。<br>请输入开始的用户编号,用户邮箱为: ' + inputMsg,
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: no
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    StartUserNo = StatusDataMana.saveStartUserNo(Number(answer));

    RunningTask = RunningTaskEnum.Daily;
    StatusData.guildId = null;
    StatusData.startNo = StartUserNo;
    StatusData.endNo   = StatusData.startNo + Number(getInput('userCount')) - 1;
    StatusData.doneNo  = StatusDataMana.getNextRunnableDailyUserNo(StartUserNo) - 1;
    StatusDataMana.saveStatusData(TaskKeyEnum.Daily);
    await startTask();
}

// 送钥匙
async function showGiftKeysConfirm() {
    title = '送钥匙';
    inputs = [
        {name: '公会ID', default: 116022},
        {name: '开始编号', default: 1},
        {name: '数量', default: 100},
    ];

    createFormDialog(title, inputs, function (values) {
        // Change status
        RunningTask = RunningTaskEnum.GiftKey;
        StatusData.guildId = Number(values[0].value);
        StatusData.startNo = Number(values[1].value);
        StatusData.endNo   = StatusData.startNo + Number(values[2].value) - 1;
        StatusData.doneNo  = StatusData.startNo - 1;

        StatusDataMana.saveStatusData(TaskKeyEnum.GiftKey);
        startTask();
    });
}

// 跳过用户任务
async function skipConfirm() {
    const answer = await popup.confirm(
        '是否跳过当前任务',
        [
            {
                msg: I18N_G('BTN_OK'),
                result: true,
                isCancel: false
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // Save status
    StatusDataMana.saveUserTaskStatus(NXUserInfo?.email, TargetLevel);
    StatusData = StatusDataMana.loadStatusData();
    StatusData.doneNo = parseEmailToNo(NXUserInfo?.email);
    StatusDataMana.saveStatusData(runningTaskToTaskKey(RunningTask));

    // logout
    logout();
}

// 停止任务
async function stopConfirm() {
    const answer = await popup.confirm(
        '是否停止当前任务',
        [
            {
                msg: I18N_G('BTN_OK'),
                result: true,
                isCancel: false
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // stop task
    changeRunningTask(RunningTaskEnum.Stop);
    if (isInLoginScreen()) {
        location.reload();
    } else {
        await popup.confirm(
            '停止成功。当前账号运行完毕后停止，或请手动登出停止。',
            [{msg: I18N_G('BTN_OK'), result: false,isCancel: true},]
        );
    }
}

// 查找所有未完成的用户
async function findUnfinishedUser() {
    const answer = await popup.confirm(
        '查找所有未完成的用户<br>请输入要查找的开始用户编号',
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: StartUserNo
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // show result
    const result = StatusDataMana.findUnfinishedUser(answer);
    let msg = '';
    if (result.length == 0) {
        msg = '没有未完成的用户';
    } else {
        msg = '未完成的用户编号如下: <br>';
        let lineBreakCount = 0;
        for (no of result) {
            msg += no + ',';
            if (++lineBreakCount == 10) {
                msg += '<br>';
                lineBreakCount = 0;
            }
        }
    }
    await popup.confirm(
        msg,
        [{msg: I18N_G('BTN_OK'), result: false, isCancel: true},]
    );
}

// 查找所有未创建的用户
async function findUncreatedUser() {
    const answer = await popup.confirm(
        '查找所有未创建的用户<br>请输入要查找的开始用户编号',
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: StartUserNo
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // show result
    const result = StatusDataMana.findUncreatedUser(answer);
    let msg = '';
    if (result.length == 0) {
        msg = '没有未创建的用户';
    } else {
        msg = '未创建的用户编号如下: <br>';
        let lineBreakCount = 0;
        for (no of result) {
            msg += no + ',';
            if (++lineBreakCount == 10) {
                msg += '<br>';
                lineBreakCount = 0;
            }
        }
    }
    await popup.confirm(
        msg,
        [{msg: I18N_G('BTN_OK'), result: false, isCancel: true},]
    );
}

// 查找用户的服务器ID
async function findUsersServerId() {
    const answer = await popup.confirm(
        '查找用户的服务器ID<br>请输入要查找的开始用户编号',
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: StartUserNo
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // show result
    const result = StatusDataMana.findUsersServerId(answer);
    // 最多的
    let mostServerId = 0;
    let mostUserCount = 0;
    // 未知的
    let unknownUserCount = 0;
    Object.keys(result).forEach(e => {
        if (e == "Unknown") {
            unknownUserCount = result[e].length;
        } else {
            if (result[e].length > mostUserCount) {
                mostUserCount = result[e].length;
                mostServerId = e;
            }
        }
    })

    // 错误的
    let incorrectServerUsers = [];
    Object.keys(result).forEach(e => {
        if (e != "Unknown" && e != mostServerId) {
            incorrectServerUsers.push(result[e]);
        }
    })

    let msg = `用户的服务器ID: ${mostServerId} &nbsp;&nbsp; 人数: ${mostUserCount}<br>`;
    msg += `用户服务器ID未知的人数: ${unknownUserCount}<br>`;
    if (incorrectServerUsers.length > 0) {
        msg += `以下用户的服务器有误: <br>`;
        let lineBreakCount = 0;
        for (no of incorrectServerUsers) {
            msg += no + ',';
            if (++lineBreakCount == 10) {
                msg += '<br>';
                lineBreakCount = 0;
            }
        }
    }
    await popup.confirm(
        msg,
        [{msg: I18N_G('BTN_OK'), result: false, isCancel: true},]
    );
}

// 开始记录地图路径
async function startRecordMapRoute() {
    const answer = await popupSimple('是否开始记录地图路径？');
    if (!answer) return false;

    // show result
    const saTask = new SeasonAdventureTask();
    saTask.startRecordMapRoute();
}

// 完成记录地图路径
async function finishRecordMapRoute() {
    if (originalSend != null) {
        const answer = await popupSimple('是否完成记录地图路径？');
        if (!answer) return false;
    }

    // show result
    const saTask = new SeasonAdventureTask();
    saTask.finishRecordMapRoute();
}

// 走地图
async function routeMap() {
    const answer = await popupInputSimple('请输入地图路径:');
    if (!answer) return false;

    const saTask = new SeasonAdventureTask();
    const routeJson = saTask.parseRoute(answer);
    
    seasonAdventureId = routeJson.ID;
    seasonAdventureRoute = routeJson.Route;

    let res = await Send(`{"calls":[{"name":"seasonAdventure_getInfo","args":{},"ident":"body"}]}`);
    if (res.results[0].result.response.seasonAdventure.id != routeJson.ID) {
        await popupSimple('地图ID不正确，可能输入的并非本月地图路径。');
        return;
    }

    // 走冒险岛地图
    saTask.routeSeasonAdventure(routeJson.ID, routeJson.Route);
}

async function showGuildId() {
    await refreshUserInfo();
    if (userInfo == null || userInfo.clanId == null) {
        setProgress('请登录并加入公会');
        return;
    }

    await popup.confirm('公会ID:<br>' + userInfo.clanId, [{ msg: I18N_G('BTN_OK'), result: 0 }]);
}

async function confirmJoinGuild() {
    title = '加入公会';
    inputs = [
        {name: '公会ID', default: null},
        {name: '开始编号', default: 1},
        {name: '数量', default: 29},
    ];

    createFormDialog(title, inputs, function (values) {
        // Change status
        RunningTask = RunningTaskEnum.JoinGuild;
        StatusData.guildId = Number(values[0].value);
        StatusData.startNo = Number(values[1].value);
        StatusData.endNo   = StatusData.startNo + Number(values[2].value) - 1;
        StatusData.doneNo  = StatusData.startNo - 1;

        StatusDataMana.saveStatusData(TaskKeyEnum.JoinGuild);
        startTask();
    });
}

async function confirmAutoLogin() {
    const answer = await popup.confirm(
        '开始自动登录。<br>会顺序自动登录并修改用户名。<br>请输入开始的用户编号: ',
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: StartUserNo
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // Change status
    RunningTask = RunningTaskEnum.JoinGuildAutoLogin;
    StatusData.startNo = Number(answer);
    StatusData.endNo   = 0;
    StatusData.doneNo  = StatusData.startNo - 1;

    StatusDataMana.saveStatusData(TaskKeyEnum.JoinGuild);
    // TODO 动作确认
    startTask();
    // startAutoLogin();
}

async function confirmAoCAutoUpgrade() {
    const answer = await popup.confirm(
        '开始自动捐献城堡币。<br>会顺序自动登录并捐献城堡币。<br>请输入开始的用户编号: ',
        [
            {
                msg: I18N_G('BTN_OK'),
                placeholder: '用户编号',
                isInput: true,
                default: StartUserNo
            },
            {
                msg: I18N_G('BTN_CANCEL'),
                result: false,
                isCancel: true
            },
        ]
    );

    if (!answer) {
        return false;
    }

    // Change status
    RunningTask = RunningTaskEnum.AoCAutoUpgrade;
    StatusData.startNo = Number(answer);
    StatusData.endNo   = 0;
    StatusData.doneNo  = StatusData.startNo - 1;

    StatusDataMana.saveStatusData(TaskKeyEnum.JoinGuild);
    // TODO 动作确认
    startTask();
    // startAoCAutoUpgrade();
}

/**
 * Returns the class name of the passed object
 */
function getClass(obj) {
	return {}.toString.call(obj).slice(8, -1);
}

async function doTemp() {
    // 走地图
    new WinterfestTask().seasonAdventureMap202512();
}

// 外部用户多用户连续自动登录，需手动登出
async function extAutoLogin(isLogout = false) {
    if (sharedWindow == null) {
        await popup.confirm(
            "没有找到HeroWarsAutoLogin插件,请加载后再执行。",
            [{msg: I18N_G('BTN_OK'), result: false, isCancel: true},]
        );
        return;
    }

    const ui = sharedWindow.userManagerUI;
    const res = await ui.showSelectUserDialog();
    if (res == false) {
        return;
    }
    const userManager = ui.userManager;
    const selectedUser = ui.selectedUser;
    const startNo = userManager.getIndexByMail(selectedUser);

    // Save status
    if (isLogout)
        RunningTask = RunningTaskEnum.ExtUserLogin;
    else 
        RunningTask = RunningTaskEnum.ExtUserLoginNoLogout;
    StatusData = {
        startNo: startNo,
        endNo: userManager.getUserCount(),
        doneNo: startNo - 1,
        guildId: 0
    }
    StatusDataMana.saveStatusData(TaskKeyEnum.ExtUser);

    startExtTask();
}

// 外部用户加入公会
async function extJoinGuild() {
    if (sharedWindow == null) {
        await popup.confirm(
            "没有找到HeroWarsAutoLogin插件,请加载后再执行。",
            [{msg: I18N_G('BTN_OK'), result: false, isCancel: true},]
        );
        return;
    }

    // 选择开始用户
    const ui = sharedWindow.userManagerUI;
    const res = await ui.showSelectUserDialog();
    if (res == false) {
        return;
    }

    // 输入公会
    const guildId = prompt("请输入公会ID:", "");
    if (guildId === null) { 
        return;
    }

    const userManager = ui.userManager;
    const selectedUser = ui.selectedUser;
    const startNo = userManager.getIndexByMail(selectedUser);

    // Save status
    RunningTask = RunningTaskEnum.ExtUserJoinGuild;
    StatusData = {
        startNo: startNo,
        endNo: userManager.getUserCount(),
        doneNo: startNo - 1,
        guildId: Number(guildId)
    }
    StatusDataMana.saveStatusData(TaskKeyEnum.ExtUser);

    startExtTask();
}

// 捐献绿宝给圣诞树升级
async function decorateTreeByEmeralds() {
    // 绿宝
    const userData = await refreshUserData();
    const starMoney = (userData['userGetInfo'] == null) ? 0 : userData['userGetInfo']?.starMoney;
    const times = parseInt(starMoney / 10000);
    if (times == 0) {
        setProgress('绿钻不够放烟花');
        return;    
    }

    const count = prompt("请输入烟花数量:", `${times}`);
    if (count > 0) {
        setProgress(`开始放烟花`);
        await WinterfestTask.decorateTreeByEmeralds(count);
        await collectAllStuff();
        setProgress(`放烟花${count}次`);
    }
}

// 开始任务
async function startExtTask() {
    StatusData = StatusDataMana.loadStatusData();

    // reach max user
    if (StatusData.endNo > 0 && StatusData.doneNo >= StatusData.endNo) {
        finishRunningTask();
        return;
    }

    const userManager = sharedWindow.userManagerUI.userManager;
    const user = userManager.getUserByIndex(StatusData.doneNo + 1);

    const param = {
        "username" : user.email,
        "password" : user.password,
    };

    changeRunningTask(RunningTask);
    await loginUser(param);
}

/**
 * Running status
 *   0: stop
 *   1: new user task running
 *   2: daily task running
 *   3: gift keys task running
 *   4: winter gift task running
 */
const RunningTaskEnum = {
  Stop:         0,
  NewUser:      1,
  Daily:        2,
  GiftKey:      3,
  WinterGift:   4,
  JoinGuild:    5,
  JoinGuildAutoLogin:   51,
  AoCAutoUpgrade:       52,
  ExtUserLogin:         61,
  ExtUserLoginNoLogout: 62,
  ExtUserJoinGuild:     63,
};

const TaskKeyEnum = {
  NewUser:      'New',
  Daily:        'Daily',
  GiftKey:      'GiftKey',
  WinterGift:   'WinterGift',
  JoinGuild:    'AoC',
  ExtUser:      'ExtUser', 
};

function runningTaskToTaskKey(task) {
    let suffix = null;
    switch (task) {
        case RunningTaskEnum.NewUser: 
            suffix = TaskKeyEnum.NewUser;
            break;
        case RunningTaskEnum.Daily: 
            suffix = TaskKeyEnum.Daily;
            break;
        case RunningTaskEnum.GiftKey: 
            suffix = TaskKeyEnum.GiftKey;
            break;
        case RunningTaskEnum.WinterGift: 
            suffix = TaskKeyEnum.WinterGift;
            break;
        case RunningTaskEnum.JoinGuild: 
        case RunningTaskEnum.JoinGuildAutoLogin: 
        case RunningTaskEnum.AoCAutoUpgrade: 
            suffix = TaskKeyEnum.JoinGuild;
            break;
        case RunningTaskEnum.ExtUserLogin: 
        case RunningTaskEnum.ExtUserLoginNoLogout:
        case RunningTaskEnum.ExtUserJoinGuild:
            suffix = TaskKeyEnum.ExtUser;
            break;
        default:
            break;
    }

    return suffix;
}

/**
 * 运行状况
 */
// 当前运行任务
let RunningTask = RunningTaskEnum.Stop;
// 上一个运行任务
let LastTask = RunningTaskEnum.Stop;
// 运行用户的起始编号
let StartUserNo = 0;
// 数据信息
let StatusData = {
    startNo: 1,
    endNo: 29,
    doneNo: 0,
    guildId: 0
};

/**
 * 设置
 */
// 队伍目标级别
let TargetLevel = 30;
// TODO 变成设置
const DefaultPassword = '12345678';
const TargetServerId = 74;
const BornServerId = 74;
// 服务器白名单(不会自动转服)
const ServerWhiteList = [TargetServerId];

// 
function isServerOk(serverId) {
    return (ServerWhiteList.includes(parseInt(serverId)));
}

// 是否应该改变出生服
function shouldChangeBornServer(serverId) {
    return (isSupervisor && 
        isBornSpecified &&
        BornServerId != serverId);
}

function changeRunningTask(task) {
    StatusDataMana.changeRunningTask(task);
    RunningTask = task;
}

function finishRunningTask() {
    changeRunningTask(RunningTaskEnum.Stop);

    const statusWindow = GiftStatusWindow.getInst();
    statusWindow.show();
    popup.confirm(
        "任务已全部完成",
        [
            {
                msg: 'OK',
                result: true
            },
        ]
    );

}

/**
 * parse email to number
 * @param {*} email
 * @returns
 */
function parseEmailToNo(email) {
    const no = email.substring(getInput('userPrefix').length, email.length - getInput('userMail').length);
    return Number(no);
}

/**
 * sleep
 * @param {*} time ms
 * @returns
 */
const sleep = (time) => new Promise((r) => setTimeout(r, time));

// start auto login
let intervalId = setInterval(onLoad, 2000);

// 自动重新加载页面
let autoReloadIntervalId = 0;

/**
 * 启动时自动运行任务
 */
async function autoRunTaskOnStart() {
    if (isServerOk(userInfo?.serverId)) {
        await checkExpedition();
    }
    await collectAllStuff();
    await refreshUserInfo();
}

/**
 * Game on load
 */
async function onLoad() {
    // check HWH is alive or not
    if (checkHWHLoaded() == false) {
        return;
    }

    // Stop Interval
    clearInterval(intervalId);

    // Open DB
    await openOrMigrateDatabase(0);

    // 判断清除Cookie扩展是否存在
    checkExtensionAlive();

    // 设置HWH插件的参数
    setupHWHelperOptions();

    // add controls
    addControls();

    // TODO load startup data
    // Load data
    RunningTask = StatusDataMana.getRunningTask();
    LastTask = StatusDataMana.getLastTask();
    StartUserNo = StatusDataMana.loadStartUserNo();
    StatusData = StatusDataMana.loadStatusData();
    TargetLevel = Number(getInput('targetLevel'));

    // show status
    showRunningStatus();

    // check running task
    if (RunningTask == RunningTaskEnum.Stop) {
        return;
    }

    if (isInLoginScreen()) {
        if (RunningTask == RunningTaskEnum.NewUser) {
            startTask(registerSingleUser);
        } else if (RunningTask == RunningTaskEnum.ExtUserLogin || 
            RunningTask == RunningTaskEnum.ExtUserLoginNoLogout || 
            RunningTask == RunningTaskEnum.ExtUserJoinGuild) {
                startExtTask();
        } else {
            startTask();
        }

        // 3分钟之后自动重新加载画面
        autoReloadIntervalId = setInterval(reload, 3 * 60e3);
    } else {
        waitForGameLoaded();

        // 8分钟之后自动重新加载画面
        autoReloadIntervalId = setInterval(reload, 8 * 60e3);
    }
}

// 等待游戏加载
async function waitForGameLoaded(){
    const { ScriptMenu } = HWHClasses;
    while (ScriptMenu.instance == null) {
        await sleep(1e3);
    }
    onGameLoad();
}

// 重启画面
function reload() {
    clearInterval(autoReloadIntervalId);
    location.reload();
}

/**
 * on game loaded (user logined)
 * @returns
 */
async function onGameLoad() {
    // check tutorial battle
    const allMissions = await questUtils.getAllMission();
    if (allMissions.length == 0 || 
        (allMissions.length == 1 && allMissions[0].wins == 0)) {
            sendTutorialMissionEnd(0);
            return;
    }

    autoRunTaskOnStart();

    await questUtils.getBasicInfo();
    if (RunningTask == RunningTaskEnum.NewUser ||
        RunningTask == RunningTaskEnum.Daily
    ) {
        if (tutorialChains[2] == 9999) {
            // tutorial finished
            HWTask.doDailyTasks();
        } else {
            HWTask.doNewUserTasks();
        }
    } else if (RunningTask == RunningTaskEnum.GiftKey) {
        HWTask.doGiftKeysTask();
    } else if (RunningTask == RunningTaskEnum.JoinGuild || RunningTask == RunningTaskEnum.ExtUserJoinGuild) {
        HWTask.doJoinGuildTasks();
    } else if (RunningTask == RunningTaskEnum.JoinGuildAutoLogin) {
        HWTask.doAutoLogin();
    } else if (RunningTask == RunningTaskEnum.AoCAutoUpgrade) {
        HWTask.doAoCAutoUpgrade();
    } else if (RunningTask == RunningTaskEnum.ExtUserLogin || RunningTask == RunningTaskEnum.ExtUserLoginNoLogout) {
        HWTask.doExtUserLogin();
    }
}
})();
