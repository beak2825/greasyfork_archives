// ==UserScript==
// @name         Bitrix API Костыль
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  -
// @author       Bekker
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550673/Bitrix%20API%20%D0%9A%D0%BE%D1%81%D1%82%D1%8B%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/550673/Bitrix%20API%20%D0%9A%D0%BE%D1%81%D1%82%D1%8B%D0%BB%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Base URL of your API
    const API_BASE_URL = 'http://localhost:7890';

    /**
     * Main function to interact with Bitrix API
     * @param {string} endpoint - API endpoint ('find-deal' or 'bitrix-call')
     * @param {Object} params - Parameters for the API call
     * @returns {Promise<Object>} API response
     */
    async function bitrixApi(endpoint, params) {
        try {
            const response = await fetch(`${API_BASE_URL}/bitrix-api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(params),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[BitrixAPI] Error:', error);
            throw error;
        }
    }

    function getOrderNumber() {
        const regex = /\/(\d{8})(?:\/|\?|$)/;
        const match = window.location.href.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Helper function to find a deal by order number
     * @param {string} orderNumber - Order number to search for
     * @param {boolean} [force=false] - Force refresh of cache
     * @returns {Promise<Object>} Deal information
     */
    async function findDeal(orderNumber, force = false) {
        const deal = await bitrixApi('find-deal', { orderNumber, force })
        const data = {
            'ID Битрикс': deal.ID,
            'Название': deal.TITLE,
            'ID Олеся': deal.UF_CRM_1694612268222,
            'ID Картошка': deal.UF_CRM_1694612083961,
            'Вид заказа': deal.UF_CRM_1694611977812,
            'ГПТшник' : deal.UF_CRM_1694612041234,
            'Последняя проверка': new Date().toISOString()
        };
        return data;
    }

    const OrderNumber1 = getOrderNumber()
    var dealdata;

    /**
     * Helper function to make generic Bitrix API calls
     * @param {string} method - Bitrix API method
     * @param {Object} params - Parameters for the Bitrix API call
     * @returns {Promise<Object>} API response
     */
    async function OpenBitrix() {
        dealdata = await findDeal(OrderNumber1)
        window.open('https://bx.cloudguru.us/crm/deal/details/' + String(dealdata['ID Битрикс']) + '/','_blank')
    }

    async function bitrixCall(method, params) {
        return await bitrixApi('bitrix-call', { method, params });
    }

    async function openOlyeca() {
        dealdata = await findDeal(OrderNumber1)
        window.open('https://avtor24.ru/order/getoneorder/' + String(dealdata['ID Олеся']),'_blank')
    }

    async function openKartoshka() {
        dealdata = await findDeal(OrderNumber1)
        window.open('https://a24.biz/order/' + String(dealdata['ID Картошка']),'_blank')
    }

    /**
     * Helper function to fetch comments for a deal
     * @param {string} dealId - ID of the deal
     * @returns {Promise<Object>} Comments and users information
     */
    async function getDealComments(dealId) {
        return await bitrixCall('crm.timeline.comment.list', {
            filter: { ENTITY_TYPE: 'deal', ENTITY_ID: dealId },
            select: ['ID', 'COMMENT', 'CREATED', 'AUTHOR_ID', 'FILES']
        }).then(async commentsResponse => {
            const commentsArray = commentsResponse?.answer?.result || [];
            if (!Array.isArray(commentsArray)) {
                return { comments: [], users: [] };
            }

            const authorIds = [...new Set(commentsArray.map(comment => comment.AUTHOR_ID))];
            const usersResponse = await bitrixCall('user.get', { ID: authorIds });

            return {
                comments: commentsArray.map(comment => ({
                    id: comment.ID,
                    comment: comment.COMMENT,
                    created: comment.CREATED,
                    authorId: comment.AUTHOR_ID,
                    files: comment.FILES
                })),
                users: (usersResponse?.answer?.result || []).map(user => ({
                    id: user.ID,
                    name: user.NAME,
                    lastName: user.LAST_NAME,
                    personalPhoto: user.PERSONAL_PHOTO
                }))
            };
        });
    }

    // Expose functions to window object
    window.bitrixApi = {
        findDeal,
        bitrixCall,
        getDealComments,
        OpenBitrix,
        openOlyeca,
        openKartoshka
    };

    console.log('[BitrixAPI] Helper functions loaded in window.bitrixApi');
})();