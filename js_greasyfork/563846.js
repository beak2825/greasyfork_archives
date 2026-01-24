// ==UserScript==
// @name         WebView 错误美化
// @namespace    https://viayoo.com/h88v22
// @version      1.6
// @description  基于MIUIX设计语言重绘的 WebView 错误页面，并且给出一定程度上的解决方案。
// @author       Aloazny && Gemini
// @run-at       document-start
// @match        *://*/*
// @license       MIT
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAUpSURBVGiB1ZrfaxxVFMc/N5Q0fchm89DWnzQpVsjS0sVYfBGSYrSPSWgLKmLTgAXfKvhsEv8B46tCs8GCSiNNX4TUH03AQqVN3VCJ0IitVVPbl0y2D7v15fhwZzI/Mrt7785us/nAsjN35t5zv5wzZ+7cexUWiMggMAR0AWkga1PfgjzgAHeBWaXUpbq1LCJdIjIlImuyday5fUgnFTO2xUKirInIWKU+qzJC0sAVGhdSSckDR5VSTvTCJkEikkWLSebexuOgReWDhSFBrmfu0PxiPBygO+ipFu8gEGbbRQzovl4JFrQEjs/SvM9MJbIiMu6dKNCpGfiF7eWdIBuht8MtGKeOYpwiXPoN7q7p8/yq/s8+o/+7OmGwB9K76mWRNDAJjHgeWqMOgqZvQm4R5v+IXBD3P5JT+/fDSC+ceimpZQAcpVSnEpEh4GKSlqZvwvj3vkdCCL6Q4HGArk4YH6iLsGElIjngVC21nSIMn4/xiEecgDKiQHvs4juJQvFTJSLzQJ9tzfwqnJ6B/P1w+bMpOHEIjh2AwmN488vw9a/egtROmFuBmVvwTyF8Pfs0TJ3wnzdLFnYAHba18qtw9HNwSn5ZeyuMDWgxHtfuxdfP7NW/D16Fc9fhk5/g0X9u2/d121feq0lURwuW7x6nqD0TFNOzG66+HxZjyugRXbdnd8BGybVRtG4u21L9njDD58NhdvwgfP02pNqsjW+QatNtHD/ol+Xva1G2WAmKpuSe3TD2WjIxHqk23VbQU7PL2qYNVoImfvCP21uTeyaK56n21nibJhgLyi2G3zNjA/UV45Fq08nC4+6anZesBHl4qblRjB7RNuJsV8NIkFOEhTv+eSPFxNlYuGOe8YwEzS6Hz48dMO1W7URtRPtQDiNB0TFaZq9Z40mI2ogdJ8Zg/R565XnbGrUTTOGmGAnyvmeeNMEsatoHs6RQqn5Ps2AkqH9/o7sRz6PH/rHpQNX6Gfr5L/N7M3vMysqx/ND8Xg8jQV2dEUMPzBpPtcFor38+2ms+uojaiPahHDuq3wJDGTgdOJ9bMU/dHw3AWXcoYzNUmlvZ3AcTjDyU3gV93f75N7+adgsu34YzF+HDb/WxKUEbfd3mn+XGz9BIIHT+XtdfmtXwxFy7B5dX9LGJqHPXtY0429WwErQvMNE1eRUKVdL5uRuby2ZuVa5TKOm2PfalGyQI9FTThmF3AqSaKBsKJbfNQLoO2jTBStBIb/hZWn4IH/9YXtToy5vLyo3UCyXdVjBVD/bYeQdAiYhUv83HKUL/Z7D0r1+W2eNOT8Vkscu3/TA7cQjeeHHzPZ5ngmIOPwXzZ+zn6JSI5IHDNpXyq1rUeiA0Ujv1l+bpGK9UYuqGnsYKhlnHTi2mhmmspUQTjSMXwp4CeK4DTh6C118o/65afgDf/Q4XboWzGWjPzL5r/iKNsJB4Knjoi/DXbJTMHj8UC6XKw5nBHsidTD4VnHiyPreoJ+v/3LSEa8a+tM5mtgkghmFvOcWhhinhKLlF/avksSB93VpEHYQArCul0p6gmsMuDqeo5wAqLXgNZeq64AUwrZTaWPBKo7ehJPbSFrEOdCmlnBYAd1l8cmv7lIhJb2k/uk/B+p3UBCwppTZWUOI2Xmyn0NsINa8gNJZzL/S7NzY760B/dL9Ppc1L8zRv+C0RIwbKjLaVUo4blxM0l7fWgQmlVDZOjBEikhaRnIg4T2pTXAyO24eqeynKLLCXFTdEeItmo0JyCb3dJQ/MK6VmTSv+D9sXVkySmRwbAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/563846/WebView%20%E9%94%99%E8%AF%AF%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563846/WebView%20%E9%94%99%E8%AF%AF%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
        /NS_ERROR_NET_RESET/i, /NS_ERROR_PROXY_CONNECTION_REFUSED/i
    ];

    let isApplied = false;

    function detect() {
        if (!document.body || isApplied) return false;
        const url = window.location.href;
        const text = document.body.textContent;
        const isSearchPage = (function() {
            const searchParams = ["q", "s", "p", "wd", "word", "keyword", "text", "query", "key", "result", "searchWord", "search-result"];
            const searchPaths = ['/search', '/s', '/query', '/google', '/bing', '/baidu'];
            return searchParams.some(p => new RegExp(`[?&]${p}=`, 'i').test(url)) || searchPaths.some(p => url.includes(p)) || /[?&](q|word|query|wd)=/.test(url);
        })();
        const isInternalError = url.startsWith('chrome-error://') || url.includes('chromewebdata') || window.location.protocol === 'chrome-error:';
        const hasErrorElement = !!document.querySelector('#main-frame-error, .error-code, .neterror, #main-message, [id^="error-information"]');
        const isExtremelySimpleStructure = document.querySelectorAll('div').length < 12;
        const isStaticPage = document.querySelectorAll('a').length < 10;
        const hasErrorCode = ERROR_PATTERNS.some(p => p.test(text));
        const isSimplePage = text.length < 800;
        const isTechnicalSite = /csdn\.net|github\.com|stackoverflow\.com|segmentfault\.com|v2ex\.com/i.test(url);
        if (isInternalError || (hasErrorElement && isSimplePage && isStaticPage)) return true;
        if (isTechnicalSite && !isInternalError && !hasErrorElement) return false;
        return hasErrorCode && isExtremelySimpleStructure && isSimplePage && isStaticPage && !isSearchPage;
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
        } else if (/DISCONNECTED|NO_INTERNET/.test(code)) {
            type = '网络已断开'; desc = '当前未连接到互联网';
            help = '<li>检查网线、调制解调器和路由器</li><li>重新连接 Wi-Fi 或移动数据</li><li>检查是否欠费停机</li>';
        } else if (/CLOSED|RESET|ABORTED/.test(code)) {
            type = '连接中断'; desc = '与服务器的连接意外丢失';
            help = '<li>网络环境切换可能导致此问题</li><li>尝试重新加载网页</li><li>检查 VPN 或加速器连接状态</li>';
        } else if (/NAME_NOT_RESOLVED|NXDOMAIN|DNS_/.test(code)) {
            type = 'DNS 解析失败'; desc = '找不到服务器的 IP 地址';
            help = '<li>检查网址是否拼写错误</li><li>尝试修改 DNS 为 223.5.5.5 或 8.8.8.8</li><li>清除浏览器 DNS 缓存</li>';
        } else if (/SSL_|CERT_|PROTOCOL/.test(code)) {
            type = '安全连接失败'; desc = '网页使用了不安全的证书或协议';
            help = '<li>检查系统日期和时间是否准确</li><li>该网站证书可能已过期或不可信</li><li>避免在公共网络输入敏感信息</li>';
        } else if (/PROXY_/.test(code)) {
            type = '代理错误'; desc = '代理服务器连接异常';
            help = '<li>检查系统或浏览器的代理设置</li><li>尝试禁用 VPN 或第三方代理工具</li><li>联系网络管理员获取正确配置</li>';
        } else if (/ACCESS_DENIED|BLOCKED/.test(code)) {
            type = '访问受阻'; desc = '请求被客户端或服务器拦截';
            help = '<li>检查广告过滤插件设置</li><li>该页面可能需要特定的访问权限</li><li>尝试清除 Cookie 后重新登录</li>';
        } else if (/_TOO_MANY_|REDIRECTS/.test(code)) {
            type = '请求过多'; desc = '目标服务器拒绝了连接请求';
            help = '<li>对网页发送请求过多可能会导致此问题</li><li>请过段时间访问再访问网址</li><li>或者尝试更换 IP 访问</li>';
        } else if (/ADDRESS_UNREACHABLE/.test(code)) {
            type = '地址无法访问'; desc = '无法找到通往目标服务器的路径';
            help = '<li>检查输入的网址是否包含错误的 IP 或域名</li><li>尝试切换网络（如由 Wi-Fi 切换至移动数据）</li><li>如果你正在使用 VPN，请尝试更换节点或关闭它</li><li>检查局域网网关及子网掩码配置是否正确</li>';
        }
        return { code, type, desc, help, url, ua };
    }

    function render() {
        if (isApplied || !document.body) return;
        isApplied = true;
        const data = getInfo();
        const host = document.createElement('div');
        host.id = 'error-beautify-host';
        const shadow = host.attachShadow({ mode: 'open' });

        const style = `
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
        .toggle-btn { background: none; color: #B0B0B0; font-size: 13px; margin-top: 32px; font-weight: normal; animation: mi-float 2s ease-in-out infinite; width: 100%; }
        .toggle-btn.active { animation: none; color: var(--mi-blue); }
        @keyframes mi-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); color: var(--mi-blue); } }
        .details { display: none; text-align: left; background: var(--mi-card); border-radius: 20px; padding: 20px; margin-top: 20px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); animation: mi-slide-up 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); position: relative; }
        .copy-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.05); color: var(--mi-sub); padding: 5px; border-radius: 8px; font-size: 14px; width: auto; font-weight: normal; transition: all 0.2s; }
        .copy-btn:active { background: var(--mi-blue); color: #fff; transform: scale(0.9); }
        @keyframes mi-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .details strong { color: var(--mi-text); display: block; margin-bottom: 8px; font-size: 14px; }
        .details ul { margin: 0; padding-left: 20px; color: var(--mi-sub); line-height: 1.8; }
        .details .code-line { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #EEE; font-family: monospace; font-size: 11px; color: #BBB; word-break: break-all; }
        `;

        shadow.innerHTML = `
        <style>${style}</style>
        <div class="wrapper">
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
                    <div class="code-line" id="codeLine">
                        CODE: ${data.code}<br>
                        URL: ${data.url}<br>
                        UA: ${data.ua}<br>
                        TIME: ${new Date().toLocaleString()}
                    </div>
                </div>
            </div>
        </div>`;

        shadow.getElementById('retryBtn').onclick = () => location.reload();
        shadow.getElementById('backBtn').onclick = () => history.back();
        shadow.getElementById('tgl').onclick = function() {
            const det = shadow.getElementById('det');
            const isVisible = det.style.display === 'block';
            det.style.display = isVisible ? 'none' : 'block';
            this.innerText = isVisible ? '查看解决方案' : '隐藏解决方案';
            this.classList.toggle('active', !isVisible);
        };

        shadow.getElementById('cp').onclick = function() {
            const textToCopy = `错误类型: ${data.type}\n错误代码: ${data.code}\n请求网址: ${data.url}\n设备信息: ${data.ua}\n生成时间: ${new Date().toLocaleString()}`;
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            shadow.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    const oldText = this.innerText;
                    this.innerText = '✅';
                    setTimeout(() => this.innerText = oldText, 1500);
                }
            } catch (err) {
                console.error('复制失败:', err);
            }
            shadow.removeChild(textArea);
        };

        const clearAndAppend = () => {
            document.body.innerHTML = '';
            document.body.appendChild(host);
        };

        if (document.readyState === 'complete') clearAndAppend();
        else window.addEventListener('load', clearAndAppend);

        window.addEventListener('online', () => {
            const desc = shadow.getElementById('errorDesc');
            if (desc) desc.innerText = '网络已恢复，正在自动刷新...';
            setTimeout(() => location.reload(), 1000);
        });
    }

    const main = () => { if (detect()) render(); };
    const obs = new MutationObserver(main);
    if (document.documentElement) obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', main);
    setTimeout(main, 150);
})();