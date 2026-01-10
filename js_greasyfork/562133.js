// ==UserScript==
// @name			Mortal 인터페이스 및 기능 개선 개인용
// @name:ko			Mortal 인터페이스 및 기능 개선 
// @description		Improve the appearance of mortal killerducky GUI
// @description:ko	UI 개선, 배경·패 뒷면 커스텀, 악수율·패효율 계산 추가
// @version			2.7
// @namespace		Mortal Appearance
// @author			CiterR
// @icon			https://mjai.ekyu.moe/favicon-32x32.png
// @match			*://mjai.ekyu.moe/killerducky/*
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			unsafeWindow
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/562133/Mortal%20%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4%20%EB%B0%8F%20%EA%B8%B0%EB%8A%A5%20%EA%B0%9C%EC%84%A0%20%EA%B0%9C%EC%9D%B8%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/562133/Mortal%20%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4%20%EB%B0%8F%20%EA%B8%B0%EB%8A%A5%20%EA%B0%9C%EC%84%A0%20%EA%B0%9C%EC%9D%B8%EC%9A%A9.meta.js
// ==/UserScript==

//--------------------------------------------  CSS Part should start here  --------------------------------------------//
function mortalAddStyle() {
    const css = `
    /* ===== 기능 의존 최소 CSS ===== */

    /* discard / killer bar SVG rect 둥글기 (JS 색칠 로직 의존) */
    .killer-call-bars > svg > rect,
    .discard-bars > svg > rect {
        rx: 2px;
    }

    /* 툴팁이 뒤로 안 가게 */
    .hoverInfo {
        z-index: 9999;
        pointer-events: none;
    }

    /* 옵션 테이블 colorize 로직 안정화 */
    .opt-info table tr:last-child td:first-child {
        border-bottom-left-radius: 15px;
    }
    .opt-info table tr:last-child td:last-child {
        border-bottom-right-radius: 15px;
    }
    `;
    GM_addStyle(css);
}

//--------------------------------------------  CSS Part should end here  --------------------------------------------//


//--------------------------------------------  Extra Functions should start here  --------------------------------------------//

// 전역 상수
const standardTileHeight = 20;	//패 이미지 높이 기본값
const standardTileWidth = standardTileHeight / 4 * 3;
let timer = null;	//디바운스 타이머

function listenerAdder(strips) { //진행 바 상대 높이 계산 및 툴팁 연결
    let maxStripHeight = 1;
    strips.forEach(e=>{
        if(e.getAttribute('width') !== '20') {
            maxStripHeight = Math.max(e.getAttribute('height'), maxStripHeight);
        }
    });

    strips.forEach(e=>{
        if (e.getAttribute('width') !== '10')	return;

        const showHoverWin = ()=>{ //진행 바에 마우스 오버 시 툴팁 생성
            let p0Element = document.querySelector(".opt-info > table:last-child tr:nth-of-type(2) > td:last-child");
            if (!p0Element) return;
            let p0 = parseFloat(p0Element.innerText) / 100;
            let normProb = e.getAttribute('height') / maxStripHeight;
            let realProb = p0 * (normProb ** 2);
            let pos = e.getBoundingClientRect();

            let tooltip = document.createElement('div');
            tooltip.className = 'hoverInfo';
            tooltip.style.position = 'absolute';
        //	tooltip.style.backgroundColor = '#7dbcc980';
            //tooltip.style.border = '1px solid white';
            tooltip.style.padding = '5px';
            tooltip.style.borderRadius = '5px';
            tooltip.textContent = (realProb * 100).toFixed(2) + '%';
            tooltip.style.top = `${pos.y - 40}px`;
            tooltip.style.left = `${pos.x - 25}px`;
            e.style.opacity = '0.6';
            document.body.appendChild(tooltip);

            const deleteTooltip = ()=>{
                e.style.opacity = '1';
                tooltip.remove();
                e.removeEventListener('mouseout', deleteTooltip);
            }
            e.addEventListener('mouseout', deleteTooltip);
        }

        e.addEventListener('mouseover', showHoverWin);
    });
};


function mortalOptionColorize(errTolerance = [ 1, 5, 10, -1 ]) { //마지막 파라미터 -1은 절대값 모드, >0은 비율 모드
    let actionTable = document.querySelector(".opt-info > table:last-child");
    if (!actionTable) return;
    let actionTrList = actionTable.querySelectorAll("tr");

    let actionCardList = new Array();	//첫 항목은 빈값
    let possibilityList = new Array();

    let lastTr = actionTrList[actionTrList.length - 1];
    try{ lastTr.querySelector("td:first-child").style.borderBottomLeftRadius = "15px"; }catch(e){}
    try{ lastTr.querySelector("td:last-child").style.borderBottomRightRadius = "15px"; }catch(e){}
    //테이블 마지막 행 둥근 모서리 적용

    actionTrList.forEach(e=>{
        let cardAct = e.querySelector("td:first-child > span");
        let action, card;
        if (cardAct != null) {
            action = cardAct.textContent.substring(0, 1); //동작(예: 出, 打 등)
        }

        let cardImg = e.querySelector("td:first-child > span > img");
        if (cardImg != null) {
            let cardURL = cardImg.getAttribute('src');
            card = cardURL.substring(
                cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));
        }

        actionCardList.push(action + card);

        let possibilityTr = e.querySelector("td:last-child");
        if (possibilityTr && possibilityTr.textContent != 'P') {
            possibilityList.push(possibilityTr.textContent);
        }
    });

    //플레이어 선택과 Mortal의 1순위 선택 획득
    let actionCard = new Array();
    let mainActionSpan = document.querySelectorAll(".opt-info > table:first-child span");
    mainActionSpan.forEach(e=>{
        let action = e.textContent.substring(0, 1);
        let card;
        let cardImg = e.querySelector('img');
        if (cardImg != null) {
            let cardURL = cardImg.getAttribute('src');
            card = cardURL.substring(cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));
        }
        actionCard.push(action + card);
    });

    let possibilityPlayer = 0;
    let playerSelect = 0;
    //플레이어가 선택한 항목 하이라이트
    for (let i = 1; i < actionCardList.length; i++) {
        if (actionCardList[i] == actionCard[0]) {
            actionTrList[i].style.background = "rgb(171, 196, 49)";
            possibilityPlayer = parseFloat(possibilityList[i - 1]);
            playerSelect = i - 1;
            break;
        }
    }

    //악수(나쁜 선택) 판정 및 색상 지정
    let fatalErr = parseFloat(errTolerance[0]);
    let normalErr = parseFloat(errTolerance[1]);
    let arguableErr = parseFloat(errTolerance[2]);
    let fatalErrEdge = parseFloat(errTolerance[3]);
    let pRatio= (possibilityList[0] && possibilityList[0] != 0) ? (parseFloat(possibilityPlayer) / parseFloat(possibilityList[0])) : 0;
    let colorChoice = -1; //0=빨강,1=오렌지,2=파랑

    if (actionCard[0] != actionCard[1]) {
        if (fatalErrEdge < 0) { //절대값 모드
            if (possibilityPlayer < fatalErr) colorChoice = 0;
            else if (possibilityPlayer < normalErr) colorChoice = 1;
            else if (possibilityPlayer < arguableErr) colorChoice = 2;
        } else if (fatalErrEdge > 0) { //비율 모드
            if (possibilityPlayer < fatalErrEdge) colorChoice = 0;
            else if (pRatio < fatalErr) colorChoice = 0;
            else if (pRatio < normalErr) colorChoice = 1;
            else if (pRatio < arguableErr) colorChoice = 2;
        }
    }


