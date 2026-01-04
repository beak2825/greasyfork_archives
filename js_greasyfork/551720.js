// ==UserScript==
// @name         Auto somi 개선 V4
// @name:ko      자동 소미 개선 V4
// @namespace    http://tampermonkey.net/
// @description  자동 복호화/국룰입력/다운
// @version      new 6.5.0
// @author       김머시기 개조판
// @match        https://kiosk.ac/c/*
// @match        https://kio.ac/c/*
// @match        https://kone.gg/*
// @match        https://arca.live/b/*
// @match        https://mega.nz/*
// @match        https://gofile.io/d/*
// @match        https://workupload.com/*
// @match        https://drive.google.com/file/d/*
// @match        https://drive.google.com/drive/folders/*
// @match        https://drive.usercontent.google.com/download?id*
// @icon         https://lh3.google.com/u/0/d/18OVO7VmnwIuHK6Ke-z7035wKFmMKZ28W=w1854-h959-iv1
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        GM.xmlHttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551720/Auto%20somi%20%EA%B0%9C%EC%84%A0%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/551720/Auto%20somi%20%EA%B0%9C%EC%84%A0%20V4.meta.js
// ==/UserScript==
'use strict';
let chkp = [,,,, atob('c29taXNvZnQ='), null], Down_Option, PageLoading = [], isT = [,,], MenuID = [null, null, null], host = document.URL.split('/')[2], npw = [], pw = [atob('c29taXNvZnQ='),atob('MjAyNXNvbWlzb2Z0'),
// ================================== Settings ==========================================
// 추가하길 원하는 비밀번호 따옴표 - 쉼표로 구분해서 바로 아래줄에 넣으면 됨 ex) '1234', '2024국룰', '!국룰!'
'atelier', '실루엣21'
];
PageLoading[0] = 1000;
Down_Option = 0;
// =============렉유발요소 관리함수=================
const SOMI_POLLING_MS = 200; //(기본값 200) 헬퍼: 폴링 주기에 사용하는 상수
let somi_debounce_timer = null; // 기존 MutationObserver 콜백에서 바로 FindPW/doDec 하는 대신 scheduleHeavyWork() 호출로 바꿔준다
function scheduleHeavyWork(delay = 500) { //(기본값 0) 이미 예약된 작업이 있으면 취소하고 새로 예약하는 함수 (디바운스)
  if (somi_debounce_timer) clearTimeout(somi_debounce_timer); // 직전 예약 취소
  somi_debounce_timer = setTimeout(async () => {
    somi_debounce_timer = null;
    try {
      await FindPW();
      setTimeout(doDec, 200);
    } catch(e) {}
  }, delay);
}
// DLsite fetch 중복 방지 용 (링크 단위)
function markFetching(el) {
  if (!el) return false;
  if (el.dataset && el.dataset._dlsite_fetching) return true;
  if (el.dataset) el.dataset._dlsite_fetching = '1';
  return false;
}
function unmarkFetching(el) {
  if (!el || !el.dataset) return;
  delete el.dataset._dlsite_fetching;
}
// =====================================DL관련 함수=================================================
let allCode = []; // RJ&VJ번호
let title_Text = ""; // 게시글 제목
function replaceInvalidCharsForFilename(str) { // 특문을 아스키코드로 변환
    if (str == null) return "";
    return str.replace(/[?\/\\:*"?<>|]/g, match => {
        switch (match) {
            case '?': return '？';
            case '/': return '／';
            case '\\': return '＼';
            case ':': return '：';
            case '*': return '＊';
            case '"': return '＂';
            case '<': return '＜';
            case '>': return '＞';
            case '|': return '｜';
            default: return match;
        }
    });
}

function doFetch(url, options = {
    method: 'GET',
    responseType: 'document'
}, silent = false) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            url: url,
            method: options.method,
            responseType: options.responseType,
            headers: options.headers,
            data: options.data,
            onload: result => {
                console.debug(result);
                if (result.status === 200) {
                    resolve(result.response);
                } else {
                    if (!silent) {
                        console.log(result);
                        alert("알 수 없는 오류로 인해 데이터를 불러오지 못했습니다. " + url);
                        reject(result.status);
                    } else {
                        console.debug(result);
                        reject(result.status);
                    }
                }
            },
            onerror: err => {
                console.debug(err);
                reject(err);
            }
        });
    });
}
// 숫자를 바이트 문자열(용량)로 변환합니다
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
        return '-';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
