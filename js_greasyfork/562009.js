// ==UserScript==
// @name         Faucet Rotator - ClaimFreeCoins.io
// @namespace    Faucet Rotator - ClaimFreeCoins.io
// @version      1
// @description  Earn free crypto auto by script
// @author       you
// @match        https://claimfreecoins.io/*
// @connect      claimfreecoins.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimfreecoins.io
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/562009/Faucet%20Rotator%20-%20ClaimFreeCoinsio.user.js
// @updateURL https://update.greasyfork.org/scripts/562009/Faucet%20Rotator%20-%20ClaimFreeCoinsio.meta.js
// ==/UserScript==

// منع جميع النوافذ المنبثقة
unsafeWindow.open = function() { };

(function() {
    'use strict';

    // ===============================================================================================
    // إعدادات المستخدم
    // ===============================================================================================

    const FAUCETPAY_EMAIL = "mail@gmail.com"; // بريد الفوسيت باي فقط

    const WEBSITE_LIST = [
        { url: "https://claimfreecoins.io/dogecoin-faucet/?r=alialigood2030@gmail.com", coin: "dogecoin-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/litecoin-faucet/?r=alialigood2030@gmail.com", coin: "litecoin-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/tron-faucet/?r=alialigood2030@gmail.com", coin: "tron-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/bnb-faucet/?r=alialigood2030@gmail.com", coin: "bnb-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/solana-faucet/?r=alialigood2030@gmail.com", coin: "solana-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/tether-faucet/?r=alialigood2030@gmail.com", coin: "tether-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/polygon-faucet/?r=alialigood2030@gmail.com", coin: "polygon-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/ethereum-faucet/?r=alialigood2030@gmail.com", coin: "ethereum-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/bch-faucet/?r=balialigood2030@gmail.com", coin: "bch-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/dash-faucet/?r=alialigood2030@gmail.com", coin: "dash-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/zcash-faucet/?r=alialigood2030@gmail.com", coin: "zcash-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/digibyte-faucet/?r=alialigood2030@gmail.com", coin: "digibyte-faucet", address: FAUCETPAY_EMAIL },
        { url: "https://claimfreecoins.io/feyorra-faucet/?r=alialigood2030@gmail.com", coin: "feyorra-faucet", address: FAUCETPAY_EMAIL },
    ];

    const WEBSITE_CONFIG = [{
        website: ["claimfreecoins.io"],
        inputTextSelector: ["#address"],
        inputTextSelectorButton: "body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-8.order-md-2.mb-4.text-center > form > div:nth-child(4) > button",
        defaultButtonSelectors: ["a.btn"],
        captchaButtonSubmitSelector: ["#login"],
        allMessageSelectors: [".alert.alert-warning", ".alert.alert-success", ".alert.alert-danger", "#cf-error-details"],
        successMessageSelectors: [".alert.alert-success"],
        messagesToCheckBeforeMovingToNextUrl: ["invalid", "sufficient", "you have reached", "tomorrow", "wrong order", "locked", "was sent to your", "You have to wait", "Login not valid", "You have already claimed", "claimed successfully", "Claim not Valid", "rate limited"],
        antibotlinks: true
    }];

    // ===============================================================================================
    // المتغيرات العامة
    // ===============================================================================================

    let currentWebsiteIndex = 0;
    let isMovingToNextUrl = false;
    let isNextUrlReachable = false;
    let antibotlinksSolved = false;
    let currentConfig = {};
    let nextUrlData = {};

    // ===============================================================================================
    // وظائف المساعدة
    // ===============================================================================================

    // التحقق مما إذا كانت السلسلة تحتوي على أي من القيم في المصفوفة
    String.prototype.containsAny = function(arrayOfStrings) {
        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }

        for (let i = 0; i < arrayOfStrings.length; i++) {
            if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    // إنشاء حدث HTML
    function triggerHTMLEvent(element, eventType) {
        try {
            const event = document.createEvent('HTMLEvents');
            event.initEvent(eventType, false, true);
            element.dispatchEvent(event);
        } catch (error) {
            console.error('Error triggering event:', error);
        }
    }

    // تأخير التنفيذ
    function delayExecution(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ===============================================================================================
    // تهيئة التكوين
    // ===============================================================================================

    function initializeWebsiteConfig() {
        for (const config of WEBSITE_CONFIG) {
            if (window.location.href.containsAny(config.website)) {
                currentConfig = { ...config };
                break;
            }
        }

        assignAddressToConfig();
    }

    function assignAddressToConfig() {
        let addressAssigned = false;

        // البحث عن العنوان المناسب بناءً على العملة في الرابط
        for (let i = 0; i < WEBSITE_LIST.length; i++) {
            const site = WEBSITE_LIST[i];
            if (site.url.includes(window.location.hostname) &&
                (window.location.href.includes("/" + site.coin + "/") ||
                 window.location.href.includes("/" + site.coin + "-") ||
                 window.location.href.endsWith("/" + site.coin))) {
                currentConfig.address = site.address;
                currentWebsiteIndex = i;
                addressAssigned = true;
                break;
            }
        }

        // إذا لم يتم العثور على العملة في الرابط، استخدام الإعداد الافتراضي
        if (!addressAssigned) {
            for (let i = 0; i < WEBSITE_LIST.length; i++) {
                const site = WEBSITE_LIST[i];
                if (site.url.includes(window.location.hostname)) {
                    if (site.regex) {
                        const storedRegex = GM_getValue("UrlRegex");
                        if (storedRegex === site.regex) {
                            currentConfig.address = site.address;
                            currentWebsiteIndex = i;
                            break;
                        }
                    } else {
                        currentConfig.address = site.address;
                        currentWebsiteIndex = i;
                        break;
                    }
                }
            }
        }
    }

    // ===============================================================================================
    // إدارة التنقل بين المواقع
    // ===============================================================================================

    async function getNextWebsiteUrl() {
        currentWebsiteIndex = (currentWebsiteIndex + 1) % WEBSITE_LIST.length;
        nextUrlData = WEBSITE_LIST[currentWebsiteIndex];
        
        // تخطي رابط Bitcoin إذا كان موجوداً (تمت إزالته بالفعل)
        if (nextUrlData.coin === "bitcoin-faucet") {
            currentWebsiteIndex = (currentWebsiteIndex + 1) % WEBSITE_LIST.length;
            nextUrlData = WEBSITE_LIST[currentWebsiteIndex];
        }
        
        if (nextUrlData.regex) {
            GM_setValue("UrlRegex", nextUrlData.regex);
        }
        
        await checkWebsiteAvailability(nextUrlData.url);
    }

    function checkWebsiteAvailability(websiteUrl) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: websiteUrl,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                timeout: 2000,
                onload: function(response) {
                    isNextUrlReachable = (response && response.status === 200);
                    resolve();
                },
                onerror: function() {
                    isNextUrlReachable = false;
                    resolve();
                },
                ontimeout: function() {
                    isNextUrlReachable = false;
                    resolve();
                }
            });
        });
    }

    async function navigateToNextWebsite() {
        if (isMovingToNextUrl) return;
        
        isMovingToNextUrl = true;
        
        do {
            await getNextWebsiteUrl();
            if (!isNextUrlReachable) {
                await delayExecution(2000);
            }
        } while (!isNextUrlReachable);
        
        window.location.href = nextUrlData.url;
    }

    // ===============================================================================================
    // معالجة الكابتشا والمحتوى
    // ===============================================================================================

    function handleAntibotlinks() {
        setInterval(() => {
            // تبديل نوع الكابتشا
            const switchButton = document.querySelector("#switch");
            if (switchButton) {
                const buttonText = switchButton.innerText.toLowerCase();
                if (buttonText.includes("hcaptcha") || buttonText.includes("recaptcha")) {
                    switchButton.click();
                }
            }

            // التحقق من صور الروابط
            const antibotlinkSelectors = [
                ".modal-content [href='/'] img",
                ".modal-body [href='/'] img",
                ".antibotlinks [href='/'] img"
            ];

            for (const selector of antibotlinkSelectors) {
                const img = document.querySelector(selector);
                if (img && img.value === "####") {
                    navigateToNextWebsite();
                    return;
                }
            }

            // التحقق من حل الروابط
            let hiddenLinksCount = 0;
            const linkContainers = [
                ".modal-content [href='/']",
                ".modal-body [href='/']",
                ".antibotlinks [href='/']"
            ];

            for (let i = 0; i < 4; i++) {
                for (const container of linkContainers) {
                    const links = document.querySelectorAll(container);
                    if (links.length === 4 && 
                        links[i] && 
                        links[i].style && 
                        links[i].style.display === 'none') {
                        hiddenLinksCount++;
                        break;
                    }
                }
            }

            if (hiddenLinksCount === 4) {
                antibotlinksSolved = true;
            }
        }, 2000);
    }

    // ===============================================================================================
    // فحص الرسائل
    // ===============================================================================================

    function checkForMessages() {
        if (!currentConfig.allMessageSelectors) return false;
        
        for (const selector of currentConfig.allMessageSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element && 
                    (element.innerText.containsAny(currentConfig.messagesToCheckBeforeMovingToNextUrl) ||
                    (element.value && element.value.containsAny(currentConfig.messagesToCheckBeforeMovingToNextUrl)))) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkForSuccessMessages() {
        if (!currentConfig.successMessageSelectors) return false;
        
        for (const selector of currentConfig.successMessageSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element && element.innerText.containsAny(currentConfig.messagesToCheckBeforeMovingToNextUrl)) {
                    return true;
                }
            }
        }
        return false;
    }

    // ===============================================================================================
    // معالجة النقر على الأزرار
    // ===============================================================================================

    function clickElement(selector, useFormSubmit = false) {
        const element = document.querySelector(selector);
        if (!element) return false;
        
        if (useFormSubmit && element.tagName === 'FORM') {
            element.submit();
        } else {
            triggerHTMLEvent(element, 'mousedown');
            triggerHTMLEvent(element, 'mouseup');
            element.click();
        }
        
        return true;
    }

    function handleDefaultButtons() {
        if (!currentConfig.defaultButtonSelectors) return;
        
        for (const selector of currentConfig.defaultButtonSelectors) {
            if (clickElement(selector)) {
                break;
            }
        }
    }

    function handleInputField() {
        const inputField = document.querySelector(currentConfig.inputTextSelector);
        if (!inputField || !currentConfig.address) return;
        
        inputField.value = currentConfig.address;
        triggerHTMLEvent(inputField, 'keypress');
        triggerHTMLEvent(inputField, 'change');
        
        setTimeout(() => {
            if (currentConfig.inputTextSelectorButton) {
                clickElement(currentConfig.inputTextSelectorButton);
            }
        }, 2000);
    }

    // ===============================================================================================
    // معالجة الكابتشا
    // ===============================================================================================

    function handleCaptchaSubmission() {
        let captchaSolved = false;
        
        const captchaInterval = setInterval(() => {
            // الانتظار حتى يتم حل الروابط المضادة للبوت
            if (currentConfig.antibotlinks && !antibotlinksSolved) {
                return;
            }

            // التحقق من reCAPTCHA
            if (!captchaSolved && 
                unsafeWindow.grecaptcha && 
                unsafeWindow.grecaptcha.getResponse().length > 0 &&
                currentConfig.captchaButtonSubmitSelector) {
                
                const submitButton = document.querySelector(currentConfig.captchaButtonSubmitSelector);
                if (submitButton && 
                    submitButton.style.display !== 'none' &&
                    !submitButton.disabled) {
                    
                    clickElement(currentConfig.captchaButtonSubmitSelector, currentConfig.formSubmit);
                    captchaSolved = true;
                    
                    clearInterval(captchaInterval);
                    
                    setTimeout(() => {
                        if (checkForMessages()) {
                            navigateToNextWebsite();
                        }
                    }, 20000);
                }
            }

            // التحقق من hCaptcha
            const iframes = document.querySelectorAll("iframe");
            for (const iframe of iframes) {
                if (!captchaSolved && 
                    iframe.hasAttribute("data-hcaptcha-response") &&
                    iframe.getAttribute("data-hcaptcha-response").length > 0 &&
                    currentConfig.captchaButtonSubmitSelector) {
                    
                    const submitButton = document.querySelector(currentConfig.captchaButtonSubmitSelector);
                    if (submitButton && 
                        submitButton.style.display !== 'none' &&
                        !submitButton.disabled) {
                        
                        clickElement(currentConfig.captchaButtonSubmitSelector, currentConfig.formSubmit);
                        captchaSolved = true;
                        
                        clearInterval(captchaInterval);
                        
                        setTimeout(() => {
                            if (checkForMessages()) {
                                navigateToNextWebsite();
                            }
                        }, 2000);
                    }
                }
            }
        }, 2000);
    }

    // ===============================================================================================
    // التنقل التلقائي
    // ===============================================================================================

    function setupAutomaticNavigation() {
        const navigationDelay = currentConfig.timeoutbeforeMovingToNextUrl || 100000;
        
        setTimeout(() => {
            isMovingToNextUrl = false;
            navigateToNextWebsite();
        }, navigationDelay);
    }

    // ===============================================================================================
    // الواجهة الرسومية
    // ===============================================================================================

    function createUserInterface() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'faucet-rotator-ui';
        uiContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 10000;
            min-width: 250px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            border: 2px solid #4CAF50;
        `;
        
        const title = document.createElement('div');
        title.textContent = '🔄 Faucet Rotator';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
            color: #4CAF50;
            text-align: center;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
        `;
        
        const statusText = document.createElement('div');
        statusText.id = 'rotator-status';
        statusText.textContent = 'Status: Running...';
        statusText.style.cssText = `
            margin: 5px 0;
            padding: 3px;
            background: #333;
            border-radius: 3px;
        `;
        
        const currentSite = document.createElement('div');
        currentSite.id = 'current-site';
        currentSite.textContent = `Site: ${currentWebsiteIndex + 1}/${WEBSITE_LIST.length}`;
        currentSite.style.cssText = `
            margin: 5px 0;
            padding: 3px;
            background: #333;
            border-radius: 3px;
        `;
        
        const coinInfo = document.createElement('div');
        coinInfo.id = 'coin-info';
        coinInfo.textContent = `Coin: ${WEBSITE_LIST[currentWebsiteIndex]?.coin?.replace('-faucet', '') || 'Unknown'}`;
        coinInfo.style.cssText = `
            margin: 5px 0;
            padding: 3px;
            background: #333;
            border-radius: 3px;
        `;
        
        const nextButton = document.createElement('button');
        nextButton.textContent = '⏭️ Next Site';
        nextButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
            font-weight: bold;
        `;
        nextButton.onclick = () => {
            isMovingToNextUrl = false;
            navigateToNextWebsite();
        };
        
        const hideButton = document.createElement('button');
        hideButton.textContent = '👁️ Toggle UI';
        hideButton.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-top: 5px;
            font-weight: bold;
        `;
        hideButton.onclick = () => {
            uiContainer.style.display = uiContainer.style.display === 'none' ? 'block' : 'none';
        };
        
        uiContainer.appendChild(title);
        uiContainer.appendChild(statusText);
        uiContainer.appendChild(currentSite);
        uiContainer.appendChild(coinInfo);
        uiContainer.appendChild(nextButton);
        uiContainer.appendChild(hideButton);
        
        document.body.appendChild(uiContainer);
        
        // تحديث الواجهة بشكل دوري
        setInterval(() => {
            document.getElementById('current-site').textContent = 
                `Site: ${currentWebsiteIndex + 1}/${WEBSITE_LIST.length}`;
            
            document.getElementById('coin-info').textContent = 
                `Coin: ${WEBSITE_LIST[currentWebsiteIndex]?.coin?.replace('-faucet', '') || 'Unknown'}`;
            
            document.getElementById('rotator-status').textContent = 
                `Status: ${isMovingToNextUrl ? 'Moving to next site...' : 'Running...'}`;
        }, 1000);
    }

    // ===============================================================================================
    // التهيئة الرئيسية
    // ===============================================================================================

    function initializeScript() {
        // تهيئة التكوين
        initializeWebsiteConfig();
        
        // إذا كان المستخدم يحاول الوصول إلى Bitcoin Faucet، انتقل مباشرة إلى الموقع التالي
        if (window.location.href.includes("/bitcoin-faucet/") || 
            window.location.href.includes("bitcoin-faucet")) {
            navigateToNextWebsite();
            return;
        }
        
        // الانتقال إلى الموقع التالي إذا كان العنوان غير صالح
        if (window.location.href.includes("to=FaucetPay") || 
            !currentConfig.address || 
            currentConfig.address.length < 5 || 
            currentConfig.address.includes("YOUR_")) {
            navigateToNextWebsite();
            return;
        }
        
        // إعداد التنقل التلقائي
        setupAutomaticNavigation();
        
        // معالجة النوافذ
        if (window.name === "nextWindowUrl") {
            window.name = "";
            navigateToNextWebsite();
            return;
        } else {
            window.name = window.location.href;
        }
        
        // بدء التنفيذ بعد تأخير
        setTimeout(() => {
            // معالجة الروابط المضادة للبوت
            if (currentConfig.antibotlinks) {
                handleAntibotlinks();
            }
            
            // تنفيذ وظائف إضافية إذا كانت موجودة
            if (currentConfig.additionalFunctions) {
                currentConfig.additionalFunctions();
            }
            
            // فحص الرسائل والانتقال إذا لزم الأمر
            if (!isMovingToNextUrl && checkForMessages()) {
                navigateToNextWebsite();
                return;
            }
            
            // معالجة حقل الإدخال
            if (!isMovingToNextUrl && currentConfig.inputTextSelector) {
                handleInputField();
            }
            
            // النقر على الأزرار الافتراضية
            if (!isMovingToNextUrl) {
                handleDefaultButtons();
            }
            
            // معالجة الكابتشا
            handleCaptchaSubmission();
        }, 2000);
        
        // إنشاء واجهة المستخدم
        setTimeout(() => {
            createUserInterface();
        }, 3000);
    }

    // بدء التنفيذ
    initializeScript();

})();