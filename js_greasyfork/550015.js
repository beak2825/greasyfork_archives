// ==UserScript==
// @name         鼠标点击特效666
// @namespace    yeysou
// @license      MIT
// @version      0.1.6
// @description  鼠标点击网页任意地方，出文字符号表情的特效，颜色随机
// @author       yeysou
// @match        *://*/*
// @grant        none
// @icon         data:image/png;base64,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
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/550015/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88666.user.js
// @updateURL https://update.greasyfork.org/scripts/550015/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88666.meta.js
// ==/UserScript==
/* global $ */

var str = new Array("卐","我","超","牛","逼");
function getRandomInt(min, max) {
    // 确保参数为整数
    min = Math.ceil(min);
    max = Math.floor(max);
    // 生成 [min, max] 之间的随机整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function cleanZhiHu(){
    //添加去除知乎标题功能
    $(".QuestionHeader-title").hide();
    $(".css-2pfapc").hide();
    var $zhihuLink = $('a[aria-label="知乎"]');
    $zhihuLink.find("svg").remove();
    $zhihuLink.html("<img  style='width: 100%;' src='data:image/png;base64,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'/>")
    const $favicon = $('link[crossorigin=""][rel="shortcut icon"][type="image/x-icon"][href="https://static.zhihu.com/heifetz/favicon.ico"]');
    console.log("-------------------")
    console.log( $favicon)
    //$favicon.remove()
}
(function() {
    'use strict';
    //知乎相关功能
    //cleanZhiHu();
    //缓慢消失
    function scaleFadeOut(options) {
        // 默认配置
        const settings = $.extend({
            scale: 2,// 放大倍数（2表示放大到原来的2倍）
            duration: 800,// 动画持续时间(毫秒)
            easing: 'swing' // 缓动函数
        }, options);

        const $element = options.element;
        // 记录原始样式（用于动画结束后恢复，可选）
        const originalTransform = $element.css('transform');
        const originalOpacity = $element.css('opacity');
        // 执行放大消失动画
        $element.animate({
            opacity: 0 // 透明度逐渐变为0
        }, {
            duration: settings.duration,
            easing: settings.easing,
            // 每帧更新缩放比例
            step: function(now, fx) {
                // 计算当前进度（0-1）
                const progress = now === 0 ? 1 : (1 - now);
                // 根据进度计算缩放比例（从1到设定的放大倍数）
                const scaleValue = 1 + (settings.scale - 1) * (1 - progress);
                // 应用缩放变换
                $(this).css('transform', `scale(${scaleValue})`);
            },
            // 动画结束回调
            complete: function() {
                // 恢复原始样式（如果需要）
                $(this).css({
                    transform: originalTransform,
                    opacity: originalOpacity
                });
                // 触发自定义回调
                if (settings.complete) {
                    settings.complete.call(this);
                }
            }
        });

        // 支持链式调用
        return this;
    };
    // 定义带弧度的跳跃效果jQuery方法
    function arcBounce(options) {
        // 默认配置
        const settings = $.extend({
            distance: 300, // 水平总距离
            height: 150, // 跳跃高度
            jumps: 3,// 跳跃次数
            duration: 1000,// 单次跳跃持续时间(ms)
            gravity: 0.8,// 重力系数(值越大下落越快)
            damping: 0.7// 阻尼系数(每次跳跃衰减比例)
        }, options);

        const $element = options.element;
        const originalPosition = $element.css('position');
        const startLeft = parseInt($element.css('left') || 0);
        const startTop = parseInt($element.css('top') || 0);

        // 确保元素可以被定位
        if (!['absolute', 'fixed', 'relative'].includes(originalPosition)) {
            $element.css('position', 'relative');
        }

        // 执行多段弧形跳跃
        let currentLeft = startLeft;
        let currentJump = 0;

        function performJump() {
            if (currentJump >= settings.jumps) {
                // 所有跳跃完成后的回调
                if (settings.complete) {
                    settings.complete.call($element);
                }
                return;
            }

            // 计算当前跳跃的参数(随次数衰减)
            const jumpDistance = settings.distance * Math.pow(settings.damping, currentJump);
            const jumpHeight = settings.height * Math.pow(settings.damping, currentJump);
            const jumpDuration = settings.duration * (1 - currentJump * 0.1); // 后续跳跃稍慢
            const targetLeft = currentLeft - jumpDistance;

            let startTime;
            let progress = 0;

            // 抛物线跳跃动画
            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                progress = Math.min(elapsed / jumpDuration, 1);

                // 计算水平位置(线性移动)
                const newLeft = currentLeft - (jumpDistance * progress);

                // 计算垂直位置(抛物线轨迹: y = -4h(x² - x)，形成弧形)
                // 加入重力效果，使下落更快
                const arcProgress = -4 * jumpHeight * (progress * progress - progress);
                const gravityEffect = Math.pow(progress - 0.5, 2) * settings.gravity * jumpHeight;
                const newTop = startTop - (arcProgress - gravityEffect);

                // 应用新位置
                $element.css({
                    left: newLeft + 'px',
                    top: newTop + 'px',
                    // transform: 'rotate('+progress*360+'deg)'
                });

                // 继续动画或结束当前跳跃
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    currentLeft = targetLeft;
                    currentJump++;
                    // 稍微延迟后开始下一次跳跃，增强节奏感
                    setTimeout(performJump, 0);
                }
            }

            requestAnimationFrame(animate);
        }

        // 开始第一段跳跃
        performJump();

        // 支持链式调用
        return this;
    };
    // 跳动效果函数
    function bounce($element) {
        const originalPosition = $element.css('position');
        const originalTop = $element.css('top');
        const originalLeft = $element.css('left');
        const bounceDamping = 0.8; // 弹跳阻尼（每次弹起高度衰减比例，0-1之间）

        // 确保元素可以被定位
        if (originalPosition !== 'absolute' && originalPosition !== 'fixed') {
            $element.css('position', 'relative');
        }

        // 记录初始位置（用于计算相对移动）
        const startTop = parseInt($element.css('top') || 0);
        const startLeft = parseInt($element.css('left') || 0);

        /*

            .animate({ top: startTop,left:startLeft-500*(1-bounceDamping)}, 200, 'swing')//落地
            .animate({ top: startTop - 150*bounceDamping**2,left:startLeft-500*(1-bounceDamping**2) }, 200, 'swing')//向上跳
            .animate({ top: startTop,left:startLeft-500*(1-bounceDamping**2)}, 200, 'swing')//落地
            .animate({ top: startTop - 150*bounceDamping**3,left:startLeft-500*(1-bounceDamping**3) }, 200, 'swing')//向上跳
            .animate({ top: startTop,left:startLeft-500*(1-bounceDamping**3)}, 200, 'swing')//落地
            .animate({ top: startTop - 150*bounceDamping**4,left:startLeft-500*(1-bounceDamping**4) }, 200, 'swing')//向上跳*/
        // 1. 跳动效果（向上再落下）
        // 2. 落地后旋转并向左移动
        $element.animate({
            //left: startLeft - 800,// 向左移动200px
            left:startLeft - 500,
            rotate: '-720deg'// 旋转360度
        }, {
            duration: 2000,
            easing: 'swing',
            step: function(now, fx) {
                // 处理旋转动画（jQuery本身不支持rotate，需要手动设置transform）
                if (fx.prop === 'rotate') {
                    var opa= $(this).css("opacity");
                    $(this).css('opacity', opa-0.005);
                    $(this).css('transform', `rotate(${now}deg)`);
                }
            },
            complete: () => {
                //$element.remove();
                scaleFadeOut({
                    element:$element,
                    scale: 10,// 放大到3倍
                    duration: 500,// 1秒内完成动画
                    complete: function() {
                        // 动画结束后可以隐藏或移除元素
                        $(this).remove();
                        // 如需重复使用，可在适当时候显示
                        // setTimeout(() => $(this).show(), 1000);
                    }
                });
            }
        });
    }
    var a_idx = 0;
    const 前颜色码库 = new Array('00', '11', '22', '1', '44', '55', '66', '77', '88', '99',
                            'aa', 'bb', 'cc', 'dd', 'ee', 'ff');
    const 中颜色码库 = new Array('00', '11', '22', '33', '44', '55', '66', '77', '88', '99',
                            'aa', 'bb', 'cc', 'dd', 'ee', 'ff');
    const 后颜色码库 = new Array('00', '11', '22', '33', '44', '55', '66', '77', '88', '99',
                            'aa', 'bb', 'cc', 'dd', 'ee', 'ff');
    var 前颜色码 ;var 中颜色码;var 后颜色码;
    var timerrrr = setInterval(function(){

        前颜色码 = Math.floor(Math.random() * 前颜色码库.length);
        中颜色码 = Math.floor(Math.random() * 中颜色码库.length);
        后颜色码 = Math.floor(Math.random() * 后颜色码库.length);
    },150)
    $("body").click(function(e) {
        var $i = $("<span/>").text(str[a_idx]);
        a_idx = (a_idx + 1) % str.length;
        var x = e.pageX,
            y = e.pageY;
        var size = getRandomInt(30,60);
        $i.css({
            "z-index": 99999999,
            "top": y-size-10,
            "left": x-size,
            "font-size":size,
            "position": "absolute",
            "font-weight": "bold",
            "color": "#" + 前颜色码库[前颜色码] + 中颜色码库[中颜色码] + 后颜色码库[后颜色码]
        });
        $("body").append($i);
        var rt = getRandomInt(2,5);
        var rl = getRandomInt(3,6);
        //bounce($i)
        // move($i)
        arcBounce({
            element:$i,
            distance: rl*50, // 水平距离
            height: 50*rt, // 跳跃高度
            jumps: 10,// 跳跃次数
            duration: 300,// 单次跳跃时间
            gravity: 1,// 重力系数
            damping: 0.6,// 阻尼系数
            complete: function() {
                // 跳跃完成后的回调函数
                bounce($i);
            }
        });
    });
})();
