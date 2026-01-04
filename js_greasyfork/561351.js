// ==UserScript==
// @name         HHCLUB 合集打包辅助脚本
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  从详情页提取标题、链接、海报、截图、参数和标签，自动跳转并填入发布页，辅助打包分集。默认勾选匿名和完结标签。
// @author       kk
// @match        *://hhanclub.top/details.php*
// @match        *://hhanclub.top/upload.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561351/HHCLUB%20%E5%90%88%E9%9B%86%E6%89%93%E5%8C%85%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561351/HHCLUB%20%E5%90%88%E9%9B%86%E6%89%93%E5%8C%85%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("HHCLUB 脚本已启动 - 正在检查页面...");

    // 样式美化
    GM_addStyle(`
        #pt-helper-box {
            position: fixed;
            top: 150px;
            left: 20px;
            z-index: 99999; /* 提高层级 */
            background: #fff;
            border: 1px solid #CDAE9C;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 160px;
        }
        #pt-helper-box button {
            display: block;
            width: 100%;
            margin-bottom: 5px;
            padding: 8px 10px;
            background-color: #F29D38;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
        }
        #pt-helper-box button:hover {
            background-color: #d88622;
        }
        .pt-helper-msg {
            font-size: 12px;
            color: green;
            margin-top: 5px;
            text-align: center;
        }
    `);

    const currentUrl = window.location.href;

    // --- 修复报错的核心代码 ---
    try {
        if (typeof unsafeWindow !== 'undefined' && !unsafeWindow.displaySelector) {
            unsafeWindow.displaySelector = function() { console.log('Mock displaySelector called'); };
        }
    } catch(e) {
        console.warn('Failed to mock displaySelector', e);
    }

    // 工具函数
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function cleanKey(text) {
        if (!text) return "";
        return text.replace(/[\s\u00A0:：]/g, "");
    }

    function cleanValue(text) {
        if (!text) return "";
        return text.replace(/[\u00A0]/g, ' ').trim();
    }

    // 主逻辑 - 确保 DOM 加载后执行
    $(document).ready(function() {
        console.log("DOM 就绪，开始渲染 UI...");

        // ==========================================
        // 场景 1: 种子详情页 (提取数据)
        // ==========================================
        if (currentUrl.includes('details.php')) {
            console.log("检测到详情页");
            
            // 检查是否已经存在，防止重复添加
            if ($('#pt-helper-box').length > 0) return;

            const box = $(`<div id="pt-helper-box">
                <div style="font-weight:bold;margin-bottom:8px;color:#CDAE9C;text-align:center;">合集打包助手</div>
                <button id="btn-copy">🚀 复制并新开页</button>
                <div class="pt-helper-msg" id="msg-box"></div>
            </div>`);
            
            $('body').append(box);
            console.log("详情页按钮已添加");

            $('#btn-copy').click(function() {
                try {
                    console.log("=== 开始提取数据 ===");

                    // 1. 基础文本
                    let title = "";
                    let titleEl = getElementByXpath("//div[contains(text(), '标题') and contains(@class, 'font-bold')]/following-sibling::div[1]");
                    if(titleEl) title = titleEl.innerText.trim();

                    let subtitle = "";
                    let subEl = getElementByXpath("//div[contains(text(), '副标题') and contains(@class, 'font-bold')]/following-sibling::div[1]");
                    if(subEl) subtitle = subEl.innerText.trim();

                    // 2. 链接
                    let imdbUrl = $('a[href*="imdb.com/title"]').first().attr('href') || "";
                    let doubanUrl = $('a[href*="movie.douban.com/subject"]').first().attr('href') || "";
                    
                    // 3. 图片
                    let posterUrl = $('#cover-content').attr('src') || "";
                    let screenshotUrls = [];
                    $('#screenshot-content img').each(function() {
                        let src = $(this).attr('src');
                        if (src) screenshotUrls.push(src);
                    });
                    let screenshotStr = screenshotUrls.join(',');

                    // 4. Mediainfo
                    let mediainfo = "";
                    let rawCode = $('#mediainfo-raw pre code');
                    if (rawCode.length > 0) {
                        mediainfo = rawCode.text();
                    } else {
                        let rawPre = $('#mediainfo-raw pre');
                        if (rawPre.length > 0) {
                            mediainfo = rawPre.text();
                        } else {
                            mediainfo = $('#mediainfo-info').text();
                        }
                    }

                    // 5. 规格参数
                    let metaData = {};
                    let basicInfoTitle = getElementByXpath("//div[contains(text(), '基本信息') and contains(@class, 'font-bold')]");
                    if (basicInfoTitle) {
                        let grid = $(basicInfoTitle).nextAll('.grid').first();
                        if (grid.length) {
                            grid.find('> div').each(function() {
                                let spans = $(this).find('span');
                                if (spans.length >= 2) {
                                    let rawKey = $(spans[0]).text();
                                    let rawValue = $(spans[1]).text();
                                    if ($(spans[1]).children().length > 0) rawValue = $(spans[1]).text();
                                    
                                    let key = cleanKey(rawKey); 
                                    let value = cleanValue(rawValue);
                                    if (key && value) metaData[key] = value;
                                }
                            });
                        }
                    }
                    console.log("提取到的规格:", metaData);

                    // 6. 标签
                    let tags = [];
                    let tagTitle = getElementByXpath("//div[contains(text(), '标签') and contains(@class, 'font-bold')]");
                    if (tagTitle) {
                        let tagContainer = $(tagTitle).nextAll('div').first();
                        if (tagContainer.length) {
                            tagContainer.find('span').each(function() {
                                 let t = $(this).text().trim();
                                 if(t) tags.push(t);
                            });
                        }
                    }
                    console.log("提取到的标签:", tags);

                    // 7. 保存并跳转
                    const data = {
                        title, subtitle, imdbUrl, doubanUrl, posterUrl, screenshotStr, mediainfo, meta: metaData, tags
                    };

                    GM_setValue('hh_pack_data', data);
                    GM_setValue('hh_autofill_active', true);

                    $('#msg-box').text('✅ 复制成功').show();
                    
                    setTimeout(() => {
                        window.open('upload.php', '_blank');
                    }, 500);

                } catch (e) {
                    console.error("提取出错:", e);
                    $('#msg-box').text('❌ 出错: ' + e.message).css('color', 'red').show();
                }
            });
        }

        // ==========================================
        // 场景 2: 发布页 (填充数据)
        // ==========================================
        else if (currentUrl.includes('upload.php')) {
            console.log("检测到发布页");
            
            if ($('#pt-helper-box').length > 0) return;

            const box = $(`<div id="pt-helper-box">
                <div style="font-weight:bold;margin-bottom:8px;color:#CDAE9C;text-align:center;">合集打包助手</div>
                <button id="btn-paste">📋 手动填写</button>
                <div class="pt-helper-msg" id="msg-box"></div>
            </div>`);
            $('body').append(box);
            console.log("发布页按钮已添加");

            // 原生事件触发函数
            function triggerNativeChange(element) {
                if (!element) return;
                try {
                    const evt = new Event('change', { bubbles: true, cancelable: true });
                    element.dispatchEvent(evt);
                } catch (e) {
                    console.warn('Native Trigger Error:', e);
                }
            }

            // 模糊匹配并选择 Select 选项
            function selectOptionByText(selectSelector, textToMatch) {
                if (!textToMatch) return;
                let $select = $(`${selectSelector}:visible`).first();
                if ($select.length === 0) $select = $(selectSelector).first();
                
                if ($select.length === 0) {
                    console.log(`[Select Not Found] ${selectSelector}`);
                    return;
                }

                let found = false;
                let target = textToMatch.trim().toLowerCase();

                $select.find('option').each(function() {
                    let optText = $(this).text().trim();
                    let optTextLower = optText.toLowerCase();
                    let optVal = $(this).val();
                    
                    if (optVal == "0" || optVal == "") return;

                    if (optText === textToMatch || 
                        optTextLower === target ||
                        (target.includes(optTextLower) && optTextLower.length > 1) || 
                        (optTextLower.includes(target) && target.length > 1)) {
                        
                        $select[0].value = optVal;
                        triggerNativeChange($select[0]);
                        
                        console.log(`✅ 选中 [${selectSelector}]: ${optText} (Value: ${optVal})`);
                        found = true;
                        return false; 
                    }
                });
                
                if (!found) console.warn(`⚠️ 未找到选项 [${selectSelector}] 目标: "${textToMatch}"`);
            }

            // 点击标签按钮
            function clickTagButton(tagText) {
                if (!tagText) return;
                let cleanTag = tagText.trim();
                let found = false;
                
                $('.tags button').each(function() {
                    let btnText = $(this).text().trim();
                    if (btnText === cleanTag || btnText.includes(cleanTag) || cleanTag.includes(btnText)) {
                        if (!$(this).hasClass('checked-tag')) {
                            $(this).click();
                            console.log(`✅ 勾选标签: ${btnText}`);
                        }
                        found = true;
                    }
                });
                if (!found) console.warn(`⚠️ 未找到标签按钮: "${cleanTag}"`);
            }

            function fillFormData() {
                const data = GM_getValue('hh_pack_data');
                if (!data) return false;

                try {
                    console.log("=== 开始填充数据 ===", data);

                    // 1. 文本框
                    if(data.title) $('input[name="name"]').val(data.title);
                    if(data.subtitle) $('input[name="small_descr"]').val(data.subtitle);
                    
                    let genLink = data.imdbUrl || data.doubanUrl;
                    $('input[name="url"]').val(data.imdbUrl || "");
                    $('input[name="pt_gen"]').val(genLink);

                    if(data.posterUrl) $('input[name="cover"]').val(data.posterUrl);
                    if(data.screenshotStr) $('input[name="screenshot"]').val(data.screenshotStr);
                    if(data.mediainfo) $('textarea[name="technical_info"]').val(data.mediainfo);

                    // 2. 自动勾选 匿名发布 - 是
                    let $anonYes = $('input[name="uplver"][value="yes"]');
                    if ($anonYes.length > 0) {
                        $anonYes.click(); // 点击单选框以触发相关事件
                        console.log("✅ 自动勾选匿名发布: 是");
                    }

                    // 3. 规格参数
                    if (data.meta) {
                        if (data.meta['类型']) selectOptionByText('#browsecat', data.meta['类型']);

                        setTimeout(() => {
                            console.log("--- 填充质量下拉菜单 ---");
                            if (data.meta['来源']) selectOptionByText('select[name^="source_sel"]', data.meta['来源']);
                            if (data.meta['媒介']) selectOptionByText('select[name^="medium_sel"]', data.meta['媒介']);
                            if (data.meta['编码']) selectOptionByText('select[name^="codec_sel"]', data.meta['编码']);
                            if (data.meta['音频编码']) selectOptionByText('select[name^="audiocodec_sel"]', data.meta['音频编码']);
                            if (data.meta['分辨率']) selectOptionByText('select[name^="standard_sel"]', data.meta['分辨率']);
                            if (data.meta['处理']) selectOptionByText('select[name^="processing_sel"]', data.meta['处理']);
                            if (data.meta['制作组']) selectOptionByText('select[name^="team_sel"]', data.meta['制作组']);
                        }, 1000);
                    }

                    // 4. 标签 (源种标签 + 强制完结)
                    setTimeout(() => {
                        console.log("--- 勾选标签 ---");
                        // 勾选源种子的标签
                        if (data.tags && data.tags.length > 0) {
                            data.tags.forEach(tag => {
                                clickTagButton(tag);
                            });
                        }
                        // 强制勾选“完结”标签
                        clickTagButton('完结');
                        
                    }, 1500);

                    $('#msg-box').text('✅ 填充完成').show().delay(3000).fadeOut();
                    return true;

                } catch (e) {
                    console.error("填充出错:", e);
                    $('#msg-box').text('❌ 填充出错: ' + e.message).css('color', 'red').show();
                    return false;
                }
            }

            $('#btn-paste').click(function() {
                fillFormData();
            });

            if (GM_getValue('hh_autofill_active')) {
                console.log("检测到自动填充标记，准备工作...");
                GM_setValue('hh_autofill_active', false);
                setTimeout(() => {
                    fillFormData();
                }, 1200);
            }
        }
    });
})();