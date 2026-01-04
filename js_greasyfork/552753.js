// ==UserScript==
// @name         ADeal V1.8 - BFCM Enhanced
// @namespace    http://tampermonkey.net/
// @version      2025-10-16-bfcm
// @description  Always Day One - BFCM Enhanced Version with Calendar Switch
// @author       wquanbao@amazon.com
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.ie/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.ae/*
// @match        https://*.amazon.sa/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/552753/ADeal%20V18%20-%20BFCM%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/552753/ADeal%20V18%20-%20BFCM%20Enhanced.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let currentView = "main";
    let widget = null;
    let mpDropdownOpen = false;
    let usefulLinksOpen = false;
    
    setTimeout(function() {
        createFloatingIcon();
    }, 1000);
    
    function createFloatingIcon() {
        const icon = document.createElement("div");
        icon.id = "adeal-icon";
        icon.style.cssText = "position: fixed; top: 50px; right: 20px; width: 50px; height: 50px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; cursor: pointer; z-index: 99999; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3); transition: transform 0.2s;";
        icon.textContent = "ADeal";
        icon.addEventListener("click", toggleWidget);
        icon.addEventListener("mouseenter", function() { icon.style.transform = "scale(1.1)"; });
        icon.addEventListener("mouseleave", function() { icon.style.transform = "scale(1)"; });
        document.body.appendChild(icon);
    }
    
    function toggleWidget() {
        if (widget) {
            document.body.removeChild(widget);
            widget = null;
        } else {
            createWidget();
        }
    }
    
    function createWidget() {
        widget = document.createElement("div");
        widget.id = "adeal-widget";
        widget.style.cssText = "position: fixed; top: 50px; right: 80px; width: 320px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); z-index: 99998; font-family: Calibri, sans-serif; overflow: visible;";
        
        updateWidgetContent();
        document.body.appendChild(widget);
    }
    
    function updateWidgetContent() {
        if (currentView === "main") {
            widget.innerHTML = getMainContent();
        } else if (currentView === "au") {
            widget.innerHTML = getAUContent();
        } else if (currentView === "feature-update") {
            widget.innerHTML = getFeatureUpdateContent();
        } else if (currentView === "faq") {
            widget.innerHTML = getFAQContent();
        } else {
            widget.innerHTML = getRegionContent(currentView);
        }
        
        setTimeout(bindEvents, 100);
    }
    
    function getMainContent() {
        const now = new Date();
        const beijingTime = now.toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        return '<div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 12px; text-align: center;"><div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">ADeal</div><div style="font-size: 12px;" id="current-time">' + beijingTime + '</div></div><div style="padding: 12px; background: #f8fafc;"><div style="display: flex; gap: 8px; margin-bottom: 8px;"><div style="position: relative; flex: 1;"><div id="mp-dropdown" style="background: #ff9900; color: white; padding: 8px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-weight: bold; font-size: 13px;"><span>MP</span><span style="font-size: 10px;">▼</span></div><div id="mp-options" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ff9900; border-radius: 6px; margin-top: 2px; display: none; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"><div class="mp-option" data-value="au" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0;">AU</div><div class="mp-option" data-value="mena" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0;">MENA</div><div class="mp-option" data-value="eu5" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0;">EU5</div><div class="mp-option" data-value="eux" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0;">EUX</div><div class="mp-option" data-value="jp" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0;">JP</div><div class="mp-option" data-value="latam" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0;">LATAM</div><div class="mp-option" data-value="in" style="padding: 10px 12px; cursor: pointer; font-weight: bold; font-size: 12px;">IN</div></div></div><div style="position: relative; flex: 1;"><div id="useful-links" style="background: #374151; color: white; padding: 8px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-weight: bold; font-size: 13px;"><span>Useful Links</span><span style="font-size: 10px;">▼</span></div><div id="useful-options" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #374151; border-radius: 6px; margin-top: 2px; display: none; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"><div class="useful-option" data-action="upcoming" style="padding: 8px 10px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Upcoming Dashboard</div><div class="useful-option" data-action="au-rrp" style="padding: 8px 10px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">AU RRP Dashboard</div><div class="useful-option" data-action="feature-update" style="padding: 8px 10px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Feature Update</div><div class="useful-option" data-action="faq" style="padding: 8px 10px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">FAQ</div><div class="useful-option" data-action="dailyorder" style="padding: 8px 10px; cursor: pointer; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Dailyorder</div><div class="useful-option" data-action="buybox" style="padding: 8px 10px; cursor: pointer; font-weight: bold; font-size: 12px; white-space: nowrap;">Buybox Checking</div></div></div></div></div>';
    }
    
    function getAUContent() {
        const bfcmCalendarEnabled = localStorage.getItem('bfcm-calendar-enabled') === 'true';
        const bfcmReminderEnabled = localStorage.getItem('bfcm-reminder-enabled') === 'true';
        return '<div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 12px;"><button class="back-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 8px; font-size: 11px;">← 返回</button><div style="font-size: 16px; font-weight: bold; text-align: center;">AU 促销活动</div></div><div style="padding: 12px; background: #f0fdf4; max-height: 400px; overflow-y: auto;"><div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 3px solid #10b981;"><div style="font-size: 12px; font-weight: bold; color: #059669; margin-bottom: 4px;">PBDD - 2025年10月</div><div style="font-size: 10px; color: #374151; margin-bottom: 2px;">活动时间：10/7 00:00 - 10/13 23:59 (澳洲时间)</div><div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">北京时间：10/6 21:00 - 10/14 20:59</div><div style="font-size: 10px; color: #059669;" id="pbdd-countdown">倒计时：计算中...</div></div><div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 3px solid #10b981;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;"><div style="font-size: 12px; font-weight: bold; color: #059669;">BFCM - 2025年11月</div><div style="display: flex; align-items: center; gap: 6px;"><span style="font-size: 10px; color: #374151;">📅</span><div class="ios-switch" id="bfcm-calendar-switch" style="position: relative; width: 32px; height: 18px; background: ' + (bfcmCalendarEnabled ? '#34d399' : '#d1d5db') + '; border-radius: 9px; cursor: pointer; transition: background 0.3s;"><div style="position: absolute; top: 1px; left: ' + (bfcmCalendarEnabled ? '15px' : '1px') + '; width: 16px; height: 16px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div></div></div></div><div style="font-size: 10px; color: #374151; margin-bottom: 2px;">活动时间：11/18 00:00 - 12/1 23:59 (澳洲时间)</div><div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">北京时间：11/18 21:00 - 12/1 20:59</div><div style="font-size: 10px; color: #059669; margin-bottom: 8px;" id="bfcm-countdown">倒计时：计算中...</div><div id="bfcm-requirements" style="display: ' + (bfcmCalendarEnabled ? 'block' : 'none') + '; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 4px; padding: 8px; margin-top: 8px;"><div style="font-size: 11px; font-weight: bold; color: #0369a1; margin-bottom: 6px;">📋 促销提报要求</div><div style="font-size: 10px; color: #374151; line-height: 1.4; margin-bottom: 6px;"><strong>1. 卖家后台活动提报时间：</strong><br>17/06/2025 00:00 - 17/10/2025 23:59 (澳洲时间)<br>北京时间：16/06/2025 21:00 - 17/10/2025 20:59</div><div style="font-size: 10px; color: #374151; line-height: 1.4; margin-bottom: 6px;"><strong>2. 价格要求：</strong><br>Minimum 15% off T30 lowest price or $300 off</div><div style="font-size: 10px; color: #374151; line-height: 1.4; margin-bottom: 6px;"><strong>3. 星级要求：</strong><br>4+ Stars or 0 stars if no reviews</div><div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;"><span style="font-size: 10px; color: #dc2626;">🔔</span><div class="ios-switch" id="bfcm-reminder-switch" style="position: relative; width: 32px; height: 18px; background: ' + (bfcmReminderEnabled ? '#34d399' : '#d1d5db') + '; border-radius: 9px; cursor: pointer; transition: background 0.3s;"><div style="position: absolute; top: 1px; left: ' + (bfcmReminderEnabled ? '15px' : '1px') + '; width: 16px; height: 16px; background: white; border-radius: 50%; transition: left 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div></div><span style="font-size: 10px; color: #374151;">提报截止前3天提醒</span></div></div></div><div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 3px solid #dc2626;"><div style="font-size: 12px; font-weight: bold; color: #dc2626; margin-bottom: 4px;">Boxing Day</div><div style="font-size: 10px; color: #374151; margin-bottom: 2px;">活动时间：2025/12/24 00:00 - 2025/12/30 23:59 (澳洲时间)</div><div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">北京时间：2025/12/23 21:00 - 2025/12/30 20:59</div><div style="font-size: 10px; color: #dc2626; margin-bottom: 4px;" id="boxing-countdown">倒计时：计算中...</div><a href="https://amazonextna.qualtrics.com/jfe/form/SV_bvV8tr4WsOAljN4" target="_blank" style="font-size: 10px; color: #059669; text-decoration: none;">🔗 提报链接</a></div><div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 3px solid #7c3aed;"><div style="font-size: 12px; font-weight: bold; color: #7c3aed; margin-bottom: 4px;">Back to School</div><div style="font-size: 10px; color: #374151; margin-bottom: 2px;">活动时间：2026/1/6 00:00 - 2026/2/2 23:59 (澳洲时间)</div><div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">北京时间：2026/1/5 21:00 - 2026/2/2 20:59</div><div style="font-size: 10px; color: #7c3aed;" id="school-countdown">倒计时：计算中...</div></div><div style="background: white; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 3px solid #ec4899;"><div style="font-size: 12px; font-weight: bold; color: #ec4899; margin-bottom: 4px;">Mother\'s Day</div><div style="font-size: 10px; color: #374151; margin-bottom: 2px;">活动时间：2026/4/20 00:00 - 2026/5/10 23:59 (澳洲时间)</div><div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">北京时间：2026/4/19 21:00 - 2026/5/10 20:59</div><div style="font-size: 10px; color: #ec4899;" id="mothers-countdown">倒计时：计算中...</div></div><div style="background: white; border-radius: 6px; padding: 12px; border-left: 3px solid #f59e0b;"><div style="font-size: 12px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">Big Smile Sale</div><div style="font-size: 10px; color: #6b7280; text-align: center;">敬请期待...</div></div></div>';
    }
    
    function getFeatureUpdateContent() {
        return '<div style="background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 12px;"><button class="back-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 8px; font-size: 11px;">← 返回</button><div style="font-size: 16px; font-weight: bold; text-align: center;">Feature Update</div></div><div style="padding: 12px; background: #faf5ff; max-height: 400px; overflow-y: auto;"><div style="background: white; border-radius: 6px; padding: 16px; border-left: 3px solid #7c3aed;"><div style="font-size: 14px; font-weight: bold; color: #7c3aed; margin-bottom: 12px;">【竞品价格刷新功能】</div><div style="font-size: 12px; line-height: 1.5; color: #374151; margin-bottom: 12px;">各位卖家注意啦，亚马逊上线了竞品价格刷新功能！以后如果遇到ASIN被系统判定失去购物车（Featured Offer），但是您确定竞品价格已发生变化您的购物车应该回来的时候，可以通过卖家后台快速自助处理，无需开case给客服。系统会自动帮助您匹配竞品价格抢回购物车，最快30分钟就能出结果。</div><div style="font-size: 12px; font-weight: bold; color: #7c3aed; margin-bottom: 8px;">使用步骤：</div><div style="font-size: 11px; line-height: 1.4; color: #374151;"><div style="margin-bottom: 4px;">1. 登录卖家后台（Seller Central），将语言切换为 English</div><div style="margin-bottom: 4px;">2. 在顶部搜索框输入 "check featured offer eligibility"</div><div style="margin-bottom: 4px;">3. 点击 Recommendation Solution – Featured Offer</div><div style="margin-bottom: 4px;">4. 输入需要检查的已经丢失购物车的 ASIN 并create a case</div><div>5. 系统将自动进行价格刷新并反馈您的报价是否获得黄金购物车资格</div></div></div></div>';
    }
    
    function getFAQContent() {
        return '<div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 12px;"><button class="back-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 8px; font-size: 11px;">← 返回</button><div style="font-size: 16px; font-weight: bold; text-align: center;">FAQ</div></div><div style="padding: 12px; background: #f0fdf4; max-height: 400px; overflow-y: auto;"><div style="background: white; border-radius: 6px; padding: 16px; border-left: 3px solid #10b981;"><div style="font-size: 14px; font-weight: bold; color: #059669; margin-bottom: 12px;">常见问题1：PBDD活动Deal展示说明</div><div style="font-size: 12px; line-height: 1.5; color: #374151; margin-bottom: 12px;">PBDD活动中所有 Deals（包括手动创建和Seller Central提交） 默认Deal类型均为Prime Exclusive的Deals。在此类型下，Prime会员与非会员看到的页面展示可能会出现以下两种情况：</div><div style="font-size: 12px; font-weight: bold; color: #059669; margin-bottom: 8px;">1️⃣ 正常展示情况</div><div style="font-size: 11px; line-height: 1.4; color: #374151; margin-bottom: 12px;">若ASIN的 原价（List Price）与Deal价均具备竞争力，即没有更低的竞品价格时，系统会正常识别该ASIN的价格逻辑。此时，<br>✅ Prime会员页面 与 非会员页面 的展示一致，<br>商品会显示促销标识与折扣价，买家均可正常购买。</div><div style="font-size: 12px; font-weight: bold; color: #059669; margin-bottom: 8px;">2️⃣ 失去购物车情况</div><div style="font-size: 11px; line-height: 1.4; color: #374151; margin-bottom: 12px;">若ASIN出现 "原价 > 竞品价 > Deal价" 的情况，系统会判定价格结构异常。此时，<br>✅ 在 Prime会员页面，Deal仍会显示为有效活动；<br>⚠️但在 非会员页面，ASIN可能 失去购物车（Buy Box），导致非会员无法直接购买。</div><div style="font-size: 12px; font-weight: bold; color: #dc2626; margin-bottom: 8px;">👉 建议您：</div><div style="font-size: 11px; line-height: 1.4; color: #374151;">若发现该问题，请尽快调整原价（可能需要同步调整Deal价格）或与客户经理沟通处理方案。</div></div></div>';
    }
    
    function getRegionContent(region) {
        const regionNames = {
            "mena": "MENA",
            "eu5": "EU5", 
            "eux": "EUX",
            "jp": "JP",
            "latam": "LATAM",
            "in": "IN"
        };
        
        const colors = {
            "mena": "#f59e0b",
            "eu5": "#3b82f6",
            "eux": "#8b5cf6", 
            "jp": "#ef4444",
            "latam": "#10b981",
            "in": "#f97316"
        };
        
        return '<div style="background: linear-gradient(135deg, ' + colors[region] + ', ' + colors[region] + 'dd); color: white; padding: 12px;"><button class="back-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 8px; font-size: 11px;">← 返回</button><div style="font-size: 16px; font-weight: bold; text-align: center;">' + regionNames[region] + ' 促销活动</div></div><div style="padding: 12px; background: #f8fafc;"><div style="background: white; border-radius: 6px; padding: 16px; text-align: center; color: #6b7280; border-left: 3px solid ' + colors[region] + ';"><div style="font-size: 16px;">' + regionNames[region] + ' 促销活动</div><div style="font-size: 14px; margin-top: 8px;">敬请期待...</div></div></div>';
    }
    
    function bindEvents() {
        const mpDropdown = document.getElementById("mp-dropdown");
        const mpOptions = document.getElementById("mp-options");
        const usefulLinks = document.getElementById("useful-links");
        const usefulOptions = document.getElementById("useful-options");
        const backBtn = document.querySelector(".back-btn");
        
        if (mpDropdown && mpOptions) {
            mpDropdown.addEventListener("click", function(e) {
                e.stopPropagation();
                mpDropdownOpen = !mpDropdownOpen;
                mpOptions.style.display = mpDropdownOpen ? "block" : "none";
                if (mpDropdownOpen && usefulLinksOpen) {
                    usefulLinksOpen = false;
                    usefulOptions.style.display = "none";
                }
            });
            
            const mpOptionElements = document.querySelectorAll(".mp-option");
            mpOptionElements.forEach(function(option) {
                option.addEventListener("click", function() {
                    currentView = this.getAttribute("data-value");
                    updateWidgetContent();
                });
            });
        }
        
        if (usefulLinks && usefulOptions) {
            usefulLinks.addEventListener("click", function(e) {
                e.stopPropagation();
                usefulLinksOpen = !usefulLinksOpen;
                usefulOptions.style.display = usefulLinksOpen ? "block" : "none";
            });
            
            const usefulOptionElements = document.querySelectorAll(".useful-option");
            usefulOptionElements.forEach(function(option) {
                option.addEventListener("click", function() {
                    const action = this.getAttribute("data-action");
                    if (action === "upcoming") {
                        window.open("https://us-east-1.quicksight.aws.amazon.com/sn/account/isscentralqs/dashboards/fe165af2-565f-43c7-9f43-ff1510871af2?edap=true", "_blank");
                    } else if (action === "au-rrp") {
                        window.open("https://us-east-1.quicksight.aws.amazon.com/sn/account/isscentralqs/dashboards/4b2b32a9-7510-4388-9f84-02e673192ccf?edap=true", "_blank");
                    } else if (action === "feature-update") {
                        currentView = "feature-update";
                        updateWidgetContent();
                    } else if (action === "faq") {
                        currentView = "faq";
                        updateWidgetContent();
                    } else if (action === "dailyorder") {
                        window.open("https://dailyorders.amazon.com/", "_blank");
                    } else if (action === "buybox") {
                        window.open("https://epi-fe.aka.amazon.com/product-intelligence#?marketplaceName=AU&qualifier=NEW&merchantCustomerId=6740020445&skus=B0DG8LLMJ8&facet=pricing-summary", "_blank");
                    }
                });
            });
        }
        
        document.addEventListener("click", function() {
            if (mpDropdownOpen) {
                mpDropdownOpen = false;
                if (mpOptions) mpOptions.style.display = "none";
            }
            if (usefulLinksOpen) {
                usefulLinksOpen = false;
                if (usefulOptions) usefulOptions.style.display = "none";
            }
        });
        
        if (backBtn) {
            backBtn.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                currentView = "main";
                updateWidgetContent();
            });
        }
        
        const timeElement = document.getElementById("current-time");
        if (timeElement) {
            setInterval(function() {
                const now = new Date();
                const beijingTime = now.toLocaleString("zh-CN", {
                    timeZone: "Asia/Shanghai",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
                timeElement.textContent = beijingTime;
            }, 1000);
        }
        
        if (currentView === "au") {
            updateCountdowns();
            setInterval(updateCountdowns, 1000);
            
            const bfcmCalendarSwitch = document.getElementById("bfcm-calendar-switch");
            if (bfcmCalendarSwitch) {
                bfcmCalendarSwitch.addEventListener("click", function() {
                    const isEnabled = localStorage.getItem('bfcm-calendar-enabled') === 'true';
                    const newState = !isEnabled;
                    localStorage.setItem('bfcm-calendar-enabled', newState.toString());
                    
                    const switchBg = this;
                    const switchCircle = this.querySelector('div');
                    switchBg.style.background = newState ? '#34d399' : '#d1d5db';
                    switchCircle.style.left = newState ? '15px' : '1px';
                    
                    const requirementsPanel = document.getElementById('bfcm-requirements');
                    if (requirementsPanel) {
                        requirementsPanel.style.display = newState ? 'block' : 'none';
                    }
                });
            }
            
            const bfcmReminderSwitch = document.getElementById("bfcm-reminder-switch");
            if (bfcmReminderSwitch) {
                bfcmReminderSwitch.addEventListener("click", function() {
                    const isEnabled = localStorage.getItem('bfcm-reminder-enabled') === 'true';
                    const newState = !isEnabled;
                    localStorage.setItem('bfcm-reminder-enabled', newState.toString());
                    
                    const switchBg = this;
                    const switchCircle = this.querySelector('div');
                    switchBg.style.background = newState ? '#34d399' : '#d1d5db';
                    switchCircle.style.left = newState ? '15px' : '1px';
                });
            }
            
            setInterval(checkBFCMReminder, 3600000);
        }
    }
    
    function checkBFCMReminder() {
        const isReminderEnabled = localStorage.getItem('bfcm-reminder-enabled') === 'true';
        if (!isReminderEnabled) return;
        
        const now = new Date();
        const submissionDeadline = new Date("2025-10-17T23:59:59+11:00");
        const threeDaysBefore = new Date(submissionDeadline.getTime() - (3 * 24 * 60 * 60 * 1000));
        
        if (now >= threeDaysBefore && now <= submissionDeadline) {
            const daysLeft = Math.ceil((submissionDeadline - now) / (1000 * 60 * 60 * 24));
            console.log('🔔 BFCM提醒：距离后台活动提报截止还有 ' + daysLeft + ' 天！');
            
            if (daysLeft <= 1) {
                alert('⚠️ 紧急提醒：BFCM活动提报将在' + daysLeft + '天内截止！\n\n请尽快完成提报：\n- 价格要求：Minimum 15% off T30 lowest price or $300 off\n- 星级要求：4+ Stars or 0 stars if no reviews');
            }
        }
    }
    
    function updateCountdowns() {
        const now = new Date();
        
        const pbddStart = new Date("2025-10-07T00:00:00+11:00");
        const pbddEnd = new Date("2025-10-13T23:59:59+11:00");
        const pbddElement = document.getElementById("pbdd-countdown");
        if (pbddElement) {
            if (now > pbddEnd) {
                pbddElement.textContent = "活动已结束";
                pbddElement.style.color = "#6b7280";
            } else if (now >= pbddStart) {
                pbddElement.textContent = "活动进行中";
                pbddElement.style.color = "#059669";
            } else {
                const diff = pbddStart - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                pbddElement.textContent = "倒计时：" + days + "天 " + hours + "小时 " + minutes + "分钟";
            }
        }
        
        const bfcmStart = new Date("2025-11-18T00:00:00+11:00");
        const bfcmEnd = new Date("2025-12-01T23:59:59+11:00");
        const bfcmElement = document.getElementById("bfcm-countdown");
        if (bfcmElement) {
            if (now > bfcmEnd) {
                bfcmElement.textContent = "活动已结束";
                bfcmElement.style.color = "#6b7280";
            } else if (now >= bfcmStart) {
                bfcmElement.textContent = "活动进行中";
                bfcmElement.style.color = "#059669";
            } else {
                const diff = bfcmStart - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                bfcmElement.textContent = "倒计时：" + days + "天 " + hours + "小时 " + minutes + "分钟";
            }
        }
        
        const boxingStart = new Date("2025-12-24T00:00:00+11:00");
        const boxingEnd = new Date("2025-12-30T23:59:59+11:00");
        const boxingElement = document.getElementById("boxing-countdown");
        if (boxingElement) {
            if (now > boxingEnd) {
                boxingElement.textContent = "活动已结束";
                boxingElement.style.color = "#6b7280";
            } else if (now >= boxingStart) {
                boxingElement.textContent = "活动进行中";
                boxingElement.style.color = "#dc2626";
            } else {
                const diff = boxingStart - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                boxingElement.textContent = "倒计时：" + days + "天 " + hours + "小时 " + minutes + "分钟";
            }
        }
        
        const schoolStart = new Date("2026-01-06T00:00:00+11:00");
        const schoolEnd = new Date("2026-02-02T23:59:59+11:00");
        const schoolElement = document.getElementById("school-countdown");
        if (schoolElement) {
            if (now > schoolEnd) {
                schoolElement.textContent = "活动已结束";
                schoolElement.style.color = "#6b7280";
            } else if (now >= schoolStart) {
                schoolElement.textContent = "活动进行中";
                schoolElement.style.color = "#7c3aed";
            } else {
                const diff = schoolStart - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                schoolElement.textContent = "倒计时：" + days + "天 " + hours + "小时 " + minutes + "分钟";
            }
        }
        
        const mothersStart = new Date("2026-04-20T00:00:00+10:00");
        const mothersEnd = new Date("2026-05-10T23:59:59+10:00");
        const mothersElement = document.getElementById("mothers-countdown");
        if (mothersElement) {
            if (now > mothersEnd) {
                mothersElement.textContent = "活动已结束";
                mothersElement.style.color = "#6b7280";
            } else if (now >= mothersStart) {
                mothersElement.textContent = "活动进行中";
                mothersElement.style.color = "#ec4899";
            } else {
                const diff = mothersStart - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                mothersElement.textContent = "倒计时：" + days + "天 " + hours + "小时 " + minutes + "分钟";
            }
        }
    }

})();