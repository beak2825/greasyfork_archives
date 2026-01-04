// ==UserScript==
// @name         심리적응검사 날먹기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  KUS 심리적응검사 설문을 자동으로 '정상인'으로 응답합니다.
// @author       자동화 전문가
// @match        https://kuseum.korea.ac.kr/comm/surv/popup/*/index.do*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551225/%EC%8B%AC%EB%A6%AC%EC%A0%81%EC%9D%91%EA%B2%80%EC%82%AC%20%EB%82%A0%EB%A8%B9%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551225/%EC%8B%AC%EB%A6%AC%EC%A0%81%EC%9D%91%EA%B2%80%EC%82%AC%20%EB%82%A0%EB%A8%B9%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 설문조사 자동 응답 스크립트
     * 각 문항의 키워드를 기반으로 '정상적'이고 '긍정적인' 답변을 선택합니다.
     * 신뢰도 검사 문항(함정 문항)에 대해서는 지정된 답변을 선택합니다.
     */
    function fillSurvey() {
        // 각 키워드에 해당하는 답변의 CSS 선택자(li:nth-child)를 매핑합니다.
        const answerMap = new Map();

        // 답변 선택을 위한 헬퍼 함수
        // keywords: 문항 제목에 포함된 키워드 배열
        // selector: 클릭할 input 태그를 포함하는 li 요소의 nth-child 선택자
        const setAnswer = (keywords, selector) => {
            keywords.forEach(keyword => answerMap.set(keyword, selector));
        };

        // --- 신뢰도 검사 문항 (가장 먼저 처리) ---
        setAnswer(['당신이 현재 검사 문항에 응답하고 있다면'], 'li:nth-child(4) input'); // "자주 그렇다"
        setAnswer(['대한민국의 수도는 서울이 아니다'], 'li:nth-child(1) input'); // "전혀 그렇지 않다"
        setAnswer(['나는 본 검사에 집중하여 응답하고 있다'], 'li:nth-child(4) input'); // "매우 그렇다"
        setAnswer(['나는 본 검사 문항을 읽지 않고 응답하고 있다'], 'li:nth-child(1) input'); // "전혀 그렇지 않다"
        setAnswer(['고려대학교 세종캠퍼스 학생이다'], 'li:nth-child(3) input'); // "다소 그렇다"

        // --- 부정적 감정, 정신건강 관련 (전부 "전혀 그렇지 않다" - 1번) ---
        setAnswer(['두려운', '나쁜 일이 생길 것', '공포스러운', '걱정이 많다', '관심과 흥미를 느끼지 못한다', '기운이 없고 침체된', '집중하는 것에 어려움', '희망이 없는', '자살', '죽고', '죄로 인해 벌', '들리지 않는 소리', '보이지 않는 것을 볼', '남들이 이상하게 여기는 행동', '이상하다고 여길 생각', '누군가가 조종하는 것 같다', '혼자 있는 기분', '구역질', '팔다리가 무겁다', '머리가 아프다', '어지럽거나 현기증'], 'li:nth-child(1) input');

        // --- 긍정적 자기인식, 회복탄력성 (전부 "매우 그렇다" - 4번) ---
        setAnswer(['스스로가 가치 있는 사람', '장점이 많은 사람이다', '긍정적으로 바라본다', '전반적으로 만족한다', '어려운 일들을 잘 이겨낼 수 있다', '다양한 생각을 해낼 수 있다', '다양한 방법으로 이겨낸다', '성공적으로 가고 있다', '목표를 향해 나아가고 있다', '가장 좋은 결과를 이루어 낼 것'], 'li:nth-child(4) input');

        // --- 역코딩 문항 (부정적 질문에 "전혀 그렇지 않다" - 1번) ---
        setAnswer(['자랑할 만한 것이 거의 없다', '시험을 망칠 것 같다', '시험을 못볼까봐 불안하다', '극복하는 것이 어렵다', '집에 가기 꺼려진다', '무시를 당한다', '다른 전공을 택하고 싶다'], 'li:nth-child(1) input');

        // --- 사회적 지지 (전부 "매우 그렇다" - 4번) ---
        setAnswer(['속을 터놓고 이야기 할 수 있는 친구들', '별 탈 없이 사람들과 잘 사귀며', '룸메이트', '다양한 학우들과 교류', '정보와 조언을 제공', '나의 목표와 관심 분야에 대해 이야기', '칭찬과 격려를 해 주신다', '믿고 따를 수 있는 교수님', '나의 이야기를 잘 들어주신다', '잘 이해해주신다', '가족 구성원과 사이가 좋다'], 'li:nth-child(4) input');

        // --- 학교 만족도 (전부 "매우 그렇다" - 4번) ---
        setAnswer(['입학한 것에 만족한다', '최선이었다고 생각한다', '위상에 만족한다', '자랑스러움을 느낀다', '소속감을 느끼고 있다', '자부심이 있다', '분교라는 것에 상관없이'], 'li:nth-child(4) input');

        // --- 학교 시설 및 행정 (약간 긍정적인 "다소 그렇다" - 3번) ---
        setAnswer(['학사행정시스템', '신체건강(운동, 보건 시설) 및 심리건강(심리상담)', '동아리나 학회 등의 활동에 충분한 지원', '휴게 시설이 잘 갖추어져', '교통편의 서비스가 괜찮은 편', '기숙사 시설이 잘 갖추어져', '프로그램이나 제도들에 대해서 잘 홍보'], 'li:nth-child(3) input');

        // --- 전공 만족도 (전부 "매우 그렇다" - 4번) ---
        setAnswer(['하고자 하는 일과 관련이 있다', '관심이 더 많이 생겼다', '진로에 적합하다고 생각한다', '성격이나 흥미에 맞는 공부', '적성에 잘 맞는다는 생각', '미래의 직업을 발견할 수 있을 것 같다'], 'li:nth-child(4) input');

        // --- 음주, 흡연, 약물, 식습관 (가장 부정적인 답변) ---
        setAnswer(['음주로 인한 어려움을 경험'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['한 달 평균 며칠이나 술을 마셨습니까'], 'li:nth-child(1) input'); // 해당없음
        setAnswer(['술을 마시는 양이나 빈도가 크게 늘었습니까'], 'li:nth-child(1) input'); // 전혀 그렇지 않다
        setAnswer(['음주 문제로 인해 다른 사람과 문제가 발생'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['흡연으로 인한 어려움을 경험'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['하루 평균 흡연량'], 'li:nth-child(1) input'); // 없음
        setAnswer(['담배를 피우는 양이 늘었습니까'], 'li:nth-child(1) input'); // 전혀 그렇지 않다
        setAnswer(['치료 목적 외에 약물'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['식습관으로 인한 어려움을 경험'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['멈추는 데 어려움이 있다'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['스스로 구토를 유도한 적이 있다'], 'li:nth-child(1) input'); // 아니다
        setAnswer(['훨씬 많은 양(혹은 훨씬 적은 양)을 먹는다'], 'li:nth-child(1) input'); // 아니다

        // --- 경제 상황 (긍정적) ---
        setAnswer(['가정에서 등록금 및 최소생활비용을 지원해 주는 정도'], 'li:nth-child(6) input'); // 100%
        setAnswer(['어디로부터 지원을 받거나 충당'], 'li:nth-child(6) input'); // 해당사항없음
        setAnswer(['등록금 및 최소생활비용을 마련하기 위해 하는 일'], 'li:nth-child(1) input'); // 일하지 않음

        // --- 진로 계획 (현재에 만족) ---
        setAnswer(['편입학/전공제도 중 가장 많이 고려'], 'li:nth-child(1) input'); // 없다

        // --- 스크립트 실행 로직 ---
        const surveyItems = document.querySelectorAll('.survey_box');
        let answeredCount = 0;

        surveyItems.forEach((item, index) => {
            const titleElement = item.querySelector('p.title');
            if (!titleElement) return;

            // HTML의 특수 공백(&nbsp;) 및 연속 공백을 표준 공백 한 칸으로 변환합니다.
            const titleText = titleElement.innerText.replace(/\s+/g, ' ').trim();
            let foundAnswer = false;

            for (const [keyword, selector] of answerMap.entries()) {
                if (titleText.includes(keyword)) {
                    const targetInput = item.querySelector(selector);
                    if (targetInput) {
                        const targetSpan = targetInput.parentElement.querySelector('span.txt');
                        if (targetSpan) {
                            targetSpan.click(); // label.radio > span.txt 요소를 클릭
                            answeredCount++;
                            foundAnswer = true;
                            break; // 해당 문항에 대한 키워드를 찾았으면 다음 문항으로 넘어감
                        }
                    }
                }
            }
            if (!foundAnswer) {
                 console.log(`[주의] 문항 ${index + 1}번에 대한 자동 응답 규칙을 찾지 못했습니다: "${titleText}"`);
            }
        });

        console.log(`총 ${surveyItems.length}개의 문항 중 ${answeredCount}개에 자동으로 응답했습니다.`);
        if (surveyItems.length !== answeredCount) {
            console.log("응답하지 못한 문항이 있는지 확인해주세요.");
        } else {
            console.log("모든 문항에 대한 자동 응답이 완료되었습니다.");
        }
    }

    // 페이지가 완전히 로드된 후 스크립트를 실행합니다.
    window.addEventListener('load', function() {
        fillSurvey();
    });
})();

