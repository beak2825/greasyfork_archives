// ==UserScript==
// @name         台股浮窗（TWSE API）
// @namespace    issac
// @version      1.0
// @description  顯示台股主要股票資訊，每5分鐘更新，可顯示昨收價，漲跌顯色，整齊排版，可以自己在STOCKS新增股票，就可以無限增加。
// @match        *://*/*
// @license      GPL-3.0 License
// @grant        GM_xmlhttpRequest
// @connect      mis.twse.com.tw
// @downloadURL https://update.greasyfork.org/scripts/551708/%E5%8F%B0%E8%82%A1%E6%B5%AE%E7%AA%97%EF%BC%88TWSE%20API%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551708/%E5%8F%B0%E8%82%A1%E6%B5%AE%E7%AA%97%EF%BC%88TWSE%20API%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stocks = [
        { name: '加權指數', symbol: 'tse_t00.tw', id: 'price-index' },
        { name: '台積電', symbol: 'tse_2330.tw', id: 'price-tsmc' },
        { name: '聯發科', symbol: 'tse_2454.tw', id: 'price-mediatek' },
        { name: '鴻海', symbol: 'tse_2317.tw', id: 'price-foxconn' }
    ];

    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        top: '100px',
        left: '0px',
        background: '#fff',
        border: '1px solid #aaa',
        borderRadius: '8px',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
        zIndex: 999999,
        width: '320px',
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
        padding: '5px'
    });

    const header = document.createElement('div');
    header.textContent = '台股資訊（TWSE API v1.7）';
    Object.assign(header.style, {
        background: '#333',
        color: '#fff',
        padding: '5px',
        cursor: 'move',
        textAlign: 'center',
        fontWeight: 'bold'
    });

    const minBtn = document.createElement('button');
    minBtn.textContent = '－';
    Object.assign(minBtn.style, {
        float: 'right',
        background: '#555',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '0 6px'
    });
    header.appendChild(minBtn);

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '⟳';
    Object.assign(refreshBtn.style, {
        float: 'right',
        background: '#008CBA',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '0 6px',
        marginRight: '4px'
    });
    header.appendChild(refreshBtn);

    panel.appendChild(header);

    const body = document.createElement('div');
    Object.assign(body.style, {
        padding: '6px',
        fontSize: '13px',
        background: '#fff'
    });

    stocks.forEach(s => {
        const row = document.createElement('div');
        Object.assign(row.style, {
            display: 'grid',
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            marginBottom: '3px'
        });

        const label = document.createElement('span');
        label.style.textAlign = 'left';
        label.textContent = s.name;

        const price = document.createElement('span');
        price.id = s.id;
        price.style.textAlign = 'right';
        price.textContent = '載入中…';

        const closeLabel = document.createElement('span');
        closeLabel.style.textAlign = 'right';
        closeLabel.textContent = '';

        row.appendChild(label);
        row.appendChild(price);
        row.appendChild(closeLabel);
        body.appendChild(row);
    });

    const status = document.createElement('div');
    status.id = 'status';
    status.textContent = '最後更新：-';
    Object.assign(status.style, {
        color: '#666',
        fontSize: '11px',
        marginTop: '5px',
        textAlign: 'right'
    });
    body.appendChild(status);

    panel.appendChild(body);
    document.body.appendChild(panel);

    // 拖曳功能
    (function dragElement(el) {
        const header = el.querySelector('div');
        let pos1, pos2, pos3, pos4;
        header.onmousedown = function(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = close;
            document.onmousemove = drag;
        };
        function drag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }
        function close() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    })(panel);

    // 收合功能
    minBtn.addEventListener('click', () => {
        if (body.style.display === 'none') {
            body.style.display = 'block';
            minBtn.textContent = '－';
        } else {
            body.style.display = 'none';
            minBtn.textContent = '＋';
        }
    });

    refreshBtn.addEventListener('click', fetchQuotes);

    function fetchQuotes() {
        stocks.forEach(stock => {
            const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${stock.symbol}&json=1&delay=0&_=${Date.now()}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "*/*",
                    "Origin": "https://mis.twse.com.tw"
                },
                onload: function(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        const info = (data.msgArray && data.msgArray[0]) || null;
                        const el = document.getElementById(stock.id);
                        if (info && info.z && info.y) {
                            let price = parseFloat(info.z);
                            let closeYesterday = parseFloat(info.y);
                            let changePct = ((price - closeYesterday) / closeYesterday * 100).toFixed(2);
                            el.innerHTML = `<span style="color:${price >= closeYesterday ? 'red' : 'green'}">${price.toFixed(2)} (${changePct}%)</span> 昨收:${closeYesterday.toFixed(2)}`;
                        } else {
                            el.textContent = '無資料';
                            el.style.color = '#999';
                        }
                    } catch (err) {
                        console.error(stock.name + " 抓取失敗", err);
                        document.getElementById(stock.id).textContent = '錯誤';
                    }
                },
                onerror: function(err) {
                    console.error(stock.name + " 抓取失敗", err);
                    document.getElementById(stock.id).textContent = '錯誤';
                }
            });
        });
        status.textContent = '最後更新：' + new Date().toLocaleTimeString();
    }

    fetchQuotes();
    setInterval(fetchQuotes, 5 * 60 * 1000);
})();
