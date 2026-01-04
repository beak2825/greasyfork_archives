// ==UserScript==
// @name         Reddit Free Awards
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Give away free awards on Reddit
// @author       nrmu9
// @match        https://www.reddit.com/*
// @license      CC-BY-NC-SA-4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560829/Reddit%20Free%20Awards.user.js
// @updateURL https://update.greasyfork.org/scripts/560829/Reddit%20Free%20Awards.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const AWARD_ICON = `<svg style="transform: translateY(1px)" fill="currentColor" width="16" height="16" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M28 8.75h-0.211c0.548-0.833 0.874-1.854 0.874-2.952 0-0.448-0.054-0.884-0.157-1.3l0.008 0.037c-0.487-1.895-2.008-3.337-3.912-3.702l-0.031-0.005c-0.234-0.035-0.505-0.055-0.78-0.055-2.043 0-3.829 1.096-4.804 2.732l-0.014 0.026-2.973 4.279-2.974-4.279c-0.989-1.662-2.776-2.758-4.818-2.758-0.275 0-0.545 0.020-0.81 0.058l0.030-0.004c-1.935 0.37-3.455 1.812-3.934 3.672l-0.008 0.035c-0.095 0.379-0.149 0.815-0.149 1.263 0 1.097 0.326 2.119 0.886 2.972l-0.013-0.021h-0.212c-1.794 0.002-3.248 1.456-3.25 3.25v3c0.002 1.343 0.817 2.495 1.979 2.99l0.021 0.008v10.002c0.002 1.794 1.456 3.248 3.25 3.25h20c1.794-0.001 3.249-1.456 3.25-3.25v-10.002c1.183-0.503 1.998-1.656 2-2.998v-3c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM28.75 12v3c-0.006 0.412-0.338 0.744-0.749 0.75h-10.751v-4.5h10.75c0.412 0.006 0.744 0.338 0.75 0.749v0.001zM21.027 4.957c0.544-1.009 1.593-1.683 2.8-1.683 0.104 0 0.207 0.005 0.309 0.015l-0.013-0.001c0.963 0.195 1.718 0.915 1.963 1.842l0.004 0.018c0.021 0.149 0.033 0.322 0.033 0.497 0 1.28-0.635 2.412-1.608 3.097l-0.012 0.008h-6.112zM5.911 5.147c0.248-0.944 1.002-1.664 1.949-1.857l0.016-0.003c0.092-0.010 0.199-0.015 0.307-0.015 1.204 0 2.251 0.675 2.783 1.667l0.008 0.017 2.636 3.793h-6.113c-0.984-0.692-1.619-1.823-1.619-3.101 0-0.177 0.012-0.351 0.036-0.521l-0.002 0.020zM3.25 12c0.006-0.412 0.338-0.744 0.749-0.75h10.751v4.5h-10.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM5.25 28v-9.75h9.5v10.5h-8.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM26.75 28c-0.006 0.412-0.338 0.744-0.749 0.75h-8.751v-10.5h9.5z"></path></svg>`;

  const style = document.createElement("style");
  style.textContent = `
        .free-award-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0 0.5rem;
            height: 32px;
            border-radius: 9999px;
            cursor: pointer;
            color: var(--color-neutral-content);
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 600;
            background: transparent;
            border: none;
        }
        .free-award-btn:hover {
            background-color: var(--color-neutral-background-hover);
        }
        .free-award-btn svg {
            width: 16px;
            height: 16px;
        }
        .award-modal-overlay {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }
        .award-modal-overlay.visible {
            opacity: 1;
        }
    `;
  document.head.appendChild(style);

  function getCurrentUserId() {
    const el = document.querySelector("[user-id]");
    return el ? el.getAttribute("user-id") : null;
  }

  function createAwardButton(onClick, isComment = false) {
    const btn = document.createElement("button");
    const baseClasses =
      "button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 inline-flex items-center px-sm";
    const variantClass = isComment ? "button-plain-weak" : "button-secondary";

    btn.className = `${baseClasses} ${variantClass}`;
    btn.style.cssText =
      "height: var(--size-button-sm-h); font: var(--font-button-sm);";

    btn.innerHTML = `
            <span class="flex items-center">
                <span class="flex text-16 me-[var(--rem6)]">${AWARD_ICON}</span>
                <span>Free Award</span>
            </span>
        `;

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };

    return btn;
  }

  function openAwardSelection(thingId, isComment) {
    const script = document.createElement("script");
    script.textContent = `
        (async () => {
            const getToken = () => {
                const c = document.cookie.match(/csrf_token=([^;]+)/);
                if (c) return c[1];
                const a = document.querySelector('shreddit-app');
                return a?.csrfToken || a?.getAttribute('spp') || a?.getAttribute('csrf-token');
            };

            const showToast = async (message, isError = false) => {
                const findToaster = () => {
                    const alertController = document.querySelector('alert-controller');
                    return alertController?.shadowRoot?.querySelector('toaster-lite');
                };

                let toaster = findToaster();
                if (!toaster) {
                    for (let i = 0; i < 50; i++) {
                        await new Promise(r => setTimeout(r, 100));
                        toaster = findToaster();
                        if (toaster) break;
                    }
                }
                
                if (!toaster) {
                    alert(message);
                    return;
                }
                
                toaster.dispatchEvent(new CustomEvent('show-toast', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        message,
                        level: 3,
                        namedContent: {}
                    }
                }));
            };
            
            const ctx = { id: "${thingId}", type: "${
      isComment ? "Comment" : "Post"
    }" };
            const token = getToken();
            
            if (!token) return showToast('Error: Could not find CSRF token.', true);
            
            let author = null;
            const selector = "${isComment}" === "true" ? 'shreddit-comment[thingid="${thingId}"]' : 'shreddit-post';
            const el = document.querySelector(selector);
            if (el?.getAttribute('author')) author = el.getAttribute('author');
            
            const titleText = author ? \`Give Award to \${author}\` : \`Give Award\`;
            
            const awards = [
                { name: 'Heartwarming', id: 'award_free_heartwarming', img: 'https://i.redd.it/snoovatar/snoo_assets/marketing/Heartwarming_40.png' },
                { name: 'Popcorn', id: 'award_free_popcorn_2', img: 'https://i.redd.it/snoovatar/snoo_assets/marketing/Popcorn_40.png' },
                { name: 'Bravo', id: 'award_free_bravo', img: 'https://i.redd.it/snoovatar/snoo_assets/marketing/bravo_40.png' },
                { name: 'Regret', id: 'award_free_regret_2', img: 'https://i.redd.it/snoovatar/snoo_assets/marketing/regret_40.png' },
                { name: 'Mindblown', id: 'award_free_mindblown', img: 'https://i.redd.it/snoovatar/snoo_assets/marketing/mindblown_40.png' }
            ];
            
            const container = document.createElement('div');
            container.className = 'award-modal-overlay';
            Object.assign(container.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '999999', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sans, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif)',
                backdropFilter: 'blur(4px)', webkitBackdropFilter: 'blur(4px)'
            });
            
            const dialog = document.createElement('div');
            dialog.style.cssText = 'background:var(--color-neutral-background,#0f1a1c);color:var(--color-neutral-content-strong,white);padding:24px;border-radius:16px;border:1px solid var(--color-neutral-border,#343536);box-shadow:0 8px 32px rgba(0,0,0,0.6);box-sizing:border-box;max-height:85vh;overflow-y:auto;display:flex;flex-direction:column;align-items:center;';
            
            const header = document.createElement('div');
            header.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px;';
            header.innerHTML = \`
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="#FF4500" stroke-width="2">
                    <path d="M28 8.75h-0.211c0.548-0.833 0.874-1.854 0.874-2.952 0-0.448-0.054-0.884-0.157-1.3l0.008 0.037c-0.487-1.895-2.008-3.337-3.912-3.702l-0.031-0.005c-0.234-0.035-0.505-0.055-0.78-0.055-2.043 0-3.829 1.096-4.804 2.732l-0.014 0.026-2.973 4.279-2.974-4.279c-0.989-1.662-2.776-2.758-4.818-2.758-0.275 0-0.545 0.020-0.81 0.058l0.030-0.004c-1.935 0.37-3.455 1.812-3.934 3.672l-0.008 0.035c-0.095 0.379-0.149 0.815-0.149 1.263 0 1.097 0.326 2.119 0.886 2.972l-0.013-0.021h-0.212c-1.794 0.002-3.248 1.456-3.25 3.25v3c0.002 1.343 0.817 2.495 1.979 2.99l0.021 0.008v10.002c0.002 1.794 1.456 3.248 3.25 3.25h20c1.794-0.001 3.249-1.456 3.25-3.25v-10.002c1.183-0.503 1.998-1.656 2-2.998v-3c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM28.75 12v3c-0.006 0.412-0.338 0.744-0.749 0.75h-10.751v-4.5h10.75c0.412 0.006 0.744 0.338 0.75 0.749v0.001zM21.027 4.957c0.544-1.009 1.593-1.683 2.8-1.683 0.104 0 0.207 0.005 0.309 0.015l-0.013-0.001c0.963 0.195 1.718 0.915 1.963 1.842l0.004 0.018c0.021 0.149 0.033 0.322 0.033 0.497 0 1.28-0.635 2.412-1.608 3.097l-0.012 0.008h-6.112zM5.911 5.147c0.248-0.944 1.002-1.664 1.949-1.857l0.016-0.003c0.092-0.010 0.199-0.015 0.307-0.015 1.204 0 2.251 0.675 2.783 1.667l0.008 0.017 2.636 3.793h-6.113c-0.984-0.692-1.619-1.823-1.619-3.101 0-0.177 0.012-0.351 0.036-0.521l-0.002 0.020zM3.25 12c0.006-0.412 0.338-0.744 0.749-0.75h10.751v4.5h-10.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM5.25 28v-9.75h9.5v10.5h-8.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM26.75 28c-0.006 0.412-0.338 0.744-0.749 0.75h-8.751v-10.5h9.5z"></path>
                </svg>
                <span style="font-size:1.125rem;font-weight:700">\${titleText}</span>
            \`;
            dialog.appendChild(header);
            
            const subtitle = document.createElement('p');
            subtitle.style.cssText = 'margin:0 0 16px 0;font-size:13px;color:var(--color-neutral-content-weak,#818384);';
            subtitle.innerText = 'Select an award to send:';
            dialog.appendChild(subtitle);
            
            const btnGrid = document.createElement('div');
            btnGrid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:20px;width:100%;';
            
            let selectedAward = null;
            let selectedBtn = null;
            
            awards.forEach(award => {
                const btn = document.createElement('button');
                btn.style.cssText = 'all:unset;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;background:var(--color-neutral-background-hover,#1a282d);border:2px solid transparent;border-radius:12px;padding:8px;box-sizing:border-box;';
                
                const img = document.createElement('img');
                img.src = award.img;
                img.width = 40;
                img.height = 40;
                img.style.cssText = 'display:block;';
                
                const span = document.createElement('span');
                span.textContent = award.name;
                span.style.cssText = 'font-size:10px;font-weight:600;color:var(--color-neutral-content-weak,#818384);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;';
                
                btn.appendChild(img);
                btn.appendChild(span);
                
                btn.onmouseenter = () => {
                    if (selectedBtn !== btn) btn.style.backgroundColor = 'var(--color-neutral-background-selected, #253337)';
                };
                btn.onmouseleave = () => {
                    if (selectedBtn !== btn) btn.style.backgroundColor = 'var(--color-neutral-background-hover, #1a282d)';
                };
                
                btn.onclick = () => {
                    if (selectedBtn) {
                        selectedBtn.style.border = '2px solid transparent';
                        selectedBtn.style.backgroundColor = 'var(--color-neutral-background-hover, #1a282d)';
                    }
                    selectedBtn = btn;
                    selectedAward = award;
                    btn.style.border = '2px solid #FF4500';
                    btn.style.backgroundColor = 'var(--color-neutral-background-selected, #253337)';
                    sendButton.disabled = false;
                    sendButton.style.opacity = '1';
                    sendButton.style.cursor = 'pointer';
                };
                
                btnGrid.appendChild(btn);
            });
            
            dialog.appendChild(btnGrid);
            
            const sendButton = document.createElement('button');
            sendButton.textContent = 'Give Award';
            sendButton.disabled = true;
            sendButton.style.cssText = 'all:unset;display:flex;align-items:center;justify-content:center;width:100%;height:40px;background:#FF4500;color:white;border:none;border-radius:9999px;font-size:14px;font-weight:700;cursor:not-allowed;opacity:0.5;margin-bottom:8px;box-sizing:border-box;';
            
            sendButton.onmouseenter = () => { if (!sendButton.disabled) sendButton.style.backgroundColor = '#ff5722'; };
            sendButton.onmouseleave = () => { if (!sendButton.disabled) sendButton.style.backgroundColor = '#FF4500'; };
            
            const close = () => {
                container.classList.remove('visible');
                setTimeout(() => {
                    if (container.parentNode) document.body.removeChild(container);
                }, 200);
            };
            
            sendButton.onclick = async () => {
                if (!selectedAward) return;
                sendButton.disabled = true;
                const originalText = sendButton.innerText;
                sendButton.innerText = 'Sending...';
                sendButton.style.opacity = '0.7';
                
                try {
                    const res = await fetch('https://www.reddit.com/svc/shreddit/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-Csrf-Token': token },
                        body: JSON.stringify({
                            operation: 'CreateAwardOrder',
                            variables: {
                                input: {
                                    nonce: crypto.randomUUID(),
                                    thingId: ctx.id,
                                    awardId: selectedAward.id,
                                    isAnonymous: false
                                }
                            },
                            csrf_token: token
                        })
                    });
                    
                    const j = await res.json();
                    if (j.data?.createAwardOrder?.ok) {
                        const updateAwardButton = (thingId, awardId, iconUrl) => {
                            let awardBtn = document.querySelector('award-button[thing-id="' + thingId + '"]');
                            
                            if (!awardBtn) {
                                const posts = document.querySelectorAll('shreddit-post');
                                for (const post of posts) {
                                    if (post.id === thingId && post.shadowRoot) {
                                        awardBtn = post.shadowRoot.querySelector('award-button');
                                        if (awardBtn) break;
                                    }
                                }
                            }
                            
                            if (awardBtn) {
                                const currentCount = parseInt(awardBtn.getAttribute('count') || '0', 10);
                                awardBtn.setAttribute('count', currentCount + 1);
                                awardBtn.setAttribute('is-awarded-by-user', '');
                                awardBtn.setAttribute('award-id', awardId);
                                awardBtn.setAttribute('icon-url', iconUrl);
                            }
                            
                            document.querySelectorAll('shreddit-comment').forEach(comment => {
                                if (comment.getAttribute('thingid') === thingId) {
                                    const currentAwardCount = parseInt(comment.getAttribute('award-count') || '0', 10);
                                    comment.setAttribute('award-count', currentAwardCount + 1);
                                }
                            });
                        };
                        
                        updateAwardButton(ctx.id, selectedAward.id, selectedAward.img);
                        showToast('Award sent successfully!');
                        close();
                    } else {
                        showToast('Reddit servers failed. This is a Reddit bug, not this script. Try again!', true);
                        sendButton.disabled = false;
                        sendButton.innerText = originalText;
                        sendButton.style.opacity = '1';
                    }
                } catch (e) {
                    showToast('Network error. Check your connection and try again.', true);
                    sendButton.disabled = false;
                    sendButton.innerText = originalText;
                    sendButton.style.opacity = '1';
                }
            };
            
            dialog.appendChild(sendButton);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.cssText = 'all:unset;display:flex;align-items:center;justify-content:center;background:transparent;color:var(--color-neutral-content-weak,#818384);cursor:pointer;font-size:14px;font-weight:600;width:100%;height:32px;';
            cancelBtn.onmouseenter = () => { cancelBtn.style.color = 'var(--color-neutral-content, #d7dadc)'; };
            cancelBtn.onmouseleave = () => { cancelBtn.style.color = 'var(--color-neutral-content-weak, #818384)'; };
            
            cancelBtn.onclick = close;
            container.onclick = (e) => {
                if (e.target === container) close();
            };
            
            dialog.appendChild(cancelBtn);
            container.appendChild(dialog);
            document.body.appendChild(container);
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    container.classList.add('visible');
                });
            });
        })();
        `;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  function processPost(post, currentUserId) {
    if (post.dataset.freeAwardProcessed) return;

    const postId = post.id || post.getAttribute("postId");
    const authorId = post.getAttribute("author-id");

    if (post.hasAttribute("nsfw")) {
      post.dataset.freeAwardProcessed = "true";
      return;
    }

    if (authorId && authorId === currentUserId) {
      post.dataset.freeAwardProcessed = "true";
      return;
    }

    const existingShareBtn = post.querySelector(
      'shreddit-post-share-button[slot="share-button"]'
    );

    if (existingShareBtn && postId) {
      const btn = createAwardButton(
        () => openAwardSelection(postId, false),
        false
      );
      btn.setAttribute("slot", "share-button");
      post.insertBefore(btn, existingShareBtn);
      post.dataset.freeAwardProcessed = "true";
      return;
    }

    if (post.shadowRoot && postId) {
      const container = post.shadowRoot.querySelector(
        ".shreddit-post-container"
      );
      if (container) {
        const awardBtn = container.querySelector("award-button");
        if (awardBtn) {
          const btn = createAwardButton(
            () => openAwardSelection(postId, false),
            false
          );
          awardBtn.parentNode.insertBefore(btn, awardBtn.nextSibling);
          post.dataset.freeAwardProcessed = "true";
          return;
        }
      }
    }
  }

  function processComment(comment, currentUserId) {
    if (comment.dataset.freeAwardProcessed) return;

    const actionRow = comment.querySelector("shreddit-comment-action-row");
    if (!actionRow) return;

    const postId = comment.getAttribute("postid");
    if (postId) {
      const post = document.querySelector(
        'shreddit-post[id="' + postId + '"], shreddit-post#' + postId
      );
      if (post && post.hasAttribute("nsfw")) {
        comment.dataset.freeAwardProcessed = "true";
        return;
      }
    }

    const overflowMenu = comment.querySelector(
      "shreddit-overflow-menu[author-id]"
    );
    const authorId = overflowMenu
      ? overflowMenu.getAttribute("author-id")
      : null;

    if (authorId && authorId === currentUserId) {
      comment.dataset.freeAwardProcessed = "true";
      return;
    }

    const shareBtn = actionRow.querySelector('[slot="comment-share"]');
    const thingId = comment.getAttribute("thingid");

    if (shareBtn && thingId) {
      const btn = createAwardButton(
        () => openAwardSelection(thingId, true),
        true
      );
      btn.setAttribute("slot", "comment-award");

      shareBtn.parentNode.insertBefore(btn, shareBtn);
      comment.dataset.freeAwardProcessed = "true";
    }
  }

  function run() {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    document
      .querySelectorAll("shreddit-post")
      .forEach((post) => processPost(post, currentUserId));
    document
      .querySelectorAll("shreddit-comment")
      .forEach((comment) => processComment(comment, currentUserId));
  }

  run();

  const observer = new MutationObserver(() => run());
  observer.observe(document.body, { childList: true, subtree: true });
})();
