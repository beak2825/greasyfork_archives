// ==UserScript==
// @name         ChinaCCP X Auto Block / Fast Block
// @name:en      ChinaCCP X Auto Block / Fast Block
// @name:zh-TW   ChinaCCP X 自動封鎖 / Fast Block
// @name:zh-CN   ChinaCCP X 自动封锁 / Fast Block
// @name:ja      ChinaCCP X 自動ブロック / Fast Block
// @name:ko      ChinaCCP X 자동 차단 / Fast Block
// @namespace    https://hollen9.com/
// @version      1.1.0
// @description       Fast block button on X profile + bulk blocking helper for list pages.
// @description:zh-TW 在 X 個人頁面加入 Fast Block 按鈕，並支援從清單頁批次封鎖帳號。
// @description:zh-CN 在 X 个人主页加入 Fast Block 按钮，并支持从列表页批量封锁账号。
// @description:ja    XプロフィールにFast Blockボタンを追加し、リストページからの一括ブロックをサポートします。
// @description:ko    X 프로필에 Fast Block 버튼을 추가하고, 목록 페이지에서 계정을 일괄 차단할 수 있게 도와줍니다.
// @author       Hollen9
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://pluto0x0.github.io/X_based_china/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556842/ChinaCCP%20X%20Auto%20Block%20%20Fast%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/556842/ChinaCCP%20X%20Auto%20Block%20%20Fast%20Block.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.__xAutoBlockInjected) return;
    window.__xAutoBlockInjected = true;

    const HOST = location.host;

    /* -------------------------------------------------
     * i18n
     * ------------------------------------------------- */

    const I18N = {
        'en': {
            languageLabel: 'Language:',
            fastBlockLabel: 'Fast Block',
            fastBlockTitle: 'Fast Block (auto open menu, click Block, and confirm)',
            alertTooManyAttempts:
                'Fast Block failed multiple times. The DOM structure may have changed, or this account is already blocked.',
            alertNotFound:
                'Could not find userActions / block menuitem. Please make sure you are on the user profile page.',

            panelTitle: 'X Bulk Blocker',
            statusIdle: 'Status: idle',
            statusPaused: 'Status: paused',
            statusRunning: 'Status: running',
            statusDone: 'Status: done (no accounts left on this page)',
            progressLabel: 'Progress: ',
            progressPageSuffix: ' (this page)',
            nextLabel: 'Next: ',
            nextEstimateLabel: 'Next (estimate): ',
            nextNone: 'Next: --',
            nextPausedSuffix: ' (paused)',
            secondsSuffix: ' s',
            taskStartLabel: 'Task start time: ',
            runtimeLabel: 'Running time: ',
            runtimeUnknown: '--:--:--',
            taskStartUnknown: '--',

            btnStart: 'Start',
            btnPause: 'Pause',
            btnReset: 'Reset done',
            btnExportFile: 'Export file',
            btnExportCopy: 'Copy JSON',
            btnImportJson: 'Import JSON',
            btnImportFile: 'Choose file',

            confirmStartMessage:
                'It will open a new tab at about two accounts per minute and try to block them.\n' +
                'Remaining on this page: {pending}\nAlready marked as done: {done}\n\n' +
                'Processed Twitter IDs are saved in localStorage (by ID, not index),\n' +
                'and will be skipped next time.\n\nContinue?',

            pageAllDoneInfo: 'Looks like all accounts on this page are already processed.',
            pausedInfo:
                'Batch blocking paused. You can resume later from the current progress.',
            resetConfirm:
                'Reset the "processed Twitter ID" list?\n\nThis will clear the records stored in localStorage. Next run will restart from the first account on this page.',
            resetBtnConfirmText: 'Reset',
            resetBtnCancelText: 'Cancel',
            resetDone: 'Processed list has been reset.',

            exportCopied: 'JSON has been copied to the clipboard.',
            exportClipboardFail:
                'Unable to write to clipboard. Please copy the JSON below manually:',

            importPromptLabel:
                'Paste JSON:\nSupported formats:\n' +
                '1) ["id1","id2",...]\n2) {"ids":["id1","id2",...],...}',
            importJsonParseError:
                'Failed to parse JSON. Please check that the format is correct.',
            importNoIdsError:
                'No valid "ids" array found.\nSupported: ["id1","id2"] or {"ids":["id1","id2"],...}',
            importEmptyIdsError: 'Imported "ids" is empty.',
            importConfirmReplace:
                'How to apply the imported IDs?\n\n"OK" = replace current list\n"Cancel" = merge with current list',
            importConfirmReplaceOk: 'Replace',
            importConfirmReplaceCancel: 'Merge',
            importDone: 'Import finished. Applied {count} IDs.',
            importFileReadError: 'An error occurred while reading the file.',

            confirmAllDone: 'It seems that all accounts on this page are done.',

            btnOk: 'OK',
            btnCancel: 'Cancel',
            swalImportTitle: 'Import JSON'
        },

        'ja': {
            languageLabel: '言語：',
            fastBlockLabel: 'Fast Block',
            fastBlockTitle:
                'Fast Block（メニューを開いて「ブロック」を押して確認まで自動）',
            alertTooManyAttempts:
                'Fast Block を複数回試しましたが失敗しました。DOM 構造が変わったか、このアカウントはすでにブロック済みかもしれません。',
            alertNotFound:
                'userActions / block メニュー項目が見つかりません。ユーザープロフィールページにいるか確認してください。',

            panelTitle: 'X 一括ブロック',
            statusIdle: '状態：待機中',
            statusPaused: '状態：一時停止',
            statusRunning: '状態：実行中',
            statusDone: '状態：完了（このページには残りアカウントなし）',
            progressLabel: '進捗：',
            progressPageSuffix: '（このページ）',
            nextLabel: '次回：',
            nextEstimateLabel: '次回（予測）：',
            nextNone: '次回：--',
            nextPausedSuffix: '（一時停止中）',
            secondsSuffix: ' 秒',
            taskStartLabel: 'タスク開始時刻：',
            runtimeLabel: '稼働時間：',
            runtimeUnknown: '--:--:--',
            taskStartUnknown: '--',

            btnStart: '開始',
            btnPause: '一時停止',
            btnReset: '処理済みをリセット',
            btnExportFile: 'ファイル書き出し',
            btnExportCopy: 'JSON をコピー',
            btnImportJson: 'JSON を貼り付け',
            btnImportFile: 'ファイル選択',

            confirmStartMessage:
                '約 1 分に 2 アカウントのペースで新しいタブを開き、ブロックを試みます。\n' +
                'このページの残り：{pending} 件\n処理済み：{done} 件\n\n' +
                '処理済みの Twitter ID は localStorage に保存され、\n' +
                '次回はスキップされます。\n\n開始してもよろしいですか？',

            pageAllDoneInfo: 'このページのアカウントはすべて処理済みのようです。',
            pausedInfo:
                '一括ブロックを一時停止しました。あとで現在の進捗から再開できます。',
            resetConfirm:
                '「処理済みの Twitter ID」リストをリセットしますか？\n\nlocalStorage に保存された記録が消去され、次回はこのページの最初からやり直します。',
            resetBtnConfirmText: 'リセット',
            resetBtnCancelText: 'キャンセル',
            resetDone: '処理済みリストをリセットしました。',

            exportCopied: 'JSON をクリップボードにコピーしました。',
            exportClipboardFail:
                'クリップボードに書き込めませんでした。下の JSON を手動でコピーしてください。',

            importPromptLabel:
                'JSON を貼り付けてください：\n対応フォーマット：\n' +
                '1) ["id1","id2",...]\n2) {"ids":["id1","id2",...],...}',
            importJsonParseError: 'JSON の解析に失敗しました。フォーマットを確認してください。',
            importNoIdsError:
                '有効な ids 配列が見つかりませんでした。\n対応：["id1","id2"] または {"ids":["id1","id2"],...}',
            importEmptyIdsError: 'インポートした ids は空です。',
            importConfirmReplace:
                'インポートした ID をどう適用しますか？\n\n「OK」= 現在のリストを置き換え\n「キャンセル」= 現在のリストにマージ',
            importConfirmReplaceOk: '置き換え',
            importConfirmReplaceCancel: 'マージ',
            importDone: 'インポート完了。合計 {count} 件の ID を反映しました。',
            importFileReadError: 'ファイルの読み込み中にエラーが発生しました。',

            confirmAllDone: 'このページのアカウントはすべて処理済みのようです。',

            btnOk: 'OK',
            btnCancel: 'キャンセル',
            swalImportTitle: 'JSON をインポート'
        },

        'ko': {
            languageLabel: '언어:',
            fastBlockLabel: 'Fast Block',
            fastBlockTitle:
                'Fast Block (메뉴를 열고 차단 + 확인까지 자동 실행)',
            alertTooManyAttempts:
                'Fast Block을 여러 번 시도했지만 실패했습니다. DOM 구조가 변경되었거나 이미 차단된 계정일 수 있습니다.',
            alertNotFound:
                'userActions / block 메뉴 항목을 찾지 못했습니다. 현재 사용자 프로필 페이지인지 확인해주세요.',

            panelTitle: 'X 대량 차단기',
            statusIdle: '상태: 대기',
            statusPaused: '상태: 일시 중지',
            statusRunning: '상태: 실행 중',
            statusDone: '상태: 완료 (이 페이지에 남은 계정 없음)',
            progressLabel: '진행률: ',
            progressPageSuffix: '(이 페이지)',
            nextLabel: '다음: ',
            nextEstimateLabel: '다음 (예상): ',
            nextNone: '다음: --',
            nextPausedSuffix: '(일시 중지)',
            secondsSuffix: ' 초',
            taskStartLabel: '작업 시작 시간: ',
            runtimeLabel: '실행 시간: ',
            runtimeUnknown: '--:--:--',
            taskStartUnknown: '--',

            btnStart: '시작',
            btnPause: '일시 중지',
            btnReset: '처리 기록 초기화',
            btnExportFile: '파일로 내보내기',
            btnExportCopy: 'JSON 복사',
            btnImportJson: 'JSON 가져오기',
            btnImportFile: '파일 선택',

            confirmStartMessage:
                '약 1분에 2명 속도로 새 탭을 열어 차단을 시도합니다.\n' +
                '이 페이지 남은 계정: {pending}개\n처리된 계정: {done}개\n\n' +
                '처리된 Twitter ID는 localStorage에 저장되며,\n' +
                '다음 실행 시 건너뜁니다.\n\n시작하시겠습니까?',

            pageAllDoneInfo: '이 페이지의 계정은 모두 처리된 것 같습니다.',
            pausedInfo:
                '대량 차단이 일시 중지되었습니다. 나중에 현재 진행 상태에서 다시 시작할 수 있습니다.',
            resetConfirm:
                '"처리된 Twitter ID" 목록을 초기화하시겠습니까?\n\nlocalStorage에 저장된 기록이 삭제되고, 다음 실행은 이 페이지의 첫 계정부터 다시 시작합니다.',
            resetBtnConfirmText: '초기화',
            resetBtnCancelText: '취소',
            resetDone: '처리 목록을 초기화했습니다.',

            exportCopied: 'JSON을 클립보드에 복사했습니다.',
            exportClipboardFail:
                '클립보드에 쓸 수 없습니다. 아래 JSON을 수동으로 복사해주세요.',

            importPromptLabel:
                'JSON을 붙여넣어 주세요:\n지원 형식:\n' +
                '1) ["id1","id2",...]\n2) {"ids":["id1","id2",...],...}',
            importJsonParseError: 'JSON 파싱에 실패했습니다. 형식을 확인해 주세요.',
            importNoIdsError:
                '유효한 ids 배열을 찾지 못했습니다.\n지원: ["id1","id2"] 또는 {"ids":["id1","id2"],...}',
            importEmptyIdsError: '가져온 ids가 비어 있습니다.',
            importConfirmReplace:
                '가져온 ID를 어떻게 적용할까요?\n\n"확인" = 현재 목록을 덮어쓰기\n"취소" = 현재 목록에 병합',
            importConfirmReplaceOk: '덮어쓰기',
            importConfirmReplaceCancel: '병합',
            importDone: '가져오기 완료. 총 {count}개의 ID를 적용했습니다.',
            importFileReadError: '파일을 읽는 동안 오류가 발생했습니다.',

            confirmAllDone: '이 페이지의 계정은 모두 처리된 것 같습니다.',

            btnOk: '확인',
            btnCancel: '취소',
            swalImportTitle: 'JSON 가져오기'
        },

        'zh-TW': {
            languageLabel: '語言：',
            fastBlockLabel: 'Fast Block',
            fastBlockTitle: 'Fast Block（自動打開選單、點封鎖並確認）',
            alertTooManyAttempts:
                'Fast Block 多次嘗試失敗，可能是 DOM 結構變更，或這個帳號已被封鎖。',
            alertNotFound:
                '找不到 userActions / block 選單項目，請確認現在是在使用者主頁。',

            panelTitle: 'X 批次封鎖工具',
            statusIdle: '狀態：待機',
            statusPaused: '狀態：已暫停',
            statusRunning: '狀態：運行中',
            statusDone: '狀態：已完成（此頁無剩餘帳號）',
            progressLabel: '進度：',
            progressPageSuffix: '（此頁）',
            nextLabel: '下一個：',
            nextEstimateLabel: '下一個（預估）：',
            nextNone: '下一個：--',
            nextPausedSuffix: '（暫停中）',
            secondsSuffix: ' 秒',
            taskStartLabel: '任務啟動時間：',
            runtimeLabel: '運行時間：',
            runtimeUnknown: '--:--:--',
            taskStartUnknown: '--',

            btnStart: '開始',
            btnPause: '暫停',
            btnReset: '重置已處理',
            btnExportFile: '匯出檔案',
            btnExportCopy: '複製 JSON',
            btnImportJson: '匯入 JSON',
            btnImportFile: '選擇檔案',

            confirmStartMessage:
                '將以「約每分鐘 2 位」的速度，依序開新分頁並嘗試封鎖。\n' +
                '此頁剩餘：約 {pending} 位，已標記處理：{done} 位。\n\n' +
                '已處理的 Twitter ID 會記錄在 localStorage（依 ID，而非 index），\n' +
                '下次回來會跳過處理過的帳號。\n\n確定要開始嗎？',

            pageAllDoneInfo: '看起來這一頁的帳號都已處理完囉 (´･ω･`)',
            pausedInfo:
                '已暫停批次封鎖，可以之後再從目前進度繼續。',
            resetConfirm:
                '確定要重置「已處理的 Twitter ID」嗎？\n\n這會清除本機 localStorage 中的紀錄，下次會從此頁的第一個帳號重新開始。',
            resetBtnConfirmText: '重置',
            resetBtnCancelText: '取消',
            resetDone: '已重置已處理清單。',

            exportCopied: '已複製 JSON 到剪貼簿。',
            exportClipboardFail:
                '無法直接寫入剪貼簿，請手動複製下列 JSON：',

            importPromptLabel:
                '請貼上 JSON：\n支援格式：\n' +
                '1) ["id1","id2",...]\n2) {"ids":["id1","id2",...],...}',
            importJsonParseError:
                'JSON 解析失敗，請確認格式是否正確。',
            importNoIdsError:
                '找不到有效的 ids 陣列，請確認格式。\n支援：["id1","id2"] 或 {"ids":["id1","id2"],...}',
            importEmptyIdsError: '匯入的 ids 為空。',
            importConfirmReplace:
                '要覆蓋目前的「已處理清單」嗎？\n\n「確定」= 覆蓋\n「取消」= 合併',
            importConfirmReplaceOk: '覆蓋',
            importConfirmReplaceCancel: '合併',
            importDone: '匯入完成，共處理 {count} 個 ID。',
            importFileReadError: '讀取檔案時發生錯誤。',

            confirmAllDone: '此頁帳號看起來都處理完了～',

            btnOk: '確定',
            btnCancel: '取消',
            swalImportTitle: '匯入 JSON'
        },

        'zh-CN': {
            languageLabel: '语言：',
            fastBlockLabel: 'Fast Block',
            fastBlockTitle: 'Fast Block（自动打开菜单、点击封锁并确认）',
            alertTooManyAttempts:
                'Fast Block 多次尝试失败，可能是 DOM 结构已变更，或该账号已经被封锁。',
            alertNotFound:
                '找不到 userActions / block 菜单项，请确认当前在用户主页。',

            panelTitle: 'X 批量封锁工具',
            statusIdle: '状态：待机',
            statusPaused: '状态：已暂停',
            statusRunning: '状态：运行中',
            statusDone: '状态：已完成（本页无剩余账号）',
            progressLabel: '进度：',
            progressPageSuffix: '（本页）',
            nextLabel: '下一个：',
            nextEstimateLabel: '下一个（预估）：',
            nextNone: '下一个：--',
            nextPausedSuffix: '（暂停中）',
            secondsSuffix: ' 秒',
            taskStartLabel: '任务启动时间：',
            runtimeLabel: '运行时间：',
            runtimeUnknown: '--:--:--',
            taskStartUnknown: '--',

            btnStart: '开始',
            btnPause: '暂停',
            btnReset: '重置已处理',
            btnExportFile: '导出文件',
            btnExportCopy: '复制 JSON',
            btnImportJson: '导入 JSON',
            btnImportFile: '选择文件',

            confirmStartMessage:
                '将以「约每分钟 2 个」的速度依次打开新标签并尝试封锁。\n' +
                '本页剩余：约 {pending} 个，已标记处理：{done} 个。\n\n' +
                '已处理的 Twitter ID 会记录在 localStorage（按 ID，而非索引），\n' +
                '下次会跳过已经处理过的账号。\n\n确定要开始吗？',

            pageAllDoneInfo: '看起来这一页的账号都已经处理完了 (´･ω･`)',
            pausedInfo:
                '已暂停批量封锁，可以之后从当前进度继续。',
            resetConfirm:
                '确定要重置「已处理的 Twitter ID」吗？\n\n这会清除本地 localStorage 中的记录，下次会从本页第一个账号重新开始。',
            resetBtnConfirmText: '重置',
            resetBtnCancelText: '取消',
            resetDone: '已重置已处理列表。',

            exportCopied: '已复制 JSON 到剪贴板。',
            exportClipboardFail:
                '无法直接写入剪贴板，请手动复制下面的 JSON：',

            importPromptLabel:
                '请粘贴 JSON：\n支持格式：\n' +
                '1) ["id1","id2",...]\n2) {"ids":["id1","id2",...],...}',
            importJsonParseError:
                'JSON 解析失败，请确认格式是否正确。',
            importNoIdsError:
                '找不到有效的 ids 数组，请确认格式。\n支持：["id1","id2"] 或 {"ids":["id1","id2"],...}',
            importEmptyIdsError: '导入的 ids 为空。',
            importConfirmReplace:
                '要覆盖当前的「已处理列表」吗？\n\n「确定」= 覆盖\n「取消」= 合并',
            importConfirmReplaceOk: '覆盖',
            importConfirmReplaceCancel: '合并',
            importDone: '导入完成，共处理 {count} 个 ID。',
            importFileReadError: '读取文件时发生错误。',

            confirmAllDone: '本页账号看起来都已经处理完了～',

            btnOk: '确定',
            btnCancel: '取消',
            swalImportTitle: '导入 JSON'
        }
    };

    function detectInitialLang() {
        try {
            const stored =
                (typeof localStorage !== 'undefined' &&
                    localStorage.getItem('xAutoBlock_lang')) ||
                null;
            if (stored && I18N[stored]) return stored;
        } catch (e) {
            // ignore
        }

        let nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (nav.startsWith('ja')) return 'ja';
        if (nav.startsWith('ko')) return 'ko';
        if (nav === 'zh-tw' || nav === 'zh-hk' || nav === 'zh-mo') return 'zh-TW';
        if (nav === 'zh-cn' || nav === 'zh-sg') return 'zh-CN';
        return 'en';
    }

    let currentLang = detectInitialLang();

    function tr(key) {
        const pack = I18N[currentLang] || I18N['en'];
        return pack[key] || I18N['en'][key] || key;
    }

    function trf(key, vars) {
        let s = tr(key);
        if (!vars) return s;
        return s.replace(/\{(\w+)\}/g, (m, k) =>
            Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m
        );
    }

    /* -------------------------------------------------
     * SweetAlert2 載入（非阻塞）
     * ------------------------------------------------- */

    let swalLoading = false;

    function ensureSweetAlert() {
        if (window.Swal && window.Swal.fire) return;
        if (swalLoading) return;
        swalLoading = true;

        const cssId = 'x-autoblock-swal2-css';
        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href =
                'https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.23.0/sweetalert2.css';
            link.integrity =
                'sha512-/j+6zx45kh/MDjnlYQL0wjxn+aPaSkaoTczyOGfw64OB2CHR7Uh5v1AML7VUybUnUTscY5ck/gbGygWYcpCA7w==';
            link.crossOrigin = 'anonymous';
            link.referrerPolicy = 'no-referrer';
            document.head.appendChild(link);
        }

        const jsId = 'x-autoblock-swal2-js';
        if (document.getElementById(jsId)) return;

        const script = document.createElement('script');
        script.id = jsId;
        script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.23.0/sweetalert2.min.js';
        script.integrity =
            'sha512-pnPZhx5S+z5FSVwy62gcyG2Mun8h6R+PG01MidzU+NGF06/ytcm2r6+AaWMBXAnDHsdHWtsxS0dH8FBKA84FlQ==';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        document.head.appendChild(script);
    }

    /* -------------------------------------------------
     * Alert / Confirm / Prompt 包裝（可 fallback）
     * ------------------------------------------------- */

    function swalAlert(text, icon = 'info', title = '') {
        if (!window.Swal || !window.Swal.fire) {
            alert((title ? title + '\n' : '') + text);
            return Promise.resolve();
        }
        return Swal.fire({
            icon,
            title: title || undefined,
            text,
            confirmButtonText: tr('btnOk')
        });
    }

    async function swalConfirm(text, opts = {}) {
        if (!window.Swal || !window.Swal.fire) {
            const ok = confirm(
                (opts.title ? opts.title + '\n' : '') + text
            );
            return ok;
        }
        const result = await Swal.fire({
            icon: opts.icon || 'question',
            title: opts.title || '',
            text,
            showCancelButton: true,
            confirmButtonText: opts.confirmText || tr('btnOk'),
            cancelButtonText: opts.cancelText || tr('btnCancel'),
            reverseButtons: true
        });
        return result.isConfirmed;
    }

    async function swalPromptTextarea(text, opts = {}) {
        if (!window.Swal || !window.Swal.fire) {
            const v = prompt(
                (opts.title ? opts.title + '\n\n' : '') + text,
                opts.defaultValue || ''
            );
            return v ?? null;
        }
        const result = await Swal.fire({
            icon: opts.icon || 'question',
            title: opts.title || tr('swalImportTitle'),
            input: 'textarea',
            inputLabel: text,
            inputValue: opts.defaultValue || '',
            inputAttributes: {
                spellcheck: 'false',
                style: 'font-family: monospace; min-height: 150px;'
            },
            showCancelButton: true,
            confirmButtonText: opts.confirmText || tr('btnOk'),
            cancelButtonText: opts.cancelText || tr('btnCancel')
        });
        if (result.isConfirmed && result.value) {
            return result.value;
        }
        return null;
    }

    /* -------------------------------------------------
     * 工具：bulk 模式 ID 傳遞 / 回報
     * ------------------------------------------------- */

    function getBulkIdFromUrl() {
        try {
            const params = new URLSearchParams(location.search);
            return params.get('xid');
        } catch (e) {
            return null;
        }
    }

    function notifyOpener(type) {
        const id = getBulkIdFromUrl();
        if (!id) return;
        if (!window.opener || window.opener.closed) return;
        try {
            window.opener.postMessage(
                {
                    source: 'XAutoBlock',
                    type,
                    id
                },
                '*'
            );
        } catch (e) {
            console.warn('[X AutoBlock] postMessage failed:', e);
        }
    }

    /* -------------------------------------------------
     * 共用：X 封鎖邏輯
     * ------------------------------------------------- */

    function clickConfirmIfAny() {
        const confirmBtn = document.querySelector(
            'div[data-testid="confirmationSheetDialog"] button[data-testid="confirmationSheetConfirm"]'
        );
        if (confirmBtn) {
            console.log('[X AutoBlock] confirmationSheetConfirm found:', confirmBtn);
            confirmBtn.click();

            notifyOpener('blocked');

            setTimeout(() => {
                try {
                    window.close();
                } catch (e) {
                    console.warn('[X AutoBlock] window.close() failed', e);
                }
            }, 1500);

            return true;
        }
        return false;
    }

    function clickBlockMenuitemIfAny() {
        const blockItem = document.querySelector(
            'div[role="menuitem"][data-testid="block"]'
        );
        if (!blockItem) return false;

        console.log('[X AutoBlock] block menuitem found:', blockItem);
        blockItem.style.outline = '2px solid red';
        setTimeout(() => {
            blockItem.style.outline = '';
        }, 800);

        blockItem.click();
        console.log('[X AutoBlock] block menuitem clicked.');
        return true;
    }

    function clickUserActionsIfAny() {
        const moreBtn = document.querySelector('button[data-testid="userActions"]');
        if (!moreBtn) return false;

        console.log('[X AutoBlock] userActions button found:', moreBtn);
        moreBtn.style.outline = '2px solid lime';
        setTimeout(() => {
            moreBtn.style.outline = '';
        }, 800);

        moreBtn.click();
        console.log('[X AutoBlock] userActions button clicked.');
        return true;
    }

    function isAlreadyBlocked() {
        const unblockBtn = document.querySelector('button[data-testid$="-unblock"]');
        if (!unblockBtn) return false;

        console.log('[X AutoBlock] This user is already blocked, skip blocking.');
        unblockBtn.style.outline = '2px solid orange';
        setTimeout(() => {
            unblockBtn.style.outline = '';
        }, 800);

        notifyOpener('alreadyBlocked');

        setTimeout(() => {
            try {
                window.close();
            } catch (e) {
                console.warn(
                    '[X AutoBlock] window.close() failed (already blocked case)',
                    e
                );
            }
        }, 1500);

        return true;
    }

    async function runAutoBlock(step = 0) {
        console.log('[X AutoBlock] step =', step);
        if (step > 5) {
            console.log('[X AutoBlock] too many attempts, abort.');
            await swalAlert(
                tr('alertTooManyAttempts'),
                'error'
            );
            return;
        }

        if (isAlreadyBlocked()) {
            console.log('[X AutoBlock] already blocked, nothing to do.');
            return;
        }

        if (clickConfirmIfAny()) {
            console.log('[X AutoBlock] Confirm clicked, done.');
            return;
        }

        if (clickBlockMenuitemIfAny()) {
            setTimeout(() => {
                if (!clickConfirmIfAny()) {
                    runAutoBlock(step + 1);
                }
            }, 400);
            return;
        }

        if (clickUserActionsIfAny()) {
            setTimeout(() => runAutoBlock(step + 1), 500);
            return;
        }

        console.log('[X AutoBlock] Neither confirm, block menuitem, nor userActions found.');
        await swalAlert(
            tr('alertNotFound'),
            'warning'
        );
    }

    /* -------------------------------------------------
     * X / Twitter 頁面：inline Fast Block 按鈕 + 自動模式
     * ------------------------------------------------- */

    function attachInlineFastBlockButton() {
        // 已經有就不重複插
        if (document.getElementById('x-fastblock-btn-inline')) return;

        // 三個點按鈕
        const moreBtn = document.querySelector('button[data-testid="userActions"]');
        if (!moreBtn) return;

        const wrapper = moreBtn.parentElement;
        if (!wrapper) return;

        // 包 Follow 的那個 block
        const placement = wrapper.querySelector('[data-testid="placementTracking"]');
        if (!placement) return;

        // 內層 container（css-175oi2r r-6gpygo）
        const innerContainer = placement.querySelector('.css-175oi2r.r-6gpygo');
        if (!innerContainer) return;

        const followBtn = innerContainer.querySelector('button[role="button"]');
        if (!followBtn) return;

        // ✅ 複製整個 container（包含 layout），讓 Fast Block 位置跟 Follow 完全一致
        const fastContainer = innerContainer.cloneNode(true);
        const fastBtn =
            fastContainer.querySelector('button[role="button"]') ||
            fastContainer.querySelector('button');

        if (!fastBtn) return;

        fastBtn.id = 'x-fastblock-btn-inline';
        fastBtn.removeAttribute('data-testid');       // 避免和 follow 撞 testid
        fastBtn.removeAttribute('aria-describedby'); // 不用 tooltip id
        fastBtn.setAttribute('aria-label', tr('fastBlockLabel'));
        fastBtn.title = tr('fastBlockTitle');

        // 改裡面的文字
        const labelSpan = fastBtn.querySelector('span.css-1jxf684');
        if (labelSpan) {
            labelSpan.textContent = tr('fastBlockLabel');
        } else {
            fastBtn.textContent = tr('fastBlockLabel');
        }

        // 顏色改成紅危險按鈕，但維持原本 padding / 圓角 / 字體
        fastBtn.style.borderColor = 'rgb(244, 33, 46)';
        fastBtn.style.backgroundColor = 'rgba(244, 33, 46, 0.08)';

        const textContainer = fastBtn.querySelector('div[dir="ltr"]');
        if (textContainer) {
            textContainer.style.color = 'rgb(244, 33, 46)';
        } else {
            fastBtn.style.color = 'rgb(244, 33, 46)';
        }

        fastBtn.addEventListener('mouseenter', () => {
            fastBtn.style.backgroundColor = 'rgba(244, 33, 46, 0.18)';
        });
        fastBtn.addEventListener('mouseleave', () => {
            fastBtn.style.backgroundColor = 'rgba(244, 33, 46, 0.08)';
        });

        // 點擊改成跑封鎖邏輯
        fastBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            runAutoBlock(0);
        });

        // 稍微跟 Follow 拉開一點距離
        fastContainer.style.marginLeft = '8px';
        // 插在 placement 旁邊，結構變成：
        // [userActions] [placement(=Follow)] [fastContainer(=Fast Block)]
        if (placement.nextSibling) {
            wrapper.insertBefore(fastContainer, placement.nextSibling);
        } else {
            wrapper.appendChild(fastContainer);
        }

        console.log('[X AutoBlock] Inline Fast Block button attached (cloned container).');
    }

    function initOnTwitter() {
        // 1. 裝上 inline Fast Block
        attachInlineFastBlockButton();
        // 2. SPA 模式下，profile 切換時重新嘗試掛上
        setInterval(attachInlineFastBlockButton, 1500);

        // 3. 有 ?xautoblock=1 的情況自動執行（批次模式開出來的分頁）
        try {
            const params = new URLSearchParams(location.search);
            if (params.has('xautoblock')) {
                console.log(
                    '[X AutoBlock] bulk mode detected via ?xautoblock, will auto run.'
                );
                setTimeout(() => {
                    runAutoBlock(0);
                }, 2000);
            }
        } catch (e) {
            console.warn('[X AutoBlock] URLSearchParams error:', e);
        }
    }

    /* -------------------------------------------------
     * pluto0x0 清單頁：批次開啟封鎖（用 postMessage 確認成功）
     * ------------------------------------------------- */

    function initOnListPage() {
        const INTERVAL_MS = 30 * 1000; // 30 秒一筆
        const STORAGE_KEY_IDS = 'xBulkBlock_doneIds_v1';
        const STORAGE_KEY_STATE = 'xBulkBlock_runState_v1';

        // 從頁面副標解析「總頁數 / 當前頁 / 總帳號數 / 本頁帳號數」
        let totalPages = null;
        let currentPageIndex = null;
        let totalAccountsAll = null;
        let totalAccountsThisPageText = null;

        function parseSubtitleMeta() {
            try {
                const sub = document.querySelector('p.page-subtitle');
                if (!sub) return;

                const text = sub.textContent || '';
                // 例：共 48 页 · 当前第 1 页 · 共 9415 账号 · 本页 200 账号
                const nums = text.match(/(\d+)/g);
                if (!nums || nums.length < 4) return;

                totalPages = parseInt(nums[0], 10) || null;  // 48
                currentPageIndex = parseInt(nums[1], 10) || null; // 1
                totalAccountsAll = parseInt(nums[2], 10) || null; // 9415
                totalAccountsThisPageText = parseInt(nums[3], 10) || null; // 200
            } catch (e) {
                console.warn('[X Bulk] parseSubtitleMeta error:', e);
            }
        }

        function loadProcessedIds() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_IDS);
                if (!raw) return {};
                const arr = JSON.parse(raw);
                if (!Array.isArray(arr)) return {};
                const map = {};
                for (const id of arr) {
                    if (typeof id === 'string' && id.length > 0) {
                        map[id] = true;
                    }
                }
                return map;
            } catch (e) {
                console.warn('[X Bulk] loadProcessedIds error:', e);
                return {};
            }
        }

        function saveProcessedIds(map) {
            try {
                const arr = Object.keys(map);
                localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(arr));
            } catch (e) {
                console.warn('[X Bulk] saveProcessedIds error:', e);
            }
        }

        function markCardDone(card) {
            card.style.opacity = '0.6';
            card.style.background = '#f0f0f0';
        }

        function clearCardStyle(card) {
            card.style.opacity = '';
            card.style.background = '';
        }

        function collectUsers(processedIds) {
            const cards = Array.from(document.querySelectorAll('.user-card'));
            const result = [];

            for (const card of cards) {
                const linkEl = card.querySelector('a[href^="https://twitter.com/"]');
                if (!linkEl) continue;

                let id = null;

                const idEl = card.querySelector('.user-id');
                if (idEl) {
                    const m = idEl.textContent.match(/(\d{5,})/);
                    if (m) {
                        id = m[1];
                    }
                }

                if (!id) {
                    const handleEl = card.querySelector('.user-handle');
                    if (handleEl) {
                        id = handleEl.textContent.trim();
                    } else {
                        id = linkEl.href;
                    }
                }

                const user = { id, url: linkEl.href, card };
                result.push(user);

                if (processedIds[id]) {
                    markCardDone(card);
                }
            }

            return result;
        }

        function getNextPageUrl() {
            const pager = document.querySelector('nav.pager');
            if (!pager) return null;

            const links = pager.querySelectorAll('a.pager-link');
            if (!links.length) return null;

            // 優先用「下一页 / Next」這種按鈕
            const lastLink = links[links.length - 1];
            const text = lastLink.textContent.trim();
            if (text.includes('下一') || /next/i.test(text)) {
                return lastLink.href || null;
            }

            // 沒有「下一頁」文字，就用 current 後面的第一個連結
            const current = pager.querySelector('.pager-link-current');
            if (!current) return null;

            const siblings = Array.from(pager.children);
            const idx = siblings.indexOf(current);
            if (idx < 0) return null;

            for (let i = idx + 1; i < siblings.length; i++) {
                const el = siblings[i];
                if (el.tagName === 'A' && el.classList.contains('pager-link')) {
                    return el.href || null;
                }
            }

            return null;
        }

        let processedIds = loadProcessedIds();
        parseSubtitleMeta();
        const allUsers = collectUsers(processedIds);

        if (!allUsers.length) {
            console.log('[X Bulk] No user cards found on this page.');
            return;
        }

        let running = false;
        let taskStartTime = null;
        let lastOpenedAt = 0;
        let totalRunMs = 0;
        let lastRunStart = null;
        let currentProcessingId = null;

        let uiTimerId = null;

        function saveRunState() {
            try {
                const payload = {
                    running,
                    taskStartTime,
                    totalRunMs
                };
                localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(payload));
            } catch (e) {
                console.warn('[X Bulk] saveRunState error:', e);
            }
        }

        function clearRunState() {
            try {
                localStorage.removeItem(STORAGE_KEY_STATE);
            } catch (e) {
                console.warn('[X Bulk] clearRunState error:', e);
            }
        }

        function restoreRunState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_STATE);
                if (!raw) return;
                const s = JSON.parse(raw);
                if (!s || typeof s !== 'object') return;

                if (typeof s.taskStartTime === 'number') {
                    taskStartTime = s.taskStartTime;
                }
                if (typeof s.totalRunMs === 'number') {
                    totalRunMs = s.totalRunMs;
                }

                if (s.running) {
                    // 表示上一頁在「運行中」時跳轉過來 → 自動接續
                    running = true;

                    // 新頁面重新開始記這一段執行時間
                    lastRunStart = Date.now();

                    // 讓一載入就符合「可以開下一個」的條件
                    lastOpenedAt = Date.now() - INTERVAL_MS;

                    // 按鈕樣式也一起還原
                    toggleBtn.textContent = tr('btnPause');
                    toggleBtn.style.background = '#ff9800';
                }
            } catch (e) {
                console.warn('[X Bulk] restoreRunState error:', e);
            }
        }

        window.addEventListener('message', (event) => {
            const data = event.data;
            if (!data || data.source !== 'XAutoBlock') return;
            const { type, id } = data;
            if (!id) return;

            console.log('[X Bulk] message from child:', data);

            if (type === 'blocked' || type === 'alreadyBlocked') {
                processedIds[id] = true;
                saveProcessedIds(processedIds);

                const user = allUsers.find((u) => u.id === id);
                if (user) markCardDone(user.card);

                if (currentProcessingId === id) {
                    currentProcessingId = null;
                }

                updateUI();
            }
        });

        const panel = document.createElement('div');
        panel.id = 'x-bulk-panel';

        Object.assign(panel.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 99999,
            padding: '8px',
            width: '300px',
            fontSize: '12px',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
        });

        const titleEl = document.createElement('div');
        Object.assign(titleEl.style, {
            fontWeight: 'bold',
            marginBottom: '4px',
            fontSize: '13px'
        });

        // 語言切換列
        const langRow = document.createElement('div');
        Object.assign(langRow.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
            gap: '6px'
        });

        const langLabel = document.createElement('span');
        langLabel.style.fontSize = '11px';

        const langSelect = document.createElement('select');
        Object.assign(langSelect.style, {
            flex: '1',
            fontSize: '11px',
            padding: '2px 4px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#222',
            color: '#fff'
        });

        const LANG_OPTIONS = [
            { value: 'en', text: 'English' },
            { value: 'ja', text: '日本語' },
            { value: 'ko', text: '한국어' },
            { value: 'zh-TW', text: '繁體中文' },
            { value: 'zh-CN', text: '简体中文' }
        ];
        LANG_OPTIONS.forEach((opt) => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.text;
            langSelect.appendChild(o);
        });
        langSelect.value = currentLang;

        langRow.appendChild(langLabel);
        langRow.appendChild(langSelect);

        const statusEl = document.createElement('div');
        const progressEl = document.createElement('div');
        const countdownEl = document.createElement('div');
        const startTimeEl = document.createElement('div');
        const runtimeEl = document.createElement('div');

        statusEl.style.marginBottom = '2px';
        progressEl.style.marginBottom = '2px';
        countdownEl.style.marginBottom = '2px';
        startTimeEl.style.marginBottom = '2px';
        runtimeEl.style.marginBottom = '6px';
        startTimeEl.style.fontSize = '11px';
        runtimeEl.style.fontSize = '11px';

        const btnRow = document.createElement('div');
        Object.assign(btnRow.style, {
            display: 'flex',
            gap: '6px',
            marginBottom: '4px'
        });

        const toggleBtn = document.createElement('button');
        Object.assign(toggleBtn.style, {
            flex: '1',
            padding: '4px 0',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            background: '#4caf50',
            color: '#fff'
        });

        const resetBtn = document.createElement('button');
        Object.assign(resetBtn.style, {
            flex: '1',
            padding: '4px 0',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            background: '#f44336',
            color: '#fff'
        });

        btnRow.appendChild(toggleBtn);
        btnRow.appendChild(resetBtn);

        const btnRow2 = document.createElement('div');
        Object.assign(btnRow2.style, {
            display: 'flex',
            gap: '6px',
            marginTop: '2px'
        });

        const exportFileBtn = document.createElement('button');
        Object.assign(exportFileBtn.style, {
            flex: '1',
            padding: '3px 0',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            background: '#2196f3',
            color: '#fff'
        });

        const exportCopyBtn = document.createElement('button');
        Object.assign(exportCopyBtn.style, {
            flex: '1',
            padding: '3px 0',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            background: '#00bcd4',
            color: '#fff'
        });

        const importBtn = document.createElement('button');
        Object.assign(importBtn.style, {
            flex: '1',
            padding: '3px 0',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            background: '#9c27b0',
            color: '#fff'
        });

        const importFileBtn = document.createElement('button');
        Object.assign(importFileBtn.style, {
            flex: '1',
            padding: '3px 0',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            background: '#8bc34a',
            color: '#fff'
        });

        btnRow2.appendChild(exportFileBtn);
        btnRow2.appendChild(exportCopyBtn);
        btnRow2.appendChild(importBtn);
        btnRow2.appendChild(importFileBtn);

        panel.appendChild(titleEl);
        panel.appendChild(langRow);
        panel.appendChild(statusEl);
        panel.appendChild(progressEl);
        panel.appendChild(countdownEl);
        panel.appendChild(startTimeEl);
        panel.appendChild(runtimeEl);
        panel.appendChild(btnRow);
        panel.appendChild(btnRow2);

        document.body.appendChild(panel);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        function formatHMS(sec) {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            const pad = (n) => String(n).padStart(2, '0');
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
        }

        function countDoneOnPage() {
            let c = 0;
            for (const u of allUsers) {
                if (processedIds[u.id]) c++;
            }
            return c;
        }

        function getNextPendingUser() {
            for (const u of allUsers) {
                if (!processedIds[u.id] && u.id !== currentProcessingId) return u;
            }
            return null;
        }

        function openNextUser() {
            const user = getNextPendingUser();
            if (!user) {
                // 這一頁沒帳號了，先看看有沒有下一頁
                const nextUrl = getNextPageUrl();

                if (nextUrl) {
                    console.log('[X Bulk] This page done, go next page:', nextUrl);

                    // 把目前這段執行時間加進 totalRunMs
                    if (running && lastRunStart) {
                        totalRunMs += Date.now() - lastRunStart;
                        lastRunStart = null;
                    }
                    
                    saveRunState();

                    // 不要關掉 running，讓 UI 保持「運行中」
                    statusEl.textContent = tr('statusDone');
                    countdownEl.textContent =
                        tr('nextLabel') + '3' + tr('secondsSuffix');

                    // 3 秒後自動跳轉下一頁
                    setTimeout(() => {
                        window.location.href = nextUrl;
                    }, 3000);

                    return;
                }

                // 真的沒有下一頁了，才停掉整個任務
                if (running && lastRunStart) {
                    totalRunMs += Date.now() - lastRunStart;
                    lastRunStart = null;
                }
                running = false;
                toggleBtn.textContent = tr('btnStart');
                toggleBtn.style.background = '#4caf50';
                statusEl.textContent = tr('statusDone');
                countdownEl.textContent = tr('nextNone');

                // ✅ 全部結束就把 runState 清掉（但記憶體裡的 totalRunMs 還在，畫面仍顯示）
                clearRunState();

                swalAlert(tr('pageAllDoneInfo'), 'success');
                return;
            }

            // --- opening profile ---
            currentProcessingId = user.id;
            lastOpenedAt = Date.now();

            try {
                const url = new URL(user.url);
                url.searchParams.set('xautoblock', '1');
                url.searchParams.set('xid', user.id);
                console.log('[X Bulk] opening:', user.id, url.toString());
                window.open(url.toString(), '_blank');
            } catch (e) {
                console.warn('[X Bulk] invalid URL for user', user, e);
            }
        }

        function updateUI() {
            // 如果一開始還沒 parse 到，再試一次
            if (totalPages === null || totalAccountsAll === null) {
                parseSubtitleMeta();
            }

            const now = Date.now();
            const total = allUsers.length;
            const done = countDoneOnPage();
            const pending = total - done;

            // 全域 done（跨頁，取自 localStorage 的 processedIds）
            const doneGlobal = Object.keys(processedIds).length;

            progressEl.textContent =
                tr('progressLabel') + `${done}/${total}` + tr('progressPageSuffix');

            let runMs = totalRunMs;
            if (running && lastRunStart) {
                runMs += now - lastRunStart;
            }

            if (!taskStartTime) {
                statusEl.textContent = tr('statusIdle');
                startTimeEl.textContent =
                    tr('taskStartLabel') + tr('taskStartUnknown');
                runtimeEl.textContent =
                    tr('runtimeLabel') + tr('runtimeUnknown');
            } else {
                const runSec = Math.floor(runMs / 1000);
                runtimeEl.textContent =
                    tr('runtimeLabel') + formatHMS(runSec);
                startTimeEl.textContent =
                    tr('taskStartLabel') +
                    new Date(taskStartTime).toLocaleTimeString();
            }

            // 小工具：在各種狀態文字後面加上「第幾頁 / 總共多少帳號」
            function buildStatusText(base) {
                let text = base;

                if (totalPages && currentPageIndex) {
                    text += ` · Page ${currentPageIndex}/${totalPages}`;
                }
                if (totalAccountsAll) {
                    const percentAll = ((doneGlobal / totalAccountsAll) * 100).toFixed(1);
                    text += ` · Total ${doneGlobal}/${totalAccountsAll} (${percentAll}%)`;
                }
                return text;
            }

            if (pending <= 0) {
                // 這一頁看起來處理完了，如果還在跑，就交給 openNextUser 判斷要不要跳下一頁
                if (running && !currentProcessingId) {
                    openNextUser();   // 裡面會自己判斷有沒有下一頁，沒有才真的全部結束
                } else {
                    statusEl.textContent = buildStatusText(tr('statusDone'));
                    countdownEl.textContent = tr('nextNone');
                }

                toggleBtn.disabled = false;
                return;
            }

            if (!running) {
                statusEl.textContent = buildStatusText(tr('statusPaused'));
            } else {
                statusEl.textContent = buildStatusText(tr('statusRunning'));
            }

            let remainingSec;
            if (!lastOpenedAt) {
                remainingSec = 0;
            } else {
                const elapsed = now - lastOpenedAt;
                const remainMs = Math.max(0, INTERVAL_MS - elapsed);
                remainingSec = Math.ceil(remainMs / 1000);
            }

            if (!running) {
                countdownEl.textContent =
                    tr('nextEstimateLabel') +
                    remainingSec +
                    tr('secondsSuffix') +
                    tr('nextPausedSuffix');
            } else {
                countdownEl.textContent =
                    tr('nextLabel') +
                    remainingSec +
                    tr('secondsSuffix');
                if (remainingSec <= 0 && !currentProcessingId) {
                    openNextUser();
                }
            }
        }

        function startBulk() {
            const total = allUsers.length;
            const done = countDoneOnPage();
            const pending = total - done;

            const now = Date.now();
            if (!taskStartTime) {
                taskStartTime = now;
            }

            if (!lastRunStart) {
                lastRunStart = now;
            }

            if (!lastOpenedAt) {
                // 讓第一次更新 UI 時，立刻有資格開第一個帳號
                lastOpenedAt = now - INTERVAL_MS;
            }

            running = true;
            toggleBtn.textContent = tr('btnPause');
            toggleBtn.style.background = '#ff9800';

            saveRunState();
            updateUI();   // ⬅ 這裡會看到 pending=0，就直接叫 openNextUser() 幫你跳下一頁
        }

        function pauseBulk() {
            const now = Date.now();
            if (running && lastRunStart) {
                totalRunMs += now - lastRunStart;
                lastRunStart = null;
            }
            running = false;
            toggleBtn.textContent = tr('btnStart');
            toggleBtn.style.background = '#4caf50';
            saveRunState();
            updateUI();
        }

        function buildExportJson() {
            const arr = Object.keys(processedIds);
            const payload = {
                version: 1,
                type: 'xBulkBlock_doneIds',
                ids: arr
            };
            return JSON.stringify(payload, null, 2);
        }

        function exportAsFile() {
            const json = buildExportJson();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `xBulkBlock_doneIds_${ts}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        }

        async function exportToClipboard() {
            const json = buildExportJson();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(json);
                    await swalAlert(tr('exportCopied'), 'success');
                    return;
                } catch (e) {
                    console.warn('[X Bulk] clipboard.writeText failed:', e);
                }
            }
            await swalPromptTextarea(tr('exportClipboardFail'), {
                defaultValue: json,
                title: tr('panelTitle')
            });
        }

        function parseImportJson(text) {
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                return { error: tr('importJsonParseError') };
            }

            let idsArr = null;
            if (Array.isArray(data)) {
                idsArr = data;
            } else if (data && Array.isArray(data.ids)) {
                idsArr = data.ids;
            }

            if (!idsArr) {
                return { error: tr('importNoIdsError') };
            }

            const cleanIds = [];
            for (const v of idsArr) {
                if (typeof v === 'string' && v.length > 0) cleanIds.push(v);
            }
            if (!cleanIds.length) {
                return { error: tr('importEmptyIdsError') };
            }

            return { ids: cleanIds };
        }

        async function applyImportedIds(cleanIds) {
            const replace = await swalConfirm(
                tr('importConfirmReplace'),
                {
                    confirmText: tr('importConfirmReplaceOk'),
                    cancelText: tr('importConfirmReplaceCancel')
                }
            );

            if (replace) {
                processedIds = {};
            }

            for (const id of cleanIds) {
                processedIds[id] = true;
            }
            saveProcessedIds(processedIds);

            for (const u of allUsers) {
                if (processedIds[u.id]) {
                    markCardDone(u.card);
                } else {
                    clearCardStyle(u.card);
                }
            }

            updateUI();
            await swalAlert(
                trf('importDone', { count: cleanIds.length }),
                'success'
            );
        }

        async function importFromJsonPrompt() {
            const text = await swalPromptTextarea(
                tr('importPromptLabel'),
                {
                    title: tr('swalImportTitle'),
                    confirmText: tr('btnImportJson'),
                    cancelText: tr('btnCancel')
                }
            );
            if (!text) return;

            const result = parseImportJson(text);
            if (result.error) {
                await swalAlert(result.error, 'error');
                return;
            }

            await applyImportedIds(result.ids);
        }

        async function importFromFile(file) {
            try {
                const text = await file.text();
                const result = parseImportJson(text);
                if (result.error) {
                    await swalAlert(result.error, 'error');
                    return;
                }
                await applyImportedIds(result.ids);
            } catch (e) {
                console.warn('[X Bulk] importFromFile error:', e);
                await swalAlert(tr('importFileReadError'), 'error');
            }
        }

        function refreshStaticTexts() {
            titleEl.textContent = tr('panelTitle');
            langLabel.textContent = tr('languageLabel');
            toggleBtn.textContent = running ? tr('btnPause') : tr('btnStart');
            resetBtn.textContent = tr('btnReset');
            exportFileBtn.textContent = tr('btnExportFile');
            exportCopyBtn.textContent = tr('btnExportCopy');
            importBtn.textContent = tr('btnImportJson');
            importFileBtn.textContent = tr('btnImportFile');
        }

        toggleBtn.addEventListener('click', async () => {
            if (!running) {
                const total = allUsers.length;
                const done = countDoneOnPage();
                const pending = total - done;

                const ok = await swalConfirm(
                    trf('confirmStartMessage', { pending, done })
                );
                if (!ok) return;

                startBulk();
            } else {
                pauseBulk();
                await swalAlert(tr('pausedInfo'), 'info');
            }
        });

        resetBtn.addEventListener('click', async () => {
            const ok = await swalConfirm(
                tr('resetConfirm'),
                { icon: 'warning', confirmText: tr('resetBtnConfirmText'), cancelText: tr('resetBtnCancelText') }
            );
            if (!ok) return;

            processedIds = {};
            saveProcessedIds(processedIds);
            for (const u of allUsers) {
                clearCardStyle(u.card);
            }
            running = false;
            taskStartTime = null;
            lastOpenedAt = 0;
            totalRunMs = 0;
            lastRunStart = null;
            currentProcessingId = null;
            toggleBtn.textContent = tr('btnStart');
            toggleBtn.style.background = '#4caf50';
            toggleBtn.disabled = false;

            clearRunState();
            updateUI();
            await swalAlert(tr('resetDone'), 'success');
        });

        exportFileBtn.addEventListener('click', () => {
            exportAsFile();
        });

        exportCopyBtn.addEventListener('click', () => {
            exportToClipboard();
        });

        importBtn.addEventListener('click', () => {
            importFromJsonPrompt();
        });

        importFileBtn.addEventListener('click', () => {
            fileInput.value = '';
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            importFromFile(file);
        });

        langSelect.addEventListener('change', () => {
            currentLang = langSelect.value;
            try {
                localStorage.setItem('xAutoBlock_lang', currentLang);
            } catch (e) {
                // ignore
            }
            refreshStaticTexts();
            updateUI();
        });

        // 先還原跨頁 state，再根據目前 running/時間 等來畫畫面
        restoreRunState();
        refreshStaticTexts();
        updateUI();
        uiTimerId = setInterval(updateUI, 1000);

        window.addEventListener('beforeunload', () => {
            if (uiTimerId) clearInterval(uiTimerId);
        });

        ensureSweetAlert();
    }

    /* -------------------------------------------------
     * 依 host 分流初始化
     * ------------------------------------------------- */

    if (HOST === 'x.com' || HOST === 'twitter.com') {
        initOnTwitter();
        ensureSweetAlert();
    } else if (HOST === 'pluto0x0.github.io') {
        initOnListPage();
        ensureSweetAlert();
    }
})();
