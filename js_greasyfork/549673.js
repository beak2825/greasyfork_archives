// ==UserScript==
// @name        C.ai Color Enhancer
// @namespace   GreasyFork Scripts
// @match       https://character.ai/*
// @match       https://*.character.ai/*
// @grant       none
// @license     MIT
// @version     1.0.0.2
// @author      Vishanka & suggestingpain & elifwlrr (edit by Ciel_145)
// @description Lets you change the text colors as you wish and highlight chosen words. Hides the text "(edited)" or "Edited" after editing text. Removes the blue border around text after editing a chat on Character AI. Fixed for mobile users.
// @icon        https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/549673/Cai%20Color%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/549673/Cai%20Color%20Enhancer.meta.js
// ==/UserScript==


(function() {
    function loop() {
        let elements = document.querySelectorAll("div, p");
        elements.forEach(function(val) {
            if (val.innerText == "(edited)") {
                val.style.display = 'none';
            }
            if (val.innerText == "Edited") {
                val.style.display = 'none';
            }
        });
        requestAnimationFrame(loop);
    }

    loop();
})();

(function() {
    'use strict';

    // Function to change the CSS variable value
    function changeBlueColor() {
        const root = document.documentElement;

        // Set the new color value for --blue
        root.style.setProperty('--blue', '#242525');
    }

    // Wait for the page to load completely and then change the color
    window.addEventListener('load', () => {
        changeBlueColor();
    });
})();

