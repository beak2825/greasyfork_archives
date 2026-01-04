// ==UserScript==
// @name        推特 - 翻译机
// @namespace   Violentmonkey Scripts
// @match       *://x.com/*
// @version     1.0
// @author      -
// @description 2025/9/6 13:12:58
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/548548/%E6%8E%A8%E7%89%B9%20-%20%E7%BF%BB%E8%AF%91%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/548548/%E6%8E%A8%E7%89%B9%20-%20%E7%BF%BB%E8%AF%91%E6%9C%BA.meta.js
// ==/UserScript==
const max_concurrent = 2; // 并发限制
const queue = [];
let cur = 0;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function translation(raw) {
    return new Promise((resolve) => {
        const task = async () => {
            cur++;

            let attempts = 0;
            let result;

            while (attempts < 3) {  // 最多重试三次
                attempts++;
                try {
                    result = await big_model(raw);
                    if (!result.error) {
                        break;  // 成功，跳出重试
                    }
                } catch (e) {
                    // 出现异常也算一次重试
                }

                if (attempts < 3) {
                    await sleep(1000); // 失败后延迟1秒再重试
                }
            }

            resolve(result);
            cur--;

            if (queue.length && cur < max_concurrent) {
                const next = queue.shift();
                next();
            }
        };

        if (cur < max_concurrent) {
            task();
        } else {
            queue.push(task);
        }
    });
}
function big_model(raw) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + window.big_token
            },
            data: JSON.stringify({
                "model": "GLM-4.5-Flash",
                "temperature": 0,
                "messages": [
                    { "role": "system", "content": "翻译为中文,不要解释或包含其他内容" },
                    { "role": "user", "content": raw }
                ],
                "thinking": { "type": "disabled" }
            }),
            timeout: 10000,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.choices?.[0]?.message) {
                        resolve({ "error": false, "msg": data.choices[0].message.content, raw });
                    } else {
                        resolve({ "error": true, "msg": data, raw });
                    }
                } catch (e) {
                    resolve({ "error": true, "msg": e, raw });
                }
            },
            onerror: function (err) {
                resolve({ "error": true, "msg": err, raw });
            },
            ontimeout: function () {
                resolve({ "error": true, "msg": "timeout", raw });
            }
        });
    });
}
function observe() {
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                if (node.matches?.('div[dir="auto"][lang]')) {
                    handle(node);
                }
                const descendants = node.querySelectorAll?.('div[dir="auto"][lang]');
                if (descendants?.length) {
                    descendants.forEach(handle);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
function handle(e) {
    if ("raw" in e) return;
    const text = raw(e);
    e.raw = text;
    if (!filter(text) && e.raw) {
        translation(text).then(r => {
            if (!r.error || r.error) {
                const p = document.createElement('p');
                p.textContent = "\n\n-----------智谱4.5Flash翻译-----------\n\n\n";
                p.style.fontFamily = "'Microsoft YaHei', 微软雅黑, sans-serif";
                e.appendChild(p);
                // 译文
                const div = document.createElement('div');
                div.textContent = to(r.msg);
                div.style.fontFamily = "'Microsoft YaHei', 微软雅黑, sans-serif";
                e.appendChild(div);
            }
        })
    }
    function raw(e) {
        e.querySelectorAll('img[alt]').forEach(img => {
            const emoji = img.alt;
            const textNode = document.createTextNode(emoji);
            img.replaceWith(textNode);
        });
        return e.textContent;
    }
    function filter(text) {
        const chinese_regex = /[\u4e00-\u9fff]/;
        const japanese_regex = /[\u3040-\u30ff]/;
        const contains_chinese = chinese_regex.test(text);
        const contains_japanese = japanese_regex.test(text);
        return contains_chinese && !contains_japanese;
    }
    function to(value) {
        if (value === null || value === undefined) {
            return String(value);
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch (e) {
                return String(value);
            }
        }
        return String(value);
    }
}
(function main() {
    window['big_token'] = GM_getValue("big_token", null)
    if (big_token == null) {
        big_token = prompt("请填写智谱Token:")
        if (big_token.length != 0) {
            GM_setValue("big_token", big_token)
        } else {
            alert("如果没有请禁用,避免无意义弹窗");
        }
    }
    document.querySelectorAll('div[dir="auto"][lang]').forEach(handle);
    observe();
})();