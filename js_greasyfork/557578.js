// ==UserScript==
// @name            Лог тестирования DL: форматирование сообщения tester'а
// @name:en         DL test log: render tester message
// @namespace       http://dl.gsu.by/
// @version         2025-08-23
// @description     При открытии результата тестирования на DL, групповой результат tester'а отображается многострочно (по строке на группу)
// @description:en  When opening testing results on DL, Tester group result is displayed in multiple lines (one for each group)
// @author          LeXofLeviafan
// @license         MIT
// @match           https://dl.gsu.by/log-dbt.asp?*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=dl.gsu.by
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/557578/%D0%9B%D0%BE%D0%B3%20%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20DL%3A%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%20tester%27%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557578/%D0%9B%D0%BE%D0%B3%20%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20DL%3A%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%20tester%27%D0%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function formatTesterOutput (start=0) {
    const TOKEN = "[+*-](?:\\([0-9]+(?:/[0-9]+)?\\))?(?:\\[[\\s\\S]*\\])?";
    const [RE_TESTS, RE_SPLIT] = [RegExp(`^(?:${TOKEN}, )+${TOKEN}$`), RegExp(`(?<=${TOKEN}), (?=${TOKEN})`)];
    let groupFormatter = total => (s, i) => [`${i+start}`.padStart(`${total-1+start}`.length), s].join(": ");
    let tables = document.querySelectorAll('table'),  rows = tables[0]?.querySelectorAll('tr');
    if ((tables.length != 1) || (rows.length != 2) || !rows[0].classList.contains('head') || (rows[1].id != "1"))
      console.warn("[tester-log] Can't find log table with 1 result row");
    else {
      console.log("[tester-log] Found log table with 1 result row");
      let cell = rows[1].querySelectorAll('td')[3],  text = cell?.innerText.trim();
      if (!text?.match(RE_TESTS))
        console.warn("[tester-log] Result row doesn't seem to contain Tester output");
      else {
        console.log("[tester-log] Result row contains what seems to be Tester output");
        let tokens = text.split(RE_SPLIT);
        if (!tokens.every(s => s.match(`^${TOKEN}$`)))
          console.error("[tester-log] Failed to split Tester output into group tokens!");
        else {
          console.log("[tester-log] Reformatting Tester output into multiple lines");
          Object.assign(cell.style, {whiteSpace: 'pre-wrap', fontFamily: 'monospace'});
          cell.innerText = tokens.map( groupFormatter(tokens.length) ).join("\n");
        }
      }
    }
  }

  formatTesterOutput();
})();
