// ==UserScript==
// @name			Mortal 인터페이스 개선 및 기능 개선
// @name:ko			Mortal 인터페이스 개선 및 기능 개선
// @description		Improve the appearance of mortal killerducky GUI
// @description:ko	UI 개선, 배경·패 뒷면 커스텀, 악수율·패효율 계산 추가
// @version			2.0.2
// @namespace		Mortal Appearance
// @author			CiterR
// @icon			https://mjai.ekyu.moe/favicon-32x32.png
// @match			*://mjai.ekyu.moe/killerducky/*
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			unsafeWindow
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/555606/Mortal%20%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4%20%EA%B0%9C%EC%84%A0%20%EB%B0%8F%20%EA%B8%B0%EB%8A%A5%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/555606/Mortal%20%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4%20%EA%B0%9C%EC%84%A0%20%EB%B0%8F%20%EA%B8%B0%EB%8A%A5%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

/*
--------------------------- BUG ---------------------------
☑1. 암칸(dark kong) dora 표시 문제 (float 요소 overflow 관련)
☑2. 패효율 계산 시 아직 열리지 않은 dora 지표가 미리 반영되는 문제
☑3. 패효율 툴팁이 mouseout 이벤트 미응답 시 잔존하는 문제

-------------------------- TODO ---------------------------
  1. 7대칠(七対) 경우 제외하기
  2. 계산 개선(성능 허용 시)
  3. 일향청(一向聴) 좋은 형의 비율 계산
☑4. 악수율 계산 시작 방식 최적화
  5. 먹·빵(치·퐁) 시 패효율 계산 추가
*/

//--------------------------------------------  CSS Part should start here  --------------------------------------------//

