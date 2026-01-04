// ==UserScript==
// @name        あにまん民強化パッチ(β版)
// @namespace   http://tampermonkey.net/
// @version     1.2.3.0
// @description 各種便利機能をオールインワンで搭載 これお前の仕事だぞネカピン
// @author      無能の司祭A　協力：トリ虐の人、寄生荒らし愚痴部屋民
// @match       https://bbs.animanch.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require     https://greasyfork.org/scripts/545958/code/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E5%BA%83%E5%91%8A%E5%AE%8C%E5%85%A8%E5%89%8A%E9%99%A4.user.js
// @icon        data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at      document-start
// @license     Apache-2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/550198/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E6%B0%91%E5%BC%B7%E5%8C%96%E3%83%91%E3%83%83%E3%83%81%28%CE%B2%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550198/%E3%81%82%E3%81%AB%E3%81%BE%E3%82%93%E6%B0%91%E5%BC%B7%E5%8C%96%E3%83%91%E3%83%83%E3%83%81%28%CE%B2%E7%89%88%29.meta.js
// ==/UserScript==

// *******************************************************
// * 定数
// *******************************************************
// 内部データキー
const KEY = {
    STATUS : "_Status",
    NG_WORDS : "_NgWords",
    COMMON_NG_WORDS : "CommonNgWords",
    DEL_TIME : "DeleteTime",
    MUTE_THREAD : "MuteThread",
    MUTE_WORDS : "MuteWords",
};

// 要素のID
const ELEMENT_ID = {
    TIME_SET_BTN : "TimeSetButton",
    NG_DEL_BTN : "NgDeleteButton",
    AUTO_DEL_BTN : "AutoDeleteButton",
    BULK_DEL_BTN : "BulkDeleteButton",
};

// スレミュートボタン用
const ELEMENT_ID_THREAD_MUTE_BTN = "threadMuteBtn";
const ELEMENT_CLASS_THREAD_MUTE_BTN = "threadMuteBtn";

// *******************************************************
// * メンバ変数
// *******************************************************
// スレ情報
var _threadInfo = {
    isAdmin : false,
    isArchives : false,
    boardNo : "",
};

// 現在のレス数
var _currentResCount = 1;

// レスリストの更新フラグ
var _refreshFlg = false;

// *******************************************************
// * ローカルストレージ参照関数
// *******************************************************
const StorageUtil = {
	// 値を保存
	set(key, value) {
			try {
				const payload = JSON.stringify(value);
				localStorage.setItem(key, payload);
			} catch (e) {
				console.error(`StorageUtil.set error: ${e}`);
			}
		},
    // 値を取得 ※キー未存在時は空文字を返却
    get(key, defaultValue = "") {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (e) {
            console.error(`StorageUtil.get error: ${e}`);
            return defaultValue;
        }
    },
    // 値を削除
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`StorageUtil.remove error: ${e}`);
        }
    }
};

// *******************************************************
// * 初期処理
// *******************************************************
(function($) {

    // 非表示化対象要素
    const hideTargets = [
        '#mainThread',
        '.list-group.text-left',
        '.alert.alert-success.infotext',
    ];

    // 対象要素の非表示化処理
    function hideElements() {
        const style = document.getElementById('element-hide-style') || document.createElement('style');
        style.id = 'element-hide-style';
        style.textContent = hideTargets.map(sel => `${sel} { visibility: hidden !important; }`).join('\n');
        if (!style.parentNode) {
            document.head.prepend(style);
        }
    }

    // 対象要素の非表示化解除処理
    function showElements() {
        const style = document.getElementById('element-hide-style');
        if (style) {
            style.textContent = hideTargets.map(sel => `${sel} { visibility: visible !important; }`).join('\n');
        }
    }

	// 初期読み込み時に対象を非表示化
	hideElements();

	// DOM構築完了後にメイン処理
	$(function() {

        // URLを取得
        const url = document.URL;

        // スレかスレ一覧の場合
        if (url == 'https://bbs.animanch.com/' || url.includes("board") || url.includes("category")) {

            // 表示画面がスレかで分岐
            if (document.URL.includes("board")){

                // スレ画面の場合
                ThreadMainExecute();
            } else {

                // スレ一覧の場合
                ThreadListMainExecute();
            }

            // レス入力補助
            AssistResInput();
        }

        // 不要リンクのオーバーライド
        NekapinFuckingAsshole();

        // 固定コントロールの位置調整
        const btn = document.getElementById('fixbtn');
        if (btn)
        {
            btn.style.setProperty('bottom', '20px', 'important');
        }

        // 非表示化項目を再表示
        requestAnimationFrame(showElements);
	});

	// Safariの戻る・進む時にも不可視化 ※bfcacheから復元された場合
	window.addEventListener('pageshow', function(e) {
		if (e.persisted) {

            // 非表示化
			hideElements();

            // 復元後のUI構築が終わったら表示復帰
            requestAnimationFrame(showElements);
		}
	});
})(window.jQuery);

