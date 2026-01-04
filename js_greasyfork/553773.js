// ==UserScript==
// @name         Upsilon Library - test
// @namespace    https://upsilon-cloud.uk
// @version      2.9
// @description  Upsilon Library
// @author       Upsilon
// @license      All Rights Reserved
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==
// Library - a script intended to be @require-d from other scripts and not installed directly.

// Copyright (c) 2025 Upsilon
// All rights reserved. No part of this code may be reproduced, modified, or distributed without explicit permission.

(function() {
    'use strict';
    if (window.Ups?.showToast) return;

    window.Ups = window.Ups || {};

    // Detect if running in TornPDA environment
    const isPda = window.GM_info?.scriptHandler?.toLowerCase().includes('tornpda');

    window.Ups.showToast = (message, type = 'info', duration = 5000) => {
        const createToast = () => {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.position = 'fixed';
                container.style.bottom = '5%';
                container.style.right = '5%';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '10px';
                container.style.zIndex = 100000;
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.background = type === 'error' ? '#c0392b' : '#2c3e50';
            toast.style.color = 'white';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '5px';
            toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            toast.style.fontFamily = 'monospace';
            toast.style.whiteSpace = 'pre-wrap';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.addEventListener('transitionend', () => toast.remove());
            }, duration);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToast);
        } else {
            createToast();
        }
    };

    window.Ups.callAPI = function(url, method, requestObject, callback) {
        const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase());
        const useFetch = isPda || typeof GM_xmlhttpRequest !== 'function';

        if (useFetch) {
            // Use native fetch API for TornPDA or when GM_xmlhttpRequest is not available
            const fetchOptions = {
                method: method,
                headers: { 'Content-Type': 'application/json' }
            };

            if (isBodyMethod) {
                fetchOptions.body = typeof requestObject === 'string'
                    ? requestObject
                    : JSON.stringify(requestObject);
            }

            fetch(url, fetchOptions)
                .then(response => {
                    return response.json().then(data => ({ status: response.status, data }));
                })
                .then(({ status, data }) => {
                    if (status >= 400) {
                        // Extract error message from backend response
                        let errorMessage = 'Unknown error';
                        if (data.error) {
                            errorMessage = data.error;
                        } else if (data.Error) {
                            errorMessage = data.Error;
                        }

                        const error = new Error(errorMessage);
                        error.status = status;
                        error.data = data;

                        console.error(`[UpsLib] API Error (${status}):`, errorMessage);
                        callback && callback(error, null);
                        return;
                    }

                    callback && callback(null, data);
                })
                .catch(err => {
                    console.error("[UpsLib] Error while calling API:", err);
                    callback && callback(err, null);
                });
        } else {
            // Use GM_xmlhttpRequest for Tampermonkey/Greasemonkey
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: isBodyMethod
                    ? (typeof requestObject === 'string' ? requestObject : JSON.stringify(requestObject))
                    : undefined,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        // Check HTTP status code
                        if (response.status >= 400) {
                            // Extract error message from backend response
                            let errorMessage = 'Unknown error';
                            if (data.error) {
                                errorMessage = data.error;
                            } else if (data.Error) {
                                errorMessage = data.Error;
                            }

                            const error = new Error(errorMessage);
                            error.status = response.status;
                            error.data = data;

                            console.error(`[UpsLib] API Error (${response.status}):`, errorMessage);
                            callback && callback(error, null);
                            return;
                        }

                        callback && callback(null, data);
                    } catch (e) {
                        console.error("[UpsLib] Error processing JSON:", e);
                        callback && callback(e, null);
                    }
                },
                onerror: function (err) {
                    console.error("[UpsLib] Error while calling API:", err);
                    callback && callback(err, null);
                }
            });
        }
    };
})();