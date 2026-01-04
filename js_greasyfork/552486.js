// ==UserScript==
// @name         ZMPT 游戏信息填充助手 (from PlayMAC)
// @namespace    https://zmpt.cc/
// @version      1.3.5
// @description  一键从 playmac.cc 抓取游戏信息并自动填充 ZMPT 的上传页面。
// @author       You
// @match        https://zmpt.cc/upload.php*
// @match        https://zmpt.cc/edit.php*
// @match        https://zmpt.club/upload.php*
// @match        https://zmpt.club/edit.php*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552486/ZMPT%20%E6%B8%B8%E6%88%8F%E4%BF%A1%E6%81%AF%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B%20%28from%20PlayMAC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552486/ZMPT%20%E6%B8%B8%E6%88%8F%E4%BF%A1%E6%81%AF%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B%20%28from%20PlayMAC%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 样式 ---
    GM_addStyle(`
        .custom-fetch-container { padding: 10px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; }
        #gameUrl { width: 500px; margin-right: 10px; }
        #fetchBtn { cursor: pointer; padding: 5px 15px; }
        #statusHelper { margin-top: 5px; font-weight: bold; color: #d9534f; }
    `);

    // --- HTML 转 BBCode 工具函数 ---
    function html2bb(str) {
        if (!str) return '';
        str = str.replace(/<strong.*?>(.*?)<\/strong>/gis, '[b]$1[/b]');
        str = str.replace(/<b.*?>(.*?)<\/b>/gis, '[b]$1[/b]');
        str = str.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, '[url=$1]$2[/url]');
        str = str.replace(/<h[2-5].*?>(.*?)<\/h[2-5]>/gi, (match, innerHtml) => `\n[b][size=4]${$('<div>').html(innerHtml).text()}[/size][/b]\n`);
        // str = str.replace(/<img.*?src="(.*?)".*?>/gi, '[img]$1[/img]');
        str = str.replace(/<img.*?src="(.*?)".*?>/gi, '[center][img]$1[/img][/center]');
        str = str.replace(/<br *\/*>/gi, '\n');
        str = str.replace(/<p.*?>/gi, '\n\n');
        str = str.replace(/<\/p>/gi, '');
        str = str.replace(/<div class="ri-alerts-shortcode">([\s\S]*?)<\/div>/gi, '$1');
        str = str.replace(/<\/?[^>]+(>|$)/g, '');
        str = str.replace(/&nbsp;/g, ' ');
        str = str.replace(/(\n\s*){3,}/g, '\n\n');
        return str.trim();
    }

    // --- 主逻辑 ---
    // 防止重复添加 UI
    if ($('#gameUrl').length === 0) {
        const ui = `
            <tr class="custom-fetch-container">
                <td class="rowhead">游戏页面URL</td>
                <td class="rowfollow">
                    <input type="text" id="gameUrl" placeholder="请在此处粘贴 playmac.cc 的游戏页面链接" />
                    <button type="button" id="fetchBtn">一键抓取</button>
                    <p id="statusHelper"></p>
                </td>
            </tr>
        `;
        $('input[name="small_descr"]').closest('tr').after(ui);
    }

    const $statusHelper = $('#statusHelper');
    const $fetchBtn = $('#fetchBtn');
    const $gameUrl = $('#gameUrl');

    $fetchBtn.on('click', function () {
        const url = $gameUrl.val();
        if (!url || !url.includes('playmac.cc')) {
            $statusHelper.text('请输入一个有效的 playmac.cc 游戏链接！');
            return;
        }
        $statusHelper.text('🚀 开始抓取页面信息...');
        $(this).prop('disabled', true).text('抓取中...');

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                try {
                    $statusHelper.text('📝 正在解析与填充...');
                    const html = response.responseText;
                    const $parsedHtml = $('<div></div>').html(html);

                    // 1. 抓取标题和侧边栏信息
                    const fullTitle = $parsedHtml.find('h1.post-title').text().trim();
                    let englishName = '', chineseName = '', version = '';

                    // 优先使用正则解析标题，更准确
                    const titleRegex = /(.*?)\s*Mac版\s*(.*?)\s*For Mac\s*(v[\d\.]+)/i;
                    const titleParts = fullTitle.match(titleRegex);

                    if (titleParts) {
                        chineseName = titleParts[1] ? titleParts[1].trim() : '';
                        englishName = titleParts[2] ? titleParts[2].trim() : '';
                        version = titleParts[3] ? titleParts[3].trim() : '';
                    } else {
                        // 正则匹配失败，使用旧的分割方法作为备用
                        if (fullTitle.includes('Mac版')) {
                            const parts = fullTitle.split('Mac版');
                            chineseName = parts[0].trim();
                            englishName = parts[1].split(/[｜|]/)[0].replace('For Mac', '').trim();
                        } else {
                            englishName = fullTitle;
                        }
                    }

                    // 提取DLC信息
                    let dlcInfo = '';
                    const dlcMatch = fullTitle.match(/(\d+\s*DLCs?|全DLC)/i);
                    if (dlcMatch && dlcMatch[1]) {
                        const dlcText = dlcMatch[1].toLowerCase().replace(/\s/g, '');
                        if (dlcText === '全dlc') {
                            dlcInfo = ' + ALL DLCs';
                        } else {
                            dlcInfo = ' + ' + dlcText.toUpperCase();
                        }
                    }

                    const $sidebarInfo = $parsedHtml.find('.ri-down-warp .list-group-flush li');
                    let chipSupportRaw = '', systemReq = '', language = '', distributionType = '';
                    $sidebarInfo.each(function () {
                        const text = $(this).text();
                        const value = $(this).find('span').last().text().trim();
                        if (text.includes('资源版本:')) {
                            if (!version) version = value; // 如果标题没取到版本号，就用侧边栏的
                        }
                        else if (text.includes('支持芯片:')) chipSupportRaw = value;
                        else if (text.includes('系统要求:')) systemReq = `macOS ${value.replace('>', '').replace('macOS', '').trim()} 以上`;
                        else if (text.includes('资源语言:')) language = value.replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
                        else if (text.includes('资源类型:')) distributionType = value;
                    });

                    // 新增：格式化芯片支持信息的辅助函数
                    function formatChipSupport(rawText) {
                        const supportsM = rawText.includes('M');
                        const supportsIntel = rawText.includes('Intel');
                        if (supportsM && supportsIntel) return 'Apple+Intel';
                        if (supportsM) return 'Apple Silicon';
                        if (supportsIntel) return 'Intel Core';
                        return 'Apple Silicon'; // 默认值
                    }
                    const chipSupportFormatted = formatChipSupport(chipSupportRaw);


                    // 2. 抓取主要内容 (这部分逻辑不变)
                    const $content = $parsedHtml.find('article.post-content');
                    const coverImageUrl = $content.find('img').first().attr('src');
                    const synopsis = html2bb($content.find('p').eq(1).html());

                    let notesSection = '';
                    const $notesHeader = $content.find('h2:contains("注意事项")');
                    if ($notesHeader.length) {
                        const $alertDiv = $notesHeader.next('div.ri-alerts-shortcode');
                        if ($alertDiv.length) {
                            const notesBB = html2bb($alertDiv.html());
                            if (notesBB) notesSection = `[center][b]注意事项[/b][/center]\n${notesBB}\n\n`;
                        }
                    }

                    let gameIntroBB = '';
                    const $gameIntroHeader = $content.find('h2:contains("游戏介绍")');
                    if ($gameIntroHeader.length) {
                        const $elements = $gameIntroHeader.nextUntil('h2, .entry-copyright');
                        gameIntroBB = html2bb($('<div>').append($elements.clone()).html());
                    }

                    let screenshotsBB = '';
                    const $screenshotsHeader = $content.find('h2:contains("实测截图")');
                    if ($screenshotsHeader.length) {
                        const $elements = $screenshotsHeader.nextUntil('h2, .entry-copyright');
                        screenshotsBB = html2bb($('<div>').append($elements.clone()).html());
                    }
                    // const gameContentBB = [gameIntroBB, screenshotsBB].filter(Boolean).join('\n\n');
                    const screenshotsBlock = screenshotsBB ? `[center][b]实测截图[/b][/center]\n${screenshotsBB}` : '';
                    const gameContentBB = gameIntroBB;
                    // 3. 组装最终描述
                    const finalMainTitle = `${englishName} For Mac ${version}${dlcInfo} ${chipSupportFormatted} -PlayMac`.replace(/\s+/g, ' ').trim();

                    const cleanDistributionType = distributionType.replace('解包', '').trim();
                    const finalSubTitle = `${chineseName} Mac版 ${language}${cleanDistributionType}`.replace(/\s+/g, ' ').trim();

                    const finalDescription = `[center][img]${coverImageUrl}[/img][/center]

[center][b]游戏简介[/b][/center]
${synopsis}

解压密码：[color=Red][b]playmac.cc[/b][/color]
[color=Black]芯片要求：${chipSupportFormatted}
系统要求：${systemReq}[/color]

${notesSection}${screenshotsBlock ? screenshotsBlock + '\n\n' : ''}[center][b]游戏内容[/b][/center]
${gameContentBB}

[color=Red][b]安装遇到问题：[/b][/color][color=Black]
[center][img]https://qimg.xiaohongshu.com/arkgoods/1040g3no31fd5kst9ls0g4buts16bukuptmar3h0[/img][/center]

如运行游戏碰到弹窗提示「xx已损坏，无法打开，您应该将它移到废纸婆」、「打不开xxx，因为 Apple 无法检查其是否包含恶意软件」、「打不开 xxx，因为它来自身份不明的开发者」等问题，通过下方方式修复:

[color=Red][b]90%以上的Mac游戏无法打开，都可以通过PlayMac提供的安装包里的"已损坏修复工具"进行一键修复[/b][/color]

[color=Black]双击打开安装包里的“已损坏修复“工具，输入开机密码后回车，自动修复完重新打开即可

[center][img]https://qimg.xiaohongshu.com/arkgoods/1040g3no31hpod7sc34eg4buts16bukupfnr74mo[/img][/center]

⚠️注意：
1.如果“已损坏修复”也弹窗报错，请打开「系统设置」->「隐私和安全性」->滑到底部点击「仍要打开」即可。
2.如果没有「仍要打开」选项，请通过下方教程，先开启“任何来源”安装权限！！
【教程：[url=https://docs.qq.com/aio/DRnZaU1hJZkZ2SWtK?p=oBRNLqGXMOHhezErCgWuQY]https://docs.qq.com/aio/DRnZaU1hJZkZ2SWtK?p=oBRNLqGXMOHhezErCgWuQY[/url]】
3.一种解决方法无法解决，请逐步尝试教程里的1-5种方式解决[/color]`;

                    // 4. 填充页面表单
                    $('input[name="name"]').val(finalMainTitle);
                    $('input[name="small_descr"]').val(finalSubTitle);
                    $('#descr').val(finalDescription);

                    // 触发 change 事件以加载后续选项
                    const typeSelectElement = $('select[name="type"]')[0];
                    if (typeSelectElement) {
                        typeSelectElement.value = '426';
                        const changeEvent = new Event('change', { bubbles: true });
                        typeSelectElement.dispatchEvent(changeEvent);
                    }

                    // 延迟执行，等待页面响应 change 事件
                    setTimeout(function () {
                        // 自动选择
                        $('select[name="team_sel[4]"]').val('13');

                        // 自动勾选
                        const tagSelectorPrefix = 'input[name^="tags["]';
                        $(tagSelectorPrefix + '[value="17"]').prop('checked', true); // 驻站
                        $(tagSelectorPrefix + '[value="1"]').prop('checked', true);  // 禁转
                        $(tagSelectorPrefix + '[value="2"]').prop('checked', true);  // 首发
                        $(tagSelectorPrefix + '[value="9"]').prop('checked', true);  // 原创

                        // 条件勾选 "中字"
                        const zhongziTag = $(tagSelectorPrefix + '[value="6"]');
                        if (language.includes('中')) {
                            zhongziTag.prop('checked', true);
                        } else {
                            zhongziTag.prop('checked', false);
                        }

                        // 勾选匿名
                        $('input[name="uplver"]').prop('checked', true);
                        $statusHelper.html('✅ 自动填充完成！请检查所有信息，然后选择种子文件即可发布。');
                    }, 100);

                } catch (error) {
                    console.error('在解析或填充时发生错误:', error);
                    $statusHelper.text('❌ 解析失败！请打开F12控制台查看详细错误。');
                } finally {
                    $fetchBtn.prop('disabled', false).text('一键抓取');
                }
            },
            onerror: function (error) {
                console.error('请求失败! 错误对象:', error);
                $statusHelper.text('❌ 抓取失败！请检查链接或网络。');
                $fetchBtn.prop('disabled', false).text('一键抓取');
            }
        });
    });
})();