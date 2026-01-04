// ==UserScript==
// @name         FV CSS Editor (Villager Profiles)
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      10.1
// @description  test
// @author       necroam
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557150/FV%20CSS%20Editor%20%28Villager%20Profiles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557150/FV%20CSS%20Editor%20%28Villager%20Profiles%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // -------------------------
    // UTILITY FUNCTIONS
    // -------------------------
    function convertToRGBA(hex, alpha){
        const r = parseInt(hex.substr(1,2),16);
        const g = parseInt(hex.substr(3,2),16);
        const b = parseInt(hex.substr(5,2),16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function applyStyle(selector, prop, value){
        const el = document.querySelector(selector);
        if(el) el.style[prop] = value;
    }

    // -------------------------
    // COLOR / SHIFT INPUT
    // -------------------------
    function createColorInput(labelText, defaultValue, onChange, selector){
        const container = document.createElement('div');
        container.style.margin='6px 0';
        container.style.borderBottom='1px solid #ccc';
        container.style.paddingBottom='6px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.fontWeight = 'bold';

        // Primary color
        const colorInput1 = document.createElement('input');
        colorInput1.type = 'color';
        colorInput1.value = defaultValue;
        colorInput1.style.width = '45%';
        colorInput1.style.marginRight = '4px';

        // Secondary color for shift/fade
        const colorInput2 = document.createElement('input');
        colorInput2.type = 'color';
        colorInput2.value = defaultValue;
        colorInput2.style.width = '45%';
        colorInput2.style.marginLeft = '4px';
        colorInput2.style.display = 'none';

        // Opacity slider
        const rangeInput = document.createElement('input');
        rangeInput.type='range';
        rangeInput.min=0; rangeInput.max=1; rangeInput.step=0.01;
        rangeInput.value=1;
        rangeInput.style.width='30%';
        rangeInput.style.verticalAlign='middle';
        rangeInput.style.marginLeft='4px';

        const percentDisplay = document.createElement('span');
        percentDisplay.textContent='100%';
        percentDisplay.style.marginLeft='4px';

        // Fade/Shift checkbox
        const fadeCheckbox = document.createElement('input');
        fadeCheckbox.type='checkbox';
        fadeCheckbox.style.marginLeft='10px';
        const fadeLabel = document.createElement('span');
        fadeLabel.textContent='Shift/Fade';
        fadeLabel.style.fontSize='12px';
        fadeLabel.style.marginLeft='2px';

        // Angle input
        const angleInput = document.createElement('input');
        angleInput.type='number';
        angleInput.min = 0; angleInput.max = 360; angleInput.value = 90;
        angleInput.style.width = '50px';
        angleInput.style.marginLeft = '6px';
        angleInput.style.display='none';
        const angleLabel = document.createElement('span');
        angleLabel.textContent='°';
        angleLabel.style.fontSize='12px';
        angleLabel.style.display='none';

        fadeCheckbox.addEventListener('change', ()=>{
            if(fadeCheckbox.checked){
                colorInput2.style.display='inline-block';
                angleInput.style.display='inline-block';
                angleLabel.style.display='inline-block';
            } else {
                colorInput2.style.display='none';
                angleInput.style.display='none';
                angleLabel.style.display='none';
            }
            updateValue();
        });

        function updateValue(){
            const alpha = parseFloat(rangeInput.value);
            const el = document.querySelector(selector);
            if(!el) return;
            if(fadeCheckbox.checked){
                const angle = angleInput.value;
                const grad = `linear-gradient(${angle}deg, ${colorInput1.value}, ${colorInput2.value})`;
                onChange(grad);
                applyStyle(selector, 'background', grad);  // Use 'background' for gradients
            } else {
                const rgba = convertToRGBA(colorInput1.value, alpha);
                onChange(rgba);
                applyStyle(selector, 'backgroundColor', rgba); // Solid color
            }
            percentDisplay.textContent = Math.round(rangeInput.value*100) + '%';
        }

        colorInput1.addEventListener('input', updateValue);
        colorInput2.addEventListener('input', updateValue);
        rangeInput.addEventListener('input', updateValue);
        angleInput.addEventListener('input', updateValue);

        container.appendChild(label);
        container.appendChild(colorInput1);
        container.appendChild(colorInput2);
        container.appendChild(rangeInput);
        container.appendChild(percentDisplay);
        container.appendChild(fadeCheckbox);
        container.appendChild(fadeLabel);
        container.appendChild(angleInput);
        container.appendChild(angleLabel);

        return container;
    }

    // -------------------------
    // TEXT / IMAGE INPUT
    // -------------------------
    function createTextInput(labelText, defaultValue, onChange, hintText, isImage=false){
        const container = document.createElement('div');
        container.style.margin='6px 0';
        container.style.borderBottom='1px solid #ccc';
        container.style.paddingBottom='6px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.fontWeight = 'bold';

        const input = document.createElement('input');
        input.type='text';
        input.value = defaultValue;
        input.style.width='100%';

        input.addEventListener('input', e=>{
            const val = e.target.value;
            if(isImage){
                const selector = imageInputMap[labelText];
                if(selector){
                    const el = document.querySelector(selector);
                    if(el){
                        if(el.tagName==='IMG') el.src = val;
                        else el.style.backgroundImage = `url('${val}')`;
                    }
                }
            }
            onChange(val);
        });

        container.appendChild(label);
        container.appendChild(input);

        if(hintText){
            const hint=document.createElement('div');
            hint.style.fontSize='10px';
            hint.style.color='#555';
            hint.textContent = hintText;
            container.appendChild(hint);
        }
        return container;
    }

    function addFontOption(labelText, selector){
        const container=document.createElement('div');
        container.style.margin='6px 0';
        container.style.borderBottom='1px solid #ccc';
        container.style.paddingBottom='6px';

        const label=document.createElement('label');
        label.textContent=labelText;
        label.style.fontWeight='bold';
        label.style.display='block';

        const select=document.createElement('select');
        ['Arial','Verdana','Helvetica','Tahoma','Trebuchet MS','Segoe UI','Sans-serif'].forEach(f=>{
            const opt=document.createElement('option');
            opt.value=f; opt.textContent=f; select.appendChild(opt);
        });

        select.onchange=()=>{
            applyStyle(selector,'fontFamily',select.value);
            cssValues[selector]={prop:'font-family',value:select.value};
            updateCSSOutput();
        };

        container.appendChild(label);
        container.appendChild(select);
        optionsContainer.appendChild(container);
    }

    // -------------------------
    // IMAGE SELECTORS
    // -------------------------
    const imageInputMap={
        'Logo Image':'#logo a',
        'Small Logo':'.logo-small',
        'Page Background Image':'.content:after'
    };

    // -------------------------
    // CSS VALUES
    // -------------------------
    const cssValues={};
    function addColorOption(selector,label){
        const current=(document.querySelector(selector)?getComputedStyle(document.querySelector(selector)).backgroundColor:'rgba(0,0,0,0)');
        cssValues[selector]={prop:'background-color',value:current};
        const input=createColorInput(label,current,val=>{
            cssValues[selector].value=val;
            updateCSSOutput();
        }, selector);
        optionsContainer.appendChild(input);
    }
    function addTextOption(selector,label,prop,hint,isImage=false){
        const current=(document.querySelector(selector)?getComputedStyle(document.querySelector(selector))[prop]:'');
        cssValues[selector]={prop:prop,value:current};
        const input=createTextInput(label,current,val=>{
            cssValues[selector].value=val;
            applyStyle(selector,prop,val);
            updateCSSOutput();
        },hint,isImage);
        optionsContainer.appendChild(input);
    }
    function updateCSSOutput(){
        let cssText='';
        for(let key in cssValues){
            const val = cssValues[key];
            cssText += `/* === ${key} === */\n${key} {\n    ${val.prop}: ${val.value};\n}\n\n`;
        }
        cssOutput.value = cssText;
    }

    // -------------------------
    // RIGHT DOCK
    // -------------------------
    const dock=document.createElement('div');
    dock.style.position='fixed';
    dock.style.top='0'; dock.style.right='0';
    dock.style.width='380px'; dock.style.height='100vh';
    dock.style.background='#fdfdfd';
    dock.style.borderLeft='1px solid #888';
    dock.style.zIndex='9999';
    dock.style.display='flex'; dock.style.flexDirection='column';
    dock.style.overflow='hidden';
    dock.style.boxShadow='-2px 0 15px rgba(0,0,0,0.25)';
    document.body.appendChild(dock);

    // Resize handle
    const resizeHandle=document.createElement('div');
    resizeHandle.style.width='6px'; resizeHandle.style.cursor='ew-resize';
    resizeHandle.style.position='absolute'; resizeHandle.style.top='0'; resizeHandle.style.left='0';
    resizeHandle.style.height='100%';
    dock.appendChild(resizeHandle);

    let isResizing=false;
    resizeHandle.onmousedown=(e)=>{
        isResizing=true;
        document.onmousemove=(e)=>{
            if(isResizing){
                let newWidth=window.innerWidth - e.clientX;
                newWidth=Math.max(250,Math.min(newWidth,600));
                dock.style.width=newWidth+'px';
            }
        }
        document.onmouseup=()=>{isResizing=false; document.onmousemove=null; document.onmouseup=null;}
    }

    // Collapse button
    const collapseBtn=document.createElement('button');
    collapseBtn.textContent='⮜';
    collapseBtn.style.position='absolute'; collapseBtn.style.left='-20px'; collapseBtn.style.top='10px';
    collapseBtn.style.width='20px'; collapseBtn.style.height='30px';
    collapseBtn.style.border='1px solid #888'; collapseBtn.style.borderRadius='4px 0 0 4px';
    collapseBtn.style.background='#fdfdfd'; collapseBtn.style.cursor='pointer';
    dock.appendChild(collapseBtn);

    let isCollapsed=false;
    collapseBtn.onclick=()=>{
        if(!isCollapsed){ dock.style.transform='translateX(100%)'; collapseBtn.textContent='⮞'; isCollapsed=true; }
        else{ dock.style.transform='translateX(0)'; collapseBtn.textContent='⮜'; isCollapsed=false; }
    }

    // -------------------------
    // OPTIONS + LIVE CSS + NOTES
    // -------------------------
    const optionsContainer=document.createElement('div');
    optionsContainer.style.flex='1'; optionsContainer.style.overflowY='auto'; optionsContainer.style.padding='10px';
    dock.appendChild(optionsContainer);

    const liveContainer=document.createElement('div');
    liveContainer.style.height='45%'; liveContainer.style.display='flex'; liveContainer.style.flexDirection='column'; liveContainer.style.borderTop='1px solid #ccc';
    dock.appendChild(liveContainer);

    const cssOutput=document.createElement('textarea');
    cssOutput.style.flex='1'; cssOutput.style.width='100%';
    cssOutput.style.padding='4px'; cssOutput.style.border='1px solid #ccc'; cssOutput.style.borderRadius='4px';
    liveContainer.appendChild(cssOutput);

    const notesBox=document.createElement('textarea');
    notesBox.placeholder='Notes here...';
    notesBox.style.height='60px'; notesBox.style.width='100%';
    notesBox.style.border='1px solid #ccc'; notesBox.style.borderRadius='4px'; notesBox.style.marginTop='4px';
    liveContainer.appendChild(notesBox);

    // -------------------------
    // RECOLOR EXAMPLES
    // -------------------------
    const recolorSelectors=[
        ['.content','Content Box'],
        ['.villager-data','Villager Data Box'],
        ['.villager-data .villager-general','Villager Info Box'],
        ['.breadcrumbs','Breadcrumbs'],
        ['.header-right-toolbar-buttons .btn','Toolbar Buttons'],
    ];
    recolorSelectors.forEach(s=>addColorOption(s[0],s[1]));

    // Logos & background
    addTextOption('#logo a','Logo Image','backgroundImage','Recommended size: 675x410px', true);
    addTextOption('.logo-small','Small Logo','backgroundImage','Recommended size: 110px width', true);
    addTextOption('.content:after','Page Background Image','backgroundImage','Full page background recommended', true);

    // Fonts
    addFontOption('Content Box Font','.content');
    addFontOption('Villager Data Font','.villager-data');
    addFontOption('Breadcrumb Font','.breadcrumbs');
    addFontOption('Links Font','a');

})();
