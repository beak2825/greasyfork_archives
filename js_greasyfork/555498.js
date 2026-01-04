// ==UserScript==
// @name         自定义打赏妖精
// @namespace    https://www.yaohuo.me
// @version      1.4
// @description  妖火自定义打赏妖精插件
// @license      MIT
// @author       人机@39874
// @match        *://*.yaohuo.me/bbs-*.html
// @grant        none
// @run-at       document-end
// @icon         data:image/png;base64,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
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/555498/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%89%93%E8%B5%8F%E5%A6%96%E7%B2%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/555498/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%89%93%E8%B5%8F%E5%A6%96%E7%B2%BE.meta.js
// ==/UserScript==

const config = window.rewardPageConfig

const input = `
<input class="custom-tips" id="custom-tips" placeholder="老C已限制最低101(税后100)" type="number" max="${config.currentUserBalance}" min="100"></input>
<p class="tips">打赏金额不会全额给到被打赏者，似乎会收1%左右的税，可恶的资本家</p>
`

const cssText = `
.aui-cell-box .custom-tips:is(input) {
    border: 1px solid #1abc9c;
    height: 40px;
    width: 91%;
    margin: 0 3% 3%;
    font-family: Arvo, serif;
}

.aui-cell-box .custom-tips:is(input)::placeholder {
    font-size: 14px;
}

.tips {
    color: #999999;
    text-align: center;
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 0;
    font-family: Arvo, serif;
}

#custom-give-btn{
    margin-bottom: 8px !important;
    display: block;
    margin: 0 auto;
    margin-top: .2rem;
    background: #1abc9c;
    color: #fff;
    padding: 8px 10px;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    border: none;
}
`;

(function () {
    'use strict';
    addStyle()

    $('.aui-grids').after(input)

    $(document).on('input', 'input.custom-tips', function () {
        let val = stringToInt($(this).val() || 0);
        $('#type-amount').html(`
            打赏<span id="bounty" class="space">${val}</span><span class="space"></span>妖晶
        `);
        $('#RewardCoins input[name="sendmoney"]').val(val);
        $(this).val(val)
    });

    $(document).on('focus', 'input.custom-tips', function () {
        $('.aui-grids-item').removeClass('this-card');
        $('#bounty').text($(this).val() || 0);
        $('#RewardCoins input[name="sendmoney"]').val(0);

        let $btn = $('#custom-give-btn');
        const $old = $('#RewardCoins .givebtn');
        if ($btn.length) {
            $btn.css('display', 'block');
            $old.css('display', 'none');
        } else {
            $btn = $old.clone(true, true)
                .attr('id', 'custom-give-btn')
                .css({'display': 'block', 'z-index': 39874});

            $old.css('display', 'none');

            $btn.insertAfter($old);
            $btn.bind('click', givBtnClick)
            $btn.removeClass('givebtn');
        }
    });

    $('.aui-grids-item').click(function () {
        $('#RewardCoins .givebtn').show()
        $('#custom-give-btn').hide();
        $('input.custom-tips').val(null);
    })
})();

function addStyle() {
    const s = document.createElement('style');
    s.textContent = cssText;
    document.head.appendChild(s);
}

function givBtnClick(e) {
    e.preventDefault()
    sendForm()
}

function stringToInt(str, defaultValue = 101) {
    if (typeof str !== 'string') return defaultValue;

    let num = parseFloat(str.trim());
    num = Number.isNaN(num) ? defaultValue : Math.trunc(num);

    if (num >= config.currentUserBalance) {
        return config.currentUserBalance
    }

    return num
}

function sendForm() {
    const rewardOverlayElement = document.getElementById('RewardCoins');
    const formElement = rewardOverlayElement.querySelector('form[name=send]');
    if (!formElement) {
        console.error('[Reward.js] 找不到打赏表单');
        return;
    }
    const formData = new FormData(formElement);
    const sendmoneyValue = formData.get('sendmoney');

    // 校验是否选择了金额
    if (!sendmoneyValue) {
        console.error('[Reward.js] 请选择打赏妖晶数量');
        showSelectAmountTip();
        return;
    }

    if (typeof config === 'undefined') {
        console.error('[Reward.js] rewardPageConfig 缺失，无法处理打赏。');
        showFailureTip('配置错误，无法打赏');
        return;
    }

    const sendmoney = parseInt(sendmoneyValue);
    const touserid = config.touserid;
    const myuserid = config.myuserid;
    const formActionUrl = config.formActionUrl;

    const updatedFormData = new FormData();

    for (const [key, value] of formData.entries()) {
        updatedFormData.append(key, value);
    }

    if (config.id) updatedFormData.set('id', config.id);
    if (config.classid) updatedFormData.set('classid', config.classid);
    if (config.siteid) updatedFormData.set('siteid', config.siteid);
    if (config.touserid) updatedFormData.set('touserid', config.touserid);
    if (config.myuserid) updatedFormData.set('myuserid', config.myuserid);

    updatedFormData.set('action', 'gomod');

    fetch(formActionUrl, {
        method: 'POST',
        body: updatedFormData // 使用更新后的FormData
    })
        .then(res => res.text()) // 将响应转为文本
        .then(html => handleRewardResponse(html, sendmoney, touserid, myuserid)) // 处理响应
        .catch(error => handleError(error)); // 处理错误
}