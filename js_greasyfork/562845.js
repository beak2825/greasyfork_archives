// ==UserScript==
// @name         Bangumi 人物创建助手
// @namespace    http://tampermonkey.net/
// @version      0.2.10.2
// @description  将其他维基站点人物/组织条目和各个社交平台的用户添加到Bangumi现实人物
// @author       Gemini / SilenceAkarin
// @license MIT
// @icon         https://bgm.tv/img/favicon.ico
// @match        https://vgmdb.net/artist/*
// @match        https://vgmdb.net/org/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://www.facebook.com/*
// @match        https://space.bilibili.com/*
// @match        *://weibo.com/n/*
// @match        *://weibo.com/u/*
// @match        https://www.pixiv.net/users/*
// @match        https://www.youtube.com/*
// @match        https://www.nicovideo.jp/user/*
// @match        *://vocadb.net/Ar/*
// @match        *://touhoudb.com/Ar/*
// @match        *://ci-en.dlsite.com/creator/*
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
// @connect      abs.twimg.com
// @connect      pbs.twimg.com
// @connect      i0.hdslb.com
// @connect      i1.hdslb.com
// @connect      i2.hdslb.com
// @connect      i.pximg.net
// @connect      tva2.sinaimg.cn
// @connect      tvax4.sinaimg.cn
// @connect      t.cn
// @connect      googleusercontent.com
// @connect      yt3.ggpht.com
// @connect      static.vocadb.net
// @connect      static.touhoudb.com
// @connect      media.ci-en.jp
// @connect      yt3.googleusercontent.com
// @connect      yt4.googleusercontent.com
// @connect      secure-dcdn.cdn.nimg.jp
// @connect      facebook.com
// @connect      fbcdn.net
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/562845/Bangumi%20%E4%BA%BA%E7%89%A9%E5%88%9B%E5%BB%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562845/Bangumi%20%E4%BA%BA%E7%89%A9%E5%88%9B%E5%BB%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 辅助工具栏样式
    GM_addStyle(`
        .vgm-btn { margin-left: 10px; padding: 5px 10px; cursor: pointer; background: #F09199; color: #fff; border: none; border-radius: 4px; font-size: 12px; font-weight: bold; }
        #vgm-pixiv-btn { margin-left: 15px; padding: 6px 16px; background: #0097fa; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.2s; box-shadow: 0 2px 4px rgba(0,151,250,0.2); }
        #vgm-pixiv-btn { background: #3dafff; transform: translateY(-1px); }
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

        const isOrgOrProducer = location.href.includes('/org/'); // 判断当前是否为组织页面

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

        // 1. 创建一个容器来包裹按钮和复选框，确保它们在同一行
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.verticalAlign = 'middle';

        // 2. 创建按钮 (放在左边)
        const btn = document.createElement('button');
        btn.innerText = '🚀 导入到 Bangumi';
        btn.className = 'vgm-btn';
        btn.style.marginRight = '8px'; // 与右侧复选框保持间距
        wrapper.appendChild(btn);

        // 3. 创建复选框 (放在右边)
        const linkToggle = document.createElement('label');
        linkToggle.style = "font-size: 12px; color: #666; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap;";
        linkToggle.innerHTML = `<input type="checkbox" id="vgm_skip_links" style="margin-right: 3px;"> 不填充外部链接`;
        wrapper.appendChild(linkToggle);

        // 4. 将整个容器插入到页面标题后面
        headerNameNode.parentNode.insertBefore(wrapper, headerNameNode.nextSibling);

        btn.onclick = async function() {
            const originalText = btn.innerText;
            btn.innerHTML = '⌛ 提取中...';
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
                summary: '',
                isIllustrator: false,
                fromSNS: false
            };

            // --- 新增：Organization 页面数据提取逻辑 ---
            if (isOrgOrProducer) {
                data.isOrgOrProducer = true; // 标记为组织
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
            if (!isOrgOrProducer) {
                data.isArtist = true;
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

            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = "#e84566";
            }, 3000);
        };
    }

    // ================= VocalDB / TouhouDB 提取端 =================
    else if (location.hostname.includes('vocadb.net') || (location.hostname.includes('touhoudb.com'))) {
        async function scrapeData(btn) {
            btn.innerText = '⌛ 提取中...';

            // 1. 初始化存储对象
            const data = {
                name: '',
                engName: '',
                kana: '',
                aliases: [],
                birthdate: '',
                bloodtype: '',
                websites: [],
                twitter: '',
                PixivID: '',
                nodes: '',
                avatarBase64: '',
                summary: '',
                isArtist: false,
                isOrgOrProducer: false,
                isIllustrator: false,
            };

            // --- 抓取头像 ---
            const imgElement = document.querySelector('.pull-left.entry-main-picture img');
            if (imgElement) {
                data.avatarBase64 = await fetchImg(imgElement.src);
            }

            const skipLinks = document.getElementById('vgm_skip_links').checked;
            if (!skipLinks) {
                // --- 抓取基本属性 ---
                // --- 遍历 properties 表格 ---
                const rows = document.querySelectorAll('table.properties tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 2) return;

                    // 获取左侧标签列的文本
                    const label = cells[0].textContent.trim();
                    // 获取右侧数据列
                    const valueCell = cells[1];
                    const valueText = valueCell.textContent.trim();

                    // 1. 处理姓名和别名
                    if (label === 'Name') {
                        // 提取主名字：获取第一个文本节点
                        data.name = valueCell.childNodes[0].textContent.trim();
                        // 提取别名
                        const aliasSpan = valueCell.querySelector('.extraInfo');
                        if (aliasSpan) {
                            data.aliases = aliasSpan.innerText.split(',').map(s => s.trim());
                        }
                    }

                    // 2. 处理 Type (修复 false 的关键)
                    if (label === 'Type') {
                        console.log("检测到 Type 原始文本:", valueText);

                        // 判定 Music producer
                        const artistTypes = ['Music producer', 'Vocalist'];
                        data.isArtist = artistTypes.some(t => valueText.includes(t));

                        // 判定 Org/Producer 类型
                        const orgTypes = ['Animation producer', 'Circle'];
                        data.isOrgOrProducer = orgTypes.some(t => valueText.includes(t));

                        // 判定 Illustrator
                        const illustTypes = ['Illustrator', 'Cover artist'];
                        data.isIllustrator = illustTypes.some(t => valueText.includes(t));
                    }

                    // 3. 处理 Official links
                    if (label === 'Official links') {
                        const links = valueCell.querySelectorAll('a.extLink');
                        // --- 修复 Official links 内部的排除逻辑 ---
                        links.forEach(a => {
                            const href = a.href;
                            let title = a.innerText.trim();

                            // 1. 提取 Twitter
                            if (!data.twitter && (href.includes('twitter.com') || href.includes('x.com'))) {
                                const m = href.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
                                if (m) data.twitter = '@' + m[1];
                                return; // 命中后跳过，不存入 websites
                            }

                            // 2. 提取 PixivID
                            if (!data.PixivID && href.includes('pixiv.net')) {
                                const m = href.match(/users\/(\d+)/);
                                if (m) data.PixivID = m[1];
                                return; // 命中后跳过，不存入 websites
                            }

                            if (title === 'YouTube Channel') {
                                title = 'YouTube';
                            }
                            if (title === 'Website') {
                                title = 'HP';
                            }

                            // 3. 最终排除判断：只有非 Twitter 且 非 Pixiv 链接才 push
                            const isTwitter = href.includes('twitter.com') || href.includes('x.com');
                            const isPixiv = href.includes('pixiv.net');

                            if (!isTwitter && !isPixiv) {
                                data.websites.push({ title: title, url: href });
                            }

                        });
                    }
                });
            }

            console.log("抓取完成:", data);
            btn.innerText = '✅ 提取成功';
            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
        }

        function injectButtonSafe() {
            // 检查按钮是否已存在，避免重复插入
            if (document.getElementById('my-scraper-btn')) return;

            // 定位锚点：使用你确认可以找到的 h1.page-title
            const pageTitle = document.querySelector('h1.page-title');
            if (!pageTitle) return;

            const buttonContainer = pageTitle.nextElementSibling;
            if (!buttonContainer || (buttonContainer.tagName !== 'P' && buttonContainer.tagName !== 'DIV')) return;

            const scraperBtn = document.createElement('a');
            scraperBtn.id = 'my-scraper-btn';
            scraperBtn.href = 'javascript:void(0);';
            scraperBtn.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary';
            scraperBtn.style.marginLeft = '5px';
            scraperBtn.innerHTML = `<span class="ui-button-icon-primary ui-icon ui-icon-disk"></span><span class="ui-button-text">🚀 导入到 Bangumi</span>`;
            const originalHTML = scraperBtn.innerHTML;

            const linkToggle = document.createElement('label');
            // 使用 margin-right 留出间距，并确保 inline-block 不换行
            linkToggle.style = "margin-left: 10px; margin-right: 5px; font-size: 12px; color: #666; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap;";
            linkToggle.innerHTML = `<input type="checkbox" id="vgm_skip_links" style="margin: 0 3px 0 0;"> 不填充外部链接`;


            scraperBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scrapeData(scraperBtn.querySelector('.ui-button-text'));

                setTimeout(() => {
                    // 3. 恢复原始的 HTML 结构（包含那两个 span）
                    scraperBtn.innerHTML = originalHTML;
                    scraperBtn.disabled = false;
                    scraperBtn.style.backgroundColor = "#e84566";
                }, 3000);
            });

            buttonContainer.appendChild(scraperBtn);
            buttonContainer.appendChild(linkToggle);
            console.log("按钮已注入到容器");
        }

        // --- 解决单页应用(SPA)跳转不触发脚本的问题 ---

        // 1. 监听 DOM 变化：一旦发现页面主要内容区域变动，就尝试重新注入按钮
        const observer = new MutationObserver(() => {
            // 只有当页面出现了 page-title 且按钮还没注入时才执行
            if (document.querySelector('h1.page-title') && !document.getElementById('my-scraper-btn')) {
                injectButtonSafe();
            }
        });

        // 开始监听整个 body 的子节点变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 2. 初始加载执行一次
        injectButtonSafe();
    }

    // ================= Ci-en 提取端 =================
    else if (location.hostname.includes('ci-en.dlsite.com')) {
        //主抓取逻辑
        async function scrapeData() {

            const data = {
                name: '',
                engName: '',
                kana: '',
                aliases: [],
                birthdate: '',
                bloodtype: '',
                websites: [],
                nodes: '',
                avatarBase64: '',
                summary: '',
                isOrgOrProducer: true,
            };

            // 1. 获取名字
            // 对应 HTML: <h2 class="e-title is-4 e-userName"><a ...> Riez-ON </a></h2>
            const nameEl = document.querySelector('.e-userName a');
            if (nameEl) {
                data.name = nameEl.innerText.trim();
            }

            // 2. 获取简介
            // 对应 HTML: <div class="c-grid-account-info">...<p class="e-text is-sub">...</p></div>
            const summaryEl = document.querySelector('.c-grid-account-info .e-text.is-sub');
            if (summaryEl) {
                data.summary = summaryEl.innerText.trim();
            }

            const skipLinks = document.getElementById('vgm_skip_links').checked;

            // 3. 获取第三方链接 (Websites)
            // 对应 HTML: <ul class="c-snsList e-flex">...<li class="c-snsList-item"><a>...</a></li></ul>
            const snsLinks = document.querySelectorAll('.c-snsList .c-snsList-item a');
            data.websites = []; // 重置以防重复点击
            data.websites.push({ title: 'Ci-en', url: window.location.href }); // 填充Ci-en链接
            if (!skipLinks) {
                snsLinks.forEach(link => {
                    const title = link.innerText.trim() || link.textContent.trim();
                    const href = link.href;
                    if (href) {
                        data.websites.push({ title: title, url: href });
                    }
                });
            }

            // 4. 获取头像并转换为 Base64
            // 对应 HTML: <div class="c-grid-account-thumb">...<img ... src="..."></div>
            const imgEl = document.querySelector('.c-grid-account-thumb img');
            if (imgEl) {
                // 优先取 src，如果没有则取 data-src
                const src = imgEl.src || imgEl.getAttribute('data-src');
                if (src) {
                    try {
                        data.avatarBase64 = await fetchImg(src);
                    } catch (e) {
                        console.error("图片抓取失败:", e);
                    }
                }
            }
            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
        }

        // 注入按钮
        function injectButton() {
            // 1. 精准定位名字容器
            const nameHeader = document.querySelector('.c-grid-account-name .e-userName');
            const targetContainer = document.querySelector('.c-grid-account-name');

            if (!nameHeader || !targetContainer) return;
            if (document.getElementById('vgm_skip_links')) return; // 防止重复注入

            // 2. 创建一个包装容器，设为 inline-flex 确保不换行
            const wrapper = document.createElement('div');
            wrapper.id = 'ci-en-helper-wrapper';
            wrapper.style = "display: inline-flex; align-items: center; margin-left: 10px; vertical-align: middle; gap: 8px;";

            // 3. 创建按钮
            const btn = document.createElement('button');
            btn.innerText = "🚀 导入到 Bangumi";
            // 统一使用样式
            btn.style = "font-size: 12px; padding: 4px 10px; cursor: pointer; background-color: #e84566; color: #fff; border: none; border-radius: 4px; white-space: nowrap; height: 26px; line-height: 1.2;";

            // 4. 创建复选框标签
            const linkToggle = document.createElement('label');
            linkToggle.style = "font-size: 12px; color: #666; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap; font-weight: normal; margin: 0;";
            linkToggle.innerHTML = `
                <input type="checkbox" id="vgm_skip_links"
                    style="margin: 0 4px 0 0 !important;
                           width: 14px !important;
                           height: 14px !important;
                           appearance: checkbox !important;
                           -webkit-appearance: checkbox !important;
                           display: inline-block !important;
                           visibility: visible !important;
                           position: static !important;
                           vertical-align: middle;">
                <span style="vertical-align: middle;">不填充外部链接</span>`;

            // 点击事件
            btn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const originalText = btn.innerText;
                btn.innerText = '⌛ 提取中...';
                btn.disabled = true;
                const originalBg = btn.style.backgroundColor;
                btn.style.backgroundColor = "#ccc";

                try {
                    await scrapeData();
                    btn.innerText = '✅ 提取成功';
                    btn.style.backgroundColor = "#4caf50";
                } catch (err) {
                    console.error(err);
                    btn.innerText = "❌ 错误";
                    btn.style.backgroundColor = "#f44336";
                }

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = originalBg;
                }, 3000);
            };

            // 5. 组装并注入
            wrapper.appendChild(btn);
            wrapper.appendChild(linkToggle);

            // 关键修正：Ci-en 的名字是一个 h2，内部包含一个 a 标签
            // 我们直接把 wrapper 放在 h2 内部的最末尾，这样它会跟随在名字后面
            nameHeader.appendChild(wrapper);

            // 确保 h2 容器不会把内容挤下去
            nameHeader.style.display = "inline-flex";
            nameHeader.style.alignItems = "center";
            nameHeader.style.width = "auto";
        }

        // 等待页面加载完成（以防动态渲染延迟）
        window.addEventListener('load', () => {
            // 稍微延迟一下确保 DOM 稳定，或者直接执行
            setTimeout(injectButton, 500);
        });

    }

    // ================= Weibo 提取端 =================
    else if (location.hostname.includes('weibo.com')) {
        // --- 新增：创建/显示提示框的辅助函数 ---
        function showToast(message, duration = 0) {
            let toast = document.querySelector('#weibo-scrape-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'weibo-scrape-toast';
                // 设置样式：顶部居中、橙色背景、圆角、层级最高
                Object.assign(toast.style, {
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#eb7350',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    zIndex: '9999',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'opacity 0.3s'
                });
                document.body.appendChild(toast);
            }
            toast.innerText = message;
            toast.style.display = 'block';
            toast.style.opacity = '1';

            if (duration > 0) {
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => { toast.style.display = 'none'; }, 300);
                }, duration);
            }
            return toast;
        }

        function hideToast() {
            const toast = document.querySelector('#weibo-scrape-toast');
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => { toast.style.display = 'none'; }, 300);
            }
        }

        async function scrapeData() {
            const data = {
                name: '',
                engName: '',
                kana: '',
                aliases: [],
                birthdate: '',
                bloodtype: '',
                websites: [],
                twitter: '',
                avatarBase64: '',
                summary: '',
                isIllustrator: false,
                PixivID: '',
                fromSNS: true
            };

            showToast("正在解析页面并还原短链接，请稍候...");

            const expandBtn = document.querySelector('._opt_1yc79_176 .woo-font--angleDown')?.closest('._opt_1yc79_176');

            if (expandBtn) {
                expandBtn.click();
                console.log("已触发展开按钮...");
                // 增加延迟，确保 DOM 异步加载完成
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.log("未找到展开按钮，可能信息已是展开状态");
            }

            // --- 2. 获取基础信息 ---
            const nameEl = document.querySelector('._name_1yc79_291');
            data.name = nameEl ? nameEl.textContent.trim() : "未知名称";

            const avatarEl = document.querySelector('.woo-avatar-img');
            let avatarUrl = avatarEl ? avatarEl.src : "";

            // --- 3. 基于 _box3_1yc79_193 定位简介和链接 ---
            const detailBox = document.querySelector('._box3_1yc79_193');
            // let summary = "";
            //const websiteLinks = [{ title: '微博', url: window.location.href }];
            data.websites.push({ title: '微博', url: window.location.href });

            if (detailBox) {
                // A. 抓取简介：定位包含 proBintro 图标的行
                const introIcon = detailBox.querySelector('.woo-font--proBintro');
                if (introIcon) {
                    // 图标在 _icon3 容器里，我们要找它同级的 _con3 容器
                    const introContainer = introIcon.closest('._icon3_1yc79_203')?.nextElementSibling;
                    if (introContainer) {
                        data.summary = introContainer.textContent.trim();
                    }
                }

                // let formattedBirthdate = "";
                const birthIcon = detailBox.querySelector('.woo-font--proIntro');
                if (birthIcon) {
                    const birthdateContainer = birthIcon.closest('._icon3_1yc79_203')?.nextElementSibling;
                    console.log("检测到生日是否存在:", birthdateContainer ? true : false);
                    if (birthdateContainer) {
                        const birthDate = birthdateContainer.textContent.trim();
                        console.log("检测到生日原始文本:", birthDate);

                        const dateMatch = birthDate.match(/\d{4}-\d{2}-\d{2}/);
                        if (dateMatch) {
                            const dateStr = dateMatch[0]; // 拿到 "1991-07-11"

                            // 2. 转换为 "1991年07月11日" 形式
                            const parts = dateStr.split('-');
                            const year = parts[0];
                            const month = Number(parts[1]);
                            const day = Number(parts[2]);

                            data.birthdate = `${year}年${month}月${day}日`;
                            // data.birthdate = `${parts[0]}年${parts[1]}月${parts[2]}日`;
                        }
                    }
                }

                // B. 抓取链接：定位包含 proLink 图标的行
                const linkIcon = detailBox.querySelector('.woo-font--proLink');
                if (linkIcon) {
                    const linkWrapper = linkIcon.closest('._icon3_1yc79_203')?.nextElementSibling;
                    if (linkWrapper) {
                        const anchors = linkWrapper.querySelectorAll('a');

                        // 使用 for...of 以支持内部的 await
                        for (const a of anchors) {
                            const rawUrl = a.href;
                            const title = a.textContent.trim();

                            showToast(`正在还原链接: ${title}...`);
                            console.log(`正在还原链接: ${rawUrl} ...`);
                            // 调用还原函数
                            const realUrl = await unshortenUrl(rawUrl);

                            if (realUrl && !data.websites.some(item => item.url === realUrl)) {
                                data.websites.push({
                                    title: title,
                                    url: realUrl
                                });
                            }
                        }
                    }
                }
            }

            // --- 4. 头像转 Base64 ---
            let avatarBase64 = "";
            if (avatarUrl) {
                try {
                    data.avatarBase64 = await fetchImg(avatarUrl);
                } catch (e) {
                    console.error("头像转换失败", e);
                }
            }


            // 6. 输出结果
            console.log("✅ 提取成功", data);
            showToast("✅ 提取成功，正在跳转 Bangumi...", 1500);
            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
        }

        // 添加按钮的函数
        function addScrapeButton() {
            // 目标容器：使用你提供的容器类名 _h3_1yc79_78
            // 注意：因为有两个相同的类名在class里，querySelector会匹配符合规则的第一个
            const targetContainer = document.querySelector('.woo-box-flex.woo-box-alignCenter._h3_1yc79_78._h3_1yc79_78');

            // 防止重复添加
            if (targetContainer && !document.querySelector('#weibo-scrape-btn')) {
                const btn = document.createElement('button');
                btn.id = 'weibo-scrape-btn';
                btn.innerText = '🚀 导入到 Bangumi';
                btn.style.marginLeft = '10px';
                btn.style.padding = '4px 8px';
                btn.style.backgroundColor = '#eb7350';
                btn.style.color = 'white';
                btn.style.border = 'none';
                btn.style.borderRadius = '4px';
                btn.style.cursor = 'pointer';
                btn.style.fontSize = '12px';

                btn.onclick = scrapeData;

                targetContainer.appendChild(btn);
            }
        }

        // 由于微博是动态加载，使用定时器或Observer来检测元素是否出现
        // 这里简单使用定时器轮询，直到元素找到为止
        const observer = new MutationObserver((mutations) => {
            addScrapeButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始尝试
        setTimeout(addScrapeButton, 1000);
        setTimeout(addScrapeButton, 3000);
    }

    // ================= X (Twitter) 提取端 =================
    else if (location.hostname.includes('x.com') || location.hostname.includes('twitter.com')) {

        // 修正后的提取数据逻辑
        async function collectXData() {
            try {
                // 定位主列容器，避免抓取到侧边栏自己的头像
                const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');

                const userNameSection = primaryColumn?.querySelector('[data-testid="UserName"]');
                const spans = userNameSection?.querySelectorAll('span');
                const rawName = spans ? spans[0].innerText : "";

                let handle = "";
                const allText = userNameSection?.innerText.split('\n') || [];
                handle = allText.find(t => t.startsWith('@')) || "";

                const bio = primaryColumn?.querySelector('[data-testid="UserDescription"]')?.innerText || "";
                const website = primaryColumn?.querySelector('[data-testid="UserUrl"]')?.innerText || "";

                // --- 修正头像抓取逻辑 ---
                // 在主栏目中寻找包含 profile_images 的图片，这通常是用户的大头像
                const avatarImg = primaryColumn?.querySelector('img[src*="/profile_images/"]');
                let avatarUrl = "";
                if (avatarImg) {
                    // 转换成高清大图地址 (去掉 _normal, _400x400 等后缀)
                    avatarUrl = avatarImg.src.replace(/_(normal|400x400|200x200)\./, '.');
                }
                // -----------------------

                const data = {
                    name: rawName.replace(/\s+/g, ''),
                    engName: '',
                    kana: '',
                    aliases: [],
                    birthdate: '',
                    bloodtype: '',
                    websites: website ? [{ title: 'HP', url: `https://${website}` }] : [],
                    twitter: handle,
                    avatarBase64: avatarUrl ? await fetchImg(avatarUrl) : '',
                    summary: bio,
                    fromSNS: true
                };

                GM_setValue('vgmdb_to_bgm_data', data);
                window.open('https://bgm.tv/person/new', '_blank');
            } catch (e) {
                console.error("X 抓取失败:", e);
                alert("抓取失败，请确保在用户主页。");
            }
        }

        // 注入按钮（针对 X 的单页应用特性使用观察者）
        const injectXBtn = () => {
            if (document.getElementById('vgm-x-btn')) return;
            const nameContainer = document.querySelector('[data-testid="UserName"]');
            if (nameContainer) {
                const btn = document.createElement('button');
                btn.id = 'vgm-x-btn';
                btn.innerText = '🚀 导入到 Bangumi';
                const originalText = btn.innerText;
                btn.className = 'vgm-btn'; // 复用你定义的样式
                btn.onclick = (e) => {
                    btn.innerHTML = '⌛ 提取中...';
                    e.preventDefault();
                    collectXData();
                    btn.innerText = '✅ 提取成功';
                };
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = "#e84566";
                }, 3000);
                nameContainer.appendChild(btn);
            }
        };

        const observer = new MutationObserver(injectXBtn);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ================= Facebook 提取端 =================
    else if (location.hostname.includes('facebook.com')) {

        async function scrapeFBData() {
            // --- A. 姓名获取 ---
            const h1 = document.querySelector('h1');
            const name = h1 ? h1.innerText.replace('抓取 JSON', '').replace(/\s+/g, '') : "";

            // --- B. 简介获取 ---
            // 定位所有符合样式的 span
            const allSpans = document.querySelectorAll('span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u');
            let summaryText = "";

            for (let span of allSpans) {
                // 排除帖子内容 (role="article") 和 信息流 (role="feed")
                if (span.closest('[role="article"]') || span.closest('[role="feed"]')) continue;

                const text = span.innerText.trim();
                // 过滤干扰项：好友数、共同朋友、空字符串
                if (text.includes('位好友') || text.includes('friends') || text.includes('共同朋友') || text === "") continue;

                // 在 Intro 区域中，最长且包含换行或特定描述的通常是 Bio
                if (text.length > summaryText.length) {
                    summaryText = span.innerHTML
                        .replace(/<br\s*[\/]?>/gi, "\n") // 保持换行
                        .replace(/<[^>]+>/g, "")        // 移除标签
                        .trim();
                }
            }

            // --- C. 头像获取 ---
            const avatarEl = document.querySelector('image[style*="height: 168px"], image[style*="height:168px"]');
            const avatarUrl = avatarEl ? (avatarEl.getAttribute('xlink:href') || avatarEl.getAttribute('href')) : "";

            const data = {
                name: name,
                engName: '',
                kana: '',
                aliases: [],
                birthdate: '',
                bloodtype: '',
                websites: [{ title: 'Facebook', url: window.location.href }],
                twitter: '',
                nodes: '',
                avatarBase64: '',
                summary: summaryText,
                isIllustrator: false,
                fromSNS: true
            };

            if (avatarUrl) {
                data.avatarBase64 = await fetchImg(avatarUrl);
            }
            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
        }

        // 4. 注入按钮 (调整位置到右侧)
        function injectButton() {
            if (document.getElementById('fb-grabber-btn')) return;

            const h1 = document.querySelector('h1');
            if (h1) {
                // 关键修改：让 h1 变成行内块，这样它就不会霸占整行，按钮就能排在右边
                h1.style.display = 'inline-block';
                h1.style.verticalAlign = 'middle';

                const btn = document.createElement('button');
                btn.id = 'fb-grabber-btn';
                btn.innerText = '🚀 导入到 Bangumi';
                const originalText = btn.innerText;

                // 按钮样式
                btn.style.cssText = `
                display: inline-block;
                margin-left: 15px;
                padding: 6px 12px;
                font-size: 13px;
                background-color: #0866FF;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                vertical-align: middle;
                font-weight: 600;
                font-family: sans-serif;
                white-space: nowrap;
            `;

                // 将按钮插入到 h1 之后
                h1.after(btn);

                btn.onclick = (e) => {
                    btn.innerText = '⌛ 提取中...';
                    e.preventDefault();
                    scrapeFBData();
                    btn.innerText = '✅ 提取成功';

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                    }, 3000);
                };
            }
        }

        // 5. 持续监听 DOM (应对 FB 的异步加载)
        const observer = new MutationObserver(() => injectButton());
        observer.observe(document.body, { childList: true, subtree: true });

    }
    // ================= Bilibili 提取端 =================
    else if (location.host === 'space.bilibili.com') {
        // 1. 提取 B 站数据逻辑
        async function collectBilibiliData() {
            try {
                // 获取用户名
                const nameEl = document.querySelector('.nickname');
                const username = nameEl ? nameEl.innerText.trim() : "";

                // 获取简介 (尝试多个可能的 B 站选择器)
                const descEl = document.querySelector('.pure-text') ||
                      document.querySelector('.h-sign') ||
                      document.querySelector('.user-description');
                let description = "";
                if (descEl) {
                    description = descEl.getAttribute('title') || descEl.innerText.trim();
                }

                // 获取头像并处理高清图
                const avatarImg = document.querySelector('.avatar img') ||
                      document.querySelector('.h-avatar img') ||
                      document.querySelector('.b-avatar img');
                let avatarUrl = "";
                if (avatarImg) {
                    // 去掉 @ 后缀获取原图，补全 https 协议
                    avatarUrl = avatarImg.src.split('@')[0];
                    if (avatarUrl.startsWith('//')) avatarUrl = 'https:' + avatarUrl;
                }

                // 构造 Bangumi 兼容的数据对象
                const data = {
                    name: username,
                    engName: '',
                    kana: '',
                    aliases: [],
                    birthdate: '',
                    bloodtype: '',
                    websites: [{ title: 'Bilibili', url: window.location.href }],
                    twitter: '', 
                    // 转换头像为 Base64 (复用你代码中的 fetchImg)
                    avatarBase64: avatarUrl ? await fetchImg(avatarUrl) : '',
                    summary: description,
                    fromSNS: true
                };
                // 存储数据并跳转
                GM_setValue('vgmdb_to_bgm_data', data);
                window.open('https://bgm.tv/person/new', '_blank');
            } catch (e) {
                console.error("B站抓取失败:", e);
                alert("抓取信息失败，请重试。");
            }
        }

        // 2. 注入按钮到 B 站页面 (勋章容器处)
        const injectBiliBtn = () => {
            if (document.getElementById('vgm-bili-btn')) return;

            // 寻找注入点，B 站等级容器通常比较稳定
            const levelIcon = document.querySelector('.level-icon') ||
                  document.querySelector('.level');
            if (levelIcon) {
                const btn = document.createElement('button');
                btn.id = 'vgm-bili-btn';
                btn.innerText = '🚀 导入到 Bangumi';
                const originalText = btn.innerText;
                // 使用你的通用按钮样式类名
                btn.className = 'vgm-btn';
                // 兼容你之前的行内样式以便快速调整
                btn.style = `
            margin-left: 12px;
            padding: 0 12px;
            height: 24px;
            line-height: 24px;
            background-color: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            transition: background-color 0.2s;
        `;

                btn.onclick = (e) => {
                    btn.innerHTML = '⌛ 提取中...';
                    e.preventDefault();
                    e.stopPropagation();
                    collectBilibiliData();
                    btn.innerText = '✅ 提取成功';

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = "#e84566";
                    }, 3000);
                };

                // 2. 关键操作：将按钮插入到等级图标的“后面”
                // 如果 levelIcon 的父级是 <a> 标签，我们插在 <a> 后面；如果是图标本身，则插在图标后面
                const anchorTag = levelIcon.closest('a.level');
                if (anchorTag) {
                    anchorTag.parentNode.insertBefore(btn, anchorTag.nextSibling);
                } else {
                    levelIcon.parentNode.insertBefore(btn, levelIcon.nextSibling);
                }


            }
        };

        // 建议：由于 B 站是单页应用，可能需要定时检查或使用 MutationObserver
        setInterval(injectBiliBtn, 1000);

        // 使用观察者处理 SPA 跳转
        const observer = new MutationObserver((mutations) => {
            injectBiliBtn();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ================= YouTube 提取端 =================
    else if (location.hostname.includes('youtube.com')) {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // --- 抓取主逻辑 ---
        async function fullScrapeProcess(btn) {
            const moreBtn = document.querySelector('.ytDescriptionPreviewViewModelHost') ||
                  document.querySelector('.yt-truncated-text__absolute-button');

            if (!moreBtn) {
                alert("未能找到频道简介按钮，请确保在频道主页。");
                return;
            }

            btn.innerText = '⌛ 提取中...';
            moreBtn.click(); // 展开面板

            await sleep(800); // 等待面板弹出

            const data = await scrapeData();

            // 关闭面板
            const closeBtn = document.querySelector('#visibility-button button[aria-label="关闭"]');
            if (closeBtn) closeBtn.click();

            btn.innerText = '✅ 提取成功';
            console.log("抓取数据结果:", data);
            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
            setTimeout(() => { btn.innerText = '🚀 导入到 Bangumi'; }, 2000);
        }

        async function scrapeData() {
            const data = {
                name: document.querySelector('meta[property="og:title"]')?.content || "",
                summary: document.querySelector('meta[property="og:description"]')?.content || "",
                websites: [],
                birthdate: '',
                bloodtype: '',
                twitter: '',
                PixivID: '',
                avatarBase64: '',
                fromSNS: true
            };

            // 头像
            const metaImage = document.querySelector('meta[property="og:image"]');
            if (metaImage) data.avatarBase64 = await fetchImg(metaImage.content);

            // 外链
            data.websites.push({ title: 'YouTube', url: window.location.href }); // 填充YouTube链接
            document.querySelectorAll('yt-channel-external-link-view-model').forEach(item => {
                const title = item.querySelector('.ytChannelExternalLinkViewModelTitle')?.innerText.trim();
                const anchor = item.querySelector('a');

                if (anchor) {
                    const realUrl = new URL(anchor.href).searchParams.get('q') || anchor.href;

                    // 1. 处理 Twitter / X (获取 @用户名)
                    if (realUrl.includes('twitter.com/') || realUrl.includes('x.com/')) {
                        // 排除掉没有用户名的情况（如主页链接），提取路径最后一部分
                        const twitterHandle = realUrl.split('/').filter(part => part).pop();
                        if (twitterHandle && twitterHandle !== 'twitter.com' && twitterHandle !== 'x.com') {
                            data.twitter = '@' + twitterHandle;
                        }
                        return; // 跳过添加进 websites
                    }

                    // 2. 处理 Pixiv (获取 ID)
                    if (realUrl.includes('pixiv.net/users/')) {
                        const pixivMatch = realUrl.match(/users\/(\    d+)/);
                        if (pixivMatch && pixivMatch[1]) {
                            data.PixivID = pixivMatch[1];
                        }
                        return; // 跳过添加进 websites
                    }

                    // 3. 普通网站，排除后存入 websites
                    data.websites.push({ title, url: realUrl });
                }
            });
            return data;
        }
        function injectButton() {
            // 检查 ID，防止重复注入
            if (document.getElementById('yt-scraper-btn')) return;

            const subscribeContainer = document.querySelector('yt-subscribe-button-view-model');
            if (!subscribeContainer) return;

            const actionWrapper = subscribeContainer.closest('.ytFlexibleActionsViewModelAction');
            // 如果找不到 actionWrapper，尝试直接在 subscribeContainer 后面插入
            const targetNode = actionWrapper || subscribeContainer;
            if (!targetNode.parentNode) return;

            const wrapper = document.createElement('span');
            wrapper.id = 'yt-scraper-wrapper'; // 给容器也加个 ID 方便管理
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.verticalAlign = 'middle';
            wrapper.style.gap = '10px';
            wrapper.style.marginLeft = '8px'; // 补充左边距

            const btn = document.createElement('button');
            btn.id = 'yt-scraper-btn'; // 【核心修复】加上 ID
            btn.textContent = '🚀 导入到 Bangumi';

            // 样式部分保持不变...
            Object.assign(btn.style, {
                height: '36px',
                padding: '0 16px',
                borderRadius: '18px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#f1f1f1',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            });

            btn.onmouseover = () => btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            btn.onmouseout = () => btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            btn.onclick = () => fullScrapeProcess(btn);

            // 辅助函数
            function createCheckbox(id, text) {
                const label = document.createElement('label');
                label.style = "font-size: 12px; color: #aaa; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap;";
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = id;
                input.style.marginRight = '3px';
                label.appendChild(input);
                label.appendChild(document.createTextNode(text));
                return label;
            }

            wrapper.appendChild(btn);
            wrapper.appendChild(createCheckbox('vgm_skip_links', '不填充链接'));
            wrapper.appendChild(createCheckbox('vgm_skip_summary', '不填充简介'));

            // 执行插入
            targetNode.parentNode.insertBefore(wrapper, targetNode.nextSibling);
            console.log("提取按钮已成功注入");
        }

        // --- 监听 YouTube 页面切换 ---
        // YouTube 是 SPA，需要频繁检测 DOM
        const observer = new MutationObserver(() => {
            if (window.location.pathname.includes('@')) {
                injectButton();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

    }

    // ================= Niconico 提取端 =================
    else if (location.hostname.includes('nicovideo.jp')) {
        const BUTTON_ID = 'nico-scraper-btn';
        // 2. 核心抓取函数
        async function scrapeNicoData() {
            const data = {
                name: '',
                engName: '',
                kana: '',
                aliases: [],
                birthdate: '',
                bloodtype: '',
                websites: [],
                twitter: '',
                nodes: '',
                avatarBase64: '',
                summary: '',
                isIllustrator: false,
                PixivID: '',
                fromSNS: true
            };

            const skipLinks = document.getElementById('nico_skip_links')?.checked;
            const skipSummary = document.getElementById('nico_skip_summary')?.checked;

            // --- 抓取姓名 ---
            const nameNode = document.querySelector('.UserDetailsHeader-nickname');
            if (nameNode) {
                data.name = nameNode.innerText.trim();
                // data.engName = data.name;
            }

            // --- 抓取简介 (支持折叠状态) ---
            // 优先从已有的隐藏节点提取完整文本，如果没有则取折叠状态文本
            if (!skipSummary) {
                const expandedNode = document.querySelector('.ExpandBox-expanded');
                const collapsedNode = document.querySelector('.ExpandBox-collapsed');


                // 即使是折叠的，ExpandBox-expanded 往往也包含完整的 HTML
                if (expandedNode) {
                    data.summary = expandedNode.innerText.trim();
                } else if (collapsedNode) {
                    data.summary = collapsedNode.innerText.trim();
                }

                // 提取简介中的 URL (包括 A 标签中的 href 和文本中的链接)
                if (expandedNode) {
                    const links = expandedNode.querySelectorAll('a');
                    links.forEach(a => processLink(a.href, data));
                }
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const foundUrls = data.summary.match(urlRegex) || [];
                foundUrls.forEach(url => processLink(url, data));
            }

            // --- 抓取头像 ---
            const avatarNode = document.querySelector('.UserIcon-image');
            if (avatarNode) {
                const bgImg = window.getComputedStyle(avatarNode).backgroundImage;
                const imgUrl = bgImg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                if (imgUrl && imgUrl !== 'none') {
                    data.avatarBase64 = await fetchImg(imgUrl);
                }
            }

            // --- 抓取 SNS 链接区域 ---
            if (!skipLinks) {
                const snsLinks = document.querySelectorAll('.UserDetailsHeader-snsLink');
                snsLinks.forEach(link => processLink(link.href, data));
            }

            console.log("抓取完成:", data);
            // alert("数据已抓取，请查看控制台 (F12)");
            return data;
        }

        // 3. 链接分类处理逻辑
        function processLink(realUrl, data) {
            if (!realUrl || realUrl.startsWith('javascript:')) return;

            // 处理 Twitter / X
            if (realUrl.includes('twitter.com/') || realUrl.includes('x.com/')) {
                const parts = realUrl.split('/').filter(p => p);
                const twitterHandle = parts.pop().split('?')[0];
                if (twitterHandle && !['twitter.com', 'x.com', 'intent', 'share'].includes(twitterHandle)) {
                    data.twitter = '@' + twitterHandle;
                }
                return;
            }

            let title = "Website";
            if (realUrl.includes('youtube.com/') || realUrl.includes('youtu.be/')) title = "YouTube";
            else if (realUrl.includes('instagram.com/')) title = "Instagram";
            else if (realUrl.includes('facebook.com/')) title = "Facebook";
            else if (realUrl.includes('pixiv.net/')) {
                title = "Pixiv";
                const pixivMatch = realUrl.match(/users\/(\d+)/);
                if (pixivMatch) data.PixivID = pixivMatch[1];
            }

            const exists = data.websites.some(item => item.url === realUrl);
            if (!exists) data.websites.push({ title: title, url: realUrl });

            GM_setValue('vgmdb_to_bgm_data', data);
            window.open('https://bgm.tv/person/new', '_blank');
        }

        // 4. 注入按钮 (增加防重逻辑)
        // const BUTTON_ID = 'nico-scraper-btn';
        const WRAPPER_ID = 'nico-scraper-wrapper';

        function injectButton() {
            const target = document.querySelector('.UserDetailsHeader-buttons');
            // 1. 检查包装容器是否存在，防止重复注入
            if (!target || document.getElementById(WRAPPER_ID)) return;

            // 2. 创建包装容器
            const wrapper = document.createElement('span');
            wrapper.id = WRAPPER_ID;
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.verticalAlign = 'middle';
            wrapper.style.gap = '12px';
            wrapper.style.marginLeft = '8px';

            // 3. 创建抓取按钮
            const btn = document.createElement('button');
            btn.id = BUTTON_ID;
            btn.innerHTML = '抓取信息';
            btn.style.cssText = `
        padding: 0 16px;
        height: 32px;
        background-color: #252525;
        color: white;
        border: none;
        border-radius: 16px;
        font-weight: bold;
        cursor: pointer;
        font-size: 12px;
        white-space: nowrap;
    `;

            btn.onclick = async (e) => {
                e.preventDefault();
                btn.innerText = '正在抓取...';
                btn.disabled = true;
                try {
                    await scrapeNicoData(); // 注意：scrapeNicoData 内部需读取复选框状态
                    btn.innerText = '抓取成功';
                } catch (err) {
                    btn.innerText = '抓取失败';
                } finally {
                    btn.disabled = false;
                    setTimeout(() => { btn.innerText = '抓取信息'; }, 2000);
                }
            };

            // 4. 创建复选框的辅助函数
            function createCheckbox(id, text) {
                const label = document.createElement('label');
                label.style = "font-size: 12px; color: #666; cursor: pointer; display: inline-flex; align-items: center; white-space: nowrap;";

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = id;
                input.style.marginRight = '4px';
                input.style.cursor = 'pointer';

                label.appendChild(input);
                label.appendChild(document.createTextNode(text));
                return label;
            }

            // 5. 组装并插入
            wrapper.appendChild(btn);
            wrapper.appendChild(createCheckbox('nico_skip_links', '不填充链接'));
            wrapper.appendChild(createCheckbox('nico_skip_summary', '不填充简介'));

            // 使用 append 确保插入到容器的最末尾（最右边）
            target.appendChild(wrapper);
        }

        // 5. 监听与防抖
        let timeoutTimer = null;
        const observer = new MutationObserver((mutations) => {
            // 性能优化：只在确实有节点增减时才触发检查
            const shouldCheck = mutations.some(m => m.addedNodes.length > 0);
            if (shouldCheck) {
                if (timeoutTimer) clearTimeout(timeoutTimer);
                timeoutTimer = setTimeout(injectButton, 300);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        injectButton();

    }

    // ================= Pixiv 提取端 =================
    else if (location.hostname.includes('pixiv.net')) {

        // --- 信息提取 ---
        async function extractData() {
            try {
                // 1. 定位主信息区块 (这是关键，防止抓到导航栏)
                const nameHeading = document.querySelector('h1');
                if (!nameHeading) return;

                // 向上寻找包含头像和名字的共同大容器 (对应您提供的 sc-70a37843-2)
                const profileMainBlock = nameHeading.closest('div[class*="fOjlKC"]') || nameHeading.closest('header') || document.body;

                // 2. 抓取头像：仅在主区块内寻找 img
                const avatarImg = profileMainBlock.querySelector('div[role="img"] img');
                const avatarSrc = avatarImg ? avatarImg.src : "";

                // 3. PID (从URL获取)
                const pid = window.location.href.match(/users\/(\d+)/)?.[1] || "Unknown";

                // 4. 名字与简介
                const name = nameHeading.innerText.trim();
                const introEl = document.querySelector('div[class*="ipHwGd"]') || document.querySelector('.sc-ecb57f7a-3');
                const intro = introEl ? introEl.innerText.trim() : "未填写简介";

                // 5. 链接处理
                let xUser = "";
                let links = [];
                const linkNodes = document.querySelectorAll('ul li a[href*="jump.php"]');
                linkNodes.forEach(a => {
                    try {
                        let decodedUrl = decodeURIComponent(a.href.split('url=')[1]);

                        if (decodedUrl) {
                            // 1. 自动补全 http/https 前缀
                            if (!/^https?:\/\//i.test(decodedUrl)) {
                                decodedUrl = 'https://' + decodedUrl;
                            }
                            const isTwitter = decodedUrl.includes('twitter.com/') || decodedUrl.includes('x.com/');

                            if (isTwitter) {
                                // 如果是 Twitter，仅提取 ID，不放入 External Links
                                const match = decodedUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?\s]+)/);
                                if (match) xUser = `@${match[1]}`;
                            } else {
                                // 如果不是 Twitter，才放入外部链接列表
                                links.push({ title: 'HP', url: decodedUrl });
                            }
                        }
                    }catch(e) {
                        console.error("链接解析失败", e);
                    }
                });

                // 6. 转换头像为安全显示格式
                let avatarBase64 = "";
                if (avatarSrc && typeof fetchImg === 'function') {
                    // 必须 await，否则程序会直接跳过图片抓取去执行 GM_setValue
                    avatarBase64 = await fetchImg(avatarSrc);
                }

                const data = {
                    name: name,
                    engName: '',
                    kana: '',
                    aliases: [],
                    birthdate: '',
                    bloodtype: '',
                    websites: links,
                    twitter: xUser,
                    avatarBase64: avatarBase64,
                    summary: intro,
                    isIllustrator: true,
                    PixivID: pid
                };

                GM_setValue('vgmdb_to_bgm_data', data);
                window.open('https://bgm.tv/person/new', '_blank');
            } catch (e) {
                console.error("Pixiv抓取失败:", e);
                alert("抓取信息失败，请重试。");
            }
        }

        // ---- 注入按钮Pixiv ----
        const injectPixivBtn = () => {
            if (document.getElementById('vgm-pixiv-btn')) return;
            const h1 = document.querySelector('h1');
            if (h1) {
                const btn = document.createElement('button');
                btn.id = 'vgm-pixiv-btn';
                btn.innerText = '🚀 导入到 Bangumi';
                const originalText = btn.innerText;
                btn.onclick = (e) => {
                    e.preventDefault();
                    btn.innerHTML = '⌛ 提取中...';
                    extractData();
                    btn.innerText = '✅ 提取成功';
                };
                // 插入到名字所在行的末尾
                h1.parentElement.style.display = 'flex';
                h1.parentElement.style.alignItems = 'center';
                h1.parentElement.appendChild(btn);

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = "#e84566";
                }, 3000);
            }


        }

        // 处理 Pixiv 的单页路由跳转
        const observer = new MutationObserver(injectPixivBtn);
        observer.observe(document.body, { childList: true, subtree: true });
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
            if (!data.fromSNS) {
                const roleMap = {
                    'isOrgOrProducer': 'crtProProducer',
                    'isArtist': 'crtProArtist',
                    'isIllustrator': 'crtProIllustrator',
                };

                // 遍历映射表，只要 data 里的对应属性为 true，就勾选对应的框
                Object.keys(roleMap).forEach(key => {
                    if (data[key]) {
                        const el = document.getElementById(roleMap[key]);
                        if (el && !el.checked) el.click();
                    }
                });
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
${data.PixivID ? '|Pixiv= id='+data.PixivID : ''}
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
                // 还原为 Wiki 模式
                const wikiModeBtn = document.querySelector('a[onclick="NormaltoWCODE()"]');
                if (wikiModeBtn) { wikiModeBtn.click(); await sleep(500); }

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

    // 原图片抓取，测试用
    //     async function fetchImg(url) {
    //         return new Promise((res) => {
    //             GM_xmlhttpRequest({
    //                 method: "GET",
    //                 url: url,
    //                 responseType: "blob",
    //                 onload: (r) => {
    //                     const f = new FileReader();
    //                     f.onloadend = () => res(f.result);
    //                     f.readAsDataURL(r.response);
    //                 }});
    //         });
    //     }

    // 图片抓取
    async function fetchImg(url) {
        // 自动根据当前页面生成 Referer
        const currentOrigin = window.location.origin + '/';

        return new Promise((res) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    // 动态适配：当前在哪个站，Referer 就填哪个站
                    "Referer": currentOrigin,
                    "Cache-Control": "max-age=0",
                },
                responseType: "blob",
                onload: (r) => {
                    const f = new FileReader();
                    f.onloadend = () => res(f.result);
                    f.readAsDataURL(r.response);
                },
                onerror: () => res("")
            });
        });
    }

    // 还原短链接的函数
    async function unshortenUrl(url) {
        const currentOrigin = window.location.origin + '/';
        if (!url.includes('t.cn')) return url; // 如果不是短链接则直接返回

        return new Promise((res) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                anonymous: true,
                headers: {
                    "Referer": currentOrigin,
                    "Cache-Control": "no-cache",
                },
                onload: (r) => {
                    // GM_xmlhttpRequest 会自动跟随重定向，r.finalUrl 就是最终地址
                    res(r.finalUrl || url);
                },
                onerror: () => res(url)
            });
        });
    }

    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) { clearInterval(timer); resolve(el); }
            }, 500);
        });
    };

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
})();