// *******************************************************
// * スレ画面メイン処理
// *******************************************************
function ThreadMainExecute() {

    // スレッドの各種情報を取得
    var $firstResTxt = $('#res1 .badge.btn').first();
    if ($firstResTxt.length) {
        _threadInfo.isAdmin = $firstResTxt.text() === "スレ削除";
    }
    _threadInfo.isArchives = $('p.openform.res').text().includes("過去ログ");
    _threadInfo.boardNo = document.URL.split("/")[4];

    // 現在のレス数を取得
    _currentResCount = $('#reslist').find('[id]').filter(function() {return /^res\d+$/.test(this.id);}).length;

    // ボタンの作成
    CreateButtons();

    // NGワードレス除去
    RemoveRes();

    // URLリンク作成
    replaceUrl();

    // レスリストの変更を監視
    const observer = new MutationObserver(function() {
        RemoveRes();
        replaceUrl();
    });
    observer.observe(document.body, { childList: true, subtree: true});

    // 自動更新ボタンがオフの場合はオンに変更
    const $btn = $("#autoCheck");
    if ($btn.length && $btn.attr("class") === "") {
        // $btn.click();
        window.autoCheck($btn[0]);
    }

    // ミュート設定を取得
    const muteThreadIds = (StorageUtil.get(KEY.MUTE_THREAD) || '').split('/').filter(Boolean);
    const muteWords = (StorageUtil.get(KEY.MUTE_WORDS) || '').split('/').filter(Boolean);

    // おすすめ内のミュート対象スレ削除
    $('#recommends a[href]').each(function() {
        const href = this.href;
        const title = $(this).find('.title').text().trim();
        if (IsMutedThread(href, title, muteThreadIds, muteWords)) {
            $(this).remove();
        }
    });
}

// *******************************************************
// * レス監視処理
// *******************************************************
const realTimeResWatcher = setInterval(() => {

    if (!document.URL.includes("board") || !_threadInfo.isAdmin)
    {
        // スレ画面でない場合はポーリング終了
        clearInterval(realTimeResWatcher);
    }
    else
    {
        // reslistを自動更新
        $.get(location.href, function(html) {

            // 最新のレスリストのみを取得
            const newResList = $(html).find('#reslist');
            const newResCount = newResList.find('[id]').filter(function() {return /^res\d+$/.test(this.id);}).length;

            // レス件数増、更新フラグON、レス重複確認のいずれかで更新
            if ((newResList.length && newResCount > _currentResCount) || _refreshFlg || CheckDuplicateRes()) {

                // レスリスト更新フラグを初期化
                _refreshFlg = false;

                // レスカウントを更新
                _currentResCount = newResCount;

                // レスリストを反映
                $('#reslist').html(newResList.html());

                // スレ主の場合のみレスの削除処理を実行
                if (_threadInfo.isAdmin)
                {
                    DeleteTargetRes();
                }

                // NGワードレス除去
                RemoveRes();

                // URLリンク作成
                replaceUrl();
            }
        })
    }
}, 1000);

// *******************************************************
// * レス削除処理関数
// *******************************************************
function DeleteTargetRes() {

	// ステータス情報を取得
	const statusInfo = StorageUtil.get(_threadInfo.boardNo + "_" + KEY.STATUS).split("/");

    // ステータス情報が空(実行無し)の場合は何もせず終了
    if (!statusInfo) {
        return;
    }

    // 現在時刻を取得し、実行時間帯外の場合は処理を行わない
    const now   = new Date();
    const nowTime  = Number(String(now.getHours()) + String(now.getMinutes()).padStart(2, '0'));
    if (!ValidateExecuteTime(nowTime)){
        return;
    }

	// 削除済レスの削除
	$("#resList").find(".resbody.disabled").parent().remove();

    // NGワードを取得
    const ngWordsStr = StorageUtil.get(KEY.COMMON_NG_WORDS) + "/" + StorageUtil.get(_threadInfo.boardNo + KEY.NG_WORDS);
    const ngWords = ngWordsStr.split("/").filter(item => item);

	// レス番号単位で処理
	$("#resList").find(".resnumber").each(function(element) {

		// レス番とレスの時間を取得
		const resNum = Number($(this).text());
        const baseResTime = $(this).parent().find(".resposted").text();
		const resTime = Number(baseResTime.slice(-8, -6) + baseResTime.slice(-5, -3));

		// レス番とレス時間を判定
		if (resNum > statusInfo[1] && ValidateExecuteTime(resTime)) {

			// モードを判定
			if (statusInfo[0] == "無条件") {
				deleteRes(_threadInfo.boardNo + "-" + resNum);
                console.log("無条件削除：" + _threadInfo.boardNo + "-" + resNum);
			} else {
				// レス本文
				const resText = EliminateEscapeRoute($(this).parent().parent().find(".resbody").text());

                // NGワードに引っかかったものを削除
				for (const word of ngWords) {
					const ngWord = EliminateEscapeRoute(word);
					if (ngWord && resText.includes(ngWord)) {
						deleteRes(_threadInfo.boardNo + "-" + resNum);
						console.log("NGワード削除：" + _threadInfo.boardNo + "-" + resNum);
						break;
					}
				}
			}
		}
	});
}

// *******************************************************
// * 時間判定
// *******************************************************
function ValidateExecuteTime(checkTime)
{
    // 削除時間を取得
    var delTime = StorageUtil.get(KEY.DEL_TIME, "2330/600").split("/");

    // 日を跨いでいるかで判定を変更
    if (delTime[0] < delTime[1])
    {
        return checkTime >= delTime[0] && checkTime <= delTime[1];
    }
    else
    {
        return checkTime >= delTime[0] || checkTime <= delTime[1];
    }
}

// *******************************************************
// * レス除去処理関数
// *******************************************************
function RemoveRes() {

	// 削除済レスの削除
	$("#resList").find(".resbody.disabled").parent().remove();

    // NGワードを取得
    const ngWordsStr = StorageUtil.get(KEY.COMMON_NG_WORDS) + "/" + StorageUtil.get(_threadInfo.boardNo + KEY.NG_WORDS);
    const ngWords = ngWordsStr.split("/").filter(item => item);

    $("#resList").find(".resbody").each(function(element) {

        // レス本文
        const resText = EliminateEscapeRoute($(this).text());

        // NGワードに引っかかったものを削除
        for (const word of ngWords) {

            // NGワード
            const ngWord = EliminateEscapeRoute(word);

            // 含んでいた場合は除去
            if (ngWord && resText.includes(ngWord)) {
                if (_threadInfo.isAdmin)
                {
                    // スレ主の場合はレスをグレーに
                    $(this).css("color", "#808080");
                }
                else
                {
                    // 除去
                    $(this).parent().remove();
                }
                break;
            }
        }
    })
}