updateLogoByBadMove(colorChoice);

    let playerSelectInMain = document.querySelectorAll('.discard-bars-svg > rect[width="20"]');
     switch (colorChoice) {
        case 0 :
            actionTrList[playerSelect + 1].style.background = "red";
            playerSelectInMain.forEach(e=>{ e.style.fill = "red"; });
            break;
        case 1 :
            actionTrList[playerSelect + 1].style.background = "#ff5a00";
            playerSelectInMain.forEach(e=>{ e.style.fill = "#ff5a00"; });
            break;
        case 2 :
            actionTrList[playerSelect + 1].style.background = "blue";
            playerSelectInMain.forEach(e=>{ e.style.fill = "blue"; });
            break;
     }
}

//---------------배경---------------
function createButtonBox(){
    let settingOption = document.querySelector('.options-div');
    if (!settingOption) return;
    let buttonBox = document.createElement('div');
    buttonBox.style.display = 'flex';
    buttonBox.className = 'buttonBox-div';
    buttonBox.style.flexWrap = 'wrap';
    buttonBox.style.width = '500px';
    buttonBox.style.justifyContent = 'space-evenly';
    settingOption.appendChild(buttonBox);
}
function backgroundSetting() {
    let buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return;

    // 배경 변경 버튼
    let setBackgroundButton = document.createElement('button');
    setBackgroundButton.className = 'newSetting';
    setBackgroundButton.textContent = '배경 이미지 변경';
    setBackgroundButton.style.padding = '5px 10px';
    setBackgroundButton.style.fontSize = '14px';
    setBackgroundButton.style.cursor = 'pointer';
    buttonBox.appendChild(setBackgroundButton);

    // 배경 켜기/끄기 버튼
    let toggleBackgroundButton = document.createElement('button');
    toggleBackgroundButton.className = 'newSetting';
    toggleBackgroundButton.style.padding = '5px 10px';
    toggleBackgroundButton.style.fontSize = '14px';
    toggleBackgroundButton.style.cursor = 'pointer';
    buttonBox.appendChild(toggleBackgroundButton);

    // 슬라이더와 미리보기용 컨테이너
    let sliderContainer = document.createElement('div');
    sliderContainer.style.marginTop = '10px'; // 버튼 아래 여백
    sliderContainer.style.display = 'flex';
    sliderContainer.style.gap = '10px'; // 슬라이더 사이 간격
    buttonBox.appendChild(sliderContainer);

    // 슬라이더 값 불러오기
    let backgroundURL = GM_getValue('backgroundPicUrl', '');
    let sliderXValue = GM_getValue('backgroundH', 50);
    let sliderYValue = GM_getValue('backgroundV', 10);
    let backgroundEnabled = GM_getValue('backgroundEnabled', true);

    toggleBackgroundButton.textContent = backgroundEnabled ? '배경 끄기' : '배경 켜기';

    // 좌우 위치 슬라이더
    let sliderX = document.createElement('input');
    sliderX.type = 'range';
    sliderX.min = 0;
    sliderX.max = 100;
    sliderX.value = sliderXValue;
    sliderX.style.width = '150px';
    sliderContainer.appendChild(sliderX);

    // 위아래 위치 슬라이더
    let sliderY = document.createElement('input');
    sliderY.type = 'range';
    sliderY.min = 0;
    sliderY.max = 100;
    sliderY.value = sliderYValue;
    sliderY.style.width = '150px';
    sliderContainer.appendChild(sliderY);

    // 배경 이미지 미리보기
    let backgroundImg = document.createElement('img');
    backgroundImg.src = backgroundURL || '';
    backgroundImg.style.maxWidth = '200px';
    backgroundImg.style.maxHeight = '200px'; 
    backgroundImg.style.marginTop = '10px';
    sliderContainer.appendChild(backgroundImg);

    // 배경 적용 함수
    function applyGridBackground(url, horizontalPercent = 50, verticalPercent = 10, enabled = true) {
        const gridMain = document.querySelector('.grid-main');
        if (!gridMain) return;

        if (enabled && url) {
            gridMain.style.backgroundImage = `url(${url})`;
            gridMain.style.backgroundSize ||= `${GM_getValue('backgroundSize', 900)}px auto`;
            gridMain.style.backgroundPosition = `${horizontalPercent}% ${verticalPercent}%`;
            gridMain.style.backgroundRepeat = 'no-repeat';
        } else {
            gridMain.style.backgroundImage = '';
        }
    }

    // 배경 변경 버튼 클릭
    setBackgroundButton.addEventListener('click', () => {
        let inputURL = prompt('배경 이미지 URL을 입력하세요', backgroundURL || '');
        if (inputURL !== null) {
            backgroundURL = inputURL.trim();
            backgroundImg.src = backgroundURL;
            GM_setValue('backgroundPicUrl', backgroundURL);
            GM_setValue('backgroundH', sliderX.value);
            GM_setValue('backgroundV', sliderY.value);
            applyGridBackground(backgroundURL, sliderX.value, sliderY.value, backgroundEnabled);
        }
    });

    // 배경 켜기/끄기 버튼 클릭
    toggleBackgroundButton.addEventListener('click', () => {
        backgroundEnabled = !backgroundEnabled;
        GM_setValue('backgroundEnabled', backgroundEnabled);
        toggleBackgroundButton.textContent = backgroundEnabled ? '배경 끄기' : '배경 켜기';
        applyGridBackground(backgroundURL, sliderX.value, sliderY.value, backgroundEnabled);
    });

    // 슬라이더 변경 시 적용
    sliderX.addEventListener('input', () => {
        GM_setValue('backgroundH', sliderX.value);
        applyGridBackground(backgroundURL, sliderX.value, sliderY.value, backgroundEnabled);
    });
    sliderY.addEventListener('input', () => {
        GM_setValue('backgroundV', sliderY.value);
        applyGridBackground(backgroundURL, sliderX.value, sliderY.value, backgroundEnabled);
    });

    // 초기 적용
    applyGridBackground(backgroundURL, sliderX.value, sliderY.value, backgroundEnabled);
}
//---------------배경 세팅 끝---------------
function tileBackSetting(){
    let buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return;
    let setTileBackButton = document.createElement('button');
    let tileBackURL = GM_getValue('tileBackPicURL', '');
    setTileBackButton.className = 'newSetting';
    buttonBox.appendChild(setTileBackButton);
    setTileBackButton.textContent = '패 뒷면 설정';
    setTileBackButton.addEventListener('click', ()=>{
        let inputURL = prompt('패 뒷면 이미지 URL을 입력하세요', tileBackURL || '');
        if (inputURL !== null) {
            tileBackURL = inputURL.trim();
            GM_setValue('tileBackPicURL', tileBackURL); //패 뒷면 URL 저장
        }
        let tilebackStyle = `img[src="media/Regular_shortnames/back.svg"]{\n      			content: url('${tileBackURL}');\n\t\t\t}`
        GM_addStyle(tilebackStyle);
    });
    if (!tileBackURL) return;
    let tilebackStyle = `img[src="media/Regular_shortnames/back.svg"]{\n      			content: url('${tileBackURL}');\n\t\t\t}`
    GM_addStyle(tilebackStyle);
}
// 악수 등급별 로고 (설정용, 초기값은 빈 문자열)
const DEFAULT_BAD_MOVE_LOGO = {
    0: '', // 빨강
    1: '', // 주황
    2: ''  // 파랑
};

