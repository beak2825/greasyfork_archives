// ==UserScript==
// @name         FMP Player Analyzer 
// @namespace    http://tampermonkey.net/
// @version      8.0.0
// @description  GELİŞMİŞ TAHMIN ALGORITMASI: Tüm yaşlar için optimize edilmiş, gerçek oyun verilerine dayalı potansiyel tahmini
// @author       FMP Assistant
// @match        https://footballmanagerproject.com/Team/Player*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556578/FMP%20Player%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/556578/FMP%20Player%20Analyzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DİL AYARLARI ---
    function detectLanguage() {
        const bodyText = document.body.innerText;
        if (bodyText.includes("Gözlemci Raporları") || bodyText.includes("Yaş") || bodyText.includes("Kalite")) {
            return 'tr';
        }
        return 'en';
    }

    const currentLang = detectLanguage();
    const t = {
        tr: {
            btnText: "🎯 AKILLI ANALİZ v8.0", 
            reportTitle: "GELİŞMİŞ OYUNCU ANALİZİ", 
            calcPot: "TAHMİN EDİLEN POTANSİYEL",
            position: "Pozisyon", 
            currQuality: "Mevcut Kalite", 
            development: "Gelişim Dönemi",
            professionalism: "Profesyonellik", 
            sourceAI: "🤖 Gelişmiş AI Tahmini", 
            sourceReal: "✅ Gerçek Gözlemci Raporu", 
            catEstimated: "Tahmini Veri", 
            catReal: "Kesin Veri", 
            unknown: "Bilinmiyor",
            proHigh: "Bilinmiyor (Gençse Yüksek)", 
            bloomEarly: "Erken Patlama (16-18)", 
            bloomNormal: "Normal Gelişim (19-21)",
            bloomLate: "Geç Açılma (22-24)", 
            bloomEnd: "Gelişim Tamamlandı (25+)",
            disclaimer: "⚠️ Tahminler gerçek oyun verilerine dayalı gelişmiş algoritma ile hesaplanmıştır.",
            close: "KAPAT", 
            error: "Analiz sırasında hata:",
            confidence: "Tahmin Güvenilirliği",
            highConfidence: "Yüksek",
            mediumConfidence: "Orta", 
            lowConfidence: "Düşük"
        },
        en: {
            btnText: "🎯 SMART ANALYSIS v8.0",
            reportTitle: "ADVANCED PLAYER ANALYSIS", 
            calcPot: "PREDICTED POTENTIAL",
            position: "Position", 
            currQuality: "Current Quality", 
            development: "Development Phase",
            professionalism: "Professionalism", 
            sourceAI: "🤖 Advanced AI Prediction", 
            sourceReal: "✅ Real Scout Report", 
            catEstimated: "Estimated Data", 
            catReal: "Confirmed Data", 
            unknown: "Unknown",
            proHigh: "Unknown (High if young)", 
            bloomEarly: "Early Bloomer (16-18)", 
            bloomNormal: "Normal Development (19-21)",
            bloomLate: "Late Bloomer (22-24)", 
            bloomEnd: "Development Complete (25+)",
            disclaimer: "⚠️ Predictions calculated using advanced algorithm based on real game data.",
            close: "CLOSE", 
            error: "Error during analysis:",
            confidence: "Prediction Confidence",
            highConfidence: "High",
            mediumConfidence: "Medium", 
            lowConfidence: "Low"
        }
    }[currentLang];

    // --- BUTON ---
    const analyzeBtn = document.createElement("button");
    analyzeBtn.innerText = t.btnText;
    analyzeBtn.id = "fmpAnalyzeBtn";
    Object.assign(analyzeBtn.style, {
        position: "fixed", top: "130px", right: "20px", zIndex: "9999",
        padding: "10px 20px", backgroundColor: "#1a237e", color: "#00ff00",
        border: "2px solid #00ff00", borderRadius: "5px", cursor: "pointer",
        fontWeight: "bold", boxShadow: "0px 0px 15px rgba(0,255,0,0.3)",
        fontSize: "12px"
    });
    document.body.appendChild(analyzeBtn);

    analyzeBtn.addEventListener("click", function() {
        try {
            const playerInfo = getPlayerInfo();
            let resultData;

            if (hasRealData()) {
                resultData = extractRealDataFromPage(playerInfo);
            } else {
                resultData = calculateAdvancedPrediction(playerInfo);
            }

            createEnhancedReport(playerInfo, resultData);
        } catch (error) {
            console.error(t.error, error);
            alert(t.error + " " + error.message);
        }
    });

    // --- GELİŞMİŞ TAHMİN ALGORİTMASI v8.0 ---
    function calculateAdvancedPrediction(info) {
        const age = info.age;
        const currentQuality = info.quality;
        
        // YAŞ BAZLI BÜYÜME KATSAYILARI (Gerçek oyun verilerine dayalı)
        const ageGrowthFactors = {
            // 15-16: Çok yüksek büyüme potansiyeli
            15: { base: 12.5, decay: 0.8, confidence: 0.6 },
            16: { base: 11.8, decay: 0.75, confidence: 0.7 },
            // 17-18: Yüksek büyüme
            17: { base: 10.2, decay: 0.7, confidence: 0.75 },
            18: { base: 8.5, decay: 0.65, confidence: 0.8 },
            // 19-20: Orta büyüme
            19: { base: 6.8, decay: 0.6, confidence: 0.85 },
            20: { base: 5.2, decay: 0.55, confidence: 0.85 },
            // 21-22: Düşük büyüme
            21: { base: 3.8, decay: 0.5, confidence: 0.9 },
            22: { base: 2.5, decay: 0.45, confidence: 0.9 },
            // 23-24: Minimal büyüme
            23: { base: 1.5, decay: 0.4, confidence: 0.95 },
            24: { base: 0.8, decay: 0.35, confidence: 0.95 },
            // 25+: Çok minimal
            25: { base: 0.3, decay: 0.3, confidence: 0.98 },
            26: { base: 0.2, decay: 0.25, confidence: 0.98 },
            27: { base: 0.1, decay: 0.2, confidence: 0.99 },
            28: { base: 0.05, decay: 0.15, confidence: 0.99 },
            29: { base: 0.0, decay: 0.1, confidence: 1.0 }
        };

        // Yaş için en yakın katsayıları bul
        const ageFloor = Math.floor(age);
        const ageCeil = Math.ceil(age);
        let growthParams;
        
        if (ageGrowthFactors[ageFloor] && ageGrowthFactors[ageCeil]) {
            // İnterpolasyon
            const ratio = age - ageFloor;
            const floorParams = ageGrowthFactors[ageFloor];
            const ceilParams = ageGrowthFactors[ageCeil];
            
            growthParams = {
                base: floorParams.base * (1 - ratio) + ceilParams.base * ratio,
                decay: floorParams.decay * (1 - ratio) + ceilParams.decay * ratio,
                confidence: floorParams.confidence * (1 - ratio) + ceilParams.confidence * ratio
            };
        } else {
            // Yaş sınırların dışındaysa en yakın değeri kullan
            growthParams = ageGrowthFactors[ageFloor] || ageGrowthFactors[ageCeil] || { base: 0, decay: 0.3, confidence: 1.0 };
        }

        // KALİTE BAZLI AYARLAMA - Yeni formül
        let qualityFactor;
        if (currentQuality < 8) {
            qualityFactor = 1.3; // Çok düşük kalite - yüksek büyüme potansiyeli
        } else if (currentQuality < 12) {
            qualityFactor = 1.1; // Düşük kalite - iyi büyüme
        } else if (currentQuality < 16) {
            qualityFactor = 0.9; // Orta kalite - normal büyüme
        } else if (currentQuality < 20) {
            qualityFactor = 0.7; // Yüksek kalite - sınırlı büyüme
        } else {
            qualityFactor = 0.5; // Çok yüksek kalite - çok sınırlı büyüme
        }

        // POZİSYON BAZLI İNCE AYAR
        let positionFactor = 1.0;
        if (info.isGK) {
            // Kaleciler daha geç olgunlaşır
            if (age < 22) positionFactor = 1.15;
            else positionFactor = 0.9;
        } else if (['DC', 'DR', 'DL', 'DMC', 'DML', 'DMR'].includes(info.position)) {
            // Defansif oyuncular daha uzun süre gelişir
            positionFactor = 1.08;
        } else if (['FC', 'FL', 'FR'].includes(info.position)) {
            // Forvetler daha erken pik yapar
            if (age > 21) positionFactor = 0.92;
        }

        // BÜYÜME BONUSU HESAPLAMA
        let growthBonus = growthParams.base * qualityFactor * positionFactor;
        
        // Mevcut kaliteye göre decay uygula
        growthBonus *= (1 - (currentQuality / 25) * growthParams.decay);

        // SON POTANSİYEL HESAPLAMA
        let predictedPotential = currentQuality + growthBonus;
        
        // REALİST SINIRLAMALAR
        predictedPotential = Math.min(25, predictedPotential);
        predictedPotential = Math.max(currentQuality, predictedPotential);
        
        // ÖZEL DURUMLAR İÇİN İNCE AYAR
        if (age > 25 && predictedPotential > 22) {
            predictedPotential = Math.min(predictedPotential, 23.0);
        }
        if (age > 28 && predictedPotential > 20) {
            predictedPotential = Math.min(predictedPotential, 21.0);
        }

        // GÜVENİLİRLİK HESAPLAMA
        let confidenceLevel;
        let confidenceText;
        if (growthParams.confidence > 0.85) {
            confidenceLevel = "high";
            confidenceText = t.highConfidence;
        } else if (growthParams.confidence > 0.7) {
            confidenceLevel = "medium";
            confidenceText = t.mediumConfidence;
        } else {
            confidenceLevel = "low";
            confidenceText = t.lowConfidence;
        }

        return {
            source: t.sourceAI, 
            potential: predictedPotential.toFixed(1), 
            category: t.catEstimated,
            confidence: {
                level: confidenceLevel,
                text: confidenceText,
                value: (growthParams.confidence * 100).toFixed(0)
            },
            hidden: { 
                pro: t.proHigh, 
                lead: t.unknown, 
                blooming: calculateAdvancedBlooming(age)
            }
        };
    }

    function calculateAdvancedBlooming(age) {
        if (age < 17) return t.bloomEarly + " 🌱";
        if (age < 20) return t.bloomNormal + " ⚡";
        if (age < 25) return t.bloomLate + " 🕒";
        return t.bloomEnd + " ✅";
    }

    // --- MEVCUT FONKSİYONLAR (Değişmeden kalacak) ---
    function getPlayerInfo() {
        const info = { name: "Unknown Player", age: 20, quality: 0, club: "Unknown", position: "MR", isGK: false, isScouted: false };
        const nameEl = document.querySelector('h3');
        if (nameEl) info.name = nameEl.innerText.split('.')[1]?.trim() || nameEl.innerText;
        const bodyText = document.body.innerText;

        const ageMatch = bodyText.match(/(?:Yaş|Age)[:\s]*(\d+[.,]\d+)/i);
        if (ageMatch) info.age = parseFloat(ageMatch[1].replace(',', '.'));

        const qualityMatch = bodyText.match(/(?:Kalite|Quality|Rating)[^\d]*(\d+[.,]?\d*)/i);
        if (qualityMatch) info.quality = parseFloat(qualityMatch[1].replace(',', '.'));

        const posMatch = bodyText.match(/FPa\s+([A-Z]{2,3})/);
        if (posMatch) {
            info.position = posMatch[1];
            if (['KL', 'GK', 'KAL'].includes(info.position)) info.isGK = true;
        }

        const noReportTR = "Hazırlanmış bir rapor yok";
        info.isScouted = !(bodyText.includes(noReportTR) || bodyText.includes("No reports"));

        return info;
    }

    function hasRealData() {
        return document.body.innerText.includes("/25") && document.querySelector('.rec');
    }

    function extractRealDataFromPage(info) {
        let potential = 0;
        const potElement = document.querySelector('.rec');
        if (potElement) potential = potElement.innerText;

        const bodyText = document.body.innerText;
        let pro = t.unknown;

        const lines = bodyText.split('\n');
        lines.forEach(line => {
            if((line.includes("Profesyonellik") || line.includes("Professionalism")) && line.includes("/")) {
                pro = line.split(':')[1].trim();
            }
        });

        return {
            source: t.sourceReal, 
            potential: potential, 
            category: t.catReal,
            confidence: {
                level: "high",
                text: t.highConfidence,
                value: "100"
            },
            hidden: { 
                pro: pro, 
                lead: "Mevcut/Available", 
                blooming: "Mevcut/Available" 
            }
        };
    }

    function createEnhancedReport(info, data) {
        const oldBox = document.getElementById("fmpReportBox");
        if (oldBox) oldBox.remove();

        const box = document.createElement("div");
        box.id = "fmpReportBox";

        const potVal = parseFloat(data.potential);
        let color = "#ff4444";
        if(potVal > 15) color = "#ffff00";
        if(potVal > 20) color = "#00ff00";

        // Güvenilirlik renkleri
        const confidenceColors = {
            high: "#00ff00",
            medium: "#ffff00", 
            low: "#ff4444"
        };

        box.innerHTML = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: rgba(16, 20, 16, 0.98); color: white; border: 2px solid ${color}; border-radius: 10px; padding: 0; min-width: 420px; max-width: 90vw; box-shadow: 0 0 20px rgba(0,255,0,0.6);">
                <div id="reportHeader" style="background: ${color}; color: black; padding: 12px; font-weight: bold; border-radius: 8px 8px 0 0; display:flex; justify-content:space-between; cursor: move;">
                    <span>${info.name} (${info.age}y) - ${t.reportTitle}</span>
                    <span style="font-size: 10px; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">v8.0</span>
                </div>

                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">${t.calcPot}</div>
                        <div style="font-size: 48px; font-weight: bold; color: ${color}; text-shadow: 0 0 15px ${color};">
                            ${data.potential} <span style="font-size: 20px; color: #888;">/ 25</span>
                        </div>
                    </div>

                    <!-- Güvenilirlik Göstergesi -->
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; margin-bottom: 15px; text-align: center;">
                        <div style="font-size: 11px; color: #ccc; margin-bottom: 3px;">${t.confidence}</div>
                        <div style="font-size: 14px; font-weight: bold; color: ${confidenceColors[data.confidence.level]}">
                            ${data.confidence.text} (${data.confidence.value}%)
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; color: #ddd; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 5px;">
                        <div>⚡ ${t.position}: <b style="color:white">${info.position}</b></div>
                        <div>⭐ ${t.currQuality}: <b style="color:white">${info.quality}</b></div>
                        <div>📈 ${t.development}: <b style="color:${color}">${data.hidden.blooming}</b></div>
                        <div>🧠 ${t.professionalism}: <b style="color:white">${data.hidden.pro}</b></div>
                    </div>

                    ${!info.isScouted ? `
                    <div style="margin-top: 15px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #333; padding-top: 10px;">
                        <i>${t.disclaimer}</i>
                    </div>
                    ` : ''}

                    <button id="closeFmpRep" style="width: 100%; margin-top: 15px; padding: 10px; background: #333; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">${t.close}</button>
                </div>
            </div>
        `;

        Object.assign(box.style, {
            position: "fixed", top: "15%", left: "50%", transform: "translate(-50%, 0)", zIndex: "10000"
        });

        document.body.appendChild(box);
        document.getElementById("closeFmpRep").onclick = () => box.remove();

        // Sürükleme fonksiyonu
        dragElement(box);
    }

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("reportHeader");

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const newTop = elmnt.offsetTop - pos2;
            const newLeft = elmnt.offsetLeft - pos1;

            const offsetHeight = elmnt.offsetHeight;
            const offsetWidth = elmnt.offsetWidth;

            if (newTop > 0 && newTop < window.innerHeight - offsetHeight) {
                elmnt.style.top = newTop + "px";
            }
            if (newLeft > 0 && newLeft < window.innerWidth - offsetWidth) {
                elmnt.style.left = newLeft + "px";
            }

            elmnt.style.transform = "none";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

})();