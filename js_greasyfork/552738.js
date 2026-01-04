// ==UserScript==
// @name         Chzzk Cheese Stats Viewer
// @namespace    agak
// @version      1.1.0
// @description  치지직 채널별 치즈 후원 통계 표시
// @author       agak
// @match        https://game.naver.com/profile*
// @icon         https://imgur.com/EJEmHgU.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552738/Chzzk%20Cheese%20Stats%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/552738/Chzzk%20Cheese%20Stats%20Viewer.meta.js
// ==/UserScript==

(function() {
    "use strict";
    console.log("[치즈 후원 통계] Loaded at", new Date());
    // 이 스크립트는 https://github.com/makeAppsGreat/Log-Power-Clicker 스크립트를 허락받고 참고하여 만들었습니다.

    let isStatsCreated = false;

    // 구독권 티어별 가격
    const SUBSCRIPTION_PRICES = {
        'TIER_1': 4900,
        'TIER_2': 14900
    };

    // 치즈양(후원금액) 통계 생성 함수
    function createCheeseStats() {
        // 이미 생성되었거나 치즈 페이지가 아니면 종료
        if (isStatsCreated) return;
        if (!window.location.href.includes('#cash')) return;

        const targetSection = document.querySelector('section.profile_section__23jL-');
        if (!targetSection) {
            console.debug("[치즈 후원 통계] Target section not found");
            return;
        }

        // 이미 통계 컨테이너가 있는지 확인
        if (document.getElementById("cheese_stats_container")) {
            console.debug("[치즈 후원 통계] Stats container already exists");
            return;
        }

        console.debug("[치즈 후원 통계] Creating stats container");
        isStatsCreated = true;

        // 기존 컨테이너 찾기
        const existingContainer = targetSection.querySelector('.profile_common_container__2Q8-1');
        if (!existingContainer) {
            console.debug("[치즈 후원 통계] Existing container not found");
            isStatsCreated = false;
            return;
        }

        // 헤더 생성
        const header = document.createElement('div');
        header.className = 'profile_common_header__2X1Vd';
        header.style.marginTop = '40px';
        const title = document.createElement('h4');
        title.className = 'profile_common_title__2ttHE';
        title.textContent = '채널별 치즈 후원 통계';
        header.appendChild(title);

        // 설명 문구 추가
        const description = document.createElement('p');
        description.style.setProperty("color", "#666");
        description.style.setProperty("font-size", "13px");
        description.style.setProperty("margin-top", "12px");
        description.textContent = '사용자 스크립트 "Chzzk Cheese Stats Viewer"에 의해 만들어진 영역 입니다.';
        header.appendChild(description);

        // 통계 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'profile_common_container__2Q8-1 profile_common_type_default__1CARE';
        container.id = 'cheese_stats_container';

        const statsDiv = document.createElement("div");
        statsDiv.style.setProperty("padding", "24px");
        statsDiv.style.setProperty("text-align", "center");
        statsDiv.textContent = "불러오는 중...";
        container.appendChild(statsDiv);

        // 섹션 끝에 추가
        targetSection.appendChild(header);
        targetSection.appendChild(container);

        // 데이터 로딩
        setTimeout(() => {
            const fetchYearData = (year) => {
                return fetch(`https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=1000000&searchYear=${year}`, {
                    "headers": {
                        "accept": "*/*",
                    },
                    "method": "GET",
                    "credentials": "include"
                }).then(response => response.json());
            };

            const fetchSubscriptionGifts = () => {
                return fetch(`https://api.chzzk.naver.com/commercial/v1/gift/subscription/send-history?page=0&size=1000000`, {
                    "headers": {
                        "accept": "*/*",
                    },
                    "method": "GET",
                    "credentials": "include"
                }).then(response => response.json());
            };

            // 2023년부터 현재 연도까지 자동으로 생성
            const currentYear = new Date().getFullYear();
            const startYear = 2023;
            const yearPromises = [];

            for (let year = startYear; year <= currentYear; year++) {
                yearPromises.push(fetchYearData(year));
            }

            Promise.all([...yearPromises, fetchSubscriptionGifts()]).then((results) => {
                const purchasesByChannel = {};

                // 치즈 후원 데이터 처리
                const subscriptionData = results.pop(); // 마지막이 구독권 데이터
                const yearDataArray = results; // 나머지가 연도별 데이터

                // 모든 연도의 데이터를 하나로 합치기
                const allData = [];
                yearDataArray.forEach(yearData => {
                    if (yearData.content?.data) {
                        allData.push(...yearData.content.data);
                    }
                });

                allData.forEach(purchase => {
                    const channelId = purchase.channelId;
                    const channelName = purchase.channelName;
                    const channelImageUrl = purchase.channelImageUrl;
                    const purchaseDate = new Date(purchase.purchaseDate);

                    if (!purchasesByChannel[channelId]) {
                        purchasesByChannel[channelId] = {
                            channelName: channelName,
                            channelId: channelId,
                            totalAmount: 0,
                            count: 0,
                            subscriptionTier1Count: 0,
                            subscriptionTier2Count: 0,
                            channelImageUrl: channelImageUrl,
                            firstDate: purchaseDate,
                            lastDate: purchaseDate
                        };
                    }

                    // 총 후원금액은 항상 추가
                    purchasesByChannel[channelId].totalAmount += purchase.payAmount;

                    // TTS가 아닌 경우만 후원 횟수 증가
                    if (purchase.donationType !== 'TTS') {
                        purchasesByChannel[channelId].count += 1;
                    }

                    // 가장 오래된 날짜와 최근 날짜 업데이트
                    if (purchaseDate < purchasesByChannel[channelId].firstDate) {
                        purchasesByChannel[channelId].firstDate = purchaseDate;
                    }
                    if (purchaseDate > purchasesByChannel[channelId].lastDate) {
                        purchasesByChannel[channelId].lastDate = purchaseDate;
                    }
                });

                // 구독권 선물 데이터 처리
                if (subscriptionData.content?.data) {
                    subscriptionData.content.data.forEach(gift => {
                        const channelId = gift.channelId;
                        const channelName = gift.channelName;
                        const channelImageUrl = gift.channelImageUrl;
                        const giftPrice = SUBSCRIPTION_PRICES[gift.tier] || 0;
                        const quantity = gift.quantity || 1;

                        if (!purchasesByChannel[channelId]) {
                            purchasesByChannel[channelId] = {
                                channelName: channelName,
                                channelId: channelId,
                                totalAmount: 0,
                                count: 0,
                                subscriptionTier1Count: 0,
                                subscriptionTier2Count: 0,
                                channelImageUrl: channelImageUrl,
                                firstDate: null,
                                lastDate: null
                            };
                        }

                        // 구독권 금액 추가
                        purchasesByChannel[channelId].totalAmount += giftPrice * quantity;

                        // 티어별 카운트 증가
                        if (gift.tier === 'TIER_1') {
                            purchasesByChannel[channelId].subscriptionTier1Count += quantity;
                        } else if (gift.tier === 'TIER_2') {
                            purchasesByChannel[channelId].subscriptionTier2Count += quantity;
                        }
                    });
                }

                const sortedChannels = Object.values(purchasesByChannel)
                    .sort((a, b) => b.totalAmount - a.totalAmount);

                // 테이블 생성
                const table = document.createElement("table");
                table.style.setProperty("width", "100%");
                table.style.setProperty("border-collapse", "collapse");
                table.cellPadding = "0";
                table.cellSpacing = "0";
                table.className = "table_wrapper__319N0";

                // 헤더 생성
                const thead = document.createElement("thead");
                const headerRow = document.createElement("tr");
                ['순위', '채널명', '후원 횟수', '구독권 선물\n(1티어/2티어)', '총 후원금액', '첫 후원', '최근 후원'].forEach((text, index) => {
                    const th = document.createElement("th");
                    th.scope = "col";
                    th.style.setProperty("padding", "12px 8px");
                    th.style.setProperty("text-align", index === 1 ? 'left' : 'center');
                    th.style.setProperty("white-space", "pre-line");
                    th.textContent = text;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // 바디 생성
                const tbody = document.createElement("tbody");
                sortedChannels.forEach((channel, index) => {
                    const row = document.createElement("tr");

                    // 순위
                    const rankCell = document.createElement("td");
                    rankCell.style.setProperty("padding", "12px 8px");
                    rankCell.style.setProperty("text-align", "center");
                    rankCell.textContent = `${index + 1}위`;

                    // 채널명 (링크 포함)
                    const nameCell = document.createElement("td");
                    nameCell.style.setProperty("padding", "12px 8px");
                    const link = document.createElement("a");
                    link.href = `https://chzzk.naver.com/${channel.channelId}`;
                    link.target = "_blank";
                    link.className = "table_link__2Y8y7";
                    link.rel = "noreferrer";
                    link.style.setProperty("display", "flex");
                    link.style.setProperty("align-items", "center");

                    const imageDiv = document.createElement("div");
                    imageDiv.className = "table_image__3XY6X";
                    if (channel.channelImageUrl) {
                        imageDiv.style.setProperty("background-image", `url("${channel.channelImageUrl}")`);
                    }
                    imageDiv.style.setProperty("width", "24px");
                    imageDiv.style.setProperty("height", "24px");
                    imageDiv.style.setProperty("border-radius", "50%");
                    imageDiv.style.setProperty("background-size", "cover");
                    imageDiv.style.setProperty("background-position", "center");
                    imageDiv.style.setProperty("margin-right", "8px");
                    imageDiv.style.setProperty("flex-shrink", "0");

                    const nameSpan = document.createElement("span");
                    nameSpan.className = "table_text__1aOIu";
                    nameSpan.textContent = channel.channelName;

                    link.appendChild(imageDiv);
                    link.appendChild(nameSpan);
                    nameCell.appendChild(link);

                    // 후원 횟수
                    const countCell = document.createElement("td");
                    countCell.style.setProperty("padding", "12px 8px");
                    countCell.style.setProperty("text-align", "center");
                    const countStrong = document.createElement("strong");
                    countStrong.className = "table_text__1aOIu";
                    countStrong.textContent = `${channel.count.toLocaleString()}회`;
                    countCell.appendChild(countStrong);

                    // 구독권 선물 횟수 (1티어/2티어)
                    const subCountCell = document.createElement("td");
                    subCountCell.style.setProperty("padding", "12px 8px");
                    subCountCell.style.setProperty("text-align", "center");
                    const subCountStrong = document.createElement("strong");
                    subCountStrong.className = "table_text__1aOIu";
                    subCountStrong.textContent = `${channel.subscriptionTier1Count.toLocaleString()}회 / ${channel.subscriptionTier2Count.toLocaleString()}회`;
                    subCountCell.appendChild(subCountStrong);

                    // 총 후원금액
                    const amountCell = document.createElement("td");
                    amountCell.style.setProperty("padding", "12px 8px");
                    amountCell.style.setProperty("text-align", "center");
                    const amountStrong = document.createElement("strong");
                    amountStrong.className = "table_text__1aOIu";
                    amountStrong.textContent = `${channel.totalAmount.toLocaleString()}원`;
                    amountCell.appendChild(amountStrong);

                    // 첫 후원 날짜
                    const firstDateCell = document.createElement("td");
                    firstDateCell.style.setProperty("padding", "12px 8px");
                    firstDateCell.style.setProperty("text-align", "center");
                    firstDateCell.style.setProperty("font-size", "13px");
                    if (channel.firstDate) {
                        const firstDateStr = `${channel.firstDate.getFullYear()}.${String(channel.firstDate.getMonth() + 1).padStart(2, '0')}.${String(channel.firstDate.getDate()).padStart(2, '0')}`;
                        const firstTimeStr = `${String(channel.firstDate.getHours()).padStart(2, '0')}:${String(channel.firstDate.getMinutes()).padStart(2, '0')}:${String(channel.firstDate.getSeconds()).padStart(2, '0')}`;
                        firstDateCell.innerHTML = `${firstDateStr}<br>${firstTimeStr}`;
                    } else {
                        firstDateCell.textContent = '-';
                    }

                    // 최근 후원 날짜
                    const lastDateCell = document.createElement("td");
                    lastDateCell.style.setProperty("padding", "12px 8px");
                    lastDateCell.style.setProperty("text-align", "center");
                    lastDateCell.style.setProperty("font-size", "13px");
                    if (channel.lastDate) {
                        const lastDateStr = `${channel.lastDate.getFullYear()}.${String(channel.lastDate.getMonth() + 1).padStart(2, '0')}.${String(channel.lastDate.getDate()).padStart(2, '0')}`;
                        const lastTimeStr = `${String(channel.lastDate.getHours()).padStart(2, '0')}:${String(channel.lastDate.getMinutes()).padStart(2, '0')}:${String(channel.lastDate.getSeconds()).padStart(2, '0')}`;
                        lastDateCell.innerHTML = `${lastDateStr}<br>${lastTimeStr}`;
                    } else {
                        lastDateCell.textContent = '-';
                    }

                    row.appendChild(rankCell);
                    row.appendChild(nameCell);
                    row.appendChild(countCell);
                    row.appendChild(subCountCell);
                    row.appendChild(amountCell);
                    row.appendChild(firstDateCell);
                    row.appendChild(lastDateCell);
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);

                // 총합 행 추가
                const totalRow = document.createElement("tr");
                totalRow.style.setProperty("border-top", "2px solid #e5e5e5");
                totalRow.style.setProperty("font-weight", "600");

                const totalLabelCell = document.createElement("td");
                totalLabelCell.colSpan = 2;
                totalLabelCell.style.setProperty("padding", "12px 8px");
                totalLabelCell.style.setProperty("text-align", "center");
                totalLabelCell.textContent = "총계";

                const totalCount = sortedChannels.reduce((sum, ch) => sum + ch.count, 0);
                const totalCountCell = document.createElement("td");
                totalCountCell.style.setProperty("padding", "12px 8px");
                totalCountCell.style.setProperty("text-align", "center");
                totalCountCell.textContent = `${totalCount.toLocaleString()}회`;

                const totalSubTier1 = sortedChannels.reduce((sum, ch) => sum + ch.subscriptionTier1Count, 0);
                const totalSubTier2 = sortedChannels.reduce((sum, ch) => sum + ch.subscriptionTier2Count, 0);
                const totalSubCountCell = document.createElement("td");
                totalSubCountCell.style.setProperty("padding", "12px 8px");
                totalSubCountCell.style.setProperty("text-align", "center");
                totalSubCountCell.textContent = `${totalSubTier1.toLocaleString()}회 / ${totalSubTier2.toLocaleString()}회`;

                const totalAmount = sortedChannels.reduce((sum, ch) => sum + ch.totalAmount, 0);
                const totalAmountCell = document.createElement("td");
                totalAmountCell.style.setProperty("padding", "12px 8px");
                totalAmountCell.style.setProperty("text-align", "center");
                totalAmountCell.textContent = `${totalAmount.toLocaleString()}원`;

                // 날짜 열은 빈 셀로 채우기
                const emptyCell1 = document.createElement("td");
                emptyCell1.style.setProperty("padding", "12px 8px");
                const emptyCell2 = document.createElement("td");
                emptyCell2.style.setProperty("padding", "12px 8px");

                totalRow.appendChild(totalLabelCell);
                totalRow.appendChild(totalCountCell);
                totalRow.appendChild(totalSubCountCell);
                totalRow.appendChild(totalAmountCell);
                totalRow.appendChild(emptyCell1);
                totalRow.appendChild(emptyCell2);
                tbody.appendChild(totalRow);

                // 테이블 컨테이너
                const tableContainer = document.createElement("div");
                tableContainer.className = "table_container__2G8Bx";
                tableContainer.appendChild(table);

                statsDiv.replaceChildren(tableContainer);
                console.log("[치즈 후원 통계] 데이터 로드 완료:", new Date());
            }).catch(error => {
                console.error('[치즈 후원 통계] 데이터 로드 실패:', error);
                statsDiv.textContent = "데이터 로드 중 오류가 발생했습니다.";
            });
        }, 100);
    }

    // URL 변경 감지 함수
    function onUrlChange() {
        // 치즈 페이지에서 벗어나면 플래그 초기화
        if (!window.location.href.includes('#cash')) {
            isStatsCreated = false;
            document.getElementById("cheese_stats_container")?.parentElement?.remove();
            document.querySelector('#cheese_stats_container')?.previousElementSibling?.remove();
        } else {
            // 치즈 페이지에 들어오면 생성 시도
            setTimeout(createCheeseStats, 500);
        }
    }

    // 페이지 이동 감지 설정
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(this, arguments);
        onUrlChange();
    };

    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        onUrlChange();
    };

    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('hashchange', onUrlChange);

    // 초기 실행 (페이지 로드 후 약간의 지연)
    setTimeout(onUrlChange, 1000);
})();