// 최초 1회만 초기화
if (!GM_getValue('badMoveLogoMap')) {
    GM_setValue('badMoveLogoMap', DEFAULT_BAD_MOVE_LOGO);
}

function applyBaseLogo() {
    const logoImg = document.querySelector('.killer-call-img');
    if (!logoImg) return;

    // 진짜 원본 로고 1회 백업
    if (!logoImg.dataset.originalSrc) {
        logoImg.dataset.originalSrc = logoImg.src;
    }

    const manualLogo = GM_getValue('logoURL', '');

    if (manualLogo) {
        logoImg.src = manualLogo;
    } else {
        // 수동 로고 없으면 게임 원본
        logoImg.src = logoImg.dataset.originalSrc;
    }
}
function updateLogoByBadMove(colorChoice) {
    const logoImg = document.querySelector('.killer-call-img');
    if (!logoImg) return;

    const logoMap = GM_getValue('badMoveLogoMap', {});
    const badLogo = logoMap[colorChoice];

    if (badLogo) {
        // ✅ 악수 발생 → 악수 로고
        logoImg.src = badLogo;
    } else {
        // ✅ 악수 아님 → 항상 기본 로고
        applyBaseLogo();
    }
}

function logoSetting() {
    const buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return;

    const logoImg = document.querySelector('.killer-call-img');
    if (!logoImg) return;


    /* ===== 버튼 ===== */
    const baseBtn = document.createElement('button');
    baseBtn.className = 'newSetting';
    baseBtn.textContent = '기본 로고 변경';
    buttonBox.appendChild(baseBtn);

    const badBtn = document.createElement('button');
    badBtn.className = 'newSetting';
    badBtn.textContent = '악수 로고 설정';
    buttonBox.appendChild(badBtn);

    /* ===== 최초 기본 로고 적용 ===== */
    applyBaseLogo();

    /* ===== 기본 로고 설정 ===== */
    baseBtn.addEventListener('click', () => {
        const input = prompt(
            '기본으로 사용할 로고 이미지 URL\n(비우면 게임 기본 로고)',
            GM_getValue('logoURL', '')
        );
        if (input === null) return;

        GM_setValue('logoURL', input.trim());
        applyBaseLogo();
    });

    /* ===== 악수 로고 설정 ===== */
    buttonBox.style.position = 'relative';


badBtn.addEventListener('click', () => {
    // 이미 열려있으면 중복 방지
    if (document.querySelector('.badmove-logo-modal')) return;

    const logoMap = GM_getValue('badMoveLogoMap', {});

    // 모달 배경
    const overlay = document.createElement('div');
    overlay.className = 'badmove-logo-modal';
   overlay.style.cssText = `
   position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0,0,0,0.6) !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 2147483647 !important; /* 최상위 */
`;

    // 모달 본체
    const panel = document.createElement('div');
   panel.style.cssText = `
    background: #111;
    padding: 12px;
    border-radius: 8px;
    width: 400px;
    color: #fff;
    z-index: 2147483648 !important; /* overlay보다 위 */
    box-shadow: 0 0 10px #000;
`;

    panel.innerHTML = `
        <h3 style="margin-top:0;">악수 로고 설정 URL </h3>
        <label>🔴 빨강</label>
        <input id="bm0" style="width:100%; margin-bottom:8px;" value="${logoMap[0] || ''}">
        <label>🟠 주황</label>
        <input id="bm1" style="width:100%; margin-bottom:8px;" value="${logoMap[1] || ''}">
        <label>🔵 파랑</label>
        <input id="bm2" style="width:100%; margin-bottom:12px;" value="${logoMap[2] || ''}">
        <div style="text-align:right;">
            <button id="ok">확인</button>
            <button id="cancel">취소</button>
        </div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    panel.querySelector('#ok').onclick = () => {
        GM_setValue('badMoveLogoMap', {
            0: panel.querySelector('#bm0').value.trim(),
            1: panel.querySelector('#bm1').value.trim(),
            2: panel.querySelector('#bm2').value.trim()
        });
        close();
        alert('악수 로고 설정 완료');
    };

    panel.querySelector('#cancel').onclick = close;
});


}



//---------로고 세팅 끝-----------
document.addEventListener('click', (e) => {
    if (e.target.closest('.efficency-call-div')) {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}, true);

function optInfoSwitch(){
    let buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return;
    let mortalOptionSwitch = document.createElement('button');
    let mortalOpt = document.querySelector('.opt-info');
    let outer = document.querySelector('.outer');
    let state = GM_getValue('mortalOptionState', true);
    mortalOptionSwitch.className = 'newSetting';
    buttonBox.appendChild(mortalOptionSwitch);
    if (!state) {
        mortalOptionSwitch.textContent = 'Mortal 옵션 패널 열기';
        if (mortalOpt) mortalOpt.style.display = 'none';
        if (outer) outer.style.marginLeft = '0px';
    } else {
        mortalOptionSwitch.textContent = 'Mortal 옵션 패널 닫기';
        if (mortalOpt) mortalOpt.style.display = 'initial';
        if (outer) outer.style.marginLeft = '-100px';
    }
    mortalOptionSwitch.addEventListener('click', ()=>{
            state = !state;
            if (!state) {
                mortalOptionSwitch.textContent = 'Mortal 옵션 패널 열기';
                if (mortalOpt) mortalOpt.style.display = 'none';
                if (outer) outer.style.marginLeft = '0px';
            } else {
                mortalOptionSwitch.textContent = 'Mortal 옵션 패널 닫기';
                if (mortalOpt) mortalOpt.style.display = 'initial';
                if (outer) outer.style.marginLeft = '-100px';
            }
        GM_setValue('mortalOptionState', state); //상태 저장
    });
}

function fullScreenEnlarge(){
    let scaleArray = GM_getValue('scaleStr', '1.2, 1.35');
    let scale = scaleArray.split(',');
    let defaultScale = parseFloat(scale[0]);
    let fullScreenScale = parseFloat(scale[1]);

    //addEventListener('keydown', (e)=>{ //F11 전체화면 토글
    //		event.preventDefault();
    //		document.documentElement.requestFullscreen();
    //	}
//});
    //addEventListener('fullscreenchange',()=>{
    //	let mainInFull = document.querySelector('main');
    //	if (!document.fullscreen) {
    //		if (mainInFull) { mainInFull.style.scale = `${defaultScale}`; mainInFull.style.top = '50px'; }
    //	} else {
    //		if (mainInFull) { mainInFull.style.scale = `${fullScreenScale}`; mainInFull.style.top = '110px'; }
    //	}
//	});
    const logoImg = document.querySelector('.killer-call-img');
    if (logoImg) {
        logoImg.addEventListener('click', ()=>{
            if (!document.fullscreen){
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
}

function createStripsHoverWindow() {
    let bars = document.querySelector('#discard-bars');
    if (!bars) return;
    let observer = new MutationObserver((mutationList, observer)=>{
        let strips = bars.querySelectorAll('.discard-bars-svg>rect');
        listenerAdder(strips);
    })
    observer.observe(bars, {childList: true, subtree: true});

    let callBars = document.querySelector('.killer-call-bars');
    if (!callBars) return;
    let observerAdviser = new MutationObserver((mutationList, observerAdviser)=>{
        mutationList.forEach(e=>{
            if (e.type === 'childList') {
                let stripsAdviser = document.querySelectorAll('.killer-call-bars>svg>rect');
                listenerAdder(stripsAdviser);
                let remainWindow = document.querySelectorAll(".hoverInfo");
                remainWindow.forEach(w=>{ w.remove() }); //업데이트 시 툴팁 정리
            }
        });
    });
    observerAdviser.observe(callBars, {childList: true});
}

function startMortalOptionObserver(errTolerance) {
    let optState = GM_getValue('mortalOptionState', true);
    let optInfo = document.querySelector('.opt-info');
    if (!optInfo) return;
    let observerInfo = new MutationObserver((mutationList, observerInfo)=>{
        mortalOptionColorize(errTolerance);
    });
    observerInfo.observe(optInfo, {childList: true});
}

function setCustomErrTolerance() {
    let buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return ['5','10','20','-1'];
    let setErrToleranceButton = document.createElement('button');
    let errToleranceStr = GM_getValue('errToleranceStr', '5, 10, 20, -1');
    let errTolerance = errToleranceStr.split(',');

    setErrToleranceButton.className = 'newSetting';
    buttonBox.appendChild(setErrToleranceButton);
    setErrToleranceButton.textContent = '악수 확률 사용자 설정';
    setErrToleranceButton.addEventListener('click', ()=>{
        let explainText ='악수 확률 조합을 입력하세요. 네 개의 숫자 (새로고침 후 적용)\n' +
                            '4번째 값 = -1이면 절대값 모드(확률이 작으면 바로 악수로 판정)\n' +
                            '4번째 값 > 0이면 비율 모드(플레이어 확률 / 1위 확률로 판정)'
        let inputStr = prompt(explainText, errToleranceStr);
        if (inputStr !== null) {
            let input = inputStr.replace('，',','); //중국어 콤마 치환
            let numArray = input.split(',');
            let newErrTolerance = numArray.map(Number);
            if (newErrTolerance.length !== 4 || newErrTolerance.some(isNaN)) {
                alert('매개변수 수가 올바르지 않습니다!');
                return;
            }
            GM_setValue('errToleranceStr', inputStr); //악수 기준 저장
            errToleranceStr = inputStr;
            errTolerance = errToleranceStr.split(',');
        }
    });
    return errTolerance;
}

function addTableRow(table, str, value) {
    const tr = table.insertRow();
    let cell = tr.insertCell();
    cell.textContent = `${str}`;
    cell = tr.insertCell();
    cell.textContent = `${value}`;
}

function setMainAreaEnlarge() {
    let buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return ['1.2','1.35'];
    let scaleButton = document.createElement('button');
    let scaleStr = GM_getValue('scaleStr', '1.2, 1.35');
    let scaleArray = scaleStr.split(',');

    const mainElem = document.querySelector('main');
   // if (mainElem) mainElem.style.scale = `${scaleArray[0]}`; //초기 확대 적용

    scaleButton.className = 'newSetting';
    buttonBox.appendChild(scaleButton);
    //scaleButton.textContent = '화면 확대 배율';
    //scaleButton.addEventListener('click', ()=>{
    //	let explainText ='확대 배율 조합을 입력하세요 (쉼표로 구분, 새로고침 후 적용)\n' +
    //					'첫번째: 비전체화면 배율\n' +
    //					'두번째: 전체화면 배율'
    //	let inputStr = prompt(explainText, scaleStr);
    //	if (inputStr !== null) {
    //        let input = inputStr.replace('，',',');
    //        let numArray = input.split(',');
     //       let newScaleArray = numArray.map(Number);
    //		if (newScaleArray.length !== 2 || newScaleArray.some(isNaN)) {
    //            alert('매개변수 수가 올바르지 않습니다!');
    //        }
    //		GM_setValue('scaleStr', inputStr);
    //        scaleStr = inputStr;
   //         scaleArray = scaleStr.split(',');
   //         if (mainElem) mainElem.style.scale = `${scaleArray[0]}`;
    //	}
    //});
    return scaleArray;
}

async function errCalculate(errTolerance) {
    let fatalErrCnt = 0;
    let normalErrCnt = 0;
    let arguableErrCnt = 0;

    async function waitReview() {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (unsafeWindow.MM && unsafeWindow.MM.GS && unsafeWindow.MM.GS.fullData && unsafeWindow.MM.GS.fullData.review) {
            clearInterval(check);
            resolve(unsafeWindow.MM.GS.fullData.review);
          } }, 500);
      });
    }
    let reviewData;
    try {
        reviewData = await waitReview();
    } catch (e) {
        console.log('errCalculate: review data not available', e);
        return;
    }

    for (const kyokus of reviewData.kyokus) {
      for (const curRound of kyokus.entries) {
        const mismatch = !curRound.is_equal;
        const pPlayer = curRound.details[curRound.actual_index].prob * 100;
        const pMortal = curRound.details[0].prob * 100;
        if (mismatch && parseFloat(errTolerance[3]) < 0) {
            if (pPlayer <= parseFloat(errTolerance[0])) fatalErrCnt++;
            if (pPlayer <= parseFloat(errTolerance[1])) normalErrCnt++;
            if (pPlayer <= parseFloat(errTolerance[2])) arguableErrCnt++;
        } else if (mismatch && parseFloat(errTolerance[3]) > 0) {
            const pRate = parseFloat(pPlayer) / parseFloat(pMortal);
            if (pPlayer <= parseFloat(errTolerance[3])) {
                fatalErrCnt++;
                normalErrCnt++;
                arguableErrCnt++;
                continue;
            }
            if (pRate <= parseFloat(errTolerance[0])) fatalErrCnt++;
            if (pRate <= parseFloat(errTolerance[1])) normalErrCnt++;
            if (pRate <= parseFloat(errTolerance[2])) arguableErrCnt++;
        }
      }
    }

    const totalReviewed = reviewData.total_reviewed || 1;

    const fatalErrRate = ((fatalErrCnt / totalReviewed) * 100).toFixed(2);
    const fatalErrStr = `${fatalErrCnt}/${totalReviewed} = ${fatalErrRate}%`;
    const normalErrRate = ((normalErrCnt / totalReviewed) * 100).toFixed(2);
    const normalErrStr = `${normalErrCnt}/${totalReviewed} = ${normalErrRate}%`;
    const arguableErrRate = ((arguableErrCnt / totalReviewed) * 100).toFixed(2);
    const arguableErrStr = `${arguableErrCnt}/${totalReviewed} = ${arguableErrRate}%`;

    let metadataTable = document.querySelector(".about-metadata table:first-child");
    if (!metadataTable) return;
    let errRateZH = "악수율";
    if (parseFloat(errTolerance[3]) < 0) errRateZH = "% 악수율";
    addTableRow(metadataTable, `${errTolerance[0]}${errRateZH}`, fatalErrStr);
    addTableRow(metadataTable, `${errTolerance[1]}${errRateZH}`, normalErrStr);
    addTableRow(metadataTable, `${errTolerance[2]}${errRateZH}`, arguableErrStr);
}

function addDoraFlash(doraIndicators, state) {
    let doras = new Array();
    doraIndicators.forEach(e =>{
        let doraStr = '';
        switch(e[1]) {
            case 'z':
                if(parseInt(e[0]) < 5) {
                    doraStr = `${ parseInt(e[0]) % 4 + 1 }z`; //동남서북
                } else {
                    doraStr = `${ (parseInt(e[0]) - 4 ) % 3 + 5}z`; //백발중
                }
                break;
            default:
                if (parseInt(e[0]) === 0) {
                    doraStr = `6${e[1]}`; //赤5 특례
                } else {
                    doraStr = `${ parseInt(e[0]) % 9 + 1 }${e[1]}`;
                }
                break;
        }
        doras.push(doraStr);
    });

    if(state) doras.push('0m', '0p', '0s');

    //========== 도라 반짝임 설정============
    for (const dora of doras) {
        let doraStyle;
        if (state) {
            doraStyle = `
                    .tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"]) {
                        position: relative;
                        overflow: hidden;
                        border-radius: 5px;
                    }

                    .tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"])::after {
                        content: none; //content: ''; 도라 애니메이션 설정
                        position: absolute;
                        inset: -40%;
                        background: linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255, 255, 255, 0.7), rgba(255,255,255,0) 60%);
                        animation: none; // animation: doraFlash 2s infinite; 도라 애니메이션
                        transform: translateY(-100%);
                        z-index: 1;
                    }

                    @keyframes doraFlash {
                      to {
                        transform: translateY(100%);
                      }
                    }
                `;
        } else {
            doraStyle = `
                    .tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"]) {
                        overflow: visible;
                    }
                    .tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"])::after {
                        content: none;
                        background: transparent;
                        animation: none;
                    }
                `;
        }
        GM_addStyle(doraStyle);
    }

    if (typeof addDoraFlash.executed === "undefined" || !addDoraFlash.executed) {
        addDoraFlash.executed = false;
        let rotatedDoraFix = `
            .pov-p0 > div:has(.rotate) {
                height: var(--tile-width);
                align-self: flex-end;
            }
            .pov-p0 > div > .rotate {
                transform: rotate(90deg) translate(calc(-1 * var(--tile-height)), 0px);
            }
            /*자기鸣牌立直 조정*/

            .pov-p1 > div:has(.rotate) {
                width: var(--tile-width);
                align-self: flex-end;
            }
            /*하단 플레이어鸣牌 조정*/

            .pov-p2 > div:has(.rotate) {
                height: var(--tile-width);
            }
            .grid-discard-p2 > div:has(.rotate) {
                align-self: flex-end;
            }
            /*대향鸣牌 조정*/

            .pov-p3 > div:has(.rotate) {
                width: var(--tile-width);
            }
            .grid-discard-p3 > div:has(.rotate) {
                align-self: flex-end;
            }
            /*상향鸣牌 조정*/
            .tileDiv:has(.tileImg.rotate.float) {
                overflow:visible;
            }
            /* dora 표시 수정*/
            `;
        GM_addStyle(rotatedDoraFix);
    }
}

function startDoraObserver(doraCheck_ms = 1500) {
    let preDoraIndicator = new Array();
    const checkInterval = doraCheck_ms;
    const interval = setInterval(() => {
        let doraInfo = document.querySelectorAll('.info-doras > div > img');
        let doraIndicator = new Array();
        doraInfo.forEach(e=>{
            let cardURL = e.getAttribute('src');
            let doraStr = cardURL.substring(cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));
            if (doraStr !== 'back') doraIndicator.push(doraStr);
        });

        if (!(function(doraIndicator, preDoraIndicator) {
                if (doraIndicator.length !== preDoraIndicator.length) return false;
                for (let i = 0; i < doraIndicator.length; i++) {
                    if (doraIndicator[i] !== preDoraIndicator[i]) { return false; }};
                return true;
            })(doraIndicator, preDoraIndicator)) {
            addDoraFlash(preDoraIndicator, false);
            addDoraFlash(doraIndicator, true);
            preDoraIndicator = [];
            doraIndicator.forEach(d=>{ preDoraIndicator.push(d); });
        }
    }, checkInterval);
}

function startEfficencyCalc(calcDelay_ms = 800) {
    let effEnable = GM_getValue('effEnable', true);
    if (!effEnable) return;

    const calcDelay = (mutationsList) => {
        let effHover = document.querySelectorAll('.eff-hover');
        effHover.forEach((e)=>{ e.remove(); });
        if (mutationsList.length <= 1) return; //뽑기 이벤트 아님
        if (timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            timer = null;
            calcEfficency();
        }, calcDelay_ms);
    };

    const svgBarsDetector = new MutationObserver((mutations, observer) => {
        const target = document.querySelector('.discard-bars-svg');
        if (target) {
            const startCalc = new MutationObserver(calcDelay);
            startCalc.observe(target, { childList: true, subtree: false });
            svgBarsDetector.disconnect();
        }
    });
    svgBarsDetector.observe(document.body, { childList: true, subtree: true });
}

function calcEfficency() {
    let cardInfo = getCardInfo();
    if(!cardInfo) return; //뽑은 패 없으면 종료
    let shantenCnt = shanten(cardInfo.handset);
    if(shantenCnt === -1) return; //완성 패

    let ukeireSet = kiruEfficency(cardInfo.handset, cardInfo.seenTiles);
    addEffCardset(ukeireSet, shantenCnt);
}

function getCardInfo() {
    if (!unsafeWindow.MM || !unsafeWindow.MM.GS || !unsafeWindow.MM.GS.gs) return null;
    let handcard = unsafeWindow.MM.GS.gs.hands[unsafeWindow.MM.GS.heroPidx] || [];
    let tsumocard = unsafeWindow.MM.GS.gs.drawnTile[unsafeWindow.MM.GS.heroPidx];
    if (!tsumocard) return null; //자摸 없으면 계산 안함
    handcard = handcard.slice();
    handcard.push(tsumocard);
    let handset = new Array(5).fill().map(() => new Array(10).fill(0));
    handcard.forEach(e=>{
        let idx = Math.floor(e / 10), idy = e % 10;
        if (idx === 5) { idx = idy; idy = 5; } //홍5 처리
        handset[idx][idy]++;
    });

    let seenTiles = new Array(5).fill().map(() => new Array(10).fill(0));
    let calls = unsafeWindow.MM.GS.gs.calls || [];
    let discardPond = unsafeWindow.MM.GS.gs.discardPond || [];
    let doraIdr = unsafeWindow.MM.GS.gs.doraIndicator || [];

    let doraInfo = document.querySelectorAll('.info-doras > div > img');
    let doraCnt = 0;
    doraInfo.forEach(e=>{
        let cardURL = e.getAttribute('src');
        let doraStr = cardURL.substring(cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));
        if (doraStr !== 'back') doraCnt++;
    });

    for (let card of calls) {
        if (typeof card !== 'number') continue;
        let idx = Math.floor(card / 10), idy = card % 10;
        if (idx === 5) { idx = idy; idy = 5; }
        seenTiles[idx][idy]++;
    }
    for (let ply of discardPond) {
        if (!Array.isArray(ply)) continue;
        ply.forEach(e=>{
            let idx = Math.floor(e.tile / 10), idy = e.tile % 10;
            if (idx === 5) { idx = idy; idy = 5; }
            seenTiles[idx][idy]++;
        })
    }
    for (let i = 0; i < doraCnt; i++) {
        let idr = doraIdr[i];
        let idx = Math.floor(idr / 10), idy = idr % 10;
        if (idx === 5) { idx = idy; idy = 5; }
        seenTiles[idx][idy]++;
    }

    for (let i = 1; i <= 4; i++) handset[i][0] = seenTiles[i][0] = i;
    return { handset: handset, seenTiles: seenTiles };
}

// 이하 수학/완성도 / 샨텐 등은 원래 알고리즘 유지
function breakdown(A, depth) {
    if (depth >= 4) return 0;
    let ret = 0, i = 1;
    while (i <= 9 && !A[i]) i++;
    if (i > 9) return 0;
    if (i + 2 <= 9 && A[i] && A[i + 1] && A[i + 2] && A[0] != 4) {
        A[i]--; A[i + 1]--; A[i + 2]--;
        ret = Math.max(ret, breakdown(A, depth) + 2100);
        A[i]++; A[i + 1]++; A[i + 2]++;
    }
    else {
        if (i + 2 <= 9 && A[i] && A[i + 2] && A[0] != 4) {
            A[i]--; A[i + 2]--;
            ret = Math.max(ret, breakdown(A, depth) + 1001);
            A[i]++; A[i + 2]++;
        }
        if (i + 1 <= 9 && A[i] && A[i + 1] && A[0] != 4) {
            A[i]--; A[i + 1]--;
            ret = Math.max(ret, breakdown(A, depth) + 1001);
            A[i]++; A[i + 1]++;
        }
    }

    if (A[i] >= 3) {
        A[i] -= 3;
        ret = Math.max(ret, breakdown(A, depth) + 2100);
        A[i] += 3;
    }
    if (A[i] >= 2) {
        A[i] -= 2;
        ret = Math.max(ret, breakdown(A, depth) + 1010);
        A[i] += 2;
    }
    A[i]--;
    ret = Math.max(ret, breakdown(A, depth + 1));
    A[i]++;
    return ret;
}

function shantenStandard(S) {
    let analysis = 0, cardnum = 0;
    for (let A of S) {
        let ret = 0;
        for (let i = 1; i <= 9; i++) {
            ret += A[i];
            cardnum += A[i];
        }
        if (!ret) continue;
        analysis += breakdown(A, 0);
    }

    let block = Math.floor(analysis % 1000 / 100);
    let pair = Math.floor(analysis % 100 / 10);
    let dazi = analysis % 10;

    block += Math.floor((14 - cardnum) / 3);
    if (pair > 1) {
        dazi += pair - 1;
        pair = 1;
    }
    while (block + dazi > 4 && dazi > 0) dazi--;

    return 8 - (2 * block + dazi + pair);
}

function shantenChiitoi(S) {
    let pair = 0;
    for (let A of S) {
        for (let i = 1; i <= 9; i++) {
            if (A[i] >= 2) pair++;
        }
    }
    return 6 - pair;
}

function shanten(S) { return Math.min(shantenStandard(S), shantenChiitoi(S)); }

function ukeire(S, curShanten) {
    let vaildcard = new Array(5).fill().map(() => new Array(10).fill(0));
    for (let i = 0; i <= 4; i++) vaildcard[i][0] = i;

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 9; j++) {
            let k = j - 2, acc = 0;
            while (k < 1) k++;
            while (k <= j + 2) {
                if (k > 9) break;
                acc += S[i][k++];
            }
            if (!acc) continue;
            S[i][j]++;
            if (shanten(S) < curShanten) vaildcard[i][j]++;
            S[i][j]--;
        }
    }
    for (let j = 1; j <= 7; j++) {
        if (!S[4][j]) continue;
        S[4][j]++;
        if (shanten(S) < curShanten) vaildcard[4][j]++;
        S[4][j]--;
    }
    return vaildcard;
}

function kiruEfficency(S, seen) {
    let ret = [];
    let curShanten = shanten(S);
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 9; j++) {
            if (!S[i][j]) continue;
            let pai, num = j.toString();
            switch (i) {
                case 1: pai = num + "m"; break;
                case 2: pai = num + "p"; break;
                case 3: pai = num + "s"; break;
                case 4: pai = num + "z"; break;
            }

            S[i][j]--;
            if (shanten(S) == curShanten) {
                let vaild = ukeire(S, curShanten);
                let left = tileleft(S, vaild, seen);
                let vaildstr = convertToStr(vaild);
                ret.push({ pai: pai, left: left, ukeStr: vaildstr, uke: vaild });
            }
            S[i][j]++;
        }
    }
    ret.sort((a,b)=> b.left.leftNor - a.left.leftNor);
    return ret;
}

function tileleft(S, uke, seen) {
    let leftNor = 0, leftPure = 0;
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 9; j++) {
            if (!uke[i][j]) continue;
            leftNor += 4 - S[i][j] - seen[i][j];
            leftPure += 4 - S[i][j];
        }
    }
    return { leftNor, leftPure };
}

function convertToStr(S) {
    let str = '';
    for (let i = 1; i <= 4; i++) {
        let acc = 0;
        for (let j = 1; j <= 9; j++) {
            let tmp = S[i][j];
            acc += tmp;
            while (tmp--) str += j.toString();
        }
        if (!acc) continue;
        switch (i) {
            case 1: str += 'm'; break;
            case 2: str += 'p'; break;
            case 3: str += 's'; break;
            case 4: str += 'z'; break;
        }
    }
    return str;
}

function addEffCardset(ukeireSet, shantenCnt) {
    let effWindow = document.querySelector('.efficency-call-div');
    if (!effWindow) return;
    effWindow.innerHTML = '';

    /* 샨텐 표시 */
    let shantenText = `${shantenCnt} 샨텐`;
    if (!shantenCnt) shantenText = '텐파이';

    let showShanten = document.createElement('div');
    showShanten.textContent = shantenText;
    showShanten.style.textAlign = 'center';
    showShanten.style.width = '100%';
    showShanten.style.marginTop = '2%';
    effWindow.appendChild(showShanten);

    for (let ukeInfo of ukeireSet) {
        let pai = ukeInfo.pai;
        let tile = document.createElement('img');
        let wrapDiv = document.createElement('div');

        let leftText =
            ukeInfo.left.leftNor.toString().padStart(2, '0') + ':' +
            ukeInfo.left.leftPure.toString().padStart(2, '0');

        let showLeftText = document.createElement('span');

        tile.src = `media/Regular_shortnames/${pai}.svg`;
        tile.className = 'tileImg effTile';

        showLeftText.textContent = leftText;
        showLeftText.style.fontSize = 'xx-small';
        showLeftText.style.lineHeight = '2';
        showLeftText.style.marginLeft = '2px';

        wrapDiv.style.display = 'flex';
        wrapDiv.style.marginLeft = '3%';
        wrapDiv.style.marginTop = '1%';

        /* ===============================
           hover 패 표시 (겹침 안전 처리)
           =============================== */
        tile.addEventListener('mouseover', () => {
            let effHover = document.createElement('div');
            effHover.className = 'eff-hover';

            let hoverPai, cnt = 0;
            for (let i = 1; i <= 4; i++) {
                for (let j = 1; j <= 9; j++) {
                    if (!ukeInfo.uke[i][j]) continue;
                    switch (i) {
                        case 1: hoverPai = j + 'm'; break;
                        case 2: hoverPai = j + 'p'; break;
                        case 3: hoverPai = j + 's'; break;
                        case 4: hoverPai = j + 'z'; break;
                    }
                    cnt++;
                    let hoverTile = document.createElement('img');
                    hoverTile.src = `media/Regular_shortnames/${hoverPai}.svg`;
                    hoverTile.className = 'tileImg hoverTile';
                    effHover.appendChild(hoverTile);
                }
            }

            /* === 위치 계산 (패효율 기준, 로고 무시) === */
            const effRect = effWindow.getBoundingClientRect();
            const maxCols = Math.min(13, cnt);
            const rows = Math.ceil(cnt / maxCols);

            const hoverWidth = maxCols * (standardTileWidth + 4);
            const hoverHeight = rows * (standardTileHeight + 4);

            const posX = effRect.left + (effRect.width - hoverWidth) / 2;
            let posY = effRect.top - hoverHeight - 12;

            /* 화면 위로 나가면 아래로 */
            if (posY < 0) {
                posY = effRect.bottom + 12;
            }

            effHover.style.width = `${hoverWidth}px`;
            effHover.style.left = `${posX}px`;
            effHover.style.top = `${posY}px`;
            effHover.style.zIndex = 9999; // ★ 로고 포함 전부 위

            document.body.appendChild(effHover);

            const deleteEffHover = () => {
                effHover.remove();
                tile.removeEventListener('mouseout', deleteEffHover);
            };
            tile.addEventListener('mouseout', deleteEffHover);
        });

        wrapDiv.appendChild(tile);
        wrapDiv.appendChild(showLeftText);
        effWindow.appendChild(wrapDiv);
    }
}

function addEffWindow() {
    let buttonBox = document.querySelector('.buttonBox-div');
    if (!buttonBox) return;

    let efficencySwitch = document.createElement('button');
    let effEnable = GM_getValue('effEnable', true);

    efficencySwitch.className = 'newSetting';
    buttonBox.appendChild(efficencySwitch);

    function updateText() {
        efficencySwitch.textContent = effEnable
            ? '패효율 계산 끄기'
            : '패효율 계산 켜기';
    }

//======= 배경 크기 조절 슬라이드=======

        // 배경 크기 값 불러오기
    let backgroundSizeValue = GM_getValue('backgroundSize', 900);

    // 슬라이드 컨테이너
    let sizeContainer = document.createElement('div');
    sizeContainer.style.display = 'flex';
    sizeContainer.style.alignItems = 'center';
    sizeContainer.style.gap = '10px';
        sizeContainer.style.width = '260px';     // ⭐ 폭 고정
    sizeContainer.style.flexShrink = '0';    // ⭐ flex 영향 차단
    buttonBox.appendChild(sizeContainer);

    // 슬라이드
    let sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = 100;
    sizeSlider.max = 1500;
    sizeSlider.value = backgroundSizeValue;
    sizeSlider.style.width = '200px';
    sizeContainer.appendChild(sizeSlider);

    // 수치 표시
    let sizeLabel = document.createElement('span');
    sizeLabel.textContent = `${backgroundSizeValue}px`;
    sizeContainer.appendChild(sizeLabel);

    // 적용 함수
    function applyBackgroundSize(size) {
        const gridMain = document.querySelector('.grid-main');
        if (!gridMain) return;

        gridMain.style.backgroundSize = `${size}px auto`;
    }

    // 슬라이드 이벤트
    sizeSlider.addEventListener('input', () => {
        GM_setValue('backgroundSize', sizeSlider.value);
        sizeLabel.textContent = `${sizeSlider.value}px`;
        applyBackgroundSize(sizeSlider.value);
    });

    // 초기 적용
    applyBackgroundSize(backgroundSizeValue);


//======= 배경 크기 조절 슬라이드 끝=======
    updateText();

    efficencySwitch.addEventListener('click', () => {
        effEnable = !effEnable;
        GM_setValue('effEnable', effEnable);
        updateText();

        if (effEnable) {
            createEffDiv();
        } else {
            removeEffDiv();
        }
    });

    if (effEnable) createEffDiv();
}

function createEffDiv() {
    if (document.querySelector('.efficency-call-div')) return;

    let killerCallDiv = document.querySelector('.killer-call-div');
    if (!killerCallDiv) return;

    let effDiv = document.createElement('div');
    effDiv.className = 'efficency-call-div';

    /* 전체화면 토글 차단 */
    effDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
    });

    /* ===== 로고 + 패효율 겹침 방지 & 우선순위 CSS ===== */
    GM_addStyle(`
    .killer-call-div {
        position: relative;
        overflow: visible !important;
    }

    /* 로고 (패효율보다 아래) */
    .killer-call-img.eff-overlay-logo {
        position: absolute;
        top: 35%;  //로고 위치
        right: 60%;

        width:  110px !important; //로고 크기
        height: auto !important;

        z-index: 10;              /* 패효율보다 낮음 */
        pointer-events: none;
    }

    /* 패효율 (항상 위) */
    .efficency-call-div {
        scale: 1.4;
        width: calc(var(--zoom)*245px);
        height: calc(var(--zoom)*110px);

        border-radius: 20px;
        margin-top: 34%;
        margin-left: 14%;

        position: relative;
        z-index: 20;              /* 로고보다 위 */

        padding-top: 26px;        /* 로고 영역 확보 → 물리적 겹침 방지 */

        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }

    .eff-hover {
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        scale: 1.5;
        background: #00c0ff80;
        box-shadow: 0px 0px 5px 5px #0090ff;
        border-radius: 5px;
    }

    .effTile {
        filter: none;
        width: ${standardTileWidth}px;
        height: ${standardTileHeight}px;
        box-shadow: inset 0 0 2px #880000;
        margin-left: 3%;
    }

    .hoverTile {
        filter: none;
        width: ${standardTileWidth}px;
        height: ${standardTileHeight}px;
    }
    `);

    /* === 로고를 killer-call-div에 겹치지 않게 배치 === */
    let logoImg = document.querySelector('.killer-call-img');
    if (logoImg) {
        logoImg.classList.add('eff-overlay-logo');
        killerCallDiv.appendChild(logoImg);
    }

    killerCallDiv.appendChild(effDiv);
}
function removeEffDiv() {
    let effDiv = document.querySelector('.efficency-call-div');
if (effDiv) effDiv.remove();

let logoImg = document.querySelector('.killer-call-img');

if (logoImg) {
    // 단순히 패효율 클래스 제거, 위치/크기는 그대로 유지
    logoImg.classList.remove('eff-overlay-logo');
    // killerCallDiv.prepend(logoImg); // 제거: 위치 그대로 유지
}
}

/* ================= 실제 패효율 창 생성 ================= */

//--------------------------------------------  Extra Functions should end here  --------------------------------------------//


(function() {
    //-------------------------------------------- Main Code should start here  --------------------------------------------//
    'use strict';

    //버튼 및 기능 초기화
    createButtonBox();
    backgroundSetting();
    tileBackSetting();
    logoSetting();
    optInfoSwitch();
    setMainAreaEnlarge();
    addEffWindow();
    let errTolerance = setCustomErrTolerance();
    //위 기능들 완료

    mortalAddStyle();
    fullScreenEnlarge();
    createStripsHoverWindow();
    startMortalOptionObserver(errTolerance);
    errCalculate(errTolerance);
    startDoraObserver();
    startEfficencyCalc();

    //-------------------------------------------- Main Code should end here  --------------------------------------------//
})();

