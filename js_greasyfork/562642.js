// ==UserScript==
// @name         Civitai Buzz Automator
// @name:ko      Civitai 버즈 자동화 스크립트
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate daily Civitai tasks: Claim 25 Buzz, Like 50 images (75 clicks for safety), and Follow 3 users.
// @description:ko Civitai 일일 임무 자동화: 일일 보상(25), 좋아요(50개), 팔로우(3명)를 한 번에 수행하여 최대 버즈를 획득합니다.
// @author       Anonymous
// @match        https://civitai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562642/Civitai%20Buzz%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/562642/Civitai%20Buzz%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 설정값 (Configuration) ===
    const CONFIG = {
        CLICK_DELAY: 150,      // 클릭 간격 (ms)
        BATCH_SIZE: 15,        // 휴식 주기 (클릭 횟수)
        BATCH_REST: 800,       // 휴식 시간 (ms)
        TARGET_LIKES: 75,      // 목표 클릭 수 (누락 방지를 위해 50회보다 넉넉하게 설정)
        MAX_FOLLOWS: 3,        // 목표 팔로우 수
        MODAL_WAIT: 1500,      // 상세창 로딩 대기
        LOAD_WAIT: 2000        // 스크롤 로딩 대기
    };

    let state = {
        likeCount: 0,
        followCount: 0,
        claimStatus: '미시도',
        isLikeRunning: false,
        isFollowRunning: false,
        isMasterRunning: false,
        processedGroups: new WeakSet(),
        processedImages: new WeakSet()
    };

    // === UI 생성 ===
    const createOverlay = () => {
        if (document.getElementById('bf-header-btn')) return;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            #bf-header-btn {
                display: inline-flex; align-items: center; justify-content: center; gap: 6px;
                height: 36px; padding: 0 14px; font-size: 14px; font-weight: 500;
                color: var(--mantine-color-text, #C1C2C5); background: transparent;
                border: none; border-radius: 8px; cursor: pointer;
                transition: background-color 150ms ease, color 150ms ease;
                font-family: inherit; position: relative;
            }
            #bf-header-btn:hover { background: var(--mantine-color-dark-5, #373A40); color: var(--mantine-color-white, #fff); }
            #bf-header-btn.bf-active { background: var(--mantine-color-dark-5, #373A40); color: var(--mantine-color-accent-5, #fab005); }
            #bf-header-btn.bf-running { color: var(--mantine-color-yellow-5, #fab005); }
            #bf-header-btn.bf-running::after {
                content: ''; width: 6px; height: 6px; background: var(--mantine-color-yellow-5, #fab005);
                border-radius: 50%; animation: bf-pulse 1.5s ease-in-out infinite;
            }
            @keyframes bf-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
            #bf-dropdown {
                position: absolute; top: calc(100% + 8px); right: 0; width: 240px;
                background: var(--mantine-color-dark-7, #1A1B1E); border: 1px solid var(--mantine-color-dark-4, #373A40);
                border-radius: 8px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4); padding: 4px; z-index: 10000;
                opacity: 0; visibility: hidden; transform: translateY(-8px) scale(0.95); transition: all 150ms ease;
            }
            #bf-dropdown.bf-open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
            .bf-status { padding: 10px 12px; margin: 4px; background: var(--mantine-color-dark-6, #25262B); border-radius: 6px; font-size: 12px; color: var(--mantine-color-dimmed, #909296); text-align: center; }
            .bf-divider { height: 1px; background: var(--mantine-color-dark-4, #373A40); margin: 4px 0; }
            .bf-menu-label { padding: 8px 12px 4px; font-size: 11px; font-weight: 500; color: var(--mantine-color-dimmed, #909296); text-transform: uppercase; letter-spacing: 0.5px; }
            .bf-menu-item {
                display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px;
                font-size: 14px; font-weight: 400; color: var(--mantine-color-text, #C1C2C5);
                background: transparent; border: none; border-radius: 6px; cursor: pointer;
                transition: background-color 100ms ease; text-align: left; font-family: inherit;
            }
            .bf-menu-item:hover { background: var(--mantine-color-dark-5, #373A40); }
            .bf-menu-item.bf-primary { color: var(--mantine-color-yellow-5, #fab005); }
            .bf-menu-item.bf-primary:hover { background: rgba(250, 176, 5, 0.1); }
            .bf-menu-item.bf-danger { color: var(--mantine-color-red-5, #ff6b6b); }
            .bf-menu-item.bf-danger:hover { background: rgba(255, 107, 107, 0.1); }
            .bf-menu-item-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .bf-menu-item-badge { font-size: 11px; padding: 2px 6px; border-radius: 4px; background: var(--mantine-color-dark-5, #373A40); color: var(--mantine-color-dimmed, #909296); }
            #bf-container { position: relative; display: inline-flex; margin-right: 12px; padding-right: 4px; isolation: isolate; }
            #bf-container::after { content: ''; position: absolute; top: 50%; right: -6px; transform: translateY(-50%); width: 1px; height: 20px; background: var(--mantine-color-dark-4, #373A40); opacity: 0.5; }
        `;
        document.head.appendChild(styleSheet);

        const findCreateButton = () => {
            const links = document.querySelectorAll('header a[href*="/generate"], header a[href*="/create"]');
            for (const link of links) if (link.textContent.includes('Create')) return link;
            const buttons = document.querySelectorAll('header button');
            for (const btn of buttons) if (btn.textContent.includes('Create')) return btn;
            return null;
        };

        const createBtn = findCreateButton();
        if (!createBtn) { setTimeout(createOverlay, 1000); return; }

        const container = document.createElement('div');
        container.id = 'bf-container';
        const headerBtn = document.createElement('button');
        headerBtn.id = 'bf-header-btn';
        headerBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Farm</span>`;

        const dropdown = document.createElement('div');
        dropdown.id = 'bf-dropdown';
        dropdown.innerHTML = `
            <div class="bf-status" id="bf-status">대기 중</div>
            <div class="bf-divider"></div>
            <div class="bf-menu-label">Automation</div>
            <button class="bf-menu-item bf-primary" id="bf-btn-master">
                <span class="bf-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
                <span class="bf-menu-item-content"><div>전체 자동 실행</div><div class="bf-menu-item-desc" style="font-size:10px;">보상 + 좋아요(75회) + 팔로우</div></span>
            </button>
            <div class="bf-divider"></div>
            <div class="bf-menu-label">Manual Tasks</div>
            <button class="bf-menu-item" id="bf-btn-claim">
                <span class="bf-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
                <span class="bf-menu-item-content">일일 보상</span><span class="bf-menu-item-badge">25 Buzz</span>
            </button>
            <button class="bf-menu-item" id="bf-btn-like">
                <span class="bf-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
                <span class="bf-menu-item-content">좋아요</span><span class="bf-menu-item-badge">75회</span>
            </button>
            <button class="bf-menu-item" id="bf-btn-follow">
                <span class="bf-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></span>
                <span class="bf-menu-item-content">팔로우</span><span class="bf-menu-item-badge">3명</span>
            </button>
            <div class="bf-divider"></div>
            <button class="bf-menu-item bf-danger" id="bf-btn-stop" style="display: none;">
                <span class="bf-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></span>
                <span class="bf-menu-item-content">작업 중지</span>
            </button>
        `;

        container.appendChild(headerBtn);
        container.appendChild(dropdown);

        let insertTarget = createBtn;
        let insertParent = createBtn.parentNode;
        const createWrapper = createBtn.closest('[class*="mantine-HoverCard"], [class*="mantine-Menu"], [data-radix-popper-content-wrapper]') || createBtn.parentElement;
        if (createWrapper && createWrapper.parentNode) {
            insertTarget = createWrapper;
            insertParent = createWrapper.parentNode;
        }
        insertParent.insertBefore(container, insertTarget);

        ['mouseenter', 'mouseover', 'mousemove', 'pointerenter', 'pointerover'].forEach(eventType => {
            container.addEventListener(eventType, (e) => e.stopPropagation(), true);
        });

        let isOpen = false;
        const toggleDropdown = (forceClose = false) => {
            if (forceClose || isOpen) {
                isOpen = false; dropdown.classList.remove('bf-open'); headerBtn.classList.remove('bf-active');
            } else {
                isOpen = true; dropdown.classList.add('bf-open'); headerBtn.classList.add('bf-active');
            }
        };

        headerBtn.onclick = (e) => { e.stopPropagation(); toggleDropdown(); };
        document.addEventListener('click', (e) => { if (!container.contains(e.target)) toggleDropdown(true); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDropdown(true); });

        document.getElementById('bf-btn-master').onclick = () => {
            if (state.isMasterRunning || state.isLikeRunning || state.isFollowRunning) stopAll(); else runMasterPlan();
        };
        document.getElementById('bf-btn-like').onclick = () => {
            if (state.isLikeRunning) stopAll(); else if (!checkBusy()) startLikeFarming(false);
        };
        document.getElementById('bf-btn-follow').onclick = () => {
            if (state.isFollowRunning) stopAll(); else if (!checkBusy()) startFollowFarming(false);
        };
        document.getElementById('bf-btn-claim').onclick = () => { if (!checkBusy()) claimDailyReward(false); };
        document.getElementById('bf-btn-stop').onclick = () => stopAll();
    };

    const updateStatus = (msg) => { const el = document.getElementById('bf-status'); if (el) el.innerHTML = msg; };
    const setRunningState = (isRunning) => {
        const headerBtn = document.getElementById('bf-header-btn');
        const stopBtn = document.getElementById('bf-btn-stop');
        if (headerBtn) isRunning ? headerBtn.classList.add('bf-running') : headerBtn.classList.remove('bf-running');
        if (stopBtn) stopBtn.style.display = isRunning ? 'flex' : 'none';
    };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const checkBusy = () => {
        if (state.isMasterRunning || state.isLikeRunning || state.isFollowRunning) { alert('현재 작업 중입니다. 중지 후 실행하세요.'); return true; }
        return false;
    };
    const stopAll = () => {
        state.isMasterRunning = false; state.isLikeRunning = false; state.isFollowRunning = false;
        setRunningState(false); updateStatus('작업 중지됨');
    };

    const forceLoadMore = async () => {
        updateStatus('▼ 바닥으로 이동 중...');
        window.scrollTo(0, document.body.scrollHeight);
        const mainDiv = document.querySelector('#main > div > div > div');
        if (mainDiv) mainDiv.scrollTop = mainDiv.scrollHeight;
        updateStatus('⌛ 로딩 대기...');
        await sleep(CONFIG.LOAD_WAIT);
    };

    // ============================================================
    // 로직 (Logic)
    // ============================================================
    const runMasterPlan = async () => {
        if (!location.href.includes('/images')) { alert('/images 페이지로 이동해주세요.'); return; }
        state.isMasterRunning = true; setRunningState(true);

        updateStatus('Step 1. 일일 보상');
        await claimDailyReward(true);
        if (!state.isMasterRunning) return;

        updateStatus('Step 2. 좋아요 (75회)');
        await sleep(1000);
        await startLikeFarming(true);
        if (!state.isMasterRunning) return;

        updateStatus('Step 3. 팔로우 (3명)');
        await sleep(1000);
        await startFollowFarming(true);
        if (!state.isMasterRunning) return;

        stopAll();
        // 실제 유효 버즈 계산 (75개 눌렀어도 50개까지만 유효하므로)
        const buzzLikely = 100 + (state.followCount * 10) + (state.claimStatus === '성공' ? 25 : 0);
        alert(`🎉 모든 작업 완료!\n\n🟡 보상: ${state.claimStatus}\n❤️ 좋아요: ${state.likeCount}회 (목표: 75)\n👤 팔로우: ${state.followCount}명\n\n💰 최대 획득 예상: ${buzzLikely} Buzz`);
    };

    const isLiked = (btn) => {
        if (btn.getAttribute('aria-pressed') === 'true' || btn.getAttribute('data-active') === 'true') return true;
        const style = window.getComputedStyle(btn);
        const bgColor = style.backgroundColor;
        return bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' && !bgColor.includes('255, 255, 255') && !bgColor.includes('37, 38, 43');
    };

    const startLikeFarming = async (silentMode = false) => {
        state.isLikeRunning = true;
        if (!silentMode) setRunningState(true);

        let noClickConsecutive = 0;
        let batchCounter = 0;

        while ((state.isLikeRunning || (silentMode && state.isMasterRunning)) && state.likeCount < CONFIG.TARGET_LIKES) {
            if (silentMode && !state.isMasterRunning) break;

            const reactionGroups = document.querySelectorAll('div.flex.items-center.justify-center.gap-1.justify-between.p-2');
            let clicked = 0;

            for (const group of reactionGroups) {
                if (state.likeCount >= CONFIG.TARGET_LIKES) break;
                if (state.processedGroups.has(group)) continue;
                const btn = group.querySelector('button');
                if (btn) {
                    if (isLiked(btn)) { state.processedGroups.add(group); continue; }
                    try {
                        btn.style.border = '2px solid #4ade80'; btn.click();
                        state.processedGroups.add(group); state.likeCount++; clicked++; batchCounter++;
                        
                        updateStatus(`Like <b>${state.likeCount}</b> / ${CONFIG.TARGET_LIKES}`);
                        
                        await sleep(CONFIG.CLICK_DELAY);
                        setTimeout(() => btn.style.border = '', 500);

                        // 배치 휴식 (서버 과부하 방지)
                        if (batchCounter >= CONFIG.BATCH_SIZE) {
                            updateStatus(`잠시 대기 중...`);
                            await sleep(CONFIG.BATCH_REST);
                            batchCounter = 0;
                        }

                    } catch (e) {}
                }
            }

            if (clicked === 0) {
                await forceLoadMore();
                noClickConsecutive++;
            } else {
                noClickConsecutive = 0;
            }

            if (noClickConsecutive > 50) break;
        }

        if (!silentMode) {
            stopAll();
            if (state.likeCount >= CONFIG.TARGET_LIKES) alert(`🎉 좋아요 완료! (${state.likeCount}회 클릭됨)`);
        }
    };

    const startFollowFarming = async (silentMode = false) => {
        state.isFollowRunning = true;
        if (!silentMode) setRunningState(true);
        updateStatus('팔로우 대상 탐색 중');

        while ((state.isFollowRunning || (silentMode && state.isMasterRunning)) && state.followCount < CONFIG.MAX_FOLLOWS) {
            if (silentMode && !state.isMasterRunning) break;

            const images = Array.from(document.querySelectorAll('a[href*="/images/"]'));
            let targetImage = images.find(img => !state.processedImages.has(img) && /\/images\/\d+/.test(img.href) && img.querySelector('img'));

            if (!targetImage) {
                await forceLoadMore();
                continue;
            }

            state.processedImages.add(targetImage);
            targetImage.click();
            await sleep(CONFIG.MODAL_WAIT);

            if (silentMode && !state.isMasterRunning) break;

            const followBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'follow');
            if (followBtn) {
                followBtn.click(); state.followCount++;
                updateStatus(`Follow <b>${state.followCount}</b> / 3`);
                await sleep(1000);
            }
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
            const overlay = document.querySelector('.mantine-Modal-overlay');
            if (overlay) overlay.click();
            await sleep(800);
        }

        if (!silentMode) {
            stopAll();
            if (state.followCount >= CONFIG.MAX_FOLLOWS) alert(`🎉 팔로우 목표 달성! (${state.followCount}명)`);
        }
    };

    const claimDailyReward = async (silentMode = false) => {
        updateStatus('보상 확인 중');
        state.claimStatus = '실패';
        const createBtn = Array.from(document.querySelectorAll('header a, header button')).find(el => el.innerText.includes('Create') || el.innerText.includes('Generate') || (el.getAttribute('href') && el.getAttribute('href').includes('/generate')));

        if (!createBtn) {
            if (!silentMode) alert('Create 버튼 없음');
            return;
        }

        createBtn.click();
        await sleep(2500);

        const claimBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Claim') && b.innerText.includes('Buzz'));
        if (claimBtn) {
            claimBtn.style.border = '3px solid red'; await sleep(500); claimBtn.click();
            state.claimStatus = '성공'; updateStatus('보상 수령 완료');
            if (!silentMode) alert('🎉 25 Buzz 수령 완료!');
        } else {
            state.claimStatus = '이미 받음/없음'; updateStatus('보상 버튼 없음');
            if (!silentMode) alert('보상 버튼이 없습니다. (이미 수령 추정)');
        }
        await sleep(800);
        createBtn.click();
        await sleep(500);
    };

    window.addEventListener('load', () => setTimeout(createOverlay, 1000));
    setInterval(() => { if (!document.getElementById('bf-header-btn')) createOverlay(); }, 2000);
})();