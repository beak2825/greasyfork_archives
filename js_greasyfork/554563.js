// ==UserScript==
// @name         Drawaria Game Level 2 - Drawaria Springs
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Level 2: Drawaria Springs. Experience dynamic backgrounds and NPC encounters, including a swimming phase.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/
// @match        https://*.drawaria.online/*
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. LEVEL METADATA AND CONSTANTS ---

    const LEVEL_TITLE = "Drawaria Springs";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-stories-springs.mp3";
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 500;

    // Y position where the bottom of the avatar rests (simulating the ground on the SVG floor)
    const AVATAR_HEIGHT_PX = 64;
    const GROUND_LEVEL_Y = 450;
    const AVATAR_GROUND_Y = GROUND_LEVEL_Y - AVATAR_HEIGHT_PX; // Top position for the avatar image

    const LEVEL_END_X = VIEWBOX_WIDTH + 220; // Trigger for advancing the level (Adjusted from user's input)
    const LEVEL_START_X = 50; // Starting X coordinate

    const DIALOGUE_BOX_ID = 'centered-dialogue-box';
    const NPC_WIDTH_DEFAULT = 100; // Default size for simpler NPC collision

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    // Map 1: Bunny
    const MAP_SVG_1 = `
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient -->
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(102, 204, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Grass Gradient -->
    <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(143, 194, 98);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(160, 210, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#skyGradient)" />

  <!-- 2. Sun (top left) -->
  <circle cx="50" cy="50" r="60" fill="rgb(255, 230, 0)" />

  <!-- 3. Horizon/Distant Grass (behind the ground level) -->
  <rect x="0" y="250" width="800" height="150" fill="rgb(100, 180, 50)" />

  <!-- 4. Main Ground (Green Area) -->
  <rect x="0" y="300" width="800" height="200" fill="url(#grassGradient)" />

  <!-- 5. Path (Asphalt/Stone look) -->
  <!-- Main Path (a large, wavy area leading to the fountain) -->
  <path d="M0 450 H800 V380 C700 350, 600 380, 400 380 C200 380, 100 350, 0 380 Z"
        fill="rgb(150, 160, 170)" opacity="0.6"/>
  <!-- Central Path -->
  <path d="M200 450 Q400 400, 600 450 L600 500 L200 500 Z"
        fill="rgb(180, 190, 200)"/>

  <!-- 6. Trees (Stylized) -->
  <!-- Distant Trees (on the horizon) -->
  <circle cx="500" cy="250" r="40" fill="rgb(67, 133, 1)" />
  <circle cx="650" cy="270" r="50" fill="rgb(67, 133, 1)" />
  <!-- Closer Trees -->
  <rect x="350" y="300" width="15" height="100" fill="rgb(139, 69, 19)" />
  <circle cx="357.5" cy="290" r="80" fill="rgb(85, 170, 0)" />

  <!-- 7. Fountain / Water Feature (Center-right background) -->
  <g transform="translate(500, 300)" opacity="0.8">
    <rect x="-10" y="50" width="20" height="50" fill="rgb(200, 200, 200)" />
    <ellipse cx="0" cy="50" rx="40" ry="10" fill="rgb(180, 180, 180)" />
    <path d="M-10 50 L10 50 L10 30 C10 30, 0 20, -10 30 Z" fill="rgb(200, 200, 200)" />
    <!-- Water effect -->
    <path d="M-5 40 C-10 30, 10 30, 5 40 Q0 30, -5 40" fill="rgb(0, 170, 255)" opacity="0.7"/>
    <path d="M-15 45 C-20 35, 20 35, 15 45 Q0 35, -15 45" fill="rgb(0, 170, 255)" opacity="0.5"/>
  </g>

  <!-- 8. Bushes/Flowers (Placeholder detail) -->
  <g transform="translate(150, 420)">
    <circle cx="0" cy="0" r="20" fill="rgb(85, 170, 0)" />
    <circle cx="10" cy="-5" r="5" fill="white" />
    <circle cx="-10" cy="5" r="5" fill="pink" />
  </g>
  <g transform="translate(680, 420)">
    <circle cx="0" cy="0" r="25" fill="rgb(67, 133, 1)" />
    <circle cx="5" cy="5" r="4" fill="yellow" />
    <circle cx="-10" cy="-5" r="4" fill="white" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>
`;

    // Map 2: Donkey
    const MAP_SVG_2 = `
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient (Same as Map 1) -->
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(102, 204, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Grass Gradient (Same as Map 1) -->
    <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(143, 194, 98);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(160, 210, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#skyGradient)" />

  <!-- 2. Sun (top left) -->
  <circle cx="50" cy="50" r="60" fill="rgb(255, 230, 0)" />

  <!-- 3. Horizon/Distant Grass (behind the ground level) -->
  <rect x="0" y="250" width="800" height="150" fill="rgb(100, 180, 50)" />

  <!-- 4. Main Ground (Green Area) -->
  <rect x="0" y="300" width="800" height="200" fill="url(#grassGradient)" />

  <!-- 5. Path (Slightly different shape for change) -->
  <!-- Main Path -->
  <path d="M0 450 H800 V400 Q700 370, 400 400 Q100 430, 0 400 Z"
        fill="rgb(160, 170, 180)" opacity="0.7"/>
  <!-- Central Path Segment -->
  <rect x="150" y="400" width="500" height="100" fill="rgb(190, 200, 210)"/>

  <!-- 6. Trees (Different positions/shapes) -->
  <!-- Large Tree 1 (Left) -->
  <rect x="100" y="300" width="15" height="100" fill="rgb(139, 69, 19)" />
  <rect x="60" y="250" width="100" height="100" fill="rgb(85, 170, 0)" rx="20" ry="20" />

  <!-- Large Tree 2 (Right) -->
  <rect x="650" y="300" width="15" height="100" fill="rgb(139, 69, 19)" />
  <circle cx="657.5" cy="270" r="70" fill="rgb(67, 133, 1)" />

  <!-- 7. Small Pond / Spring (New Feature) -->
  <g transform="translate(400, 400)">
    <ellipse cx="0" cy="50" rx="60" ry="20" fill="rgb(0, 150, 200)" />
    <path d="M-50 50 Q0 30, 50 50" stroke="white" stroke-width="2" fill="none" opacity="0.6"/>
  </g>

  <!-- 8. Bushes/Flowers (Placeholder detail) -->
  <g transform="translate(250, 420)">
    <circle cx="0" cy="0" r="25" fill="rgb(85, 170, 0)" />
    <rect x="-15" y="-15" width="30" height="30" fill="pink" rx="5" ry="5" opacity="0.5"/>
  </g>
  <g transform="translate(550, 420)">
    <circle cx="0" cy="0" r="20" fill="rgb(67, 133, 1)" />
    <polygon points="-10,5 0,-10 10,5" fill="yellow" opacity="0.7"/>
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 (for reference, remove in final script if needed) -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>
`;

    // Map 3: Transition
    const MAP_SVG_3 = `
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient (Slightly cooler/cloudy) -->
    <linearGradient id="cloudySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 200, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 220, 230);stop-opacity:1" />
    </linearGradient>
    <!-- Grass Gradient (More muted green) -->
    <linearGradient id="mutedGrassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 160, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(140, 180, 100);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#cloudySkyGradient)" />

  <!-- 2. Sun/Moon (Clouded over) -->
  <circle cx="50" cy="50" r="60" fill="rgb(255, 255, 180)" opacity="0.6" />

  <!-- 3. Clouds (Flat White Style) -->
  <g fill="white" opacity="0.7">
    <ellipse cx="200" cy="120" rx="60" ry="20" />
    <ellipse cx="600" cy="80" rx="80" ry="30" />
  </g>

  <!-- 4. Horizon/Distant Grass -->
  <rect x="0" y="250" width="800" height="150" fill="rgb(80, 140, 40)" />

  <!-- 5. Main Ground (Muted Green Area) -->
  <rect x="0" y="300" width="800" height="200" fill="url(#mutedGrassGradient)" />

  <!-- 6. Simple Path (Straight line across) -->
  <rect x="0" y="420" width="800" height="80" fill="rgb(150, 160, 170)" opacity="0.8"/>

  <!-- 7. Trees (Minimalist, Silhouette style) -->
  <!-- Tree 1 (Left) -->
  <rect x="250" y="300" width="10" height="120" fill="rgb(100, 50, 10)" />
  <circle cx="255" cy="280" r="60" fill="rgb(60, 120, 30)" />

  <!-- Tree 2 (Right) -->
  <rect x="550" y="300" width="10" height="100" fill="rgb(100, 50, 10)" />
  <circle cx="555" cy="270" r="50" fill="rgb(80, 160, 40)" />

  <!-- 8. Single Rock/Stone Detail (Path detail) -->
  <ellipse cx="400" cy="450" rx="40" ry="15" fill="rgb(130, 130, 130)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 (for reference, remove in final script if needed) -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>
`;

    // Map 4: Happy Face + Fish (Swimming starts)
    const MAP_SVG_4 = `
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient (A bit darker due to water reflection/depth) -->
    <linearGradient id="deepSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 150, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 180, 220);stop-opacity:1" />
    </linearGradient>
    <!-- Deep Water Gradient -->
    <linearGradient id="waterDeepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 120, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 80, 150);stop-opacity:1" />
    </linearGradient>
    <!-- Water Surface Effect (for movement illusion) -->
    <filter id="waveFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" result="turbulence"/>
      <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#deepSkyGradient)" />

  <!-- 2. Sun (Still present, but reflecting off water) -->
  <circle cx="50" cy="50" r="60" fill="rgb(255, 230, 0)" opacity="0.8" />

  <!-- 3. Horizon Land (Small strip of land far away) -->
  <rect x="0" y="250" width="800" height="10" fill="rgb(50, 100, 30)" />

  <!-- 4. Deep Water Body (Starts at 260px and fills the remaining screen) -->
  <rect x="0" y="260" width="800" height="240" fill="url(#waterDeepGradient)" filter="url(#waveFilter)" />

  <!-- 5. Water Surface Highlights (Foam/Light Reflection) -->
  <path d="M0 260 Q100 250, 200 260 T400 255 T600 260 T800 250"
        fill="none"
        stroke="white"
        stroke-width="3"
        opacity="0.5" />
  <path d="M0 270 Q150 265, 300 270 T600 265 T800 270"
        fill="none"
        stroke="rgb(180, 230, 255)"
        stroke-width="5"
        opacity="0.7" />

  <!-- 6. Underwater Plants/Shadows (Simple shape on the 'ground' at Y=450) -->
  <rect x="0" y="450" width="800" height="50" fill="rgb(0, 60, 100)" />
  <g fill="rgb(0, 100, 150)" opacity="0.8">
    <path d="M100 450 V430 Q110 420, 120 430 V450 Z" />
    <path d="M600 450 V410 Q620 400, 640 410 V450 Z" />
  </g>

  <!-- NOTE: The 'ground' for the player is still AVATAR_GROUND_Y (386), but movement logic will handle the swimming effect and preventing sinking past 450 (which is the actual floor of the SVG). -->
</svg>
`;

    // Map 5: Fish (Swimming ends)
    const MAP_SVG_5 = `
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient (Back to bright and sunny) -->
    <linearGradient id="brightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(102, 204, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Grass Gradient (Back to lively green) -->
    <linearGradient id="livelyGrassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(143, 194, 98);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(160, 210, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#brightSkyGradient)" />

  <!-- 2. Sun (top left) -->
  <circle cx="50" cy="50" r="60" fill="rgb(255, 230, 0)" />

  <!-- 3. Horizon/Distant Grass -->
  <rect x="0" y="250" width="800" height="150" fill="rgb(100, 180, 50)" />

  <!-- 4. Main Ground (Lively Green Area) -->
  <rect x="0" y="300" width="800" height="200" fill="url(#livelyGrassGradient)" />

  <!-- 5. Path (Muddy/Washed out) -->
  <path d="M0 450 H800 V400 Q700 370, 400 400 Q100 430, 0 400 Z"
        fill="rgb(130, 90, 60)" opacity="0.9"/>
  <!-- Central Path Segment (Muddy) -->
  <rect x="150" y="400" width="500" height="100" fill="rgb(140, 100, 70)" opacity="0.7"/>

  <!-- 6. Trees (Scattered) -->
  <!-- Tree 1 (Center) -->
  <rect x="390" y="300" width="10" height="100" fill="rgb(139, 69, 19)" />
  <circle cx="395" cy="270" r="60" fill="rgb(85, 170, 0)" />

  <!-- Tree 2 (Far Right) -->
  <rect x="700" y="350" width="10" height="50" fill="rgb(139, 69, 19)" />
  <circle cx="705" cy="330" r="40" fill="rgb(67, 133, 1)" />

  <!-- 7. Puddles / Remnants of the flood (Water spots on the ground) -->
  <g opacity="0.9" fill="rgb(0, 140, 200)">
    <ellipse cx="100" cy="460" rx="40" ry="10" />
    <ellipse cx="500" cy="470" rx="80" ry="20" />
  </g>

  <!-- 8. Debris / Rocks (A few scattered elements) -->
  <rect x="250" y="440" width="20" height="10" fill="rgb(100, 100, 100)" rx="2" ry="2"/>
  <rect x="750" y="430" width="15" height="15" fill="rgb(120, 120, 120)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>
`;

    // Map 6: Circle Fairy
    const MAP_SVG_6 = `
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Ethereal Sky Gradient (Soft light, spiritual/magical feeling) -->
    <linearGradient id="etherealSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 220, 240);stop-opacity:1" />
    </linearGradient>
    <!-- Crystal Water Gradient (Very light, clear blue/green) -->
    <linearGradient id="crystalWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 200, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 230, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Ground Stone Gradient -->
    <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 190, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(160, 170, 180);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Ethereal) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#etherealSkyGradient)" />

  <!-- 2. Light Source (Subtle Glow at the top) -->
  <circle cx="400" cy="0" r="150" fill="white" opacity="0.3" />

  <!-- 3. Ground (Stone/Rock Formation) -->
  <rect x="0" y="300" width="800" height="200" fill="url(#stoneGradient)" />

  <!-- 4. Main Spring Pool (Center) -->
  <ellipse cx="400" cy="420" rx="300" ry="80" fill="url(#crystalWaterGradient)" />
  <ellipse cx="400" cy="420" rx="280" ry="60" fill="rgb(200, 230, 255)" opacity="0.8" />

  <!-- 5. Floating Rock Platform (Platform for the Fairy/Avatar) -->
  <ellipse cx="400" cy="380" rx="150" ry="30" fill="rgb(150, 160, 170)" stroke="rgb(120, 130, 140)" stroke-width="2" />

  <!-- 6. Waterfall/Spring Source (Behind the platform) -->
  <g transform="translate(400, 300)">
    <!-- Rock Cliff behind -->
    <path d="M-100 0 L100 0 L50 -50 L-50 -50 Z" fill="rgb(150, 160, 170)" />
    <!-- Water flowing down -->
    <rect x="-10" y="0" width="20" height="50" fill="rgb(180, 230, 255)" opacity="0.9" />
    <circle cx="0" cy="40" r="15" fill="rgb(180, 230, 255)" opacity="0.7" />
  </g>

  <!-- 7. Ethereal Details (Glowing Dust/Particles) -->
  <g fill="white" opacity="0.5">
    <circle cx="100" cy="350" r="3" />
    <circle cx="700" cy="320" r="5" />
    <circle cx="450" cy="150" r="2" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>
`;

    const BACKGROUND_SVGS = [MAP_SVG_1, MAP_SVG_2, MAP_SVG_3, MAP_SVG_4, MAP_SVG_5, MAP_SVG_6];

    // Character SVG Placeholders (Used in NPC_DATA)
    // ESTE BLOCO FOI MOVIDO AQUI PARA CORRIGIR O ERRO DE INICIALIZAÇÃO.
    const CHAR_SVG_1 = `
<svg height="100" inkscape:export-xdpi="96" inkscape:export-ydpi="96" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 335 372" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title></title>
    <defs/>
    <sodipodi:namedview bordercolor="#666666" borderlayer="true" inkscape:document-units="px" inkscape:pagecheckerboard="true" pagecolor="#ffffff"/>
    <metadata>
        <rdf:RDF>
            <cc:Work>
                <dc:format>image/svg+xml</dc:format>
                <dc:type rdf:resource="http://purl.org/dc/dcmitype/MovingImage"/>
                <dc:title></dc:title>
            </cc:Work>
        </rdf:RDF>
    </metadata>
    <g id="Composition_3b348df703d247509adcbb148276fd71" inkscape:groupmode="layer" inkscape:label="Composition">
        <g id="Layer_f89b4aa40f09491ea955b3f71169edc3" inkscape:groupmode="layer" inkscape:label="Layer" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
            <g id="Layer_06253d48be0743fca0afe5a80cfd0935" inkscape:groupmode="layer" inkscape:label="Composition" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                <g id="Layer_ce4951eafaf041cdad10e7b351f77924" inkscape:groupmode="layer" inkscape:label="Layer" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Layer_105e27e2e1bd4cb89ea348b38be4761e" inkscape:groupmode="layer" inkscape:label="Composition" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Layer_8d2b3f04b8bd457db0d979101738097b" inkscape:groupmode="layer" inkscape:label="Layer" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                            <g transform="translate(0.742122 -2.59323)">
                                <g transform="rotate(0)">
                                    <g transform="scale(1 1)">
                                        <g transform="translate(0 0)">
                                            <g id="Group_c11d310f92d34050a69ae77b259cae2b" inkscape:label="Group" opacity="1">
                                                <g id="Group_19b08b05600449c1859324282fc00861" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <g id="Group_97bcad9baf7f48b7884a94210e8da1da" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Group_322497cbbbea40d0adef43fe3f4de7a6" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                            <g id="Group_988aeebb09514b7e91cb4cb6919d0cb0" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                <g id="Group_d3d28a0b81914eecabd8ac325362bac5" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#ffffff" fill-opacity="1" id="Fill_d9e881ec4b27498d872aee1b55e9782a" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <path d="M 54.544,326.688 C 60.002,333.056 58.432,343.354 51.039,349.692 43.645,356.029 33.227,356.005 27.77,349.638 23.784,344.987 23.546,338.24 26.589,332.469 15.022,330.992 6.349,324.855 6.35,317.508 6.35,309.15 17.573,302.358 31.513,302.21 23.678,294.343 20.611,284.86 24.71,280.024 29.236,274.685 40.783,277.037 50.5,285.276 60.217,293.514 64.425,304.52 59.9,309.858 58.919,311.015 57.609,311.81 56.059,312.263 57.059,313.899 57.604,315.665 57.604,317.508 57.604,320.525 56.141,323.339 53.615,325.71 53.939,326.017 54.249,326.344 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 Z" sodipodi:nodetypes="ccccccccccccccc" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_5ee23d8728254302ac03455fa09feff9" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_4b513cc7dbdc40d3b6e41680c530f7d3" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <path d="M 54.544,326.688 C 60.002,333.056 58.432,343.354 51.039,349.692 43.645,356.029 33.227,356.005 27.77,349.638 23.784,344.987 23.546,338.24 26.589,332.469 15.022,330.992 6.349,324.855 6.35,317.508 6.35,309.15 17.573,302.358 31.513,302.21 23.678,294.343 20.611,284.86 24.71,280.024 29.236,274.685 40.783,277.037 50.5,285.276 60.217,293.514 64.425,304.52 59.9,309.858 58.919,311.015 57.609,311.81 56.059,312.263 57.059,313.899 57.604,315.665 57.604,317.508 57.604,320.525 56.141,323.339 53.615,325.71 53.939,326.017 54.249,326.344 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 54.544,326.688 Z" sodipodi:nodetypes="ccccccccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="1.266667" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.225564; 0.582707" path="M 0,0 C 0,0 3.1686,7.92151 3.1686,7.92151 3.1686,7.92151 -1.5843,-12.6744 -1.5843,-12.6744" repeatCount="indefinite"/>
                            </g>
                            <g id="Group_a817a4359fd04737b862e1a02fab8966" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_ba6bec609a564f2bb893c2f30130a168" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#d8d8d8" fill-opacity="1" id="Fill_ecff1d9892834882a80b8e3ba4a0a5b6" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <path d="M 166.646,199.831 C 228.192,199.831 278.546,220.285 282.441,257.234 282.441,257.234 283.521,266.018 283.521,266.018 283.521,266.018 283.239,344.838 283.239,344.838 283.239,344.838 49.489,344 49.489,344 49.489,344 49.771,265.181 49.771,265.181 49.771,265.181 49.561,255.018 49.561,255.018 54.114,218.461 105.561,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 Z" sodipodi:nodetypes="cccccccccc" style="stroke:none;"/>
                                    </g>
                                </g>
                                <g id="Group_904edabb1bc54bfaa94132e4f88728b1" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_e077810fc403405a8e635755be2d2e85" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <path d="M 166.646,199.831 C 228.192,199.831 278.546,220.285 282.441,257.234 282.441,257.234 283.521,266.018 283.521,266.018 283.521,266.018 283.239,344.838 283.239,344.838 283.239,344.838 49.489,344 49.489,344 49.489,344 49.771,265.181 49.771,265.181 49.771,265.181 49.561,255.018 49.561,255.018 54.114,218.461 105.561,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 166.646,199.831 Z" sodipodi:nodetypes="cccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                    </g>
                                </g>
                            </g>
                            <g id="Group_9b15445a719144808c61bdaeb771eb2d" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_826896392d534d2185a7bb79c8f80a16" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#d8d8d8" fill-opacity="1" id="Fill_c98133210e164385a364ef86a9c90436" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <path d="M 261.752,153.846 C 261.752,198.69 220.616,235.043 169.872,235.043 119.128,235.043 77.992,198.69 77.992,153.846 77.992,132.678 87.158,113.403 102.173,98.949 92.827,93.879 80.272,81.265 68.994,64.724 52.061,39.888 44.419,15.605 51.925,10.487 59.432,5.368 79.245,21.353 96.179,46.189 106.991,62.046 114.015,77.677 115.727,88.239 130.911,78.436 149.627,72.649 169.872,72.649 220.616,72.649 261.752,109.002 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 Z" sodipodi:nodetypes="cccccccccccc" style="stroke:none;"/>
                                    </g>
                                </g>
                                <g id="Group_b5e85e91528a4bf6a73102963f87c101" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_e22a944b365746e7854b40823d0ff5c7" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <path d="M 261.752,153.846 C 261.752,198.69 220.616,235.043 169.872,235.043 119.128,235.043 77.992,198.69 77.992,153.846 77.992,132.678 87.158,113.403 102.173,98.949 92.827,93.879 80.272,81.265 68.994,64.724 52.061,39.888 44.419,15.605 51.925,10.487 59.432,5.368 79.245,21.353 96.179,46.189 106.991,62.046 114.015,77.677 115.727,88.239 130.911,78.436 149.627,72.649 169.872,72.649 220.616,72.649 261.752,109.002 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 261.752,153.846 Z" sodipodi:nodetypes="cccccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                    </g>
                                </g>
                            </g>
                            <g transform="translate(-56.5339 11.5967)">
                                <g transform="rotate(0)">
                                    <g transform="scale(1 1)">
                                        <g transform="translate(0 0)">
                                            <g id="Group_8b8f0c8daf294c188120396a572b5ec2" inkscape:label="Group" opacity="1">
                                                <g id="Group_fdc0c25769d24ea18e307f730be0a11e" inkscape:label="Group" opacity="1" transform="matrix(0.999953, 0.009708, -0.009708, 0.999953, 0, 0)">
                                                    <g id="Group_e8d6b769ae064667a9a96af8f1fa9dad" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Group_709afbd9e7734423a8a078c260834016" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                            <g id="Group_0e6d20c33b994df6a86fcafd58a507c4" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                <g id="Group_83ca5113693145d697a9cde547289e0e" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#d8d8d8" fill-opacity="1" id="Fill_b1b7d1b29665495298cdf3c63ec1cc44" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="163.64" cy="260.741" rx="43.149" ry="18.781" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_e3d594d8f73c4d7bba89bc0d28c0e959" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_920644652155466ca9e5c971e7ff8197" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="163.64" cy="260.741" rx="43.149" ry="18.781" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="1.266667" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.263158; 0.939850" path="M -56.5339,4.80176 C -56.5339,4.80176 -56.5339,14.3076 -56.5339,14.3076 -56.5339,14.3076 -56.5339,1.63316 -56.5339,1.63316" repeatCount="indefinite"/>
                            </g>
                            <g transform="translate(65.5831 12.6811)">
                                <g transform="rotate(0)">
                                    <g transform="scale(1 1)">
                                        <g transform="translate(0 0)">
                                            <g id="Group_54ff47c2c7ba4f30bf8d425cec822d57" inkscape:label="Group" opacity="1">
                                                <g id="Group_290b7c3e46c548bab3ead00bdd8fe2e3" inkscape:label="Group" opacity="1" transform="matrix(0.999953, 0.009708, -0.009708, 0.999953, 0, 0)">
                                                    <g id="Group_0a97f6b606f04aacb20c0e6792f0aab9" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 0.994765, 0, 0)">
                                                        <g id="Group_4a97324b0139428a856d3bb562a4c660" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                            <g id="Group_368cbd7bf93e465ab843249fcfab1eca" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                <g id="Group_30df7185902d4bf2bf336153ebe6fbed" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#d8d8d8" fill-opacity="1" id="Fill_721b3741bdda44049d6ec3548ac01b22" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="163.64" cy="260.741" rx="43.149" ry="18.781" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_a57a18475af24d35a23c5f615353ea0f" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_92e99f8a9d724c4cb9b9ebdd0df90fc2" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="163.64" cy="260.741" rx="43.149" ry="18.781" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="1.266667" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.263158; 0.939850" path="M 65.2442,2.83642 C 65.2442,2.83642 65.2442,12.3422 65.2442,12.3422 65.2442,12.3422 66.8285,13.9265 66.8285,13.9265" repeatCount="indefinite"/>
                            </g>
                        </g>
                    </g>
                </g>
                <g transform="translate(-0.45549 -2.36654)">
                    <g transform="rotate(0)">
                        <g transform="scale(1 1)">
                            <g transform="translate(0 0)">
                                <g id="Group_6f8a0c8d361847a3aee1bda89b2564b4" inkscape:label="Group" opacity="1">
                                    <g id="Group_44c67ba420b2499b9a0247fdb1dd8761" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_bc4398fee49b4a4ab9fdbfc3ae733c11" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_83be4fea5ebb48fb97b0a292b8dec3c0" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_58906da86c04469e9e3d32134d429ada" inkscape:label="Group 3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <g id="Group_dc55a79ce8c5461c8026c4c6123fd7f9" inkscape:label="Group 2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Group_6d0f9839e5434e56bae2fcac4171325f" inkscape:label="Group 1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                            <g id="Group_1c2a22b7f2df493fa0773ce1108ef628" inkscape:label="Group" opacity="1" transform="matrix(-0.572182, 0.820127, -0.820127, -0.572182, 420.567, -153.161)">
                                                                <g id="Group_febd3542edd64fd6a3d79ef944b72a15" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#d8d8d8" fill-opacity="1" id="Fill_f7c59fbfef964d3eb3ced4e14ea6810e" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <rect height="37.31" ry="0" style="stroke:none;" width="56.016" x="276.709" y="7.639"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_22efb2d8ffed4c4bb2ace465957f739c" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_91c577cf19894f51bc1e875cb35f9460" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <rect height="37.31" ry="0" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;" width="56.016" x="276.709" y="7.639"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_cc2b69fce61d435eaa79389f105c8fff" inkscape:label="Group" opacity="1" transform="matrix(-0.046461, 0.99892, -0.99892, -0.046461, 355.062, -39.5969)">
                                                                <g id="Group_eeaa0b90401743b399bd63b4ef2e5109" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#000000" fill-opacity="1" id="Fill_56279bbb22b74625adb30ac20bdfb8ce" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="186.966" cy="144.765" rx="16.045" ry="10.541" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_f8ef526811d7428ca8bbeb8c93b4062a" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_d1448ed2057745b7bdaadfbe3e39ea68" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="186.966" cy="144.765" rx="16.045" ry="10.541" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_7c67455365204db696b06993a206b500" inkscape:label="Group" opacity="1" transform="matrix(-0.0487231, 0.998812, -0.998812, -0.0487231, 378.341, -21.3985)">
                                                                <g id="Group_6be4535cd6254066a558401c8e52b41c" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#ffffff" fill-opacity="1" id="Fill_a8b8b7ff04ba4fc7b7f709855c771900" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="226.126" cy="200.378" rx="8.308" ry="4.398" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_c8bcef00f35c4cb7971880249a26f50f" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_7d79dc79fbfb4dcf945e3c780f5fd3a7" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="226.126" cy="200.378" rx="8.308" ry="4.398" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_7e0130e71ffa482386e6cddd13188910" inkscape:label="Group" opacity="1" transform="matrix(0.0487231, 0.998812, 0.998812, -0.0487231, -35.4435, -21.2666)">
                                                                <g id="Group_483d6c37651f4cff9a39398c9945c0ff" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#ffffff" fill-opacity="1" id="Fill_284c80f5030147e882d3a871d8862e2a" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="226.126" cy="200.378" rx="8.308" ry="4.398" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_5f2648eaa67c484cb9b56bf1cf31c271" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_a40800f39bbf4105b33dfb00cb97e071" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="226.126" cy="200.378" rx="8.308" ry="4.398" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_80094381f5f6403d9bf319760a515806" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                <g id="Group_34635e7fe44d4a16ad7867f048125cff" inkscape:label="Fill" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Group_0ec1d7b9b0554cd0bc5bda4d5812b475" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_bdcadb875b4c49b291d0a2cc3ce0baa4" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 185.668,171.619 C 185.621,174.833 178.949,177.342 170.765,177.223 162.581,177.105 155.984,174.403 156.031,171.189 156.078,167.975 162.75,165.466 170.934,165.584 179.118,165.703 185.714,168.405 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_32f43a8bbcec4ef2ab4950a29c73c0d6" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_3783a33a5aeb4cdc86e337ae2f15e0c0" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 167.572,189.51 C 164.828,192.169 161.567,193.543 159.177,193.279 156.726,193.96 152.756,192.042 149.533,188.416 145.738,184.147 144.416,179.126 146.581,177.201 148.745,175.278 153.577,177.178 157.373,181.448 157.839,181.973 158.268,182.509 158.658,183.049 159.05,182.569 159.483,182.098 159.952,181.644 163.37,178.333 167.59,177.014 169.932,178.373 170.023,178.261 170.123,178.157 170.231,178.061 172.395,176.138 177.227,178.038 181.023,182.308 181.489,182.833 181.918,183.369 182.308,183.909 182.7,183.429 183.133,182.958 183.602,182.504 187.397,178.828 192.18,177.608 194.284,179.78 196.388,181.952 195.017,186.694 191.222,190.37 188.478,193.029 185.217,194.403 182.827,194.139 180.376,194.82 176.406,192.902 173.183,189.276 172.101,188.059 171.22,186.78 170.563,185.529 169.874,186.884 168.864,188.259 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 Z" sodipodi:nodetypes="cccccccccccccccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_a052a4ee01ac411d90949891a47a0767" inkscape:label="Stroke" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Group_df6c5725025b4c0982b22acf4d376166" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_110f5936a3884db498e259e6250032ba" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 185.668,171.619 C 185.621,174.833 178.949,177.342 170.765,177.223 162.581,177.105 155.984,174.403 156.031,171.189 156.078,167.975 162.75,165.466 170.934,165.584 179.118,165.703 185.714,168.405 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 185.668,171.619 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_7005b6d8c52a46678bdec559e7f69299" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_3c64d1eb5fb746deb1ac02c13f5a3a50" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 167.572,189.51 C 164.828,192.169 161.567,193.543 159.177,193.279 156.726,193.96 152.756,192.042 149.533,188.416 145.738,184.147 144.416,179.126 146.581,177.201 148.745,175.278 153.577,177.178 157.373,181.448 157.839,181.973 158.268,182.509 158.658,183.049 159.05,182.569 159.483,182.098 159.952,181.644 163.37,178.333 167.59,177.014 169.932,178.373 170.023,178.261 170.123,178.157 170.231,178.061 172.395,176.138 177.227,178.038 181.023,182.308 181.489,182.833 181.918,183.369 182.308,183.909 182.7,183.429 183.133,182.958 183.602,182.504 187.397,178.828 192.18,177.608 194.284,179.78 196.388,181.952 195.017,186.694 191.222,190.37 188.478,193.029 185.217,194.403 182.827,194.139 180.376,194.82 176.406,192.902 173.183,189.276 172.101,188.059 171.22,186.78 170.563,185.529 169.874,186.884 168.864,188.259 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 167.572,189.51 Z" sodipodi:nodetypes="cccccccccccccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_6cd0324ae20e4783af49df3ad481bbe5" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                <g id="Group_b0e9e11603b64416b109aa7bc358a1f5" inkscape:label="Fill" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Group_97b9d384ded94e9b8cbbb0d9953ad8ab" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_fbff1b59ac794228ba9eb22afe9bad7b" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 41.346,202.059 C 41.346,202.059 105.448,184.091 105.448,184.091 105.448,184.091 103.632,179.51 103.632,179.51 103.632,179.51 39.53,197.478 39.53,197.478 39.53,197.478 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_d6d3857cc8a6486393766d05ed0d95cd" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_41ff79e91c164916880f2c363ba3dcb1" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 27.259,180.541 C 27.259,180.541 102.045,174.253 102.045,174.253 102.045,174.253 101.495,169.628 101.495,169.628 101.495,169.628 26.709,175.916 26.709,175.916 26.709,175.916 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_551bf9a8c35a45da8ed10b4dfea4a7af" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_c944ba7fbea141e9a5961105b1ebc6ef" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 21.252,160.805 C 21.252,160.805 103.517,162.602 103.517,162.602 103.517,162.602 103.634,158.848 103.634,158.848 103.634,158.848 21.368,157.051 21.368,157.051 21.368,157.051 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_4a334b41a0fe4a7ea1acc4e51384cffb" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_9e2f04f23d3549c1952e44713d23a96d" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 317.624,159.7 C 317.624,159.7 235.358,161.497 235.358,161.497 235.358,161.497 235.473,165.25 235.473,165.25 235.473,165.25 317.739,163.453 317.739,163.453 317.739,163.453 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_ed173f267ba94dfbaa959023a6c61086" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_7b03ae4883464c4eaf7712f133b4d75a" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 312.282,178.57 C 312.282,178.57 237.496,172.281 237.496,172.281 237.496,172.281 236.946,176.907 236.946,176.907 236.946,176.907 311.732,183.195 311.732,183.195 311.732,183.195 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_2e1e5d20bc2c4e99adb6930ba7e4c486" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g fill="#000000" fill-opacity="1" id="Fill_6e76b711865c4a579701656831dabe56" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 299.463,200.131 C 299.463,200.131 235.36,182.165 235.36,182.165 235.36,182.165 233.544,186.746 233.544,186.746 233.544,186.746 297.647,204.713 297.647,204.713 297.647,204.713 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                                                        </g>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_c15141e8cd89498b851269bbc0e3dffd" inkscape:label="Stroke" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Group_8d17e816e43b4ae59d430f142d4b23f9" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_409c9a1ad64a4975b103431ddc820a76" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 41.346,202.059 C 41.346,202.059 105.448,184.091 105.448,184.091 105.448,184.091 103.632,179.51 103.632,179.51 103.632,179.51 39.53,197.478 39.53,197.478 39.53,197.478 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 41.346,202.059 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_74125d0283d84024b0770ca16d6ca920" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_1f1e5429b9fd441cad4e803a5b98d9e1" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 27.259,180.541 C 27.259,180.541 102.045,174.253 102.045,174.253 102.045,174.253 101.495,169.628 101.495,169.628 101.495,169.628 26.709,175.916 26.709,175.916 26.709,175.916 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 27.259,180.541 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_0061d6f2ea20443a8e12dc7a51263f28" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_b1e0a81ee9e64dada837800f19b5246b" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 21.252,160.805 C 21.252,160.805 103.517,162.602 103.517,162.602 103.517,162.602 103.634,158.848 103.634,158.848 103.634,158.848 21.368,157.051 21.368,157.051 21.368,157.051 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 21.252,160.805 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_11b23673d0f749b28dc75afa08188366" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_b4a58ddf429a4f63b2d423362d9c50e6" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 317.624,159.7 C 317.624,159.7 235.358,161.497 235.358,161.497 235.358,161.497 235.473,165.25 235.473,165.25 235.473,165.25 317.739,163.453 317.739,163.453 317.739,163.453 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 317.624,159.7 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_433f79f46e6144e7b3eb8f17a9df8cfd" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_c984453fd63444a08a3120f3012c0991" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 312.282,178.57 C 312.282,178.57 237.496,172.281 237.496,172.281 237.496,172.281 236.946,176.907 236.946,176.907 236.946,176.907 311.732,183.195 311.732,183.195 311.732,183.195 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 312.282,178.57 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                    <g id="Group_dd274086fb2743f6a5150f8edee4f442" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <g id="Stroke_42a263934eec4e7d8e1ec32d05a045fd" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                            <path d="M 299.463,200.131 C 299.463,200.131 235.36,182.165 235.36,182.165 235.36,182.165 233.544,186.746 233.544,186.746 233.544,186.746 297.647,204.713 297.647,204.713 297.647,204.713 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 299.463,200.131 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                        </g>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_b0ce22c1a99840eab39e11e04800cc1d" inkscape:label="Group" opacity="1" transform="matrix(0.046461, 0.99892, 0.99892, -0.046461, -12.4587, -39.9881)">
                                                                <g id="Group_ddd73bba7e0a4a3796ac0bdb3852b95b" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#000000" fill-opacity="1" id="Fill_ad149c72a872432eac16a122449f4255" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="186.966" cy="144.765" rx="16.045" ry="10.541" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_f4158837e18441ab82d68f55532ed05b" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_9171eea9d33641a9a709686ea26f73f2" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="186.966" cy="144.765" rx="16.045" ry="10.541" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <g id="Group_1fd6cdc3c8e74059b53d664c4b4b9440" inkscape:label="Ellipse" opacity="1" transform="matrix(0.946717, -0.322066, 0.322066, 0.946717, -12.8506, 76.7278)">
                                                                <g id="Group_eadc2919f2c44f0a904b22821de79a70" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g fill="#d8d8d8" fill-opacity="1" id="Fill_97da3bd48ddf4ac5b943c7829acd445e" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="242.081" cy="95.6919" rx="19.0116" ry="47.5291" style="stroke:none;"/>
                                                                    </g>
                                                                </g>
                                                                <g id="Group_32aa59b5c892410c9dc106a29e683400" inkscape:label="Group" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                    <g id="Stroke_f714d17b90484c48aa234f0cab92deec" inkscape:label="Group" opacity="1" stroke="#555555" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                                        <ellipse cx="242.081" cy="95.6919" rx="19.0116" ry="47.5291" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="1.266667" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.300752; 0.601504; 0.845865" path="M 0,-3.1686 C 0,-3.1686 -1.5843,1.5843 -1.5843,1.5843 -1.5843,1.5843 1.5843,-9.50581 1.5843,-9.50581 1.5843,-9.50581 -1.5843,-4.75291 -1.5843,-4.75291" repeatCount="indefinite"/>
                </g>
            </g>
        </g>
    </g>
</svg>
`;

    const CHAR_SVG_2 = `
<svg height="200" inkscape:export-xdpi="96" inkscape:export-ydpi="96" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 702 504" width="200" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title></title>
    <defs/>
    <sodipodi:namedview bordercolor="#666666" borderlayer="true" inkscape:document-units="px" inkscape:pagecheckerboard="true" pagecolor="#ffffff"/>
    <metadata>
        <rdf:RDF>
            <cc:Work>
                <dc:format>image/svg+xml</dc:format>
                <dc:type rdf:resource="http://purl.org/dc/dcmitype/MovingImage"/>
                <dc:title></dc:title>
            </cc:Work>
        </rdf:RDF>
    </metadata>
    <g id="Composition_80b48a3ad7244fed85da2b3c7238eb55" inkscape:groupmode="layer" inkscape:label="Composition">
        <g transform="translate(0 0)">
            <g transform="rotate(0)">
                <g transform="scale(1 1)">
                    <g transform="translate(0 0)">
                        <g id="Layer_f1397ef6550347ce9c4c5dac0592c202" inkscape:groupmode="layer" inkscape:label="Layer" opacity="1">
                            <g transform="translate(-1.32093 -6.60465)">
                                <g transform="rotate(0)">
                                    <g transform="scale(1 1)">
                                        <g transform="translate(0 0)">
                                            <g id="Group_88d3f20c55ce4bd89bc396416f5959d7" inkscape:label="Group" opacity="1">
                                                <g fill="#d8d8d8" fill-opacity="1" id="Stroke_5fec1f663c594a4a981521a8081e7eaf" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(-0.014083, 0.999901, -0.999901, -0.014083, 635.499, -26.0944)">
                                                    <rect height="27.865" ry="0" style="stroke:none;" width="75.862" x="341.72" y="267.541"/>
                                                    <rect height="27.865" ry="0" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;" width="75.862" x="341.72" y="267.541"/>
                                                </g>
                                                <g fill="#d8d8d8" fill-opacity="1" id="Stroke_35c44de5b1fd486cbf7a6fc23e9975c1" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(-0.014083, 0.999901, -0.999901, -0.014083, 790.185, -33.3201)">
                                                    <rect height="27.865" ry="0" style="stroke:none;" width="75.862" x="341.72" y="267.541"/>
                                                    <rect height="27.865" ry="0" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;" width="75.862" x="341.72" y="267.541"/>
                                                </g>
                                                <g fill="#fffcd0" fill-opacity="1" id="Stroke_3b6403687cd647909972a0308a554fd6" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 373.85,396.905 C 374.51,397.371 321.728,395.689 320.966,395.837 316.622,396.682 332.446,380.884 346.607,380.884 360.768,380.884 370.236,394.352 373.85,396.905 373.85,396.905 373.85,396.905 373.85,396.905 Z" sodipodi:nodetypes="cccc" style="stroke:none;"/>
                                                    <path d="M 373.85,396.905 C 374.51,397.371 321.728,395.689 320.966,395.837 316.622,396.682 332.446,380.884 346.607,380.884 360.768,380.884 370.236,394.352 373.85,396.905 373.85,396.905 373.85,396.905 373.85,396.905 Z" sodipodi:nodetypes="cccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                </g>
                                                <g fill="#fffcd0" fill-opacity="1" id="Stroke_e726d66e0bf04eb1baa64fe4207feb8e" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 528.536,389.679 C 529.196,390.145 476.414,388.463 475.652,388.611 471.308,389.456 487.132,373.658 501.293,373.658 515.454,373.658 524.922,387.126 528.536,389.679 528.536,389.679 528.536,389.679 528.536,389.679 Z" sodipodi:nodetypes="cccc" style="stroke:none;"/>
                                                    <path d="M 528.536,389.679 C 529.196,390.145 476.414,388.463 475.652,388.611 471.308,389.456 487.132,373.658 501.293,373.658 515.454,373.658 524.922,387.126 528.536,389.679 528.536,389.679 528.536,389.679 528.536,389.679 Z" sodipodi:nodetypes="cccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.227778; 0.505556; 0.822222" path="M -1.32093,-6.60465 C -1.32093,-6.60465 0,-13.2093 0,-13.2093 0,-13.2093 -11.8884,-3.96279 -11.8884,-3.96279 -11.8884,-3.96279 2.64186,-3.96279 2.64186,-3.96279" repeatCount="indefinite"/>
                            </g>
                            <g fill="#d8d8d8" fill-opacity="1" id="Stroke_1a02ff6eedca464a879b2afa0c2d821b" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M 150.107,208.761 C 97.888,208.761 55.556,191.302 55.556,169.765 55.556,148.228 97.888,130.769 150.107,130.769 152.624,130.769 155.119,130.81 157.586,130.889 161.147,106.646 182.033,88.034 207.265,88.034 223.108,88.034 237.237,95.371 246.44,106.833 246.44,106.833 270.3,88.034 270.3,88.034 270.3,88.034 255.642,124.742 255.642,124.742 256.839,129.039 257.479,133.569 257.479,138.248 257.479,151.043 252.693,162.719 244.815,171.586 244.815,171.586 267.12,202.813 267.12,202.813 287.18,194.524 311.846,189.637 338.515,189.637 372.016,189.637 402.358,197.349 424.378,209.829 433.927,207.215 444.278,205.785 455.089,205.785 500.682,205.785 538.079,231.223 541.749,263.59 541.749,263.59 560.739,321.194 560.739,321.194 560.739,321.194 552.801,323.811 552.801,323.811 552.801,323.811 539.593,283.746 539.593,283.746 530.347,311.358 496.021,331.861 455.089,331.861 449.881,331.861 444.78,331.529 439.824,330.893 439.824,330.893 437.96,394.891 437.96,394.891 437.96,394.891 405.594,393.949 405.594,393.949 405.594,393.949 407.699,321.685 407.699,321.685 405.589,320.689 403.543,319.629 401.566,318.508 383.173,324.865 361.594,328.525 338.515,328.525 319.559,328.525 301.615,326.056 285.618,321.651 285.618,321.651 283.274,402.117 283.274,402.117 283.274,402.117 250.908,401.174 250.908,401.174 250.908,401.174 253.597,308.862 253.597,308.862 230.85,296.246 216.72,278.604 216.72,259.081 216.72,257.027 216.876,254.994 217.183,252.986 217.183,252.986 183.775,206.216 183.775,206.216 173.316,207.861 161.966,208.761 150.107,208.761 150.107,208.761 150.107,208.761 150.107,208.761 Z" sodipodi:nodetypes="ccccccccccccccccccccccccccccccccc" style="stroke:none;"/>
                                <path d="M 150.107,208.761 C 97.888,208.761 55.556,191.302 55.556,169.765 55.556,148.228 97.888,130.769 150.107,130.769 152.624,130.769 155.119,130.81 157.586,130.889 161.147,106.646 182.033,88.034 207.265,88.034 223.108,88.034 237.237,95.371 246.44,106.833 246.44,106.833 270.3,88.034 270.3,88.034 270.3,88.034 255.642,124.742 255.642,124.742 256.839,129.039 257.479,133.569 257.479,138.248 257.479,151.043 252.693,162.719 244.815,171.586 244.815,171.586 267.12,202.813 267.12,202.813 287.18,194.524 311.846,189.637 338.515,189.637 372.016,189.637 402.358,197.349 424.378,209.829 433.927,207.215 444.278,205.785 455.089,205.785 500.682,205.785 538.079,231.223 541.749,263.59 541.749,263.59 560.739,321.194 560.739,321.194 560.739,321.194 552.801,323.811 552.801,323.811 552.801,323.811 539.593,283.746 539.593,283.746 530.347,311.358 496.021,331.861 455.089,331.861 449.881,331.861 444.78,331.529 439.824,330.893 439.824,330.893 437.96,394.891 437.96,394.891 437.96,394.891 405.594,393.949 405.594,393.949 405.594,393.949 407.699,321.685 407.699,321.685 405.589,320.689 403.543,319.629 401.566,318.508 383.173,324.865 361.594,328.525 338.515,328.525 319.559,328.525 301.615,326.056 285.618,321.651 285.618,321.651 283.274,402.117 283.274,402.117 283.274,402.117 250.908,401.174 250.908,401.174 250.908,401.174 253.597,308.862 253.597,308.862 230.85,296.246 216.72,278.604 216.72,259.081 216.72,257.027 216.876,254.994 217.183,252.986 217.183,252.986 183.775,206.216 183.775,206.216 173.316,207.861 161.966,208.761 150.107,208.761 150.107,208.761 150.107,208.761 150.107,208.761 Z" sodipodi:nodetypes="ccccccccccccccccccccccccccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#fffcd0" fill-opacity="1" id="Stroke_a17a3e2eb09e48c0ab3351881f87c0d9" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M 294.176,411.321 C 294.836,411.787 242.054,410.105 241.292,410.253 236.948,411.098 252.772,395.3 266.933,395.3 281.094,395.3 290.562,408.768 294.176,411.321 294.176,411.321 294.176,411.321 294.176,411.321 Z" sodipodi:nodetypes="cccc" style="stroke:none;"/>
                                <path d="M 294.176,411.321 C 294.836,411.787 242.054,410.105 241.292,410.253 236.948,411.098 252.772,395.3 266.933,395.3 281.094,395.3 290.562,408.768 294.176,411.321 294.176,411.321 294.176,411.321 294.176,411.321 Z" sodipodi:nodetypes="cccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#fffcd0" fill-opacity="1" id="Stroke_2726f4ad57714c72b8bff6a2cd3879e5" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M 448.862,404.095 C 449.522,404.561 396.74,402.879 395.978,403.027 391.634,403.872 407.458,388.074 421.619,388.074 435.78,388.074 445.248,401.542 448.862,404.095 448.862,404.095 448.862,404.095 448.862,404.095 Z" sodipodi:nodetypes="cccc" style="stroke:none;"/>
                                <path d="M 448.862,404.095 C 449.522,404.561 396.74,402.879 395.978,403.027 391.634,403.872 407.458,388.074 421.619,388.074 435.78,388.074 445.248,401.542 448.862,404.095 448.862,404.095 448.862,404.095 448.862,404.095 Z" sodipodi:nodetypes="cccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#000000" fill-opacity="1" id="Stroke_119475c66ad34979929fdcd7b709de63" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <ellipse cx="86.698" cy="153.548" rx="3.449" ry="6.132" style="stroke:none;"/>
                                <ellipse cx="86.698" cy="153.548" rx="3.449" ry="6.132" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#000000" fill-opacity="1" id="Stroke_8fe820aa4a004b0f80b59226ada2f2d9" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <ellipse cx="177.183" cy="127.437" rx="10.348" ry="10.348" style="stroke:none;"/>
                                <ellipse cx="177.183" cy="127.437" rx="10.348" ry="10.348" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#000000" fill-opacity="1" id="Stroke_15fbb1e065474509a5ac88beeb5e8020" inkscape:label="Group" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <ellipse cx="95.43" cy="194.793" rx="16.863" ry="2.32" style="stroke:none;"/>
                                <ellipse cx="95.43" cy="194.793" rx="16.863" ry="2.32" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#ffffff" fill-opacity="1" id="Stroke_7cb83ae9f9774494ba1beaeb8e2f2a23" inkscape:label="Group" opacity="1" stroke="#4a4a4a" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M 547.661,323.776 C 547.661,331.396 551.313,342.617 555.97,342.617 558.602,342.617 560.992,339.032 562.573,334.538 564.944,336.196 567.37,337.206 569.095,337.206 573.752,337.206 568.959,327.916 568.959,320.296 568.959,314.352 560.265,314.22 556.44,318.065 552.112,317.958 547.661,319.861 547.661,323.776 547.661,323.776 547.661,323.776 547.661,323.776 Z" sodipodi:nodetypes="ccccccc" style="stroke:none;"/>
                                <path d="M 547.661,323.776 C 547.661,331.396 551.313,342.617 555.97,342.617 558.602,342.617 560.992,339.032 562.573,334.538 564.944,336.196 567.37,337.206 569.095,337.206 573.752,337.206 568.959,327.916 568.959,320.296 568.959,314.352 560.265,314.22 556.44,318.065 552.112,317.958 547.661,319.861 547.661,323.776 547.661,323.776 547.661,323.776 547.661,323.776 Z" sodipodi:nodetypes="ccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
            <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.233333; 0.505556; 0.894444" path="M 0,0 C 0,0 0,11.8884 0,11.8884 0,11.8884 -1.32093,-9.24651 -1.32093,-9.24651 -1.32093,-9.24651 0,2.64186 0,2.64186" repeatCount="indefinite"/>
        </g>
    </g>
</svg>
`;
    const CHAR_SVG_3 = `
<svg height="100" inkscape:export-xdpi="96" inkscape:export-ydpi="96" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 500 500" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title></title>
    <defs/>
    <sodipodi:namedview bordercolor="#666666" borderlayer="true" inkscape:document-units="px" inkscape:pagecheckerboard="true" pagecolor="#ffffff"/>
    <metadata>
        <rdf:RDF>
            <cc:Work>
                <dc:format>image/svg+xml</dc:format>
                <dc:type rdf:resource="http://purl.org/dc/dcmitype/MovingImage"/>
                <dc:title></dc:title>
            </cc:Work>
        </rdf:RDF>
    </metadata>
    <g id="Composition_6d32381960df446bb54c94a56b0923a1" inkscape:groupmode="layer" inkscape:label="Composition">
        <g id="Layer_0288c8eb75794b44b2c636dfd0b99346" inkscape:groupmode="layer" inkscape:label="Layer" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
            <g transform="translate(0.812446 0.266947)">
                <g transform="rotate(0)">
                    <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                            <g fill="#ffd93d" fill-opacity="1" id="Stroke_f4ffc4c4b46441fb87a4d9cfb6861ca9" inkscape:label="Group" opacity="1" stroke="#af8b2d" stroke-opacity="1" stroke-width="3">
                                <path d="M 19.94,89.166 C 19.94,89.166 57.374,133.981 57.374,133.981 67.525,110.552 102.364,92.041 146.793,86.361 146.793,86.361 130.97,20.376 130.97,20.376 130.97,20.376 209.01,86.993 209.01,86.993 259.746,94.593 296.885,119.083 296.885,148.121 296.885,183.229 242.595,211.689 175.624,211.689 114.457,211.689 63.868,187.948 55.559,157.085 55.559,157.085 19.94,210.263 19.94,210.263 19.94,210.263 19.94,89.166 19.94,89.166 19.94,89.166 19.94,89.166 19.94,89.166 Z" sodipodi:nodetypes="cccccccccc" style="stroke:none;"/>
                                <path d="M 19.94,89.166 C 19.94,89.166 57.374,133.981 57.374,133.981 67.525,110.552 102.364,92.041 146.793,86.361 146.793,86.361 130.97,20.376 130.97,20.376 130.97,20.376 209.01,86.993 209.01,86.993 259.746,94.593 296.885,119.083 296.885,148.121 296.885,183.229 242.595,211.689 175.624,211.689 114.457,211.689 63.868,187.948 55.559,157.085 55.559,157.085 19.94,210.263 19.94,210.263 19.94,210.263 19.94,89.166 19.94,89.166 19.94,89.166 19.94,89.166 19.94,89.166 Z" sodipodi:nodetypes="cccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                        </g>
                    </g>
                </g>
                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.544444; 0.844444" path="M 0,0 C 0,0 0,4.70058 0,4.70058 0,4.70058 0,5.95407 0,5.95407 0,5.95407 1.25349,-2.82035 1.25349,-2.82035" repeatCount="indefinite"/>
            </g>
            <g fill="#ffd93d" fill-opacity="1" id="Stroke_77b00558b0d448e4a04b8c323da55239" inkscape:label="Group" opacity="1" stroke="#d39900" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                <ellipse cx="156.254" cy="192.828" rx="51.355" ry="14.899" style="stroke:none;"/>
                <ellipse cx="156.254" cy="192.828" rx="51.355" ry="14.899" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
            <g transform="translate(0 -2.1936)">
                <g transform="rotate(0)">
                    <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                            <g fill="#fd5252" fill-opacity="1" id="Stroke_29707f9b09a74bfabbd133c36ff404ef" inkscape:label="Group" opacity="1" stroke="#943636" stroke-opacity="1" stroke-width="3">
                                <path d="M 145.481,434.842 C 145.481,434.842 158.386,401.907 158.386,401.907 124.912,397.57 96.918,385.943 80.885,370.425 67.433,374.913 38.699,381.735 8.04,377.727 8.04,377.727 25.402,363.534 56.283,345.834 25.224,328.057 7.753,313.776 7.753,313.776 33.67,310.388 58.21,314.738 73.308,318.876 90.023,294.254 134.875,276.626 187.582,276.626 254.553,276.626 308.843,305.086 308.843,340.194 308.843,367.568 275.837,390.901 229.55,399.852 216.373,413.418 171.623,437.403 145.481,434.842 145.481,434.842 145.481,434.842 145.481,434.842 Z" sodipodi:nodetypes="ccccccccccc" style="stroke:none;"/>
                                <path d="M 145.481,434.842 C 145.481,434.842 158.386,401.907 158.386,401.907 124.912,397.57 96.918,385.943 80.885,370.425 67.433,374.913 38.699,381.735 8.04,377.727 8.04,377.727 25.402,363.534 56.283,345.834 25.224,328.057 7.753,313.776 7.753,313.776 33.67,310.388 58.21,314.738 73.308,318.876 90.023,294.254 134.875,276.626 187.582,276.626 254.553,276.626 308.843,305.086 308.843,340.194 308.843,367.568 275.837,390.901 229.55,399.852 216.373,413.418 171.623,437.403 145.481,434.842 145.481,434.842 145.481,434.842 145.481,434.842 Z" sodipodi:nodetypes="ccccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                        </g>
                    </g>
                </g>
                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.544444" path="M 0,0 C 0,0 0,-10.968 0,-10.968 0,-10.968 0,-2.1936 0,-2.1936" repeatCount="indefinite"/>
            </g>
            <g fill="#ffd93d" fill-opacity="1" id="Stroke_a7bfb3ca10eb4f0aa5679cfb2b909ab5" inkscape:label="Group" opacity="1" stroke="#00c58e00" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M 165.97,171.48 C 165.97,171.48 208.81,171.48 208.81,171.48 208.81,171.48 208.81,195.795 208.81,195.795 208.81,195.795 165.97,195.795 165.97,195.795 165.97,195.795 165.97,171.48 165.97,171.48 165.97,171.48 165.97,171.48 165.97,171.48 Z" sodipodi:nodetypes="ccccc" style="stroke:none;"/>
                <path d="M 165.97,171.48 C 165.97,171.48 208.81,171.48 208.81,171.48 208.81,171.48 208.81,195.795 208.81,195.795 208.81,195.795 165.97,195.795 165.97,195.795 165.97,195.795 165.97,171.48 165.97,171.48 165.97,171.48 165.97,171.48 165.97,171.48 Z" sodipodi:nodetypes="ccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
            <g fill="#bd8900" fill-opacity="1" id="Stroke_9212cf2f79104ce196deec1dc4c0554d" inkscape:label="Group" opacity="1" stroke="#d39900" stroke-opacity="1" stroke-width="3" transform="matrix(0, -1, -1, 0, 3.49666, -66.0273)">
                <ellipse cx="-197.74" cy="-252.315" rx="19.796" ry="7.535" style="stroke:none;"/>
                <ellipse cx="-197.74" cy="-252.315" rx="19.796" ry="7.535" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
            <g fill="#aa1919" fill-opacity="1" id="Stroke_89c2d94c11a7448f875b5767789eb882" inkscape:label="Group" opacity="1" stroke="#943636" stroke-opacity="1" stroke-width="3" transform="matrix(0, -1, -1, 0, 463.3, 597.382)">
                <ellipse cx="282.723" cy="200.606" rx="19.796" ry="7.535" style="stroke:none;"/>
                <ellipse cx="282.723" cy="200.606" rx="19.796" ry="7.535" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
        </g>
    </g>
</svg>
`;
    const CHAR_SVG_4 = `
<svg height="100" inkscape:export-xdpi="96" inkscape:export-ydpi="96" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 322 475" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

`;

    const CIRCLE_FAIRY_SVG_CONTENT = `
<?xml version="1.0" encoding="utf-8"?>
<svg height="500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" xmlns:bx="https://boxy-svg.com">
  <g transform="matrix(1.579664, 0, 0, 1.894767, 12.246603, -80.738275)" style="pointer-events: none;">
    <g transform="rotate(0)">
      <g transform="scale(1 1)">
        <g transform="translate(0 0)">
          <g fill="#ffffff" fill-opacity="1" id="Stroke_1621dde92081436eaad105ac9bbdd3c0" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
            <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="stroke:none;"/>
            <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
          </g>
        </g>
      </g>
    </g>
    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
  </g>
  <g transform="matrix(1.579664, 0, 0, 1.894767, 12.246603, -80.738275)" style="pointer-events: none;">
    <g transform="rotate(0)">
      <g transform="scale(1 1)">
        <g transform="translate(0 0)">
          <g fill="#ffffff" fill-opacity="1" id="Stroke_4d999fc5476b486eacb44fb99a752478" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
            <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="stroke:none;"/>
            <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
          </g>
        </g>
      </g>
    </g>
    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
  </g>
  <g>
    <path d="M 357.456 474.35 L 169.798 474.35 L 179.994 427.741 C 173.843 418.353 170.367 407.684 170.367 396.37 C 170.367 358.775 208.751 328.298 256.101 328.298 C 303.451 328.298 341.835 358.775 341.835 396.37 C 341.835 406.348 339.131 415.824 334.274 424.363 L 357.456 474.35 Z" style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);" cx="249.111" cy="309.165" rx="61.449" ry="50.042"/>
    <path style="stroke-width: 3px; fill: rgb(140, 216, 46); stroke: rgb(7, 54, 30);" d="M 208.923 273.185 C 204.353 262.775 286.958 260.31 293.765 275.814 C 295.137 303.531 210.725 309.586 208.923 273.185 Z"/>
    <path d="M 244.194 386.264 C 244.194 392.202 239.27 397.014 233.195 397.014 C 227.121 397.014 222.196 392.202 222.196 386.264 C 222.196 385.411 222.298 384.579 222.49 383.783 L 152.338 314.933 L 164.934 296.769 L 236.175 366.687 C 236.991 366.353 237.887 366.168 238.826 366.168 C 242.658 366.168 245.766 369.238 245.766 373.024 C 245.766 375.839 244.045 378.261 241.585 379.314 C 243.212 381.189 244.194 383.614 244.194 386.264 Z" style="stroke-width: 3px; fill: rgb(255, 244, 235); stroke: rgb(7, 54, 30);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);" cx="163.009" cy="299.337" rx="26.861" ry="22.813"/>
    <path d="M 340.7 310.81 C 340.7 304.745 336.086 299.829 330.394 299.829 C 324.702 299.829 320.087 304.745 320.087 310.81 C 320.087 311.683 320.183 312.532 320.364 313.346 L 254.628 383.684 L 266.431 402.241 L 333.186 330.811 C 333.951 331.152 334.79 331.34 335.67 331.34 C 339.261 331.34 342.173 328.205 342.173 324.338 C 342.173 321.461 340.561 318.987 338.255 317.911 C 339.78 315.996 340.7 313.517 340.7 310.81 Z" style="stroke-width: 3px; fill: rgb(255, 244, 235); stroke: rgb(7, 54, 30); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.00007, -0.000019)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);" cx="329.693" cy="300.073" rx="24.285" ry="23.549"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 229.596 274.003 L 224.955 293.497 L 229.596 274.003 Z"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 252.958 276.788 L 252.803 298.138 L 252.958 276.788 Z"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30); transform-box: fill-box; transform-origin: 50% 50%;" d="M 278.175 293.497 L 273.534 274.003 L 278.175 293.497 Z" transform="matrix(-1, 0, 0, -1, -0.000038, 0.000026)"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 175.614 451.586 L 346.777 452.031"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 195.518 473.502 L 196.186 451.689"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 239.403 473.946 L 238.838 451.895"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 323.659 473.947 L 322.991 452.134"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 277.891 473.605 L 278.559 451.792"/>
    <animateMotion path="M 0 0 L -0.279 12.176 L 0.313 0" calcMode="linear" dur="4s" fill="freeze" keyTimes="0; 0.486169; 1" keyPoints="0; 0.486169; 1" repeatCount="indefinite"/>
  </g>
  <g>
    <ellipse style="stroke-width: 3px; fill: rgb(57, 216, 136); stroke: rgb(7, 54, 30);" cx="144.462" cy="155.856" rx="104.931" ry="104.403"/>
    <ellipse style="stroke-width: 3px; fill: rgb(57, 216, 136); stroke: rgb(7, 54, 30);" cx="356.516" cy="155.856" rx="104.931" ry="104.403"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 244, 235); stroke: rgb(7, 54, 30);" cx="252.912" cy="203.076" rx="91.621" ry="73.223"/>
    <path d="M 396.229 158.035 C 405.719 177.944 346.805 178.014 303.884 167.892 C 286.095 163.697 262.807 158.838 248.78 148.841 C 235.384 161.203 209.02 169.799 198.586 172.453 C 156.702 183.108 97.623 177.112 106.164 152.458 C 114.705 127.804 159.162 71.113 198.586 71.113 C 218.155 71.113 235.885 76.796 248.78 85.999 C 263.204 76.796 283.037 71.113 304.926 71.113 C 349.024 71.113 386.739 138.126 396.229 158.035 Z" style="stroke-width: 3px; fill: rgb(57, 216, 136); stroke: rgb(7, 54, 30);"/>
    <path d="M 204.525 -212.249 Q 220.532 -237.27 236.538 -212.249 L 236.538 -212.249 Q 252.544 -187.228 220.532 -187.228 L 220.532 -187.228 Q 188.519 -187.228 204.525 -212.249 Z" bx:shape="triangle 188.519 -237.27 64.025 50.042 0.5 0.5 1@3efc720f" style="stroke-width: 3px; stroke: rgb(7, 54, 30);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <path d="M 268.182 -212.619 Q 284.189 -237.64 300.195 -212.619 L 300.195 -212.619 Q 316.201 -187.598 284.189 -187.598 L 284.189 -187.598 Q 252.176 -187.598 268.182 -212.619 Z" bx:shape="triangle 252.176 -237.64 64.025 50.042 0.5 0.5 1@c050bfcc" style="stroke-width: 3px; stroke: rgb(7, 54, 30);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <path d="M 269.47 240.574 C 269.47 245.248 274.733 251.245 252.176 251.245 C 229.619 251.245 231.203 244.512 231.203 239.838 C 231.203 235.164 230.355 241.678 252.912 241.678 C 275.469 241.678 269.47 235.9 269.47 240.574 Z" style="stroke-width: 3px; stroke: rgb(7, 54, 30);"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(7, 54, 30);" cx="213.419" cy="199.581" rx="8.095" ry="9.199"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(7, 54, 30);" cx="278.18" cy="200.685" rx="8.095" ry="9.199"/>
    <path d="M 239.08 172.175 C 239.08 174.613 230.998 172.75 220.634 172.75 C 210.27 172.75 201.548 174.613 201.548 172.175 C 201.548 169.737 209.95 167.76 220.314 167.76 C 230.678 167.76 239.08 169.737 239.08 172.175 Z" style="stroke-width: 3px; stroke: rgb(7, 54, 30);"/>
    <path d="M 304.209 172.911 C 304.209 175.349 296.127 173.486 285.763 173.486 C 275.399 173.486 266.677 175.349 266.677 172.911 C 266.677 170.473 275.079 168.496 285.443 168.496 C 295.807 168.496 304.209 170.473 304.209 172.911 Z" style="stroke-width: 3px; stroke: rgb(7, 54, 30);"/>
    <animateMotion path="M 0 0 L -0.205 20.066 L -0.001 -0.497" calcMode="linear" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.488361; 1" keyPoints="0; 0.488361; 1" repeatCount="indefinite"/>
  </g>
</svg>
`;

    // --- 2. NPC DATA AND DIALOGUE CONFIGURATION ---

    // NPCs that move on the ground or have special behavior (Fish)
    const NPC_DATA = {
        // Phase 0: Map 1 (index 0)
        0: { char_id: 'CHAR_1_Bunny', name: 'Bunny', svg_content: CHAR_SVG_1, initial_x: 700, dialogue: ["Bunny: Hop, skip, and jump! Keep moving to the right!", "Bunny: The darkness is just a shadow, keep going!"] },
        // Phase 1: Map 2 (index 1)
        1: { char_id: 'CHAR_2_Donkey', name: 'Donkey', svg_content: CHAR_SVG_2, initial_x: 500, dialogue: ["Donkey: Don't stop for too long, the journey is long.", "Donkey: This music makes me want to dance!"] },
        // Phase 2: Map 3 (index 2) - No specific NPC required in the request for this phase.

        // Phase 3: Map 4 (index 3) - Swimming starts (Happy Face on ground, Fish floating)
        3: [
            { char_id: 'CHAR_3_HappyFace', name: 'Happy Face', svg_content: CHAR_SVG_3, initial_x: 300, dialogue: ["Fish: Look! The path is wet now! Swim across!", "Fish: Use up and down arrows to float and dive."] , type: 'ground'},
            { char_id: 'CHAR_4_Fish', name: 'Fish', svg_content: CHAR_SVG_4, initial_x: 600, initial_y: 200, dialogue: ["Fish: This is my territory now. Try to catch me!", "Fish: Be careful, the current is strong in the Springs!"] , type: 'swimming'},
        ],
        // Phase 4: Map 5 (index 4) - Swimming ends (Fish remains, gravity returns to normal)
        4: [
            { char_id: 'CHAR_4_Fish', name: 'Fish', svg_content: CHAR_SVG_4, initial_x: 600, initial_y: AVATAR_GROUND_Y, dialogue: ["Fish: The water is gone, but I am still here. Keep jumping!", "Fish: You are almost there! One more step..."] , type: 'ground'},
        ],
        // Phase 5: Map 6 (index 5) - Final NPC
        5: { char_id: 'CIRCLE_FAIRY', name: 'Circle Fairy', svg_content: CIRCLE_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Circle Fairy: You overcame the darkness and the flood!", "Circle Fairy: Your perseverance shines brighter than gold.", "Circle Fairy: Drawaria Springs complete!"] },
    };

    const MAX_TRANSITIONS = 5; // 5 transitions (Map 1 -> 2 -> 3 -> 4 -> 5 -> 6)

    // --- 3. STATE AND GAME VARIABLES ---

    let mapContainer = null;
    let backgroundMusic = null;
    let musicButton = null;
    let currentMapIndex = 0;
    let phasesCompleted = 0;

    // Avatar state
    let avatarX = LEVEL_START_X;
    let avatarY = AVATAR_GROUND_Y;
    let avatarVX = 0;
    let avatarVY = 0;
    let isJumping = false;
    let isLevelComplete = false;
    let selfAvatarImage = null;
    let keys = {};

    // Dialogue state
    let isDialogueActive = false;
    let currentDialogueIndex = 0;
    let dialogueBox = null;
    let dialogueName = null;
    let dialogueText = null;

    // --- 4. ENVIRONMENT AND SETUP ---

    function setupEnvironment() {
        const originalBody = document.body;

        selfAvatarImage = document.querySelector('#selfavatarimage');
        if (!selfAvatarImage) {
            setTimeout(setupEnvironment, 100);
            return;
        }

        // 1. Setup the Map Container and clear body
        mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            overflow: hidden;
            background-color: #000000;
        `;

        originalBody.innerHTML = '';
        originalBody.style.background = 'none';
        originalBody.appendChild(mapContainer);

        // 2. Add Avatar
        originalBody.appendChild(selfAvatarImage);
        selfAvatarImage.style.position = 'absolute';
        selfAvatarImage.style.zIndex = '1000';
        selfAvatarImage.style.pointerEvents = 'none';
        selfAvatarImage.style.display = 'block';
        selfAvatarImage.style.width = AVATAR_HEIGHT_PX + 'px';
        selfAvatarImage.style.height = AVATAR_HEIGHT_PX + 'px';

        // 3. Inject Dialogue Box (NPCs injected by updateMapSVG)
        createDialogueBox();

        // 4. Load initial map (Map 1)
        updateMapSVG();

        // 5. Setup Music (initialization only) and Button
        initializeMusic();
        createMusicButton();

        // 6. Start game loop
        updateAvatar();
    }

    function initializeMusic() {
        backgroundMusic = new Audio(BACKGROUND_MUSIC_URL);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
    }

    function createMusicButton() {
        musicButton = document.createElement('button');
        musicButton.textContent = LEVEL_TITLE + " Music";
        musicButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #447bf9;
            color: white;
            border: 2px solid white;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(68, 123, 249, 0.5);
        `;
        musicButton.addEventListener('click', startMusic);
        document.body.appendChild(musicButton);
    }

    function startMusic() {
        if (backgroundMusic) {
            backgroundMusic.play()
                .then(() => {
                    musicButton.style.display = 'none';
                    musicButton.removeEventListener('click', startMusic);
                })
                .catch(e => {
                    console.error("Failed to play music on click:", e);
                    musicButton.textContent = "Music Error (Click to retry)";
                });
        }
    }

    function updateMapSVG() {
        if (currentMapIndex < BACKGROUND_SVGS.length) {
            mapContainer.innerHTML = BACKGROUND_SVGS[currentMapIndex];
        }
        // Inject NPCs relevant to the current map phase
        injectNPCs();
    }

    function removeAllNPCs() {
        document.querySelectorAll('.npc-clickarea').forEach(npc => npc.remove());
    }

    function injectNPCs() {
        removeAllNPCs();

        const currentNPCs = NPC_DATA[currentMapIndex];
        if (!currentNPCs) return;

        const npcs = Array.isArray(currentNPCs) ? currentNPCs : [currentNPCs];

        npcs.forEach(npcData => {
            const isFinalNPC = npcData.final_npc;
            const size = isFinalNPC ? NPC_WIDTH_DEFAULT * (npcData.scale || 1) : NPC_WIDTH_DEFAULT;
            const x = npcData.initial_x || npcData.x;
            const y = npcData.initial_y || npcData.y || AVATAR_GROUND_Y;

            // Container for the clickable area
            const clickArea = document.createElement('div');
            clickArea.id = `${npcData.char_id}-clickarea`;
            clickArea.className = 'npc-clickarea';

            // Calculate scale and position for the generic container (assuming NPC SVGs are roughly 100x100 if no scale/size is specified)
            clickArea.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: ${size}px;
                height: ${size}px;
                z-index: 999;
                cursor: pointer;
                display: block;
            `;

            // SVG Container for the graphic
            const svgContainer = document.createElement('div');
            svgContainer.id = npcData.char_id;
            svgContainer.innerHTML = npcData.svg_content;

            // Adjust SVG display within the container (important for the fairy's scaling)
            svgContainer.style.cssText = `
                width: 100%;
                height: 100%;
                ${isFinalNPC ? `transform: scale(${npcData.scale}); transform-origin: top left;` : ''}
            `;

            clickArea.addEventListener('click', () => startDialogue(npcData));
            clickArea.appendChild(svgContainer);
            document.body.appendChild(clickArea);
        });
    }

    // --- 5. NPC AND DIALOGUE LOGIC ---

    function createDialogueBox() {
        const box = document.createElement('div');
        box.id = DIALOGUE_BOX_ID;

        dialogueName = document.createElement('div');
        dialogueName.style.cssText = `
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 5px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        dialogueText = document.createElement('div');
        dialogueText.style.cssText = `
            font-size: 18px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        box.appendChild(dialogueName);
        box.appendChild(dialogueText);
        document.body.appendChild(box);
        dialogueBox = box;

        // Custom style for the Springs dialogue box (light blue/green theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(100, 200, 255, 0.9); /* Light Blue/Springs color */
            border: 5px solid #2ecc71; /* Green spring border */
            box-shadow: 0 0 20px rgba(46, 204, 113, 0.7);
            border-radius: 10px;
            font-family: Arial, sans-serif;
            z-index: 10001;
            display: none;
            cursor: pointer;
        `;
        // Initial listener will be set inside startDialogue dynamically
    }

    let activeNPCDialogue = null;

    function startDialogue(npcData) {
        if (isDialogueActive || isLevelComplete) return;

        isDialogueActive = true;
        currentDialogueIndex = 0;
        activeNPCDialogue = npcData.dialogue;

        dialogueBox.style.display = 'block';
        dialogueBox.style.pointerEvents = 'auto';

        // Reset listeners
        dialogueBox.removeEventListener('click', processDialogue);
        dialogueBox.removeEventListener('click', endDialogue);

        processDialogue();
        dialogueBox.addEventListener('click', processDialogue);
    }

    function processDialogue() {
        if (!isDialogueActive || !activeNPCDialogue) return;

        if (currentDialogueIndex >= activeNPCDialogue.length) {
            endDialogue();
            return;
        }

        const line = activeNPCDialogue[currentDialogueIndex];
        const parts = line.split(':');
        const name = parts[0];
        const text = parts.slice(1).join(':').trim();

        dialogueName.textContent = `${name}:`;
        dialogueText.textContent = text;

        currentDialogueIndex++;

        // If this is the last line, change the listener to end the dialogue/level
        if (currentDialogueIndex >= activeNPCDialogue.length) {
            dialogueBox.removeEventListener('click', processDialogue);
            dialogueBox.addEventListener('click', endDialogue);
        }
    }

    function endDialogue() {
        isDialogueActive = false;
        dialogueBox.style.display = 'none';
        currentDialogueIndex = 0;
        dialogueBox.style.pointerEvents = 'none';

        // Final Level Completion Check (Circle Fairy)
        if (phasesCompleted >= MAX_TRANSITIONS) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:gold; font-size:36px; text-align:center; font-family: Arial, sans-serif;">
                    LEVEL COMPLETE!<br>Drawaria Springs is safe.
                </div>
            `;
            createBackToLevelsButton();
            // ---------------------------

            if (backgroundMusic) {
                 backgroundMusic.pause();
            }
            if (musicButton) {
                musicButton.style.display = 'none';
            }
            removeAllNPCs();

            // Disable movement
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }

    function createBackToLevelsButton() {
        const button = document.createElement('button');
        button.textContent = "BACK TO LEVELS";
        button.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background-color: #447bf9;
            color: white;
            border: 4px solid gold;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
        `;
        button.addEventListener('click', () => {
            window.location.reload();
        });
        document.body.appendChild(button);
    }


    // --- 6. GAME LOOP AND MOVEMENT LOGIC ---

    function advanceMap() {
        phasesCompleted++;
        // Check if we need to change the background to the next map in the array
        if (currentMapIndex < BACKGROUND_SVGS.length - 1) {
            currentMapIndex++;
            updateMapSVG();
        }

        // Final NPC appears on Map 6 (index 5) when phasesCompleted hits 5
        if (phasesCompleted === MAX_TRANSITIONS) {
             const finalNPCData = NPC_DATA[MAX_TRANSITIONS].find(npc => npc.final_npc);
             if (finalNPCData) {
                 injectNPCs(); // Re-injects only the final NPC (Circle Fairy)
             }
        }
    }

    function updateAvatar() {
        if (isLevelComplete) return;

        // Dynamic Physics based on Map Index
        const IS_SWIMMING_MAP = (currentMapIndex === 3); // Map 4 is index 3
        const GRAVITY = IS_SWIMMING_MAP ? 0.1 : 0.5; // Low gravity for swimming
        const JUMP_HEIGHT = 15; // Standard jump

        // Movement constants
        const MAX_SPEED = 10;
        const FRICTION = IS_SWIMMING_MAP ? 0.95 : 0.9; // Less friction in water

        // Stop movement during dialogue
        if (isDialogueActive) {
            avatarVX = 0;
            avatarVY = 0;
            isJumping = false;
        } else {
            avatarVY += GRAVITY;

            if (keys['ArrowRight']) {
                avatarVX = Math.min(avatarVX + 0.5, MAX_SPEED);
            } else if (keys['ArrowLeft']) {
                avatarVX = Math.max(avatarVX - 0.5, -MAX_SPEED);
            } else {
                avatarVX *= FRICTION;
            }

            if (IS_SWIMMING_MAP) {
                // Swimming controls: allow vertical movement anytime
                if (keys['ArrowUp']) {
                    avatarVY = Math.max(avatarVY - 1.5, -5); // Swim up
                } else if (keys['ArrowDown']) {
                    avatarVY = Math.min(avatarVY + 1.5, 5); // Swim down
                }
                // When swimming, treat water floor as soft boundary to prevent falling far
                if (avatarY > AVATAR_GROUND_Y) {
                    avatarY = AVATAR_GROUND_Y;
                    // Bounce off bottom softly
                    if (avatarVY > 0) avatarVY *= -0.5;
                }
            } else {
                // Normal Platformer Jump
                if (keys['ArrowUp'] && !isJumping) {
                    avatarVY = -JUMP_HEIGHT;
                    isJumping = true;
                }
                // Ground collision
                if (avatarY > AVATAR_GROUND_Y) {
                    avatarY = AVATAR_GROUND_Y;
                    avatarVY = 0;
                    isJumping = false;
                }
            }
        }

        avatarX += avatarVX;
        avatarY += avatarVY;


        // LEVEL PROGRESSION LOGIC (Teleport to start and advance map)
        if (avatarX > LEVEL_END_X) {
            avatarX = LEVEL_START_X; // Teleport to start

            // Advance map if there are more phases
            if (phasesCompleted < MAX_TRANSITIONS) {
                advanceMap();
            }
        }

        // Keep avatar within left boundary
        if (avatarX < 0) {
            avatarX = 0;
            avatarVX = 0;
        }

        // Update the visual representation of the avatar
        drawAvatar(avatarX, avatarY);

        requestAnimationFrame(updateAvatar);
    }

    function handleKeyDown(event) {
        keys[event.key] = true;
    }

    function handleKeyUp(event) {
        keys[event.key] = false;
    }

    function drawAvatar(x, y) {
        if (selfAvatarImage) {
            // Apply scale/translation for the in-game coordinates
            selfAvatarImage.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            selfAvatarImage.style.border = 'none';
            selfAvatarImage.style.boxShadow = 'none';
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Initial script start with a delay to ensure Drawaria elements are loaded
    setTimeout(setupEnvironment, 1000);

})();