// *******************************************************
// * ボタン作成関数
// *******************************************************
function CreateButtons()
{
    // スレ主でない場合はミュートボタンのみ追加
    if (!_threadInfo.isAdmin) {

        // ミュートボタンの作成・追加
        const muteButton = "<button id='" + ELEMENT_ID_THREAD_MUTE_BTN + "'>★</button>";
        $("#threadTitle").find(".shareBtns").append(muteButton);

        // ミュート対象スレを取得して対象の場合は赤、非対象の場合は青に設定
        if (StorageUtil.get(KEY.MUTE_THREAD).includes(_threadInfo.boardNo)) {
            $("#"+ELEMENT_ID_THREAD_MUTE_BTN).css("color", "#f00");
        } else {
            $("#"+ELEMENT_ID_THREAD_MUTE_BTN).css("color", "#00f");
        }

        // スレミュートボタンにクリックイベント設定
        $("#"+ELEMENT_ID_THREAD_MUTE_BTN).on('click', function() {
            if (StorageUtil.get(KEY.MUTE_THREAD).includes(_threadInfo.boardNo)) {

                // 対象から削除してボタンを青に戻す
                DeleteMuteThread(_threadInfo.boardNo);
                $("#"+ELEMENT_ID_THREAD_MUTE_BTN).css("color", "#00f");
            } else {

                // 登録前確認
                if (!window.confirm("対象スレをミュート化しますか？")){
                    return;
                }

                // 追加してボタンを赤に変更
                AddMuteThread(_threadInfo.boardNo, false);
                $("#"+ELEMENT_ID_THREAD_MUTE_BTN).css("color", "#f00");
            }
        });
        return;
    }

    // ツイートボタンを削除
    $("#threadTitle").find(".tweet").remove();

    // 時間帯設定ボタンを作成
    let timeSetBtn = "";
    timeSetBtn = "<button id='" + ELEMENT_ID.TIME_SET_BTN + "'>🕒</button>";
    $("#threadTitle").find(".shareBtns").append(timeSetBtn);
    $("#"+ELEMENT_ID.TIME_SET_BTN).on('click', function() {
        ClickBtnExecute("時間帯");
    });

    // NGワード削除ボタンを作成
    let ngDelBtn = "";
    ngDelBtn = "<button id='" + ELEMENT_ID.NG_DEL_BTN + "'>NG</button>";
    $("#threadTitle").find(".shareBtns").append(ngDelBtn);
    $("#"+ELEMENT_ID.NG_DEL_BTN).css("color", "#00f");
    $("#"+ELEMENT_ID.NG_DEL_BTN).on('click', function() {
        ClickBtnExecute("NGワード");
    });

    // 無条件削除ボタンを作成
    let autoDelBtn = "";
    autoDelBtn = "<button id='" + ELEMENT_ID.AUTO_DEL_BTN + "'>無条件</button>";
    $("#threadTitle").find(".shareBtns").append(autoDelBtn);
    $("#"+ELEMENT_ID.AUTO_DEL_BTN).css("color", "#00f");
    $("#"+ELEMENT_ID.AUTO_DEL_BTN).on('click', function() {
        ClickBtnExecute("無条件");
    });

    // 一括削除ボタンを作成
    let bulkDelBtn = "";
    bulkDelBtn = "<button id='" + ELEMENT_ID.BULK_DEL_BTN + "'>一括</button>";
    $("#threadTitle").find(".shareBtns").append(bulkDelBtn);
    $("#"+ELEMENT_ID.BULK_DEL_BTN).css("color", "#00f");
    $("#"+ELEMENT_ID.BULK_DEL_BTN).on('click', function() {
        ClickBtnExecute("一括");
    });

    // 実行中の場合はボタンを赤に
    const statusInfo = StorageUtil.get(_threadInfo.boardNo + "_" + KEY.STATUS).split("/");
    if (statusInfo)
    {
        switch (statusInfo[0]) {
            case "NGワード":
                $("#"+ELEMENT_ID.NG_DEL_BTN).css("color", "#f00");
                break;
            case "無条件":
                $("#"+ELEMENT_ID.AUTO_DEL_BTN).css("color", "#f00");
                break;
        }
    }
}

