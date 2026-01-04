// ==UserScript==
// @name         信学堂试题内容复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在考试页面添加按钮，提取试题并弹窗显示 + 复制到剪贴板
// @match        https://asiainfo.yunxuetang.cn/exam*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557195/%E4%BF%A1%E5%AD%A6%E5%A0%82%E8%AF%95%E9%A2%98%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/557195/%E4%BF%A1%E5%AD%A6%E5%A0%82%E8%AF%95%E9%A2%98%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 安全获取页面 jQuery（优先用页面自身的 jQuery）
    const $page = (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) ? unsafeWindow.jQuery : (window.jQuery || null);

    // 如果还没准备好 jQuery，则等待短时间再尝试（最多 10 次）
    function waitForJQuery(retries = 10, delay = 200) {
        return new Promise((resolve, reject) => {
            let n = 0;
            (function check() {
                const jq = (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) ? unsafeWindow.jQuery : (window.jQuery || null);
                if (jq) return resolve(jq);
                if (++n >= retries) return resolve(null);
                setTimeout(check, delay);
            })();
        });
    }

    // HTML 转义，安全写入新窗口
    function escapeHtml(s) {
        if (!s && s !== 0) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
    }

    // 复制到剪贴板：优先 GM_setClipboard，然后 navigator.clipboard, 最后 textarea 回退
    async function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
                return true;
            }
        } catch (e) {
            // ignore
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (e) {
                // fallback below
            }
        }

        // 回退 textarea + execCommand
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 在页面注入按钮
    function injectButton($) {
        if ($('#yxt-extract-btn').length) return;
        const btn = $('<button id="yxt-extract-btn" title="提取考试内容">导出试题</button>');
        const css = `
            #yxt-extract-btn{
                position: fixed;
                right: 16px;
                top: 16px;
                z-index: 99999;
                background:#2d8cf0;
                color:#fff;
                border: none;
                padding:8px 12px;
                border-radius:4px;
                cursor:pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                font-size:13px;
            }
            #yxt-extract-btn:hover{ background:#1677d6; }
        `;
        $('<style>').prop('type', 'text/css').html(css).appendTo('head');
        $('body').append(btn);
        btn.on('click', function () {
            try {
                const data = extractExam($);
                if (!data.items.length) {
                    alert('未找到试题内容，请在考试预览页确认已加载题目。');
                    return;
                }
                const html = buildHtmlView(data);
                // html = html + "<br/><br/><br/>直接显示序号+答案"
                // 打开 400x400 的窗口并写入
                //const w = window.open('', '_blank', 'width=400,height=400,scrollbars=yes,resizable=yes');
                //if (!w) {
                //    alert('弹窗被拦截，请允许弹窗或在浏览器地址栏右侧解除阻止，然后重试。');
                //    return;
                // }
                //w.document.open();
                //w.document.write(html);
               // w.document.close();

                // 复制纯文本到剪贴板
                const plain = buildPlainText(data) + "\n 直接显示序号+答案";

                console.log('复制纯文本到剪贴板:', plain);
                copyToClipboard(plain).then(success => {
                    if (success) {
                        alert('内容已复制到剪贴板');
                    } else {
                        alert('复制失败，请手动复制弹窗中的内容。');
                    }
                });
            } catch (err) {
                console.error('提取试题时发生错误', err);
                alert('提取出错，查看控制台获取更多信息。');
            }
        });
    }

    // 提取试题数据（题号、题型、题干、选项数组、分值等）
    function extractExam($) {
        const items = [];
        // 选择所有题目容器（页面结构中 li[name="li_Question"]）
        const $questions = $('li[name="li_Question"]');
        $questions.each(function (idx, el) {
            const $li = $(el);
            const qt = $li.attr('qt') || ''; // SingleChoice / MultiChoice / ...
            // 题号：尝试找到左侧数字
            let num = $li.find('.col-2 .text-info').first().text().trim();
            if (!num) num = (idx + 1) + '';
            // 题干：页面中题干通常放在第一个 style="overflow: auto;" 的 div 中
            let qtext = '';
            const $cands = $li.find('div').filter(function () {
                const s = $(this).attr('style') || '';
                return s.indexOf('overflow') !== -1 || $(this).hasClass('question-text') || $(this).hasClass('qtext');
            });
            if ($cands.length) qtext = $($cands.get(0)).text().trim();
            if (!qtext) {
                // 兜底：找第一个 ul 上方的文本节点
                qtext = $li.contents().filter(function () {
                    return this.nodeType === 3 && this.textContent.trim();
                }).text().trim();
            }

            // 选项：不少题目选项的可读文本位于 ul.upper-latin-list li span.text-normal
            const opts = [];
            $li.find('ul.upper-latin-list li span.text-normal').each(function () {
                opts.push($(this).text().trim());
            });

            // 如果没有从上面的列表找到选项，尝试从 label.btn-check 后面的文本（极端情况下）
            if (!opts.length) {
                $li.find('label.btn-check').each(function (i2) {
                    // label 里可能包含 <i></i>A 这种简短字母；尝试寻找紧接着的描述（邻近 ul）
                    const txt = $(this).text().trim();
                    if (txt) opts.push(txt);
                });
            }

            // 分值（可选）
            let points = '';
            const pts = $li.find('.sty_lbl_thispoints').first().text().trim();
            if (pts) points = pts;

            items.push({
                num: num,
                type: qt,
                question: qtext,
                options: opts,
                points: points
            });
        });

        return {
            count: items.length,
            items: items
        };
    }

    // 构建在新窗口中显示的 HTML（简单样式）
    function buildHtmlView(data) {
        const head = `
            <!doctype html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>试题导出（预览）</title>
              <style>
                body{font-family: Arial, "Microsoft Yahei", Helvetica, sans-serif; margin:12px; color:#222}
                h2{margin:0 0 12px 0; font-size:16px}
                .q{margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #eaeaea}
                .qnum{font-weight:700; margin-right:6px}
                .qtype{color:#888; font-size:12px; margin-left:6px}
                ol.opts{margin:6px 0 0 22px}
                ol.opts li{margin:4px 0}
              </style>
            </head>
            <body>
              <h2>导出的试题（共 ${data.count} 题）</h2>
        `;
        let body = '';
        data.items.forEach(it => {
            body += `<div class="q"><div><span class="qnum">${escapeHtml(it.num)}</span><span class="qtext">${escapeHtml(it.question)}</span>`;
            if (it.points) body += `<span class="qtype">（${escapeHtml(it.points)} 分）</span>`;
            if (it.type) body += `<span class="qtype">${escapeHtml('[' + it.type + ']')}</span>`;
            body += `</div>`;
            if (it.options && it.options.length) {
                body += `<ol class="opts" type="A">`;
                it.options.forEach(opt => {
                    body += `<li>${escapeHtml(opt)}</li>`;
                });
                body += `</ol>`;
            }
            body += `</div>`;
        });
        const foot = `</body></html>`;
        return head + body + foot;
    }

    // 构建纯文本版本以复制到剪贴板
    function buildPlainText(data) {
        const lines = [];
        data.items.forEach((it, idx) => {
            const num = it.num || (idx + 1);
            lines.push(`${num} ${it.type ? '[' + it.type + ']' : ''}`);
            lines.push(it.question || '');
            if (it.options && it.options.length) {
                it.options.forEach((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    lines.push(`  ${letter}. ${opt}`);
                });
            }
            if (it.points) lines.push(`分值：${it.points}`);
            lines.push(''); // 空行分隔
        });
        return lines.join("\n");
    }

    // 主流程
    (async function main() {
        const jq = await waitForJQuery();
        const $ = jq || window.jQuery || document.querySelectorAll.bind(document);
        if (!jq && !window.jQuery) {
            // 页面没有 jQuery，但是你要求使用 jQuery 语法；我们尽量用 document 方式或通知用户。
            console.warn('页面上未检测到 jQuery，脚本会尽量工作，但建议在页面中加载 jQuery。');
        }
        injectButton($);
    })();

})();