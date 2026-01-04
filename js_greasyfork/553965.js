// ==UserScript==
// @name         FreeDNS.afraid.org 全页面汉化脚本
// @namespace    https://greasyfork.org/
// @version      0.0.3
// @description  汉化 FreeDNS.afraid.org 所有页面（含二级页面）的文本内容
// @author       自定义
// @match        https://freedns.afraid.org/*
// @license      GPL-3.0
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553965/FreeDNSafraidorg%20%E5%85%A8%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553965/FreeDNSafraidorg%20%E5%85%A8%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 扩展汉化映射表（覆盖首页+所有二级页面）
    const translations = {
        // 通用导航与账户
        "Home": "首页",
        "Domains": "域名",
        "Subdomains": "子域名",
        "Dynamic DNS": "动态DNS",
        "API": "接口",
        "Forums": "论坛",
        "Wiki": "帮助文档",
        "Login": "登录",
        "Register": "注册",
        "Logout": "退出登录",
        "My Account": "我的账户",
        "Dashboard": "控制台",
        "Profile": "个人资料",
        "Settings": "设置",
        "Billing": "账单",
        "Preferences": "偏好设置",
        "Change Password": "修改密码",
        "Account Status": "账户状态",
        
        // 域名管理页面
        "Manage Domains": "管理域名",
        "Add a Domain": "添加域名",
        "Domain List": "域名列表",
        "Registered Domains": "已注册域名",
        "Expiration Date": "过期日期",
        "Domain Owner": "域名所有者",
        "Nameservers": " nameserver 服务器",
        "Default Nameservers": "默认 nameserver",
        "Custom Nameservers": "自定义 nameserver",
        "Update Nameservers": "更新 nameserver",
        "Domain Statistics": "域名统计",
        "Total Records": "总记录数",
        "Active Records": "活跃记录",
        "Pending Approval": "待审核",
        "Domain Status": "域名状态",
        "Active": "活跃",
        "Inactive": "未激活",
        "Suspended": "已暂停",
        
        // 子域名管理页面
        "Manage Subdomains": "管理子域名",
        "Add a Subdomain": "添加子域名",
        "Subdomain List": "子域名列表",
        "Subdomain": "子域名",
        "Domain": "所属域名",
        "Target": "目标地址",
        "Last Updated": "最后更新",
        "Create Subdomain": "创建子域名",
        "Subdomain Prefix": "子域名前缀",
        "Available Domains": "可用主域名",
        "Subdomain Type": "子域名类型",
        "A Record": "A 记录",
        "AAAA Record": "AAAA 记录",
        "CNAME Record": "CNAME 记录",
        "MX Record": "MX 记录",
        "TXT Record": "TXT 记录",
        "SRV Record": "SRV 记录",
        "PTR Record": "PTR 记录",
        
        // 动态DNS页面
        "Dynamic DNS Clients": "动态DNS客户端",
        "DDNS Updates": "DDNS更新",
        "Update URL": "更新链接",
        "Client Configuration": "客户端配置",
        "Manual Update": "手动更新",
        "Automated Update": "自动更新",
        "Update Frequency": "更新频率",
        "Current IP": "当前IP",
        "Last IP": "上次IP",
        "IP History": "IP历史",
        "DDNS Scripts": "DDNS脚本",
        "Windows Client": "Windows客户端",
        "Linux Client": "Linux客户端",
        "Router Setup": "路由器设置",
        "Update Token": "更新令牌",
        
        // 记录管理页面
        "DNS Records": "DNS记录",
        "Add Record": "添加记录",
        "Edit Record": "编辑记录",
        "Delete Record": "删除记录",
        "Record Details": "记录详情",
        "Record Name": "记录名称",
        "Record Type": "记录类型",
        "Value": "值",
        "TTL (Time to Live)": "TTL（生存时间）",
        "Priority": "优先级（MX记录）",
        "Weight": "权重（SRV记录）",
        "Port": "端口（SRV记录）",
        "Target Host": "目标主机（SRV记录）",
        "Text Data": "文本内容（TXT记录）",
        "Record Status": "记录状态",
        "Enabled": "已启用",
        "Disabled": "已禁用",
        
        // 表单与操作提示
        "Domain Name": "域名名称",
        "Subdomain Name": "子域名名称",
        "Destination IP": "目标IP",
        "Description": "描述",
        "Email Address": "邮箱地址",
        "Password": "密码",
        "Confirm Password": "确认密码",
        "Remember Me": "记住我",
        "Forgot Password?": "忘记密码？",
        "Your DNS records have been updated": "DNS记录已更新",
        "Success": "成功",
        "Error": "错误",
        "Warning": "警告",
        "Please login to access this page": "请登录后访问此页面",
        "You have no domains yet": "暂无域名",
        "Create your first domain now": "立即创建第一个域名",
        "Are you sure you want to delete this?": "确定要删除吗？",
        "This action cannot be undone": "此操作不可撤销",
        "Update Successful": "更新成功",
        "Creation Failed": "创建失败",
        "Invalid Input": "输入无效",
        "Required Field": "必填项",
        "Please enter a valid domain": "请输入有效的域名",
        "Please enter a valid IP address": "请输入有效的IP地址",
        
        // 其他页面文本
        "Free DNS Hosting": "免费DNS解析服务",
        "Free subdomains and DNS hosting": "免费子域名及DNS解析服务",
        "Reliable DNS": "稳定DNS",
        "Fast DNS": "快速DNS",
        "No Ads": "无广告",
        "Unlimited": "无限制",
        "Support": "支持",
        "Help": "帮助",
        "About": "关于",
        "FAQ": "常见问题",
        "Terms of Service": "服务条款",
        "Privacy Policy": "隐私政策",
        "Contact Us": "联系我们",
        "Donate": "捐赠",
        "Premium Features": "高级功能",
        "API Documentation": "接口文档",
        "Rate Limiting": "速率限制",
        "Usage Statistics": "使用统计",
        "Recent Activity": "最近活动",
        "Notifications": "通知"
    };

    // 替换文本的核心函数（适配文本节点、属性值等）
    function replaceText(node) {
        if (node.nodeType === 3) { // 文本节点
            let text = node.textContent.trim();
            if (translations[text]) {
                node.textContent = translations[text];
            } else {
                // 模糊匹配长文本中的关键词
                Object.keys(translations).forEach(orig => {
                    if (text.includes(orig) && !text.includes(translations[orig])) {
                        node.textContent = text.replace(orig, translations[orig]);
                    }
                });
            }
        } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE', 'CODE'].includes(node.tagName)) {
            // 处理属性文本（placeholder/title/alt等）
            ['placeholder', 'title', 'alt'].forEach(attr => {
                if (node.hasAttribute(attr)) {
                    let value = node.getAttribute(attr);
                    if (translations[value]) {
                        node.setAttribute(attr, translations[value]);
                    }
                }
            });
            // 递归处理子节点
            node.childNodes.forEach(child => replaceText(child));
        }
    }

    // 初始汉化
    replaceText(document.body);

    // 监听动态加载内容（适配AJAX刷新的页面）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) replaceText(node);
            });
        });
    });
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true // 监听属性变化（如动态添加的提示）
    });
})();
