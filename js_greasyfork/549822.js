// ==UserScript==
// @name         SOOP 게시글 원클릭 복사 v31.0
// @namespace    http://tampermonkey.net/
// @version      31.0
// @description  SOOP 기본 채팅 이모티콘(class="emtn")이 비정상적으로 커지는 문제를 해결하여, 모든 이미지 타입을 완벽하게 지원합니다.
// @author       Gemini & User Insight
// @match        https://www.sooplive.co.kr/station/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549822/SOOP%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%9B%90%ED%81%B4%EB%A6%AD%20%EB%B3%B5%EC%82%AC%20v310.user.js
// @updateURL https://update.greasyfork.org/scripts/549822/SOOP%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%9B%90%ED%81%B4%EB%A6%AD%20%EB%B3%B5%EC%82%AC%20v310.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WRITE_PAGE_URL = "https://www.fmkorea.com/index.php?mid=afreecatv&category=2981623405&act=dispBoardWrite";

    const config = { /* 이전과 동일 */ };
    config.defaults = { includeAuthor: true, includeNoticeLink: true, includeLiveLink: true, useButtonBackground: true, useButtonBorder: true, autoGenerateTitle: false, openWritePage: false, };
    config.load = function() { const s = {}; for (const k in this.defaults) s[k] = GM_getValue(k, this.defaults[k]); return s; };
    config.save = function(s) { for (const k in s) GM_setValue(k, s[k]); };

    const ui = { /* 이전과 동일 */ };
    ui.createSettingsPanel = function() { /* 이전과 동일 */ const overlay = document.createElement('div'); overlay.id = 'gemini-settings-overlay'; Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '9997', display: 'none' }); document.body.appendChild(overlay); const panel = document.createElement('div'); panel.id = 'gemini-settings-panel'; Object.assign(panel.style, { position: 'fixed', bottom: '60px', right: '20px', zIndex: '9998', backgroundColor: 'white', color: 'black', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'none', flexDirection: 'column', gap: '10px' }); const settings = config.load(); panel.innerHTML = ` <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">복사 옵션 설정</div> <label><input type="checkbox" data-key="includeAuthor" ${settings.includeAuthor ? 'checked' : ''}><span>작성자 정보 포함</span></label> <label><input type="checkbox" data-key="includeNoticeLink" ${settings.includeNoticeLink ? 'checked' : ''}><span>'공지 바로가기' 버튼 추가</span></label> <label><input type="checkbox" data-key="includeLiveLink" ${settings.includeLiveLink ? 'checked' : ''}><span>'생방송 바로가기' 버튼 추가</span></label> <hr> <label><input type="checkbox" data-key="useButtonBackground" ${settings.useButtonBackground ? 'checked' : ''}><span>바로가기 버튼 배경색 사용</span></label> <label><input type="checkbox" data-key="useButtonBorder" ${settings.useButtonBorder ? 'checked' : ''}><span>바로가기 버튼 테두리 사용</span></label> <hr> <label><input type="checkbox" data-key="autoGenerateTitle" ${settings.autoGenerateTitle ? 'checked' : ''}><span>글쓰기 제목 자동 생성</span></label> <label><input type="checkbox" data-key="openWritePage" ${settings.openWritePage ? 'checked' : ''}><span>글쓰기 페이지 자동 열기</span></label> <button id="gemini-save-settings">저장</button> `; panel.querySelectorAll('label').forEach(l => Object.assign(l.style, { display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px' })); panel.querySelectorAll('label span').forEach(s => s.style.marginLeft = '8px'); panel.querySelectorAll('hr').forEach(h => Object.assign(h.style, { border: '0', borderTop: '1px solid #eee', margin: '5px 0' })); Object.assign(panel.querySelector('#gemini-save-settings').style, { marginTop: '10px', padding: '8px', backgroundColor: '#1859E6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }); document.body.appendChild(panel); this.addSettingsPanelListeners(panel, overlay); };
    ui.addSettingsPanelListeners = function(panel, overlay) { /* 이전과 동일 */ panel.querySelector('#gemini-save-settings').addEventListener('click', () => { const newSettings = {}; panel.querySelectorAll('input[type="checkbox"]').forEach(cb => { newSettings[cb.dataset.key] = cb.checked; }); config.save(newSettings); alert('설정이 저장되었습니다.'); panel.style.display = 'none'; overlay.style.display = 'none'; }); overlay.addEventListener('click', () => { panel.style.display = 'none'; overlay.style.display = 'none'; });};
    ui.createActionButtons = function() { /* 이전과 동일 */ const container = document.createElement('div'); Object.assign(container.style, { position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999', display: 'flex', gap: '5px' }); const copyButton = document.createElement('button'); copyButton.id = 'gemini-copy-button'; copyButton.innerHTML = '📋 내용 복사'; Object.assign(copyButton.style, { padding: '10px 15px', backgroundColor: '#1859E6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }); const settingsButton = document.createElement('button'); settingsButton.id = 'gemini-settings-button'; settingsButton.innerHTML = '⚙️ 설정'; Object.assign(settingsButton.style, { padding: '10px 12px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }); settingsButton.addEventListener('click', () => { const panel = document.getElementById('gemini-settings-panel'); const overlay = document.getElementById('gemini-settings-overlay'); const isHidden = panel.style.display === 'none'; panel.style.display = isHidden ? 'flex' : 'none'; overlay.style.display = isHidden ? 'block' : 'none'; }); container.appendChild(copyButton); container.appendChild(settingsButton); document.body.appendChild(container); copyButton.addEventListener('click', () => copyPostContent(copyButton)); };

    const querySelectorFallback = (selectors, parent = document) => { /* 이전과 동일 */ for (const selector of selectors) { const element = parent.querySelector(selector); if (element) return element; } return null; };
    const waitForPostAndAddButton = () => { /* 이전과 동일 */ const interval = setInterval(() => { const postContent = querySelectorFallback(['.postDetailView_postContent__UUXt1', '.postContent_postContent__az1lt']); const postInfo = querySelectorFallback(['.postInfo_postInfo__O9zGU']); if (postContent && postInfo && !document.getElementById('gemini-copy-button')) { clearInterval(interval); ui.createActionButtons(); ui.createSettingsPanel(); console.log('SOOP 게시글 복사 버튼 v31.0이 활성화되었습니다.'); } }, 500); };

    const imageToDataUrl = (img) => { /* 이전과 동일 */ return new Promise(async (resolve, reject) => { const originalSrc = img.src || img.dataset.url; if (!originalSrc) return resolve(); try { const response = await fetch(originalSrc); const blob = await response.blob(); const reader = new FileReader(); reader.onloadend = () => { img.src = reader.result; resolve(); }; reader.onerror = reject; reader.readAsDataURL(blob); } catch (error) { console.error('이미지 변환 중 오류:', originalSrc, error); resolve(); } }); };

    const copyPostContent = async (button) => {
        const originalText = button.innerHTML;
        try {
            button.innerHTML = '⏳ 처리 중...';
            button.disabled = true;

            const settings = config.load();
            const postInfoArea = querySelectorFallback(['.postInfo_postInfo__O9zGU', 'div[class*="postInfo_postInfo"]']);
            const postContentArea = querySelectorFallback(['.postDetailView_postContent__UUXt1', '.postContent_postContent__az1lt', 'div[class*="postContent_postContent"]']);
            if (!postInfoArea || !postContentArea) { /* ... */ alert('복사할 게시글 정보 또는 본문 영역을 찾지 못했습니다.'); button.innerHTML = originalText; button.disabled = false; return; }

            const contentClone = postContentArea.cloneNode(true);
            const duplicatedHeader = querySelectorFallback(['.postInfo_postInfo__O9zGU'], contentClone);
            if (duplicatedHeader) duplicatedHeader.remove();

            const imageElements = contentClone.querySelectorAll('img');
            const imagePromises = Array.from(imageElements).map(imageToDataUrl);
            await Promise.all(imagePromises);

            // =================================================================
            // [v31.0 수정] SOOP 기본 채팅 이모티콘(emtn) 크기 보존 로직 추가
            // =================================================================
            contentClone.querySelectorAll('img').forEach(img => {
                const isOgqEmoticon = img.classList.contains('ogq_item');
                const isChatEmoticon = img.classList.contains('emtn'); // 새로운 체크
                const originalWidth = img.style.width;
                const dataUrlSrc = img.src;
                const isGif = dataUrlSrc.startsWith('data:image/gif');

                const altText = img.alt || 'image';
                const attributes = Array.from(img.attributes);
                attributes.forEach(attr => img.removeAttribute(attr.name));
                img.src = dataUrlSrc;
                img.alt = altText;

                if (isOgqEmoticon || isChatEmoticon || (isGif && !originalWidth)) {
                    // OGQ, 기본 채팅, 크기 미지정 GIF 이모티콘: 원본 크기 유지
                    Object.assign(img.style, { verticalAlign: 'middle' });
                } else if (originalWidth && originalWidth !== '100%') {
                    // 원본에 너비 값이 지정된 모든 이미지(GIF 포함): 해당 너비 값 존중
                    Object.assign(img.style, {
                        width: originalWidth,
                        height: 'auto'
                    });
                } else {
                    // 그 외 모든 일반 이미지: 너비를 100%로 설정
                    Object.assign(img.style, {
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%'
                    });
                }
            });
            // =================================================================

            const purePostContentHTML = contentClone.innerHTML;
            
            // ... (이하 HTML 구성 로직은 이전과 동일)
            const boardName = querySelectorFallback(['.BoardName_text__wJgc5'], postInfoArea); const noticeTag = querySelectorFallback(['.PostTitle_noti__bqfFO'], postInfoArea); const titleElement = querySelectorFallback(['.PostTitle_title__Yv0VS'], postInfoArea); const nicknameElement = querySelectorFallback(['.PostUser_nickname___geOC'], postInfoArea); let cleanTitleText = titleElement ? titleElement.innerText.trim() : ''; if(noticeTag) cleanTitleText = cleanTitleText.replace(noticeTag.innerText.trim(), '').trim(); let buttonsHtml = ''; if (settings.includeNoticeLink || settings.includeLiveLink) { /* ... */ const generateButtonStyle = (bgColor, defaultTextColor) => { const finalBgColor = settings.useButtonBackground ? bgColor : 'transparent'; const finalTextColor = settings.useButtonBackground ? defaultTextColor : bgColor; let style = `display: inline-block; margin: 0 5px; padding: 11px 20px; font-size: 14px; font-weight: bold; color: ${finalTextColor}; text-decoration: none; vertical-align: middle;`; if (settings.useButtonBorder) { style += ` border: 1px solid ${bgColor};`; } else { style += ` border: 1px solid transparent;`; } style += ` background-color: ${finalBgColor};`; return style; }; const postLink = window.location.href; let userId = null; const stationLinkElement = querySelectorFallback(['a[href*="/station/"]'], postInfoArea); if (stationLinkElement) { const href = stationLinkElement.getAttribute('href'); const match = href.match(/station\/([a-zA-Z0-9-_]+)/); if (match && match[1]) userId = match[1]; } const buttonContainerStyle = `margin-top: 24px; padding-top: 20px; padding-bottom: 20px; border-top: 2px solid #eee; border-bottom: 2px solid #eee; text-align: center;`; buttonsHtml += `<div style="${buttonContainerStyle}">`; if (settings.includeNoticeLink && postLink) { buttonsHtml += `<a href="${postLink}" target="_blank" style="${generateButtonStyle('#6c757d', '#ffffff')}">공지사항 바로가기</a>`; } if (settings.includeLiveLink && userId) { const liveLink = `https://play.sooplive.co.kr/${userId}`; buttonsHtml += `<a href="${liveLink}" target="_blank" style="${generateButtonStyle('#1859E6', '#ffffff')}">생방송 바로가기</a>`; } buttonsHtml += `</div>`; }
            const headerHtml = `<div style="margin-bottom: 20px;"><p style="font-size: 13px; color: #555; margin: 0 0 8px 0; vertical-align: middle;"><span style="display: inline-block; margin-right: 5px; font-size: 1.1em;">📄</span><span>${boardName ? boardName.innerText : '게시판'}</span></p><h2 style="font-size: 24px; font-weight: bold; margin: 0; padding: 0; line-height: 1.2;">${noticeTag ? `<span style="display: inline-block; margin-right: 8px; padding: 2px 8px; font-size: 13px; font-weight: normal; color: #007bff; border: 1px solid #007bff; border-radius: 99px; vertical-align: middle;">${noticeTag.innerText}</span>` : ''}<span style="vertical-align: middle;">${cleanTitleText}</span></h2></div>`;
            let authorHtml = ''; if (settings.includeAuthor) { const profileImg = querySelectorFallback(['.__soopui__Image-module__image___1pa50'], postInfoArea); const regDate = querySelectorFallback(['.PostUser_regDate__KTy7C'], postInfoArea); const viewCount = querySelectorFallback(['.PostUser_viewCount__3o6pl'], postInfoArea); authorHtml = `<table style="border: none; border-collapse: collapse; width: 100%; max-width: 600px; font-family: sans-serif;"><tbody><tr><td style="width: 52px; padding-right: 12px; vertical-align: top;">${profileImg ? `<img src="${profileImg.src}" alt="profile" style="width: 52px; height: 52px; border-radius: 50%;">` : ''}</td><td style="vertical-align: middle;"><div style="font-size: 16px; font-weight: bold;">${nicknameElement ? nicknameElement.innerText : ''}</div><div style="font-size: 12px; color: #888;"><span>${regDate ? regDate.innerText : ''}</span>${viewCount ? `<span style="margin: 0 4px;">·</span><span>조회수 ${viewCount.lastElementChild.innerText}</span>` : ''}</div></td></tr></tbody></table>`; }
            const safeDivider = `<div style="border-top: 1px solid #eee; margin: 20px 0;"></div>`;
            const newHtml = `
                ${headerHtml}
                ${settings.includeAuthor ? authorHtml : ''}
                ${settings.includeAuthor ? safeDivider : safeDivider}
                <div style="font-size: 14px; line-height: 1.6;">${purePostContentHTML}</div>
                ${buttonsHtml}
            `;
            const blobHtml = new Blob([newHtml], { type: 'text/html' });
            await navigator.clipboard.write([new ClipboardItem({'text/html': blobHtml})]);
            if (settings.autoGenerateTitle) { if (nicknameElement && titleElement) { const streamerName = nicknameElement.innerText.trim(); const postTitle = titleElement.innerText.trim(); const generatedTitle = `[ ${streamerName} 공지 ] ${postTitle}`; prompt("자동 생성된 제목입니다. Ctrl+C 로 복사한 후 확인을 눌러주세요.", generatedTitle); } }
            if (settings.openWritePage) { GM_openInTab(WRITE_PAGE_URL, { active: true }); }
            
            button.innerHTML = '✅ 복사 완료!';
            button.style.backgroundColor = '#28a745';
            setTimeout(() => { button.innerHTML = originalText; button.style.backgroundColor = '#1859E6'; button.disabled = false; }, 2000);
        } catch (error) {
            console.error('게시글 자동 복사 중 오류 발생:', error);
            alert('복사 중 오류가 발생했습니다. 개발자 콘솔을 확인해주세요.');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    };
    
    waitForPostAndAddButton();
})();