// ==UserScript==
// @name            作者近期作品瀏覽
// @name:en         Artist Recent Works Scamper
// @name:ja         アーティスト最新作品ブラウザ
// @name:de         Browser für die neuesten Werke von Künstlern
// @name:uk         Браузер останніх робіт художників
// @description     在 /artists 的作者欄中顯示作者的近期 3 個作品，方便快速瞭解創作風格。支援Kemono/Coomer。
// @description:en  Displays the 3 most recent works in the artist section on /artists, making it easy to understand their creative style. Suppper Kemono/Coomer.
// @description:ja  /artists のアーティスト欄に最新の3作品を表示し、創作スタイルを素早く理解できます。Kemono/Coomerに対応しています。
// @description:de  Zeigt die 3 neuesten Werke im Künstlerbereich auf /artists an, um den kreativen Stil schnell zu verstehen. Supper Kemono/Coomer.
// @description:uk  Відображає 3 останні роботи в розділі авторів на /artists, дозволяючи швидко зрозуміти їхній творчий стиль. Суппер Кемоно/Кумер.

// @match        *://kemono.cr/artists*
// @match        *://*.kemono.cr/artists*
// @match        *://*.kemono.cr/*/user/*/recommended
// @match        *://*.kemono.cr/artists/updated*
// @match        *://coomer.st/artists*
// @match        *://*.coomer.st/artists*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.cr
// @grant        GM_addStyle
// @version      1.1.1

// @author       Max
// @namespace    https://greasyfork.org/zh-TW/users/1021017-max46656
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/552770/%E4%BD%9C%E8%80%85%E8%BF%91%E6%9C%9F%E4%BD%9C%E5%93%81%E7%80%8F%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/552770/%E4%BD%9C%E8%80%85%E8%BF%91%E6%9C%9F%E4%BD%9C%E5%93%81%E7%80%8F%E8%A6%BD.meta.js
// ==/UserScript==

class ArtistCardEnhancer {
    constructor() {
        this.queue = [];
        this.observer = null;
        this.processedCards = new Set();
        this.artistCardsSelector = "a.user-card:not([data-processed='true'])";
        this.init();
    }

    init() {
        try{
            this.loadArtistCards();
            this.setupMutationObserver();
            this.addStyle();
        }catch(e){console.error(e)}
    }

    addStyle(){
        const STYLES = `
      .card-list--legacy .card-list__items {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, 250px);
          gap: 16px;
          padding: 16px;
          width: 100%;
          margin: 0 auto;
          grid-auto-rows: auto;
      }

      .post-card {
          width: 100% !important;
          margin: 0 !important;
          break-inside: avoid;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          overflow: hidden;
          height: auto !important;
          transition: transform 0.2s ease;
          position: relative;
          font-size: larger;
          padding: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .post-card:hover {
          transform: translateY(-2px);
      }

      .post-card__image-container {
          position: relative;
          width: 100%;
          height: auto !important;
      }

      .post-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 2%;
      }

      .post-card--preview.mini-preview {
          font-size: smaller;
          width: 33%;
          margin: 5px;
          padding: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .post-card--preview .fancy-link--kemono {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          position: relative;
      }

      .post-card__footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: rgba(0,0,0,0.3);
          text-align: center;
          padding: 5px 0;
      }

      .post-card__footer > div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
      }

      .post-card__footer .attachment-count {
          width: 20px;
          display: flex;
          align-items: center;
      }

      .post-card__footer .attachment-count svg {
          width: 100%;
          height: 100%;
          fill: white;
      }

      .post-card__footer .title {
          font-size: 0.7em;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }

      .header-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
      }

      .header-container .fancy-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          margin-bottom: 8px;
      }

      .header-container .fancy-image__image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
      }

      .post-card__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
      }

      .post-card__header .user-card__service {
          font-size: 0.9em;
          color: #888;
      }

      .post-card__header .user-card__name {
          font-size: 1.1em;
          font-weight: bold;
      }

      .post-card__header .user-card__count {
          font-size: 0.8em;
          color: #666;
      }

      .artist-previews-container {
          flex-direction: row;
          justify-content: space-between;
          margin-top: 10px;
      }
  `;

        GM_addStyle(STYLES);
    }

