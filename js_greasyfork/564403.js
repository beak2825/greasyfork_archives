// ==UserScript==
// @name         获取 commit 信息
// @namespace    http://tampermonkey.net/
// @version      2026-01-28
// @description  获取信息转为commit指令
// @author       w
// @match        https://dev.hundsun.com/frameV2/pms/taskNew*
// @match        https://dev.hundsun.com/frameV2/pms/workbench*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hundsun.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564403/%E8%8E%B7%E5%8F%96%20commit%20%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/564403/%E8%8E%B7%E5%8F%96%20commit%20%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面加载完成
    const observer = new MutationObserver(() => {
        const dom = document.querySelector(".v-transfer-dom");
        const title = dom?.querySelector(".h-modal-confirm-head-title")?.innerText
        if (title?.startsWith("代码提交信息生成工具")) {
            const footer = dom.querySelector(".footer-action");
            if (!isExist(footer)) {
                stylePrettier(dom)
                const resultDom = dom.querySelector(".task-result")
                resultDom.setAttribute("contenteditable", true)
                const btn = createButton(resultDom)
                footer.appendChild(btn)
                console.log(4)
            }
        }
    });
    observer.observe(document.body, { childList: true });
})();

function isExist (footer) {
    const dom = footer.querySelector(".copy-git-commit")
    return Boolean(dom)
}

function createButton(resultDom) {
    const btn = document.createElement("button")
    btn.innerText = "copy"
    btn.setAttribute("class", "h-btn h-btn-primary copy-git-commit")
    btn.onclick = async function () {
        const rowListDom = resultDom.querySelectorAll(".group-row")
        let txt = ""
        rowListDom.forEach(row => {
            txt += row.innerText.replaceAll('\n', " ") + "\n"
        })
        await copyToClipboard(`git commit -m $'${txt.trim()}'`);
        btn.innerText = '复制成功'
        setTimeout(() => {
            btn.innerText = 'copy'
        }, 2000)
    }
    return btn
}

async function copyToClipboard(text) {
  console.log(text)
  try {
    await navigator.clipboard.writeText(text);
    console.log('复制成功！');
    // 可选：提示用户
  } catch (err) {
    console.error('复制失败:', err);
  }
}

function stylePrettier(dom) {
    const body = dom.querySelector("form.my-form-wrapper.h-form.h-form-label-right")
    body.style.marginLeft = 0
    body.style.marginRight = 0
    const box = dom.querySelector(".h-modal-content")
    box.style.top = '8%';
    box.style.bottom = '8%';
    box.style.left = '8%';
    box.style.right = '8%';
    box.style.width = '84%';
    box.style.height = '84%';
    box.style.overflow = 'auto';
}


