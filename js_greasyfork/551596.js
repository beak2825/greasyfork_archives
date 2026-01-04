// ==UserScript==
// @name         Showdown Team Backup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Backup and restore Pokemon Showdown! teams in files
// @author       AnsonIsTheBest
// @match        https://play.pokemonshowdown.com/teambuilder*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/551596/Showdown%20Team%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/551596/Showdown%20Team%20Backup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!localStorage.getItem('showdownBackupDialogDisabled')) {
        const response = confirm('感谢安装队伍导出插件！在队伍编辑器界面划到底可以找到备份所有队伍和导入备份的按钮！如果找不到按钮了请刷新界面并不要点进任何队伍详情。遇到问题请访问https://discord.gg/KAR3mEjRWe。\n\n\nThank you for installing Showdown Team Backup! Scroll down to the bottom in team builder to find the button to backup teams and import teams! If you cant find the button reload the page and scroll down directly without clicking on any teams. For any other issues visit https://discord.gg/KAR3mEjRWe');
        if (response === false) {
            localStorage.setItem('showdownBackupDialogDisabled', 'true');
        }
    }

    function backupTeams() {
        const teams = window.localStorage.getItem('showdown_teams');
        if (!teams) {
            alert('没有找到可以备份的队伍！\nNo teams found to backup!');
            return;
        }

        const date = new Date();
        const dateStr = date.getFullYear() + '-' +
                       ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                       ('0' + date.getDate()).slice(-2);
        const timeStr = ('0' + date.getHours()).slice(-2) + '-' +
                       ('0' + date.getMinutes()).slice(-2) + '-' +
                       ('0' + date.getSeconds()).slice(-2);
        const filename = `Teams_${dateStr}--${timeStr}.txt`;

        const blob = new Blob([teams], { type: 'text/plain' });
        GM_download({
            url: URL.createObjectURL(blob),
            name: filename,
            saveAs: true
        });
    }

    function restoreTeams() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const teams = e.target.result;
                window.localStorage.setItem('showdown_teams', teams);
                alert('已导入完毕！重新加载中...\n\nTeams restored! Reloading page...');
                location.reload();
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function addBackupButtons() {
        const teampane = document.querySelector('.teampane');
        if (!teampane) return;

        const backupButton = document.createElement('button');
        backupButton.className = 'button';
        backupButton.innerHTML = '<i class="fa fa-download"></i> Backup teams';
        backupButton.addEventListener('click', backupTeams);

        const restoreButton = document.querySelector('button[name="backup"]');
        if (restoreButton) {
            restoreButton.parentNode.insertBefore(backupButton, restoreButton);
        }

        const importButton = document.createElement('button');
        importButton.className = 'button';
        importButton.innerHTML = '<i class="fa fa-upload"></i> Import teams from backup';
        importButton.addEventListener('click', restoreTeams);
        restoreButton.parentNode.insertBefore(importButton, restoreButton.nextSibling);
    }

    window.addEventListener('load', addBackupButtons);
})();