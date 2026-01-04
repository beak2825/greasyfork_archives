// ==UserScript==
// @name         XenForo Warning Helper
// @namespace    xenforo-warning-helper
// @version      1.1
// @author       tuberculosisinmybal
// @description  Adds custom warning templates with edit/delete to make moderation easier on Looksmax.org
// @match        *://*/*/*/warn*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=looksmax.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554888/XenForo%20Warning%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554888/XenForo%20Warning%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let templates = JSON.parse(localStorage.getItem('xf_customWarnings') || '[]');

    const defaultTemplates = [
      {
            id: "tpl_wrong_section_general",
            name: "Wrong section (General)",
            title: "20% Warning",
            points: 20,
            message: `Hello {user},

You have received a 20% warning from the Moderation Staff for your post:
[url={post_link}]{user}[/url]

Additional comments:
Your post was made in the wrong section. Please make sure to post topics in the most relevant forum section in the future.

You can read the forum rules here:
https://looksmax.org/threads/rules-and-faq.1/

Note:
Warnings are added to your personal file. A high enough total warning level (60% - 90%) triggers a temporary ban, while 100% equals a permanent ban.

If you have any questions, feel free to reply to this PM.`,
            notes: "User posted in the wrong subforum. Reminder to post in the correct section next time."
        },
      {
            id: "tpl_wrong_section_rating",
            name: "Wrong section (Rating)",
            title: "20% Warning",
            points: 20,
            message: `Hello {user},

You have received a 20% warning from the Moderation Staff for your post:
[url={post_link}]{user}[/url]

Additional comments:
Your post was made in the wrong section. There is a dedicated Rate Me forum for these kinds of posts:
https://looksmax.org/forums/ratings.7/

Please make sure to post rate requests there in the future. The "Looksmaxxing Questions" section is not intended for rate requests.

You can read the forum rules here:
https://looksmax.org/threads/rules-and-faq.1/

Note:
Warnings are added to your personal file. A 60% warning means an immediate 1 day ban, and higher total warning levels (70% - 90%) will increase the duration of the ban. 100% total warning level equals a permanent ban.

If you have any question, feel free to reply to this PM.`,
            notes: "User posted in the wrong section (Looksmaxxing Questions). Advised to use the Rate Me section instead."
        }
    ];

    defaultTemplates.forEach(defTpl => {
        if (!templates.find(t => t.id === defTpl.id)) templates.push(defTpl);
    });
    localStorage.setItem('xf_customWarnings', JSON.stringify(templates));

