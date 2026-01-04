// ==UserScript==
// @name         latina selector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  https://www.croxyproxy.com/?la adresinde çalışır
// @author       latina + assistant
// @license      MIT
// @icon         https://see.fontimg.com/api/rf5/x332O/OTNmNmNiZGFjMGIyNDA2N2I2NDkxZTk1ZjI2ZmI0Y2YudHRm/TXLDqQ/better.png?r=fs&h=114&w=1000&fg=2FF314&bg=0D0D0D&tb=1&s=114
// @match        https://www.croxyproxy.com/*
// @match        https://www.croxyproxy.com/
// @match        https://gartic.io/*
// @match        *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549313/latina%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/549313/latina%20selector.meta.js
// ==/UserScript==

(function(){
'use strict';

const config = {
    userAgents: ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"],
    proxies: ["https://www.blockaway.net/"],
};

const proxylist=[
    {'id': '43', 'ip': '172.67.168.70'}, {'id': '45', 'ip': '172.67.161.154'}, {'id': '46', 'ip': '172.67.181.121'}, {'id': '44', 'ip': '104.21.49.97'}, {'id': '47', 'ip': '188.165.1.152'}, {'id': '48', 'ip': '195.3.220.75'}, {'id': '49', 'ip': '108.181.3.2'}, {'id': '50', 'ip': '104.21.5.205'}, {'id': '51', 'ip': '104.21.35.240'}, {'id': '52', 'ip': '108.181.32.73'}, {'id': '53', 'ip': '108.181.32.55'}, {'id': '54', 'ip': '108.181.32.61'}, {'id': '56', 'ip': '108.181.32.59'}, {'id': '63', 'ip': '108.181.43.67'}, {'id': '64', 'ip': '108.181.34.45'}, {'id': '68', 'ip': '108.181.24.243'}, {'id': '69', 'ip': '108.181.34.177'}, {'id': '92', 'ip': '108.181.34.157'}, {'id': '144', 'ip': '195.3.223.166'}, {'id': '145', 'ip': '195.3.223.164'}, {'id': '146', 'ip': '146.19.24.89'}, {'id': '149', 'ip': '195.3.222.15'}, {'id': '150', 'ip': '185.16.39.161'}, {'id': '154', 'ip': '95.214.53.145'}, {'id': '157', 'ip': '95.214.53.152'}, {'id': '161', 'ip': '108.181.8.179'}, {'id': '162', 'ip': '108.181.9.39'}, {'id': '163', 'ip': '108.181.11.39'}, {'id': '164', 'ip': '108.181.6.89'}, {'id': '172', 'ip': '208.87.240.203'}, {'id': '173', 'ip': '208.87.240.219'}, {'id': '174', 'ip': '104.21.76.240'}, {'id': '176', 'ip': '172.67.181.17'}, {'id': '177', 'ip': '108.181.4.237'}, {'id': '178', 'ip': '208.87.241.209'}, {'id': '179', 'ip': '108.181.4.241'}, {'id': '181', 'ip': '208.87.240.35'}, {'id': '182', 'ip': '108.181.5.29'}, {'id': '180', 'ip': '208.87.242.233'}, {'id': '184', 'ip': '208.87.240.67'}, {'id': '185', 'ip': '95.214.53.48'}, {'id': '186', 'ip': '195.3.222.40'}, {'id': '187', 'ip': '185.225.191.49'}, {'id': '189', 'ip': '185.225.191.57'}, {'id': '198', 'ip': '108.181.11.173'}, {'id': '199', 'ip': '108.181.11.193'}, {'id': '200', 'ip': '108.181.11.137'}, {'id': '201', 'ip': '108.181.11.171'}, {'id': '202', 'ip': '108.181.11.175'}, {'id': '203', 'ip': '185.16.39.144'}, {'id': '204', 'ip': '185.16.39.213'}, {'id': '205', 'ip': '178.211.139.238'}, {'id': '216', 'ip': '185.246.84.18'}, {'id': '219', 'ip': '185.246.84.66'}, {'id': '220', 'ip': '151.101.129.140'}, {'id': '221', 'ip': '67.220.228.202'}, {'id': '222', 'ip': '172.67.202.78'}, {'id': '225', 'ip': '172.67.210.26'}, {'id': '226', 'ip': '104.21.81.163'}, {'id': '300', 'ip': '104.21.55.14'}, {'id': '301', 'ip': '104.21.34.243'}, {'id': '132', 'ip': '172.67.143.236'}, {'id': '131', 'ip': '172.67.185.8'}, {'id': '228', 'ip': '104.21.84.24'}, {'id': '122', 'ip': '172.67.221.185'}, {'id': '229', 'ip': '172.67.181.30'}, {'id': '123', 'ip': '104.21.9.41'}, {'id': '230', 'ip': '172.67.141.121'}, {'id': '124', 'ip': '104.21.11.67'}, {'id': '125', 'ip': '104.21.86.157'}, {'id': '231', 'ip': '104.21.31.84'}, {'id': '234', 'ip': '104.21.26.103'}, {'id': '235', 'ip': '104.21.72.101'}, {'id': '237', 'ip': '104.21.11.58'}, {'id': '236', 'ip': '104.21.12.60'}, {'id': '134', 'ip': '104.21.80.127'}, {'id': '155', 'ip': '172.67.142.234'}, {'id': '252', 'ip': '104.21.7.113'}, {'id': '254', 'ip': '172.67.178.59'}
];

const proxylist_style = `
.proxylist-container {
    position: fixed;
    top: 94px;
    left: 20px;
    width: 320px;
    max-height: 550px;
    background: #ffc0cb; /* Açık pembe */
    box-shadow: 10px 15px 20px #ff99aa; /* Pembe gölge */
    z-index: 10001;
    transform: translateX(-900px);
    transition: transform 0.4s ease-out;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    border: 10px solid #ffc0cb;
}

.proxylist-container.active {
    transform: translateX(0);
}

.proxylist-header {
    padding: 3px;
    border-bottom: 1px solid #ff99aa; /* Açık pembe alt çizgi */
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffb6c1; /* Açık pembe başlık */
    color: black;
    font-weight: bold;
}

.proxylist-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.proxylist-logo i {
    font-size: 1.75rem;
    color: #ff6699; /* Logo pembe tonuna uyumlu */
}

.proxylist-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: white;
}

.proxylist-version {
    font-size: 0.9rem;
    color: #999;
}

.proxylist-toggle {
    position: fixed;
    top: 15px;
    left: 20px;
    width: 48px;
    height: 48px;
    background: #ffb6c1 url('https://i.hizliresim.com/oyxh9c5.png') center/cover no-repeat; /* Açık pembe + logo */
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 7px 5px 10px #ff99aa;
    border: 5px solid #ffb6c1;
    z-index: 10000;
    transform-origin: center;
    will-change: transform;
    transition: transform 0.3s ease-in-out;

}

.proxylist-toggle.rotating {
    transform: rotate(360deg);
    transition: transform 0.7s ease-in-out;
}

.proxylist-content {
    padding: 1.2rem;
    overflow-y: auto;
    flex-grow: 1;
}

.proxylist-button {
    background: repeating-linear-gradient(176deg, #ffc0cb, #ff99aa 90px);
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all 0.2s ease;
    color: black;
    font-size: 1rem;
    cursor: pointer;
}

.proxylist-button:hover {
    background: #ffb6c1;
}

.proxylist-logo {
    width: min(110px, 50px);
    height: min(110px, 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff99aa; /* Logo arka planı pembe */
    border-radius: 11px;
    box-sizing: border-box;
    font-size: 1.5rem;
    box-shadow: 3px 0 6px #ff77aa;
}

.proxylist-logo.rotating {
    transform: rotate(360deg);
    transition: transform 0.7s ease-in-out;
}
.proxylist-body {
    flex: 1;
    overflow-y: auto;
    background: #ffe4e1; /* Daha açık pembe gövde */
    color: black;
    padding: 10px;
}
.proxylist-body button {
    display: block;
    width: 100%;
    margin-bottom: 8px;
    padding: 8px;
    background: #ff99aa; /* Buton rengi */
    border: none;
    color: black;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
}
.proxylist-body button:hover {
    background: #ff77aa; /* Buton hover rengi */
}
`;


function createUI() {
    GM_addStyle(proxylist_style);

    const proxylistContainer = document.createElement('div');
    proxylistContainer.className = 'proxylist-container';
    proxylistContainer.innerHTML = `
        <div class="proxylist">
            <div class="proxylist-header">
                <div class="proxylist-title">
                    <div class="proxylist-logo">
                        <img src="https://i.hizliresim.com/nznfsf7.jpg" alt="Proxy Listesi Logo" style="max-width: 100%; max-height: 100%;">
                    </div>
                    <div>
                       <div class="proxylist-name">
    <img src="https://see.fontimg.com/api/rf5/VG6rZ/ZGRhZmU3OWJlZGNmNGVlZmEzNDVkNmY4YTcxNDE3YTkub3Rm/UHJveHkgTGlzdA/bia.png?r=fs&h=26&w=1000&fg=000000&bg=E2DDDD&tb=1&s=26"
         alt="Proxy Listesi Title"
         style="height: 26px; font-weight: bold;
                border: 4px solid #ff99aa; /* Pembe border */
                background: #ffc0cb; /* Açık pembe arka plan */
                border-radius: 6px;">
</div>


                    </div>
                </div>
            </div>
            <div class="proxylist-content">
                <div class="proxylist-button" id="open-proxies-button">Open Next 5 Proxies (Pop-up İzin Ver!)</div>
            </div>
        </div>
    `;

    const proxylistToggle = document.createElement('div');
    proxylistToggle.className = 'proxylist-toggle';

    const proxylistLogo = proxylistContainer.querySelector('.proxylist-logo');

    let isAnimating = false;
    let currentBatch = 0;
    const proxiesPerBatch = 5; // Küçültülmüş batch

    proxylistToggle.onclick = () => {
        if (isAnimating) return;
        isAnimating = true;
        proxylistToggle.classList.add('rotating');

        proxylistToggle.addEventListener('transitionend', function handleRotationEnd() {
            proxylistToggle.classList.remove('rotating');
            proxylistContainer.classList.toggle('active');

            if (proxylistContainer.classList.contains('active')) {
                proxylistLogo.classList.add('rotating');
                proxylistLogo.addEventListener('transitionend', function handleLogoRotationEnd() {
                    proxylistLogo.classList.remove('rotating');
                    isAnimating = false;
                    proxylistLogo.removeEventListener('transitionend', handleLogoRotationEnd);
                }, {once: true});
            } else {
                isAnimating = false;
            }
            proxylistToggle.removeEventListener('transitionend', handleRotationEnd, {once: true});
        }, {once: true});
    };

    proxylistToggle.addEventListener('mouseover', function() {
        proxylistToggle.classList.add('rotating');
    });
    proxylistToggle.addEventListener('mouseout', function() {
        proxylistToggle.classList.remove('rotating');
    });

    document.body.appendChild(proxylistContainer);
    document.body.appendChild(proxylistToggle);

    const openProxiesButton = document.getElementById('open-proxies-button');
    openProxiesButton.addEventListener('click', () => {
        const startIndex = currentBatch * proxiesPerBatch;
        const endIndex = Math.min(startIndex + proxiesPerBatch, proxylist.length);

        console.log(`Debug: ${endIndex - startIndex} proxy açılıyor (Batch ${currentBatch + 1})`); // Debug log

        // Open all proxies in the batch simultaneously
        let openedCount = 0;
        for (let i = startIndex; i < endIndex; i++) {
            const newWindow = window.open(`https://www.croxyproxy.com/?latinanext=${proxylist[i].id}`, '_blank');
            if (newWindow) {
                openedCount++;
            } else {
                console.warn(`Proxy ${proxylist[i].id} bloklandı!`);
            }
        }
        console.log(`Debug: ${openedCount} sekme başarıyla açıldı.`); // Kaç tane açıldığını göster

        currentBatch++;
        if (currentBatch * proxiesPerBatch >= proxylist.length) {
            currentBatch = 0; // Reset to start
        }

        // Update button text to show current batch
        const totalBatches = Math.ceil(proxylist.length / proxiesPerBatch);
        openProxiesButton.textContent = `Open Batch ${currentBatch + 1} of ${totalBatches} (Next: Proxies ${currentBatch * proxiesPerBatch + 1}-${Math.min((currentBatch + 1) * proxiesPerBatch, proxylist.length)})`;
    });
}

if (window.location.href.indexOf("latinanext") > -1) {
    sessionStorage.setItem("latinanext", window.location.href.split("latinanext=")[1]);
    const rightArrow = document.querySelector('.fa.fa-arrow-right');
    if (rightArrow) {
        rightArrow.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
    }
}

if (window.location.href.indexOf("servers") != -1) {
    let inter = setInterval(() => {
        const proxyServerIdInput = document.querySelector("input[name=proxyServerId]");
        if (proxyServerIdInput) {
            document.body.innerHTML += `
                <form class="myform" method="POST" action="/requests?fso=">
                    <input type="hidden" name="url" value="gartic.io">
                    <input type="hidden" name="proxyServerId" value="${sessionStorage.getItem("latinanext")}">
                    <input type="hidden" name="csrf" value="${document.querySelector("input[name=csrf]").value}">
                    <input type="hidden" name="demo" value="0">
                    <input type="hidden" name="frontOrigin" value="https://www.croxyproxy.com">
                </form>
            `;
            document.querySelector(".myform").submit();
            clearInterval(inter);
        }
    }, 100);
}

if (window.location.href.includes("?la")) {
    createUI();
}
})();