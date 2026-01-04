// ==UserScript==
// @name        ShopeeLAB: COMBO cnb & hosted
// @namespace   checknbuySv2.apphub.ga
// @author      Rizuwan
// @description Check Product until stock available and immediately checkout at cart page
// @match       https://shopee.com.my/checkout*
// @match       https://shopee.com.my/cart*
// @match       https://shopee.com.my/*-i.*
// @match       https://shopee.com.my/product/*
// @match       https://shopee.com.my/m/special-hours*
// @match       https://shopee.com.my/m/midmonthmadness*
// @match       https://help.shopee.com.my/*
// @version     3.6.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require     https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @connect     139.180.220.105
// @connect     38.54.97.25
// @connect     192.168.0.113
// @connect     192.168.0.173
// @connect     10.21.205.164
// @connect     detect.roboflow.com
// @downloadURL https://update.greasyfork.org/scripts/552285/ShopeeLAB%3A%20COMBO%20cnb%20%20hosted.user.js
// @updateURL https://update.greasyfork.org/scripts/552285/ShopeeLAB%3A%20COMBO%20cnb%20%20hosted.meta.js
// ==/UserScript==

GM_addStyle('#vline {width: 1px; height: 1000%; border-left: 2px solid #ff0000ab; position: absolute; top: 0px; z-index: 999;} #shopee-mini-chat-embedded {display: none;}')

'use strict';
// INITIALIZE
const msg           = function(m, ...args) { console.log('['+moment().format('HH:mm:ss:SSS')+'] SHOPEEFLASH:', m , args); }
var checkoutAttempt = false
var temp = {};
var cnbTarget = JSON.parse(localStorage.shopeelab_checknbuy || '{}');
var placeOrderObj = JSON.parse(localStorage.shopeelab_placeorder || '{}');
var cnbMode = '';
var fetcherBUY = {}
var tryPlace = 0
var checkoutData, alt9modelid, scanDeals
var manualCheckout = true
var oosbuy = false
var isBrowserRefresher = false
// vDmMjJVF7Ks2?

// SET CONFIG HERE
const eventTime         = '12:00'; // hh:mm (24hour format) ... 24:00 for 12am
const timeSync          = 0;      // time.is exact sync status ... "Your clock is 0.6 seconds ahead" [ ahead: positive number | behind: negative number | exact: 0]
const msEarlier         = -40;      // milliseconds earlier adjustment before eventTime
const lastRefresh       = 20; // in seconds
var targetPrice         = '250.00';   // string formatted || Actual PROMO PRICE on EVENT TIME
var targetPrice2        = '19.99';   // string formatted || Actual PROMO PRICE on EVENT TIME || press [ALT] + [/]
var targetPrice3        = '10.90';   // string formatted || Actual PROMO PRICE on EVENT TIME || press [ALT] + [.]
var targetPrice4        = '1.56';   // string formatted || Actual PROMO PRICE on EVENT TIME || press [ALT] + [,]
const targetPriceOverride = true;   // Override Promo deals  || comment if not used
// const targetPrice   = prompt('offer price') || '8.00'
const shippingFee       = null;  // null or | '4.90'
const voucherName       = 'No Min. Spend';
const PAYMENT           = 'cimb'; // cimb / spaylater / shopeepay / maybankcc / sccc
const SST_RATE = 0.06; // percentage (6% for shipping fee)

// SAMSUNG ( combined Alt+6 to activate )
const samsungChkActive  = true
const hargaSamsung      = 'RM 100.00';
const shopName          = 'Samsung Flagship Store';
const spamCheckInMS     = 1500; // spam check tiap 2 saat

// SWITCHER
const poQuantity        = 1
var   isQuickBuy        = true // set false to normal place order from cart ( preventing error_fulfillment_info_changed) (biasa barang besar/berat)  --- scan and update cart, then place order (recommended to item Price > RM300)
const showOOSbyitemID   = false // if False, show by modelID
const clearVCs          = true;
const isCachedCheckout  = false;
const enforceShippingFee = false;
var refreshLastMinit = true;

const placeOrder        = true;         // set false for testing
const captchaSolver     = true;
const captchaType       = 'solver'   // mousedown | solver
const autoSolver        = true         // auto drop puzzle (for captchaType solver)
// const INFER_SERVER      = '139.180.220.105:9001'    // SINGAPORE
const INFER_SERVER      = '38.54.97.25:9001'            // MALAYSIA
// const INFER_SERVER  = 'detect.roboflow.com'
const API_KEY           = '7MMnwyR498iGNY8iGjeU'

// const MACRODROID_IP     = '192.168.0.113'
// const MACRODROID_IP     = '192.168.0.113'
const MACRODROID_IP     = '10.21.205.209'
/*************************** */
const fakeCaptcha       = false;        // set false for testing (for captchaType solver and autoSolver disabled) -- not drop puzzle when set to true
const tryPlaceMode      = 'apicheck'    // clicktry | apicheck



/********************************************************************************************************************************************* */
/********************************************************************************************************************************************* */
/********************************************************************************************************************************************* */

let deals = JSON.parse(sessionStorage.getItem('shopeeLAB_deals'));
const convertedPrice = Number(targetPrice.replace('.','')) * 1000;
const startedURL = location.href

