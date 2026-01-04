// ==UserScript==
// @name         Fuck-Yudao 1.0
// @namespace    none
// @version      1.0
// @license      MIT
// @description  屏蔽芋道官方文档登录校验
// @author       The love you care
// @match        https://www.iocoder.cn/*
// @match        https://doc.iocoder.cn/*
// @match        https://cloud.iocoder.cn/*
// @grant        unsafeWindow
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/556932/Fuck-Yudao%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/556932/Fuck-Yudao%2010.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';

    unsafeWindow.jqueryAlert = function(opts) {
        return {
            show: function() {},
            close: function() {}
        };
    };

    unsafeWindow.Cookies = unsafeWindow.Cookies || {};
    const originalGet = unsafeWindow.Cookies.get;
    unsafeWindow.Cookies.get = function(key) {
        if (key === 'zsxq_auth') {
            return 'fake_vip_token';
        }
        return originalGet ? originalGet.apply(this, arguments) : null;
    };

    if (unsafeWindow.$) {
        const originalGet = unsafeWindow.$.get;
        unsafeWindow.$.get = function(url, data, success, dataType) {
            if (url && typeof url === 'string' && (url.includes('/zsxq/auth') || url.includes('/zsxq/auth-callback'))) {
                if (success && typeof success === 'function') {
                    setTimeout(() => success(true), 0);
                }
                return { abort: function() {} };
            }
            return originalGet.apply(this, arguments);
        };
    }

    let yudaosPoorlyWrittenDoc = null, prevPath = document.location.pathname;

    const blockPathList = ["/bpm/", "/user-center/", "/social-user/", "/oauth2/", "/saas-tenant/", "/sms/", "/mail/", "/notify/", "/mybatis-pro/", "/dynamic-datasource/", "/report/", "/Spring-Boot", "/Spring-Cloud", "/api-doc/", "/module-new/", "/new-feature/", "/dev-hot-swap/", "/file/", "/message-queue/", "/job/", "/idempotent/", "/distributed-lock/", "/rate-limiter/", "/http-sign/", "/api-encrypt/", "/project-rename/", "/delete-code/", "/resource-permission/", "/data-permission/", "/deployment-linux/", "/deployment-docker/", "/deployment-baota", "/deployment-tomcat/", "/registry-center/", "/config-center/", "/rpc/", "/gateway/", "/distributed-transaction/", "/server-protection/", "/cloud-debug/", "/mp/", "/mall/", "/pay/", "/crm/", "/member/", "/erp/", "/ai/", "/iot/", "/websocket/", "/vo/", "/system-log/"];

    const isBlocked = () => {
        const ret = blockPathList.some((e) => document.location.pathname.includes(e));
        return ret;
    }

    const getWrapper = () => {
        let wrapper2 = document.querySelector('.content-wrapper');
        console.log(wrapper2)

        return wrapper2;
    }

    const replace = (str) => {
        const wrapper = getWrapper();
        if (str && wrapper) {
            wrapper.innerHTML = str;
        }
    };

    const contentObserver = new MutationObserver((mutations) => {
        const wrapper = getWrapper();
        if (wrapper && wrapper.innerHTML.includes('仅 VIP 可见')) {
            replace(yudaosPoorlyWrittenDoc);
        }
    });

    const wrapper = getWrapper();
    if (wrapper) {
        yudaosPoorlyWrittenDoc = wrapper.innerHTML;

        setInterval(() => {
            if (wrapper.innerHTML.includes('仅 VIP 可见')) {
                replace(yudaosPoorlyWrittenDoc);
            }
        }, 50); 
    }

    const urlObserver = new MutationObserver(() => {
        const wrapperEl = getWrapper()
        /*
        if (document.location.href !== 'https://doc.iocoder.cn/' && isBlocked() && !window.location.href.includes('refreshed')) {
            window.location.href = window.location.href + '?refreshed=1'
            // window.location.reload();
        }
        */
        if (prevPath !== document.location.pathname) {
            window.location.reload()
        }
    })

    urlObserver.observe(document.body, { childList: true })

    //=============================================================================================================================================

    const $$wrapper = getWrapper();
    if (getWrapper() && isBlocked()) {
        yudaosPoorlyWrittenDoc = $$wrapper.innerHTML.includes('仅 VIP 可见') ? null : $$wrapper.innerHTML;
        unsafeWindow.$$content = yudaosPoorlyWrittenDoc;
        unsafeWindow.$$replace = function() {
            replace(unsafeWindow.$$content)
        }
        contentObserver.observe($$wrapper, { childList: true, characterData: true, subtree: true });
        replace(yudaosPoorlyWrittenDoc);
    }

    //=============================================================================================================================================

})();
