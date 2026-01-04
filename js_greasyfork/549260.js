// ==UserScript==
// @name         Neopets: Outbox (Sent NeoMail)
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.5
// @description  Saves the last 100 sent neomails in an Outbox
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/neomessages.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/549260/Neopets%3A%20Outbox%20%28Sent%20NeoMail%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549260/Neopets%3A%20Outbox%20%28Sent%20NeoMail%29.meta.js
// ==/UserScript==

const savedMessageLimit = 100;

const properties = ["timestamp", "nickname", "username", "subject", "body", "reply"];

class Outbox {
    constructor(rawMessages) {
        const parsedMessages = JSON.parse(rawMessages);
        this.messages = parsedMessages.map(msg => new Message(msg.t, msg.n, msg.u, msg.s, msg.b, msg.r));
    }

    async save() {
        this.messages = this.messages.slice(savedMessageLimit * -1);
        GM.setValue("neopets-outbox", JSON.stringify(this.messages.map(msg => msg.minify())));
    }

    async add() {
        const timestamp = new Date().getTime();
        const nickname = document.querySelector('input[name="recipient"] ~ span')?.textContent;
        const username = document.querySelector('input[name="recipient"]').value;
        const subject = document.querySelector('input[name="subject"]').value;
        const bodyTextArea = document.getElementById("message_body") ?? document.querySelector('textarea[name="message_body"]');
        const body = bodyTextArea.value ?? bodyTextArea.contentDocument.body.innerText.replaceAll(/\n\n/g, "\n");
        const replyElement = document.querySelector('td[bgcolor="#DEDEDE"]')?.cloneNode(true);
        if (replyElement) {
            replyElement.querySelector("input").remove();
            const reply = replyElement.innerHTML;
            this.messages.push(new Message(timestamp, nickname, username, subject, body, reply));
        }
        else this.messages.push(new Message(timestamp, nickname, username, subject, body));
        this.save();
    }
}

class Message {
    constructor(timestamp, nickname, username, subject, body, reply) {
        this.timestamp = timestamp;
        this.nickname = nickname;
        this.username = username;
        this.subject = subject;
        this.body = body;
        this.reply = reply;
    }

    minify() {
        return Object.fromEntries(properties.map(p => [p[0], this[p]]));
    }

    toTitle() {
        const tr = document.createElement("tr");
        tr.dataset.timestamp = this.timestamp;
        tr.innerHTML = `
        <td class="outbox--timestamp">${(new Date(this.timestamp)).toLocaleString(navigator.language, {dateStyle: "short", timeStyle: "short"})}</td>
        <td class="outbox--recipient">${this.nickname ? this.nickname + '<br>[' : ''}<a href="https://www.neopets.com/userlookup.phtml?user=${this.username}">${this.username}</a>${this.nickname ? ']' : ''}</td>
        <td class="outbox--subject">${this.subject}</td>
        `;
        tr.onclick = () => this.toggle(tr);
        return tr;
    }

    toHTML() {
        const table = document.createElement("table");
        table.classList.add("outbox--full", "inactive");
        setTimeout(() => table.classList.remove("inactive"), 10);
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        tbody.innerHTML = `
        <tr><td>To:</td><td>[<a href="https://www.neopets.com/userlookup.phtml?user=${this.username}">${this.username}</a>] ${this.nickname ?? ''}</td></tr>
        <tr><td>Sent:</td><td>${(new Date(this.timestamp)).toLocaleString(navigator.language, {dateStyle: "short", timeStyle: "short"})}</td></tr>
        <tr><td>Subject:</td><td>${this.subject}</td>
        ${this.reply ? '<tr><td>' + this.username + ' wrote:</td><td>' + this.reply + '</td></tr>' : ''}
        <tr><td>Message:</td><td>${this.body.replaceAll("\n", "<br>")}</td></tr>
        `;
        return table;
    }

    toggle(tr) {
        tr.classList.toggle("active");
        if(tr.classList.contains("active")) this.expand(tr);
        else this.collapse(tr);
    }

    expand(tr) {
        const row = document.createElement("tr");
        tr.insertAdjacentElement("afterEnd", row);
        const cell = document.createElement("td");
        row.appendChild(cell);
        cell.colSpan = 3;
        cell.appendChild(this.toHTML());
    }

    collapse(tr) {
        const row = tr.nextElementSibling;
        row.getElementsByClassName("outbox--full")[0].classList.add("inactive");
        setTimeout(() => row.remove(), 250);
    }
}

class UI {
    constructor(outbox) {
        this.anchor = document.createElement("a");
        this.anchor.href = "#";
        this.anchor.onclick = () => this.open(outbox);
        this.anchor.textContent = "Outbox";
    }

    appendAnchor() {
        const lastLink = document.querySelector("div.medText a:first-child");
        lastLink.insertAdjacentElement("afterEnd", this.anchor);
        lastLink.insertAdjacentText("afterEnd", " | ");
    }

    makeMessageList(outbox) {
        const table = document.createElement("table");
        table.classList.add("outbox--list");
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        outbox.messages.forEach(msg => tbody.prepend(msg.toTitle()));
        tbody.insertAdjacentHTML("afterBegin", '<tr class="outbox--list-header"><th class="neomail-outbox-date">Date Sent</th><th class="neomail-outbox-recipient">To</th><th class="neomail-outbox-subject">Subject</th></tr>');
        return table;
    }

    open(outbox) {
        const links = document.querySelector("div.medText");
        document.getElementsByClassName("content")[0].style.display = "none";
        const parent = document.createElement("td");
        document.getElementsByClassName("content")[0].insertAdjacentElement("beforeBegin", parent);
        parent.classList.add("content");
        parent.appendChild(links);
        const messageList = this.makeMessageList(outbox);
        parent.appendChild(messageList);
    }
}

const css = `<style>
.outbox--list {
  width: 100%;
  border: 1px solid #000000;
  border-collapse: collapse;
  margin-top: 50px;
}
.outbox--list-header th {
  font-weight: bolder;
  background-color: #687DAA;
  color: #FFFFFF;
  height: 22px;
  font-size: 9pt;
  font-weight: bold;
  text-align: left;
  padding-left: 3px;
}
.outbox--list td, .outbox--list th {
  padding: 3px;
}
.outbox--timestamp {
  line-height: 2.5;
}
.neomail-outbox-date {
  width: 130px;
}
.neomail-outbox-recipient {
  width: 200px;
}
.outbox--list tr {
  border: 1px solid black;
  cursor: pointer;
}
.outbox--list tr:nth-child(2n+1) {
  background: #EDEDED;
}
.outbox--list td {
  font-size: 8pt;
}
.outbox--full {
  width: 100%;
  transform: scaleY(100%);
  transform-origin: top;
  transition: transform 250ms ease-in-out;
}
.outbox--full.inactive {
  transform: scaleY(0);
  transition: transform 250ms ease-in-out;
}
.outbox--full, .outbox--full tr:nth-child(2n+1), .outbox--full tr:nth-child(2n) {
  background: white;
}
.outbox--full td {
  padding: 6px;
  font-size: 9pt;
}
.outbox--full td:first-child {
  width: 100px;
  background-color: #C8E3FF;
  font-size: 8pt;
  font-weight: bolder;
}
</style>`;

(async function() {
    'use strict';
    document.head.insertAdjacentHTML("beforeEnd", css);
    const outbox = new Outbox(await GM.getValue("neopets-outbox", "[]"));
    const ui = new UI(outbox);
    ui.appendAnchor();
    document.querySelector(".content input[type='submit']")?.addEventListener("click", () => {
        outbox.add();
    });
})();