// *******************************************************
// * レス自動削除ボタン押下時処理関数
// *******************************************************
function ClickBtnExecute(btnType)
{
    // スレのステータスを取得
    const statusInfo = StorageUtil.get(_threadInfo.boardNo + "_" + KEY.STATUS);

    // 削除時間を取得
    var delTime = StorageUtil.get(KEY.DEL_TIME, "2330/600").split("/");

    // ボタン毎に処理を分岐
    switch (btnType) {
        case "時間帯":
            // 開始時刻を入力
            var startTime = prompt('開始時刻を入力 (例)23時30分 ⇒ 2330', delTime[0]);
            if (!startTime) { return;}

            // 終了時刻を入力
            var endTime = prompt('終了時刻を入力 (例)6時00分 ⇒ 600', delTime[1]);
            if (!endTime) { return;}

            // 入力チェック
            var pattern = /^\d{1,4}$/;
            if (!pattern.test(startTime) || !pattern.test(endTime) || startTime > 2400 || endTime > 2400)
            {
                alert("入力値が不正です");
                return;
            }
            StorageUtil.set(KEY.DEL_TIME, startTime + "/" + endTime);
            alert("削除対象時間帯が" + startTime + "～" + endTime + "に設定されました");
            break;

        case "NGワード":
        case "無条件":
            if (statusInfo)
            {
                StorageUtil.remove(_threadInfo.boardNo + "_" + KEY.STATUS);
                $("#"+ELEMENT_ID.NG_DEL_BTN).css("color", "#00f");
                $("#"+ELEMENT_ID.AUTO_DEL_BTN).css("color", "#00f");
            }
            else
            {
                if (window.confirm(_currentResCount + "より後の時間帯が" + delTime[0] + "～" + delTime[1] + "のレスを" + btnType + "削除します"))
                {
                    StorageUtil.set(_threadInfo.boardNo + "_" + KEY.STATUS, btnType + "/" + _currentResCount);
                    if (btnType == "NGワード")
                    {
                        $("#"+ELEMENT_ID.NG_DEL_BTN).css("color", "#f00");
                    }
                    else
                    {
                        $("#"+ELEMENT_ID.AUTO_DEL_BTN).css("color", "#f00");
                    }

                    // レスリストを更新
                    _refreshFlg = true;
                }
            }
            break;
        case "一括":
            var startResNo = prompt('削除開始レス番号を入力', '');
            if (!startResNo) { return;}

            // 入力チェック
            var num = Number(startResNo);
            if (Number.isInteger(num) && num >= 2 && num <= _currentResCount)
            {
                if (window.confirm(startResNo + "以降のレスを一括削除します"))
                {
                    // レス番号単位で処理
                    $("#resList").find(".resnumber").each(function(element) {
                        // レス番号
                        const resNum = Number($(this).text());
                        if (resNum >= num)
                        {
                            // レスを一括削除
                            console.log("一括削除：" + _threadInfo.boardNo + "-" + resNum);
                            deleteRes(_threadInfo.boardNo + "-" + resNum);
                        }
                    })
                    // レスリストを更新
                    _refreshFlg = true;
                }
            }
            else
            {
                alert("入力値が不正です");
                return;
            }
            break;
    }
}

// *******************************************************
// * レスの重複チェック
// *******************************************************
function CheckDuplicateRes() {

    // 出現済みIDを保持する Set
	const seen = new Set();

	// id="reslist" 要素配下で、id が "res" で始まる全要素を取得
	const items = document.querySelectorAll('#reslist [id^="res"]');

	for (const el of items) {
		const id = el.id;

		// すでに Set に含まれていれば重複
		if (seen.has(id)) {
			return true;
		}

		// 初登場の id は Set に追加
		seen.add(id);
	}

	// 最後まで重複がなければ false
	return false;
}

// *******************************************************
// * hなしurlリンク化
// *******************************************************
function replaceUrl() {

	// hなしurl文字列の正規表現
	let regExp = new RegExp("([^h])(ttps*:\/\/[^ < ]*)", "ig");

	// レスの中にあるhなしurl文字列に該当する部分をリンクに置換
	$("#resList").each(function(index) {
		if ($(this).html().match(regExp)) {
			$(this).html($(this).html().replace(regExp,
				"$1<a href='h$2' target='_blank'>h$2</a>"));
		}
	});
}

// *******************************************************
// * スレ一覧画面メイン処理
// *******************************************************
function ThreadListMainExecute() {

	// 不要項目の削除・移動
	$('#breadcrumb').remove();
	$('.alert.alert-success.infotext').insertBefore('#resform');

    // ミュートスレ削除
    RemoveMuteThreads();

    // コンパネ追加
    AddTlCtrlPanel();

    // ミュートボタン作成
    CreateThreadMuteBtn();
}

// *******************************************************
// * スレミュート処理
// *******************************************************
function RemoveMuteThreads() {

    // 初期表示時の数を取得
    const recentsCount = $('#recents').find('.card').length;
    const newsCount = $('#news').find('.card').length;

    // ミュート設定を取得
    const muteThreadIds = (StorageUtil.get(KEY.MUTE_THREAD) || '').split('/').filter(Boolean);
    const muteWords = (StorageUtil.get(KEY.MUTE_WORDS) || '').split('/').filter(Boolean);

    // 一覧のミュート対象スレ削除
    $('#mainThread a.card[href]').each(function() {
        const href = this.href;
        const title = $(this).text().trim();
        if (IsMutedThread(href, title, muteThreadIds, muteWords)) {
            $(this).remove();
        }
    });

    // おすすめ内のミュート対象スレ削除
    $('#recommends a[href]').each(function() {
        const href = this.href;
        const title = $(this).find('.title').text().trim();
        if (IsMutedThread(href, title, muteThreadIds, muteWords)) {
            $(this).remove();
        }
    });

    // 更新順の一覧の補充処理を実行
    if (recentsCount > $('#recents').find('.card').length) {
        ResupplyThreads(recentsCount, recentsCount - $('#recents').find('.card').length, true, muteThreadIds, muteWords);
    }

    // 新着順の一覧の補充処理を実行
    if (newsCount > $('#news').find('.card').length) {
        ResupplyThreads(newsCount, newsCount - $('#news').find('.card').length, false, muteThreadIds, muteWords);
    }
}

// *******************************************************
// * ミュート判定処理
// *******************************************************
function IsMutedThread(href, title, muteThreadIds, muteWords) {

    // スレID判定
    if (muteThreadIds.length && muteThreadIds.some(id => href.includes(id))) {
        return true;
    }
    // ミュートワード判定
    if (muteWords.length && muteWords.some(word => title.includes(word))) {
        return true;
    }
    return false;
}

