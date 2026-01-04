// ==UserScript==
// @name        Bangumi Episodes Batch Edit Improve Plus
// @namespace   org.binota.scripts.bangumi.bebei
// @description 章节批量编辑增强
// @include     /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/subject\/\d+\/ep(\/edit_batch)?/
// @version     0.1.8
// @grant       none
// @author      BinotaLIU / SilenceAkarin
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550218/Bangumi%20Episodes%20Batch%20Edit%20Improve%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/550218/Bangumi%20Episodes%20Batch%20Edit%20Improve%20Plus.meta.js
// ==/UserScript==
'use strict';
const $ = selector => document.querySelector(selector);
const $a = selector => document.querySelectorAll(selector);
const chunk = (input, size) => input.reduce((arr, item, idx) => idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]], []);
const say = str => window.chiiLib.ukagaka.presentSpeech(str);
const baseUrl = `${window.location.pathname.match(/^\/subject\/\d+\/ep/).find(() => true)}/edit_batch`;
const csrfToken = $('[name=formhash]').value;
const revVersion = $('[name=rev_version]')?.value || '0';
const decodeHTMLEntities = text => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};
const fetchEpisodesData = async (episodes) =>
await fetch(
    baseUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: `chkall=on&submit=%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9&formhash=${csrfToken}&${episodes.map(ep => `ep_mod%5B%5D=${ep}`).join('&')}`,
    }
)
.then(res => res.text())
.then(html => {
    const rawData = ((html || '').match(/<textarea name="ep_list"[^>]+>([\w\W]+)?<\/textarea/) || [null, ''])[1].trim();
    return decodeHTMLEntities(rawData);
});
const updateEpisodesData = async (episodes, data) =>
await fetch(baseUrl, {
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    },
    body: `formhash=${csrfToken}&rev_version=${encodeURIComponent(revVersion)}&editSummary=${encodeURIComponent($('#editSummary').value)}&ep_ids=${episodes.join(',')}&ep_list=${encodeURIComponent(data)}&submit_eps=%E6%94%B9%E5%A5%BD%E4%BA%86`
  });
const app = async (episodes) => {
    if (episodes.length <= 20) return;
    const data = [];
    const epChunks = chunk(episodes, 20);
    say('加载章节列表中');
    for (const chunk of epChunks) {
        data.push(await fetchEpisodesData(chunk));
    }
    $('#summary').value = data.join('\n');
    $('[name=ep_ids]').value = episodes.join(',');
    $('[name=edit_ep_batch]').addEventListener('submit', (e) => {
        e.preventDefault();
        const lines = $('#summary').value.trim().split('\n').map(i => i.trim());
        if (lines.length !== episodes.length) {
            return false;
        }
        const dataChunks = chunk(lines, 20);
        (async () => {
            say('保存资料中……');
            for(const i in dataChunks) {
                await updateEpisodesData(epChunks[i], dataChunks[i].join('\n'));
            }
            say('保存完毕');
            window.location.href = window.location.pathname.match(/^\/subject\/\d+\/ep/).find(() => true);
        })();
        return false;
    });
    say('章节列表载入完毕');
}
const episodes = (window.location.hash.match(/#episodes=((\d+,)*\d+)/) || [null, ''])[1].split(',').filter(i => i.length);
if (episodes.length) {
    app(episodes);
    return;
}

// 新增功能：为每个分类添加全选按钮 （感谢Panzerance）
function addCategoryCheckAll() {
    const categories = document.querySelectorAll('li.cat');

    // 如果分类少于2个，则不添加全选按钮
    if (categories.length < 2) {
        return;
    }

    categories.forEach(catLi => {
        const checkboxes = [];
        let current = catLi.nextElementSibling;
        const categoryName = catLi.textContent.trim(); // 读取分类名称
        // 检查是否是Disc后跟数字的分类（如Disc 1, Disc 2等）
        const isDiscCategory = /^Disc\s+\d+/.test(categoryName);
        // 收集当前分类下的所有checkbox
        while (current && !current.matches('li.cat')) {
            const cb = current.querySelector('input[name="ep_mod[]"]');
            if (cb) checkboxes.push(cb);
            current = current.nextElementSibling;
        }
        if (checkboxes.length === 0) return;

        // 创建全选行
        const checkAllLi = document.createElement('li');
        checkAllLi.className = 'line_even clearit';
        checkAllLi.style.padding = '8px';
        // 根据分类类型动态显示"曲目"或"章节"
        const suffix = isDiscCategory ? '曲目' : '章节';
        // 使用读取到的分类名称
        checkAllLi.innerHTML = `
            <label>
                <input class="checkbox category-chkall" type="checkbox">
                <span class="tip">全选${categoryName}${suffix}</span>
            </label>
        `;

        // 插入到分类的最后一个条目后
        const lastLi = checkboxes[checkboxes.length-1].closest('li');
        lastLi.insertAdjacentElement('afterend', checkAllLi);

        // 绑定点击事件
        checkAllLi.querySelector('.category-chkall').addEventListener('click', function() {
            const isChecked = this.checked;
            checkboxes.forEach(cb => cb.checked = isChecked);
            updateFormAction();
        });
    });
}

// 优化全选逻辑
const updateFormAction = () => {
    const activeEps = [...document.querySelectorAll('[name="ep_mod[]"]:checked')].map(i => i.value);
    document.querySelector('[name=edit_ep_batch]').action = `${baseUrl}#episodes=${activeEps.join(',')}`;
};

// 原有全局全选逻辑
$('[name=chkall]').onclick = () => {
    const checkboxes = [...document.querySelectorAll('[name="ep_mod[]"]')];
    const hasUnchecked = checkboxes.some(cb => !cb.checked);
    checkboxes.forEach(cb => cb.checked = hasUnchecked);
    updateFormAction();
};

// 初始化分类全选按钮
addCategoryCheckAll();

// 确保选中状态变化时更新表单action
$a('[name="ep_mod[]"]').forEach(cb => {
    cb.addEventListener('click', updateFormAction);
});