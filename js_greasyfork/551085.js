// ==UserScript==
// @name         Add to Basetao with Inline Form
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adds inline form under item-wrap for selecting size/color and adding to Basetao with attributes in notes and specific size/color fields
// @author       Kaj
// @match        https://*.weidian.com/item.html*
// @grant        GM_xmlhttpRequest
// @connect      basetao.com
// @connect      www.basetao.com
// @connect      thor.weidian.com
// @connect      api.mymemory.translated.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weidian.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551085/Add%20to%20Basetao%20with%20Inline%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/551085/Add%20to%20Basetao%20with%20Inline%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script initialized at', new Date().toISOString());

    const CSRF_REQUIRED_ERROR = "You need to be logged in on BaseTao to use this extension (CSRF required).";
    const DEFAULT_WDTOKEN = 'c8ceed92';
    const USER_LANGUAGE = 'en'; // Fixed to English

    let isAdding = false;

    async function translateText(text) {
        if (!text) return text;
        console.log(`Translating text: ${text} to ${USER_LANGUAGE}`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh|${USER_LANGUAGE}`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.responseStatus === 200 && data.responseData.translatedText) {
                            console.log(`Translation for ${text}: ${data.responseData.translatedText}`);
                            resolve(`${text} (${data.responseData.translatedText})`);
                        } else {
                            console.warn(`Translation failed for ${text}, using original`);
                            resolve(text);
                        }
                    } catch (e) {
                        console.error(`Failed to parse translation response for ${text}:`, e);
                        resolve(text);
                    }
                },
                onerror: (error) => {
                    console.error(`Translation request failed for ${text}:`, error);
                    resolve(text);
                }
            });
        });
    }

    class BaseTao {
        constructor() {
            this.parser = new DOMParser();
        }

        async getCSRFToken(domain) {
            console.log(`Fetching CSRF token from ${domain}`);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${domain}/best-taobao-agent-service/how_make/buy_order.html`,
                    onload: (response) => {
                        console.log(`CSRF token response received from ${domain}`);
                        if (response.responseText.includes("please sign in again")) {
                            console.error('CSRF token fetch failed: Please sign in again');
                            reject(new Error(CSRF_REQUIRED_ERROR));
                            return;
                        }
                        const doc = this.parser.parseFromString(response.responseText, "text/html");
                        const csrfToken = doc.querySelector("input[name=bt_sb_token]");
                        if (csrfToken && csrfToken.value.length !== 0) {
                            console.log('CSRF token found:', csrfToken.value);
                            resolve(csrfToken.value);
                        } else {
                            console.error('CSRF token not found in response');
                            reject(new Error(CSRF_REQUIRED_ERROR));
                        }
                    },
                    onerror: (error) => {
                        console.error('CSRF token fetch error:', error);
                        reject(new Error("Failed to get CSRF token"));
                    }
                });
            });
        }

        async getDomain() {
            console.log('Attempting to determine Basetao domain');
            try {
                await this.getCSRFToken("https://www.basetao.com");
                console.log('Domain confirmed: https://www.basetao.com');
                return "https://www.basetao.com";
            } catch (error) {
                console.warn('Failed to get CSRF token from www.basetao.com, trying basetao.com');
                try {
                    await this.getCSRFToken("https://basetao.com");
                    console.log('Domain confirmed: https://basetao.com');
                    return "https://basetao.com";
                } catch (error) {
                    console.error('Failed to get CSRF token from both domains:', error);
                    throw new Error(CSRF_REQUIRED_ERROR);
                }
            }
        }

        async submitOrder(formData) {
            console.log('Submitting order to Basetao with data:', formData);
            try {
                const domain = await this.getDomain();
                const csrf = await this.getCSRFToken(domain);

                const orderData = {
                    addtime: Date.now(),
                    goodscolor: formData.color || "-",
                    goodsimg: formData.imageUrl || "",
                    goodsname: formData.itemName,
                    goodsnum: 1,
                    goodsprice: formData.price,
                    goodsremark: formData.remarks || "",
                    goodsseller: formData.seller,
                    goodssite: "weidian",
                    goodssize: formData.size || "-",
                    goodsurl: formData.link,
                    item_id: formData.itemId || "",
                    sellerurl: "",
                    sendprice: formData.shippingPrice,
                    siteurl: window.location.hostname,
                    sku_id: formData.skuId || 0,
                    type: 1
                };

                console.log('Order data prepared for Basetao:', orderData);

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${domain}/best-taobao-agent-service/bt_action/add_cart`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Origin': domain,
                            'Referer': `${domain}/best-taobao-agent-service/how_make/buy_order.html`,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        data: new URLSearchParams({
                            bt_sb_token: csrf,
                            data: JSON.stringify(orderData)
                        }).toString(),
                        onload: (response) => {
                            console.log('Basetao API response:', response.responseText);
                            try {
                                const responseData = JSON.parse(response.responseText);
                                if (responseData.value === "1") {
                                    console.log('Item successfully added to Basetao cart');
                                    resolve();
                                } else {
                                    console.error('Basetao API error:', responseData);
                                    reject(new Error("Item could not be added, make sure you are logged in"));
                                }
                            } catch (e) {
                                console.error('Failed to parse Basetao response:', e);
                                reject(new Error("Invalid response from BaseTao"));
                            }
                        },
                        onerror: (error) => {
                            console.error('Basetao API request failed:', error);
                            reject(new Error("Failed to connect to BaseTao"));
                        }
                    });
                });
            } catch (error) {
                console.error('Error in submitOrder:', error);
                throw error;
            }
        }
    }

    function getWdToken() {
        console.log('Attempting to extract wdtoken');
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const match = script.textContent.match(/wdtoken=([a-z0-9]+)/);
            if (match) {
                console.log('wdtoken found:', match[1]);
                return match[1];
            }
        }
        console.warn('wdtoken not found, using default:', DEFAULT_WDTOKEN);
        return DEFAULT_WDTOKEN;
    }

    async function fetchAPI(url) {
        console.log(`Fetching API: ${url}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json, */*',
                    'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site'
                },
                onload: (response) => {
                    console.log(`API response received for ${url}:`, response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status.code === 0) {
                            console.log(`API data parsed successfully for ${url}`);
                            resolve(data.result);
                        } else {
                            console.error(`API request failed for ${url}:`, data.status.message);
                            reject(new Error('API request failed: ' + data.status.message));
                        }
                    } catch (e) {
                        console.error(`Failed to parse API response for ${url}:`, e);
                        reject(new Error('Failed to parse API response'));
                    }
                },
                onerror: (error) => {
                    console.error(`API fetch error for ${url}:`, error);
                    reject(new Error('Failed to fetch API data'));
                }
            });
        });
    }

    async function getItemData() {
        const itemId = new URLSearchParams(window.location.search).get('itemID');
        console.log('Extracted item ID:', itemId);
        if (!itemId) {
            console.error('Item ID not found in URL');
            throw new Error('Item ID not found in URL');
        }

        const wdtoken = getWdToken();
        const descUrl = `https://thor.weidian.com/detail/getDetailDesc/1.0?param=${encodeURIComponent(JSON.stringify({ vItemId: itemId }))}&wdtoken=${wdtoken}`;
        const skuUrl = `https://thor.weidian.com/detail/getItemSkuInfo/1.0?param=${encodeURIComponent(JSON.stringify({ itemId: itemId }))}&wdtoken=${wdtoken}`;

        try {
            const [descData, skuData] = await Promise.all([fetchAPI(descUrl), fetchAPI(skuUrl)]);
            console.log('API data received:', { descData, skuData });

            const images = descData.item_detail.desc_content
                .filter(item => item.type === 2 && item.url)
                .map(item => item.url.replace(/\?.*$/, ''));

            console.log('Extracted images:', images);

            let attributes = [];
            let skus = [];

            if (Array.isArray(skuData.attrList) && skuData.attrList.length > 0) {
                attributes = await Promise.all(skuData.attrList.map(async attr => ({
                    title: await translateText(attr.attrTitle),
                    values: Array.isArray(attr.attrValues) ? attr.attrValues.map(val => ({
                        id: val.attrId,
                        name: val.attrValue.replace('补货中', '').trim(),
                        img: val.img ? val.img.replace(/\?.*$/, '') : undefined,
                        stock: skuData.skuInfos && Array.isArray(skuData.skuInfos)
                            ? skuData.skuInfos
                                .filter(sku => Array.isArray(sku.attrIds) && sku.attrIds.includes(val.attrId))
                                .reduce((sum, sku) => sum + (sku.skuInfo?.stock || 0), 0) || 0
                            : 0
                    })) : []
                })));
            } else if (skuData.skuInfos && Array.isArray(skuData.skuInfos) && skuData.skuInfos.length > 1) {
                const sizeAttribute = {
                    title: await translateText('型号尺寸'),
                    values: skuData.skuInfos.map((sku, index) => ({
                        id: sku.skuInfo.id,
                        name: sku.skuInfo.title.replace('补货中', '').trim(),
                        img: sku.skuInfo.img ? sku.skuInfo.img.replace(/\?.*$/, '') : undefined,
                        stock: sku.skuInfo.stock || 0
                    }))
                };
                attributes = [sizeAttribute];
            }

            skus = skuData.skuInfos && Array.isArray(skuData.skuInfos) && skuData.skuInfos.length > 0
                ? skuData.skuInfos.map(sku => ({
                    attrIds: Array.isArray(sku.attrIds) ? sku.attrIds : attributes.length > 0 ? [sku.skuInfo.id] : [],
                    skuId: sku.skuInfo?.id || 0,
                    title: sku.skuInfo?.title.replace('补货中', '').trim() || 'Default',
                    stock: sku.skuInfo?.stock || 0,
                    price: (sku.skuInfo?.discountPrice / 100).toFixed(2) || (skuData.itemDiscountLowPrice / 100).toFixed(2)
                }))
                : [{
                    attrIds: [],
                    skuId: 0,
                    title: skuData.itemTitle || 'Default',
                    stock: skuData.itemStock || 0,
                    price: (skuData.itemDiscountLowPrice / 100).toFixed(2)
                }];

            console.log('Extracted attributes:', attributes);
            console.log('Extracted SKUs:', skus);

            const shippingFee = getShippingFee();
            console.log('Extracted shipping fee:', shippingFee);

            const itemData = {
                itemName: skuData.itemTitle || 'Unknown Item',
                itemId: skuData.itemId || itemId,
                price: (skuData.itemDiscountLowPrice / 100).toFixed(2) || '0.00',
                mainImage: skuData.itemMainPic ? skuData.itemMainPic.replace(/\?.*$/, '') : images[0] || '',
                images: skuData.itemMainPic
                    ? [skuData.itemMainPic.replace(/\?.*$/, ''), ...images.filter(url => url !== skuData.itemMainPic)]
                    : images,
                attributes: attributes,
                skus: skus,
                seller: getSeller(),
                shippingFee: shippingFee
            };

            console.log('Final item data:', itemData);
            return itemData;
        } catch (error) {
            console.error('Error fetching item data:', error);
            throw error;
        }
    }

    function getSeller() {
        console.log('Attempting to extract seller name');
        const sellerElement = document.querySelector('.shop-name-str, .shop-toggle-header-name, .item-header-logo');
        const sellerName = sellerElement ? sellerElement.textContent.trim() || 'Unknown Seller' : 'Unknown Seller';
        console.log('Seller name extracted:', sellerName);
        return sellerName;
    }

    function getShippingFee() {
        console.log('Attempting to extract shipping fee');
        const patterns = [
            /expressFeeDesc\\":\"快递([\d\.]+)元起\"/,
            /expressPostageDesc\\":\"快递([\d\.]+)元起\"/,
            /快递([\d\.]+)元起/
        ];
        const body = document.body.innerHTML;
        for (let pattern of patterns) {
            const match = body.match(pattern);
            if (match) {
                console.log('Shipping fee found:', match[1]);
                return parseFloat(match[1]);
            }
        }
        console.warn('Shipping fee not found, defaulting to 10');
        return 10;
    }

    function createFullscreenImageModal() {
        const modal = document.createElement('div');
        modal.id = 'basetaoImageModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 10002;
            align-items: center;
            justify-content: center;
            overflow: auto;
        `;

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        `;
        imgContainer.appendChild(img);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #f97316;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#ea580c';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = '#f97316';
        };
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        imgContainer.appendChild(closeBtn);

        modal.appendChild(imgContainer);

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };

        document.body.appendChild(modal);
        return modal;
    }

    function showFullscreenImage(src) {
        let modal = document.getElementById('basetaoImageModal');
        if (!modal) {
            modal = createFullscreenImageModal();
        }
        const img = modal.querySelector('img');
        img.src = src;
        modal.style.display = 'flex';
        console.log('Showing fullscreen image:', src);
    }

    function createInlineForm(itemData, container) {
        console.log('Creating inline form with item data:', itemData);

        const formContainer = document.createElement('div');
        formContainer.id = 'basetaoInlineForm';
        formContainer.style.cssText = `
            background: white;
            margin-top: 12px;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Add to Basetao';
        title.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 600;
            color: #111827;
        `;
        formContainer.appendChild(title);

        const priceDisplay = document.createElement('div');
        priceDisplay.id = 'basetaoPriceDisplay';
        priceDisplay.style.cssText = `
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        priceDisplay.innerHTML = `
            <div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Price</div>
                <div style="font-size: 28px; font-weight: 700;">¥${itemData.price}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 12px; opacity: 0.8;">Shipping</div>
                <div style="font-size: 16px; font-weight: 600;">¥${itemData.shippingFee}</div>
            </div>
        `;
        formContainer.appendChild(priceDisplay);

        itemData.attributes.forEach((attr, index) => {
            const attrDiv = document.createElement('div');
            attrDiv.style.cssText = 'margin-bottom: 20px;';

            const label = document.createElement('label');
            label.textContent = attr.title;
            label.style.cssText = `
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 12px;
            `;
            attrDiv.appendChild(label);

            const hasImages = attr.values.some(val => val.img);

            if (hasImages) {
                const optionsGrid = document.createElement('div');
                optionsGrid.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                    gap: 12px;
                `;

                attr.values.forEach((val, i) => {
                    const optionBtn = document.createElement('div');
                    optionBtn.dataset.attrId = val.id;
                    optionBtn.dataset.attrName = val.name;
                    optionBtn.dataset.attrIndex = index;

                    const isProbablyOOS = val.stock === 0;

                    optionBtn.style.cssText = `
                        position: relative;
                        padding: 8px;
                        border: 2px solid ${i === 0 && !isProbablyOOS ? '#f97316' : '#e5e7eb'};
                        border-radius: 8px;
                        cursor: ${isProbablyOOS ? 'not-allowed' : 'pointer'};
                        transition: all 0.2s;
                        background: ${isProbablyOOS ? '#f9fafb' : 'white'};
                        opacity: ${isProbablyOOS ? '0.6' : '1'};
                        text-align: center;
                    `;

                    if (val.img) {
                        const imgContainer = document.createElement('div');
                        imgContainer.style.cssText = `
                            position: relative;
                            width: 100%;
                            height: 60px;
                        `;

                        const img = document.createElement('img');
                        img.src = val.img;
                        img.style.cssText = `
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            border-radius: 4px;
                            margin-bottom: 6px;
                        `;
                        imgContainer.appendChild(img);

                        if (!isProbablyOOS) {
                            const zoomIcon = document.createElement('div');
                            zoomIcon.innerHTML = `
                                <svg style="width: 24px; height: 24px; position: absolute; bottom: 8px; right: 8px; background: rgba(0, 0, 0, 0.5); border-radius: 50%; padding: 4px;" fill="none" stroke="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM12 8v4m0 0H8m4 0h4"/>
                                </svg>
                            `;
                            zoomIcon.style.cssText = `
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                opacity: 0;
                                transition: opacity 0.2s;
                            `;
                            imgContainer.appendChild(zoomIcon);

                            imgContainer.onmouseover = () => {
                                zoomIcon.style.opacity = '1';
                            };
                            imgContainer.onmouseout = () => {
                                zoomIcon.style.opacity = '0';
                            };
                            imgContainer.onclick = () => {
                                showFullscreenImage(val.img);
                            };
                        }

                        optionBtn.appendChild(imgContainer);
                    }

                    const nameDiv = document.createElement('div');
                    nameDiv.textContent = val.name + (isProbablyOOS ? ' (OUT OF STOCK)' : '');
                    nameDiv.style.cssText = `
                        font-size: 12px;
                        color: ${isProbablyOOS ? '#9ca3af' : '#374151'};
                        font-weight: 500;
                        word-wrap: break-word;
                    `;
                    optionBtn.appendChild(nameDiv);

                    if (!isProbablyOOS) {
                        optionBtn.onclick = (e) => {
                            if (e.target.tagName !== 'IMG' && !e.target.closest('svg')) {
                                optionsGrid.querySelectorAll('div[data-attr-index="' + index + '"]').forEach(el => {
                                    el.style.borderColor = '#e5e7eb';
                                    el.style.background = 'white';
                                });
                                optionBtn.style.borderColor = '#f97316';
                                optionBtn.style.background = '#ffedd5';
                                updatePrice();
                                updateAvailability();
                            }
                        };

                        optionBtn.onmouseover = () => {
                            if (optionBtn.style.borderColor !== 'rgb(249, 115, 22)') {
                                optionBtn.style.borderColor = '#cbd5e1';
                            }
                        };

                        optionBtn.onmouseout = () => {
                            if (optionBtn.style.borderColor !== 'rgb(249, 115, 22)') {
                                optionBtn.style.borderColor = '#e5e7eb';
                            }
                        };

                        if (i === 0) {
                            optionBtn.style.borderColor = '#f97316';
                            optionBtn.style.background = '#ffedd5';
                        }
                    }

                    optionsGrid.appendChild(optionBtn);
                });

                attrDiv.appendChild(optionsGrid);
            } else {
                const select = document.createElement('select');
                select.id = `basetaoAttr${index}`;
                select.dataset.attrIndex = index;
                select.style.cssText = `
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #111827;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    padding-right: 40px;
                `;
                select.onfocus = () => select.style.borderColor = '#f97316';
                select.onblur = () => select.style.borderColor = '#e5e7eb';

                attr.values.forEach((val, i) => {
                    const option = document.createElement('option');
                    option.value = JSON.stringify({ id: val.id, name: val.name });
                    option.textContent = val.stock > 0 ? val.name : `${val.name} (OUT OF STOCK)`;
                    option.disabled = val.stock === 0;
                    if (i === 0 && val.stock > 0) option.selected = true;
                    select.appendChild(option);
                });

                select.onchange = () => {
                    updatePrice();
                    updateAvailability();
                };

                attrDiv.appendChild(select);
            }

            formContainer.appendChild(attrDiv);
        });

        const updatePrice = () => {
            const selectedAttrs = getSelectedAttributes();
            const attrIds = selectedAttrs.map(attr => attr.id);
            const selectedSku = itemData.skus.find(sku =>
                sku.attrIds.length === attrIds.length &&
                sku.attrIds.every(id => attrIds.includes(id))
            );

            if (selectedSku && selectedSku.price) {
                const priceDiv = priceDisplay.querySelector('div:first-child > div:last-child');
                priceDiv.style.animation = 'pulse 0.3s ease-out';
                priceDiv.textContent = `¥${selectedSku.price}`;
                setTimeout(() => priceDiv.style.animation = '', 300);
            }
        };

        const updateAvailability = () => {
            const selectedAttrs = getSelectedAttributes();
            const attrIds = selectedAttrs.map(attr => attr.id);

            itemData.attributes.forEach((attr, attrIndex) => {
                attr.values.forEach(val => {
                    const tempAttrIds = [...attrIds];
                    tempAttrIds[attrIndex] = val.id;

                    const hasSku = itemData.skus.some(sku =>
                        tempAttrIds.every(id => sku.attrIds.includes(id)) && sku.stock > 0
                    );

                    const element = formContainer.querySelector(`div[data-attr-id="${val.id}"]`);
                    if (element) {
                        if (!hasSku || val.stock === 0) {
                            element.style.opacity = '0.6';
                            element.style.cursor = 'not-allowed';
                            element.onclick = (e) => {
                                if (e.target.tagName === 'IMG' || e.target.closest('svg')) {
                                    showFullscreenImage(val.img);
                                }
                            };
                        } else {
                            element.style.opacity = '1';
                            element.style.cursor = 'pointer';
                            element.onclick = (e) => {
                                if (e.target.tagName !== 'IMG' && !e.target.closest('svg')) {
                                    const optionsGrid = element.parentElement;
                                    optionsGrid.querySelectorAll('div[data-attr-index="' + attrIndex + '"]').forEach(el => {
                                        el.style.borderColor = '#e5e7eb';
                                        el.style.background = 'white';
                                    });
                                    element.style.borderColor = '#f97316';
                                    element.style.background = '#ffedd5';
                                    updatePrice();
                                    updateAvailability();
                                } else {
                                    showFullscreenImage(val.img);
                                }
                            };
                        }
                    }
                });
            });
        };

        const getSelectedAttributes = () => {
            return itemData.attributes.map((attr, index) => {
                const visualSelected = formContainer.querySelector(`div[data-attr-index="${index}"][style*="rgb(249, 115, 22)"]`);
                if (visualSelected) {
                    return {
                        id: parseInt(visualSelected.dataset.attrId),
                        name: visualSelected.dataset.attrName,
                        title: attr.title
                    };
                }

                const select = document.getElementById(`basetaoAttr${index}`);
                if (select && select.value) {
                    const parsed = JSON.parse(select.value);
                    return {
                        id: parsed.id,
                        name: parsed.name,
                        title: attr.title
                    };
                }

                return { id: 0, name: '', title: '' };
            }).filter(attr => attr.id !== 0);
        };

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Add to Basetao';
        submitBtn.style.cssText = `
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 8px;
        `;
        submitBtn.onmouseover = () => {
            submitBtn.style.transform = 'translateY(-2px)';
            submitBtn.style.boxShadow = '0 10px 20px -5px rgba(245, 158, 11, 0.4)';
        };
        submitBtn.onmouseout = () => {
            submitBtn.style.transform = 'translateY(0)';
            submitBtn.style.boxShadow = 'none';
        };

        submitBtn.onclick = async () => {
            console.log('Add to Basetao button clicked');

            const selectedAttrs = getSelectedAttributes();
            const attrIds = selectedAttrs.map(attr => attr.id);
            const selectedSku = itemData.skus.find(sku =>
                sku.attrIds.length === attrIds.length &&
                sku.attrIds.every(id => attrIds.includes(id))
            );

            if (!selectedSku || selectedSku.stock === 0) {
                showNotification('This combination is out of stock', true);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            submitBtn.style.opacity = '0.7';

            try {
                let size = '';
                let color = '';

                selectedAttrs.forEach(attr => {
                    const originalTitle = attr.title.split(' (')[0].toLowerCase();
                    const translatedTitle = attr.title.includes('(') ? attr.title.split(' (')[1].replace(')', '').toLowerCase() : '';
                    const name = attr.name;

                    if (
                        originalTitle.includes('尺码') ||
                        translatedTitle.includes('size') ||
                        name.match(/S|M|L|XL/i)
                    ) {
                        size = name;
                    } else if (
                        originalTitle.includes('颜色') ||
                        translatedTitle.includes('color') ||
                        translatedTitle.includes('colour')
                    ) {
                        color = name;
                    } else if (!color) {
                        color = name;
                    }
                });

                const remarks = selectedAttrs.map(attr => {
                    const originalTitle = attr.title.split(' (')[0];
                    return `${originalTitle}: ${attr.name}`;
                }).join(', ');

                let selectedImage = itemData.mainImage;
                for (let i = 0; i < selectedAttrs.length; i++) {
                    const val = itemData.attributes[i].values.find(v => v.id === selectedAttrs[i].id);
                    if (val && val.img) {
                        selectedImage = val.img;
                        break;
                    }
                }

                const formData = {
                    itemName: itemData.itemName,
                    seller: itemData.seller,
                    link: window.location.href,
                    price: selectedSku.price || itemData.price,
                    shippingPrice: itemData.shippingFee.toString(),
                    imageUrl: selectedImage,
                    size: size || "-",
                    color: color || "-",
                    skuId: selectedSku.skuId,
                    itemId: itemData.itemId,
                    remarks: remarks
                };

                console.log('Form data for submission:', formData);

                const basetao = new BaseTao();
                await basetao.submitOrder(formData);
                showNotification('Item added to Basetao cart');
            } catch (error) {
                console.error('Error submitting to Basetao:', error);
                showNotification(error.message, true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add to Basetao';
                submitBtn.style.opacity = '1';
            }
        };

        formContainer.appendChild(submitBtn);
        container.appendChild(formContainer);

        updatePrice();
        updateAvailability();
    }

    function showNotification(message, isError = false) {
        console.log(`Showing notification: ${message} (isError: ${isError})`);
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 16px 24px;
            background: ${isError ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 10001;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
        `;

        const icon = document.createElement('span');
        icon.style.cssText = `font-size: 20px; font-weight: bold;`;
        icon.textContent = isError ? '✕' : '✓';

        notification.appendChild(icon);
        notification.appendChild(document.createTextNode(message));

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async function addBasetaoForm() {
        if (isAdding) {
            console.log('Form addition already in progress, skipping');
            return;
        }
        isAdding = true;

        console.log('Attempting to add Basetao form');
        const target = document.querySelector('.item-wrap');
        if (!target) {
            console.error('Target element (.item-wrap) not found');
            isAdding = false;
            return;
        }
        console.log('Target element found:', target);

        if (document.querySelector('#basetaoInlineForm')) {
            console.log('Basetao form already exists, skipping');
            isAdding = false;
            return;
        }

        try {
            const itemData = await getItemData();
            createInlineForm(itemData, target);
        } catch (error) {
            console.error('Failed to load item data:', error);
            showNotification('Failed to load item data: ' + error.message, true);
        } finally {
            isAdding = false;
        }
    }

    console.log('Scheduling form addition');
    setTimeout(() => addBasetaoForm(), 1000);
    setTimeout(() => addBasetaoForm(), 2000);
    setTimeout(() => addBasetaoForm(), 3000);
})();