// 배열을 문자열로 변환합니다
function arr2str(arr, opt = ", ") {
    let idx = arr.indexOf("")

    while (idx > -1) {
        arr.splice(idx, 1)
        idx = arr.indexOf("")
    }

    return String(arr).replace(/"/g, '').replace('[', "").replace(']', "").replace(/,/g, opt)
}
// DLSite에서 제품 정보를 확인
function getProductInformation(productCode) {
    return new Promise((resolve, reject) => {
        const url = `https://www.dlsite.com/maniax/api/=/product.json?workno=${productCode}&locale=ko-KR`
        doFetch(url, {
                method: 'GET',
                responseType: 'json'
            })
            .then(result => {
                const json = result[0];
                if (json) {
                    const processedJson = Object()

                    // 특수문자 대체
                    const safeCircleUrl = replaceInvalidCharsForFilename(json.maker_name);
                    const safeTitle = replaceInvalidCharsForFilename(json.work_name);
                    title_Text = replaceInvalidCharsForFilename(title_Text);

                    processedJson.thumbnailImage = [`<img width='180' height='120' src='https:${json.image_main.url}' alt='이미지'>`]

                    processedJson.workType = [`${json.work_type} ／ ${json.work_type_string}`]
                    processedJson.title = safeTitle;
                    processedJson.intro = [json.intro_s]

                    if (json.genres) {
                        processedJson.genres = []

                        json.genres.forEach(genre => {
                            processedJson.genres.push(genre.name)
                        })

                        processedJson.genres = [arr2str(processedJson.genres)]
                    }

                    processedJson.fileInfo = [`${json.file_type}(${formatBytes(json.contents_file_size)})`]

                    processedJson.workUrl_button = `https://www.dlsite.com/home/work/=/product_id/${productCode}.html`;
                    processedJson.workUrl = productCode

                    processedJson.circleUrl_button = `https://www.dlsite.com/maniax/circle/profile/=/maker_id/${json.circle_id}.html`;
                    processedJson.circleUrl = safeCircleUrl;

                    // title_Text가 ( 또는 [ 로 시작하지 않으면 앞에 공백 추가
                    if (!/^[\(\[]/.test(title_Text)) { title_Text = " " + title_Text; }
                    // 코네 닉네임 추출
                    const userName = document.querySelector("a.flex.items-center.gap-1.text-sm.font-medium.hover\\:underline")?.textContent || '';

                    processedJson.fullName = `[${productCode}][${safeCircleUrl}]${title_Text} (by ${userName})`;

                    resolve(processedJson);
                } else {
                    reject(new Error("Request is failed."));
                }
            })
    });
}
//function createProductElement(productCode) {
window.createProductElement = function (productCode) {
    return new Promise((resolve, reject) => {
        getProductInformation(productCode).then(function(data) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.thumbnailImage;
            const imgUrl = tempDiv.querySelector('img')?.src || '';
            const html =
                '<table width="100%" border="0" style="margin-top:4px; margin-bottom:4px; margin-left:12px; margin-right:12px; border-collapse:collapse;">' +
                '<tbody>' +
                '<tr><!-- 첫번째 줄 시작 -->' +
                `<td style="width: 1px; white-space: nowrap; padding: 0px;" rowspan="2"><img src="${imgUrl}" style="max-width:240px; max-height:160px; border-radius:0px; margin-right:0px;"></td>` +
                '<td valign="center">' +
                '<div>' +
                  `<div><!-- 넘버, 장르, 제목 -->
                    <span class="workUrl-row"><span class="font-pretendard inline-block px-1 py-0.5 text-xs font-semibold rounded bg-black text-white" style="display:inline-block; margin:0px 0px 0px 8px">${data.workUrl}</span></span>
                    <span class="workType-row"><span class="font-pretendard inline-block px-1 py-0.5 text-xs font-semibold rounded bg-black text-white" style="display:inline-block; margin:0px 6px 0px 2px">${data.workType}</span></span>
                    <span class="title-row">${data.title}</span>
                  </div>` +
                  `<div class="intro-row" style="display:block; margin:0px 0px 0px 24px; font-size: 0.8375em; opacity: 0.8;"><li>설명 : ${data.intro}</li></div>` +
                  `<div class="circle-row" style="display:block; margin:0px 0px 0px 24px; font-size: 0.8375em; opacity: 0.8;"><li>서클 : ${data.circleUrl}</li></div>` +
                  `<div class="genres-row" style="display:block; margin:0px 0px 0px 24px; font-size: 0.8375em; opacity: 0.8;"><li>태그 : ${data.genres}</li></div>` +
                  `<div class="file-row" style="display:block; margin:0px 0px 0px 24px; font-size: 0.8375em; opacity: 0.8;"><li>파일(용량) : ${data.fileInfo}</li></div>` +
                  `<div class="full-row" style="display:block; margin:0px 0px 0px 24px; font-size: 0.8375em; opacity: 0.8;"><li>풀네임 : ${data.fullName}</li></div>` +
                  `<span class="link-buttons"></span>` +
                  `<div></div>` +
                '</div>' +
                '</td>' +
                '</tr><!-- 첫번째 줄 끝 -->' +
                '</tbody>' +
                '</table>';

            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;

            // 🔹 복사 가능 항목 지정
            makeCopyable(wrapper.querySelector('.title-row'), data.title);
            makeCopyable(wrapper.querySelector('.workUrl-row'), data.workUrl);
            makeCopyable(wrapper.querySelector('.workType-row'), data.workType);
            makeCopyable(wrapper.querySelector('.intro-row'), data.intro);
            makeCopyable(wrapper.querySelector('.circle-row'), data.circleUrl);
            makeCopyable(wrapper.querySelector('.genres-row'), data.genres);
            makeCopyable(wrapper.querySelector('.file-row'), data.fileInfo);
            makeCopyable(wrapper.querySelector('.full-row'), data.fullName);

            // 🔹 RJ/RG 버튼 추가
            const linkDiv = wrapper.querySelector('.link-buttons');

            if (linkDiv) {
              linkDiv.style.position = 'absolute';
              linkDiv.style.top = '0px';
              linkDiv.style.right = '4px';
              linkDiv.style.display = 'flex';
              linkDiv.style.gap = '0px'; // 버튼 사이 간격

                if (data.workUrl_button) {
                    const rjBtn = document.createElement('a');
                    rjBtn.href = data.workUrl_button;
                    rjBtn.target = '_blank';
                    rjBtn.textContent = 'RJ';
                    rjBtn.style.marginRight = '6px';
                    rjBtn.style.fontWeight = 'bold';
                    linkDiv.appendChild(rjBtn);
                }
                if (data.circleUrl_button) {
                    const rgBtn = document.createElement('a');
                    rgBtn.href = data.circleUrl_button;
                    rgBtn.target = '_blank';
                    rgBtn.textContent = 'RG';
                    rgBtn.style.fontWeight = 'bold';
                    linkDiv.appendChild(rgBtn);
                }
            }

            // resolve(html);
            // resolve(wrapper.innerHTML); // HTML 문자열로 반환
            resolve(wrapper);
        }).catch(reject);
    });
}
// 다크/라이트 모드 갱신 함수
function updateBlockTheme() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.my-inserted-block').forEach(el => {
        el.style.backgroundColor = isDarkMode ? "#2c2c2c" : "#f8f9fa";
        el.style.border = isDarkMode ? "1px solid #555" : "1px solid #dee2e6";
    });
}
// 새로운 코드가 들어올 때마다 처리하는 함수
function addCode(code) {
    if (!allCode.includes(code)) allCode.push(code);
    else return;

    const articleView = document.querySelector(".overflow-hidden.break-all");
    if (!articleView) return;
    const articleWrapper = document.querySelector(".pb-4.pt-2.pl-6.pr-3");
    if (!articleWrapper) return;

    // 채널 이름과 게시글 제목의 사이에 게임 목록 목차 만들기
    if (!document.querySelector(".my-inserted-header")) { // 중복 삽입 방지
      // 헤더 추가
      const header = document.createElement('p');
      header.className = "my-inserted-header";
      header.innerHTML = '<span style="display:inline-block; width:20px; margin:4px 0px 10px 12px;">📦</span> 게시글에서 언급된 게임 목록';
      articleView.insertBefore(header, articleWrapper);
    }

    // 게임 목록 만들기
    createProductElement(code).then(html => {
        const contents = document.createElement('div');
        contents.className = "my-inserted-block";
        contents.style.width = "90%";
        contents.style.marginLeft = "auto";
        contents.style.marginRight = "auto";
        contents.style.paddingRight = "10px";
        contents.style.position = "relative";
        //contents.innerHTML = html;
        contents.appendChild(html);

        articleView.insertBefore(contents, articleWrapper);

        updateBlockTheme(); // 새 블록 추가 후 즉시 다크/라이트 적용
    });
}

