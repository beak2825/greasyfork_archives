// ==UserScript==
// @name         FileFlux copy links by domain
// @version      1.1
// @description  FileFlux copy links by domain menu
// @match        https://dev.fileflux.spankingforum.su/s/*
// @connect      dev.fileflux.spankingforum.su
// @grant        GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1564079
// @downloadURL https://update.greasyfork.org/scripts/563896/FileFlux%20copy%20links%20by%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/563896/FileFlux%20copy%20links%20by%20domain.meta.js
// ==/UserScript==

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '10px';
container.style.right = '10px';
container.style.zIndex = '99999';
container.style.display = 'flex';
container.style.gap = '6px';

const select = document.createElement('select');
select.style.padding = '4px';
select.style.width = '180px';
select.style.background = '#fff';
select.style.color = '#000';

const btn = document.createElement('button');
btn.textContent = 'Copy';
btn.style.padding = '6px 10px';
btn.style.cursor = 'pointer';

btn.onclick = async () => {
    const url = select.value;
    if (!url) return;

    const links = Array.from(
        document.querySelectorAll(`a[href^="${url}"]`)
    ).map(a => a.href);

    if (!links.length) return;

    await navigator.clipboard.writeText(links.join('\n'));

    const originalText = btn.textContent;
    btn.textContent = `Copied ${links.length} ✓`;
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
};

container.appendChild(select);
container.appendChild(btn);
document.body.appendChild(container);


(async () => {
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://dev.fileflux.spankingforum.su/api/admin/hosts'
    });
    const apiData = JSON.parse(response.responseText);
    apiData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.home_url;
        option.textContent = item.display_name;
        select.appendChild(option);
    });
})();

