// ==UserScript==
// @name         PMD+
// @namespace    https://github.com/PieroLB/pmd-plus
// @version      0.4.6
// @description  Extension qui ajoute des fonctionnalités (timer, pilote automatique et plan dynamique) dans le jeu PMD.
// @author       PieroLB
// @match        https://pmdapp.fr/*
// @match        https://www.pmdapp.fr/*
// @icon         https://lh3.googleusercontent.com/dJpt27Lfg0upeK1rRqPk8W5pMv5JAdOVeCIlM28XQ3o_SL-pCIPH51dnZzPY7lcCNf_tWSOkC-4lzTCToIPGDI3vizk=s60
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547955/PMD%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/547955/PMD%2B.meta.js
// ==/UserScript==

const auto = () => {
  var auto = false;
  const TIME_RINGING_DOORS = 3000; // en millisecondes
  const TIME_MIN_DOORS_OPENED = 3000; // en millisecondes
  const TIME_CLOSING_OPENING_DOORS = 3000; // en millisecondes
  const TIME_MIN_DEPARTURE = 70; // en secondes
  const SPEED_PADDING_BOTTOM = 2; // en km/h
  const TIME_IN_STATION = 40;
  var eventInStation = false;
  var depart = false;
  var deceleration = 0;
  var limiteMaxDecelerationAtteinte = false;
  var limiteMinDecelerationAtteinte = false;
  var decelerationComplete = false;
  var decelerationAvtStation = false;
  const getTime = (station1, station2) => {
    let t = 0;
    let listSpeedLimits = {};
    if (typeof speedLimitNG !== "undefined") {
      listSpeedLimits = speedLimitNG;
    } else if (typeof speedLimits !== "undefined") {
      speedLimits.forEach((l) => {
        listSpeedLimits[l.start] = l.limit;
      });
    }
    let listPos = Object.keys(listSpeedLimits);
    let posAvt = listPos[0];
    if (station1.end < posAvt && station2.start < posAvt) {
      // Permet de gérer les garages qui nont pas de speedLimit (elles arrivent après). Ex : ligne 3
      let v = localSpeedLimit / 3.6;
      let d = (station2.start - station1.end) / 75;
      t = d / v;
    } else if (station1.end < posAvt) {
      let v = localSpeedLimit / 3.6;
      let d = (posAvt - station1.end) / 75;
      t += d / v;
    } else if (listPos.length == 1) {
      // Permet de gérer sil y a quune seule speedLimit sur toute la ligne. Ex : ligne 7bis et 9
      let v = listSpeedLimits[posAvt] / 3.6;
      let d = (station2.start - Math.max(station1.end, posAvt)) / 75;
      t = d / v;
    } else if (listPos.length == 0) {
      // Permet de gérer sil y a aucune speedLimit sur toute la ligne. Ex : ligne 13 et 12
      let v = localSpeedLimit / 3.6;
      let d = (station2.start - station1.end) / 75;
      t = d / v;
    } else {
      for (let i = 1; i < listPos.length; i++) {
        if (listPos[i] >= station1.end && listPos[i] <= station2.start) {
          let v = listSpeedLimits[posAvt] / 3.6;
          let d = (listPos[i] - Math.max(station1.end, posAvt)) / 75;
          t += d / v;
        } else if (listPos[i] > station2.start) {
          let v = listSpeedLimits[posAvt] / 3.6;
          let d = (station2.start - posAvt) / 75;
          t += d / v;
          break;
        }
        posAvt = listPos[i];
      }
    }
    return t;
  };
  var timeToGoNextStation = null;
  var lastStation = null;
  var terminus = false;
  var isDoorOpened = false;
  const AUTOcloseDoor = (t = TIME_RINGING_DOORS) => {
    isDoorOpened = false;
    if (NADOMAS) {
      KEYBOARD_DOWN["KeyO"] = false;
      KEYBOARD_DOWN["KeyF"] = true;
      t = TIME_RINGING_DOORS;
    } else {
      closeDoor();
    }
    setTimeout(() => {
      if (areDoorFullyClosed() == false) {
        // ECHEC DE LA FERMETURE => REOUVERTURE
        isDoorOpened = true;
        if (NADOMAS) {
          KEYBOARD_DOWN["KeyF"] = false;
          KEYBOARD_DOWN["KeyO"] = true;
        } else {
          doorOpen();
        }
        AUTOcloseDoor(0);
      } else {
        if (NADOMAS) {
          KEYBOARD_DOWN["KeyF"] = false;
          KEYBOARD_DOWN["KeyO"] = false;
        }
        decelerationAvtStation = false;
        depart = true;
      }
    }, t);
  };
  setInterval(() => {
    if (auto) {
      if (!eventInStation) {
        // ON EST DANS UNE STATION ET IL NE FAUT PAS PARTIR
        if (
          !depart &&
          UTILS.isStation() &&
          ((!UTILS.isStation().closed &&
            UTILS.isStation().allowPassengers &&
            UTILS.isStation().freq > 0) ||
            zoneStations.indexOf(UTILS.isStation()) == zoneStations.length - 1)
        ) {
          if (
            zoneStations.indexOf(UTILS.isStation()) ==
            zoneStations.length - 1
          )
            terminus = true;
          if (!terminus && lastStation != UTILS.isStation()) {
            timeToGoNextStation = getTime(
              UTILS.isStation(),
              zoneStations[zoneStations.indexOf(UTILS.isStation()) + 1]
            );
            lastStation = UTILS.isStation();
          }

          // A LARRET
          if (currentSpeed == 0) {
            if (!isDoorOpened) {
              console.log("OUVERTURE DES PORTES");
              console.log(KEYBOARD_DOWN);
              isDoorOpened = true;
              eventInStation = true;
              if (NADOMAS) {
                KEYBOARD_DOWN["KeyF"] = false;
                KEYBOARD_DOWN["KeyO"] = true;
                // let loop = setInterval(()=>{
                //   if (doorOpened){
                //     KEYBOARD_DOWN["KeyO"] = false;
                //     clearInterval(loop)
                //   }
                // });
              } else {
                doorOpen();
              }
              setTimeout(() => {
                eventInStation = false;
              }, TIME_CLOSING_OPENING_DOORS + TIME_MIN_DOORS_OPENED); // TEMPS MINIMUM DE LOUVERTURE A LA FERMETURE DES PORTES
            } else if (
              (terminus && UTILS.getModule("Passagers").onBoard.length == 0) ||
              (!terminus &&
                timeBeforeArriving <=
                  timeToGoNextStation +
                    (TIME_CLOSING_OPENING_DOORS + TIME_RINGING_DOORS) / 1000 +
                    8)
            ) {
              console.log("FERMETURE DES PORTES");
              eventInStation = true;
              AUTOcloseDoor();
              setTimeout(() => {
                eventInStation = false;
              }, TIME_RINGING_DOORS + TIME_CLOSING_OPENING_DOORS + 1000); // TEMPS MINIMUM DE LOUVERTURE A LA FERMETURE DES PORTES
            }
          }
          // IL FAUT RALENTIR POUR SARRETER EN STATION
          else {
            let virtualSpeed = currentSpeed;
            let virtualPosition = 0;
            while (virtualSpeed > 0) {
              virtualSpeed += 1 * ((-13 / 80) * 1.2) * 1.2;
              virtualPosition += (virtualSpeed / 3) * 1.3 * 1;
            }
            virtualPosition = -globalTranslate + virtualPosition;

            if (virtualPosition >= UTILS.isStation().end) {
              currentThrottle = -11;
              limiteMaxDecelerationAtteinte = true;
            } else if (
              limiteMaxDecelerationAtteinte &&
              !limiteMinDecelerationAtteinte &&
              currentSpeed <= 33
            ) {
              currentThrottle = 0;
              limiteMinDecelerationAtteinte = true;
            } else if (!limiteMaxDecelerationAtteinte) {
              currentThrottle = 0;
            }
          }
        } else {
          // ON SORT DUNE STATION
          if (!UTILS.isFullyInStation() && depart)
            depart =
              limiteMinDecelerationAtteinte =
              limiteMaxDecelerationAtteinte =
                false;
          // ON RALENTIT AVANT LA STATION TELLEMENT ON VA VITE
          if (
            decelerationAvtStation ||
            (currentSpeed > 80 && nextStation.start + globalTranslate <= 10000)
          ) {
            currentThrottle = -5;
            decelerationAvtStation = true;
          }
          // ADAPTION DE LA VITESSE DE ROULEMENT
          else {
            let speedLim = UTILS.currentSpeedLimit();
            if (currentSpeed < speedLim - SPEED_PADDING_BOTTOM) {
              currentThrottle = 5;
            }
            if (currentSpeed >= speedLim + 1) {
              currentThrottle = -9;
            }
            if (currentSpeed < speedLim + 1 && currentSpeed > speedLim) {
              if (speedLim > 80) {
                currentThrottle = 3;
              } else if (speedLim > 50) {
                currentThrottle = 1;
              } else {
                currentThrottle = 0;
              }
            }
          }
        }
      }
    }
  });

  document.getElementById("auto").addEventListener("click", () => {
    auto = !auto;
    if (!auto) {
      if (currentThrottle > 0) currentThrottle = 0;
      KEYBOARD_DOWN["KeyF"] = KEYBOARD_DOWN["KeyO"] = false;
    }
    document.getElementById("auto").style.backgroundColor = auto
      ? "green"
      : "darkred";
  });
};

