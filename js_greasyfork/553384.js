// ==UserScript==
// @name         LZT Contests Info (Firefox)
// @namespace    LZTContestsInfo
// @version      1.6
// @description  Информация о розыгрышах в профиле LZT с кэшем на 10 минут, с обходом CSP (Firefox)
// @author       llimonix
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @match        https://zelenka.guru
// @match        https://lzt.market
// @match        https://lolz.guru
// @match        https://lolz.live
// @icon         https://cdn-icons-png.flaticon.com/512/5899/5899678.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553384/LZT%20Contests%20Info%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553384/LZT%20Contests%20Info%20%28Firefox%29.meta.js
// ==/UserScript==

(function() {
    const scriptContent = `
        (function() {
            $('<style>').text(\`
                .contestsInfoContainer {
                    margin-top: -20px;
                    padding: 20px;
                    border-top: 1px solid #363636;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                .contestsInfo {
                    padding: 0 10px;
                    background: #303030;
                    border-radius: 8px;
                    line-height: 40px;
                    box-sizing: border-box;
                    font-weight: 600;
                    transition: 0.3s;
                    margin: 0;
                    width: 100%;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    min-width: 0;
                }
                .contestsInfoContainer .contestsInfo.totalWinnings {
                    background-color: #00ba7820;
                    border: 1px solid #00ba7832;
                }
                .contestsInfoContainer .contestsInfo.totalGiveaway {
                    background-color: #d7515720;
                    border: 1px solid #d7515732;
                }
                .contestsInfo .data {
                    margin-left: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    user-select: all;
                }
                .contestsInfo .contactIcon {
                    font-size: 20px;
                    line-height: 42px;
                    float: left;
                }
                .constestsInfoDetails.button {
                    background-color: #1c1c1c;
                }
                .LZTContestsInfo {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .LZTContestsInfo .LZTContestsItem {
                    height: 63px;
                    background: #2D2D2D;
                    border-radius: 8px;
                    padding: 12px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    white-space: normal;
                    flex: 1 1 100%;
                    max-width: 100%;
                    font-weight: 700;
                }
                @media screen and (min-width: 700px) {
                    .LZTContestsInfo .LZTContestsItem {
                        flex: 1 1 calc((100% / 2) - 24px);
                    }
                }
                .LZTContestsIcon {
                    margin-right: 12px;
                }
                .LZTContestsInfo .LZTContestsItem i {
                    width: 24px;
                    height: 24px;
                    font-size: 24px;
                }
                .LZTContestsInfo--statusContainer {
                    margin-top: 12px;
                }
                .LZTContestsInfo--status {
                    display: flex;
                    color: #949494;
                    background: #303030;
                    padding: 15px 20px;
                    border-radius: 12px;
                    flex-direction: column;
                }
                .LZTContestsInfo--status .statusTitle {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 4px;
                    color: #FF6A70;
                }
                .LZTContestsInfoWrapper {
                    display: flex;
                    flex-wrap: wrap;
                }
                .xenOverlay .userStatCounters.hasContacts,
                .Responsive .xenOverlay .userStatCounters.hasContacts {
                    margin-bottom: 0px;
                }
                .xenOverlay .userStatCounters {
                    margin-bottom: 20px!important;
                }
                .memberCardInner {
                    & .contestsInfoContainer {
                        @media (max-width: 520px) {
                            grid-template-columns: repeat(1, 1fr);
                        }
                    }
                }
            \`).appendTo('head');

            function getUserContestData(userId) {
                return new Promise((resolve, reject) => {
                    const cacheKey = 'LZTUserData_' + userId;
                    const cachedRaw = sessionStorage.getItem(cacheKey);
                    const TEN_MIN = 10 * 60 * 1000;

                    if (cachedRaw) {
                        try {
                            const cached = JSON.parse(cachedRaw);
                            if (Date.now() - cached.timestamp < TEN_MIN) {
                                console.log('[LZT Contests Info] Кэш для', userId);
                                return resolve(cached.data);
                            }
                        } catch(e) {
                            console.warn('Ошибка парсинга кэша:', e);
                        }
                    }

                    $.ajax({
                        url: 'https://lzt-winners-contests.vercel.app/user/' + userId + '?include_ranks=true',
                        dataType: 'json',
                        success: function(data) {
                            sessionStorage.setItem(cacheKey, JSON.stringify({
                                timestamp: Date.now(),
                                data: data
                            }));
                            resolve(data);
                        },
                        error: function(_, status, err) {
                            reject(err || status);
                        }
                    });
                });
            }

            XenForo.register(".profilePage .insuranceDeposit", function() {
                const $el = $(this);
                const userLink = $('.userContentLinks a').first();
                if (!userLink.length) return;

                const userIdMatch = userLink.attr('href').match(/\\/(\\d+)\\/?$/);
                if (!userIdMatch) return;
                const userId = userIdMatch[1];

                var contestsBlock = $('.section.contestsInfoWin, .section.contestsInfoCreate').length > 0;
                if (contestsBlock) return;

                $el.after(\`
                    <div class="section contestsInfoWin">
                        <div class="secondaryContent">
                            <h3>Победы в розыгрышах</h3>
                            <p class="amount mainc" id="totalWinnings" style="font-size:18px;font-weight:600;">Загрузка...</p>
                        </div>
                    </div>
                    <div class="section contestsInfoCreate">
                        <div class="secondaryContent">
                            <h3>Проведённые розыгрыши</h3>
                            <p class="amount redc" id="totalGiveaway" style="font-size:18px;font-weight:600;">Загрузка...</p>
                        </div>
                    </div>
                    <div class="section button block constestsInfoDetails">Подробнее</div>
                \`);

                $('.constestsInfoDetails.button').on('click', () => renderContestsInfo(userId));

                getUserContestData(userId).then(function(data){
                    $('#totalWinnings').text(
                        (data.total_winnings || 0).toLocaleString('ru-RU') + ' ₽'
                    );
                    $('#totalGiveaway').text(
                        (data.total_giveaway || 0).toLocaleString('ru-RU') + ' ₽'
                    );
                }).catch(function(){
                    $('#totalWinnings, #totalGiveaway').text('Ошибка');
                });
            });

            $(document).on('XFOverlay', function(e){
                const $overlay = e.overlay.getOverlay();
                if (!$overlay.is('.memberCard')) return;

                const $stat = $overlay.find('.bottomContainer');
                if (!$stat.length || $overlay.find('.contestsInfoContainer').length) return;

                const userLink = $overlay.find('.controlsBlock a').first();
                if (!userLink.length) return;
                const userIdMatch = userLink.attr('href').match(/\\/(\\d+)\\/?$/);
                if (!userIdMatch) return;
                const userId = userIdMatch[1];

                const $block = $(\`
                    <div class="contestsInfoContainer">
                        <div class="contestsInfo totalWinnings">
                            <span class="contactIcon fas fa-plus-circle mainc"></span>
                            <span class="data" id="totalWinnings">Выиграно: загрузка...</span>
                        </div>
                        <div class="contestsInfo totalGiveaway">
                            <span class="contactIcon fas fa-minus-circle redc"></span>
                            <span class="data" id="totalGiveaway">Разыграно: загрузка...</span>
                        </div>
                    </div>
                \`);
                $stat.after($block);

                var $menuElement = $overlay.find('.memberCardInner a[rel="Menu"]');

                if ($menuElement.length) {
                    var $buttonOverlay = $('.Menu .blockLinksList').last();
                    var $buttonInfo = $('<li><a id="constestsInfoDetails" class="OverlayTrigger">Статистика розыгрышей</a></li>');
                    $buttonInfo.on('click', () => renderContestsInfo(userId));
                    $buttonOverlay.append($buttonInfo);
                }

                getUserContestData(userId).then(function(data){
                    $block.find('#totalWinnings').text(
                        'Выиграно: ' + (data.total_winnings || 0).toLocaleString('ru-RU') + ' ₽'
                    );
                    $block.find('#totalGiveaway').text(
                        'Разыграно: ' + (data.total_giveaway || 0).toLocaleString('ru-RU') + ' ₽'
                    );
                }).catch(function(){
                    $block.find('#totalWinnings, #totalGiveaway').text('Ошибка');
                });
            });

            async function renderContestsInfo(userId) {
                const cacheKey = 'LZTUserData_' + userId;
                const cachedRaw = sessionStorage.getItem(cacheKey);

                let cached = null;
                try {
                    cached = cachedRaw ? JSON.parse(cachedRaw) : null;
                } catch (e) {
                    console.warn('Ошибка парсинга кэша:', e);
                }

                const TOTAL_WINNINGS = (cached?.data?.total_winnings || 0).toLocaleString('ru-RU');
                const TOTAL_GIVEAWAY = (cached?.data?.total_giveaway || 0).toLocaleString('ru-RU');
                const WINS_COUNT = (cached?.data?.wins_count || 0).toLocaleString('ru-RU');
                const CONTESTS_CREATED = (cached?.data?.contests_created || 0).toLocaleString('ru-RU');
                const MAX_SINGLE_WIN = (cached?.data?.max_single_win || 0).toLocaleString('ru-RU');
                const MAX_SINGLE_GIVEAWAY = (cached?.data?.max_single_giveaway || 0).toLocaleString('ru-RU');
                const RANK_BY_WINNINGS = (cached?.data?.rank_by_winnings || 0).toLocaleString('ru-RU');
                const RANK_BY_WINS_COUNT = (cached?.data?.rank_by_wins_count || 0).toLocaleString('ru-RU');
                const RANK_BY_GIVEAWAY = (cached?.data?.rank_by_giveaway || 0).toLocaleString('ru-RU');
                const RANK_BY_CONTESTS_COUNT = (cached?.data?.rank_by_contests_count || 0).toLocaleString('ru-RU');

                const statsData = [
                    { label: 'Выиграно', icon: '', value: TOTAL_WINNINGS, symbol: '₽' },
                    { label: 'Разыграно', icon: '', value: TOTAL_GIVEAWAY, symbol: '₽' },
                    { label: 'Количество побед', icon: '', value: WINS_COUNT },
                    { label: 'Количество розыгрышей', icon: '', value: CONTESTS_CREATED },
                    { label: 'Максимальная сумма победы', icon: '', value: MAX_SINGLE_WIN, symbol: '₽' },
                    { label: 'Максимальная сумма розыгрыша', icon: '', value: MAX_SINGLE_GIVEAWAY, symbol: '₽' },
                    { label: 'Топ по сумме побед', icon: '', value: RANK_BY_WINNINGS, prefix: '#' },
                    { label: 'Топ по сумме розыгрышей', icon: '', value: RANK_BY_GIVEAWAY, prefix: '#' },
                    { label: 'Топ по количеству побед', icon: '', value: RANK_BY_WINS_COUNT, prefix: '#' },
                    { label: 'Топ по количеству розыгрышей', icon: '', value: RANK_BY_CONTESTS_COUNT, prefix: '#' },
                ];

                const $items = statsData.map(({ label, icon, value, prefix = '', symbol = '' }) => \`
                    <div class="LZTContestsItem">
                        <div class="LZTContestsIcon">
                            <i class="\${icon}"></i>
                        </div>
                        <div><p>\${label}</p>\${prefix}\${value} \${symbol}</div>
                    </div>
                \`).join('');

                const $warningContestsInfo = \`
                    <div class="LZTContestsInfo--statusContainer">
                        <div class="LZTContestsInfo--status">
                          <div class="statusTitle">Важная информация</div>
                          <div>Топ и суммы могут отличаться от официального значения форума, так как средствами парсера не возможно получать удалённые темы, а форум может.</div>
                          <div>Данная статистика учитывает только денежные розыгрыши с неудалённых тем.</div>
                        </div>
                    </div>
                \`;

                const $contestsInfo = $('<div class="LZTContestsInfoWrapper">');
                const $info = $('<div class="LZTContestsInfo">').append($items);
                $contestsInfo.append($info);
                $contestsInfo.append($warningContestsInfo);

                const $modal = $(\`
                    <div class="sectionMain">
                        <h2 class="heading h1">LZT Contests Info</h2>
                        <div class="overlayContent" style="padding:15px"></div>
                    </div>
                \`);

                $modal.find('.overlayContent').append($contestsInfo);

                XenForo.createOverlay(null, $modal, {
                    severalModals: true
                }).load();
            }
        })();
    `;

    // Создаём безопасный Blob URL, чтобы обойти CSP
    const blob = new Blob([scriptContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
})();
