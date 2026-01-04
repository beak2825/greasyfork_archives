// ==UserScript==
// @name        SHARE/OTM Attendance Record Check Tool (M13)
// @namespace   ta.iwata@scsk.jp
// @match       https://we.scskinfo.jp/otm2/OTMServlet*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant       none
// @version     1.1
// @description OTM画面での基本5項目チェック（①打刻と実績の乖離、②PC乖離不備、③打刻忘れ不備）
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557601/SHAREOTM%20Attendance%20Record%20Check%20Tool%20%28M13%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557601/SHAREOTM%20Attendance%20Record%20Check%20Tool%20%28M13%29.meta.js
// ==/UserScript==

class StyleManager {
  constructor() {
    this.styles = [];
    if ($("#tooltip-style").length === 0) {
      $("head").append(`
        <style id="tooltip-style">
          .error-tooltip {
            background-color: #333;
            color: #fff;
            padding: 3px 6px;
            border-radius: 4px;
            position: absolute;
            z-index: 1000;
            white-space: nowrap;
            font-size: 9.6px;
            transition: opacity 0.2s;
            opacity: 1;
          }

          .error-tooltip .tooltip-arrow {
            position: absolute;
            top: -3.5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 4px solid #333;
          }
        </style>
      `);
    }
    $(window).on("resize scroll", () => { this.#updatePositions(); });
  }

  addTooltip($target, message, bgColor = "lightpink") {
    this.removeStyle($target);

    if ($target.css("position") === "static") {
      $target.css("position", "relative");
    }

    const $tooltip = $(`
      <div class="error-tooltip">
        ${message}
        <div class="tooltip-arrow"></div>
      </div>
    `);
    $target.append($tooltip);
    $target.css("background-color", bgColor);

    $tooltip.css({
      top:  $target.outerHeight() * 2 / 3,
      left: $target.outerWidth()  / 2,
      transform: "translateX(-50%)"
    });

    $target.off("mouseenter.tooltip mouseleave.tooltip");
    $target.on("mouseenter.tooltip", () => { $tooltip.css("opacity", 0); });
    $target.on("mouseleave.tooltip", () => { $tooltip.css("opacity", 1); });

    this.styles.push({$tooltip: $tooltip, $target: $target});
  }

  addColor($target, bgColor = "lightyellow") {
    this.removeStyle($target);

    if ($target.css("position") === "static") {
      $target.css("position", "relative");
    }
    $target.css("background-color", bgColor);

    this.styles.push({$tooltip: $(``), $target: $target});
  }


  getStyleInfo($target) {
    return this.styles.find(info => info.$target[0] === $target[0]) || null;
  }

  hasStyle($target) {
    const info = this.getStyleInfo($target);
    return !!(info && info.$tooltip);
  }

  removeStyle($target) {
    const index = this.styles.findIndex(info => info.$target[0] === $target[0]);
    if (index >= 0) {
      this.styles[index].$tooltip.remove();
      this.styles.splice(index, 1);
    }
  }

  clearAll() {
    this.styles.forEach(info => info.$tooltip.remove());
    this.styles = [];
  }

  #updatePositions() {
    this.styles.forEach(info => {
      const $target = info.$target;
      if (info.$tooltip) {
        info.$tooltip.css({
          top: $target.outerHeight() * 2 / 3,
          left: $target.outerWidth() / 2
        });
      }
    });
  }
}

class AttendanceRecord {
  constructor(props = {}) {
    const defaults = {
      state:null, day:null, date:null, dayOfWeek:null,
      employeeId:null, employeeName:null, workType:null,
      plannedStart:null, plannedEnd:null,
      clockIn:null, clockOut:null,
      workStart:null, workEnd:null,
      breaktime:null,
      workReason:null,
      pcStart:null, pcEnd:null,
      mistakeStart:null, mistakeEnd:null, mistakeReason:null,
      notification:null
    };
    Object.assign(this, defaults, props);

    // jQuery要素→文字列 & 要素の両方を安全に取得できるプロパティを定義
    Object.keys(defaults).forEach(key => {
      const v = props[key];
      if (v && typeof v.text === 'function') {
        Object.defineProperty(this, key, {
          get() {
            try { return (v && typeof v.text === 'function') ? v.text().trim() : ''; }
            catch(e) { return ''; }
          }, configurable:true, enumerable:true
        });
        Object.defineProperty(this, `$${key}`, {
          get() { return (v && v.length !== undefined) ? v : $(); },
          configurable:true, enumerable:true
        });
      } else {
        Object.defineProperty(this, key, {
          get() { return (typeof v === 'string') ? v : (v ?? ''); },
          configurable:true, enumerable:true
        });
        Object.defineProperty(this, `$${key}`, {
          get() { return $(); }, configurable:true, enumerable:true
        });
      }
    });
  }
}

class AttendanceRecordValidator {
  validate(styleMgr, record) {
  //this.#validateClockEnvironment(styleMgr, record);
    this.#validateWorkTime(styleMgr, record);
    this.#validateMistakeReason(styleMgr, record);
  //this.#validateHolidayPCTime(styleMgr, record);
    this.#validateClockWorkReason(styleMgr, record);
    this.#validateBreaktimeReason(styleMgr, record);
  }