(function () {

  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  var plaintextColor = localStorage.getItem('plaintext_color');
  var italicColor = localStorage.getItem('italic_color');
  var charbubbleColor = localStorage.getItem('charbubble_color') || '#26272B';
  var userbubbleColor = localStorage.getItem('userbubble_color') || '#303136';
  var defaultColor = '#FFFFFF'; // Default color if 'plaintext_color' is not set
  var GuideColor = localStorage.getItem('guide_color') || '#131316';
  var BodyColor = localStorage.getItem('body_color') || '#18181B';
  var InputColor = localStorage.getItem('input_color') || '#202024';
  var AccentColor = localStorage.getItem('accent_color') || '#26272b';
  const charbubbleMarginTop = localStorage.getItem('charbubbleMarginTop_color') || '0px';
  const charbubbleMarginLeft = localStorage.getItem('charbubbleMarginLeft_color') || '0px';

  // Use the retrieved color or default color
  var color = plaintextColor || defaultColor;

  // Retrieve the selected font and font size from local storage, or use defaults
  var selectedFont = localStorage.getItem('selected_font') || 'Inter';
  var fontSize = localStorage.getItem('font_size') || '16px';
  var fontWeight = localStorage.getItem('fontWeight_color') || '300';
  var titlesWeight = localStorage.getItem('boldTitles') || 'normal';
  var imageSize = localStorage.getItem('ImageSize') || '24px';
  var removeTitle = localStorage.getItem('removeTitles') || 'block';
  var removeUserImage = localStorage.getItem('removeUserImage') || 'block';
  var cpfpPaddingRight = localStorage.getItem('cpfpPaddingRight') || '0px';
  var cpfpPaddingTop = localStorage.getItem('cpfpPaddingTop') || '0px';
  var upfpPaddingLeft = localStorage.getItem('upfpPaddingLeft') || '0px';
  var proseMarginTop = localStorage.getItem('proseMarginTop') || '1.25em';
  var proseMarginBottom = localStorage.getItem('proseMarginBottom') || '1.25em';
  var showMobilePfP = localStorage.getItem('showMobilePfP') || 'none';


  var uBubbleWidth = localStorage.getItem('uBubbleWidth') || '100%';
//var uBubbleWidth = showMobilePfP === 'block' ? '100%' : '100%';
//localStorage.setItem('uBubbleWidth', uBubbleWidth);

var uBubblerem = removeUserImage === 'none' ? '0px' : (showMobilePfP === 'block' ? '-2rem' : '0px');
localStorage.setItem('uBubblerem', uBubblerem);
// Store the correct value of 'uBubblerem' in localStorage


// Determine the value of upfpMobileWidth based on removeUserImage
var upfpMobileWidth = removeUserImage === 'block' ? imageSize : '0px';

// Optionally, you can store the value of upfpMobileWidth in localStorage
localStorage.setItem('upfpMobileWidth', upfpMobileWidth);



  // Create the CSS style using the selected font, stored colors, and font size
var css = `
  p[node='[object Object]'] {
    color: ${color} !important;
    font-family: '${selectedFont}', 'Onest', sans-serif !important;
    font-size: ${fontSize} !important;
    font-weight: ${fontWeight} !important;
  }

  p, textarea, button, div.text-sm {
    font-family: '${selectedFont}', 'Onest', sans-serif !important;
  }

  em {
    color: ${italicColor} !important;
  }
`;


 css += `
  .mt-1.bg-surface-elevation-2 {
    background-color: ${charbubbleColor};
    margin-top: ${charbubbleMarginTop};
    margin-left: ${charbubbleMarginLeft};
  }
  .mt-1.bg-surface-elevation-3 {
    background-color: ${userbubbleColor};
  }
`;

  // Apply styles to specific elements for the bold titles
  css += `
    .mx-2.flex.flex-row.items-center.gap-2.font-light .text-small:not(.text-muted-foreground) {
      font-weight: ${titlesWeight} !important;
    }
  `;


css +=`
.max-w-7xl.self-center.w-full
`;

// Apply image size to specified elements, excluding the exception class
// Add styles for elements with specific classes and exclude images under .h-dvh > div:nth-child(1)
css += `
  .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center:not(
  .h-dvh > div:nth-child(1) *):not(
  .text-center *):not(
  .w-80 *):not(
  .m-0.flex.items-start.gap-2.justify-start.mr-0.md\\:mr-6.flex-row-reverse *):not(
  .flex.flex-col.items-center.justify-center.p-6.pt-0.mt-32.max-w-lg.mx-auto *):not(
  .flex.flex-col.items-center.h-full.overflow-y-hidden *):not(
  .flex.flex-col.justify-between.px-4.sm\\:px-8.pt-6 *):not(
  .flex.flex-col.flex-auto.gap-4.w-full.max-w-2xl *):not(
  .w-full.h-full.overflow-y-auto *):not(
  .flex.flex-col.justify-between.p-4 *):not(
  .flex.gap-3 *):not(
  .flex.flex-col.flex-auto.gap-4.w-full.max-w-2xl *) {
    width: ${imageSize} !important;
    height: ${imageSize} !important;
    border-radius: 50px;
  }
`;

// Add styles for elements with specific classes and exclude images under .h-dvh.fixed.z-50
css += `
  .relative.flex.h-auto.w-full.overflow-hidden.rounded-full.shrink-0.grow-0:not(
    .h-dvh.fixed.z-50 *):not(
    .text-center *):not(
    .w-80 *):not(
    .flex.flex-col.items-center.justify-center.p-6.pt-0.mt-32.max-w-lg.mx-auto *):not(
    .flex.flex-col.items-center.h-full.overflow-y-hidden *):not(
    .flex.flex-col.justify-between.px-4.sm\\:px-8.pt-6 *):not(
    .flex.flex-col.flex-auto.gap-4.w-full.max-w-2xl *):not(
    .w-full.h-full.overflow-y-auto *):not(
    .flex.flex-col.justify-between.p-4 *):not(
    .flex.gap-3 *):not(
    .flex.flex-col.flex-auto.gap-4.w-full.max-w-2xl *) {
    width: ${imageSize} !important;
    height: ${imageSize} !important;
    border-radius: 50px;
  }
`;



// Add styles for elements with specific classes and exclude images under .w-full.h-full.flex
css += `
  .object-cover.object-center.bg-card.shrink-0.grow-0.h-full:not(
  .h-dvh.fixed.z-50 *):not(
  .text-center *):not(
  .w-80 *):not(
  .flex.flex-col.items-center.justify-center.p-6.pt-0.mt-32.max-w-lg.mx-auto *):not(
  .flex.flex-col.items-center.h-full.overflow-y-hidden *):not(
  .flex.flex-col.justify-between.px-4.sm\\:px-8.pt-6 *):not(
  .flex.flex-col.items-center.justify-center.p-6.pt-0.mt-32.max-w-lg.mx-auto *):not(
  .flex.flex-col.items-center.h-full.overflow-y-hidden *):not(
  .flex.flex-col.justify-between.px-4.sm\\:px-8.pt-6 *):not(
  .w-full.h-full.overflow-y-auto *):not(
  .flex.flex-col.justify-between.p-4 *):not(
  .flex.gap-3 *):not(
  .flex.flex-col.flex-auto.gap-4.w-full.max-w-2xl *) {
    width: ${imageSize} !important;
    height: ${imageSize} !important;
    border-radius: 50px;

  }
`;


//Char pfp
css += `
  /* Apply styles for screen widths greater than or equal to 768px (e.g., tablets and desktops) */
  @media (min-width: 768px) {
    .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center:not(.h-dvh > div:nth-child(1) *):not(.text-center *):not(.w-80 *):not(.m-0.flex.items-start.gap-2.justify-start.mr-0.md\\:mr-6.flex-row-reverse *) {
      padding-right: ${cpfpPaddingRight};
      padding-top: ${cpfpPaddingTop};
    }
  }

  /* Apply styles for screen widths less than 768px (e.g., mobile devices) */
  @media (max-width: 767px) {
    .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center:not(.h-dvh > div:nth-child(1) *):not(.text-center *):not(.w-80 *):not(.m-0.flex.items-start.gap-2.justify-start.mr-0.md\\:mr-6.flex-row-reverse *) {
      padding-right: 0px; /* Example padding values for smaller screens */
      padding-top: 0px;  /* Example padding values for smaller screens */
    }
  }
`;

if (removeUserImage === 'none') {
css +=`
  @media (max-width: 767px) {
    .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center:not(.h-dvh > div:nth-child(1) *):not(.text-center *):not(.w-80 *):not(.m-0.flex.items-start.gap-2.justify-start.mr-0.md\\:mr-6.flex-row-reverse *) {

      padding-top: 14px;
    }
  }

`;
}
//user pfp
css += `
  /* Apply styles for screen widths greater than or equal to 768px (e.g., tablets and desktops) */
  @media (min-width: 768px) {
    .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center:not(
      .h-dvh > div:nth-child(1) *):not(
      .text-center *):not(
      .w-80 *):not(
      .m-0.flex.flex-row.items-start.gap-2.justify-start.ml-0.md\\:ml-6 *):not(
      .flex.flex-col.justify-end.pb-2.px-5 *) {
        padding-left: ${upfpPaddingLeft};
    }
  }

  /* Apply styles for screen widths less than 768px (e.g., mobile devices) */
  @media (max-width: 767px) {
    .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center:not(
      .h-dvh > div:nth-child(1) *):not(
      .text-center *):not(
      .w-80 *):not(
      .m-0.flex.flex-row.items-start.gap-2.justify-start.ml-0.md\\:ml-6 *):not(
      .flex.flex-col.justify-end.pb-2.px-5 *) {
        width: ${upfpMobileWidth};
    }
  }
`;

//This changes user input bubble width, mainly for gpt
if (removeUserImage === 'none') {
  css += `
    @media (max-width: 767px) {
      .mt-1.max-w-xl.rounded-2xl.px-3.min-h-12.flex.justify-center.py-3.bg-surface-elevation-3 {
        max-width: 70%;
        /* margin-right: ${uBubblerem}; */
      }
    }
  `;
}

if (removeUserImage === 'none') {
  css += `
    @media (min-width: 767px) {
      .mt-1.max-w-xl.rounded-2xl.px-3.min-h-12.flex.justify-center.py-3.bg-surface-elevation-3 {
        max-width: 70%;
        /* margin-right: ${uBubblerem}; */
      }
    }
  `;
}
/*
css += `
  @media (max-width: 767px) {
    .mt-1.max-w-xl.rounded-2xl.px-3.min-h-12.flex.justify-center.py-3.bg-surface-elevation-2 {
    width: ${uBubbleWidth};
    margin-left: ${uBubblerem};
    }
}
`;
*/

//remove user pfp
css += `
  .object-cover.object-top:not(
  .flex.flex-col.justify-end.pb-2.px-5 *):not(
  .flex.flex-col.items-center.justify-center.p-6.pt-0.mt-32.max-w-lg.mx-auto *):not(
  .flex.flex-col.items-center.h-full.overflow-y-hidden *):not(
  .flex.flex-col.items-center.justify-center.p-6.pt-0.mt-32.max-w-lg.mx-auto *):not(
  .flex.flex-col.items-center.h-full.overflow-y-hidden *):not(
  .flex.flex-col.flex-auto.gap-4.w-full.max-w-2xl *) {
    display: ${removeUserImage};

}
`;

css += `.mx-2.flex.flex-row.items-center.gap-2.font-light > .text-small {
  display: ${removeTitle} !important;
}
`;



css += `
.flex.items-center > .rounded-2xl.text-sm.bg-secondary.px-2.font-light.h-fit,
.rounded-2xl.text-sm.bg-secondary.px-2.font-light.h-fit {
  display: ${removeTitle} !important;

}
`;

css += `
.prose :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
    margin-top: ${proseMarginTop};
    margin-bottom: ${proseMarginBottom};
}
`;

/* For the first element: only apply margin-bottom */
css += `
.prose :where(p):first-of-type:not(:where([class~="not-prose"], [class~="not-prose"] *)) {
    margin-top: 0;
}
`;

/* For the last element: only apply margin-top */
css += `
.prose :where(p):last-of-type:not(:where([class~="not-prose"], [class~="not-prose"] *)) {
    margin-bottom: 0;
}
`;

// Show pfps on mobile
css += `
    @media (max-width: 767px) {
.mt-0.hidden.md\\:flex.flex-col.gap-3.items-center {
    display: ${showMobilePfP};
}
}
`;



/*
css += `
.w-fit,
.swiper-slide.px-1.swiper-slide-visible.swiper-slide-fully-visible.swiper-slide-next *,
.swiper-slide.px-1.swiper-slide-visible.swiper-slide-fully-visible.swiper-slide-active *,
.swiper-slide.px-1.swiper-slide-visible.swiper-slide-fully-visible * {
	background-color: ${userbubbleColor};
  border-radius: 20px;
}
`;
*/
/* For elements in the middle: apply both margins (this is covered by the default rule above) */


/*css += `
  .text-small { display: ${removeTitle} !important; }`;

*/

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css;
  head.appendChild(style);


  // Function to update CSS variables
  function updateCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
  }

if (currentTheme === 'dark') {
  // Update the specific CSS variables
updateCSSVariable('--G800', AccentColor);
updateCSSVariable('--G850', InputColor);
updateCSSVariable('--G900', BodyColor);
updateCSSVariable('--G950', GuideColor);


  updateCSSVariable('--G50', '#fafafa');
  updateCSSVariable('--G100', '#f4f4f5');
  updateCSSVariable('--G150', '#ececee');


}
else {
  // Update CSS variables for light theme (or any other theme)
updateCSSVariable('--G850', '#202024');
updateCSSVariable('--G900', '#18181B');
updateCSSVariable('--G950', '#131316');
  updateCSSVariable('--G50', InputColor);
  updateCSSVariable('--G100', BodyColor);
  updateCSSVariable('--G150', GuideColor);
}
})();