const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;

    // REQUEST MODIFIER : start
    if(resource.includes('cart/update')) {

        body = JSON.parse(config.body)

        if(body.updated_shop_order_ids[0].item_briefs[0].checkout) {

            if(body.updated_shop_order_ids[0].item_briefs[0].itemid == cnbTarget.itemid) {
                if(body.updated_shop_order_ids[0].item_briefs[0].modelid != cnbTarget.modelid && !manualCheckout) {

                    body.action_type                                            = 3;
                    body.updated_shop_order_ids[0].item_briefs[0].old_modelid   = body.updated_shop_order_ids[0].item_briefs[0].modelid
                    body.updated_shop_order_ids[0].item_briefs[0].modelid       = cnbTarget.modelid

                    config.body = JSON.stringify(body);
                }
            }

        }

    }

    if(resource.includes('pdp/get_pc?')) {
        if(!fetcherBUY.hasOwnProperty('url')) {
            fetcherBUY = {url: resource, config}
            console.log('intercepting fetcherBUY',fetcherBUY);
        }

        temp.fetcherBUY = config
    }

    if(resource.includes('checkout/place_order')) {
        body = JSON.parse(config.body)

        // place order OOS without add to cart
        if(temp.checkoutOOS || temp.checkoutOOSunknown || temp.buycheckoutOOS) {
            const { initObj, genObj } = genData(body)

            Object.assign(body,initObj,genObj)
        }

        if(alt9modelid || temp.hasOwnProperty('checknplace')) {
            body.shoporders[0].items[0].modelid = alt9modelid ?? cnbTarget.modelid
            if(isQuickBuy && !temp.buycheckoutOOS) {
                body.client_id = 5
                body.cart_type = 1
            }

            if(isCachedCheckout) {
                Object.assign(body,{
                    "ndd_info": {
                        "header": [""],
                        "data": [[""]]
                    }
                })
            }
        }

        config.body = JSON.stringify(body);
        console.timeEnd('Place order clicked --> request started')
        console.time('Place Order Response Time')

        curTimestamp = moment().valueOf()
        placeOrderObj.req = body
        placeOrderObj.req.masa = {
            timestamp: curTimestamp,
            display: moment(curTimestamp).format('HH:mm:ss:SSS')
        }

        localStorage.shopeelab_placeorder = JSON.stringify(placeOrderObj)
    }

    if(resource.startsWith('https://shopee.com.my/api/')) {
        urlpath = resource.substring(resource.indexOf('/api/v4/') + 8);
        if(!urlpath.match(new RegExp(['notification','abtest','get_payment_info','captcha','get_pc'].join("|"), "gi"))) {
            // resource = resource.replace('shopee.com.my','mall.shopee.com.my');
        }

        if(['checkout/get'].includes(urlpath)) {
            body = JSON.parse(config.body)
            body.device_info = {
                "device_id": "Gmat6hpitatYPsUzN3/5LhVayXxiahqqbNJ/GG2j1xk=",
                "device_fingerprint": "6daf9a6839792240_unknown",
                "device_sz_fingerprint": "46fiILaxWMOXNR2Lu0tLfA==|T///GP/WgjUNiPLhBFLgKUSrJmByyM0sIrL59koFPYql6oYmqjYXzYDKUZ3F5w/UKHOX1121AYLtUUqicsdfgR3nr80uHZV9gq3+fv6v+A==|88U03kEpi9QbPtyE|08|1",
                "buyer_payment_info": {
                    "is_jko_app_installed": false
                },
                "gps_location_info": {
                    "status": 0,
                    "latitude": null,
                    "longitude": null
                },
                "timezone_offset_in_minutes": 480,
                "model_info": "Brand/iqoo Model/i2401 OSVer/35 Manufacturer/vivo"
            };

            // config.body = JSON.stringify(body);
            console.log('CONFIG :',config,body)
        }
        if(resource.endsWith('cart_panel/select_variation_pc')) {
            // resource = resource.replace('cart_panel/select_variation_pc','get/select_variation_rw');

        }
    }

    // REQUEST MODIFIER : end

    let response = await originalFetch(resource, config);

    // RESPONSE MODIFIER : start
    const json = () =>
    response
    .clone()
    .json()
    .then((data) => {
        data = { ...data };
        if(response.url.startsWith('https://shopee.com.my/api/v4/')) {
            // console.log('the DATA',response.url, data);
        }
        // intercept response here if any
        if(response.url.endsWith('/api/v4/checkout/place_order')) {
            if(data.hasOwnProperty('error')) {
                data.error_msg = `${data.error_msg} - ${data.error} (${moment().format('HH:mm:ss:SSS')})`

                if(data.hasOwnProperty('error_action')) {
                    data.error_action.default_message = `${data.error_action.default_message} - ${data.error} (${moment().format('HH:mm:ss:SSS')})`
                    data.error_action.message = `${data.error_action.message} - ${data.error} (${moment().format('HH:mm:ss:SSS')})`

                    if(['error_stock','error_empty_cart'].includes(data.error)) {
                        delete data.error_action;
                    }
                }

                if(data.error == 'error_fulfillment_info_changed') {
                    if(isBrowserRefresher) {
                        isQuickBuy = false

                        if(temp.checkoutOOSunknown) {
                            temp.checkoutOOSunknown = false;
                            temp.buycheckoutOOS = true;
                        }
                    }
                }

                if(tryPlace == 20) {
                    // data = {}
                }
                tryPlace++
            }
            console.timeEnd('Place Order Response Time')
            console.log(`RESPONSE Place Order:\nerror: ${data.error ?? 'no error'}\ndata: `, data);

            curTimestamp = moment().valueOf()
            placeOrderObj.res = data
            placeOrderObj.res.masa = {
                timestamp: curTimestamp,
                display: moment(curTimestamp).format('HH:mm:ss:SSS'),
                duration: `${moment.duration(curTimestamp - placeOrderObj.req.masa.timestamp).asMilliseconds()} ms`
            }
            localStorage.shopeelab_placeorder = JSON.stringify(placeOrderObj)
        }

        if(response.url.endsWith('/api/v2/voucher_wallet/save_voucher')) {
            GM_xmlhttpRequest ( {
                method:     "GET",
                url:        `http://${MACRODROID_IP}:8080/claimed`
            })
        }

        if(response.url.endsWith('/api/v4/checkout/get')) {

            if(data.error && ['error_stock','error_empty_cart'].includes(data.error) || isCachedCheckout) {
                if(cnbTarget.checkoutData.hasOwnProperty('shoporders') || isCachedCheckout) {
                    data = cnbTarget.checkoutData
                    data.timestamp = moment().unix()

                    data.shoporders[0].shop.shop_name = data.shoporders[0].shop.shop_name + ' (cached)'

                    if(!isCachedCheckout) {
                        data.shoporders[0].items[0].modelid = JSON.parse(config.body).shoporders[0].items[0].modelid
                        data.shoporders[0].items[0].model_name = cnbTarget.variant
                        data.shoporders[0].items[0].image = cnbTarget.iteminfo.product_images.first_tier_variations.find( f => cnbTarget.variant.startsWith(f.name))?.image || data.shoporders[0].items[0].image
                    }
                }
            }

            else {
                if(!startedURL.includes('-i.') && (temp.isAlt5 || !startedURL.startsWith('https://shopee.com.my/cart'))) {
                    console.log('RESP MODIFIER CHECKING ---->',targetPrice,deals,typeof targetPrice,typeof targetPrice !== 'undefined')
                    targetPrice = typeof targetPrice !== 'undefined' ? targetPrice : null
                    try {
                        if(!targetPriceOverride) {
                            targetPrice = deals.find( i => i.modelid === data.shoporders[0].items[0].modelid && i.itemid === data.shoporders[0].items[0].itemid  ).dealprice || targetPrice
                        }

                    } catch (error) {}

                    targetPrice = sessionStorage.getItem('targetPrice') ?? targetPrice;

                    const convertedPrice = targetPrice.replace(/[,.]/g,'') * 1000;
                    const currentModelID = data.shoporders[0].items[0].modelid;

                    if(sessionStorage.getItem('loadOOSmodel')) {
                        data.shoporders[0].items[0].itemid = cnbTarget.itemid
                        data.shoporders[0].items[0].modelid = cnbTarget.modelid
                        data.shoporders[0].items[0].model_name = cnbTarget.iteminfo.item.models[0]?.name || ''
                        data.shoporders[0].items[0].name = cnbTarget.iteminfo.item.title
                        data.shoporders[0].items[0].image = cnbTarget.iteminfo.item.image
                    }

                    if((cnbTarget.fsminspend > convertedPrice || !cnbTarget.fsminspend) && data.shoporders[0].items[0].itemid == cnbTarget.itemid) {
                        let convertedShippingFee = (cnbTarget.preferred_shipping.price_before_discount?.single_value == -1 ? cnbTarget.preferred_shipping.price_before_discount?.range_max : cnbTarget.preferred_shipping.price_before_discount?.single_value) || (cnbTarget.preferred_shipping.price?.single_value == -1 ? cnbTarget.preferred_shipping.price?.range_max : cnbTarget.preferred_shipping.price?.single_value) || 0;

                        // rule: 1656427 (vc fs) | 1527425 (Seller Own Fleet)
                        if(cnbTarget.preferred_shipping.channel_promotion_infos && cnbTarget.preferred_shipping.channel_promotion_infos[0]?.rule_id != 1656427) {
                            if(cnbTarget.preferred_shipping.channel_promotion_infos[0]?.rule_id == 1527425 && cnbTarget.preferred_shipping.channel_promotion_infos[0].min_spend.single_value < convertedPrice) {
                                convertedShippingFee = cnbTarget.preferred_shipping.price.single_value
                            }
                        }

                        if(currentModelID == cnbTarget.modelid) {
                            convertedShippingFee = data.checkout_price_data.shipping_subtotal
                            cnbTarget.preferred_shipping.price.single_value = data.checkout_price_data.shipping_subtotal
                            localStorage.shopeelab_checknbuy = JSON.stringify(cnbTarget)
                        }

                        if(data.checkout_price_data.shipping_sst_amount) {
                            data.checkout_price_data.shipping_sst_amount = Number(((convertedShippingFee) - (((convertedShippingFee / (1 + SST_RATE) / 100000).toFixed(2) * 100000)).toFixed(0)))
                        }

                        data.checkout_price_data.shipping_subtotal_before_discount = data.checkout_price_data.shipping_sst_amount ? (convertedShippingFee - data.checkout_price_data.shipping_sst_amount) : convertedShippingFee
                        data.checkout_price_data.shipping_subtotal = convertedShippingFee
                        data.shipping_orders[0].shipping_fee = convertedShippingFee
                        data.shoporders[0].shipping_fee = convertedShippingFee
                        data.shoporders[0].shipping_fee_discount = 0
                        data.shipping_orders[0].shipping_fee_discount = 0
                        data.checkout_price_data.shipping_discount_subtotal = 0
                    }

                    // data.checkout_price_data.price_breakdown.find( f => f.id == 'shipping_discount').value = data.shoporders[0].shipping_fee_discount

                    if(enforceShippingFee) {
                        data.checkout_price_data.shipping_sst_amount = parseInt(data.checkout_price_data.shipping_subtotal_before_discount * SST_RATE / 1000) * 1000;
                        convertedShippingFee = data.checkout_price_data.shipping_subtotal_before_discount + data.checkout_price_data.shipping_sst_amount
                        data.checkout_price_data.shipping_subtotal = convertedShippingFee
                        data.shipping_orders[0].shipping_fee = convertedShippingFee
                        data.shoporders[0].shipping_fee = convertedShippingFee
                        try {
                            data.checkout_price_data.price_breakdown.find( f => f.id == 'shipping_discount').value = 0
                        } catch (error) {}

                        data.checkout_price_data.price_breakdown = data.checkout_price_data.price_breakdown.filter( f => f.id != 'shipping_discount')
                    }

                    data.checkout_price_data.price_breakdown.find( f => f.id == 'estimated_shipping_fee').value = data.checkout_price_data.shipping_sst_amount ? data.checkout_price_data.shipping_subtotal_before_discount : 0
                    data.checkout_price_data.price_breakdown.find( f => f.id == 'shipping_fee_tax').value = data.checkout_price_data.shipping_sst_amount

                    data.shoporders[0].items[0].price                    = convertedPrice
                    data.checkout_price_data.merchandise_subtotal        = convertedPrice * data.shoporders[0].items[0].quantity
                    data.shoporders[0].order_total_without_shipping      = data.checkout_price_data.merchandise_subtotal
                    data.shipping_orders[0].order_total_without_shipping = data.checkout_price_data.merchandise_subtotal
                    data.checkout_price_data.price_breakdown.find( f => f.id == 'merchandise_total').value = data.checkout_price_data.merchandise_subtotal

                    data.shoporders[0].order_total                       = data.shoporders[0].shipping_fee + data.shoporders[0].order_total_without_shipping
                    data.shipping_orders[0].order_total                  = data.shipping_orders[0].shipping_fee + data.shipping_orders[0].order_total_without_shipping

                    data.checkout_price_data.total_payable               = data.shoporders[0].order_total

                    // if(temp.isAlt5)
                        data.can_checkout = true
                }
                else {
                    let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')

                    if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
                        location.reload()
                    }
                }

                // PRE uncheck INSURANCES
                // MOBILE PROTECTION // Extended Warranty
                if(data.shoporders[0].items[0].insurances.length) {
                    for (let i = 0; i < data.shoporders[0].items[0].insurances.length; i++) {
                        data.shoporders[0].items[0].insurances[i].selected = false
                    }

                    data.checkout_price_data.insurance_before_discount_subtotal = 0
                    data.checkout_price_data.insurance_subtotal = 0

                    data.shoporders[0].order_total_without_shipping = data.checkout_price_data.merchandise_subtotal
                    data.shipping_orders[0].order_total_without_shipping = data.shoporders[0].order_total_without_shipping

                    data.shoporders[0].order_total = data.shoporders[0].order_total_without_shipping + data.shoporders[0].shipping_fee
                    data.shipping_orders[0].order_total = data.shoporders[0].order_total

                    data.checkout_price_data.total_payable = data.shoporders[0].order_total
                }

                // PRE UNTICK VOUCHERS
                if(clearVCs) {
                    data.promotion_data.applied_voucher_code = null
                    data.promotion_data.platform_vouchers = []
                    data.promotion_data.price_discount = 0
                    data.promotion_data.voucher_code = null
                    data.promotion_data.voucher_info = {
                                                            "coin_earned": 0,
                                                            "voucher_code": null,
                                                            "coin_percentage": 0,
                                                            "discount_percentage": 0,
                                                            "discount_value": 0,
                                                            "promotionid": 0,
                                                            "reward_type": 0,
                                                            "used_price": 0
                                                        }
                    delete data.promotion_data.shop_vouchers
                    delete data.promotion_data.shop_vouchers_entrances
                    data.promotion_data.use_coins = false

                }

                // PRE SELECT PAYMENT
                temp.paymentchannels = data.payment_channel_info.channels
                switch (PAYMENT) {
                    case 'cimb':
                        selectedPayment = data.payment_channel_info.channels.find( f => f.hasOwnProperty('banks'))
                        data.selected_payment_channel_data = Object.assign(data.selected_payment_channel_data, {
                                                                "version": 2,
                                                                "additional_info": {
                                                                                        "reason": "",
                                                                                        "channel_blackbox": "{}"
                                                                                    },
                                                                "text_info": {},
                                                                "channel_id": selectedPayment.channel_id,
                                                                "name": selectedPayment.name,
                                                                "channel_item_option_info": {
                                                                                                "option_info": selectedPayment.banks.find( f => f.bank_name == 'CIMB Clicks').option_info
                                                                                            },
                                                            });
                        break;

                    case 'maybankcc':
                    case 'sccc':
                        selectedPayment = data.payment_channel_info.channels.find( f => f.hasOwnProperty('cards'))
                        bank = PAYMENT == 'maybankcc' ? 'Maybank' : 'STANDARD CHARTERED BANK MALAYSIA'
                        card = selectedPayment.cards.find( f => f.bank_name == bank)

                        data.selected_payment_channel_data ={
                                                                "version": 2,
                                                                "option_info": "",
                                                                "channel_id": selectedPayment.channel_id,
                                                                "channel_item_option_info": {
                                                                "channel_item_id": card.channel_item_id,
                                                                "name": selectedPayment.name,
                                                                "credit_card_data": {
                                                                    "bank_id": card.bank_id,
                                                                    "bank_name": card.bank_name,
                                                                    "card_number": card.card_number,
                                                                    "expiry_date": card.expiry_date
                                                                }
                                                                },
                                                                "text_info": {}
                                                            }
                        break;

                    case 'spaylater':
                        selectedPayment = data.payment_channel_info.channels.find( f => f.name == 'SPayLater')
                        data.selected_payment_channel_data = Object.assign(data.selected_payment_channel_data, {
                                                                "version": 2,
                                                                "additional_info": {
                                                                                        "reason": "",
                                                                                        "channel_blackbox": selectedPayment.channel_blackbox
                                                                                    },
                                                                "text_info": {},
                                                                "channel_id": selectedPayment.channel_id,
                                                                "name": selectedPayment.name,
                                                                "channel_item_option_info": {
                                                                                                "option_info": selectedPayment.installment_plans.find( f => f.tenure === 1).option_info
                                                                                            },
                                                            });
                        break;

                    case 'shopeepay':
                        selectedPayment = data.payment_channel_info.channels.find( f => f.name == 'ShopeePay')
                        data.selected_payment_channel_data = Object.assign(data.selected_payment_channel_data, {
                                                                "version": 2,
                                                                "text_info": {},
                                                                "channel_id": selectedPayment.channel_id,
                                                                "name": selectedPayment.name,
                                                                "option_info": ""

                                                            });
                        break;
                    default:
                        break;
                }
                data.disabled_checkout_info = Object.assign(data.disabled_checkout_info, {
                                                description: '',
                                                error_infos: []
                                            })

                if(cnbTarget.itemid == data.shoporders[0].items[0].itemid) {
                    cnbTarget.checkoutData = data
                    localStorage.shopeelab_checknbuy = JSON.stringify(cnbTarget)
                }

                checkoutData = data
            }

            if(sessionStorage.getItem('loadOOSmodel')) {
                data.client_id = 5
                data.cart_type = 1
            }

            temp.checkoutData = data
            if(cnbTarget.checkoutOOS2) {
                const { initObj, genObj } = genData(data)

                Object.assign(data,initObj)

                Object.assign(data.shoporders[0].items[0],genObj.shoporders[0].items[0])
                Object.assign(data.shipping_orders,genObj.shipping_orders)
                data.device_info = genObj.device_info
                Object.assign(data.checkout_price_data,genObj.checkout_price_data)
                Object.assign(data.timestamp,genObj.timestamp)

                $(".navbar-wrapper").css("background-color","#8bc34a")
            }

        }

        if(response.url.endsWith('/api/v4/cart/get')) {

            shopIndex = data.data.shop_orders.findIndex(shop => shop.items.find( item => item.itemid == cnbTarget.itemid))
            itemIndex = shopIndex != -1 ? data.data.shop_orders[shopIndex].items.findIndex( item => showOOSbyitemID ? item.itemid == cnbTarget.itemid : item.modelid == cnbTarget.modelid) : -1

            data.data.shop_orders.forEach((order,io) => {
                order.items.forEach((item,ii) => {
                    if(item.deep_discount_campaign_text_pc) {
                        data.data.shop_orders[io].items[ii].deep_discount_campaign_text_pc = data.data.shop_orders[io].items[ii].deep_discount_campaign_text_pc.replace('{{promotion_start_time}}', moment.unix(data.data.shop_orders[io].items[ii].deep_discount_campaign_start_time).format('DD MMM hA'))
                        data.data.shop_orders[io].items[ii].deep_discount_campaign_text_mobile = data.data.shop_orders[io].items[ii].deep_discount_campaign_text_mobile.replace('{{promotion_start_time}}', moment.unix(data.data.shop_orders[io].items[ii].deep_discount_campaign_start_time).format('DD MMM hA'))
                    }
                });
            });

            if(itemIndex != -1) {

                selectedItem = data.data.shop_orders[shopIndex].items[itemIndex]

                var isSingleVariation = true
                var isSoldOut = !selectedItem.stock
                var isUnlisted = !selectedItem.status  // 0:unlisted  |  1:available  |  6:soldout

                if(isSoldOut) {
                    data.data.shop_orders[shopIndex].items[itemIndex].item_stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].status = 1
                    data.data.shop_orders[shopIndex].items[itemIndex].normal_stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].total_can_buy_quantity = 99

                    if(data.data.shop_orders[shopIndex].items[itemIndex].models.length) {
                        data.data.shop_orders[shopIndex].items[itemIndex].models.find( model => model.modelid == cnbTarget.modelid).stock = 99
                        data.data.shop_orders[shopIndex].items[itemIndex].models.find( model => model.modelid == cnbTarget.modelid).normal_stock = 99
                    }
                }

                if(isUnlisted) {
                    data.data.shop_orders[shopIndex].items[itemIndex].status = 1
                }

                if(showOOSbyitemID) {
                    data.data.shop_orders[shopIndex].items.filter( f => f.itemid == cnbTarget.itemid).forEach( f => {
                      f.item_stock = 99
                      f.stock = 99
                      f.status = 99
                      f.normal_stock = 99
                      f.total_can_buy_quantity = 99
                    })
                }
            }

        }

        if(response.url.endsWith('/api/v4/cart/update')) {
            if(data.data.shoporders.length) {
                    data.scanDeals = data.data.shoporders
                    data.data.shoporders = []
                    data.warn_message = ""
            }
        }

        if(response.url.endsWith('/api/v4/cart/checkout')) {
            data.error = 0
            data.error_message = null

            data.data.problematic_groups = []
            data.data.tracking_code = null
            data.data.tracking_data = null
            data.data.refresh_packaged_ids = null
        }

        if(response.url.startsWith('https://shopee.com.my/api/v4/pdp/get_pc?')) {

            if(data.data.hasOwnProperty('item')) {
                const convertedPrice = targetPrice.replace('.','') * 1000;

                totalstocks = 0
                data.data.item.models.forEach((f,i) => {
                    if(data.data.item.models[i].stock && data.data.item.models[i].price == convertedPrice) {
                        $(`button.product-variation:contains(${data.data.item.models[i].name})`).click()
                        setTimeout(() => {
                            $("button:contains(buy now)").click()
                        }, 150);
                    }

                    if(!data.data.item.models[i].normal_stock) {
                        data.data.item.models[i].normal_stock = 5;
                        data.data.item.models[i].stock = 5;
                        data.data.item.models[i].has_stock = true;
                        data.data.item.models[i].is_clickable = true;
                        data.data.item.models[i].is_grayout = false;
                        totalstocks += 5
                    }
                    else {
                        totalstocks += data.data.item.models[i].stock
                    }
                })

                data.data.item.stock = totalstocks
                data.data.item.normal_stock = totalstocks
                data.data.item.other_stock = totalstocks
            }
        }


        if(response.url.endsWith('/api/v4/recommend/product_detail_page')) {
            data.data.sections[0].units[0].shopid = cnbTarget.shopid
            data.data.sections[0].units[0].itemid = cnbTarget.itemid
            data.data.sections[0].units[0].name   = cnbTarget.name
        }

        // RESPONSE MODIFIER : end
        return data
    })


