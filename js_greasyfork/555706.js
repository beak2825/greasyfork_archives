(function () {
  let selectedText;

  function initButtons(buttons) {
    const $searchBar = document.createElement("div");
    $searchBar.className = `gm-select-to-search`;
    $searchBar.addEventListener("mouseup", (e) => e.stopPropagation());
    document.body.appendChild($searchBar);

    buttons.forEach(({ label, url, prepend = "", append = "" }) => {
      const $button = createButton(label, () => {
        const text = `${prepend} ${selectedText} ${append}`.trim();
        window.open(url.replace("%s", text));
      });
      $searchBar.appendChild($button);
    });
    return $searchBar;
  }

  function createButton(label, onclick) {
    const $button = document.createElement("button");
    $button.innerHTML = label;
    if (onclick) $button.addEventListener("click", onclick);
    return $button;
  }

  function initListener($searchBar) {
    window.addEventListener("mouseup", function onMouseup(e) {
      selectedText = document.getSelection().toString().trim();
      if (selectedText) {
        $searchBar.style.display = "flex";
        const left = Math.min(e.x, window.innerWidth - $searchBar.offsetWidth - 20);
        const top = Math.min(e.y + 20, window.innerHeight - $searchBar.offsetHeight);
        $searchBar.style.left = left + "px";
        $searchBar.style.top = top + "px";
      } else {
        $searchBar.style.display = "none";
      }
    });
  }

  function initStyle({ background = "#edebdf", border = "1px solid #5c0d12" }) {
    const style = document.createElement("style");
    style.innerHTML = `
      .gm-select-to-search {
        display: none;
        position: fixed;
        z-index: 10000;
        padding: 5px;
        background: ${background};
        border: ${border};
  
        & button {
          margin: 2px;
          padding: 0 4px;
          white-space: nowrap;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
  
          & img {
            width: 16px;
            height: 16px;
            margin-right: 2px;
          }
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
    window.GM_SelectToSearch(
      [
        {
          // 按钮文本
          label: `<img src="https://www.voidtools.com/favicon.ico"> ES`,
          // 搜索链接，%s会被替换为选中文本
          url: "es:%s",
          // （可选）选中文本前面拼接
          prepend: "",
          // （可选）选中文本后面拼接
          append: "",
        },
      ],
      // （可选）搜索栏样式
      {
        background = "#edebdf",
        border = "1px solid #5c0d12",
      }
    );
   */
  window.GM_SelectToSearch = function SelectToSearch(buttons, styles = {}) {
    initStyle(styles);
    const $searchBar = initButtons(buttons);
    initListener($searchBar);
  };
})();
