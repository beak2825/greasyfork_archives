// ==UserScript==
// @name         豆瓣录入-日亚数据+封面(增强修复版)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  增强了日亚搜索解析的成功率
// @author       Gemini
// @match        https://book.douban.com/new_subject*
// @match        https://book.douban.com/subject/new*
// @grant        GM_xmlhttpRequest
// @connect      amazon.co.jp
// @connect      www.amazon.co.jp
// @connect      media-amazon.com
// @connect      m.media-amazon.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564259/%E8%B1%86%E7%93%A3%E5%BD%95%E5%85%A5-%E6%97%A5%E4%BA%9A%E6%95%B0%E6%8D%AE%2B%E5%B0%81%E9%9D%A2%28%E5%A2%9E%E5%BC%BA%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564259/%E8%B1%86%E7%93%A3%E5%BD%95%E5%85%A5-%E6%97%A5%E4%BA%9A%E6%95%B0%E6%8D%AE%2B%E5%B0%81%E9%9D%A2%28%E5%A2%9E%E5%BC%BA%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= 核心：解析日亚页面的函数 =======
    function parseAmazon(html) {
        const doc = new DOMParser().parseFromString(html, "text/html");

        // 1. 尝试寻找书名 (多路径匹配)
        const titleSelectors = [
            'h2 a span',
            '.s-main-slot .s-result-item h2 span',
            'span.a-size-medium.a-color-base.a-text-normal',
            '#productTitle'
        ];
        let title = "";
        for (let s of titleSelectors) {
            let el = doc.querySelector(s);
            if (el && el.innerText.trim()) {
                title = el.innerText.trim();
                break;
            }
        }

        // 2. 尝试寻找图片
        const imgEl = doc.querySelector('img.s-image') || doc.querySelector('#imgBlkFront') || doc.querySelector('#landingImage');
        let imgUrl = "";
        if (imgEl) {
            imgUrl = imgEl.src || imgEl.getAttribute('data-old-hires') || imgEl.getAttribute('data-a-dynamic-image');
            // 如果是 data-a-dynamic-image 这种格式，提取第一个 URL
            if (imgUrl && imgUrl.startsWith('{')) {
                try { imgUrl = Object.keys(JSON.parse(imgUrl))[0]; } catch(e){}
            }
            // 转换为大图
            if (imgUrl) imgUrl = imgUrl.replace(/\._AC_.*_\./, ".");
        }

        return { title, imgUrl };
    }

    // ======= 逻辑 A：第一步页面 =======
    const titleInput = document.getElementById('p_title');
    if (titleInput) {
        const nextBtn = document.querySelector('input[name="subject_submit"]');
        if (nextBtn && !document.getElementById('gm-amazon-btn')) {
            const importBtn = document.createElement('input');
            importBtn.id = 'gm-amazon-btn';
            importBtn.type = 'button';
            importBtn.value = '一键导入日亚数据';
            importBtn.style.cssText = 'margin-left:10px; padding:5px 12px; background:#007722; color:#fff; border:none; cursor:pointer; border-radius:3px;';
            nextBtn.parentNode.insertBefore(importBtn, nextBtn.nextSibling);

            importBtn.onclick = function() {
                const isbn = titleInput.value.trim().replace(/-/g, '');
                if (!/^\d{10,13}$/.test(isbn)) {
                    alert('请在书名栏输入10或13位ISBN数字');
                    return;
                }

                importBtn.value = '检索中...';
                importBtn.disabled = true;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.amazon.co.jp/s?k=${isbn}`,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
                    },
                    onload: function(res) {
                        const result = parseAmazon(res.responseText);

                        if (result.title) {
                            titleInput.value = result.title;
                            const isbnInput = document.getElementById('uid');
                            if (isbnInput) isbnInput.value = isbn;

                            if (result.imgUrl) {
                                localStorage.setItem('pending_cover_url', result.imgUrl);
                                console.log("抓取到图片:", result.imgUrl);
                            }
                            importBtn.value = '导入成功！';
                            importBtn.style.background = '#42b983';
                        } else {
                            // 调试：如果没找到书名，看看是不是日亚出了验证码
                            if (res.responseText.includes('robot') || res.responseText.includes('captcha')) {
                                alert('日亚请求被拦截（出现了验证码），请在浏览器新窗口打开一次 amazon.co.jp 随便搜个东西，证明你是人类后再回来点击。');
                            } else {
                                alert('未找到匹配书籍，请确认ISBN是否正确。');
                            }
                            importBtn.value = '重试';
                            importBtn.disabled = false;
                        }
                    }
                });
            };
        }
    }

    // ======= 逻辑 B：第三步页面 (代码同前，增加容错) =======
    const fileInput = document.querySelector('input[name="picfile"]');
    if (fileInput) {
        const coverUrl = localStorage.getItem('pending_cover_url');
        if (coverUrl) {
            const uploadBtn = document.querySelector('input[name="img_submit"]');
            const tip = document.createElement('div');
            tip.style.cssText = 'color:#007722; font-weight:bold; margin-bottom:10px;';
            tip.innerText = '🚀 正在获取日亚封面...';
            fileInput.parentNode.insertBefore(tip, fileInput);

            GM_xmlhttpRequest({
                method: "GET",
                url: coverUrl,
                responseType: "blob",
                onload: function(res) {
                    if (res.status === 200) {
                        const file = new File([res.response], "cover.jpg", { type: "image/jpeg" });
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput.files = dataTransfer.files;
                        tip.innerText = '✅ 封面已填充，即将自动上传...';
                        localStorage.removeItem('pending_cover_url');
                        setTimeout(() => { if (uploadBtn) uploadBtn.click(); }, 1000);
                    }
                }
            });
        }
    }
})();