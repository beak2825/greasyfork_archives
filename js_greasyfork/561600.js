// ==UserScript==
// @name         arenalogs add filter and graph
// @namespace    https://greasyfork.org/ja/users/1513015-81f32c5c
// @version      1.0.1
// @description  アリーナログにフィルタとグラフを追加
// @license      MIT
// @author       81f32c5c
// @copyright    2026 81f32c5c
// @match        https://donguridepot.stars.ne.jp/arenalogs*.html
// @exclude      https://donguridepot.stars.ne.jp/arenalogs_kako.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561600/arenalogs%20add%20filter%20and%20graph.user.js
// @updateURL https://update.greasyfork.org/scripts/561600/arenalogs%20add%20filter%20and%20graph.meta.js
// ==/UserScript==

(() => {
  // UIの準備
  (() => {
    const graph_container = document.createElement('div');
    graph_container.id = 'graph_container';

    const filter_container = graph_container.appendChild(document.createElement('div'));
    const status_text = document.createElement('div');
    status_text.id = 'status_text';
    const graph_filter_text = document.createElement('span');
    graph_filter_text.id = 'graph_filter_text';
    const graph_filter = document.createElement('select');
    graph_filter.id = 'graph_filter';
    filter_container.append(status_text, 'フィルタ：', graph_filter_text, graph_filter);

    const graph_table = graph_container.appendChild(document.createElement('table'));
    graph_table.id = 'graph_table';
    const thead = '<thead><tr><th>時刻</th><th>攻撃回数</th><th style="width:640px;">グラフ</th></tr></thead>';
    let tbody = '<tbody>';
    for (let n = 0; n < 24; n++) {
      const td1 = '<td class="right">' + n + '</td>';
      const td2 = '<td class="right"></td>';
      const td3 = '<td style="padding:0;"><div style="background-color:blue;height:1lh;"></div></td>';
      tbody += '<tr>'+td1+td2+td3+'</tr>';
    }
    tbody += '</tbody>';
    graph_table.innerHTML = thead + tbody;

    graph_container.style.display = 'none';
    document.querySelector('#arenalogstable').before(graph_container);
  })();

  // 検索ボタン押下イベントを上書き
  document.querySelector('#btn_search').onclick = (event) => {
    // 検索ボタンの本来のコード
    search();

    // どんぐりシステム内の表示形式なら非表示
    const graph_container = document.querySelector('#graph_container');
    const tbody_logs = document.querySelector('#tbody_logs');
    if (tbody_logs.previousElementSibling.childNodes[0].childNodes[2].textContent !== '概算時刻') {
      graph_container.style.display = 'none';
      return;
    } else {
      graph_container.style.display = null;
    }

    // 検索結果から集計
    const rows_logs = [...tbody_logs.rows];
    const players = {};
    rows_logs.forEach(row => {
      const time = parseInt(row.children[2].textContent.match(/\s(\d\d):/)[1]);
      const c_name = row.children[3].textContent;
      const player = players[c_name] = players[c_name] || {
        name: c_name,
        rows: [],
        times: Array(24).fill(0),
      };
      player.rows.push(row);
      player.times[time]++;
    });
    const nofilter = {
      disp: 'フィルタなし',
      rows: rows_logs,
      times: Array(24).fill(0),
      mark: '',
    };
    const marks = {
      '\u{1f7e6}': 0,
      '\u{1f7e8}': 0,
      '\u{1f7e5}': 0,
    };
    const players_array = Object.values(players).map(player => {
      let count = 0;
      player.times.forEach((c, i) => {
        nofilter.times[i] += c;
        c && count++;
      });
      player.mark = count < 10 ? '\u{1f7e6}' : count < 20 ? '\u{1f7e8}' : '\u{1f7e5}';
      player.disp = player.mark + player.name;
      marks[player.mark]++;
      return player;
    }).toSorted((a, b) => a.name.localeCompare(b.name));
    console.log(players_array);
    
    if(players_array.length === 0){
      graph_container.style.display = 'none';
      return;
    }
    players_array.unshift(nofilter);

    // フィルタの更新
    const status_text = document.querySelector('#status_text');
    status_text.textContent = 
      '日付：' + rows_logs[0].children[2].textContent.split(' ')[0] +
      ', 挑戦者数：' + (players_array.length - 1) +
      `(内訳：${Object.entries(marks).map(([k, v]) => `${k}：${v}(${(v*100/(players_array.length-1)).toFixed(1)}%)`).join(', ')})`;
    const graph_filter_text = document.querySelector('#graph_filter_text');
    const graph_filter = document.querySelector('#graph_filter');
    graph_filter.replaceChildren(...players_array.map((player, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = player.disp;
      return option;
    }));
    graph_filter.onchange = event => change_filter(event.target.value);
    if (players_array.length === 2) {
      graph_filter_text.textContent = players_array[1].disp;
      graph_filter_text.style.display = null;
      graph_filter.style.display = 'none';
    } else {
      graph_filter_text.style.display = 'none';
      graph_filter.style.display = null;
    }

    const count_p = document.querySelector('#arenalogstable > p');
    const graph_rows = [...document.querySelector('#graph_table > tbody').rows];
    change_filter(0);

    function change_filter(idx) {
      const player = players_array[idx];
      const max = Math.max(...player.times);
      graph_rows.forEach((row, i) => {
        const num = player.times[i];
        row.style.backgroundColor = num ? null : 'gray';
        row.children[1].textContent = num;
        row.children[2].firstChild.style.width = (num * 100 / max).toFixed(2) + '%';
      });
      tbody_logs.replaceChildren(...player.rows);
      count_p.textContent = '検索件数：' + (player.rows.length).toString() + '件';
    }
  };
})();
