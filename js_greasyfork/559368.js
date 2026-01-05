// ==UserScript==
// @name         超星职教云无敌我的世界专属自动评价评分课件 (我的世界史蒂夫专属)
// @namespace    http://tampermonkey.net/
// @version      1.21.130
// @description  我的世界！。
// @icon  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAATlBMVEVSpTVRpDRJli9PoDNMmzEAAwABDgIAAAA9eydUqTY9eygCAAUJCAhdpEE2ZiQfRxUgQRU6diYGFQUOIgk3byRGeTEVGhFBgCpYqztis0Op4b1OAAAAiUlEQVR4AdXLBQ7EIBRF0Y9Td9v/QvG6xEZvhZecAH8YwjZiJ3ETbZAyzrmQEUAkhZmMblHYAtrOGFuMT/h8M0nTNPHo5hYhs+WFKXcTDkVRKUxlFMEpQqlHSsnpXlU33CJv6io6YiuW2g9il5m6G5SRSV5h1fdDZM6h76sjwjhN4+Y8hNDmfGsa0OAJeZWq1QUAAAAASUVORK5CYII=
// @author       热爱我的世界，漫威争锋，王者荣耀，揍击派对，超级鸡马，画画狼人杀的无敌史蒂夫
// @match        *://*.chaoxing.com/*
// @match        *://*.erya100.com/*
// @match        *://i.mooc.chaoxing.com/*
// @match        *://*.icve.com.cn/*
// @match        *://zjy2.icve.com.cn/*
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559368/%E8%B6%85%E6%98%9F%E8%81%8C%E6%95%99%E4%BA%91%E6%97%A0%E6%95%8C%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E4%B8%93%E5%B1%9E%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E8%AF%84%E5%88%86%E8%AF%BE%E4%BB%B6%20%28%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E5%8F%B2%E8%92%82%E5%A4%AB%E4%B8%93%E5%B1%9E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559368/%E8%B6%85%E6%98%9F%E8%81%8C%E6%95%99%E4%BA%91%E6%97%A0%E6%95%8C%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E4%B8%93%E5%B1%9E%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E8%AF%84%E5%88%86%E8%AF%BE%E4%BB%B6%20%28%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E5%8F%B2%E8%92%82%E5%A4%AB%E4%B8%93%E5%B1%9E%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var STORAGE_KEY = "steve_custom_review_text";
    var my_text = localStorage.getItem(STORAGE_KEY) || "好";

    var loop_time = 2000;
    var wait_jump = 3000;
    var wait_expand = 2500;
    var max_try = 12;
    var start_step = 3;

    var is_submitted = false;
    var old_url = window.location.href;
    var is_jumping = false;
    var step = start_step;
    var last_len = 0;

    console.log("无敌史蒂夫V9.0启动！当前评价内容：" + my_text);


    function createGui() {
        var btn = document.createElement('div');
        btn.innerText = "🟩 点击开始/设置评价";
        btn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #2ea44f;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 999999;
            cursor: pointer;
            font-weight: bold;
            font-family: "Microsoft YaHei", sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            border: 2px solid #fff;
            transition: all 0.3s;
        `;

        // 鼠标放上去的效果
        btn.onmouseover = function() { btn.style.transform = "scale(1.05)"; };
        btn.onmouseout = function() { btn.style.transform = "scale(1)"; };


        btn.onclick = function() {

            var input = prompt("亲爱的卡卡你要评价什么呀？", my_text);


            if (input !== null) {
                if(input.trim() === "") {

                    alert(" 不能填空的哦，已恢复默认！");
                } else {
                    my_text = input;

                    localStorage.setItem(STORAGE_KEY, input);
                    alert("设置成功！接下来的评价内容都是：\n" + input);
                    console.log("内容已更新为：" + my_text);
                }
            }
        };

        document.body.appendChild(btn);
    }

    function fakeInput(el, val) {
        if (!el || el.value === val) return;
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.blur();
    }

    function run() {

        if (window.location.href !== old_url) {
            console.log("页面变了，重置状态");
            old_url = window.location.href;
            is_submitted = false;
            is_jumping = false;
            step = start_step;
            last_len = 0;
            return;
        }
        if (is_jumping) return;

        if (!is_submitted) {
            doJob();
        }
    }

    function doJob() {
        var inputs = document.querySelectorAll('input[placeholder*="标题"], textarea[placeholder*="内容"]');
        var text_ok = false;
        var count = 0;


        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].offsetParent !== null) {

                if (inputs[i].value !== my_text) fakeInput(inputs[i], my_text);
                else count++;
            }
        }
        if (count > 0) text_ok = true;

        var star_ok = false;
        var stars = document.querySelectorAll('.el-rate__item');
        if (stars.length >= 5) {
            var s5 = stars[4];
            if (s5.offsetParent !== null) {
                var icon = s5.querySelector('i');
                if (icon && icon.classList.contains('el-icon-star-off')) s5.click();
                else star_ok = true;
            }
        } else {
            if(count > 0) star_ok = true;
        }

        if (text_ok && star_ok) {
            var btn = getSubmitBtn();
            if (btn && !btn.disabled) {
                console.log("搞定，提交！");
                btn.click();
                is_submitted = true;
                setTimeout(next, wait_jump);
            }
        }
    }

    function next() {
        if (isNone()) {
            console.log("没课了，开找目录");
            openMenu();
        } else {
            normalJump();
        }
    }

    function isNone() {
        var spans = document.querySelectorAll('.el-link--inner');
        for (var i = 0; i < spans.length; i++) {
            if (spans[i].innerText.trim() === "暂无") {
                var p = spans[i].closest('div') ? spans[i].closest('div').innerText : "";
                if (p.includes("下一个")) return true;
            }
        }
        return false;
    }

    function normalJump() {
        var t = null;
        var paths = ["//*[contains(text(), '下一个课件')]//a", "//*[contains(text(), '下一个课件')]/following-sibling::a"];
        for (var i = 0; i < paths.length; i++) {
            try {
                var r = document.evaluate(paths[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                if (r.singleNodeValue && r.singleNodeValue.offsetParent !== null) {
                    t = r.singleNodeValue;
                    break;
                }
            } catch(e) {}
        }
        if (t) t.click();
        else openMenu();
    }

    function openMenu() {
        is_jumping = true;
        var divs = document.querySelectorAll('div');
        var tab = null;
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].innerText.trim() === "课件目录") {
                tab = divs[i];
                break;
            }
        }

        if (tab) {
            if (step === start_step) {
                tab.click();
            }
            setTimeout(findNext, 1500);
        } else {
            is_jumping = false;
        }
    }

    function fixTitle(t) {
        if (!t) return "";
        var s = t.replace(/\.(pdf|mp4|png|jpg|html|ppt|pptx|doc|docx|V2|v2)$/i, '').trim();
        s = s.replace(/^[\d\s\.]+/g, '');
        return s;
    }

    function clickIt(el) {
        if (!el) return;
        var ts = el.closest('.ts');
        if (ts) { ts.click(); return; }
        var fi = el.closest('.fIteml');
        if (fi) { fi.click(); return; }
        el.click();
    }

    function getItems() {
        var sels = ['.courseDataTree .tit', '.listItem .tit', '.fIteml .name', '.fIteml .tit', '.h3', '.title'];
        var all = Array.from(document.querySelectorAll(sels.join(',')));
        return all.filter(function(x) { return x.offsetParent !== null; });
    }

    function findNext() {
        var all = getItems();
        var len = all.length;
        var h1 = document.querySelector('.courseName');
        if (!h1) { is_jumping = false; return; }

        var myTitle = fixTitle(h1.innerText.trim());
        if (step === start_step) console.log("当前是：" + myTitle);

        var idx = -1;
        for (var i = 0; i < all.length; i++) {
            var txt = fixTitle(all[i].innerText);
            if (txt && (txt.includes(myTitle) || myTitle.includes(txt))) {
                idx = i;
                break;
            }
        }

        if (idx === -1) {
             if (step > start_step) {
                 setTimeout(findNext, 1000);
                 return;
             } else {
                var rows = document.querySelectorAll('.courseDataTree .ts');
                for (var k = 0; k < rows.length; k++) {
                    if (rows[k].getAttribute('data-op') !== '1') {
                        rows[k].click();
                        rows[k].setAttribute('data-op', '1');
                    }
                }
                setTimeout(findNext, wait_expand);
                return;
             }
        }

        if (idx !== -1) {
            if (last_len > 0 && len < last_len) {
                step = 1;
                var rIdx = idx + step;
                 if (rIdx < all.length) {
                    clickIt(all[rIdx]);
                    last_len = len;
                    setTimeout(findNext, wait_expand);
                    return;
                }
            }
            last_len = len;

            var aim = idx + step;
            if (aim < all.length) {
                var nextEl = all[aim];
                console.log("点这里：" + nextEl.innerText);
                clickIt(nextEl);

                setTimeout(function() {
                    if (window.location.href === old_url) {
                        step++;
                        if (step > max_try) step = start_step;
                        findNext();
                    }
                }, wait_expand);

            } else {
                console.log("到底了");
                is_jumping = false;
            }
        }
    }

    function getSubmitBtn() {
        var btns = document.querySelectorAll('button.el-button--primary');
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].offsetParent !== null && btns[i].innerText.includes("提交")) {
                return btns[i];
            }
        }
        return null;
    }


    createGui();
    // 启动循环
    setInterval(run, loop_time);

})();