function changeColors() {
  const pTags = document.getElementsByTagName("p");
  const quotationMarksColor = localStorage.getItem('quotationmarks_color') || '#FFFFFF';
  const customColor = localStorage.getItem('custom_color') || '#FFFFFF';
  const wordlistCc = JSON.parse(localStorage.getItem('wordlist_cc')) || [];

  const wordRegex = wordlistCc.length > 0 ? new RegExp('\\b(' + wordlistCc.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi') : null;

  Array.from(pTags).forEach((pTag) => {
    if (
      pTag.dataset.colorChanged === "true" ||
      pTag.querySelector("code") ||
      pTag.querySelector("img") ||
      pTag.querySelector("textarea") ||
      pTag.querySelector("button") ||
      pTag.querySelector("div")
    ) {
      return; // Skip iteration
    }

    let text = pTag.innerHTML;

    // Save .katex elements' original HTML and replace with placeholders
    const katexElems = Array.from(pTag.querySelectorAll(".katex"));
    const katexReplacements = katexElems.map((elem, index) => {
      const placeholder = `KATEX_PLACEHOLDER_${index}`;
      text = text.replace(elem.outerHTML, placeholder);
      return { html: elem.outerHTML, placeholder };
    });

    // Handle <a> tags by removing them temporarily and saving their HTML for later restoration
    const aTags = Array.from(pTag.getElementsByTagName("a"));
    const aTagsReplacements = aTags.map((aTag, j) => {
      const placeholder = `REPLACE_ME_${j}`;
      text = text.replace(aTag.outerHTML, placeholder);
      return { tag: aTag, placeholder };
    });

    // Change text within quotation marks and for specific words based on the regex
    text = text.replace(/(["“”«»].*?["“”«»])/g, `<span style="color: ${quotationMarksColor}">$1</span>`);
//    text = text.replace(/(["“”«»][^"]*?,["“”«»])/g, `<span style="color: #E0DF7F">$1</span>`);

    if (wordRegex) {
      text = text.replace(wordRegex, `<span style="color: ${customColor}">$1</span>`);
    }

    // Restore .katex elements and <a> tags
    [...katexReplacements, ...aTagsReplacements].forEach(({ html, placeholder, tag }) => {
      text = text.replace(placeholder, html || tag.outerHTML);
    });

    // Update the innerHTML and mark the <p> tag to avoid re-processing
    pTag.innerHTML = text;
    pTag.dataset.colorChanged = "true";
  });

  console.log("Changed colors");
}

const divElements = document.querySelectorAll('div');

divElements.forEach(div => {
    const observer = new MutationObserver(changeColors);
    observer.observe(div, { subtree: true, childList: true });
});



function createButton(symbol, onClick) {
    const colorpalettebutton = document.createElement('button');
    colorpalettebutton.innerHTML = symbol;
    colorpalettebutton.style.position = 'relative';
    colorpalettebutton.style.background = 'none';
    colorpalettebutton.style.border = 'none';
    colorpalettebutton.style.fontSize = '18px';
    colorpalettebutton.style.top = '-5px';
    colorpalettebutton.style.cursor = 'pointer';
    colorpalettebutton.addEventListener('click', onClick);
    return colorpalettebutton;
}

// Function to create the color selector panel
function createColorPanel() {
    const panel = document.createElement('div');
    panel.id = 'colorPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
if (currentTheme === 'dark') {
    panel.style.backgroundColor = 'rgba(19, 19, 22, 0.85)';
} else {
     panel.style.backgroundColor = 'rgba(214, 214, 221, 0.85)';
}
    panel.style.border = 'none';
    panel.style.borderRadius = '5px';
    panel.style.padding = '20px';
//    panel.style.border = '2px solid #000';
    panel.style.zIndex = '9999';



const categories = ['italic', 'quotationmarks', 'plaintext', 'custom', 'charbubble', 'userbubble', 'guide', 'body', 'input', 'accent'];

const colorPickers = {};
const transparentCheckboxes = {}; // Store checkboxes separately

// Set a fixed width for the labels
const labelWidth = '150px';

categories.forEach(category => {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';

    // Retrieve stored color from local storage
    const storedColor = localStorage.getItem(`${category}_color`);
    if (storedColor && storedColor !== 'transparent') {
        colorPicker.value = storedColor;
    } else {
        colorPicker.value = '#000000'; // Default color if not set
    }

    colorPickers[category] = colorPicker;

    // Create a div to hold color picker
    const colorDiv = document.createElement('div');
    colorDiv.style.position = 'relative';
    colorDiv.style.width = '20px';
    colorDiv.style.height = '20px';
    colorDiv.style.marginLeft = '10px';
    colorDiv.style.top = '0px';
    colorDiv.style.backgroundColor = storedColor === 'transparent' ? 'transparent' : colorPicker.value;
    colorDiv.style.display = 'inline-block';
    colorDiv.style.marginRight = '10px';
    colorDiv.style.cursor = 'pointer';
    colorDiv.style.border = '1px solid black';

    // Event listener to open color picker when the color square is clicked
    colorDiv.addEventListener('click', function () {
        if (!transparentCheckbox.checked) {
            colorPicker.click();
        }
    });

    // Event listener to update the color div when the color changes
    colorPicker.addEventListener('input', function () {
        if (!transparentCheckbox.checked) {
            colorDiv.style.backgroundColor = colorPicker.value;
            localStorage.setItem(`${category}_color`, colorPicker.value);
        }
    });

    // Checkbox for transparency
    const transparentCheckbox = document.createElement('input');
    transparentCheckbox.type = 'checkbox';
    transparentCheckbox.style.marginLeft = '10px';
    transparentCheckbox.checked = storedColor === 'transparent';
    transparentCheckbox.title = 'Toggle transparency'; // Add tooltip text
    transparentCheckbox.style.marginRight = '5px'; // Add spacing between the checkbox and the reset button


    // Store the checkbox reference for later use
    transparentCheckboxes[category] = transparentCheckbox;

    transparentCheckbox.addEventListener('change', function () {
        if (transparentCheckbox.checked) {
            // Set color to transparent and lock the color picker behavior
            colorDiv.style.backgroundColor = 'transparent';
            localStorage.setItem(`${category}_color`, 'transparent');
        } else {
            // Revert to the current value of the color picker
            colorDiv.style.backgroundColor = colorPicker.value;
            localStorage.setItem(`${category}_color`, colorPicker.value);
        }
    });

    const label = document.createElement('label');
    label.style.width = labelWidth; // Set fixed width for the label
    label.style.margin = '0'; // Reduce label margin
    label.style.padding = '0'; // Reduce label padding
    label.appendChild(document.createTextNode(`${category}: `));

    // Reset button for each color picker
    const resetButton = createButton('↺', function () {
        const defaultColor = getDefaultColor(category);
        colorPicker.value = defaultColor;
        colorDiv.style.backgroundColor = defaultColor;
        transparentCheckbox.checked = false;
        localStorage.setItem(`${category}_color`, defaultColor);
    });
    resetButton.style.position = 'relative';
    resetButton.style.top = '-2px';
    resetButton.style.margin = '0'; // Reduce button margin
    resetButton.style.padding = '0'; // Reduce button padding

    // Create a div to hold label, color picker, and reset button
    const containerDiv = document.createElement('div');
    containerDiv.style.margin = '2px 0'; // Reduce vertical margin between rows
    containerDiv.style.padding = '0'; // Reduce padding within each row
    containerDiv.style.display = 'flex'; // Flex display for better control over spacing
    containerDiv.style.alignItems = 'center'; // Center align items vertically

    containerDiv.appendChild(label);
    containerDiv.appendChild(colorDiv);
    containerDiv.appendChild(transparentCheckbox);
    containerDiv.appendChild(resetButton);

    panel.appendChild(containerDiv);
});

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}




// Create a new button for custom font selection
/*const fontSelectorButton = document.createElement('button');
fontSelectorButton.style.marginBottom = '20px';
fontSelectorButton.style.borderRadius = '3px';
fontSelectorButton.style.width = '120px';
fontSelectorButton.style.marginLeft = '0px';
fontSelectorButton.style.height = '30px';
fontSelectorButton.style.border = 'none';
fontSelectorButton.style.textAlign = 'left';
fontSelectorButton.style.paddingLeft = '-10px';
fontSelectorButton.innerText = 'Select Font';
*/

const fontSelectorButton = document.createElement('label');
fontSelectorButton.innerText = 'Font: ';
fontSelectorButton.style.marginRight = '5px';
// Create a dropdown for font selection
const fontDropdown = document.createElement('select');
fontDropdown.style.marginLeft = '5px';
fontDropdown.style.marginBottom = '20px';
fontDropdown.style.borderRadius = '3px';
fontDropdown.style.paddingLeft = '-20px';
fontDropdown.style.height = '30px';

// List of font options
const fonts = [
  { name: 'Onest', value: 'Onest' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Noto Sans', value: 'Noto Sans' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Roboto', value: 'Roboto' }
];

// Add fonts to the dropdown
fonts.forEach(font => {
  const option = document.createElement('option');
  option.value = font.value;
  option.text = font.name;
  fontDropdown.appendChild(option);
});

// Load saved font from local storage
const savedFont = localStorage.getItem('selected_font');
if (savedFont) {
  fontDropdown.value = savedFont;
}

// Create a dropdown for font size selection
const fontSizeDropdown = document.createElement('select');
fontSizeDropdown.style.marginLeft = '5px';
fontSizeDropdown.style.marginBottom = '20px';
fontSizeDropdown.style.borderRadius = '3px';
fontSizeDropdown.style.height = '30px';

// List of font size options
const fontSizes = [
  { name: '12px', value: '12px' },
  { name: '14px', value: '14px' },
  { name: '15px', value: '15px' },
  { name: '16px', value: '16px' }, // Default font size
  { name: '17px', value: '17px' },
  { name: '18px', value: '18px' },
  { name: '20px', value: '20px' },
  { name: '24px', value: '24px' },
  { name: '28px', value: '28px' }
];

// Add font sizes to the dropdown
fontSizes.forEach(size => {
  const option = document.createElement('option');
  option.value = size.value;
  option.text = size.name;
  fontSizeDropdown.appendChild(option);
});

// Load saved font size from local storage
const savedFontSize = localStorage.getItem('font_size') || '16px';
fontSizeDropdown.value = savedFontSize;

// Add event listener to save the selected font size to local storage and apply it
fontSizeDropdown.addEventListener('change', function () {
  const selectedFontSize = fontSizeDropdown.value;
  localStorage.setItem('font_size', selectedFontSize);

  // Apply the selected font size to the document
  document.documentElement.style.setProperty('--font-size', selectedFontSize);






  // Update CSS dynamically
const css = `
  p[node='[object Object]'] {
    font-size: ${selectedFontSize} !important;
  }

  p, textarea, button, div.text-sm {
    /* Other styles here, without font-size modification */
  }
`;

  // Apply the new style
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);

  alert('Font size changed to ' + selectedFontSize);
});


