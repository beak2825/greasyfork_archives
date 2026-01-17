// ==UserScript==
// @name         VGMDB to Bangumi Person
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  将VGMDB人物/组织条目添加到Bangumi现实人物
// @author       Gemini / SilenceAkarin
// @license MIT
// @match        https://vgmdb.net/artist/*
// @match        https://vgmdb.net/org/*
// @match        https://bgm.tv/person/new
// @match        https://bangumi.tv/person/new
// @match        https://chii.in/person/new
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      thumb-media.vgm.io
// @connect      vgm.io
// @connect      vgmdb.net
// @downloadURL https://update.greasyfork.org/scripts/562845/VGMDB%20to%20Bangumi%20Person.user.js
// @updateURL https://update.greasyfork.org/scripts/562845/VGMDB%20to%20Bangumi%20Person.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 辅助工具栏样式
    GM_addStyle(`
        .vgm-btn { margin-left: 10px; padding: 5px 10px; cursor: pointer; background: #F09199; color: #fff; border: none; border-radius: 4px; font-size: 12px; font-weight: bold; }
        #bgm_submit_btn { width: 100%; padding: 10px; background: #F09199; color: white; border: none; font-size: 14px; font-weight: bold; cursor: pointer; margin-top: 10px; border-radius: 4px; }
        #bgm_submit_btn:hover { background: #f2a0a7; }
        #bgm_submit_btn:disabled { background: #ccc; cursor: not-allowed; }
        #vgm_preview_container { margin-top: 10px; text-align: center; border: 1px dashed #ccc; padding: 5px; }
        #vgm_preview_img { max-width: 150px; display: block; margin: 0 auto; border: 1px solid #eee; }
        .paste-tip { font-size: 11px; color: #888; margin-top: 4px; }
    `);

    // ================= VGMDB 提取端 =================
    if (location.hostname.includes('vgmdb.net')) {
        // 兼容 Artist 的 span 和 Organization 的 h1
        let headerNameNode = document.querySelector('span[style*="font-size: 1.5em"]');
        if (!headerNameNode) headerNameNode = document.querySelector('h1[style*="display: inline"]');
        if (!headerNameNode) return;

        const isOrg = location.href.includes('/org/'); // 判断当前是否为组织页面

        // 2. 提取 Notes 内容
        // 根据 VGMdb 结构，Notes 通常在右侧栏或下方的一个特定区域
        // 我们通过查找包含 "Notes" 文本的节点来获取其后的内容
        let notesText = "";
        const profileLabels = document.querySelectorAll('#innermain span.smallfont');
        for (let label of profileLabels) {
            if (label.innerText.includes('Notes')) {
                // Notes 的内容通常在 label 的父元素或者紧接着的 text node 中
                const container = label.parentElement;
                // 克隆容器以防修改原页面，移除 label 标签本身，剩下就是文本
                const clone = container.cloneNode(true);
                const labelInClone = clone.querySelector('span.smallfont');
                if (labelInClone) labelInClone.remove();
                notesText = clone.innerText.trim();
                break;
            }
        }

        const btn = document.createElement('button');
        btn.innerText = '🚀 提取数据并跳转';
        btn.className = 'vgm-btn';
        headerNameNode.parentNode.insertBefore(btn, headerNameNode.nextSibling);

        const linkToggle = document.createElement('label');
        linkToggle.style = "margin-left: 10px; font-size: 12px; color: #666; cursor: pointer;";
        linkToggle.innerHTML = `<input type="checkbox" id="vgm_skip_links"> 不填充外部链接`;
        headerNameNode.parentNode.insertBefore(linkToggle, headerNameNode.nextSibling);

        btn.onclick = async function() {
            btn.innerHTML = '⌛ 同步中...';
            const data = {
                name: '',
                engName: headerNameNode.innerText.trim(),
                kana: '',
                aliases: [],
                birthdate: '',
                bloodtype: '',
                websites: [],
                twitter: '',
                nodes: '',
                avatarBase64: '',
                summary: ''
            };

            // --- 新增：Organization 页面数据提取逻辑 ---
            if (isOrg) {
                data.isOrg = true; // 标记为组织
                data.name = data.engName; // 组织名通常直接作为名字

                // 提取 Description
//                 const labels = document.querySelectorAll('dt.smallfont.label b');
//                 for (const label of labels) {
//                     if (label.innerText === 'Description') {
//                         // 找到 Description 对应的 dd 元素
//                         const dt = label.parentElement.parentElement; // 或者是 label.closest('dt')
//                         const dd = dt.nextElementSibling;
//                         if (dd && dd.tagName === 'DD') {
//                             // 替换 <br> 为换行符，并清理文本
//                             let descHtml = dd.innerHTML.replace(/<br\s*\/?>/gi, '\n');
//                             // 创建临时元素解析 HTML 实体
//                             let temp = document.createElement('div');
//                             temp.innerHTML = descHtml;
//                             data.summary = temp.innerText.trim();
//                         }
//                         break;
//                     }
//                 }
            }
            // --- 结束新增 ---
            if (!isOrg) {
                // 1. 姓名提取
                const leftNameSpan = document.querySelector('#leftfloat span[style*="font-size: 9pt"]');
                if (leftNameSpan) {
                    const text = leftNameSpan.innerText.trim();
                    const match = text.match(/^(.+?)(?:\s*\((.+?)\))?$/);
                    if (match) {
                        data.name = match[1].replace(/\s+/g, '');
                        if (match[2]) data.kana = match[2].trim();
                    }
                }

                if (!data.name) data.name = data.engName.replace(/\s+/g, '');
            }

            // 3. 其他信息解析 (Variations, Birthdate, Bloodtype)
            const leftDivs = Array.from(document.querySelectorAll('#leftfloat > div'));
            leftDivs.forEach(div => {
                const b = div.querySelector('b');
                if (!b) return;
                const label = b.innerText.trim();
                const value = div.innerText.replace(label, '').replace(':', '').trim();
                if (!value || value.toLowerCase().includes("not available")) return;

                if (label === 'Variations' || label === 'Aliases') {
                    data.aliases.push(...value.split('\n').map(v => v.trim()).filter(v => v && !v.toLowerCase().includes("not available")));
                } else if (label === 'Birthdate') {
                    data.birthdate = formatBgmDate(value);
                } else if (label === 'Bloodtype') {
                    data.bloodtype = value;
                }
            });

            // 4. Twitter (排除 archive)
            document.querySelectorAll('a[href*="twitter.com"], a[href*="x.com"]').forEach(a => {
                if (!data.twitter && !a.href.includes('web.archive.org')) {
                    const m = a.href.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
                    if (m) data.twitter = '@' + m[1];
                }
            });



            // 5. 头像
            const ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) data.avatarBase64 = await fetchImg(ogImg.content);

            // [此处插入链接提取逻辑]
            const skipLinks = document.getElementById('vgm_skip_links').checked;
            if (!skipLinks) {
                const excludeLabels = ['Fansite', 'Reference', 'Interview'];
                const linkContainers = document.querySelectorAll('div.smallfont[style*="padding"] > div[style*="margin-bottom"]');

                linkContainers.forEach(container => {
                    const labelTag = container.querySelector('b.label');
                    const labelName = labelTag ? labelTag.innerText.trim() : "Unknown";
                    if (excludeLabels.includes(labelName)) return;

                    const linkSpans = container.querySelectorAll('span.link_doc');
                    linkSpans.forEach(span => {
                        const mainLink = span.querySelector('a[rel="nofollow"]');
                        if (mainLink) {
                            let rawHref = mainLink.href;
                            let cleanUrl = rawHref;
                            if (rawHref.includes('/redirect/')) {
                                const parts = rawHref.split('/redirect/');
                                const urlPart = parts[1].split('/').slice(1).join('/');
                                cleanUrl = urlPart.startsWith('http') ? urlPart : `https://${urlPart}`;
                            }
                            data.websites.push({ title: mainLink.innerText.trim(), url: cleanUrl });
                        }
                    });
                });
            } else {
                console.log("用户选择了跳过外部链接提取");
            }

            // [插入点 2：提取 Notes 内容]
            // 6. 提取简介 (Notes)
            const rightFloat = document.getElementById('rightfloat');
            if (rightFloat) {
                // 查找包含 "Notes" 字样的标题
                const notesHeader = Array.from(rightFloat.querySelectorAll('h3')).find(h3 => h3.innerText.trim() === 'Notes');
                if (notesHeader) {
                    const notesContainer = notesHeader.parentElement.nextElementSibling;
                    if (notesContainer) {
                        const notesTextDiv = notesContainer.querySelector('.smallfont');
                        if (notesTextDiv) {
                            const rawNotes = notesTextDiv.innerText.trim();
                            // 关键判断：如果内容不是提示无信息的文案，则进行赋值
                            if (rawNotes && rawNotes !== "No notes available for this artist.") {
                                data.summary = rawNotes;
                            }
                        }
                    }
                }
            }

            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
            btn.innerText = '✅ 提取成功';
        };
    }

    // ================= Bangumi 填充端 =================
    else if (location.pathname === '/person/new') {
        const data = GM_getValue('vgmdb_to_bgm_data');
        if (!data) return;

        window.addEventListener('load', async () => {
            // 1. 姓名
            document.getElementById('crt_name').value = data.name;

            // [插入点 3：填充人物简介]
            if (data.summary) {
                const summaryBox = document.getElementById('crt_summary');
                if (summaryBox) summaryBox.value = data.summary;
            }

            // 2. 根据类型勾选职位
            if (data.isOrg) {
                // 如果是组织，勾选“制作人员/制作公司”
                const producerBox = document.getElementById('crtProProducer');
                if (producerBox && !producerBox.checked) producerBox.click();
            } else {
                // 如果是个人，勾选“歌手/音乐家”
                const artistBox = document.getElementById('crtProArtist');
                if (artistBox && !artistBox.checked) artistBox.click();
            }

            // 3. 切换 Wiki 模式
            const wikiModeBtn = document.querySelector('a[onclick="NormaltoWCODE()"]');
            if (wikiModeBtn) { wikiModeBtn.click(); await sleep(500); }

            // 4. 构建 Infobox
            let aliasBlock = "";
            if (data.engName) aliasBlock += `[英文名|${data.engName}]\n`;
            if (data.kana) aliasBlock += `[纯假名|${data.kana}]\n`;
            [...new Set(data.aliases)].forEach(a => {
                if (a && ![data.name, data.engName, data.kana].includes(a)) aliasBlock += `[${a}]\n`;
            });

            // 引用来源格式化 (排除重复和无效数据)
            let websiteBlock = data.websites.map(s => `[${s.title}|${s.url}]`).join('\n');

            let infobox = `{{Infobox Crt
|简体中文名=
|别名={
${aliasBlock}}
|性别=
|生日=${data.birthdate}
|血型=${data.bloodtype}
|身高=
|体重=
|BWH=
|引用来源={
${websiteBlock}
}
${data.twitter ? '|X='+data.twitter : ''}
}}`;

            const area = document.getElementById('subject_infobox');
            if (area) {
                area.value = infobox;
                area.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // 切换 入门模式
            const normalBtn = document.querySelector('a[onclick="WCODEtoNormal()"]');
            if (normalBtn) { normalBtn.click(); await sleep(500); }

            // 自定义提交按钮
            const originalBtn = document.getElementById('createButton');
            if(originalBtn) originalBtn.style.display = 'none';

            const btnParent = document.querySelector('td input[type="submit"]').parentNode;
            const previewContainer = document.createElement('div');
            previewContainer.id = 'vgm_preview_container';
            previewContainer.innerHTML = `<img id="vgm_preview_img" src="${data.avatarBase64 || ''}" style="${data.avatarBase64 ? '' : 'display:none'}"><p class="paste-tip">💡 提示：按 <b>Ctrl+V</b> 可更换下方预览图</p>`;
            btnParent.appendChild(previewContainer);

            const newBtn = document.createElement('button');
            newBtn.id = 'bgm_submit_btn';
            newBtn.innerText = '🚀 一键创建并提交';
            newBtn.type = 'button';
            btnParent.appendChild(newBtn);

            // Ctrl+V 粘贴监听
            window.addEventListener('paste', function(e) {
                const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                for (let index in items) {
                    const item = items[index];
                    if (item.kind === 'file' && item.type.includes('image')) {
                        const blob = item.getAsFile();
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            data.avatarBase64 = event.target.result;
                            const imgNode = document.getElementById('vgm_preview_img');
                            imgNode.src = data.avatarBase64;
                            imgNode.style.display = 'block';
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            });

            // 提交请求
            newBtn.onclick = async function() {
                newBtn.disabled = true;
                newBtn.innerText = '正在提交...';

                const form = document.querySelector('form[name="new_character"]');
                const formData = new FormData(form);
                formData.set('crt_name', document.getElementById('crt_name').value);
                formData.set('crt_infobox', document.getElementById('subject_infobox').value);
                formData.set('crt_summary', document.getElementById('crt_summary').value);
                if(document.getElementById('crtProArtist').checked) formData.set('prsn_pro[artist]', '1');

                const formhash = document.querySelector('input[name="formhash"]')?.value;
                if(formhash) formData.set('formhash', formhash);
                formData.set('submit', '添加新人物');

                if (data.avatarBase64) {
                    const blob = await fetch(data.avatarBase64).then(res => res.blob());
                    formData.set('picfile', blob, 'avatar.jpg');
                }

                const xhr = new XMLHttpRequest();
                xhr.open('POST', form.action, true);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        GM_deleteValue('vgmdb_to_bgm_data');
                        window.location.href = xhr.responseURL;
                    } else {
                        alert('提交失败');
                        newBtn.disabled = false;
                        newBtn.innerText = '🚀 一键创建并提交';
                    }
                };
                xhr.send(formData);
            };
        });

        GM_deleteValue('vgmdb_to_bgm_data');
    }

    // --- 工具函数 ---
    function formatBgmDate(str) {
        const months = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12};
        const m = str.match(/([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{4})/);
        return m ? `${m[3]}年${months[m[1]]}月${m[2]}日` : (str.match(/\d{4}/) ? `${str.match(/\d{4}/)[0]}年` : "");
    }


    async function fetchImg(url) {
        return new Promise((res) => {
            GM_xmlhttpRequest({ method: "GET", url: url, responseType: "blob", onload: (r) => {
                const f = new FileReader(); f.onloadend = () => res(f.result); f.readAsDataURL(r.response);
            }});
        });
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
})();
