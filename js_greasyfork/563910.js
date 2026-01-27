// ==UserScript==
// @name         Steam 令牌验证器_悬浮球
// @namespace    https://keylol.com/t652195-1-1
// @version      0.8.9
// @description  支持自动填写 Steam 令牌验证码和批量确认交易与市场，为适配Steam Client添加了悬浮球
// @author       wave&sjx01
// @compatible   chrome >= 105
// @compatible   edge >= 105
// @compatible   firefox >= 121
// @compatible   opera >= 91
// @compatible   safari >= 15.4
// @match        http*://store.steampowered.com/*
// @match        http*://help.steampowered.com/*
// @match        http*://checkout.steampowered.com/*
// @match        http*://steamcommunity.com/*
// @exclude      http*://store.steampowered.com/login/transfer
// @exclude      http*://help.steampowered.com/login/transfer
// @exclude      http*://steamcommunity.com/login/transfer
// @exclude      http*://store.steampowered.com/login/logout/
// @exclude      http*://help.steampowered.com/login/logout/
// @exclude      http*://steamcommunity.com/login/logout/
// @exclude      http*://store.steampowered.com/widget/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      steampowered.com
// @connect      steamcommunity.com
// @require      https://bundle.run/buffer@6.0.3
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.0.0/crypto-js.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAFP0lEQVR4AdXXA5Ar2R7H8bMuPdtmnH/Gnr22bdu2bdu27bvewfO7tu2Mvw+pqene5EbTefj8ytUn9TtK0ip07p9tad5hTb2PK9xMdke7Y93pLypdaXii78KdZfmyirQL5m6r056ZsCO6OLFhoeLNMdNzfq4ihS+PnRH/yo74iZX0e3PbR2QlHsTUybIgQcRKt818RRnrYmKZSw4kyNho8vGTrynj3P91+fMOJITYaH3IsI3gy60Oa3dee/D+Fd+nwsLEScoYszpafHx82cfNjnRd2XFSx8md1jX6INlt9XomOj+rjCo998/K3f7i8pa/Oqez+ydK496vxk9LfuxEv0JNTxiwDTPGW764u0ee+Lzr55IrnnGgf/bDyqXe/2rnhZI4aPgpX3n9VX3/mv7ptjtU6RxPtCGapDy5Eaf82FZXfyTTn7p/qkqj/wJtAStD5wZasabHtNtgZmlNVRr1PxdKEl9w67cqgI3NzZoRdnovU+F78rUyL7QFGnwYxK35Sdor7ZhGp1X4ztmd2g0IcjYNT2oLVLqvwrenvFW3n3MaqCB0X6s9iElFpfiBnt7UoivwaZIKQsde2lFRXLKqcA3uoP0oJ+cdKgijW2tH2TjjUuHq3k0/l9umoL47m2jvgYnMWOXHm8oP3lAab6hwoN54I+wChW/kq5IUqODwRoHSjXtDhevM94+nnkopzofJwf3LufQd7ajjqU+/rv4P8UbW98c26tqlc7fSp3un6TXOf1mFYom5+l7BhMWQmDGRkFNvUcY3g5x774ZS6EQMjp3E69MsKrAh6Q4kInGSeOvU95R/vJt2WQg1iYxiH9lc5Y8cZBJpiM84qLEB/5dyVD0zElJiWchL9PLZQDLiIy4y/K9BrcWhbUBlLuDbLRohXjEzsKnyp+YxIfhU4h4ef2MaTahNYyaSicdLGvo4B6kDlD/VPxaCTRRnAMhlBC5Ek548BeAmSd7jjCswBYB8WiEIVZnLNpZQF0GowzMA1kSuQBQPAZiC4GQBRRTbQhRCXwDySI5UgXYAPCAKYSp6GxCEvwEwKlIFFgGwFiGBHPSKqIgwG4CtkSqwD4DxCB3xNg6hLQAfRKpANgBDEYbibRZCUwAyIlNgMh6zEWrjrTvCAACORKJAYwrxOIkg/AW920QjbAJgqfEFErhGsUKqI9ThCSXyaI2QyksAWhpdwMl+tDKIQqjCEfKAAj6knuapi4jRBbyP3AGiEYR4KlH8tbMCj55GFogihtq48XaW9ppfg6Zk4LEdCb1AXaIQr9RkI1cp4vXusodd7OIqxU4QFU6BPB6yjQGkIHgSzVpCVcg8XEg4BXLwKCCDedQljgw8LrKV1RzmBf49ZwvVECT8Alp5ANyns+YaLsSXx0xnII2JQxAjCmjl8inzKDkfAwC9zymHaGJgAa37rCMNQdhKiSKmIUgkC2hdJg6hKsWu0hgxrsAqLhPIBAThHgA7iUOMLCC4qMxkTpLD6yxHcHEOuIYgRhcoThz98W0QgosnwOeRLCBE8RK4zSROkqs57y6ERgCsimwBYScAPRAS6MR6jjEWz1X8AIAWRheos9uJaFKbIuApdRFdFgKQEcZLeu1eyp96E+2ILgsAyGEayQiCi3qcBOAV1UMuYGJOWeXPHrPNa9A2PPI4RzY38XhJWyTkpN07/57yhzdqbXN4DRvFU/Qywpi9YKFjVxXIX7+e8nfvCgmM5SAXuU0Wm2iJhBEbdXfxhgrsk+9U/MCCEzEwDqw0WcA7Kji8MaROtd3vP4xyiwGJcZe7WmPFshjfs/8Hvxyu95jGcTAAAAAASUVORK5CYII=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563910/Steam%20%E4%BB%A4%E7%89%8C%E9%AA%8C%E8%AF%81%E5%99%A8_%E6%82%AC%E6%B5%AE%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/563910/Steam%20%E4%BB%A4%E7%89%8C%E9%AA%8C%E8%AF%81%E5%99%A8_%E6%82%AC%E6%B5%AE%E7%90%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量定义
    var timeOffset = 0;
    var accounts = GM_getValue('accounts') || [];
    var userSteamID;

    // 悬浮图标配置
    const ICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAFP0lEQVR4AdXXA5Ar2R7H8bMuPdtmnH/Gnr22bdu2bdu27bvewfO7tu2Mvw+pqene5EbTefj8ytUn9TtK0ip07p9tad5hTb2PK9xMdke7Y93pLypdaXii78KdZfmyirQL5m6r056ZsCO6OLFhoeLNMdNzfq4ihS+PnRH/yo74iZX0e3PbR2QlHsTUybIgQcRKt818RRnrYmKZSw4kyNho8vGTrynj3P91+fMOJITYaH3IsI3gy60Oa3dee/D+Fd+nwsLEScoYszpafHx82cfNjnRd2XFSx8md1jX6INlt9XomOj+rjCo998/K3f7i8pa/Oqez+ydK496vxk9LfuxEv0JNTxiwDTPGW764u0ee+Lzr55IrnnGgf/bDyqXe/2rnhZI4aPgpX3n9VX3/mv7ptjtU6RxPtCGapDy5Eaf82FZXfyTTn7p/qkqj/wJtAStD5wZasabHtNtgZmlNVRr1PxdKEl9w67cqgI3NzZoRdnovU+F78rUyL7QFGnwYxK35Sdor7ZhGp1X4ztmd2g0IcjYNT2oLVLqvwrenvFW3n3MaqCB0X6s9iElFpfiBnt7UoivwaZIKQsde2lFRXLKqcA3uoP0oJ+cdKgijW2tH2TjjUuHq3k0/l9umoL47m2jvgYnMWOXHm8oP3lAab6hwoN54I+wChW/kq5IUqODwRoHSjXtDhevM94+nnkopzofJwf3LufQd7ajjqU+/rv4P8UbW98c26tqlc7fSp3un6TXOf1mFYom5+l7BhMWQmDGRkFNvUcY3g5x774ZS6EQMjp3E69MsKrAh6Q4kInGSeOvU95R/vJt2WQg1iYxiH9lc5Y8cZBJpiM84qLEB/5dyVD0zElJiWchL9PLZQDLiIy4y/K9BrcWhbUBlLuDbLRohXjEzsKnyp+YxIfhU4h4ef2MaTahNYyaSicdLGvo4B6kDlD/VPxaCTRRnAMhlBC5Ek548BeAmSd7jjCswBYB8WiEIVZnLNpZQF0GowzMA1kSuQBQPAZiC4GQBRRTbQhRCXwDySI5UgXYAPCAKYSp6GxCEvwEwKlIFFgGwFiGBHPSKqIgwG4CtkSqwD4DxCB3xNg6hLQAfRKpANgBDEYbibRZCUwAyIlNgMh6zEWrjrTvCAACORKJAYwrxOIkg/AW920QjbAJgqfEFErhGsUKqI9ThCSXyaI2QyksAWhpdwMl+tDKIQqjCEfKAAj6knuapi4jRBbyP3AGiEYR4KlH8tbMCj55GFogihtq48XaW9ppfg6Zk4LEdCb1AXaIQr9RkI1cp4vXusodd7OIqxU4QFU6BPB6yjQGkIHgSzVpCVcg8XEg4BXLwKCCDedQljgw8LrKV1RzmBf49ZwvVECT8Alp5ANyns+YaLsSXx0xnII2JQxAjCmjl8inzKDkfAwC9zymHaGJgAa37rCMNQdhKiSKmIUgkC2hdJg6hKsWu0hgxrsAqLhPIBAThHgA7iUOMLCC4qMxkTpLD6yxHcHEOuIYgRhcoThz98W0QgosnwOeRLCBE8RK4zSROkqs57y6ERgCsimwBYScAPRAS6MR6jjEWz1X8AIAWRheos9uJaFKbIuApdRFdFgKQEcZLeu1eyp96E+2ILgsAyGEayQiCi3qcBOAV1UMuYGJOWeXPHrPNa9A2PPI4RzY38XhJWyTkpN07/57yhzdqbXN4DRvFU/Qywpi9YKFjVxXIX7+e8nfvCgmM5SAXuU0Wm2iJhBEbdXfxhgrsk+9U/MCCEzEwDqw0WcA7Kji8MaROtd3vP4xyiwGJcZe7WmPFshjfs/8Hvxyu95jGcTAAAAAASUVORK5CYII=';

    // 判断是否登录的函数
    function isLoggedIn() {
        // 首先检查是否在Steam客户端中
        if (navigator.userAgent.includes('Valve Steam')) {
            // 客户端中使用g_steamID判断
            return typeof unsafeWindow.g_steamID !== 'undefined' && unsafeWindow.g_steamID !== false;
        } else {
            // 网页端检查账户下拉菜单
            if ($J('#account_dropdown .persona, #account_dropdown .account_name').length) {
                return true;
            }

            // 备选方案：从application_config元素获取登录状态
            var $config = $J('#application_config');
            if ($config.length) {
                try {
                    var configData = $config.data('config');
                    if (configData && configData.userinfo) {
                        var userinfo = configData.userinfo;
                        if (typeof userinfo === 'string') {
                            userinfo = JSON.parse(userinfo);
                        }
                        return userinfo && userinfo.logged_in === true;
                    }
                } catch (e) {
                    // 其他方法
                }
            }

            return false;
        }
    }

    function bufferizeSecret(secret) {
        if (typeof secret === 'string') {
            if (secret.match(/[0-9a-f]{40}/i)) {
                return buffer.Buffer.from(secret, 'hex');
            } else {
                return buffer.Buffer.from(secret, 'base64');
            }
        }
        return secret;
    }

    function generateAuthCode(secret, timeOffset) {
        secret = bufferizeSecret(secret);
        let time = Math.floor(Date.now() / 1000) + (timeOffset || 0);
        let b = buffer.Buffer.allocUnsafe(8);
        b.writeUInt32BE(0, 0);
        b.writeUInt32BE(Math.floor(time / 30), 4);
        let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, CryptoJS.lib.WordArray.create(secret));
        hmac = buffer.Buffer.from(hmac.update(CryptoJS.lib.WordArray.create(b)).finalize().toString(CryptoJS.enc.Hex), 'hex');
        let start = hmac[19] & 0x0F;
        hmac = hmac.slice(start, start + 4);
        let fullcode = hmac.readUInt32BE(0) & 0x7FFFFFFF;
        const chars = '23456789BCDFGHJKMNPQRTVWXY';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(fullcode % chars.length);
            fullcode /= chars.length;
        }
        return code;
    }

    function generateConfirmationKey(identitySecret, time, tag) {
        identitySecret = bufferizeSecret(identitySecret);
        let dataLen = 8;
        if (tag) {
            if (tag.length > 32) {
                dataLen += 32;
            } else {
                dataLen += tag.length;
            }
        }
        let b = buffer.Buffer.allocUnsafe(dataLen);
        b.writeUInt32BE(0, 0);
        b.writeUInt32BE(time, 4);
        if (tag) {
            b.write(tag, 8);
        }
        let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, CryptoJS.lib.WordArray.create(identitySecret));
        return hmac.update(CryptoJS.lib.WordArray.create(b)).finalize().toString(CryptoJS.enc.Base64);
    }

    function getDeviceID(steamID) {
        let salt = '';
        return "android:" + CryptoJS.SHA1(steamID.toString() + salt).toString(CryptoJS.enc.Hex).replace(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12}).*$/, '$1-$2-$3-$4-$5');
    }

    function generateConfirmationQueryParams(account, tag, timeOffset) {
        var time = Math.floor(Date.now() / 1000) + (timeOffset || 0);
        var key = generateConfirmationKey(account.identitySecret, time, tag);
        var deviceID = getDeviceID(account.steamID);
        return 'a=' + account.steamID + '&tag=' + tag + '&l=schinese&m=react&t=' + time + '&p=' + encodeURIComponent(deviceID) + '&k=' + encodeURIComponent(key);
    }

    // --- 弹窗相关函数 ---

    function showAddAccountDialog(strTitle, strOKButton, strCancelButton, rgModalParams) {
        if (!strOKButton) strOKButton = '确定';
        if (!strCancelButton) strCancelButton = '取消';

        var $Body = $J('<form/>');
        var $AccountNameInput = $J('<input/>', {type: 'text', 'class': ''});
        var $SharedSecretInput = $J('<input/>', {type: 'text', 'class': ''});
        var $SteamIDInput = $J('<input/>', {type: 'text', 'class': ''});
        var $IdentitySecretInput = $J('<input/>', {type: 'text', 'class': ''});

        if (rgModalParams && rgModalParams.inputMaxSize) {
            $AccountNameInput.attr('maxlength', rgModalParams.inputMaxSize);
            $SharedSecretInput.attr('maxlength', rgModalParams.inputMaxSize);
            $SteamIDInput.attr('maxlength', rgModalParams.inputMaxSize);
            $IdentitySecretInput.attr('maxlength', rgModalParams.inputMaxSize);
        }

        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description'}).append('Steam 帐户名称<span title="即 account_name，非个人资料名称，用于自动填写 Steam 令牌验证码。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($AccountNameInput));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description', 'style': 'margin-top: 8px;'}).append('共享密钥<span title="即 shared secret，用于生成 Steam 令牌验证码。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($SharedSecretInput));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description', 'style': 'margin-top: 8px;'}).append('64 位 Steam ID<span title="即 steamid，以“7656”开头的 17 位数字，用于确认交易与市场。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($SteamIDInput));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_description', 'style': 'margin-top: 8px;'}).append('身份密钥<span title="即 identity secret，用于确认交易与市场。"> (?)</span>'));
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_input gray_bevel for_text_input fullwidth'}).append($IdentitySecretInput));

        var deferred = new jQuery.Deferred();
        var fnOK = function() {
            var name = $AccountNameInput.val().trim();
            var secret = $SharedSecretInput.val().trim();
            var steamID = $SteamIDInput.val().trim();
            var identitySecret = $IdentitySecretInput.val().trim();
            if (!name) name = '无名氏';
            if (!secret) {
                ShowAlertDialog('错误', '请输入有效的共享密钥。', '确定');
                return;
            }
            if (steamID && steamID.indexOf('7656') != 0 && steamID.length != 17) {
                ShowAlertDialog('错误', '请输入有效的 64 位 Steam ID。', '确定');
                return;
            }
            deferred.resolve(name, secret, steamID, identitySecret);
        };
        var fnCancel = function() { deferred.reject(); };

        $Body.submit(function(event) { event.preventDefault(); fnOK(); });

        var $OKButton = _BuildDialogButton(strOKButton, true);
        $OKButton.click(fnOK);
        var $CancelButton = _BuildDialogButton(strCancelButton);
        $CancelButton.click(fnCancel);

        var Modal = _BuildDialog(strTitle, $Body, [$OKButton, $CancelButton], fnCancel);
        if(!rgModalParams || !rgModalParams.bNoPromiseDismiss) {
            deferred.always(function() { Modal.Dismiss(); });
        }
        Modal.Show();
        $AccountNameInput.focus();
        deferred.promise(Modal);
        return Modal;
    }

    function showImportAccountDialog(strTitle, strDescription, strOKButton, strCancelButton, textAreaMaxLength) {
        if (!strOKButton) strOKButton = '确定';
        if (!strCancelButton) strCancelButton = '取消';

        var $Body = $J('<form/>');
        var $TextArea = $J('<textarea/>', {'class': 'newmodal_prompt_textarea'});
        $TextArea.attr('placeholder', strDescription);
        if (textAreaMaxLength) {
            $TextArea.attr('maxlength', textAreaMaxLength);
            $TextArea.bind('keyup change', function() {
                var str = $J(this).val();
                var mx = parseInt($J(this).attr('maxlength'));
                if (str.length > mx) {
                    $J(this).val(str.substr(0, mx));
                    return false;
                }
            });
        }
        $Body.append($J('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel fullwidth'}).append($TextArea));

        var deferred = new jQuery.Deferred();
        var fnOK = function() { deferred.resolve($TextArea.val()); };
        var fnCancel = function() { deferred.reject(); };

        $Body.submit(function(event) { event.preventDefault(); fnOK(); });

        var $OKButton = _BuildDialogButton(strOKButton, true);
        $OKButton.click(fnOK);
        var $CancelButton = _BuildDialogButton(strCancelButton);
        $CancelButton.click(fnCancel);

        var Modal = _BuildDialog(strTitle, $Body, [$OKButton, $CancelButton], fnCancel);
        deferred.always(function() { Modal.Dismiss(); });
        Modal.Show();
        $TextArea.focus();
        deferred.promise(Modal);
        return Modal;
    }

    function showConfirmationDialog(account, confList) {
        var strOKButton = '全选';
        var strCancelButton = '关闭';

        var $Body = $J('<div/>', {'style': 'position: relative; overflow: hidden; padding-bottom: 66px;'});
        var $MobileconfList = $J('<div/>', {'id': 'mobileconf_list'});
        $J.each(confList, function(i, v) {
            var $ConfirmationEntry = $J('<div/>', {'class': 'mobileconf_list_entry', 'id': 'conf' + v.id, 'data-confid': v.id, 'data-key': v.nonce});
            var $ConfirmationEntryContent = $J('<div/>', {'class': 'mobileconf_list_entry_content'});
            var $ConfirmationEntryIcon = $J('<div/>', {'class': 'mobileconf_list_entry_icon'}).append('<img src="' + v.icon + '"/>');
            var $ConfirmationEntryDescription = $J('<div/>', {'class': 'mobileconf_list_entry_description'}).append('<div>' + v.headline + '</div><div>' + v.summary.join('<br/>') + '</div><div>' + v.type_name + ' - ' + new Date(v.creation_time * 1000).toLocaleString() + '</div>');
            var $ConfirmationEntryCheckbox = $J('<div/>', {'class': 'mobileconf_list_checkbox'}).append($J('<input/>', {'id': 'multiconf_' + v.id, 'data-confid': v.id, 'data-key': v.nonce, 'value': '1', 'type': 'checkbox'}));
            var $ConfirmationEntrySep = $J('<div/>', {'class': 'mobileconf_list_entry_sep'});
            $MobileconfList.append($ConfirmationEntry.append($ConfirmationEntryContent.append($ConfirmationEntryIcon, $ConfirmationEntryDescription, $ConfirmationEntryCheckbox), $ConfirmationEntrySep));
            $ConfirmationEntry.on('click', function() {
                unsafeWindow.open('https://steamcommunity.com/mobileconf/detailspage/' + v.id + '?' + generateConfirmationQueryParams(account, 'details' + v.id, timeOffset), '_blank', 'height=790,width=600,resize=yes,scrollbars=yes');
            });
            $ConfirmationEntryCheckbox.on('click', function(e) {
                e.stopPropagation();
                var nChecked = $J('.mobileconf_list_checkbox input:checked').length;
                var $elButtons = $J('#mobileconf_buttons');
                if (nChecked > 0) {
                    var $btnCancel = $J('#mobileconf_buttons .mobileconf_button_cancel');
                    var $btnAccept = $J('#mobileconf_buttons .mobileconf_button_accept');
                    $btnCancel.unbind();
                    $btnAccept.unbind();
                    $btnCancel.text('取消选择');
                    $btnAccept.text('确认已选择');
                    $btnCancel.click(function() { sendMultiMobileConfirmationOp(account, 'cancel', Modal); });
                    $btnAccept.click(function() { sendMultiMobileConfirmationOp(account, 'allow', Modal); });
                    if ($elButtons.is(':hidden')) {
                        $elButtons.css('bottom', -$elButtons.height() + 'px');
                        $elButtons.show();
                    }
                    $elButtons.css('bottom', '0');
                } else {
                    $elButtons.css('bottom', -$elButtons.height() + 'px');
                }
            });
        });
        var $MobileconfButtons = $J('<div/>', {'id': 'mobileconf_buttons', 'style': 'display: none;'});
        var $MobileconfButtonCancel = $J('<div/>', {'class': 'mobileconf_button mobileconf_button_cancel'});
        var $MobileconfButtonAccept = $J('<div/>', {'class': 'mobileconf_button mobileconf_button_accept'});
        $MobileconfButtons.append($J('<div/>').append($MobileconfButtonCancel, $MobileconfButtonAccept));

        $Body.append($MobileconfList, $MobileconfButtons);

        var deferred = new jQuery.Deferred();
        var fnOK = function() {
            $J('.mobileconf_list_checkbox input:not(:checked)').prop('checked', true);
            $J('.mobileconf_list_checkbox').eq(0).click();
        };
        var fnCancel = function() { deferred.reject(); };

        var $OKButton = _BuildDialogButton(strOKButton, true);
        $OKButton.click(fnOK);
        var $CancelButton = _BuildDialogButton(strCancelButton);
        $CancelButton.click(fnCancel);

        var Modal = _BuildDialog('确认交易与市场', $Body, [$OKButton, $CancelButton], fnCancel);
        deferred.always(function() { Modal.Dismiss(); });
        Modal.Show();
        deferred.promise(Modal);
        return Modal;
    }

    function addAccount() {
        showAddAccountDialog('添加账户', '确定', '取消').done(function(name, secret, steamID, identitySecret) {
            var newAccount = { name, secret };
            if (steamID && identitySecret) {
                newAccount.steamID = steamID;
                newAccount.identitySecret = identitySecret;
            }
            accounts.push(newAccount);
            GM_setValue('accounts', accounts);
            ShowAlertDialog('添加账户', '添加成功' + (steamID ? '，该账户支持确认交易与市场。' : '，该账户不支持确认交易与市场。'), '确定');
        });
    }

    function importAccount() {
        showImportAccountDialog('导入账户', '将要导入的数据粘贴于此', '确定', '取消').done(function(data) {
            try {
                data = JSON.parse(data.replace(/("SteamID":)(\d+)/, '$1"$2"'));
                var name = data.account_name || '无名氏';
                var secret = data.shared_secret;
                var steamID = data.steamid || data.Session && data.Session.SteamID || '';
                var identitySecret = data.identity_secret;

                if (!secret) {
                    ShowAlertDialog('错误', '共享密钥不存在，请检查后再试。', '确定').done(function() { importAccount(); });
                    return;
                }

                var newAccount = { name, secret };
                if (steamID && identitySecret) {
                    newAccount.steamID = steamID;
                    newAccount.identitySecret = identitySecret;
                }
                accounts.push(newAccount);
                GM_setValue('accounts', accounts);
                ShowAlertDialog('导入账户', '导入成功' + (steamID ? '，该账户支持确认交易与市场。' : '，该账户不支持确认交易与市场。'), '确定');
            } catch (err) {
                ShowAlertDialog('错误', '数据格式有误，请检查后再试。', '确定').done(function() { importAccount(); });
            }
        });
    }

    function deleteAccount(elem) {
        ShowConfirmDialog('删除账户', '确定删除该账户吗？', '确定', '取消').done(function() {
            var $Elem = $JFromIDOrElement(elem);
            if ($Elem.data('id') >= accounts.length) {
                ShowAlertDialog('错误', '无法删除该账户，请稍后再试。', '确定').done(function() { unsafeWindow.location.reload(); });
            } else {
                accounts.splice($Elem.data('id'), 1);
                GM_setValue('accounts', accounts);
                ShowAlertDialog('删除账户', '删除成功。', '确定');
            }
        });
    }

    function copyAuthCode(elem) {
        var $Elem = $JFromIDOrElement(elem);
        var accountId = $Elem.data('id');
        var originalText = $Elem.text();
        GM_setClipboard(generateAuthCode(accounts[accountId].secret, timeOffset));

        // 悬浮菜单项，显示复制成功并延迟关闭
        if ($Elem.hasClass('sg-float-menu-item-text') || $Elem.closest('.sg-float-menu-item').length) {
            $Elem.css('color', '#66ccff').text('复制成功');

            // 1秒后恢复原状并关闭悬浮菜单
            setTimeout(function() {
                $Elem.css('color', '').text(originalText);
                FloatMenuManager.hide();
            }, 1000);
        } else {
            // 顶部下拉菜单项，显示复制成功并延迟关闭
            $Elem.css('width', unsafeWindow.getComputedStyle(elem, null).width).text('复制成功').addClass('copy_success');
            setTimeout(function() {
                $Elem.text($Elem.data('name')).removeClass('copy_success');
            }, 1000);
        }
    }

    // --- 独立悬浮菜单管理器 ---
    var FloatMenuManager = {
        isShowing: false,
        menuElement: null,
        iconElement: null,
        isDragging: false,
        clickHandler: null,

        init: function() {
            // 创建独立的菜单元素
            this.createIndependentMenu();
        },

        // 创建独立菜单
        createIndependentMenu: function() {
            // 如果已存在，先移除
            if (document.getElementById('sg-float-menu')) {
                $J('#sg-float-menu').remove();
            }

            // 创建菜单容器
            this.menuElement = $J('<div/>', {
                id: 'sg-float-menu',
                class: 'sg-float-menu',
                style: 'display: none; position: fixed; z-index: 999;'
            });

            // 创建菜单内容容器
            var $menuContent = $J('<div/>', {
                class: 'sg-float-menu-content'
            });

            this.menuElement.append($menuContent);
            $J('body').append(this.menuElement);

            // 初始填充菜单内容
            this.refreshMenuContent();
        },

        // 刷新菜单内容
        refreshMenuContent: function() {
            var $menuContent = this.menuElement.find('.sg-float-menu-content');
            $menuContent.empty();

            // 添加账户项
            $J.each(accounts, function(i, v) {
                var $menuItem = $J('<div/>', {
                    class: 'sg-float-menu-item',
                    'data-id': i,
                    title: '点击复制该账户的验证码'
                });

                var $itemText = $J('<span/>', {
                    class: 'sg-float-menu-item-text',
                    'data-id': i,
                    'data-name': v.name
                }).text(v.name);

                var $deleteBtn = $J('<span/>', {
                    class: 'sg-float-menu-item-delete',
                    'data-id': i,
                    title: '删除该账户'
                });

                $menuItem.append($itemText, $deleteBtn);
                $menuContent.append($menuItem);

                // 绑定事件
                $menuItem.on('click', function(e) {
                    if (!$J(e.target).hasClass('sg-float-menu-item-delete')) {
                        copyAuthCode($itemText[0]);
                    }
                });

                $deleteBtn.on('click', function(e) {
                    e.stopPropagation();
                    FloatMenuManager.hide();
                    deleteAccount(this);
                });
            });

            // 添加分隔线
            if (accounts.length > 0) {
                $menuContent.append($J('<div/>', {class: 'sg-float-menu-hr'}));
            }

            // 添加功能项
            var $addItem = $J('<div/>', {
                class: 'sg-float-menu-item'
            }).append($J('<span/>', {class: 'sg-float-menu-item-text'}).text('添加账户'));
            $addItem.on('click', function() {
                FloatMenuManager.hide();
                addAccount();
            });
            $menuContent.append($addItem);

            var $importItem = $J('<div/>', {
                class: 'sg-float-menu-item'
            }).append($J('<span/>', {class: 'sg-float-menu-item-text'}).text('导入账户'));
            $importItem.on('click', function() {
                FloatMenuManager.hide();
                importAccount();
            });
            $menuContent.append($importItem);

            // 添加确认交易与市场项
            if (userSteamID) {
                $J.each(accounts, function(i, v) {
                    if (v.steamID && userSteamID == v.steamID) {
                        var $confirmItem = $J('<div/>', {
                            class: 'sg-float-menu-item sg-float-menu-confirm',
                            title: '确认待处理的交易和市场项目'
                        }).append($J('<span/>', {class: 'sg-float-menu-item-text'}).text('确认交易与市场'));

                        $confirmItem.on('click', async function() {
                            FloatMenuManager.hide();
                            var waitDialog = ShowBlockingWaitDialog('确认交易与市场', '正在获取确认信息，请稍候…');
                            try {
                                var res = await new Promise((resolve, reject) => {
                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: 'https://steamcommunity.com/mobileconf/getlist?' + generateConfirmationQueryParams(v, 'conf', timeOffset),
                                        responseType: 'json',
                                        onload: function(response) { resolve(response.response); },
                                        onerror: function(error) { reject(error); }
                                    });
                                });
                                if (res && res.success) {
                                    if (res.conf && res.conf.length) {
                                        showConfirmationDialog(v, res.conf);
                                    } else {
                                        ShowAlertDialog('确认交易与市场', '您当前没有任何确认信息。', '确定');
                                    }
                                } else {
                                    ShowAlertDialog('错误', res && res.message || '获取确认信息失败，请稍后再试。', '确定');
                                }
                            } catch (err) {
                                ShowAlertDialog('错误', '获取确认信息失败，请稍后再试。', '确定');
                            }
                            waitDialog.Dismiss();
                        });

                        // 插入到第一个位置
                        $menuContent.prepend($confirmItem);
                        return false;
                    }
                });
            }

            // 添加分隔线
            $menuContent.append($J('<div/>', {class: 'sg-float-menu-hr'}));

            // 添加悬浮图标开关
            var isFloatIconShown = GM_getValue('show_float_icon', true);
            var $toggleItem = $J('<div/>', {
                class: 'sg-float-menu-item',
                title: isFloatIconShown ? '隐藏屏幕上的悬浮图标' : '在屏幕上显示悬浮图标'
            }).append($J('<span/>', {class: 'sg-float-menu-item-text'}).text(isFloatIconShown ? '隐藏悬浮图标' : '显示悬浮图标'));
            $toggleItem.on('click', function() {
                FloatMenuManager.hide();
                toggleFloatingIcon();
            });
            $menuContent.append($toggleItem);
        },

        // 显示菜单并定位到图标
        show: function($icon) {
            if (this.isDragging || this.isShowing) return;

            this.iconElement = $icon;
            this.isShowing = true;

            // 刷新菜单内容
            this.refreshMenuContent();

            // 显示菜单
            this.menuElement.css('display', 'block');

            // 更新位置
            this.updatePosition();

            // 创建点击事件处理器
            this.clickHandler = (e) => {
                if (this.isDragging) return;
                // 如果点击的不是菜单或图标，则关闭
                if (!$J(e.target).closest('#sg-float-menu, #sg-float-icon-container').length) {
                    this.hide();
                }
            };

            // 绑定点击关闭事件
            setTimeout(() => {
                $J(document).on('click.sg_float_menu', this.clickHandler);
            }, 10);
        },

        // 隐藏菜单
        hide: function() {
            if (this.isDragging || !this.isShowing) return;

            this.isShowing = false;
            this.menuElement.css('display', 'none');
            // 移除事件监听
            $J(document).off('click.sg_float_menu');
            this.clickHandler = null;
        },

        // 更新菜单位置（跟随图标）
        updatePosition: function() {
            if (!this.isShowing || !this.iconElement || !this.iconElement.length) return;

            var $icon = this.iconElement;
            var $menu = this.menuElement;

            // 获取图标位置和尺寸
            var iconRect = $icon[0].getBoundingClientRect();
            var iconWidth = $icon.outerWidth();
            var iconHeight = $icon.outerHeight();

            // 获取菜单尺寸
            var menuWidth = $menu.outerWidth();
            var menuHeight = $menu.outerHeight();

            // 获取视口尺寸
            var viewportWidth = document.documentElement.clientWidth;
            var viewportHeight = document.documentElement.clientHeight;

            // 计算菜单位置
            var pos = this.calculatePosition(iconRect, iconWidth, iconHeight, menuWidth, menuHeight, viewportWidth, viewportHeight);

            // 应用位置
            $menu.css({
                'top': pos.top,
                'left': pos.left,
                'right': pos.right,
                'bottom': pos.bottom
            });
        },

        // 自动计算菜单位置
        calculatePosition: function(iconRect, iconWidth, iconHeight, menuWidth, menuHeight, viewportWidth, viewportHeight) {
            var pos = {
                top: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
            };

            // 计算可用空间
            var spaceRight = viewportWidth - iconRect.right;
            var spaceLeft = iconRect.left;
            var spaceBottom = viewportHeight - iconRect.bottom;
            var spaceTop = iconRect.top;

            // 优先显示在右侧
            if (spaceRight >= menuWidth + 10 || spaceRight >= spaceLeft) {
                // 右侧空间足够，或者右侧空间比左侧大
                pos.left = (iconRect.right + 10) + 'px';

                // 垂直方向：优先对齐图标顶部，但要确保菜单不超出视口
                var topPosition = iconRect.top;
                if (topPosition + menuHeight > viewportHeight - 10) {
                    // 如果菜单底部超出视口，调整位置使其在视口内
                    topPosition = Math.max(10, viewportHeight - menuHeight - 10);
                }
                pos.top = topPosition + 'px';
                pos.bottom = 'auto';
            } else {
                // 显示在左侧
                pos.left = 'auto';
                pos.right = (viewportWidth - iconRect.left + 10) + 'px';

                // 垂直方向：优先对齐图标顶部
                var topPosition = iconRect.top;
                if (topPosition + menuHeight > viewportHeight - 10) {
                    topPosition = Math.max(10, viewportHeight - menuHeight - 10);
                }
                pos.top = topPosition + 'px';
                pos.bottom = 'auto';
            }

            // 如果垂直方向空间不足，尝试另一种布局
            if (spaceBottom < menuHeight + 10 && spaceTop >= menuHeight + 10) {
                // 如果下方空间不足但上方空间足够，显示在上方
                if (spaceRight >= menuWidth + 10 || spaceRight >= spaceLeft) {
                    pos.top = 'auto';
                    pos.bottom = (viewportHeight - iconRect.top + 10) + 'px';
                    pos.left = (iconRect.right + 10) + 'px';
                    pos.right = 'auto';
                } else {
                    pos.top = 'auto';
                    pos.bottom = (viewportHeight - iconRect.top + 10) + 'px';
                    pos.left = 'auto';
                    pos.right = (viewportWidth - iconRect.left + 10) + 'px';
                }
            }

            // 最终边界检查，确保菜单完全在视口内
            var finalRect = {
                left: pos.left !== 'auto' ? parseInt(pos.left) : viewportWidth - parseInt(pos.right) - menuWidth,
                top: pos.top !== 'auto' ? parseInt(pos.top) : viewportHeight - parseInt(pos.bottom) - menuHeight
            };

            // 水平边界检查
            if (finalRect.left < 10) {
                if (pos.left !== 'auto') {
                    pos.left = '10px';
                } else {
                    pos.right = (viewportWidth - 10) + 'px';
                }
            } else if (finalRect.left + menuWidth > viewportWidth - 10) {
                if (pos.left !== 'auto') {
                    pos.left = (viewportWidth - menuWidth - 10) + 'px';
                } else {
                    pos.right = '10px';
                }
            }

            // 垂直边界检查
            if (finalRect.top < 10) {
                if (pos.top !== 'auto') {
                    pos.top = '10px';
                } else {
                    pos.bottom = (viewportHeight - 10) + 'px';
                }
            } else if (finalRect.top + menuHeight > viewportHeight - 10) {
                if (pos.top !== 'auto') {
                    pos.top = (viewportHeight - menuHeight - 10) + 'px';
                } else {
                    pos.bottom = '10px';
                }
            }

            return pos;
        }
    };

    // --- 悬浮图标逻辑 ---
    var floatIconDragState = {
        isDragging: false,
        hasMoved: false,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
        dragMoveHandler: null,
        dragEndHandler: null
    };

    function initFloatingIcon() {
        // 检查是否应该显示悬浮图标
        if (!GM_getValue('show_float_icon', true)) {
            // 如果之前有悬浮图标，移除它
            $J('#sg-float-icon-container').remove();
            return;
        }

        // 如果已经存在悬浮图标，先移除再重新创建
        var existingIcon = document.getElementById('sg-float-icon-container');
        if (existingIcon) {
            $J(existingIcon).remove();
        }

        // 从缓存读取上次的位置，如果没有则使用默认位置
        var lastPos = GM_getValue('float_icon_pos', null);
        var defaultPos = {
            right: '20px',
            bottom: '60px',
            left: 'auto',
            top: 'auto'
        };

        var pos = lastPos || defaultPos;

        // 创建悬浮图标容器（方形）
        var $container = $J('<div/>', {
            id: 'sg-float-icon-container',
            title: 'Steam 令牌验证器\n点击显示菜单，拖动移动位置',
            style: `
                position: fixed;
                z-index: 999;
                width: 50px;
                height: 50px;
                cursor: move;
                transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 0.95;
                user-select: none;
                ${pos.left !== 'auto' ? 'left: ' + pos.left + ';' : ''}
                ${pos.top !== 'auto' ? 'top: ' + pos.top + ';' : ''}
                ${pos.right !== 'auto' ? 'right: ' + pos.right + ';' : ''}
                ${pos.bottom !== 'auto' ? 'bottom: ' + pos.bottom + ';' : ''}
            `
        });

        // 创建圆形图标（方形中央）
        var $icon = $J('<div/>', {
            id: 'sg-float-icon',
            class: 'sg-float-icon',
            style: `
                position: absolute;
                top: 7px;
                left: 7px;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1),
                            0 0 0 1px rgba(118, 151, 231, 0.3);
                background: linear-gradient(135deg, #1b2838 0%, #2a475e 100%);
                background-image: url('${ICON_BASE64}');
                background-size: 70%;
                background-position: center;
                background-repeat: no-repeat;
                transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `
        });

        // 创建隐藏按钮（❌ 方形右上角）
        var $closeBtn = $J('<div/>', {
            class: 'sg-float-close-btn',
            title: '隐藏悬浮图标',
            style: `
                position: absolute;
                top: -2px;
                right: -2px;
                width: 16px;
                height: 16px;
                background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
                color: white;
                border-radius: 3px;
                font-size: 12px;
                line-height: 14px;
                text-align: center;
                display: none;
                z-index: 999;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                font-weight: bold;
                transition: all 0.2s ease;
            `
        }).text('×');

        // 创建状态指示器（小圆点）
        var $statusDot = $J('<div/>', {
            class: 'sg-float-status-dot',
            style: `
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #2ecc71;
                box-shadow: 0 0 3px #2ecc71;
                z-index: 999;
                display: block;
                animation: pulse 2s infinite;
            `
        });

        // 隐藏按钮逻辑
        $closeBtn.on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            // 创建确认对话框
            ShowConfirmDialog(
                '隐藏悬浮图标',
                '确定要隐藏图标吗？如果在Steam客户端隐藏图标后将只能通过<span style="color: #ff3333; font-weight: bold;">Alt+P</span>快捷键再次启用。',
                '确定隐藏',
                '取消'
            ).done(function() {
                $container.remove();
                GM_setValue('show_float_icon', false);
                refreshAccounts();

                // 显示提示信息
                ShowAlertDialog(
                    '隐藏成功',
                    '悬浮图标已隐藏。<br><br>如需重新显示，请使用 <span style="color: #ff3333; font-weight: bold;">Alt+P</span> 快捷键或在顶部菜单中点击"显示悬浮图标"。',
                    '确定'
                );
            });
        });

        // 鼠标悬停效果
        $container.hover(
            function() {
                $container.css({
                    'transform': 'scale(1.05)',
                    'opacity': '1'
                });
                $icon.css({
                    'transform': 'scale(1.1)',
                    'box-shadow': '0 5px 15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(118, 151, 231, 0.5)'
                });
                $closeBtn.css('display', 'block');
            },
            function() {
                if (!floatIconDragState.isDragging) {
                    $container.css({
                        'transform': 'scale(1)',
                        'opacity': '0.95'
                    });
                    $icon.css({
                        'transform': 'scale(1)',
                        'box-shadow': '0 3px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(118, 151, 231, 0.3)'
                    });
                }
                $closeBtn.hide();
            }
        );

        // --- 拖拽逻辑 ---
        function onDragMove(e) {
            if (!floatIconDragState.isDragging) return;

            var dx = e.clientX - floatIconDragState.startX;
            var dy = e.clientY - floatIconDragState.startY;

            // 如果移动距离超过阈值，则认为是拖拽
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                floatIconDragState.hasMoved = true;
            }

            // 计算新位置
            var newX = floatIconDragState.initialX + dx;
            var newY = floatIconDragState.initialY + dy;

            // 获取视口尺寸
            var viewportWidth = document.documentElement.clientWidth;
            var viewportHeight = document.documentElement.clientHeight;

            // 限制在窗口范围内
            var maxX = viewportWidth - $container.outerWidth();
            var maxY = viewportHeight - $container.outerHeight();
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            // 更新位置
            $container.css({
                'left': newX + 'px',
                'top': newY + 'px',
                'right': 'auto',
                'bottom': 'auto'
            });

            // 如果菜单正在显示，更新菜单位置
            if (FloatMenuManager.isShowing) {
                FloatMenuManager.updatePosition();
            }
        }

        function onDragEnd() {
            if (!floatIconDragState.isDragging) return;

            floatIconDragState.isDragging = false;
            FloatMenuManager.isDragging = false;

            // 移除事件监听
            $J(document).off('mousemove.sg_drag', floatIconDragState.dragMoveHandler);
            $J(document).off('mouseup.sg_drag', floatIconDragState.dragEndHandler);

            floatIconDragState.dragMoveHandler = null;
            floatIconDragState.dragEndHandler = null;

            // 恢复样式
            $container.css({
                'transition': 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'cursor': 'move',
                'opacity': '0.95'
            });
            $icon.css({
                'transition': 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'box-shadow': '0 3px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(118, 151, 231, 0.3)'
            });

            // 保存位置
            var rect = $container[0].getBoundingClientRect();
            GM_setValue('float_icon_pos', {
                left: rect.left + 'px',
                top: rect.top + 'px',
                right: 'auto',
                bottom: 'auto'
            });

            // 适当延迟触发菜单
            setTimeout(function() {
                floatIconDragState.hasMoved = false;
            }, 50);
        }

        $container.on('mousedown', function(e) {
            // 只响应左键
            if (e.button !== 0) return;

            e.preventDefault();
            e.stopPropagation();

            floatIconDragState.isDragging = true;
            floatIconDragState.hasMoved = false;
            FloatMenuManager.isDragging = true;

            // 记录初始位置
            floatIconDragState.startX = e.clientX;
            floatIconDragState.startY = e.clientY;

            var rect = $container[0].getBoundingClientRect();
            floatIconDragState.initialX = rect.left;
            floatIconDragState.initialY = rect.top;

            // 修改样式
            $container.css({
                'transition': 'none',
                'opacity': '0.98',
                'cursor': 'grabbing'
            });
            $icon.css({
                'transition': 'none',
                'box-shadow': '0 5px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(118, 151, 231, 0.6)'
            });

            // 隐藏菜单
            FloatMenuManager.hide();

            // 创建事件处理器并存储引用
            floatIconDragState.dragMoveHandler = onDragMove;
            floatIconDragState.dragEndHandler = onDragEnd;

            // 绑定移动和释放事件
            $J(document).on('mousemove.sg_drag', floatIconDragState.dragMoveHandler);
            $J(document).on('mouseup.sg_drag', floatIconDragState.dragEndHandler);
        });

        // 点击事件（显示菜单）
        $container.on('click', function(e) {
            // 如果是拖拽操作，不显示菜单
            if (floatIconDragState.hasMoved) {
                floatIconDragState.hasMoved = false;
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            // 如果菜单已经在显示，则隐藏；否则显示
            if (FloatMenuManager.isShowing) {
                FloatMenuManager.hide();
            } else {
                FloatMenuManager.show($container);
            }
        });

        // 将元素添加到页面
        $container.append($icon, $closeBtn, $statusDot);
        $J('body').append($container);

        // 初始化菜单管理器
        FloatMenuManager.init();
    }

    function toggleFloatingIcon() {
        var current = GM_getValue('show_float_icon', true);
        var next = !current;

        // 更新设置
        GM_setValue('show_float_icon', next);

        // 如果设置为显示，初始化图标；否则移除图标
        if (next) {
            initFloatingIcon();
            ShowAlertDialog('显示悬浮图标', '悬浮图标已显示。<br><br>如需隐藏，请点击图标右上角的关闭按钮，或使用顶部菜单中的"隐藏悬浮图标"选项。', '确定');
        } else {
            $J('#sg-float-icon-container').remove();
            // 如果菜单正在显示，也隐藏它
            FloatMenuManager.hide();
        }

        // 刷新菜单项文字
        refreshAccounts();
    }

    // --- Alt+P 快捷键 ---
    function initKeyboardShortcut() {
        var shortcutHandler = function(e) {
            // 检查是否按下 Alt+P
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                e.stopPropagation();

                var current = GM_getValue('show_float_icon', true);

                if (!current) {
                    // 如果图标当前是隐藏状态，则显示它
                    GM_setValue('show_float_icon', true);
                    initFloatingIcon();
                    refreshAccounts();

                    // 显示提示
                    setTimeout(function() {
                        ShowAlertDialog(
                            '快捷键激活',
                            '悬浮图标已通过 <span style="color: #ff3333; font-weight: bold;">Alt+P</span> 快捷键重新显示。',
                            '确定'
                        );
                    }, 100);
                } else {
                    // 如果图标当前是显示状态，则切换它
                    toggleFloatingIcon();
                }
            }
        };

        // 添加事件监听器
        document.addEventListener('keydown', shortcutHandler, true);

        // 返回清理函数
        return function() {
            document.removeEventListener('keydown', shortcutHandler, true);
        };
    }

    function refreshAccounts() {
        $AuthenticatorPopupMenu.empty();
        $J.each(accounts, function(i, v) {
            var $AuthenticatorPopupMenuItem = $J('<span/>', {
                'style': 'display: block; padding: 5px 0 5px 12px; margin-right: 27px; min-width: 50px;',
                'data-id': i,
                'data-name': v.name,
                title: '点击复制该账户的验证码'
            }).append(v.name);

            var $AuthenticatorDeleteAccount = $J('<span/>', {
                'class': 'delete_account',
                'data-id': i,
                title: '删除该账户'
            });

            $AuthenticatorPopupMenu.append(
                $J('<a/>', {
                    'class': 'popup_menu_item',
                    'style': 'position: relative; padding: 0;'
                }).append($AuthenticatorPopupMenuItem, $AuthenticatorDeleteAccount)
            );

            $AuthenticatorPopupMenuItem.on('click', function() { copyAuthCode(this); });
            $AuthenticatorDeleteAccount.on('click', function() { deleteAccount(this); });
        });

        var $AuthenticatorAddAccount = $J('<a/>', {'class': 'popup_menu_item'}).append('添加账户');
        $AuthenticatorPopupMenu.append($AuthenticatorAddAccount);
        $AuthenticatorAddAccount.on('click', function() { addAccount(); });

        var $AuthenticatorImportAccount = $J('<a/>', {'class': 'popup_menu_item'}).append('导入账户');
        $AuthenticatorPopupMenu.append($AuthenticatorImportAccount);
        $AuthenticatorImportAccount.on('click', function() { importAccount(); });

        // 悬浮图标开关
        var isFloatIconShown = GM_getValue('show_float_icon', true);
        var $FloatIconToggle = $J('<a/>', {'class': 'popup_menu_item'}).append(
            $J('<span/>').text(isFloatIconShown ? '隐藏悬浮图标' : '显示悬浮图标')
        );

        $AuthenticatorPopupMenu.append($J('<div/>', {'class': 'hr'}));
        $AuthenticatorPopupMenu.append($FloatIconToggle);
        $FloatIconToggle.on('click', function() { toggleFloatingIcon(); });
    }

    function createConfirmationLink(steamID) {
        if (!$AuthenticatorPopupMenu.find('.confirmation').length) {
            $J.each(accounts, function(i, v) {
                if (v.steamID && steamID == v.steamID) {
                    var $AuthenticatorConfirmation = $J('<a/>', {'class': 'popup_menu_item confirmation'}).append('确认交易与市场');

                    // 插入到"添加账户"之前
                    var $addBtn = $AuthenticatorPopupMenu.find("a:contains('添加账户')");
                    if ($addBtn.length) {
                        $addBtn.before($AuthenticatorConfirmation);
                    } else {
                        $AuthenticatorPopupMenu.prepend($AuthenticatorConfirmation);
                    }

                    $AuthenticatorConfirmation.on('click', async function() {
                        var waitDialog = ShowBlockingWaitDialog('确认交易与市场', '正在获取确认信息，请稍候…');
                        try {
                            var res = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: 'https://steamcommunity.com/mobileconf/getlist?' + generateConfirmationQueryParams(v, 'conf', timeOffset),
                                    responseType: 'json',
                                    onload: function(response) { resolve(response.response); },
                                    onerror: function(error) { reject(error); }
                                });
                            });
                            if (res && res.success) {
                                if (res.conf && res.conf.length) {
                                    showConfirmationDialog(v, res.conf);
                                } else {
                                    ShowAlertDialog('确认交易与市场', '您当前没有任何确认信息。', '确定');
                                }
                            } else {
                                ShowAlertDialog('错误', res && res.message || '获取确认信息失败，请稍后再试。', '确定');
                            }
                        } catch (err) {
                            ShowAlertDialog('错误', '获取确认信息失败，请稍后再试。', '确定');
                        }
                        waitDialog.Dismiss();
                    });
                    return false;
                }
            });
        }
    }

    async function sendMultiMobileConfirmationOp(account, op, modal) {
        var $rgChecked = $J('.mobileconf_list_checkbox input:checked');
        if ($rgChecked.length == 0) return;

        var waitDialog = ShowBlockingWaitDialog('确认交易与市场', '正在执行此操作，请稍候…');
        var rgConfirmationId = [];
        var rgConfirmationKey = [];

        $J.each($rgChecked, function(key) {
            var $this = $J(this);
            rgConfirmationId.push($this.data('confid'));
            rgConfirmationKey.push($this.data('key'));
        });

        var queryString = 'op=' + op + '&' + generateConfirmationQueryParams(account, op, timeOffset);
        for (var i = 0; i < rgConfirmationId.length; i++) {
            queryString += '&cid[]=' + rgConfirmationId[i];
            queryString += '&ck[]=' + rgConfirmationKey[i];
        }

        try {
            var res = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://steamcommunity.com/mobileconf/multiajaxop',
                    data: queryString,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Origin': 'https://steamcommunity.com' },
                    responseType: 'json',
                    onload: function(response) { resolve(response.response); },
                    onerror: function(error) { reject(error); }
                });
            });
            if (res && res.success) {
                for (var j = 0; j < rgConfirmationId.length; j++) {
                    $J('#conf' + rgConfirmationId[j]).remove();
                }
                var nChecked = $J('.mobileconf_list_checkbox input:checked').length;
                var $elButtons = $J('#mobileconf_buttons');
                if (nChecked == 0) $elButtons.css('bottom', -$elButtons.height() + 'px');
                if ($J('.mobileconf_list_entry').length == 0) {
                    modal && modal.Dismiss();
                } else {
                    modal && modal.AdjustSizing();
                }
            } else {
                ShowAlertDialog('确认错误', res && res.message || '执行此操作时出现问题。请稍后再重试您的请求。', '确定');
            }
        } catch (err) {
            ShowAlertDialog('确认错误', '执行此操作时出现问题。请稍后再重试您的请求。', '确定');
        }
        waitDialog.Dismiss();
    }

    function setupTooltips(selector) {
        if (unsafeWindow.location.hostname == 'store.steampowered.com' || unsafeWindow.location.hostname == 'checkout.steampowered.com') {
            BindTooltips(selector, {tooltipCSSClass: 'store_tooltip'});
        } else if (unsafeWindow.location.hostname == 'help.steampowered.com') {
            BindTooltips(selector, {tooltipCSSClass: 'help_tooltip'});
        } else if (unsafeWindow.location.hostname == 'steamcommunity.com') {
            BindTooltips(selector, {tooltipCSSClass: 'community_tooltip'});
        }
    }

    // --- 样式部分 ---
    GM_addStyle(`
        .delete_account {
            position: absolute; right: 0; top: 0; padding: 5px 7.5px; width: 12px; height: calc(100% - 10px);
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAkElEQVR4AXWQxWEDMRBFJ6AWArqGmW7G12HMDN0ZFmr4dqKF00rDPGPhycnr/vi9nJVPl2qI7Dd0WZpZEyFEygKhy1CkPsX4JCLlB6OP6jo3eRHxhh3xA+OBLULedCtExDOGcRvM6DZzpP/RxgtR4fDKat/ylPUKpZwao1A769VBDbls3H5WO6KfjVu5YOVJDkyDcoTnvnKRAAAAAElFTkSuQmCC);
            background-position: center; background-repeat: no-repeat; background-origin: content-box; cursor: pointer;
        }
        .copy_success { color: #57cbde !important; }
        #mobileconf_list { overflow-y: auto; max-width: 600px; max-height: calc(100vh - 270px); }
        .mobileconf_list_entry { cursor: default; font-size: 15px; text-shadow: none; width: 100%; transition: opacity 0.1s, top 0.4s; }
        .mobileconf_list_entry.copy { transition: opacity 0.4s, top 0.4s; }
        .mobileconf_list_entry_content { display: flex; padding: 10px 20px; }
        .mobileconf_list_entry_icon { height: 3.5em; margin-right: 10px; }
        .mobileconf_list_entry_icon > img { width: 32px; }
        .mobileconf_list_entry_description { flex: 1; min-width: 0; margin-right: 10px; }
        .mobileconf_list_entry_description > div { color: #7a7a7a; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .mobileconf_list_entry_description > div:first-oftype { color: white; }
        .mobileconf_list_checkbox { overflow: hidden; vertical-align: middle; display: inline-block; color: #ffffff; width: 3em; height: 3em; transform: scale(1.5); transition: 0.1s; }
        .mobileconf_list_checkbox input { width: 3em; height: 3em; }
        .mobileconf_list_entry_sep { border-top: 1px solid #303030; }
        #mobileconf_buttons { position: absolute; display: inline-block; vertical-align: middle; height: 3.3em; line-height: 3.3em; width: 100%; font-size: 20px; background: #324056; background-image: radial-gradient(ellipse farthest-corner at 50% 0px, rgb(74, 107, 152) 0%, transparent 50%); bottom: -3em; left: 0; z-index: 10; transition: bottom 0.4s; }
        .mobileconf_button { width: 50%; display: inline-block; overflow: hidden; text-align: center; vertical-align: middle; line-height: normal; cursor: pointer; }

        /* 悬浮图标容器样式 */
        #sg-float-icon-container {
            position: fixed !important;
            z-index: 999 !important;
            width: 50px !important;
            height: 50px !important;
            cursor: move !important;
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            opacity: 0.95 !important;
            user-select: none !important;
        }
        #sg-float-icon-container:hover {
            transform: scale(1.05) !important;
            opacity: 1 !important;
        }
        #sg-float-icon-container:active {
            cursor: grabbing !important;
        }

        /* 悬浮图标样式 */
        .sg-float-icon {
            position: absolute !important;
            top: 7px !important;
            left: 7px !important;
            width: 35px !important;
            height: 35px !important;
            border-radius: 50% !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        0 0 0 1px rgba(118, 151, 231, 0.3) !important;
            background: linear-gradient(135deg, #1b2838 0%, #2a475e 100%) !important;
            background-image: url('${ICON_BASE64}') !important;
            background-size: 70% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }
        #sg-float-icon-container:hover .sg-float-icon {
            transform: scale(1.1) !important;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        0 0 0 1px rgba(118, 151, 231, 0.5) !important;
        }

        /* 隐藏按钮样式 */
        .sg-float-close-btn {
            position: absolute !important;
            top: -2px !important;
            right: -2px !important;
            width: 16px !important;
            height: 16px !important;
            background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%) !important;
            color: white !important;
            border-radius: 3px !important;
            font-size: 12px !important;
            line-height: 14px !important;
            text-align: center !important;
            display: none !important;
            z-index: 999 !important;
            cursor: pointer !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            font-weight: bold !important;
            transition: all 0.2s ease !important;
        }
        #sg-float-icon-container:hover .sg-float-close-btn {
            display: block !important;
        }
        .sg-float-close-btn:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
        }

        /* 状态指示器 */
        .sg-float-status-dot {
            position: absolute !important;
            bottom: 10px !important;
            right: 10px !important;
            width: 7px !important;
            height: 7px !important;
            border-radius: 50% !important;
            background: #2ecc71 !important;
            box-shadow: 0 0 3px #2ecc71 !important;
            z-index: 999 !important;
            display: block !important;
            animation: pulse 2s infinite !important;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        /* 悬浮菜单样式 */
        .sg-float-menu {
            position: fixed !important;
            z-index: 999 !important;
            max-height: 50vh !important;
            overflow-y: auto !important;
            width: auto !important;
            min-width: 125px !important;
            max-width: 225px !important;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(118, 151, 231, 0.2) !important;
            background: rgba(27, 40, 56, 0.98) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            border: 1px solid rgba(118, 151, 231, 0.25) !important;
            border-radius: 6px !important;
            animation: floatMenuFadeIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            padding: 4px 0 !important;
        }

        @keyframes floatMenuFadeIn {
            from { opacity: 0; transform: translateY(8px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sg-float-menu-content {
            background: transparent !important;
            padding: 0 !important;
        }

        .sg-float-menu-item {
            color: #c6d4df !important;
            padding: 2px 18px !important;
            border-bottom: 1px solid rgba(118, 151, 231, 0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            transition: all 0.15s ease !important;
            font-size: 12px !important;
            font-family: "Motiva Sans", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            min-height: 32px !important;
            cursor: pointer !important;
            position: relative !important;
        }

        .sg-float-menu-item:last-child {
            border-bottom: none !important;
        }

        .sg-float-menu-item:hover {
            background: rgba(118, 151, 231, 0.15) !important;
            color: #ffffff !important;
            padding-left: 16px !important;
        }

        .sg-float-menu-item-text {
            flex: 1 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            font-size: 12px !important;
        }

        .sg-float-menu-item-delete {
            width: 16px !important;
            height: 16px !important;
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMS41IDEuNUwxMC41IDEwLjUiIHN0cm9rZT0iI0M2RDRERiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMC41IDEuNUwxLjUgMTAuNSIgc3Ryb2tlPSIjQzZENERGIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+) !important;
            background-size: 12px 12px !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            opacity: 0.7 !important;
            transition: opacity 0.15s ease !important;
            cursor: pointer !important;
            margin-left: 8px !important;
        }

        .sg-float-menu-item:hover .sg-float-menu-item-delete {
            opacity: 1 !important;
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMS41IDEuNUwxMC41IDEwLjUiIHN0cm9rZT0iI0ZGN0U3QyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMC41IDEuNUwxLjUgMTAuNSIgc3Ryb2tlPSIjRkY3RTdDIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+) !important;
        }

        .sg-float-menu-confirm {
            color: #4fbcff !important;
            font-weight: 600 !important;
        }

        .sg-float-menu-confirm:hover {
            color: #66ccff !important;
            background: rgba(79, 188, 255, 0.15) !important;
        }

        .sg-float-menu-hr {
            height: 1px !important;
            background: linear-gradient(90deg, transparent, rgba(118, 151, 231, 0.2), transparent) !important;
            margin: 6px 12px !important;
        }

        .newmodal_content {
            font-family: "Motiva Sans", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
        }

        .newmodal_content span[style*="color: #ff3333"] {
            color: #ff3333 !important;
            font-weight: bold !important;
            text-shadow: 0 0 2px rgba(255, 51, 51, 0.3) !important;
        }

        /* 性能 */
        .sg-float-menu-item, .sg-float-menu-item * {
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
            will-change: transform, opacity !important;
        }
    `);

    // --- 主执行逻辑 ---

    var $GlobalActionMenu = $J('#global_action_menu');
    var $AuthenticatorLink = $J('<span/>', {
        'class': 'pulldown global_action_link',
        'style': 'display: inline-block; padding-left: 4px; line-height: 25px;'
    }).append('Steam 令牌验证器');

    // 使用 jQuery 绑定点击
    $AuthenticatorLink.on('click', function() {
        // 确保悬浮菜单隐藏
        FloatMenuManager.hide();
        // 调用 Steam 原生 ShowMenu
        unsafeWindow.ShowMenu(this, 'authenticator_dropdown', 'right');
    });

    // 创建菜单容器和内容
    var $AuthenticatorDropdown = $J('<div/>', {'class': 'popup_block_new', 'id': 'authenticator_dropdown', 'style': 'display: none;'});
    var $AuthenticatorPopupMenu = $J('<div/>', {'class': 'popup_body popup_menu'});

    $GlobalActionMenu.prepend($AuthenticatorDropdown.append($AuthenticatorPopupMenu));
    $GlobalActionMenu.prepend($AuthenticatorLink);

    // 初始化
    refreshAccounts();
    initFloatingIcon(); // 初始化悬浮图标
    initKeyboardShortcut(); // 初始化键盘快捷键

    // 监听账户变化
    GM_addValueChangeListener('accounts', function(name, old_value, new_value, remote) {
        accounts = new_value;
        refreshAccounts();
        if (userSteamID) {
            $AuthenticatorPopupMenu.find('.confirmation').remove();
            createConfirmationLink(userSteamID);
        }
        AlignMenu($AuthenticatorLink, 'authenticator_dropdown', 'right');
    });

    // 确认交易与市场逻辑
    if (unsafeWindow.location.pathname == '/mobileconf/conf') {
        let account;
        $J.each(accounts, function(i, v) {
            if (v.steamID && g_steamID == v.steamID) {
                account = v;
                return false;
            }
        });
        unsafeWindow.GetValueFromLocalURL = function(url, timeout, success, error, fatal) {
            if (url.indexOf('steammobile://steamguard?op=conftag&arg1=allow') !== -1) {
                success(generateConfirmationQueryParams(account, 'allow', timeOffset));
            } else if (url.indexOf('steammobile://steamguard?op=conftag&arg1=cancel') !== -1) {
                success(generateConfirmationQueryParams(account, 'cancel', timeOffset));
            } else if (url.indexOf('steammobile://steamguard?op=conftag&arg1=details') !== -1) {
                success(generateConfirmationQueryParams(account, 'details', timeOffset));
            }
        };
        $J('html').removeClass('force_desktop').addClass('responsive');
        V_SetCookie('strResponsiveViewPrefs', null, -1);
        $J('.mobileconf_list_entry').each(function() {
            var $this = $J(this);
            if (!$this.has('.mobileconf_list_checkbox').length) {
                var $ConfirmationEntryCheckbox = $J('<div/>', {'class': 'mobileconf_list_checkbox'}).append($J('<input/>', {'id': 'multiconf_' + $this.data('confid'), 'data-confid': $this.data('confid'), 'data-key': $this.data('key'), 'value': '1', 'type': 'checkbox'}));
                $this.find('.mobileconf_list_entry_icon').after($ConfirmationEntryCheckbox);
                $ConfirmationEntryCheckbox.on('click', function(e) {
                    e.stopPropagation();
                    var nChecked = $J('.mobileconf_list_checkbox input:checked').length;
                    var $elButtons = $J('#mobileconf_buttons');
                    if (nChecked > 0) {
                        var $btnCancel = $J('#mobileconf_buttons .mobileconf_button_cancel');
                        var $btnAccept = $J('#mobileconf_buttons .mobileconf_button_accept');
                        $btnCancel.unbind(); $btnAccept.unbind();
                        $btnCancel.text('取消选择'); $btnAccept.text('确认已选择');
                        $btnCancel.click(function() { ActionForAllSelected('cancel'); });
                        $btnAccept.click(function() { ActionForAllSelected('allow'); });
                        if ($elButtons.is(':hidden')) { $elButtons.css('bottom', -$elButtons.height() + 'px'); $elButtons.show(); }
                        $elButtons.css('bottom', '0');
                    } else { $elButtons.css('bottom', -$elButtons.height() + 'px'); }
                });
            }
        });
        var $ResponsiveHeaderContent = $J('.responsive_header_content');
        var $ConfirmationCheckAll = $J('<div/>', {'class': 'btn_green_steamui btn_medium'}).append('<span>全选</span>');
        var $ConfirmationRefresh = $J('<div/>', {'class': 'btn_blue_steamui btn_medium'}).append('<span>刷新</span>');
        $ResponsiveHeaderContent.append($J('<div/>', {'style': 'position: absolute; top: 15px; right: 8px;'}).append($ConfirmationCheckAll, '\n', $ConfirmationRefresh));
        $ConfirmationCheckAll.on('click', function() {
            if ($J('#mobileconf_list').is(':visible') && $J('#mobileconf_details').is(':hidden')) {
                $J('.mobileconf_list_checkbox input:not(:checked)').click();
            }
        });
        $ConfirmationRefresh.on('click', function() {
            if (account) {
                unsafeWindow.location.replace('https://steamcommunity.com/mobileconf/conf?' + generateConfirmationQueryParams(account, 'conf', timeOffset));
            } else {
                unsafeWindow.location.reload();
            }
        });
    }

    // 自动填写验证码
    var intersectionObserver = new IntersectionObserver(function(entries) {
        if (entries[0].intersectionRatio > 0) {
            var name = $J('#login_twofactorauth_message_entercode_accountname, [class^="login_SigningInAccountName"], [class^="newlogindialog_AccountName"], :has(> a[href="https://help.steampowered.com/wizard/HelpWithLoginInfo?lost=8&issueid=402"]) :nth-child(1) span').text();
            $J.each(accounts, function(i, v) {
                if(name == v.name) {
                    var $AuthCodeInput = $J('#twofactorcode_entry, [class^="login_AuthenticatorInputcontainer"] input.DialogInput, [class^="newlogindialog_SegmentedCharacterInput"] input, [class^="segmentedinputs_SegmentedCharacterInput"] input, :has(> a[href="https://help.steampowered.com/wizard/HelpWithLoginInfo?lost=8&issueid=402"]) :nth-child(2) input');
                    var dt = new DataTransfer();
                    dt.setData('text', generateAuthCode(v.secret, timeOffset));
                    $AuthCodeInput[0].dispatchEvent(new ClipboardEvent('paste', {clipboardData: dt, bubbles: true}));
                    return false;
                }
            });
        }
    });

    var mutationObserver = new MutationObserver(function() {
        var $input = $J('#twofactorcode_entry, [class^="login_AuthenticatorInputcontainer"] input.DialogInput, [class^="newlogindialog_SegmentedCharacterInput"] input, [class^="segmentedinputs_SegmentedCharacterInput"] input, :has(> a[href="https://help.steampowered.com/wizard/HelpWithLoginInfo?lost=8&issueid=402"]) :nth-child(2) input');
        if ($input.length) {
            intersectionObserver.observe($input[0]);
        }
        if ($J('[class^="newlogindialog_EnterCodeInsteadLink"] [class^="newlogindialog_TextLink"], :has(> a[href="https://help.steampowered.com/wizard/HelpWithLoginInfo?lost=8&issueid=402"]):not(:has(input))').length) {
            $J('[class^="newlogindialog_EnterCodeInsteadLink"] [class^="newlogindialog_TextLink"], :has(+ a[href="https://help.steampowered.com/wizard/HelpWithLoginInfo?lost=8&issueid=402"]) div')[0].click();
        }
    });

    // 根据是否登录判断是否显示【确认交易与市场】菜单项
    if (isLoggedIn()) {
        if (navigator.userAgent.includes('Valve Steam')) {
            // Steam客户端中，使用g_steamID
            if (typeof unsafeWindow.g_steamID !== 'undefined' && unsafeWindow.g_steamID !== false) {
                userSteamID = unsafeWindow.g_steamID;
                createConfirmationLink(userSteamID);
            }
        } else {
            // 网页端，尝试获取SteamID
            if (typeof g_steamID != 'undefined' && g_steamID) {
                userSteamID = g_steamID;
                createConfirmationLink(userSteamID);
            } else {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://steamcommunity.com/my/?xml=1',
                    onload: function(response) {
                        if (response.responseXML) {
                            var steamID = $J(response.responseXML).find('steamID64').text();
                            if (steamID) {
                                userSteamID = steamID;
                                createConfirmationLink(userSteamID);
                            }
                        }
                    }
                });
            }
        }

        if (unsafeWindow.location.href.indexOf('checkout.steampowered.com/login/?purchasetype=') !== -1) {
            mutationObserver.observe(document.body, {childList: true, subtree: true});
        }
    } else {
        mutationObserver.observe(document.body, {childList: true, subtree: true});
    }

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.steampowered.com/ITwoFactorService/QueryTime/v0001',
        responseType: 'json',
        onload: function(response) {
            if (response.response && response.response.response && response.response.response.server_time) {
                timeOffset = response.response.response.server_time - Math.floor(Date.now() / 1000);
            }
        }
    });
})();
