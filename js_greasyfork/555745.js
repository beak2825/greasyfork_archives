// ==UserScript==
// @name         GitLab Board Improvements
// @namespace    https://iqnox.com
// @version      0.12
// @description  Always show both issues and tasks on GitLab boards, display parent information (issue/epic) for each card, add a show/hide tasks toggle and standup helper UI, and show per-issue task completion progress based on child tasks fetched on demand.
// @author       placatus@iqnox.com, ChatGPT
// @license      MIT
// @match        https://gitlab.com/*/-/boards*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555745/GitLab%20Board%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/555745/GitLab%20Board%20Improvements.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Card selector constant for reuse across queries.
  const CARD_SELECTOR = ".board-card, .gl-issue-board-card, li[data-id]";
  const processedCards = new WeakSet();
  const TASK_HIDDEN_CLASS = "iqnox--task-hidden";
  const WORK_ITEM_PARENT_QUERY = `
    query($id: WorkItemID!) {
      workItem(id: $id) {
        widgets {
          ... on WorkItemWidgetHierarchy {
            parent {
              id
              title
            }
          }
        }
      }
    }
  `.trim();
  const ISSUE_EPIC_QUERY = `
    query($fullPath: ID!, $iid: String!) {
      project(fullPath: $fullPath) {
        issue(iid: $iid) {
          epic {
            id
            title
          }
        }
      }
    }
  `.trim();
  const WORK_ITEM_PARENT_BY_NAMESPACE_QUERY = `
    query($fullPath: ID!, $iid: String!) {
      namespace(fullPath: $fullPath) {
        workItem(iid: $iid) {
          widgets {
            ... on WorkItemWidgetHierarchy {
              parent {
                id
                title
              }
            }
          }
        }
      }
    }
  `.trim();
  function ensureWorkItemTasksFeature() {
    if (!window.gon?.features) {
      console.warn("GitLab Board Improvements: gon.features not found");
    }
    window.gon.features.workItemTasksOnBoards = true;
    window.gon.features.workItemsClientSideBoards = true;
  }

  ensureWorkItemTasksFeature();

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

  function templateFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }

  function createInfoPill({ label, text, variant } = {}) {
    const pill = document.createElement("span");
    pill.className = `iqnox--info-pill${variant ? ` iqnox--${variant}-pill` : ""}`;
    pill.innerHTML = `<strong>${label}:</strong> ${text}`;
    return pill;
  }

  function createLocateParentButton(targetTitle) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Locate";
    button.title = "Highlight parent card";
    button.className = "iqnox--locate-parent-btn";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const parentCard = findCardByTitle(targetTitle);
      flashCardHighlight(parentCard);
    });
    return button;
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

  function setWorkItemVisibility(card) {
    if (!card) return;
    card.classList.toggle(TASK_HIDDEN_CLASS, !showTasks);
  }

  function updateTaskVisibility() {
    document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
      const link = card.querySelector('a[href*="/-/"]');
      if (!link) return;
      const parsed = parseItemFromUrl(link.href);
      if (parsed && parsed.type === "work_items") {
        setWorkItemVisibility(card);
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
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: WORK_ITEM_PARENT_QUERY, variables: { id: globalId } }),
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
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: ISSUE_EPIC_QUERY,
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
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: WORK_ITEM_PARENT_BY_NAMESPACE_QUERY,
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
  const ISSUE_CHILDREN_QUERY = `
    query($fullPath: ID!, $iid: String!) {
      namespace(fullPath: $fullPath) {
        workItem(iid: $iid) {
          widgets {
            ... on WorkItemWidgetHierarchy {
              children(first: 100) {
                nodes {
                  id
                  title
                  state
                  widgets {
                    ... on WorkItemWidgetAssignees {
                      assignees {
                        nodes {
                          username
                          avatarUrl
                        }
                      }
                    }
                    ... on WorkItemWidgetStatus {
                      status {
                        name
                        color
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `.trim();

  function issueKey(fullPath, iid) {
    return `${fullPath}::${iid}`;
  }

  async function fetchIssueChildren(fullPath, iid) {
    const key = issueKey(fullPath, iid);
    if (issueChildrenCache[key]) return issueChildrenCache[key];

    const query = ISSUE_CHILDREN_QUERY;

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
          children = widget.children.nodes.map((node) => {
            const assignees = [];
            let statusName = "";
            let statusColor = "";
            (node.widgets || []).forEach((nested) => {
              if (nested?.assignees?.nodes) {
                nested.assignees.nodes.forEach((person) => {
                  const username = person?.username;
                  const avatarUrl = person?.avatarUrl;
                  if (username && !assignees.some((a) => a.username === username)) {
                    assignees.push({ username, avatarUrl });
                  }
                });
              }
              const name = nested?.status?.name;
              if (name) statusName = name;
              const color = nested?.status?.color;
              if (color) statusColor = color;
            });
            return {
              id: node.id,
              title: node.title,
              state: node.state,
              statusName,
              statusColor,
              assignees,
            };
          });
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
      let badge = card.querySelector(".iqnox--tasks-count");

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
        badge.className = "iqnox--tasks-count";
        card.appendChild(badge);
      }

      badge.innerHTML = "";
      const fragment = templateFragment(`
        <div class="iqnox--tasks-count__header">
          <span>Tasks</span>
          <span>${completed}/${total} (${pct}%)</span>
        </div>
        <div class="iqnox--tasks-count__progress">
          <div class="iqnox--tasks-count__progress-bar"></div>
        </div>
      `);
      badge.appendChild(fragment);
      const progressBar = badge.querySelector(".iqnox--tasks-count__progress-bar");
      if (progressBar) {
        progressBar.style.setProperty("width", `${pct}%`);
      }

      badge.dataset.state = isDone ? "done" : "pending";
      badge.title = `Show ${total} child task${total === 1 ? "" : "s"}`;

      if (!badge.dataset.detailListenerAttached) {
        badge.dataset.detailListenerAttached = "true";
        badge.addEventListener("click", (event) => {
          event.stopPropagation();
          event.preventDefault();
          if (!showTasks) {
            showTasks = true;
            setBoardShowTasks(true);
            updateTaskVisibility();
          }
          renderChildDetails(card, key, children, badge);
        });
      }

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
      setWorkItemVisibility(card);

      buildParentChainForTask(parsed.namespace, parsed.id).then((chain) => {
        if (!Array.isArray(chain) || chain.length === 0) {
          card.dataset.parentInjected = "done";
          return;
        }

        const info = document.createElement("div");
        info.className = "iqnox--parent-info";

        if (chain[0]) {
          const parentSpan = createInfoPill({
            label: "Parent",
            text: chain[0].title,
            variant: "parent",
          });
          parentSpan.appendChild(createLocateParentButton(chain[0].title));
          info.appendChild(parentSpan);
        }

        if (chain[1]) {
          const epicSpan = createInfoPill({
            label: "Epic",
            text: chain[1].title,
            variant: "epic",
          });
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
        info.className = "iqnox--parent-info";

        if (epic) {
          const epicSpan = createInfoPill({
            label: "Epic",
            text: epic.title,
            variant: "epic",
          });
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

    const observeTarget = document.body || document.documentElement || document;
    observer.observe(observeTarget, { childList: true, subtree: true });
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
  const dropdownTarget = document.body || document.documentElement || document;
  dropdownObserver.observe(dropdownTarget, { childList: true, subtree: true });

  insertShowTasksToggle();

  /* ------------------------------------------------------------------------
   *  Standup helper
   * ---------------------------------------------------------------------- */

  let standupState = null;

  function ensureStandupStyles() {
    if (document.getElementById("iqnox--standup-css")) return;
    const style = document.createElement("style");
    style.id = "iqnox--standup-css";
    style.textContent = `
      .iqnox--standup-overlay {
        position: fixed;
        bottom: 16px;
        right: 16px;
        width: 260px;
        max-width: 260px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
        z-index: 10000;
        font-size: 0.85em;
        font-family: Inter, sans-serif;
        background: var(--gl-bg-color, #ffffff);
        color: var(--gl-text-color, #111);
      }
      html.gl-dark .iqnox--standup-overlay {
        background: var(--gl-dark-bg, #080d17);
        color: #f8fafc;
      }
      .iqnox--task-hidden {
        display: none !important;
      }
      .iqnox--standup-highlight {
        outline: 2px solid #fb923c;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.45);
        background-color: rgba(251, 113, 25, 0.25) !important;
        transform: scale(1.02);
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
      }
      html.gl-dark .iqnox--standup-highlight {
        outline-color: #fbbf24;
        background-color: rgba(59, 130, 246, 0.24) !important;
      }
      .iqnox--parent-highlight {
        outline: 3px solid var(--gl-accent, #38bdf8);
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.8);
        transform: scale(1.01);
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
      }
      .iqnox--child-details {
        margin: 0 12px 10px 12px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(99, 102, 241, 0.35);
        background: rgba(99, 102, 241, 0.08);
        font-size: 0.75rem;
        color: var(--gl-text-color, #1f2937);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      html.gl-dark .iqnox--child-details {
        border-color: rgba(148, 163, 184, 0.35);
        background: rgba(255, 255, 255, 0.04);
        color: var(--gl-text-color, #e3e8ff);
      }
      .iqnox--child-item {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: nowrap;
      }
      .iqnox--child-content {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
      }
      .iqnox--child-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .iqnox--child-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .iqnox--child-name {
        font-weight: 600;
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .iqnox--child-status {
        font-size: 0.65rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #0f172a;
        white-space: nowrap;
      }
      .iqnox--child-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 6px;
        border-radius: 999px;
        font-size: 0.65rem;
        letter-spacing: 0.05em;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(255, 255, 255, 0.9);
        color: var(--iqnox-status-color, #0f172a);
      }
      html.gl-dark .iqnox--child-status-badge {
        border-color: rgba(255, 255, 255, 0.25);
        background: white;
      }
      .iqnox--child-status-text {
        display: inline-flex;
      }
      .iqnox--parent-info {
        font-size: 0.85em;
        margin-bottom: 8px;
        margin-left: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .iqnox--info-pill {
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .iqnox--parent-pill {
        background-color: var(--blue-50, #e0f2fe);
        color: var(--blue-700, #0369a1);
      }
      .iqnox--epic-pill {
        background-color: var(--purple-50, #ede9fe);
        color: var(--purple-700, #5b21b6);
      }
      .iqnox--locate-parent-btn {
        border: none;
        background: transparent;
        color: inherit;
        font-size: 0.65rem;
        cursor: pointer;
        text-decoration: underline;
        position: relative;
        z-index: 3;
        pointer-events: auto;
      }
      .iqnox--tasks-count {
        font-size: 0.75em;
        margin: 4px 12px 8px;
        padding: 4px 6px;
        border-radius: 6px;
        display: block;
        box-sizing: border-box;
        position: relative;
        z-index: 3;
        cursor: pointer;
      }
      .iqnox--tasks-count[data-state="done"] {
        background-color: var(--green-50, #ecfdf3);
        color: var(--green-700, #047857);
      }
      .iqnox--tasks-count[data-state="pending"] {
        background-color: var(--yellow-50, #fef9c3);
        color: var(--yellow-800, #92400e);
      }
      .iqnox--tasks-count__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2px;
      }
      .iqnox--tasks-count__progress {
        position: relative;
        width: 100%;
        height: 4px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      .iqnox--tasks-count__progress-bar {
        width: 0;
        height: 100%;
        border-radius: 999px;
        transition: width 0.3s ease;
      }
      .iqnox--tasks-count[data-state="done"] .iqnox--tasks-count__progress-bar {
        background: #22c55e;
      }
      .iqnox--tasks-count[data-state="pending"] .iqnox--tasks-count__progress-bar {
        background: #f97316;
      }
      .iqnox--standup-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .iqnox--standup-title {
        font-weight: 700;
        font-size: 1rem;
      }
      .iqnox--standup-button-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .iqnox--standup-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }
      .iqnox--standup-current {
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .iqnox--standup-list {
        list-style: none;
        margin: 0 0 10px 0;
        padding: 0;
        max-height: 300px;
        overflow-y: auto;
      }
      .iqnox--standup-assignee {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.2s ease;
        opacity: 0.6;
      }
      .iqnox--standup-assignee.iqnox--standup-active {
        font-weight: 700;
        text-decoration: underline;
        opacity: 1;
      }
      .iqnox--standup-avatar {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .iqnox--standup-nav {
        display: flex;
        gap: 8px;
        margin: 6px 0 0;
      }
      .iqnox--standup-button {
        flex: 1;
        height: 36px;
        background: #ffffff;
        color: var(--gl-text-color, #111);
        border: 1px solid rgba(15, 23, 42, 0.15);
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
        border-radius: 10px;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.12s ease, background 0.2s ease;
      }
      html.gl-dark .iqnox--standup-button {
        background: #111827;
        border-color: rgba(255, 255, 255, 0.1);
        color: #f8fafc;
        box-shadow: 0 6px 15px rgba(15, 23, 42, 0.4);
      }
      .iqnox--standup-button:hover {
        transform: translateY(-1px);
      }
      .iqnox--standup-button:active {
        transform: scale(0.96);
      }
      .iqnox--standup-control {
        width: 36px;
        height: 36px;
        padding: 0;
      }
      .iqnox--standup-close {
        background: transparent;
        border: none;
        font-size: 1.4rem;
        cursor: pointer;
        padding: 2px 6px;
        line-height: 1;
        color: var(--gl-text-color, #111);
      }
    `;
    document.head.appendChild(style);
  }

  function gatherAssigneesAndCards() {
    const mapping = {};
    const avatarCache = {}; // stores avatar URLs for each user
    const cards = document.querySelectorAll(CARD_SELECTOR);

    cards.forEach((card) => {
      if (card.classList.contains(TASK_HIDDEN_CLASS)) return;

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

  function renderChildDetails(card, sourceKey, children, badge) {
    if (!card || !badge) return;
    const existing = card.querySelector(".iqnox--child-details");
    if (existing && existing.dataset.source === sourceKey) {
      existing.remove();
      return;
    }
    if (existing) existing.remove();
    if (!children || children.length === 0) return;

    const container = document.createElement("div");
    container.className = "iqnox--child-details";
    container.dataset.source = sourceKey;

      container.innerHTML = children
        .map((child) => {
          const assigneeLabel =
            child.assignees?.length > 0
              ? child.assignees.map((assignee) => assignee.username).join(", ")
              : "Unassigned";
          const statusLabel = child.statusName || "";
          const avatarSrc = child.assignees?.[0]?.avatarUrl || "";
          const statusColor = child.statusColor || "#0f172a";
          return `
            <div class="iqnox--child-item">
              <span class="iqnox--child-content">
                <span class="iqnox--child-name">${child.title}</span>
                 <span class="iqnox--child-status-badge" style="--iqnox-status-color:${statusColor}">
                   <span class="iqnox--child-status-text">${statusLabel || "Status unknown"}</span>
                 </span>
              </span>
              <span class="iqnox--child-avatar" title="${assigneeLabel}">
                ${avatarSrc ? `<img src="${avatarSrc}" alt="${assigneeLabel}" />` : ""}
              </span>
          </div>
        `;
      })
      .join("");

    badge.insertAdjacentElement("afterend", container);
  }

  function highlightTasksForAssignee(assignee, mapping) {
    document
      .querySelectorAll(".iqnox--standup-highlight")
      .forEach((el) => el.classList.remove("iqnox--standup-highlight"));

    const cards = mapping[assignee] || [];
    cards.forEach((card) => {
      card.classList.add("iqnox--standup-highlight");
    });

    if (cards.length > 0) {
      cards[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  function flashCardHighlight(card) {
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("iqnox--parent-highlight");
    setTimeout(() => card.classList.remove("iqnox--parent-highlight"), 2000);
  }

  function findCardByTitle(title) {
    if (!title) return null;
    const target = title.trim().toLowerCase();
    return (
      Array.from(document.querySelectorAll(".board-card-title"))
        .map((titleEl) => ({
          text: titleEl.textContent?.trim().toLowerCase(),
          card: titleEl.closest(".board-card"),
        }))
        .find((item) => item.text && item.text.includes(target))?.card || null
    );
  }

  /* ---- Standup order persistence ---- */

  function getStandupOrderKey() {
    return `iqnox--standup-order-${getBoardId()}`;
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

    let mapping = {};
    let avatarCache = {};
    const captureAssignees = () => {
      const result = gatherAssigneesAndCards();
      mapping = result.mapping;
      avatarCache = result.avatarCache;
      return Object.keys(mapping).filter(Boolean);
    };
    let assignees = captureAssignees();
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
    const overlayFragment = templateFragment(`
      <div class="iqnox--standup-overlay">
        <div class="iqnox--standup-header">
          <div class="iqnox--standup-title">Standup</div>
          <div class="iqnox--standup-actions">
            <div class="iqnox--standup-button-group">
              <button class="iqnox--standup-button iqnox--standup-control"
                data-standup-refresh
                title="Refresh assignees"
                type="button"
              >🔄</button>
              <button class="iqnox--standup-button iqnox--standup-control"
                data-standup-randomize
                title="Randomize order"
                type="button"
              >🎲</button>
              <button class="iqnox--standup-close"
                data-standup-close
                title="Close standup"
                type="button"
              >❌</button>
            </div>
          </div>
        </div>
        <div class="iqnox--standup-current" data-standup-current></div>
        <ul class="iqnox--standup-list" data-standup-list></ul>
        <div class="iqnox--standup-nav">
          <button class="iqnox--standup-button" data-standup-prev type="button">◀️</button>
          <button class="iqnox--standup-button" data-standup-next type="button">▶️</button>
        </div>
      </div>
    `);
    const overlay = overlayFragment.firstElementChild;
    if (!overlay) return;
    const nameElem = overlay.querySelector("[data-standup-current]");
    const assigneeList = overlay.querySelector("[data-standup-list]");
    const refreshBtn = overlay.querySelector("[data-standup-refresh]");
    const randBtn = overlay.querySelector("[data-standup-randomize]");
    const closeBtn = overlay.querySelector("[data-standup-close]");
    const prevBtn = overlay.querySelector("[data-standup-prev]");
    const nextBtn = overlay.querySelector("[data-standup-next]");
    if (!nameElem || !assigneeList || !refreshBtn || !randBtn || !closeBtn || !prevBtn || !nextBtn) return;

    closeBtn.addEventListener("click", () => {
      overlay.remove();
      standupState = null;
    });

    // Build list items with avatar, progress ring and counts
    function addAssigneeListItem(user) {
      const cards = mapping[user] || [];
      const { open: openCount, closed: closedCount } = computeCounts(cards);
      const total = openCount + closedCount;
      const fragment = templateFragment(`
        <li class="iqnox--standup-assignee">
          <img class="iqnox--standup-avatar" />
          <span class="iqnox--standup-text"></span>
        </li>
      `);
      const li = fragment.querySelector("li");
      if (!li) return;
      li.dataset.assignee = user;
      const avatar = li.querySelector("img");
      if (avatar) {
        avatar.src = avatarCache[user] || "";
        avatar.alt = user;
      }
      const text = li.querySelector(".iqnox--standup-text");
      const ring = createProgressRing(openCount, total);
      if (text) {
        li.insertBefore(ring, text);
        text.textContent = `${user} (${openCount}/${total})`;
      } else {
        li.appendChild(ring);
      }
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

    function rebuildAssigneeList() {
      assigneeList.innerHTML = "";
      assignees.forEach(addAssigneeListItem);
    }

    function reorderAssignees({ randomize } = {}) {
      const refreshedAssignees = captureAssignees();
      if (refreshedAssignees.length === 0) {
        alert("No assignees found on this board.");
        return false;
      }

      if (randomize) {
        assignees = refreshedAssignees.sort(() => Math.random() - 0.5);
        localStorage.removeItem(getStandupOrderKey());
      } else {
        const savedOrder = loadStandupOrder(refreshedAssignees);
        const missing = refreshedAssignees.filter(
          (name) => !savedOrder.includes(name)
        );
        assignees = [...savedOrder, ...missing];
      }

      saveStandupOrder(assignees);
      rebuildAssigneeList();
      index = 0;
      showCurrent();

      if (standupState) {
        standupState.mapping = mapping;
        standupState.avatarCache = avatarCache;
        standupState.assignees = assignees;
        standupState.index = index;
      }
      return true;
    }

    document.body.appendChild(overlay);

    // Highlight current user in list
    function updateListHighlight(user) {
      Array.from(assigneeList.children).forEach((li) => {
        li.classList.toggle("iqnox--standup-active", li.dataset.assignee === user);
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

    // Randomize order
    randBtn.onclick = () => reorderAssignees({ randomize: true });

    refreshBtn.onclick = () => reorderAssignees();


    standupState = { mapping, avatarCache, assignees, index, overlay };
    showCurrent();
  }

  /* ------------------------------------------------------------------------
   *  Entry point
   * ---------------------------------------------------------------------- */

  function runWhenDomReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  runWhenDomReady(() => {
    enforceIssueAndTaskFilter();
    setupMutationObserver();
    ensureStandupStyles();
    scanBoard();
    updateTaskVisibility();
    insertShowTasksToggle();
    // Schedule task badge updates to avoid thrashing
    scheduleTaskCountUpdate();
  });
})();
