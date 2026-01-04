// ==UserScript==
// @name         Passwall点击测试flybird节点速度
// @namespace    http://tampermonkey.net/
// @version      2025-12-16
// @description  Passwall点击测试flybird节点速度，自用，请勿下载
// @author       Ray
// @match        http://*/cgi-bin/luci/admin/services/passwall/node_list
// @match        https://*/cgi-bin/luci/admin/services/passwall/node_list
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @resource     toastCSS https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557618/Passwall%E7%82%B9%E5%87%BB%E6%B5%8B%E8%AF%95flybird%E8%8A%82%E7%82%B9%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/557618/Passwall%E7%82%B9%E5%87%BB%E6%B5%8B%E8%AF%95flybird%E8%8A%82%E7%82%B9%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

// 国内建议使用下面三行
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @resource     toastCSS https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css

(function() {
    'use strict';
    const toastCSS = GM_getResourceText('toastCSS');
    GM_addStyle(toastCSS);

    jQuery(function ($) {
        var speedTested = false;

        function showToast(icon, text) {
            $.toast({
                text: text,
                heading: '提示',
                icon: icon,
                position : 'top-right'
            });
        }

        function checkResult(tds) {
            var $checkResult = window.setInterval(function() {
                var stopCheck = true;
                var currentTimestamp = null;
                var $currentTd = null;
                $(tds).each(function(i, $td) {
                    var str = $td.text().trim();
                    if (str === '') {
                        stopCheck = false;
                        return true;
                    }
                    if (str === '超时') return true;
                    var timestamp = parseFloat(str);
                    if (currentTimestamp === null) {
                        currentTimestamp = timestamp;
                        $currentTd = $td;
                    } else {
                        if (currentTimestamp > timestamp) {
                            currentTimestamp = timestamp;
                            $currentTd = $td;
                        }
                    }
                });
                if (stopCheck) {
                    var $tr = $currentTd.parent();
                    var str = $tr.find('td[data-name="remarks"]').text().trim();
                    const match = str.match(/SS：([^（）]+)/);
                    if (match) {
                        $.toast({
                            text: '当前最快节点是：'+ match[1],
                            heading: '结果',
                            icon: 'success',
                            hideAfter : false,
                            position : 'top-right'
                        });
                        $('#input_node_speed_test').after('<strong style="color: red;">当前最快节点：' + match[1] + '</strong>');
                    }
                    $tr.css('background', '#FF0000').css('color', 'white');
                    window.clearInterval($checkResult);
                }
            }, 1000);
        }

        function speedTest($btn) {
            if (speedTested) {
                window.location.reload();
                return false;
            }
            var $input = $('#input_node_speed_test');
            var keyword = $input.val();
            if (!keyword || keyword === '') {
                showToast('error', '请填写节点关键字！');
                return false;
            }
            var buttons = [];
            var tds = [];
            $('table.table.cbi-section-table').find('tr.tr.cbi-section-table-row').each(function(i, obj) {
                var remark = $(obj).find('td[data-name="remarks"]').text().trim();
                if (remark.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                    var $td = $(obj).find('td[data-name="_url_test"]');
                    tds.push($td);
                    buttons.push($td.find('input[value="可用性测试"]'));
                }
            });
            if (buttons.length === 0) {
                showToast('error', '没有查找到相关节点！');
                return false;
            }
            speedTested = true;
            showToast('info', '已开始每隔1秒点击按钮！');
            $btn.prop('disabled', true);
            $input.prop('disabled', true);
            window.setTimeout(function() {
                $btn.prop('disabled', false).text('刷新页面');
            }, 2000);
            $(buttons).each(function(i, obj) {
                var n = i + 1;
                window.setTimeout(function() {
                    $(obj).click();
                    if (buttons.length == n) {
                        showToast('info', '按钮点击完成，请等待测试结果！');
                        checkResult(tds);
                    }
                }, n * 1000);
            });
        }

        function insertButton() {
            var html = '<button type="button" class="btn cbi-button cbi-button-remove" id="btn_node_speed_test">一键测速</button>';
            html += '<input type="input" id="input_node_speed_test" value="Hong Kong" placeholder="节点关键字"/>';
            $('#cbi-passwall-global_other input[value="保存并应用"]').after(html);
            $('#btn_node_speed_test').click(function() {
                speedTest($(this));
                return false;
            });
        }

        $(document).ready(function() {
            insertButton();
        });
    });
})();