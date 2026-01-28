// ==UserScript==
// @name         Gerrit IPCSDK Jira Linker
// @namespace    https://blog.gngshn.com/
// @version      1.0
// @description  定位 commitMessage 容器后，替换 IPCSDK-xxxx 为超链接, 链接到 Jira
// @author       Grant Shen
// @match        https://pcgit2.rtkbf.com/gerrit*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564296/Gerrit%20IPCSDK%20Jira%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/564296/Gerrit%20IPCSDK%20Jira%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 配置项
    const JIRA_BASE_URL = "https://jira.realtek.com/browse/";
    const CONTAINER_ID = "commitMessage"; // 锚点 ID
    const TARGET_TAG = "pre"; // 最终包裹文本的标签
    const REGEX_PATTERN = /(IPCSDK-\d+)/;
    let checkTimer = null;

    /**
     * 🔥 通用递归查找函数
     * @param {Node} root - 起始搜索节点
     * @param {Function} predicate - 判断函数
     * @returns {Element|null}
     */
    function findElementRecursive(root, predicate) {
        if (!root) return null;

        // 获取当前层级的所有元素
        // 如果 root 是 document 或 shadowRoot，用 querySelectorAll('*')
        // 如果 root 是普通 element，用 children
        let elements;
        if (root.querySelectorAll) {
            elements = root.querySelectorAll('*');
        } else if (root.children) {
            elements = root.children;
        } else {
            return null;
        }

        for (const el of elements) {
            // 1. 检查当前元素是否符合条件
            if (predicate(el)) {
                return el;
            }

            // 2. 如果当前元素拥有 shadowRoot，则钻进去递归查找
            if (el.shadowRoot) {
                const found = findElementRecursive(el.shadowRoot, predicate);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * 主逻辑
     */
    function processLinker() {
        // [阶段 1] 全局递归查找：找到 id="commitMessage" 的容器
        const container = findElementRecursive(document, (el) => el.id === CONTAINER_ID);

        if (!container) {
            return; // 还没加载出来，继续轮询
        }

        // [阶段 2] 局部递归查找：以 container 为起点，向下查找 pre 标签
        const preBlock = findElementRecursive(container, (el) => el.tagName.toLowerCase() === TARGET_TAG);

        if (!preBlock) {
            return; // 容器有了，但内容还没渲染（或者结构还在加载），继续轮询
        }

        // [阶段 3] 检查内容并替换
        const originalHtml = preBlock.innerHTML;

        // 如果找到匹配的关键字
        if (REGEX_PATTERN.test(originalHtml)) {
            const newHtml = originalHtml.replace(REGEX_PATTERN, (match) => {
                return `<a href="${JIRA_BASE_URL}${match}" target="_blank">${match}</a>`;
            });

            preBlock.innerHTML = newHtml;
        }
        stopScript();
    }

    function stopScript() {
        if (checkTimer) {
            clearInterval(checkTimer);
            checkTimer = null;
        }
    }

    // 🚀 启动轮询 (0.5 秒一次)
    checkTimer = setInterval(processLinker, 500);

})();