// ==UserScript==
// @name         KYX批量抽奖助手
// @namespace    https://api.kkyyxx.xyz
// @version      1.1.0
// @description  批量抽奖+自动购买 (支持初级场和高级场)
// @match        https://quota.kyx03.de/*
// @author       kkkyyx
// @icon https://linux.do/user_avatar/linux.do/kkkyyx/288/1034473_2.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554772/KYX%E6%89%B9%E9%87%8F%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554772/KYX%E6%89%B9%E9%87%8F%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API = {
        SPIN: 'https://quota.kyx03.de/api/slot/spin',
        BUY: 'https://quota.kyx03.de/api/slot/buy-spins',
        RECORDS: 'https://quota.kyx03.de/api/slot/records'
    };

    let running = false;
    let panelOpen = false;
    let mode = 'free';
    let gameMode = 'basic';
    
    let state = {
        quota: 0,
        spins: 0,
        freeSpins: 0,
        bought: 0,
        maxBuy: 5,
        price: 20000000,
        advancedBetAmount: 150000000
    };
    
    let stats = {
        spins: 0,
        win: 0,
        spent: 0,
        bet: 0
    };

    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

    function $(id) {
        return document.getElementById(id);
    }

    function detectGameMode() {
        const pageText = document.body.innerText;
        if (pageText.includes('高级场') || pageText.includes('返回初级场') || pageText.includes('高级场今日投注限额')) {
            gameMode = 'advanced';
        } else {
            gameMode = 'basic';
        }
        return gameMode;
    }

    function createBall() {
        const ball = document.createElement('div');
        ball.id = 'kyx-ball';
        const size = isMobile ? 60 : 70;
        
        ball.style.position = 'fixed';
        ball.style.bottom = (isMobile ? 20 : 30) + 'px';
        ball.style.right = (isMobile ? 20 : 30) + 'px';
        ball.style.width = size + 'px';
        ball.style.height = size + 'px';
        ball.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        ball.style.borderRadius = '50%';
        ball.style.display = 'flex';
        ball.style.alignItems = 'center';
        ball.style.justifyContent = 'center';
        ball.style.cursor = 'pointer';
        ball.style.zIndex = '999998';
        ball.style.boxShadow = '0 4px 20px rgba(102,126,234,0.5)';
        ball.style.transition = 'all 0.3s';
        ball.style.border = '3px solid white';
        
        ball.innerHTML = '<div style="font-size: 40px;">🎰</div>';
        
        ball.addEventListener('click', function() {
            togglePanel();
        });
        
        ball.addEventListener('mouseenter', function() {
            ball.style.transform = 'scale(1.1)';
        });
        
        ball.addEventListener('mouseleave', function() {
            ball.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(ball);
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'kyx-panel';
        
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%) scale(0.95)';
        panel.style.width = isMobile ? '90%' : '400px';
        panel.style.maxWidth = '450px';
        panel.style.background = 'white';
        panel.style.borderRadius = '20px';
        panel.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
        panel.style.zIndex = '999999';
        panel.style.display = 'none';
        panel.style.opacity = '0';
        panel.style.transition = 'all 0.3s';
        panel.style.maxHeight = '90vh';
        panel.style.overflow = 'auto';

        panel.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 20px 20px 0 0; color: white; position: sticky; top: 0; z-index: 10;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 18px;">🎰 批量抽奖助手</h3>
                    <button id="kyx-close" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 20px; font-weight: bold;">×</button>
                </div>
                <div style="margin-top: 8px; font-size: 12px; opacity: 0.9;">
                    <span id="game-mode-indicator">🎯 当前模式: 检测中...</span>
                </div>
            </div>
            
            <div style="padding: 16px;">
                <div style="background: #f5f5f5; padding: 14px; border-radius: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-weight: 600; font-size: 13px;">📊 当前状态</span>
                        <button id="kyx-refresh" style="background: #667eea; border: none; color: white; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">刷新</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="background: white; padding: 10px; border-radius: 8px;">
                            <div style="color: #999; font-size: 11px;">💰 余额</div>
                            <div id="s-quota" style="font-size: 15px; font-weight: 700; color: #FF9800;">-</div>
                        </div>
                        <div style="background: white; padding: 10px; border-radius: 8px;">
                            <div style="color: #999; font-size: 11px;">🎫 次数</div>
                            <div id="s-spins" style="font-size: 15px; font-weight: 700; color: #2196F3;">-</div>
                        </div>
                        <div style="background: white; padding: 10px; border-radius: 8px;">
                            <div style="color: #999; font-size: 11px;">🎁 免费</div>
                            <div id="s-free" style="font-size: 15px; font-weight: 700; color: #4CAF50;">-</div>
                        </div>
                        <div style="background: white; padding: 10px; border-radius: 8px;">
                            <div style="color: #999; font-size: 11px;" id="price-label">💳 价格</div>
                            <div id="s-price" style="font-size: 15px; font-weight: 700; color: #9C27B0;">-</div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; background: white; padding: 10px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #666; margin-bottom: 6px;">
                            <span>📦 今日购买</span>
                            <span id="s-buy-text">-/-</span>
                        </div>
                        <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                            <div id="s-buy-bar" style="background: #9C27B0; height: 100%; width: 0%; transition: width 0.5s;"></div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px;">🎯 运行模式</div>
                    <div style="display: flex; gap: 8px;">
                        <button id="m-free" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 13px;">🎁 免费</button>
                        <button id="m-buy" style="flex: 1; padding: 12px; background: #e0e0e0; color: #999; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 13px;">🛒 购买</button>
                    </div>
                    <div id="m-desc" style="margin-top: 6px; font-size: 11px; color: #666; background: #f5f5f5; padding: 8px; border-radius: 6px;">
                        仅使用免费次数，用完即停止
                    </div>
                </div>

                <div id="buy-cfg" style="display: none; margin-bottom: 12px;">
                    <div style="background: #fff3e0; padding: 12px; border-radius: 10px; border: 2px solid #FFB74D;">
                        <div style="font-weight: 600; margin-bottom: 8px; color: #F57C00; font-size: 12px;">🛒 购买配置</div>
                        <input type="number" id="max-buy" placeholder="留空=上限" min="1" style="width: 100%; padding: 10px; border: 2px solid #FFB74D; border-radius: 8px; box-sizing: border-box; text-align: center; font-size: 14px;">
                        <div style="font-size: 10px; color: #666; margin-top: 6px; line-height: 1.4;">
                            💡 留空：购买到今日上限<br>填数字：最多购买指定次数
                        </div>
                    </div>
                </div>

                <div id="advanced-cfg" style="display: none; margin-bottom: 12px;">
                    <div style="background: #e8f5e9; padding: 12px; border-radius: 10px; border: 2px solid #4CAF50;">
                        <div style="font-weight: 600; margin-bottom: 8px; color: #2E7D32; font-size: 12px;">🏆 高级场配置</div>
                        <div style="margin-bottom: 8px;">
                            <label style="display: block; font-size: 11px; color: #666; margin-bottom: 4px;">投注金额 (美元)</label>
                            <input type="number" id="bet-amount" value="300" min="100" max="500" step="1" style="width: 100%; padding: 10px; border: 2px solid #4CAF50; border-radius: 8px; box-sizing: border-box; text-align: center; font-size: 14px;" placeholder="输入100-500之间的金额">
                        </div>
                        <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                            <button class="bet-quick" data-amount="100" style="flex: 1; padding: 6px; background: rgba(76,175,80,0.1); border: 1px solid #4CAF50; color: #2E7D32; border-radius: 6px; cursor: pointer; font-size: 11px;">$100</button>
                            <button class="bet-quick" data-amount="233" style="flex: 1; padding: 6px; background: rgba(76,175,80,0.1); border: 1px solid #4CAF50; color: #2E7D32; border-radius: 6px; cursor: pointer; font-size: 11px;">$233</button>
                            <button class="bet-quick" data-amount="300" style="flex: 1; padding: 6px; background: rgba(76,175,80,0.2); border: 1px solid #4CAF50; color: #2E7D32; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;">$300</button>
                            <button class="bet-quick" data-amount="366" style="flex: 1; padding: 6px; background: rgba(76,175,80,0.1); border: 1px solid #4CAF50; color: #2E7D32; border-radius: 6px; cursor: pointer; font-size: 11px;">$366</button>
                            <button class="bet-quick" data-amount="500" style="flex: 1; padding: 6px; background: rgba(76,175,80,0.1); border: 1px solid #4CAF50; color: #2E7D32; border-radius: 6px; cursor: pointer; font-size: 11px;">$500</button>
                        </div>
                        <div style="font-size: 10px; color: #666; line-height: 1.4;">
                            💡 可自由输入100-500之间的投注金额<br>
                            ⚠️ 每次抽奖将消耗对应的投注金额
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px;">⚙️ 抽奖设置</div>
                    <div style="margin-bottom: 8px;">
                        <label style="display: block; font-size: 11px; color: #666; margin-bottom: 4px;">目标次数</label>
                        <input type="number" id="spin-cnt" value="10" min="1" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; box-sizing: border-box; text-align: center; font-size: 14px;">
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="display: block; font-size: 11px; color: #666; margin-bottom: 4px;">间隔(毫秒)</label>
                        <input type="number" id="delay" value="300" min="100" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; box-sizing: border-box; text-align: center; font-size: 14px;">
                    </div>
                    <label style="display: flex; align-items: center; cursor: pointer; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                        <input type="checkbox" id="use-free" checked style="margin-right: 10px; width: 18px; height: 18px;">
                        <span style="font-size: 12px;">优先使用免费次数</span>
                    </label>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button id="kyx-start" style="flex: 1; padding: 14px; background: #4CAF50; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px;">▶ 开始</button>
                    <button id="kyx-stop" style="flex: 1; padding: 14px; background: #f44336; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; opacity: 0.4; font-size: 14px;" disabled>⏹ 停止</button>
                </div>

                <div style="background: #e8f5e9; padding: 12px; border-radius: 10px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: 600; font-size: 12px;">📈 本次统计</span>
                        <button id="kyx-reset" style="background: rgba(46,125,50,0.2); border: none; color: #2e7d32; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">重置</button>
                    </div>
                    <div style="font-size: 12px; line-height: 1.8;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>抽奖次数:</span>
                            <span id="st-spins" style="font-weight: 700;">0</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>总赢额:</span>
                            <span id="st-win" style="font-weight: 700; color: #4CAF50;">$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>购买花费:</span>
                            <span id="st-spent" style="font-weight: 700; color: #f44336;">$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>投注花费:</span>
                            <span id="st-bet" style="font-weight: 700; color: #FF9800;">$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 2px dashed rgba(0,0,0,0.1); margin-top: 4px;">
                            <span style="font-weight: 700;">净收益:</span>
                            <span id="st-profit" style="font-weight: 700; color: #4CAF50;">$0.00</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: 600; font-size: 12px;">🏆 中奖记录</span>
                        <button id="kyx-load-rec" style="background: rgba(156,39,176,0.1); border: none; color: #9C27B0; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">加载</button>
                    </div>
                    <div id="records" style="background: #f9f9f9; border-radius: 8px; padding: 10px; max-height: 200px; overflow-y: auto; font-size: 11px;">
                        <div style="color: #999; text-align: center; padding: 20px 0;">点击"加载"查看记录</div>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-weight: 600; font-size: 12px;">📝 运行日志</span>
                        <button id="kyx-clear" style="background: none; border: none; color: #999; cursor: pointer; font-size: 11px;">清空</button>
                    </div>
                    <div id="logs" style="background: #f9f9f9; border-radius: 8px; padding: 8px; max-height: 150px; overflow-y: auto; font-size: 11px;">
                        <div style="color: #4CAF50; padding: 4px 0;">✓ 脚本已就绪</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        bindEvents();
        updateGameModeUI();
    }

    function updateGameModeUI() {
        const indicator = $('game-mode-indicator');
        const advancedCfg = $('advanced-cfg');
        const priceLabel = $('price-label');
        
        if (gameMode === 'advanced') {
            indicator.textContent = '🏆 当前模式: 高级场';
            indicator.style.color = '#FFD700';
            if (advancedCfg) advancedCfg.style.display = 'block';
            if (priceLabel) priceLabel.textContent = '💎 投注额';
        } else {
            indicator.textContent = '🎯 当前模式: 初级场';
            indicator.style.color = '#4CAF50';
            if (advancedCfg) advancedCfg.style.display = 'none';
            if (priceLabel) priceLabel.textContent = '💳 价格';
        }
    }

    function log(msg, type) {
        type = type || 'info';
        const logs = $('logs');
        if (!logs) return;
        
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            error: '#f44336',
            warn: '#FF9800'
        };
        
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.style.padding = '4px 0';
        entry.style.borderBottom = '1px solid #eee';
        entry.innerHTML = '<span style="opacity: 0.6;">[' + time + ']</span> <span style="color: ' + colors[type] + ';">' + msg + '</span>';
        
        logs.insertBefore(entry, logs.firstChild);
        while (logs.children.length > 50) {
            logs.removeChild(logs.lastChild);
        }
    }

    function updateUI() {
        if (!$('s-quota')) return;
        
        $('s-quota').textContent = '$' + (state.quota / 1e6).toFixed(2);
        $('s-spins').textContent = state.spins;
        $('s-free').textContent = state.freeSpins;
        
        if (gameMode === 'advanced') {
            $('s-price').textContent = '$' + (state.advancedBetAmount / 500000).toFixed(0);
        } else {
            $('s-price').textContent = '$' + (state.price / 1e6).toFixed(2);
        }
        
        $('s-buy-text').textContent = state.bought + '/' + state.maxBuy;
        $('s-buy-bar').style.width = ((state.bought / state.maxBuy) * 100) + '%';
        
        $('st-spins').textContent = stats.spins;
        $('st-win').textContent = '$' + (stats.win / 1e6).toFixed(2);
        $('st-spent').textContent = '$' + (stats.spent / 1e6).toFixed(2);
        
        if ($('st-bet')) {
            $('st-bet').textContent = '$' + (stats.bet / 1e6).toFixed(2);
        }
        
        const profit = stats.win - stats.spent - (stats.bet || 0);
        $('st-profit').textContent = '$' + (profit / 1e6).toFixed(2);
        $('st-profit').style.color = profit >= 0 ? '#4CAF50' : '#f44336';
    }

    function togglePanel() {
        let panel = $('kyx-panel');
        if (!panel) {
            createPanel();
            panel = $('kyx-panel');
        }
        
        panelOpen = !panelOpen;
        
        if (panelOpen) {
            panel.style.display = 'block';
            setTimeout(function() {
                panel.style.opacity = '1';
                panel.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);
            
            detectGameMode();
            updateGameModeUI();
            
            if ($('s-quota').textContent === '-') {
                fetchStatus();
            }
        } else {
            panel.style.opacity = '0';
            panel.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(function() {
                panel.style.display = 'none';
            }, 300);
        }
    }

    function updateBetAmount() {
        const betInput = $('bet-amount');
        if (!betInput) return;
        
        const amount = parseInt(betInput.value) || 300;
        const clampedAmount = Math.max(100, Math.min(500, amount));
        
        if (amount !== clampedAmount) {
            betInput.value = clampedAmount;
        }
        
        state.advancedBetAmount = clampedAmount * 500000;
        updateUI();
        
        const quickBtns = document.querySelectorAll('.bet-quick');
        quickBtns.forEach(function(btn) {
            const btnAmount = parseInt(btn.dataset.amount);
            if (btnAmount === clampedAmount) {
                btn.style.background = 'rgba(76,175,80,0.2)';
                btn.style.fontWeight = '600';
            } else {
                btn.style.background = 'rgba(76,175,80,0.1)';
                btn.style.fontWeight = 'normal';
            }
        });
        
        log('投注金额设置为 $' + clampedAmount);
    }

    function bindEvents() {
        $('kyx-close').addEventListener('click', function(e) {
            e.stopPropagation();
            togglePanel();
        });
        
        $('kyx-start').addEventListener('click', startSpin);
        
        $('kyx-stop').addEventListener('click', function() {
            running = false;
            log('停止中...', 'warn');
        });
        
        $('kyx-refresh').addEventListener('click', function() {
            detectGameMode();
            updateGameModeUI();
            fetchStatus();
        });
        
        $('kyx-reset').addEventListener('click', function() {
            stats = { spins: 0, win: 0, spent: 0, bet: 0 };
            updateUI();
            log('统计已重置');
        });
        
        $('kyx-clear').addEventListener('click', function() {
            $('logs').innerHTML = '<div style="color: #999;">日志已清空</div>';
        });
        
        $('kyx-load-rec').addEventListener('click', loadRecords);
        
        if ($('bet-amount')) {
            $('bet-amount').addEventListener('input', updateBetAmount);
            $('bet-amount').addEventListener('blur', updateBetAmount);
        }
        
        const quickBtns = document.querySelectorAll('.bet-quick');
        quickBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const amount = parseInt(this.dataset.amount);
                $('bet-amount').value = amount;
                updateBetAmount();
            });
        });
        
        $('m-free').addEventListener('click', function() {
            mode = 'free';
            $('m-free').style.background = '#4CAF50';
            $('m-free').style.color = 'white';
            $('m-buy').style.background = '#e0e0e0';
            $('m-buy').style.color = '#999';
            $('buy-cfg').style.display = 'none';
            $('m-desc').textContent = '仅使用免费次数，用完即停止';
            log('切换到免费模式');
        });
        
        $('m-buy').addEventListener('click', function() {
            mode = 'buy';
            $('m-buy').style.background = '#FF9800';
            $('m-buy').style.color = 'white';
            $('m-free').style.background = '#e0e0e0';
            $('m-free').style.color = '#999';
            $('buy-cfg').style.display = 'block';
            if (gameMode === 'basic') {
                $('m-desc').textContent = '自动购买抽奖次数，直到达到目标或上限';
            } else {
                $('m-desc').textContent = '高级场模式：每次抽奖消耗投注金额';
            }
            log('切换到购买模式');
        });
    }

    function parsePageData() {
        try {
            const text = document.body.innerText;
            
            const qMatch = text.match(/当前余额\s*\$?([\d,]+\.?\d*)/);
            if (qMatch) state.quota = parseFloat(qMatch[1].replace(/,/g, '')) * 1e6;
            
            if (gameMode === 'advanced') {
                state.spins = Math.floor(state.quota / (state.advancedBetAmount / 500000 * 1e6));
                state.bought = 0;
                state.maxBuy = 999;
            } else {
                const sMatch = text.match(/今日剩余[：:]\s*(\d+)\s*次/);
                if (sMatch) state.spins = parseInt(sMatch[1]);
                
                const pMatch = text.match(/购买抽奖次数[：:]\s*\$?([\d,]+\.?\d*)/);
                if (pMatch) state.price = parseFloat(pMatch[1].replace(/,/g, '')) * 1e6;
                
                const bMatch = text.match(/今日已购[：:]\s*(\d+)\/(\d+)/);
                if (bMatch) {
                    state.bought = parseInt(bMatch[1]);
                    state.maxBuy = parseInt(bMatch[2]);
                }
            }
            
            const fMatch = text.match(/免费次数[：:]\s*(\d+)\s*次/);
            if (fMatch) state.freeSpins = parseInt(fMatch[1]);
            
            log('从页面获取状态成功 (' + (gameMode === 'advanced' ? '高级场' : '初级场') + ')', 'success');
            return true;
        } catch (e) {
            log('页面解析失败', 'warn');
            return false;
        }
    }

    async function fetchStatus() {
        try {
            log('获取状态中...');
            
            if (parsePageData()) {
                updateUI();
                return;
            }
            
            if (gameMode === 'basic') {
                try {
                    const r = await fetch(API.BUY, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({})
                    });
                    const d = await r.json();
                    
                    if (d.data) {
                        state.quota = d.data.quota_after || state.quota;
                        state.spins = d.data.remaining_spins || state.spins;
                        state.bought = d.data.bought_today || state.bought;
                        state.maxBuy = d.data.max_daily_buy || state.maxBuy;
                        state.price = d.data.price || state.price;
                    }
                    
                    if (!d.success && d.message && d.message.includes('上限')) {
                        const m = d.message.match(/(\d+)\s*次/);
                        if (m) {
                            state.maxBuy = parseInt(m[1]);
                            state.bought = state.maxBuy;
                        }
                    }
                } catch (e) {}
            }
            
            updateUI();
            log('状态已更新', 'success');
        } catch (err) {
            log('获取失败: ' + err.message, 'error');
        }
    }

    async function spin(useFree) {
        const requestBody = { useFreeSpinn: useFree };
        
        if (gameMode === 'advanced' && !useFree) {
            requestBody.advancedBetAmount = state.advancedBetAmount;
            
            const betInDollars = state.advancedBetAmount / 500000;
            if (betInDollars < 100 || betInDollars > 500) {
                throw new Error('投注金额必须在 $100-$500 之间，当前: $' + betInDollars);
            }
            
            log('🎯 高级场投注 $' + betInDollars + '...', 'info');
        }
        
        const r = await fetch(API.SPIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        
        if (!d.success) throw new Error(d.message || '抽奖失败');
        
        state.quota = d.data.quota_after || 0;
        
        if (gameMode === 'advanced') {
            state.spins = Math.floor(state.quota / (state.advancedBetAmount / 500000 * 1e6));
        } else {
            state.spins = d.data.spins_remaining || 0;
        }
        
        state.freeSpins = d.data.free_spins_remaining || 0;
        
        stats.spins++;
        stats.win += d.data.win_amount || 0;
        
        if (gameMode === 'advanced' && !useFree) {
            stats.bet = (stats.bet || 0) + (d.data.bet_amount || state.advancedBetAmount);
        }
        
        return d;
    }

    async function buy() {
        if (gameMode === 'advanced') {
            throw new Error('高级场不支持购买次数');
        }
        
        const r = await fetch(API.BUY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        if (!d.success) throw new Error(d.message || '购买失败');
        
        state.quota = d.data.quota_after || 0;
        state.spins = d.data.remaining_spins || 0;
        state.bought = d.data.bought_today || 0;
        state.maxBuy = d.data.max_daily_buy || 5;
        state.price = d.data.price || 0;
        
        stats.spent += d.data.price || 0;
        
        return d;
    }

    async function loadRecords() {
        try {
            log('加载记录中...');
            const r = await fetch(API.RECORDS);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            const d = await r.json();
            
            const c = $('records');
            if (!d.success || !d.data || d.data.length === 0) {
                c.innerHTML = '<div style="color: #999; text-align: center; padding: 20px 0;">暂无记录</div>';
                log('暂无记录', 'warn');
                return;
            }
            
            c.innerHTML = d.data.slice(0, 20).map(function(r) {
                const time = new Date(r.timestamp).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const win = r.win_amount / 1e6;
                const bet = r.bet_amount / 1e6;
                const color = r.win_type === 'none' ? '#999' : 
                             r.win_type === 'punishment' ? '#f44336' :
                             r.win_type === 'double' ? '#FF9800' : '#4CAF50';
                
                return '<div style="padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">' +
                    '<div>' +
                        '<div style="font-size: 10px; color: #666;">' + time + '</div>' +
                        '<div style="font-size: 11px; font-weight: 600; color: ' + color + ';">' + (r.win_type_name || '未知') + '</div>' +
                        '<div style="font-size: 9px; color: #999;">' + (r.is_free_spin ? '🎁 免费' : '💰 $' + bet.toFixed(2)) + '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                        '<div style="font-size: 13px; font-weight: 700; color: ' + color + ';">' +
                            (win > 0 ? '+$' + win.toFixed(2) : win < 0 ? '-$' + Math.abs(win).toFixed(2) : '-') +
                        '</div>' +
                        '<div style="font-size: 9px; color: #999;">' + (r.result_symbols ? r.result_symbols.join(' ') : '') + '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
            
            log('加载了 ' + d.data.length + ' 条记录', 'success');
        } catch (err) {
            log('加载失败: ' + err.message, 'error');
        }
    }

    async function startSpin() {
        if (running) return;
        
        const target = parseInt($('spin-cnt').value) || 10;
        const delay = parseInt($('delay').value) || 300;
        const useFreeFirst = $('use-free').checked;
        const maxBuyLimit = $('max-buy').value ? parseInt($('max-buy').value) : null;
        
        if (gameMode === 'advanced' && mode === 'buy') {
            const betInDollars = state.advancedBetAmount / 500000;
            if (betInDollars < 100 || betInDollars > 500) {
                log('❌ 投注金额必须在 $100-$500 之间，当前: $' + betInDollars, 'error');
                return;
            }
            
            if (state.quota < (betInDollars * 1e6)) {
                log('❌ 余额不足，无法进行高级场抽奖', 'error');
                return;
            }
        }
        
        running = true;
        $('kyx-start').disabled = true;
        $('kyx-start').style.opacity = '0.4';
        $('kyx-stop').disabled = false;
        $('kyx-stop').style.opacity = '1';
        
        const modeText = gameMode === 'advanced' ? '高级场' : '初级场';
        const runModeText = mode === 'free' ? '免费' : '购买';
        log('🚀 开始抽奖，目标 ' + target + ' 次，' + modeText + ' - ' + runModeText + '模式', 'success');
        
        if (gameMode === 'advanced' && mode === 'buy') {
            log('💎 投注金额: $' + (state.advancedBetAmount / 500000).toFixed(0), 'info');
        }
        
        let completed = 0;
        let buyCount = 0;
        
        while (running && completed < target) {
            try {
                const canContinue = state.freeSpins > 0 || 
                    (mode === 'buy' && (
                        gameMode === 'advanced' ? 
                        state.quota >= (state.advancedBetAmount / 500000 * 1e6) : 
                        state.spins > 0 || state.bought < state.maxBuy
                    ));
                
                if (!canContinue) {
                    if (mode === 'free') {
                        log('❌ 免费次数用完，停止抽奖', 'warn');
                    } else if (gameMode === 'advanced') {
                        log('❌ 余额不足，无法继续高级场抽奖', 'warn');
                    } else {
                        log('❌ 次数用完且达到购买上限', 'warn');
                    }
                    break;
                }
                
                if (gameMode === 'basic' && state.spins === 0 && mode === 'buy') {
                    if (state.bought >= state.maxBuy) {
                        log('❌ 达到今日购买上限', 'warn');
                        break;
                    }
                    if (maxBuyLimit && buyCount >= maxBuyLimit) {
                        log('❌ 达到设定购买上限', 'warn');
                        break;
                    }
                    
                    log('💳 购买抽奖次数...', 'info');
                    try {
                        const buyData = await buy();
                        buyCount++;
                        log('✓ 购买成功 (已购' + buyCount + '次)', 'success');
                        updateUI();
                        await new Promise(function(resolve) {
                            setTimeout(resolve, delay);
                        });
                        continue;
                    } catch (buyErr) {
                        if (buyErr.message && (
                            buyErr.message.includes('上限') ||
                            buyErr.message.includes('已达') ||
                            buyErr.message.includes('已满')
                        )) {
                            log('❌ 已达今日上限', 'error');
                            break;
                        } else {
                            throw buyErr;
                        }
                    }
                }
                
                const useFree = useFreeFirst && state.freeSpins > 0;
                const spinData = await spin(useFree);
                completed++;
                
                const winAmt = (spinData.data.win_amount || 0) / 1e6;
                const betAmt = (spinData.data.bet_amount || 0) / 1e6;
                const winType = spinData.data.win_type_name || '未知';
                const emoji = winAmt > 0 ? '🎉' : winAmt < 0 ? '⚡' : '➖';
                
                let logMsg = emoji + ' [' + completed + '/' + target + '] ' + winType;
                if (gameMode === 'advanced' && !useFree) {
                    logMsg += ' (投注$' + betAmt.toFixed(0) + ')';
                }
                if (winAmt !== 0) {
                    logMsg += ' ' + (winAmt > 0 ? '+' : '') + '$' + winAmt.toFixed(2);
                }
                
                log(logMsg, winAmt > 0 ? 'success' : winAmt < 0 ? 'warn' : 'info');
                
                updateUI();
                
                if (completed < target && running) {
                    await new Promise(function(resolve) {
                        setTimeout(resolve, delay);
                    });
                }
                
            } catch (err) {
                log('❌ 错误: ' + err.message, 'error');
                
                if (running && completed < target) {
                    log('⏳ 等待3秒后继续...', 'warn');
                    await new Promise(function(resolve) {
                        setTimeout(resolve, 3000);
                    });
                }
            }
        }
        
        running = false;
        $('kyx-start').disabled = false;
        $('kyx-start').style.opacity = '1';
        $('kyx-stop').disabled = true;
        $('kyx-stop').style.opacity = '0.4';
        
        log('✨ 完成！共抽 ' + completed + ' 次' + (buyCount > 0 ? '，购买 ' + buyCount + ' 次' : ''), 'success');
        
        setTimeout(fetchStatus, 1000);
    }

    function init() {
        detectGameMode();
        stats.bet = 0;
        
        setTimeout(function() {
            createBall();
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();