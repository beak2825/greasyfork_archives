// ==UserScript==
// @name         00 Airワーク勤務地 自動入力＋連続登録
// @description  スプレッドシートIDとシート名をURLクエリから読み取り自動入力／保存は手動／E列「省略する」で建物名チェックON
// @match        https://ats.rct.airwork.net/settings/working_locations*
// @version      202512060956
// @grant        none
// @namespace    https://greasyfork.org/ja/scripts/556950/versions/new

// @downloadURL https://update.greasyfork.org/scripts/556950/00%20Air%E3%83%AF%E3%83%BC%E3%82%AF%E5%8B%A4%E5%8B%99%E5%9C%B0%20%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B%EF%BC%8B%E9%80%A3%E7%B6%9A%E7%99%BB%E9%8C%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/556950/00%20Air%E3%83%AF%E3%83%BC%E3%82%AF%E5%8B%A4%E5%8B%99%E5%9C%B0%20%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B%EF%BC%8B%E9%80%A3%E7%B6%9A%E7%99%BB%E9%8C%B2.meta.js
// ==/UserScript==

(async function() {
  console.log('--- Airwork勤務地 自動入力スクリプト：URLパラメータ＆建物名省略チェック対応 ---');

  const params = new URLSearchParams(location.search);
  let spreadsheetId = params.get('spreadsheet');
  const sheetName = params.get('sheet');

  if (spreadsheetId) spreadsheetId = spreadsheetId.replace(/__DASH__/g, '--');

  if (!spreadsheetId || !sheetName) {
    console.error('URLに spreadsheet および sheet のパラメータが必要です');
    return;
  }

  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  const res = await fetch(csvUrl);
  const text = await res.text();

  const parseCSV = (str) => {
    const rows = [];
    let current = [], value = '', inQuotes = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i], next = str[i + 1];

      if (char === '"' && inQuotes && next === '"') {
        value += '"'; i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        current.push(value); value = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (value || current.length) {
          current.push(value); rows.push(current); current = []; value = '';
        }
      } else {
        value += char;
      }
    }
    if (value || current.length) current.push(value);
    if (current.length) rows.push(current);
    return rows;
  };

  const rows = parseCSV(text);
  const dataRows = rows.slice(5); // 6行目以降

  const prefMap = {
    '北海道':'01','青森県':'02','岩手県':'03','宮城県':'04','秋田県':'05','山形県':'06','福島県':'07',
    '茨城県':'08','栃木県':'09','群馬県':'10','埼玉県':'11','千葉県':'12','東京都':'13','神奈川県':'14',
    '新潟県':'15','富山県':'16','石川県':'17','福井県':'18','山梨県':'19','長野県':'20','岐阜県':'21',
    '静岡県':'22','愛知県':'23','三重県':'24','滋賀県':'25','京都府':'26','大阪府':'27','兵庫県':'28',
    '奈良県':'29','和歌山県':'30','鳥取県':'31','島根県':'32','岡山県':'33','広島県':'34','山口県':'35',
    '徳島県':'36','香川県':'37','愛媛県':'38','高知県':'39','福岡県':'40','佐賀県':'41','長崎県':'42',
    '熊本県':'43','大分県':'44','宮崎県':'45','鹿児島県':'46','沖縄県':'47'
  };

  const fill = (el, value) => {
    if (!el) return;
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  };

  let currentIndex = 0;
  let processing = false;

  const inputData = async (row) => {
    const dialog = document.querySelector('div[role="dialog"]');
    if (!dialog) return;
    console.log(`入力中 (${currentIndex + 1}/${dataRows.length})：${row[0]}`);

    let isUserIntervened = false;

    // ユーザー操作検出用リスナー追加
    const detectUserInput = (e) => {
      if (!e.isTrusted) return;
      isUserIntervened = true;
      console.log('[監視] ユーザー操作検出 → 自動保存キャンセル');
    };
    dialog.addEventListener('input', detectUserInput, { capture: true, once: true });
    dialog.addEventListener('keydown', detectUserInput, { capture: true, once: true });

    fill(dialog.querySelector('input[name="name"]'), row[0]);
    fill(dialog.querySelector('input[name="postcode"]'), row[1]);

    const pref = dialog.querySelector('select[name="prefectureJisCd"]');
    if (pref && prefMap[row[2]]) {
      pref.value = prefMap[row[2]];
      pref.dispatchEvent(new Event('change', { bubbles: true }));
    }

    fill(dialog.querySelector('input[name="cityArea"]'), row[3]);
    fill(dialog.querySelector('input[name="buildingName"]'), row[5]);

    const omitCheck = dialog.querySelector('input[name="isInactiveBuildingName"]');
    if (omitCheck && row[4] === '省略する') {
      if (!omitCheck.checked) omitCheck.click();
    }

    const accessText = (row[6] || '').replace(/[\r\n]+/g, '／').trim();
    fill(dialog.querySelector('input[name="access"]'), accessText);
    fill(dialog.querySelector('textarea[name="memo"]'), row[7] || "");

    const waitUntilEnabled = setInterval(() => {
      const saveBtn = dialog.querySelector('button[data-la="working_locations_dialog_save_btn_click"]');
      if (saveBtn && !saveBtn.disabled && !isUserIntervened) {
        clearInterval(waitUntilEnabled);
        console.log('保存ボタン有効化 → 自動クリックします');
        saveBtn.click();
      }
    }, 500);
  };

  const observer = new MutationObserver(() => {
    const dialog = document.querySelector('div[role="dialog"]');

    if (dialog && !processing) {
      processing = true;
      inputData(dataRows[currentIndex]);
    }

    if (!dialog && processing) {
      processing = false;
      if (currentIndex + 1 < dataRows.length) {
        currentIndex++;
        console.log(`保存完了 → 次(${currentIndex + 1}/${dataRows.length})を開きます`);

        const waitBtn = setInterval(() => {
          const btn = document.querySelector('button[data-theme="primary"][aria-label="新しい勤務地を追加する"]');
          if (btn && btn.offsetParent !== null) {
            clearInterval(waitBtn);
            console.log('ボタン再出現を検出 → クリック実行');
            setTimeout(() => btn.click(), 100);
          }
        }, 100);

      } else {
        console.log('全データ入力完了');
        observer.disconnect();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('準備完了：最初の「新しい勤務地を追加する」を押してください。');
})();
