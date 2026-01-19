// ==UserScript==
// @name         Workshop Mod Marker
// @namespace    mod-workshop-marker
// @version      1.1
// @description  Steam创意工坊MOD浏览标记
// @author       Teshuwenzi
// @license      MIT
// @include      https://steamcommunity.com/workshop/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562904/Workshop%20Mod%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/562904/Workshop%20Mod%20Marker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEY = 'steam_mod_marker_data';

    /* ================= 数据读写 ================= */

    function load() {
        return JSON.parse(localStorage.getItem(KEY) || '{}');
    }

    function save(data) {
        localStorage.setItem(KEY, JSON.stringify(data));
    }

    /* ================= 工坊卡片识别 ================= */

    function getModId(card) {
        const a = card.querySelector('a[href*="filedetails/?id="]');
        if (!a) return null;
        const m = a.href.match(/id=(\d+)/);
        return m ? m[1] : null;
    }

    function findCards() {
        return Array.from(document.querySelectorAll('a[href*="filedetails/?id="]'))
            .map(a => a.closest('div'))
            .filter(Boolean);
    }

    function applyStyle(card, state) {
        card.style.opacity = '';
        card.style.outline = '';

        if (state === 'seen') {
            card.style.opacity = '0.7';
            card.style.outline = '2px solid white';
        }
        if (state === 'unlike') {
            card.style.opacity = '0.4';
            card.style.outline = '2px solid red';
        }
        if (state === 'like') {
            card.style.opacity = '0.9';
            card.style.outline = '2px solid gold';
        }
    }

    /* ================= MOD 按钮 ================= */

    function addButtons(card, id, data) {
        if (card.querySelector('.tm-marker')) return;

        const box = document.createElement('div');
        box.className = 'tm-marker';
        box.style.position = 'absolute';
        box.style.top = '4px';
        box.style.right = '4px';
        box.style.zIndex = '999';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.gap = '2px';

        const row1 = document.createElement('div');
        row1.style.display = 'flex';
        row1.style.gap = '3px';

        const row2 = document.createElement('div');
        row2.style.display = 'flex';
        row2.style.justifyContent = 'flex-end';

        const makeBtn = (text, title, onClick) => {
            const b = document.createElement('button');
            b.textContent = text;
            b.title = title;
            b.style.cursor = 'pointer';
            b.style.fontSize = '9px';
            b.style.width = '18px';
            b.style.height = '18px';
            b.style.padding = '0';
            b.onclick = e => {
                e.stopPropagation();
                onClick();
            };
            return b;
        };

        row1.appendChild(makeBtn('👁', '已浏览', () => {
            data[id] = data[id] || {};
            data[id].state = 'seen';
            save(data);
            applyStyle(card, 'seen');
        }));

        row1.appendChild(makeBtn('❌', '不喜欢', () => {
            data[id] = data[id] || {};
            data[id].state = 'unlike';
            save(data);
            applyStyle(card, 'unlike');
        }));

        row1.appendChild(makeBtn('❤️', '收藏', () => {
            data[id] = data[id] || {};
            data[id].state = 'like';
            save(data);
            applyStyle(card, 'like');
        }));

        row2.appendChild(makeBtn('🔄', '重置标注', () => {
            if (data[id]) {
                delete data[id].state;
                if (!data[id].note) delete data[id];
            }
            save(data);
            card.style.opacity = '';
            card.style.outline = '';
        }));

        box.appendChild(row1);
        box.appendChild(row2);

        card.style.position = 'relative';
        card.appendChild(box);
    }

    /* ================= 备注 ================= */

    function addNote(card, id, data) {
        if (card.querySelector('.tm-note')) return;

        const noteBox = document.createElement('div');
        noteBox.className = 'tm-note';
        noteBox.style.marginTop = '4px';
        noteBox.style.fontSize = '12px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '添加你的备注…';
        input.style.width = '80%';

        const ok = document.createElement('button');
        ok.textContent = '✔';
        ok.style.marginLeft = '4px';
        ok.style.width = '20px';
        ok.style.height = '20px';
        ok.style.lineHeight = '18px';
        ok.style.fontSize = '14px';
        ok.style.fontWeight = 'bold';
        ok.style.background = 'transparent';
        ok.style.border = 'none';
        ok.style.borderRadius = '4px';
        ok.style.cursor = 'pointer';
        ok.style.padding = '0';

        const setSaved = (saved) => {
            ok.style.color = saved ? '#6fdc6f' : '#ddd';
        };

        ok.onmouseenter = () => ok.style.background = 'rgba(255,255,255,0.15)';
        ok.onmouseleave = () => ok.style.background = 'transparent';

        if (data[id] && data[id].note) {
            input.value = data[id].note;
            setSaved(true);
        } else {
            setSaved(false);
        }

        input.addEventListener('focus', () => {
            setSaved(false);
        });

        ok.onclick = e => {
            e.stopPropagation();
            data[id] = data[id] || {};
            data[id].note = input.value;

            if (!data[id].note && !data[id].state) {
                delete data[id];
            }

            save(data);
            setSaved(!!input.value);
        };

        noteBox.appendChild(input);
        noteBox.appendChild(ok);
        card.appendChild(noteBox);
    }

    /* ================= 导入 / 导出 ================= */

    function getDateStr() {
        return new Date().toISOString().slice(0, 10);
    }

    function exportTxt() {
        const data = load();
        const lines = [];

        lines.push(
`
作者：Teshuwenzi
功能：Steam创意工坊MOD浏览标记
安装说明：需要呦齁，chrome或者edge，浏览器需开启开发人员模式
功能介绍：
1.创意工坊的每个MOD小页面的增强按钮：看过啦，不喜欢的，收藏的，重置标注。
2.每个MOD下方支持输入文字备注（每条MOD备注后，需要按 √ 才可以保存，√ 绿色：已保存。√ 白色：未保存/编辑中）。
3.支持将所有已记录的MOD备注数据 导入 / 导出成为TXT存档文件。
4.数据格式：每一行为一个MOD 【标注状态	工坊id	文字备注】，TXT里，收藏的排序最前。
5.导入tXt会合并浏览器内保存的进度，比如保存TxT 时某条MOD有备注，过后这条备注在浏览器被手动重置归零（状态，文字），那么再次导入tXt时则会合并为有备注的版本
6.导入txT会合并浏览器内保存的进度，比如保存tXT时某条MOD无备注，过后这条备注在浏览器被手动添加状态（状态，文字），那么再次导入txT时则会合并为有备注的版本
7.导入Txt会覆盖浏览器内保存的进度，比如保存TXt时某条MOD有备注，过后这条备注在浏览器被手动修改状态（状态，文字），那么再次导入Txt时则会覆盖为导入的历史版本
8.TxT 被视为“存档快照”，导入 tXt 会覆盖 浏览器 中已有的记录，但TXT里没有的信息：状态，文字，不会被覆盖，而是共存。
⑨脑子不好使，逻辑有点绕，但按上面规则来就对了
10.TXT 导入 / 导出功能主要用于：更换电脑，更换浏览器，重装电脑系统前备份，日常使用时，所有数据都会直接保存在本地浏览器中，不依赖 txt 文件。
11.所有功能与数据仅对浏览器页面进行增强显示，不会修改 Steam 服务器数据，也不会绑定或关联 Steam 账号，所有数据仅保存在用户本地浏览器中。
12.目的：搜集MOD时，避免反复观看排名变化的MOD详情而设计，收藏按钮只为统一视觉效果，不与steam互通，如果真收藏/订阅请在MOD页面内收藏/订阅。
13.如果收藏按钮使用出现理解分歧以至于不知道收藏到哪了，请参考第4条：在txt内寻找收藏的ID与备注，返工愉快！

`
        );

        const entries = Object.keys(data).map(id => {
            const state = data[id].state || (data[id].note ? 'none' : '');
            const note = data[id].note || '';
            return { id, state, note };
        }).filter(e => e.state || e.note);

        // 按状态首字母排序，其次按 ID
        entries.sort((a, b) => {
            const sa = (a.state || 'none')[0];
            const sb = (b.state || 'none')[0];
            if (sa !== sb) return sa.localeCompare(sb);
            return a.id.localeCompare(b.id);
        });

        entries.forEach(e => {
            lines.push(`${e.state || 'none'}\t${e.id}\t${e.note}`);
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `WorkShopModMarker_${getDateStr()}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function importTxt(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const data = load();
            const lines = reader.result.split('\n');

            lines.forEach(line => {
                if (!/^\w+\t\d+/.test(line)) return;

                const parts = line.split('\t');
                const state = (parts[0] || '').trim();
                const id = (parts[1] || '').trim();
                const note = (parts[2] || '').trim();

                if (!id) return;

                if (!state && !note) {
                    delete data[id];
                    return;
                }

                data[id] = {};
                if (state && state !== 'none') data[id].state = state;
                if (note) data[id].note = note;
                if (!data[id].state && !data[id].note) delete data[id];
            });

            save(data);
            alert('导入完成，请刷新页面');
        };
        reader.readAsText(file);
    }

    function addTopButtons() {
        if (document.querySelector('.tm-top-btns')) return;

        const box = document.createElement('div');
        box.className = 'tm-top-btns';
        box.style.position = 'fixed';
        box.style.top = '10px';
        box.style.right = '20px';
        box.style.zIndex = '10000';
        box.style.display = 'flex';
        box.style.gap = '6px';

        const btn = (text, title, onClick) => {
            const b = document.createElement('button');
            b.textContent = text;
            b.title = title;
            b.style.cursor = 'pointer';
            b.onclick = onClick;
            return b;
        };

        box.appendChild(btn('📤 导出', '导出备注 TXT', exportTxt));

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.style.display = 'none';
        fileInput.onchange = () => {
            if (fileInput.files[0]) importTxt(fileInput.files[0]);
        };

        box.appendChild(btn('📥 导入', '导入备注 TXT', () => fileInput.click()));
        box.appendChild(fileInput);

        document.body.appendChild(box);
    }

    /* ================= 主循环 ================= */

    function run() {
        const data = load();
        findCards().forEach(card => {
            const id = getModId(card);
            if (!id) return;
            addButtons(card, id, data);
            addNote(card, id, data);
            if (data[id] && data[id].state) {
                applyStyle(card, data[id].state);
            }
        });
        addTopButtons();
    }

    setInterval(run, 1200);
})();