const plan = () => {
  // document.getElementById("plan").addEventListener("click", (event) => {
  //   if (modules[2].displayMode) modules[2].displayMode = 0;
  // });
  const listLignes = {
    Metro: {
      img: null,
      lignes: {
        1: { img: null },
        2: { img: null },
        3: { img: null },
        "3bis": { img: null },
        4: { img: null },
        5: { img: null },
        6: { img: null },
        7: { img: null },
        "7bis": { img: null },
        8: { img: null },
        9: { img: null },
        10: { img: null },
        11: { img: null },
        12: { img: null },
        13: { img: null },
        14: { img: null },
      },
    },
    RER: {
      img: null,
      lignes: {
        A: { img: null },
        B: { img: null },
        C: { img: null },
        D: { img: null },
        E: { img: null },
      },
    },
    Transilien: {
      img: null,
      lignes: {
        H: { img: null },
        J: { img: null },
        K: { img: null },
        L: { img: null },
        N: { img: null },
        P: { img: null },
        R: { img: null },
        U: { img: null },
      },
    },
    Tramway: {
      img: null,
      lignes: {
        T1: { img: null },
        T2: { img: null },
        T3a: { img: null },
        T3b: { img: null },
        T4: { img: null },
        T5: { img: null },
        T6: { img: null },
        T7: { img: null },
        T8: { img: null },
        T9: { img: null },
        T10: { img: null },
        T11: { img: null },
        T12: { img: null },
        T13: { img: null },
      },
    },
    Autres: {
      img: null,
      lignes: {
        RoissyBus: { img: null },
        OrlyBus: { img: null },
        OrlyVal: { img: null },
        Tvm: { img: null },
        TER: { img: null },
      },
    },
  };
  var accessibleImg = null;
  var addImg = null;
  const urlAssets =
    "https://raw.githubusercontent.com/PieroLB/pmd-tools-assets/main/plan/";
  const refHeight = 190;
  var padX = 0;
  class PLANStation {
    static stations = [];
    static storage;
    static planIndex;
    static canvas;
    static ctx;
    static colorLine = "#FECE03";
    static photo = false;
    static logoImg = null;
    static closedImg = null;
    static widthTot = 40;
    static y = 90;
    static arc = { width: 20 };
    static rect = { width: 50, height: 7 };
    static bgText = { padding: { y: 3, x: 6 } };
    static text = { nom: 10, tourist: 9 };
    static rectCorres = { width: 2, height: 10 };
    static imgCorres = { width: 15 };
    static scrollValue = false;
    static loadingImg = () => {
      const promises = [];

      const accessibleImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}accessible.svg`;
        img.onload = () => {
          accessibleImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(accessibleImgPromise);
      const addImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}add.svg`;
        img.onload = () => {
          addImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(addImgPromise);
      const logoImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}PMD.svg`;
        img.onload = () => {
          PLANStation.logoImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(logoImgPromise);
      const closedImgPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = `${urlAssets}closed.svg`;
        img.onload = () => {
          PLANStation.closedImg = img;
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${type}`));
      });
      promises.push(closedImgPromise);

      Object.keys(listLignes).forEach((type) => {
        if (type != "Autres") {
          const mainImgPromise = new Promise((resolve, reject) => {
            let img = new Image();
            img.src = `${urlAssets}${type}/${type}.svg`;
            img.onload = () => {
              listLignes[type].img = img;
              resolve();
            };
            img.onerror = () =>
              reject(new Error(`Failed to load image: ${type}`));
          });
          promises.push(mainImgPromise);
        }

        Object.keys(listLignes[type].lignes).forEach((ligne) => {
          const ligneImgPromise = new Promise((resolve, reject) => {
            let img = new Image();
            img.src = `${urlAssets}${type}/${ligne}.svg`;
            img.onload = () => {
              listLignes[type].lignes[ligne].img = img;
              listLignes[type].lignes[ligne].coef = null;
              if (img.naturalHeight != 0 && img.naturalHeight != 0)
                listLignes[type].lignes[ligne].coef =
                  img.naturalWidth / img.naturalHeight;
              resolve();
            };
            img.onerror = () =>
              reject(new Error(`Failed to load image: ${type}-${ligne}`));
          });
          promises.push(ligneImgPromise);
        });
      });

      return Promise.all(promises)
        .then(() => {
          return;
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors du chargement des images :",
            error
          );
          throw error;
        });
    };
    constructor(
      nom = `PLANStation n°${PLANStation.stations.length + 1}`,
      lieuTouristique = "",
      accessible = false,
      correspondances = [],
      stationInPMD = null,
      pos = PLANStation.stations.length
    ) {
      this.nom =
        nom == "" ? `PLANStation n°${PLANStation.stations.length + 1}` : nom;
      this.lieuTouristique = lieuTouristique;
      this.correspondances = correspondances;
      this.accessible = accessible;
      this.closed = closed;
      this.clignote = false;
      this.stationInPMD = stationInPMD;
      PLANStation.widthTot = Math.min(
        PLANStation.widthTot + PLANStation.arc.width + PLANStation.rect.width,
        1024
      );
      PLANStation.stations.splice(pos, 0, this);
      let x = 20;
      PLANStation.stations.forEach((station) => {
        station.x = x;
        x += PLANStation.arc.width + PLANStation.rect.width;
      });
    }
    render() {
      // LIGNE
      if (
        PLANStation.stations.indexOf(this) !=
        PLANStation.stations.length - 1
      ) {
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.rect(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y +
            PLANStation.arc.width / 2 -
            PLANStation.rect.height / 2,
          PLANStation.rect.width + (3 / 2) * PLANStation.arc.width,
          PLANStation.rect.height
        );
        PLANStation.ctx.fill();
        PLANStation.ctx.closePath();
      }
      // CORRESPONDANCES
      if (this.correspondances.length > 0) {
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "#15388D";
        PLANStation.ctx.rect(
          padX +
            this.x +
            PLANStation.arc.width / 2 -
            PLANStation.rectCorres.width / 2,
          PLANStation.y + PLANStation.arc.width - 2,
          PLANStation.rectCorres.width,
          PLANStation.rectCorres.height / 2
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        let y = 0;
        Object.keys(listLignes).forEach((type) => {
          if (
            this.correspondances.some((l) =>
              Object.keys(listLignes[type].lignes).includes(l)
            )
          ) {
            PLANStation.ctx.beginPath();
            PLANStation.ctx.fillStyle = "#15388D";
            PLANStation.ctx.rect(
              padX +
                this.x +
                PLANStation.arc.width / 2 -
                PLANStation.rectCorres.width / 2,
              PLANStation.y + (PLANStation.arc.width - 3) + y + 3,
              PLANStation.rectCorres.width,
              PLANStation.rectCorres.height - 3
            );
            PLANStation.ctx.closePath();
            PLANStation.ctx.fill();

            let X = 0;
            let n = 0;
            if (listLignes[type].img != null) {
              PLANStation.ctx.drawImage(
                listLignes[type].img,
                padX +
                  this.x +
                  PLANStation.arc.width / 2 -
                  PLANStation.imgCorres.width / 2,
                y +
                  PLANStation.y +
                  PLANStation.arc.width +
                  PLANStation.rectCorres.height,
                PLANStation.imgCorres.width,
                PLANStation.imgCorres.width
              );
            } else {
              y -= PLANStation.imgCorres.width + 3;
            }
            let yAvt = y;
            Object.keys(listLignes[type].lignes).forEach((ligne) => {
              if (this.correspondances.includes(ligne)) {
                if (listLignes[type].img != null && n != 0 && n % 3 == 0) {
                  y += PLANStation.imgCorres.width + 3;
                  X = 0;
                }
                if (listLignes[type].img != null) {
                  X += PLANStation.imgCorres.width + 3;
                } else {
                  y += PLANStation.imgCorres.width + 3;
                }
                let h = PLANStation.imgCorres.width;
                let w = PLANStation.imgCorres.width;
                if (
                  listLignes[type].lignes[ligne].coef != null &&
                  listLignes[type].lignes[ligne].coef != 1
                ) {
                  h -= 5;
                  w = h * listLignes[type].lignes[ligne].coef;
                }
                PLANStation.ctx.drawImage(
                  listLignes[type].lignes[ligne].img,
                  padX +
                    X +
                    this.x +
                    PLANStation.arc.width / 2 -
                    PLANStation.imgCorres.width / 2,
                  y +
                    PLANStation.y +
                    PLANStation.arc.width +
                    PLANStation.rectCorres.height,
                  w,
                  h
                );
                n++;
              }
            });
            if (listLignes[type].img != null) {
              PLANStation.ctx.beginPath();
              PLANStation.ctx.fillStyle = "#15388D";
              PLANStation.ctx.rect(
                padX +
                  this.x +
                  PLANStation.arc.width / 2 -
                  PLANStation.rectCorres.width / 2,
                PLANStation.y +
                  (PLANStation.arc.width - 3) +
                  yAvt +
                  3 +
                  2 * (PLANStation.imgCorres.width + 3),
                PLANStation.rectCorres.width,
                y - yAvt
              );
              PLANStation.ctx.closePath();
              PLANStation.ctx.fill();
            }
            y += 2 * PLANStation.imgCorres.width - 3;
          }
        });
      }
      // CERCLE
      if (
        this.correspondances.length > 0 &&
        (PLANStation.stations.indexOf(this) == 0 ||
          PLANStation.stations.indexOf(this) == PLANStation.stations.length - 1)
      ) {
        // Il y a au moins une correspondance et c'est un terminus
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "black";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "white";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 3,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 5,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      } else if (
        PLANStation.stations.indexOf(this) == 0 ||
        PLANStation.stations.indexOf(this) == PLANStation.stations.length - 1
      ) {
        // C'est un terminus
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "black";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 5,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      } else if (this.correspondances.length > 0) {
        // C'est une station avec au moins une correspondance
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "black";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "white";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 3,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      } else {
        // C'est une station sans rien
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = PLANStation.colorLine;
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      }
      if (this.closed) {
        PLANStation.ctx.drawImage(
          PLANStation.closedImg,
          padX + this.x - 7,
          PLANStation.y - 7,
          PLANStation.arc.width + 14,
          PLANStation.arc.width + 14
        );
      } else if (this.clignote) {
        PLANStation.ctx.beginPath();
        PLANStation.ctx.fillStyle = "yellow";
        PLANStation.ctx.arc(
          padX + this.x + PLANStation.arc.width / 2,
          PLANStation.y + PLANStation.arc.width / 2,
          PLANStation.arc.width / 2 - 3,
          0,
          2 * Math.PI
        );
        PLANStation.ctx.closePath();
        PLANStation.ctx.fill();
      }
      // TEXT
      PLANStation.ctx.translate(
        padX + this.x + PLANStation.arc.width / 2,
        PLANStation.y - 5
      );
      PLANStation.ctx.rotate(-30 * (Math.PI / 180));
      PLANStation.ctx.beginPath();
      if (this.lieuTouristique != "") {
        PLANStation.ctx.font = `italic ${PLANStation.text.tourist}px Arial`;
        let widthText = PLANStation.ctx.measureText(this.lieuTouristique).width;
        PLANStation.ctx.fillStyle = "#865200";
        PLANStation.ctx.rect(
          -PLANStation.bgText.padding.x + 15,
          -PLANStation.text.tourist +
            PLANStation.text.nom / 2 +
            PLANStation.bgText.padding.y * 2 +
            1,
          widthText + PLANStation.bgText.padding.x * 2,
          PLANStation.text.tourist + PLANStation.bgText.padding.y * 2
        );
        PLANStation.ctx.fill();
        PLANStation.ctx.fillStyle = "white";
        PLANStation.ctx.fillText(
          this.lieuTouristique,
          15,
          PLANStation.text.nom / 2 + PLANStation.bgText.padding.y * 2 + 2
        );
      }
      PLANStation.ctx.closePath();
      PLANStation.ctx.beginPath();
      PLANStation.ctx.fillStyle = "#15388D";
      PLANStation.ctx.font = `bold ${PLANStation.text.nom}px Arial`;
      let y = 0;
      let widthText = PLANStation.ctx.measureText(this.nom).width;
      if (
        PLANStation.stations.indexOf(this) == 0 ||
        PLANStation.stations.indexOf(this) == PLANStation.stations.length - 1
      ) {
        PLANStation.ctx.rect(
          -PLANStation.bgText.padding.y,
          -PLANStation.text.nom - PLANStation.bgText.padding.x,
          widthText + PLANStation.bgText.padding.x * 2,
          PLANStation.text.nom + PLANStation.bgText.padding.y * 2
        );
        PLANStation.ctx.fill();
        PLANStation.ctx.fillStyle = "white";
        y = -PLANStation.bgText.padding.y - 1;
      }
      PLANStation.ctx.fillText(this.nom, PLANStation.bgText.padding.x / 4, y);
      if (this.accessible)
        PLANStation.ctx.drawImage(
          accessibleImg,
          padX + widthText + PLANStation.canvas.height * (10 / refHeight),
          -PLANStation.text.nom + PLANStation.bgText.padding.y,
          PLANStation.text.nom,
          PLANStation.text.nom
        );
      PLANStation.ctx.closePath();
      PLANStation.ctx.resetTransform();
    }
    event(type, x, y) {
      if (type == "click") {
        let arc = { x: this.x, y: PLANStation.y };
        console.log("lol");
        if (
          x >= arc.x &&
          x <= arc.x + PLANStation.arc.width &&
          y >= arc.y &&
          y <= arc.y + PLANStation.arc.width
        ) {
          // Click sur une station pour la modifier
          this.closed = !this.closed;
        }
      }
    }
  }

  let nextStationPLAN;
  let isInStation = UTILS.isStation() != undefined ? true : false;
  const update = () => {
    requestAnimationFrame(update);

    PLANStation.canvas.height = 200;
    PLANStation.canvas.width = PLANStation.widthTot;

    PLANStation.ctx.clearRect(
      0,
      0,
      PLANStation.canvas.width,
      PLANStation.canvas.height
    );
    // Background blanc
    PLANStation.ctx.beginPath();
    PLANStation.ctx.fillStyle = "white";
    PLANStation.ctx.rect(
      0,
      0,
      PLANStation.canvas.width,
      PLANStation.canvas.height
    );
    PLANStation.ctx.closePath();
    PLANStation.ctx.fill();
    // Rendus des stations
    // if (!modules[2].displayMode) {
    if (UTILS.isStation() == undefined && isInStation == true) {
      // Sortie de station
      document.getElementById("plan").style.display = "none";
      isInStation = false;
    } else if (UTILS.isStation() && isInStation == false) {
      // Entrée une station
      setTimeout(() => {
        document.getElementById("plan").style.display = "block";
        isInStation = true;
      }, 800);
    } else {
      isInStation = UTILS.isStation() != undefined ? true : false;
    }
    // }
    nextStationPLAN =
      getNextStation() == false ? nextStationPLAN : getNextStation();
    PLANStation.stations.forEach((station) => {
      if (station.nom == nextStationPLAN.name) {
        if (padX + station.x < 0) {
          padX = -Math.max(
            0,
            (PLANStation.stations.indexOf(station) + 1) *
              (PLANStation.arc.width + PLANStation.rect.width) -
              1024
          );
        } else if (padX + station.x > 1024) {
          padX = -1024;
        }
      }
      station.render();
    });
  };

  PLANStation.canvas = document.getElementById("canvasPlan");
  PLANStation.ctx = PLANStation.canvas.getContext("2d");
  PLANStation.loadingImg().then(() => {
    fetch(
      "https://raw.githubusercontent.com/PieroLB/pmd-tools-assets/main/plan/data.json"
    )
      .then((resp) => resp.json())
      .then((resp) => {
        let line = new URLSearchParams(location.search).get("line");
        if (resp) {
          PLANStation.colorLine = resp[line].color;
          resp[line].stations.forEach((station) => {
            let stationInPMD = zoneStations.find(
              (s) =>
                s.name == station.nom ||
                s.name == station.nom + " v1" ||
                s.name == station.nom + " v2"
            );
            new PLANStation(
              station.nom,
              station.lieuTouristique,
              station.accessible,
              station.correspondances,
              stationInPMD
            );
          });
        }
        for (let station of zoneStations) {
          let stationPLAN = PLANStation.stations.find(
            (s) =>
              s.nom == station.name ||
              s.nom == station.name + " v1" ||
              s.nom == station.name + " v2"
          );
          if (stationPLAN) {
            padX = -Math.max(
              0,
              (PLANStation.stations.indexOf(stationPLAN) + 1) *
                (PLANStation.arc.width + PLANStation.rect.width) -
                1024
            );
            break;
          }
        }

        PLANStation.canvas.addEventListener("click", function (event) {
          PLANStation.stations.forEach((station) => {
            let arc = { x: station.x + padX, y: PLANStation.y };
            if (
              event.clientY - this.getBoundingClientRect().y >= arc.y &&
              event.clientY - this.getBoundingClientRect().y <=
                arc.y + PLANStation.arc.width &&
              event.clientX >= arc.x &&
              event.clientX <= arc.x + PLANStation.arc.width
            ) {
              station.closed = !station.closed;
              if (station.stationInPMD != null)
                station.stationInPMD.closed = station.closed;
              return;
            }
          });
        });

        let clignote = true;
        const intervalle = 500;
        setInterval(() => {
          PLANStation.stations.forEach((station) => {
            if (
              station.nom == nextStationPLAN.name ||
              station.nom + " v1" == nextStationPLAN.name ||
              station.nom + " v2" == nextStationPLAN.name
            ) {
              station.clignote = clignote;
              clignote = !clignote;
            } else if (
              zoneStations
                .slice(0, zoneStations.indexOf(nextStationPLAN) + 1)
                .find(
                  (s) =>
                    s.name == station.nom ||
                    s.name == station.nom + " v1" ||
                    s.name == station.nom + " v2"
                )
            ) {
              station.clignote = false;
            } else {
              station.clignote = true;
            }
          });
        }, intervalle);

        update();
      });
  });
};

