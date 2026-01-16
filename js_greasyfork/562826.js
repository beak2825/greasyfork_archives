// ==UserScript==
// @name         KoGaMa Custom Profile BG
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifica el banner de tu perfíl de KoGaMa, los otros que tengan el script también lo verán.
// @author       Haden
// @match        https://www.kogama.com/profile/*
// @match        https://kogama.com/profile/*
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/562826/KoGaMa%20Custom%20Profile%20BG.user.js
// @updateURL https://update.greasyfork.org/scripts/562826/KoGaMa%20Custom%20Profile%20BG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

    function showDiscordModal() {
        if (localStorage.getItem('kogama-discord-modal-hidden') === 'true') {
            console.log('Modal de Discord: Usuario eligió no mostrar más');
            return;
        }

        if (document.getElementById('discord-welcome-modal')) {
            console.log('Modal de Discord: Ya existe en la página');
            return;
        }

        if (!document.body) {
            console.log('Modal de Discord: Body no disponible, reintentando...');
            setTimeout(showDiscordModal, 500);
            return;
        }

        console.log('Modal de Discord: Mostrando modal');

        const modal = document.createElement('div');
        modal.id = 'discord-welcome-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.3s ease-in-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%);
            padding: 40px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            text-align: center;
            animation: slideIn 0.4s ease-out;
        `;

        modalContent.innerHTML = `
            <div style="margin-bottom: 25px;">
                <svg width="80" height="80" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="white"/>
                </svg>
            </div>
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">¡Únete a la Comunidad!</h2>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">
                Forma parte del servidor de Discord dedicado a <strong>revivir KoGaMa</strong>. Conecta con otros jugadores, comparte tus creaciones y ayuda a mantener viva la comunidad.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button id="discord-join-btn" style="
                    background: white;
                    color: #5865F2;
                    padding: 12px 28px;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                ">
                    Unirme al Discord
                </button>
                <button id="discord-close-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 12px 28px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    Cerrar
                </button>
            </div>
            <button id="discord-never-btn" style="
                background: transparent;
                color: rgba(255, 255, 255, 0.7);
                padding: 8px;
                border: none;
                font-size: 13px;
                cursor: pointer;
                margin-top: 15px;
                text-decoration: underline;
                transition: color 0.2s;
            ">
                No mostrar más
            </button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from {
                    transform: translateY(-30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        const joinBtn = modal.querySelector('#discord-join-btn');
        const closeBtn = modal.querySelector('#discord-close-btn');
        const neverBtn = modal.querySelector('#discord-never-btn');

        joinBtn.addEventListener('mouseenter', () => {
            joinBtn.style.transform = 'translateY(-2px)';
            joinBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });
        joinBtn.addEventListener('mouseleave', () => {
            joinBtn.style.transform = 'translateY(0)';
            joinBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        neverBtn.addEventListener('mouseenter', () => {
            neverBtn.style.color = 'white';
        });
        neverBtn.addEventListener('mouseleave', () => {
            neverBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        });

        joinBtn.addEventListener('click', () => {
            window.open('https://discord.gg/gAJw7zAQKq', '_blank', 'noopener,noreferrer');
            modal.remove();
        });

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        neverBtn.addEventListener('click', () => {
            localStorage.setItem('kogama-discord-modal-hidden', 'true');
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        console.log('Modal de Discord: Modal agregado al DOM');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(showDiscordModal, 1500);
        });
    } else {
        setTimeout(showDiscordModal, 1500);
    }
    function addBackgroundField() {
        if (!window.location.pathname.match(/\/profile\/\d+\/edit/)) return;

        const forms = document.querySelectorAll('form._1DhIE');
        let profileForm = null;

        for (const form of forms) {
            const descriptionTextarea = form.querySelector('textarea[name="description"], textarea#description');
            if (descriptionTextarea) {
                profileForm = form;
                break;
            }
        }

        if (!profileForm) return;

        if (profileForm.querySelector('#background-url-button')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'Q-kfl';
        buttonContainer.id = 'background-url-button';
        buttonContainer.style.marginBottom = '20px';
        buttonContainer.innerHTML = `
            <button class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary css-guua9"
                    tabindex="0"
                    type="button"
                    id="generate-bg-btn">
                <span class="MuiButton-icon MuiButton-startIcon MuiButton-iconSizeMedium css-1ygddt1">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"></path>
                    </svg>
                </span>
                Generar Fondo Personalizado
                <span class="MuiTouchRipple-root css-4mb1j7"></span>
            </button>
        `;

        const submitButton = profileForm.querySelector('.Q-kfl');
        if (submitButton) {
            profileForm.insertBefore(buttonContainer, submitButton);
        } else {
            profileForm.appendChild(buttonContainer);
        }

        const generateBtn = buttonContainer.querySelector('#generate-bg-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                showGeneratorModal();
            });
            console.log('✅ Botón de generador añadido');
        }

        console.log('✅ Campo de Background URL añadido');
    }

    function showGeneratorModal() {
        let modal = document.getElementById('bg-generator-modal');
        if (modal) {
            modal.remove();
        }

        let existingUrl = '';
        let existingOpacity = 0.5;
        let existingBlur = 0;
        let existingSocialLinks = '';

        const descriptionTextarea = document.querySelector('textarea[name="description"], textarea#description');
        if (descriptionTextarea) {
            const descriptionText = descriptionTextarea.value || '';
            console.log('📖 Leyendo descripción del textarea:', descriptionText);
            const bgMatch = descriptionText.match(/bg([A-Za-z0-9+\-$]+)/);
            if (bgMatch && bgMatch[1]) {
                try {
                    const decompressed = LZString.decompressFromEncodedURIComponent(bgMatch[1]);
                    console.log('📦 Datos descomprimidos:', decompressed);
                    if (decompressed) {
                        if (decompressed.includes('|')) {
                            const parts = decompressed.split('|');
                            existingUrl = parts[0] || '';
                            existingOpacity = parseFloat(parts[1]) || 0.5;
                            existingBlur = parseFloat(parts[2]) || 0;
                            existingSocialLinks = parts.slice(3).join('|');
                        } else {
                            existingUrl = decompressed;
                        }
                        console.log('✅ Código encontrado en descripción:');
                        console.log('  - URL:', existingUrl);
                        console.log('  - Opacidad:', existingOpacity);
                        console.log('  - Blur:', existingBlur);
                        console.log('  - Enlaces:', existingSocialLinks);
                    }
                } catch (e) {
                    console.error('Error al obtener URL del textarea:', e);
                }
            }
        }

        if (!existingUrl && !existingSocialLinks) {
            const biographyContainer = findBiographyContainer();
            if (biographyContainer) {
                const biographyText = biographyContainer.textContent || biographyContainer.innerText || '';
                const bgMatch = biographyText.match(/bg([A-Za-z0-9+\-$]+)/);
                if (bgMatch && bgMatch[1]) {
                    try {
                        const decompressed = LZString.decompressFromEncodedURIComponent(bgMatch[1]);
                        if (decompressed) {
                            // Verificar si tiene datos guardados
                            if (decompressed.includes('|')) {
                                const parts = decompressed.split('|');
                                existingUrl = parts[0] || '';
                                existingOpacity = parseFloat(parts[1]) || 0.5;
                                existingBlur = parseFloat(parts[2]) || 0;
                                existingSocialLinks = parts.slice(3).join('|');
                            } else {
                                existingUrl = decompressed;
                            }
                        }
                    } catch (e) {
                        console.error('Error al obtener URL existente:', e);
                    }
                }
            }
        }

        modal = document.createElement('div');
        modal.id = 'bg-generator-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #2C2E3B;
            padding: 30px;
            border-radius: 8px;
            max-width: 700px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #444; padding-bottom: 15px;">
                <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Generador de Fondo</h2>
                <button id="close-modal-btn" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;">×</button>
            </div>

            <div style="background: #1a1b26; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #444;">
                <h3 style="color: white; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Configuración de Fondo</h3>

                <div style="margin-bottom: 15px;">
                    <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px;">URL de la imagen:</label>
                    <input type="text" id="bg-url-input" placeholder="https://ejemplo.com/imagen.jpg"
                           value="${existingUrl}"
                           style="width: 100%; padding: 10px; border: 1px solid #555; background: #2C2E3B; color: white; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                </div>

                <div id="preview-container" style="margin-bottom: 15px; display: ${existingUrl ? 'block' : 'none'};">
                    <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px;">Vista previa:</label>
                    <div id="bg-preview" style="width: 100%; height: 180px; background-size: cover; background-position: center; border-radius: 6px; border: 2px solid #555;"></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px;">
                            Opacidad: <span id="opacity-value" style="color: white; font-weight: 600;">${Math.round(existingOpacity * 100)}%</span>
                        </label>
                        <input type="range" id="opacity-slider" min="0" max="100" value="${Math.round(existingOpacity * 100)}"
                               style="width: 100%; cursor: pointer;">
                    </div>

                    <div>
                        <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px;">
                            Blur: <span id="blur-value" style="color: white; font-weight: 600;">${existingBlur}px</span>
                        </label>
                        <input type="range" id="blur-slider" min="0" max="20" value="${existingBlur}"
                               style="width: 100%; cursor: pointer;">
                    </div>
                </div>
            </div>

            <div style="background: #1a1b26; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #444;">
                <h3 style="color: white; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Links</h3>

                <div id="links-list" style="margin-bottom: 15px; max-height: 300px; overflow-y: auto;">
                    <!-- Los enlaces se agregarán aquí dinámicamente -->
                </div>

                <button id="add-link-btn" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-sizeMedium"
                        style="width: 100%; background: #d32f2f; color: white; padding: 10px; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s;"
                        type="button">
                    + Agregar Link
                    <span class="MuiTouchRipple-root css-4mb1j7"></span>
                </button>
            </div>

            <div style="background: #1a1b26; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #444;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px;">Código generado:</label>
                <textarea id="generated-code" readonly
                          style="width: 100%; padding: 10px; border: 1px solid #555; background: #2C2E3B; color: #4CAF50; border-radius: 4px; font-size: 12px; font-family: monospace; resize: vertical; min-height: 70px; box-sizing: border-box;"></textarea>
            </div>

            <div style="display: flex; justify-content: center;">
                <button id="copy-code-btn" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary css-guua9"
                        style="width: auto; padding: 10px 30px;"
                        tabindex="0"
                        type="button">
                    Copiar Código
                    <span class="MuiTouchRipple-root css-4mb1j7"></span>
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Referencias a elementos
        const urlInput = modal.querySelector('#bg-url-input');
        const previewContainer = modal.querySelector('#preview-container');
        const preview = modal.querySelector('#bg-preview');
        const opacitySlider = modal.querySelector('#opacity-slider');
        const opacityValue = modal.querySelector('#opacity-value');
        const blurSlider = modal.querySelector('#blur-slider');
        const blurValue = modal.querySelector('#blur-value');
        const generatedCode = modal.querySelector('#generated-code');
        const copyBtn = modal.querySelector('#copy-code-btn');
        const closeBtn = modal.querySelector('#close-modal-btn');
        const linksList = modal.querySelector('#links-list');
        const addLinkBtn = modal.querySelector('#add-link-btn');

        // Sistema interactivo de enlaces
        let linksData = [];

        // Cargar enlaces existentes si los hay
        if (existingSocialLinks) {
            console.log('🔄 Cargando enlaces existentes:', existingSocialLinks);
            const existingLinks = existingSocialLinks.split('\n').filter(l => l.trim());
            console.log('🔄 Enlaces separados:', existingLinks);
            existingLinks.forEach((link, index) => {
                const parts = link.split('|');
                console.log(`🔄 Procesando enlace ${index}:`, parts);
                if (parts.length >= 2) {
                    const linkObj = {
                        name: parts[0] || '',
                        url: parts[1] || '',
                        color: parts[2] || '#666666',
                        icon: parts[3] || ''
                    };
                    console.log(`Enlace ${index} cargado:`, linkObj);
                    linksData.push(linkObj);
                }
            });
            console.log('Total de enlaces cargados:', linksData.length);
        }

        function updatePreview() {
            const url = urlInput.value.trim();
            if (url) {
                const opacity = opacitySlider.value / 100;
                const blur = blurSlider.value;
                preview.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity})), url("${url}")`;
                preview.style.filter = `blur(${blur}px)`;
                previewContainer.style.display = 'block';
            } else {
                previewContainer.style.display = 'none';
            }
        }

        // Función para generar código
        function generateCode() {
            const url = urlInput.value.trim();
            const opacity = opacitySlider.value / 100;
            const blur = blurSlider.value;

            const filteredLinks = linksData.filter(link => link.name && link.url);

            const socialLinksString = filteredLinks
                .map(link => `${link.name}|${link.url}|${link.color}|${link.icon}`)
                .join('\n');

            const finalUrl = url || '';


            const dataString = `${finalUrl}|${opacity}|${blur}|${socialLinksString}`;

            const compressed = LZString.compressToEncodedURIComponent(dataString);
            const finalCode = `bg${compressed}`;

            generatedCode.value = finalCode;
        }

        // Event listeners
        urlInput.addEventListener('input', () => {
            updatePreview();
            generateCode();
        });

        opacitySlider.addEventListener('input', () => {
            opacityValue.textContent = `${opacitySlider.value}%`;
            updatePreview();
            generateCode();
        });

        blurSlider.addEventListener('input', () => {
            blurValue.textContent = `${blurSlider.value}px`;
            updatePreview();
            generateCode();
        });

        // Función para renderizar la lista de enlaces
        function renderLinks() {
            linksList.innerHTML = '';
            linksData.forEach((link, index) => {
                const linkItem = document.createElement('div');
                linkItem.style.cssText = `
                    background: #1a1b26;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 10px;
                    border: 1px solid #444;
                `;

                linkItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="color: white; font-weight: 600; font-size: 14px;">Link ${index + 1}</span>
                        <button class="remove-link-btn" data-index="${index}" style="background: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Eliminar</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="color: #aaa; display: block; margin-bottom: 5px; font-size: 12px;">Nombre</label>
                            <input type="text" class="link-name" data-index="${index}" value="${link.name}" placeholder="Discord"
                                   style="width: 100%; padding: 8px; border: 1px solid #444; background: #2C2E3B; color: white; border-radius: 4px; font-size: 13px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="color: #aaa; display: block; margin-bottom: 5px; font-size: 12px;">Color</label>
                            <div style="display: flex; gap: 5px;">
                                <input type="color" class="link-color" data-index="${index}" value="${link.color}"
                                       style="width: 50px; height: 34px; border: 1px solid #444; background: #2C2E3B; cursor: pointer; border-radius: 4px;">
                                <input type="text" class="link-color-text" data-index="${index}" value="${link.color}" placeholder="#5865F2"
                                       style="flex: 1; padding: 8px; border: 1px solid #444; background: #2C2E3B; color: white; border-radius: 4px; font-size: 13px; box-sizing: border-box;">
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="color: #aaa; display: block; margin-bottom: 5px; font-size: 12px;">URL</label>
                        <input type="text" class="link-url" data-index="${index}" value="${link.url}" placeholder="https://discord.gg/servidor"
                               style="width: 100%; padding: 8px; border: 1px solid #444; background: #2C2E3B; color: white; border-radius: 4px; font-size: 13px; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="color: #aaa; display: block; margin-bottom: 5px; font-size: 12px;">Icono URL (opcional)</label>
                        <input type="text" class="link-icon" data-index="${index}" value="${link.icon}" placeholder="https://ejemplo.com/icono.png"
                               style="width: 100%; padding: 8px; border: 1px solid #444; background: #2C2E3B; color: white; border-radius: 4px; font-size: 13px; box-sizing: border-box;">
                    </div>
                `;

                linksList.appendChild(linkItem);
            });

            linksList.querySelectorAll('.link-name, .link-url, .link-icon').forEach(input => {
                input.addEventListener('input', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    const field = e.target.classList.contains('link-name') ? 'name' :
                                 e.target.classList.contains('link-url') ? 'url' : 'icon';
                    linksData[index][field] = e.target.value;
                    generateCode();
                });
            });

            linksList.querySelectorAll('.link-color').forEach(input => {
                input.addEventListener('input', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    linksData[index].color = e.target.value;
                    const textInput = linksList.querySelector(`.link-color-text[data-index="${index}"]`);
                    if (textInput) textInput.value = e.target.value;
                    generateCode();
                });
            });

            linksList.querySelectorAll('.link-color-text').forEach(input => {
                input.addEventListener('input', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    const value = e.target.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        linksData[index].color = value;
                        const colorInput = linksList.querySelector(`.link-color[data-index="${index}"]`);
                        if (colorInput) colorInput.value = value;
                        generateCode();
                    }
                });
            });

            linksList.querySelectorAll('.remove-link-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    linksData.splice(index, 1);
                    renderLinks();
                });
            });
        }

        // Renderizar enlaces existentes
        renderLinks();

        // Botón para agregar nuevo enlace
        addLinkBtn.addEventListener('click', () => {
            linksData.push({
                name: '',
                url: '',
                color: '#666666',
                icon: ''
            });
            renderLinks();
        });

        // Hover effect para botón de agregar enlace
        addLinkBtn.addEventListener('mouseenter', () => {
            addLinkBtn.style.background = '#b71c1c';
        });

        addLinkBtn.addEventListener('mouseleave', () => {
            addLinkBtn.style.background = '#d32f2f';
        });

        // Hover effect para botón de cerrar
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '0.7';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '1';
        });

        copyBtn.addEventListener('click', () => {
            generatedCode.select();
            document.execCommand('copy');
            copyBtn.textContent = '¡Copiado!';
            setTimeout(() => {
                copyBtn.innerHTML = 'Copiar Código<span class="MuiTouchRipple-root css-4mb1j7"></span>';
            }, 2000);
        });

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        if (existingUrl) {
            updatePreview();
            generateCode();
        }
    }

    function findBiographyContainer() {
        const textarea = document.querySelector('textarea[name="description"], textarea#description');
        if (textarea) {
            return textarea;
        }

        const allDivs = document.querySelectorAll('div');
        for (const div of allDivs) {
            const text = div.textContent || div.innerText || '';
            if (text.match(/bg[A-Za-z0-9+\-$]{10,}/)) {
                // Verificar que no sea un contenedor padre muy grande
                if (text.length < 5000) {
                    console.log('✅ Contenedor de biografía encontrado');
                    return div;
                }
            }
        }

        const biographyElements = document.querySelectorAll('div[class*="MuiTypography"]');
        for (const element of biographyElements) {
            const text = element.textContent || element.innerText || '';
            if (text.match(/bg[A-Za-z0-9+\-$]{10,}/)) {
                console.log('✅ Contenedor de biografía encontrado (MuiTypography)');
                return element;
            }
        }

        console.log('❌ No se encontró contenedor de biografía');
        return null;
    }

    function extractBackgroundData() {
        const biographyContainer = findBiographyContainer();
        if (!biographyContainer) {
            console.log('❌ No se encontró el contenedor de biografía');
            return null;
        }

        let biographyText = '';
        if (biographyContainer.tagName === 'TEXTAREA') {
            biographyText = biographyContainer.value || '';
        } else {
            biographyText = biographyContainer.textContent || biographyContainer.innerText || '';
        }

        console.log('📖 Texto de biografía:', biographyText);

        const bgMatch = biographyText.match(/bg([A-Za-z0-9+\-$]+)/);
        if (!bgMatch || !bgMatch[1]) {
            console.log('❌ No se encontró código de fondo en la biografía');
            return null;
        }

        console.log('🔍 Código comprimido encontrado:', bgMatch[1]);

        try {
            const compressed = bgMatch[1];
            const decompressed = LZString.decompressFromEncodedURIComponent(compressed);

            if (!decompressed) {
                console.error('❌ Error al descomprimir el código');
                return null;
            }

            console.log('📦 Datos descomprimidos:', decompressed);

            // Formato: url|opacity|blur|socialLinks
            const parts = decompressed.split('|');
            const url = parts[0];
            const opacity = parseFloat(parts[1]) || 0.5;
            const blur = parseFloat(parts[2]) || 0;

            const socialLinks = parts.slice(3).join('|');

            console.log(`✅ URL: ${url}, Opacidad: ${opacity}, Blur: ${blur}`);
            console.log(`✅ Enlaces sociales raw:`, socialLinks);

            return { url, opacity, blur, socialLinks };
        } catch (e) {
            console.error('❌ Error al procesar el código:', e);
            return null;
        }
    }

    // Función para cambiar el fondo del perfil
    function changeProfileBackground() {
        console.log('🔍 Intentando cambiar fondo del perfil...');
        const data = extractBackgroundData();
        if (!data) {
            console.log('❌ No se obtuvieron datos del fondo');
            return;
        }

        const { url, opacity, blur } = data;

        if (!url) {
            console.log('⚠️ No hay URL de fondo, solo se mostrarán enlaces');
            return;
        }

        console.log(`📊 Datos extraídos - URL: ${url}, Opacidad: ${opacity}, Blur: ${blur}`);

        // Buscar el contenedor del fondo - intentar múltiples selectores
        let backgroundContainer = document.querySelector('div._33DXe');

        if (!backgroundContainer) {
            console.log('⚠️ No se encontró div._33DXe, buscando alternativas...');
            // Buscar por estructura: el div que contiene la imagen de fondo del perfil
            const possibleContainers = document.querySelectorAll('div[style*="background"]');
            for (const container of possibleContainers) {
                if (container.style.backgroundImage || container.style.backgroundSize) {
                    backgroundContainer = container;
                    console.log('✅ Contenedor alternativo encontrado');
                    break;
                }
            }
        }

        if (!backgroundContainer) {
            console.log('❌ No se encontró el contenedor de fondo');
            return;
        }

        // Aplicar el fondo con overlay y blur
        backgroundContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity})), url("${url}")`;
        backgroundContainer.style.backgroundSize = 'cover';
        backgroundContainer.style.backgroundPosition = 'center center';
        backgroundContainer.style.backgroundRepeat = 'no-repeat';
        backgroundContainer.style.filter = `blur(${blur}px)`;
        backgroundContainer.style.opacity = '1';
        backgroundContainer.style.transition = 'opacity 0.3s';

        console.log(`✅ Fondo del perfil cambiado: ${url} Opacidad: ${opacity} Blur: ${blur}`);
    }

    // Función para mostrar enlaces sociales en el perfil
    function displaySocialLinks() {
        console.log('🔍 Buscando enlaces sociales...');
        const data = extractBackgroundData();
        if (!data || !data.socialLinks) {
            console.log('❌ No se encontraron enlaces sociales');
            return;
        }

        const links = data.socialLinks.split('\n').filter(link => link.trim());
        if (links.length === 0) {
            console.log('❌ No hay enlaces para mostrar');
            return;
        }

        console.log(`✅ Enlaces sociales encontrados: ${links.length}`);

        // Buscar el contenedor principal del perfil
        const profileContainer = document.querySelector('._25Vmr');
        if (!profileContainer) {
            console.log('❌ No se encontró el contenedor del perfil');
            return;
        }

        // Crear el contenedor de enlaces sociales
        const socialContainer = document.createElement('div');
        socialContainer.id = 'social-links-container';
        socialContainer.style.cssText = `
            background: #2C2E3B;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            min-width: 200px;
            flex-shrink: 0;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Links';
        title.style.cssText = `
            color: white;
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
        `;
        socialContainer.appendChild(title);

        const linksWrapper = document.createElement('div');
        linksWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        links.forEach(link => {
            const linkData = link.trim();
            if (!linkData) return;

            // Parsear el formato: Nombre|URL|Color|IconoURL
            const parts = linkData.split('|');
            if (parts.length < 2) return; // Necesita al menos nombre y URL

            const name = parts[0].trim();
            const url = parts[1].trim();
            const color = parts[2] ? parts[2].trim() : '#666';
            const iconUrl = parts[3] ? parts[3].trim() : '';

            // Crear botón de enlace
            const linkBtn = document.createElement('button');
            linkBtn.textContent = name;
            linkBtn.style.cssText = `
                background: ${color};
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                border: none;
                font-size: 13px;
                font-weight: 500;
                transition: opacity 0.2s, transform 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
            `;

            // Si hay icono, agregarlo
            if (iconUrl) {
                const icon = document.createElement('img');
                icon.src = iconUrl;
                icon.style.cssText = 'width: 16px; height: 16px; object-fit: contain;';
                linkBtn.insertBefore(icon, linkBtn.firstChild);
            }

            linkBtn.addEventListener('mouseenter', () => {
                linkBtn.style.opacity = '0.8';
            });

            linkBtn.addEventListener('mouseleave', () => {
                linkBtn.style.opacity = '1';
            });

            // Agregar evento de clic para mostrar modal de confirmación
            linkBtn.addEventListener('click', () => {
                showLinkConfirmationModal(name, url);
            });

            linksWrapper.appendChild(linkBtn);
        });

        socialContainer.appendChild(linksWrapper);

        // Verificar si ya existe un contenedor de enlaces
        const existingContainer = document.getElementById('social-links-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Hacer que el contenedor del perfil sea flex para poner los enlaces a la derecha
        profileContainer.style.display = 'flex';
        profileContainer.style.justifyContent = 'space-between';
        profileContainer.style.alignItems = 'flex-start';
        profileContainer.style.gap = '20px';

        // Envolver el contenido existente en un div para que no crezca
        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = 'display: flex; gap: 20px; flex: 1;';

        // Mover los hijos existentes al wrapper
        const children = Array.from(profileContainer.children);
        children.forEach(child => {
            contentWrapper.appendChild(child);
        });

        // Agregar el wrapper y el contenedor de enlaces
        profileContainer.appendChild(contentWrapper);
        profileContainer.appendChild(socialContainer);

        console.log('✅ Enlaces sociales mostrados a la derecha del perfil');
    }

    // Función para mostrar modal de confirmación de enlace
    function showLinkConfirmationModal(name, url) {
        // Verificar si ya existe un modal
        let modal = document.getElementById('link-confirmation-modal');
        if (modal) {
            modal.remove();
        }

        // Crear el modal
        modal = document.createElement('div');
        modal.id = 'link-confirmation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #2C2E3B;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            position: relative;
        `;

        modalContent.innerHTML = `
            <button id="close-confirm-modal-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
            <h2 style="color: white; margin: 0 0 20px 0; font-size: 20px; padding-right: 30px;">Confirmar redirección</h2>
            <p style="color: #ccc; margin: 0 0 10px 0; font-size: 14px;">Estás a punto de ser redirigido a:</p>
            <div style="background: #1a1b26; padding: 15px; border-radius: 6px; margin-bottom: 20px; word-break: break-all;">
                <p style="color: white; margin: 0 0 5px 0; font-weight: 600;">${name}</p>
                <p style="color: #888; margin: 0; font-size: 13px; font-family: monospace;">${url}</p>
            </div>
            <p style="color: #ff9800; margin: 0 0 20px 0; font-size: 13px;">⚠️ Asegúrate de confiar en este enlace antes de continuar.</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="confirm-link-btn" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-sizeMedium"
                        style="background: #d32f2f; color: white; padding: 8px 22px; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s;"
                        type="button">
                    Ir al enlace
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners
        const closeBtn = modal.querySelector('#close-confirm-modal-btn');
        const confirmBtn = modal.querySelector('#confirm-link-btn');

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        confirmBtn.addEventListener('click', () => {
            window.open(url, '_blank', 'noopener,noreferrer');
            modal.remove();
        });

        confirmBtn.addEventListener('mouseenter', () => {
            confirmBtn.style.background = '#b71c1c';
        });

        confirmBtn.addEventListener('mouseleave', () => {
            confirmBtn.style.background = '#d32f2f';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Función para ocultar el perfil inicialmente
    function hideProfileInitially() {
        const profileContainer = document.querySelector('div._33DXe');
        if (profileContainer) {
            profileContainer.style.opacity = '0';
        }
    }

    // Función para eliminar el botón de compartir
    function removeShareButton() {
        const shareButton = document.querySelector('._1Noq6');
        if (shareButton) {
            shareButton.remove();
            console.log('✅ Botón de compartir eliminado');
        }
    }

    // Función principal de inicialización
    function init() {
        // Ocultar perfil inicialmente
        hideProfileInitially();

        // Variable para evitar ejecuciones múltiples
        let hasRun = false;

        // Esperar a que la página cargue completamente
        const observer = new MutationObserver(() => {
            // Verificar si estamos en la página de edición
            if (window.location.pathname.match(/\/profile\/\d+\/edit/)) {
                addBackgroundField();
            }

            // Verificar si estamos en una página de perfil (no edición)
            if (window.location.pathname.match(/\/profile\/\d+\/?$/) && !window.location.pathname.includes('/edit') && !hasRun) {
                const biographyContainer = findBiographyContainer();
                if (biographyContainer) {
                    changeProfileBackground();
                    displaySocialLinks();
                    removeShareButton();
                    hasRun = true;
                    observer.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Intentar ejecutar inmediatamente también
        setTimeout(() => {
            if (window.location.pathname.match(/\/profile\/\d+\/edit/)) {
                addBackgroundField();
            } else if (window.location.pathname.match(/\/profile\/\d+\/?$/) && !hasRun) {
                changeProfileBackground();
                displaySocialLinks();
                removeShareButton();
                hasRun = true;
            }
        }, 1000);
    }

    // Iniciar el script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
