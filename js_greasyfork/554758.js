// ==UserScript==
// @name         QOJ Better
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Make QOJ great again!
// @match        https://qoj.ac/*
// @match        https://jiang.ly/*
// @match        https://huang.lt/*
// @match        https://contest.ucup.ac/*
// @match        https://oj.qiuly.org/*
// @grant        none
// @license      MIT
// @author       cyx
// @downloadURL https://update.greasyfork.org/scripts/554758/QOJ%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/554758/QOJ%20Better.meta.js
// ==/UserScript==

// 获取题号
function getProblemId() {
    const matchContest = location.pathname.match(/\/contest\/(\d+)\/problem\/(\d+)/);
    if (matchContest) return matchContest[2];
    const matchProblem = location.pathname.match(/\/problem\/(\d+)/);
    if (matchProblem) return matchProblem[1];
    return null;
}

// 获取用户名
function getUsername() {
    const userLink = document.querySelector('a.dropdown-item[href*="/user/profile/"]');
    if (userLink) {
        const match = userLink.href.match(/\/user\/profile\/([^/?#]+)/);
        if (match) return match[1];
    }
    return null;
}

function switchDomain() {
    if (document.getElementById('domain-switcher')) return;
    const currentHost = location.host;
    const pathname = location.pathname + location.search + location.hash;
    const isContest =
        pathname.includes('/contest/') ||
        pathname.includes('/contests') ||
        pathname.includes('/user') ||
        pathname.includes('/results');
    const domains = isContest
        ? ['qoj.ac', 'jiang.ly', 'huang.lt', 'oj.qiuly.org', 'relia.uk', 'contest.ucup.ac']
        : ['qoj.ac', 'jiang.ly', 'huang.lt', 'oj.qiuly.org', 'relia.uk'];

    // 构造域名切换内容
    const span = document.createElement('span');
    span.id = 'domain-switcher';
    span.style.fontSize = '0.9em';
    span.style.color = '#666';
    span.textContent = 'switch to: ';

    domains.forEach((domain, i) => {
        const link = document.createElement('a');
        link.textContent = domain;
        link.style.marginLeft = '4px';
        link.style.color = domain === currentHost ? '#999' : '#007bff';
        link.style.cursor = domain === currentHost ? 'default' : 'pointer';
        link.style.textDecoration = 'none';
        link.onmouseover = () => (link.style.textDecoration = 'underline');
        link.onmouseout = () => (link.style.textDecoration = 'none');
        if (domain !== currentHost) {
            link.onclick = () => (window.location.href = `https://${domain}${pathname}`);
        }
        span.appendChild(link);
        if (i < domains.length - 1) span.append(' ');
    });

    // 插入到合适位置
    const navbarUser = document.querySelector('.nav-link.dropdown-toggle');
    if (navbarUser) {
        const parentUl = navbarUser.closest('ul.navbar-nav, ul.nav');
        if (parentUl && !parentUl.querySelector('#domain-switcher')) {
            const li = document.createElement('li');
            li.className = 'nav-item d-flex align-items-center';
            li.appendChild(span);
            parentUl.insertBefore(li, navbarUser.closest('li.nav-item'));
        }
        return;
    }

    const navPills = document.querySelector('.nav.nav-pills.float-right');
    if (navPills && !navPills.querySelector('#domain-switcher')) {
        const li = document.createElement('li');
        li.className = 'nav-item d-flex align-items-center';
        li.appendChild(span);
        navPills.insertBefore(li, navPills.firstChild);
        return;
    }

    document.body.insertBefore(span, document.body.firstChild);
};
function backProblem() {
    if (document.querySelector('.nav-link.back-problem')) return;
    const nav = document.querySelector("ul.nav.nav-tabs");
    if (!nav) return;

    const match = location.pathname.match(/^\/contest\/(\d+)\/problem\/(\d+)/);
    if (!match) return;
    const pid = match[2];

    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a class="nav-link back-problem" href="/problem/${pid}" role="tab">Back to the problem</a>`;

    const backToContest = Array.from(nav.querySelectorAll("a")).find(a => a.textContent.includes("Back to the contest"));
    if (backToContest) backToContest.parentElement.before(li);
    else nav.appendChild(li);
};
function viewSubmissions() {
    if (document.querySelector('.nav-link.view-submissions')) return;
    const nav = document.querySelector('ul.nav.nav-tabs[role="tablist"]');
    if (!nav) return;

    const matchContest = location.pathname.match(/\/contest\/(\d+)\/problem\/(\d+)/);
    const matchProblem = location.pathname.match(/\/problem\/(\d+)/);
    const pid = matchContest ? matchContest[2] : matchProblem ? matchProblem[1] : null;
    if (!pid) return;

    const userLink = document.querySelector('a.dropdown-item[href*="/user/profile/"]');
    const username = userLink ? userLink.href.match(/profile\/([^/?#]+)/)?.[1] : null;
    if (!username) return;

    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `<a class="nav-link view-submissions" href="/submissions?problem_id=${pid}&submitter=${username}" role="tab">View submissions</a>`;
    nav.appendChild(li);
};
function viewInContestLinks() {
    const alertBox = document.querySelector('.alert.alert-primary');
    if (!alertBox) return;

    const listItems = alertBox.querySelectorAll('ul.uoj-list li a[href*="/contest/"]');
    if (!listItems.length) return;

    const pidMatch = window.location.pathname.match(/\/problem\/(\d+)/);
    if (!pidMatch) return;
    const pid = pidMatch[1];

    listItems.forEach(a => {
        if (a.parentElement.querySelector('a[data-added="true"]')) return;
        const match = a.href.match(/\/contest\/(\d+)(\?v=\d+)?/);
        if (!match) return;
        const cid = match[1];
        const ver = match[2] || '';
        const viewLink = document.createElement('a');
        viewLink.textContent = '[view in contest]';
        viewLink.href = `/contest/${cid}/problem/${pid}${ver}`;
        viewLink.style.marginLeft = '4px';
        viewLink.dataset.added = 'true';
        a.insertAdjacentElement('afterend', viewLink);
    });
};
function addAcTag() {
    if (window.__qoj_fullscore_lock) return;
    window.__qoj_fullscore_lock = true;
    if (window.__qoj_no_ac) return;
    const pid = getProblemId();
    const username = getUsername();
    if (!pid || !username) return;
    try {
        const pid = getProblemId();
        const username = getUsername();
        if (!pid || !username) return;

        const infoRow = document.querySelector('.row.d-flex.justify-content-center');
        if (!infoRow) return;
        if (infoRow.querySelector('.badge-fullscore')) return;

        const totalEl = [...infoRow.querySelectorAll('.badge.badge-secondary')]
            .find(e => e.textContent.includes('Total points'));
        if (!totalEl) return;

        const total = parseFloat(totalEl.textContent.replace(/[^\d.]/g, ''));
        if (isNaN(total)) return;

        fetch(`/submissions?problem_id=${pid}&submitter=${username}&min_score=${total}&max_score=${total}`)
            .then(res => res.text())
            .then(html => {
                const match = html.match(/<td><a href="(\/submission\/\d+)">/);
                if (!match) {
                    window.__qoj_no_ac = true;
                    return;
                }
                const sub = match[1];
                const badge = document.createElement('a');
                badge.className = 'badge badge-success mr-1 badge-fullscore';
                badge.textContent = 'Accepted ✓';
                badge.href = `${sub}`;
                badge.target = '_blank';
                infoRow.appendChild(badge);
                const submitLink = document.querySelector('a.nav-link[href="#tab-submit-answer"]');
                if (!submitLink) return;

                if (submitLink.classList.contains('submit-green')) return;

                submitLink.classList.add('submit-green');

                const style = document.createElement('style');
                style.textContent = `
                        a.nav-link.submit-green {
                            color: #00cc00 !important;
                        }
                        a.nav-link.submit-green:hover {
                            color: #00cc00 !important;
                        }
                    `;
                document.head.appendChild(style);
            })
            .catch(err => console.error('检测满分失败:', err))
            .finally(() => {
                setTimeout(() => { window.__qoj_fullscore_lock = false; }, 100);
            });
    } catch (e) {
        console.error(e);
        window.__qoj_fullscore_lock = false;
    }
}

(function () {
    'use strict';
    // --- 定义主函数 ---
    function main() {
        switchDomain();
        backProblem();
        viewSubmissions();
        viewInContestLinks();
        addAcTag();
    }

    // --- 初次执行 ---
    main();

    // --- 使用 MutationObserver 监听 DOM 动态变化 ---
    const observer = new MutationObserver(() => {
        // 检查关键元素是否存在
        const needRun =
            document.querySelector('.alert.alert-primary') || // 可能是 viewInContestLinks 所需
            document.querySelector('ul.nav.nav-tabs') || // viewSubmissions / backProblem
            document.querySelector('.nav-link.dropdown-toggle') || // 登录状态
            document.querySelector('.nav.nav-pills.float-right'); // 游客状态

        if (needRun) {
            observer.disconnect(); // 先断开，防止重复触发
            setTimeout(() => {
                main(); // 稍延迟再执行，确保元素已稳定渲染
                observer.observe(document.body, { childList: true, subtree: true }); // 重新监听
            }, 100);
        }
    });

    // 启动观察器
    observer.observe(document.body, { childList: true, subtree: true });
})();
