// ==UserScript==
// @name         Neopets Quest Log Quick Links
// @version      1.3.2
// @description  Adds quick-link buttons for certain quests on the Neopets Quest Log
// @match        https://www.neopets.com/questlog/*
// @grant        none
// @run-at       document-idle
// @namespace Fippmeister
// @downloadURL https://update.greasyfork.org/scripts/556568/Neopets%20Quest%20Log%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/556568/Neopets%20Quest%20Log%20Quick%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addQuickLinkToTask(task) {
        if (!task || task.dataset.quickLinkAdded === '1') return;

        const text = (task.innerText || '').trim().toLowerCase();
        let link = null;

        if (text === ('groom your neopet')) {
            link = 'https://www.neopets.com/safetydeposit.phtml?obj_name=&category=10';
        }

        if (text === ('view popular nc items')) {
            link = 'https://ncmall.neopets.com/mall/search.phtml?type=popular_items&cat=54&page=1&limit=24';
        }
      
        if (text === ('play a game')) {
            link = 'https://www.neopets.com/games/h5game.phtml?game_id=1391';
        }

        if (text === ('fish at ye olde fishing vortex')) {
            link = 'https://www.neopets.com/water/fishing.phtml';
        }

        if (text === ('customise your neopet')) {
            link = 'https://www.neopets.com/customise/';
        }

        if (text === ('popular nc items')) {
            link = 'https://ncmall.neopets.com/mall/shop.phtml';
        }

        if (text === ('spin the wheel of excitement')) {
            link = 'https://www.neopets.com/faerieland/wheel.phtml';
        }

        if (text === ('spin the wheel of knowledge')) {
            link = 'https://www.neopets.com/medieval/knowledge.phtml';
        }

        if (text === ('spin the wheel of mediocrity')) {
            link = 'https://www.neopets.com/prehistoric/mediocrity.phtml';
        }

        if (text === ('spin the wheel of misfortune')) {
            link = 'https://www.neopets.com/halloween/wheel/index.phtml';
        }

        if (text === ('purchase item(s)')) {
            link = 'https://www.neopets.com/generalstore.phtml';
        }

        if (text === ('read to your neopet')) {
            link = 'https://www.neopets.com/safetydeposit.phtml?obj_name=&category=6';
        }

        if (text === ('feed your neopet')) {
            link = 'https://www.neopets.com/safetydeposit.phtml?obj_name=&category=18';
        }

        if (text === ('play with your neopet')) {
            link = 'https://www.neopets.com/safetydeposit.phtml?obj_name=&category=5';
        }
      
      	if (text === ('fight in the battledome')) {
            link = 'https://www.neopets.com/dome/';
        }

      	if (text === ('visit the nc mall')) {
            link = 'https://ncmall.neopets.com/mall/shop.phtml';
        }

      	if (text === ('try on an nc item')) {
          link = 'https://ncmall.neopets.com/mall/shop.phtml';
        }
      
        if (!link) return;

        const btn = document.createElement('a');
        btn.textContent = 'Quick Link';
        btn.href = link;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.dataset.quickLink = '1';

        Object.assign(btn.style, {
            marginLeft: '8px',
            padding: '4px 8px',
            background: '#f5c94c',
            border: '1px solid #c99a2b',
            borderRadius: '4px',
            fontWeight: 'bold',
            color: '#000',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            zIndex: '9999'
        });

        task.appendChild(btn);
        task.dataset.quickLinkAdded = '1';
    }

    function processExistingTasks() {
        const tasks = document.querySelectorAll('.ql-task-description');
        tasks.forEach(addQuickLinkToTask);
    }

    function observeTasks() {
        const container = document.querySelector('#content') || document.body;

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) {
                    m.addedNodes.forEach(node => {
                        if (!(node instanceof Element)) return;
                        if (node.matches && node.matches('.ql-task-description')) {
                            addQuickLinkToTask(node);
                        }
                        node.querySelectorAll && node.querySelectorAll('.ql-task-description').forEach(addQuickLinkToTask);
                    });
                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        processExistingTasks();
        observeTasks();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            processExistingTasks();
            observeTasks();
        }, { once: true });
    }
})();