  // 1) 打刻環境（VDI以外から？）警告
  /*
  #validateClockEnvironment(styleMgr, record) {
    for (const prop of ["clockIn", "clockOut"]) {
      const text = record[prop];
      const $cell = record["$" + prop];
      if (!text || text === ":") continue;
      if ($cell && $cell.length && ($cell.attr("class") === "data_cell_small_ia")) {
        styleMgr.addTooltip($cell, "打刻環境", "lightyellow");
      }
    }
  }
  */

  // 2) 打刻時間と就業時間の差異（誤差／食い違い）
  #validateWorkTime(styleMgr, record) {
    const pairs = [
      ["plannedStart", "workStart", "clockIn"],
      ["plannedEnd",   "workEnd",   "clockOut"]
    ];
    for (const [plannedStr, workStr, clockStr] of pairs) {
      const planned = record[plannedStr];
      const work    = record[workStr];
      const clock   = record[clockStr];
      if (!clock || clock === ":") continue;
      if (work && clock && work !== clock) {
        const $workCell = record["$" + workStr];
        if (!$workCell || $workCell.length === 0) continue;
          styleMgr.addTooltip($workCell, "打刻⇔就業時間：差異あり", "lightyellow");
      }
    }
  }

  // 3) PCかい離理由の不備（抜け／不適切）
  #validateMistakeReason(styleMgr, record) {
    const mistakeReasonList = ["セットアップ期間", "業務外"];
    const $reasonCell = record.$mistakeReason;
    const reasonText = record.mistakeReason || "";

    for (const prop of ["$mistakeStart", "$mistakeEnd"]) {
      const $cell = record[prop];
      if (!$cell || $cell.length === 0) continue;
      const style = ($cell.attr("style") || "").replace(/\s+/g, "");
      const isDeviation = style.toLowerCase().includes("background-color:#ffcccc;");
      if (!isDeviation) continue;

      if (reasonText.length > 0) {
        const ok = mistakeReasonList.some(s => reasonText.includes(s));
        if (!ok) styleMgr.addTooltip($reasonCell, "かい離発生：理由確認");
      } else {
        styleMgr.addTooltip($reasonCell, "かい離発生：記載無");
      }
    }
  }

  // 4) 休日・有休日にPC時間登録がある（注意）
  /*
  #validateHolidayPCTime(styleMgr, record) {
    const isHolidayOrPaid = (txt) => {
      const t = (txt || "").trim();
      return ["休日", "有給休暇", "有休"].some(k => t.includes(k));
    };
    const holidayFlag =
      isHolidayOrPaid(record.workType) ||
      isHolidayOrPaid(record.workReason) ||
      isHolidayOrPaid(record.mistakeReason);
    if (!holidayFlag) return;

    for (const prop of ["pcStart", "pcEnd"]) {
      const val = record[prop];
      const $cell = record["$" + prop];
      if (val && val !== ":" && $cell && $cell.length) {
        styleMgr.addTooltip($cell, "休日勤務", "lightyellow");
      }
    }
  }
  */

  // 5) 打刻忘れ時の「理由」不備（免除：届出「有休」／週末）
  #validateClockWorkReason(styleMgr, record) {
    const workReasonList = {
      "clockIn":  ["打刻忘れ", "打刻わすれ", "打刻ミス"],
      "clockOut": ["打刻忘れ", "打刻わすれ", "打刻ミス"]
    };
    const reasonText = record.workReason || "";
    const notificationText = (record.notification || "");
    const dayOfWeekText = (record.dayOfWeek || "");
    const dateText = (record.date || "");

    // 週末（土/日）・届出「有休」の免除フラグ
    const isWeekend = ["土", "日"].some(k => dayOfWeekText.includes(k) || dateText.includes(k));
    const isPaidLeaveByNotification = notificationText.includes("休");
    // ver1.1 裁量だと勤務予定届を出さないため、空白もチェック対象に変更
    // const isNotWorkDay = notificationText.trim() === '';


    for (const key of Object.keys(workReasonList)) {
      const clockVal = record[key];
      if (clockVal !== ":") continue; // 打刻があるなら対象外

      // 休日・有休（勤務区分/理由）、届出で有休、週末は免除
      const isHolidayOrPaid = ["休日", "有給休暇", "有休"].some(k =>
        (record.workType || "").includes(k) || (record.workReason || "").includes(k)
      );
    // ver1.1 裁量だと勤務予定届を出さないため、空白もチェック対象に変更
      //if (isHolidayOrPaid || isPaidLeaveByNotification || isWeekend || isNotWorkDay) continue;
      if (isHolidayOrPaid || isPaidLeaveByNotification || isWeekend) continue;

      const $cell = record["$" + key];
      if (!$cell || $cell.length === 0) continue;

      if (reasonText.length > 0) {
        const ok = workReasonList[key].some(s => reasonText.includes(s));
        if (!ok) styleMgr.addTooltip($cell, "打刻忘れ：理由確認");
      } else {
        styleMgr.addTooltip($cell, "打刻忘れ：記載無");
      }
    }
  }

  // 6) 休憩時間チェック：
  //    breaktime >= 1:00 なのに workReason に「休憩」が含まれない場合、休憩理由：記載なし を付与
  #validateBreaktimeReason(styleMgr, record) {
    const btText = (record.breaktime ?? "").trim();
    const $btCell = record.$breaktime;
    const reasonText = (record.workReason ?? "").trim();

    // breaktime が未設定や ":" の場合は判定しない
    if (!btText || btText === ":") return;

    // "H:MM" / "HH:MM" 形式を期待してパース（例外には安全に対応）
    const m = btText.match(/^(\d{1,2}):([0-5]\d)$/);
    if (!m) return; // 想定外書式はスキップ（安全策）
    const hours = parseInt(m[1], 10);
    const minutes = parseInt(m[2], 10);
    const totalMinutes = hours * 60 + minutes;

    // 基準：60分(= 1:00) 以上
    const isLongBreak = totalMinutes > 60;
    if (!isLongBreak) return;

    // workReason に「休憩」が含まれていれば OK（ツールチップなし）
    const hasBreakKeyword = reasonText.includes("休憩");
    if (hasBreakKeyword) return;

    // 休憩の記載がない場合のみツールチップ付与
    if ($btCell && $btCell.length > 0) {
      styleMgr.addTooltip($btCell, "休憩取得：理由記載なし");
    }
  }

}