// =========================== IMAGES

// Create a label for the dimension input
const dimensionLabel = document.createElement('label');
dimensionLabel.innerText = 'Image Size: ';
dimensionLabel.style.marginRight = '5px'; // Optional styling to space the label and input

// Create an input field for dimension selection
const dimensionInput = document.createElement('input');
dimensionInput.type = 'number';
dimensionInput.style.marginLeft = '5px';
dimensionInput.style.marginBottom = '20px';
dimensionInput.style.borderRadius = '3px';
dimensionInput.style.height = '30px';
dimensionInput.style.width = '60px'; // Optional styling for width
dimensionInput.min = 1; // Optional: Set a minimum value

// Load saved dimension from local storage
const savedImageSize = localStorage.getItem('ImageSize') || '24px'; // Default value set to '24px'
dimensionInput.value = savedImageSize.replace('px', ''); // Remove 'px' for display in the input

// Add event listener to save the entered dimension to local storage with 'px' suffix
dimensionInput.addEventListener('change', function () {
  const selectedSize = dimensionInput.value + 'px';
  localStorage.setItem('ImageSize', selectedSize);
//  alert('Image size saved as ' + selectedSize);
});


// Append the new dropdown to your existing setup


// =========================== END IMAGES



// Create a checkbox for font weight selection
const fontWeightCheckbox = document.createElement('input');
fontWeightCheckbox.type = 'checkbox';
fontWeightCheckbox.style.marginLeft = '5px';
fontWeightCheckbox.style.marginBottom = '20px';
fontWeightCheckbox.style.width = '20px';
fontWeightCheckbox.style.height = '20px';

