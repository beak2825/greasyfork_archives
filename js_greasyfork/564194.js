// ==UserScript==
// @name         Trendyol GO Master Analiz
// @namespace    Trendyol GO Master Analiz
// @version      1.0
// @description  Trendyol Yemek için detaylı harcama analizi eklentisi. tgoyemek.com/hesabim/siparislerim adresine gidin. Ekranın sağ alt köşesine çıkan "Analiz Başlat" butonuna basın ve bekleyin. Bütün siparişleriniz yüklenene kadar otomatik olarak sayfanın en altına inilecektir. Tüm siparişleriniz yüklendiğinde istatistiklerinizin olduğu arayüze ulaşacaksınız.
// @author       ekşi/refik risk
// @match        https://www.trendyol.com/hesabim/siparislerim*
// @match        https://www.trendyol.com/go/yemek/siparislerim*
// @match        https://tgoyemek.com/hesabim/siparislerim*
// @icon         https://favicon.im/trendyol.com?larger=true
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564194/Trendyol%20GO%20Master%20Analiz.user.js
// @updateURL https://update.greasyfork.org/scripts/564194/Trendyol%20GO%20Master%20Analiz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DOLAR KURLARI ---
    const USD_RATES = {
        2020: [5.9154, 6.0453, 6.3125, 6.8223, 6.9275, 6.8103, 6.8519, 7.2296, 7.5018, 7.8953, 7.9771, 7.7257],
        2021: [7.3888, 7.0822, 7.6169, 8.1509, 8.3372, 8.5961, 8.5880, 8.4767, 8.5148, 9.1711, 10.5648, 13.6230],
        2022: [13.5192, 13.6350, 14.5907, 14.6851, 15.5325, 16.9857, 17.3880, 18.0086, 18.2756, 18.5631, 18.5871, 18.6370],
        2023: [18.7583, 18.8237, 18.9651, 19.3061, 19.6792, 23.4008, 26.4051, 26.9143, 26.9393, 27.7964, 28.5829, 29.0353],
        2024: [29.9909, 30.6962, 31.9182, 32.2393, 32.1925, 32.4674, 32.8479, 33.5706, 33.9594, 34.1707, 34.3601, 34.9028],
        2025: [35.4370, 36.0729, 36.9959, 38.0113, 38.6594, 39.3271, 40.0984, 40.7256, 41.2246, 41.7263, 42.1690, 42.5841],
        2026: [43.0568]
    };

    function getUsdRate(year, monthIndex) {
        if (year === 2026 && monthIndex > 0) return USD_RATES[2026][0];
        if (year > 2026) return USD_RATES[2026][0];
        if (USD_RATES[year] && USD_RATES[year][monthIndex]) return USD_RATES[year][monthIndex];
        return 43.0568;
    }

    // --- GELİŞMİŞ KATEGORİ MOTORU ---
    function getCategory(name) {
        const n = name.toLocaleLowerCase('tr-TR');

        // Özel Kategoriler
        if (/çiğ köfte|komagene|adıyaman|osmanlı|battalbey/.test(n)) return 'Çiğ Köfte';
        if (/burger|arby's|mcdonald|hamburger|carl's jr|burger king|popeyes|shake shack/.test(n)) return 'Hamburger';
        if (/chicken|fried|tavuk|popeyes|tenders|schnitzel|şnitzel|cajun|kfc|kanatçı|kanat|wing/.test(n)) return 'Tavuk';
        if (/kumpir/.test(n)) return 'Kumpir'; // YENİ
        if (/mantı/.test(n)) return 'Mantı'; // YENİ
        if (/salata|bowl|fit|diyet|Salad|sağlıklı|green|vegan/.test(n)) return 'Salata & Sağlıklı'; // YENİ
        if (/taco|burrito|meksika|mexico|mexican/.test(n)) return 'Meksika'; // YENİ
        if (/pilav|pilavcı/.test(n)) return 'Pilav';
        if (/tantuni/.test(n)) return 'Tantuni';
        if (/kokoreç|sokak|street|midye|uykuluk/.test(n)) return 'Kokoreç & Sokak';

        // Ana Yemekler
        if (/ocakbaşı|usta|kebab|sofrası|dürüm|kebap|kasap|mangal|steak/.test(n)) return 'Kebap & Izgara';
        if (/ev yemekleri|mutfağı|lokantası|balkan|suluyemek/.test(n)) return 'Ev Yemekleri';
        if (/döner|iskender|et döner|tavuk döner/.test(n)) return 'Döner';
        if (/köfte/.test(n)) return 'Köfte'; // Çiğ köfteden sonra

        // Hamur İşi & Fast Food
        if (/pizza|little caesars|domino|pizzeria|italy|sbarro|italyan|italian/.test(n)) return 'Pizza';
        if (/pide|lahmacun|konya|fırın|pidem/.test(n)) return 'Pide & Lahmacun';
        if (/makarna|pasta|spaghetti/.test(n)) return 'Makarna';
        if (/börek|gözleme|simit|poğaça|kahvaltı|Mamüller|hamur|boyoz/.test(n)) return 'Kahvaltı & Börek'; // GENİŞLETİLDİ
        if (/patso|büfe|tost|Toast|sandviç|Sandwich|kumru|marmaris|sosisli/.test(n)) return 'Büfe & Tost';

        // Tatlı & İçecek
        if (/waffle|tatlı|pastane|Magnolia|san sebastian|dondurma|güllüoğlu|Muhallebicisi|sweet|baklava|kadayıf|ekler|helva|künefe|sütlaç|profiterol|çikolata/.test(n)) return 'Tatlı';
        if (/cafe|Caffè|caffe|coffee|starbucks|kahve|espresso|latte/.test(n)) return 'Cafe & Kahve';

        // Dünya & Diğer
        if (/sushi|korean|kore|noodle|çin|china|japon|japan|wok|chopstick/.test(n)) return 'Uzakdoğu';
        if (/balık|deniz/.test(n)) return 'Balık & Deniz';
        if (/çorba|işkembeci|paça/.test(n)) return 'Çorba';

        return 'Diğer';
    }


   // --- UI OLUŞTURMA ---
    function createUI() {
        const existingBtn = document.getElementById('ty-master-visualizer');
        if (existingBtn) existingBtn.remove();

        const btn = document.createElement('button');
        btn.id = 'ty-master-visualizer';
        btn.innerText = '📊 Analiz Başlat';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '99999';
        btn.style.padding = '12px 20px';
        btn.style.backgroundColor = '#d35400';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';

        btn.onclick = startProcess;
        document.body.appendChild(btn);
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // --- VERİ TOPLAMA ---
    async function startProcess() {
        const btn = document.getElementById('ty-master-visualizer');
        btn.disabled = true;
        btn.style.backgroundColor = '#95a5a6';

        let previousHeight = 0;
        let noChangeCount = 0;
        const maxNoChange = 3;

        while (noChangeCount < maxNoChange) {
            const count = Array.from(document.querySelectorAll('span')).filter(el => el.innerText === 'Sipariş Tutarı').length;
            btn.innerText = `Veri Toplanıyor... (${count})`;

            window.scrollTo(0, document.body.scrollHeight);
            await delay(2000);

            let currentHeight = document.body.scrollHeight;
            if (currentHeight > previousHeight) {
                previousHeight = currentHeight;
                noChangeCount = 0;
            } else {
                noChangeCount++;
            }
        }

        btn.innerText = 'Hesaplanıyor...';
        const data = extractData();
        renderDashboardContainer(data);

        btn.disabled = false;
        btn.style.backgroundColor = '#d35400';
        btn.innerText = '📊 Analiz Başlat';
    }

    // --- VERİ AYIKLAMA ---
    function extractData() {
        const orders = [];
        const priceLabels = Array.from(document.querySelectorAll('span')).filter(el => el.innerText.trim() === 'Sipariş Tutarı');

        priceLabels.forEach(label => {
            try {
                const rowContainer = label.closest('div.flex.justify-between');
                if(!rowContainer) return;
                const mainCard = rowContainer.parentElement;

                if (mainCard) {
                    let priceText = label.nextElementSibling ? label.nextElementSibling.innerText : "0";
                    let cleanPrice = parseFloat(priceText.replace('TL', '').trim().replace(/\./g, '').replace(',', '.'));

                    const spansInRow = rowContainer.querySelectorAll('span');
                    let dateText = "";
                    for(let i=0; i<spansInRow.length; i++) {
                        if(spansInRow[i].innerText === 'Sipariş Tarihi') {
                            dateText = spansInRow[i].nextElementSibling.innerText;
                            break;
                        }
                    }

                    const spansInCard = mainCard.querySelectorAll('span');
                    let vendorName = "Bilinmiyor";
                    for(let i=0; i<spansInCard.length; i++) {
                        if(spansInCard[i].innerText === 'Restoran') {
                            vendorName = spansInCard[i].nextElementSibling.innerText;
                            break;
                        }
                    }

                    let dateObj = new Date();
                    const monthMap = {"Ocak":0, "Şubat":1, "Mart":2, "Nisan":3, "Mayıs":4, "Haziran":5, "Temmuz":6, "Ağustos":7, "Eylül":8, "Ekim":9, "Kasım":10, "Aralık":11};

                    if(dateText) {
                        const parts = dateText.split(' ');
                        if(parts.length >= 5) {
                            dateObj = new Date(parts[2], monthMap[parts[1]], parts[0]);
                            const timeParts = parts[4].split(':');
                            dateObj.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
                        }
                    }

                    const category = getCategory(vendorName);

                    orders.push({
                        vendor: vendorName,
                        category: category,
                        date: dateObj,
                        amount: cleanPrice,
                        year: dateObj.getFullYear()
                    });
                }
            } catch (err) { console.error(err); }
        });
        return orders;
    }

    // --- CSV İNDİRME FONKSİYONU ---
    function downloadCSV(orders, yearLabel) {
        let csvContent = "\uFEFFTarih;Saat;Restoran;Kategori;Tutar (TL);Tutar (USD);Dolar Kuru\n";

        orders.forEach(o => {
            const dateStr = o.date.toLocaleDateString('tr-TR');
            const timeStr = o.date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
            const rate = getUsdRate(o.date.getFullYear(), o.date.getMonth());
            const usdAmount = (o.amount / rate).toFixed(2).replace('.', ',');
            const tlAmount = o.amount.toFixed(2).replace('.', ',');
            const rateStr = rate.toFixed(4).replace('.', ',');
            const vendor = o.vendor.replace(/"/g, '""'); // CSV escape

            csvContent += `"${dateStr}";"${timeStr}";"${vendor}";"${o.category}";"${tlAmount}";"${usdAmount}";"${rateStr}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Trendyol_Yemek_Gecmisi_${yearLabel}_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- DASHBOARD CONTAINER ---
    let currentChartInstances = [];

    function renderDashboardContainer(allOrders) {
        const modalId = 'ty-master-dashboard';
        const oldModal = document.getElementById(modalId);
        if(oldModal) oldModal.remove();

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; padding: 40px 0; backdrop-filter: blur(5px);`;

        // İçerik Kapsayıcısı
        const content = document.createElement('div');
        content.id = 'ty-dashboard-content';
        content.style.cssText = `background: #ecf0f1; width: 95%; max-width: 1300px; border-radius: 16px; padding: 25px; font-family: 'Segoe UI', Tahoma, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 40px; position: relative;`;

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; flex-wrap: wrap; gap: 10px;">
                <div style="display:flex; align-items:center; gap: 15px;">
                    <h2 style="margin:0; color:#2c3e50; font-size: 28px;">🌮 Trendyol Yemek Sipariş Analizi</h2>
                    <select id="yearFilter" style="padding: 8px 12px; font-size: 16px; border-radius: 8px; border: 2px solid #d35400; background: white; cursor: pointer; font-weight: bold; color: #2c3e50;">
                        <option value="all">Tüm Zamanlar</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                </div>
                <div style="display:flex; gap: 10px;">
                    <button id="downloadCsv" style="background:#2980b9; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">📄 CSV İndir</button>
                    <button id="saveAsImage" style="background:#27ae60; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">📸 Resim Kaydet</button>
                    <button id="closeDash" style="background:#c0392b; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">KAPAT ✕</button>
                </div>
            </div>

            <div id="dashboardInnerContent"></div>

            <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #bdc3c7;">
                <span style="font-size: 14px; color: #7f8c8d; font-style: italic; font-weight: bold; letter-spacing: 1px;">ekşi/refik risk</span>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('closeDash').onclick = () => modal.remove();

        document.getElementById('yearFilter').onchange = (e) => {
            const selectedYear = e.target.value;
            updateDashboard(selectedYear, allOrders);
        };

        // CSV İNDİRME BUTONU
        document.getElementById('downloadCsv').onclick = () => {
            const selectedYear = document.getElementById('yearFilter').value;
            let exportData = allOrders;
            if (selectedYear !== 'all') {
                exportData = allOrders.filter(o => o.year.toString() === selectedYear);
            }
            if (exportData.length === 0) {
                alert("İndirilecek veri bulunamadı.");
                return;
            }
            downloadCSV(exportData, selectedYear);
        };

        // RESİM KAYDETME
        document.getElementById('saveAsImage').onclick = () => {
            const btn = document.getElementById('saveAsImage');
            const originalText = btn.innerText;
            btn.innerText = '📸 Hazırlanıyor...';

            const elementToCapture = document.getElementById('ty-dashboard-content');

            html2canvas(elementToCapture, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: '#ecf0f1',
                ignoreElements: (element) => {
                    return element.id === 'saveAsImage' || element.id === 'closeDash' || element.id === 'yearFilter' || element.id === 'downloadCsv';
                }
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `Trendyol_Yemek_Analiz_${new Date().toISOString().slice(0,10)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                btn.innerText = originalText;
            }).catch(err => {
                console.error(err);
                btn.innerText = 'Hata Oluştu!';
                setTimeout(() => btn.innerText = originalText, 2000);
            });
        };

        updateDashboard('all', allOrders);
    }

    // --- İÇERİK GÜNCELLEME ---
    function updateDashboard(yearFilter, allOrders) {
        currentChartInstances.forEach(chart => chart.destroy());
        currentChartInstances = [];

        let filteredOrders = allOrders;
        if (yearFilter !== 'all') {
            filteredOrders = allOrders.filter(o => o.year.toString() === yearFilter);
        }

        if (filteredOrders.length === 0) {
            document.getElementById('dashboardInnerContent').innerHTML = '<div style="text-align:center; padding: 50px; font-size: 20px;">Bu yıl için veri bulunamadı.</div>';
            return;
        }

        const totalSpending = filteredOrders.reduce((sum, item) => sum + item.amount, 0);
        const totalOrders = filteredOrders.length;

        const monthStatsAmount = {};
        const monthStatsAmountUSD = {};
        const monthStatsCount = {};
        const vendorStatsCount = {};
        const categoryStatsCount = {};
        const dayStatsCount = Array(7).fill(0);
        const hourStatsCount = Array(24).fill(0);
        const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        let totalSpendingUSD = 0;

        filteredOrders.forEach(o => {
            const mKey = `${o.date.getFullYear()}-${(o.date.getMonth()+1).toString().padStart(2, '0')}`;
            const rate = getUsdRate(o.date.getFullYear(), o.date.getMonth());
            const amountUSD = o.amount / rate;

            monthStatsAmount[mKey] = (monthStatsAmount[mKey] || 0) + o.amount;
            monthStatsAmountUSD[mKey] = (monthStatsAmountUSD[mKey] || 0) + amountUSD;
            monthStatsCount[mKey] = (monthStatsCount[mKey] || 0) + 1;
            totalSpendingUSD += amountUSD;

            vendorStatsCount[o.vendor] = (vendorStatsCount[o.vendor] || 0) + 1;
            categoryStatsCount[o.category] = (categoryStatsCount[o.category] || 0) + 1;
            dayStatsCount[o.date.getDay()]++;
            hourStatsCount[o.date.getHours()]++;
        });

        const sortedMonths = Object.keys(monthStatsAmount).sort();
        const avgBasketData = sortedMonths.map(m => (monthStatsAmount[m] / monthStatsCount[m]).toFixed(2));
        const avgBasketDataUSD = sortedMonths.map(m => (monthStatsAmountUSD[m] / monthStatsCount[m]).toFixed(2));

        let maxOrderMonth = { key: '-', count: 0 };
        Object.entries(monthStatsCount).forEach(([key, val]) => {
            if(val > maxOrderMonth.count) maxOrderMonth = { key, count: val };
        });

        const topVendorsByCount = Object.entries(vendorStatsCount).sort((a,b) => b[1] - a[1]).slice(0, 12);
        const categoryData = Object.entries(categoryStatsCount).sort((a,b) => b[1] - a[1]);
        const totalCategoryCount = categoryData.reduce((acc, curr) => acc + curr[1], 0);
        let maxDayIndex = dayStatsCount.indexOf(Math.max(...dayStatsCount));

        const dashboardHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:30px;">
                <div style="${cardStyle('#2980b9')}">
                    <div style="font-size:14px; opacity:0.8;">Toplam Harcama (TL)</div>
                    <div style="font-size:24px; font-weight:bold;">${totalSpending.toLocaleString('tr-TR', {maximumFractionDigits:0})} ₺</div>
                </div>
                <div style="${cardStyle('#16a085')}">
                    <div style="font-size:14px; opacity:0.8;">Toplam Harcama (USD)</div>
                    <div style="font-size:24px; font-weight:bold;">$${totalSpendingUSD.toLocaleString('en-US', {maximumFractionDigits:0})}</div>
                </div>
                <div style="${cardStyle('#d35400')}">
                    <div style="font-size:14px; opacity:0.8;">Toplam Sipariş</div>
                    <div style="font-size:24px; font-weight:bold;">${totalOrders} Adet</div>
                </div>
                <div style="${cardStyle('#8e44ad')}">
                    <div style="font-size:14px; opacity:0.8;">Rekor Ay (${maxOrderMonth.key})</div>
                    <div style="font-size:24px; font-weight:bold;">${maxOrderMonth.count} Sipariş</div>
                </div>
                <div style="${cardStyle('#27ae60')}">
                    <div style="font-size:14px; opacity:0.8;">Favori Gün</div>
                    <div style="font-size:24px; font-weight:bold;">${dayNames[maxDayIndex]}</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:20px; margin-bottom:20px;">
                <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">🍕 Kategori Dağılımı (${yearFilter === 'all' ? 'Genel' : yearFilter})</h3>
                    <div style="height:300px; display:flex; justify-content:center;">
                        <canvas id="chartCategory"></canvas>
                    </div>
                </div>
                <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">🏆 En Çok Sipariş Verilen 12 Restoran</h3>
                    <canvas id="chartVendorCount"></canvas>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:20px; margin-bottom:20px;">
                <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">⏰ Saatlere Göre Sipariş Dağılımı</h3>
                    <canvas id="chartHours"></canvas>
                </div>
                <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">📆 Haftanın Günlerine Göre Dağılım</h3>
                    <canvas id="chartDays"></canvas>
                </div>
            </div>

            <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05); margin-bottom:20px;">
                <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">💸 Aylık Ortalama Sepet Tutarı (TL)</h3>
                <canvas id="chartAvgBasket" height="70"></canvas>
            </div>

            <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px; color:#27ae60;">💵 Aylık Ortalama Sepet Tutarı (USD)</h3>
                <canvas id="chartAvgBasketUSD" height="70"></canvas>
            </div>
        `;

        document.getElementById('dashboardInnerContent').innerHTML = dashboardHTML;

        // --- CHART OLUŞTURMA ---

        const ctxCat = document.getElementById('chartCategory');
        if(ctxCat) {
            currentChartInstances.push(new Chart(ctxCat, {
                type: 'pie',
                data: {
                    labels: categoryData.map(c => {
                        const percentage = ((c[1] / totalCategoryCount) * 100).toFixed(1);
                        return `${c[0]} (%${percentage})`;
                    }),
                    datasets: [{
                        data: categoryData.map(c => c[1]),
                        backgroundColor: ['#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#2ecc71', '#e67e22', '#1abc9c', '#34495e', '#c0392b', '#2980b9', '#8e44ad', '#f39c12', '#27ae60', '#d35400', '#16a085', '#7f8c8d'],
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
            }));
        }

        const ctxVendor = document.getElementById('chartVendorCount');
        if(ctxVendor) {
            currentChartInstances.push(new Chart(ctxVendor, {
                type: 'bar',
                data: {
                    labels: topVendorsByCount.map(v => v[0]),
                    datasets: [{ label: 'Sipariş Adedi', data: topVendorsByCount.map(v => v[1]), backgroundColor: '#3498db', borderRadius: 4 }]
                },
                options: { indexAxis: 'y' }
            }));
        }

        const ctxHours = document.getElementById('chartHours');
        if(ctxHours) {
            currentChartInstances.push(new Chart(ctxHours, {
                type: 'bar',
                data: {
                    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                    datasets: [{ label: 'Sipariş Sayısı', data: hourStatsCount, backgroundColor: '#e74c3c', borderRadius: 4 }]
                }
            }));
        }

        const ctxDays = document.getElementById('chartDays');
        if(ctxDays) {
            const shiftedDays = [...dayNames.slice(1), dayNames[0]];
            const shiftedCounts = [...dayStatsCount.slice(1), dayStatsCount[0]];
            currentChartInstances.push(new Chart(ctxDays, {
                type: 'bar',
                data: {
                    labels: shiftedDays,
                    datasets: [{ label: 'Sipariş Sayısı', data: shiftedCounts, backgroundColor: '#9b59b6', borderRadius: 5 }]
                }
            }));
        }

        const ctxAvgTL = document.getElementById('chartAvgBasket');
        if(ctxAvgTL) {
            currentChartInstances.push(new Chart(ctxAvgTL, {
                type: 'line',
                data: {
                    labels: sortedMonths,
                    datasets: [
                        { label: 'Ort. Sepet (TL)', data: avgBasketData, borderColor: '#f1c40f', backgroundColor: 'rgba(241, 196, 15, 0.2)', borderWidth: 3, fill: true, tension: 0.4, yAxisID: 'y' },
                        { label: 'Toplam Harcama (TL)', data: sortedMonths.map(m => monthStatsAmount[m]), backgroundColor: 'rgba(44, 62, 80, 0.3)', type: 'bar', yAxisID: 'y1', borderRadius: 4 }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Ort. Sepet (TL)'} },
                        y1: { type: 'linear', display: true, position: 'right', title: {display: true, text: 'Toplam (TL)'}, grid: {drawOnChartArea: false} }
                    }
                }
            }));
        }

        const ctxAvgUSD = document.getElementById('chartAvgBasketUSD');
        if(ctxAvgUSD) {
            currentChartInstances.push(new Chart(ctxAvgUSD, {
                type: 'line',
                data: {
                    labels: sortedMonths,
                    datasets: [
                        { label: 'Ort. Sepet ($)', data: avgBasketDataUSD, borderColor: '#27ae60', backgroundColor: 'rgba(39, 174, 96, 0.2)', borderWidth: 3, fill: true, tension: 0.4, yAxisID: 'y' },
                        { label: 'Toplam Harcama ($)', data: sortedMonths.map(m => monthStatsAmountUSD[m]), backgroundColor: 'rgba(44, 62, 80, 0.3)', type: 'bar', yAxisID: 'y1', borderRadius: 4 }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Ort. Sepet (USD)'} },
                        y1: { type: 'linear', display: true, position: 'right', title: {display: true, text: 'Toplam (USD)'}, grid: {drawOnChartArea: false} }
                    }
                }
            }));
        }
    }

    function cardStyle(color) {
        return `background:${color}; color:white; padding:20px; border-radius:12px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.1);`;
    }

    window.addEventListener('load', createUI);
    setTimeout(createUI, 3000);

})();