// *******************************************************
// * 一覧不足分補充処理
// *******************************************************
async function ResupplyThreads(origCount, removeCount, isRecents, muteThreadIds = [], muteWords = []) {

    const target   = isRecents ? 'update' : 'archive';
    const selector = isRecents ? 'recents' : 'news';

    // カテゴリ番号を取得
    let categoryNo = "";
    if (location.href.includes("category")) {
        categoryNo = location.href.match(/category(\d+)/)[1];
    }

    const urlBase = `https://bbs.animanch.com/${target}${categoryNo}/page:`;

    // 1～2ページ目を取得
    const [cardHtml, cardHtmlSecond] = await Promise.all([
        FetchElementFromSameDomain(urlBase + '1', '#mainThread', 'html'),
        FetchElementFromSameDomain(urlBase + '2', '#mainThread', 'html')
    ]);

    let added = 0;

    if (cardHtml || cardHtmlSecond) {
        const $cardHtml       = $(cardHtml || '');
        const $cardHtmlSecond = $(cardHtmlSecond || '');

        // 2ページ目の要素を1ページ目に追加
        $cardHtml.append($cardHtmlSecond.children());

        // まとめた要素から一覧外のものを追加
        $cardHtml.find('a.list-group-item.row').slice(origCount).each(function() {
            const $item = $(this);
            const href  = $item.attr('href');
            const title = $item.find('.title').text().trim();

            if (!IsMutedThread(href, title, muteThreadIds, muteWords)) {
                $('#' + selector).append(ConvertListItemToCard($item));
                added++;
                if (added >= removeCount) {
                    return false; // break
                }
            }
        });
    }

    // 1・2ページ目で不足している場合のみ、3ページ目以降を逐次補充
    let page = 3;
    while (added < removeCount) {
        const cardHtmlNext = await FetchElementFromSameDomain(urlBase + page, '#mainThread', 'html');
        if (!cardHtmlNext) break;

        const $pageHtml = $(cardHtmlNext);
        const $threads  = $pageHtml.find('a.list-group-item.row');
        if ($threads.length === 0) break;

        $threads.each(function() {
            const $item = $(this);
            const href  = $item.attr('href');
            const title = $item.find('.title').text().trim();

            if (!IsMutedThread(href, title, muteThreadIds, muteWords)) {
                $('#' + selector).append(ConvertListItemToCard($item));
                added++;
                if (added >= removeCount) {
                    return false; // break
                }
            }
        });
        page++;
    }
    console.log(`補充処理終了: ${added} 件追加 (最終ページ=${page})`);
}

// *******************************************************
// * 同一ドメイン内要素取得
// *******************************************************
async function FetchElementFromSameDomain(url, selector, returnType = 'text') {
    try {
        const res = await fetch(url, { credentials: 'include' });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const element = doc.querySelector(selector);
        if (!element) return null;
        return returnType === 'html'
            ? element.outerHTML.trim()
            : element.textContent.trim();
    } catch (e) {
        console.error(`要素取得失敗: ${url} (${selector})`, e);
        return null;
    }
}

