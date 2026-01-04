// ==UserScript==
// @name         GitLab Board Improvements
// @namespace    https://iqnox.com
// @version      0.10
// @description  Always show both issues and tasks on GitLab boards, display parent information (issue/epic) for each card, add a show/hide tasks toggle and standup helper UI, and show per-issue task completion progress based on child tasks fetched on demand.
// @author       placatus@iqnox.com, ChatGPT
// @license      MIT
// @match        https://gitlab.com/*/-/boards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555745/GitLab%20Board%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/555745/GitLab%20Board%20Improvements.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Card selector constant for reuse across queries.
  const CARD_SELECTOR = ".board-card, .gl-issue-board-card, li[data-id]";
  // Track processed cards to avoid duplicate processing across observer events.
  const processedCards = new WeakSet();
  // Debounce flag for task count UI updates.
  let scheduledTaskUI = false;
  /**
   * Schedule an update to the issue task count badges on the next animation frame.
   * This prevents thrashing the DOM when many child tasks finish loading at once.
   */
  function scheduleTaskCountUpdate() {
    if (scheduledTaskUI) return;
    scheduledTaskUI = true;
    requestAnimationFrame(() => {
      updateIssueTaskCountUI();
      scheduledTaskUI = false;
    });
  }

  /* ------------------------------------------------------------------------
   *  Board types filter (always show issues + tasks)
   * ---------------------------------------------------------------------- */

  function enforceIssueAndTaskFilter() {
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const types = params.getAll("types[]");
      const hasIssue = types.includes("ISSUE");
      const hasTask = types.includes("TASK");
      if (!hasIssue || !hasTask) {
        params.delete("types[]");
        params.append("types[]", "ISSUE");
        params.append("types[]", "TASK");
        window.location.replace(url.toString());
      }
    } catch (err) {
      console.warn("Failed to enforce issue/task filter:", err);
    }
  }

  /* ------------------------------------------------------------------------
   *  Per-board "show tasks" state (localStorage)
   * ---------------------------------------------------------------------- */

  function getBoardId() {
    const match = window.location.pathname.match(/\/boards\/(\d+)/);
    return match ? match[1] : "default";
  }

  function getBoardKey() {
    return `gitlab-board-show-tasks-${getBoardId()}`;
  }

  function getBoardShowTasks() {
    const value = localStorage.getItem(getBoardKey());
    // default: false (tasks hidden)
    return value === "true";
  }

  function setBoardShowTasks(value) {
    localStorage.setItem(getBoardKey(), value ? "true" : "false");
  }

  let showTasks = getBoardShowTasks();

  function updateTaskVisibility() {
    document
      .querySelectorAll(CARD_SELECTOR)
      .forEach((card) => {
        const link = card.querySelector('a[href*="/-/"]');
        if (!link) return;
        const parsed = parseItemFromUrl(link.href);
        if (parsed && parsed.type === "work_items") {
          card.style.display = showTasks ? "" : "none";
        }
      });
  }

  /* ------------------------------------------------------------------------
   *  Helper: parse item type / id / namespace from card link
   * ---------------------------------------------------------------------- */

  function parseItemFromUrl(href) {
    try {
      const url = new URL(href);
      const segments = url.pathname.split("/").filter(Boolean);
      const dashIndex = segments.indexOf("-");
      if (dashIndex !== -1 && segments.length > dashIndex + 2) {
        const typeSegment = segments[dashIndex + 1];
        const idSegment = segments[dashIndex + 2];
        const namespaceSegments = segments.slice(0, dashIndex);
        return {
          namespace: (() => {
            const parts = [...namespaceSegments];
            if (parts[0] === "groups") parts.shift();
            return parts.join("/");
          })(),
          type: typeSegment,
          id: idSegment,
        };
      }
    } catch (_) {
      // ignore
    }
    return null;
  }

  /* ------------------------------------------------------------------------
   *  GraphQL helpers (parents for tasks/issues, children for issues)
   * ---------------------------------------------------------------------- */

  async function fetchParent(globalId) {
    const query =
      "query($id: WorkItemID!) {\n" +
      "  workItem(id: $id) {\n" +
      "    widgets {\n" +
      "      ... on WorkItemWidgetHierarchy {\n" +
      "        parent { id title }\n" +
      "      }\n" +
      "    }\n" +
      "  }\n" +
      "}";

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { id: globalId } }),
      });
      const json = await response.json();
      const widgets = json?.data?.workItem?.widgets;
      if (Array.isArray(widgets)) {
        for (const widget of widgets) {
          if (widget && widget.parent) {
            return widget.parent;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching parent for", globalId, err);
    }
    return null;
  }

  async function fetchIssueEpic(fullPath, iid) {
    const query =
      "query($fullPath: ID!, $iid: String!) {\n" +
      "  project(fullPath: $fullPath) {\n" +
      "    issue(iid: $iid) {\n" +
      "      epic { id title }\n" +
      "    }\n" +
      "  }\n" +
      "}";

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { fullPath, iid: String(iid) },
        }),
      });
      const json = await response.json();
      return json?.data?.project?.issue?.epic || null;
    } catch (err) {
      console.error("Error fetching epic for issue", fullPath, iid, err);
      return null;
    }
  }

  // Tasks: parent via namespace(workItem(iid))
  async function fetchWorkItemParentByNamespace(fullPath, iid) {
    const query =
      "query($fullPath: ID!, $iid: String!) {\n" +
      "  namespace(fullPath: $fullPath) {\n" +
      "    workItem(iid: $iid) {\n" +
      "      widgets {\n" +
      "        ... on WorkItemWidgetHierarchy {\n" +
      "          parent { id title }\n" +
      "        }\n" +
      "      }\n" +
      "    }\n" +
      "  }\n" +
      "}";

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { fullPath, iid: String(iid) },
        }),
      });
      const json = await response.json();
      const widgets = json?.data?.namespace?.workItem?.widgets;
      if (Array.isArray(widgets)) {
        for (const widget of widgets) {
          if (widget && widget.parent) {
            return widget.parent;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching parent for work item", fullPath, iid, err);
    }
    return null;
  }

  async function buildParentChainForTask(fullPath, iid) {
    const chain = [];
    const immediate = await fetchWorkItemParentByNamespace(fullPath, iid);
    if (!immediate) return chain;
    chain.push(immediate);

    // Fetch grandparent epic via global WorkItem ID of the parent
    const globalId = immediate.id;
    const grand = await fetchParent(globalId);
    if (grand) chain.push(grand);
    return chain;
  }

  /* ------------------------------------------------------------------------
   *  Issue children cache & progress rendering (fetch on demand)
   * ---------------------------------------------------------------------- */

  const issueChildrenCache = {}; // key: `${fullPath}::${iid}` -> array of children { id, title, state }

  function issueKey(fullPath, iid) {
    return `${fullPath}::${iid}`;
  }

  async function fetchIssueChildren(fullPath, iid) {
    const key = issueKey(fullPath, iid);
    if (issueChildrenCache[key]) return issueChildrenCache[key];

    const query =
      "query($fullPath: ID!, $iid: String!) {\n" +
      "  namespace(fullPath: $fullPath) {\n" +
      "    workItem(iid: $iid) {\n" +
      "      widgets {\n" +
      "        ... on WorkItemWidgetHierarchy {\n" +
      "          children(first: 100) {\n" +
      "            nodes {\n" +
      "              id\n" +
      "              title\n" +
      "              state\n" +
      "            }\n" +
      "          }\n" +
      "        }\n" +
      "      }\n" +
      "    }\n" +
      "  }\n" +
      "}";

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { fullPath, iid: String(iid) },
        }),
      });
      const json = await response.json();
      const widgets = json?.data?.namespace?.workItem?.widgets || [];
      let children = [];
      for (const widget of widgets) {
        if (widget?.children?.nodes) {
          children = widget.children.nodes;
          break;
        }
      }
      issueChildrenCache[key] = children;
      // Defer updating task counts to avoid spamming the DOM.
      scheduleTaskCountUpdate();
      return children;
    } catch (err) {
      console.error("Error fetching children for issue", fullPath, iid, err);
      issueChildrenCache[key] = [];
      // Defer updating task counts to avoid spamming the DOM.
      scheduleTaskCountUpdate();
      return [];
    }
  }

  function updateIssueTaskCountUI() {
    const cards = document.querySelectorAll(CARD_SELECTOR);

    cards.forEach((card) => {
      const link = card.querySelector('a[href*="/-/"]');
      if (!link) return;
      const parsed = parseItemFromUrl(link.href);
      if (!parsed || parsed.type !== "issues") return;

      const key = issueKey(parsed.namespace, parsed.id);
      const children = issueChildrenCache[key];
      let badge = card.querySelector(".iqnex-tasks-count");

      if (!children || children.length === 0) {
        if (badge) badge.remove();
        return;
      }

      const total = children.length;
      const completed = children.filter((c) => c.state === "CLOSED").length;
      const pct = Math.round((completed / total) * 100);
      const isDone = completed === total;

      if (!badge) {
        badge = document.createElement("div");
        badge.className = "iqnex-tasks-count";
        badge.style.fontSize = "0.75em";
        badge.style.marginTop = "4px";
        badge.style.marginBottom = "8px";
        badge.style.marginRight = "12px";
        badge.style.marginLeft = "12px";
        badge.style.padding = "4px 6px";
        badge.style.borderRadius = "6px";
        badge.style.display = "block";
        badge.style.boxSizing = "border-box";
        card.appendChild(badge);
      }

      badge.style.backgroundColor = isDone
        ? "var(--green-50, #ecfdf3)"
        : "var(--yellow-50, #fef9c3)";
      badge.style.color = isDone
        ? "var(--green-700, #047857)"
        : "var(--yellow-800, #92400e)";

      badge.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <span>Tasks</span>
          <span>${completed}/${total} (${pct}%)</span>
        </div>
        <div style="position:relative;width:100%;height:4px;border-radius:999px;background:rgba(0,0,0,0.08);overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${
            isDone ? "#22c55e" : "#f97316"
          };"></div>
        </div>
      `;
    });
  }

  /* ------------------------------------------------------------------------
   *  Card processing: parents/epics + children progress
   * ---------------------------------------------------------------------- */

  function processCard(card) {
    if (!card) return;
    // Avoid duplicate processing of the same card across mutation observer events
    if (processedCards.has(card)) return;
    processedCards.add(card);
    if (card.dataset.parentInjected) return;

    const link = card.querySelector('a[href*="/-/"]');
    if (!link) return;
    const parsed = parseItemFromUrl(link.href);
    if (!parsed || !parsed.id) return;

    card.dataset.parentInjected = "pending";

    if (parsed.type === "work_items") {
      // Task / work item
      card.style.display = showTasks ? "" : "none";

      buildParentChainForTask(parsed.namespace, parsed.id).then((chain) => {
        if (!Array.isArray(chain) || chain.length === 0) {
          card.dataset.parentInjected = "done";
          return;
        }

        const info = document.createElement("div");
        info.style.fontSize = "0.85em";
        info.style.marginBottom = "8px";
        info.style.marginLeft = "12px";
        info.style.display = "flex";
        info.style.flexWrap = "wrap";
        info.style.gap = "4px";

        if (chain[0]) {
          const parentSpan = document.createElement("span");
          parentSpan.innerHTML = `<strong>Parent:</strong> ${chain[0].title}`;
          // Use pill styling consistent with GitLab UI
          parentSpan.style.backgroundColor = "var(--blue-50, #e0f2fe)";
          parentSpan.style.color = "var(--blue-700, #0369a1)";
          parentSpan.style.padding = "2px 8px";
          parentSpan.style.borderRadius = "999px";
          parentSpan.style.fontSize = "0.75rem";
          parentSpan.style.fontWeight = "500";
          parentSpan.style.display = "inline-block";
          info.appendChild(parentSpan);
        }

        if (chain[1]) {
          const epicSpan = document.createElement("span");
          epicSpan.innerHTML = `<strong>Epic:</strong> ${chain[1].title}`;
          epicSpan.style.backgroundColor = "var(--purple-50, #ede9fe)";
          epicSpan.style.color = "var(--purple-700, #5b21b6)";
          epicSpan.style.padding = "2px 8px";
          epicSpan.style.borderRadius = "999px";
          epicSpan.style.fontSize = "0.75rem";
          epicSpan.style.fontWeight = "500";
          epicSpan.style.display = "inline-block";
          info.appendChild(epicSpan);
        }

        card.appendChild(info);
        card.dataset.parentInjected = "done";
      });
    } else if (parsed.type === "issues") {
      // Issues: epic + children
      Promise.all([
        fetchIssueEpic(parsed.namespace, parsed.id),
        fetchIssueChildren(parsed.namespace, parsed.id),
      ]).then(([epic]) => {
        const info = document.createElement("div");
        info.style.fontSize = "0.85em";
        info.style.marginBottom = "8px";
        info.style.marginLeft = "12px";
        info.style.display = "flex";
        info.style.flexWrap = "wrap";
        info.style.gap = "4px";

        if (epic) {
          const epicSpan = document.createElement("span");
          epicSpan.innerHTML = `<strong>Epic:</strong> ${epic.title}`;
          // Use pill styling consistent with GitLab UI
          epicSpan.style.backgroundColor = "var(--purple-50, #ede9fe)";
          epicSpan.style.color = "var(--purple-700, #5b21b6)";
          epicSpan.style.padding = "2px 8px";
          epicSpan.style.borderRadius = "999px";
          epicSpan.style.fontSize = "0.75rem";
          epicSpan.style.fontWeight = "500";
          epicSpan.style.display = "inline-block";
          info.appendChild(epicSpan);
        }

        if (info.childElementCount > 0) {
          card.appendChild(info);
        }

        card.dataset.parentInjected = "done";
        // Defer badge updates rather than applying immediately.
        scheduleTaskCountUpdate();
      });
    } else {
      card.dataset.parentInjected = "done";
    }
  }

  function scanBoard() {
    const cards = document.querySelectorAll(CARD_SELECTOR);
    cards.forEach((card) => processCard(card));
    // Batch update task badges.
    scheduleTaskCountUpdate();
  }

  /* ------------------------------------------------------------------------
   *  Mutation observer (cards)
   * ---------------------------------------------------------------------- */

  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          if (
            node.matches &&
            node.matches(CARD_SELECTOR)
          ) {
            processCard(node);
          } else {
            const cards = node.querySelectorAll?.(CARD_SELECTOR);
            cards?.forEach((card) => processCard(card));
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    scanBoard();
  }

  /* ------------------------------------------------------------------------
   *  Dropdown: Show tasks toggle + standup item
   * ---------------------------------------------------------------------- */

  function insertShowTasksToggle() {
    try {
      const lists = document.querySelectorAll(".gl-new-dropdown-contents");
      lists.forEach((ul) => {
        const hasShowTasks = ul.querySelector(
          '[data-testid="show-tasks-toggle-item"]'
        );
        const showLabelsItem = ul.querySelector(
          '[data-testid="show-labels-toggle-item"]'
        );
        if (!showLabelsItem) return;

        if (hasShowTasks) {
          insertAdditionalDropdownItems(ul);
          return;
        }

        const newItem = showLabelsItem.cloneNode(true);
        newItem.setAttribute("data-testid", "show-tasks-toggle-item");

        const labelSpan = newItem.querySelector(".gl-toggle-label");
        if (labelSpan) {
          labelSpan.textContent = "Show tasks";
          labelSpan.id = `toggle-label-show-tasks-${Date.now()}`;
        }

        const toggleButton = newItem.querySelector(".gl-toggle");
        if (!toggleButton) return;

        const useEl = toggleButton.querySelector("use");
        let iconBase = "";
        if (useEl) {
          const href = useEl.getAttribute("href");
          const idx = href ? href.indexOf("#") : -1;
          if (idx > 0) iconBase = href.substring(0, idx);
        }

        const current = showTasks;
        const onIcon = "check-xs";
        const offIcon = "close-xs";

        function applyState(state) {
          toggleButton.setAttribute("aria-checked", state ? "true" : "false");
          toggleButton.classList.toggle("is-checked", state);
          const iconName = state ? onIcon : offIcon;
          if (useEl && iconBase) {
            useEl.setAttribute("href", `${iconBase}#${iconName}`);
          }
        }

        applyState(current);
        if (labelSpan)
          toggleButton.setAttribute("aria-labelledby", labelSpan.id);

        if (!toggleButton.dataset.tasksListenerAttached) {
          toggleButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const currentState =
              toggleButton.getAttribute("aria-checked") === "true";
            const newValue = !currentState;
            showTasks = newValue;
            setBoardShowTasks(newValue);
            applyState(newValue);
            updateTaskVisibility();
          });
          toggleButton.dataset.tasksListenerAttached = "true";
        }

        showLabelsItem.parentNode.insertBefore(
          newItem,
          showLabelsItem.nextSibling
        );
        insertAdditionalDropdownItems(ul);
      });
    } catch (err) {
      console.warn("Error inserting show tasks toggle:", err);
    }
  }

  function insertAdditionalDropdownItems(ul) {
    if (ul.querySelector('[data-testid="standup-item"]')) return;

    function createDropdownItem(label, testid, onClick) {
      const li = document.createElement("li");
      li.className = "gl-new-dropdown-item";
      li.setAttribute("tabindex", "0");
      li.setAttribute("data-testid", testid);

      const btn = document.createElement("button");
      btn.className = "gl-new-dropdown-item-content";
      btn.type = "button";
      btn.tabIndex = -1;

      const wrapper = document.createElement("span");
      wrapper.className = "gl-new-dropdown-item-text-wrapper";

      const textDiv = document.createElement("div");
      textDiv.className = "gl-new-dropdown-item-text";
      textDiv.textContent = label;

      wrapper.appendChild(textDiv);
      btn.appendChild(wrapper);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
      });
      li.appendChild(btn);
      return li;
    }

    const standupItem = createDropdownItem(
      "Start standup",
      "standup-item",
      () => {
        startStandup();
      }
    );

    ul.appendChild(standupItem);
  }

  const dropdownObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches && node.matches(".gl-new-dropdown-panel")) {
          insertShowTasksToggle();
        }
      });
    });
  });
  dropdownObserver.observe(document.body, { childList: true, subtree: true });

  insertShowTasksToggle();

  /* ------------------------------------------------------------------------
   *  Standup helper
   * ---------------------------------------------------------------------- */

  let standupState = null;

  function ensureStandupStyles() {
    if (document.getElementById("iqnex-standup-css")) return;
    const style = document.createElement("style");
    style.id = "iqnex-standup-css";
    style.textContent = `
      .iqnex-standup-highlight {
        outline: 3px solid var(--amber-500, #f97316);
        box-shadow: 0 0 0 2px var(--amber-200, #fed7aa);
        background-color: #fffbeb !important;
        transform: scale(1.02);
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  function gatherAssigneesAndCards() {
    const mapping = {};
    const avatarCache = {}; // stores avatar URLs for each user
    const cards = document.querySelectorAll(CARD_SELECTOR);

    cards.forEach((card) => {
      if (card.style.display === "none") return;

      const avatars = card.querySelectorAll("img[alt]");
      const seenForCard = new Set();

      avatars.forEach((img) => {
        let name = img.getAttribute("alt") || "";

        // Strip leading “Avatar for …”
        name = name.replace(/^Avatar for\s+/i, "").trim();
        if (!name) return;

        if (seenForCard.has(name)) return;
        seenForCard.add(name);

        if (!mapping[name]) mapping[name] = [];
        mapping[name].push(card);

        // Save avatar URL (only first avatar per assignee)
        if (!avatarCache[name]) {
          avatarCache[name] = img.src;
        }
      });
    });

    return { mapping, avatarCache };
  }

  /**
   * Create an SVG progress ring to visualize the completion percentage of a user's tasks.
   * @param {number} open Number of open tasks
   * @param {number} total Total number of tasks
   * @returns {SVGElement}
   */
  function createProgressRing(open, total) {
    // percentage closed: completed = total - open
    const pct = total === 0 ? 0 : Math.round(((total - open) / total) * 100);
    const radius = 8;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (pct / 100) * circ;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    const bg = document.createElementNS(svg.namespaceURI, "circle");
    bg.setAttribute("cx", "10");
    bg.setAttribute("cy", "10");
    bg.setAttribute("r", radius);
    bg.setAttribute("stroke", "var(--gl-border-color, #d1d5db)");
    bg.setAttribute("stroke-width", "3");
    bg.setAttribute("fill", "none");
    const fg = document.createElementNS(svg.namespaceURI, "circle");
    fg.setAttribute("cx", "10");
    fg.setAttribute("cy", "10");
    fg.setAttribute("r", radius);
    fg.setAttribute("stroke", "var(--green-600, #16a34a)");
    fg.setAttribute("stroke-width", "3");
    fg.setAttribute("fill", "none");
    fg.setAttribute("stroke-dasharray", circ);
    fg.setAttribute("stroke-dashoffset", offset);
    fg.setAttribute("transform", "rotate(-90 10 10)");
    svg.appendChild(bg);
    svg.appendChild(fg);
    return svg;
  }

  function highlightTasksForAssignee(assignee, mapping) {
    document.querySelectorAll(".iqnex-standup-highlight").forEach((el) => {
      el.classList.remove("iqnex-standup-highlight");
      el.style.outline = "";
      el.style.boxShadow = "";
    });

    const cards = mapping[assignee] || [];
    cards.forEach((card) => {
      card.classList.add("iqnex-standup-highlight");
    });

    if (cards.length > 0) {
      cards[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  /* ---- Standup order persistence ---- */

  function getStandupOrderKey() {
    return `iqnex-standup-order-${getBoardId()}`;
  }

  function saveStandupOrder(list) {
    try {
      localStorage.setItem(getStandupOrderKey(), JSON.stringify(list));
    } catch (_) {}
  }

  function loadStandupOrder(defaultList) {
    const raw = localStorage.getItem(getStandupOrderKey());
    if (!raw) return defaultList;
    try {
      const saved = JSON.parse(raw);
      // Filter out users no longer on board
      return saved.filter((x) => defaultList.includes(x));
    } catch (_) {
      return defaultList;
    }
  }

  function startStandup() {
    if (standupState) return;

    const { mapping, avatarCache } = gatherAssigneesAndCards();
    let assignees = Object.keys(mapping).filter(Boolean);
    if (assignees.length === 0) {
      alert("No assignees found on this board.");
      return;
    }

    // Load saved order, or randomize & save if none
    const hadSavedOrder = !!localStorage.getItem(getStandupOrderKey());
    assignees = loadStandupOrder(assignees);
    if (!hadSavedOrder) {
      assignees = assignees.sort(() => Math.random() - 0.5);
      saveStandupOrder(assignees);
    }

    let index = 0;

    // --- Overlay container ---
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.bottom = "16px";
    overlay.style.right = "16px";

    // Fix width so text changes do not resize the box
    overlay.style.width = "300px";
    overlay.style.maxWidth = "300px";
    overlay.style.background = "var(--gl-bg-color, #ffffff)";
    overlay.style.border = "1px solid var(--gl-border-color, rgba(0,0,0,0.15))";
    overlay.style.borderRadius = "10px";
    overlay.style.padding = "14px";
    overlay.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
    overlay.style.zIndex = "10000";
    overlay.style.fontSize = "0.85em";
    overlay.style.fontFamily = "Inter, sans-serif";
    overlay.style.color = "var(--gl-text-color, #222)";

    // Header row (title + randomize dice)
    const headerRow = document.createElement("div");
    headerRow.style.display = "flex";
    headerRow.style.alignItems = "center";
    headerRow.style.justifyContent = "space-between";
    headerRow.style.marginBottom = "8px";

    const title = document.createElement("div");
    title.textContent = "Standup";
    title.style.fontWeight = "700";
    title.style.fontSize = "1rem";

    const randBtn = document.createElement("button");
    randBtn.textContent = "🎲";
    randBtn.title = "Randomize order";
    randBtn.style.background = "transparent";
    randBtn.style.border = "none";
    randBtn.style.fontSize = "1.2rem";
    randBtn.style.cursor = "pointer";
    randBtn.style.padding = "2px 6px";
    randBtn.style.opacity = "0.6";
    randBtn.style.transition = "opacity 0.15s";
    randBtn.onmouseenter = () => randBtn.style.opacity = "1";
    randBtn.onmouseleave = () => randBtn.style.opacity = "0.6";

    headerRow.appendChild(title);
    headerRow.appendChild(randBtn);
    overlay.appendChild(headerRow);

    // Current person
    const nameElem = document.createElement("div");
    nameElem.style.fontSize = "0.95rem";
    nameElem.style.fontWeight = "600";
    nameElem.style.marginBottom = "10px";
    overlay.appendChild(nameElem);

    // "Order:" label
    const listTitle = document.createElement("div");
    listTitle.textContent = "Order:";
    listTitle.style.fontWeight = "600";
    listTitle.style.marginBottom = "4px";
    listTitle.style.fontSize = "0.8rem";
    overlay.appendChild(listTitle);

    // Assignee list container
    const assigneeList = document.createElement("ul");
    assigneeList.style.listStyle = "none";
    assigneeList.style.margin = "0 0 10px 0";
    assigneeList.style.padding = "0";
    assigneeList.style.maxHeight = "300px";
    assigneeList.style.overflowY = "auto";
    overlay.appendChild(assigneeList);

    // Build list items with avatar, progress ring and counts
    function addAssigneeListItem(user) {
      const li = document.createElement("li");
      li.dataset.assignee = user;
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "8px";
      li.style.padding = "4px 0";
      li.style.cursor = "pointer";
      li.style.whiteSpace = "nowrap";

      const avatar = document.createElement("img");
      avatar.src = avatarCache[user] || "";
      avatar.style.width = "22px";
      avatar.style.height = "22px";
      avatar.style.borderRadius = "50%";

      const cards = mapping[user];
      // Use computeCounts to derive open/closed counts
      const { open: openCount, closed: closedCount } = computeCounts(cards);
      const total = openCount + closedCount;

      const text = document.createElement("span");
      text.textContent = `${user} (${openCount}/${total})`;

      li.appendChild(avatar);
      // Insert a progress ring to visualise completion
      const ring = createProgressRing(openCount, total);
      li.appendChild(ring);
      li.appendChild(text);

      li.addEventListener("click", () => {
        const idx = assignees.indexOf(user);
        if (idx !== -1) {
          index = idx;
          showCurrent();
        }
      });

      assigneeList.appendChild(li);
    }

    assignees.forEach(addAssigneeListItem);

    // Button bar container
    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.gap = "10px";
    buttons.style.marginBottom = "6px";
    buttons.style.marginTop = "6px";

    // Icon-only navigation buttons (light & dark mode friendly)
    function createIconBtn(icon) {
      const btn = document.createElement("button");

      btn.textContent = icon;
      btn.style.flex = "1";
      btn.style.height = "34px";
      btn.style.background = "var(--gl-button-bg, rgba(0,0,0,0.04))";
      btn.style.color = "var(--gl-text-color, #222)";
      btn.style.border = "1px solid var(--gl-border-color, rgba(0,0,0,0.2))";
      btn.style.borderRadius = "8px";
      btn.style.fontSize = "1.1rem";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.transition = "background 0.15s, transform 0.1s ease-out";

      btn.onmouseenter = () => {
        btn.style.background = "var(--gl-hover-bg, rgba(0,0,0,0.12))";
      };
      btn.onmouseleave = () => {
        btn.style.background = "var(--gl-button-bg, rgba(0,0,0,0.04))";
        btn.style.transform = "scale(1)";
      };
      btn.onmousedown = () => (btn.style.transform = "scale(0.92)");
      btn.onmouseup = () => (btn.style.transform = "scale(1)");

      return btn;
    }

    const prevBtn = createIconBtn("◀️");
    const nextBtn = createIconBtn("▶️");
    const endBtn  = createIconBtn("⏹️");

    buttons.appendChild(prevBtn);
    buttons.appendChild(nextBtn);
    buttons.appendChild(endBtn);
    overlay.appendChild(buttons);

    document.body.appendChild(overlay);

    // Highlight current user in list
    function updateListHighlight(user) {
      Array.from(assigneeList.children).forEach(li => {
        const active = li.dataset.assignee === user;
        li.style.fontWeight = active ? "700" : "400";
        li.style.textDecoration = active ? "underline" : "none";
        li.style.opacity = active ? "1" : "0.6";
      });
    }

    // Compute open/closed tasks using the isCardClosed helper. Cards may not carry a data-board-type attribute, so rely on our helper.
    function computeCounts(cards) {
      let open = 0;
      let closed = 0;
      cards.forEach((card) => {
        const closedFlag = card.parentElement?.getAttribute("data-board-type") === "closed";
        if (closedFlag) {
          closed++;
        } else {
          open++;
        }
      });
      return { open, closed };
    }

    // Update the UI for the currently selected user
    function showCurrent() {
      const user = assignees[index];
      const cards = mapping[user];
      const { open, closed } = computeCounts(cards);

      nameElem.textContent = `${user} — ${open} open / ${open + closed} total`;

      updateListHighlight(user);
      highlightTasksForAssignee(user, mapping);
    }

    // Button actions
    prevBtn.onclick = () => {
      index = (index - 1 + assignees.length) % assignees.length;
      showCurrent();
    };
    nextBtn.onclick = () => {
      index = (index + 1) % assignees.length;
      showCurrent();
    };
    endBtn.onclick = () => {
      overlay.remove();
      standupState = null;
    };

    // Randomize order
    randBtn.onclick = () => {
      assignees = assignees.sort(() => Math.random() - 0.5);
      saveStandupOrder(assignees);

      assigneeList.innerHTML = "";
      assignees.forEach(addAssigneeListItem);

      index = 0;
      showCurrent();
    };


    standupState = { mapping, avatarCache, assignees, index, overlay };
    showCurrent();
  }

  /* ------------------------------------------------------------------------
   *  Entry point
   * ---------------------------------------------------------------------- */

  enforceIssueAndTaskFilter();
  setupMutationObserver();

  setTimeout(() => {
    ensureStandupStyles();
    scanBoard();
    updateTaskVisibility();
    insertShowTasksToggle();
    // Schedule task badge updates to avoid thrashing
    scheduleTaskCountUpdate();
  }, 0);
})();