function mortalAddStyle() {
    let css = `
	/*스크립트 내 모든 URL은 사용자에게 노출되지 않음*/

    .grid-main {
      background-position: center;/*테이블 배경 중앙 정렬*/
      /*background-position-x: 0px;/*수평 조정*/
      /*background-position-y: 0px;/*수직 조정*/
      /*background-size: 145%; /*배경 크기 조절*/
      border-radius: 15px;
      border: 2px solid pink;
    }/*테이블 배경 추가*/

    .grid-info {
      border: 2px;
      border-color: white;
      border-style: solid;
      border-radius: 24px;
      background: #004452; //#93adae; //점수판
      z-index: 3; /*완료/화면 상단 3D 효과와 조합*/
    }/*중앙 정보판*/

    .killer-call-img {
      position: relative;
      top: 50px;
      scale: 1.2;
    }/*Mortal 표시 이미지 조정*/

	html {
	  height: 98%;
	}/*스크롤바 방지*/

    body {
      /*background: white;  background: linear-gradient(90deg, #2351ff8a, #0bfff7, #fff, #e7eaa7c9, #ff3e4f);  */
	  background: linear-gradient( #002229 );
      height: 98%;
    }/*페이지 배경 색 변경*/

	.outer {
	  margin-left: -100px;
	}/*메인 페이지 좌측 오프셋*/

	.opt-info {
	  margin-left: 90px;
	}/*옵션 정보 판 오프셋*/

	.opt-info table {
	  border-radius: 15px;
	  background: #74abb6;
	  box-shadow: 1px -1px 1px 1px #f6f6f6;
	}/*옵션 테이블 스타일*/

    .grid-hand {
      background: hsl(0deg 0% 100% / 0%);
    }/*상대 손패 영역 투명화*/

    .grid-hand-p3 {
      height: 530px;
    }/*윗 플레이어(上家)鸣牌 위치 조정*/

    .grid-hand-p0-container{
      background: hsl(0deg 0% 100% / 0%);
      scale: 1.15;
      width: 555px;   /*손패 폭 축소(겹침 방지)*/
	  position: relative;
	  left: -15px;
	  top: 50px;
    }/*자기 손패 영역 투명화 및 확대*/

    .tileImg{
      border-radius: 4px;
      /*border-top: 3px groove #bbc9d9;/*牌顶部 3D 효과(비활성)*/
    }/*마작패 스타일: 모서리 둥글게*/

    .killer-call-bars > svg > rect, .discard-bars > svg > rect {
      rx: 2px;
    }/*진행바 사각형 둥글게*/

    main{
      /*scale: 1.2;*/
      top: 50px;
      position: relative;
    }/*메인 페이지 위치*/

    .info-doras {
      scale: 1.4;
    }/*도라 표시 확대*/

    .info-round {
      background: hsl(192.97deg 17.21% 42.16%);
      border-color: transparent;
      border-radius: 15px;
    }/*라운드 전환기*/

    .info-this-round-modal{
      background: hsl(190deg 100% 20%);
      border-width: 3px;
      border-radius: 10px;
      border-style:solid;
      border-color:unset;
    }/*대국 리포터*/

    .close {
      background: red;
      scale: 1.2;
      border: 0px;
      border-radius: 50%;
      right: 5px;
      width: 20px;
      height: 20px;
    }/*리포터 닫기 버튼*/

    .killer-call-bars{
      scale: 1.5;
      position: relative;
      left: 20px;
      top: 20px;
      border-radius: 20px;
      background:hsl(190deg 31.45% 58.49%);
	  box-shadow: 1px 1px 1px 1px #f6f6f6;
    }/*컷(추천) 바 확대*/

    .killer-call-bars > svg > text:nth-child(2) {
      fill: #f72727;
    }/*첫 선택 빨강 표시*/

    .sidebar{
      margin-left: 60px;
      justify-content: flex-start;
      align-content; center;
      flex-direction: column;
    }
    .sidebar > * {
      margin:5px;
    }/*우측 사이드바 스타일*/

    .controls {
      background: hsl(190deg 49.75% 89.34% / 36%);
      border-radius: 20px;
      height: 325px;
	  box-shadow:  1px 1px 1px 1px #f6f6f6;
    }/*컨트롤 패널*/

    .controls > * {
      margin: 5px;
      color: black;
      border-color: white;
      border-radius: 15px;
      background: #74abb6;
	  width: 115px;
    }/*컨트롤 버튼 스타일*/

    .tileImg:hover {
        background: #cdcbcb;
    }/*호버 시 패 표시*/

    .modal, button {
      border-radius: 10px;
    }/*옵션/어바웃 모달*/

	#about-modal {
    background: linear-gradient(45deg, hsl(190deg 100% 20%), hsl(190 100% 30% / 1), hsl(190 100% 40% / 1));
	}/*어바웃 배경*/

	.newSetting {
		height: 50px;
		width: 150px;
	}/*신규 버튼 크기*/

    .opt-info table .tileImg {
		width: calc(var(--tile-img-width)*0.7);
		height: auto;
		position: relative;
		top: 5px;
    }/*Mortal 추천패 이미지 크기 조정*/

    .wider-table td {
		height: 36px;
		padding-top: 2px;
		padding-bottom: 2px;
    }/*행 높이 조정*/

    #about-body-0 > li:last-child > span {
        display: none;
    }
    #about-body-0 > li:last-child:after {
      content: '버그가 있으면 이 스크립트를 비활성화하세요 / Disable Script When BUG';
    }/*알림 텍스트*/
 `
    GM_addStyle(css)
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
			tooltip.style.backgroundColor = '#7dbcc980';
			tooltip.style.border = '1px solid white';
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

function backgroundSetting(){
	let buttonBox = document.querySelector('.buttonBox-div');
	if (!buttonBox) return;
	let setBackgroundButton = document.createElement('button');
	let backgroundURL = GM_getValue('backgroundPicUrl', '');
	let backgroundImg = document.createElement('img');
	setBackgroundButton.className = 'newSetting';
	buttonBox.appendChild(setBackgroundButton);
	setBackgroundButton.textContent = '배경 이미지 변경';
	setBackgroundButton.addEventListener('click', ()=>{
		let inputURL = prompt('배경 이미지 URL을 입력하세요', backgroundURL || '');
		if (inputURL !== null) {
			backgroundURL = inputURL.trim();
			backgroundImg.src = backgroundURL;
			GM_setValue('backgroundPicUrl', backgroundURL); //배경 URL 저장
		}
		const gridMain = document.querySelector('.grid-main');
		if (gridMain) gridMain.style.backgroundImage = backgroundURL ? `url(${backgroundURL})` : '';
	});
	const gridMainInit = document.querySelector('.grid-main');
	if (gridMainInit) gridMainInit.style.backgroundImage = backgroundURL ? `url(${backgroundURL})` : '';
	backgroundImg.src = backgroundURL || '';
	backgroundImg.style.maxWidth = '200px';
	backgroundImg.style.maxHeight = '200px';
    backgroundImg.style.marginTop = '30px';
	backgroundImg.style.justifySelf = 'center';
	backgroundImg.onload = ()=>{ const optionsDiv = document.querySelector('.options-div'); if (optionsDiv) optionsDiv.appendChild(backgroundImg); }
	backgroundImg.onerror = ()=> {
		console.log('배경 이미지 로드 실패');
		const gridMain = document.querySelector('.grid-main');
		if (gridMain) gridMain.style.background = '#285a63'; //작탁 기본 색상
	}
}

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

function logoSetting(){
	let buttonBox = document.querySelector('.buttonBox-div');
	if (!buttonBox) return;
    let setLogoButton = document.createElement('button');
	let logoURL = GM_getValue('logoURL', '');
	setLogoButton.className = 'newSetting';
	buttonBox.appendChild(setLogoButton);
	setLogoButton.textContent = '이미지 변경';
	setLogoButton.addEventListener('click', ()=>{
		let inputURL = prompt('이미지 URL을 입력하세요', logoURL || '');
		if (inputURL !== null) {
			logoURL = inputURL.trim();
			GM_setValue('logoURL', logoURL); //로고 URL 저장
		}
		let logoImg = document.querySelector('.killer-call-img');
		if (logoImg) logoImg.src = logoURL || '';
	});
    if (logoURL) {
        let logoStyle = `
		.killer-call-img {\n\t\tcontent: url('${logoURL}');\n      	position: relative;\n      \ttop: 50px;\n      \tscale: 1.2;\n    }`;
		GM_addStyle(logoStyle);
    }
}

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

	addEventListener('keydown', (e)=>{ //F11 전체화면 토글
		if (e.key === 'F11') {
			event.preventDefault();
			document.documentElement.requestFullscreen();
		}
	});
	addEventListener('fullscreenchange',()=>{
		let mainInFull = document.querySelector('main');
		if (!document.fullscreen) {
			if (mainInFull) { mainInFull.style.scale = `${defaultScale}`; mainInFull.style.top = '50px'; }
		} else {
			if (mainInFull) { mainInFull.style.scale = `${fullScreenScale}`; mainInFull.style.top = '110px'; }
		}
	});
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
	if (!buttonBox) return ['1','5','10','-1'];
	let setErrToleranceButton = document.createElement('button');
	let errToleranceStr = GM_getValue('errToleranceStr', '1, 5, 10, -1');
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
    if (mainElem) mainElem.style.scale = `${scaleArray[0]}`; //초기 확대 적용

	scaleButton.className = 'newSetting';
	buttonBox.appendChild(scaleButton);
	scaleButton.textContent = '화면 확대 배율';
	scaleButton.addEventListener('click', ()=>{
		let explainText ='확대 배율 조합을 입력하세요 (쉼표로 구분, 새로고침 후 적용)\n' +
						'첫번째: 비전체화면 배율\n' +
						'두번째: 전체화면 배율'
		let inputStr = prompt(explainText, scaleStr);
		if (inputStr !== null) {
            let input = inputStr.replace('，',',');
            let numArray = input.split(',');
            let newScaleArray = numArray.map(Number);
			if (newScaleArray.length !== 2 || newScaleArray.some(isNaN)) {
                alert('매개변수 수가 올바르지 않습니다!');
                return;
            }
			GM_setValue('scaleStr', inputStr);
            scaleStr = inputStr;
            scaleArray = scaleStr.split(',');
            if (mainElem) mainElem.style.scale = `${scaleArray[0]}`;
		}
	});
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
						content: '';
						position: absolute;
						inset: -40%;
						background: linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255, 255, 255, 0.7), rgba(255,255,255,0) 60%);
						animation: doraFlash 2s infinite;
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
			/*자기 자가그(暗杠) dora 표시 수정*/
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

	let shantenText = `${shantenCnt}  샨텐`; // 向听`;
	if(!shantenCnt) shantenText = '텐파이'; // '听牌';
	let showShanten = document.createElement('text');
	showShanten.textContent = shantenText;
	showShanten.style.textAlign = 'center';
	showShanten.style.width = '100%';
	showShanten.marginTop = '1%';
	effWindow.appendChild(showShanten);

	for (let ukeInfo of ukeireSet) {
		let pai = ukeInfo.pai;
		let tile = document.createElement('img');
		let leftText = ukeInfo.left.leftNor.toString().padStart(2, '0') + ':'
					+ ukeInfo.left.leftPure.toString().padStart(2, '0');
		let showLeftText = document.createElement('text');
		let wrapDiv = document.createElement('div');

		tile.src = `media/Regular_shortnames/${pai}.svg`;
		tile.className = 'tileImg effTile';
		showLeftText.style.fontSize = 'xx-small';
		showLeftText.style.lineHeight = '2';
		showLeftText.style.marginLeft = '2px';
		showLeftText.textContent = leftText;
		wrapDiv.style.display = 'flex';
		wrapDiv.style.marginLeft = '3%';
		wrapDiv.style.marginTop = '1%';

		tile.addEventListener('mouseover', ()=> {
			let effHover = document.createElement('div');

			let hoverPai, cnt = 0;
			for (let i = 1; i <= 4; i++) {
				for (let j = 1; j <= 9; j++) {
					if (!ukeInfo.uke[i][j]) continue;
					switch(i) {
						case 1: hoverPai = j.toString() + 'm'; break;
						case 2: hoverPai = j.toString() + 'p'; break;
						case 3: hoverPai = j.toString() + 's'; break;
						case 4: hoverPai = j.toString() + 'z'; break;
					}
					cnt++;
					let hoverTile = document.createElement('img');
					hoverTile.src = `media/Regular_shortnames/${hoverPai}.svg`;
					hoverTile.className = 'tileImg hoverTile';
					effHover.appendChild(hoverTile);
				}
			}

			let posParent = effWindow.getBoundingClientRect();
			let maxWidthcCnt = Math.min(13, cnt);
			let posX = ( posParent.left + posParent.right - (standardTileWidth + 4) * maxWidthcCnt ) / 2;
			let posY = posParent.top - Math.ceil(cnt / 13) * (standardTileHeight + 4) - 10;
			effHover.style.width = `${maxWidthcCnt * (standardTileWidth + 4)}px`;
			effHover.style.left = `${posX}px`
			effHover.style.top = `${posY}px`
			effHover.className = 'eff-hover';
			document.body.appendChild(effHover);

			const deleteEffHover = ()=>{
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

	if (!effEnable) {
		efficencySwitch.textContent = '패효율 계산 켜기';
	} else {
		efficencySwitch.textContent = '패효율 계산 끄기';
	}

	efficencySwitch.addEventListener('click', ()=>{
		effEnable = !effEnable;
		if (!effEnable) {
			efficencySwitch.textContent = '패효율 계산 켜기';
		} else {
			efficencySwitch.textContent = '패효율 계산 끄기';
		}
		GM_setValue('effEnable', effEnable);
	});
	if (!effEnable) return;

	let effDiv = document.createElement('div');
	let killerCallDiv = document.querySelector('.killer-call-div');
	let effCss = `
		.efficency-call-div {
			scale: 1.4;
			width: calc(var(--zoom)*245px);
			height: calc(var(--zoom)*110px);
			background: hsl(190deg 31.45% 58.49%);
			box-shadow:  1px 1px 1px 1px #f6f6f6;
			border-radius: 20px;
			margin-top: 34%;
			margin-left: 14%;
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
			box-shadow: inset 0 0 2px #880000;
		}
	`;
	GM_addStyle(effCss);

	let logoImg = document.querySelector('.killer-call-img');
	if (logoImg) logoImg.style.display = 'none';
	effDiv.addEventListener('click', ()=>{
		if (!document.fullscreen) document.documentElement.requestFullscreen();
		else document.exitFullscreen();
	});
	effDiv.className = 'efficency-call-div';
	if (killerCallDiv) killerCallDiv.appendChild(effDiv);
}

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
