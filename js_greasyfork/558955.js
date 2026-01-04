// ==UserScript==
// @name         LIMS SQC Work Detail - HOLD 판정
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  DIN 또는 (RIN/rRNA RATIO) 기준으로 QC RESULT를 HOLD로 변경 (RNA 사유 입력)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/sample/retrieveQcDetailForm.do*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558955/LIMS%20SQC%20Work%20Detail%20-%20HOLD%20%ED%8C%90%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/558955/LIMS%20SQC%20Work%20Detail%20-%20HOLD%20%ED%8C%90%EC%A0%95.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 동적으로 IBSheet 변수를 찾습니다.
  const SHEET_GLOBALS = ["ibsQcWorkDetail", "ibsQcDetail"];
  const COL_DIN = "din";
  const COL_RIN = "rin";
  const COL_RRNA_RATIO = "rrnaRtio";
  const COL_QC_RESULT = "manuReslCd";
  const COL_QC_RESULT_HIDDEN = "workReslCd";
  const COL_REASON_SYSTEM = "reslRsnNm"; // [18] REASON FOR FAIL (돋보기/체크박스)
  const COL_REASON_MANUAL = "manuReslRsn"; // [32] REASON FOR FAIL(M) (수동 입력)
  const COL_REASON_CODE = "reslRsnCd"; // [51] 사유 코드 (참고용) -> 활성화
  const COL_DV200 = "dv200";
  const REASON_DV200 = "DV200(%)"; // 사유 표시용 텍스트 (시스템 코드명과 일치해야 함)

  // DNA (DIN): 6.0 이상 7.0 미만 -> HOLD


  // DNA (DIN): 6.0 이상 7.0 미만 -> HOLD
  const HOLD_DIN_MIN = 6.0;
  const HOLD_DIN_MAX = 7.0;

  // RNA: 아래 두 조건 중 하나면 HOLD
  // 1) 5.6 ≤ RIN < 7 이고, rRNA ratio ≥ 1
  // 2) RIN ≥ 7 이고, rRNA ratio < 1
  const HOLD_RIN_MIN = 5.6;
  const PASS_RIN_MIN = 7.0;
  const PASS_RRNA_RATIO_MIN = 1.0;

  const HOLD_LABEL = "HOLD";
  const FAIL_LABEL = "Fail";

  // 사유 코드 (표시용)
  const REASON_RIN = "RIN";
  const REASON_RATIO = "rRNA ratio";
  const REASON_QUANTITY = "Quantity";

  // SweetAlert2 로더
  const loadSweetAlert = () => {
    return new Promise((resolve) => {
      if (window.Swal) return resolve(window.Swal);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
      script.onload = () => resolve(window.Swal);
      document.head.appendChild(script);
    });
  };

  const showToast = async (icon, title) => {
    const Swal = await loadSweetAlert();
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: icon,
      title: title,
    });
  };

  const tryCall = (fn, fallback) => {
    try {
      const out = fn();
      return out === undefined ? fallback : out;
    } catch {
      return fallback;
    }
  };

  const getCellValue = (sheet, row, colSaveName) => {
    try {
      const val = sheet.GetCellValue(row, colSaveName);
      if (val === undefined || val === null) {
        // 대체: 값이 null/undefined인 경우 텍스트 시도
        try { return sheet.GetCellText(row, colSaveName); } catch { }
        return null;
      }
      return val;
    } catch {
      // 대체: 소문자 메서드 시도 후 텍스트 시도
      try {
        const val = sheet.getCellValue(row, colSaveName);
        if (val === undefined || val === null) {
          try { return sheet.GetCellText(row, colSaveName); } catch { }
          return null;
        }
        return val;
      } catch { }
      return null;
    }
  };

  const getCellText = (sheet, row, col) =>
    tryCall(() => sheet.GetCellText(row, col), tryCall(() => sheet.getCellText(row, col), ""));

  const setCellValue = (sheet, row, col, value) => {
    if (typeof sheet.SetCellValue === "function") {
      try {
        if (sheet.SetCellValue.length >= 4) return sheet.SetCellValue(row, col, value, 1);
      } catch {
      }
      return sheet.SetCellValue(row, col, value);
    }
    if (typeof sheet.setCellValue === "function") {
      try {
        if (sheet.setCellValue.length >= 4) return sheet.setCellValue(row, col, value, 1);
      } catch {
      }
      return sheet.setCellValue(row, col, value);
    }
    if (typeof sheet.SetValue === "function") return sheet.SetValue(row, col, value);
    throw new Error("SetCellValue/SetValue API not found");
  };

  const parseNumber = (value) => {
    const raw = String(value ?? "").trim();
    if (!raw) return null;
    const normalized = raw.replace(/,/g, ".");
    const match = normalized.match(/-?\d+(\.\d+)?/);
    if (!match) return null;
    const n = Number(match[0]);
    return Number.isFinite(n) ? n : null;
  };

  const parseNumberMeta = (value) => {
    const raw = String(value ?? "").trim();
    if (!raw) return { value: null, empty: true, raw: "" };
    const normalized = raw.replace(/,/g, ".");
    const match = normalized.match(/-?\d+(\.\d+)?/);
    if (!match) return { value: null, empty: false, raw };
    const n = Number(match[0]);
    if (!Number.isFinite(n)) return { value: null, empty: false, raw };
    return { value: n, empty: false, raw };
  };

  const resolveCodeFromColumnConfig = (sheet, keyword) => {
    try {
      const cols =
        sheet.Cols || sheet.options?.Cols || sheet.cfg?.Cols || sheet.InitColumns || sheet.InitCols;
      if (!cols) return null;

      const colConfig = Array.isArray(cols)
        ? cols.find((c) => (c?.SaveName ?? c?.saveName) === COL_QC_RESULT)
        : cols[COL_QC_RESULT];

      if (!colConfig || typeof colConfig !== "object") return null;

      const enumText =
        colConfig.Enum ?? colConfig.enum ?? colConfig.ComboText ?? colConfig.comboText ?? null;
      const enumKeys =
        colConfig.EnumKeys ?? colConfig.enumKeys ?? colConfig.ComboCode ?? colConfig.comboCode ?? null;

      if (typeof enumText !== "string") return null;
      const texts = enumText.split("|");

      if (typeof enumKeys === "string") {
        const codes = enumKeys.split("|");
        const idx = texts.findIndex((x) => String(x).toUpperCase().includes(keyword));
        if (idx >= 0 && codes[idx]) return codes[idx];
        return null;
      }

      const idx = texts.findIndex((x) => String(x).toUpperCase().includes(keyword));
      if (idx >= 0) return texts[idx];
    } catch {
    }
    return null;
  };

  const resolveCode = (sheet, keyword, defaultLabel) => {
    const firstRow =
      tryCall(() => sheet.GetDataFirstRow(), null) ??
      tryCall(() => sheet.getDataFirstRow(), null) ??
      1;

    const info =
      tryCall(() => sheet.GetComboInfo?.(firstRow, COL_QC_RESULT), null) ??
      tryCall(() => sheet.getComboInfo?.(firstRow, COL_QC_RESULT), null);

    const extract = (combo) => {
      if (!combo || typeof combo !== "object") return null;
      const texts = combo.ComboText ?? combo.comboText ?? combo.Text ?? combo.text;
      const codes = combo.ComboCode ?? combo.comboCode ?? combo.Code ?? combo.code;
      if (typeof texts !== "string" || typeof codes !== "string") return null;
      const t = texts.split("|");
      const c = codes.split("|");
      const idx = t.findIndex((x) => String(x).toUpperCase().includes(keyword));
      if (idx >= 0 && c[idx]) return c[idx];
      return null;
    };

    const foundCode = extract(info);
    const cfgCode = resolveCodeFromColumnConfig(sheet, keyword);
    const resolved = foundCode ?? cfgCode;
    return resolved ?? defaultLabel;
  };

  const collectDataRows = (sheet) => {
    const first =
      tryCall(() => sheet.GetDataFirstRow(), null) ??
      tryCall(() => sheet.getDataFirstRow(), null);
    const last =
      tryCall(() => sheet.GetDataLastRow(), null) ??
      tryCall(() => sheet.getDataLastRow(), null) ??
      tryCall(() => sheet.GetLastRow?.(), null) ??
      tryCall(() => sheet.LastRow?.(), null);

    if (typeof first !== "number" || typeof last !== "number" || last < first) return [];
    const rows = [];
    for (let r = first; r <= last; r++) rows.push(r);
    return rows;
  };

  const waitForElement = (selector, timeoutMs = 20000) =>
    new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - started > timeoutMs) return reject(new Error(`timeout: ${selector}`));
        requestAnimationFrame(tick);
      };
      tick();
    });

  const getSheet = () => {
    for (const name of SHEET_GLOBALS) {
      if (window[name]) return window[name];
    }
    return null;
  };

  const runHoldJudgement = async () => {
    const Swal = await loadSweetAlert();
    const sheet = getSheet();
    if (!sheet) {
      Swal.fire({ icon: "error", title: "오류", text: `IBSheet를 찾지 못했습니다.\nwindow[${SHEET_GLOBALS.join(" or ")}] 가 존재하는지 확인해 주세요.` });
      return;
    }

    const rows = collectDataRows(sheet);
    if (rows.length === 0) {
      Swal.fire({ icon: "info", title: "알림", text: "데이터 행을 찾지 못했습니다." });
      return;
    }

    const resolveHoldCode = (s) => resolveCode(s, "HOLD", HOLD_LABEL);
    const resolveFailCode = (s) => resolveCode(s, "FAIL", FAIL_LABEL);

    const holdCode = resolveHoldCode(sheet);
    const failCode = resolveFailCode(sheet);

    // UI 렌더링을 위해 약간의 지연 추가
    await new Promise(r => setTimeout(r, 100));

    let statFn = {
      updated: 0,
      holdData: 0,
      failData: 0,
      reasonOnly: 0,
      alreadyHold: 0,
      alreadyFail: 0,
      missingMetric: 0,
      missingRna: 0,
      formatErr: 0,
      changedRows: [] // 변경된 행 번호(#) 저장
    };

    // '#' 컬럼 (1번 인덱스가 번호 컬럼)
    const colSeq = 1;

    // 0. 사유 코드 매핑 (검증 기반 하드코딩)
    // S09: RIN, S10: rRNA ratio, S12: DV200(%), S14: Quantity
    // [신규] DNA 검증됨: S05: DIN
    const reasonCbMap = new Map();
    reasonCbMap.set(REASON_RIN, "S09");
    reasonCbMap.set(REASON_RATIO, "S10");
    reasonCbMap.set(REASON_DV200, "S12");
    reasonCbMap.set(REASON_QUANTITY, "S14");
    reasonCbMap.set("DIN", "S05");

    // 추가 매핑 (필요 시 확장)
    reasonCbMap.set("DNA contamination suspected", "S11");
    reasonCbMap.set("Need to confirm peak size", "S13");
    reasonCbMap.set("Purity", "S15");
    reasonCbMap.set("Concentration", "S17");

    let detectedSeparator = ","; // 사용자 로그 기반 기본 콤마

    // 구분자 및 기타 코드 학습 (보조)
    try {
      for (const r of rows) {
        const cd = String(getCellValue(sheet, r, COL_REASON_CODE) ?? "").trim();
        if (cd && cd.includes("|")) detectedSeparator = "|";
      }
    } catch (e) { }

    console.log("=== Reason Mapping Applied (Verified) ===");
    reasonCbMap.forEach((v, k) => console.log(`${k} -> ${v}`));
    console.log("Separator:", detectedSeparator);



    for (const r of rows) {

      // 1. 현재 상태 및 사유 읽기
      const curReasonText = String(getCellText(sheet, r, COL_REASON_SYSTEM) ?? "").trim();

      const curQcText = String(getCellText(sheet, r, COL_QC_RESULT) ?? "").toUpperCase();
      const curQcVal = String(getCellValue(sheet, r, COL_QC_RESULT) ?? "").toUpperCase();

      const isAlreadyFail = curQcText.includes("FAIL") || curQcVal.includes("FAIL") || curQcText.includes("F") || curQcVal === "F";
      const isAlreadyHold = curQcText.includes("HOLD") || curQcVal.includes("HOLD");

      // 2. 수치 데이터 파싱
      const dinMeta = parseNumberMeta(getCellValue(sheet, r, COL_DIN) ?? getCellText(sheet, r, COL_DIN));
      const rinMeta = parseNumberMeta(getCellValue(sheet, r, COL_RIN) ?? getCellText(sheet, r, COL_RIN));
      const ratioMeta = parseNumberMeta(getCellValue(sheet, r, COL_RRNA_RATIO) ?? getCellText(sheet, r, COL_RRNA_RATIO));

      const dinVal = dinMeta.value;
      const rinVal = rinMeta.value;
      const ratioVal = ratioMeta.value;

      const hasRna = !rinMeta.empty || !ratioMeta.empty;
      const hasDna = !hasRna && !dinMeta.empty;

      // 3. 문제 사유 분석 (수치 기반)
      const reasonsToAdd = new Set();
      let statusByMetric = null; // 수치상 판정 결과 (HOLD 또는 null)

      // [신규] DV200 로직 (우선순위: Quantity > DV200 > 기타)
      // DV200이 있으면 먼저 확인
      const dv200Meta = parseNumberMeta(getCellValue(sheet, r, COL_DV200) ?? getCellText(sheet, r, COL_DV200));
      const dv200Val = dv200Meta.value;
      let statusByDv200 = null;

      if (!dv200Meta.empty && dv200Val !== null) {
        // DV200 값이 있으면 최우선 평가 (Quantity 제외)
        if (dv200Val < 50) {
          statusByDv200 = "FAIL";
        } else {
          statusByDv200 = "HOLD"; // >= 50
        }
        reasonsToAdd.add(REASON_DV200);
      }

      if (hasRna) {
        // RNA 판정 로직
        // RIN < 7.0 이면 사유 추가
        if (rinVal !== null && rinVal < 7.0) {
          reasonsToAdd.add(REASON_RIN);
        }
        // Ratio < 1.0 이면 사유 추가
        if (ratioVal !== null && ratioVal < 1.0) {
          reasonsToAdd.add(REASON_RATIO);
        }

        // 데이터 누락 체크
        if (rinMeta.empty && ratioMeta.empty) {
          statFn.missingMetric++;
          continue;
        } else if ((!rinMeta.empty && rinVal === null) || (!ratioMeta.empty && ratioVal === null)) {
          // 파싱 실패
          statFn.formatErr++;
        } else if (rinMeta.empty || ratioMeta.empty) {
          statFn.missingRna++; // 일부 누락
        }

        // HOLD 판정 조건 (DV200이 없을 때만 적용 or 사유는 다 추가하되 판정은 DV200 우선)
        // 로직: DV200이 결정되면 statusByMetric은 무시되거나 덮어써짐. 
        // 일단 계산은 수행하여 사유(RIN/Ratio)는 추가되도록 함. 

        if (rinVal !== null && ratioVal !== null) {
          const isHoldRange =
            (rinVal >= HOLD_RIN_MIN && rinVal < PASS_RIN_MIN && ratioVal >= PASS_RRNA_RATIO_MIN) ||
            (rinVal >= PASS_RIN_MIN && ratioVal < PASS_RRNA_RATIO_MIN);

          if (isHoldRange) {
            statusByMetric = "HOLD";
          } else if (reasonsToAdd.size > 0 && !reasonsToAdd.has(REASON_DV200)) {
            // DV200이 아닐 때만 여기서 FAIL 결정 (DV200 있으면 그 판정이 이김)
            statusByMetric = "FAIL";
          }
        }

      } else if (hasDna) {
        // DNA 판정 로직
        if (dinVal === null) {
          statFn.formatErr++;
        } else {
          if (dinVal >= HOLD_DIN_MIN && dinVal < HOLD_DIN_MAX) {
            statusByMetric = "HOLD";
            reasonsToAdd.add("DIN"); // DIN 사유 추가 (S05)
          }
        }
      } else {
        // RNA/DNA 둘다 없는데 DV200만 있는 경우가 있을 수 있음.
        if (!statusByDv200) {
          statFn.missingMetric++;
          continue;
        }
      }

      // 4. Quantity 체크 및 최종 상태 결정
      const hasQuantityVideo = curReasonText.includes(REASON_QUANTITY);
      let finalStatus = null;
      let finalCode = null;

      if (hasQuantityVideo) {
        finalStatus = "FAIL";
        finalCode = failCode;
      } else if (statusByDv200) {
        // DV200 우선
        finalStatus = statusByDv200;
        finalCode = (statusByDv200 === "HOLD") ? holdCode : failCode;
      } else if (statusByMetric === "HOLD") {
        finalStatus = "HOLD";
        finalCode = holdCode;
      } else if (statusByMetric === "FAIL") {
        finalStatus = "FAIL";
        finalCode = failCode;
      }


      // 5. 사유 텍스트 병합 (돋보기 컬럼에 반영)
      // 기존 텍스트(curReasonText)에 새 사유(reasonsToAdd)를 병합
      let newReasonText = curReasonText;

      // DV200이 있거나 RNA인 경우 사유 업데이트 (DNA만 있는 경우는 제외였으나 DV200 추가로 조건 확장)
      // 요구사항: DNA는 별도 사유 없음. RNA 및 DV200은 사유 있음.
      if (reasonsToAdd.size > 0 && (hasRna || statusByDv200)) {
        const parts = curReasonText.split(/,\s*/).map(s => s.trim()).filter(s => s);
        const currentSet = new Set(parts);

        reasonsToAdd.forEach(r => currentSet.add(r));

        // 최종 텍스트 구성 (시스템 코드 순서로 정렬)
        // S09(RIN) -> S10(Ratio) -> S12(DV200)... 순서 보장
        const sortedParts = Array.from(currentSet).sort((a, b) => {
          const codeA = reasonCbMap.get(a) || "Z99"; // 매핑 안된건 뒤로
          const codeB = reasonCbMap.get(b) || "Z99";
          if (codeA < codeB) return -1;
          if (codeA > codeB) return 1;
          return 0;
        });

        newReasonText = sortedParts.join(", "); // 콤마로 연결 (텍스트)
      }

      // 6. 변경 적용
      let statusChanged = false;
      let reasonChanged = false;

      // 6-1. 상태 변경
      if (finalStatus) {
        // Fail이 우선 (하지만 여기서는 finalStatus가 이미 우선순위 처리됨)
        if (finalStatus === "FAIL" && !isAlreadyFail) {
          setCellValue(sheet, r, COL_QC_RESULT, finalCode);

          // 대체 검증 및 공통 코드로 재시도
          const checkFail = () => {
            const val = getCellText(sheet, r, COL_QC_RESULT) || getCellValue(sheet, r, COL_QC_RESULT);
            return val && (String(val).toUpperCase().includes("F") || String(val).toUpperCase() === "FAIL");
          };

          if (!checkFail()) try { setCellValue(sheet, r, COL_QC_RESULT, "F"); } catch { }
          if (!checkFail()) try { setCellValue(sheet, r, COL_QC_RESULT, "Fail"); } catch { }
          if (!checkFail()) try { setCellValue(sheet, r, COL_QC_RESULT, "FAIL"); } catch { }

          try { setCellValue(sheet, r, COL_QC_RESULT_HIDDEN, finalCode ?? "F"); } catch { }

          statusChanged = true;
        } else if (finalStatus === "HOLD" && !isAlreadyHold) {
          setCellValue(sheet, r, COL_QC_RESULT, finalCode);

          const checkHold = () => {
            const val = getCellText(sheet, r, COL_QC_RESULT) || getCellValue(sheet, r, COL_QC_RESULT);
            return val && (String(val).toUpperCase().includes("H") || String(val).toUpperCase() === "HOLD");
          };

          if (!checkHold()) try { setCellValue(sheet, r, COL_QC_RESULT, "H"); } catch { }
          if (!checkHold()) try { setCellValue(sheet, r, COL_QC_RESULT, "Hold"); } catch { }
          if (!checkHold()) try { setCellValue(sheet, r, COL_QC_RESULT, "HOLD"); } catch { }

          try { setCellValue(sheet, r, COL_QC_RESULT_HIDDEN, finalCode ?? "H"); } catch { }

          statusChanged = true;
        }
      }

      // 6-2. 사유 변경 (시스템 컬럼 업데이트 + [신규] 코드 컬럼 업데이트)
      if (newReasonText !== curReasonText) {
        // [수정] 단순 순서 변경 무시 로직
        // newReasonText와 curReasonText의 구성요소가 같다면 변경으로 치지 않음
        const p1 = newReasonText.split(/,\s*/).map(s => s.trim()).filter(s => s).sort().join(",");
        const p2 = curReasonText.split(/,\s*/).map(s => s.trim()).filter(s => s).sort().join(",");

        if (p1 !== p2) {
          // 텍스트 업데이트
          setCellValue(sheet, r, COL_REASON_SYSTEM, newReasonText);

          // 코드 업데이트 (매핑 기반)
          const parts = newReasonText.split(/,\s*/);
          const codeParts = parts.map(txt => { // 텍스트 -> 코드 변환
            return reasonCbMap.get(txt) || txt;
          });
          const newReasonCode = codeParts.join(detectedSeparator); // | 로 연결

          setCellValue(sheet, r, COL_REASON_CODE, newReasonCode);

          reasonChanged = true;
        }
      }

      if (statusChanged || reasonChanged) {
        statFn.updated++;
        try {
          sheet.RefreshCell?.(r, COL_QC_RESULT);
          sheet.RefreshCell?.(r, COL_REASON_SYSTEM);
          sheet.RefreshCell?.(r, COL_REASON_CODE); // 코드 컬럼도 리프레시
          sheet.RefreshRow?.(r);
        } catch { }

        if (statusChanged) {
          if (finalStatus === "FAIL") statFn.failData++;
          else if (finalStatus === "HOLD") statFn.holdData++;
        } else if (reasonChanged) {
          statFn.reasonOnly++;
        }

        // 변경된 행 번호 수집
        if (statusChanged || reasonChanged) {
          try {
            // 1번 컬럼(Sequence) 값 읽기 시도
            let seqVal = "";
            if (colSeq >= 0) { // 동적으로 결정된 colSeq 사용
              seqVal = getCellValue(sheet, r, colSeq) || getCellText(sheet, r, colSeq);
            }

            // 값이 없으면 행 번호로 대체
            if (seqVal === null || seqVal === undefined || String(seqVal).trim() === "") {
              seqVal = "#" + r;
            }
            statFn.changedRows.push(seqVal);
          } catch (e) {
            statFn.changedRows.push("#" + r);
          }
        }

      } else {
        if (isAlreadyFail) statFn.alreadyFail++;
        else if (isAlreadyHold) statFn.alreadyHold++;
      }
    }

    if (statFn.updated > 0) {
      try {
        sheet.RenderBody?.();
        sheet.Refresh?.();
        sheet.RefreshSheet?.();
      } catch { }
    }

    const hasIssues = statFn.missingMetric > 0 || statFn.missingRna > 0 || statFn.formatErr > 0;

    const summaryHtml = `
      <div style="font-family: 'Pretendard', sans-serif; text-align: left; font-size: 14px; color: #333;">
        <div style="background: #fdfdfd; border-radius: 8px; margin-bottom: 12px;">
          <h4 style="margin: 0 0 10px 0; color: #10b981; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span>✅</span> 처리 완료
          </h4>
          <ul style="margin: 0; padding-left: 24px; color: #374151; line-height: 1.8;">
            <li><b>총 변경:</b> <span style="color: #059669; font-weight: 800;">${statFn.updated}건</span></li>
            <li style="margin-top:4px;"><b>상태 변경:</b> ${FAIL_LABEL} ${statFn.failData} / ${HOLD_LABEL} ${statFn.holdData}</li>
            <li><b>사유 보정:</b> ${statFn.reasonOnly}건 <span style="color:#6b7280; font-size: 12px;">(${FAIL_LABEL}/${HOLD_LABEL} 유지, 사유만 추가)</span></li>
            <li style="margin-top:6px; color:#6b7280; border-top:1px dashed #eee; padding-top:4px;"><b>변경 없음:</b> ${FAIL_LABEL} ${statFn.alreadyFail} / ${HOLD_LABEL} ${statFn.alreadyHold}</li>
          </ul>
        </div>

        ${hasIssues ? `
        <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 12px; border-radius: 8px; margin-top: 12px;">
          <h4 style="margin: 0 0 10px 0; color: #e11d48; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span>⚠️</span> 확인 필요사항
          </h4>
          <ul style="margin: 0; padding-left: 20px; color: #be123c; line-height: 1.6; font-size: 13px;">
            ${statFn.missingMetric > 0 ? `<li>DIN/RIN/Ratio/DV200 미입력: <b>${statFn.missingMetric}건</b></li>` : ''}
            ${statFn.missingRna > 0 ? `<li>RNA 부분 누락: <b>${statFn.missingRna}건</b></li>` : ''}
            ${statFn.formatErr > 0 ? `<li>숫자 형식 오류: <b>${statFn.formatErr}건</b></li>` : ''}
          </ul>
        </div>
        ` : ''}
    
    ${statFn.changedRows.length > 0 ? `
    <div style="margin-top: 15px; text-align: left; max-height: 100px; overflow-y: auto; font-size: 13px; background: #fafafa; padding: 8px; border: 1px solid #eee;">
      <strong>[변경일람 #]</strong><br/>
      ${statFn.changedRows.join(", ")}
    </div>` : ""}
    `;

    Swal.fire({
      title: statFn.updated > 0 ? "판정 완료" : "완료 (변경 없음)",
      html: summaryHtml,
      icon: statFn.updated > 0 ? "success" : "info",
      confirmButtonText: "확인",
      confirmButtonColor: "#20c997",
      didOpen: () => {
        const popup = Swal.getPopup();
        if (!popup) return;

        const onMouseDown = (e) => {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('.swal2-content')) return;
          const header = popup.querySelector('.swal2-header') || popup;
          if (!header.contains(e.target) && e.target !== popup) return;

          isDragging = true;
          const rect = popup.getBoundingClientRect();
          diffX = e.clientX - rect.left;
          diffY = e.clientY - rect.top;
          popup.style.margin = '0';
          popup.style.transform = 'none';
          popup.style.position = 'fixed';
          popup.style.width = rect.width + 'px';
          popup.style.left = rect.left + 'px';
          popup.style.top = rect.top + 'px';
        };

        const header = popup.querySelector('.swal2-header') || popup;
        header.style.cursor = 'move';

        let isDragging = false;
        let diffX = 0, diffY = 0;

        const onMouseMove = (e) => {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.clientX - diffX;
          const y = e.clientY - diffY;
          popup.style.left = x + 'px';
          popup.style.top = y + 'px';
        };

        const onMouseUp = () => isDragging = false;

        popup.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
    });
  };

  const injectButton = async () => {
    // #btnReport 또는 #btnWorkComplete 대기
    // 하지만 한 페이지에 btnReport가 없을 수 있으므로, 다른 페이지에 있다면 엄격하게 기다리지 말아야 함.
    // 대신 공통 요소를 기다리거나 문서가 준비되면 즉시 시도 (run-at document-end 사용 중).
    await new Promise(r => setTimeout(r, 1000)); // 요소 확보를 위한 간단한 대기

    if (document.querySelector("#btnHoldJudgement")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "btnHoldJudgement";
    // 민트 색상 스타일
    btn.className = "btn size-auto"; // 클래스를 기본으로 재설정하거나 사용자 지정 사용
    btn.textContent = "HOLD 판정";

    // 민트 색상 스타일 (작업 현황 모달처럼 틴트 처리)
    btn.className = "btn-hold-judgement";
    btn.textContent = "HOLD 판정";

    // 사용자 지정 스타일 (LIMS-Job-Status-Modal.js와 일치하되 민트 테마 적용)
    Object.assign(btn.style, {
      backgroundColor: "#c3fae8", // 약간 더 어두운 민트 (이전 hover 색상)
      color: "#087f5b",           // 더 어두운 녹색 텍스트
      border: "1px solid #087f5b", // 더 어두운 테두리
      padding: "0 8px",           // 측면 간격을 위한 패딩, 높이는 height 속성으로 제어
      cursor: "pointer",
      borderRadius: "3px",
      fontSize: "11px",           // 약간 더 작은 글꼴
      fontWeight: "bold",
      height: "24px",             // 고정 높이
      display: "inline-flex",     // 완벽한 중앙 정렬을 위한 Flexbox
      alignItems: "center",       // 수직 중앙
      justifyContent: "center",   // 수평 중앙
      marginRight: "7px",         // 오른쪽 여백 (기존 버튼을 오른쪽으로 밀기)
      verticalAlign: "middle",    // 다른 인라인 요소와 정렬
      boxSizing: "border-box"
    });

    // 마우스 오버 효과
    btn.addEventListener("mouseover", () => {
      btn.style.backgroundColor = "#96f2d7"; // 마우스 오버 시 훨씬 더 어두운 민트
    });
    btn.addEventListener("mouseout", () => {
      btn.style.backgroundColor = "#c3fae8";
    });

    // ... 클릭 핸들러 ...
    btn.addEventListener("click", async () => {
      if (btn.getAttribute("data-busy") === "1") return;
      btn.setAttribute("data-busy", "1");
      const originalText = btn.textContent;
      btn.textContent = "처리중...";
      try {
        await runHoldJudgement();
      } finally {
        btn.textContent = originalText;
        btn.setAttribute("data-busy", "0");
      }
    });

    const makeTopRow = () => {
      const row = document.createElement("div");
      row.style.width = "100%";
      row.style.display = "flex";
      row.style.justifyContent = "flex-end";
      row.style.alignItems = "center";
      row.style.gap = "6px";
      row.style.marginBottom = "6px";

      // 컨테이너의 오른쪽 가장자리와 딱 맞게 정렬하기 위해 오른쪽 여백 제거
      // 아래의 가장 오른쪽 버튼과 정렬됨
      btn.style.marginRight = "0px";

      row.appendChild(btn);
      return row;
    };

    // 1. QC 작업 상세에 대한 기존 로직
    const reportBtn = document.querySelector("#btnReport");
    if (reportBtn) {
      const actionContainer =
        reportBtn.closest(".btn_area") ||
        reportBtn.closest(".btn-area") ||
        reportBtn.closest(".button-area") ||
        reportBtn.closest(".btn-group") ||
        reportBtn.closest(".panel-footer") ||
        reportBtn.parentElement;

      if (actionContainer && actionContainer.parentNode) {
        // 원래 동작 복원: 버튼 영역 위에 새 행 삽입
        actionContainer.parentNode.insertBefore(makeTopRow(), actionContainer);
        return;
      }

      if (reportBtn.parentNode) {
        reportBtn.parentNode.insertBefore(btn, reportBtn);
        btn.style.marginRight = "7px";
        return;
      }
    }

    // 2. SQC 상세(ibsQcDetail)를 위한 새로운 로직

    // 사용자 제안: 버튼을 위한 "가상 컨테이너"(래퍼)를 생성하고 대상 앞에 배치합니다.
    // 이는 특정 레이아웃 깨짐이나 인접 요소 동작으로부터 분리하는 데 도움이 됩니다.

    const findImageUploadBtn = () => {
      const elId = document.querySelector("#btnImageUpload");
      if (elId) return elId;
      const allButtons = Array.from(document.querySelectorAll("button, a, span.btn"));
      return allButtons.find(el => (el.textContent || "").trim().includes("Image Upload"));
    };

    const imgUploadBtn = findImageUploadBtn();

    if (imgUploadBtn && imgUploadBtn.parentNode) {
      // Create Wrapper
      const wrapper = document.createElement("span"); // Use span to be inline-friendly
      wrapper.id = "holdBtnWrapper";
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";
      // Reduced to 5.5px as requested
      wrapper.style.marginLeft = "5px";
      wrapper.style.marginRight = "5px";

      // Move button styling margins to 0 since wrapper handles it
      btn.style.margin = "0";

      wrapper.appendChild(btn);

      const container = imgUploadBtn.parentNode;

      // 래퍼가 Image Upload 버튼 앞에 오도록 보장하는 함수
      const maintainPosition = () => {
        if (!container.contains(wrapper)) {
          container.insertBefore(wrapper, imgUploadBtn);
        }
      };

      maintainPosition();

      // 강력한 옵저버: 변경 사항을 감시하고 래퍼를 Image Upload 앞에 유지
      const observer = new MutationObserver(() => {
        maintainPosition();
      });
      observer.observe(container, { childList: true, subtree: false });

      return;
    }

    // 대체 로직
    const complBtn = document.querySelector("#btnWorkComplete");
    if (complBtn) {
      const complContainer = complBtn.closest(".workCompl");
      const targetContainer = complContainer || complBtn.parentNode;

      if (targetContainer) {
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-flex";
        wrapper.style.marginRight = "7px";
        btn.style.margin = "0";
        wrapper.appendChild(btn);

        targetContainer.insertBefore(wrapper, targetContainer.firstChild);
        return;
      }
      complBtn.parentNode.insertBefore(btn, complBtn);
      return;
    }

    // 3. 대체: 로그 등록
    const logBtn = document.querySelector("#btnLogRegist");
    if (logBtn && logBtn.parentNode) {
      logBtn.parentNode.insertBefore(btn, logBtn.nextSibling);
      return;
    }
  };




  injectButton().catch(() => {
  });
})();