// Label for the font weight checkbox
const fontWeightLabel = document.createElement('label');
fontWeightLabel.textContent = 'Bold Font';
fontWeightLabel.style.marginLeft = '5px';
fontWeightLabel.style.userSelect = 'none';

// Create a checkbox for bold titles
const boldTitlesCheckbox = document.createElement('input');
boldTitlesCheckbox.type = 'checkbox';
boldTitlesCheckbox.style.marginLeft = '10px';
boldTitlesCheckbox.style.marginBottom = '20px';
boldTitlesCheckbox.style.width = '20px';
boldTitlesCheckbox.style.height = '20px';

// Label for the bold titles checkbox
const boldTitlesLabel = document.createElement('label');
boldTitlesLabel.textContent = 'Bold Titles';
boldTitlesLabel.style.marginLeft = '5px';
boldTitlesLabel.style.userSelect = 'none';

// Create a checkbox for PfP display
const pfPCheckbox = document.createElement('input');
pfPCheckbox.type = 'checkbox';
pfPCheckbox.style.marginLeft = '10px';
pfPCheckbox.style.marginBottom = '20px';
pfPCheckbox.style.width = '20px';
pfPCheckbox.style.height = '20px';

// Label for the PfP checkbox
const pfPLabel = document.createElement('label');
pfPLabel.textContent = 'Mobile PfP';
pfPLabel.style.marginLeft = '5px';
pfPLabel.style.userSelect = 'none';

// Load saved settings from local storage
const savedFontWeight = localStorage.getItem('fontWeight_color') || '300';
const savedBoldTitles = localStorage.getItem('boldTitles') || 'normal';
const savedPfPDisplay = localStorage.getItem('showMobilePfP') || 'none';
fontWeightCheckbox.checked = savedFontWeight === '400';
boldTitlesCheckbox.checked = savedBoldTitles === 'bold';
pfPCheckbox.checked = savedPfPDisplay === 'block';

// Function to apply the selected font weight and display settings
function applyFontWeight(weight, titlesWeight) {
  document.documentElement.style.setProperty('--font-weight', weight);

  // Update CSS dynamically
  let css = `
    p[node='[object Object]'], p, textarea, button, div.text-sm {
      font-weight: ${weight} !important;
    }
  `;

  // Add CSS for bold titles
  css += `
    .mx-2.flex.flex-row.items-center.gap-2.font-light .text-small:not(.text-muted-foreground) {
      font-weight: ${titlesWeight} !important;
    }
  `;

  // Add CSS for PfP display
css += `
    @media (max-width: 767px) {
.mt-0.hidden.md\\:flex.flex-col.gap-3.items-center {
    display: ${savedPfPDisplay};
}
}
`;

  // Remove existing style element if any
  let existingStyle = document.getElementById('dynamicFontWeightStyle');
  if (existingStyle) existingStyle.remove();

  // Apply the new style
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.id = 'dynamicFontWeightStyle';
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

// Apply initial settings based on saved preferences
applyFontWeight(savedFontWeight, savedBoldTitles);

// Event listener for font weight checkbox
fontWeightCheckbox.addEventListener('change', () => {
  const weight = fontWeightCheckbox.checked ? '400' : '300';
  localStorage.setItem('fontWeight_color', weight);
  applyFontWeight(weight, boldTitlesCheckbox.checked ? 'bold' : 'normal');
});

// Event listener for bold titles checkbox
boldTitlesCheckbox.addEventListener('change', () => {
  const titlesWeight = boldTitlesCheckbox.checked ? 'bold' : 'normal';
  localStorage.setItem('boldTitles', titlesWeight);
  applyFontWeight(fontWeightCheckbox.checked ? '400' : '300', titlesWeight);
});

// Event listener for PfP checkbox
pfPCheckbox.addEventListener('change', () => {
  const displayValue = pfPCheckbox.checked ? 'block' : 'none';
  localStorage.setItem('showMobilePfP', displayValue);
  applyFontWeight(fontWeightCheckbox.checked ? '400' : '300', boldTitlesCheckbox.checked ? 'bold' : 'normal');
});

// Function to make text-small elements bold under a specific parent, except text-muted-foreground
function makeTextSmallBold(weight) {
  const parents = document.querySelectorAll('.mx-2.flex.flex-row.items-center.gap-2.font-light');

  parents.forEach(parent => {
    const textSmallElements = parent.querySelectorAll('.text-small:not(.text-muted-foreground)');
    textSmallElements.forEach(element => {
      element.style.fontWeight = weight;
    });
  });
}

// Apply saved settings on page load
applyFontWeight(savedFontWeight);
makeTextSmallBold(savedBoldTitles);

// Event listener for font weight checkbox
fontWeightCheckbox.addEventListener('change', function () {
  const selectedFontWeight = fontWeightCheckbox.checked ? '400' : '300';
  localStorage.setItem('fontWeight_color', selectedFontWeight);
  applyFontWeight(selectedFontWeight);
});

// Event listener for bold titles checkbox
boldTitlesCheckbox.addEventListener('change', function () {
  const boldTitleWeight = boldTitlesCheckbox.checked ? 'bold' : 'normal';
  localStorage.setItem('boldTitles', boldTitleWeight);
  makeTextSmallBold(boldTitleWeight);
});



// ============== END FONT WEIGHT


// Add event listener to save the selected font to local storage and apply it
fontDropdown.addEventListener('change', function () {
  const selectedFont = fontDropdown.value;
  localStorage.setItem('selected_font', selectedFont);

  // Apply the selected font to the document
  document.documentElement.style.setProperty('--font-family', selectedFont);

  // Update CSS dynamically
  const css = `
    p[node='[object Object]'], p, textarea, button, div.text-sm {
      font-family: '${selectedFont}', sans-serif !important;
    }
  `;

  // Apply the new style
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);

//  alert('Font changed to ' + fontDropdown.options[fontDropdown.selectedIndex].text);
});