// RESPONSE INTERCEPTOR : start
   response.json = json;

    if(response.url.endsWith('/api/v4/cart/get')) {

        let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')
        msg(timer + " miliseconds / " + moment.duration(timer).humanize() + " remaining")

        if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
            msg(timer);
            setTitle('', timer)

            setTimeout(() => {
                if(temp.alt6 || temp.altshift6) {

                    unsafeWindow.fetch('https://shopee.com.my/api/v4/cart/get', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "pre_selected_item_list": [],
                            "updated_time_filter": {
                                "start_time": 0
                            },
                            "version": 11
                        })
                    })
                        .then((response) => response.json())
                        .then(async (response) => {
                        if(temp.alt6) {

                        const KOprices = response.data.shop_orders
                                        .flatMap( order => {
                                            order.items.forEach( f => { f.shop = order.shop.shopname})
                                            return order.items
                                        })
                                        .map( item => {
                                            return {
                                                item: item.name,
                                                shop: item.shop,
                                                masa: moment().format('DD/MM/YY hA'),
                                                variation: !item.models.length ? ([{
                                                    name: item.name,
                                                    stock: item.stock,
                                                    harga: `RM ${((item.price / 100000).toFixed(2))}`,
                                                    modelid: item.modelid,
                                                    price: item.price,
                                                }]) :
                                                item.models.map( model => {
                                                    return {
                                                        name: model.name,
                                                        stock: model.stock,
                                                        harga: `RM ${((model.price / 100000).toFixed(2))}`,
                                                        modelid: model.modelid,
                                                        price: model.price,
                                                    }
                                                })
                                            }
                                        })

                        setTimeout(() => {
                            if(!KOprices.find( v => v.shop == shopName).variation.find( f => f.harga == hargaSamsung && f.stock > 0))
                            {
                                checkbuyMD();
                            }
                            else {
                                alert('SamsungCheck Terminated: Item stock ON TIME !')
                            }
                        }, 14000);

                        console.log("KO PRICES:", KOprices)
                        localStorage.KOprices = JSON.stringify(KOprices)
                        }

                        if(temp.altshift6) {

                            const thisItem = response.data.shop_orders[0].items[0];
                            await unsafeWindow.fetch("https://shopee.com.my/api/v4/cart/update", {
                                "headers": {
                                "accept": "application/json",
                                "content-type": "application/json"
                                },
                                "body": JSON.stringify({
                                "action_type": 3,
                                "updated_shop_order_ids": [
                                        {
                                            "shopid": thisItem.shopid,
                                            "item_briefs": [
                                                {
                                                    "shopid": thisItem.shopid,
                                                    "itemid": thisItem.itemid,
                                                    "item_group_id": thisItem.item_group_id,
                                                    "add_on_deal_id": thisItem.add_on_deal_id,
                                                    "modelid": thisItem.models.find( f => f.stock && f.price == convertedPrice).modelid,
                                                    "quantity": 1,
                                                    "old_modelid": thisItem.modelid,
                                                    "old_quantity": 1,
                                                    "checkout": false
                                                }
                                            ]
                                        }
                                    ],
                                    "version": 459
                                }),
                                "method": "POST"
                            })

                            GM_xmlhttpRequest ( {
                                method:     "GET",
                                url:        `http://${MACRODROID_IP}:8080/checknplace`
                            })
                        }
                    })
                }
            }, timer);
        }

        if(cnbTarget.hasOwnProperty('url')) {
            response.json().then( data => stockcheck(data))
        }
    }

    if(response.url.endsWith('/api/v4/cart/update')) {

        if(cnbTarget.hasOwnProperty('url')) {
            response.json().then( data => cartUpdate(data))
        }
    }

    if(response.url.endsWith('/api/v4/checkout/get')) {
        response.json().then( data => placeorder(data))
    }

    if(response.url.endsWith('/api/v4/checkout/place_order')) {

        response.json().then( () => {
            if(isBrowserRefresher) {
                isBrowserRefresher = false;
                setTimeout( () => { $("span:contains(OK)").click() },50)
            }
        })
    }

    if(response.url.includes('/api/v4/account/address/get_user_address_list')) {

        response.json().then( (data) => {
            temp.addresses = data.data.addresses
        })

        console.log('SHOW TEMP:', temp)
    }

    if(response.url.endsWith('/api/v4/cart/add_to_cart')) {

        response.json().then( data => {
            if(oosbuy) {
                console.log('oosbuy active')
                try {
                    if(data.hasOwnProperty('error')) {
                        if(!data.error) {
                            oosbuy = false
                            console.log('oosbuy deactivated')
                        }
                    }
                    else {
                        oosbuy = false
                        console.log('oosbuy deactivated')
                    }
                } catch (error) {
                    oosbuy = false
                    console.log('oosbuy deactivated')
                }
            }
        })
    }

    if(response.url.includes('/api/v4/pdp/get_pc?')) {
        Object.assign(temp, {
            url: response.url,
            data: (await response.json()).data
        })
    }

    if(response.url.includes('/api/v4/cart/mini')) {

        if(!temp.hasOwnProperty('url') || true) {
            $(".shopee-top").contextmenu(e => {
                e.preventDefault()
                let item,product_shipping;

                if(temp.hasOwnProperty('data')) {
                    item = temp.data.item
                    product_shipping = temp.data.product_shipping
                }
                else {
                    const { initialState: initData } = JSON.parse($("script[type='text/mfe-initial-data']").text())
                    item = Object.values(initData.DOMAIN_PDP.data.PDP_BFF_DATA.cachedMap)[0].item
                    product_shipping = Object.values(initData.DOMAIN_PDP.data.PDP_BFF_DATA.cachedMap)[0].product_shipping

                    temp = {
                        url: response.url,
                        data: Object.values(initData.DOMAIN_PDP.data.PDP_BFF_DATA.cachedMap)[0]
                    }
                }

                const modelist = item.models.map((m,i) => ( '['+i+'] ' + m.name + ' | ' + m.stock)).join('\n')
                console.log(item.models.map((m,i) => ( '['+i+'] ' + m.modelid + ' | ' + m.name + ' | ' + m.stock)).join('\n'));

                let deepModel;

                if(temp.data.teaser_banner && temp.data.teaser_banner.deep_discount && temp.data.item.models.length) {
                    deepItem = temp.data.item.models.find( f => f.model_id == temp.data.teaser_banner.deep_discount.model_id);
                    deepModel = `RM${((temp.data.teaser_banner.deep_discount.price?.single_value || 0) / 100000).toFixed(2)} | ${moment.unix(temp.data.teaser_banner.deep_discount.reminder_event.start_time).format('DD/MM/YY  hA')}\n[${item.models.findIndex( f => f.model_id == temp.data.teaser_banner.deep_discount.model_id)}] ${deepItem.name} | ${deepItem.stock}\n----------------------\n`
                }

                selected = prompt((deepModel ?? '') + modelist)

                if(selected) {
                    console.log('SELECTED MODEL ---->',item.models[selected])

                    // Preferred Shipping
                    if (product_shipping.ungrouped_channel_infos.length) {
                        preferred_shipping = product_shipping.ungrouped_channel_infos.find( f => f.channel_id === 2000)
                        if(preferred_shipping?.warning?.hasOwnProperty('type')) {
                            preferred_shipping = product_shipping.ungrouped_channel_infos.find( f => !f.warning)
                        }
                        else {
                         preferred_shipping = product_shipping.pre_selected_shipping_channel
                        }
                    } else {
                        preferred_shipping = product_shipping.pre_selected_shipping_channel
                    }

                    localStorage.shopeelab_checknbuy = JSON.stringify({
                        url: response.url,
                        variant: item.models[selected].name,
                        modelid: item.models[selected].model_id,
                        itemid:  item.item_id,
                        shopid:  item.shop_id,
                        name:   item.name,
                        fsminspend: product_shipping.free_shipping?.min_spend?.single_value || 0,
                        preferred_shipping,
                        checkoutData: {},
                        iteminfo: temp.data,
                        fetcherBUY: temp.fetcherBUY
                    });
                }

            })

            console.log('TEMP DATA:', temp)


            let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')
            msg(timer + " miliseconds / " + moment.duration(timer).humanize() + " remaining")

            if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
                msg(timer);
                setTitle('', timer)

                setTimeout(() => {
                    // buypagecheck();

                    if(temp.alt6) {

                        unsafeWindow.fetch(fetcherBUY.url, fetcherBUY.config)
                        .then((response) => response.json())
                        .then((response) => {
                            currentProductPrices = {
                                item: response.data.item.title,
                                shop: response.data.shop_detailed.name,
                                masa: moment().format('DD/MM/YY hA'),
                                variation: response.data.item.models.map( ({name,price,stock,model_id,normal_stock}) =>
                                    ({
                                        name,
                                        price,
                                        harga: `RM ${((price / 100000).toFixed(2))}`,
                                        stock,
                                        modelid:model_id,
                                        normal_stock
                                    })
                                )
                            }

                            setTimeout(() => {
                                let KOprices = JSON.parse(localStorage.KOprices)
                                KOprices.push(currentProductPrices)
                                localStorage.setItem('KOprices', JSON.stringify(KOprices))
                                console.log('price monitor added')
                            }, Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000);


                        })
                    }
                }, timer);
            }
        }

        // msg('PRODUCT PAGE DATA: -----> ', temp.data);
    }

    if(['https://shopee.com.my/api/v4/anti_fraud/captcha/generate','https://help.shopee.com.my/api/v4/anti_fraud/captcha/generate'].includes(response.url) && captchaSolver) {

        response.json().then( data => {
            if(captchaType == 'solver') {
                response.json().then( data => solvecaptcha(data))
            }
            else {
                response.json().then( data => captchamousedown(data))
            }
        })

    }

    // RESPONSE INTERCEPTOR : end
    return response;

};


