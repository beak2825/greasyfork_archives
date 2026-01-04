// ==UserScript==
// @name         CNHMS 脚本工具
// @namespace    http://tampermonkey.net/
// @version      2025-12-26
// @description  Automates voyage data input, parsing, and BSA calculation for CNHMS pages.
// @author       You
// @match        http://210.22.111.84/wis/Bk/Rep_Main.aspx
// @match        http://210.22.111.84/wis/Bk/Rep_TopAcList.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=111.84
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560062/CNHMS%20%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560062/CNHMS%20%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/features/parser.ts
  var parseTable = (table) => {
    const result = [];
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const headMap = {};
    let customerTotal = 0;
    let afterVoyage = 0;
    {
      const head1 = rows.shift();
      const cells = Array.from(
        head1.querySelectorAll("th,td")
      );
      let index = 0;
      for (const cell of cells) {
        const content = cell.textContent.trim();
        const span = cell.colSpan || 1;
        if (!content) {
          console.log("\u7A7A\u8868\u5934");
        } else if (content == "LOADVOYAGE") {
          console.log("\u4E0B\u4E00\u884C\u5F00\u59CB\u8239\u540D\u822A\u6B21");
          afterVoyage = index + span;
        } else if (content == "TTL(Teu)") {
          console.log("\u5BA2\u6237\u603B\u8BA1");
          customerTotal = index + span;
        } else {
          console.log("\u8239\u540D", content, "\u6240\u5728\u4F4D\u7F6E", index, index + span);
          headMap[content] = [index, index + span];
        }
        index += span;
      }
    }
    const headMap2 = {};
    {
      const head2 = rows.shift();
      const cells = Array.from(
        head2.querySelectorAll("th,td")
      );
      let index = 0;
      const voyageAttrKeys = /* @__PURE__ */ new Set([
        "20'",
        "40'",
        "40HQ",
        "45'",
        "20' EIR",
        "40' EIR",
        "40HQ EIR",
        "45' EIR",
        "TTL(Teu)",
        "TTL(Teu) EIR"
      ]);
      for (const cell of cells) {
        const content = cell.textContent.trim();
        const span = 1;
        if (!content) {
          console.log("\u7A7A\u8868\u5934");
          if (index + span == customerTotal) {
            headMap2[index] = "TTL(Teu)";
          }
        } else {
          console.log("\u5C5E\u6027\u540D", content, "\u6240\u5728\u4F4D\u7F6E", index, index + span);
          if (index >= afterVoyage) {
            console.log("\u822A\u6B21\u5C5E\u6027");
            const voyageName = Object.entries(headMap).find(
              ([, [start, end]]) => {
                return index >= start && index < end;
              }
            )?.[0];
            if (voyageName && voyageAttrKeys.has(content)) {
              headMap2[index] = [voyageName, content];
            }
          } else {
            console.log("\u5BA2\u6237\u5C5E\u6027");
            headMap2[index] = content;
          }
        }
        index += span;
      }
    }
    console.log(headMap, headMap2);
    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll("td"));
      const line = {};
      for (const [idx, cell] of cells.entries()) {
        const content = cell.textContent.trim();
        const position = headMap2[idx];
        if (!position) {
          continue;
        } else if (Array.isArray(position)) {
          const [voyage, attr] = position;
          if (!(voyage in line) || typeof line[voyage] !== "object") {
            line[voyage] = {};
          }
          const voyageObj = line[voyage];
          const value = content ? isNaN(+content) ? content : +content : "";
          voyageObj[attr] = value;
        } else {
          const value = content ? isNaN(+content) ? content : +content : "";
          line[position] = value;
        }
      }
      result.push(line);
    }
    console.log(result);
    return result;
  };

  // src/state.ts
  var key = "_cnhms_total_account_state";
  var getState = () => {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.log("\u89E3\u6790\u72B6\u6001\u5931\u8D25", error);
      }
    }
    return { action: "idle" };
  };
  var setState = (state2) => {
    sessionStorage.setItem(key, JSON.stringify(state2));
  };
  var resetState = () => {
    sessionStorage.removeItem(key);
  };

  // src/components/FormView.tsx
  function FormView() {
    const onSubmit = (e) => {
      e.preventDefault();
      console.log("\u63D0\u4EA4", e.target);
      const form = e.target;
      const list = form.list.value;
      const item = form.item.value;
      const bsa = Number(form.bsa.value);
      const pod = form.pod.value;
      setState({
        action: "enter_input",
        payload: { list, item, bsa, pod }
      });
      window.open("/wis/Bk/Rep_TopAcList.aspx", "_blank");
    };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "\u79D8\u5236\u5C0F\u5999\u62DB")), /* @__PURE__ */ React.createElement("form", { style: { marginLeft: "2em" }, onSubmit }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "input",
      {
        name: "list",
        className: "textbox_base",
        style: { width: "256px" },
        required: true,
        placeholder: "\u8239\u6B21\u5217\u8868"
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        name: "item",
        className: "textbox_base",
        style: { width: "200px" },
        required: true,
        placeholder: "\u8239\u6B21"
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        name: "bsa",
        className: "textbox_base",
        style: { width: "50px" },
        type: "number",
        required: true,
        placeholder: "bsa",
        min: 1
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", { name: "pod", placeholder: "pod", className: "textbox_base" })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "button_base" }, "\u63D0\u4EA4")));
  }

  // src/features/ui.ts
  function addInput() {
    const rootContainer = document.createElement("div");
    rootContainer.id = "my-react-app-root";
    document.body.appendChild(rootContainer);
    const root = ReactDOM.createRoot(rootContainer);
    root.render(React.createElement(FormView));
  }

  // src/index.ts
  var path = location.pathname;
  var state = getState();
  console.log("\u811A\u672C\u542F\u52A8", path, state);
  if (path == "/wis/Bk/Rep_Main.aspx") {
    console.log("\u6DFB\u52A0\u8F93\u5165\u6846");
    addInput();
  } else if (path == "/wis/Bk/Rep_TopAcList.aspx") {
    if (state.action == "idle") {
      console.log("\u4EC0\u4E48\u90FD\u4E0D\u505A");
    } else if (state.action == "enter_input") {
      console.log("\u8BFB\u53D6\u8F93\u5165\u53D1\u8D77\u8BF7\u6C42", state.payload);
      const { list, pod } = state.payload;
      if (list) {
        $("#contentBodyForm_tb_VoyageCode").val(list);
        if (pod) {
          $("#contentBodyForm_tb_DischPort").val(pod);
        }
        $("#contentBodyForm_bt_Gen").click();
        setState({
          action: "read_voyage",
          payload: {
            item: state.payload.item,
            bsa: state.payload.bsa,
            pod: state.payload.pod
          }
        });
      }
    } else if (state.action == "read_voyage") {
      console.log("\u8BFB\u53D6\u7ED3\u679C\u822A\u6B21\u5217\u8868");
      const { item, bsa, pod } = state.payload;
      const result = parseTable($("#tb_Rep")[0]);
      setState({
        action: "calc_bsa",
        payload: {
          result,
          item,
          bsa,
          pod
        }
      });
      $("#contentBodyForm_tb_VoyageCode").val(item);
      if (pod) {
        $("#contentBodyForm_tb_DischPort").val(pod);
      }
      $("#contentBodyForm_bt_Gen").click();
    } else if (state.action == "calc_bsa") {
      console.log("\u8BFB\u53D6\u7ED3\u679C", state.payload);
      const itemResult = parseTable($("#tb_Rep")[0]);
      const result = calculateResult(
        state.payload.result,
        state.payload.item,
        itemResult,
        state.payload.bsa
      );
      console.log("\u83B7\u53D6\u7ED3\u679C", result);
      const properties = [
        "ONCUSTCODE",
        "ONCUSTNAME",
        "20'",
        "40'",
        "40HQ",
        "TTL(Teu)",
        "TWAV"
      ];
      let content = "";
      content += properties.join("	") + "\n";
      for (const row of result) {
        content += properties.map((e) => row[e]).join("	") + "\n";
      }
      copyToClipboard(content);
      resetState();
      window.close();
    }
  }
  function calculateResult(list1, item, list2, bsa) {
    const ttl = list1.find((e) => e.CUSTCODE == "TTL" && e.ONCUSTCODE == "");
    if (!ttl) {
      throw new Error("\u603B\u6570\u83B7\u53D6\u5931\u8D25");
    }
    const filtedList = list1.filter((e) => e.ONCUSTCODE).map((e) => ({
      ONCUSTCODE: e.ONCUSTCODE,
      TWAV: Math.round(e["TTL(Teu)"] / ttl["TTL(Teu)"] * bsa)
    }));
    return list2.map((e) => {
      return {
        ONCUSTCODE: e.ONCUSTCODE,
        ONCUSTNAME: e.ONCUSTNAME,
        "20'": e[item]["20'"],
        "40'": e[item]["40'"],
        "40HQ": e[item]["40HQ"],
        "TTL(Teu)": e[item]["TTL(Teu)"],
        TWAV: filtedList.find((ee) => ee.ONCUSTCODE == e.ONCUSTCODE)?.TWAV ?? 0
      };
    });
  }
  function copyToClipboard(content) {
    const temp = document.createElement("textarea");
    temp.value = content;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("Copy");
    alert("\u590D\u5236\u6210\u529F");
    temp.remove();
  }
})();