// Append the button and dropdowns to the panel
panel.appendChild(fontSelectorButton);
panel.appendChild(fontDropdown);
panel.appendChild(fontSizeDropdown);
// Append the checkbox and label to the document
panel.appendChild(document.createElement('br'));
// Append the label and dropdown to the document
panel.appendChild(dimensionLabel);
panel.appendChild(dimensionInput);
panel.appendChild(pfPCheckbox);
panel.appendChild(pfPLabel);
panel.appendChild(document.createElement('br'));
// Append the checkboxes and labels to the document
panel.appendChild(fontWeightCheckbox);
panel.appendChild(fontWeightLabel);
panel.appendChild(boldTitlesCheckbox);
panel.appendChild(boldTitlesLabel);







    // Custom word list input
    const wordListInput = document.createElement('input');
    wordListInput.type = 'text';
    wordListInput.placeholder = 'Separate words with commas';
    wordListInput.style.width = '250px';
    wordListInput.style.height = '35px';
    wordListInput.style.borderRadius = '3px';
    wordListInput.style.marginBottom = '10px';
    panel.appendChild(wordListInput);
    panel.appendChild(document.createElement('br'));

    const wordListContainer = document.createElement('div');
    wordListContainer.style.display = 'flex';
    wordListContainer.style.flexWrap = 'wrap';
    wordListContainer.style.maxWidth = '300px'; // Set a fixed maximum width for the container

    // Display custom word list buttons
    const wordListArray = JSON.parse(localStorage.getItem('wordlist_cc')) || [];
    const wordListButtons = [];

function createWordButton(word) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const removeSymbol = isMobile ? '×' : '🞮';

    const wordButton = createButton(`${word} ${removeSymbol}`, function() {
        // Remove the word from the list and update the panel
        const index = wordListArray.indexOf(word);
        if (index !== -1) {
            wordListArray.splice(index, 1);
            updateWordListButtons();
        }
    });

// Word Buttons
    wordButton.style.borderRadius = '3px';
    wordButton.style.border = 'none';
if (currentTheme === 'dark') {
    wordButton.style.backgroundColor = '#26272B';
} else {
    wordButton.style.backgroundColor = '#E4E4E7';
}
    wordButton.style.marginBottom = '5px';
    wordButton.style.marginRight = '5px';
    wordButton.style.fontSize = '16px';
    wordButton.classList.add('word-button');
    return wordButton;
}

    function updateWordListButtons() {
        wordListContainer.innerHTML = ''; // Clear the container
        wordListArray.forEach(word => {
            const wordButton = createWordButton(word);
            wordListContainer.appendChild(wordButton);
        });
    }





updateWordListButtons();

// Add Words button
const addWordsButton = document.createElement('button');
addWordsButton.textContent = 'Add';
addWordsButton.style.marginTop = '-8px';
addWordsButton.style.marginLeft = '5px';
addWordsButton.style.borderRadius = '3px';
addWordsButton.style.border = 'none';
if (currentTheme === 'dark') {
addWordsButton.style.backgroundColor = '#26272B';
} else {
addWordsButton.style.backgroundColor = '#E4E4E7';
}
addWordsButton.addEventListener('click', function() {
    // Get the input value, split into words, and add to wordListArray
    const wordListValue = wordListInput.value;
const newWords = wordListValue.split(',').map(word => word.trim().toLowerCase()).filter(word => word !== ''); // Convert to lowercase and remove empty entries
    wordListArray.push(...newWords);

    // Update the word list buttons in the panel
    updateWordListButtons();
});

// Create a div to group the input and button on the same line
const inputButtonContainer = document.createElement('div');
inputButtonContainer.style.display = 'flex';
inputButtonContainer.style.alignItems = 'center';

inputButtonContainer.appendChild(wordListInput);
inputButtonContainer.appendChild(addWordsButton);

// Append the container to the panel
panel.appendChild(inputButtonContainer);
    panel.appendChild(wordListContainer);
// Create initial word list buttons
updateWordListButtons();


// OK button
const okButton = document.createElement('button');
okButton.textContent = 'Confirm';
okButton.style.marginTop = '-20px';
okButton.style.width = '75px';
okButton.style.height = '35px';
okButton.style.marginRight = '5px';
okButton.style.borderRadius = '3px';
okButton.style.border = 'none';
if (currentTheme === 'dark') {
    okButton.style.backgroundColor = '#26272B';
} else {
    okButton.style.backgroundColor = '#D9D9DF';
}

okButton.style.position = 'relative';
okButton.style.left = '24%';