var stockcheck = function (response) {
    if(startedURL.includes('-i.')) {
        setTimeout(() => {
            $("button span:contains(check out)").click()
        }, 300);
    }

    data = response;

    msg('CART PAGE DATA: -----> ', data);
    // itemShop = data.data.shop_orders.find( f => f.items.find( x => x.models.find(y => y.modelid == cnbTarget.modelid)))
    targetedItem = data.data.shop_orders.find( f => f.items.find( x => x.modelid == cnbTarget.modelid))
    console.log('STOCKCHECK TARGETED ITEM ---->',targetedItem);
    if(targetedItem) {
        if(targetedItem.items[0].models.length === 1) {
            var isSingleVariation = true
            var isSoldOut = !targetedItem.items[0].normal_stock
        }
        else {

            setTimeout(() => {
                // alert('Targeted variant ['+ targetedItem.items[0].models.find( x => x.modelid == cnbTarget.modelid).name +'] for '+ targetedItem.items[0].name +' selected. Please change to other variants to trigger check n buy item!')
            }, 3000);
        }
    }

    let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')
    msg(timer + " miliseconds / " + moment.duration(timer).humanize() + " remaining")

    if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
        msg(timer);
        setTitle('', timer)

        setTimeout(() => {
            if(!temp.alt5done) {
                stockapicheck()
            }
        }, timer);
    }

    deals = []
    data.data.shop_orders.map( m => {
        return m.items.map( i => {
            if(i.deep_discount_campaign_text_pc) {
                return {
                    itemid: i.itemid,
                    modelid: i.modelid,
                    dealprice: $(`<div>${i.deep_discount_campaign_text_pc}</div>`).text().replace('RM ','').split(' ')[0]
                }
            }
        })
    }).filter( f => f.length ).forEach( f => f.forEach( x => { if(x != undefined) deals.push(x)} ))

    sessionStorage.setItem('shopeeLAB_deals', JSON.stringify(deals))
    console.log('AVAILABLE DEALS ---->',deals);
};

var cartUpdate = function (response) {
    console.log('CART UPDATE ---> ', response)
    try {
        if(response.data.total_payment[0] == convertedPrice || (response.data.shoporders[0].updated_items[0].models.length && response.data.shoporders[0].updated_items[0].models[1].price == convertedPrice)) {
            // if(response.data.shoporders.length && response.data.shoporders[0].updated_items[0].checkout && (response.data.shoporders[0].updated_items[0].price == convertedPrice)) {
            $("button.shopee-button-solid--primary > span:contains(check out)").css('background-color','#000').click()
        }

    } catch (error) {
        console.log('CART UPDATE error, must be manual for testing or wrong targeted price')
    }

    const { shopid, itemid, modelid, models, item_group_id, add_on_deal_id, applied_promotion_id, name, model_name, deep_discount_campaign_text_pc, deep_discount_campaign_start_time } = response.scanDeals[0].updated_items.find( f => !f.is_add_on_sub_item )
    scanDeals = { shopid, itemid, modelid, item_group_id, add_on_deal_id, applied_promotion_id, name , model_name, models: models.filter( f => f.stock ).map( m => m.modelid), deep_discount_campaign_start_time, deep_discount_campaign_text_pc }

    console.log(scanDeals)

};

