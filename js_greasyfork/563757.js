// ==UserScript==
// @name         抖音视频直链
// @description  获取抖音视频的直链并跳转
// @namespace    https://cn.com.net/
// @version      1.0
// @author       Gemini
// @match        https://www.iesdouyin.com/share/video*
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563757/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/563757/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.stop();

    const config = {
        api_url: 'https://apis.jxcxin.cn/api/douyin?url=',
        play_base_url: 'https://www.douyin.com/aweme/v1/play/?line=0&ratio=720p&video_id='
    };

    const core = {
        set_no_referrer_policy() {
            let meta = document.querySelector('meta[name="referrer"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'referrer';
                document.head.append(meta);
            }
            meta.content = 'no-referrer';
        },
        format_title(title) {
            return title ? String(title).trim().replace(/#/g, '•') : '';
        },
        update_title(text) {
            document.title = text;
        }
    };

    const douyin = {
        request(url) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "json",
                    timeout: 5000,
                    onload: (res) => resolve(res),
                    onerror: () => reject(new Error('连接失败')),
                    ontimeout: () => reject(new Error('连接超时'))
                });
            });
        },

        async run() {
            core.update_title('获取中...');
            const target_url = config.api_url + encodeURIComponent(window.location.href);

            try {
                const response = await this.request(target_url);
                if (response.status !== 200) throw new Error('获取失败');

                const res_data = response.response && response.response.data;
                const short_url = res_data && res_data.url;
                const v_title = res_data && res_data.title;

                if (short_url && short_url.startsWith('https://')) {
                    let v_id;
                    try {
                        v_id = new URL(short_url).searchParams.get('video_id');
                    } catch (e) {
                        v_id = null;
                    }

                    if (v_id) {
                        const final_url = `${config.play_base_url}${v_id}`;
                        GM.setClipboard(core.format_title(v_title) + '\n' + final_url);
                        core.set_no_referrer_policy();
                        window.location.replace(final_url);
                        return;
                    }
                }
                throw new Error('获取失败');
            } catch (err) {
                core.update_title(err.message);
            }
        }
    };

    douyin.run();
})();