// 다크모드/라이트모드 감지
if (!window._myInsertedBlockObserver) {
    window._myInsertedBlockObserver = new MutationObserver(updateBlockTheme);
    window._myInsertedBlockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
// =======================================복붙관련===========================================
    // ====== 클릭 시 복사 함수 ======
    function makeCopyable(element, text) {
        if (!element) return;
        element.style.cursor = 'pointer';
        element.onclick = () => {
            navigator.clipboard.writeText(text).then(() => {
                showToast('복사 완료!');
            }).catch(err => {
                console.error('복사 실패:', err);
                showToast('복사 실패');
            });
        };
    }

    // ====== 토스트 표시 함수 ======
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = 'white';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '0.9em';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.style.opacity = '1');

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => toast.remove());
        }, 1500);
    }

    // ====== RJ / RG 버튼 생성 ======
    function createLinkButton(label, url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.textContent = label;
        a.style.marginRight = '4px';
        a.style.textDecoration = 'none';
        a.style.fontWeight = 'bold';
        return a;
    }

// ===================================원본코드들===================================================
const dlsitePreview = {
    element: null,
    images: [],
    currentIndex: 0,
    isShowing: false,
    activeKeyListener: null,
    activeWheelListener: null, // 마우스 휠 리스너 저장용
    globalKeydownListener: null, // 유지 (document 레벨 키 이벤트)
    isEnabled: true
};

function getKoneGGContentElement() {
    if (host !== 'kone.gg') return null;
    const proseContainer = document.querySelector('div.prose-container');
    if (!proseContainer || !proseContainer.shadowRoot) return null;
    const contentDiv = proseContainer.shadowRoot.querySelector('div.contents');
    return contentDiv;
}

async function handleBlockingModals(currentHost) {
    function hideElement(selector) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    if (el.offsetParent !== null) {
                        el.style.setProperty('display', 'none', 'important');
                    }
                });
            }
        } catch (e) {
        }
    }

    if (currentHost === 'kone.gg') {
        const nsfwOverlayContainer = document.querySelector('div.relative.min-h-60 > div.absolute.w-full.h-full.backdrop-blur-2xl');
        if (nsfwOverlayContainer && nsfwOverlayContainer.offsetParent !== null) {
            const viewContentButton = nsfwOverlayContainer.querySelector('div.flex.gap-4 button:nth-child(2)');
            if (viewContentButton && viewContentButton.textContent?.includes('콘텐츠 보기')) {
                viewContentButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                const modalSelectorsKone = [
                    '.age-verification-popup',
                    '.content-overlay.block',
                ];
                modalSelectorsKone.forEach(selector => hideElement(selector));
            }
        }
    } else if (currentHost === 'arca.live') {
        const modalSelectorsArca = [
            { selector: '.adult-confirm-modal', action: 'hide' },
            { selector: '.fc-dialog', action: 'hide' },
            { selector: '#preview-block-layer', action: 'hide' },
            { selector: 'div[class*="adult-channel-confirm"]', action: 'hide' },
            { selector: 'div.modal[data-id="confirmAdult"] div.modal-footer button.btn-primary', action: 'click'},
            { selector: 'button.btn-primary.btn.text-light[data-bs-dismiss="modal"]', action: 'click' }
        ];
        modalSelectorsArca.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach(element => {
                if (element && element.offsetParent !== null) {
                    if (item.action === 'click') {
                        element.click();
                    } else {
                        hideElement(item.selector);
                    }
                }
            });
        });
    }
}

async function toggleDown(){
    isT[0]=!isT[0];
    if(!isT[0] && isT[1]){
        isT[1]=false;
        await GM.setValue('isT[1]', isT[1]);
    }
    await GM.setValue('isT[0]', isT[0]);
    updateDown();
    updateTab();
    toggleDlsitePreview();
}

async function toggleTab(){
    isT[1]=!isT[1];
    if(!isT[0] && isT[1]){
        isT[0]=true;
        await GM.setValue('isT[0]', isT[0]);
    }
    await GM.setValue('isT[1]', isT[1]);
    updateDown();
    updateTab();
    toggleDlsitePreview();
}

async function toggleDlsitePreview() {
    dlsitePreview.isEnabled = !dlsitePreview.isEnabled;
    await GM.setValue('dlsitePreviewEnabled', dlsitePreview.isEnabled);
    updateDown();
    updateTab();
    updateDlsitePreviewMenu();
    if (!dlsitePreview.isEnabled && dlsitePreview.isShowing) {
        hideDlsitePreview();
    }
    const allDlsiteLinks = document.querySelectorAll('a[href*="dlsite.com"]');
    allDlsiteLinks.forEach(link => {
        link.removeEventListener('mouseenter', showDlsitePreview);
        link.removeEventListener('mouseleave', hideDlsitePreview);
        delete link.dataset._dlsite_preview_hooked;
        if (dlsitePreview.isEnabled) {
            link.addEventListener('mouseenter', showDlsitePreview);
            link.dataset._dlsite_preview_hooked = '1';
        }
    });
}

async function updateDown() {
    if (MenuID[0] !== null) await GM.unregisterMenuCommand(MenuID[0]);
    MenuID[0] = await GM.registerMenuCommand(
        `자동 다운로드  ${isT[0] ? 'ON' : 'OFF'}`,
        toggleDown,
        { autoClose: false, title: `자동 다운로드 ${isT[0] ? '켜짐' : '꺼짐'}` }
    );
}

async function updateTab() {
    if (MenuID[1] !== null) await GM.unregisterMenuCommand(MenuID[1]);
    MenuID[1] = await GM.registerMenuCommand(
        `자동 탭 닫기    ${isT[1] ? 'ON' : 'OFF'}`,
        toggleTab,
        { autoClose: false, title: `자동 탭 닫기 ${isT[1] ? '켜짐' : '꺼짐'}` }
    );
}

async function updateDlsitePreviewMenu() {
    if (MenuID[2] !== null) await GM.unregisterMenuCommand(MenuID[2]);
    MenuID[2] = await GM.registerMenuCommand(
        `DLsite 미리보기 ${dlsitePreview.isEnabled ? 'ON' : 'OFF'}`,
        toggleDlsitePreview,
        { autoClose: false, title: `DLsite 미리보기 ${dlsitePreview.isEnabled ? '켜짐' : '꺼짐'}` }
    );
}