var genData = function(dataObj) {
    initObj = {"client_id": 5,"cart_type": 1,"order_update_info": {},"dropshipping_info": null,"promotion_data": {"can_use_coins": true,"use_coins": false,"platform_vouchers": [],"free_shipping_voucher_info": {"free_shipping_voucher_id": 0,"free_shipping_voucher_code": "","disabled_reason": null,"disabled_reason_code": 0,"banner_info": {"msg": "","learn_more_msg": ""},"required_be_channel_ids": [],"required_spm_channels": []},"spl_voucher_info": null,"highlighted_platform_voucher_type": -1,"shop_voucher_entrances": [{"shopid": cnbTarget.shopid,"status": true}],"applied_voucher_code": null,"voucher_code": null,"voucher_info": {"coin_earned": 0,"voucher_code": null,"coin_percentage": 0,"discount_percentage": 0,"discount_value": 0,"promotionid": 0,"reward_type": 0,"used_price": 0},"invalid_message": "","price_discount": 0,"coin_info": {"coin_offset": 74000,"coin_used": 74,"coin_earn": 0,"coin_earn_by_voucher": 0,"coin_earn_by_maricredit": 0,"coin_earn_rate_by_maricredit": 0},"card_promotion_id": null,"card_promotion_enabled": false},"selected_payment_channel_data": {"version": 2,"option_info": "","channel_id": 2002700,"channel_item_option_info": {"option_info": "30"},"text_info": {},"ros_opt_in": false},"fsv_selection_infos": [],"buyer_info": {"kyc_info": null,"checkout_email": "","spl_activation_status": 2,"authorize_to_leave_preference": 0},"client_event_info": {"is_platform_voucher_changed": false,"is_fsv_changed": false,"recommend_payment_preselect_type": 0,"recommend_shipping_preselect": false},"buyer_txn_fee_info": {"title": "Handling fee","description": "Handling fee is RM0.00 for this transaction","learn_more_url": ""},"disabled_checkout_info": {"description": "","auto_popup": false,"error_infos": []},"can_checkout": true,"buyer_service_fee_info": {"learn_more_url": ""},"iof_info": {"iof_msg": "In International purchases, IOF will be applied as a mandatory collection required by the Federal Government","learn_more_url": ""},"add_to_cart_info": {},"__raw": {},"_cft": [1811668587,3],"captcha_version": 1,"ignored_errors": [0],"ignore_warnings": false}

            switch (PAYMENT) {
                case 'cimb':
                    selectedPayment = dataObj.payment_channel_info.channels.find( f => f.hasOwnProperty('banks'))
                    Object.assign(initObj.selected_payment_channel_data, {
                                                "version": 2,
                                                "additional_info": {
                                                                        "reason": "",
                                                                        "channel_blackbox": "{}"
                                                                    },
                                                "text_info": {},
                                                "channel_id": selectedPayment.channel_id,
                                                "channel_item_option_info": {
                                                                                "option_info": selectedPayment.banks.find( f => f.bank_name == 'CIMB Clicks').option_info
                                                                            },
                                            });
                    break;

                case 'maybankcc':
                case 'sccc':
                    selectedPayment = dataObj.payment_channel_info.channels.find( f => f.hasOwnProperty('cards'))
                    bank = PAYMENT == 'maybankcc' ? 'Maybank' : 'STANDARD CHARTERED BANK MALAYSIA'
                    card = selectedPayment.cards.find( f => f.bank_name == bank)

                    Object.assign(initObj.selected_payment_channel_data, {
                                    "version": 2,
                                    "option_info": "",
                                    "channel_id": selectedPayment.channel_id,
                                    "channel_item_option_info": {
                                    "channel_item_id": card.channel_item_id,
                                    "credit_card_data": {
                                        "bank_id": card.bank_id,
                                        "bank_name": card.bank_name,
                                        "card_number": card.card_number,
                                        "expiry_date": card.expiry_date
                                    }
                                    },
                                    "text_info": {}
                                })
                    break;
            }
            let poitem
            if(cnbTarget.iteminfo.item.models.length) {
                poitem = cnbTarget.iteminfo.item.models.find( f => f.model_id == cnbTarget.modelid)
            }
            else {
                poitem = cnbTarget.iteminfo.item
            }

            poitem.price = convertedPrice
            poShippingFee = shippingFee ? (Number(shippingFee.replace('.','')) * 1000) : (cnbTarget.fsminspend > convertedPrice || !cnbTarget.fsminspend ? cnbTarget.preferred_shipping.price_before_discount?.single_value || cnbTarget.preferred_shipping.price?.single_value || 0 : 0)

            // rule: 1656427 (vc fs) | 1527425 (Seller Own Fleet)
            if(cnbTarget.preferred_shipping.channel_promotion_infos && cnbTarget.preferred_shipping.channel_promotion_infos[0]?.rule_id != 1656427) {
                if(cnbTarget.preferred_shipping.channel_promotion_infos[0]?.rule_id == 1527425 && cnbTarget.preferred_shipping.channel_promotion_infos[0].min_spend.single_value < convertedPrice) {
                    poShippingFee = cnbTarget.preferred_shipping.price.single_value
                }
            }

            if(poShippingFee === -1) {
                if(cnbTarget.preferred_shipping.channel_promotion_infos.length) {
                    poShippingFee = cnbTarget.preferred_shipping.price.single_value == -1 ? cnbTarget.preferred_shipping.channel_promotion_infos[0].min_spend.single_value > convertedPrice ? cnbTarget.preferred_shipping.price.range_max : cnbTarget.preferred_shipping.price.range_min : 0;
                }

                else {
                    poShippingFee = 0;
                }
            }

            if(temp.hasOwnProperty('checkoutData') && (temp.checkoutOOSunknown || temp.buycheckoutOOS)) {
                poShippingFee = temp.checkoutData.shipping_orders[0].shipping_fee
            }

            genObj = {
                "shoporders": [
                    {
                        "shop": {
                            "shopid": cnbTarget.iteminfo.shop_detailed.shopid,
                            "shop_name": cnbTarget.iteminfo.shop_detailed.name,
                            "cb_option": true,
                            "is_official_shop": cnbTarget.iteminfo.shop_detailed.is_official_shop,
                            "remark_type": 0,
                            "support_ereceipt": false,
                            "shop_ereceipt_type": 0,
                            "seller_user_id": cnbTarget.iteminfo.shop_detailed.userid,
                            "shop_tag": 3
                        },
                        "items": [
                            {
                                "itemid": poitem.item_id,
                                "modelid": poitem.model_id,
                                "quantity": poQuantity,
                                "item_group_id": null,
                                "insurances": [],
                                "shopid": poitem.shopid,
                                "shippable": true,
                                "non_shippable_err": "",
                                "none_shippable_reason": "",
                                "none_shippable_full_reason": "",
                                "price": poitem.price,
                                "name": cnbTarget.iteminfo.item.name || cnbTarget.iteminfo.item.title,
                                "model_name": poitem.name,
                                "image": cnbTarget.iteminfo.item.image + "_tn",
                                "add_on_deal_id": 0,
                                "is_add_on_sub_item": false,
                                "is_pre_order": cnbTarget.iteminfo.item.is_pre_order,
                                "is_streaming_price": false,
                                "checkout": true,
                                "categories": [
                                    {
                                        "catids": cnbTarget.iteminfo.item.categories.map( m=>m.catid)
                                    }
                                ],
                                "is_spl_zero_interest": false,
                                "spl_zero_interest_label": "",
                                "is_prescription": false,
                                "channel_exclusive_info": {
                                    "source_id": 0,
                                    "token": "",
                                    "is_live_stream": false,
                                    "is_short_video": false
                                },
                                "offerid": 0,
                                "supports_free_returns": false
                            }
                        ],
                        "tax_info": {
                            "use_new_custom_tax_msg": true,
                            "custom_tax_msg": "",
                            "custom_tax_msg_short": "",
                            "remove_custom_tax_hint": true,
                            "help_center_url": ""
                        },
                        "tax_payable": 0,
                        "import_tax_amount": 0,
                        "icms_amount": 0,
                        "iof_amount": 0,
                        "shipping_id": 1,
                        "shipping_fee_discount": 0,
                        "shipping_fee": poShippingFee,
                        "order_total_without_shipping": (poitem.price * poQuantity),
                        "order_total": poShippingFee + (poitem.price * poQuantity),
                        "buyer_remark": null,
                        "ext_ad_info_mappings": []
                    }
                ],
                "shipping_orders": [
                    {
                        "shipping_id": 1,
                        "shoporder_indexes": [
                            0
                        ],
                        "selected_logistic_channelid": cnbTarget.preferred_shipping.channel_id,
                        "selected_logistic_channel_data": {
                            "estimated_delivery_time_min": cnbTarget.iteminfo.product_shipping.grouped_channel_infos_by_service_type.length ? cnbTarget.iteminfo.product_shipping.grouped_channel_infos_by_service_type[0].channel_infos[0].channel_delivery_info.estimated_delivery_time_min : cnbTarget.iteminfo.product_shipping.pre_selected_shipping_channel.channel_delivery_info.estimated_delivery_time_min
                        },
                        "selected_preferred_delivery_window": {},
                        "buyer_address_data": {
                            "addressid": temp.addresses[0].id,
                            "address_type": 0,
                            "tax_address": "",
                            "is_buyer_address_changed": false
                        },
                        "fulfillment_info": {
                            "fulfillment_flag": dataObj.shipping_orders[0].fulfillment_info.fulfillment_flag,
                            "fulfillment_source": dataObj.shipping_orders[0].fulfillment_info.fulfillment_source,
                            "managed_by_sbs": false,
                            "order_fulfillment_type": dataObj.shipping_orders[0].fulfillment_info.order_fulfillment_type,
                            "warehouse_address_id": dataObj.shipping_orders[0].fulfillment_info.warehouse_address_id,
                            "is_from_overseas": false
                        },
                        "order_total": poShippingFee + (poitem.price * poQuantity),
                        "order_total_without_shipping": (poitem.price * poQuantity),
                        "selected_logistic_channelid_with_warning": null,
                        "shipping_fee": poShippingFee,
                        "shipping_fee_discount": 0,
                        "shipping_group_description": "",
                        "shipping_group_icon": "",
                        "tax_payable": 0,
                        "is_fsv_applied": false,
                        "shipping_discount_type": 0,
                        "prescription_info": {
                            "images": null,
                            "required": false,
                            "max_allowed_images": 0
                        },
                        "import_tax_amount": 0,
                        "icms_amount": 0,
                        "iof_amount": 0,
                        "is_ros_eligible": null,
                        "authorize_to_leave": 0,
                        "selected_preferred_delivery_time_option_id": 0,
                        "sync": true
                    }
                ],
                "device_info": {
                    "device_sz_fingerprint": Cookies.get('shopee_webUnique_ccd')
                },
                "checkout_price_data": {
                    "merchandise_subtotal": (poitem.price * poQuantity),
                    "shipping_subtotal_before_discount": poShippingFee,
                    "shipping_discount_subtotal": 0,
                    "shipping_subtotal": poShippingFee,
                    "shipping_sst_amount": 148000,
                    "tax_payable": 0,
                    "tax_exemption": 0,
                    "import_tax_amount": 0,
                    "icms_amount": 0,
                    "iof_amount": 0,
                    "custom_tax_subtotal": 0,
                    "promocode_applied": null,
                    "credit_card_promotion": null,
                    "shopee_coins_redeemed": null,
                    "group_buy_discount": 0,
                    "bundle_deals_discount": null,
                    "price_adjustment": null,
                    "buyer_txn_fee": 0,
                    "buyer_service_fee": 0,
                    "insurance_subtotal": 0,
                    "insurance_before_discount_subtotal": 0,
                    "insurance_discount_subtotal": 0,
                    "vat_subtotal": 0,
                    "total_payable": poShippingFee + (poitem.price * poQuantity)
                },
                "timestamp": moment().unix() - 10000
            }

            return { initObj, genObj }
}

