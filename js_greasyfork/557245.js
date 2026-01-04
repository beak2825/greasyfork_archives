// ==UserScript==
// @name         あいもげスーパーなんとかかんとか
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description 右上でいもげとあいもげを相互リンクします
// @description:en Add cross-links between 2chan.net and nijiurachan.net
// @author       kenshoen
// @match        https://img.2chan.net/b/
// @match        https://img.2chan.net/b/res/*.htm
// @match        https://img.2chan.net/b/futaba.php*
// @match        https://nijiurachan.net/
// @match        https://nijiurachan.net/pc/index.php
// @match        https://nijiurachan.net/pc/thread.php*
// @match        https://nijiurachan.net/pc/catalog.php*
// @run-at       document-end
// @icon         data:image/webp;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557245/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%81%AA%E3%82%93%E3%81%A8%E3%81%8B%E3%81%8B%E3%82%93%E3%81%A8%E3%81%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557245/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%81%AA%E3%82%93%E3%81%A8%E3%81%8B%E3%81%8B%E3%82%93%E3%81%A8%E3%81%8B.meta.js
// ==/UserScript==

class NijiuraChanSuperNantoka {
    #urlMapper = new UrlMapper()

    run() {
        const hml = document.getElementById('hml');
        const fragment = this.makeFragment();

        hml?.prepend(fragment);
    }

    makeFragment() {
        const loc = window.location;
        const is2chan = loc.hostname.includes('2chan.net');

        const thin = document.createElement('a');
        const bold = document.createElement('a');
        const [link2chan, linkNiji] = is2chan ? [bold, thin] : [thin, bold];

        link2chan.textContent = 'img';
        link2chan.href = this.#urlMapper.to2chan(loc);
        linkNiji.textContent = 'aimg';
        linkNiji.href = this.#urlMapper.from2chan(loc);
        bold.className = 'aimg-super-nantokakantoka-current-board';
        bold.style['font-weight'] = 'bold';
        bold.href = 'javascript:void(location.reload())';

        const span = document.createElement("span");
        span.className = 'aimg-super-nantokakantoka';
        span.append('[', link2chan, '] [', linkNiji, ']');

        return span;
    }
}

class UrlMapper {
    #catalogMap = new CatalogParamMap()

    to2chan(loc) {
        const server = 'img';
        const board = 'b';
        const isCatalog = loc.pathname.includes('catalog.php');
        const sort = isCatalog && this.#catalogMap.to2chan(loc.search);
        if (sort) {
            return `https://${server}.2chan.net/${board}/futaba.php?mode=cat&sort=${sort}`;
        } else if (isCatalog) {
            return `https://${server}.2chan.net/${board}/futaba.php?mode=cat`
        } else {
            return `https://${server}.2chan.net/${board}/`;
        }
    }

    from2chan(loc) {
        const isCatalog = loc.href.includes('futaba.php?mode=cat')
        const q = isCatalog && this.#catalogMap.from2chan(loc.search);
        if (q) {
            return `https://nijiurachan.net/pc/catalog.php?${q}`;
        } else if (isCatalog) {
            return `https://nijiurachan.net/pc/catalog.php`;
        } else {
            return 'https://nijiurachan.net/';
        }
    }
}

class CatalogParamMap {
    #queryParams = ["", "sort=created", "sort=old", "sort=replies", "", "", "sort=momentum", "mode=viewed", "sort=soudane", "mode=posted"];

    from2chan(search) {
        const sortNo = search && new URLSearchParams(search).get('sort');

        return sortNo && this.#queryParams[sortNo];
    }

    to2chan(search) {
        return search && this.#queryParams.findIndex(q => search.includes(q));
    }
}

new NijiuraChanSuperNantoka().run();
