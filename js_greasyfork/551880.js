// ==UserScript==
// @name         WaniKani Leeches Dashboard Widget
// @namespace    https://github.com/alexandervalencia
// @version      1.0.0
// @description  Display your worst leeches on the WaniKani dashboard
// @author       Alex Valencia
// @include      /^https:\/\/(www|preview)\.wanikani\.com(\/(#)?dashboard)?(\/)?$/
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551880/WaniKani%20Leeches%20Dashboard%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/551880/WaniKani%20Leeches%20Dashboard%20Widget.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const wkof = unsafeWindow.wkof;

  // ============================================================================
  // WKOF DEPENDENCY CHECK
  // ============================================================================

  // Check if WKOF is loaded (must use unsafeWindow in TamperMonkey)
  if (!wkof) {
    const response = confirm(
      "WaniKani Leeches Dashboard Widget requires WaniKani Open Framework.\n\nClick OK to install it now."
    );
    if (response) {
      window.location.href =
        "https://greasyfork.org/en/scripts/38582-wanikani-open-framework";
    }
    return;
  }

  // WKOF is loaded, wait for Apiv2 module and initialize
  wkof.include("Apiv2");
  wkof
    .ready("Apiv2")
    .then(initialize)
    .catch((error) => {
      console.error("Leeches widget: Error loading WKOF:", error);
    });

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  const CONFIG = {
    MIN_REVIEWS: 6, // Minimum reviews before considering as leech
    LEECH_SCORE_THRESHOLD: 40, // Minimum leech score to display
    MAX_LEECHES_DISPLAY: 50, // Maximum number of leeches to show
    CACHE_DURATION: 3600000, // Cache duration in ms (1 hour)
  };

  // ============================================================================
  // ICON
  // ============================================================================
  const leechIcon = `<svg width="24" height="24" viewBox="0 0 512 512">
<path d="M0 0 C0.89384399 -0.00974854 1.78768799 -0.01949707 2.70861816 -0.02954102 C22.325512 -0.19946517 41.16037783 0.04715563 60.41015625 4.23828125 C61.32651855 4.42551758 62.24288086 4.61275391 63.18701172 4.80566406 C100.98586291 12.57613622 154.47704778 32.81290093 177.41015625 66.23828125 C181.02967287 72.30972848 181.20762973 78.35021365 180.41015625 85.23828125 C178.09096631 93.82523065 174.18274237 99.68315799 166.46484375 104.1640625 C156.04558868 109.61139167 144.08143439 106.33524838 133.0300293 104.34301758 C77.33802086 94.40407804 17.92672534 109.00910703 -28.70703125 140.33203125 C-35.92025168 145.48141241 -42.84099971 151.0794158 -49.5078125 156.91796875 C-53.30647511 160.23828125 -53.30647511 160.23828125 -56.58984375 160.23828125 C-58.34375 158.62890625 -58.34375 158.62890625 -60.15234375 156.48828125 C-60.75175781 155.7921875 -61.35117188 155.09609375 -61.96875 154.37890625 C-63.47229548 152.39350162 -64.56562376 150.50073735 -65.58984375 148.23828125 C-51.06395178 134.07145628 -34.41858062 122.82064136 -16.58984375 113.23828125 C-15.90857422 112.87009277 -15.22730469 112.5019043 -14.52539062 112.12255859 C15.73882348 95.93940371 50.91538713 85.23034795 85.4140625 85.03515625 C86.24714935 85.02827789 87.08023621 85.02139954 87.93856812 85.01431274 C90.6166425 84.99722402 93.29453021 84.9908568 95.97265625 84.98828125 C97.34201828 84.98577362 97.34201828 84.98577362 98.73904419 84.98321533 C115.89432922 84.9813326 132.39935057 86.21489547 149.19799805 89.87011719 C153.617176 90.60559013 157.01043187 90.1223177 160.78515625 87.73828125 C163.22805431 83.97997654 164.03991162 80.70583993 163.41015625 76.23828125 C150.64464793 51.7987393 105.44926067 34.87208605 80.84765625 26.98828125 C61.05804319 20.8885906 41.00482874 18.1105242 20.41015625 16.23828125 C20.41015625 29.10828125 20.41015625 41.97828125 20.41015625 55.23828125 C15.13015625 55.23828125 9.85015625 55.23828125 4.41015625 55.23828125 C4.41015625 42.36828125 4.41015625 29.49828125 4.41015625 16.23828125 C-24.18051813 19.155697 -51.11812298 23.6284818 -77.58984375 35.23828125 C-78.25016602 35.52396973 -78.91048828 35.8096582 -79.59082031 36.10400391 C-101.79428883 45.80164908 -121.27115649 59.51218287 -139.58984375 75.23828125 C-137.98611227 79.24345521 -135.16870389 81.91539105 -132.14453125 84.87890625 C-131.34971848 85.66947418 -131.34971848 85.66947418 -130.53884888 86.47601318 C-128.8521655 88.151538 -127.15864811 89.81995847 -125.46484375 91.48828125 C-124.31724987 92.62583976 -123.17010914 93.76385561 -122.0234375 94.90234375 C-119.21746238 97.6863159 -116.40533911 100.46393885 -113.58984375 103.23828125 C-115.19519662 106.64887528 -116.99503276 108.85620609 -119.71484375 111.48828125 C-120.43929687 112.1946875 -121.16375 112.90109375 -121.91015625 113.62890625 C-122.46445313 114.16 -123.01875 114.69109375 -123.58984375 115.23828125 C-127.58962644 113.64096927 -130.22263857 110.82837399 -133.16015625 107.79296875 C-133.68245819 107.26309357 -134.20476013 106.73321838 -134.7428894 106.18728638 C-136.40511688 104.50069163 -138.060713 102.80781531 -139.71484375 101.11328125 C-141.8992678 98.87584026 -144.09009782 96.64497199 -146.28515625 94.41796875 C-146.78725616 93.89927216 -147.28935608 93.38057556 -147.80667114 92.84616089 C-149.03018308 91.60535661 -150.30581241 90.41634756 -151.58984375 89.23828125 C-152.24984375 89.23828125 -152.90984375 89.23828125 -153.58984375 89.23828125 C-156.34626333 92.20262041 -158.79860751 95.41917829 -161.30029297 98.60009766 C-162.56680509 100.20901404 -163.84545898 101.80768795 -165.125 103.40625 C-170.89091861 110.67908147 -175.91649083 118.20595592 -180.58984375 126.23828125 C-180.95464844 126.85574219 -181.31945312 127.47320312 -181.6953125 128.109375 C-200.84432482 160.59080545 -209.37927522 195.94629295 -212.58984375 233.23828125 C-199.71984375 233.23828125 -186.84984375 233.23828125 -173.58984375 233.23828125 C-173.58984375 238.51828125 -173.58984375 243.79828125 -173.58984375 249.23828125 C-186.45984375 249.23828125 -199.32984375 249.23828125 -212.58984375 249.23828125 C-210.21009936 272.1589772 -207.02173801 294.36727815 -199.58984375 316.23828125 C-183.74984375 316.73328125 -183.74984375 316.73328125 -167.58984375 317.23828125 C-167.58984375 322.51828125 -167.58984375 327.79828125 -167.58984375 333.23828125 C-169.26941162 333.26015503 -169.26941162 333.26015503 -170.98291016 333.2824707 C-175.15412649 333.34063011 -179.32481294 333.41786148 -183.49560547 333.50073242 C-185.29760104 333.53389898 -187.09969842 333.5619565 -188.90185547 333.5847168 C-191.49881198 333.61841557 -194.09484241 333.67073774 -196.69140625 333.7265625 C-197.8917601 333.73614738 -197.8917601 333.73614738 -199.11636353 333.7459259 C-204.82070183 333.89442955 -209.27861688 334.87808771 -213.43359375 339.12109375 C-215.55183714 342.99976915 -215.33072351 346.96138443 -214.58984375 351.23828125 C-212.90165926 354.35829629 -210.80889434 356.62875596 -207.58984375 358.23828125 C-205.08937342 358.35715483 -202.61585906 358.41658292 -200.11425781 358.43115234 C-199.34331787 358.43932983 -198.57237793 358.44750732 -197.77807617 358.45593262 C-195.22054829 358.4807935 -192.66307599 358.4973055 -190.10546875 358.51171875 C-189.23218681 358.51704243 -188.35890488 358.5223661 -187.45915985 358.5278511 C-182.83573789 358.55458737 -178.21234296 358.57395959 -173.58886719 358.58837891 C-168.81596769 358.60501629 -164.04376009 358.64978468 -159.27112198 358.70075035 C-155.59933695 358.73442967 -151.92771589 358.74595713 -148.25579071 358.75160599 C-146.49672923 358.75831799 -144.73767852 358.77353884 -142.9787674 358.7974968 C-140.51294362 358.82916356 -138.04898205 358.82918344 -135.58300781 358.82177734 C-134.49798981 358.84638535 -134.49798981 358.84638535 -133.39105225 358.87149048 C-129.56389395 358.82456842 -127.11040063 358.23106166 -124.152771 355.88931274 C-120.61471891 352.22963512 -120.23979904 349.33817834 -120.3046875 344.3046875 C-120.77660819 340.88487869 -122.38406777 338.81168655 -124.58984375 336.23828125 C-128.20248301 333.78441307 -132.10995834 333.80518531 -136.33984375 333.61328125 C-137.03722656 333.57460938 -137.73460937 333.5359375 -138.453125 333.49609375 C-140.16495193 333.40229501 -141.87736057 333.31921951 -143.58984375 333.23828125 C-144.97951644 277.36631276 -128.52939592 220.81150574 -92.58984375 177.23828125 C-91.61380303 176.01233959 -90.63857155 174.7857533 -89.6640625 173.55859375 C-88.68251691 172.34641792 -87.69947948 171.13544834 -86.71484375 169.92578125 C-86.26230225 169.35545166 -85.80976074 168.78512207 -85.34350586 168.19750977 C-84.03515625 166.625 -84.03515625 166.625 -81.58984375 164.23828125 C-76.80845738 164.23828125 -76.20555675 165.07055137 -72.83984375 168.23828125 C-71.64101563 169.35203125 -71.64101563 169.35203125 -70.41796875 170.48828125 C-69.8146875 171.06578125 -69.21140625 171.64328125 -68.58984375 172.23828125 C-69.10316021 176.4139132 -71.62994641 178.8135703 -74.33984375 181.80078125 C-106.65789186 218.90589683 -125.03127451 268.27770958 -126.58984375 317.23828125 C-125.94917969 317.45742188 -125.30851562 317.6765625 -124.6484375 317.90234375 C-114.23717474 321.71928956 -109.20101287 326.58573153 -104.5078125 336.53125 C-102.24682836 343.1987479 -102.50231989 351.5848963 -105.15234375 358.11328125 C-109.21631323 365.79761791 -114.94774556 371.95147364 -123.29074097 374.82388306 C-126.74313366 375.44615419 -130.19116009 375.41167295 -133.68798828 375.43115234 C-134.50156296 375.43932983 -135.31513763 375.44750732 -136.15336609 375.45593262 C-138.84312213 375.48072183 -141.5328255 375.49728858 -144.22265625 375.51171875 C-145.14427425 375.51704243 -146.06589226 375.5223661 -147.01543808 375.5278511 C-151.89635129 375.55455822 -156.77723917 375.57393845 -161.65820312 375.58837891 C-165.68545333 375.60169992 -169.71219467 375.62952212 -173.73925781 375.67041016 C-178.61336345 375.71989114 -183.48700878 375.74451905 -188.36135483 375.75160599 C-190.21200462 375.75829284 -192.06264518 375.77344754 -193.91315079 375.7974968 C-206.12587012 375.94712325 -214.91746502 375.38065239 -224.46484375 366.98828125 C-231.1470559 359.57939827 -232.49803754 351.88567529 -232.0234375 342.11328125 C-230.82618333 331.41349625 -224.70286635 325.76020622 -216.58984375 319.23828125 C-216.7506543 318.71210205 -216.91146484 318.18592285 -217.07714844 317.64379883 C-220.10103922 307.65654757 -222.89109384 297.68362409 -224.83984375 287.42578125 C-224.9903418 286.64114502 -225.14083984 285.85650879 -225.29589844 285.0480957 C-225.76798186 282.44978035 -226.18832675 279.84847429 -226.58984375 277.23828125 C-226.76862061 276.08030029 -226.94739746 274.92231934 -227.1315918 273.72924805 C-228.63404234 263.0247062 -228.9490693 252.47591205 -228.90234375 241.67578125 C-228.90052094 240.79843323 -228.89869812 239.92108521 -228.89682007 239.01715088 C-228.84870254 225.22920651 -228.22036307 211.80622299 -225.58984375 198.23828125 C-225.42887207 197.3678418 -225.26790039 196.49740234 -225.10205078 195.60058594 C-217.81764001 157.15625091 -201.49380828 120.49366717 -176.58984375 90.23828125 C-176.14737305 89.69429688 -175.70490234 89.1503125 -175.24902344 88.58984375 C-164.06646156 74.9091338 -151.70868339 61.91017659 -137.58984375 51.23828125 C-137.02442871 50.80708984 -136.45901367 50.37589844 -135.87646484 49.93164062 C-97.20883278 20.54300717 -49.09458288 0.44607711 0 0 Z " fill="currentColor" transform="translate(231.58984375,2.76171875)"/>
<path d="M0 0 C1.66951555 -0.00134981 3.33903071 -0.00329297 5.00854492 -0.00579834 C8.49499277 -0.00873473 11.98133763 -0.00449999 15.46777344 0.00488281 C19.91597189 0.01627645 24.36392891 0.00970899 28.81211853 -0.00226212 C32.25583688 -0.00952097 35.69949886 -0.00717438 39.14321899 -0.00200653 C40.78252186 -0.00068115 42.42183001 -0.00227838 44.06112671 -0.00696564 C56.88878153 -0.03560284 67.8792191 0.03945901 77.8125 9.265625 C84.53830835 18.25152279 85.61270212 26.28820441 84.8125 37.265625 C82.6464761 45.95447517 76.67686301 51.91118956 69.8125 57.265625 C69.97331055 57.79704102 70.13412109 58.32845703 70.29980469 58.87597656 C73.24882937 68.69904737 76.04084633 78.51770643 78.0625 88.578125 C78.21299805 89.31514648 78.36349609 90.05216797 78.51855469 90.81152344 C81.28246307 105.1527919 82.1896937 119.19795236 82.125 133.765625 C82.12284485 134.6423587 82.1206897 135.51909241 82.11846924 136.4223938 C81.88947438 194.65790303 61.30060236 248.8240843 23.8125 293.265625 C22.47463955 294.92865987 21.14004333 296.59434278 19.8125 298.265625 C16.21892281 297.69571848 14.64000729 296.40180023 12.1875 293.765625 C9.77639084 291.14755854 9.77639084 291.14755854 6.8125 289.265625 C7.28259131 284.90944554 10.1695524 282.40026168 13 279.328125 C20.97154025 270.35103397 27.41287477 260.39648048 33.8125 250.265625 C34.4314917 249.29109375 34.4314917 249.29109375 35.06298828 248.296875 C48.55599186 226.77532413 57.12764256 201.14850785 61.8125 176.265625 C61.96203125 175.48364746 62.1115625 174.70166992 62.265625 173.89599609 C69.91762852 131.78523967 64.03992195 88.78221964 48.45166016 49.24487305 C47.8125 47.265625 47.8125 47.265625 47.8125 44.265625 C48.76511719 44.10707031 49.71773438 43.94851562 50.69921875 43.78515625 C51.95347656 43.55183594 53.20773437 43.31851563 54.5 43.078125 C55.74136719 42.85769531 56.98273438 42.63726562 58.26171875 42.41015625 C62.33003524 41.09880671 64.09264414 39.51027679 66.8125 36.265625 C68.54125745 32.80811009 68.16036254 29.05273224 67.8125 25.265625 C66.39521031 21.43060583 65.31688122 20.52295772 61.65968323 18.65707397 C57.84397596 17.10167295 54.45464184 16.88514525 50.32006836 16.87744141 C49.60691971 16.87218445 48.89377106 16.86692749 48.15901184 16.86151123 C45.82322695 16.84840597 43.48813445 16.85701408 41.15234375 16.8671875 C39.51762258 16.86516425 37.8829023 16.86225073 36.2481842 16.85848999 C32.83130249 16.85407968 29.41465689 16.86045663 25.99780273 16.87451172 C21.62761394 16.89161657 17.25797743 16.88174622 12.8878088 16.86379433 C9.51538461 16.85293299 6.1430905 16.85641334 2.77066231 16.8641777 C1.15958146 16.86617252 -0.45151136 16.86374579 -2.0625782 16.85673904 C-4.31685637 16.84908404 -6.57025026 16.8607836 -8.82446289 16.87744141 C-10.10462784 16.87982819 -11.38479279 16.88221497 -12.70375061 16.88467407 C-16.4824065 17.29787327 -18.88876077 18.4388245 -22.1875 20.265625 C-22.8475 20.265625 -23.5075 20.265625 -24.1875 20.265625 C-26.55450667 24.85170042 -26.76546155 29.21992891 -26.1875 34.265625 C-24.85725076 37.66515085 -23.76393848 38.89338676 -20.70849609 40.86645508 C-16.048275 42.7183291 -11.94757601 42.7432427 -6.9765625 42.77734375 C-5.52435806 42.80427055 -5.52435806 42.80427055 -4.04281616 42.83174133 C-0.96608773 42.88570295 2.1104868 42.91969489 5.1875 42.953125 C7.27996926 42.98631053 9.37241826 43.02080133 11.46484375 43.05664062 C16.58061789 43.14142146 21.69634751 43.20830028 26.8125 43.265625 C26.8125 48.545625 26.8125 53.825625 26.8125 59.265625 C16.9125 59.265625 7.0125 59.265625 -3.1875 59.265625 C-3.27 61.905625 -3.3525 64.545625 -3.4375 67.265625 C-4.37616327 87.71404339 -8.72562942 107.88001326 -15.1875 127.265625 C-3.3075 127.265625 8.5725 127.265625 20.8125 127.265625 C20.8125 132.545625 20.8125 137.825625 20.8125 143.265625 C6.6225 143.265625 -7.5675 143.265625 -22.1875 143.265625 C-22.8475 145.245625 -23.5075 147.225625 -24.1875 149.265625 C-25.33747149 151.75309331 -26.51099833 154.19887627 -27.75 156.640625 C-28.10296143 157.33687988 -28.45592285 158.03313477 -28.81958008 158.75048828 C-29.93250347 160.92738309 -31.0572866 163.09766126 -32.1875 165.265625 C-32.53200195 165.92949219 -32.87650391 166.59335937 -33.23144531 167.27734375 C-40.78617722 181.68237015 -49.96643452 195.39350339 -61.28515625 207.125 C-63.72110844 209.766856 -63.72110844 209.766856 -67.1875 215.265625 C-58.2775 224.175625 -49.3675 233.085625 -40.1875 242.265625 C-46.1875 249.265625 -46.1875 249.265625 -52.1875 254.265625 C-61.0975 245.355625 -70.0075 236.445625 -79.1875 227.265625 C-83.88268358 230.78701268 -88.29254427 234.14631776 -92.6875 237.953125 C-133.37232143 272.265625 -133.37232143 272.265625 -151.1875 272.265625 C-151.1875 286.125625 -151.1875 299.985625 -151.1875 314.265625 C-156.4675 314.265625 -161.7475 314.265625 -167.1875 314.265625 C-167.1875 302.715625 -167.1875 291.165625 -167.1875 279.265625 C-170.19875 280.173125 -173.21 281.080625 -176.3125 282.015625 C-214.21602091 293.02516939 -255.39463839 294.99013547 -294.04077148 286.67651367 C-298.44466058 285.83359938 -301.88171282 285.68527514 -306 287.515625 C-308.81343385 289.76637208 -309.97556644 291.76230961 -310.48046875 295.34375 C-310.24410885 300.21101303 -309.18054598 302.82919309 -305.5625 306.140625 C-303.79619793 307.54805935 -302.0006737 308.91911263 -300.1875 310.265625 C-299.02836886 311.15328427 -297.86953131 312.04132701 -296.7109375 312.9296875 C-265.80877251 336.33168183 -230.42377015 351.20359248 -192.1875 357.265625 C-191.09550293 357.44351563 -191.09550293 357.44351563 -189.98144531 357.625 C-134.08153436 366.36505122 -74.1722184 350.97032889 -28.5625 317.890625 C-24.74944011 315.09049478 -21.06033535 312.19789306 -17.49609375 309.0859375 C-16.61268311 308.31515869 -16.61268311 308.31515869 -15.71142578 307.52880859 C-14.5953849 306.54204377 -13.49020749 305.54281226 -12.39794922 304.52978516 C-8.7673449 301.2883005 -8.7673449 301.2883005 -6.08984375 301.18359375 C-3.47978021 302.66816788 -1.87189179 304.53909471 0.0625 306.828125 C1.12210937 308.06755859 1.12210937 308.06755859 2.203125 309.33203125 C2.73421875 309.97011719 3.2653125 310.60820312 3.8125 311.265625 C-4.59618192 330.92967803 -38.6900372 345.55458438 -57.1875 354.265625 C-57.83831543 354.57242187 -58.48913086 354.87921875 -59.15966797 355.1953125 C-116.03593831 381.70075887 -183.37782757 383.38866394 -242.19677734 362.29370117 C-267.1949137 353.05221767 -290.13376078 340.17032883 -310.9375 323.453125 C-311.58090332 322.93838623 -312.22430664 322.42364746 -312.88720703 321.89331055 C-320.31856815 315.76926395 -326.30383603 309.53130649 -327.50390625 299.6640625 C-327.87333441 291.20296604 -325.6540988 284.08953603 -320.4375 277.390625 C-315.82252856 272.4242598 -309.5424142 269.56735834 -302.79492188 269.09985352 C-295.89104718 269.05322298 -289.45367254 269.8836757 -282.6875 271.203125 C-228.26074659 281.59635794 -168.39270975 269.37896471 -122.26367188 238.68359375 C-101.25513126 224.33533365 -81.65565653 207.48804846 -66.46240234 186.98486328 C-65.2247902 185.31591178 -63.96696181 183.66384947 -62.70703125 182.01171875 C-35.25678537 145.4313772 -23.57293648 103.1357945 -19.1875 58.265625 C-20.24839844 58.1521875 -21.30929687 58.03875 -22.40234375 57.921875 C-28.54750188 56.85646059 -33.0186396 53.84979909 -37.0234375 49.078125 C-42.74615847 40.81507423 -44.14723117 33.23746589 -43.1875 23.265625 C-40.82324427 14.24732996 -36.4092272 8.88164468 -28.89453125 3.59765625 C-19.90216661 -0.8271581 -9.75932662 -0.02790492 0 0 Z " fill="currentColor" transform="translate(427.1875,132.734375)"/>
</svg>`;

  // ============================================================================
  // LEECH CALCULATION FUNCTIONS (from leeches.ts)
  // ============================================================================

  function calculateAccuracy(correct, incorrect) {
    const total = correct + incorrect;
    return total === 0 ? 100 : (correct / total) * 100;
  }

  function calculateLeechScore(stats) {
    const totalReviews =
      stats.meaning_correct +
      stats.meaning_incorrect +
      stats.reading_correct +
      stats.reading_incorrect;

    const overallAccuracy = calculateAccuracy(
      stats.meaning_correct + stats.reading_correct,
      stats.meaning_incorrect + stats.reading_incorrect
    );

    // Leech score factors:
    // - Lower accuracy = higher score
    // - More total reviews = higher score (indicates repeated struggles)
    // - Lower streaks = higher score
    const accuracyPenalty = Math.max(0, 100 - overallAccuracy);
    const volumePenalty = Math.min(50, totalReviews * 0.5);
    const streakPenalty = Math.max(
      0,
      10 - Math.min(stats.meaning_current_streak, stats.reading_current_streak)
    );

    return accuracyPenalty + volumePenalty + streakPenalty;
  }

  function identifyLeeches(reviewStats, burnedSubjectIds) {
    const candidates = [];

    for (const stat of reviewStats) {
      const data = stat.data;

      // Skip if hidden or no review data
      if (data.hidden) continue;

      // Skip if subject is burned
      if (burnedSubjectIds.has(data.subject_id)) continue;

      const totalReviews =
        data.meaning_correct +
        data.meaning_incorrect +
        data.reading_correct +
        data.reading_incorrect;

      // Only consider items with minimum reviews
      if (totalReviews < CONFIG.MIN_REVIEWS) continue;

      const overallAccuracy = calculateAccuracy(
        data.meaning_correct + data.reading_correct,
        data.meaning_incorrect + data.reading_incorrect
      );

      const meaningAccuracy = calculateAccuracy(
        data.meaning_correct,
        data.meaning_incorrect
      );
      const readingAccuracy = calculateAccuracy(
        data.reading_correct,
        data.reading_incorrect
      );

      const leechScore = calculateLeechScore(data);

      // Filter by leech score threshold
      if (leechScore >= CONFIG.LEECH_SCORE_THRESHOLD) {
        candidates.push({
          subject_id: data.subject_id,
          subject_type: data.subject_type,
          total_reviews: totalReviews,
          accuracy: Math.round(overallAccuracy * 100) / 100,
          meaning_accuracy: Math.round(meaningAccuracy * 100) / 100,
          reading_accuracy: Math.round(readingAccuracy * 100) / 100,
          leech_score: Math.round(leechScore * 100) / 100,
        });
      }
    }

    // Sort by leech score (worst first) and limit
    return candidates
      .sort((a, b) => b.leech_score - a.leech_score)
      .slice(0, CONFIG.MAX_LEECHES_DISPLAY);
  }

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  async function fetchLeechesData() {
    // Check if WKOF is available
    if (!unsafeWindow.wkof) {
      console.error("WaniKani Open Framework not found");
      return null;
    }

    try {
      // Fetch review statistics
      console.log("Fetching review statistics...");
      const reviewStatsResponse = await unsafeWindow.wkof.Apiv2.fetch_endpoint(
        "review_statistics"
      );
      const reviewStats = reviewStatsResponse.data;
      console.log(`Fetched ${reviewStats.length} review statistics`);

      // Fetch assignments to identify burned items
      console.log("Fetching assignments...");
      const assignmentsResponse = await unsafeWindow.wkof.Apiv2.fetch_endpoint(
        "assignments"
      );
      const assignments = assignmentsResponse.data;

      const burnedSubjectIds = new Set();
      assignments.forEach((assignment) => {
        if (assignment.data.burned_at !== null) {
          burnedSubjectIds.add(assignment.data.subject_id);
        }
      });
      console.log(`Found ${burnedSubjectIds.size} burned subjects`);

      // Identify leeches
      const leeches = identifyLeeches(reviewStats, burnedSubjectIds);
      console.log(`Found ${leeches.length} leeches`);

      if (leeches.length === 0) {
        return { leeches: [], subjects: {} };
      }

      // Fetch subject details for leeches
      console.log("Fetching subject details...");
      const subjectIds = leeches.map((l) => l.subject_id);
      const subjectsResponse = await unsafeWindow.wkof.Apiv2.fetch_endpoint(
        "subjects",
        {
          ids: subjectIds.join(","),
        }
      );
      const subjects = {};
      subjectsResponse.data.forEach((subject) => {
        subjects[subject.id] = subject.data;
      });

      return { leeches, subjects };
    } catch (error) {
      console.error("Error fetching leeches data:", error);
      return null;
    }
  }

  // ============================================================================
  // UI RENDERING
  // ============================================================================

  function getSubjectTypeColor(type) {
    switch (type) {
      case "radical":
        return "#00a1f1";
      case "kanji":
        return "#f100a1";
      case "vocabulary":
        return "#a100f1";
      default:
        return "#888";
    }
  }

  function getSubjectUrl(type, subject) {
    // WaniKani URLs use slugs for subjects
    const slug = subject.slug || subject.characters || "";
    return `https://www.wanikani.com/${type}/${slug}`;
  }

  function getPrimaryReading(subject, type) {
    if (type === "radical") return "N/A";
    if (!subject.readings || subject.readings.length === 0) return "";

    const primaryReading = subject.readings.find((r) => r.primary);
    return primaryReading
      ? primaryReading.reading
      : subject.readings[0].reading;
  }

  function getPrimaryMeaning(subject) {
    if (!subject.meanings || subject.meanings.length === 0) return "";

    const primaryMeaning = subject.meanings.find((m) => m.primary);
    return primaryMeaning
      ? primaryMeaning.meaning
      : subject.meanings[0].meaning;
  }

  function leechesWidgetTemplate({ subtitle = "", subjects = "" }) {
    return `
            <div class="leeches-widget">
                <div class="leeches-widget__header">
                    <h2 class="leeches-widget__title">${leechIcon} Leeches</h2>
                    ${subtitle}
                </div>
                ${
                  subjects !== ""
                    ? `<div class="leeches-widget__subjects">${subjects}</div>`
                    : ""
                }
            </div>
        `;
  }

  function renderLeechesWidget(data) {
    const { leeches, subjects } = data;

    if (leeches.length === 0) {
      return leechesWidgetTemplate({
        subtitle: "Your items are in good health.</p>",
      });
    }

    const leechItems = leeches
      .map((leech) => {
        const subject = subjects[leech.subject_id];
        if (!subject) return "";

        const characters = subject.characters || `[${leech.subject_type}]`;
        const reading = getPrimaryReading(subject, leech.subject_type);
        const meaning = getPrimaryMeaning(subject);
        const url = getSubjectUrl(leech.subject_type, subject);
        const color = getSubjectTypeColor(leech.subject_type);
        const typeClass = `subject-character--${leech.subject_type}`;

        return `
                <div class="leech-subject">
                    <a href="${url}"
                       target="_blank" rel="noopener noreferrer"
                       class="subject-character subject-character--small subject-character--unlocked ${typeClass}"
                       style="--subject-color: ${color}">
                        <div class="subject-character__content">
                            <span class="subject-character__characters">
                                <span class="subject-character__characters-text" lang="ja">${characters}</span>
                            </span>
                        </div>
                    </a>
                    <div class="leech-subject__popover">
                        <div class="leech-popover">
                            <div class="leech-popover__reading">${reading}</div>
                            <div class="leech-popover__meaning">${meaning}</div>
                            <div class="leech-popover__stats">
                                <div class="leech-popover__stat">Level ${
                                  subject.level
                                }</div>
                                <div class="leech-popover__stat">Accuracy: ${leech.accuracy.toFixed(
                                  1
                                )}%</div>
                                <div class="leech-popover__stat">${
                                  leech.total_reviews
                                } reviews</div>
                                <div class="leech-popover__stat leech-popover__stat--score">Leech Score: ${leech.leech_score.toFixed(
                                  1
                                )}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    return leechesWidgetTemplate({
      subtitle: "Items that could use some extra study time.",
      subjects: leechItems,
    });
  }

  function injectWidget(html) {
    const dashboardContent = document.querySelector(".dashboard__content");
    if (!dashboardContent) {
      console.warn("Dashboard content not found");
      return;
    }

    // Create widget container
    const widgetRow = document.createElement("div");
    widgetRow.className = "dashboard__row leeches-widget-row";
    widgetRow.innerHTML = `
            <div class="dashboard__widget dashboard__widget--full-width">
                ${html}
            </div>
        `;

    // Insert after the first row
    const firstRow = dashboardContent.querySelector(".dashboard__row");
    if (firstRow && firstRow.nextSibling) {
      dashboardContent.insertBefore(widgetRow, firstRow.nextSibling);
    } else {
      dashboardContent.appendChild(widgetRow);
    }
  }

  // ============================================================================
  // STYLING
  // ============================================================================

  GM_addStyle(`
        .leeches-widget {
            padding: var(--spacing-normal);
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #CAD0D6;;
            font: inherit;
        }

        .leeches-widget__header {
            text-align: center;
            margin-bottom: var(--spacing-normal);
        }

        .leeches-widget__title {
            margin: 0 0 var(--spacing-xtight) 0;
            font-size: var(--font-size-medium);
            font-weight: var(--font-weight-heavy);
            color: #232629;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xtight);
        }

        .leeches-widget__subtitle {
            margin: 0;
            font-size: var(--font-size-normal);
            color: var(--color-widget-secondary-text);
            font-weight: 400;
        }

        .leeches-widget__subjects {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px 8px;
            margin-bottom: var(--spacing-normal);
        }

        .leeches-widget__button-wrapper {
            text-align: center;
        }

        .leech-subject {
            position: relative;
            flex-shrink: 0;
        }

        .leech-subject__popover {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
            pointer-events: none;
            z-index: 1000;
        }

        .leech-subject:hover .leech-subject__popover {
            opacity: 1;
            visibility: visible;
        }

        .leech-popover {
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 200px;
            text-align: left;
        }

        .leech-popover::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid white;
        }

        .leech-popover__reading {
            font-size: 16px;
            font-weight: 600;
            color: #232629;
            margin-bottom: 4px;
        }

        .leech-popover__meaning {
            font-size: 14px;
            color: #888888;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e5e5;
        }

        .leech-popover__stats {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .leech-popover__stat {
            font-size: 13px;
            color: #666666;
        }

        .leech-popover__stat--score {
            color: #e8503a;
            font-weight: 600;
            margin-top: 4px;
        }

        @media (max-width: 768px) {
            .leeches-widget {
                padding: var(--spacing-tight);
            }

            .leeches-widget__subjects {
                justify-content: flex-start;
            }
        }
    `);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  async function initialize() {
    // Only run on dashboard
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/dashboard"
    ) {
      return;
    }

    console.log("Leeches widget: Initializing...");

    // Wait for dashboard to load
    const waitForDashboard = setInterval(() => {
      const dashboard = document.querySelector(".dashboard__content");
      if (dashboard) {
        clearInterval(waitForDashboard);
        console.log("Leeches widget: Dashboard found, loading leeches...");
        loadAndDisplayLeeches();
      }
    }, 500);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(waitForDashboard);
      console.log("Leeches widget: Timeout waiting for dashboard");
    }, 10000);
  }

  async function loadAndDisplayLeeches() {
    console.log("Loading leeches data...");

    // Show loading state
    const loadingHtml = leechesWidgetTemplate({
      subtitle: "Loading...",
    });
    injectWidget(loadingHtml);

    const data = await fetchLeechesData();

    // Remove loading widget
    const existingWidget = document.querySelector(".leeches-widget-row");
    if (existingWidget) {
      existingWidget.remove();
    }

    if (data) {
      const html = renderLeechesWidget(data);
      injectWidget(html);
    } else {
      const errorHtml = leechesWidgetTemplate({
        subtitle: "Error loading data. Please refresh the page.",
      });
      injectWidget(errorHtml);
    }
  }
})();