function stockapicheck (checking) {


        // new method request method
        unsafeWindow.fetch('https://shopee.com.my/api/v4/cart/get', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "pre_selected_item_list": [],
              "updated_time_filter": {
                "start_time": 0
              },
              "version": 11
            })
        })
        .then((response) => response.json())
        .then(async (response) => {
            console.log('STOCK API CHECK ----> ', response)

            if(checking == 'alt5') {
                $('body').css('cursor','default')
                order = response.data.shop_orders.find( f => f.items[0].itemid == cnbTarget.itemid).items[0]

                let item
                if(order && order.models.length) {
                    item = order.models.find( f => f.stock && f.modelid == cnbTarget.modelid)
                }
                else if(order.stock && order.modelid == cnbTarget.modelid) {
                    item = order
                }

                if(item) {
                    temp.alt5done = true
                    manualCheckout = false
                    $(`a[href*='-i.${cnbTarget.shopid}.${cnbTarget.itemid}?']:eq(0)`).parent().parent().prev().find("input").next().click()
                    setTimeout(() => {
                        $("button.shopee-button-solid--primary > span:contains(check out)").css('background-color','#000').click()
                    }, 500);
                }
            }
            else if(checking == 'alt9') {
                itemOrder = response.data.shop_orders.find( f => f.items[0].itemid == cnbTarget.itemid).items[0]
                models = itemOrder.models
                modelChanged = false
                item = models.find( f => f.modelid == itemOrder.modelid && f.stock && f.price == convertedPrice)

                if(!item) {
                    modelChanged = true
                    item = models.find( f => f.stock && f.price == convertedPrice)
                }

                $placeOrder = $(".stardust-button--primary")

                if(item) {
                        alt9modelid = item.modelid

                        // set false sebab manipulate place order request utk client id dan cart type (lagi laju)
                        if(modelChanged && !isQuickBuy) {
                            await fetch("https://shopee.com.my/api/v4/cart/update", {
                                "headers": {
                                "accept": "application/json",
                                "content-type": "application/json"
                                },
                                "body": JSON.stringify({
                                "action_type": 3,
                                "updated_shop_order_ids": [
                                        {
                                            "shopid": cnbTarget.checkoutData.shoporders[0].items[0].shopid,
                                            "item_briefs": [
                                                {
                                                    "shopid": cnbTarget.checkoutData.shoporders[0].items[0].shopid,
                                                    "itemid": cnbTarget.checkoutData.shoporders[0].items[0].itemid,
                                                    "item_group_id": cnbTarget.checkoutData.shoporders[0].items[0].item_group_id,
                                                    "add_on_deal_id": cnbTarget.checkoutData.shoporders[0].items[0].add_on_deal_id,
                                                    "modelid": alt9modelid,
                                                    "quantity": 1,
                                                    "old_modelid": cnbTarget.checkoutData.shoporders[0].items[0].modelid,
                                                    "old_quantity": 1,
                                                    "checkout": false
                                                }
                                            ]
                                        }
                                    ],
                                    "version": 459
                                }),
                                "method": "POST"
                            })

                        }

                        if(placeOrder) {
                            $placeOrder.click()
                            console.time('Place order clicked --> request started')
                        }

                        else {
                            $placeOrder.css('background-color','#000')
                        }

                        msg('Place Order button clicked on PRICE RM' + (item.price / 100000).toFixed(2));
                }
                else {
                    if(tryPlaceMode == 'apicheck' && tryPlace < 5) {
                        setTimeout(() => {
                            stockapicheck('alt9')
                        }, 100);
                        tryPlace++
                    }
                }
            }
            else {
                order = response.data.shop_orders.find( f => f.items[0].itemid == cnbTarget.itemid).items[0]

                let item
                if(order && order.models.length) {
                    item = order.models.find( f => f.status == 1 && f.stock && f.price == convertedPrice)
                }
                else if(order && order.stock && order.modelid == cnbTarget.modelid) {
                    item = order
                }

                if(item) {
                    cnbTarget.modelid = item.modelid
                    if(typeof isSingleVariation != 'undefined') {
                        if(isSoldOut) {
                            // location.reload()
                            // TODO : after reload, handle page on load to select and checkout selected item
                        }
                    }

                    temp.isAlt5 = false
                    manualCheckout = false
                    $(`a[href*='-i.${cnbTarget.shopid}.${cnbTarget.itemid}?']:eq(0)`).parent().parent().prev().find("input").next().click()
                }
                else {
                    setTimeout(() => {
                        stockapicheck()
                    }, 300);
                }
            }
        })
}

function buypagecheck(checking){


    fetch(fetcherBUY.url, fetcherBUY.config)
    .then((response) => response.json())
    .then((response) => {
        console.log('BUY PAGE CHECK ---->', response)

        if(!response.error) {
            item = response.data.item.models.find( f => f.stock && f.price == convertedPrice)

            if(item) {
                cnbTarget.modelid = item.modelid
                $(`button.product-variation:contains(${item.name})`).click()
                setTimeout(() => {
                    $("button:contains(buy now)").click()
                }, 300);
            }
            else {
                setTimeout(() => {
                    buypagecheck()
                }, 600);
            }
        }
        else {
            console.log('BUY PAGE CHECK LIMIT EXCEEDED !!')
        }
    })


}

function checkbuyMD() {


        unsafeWindow.fetch('https://shopee.com.my/api/v4/cart/get', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "pre_selected_item_list": [],
                "updated_time_filter": {
                    "start_time": 0
                },
                "version": 11
            })
        })
        .then((response) => response.json())
        .then(async (response) => {

            const KOprices = response.data.shop_orders
                            .flatMap( order => {
                                order.items.forEach( f => { f.shop = order.shop.shopname})
                                return order.items
                            })
                            .map( item => {
                                return {
                                    item: item.name,
                                    shop: item.shop,
                                    masa: moment().format('DD/MM/YY hA'),
                                    variation: item.models
                                    .map( model => {
                                        return {
                                            name: model.name,
                                            stock: model.stock,
                                            harga: `RM ${((model.price / 100000).toFixed(2))}`,
                                            modelid: model.modelid,
                                            price: model.price,
                                        }
                                    })
                                }
                            })

            itemInStock = KOprices.find( v => v.shop == shopName).variation.find( f => f.harga == hargaSamsung && f.stock > 0)

            if(!itemInStock && samsungChkActive) {
                setTimeout(() => {
                    checkbuyMD()
                }, spamCheckInMS)
            }
            else {
                [color,storage]=itemInStock.name.split(',')

                GM_xmlhttpRequest ( {
                    method:     "GET",
                    url:        `http://${MACRODROID_IP}:8080/checkbuy?vars(color)=${color}&vars(storage)=${storage}`
                })
            }
        })


}

