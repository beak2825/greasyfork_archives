// ==UserScript==
// @name         破解飞书的文本复制2 | 右键复制图片2 | 去除飞书水印3
// @namespace    https://intumu.com
// @version      0.3
// @description  综合两个脚本，破解飞书的复制和右键限制，让你的飞书更好用
// @author       mosby-zhou update from Tom-yang
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @match        *://*.bytedance.net/*
// @match        *://*.larksuite.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561459/%E7%A0%B4%E8%A7%A3%E9%A3%9E%E4%B9%A6%E7%9A%84%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B62%20%7C%20%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%872%20%7C%20%E5%8E%BB%E9%99%A4%E9%A3%9E%E4%B9%A6%E6%B0%B4%E5%8D%B03.user.js
// @updateURL https://update.greasyfork.org/scripts/561459/%E7%A0%B4%E8%A7%A3%E9%A3%9E%E4%B9%A6%E7%9A%84%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B62%20%7C%20%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%872%20%7C%20%E5%8E%BB%E9%99%A4%E9%A3%9E%E4%B9%A6%E6%B0%B4%E5%8D%B03.meta.js
// ==/UserScript==
console.dir('改进飞书体验已启动2, dir');
console.log('改进飞书体验已启动2, log');
console.dir('改进飞书体验已启动2, dir - 无 log');
console.dir(window.__HEADER_VARS__);
console.dir(window.store?.getState()?.entities.permissions.toJS());
console.dir('改进飞书体验已启动2, __HEADER_VARS__ dir ↑');
(function documentLoadendEvent () {
    console.dir('改进飞书体验已启动');

    Reflect.defineProperty(window, '__HEADER_VARS__', {
        get() {
            console.dir('get pre__HEADER_VARS__ ↓');
            console.dir(window.pre__HEADER_VARS__);
            console.dir('get pre__HEADER_VARS__ ↑');
            return window.pre__HEADER_VARS__;
        },
        set(value) {
            console.dir('set pre__HEADER_VARS__ ↓');
            console.dir(window.pre__HEADER_VARS__);
            console.dir('set pre__HEADER_VARS__ to value');
            console.dir(value);
            console.dir(JSON.stringify(value));
            console.dir(value?.authPerm?.Actions);
            if(value?.authPerm?.Actions?.copy && value.authPerm.Actions.copy !== 1){
                value.authPerm.Actions.copy = 1;
            }
            console.dir('set pre__HEADER_VARS__ ↑');
            window.pre__HEADER_VARS__ = value;
        },
    });


    /**
   * 批量配置 XMLHttpRequest 拦截与响应修改
   * @param {Array} configs - 配置列表
   * 每个配置项格式如下：
   * {
   *   match: string | RegExp,   // URL 匹配规则
   *   method?: string,          // 限定请求方法（可选）
   *   handler: function(response, xhr): any  // 响应修改逻辑，返回新 response
   * }
   */
    function setupXHRInterceptors(configs = []) {
        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (...args) {
            const [method, url] = args;

            // 找到匹配的配置项
            const matchedConfig = configs.find((cfg) => {
                const methodMatch = !cfg.method || cfg.method.toUpperCase() === method.toUpperCase();
                const urlMatch = typeof cfg.match === 'string' ? url.includes(cfg.match) : cfg.match.test(url);
                return methodMatch && urlMatch;
            });

            if (!matchedConfig) {
                // 未匹配，走原逻辑
                return originalOpen.apply(this, args);
            }

            this.addEventListener(
                'readystatechange',
                function () {
                    if (this.readyState !== 4) return;

                    let response = this.response;
                    try {
                        response = JSON.parse(response);
                    } catch (e) {}

                    try {
                        console.log('XHR interceptor matched:', matchedConfig, response);
                        const newResponse = matchedConfig.handler(response, this);
                        if (newResponse) {
                            Object.defineProperty(this, 'response', {
                                get() {
                                    return newResponse;
                                },
                            });
                            Object.defineProperty(this, 'responseText', {
                                get() {
                                    return JSON.stringify(newResponse);
                                },
                            });
                        }
                    } catch (err) {
                        console.error('XHR interceptor error:', err);
                    }
                },
                false,
            );

            return originalOpen.apply(this, args);
        };
    }

    setupXHRInterceptors([
        {
            match: 'space/api/suite/permission/document/actions/state/',
            method: 'POST',
            handler: (response, xhr) => {
                if (response.data.actions.copy === 1) {
                    response.data.actions.debug_copy = 1;
                    return response;
                }
                response.data.actions.copy = 1;
                response.data.actions.duplicate = 1;
                response.data.actions.export = 1;
                response.data.actions.is_single_page_editor = 1;
                response.data.actions.is_single_page_full_access = 1;
                response.data.is_owner = true;
                return response;
            },
        },
        {
            match: 'api_v2/app/v2/permission/get_user_permission/kani',
            method: 'POST',
            handler: (response, xhr) => {
                response.data = {
                    app_id: '1434',
                    permission: {
                        abnormal: 'write',
                        abtest: 'write',
                        admin: 'nil',
                        base: 'write',
                        behaviortracking: 'read',
                        dashboard: 'write',
                        event: 'write',
                        expire_time: '',
                        heat_map: 'read',
                        image: 'read',
                        issue_auto: 'read',
                        issue_my: 'write',
                        issue_statistics: 'read',
                        issue_status: 'write',
                        issue_status_manager: 'read',
                        mapping: 'write',
                        network: 'write',
                        performance: 'write',
                        plugin: 'read',
                        setting_admin: 'nil',
                        single_point: 'read',
                        super_admin: 'nil',
                        table: 'write',
                        trace: 'read',
                        upload_config: 'read',
                    },
                };
                return response;
            },
        },
    ]);
})();