function decodeContent(target, reg) {
    try {
        if (!target || !target.innerHTML) return;
        const originalHTML = target.innerHTML;
        let newHTML = originalHTML;

        const matches = [...originalHTML.matchAll(reg)];
        if (matches.length === 0) return;

        for (const match of matches) {
            let encodedString = match[0];
            let decodedPotentialUrl = encodedString;

            try {
                let previousDecoded = "";
                for (let i = 0; i < 5; i++) {
                    if (!decodedPotentialUrl || typeof decodedPotentialUrl !== 'string') break;
                    let currentDecoded;
                    try {
                        currentDecoded = atob(decodedPotentialUrl);
                    } catch(e) {
                        break;
                    }

                    if (currentDecoded.toLowerCase().startsWith('http://') || currentDecoded.toLowerCase().startsWith('https://')) {
                        decodedPotentialUrl = currentDecoded;
                        break;
                    }
                    if (previousDecoded === currentDecoded) {
                        break;
                    }
                    previousDecoded = currentDecoded;
                    decodedPotentialUrl = currentDecoded;
                }


                if (decodedPotentialUrl && typeof decodedPotentialUrl === 'string' &&
                    (decodedPotentialUrl.toLowerCase().startsWith('http://') || decodedPotentialUrl.toLowerCase().startsWith('https://'))) {

                    try {
                        const parsedUrl = new URL(decodedPotentialUrl);
                        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
                            continue;
                        }

                        const cleanHref = parsedUrl.href;

                        const textSpan = document.createElement('span');
                        textSpan.textContent = cleanHref;
                        const safeLinkDisplayText = textSpan.innerHTML;

                        const linkHTML = `<a href="${cleanHref}" target="_blank" rel="noreferrer" style="color:#007bff; text-decoration:underline; word-break:break-all;">${safeLinkDisplayText}</a>`;
                        newHTML = newHTML.replace(encodedString, linkHTML);

                    } catch (urlError) {
                    }
                }
            } catch (decodeError) {
            }
        }

        if (target.innerHTML !== newHTML) {
            target.innerHTML = newHTML;
        }
    } catch (e) {
    }
}