function applyTemplate(tpl) {
    const username = document.querySelector(".p-title-value")?.textContent.match(/Warn member: (.+)/)?.[1]?.trim() || "User";
    const postLink = document.querySelector('.contentRow-minor a')?.href || window.location.href;

    const titleInput = document.querySelector('input[name="conversation_title"]');
    const messageInput = document.querySelector('textarea[name="conversation_message"]');
    const notesInput = document.querySelector('textarea[name="notes"]');
    const pointsInput = document.querySelector('input[name="points"]');
    const convCheckbox = document.querySelector('input[name="start_conversation"]');
    const customRadio = document.querySelector('input[name="warning_definition_id"][value="0"]');
    const expireInput = document.querySelector('input[name="expiry_length"]');

    const xpathField = document.evaluate(
        '/html/body/div[1]/div[3]/div[2]/div[5]/div/div[3]/div[4]/div/form/div/div[1]/div[2]/dl/dd/div[1]/ul/li/ul/li/input',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (titleInput) titleInput.value = tpl.title;
    if (messageInput) messageInput.value = tpl.message.replaceAll("{user}", username).replaceAll("{post_link}", postLink);
    if (notesInput) notesInput.value = tpl.notes;
    if (pointsInput) pointsInput.value = tpl.points;

    if (xpathField) {
        if (tpl.points === 100) {
            xpathField.value = "100% - Permaban";
        } else {
            xpathField.value = `${tpl.points}%`;
        }
    }

    if (convCheckbox && !convCheckbox.checked) convCheckbox.click();
    if (customRadio && !customRadio.checked) customRadio.click();

    if (tpl.points === 100) {
        const expiryCheckbox = document.querySelector('input[name="expiry_enable"]');
        if (expiryCheckbox && expiryCheckbox.checked) {
            expiryCheckbox.click();
        }

        const expiryInputs = document.querySelectorAll('input[name="expiry_value"], select[name="expiry_unit"]');
        expiryInputs.forEach(input => input.disabled = true);
    } else {
        const expiryCheckbox = document.querySelector('input[name="expiry_enable"]');
        if (expiryCheckbox && !expiryCheckbox.checked) {
            expiryCheckbox.click();
        }
        const expiryInputs = document.querySelectorAll('input[name="expiry_value"], select[name="expiry_unit"]');
        expiryInputs.forEach(input => input.disabled = false);
    }
}


function injectTemplates() {
    let target = document.querySelector('.inputChoices') || document.querySelector('.inputGroup') || document.querySelector('.block-body');
    if (!target) return;

    let existing = document.getElementById("customTemplateInsert");
    if (existing) existing.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "customTemplateInsert";
    wrapper.style.marginTop = "12px";
    wrapper.innerHTML = `<h4 style="margin-bottom:6px;">Custom Warning Templates</h4>`;

    templates.forEach(tpl => {
        const li = document.createElement("li");
        li.className = "inputChoices-choice";

        const label = document.createElement("label");
        label.className = "iconic iconic--radio";
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.gap = "6px";
        label.style.cursor = "pointer";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "custom_warning_template";
        input.value = tpl.id;

        const i = document.createElement("i");
        i.setAttribute("aria-hidden", "true");

        const span = document.createElement("span");
        span.className = "iconic-label";
        span.textContent = tpl.name;

        input.addEventListener("change", () => applyTemplate(tpl));

        label.appendChild(input);
        label.appendChild(i);
        label.appendChild(span);

        const editBtn = document.createElement("button");
        editBtn.className = "button--primary button";
        editBtn.innerHTML = `<span class="button-text">✏️</span>`;
        editBtn.style.marginLeft = "auto";
        editBtn.type = "button";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openEditOverlay(tpl);
        });

        li.appendChild(label);
        // li.appendChild(editBtn);
        wrapper.appendChild(li);
    });

    const manageBtn = document.createElement("button");
    manageBtn.type = "button";
    manageBtn.className = "button--primary button";
    manageBtn.innerHTML = `<span class="button-text">Manage Templates</span>`;
    manageBtn.style.marginTop = "6px";
    manageBtn.addEventListener("click", () => openManageOverlay());
    wrapper.appendChild(manageBtn);

    target.parentNode.insertBefore(wrapper, target.nextSibling);
}

function openEditOverlay(tpl) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 9999;

    const box = document.createElement("div");
    box.style.backgroundColor = "#1e1e1e";
    box.style.color = "#eee";
    box.style.padding = "16px";
    box.style.borderRadius = "8px";
    box.style.width = "450px";
    box.style.maxHeight = "90%";
    box.style.overflowY = "auto";

    if (!tpl.message) {
        tpl.message = `{user},

You have received a {x}% warning from Moderation Staff for the post:
[url={post_link}]{user}[/url]

Additional comments:

You can read the rules here:
https://looksmax.org/threads/rules-and-faq.1/

Note:
Warnings are added to your personal file. A high enough total warning level (60% - 90%) will mean a temporary ban, while 100% will mean a permanent ban.

If you have any question, feel free to reply to this PM.`;
    }

    box.innerHTML = `
        <h3 style="margin-top:0;">Edit Template</h3>
        <label>Template Name:<br><input style="width:100%" id="nameInput" value="${tpl.name}"></label><br><br>
        <label>Points:<br>
            <select style="width:100%" id="pointsSelect">
                ${[10,20,30,40,50,60,70,80,90,100].map(v => `<option value="${v}" ${tpl.points===v?'selected':''}>${v}</option>`).join("")}
            </select>
        </label><br><br>
        <label>Title:<br><input style="width:100%" id="titleInput" value="${tpl.points===100 ? "Ban" : tpl.title || tpl.points+'% Warning'}"></label><br><br>
        <label>Message:<br><textarea style="width:100%; height:120px;" id="msgInput">${tpl.points===100 ? `{user},

You have been permanently banned by Moderation Staff.

Additional Comments:

If you wish to appeal you may post in the "Ban Appeal" section and tag @Moderation Staff, he will be in charge of your appeal. Read the sticky AND the rules first, abuse won't be tolerated.