// *******************************************************
// * 一覧用html変換処理
// *******************************************************
function ConvertListItemToCard($listItem) {

    // 各要素を置換
    const href = $listItem.attr('href');
    const bgUrl = $listItem.find('.threadImage').css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    const count = $listItem.find('.threadCount').text().trim();
    const title = $listItem.find('.title').text().trim();

    // 新しいカード要素を構築
    const $card = $('<a>', { href, class: 'card' });

    const $flex = $('<div>', { class: 'd-flex' });
    const $img = $('<img>', { src: bgUrl });
    const $body = $('<div>', { class: 'card-body' }).text(title);
    $body.append($('<p>', { class: 'threadCount' }).text(count));

    $flex.append($img).append($body);
    $card.append($flex);

    // ミュートボタン追加
    const $muteBtn = $('<a>', {
        class: ELEMENT_CLASS_THREAD_MUTE_BTN,
        href: 'javascript:void(0);',
        text: '★',
        style: 'color: rgb(0, 0, 255); background-color: rgb(255, 255, 255); display: inline-block; position: absolute; top: 0px; left: 0px; width: 1.1em;'
    });

	// クリックイベント
	$muteBtn.on("click", function() {

        // 登録前確認
        if (!window.confirm("対象スレをミュート化しますか？")){
            return;
        }

        // スレッドIDを取得
		const threadId = $(this).parent().prop("href").replace(/^.*\/board\/([0-9]*)\//, "$1");

        // スレミュート追加処理
        if (threadId) {
            AddMuteThread(threadId);
        }
	});

    $card.append($muteBtn);

    return $card;
}

// *******************************************************
// * スレ一覧コンパネ追加処理
// *******************************************************
function AddTlCtrlPanel() {

    // コンテナ（縦方向のUIパネル）
    const $container = $('<div>', {
        id: 'custom-control-panel'
    }).css({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
        background: '#20c997',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '80px',
        boxSizing: 'border-box'
    });

    // 横並び用ラッパー
    const $row = $('<div>').css({
        display: 'flex',
        flexDirection: 'row',
        gap: '4px',
        alignItems: 'center'
    });

    // テキストボックス
    const $input = $('<input>', {
        type: 'text',
        placeholder: '検索したいスレタイを入力'
    }).css({
        flex: '1 1 auto',
        minWidth: '0',
        padding: '4px',
        fontSize: '16px', // iOSズーム防止
        boxSizing: 'border-box'
    });

    // IME変換中フラグ & デバウンス用
    let isComposing = false;
    let debounceTimer;

    $input
        .on('compositionstart', () => { isComposing = true; })
        .on('compositionend', () => {
        isComposing = false;
        ThreadSearch($input.val().trim());
    })
        .on('input', () => {
        if (isComposing) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            ThreadSearch($input.val().trim());
        }, 300);
    });

    // クリアボタン
    const $clearBtn = $('<button>', {
        text: 'クリア'
    }).on('click', () => {
        switch ($input.val()) {
            case '': {
                const text = [
                    '以下の文字をテキストボックスに入力してボタンを押下すると特殊機能が実行されます',
                    '@初期化：スレミュート対象情報の初期化'
                ].join('\r\n');
                alert(text);
                break;
            }
            case '@初期化':
                if (window.confirm("スレミュート対象情報が初期化されます\r\nよろしいですか？")) {
                    StorageUtil.remove(KEY.MUTE_THREAD);
                    location.reload();
                }
                break;
            default:
                $input.val('');
                ThreadSearch('');
                break;
        }
    });

    // 横並び用ラッパー(ミュート関連)
    const $muteRow = $('<div>').css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '4px',
        alignItems: 'center'
    });

    // 一括ミュートボタン
    const $bulkAddMuteThreadBtn = $('<button>', {
        text: '一括🔇'}).css({
        flex: '1',
        maxWidth: '80px',
        display: 'inline-block',
        padding: '2px 6px'
    }).on('click', () => {
        if ($input.val()){
            if (window.confirm("表示中のスレがミュート対象に追加されます\r\nよろしいですか？")) {

                // ミュート対象スレIDを取得
                const idString = $('#mainThread .tab-pane.active a.card:visible').map(function() {
                    const url = $(this).attr('href');
                    const match = url.match(/\/(\d+)\/?$/); // 末尾の数字を抽出
                    return match ? match[1] : null;
                }).get().join('/');

                // ミュートに一括登録
                AddMuteThread(idString);
            }
        } else {
            alert('スレ検索後に当ボタンの押下で表示中のスレッドの一括ミュートが可能です');
        }
    });

    // ワードミュートボタン
    const $muteWordBtn = $('<button>', {
        text: 'ワード🔇'}).css({
        flex: '1',
        maxWidth: '80px',
        display: 'inline-block',
        padding: '2px 6px'
    }).on('click', () => {
        var inputTxt = $input.val();
        var muteWords = StorageUtil.get(KEY.MUTE_WORDS);
        if (inputTxt){
            if (window.confirm("検索中の「" + inputTxt + "」がミュートワードに追加されます\r\nよろしいですか？")) {

                // 重複と空白を削除して登録
                muteWords = [...new Set((muteWords + '/' + inputTxt).split("/").filter(Boolean))].join("/");
                StorageUtil.set(KEY.MUTE_WORDS, muteWords);
                location.reload();
            }
        } else {
            if (muteWords) {

                // ミュートワードの編集モード ※キャンセル時は終了
                muteWords = prompt('「/」を区切り文字とし、ミュートワードを編集してください', muteWords);
                if (muteWords === null)　{
                    return;
                }
                StorageUtil.set(KEY.MUTE_WORDS, muteWords);
                location.reload();
            } else {
                alert('現在ミュートワードは未登録です\r\n登録後、検索ワードが空で押下時は当機能は編集機能となります');
            }
        }
    });

    // ID登録ボタン
    const $addThreadIdBtn = $('<button>', {
        text: 'ID登録'
    }).css({
        flex: '1',
        maxWidth: '80px',
        display: 'inline-block',
        padding: '2px 6px'
    }).on('click', () => {

        // 入力されたIDをミュート対象に一括追加する
		var input = prompt('追加したいミュートスレのIDを入力してください\r\n※「/」区切りで複数登録が可能', '');
		if (input === null || input === "")　{
            // キャンセルや無入力時はそのまま終了
            return;
        }
        AddMuteThread(input);
    });

    let preparedText = null;

    // ID出力ボタン
    const $exportThreadIdBtn = $('<button>', {
        text: 'ID出力'
    }).css({
        flex: '1',
        maxWidth: '80px',
        display: 'inline-block',
        padding: '2px 6px'
    }).on('click', async () => {
        if (!preparedText) {
            const muteThreads = StorageUtil.get(KEY.MUTE_THREAD);
            if (!muteThreads) {
                alert('現在ミュート対象は未登録です');
                return;
            }

            if (window.confirm("登録中のミュートスレ情報を取得しますか？")) {
                try {
                    // ボタン状態を「取得中」に変更して非活性化
                    $exportThreadIdBtn.text('取得中').prop('disabled', true);

                    // ミュートスレッド情報を取得 ※削除済み、過去スレは同時に登録解除
                    const finalText = await GetMuteThreads(muteThreads.split('/'));

                    // 最新化されたミュート対象を取得し、テキストに結合
                    const currentMuteThreads = StorageUtil.get(KEY.MUTE_THREAD);
                    preparedText = currentMuteThreads + "\r\n\r\n" + finalText;

                    // 準備完了 → コピー待ち状態に変更
                    $exportThreadIdBtn.text('コピー').prop('disabled', false);

                    // 通知
                    alert("ミュートスレ情報の取得が完了しました\r\nボタンの再押下でコピー可能です");
                } catch (e) {
                    console.warn("ミュートスレ情報取得失敗:", e);
                    alert("ミュートスレ情報の取得に失敗しました");
                    $exportThreadIdBtn.text('ID出力').prop('disabled', false);
                }
            }
            return;
        }

        // 文字列が準備済み → 2回目の押下でコピー
        try {
            await navigator.clipboard.writeText(preparedText);
            alert("コピーしました");

            // 状態リセット
            preparedText = null;
            $exportThreadIdBtn.text('ID出力').prop('disabled', false);
        } catch (e) {
            console.warn("コピー失敗:", e);
            alert("コピーに失敗しました");
            $exportThreadIdBtn.text('ID出力').prop('disabled', false);
        }
    });

    // ラッパーに追加
    $row.append($input, $clearBtn);
    $muteRow.append($bulkAddMuteThreadBtn, $muteWordBtn, $addThreadIdBtn, $exportThreadIdBtn);

    // コンテナに作製した要素を追加
    $container.append($row, $muteRow);

	// ページに追加（先頭）
	$($container).insertBefore('#tabs');
}