okButton.addEventListener('click', function () {
    // Save selected colors to local storage
    categories.forEach(category => {
        const colorPicker = colorPickers[category];
        const transparentCheckbox = transparentCheckboxes[category]; // Access the checkbox from stored references

        // Determine the value to save: color picker value or 'transparent'
        const newValue = transparentCheckbox.checked ? 'transparent' : colorPicker.value;
        const oldValue = localStorage.getItem(`${category}_color`);

        if (oldValue !== newValue) {
            localStorage.setItem(`${category}_color`, newValue);

            // If 'plaintext' color is changed, auto-reload the page
            if (category === 'plaintext' || category === 'guide' || category === 'body' || category === 'input') {
                window.location.reload();
            }
        }
    });

    // Save custom word list to local storage
    const wordListValue = wordListInput.value;
    const newWords = wordListValue.split(',').map(word => word.trim().toLowerCase()).filter(word => word !== ''); // Convert to lowercase and remove empty entries
    const uniqueNewWords = Array.from(new Set(newWords)); // Remove duplicates

    // Check for existing words and add only new ones
    uniqueNewWords.forEach(newWord => {
        if (!wordListArray.includes(newWord)) {
            wordListArray.push(newWord);
        }
    });

    localStorage.setItem('wordlist_cc', JSON.stringify(wordListArray));

    updateWordListButtons();

    // Close the panel
    panel.remove();
});

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.marginTop = '-20px';
    cancelButton.style.borderRadius = '3px';
    cancelButton.style.width = '75px';
    cancelButton.style.marginLeft = '5px';
    cancelButton.style.height = '35px';
    cancelButton.style.border = 'none';
if (currentTheme === 'dark') {
    cancelButton.style.backgroundColor = '#5E5E5E';
} else {
    cancelButton.style.backgroundColor = '#CBD2D4';
}
    cancelButton.style.position = 'relative';
    cancelButton.style.left = '25%';
    cancelButton.addEventListener('click', function() {
        // Close the panel without saving
        panel.remove();
    });

// ==== PRESETS ========
// Create button
const preset1 = document.createElement('button');
preset1.style.marginBottom = '20px';
preset1.style.borderRadius = '3px';
preset1.style.width = '30px';
preset1.style.marginLeft = '5px';
preset1.style.height = '30px';
preset1.style.border = 'none';

// Set image as button background
preset1.style.backgroundImage = "url('https://i.imgur.com/91Z4AwP.png')";
preset1.style.backgroundSize = 'contain';
preset1.style.backgroundRepeat = 'no-repeat';
preset1.style.backgroundPosition = 'center';


// Event listener for button click
preset1.addEventListener('click', function () {

  // Show confirmation dialog
  const userConfirmed = confirm('All colors will be replaced with Discord pallet. Proceed?');



if (userConfirmed) {

  function updateCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
  }
updateCSSVariable('--G850', '#383A40'); //input
updateCSSVariable('--G900', '#313338'); //body
updateCSSVariable('--G950', '#232428'); //guide
    // Hardcode the selected colors to local storage
    const hardcodedColors = {
        'guide': '#232428',
        'input': '#383A40',
        'body': '#313338',
        'charbubble': '#383A40',
        'userbubble': '#41434A',
        'accent': '#3E4047'
    };


localStorage.setItem('ImageSize', '42px');
localStorage.setItem('cpfpPaddingRight', '12px');
localStorage.setItem('upfpPaddingLeft', '8px');
localStorage.setItem('cpfpPaddingTop', '0px');
localStorage.removeItem('charbubbleMarginTop_color');
localStorage.removeItem('charbubbleMarginLeft_color');
localStorage.setItem('removeTitles', 'block');
localStorage.setItem('removeUserImage', 'block');
localStorage.setItem('proseMarginTop', '0.8em');
localStorage.setItem('proseMarginBottom', '0.8em');

    // Save hardcoded values to local storage
    Object.keys(hardcodedColors).forEach(category => {
        const newValue = hardcodedColors[category];
        localStorage.setItem(`${category}_color`, newValue);
    });
                window.location.reload();
}
});

const preset2 = document.createElement('button');
preset2.style.marginBottom = '20px';
preset2.style.borderRadius = '3px';
preset2.style.width = '30px';
preset2.style.marginLeft = '5px';
preset2.style.height = '30px';
preset2.style.border = 'none';

// Set image as button background
preset2.style.backgroundImage = "url('https://i.imgur.com/PSkZ4Yq.png')";
preset2.style.backgroundSize = 'contain';
preset2.style.backgroundRepeat = 'no-repeat';
preset2.style.backgroundPosition = 'center';




// Event listener for button click
preset2.addEventListener('click', function () {
  // Show confirmation dialog
  const userConfirmed = confirm('All colors will be replaced with ChatGPT pallet. Proceed?');

  if (userConfirmed) {
    function updateCSSVariable(variableName, value) {
      document.documentElement.style.setProperty(variableName, value);
    }

    // Update CSS variables with the new values
    updateCSSVariable('--G850', '#2F2F2F'); // input
    updateCSSVariable('--G900', '#212121'); // body
    updateCSSVariable('--G950', '#171717'); // guide

    // Hardcode the selected colors to local storage
    const hardcodedColors = {
      guide: '#171717',
      input: '#2F2F2F',
      body: '#212121',
      charbubble: 'transparent',
      userbubble: '#2F2F2F',
      accent: '#323232',
      charbubbleMarginTop: '-10px',
      charbubbleMarginLeft: '-5px',
      fontWeight: '400'
    };

    // Save hardcoded values to local storage
    Object.keys(hardcodedColors).forEach(category => {
      const newValue = hardcodedColors[category];
      localStorage.setItem(`${category}_color`, newValue);
    });

    // Set the boldTitles variable in local storage to 'bold'
//    localStorage.setItem('boldTitles', 'bold');
localStorage.setItem('removeTitles', 'none');
localStorage.setItem('removeUserImage', 'none');
localStorage.setItem('cpfpPaddingRight', '16px');
localStorage.setItem('cpfpPaddingTop', '14px');
localStorage.setItem('upfpPaddingLeft', '30px');
localStorage.setItem('proseMarginTop', '0.9em');
localStorage.setItem('proseMarginBottom', '0.9em');
localStorage.setItem('ImageSize', '34px');

    // Reload the page to apply changes
    window.location.reload();
  }
});

const preset3 = document.createElement('button');
preset3.style.marginBottom = '20px';
preset3.style.borderRadius = '3px';
preset3.style.width = '30px';
preset3.style.marginLeft = '5px';
preset3.style.height = '30px';
preset3.style.border = 'none';

