// ==UserScript==
// @name         WebView 错误美化
// @namespace    https://viayoo.com/h88v22
// @version      2.0
// @description  重绘的 WebView 错误页面，包含三种主题MIUIX/Windows11/IOS10，有GM环境的在脚本菜单切换，没有的在脚本编辑我有注释，并且给出一定程度上的解决方案。
// @author       Aloazny && Gemini
// @run-at       document-start
// @match        *://*/*
// @license       MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAUpSURBVGiB1ZrfaxxVFMc/N5Q0fchm89DWnzQpVsjS0sVYfBGSYrSPSWgLKmLTgAXfKvhsEv8B46tCs8GCSiNNX4TUH03AQqVN3VCJ0IitVVPbl0y2D7v15fhwZzI/Mrt7785us/nAsjN35t5zv5wzZ+7cexUWiMggMAR0AWkga1PfgjzgAHeBWaXUpbq1LCJdIjIlImuyday5fUgnFTO2xUKirInIWKU+qzJC0sAVGhdSSckDR5VSTvTCJkEikkWLSebexuOgReWDhSFBrmfu0PxiPBygO+ipFu8gEGbbRQzovl4JFrQEjs/SvM9MJbIiMu6dKNCpGfiF7eWdIBuht8MtGKeOYpwiXPoN7q7p8/yq/s8+o/+7OmGwB9K76mWRNDAJjHgeWqMOgqZvQm4R5v+IXBD3P5JT+/fDSC+ceimpZQAcpVSnEpEh4GKSlqZvwvj3vkdCCL6Q4HGArk4YH6iLsGElIjngVC21nSIMn4/xiEecgDKiQHvs4juJQvFTJSLzQJ9tzfwqnJ6B/P1w+bMpOHEIjh2AwmN488vw9a/egtROmFuBmVvwTyF8Pfs0TJ3wnzdLFnYAHba18qtw9HNwSn5ZeyuMDWgxHtfuxdfP7NW/D16Fc9fhk5/g0X9u2/d121feq0lURwuW7x6nqD0TFNOzG66+HxZjyugRXbdnd8BGybVRtG4u21L9njDD58NhdvwgfP02pNqsjW+QatNtHD/ol+Xva1G2WAmKpuSe3TD2WjIxHqk23VbQU7PL2qYNVoImfvCP21uTeyaK56n21nibJhgLyi2G3zNjA/UV45Fq08nC4+6anZesBHl4qblRjB7RNuJsV8NIkFOEhTv+eSPFxNlYuGOe8YwEzS6Hz48dMO1W7URtRPtQDiNB0TFaZq9Z40mI2ogdJ8Zg/R565XnbGrUTTOGmGAnyvmeeNMEsatoHs6RQqn5Ps2AkqH9/o7sRz6PH/rHpQNX6Gfr5L/N7M3vMysqx/ND8Xg8jQV2dEUMPzBpPtcFor38+2ms+uojaiPahHDuq3wJDGTgdOJ9bMU/dHw3AWXcoYzNUmlvZ3AcTjDyU3gV93f75N7+adgsu34YzF+HDb/WxKUEbfd3mn+XGz9BIIHT+XtdfmtXwxFy7B5dX9LGJqHPXtY0429WwErQvMNE1eRUKVdL5uRuby2ZuVa5TKOm2PfalGyQI9FTThmF3AqSaKBsKJbfNQLoO2jTBStBIb/hZWn4IH/9YXtToy5vLyo3UCyXdVjBVD/bYeQdAiYhUv83HKUL/Z7D0r1+W2eNOT8Vkscu3/TA7cQjeeHHzPZ5ngmIOPwXzZ+zn6JSI5IHDNpXyq1rUeiA0Ujv1l+bpGK9UYuqGnsYKhlnHTi2mhmmspUQTjSMXwp4CeK4DTh6C118o/65afgDf/Q4XboWzGWjPzL5r/iKNsJB4Knjoi/DXbJTMHj8UC6XKw5nBHsidTD4VnHiyPreoJ+v/3LSEa8a+tM5mtgkghmFvOcWhhinhKLlF/avksSB93VpEHYQArCul0p6gmsMuDqeo5wAqLXgNZeq64AUwrZTaWPBKo7ehJPbSFrEOdCmlnBYAd1l8cmv7lIhJb2k/uk/B+p3UBCwppTZWUOI2Xmyn0NsINa8gNJZzL/S7NzY760B/dL9Ppc1L8zRv+C0RIwbKjLaVUo4blxM0l7fWgQmlVDZOjBEikhaRnIg4T2pTXAyO24eqeynKLLCXFTdEeItmo0JyCb3dJQ/MK6VmTSv+D9sXVkySmRwbAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/563846/WebView%20%E9%94%99%E8%AF%AF%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563846/WebView%20%E9%94%99%E8%AF%AF%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
     // 常量设置初始主题: MIUIX, Windows, IOS
    const DEFAULT_THEME = 'MIUIX';

    const ERROR_PATTERNS = [
        /ERR_CONNECTION_REFUSED/i, /ERR_CONNECTION_TIMED_OUT/i, /ERR_INTERNET_DISCONNECTED/i,
        /ERR_CONNECTION_CLOSED/i, /ERR_NAME_NOT_RESOLVED/i, /ERR_SSL_PROTOCOL_ERROR/i,
        /ERR_PROXY_CONNECTION_FAILED/i, /ERR_CONNECTION_RESET/i, /ERR_CONNECTION_ABORTED/i,
        /ERR_NETWORK_CHANGED/i, /ERR_ADDRESS_UNREACHABLE/i, /ERR_ADDRESS_INVALID/i,
        /ERR_DNS_TIMED_OUT/i, /ERR_DNS_SERVER_FAILED/i, /ERR_SSL_VERSION_OR_CIPHER_MISMATCH/i,
        /ERR_CERT_AUTHORITY_INVALID/i, /ERR_CERT_DATE_INVALID/i, /ERR_CERT_COMMON_NAME_INVALID/i,
        /ERR_EMPTY_RESPONSE/i, /ERR_INVALID_RESPONSE/i, /ERR_CONTENT_LENGTH_MISMATCH/i,
        /ERR_TUNNEL_CONNECTION_FAILED/i, /ERR_TIMED_OUT/i, /ERR_FAILED/i, /ERR_ACCESS_DENIED/i,
        /ERR_BLOCKED_BY_CLIENT/i, /ERR_BLOCKED_BY_RESPONSE/i, /ERR_TOO_MANY_REDIRECTS/i,
        /ERR_UNSAFE_PORT/i, /ERR_UNSAFE_REDIRECT/i, /DNS_PROBE_FINISHED_NO_INTERNET/i,
        /DNS_PROBE_FINISHED_NXDOMAIN/i, /DNS_PROBE_STARTED/i, /PR_CONNECT_RESET_ERROR/i,
        /PR_END_OF_FILE_ERROR/i, /NS_ERROR_NET_TIMEOUT/i, /NS_ERROR_CONNECTION_REFUSED/i,
        /NS_ERROR_NET_RESET/i, /NS_ERROR_PROXY_CONNECTION_REFUSED/i, /ERR_FILE_NOT_FOUND/i,
        /ERR_REQUEST_RANGE_NOT_SATISFIABLE/i, /ERR_INVALID_HTTP_RESPONSE/i, /ERR_SSL_BAD_RECORD_MAC_ALERT/i,
        /ERR_DISALLOWED_URL_SCHEME/i, /ERR_UNKNOWN_URL_SCHEME/i
    ];

    let isApplied = false;

    function detect() {
        if (!document.body || isApplied) return false;
        const url = window.location.href;
        const text = document.body.textContent;
        const isInternalError = url.startsWith('chrome-error://') || url.includes('chromewebdata') || window.location.protocol === 'chrome-error:';
        if (isInternalError) return true;
        const isNativeStructure = document.querySelectorAll('a').length < 3 && document.querySelectorAll('img').length === 1 && document.querySelectorAll('div').length < 12;
        const hasErrorTitle = document.title === "网页无法打开" || (document.querySelector('h2') && document.querySelector('h2').innerText === "网页无法打开");
        const hasErrorCode = ERROR_PATTERNS.some(p => p.test(text));
        if (isNativeStructure && hasErrorTitle && hasErrorCode) return true;
        return false;
    }

    function getInfo() {
        const html = document.documentElement.innerHTML;
        const text = document.body ? document.body.textContent : "";
        const match = text.match(/(ERR_[A-Z_]+|DNS_[A-Z_]+|SSL_[A-Z_]+|CERT_[A-Z_]+|PROXY_[A-Z_]+|NS_ERROR_[A-Z_]+|PR_[A-Z_]+)/i);
        const code = match ? match[0].toUpperCase() : "ERR_FAILED";
        // URL提取参(抄)考(袭)了大萌主的脚本，感谢
       // https://update.greasyfork.org/scripts/561334/%E4%BC%98%E9%9B%85%E7%9A%84%E9%94%99%E8%AF%AF%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
        let url = window.location.href;
        const urlPatterns = [
            /位于\s*<strong>([^<]+)<\/strong>/i,
            /位于\s*<b>([^<]+)<\/b>/i,
            /https?:\/\/[^\s<>"']+/i
        ];
        for (const pattern of urlPatterns) {
            const urlMatch = html.match(pattern);
            if (urlMatch && urlMatch[1]) {
                url = urlMatch[1].trim();
                break;
            } else if (urlMatch && urlMatch[0] && !pattern.source.includes('(')) {
                url = urlMatch[0].trim();
                break;
            }
        }
        const ua = navigator.userAgent;
        let type = '网络错误', desc = '无法访问此网站，请检查网络连接', help = '<li>检查数据流量或 Wi-Fi 连接</li><li>尝试关闭并重新开启飞行模式</li>';

        if (/TIMED_OUT|TIMEOUT/.test(code)) {
            type = '连接超时'; desc = '服务器响应时间过长';
            help = '<li>检查网络信号是否稳定</li><li>尝试刷新页面或稍后再试</li><li>检查防火墙或代理服务器设置</li>';
        } else if (/REFUSED/.test(code)) {
            type = '连接被拒绝'; desc = '目标服务器拒绝了连接请求';
            help = '<li>核对网址拼写是否正确</li><li>该网站可能暂时关闭或维护</li><li>检查本地防火墙拦截记录</li>';
        } else if (/NAME_NOT_RESOLVED|NXDOMAIN|DNS_/.test(code)) {
            type = 'DNS 解析失败'; desc = '找不到服务器的 IP 地址';
            help = '<li>检查网址是否拼写错误</li><li>尝试修改 DNS 为 223.5.5.5 或 8.8.8.8</li><li>清除浏览器 DNS 缓存</li>';
        } else if (/DISCONNECTED|NO_INTERNET/.test(code)) {
            type = '网络已断开'; desc = '当前未连接到互联网';
            help = '<li>检查网线、调制解调器和路由器</li><li>重新连接 Wi-Fi 或移动数据</li><li>检查是否欠费停机</li>';
        } else if (/CLOSED|RESET|ABORTED/.test(code)) {
            type = '连接中断'; desc = '与服务器的连接意外丢失';
            help = '<li>网络环境切换可能导致此问题</li><li>尝试重新加载网页</li><li>检查 VPN 或加速器连接状态</li>';
        } else if (/SSL_|CERT_|PROTOCOL|INSECURE/.test(code)) {
            type = '安全连接失败'; desc = '网页使用了不安全的证书或协议';
            help = '<li>检查系统日期和时间是否准确</li><li>该网站证书可能已过期或不可信</li><li>尝试清除 HSTS 状态或检查加密套件</li>';
        } else if (/PROXY_/.test(code)) {
            type = '代理错误'; desc = '代理服务器连接异常';
            help = '<li>检查系统或浏览器的代理设置</li><li>尝试禁用 VPN 或第三方代理工具</li><li>联系网络管理员获取正确配置</li>';
        } else if (/ACCESS_DENIED|BLOCKED/.test(code)) {
            type = '访问受阻'; desc = '请求被客户端或服务器拦截';
            help = '<li>检查广告过滤插件设置</li><li>该页面可能需要特定的访问权限</li><li>尝试清除 Cookie 后重新登录</li>';
        } else if (/_TOO_MANY_|REDIRECTS/.test(code)) {
            type = '重定向过多'; desc = '网页导致了过多的重定向循环';
            help = '<li>尝试清除该网站的 Cookie</li><li>该网站可能配置错误，请联系网站管理员</li><li>请检查 URL 自动跳转设置</li>';
        } else if (/ADDRESS_UNREACHABLE|ADDRESS_INVALID/.test(code)) {
            type = '地址无效'; desc = '无法找到通往目标服务器的路径';
            help = '<li>检查输入的网址是否包含错误的 IP 或域名</li><li>尝试切换网络（如由 Wi-Fi 切换至移动数据）</li><li>如果你正在使用 VPN，请尝试更换节点或关闭它</li>';
        } else if (/FILE_NOT_FOUND/.test(code)) {
            type = '文件不存在'; desc = '无法找到请求的文件资源';
            help = '<li>检查本地路径或 URL 拼写</li><li>该文件可能已被移动或删除</li><li>确保浏览器具有读取该位置的权限</li>';
        } else if (/SCHEME/.test(code)) {
            type = '协议不支持'; desc = '不支持的 URL 方案或协议';
            help = '<li>请检查 URL 开头的协议（如 https://）是否正确</li><li>某些链接需要特定的应用程序才能打开</li>';
        }
        return { code, type, desc, help, url, ua };
    }

    function getThemeConfig() {
        let currentTheme = DEFAULT_THEME;
        if (typeof GM_getValue !== 'undefined')  currentTheme = GM_getValue('selected_theme', DEFAULT_THEME);
        const themes = {
            MIUIX: {
                style: `
                :host { --mi-blue: #0078FF; --mi-bg: #F7F7F7; --mi-text: #1A1A1A; --mi-sub: #8C8C8C; --mi-card: #FFFFFF; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; overflow-y: auto; background: var(--mi-bg); display: block; }
                .wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; color: var(--mi-text); font-family: "MiSans", system-ui, sans-serif; padding: 20px 0; box-sizing: border-box; }
                .card { width: 88%; max-width: 440px; text-align: center; padding: 20px; margin: auto; }
                .icon-circle { width: 80px; height: 80px; background: var(--mi-card); border-radius: 26px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.05); margin-bottom: 30px; }
                .err-badge { display: inline-block; background: rgba(0,120,255,0.08); color: var(--mi-blue); padding: 4px 14px; border-radius: 12px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
                h1 { font-size: 24px; font-weight: 600; margin: 0 0 12px 0; }
                .desc { font-size: 16px; color: var(--mi-sub); line-height: 1.6; margin-bottom: 36px; padding: 0 10px; }
                .btn-group { display: flex; flex-direction: column; gap: 14px; }
                button { border: none; padding: 16px; border-radius: 20px; font-size: 17px; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); -webkit-tap-highlight-color: transparent; outline: none; }
                .btn-primary { background: var(--mi-blue); color: #fff; }
                .btn-primary:active { background: #0062D1; transform: scale(0.97); }
                .btn-secondary { background: #EAEAEA; color: var(--mi-text); }
                .btn-secondary:active { background: #DBDBDB; transform: scale(0.97); }
                .toggle-btn { background: none; color: #B0B0B0; font-size: 13px; margin-top: 32px; font-weight: normal; animation: mi-float 2s ease-in-out infinite; width: 100%; border: none; }
                .toggle-btn.active { animation: none; color: var(--mi-blue); }
                @keyframes mi-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); color: var(--mi-blue); } }
                .details { display: none; text-align: left; background: var(--mi-card); border-radius: 20px; padding: 20px; margin-top: 20px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); animation: mi-slide-up 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); position: relative; }
                .copy-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.05); color: var(--mi-sub); padding: 5px; border-radius: 8px; font-size: 14px; width: auto; font-weight: normal; transition: all 0.2s; border: none; }
                .copy-btn:active { background: var(--mi-blue); color: #fff; transform: scale(0.9); }
                @keyframes mi-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .details strong { color: var(--mi-text); display: block; margin-bottom: 8px; font-size: 14px; }
                .details ul { margin: 0; padding-left: 20px; color: var(--mi-sub); line-height: 1.8; }
                .details .code-line { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #EEE; font-family: monospace; font-size: 11px; color: #BBB; word-break: break-all; }
                `,
                html: (data) => `
                <div class="card">
                    <div class="icon-circle">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="var(--mi-blue)"/></svg>
                    </div><br>
                    <span class="err-badge">${data.type}</span>
                    <h1>页面加载失败</h1>
                    <div class="desc" id="errorDesc">${data.desc}</div>
                    <div class="btn-group">
                        <button class="btn-primary" id="retryBtn">重新加载</button>
                        <button class="btn-secondary" id="backBtn">返回上一页</button>
                    </div>
                    <button class="toggle-btn" id="tgl">查看解决方案</button>
                    <div class="details" id="det">
                        <button class="copy-btn" id="cp">📋</button>
                        <strong>建议操作：</strong>
                        <ul id="helpList">${data.help}</ul>
                        <div class="code-line" id="codeLine">CODE: ${data.code}<br>URL: ${data.url}<br>UA: ${data.ua}<br>TIME: ${new Date().toLocaleString()}</div>
                    </div>
                </div>`,
                btnActive: (btn, isVisible) => { btn.innerText = isVisible ? '查看解决方案' : '隐藏解决方案'; btn.classList.toggle('active', !isVisible); }
            },
            Windows: {
                style: `
                :host { --win-blue: #0067c0; --win-bg: linear-gradient(135deg, #dae7ff 0%, #f3f3f3 45%, #f7e9ff 100%); --win-glass: rgba(255, 255, 255, 0.7); --win-border: rgba(255, 255, 255, 0.45); --win-text: #1a1a1a; --win-sub: #5f5f5f; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; overflow-y: auto; background: var(--win-bg) fixed; display: block; font-family: "Segoe UI Variable Display", "Segoe UI", "Microsoft YaHei", sans-serif; }
                .wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; color: var(--win-text); backdrop-filter: blur(25px) saturate(160%); padding: 24px; box-sizing: border-box; }
                .card { width: 100%; max-width: 480px; background: var(--win-glass); border: 1px solid var(--win-border); border-radius: 12px; padding: 40px; box-shadow: 0 12px 40px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.4); text-align: left; animation: win-enter 0.5s cubic-bezier(0.1, 0.9, 0.2, 1); }
                @keyframes win-enter { from { opacity: 0; transform: scale(1.02) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .icon-win { width: 44px; height: 44px; margin-bottom: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
                .err-badge { display: inline-block; color: var(--win-blue); font-size: 13px; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px; }
                h1 { font-size: 32px; font-weight: 600; margin: 0 0 16px 0; letter-spacing: -0.8px; line-height: 1.1; }
                .desc { font-size: 17px; color: var(--win-sub); line-height: 1.5; margin-bottom: 40px; }
                .btn-group { display: flex; gap: 8px; }
                button { border: 1px solid rgba(0,0,0,0.1); padding: 8px 24px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; outline: none; }
                .btn-primary { background: var(--win-blue); color: #fff; border: none; box-shadow: 0 2px 4px rgba(0,103,192,0.2); }
                .btn-primary:active { transform: scale(0.97); opacity: 0.9; }
                .btn-secondary { background: rgba(255,255,255,0.5); color: var(--win-text); }
                .btn-secondary:active { background: rgba(0,0,0,0.05); transform: scale(0.97); }
                .toggle-btn { background: none; border: none; color: var(--win-blue); font-size: 13px; margin-top: 32px; cursor: pointer; padding: 0; transition: opacity 0.2s; }
                .toggle-btn:hover { text-decoration: underline; }
                .details { display: none; background: rgba(255, 255, 255, 0.3); border: 1px solid var(--win-border); border-radius: 8px; padding: 20px; margin-top: 20px; font-size: 13px; animation: win-details 0.3s ease-out; position: relative; }
                @keyframes win-details { from { opacity: 0; } to { opacity: 1; } }
                .details strong { color: var(--win-text); display: block; margin-bottom: 10px; }
                .details ul { margin: 0; padding-left: 18px; color: var(--win-sub); line-height: 1.8; }
                .code-line { margin-top: 16px; font-family: Consolas, monospace; font-size: 11px; color: #777; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px; word-break: break-all; }
                .copy-btn { position: absolute; top: 15px; right: 15px; cursor: pointer; color: var(--win-blue); font-weight: 600; background: none; border: none; padding: 5px; font-size: 12px; }
                `,
                html: (data) => `
                <div class="card">
                    <svg class="icon-win" viewBox="0 0 88 88"><path d="M0 12.402l35.687-4.86.016 34.423-35.67.203V12.402zm35.687 33.91l.015 34.236L0 75.711V46.514l35.687-.202zM39.422 7.15L88 0v41.527l-48.578.43V7.15zm48.578 37.938L88 88l-48.578-6.834V45.657l48.578-.569z" fill="#0078d4"/></svg>
                    <br><span class="err-badge">${data.type}</span>
                    <h1>页面加载失败</h1>
                    <div class="desc" id="errorDesc">${data.desc}</div>
                    <div class="btn-group">
                        <button class="btn-primary" id="retryBtn">重新加载</button>
                        <button class="btn-secondary" id="backBtn">返回</button>
                    </div>
                    <button class="toggle-btn" id="tgl">查看解决方案</button>
                    <div class="details" id="det">
                        <button class="copy-btn" id="cp">复制</button>
                        <strong>建议操作：</strong>
                        <ul id="helpList">${data.help}</ul>
                        <div class="code-line" id="codeLine">CODE: ${data.code}<br>URL: ${data.url}<br>UA: ${data.ua}<br>TIME: ${new Date().toLocaleString()}</div>
                    </div>
                </div>`,
                btnActive: (btn, isVisible) => { btn.innerText = isVisible ? '查看解决方案' : '隐藏解决方案'; }
            },
            IOS: {
                style: `
                :host { --ios-blue: #007AFF; --ios-bg: #F2f2f7; --ios-card: rgba(255, 255, 255, 0.85); --ios-text: #000000; --ios-sub: #8E8E93; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; overflow-y: auto; background: var(--ios-bg); display: block; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif; -webkit-font-smoothing: antialiased; }
                .wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
                .card { width: 100%; max-width: 360px; background: var(--ios-card); backdrop-filter: saturate(180%) blur(30px); -webkit-backdrop-filter: saturate(180%) blur(30px); border-radius: 24px; padding: 32px 24px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.08); animation: ios-appear 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
                @keyframes ios-appear { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .icon-box { width: 72px; height: 72px; margin: 0 auto 24px; background: linear-gradient(180deg, #ff453a 0%, #ff3b30 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(255, 59, 48, 0.2); }
                .err-badge { display: inline-block; color: #FF3B30; font-size: 13px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.2px; }
                h1 { font-size: 24px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.5px; color: var(--ios-text); }
                .desc { font-size: 16px; color: #3A3A3C; line-height: 1.4; margin-bottom: 32px; font-weight: 400; }
                .btn-group { display: flex; flex-direction: column; gap: 12px; }
                button { border: none; padding: 14px; border-radius: 14px; font-size: 17px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; -webkit-tap-highlight-color: transparent; outline: none; }
                .btn-primary { background: var(--ios-blue); color: #fff; }
                .btn-primary:active { opacity: 0.7; transform: scale(0.98); }
                .btn-secondary { background: rgba(0,0,0,0.05); color: var(--ios-blue); }
                .btn-secondary:active { background: rgba(0,0,0,0.1); transform: scale(0.98); }
                .toggle-btn { background: none; border: none; color: var(--ios-blue); font-size: 15px; margin-top: 24px; cursor: pointer; font-weight: 400; }
                .details { display: none; background: rgba(255, 255, 255, 0.5); border-radius: 16px; padding: 16px; margin-top: 20px; font-size: 13px; text-align: left; border: 0.5px solid rgba(0,0,0,0.1); animation: ios-slide 0.4s ease; position: relative; }
                @keyframes ios-slide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .details strong { color: var(--ios-text); display: block; margin-bottom: 6px; font-size: 14px; }
                .details ul { margin: 0; padding-left: 20px; color: #48484A; line-height: 1.6; }
                .code-line { margin-top: 12px; font-family: "SF Mono", Menlo, monospace; font-size: 11px; color: #8E8E93; border-top: 0.5px solid rgba(0,0,0,0.1); padding-top: 12px; word-break: break-all; }
                .copy-btn { position: absolute; top: 12px; right: 12px; cursor: pointer; color: var(--ios-blue); font-size: 12px; font-weight: 500; background: none; border: none; }
                `,
                html: (data) => `
                <div class="card">
                    <div class="icon-box">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <span class="err-badge">${data.type}</span>
                    <h1>页面加载失败</h1>
                    <div class="desc" id="errorDesc">${data.desc}</div>
                    <div class="btn-group">
                        <button class="btn-primary" id="retryBtn">重新尝试</button>
                        <button class="btn-secondary" id="backBtn">返回</button>
                    </div>
                    <button class="toggle-btn" id="tgl">显示详细信息</button>
                    <div class="details" id="det">
                        <button class="copy-btn" id="cp">拷贝</button>
                        <strong>建议：</strong>
                        <ul id="helpList">${data.help}</ul>
                        <div class="code-line" id="codeLine">CODE: ${data.code}<br>URL: ${data.url}<br>UA: ${data.ua}<br>TIME: ${new Date().toLocaleString()}</div>
                    </div>
                </div>`,
                btnActive: (btn, isVisible) => { btn.innerText = isVisible ? '显示详细信息' : '隐藏详细信息'; }
            }
        };
        return themes[currentTheme] || themes.MIUIX;
    }

    function render() {
        if (isApplied || !document.body) return;
        isApplied = true;
        const data = getInfo();
        const conf = getThemeConfig();
        const host = document.createElement('div');
        host.id = 'error-beautify-host';
        const shadow = host.attachShadow({ mode: 'open' });

        shadow.innerHTML = `<style>${conf.style}</style><div class="wrapper">${conf.html(data)}</div>`;

        shadow.getElementById('retryBtn').onclick = () => location.reload();
        shadow.getElementById('backBtn').onclick = () => { history.length > 1 ? history.back() : window.close(); };
        shadow.getElementById('tgl').onclick = function() {
            const det = shadow.getElementById('det');
            const isVisible = det.style.display === 'block';
            det.style.display = isVisible ? 'none' : 'block';
            conf.btnActive(this, isVisible);
        };

        shadow.getElementById('cp').onclick = function() {
            const textToCopy = `错误类型: ${data.type}\n错误代码: ${data.code}\n请求网址: ${data.url}\n设备信息: ${data.ua}\n生成时间: ${new Date().toLocaleString()}`;
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            shadow.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                if (document.execCommand('copy')) {
                    const oldText = this.innerText;
                    this.innerText = (conf === getThemeConfig('MIUIX')) ? '✅' : (conf === getThemeConfig('IOS') ? '已拷贝' : '已复制');
                    setTimeout(() => this.innerText = oldText, 1500);
                }
            } catch (err) {}
            shadow.removeChild(textArea);
        };

        const clearAndAppend = () => { document.body.innerHTML = ''; document.body.appendChild(host); };
        if (document.readyState === 'complete') clearAndAppend();
        else window.addEventListener('load', clearAndAppend);

        window.addEventListener('online', () => {
            const desc = shadow.getElementById('errorDesc');
            if (desc) desc.innerText = '连接已恢复，正在刷新...';
            setTimeout(() => location.reload(), 1000);
        });
    }

    const main = () => { if (detect()) render(); };
    const obs = new MutationObserver(main);
    if (document.documentElement) obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', main);
    setTimeout(main, 150);
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("切换主题: MIUIX", () => { GM_setValue('selected_theme', 'MIUIX'); location.reload(); });
        GM_registerMenuCommand("切换主题: Windows", () => { GM_setValue('selected_theme', 'Windows'); location.reload(); });
        GM_registerMenuCommand("切换主题: iOS", () => { GM_setValue('selected_theme', 'IOS'); location.reload(); });
    }
})();