function doDec() {
    if (chkp[3] !== chkp[4]) return;

    let targets = [];

    if (host === 'arca.live') {
        targets = [
            document.querySelector('body div.article-body > div.fr-view.article-content'),
            ...document.querySelectorAll('div.article-comment#comment div.comment-content, div.article-comment div.comment-content')
        ].filter(el => el !== null);
    } else if (host === 'kone.gg') {
        const koneContentElement = getKoneGGContentElement();
        const comments = document.querySelectorAll('p.text-sm.whitespace-pre-wrap');
        const listItems = document.querySelectorAll('ol.list-decimal li p');
        targets = [koneContentElement, ...comments, ...listItems].filter(el => el !== null);
    }

    if (targets.length === 0 || (targets.length === 1 && !targets[0])) return;

    for (const target of targets) {
        if (!target) continue;
        const links = target.querySelectorAll('a');
        links.forEach(a => {
            a.setAttribute('rel', 'noreferrer');
        });

        decodeContent(target, /aHR0c[0-9A-Za-z+/=]{8,}/g);
        decodeContent(target, /YUhSMG[0-9A-Za-z+/=]{8,}/g);
        decodeContent(target, /WVVoU[0-9A-Za-z+/=]{8,}/g);
        decodeContent(target, /V1ZWb[0-9A-Za-z+/=]{8,}/g);
        decodeContent(target, /ttps:\/\/[0-9A-Za-z./?=&#%_-]+/g);
        doDlsiteContextAwareForElement(target);
    }

    if (host === 'kone.gg') {
        const koneContentElement = getKoneGGContentElement();
        if (!koneContentElement || koneContentElement.querySelector('.dlsite-link-appended')) return;

        const titleText = document.querySelector('h1.flex, h1.text-xl')?.textContent || '';
        title_Text = titleText;
        const commentTexts = [...document.querySelectorAll('.text-sm.whitespace-pre-wrap')]
            .map(el => el.textContent || '')
            .join(' ');
        const bodyText = koneContentElement?.textContent || '';

        const allText = `${titleText} ${bodyText} ${commentTexts}`;
        const rjMatches = [...allText.matchAll(/\b(RJ|rj|Rj|rJ)([0-9]{5,8})\b/g)];
        const rjSet = new Set(rjMatches.map(m => m[1].toUpperCase() + m[2]));

        for (const code of rjSet) {
          addCode(code); // RJ번호 수집
        }

        if (rjSet.size === 1) {
            const onlyCode = [...rjSet][0];
            const linkUrl = `https://www.dlsite.com/maniax/work/=/product_id/${onlyCode}.html`;

            const finalLine = document.createElement('div');
            finalLine.className = 'dlsite-link-appended';
            finalLine.style.marginTop = '1em';
            finalLine.innerHTML = `<a href="${linkUrl}" target="_blank" rel="noreferrer" style="color:#1e90ff; font-weight:bold;">▶ ${onlyCode} DLsite 링크</a>`;
            koneContentElement.appendChild(finalLine);

            const appendedLink = finalLine.querySelector('a[href*="dlsite.com"]');
            if (appendedLink && !appendedLink.dataset._dlsite_preview_hooked) {
                if (dlsitePreview.isEnabled) {
                    appendedLink.addEventListener('mouseenter', showDlsitePreview);
                    appendedLink.addEventListener('mouseleave', hideDlsitePreview, { once: true });
                }
                appendedLink.dataset._dlsite_preview_hooked = '1';
            }
        }
    }
}

function updateDlsitePreviewImage() {
    if (!dlsitePreview.element || dlsitePreview.images.length === 0) {
        return;
    }

    dlsitePreview.element.innerHTML = '';
    const img = document.createElement('img');
    img.src = dlsitePreview.images[dlsitePreview.currentIndex];
    img.referrerPolicy = 'no-referrer';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    dlsitePreview.element.appendChild(img);
}

function handleDlsiteKeydown(event) {
    if (!dlsitePreview.element || !dlsitePreview.isShowing || dlsitePreview.images.length <= 1) {
        return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.stopPropagation();
        event.preventDefault();

        if (event.key === 'ArrowLeft') {
            dlsitePreview.currentIndex = (dlsitePreview.currentIndex - 1 + dlsitePreview.images.length) % dlsitePreview.images.length;
        } else if (event.key === 'ArrowRight') {
            dlsitePreview.currentIndex = (dlsitePreview.currentIndex + 1) % dlsitePreview.images.length;
        }
        updateDlsitePreviewImage();
    }
}

function handleDlsiteMouseWheel(event) {
    if (!dlsitePreview.element || !dlsitePreview.isShowing || dlsitePreview.images.length <= 1) {
        return;
    }

    event.stopPropagation();
    event.preventDefault();

    if (event.deltaY < 0) { // Wheel up
        dlsitePreview.currentIndex = (dlsitePreview.currentIndex - 1 + dlsitePreview.images.length) % dlsitePreview.images.length;
    } else if (event.deltaY > 0) { // Wheel down
        dlsitePreview.currentIndex = (dlsitePreview.currentIndex + 1) % dlsitePreview.images.length;
    }
    updateDlsitePreviewImage();
}


function showDlsitePreview(event) {
    if (!dlsitePreview.isEnabled) return;

    const link = event.target;
    const productUrl = link.href;

    if (dlsitePreview.isShowing) return;
    dlsitePreview.isShowing = true;

    dlsitePreview.element = document.createElement('div');
    dlsitePreview.element.style.cssText = `
        position: fixed;
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        max-width: 960px;
        max-height: 960px;
        overflow: hidden;
        pointer-events: auto; /* Make sure wheel events are captured by this element */
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    document.body.appendChild(dlsitePreview.element);

    moveDlsitePreview(event);
    document.addEventListener('mousemove', moveDlsitePreview);

    // 페이지 이동 시 미리보기 제거 -추가함
    if (!dlsitePreview._popstateHooked) {
        window.addEventListener('popstate', hideDlsitePreview);
        window.addEventListener('beforeunload', hideDlsitePreview);
        dlsitePreview._popstateHooked = true; // 중복 등록 방지
    }

    if (markFetching(link)) return; // 중복 fetch 방지, 이미 같은 링크에 대해 요청 중이면 아무 것도 하지 않음

    GM.xmlHttpRequest({
        method: "GET",
        url: productUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const imgContainer = doc.querySelector('.product-slider');

            if (!imgContainer) {
                if (dlsitePreview.element) {
                    dlsitePreview.element.textContent = '미리보기를 불러올 수 없습니다.';
                    dlsitePreview.element.style.color = '#fff';
                }
                return;
            }

            dlsitePreview.images = [];
            dlsitePreview.currentIndex = 0;

            const imageDataElements = imgContainer.querySelectorAll('.product-slider-data > div[data-src]');
            imageDataElements.forEach(dataEl => {
                const imageUrl = dataEl.dataset.src;
                if (
                    imageUrl &&
                    !imageUrl.includes('data:image') &&
                    !imageUrl.toLowerCase().startsWith('javascript:') &&
                    !imageUrl.includes('/resize/')
                ) {
                    dlsitePreview.images.push(imageUrl);
                }
            });

            if (dlsitePreview.element && dlsitePreview.images.length > 0) {
                updateDlsitePreviewImage();

                if (dlsitePreview.globalKeydownListener) {
                    document.removeEventListener('keydown', dlsitePreview.globalKeydownListener);
                }
                dlsitePreview.globalKeydownListener = handleDlsiteKeydown;
                document.addEventListener('keydown', dlsitePreview.globalKeydownListener);

                if (dlsitePreview.activeWheelListener) {
                    dlsitePreview.element.removeEventListener('wheel', dlsitePreview.activeWheelListener);
                }
                dlsitePreview.activeWheelListener = handleDlsiteMouseWheel;
                dlsitePreview.element.addEventListener('wheel', dlsitePreview.activeWheelListener, { passive: false });


            } else if (dlsitePreview.element) {
                dlsitePreview.element.textContent = '이미지를 찾을 수 없습니다.';
                dlsitePreview.element.style.color = '#fff';
            }
            unmarkFetching(link);
        },
        onerror: function() {
            if (dlsitePreview.element) {
                dlsitePreview.element.textContent = '미리보기 로드 실패';
                dlsitePreview.element.style.color = '#fff';
            }
            unmarkFetching(link);
        }
    });

    link.addEventListener('mouseleave', hideDlsitePreview);
}


function moveDlsitePreview(event) {
    if (dlsitePreview.element) {
        dlsitePreview.element.style.top = `${event.clientY + 15}px`;
        dlsitePreview.element.style.left = `${event.clientX + 15}px`;
    }
}

function hideDlsitePreview() {
    if (dlsitePreview.element) {
        if (dlsitePreview.activeWheelListener) {
            dlsitePreview.element.removeEventListener('wheel', dlsitePreview.activeWheelListener);
            dlsitePreview.activeWheelListener = null;
        }
        document.body.removeChild(dlsitePreview.element);
        dlsitePreview.element = null;
    }
    dlsitePreview.isShowing = false;
    dlsitePreview.images = [];
    dlsitePreview.currentIndex = 0;

    document.removeEventListener('mousemove', moveDlsitePreview);

    if (dlsitePreview.globalKeydownListener) {
        document.removeEventListener('keydown', dlsitePreview.globalKeydownListener);
        dlsitePreview.globalKeydownListener = null;
    }
}

function doDlsiteContextAwareForElement(element) {
    if (!element) return;

    const dlsiteCodePattern = /(?:(RJ|R\s*J|꺼|거|DL|D\s*L)|(VJ|V\s*J|퍼))\s*((?:[\s:()\[\]#.-]*[0-9]){5,8})/gi;
    const textContent = element.textContent || '';
    let tempHTML = element.innerHTML;
    const processedOriginalTexts = new Set();

    let match;
    while ((match = dlsiteCodePattern.exec(textContent)) !== null) {
        const originalText = match[0];
        if (processedOriginalTexts.has(originalText)) {
            continue;
        }

        const rjPrefix = match[1];
        const numbersWithJunk = match[3];

        const prefix = rjPrefix ? 'RJ' : 'VJ';
        const code = numbersWithJunk.replace(/[^0-9]/g, '');

        if (code.length < 5 || code.length > 10) {
            continue;
        }

        const fullCode = `${prefix}${code}`;
        const linkUrl = `https://www.dlsite.com/maniax/work/=/product_id/${fullCode}.html`;

        addCode(fullCode); // RJ&VJ번호 수집

        const textSpan = document.createElement('span');
        textSpan.textContent = originalText;
        const safeLinkText = textSpan.innerHTML;

        const escapedOriginalText = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const replaceRegex = new RegExp(escapedOriginalText, 'g');
        const safeHref = linkUrl.replace(/"/g, '&quot;');

        let replaced = false;
        tempHTML = tempHTML.replace(replaceRegex, (match) => {
            if (replaced) return match;

            const contextBefore = tempHTML.substring(tempHTML.lastIndexOf('<', tempHTML.indexOf(match)), tempHTML.indexOf(match));
            const contextAfter = tempHTML.substring(tempHTML.indexOf(match) + match.length, tempHTML.indexOf('>', tempHTML.indexOf(match) + match.length) + 1);

            if (contextBefore.includes('href=') || contextAfter.includes('</a')) {
                return match;
            }

            replaced = true;
            processedOriginalTexts.add(originalText);
            return `<a href="${safeHref}" target="_blank" rel="noreferrer" style="color:#1e90ff;">${safeLinkText}</a>`;
        });
    }

    if (element.innerHTML !== tempHTML) {
        element.innerHTML = tempHTML;
    }

    const dlsiteLinks = element.querySelectorAll('a[href*="dlsite.com"]');
    dlsiteLinks.forEach(link => {
        const match = link.href.match(/\b(RJ|VJ)(\d{5,10})\b/i);
        if (match) {
          addCode(match[0]); // RJ&VJ번호 수집
        }

        if (!link.dataset._dlsite_preview_hooked) {
            if (dlsitePreview.isEnabled) {
                link.addEventListener('mouseenter', showDlsitePreview);
                link.addEventListener('mouseleave', hideDlsitePreview, { once: true });
            }
            link.dataset._dlsite_preview_hooked = '1';
        }
    });
}


async function chkPW(){
    chkp[3]=await GM.getValue('chkp[3]');
    isT[0]=await GM.getValue('isT[0]', true);
    isT[1]=await GM.getValue('isT[1]', false);
    dlsitePreview.isEnabled = await GM.getValue('dlsitePreviewEnabled', true);
    updateDown();
    updateTab();
    updateDlsitePreviewMenu();

    if(host=='arca.live' || host=='kone.gg'){
        if(chkp[3] !=chkp[4]){
            const chk=prompt('국룰을 입력해주세요');
            if(chk?.toLowerCase()==chkp[4]) {
                await GM.setValue('chkp[3]', chkp[4]);
            } else {
                GM.setValue('chkp[3]', false);
                alert('국룰이 틀렸습니다');
            }
        }
    }
}

async function inputPW() {
    let inputElem = document.querySelector(chkp[0]), btnElem = document.querySelector(chkp[1]);
    if (!inputElem ) {
        if (isT[0] === true && !document.querySelector('.files-list, #download-section')) {
            await new Promise(res => setTimeout(res, PageLoading[1] || 1000)).then(DBtn);
        }
        return;
    }

    const combinedPw = [...new Set([...pw, ...npw])];

    if (chkp[3] == chkp[4]) {
        try {
            for (let i = 0; i < combinedPw.length; i++) {
                if (!combinedPw[i]) continue;
                if (!inputElem) break;

                inputElem.value = combinedPw[i];

                if (host == 'kio.ac') {
                    inputElem.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElem.dispatchEvent(new Event('change', { bubbles: true }));
                    if (btnElem) {
                      let retry = 0;
                      while (btnElem.disabled && retry < 200) {
                        await new Promise(res => setTimeout(res, 50));
                        retry++;
                      }
                      btnElem.click();
                    }
                } else {
                    if(btnElem) btnElem.click();
                    else {
                        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
                        inputElem.dispatchEvent(enterEvent);
                    }
                }

                await new Promise(res => setTimeout(res, 800));

                const successIndicator = document.querySelector('.files-list, #download-section, .download-link, .btn-download, .main-button-download');
                const errorIndicator = document.querySelector('.text-error, .text-red-500, .error-message, .incorrect-password, [class*="error"], [id*="error"]');

                if (successIndicator && successIndicator.offsetParent !== null) {
                    break;
                } else if (errorIndicator && errorIndicator.offsetParent !== null) {
                    if (inputElem) inputElem.value = '';
                }
            }
            if (isT[0] == true) {
                await new Promise(res => setTimeout(res, PageLoading[1] || 1000)).then(DBtn);
            }

        } catch (e) {
            if (isT[0] == true) {
                await new Promise(res => setTimeout(res, PageLoading[1] || 1000)).then(DBtn);
            }
        }
    }
}

async function kioskdone(){
    try {
        await new Promise(res=> setTimeout(res, 3000));
        for(let i=0, jj=0; jj!=1; i++){
            await new Promise(res=> setTimeout(res, 1000));
            if(document.querySelector('.flex.flex-row.text-xs.justify-between div:nth-child(2)').innerText=='done'){
                await new Promise(res=> setTimeout(res, 2000)).then(() => window.close());
                jj++;
            }
        }
    } catch(e){
        if(isT[1]==true && isT[2]==true) window.close();
    }
}

async function DBtn(){
    if (isT[0] !== true) return;

    if (host === 'kiosk.ac') {
        try {
            const btns = document.querySelectorAll(chkp[2]);
            const clickedSet = new Set();

            for (const btn of btns) {
                if (!btn || btn.offsetParent === null) continue;
                const key = btn.closest('tr')?.innerText?.trim();
                if (clickedSet.has(key)) continue;

                let waitCount = 0;
                while (btn.disabled && waitCount < 10) {
                    await new Promise(res => setTimeout(res, 200));
                    waitCount++;
                }

                if (btn.disabled) continue;

                clickedSet.add(key);
                btn.click();
                await new Promise(res => setTimeout(res, 1800));
            }
        } catch (e) {}
    }

    else if (host === 'mega.nz') {
        try {
            const resumeButton = document.querySelector('.mega-button.positive.resume.js-resume-download');
            if (resumeButton) resumeButton.click();

            const standardDownloadButton = document.querySelector('.mega-button.positive.js-default-download.js-standard-download');
            if (standardDownloadButton) standardDownloadButton.click();

            const continueDownloadButton = document.querySelector('.mega-button.large.positive.download.continue-download');
            if (continueDownloadButton) continueDownloadButton.click();
        } catch (e) {}
    }

    else {
        try {
            const btns = document.querySelectorAll(chkp[2]);
            const clickedSet = new Set();

            for (const btn of btns) {
                if (!btn || btn.offsetParent === null || btn.classList.contains('btn-disabled')) continue;
                const key = btn.closest('tr')?.innerText?.trim();
                if (!clickedSet.has(key)) {
                    clickedSet.add(key);
                    btn.click();
                    await new Promise(res => setTimeout(res, 300));
                }
            }
        } catch (e) {}
    }

    if (isT[1] === true && isT[2] === true) {
        setTimeout(() => {
            if (host === 'kiosk.ac') {
                kioskdone();
            } else {
                window.close();
            }
        }, 1500);
    }
}

async function FindPW(){
    let atc;
    if (host === 'arca.live') {
        atc = document.querySelector('body div.article-body > div.fr-view.article-content');
    } else if (host === 'kone.gg') {
        atc = getKoneGGContentElement();
    }

    if (!atc || !atc.innerHTML) return;

    let tempContent = atc.innerHTML;
    tempContent=tempContent.replace(/ /g, ' ').replace(/( ){2,}/g, ' ');
    tempContent=tempContent.replace(/국룰/g, 'ㄱㄹ');

    let regexx=/(대문자)/;

    if(regexx.test(tempContent)) {
        const smpeopleUpper = atob('U01QRU9QTEU=');
        if (npw.indexOf(smpeopleUpper) === -1) {
            npw.push(smpeopleUpper);
        }
    }

    function processPasswordRegex(reg){
        let currentLoopContent = tempContent;
        const processedTexts = new Set();

        while(true){
            const matchResult = reg.exec(currentLoopContent);
            if (!matchResult) break;

            let matchedText = matchResult[0];
            if (processedTexts.has(matchedText)) {
                currentLoopContent = currentLoopContent.replace(matchedText, `__SKIPPED_${Math.random().toString(36).substring(2, 10)}__`);
                continue;
            }

            let DECed = matchedText.replace(/(ㄱㄹ)/g, '국룰');
            let DECedd = DECed.replace(/\s|[+]|(은|는|이|가)|(전부)|(대문자로)|(대문자)|(비밀번호)|(패스워드)|(비번)|(ㅂㅂ)|(암호)|(ㅇㅎ)|(키오스크맘)|(키오스크)|(입니다)|(이고)|(이며)|(임다)|(같다)|(처럼)|(틀리다)|(입니다요)/g, '');
            DECedd = DECedd.split(/[(입)(임)(이)(이)(이)(입)(임)(같)(처)(틀)]/g)[0];
            DECedd = DECedd.replace(/[<>]/g, '');

            let dat;
            if (host === 'arca.live') {
                const dateEl = document.querySelector('.article-info .date .body');
                if (dateEl && typeof dateEl.innerText === 'string' && dateEl.innerText.trim() !== '') {
                    dat = dateEl.innerText.split(' ')[0];
                } else {
                    dat = undefined;
                }
            }

            let regexa=/(오늘)|(날짜)|(날자)/g;
            if(dat && regexa.test(DECedd)){
                DECedd=DECedd.replace(regexa, '');
                const dateParts = dat.split(/\-/g);
                if (dateParts.length === 3) {
                    const year = dateParts[0].slice(2);
                    const month = dateParts[1];
                    const day = dateParts[2];
                    let dateFormats=[month + day, month + '-' + day, year + month + day, dat.replace(/-/g,'')];
                    for(let k=0;k<dateFormats.length;k++){
                        const finalPw = DECedd.replace(/국룰/g,chkp[4]) + dateFormats[k];
                        if(finalPw.length > 2 && npw.indexOf(finalPw)=='-1') {
                            npw.push(finalPw);
                        }
                    }
                }
            } else {
                const finalPw = DECedd.replace(/국룰/g,chkp[4]);
                if(finalPw && finalPw.length > 2 && npw.indexOf(finalPw)=='-1') {
                    npw.push(finalPw);
                }
            }
            processedTexts.add(matchedText);
            currentLoopContent = currentLoopContent.replace(matchedText, `__PROCESSED_${Math.random().toString(36).substring(2, 15)}__`);
        }
    }
    processPasswordRegex(/[(<p>\s*)*]{0,}[ㄱ-ㅣ가-힣0-9A-Za-z\s~`!^\_+@\#$%&=]{0,}(ㄱㄹ){1,1}[ㄱ-ㅣ가-힣0-9A-Za-z\s~`!^\_+@\#$%&=]{0,}[(\s*</p>)*]{0,}/);
    await GM.setValue('npw', npw);
}

function waitForKoneContentAndProcess() {
    let attempts = 0;
    const maxAttempts = 20;
    const checkInterval = setInterval(async () => {
        attempts++;
        await handleBlockingModals(host);

        const atc = getKoneGGContentElement();
        const titleEl = [...document.querySelectorAll('h1.flex, h1.text-xl')].find(el =>
            el.textContent?.match(/RJ[0-9]{6,10}|VJ[0-9]{6,8}/i)
        );

        const hasBase64 = atc && /aHR0c|YUhSMG|WVVoU|V1ZWb/.test(atc.textContent || '');

        if (atc && (titleEl || hasBase64) && (atc.textContent || '').length > 10) {
            clearInterval(checkInterval);
            scheduleHeavyWork(0);
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
        }
    }, SOMI_POLLING_MS);
}

async function loadNpw() {
    const saved = await GM.getValue('npw');
    if (Array.isArray(saved)) {
        npw = [...new Set([...npw, ...saved])];
    }
}

async function initHostSpecificSettings() {
    await loadNpw();

    const hostConfigs = {
        'kio.ac': {
            chkpSelectors: [
                 '.overflow-auto.max-w-full.grow.p-1 input:nth-of-type(1)',
                 '.flex.flex-col-reverse button:nth-of-type(1)',
                 'td.align-middle > div.contents.action-button > button[type="button"].flex.align-middle.items-center.justify-center'
            ],
            isT2: true,
            pageLoadDelay: 1500,
            inputPwDelay: 2000
        },
        'kiosk.ac': {
            chkpSelectors: [
                '.input.shadow-xl.grow',
                '.btn.btn-ghost.w-full.mt-2.rounded-md',
                '.dropdown.group > button'
            ],
            isT2: Down_Option === 0,
            pageLoadDelay: 500,
            inputPwDelay: 500
        },
        'mega.nz': {
            chkpSelectors: [
                '#password-decrypt-input',
                '.mega-button.positive.fm-dialog-new-folder-button.decrypt-link-button',
                '.mega-button.positive.js-default-download.js-standard-download'
            ],
            isT2: false,
            pageLoadDelay: 2500,
            inputPwDelay: 1800
        },
        'workupload.com': {
            chkpSelectors: [
                '#passwordprotected_file_password',
                '#passwordprotected_file_submit',
                'a.btn.btn-prio[href*="/file/"]'
            ],
            isT2: Down_Option === 0,
            pageLoadDelay: 1500,
            inputPwDelay: 0
        },
        'drive.google.com': {
            chkpSelectors: [],
            isT2: true,
            pageLoadDelay: 500,
            inputPwDelay: 0
        },
        'drive.usercontent.google.com': {
            chkpSelectors: [
                null,
                null,
                'form[method="POST"] button[type="submit"], input[type="submit"][value="다운로드"], button.jfk-button-action'
            ],
            isT2: true,
            pageLoadDelay: 500,
            inputPwDelay: 0
        },
        'gofile.io': {
            chkpSelectors: [
                '#filesErrorPasswordInput',
                '#filesErrorPasswordButton',
                'button.btn-download, a.btn-download, #rowFolderCenter button[data-bs-target="#filesList"] + div .btn-outline-secondary'
            ],
            isT2: true,
            pageLoadDelay: 1500,
            inputPwDelay: 0
        }
    };

    const config = hostConfigs[host];
    if (config) {
        chkp[0] = config.chkpSelectors[0];
        chkp[1] = config.chkpSelectors[1];
        chkp[2] = config.chkpSelectors[2];
        isT[2] = config.isT2;
        PageLoading[1] = config.pageLoadDelay;

        if (host === 'drive.google.com') {
            if (document.URL.includes('/file/d/')) {
                const fileId = document.URL.split('/d/')[1].split('/')[0];
                if (fileId) {
                    window.location.href = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
                }
            } else if (document.URL.includes('/drive/folders/')) {
                await new Promise(res => setTimeout(res, (PageLoading[0] || 1000) + 1500));
                if (isT[0] === true) {
                    const downloadAllButton = document.querySelector('div[aria-label="모두 다운로드"], div[data-tooltip="모두 다운로드"]');
                    if (downloadAllButton) {
                        downloadAllButton.click();
                    } else {
                        const firstItemDownloadButton = document.querySelector('div[role="gridcell"][data-is-shared="false"] div[aria-label*="다운로드"]');
                        if (firstItemDownloadButton) {
                            firstItemDownloadButton.click();
                        }
                    }
                }
                await new Promise(res => setTimeout(res, (PageLoading[0] || 1000) + 3500)).then(() => {
                    if (isT[0] === true) DBtn();
                });
            }
        } else if (host === 'drive.usercontent.google.com') {
            await new Promise(res => setTimeout(res, 100)).then(() => {
                if (isT[0] === true) DBtn();
            });
        } else {
            await new Promise(res => setTimeout(res, (PageLoading[0] || 1000) + config.inputPwDelay)).then(inputPW);
        }
    }
}

async function shouldRunHeavyWork() {
    const atc = getKoneGGContentElement();
    if (!atc) return false;

    const hasText = (atc.textContent || '').length > 20;
    const hasEncoded = /aHR0c|YUhSMG|WVVoU|V1ZWb/.test(atc.textContent || '');
    const hasDlsiteLink = atc.querySelector('a[href*="dlsite.com"]');

    // 댓글에도 인코딩 패턴이 있는지 검사
    const comments = document.querySelectorAll('p.text-sm.whitespace-pre-wrap');
    const hasEncodedComments = [...comments].some(c =>
        /aHR0c|YUhSMG|WVVoU|V1ZWb/.test(c.textContent || '')
    );

    return (hasText && (hasEncoded || hasDlsiteLink)) || hasEncodedComments;
}

(async () => {
    await chkPW();
    await handleBlockingModals(host);

    if (host === 'arca.live') {
        scheduleHeavyWork(0);
    } else if (host === 'kone.gg') {
        waitForKoneContentAndProcess();
    }

    await initHostSpecificSettings();
})();

(function () {
    if (location.host !== 'kone.gg') return;

    // 댓글 클릭 감지
    function hookDecodeTriggerOnButton() {
        const buttonsToHook = [
            document.querySelector('div.flex.items-center.justify-between.p-4 button[data-slot="button"]'),
            [...document.querySelectorAll('button.flex.cursor-pointer.items-center')]
                .find(button => button.textContent?.trim() === '댓글 더 불러오기'),
        ].filter(b => b instanceof Element && b.dataset._somi_hooked !== '1');

        buttonsToHook.forEach(button => {
            button.dataset._somi_hooked = '1';
            button.addEventListener('click', async () => {
                await handleBlockingModals(host);
                scheduleHeavyWork(500);
            });
        });
    }

    hookDecodeTriggerOnButton();

/*  코네는 SPA를 쓰고, SPA 특징이 DOA 변동이 심합니다
    렌더링 중에 바꿔도 다시 원래대로 덮어씌웁니다
    그러나 MutationObserver를 그대로 써선 안되고
    SPA 프레임 워크에 있는 React, id="root"를 찾아 써야합니다
    root가 바뀌는 시점이 마지막 DOA, 최종 렌더링입니다          */
    const rootEl = document.getElementById('root'); // #root만 감시
    if (rootEl) {
      const observer = new MutationObserver(async (mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              // #root 내부 노드 추가 감지
              hookDecodeTriggerOnButton();
              await handleBlockingModals(host);
              scheduleHeavyWork(100);
          }
        }
        await handleBlockingModals(host);
      });
      observer.observe(rootEl, { childList: true, subtree: true });
    }
})();

(function () {
    if (location.host !== 'kone.gg') return;

    let lastUrl = location.href; // 현재 주소
    let mainProcessingIntervalId = null;

    // URL 변경 처리 함수
    async function handleUrlChange() {
        const currentUrl = location.href; // 다음 주소
        // console.log(currentUrl, lastUrl)
        if (currentUrl === lastUrl) return;
        lastUrl = currentUrl;

        allCode = []; // 초기화

        if (mainProcessingIntervalId) {
            clearInterval(mainProcessingIntervalId);
            mainProcessingIntervalId = null;
        }

        await handleBlockingModals(host);
        observeAndRunKoneFunctions();
    }

    // history API 후킹 (SPA 내부 라우팅 감지)
    const _pushState = history.pushState;
    history.pushState = function(state, title, url) {
      _pushState.apply(this, arguments);
      handleUrlChange(); // popState 후 실행
    };

    const _replaceState = history.replaceState;
    history.replaceState = function(state, title, url) {
      _replaceState.apply(this, arguments);
      handleUrlChange(); // replaceState 후 실행
    };

    // popstate / hashchange 이벤트로 URL 감지
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // 링크 클릭 이벤트로 URL 감지 (보조)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
            setTimeout(handleUrlChange, 50); // SPA 라우팅 지연 대응
        }
    });

    async function observeAndRunKoneFunctions() {
        const start = Date.now();
        const timeout = 8000;

        if (mainProcessingIntervalId) {
            clearInterval(mainProcessingIntervalId);
        }

        mainProcessingIntervalId = setInterval(async () => {
            await handleBlockingModals(host);

            if (await shouldRunHeavyWork()) {
                clearInterval(mainProcessingIntervalId);
                mainProcessingIntervalId = null;
                scheduleHeavyWork(0);
            }

            if (Date.now() - start > timeout) {
                clearInterval(mainProcessingIntervalId);
                mainProcessingIntervalId = null;
            }
        }, SOMI_POLLING_MS);
    }

    (async () => {
        await handleBlockingModals(host);
        observeAndRunKoneFunctions();
    })();
})();