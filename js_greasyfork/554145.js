// ==UserScript==
// @name         GrimRepo: Community Standards Helper (GitLab, Bitbucket, Github)
// @namespace    https://greasyfork.org/en/users/jonathan-jewell
// @version      0.4
// @description  Audit and scaffold community files for golden repos.
// @author       Jonathan Jewell
// @license      GPL-3.0-or-later
// @match        https://gitlab.com/*
// @match        https://bitbucket.org/*
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554145/GrimRepo%3A%20Community%20Standards%20Helper%20%28GitLab%2C%20Bitbucket%2C%20Github%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554145/GrimRepo%3A%20Community%20Standards%20Helper%20%28GitLab%2C%20Bitbucket%2C%20Github%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CommunityHelper = {
    requiredFiles: [
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'SECURITY.md',
      'LICENSE',
      'CHANGELOG.md',
      'FUNDING.yml'
    ],

    init: function () {
      this.checkFiles();
    },

    checkFiles: function () {
      const missing = this.requiredFiles.filter(f => !document.querySelector(`a[title="${f}"]`));
      if (missing.length > 0) {
        this.renderPanel(missing);
      }
    },

    renderPanel: function (missing) {
      const panel = document.createElement('div');
      panel.style = 'position:fixed;bottom:10px;left:10px;background:#fff;padding:10px;border:2px solid blue;z-index:9999;font-size:12px;';
      panel.innerHTML = `<strong>Community Standards Missing:</strong><ul>` +
        missing.map(f => `<li>${f} <button data-file="${f}">Suggest</button></li>`).join('') +
        `</ul>`;
      document.body.appendChild(panel);

      panel.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => alert(`TODO: Insert template for ${btn.dataset.file}`);
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => CommunityHelper.init());
})();
