// ==UserScript==
// @name         fc2ppvdb - replace existing links with image grid
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Update article grid
// @author       You
// @match        https://fc2ppvdb.com/actresses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2ppvdb.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/htm/3.1.1/htm.min.js
// @require      https://unpkg.com/react@18.3.1/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/549102/fc2ppvdb%20-%20replace%20existing%20links%20with%20image%20grid.user.js
// @updateURL https://update.greasyfork.org/scripts/549102/fc2ppvdb%20-%20replace%20existing%20links%20with%20image%20grid.meta.js
// ==/UserScript==

const { createElement } = React;

const loadModule = async url => {
  try {
    const module = await (import(url)).default;
    console.log(`Module loaded: ${url}`);
    return module;
  } catch (error) {
    console.error(`Module failed to load: ${url}`);
    return;
  }
};

const loadTailwind = () => loadModule('https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4');

const fetchResponse = (url) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({ url, responseType: 'json', onload: res => resolve(res), onerror: err => reject(err) });
  });
};

const html = htm.bind(createElement);

const setupUI = (app, data) => {
  const root = ReactDOM.createRoot(app);
  const withNoImages = data.map(d => ({
    ...d,
    image_url: d.image_url === 'images/article/no-image.jpg' ? 'https://contents-thumbnail2.fc2.com/w276/' : d.image_url,
    uncensoredStatus: d.censored === '有' ? 'No' : d.censored === '無' ? 'Yes' : 'Unknown',
  }));
  root.render(html`<${Main} data=${withNoImages} />`);
};

const Main = ({ data }) => {
  return html`
    <div className='flex flex-wrap -m-4 py-4 gap-4'>
      ${data.map(article => html`
        <div className="max-w-[276px] max-h-[276px] min-w-[276px] min-h-[276px] relative bg-gray-200">
          <img src=${article.image_url} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-2">
            <h3>${article.video_id}</h3>
            <p className="text-xs">Uncensored: ${article.uncensoredStatus}</p>
            <div class="flex gap-2 mt-2">
              <a target="_blank" rel="noopener noreferrer" href=${`/articles/${article.video_id}`} className='bg-primary-700 text-white font-bold py-1 px-2 rounded-full text-xs'>fc2ppvdb</a>
              <a target="_blank" rel="noopener noreferrer" href=${`https://adult.contents.fc2.com/article/${article.video_id}/`} className='bg-primary-700 text-white font-bold py-1 px-2 rounded-full text-xs'>fc2</a>
            </div>
          </div>
        </div>
      `)}
    </div>
  `;
};

(async () => {
  'use strict';
  const main = document.querySelector('#actress-articles');
  const id = main.dataset.actressid;
  const [response] = await Promise.all([
    fetchResponse(`https://fc2ppvdb.com/actresses/actress-articles?actressid=${id}&page=1`),
    loadTailwind(),
  ]);
  const { articles } = response.response;
  console.log(response.response);
  if (articles?.data?.length > 0 && main) setupUI(main, articles.data);
})();