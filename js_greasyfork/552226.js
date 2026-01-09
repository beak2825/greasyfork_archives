// ==UserScript==
// @name          open2ch バルサンアシスタント
// @namespace     https://greasyfork.org/ja/users/864059
// @version       1.4.9
// @description   おーぷん2chで!バルサンの予約投稿を支援し、他者によるバルサン投稿を検知して重複を防ぎます。
// @author        七色の彩り
// @match         https://*.open2ch.net/test/read.cgi/*
// @icon          https://open2ch.net/favicon.ico
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_listValues
// @grant         GM_registerMenuCommand
// @grant         GM_deleteValue
// @exclude       https://open.open2ch.net/test/ad.cgi/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/552226/open2ch%20%E3%83%90%E3%83%AB%E3%82%B5%E3%83%B3%E3%82%A2%E3%82%B7%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552226/open2ch%20%E3%83%90%E3%83%AB%E3%82%B5%E3%83%B3%E3%82%A2%E3%82%B7%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 定数設定 ---
    const DEFAULT_BASE_INTERVAL_HOURS = 72; // 初期値: バルサン使用の基本周期 (3日)
    const DEFAULT_WARNING_THRESHOLD_HOURS = 12; // 初期値: 期限が迫っていると警告を出す残り時間 (警告開始は72-12=60時間後)
    // 予約オフセット秒数
    const DEFAULT_RESERVATION_OFFSET_SECONDS = 1; // 初期値は1秒
    const RESERVATION_OFFSET_KEY = 'setting_reservation_offset_seconds';

    const SETTING_KEY_INTERVAL = 'setting_base_interval_hours';
    const SETTING_KEY_THRESHOLD = 'setting_warning_threshold_hours';
    const SETTING_KEY_OFFSET = RESERVATION_OFFSET_KEY;

    let BASE_INTERVAL_HOURS = DEFAULT_BASE_INTERVAL_HOURS; // 実際にロジックで使う変数
    let WARNING_THRESHOLD_HOURS = DEFAULT_WARNING_THRESHOLD_HOURS; // 実際にロジックで使う変数
    let RESERVATION_OFFSET_SECONDS = DEFAULT_RESERVATION_OFFSET_SECONDS; // 実際にロジックで使う変数
    let WARNING_START_HOURS = BASE_INTERVAL_HOURS - WARNING_THRESHOLD_HOURS; // 警告を開始する経過時間
    const VALSAN_COMMAND_REGEX = /!バルサン/i;
    const VALSAN_ACTIVATION_MESSAGE_REGEX = /★！荒らし撃退呪文『バルサン』発動！/i;
    const VALSAN_COLOR_KEYWORD = 'red';
    const VALSAN_CANCEL_MESSAGE_REGEX = /バルサンを解除した/i; // 解除を示す文言
    const VALSAN_CANCEL_COLOR_KEYWORD = 'darkgreen'; // 解除時の色
    // スクリプトの起動時に保存された設定を読み込む
    const storedTitles = GM_getValue('target_titles');
    let TARGET_TITLES = storedTitles ? storedTitles.split(' ') : [];

    // --- グローバル変数 ---
    let valsanObserver = null;
    let valsanAjaxCompleteListener = null;
    let checkvalsanTimeout = null;
    let editLastExecutedGroup = null;

    // --- 常に表示するメニューの登録 ---
    function registerAlwaysOnMenu() {
        GM_registerMenuCommand('対象スレッドタイトルの管理', manageTargetTitles);
        GM_registerMenuCommand('全ての保存データを削除', clearAllSavedData);
    }

    // --- スクリプト実行中にのみ表示するメニューの登録 ---
    function registerRunningMenu() {
        GM_registerMenuCommand("設定: バルサン周期, 警告, 予約時間", showSettingsDialog);
    }

    function manageTargetTitles() {
        const currentTitles = TARGET_TITLES.join('\n');
        const newTitles = prompt('対象スレッドのタイトルを半角スペースで区切って入力してください:', currentTitles);
        if (newTitles !== null) {
            // 新しいタイトルリストを作成
            const updatedTitles = newTitles.split('\n').map(title => title.trim()).filter(title => title);

            // グローバル変数 TARGET_TITLES を更新
            TARGET_TITLES = updatedTitles;

            // GM_setValueを使って設定値を保存
            GM_setValue('target_titles', updatedTitles.join(' ')); // 半角スペースで結合して保存

            alert('対象スレッドタイトルが更新されました。スクリプトを再読み込みしてください。');
            console.log('更新後の対象タイトル:', TARGET_TITLES);
        }
    }

    // --- 設定画面を表示し、変更を保存する関数 ---
    function showSettingsDialog() {
        const newInterval = prompt(
            `バルサン発動の基本周期を時間単位で入力してください (現在: ${BASE_INTERVAL_HOURS}h)\n\n例: 72 (3日), 24 (1日)`,
            BASE_INTERVAL_HOURS
        );

        // キャンセルまたは空の場合
        if (newInterval === null || newInterval.trim() === "") {
            return;
        }

        const intervalVal = parseFloat(newInterval);
        if (isNaN(intervalVal) || intervalVal <= 0) {
            alert('無効な値です。周期は0より大きい数値を入力してください。');
            return;
        }

        const newThreshold = prompt(
            `期限が迫っていると警告を出す残り時間を時間単位で入力してください (現在: ${WARNING_THRESHOLD_HOURS}h)\n\n例: 12 (残り12時間で警告), 24 (残り24時間で警告)`,
            WARNING_THRESHOLD_HOURS
        );

        // キャンセルまたは空の場合
        if (newThreshold === null || newThreshold.trim() === "") {
            return;
        }

        const thresholdVal = parseFloat(newThreshold);
        if (isNaN(thresholdVal) || thresholdVal <= 0) {
            alert('無効な値です。警告残り時間は0より大きい数値を入力してください。');
            return;
        }

        const newOffsetSeconds = prompt(
            `予約投稿のオフセット秒数を入力してください (現在: ${RESERVATION_OFFSET_SECONDS}秒)\n\n例: 1 (1秒), 5 (5秒)`,
            RESERVATION_OFFSET_SECONDS
        );

        // キャンセルまたは空の場合
        if (newOffsetSeconds === null || newOffsetSeconds.trim() === "") {
            return;
        }

        const offsetVal = parseInt(newOffsetSeconds);
        if (isNaN(offsetVal) || offsetVal < 1 || offsetVal > 60) {
            alert('無効な値です。オフセット秒数は1から60までの整数を入力してください。');
            return;
        }

        // 設定値の保存
        GM_setValue(SETTING_KEY_INTERVAL, intervalVal);
        GM_setValue(SETTING_KEY_THRESHOLD, thresholdVal);
        GM_setValue(SETTING_KEY_OFFSET, offsetVal);

        // UIとロジック変数に設定を適用
        loadSettings();
        updateUI();

        alert(`設定を更新しました！\n周期: ${BASE_INTERVAL_HOURS}時間\n警告開始: 期限${WARNING_THRESHOLD_HOURS}時間前\n予約オフセット: ${RESERVATION_OFFSET_SECONDS}秒`);
    }
    // --- 設定を読み込み、グローバル変数に適用する関数 ---
    function loadSettings() {
        // 期間設定を読み込み (数値として解析。無効な場合は初期値を使用)
        BASE_INTERVAL_HOURS = parseFloat(GM_getValue(SETTING_KEY_INTERVAL, DEFAULT_BASE_INTERVAL_HOURS));
        if (isNaN(BASE_INTERVAL_HOURS) || BASE_INTERVAL_HOURS <= 0) {
            BASE_INTERVAL_HOURS = DEFAULT_BASE_INTERVAL_HOURS;
        }

        // 警告時間設定を読み込み (数値として解析。無効な場合は初期値を使用)
        WARNING_THRESHOLD_HOURS = parseFloat(GM_getValue(SETTING_KEY_THRESHOLD, DEFAULT_WARNING_THRESHOLD_HOURS));
        if (isNaN(WARNING_THRESHOLD_HOURS) || WARNING_THRESHOLD_HOURS <= 0) {
            WARNING_THRESHOLD_HOURS = DEFAULT_WARNING_THRESHOLD_HOURS;
        }

        // オフセット秒数の読み込み
        RESERVATION_OFFSET_SECONDS = parseInt(GM_getValue(SETTING_KEY_OFFSET, DEFAULT_RESERVATION_OFFSET_SECONDS));
        if (isNaN(RESERVATION_OFFSET_SECONDS) || RESERVATION_OFFSET_SECONDS < 0) {
            RESERVATION_OFFSET_SECONDS = DEFAULT_RESERVATION_OFFSET_SECONDS;
        }

        // 警告開始時間を再計算
        WARNING_START_HOURS = BASE_INTERVAL_HOURS - WARNING_THRESHOLD_HOURS;

        console.log(`バルサンアシスタント: 設定を読み込みました (周期: ${BASE_INTERVAL_HOURS}h, 警告残り時間: ${WARNING_THRESHOLD_HOURS}h, オフセット: ${RESERVATION_OFFSET_SECONDS}s)`);
    }

    // 古いデータを自動削除する関数
    function autoDeleteOldData() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const keys = GM_listValues();
        keys.forEach(key => {
            // キーが最終実行日時データまたは予約データであることを確認
            if (key.startsWith('lastExecutedAt_') || key.startsWith('reservationDate_')) {
                const dateString = GM_getValue(key);
                if (dateString) {
                    const dateObj = new Date(dateString);

                    // 1ヶ月以上前のデータであれば削除
                    if (dateObj < oneMonthAgo) {
                        GM_deleteValue(key);
                        console.log(`古いデータが自動削除されました: ${key}`);

                        // 削除対象キーからスレッドIDを抽出
                        const prefix = key.startsWith('lastExecutedAt_') ? 'lastExecutedAt_' : 'reservationDate_';
                        const extractedThreadId = key.substring(prefix.length);

                        // 対になる lastPostCount_ も削除する
                        if (extractedThreadId) {
                            const postCountKey = `lastPostCount_${extractedThreadId}`;

                            // 投稿数データが存在するかを確認し、あれば削除
                            if (GM_getValue(postCountKey) !== undefined) {
                                GM_deleteValue(postCountKey);
                                console.log(`連動して投稿数データが削除されました: ${postCountKey}`);
                            }
                        }
                    }
                }
            }
        });
    }

    // 全てのスクリプト保存データを削除する関数
    function clearAllSavedData() {
        if (confirm('全てのバルサンアシスタントの保存データを削除しますか？\n（最終実行日時、予約投稿など）')) {
            GM_listValues().forEach(key => {
                GM_deleteValue(key);
            });
            alert('保存データを全て削除しました。ページを再読み込みします。');
            location.reload();
        }
    }

    // --- 掲示板パラメータを取得するヘルパー関数 ---
    function getBbsParams() {
        const currentPathname = window.location.pathname;
        let boardId = null;
        let threadId = null;
        const pathSegments = currentPathname.split('/').filter(s => s);
        if (pathSegments.length >= 4 && pathSegments[0] === 'test' && pathSegments[1] === 'read.cgi') {
            boardId = pathSegments[2];
            threadId = pathSegments[3];
        } else {
            try {
                if (typeof window.bbs !== 'undefined') {
                    boardId = window.bbs;
                }
                if (typeof window.key !== 'undefined') {
                    threadId = window.key;
                } else if (typeof window.bbskey !== 'undefined') {
                    threadId = window.bbskey;
                }
            } catch (e) {
                console.warn(`バルサンアシスタント: グローバル変数bbs/key/bbskeyの取得中にエラー:`, e);
            }
        }
        return { bbs: boardId, key: threadId };
    }

    // 現在のスレッドIDを取得する
    function getCurrentThreadId() {
        const threadIdMatch = window.location.href.match(/\/(\d+)(?:\/.*)?$/);
        return threadIdMatch ? threadIdMatch[1] : null;
    }

    // UIの色をライト/ダークテーマに合わせて調整する関数
    function adjustUIColorsForTheme() {
        const isDarkReaderActive = $('html').css('background-color') === 'rgb(24, 26, 27)'; // Dark Readerのデフォルトの背景色
        const ui = $('#valsanAssistantUI');
        const summary = $('#valsanSummaryDisplay');

        if (isDarkReaderActive) {
            // ダークテーマ用のスタイル
            ui.css({
                'background-color': 'rgba(0, 0, 0, 0.7)',
                'color': '#f0f0f0', // 明るい白
                'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.4)'
            });
            summary.css('color', '#89b4f6'); // 明るい青
            ui.find('p, label').css('color', '#f0f0f0'); // pとlabel要素も明るい色に
        } else {
            // ライトテーマ用のスタイル
            ui.css({
                'background-color': 'rgb(255, 255, 255)',
                'opacity': '0.9',
                'color': 'black',
            });
            summary.css('color', '#0056b3'); // 濃い青
            ui.find('p, label').css('color', 'black');
        }
    }
    // --- UI要素を生成し、ページに追加する関数 ---
    function createUI() {
        if ($('#valsanAssistantUI').length > 0) {
            // UIが存在しない場合は何もしない (または createUI() を呼ぶ)
            return;
        }

        const threadId = getCurrentThreadId();
        if (!threadId) {
            console.error('バルサンアシスタント: スレッドIDが取得できませんでした。UIを生成できません。');
            return;
        }

        const uiContainer = $('<div>', {
            id: 'valsanAssistantUI',
            css: {
                position: 'fixed',
                top: '33px',
                right: '10px',
                zIndex: '21',
                border: '0.1px solid rgb(204, 204, 204)',
                borderRadius: '3px',
                padding: '3px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                width: 'auto',
                maxWidth: '280px',
                cursor: 'pointer'
            }
        });

        const summaryDisplay = $('<div>', {
            id: 'valsanSummaryDisplay',
            css: {
                fontWeight: 'bold',
                color: '#0056b3',
                fontSize: '10px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        });
        uiContainer.append(summaryDisplay);

        const detailContent = $('<div>', {
            id: 'valsanDetailContent',
            css: {
                display: 'none',
                marginTop: '5px',
                paddingTop: '5px',
                borderTop: '1px solid #eee',
                fontSize: '12px'
            }
        });

        // 最終投稿日時表示
        const lastExecutedDisplay = $('<p>', {
            id: 'lastExecutedDisplay',
            text: '最終投稿: 未定',
            css: { marginBottom: '5px' }
        });
        detailContent.append(lastExecutedDisplay);

        // 秒調整ボタンのグループ
        const secondAdjustmentGroup = $('<div>', {
            css: {
                marginTop: '10px',
                paddingTop: '5px',
                borderTop: '1px solid #eee'
            }
        }).append(
            $('<span>', {
                text: '秒数調整:',
                css: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                }
            }),
            // +1秒 ボタン
            $('<button>', {
                text: '+1秒',
                css: {
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginRight: '5px',
                    marginBottom: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    adjustTimeBySeconds(1);
                }
            }),
            // -1秒 ボタン
            $('<button>', {
                text: '-1秒',
                css: {
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginRight: '5px',
                    marginBottom: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    adjustTimeBySeconds(-1);
                }
            }),
            // +10秒 ボタン (オプション)
            $('<button>', {
                text: '+10秒',
                css: {
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginRight: '5px',
                    marginBottom: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    adjustTimeBySeconds(10);
                }
            }),
            // -10秒 ボタン (オプション)
            $('<button>', {
                text: '-10秒',
                css: {
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginRight: '5px',
                    marginBottom: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    adjustTimeBySeconds(-10);
                }
            })
        );

        // 最終投稿日時編集グループ（初期状態は非表示）
        editLastExecutedGroup = $('<div>', {
            css: {
                display: 'none',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginTop: '10px',
                backgroundColor: '#f9f9f9',
                maxWidth: '250px'
            }
            }).on('click', function(e) {
                e.stopPropagation();
        }).append(
            $('<label>', {
                text: '日時を編集:',
                css: {
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            }),
            $('<input>', {
                type: 'datetime-local',
                id: 'editLastExecutedDatetimeInput',
                css: {
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    boxSizing: 'border-box',
                    fontSize: '12px'
                }
            }),
            $('<button>', {
                text: '設定',
                css: {
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginTop: '5px',
                    marginLeft: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    const dateValFromInput = $('#editLastExecutedDatetimeInput').val();

                    if (dateValFromInput) {
                        const tempDateFromInput = new Date(dateValFromInput);
                         if (isNaN(tempDateFromInput.getTime())) {
                            alert('無効な日時形式です。');
                            return;
                        }

                        // スレッドIDを取得
                        const threadId = getCurrentThreadId();
                        const lastExecuted = GM_getValue(`lastExecutedAt_${threadId}`);
                        let dateToSave;
                        if (lastExecuted) {
                            const storedDateObj = new Date(lastExecuted);
                            if (!isNaN(storedDateObj.getTime())) {
                                dateToSave = new Date(
                                    tempDateFromInput.getFullYear(),
                                    tempDateFromInput.getMonth(),
                                    tempDateFromInput.getDate(),
                                    tempDateFromInput.getHours(),
                                    tempDateFromInput.getMinutes(),
                                    storedDateObj.getSeconds(),
                                    storedDateObj.getMilliseconds()
                                );
                            } else {
                                dateToSave = tempDateFromInput;
                            }
                        } else {
                            dateToSave = tempDateFromInput;
                        }

                        if (isNaN(dateToSave.getTime())) {
                            alert('無効な日時形式です。');
                            return;
                        }

                        // スレッドIDをキーに保存
                        GM_setValue(`lastExecutedAt_${threadId}`, dateToSave.toISOString());
                        updateUI();
                        editLastExecutedGroup.slideUp('fast');
                        toggleEditButton.text('最終投稿を編集');
                        alert('最終投稿日時を編集しました。');

                    } else {
                        alert('編集する日時を入力してください。');
                    }
                }
            }),
            secondAdjustmentGroup // ここにsecondAdjustmentGroupをappendする
        );
        detailContent.append(editLastExecutedGroup); // この行は変更なし

        // 「最終投稿を編集」ボタン (編集UIの表示/非表示切り替え用)
        const toggleEditButton = $('<button>', {
            // 外側クリック時のためのID
            id: 'toggleEditButtonId',
            text: '最終投稿を編集',
            css: {
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 8px',
                cursor: 'pointer',
                fontSize: '11px',
                marginTop: '5px',
                marginBottom: '5px'
            },
            click: function(e) {
                e.stopPropagation();
                // ボタンクリック時のトグルとテキスト変更
                editLastExecutedGroup.slideToggle('fast', function() {
                    // 編集UIが開いているかどうかでテキストを変更
                    const isVisible = editLastExecutedGroup.is(':visible');
                    $(e.currentTarget).text(isVisible ? '編集を隠す' : '最終投稿を編集');

                    if (isVisible) {
                        // スレッドIDを取得
                        const threadId = getCurrentThreadId();
                        if (!threadId) {
                            alert('スレッドIDを取得できませんでした。');
                            return;
                        }
                        const lastExecuted = GM_getValue(`lastExecutedAt_${threadId}`);
                        if (lastExecuted) {
                            const lastDateObj = new Date(lastExecuted);
                            $('#editLastExecutedDatetimeInput').val(toLocalDatetimeString(lastDateObj, true));
                        } else {
                            $('#editLastExecutedDatetimeInput').val('');
                        }
                    }
                });
            }
        });
        detailContent.append(toggleEditButton);

        const reservationOffsetSeconds = GM_getValue(RESERVATION_OFFSET_KEY, DEFAULT_RESERVATION_OFFSET_SECONDS);
        const baseIntervalHours = GM_getValue(SETTING_KEY_INTERVAL, DEFAULT_BASE_INTERVAL_HOURS);
        const days = Math.floor(baseIntervalHours / 24);
        const hours = baseIntervalHours % 24;
        const intervalText = `${days}日${hours > 0 ? hours + '時間' : ''}`;
        const buttonText = `予約を設定 (${intervalText}+${reservationOffsetSeconds}秒)`;

        // 予約投稿日時表示と設定
        const reservationGroup = $('<div>').append(
            $('<p>', { id: 'reservationDisplay', text: '予約投稿: 未設定', css: { marginBottom: '5px' } }),
            $('<button>', {
                id: 'setReservationButton',
                text: buttonText,
                css: {
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    marginRight: '5px',
                    fontSize: '11px',
                    marginTop: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    const threadId = getCurrentThreadId();
                    const lastExecuted = GM_getValue(`lastExecutedAt_${threadId}`);
                    if (lastExecuted) {
                        const lastExecutedDate = new Date(lastExecuted);
                        // 📅 周期時間 (〇日〇時間) を加算
                        lastExecutedDate.setHours(lastExecutedDate.getHours() + baseIntervalHours);
                        // ⏱️ オフセット秒数の設定値を利用
                        lastExecutedDate.setSeconds(lastExecutedDate.getSeconds() + reservationOffsetSeconds);
                        GM_setValue(`reservationDate_${threadId}`, lastExecutedDate.toISOString());
                        updateUI();
                    } else {
                        alert('最終投稿日時が未設定のため、自動予約を設定できません。');
                    }
                }
            }),
            $('<button>', {
                text: '予約をクリア',
                css: {
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginTop: '5px'
                },
                click: function(e) {
                    e.stopPropagation();
                    const threadId = getCurrentThreadId();
                    GM_deleteValue(`reservationDate_${threadId}`);
                    updateUI();
                    alert('予約投稿をクリアしました。');
                }
            })
        );
        detailContent.append(reservationGroup);

        uiContainer.append(detailContent);

        // UIコンテナ全体のクリックイベント (詳細の表示/非表示切り替え)
        uiContainer.on('click', function() {
            // 【変更箇所】詳細UIが現在表示されている場合（＝閉じるとき）の処理
            if (detailContent.is(':visible')) {
                // 編集UIが開いている場合は一緒に閉じ、ボタンテキストをリセット
                if (editLastExecutedGroup.is(':visible')) {
                    editLastExecutedGroup.slideUp('fast');
                    // toggleEditButton はこのスコープ内で定義されたローカル変数なのでアクセス可能
                    toggleEditButton.text('最終投稿を編集');
                }
            }
            detailContent.slideToggle('fast');
        });

        $('body').append(uiContainer);
        // UIの外側をクリックしたときに詳細を非表示にする
        $(document).on('click', function(e) {
            const uiContainer = $('#valsanAssistantUI');
            // クリックされた要素がUIコンテナ内になかった場合
            if (!uiContainer.is(e.target) && uiContainer.has(e.target).length === 0) {
                const detailContent = uiContainer.find('#valsanDetailContent');
                const editGroup = editLastExecutedGroup; // グローバル/外側スコープの変数を使用

                // 【変更箇所】詳細が閉じるとき、編集UIも一緒に閉じる
                if (detailContent.is(':visible') && editGroup.is(':visible')) {
                    editGroup.slideUp('fast');
                    // ボタンテキストをリセット (ID経由でアクセス)
                    $('#toggleEditButtonId').text('最終投稿を編集');
                }

                detailContent.slideUp('fast');
            }
        });
        updateUI();
        adjustUIColorsForTheme();
    }
    // --- UIを更新する関数 ---
    function updateUI() {
        // 1. スレッドIDとタイトルを取得
        const threadId = getCurrentThreadId();
        const currentThreadTitle = document.title;
        if (!threadId) return; // スレッドIDが取得できない場合は処理を中断

        // 2. スレッドIDを元にデータを取得
        const lastExecuted = GM_getValue(`lastExecutedAt_${threadId}`);
        const reservationDate = GM_getValue(`reservationDate_${threadId}`);

        const now = new Date();
        let summaryText = 'バルサンアシスタント'; // Default
        let summaryColor = '#0056b3'; // Default color (blue)

        let lastExecutedDate = null;
        let diffHours = null;

        if (lastExecuted) {
            lastExecutedDate = new Date(lastExecuted);
            diffHours = (now.getTime() - lastExecutedDate.getTime()) / (1000 * 60 * 60);

            // 予約投稿が設定されている場合は警告を表示しない
            if (reservationDate) {
                summaryText = `最終実行: ${formatDateTimeShort(lastExecutedDate)}`;
                summaryColor = '#0056b3'; // Default blue
            } else if (diffHours >= BASE_INTERVAL_HOURS) {
                summaryText = `⛔ バルサン期限を${Math.floor(diffHours - BASE_INTERVAL_HOURS)}時間超過！`;
                summaryColor = '#dc3545'; // Red
            } else if (diffHours >= WARNING_START_HOURS) {
            summaryText = '⚠️ バルサン期限が迫ってます！';
                summaryColor = '#ffc107'; // Yellow
            } else {
                summaryText = `最終実行: ${formatDateTimeShort(lastExecutedDate)}`;
                // summaryColor remains default blue
            }
        } else {
            summaryText = '最終実行: 未定';
            // summaryColor remains default blue
        }

        // Append last executed time if a warning is present
        if (lastExecutedDate && (summaryText.startsWith('⛔') || summaryText.startsWith('⚠️'))) {
            summaryText += ` (${formatDateTimeShort(lastExecutedDate)})`;
        }

        if (reservationDate) {
            const reservationDt = new Date(reservationDate);
            summaryText += ` / 予約: ${formatDateTimeShort(reservationDt)}`;
        }

        $('#valsanSummaryDisplay').text(summaryText).css('color', summaryColor);

        $('#lastExecutedDisplay').text(`最終投稿: ${lastExecuted ? formatDateTime(new Date(lastExecuted)) : '未定'}`);
        $('#reservationDisplay').text(`予約投稿: ${reservationDate ? formatDateTime(new Date(reservationDate)) : '未設定'}`);

        // 予約ボタンのテキストを更新
        // 1. 最新の設定値をGM_getValueから直接取得
        const currentOffsetSeconds = GM_getValue(SETTING_KEY_OFFSET, DEFAULT_RESERVATION_OFFSET_SECONDS);
        const currentIntervalHours = GM_getValue(SETTING_KEY_INTERVAL, DEFAULT_BASE_INTERVAL_HOURS);

        // 2. ボタンテキストを再計算
        const days = Math.floor(currentIntervalHours / 24);
        const hours = currentIntervalHours % 24;
        const intervalText = `${days}日${hours > 0 ? hours + '時間' : ''}`;

        let newButtonText;
        let newButtonColor = '#007bff'; // デフォルトの青

        // ボタンテキストの動的変更
        // diffHoursが計算されており、期限切れをチェックできる
        // reservationDateが設定されていない かつ 期限を過ぎている (diffHours >= BASE_INTERVAL_HOURS) 場合
        if (!reservationDate && diffHours !== null && diffHours >= BASE_INTERVAL_HOURS) {
            newButtonText = `今すぐバルサン実行 (${intervalText}+${currentOffsetSeconds}秒)`;
            newButtonColor = '#28a745'; // 緑色 (実行可能を強調)
        } else {
            // 通常時または予約設定済み
            newButtonText = `予約を設定 (${intervalText}+${currentOffsetSeconds}秒)`;
            newButtonColor = '#007bff';
        }

        // 3. 予約設定ボタンのテキストと色を更新
        $('#setReservationButton')
            .text(newButtonText)
            .css('background-color', newButtonColor); // 💡 背景色も更新する

        adjustUIColorsForTheme();
        // 次回の更新間隔を決定する
        let nextInterval = 1000 * 60; // 基本は1分

        // 超過しているかチェック (diffHours が BASE_INTERVAL_HOURS を超えていたら)
        if (diffHours !== null && diffHours >= BASE_INTERVAL_HOURS) {
            nextInterval = 1000 * 60 * 60; // 超過後は1時間おき
            console.log(`バルサンアシスタント: 超過中のため、次回のUI更新は1時間後です。`);
        }

        // 既存のタイマーがあれば一度クリアして再設定
        if (window.valsanUITimer) clearTimeout(window.valsanUITimer);
        window.valsanUITimer = setTimeout(updateUI, nextInterval);
    }

    // --- 予約を設定する関数 ---
    function setReservation(datetimeString) {
        if (!datetimeString) {
            alert('予約日時を入力してください。');
            return;
        }
        const selectedDate = new Date(datetimeString);
        if (isNaN(selectedDate.getTime())) {
            alert('無効な日時形式です。');
            return;
        }

        const now = new Date();
        if (selectedDate <= now) {
            alert('予約日時は現在時刻より未来に設定してください。');
            return;
        }

        const threadId = getCurrentThreadId(); // スレッドIDを取得
        if (!threadId) {
            alert('スレッドIDを取得できませんでした。');
            return;
        }

        // 新しい形式で予約日時を保存
        GM_setValue(`reservationDate_${threadId}`, selectedDate.toISOString());

        startMonitoringNewPosts();
        updateUI();
        alert(`予約投稿を ${formatDateTime(selectedDate)} に設定しました。`);
    }

    // --- 投稿内のバルサンを検知するヘルパー関数 ---
    function detectValsanPost(postElement) {
        // 1. 投稿内容全体のテキストを、前後の空白や改行を厳密に除去して取得
        const wholeText = postElement.text().replace(/^[\s\n]+|[\s\n]+$/g, '');

        // 2. 赤色のfontタグが存在するかをチェック
        const hasRedFont = postElement.find(`font[color="${VALSAN_COLOR_KEYWORD}"]`).length > 0;

        // 3. 投稿全体から "!バルサン" の文字列があるかをチェック（大文字小文字を区別せず）
        const hasCommand = wholeText.toLowerCase().includes('!バルサン');

        // 4. 赤色のfontタグ内に指定のメッセージがあるかをチェック（大文字小文字を区別せず）
        const hasCorrectMessageInFont = postElement.find(`font[color="${VALSAN_COLOR_KEYWORD}"]`).filter(function() {
            const fontText = $(this).text().trim().toLowerCase();
            return fontText.includes('荒らし撃退呪文『バルサン』発動！'.toLowerCase());
        }).length > 0;

        // 全ての条件を満たす場合、バルサン投稿と判定
        return hasCommand && hasRedFont && hasCorrectMessageInFont;
    }
    // --- 与えられた要素の中からバルサン投稿を検知し、最終実行日時を更新する関数 ---
    function checkValsanInElements(elements) {
        const threadId = getCurrentThreadId();
        if (!threadId) return false; // スレッドIDが取得できない場合は処理を中断

        const currentThreadTitle = document.title;
        let updated = false;
        const postsToCheck = elements && elements.length > 0 ? elements : $('dd.mesg.body');
        const existingLastDateStr = GM_getValue(`lastExecutedAt_${threadId}`);
        const existingLastDate = existingLastDateStr ? new Date(existingLastDateStr) : null;


        postsToCheck.each(function() {
            const postElement = $(this);
            if (detectValsanPost(postElement)) {
                const parentDt = postElement.prev('dt');
                const dtText = parentDt.text();

                // 年、月、日、時、分、秒を抽出する正規表現
                const dateMatch = dtText.match(/(\d{2})\/(\d{2})\/(\d{2})\(.+\)\s+(\d{2}):(\d{2}):(\d{2})/);

                let detectedValsanDate = null;
                if (dateMatch) {
                    const [, year, month, day, hour, minute, second] = dateMatch;
                    detectedValsanDate = new Date(`20${year}-${month}-${day}T${hour}:${minute}:${second}`);
                }

                if (detectedValsanDate && !isNaN(detectedValsanDate.getTime())) {
                    const existingLastDateStr = GM_getValue(`lastExecutedAt_${threadId}`);
                    const existingLastDate = existingLastDateStr ? new Date(existingLastDateStr) : null;

                    if (!existingLastDate || detectedValsanDate > existingLastDate) {
                        // スレッドIDをキーとしてデータを保存
                        GM_setValue(`lastExecutedAt_${threadId}`, detectedValsanDate.toISOString());
                        console.log('バルサンアシスタント: 新しいバルサン発動を検知し、最終実行日時を更新しました。');

                        // 予約設定があれば自動でクリアする
                        const reservationDate = GM_getValue(`reservationDate_${threadId}`);
                        if (reservationDate) {
                            GM_deleteValue(`reservationDate_${threadId}`);
                            console.log('バルサンアシスタント: 新しいバルサン検知に伴い、予約投稿を自動クリアしました。');
                        }

                        updated = true;
                        updateUI();
                    }
                }
            }
            // バルサン発動がなかった場合に、解除投稿をチェック
            else if (detectValsanCancelPost(postElement)) {

                // 発動時と同様に日時を取得する
                const parentDt = postElement.prev('dt');
                const dtText = parentDt.text();
                const dateMatch = dtText.match(/(\d{2})\/(\d{2})\/(\d{2})\(.+\)\s+(\d{2}):(\d{2}):(\d{2})/);

                let detectedCancelDate = null;
                if (dateMatch) {
                    const [, year, month, day, hour, minute, second] = dateMatch;
                    detectedCancelDate = new Date(`20${year}-${month}-${day}T${hour}:${minute}:${second}`);
                }

                // 日時が取得できて、かつそれが既存の最終実行日時よりも新しい場合のみリセット
                if (detectedCancelDate && !isNaN(detectedCancelDate.getTime())) {
                    const existingLastDateStr = GM_getValue(`lastExecutedAt_${threadId}`);
                    const existingLastDate = existingLastDateStr ? new Date(existingLastDateStr) : null;

                    if (!existingLastDate || detectedCancelDate > existingLastDate) {
                        // 最終実行日時を削除し、予約も削除する（強制リセット）
                        GM_deleteValue(`lastExecutedAt_${threadId}`);
                        GM_deleteValue(`reservationDate_${threadId}`);

                        console.log('バルサンアシスタント: 新しいバルサン解除投稿を検知しました。最終実行日時と予約をリセットします。');

                        updated = true;
                        updateUI();
                    }
                }
            }
        });
        return updated;
    }
    // --- バルサンを実行する関数 ---
    // 予約投稿から呼ばれる場合、threadId と reservationDate が渡される
    async function executevalsan(threadId = null, reservationDate = null) {
        // 現在のスレッドIDが引数にない場合は取得する
        const currentThreadId = threadId || getCurrentThreadId();
        const bbsParams = getBbsParams();
        const currentThreadTitle = document.title;

        if (!bbsParams.bbs || !bbsParams.key || !currentThreadId) {
            console.error('バルサンアシスタント: 掲示板パラメータ(bbs/key)またはスレッドIDを特定できませんでした。バルサンを投稿できません。', bbsParams);
            if (!threadId) {
                alert('掲示板の情報を取得できないため、バルサンを投稿できませんでした。');
            }
            if (reservationDate) {
                GM_deleteValue(`reservationDate_${currentThreadId}`);
            }
            return;
        }

        // 予約投稿の場合のみ予約データを削除
        if (reservationDate) {
            GM_deleteValue(`reservationDate_${currentThreadId}`);
        }

        const initialPostCount = $('dl > dt').length;

        $.ajax({
            type: 'POST',
            url: '/test/bbs.cgi',
            data: {
                MESSAGE: '!バルサン',
                bbs: bbsParams.bbs,
                key: bbsParams.key,
                submit: '書',
                mode: 'ajax'
            },
            success: function(responseText, textStatus, jqXHR) {
                const levelErrorMatch = responseText.match(/残念無念。バルサンはlv3以上じゃないと使えぬい。/);

                if (levelErrorMatch) {
                    console.error(`%c!バルサン の自動投稿に失敗しました: 権限不足 (ユーザーレベルがlv3未満)。予約を解除しました。`, 'color: red;');
                    // サーバー側のエラーメッセージをそのまま表示し、予約解除を明記
                    const errorMessage = levelErrorMatch[0] || 'バルサン投稿に失敗: 権限不足';
                    showNotification('予約投稿失敗: ' + errorMessage + '\n\n【予約は自動的に解除されました】', true);

                    // 権限不足は致命的なエラーなので、予約を強制解除
                    GM_deleteValue(`reservationTime_${currentThreadId}`);
                    // UIを更新し、予約が解除されたことをユーザーに伝える
                    updateUI();

                } else {
                    // サーバーレスポンスから「success:N:タイムスタンプ」のN部分を確実に検知する正規表現
                    const valsanSuccessResponseMatch = responseText.match(/success:(\d+):\d+/);

                    if (valsanSuccessResponseMatch) {
                        const ownPostNumber = parseInt(valsanSuccessResponseMatch[1], 10);
                        console.log(`バルサンアシスタント: サーバーから自分の投稿番号を検知: ${ownPostNumber} (バルサン成功)`);

                        GM_setValue(`lastExecutedAt_${currentThreadId}`, new Date().toISOString());
                        updateUI();
                    } else {
                        console.error('バルサンアシスタント: 投稿リクエストは成功しましたが、サーバーからの投稿番号検知に失敗しました。不発の可能性があります。', responseText);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(`%c!バルサン の送信に失敗しました: ${textStatus}, ${errorThrown}`, 'color: red;');
                alert(`バルサンの投稿に失敗しました。\nエラー: ${textStatus}, ${errorThrown}\nコンソールをご確認ください。`);
            }
        });
    }

    // 通知を表示するヘルパー関数を定義（確認ボタンを押すまで永続的に表示）
    function showNotification(message, isError = false) {
        const notificationId = 'valsan-assistant-notification';
        let notificationElement = document.getElementById(notificationId);

        // 既存の通知があれば一旦削除（新しい通知が上書きされるため）
        if (notificationElement) {
            notificationElement.remove();
            notificationElement = null;
        }

        notificationElement = document.createElement('div');
        notificationElement.id = notificationId;

        // スタイル設定
        notificationElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 15px;
            background-color: ${isError ? '#CC3333' : '#3333CC'}; /* 赤色で強調 */
            color: white;
            z-index: 99999;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            max-width: 300px;
            text-align: left;
            line-height: 1.5;
            opacity: 0; /* 初期非表示 */
            transition: opacity 0.3s ease-in-out;
        `;

        // メッセージ部分
        const messageP = document.createElement('p');
        messageP.style.margin = '0 0 10px 0';
        messageP.textContent = message;

        // 確認ボタン
        const dismissButton = document.createElement('button');
        dismissButton.textContent = '確認 (OK)';
        dismissButton.style.cssText = `
            display: block;
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            background-color: ${isError ? '#FF5555' : '#5555FF'};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        `;

        // 確認ボタンクリック時の動作（フェードアウトさせて削除）
        dismissButton.onclick = () => {
            notificationElement.style.opacity = '0';
            setTimeout(() => {
                notificationElement.remove();
            }, 300);
        };

        notificationElement.appendChild(messageP);
        notificationElement.appendChild(dismissButton);

        document.body.appendChild(notificationElement);

        // 表示（フェードイン）
        setTimeout(() => {
            notificationElement.style.opacity = '1';
        }, 10);
    }

    // --- バルサン解除投稿を検知する関数 ---
    function detectValsanCancelPost(postElement) {
        // 1. ダークグリーン文字の確認
        const hasDarkGreenFont = postElement.find(`font[color="${VALSAN_CANCEL_COLOR_KEYWORD}"]`).length > 0;

        if (!hasDarkGreenFont) {
            return false;
        }

        // 2. 「バルサンを解除した」の文言確認
        const hasCancelMessage = VALSAN_CANCEL_MESSAGE_REGEX.test(postElement.text());

        return hasCancelMessage;
    }

    // --- 予約時刻をチェックし、実行する関数 ---
    async function checkAndExecuteReservation() {
        const threadId = getCurrentThreadId();
        if (!threadId) return;

        const reservationDateStr = GM_getValue(`reservationDate_${threadId}`);

        if (reservationDateStr) {
            const reservationDate = new Date(reservationDateStr);
            const now = new Date();

            if (now >= reservationDate) {
                console.log(`%cバルサンアシスタント: 予約時刻 (${formatDateTime(reservationDate)}) になりました。バルサンを投稿します。`, 'color: green; font-weight: bold;');
                await executevalsan(threadId, reservationDate);
            }
        }
    }

    // --- 新着投稿を監視する関数 ---
    function startMonitoringNewPosts() {
        // 監視対象を dl の親要素に変更 (仮に dl の前の要素の親と想定)
        // ページ全体（body）を監視するか、レスリストの最も安定した親を監視するのが確実
        // ここでは、dlの親である document.body を監視対象とします
        const targetNode = document.body;

        if (!targetNode) {
            console.error('バルサンアシスタント: 新規投稿監視の対象ノードが見つかりませんでした。');
            return;
        }

        // MutationObserverの設定（子要素の追加のみを監視）
        const config = { childList: true, subtree: true }; // subtree:trueを追加！

        const callback = function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {

                    let newPosts = $(); // 新しい投稿要素を格納する空のjQueryオブジェクト

                    // 追加されたノードリストを反復処理し、find()で子孫要素を検索する
                    $(mutation.addedNodes).each(function() {
                        // 追加されたノード（例: <dl>）と、その子孫の中から dd.mesg.body を検索
                        newPosts = newPosts.add($(this).find('dd.mesg.body'));

                        // また、ノード自体が dd.mesg.body である可能性も考慮
                        if ($(this).is('dd.mesg.body')) {
                            newPosts = newPosts.add(this);
                        }
                    });

                    if (newPosts.length > 0) {
                        //console.log(`バルサンアシスタント: 新しい投稿を${newPosts.length}件検知。`);
                        checkValsanInElements(newPosts);

                        // 新しい投稿を検知した後、現在の投稿数を最新として保存し直す
                        const threadId = getCurrentThreadId();
                        const currentTotalPosts = $('dl > dt').length;
                        GM_setValue(`lastPostCount_${threadId}`, currentTotalPosts);
                        //console.log(`バルサンアシスタント: 新しい投稿を検知したため、lastPostCountを ${currentTotalPosts} に更新しました。`);
                    }
                }
            });
        };

        valsanObserver = new MutationObserver(callback);
        valsanObserver.observe(targetNode, config);
        console.log('バルサンアシスタント: 新着投稿の監視を開始しました。');
    }

    // --- 日時フォーマットヘルパー関数 ---
    function formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    function formatDateTimeShort(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes}`;
    }

    function toLocalDatetimeString(date, showSeconds = false) {
        if (!date || isNaN(date.getTime())) {
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        if (showSeconds) {
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        } else {
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }
    }

    // 秒調整ロジック
    function adjustTimeBySeconds(seconds) {
        // スレッドIDをここで取得
        const threadId = getCurrentThreadId();
        if (!threadId) {
            console.error('バルサンアシスタント: スレッドIDが取得できませんでした。');
            return;
        }

        // スレッドIDをキーに直接データを取得
        const lastExecuted = GM_getValue(`lastExecutedAt_${threadId}`);
        let dateObj;

        if (lastExecuted) {
            dateObj = new Date(lastExecuted);
            if (isNaN(dateObj.getTime())) {
                console.warn("バルサンアシスタント: 保存された最終実行日時が無効なため、現在時刻を使用します。");
                dateObj = new Date();
            }
        } else {
            dateObj = new Date();
        }

        dateObj.setSeconds(dateObj.getSeconds() + seconds);

        const newIsoString = dateObj.toISOString();
        // スレッドIDをキーにデータを保存
        GM_setValue(`lastExecutedAt_${threadId}`, newIsoString);

        updateUI();

        if (editLastExecutedGroup && editLastExecutedGroup.is(':visible')) {
            const newLocalDatetimeString = toLocalDatetimeString(dateObj, true);
            $('#editLastExecutedDatetimeInput').val(newLocalDatetimeString);
        }
    }

    // --- メイン処理 ---
    function initialize() {
            // スレッドIDを取得
        const threadId = getCurrentThreadId();
        // スクリプトが実行される全てのページで、まず常に表示するメニューを登録する
        if (typeof GM_registerMenuCommand !== 'undefined') {
            registerAlwaysOnMenu(); // 対象外のページでも、これとデータ削除は表示
        }

        // スレッドページ以外ではスクリプトを中断する
        if (!threadId) {
            console.log('スレッドページではないため、バルサンアシスタントは起動しません。');
            return;
        }
        loadSettings();

        autoDeleteOldData();
        const threadTitleElement = document.querySelector('title');
        let currentTitle = '';

        if (threadTitleElement) {
            currentTitle = threadTitleElement.textContent || '';
        }

        const urlMatches = TARGET_TITLES.some(title => currentTitle.includes(title));

        if (urlMatches) {
            // 実行中の場合のみ、設定メニューを登録する
            if (typeof GM_registerMenuCommand !== 'undefined') {
                registerRunningMenu();
            }
            if (typeof jQuery === 'undefined') {
                console.log('バルサンアシスタント: jQueryがまだロードされていません。ロードを待機します。');
                setTimeout(initialize, 100);
                return;
            }
            console.log('Open2ch バルサンアシスタントを起動します。');
            createUI();
            updateUI();
            setInterval(checkAndExecuteReservation, 1000 * 1);
            checkAndExecuteReservation();

            // ページ読み込み完了後、少し遅延させて全投稿をチェック
            setTimeout(() => {
                const existingPosts = $('dd.mesg.body');
                console.log(`バルサンアシスタント: 取得した既存投稿数: ${existingPosts.length}`);
                console.log('バルサンアシスタント: スクリプト起動時に既存の投稿をチェックします。');
                checkValsanInElements(existingPosts);
            }, 1000); // 1秒遅延

            startMonitoringNewPosts();
        } else {
            console.log('対象外のスレッドタイトルのため、Open2ch バルサンアシスタントは起動しません。');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();