var placeorder = function (response) {
    console.log('Patched Response:', response);
    response.checkout_page_id = "main_opc_page";
    GM_setClipboard(JSON.stringify(response), 'text');
    // alert('Data copied!');

    let mstimerCondition = eventTime == '24:00' ? 86000000 : 0;
    msg('CHECKOUT DATA: -----> ', response);
    data = response;

    if(response.shoporders[0].items[0].insurances.find( f => f.name == 'Mobile Protection' && f.selected)) {
        $("span:contains(Mobile Protection)").parent().parent().prev().find('input').click()
    }


    if(cnbTarget.checkoutOOS2) {
        setTimeout(() => {
            cnbTarget.checkoutOOS2 = false
            localStorage.shopeelab_checknbuy = JSON.stringify(cnbTarget)
        }, 3000);
    }

    console.log('CURRENT PRICE:', data.shoporders[0].items[0].price, targetPrice.replace('.','') * 1000)

    if(!checkoutAttempt && ((startedURL.startsWith('https://shopee.com.my/cart') && !temp.isAlt5) || startedURL.includes('-i.')) && data.shoporders[0].items[0].price == targetPrice.replace('.','') * 1000) {

        $btnPlaceOrder = $("button.stardust-button--primary:contains(Place Order)")
        $btnPlaceOrder.css('background-color','#000')

        if(placeOrder) {
            $btnPlaceOrder.click()
        }
        else {
            alert('PlaceOrder clicked !')
        }

        checkoutAttempt = true;
    }

    else {
        if (response.can_checkout) {
            let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')
            if(!temp.isAlt5) {
                setTitle(' | RM' + (response.shoporders[0].items[0].price / 100000).toFixed(2), timer)
            }
            msg(timer + " miliseconds / " + moment.duration(timer).humanize() + " remaining. PRICE RM" + (response.shoporders[0].items[0].price / 100000).toFixed(2))

            if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
                msg(timer);

                setTimeout(() => {
                    browser_refresher();
                }, timer - 5000);


                if(timer > (lastRefresh * 1000)) {

                    setTimeout(() => {
                        if(refreshLastMinit) {
                            location.reload()
                        }
                    }, timer - (lastRefresh * 1000));
                }

                setTimeout(async () => {

                    if(temp.hasOwnProperty('checknplace')  && tryPlaceMode == 'apicheck') {
                        // alert('alt9')
                        stockapicheck('alt9')
                    }
                    else if(temp.checkoutOOSunknown || temp.buycheckoutOOS){
                        checkProduct = await (await unsafeWindow.fetch(`https://shopee.com.my/api/v4/pdp/get_pc?shop_id=${cnbTarget.shopid}&item_id=${cnbTarget.itemid}`, {
                                    "headers": {
                                    "accept": "application/json",
                                    "content-type": "application/json",
                                    "sz-token": JSON.parse(sessionStorage.shopee_webUnique_ccd),
                                    "af-ac-enc-dat": cnbTarget.fetcherBUY.headers["af-ac-enc-dat"],
                                    "af-ac-enc-sz-token": JSON.parse(sessionStorage.shopee_webUnique_ccd),
                                    "x-csrftoken": Cookies.get('csrftoken')
                                    },
                                    "body": null,
                                    "method": "GET"
                                })).json();

                        const buyItem = checkProduct.data.item.models.find( f => f.stock && f.price == convertedPrice && f.model_id == cnbTarget.modelid) ?? checkProduct.data.item.models.find( f => f.stock && f.price == convertedPrice);

                        // Method 1: fetch add to cart
                        //          --> fetch place order (normal place order to prevent "error_fulfillment_info_changed")

                        // Method 2: get modelID and fetch place Order (quickBuy OOS)
                        // method 3:
                        if(temp.checkoutOOSunknown || temp.buycheckoutOOS) {
                            alt9modelid = buyItem.model_id
                        }

                        if(temp.buycheckoutOOS) {

                            addToCart = await (await unsafeWindow.fetch(`https://shopee.com.my/api/v4/cart/add_to_cart`, {
                                            "headers": {
                                            "accept": "application/json",
                                            "content-type": "application/json",
                                            "sz-token": JSON.parse(sessionStorage.shopee_webUnique_ccd),
                                            "Af-Ac-Enc-Sz-Token": JSON.parse(sessionStorage.shopee_webUnique_ccd),
                                            "X-Csrftoken": Cookies.get('csrftoken')
                                            },
                                            "body": JSON.stringify({
                                                quantity: 1,
                                                checkout: true,
                                                update_checkout_only: false,
                                                donot_add_quantity: false,
                                                source: "{\"refer_urls\":[]}",
                                                add_on_deal_id: checkProduct.data.item.add_on_deal_info?.add_on_deal_id ?? null,
                                                client_source: 1,
                                                shopid: cnbTarget.shopid,
                                                itemid: buyItem.item_id,
                                                modelid: buyItem.model_id
                                            }),
                                            "method": "POST"
                                        })).text()

                            item_group_id = addToCart.substr(addToCart.indexOf('item_group_id'),50).split(':')[1].split(',')[0]
                            addToCart = JSON.parse(addToCart)

                            checkout =  await (await unsafeWindow.fetch(`https://shopee.com.my/api/v4/checkout/get`, {
                                            "headers": {
                                            "accept": "application/json",
                                            "content-type": "application/json",
                                            "sz-token": JSON.parse(sessionStorage.shopee_webUnique_ccd),
                                            "Af-Ac-Enc-Sz-Token": JSON.parse(sessionStorage.shopee_webUnique_ccd),
                                            "X-Csrftoken": Cookies.get('csrftoken')
                                            },
                                            "body": JSON.stringify({
                                                        "_cft": [1811668587,27],
                                                        "shoporders": [
                                                            {
                                                                "shop": {
                                                                    "shopid": cnbTarget.shopid
                                                                },
                                                                "items": [
                                                                    {
                                                                        "itemid": addToCart.data.cart_item.itemid,
                                                                        "modelid": addToCart.data.cart_item.modelid,
                                                                        "quantity": addToCart.data.cart_item.quantity,
                                                                        "add_on_deal_id": checkProduct.data.item.add_on_deal_info?.add_on_deal_id ?? null,
                                                                        "is_add_on_sub_item": false,
                                                                        "item_group_id": item_group_id,
                                                                        "insurances": []
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "selected_payment_channel_data": {},
                                                        "promotion_data": { "use_coins": false, "free_shipping_voucher_info": { "free_shipping_voucher_id": 0, "disabled_reason": "", "description": "", "disabled_reason_code": 0 }, "platform_vouchers": [], "shop_vouchers": [], "check_shop_voucher_entrances": false, "auto_apply_shop_voucher": false },
                                                        "device_info": { "device_id": "", "device_fingerprint": "", "tongdun_blackbox": "", "buyer_payment_info": {} },
                                                        "tax_info": {"tax_id": ""}
                                                    }),
                                            "method": "POST"
                                        })).json()
                            temp.checkoutData = checkout
                        }

                        $placeOrder = $(".stardust-button--primary")
                        if(placeOrder) {
                            $placeOrder.click()
                            console.time('Place order clicked --> request started')
                        }


                    }
                    else {
                            $placeOrder = $(".stardust-button--primary")

                            if(placeOrder) {
                                $placeOrder.click()
                                console.time('Place order clicked --> request started')

                                if(temp.hasOwnProperty('checknplace') && tryPlaceMode == 'clicktry') {
                                    var timerClickTryID = setInterval( () => {
                                        $placeOrder.click()
                                        if(tryPlace == 20) {
                                            clearInterval(timerClickTryID)
                                        }
                                    }, 75)
                                }
                            }
                            else {
                                $placeOrder.css('background-color','#000')
                            }
                            msg('Place Order button clicked on PRICE RM' + (response.shoporders[0].items[0].price / 100000).toFixed(2));
                    }
                }, timer);
            }
            else if(temp.isAlt5 && eval(eventTime == '24:00' ? 'timer > 86395000' : 'timer > -5000')) {
                $placeOrder = $(".stardust-button--primary")

                if(placeOrder) {
                    $placeOrder.click()
                }
                else {
                    $placeOrder.css('background-color','#000')
                }
                msg('Place Order button clicked on PRICE RM' + (response.shoporders[0].items[0].price / 100000).toFixed(2), timer);
            }
        }
    }
}


var solvecaptcha = function(data) {
    console.time('CAPTCHA RESPONSE FROM SERVER')

        try {

                // $h1captcha = $(`h1:contains(${['Captcha','Pengesahan','Verification','Verify','Continue'].find( f => $("h1:contains(" + f +")").length )})`)

                var observer = new MutationObserver(function(mutations) {
                    if ($("img[draggable='false']").length) {
                        $img = $("img[draggable='false']")
                        $button = $("img[draggable='false']").offset();
                        $slider = $("svg[height='47']")[0]

                        // fetch target elements
                        var elemDrag = $("svg[height='47']").parent()[0]
                        var elemDrop =  $("svg[height='47']").parent().parent()[0]

                        // calculate positions
                        var center1X = $button.left + 21
                        var center1Y = $button.top + 21

                        $("#vline").remove();

                        // mouse over dragged element and mousedown
                        // fireMouseEvent('mousemove', elemDrag, center1X, center1Y)
                        // fireMouseEvent('mouseenter', elemDrag, center1X, center1Y)
                        // fireMouseEvent('mouseover', elemDrag, center1X, center1Y)
                        fireMouseEvent('mousedown', elemDrag, center1X, center1Y)

                        // start dragging process over to drop target
                        // fireMouseEvent('dragstart', elemDrag, center1X, center1Y)
                        // fireMouseEvent('drag', elemDrag, center1X, center1Y)
                        // fireMouseEvent('mousemove', elemDrag, center1X, center1Y)

                        GM_xmlhttpRequest ( {
                            method:     "POST",
                            url:        `http://${INFER_SERVER}/spmypuzzle/5`,
                            params: {
                                api_key: API_KEY
                            },
                            data: $img[0].src,
                            headers:    {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload: function(response){
                                console.timeEnd('CAPTCHA RESPONSE FROM SERVER')
                                response = JSON.parse(response.responseText)

                                console.log('CAPTCHA SOLVER FROM ROBOFLOW',response);
                                $canvas = $img.offset();

                                var center2Y = $button.top + 21

                                if(response.predictions.length) {
                                    // calculate positions
                                    var center2X = response.predictions[0].x + $canvas.left

                                    if(!$("#vline").length) {
                                        $img.closest("aside").append(`<div id="vline" style="left:${center2X}px"></div>`)
                                    }
                                    else {
                                        $("#vline").css("left", center2X + "px")
                                    }

                                    // simulateMouseEvent($slider, "mousedown", $button.left + 21, $button.top + 21)
                                    setTimeout(() => {
                                        // simulateMouseEvent($slider, "mousemove", response.predictions[0].x + $canvas.left, $button.top + 21);

                                        // fireMouseEvent('drag', elemDrag, center2X, center2Y)
                                        // fireMouseEvent('mousemove', elemDrop, center2X, center2Y)

                                        // trigger dragging process on top of drop target
                                        // fireMouseEvent('mouseenter', elemDrop, center2X, center2Y)
                                        // fireMouseEvent('dragenter', elemDrop, center2X, center2Y)
                                        // fireMouseEvent('mouseover', elemDrop, center2X, center2Y)
                                        // fireMouseEvent('dragover', elemDrop, center2X, center2Y)

                                        $img.closest("aside").find("div:eq(1)").css("background-color","#ffff00ba")

                                        if(autoSolver) {
                                            // fireMouseEvent('drop', elemDrop, response.predictions[0].x + $canvas.left, center2Y)
                                            // fireMouseEvent('dragend', elemDrag, response.predictions[0].x + $canvas.left, center2Y)
                                            fireMouseEvent('mouseup', elemDrag, response.predictions[0].x + $canvas.left, center2Y)
                                            console.log('CAPTCHA at X-Cord --->', response.predictions[0].x + $canvas.left)
                                        }
                                        else {
                                            $(document).mousemove( e => {
                                                if(e.clientX > (response.predictions[0].x + $canvas.left - 2) && e.clientX < (response.predictions[0].x + $canvas.left + 2)) {

                                                    // release dragged element on top of drop target
                                                    if(!fakeCaptcha) {
                                                        // fireMouseEvent('drop', elemDrop, e.clientX, center2Y)
                                                        // fireMouseEvent('dragend', elemDrag, e.clientX, center2Y)
                                                        fireMouseEvent('mouseup', elemDrag, e.clientX, center2Y)
                                                        console.log('CAPTCHA at X-Cord --->',e.clientX, response.predictions[0].x + $canvas.left)
                                                        $(document).off()
                                                    }
                                                }
                                            })
                                        }

                                    }, 5);
                                }

                                else {
                                    fireMouseEvent('mouseup', elemDrag, 240 + $canvas.left, center2Y)
                                }
                            }
                        })
                        observer.disconnect()
                    }
                });
                var observerTarget = $("body")[0];
                var observerConfig = {
                    attributes: false,
                    childList: true,
                    characterData: false,
                    subtree: true
                };

                observer.observe(observerTarget, observerConfig)

        } catch (error) {
            console.log('solving captcha problem:', error);
            console.timeEnd('CAPTCHA RESPONSE FROM SERVER')
        }

}


var captchamousedown = function(data) {

    setTimeout(() => {

        try {
            $button = $("img[draggable='false']").offset();

            // fetch target elements
            var elemDrag = $("svg[height='47']").parent()[0]

            // calculate positions
            var center1X = $button.left + 21
            var center1Y = $button.top + 21


            // mouse over dragged element and mousedown
            fireMouseEvent('mousemove', elemDrag, center1X, center1Y)
            fireMouseEvent('mouseenter', elemDrag, center1X, center1Y)
            fireMouseEvent('mouseover', elemDrag, center1X, center1Y)
            fireMouseEvent('mousedown', elemDrag, center1X, center1Y)

            // start dragging process over to drop target
            fireMouseEvent('dragstart', elemDrag, center1X, center1Y)
            fireMouseEvent('drag', elemDrag, center1X, center1Y)
            fireMouseEvent('mousemove', elemDrag, center1X, center1Y)


        } catch(e) {
            console.log('captchamousedown problem:', error);
        }
    }, 170)
}

function setTitle(price, timer) {
    timerTitle = timer != undefined ? timer : (timerTitle - 1000);
    // timerDuration = moment.duration(timerTitle)
    timerDuration = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment()))
    document.title = `${timerDuration.hours().toString().padStart(2, '0')}:${timerDuration.minutes().toString().padStart(2, '0')}:${timerDuration.seconds().toString().padStart(2, '0')} ${price}`

    if(timerTitle > 0) {
        setTimeout(() => {
            setTitle(price)
        }, 1000);
    }
}

var browser_refresher = function() {
    console.log('--------- Refresh Browser Connection ----------')
    isBrowserRefresher = true;
    $(".stardust-button--primary").click()
    console.time('Place order clicked --> request started')

    $('body').css('cursor','wait')
    console.time('CAPTCHA RESPONSE FROM SERVER')
    GM_xmlhttpRequest ( {
        method:     "POST",
        url:        `http://${INFER_SERVER}/spmypuzzle/5`,
        params: {
            api_key: API_KEY
        },
        data: 'data:image/jpeg;base64,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',
        headers:    {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response){
            response = JSON.parse(response.responseText)
            console.log('PRELOAD ROBOFLOW CAPTCHA SOLVER ---->', response);
            $('body').css('cursor','default')
            console.timeEnd('CAPTCHA RESPONSE FROM SERVER')
        }
    })
}

var fireMouseEvent = function(type, elem, centerX, centerY) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent(
      type,
      true,
      true,
      unsafeWindow,
      0,
      centerX,
      centerY + 103,
      centerX,
      centerY,
      false,
      false,
      false,
      false,
      0,
      elem
    )
    elem.dispatchEvent(evt)
}

hotkeys('alt+1,alt+2,alt+3,alt+4,alt+5,alt+6,alt+7,alt+8,alt+9,alt+0,alt+c,alt+v,alt+b,alt+[,alt+],alt+\\,alt+\',alt+/,alt+.,alt+\,,alt+f5,alt+f6,alt+x,ctrl+alt+6,alt+shift+6', function (event, handler){
    switch (handler.key) {
        // Select Voucher (Shopee/Platform)
      case 'alt+1':
            $("button:contains(change)").length > 2 ? $("button:contains(change):last").click() : $("button:contains(Select Voucher):last").click()
        break;
        // Click Checkout @ Cart Page
      case 'alt+2':
            temp.isAlt5 = false
            manualCheckout = true
            $("button span:contains(check out)").click()
        break;
      // Click Place Order @ Checkout Page
      case 'alt+3':
            $("button:contains(Place Order)").click()
            console.time('Place order clicked --> request started')
        break;;
      // Check and Checkout
      case 'alt+4':
            $(".stardust-checkbox__box:eq(2)").click()
            setTimeout(() => {
                $("button span:contains(check out)").click()
            }, 300);
        break;
      // Check Targeted Empty Stock @ Cart Page click Checkout (if there any stock) to standby @ Checkout Page
      case 'alt+5':
            temp.isAlt5 = true
            if (!temp.alt5done && !temp.isAlt5Cooldown) {

                $('body').css('cursor','wait')
                stockapicheck('alt5')
            }

            temp.isAlt5Cooldown = true
            setTimeout(() => {
                temp.isAlt5Cooldown = false
            }, 300);
        break;

        // Marking Cart Price Monitor at event time
        case 'alt+6':
            temp.alt6 = true
        break;

        // Print KO Price output at console
        case 'ctrl+alt+6':

            const priceCondition = prompt('Enter the price condition:')?.split(',').map(Number) || null;

            console.log(priceCondition);

            const objKOPrices = JSON.parse(localStorage.KOprices);
            const txtPrices = `[${objKOPrices[0].masa}]\nSTOCK\t\tPRICE\t\t\tVarian Name\n\n` + objKOPrices.map( m => `${m.shop}\n${m.item}\n`+m.variation.filter( x => !priceCondition ? true : priceCondition.includes(x.price/100000)).map( x => ` ➜ ${x.stock.toString().padEnd(4, " ")}\t${x.harga.padEnd(10, " ")}\t\t${x.name}` ).join('\n')).join('\n\n\n');
            console.log(txtPrices);

        break;

        case 'alt+shift+6':
            temp.altshift6 = true
        break;


        // Load Captcha for Local Image host
        case 'alt+7':
            GM_xmlhttpRequest ( {
                            method:     "POST",
                            url:        "http://localhost:3000/detect",
                            data:       JSON.stringify({img:'data:image/jpeg;base64,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'}),
                            headers:    {
                                "Content-Type": "application/json"
                            },
                            onload: function(resp){
                                console.log('PRELOAD LOCAL ML',resp)
                            }
            })
        break;

        // Preload Captcha check to established for recognized connection
        case 'alt+8':
            browser_refresher();
        break;

        // Press once at Checkout page to verify available stock before Placing
        // requirement : Pre select model item at product page
        // At tick : spam (cart page request) to check stock is available and immediately hit place order button
        case 'alt+9':
            temp.checknplace = true
            $(".navbar-wrapper").css("background-color","#ffeb3b")
        break;

        // Press once at Checkout page to aim targeted variation of product
        // where the variation of product offered is not available during countdown
        // TLDR : checkout non related variation of same product item, but placing order on targeted variation of product setted on product page
        case 'alt+0':
            alt9modelid = cnbTarget.modelid
            $(".navbar-wrapper").css("background-color","#ff3bbc")
        break;

        // SET CLIPBOARD for Data Caches (checkout)
        case 'alt+c':
                GM_setClipboard(localStorage.shopeelab_checknbuy, 'text')

                alert('Data copied!');
        break;

        // BUYING OOS Item
        case 'alt+b':
            oosbuy = true

            function buyingoos() {
                setTimeout(() => {
                    $("button:contains(buy now)").click()

                    if(oosbuy) {
                        buyingoos()
                    }
                }, 10000);
            }
            buyingoos()
        break;

        // SET Data Caches
        case 'alt+v':
            $('body').css('cursor','wait')
            let results = []

            try {
                if(scanDeals.models.length) {
                    (async () => {
                        scanDeals.models.push(scanDeals.models.splice(scanDeals.models.findIndex( f => f == scanDeals.modelid),1)[0])
                        let old_modelid = scanDeals.modelid

                        for (const f of scanDeals.models) {
                            data = await (await fetch("https://shopee.com.my/api/v4/cart/update", {
                                            "headers": {
                                            "accept": "application/json",
                                            "content-type": "application/json"
                                            },
                                            "body": JSON.stringify({
                                            "action_type": 3,
                                            "updated_shop_order_ids": [
                                                    {
                                                        "shopid": scanDeals.shopid,
                                                        "item_briefs": [
                                                            {
                                                                "shopid": scanDeals.shopid,
                                                                "itemid": scanDeals.itemid,
                                                                "item_group_id": scanDeals.item_group_id,
                                                                "add_on_deal_id": scanDeals.add_on_deal_id,
                                                                "applied_promotion_id": scanDeals.applied_promotion_id,
                                                                "modelid": f,
                                                                "quantity": 1,
                                                                "old_modelid": old_modelid,
                                                                "old_quantity": 1,
                                                                "checkout": false
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "version": 459
                                            }),
                                            "method": "POST"
                                        })).json()

                            old_modelid = f
                            data = data.data.shoporders[0].updated_items[0]
                            results.push(data.model_name.padEnd(40) + ('RM' + (data.price / 100000).toFixed(2)).padEnd(14) + (data.deep_discount_campaign_text_pc ? `${data.deep_discount_campaign_text_pc.replace('on {{promotion_start_time}}','')} [${moment.unix(data.deep_discount_campaign_start_time).format('DD/MM/YY hh:mma')}]` : ''))

                        }

                        $('body').css('cursor','default')
                        console.log('Product Name : ' +  scanDeals.name + ('\nMODEL NAME').padEnd(40) + ('HARGA ASAL').padEnd(14) + 'HARGA PROMO\n\n'  + results.join('\n'))
                    })()

                }

                else {
                    console.log(scanDeals)
                    alert(scanDeals.name + (scanDeals.deep_discount_campaign_text_pc.padEnd(40) ? `${scanDeals.deep_discount_campaign_text_pc.replace('on {{promotion_start_time}}','')} [${moment.unix(scanDeals.deep_discount_campaign_start_time).format('DD/MM/YY hh:mma')}]` : ''))
                }
            } catch (error) {
                $('body').css('cursor','default')
                console.error('Scan Deals error: ', error)
            }
        break;

        // CHECKOUT OOS Item  -- direct place order specific modelID (for known variation) without add to cart
        case 'alt+[':
            temp.checkoutOOS = true
            $(".navbar-wrapper").css("background-color","#8bc34a")
        break;

        // CHECKOUT OOS Item (unknown variation)  -- check product page for matching stock and targetedPrice to get modelID and place order
        case 'alt+]':
            temp.checkoutOOSunknown = true
            $(".navbar-wrapper").css("background-color","#794ac3")
        break;

        // BUY & CHECKOUT OOS Item (unknown variation) -- check product page for matching stock and targetedPrice --> add to cart --> get info from checkout page and place order
        case 'alt+\\':
            temp.buycheckoutOOS = true
            $(".navbar-wrapper").css("background-color","#6b6208")
        break;

        case 'alt+\'':
            cnbTarget.checkoutOOS2 = true
            localStorage.shopeelab_checknbuy = JSON.stringify(cnbTarget)
            location.reload()
        break;

        case 'alt+/':
            sessionStorage.setItem('targetPrice', targetPrice2)
            location.reload()
        break;

        case 'alt+.':
            sessionStorage.setItem('targetPrice', targetPrice3)
            location.reload()
        break;

        case 'alt+,':
            sessionStorage.setItem('targetPrice', targetPrice4)
            location.reload()
        break;

        case 'alt+f5':
            refreshLastMinit = false;
        break;

        case 'alt+f6':
            sessionStorage.setItem('loadOOSmodel', targetPrice4)
            location.reload()
        break;

        case 'alt+x':
            GM_xmlhttpRequest ( {
                method:     "GET",
                url:        `http://${MACRODROID_IP}:8080/claimed`
            })
        break;

    }
  });


  // TODO: completing checkoutOOSunknown at 90% (issue with fetch using script forbidden, but from console is allowed)
  // TODO: checkout mobile voucher (analyst checkout data --> try different mobile voucher using script --> put hotkey to prompt asking voucher code  on checkout)


  // https://help.shopee.com.my/portal/webform/b7a7ff2afd484f1dbddb3a922c7e90e7?entryPoint=1&lastArticleID=78468?entryPoint=1&lastArticleID=


  // REQUEST modifier dah tak boleh manipulate.. hanya boleh manipulate RESPONSE sahaja ! (REVAMP QUICKBUY!)