// ==UserScript==
// @name         Drawaria Christmas Market
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Drawaria Christmas Market. Simulated products with a Christmas theme.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/555055/Drawaria%20Christmas%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/555055/Drawaria%20Christmas%20Market.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de productos navideños local (simulando la respuesta de una API)
    // Se usan URLs de imágenes estables para mantener el tema.
const christmasProducts = [
    { id: 1, title: "Adorno Muñeco de Nieve", price: 9.99, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Pack Luces Navideñas (10m)", price: 25.50, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Gorro de Papá Noel Deluxe", price: 14.99, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Galletas de Jengibre (Pack)", price: 7.50, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Vela con Aroma a Pino", price: 12.00, image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=400&q=80" },
    { id: 6, title: "Medias de Chimenea (Par)", price: 15.99, image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=400&q=80" },
    { id: 7, title: "Mini Árbol de Escritorio", price: 35.00, image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=400&q=80" },
    { id: 8, title: "Taza Navideña de Renos", price: 9.00, image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=400&q=80" }
];

    // Crear botón para abrir la tienda
    const storeBtn = document.createElement('button');
    storeBtn.textContent = '🎄 Mercado Navideño'; // TEXTO CAMBIADO
    storeBtn.style.position = 'fixed';
    storeBtn.style.top = '12px';
    storeBtn.style.right = '12px';
    storeBtn.style.zIndex = 10000;
    storeBtn.style.background = '#e60023'; // Color navideño
    storeBtn.style.color = '#fff';
    storeBtn.style.border = '1px solid #c00';
    storeBtn.style.borderRadius = '5px';
    storeBtn.style.padding = '8px 12px';
    document.body.appendChild(storeBtn);

    // Crea el contenedor del modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '2px solid #080'; // Borde verde navideño
    modal.style.zIndex = 10001;
    modal.style.display = 'none';
    modal.style.width = '480px';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 8px 32px #000a';
    modal.style.borderRadius = '10px';
    document.body.appendChild(modal);

    // Botón de cerrar
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cerrar';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    modal.appendChild(closeBtn);

    // Mostrar/ocultar tienda
    storeBtn.onclick = () => { modal.style.display = 'block'; };
    closeBtn.onclick = () => { modal.style.display = 'none'; };

    // Carrito en memoria
    let cart = [];

    // Renderizar productos y carrito
    function renderStore(products) {
        modal.innerHTML = '<h2 style="margin-top:0">🎄 Drawaria Christmas Market</h2>'; // TEXTO CAMBIADO
        modal.appendChild(closeBtn);

        const prods = document.createElement('div');
        prods.style.display = 'grid';
        prods.style.gridTemplateColumns = 'repeat(2,1fr)';
        prods.style.gap = '18px';

        products.forEach(product => {
            const card = document.createElement('div');
            card.style.border = '1px solid #f00'; // Borde rojo navideño
            card.style.borderRadius = '8px';
            card.style.padding = '10px';
            card.style.background = '#fff4f4'; // Fondo rojo claro
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" style="width:80px;height:80px;object-fit:contain;">
                <div style="font-weight:bold;margin:8px 0 4px 0;font-size:15px;text-align:center;">${product.title}</div>
                <div style="color:#080;font-weight:bold;font-size:16px;">$${product.price}</div> <!-- Color verde navideño -->
            `;

            const addBtn = document.createElement('button');
            addBtn.textContent = 'Agregar al carrito';
            addBtn.onclick = () => {
                cart.push(product);
                renderCart();
            };
            card.appendChild(addBtn);

            prods.appendChild(card);
        });

        modal.appendChild(prods);

        // Carrito
        const cartDiv = document.createElement('div');
        cartDiv.style.marginTop = '24px';
        renderCart(cartDiv);

        modal.appendChild(cartDiv);
    }

    function renderCart(cartDiv) {
        if (!cartDiv) {
            cartDiv = modal.querySelector('.drawaria-cart');
            if (!cartDiv) {
                cartDiv = document.createElement('div');
                cartDiv.className = 'drawaria-cart';
                modal.appendChild(cartDiv);
            }
        }
        cartDiv.innerHTML = `<h3 style="margin-bottom:6px;">🎁 Tu Carrito de Regalos</h3>`; // TEXTO CAMBIADO

        if (cart.length === 0) {
            cartDiv.innerHTML += '<div style="color:#888;">El carrito está vacío, ¡escribe tu carta!</div>'; // TEXTO CAMBIADO
        } else {
            cart.forEach((prod, idx) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.gap = '8px';
                row.style.marginBottom = '4px';

                row.innerHTML = `
                    <img src="${prod.image}" style="width:28px;height:28px;">
                    <span style="flex:1;font-size:14px;">${prod.title}</span>
                    <span style="color:#080;font-weight:bold;font-size:15px;">$${prod.price}</span>
                `;

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Eliminar';
                delBtn.onclick = () => {
                    cart.splice(idx, 1);
                    renderCart(cartDiv);
                };
                row.appendChild(delBtn);
                cartDiv.appendChild(row);
            });

            const total = cart.reduce((a, b) => a + b.price, 0);
            cartDiv.innerHTML += `<div style="margin-top:6px;font-weight:bold;font-size:16px;">Total: $${total.toFixed(2)}</div>`;

            const buyBtn = document.createElement('button');
            buyBtn.textContent = '¡Comprar y Envolver!';
            buyBtn.style.marginTop = '10px';
            buyBtn.style.background = '#080'; // Botón de comprar verde
            buyBtn.style.color = '#fff';
            buyBtn.onclick = () => {
                alert('¡Regalo envuelto con éxito! ¡Felices Fiestas! 🎁'); // TEXTO CAMBIADO
                cart = [];
                renderCart(cartDiv);
            };
            cartDiv.appendChild(buyBtn);
        }
    }

    // Ya no se necesita el fetch a una API externa.
    // Llamamos a renderStore con la lista de productos navideños local.
    renderStore(christmasProducts);

})();