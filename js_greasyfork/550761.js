// ==UserScript==
// @name         HW: Clan Shop
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  HackerWars Clan Shop
// @match        https://hackerwars.io/clan
// @match        https://hackerwars.io/clan?id=*
// @author       Nacom
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550761/HW%3A%20Clan%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/550761/HW%3A%20Clan%20Shop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_ATTR = 'data-hw-shop-parsed';
    const cart = [];

    const style = document.createElement('style');
    style.textContent = `
    @keyframes rainbow {
        0%{color:red} 16%{color:orange} 33%{color:yellow} 50%{color:green} 66%{color:blue} 83%{color:indigo} 100%{color:violet}
    }
    .rainbow-text{animation:rainbow 2s linear infinite}
    `;
    document.head.appendChild(style);

    function findClanDescriptionElement() {
        const titleEls = Array.from(document.querySelectorAll('.widget-box .widget-title h5'));
        const descTitle = titleEls.find(h => h.textContent.trim() === 'Clan description');
        if(!descTitle) return null;
        const widgetBox = descTitle.closest('.widget-box');
        if(!widgetBox) return null;
        return widgetBox.querySelector('.widget-content.padding') || null;
    }

    function parseDescription(text) {
        const result = { owner:null, products:[] };
        const ownerMatch = text.match(/shopowner\s*:\s*(\S+)/i);
        if(ownerMatch) result.owner = ownerMatch[1];

        const softwareMatch = text.match(/software\s*:\s*([\s\S]*)/i);
        if(!softwareMatch) return result;

        const productRegex = /- ([^\(\n]+)\(([^)]+)\)/g;
        let match;
        while((match = productRegex.exec(softwareMatch[1]))!==null){
            const prodName = match[1].trim();
            const versions = match[2].trim().split(',').map(v=>{
                const [name, price] = v.split(':');
                return { name:name.trim(), price:parseFloat(price) };
            });
            result.products.push({ name:prodName, versions });
        }
        return result;
    }

    function formatPrice(num){ return num.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }

    function processDescription(text){
        let html = text.replace(/NCSS!Break/gi,'<br>');
        html = html.replace(/\?rainbow!(.*?)!rainbow\?/gs,'<span class="rainbow-text">$1</span>');
        html = html.replace(/\?(red|blue|green|yellow|purple|orange)!(.*?)!\1\?/gs,(m,color,content)=>`<span style="color:${color}">${content}</span>`);
        return html;
    }

    function createCartWidget(shopWrapper){
        const cartWidget = document.createElement('div');
        cartWidget.style.position='absolute';
        cartWidget.style.top='10px';
        cartWidget.style.right='10px';
        cartWidget.style.width='32px';
        cartWidget.style.height='32px';
        cartWidget.style.cursor='pointer';

        const icon = document.createElement('div');
        icon.textContent='🛒';
        icon.style.fontSize='28px';
        icon.style.position='relative';
        cartWidget.appendChild(icon);

        const countBubble = document.createElement('span');
        countBubble.textContent='0';
        countBubble.style.position='absolute';
        countBubble.style.top='-6px';
        countBubble.style.right='-6px';
        countBubble.style.background='red';
        countBubble.style.color='white';
        countBubble.style.borderRadius='50%';
        countBubble.style.width='18px';
        countBubble.style.height='18px';
        countBubble.style.fontSize='12px';
        countBubble.style.textAlign='center';
        countBubble.style.lineHeight='18px';
        icon.appendChild(countBubble);

        const tooltip=document.createElement('div');
        tooltip.style.position='absolute';
        tooltip.style.top='36px';
        tooltip.style.right='0';
        tooltip.style.width='220px';
        tooltip.style.background='#fff';
        tooltip.style.border='1px solid #ccc';
        tooltip.style.borderRadius='6px';
        tooltip.style.padding='8px';
        tooltip.style.boxShadow='0 1px 4px rgba(0,0,0,0.2)';
        tooltip.style.display='none';
        tooltip.style.zIndex='1000';
        shopWrapper.appendChild(tooltip);

        cartWidget.addEventListener('mouseenter',()=>{tooltip.style.display='block'; renderTooltip();});
        cartWidget.addEventListener('mouseleave',()=>{tooltip.style.display='none';});

        function renderTooltip(){
            tooltip.innerHTML='';
            if(cart.length===0){tooltip.textContent='Cart is empty'; return;}
            let sum=0;
            cart.forEach(item=>{
                const line=document.createElement('div');
                line.style.display='flex';
                line.style.justifyContent='space-between';
                line.style.marginBottom='4px';
                line.textContent=`${item.name} (${item.version}) $${formatPrice(item.price)}`;
                tooltip.appendChild(line);
                sum+=item.price;
            });
            const total=document.createElement('div');
            total.style.fontWeight='bold';
            total.style.textAlign='right';
            total.textContent=`Total: $${formatPrice(sum)}`;
            tooltip.appendChild(total);
        }

        function updateCount(){countBubble.textContent=cart.length;}

        shopWrapper.appendChild(cartWidget);
        return { updateCount, renderTooltip };
    }

    function renderShop(container,data){
        container.innerHTML='';
        container.style.position='relative';

        const shopWrapper=document.createElement('div');
        shopWrapper.className='widget-box';
        shopWrapper.style.marginTop='10px';

        const header=document.createElement('div');
        header.className='widget-title';
        header.innerHTML=`<span class="icon"><span class="he16-clan_desc"></span></span><h5>Shop</h5>`;
        shopWrapper.appendChild(header);

        const contentDiv=document.createElement('div');
        contentDiv.className='widget-content padding';
        contentDiv.style.position='relative';
        shopWrapper.appendChild(contentDiv);

        const cartUI=createCartWidget(contentDiv);

        data.products.forEach(product=>{
            const line=document.createElement('div');
            line.style.display='flex';
            line.style.alignItems='center';
            line.style.marginTop='6px';
            line.style.border='1px solid #ddd';
            line.style.borderRadius='6px';
            line.style.padding='8px';

            const nameDiv=document.createElement('div');
            nameDiv.textContent=product.name;
            nameDiv.style.flex='1';
            line.appendChild(nameDiv);

            const versionSelect=document.createElement('select');
            versionSelect.style.marginRight='10px';

            let maxVer=Math.max(...product.versions.map(v=>parseFloat(v.name)));
            product.versions.forEach(v=>{
                const opt=document.createElement('option');
                opt.value=v.price;
                opt.textContent=v.name;
                if(parseFloat(v.name)===maxVer) opt.classList.add('rainbow-text');
                versionSelect.appendChild(opt);
            });
            line.appendChild(versionSelect);

            const priceSpan=document.createElement('span');
            priceSpan.textContent='$'+formatPrice(product.versions[0]?.price||0);
            priceSpan.style.width='60px';
            line.appendChild(priceSpan);

            versionSelect.addEventListener('change',()=>{
                priceSpan.textContent='$'+formatPrice(parseFloat(versionSelect.value));
            });

            const addBtn=document.createElement('button');
            addBtn.textContent='Add to Cart';
            addBtn.style.marginLeft='10px';
            addBtn.style.background='#5DADE2';
            addBtn.style.color='white';
            addBtn.style.border='none';
            addBtn.style.borderRadius='4px';
            addBtn.style.padding='6px 10px';
            addBtn.style.cursor='pointer';
            addBtn.addEventListener('click',()=>{
                const selectedVer=versionSelect.options[versionSelect.selectedIndex].textContent;
                const selectedPrice=parseFloat(versionSelect.value);
                if(cart.some(item=>item.name===product.name&&item.version===selectedVer)) return alert('This version is already in the cart!');
                cart.push({name:product.name,version:selectedVer,price:selectedPrice});
                cartUI.updateCount();
                cartUI.renderTooltip();
            });
            line.appendChild(addBtn);

            contentDiv.appendChild(line);
        });

        const orderBtn=document.createElement('button');
        orderBtn.textContent='Order Cart';
        orderBtn.style.marginTop='12px';
        orderBtn.style.background='#27ae60';
        orderBtn.style.color='white';
        orderBtn.style.border='none';
        orderBtn.style.borderRadius='4px';
        orderBtn.style.padding='6px 10px';
        orderBtn.style.cursor='pointer';
        orderBtn.addEventListener('click',async()=>{
            if(!data.owner) return alert('No shop owner found');
            if(cart.length===0) return alert('Cart empty!');
            const userEl=document.querySelector('#user-nav .text');
            const username=userEl?userEl.textContent.trim():'Unknown';
            let body=`New Order from ${username}\nOrdered:\n`;
            cart.forEach(item=>{body+=`- ${item.name} (${item.version})\n`;});
            try{
                await fetch('/mail.php?action=new',{
                    method:'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    body:new URLSearchParams({
                        action:'new',
                        act:'new',
                        to:data.owner,
                        subject:'New Shop Order',
                        text:body
                    })
                });
                alert('Order sent!');
                cart.length=0;
                cartUI.updateCount();
                cartUI.renderTooltip();
            }catch(e){alert('Failed to send order'); console.error(e);}
        });
        contentDiv.appendChild(orderBtn);

        container.appendChild(shopWrapper);
    }

    const contentEl=findClanDescriptionElement();
    if(!contentEl || contentEl.getAttribute(PROCESSED_ATTR)) return;
    contentEl.setAttribute(PROCESSED_ATTR,'1');

    const parsed=parseDescription(contentEl.textContent);
    const descText=contentEl.textContent.replace(/(shopowner\s*:.*|software\s*:.*|- [^\(\n]+\([^)]+\))/gi,'');
    contentEl.innerHTML=processDescription(descText);

    const shopContainer=document.createElement('div');
    contentEl.parentElement.appendChild(shopContainer);
    renderShop(shopContainer,parsed);

})();