// Set image as button background
preset3.style.backgroundImage = "url('https://i.imgur.com/wWpHDIj.png')";
preset3.style.backgroundSize = 'contain';
preset3.style.backgroundRepeat = 'no-repeat';
preset3.style.backgroundPosition = 'center';

//    localStorage.setItem('charbubbleMarginTop_color', '-20px');

// Event listener for button click
preset3.addEventListener('click', function () {

  // Show confirmation dialog
  const userConfirmed = confirm('All colors will be replaced with old.character.ai pallet. Proceed?');



if (userConfirmed) {

  function updateCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
  }
updateCSSVariable('--G850', '#2B2C2D'); //input
updateCSSVariable('--G900', '#242525'); //body
updateCSSVariable('--G950', '#2B2C2D'); //guide
    // Hardcode the selected colors to local storage
    const hardcodedColors = {
        guide: '#2B2C2D',
        input: '#2B2C2D',
        body: '#242525',
        charbubble: 'transparent',
        userbubble: '#2B2C2D',
        accent: '#363838',
        charbubbleMarginTop: '-10px',
        charbubbleMarginLeft: '0px'
    };


    localStorage.removeItem('charbubbleMarginTop_color');
    localStorage.removeItem('charbubbleMarginLeft_color');
    localStorage.setItem('removeTitles', 'block');
    localStorage.setItem('removeUserImage', 'block');
    localStorage.setItem('cpfpPaddingRight', '5px');
    localStorage.setItem('cpfpPaddingTop', '0px');
    localStorage.setItem('upfpPaddingLeft', '5px');
    localStorage.setItem('ImageSize', '45px');
    localStorage.setItem('proseMarginTop', '1.0em');
    localStorage.setItem('proseMarginBottom', '1.0em');

    // Save hardcoded values to local storage
    Object.keys(hardcodedColors).forEach(category => {
        const newValue = hardcodedColors[category];
        localStorage.setItem(`${category}_color`, newValue);
    });
                window.location.reload();
}
});


// Create 'resetall' button
const resetAll = document.createElement('button');
resetAll.style.marginBottom = '20px';
resetAll.style.borderRadius = '3px';
resetAll.style.width = '80px'; // Adjust width for text
resetAll.style.marginLeft = '5px';
resetAll.style.height = '30px';
resetAll.style.border = 'none';
resetAll.textContent = 'Reset All'; // Button text

// Add event listener to 'resetall' button
resetAll.addEventListener('click', function () {
  // Reset all colors to their default values
  function resetToDefault() {
    const categories = [
      'italic', 'quotationmarks', 'plaintext', 'custom',
      'charbubble', 'userbubble', 'guide', 'input',
      'body', 'accent'
    ];

    // Set default colors based on the current theme
    categories.forEach(category => {
      const defaultColor = getDefaultColor(category);
      updateCSSVariable(`--${category}`, defaultColor);
      localStorage.setItem(`${category}_color`, defaultColor);
    });

    // Delete additional values from local storage
    localStorage.removeItem('charbubbleMarginTop_color');
    localStorage.removeItem('charbubbleMarginLeft_color');
    localStorage.setItem('removeTitles', 'block');
    localStorage.setItem('removeUserImage', 'block');
    localStorage.setItem('cpfpPaddingRight', '0px');
    localStorage.setItem('cpfpPaddingTop', '0px');
    localStorage.setItem('upfpPaddingLeft', '0px');
    localStorage.setItem('ImageSize', '24px');
    localStorage.setItem('proseMarginTop', '1.25em');
    localStorage.setItem('proseMarginBottom', '1.25em');


    // Reload the page to apply changes
    window.location.reload();
  }

  // Show confirmation dialog
  const resetConfirmed = confirm('This will reset all settings to default. Proceed?');

  if (resetConfirmed) {
    resetToDefault();
  }
});

// Append 'resetall' button to the document


// Function to update CSS variable
function updateCSSVariable(variableName, value) {
  document.documentElement.style.setProperty(variableName, value);
}


    panel.appendChild(document.createElement('br'));


panel.appendChild(preset1);
panel.appendChild(preset2);
panel.appendChild(preset3);
panel.appendChild(resetAll);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(okButton);
    panel.appendChild(cancelButton);

    document.body.appendChild(panel);
}


// Function to get the default color for a category
function getDefaultColor(category) {
const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
if (currentTheme === 'dark') {
    const defaultColors = {
        'italic': '#FFFFFF',
        'quotationmarks': '#FFFFFF',
        'plaintext': '#FFFFFF',
        'custom': '#FFFFFF',
        'charbubble': '#26272B',
        'userbubble': '#303136',
        'guide': '#131316',
        'input': '#202024',
        'body': '#18181B',
        'accent': '#26272B'
    };
    return defaultColors[category];
}
 else {
    const defaultColors = {
        'italic': '#000000',
        'quotationmarks': '#000000',
        'plaintext': '#000000',
        'custom': '#000000',
        'charbubble': '#E4E4E7',
        'userbubble': '#D9D9DF',
        'guide': '#FAFAFA',
        'input': '#F4F4F5',
        'body': '#ECECEE',
        'accent': '#26272B'
};
    return defaultColors[category];
}
}


// Retrieve saved position from local storage
var storedTop = localStorage.getItem('buttonTop') || '50%';
var storedLeft = localStorage.getItem('buttonLeft') || '50%';

const mainButton = createButton('', function() {
    const colorPanelExists = document.getElementById('colorPanel');
    if (!colorPanelExists) {
        createColorPanel();
    }
});

// Create a new button element for the main function
//var mainButton = document.createElement('button');
mainButton.id = 'mainButton';
mainButton.style.position = 'fixed';
mainButton.style.zIndex = '9999';
mainButton.style.top = '5px';
mainButton.style.right = '120px';
//mainButton.style.transform = 'translateX(10%)';
mainButton.style.borderRadius = '50%';
mainButton.style.width = "35px";
mainButton.style.height = "35px";
mainButton.style.backgroundImage = "url('https://i.imgur.com/yBgJ3za.png')";
mainButton.style.backgroundSize = "cover";

// Function to insert the mainButton into the body of the document
function insertMainButton() {
    document.body.appendChild(mainButton);
}

// Call the function to insert the mainButton into the body
insertMainButton();


console.info('c.ai Text Color Button appended to the top center.');

