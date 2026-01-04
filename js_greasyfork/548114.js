// ==UserScript==
// @name         蛇王争霸录制一键清空（静默版，仅录制页）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在录制列表页添加“静默清空”按钮，批量删除所有录制；屏蔽 alert/confirm/prompt，只在录制页生效；按钮布局保持和原始操作栏一致。
// @author       You
// @match        https://snake.ruc.astralis.icu/recordings*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548114/%E8%9B%87%E7%8E%8B%E4%BA%89%E9%9C%B8%E5%BD%95%E5%88%B6%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%EF%BC%88%E9%9D%99%E9%BB%98%E7%89%88%EF%BC%8C%E4%BB%85%E5%BD%95%E5%88%B6%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548114/%E8%9B%87%E7%8E%8B%E4%BA%89%E9%9C%B8%E5%BD%95%E5%88%B6%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%EF%BC%88%E9%9D%99%E9%BB%98%E7%89%88%EF%BC%8C%E4%BB%85%E5%BD%95%E5%88%B6%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const visible = (el) => el && el.offsetParent !== null;

  // 自动点击站点自己的确认按钮
  async function confirmOnce() {
    await wait(50);
    const btn = [...document.querySelectorAll('button,.pixel-button,.btn,.modal button')]
      .filter(visible)
      .find(b => /^(确s*定|确认|删除|是|OK|Yes)$/i.test((b.textContent || '').trim()));
    if (btn) btn.click();
  }

  function findDeleteButton() {
    const selectors = [
      '.recordings-list .delete-button',
      'button.delete-button',
      'button.btn-delete',
      '.record-item .delete-button',
    ];
    for (const sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn) return btn;
    }
    return null;
  }

  function mountButton() {
    const container = document.querySelector('.recordings-actions');
    if (!container || document.getElementById('onekey-delete-all-silent')) return;

    const btn = document.createElement('button');
    btn.id = 'onekey-delete-all-silent';
    btn.textContent = '一键删除全部（静默）';
    btn.className = 'pixel-button';
    btn.style.marginLeft = '8px';

    btn.onclick = async () => {
      // 临时屏蔽 alert/confirm/prompt，只在本页生效
      const bak = {
        alert: window.alert,
        confirm: window.confirm,
        prompt: window.prompt,
      };
      window.alert = () => {};
      window.confirm = () => true;
      window.prompt = () => '';

      try {
        btn.disabled = true;
        btn.textContent = '正在删除…';

        let deleted = 0, triesIdle = 0;

        while (true) {
          const delBtn = findDeleteButton();
          if (!delBtn) {
            triesIdle++;
            if (triesIdle >= 2) break;
            await wait(120);
            continue;
          }
          triesIdle = 0;
          delBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
          delBtn.click();
          await confirmOnce();
          await wait(150);
          deleted++;
          btn.textContent = `正在删除… (${deleted})`;
          window.scrollBy(0, 40);
        }

        btn.textContent = `删除完成，共处理 ${deleted} 条`;
        console.log(`[一键删除静默] 完成，共删除：${deleted}`);
      } catch (e) {
        console.error('[一键删除静默] 出错：', e);
        btn.textContent = '删除出错（详见控制台）';
      } finally {
        // 恢复 alert/confirm/prompt
        window.alert = bak.alert;
        window.confirm = bak.confirm;
        window.prompt = bak.prompt;

        await wait(300);
        btn.disabled = false;
      }
    };

    container.appendChild(btn);
  }

  const obs = new MutationObserver(mountButton);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  mountButton();
})();