// *******************************************************
// * URLからタイトル取得（同一ドメイン用）
// *******************************************************
async function GetMuteThreads(muteThreads) {

    let results = [];
    let deleteThreadIds = [];
    for (const threadId of muteThreads) {
        const fullUrl = 'https://bbs.animanch.com/board/' + threadId + '/'; // URL整形
        const title = await FetchTitleFromSameDomain(fullUrl);
        // 削除済みスレは除外
        if (title && title != 'あにまん掲示板｜二次元オンリー'){
            results.push(`${title}\r\n${fullUrl}`);
        } else {
            // 削除済みスレは削除対象に追加
            deleteThreadIds.push(threadId);
        }
    }

    // 削除済みのものは登録からも除外
    DeleteMuteThreads(deleteThreadIds);

    return results.join("\r\n\r\n");
}

// *******************************************************
// * スレ検索処理（削除せず高速切り替え）
// *******************************************************
function ThreadSearch(keyWord) {

    // 検索キーワードが空なら全件表示
    if (!keyWord) {
        $('#mainThread a.card').show();
        return;
    }

    // キーワード一致判定で表示/非表示切り替え
    $('#mainThread a.card').each(function() {
        const text = $(this).text().trim();
        if (text.includes(keyWord)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// *******************************************************
// * スレ一覧ミュートボタン作成処理
// *******************************************************
function CreateThreadMuteBtn() {

    // ミュートボタンを作成・追加
	const muteButton = `<a class="${ELEMENT_CLASS_THREAD_MUTE_BTN}" href="javascript:void(0);">★</a>`;
    $("#recommends,#mainThread").find("a[href^='https://bbs.animanch.com/board']").append(muteButton);

	// スレ一覧用スタイル
	$("#recommends,#mainThread").find(`.${ELEMENT_CLASS_THREAD_MUTE_BTN}`).css({
		color: "#00f",
		backgroundColor: "#fff",
		display: "inline-block",
		position: "absolute",
		top: 0,
		left: 0,
		width: "1.1em"
	});

	// クリックイベント
	$(`.${ELEMENT_CLASS_THREAD_MUTE_BTN}`).on("click", function() {

        // 登録前確認
        if (!window.confirm("対象スレをミュート化しますか？")){
            return;
        }

        // スレッドIDを取得
		const threadId = $(this).parent().prop("href").replace(/^.*\/board\/([0-9]*)\//, "$1");

        // スレミュート追加処理
        if (threadId) {
            AddMuteThread(threadId);
        }
	});
}

// *******************************************************
// * スレミュート対象追加処理
// *******************************************************
function AddMuteThread(threadId, reloadFlg = true){

    // キーを取得
    const keyVal = KEY.MUTE_THREAD;

    // 内部データからミュート対象スレを取得
    var muteThreads = StorageUtil.get(keyVal) +  "/" + threadId;

    // 一度配列化して空と重複の要素の除去後、再度文字列化
    muteThreads = [...new Set(muteThreads.split("/").filter(id => /^\d{7}$/.test(id)))].join("/");

    // 登録
    StorageUtil.set(keyVal,muteThreads);

    // リロードしてバイバイ
    if (reloadFlg) {
        location.reload();
    }
}

// *******************************************************
// * スレミュート対象削除処理
// *******************************************************
function DeleteMuteThread(threadId){

    // キーを取得
    const keyVal = KEY.MUTE_THREAD;

    // 内部データからミュート対象スレを取得
    var muteThreads = StorageUtil.get(keyVal);

    // 指定スレッドIDを除去
    muteThreads = [...new Set(muteThreads.split("/").filter(id => /^\d+$/.test(id) && id !== String(threadId)))].join("/");

    // 登録
    StorageUtil.set(keyVal,muteThreads);
}

// *******************************************************
// * スレミュート対象削除処理（複数対応）
// *******************************************************
function DeleteMuteThreads(threadIds) {

    // 引数を配列に正規化（単一値が来ても対応できるように）
    const idsToDelete = Array.isArray(threadIds) ? threadIds.map(String) : [String(threadIds)];

    // キーを取得
    const keyVal = KEY.MUTE_THREAD;

    // 内部データからミュート対象スレを取得
    let muteThreads = StorageUtil.get(keyVal) || "";

    // 指定スレッドID群を除去
    muteThreads = [...new Set(muteThreads.split("/").filter(id => /^\d+$/.test(id) && !idsToDelete.includes(id)))].join("/");

    // 登録
    StorageUtil.set(keyVal, muteThreads);
}

// *******************************************************
// * 不要リンクのオーバーライド
// *******************************************************
function NekapinFuckingAsshole() {

	// テキストでフィルタして書き換え
	// 捏造印象操作まとめ
	$('ul.nav.navbar-nav a').filter(function() {
			return $(this).text().trim() === 'あにまんch';
		})
		.attr('href', 'https://animanman.github.io/')
		.text('検索');

	// RSS
	$('ul.nav.navbar-nav a').filter(function() {
			return $(this).text().trim() === 'RSS';
		})
		.attr('href', '')
		.text('NGワード')
		.on('click', function(e) {

        　　// リンク先への遷移をキャンセル
			e.preventDefault();

			// NGワードの設定
			SetNgWord();
		});
}

// *******************************************************
// * NGワード設定関数
// *******************************************************
function SetNgWord() {

    // スレかそれ以外かでキーを変更
    var keyVal = KEY.COMMON_NG_WORDS;
    if (_threadInfo.boardNo)
    {
        keyVal = _threadInfo.boardNo + KEY.NG_WORDS;
    }

    // 内部データから登録済NGワードを取得
    const ngWords = StorageUtil.get(keyVal);

	// モード選択
    var input = "";
	if (window.confirm("NGワードの追加を行いますか？")) {

        // 追加モード
		input = prompt('追加したいNGワードを入力してください', '');

        // キャンセルや無入力時はそのまま終了
		if (input === null || input === "")　{
            return;
        }

        // 既存チェック
        if (ngWords.includes(input))
        {
            alert("登録済です");
            return;
        }

        // cookieの値に追加
        input = ngWords + "/" + input;
	} else {
		if (window.confirm("NGワードの編集を行いますか？")) {

            // 編集モード
			input = prompt('「/」を区切り文字とし、NGワードを編集してください', ngWords);

            // キャンセル時はそのまま終了
            if (input === null)　{
                return;
            }
		}
	}

    // 一度配列化して空の要素の除去後、再度文字列化
    input = input.split("/").filter(item => item).join("/");

    // 登録
    StorageUtil.set(keyVal,input);

    // resListを更新
    _refreshFlg = true;
}

// *******************************************************
// * レス入力補助
// *******************************************************
function AssistResInput() {

	const rpStr = 'mega​lodon';
	const $ta = $('textarea[name="text"]');
	$ta.on('input', function() {

		// キャレット保存
		const start = this.selectionStart;
		const end = this.selectionEnd;

        // 検閲回避文字に置換
		var before = $(this).val();
		var after = before.replace("megalodon", rpStr);

        // 画像ファイル
        after = after.replace("https://bbs.animanch.com/arc/img", "https://bbs.animanch.com/img");

		if (after !== before) {
			$(this).val(after);
			// キャレット復元
			this.setSelectionRange(start, end);
		}
	});
}

// *******************************************************
// * 全角文字 半角変換関数
// *******************************************************
function EliminateEscapeRoute(str) {

    // 戻り値
    let rtnStr = str.replace(/\n/, '');

    // 半角変換
    rtnStr = hiraToKana(rtnStr);
    rtnStr = toHalfWidth(rtnStr);
    rtnStr = kanaFullToHalf(rtnStr);

    // 回避文字を削除
    let escapeStrAry = [" ",",",".","_","/","|","'","~","^","`"];
    for (const item of escapeStrAry) {
        rtnStr = rtnStr.replace(item,"");
    }
    return rtnStr;
}

// *******************************************************
// * ひらがな カナ変換関数
// *******************************************************
function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096]/g, function(s){
    return String.fromCharCode(s.charCodeAt(0) + 0x60);
  });
}

// *******************************************************
// * 全角英数字 半角変換関数
// *******************************************************
function toHalfWidth(str) {
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return str;
}

// *******************************************************
// * 全角カナ 半角変換関数
// *******************************************************
function kanaFullToHalf(str){
    let kanaMap = {
        "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
        "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
        "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
        "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
        "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
        "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
        "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
        "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
        "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
        "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
        "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
        "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
        "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
        "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
        "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
        "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
        "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
        "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
        "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･",
        "　": " "
    };
    let reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    return str.replace(reg, function(s){
        return kanaMap[s];
    }).replace(/゛/g, 'ﾞ').replace(/゜/g, 'ﾟ');
}

// *******************************************************
// * URLからタイトル取得（同一ドメイン用 + 過去スレ判定）
// *******************************************************
async function FetchTitleFromSameDomain(url) {
    try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const title = doc.title?.trim() || "";

        // 過去ログ倉庫メッセージの存在確認
        const archiveMsg = doc.querySelector("p.openform.res, div.pastlog, .pastlog, .openform.res");
        const isArchived = archiveMsg && /過去ログ/.test(archiveMsg.textContent);

        // 最終レスの投稿日時を取得（PC版とモバイル版両対応）
        const resList = doc.querySelectorAll("#reslist li .resheader .resposted, .res .date");
        let lastPostedAt = null;
        if (resList.length > 0) {
            const lastRes = resList[resList.length - 1];
            const text = lastRes.textContent.trim();
            lastPostedAt = ParseDateString(text);
        }

        // 判定処理 ※1日以上経過していた場合は空を返却
        if (isArchived && GetNowAsNumber() - lastPostedAt > 10000) {
            return "";
        }

        return title;
    } catch (e) {
        console.error("タイトル取得失敗:", url, e);
        return "";
    }
}

// ********************************************************************
// * レス日時文字列 数値変換関数 ※想定書式：[YY/MM/DD(aaa) hh:mm:ss]
// ********************************************************************
function ParseDateString(str) {

    // 日付と時刻に分割
    const [datePart, timePart] = str.split(" ");

    // 日付部分から曜日を除去
    const dateClean = datePart.replace(/\(.+\)/, "");

    // 分解
    const [yy, mm, dd] = dateClean.split("/").map(n => parseInt(n, 10));

    // 西暦補完（2000年以降と仮定）
    const yyyy = (yy < 100 ? 2000 + yy : yy);

    // 時刻部分を分解
    const [hh, min] = timePart.split(":");

    // フォーマットして結合
    const result = `${yyyy}${String(mm).padStart(2,"0")}${String(dd).padStart(2,"0")}${hh}${min}`;

    return Number(result); // 数値として返却
}

// ********************************************************************
// * 現在日時取得
// ********************************************************************
function GetNowAsNumber() {

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm   = String(now.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
    const dd   = String(now.getDate()).padStart(2, "0");
    const hh   = String(now.getHours()).padStart(2, "0");
    const min  = String(now.getMinutes()).padStart(2, "0");

    // 結合
    const result = `${yyyy}${mm}${dd}${hh}${min}`;
    return Number(result);
}