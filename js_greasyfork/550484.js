// ==UserScript==
// @name         Tango Delete AI Bot Messages
// @name:tr      Tango Bot Mesajlarını Sil
// @namespace    https://tomyris.dev
-// @author      hi@tomyris.dev
// @icon         https://tango.me/favicons/favicon-48x48.png
// @version      1.0
// @description  This script automatically finds messages sent by bots in Tango.me chats and lets you delete them in bulk. It adds an easy-to-use button to the Tango chat interface. Clicking the button shows a list of bot-related chats, which you can delete with a single confirmation. A progress indicator appears during deletion, and you’ll be notified about how many chats were deleted or failed to delete. The script offers a simple and user-friendly experience for quick chat cleanup.
// @description:tr  Bu script, Tango.me platformundaki sohbetlerde botlar tarafından gönderilen mesajları otomatik olarak bulur ve topluca silmenizi sağlar. Tango’nun sohbet ekranına kullanımı kolay bir buton ekler. Butona tıkladığınızda, bot mesajı içeren sohbetler listelenir ve onayınızla silinir. Silme işlemi sırasında bir ilerleme ekranı gösterilir; işlem bittiğinde kaç sohbetin silindiği veya silinemediği bildirilir. Kullanıcı dostu bir arayüzle, işlemleri hızlı ve kolay bir şekilde yapabilirsiniz.
// @match        https://tango.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550484/Tango%20Delete%20AI%20Bot%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/550484/Tango%20Delete%20AI%20Bot%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BASE_URL = "https://gateway.tango.me";
    const targetDiv = "#root > div._3vw1h > div > header > nav";

    // SweetAlert2 CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);

    // --- Butonu ekle ---
    function addButton() {
        if (document.querySelector("#deleteBotMessagesBtn")) return;

        // class="ixxi2" olan aside elementini bul
        const targetElement = document.querySelector(targetDiv);
        if (!targetElement) {
            console.error("Hedef element (aside.ixxi2) bulunamadı!");
            return;
        }

        const btn = document.createElement("button");
        btn.id = "deleteBotMessagesBtn";
        btn.setAttribute("data-testid", "delete-bot-messages-btn");
        btn.setAttribute("class","J6Ncy");
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">
                <path fill="#fff" fill-rule="evenodd" d="M16 8a4 4 0 0 0-4 4v2h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2v-2a4 4 0 0 0-4-4zm-2 2a2 2 0 1 1 4 0v2h-4v-2zm-2 6h8v8h-8v-8zm4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" clip-rule="evenodd"></path>
            </svg>Delete Bot !
        `;
        btn.title = "Bot Mesajlarını Sil"; // Tooltip için
        btn.onclick = showDeleteConfirmation;

        // Butonu aside elementinin üstüne ekle
        targetElement.append(btn);
    }

    // --- AI_CHAT_BOT conversation_id’lerini ve isimleri al ---
    async function getBotConversationIds() {
        const resp = await fetch(`${BASE_URL}/proxycador/api/public/v1/chats/v1/conversations/get`, {
            method: "POST",
            credentials: "include",
            headers: {
                "accept": "application/json",
                "accept-language": "tr,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type": "application/json",
                "origin": "https://tango.me",
                "referer": "https://tango.me/",
                "sec-ch-ua": '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0",
            },
            body: JSON.stringify({
                direction: "FORWARD",
                last_update_request_timestamp: 0,
                limit_conversations: 100,
                limit_messages_per_conversation: 1,
                include_group_members: true,
                include_messages: true,
                include_group_info: true,
                include_account_info: true
            })
        });

        const data = await resp.json();
        const conversations = data.conversations || [];

        return conversations
            .filter(conv => conv.messages && conv.messages.some(msg => msg.message_source === "AI_CHAT_BOT"))
            .map(conv => ({
                id: conv.conversation.conversation_id,
                name: conv.conversation.account_info ? conv.conversation.account_info.first_name : "Bilinmeyen Kullanıcı"
            }));
    }

    // --- Silme işlemi ---
    async function deleteConversations(ids) {
        if (!ids.length) {
            Swal.fire({
                icon: 'info',
                title: 'Bilgi',
                text: 'Silinecek bot mesajı bulunamadı ✅',
                confirmButtonText: 'Tamam'
            });
            return;
        }

        // Yükleme ekranını göster
        Swal.fire({
            title: 'Sohbetler Siliniyor...',
            text: 'Lütfen bekleyin, bot sohbetleri siliniyor.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        let successCount = 0;
        let failCount = 0;

        for (const id of ids) {
            try {
                const resp = await fetch(`${BASE_URL}/tc2/v2/conversations/delete`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        peer_ids: [id]
                    })
                });

                if (resp.ok) {
                    successCount++;
                    console.log(`Sohbet ${id} silindi.`);
                } else {
                    failCount++;
                    console.error(`Sohbet ${id} silinirken hata oluştu.`);
                }
            } catch (err) {
                failCount++;
                console.error(`Sohbet ${id} silinirken hata:`, err);
            }
        }

        // Yükleme ekranını kapat
        Swal.close();

        if (successCount > 0) {
            alert(`Toplam ${successCount} bot sohbeti silindi 🚀${failCount > 0 ? `\n${failCount} silme işlemi başarısız oldu ❌` : ''}`);
        } else {
            alert("Hiçbir bot sohbeti silinemedi ❌");
        }
    }

    // --- Silme onay modalı ---
    async function showDeleteConfirmation() {
        try {
            const conversations = await getBotConversationIds();
            if (conversations.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Bilgi',
                    text: 'Silinecek bot mesajı bulunamadı ✅',
                    confirmButtonText: 'Tamam'
                });
                return;
            }

            // Modal içeriği için HTML oluştur
            const content = `
                <div style="text-align: left; max-height: 300px; overflow-y: auto;">
                    <h3>Silinecek Bot Sohbetleri:</h3>
                    <ul style="list-style-type: none; padding: 0;">
                        ${conversations.map(conv => `
                            <li>
                                <strong>${conv.name}</strong> (ID: <a href="https://tango.me/chat/${conv.id}" target="_blank" style="color: #1e90ff; text-decoration: underline;">${conv.id}</a>)
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;

            Swal.fire({
                title: 'Bot Mesajlarını Sil',
                html: content,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sil',
                cancelButtonText: 'İptal',
                confirmButtonColor: '#e63946',
                cancelButtonColor: '#3085d6'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const ids = conversations.map(conv => conv.id);
                    await deleteConversations(ids);
                }
            });
        } catch (err) {
            console.error("Hata:", err);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Bir hata oluştu ❌',
                confirmButtonText: 'Tamam'
            });
        }
    }

    // --- Sayfa tamamen yüklendiğinde ve aside.ixxi2 mevcut olduğunda butonu ekle ---
    function waitForPageLoadAndElement() {
        // MutationObserver ile aside.ixxi2 elementini izle
        const observer = new MutationObserver((mutations, obs) => {
            const targetElement = document.querySelector(targetDiv);
            if (targetElement) {
                addButton();
                obs.disconnect(); // Element bulunduğunda gözlemciyi durdur
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Ekstra güvenlik için window.onload ile tüm kaynakların yüklendiğinden emin ol
        window.onload = () => {
            const targetElement = document.querySelector(targetDiv);
            if (targetElement) {
                addButton();
                observer.disconnect();
            }
        };

        // Belirli bir süre sonra hala element bulunmazsa hata yaz
        setTimeout(() => {
            if (!document.querySelector(targetDiv)) {
                console.error("Timeout: element bulunamadı!");
                observer.disconnect();
            }
        }, 10000); // 10 saniye timeout
    }

    // Sayfa yüklenmesini bekle ve gözlemciyi başlat
    if (document.readyState === 'complete') {
        waitForPageLoadAndElement();
    } else {
        window.addEventListener('load', waitForPageLoadAndElement);
    }
})();