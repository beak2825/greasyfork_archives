// ==UserScript==
// @name         HTML Tools
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  HTML Tools For Saker!
// @author       Jimmy
// @include      file://*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550291/HTML%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/550291/HTML%20Tools.meta.js
// ==/UserScript==

(function() {
    //弹出框提示
    let toast = Swal.mixin({
        toast: true,
        position: 'center', // 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    //数据操作
    let util = {
        clog(c) {
            console.log(c);
        },
        getCookie(name) {
            let arr = document.cookie.replace(/\s/g, "").split(';');
            for (let i = 0, l = arr.length; i < l; i++) {
                let tempArr = arr[i].split('=');
                if (tempArr[0] == name) {
                    return decodeURIComponent(tempArr[1]);
                }
            }
            return '';
        },
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        getStorage(key) {
            return localStorage.getItem(key);
        },
        setStorage(key, value) {
            return localStorage.setItem(key, value);
        },
        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            }
        },
        post(url, data, headers, type) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        get(url, headers, type) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 404) {
                            requestObj.abort();
                        }
                        resolve(res.response || res.responseText);
                    },
                    onprogress: (res) => {
                    },
                    onloadstart() {
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    };

    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.id = 'tm-button-container';
    Object.assign(btnContainer.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    });

    // 创建复制<style>按钮
    const copyStyleBtn = document.createElement('button');
    copyStyleBtn.textContent = '复制所有样式';
    Object.assign(copyStyleBtn.style, {
        padding: '8px 16px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    // 创建复制<script>按钮
    const copyScriptBtn = document.createElement('button');
    copyScriptBtn.textContent = '复制所有Js';
    Object.assign(copyScriptBtn.style, {
        padding: '8px 16px',
        backgroundColor: '#9C27B0',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
//         display: 'none'
    });

    // 创建转换<body>按钮
    const convertBodyBtn = document.createElement('button');
    convertBodyBtn.textContent = '复制页面内容';
    Object.assign(convertBodyBtn.style, {
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    // 添加到页面
    btnContainer.appendChild(copyStyleBtn);
    btnContainer.appendChild(copyScriptBtn);
    btnContainer.appendChild(convertBodyBtn);
    document.body.appendChild(btnContainer);

    // 复制<style>功能
    copyStyleBtn.addEventListener('click', async () => {
        try {
            const styles = Array.from(document.querySelectorAll('style'))
                .map(el => el.textContent.trim())
                .filter(content => {
                    // 过滤空内容和以.swal2-popup.swal2-toast开头的样式
                    return content && !content.startsWith('.swal2-popup.swal2-toast');
                })
                .join('\n\n');

            if (!styles) {
                Swal.fire('未找到样式内容', '当前页面没有<style>标签', 'info');
                return;
            }

            await GM_setClipboard(`figcaption {display: none;} \n\n`+styles, 'text');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '样式复制成功',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error('样式复制失败:', err);
            Swal.fire('错误', `样式复制失败: ${err.message}`, 'error');
        }
    });

    // 复制<script>功能
    copyScriptBtn.addEventListener('click', async () => {
        try {
            let scripts = Array.from(document.querySelectorAll('script'))
                .map(el => el.textContent.trim())
                .filter(content => content.length > 0)
                .join('\n\n');

            if (!scripts) {
                Swal.fire('未找到内容', '当前页面没有<script>标签内容', 'info');
                return;
            }else{

            scripts = `document.addEventListener("DOMContentLoaded", function () {
      document.addEventListener("click", function (e) {
        const faqItem = e.target.closest(".faq-item");
        if (faqItem) {
          const faqAnswer = faqItem.querySelector(".faq-answer");
          const faqIcon = faqItem.querySelector(".faq-icon");
          const isHidden = faqAnswer.classList.contains("hidden");
          if (isHidden) {
            faqAnswer.classList.remove("hidden");
            faqIcon.textContent = "-";
          } else {
            faqAnswer.classList.add("hidden");
            faqIcon.textContent = "+";
          }
          document.querySelectorAll(".faq-item").forEach((i) => {
            if (i !== faqItem) {
              i.querySelector(".faq-answer").classList.add("hidden");
              i.querySelector(".faq-icon").textContent = "+";
            }
          });
        }

        const backToTopBtn = e.target.closest("#backToTopBtn");
        if (backToTopBtn) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });

      let lastScrollY = window.scrollY; // Track last scroll position for "scroll up" detection
      document.addEventListener("scroll", function (e) {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const fixedBottomCta = document.getElementById("fixedBottomCta");
        const backToTopBtn = document.getElementById("backToTopBtn");

        // Show fixed CTA after 1/3 of the page
        if (fixedBottomCta) {
          if (scrollPosition > documentHeight / 3) {
            fixedBottomCta.classList.remove("hidden");
          } else {
            fixedBottomCta.classList.add("hidden");
          }
        }

        // Show Back to Top button on scroll up, not at very top
        if (backToTopBtn) {
          if (scrollPosition > viewportHeight / 2 && scrollPosition < lastScrollY) {
            backToTopBtn.classList.remove("hidden");
          } else {
            backToTopBtn.classList.add("hidden");
          }
        }

        lastScrollY = scrollPosition;
      });
    });`
            }

            await GM_setClipboard(scripts, 'text');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Js复制成功',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error('Js复制失败:', err);
            Swal.fire('错误', `Js复制失败: ${err.message}`, 'error');
        }
    });

    // 转换<body>功能
    convertBodyBtn.addEventListener('click', async () => {
        try {
//             const body = document.body;
//             let bodyHTML = body.innerHTML;

            // 克隆body元素
            const bodyClone = document.body.cloneNode(true);

            // 移除按钮容器
            const buttonContainer = bodyClone.querySelector('#tm-button-container');
            if (buttonContainer) {
                buttonContainer.remove();
            }

            let bodyHTML = bodyClone.innerHTML.trim();

            console.log('bodyHTML',bodyHTML);


            // 过滤<script>标签
            bodyHTML = bodyHTML.replace(/<script\b[^>]*>([\s\S]*?)<\/script>|<div id="tm-button-container">[\s\S]*?<\/div>/gi, '');

            // 创建转换后的内容
            const bodyClasses = document.body.className;
            const convertedContent = `<div id="funnel-html-body" class="${bodyClasses}">${bodyHTML}</div>`;

            await GM_setClipboard(convertedContent, 'text');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '页面内容复制成功',
                showConfirmButton: false,
                timer: 2000
            });

            // 实际替换页面中的body（可选）
            // body.innerHTML = convertedContent;
        } catch (err) {
            console.error('页面内容复制失败:', err);
            Swal.fire('错误', `页面内容复制失败: ${err.message}`, 'error');
        }
    });

    // 防重复注入标记
    btnContainer.dataset.tampermonkeyInjected = 'true';
})();