const settings = () => {
  var toolsStatus = {
    timer: { nom: "le timer", elementID: "time-box", status: true },
    auto: { nom: "le mode auto", elementID: "auto", status: true },
    plan: { nom: "le plan", elementID: "canvasPlan", status: true },
  };
  const styleId = "dynamic-important-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .hidden-important {
        display: none !important;
      }
      .flex-important {
        display: flex !important;
      }
    `;
    document.head.appendChild(style);
  }
  if (localStorage.getItem("toolsStatus")) {
    let storage = JSON.parse(localStorage.getItem("toolsStatus"));
    Object.keys(toolsStatus).forEach((tool) => {
      toolsStatus[tool].status = storage[tool] == null ? true : storage[tool];
    });
  } else {
    let storage = {};
    Object.keys(toolsStatus).forEach((tool) => {
      storage[tool] = toolsStatus[tool].status;
    });
    localStorage.setItem("toolsStatus", JSON.stringify(storage));
  }
  Object.keys(toolsStatus).forEach((tool) => {
    if (document.getElementById(toolsStatus[tool].elementID)) {
      if (toolsStatus[tool].status) {
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.remove("hidden-important");
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.add("flex-important");
      } else {
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.remove("flex-important");
        document
          .getElementById(toolsStatus[tool].elementID)
          .classList.add("hidden-important");
      }
    }
    if (tool == "plan") {
      if (toolsStatus[tool].status) {
        document.getElementById("plan").classList.remove("flex-important");
        document.getElementById("plan").classList.add("hidden-important");
      } else {
        document.getElementById("plan").classList.remove("hidden-important");
        document.getElementById("plan").classList.add("flex-important");
      }
    }
  });

  let loop = setInterval(() => {
    if (document.querySelectorAll("#extra").length == 2) {
      clearInterval(loop);
      let params = document.querySelectorAll("#extra")[1];
      let lastParam =
        params.querySelectorAll(".menubtn.parambtn")[
          params.querySelectorAll(".menubtn.parambtn").length - 1
        ];
      let paramPMDTools = document.createElement("div");
      paramPMDTools.className = "menubtn parambtn";
      paramPMDTools.textContent = "Paramètres PMD+";
      lastParam.after(paramPMDTools);
      paramPMDTools.addEventListener("click", () => {
        let extra = document.createElement("div");
        extra.id = "extra";
        extra.style.opacity = "1";
        document.body.appendChild(extra);
        let popup = document.createElement("div");
        popup.id = "popup";
        extra.appendChild(popup);
        let menuButtonList = document.createElement("div");
        menuButtonList.id = "menuButtonList";
        menuButtonList.className = "scrollbar-invisible";
        popup.appendChild(menuButtonList);
        Object.keys(toolsStatus).forEach((tool) => {
          let button = document.createElement("div");
          button.className = "menubtn parambtn";
          button.textContent = `Afficher ${toolsStatus[tool].nom} : ${
            toolsStatus[tool].status ? "Oui" : "Non"
          }`;
          menuButtonList.appendChild(button);
          button.addEventListener("click", () => {
            toolsStatus[tool].status = !toolsStatus[tool].status;
            let storage = JSON.parse(localStorage.getItem("toolsStatus"));
            storage[tool] = toolsStatus[tool].status;
            localStorage.setItem("toolsStatus", JSON.stringify(storage));
            button.textContent = `Afficher ${toolsStatus[tool].nom} : ${
              toolsStatus[tool].status ? "Oui" : "Non"
            }`;
            if (toolsStatus[tool].status) {
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.remove("hidden-important");
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.add("flex-important");
            } else {
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.remove("flex-important");
              document
                .getElementById(toolsStatus[tool].elementID)
                .classList.add("hidden-important");
            }
            if (tool == "plan") {
              if (toolsStatus[tool].status) {
                document
                  .getElementById("plan")
                  .classList.remove("flex-important");
                document
                  .getElementById("plan")
                  .classList.add("hidden-important");
              } else {
                document
                  .getElementById("plan")
                  .classList.remove("hidden-important");
                document.getElementById("plan").classList.add("flex-important");
              }
            }
          });
        });
        let fermer = document.createElement("div");
        fermer.className = "menubtn parambtn";
        fermer.textContent = "Fermer";
        menuButtonList.appendChild(fermer);
        fermer.addEventListener("click", () => extra.remove());
      });
    }
  });
};

const timer = () => {
  const moduleTime = UTILS.getModule("Time");
  let loopWaitingStart = setInterval(() => {
    if (moduleTime.lastTimeDelay + moduleTime.timeDelay > 0) {
      clearInterval(loopWaitingStart);
      var avtStation = zoneStations[0];
      var station = false;
      var tempsMax;
      var nextStation;
      setInterval(() => {
        if (
          zoneStations.find(
            (a) => -globalTranslate > a.start && -globalTranslate < a.end
          ) != undefined &&
          zoneStations.indexOf(
            zoneStations.find(
              (a) => -globalTranslate > a.start && -globalTranslate < a.end
            )
          ) !=
            zoneStations.length - 1
        ) {
          // SI DANS STATION
          if (station == false) {
            // SI ON ETAIT PAS DANS STATION AVT
            tempsMax = moduleTime.lastTimeDelay + moduleTime.timeDelay;
            console.log(
              tempsMax,
              moduleTime.lastTimeDelay,
              moduleTime.timeDelay
            );
          }
          nextStation =
            zoneStations[
              zoneStations.indexOf(
                zoneStations.find(
                  (a) => -globalTranslate > a.start && -globalTranslate < a.end
                )
              ) + 1
            ];
          avtStation = nextStation;
          station = true;
        } else {
          station = false;
          nextStation = avtStation;
        }
        timeBeforeArriving = moduleTime.lastTimeDelay + moduleTime.timeDelay;
        document.getElementById("time").textContent = timeBeforeArriving;
        document.getElementById("nextStation").textContent = nextStation.name;
        let pourcentage = (timeBeforeArriving / tempsMax) * 100;
        if (pourcentage >= 0) {
          const angle = 360 * (pourcentage / 100);
          const radius = 30;
          const x =
            30 + radius * Math.cos(-Math.PI / 2 + (angle * Math.PI) / 180);
          const y =
            30 + radius * Math.sin(-Math.PI / 2 + (angle * Math.PI) / 180);
          const largeArcFlag = angle <= 180 ? "0" : "1";
          const pathData =
            "M 30,30 L 30,0 A 30,30 0 " +
            largeArcFlag +
            ",1 " +
            x +
            "," +
            y +
            " Z";
          document.getElementById("sector").setAttribute("d", pathData);
        }
        let rouge = 255 - (pourcentage * 255) / 100;
        let vert = (pourcentage * 255) / 100;
        let bleu = 0;
        document
          .getElementById("sector")
          .setAttribute("fill", "rgb(" + rouge + "," + vert + "," + bleu + ")");
        let distance = (nextStation.start - -globalTranslate) / 75; // en mètres
        document.getElementById("distance").textContent =
          Math.round(distance) + "m";
      });
    }
  });
};

const displayUI = () => {
  // Create time-box div
  let timeBox = document.createElement("div");
  timeBox.id = "time-box";
  timeBox.style.cssText =
    "position: absolute; right: 0px; bottom: 0px; height:100%; width:134px; background-color: black;";
  document.getElementById("pupitre").appendChild(timeBox);

  // Create time-boxClosed div
  let timeBoxClosed = document.createElement("div");
  timeBoxClosed.id = "time-boxClosed";
  timeBoxClosed.style.cssText =
    "z-index:3; position: absolute; left: 0px; top: 0px; height:100%; width:19px; background-color: #3E3C44; border-top-right-radius:10px;";
  timeBox.appendChild(timeBoxClosed);

  // Create the SVG arrow button inside time-boxClosed
  let arrowButton = document.createElement("div");
  arrowButton.style.cssText =
    "background-color: #929497; border-radius:100%; display:flex; align-items:center; justify-content:center; cursor:pointer";
  arrowButton.onclick = () => {
    document.getElementById("time-boxOpened").style.display = "";
    document.getElementById("time-boxClosed").style.display = "none";
  };
  timeBoxClosed.appendChild(arrowButton);

  let arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrowSvg.setAttribute("width", "19");
  arrowSvg.setAttribute("height", "19");
  arrowSvg.setAttribute("viewBox", "0 0 19 19");
  arrowSvg.setAttribute("fill", "none");

  let arrowPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  arrowPath.setAttribute(
    "d",
    "M6 13.7075L10.3266 9.5L6 5.2925L7.33198 4L13 9.5L7.33198 15L6 13.7075Z"
  );
  arrowPath.setAttribute("fill", "black");

  arrowSvg.appendChild(arrowPath);
  arrowButton.appendChild(arrowSvg);

  // Create time-boxOpened div
  let timeBoxOpened = document.createElement("div");
  timeBoxOpened.id = "time-boxOpened";
  timeBoxOpened.style.cssText =
    "z-index:2; position: absolute; left: 0px; top: 0px; height:100%; width:250px; background-color: #3E3C44; border-top-right-radius:10px; display:none";
  timeBox.appendChild(timeBoxOpened);

  // Create the SVG circle in time-boxOpened
  let circleContainer = document.createElement("div");
  circleContainer.style.cssText =
    "position:absolute; top:0px; left:0px; width:100%; height:70px; display:flex; align-items:center; justify-content:center";
  timeBoxOpened.appendChild(circleContainer);

  let circleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  circleSvg.id = "circle";
  circleSvg.setAttribute("width", "60");
  circleSvg.setAttribute("height", "60");
  circleSvg.setAttribute("viewBox", "0 0 60 60");
  circleSvg.setAttribute("fill", "none");

  let sectorPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  sectorPath.id = "sector";
  sectorPath.setAttribute("d", "M30,30 L30,0 A30,30 0 0,1 30,0 Z");
  sectorPath.setAttribute("fill", "green");

  circleSvg.appendChild(sectorPath);
  circleContainer.appendChild(circleSvg);

  // Create time display text
  let timeTextContainer = document.createElement("div");
  timeTextContainer.className = "text-time";
  timeTextContainer.style.cssText =
    "position:absolute; top:70px; left:0px; width: 100%; height:20px; display:flex; align-items:center; justify-content:center; font-size: 20px; color:#929497; text-align:center";

  let timeText = document.createElement("div");
  timeText.innerHTML = '<strong id="time">--</strong> secondes';
  timeTextContainer.appendChild(timeText);
  timeBoxOpened.appendChild(timeTextContainer);

  // Create next station display
  let nextStationContainer = document.createElement("div");
  nextStationContainer.className = "text-time";
  nextStationContainer.style.cssText =
    "position:absolute; top:80px; left:0px; width:100%; height:63px; display:flex; align-items:center; justify-content:center; font-size: 15px; color:#929497; text-align:center";

  let nextStationText = document.createElement("div");
  nextStationText.innerHTML =
    'Prochaine station :<br><strong id="nextStation">---</strong>';
  nextStationContainer.appendChild(nextStationText);
  timeBoxOpened.appendChild(nextStationContainer);

  // Create distance display
  let distanceContainer = document.createElement("div");
  distanceContainer.className = "text-time";
  distanceContainer.style.cssText =
    "position:absolute; top:108px; left:0px; width:100%; height:63px; display:flex; align-items:center; justify-content:center; font-size: 15px; color:#929497; text-align:center";

  let distanceText = document.createElement("div");
  distanceText.innerHTML = 'Distance : <strong id="distance">--m</strong>';
  distanceContainer.appendChild(distanceText);
  timeBoxOpened.appendChild(distanceContainer);

  // Create close button in time-boxOpened
  let closeButton = document.createElement("div");
  closeButton.style.cssText =
    "position:absolute; top:0px; right:0px; width:19px; height:19px; background-color: #929497; border-radius:100%; display:flex; align-items:center; justify-content:center; cursor:pointer";
  closeButton.onclick = () => {
    document.getElementById("time-boxClosed").style.display = "";
    document.getElementById("time-boxOpened").style.display = "none";
  };
  timeBoxOpened.appendChild(closeButton);

  let closeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeSvg.setAttribute("width", "19");
  closeSvg.setAttribute("height", "19");
  closeSvg.setAttribute("viewBox", "0 0 19 19");
  closeSvg.setAttribute("fill", "none");

  let line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.setAttribute("x1", "5.35355");
  line1.setAttribute("y1", "5.64645");
  line1.setAttribute("x2", "13.35");
  line1.setAttribute("y2", "13.6429");
  line1.setAttribute("stroke", "#B81111");

  let line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line2.setAttribute("x1", "5.17959");
  line2.setAttribute("y1", "13.6464");
  line2.setAttribute("x2", "13.1761");
  line2.setAttribute("y2", "5.64996");
  line2.setAttribute("stroke", "#B81111");

  closeSvg.appendChild(line1);
  closeSvg.appendChild(line2);
  closeButton.appendChild(closeSvg);

  // Create auto button div
  let autoButton = document.createElement("div");
  autoButton.id = "auto";
  const styles = getComputedStyle(document.getElementById("emergencyStop"));
  for (const prop of styles) {
    autoButton.style.setProperty(prop, styles.getPropertyValue(prop));
  }
  autoButton.style.marginTop = `${
    document.getElementById("emergencyStop").offsetHeight + 10
  }px`;
  autoButton.innerHTML = '<span class="center">AUTO</span>';
  autoButton.onmouseover = function () {
    this.style.border = "solid #EE5757 3px";
  };
  autoButton.onmouseout = function () {
    this.style.border = "solid transparent 3px";
  };
  document.getElementById("pupitre").appendChild(autoButton);

  // Create canvas element
  let canvasPlan = document.createElement("canvas");
  canvasPlan.id = "canvasPlan";
  canvasPlan.style.cssText = `position:absolute; top:0px; left: ${
    document.getElementById("display").offsetWidth
  }px;`;
  document.body.appendChild(canvasPlan);

  if (
    document.getElementById("mf01_bfdg") ||
    document.getElementById("mp89_kfu")
  ) {
    document.getElementById("time-box").style.left = "1023px";
    if (document.getElementById("mf01_bfdg")) {
      document.getElementById("auto").style.left = "953px";
      document.getElementById("auto").style.bottom = "20px";
      document.getElementById("time-box").style.height = "152px";
      document.getElementById("time-boxClosed").style.backgroundColor =
        document.getElementById("time-boxOpened").style.backgroundColor =
          "#00398E";
    } else if (document.getElementById("mp89_kfu")) {
      document.getElementById("auto").style.left = "830px";
      document.getElementById("auto").style.bottom = "95px";
      document.getElementById("time-boxClosed").style.backgroundColor =
        document.getElementById("time-boxOpened").style.backgroundColor =
          "#61777B";
      Object.values(document.getElementsByClassName("text-time")).forEach(
        (element) => {
          element.style.color = "#B0B2B4";
        }
      );
    }
  }
};

(function () {
  "use strict";
  if (location.pathname === "/game") {
    const orignialLoad = _load;
    _load = () => {
      orignialLoad();

      displayUI();
      settings();
      plan();
      timer();
      auto();
    };
  }
})();
