// ==UserScript==
// @name         arXiv Ctrl+S → PDF (use Title as filename)
// @namespace    https://arxiv.org/
// @version      1.1
// @description  在arXiv摘要页按Ctrl+S时自动下载对应 PDF并命名为论文标题）
// @author       haku
// @match        https://arxiv.org/abs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552874/arXiv%20Ctrl%2BS%20%E2%86%92%20PDF%20%28use%20Title%20as%20filename%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552874/arXiv%20Ctrl%2BS%20%E2%86%92%20PDF%20%28use%20Title%20as%20filename%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', async function (e) {
    // 支持 Windows/Linux 的 Ctrl+S 和 macOS 的 ⌘+S
    if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 's') {
      // 如果焦点在输入框/可编辑元素上，则不拦截（保持原有行为）
      const tgt = e.target;
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) {
        return;
      }

      e.preventDefault();

      try {
        // 构造 PDF 链接：/abs/xxx -> /pdf/xxx.pdf
        const pdfUrl = location.href.replace('/abs/', '/pdf/') + '.pdf';

        // 从 <h1 class="title mathjax"> 中取文本，去掉 "Title:" 描述
        const titleEl = document.querySelector('h1.title, h1.title.mathjax');
        let filename = '';
        if (titleEl) {
          filename = titleEl.textContent.replace(/^Title:\s*/i, '').trim();
        }

        // 如果没取到标题，则以 arXiv id 做后备文件名
        if (!filename) {
          const id = (location.pathname || '').split('/').pop() || 'arxiv-paper';
          filename = id;
        }

        // 将不合法的文件名字符统一替换为 '-'
        // Windows 禁用字符： \ / : * ? " < > |  以及换行等
        filename = filename.replace(/[\r\n]+/g, ' ');
        filename = filename.replace(/[\\\/:*?"<>|]/g, '-');
        // 把多空格合并为单空格，并把连续多个 - 合并为一个
        filename = filename.replace(/\s+/g, ' ').trim();
        filename = filename.replace(/-+/g, '-');
        // 可选：限制长度（避免某些系统问题）
        if (filename.length > 200) filename = filename.slice(0, 200).trim();

        const fullName = filename + '.pdf';

        // 下载 PDF（同源请求，arXiv 允许）
        const resp = await fetch(pdfUrl);
        if (!resp.ok) throw new Error('无法获取 PDF，HTTP ' + resp.status);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fullName;
        // 必要时把元素加入 DOM，触发后移除
        document.body.appendChild(a);
        a.click();
        a.remove();

        // 释放对象 URL
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        alert('自动下载失败：' + (err && err.message ? err.message : err));
      }
    }
  });
})();