(function() {
  const $ = window.jQuery;
  $(document).ready(function() {
    const validator = new AttendanceRecordValidator();
    const styles = new StyleManager();
    styles.clearAll();

    // 画面判定（文字列は全角の【…】）
    const isMonthly = $("body:contains('【個人別月次勤務認証】')").length > 0;
    const isDaily   = $("body:contains('【日次勤務認証】')").length > 0;
    if (!isMonthly && !isDaily) return;

    $("td[class='index3']", document).parent().each(function(index, row) {
      try {
        const cell = $(row, "tr").find("td");
        const yyyyMM = (document.form1?.target_yyyyMM?.value || "").trim();

        // 安全な日付整形（yyyy-MM-DD）。yyyyMM が空でも例外にならない
        const dayTxt = (cell.eq(1).text() || "").trim();
        const yyyy = yyyyMM.slice(0, 4);
        const mm   = yyyyMM.slice(4);
        const dd   = dayTxt.padStart(2, '0');
        const date = (yyyy && mm && dd) ? `${yyyy}-${mm}-${dd}` : "";

        // 社員IDの安全取得
        let employeeId = "";
        if (isMonthly) {
          employeeId = (document.form1?.sno?.value || "").trim();
        } else if (isDaily) {
          const href = (cell.eq(1).find("a").attr("href") || "");
          const m = href.match(/openDaily\("([^"]*)","([^"]*)","([^"]*)",\s*([0-9]+)\)/);
          employeeId = m ? (m[2] || m[4] || m[1] || "") : "";
        }

        // 画面により列位置が異なるため分岐
        const record = new AttendanceRecord(
          isMonthly ? {
            state: cell.eq(0),
            day: cell.eq(1),
            date: { text: () => date },
            dayOfWeek: cell.eq(2),
            employeeId: employeeId,
            workType: cell.eq(3),
            plannedStart: cell.eq(4),
            plannedEnd: cell.eq(5),
            clockIn: cell.eq(9),
            clockOut: cell.eq(10),
            workStart: cell.eq(11),
            workEnd: cell.eq(12),
            breaktime: cell.eq(13),
            workReason: cell.eq(14),
            pcStart: cell.eq(19),
            pcEnd: cell.eq(20),
            mistakeStart: cell.eq(21),
            mistakeEnd: cell.eq(22),
            mistakeReason: cell.eq(23),
            notification: cell.eq(24)
          } : {
            state: cell.eq(0),
            day: cell.eq(1),
            date: { text: () => date },
            dayOfWeek: cell.eq(2),
            employeeId: employeeId,
            workType: cell.eq(4),
            plannedStart: cell.eq(5),
            plannedEnd: cell.eq(6),
            clockIn: cell.eq(10),
            clockOut: cell.eq(11),
            workStart: cell.eq(12),
            workEnd: cell.eq(13),
            breaktime: cell.eq(14),
            workReason: cell.eq(15),
            pcStart: cell.eq(20),
            pcEnd: cell.eq(21),
            mistakeStart: cell.eq(22),
            mistakeEnd: cell.eq(23),
            mistakeReason: cell.eq(24),
            notification: cell.eq(25)
          }
        );

        validator.validate(styles, record);
      } catch (e) {
        // 行単位で握りつぶして継続（画面差異・取込失敗時の安全策）
        console.warn("[ARCT-Safe] row error:", e?.message || e, row);
      }
    });
  });
})();