    loadArtistCards() {
        this.artistCards = Array.from(document.querySelectorAll(this.artistCardsSelector));

        const invalidCards = this.artistCards.filter(card => !card.href);

        if (invalidCards.length > 0 ||this.artistCards.length == 0) {
            console.warn(`${invalidCards.length}項作者卡尚未載入完成，重試中`);
            setTimeout(() => this.loadArtistCards(), 1000);
            return;
        }

        this.queue = Array.from(this.artistCards);
        if (this.queue.length > 0) {
            this.processQueue();
        } else if (this.processedCards.size >= 50) {
            if (this.observer) {
                this.observer.disconnect();
                console.log(`已處理張${this.artistCards.length}作者卡`);
            }
            document.title = "[🈵pageDone!]";
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            const hasNewCards = mutations.some(mutation =>
                                               Array.from(mutation.addedNodes).some(node =>
                                                                                    node.nodeType === Node.ELEMENT_NODE &&
                                                                                    node.matches(this.artistCardsSelector)
                                                                                   )
                                              );
            if (hasNewCards) {
                this.loadArtistCards();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        this.observer = observer;
    }

    async fetchUpdateArticles(url) {
        const articles = [];
        const seenPostIds = new Set();
        const isKemono = url.includes('kemono');
        let cleanUrl = url.replace(/^.*(?=\/[^\/]+\/user\/[^\/]+)/, "");
        let creatorPostsApi, creatorInfoApi;
        if (isKemono) {
            creatorPostsApi = 'https://kemono.cr/api/v1' + cleanUrl + '/posts';
            creatorInfoApi = 'https://kemono.cr/api/v1' + cleanUrl + '/profile';
            console.log(`Fetching posts from: ${creatorPostsApi}`);
        } else {
            creatorPostsApi = 'https://coomer.st/api/v1' + cleanUrl + '/posts';
            creatorInfoApi = 'https://coomer.st/api/v1' + cleanUrl + '/profile';
        }
        try {
            const postsResponse = await fetch(creatorPostsApi, {
                headers: {
                    'Accept': 'text/css'
                }
            });
            if (!postsResponse.ok) {
                console.warn(`API 請求失敗，狀態碼：${postsResponse.status}，重試中...`);
                await this.delay(2000);
                return this.fetchUpdateArticles(url);
            }
            const posts = await postsResponse.json();
            console.log(`API 返回 ${posts.length} 個作品`);

            if (posts.length === 0) {
                console.log('無可用作品');
                return articles;
            }

            let newerPosts = posts.slice(0, 3);
            console.log(`選取 ${newerPosts.length} 個作品`);

            const infoResponse = await fetch(creatorInfoApi, {
                headers: {
                    'Accept': 'text/css'
                }
            });
            const info = await infoResponse.json();
            const userName = info.name;

            for (let post of newerPosts) {
                if (seenPostIds.has(post.id)) continue;
                seenPostIds.add(post.id);
                const articleId = post.id;
                const service = post.service;
                const user = post.user;
                const title = post.title || '無標題';
                const filePath = post.file ? post.file.path : '';
                const timestamp = post.published || post.added;
                const attachmentsCount = post.attachments ? post.attachments.length : 0;

                const href = `/${service}/user/${user}/post/${articleId}`;
                const imgSrc = filePath

                const articleHtml = `
                <article class="post-card post-card--preview mini-preview" data-id="${articleId}" data-service="${service}" data-user="${user}">
                  <a class="fancy-link fancy-link--kemono" href="${href}">
                      <div class="post-card__image-container"><img class="post-card__image" src="${imgSrc}" loading="lazy"></div>
                      <footer class="post-card__footer">
                          <div>
                              <div class="attachment-count">${attachmentsCount}
                                  <svg viewBox="0 0 10 10">
                                      <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
                                          C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
                                          C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6,8 6,8 L1,8 C0.44771525,8
                                          0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z" transform="">
                                      </path>
                                  </svg>
                              </div>
                              <div class="title">${title}</div>
                          </div>
                      </footer>
                  </a>
                  <time class="timestamp" datetime="${timestamp}" style="display: none;"></time>
              </article>`;
                const parser = new DOMParser();
                const doc = parser.parseFromString(articleHtml, 'text/html');
                const articleElement = doc.body.firstChild;
                articles.push(articleElement);
            }
            console.log(`生成了 ${articles.length} 個作品元素`);
        } catch (error) {
            console.error(`獲取作品 ${url} 失敗:`, error);
        }
        return articles;
    }

    async addArticlesToCard(artistCard, articles) {
        if (articles.length === 0) {
            console.log(`無作品可添加到卡片 ${artistCard.getAttribute('data-id')}`);
            artistCard.setAttribute('data-processed', 'true');
            this.processedCards.add(artistCard.getAttribute('data-id'));
            return;
        }

        const userId = artistCard.getAttribute('data-id');
        const service = artistCard.getAttribute('data-service');
        const userName = artistCard.querySelector('.user-card__name')?.textContent.trim() || 'Unknown';
        const userIcon = artistCard.querySelector('.fancy-image__image')?.src || 'https://via.placeholder.com/50';
        const userFavorites = artistCard.querySelector('.user-card__count')?.textContent.trim() || '0 favorites';
        const userHref = artistCard.getAttribute('href');
        const originalStyle = artistCard.getAttribute('style') || '';
        const originalClasses = artistCard.className;

        // 創建新的作者與作品卡
        const newCard = document.createElement('a');
        newCard.className = `${originalClasses} post-card post-card--preview`;
        newCard.setAttribute('data-id', userId);
        newCard.setAttribute('data-service', service);
        newCard.setAttribute('data-processed', 'true');
        newCard.setAttribute('data-discover', artistCard.getAttribute('data-discover') || 'true');
        newCard.setAttribute('fix', artistCard.getAttribute('fix') || 'true');
        newCard.setAttribute('style', originalStyle);

        // 添加作者資訊
        const headerContainer = document.createElement('div');
        headerContainer.className = 'header-container';

        // 添加頭像
        const userProfileLink = document.createElement('a');
        userProfileLink.className = 'fancy-link';
        userProfileLink.setAttribute('data-id', userId);
        userProfileLink.setAttribute('data-service', service);
        userProfileLink.setAttribute('href', userHref);
        userProfileLink.innerHTML = `
            <span class="fancy-image">
                <picture class="fancy-image__picture">
                    <img class="fancy-image__image" src="${userIcon}" loading="lazy">
                </picture>
            </span>
        `;
        headerContainer.appendChild(userProfileLink);

        const header = document.createElement('header');
        header.className = 'post-card__header';
        header.innerHTML = `
            <div>
                <span class="user-card__service">${service}</span>
                <span class="user-card__name">${userName}</span>
                <span class="user-card__count">${userFavorites}</span>
            </div>
        `;
        headerContainer.appendChild(header);
        newCard.appendChild(headerContainer);

        // 添加作品預覽容器
        const previewsContainer = document.createElement('div');
        previewsContainer.className = 'artist-previews-container';
        articles.forEach(article => {
            previewsContainer.appendChild(article);
        });
        newCard.appendChild(previewsContainer);

        // 替換原作者卡
        artistCard.parentNode.replaceChild(newCard, artistCard);
        this.processedCards.add(userId);
        console.log(`已為卡片 ${userId} 添加 ${articles.length} 個作品`);
    }

    /*async processQueue() {
        while (this.queue.length > 0) {
            const card = this.queue.shift();
            try {
                if (!card.href) {
                    throw new Error("Card href 為null");
                }

                const articles = await this.fetchUpdateArticles(card.href);
                await this.addArticlesToCard(card, articles);
                document.title = "[🈱favoritesReading]";
            } catch (e) {
                console.error(`${card}錯誤：`, e);
                document.title = "[🈲waitForApi]";
                if (card) this.queue.push(card);
                await this.delay(1000);
            }
        }
        if (this.processedCards.size >= 50) {
            if (this.observer) {
                this.observer.disconnect();
                console.log(`已處理張${this.artistCards.length}作者卡`);
            }
            document.title = "[🈵pageDone!]";
        }
    }*/

    async processQueue() {
        this.queue = this.queue.filter(card => {
            if (card.dataset && card.dataset.processed === "true") {
                console.log(`卡片已處理，跳過：${card.href}`);
                return false;
            }
            return true;
        });

        if (this.queue.length === 0) {
            const allDiscoveredCards = this.artistCards || [];
            const allProcessed = allDiscoveredCards.every(card =>
                                                          card.dataset && card.dataset.processed === "true"
                                                         );

            if (allProcessed) {
                if (this.observer) {
                    this.observer.disconnect();
                    console.log(`所有 ${allDiscoveredCards.length} 張作者卡已處理完畢`);
                }
                document.title = "[🈵pageDone!]";
            } else {
                document.title = "[🈱favoritesReading]";
            }
            return;
        }

        const currentBatch = [...this.queue];
        this.queue.length = 0;

        const settleResults = await Promise.allSettled(
            currentBatch.map(card => this.processSingleCard(card))
        );

        let hasRetry = false;
        settleResults.forEach((result, index) => {
            const card = currentBatch[index];
            if (result.status === "rejected") {
                console.error(`${card.href} 處理失敗，將重試：`, result.reason);
                this.queue.push(card);
                hasRetry = true;
            }
        });

        if (this.queue.length > 0) {
            document.title = "[🈲waitForApi]";
        } else {
            document.title = "[🈱favoritesReading]";
        }

        if (hasRetry) {
            await this.delay(1500);
        }

        await this.processQueue();
    }

    async processSingleCard(card) {
        if (!card.href) {
            throw new Error("Card href 為 null");
        }

        if (card.dataset && card.dataset.processed === "true") {
            return;
        }

        const articles = await this.fetchUpdateArticles(card.href);
        await this.addArticlesToCard(card, articles);

        if (card.dataset) {
            card.dataset.processed = "true";
        } else {
            card.setAttribute("data-processed", "true");
        }

        this.processedCards?.add(card);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class PageIndicatorObserver {
    constructor(checkInterval = 1000) {
        this.selector = "#paginator-top";
        this.checkInterval = checkInterval;
        this.pageIndicator = null;
        this.retryInterval = null;
        this.observer = null;
        this.init();
    }

    init() {
        this.retryInterval = setInterval(() => {
            this.pageIndicator = document.querySelector(this.selector);
            if (this.pageIndicator) {
                console.log(`${this.selector} 頁數顯示器已獲取`);
                clearInterval(this.retryInterval);
                this.setupObserver();
            } else {
                console.log(`${this.selector} 頁數顯示器未獲取`);
            }
        }, this.checkInterval);
    }

    setupObserver() {
        if (!this.pageIndicator) return;

        console.log("pageIndicator:", this.pageIndicator);

        this.observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                //console.log("翻頁偵測:，");
                this.stop();
                window.location.reload();
            });
        });

        const observerOptions = {
            subtree: true,
            characterData: true,
        };

        this.observer.observe(this.pageIndicator, observerOptions);
    }

    stop() {
        if (this.retryInterval) {
            clearInterval(this.retryInterval);
            this.retryInterval = null;
        }
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        //console.log("停止觀察");
    }
}

new ArtistCardEnhancer();

new PageIndicatorObserver(500);
