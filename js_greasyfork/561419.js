// ==UserScript==
// @name         Reddit Emoji Sidebar
// @namespace    https://greasyfork.org/es/users/1047503-zerocool22
// @version      4.5.0
// @description  Agrega una barra lateral con cientos de emojis, buscador y funcionalidad de insertar al nuevo diseño de Reddit (Shreddit).
// @author       ZeroCool22
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561419/Reddit%20Emoji%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/561419/Reddit%20Emoji%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Zero: V4.1 - Base de datos purgada de errores... Kjjj...");

    // DB Corregida. Saqué los textos que rompían la grilla.
    const RAW_DB = [
        ["😀", "smile happy cara feliz"], ["😃", "smiley"], ["😄", "smile"], ["😁", "grin"], ["😆", "laugh risa"], ["😅", "sweat sudor"],
        ["🤣", "rofl risa"], ["😂", "joy llorar risa"], ["🙂", "smile"], ["🙃", "upside down"], ["😉", "wink guiño"], ["😊", "blush"],
        ["😇", "angel"], ["🥰", "love amor"], ["😍", "heart eyes"], ["🤩", "star eyes"], ["😘", "kiss beso"], ["😗", "kiss"],
        ["😋", "yum rico"], ["😛", "tongue lengua"], ["😜", "wink tongue"], ["🤪", "zany loco"], ["😝", "squint tongue"], ["🤑", "money dinero"],
        ["🤗", "hug abrazo"], ["🤭", "hand over mouth"], ["🤫", "shush silencio"], ["🤔", "think pensar"], ["🤐", "zipper callado"], ["🤨", "raised eyebrow"],
        ["😐", "neutral"], ["😑", "expressionless"], ["😶", "no mouth"], ["😏", "smirk"], ["😒", "unamused"], ["🙄", "roll eyes"],
        ["😬", "grimace"], ["🤥", "lying mentiroso"], ["😌", "relieved"], ["😔", "pensive"], ["😪", "sleepy sueño"], ["🤤", "drool baba"],
        ["😴", "sleeping dormir"], ["😷", "mask barbijo"], ["🤒", "thermometer fiebre"], ["🤕", "bandage herido"], ["🤢", "nausea vomito"], ["🤮", "vomit vomito"],
        ["🤧", "sneeze estornudo"], ["🥵", "hot calor"], ["🥶", "cold frio"], ["🥴", "woozy"], ["😵", "dizzy mareado"], ["🤯", "exploding head mente"],
        ["🤠", "cowboy vaquero"], ["🥳", "party fiesta"], ["😎", "sunglasses cool"], ["🤓", "nerd"], ["🧐", "monocle"], ["😕", "confused"],
        ["😟", "worried"], ["🙁", "frown"], ["😮", "open mouth"], ["😯", "hushed"], ["😲", "astonished"], ["😳", "flushed"],
        ["🥺", "pleading porfa"], ["😦", "frowning"], ["😧", "anguished"], ["😨", "fear miedo"], ["😰", "cold sweat"], ["😥", "disappointed"],
        ["😢", "cry llorar"], ["😭", "sob llanto"], ["😱", "scream grito"], ["😖", "confounded"], ["😣", "persevere"], ["😞", "disappointed"],
        ["😓", "sweat"], ["😩", "weary"], ["😫", "tired cansado"], ["🥱", "yawn bostezo"], ["😤", "triumph"], ["😡", "rage enojo"],
        ["😠", "angry"], ["🤬", "cursing putear"], ["😈", "smile horns diablo"], ["👿", "imp"], ["💀", "skull calavera muerto"], ["☠️", "skull crossbones pirata"],
        ["💩", "poop caca mierda"], ["🤡", "clown payaso"], ["👹", "ogre"], ["👺", "goblin"], ["👻", "ghost fantasma"], ["👽", "alien"],
        ["🤖", "robot"], ["😺", "cat gato"], ["😸", "grin cat"], ["😹", "joy cat"], ["😻", "heart eyes cat"], ["😼", "smirk cat"],
        ["😽", "kissing cat"], ["🙀", "scream cat"], ["😿", "crying cat"], ["😾", "pouting cat"], ["🙈", "see no evil mono"], ["🙉", "hear no evil"],
        ["🙊", "speak no evil"], ["💋", "kiss mark beso"], ["👋", "wave hola chau"], ["🤚", "back of hand"], ["🖐️", "fingers splayed"], ["✋", "hand mano"],
        ["🖖", "vulcan"], ["👌", "ok"], ["🤏", "pinching poco"], ["✌️", "victory paz"], ["🤞", "crossed fingers suerte"], ["🤟", "love you rock"],
        ["🤘", "sign of horns rock"], ["🤙", "call me"], ["👈", "point left"], ["👉", "point right"], ["👆", "point up"], ["🖕", "middle finger fuck"],
        ["👇", "point down"], ["👍", "thumbs up si bien"], ["👎", "thumbs down no mal"], ["✊", "fist puño"], ["👊", "fist bump"], ["👏", "clap aplauso"],
        ["🙌", "raised hands"], ["👐", "open hands"], ["🤲", "palms up"], ["🤝", "handshake trato"], ["🙏", "pray rezar gracias"], ["✍️", "writing escribir"],
        ["💅", "nail polish"], ["🤳", "selfie"], ["💪", "muscle fuerza"], ["🦵", "leg pierna"], ["🦶", "foot pie"], ["👂", "ear oido"],
        ["👃", "nose nariz"], ["🧠", "brain cerebro"], ["🦷", "tooth diente"], ["🦴", "bone hueso"], ["👀", "eyes ojos"], ["👁️", "eye"],
        ["👅", "tongue lengua"], ["👄", "mouth boca"], ["👶", "baby bebe"], ["🧒", "child nene"], ["👦", "boy chico"], ["👧", "girl chica"],
        ["🧑", "person"], ["👱", "blond rubio"], ["👨", "man hombre"], ["🧔", "bearded"], ["👩", "woman mujer"], ["🧓", "older person viejo"],
        ["👴", "old man"], ["👵", "old woman"], ["👮", "police policia"], ["🕵️", "detective"], ["💂", "guard"], ["👷", "construction worker"],
        ["🤴", "prince"], ["👸", "princess"], ["👳", "turban"], ["👲", "man with gua pi mao"], ["🧕", "woman with headscarf"], ["🤵", "man in tuxedo"],
        ["👰", "bride"], ["🤰", "pregnant embarazada"], ["🤱", "breast feeding"], ["👼", "angel"], ["🎅", "santa"], ["🤶", "mrs claus"],
        ["🦸", "superhero"], ["🦹", "supervillain"], ["🧙", "mage mago"], ["🧚", "fairy hada"], ["🧛", "vampire vampiro"], ["🧜", "merperson sirena"],
        ["🧝", "elf elfo"], ["🧞", "genie genio"], ["🧟", "zombie"], ["💆", "massage"], ["💇", "haircut"], ["🚶", "walking"],
        ["🏃", "running correr"], ["💃", "dancer baile"], ["🕺", "man dancing"], ["🕴️", "suit levitating"], ["👯", "people with bunny ears"], ["🧖", "sauna"],
        ["🧘", "lotus position yoga"], ["🛀", "bath baño"], ["🛌", "sleeping"], ["🕴️", "business"], ["🗣️", "speaking head"], ["👤", "bust in silhouette"],
        ["👥", "busts in silhouette"], ["🤺", "fencer"], ["🏇", "horse racing"], ["⛷️", "skier"], ["🏂", "snowboarder"], ["🏌️", "golfer"],
        ["🏄", "surfer"], ["🚣", "rowboat"], ["🏊", "swimmer nadar"], ["⛹️", "person with ball"], ["🏋️", "weight lifter"], ["🚴", "bicyclist bici"],
        ["🚵", "mountain bicyclist"], ["🏎️", "racing car"], ["🏍️", "motorcycle moto"], ["🤸", "cartwheel"], ["🤼", "wrestlers"], ["🤽", "water polo"],
        ["🤾", "handball"], ["🤹", "juggling"], ["🐵", "monkey face"], ["🐒", "monkey"], ["🦍", "gorilla"], ["🐶", "dog face perro"],
        ["🐕", "dog"], ["🐩", "poodle"], ["🐺", "wolf lobo"], ["🦊", "fox zorro"], ["🦝", "raccoon"], ["🐱", "cat face gato"],
        ["🐈", "cat"], ["🦁", "lion leon"], ["🐯", "tiger face tigre"], ["🐅", "tiger"], ["🐆", "leopard"], ["🐴", "horse face caballo"],
        ["🐎", "horse"], ["🦄", "unicorn unicornio"], ["🦓", "zebra"], ["🦌", "deer ciervo"], ["🐮", "cow face vaca"], ["🐂", "ox"],
        ["🐃", "water buffalo"], ["🐄", "cow"], ["🐷", "pig face chancho"], ["🐖", "pig"], ["🐗", "boar"], ["🐽", "pig nose"],
        ["🐏", "ram"], ["🐑", "sheep oveja"], ["🐐", "goat cabra"], ["🐪", "camel"], ["🐫", "two-hump camel"], ["🦙", "llama"],
        ["🦒", "giraffe jirafa"], ["🐘", "elephant elefante"], ["🦏", "rhinoceros"], ["🦛", "hippopotamus"], ["🐭", "mouse face raton"], ["🐁", "mouse"],
        ["🐀", "rat rata"], ["🐹", "hamster"], ["🐰", "rabbit face conejo"], ["🐇", "rabbit"], ["🐿️", "chipmunk"], ["🦔", "hedgehog"],
        ["🦇", "bat murcielago"], ["🐻", "bear oso"], ["🐨", "koala"], ["🐼", "panda"], ["🦘", "kangaroo canguro"], ["🦡", "badger"],
        ["🐾", "paw prints huellas"], ["🦃", "turkey pavo"], ["🐔", "chicken gallina"], ["🐓", "rooster gallo"], ["🐣", "hatching chick"], ["🐤", "baby chick"],
        ["🐥", "front-facing baby chick"], ["🐦", "bird pajaro"], ["🐧", "penguin pinguino"], ["🦅", "eagle aguila"], ["🦆", "duck pato"], ["🦢", "swan cisne"],
        ["🦉", "owl buho"], ["🦚", "peacock"], ["🦜", "parrot loro"], ["🐸", "frog rana"], ["🐊", "crocodile cocodrilo"], ["🐢", "turtle tortuga"],
        ["🦎", "lizard lagarto"], ["🐍", "snake serpiente"], ["🐲", "dragon face"], ["🐉", "dragon"], ["🦕", "sauropod dino"], ["🦖", "t-rex"],
        ["🐳", "spouting whale"], ["🐋", "whale ballena"], ["🐬", "dolphin delfin"], ["🐟", "fish pez"], ["🐠", "tropical fish"], ["🐡", "blowfish"],
        ["🦈", "shark tiburon"], ["🐙", "octopus pulpo"], ["🐚", "spiral shell"], ["🦀", "crab cangrejo"], ["🦞", "lobster"], ["🦐", "shrimp"],
        ["🦑", "squid"], ["🐌", "snail caracol"], ["🦋", "butterfly mariposa"], ["🐛", "bug bicho"], ["🐜", "ant hormiga"], ["🐝", "honeybee abeja"],
        ["🐞", "lady beetle"], ["🦗", "cricket grillo"], ["🕷️", "spider araña"], ["🕸️", "spider web"], ["🦂", "scorpion"], ["🦟", "mosquito"],
        ["💐", "bouquet"], ["🌸", "cherry blossom"], ["💮", "white flower"], ["🏵️", "rosette"], ["🌹", "rose rosa"], ["🥀", "wilted flower"],
        ["🌺", "hibiscus"], ["🌻", "sunflower girasol"], ["🌼", "blossom"], ["🌷", "tulip tulipan"], ["🌱", "seedling"], ["🌲", "evergreen tree arbol"],
        ["🌳", "deciduous tree"], ["🌴", "palm tree palmera"], ["🌵", "cactus"], ["🌾", "sheaf of rice"], ["🌿", "herb"], ["☘️", "shamrock"],
        ["🍀", "four leaf clover suerte"], ["🍁", "maple leaf"], ["🍂", "fallen leaf"], ["🍃", "leaf fluttering in wind"], ["🍄", "mushroom hongo"], ["🥜", "peanuts"],
        ["🌰", "chestnut"], ["🍞", "bread pan"], ["🥐", "croissant"], ["🥖", "baguette bread"], ["🥨", "pretzel"], ["🥯", "bagel"],
        ["🥞", "pancakes"], ["🧀", "cheese queso"], ["🍖", "meat on bone carne"], ["🍗", "poultry leg pollo"], ["🥩", "cut of meat"], ["🥓", "bacon panceta"],
        ["🍔", "hamburger hamburguesa"], ["🍟", "french fries papas"], ["🍕", "pizza"], ["🌭", "hot dog pancho"], ["🥪", "sandwich"], ["🌮", "taco"],
        ["🌯", "burrito"], ["🥙", "stuffed flatbread"], ["🥚", "egg huevo"], ["🍳", "cooking"], ["🥘", "shallow pan of food"], ["🍲", "pot of food"],
        ["🥣", "bowl with spoon"], ["🥗", "green salad ensalada"], ["🍿", "popcorn"], ["🧂", "salt"], ["🥫", "canned food"], ["🍱", "bento box"],
        ["🍘", "rice cracker"], ["🍙", "rice ball"], ["🍚", "cooked rice arroz"], ["🍛", "curry rice"], ["🍜", "steaming bowl fideos"], ["🍝", "spaghetti pasta"],
        ["🍠", "roasted sweet potato"], ["🍢", "oden"], ["🍣", "sushi"], ["🍤", "fried shrimp"], ["🍥", "fish cake with swirl"], ["🥮", "moon cake"],
        ["🍡", "dango"], ["🥟", "dumpling"], ["🥠", "fortune cookie"], ["🥡", "takeout box"], ["🍦", "soft ice cream helado"], ["🍧", "shaved ice"],
        ["🍨", "ice cream"], ["🍩", "doughnut dona"], ["🍪", "cookie galleta"], ["🎂", "birthday cake torta"], ["🍰", "shortcake"], ["🧁", "cupcake"],
        ["🥧", "pie"], ["🍫", "chocolate bar"], ["🍬", "candy caramelo"], ["🍭", "lollipop chupetin"], ["🍮", "custard"], ["🍯", "honey pot miel"],
        ["🍼", "baby bottle mamadera"], ["🥛", "glass of milk leche"], ["☕", "hot beverage cafe"], ["🍵", "teacup without handle te"], ["🍶", "sake"], ["🍾", "champagne"],
        ["🍷", "wine glass vino"], ["🍸", "cocktail glass"], ["🍹", "tropical drink"], ["🍺", "beer mug cerveza birra"], ["🍻", "clinking beer mugs"], ["🥂", "clinking glasses brindis"],
        ["🥃", "tumbler glass whisky"], ["🥤", "cup with straw"], ["🥢", "chopsticks"], ["🏺", "amphora"], ["🌍", "globe europe-africa mundo"], ["🌎", "globe americas"],
        ["🌏", "globe asia-australia"], ["🌐", "globe with meridians internet"], ["🗺️", "world map"], ["🗾", "map of japan"], ["🧭", "compass brujula"], ["🏔️", "snow-capped mountain"],
        ["⛰️", "mountain montaña"], ["🌋", "volcano volcan"], ["🗻", "mount fuji"], ["🏕️", "camping"], ["🏖️", "beach with umbrella playa"], ["🏜️", "desert desierto"],
        ["🏝️", "desert island isla"], ["🏞️", "national park"], ["🏟️", "stadium estadio"], ["🏛️", "classical building"], ["🏗️", "building construction"], ["🧱", "brick"],
        ["🏘️", "houses"], ["🏚️", "derelict house"], ["🏠", "house casa"], ["🏡", "house with garden"], ["🏢", "office building oficina"], ["🏣", "japanese post office"],
        ["🏤", "post office correo"], ["🏥", "hospital"], ["🏦", "bank banco"], ["🏨", "hotel"], ["🏩", "love hotel"], ["🏪", "convenience store"],
        ["🏫", "school escuela"], ["🏬", "department store"], ["🏭", "factory fabrica"], ["🏯", "japanese castle"], ["🏰", "castle castillo"], ["💒", "wedding"],
        ["🗼", "tokyo tower"], ["🗽", "statue of liberty"], ["⛪", "church iglesia"], ["🕌", "mosque mezquita"], ["🕍", "synagogue"], ["⛩️", "shinto shrine"],
        ["🕋", "kaaba"], ["⛲", "fountain fuente"], ["⛺", "tent carpa"], ["🌁", "foggy"], ["🌃", "night with stars noche"], ["🏙️", "cityscape"],
        ["🌄", "sunrise over mountains"], ["🌅", "sunrise amanecer"], ["🌆", "cityscape at dusk"], ["🌇", "sunset atardecer"], ["🌉", "bridge at night puente"], ["♨️", "hot springs"],
        ["🚗", "automobile auto"], ["🚕", "taxi"], ["🚙", "sport utility vehicle"], ["🚌", "bus bondi"], ["🚎", "trolleybus"], ["🏎️", "racing car"],
        ["🚓", "police car"], ["🚑", "ambulance ambulancia"], ["🚒", "fire engine bomberos"], ["🚐", "minibus"], ["🚚", "delivery truck camion"], ["🚛", "articulated lorry"],
        ["🚜", "tractor"], ["🛴", "kick scooter"], ["🚲", "bicycle bici"], ["🛵", "motor scooter moto"], ["🏍️", "motorcycle"], ["🚨", "police car light sirena"],
        ["🚔", "oncoming police car"], ["🚍", "oncoming bus"], ["🚘", "oncoming automobile"], ["🚖", "oncoming taxi"], ["🚡", "aerial tramway"], ["🚠", "mountain cableway"],
        ["🚟", "suspension railway"], ["🚃", "railway car"], ["🚋", "tram car tren"], ["🚞", "mountain railway"], ["🚝", "monorail"], ["🚄", "high-speed train"],
        ["🚅", "bullet train"], ["🚈", "light rail"], ["🚂", "locomotive"], ["🚆", "train tren"], ["🚇", "metro"], ["🚊", "tram"],
        ["🚉", "station estacion"], ["🚁", "helicopter helicoptero"], ["🛩️", "small airplane avion"], ["✈️", "airplane"], ["🛫", "airplane departure"], ["🛬", "airplane arrival"],
        ["🚀", "rocket cohete to the moon"], ["🛰️", "satellite satelite"], ["💺", "seat asiento"], ["🛶", "canoe canoa"], ["⛵", "sailboat barco"], ["🛥️", "motor boat"],
        ["🚤", "speedboat"], ["🛳️", "passenger ship crucero"], ["⛴️", "ferry"], ["🚢", "ship"], ["⚓", "anchor ancla"], ["⛽", "fuel pump nafta"],
        ["🚧", "construction"], ["🚦", "vertical traffic light semaforo"], ["🚥", "horizontal traffic light"], ["🚏", "bus stop"], ["🗿", "moai stone"], ["🗽", "statue of liberty"],
        ["🗼", "tokyo tower"], ["🎀", "ribbon"], ["🎁", "wrapped gift regalo"], ["🎗️", "reminder ribbon"], ["🎟️", "admission tickets"], ["🎫", "ticket entrada"],
        ["🎖️", "military medal"], ["🏆", "trophy trofeo copa"], ["🏅", "sports medal"], ["🥇", "1st place medal primero oro"], ["🥈", "2nd place medal segundo plata"], ["🥉", "3rd place medal tercero bronce"],
        ["⚽", "soccer ball futbol pelota"], ["⚾", "baseball"], ["🥎", "softball"], ["🏀", "basketball basket"], ["🏐", "volleyball voley"], ["🏈", "american football"],
        ["🏉", "rugby football"], ["🎾", "tennis tenis"], ["🥏", "flying disc"], ["🎳", "bowling"], ["🏏", "cricket game"], ["🏑", "field hockey"],
        ["🏒", "ice hockey"], ["🥍", "lacrosse"], ["🏓", "ping pong"], ["🏸", "badminton"], ["🥊", "boxing glove boxeo"], ["🥋", "martial arts uniform"],
        ["🥅", "goal net arco"], ["⛳", "flag in hole golf"], ["⛸️", "ice skate patin"], ["🎣", "fishing pole pesca"], ["🎽", "running shirt"], ["🎿", "skis esqui"],
        ["🛷", "sled"], ["🥌", "curling stone"], ["🎯", "direct hit diana"], ["🎱", "pool 8 ball billar"], ["🎮", "video game controller juego"], ["🎰", "slot machine"],
        ["🎲", "game die dado"], ["🧩", "jigsaw puzzle"], ["🧸", "teddy bear oso"], ["♠️", "spade suit"], ["♥️", "heart suit corazones"], ["♦️", "diamond suit"],
        ["♣️", "club suit trebol"], ["♟️", "chess pawn ajedrez"], ["🃏", "joker"], ["🀄", "mahjong red dragon"], ["🎴", "flower playing cards"], ["🎭", "performing arts teatro"],
        ["🖼️", "framed picture cuadro"], ["🎨", "artist palette arte"], ["🧵", "thread hilo"], ["🧶", "yarn lana"], ["👓", "glasses anteojos"], ["🕶️", "sunglasses"],
        ["🥽", "goggles"], ["🥼", "lab coat"], ["🦺", "safety vest"], ["👔", "necktie corbata"], ["👕", "t-shirt remera"], ["👖", "jeans pantalon"],
        ["🧣", "scarf bufanda"], ["🧤", "gloves guantes"], ["🧥", "coat abrigo"], ["🧦", "socks medias"], ["👗", "dress vestido"], ["👘", "kimono"],
        ["🥻", "sari"], ["🩱", "one-piece swimsuit malla"], ["🩲", "briefs"], ["🩳", "shorts"], ["👙", "bikini"], ["👚", "woman's clothes ropa"],
        ["👛", "purse monedero"], ["👜", "handbag cartera"], ["👝", "clutch bag"], ["🛍️", "shopping bags"], ["🎒", "backpack mochila"], ["👞", "man's shoe zapato"],
        ["👟", "running shoe zapatilla"], ["🥾", "hiking boot bota"], ["🥿", "flat shoe"], ["👠", "high-heeled shoe taco"], ["👡", "woman's sandal sandalia"], ["👢", "woman's boot"],
        ["👑", "crown corona"], ["👒", "woman's hat sombrero"], ["🎩", "top hat"], ["🎓", "graduation cap graduacion"], ["🧢", "billed cap gorra"], ["⛑️", "rescue worker's helmet casco"],
        ["📿", "prayer beads"], ["💄", "lipstick labial"], ["💍", "ring anillo casamiento"], ["💎", "gem stone diamante joya"], ["🔇", "muted speaker silencio"], ["🔈", "speaker low volume"],
        ["🔉", "speaker medium volume"], ["🔊", "speaker high volume sonido"], ["📢", "loudspeaker"], ["📣", "megaphone"], ["📯", "postal horn"], ["🔔", "bell campana"],
        ["🔕", "bell with slash"], ["🎼", "musical score partitura"], ["🎵", "musical note nota"], ["🎶", "musical notes"], ["🎙️", "studio microphone microfono"], ["🎚️", "level slider"],
        ["🎛️", "control knobs"], ["🎤", "microphone"], ["🎧", "headphone auricular"], ["📻", "radio"], ["🎷", "saxophone"], ["🎸", "guitar guitarra"],
        ["🎹", "musical keyboard teclado"], ["🎺", "trumpet trompeta"], ["🎻", "violin"], ["🪕", "banjo"], ["🥁", "drum tambor"], ["📱", "mobile phone celular"],
        ["📲", "mobile phone with arrow"], ["☎️", "telephone telefono"], ["📞", "telephone receiver"], ["📟", "pager"], ["📠", "fax machine"], ["🔋", "battery bateria"],
        ["🔌", "electric plug enchufe"], ["💻", "laptop compu"], ["🖥️", "desktop computer pc"], ["🖨️", "printer impresora"], ["⌨️", "keyboard teclado"], ["🖱️", "computer mouse"],
        ["🖲️", "trackball"], ["💽", "computer disk"], ["💾", "floppy disk diskette"], ["💿", "optical disk cd"], ["📀", "dvd"], ["🧮", "abacus"],
        ["🎥", "movie camera cine pelicula"], ["🎞️", "film frames"], ["📽️", "film projector"], ["🎬", "clapper board accion"], ["📺", "television tv"], ["📷", "camera camara"],
        ["📸", "camera with flash"], ["📹", "video camera"], ["📼", "videocassette"], ["🔍", "magnifying glass tilted left lupa buscar"], ["🔎", "magnifying glass tilted right"], ["🕯️", "candle vela"],
        ["💡", "light bulb idea luz"], ["🔦", "flashlight linterna"], ["🏮", "red paper lantern"], ["📔", "notebook with decorative cover"], ["📕", "closed book libro"], ["📖", "open book"],
        ["📗", "green book"], ["📘", "blue book"], ["📙", "orange book"], ["📚", "books libros"], ["📓", "notebook"], ["📒", "ledger"],
        ["📃", "page with curl"], ["📜", "scroll"], ["📄", "page facing up"], ["📰", "newspaper diario noticia"], ["🗞️", "rolled-up newspaper"], ["📑", "bookmark tabs"],
        ["🔖", "bookmark"], ["🏷️", "label etiqueta"], ["💰", "money bag dinero bolsa"], ["💴", "yen banknote"], ["💵", "dollar banknote dolar billete"], ["💶", "euro banknote"],
        ["💷", "pound banknote"], ["💸", "money with wings gastar"], ["💳", "credit card tarjeta"], ["🧾", "receipt recibo"], ["💹", "chart increasing with yen"], ["💱", "currency exchange"],
        ["💲", "heavy dollar sign"], ["✉️", "envelope sobre carta"], ["📧", "e-mail"], ["📨", "incoming envelope"], ["📩", "envelope with arrow"], ["📤", "outbox tray"],
        ["📥", "inbox tray"], ["📦", "package paquete caja"], ["📫", "closed mailbox with raised flag"], ["📪", "closed mailbox with lowered flag"], ["📬", "open mailbox with raised flag"], ["📭", "open mailbox with lowered flag"],
        ["📮", "postbox"], ["🗳️", "ballot box with ballot voto"], ["✏️", "pencil lapiz"], ["✒️", "black nib"], ["🖋️", "fountain pen pluma"], ["🖊️", "pen lapicera"],
        ["🖌️", "paintbrush pincel"], ["🖍️", "crayon"], ["📝", "memo nota"], ["💼", "briefcase maletin trabajo"], ["📁", "file folder carpeta"], ["📂", "open file folder"],
        ["🗂️", "card index dividers"], ["📅", "calendar calendario fecha"], ["📆", "tear-off calendar"], ["🗒️", "spiral notepad"], ["🗓️", "spiral calendar"], ["📇", "card index"],
        ["📈", "chart increasing sube"], ["📉", "chart decreasing baja"], ["📊", "bar chart grafico"], ["📋", "clipboard"], ["📌", "pushpin"], ["📍", "round pushpin ubicacion"],
        ["📎", "paperclip clip"], ["🖇️", "linked paperclips"], ["📏", "straight ruler regla"], ["📐", "triangular ruler escuadra"], ["✂️", "scissors tijera"], ["🗃️", "card file box"],
        ["🗄️", "file cabinet"], ["🗑️", "wastebasket basura"], ["🔒", "locked candado"], ["🔓", "unlocked"], ["🔏", "locked with pen"], ["🔐", "locked with key"],
        ["🔑", "key llave"], ["🗝️", "old key"], ["🔨", "hammer martillo"], ["🪓", "axe hacha"], ["⛏️", "pick"], ["⚒️", "hammer and pick"],
        ["🛠️", "hammer and wrench"], ["🗡️", "dagger"], ["⚔️", "crossed swords espadas"], ["🔫", "pistol arma"], ["🏹", "bow and arrow arco"], ["🛡️", "shield escudo"],
        ["🔧", "wrench llave inglesa"], ["🔩", "nut and bolt"], ["⚙️", "gear engranaje config"], ["🗜️", "clamp"], ["⚖️", "balance scale balanza justicia"], ["🔗", "link link"],
        ["⛓️", "chains cadenas"], ["🧰", "toolbox caja herramientas"], ["🧲", "magnet iman"], ["⚗️", "alembic"], ["🧪", "test tube tubo ensayo"], ["🧫", "petri dish"],
        ["🧬", "dna adn"], ["🔬", "microscope"], ["🔭", "telescope"], ["📡", "satellite antenna"], ["💉", "syringe jeringa vacuna"], ["💊", "pill pastilla droga"],
        ["🚪", "door puerta"], ["🛏️", "bed cama"], ["🛋️", "couch and lamp sillon"], ["🚽", "toilet inodoro"], ["🚿", "shower ducha"], ["🛁", "bathtub"],
        ["🧴", "lotion bottle"], ["🧷", "safety pin"], ["🧹", "broom escoba"], ["🧺", "basket"], ["🧻", "roll of paper papel"], ["🧼", "soap jabon"],
        ["🧽", "sponge esponja"], ["🧯", "fire extinguisher matafuego"], ["🛒", "shopping cart changuito"], ["🚬", "cigarette cigarrillo"], ["⚰️", "coffin ataud"], ["⚱️", "funeral urn"],
        ["🗿", "moai"], ["🏧", "atm sign cajero"], ["🚮", "litter in bin sign"], ["🚰", "potable water"], ["♿", "wheelchair symbol"], ["🚹", "men's room"],
        ["🚺", "women's room"], ["🚻", "restroom"], ["🚼", "baby symbol"], ["🚾", "water closet"], ["🛂", "passport control"], ["🛃", "customs"],
        ["🛄", "baggage claim"], ["🛅", "left luggage"], ["⚠️", "warning alerta"], ["🚸", "children crossing"], ["⛔", "no entry prohibido"], ["🚫", "prohibited"],
        ["🚳", "no bicycles"], ["🚭", "no smoking"], ["🚯", "no littering"], ["🚱", "non-potable water"], ["🚷", "no pedestrians"], ["📵", "no mobile phones"],
        ["🔞", "no one under eighteen prohibido 18"], ["☢️", "radioactive"], ["☣️", "biohazard"], ["⬆️", "up arrow"], ["↗️", "up-right arrow"], ["➡️", "right arrow"],
        ["↘️", "down-right arrow"], ["⬇️", "down arrow"], ["↙️", "down-left arrow"], ["⬅️", "left arrow"], ["↖️", "up-left arrow"], ["↕️", "up-down arrow"],
        ["↔️", "left-right arrow"], ["↩️", "right arrow curving left"], ["↪️", "left arrow curving right"], ["⤴️", "right arrow curving up"], ["⤵️", "right arrow curving down"], ["🔃", "clockwise vertical arrows"],
        ["🔄", "counterclockwise arrows button reload"], ["🔙", "back arrow"], ["END", "end arrow"], ["🔛", "on! arrow"], ["🔜", "soon arrow"], ["🔝", "top arrow"],
        ["🛐", "place of worship"], ["⚛️", "atom symbol"], ["🕉️", "om"], ["✡️", "star of david"], ["☸️", "wheel of dharma"], ["☯️", "yin yang"],
        ["✝️", "latin cross cruz"], ["☦️", "orthodox cross"], ["☪️", "star and crescent"], ["☮️", "peace symbol paz"], ["🕎", "menorah"], ["🔯", "dotted six-pointed star"],
        ["♈", "aries"], ["♉", "taurus"], ["♊", "gemini"], ["♋", "cancer"], ["♌", "leo"], ["♍", "virgo"],
        ["♎", "libra"], ["♏", "scorpius"], ["♐", "sagittarius"], ["♑", "capricorn"], ["♒", "aquarius"], ["♓", "pisces"],
        ["⛎", "ophiuchus"], ["🔀", "shuffle tracks button"], ["🔁", "repeat button"], ["🔂", "repeat single button"], ["▶️", "play button"], ["⏩", "fast-forward button"],
        ["⏭️", "next track button"], ["⏯️", "play or pause button"], ["◀️", "reverse button"], ["⏪", "fast reverse button"], ["⏮️", "last track button"], ["🔼", "upwards button"],
        ["⏫", "fast up button"], ["🔽", "downwards button"], ["⏬", "fast down button"], ["⏸️", "pause button"], ["⏹️", "stop button"], ["⏺️", "record button"],
        ["⏏️", "eject button"], ["🎦", "cinema"], ["🔅", "dim button"], ["🔆", "bright button"], ["📶", "antenna bars"], ["📳", "vibration mode"],
        ["📴", "mobile phone off"], ["♀️", "female sign mujer"], ["♂️", "male sign hombre"], ["⚕️", "medical symbol"], ["♾️", "infinity infinito"], ["♻️", "recycling symbol reciclaje"],
        ["⚜️", "fleur-de-lis"], ["🔱", "trident emblem"], ["📛", "name badge"], ["🔰", "japanese symbol for beginner"], ["⭕", "heavy large circle"], ["✅", "check mark button si correcto"],
        ["☑️", "check box with check"], ["✔️", "check mark"], ["✖️", "multiply"], ["❌", "cross mark no error"], ["❎", "cross mark button"], ["➕", "plus sign mas"],
        ["➖", "minus sign menos"], ["➗", "division sign"], ["➰", "curly loop"], ["➿", "double curly loop"], ["〽️", "part alternation mark"], ["✳️", "eight-spoked asterisk"],
        ["✴️", "eight-pointed star"], ["❇️", "sparkle"], ["‼️", "double exclamation mark"], ["⁉️", "exclamation question mark"], ["❓", "question mark pregunta"], ["❔", "white question mark"],
        ["❕", "white exclamation mark"], ["❗", "exclamation mark"], ["〰️", "wavy dash"], ["©️", "copyright"], ["®️", "registered"], ["™️", "trade mark"],
        ["#️⃣", "keycap: #"], ["*️⃣", "keycap: *"], ["0️⃣", "keycap: 0"], ["1️⃣", "keycap: 1"], ["2️⃣", "keycap: 2"], ["3️⃣", "keycap: 3"],
        ["4️⃣", "keycap: 4"], ["5️⃣", "keycap: 5"], ["6️⃣", "keycap: 6"], ["7️⃣", "keycap: 7"], ["8️⃣", "keycap: 8"], ["9️⃣", "keycap: 9"],
        ["🔟", "keycap: 10"], ["💯", "hundred points 100"], ["🔠", "input latin uppercase"], ["🔡", "input latin lowercase"], ["🔢", "input numbers"], ["🔣", "input symbols"],
        ["🔤", "input latin letters"], ["🅰️", "a button (blood type)"], ["🆎", "ab button (blood type)"], ["🅱️", "b button (blood type)"], ["🆑", "cl button"], ["🆒", "cool button"],
        ["🆓", "free button"], ["ℹ️", "information"], ["🆔", "id button"], ["Ⓜ️", "circled m"], ["🆕", "new button"], ["🆖", "ng button"],
        ["🅾️", "o button (blood type)"], ["🆗", "ok button"], ["🅿️", "p button"], ["🆘", "sos button ayuda"], ["🆙", "up! button"], ["🆚", "vs button"],
        ["🈁", "japanese “here” button"], ["🈂️", "japanese “service charge” button"], ["🈷️", "japanese “monthly amount” button"], ["🈶", "japanese “not free of charge” button"], ["🈯", "japanese “reserved” button"], ["🉐", "japanese “bargain” button"],
        ["🈹", "japanese “discount” button"], ["🈚", "japanese “free of charge” button"], ["🈲", "japanese “prohibited” button"], ["🉑", "japanese “acceptable” button"], ["🈸", "japanese “application” button"], ["🈴", "japanese “passing grade” button"],
        ["🈳", "japanese “vacancy” button"], ["㊗️", "japanese “congratulations” button"], ["㊙️", "japanese “secret” button"], ["🈺", "japanese “open for business” button"], ["🈵", "japanese “no vacancy” button"], ["🔴", "red circle rojo"],
        ["🟠", "orange circle naranja"], ["🟡", "yellow circle amarillo"], ["🟢", "green circle verde"], ["🔵", "blue circle azul"], ["🟣", "purple circle violeta"], ["🟤", "brown circle marron"],
        ["⚫", "black circle negro"], ["⚪", "white circle blanco"], ["🟥", "red square"], ["🟧", "orange square"], ["🟨", "yellow square"], ["🟩", "green square"],
        ["🟦", "blue square"], ["🟪", "purple square"], ["🟫", "brown square"], ["⬛", "black large square"], ["⬜", "white large square"], ["◼️", "black medium square"],
        ["◻️", "white medium square"], ["◾", "black medium-small square"], ["◽", "white medium-small square"], ["▪️", "black small square"], ["▫️", "white small square"], ["🔶", "large orange diamond"],
        ["🔷", "large blue diamond"], ["🔸", "small orange diamond"], ["🔹", "small blue diamond"], ["🔺", "red triangle pointed up"], ["🔻", "red triangle pointed down"], ["💠", "diamond with a dot"],
        ["🔘", "radio button"], ["🔳", "white square button"], ["🔲", "black square button"], ["🏁", "chequered flag"], ["🚩", "triangular flag bandera"], ["🎌", "crossed flags"],
        ["🏴", "black flag"], ["🏳️", "white flag"], ["🏳️‍🌈", "rainbow flag lgbt"], ["🇦🇷", "argentina"], ["🏴‍☠️", "pirate flag pirata"]
    ];

    function createWidget(composer) {
        // Contenedor principal
        const container = document.createElement('div');
        container.className = 'zero-emoji-widget';
        container.style.cssText = `
            background: #0f0f0f;
            border: 1px solid #343536;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            margin-bottom: 0px;
            z-index: 0;
            position: relative;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
        `;

        // === HEADER: Título y Buscador ===
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 8px;
            border-bottom: 1px solid #343536;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const title = document.createElement('span');
        title.innerText = ">_ ZERO";
        title.style.cssText = "font-size: 10px; color: #ff4500; font-family: monospace; font-weight: bold; white-space: nowrap;";

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search emojis...';
        searchInput.style.cssText = `
            background: #1a1a1b;
            border: 1px solid #343536;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            width: 100%;
            font-size: 12px;
            outline: none;
        `;

        header.appendChild(title);
        header.appendChild(searchInput);
        container.appendChild(header);

        // === BODY: Grid de Emojis ===
        const emojiGrid = document.createElement('div');
        emojiGrid.className = 'zero-emoji-grid';
        emojiGrid.style.cssText = `
            padding: 5px;
            max-height: 120px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(28px, 1fr));
            gap: 2px;
        `;

        // Personalizamos el scrollbar
        const style = document.createElement('style');
        style.innerHTML = `
            .zero-emoji-grid::-webkit-scrollbar { width: 8px; }
            .zero-emoji-grid::-webkit-scrollbar-track { background: #0f0f0f; }
            .zero-emoji-grid::-webkit-scrollbar-thumb { background: #343536; border-radius: 4px; }
            .zero-emoji-grid::-webkit-scrollbar-thumb:hover { background: #555; }
        `;
        container.appendChild(style);

        const fragment = document.createDocumentFragment();
        const emojiElements = [];

        RAW_DB.forEach(([emoji, keywords]) => {
            const btn = document.createElement('span');
            btn.innerText = emoji;
            btn.dataset.keywords = keywords;
            btn.style.cssText = `
                cursor: pointer;
                font-size: 1.2rem;
                text-align: center;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.1s;
                user-select: none;
            `;

            btn.onmouseover = () => btn.style.backgroundColor = "#2d2d2e";
            btn.onmouseout = () => btn.style.backgroundColor = "transparent";

            btn.onmousedown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                insertEmoji(composer, emoji);
            };

            emojiElements.push(btn);
            fragment.appendChild(btn);
        });

        emojiGrid.appendChild(fragment);
        container.appendChild(emojiGrid);

        // === Lógica del Buscador ===
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            requestAnimationFrame(() => {
                emojiElements.forEach(btn => {
                    if (btn.dataset.keywords.includes(term) || btn.innerText.includes(term)) {
                        btn.style.display = '';
                    } else {
                        btn.style.display = 'none';
                    }
                });
            });
        });

        return container;
    }

    function insertEmoji(composer, emoji) {
        let editor = composer.querySelector('[contenteditable="true"]');
        if (!editor && composer.shadowRoot) {
            editor = composer.shadowRoot.querySelector('[contenteditable="true"]');
        }

        if (editor) {
            editor.focus();
            document.execCommand('insertText', false, emoji);
        }
    }

    function inject(composer) {
        if (composer.dataset.zeroInjected === "true") return;

        const parent = composer.parentNode;
        if (parent) {
            console.log("Zero: Inyectando Widget 4.1...");
            const widget = createWidget(composer);
            parent.insertBefore(widget, composer);
            composer.dataset.zeroInjected = "true";
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.tagName && node.tagName.toLowerCase() === 'shreddit-composer') {
                            inject(node);
                        } else {
                            const composers = node.querySelectorAll('shreddit-composer');
                            composers.forEach(c => inject(c));
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        document.querySelectorAll('shreddit-composer').forEach(inject);
    }, 1000);

})();