Thank you.` : tpl.message.replaceAll("{x}", tpl.points)}</textarea></label><br><br>
        <label>Notes:<br><textarea style="width:100%; height:60px;" id="notesInput">${tpl.notes}</textarea></label><br><br>
        <button type="button" class="button--primary button" id="saveTemplate"><span class="button-text">Save</span></button>
        <button type="button" class="button--primary button" id="deleteTemplate" style="background-color:#a33; color:#fff; margin-left:6px;"><span class="button-text">Delete</span></button>
        <button type="button" class="button--primary button" id="cancelTemplate" style="margin-left:6px;"><span class="button-text">Cancel</span></button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const pointsSelect = box.querySelector("#pointsSelect");
    const titleInput = box.querySelector("#titleInput");
    const msgInput = box.querySelector("#msgInput");

    pointsSelect.addEventListener("change", () => {
        const val = parseInt(pointsSelect.value);
        titleInput.value = val === 100 ? "Ban" : `${val}% Warning`;

        if(val === 100) {
            msgInput.value = `{user},

You have been permanently banned by Moderation Staff.

Additional Comments:

If you wish to appeal you may post in the "Ban Appeal" section and tag @Moderation Staff, he will be in charge of your appeal. Read the sticky AND the rules first, abuse won't be tolerated.

Thank you.`;
        } else {
            msgInput.value = tpl.message.replaceAll("{x}", val);
        }
    });

    box.querySelector("#cancelTemplate").addEventListener("click", () => overlay.remove());

    box.querySelector("#saveTemplate").addEventListener("click", () => {
        tpl.name = box.querySelector("#nameInput").value;
        tpl.points = parseInt(pointsSelect.value);
        tpl.title = titleInput.value;
        tpl.message = msgInput.value.replaceAll("{x}", tpl.points);
        tpl.notes = box.querySelector("#notesInput").value;

        localStorage.setItem('xf_customWarnings', JSON.stringify(templates));

        if (tpl.points === 100) {
            const expireInput = document.querySelector('input[name="expiry_length"]');
            if (expireInput) expireInput.value = "";
        }

        overlay.remove();
        injectTemplates();
    });

    box.querySelector("#deleteTemplate").addEventListener("click", () => {
        if (confirm(`Delete template "${tpl.name}"?`)) {
            templates = templates.filter(t => t.id !== tpl.id);
            localStorage.setItem('xf_customWarnings', JSON.stringify(templates));
            overlay.remove();
            injectTemplates();
        }
    });
}

    function openManageOverlay() {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = 9999;

        const box = document.createElement("div");
        box.style.backgroundColor = "#1e1e1e";
        box.style.color = "#eee";
        box.style.padding = "16px";
        box.style.borderRadius = "8px";
        box.style.width = "500px";
        box.style.maxHeight = "90%";
        box.style.overflowY = "auto";
        box.innerHTML = `<h3 style="margin-top:0;">Manage Templates</h3>`;

        const newBtn = document.createElement("button");
        newBtn.type = "button";
        newBtn.className = "button--primary button";
        newBtn.style.marginBottom = "8px";
        newBtn.innerHTML = `<span class="button-text">+ New Template</span>`;
        newBtn.addEventListener("click", () => {
            const newTpl = {id: `tpl_${Date.now()}`, name:"New Template", title:"", points:10, message:"", notes:""};
            templates.push(newTpl);
            localStorage.setItem('xf_customWarnings', JSON.stringify(templates));
            overlay.remove();
            openManageOverlay();
            injectTemplates();
        });
        box.appendChild(newBtn);

        templates.forEach(tpl => {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "space-between";
            div.style.padding = "4px 0";

            const span = document.createElement("span");
            span.textContent = tpl.name;

            const btnGroup = document.createElement("div");
            btnGroup.style.display = "flex";
            btnGroup.style.gap = "4px";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "button--primary button";
            editBtn.innerHTML = "✏️";
            editBtn.addEventListener("click", () => { overlay.remove(); openEditOverlay(tpl); });

            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "button--primary button";
            delBtn.style.backgroundColor = "#a33";
            delBtn.style.color = "#fff";
            delBtn.innerHTML = "🗑️";
            delBtn.addEventListener("click", () => {
                if(confirm(`Delete template "${tpl.name}"?`)) {
                    templates = templates.filter(t => t.id !== tpl.id);
                    localStorage.setItem('xf_customWarnings', JSON.stringify(templates));
                    overlay.remove();
                    openManageOverlay();
                    injectTemplates();
                }
            });

            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(delBtn);
            div.appendChild(span);
            div.appendChild(btnGroup);
            box.appendChild(div);
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "button--primary button";
        cancelBtn.style.marginTop = "8px";
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.addEventListener("click", () => overlay.remove());
        box.appendChild(cancelBtn);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    injectTemplates();
})();
