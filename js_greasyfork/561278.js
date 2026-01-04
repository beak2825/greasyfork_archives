// ==UserScript==
// @version             2.0
// @name                SGDB Follow Users
// @name:zh-CN          SGDB 关注用户
// @name:ja             SGDB ユーザーフォロー
// @name:ru             SGDB Подписчики
// @name:es             SGDB Seguidores
// @name:pt-PT          SGDB A Seguir
// @description         Client-side follow system for SteamGridDB user profiles.
// @description:zh-CN   SteamGridDB 用户资料的关注系统。
// @description:ja      SteamGridDB のユーザープロフィール用フォローシステム。
// @description:ru      Клиентская система подписки для профилей SteamGridDB.
// @description:es      Sistema de seguimiento del lado del cliente para perfiles de SteamGridDB.
// @description:pt-PT   Sistema de seguimento do lado do cliente para perfis de SteamGridDB.
// @grant               GM_addStyle
// @grant               GM.getValue
// @grant               GM.setValue
// @grant               GM_deleteValue
// @grant               GM_registerMenuCommand
// @grant               GM_notification
// @run-at              document-idle\
// @match               https://www.steamgriddb.com/*
// @namespace           https://www.steamgriddb.com/
// @icon                https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/391540/2ce672b89b63ec1e70d2f12862e72eb4a33e9268.jpg
// @license             MIT
// @author              okagame
// @downloadURL https://update.greasyfork.org/scripts/561278/SGDB%20Follow%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/561278/SGDB%20Follow%20Users.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    // V- CONFIGURATION & ASSETS -V

    // Unique key for browser storage
    const STORAGE_KEY = 'sgdb_followed_users';

    // CSS Selectors for DOM interaction
    const CONTAINER_STATS = '.stats';
    const CONTAINER_NAV = 'nav ul';

    // Icon: Empty Heart (Not Following)
    const ICON_HEART_OUTLINE = `
        <svg class="icon" viewBox="0 0 1024 1024">
            <path d="M725.333 192c-89.6 0-168.533 44.8-213.333 117.333C467.2 236.8 388.267 192 298.667 192 157.867 192 42.667 307.2 42.667 448c0 253.867 469.333 469.333 469.333 469.333s469.333-215.467 469.333-469.333C981.333 307.2 866.133 192 725.333 192z M512 832c-65.067-36.267-384-221.867-384-384 0-106.027 85.973-192 192-192 70.4 0 132.267 38.4 165.333 96 33.067-57.6 94.933-96 165.333-96 106.027 0 192 85.973 192 192 0 162.133-318.933 347.733-384 384z"></path>
        </svg>`;

    // Icon: Filled Heart (Following)
    const ICON_HEART_FILLED = `
        <svg class="icon" viewBox="0 0 1024 1024">
            <path d="M725.333 192c-89.6 0-168.533 44.8-213.333 117.333C467.2 236.8 388.267 192 298.667 192 157.867 192 42.667 307.2 42.667 448c0 253.867 469.333 469.333 469.333 469.333s469.333-215.467 469.333-469.333C981.333 307.2 866.133 192 725.333 192z"></path>
        </svg>`;

    // Icon: Small Filled Heart (For Dropdown)
    const ICON_HEART_SMALL = `<svg class="icon" viewBox="0 0 1024 1024"><path d="M725.333 192c-89.6 0-168.533 44.8-213.333 117.333C467.2 236.8 388.267 192 298.667 192 157.867 192 42.667 307.2 42.667 448c0 253.867 469.333 469.333 469.333 469.333s469.333-215.467 469.333-469.333C981.333 307.2 866.133 192 725.333 192z"/></svg>`;


    // V- STYLES -V

    const styles = `
        /* Profile Button Active State */
        .sgdb-follow-btn.active .icon
        {
            fill: #ff4081;
            color: #ff4081;
            transition: color 0.2s, fill 0.2s;
        }

        /* Nav Dropdown Trigger */
        .nav-item #sgdb-follow-trigger .icon
        {
            cursor: pointer;
            fill: currentColor;
            transition: color 0.2s;
        }

        .nav-item #sgdb-follow-trigger:hover .icon
        {
            color: #ff4081;
        }

        /* Dropdown Container */
        #sgdb-dropdown
        {
            position: absolute;
            top: 100%;
            right: 0;
            width: 320px;
            margin-top: 10px;
            display: none;
            z-index: 9999;
        }

        #sgdb-dropdown.is-open
        {
            display: block;
            animation: fadeIn 0.2s ease-out;
        }

        /* Tippy Box Mimicry */
        .sgdb-tippy-box
        {
            background-color: #1b1b1b;
            color: #ddd;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            border: 1px solid #333;
        }

        /* Dropdown List */
        .sgdb-dropdown-list
        {
            max-height: 400px;
            overflow-y: auto;
        }

        .sgdb-dropdown-item
        {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            border-radius: 4px;
            transition: background 0.1s;
        }

        .sgdb-dropdown-item:hover
        {
            background-color: rgba(255,255,255,0.05);
        }

        .sgdb-item-info
        {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }

        .sgdb-item-avatar
        {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }

        .sgdb-item-name
        {
            font-size: 0.9rem;
            color: #eee;
            text-decoration: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 140px;
        }

        .sgdb-item-name:hover
        {
            color: #ff4081;
        }

        .sgdb-mini-unfollow
        {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 0.8rem;
            padding: 2px 6px;
        }

        .sgdb-mini-unfollow:hover
        {
            color: #ff4081;
            background: rgba(255, 64, 129, 0.1);
            border-radius: 4px;
        }

        .sgdb-dropdown-header
        {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            padding: 0 8px 8px 8px;
            border-bottom: 1px solid #333;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sgdb-open-manager
        {
            cursor: pointer;
            color: #666;
            font-size: 0.75rem;
        }

        .sgdb-open-manager:hover
        {
            color: #fff;
        }

        .sgdb-empty-msg
        {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.9rem;
        }

        /* Modal Backdrop */
        #sgdb-modal-backdrop
        {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        #sgdb-modal-backdrop.active
        {
            display: flex;
        }

        #sgdb-modal-content
        {
            background: #1b1b1b;
            color: white;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            overflow-y: auto;
            position: relative;
        }

        /* Animations */
        @keyframes fadeIn
        {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Scrollbar */
        .sgdb-dropdown-list::-webkit-scrollbar { width: 6px; }
        .sgdb-dropdown-list::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        .sgdb-dropdown-list::-webkit-scrollbar-track { background: transparent; }
    `;

    GM_addStyle(styles);


    // V- DATA STORAGE FUNCTIONS -V

    // Retrieve followed users. Returns empty object if storage fails.
    async function load_follows()
    {
        let return_data = {};

        try
        {
            return_data = await GM.getValue(STORAGE_KEY, {});
        }
        catch (error)
        {
            console.error("Failed to load follows: ", error);
            return_data = {};
        }

        return return_data;
    }

    // Save data to storage and trigger UI update.
    async function save_follows(data)
    {
        let save_success = false;

        try
        {
            await GM.setValue(STORAGE_KEY, data);
            update_dropdown_content(data);
            save_success = true;
        }
        catch (error)
        {
            console.error("Failed to save follows: ", error);
            save_success = false;

            // Alert user if save fails
            GM_notification(
                {
                    text: "Error saving follow list.",
                    title: "SGDB Script Error",
                    timeout: 3000
                }
            );
        }

        return save_success;
    }


    // V- UTILITY FUNCTIONS -V

    // Extract User ID from current URL. Returns null if not on a profile page.
    function get_current_user_id()
    {
        let user_id = null;
        const path_parts = window.location.pathname.split('/');

        // Check if URL structure matches a profile page
        if (path_parts[1] === 'profile' && path_parts[2])
        {
            user_id = path_parts[2];
        }

        // Return the determined state
        return user_id;
    }

    // Scrape user details (Name/Avatar/ID) from the DOM.
    function get_profile_details()
    {
        const name_element = document.querySelector('.column.details h1');
        const avatar_element = document.querySelector('.column.avatar img');

        let return_details =
        {
            name: name_element ? name_element.textContent.trim() : 'Unknown User',
            avatar: avatar_element ? avatar_element.src : '',
            id: get_current_user_id()
        };

        return return_details;
    }


    // V- DOM RENDERING -V

    // Create the Follow/Unfollow button element.
    function create_follow_button(is_following)
    {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn-link sgdb-follow-btn ${is_following ? 'active' : ''}`;
        btn.title = is_following ? 'Unfollow User' : 'Follow User';
        btn.innerHTML = is_following ? ICON_HEART_FILLED : ICON_HEART_OUTLINE;

        btn.addEventListener('click', async (event) =>
        {
            event.preventDefault();
            const profile = get_profile_details();
            const follows = await load_follows();

            if (follows[profile.id])
            {
                // Unfollow logic
                delete follows[profile.id];
                btn.innerHTML = ICON_HEART_OUTLINE;
                btn.classList.remove('active');
                btn.title = 'Follow User';
                GM_notification({ text: `Unfollowed ${profile.name}`, timeout: 2000 });
            }
            else
            {
                // Follow logic
                follows[profile.id] = { name: profile.name, avatar: profile.avatar, followedAt: Date.now() };
                btn.innerHTML = ICON_HEART_FILLED;
                btn.classList.add('active');
                btn.title = 'Unfollow User';
                GM_notification({ text: `Following ${profile.name}`, timeout: 2000 });
            }

            await save_follows(follows);
        });

        return btn;
    }

    // Render the profile button if conditions are met.
    async function render_profile_button()
    {
        let should_render = false;

        // Verify context
        const current_id = get_current_user_id();
        const container = document.querySelector(CONTAINER_STATS);

        if (current_id && container)
        {
            should_render = true;
        }

        // Check existence to prevent duplicates
        if (container && container.querySelector('.sgdb-follow-btn'))
        {
            should_render = false;
        }

        if (should_render)
        {
            const follows = await load_follows();
            const profile = get_profile_details();
            const is_following = !!follows[profile.id];

            // Create Separator if needed
            const last_child = container.lastElementChild;
            if (last_child && !last_child.classList.contains('sgdb-separator') && !last_child.classList.contains('sgdb-follow-btn'))
            {
                const separator = document.createElement('span');
                separator.textContent = ' • ';
                separator.className = 'sgdb-separator';
                container.appendChild(separator);
            }

            // Inject Button
            const btn = create_follow_button(is_following);
            container.appendChild(btn);
        }
    }

    // Create the Navigation Dropdown Trigger.
    function render_nav_trigger()
    {
        let should_render = false;
        const nav_ul = document.querySelector(CONTAINER_NAV);

        if (nav_ul && !document.getElementById('sgdb-nav-item'))
        {
            should_render = true;
        }

        if (should_render)
        {
            const li = document.createElement('li');
            li.className = 'nav-item right dropdown';
            li.id = 'sgdb-nav-item';
            li.innerHTML = `
                <span id="sgdb-follow-trigger" class="icon-wrap">
                    ${ICON_HEART_FILLED}
                    <span class="hide-from-lg">Following</span>
                </span>
                <div id="sgdb-dropdown" class="tippy-box sgdb-tippy-box">
                    <div class="sgdb-dropdown-header">
                        <span>Followed Users</span>
                        <span class="sgdb-open-manager" id="sgdb-open-manager">Manage All</span>
                    </div>
                    <div class="sgdb-dropdown-list" id="sgdb-dropdown-content">
                        <!-- Content Injected via JS -->
                    </div>
                </div>
            `;

            nav_ul.appendChild(li);

            // Toggle Logic
            const trigger = document.getElementById('sgdb-follow-trigger');
            const dropdown = document.getElementById('sgdb-dropdown');
            const manager_link = document.getElementById('sgdb-open-manager');

            trigger.addEventListener('click', (event) =>
            {
                event.stopPropagation();
                dropdown.classList.toggle('is-open');
            });

            manager_link.addEventListener('click', (event) =>
            {
                event.stopPropagation();
                dropdown.classList.remove('is-open');
                open_manager();
            });

            // Close on outside click
            document.addEventListener('click', (event) =>
            {
                if (!li.contains(event.target))
                {
                    dropdown.classList.remove('is-open');
                }
            });
        }
    }

    // Update the dropdown HTML content based on data.
    async function update_dropdown_content(data)
    {
        const content_div = document.getElementById('sgdb-dropdown-content');

        if (!content_div)
        {
            return;
        }

        const ids = Object.keys(data);
        let html_output = '';

        if (ids.length === 0)
        {
            html_output = `<div class="sgdb-empty-msg">You are not following anyone.</div>`;
        }
        else
        {
            ids.forEach(id =>
            {
                const user = data[id];
                html_output += `
                    <div class="sgdb-dropdown-item">
                        <div class="sgdb-item-info">
                            <img src="${user.avatar}" class="sgdb-item-avatar" alt="">
                            <a href="/profile/${id}" class="sgdb-item-name">${user.name}</a>
                        </div>
                        <button class="sgdb-mini-unfollow" data-id="${id}">Unfollow</button>
                    </div>
                `;
            });
        }

        content_div.innerHTML = html_output;

        // Attach listeners to new buttons
        content_div.querySelectorAll('.sgdb-mini-unfollow').forEach(btn =>
        {
            btn.addEventListener('click', async (event) =>
            {
                const id = event.target.dataset.id;
                const follows = await load_follows();
                delete follows[id];
                await save_follows(follows);

                // Sync profile button if visible
                const current_id = get_current_user_id();
                if (current_id === id)
                {
                    const profile_btn = document.querySelector('.sgdb-follow-btn');
                    if (profile_btn)
                    {
                        profile_btn.innerHTML = ICON_HEART_OUTLINE;
                        profile_btn.classList.remove('active');
                        profile_btn.title = 'Follow User';
                    }
                }
            });
        });
    }


    // V- MANAGER MODAL -V

    // Open the full-screen management modal.
    async function open_manager()
    {
        const modal = document.getElementById('sgdb-modal-backdrop');
        modal.classList.add('active');

        const follows = await load_follows();
        const ids = Object.keys(follows);

        let html_content = `<h2>Manage Followed Users</h2>`;

        if (ids.length === 0)
        {
            html_content += `<p style="color:#888">You are not following anyone.</p>`;
        }
        else
        {
            html_content += `<div class="sgdb-follow-list" style="margin-top:15px;">`;
            ids.forEach(id =>
            {
                const user = follows[id];
                html_content += `
                    <div class="sgdb-follow-item" data-id="${id}" style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #333;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${user.avatar}" style="width:32px; height:32px; border-radius:4px;">
                            <a href="/profile/${id}" style="color:#eee; text-decoration:none;">${user.name}</a>
                        </div>
                        <button class="sgdb-unfollow-btn" style="background:#333; color:white; border:none; padding:5px 10px; cursor:pointer;">Unfollow</button>
                    </div>
                `;
            });
            html_content += `</div>`;
            html_content += `<button id="sgdb-delete-all" style="margin-top:20px; background:none; border:none; color:#888; cursor:pointer; text-decoration:underline;">Delete All Follows</button>`;
        }
        html_content += `<button id="sgdb-close-manager" style="margin-top:20px; background:#333; color:white; border:none; padding:10px 20px; cursor:pointer; float:right;">Close</button>`;

        const content = document.getElementById('sgdb-modal-content');
        content.innerHTML = html_content;

        // Modal Event Listeners
        document.getElementById('sgdb-close-manager').onclick = () => modal.classList.remove('active');

        document.querySelectorAll('.sgdb-unfollow-btn').forEach(btn =>
        {
            btn.addEventListener('click', async (event) =>
            {
                const item = event.target.closest('.sgdb-follow-item');
                const id = item.dataset.id;
                const follows = await load_follows();
                delete follows[id];
                await save_follows(follows);
                open_manager(); // Re-render modal

                // Sync profile button
                const current_id = get_current_user_id();
                if (current_id === id)
                {
                    const profile_btn = document.querySelector('.sgdb-follow-btn');
                    if (profile_btn)
                    {
                        profile_btn.innerHTML = ICON_HEART_OUTLINE;
                        profile_btn.classList.remove('active');
                    }
                }
            });
        });

        const delete_all = document.getElementById('sgdb-delete-all');
        if(delete_all)
        {
            delete_all.addEventListener('click', async () =>
            {
                if(confirm("Delete all follows?"))
                {
                    await GM.deleteValue(STORAGE_KEY);
                    const data = await load_follows();
                    update_dropdown_content(data);
                    modal.classList.remove('active');
                }
            });
        }
    }


    // V- INITIALIZATION & OBSERVER -V

    let last_url = location.href;

    async function init()
    {
        const follows = await load_follows();
        await render_profile_button();
        render_nav_trigger();
        update_dropdown_content(follows);
    }

    // Ensure Modal Container exists
    if (!document.getElementById('sgdb-modal-backdrop'))
    {
        const modal_html = `
            <div id="sgdb-modal-backdrop">
                <div id="sgdb-modal-content"></div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modal_html);
    }

    GM_registerMenuCommand("Manage Followed Users", open_manager);

    init();

    // Strategy: Watch the main app container.
    // If the URL changes, we re-initialize (full reset).
    // If only the DOM content changes (filtering), we only re-render the button.
    function setup_observer(target)
    {
        let raf = null;

        const observer = new MutationObserver(() =>
        {
            if (raf)
            {
                return;
            }

            raf = requestAnimationFrame(() =>
            {
                const current_url = location.href;

                if (current_url !== last_url)
                {
                    last_url = current_url;

                    // Close modals/dropdowns on navigation
                    const modal = document.getElementById('sgdb-modal-backdrop');
                    if (modal) modal.classList.remove('active');

                    const dropdown = document.getElementById('sgdb-dropdown');
                    if (dropdown) dropdown.classList.remove('is-open');

                    // Full re-init
                    init();
                }
                else
                {
                    // DOM Change (Same URL): Ensure UI persists
                    render_profile_button();
                    render_nav_trigger();
                }

                raf = null;
            });
        });

        observer.observe(target, { childList: true, subtree: true });
    }

    // Start Observer
    const app_root = document.querySelector('#render-me-uwu');

    if (app_root)
    {
        setup_observer(app_root);
    }
    else
    {
        const root_observer = new MutationObserver((mutations, obs) =>
        {
            const root = document.querySelector('#render-me-uwu');
            if (root)
            {
                obs.disconnect();
                setup_observer(root);
                init();
            }
        });
        root_observer.observe(document.body, { childList: true, subtree: true });
    }

})();