function watermarkRemove() {

    // 修改右键限制
    const bodyAddEventListener = document.body.addEventListener;
    document.body.addEventListener = function (type, listener, options) {
        bodyAddEventListener.call(
            document.body,
            type,
            (event) => {
                if (type === 'contextmenu') {
                    return true;
                }
                return listener(event);
            },
            options,
        );
    };

    // 获取所有图片元素
    const images = document.querySelectorAll('img');
    // 遍历每个图片元素
    images.forEach((image) => {
        // 监听点击事件
        image.addEventListener('click', () => {
            // 复制图片本身而不是URL
            const img = document.createElement('img');
            img.src = image.src;
            img.style.display = 'none';
            document.body.appendChild(img);
            // 使用Clipboard API复制图片
            navigator.clipboard
                .writeImage(img)
                .then(() => {
                console.log('Image copied to clipboard:', img.src);
                img.remove();
            })
                .catch((err) => {
                console.error('Failed to copy image:', err);
                img.remove();
            });
        });
    });
    // 添加样式
    if (typeof GM_addStyle === 'undefined') {
        this.GM_addStyle = (aCss) => {
            'use strict';
            const head = document.getElementsByTagName('head')[0];
            if (head) {
                const style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.textContent = aCss;
                head.appendChild(style);
                return style;
            }
            return null;
        };
    }
    const bgImageNone = '{background-image: none !important;}';
    function genStyle(selector) {
        return `${selector}${bgImageNone}`;
    }
    GM_addStyle(genStyle('[class*="watermark"]'));
    GM_addStyle(genStyle('[style*="pointer-events: none"]'));
    GM_addStyle(genStyle('.ssrWaterMark'));
    GM_addStyle(genStyle('body>div>div>div>div[style*="position: fixed"]:not(:has(*))'));
    GM_addStyle(genStyle('[class*="TIAWBFTROSIDWYKTTIAW"]'));
    GM_addStyle(genStyle('body>div[style*="position: fixed"]:not(:has(*))'));
    GM_addStyle(genStyle('#watermark-cache-container'));
    GM_addStyle(genStyle('body>div[style*="inset: 0px;"]:not(:has(*))'));
    GM_addStyle(genStyle('.chatMessages>div[style*="inset: 0px;"]'));
}

document.addEventListener('DOMContentLoaded', function() {
    // DOM加载完成后执行的逻辑
    console.log('✅ DOM结构已完全就绪！');
    console.dir('✅ DOM结构已完全就绪！, dir');
    watermarkRemove();
});
