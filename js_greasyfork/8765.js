// ==UserScript==
// @name                Skaner Miejscowosci PL
// @name:pl             Skaner Miejscowości PL
// @description         Scans towns in Poland and creates a report.
// @description:pl      Skanuje mapę w poszukiwaniu brakujących nazw miejscowości.
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             2.4.1
// @grant               none
// @namespace           https://greasyfork.org/pl/scripts/8765-skaner-miejscowosci-pl
// @copyright           2015 wlodek76
// @credits             FZ69617 - TERYT CITIES
// @downloadURL https://update.greasyfork.org/scripts/8765/Skaner%20Miejscowosci%20PL.user.js
// @updateURL https://update.greasyfork.org/scripts/8765/Skaner%20Miejscowosci%20PL.meta.js
// ==/UserScript==

var wmech_version = "2.4.1";

var epsg900913 = new OpenLayers.Projection("EPSG:900913");
var epsg4326   = new OpenLayers.Projection("EPSG:4326");

var wazepending = 0;
var ventCount = 0;
var baza      = [];
var bazaINDEX = {};
var bazaSeqReadCounter = 0;
var bazaSeqImportCounter = 0;
var scanID = 0;
var run = 0;
var zoom = 5;
var kwadrat = 0;
var saved = {};
var TERYT_CITIES_Count     = 0;
var UNI_TERYT_CITIES_Count = 0;
var bigOffset;
var bigF;
var bigSize;
var bigName;
var bigLoaded;
var bigReszta = '';
var bigRekordCounter = 0;
var bigData = '';
var wojewodztwo = '02';
var bazapowiatow = {};
var powiat = '0000';
var scantime = 0;
var prevScroll = 0;
var skanerDataBaseName = 'skanerDB';
var skanerDB;
var importpercent = -1;
var refresh = false;
var busy = false;
var LOOPTIME = 100;
var searchcounter = 99999999;
var searchtext = '';
var mouseoverID   = '';
var mouseoverNAME = '';

var lang  = {code:'pl',
              openingfile       : 'Wczytywanie pliku...',
              importeddata      : 'Przetworzono rekordów: ',
              dbversion         : 'Wersja bazy danych: ',
              dbopenerror       : 'WME Road History\n\nPrawdopodobnie próbujesz uruchomić starszą wersję skryptu na nowszej bazie danych. Zaktualizuj skrypt do najnowszej wersji.',
              reloadsite        : 'WME Road History\n\nWersja bazy danych została zaktualizowana. Proszę odświeżyć stronę!',
              closetabs         : 'WME Road History\n\nBaza danych wymaga aktualizacji. Proszę zamknąć stronę na pozostałych zakładkach przeglądarki!',
              mergedatatip      : 'Opcja dołączania danych porównuje znaczniki czasowe segmentów. Tylko najnowsze segmenty będą zaimportowane.',
              dberrorlocked     : "ERR: Nie mogę skasować Bazy danych.<br>Baza danych jest zablokowana lub używana przez inną instancję przeglądarki!",
              dberrordelete     : "ERR: Nie mogę skasować Bazy danych!",
              preparingdatabase : 'Przygotowywanie bazy danych...'
             };

/*------------------------------------------------------------------------------------------------
  proj4js.js -- Javascript reprojection library. 
  
  Authors:      Mike Adair madairATdmsolutions.ca
                Richard Greenwood richATgreenwoodmap.com
                Didier Richard didier.richardATign.fr
                Stephen Irons stephen.ironsATclear.net.nz
                Olivier Terral oterralATgmail.com
                
  License:      
 Copyright (c) 2012, Mike Adair, Richard Greenwood, Didier Richard, 
                     Stephen Irons and Olivier Terral

 Permission is hereby granted, free of charge, to any person obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.
 
 Note: This program is an almost direct port of the C library PROJ.4.
*/
/* ======================================================================
    proj4js.js
   ====================================================================== */

/*
Author:       Mike Adair madairATdmsolutions.ca
              Richard Greenwood rich@greenwoodmap.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: Proj.js 2956 2007-07-09 12:17:52Z steven $
*/

/**
 * Namespace: Proj4js
 *
 * Proj4js is a JavaScript library to transform point coordinates from one 
 * coordinate system to another, including datum transformations.
 *
 * This library is a port of both the Proj.4 and GCTCP C libraries to JavaScript. 
 * Enabling these transformations in the browser allows geographic data stored 
 * in different projections to be combined in browser-based web mapping 
 * applications.
 * 
 * Proj4js must have access to coordinate system initialization strings (which
 * are the same as for PROJ.4 command line).  Thes can be included in your 
 * application using a <script> tag or Proj4js can load CS initialization 
 * strings from a local directory or a web service such as spatialreference.org.
 *
 * Similarly, Proj4js must have access to projection transform code.  These can
 * be included individually using a <script> tag in your page, built into a 
 * custom build of Proj4js or loaded dynamically at run-time.  Using the
 * -combined and -compressed versions of Proj4js includes all projection class
 * code by default.
 *
 * Note that dynamic loading of defs and code happens ascynchrously, check the
 * Proj.readyToUse flag before using the Proj object.  If the defs and code
 * required by your application are loaded through script tags, dynamic loading
 * is not required and the Proj object will be readyToUse on return from the 
 * constructor.
 * 
 * All coordinates are handled as points which have a .x and a .y property
 * which will be modified in place.
 *
 * Override Proj4js.reportError for output of alerts and warnings.
 *
 * See http://trac.osgeo.org/proj4js/wiki/UserGuide for full details.
*/

/**
 * Global namespace object for Proj4js library
 */
var Proj4js = {

    /**
     * Property: defaultDatum
     * The datum to use when no others a specified
     */
    defaultDatum: 'WGS84',                  //default datum

    /** 
    * Method: transform(source, dest, point)
    * Transform a point coordinate from one map projection to another.  This is
    * really the only public method you should need to use.
    *
    * Parameters:
    * source - {Proj4js.Proj} source map projection for the transformation
    * dest - {Proj4js.Proj} destination map projection for the transformation
    * point - {Object} point to transform, may be geodetic (long, lat) or
    *     projected Cartesian (x,y), but should always have x,y properties.
    */
    transform: function(source, dest, point) {
        if (!source.readyToUse) {
            this.reportError("Proj4js initialization for:"+source.srsCode+" not yet complete");
            return point;
        }
        if (!dest.readyToUse) {
            this.reportError("Proj4js initialization for:"+dest.srsCode+" not yet complete");
            return point;
        }
        
        // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
        if (source.datum && dest.datum && (
            ((source.datum.datum_type == Proj4js.common.PJD_3PARAM || source.datum.datum_type == Proj4js.common.PJD_7PARAM) && dest.datumCode != "WGS84") ||
            ((dest.datum.datum_type == Proj4js.common.PJD_3PARAM || dest.datum.datum_type == Proj4js.common.PJD_7PARAM) && source.datumCode != "WGS84"))) {
            var wgs84 = Proj4js.WGS84;
            this.transform(source, wgs84, point);
            source = wgs84;
        }

        // DGR, 2010/11/12
        if (source.axis!="enu") {
            this.adjust_axis(source,false,point);
        }

        // Transform source points to long/lat, if they aren't already.
        if ( source.projName=="longlat") {
            point.x *= Proj4js.common.D2R;  // convert degrees to radians
            point.y *= Proj4js.common.D2R;
        } else {
            if (source.to_meter) {
                point.x *= source.to_meter;
                point.y *= source.to_meter;
            }
            source.inverse(point); // Convert Cartesian to longlat
        }

        // Adjust for the prime meridian if necessary
        if (source.from_greenwich) { 
            point.x += source.from_greenwich; 
        }

        // Convert datums if needed, and if possible.
        point = this.datum_transform( source.datum, dest.datum, point );

        // Adjust for the prime meridian if necessary
        if (dest.from_greenwich) {
            point.x -= dest.from_greenwich;
        }

        if( dest.projName=="longlat" ) {             
            // convert radians to decimal degrees
            point.x *= Proj4js.common.R2D;
            point.y *= Proj4js.common.R2D;
        } else  {               // else project
            dest.forward(point);
            if (dest.to_meter) {
                point.x /= dest.to_meter;
                point.y /= dest.to_meter;
            }
        }

        // DGR, 2010/11/12
        if (dest.axis!="enu") {
            this.adjust_axis(dest,true,point);
        }

        return point;
    }, // transform()

    /** datum_transform()
      source coordinate system definition,
      destination coordinate system definition,
      point to transform in geodetic coordinates (long, lat, height)
    */
    datum_transform : function( source, dest, point ) {

      // Short cut if the datums are identical.
      if( source.compare_datums( dest ) ) {
          return point; // in this case, zero is sucess,
                    // whereas cs_compare_datums returns 1 to indicate TRUE
                    // confusing, should fix this
      }

      // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
      if( source.datum_type == Proj4js.common.PJD_NODATUM
          || dest.datum_type == Proj4js.common.PJD_NODATUM) {
          return point;
      }

      // Do we need to go through geocentric coordinates?
      if( source.es != dest.es || source.a != dest.a
          || source.datum_type == Proj4js.common.PJD_3PARAM
          || source.datum_type == Proj4js.common.PJD_7PARAM
          || dest.datum_type == Proj4js.common.PJD_3PARAM
          || dest.datum_type == Proj4js.common.PJD_7PARAM)
      {

        // Convert to geocentric coordinates.
        source.geodetic_to_geocentric( point );
        // CHECK_RETURN;

        // Convert between datums
        if( source.datum_type == Proj4js.common.PJD_3PARAM || source.datum_type == Proj4js.common.PJD_7PARAM ) {
          source.geocentric_to_wgs84(point);
          // CHECK_RETURN;
        }

        if( dest.datum_type == Proj4js.common.PJD_3PARAM || dest.datum_type == Proj4js.common.PJD_7PARAM ) {
          dest.geocentric_from_wgs84(point);
          // CHECK_RETURN;
        }

        // Convert back to geodetic coordinates
        dest.geocentric_to_geodetic( point );
          // CHECK_RETURN;
      }

      return point;
    }, // cs_datum_transform

    /**
     * Function: adjust_axis
     * Normalize or de-normalized the x/y/z axes.  The normal form is "enu"
     * (easting, northing, up).
     * Parameters:
     * crs {Proj4js.Proj} the coordinate reference system
     * denorm {Boolean} when false, normalize
     * point {Object} the coordinates to adjust
     */
    adjust_axis: function(crs, denorm, point) {
        var xin= point.x, yin= point.y, zin= point.z || 0.0;
        var v, t;
        for (var i= 0; i<3; i++) {
            if (denorm && i==2 && point.z===undefined) { continue; }
                 if (i==0) { v= xin; t= 'x'; }
            else if (i==1) { v= yin; t= 'y'; }
            else           { v= zin; t= 'z'; }
            switch(crs.axis[i]) {
            case 'e':
                point[t]= v;
                break;
            case 'w':
                point[t]= -v;
                break;
            case 'n':
                point[t]= v;
                break;
            case 's':
                point[t]= -v;
                break;
            case 'u':
                if (point[t]!==undefined) { point.z= v; }
                break;
            case 'd':
                if (point[t]!==undefined) { point.z= -v; }
                break;
            default :
                alert("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
                return null;
            }
        }
        return point;
    },

    /**
     * Function: reportError
     * An internal method to report errors back to user. 
     * Override this in applications to report error messages or throw exceptions.
     */
    reportError: function(msg) {
      //console.log(msg);
    },

/**
 *
 * Title: Private Methods
 * The following properties and methods are intended for internal use only.
 *
 * This is a minimal implementation of JavaScript inheritance methods so that 
 * Proj4js can be used as a stand-alone library.
 * These are copies of the equivalent OpenLayers methods at v2.7
 */
 
/**
 * Function: extend
 * Copy all properties of a source object to a destination object.  Modifies
 *     the passed in destination object.  Any properties on the source object
 *     that are set to undefined will not be (re)set on the destination object.
 *
 * Parameters:
 * destination - {Object} The object that will be modified
 * source - {Object} The object with properties to be set on the destination
 *
 * Returns:
 * {Object} The destination object.
 */
    extend: function(destination, source) {
      destination = destination || {};
      if(source) {
          for(var property in source) {
              var value = source[property];
              if(value !== undefined) {
                  destination[property] = value;
              }
          }
      }
      return destination;
    },

/**
 * Constructor: Class
 * Base class used to construct all other classes. Includes support for 
 *     multiple inheritance. 
 *  
 */
    Class: function() {
      var Class = function() {
          this.initialize.apply(this, arguments);
      };
  
      var extended = {};
      var parent;
      for(var i=0; i<arguments.length; ++i) {
          if(typeof arguments[i] == "function") {
              // get the prototype of the superclass
              parent = arguments[i].prototype;
          } else {
              // in this case we're extending with the prototype
              parent = arguments[i];
          }
          Proj4js.extend(extended, parent);
      }
      Class.prototype = extended;
      
      return Class;
    },

    /**
     * Function: bind
     * Bind a function to an object.  Method to easily create closures with
     *     'this' altered.
     * 
     * Parameters:
     * func - {Function} Input function.
     * object - {Object} The object to bind to the input function (as this).
     * 
     * Returns:
     * {Function} A closure with 'this' set to the passed in object.
     */
    bind: function(func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },
    
/**
 * The following properties and methods handle dynamic loading of JSON objects.
 */
 
    /**
     * Property: scriptName
     * {String} The filename of this script without any path.
     */
    scriptName: "proj4js-combined.js",

    /**
     * Property: defsLookupService
     * AJAX service to retreive projection definition parameters from
     */
    defsLookupService: 'http://spatialreference.org/ref',

    /**
     * Property: libPath
     * internal: http server path to library code.
     */
    libPath: null,

    /**
     * Function: getScriptLocation
     * Return the path to this script.
     *
     * Returns:
     * Path to this script
     */
    getScriptLocation: function () {
        if (this.libPath) return this.libPath;
        var scriptName = this.scriptName;
        var scriptNameLen = scriptName.length;

        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            if (src) {
                var index = src.lastIndexOf(scriptName);
                // is it found, at the end of the URL?
                if ((index > -1) && (index + scriptNameLen == src.length)) {
                    this.libPath = src.slice(0, -scriptNameLen);
                    break;
                }
            }
        }
        return this.libPath||"";
    },

    /**
     * Function: loadScript
     * Load a JS file from a URL into a <script> tag in the page.
     * 
     * Parameters:
     * url - {String} The URL containing the script to load
     * onload - {Function} A method to be executed when the script loads successfully
     * onfail - {Function} A method to be executed when there is an error loading the script
     * loadCheck - {Function} A boolean method that checks to see if the script 
     *            has loaded.  Typically this just checks for the existance of
     *            an object in the file just loaded.
     */
    loadScript: function(url, onload, onfail, loadCheck) {
      var script = document.createElement('script');
      script.defer = false;
      script.type = "text/javascript";
      script.id = url;
      script.src = url;
      script.onload = onload;
      script.onerror = onfail;
      script.loadCheck = loadCheck;
      if (/MSIE/.test(navigator.userAgent)) {
        script.onreadystatechange = this.checkReadyState;
      }
      document.getElementsByTagName('head')[0].appendChild(script);
    },
    
    /**
     * Function: checkReadyState
     * IE workaround since there is no onerror handler.  Calls the user defined 
     * loadCheck method to determine if the script is loaded.
     * 
     */
    checkReadyState: function() {
      if (this.readyState == 'loaded') {
        if (!this.loadCheck()) {
          this.onerror();
        } else {
          this.onload();
        }
      }
    }
};

/**
 * Class: Proj4js.Proj
 *
 * Proj objects provide transformation methods for point coordinates
 * between geodetic latitude/longitude and a projected coordinate system. 
 * once they have been initialized with a projection code.
 *
 * Initialization of Proj objects is with a projection code, usually EPSG codes,
 * which is the key that will be used with the Proj4js.defs array.
 * 
 * The code passed in will be stripped of colons and converted to uppercase
 * to locate projection definition files.
 *
 * A projection object has properties for units and title strings.
 */
Proj4js.Proj = Proj4js.Class({

  /**
   * Property: readyToUse
   * Flag to indicate if initialization is complete for this Proj object
   */
  readyToUse: false,   
  
  /**
   * Property: title
   * The title to describe the projection
   */
  title: null,  
  
  /**
   * Property: projName
   * The projection class for this projection, e.g. lcc (lambert conformal conic,
   * or merc for mercator).  These are exactly equivalent to their Proj4 
   * counterparts.
   */
  projName: null,
  /**
   * Property: units
   * The units of the projection.  Values include 'm' and 'degrees'
   */
  units: null,
  /**
   * Property: datum
   * The datum specified for the projection
   */
  datum: null,
  /**
   * Property: x0
   * The x coordinate origin
   */
  x0: 0,
  /**
   * Property: y0
   * The y coordinate origin
   */
  y0: 0,
  /**
   * Property: localCS
   * Flag to indicate if the projection is a local one in which no transforms
   * are required.
   */
  localCS: false,

  /**
  * Property: queue
  * Buffer (FIFO) to hold callbacks waiting to be called when projection loaded.
  */
  queue: null,

  /**
  * Constructor: initialize
  * Constructor for Proj4js.Proj objects
  *
  * Parameters:
  * srsCode - a code for map projection definition parameters.  These are usually
  * (but not always) EPSG codes.
  */
  initialize: function(srsCode, callback) {
      this.srsCodeInput = srsCode;
      
      //Register callbacks prior to attempting to process definition
      this.queue = [];
      if( callback ){
           this.queue.push( callback );
      }
      
      //check to see if this is a WKT string
      if ((srsCode.indexOf('GEOGCS') >= 0) ||
          (srsCode.indexOf('GEOCCS') >= 0) ||
          (srsCode.indexOf('PROJCS') >= 0) ||
          (srsCode.indexOf('LOCAL_CS') >= 0)) {
            this.parseWKT(srsCode);
            this.deriveConstants();
            this.loadProjCode(this.projName);
            return;
      }
      
      // DGR 2008-08-03 : support urn and url
      if (srsCode.indexOf('urn:') == 0) {
          //urn:ORIGINATOR:def:crs:CODESPACE:VERSION:ID
          var urn = srsCode.split(':');
          if ((urn[1] == 'ogc' || urn[1] =='x-ogc') &&
              (urn[2] =='def') &&
              (urn[3] =='crs')) {
              srsCode = urn[4]+':'+urn[urn.length-1];
          }
      } else if (srsCode.indexOf('http://') == 0) {
          //url#ID
          var url = srsCode.split('#');
          if (url[0].match(/epsg.org/)) {
            // http://www.epsg.org/#
            srsCode = 'EPSG:'+url[1];
          } else if (url[0].match(/RIG.xml/)) {
            //http://librairies.ign.fr/geoportail/resources/RIG.xml#
            //http://interop.ign.fr/registers/ign/RIG.xml#
            srsCode = 'IGNF:'+url[1];
          }
      }
      this.srsCode = srsCode.toUpperCase();
      if (this.srsCode.indexOf("EPSG") == 0) {
          this.srsCode = this.srsCode;
          this.srsAuth = 'epsg';
          this.srsProjNumber = this.srsCode.substring(5);
      // DGR 2007-11-20 : authority IGNF
      } else if (this.srsCode.indexOf("IGNF") == 0) {
          this.srsCode = this.srsCode;
          this.srsAuth = 'IGNF';
          this.srsProjNumber = this.srsCode.substring(5);
      // DGR 2008-06-19 : pseudo-authority CRS for WMS
      } else if (this.srsCode.indexOf("CRS") == 0) {
          this.srsCode = this.srsCode;
          this.srsAuth = 'CRS';
          this.srsProjNumber = this.srsCode.substring(4);
      } else {
          this.srsAuth = '';
          this.srsProjNumber = this.srsCode;
      }
      
      this.loadProjDefinition();
  },
  
/**
 * Function: loadProjDefinition
 *    Loads the coordinate system initialization string if required.
 *    Note that dynamic loading happens asynchronously so an application must 
 *    wait for the readyToUse property is set to true.
 *    To prevent dynamic loading, include the defs through a script tag in
 *    your application.
 *
 */
    loadProjDefinition: function() {
      //check in memory
      if (Proj4js.defs[this.srsCode]) {
        this.defsLoaded();
        return;
      }

      //else check for def on the server
      var url = Proj4js.getScriptLocation() + 'defs/' + this.srsAuth.toUpperCase() + this.srsProjNumber + '.js';
      Proj4js.loadScript(url, 
                Proj4js.bind(this.defsLoaded, this),
                Proj4js.bind(this.loadFromService, this),
                Proj4js.bind(this.checkDefsLoaded, this) );
    },

/**
 * Function: loadFromService
 *    Creates the REST URL for loading the definition from a web service and 
 *    loads it.
 *
 */
    loadFromService: function() {
      //else load from web service
      var url = Proj4js.defsLookupService +'/' + this.srsAuth +'/'+ this.srsProjNumber + '/proj4js/';
      Proj4js.loadScript(url, 
            Proj4js.bind(this.defsLoaded, this),
            Proj4js.bind(this.defsFailed, this),
            Proj4js.bind(this.checkDefsLoaded, this) );
    },

/**
 * Function: defsLoaded
 * Continues the Proj object initilization once the def file is loaded
 *
 */
    defsLoaded: function() {
      this.parseDefs();
      this.loadProjCode(this.projName);
    },
    
/**
 * Function: checkDefsLoaded
 *    This is the loadCheck method to see if the def object exists
 *
 */
    checkDefsLoaded: function() {
      if (Proj4js.defs[this.srsCode]) {
        return true;
      } else {
        return false;
      }
    },

 /**
 * Function: defsFailed
 *    Report an error in loading the defs file, but continue on using WGS84
 *
 */
   defsFailed: function() {
      Proj4js.reportError('failed to load projection definition for: '+this.srsCode);
      Proj4js.defs[this.srsCode] = Proj4js.defs['WGS84'];  //set it to something so it can at least continue
      this.defsLoaded();
    },

/**
 * Function: loadProjCode
 *    Loads projection class code dynamically if required.
 *     Projection code may be included either through a script tag or in
 *     a built version of proj4js
 *
 */
    loadProjCode: function(projName) {
      if (Proj4js.Proj[projName]) {
        this.initTransforms();
        return;
      }

      //the URL for the projection code
      var url = Proj4js.getScriptLocation() + 'projCode/' + projName + '.js';
      Proj4js.loadScript(url, 
              Proj4js.bind(this.loadProjCodeSuccess, this, projName),
              Proj4js.bind(this.loadProjCodeFailure, this, projName), 
              Proj4js.bind(this.checkCodeLoaded, this, projName) );
    },

 /**
 * Function: loadProjCodeSuccess
 *    Loads any proj dependencies or continue on to final initialization.
 *
 */
    loadProjCodeSuccess: function(projName) {
      if (Proj4js.Proj[projName].dependsOn){
        this.loadProjCode(Proj4js.Proj[projName].dependsOn);
      } else {
        this.initTransforms();
      }
    },

 /**
 * Function: defsFailed
 *    Report an error in loading the proj file.  Initialization of the Proj
 *    object has failed and the readyToUse flag will never be set.
 *
 */
    loadProjCodeFailure: function(projName) {
      Proj4js.reportError("failed to find projection file for: " + projName);
      //TBD initialize with identity transforms so proj will still work?
    },
    
/**
 * Function: checkCodeLoaded
 *    This is the loadCheck method to see if the projection code is loaded
 *
 */
    checkCodeLoaded: function(projName) {
      if (Proj4js.Proj[projName]) {
        return true;
      } else {
        return false;
      }
    },

/**
 * Function: initTransforms
 *    Finalize the initialization of the Proj object
 *
 */
    initTransforms: function() {
      Proj4js.extend(this, Proj4js.Proj[this.projName]);
      this.init();
      this.readyToUse = true;
      if( this.queue ) {
        var item;
        while( (item = this.queue.shift()) ) {
          item.call( this, this );
        }
      }
  },

/**
 * Function: parseWKT
 * Parses a WKT string to get initialization parameters
 *
 */
 wktRE: /^(\w+)\[(.*)\]$/,
 parseWKT: function(wkt) {
    var wktMatch = wkt.match(this.wktRE);
    if (!wktMatch) return;
    var wktObject = wktMatch[1];
    var wktContent = wktMatch[2];
    var wktTemp = wktContent.split(",");
    var wktName;
    if (wktObject.toUpperCase() == "TOWGS84") {
      wktName = wktObject;  //no name supplied for the TOWGS84 array
    } else {
      wktName = wktTemp.shift();
    }
    wktName = wktName.replace(/^\"/,"");
    wktName = wktName.replace(/\"$/,"");
    
    /*
    wktContent = wktTemp.join(",");
    var wktArray = wktContent.split("],");
    for (var i=0; i<wktArray.length-1; ++i) {
      wktArray[i] += "]";
    }
    */
    
    var wktArray = new Array();
    var bkCount = 0;
    var obj = "";
    for (var i=0; i<wktTemp.length; ++i) {
      var token = wktTemp[i];
      for (var j=0; j<token.length; ++j) {
        if (token.charAt(j) == "[") ++bkCount;
        if (token.charAt(j) == "]") --bkCount;
      }
      obj += token;
      if (bkCount === 0) {
        wktArray.push(obj);
        obj = "";
      } else {
        obj += ",";
      }
    }
    
    //do something based on the type of the wktObject being parsed
    //add in variations in the spelling as required
    switch (wktObject) {
      case 'LOCAL_CS':
        this.projName = 'identity'
        this.localCS = true;
        this.srsCode = wktName;
        break;
      case 'GEOGCS':
        this.projName = 'longlat'
        this.geocsCode = wktName;
        if (!this.srsCode) this.srsCode = wktName;
        break;
      case 'PROJCS':
        this.srsCode = wktName;
        break;
      case 'GEOCCS':
        break;
      case 'PROJECTION':
        this.projName = Proj4js.wktProjections[wktName]
        break;
      case 'DATUM':
        this.datumName = wktName;
        break;
      case 'LOCAL_DATUM':
        this.datumCode = 'none';
        break;
      case 'SPHEROID':
        this.ellps = wktName;
        this.a = parseFloat(wktArray.shift());
        this.rf = parseFloat(wktArray.shift());
        break;
      case 'PRIMEM':
        this.from_greenwich = parseFloat(wktArray.shift()); //to radians?
        break;
      case 'UNIT':
        this.units = wktName;
        this.unitsPerMeter = parseFloat(wktArray.shift());
        break;
      case 'PARAMETER':
        var name = wktName.toLowerCase();
        var value = parseFloat(wktArray.shift());
        //there may be many variations on the wktName values, add in case
        //statements as required
        switch (name) {
          case 'false_easting':
            this.x0 = value;
            break;
          case 'false_northing':
            this.y0 = value;
            break;
          case 'scale_factor':
            this.k0 = value;
            break;
          case 'central_meridian':
            this.long0 = value*Proj4js.common.D2R;
            break;
          case 'latitude_of_origin':
            this.lat0 = value*Proj4js.common.D2R;
            break;
          case 'more_here':
            break;
          default:
            break;
        }
        break;
      case 'TOWGS84':
        this.datum_params = wktArray;
        break;
      //DGR 2010-11-12: AXIS
      case 'AXIS':
        var name= wktName.toLowerCase();
        var value= wktArray.shift();
        switch (value) {
          case 'EAST' : value= 'e'; break;
          case 'WEST' : value= 'w'; break;
          case 'NORTH': value= 'n'; break;
          case 'SOUTH': value= 's'; break;
          case 'UP'   : value= 'u'; break;
          case 'DOWN' : value= 'd'; break;
          case 'OTHER':
          default     : value= ' '; break;//FIXME
        }
        if (!this.axis) { this.axis= "enu"; }
        switch(name) {
          case 'x': this.axis=                         value + this.axis.substr(1,2); break;
          case 'y': this.axis= this.axis.substr(0,1) + value + this.axis.substr(2,1); break;
          case 'z': this.axis= this.axis.substr(0,2) + value                        ; break;
          default : break;
        }
      case 'MORE_HERE':
        break;
      default:
        break;
    }
    for (var i=0; i<wktArray.length; ++i) {
      this.parseWKT(wktArray[i]);
    }
 },

/**
 * Function: parseDefs
 * Parses the PROJ.4 initialization string and sets the associated properties.
 *
 */
  parseDefs: function() {
      this.defData = Proj4js.defs[this.srsCode];
      var paramName, paramVal;
      if (!this.defData) {
        return;
      }
      var paramArray=this.defData.split("+");

      for (var prop=0; prop<paramArray.length; prop++) {
          var property = paramArray[prop].split("=");
          paramName = property[0].toLowerCase();
          paramVal = property[1];

          switch (paramName.replace(/\s/gi,"")) {  // trim out spaces
              case "": break;   // throw away nameless parameter
              case "title":  this.title = paramVal; break;
              case "proj":   this.projName =  paramVal.replace(/\s/gi,""); break;
              case "units":  this.units = paramVal.replace(/\s/gi,""); break;
              case "datum":  this.datumCode = paramVal.replace(/\s/gi,""); break;
              case "nadgrids": this.nagrids = paramVal.replace(/\s/gi,""); break;
              case "ellps":  this.ellps = paramVal.replace(/\s/gi,""); break;
              case "a":      this.a =  parseFloat(paramVal); break;  // semi-major radius
              case "b":      this.b =  parseFloat(paramVal); break;  // semi-minor radius
              // DGR 2007-11-20
              case "rf":     this.rf = parseFloat(paramVal); break; // inverse flattening rf= a/(a-b)
              case "lat_0":  this.lat0 = paramVal*Proj4js.common.D2R; break;        // phi0, central latitude
              case "lat_1":  this.lat1 = paramVal*Proj4js.common.D2R; break;        //standard parallel 1
              case "lat_2":  this.lat2 = paramVal*Proj4js.common.D2R; break;        //standard parallel 2
              case "lat_ts": this.lat_ts = paramVal*Proj4js.common.D2R; break;      // used in merc and eqc
              case "lon_0":  this.long0 = paramVal*Proj4js.common.D2R; break;       // lam0, central longitude
              case "alpha":  this.alpha =  parseFloat(paramVal)*Proj4js.common.D2R; break;  //for somerc projection
              case "lonc":   this.longc = paramVal*Proj4js.common.D2R; break;       //for somerc projection
              case "x_0":    this.x0 = parseFloat(paramVal); break;  // false easting
              case "y_0":    this.y0 = parseFloat(paramVal); break;  // false northing
              case "k_0":    this.k0 = parseFloat(paramVal); break;  // projection scale factor
              case "k":      this.k0 = parseFloat(paramVal); break;  // both forms returned
              case "r_a":    this.R_A = true; break;                 // sphere--area of ellipsoid
              case "zone":   this.zone = parseInt(paramVal,10); break;  // UTM Zone
              case "south":   this.utmSouth = true; break;  // UTM north/south
              case "towgs84":this.datum_params = paramVal.split(","); break;
              case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
              case "from_greenwich": this.from_greenwich = paramVal*Proj4js.common.D2R; break;
              // DGR 2008-07-09 : if pm is not a well-known prime meridian take
              // the value instead of 0.0, then convert to radians
              case "pm":     paramVal = paramVal.replace(/\s/gi,"");
                             this.from_greenwich = Proj4js.PrimeMeridian[paramVal] ?
                                Proj4js.PrimeMeridian[paramVal] : parseFloat(paramVal);
                             this.from_greenwich *= Proj4js.common.D2R; 
                             break;
              // DGR 2010-11-12: axis
              case "axis":   paramVal = paramVal.replace(/\s/gi,"");
                             var legalAxis= "ewnsud";
                             if (paramVal.length==3 &&
                                 legalAxis.indexOf(paramVal.substr(0,1))!=-1 &&
                                 legalAxis.indexOf(paramVal.substr(1,1))!=-1 &&
                                 legalAxis.indexOf(paramVal.substr(2,1))!=-1) {
                                this.axis= paramVal;
                             } //FIXME: be silent ?
                             break
              case "no_defs": break; 
              default: //alert("Unrecognized parameter: " + paramName);
          } // switch()
      } // for paramArray
      this.deriveConstants();
  },

/**
 * Function: deriveConstants
 * Sets several derived constant values and initialization of datum and ellipse
 *     parameters.
 *
 */
  deriveConstants: function() {
      if (this.nagrids == '@null') this.datumCode = 'none';
      if (this.datumCode && this.datumCode != 'none') {
        var datumDef = Proj4js.Datum[this.datumCode];
        if (datumDef) {
          this.datum_params = datumDef.towgs84 ? datumDef.towgs84.split(',') : null;
          this.ellps = datumDef.ellipse;
          this.datumName = datumDef.datumName ? datumDef.datumName : this.datumCode;
        }
      }
      if (!this.a) {    // do we have an ellipsoid?
          var ellipse = Proj4js.Ellipsoid[this.ellps] ? Proj4js.Ellipsoid[this.ellps] : Proj4js.Ellipsoid['WGS84'];
          Proj4js.extend(this, ellipse);
      }
      if (this.rf && !this.b) this.b = (1.0 - 1.0/this.rf) * this.a;
      if (this.rf === 0 || Math.abs(this.a - this.b)<Proj4js.common.EPSLN) {
        this.sphere = true;
        this.b= this.a;
      }
      this.a2 = this.a * this.a;          // used in geocentric
      this.b2 = this.b * this.b;          // used in geocentric
      this.es = (this.a2-this.b2)/this.a2;  // e ^ 2
      this.e = Math.sqrt(this.es);        // eccentricity
      if (this.R_A) {
        this.a *= 1. - this.es * (Proj4js.common.SIXTH + this.es * (Proj4js.common.RA4 + this.es * Proj4js.common.RA6));
        this.a2 = this.a * this.a;
        this.b2 = this.b * this.b;
        this.es = 0.;
      }
      this.ep2=(this.a2-this.b2)/this.b2; // used in geocentric
      if (!this.k0) this.k0 = 1.0;    //default value
      //DGR 2010-11-12: axis
      if (!this.axis) { this.axis= "enu"; }

      this.datum = new Proj4js.datum(this);
  }
});

Proj4js.Proj.longlat = {
  init: function() {
    //no-op for longlat
  },
  forward: function(pt) {
    //identity transform
    return pt;
  },
  inverse: function(pt) {
    //identity transform
    return pt;
  }
};
Proj4js.Proj.identity = Proj4js.Proj.longlat;

/**
  Proj4js.defs is a collection of coordinate system definition objects in the 
  PROJ.4 command line format.
  Generally a def is added by means of a separate .js file for example:

    <SCRIPT type="text/javascript" src="defs/EPSG26912.js"></SCRIPT>

  def is a CS definition in PROJ.4 WKT format, for example:
    +proj="tmerc"   //longlat, etc.
    +a=majorRadius
    +b=minorRadius
    +lat0=somenumber
    +long=somenumber
*/
Proj4js.defs = {
  // These are so widely used, we'll go ahead and throw them in
  // without requiring a separate .js file
  'WGS84': "+title=long/lat:WGS84 +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
  'EPSG:4326': "+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees",
  'EPSG:4269': "+title=long/lat:NAD83 +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees",
  'EPSG:3875': "+title= Google Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"
};
Proj4js.defs['EPSG:3785'] = Proj4js.defs['EPSG:3875'];  //maintain backward compat, official code is 3875
Proj4js.defs['GOOGLE'] = Proj4js.defs['EPSG:3875'];
Proj4js.defs['EPSG:900913'] = Proj4js.defs['EPSG:3875'];
Proj4js.defs['EPSG:102113'] = Proj4js.defs['EPSG:3875'];

Proj4js.common = {
  PI : 3.141592653589793238, //Math.PI,
  HALF_PI : 1.570796326794896619, //Math.PI*0.5,
  TWO_PI : 6.283185307179586477, //Math.PI*2,
  FORTPI : 0.78539816339744833,
  R2D : 57.29577951308232088,
  D2R : 0.01745329251994329577,
  SEC_TO_RAD : 4.84813681109535993589914102357e-6, /* SEC_TO_RAD = Pi/180/3600 */
  EPSLN : 1.0e-10,
  MAX_ITER : 20,
  // following constants from geocent.c
  COS_67P5 : 0.38268343236508977,  /* cosine of 67.5 degrees */
  AD_C : 1.0026000,                /* Toms region 1 constant */

  /* datum_type values */
  PJD_UNKNOWN  : 0,
  PJD_3PARAM   : 1,
  PJD_7PARAM   : 2,
  PJD_GRIDSHIFT: 3,
  PJD_WGS84    : 4,   // WGS84 or equivalent
  PJD_NODATUM  : 5,   // WGS84 or equivalent
  SRS_WGS84_SEMIMAJOR : 6378137.0,  // only used in grid shift transforms

  // ellipoid pj_set_ell.c
  SIXTH : .1666666666666666667, /* 1/6 */
  RA4   : .04722222222222222222, /* 17/360 */
  RA6   : .02215608465608465608, /* 67/3024 */
  RV4   : .06944444444444444444, /* 5/72 */
  RV6   : .04243827160493827160, /* 55/1296 */

// Function to compute the constant small m which is the radius of
//   a parallel of latitude, phi, divided by the semimajor axis.
// -----------------------------------------------------------------
  msfnz : function(eccent, sinphi, cosphi) {
      var con = eccent * sinphi;
      return cosphi/(Math.sqrt(1.0 - con * con));
  },

// Function to compute the constant small t for use in the forward
//   computations in the Lambert Conformal Conic and the Polar
//   Stereographic projections.
// -----------------------------------------------------------------
  tsfnz : function(eccent, phi, sinphi) {
    var con = eccent * sinphi;
    var com = .5 * eccent;
    con = Math.pow(((1.0 - con) / (1.0 + con)), com);
    return (Math.tan(.5 * (this.HALF_PI - phi))/con);
  },

// Function to compute the latitude angle, phi2, for the inverse of the
//   Lambert Conformal Conic and Polar Stereographic projections.
// ----------------------------------------------------------------
  phi2z : function(eccent, ts) {
    var eccnth = .5 * eccent;
    var con, dphi;
    var phi = this.HALF_PI - 2 * Math.atan(ts);
    for (var i = 0; i <= 15; i++) {
      con = eccent * Math.sin(phi);
      dphi = this.HALF_PI - 2 * Math.atan(ts *(Math.pow(((1.0 - con)/(1.0 + con)),eccnth))) - phi;
      phi += dphi;
      if (Math.abs(dphi) <= .0000000001) return phi;
    }
    alert("phi2z has NoConvergence");
    return (-9999);
  },

/* Function to compute constant small q which is the radius of a 
   parallel of latitude, phi, divided by the semimajor axis. 
------------------------------------------------------------*/
  qsfnz : function(eccent,sinphi) {
    var con;
    if (eccent > 1.0e-7) {
      con = eccent * sinphi;
      return (( 1.0- eccent * eccent) * (sinphi /(1.0 - con * con) - (.5/eccent)*Math.log((1.0 - con)/(1.0 + con))));
    } else {
      return(2.0 * sinphi);
    }
  },

/* Function to eliminate roundoff errors in asin
----------------------------------------------*/
  asinz : function(x) {
    if (Math.abs(x)>1.0) {
      x=(x>1.0)?1.0:-1.0;
    }
    return Math.asin(x);
  },

// following functions from gctpc cproj.c for transverse mercator projections
  e0fn : function(x) {return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));},
  e1fn : function(x) {return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));},
  e2fn : function(x) {return(0.05859375*x*x*(1.0+0.75*x));},
  e3fn : function(x) {return(x*x*x*(35.0/3072.0));},
  mlfn : function(e0,e1,e2,e3,phi) {return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));},

  srat : function(esinp, exp) {
    return(Math.pow((1.0-esinp)/(1.0+esinp), exp));
  },

// Function to return the sign of an argument
  sign : function(x) { if (x < 0.0) return(-1); else return(1);},

// Function to adjust longitude to -180 to 180; input in radians
  adjust_lon : function(x) {
    x = (Math.abs(x) < this.PI) ? x: (x - (this.sign(x)*this.TWO_PI) );
    return x;
  },

// IGNF - DGR : algorithms used by IGN France

// Function to adjust latitude to -90 to 90; input in radians
  adjust_lat : function(x) {
    x= (Math.abs(x) < this.HALF_PI) ? x: (x - (this.sign(x)*this.PI) );
    return x;
  },

// Latitude Isometrique - close to tsfnz ...
  latiso : function(eccent, phi, sinphi) {
    if (Math.abs(phi) > this.HALF_PI) return +Number.NaN;
    if (phi==this.HALF_PI) return Number.POSITIVE_INFINITY;
    if (phi==-1.0*this.HALF_PI) return -1.0*Number.POSITIVE_INFINITY;

    var con= eccent*sinphi;
    return Math.log(Math.tan((this.HALF_PI+phi)/2.0))+eccent*Math.log((1.0-con)/(1.0+con))/2.0;
  },

  fL : function(x,L) {
    return 2.0*Math.atan(x*Math.exp(L)) - this.HALF_PI;
  },

// Inverse Latitude Isometrique - close to ph2z
  invlatiso : function(eccent, ts) {
    var phi= this.fL(1.0,ts);
    var Iphi= 0.0;
    var con= 0.0;
    do {
      Iphi= phi;
      con= eccent*Math.sin(Iphi);
      phi= this.fL(Math.exp(eccent*Math.log((1.0+con)/(1.0-con))/2.0),ts)
    } while (Math.abs(phi-Iphi)>1.0e-12);
    return phi;
  },

// Needed for Gauss Schreiber
// Original:  Denis Makarov (info@binarythings.com)
// Web Site:  http://www.binarythings.com
  sinh : function(x)
  {
    var r= Math.exp(x);
    r= (r-1.0/r)/2.0;
    return r;
  },

  cosh : function(x)
  {
    var r= Math.exp(x);
    r= (r+1.0/r)/2.0;
    return r;
  },

  tanh : function(x)
  {
    var r= Math.exp(x);
    r= (r-1.0/r)/(r+1.0/r);
    return r;
  },

  asinh : function(x)
  {
    var s= (x>= 0? 1.0:-1.0);
    return s*(Math.log( Math.abs(x) + Math.sqrt(x*x+1.0) ));
  },

  acosh : function(x)
  {
    return 2.0*Math.log(Math.sqrt((x+1.0)/2.0) + Math.sqrt((x-1.0)/2.0));
  },

  atanh : function(x)
  {
    return Math.log((x-1.0)/(x+1.0))/2.0;
  },

// Grande Normale
  gN : function(a,e,sinphi)
  {
    var temp= e*sinphi;
    return a/Math.sqrt(1.0 - temp*temp);
  },
  
  //code from the PROJ.4 pj_mlfn.c file;  this may be useful for other projections
  pj_enfn: function(es) {
    var en = new Array();
    en[0] = this.C00 - es * (this.C02 + es * (this.C04 + es * (this.C06 + es * this.C08)));
    en[1] = es * (this.C22 - es * (this.C04 + es * (this.C06 + es * this.C08)));
    var t = es * es;
    en[2] = t * (this.C44 - es * (this.C46 + es * this.C48));
    t *= es;
    en[3] = t * (this.C66 - es * this.C68);
    en[4] = t * es * this.C88;
    return en;
  },
  
  pj_mlfn: function(phi, sphi, cphi, en) {
    cphi *= sphi;
    sphi *= sphi;
    return(en[0] * phi - cphi * (en[1] + sphi*(en[2]+ sphi*(en[3] + sphi*en[4]))));
  },
  
  pj_inv_mlfn: function(arg, es, en) {
    var k = 1./(1.-es);
    var phi = arg;
    for (var i = Proj4js.common.MAX_ITER; i ; --i) { /* rarely goes over 2 iterations */
      var s = Math.sin(phi);
      var t = 1. - es * s * s;
      //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
      //phi -= t * (t * Math.sqrt(t)) * k;
      t = (this.pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
      phi -= t;
      if (Math.abs(t) < Proj4js.common.EPSLN)
        return phi;
    }
    Proj4js.reportError("cass:pj_inv_mlfn: Convergence error");
    return phi;
  },

/* meridinal distance for ellipsoid and inverse
**	8th degree - accurate to < 1e-5 meters when used in conjuction
**		with typical major axis values.
**	Inverse determines phi to EPS (1e-11) radians, about 1e-6 seconds.
*/
  C00: 1.0,
  C02: .25,
  C04: .046875,
  C06: .01953125,
  C08: .01068115234375,
  C22: .75,
  C44: .46875,
  C46: .01302083333333333333,
  C48: .00712076822916666666,
  C66: .36458333333333333333,
  C68: .00569661458333333333,
  C88: .3076171875  

};

/** datum object
*/
Proj4js.datum = Proj4js.Class({

  initialize : function(proj) {
    this.datum_type = Proj4js.common.PJD_WGS84;   //default setting
    if (proj.datumCode && proj.datumCode == 'none') {
      this.datum_type = Proj4js.common.PJD_NODATUM;
    }
    if (proj && proj.datum_params) {
      for (var i=0; i<proj.datum_params.length; i++) {
        proj.datum_params[i]=parseFloat(proj.datum_params[i]);
      }
      if (proj.datum_params[0] != 0 || proj.datum_params[1] != 0 || proj.datum_params[2] != 0 ) {
        this.datum_type = Proj4js.common.PJD_3PARAM;
      }
      if (proj.datum_params.length > 3) {
        if (proj.datum_params[3] != 0 || proj.datum_params[4] != 0 ||
            proj.datum_params[5] != 0 || proj.datum_params[6] != 0 ) {
          this.datum_type = Proj4js.common.PJD_7PARAM;
          proj.datum_params[3] *= Proj4js.common.SEC_TO_RAD;
          proj.datum_params[4] *= Proj4js.common.SEC_TO_RAD;
          proj.datum_params[5] *= Proj4js.common.SEC_TO_RAD;
          proj.datum_params[6] = (proj.datum_params[6]/1000000.0) + 1.0;
        }
      }
    }
    if (proj) {
      this.a = proj.a;    //datum object also uses these values
      this.b = proj.b;
      this.es = proj.es;
      this.ep2 = proj.ep2;
      this.datum_params = proj.datum_params;
    }
  },

  /****************************************************************/
  // cs_compare_datums()
  //   Returns TRUE if the two datums match, otherwise FALSE.
  compare_datums : function( dest ) {
    if( this.datum_type != dest.datum_type ) {
      return false; // false, datums are not equal
    } else if( this.a != dest.a || Math.abs(this.es-dest.es) > 0.000000000050 ) {
      // the tolerence for es is to ensure that GRS80 and WGS84
      // are considered identical
      return false;
    } else if( this.datum_type == Proj4js.common.PJD_3PARAM ) {
      return (this.datum_params[0] == dest.datum_params[0]
              && this.datum_params[1] == dest.datum_params[1]
              && this.datum_params[2] == dest.datum_params[2]);
    } else if( this.datum_type == Proj4js.common.PJD_7PARAM ) {
      return (this.datum_params[0] == dest.datum_params[0]
              && this.datum_params[1] == dest.datum_params[1]
              && this.datum_params[2] == dest.datum_params[2]
              && this.datum_params[3] == dest.datum_params[3]
              && this.datum_params[4] == dest.datum_params[4]
              && this.datum_params[5] == dest.datum_params[5]
              && this.datum_params[6] == dest.datum_params[6]);
    } else if ( this.datum_type == Proj4js.common.PJD_GRIDSHIFT ||
                dest.datum_type == Proj4js.common.PJD_GRIDSHIFT ) {
      alert("ERROR: Grid shift transformations are not implemented.");
      return false
    } else {
      return true; // datums are equal
    }
  }, // cs_compare_datums()

  /*
   * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
   * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
   * according to the current ellipsoid parameters.
   *
   *    Latitude  : Geodetic latitude in radians                     (input)
   *    Longitude : Geodetic longitude in radians                    (input)
   *    Height    : Geodetic height, in meters                       (input)
   *    X         : Calculated Geocentric X coordinate, in meters    (output)
   *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
   *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
   *
   */
  geodetic_to_geocentric : function(p) {
    var Longitude = p.x;
    var Latitude = p.y;
    var Height = p.z ? p.z : 0;   //Z value not always supplied
    var X;  // output
    var Y;
    var Z;

    var Error_Code=0;  //  GEOCENT_NO_ERROR;
    var Rn;            /*  Earth radius at location  */
    var Sin_Lat;       /*  Math.sin(Latitude)  */
    var Sin2_Lat;      /*  Square of Math.sin(Latitude)  */
    var Cos_Lat;       /*  Math.cos(Latitude)  */

    /*
    ** Don't blow up if Latitude is just a little out of the value
    ** range as it may just be a rounding issue.  Also removed longitude
    ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
    */
    if( Latitude < -Proj4js.common.HALF_PI && Latitude > -1.001 * Proj4js.common.HALF_PI ) {
        Latitude = -Proj4js.common.HALF_PI;
    } else if( Latitude > Proj4js.common.HALF_PI && Latitude < 1.001 * Proj4js.common.HALF_PI ) {
        Latitude = Proj4js.common.HALF_PI;
    } else if ((Latitude < -Proj4js.common.HALF_PI) || (Latitude > Proj4js.common.HALF_PI)) {
      /* Latitude out of range */
      Proj4js.reportError('geocent:lat out of range:'+Latitude);
      return null;
    }

    if (Longitude > Proj4js.common.PI) Longitude -= (2*Proj4js.common.PI);
    Sin_Lat = Math.sin(Latitude);
    Cos_Lat = Math.cos(Latitude);
    Sin2_Lat = Sin_Lat * Sin_Lat;
    Rn = this.a / (Math.sqrt(1.0e0 - this.es * Sin2_Lat));
    X = (Rn + Height) * Cos_Lat * Math.cos(Longitude);
    Y = (Rn + Height) * Cos_Lat * Math.sin(Longitude);
    Z = ((Rn * (1 - this.es)) + Height) * Sin_Lat;

    p.x = X;
    p.y = Y;
    p.z = Z;
    return Error_Code;
  }, // cs_geodetic_to_geocentric()


  geocentric_to_geodetic : function (p) {
/* local defintions and variables */
/* end-criterium of loop, accuracy of sin(Latitude) */
var genau = 1.E-12;
var genau2 = (genau*genau);
var maxiter = 30;

    var P;        /* distance between semi-minor axis and location */
    var RR;       /* distance between center and location */
    var CT;       /* sin of geocentric latitude */
    var ST;       /* cos of geocentric latitude */
    var RX;
    var RK;
    var RN;       /* Earth radius at location */
    var CPHI0;    /* cos of start or old geodetic latitude in iterations */
    var SPHI0;    /* sin of start or old geodetic latitude in iterations */
    var CPHI;     /* cos of searched geodetic latitude */
    var SPHI;     /* sin of searched geodetic latitude */
    var SDPHI;    /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
    var At_Pole;     /* indicates location is in polar region */
    var iter;        /* # of continous iteration, max. 30 is always enough (s.a.) */

    var X = p.x;
    var Y = p.y;
    var Z = p.z ? p.z : 0.0;   //Z value not always supplied
    var Longitude;
    var Latitude;
    var Height;

    At_Pole = false;
    P = Math.sqrt(X*X+Y*Y);
    RR = Math.sqrt(X*X+Y*Y+Z*Z);

/*      special cases for latitude and longitude */
    if (P/this.a < genau) {

/*  special case, if P=0. (X=0., Y=0.) */
        At_Pole = true;
        Longitude = 0.0;

/*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
 *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
        if (RR/this.a < genau) {
            Latitude = Proj4js.common.HALF_PI;
            Height   = -this.b;
            return;
        }
    } else {
/*  ellipsoidal (geodetic) longitude
 *  interval: -PI < Longitude <= +PI */
        Longitude=Math.atan2(Y,X);
    }

/* --------------------------------------------------------------
 * Following iterative algorithm was developped by
 * "Institut fďż˝r Erdmessung", University of Hannover, July 1988.
 * Internet: www.ife.uni-hannover.de
 * Iterative computation of CPHI,SPHI and Height.
 * Iteration of CPHI and SPHI to 10**-12 radian resp.
 * 2*10**-7 arcsec.
 * --------------------------------------------------------------
 */
    CT = Z/RR;
    ST = P/RR;
    RX = 1.0/Math.sqrt(1.0-this.es*(2.0-this.es)*ST*ST);
    CPHI0 = ST*(1.0-this.es)*RX;
    SPHI0 = CT*RX;
    iter = 0;

/* loop to find sin(Latitude) resp. Latitude
 * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
    do
    {
        iter++;
        RN = this.a/Math.sqrt(1.0-this.es*SPHI0*SPHI0);

/*  ellipsoidal (geodetic) height */
        Height = P*CPHI0+Z*SPHI0-RN*(1.0-this.es*SPHI0*SPHI0);

        RK = this.es*RN/(RN+Height);
        RX = 1.0/Math.sqrt(1.0-RK*(2.0-RK)*ST*ST);
        CPHI = ST*(1.0-RK)*RX;
        SPHI = CT*RX;
        SDPHI = SPHI*CPHI0-CPHI*SPHI0;
        CPHI0 = CPHI;
        SPHI0 = SPHI;
    }
    while (SDPHI*SDPHI > genau2 && iter < maxiter);

/*      ellipsoidal (geodetic) latitude */
    Latitude=Math.atan(SPHI/Math.abs(CPHI));

    p.x = Longitude;
    p.y = Latitude;
    p.z = Height;
    return p;
  }, // cs_geocentric_to_geodetic()

  /** Convert_Geocentric_To_Geodetic
   * The method used here is derived from 'An Improved Algorithm for
   * Geocentric to Geodetic Coordinate Conversion', by Ralph Toms, Feb 1996
   */
  geocentric_to_geodetic_noniter : function (p) {
    var X = p.x;
    var Y = p.y;
    var Z = p.z ? p.z : 0;   //Z value not always supplied
    var Longitude;
    var Latitude;
    var Height;

    var W;        /* distance from Z axis */
    var W2;       /* square of distance from Z axis */
    var T0;       /* initial estimate of vertical component */
    var T1;       /* corrected estimate of vertical component */
    var S0;       /* initial estimate of horizontal component */
    var S1;       /* corrected estimate of horizontal component */
    var Sin_B0;   /* Math.sin(B0), B0 is estimate of Bowring aux variable */
    var Sin3_B0;  /* cube of Math.sin(B0) */
    var Cos_B0;   /* Math.cos(B0) */
    var Sin_p1;   /* Math.sin(phi1), phi1 is estimated latitude */
    var Cos_p1;   /* Math.cos(phi1) */
    var Rn;       /* Earth radius at location */
    var Sum;      /* numerator of Math.cos(phi1) */
    var At_Pole;  /* indicates location is in polar region */

    X = parseFloat(X);  // cast from string to float
    Y = parseFloat(Y);
    Z = parseFloat(Z);

    At_Pole = false;
    if (X != 0.0)
    {
        Longitude = Math.atan2(Y,X);
    }
    else
    {
        if (Y > 0)
        {
            Longitude = Proj4js.common.HALF_PI;
        }
        else if (Y < 0)
        {
            Longitude = -Proj4js.common.HALF_PI;
        }
        else
        {
            At_Pole = true;
            Longitude = 0.0;
            if (Z > 0.0)
            {  /* north pole */
                Latitude = Proj4js.common.HALF_PI;
            }
            else if (Z < 0.0)
            {  /* south pole */
                Latitude = -Proj4js.common.HALF_PI;
            }
            else
            {  /* center of earth */
                Latitude = Proj4js.common.HALF_PI;
                Height = -this.b;
                return;
            }
        }
    }
    W2 = X*X + Y*Y;
    W = Math.sqrt(W2);
    T0 = Z * Proj4js.common.AD_C;
    S0 = Math.sqrt(T0 * T0 + W2);
    Sin_B0 = T0 / S0;
    Cos_B0 = W / S0;
    Sin3_B0 = Sin_B0 * Sin_B0 * Sin_B0;
    T1 = Z + this.b * this.ep2 * Sin3_B0;
    Sum = W - this.a * this.es * Cos_B0 * Cos_B0 * Cos_B0;
    S1 = Math.sqrt(T1*T1 + Sum * Sum);
    Sin_p1 = T1 / S1;
    Cos_p1 = Sum / S1;
    Rn = this.a / Math.sqrt(1.0 - this.es * Sin_p1 * Sin_p1);
    if (Cos_p1 >= Proj4js.common.COS_67P5)
    {
        Height = W / Cos_p1 - Rn;
    }
    else if (Cos_p1 <= -Proj4js.common.COS_67P5)
    {
        Height = W / -Cos_p1 - Rn;
    }
    else
    {
        Height = Z / Sin_p1 + Rn * (this.es - 1.0);
    }
    if (At_Pole == false)
    {
        Latitude = Math.atan(Sin_p1 / Cos_p1);
    }

    p.x = Longitude;
    p.y = Latitude;
    p.z = Height;
    return p;
  }, // geocentric_to_geodetic_noniter()

  /****************************************************************/
  // pj_geocentic_to_wgs84( p )
  //  p = point to transform in geocentric coordinates (x,y,z)
  geocentric_to_wgs84 : function ( p ) {

    if( this.datum_type == Proj4js.common.PJD_3PARAM )
    {
      // if( x[io] == HUGE_VAL )
      //    continue;
      p.x += this.datum_params[0];
      p.y += this.datum_params[1];
      p.z += this.datum_params[2];

    }
    else if (this.datum_type == Proj4js.common.PJD_7PARAM)
    {
      var Dx_BF =this.datum_params[0];
      var Dy_BF =this.datum_params[1];
      var Dz_BF =this.datum_params[2];
      var Rx_BF =this.datum_params[3];
      var Ry_BF =this.datum_params[4];
      var Rz_BF =this.datum_params[5];
      var M_BF  =this.datum_params[6];
      // if( x[io] == HUGE_VAL )
      //    continue;
      var x_out = M_BF*(       p.x - Rz_BF*p.y + Ry_BF*p.z) + Dx_BF;
      var y_out = M_BF*( Rz_BF*p.x +       p.y - Rx_BF*p.z) + Dy_BF;
      var z_out = M_BF*(-Ry_BF*p.x + Rx_BF*p.y +       p.z) + Dz_BF;
      p.x = x_out;
      p.y = y_out;
      p.z = z_out;
    }
  }, // cs_geocentric_to_wgs84

  /****************************************************************/
  // pj_geocentic_from_wgs84()
  //  coordinate system definition,
  //  point to transform in geocentric coordinates (x,y,z)
  geocentric_from_wgs84 : function( p ) {

    if( this.datum_type == Proj4js.common.PJD_3PARAM )
    {
      //if( x[io] == HUGE_VAL )
      //    continue;
      p.x -= this.datum_params[0];
      p.y -= this.datum_params[1];
      p.z -= this.datum_params[2];

    }
    else if (this.datum_type == Proj4js.common.PJD_7PARAM)
    {
      var Dx_BF =this.datum_params[0];
      var Dy_BF =this.datum_params[1];
      var Dz_BF =this.datum_params[2];
      var Rx_BF =this.datum_params[3];
      var Ry_BF =this.datum_params[4];
      var Rz_BF =this.datum_params[5];
      var M_BF  =this.datum_params[6];
      var x_tmp = (p.x - Dx_BF) / M_BF;
      var y_tmp = (p.y - Dy_BF) / M_BF;
      var z_tmp = (p.z - Dz_BF) / M_BF;
      //if( x[io] == HUGE_VAL )
      //    continue;

      p.x =        x_tmp + Rz_BF*y_tmp - Ry_BF*z_tmp;
      p.y = -Rz_BF*x_tmp +       y_tmp + Rx_BF*z_tmp;
      p.z =  Ry_BF*x_tmp - Rx_BF*y_tmp +       z_tmp;
    } //cs_geocentric_from_wgs84()
  }
});

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
    Other point classes may be used as long as they have
    x and y properties, which will get modified in the transform method.
*/
Proj4js.Point = Proj4js.Class({

    /**
     * Constructor: Proj4js.Point
     *
     * Parameters:
     * - x {float} or {Array} either the first coordinates component or
     *     the full coordinates
     * - y {float} the second component
     * - z {float} the third component, optional.
     */
    initialize : function(x,y,z) {
      if (typeof x == 'object') {
        this.x = x[0];
        this.y = x[1];
        this.z = x[2] || 0.0;
      } else if (typeof x == 'string' && typeof y == 'undefined') {
        var coords = x.split(',');
        this.x = parseFloat(coords[0]);
        this.y = parseFloat(coords[1]);
        this.z = parseFloat(coords[2]) || 0.0;
      } else {
        this.x = x;
        this.y = y;
        this.z = z || 0.0;
      }
    },

    /**
     * APIMethod: clone
     * Build a copy of a Proj4js.Point object.
     *
     * Return:
     * {Proj4js}.Point the cloned point.
     */
    clone : function() {
      return new Proj4js.Point(this.x, this.y, this.z);
    },

    /**
     * APIMethod: toString
     * Return a readable string version of the point
     *
     * Return:
     * {String} String representation of Proj4js.Point object. 
     *           (ex. <i>"x=5,y=42"</i>)
     */
    toString : function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /** 
     * APIMethod: toShortString
     * Return a short string version of the point.
     *
     * Return:
     * {String} Shortened String representation of Proj4js.Point object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString : function() {
        return (this.x + ", " + this.y);
    }
});

Proj4js.PrimeMeridian = {
    "greenwich": 0.0,               //"0dE",
    "lisbon":     -9.131906111111,   //"9d07'54.862\"W",
    "paris":       2.337229166667,   //"2d20'14.025\"E",
    "bogota":    -74.080916666667,  //"74d04'51.3\"W",
    "madrid":     -3.687938888889,  //"3d41'16.58\"W",
    "rome":       12.452333333333,  //"12d27'8.4\"E",
    "bern":        7.439583333333,  //"7d26'22.5\"E",
    "jakarta":   106.807719444444,  //"106d48'27.79\"E",
    "ferro":     -17.666666666667,  //"17d40'W",
    "brussels":    4.367975,        //"4d22'4.71\"E",
    "stockholm":  18.058277777778,  //"18d3'29.8\"E",
    "athens":     23.7163375,       //"23d42'58.815\"E",
    "oslo":       10.722916666667   //"10d43'22.5\"E"
};

Proj4js.Ellipsoid = {
  "MERIT": {a:6378137.0, rf:298.257, ellipseName:"MERIT 1983"},
  "SGS85": {a:6378136.0, rf:298.257, ellipseName:"Soviet Geodetic System 85"},
  "GRS80": {a:6378137.0, rf:298.257222101, ellipseName:"GRS 1980(IUGG, 1980)"},
  "IAU76": {a:6378140.0, rf:298.257, ellipseName:"IAU 1976"},
  "airy": {a:6377563.396, b:6356256.910, ellipseName:"Airy 1830"},
  "APL4.": {a:6378137, rf:298.25, ellipseName:"Appl. Physics. 1965"},
  "NWL9D": {a:6378145.0, rf:298.25, ellipseName:"Naval Weapons Lab., 1965"},
  "mod_airy": {a:6377340.189, b:6356034.446, ellipseName:"Modified Airy"},
  "andrae": {a:6377104.43, rf:300.0, ellipseName:"Andrae 1876 (Den., Iclnd.)"},
  "aust_SA": {a:6378160.0, rf:298.25, ellipseName:"Australian Natl & S. Amer. 1969"},
  "GRS67": {a:6378160.0, rf:298.2471674270, ellipseName:"GRS 67(IUGG 1967)"},
  "bessel": {a:6377397.155, rf:299.1528128, ellipseName:"Bessel 1841"},
  "bess_nam": {a:6377483.865, rf:299.1528128, ellipseName:"Bessel 1841 (Namibia)"},
  "clrk66": {a:6378206.4, b:6356583.8, ellipseName:"Clarke 1866"},
  "clrk80": {a:6378249.145, rf:293.4663, ellipseName:"Clarke 1880 mod."},
  "CPM": {a:6375738.7, rf:334.29, ellipseName:"Comm. des Poids et Mesures 1799"},
  "delmbr": {a:6376428.0, rf:311.5, ellipseName:"Delambre 1810 (Belgium)"},
  "engelis": {a:6378136.05, rf:298.2566, ellipseName:"Engelis 1985"},
  "evrst30": {a:6377276.345, rf:300.8017, ellipseName:"Everest 1830"},
  "evrst48": {a:6377304.063, rf:300.8017, ellipseName:"Everest 1948"},
  "evrst56": {a:6377301.243, rf:300.8017, ellipseName:"Everest 1956"},
  "evrst69": {a:6377295.664, rf:300.8017, ellipseName:"Everest 1969"},
  "evrstSS": {a:6377298.556, rf:300.8017, ellipseName:"Everest (Sabah & Sarawak)"},
  "fschr60": {a:6378166.0, rf:298.3, ellipseName:"Fischer (Mercury Datum) 1960"},
  "fschr60m": {a:6378155.0, rf:298.3, ellipseName:"Fischer 1960"},
  "fschr68": {a:6378150.0, rf:298.3, ellipseName:"Fischer 1968"},
  "helmert": {a:6378200.0, rf:298.3, ellipseName:"Helmert 1906"},
  "hough": {a:6378270.0, rf:297.0, ellipseName:"Hough"},
  "intl": {a:6378388.0, rf:297.0, ellipseName:"International 1909 (Hayford)"},
  "kaula": {a:6378163.0, rf:298.24, ellipseName:"Kaula 1961"},
  "lerch": {a:6378139.0, rf:298.257, ellipseName:"Lerch 1979"},
  "mprts": {a:6397300.0, rf:191.0, ellipseName:"Maupertius 1738"},
  "new_intl": {a:6378157.5, b:6356772.2, ellipseName:"New International 1967"},
  "plessis": {a:6376523.0, rf:6355863.0, ellipseName:"Plessis 1817 (France)"},
  "krass": {a:6378245.0, rf:298.3, ellipseName:"Krassovsky, 1942"},
  "SEasia": {a:6378155.0, b:6356773.3205, ellipseName:"Southeast Asia"},
  "walbeck": {a:6376896.0, b:6355834.8467, ellipseName:"Walbeck"},
  "WGS60": {a:6378165.0, rf:298.3, ellipseName:"WGS 60"},
  "WGS66": {a:6378145.0, rf:298.25, ellipseName:"WGS 66"},
  "WGS72": {a:6378135.0, rf:298.26, ellipseName:"WGS 72"},
  "WGS84": {a:6378137.0, rf:298.257223563, ellipseName:"WGS 84"},
  "sphere": {a:6370997.0, b:6370997.0, ellipseName:"Normal Sphere (r=6370997)"}
};

Proj4js.Datum = {
  "WGS84": {towgs84: "0,0,0", ellipse: "WGS84", datumName: "WGS84"},
  "GGRS87": {towgs84: "-199.87,74.79,246.62", ellipse: "GRS80", datumName: "Greek_Geodetic_Reference_System_1987"},
  "NAD83": {towgs84: "0,0,0", ellipse: "GRS80", datumName: "North_American_Datum_1983"},
  "NAD27": {nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat", ellipse: "clrk66", datumName: "North_American_Datum_1927"},
  "potsdam": {towgs84: "606.0,23.0,413.0", ellipse: "bessel", datumName: "Potsdam Rauenberg 1950 DHDN"},
  "carthage": {towgs84: "-263.0,6.0,431.0", ellipse: "clark80", datumName: "Carthage 1934 Tunisia"},
  "hermannskogel": {towgs84: "653.0,-212.0,449.0", ellipse: "bessel", datumName: "Hermannskogel"},
  "ire65": {towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15", ellipse: "mod_airy", datumName: "Ireland 1965"},
  "nzgd49": {towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993", ellipse: "intl", datumName: "New Zealand Geodetic Datum 1949"},
  "OSGB36": {towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894", ellipse: "airy", datumName: "Airy 1830"}
};

Proj4js.WGS84 = new Proj4js.Proj('WGS84');
Proj4js.Datum['OSB36'] = Proj4js.Datum['OSGB36']; //as returned from spatialreference.org

//lookup table to go from the projection name in WKT to the Proj4js projection name
//build this out as required
Proj4js.wktProjections = {
  "Lambert Tangential Conformal Conic Projection": "lcc",
  "Mercator": "merc",
  "Popular Visualisation Pseudo Mercator": "merc",
  "Mercator_1SP": "merc",
  "Transverse_Mercator": "tmerc",
  "Transverse Mercator": "tmerc",
  "Lambert Azimuthal Equal Area": "laea",
  "Universal Transverse Mercator System": "utm"
};


/* ======================================================================
    projCode/aea.js
   ====================================================================== */

/*******************************************************************************
NAME                     ALBERS CONICAL EQUAL AREA 

PURPOSE:	Transforms input longitude and latitude to Easting and Northing
		for the Albers Conical Equal Area projection.  The longitude
		and latitude must be in radians.  The Easting and Northing
		values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan,       	Feb, 1992

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/


Proj4js.Proj.aea = {
  init : function() {

    if (Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN) {
       Proj4js.reportError("aeaInitEqualLatitudes");
       return;
    }
    this.temp = this.b / this.a;
    this.es = 1.0 - Math.pow(this.temp,2);
    this.e3 = Math.sqrt(this.es);

    this.sin_po=Math.sin(this.lat1);
    this.cos_po=Math.cos(this.lat1);
    this.t1=this.sin_po;
    this.con = this.sin_po;
    this.ms1 = Proj4js.common.msfnz(this.e3,this.sin_po,this.cos_po);
    this.qs1 = Proj4js.common.qsfnz(this.e3,this.sin_po,this.cos_po);

    this.sin_po=Math.sin(this.lat2);
    this.cos_po=Math.cos(this.lat2);
    this.t2=this.sin_po;
    this.ms2 = Proj4js.common.msfnz(this.e3,this.sin_po,this.cos_po);
    this.qs2 = Proj4js.common.qsfnz(this.e3,this.sin_po,this.cos_po);

    this.sin_po=Math.sin(this.lat0);
    this.cos_po=Math.cos(this.lat0);
    this.t3=this.sin_po;
    this.qs0 = Proj4js.common.qsfnz(this.e3,this.sin_po,this.cos_po);

    if (Math.abs(this.lat1 - this.lat2) > Proj4js.common.EPSLN) {
      this.ns0 = (this.ms1 * this.ms1 - this.ms2 *this.ms2)/ (this.qs2 - this.qs1);
    } else {
      this.ns0 = this.con;
    }
    this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
    this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0)/this.ns0;
  },

/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  -------------------------------------------------------------------*/
  forward: function(p){

    var lon=p.x;
    var lat=p.y;

    this.sin_phi=Math.sin(lat);
    this.cos_phi=Math.cos(lat);

    var qs = Proj4js.common.qsfnz(this.e3,this.sin_phi,this.cos_phi);
    var rh1 =this.a * Math.sqrt(this.c - this.ns0 * qs)/this.ns0;
    var theta = this.ns0 * Proj4js.common.adjust_lon(lon - this.long0); 
    var x = rh1 * Math.sin(theta) + this.x0;
    var y = this.rh - rh1 * Math.cos(theta) + this.y0;

    p.x = x; 
    p.y = y;
    return p;
  },


  inverse: function(p) {
    var rh1,qs,con,theta,lon,lat;

    p.x -= this.x0;
    p.y = this.rh - p.y + this.y0;
    if (this.ns0 >= 0) {
      rh1 = Math.sqrt(p.x *p.x + p.y * p.y);
      con = 1.0;
    } else {
      rh1 = -Math.sqrt(p.x * p.x + p.y *p.y);
      con = -1.0;
    }
    theta = 0.0;
    if (rh1 != 0.0) {
      theta = Math.atan2(con * p.x, con * p.y);
    }
    con = rh1 * this.ns0 / this.a;
    qs = (this.c - con * con) / this.ns0;
    if (this.e3 >= 1e-10) {
      con = 1 - .5 * (1.0 -this.es) * Math.log((1.0 - this.e3) / (1.0 + this.e3))/this.e3;
      if (Math.abs(Math.abs(con) - Math.abs(qs)) > .0000000001 ) {
          lat = this.phi1z(this.e3,qs);
      } else {
          if (qs >= 0) {
             lat = .5 * Proj4js.common.PI;
          } else {
             lat = -.5 * Proj4js.common.PI;
          }
      }
    } else {
      lat = this.phi1z(this.e3,qs);
    }

    lon = Proj4js.common.adjust_lon(theta/this.ns0 + this.long0);
    p.x = lon;
    p.y = lat;
    return p;
  },
  
/* Function to compute phi1, the latitude for the inverse of the
   Albers Conical Equal-Area projection.
-------------------------------------------*/
  phi1z: function (eccent,qs) {
    var sinphi, cosphi, con, com, dphi;
    var phi = Proj4js.common.asinz(.5 * qs);
    if (eccent < Proj4js.common.EPSLN) return phi;
    
    var eccnts = eccent * eccent; 
    for (var i = 1; i <= 25; i++) {
        sinphi = Math.sin(phi);
        cosphi = Math.cos(phi);
        con = eccent * sinphi; 
        com = 1.0 - con * con;
        dphi = .5 * com * com / cosphi * (qs / (1.0 - eccnts) - sinphi / com + .5 / eccent * Math.log((1.0 - con) / (1.0 + con)));
        phi = phi + dphi;
        if (Math.abs(dphi) <= 1e-7) return phi;
    }
    Proj4js.reportError("aea:phi1z:Convergence error");
    return null;
  }
  
};



/* ======================================================================
    projCode/sterea.js
   ====================================================================== */


Proj4js.Proj.sterea = {
  dependsOn : 'gauss',

  init : function() {
    Proj4js.Proj['gauss'].init.apply(this);
    if (!this.rc) {
      Proj4js.reportError("sterea:init:E_ERROR_0");
      return;
    }
    this.sinc0 = Math.sin(this.phic0);
    this.cosc0 = Math.cos(this.phic0);
    this.R2 = 2.0 * this.rc;
    if (!this.title) this.title = "Oblique Stereographic Alternative";
  },

  forward : function(p) {
    var sinc, cosc, cosl, k;
    p.x = Proj4js.common.adjust_lon(p.x-this.long0); /* adjust del longitude */
    Proj4js.Proj['gauss'].forward.apply(this, [p]);
    sinc = Math.sin(p.y);
    cosc = Math.cos(p.y);
    cosl = Math.cos(p.x);
    k = this.k0 * this.R2 / (1.0 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
    p.x = k * cosc * Math.sin(p.x);
    p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
    p.x = this.a * p.x + this.x0;
    p.y = this.a * p.y + this.y0;
    return p;
  },

  inverse : function(p) {
    var sinc, cosc, lon, lat, rho;
    p.x = (p.x - this.x0) / this.a; /* descale and de-offset */
    p.y = (p.y - this.y0) / this.a;

    p.x /= this.k0;
    p.y /= this.k0;
    if ( (rho = Math.sqrt(p.x*p.x + p.y*p.y)) ) {
      var c = 2.0 * Math.atan2(rho, this.R2);
      sinc = Math.sin(c);
      cosc = Math.cos(c);
      lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
      lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
    } else {
      lat = this.phic0;
      lon = 0.;
    }

    p.x = lon;
    p.y = lat;
    Proj4js.Proj['gauss'].inverse.apply(this,[p]);
    p.x = Proj4js.common.adjust_lon(p.x + this.long0); /* adjust longitude to CM */
    return p;
  }
};

/* ======================================================================
    projCode/poly.js
   ====================================================================== */

/* Function to compute, phi4, the latitude for the inverse of the
   Polyconic projection.
------------------------------------------------------------*/
function phi4z (eccent,e0,e1,e2,e3,a,b,c,phi) {
	var sinphi, sin2ph, tanphi, ml, mlp, con1, con2, con3, dphi, i;

	phi = a;
	for (i = 1; i <= 15; i++) {
		sinphi = Math.sin(phi);
		tanphi = Math.tan(phi);
		c = tanphi * Math.sqrt (1.0 - eccent * sinphi * sinphi);
		sin2ph = Math.sin (2.0 * phi);
		/*
		ml = e0 * *phi - e1 * sin2ph + e2 * sin (4.0 *  *phi);
		mlp = e0 - 2.0 * e1 * cos (2.0 *  *phi) + 4.0 * e2 *  cos (4.0 *  *phi);
		*/
		ml = e0 * phi - e1 * sin2ph + e2 * Math.sin (4.0 *  phi) - e3 * Math.sin (6.0 * phi);
		mlp = e0 - 2.0 * e1 * Math.cos (2.0 *  phi) + 4.0 * e2 * Math.cos (4.0 *  phi) - 6.0 * e3 * Math.cos (6.0 *  phi);
		con1 = 2.0 * ml + c * (ml * ml + b) - 2.0 * a *  (c * ml + 1.0);
		con2 = eccent * sin2ph * (ml * ml + b - 2.0 * a * ml) / (2.0 *c);
		con3 = 2.0 * (a - ml) * (c * mlp - 2.0 / sin2ph) - 2.0 * mlp;
		dphi = con1 / (con2 + con3);
		phi += dphi;
		if (Math.abs(dphi) <= .0000000001 ) return(phi);   
	}
	Proj4js.reportError("phi4z: No convergence");
	return null;
}


/* Function to compute the constant e4 from the input of the eccentricity
   of the spheroid, x.  This constant is used in the Polar Stereographic
   projection.
--------------------------------------------------------------------*/
function e4fn(x) {
	var con, com;
	con = 1.0 + x;
	com = 1.0 - x;
	return (Math.sqrt((Math.pow(con,con))*(Math.pow(com,com))));
}





/*******************************************************************************
NAME                             POLYCONIC 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Polyconic projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/

Proj4js.Proj.poly = {

	/* Initialize the POLYCONIC projection
	  ----------------------------------*/
	init: function() {
		var temp;			/* temporary variable		*/
		if (this.lat0 == 0) this.lat0 = 90;//this.lat0 ca

		/* Place parameters in static storage for common use
		  -------------------------------------------------*/
		this.temp = this.b / this.a;
		this.es = 1.0 - Math.pow(this.temp,2);// devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles 
		this.e = Math.sqrt(this.es);
		this.e0 = Proj4js.common.e0fn(this.es);
		this.e1 = Proj4js.common.e1fn(this.es);
		this.e2 = Proj4js.common.e2fn(this.es);
		this.e3 = Proj4js.common.e3fn(this.es);
		this.ml0 = Proj4js.common.mlfn(this.e0, this.e1,this.e2, this.e3, this.lat0);//si que des zeros le calcul ne se fait pas
		//if (!this.ml0) {this.ml0=0;}
	},


	/* Polyconic forward equations--mapping lat,long to x,y
	  ---------------------------------------------------*/
	forward: function(p) {
		var sinphi, cosphi;	/* sin and cos value				*/
		var al;				/* temporary values				*/
		var c;				/* temporary values				*/
		var con, ml;		/* cone constant, small m			*/
		var ms;				/* small m					*/
		var x,y;

		var lon=p.x;
		var lat=p.y;	

		con = Proj4js.common.adjust_lon(lon - this.long0);
		if (Math.abs(lat) <= .0000001) {
			x = this.x0 + this.a * con;
			y = this.y0 - this.a * this.ml0;
		} else {
			sinphi = Math.sin(lat);
			cosphi = Math.cos(lat);	   

			ml = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, lat);
			ms = Proj4js.common.msfnz(this.e,sinphi,cosphi);
			con = sinphi;
			x = this.x0 + this.a * ms * Math.sin(con)/sinphi;
			y = this.y0 + this.a * (ml - this.ml0 + ms * (1.0 - Math.cos(con))/sinphi);
		}

		p.x=x;
		p.y=y;   
		return p;
	},


	/* Inverse equations
	-----------------*/
	inverse: function(p) {
		var sin_phi, cos_phi;	/* sin and cos value				*/
		var al;					/* temporary values				*/
		var b;					/* temporary values				*/
		var c;					/* temporary values				*/
		var con, ml;			/* cone constant, small m			*/
		var iflg;				/* error flag					*/
		var lon,lat;
		p.x -= this.x0;
		p.y -= this.y0;
		al = this.ml0 + p.y/this.a;
		iflg = 0;

		if (Math.abs(al) <= .0000001) {
			lon = p.x/this.a + this.long0;
			lat = 0.0;
		} else {
			b = al * al + (p.x/this.a) * (p.x/this.a);
			iflg = phi4z(this.es,this.e0,this.e1,this.e2,this.e3,this.al,b,c,lat);
			if (iflg != 1) return(iflg);
			lon = Proj4js.common.adjust_lon((Proj4js.common.asinz(p.x * c / this.a) / Math.sin(lat)) + this.long0);
		}

		p.x=lon;
		p.y=lat;
		return p;
	}
};



/* ======================================================================
    projCode/equi.js
   ====================================================================== */

/*******************************************************************************
NAME                             EQUIRECTANGULAR 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Equirectangular projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/
Proj4js.Proj.equi = {

  init: function() {
    if(!this.x0) this.x0=0;
    if(!this.y0) this.y0=0;
    if(!this.lat0) this.lat0=0;
    if(!this.long0) this.long0=0;
    ///this.t2;
  },



/* Equirectangular forward equations--mapping lat,long to x,y
  ---------------------------------------------------------*/
  forward: function(p) {

    var lon=p.x;				
    var lat=p.y;			

    var dlon = Proj4js.common.adjust_lon(lon - this.long0);
    var x = this.x0 +this. a * dlon *Math.cos(this.lat0);
    var y = this.y0 + this.a * lat;

    this.t1=x;
    this.t2=Math.cos(this.lat0);
    p.x=x;
    p.y=y;
    return p;
  },  //equiFwd()



/* Equirectangular inverse equations--mapping x,y to lat/long
  ---------------------------------------------------------*/
  inverse: function(p) {

    p.x -= this.x0;
    p.y -= this.y0;
    var lat = p.y /this. a;

    if ( Math.abs(lat) > Proj4js.common.HALF_PI) {
        Proj4js.reportError("equi:Inv:DataError");
    }
    var lon = Proj4js.common.adjust_lon(this.long0 + p.x / (this.a * Math.cos(this.lat0)));
    p.x=lon;
    p.y=lat;
  }//equiInv()
};


/* ======================================================================
    projCode/merc.js
   ====================================================================== */

/*******************************************************************************
NAME                            MERCATOR

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
D. Steinwand, EROS      Nov, 1991
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/

//static double r_major = a;		   /* major axis 				*/
//static double r_minor = b;		   /* minor axis 				*/
//static double lon_center = long0;	   /* Center longitude (projection center) */
//static double lat_origin =  lat0;	   /* center latitude			*/
//static double e,es;		           /* eccentricity constants		*/
//static double m1;		               /* small value m			*/
//static double false_northing = y0;   /* y offset in meters			*/
//static double false_easting = x0;	   /* x offset in meters			*/
//scale_fact = k0 

Proj4js.Proj.merc = {
  init : function() {
	//?this.temp = this.r_minor / this.r_major;
	//this.temp = this.b / this.a;
	//this.es = 1.0 - Math.sqrt(this.temp);
	//this.e = Math.sqrt( this.es );
	//?this.m1 = Math.cos(this.lat_origin) / (Math.sqrt( 1.0 - this.es * Math.sin(this.lat_origin) * Math.sin(this.lat_origin)));
	//this.m1 = Math.cos(0.0) / (Math.sqrt( 1.0 - this.es * Math.sin(0.0) * Math.sin(0.0)));
    if (this.lat_ts) {
      if (this.sphere) {
        this.k0 = Math.cos(this.lat_ts);
      } else {
        this.k0 = Proj4js.common.msfnz(this.es, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
      }
    }
  },

/* Mercator forward equations--mapping lat,long to x,y
  --------------------------------------------------*/

  forward : function(p) {	
    //alert("ll2m coords : "+coords);
    var lon = p.x;
    var lat = p.y;
    // convert to radians
    if ( lat*Proj4js.common.R2D > 90.0 && 
          lat*Proj4js.common.R2D < -90.0 && 
          lon*Proj4js.common.R2D > 180.0 && 
          lon*Proj4js.common.R2D < -180.0) {
      Proj4js.reportError("merc:forward: llInputOutOfRange: "+ lon +" : " + lat);
      return null;
    }

    var x,y;
    if(Math.abs( Math.abs(lat) - Proj4js.common.HALF_PI)  <= Proj4js.common.EPSLN) {
      Proj4js.reportError("merc:forward: ll2mAtPoles");
      return null;
    } else {
      if (this.sphere) {
        x = this.x0 + this.a * this.k0 * Proj4js.common.adjust_lon(lon - this.long0);
        y = this.y0 + this.a * this.k0 * Math.log(Math.tan(Proj4js.common.FORTPI + 0.5*lat));
      } else {
        var sinphi = Math.sin(lat);
        var ts = Proj4js.common.tsfnz(this.e,lat,sinphi);
        x = this.x0 + this.a * this.k0 * Proj4js.common.adjust_lon(lon - this.long0);
        y = this.y0 - this.a * this.k0 * Math.log(ts);
      }
      p.x = x; 
      p.y = y;
      return p;
    }
  },


  /* Mercator inverse equations--mapping x,y to lat/long
  --------------------------------------------------*/
  inverse : function(p) {	

    var x = p.x - this.x0;
    var y = p.y - this.y0;
    var lon,lat;

    if (this.sphere) {
      lat = Proj4js.common.HALF_PI - 2.0 * Math.atan(Math.exp(-y / this.a * this.k0));
    } else {
      var ts = Math.exp(-y / (this.a * this.k0));
      lat = Proj4js.common.phi2z(this.e,ts);
      if(lat == -9999) {
        Proj4js.reportError("merc:inverse: lat = -9999");
        return null;
      }
    }
    lon = Proj4js.common.adjust_lon(this.long0+ x / (this.a * this.k0));

    p.x = lon;
    p.y = lat;
    return p;
  }
};


/* ======================================================================
    projCode/utm.js
   ====================================================================== */

/*******************************************************************************
NAME                            TRANSVERSE MERCATOR

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Transverse Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/


/**
  Initialize Transverse Mercator projection
*/

Proj4js.Proj.utm = {
  dependsOn : 'tmerc',

  init : function() {
    if (!this.zone) {
      Proj4js.reportError("utm:init: zone must be specified for UTM");
      return;
    }
    this.lat0 = 0.0;
    this.long0 = ((6 * Math.abs(this.zone)) - 183) * Proj4js.common.D2R;
    this.x0 = 500000.0;
    this.y0 = this.utmSouth ? 10000000.0 : 0.0;
    this.k0 = 0.9996;

    Proj4js.Proj['tmerc'].init.apply(this);
    this.forward = Proj4js.Proj['tmerc'].forward;
    this.inverse = Proj4js.Proj['tmerc'].inverse;
  }
};
/* ======================================================================
    projCode/eqdc.js
   ====================================================================== */

/*******************************************************************************
NAME                            EQUIDISTANT CONIC 

PURPOSE:	Transforms input longitude and latitude to Easting and Northing
		for the Equidistant Conic projection.  The longitude and
		latitude must be in radians.  The Easting and Northing values
		will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/

/* Variables common to all subroutines in this code file
  -----------------------------------------------------*/

Proj4js.Proj.eqdc = {

/* Initialize the Equidistant Conic projection
  ------------------------------------------*/
  init: function() {

    /* Place parameters in static storage for common use
      -------------------------------------------------*/

    if(!this.mode) this.mode=0;//chosen default mode
    this.temp = this.b / this.a;
    this.es = 1.0 - Math.pow(this.temp,2);
    this.e = Math.sqrt(this.es);
    this.e0 = Proj4js.common.e0fn(this.es);
    this.e1 = Proj4js.common.e1fn(this.es);
    this.e2 = Proj4js.common.e2fn(this.es);
    this.e3 = Proj4js.common.e3fn(this.es);

    this.sinphi=Math.sin(this.lat1);
    this.cosphi=Math.cos(this.lat1);

    this.ms1 = Proj4js.common.msfnz(this.e,this.sinphi,this.cosphi);
    this.ml1 = Proj4js.common.mlfn(this.e0, this.e1, this.e2,this.e3, this.lat1);

    /* format B
    ---------*/
    if (this.mode != 0) {
      if (Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN) {
            Proj4js.reportError("eqdc:Init:EqualLatitudes");
            //return(81);
       }
       this.sinphi=Math.sin(this.lat2);
       this.cosphi=Math.cos(this.lat2);   

       this.ms2 = Proj4js.common.msfnz(this.e,this.sinphi,this.cosphi);
       this.ml2 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
       if (Math.abs(this.lat1 - this.lat2) >= Proj4js.common.EPSLN) {
         this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
       } else {
          this.ns = this.sinphi;
       }
    } else {
      this.ns = this.sinphi;
    }
    this.g = this.ml1 + this.ms1/this.ns;
    this.ml0 = Proj4js.common.mlfn(this.e0, this.e1,this. e2, this.e3, this.lat0);
    this.rh = this.a * (this.g - this.ml0);
  },


/* Equidistant Conic forward equations--mapping lat,long to x,y
  -----------------------------------------------------------*/
  forward: function(p) {
    var lon=p.x;
    var lat=p.y;

    /* Forward equations
      -----------------*/
    var ml = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, lat);
    var rh1 = this.a * (this.g - ml);
    var theta = this.ns * Proj4js.common.adjust_lon(lon - this.long0);

    var x = this.x0  + rh1 * Math.sin(theta);
    var y = this.y0 + this.rh - rh1 * Math.cos(theta);
    p.x=x;
    p.y=y;
    return p;
  },

/* Inverse equations
  -----------------*/
  inverse: function(p) {
    p.x -= this.x0;
    p.y  = this.rh - p.y + this.y0;
    var con, rh1;
    if (this.ns >= 0) {
       rh1 = Math.sqrt(p.x *p.x + p.y * p.y); 
       con = 1.0;
    } else {
       rh1 = -Math.sqrt(p.x *p. x +p. y * p.y); 
       con = -1.0;
    }
    var theta = 0.0;
    if (rh1 != 0.0) theta = Math.atan2(con *p.x, con *p.y);
    var ml = this.g - rh1 /this.a;
    var lat = this.phi3z(ml,this.e0,this.e1,this.e2,this.e3);
    var lon = Proj4js.common.adjust_lon(this.long0 + theta / this.ns);

     p.x=lon;
     p.y=lat;  
     return p;
    },
    
/* Function to compute latitude, phi3, for the inverse of the Equidistant
   Conic projection.
-----------------------------------------------------------------*/
  phi3z: function(ml,e0,e1,e2,e3) {
    var phi;
    var dphi;

    phi = ml;
    for (var i = 0; i < 15; i++) {
      dphi = (ml + e1 * Math.sin(2.0 * phi) - e2 * Math.sin(4.0 * phi) + e3 * Math.sin(6.0 * phi))/ e0 - phi;
      phi += dphi;
      if (Math.abs(dphi) <= .0000000001) {
        return phi;
      }
    }
    Proj4js.reportError("PHI3Z-CONV:Latitude failed to converge after 15 iterations");
    return null;
  }

    
};
/* ======================================================================
    projCode/tmerc.js
   ====================================================================== */

/*******************************************************************************
NAME                            TRANSVERSE MERCATOR

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Transverse Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/


/**
  Initialize Transverse Mercator projection
*/

Proj4js.Proj.tmerc = {
  init : function() {
    this.e0 = Proj4js.common.e0fn(this.es);
    this.e1 = Proj4js.common.e1fn(this.es);
    this.e2 = Proj4js.common.e2fn(this.es);
    this.e3 = Proj4js.common.e3fn(this.es);
    this.ml0 = this.a * Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
  },

  /**
    Transverse Mercator Forward  - long/lat to x/y
    long/lat in radians
  */
  forward : function(p) {
    var lon = p.x;
    var lat = p.y;

    var delta_lon = Proj4js.common.adjust_lon(lon - this.long0); // Delta longitude
    var con;    // cone constant
    var x, y;
    var sin_phi=Math.sin(lat);
    var cos_phi=Math.cos(lat);

    if (this.sphere) {  /* spherical form */
      var b = cos_phi * Math.sin(delta_lon);
      if ((Math.abs(Math.abs(b) - 1.0)) < .0000000001)  {
        Proj4js.reportError("tmerc:forward: Point projects into infinity");
        return(93);
      } else {
        x = .5 * this.a * this.k0 * Math.log((1.0 + b)/(1.0 - b));
        con = Math.acos(cos_phi * Math.cos(delta_lon)/Math.sqrt(1.0 - b*b));
        if (lat < 0) con = - con;
        y = this.a * this.k0 * (con - this.lat0);
      }
    } else {
      var al  = cos_phi * delta_lon;
      var als = Math.pow(al,2);
      var c   = this.ep2 * Math.pow(cos_phi,2);
      var tq  = Math.tan(lat);
      var t   = Math.pow(tq,2);
      con = 1.0 - this.es * Math.pow(sin_phi,2);
      var n   = this.a / Math.sqrt(con);
      var ml  = this.a * Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, lat);

      x = this.k0 * n * al * (1.0 + als / 6.0 * (1.0 - t + c + als / 20.0 * (5.0 - 18.0 * t + Math.pow(t,2) + 72.0 * c - 58.0 * this.ep2))) + this.x0;
      y = this.k0 * (ml - this.ml0 + n * tq * (als * (0.5 + als / 24.0 * (5.0 - t + 9.0 * c + 4.0 * Math.pow(c,2) + als / 30.0 * (61.0 - 58.0 * t + Math.pow(t,2) + 600.0 * c - 330.0 * this.ep2))))) + this.y0;

    }
    p.x = x; p.y = y;
    return p;
  }, // tmercFwd()

  /**
    Transverse Mercator Inverse  -  x/y to long/lat
  */
  inverse : function(p) {
    var con, phi;  /* temporary angles       */
    var delta_phi; /* difference between longitudes    */
    var i;
    var max_iter = 6;      /* maximun number of iterations */
    var lat, lon;

    if (this.sphere) {   /* spherical form */
      var f = Math.exp(p.x/(this.a * this.k0));
      var g = .5 * (f - 1/f);
      var temp = this.lat0 + p.y/(this.a * this.k0);
      var h = Math.cos(temp);
      con = Math.sqrt((1.0 - h * h)/(1.0 + g * g));
      lat = Proj4js.common.asinz(con);
      if (temp < 0)
        lat = -lat;
      if ((g == 0) && (h == 0)) {
        lon = this.long0;
      } else {
        lon = Proj4js.common.adjust_lon(Math.atan2(g,h) + this.long0);
      }
    } else {    // ellipsoidal form
      var x = p.x - this.x0;
      var y = p.y - this.y0;

      con = (this.ml0 + y / this.k0) / this.a;
      phi = con;
      for (i=0;true;i++) {
        delta_phi=((con + this.e1 * Math.sin(2.0*phi) - this.e2 * Math.sin(4.0*phi) + this.e3 * Math.sin(6.0*phi)) / this.e0) - phi;
        phi += delta_phi;
        if (Math.abs(delta_phi) <= Proj4js.common.EPSLN) break;
        if (i >= max_iter) {
          Proj4js.reportError("tmerc:inverse: Latitude failed to converge");
          return(95);
        }
      } // for()
      if (Math.abs(phi) < Proj4js.common.HALF_PI) {
        // sincos(phi, &sin_phi, &cos_phi);
        var sin_phi=Math.sin(phi);
        var cos_phi=Math.cos(phi);
        var tan_phi = Math.tan(phi);
        var c = this.ep2 * Math.pow(cos_phi,2);
        var cs = Math.pow(c,2);
        var t = Math.pow(tan_phi,2);
        var ts = Math.pow(t,2);
        con = 1.0 - this.es * Math.pow(sin_phi,2);
        var n = this.a / Math.sqrt(con);
        var r = n * (1.0 - this.es) / con;
        var d = x / (n * this.k0);
        var ds = Math.pow(d,2);
        lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24.0 * (5.0 + 3.0 * t + 10.0 * c - 4.0 * cs - 9.0 * this.ep2 - ds / 30.0 * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * this.ep2 - 3.0 * cs)));
        lon = Proj4js.common.adjust_lon(this.long0 + (d * (1.0 - ds / 6.0 * (1.0 + 2.0 * t + c - ds / 20.0 * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * this.ep2 + 24.0 * ts))) / cos_phi));
      } else {
        lat = Proj4js.common.HALF_PI * Proj4js.common.sign(y);
        lon = this.long0;
      }
    }
    p.x = lon;
    p.y = lat;
    return p;
  } // tmercInv()
};
/* ======================================================================
    defs/GOOGLE.js
   ====================================================================== */

Proj4js.defs["GOOGLE"]="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.defs["EPSG:900913"]=Proj4js.defs["GOOGLE"];
/* ======================================================================
    projCode/gstmerc.js
   ====================================================================== */

Proj4js.Proj.gstmerc = {
  init : function() {

    // array of:  a, b, lon0, lat0, k0, x0, y0
      var temp= this.b / this.a;
      this.e= Math.sqrt(1.0 - temp*temp);
      this.lc= this.long0;
      this.rs= Math.sqrt(1.0+this.e*this.e*Math.pow(Math.cos(this.lat0),4.0)/(1.0-this.e*this.e));
      var sinz= Math.sin(this.lat0);
      var pc= Math.asin(sinz/this.rs);
      var sinzpc= Math.sin(pc);
      this.cp= Proj4js.common.latiso(0.0,pc,sinzpc)-this.rs*Proj4js.common.latiso(this.e,this.lat0,sinz);
      this.n2= this.k0*this.a*Math.sqrt(1.0-this.e*this.e)/(1.0-this.e*this.e*sinz*sinz);
      this.xs= this.x0;
      this.ys= this.y0-this.n2*pc;

      if (!this.title) this.title = "Gauss Schreiber transverse mercator";
    },


    // forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    forward : function(p) {

      var lon= p.x;
      var lat= p.y;

      var L= this.rs*(lon-this.lc);
      var Ls= this.cp+(this.rs*Proj4js.common.latiso(this.e,lat,Math.sin(lat)));
      var lat1= Math.asin(Math.sin(L)/Proj4js.common.cosh(Ls));
      var Ls1= Proj4js.common.latiso(0.0,lat1,Math.sin(lat1));
      p.x= this.xs+(this.n2*Ls1);
      p.y= this.ys+(this.n2*Math.atan(Proj4js.common.sinh(Ls)/Math.cos(L)));
      return p;
    },

  // inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------
  inverse : function(p) {

    var x= p.x;
    var y= p.y;

    var L= Math.atan(Proj4js.common.sinh((x-this.xs)/this.n2)/Math.cos((y-this.ys)/this.n2));
    var lat1= Math.asin(Math.sin((y-this.ys)/this.n2)/Proj4js.common.cosh((x-this.xs)/this.n2));
    var LC= Proj4js.common.latiso(0.0,lat1,Math.sin(lat1));
    p.x= this.lc+L/this.rs;
    p.y= Proj4js.common.invlatiso(this.e,(LC-this.cp)/this.rs);
    return p;
  }

};
/* ======================================================================
    projCode/ortho.js
   ====================================================================== */

/*******************************************************************************
NAME                             ORTHOGRAPHIC 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Orthographic projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/

Proj4js.Proj.ortho = {

  /* Initialize the Orthographic projection
    -------------------------------------*/
  init: function(def) {
    //double temp;			/* temporary variable		*/

    /* Place parameters in static storage for common use
      -------------------------------------------------*/;
    this.sin_p14=Math.sin(this.lat0);
    this.cos_p14=Math.cos(this.lat0);	
  },


  /* Orthographic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
  forward: function(p) {
    var sinphi, cosphi;	/* sin and cos value				*/
    var dlon;		/* delta longitude value			*/
    var coslon;		/* cos of longitude				*/
    var ksp;		/* scale factor					*/
    var g;		
    var lon=p.x;
    var lat=p.y;	
    /* Forward equations
      -----------------*/
    dlon = Proj4js.common.adjust_lon(lon - this.long0);

    sinphi=Math.sin(lat);
    cosphi=Math.cos(lat);	

    coslon = Math.cos(dlon);
    g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
    ksp = 1.0;
    if ((g > 0) || (Math.abs(g) <= Proj4js.common.EPSLN)) {
      var x = this.a * ksp * cosphi * Math.sin(dlon);
      var y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
    } else {
      Proj4js.reportError("orthoFwdPointError");
    }
    p.x=x;
    p.y=y;
    return p;
  },


  inverse: function(p) {
    var rh;		/* height above ellipsoid			*/
    var z;		/* angle					*/
    var sinz,cosz;	/* sin of z and cos of z			*/
    var temp;
    var con;
    var lon , lat;
    /* Inverse equations
      -----------------*/
    p.x -= this.x0;
    p.y -= this.y0;
    rh = Math.sqrt(p.x * p.x + p.y * p.y);
    if (rh > this.a + .0000001) {
      Proj4js.reportError("orthoInvDataError");
    }
    z = Proj4js.common.asinz(rh / this.a);

    sinz=Math.sin(z);
    cosz=Math.cos(z);

    lon = this.long0;
    if (Math.abs(rh) <= Proj4js.common.EPSLN) {
      lat = this.lat0; 
    }
    lat = Proj4js.common.asinz(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14)/rh);
    con = Math.abs(this.lat0) - Proj4js.common.HALF_PI;
    if (Math.abs(con) <= Proj4js.common.EPSLN) {
       if (this.lat0 >= 0) {
          lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
       } else {
          lon = Proj4js.common.adjust_lon(this.long0 -Math.atan2(-p.x, p.y));
       }
    }
    con = cosz - this.sin_p14 * Math.sin(lat);
    p.x=lon;
    p.y=lat;
    return p;
  }
};


/* ======================================================================
    projCode/krovak.js
   ====================================================================== */

/**
   NOTES: According to EPSG the full Krovak projection method should have
          the following parameters.  Within PROJ.4 the azimuth, and pseudo
          standard parallel are hardcoded in the algorithm and can't be 
          altered from outside.  The others all have defaults to match the
          common usage with Krovak projection.

  lat_0 = latitude of centre of the projection
         
  lon_0 = longitude of centre of the projection
  
  ** = azimuth (true) of the centre line passing through the centre of the projection

  ** = latitude of pseudo standard parallel
   
  k  = scale factor on the pseudo standard parallel
  
  x_0 = False Easting of the centre of the projection at the apex of the cone
  
  y_0 = False Northing of the centre of the projection at the apex of the cone

 **/

Proj4js.Proj.krovak = {

	init: function() {
		/* we want Bessel as fixed ellipsoid */
		this.a =  6377397.155;
		this.es = 0.006674372230614;
		this.e = Math.sqrt(this.es);
		/* if latitude of projection center is not set, use 49d30'N */
		if (!this.lat0) {
			this.lat0 = 0.863937979737193;
		}
		if (!this.long0) {
			this.long0 = 0.7417649320975901 - 0.308341501185665;
		}
		/* if scale not set default to 0.9999 */
		if (!this.k0) {
			this.k0 = 0.9999;
		}
		this.s45 = 0.785398163397448;    /* 45° */
		this.s90 = 2 * this.s45;
		this.fi0 = this.lat0;    /* Latitude of projection centre 49° 30' */
      		/*  Ellipsoid Bessel 1841 a = 6377397.155m 1/f = 299.1528128,
      					 e2=0.006674372230614;
		 */
		this.e2 = this.es;       /* 0.006674372230614; */
		this.e = Math.sqrt(this.e2);
		this.alfa = Math.sqrt(1. + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1. - this.e2));
		this.uq = 1.04216856380474;      /* DU(2, 59, 42, 42.69689) */
		this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
		this.g = Math.pow(   (1. + this.e * Math.sin(this.fi0)) / (1. - this.e * Math.sin(this.fi0)) , this.alfa * this.e / 2.  );
		this.k = Math.tan( this.u0 / 2. + this.s45) / Math.pow  (Math.tan(this.fi0 / 2. + this.s45) , this.alfa) * this.g;
		this.k1 = this.k0;
		this.n0 = this.a * Math.sqrt(1. - this.e2) / (1. - this.e2 * Math.pow(Math.sin(this.fi0), 2));
		this.s0 = 1.37008346281555;       /* Latitude of pseudo standard parallel 78° 30'00" N */
		this.n = Math.sin(this.s0);
		this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
		this.ad = this.s90 - this.uq;
	},
	
	/* ellipsoid */
	/* calculate xy from lat/lon */
	/* Constants, identical to inverse transform function */
	forward: function(p) {
		var gfi, u, deltav, s, d, eps, ro;
		var lon = p.x;
		var lat = p.y;
		var delta_lon = Proj4js.common.adjust_lon(lon - this.long0); // Delta longitude
		/* Transformation */
		gfi = Math.pow ( ((1. + this.e * Math.sin(lat)) / (1. - this.e * Math.sin(lat))) , (this.alfa * this.e / 2.));
		u= 2. * (Math.atan(this.k * Math.pow( Math.tan(lat / 2. + this.s45), this.alfa) / gfi)-this.s45);
		deltav = - delta_lon * this.alfa;
		s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
		d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
		eps = this.n * d;
		ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2. + this.s45) , this.n) / Math.pow(Math.tan(s / 2. + this.s45) , this.n);
		/* x and y are reverted! */
		//p.y = ro * Math.cos(eps) / a;
		//p.x = ro * Math.sin(eps) / a;
		p.y = ro * Math.cos(eps) / 1.0;
		p.x = ro * Math.sin(eps) / 1.0;

		if(this.czech) {
	    		p.y *= -1.0;
	    		p.x *= -1.0;
		}
		return (p);
	},

	/* calculate lat/lon from xy */
	inverse: function(p) {
		/* Constants, identisch wie in der Umkehrfunktion */
		var u, deltav, s, d, eps, ro, fi1;
		var ok;

		/* Transformation */
		/* revert y, x*/
		var tmp = p.x;
		p.x=p.y;
		p.y=tmp;
		if(this.czech) {
	    		p.y *= -1.0;
	    		p.x *= -1.0;
		}
		ro = Math.sqrt(p.x * p.x + p.y * p.y);
		eps = Math.atan2(p.y, p.x);
		d = eps / Math.sin(this.s0);
		s = 2. * (Math.atan(  Math.pow(this.ro0 / ro, 1. / this.n) * Math.tan(this.s0 / 2. + this.s45)) - this.s45);
		u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
		deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
		p.x = this.long0 - deltav / this.alfa;
		/* ITERATION FOR lat */
		fi1 = u;
		ok = 0;
		var iter = 0;
		do {
			p.y = 2. * ( Math.atan( Math.pow( this.k, -1. / this.alfa)  *
                            Math.pow( Math.tan(u / 2. + this.s45) , 1. / this.alfa)  *
                            Math.pow( (1. + this.e * Math.sin(fi1)) / (1. - this.e * Math.sin(fi1)) , this.e / 2.)
                           )  - this.s45);
      			if (Math.abs(fi1 - p.y) < 0.0000000001) ok=1;
			fi1 = p.y;
			iter += 1;
		} while (ok==0 && iter < 15);
		if (iter >= 15) {
			Proj4js.reportError("PHI3Z-CONV:Latitude failed to converge after 15 iterations");
			//console.log('iter:', iter);
			return null;
		}
   		
		return (p);
	}
};
/* ======================================================================
    projCode/somerc.js
   ====================================================================== */

/*******************************************************************************
NAME                       SWISS OBLIQUE MERCATOR

PURPOSE:	Swiss projection.
WARNING:  X and Y are inverted (weird) in the swiss coordinate system. Not
   here, since we want X to be horizontal and Y vertical.

ALGORITHM REFERENCES
1. "Formules et constantes pour le Calcul pour la
 projection cylindrique conforme Ă  axe oblique et pour la transformation entre
 des systĂ¨mes de rĂ©fĂ©rence".
 http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf

*******************************************************************************/

Proj4js.Proj.somerc = {

  init: function() {
    var phy0 = this.lat0;
    this.lambda0 = this.long0;
    var sinPhy0 = Math.sin(phy0);
    var semiMajorAxis = this.a;
    var invF = this.rf;
    var flattening = 1 / invF;
    var e2 = 2 * flattening - Math.pow(flattening, 2);
    var e = this.e = Math.sqrt(e2);
    this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2.0));
    this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4.0));
    this.b0 = Math.asin(sinPhy0 / this.alpha);
    this.K = Math.log(Math.tan(Math.PI / 4.0 + this.b0 / 2.0))
            - this.alpha
            * Math.log(Math.tan(Math.PI / 4.0 + phy0 / 2.0))
            + this.alpha
            * e / 2
            * Math.log((1 + e * sinPhy0)
            / (1 - e * sinPhy0));
  },


  forward: function(p) {
    var Sa1 = Math.log(Math.tan(Math.PI / 4.0 - p.y / 2.0));
    var Sa2 = this.e / 2.0
            * Math.log((1 + this.e * Math.sin(p.y))
            / (1 - this.e * Math.sin(p.y)));
    var S = -this.alpha * (Sa1 + Sa2) + this.K;

        // spheric latitude
    var b = 2.0 * (Math.atan(Math.exp(S)) - Math.PI / 4.0);

        // spheric longitude
    var I = this.alpha * (p.x - this.lambda0);

        // psoeudo equatorial rotation
    var rotI = Math.atan(Math.sin(I)
            / (Math.sin(this.b0) * Math.tan(b) +
               Math.cos(this.b0) * Math.cos(I)));

    var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) -
                         Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

    p.y = this.R / 2.0
            * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB)))
            + this.y0;
    p.x = this.R * rotI + this.x0;
    return p;
  },

  inverse: function(p) {
    var Y = p.x - this.x0;
    var X = p.y - this.y0;

    var rotI = Y / this.R;
    var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4.0);

    var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB)
            + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
    var I = Math.atan(Math.sin(rotI)
            / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0)
            * Math.tan(rotB)));

    var lambda = this.lambda0 + I / this.alpha;

    var S = 0.0;
    var phy = b;
    var prevPhy = -1000.0;
    var iteration = 0;
    while (Math.abs(phy - prevPhy) > 0.0000001)
    {
      if (++iteration > 20)
      {
        Proj4js.reportError("omercFwdInfinity");
        return;
      }
      //S = Math.log(Math.tan(Math.PI / 4.0 + phy / 2.0));
      S = 1.0
              / this.alpha
              * (Math.log(Math.tan(Math.PI / 4.0 + b / 2.0)) - this.K)
              + this.e
              * Math.log(Math.tan(Math.PI / 4.0
              + Math.asin(this.e * Math.sin(phy))
              / 2.0));
      prevPhy = phy;
      phy = 2.0 * Math.atan(Math.exp(S)) - Math.PI / 2.0;
    }

    p.x = lambda;
    p.y = phy;
    return p;
  }
};
/* ======================================================================
    projCode/stere.js
   ====================================================================== */


// Initialize the Stereographic projection

Proj4js.Proj.stere = {
  ssfn_: function(phit, sinphi, eccen) {
  	sinphi *= eccen;
  	return (Math.tan (.5 * (Proj4js.common.HALF_PI + phit)) * Math.pow((1. - sinphi) / (1. + sinphi), .5 * eccen));
  },
  TOL:	1.e-8,
  NITER:	8,
  CONV:	1.e-10,
  S_POLE:	0,
  N_POLE:	1,
  OBLIQ:	2,
  EQUIT:	3,

  init: function() {
  	this.phits = this.lat_ts ? this.lat_ts : Proj4js.common.HALF_PI;
    var t = Math.abs(this.lat0);
  	if ((Math.abs(t) - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN) {
  		this.mode = this.lat0 < 0. ? this.S_POLE : this.N_POLE;
  	} else {
  		this.mode = t > Proj4js.common.EPSLN ? this.OBLIQ : this.EQUIT;
    }
  	this.phits = Math.abs(this.phits);
  	if (this.es) {
  		var X;

  		switch (this.mode) {
  		case this.N_POLE:
  		case this.S_POLE:
  			if (Math.abs(this.phits - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN) {
  				this.akm1 = 2. * this.k0 / Math.sqrt(Math.pow(1+this.e,1+this.e)*Math.pow(1-this.e,1-this.e));
  			} else {
          t = Math.sin(this.phits);
  				this.akm1 = Math.cos(this.phits) / Proj4js.common.tsfnz(this.e, this.phits, t);
  				t *= this.e;
  				this.akm1 /= Math.sqrt(1. - t * t);
  			}
  			break;
  		case this.EQUIT:
  			this.akm1 = 2. * this.k0;
  			break;
  		case this.OBLIQ:
  			t = Math.sin(this.lat0);
  			X = 2. * Math.atan(this.ssfn_(this.lat0, t, this.e)) - Proj4js.common.HALF_PI;
  			t *= this.e;
  			this.akm1 = 2. * this.k0 * Math.cos(this.lat0) / Math.sqrt(1. - t * t);
  			this.sinX1 = Math.sin(X);
  			this.cosX1 = Math.cos(X);
  			break;
  		}
  	} else {
  		switch (this.mode) {
  		case this.OBLIQ:
  			this.sinph0 = Math.sin(this.lat0);
  			this.cosph0 = Math.cos(this.lat0);
  		case this.EQUIT:
  			this.akm1 = 2. * this.k0;
  			break;
  		case this.S_POLE:
  		case this.N_POLE:
  			this.akm1 = Math.abs(this.phits - Proj4js.common.HALF_PI) >= Proj4js.common.EPSLN ?
  			   Math.cos(this.phits) / Math.tan(Proj4js.common.FORTPI - .5 * this.phits) :
  			   2. * this.k0 ;
  			break;
  		}
  	}
  }, 

// Stereographic forward equations--mapping lat,long to x,y
  forward: function(p) {
    var lon = p.x;
    lon = Proj4js.common.adjust_lon(lon - this.long0);
    var lat = p.y;
    var x, y;
    
    if (this.sphere) {
    	var  sinphi, cosphi, coslam, sinlam;

    	sinphi = Math.sin(lat);
    	cosphi = Math.cos(lat);
    	coslam = Math.cos(lon);
    	sinlam = Math.sin(lon);
    	switch (this.mode) {
    	case this.EQUIT:
    		y = 1. + cosphi * coslam;
    		if (y <= Proj4js.common.EPSLN) {
            Proj4js.reportError("stere:forward:Equit");
        }
        y = this.akm1 / y;
    		x = y * cosphi * sinlam;
        y *= sinphi;
    		break;
    	case this.OBLIQ:
    		y = 1. + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
    		if (y <= Proj4js.common.EPSLN) {
            Proj4js.reportError("stere:forward:Obliq");
        }
        y = this.akm1 / y;
    		x = y * cosphi * sinlam;
    		y *= this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
    		break;
    	case this.N_POLE:
    		coslam = -coslam;
    		lat = -lat;
        //Note  no break here so it conitnues through S_POLE
    	case this.S_POLE:
    		if (Math.abs(lat - Proj4js.common.HALF_PI) < this.TOL) {
            Proj4js.reportError("stere:forward:S_POLE");
        }
        y = this.akm1 * Math.tan(Proj4js.common.FORTPI + .5 * lat);
    		x = sinlam * y;
    		y *= coslam;
    		break;
    	}
    } else {
    	coslam = Math.cos(lon);
    	sinlam = Math.sin(lon);
    	sinphi = Math.sin(lat);
    	var sinX, cosX;
    	if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
    	  var Xt = 2. * Math.atan(this.ssfn_(lat, sinphi, this.e));
        sinX = Math.sin(Xt - Proj4js.common.HALF_PI);
        cosX = Math.cos(Xt);
    	}
    	switch (this.mode) {
    	case this.OBLIQ:
    		var A = this.akm1 / (this.cosX1 * (1. + this.sinX1 * sinX + this.cosX1 * cosX * coslam));
    		y = A * (this.cosX1 * sinX - this.sinX1 * cosX * coslam);
    		x = A * cosX;
    		break;
    	case this.EQUIT:
    		var A = 2. * this.akm1 / (1. + cosX * coslam);
    		y = A * sinX;
    		x = A * cosX;
    		break;
    	case this.S_POLE:
    		lat = -lat;
    		coslam = - coslam;
    		sinphi = -sinphi;
    	case this.N_POLE:
    		x = this.akm1 * Proj4js.common.tsfnz(this.e, lat, sinphi);
    		y = - x * coslam;
    		break;
    	}
    	x = x * sinlam;
    }
    p.x = x*this.a + this.x0;
    p.y = y*this.a + this.y0;
    return p;
  },


//* Stereographic inverse equations--mapping x,y to lat/long
  inverse: function(p) {
    var x = (p.x - this.x0)/this.a;   /* descale and de-offset */
    var y = (p.y - this.y0)/this.a;
    var lon, lat;

    var cosphi, sinphi, tp=0.0, phi_l=0.0, rho, halfe=0.0, pi2=0.0;
    var i;

    if (this.sphere) {
    	var  c, rh, sinc, cosc;

      rh = Math.sqrt(x*x + y*y);
      c = 2. * Math.atan(rh / this.akm1);
    	sinc = Math.sin(c);
    	cosc = Math.cos(c);
    	lon = 0.;
    	switch (this.mode) {
    	case this.EQUIT:
    		if (Math.abs(rh) <= Proj4js.common.EPSLN) {
    			lat = 0.;
    		} else {
    			lat = Math.asin(y * sinc / rh);
        }
    		if (cosc != 0. || x != 0.) lon = Math.atan2(x * sinc, cosc * rh);
    		break;
    	case this.OBLIQ:
    		if (Math.abs(rh) <= Proj4js.common.EPSLN) {
    			lat = this.phi0;
    		} else {
    			lat = Math.asin(cosc * this.sinph0 + y * sinc * this.cosph0 / rh);
        }
        c = cosc - this.sinph0 * Math.sin(lat);
    		if (c != 0. || x != 0.) {
    			lon = Math.atan2(x * sinc * this.cosph0, c * rh);
        }
    		break;
    	case this.N_POLE:
    		y = -y;
    	case this.S_POLE:
    		if (Math.abs(rh) <= Proj4js.common.EPSLN) {
    			lat = this.phi0;
    		} else {
    			lat = Math.asin(this.mode == this.S_POLE ? -cosc : cosc);
        }
    		lon = (x == 0. && y == 0.) ? 0. : Math.atan2(x, y);
    		break;
    	}
        p.x = Proj4js.common.adjust_lon(lon + this.long0);
        p.y = lat;
    } else {
    	rho = Math.sqrt(x*x + y*y);
    	switch (this.mode) {
    	case this.OBLIQ:
    	case this.EQUIT:
        tp = 2. * Math.atan2(rho * this.cosX1 , this.akm1);
    		cosphi = Math.cos(tp);
    		sinphi = Math.sin(tp);
        if( rho == 0.0 ) {
    		  phi_l = Math.asin(cosphi * this.sinX1);
        } else {
    		  phi_l = Math.asin(cosphi * this.sinX1 + (y * sinphi * this.cosX1 / rho));
        }

    		tp = Math.tan(.5 * (Proj4js.common.HALF_PI + phi_l));
    		x *= sinphi;
    		y = rho * this.cosX1 * cosphi - y * this.sinX1* sinphi;
    		pi2 = Proj4js.common.HALF_PI;
    		halfe = .5 * this.e;
    		break;
    	case this.N_POLE:
    		y = -y;
    	case this.S_POLE:
        tp = - rho / this.akm1;
    		phi_l = Proj4js.common.HALF_PI - 2. * Math.atan(tp);
    		pi2 = -Proj4js.common.HALF_PI;
    		halfe = -.5 * this.e;
    		break;
    	}
    	for (i = this.NITER; i--; phi_l = lat) { //check this
    		sinphi = this.e * Math.sin(phi_l);
    		lat = 2. * Math.atan(tp * Math.pow((1.+sinphi)/(1.-sinphi), halfe)) - pi2;
    		if (Math.abs(phi_l - lat) < this.CONV) {
    			if (this.mode == this.S_POLE) lat = -lat;
    			lon = (x == 0. && y == 0.) ? 0. : Math.atan2(x, y);
          p.x = Proj4js.common.adjust_lon(lon + this.long0);
          p.y = lat;
    			return p;
    		}
    	}
    }
  }
}; 
/* ======================================================================
    projCode/nzmg.js
   ====================================================================== */

/*******************************************************************************
NAME                            NEW ZEALAND MAP GRID

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the New Zealand Map Grid projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.


ALGORITHM REFERENCES

1.  Department of Land and Survey Technical Circular 1973/32
      http://www.linz.govt.nz/docs/miscellaneous/nz-map-definition.pdf

2.  OSG Technical Report 4.1
      http://www.linz.govt.nz/docs/miscellaneous/nzmg.pdf


IMPLEMENTATION NOTES

The two references use different symbols for the calculated values. This
implementation uses the variable names similar to the symbols in reference [1].

The alogrithm uses different units for delta latitude and delta longitude.
The delta latitude is assumed to be in units of seconds of arc x 10^-5.
The delta longitude is the usual radians. Look out for these conversions.

The algorithm is described using complex arithmetic. There were three
options:
   * find and use a Javascript library for complex arithmetic
   * write my own complex library
   * expand the complex arithmetic by hand to simple arithmetic

This implementation has expanded the complex multiplication operations
into parallel simple arithmetic operations for the real and imaginary parts.
The imaginary part is way over to the right of the display; this probably
violates every coding standard in the world, but, to me, it makes it much
more obvious what is going on.

The following complex operations are used:
   - addition
   - multiplication
   - division
   - complex number raised to integer power
   - summation

A summary of complex arithmetic operations:
   (from http://en.wikipedia.org/wiki/Complex_arithmetic)
   addition:       (a + bi) + (c + di) = (a + c) + (b + d)i
   subtraction:    (a + bi) - (c + di) = (a - c) + (b - d)i
   multiplication: (a + bi) x (c + di) = (ac - bd) + (bc + ad)i
   division:       (a + bi) / (c + di) = [(ac + bd)/(cc + dd)] + [(bc - ad)/(cc + dd)]i

The algorithm needs to calculate summations of simple and complex numbers. This is
implemented using a for-loop, pre-loading the summed value to zero.

The algorithm needs to calculate theta^2, theta^3, etc while doing a summation.
There are three possible implementations:
   - use Math.pow in the summation loop - except for complex numbers
   - precalculate the values before running the loop
   - calculate theta^n = theta^(n-1) * theta during the loop
This implementation uses the third option for both real and complex arithmetic.

For example
   psi_n = 1;
   sum = 0;
   for (n = 1; n <=6; n++) {
      psi_n1 = psi_n * psi;       // calculate psi^(n+1)
      psi_n = psi_n1;
      sum = sum + A[n] * psi_n;
   }


TEST VECTORS

NZMG E, N:         2487100.638      6751049.719     metres
NZGD49 long, lat:      172.739194       -34.444066  degrees

NZMG E, N:         2486533.395      6077263.661     metres
NZGD49 long, lat:      172.723106       -40.512409  degrees

NZMG E, N:         2216746.425      5388508.765     metres
NZGD49 long, lat:      169.172062       -46.651295  degrees

Note that these test vectors convert from NZMG metres to lat/long referenced
to NZGD49, not the more usual WGS84. The difference is about 70m N/S and about
10m E/W.

These test vectors are provided in reference [1]. Many more test
vectors are available in
   http://www.linz.govt.nz/docs/topography/topographicdata/placenamesdatabase/nznamesmar08.zip
which is a catalog of names on the 260-series maps.


EPSG CODES

NZMG     EPSG:27200
NZGD49   EPSG:4272

http://spatialreference.org/ defines these as
  Proj4js.defs["EPSG:4272"] = "+proj=longlat +ellps=intl +datum=nzgd49 +no_defs ";
  Proj4js.defs["EPSG:27200"] = "+proj=nzmg +lat_0=-41 +lon_0=173 +x_0=2510000 +y_0=6023150 +ellps=intl +datum=nzgd49 +units=m +no_defs ";


LICENSE
  Copyright: Stephen Irons 2008
  Released under terms of the LGPL as per: http://www.gnu.org/copyleft/lesser.html

*******************************************************************************/


/**
  Initialize New Zealand Map Grip projection
*/

Proj4js.Proj.nzmg = {

  /**
   * iterations: Number of iterations to refine inverse transform.
   *     0 -> km accuracy
   *     1 -> m accuracy -- suitable for most mapping applications
   *     2 -> mm accuracy
   */
  iterations: 1,

  init : function() {
    this.A = new Array();
    this.A[1]  = +0.6399175073;
    this.A[2]  = -0.1358797613;
    this.A[3]  = +0.063294409;
    this.A[4]  = -0.02526853;
    this.A[5]  = +0.0117879;
    this.A[6]  = -0.0055161;
    this.A[7]  = +0.0026906;
    this.A[8]  = -0.001333;
    this.A[9]  = +0.00067;
    this.A[10] = -0.00034;

    this.B_re = new Array();        this.B_im = new Array();
    this.B_re[1] = +0.7557853228;   this.B_im[1] =  0.0;
    this.B_re[2] = +0.249204646;    this.B_im[2] = +0.003371507;
    this.B_re[3] = -0.001541739;    this.B_im[3] = +0.041058560;
    this.B_re[4] = -0.10162907;     this.B_im[4] = +0.01727609;
    this.B_re[5] = -0.26623489;     this.B_im[5] = -0.36249218;
    this.B_re[6] = -0.6870983;      this.B_im[6] = -1.1651967;

    this.C_re = new Array();        this.C_im = new Array();
    this.C_re[1] = +1.3231270439;   this.C_im[1] =  0.0;
    this.C_re[2] = -0.577245789;    this.C_im[2] = -0.007809598;
    this.C_re[3] = +0.508307513;    this.C_im[3] = -0.112208952;
    this.C_re[4] = -0.15094762;     this.C_im[4] = +0.18200602;
    this.C_re[5] = +1.01418179;     this.C_im[5] = +1.64497696;
    this.C_re[6] = +1.9660549;      this.C_im[6] = +2.5127645;

    this.D = new Array();
    this.D[1] = +1.5627014243;
    this.D[2] = +0.5185406398;
    this.D[3] = -0.03333098;
    this.D[4] = -0.1052906;
    this.D[5] = -0.0368594;
    this.D[6] = +0.007317;
    this.D[7] = +0.01220;
    this.D[8] = +0.00394;
    this.D[9] = -0.0013;
  },

  /**
    New Zealand Map Grid Forward  - long/lat to x/y
    long/lat in radians
  */
  forward : function(p) {
    var lon = p.x;
    var lat = p.y;

    var delta_lat = lat - this.lat0;
    var delta_lon = lon - this.long0;

    // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
    // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
    var d_phi = delta_lat / Proj4js.common.SEC_TO_RAD * 1E-5;       var d_lambda = delta_lon;
    var d_phi_n = 1;  // d_phi^0

    var d_psi = 0;
    for (var n = 1; n <= 10; n++) {
      d_phi_n = d_phi_n * d_phi;
      d_psi = d_psi + this.A[n] * d_phi_n;
    }

    // 2. Calculate theta
    var th_re = d_psi;                                              var th_im = d_lambda;

    // 3. Calculate z
    var th_n_re = 1;                                                var th_n_im = 0;  // theta^0
    var th_n_re1;                                                   var th_n_im1;

    var z_re = 0;                                                   var z_im = 0;
    for (var n = 1; n <= 6; n++) {
      th_n_re1 = th_n_re*th_re - th_n_im*th_im;                     th_n_im1 = th_n_im*th_re + th_n_re*th_im;
      th_n_re = th_n_re1;                                           th_n_im = th_n_im1;
      z_re = z_re + this.B_re[n]*th_n_re - this.B_im[n]*th_n_im;    z_im = z_im + this.B_im[n]*th_n_re + this.B_re[n]*th_n_im;
    }

    // 4. Calculate easting and northing
    p.x = (z_im * this.a) + this.x0; 
    p.y = (z_re * this.a) + this.y0;

    return p;
  },


  /**
    New Zealand Map Grid Inverse  -  x/y to long/lat
  */
  inverse : function(p) {

    var x = p.x;
    var y = p.y;

    var delta_x = x - this.x0;
    var delta_y = y - this.y0;

    // 1. Calculate z
    var z_re = delta_y / this.a;                                              var z_im = delta_x / this.a;

    // 2a. Calculate theta - first approximation gives km accuracy
    var z_n_re = 1;                                                           var z_n_im = 0;  // z^0
    var z_n_re1;                                                              var z_n_im1;

    var th_re = 0;                                                            var th_im = 0;
    for (var n = 1; n <= 6; n++) {
      z_n_re1 = z_n_re*z_re - z_n_im*z_im;                                    z_n_im1 = z_n_im*z_re + z_n_re*z_im;
      z_n_re = z_n_re1;                                                       z_n_im = z_n_im1;
      th_re = th_re + this.C_re[n]*z_n_re - this.C_im[n]*z_n_im;              th_im = th_im + this.C_im[n]*z_n_re + this.C_re[n]*z_n_im;
    }

    // 2b. Iterate to refine the accuracy of the calculation
    //        0 iterations gives km accuracy
    //        1 iteration gives m accuracy -- good enough for most mapping applications
    //        2 iterations bives mm accuracy
    for (var i = 0; i < this.iterations; i++) {
       var th_n_re = th_re;                                                      var th_n_im = th_im;
       var th_n_re1;                                                             var th_n_im1;

       var num_re = z_re;                                                        var num_im = z_im;
       for (var n = 2; n <= 6; n++) {
         th_n_re1 = th_n_re*th_re - th_n_im*th_im;                               th_n_im1 = th_n_im*th_re + th_n_re*th_im;
         th_n_re = th_n_re1;                                                     th_n_im = th_n_im1;
         num_re = num_re + (n-1)*(this.B_re[n]*th_n_re - this.B_im[n]*th_n_im);  num_im = num_im + (n-1)*(this.B_im[n]*th_n_re + this.B_re[n]*th_n_im);
       }

       th_n_re = 1;                                                              th_n_im = 0;
       var den_re = this.B_re[1];                                                var den_im = this.B_im[1];
       for (var n = 2; n <= 6; n++) {
         th_n_re1 = th_n_re*th_re - th_n_im*th_im;                               th_n_im1 = th_n_im*th_re + th_n_re*th_im;
         th_n_re = th_n_re1;                                                     th_n_im = th_n_im1;
         den_re = den_re + n * (this.B_re[n]*th_n_re - this.B_im[n]*th_n_im);    den_im = den_im + n * (this.B_im[n]*th_n_re + this.B_re[n]*th_n_im);
       }

       // Complex division
       var den2 = den_re*den_re + den_im*den_im;
       th_re = (num_re*den_re + num_im*den_im) / den2;                           th_im = (num_im*den_re - num_re*den_im) / den2;
    }

    // 3. Calculate d_phi              ...                                    // and d_lambda
    var d_psi = th_re;                                                        var d_lambda = th_im;
    var d_psi_n = 1;  // d_psi^0

    var d_phi = 0;
    for (var n = 1; n <= 9; n++) {
       d_psi_n = d_psi_n * d_psi;
       d_phi = d_phi + this.D[n] * d_psi_n;
    }

    // 4. Calculate latitude and longitude
    // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
    var lat = this.lat0 + (d_phi * Proj4js.common.SEC_TO_RAD * 1E5);
    var lon = this.long0 +  d_lambda;

    p.x = lon;
    p.y = lat;

    return p;
  }
};
/* ======================================================================
    projCode/mill.js
   ====================================================================== */

/*******************************************************************************
NAME                    MILLER CYLINDRICAL 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Miller Cylindrical projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE            
----------              ----           
T. Mittan		March, 1993

This function was adapted from the Lambert Azimuthal Equal Area projection
code (FORTRAN) in the General Cartographic Transformation Package software
which is available from the U.S. Geological Survey National Mapping Division.
 
ALGORITHM REFERENCES

1.  "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.

2.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

3.  "Software Documentation for GCTP General Cartographic Transformation
    Package", U.S. Geological Survey National Mapping Division, May 1982.
*******************************************************************************/

Proj4js.Proj.mill = {

/* Initialize the Miller Cylindrical projection
  -------------------------------------------*/
  init: function() {
    //no-op
  },


  /* Miller Cylindrical forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
  forward: function(p) {
    var lon=p.x;
    var lat=p.y;
    /* Forward equations
      -----------------*/
    var dlon = Proj4js.common.adjust_lon(lon -this.long0);
    var x = this.x0 + this.a * dlon;
    var y = this.y0 + this.a * Math.log(Math.tan((Proj4js.common.PI / 4.0) + (lat / 2.5))) * 1.25;

    p.x=x;
    p.y=y;
    return p;
  },//millFwd()

  /* Miller Cylindrical inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
  inverse: function(p) {
    p.x -= this.x0;
    p.y -= this.y0;

    var lon = Proj4js.common.adjust_lon(this.long0 + p.x /this.a);
    var lat = 2.5 * (Math.atan(Math.exp(0.8*p.y/this.a)) - Proj4js.common.PI / 4.0);

    p.x=lon;
    p.y=lat;
    return p;
  }//millInv()
};
/* ======================================================================
    projCode/gnom.js
   ====================================================================== */

/*****************************************************************************
NAME                             GNOMONIC

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Gnomonic Projection.
                Implementation based on the existing sterea and ortho
                implementations.

PROGRAMMER              DATE
----------              ----
Richard Marsden         November 2009

ALGORITHM REFERENCES

1.  Snyder, John P., "Flattening the Earth - Two Thousand Years of Map 
    Projections", University of Chicago Press 1993

2.  Wolfram Mathworld "Gnomonic Projection"
    http://mathworld.wolfram.com/GnomonicProjection.html
    Accessed: 12th November 2009
******************************************************************************/

Proj4js.Proj.gnom = {

  /* Initialize the Gnomonic projection
    -------------------------------------*/
  init: function(def) {

    /* Place parameters in static storage for common use
      -------------------------------------------------*/
    this.sin_p14=Math.sin(this.lat0);
    this.cos_p14=Math.cos(this.lat0);
    // Approximation for projecting points to the horizon (infinity)
    this.infinity_dist = 1000 * this.a;
    this.rc = 1;
  },


  /* Gnomonic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
  forward: function(p) {
    var sinphi, cosphi;	/* sin and cos value				*/
    var dlon;		/* delta longitude value			*/
    var coslon;		/* cos of longitude				*/
    var ksp;		/* scale factor					*/
    var g;		
    var x, y;
    var lon=p.x;
    var lat=p.y;	
    /* Forward equations
      -----------------*/
    dlon = Proj4js.common.adjust_lon(lon - this.long0);

    sinphi=Math.sin(lat);
    cosphi=Math.cos(lat);	

    coslon = Math.cos(dlon);
    g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
    ksp = 1.0;
    if ((g > 0) || (Math.abs(g) <= Proj4js.common.EPSLN)) {
      x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
      y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
    } else {
      Proj4js.reportError("orthoFwdPointError");

      // Point is in the opposing hemisphere and is unprojectable
      // We still need to return a reasonable point, so we project 
      // to infinity, on a bearing 
      // equivalent to the northern hemisphere equivalent
      // This is a reasonable approximation for short shapes and lines that 
      // straddle the horizon.

      x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
      y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

    }
    p.x=x;
    p.y=y;
    return p;
  },


  inverse: function(p) {
    var rh;		/* Rho */
    var z;		/* angle */
    var sinc, cosc;
    var c;
    var lon , lat;

    /* Inverse equations
      -----------------*/
    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;

    p.x /= this.k0;
    p.y /= this.k0;

    if ( (rh = Math.sqrt(p.x * p.x + p.y * p.y)) ) {
      c = Math.atan2(rh, this.rc);
      sinc = Math.sin(c);
      cosc = Math.cos(c);

      lat = Proj4js.common.asinz(cosc*this.sin_p14 + (p.y*sinc*this.cos_p14) / rh);
      lon = Math.atan2(p.x*sinc, rh*this.cos_p14*cosc - p.y*this.sin_p14*sinc);
      lon = Proj4js.common.adjust_lon(this.long0+lon);
    } else {
      lat = this.phic0;
      lon = 0.0;
    }
 
    p.x=lon;
    p.y=lat;
    return p;
  }
};


/* ======================================================================
    projCode/sinu.js
   ====================================================================== */

/*******************************************************************************
NAME                  		SINUSOIDAL

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Sinusoidal projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE            
----------              ----           
D. Steinwand, EROS      May, 1991     

This function was adapted from the Sinusoidal projection code (FORTRAN) in the 
General Cartographic Transformation Package software which is available from 
the U.S. Geological Survey National Mapping Division.
 
ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  "Software Documentation for GCTP General Cartographic Transformation
    Package", U.S. Geological Survey National Mapping Division, May 1982.
*******************************************************************************/

Proj4js.Proj.sinu = {

	/* Initialize the Sinusoidal projection
	  ------------------------------------*/
	init: function() {
		/* Place parameters in static storage for common use
		  -------------------------------------------------*/
		  

		if (!this.sphere) {
		  this.en = Proj4js.common.pj_enfn(this.es);
    } else {
      this.n = 1.;
      this.m = 0.;
      this.es = 0;
      this.C_y = Math.sqrt((this.m + 1.) / this.n);
      this.C_x = this.C_y/(this.m + 1.);
    }
		  
	},

	/* Sinusoidal forward equations--mapping lat,long to x,y
	-----------------------------------------------------*/
	forward: function(p) {
		var x,y,delta_lon;	
		var lon=p.x;
		var lat=p.y;	
		/* Forward equations
		-----------------*/
		lon = Proj4js.common.adjust_lon(lon - this.long0);
		
		if (this.sphere) {
      if (!this.m) {
        lat = this.n != 1. ? Math.asin(this.n * Math.sin(lat)): lat;
      } else {
        var k = this.n * Math.sin(lat);
        for (var i = Proj4js.common.MAX_ITER; i ; --i) {
          var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
          lat -= V;
          if (Math.abs(V) < Proj4js.common.EPSLN) break;
        }
      }
      x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
      y = this.a * this.C_y * lat;

		} else {
		  
		  var s = Math.sin(lat);
		  var c = Math.cos(lat);
      y = this.a * Proj4js.common.pj_mlfn(lat, s, c, this.en);
      x = this.a * lon * c / Math.sqrt(1. - this.es * s * s);
		}

		p.x=x;
		p.y=y;	
		return p;
	},

	inverse: function(p) {
		var lat,temp,lon;	
		
		/* Inverse equations
		  -----------------*/
		p.x -= this.x0;
		p.y -= this.y0;
		lat = p.y / this.a;
		
		if (this.sphere) {
		  
      p.y /= this.C_y;
      lat = this.m ? Math.asin((this.m * p.y + Math.sin(p.y)) / this.n) :
        ( this.n != 1. ? Math.asin(Math.sin(p.y) / this.n) : p.y );
      lon = p.x / (this.C_x * (this.m + Math.cos(p.y)));
		  
		} else {
		  lat = Proj4js.common.pj_inv_mlfn(p.y/this.a, this.es, this.en)
		  var s = Math.abs(lat);
      if (s < Proj4js.common.HALF_PI) {
        s = Math.sin(lat);
        temp = this.long0 + p.x * Math.sqrt(1. - this.es * s * s) /(this.a * Math.cos(lat));
        //temp = this.long0 + p.x / (this.a * Math.cos(lat));
        lon = Proj4js.common.adjust_lon(temp);
      } else if ((s - Proj4js.common.EPSLN) < Proj4js.common.HALF_PI) {
        lon = this.long0;
      }
		  
		}
		  
		p.x=lon;
		p.y=lat;
		return p;
	}
};


/* ======================================================================
    projCode/vandg.js
   ====================================================================== */

/*******************************************************************************
NAME                    VAN DER GRINTEN 

PURPOSE:	Transforms input Easting and Northing to longitude and
		latitude for the Van der Grinten projection.  The
		Easting and Northing must be in meters.  The longitude
		and latitude values will be returned in radians.

PROGRAMMER              DATE            
----------              ----           
T. Mittan		March, 1993

This function was adapted from the Van Der Grinten projection code
(FORTRAN) in the General Cartographic Transformation Package software
which is available from the U.S. Geological Survey National Mapping Division.
 
ALGORITHM REFERENCES

1.  "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.

2.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

3.  "Software Documentation for GCTP General Cartographic Transformation
    Package", U.S. Geological Survey National Mapping Division, May 1982.
*******************************************************************************/

Proj4js.Proj.vandg = {

/* Initialize the Van Der Grinten projection
  ----------------------------------------*/
	init: function() {
		this.R = 6370997.0; //Radius of earth
	},

	forward: function(p) {

		var lon=p.x;
		var lat=p.y;	

		/* Forward equations
		-----------------*/
		var dlon = Proj4js.common.adjust_lon(lon - this.long0);
		var x,y;

		if (Math.abs(lat) <= Proj4js.common.EPSLN) {
			x = this.x0  + this.R * dlon;
			y = this.y0;
		}
		var theta = Proj4js.common.asinz(2.0 * Math.abs(lat / Proj4js.common.PI));
		if ((Math.abs(dlon) <= Proj4js.common.EPSLN) || (Math.abs(Math.abs(lat) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN)) {
			x = this.x0;
			if (lat >= 0) {
				y = this.y0 + Proj4js.common.PI * this.R * Math.tan(.5 * theta);
			} else {
				y = this.y0 + Proj4js.common.PI * this.R * - Math.tan(.5 * theta);
			}
			//  return(OK);
		}
		var al = .5 * Math.abs((Proj4js.common.PI / dlon) - (dlon / Proj4js.common.PI));
		var asq = al * al;
		var sinth = Math.sin(theta);
		var costh = Math.cos(theta);

		var g = costh / (sinth + costh - 1.0);
		var gsq = g * g;
		var m = g * (2.0 / sinth - 1.0);
		var msq = m * m;
		var con = Proj4js.common.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
		if (dlon < 0) {
		 con = -con;
		}
		x = this.x0 + con;
		con = Math.abs(con / (Proj4js.common.PI * this.R));
		if (lat >= 0) {
		 y = this.y0 + Proj4js.common.PI * this.R * Math.sqrt(1.0 - con * con - 2.0 * al * con);
		} else {
		 y = this.y0 - Proj4js.common.PI * this.R * Math.sqrt(1.0 - con * con - 2.0 * al * con);
		}
		p.x = x;
		p.y = y;
		return p;
	},

/* Van Der Grinten inverse equations--mapping x,y to lat/long
  ---------------------------------------------------------*/
	inverse: function(p) {
		var lon, lat;
		var xx,yy,xys,c1,c2,c3;
		var al,asq;
		var a1;
		var m1;
		var con;
		var th1;
		var d;

		/* inverse equations
		-----------------*/
		p.x -= this.x0;
		p.y -= this.y0;
		con = Proj4js.common.PI * this.R;
		xx = p.x / con;
		yy =p.y / con;
		xys = xx * xx + yy * yy;
		c1 = -Math.abs(yy) * (1.0 + xys);
		c2 = c1 - 2.0 * yy * yy + xx * xx;
		c3 = -2.0 * c1 + 1.0 + 2.0 * yy * yy + xys * xys;
		d = yy * yy / c3 + (2.0 * c2 * c2 * c2 / c3 / c3 / c3 - 9.0 * c1 * c2 / c3 /c3) / 27.0;
		a1 = (c1 - c2 * c2 / 3.0 / c3) / c3;
		m1 = 2.0 * Math.sqrt( -a1 / 3.0);
		con = ((3.0 * d) / a1) / m1;
		if (Math.abs(con) > 1.0) {
			if (con >= 0.0) {
				con = 1.0;
			} else {
				con = -1.0;
			}
		}
		th1 = Math.acos(con) / 3.0;
		if (p.y >= 0) {
			lat = (-m1 *Math.cos(th1 + Proj4js.common.PI / 3.0) - c2 / 3.0 / c3) * Proj4js.common.PI;
		} else {
			lat = -(-m1 * Math.cos(th1 + Proj4js.common.PI / 3.0) - c2 / 3.0 / c3) * Proj4js.common.PI;
		}

		if (Math.abs(xx) < Proj4js.common.EPSLN) {
			lon = this.long0;
		}
		lon = Proj4js.common.adjust_lon(this.long0 + Proj4js.common.PI * (xys - 1.0 + Math.sqrt(1.0 + 2.0 * (xx * xx - yy * yy) + xys * xys)) / 2.0 / xx);

		p.x=lon;
		p.y=lat;
		return p;
	}
};
/* ======================================================================
    projCode/cea.js
   ====================================================================== */

/*******************************************************************************
NAME                    LAMBERT CYLINDRICAL EQUAL AREA

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Lambert Cylindrical Equal Area projection.
                This class of projection includes the Behrmann and 
                Gall-Peters Projections.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE            
----------              ----
R. Marsden              August 2009
Winwaed Software Tech LLC, http://www.winwaed.com

This function was adapted from the Miller Cylindrical Projection in the Proj4JS
library.

Note: This implementation assumes a Spherical Earth. The (commented) code 
has been included for the ellipsoidal forward transform, but derivation of 
the ellispoidal inverse transform is beyond me. Note that most of the 
Proj4JS implementations do NOT currently support ellipsoidal figures. 
Therefore this is not seen as a problem - especially this lack of support 
is explicitly stated here.
 
ALGORITHM REFERENCES

1.  "Cartographic Projection Procedures for the UNIX Environment - 
     A User's Manual" by Gerald I. Evenden, USGS Open File Report 90-284
    and Release 4 Interim Reports (2003)

2.  Snyder, John P., "Flattening the Earth - Two Thousand Years of Map 
    Projections", Univ. Chicago Press, 1993
*******************************************************************************/

Proj4js.Proj.cea = {

/* Initialize the Cylindrical Equal Area projection
  -------------------------------------------*/
  init: function() {
    //no-op
  },


  /* Cylindrical Equal Area forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
  forward: function(p) {
    var lon=p.x;
    var lat=p.y;
    /* Forward equations
      -----------------*/
    var dlon = Proj4js.common.adjust_lon(lon -this.long0);
    var x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
    var y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
   /* Elliptical Forward Transform
      Not implemented due to a lack of a matchign inverse function
    {
      var Sin_Lat = Math.sin(lat);
      var Rn = this.a * (Math.sqrt(1.0e0 - this.es * Sin_Lat * Sin_Lat ));
      x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
      y = this.y0 + Rn * Math.sin(lat) / Math.cos(this.lat_ts);
    }
   */


    p.x=x;
    p.y=y;
    return p;
  },//ceaFwd()

  /* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
  inverse: function(p) {
    p.x -= this.x0;
    p.y -= this.y0;

    var lon = Proj4js.common.adjust_lon( this.long0 + (p.x / this.a) / Math.cos(this.lat_ts) );

    var lat = Math.asin( (p.y/this.a) * Math.cos(this.lat_ts) );

    p.x=lon;
    p.y=lat;
    return p;
  }//ceaInv()
};
/* ======================================================================
    projCode/eqc.js
   ====================================================================== */

/* similar to equi.js FIXME proj4 uses eqc */
Proj4js.Proj.eqc = {
  init : function() {

      if(!this.x0) this.x0=0;
      if(!this.y0) this.y0=0;
      if(!this.lat0) this.lat0=0;
      if(!this.long0) this.long0=0;
      if(!this.lat_ts) this.lat_ts=0;
      if (!this.title) this.title = "Equidistant Cylindrical (Plate Carre)";

      this.rc= Math.cos(this.lat_ts);
    },


    // forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    forward : function(p) {

      var lon= p.x;
      var lat= p.y;

      var dlon = Proj4js.common.adjust_lon(lon - this.long0);
      var dlat = Proj4js.common.adjust_lat(lat - this.lat0 );
      p.x= this.x0 + (this.a*dlon*this.rc);
      p.y= this.y0 + (this.a*dlat        );
      return p;
    },

  // inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------
  inverse : function(p) {

    var x= p.x;
    var y= p.y;

    p.x= Proj4js.common.adjust_lon(this.long0 + ((x - this.x0)/(this.a*this.rc)));
    p.y= Proj4js.common.adjust_lat(this.lat0  + ((y - this.y0)/(this.a        )));
    return p;
  }

};
/* ======================================================================
    projCode/cass.js
   ====================================================================== */

/*******************************************************************************
NAME                            CASSINI

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Cassini projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.
    Ported from PROJ.4.


ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
*******************************************************************************/


//Proj4js.defs["EPSG:28191"] = "+proj=cass +lat_0=31.73409694444445 +lon_0=35.21208055555556 +x_0=170251.555 +y_0=126867.909 +a=6378300.789 +b=6356566.435 +towgs84=-275.722,94.7824,340.894,-8.001,-4.42,-11.821,1 +units=m +no_defs";

// Initialize the Cassini projection
// -----------------------------------------------------------------

Proj4js.Proj.cass = {
  init : function() {
    if (!this.sphere) {
      this.en = Proj4js.common.pj_enfn(this.es)
      this.m0 = Proj4js.common.pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
    }
  },

  C1:	.16666666666666666666,
  C2:	.00833333333333333333,
  C3:	.04166666666666666666,
  C4:	.33333333333333333333,
  C5:	.06666666666666666666,


/* Cassini forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
  forward: function(p) {

    /* Forward equations
      -----------------*/
    var x,y;
    var lam=p.x;
    var phi=p.y;
    lam = Proj4js.common.adjust_lon(lam - this.long0);
    
    if (this.sphere) {
      x = Math.asin(Math.cos(phi) * Math.sin(lam));
      y = Math.atan2(Math.tan(phi) , Math.cos(lam)) - this.phi0;
    } else {
        //ellipsoid
      this.n = Math.sin(phi);
      this.c = Math.cos(phi);
      y = Proj4js.common.pj_mlfn(phi, this.n, this.c, this.en);
      this.n = 1./Math.sqrt(1. - this.es * this.n * this.n);
      this.tn = Math.tan(phi); 
      this.t = this.tn * this.tn;
      this.a1 = lam * this.c;
      this.c *= this.es * this.c / (1 - this.es);
      this.a2 = this.a1 * this.a1;
      x = this.n * this.a1 * (1. - this.a2 * this.t * (this.C1 - (8. - this.t + 8. * this.c) * this.a2 * this.C2));
      y -= this.m0 - this.n * this.tn * this.a2 * (.5 + (5. - this.t + 6. * this.c) * this.a2 * this.C3);
    }
    
    p.x = this.a*x + this.x0;
    p.y = this.a*y + this.y0;
    return p;
  },//cassFwd()

/* Inverse equations
  -----------------*/
  inverse: function(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var x = p.x/this.a;
    var y = p.y/this.a;
    var phi, lam;

    if (this.sphere) {
      this.dd = y + this.lat0;
      phi = Math.asin(Math.sin(this.dd) * Math.cos(x));
      lam = Math.atan2(Math.tan(x), Math.cos(this.dd));
    } else {
      /* ellipsoid */
      var ph1 = Proj4js.common.pj_inv_mlfn(this.m0 + y, this.es, this.en);
      this.tn = Math.tan(ph1); 
      this.t = this.tn * this.tn;
      this.n = Math.sin(ph1);
      this.r = 1. / (1. - this.es * this.n * this.n);
      this.n = Math.sqrt(this.r);
      this.r *= (1. - this.es) * this.n;
      this.dd = x / this.n;
      this.d2 = this.dd * this.dd;
      phi = ph1 - (this.n * this.tn / this.r) * this.d2 * (.5 - (1. + 3. * this.t) * this.d2 * this.C3);
      lam = this.dd * (1. + this.t * this.d2 * (-this.C4 + (1. + 3. * this.t) * this.d2 * this.C5)) / Math.cos(ph1);
    }
    p.x = Proj4js.common.adjust_lon(this.long0+lam);
    p.y = phi;
    return p;
  }//cassInv()

}
/* ======================================================================
    projCode/gauss.js
   ====================================================================== */


Proj4js.Proj.gauss = {

  init : function() {
    var sphi = Math.sin(this.lat0);
    var cphi = Math.cos(this.lat0);  
    cphi *= cphi;
    this.rc = Math.sqrt(1.0 - this.es) / (1.0 - this.es * sphi * sphi);
    this.C = Math.sqrt(1.0 + this.es * cphi * cphi / (1.0 - this.es));
    this.phic0 = Math.asin(sphi / this.C);
    this.ratexp = 0.5 * this.C * this.e;
    this.K = Math.tan(0.5 * this.phic0 + Proj4js.common.FORTPI) / (Math.pow(Math.tan(0.5*this.lat0 + Proj4js.common.FORTPI), this.C) * Proj4js.common.srat(this.e*sphi, this.ratexp));
  },

  forward : function(p) {
    var lon = p.x;
    var lat = p.y;

    p.y = 2.0 * Math.atan( this.K * Math.pow(Math.tan(0.5 * lat + Proj4js.common.FORTPI), this.C) * Proj4js.common.srat(this.e * Math.sin(lat), this.ratexp) ) - Proj4js.common.HALF_PI;
    p.x = this.C * lon;
    return p;
  },

  inverse : function(p) {
    var DEL_TOL = 1e-14;
    var lon = p.x / this.C;
    var lat = p.y;
    var num = Math.pow(Math.tan(0.5 * lat + Proj4js.common.FORTPI)/this.K, 1./this.C);
    for (var i = Proj4js.common.MAX_ITER; i>0; --i) {
      lat = 2.0 * Math.atan(num * Proj4js.common.srat(this.e * Math.sin(p.y), -0.5 * this.e)) - Proj4js.common.HALF_PI;
      if (Math.abs(lat - p.y) < DEL_TOL) break;
      p.y = lat;
    }	
    /* convergence failed */
    if (!i) {
      Proj4js.reportError("gauss:inverse:convergence failed");
      return null;
    }
    p.x = lon;
    p.y = lat;
    return p;
  }
};

/* ======================================================================
    projCode/omerc.js
   ====================================================================== */

/*******************************************************************************
NAME                       OBLIQUE MERCATOR (HOTINE) 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Oblique Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/

Proj4js.Proj.omerc = {

  /* Initialize the Oblique Mercator  projection
    ------------------------------------------*/
  init: function() {
    if (!this.mode) this.mode=0;
    if (!this.lon1)   {this.lon1=0;this.mode=1;}
    if (!this.lon2)   this.lon2=0;
    if (!this.lat2)    this.lat2=0;

    /* Place parameters in static storage for common use
      -------------------------------------------------*/
    var temp = this.b/ this.a;
    var es = 1.0 - Math.pow(temp,2);
    var e = Math.sqrt(es);

    this.sin_p20=Math.sin(this.lat0);
    this.cos_p20=Math.cos(this.lat0);

    this.con = 1.0 - this.es * this.sin_p20 * this.sin_p20;
    this.com = Math.sqrt(1.0 - es);
    this.bl = Math.sqrt(1.0 + this.es * Math.pow(this.cos_p20,4.0)/(1.0 - es));
    this.al = this.a * this.bl * this.k0 * this.com / this.con;
    if (Math.abs(this.lat0) < Proj4js.common.EPSLN) {
       this.ts = 1.0;
       this.d = 1.0;
       this.el = 1.0;
    } else {
       this.ts = Proj4js.common.tsfnz(this.e,this.lat0,this.sin_p20);
       this.con = Math.sqrt(this.con);
       this.d = this.bl * this.com / (this.cos_p20 * this.con);
       if ((this.d * this.d - 1.0) > 0.0) {
          if (this.lat0 >= 0.0) {
             this.f = this.d + Math.sqrt(this.d * this.d - 1.0);
          } else {
             this.f = this.d - Math.sqrt(this.d * this.d - 1.0);
          }
       } else {
         this.f = this.d;
       }
       this.el = this.f * Math.pow(this.ts,this.bl);
    }

    //this.longc=52.60353916666667;

    if (this.mode != 0) {
       this.g = .5 * (this.f - 1.0/this.f);
       this.gama = Proj4js.common.asinz(Math.sin(this.alpha) / this.d);
       this.longc= this.longc - Proj4js.common.asinz(this.g * Math.tan(this.gama))/this.bl;

       /* Report parameters common to format B
       -------------------------------------*/
       //genrpt(azimuth * R2D,"Azimuth of Central Line:    ");
       //cenlon(lon_origin);
      // cenlat(lat_origin);

       this.con = Math.abs(this.lat0);
       if ((this.con > Proj4js.common.EPSLN) && (Math.abs(this.con - Proj4js.common.HALF_PI) > Proj4js.common.EPSLN)) {
            this.singam=Math.sin(this.gama);
            this.cosgam=Math.cos(this.gama);

            this.sinaz=Math.sin(this.alpha);
            this.cosaz=Math.cos(this.alpha);

            if (this.lat0>= 0) {
               this.u =  (this.al / this.bl) * Math.atan(Math.sqrt(this.d*this.d - 1.0)/this.cosaz);
            } else {
               this.u =  -(this.al / this.bl) *Math.atan(Math.sqrt(this.d*this.d - 1.0)/this.cosaz);
            }
          } else {
            Proj4js.reportError("omerc:Init:DataError");
          }
       } else {
       this.sinphi =Math. sin(this.at1);
       this.ts1 = Proj4js.common.tsfnz(this.e,this.lat1,this.sinphi);
       this.sinphi = Math.sin(this.lat2);
       this.ts2 = Proj4js.common.tsfnz(this.e,this.lat2,this.sinphi);
       this.h = Math.pow(this.ts1,this.bl);
       this.l = Math.pow(this.ts2,this.bl);
       this.f = this.el/this.h;
       this.g = .5 * (this.f - 1.0/this.f);
       this.j = (this.el * this.el - this.l * this.h)/(this.el * this.el + this.l * this.h);
       this.p = (this.l - this.h) / (this.l + this.h);
       this.dlon = this.lon1 - this.lon2;
       if (this.dlon < -Proj4js.common.PI) this.lon2 = this.lon2 - 2.0 * Proj4js.common.PI;
       if (this.dlon > Proj4js.common.PI) this.lon2 = this.lon2 + 2.0 * Proj4js.common.PI;
       this.dlon = this.lon1 - this.lon2;
       this.longc = .5 * (this.lon1 + this.lon2) -Math.atan(this.j * Math.tan(.5 * this.bl * this.dlon)/this.p)/this.bl;
       this.dlon  = Proj4js.common.adjust_lon(this.lon1 - this.longc);
       this.gama = Math.atan(Math.sin(this.bl * this.dlon)/this.g);
       this.alpha = Proj4js.common.asinz(this.d * Math.sin(this.gama));

       /* Report parameters common to format A
       -------------------------------------*/

       if (Math.abs(this.lat1 - this.lat2) <= Proj4js.common.EPSLN) {
          Proj4js.reportError("omercInitDataError");
          //return(202);
       } else {
          this.con = Math.abs(this.lat1);
       }
       if ((this.con <= Proj4js.common.EPSLN) || (Math.abs(this.con - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN)) {
           Proj4js.reportError("omercInitDataError");
                //return(202);
       } else {
         if (Math.abs(Math.abs(this.lat0) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN) {
            Proj4js.reportError("omercInitDataError");
            //return(202);
         }
       }

       this.singam=Math.sin(this.gam);
       this.cosgam=Math.cos(this.gam);

       this.sinaz=Math.sin(this.alpha);
       this.cosaz=Math.cos(this.alpha);  


       if (this.lat0 >= 0) {
          this.u =  (this.al/this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1.0)/this.cosaz);
       } else {
          this.u = -(this.al/this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1.0)/this.cosaz);
       }
     }
  },


  /* Oblique Mercator forward equations--mapping lat,long to x,y
    ----------------------------------------------------------*/
  forward: function(p) {
    var theta;		/* angle					*/
    var sin_phi, cos_phi;/* sin and cos value				*/
    var b;		/* temporary values				*/
    var c, t, tq;	/* temporary values				*/
    var con, n, ml;	/* cone constant, small m			*/
    var q,us,vl;
    var ul,vs;
    var s;
    var dlon;
    var ts1;

    var lon=p.x;
    var lat=p.y;
    /* Forward equations
      -----------------*/
    sin_phi = Math.sin(lat);
    dlon = Proj4js.common.adjust_lon(lon - this.longc);
    vl = Math.sin(this.bl * dlon);
    if (Math.abs(Math.abs(lat) - Proj4js.common.HALF_PI) > Proj4js.common.EPSLN) {
       ts1 = Proj4js.common.tsfnz(this.e,lat,sin_phi);
       q = this.el / (Math.pow(ts1,this.bl));
       s = .5 * (q - 1.0 / q);
       t = .5 * (q + 1.0/ q);
       ul = (s * this.singam - vl * this.cosgam) / t;
       con = Math.cos(this.bl * dlon);
       if (Math.abs(con) < .0000001) {
          us = this.al * this.bl * dlon;
       } else {
          us = this.al * Math.atan((s * this.cosgam + vl * this.singam) / con)/this.bl;
          if (con < 0) us = us + Proj4js.common.PI * this.al / this.bl;
       }
    } else {
       if (lat >= 0) {
          ul = this.singam;
       } else {
          ul = -this.singam;
       }
       us = this.al * lat / this.bl;
    }
    if (Math.abs(Math.abs(ul) - 1.0) <= Proj4js.common.EPSLN) {
       //alert("Point projects into infinity","omer-for");
       Proj4js.reportError("omercFwdInfinity");
       //return(205);
    }
    vs = .5 * this.al * Math.log((1.0 - ul)/(1.0 + ul)) / this.bl;
    us = us - this.u;
    var x = this.x0 + vs * this.cosaz + us * this.sinaz;
    var y = this.y0 + us * this.cosaz - vs * this.sinaz;

    p.x=x;
    p.y=y;
    return p;
  },

  inverse: function(p) {
    var delta_lon;	/* Delta longitude (Given longitude - center 	*/
    var theta;		/* angle					*/
    var delta_theta;	/* adjusted longitude				*/
    var sin_phi, cos_phi;/* sin and cos value				*/
    var b;		/* temporary values				*/
    var c, t, tq;	/* temporary values				*/
    var con, n, ml;	/* cone constant, small m			*/
    var vs,us,q,s,ts1;
    var vl,ul,bs;
    var lon, lat;
    var flag;

    /* Inverse equations
      -----------------*/
    p.x -= this.x0;
    p.y -= this.y0;
    flag = 0;
    vs = p.x * this.cosaz - p.y * this.sinaz;
    us = p.y * this.cosaz + p.x * this.sinaz;
    us = us + this.u;
    q = Math.exp(-this.bl * vs / this.al);
    s = .5 * (q - 1.0/q);
    t = .5 * (q + 1.0/q);
    vl = Math.sin(this.bl * us / this.al);
    ul = (vl * this.cosgam + s * this.singam)/t;
    if (Math.abs(Math.abs(ul) - 1.0) <= Proj4js.common.EPSLN)
       {
       lon = this.longc;
       if (ul >= 0.0) {
          lat = Proj4js.common.HALF_PI;
       } else {
         lat = -Proj4js.common.HALF_PI;
       }
    } else {
       con = 1.0 / this.bl;
       ts1 =Math.pow((this.el / Math.sqrt((1.0 + ul) / (1.0 - ul))),con);
       lat = Proj4js.common.phi2z(this.e,ts1);
       //if (flag != 0)
          //return(flag);
       //~ con = Math.cos(this.bl * us /al);
       theta = this.longc - Math.atan2((s * this.cosgam - vl * this.singam) , con)/this.bl;
       lon = Proj4js.common.adjust_lon(theta);
    }
    p.x=lon;
    p.y=lat;
    return p;
  }
};
/* ======================================================================
    projCode/lcc.js
   ====================================================================== */

/*******************************************************************************
NAME                            LAMBERT CONFORMAL CONIC

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Lambert Conformal Conic projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.


ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
*******************************************************************************/


//<2104> +proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x0=-17044 +x0=-23139.97 +ellps=intl +units=m +no_defs  no_defs

// Initialize the Lambert Conformal conic projection
// -----------------------------------------------------------------

//Proj4js.Proj.lcc = Class.create();
Proj4js.Proj.lcc = {
  init : function() {

    // array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
    //double c_lat;                   /* center latitude                      */
    //double c_lon;                   /* center longitude                     */
    //double lat1;                    /* first standard parallel              */
    //double lat2;                    /* second standard parallel             */
    //double r_maj;                   /* major axis                           */
    //double r_min;                   /* minor axis                           */
    //double false_east;              /* x offset in meters                   */
    //double false_north;             /* y offset in meters                   */

      if (!this.lat2){this.lat2=this.lat0;}//if lat2 is not defined
      if (!this.k0) this.k0 = 1.0;

    // Standard Parallels cannot be equal and on opposite sides of the equator
      if (Math.abs(this.lat1+this.lat2) < Proj4js.common.EPSLN) {
        Proj4js.reportError("lcc:init: Equal Latitudes");
        return;
      }

      var temp = this.b / this.a;
      this.e = Math.sqrt(1.0 - temp*temp);

      var sin1 = Math.sin(this.lat1);
      var cos1 = Math.cos(this.lat1);
      var ms1 = Proj4js.common.msfnz(this.e, sin1, cos1);
      var ts1 = Proj4js.common.tsfnz(this.e, this.lat1, sin1);

      var sin2 = Math.sin(this.lat2);
      var cos2 = Math.cos(this.lat2);
      var ms2 = Proj4js.common.msfnz(this.e, sin2, cos2);
      var ts2 = Proj4js.common.tsfnz(this.e, this.lat2, sin2);

      var ts0 = Proj4js.common.tsfnz(this.e, this.lat0, Math.sin(this.lat0));

      if (Math.abs(this.lat1 - this.lat2) > Proj4js.common.EPSLN) {
        this.ns = Math.log(ms1/ms2)/Math.log(ts1/ts2);
      } else {
        this.ns = sin1;
      }
      this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
      this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
      if (!this.title) this.title = "Lambert Conformal Conic";
    },


    // Lambert Conformal conic forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    forward : function(p) {

      var lon = p.x;
      var lat = p.y;

    // convert to radians
      if ( lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {
        //lon = lon * Proj4js.common.D2R;
        //lat = lat * Proj4js.common.D2R;
      } else {
        Proj4js.reportError("lcc:forward: llInputOutOfRange: "+ lon +" : " + lat);
        return null;
      }

      var con  = Math.abs( Math.abs(lat) - Proj4js.common.HALF_PI);
      var ts, rh1;
      if (con > Proj4js.common.EPSLN) {
        ts = Proj4js.common.tsfnz(this.e, lat, Math.sin(lat) );
        rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
      } else {
        con = lat * this.ns;
        if (con <= 0) {
          Proj4js.reportError("lcc:forward: No Projection");
          return null;
        }
        rh1 = 0;
      }
      var theta = this.ns * Proj4js.common.adjust_lon(lon - this.long0);
      p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
      p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

      return p;
    },

  // Lambert Conformal Conic inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------
  inverse : function(p) {

    var rh1, con, ts;
    var lat, lon;
    var x = (p.x - this.x0)/this.k0;
    var y = (this.rh - (p.y - this.y0)/this.k0);
    if (this.ns > 0) {
      rh1 = Math.sqrt (x * x + y * y);
      con = 1.0;
    } else {
      rh1 = -Math.sqrt (x * x + y * y);
      con = -1.0;
    }
    var theta = 0.0;
    if (rh1 != 0) {
      theta = Math.atan2((con * x),(con * y));
    }
    if ((rh1 != 0) || (this.ns > 0.0)) {
      con = 1.0/this.ns;
      ts = Math.pow((rh1/(this.a * this.f0)), con);
      lat = Proj4js.common.phi2z(this.e, ts);
      if (lat == -9999) return null;
    } else {
      lat = -Proj4js.common.HALF_PI;
    }
    lon = Proj4js.common.adjust_lon(theta/this.ns + this.long0);

    p.x = lon;
    p.y = lat;
    return p;
  }
};




/* ======================================================================
    projCode/laea.js
   ====================================================================== */

/*******************************************************************************
NAME                  LAMBERT AZIMUTHAL EQUAL-AREA
 
PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Lambert Azimuthal Equal-Area projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE            
----------              ----           
D. Steinwand, EROS      March, 1991   

This function was adapted from the Lambert Azimuthal Equal Area projection
code (FORTRAN) in the General Cartographic Transformation Package software
which is available from the U.S. Geological Survey National Mapping Division.
 
ALGORITHM REFERENCES

1.  "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.

2.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

3.  "Software Documentation for GCTP General Cartographic Transformation
    Package", U.S. Geological Survey National Mapping Division, May 1982.
*******************************************************************************/

Proj4js.Proj.laea = {
  S_POLE: 1,
  N_POLE: 2,
  EQUIT: 3,
  OBLIQ: 4,


/* Initialize the Lambert Azimuthal Equal Area projection
  ------------------------------------------------------*/
  init: function() {
    var t = Math.abs(this.lat0);
    if (Math.abs(t - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN) {
      this.mode = this.lat0 < 0. ? this.S_POLE : this.N_POLE;
    } else if (Math.abs(t) < Proj4js.common.EPSLN) {
      this.mode = this.EQUIT;
    } else {
      this.mode = this.OBLIQ;
    }
    if (this.es > 0) {
      var sinphi;
  
      this.qp = Proj4js.common.qsfnz(this.e, 1.0);
      this.mmf = .5 / (1. - this.es);
      this.apa = this.authset(this.es);
      switch (this.mode) {
        case this.N_POLE:
        case this.S_POLE:
          this.dd = 1.;
          break;
        case this.EQUIT:
          this.rq = Math.sqrt(.5 * this.qp);
          this.dd = 1. / this.rq;
          this.xmf = 1.;
          this.ymf = .5 * this.qp;
          break;
        case this.OBLIQ:
          this.rq = Math.sqrt(.5 * this.qp);
          sinphi = Math.sin(this.lat0);
          this.sinb1 = Proj4js.common.qsfnz(this.e, sinphi) / this.qp;
          this.cosb1 = Math.sqrt(1. - this.sinb1 * this.sinb1);
          this.dd = Math.cos(this.lat0) / (Math.sqrt(1. - this.es * sinphi * sinphi) * this.rq * this.cosb1);
          this.ymf = (this.xmf = this.rq) / this.dd;
          this.xmf *= this.dd;
          break;
      }
    } else {
      if (this.mode == this.OBLIQ) {
        this.sinph0 = Math.sin(this.lat0);
        this.cosph0 = Math.cos(this.lat0);
      }
    }
  },

/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
  forward: function(p) {

    /* Forward equations
      -----------------*/
    var x,y;
    var lam=p.x;
    var phi=p.y;
    lam = Proj4js.common.adjust_lon(lam - this.long0);
    
    if (this.sphere) {
        var coslam, cosphi, sinphi;
      
        sinphi = Math.sin(phi);
        cosphi = Math.cos(phi);
        coslam = Math.cos(lam);
        switch (this.mode) {
          case this.OBLIQ:
          case this.EQUIT:
            y = (this.mode == this.EQUIT) ? 1. + cosphi * coslam : 1. + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
            if (y <= Proj4js.common.EPSLN) {
              Proj4js.reportError("laea:fwd:y less than eps");
              return null;
            }
            y = Math.sqrt(2. / y);
            x = y * cosphi * Math.sin(lam);
            y *= (this.mode == this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
            break;
          case this.N_POLE:
            coslam = -coslam;
          case this.S_POLE:
            if (Math.abs(phi + this.phi0) < Proj4js.common.EPSLN) {
              Proj4js.reportError("laea:fwd:phi < eps");
              return null;
            }
            y = Proj4js.common.FORTPI - phi * .5;
            y = 2. * ((this.mode == this.S_POLE) ? Math.cos(y) : Math.sin(y));
            x = y * Math.sin(lam);
            y *= coslam;
            break;
        }
    } else {
        var coslam, sinlam, sinphi, q, sinb=0.0, cosb=0.0, b=0.0;
      
        coslam = Math.cos(lam);
        sinlam = Math.sin(lam);
        sinphi = Math.sin(phi);
        q = Proj4js.common.qsfnz(this.e, sinphi);
        if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
          sinb = q / this.qp;
          cosb = Math.sqrt(1. - sinb * sinb);
        }
        switch (this.mode) {
          case this.OBLIQ:
            b = 1. + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
            break;
          case this.EQUIT:
            b = 1. + cosb * coslam;
            break;
          case this.N_POLE:
            b = Proj4js.common.HALF_PI + phi;
            q = this.qp - q;
            break;
          case this.S_POLE:
            b = phi - Proj4js.common.HALF_PI;
            q = this.qp + q;
            break;
        }
        if (Math.abs(b) < Proj4js.common.EPSLN) {
            Proj4js.reportError("laea:fwd:b < eps");
            return null;
        }
        switch (this.mode) {
          case this.OBLIQ:
          case this.EQUIT:
            b = Math.sqrt(2. / b);
            if (this.mode == this.OBLIQ) {
              y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
            } else {
              y = (b = Math.sqrt(2. / (1. + cosb * coslam))) * sinb * this.ymf;
            }
            x = this.xmf * b * cosb * sinlam;
            break;
          case this.N_POLE:
          case this.S_POLE:
            if (q >= 0.) {
              x = (b = Math.sqrt(q)) * sinlam;
              y = coslam * ((this.mode == this.S_POLE) ? b : -b);
            } else {
              x = y = 0.;
            }
            break;
        }
    }

    //v 1.0
    /*
    var sin_lat=Math.sin(lat);
    var cos_lat=Math.cos(lat);

    var sin_delta_lon=Math.sin(delta_lon);
    var cos_delta_lon=Math.cos(delta_lon);

    var g =this.sin_lat_o * sin_lat +this.cos_lat_o * cos_lat * cos_delta_lon;
    if (g == -1.0) {
      Proj4js.reportError("laea:fwd:Point projects to a circle of radius "+ 2.0 * R);
      return null;
    }
    var ksp = this.a * Math.sqrt(2.0 / (1.0 + g));
    var x = ksp * cos_lat * sin_delta_lon + this.x0;
    var y = ksp * (this.cos_lat_o * sin_lat - this.sin_lat_o * cos_lat * cos_delta_lon) + this.y0;
    */
    p.x = this.a*x + this.x0;
    p.y = this.a*y + this.y0;
    return p;
  },//lamazFwd()

/* Inverse equations
  -----------------*/
  inverse: function(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var x = p.x/this.a;
    var y = p.y/this.a;
    var lam, phi;

    if (this.sphere) {
        var  cosz=0.0, rh, sinz=0.0;
      
        rh = Math.sqrt(x*x + y*y);
        phi = rh * .5;
        if (phi > 1.) {
          Proj4js.reportError("laea:Inv:DataError");
          return null;
        }
        phi = 2. * Math.asin(phi);
        if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
          sinz = Math.sin(phi);
          cosz = Math.cos(phi);
        }
        switch (this.mode) {
        case this.EQUIT:
          phi = (Math.abs(rh) <= Proj4js.common.EPSLN) ? 0. : Math.asin(y * sinz / rh);
          x *= sinz;
          y = cosz * rh;
          break;
        case this.OBLIQ:
          phi = (Math.abs(rh) <= Proj4js.common.EPSLN) ? this.phi0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
          x *= sinz * this.cosph0;
          y = (cosz - Math.sin(phi) * this.sinph0) * rh;
          break;
        case this.N_POLE:
          y = -y;
          phi = Proj4js.common.HALF_PI - phi;
          break;
        case this.S_POLE:
          phi -= Proj4js.common.HALF_PI;
          break;
        }
        lam = (y == 0. && (this.mode == this.EQUIT || this.mode == this.OBLIQ)) ? 0. : Math.atan2(x, y);
    } else {
        var cCe, sCe, q, rho, ab=0.0;
      
        switch (this.mode) {
          case this.EQUIT:
          case this.OBLIQ:
            x /= this.dd;
            y *=  this.dd;
            rho = Math.sqrt(x*x + y*y);
            if (rho < Proj4js.common.EPSLN) {
              p.x = 0.;
              p.y = this.phi0;
              return p;
            }
            sCe = 2. * Math.asin(.5 * rho / this.rq);
            cCe = Math.cos(sCe);
            x *= (sCe = Math.sin(sCe));
            if (this.mode == this.OBLIQ) {
              ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho
              q = this.qp * ab;
              y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
            } else {
              ab = y * sCe / rho;
              q = this.qp * ab;
              y = rho * cCe;
            }
            break;
          case this.N_POLE:
            y = -y;
          case this.S_POLE:
            q = (x * x + y * y);
            if (!q ) {
              p.x = 0.;
              p.y = this.phi0;
              return p;
            }
            /*
            q = this.qp - q;
            */
            ab = 1. - q / this.qp;
            if (this.mode == this.S_POLE) {
              ab = - ab;
            }
            break;
        }
        lam = Math.atan2(x, y);
        phi = this.authlat(Math.asin(ab), this.apa);
    }

    /*
    var Rh = Math.Math.sqrt(p.x *p.x +p.y * p.y);
    var temp = Rh / (2.0 * this.a);

    if (temp > 1) {
      Proj4js.reportError("laea:Inv:DataError");
      return null;
    }

    var z = 2.0 * Proj4js.common.asinz(temp);
    var sin_z=Math.sin(z);
    var cos_z=Math.cos(z);

    var lon =this.long0;
    if (Math.abs(Rh) > Proj4js.common.EPSLN) {
       var lat = Proj4js.common.asinz(this.sin_lat_o * cos_z +this. cos_lat_o * sin_z *p.y / Rh);
       var temp =Math.abs(this.lat0) - Proj4js.common.HALF_PI;
       if (Math.abs(temp) > Proj4js.common.EPSLN) {
          temp = cos_z -this.sin_lat_o * Math.sin(lat);
          if(temp!=0.0) lon=Proj4js.common.adjust_lon(this.long0+Math.atan2(p.x*sin_z*this.cos_lat_o,temp*Rh));
       } else if (this.lat0 < 0.0) {
          lon = Proj4js.common.adjust_lon(this.long0 - Math.atan2(-p.x,p.y));
       } else {
          lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
       }
    } else {
      lat = this.lat0;
    }
    */
    //return(OK);
    p.x = Proj4js.common.adjust_lon(this.long0+lam);
    p.y = phi;
    return p;
  },//lamazInv()
  
/* determine latitude from authalic latitude */
  P00: .33333333333333333333,
  P01: .17222222222222222222,
  P02: .10257936507936507936,
  P10: .06388888888888888888,
  P11: .06640211640211640211,
  P20: .01641501294219154443,
  
  authset: function(es) {
    var t;
    var APA = new Array();
    APA[0] = es * this.P00;
    t = es * es;
    APA[0] += t * this.P01;
    APA[1] = t * this.P10;
    t *= es;
    APA[0] += t * this.P02;
    APA[1] += t * this.P11;
    APA[2] = t * this.P20;
    return APA;
  },
  
  authlat: function(beta, APA) {
    var t = beta+beta;
    return(beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t+t) + APA[2] * Math.sin(t+t+t));
  }
  
};



/* ======================================================================
    projCode/aeqd.js
   ====================================================================== */

Proj4js.Proj.aeqd = {

  init : function() {
    this.sin_p12=Math.sin(this.lat0);
    this.cos_p12=Math.cos(this.lat0);
  },

  forward: function(p) {
    var lon=p.x;
    var lat=p.y;
    var ksp;

    var sinphi=Math.sin(p.y);
    var cosphi=Math.cos(p.y); 
    var dlon = Proj4js.common.adjust_lon(lon - this.long0);
    var coslon = Math.cos(dlon);
    var g = this.sin_p12 * sinphi + this.cos_p12 * cosphi * coslon;
    if (Math.abs(Math.abs(g) - 1.0) < Proj4js.common.EPSLN) {
       ksp = 1.0;
       if (g < 0.0) {
         Proj4js.reportError("aeqd:Fwd:PointError");
         return;
       }
    } else {
       var z = Math.acos(g);
       ksp = z/Math.sin(z);
    }
    p.x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon);
    p.y = this.y0 + this.a * ksp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * coslon);
    return p;
  },

  inverse: function(p){
    p.x -= this.x0;
    p.y -= this.y0;

    var rh = Math.sqrt(p.x * p.x + p.y *p.y);
    if (rh > (2.0 * Proj4js.common.HALF_PI * this.a)) {
       Proj4js.reportError("aeqdInvDataError");
       return;
    }
    var z = rh / this.a;

    var sinz=Math.sin(z);
    var cosz=Math.cos(z);

    var lon = this.long0;
    var lat;
    if (Math.abs(rh) <= Proj4js.common.EPSLN) {
      lat = this.lat0;
    } else {
      lat = Proj4js.common.asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
      var con = Math.abs(this.lat0) - Proj4js.common.HALF_PI;
      if (Math.abs(con) <= Proj4js.common.EPSLN) {
        if (this.lat0 >= 0.0) {
          lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2(p.x , -p.y));
        } else {
          lon = Proj4js.common.adjust_lon(this.long0 - Math.atan2(-p.x , p.y));
        }
      } else {
        con = cosz - this.sin_p12 * Math.sin(lat);
        if ((Math.abs(con) < Proj4js.common.EPSLN) && (Math.abs(p.x) < Proj4js.common.EPSLN)) {
           //no-op, just keep the lon value as is
        } else {
          var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
          lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
        }
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  } 
};
/* ======================================================================
    projCode/moll.js
   ====================================================================== */

/*******************************************************************************
NAME                            MOLLWEIDE

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the MOllweide projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
D. Steinwand, EROS      May, 1991;  Updated Sept, 1992; Updated Feb, 1993
S. Nelson, EDC		Jun, 2993;	Made corrections in precision and
					number of iterations.

ALGORITHM REFERENCES

1.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.

2.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.
*******************************************************************************/

Proj4js.Proj.moll = {

  /* Initialize the Mollweide projection
    ------------------------------------*/
  init: function(){
    //no-op
  },

  /* Mollweide forward equations--mapping lat,long to x,y
    ----------------------------------------------------*/
  forward: function(p) {

    /* Forward equations
      -----------------*/
    var lon=p.x;
    var lat=p.y;

    var delta_lon = Proj4js.common.adjust_lon(lon - this.long0);
    var theta = lat;
    var con = Proj4js.common.PI * Math.sin(lat);

    /* Iterate using the Newton-Raphson method to find theta
      -----------------------------------------------------*/
    for (var i=0;true;i++) {
       var delta_theta = -(theta + Math.sin(theta) - con)/ (1.0 + Math.cos(theta));
       theta += delta_theta;
       if (Math.abs(delta_theta) < Proj4js.common.EPSLN) break;
       if (i >= 50) {
          Proj4js.reportError("moll:Fwd:IterationError");
         //return(241);
       }
    }
    theta /= 2.0;

    /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
       this is done here because of precision problems with "cos(theta)"
       --------------------------------------------------------------------------*/
    if (Proj4js.common.PI/2 - Math.abs(lat) < Proj4js.common.EPSLN) delta_lon =0;
    var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
    var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

    p.x=x;
    p.y=y;
    return p;
  },

  inverse: function(p){
    var theta;
    var arg;

    /* Inverse equations
      -----------------*/
    p.x-= this.x0;
    //~ p.y -= this.y0;
    var arg = p.y /  (1.4142135623731 * this.a);

    /* Because of division by zero problems, 'arg' can not be 1.0.  Therefore
       a number very close to one is used instead.
       -------------------------------------------------------------------*/
    if(Math.abs(arg) > 0.999999999999) arg=0.999999999999;
    var theta =Math.asin(arg);
    var lon = Proj4js.common.adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
    if(lon < (-Proj4js.common.PI)) lon= -Proj4js.common.PI;
    if(lon > Proj4js.common.PI) lon= Proj4js.common.PI;
    arg = (2.0 * theta + Math.sin(2.0 * theta)) / Proj4js.common.PI;
    if(Math.abs(arg) > 1.0)arg=1.0;
    var lat = Math.asin(arg);
    //return(OK);

    p.x=lon;
    p.y=lat;
    return p;
  }
};
//------------------------------------------------------------------------------------------------









/*----------------------------------------------------------------------------------------------------------
 FileSaver.js Javascript Component
 Copyright © 2015 Eli Grey.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without
 limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------------------------------------------------*/
var saveAs = saveAs
// IE 10+ (native saveAs)
|| (typeof navigator !== "undefined" &&
    navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
// Everyone else
|| (function(view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof navigator !== "undefined" &&
        /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
    doc = view.document
    // only get URL when necessary in case Blob.js hasn't overridden it yet
    , get_URL = function() {
        return view.URL || view.webkitURL || view;
    }
    , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
    , can_use_save_link = "download" in save_link
    , click = function(node) {
        var event = doc.createEvent("MouseEvents");
        event.initMouseEvent(
            "click", true, false, view, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        node.dispatchEvent(event);
    }
    , webkit_req_fs = view.webkitRequestFileSystem
    , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
    , throw_outside = function(ex) {
        (view.setImmediate || view.setTimeout)(function() {
            throw ex;
        }, 0);
    }
    , force_saveable_type = "application/octet-stream"
    , fs_min_size = 0
    // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
    // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
    // for the reasoning behind the timeout and revocation flow
    , arbitrary_revoke_timeout = 500 // in ms
    , revoke = function(file) {
        var revoker = function() {
            if (typeof file === "string") { // file is an object URL
                get_URL().revokeObjectURL(file);
            } else { // file is a File
                file.remove();
            }
        };
        if (view.chrome) {
            revoker();
        } else {
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
    }
    , dispatch = function(filesaver, event_types, event) {
        event_types = [].concat(event_types);
        var i = event_types.length;
        while (i--) {
            var listener = filesaver["on" + event_types[i]];
            if (typeof listener === "function") {
                try {
                    listener.call(filesaver, event || filesaver);
                } catch (ex) {
                    throw_outside(ex);
                }
            }
        }
    }
    , FileSaver = function(blob, name) {
        // First try a.download, then web filesystem, then object URLs
        var
        filesaver = this
        , type = blob.type
        , blob_changed = false
        , object_url
        , target_view
        , dispatch_all = function() {
            dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        , fs_error = function() {
            // don't create more object URLs than needed
            if (blob_changed || !object_url) {
                object_url = get_URL().createObjectURL(blob);
            }
            if (target_view) {
                target_view.location.href = object_url;
            } else {
                var new_tab = view.open(object_url, "_blank");
                if (new_tab == undefined && typeof safari !== "undefined") {
                    //Apple do not allow window.open, see http://bit.ly/1kZffRI
                    view.location.href = object_url
                }
            }
            filesaver.readyState = filesaver.DONE;
            dispatch_all();
            revoke(object_url);
        }
        , abortable = function(func) {
            return function() {
                if (filesaver.readyState !== filesaver.DONE) {
                    return func.apply(this, arguments);
                }
            };
        }
        , create_if_not_found = {create: true, exclusive: false}
        , slice
        ;
        filesaver.readyState = filesaver.INIT;
        if (!name) {
            name = "download";
        }
        if (can_use_save_link) {
            object_url = get_URL().createObjectURL(blob);
            save_link.href = object_url;
            save_link.download = name;
            click(save_link);
            filesaver.readyState = filesaver.DONE;
            dispatch_all();
            revoke(object_url);
            return;
        }
        // prepend BOM for UTF-8 XML and text/plain types
        if (/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            blob = new Blob(["\ufeff", blob], {type: blob.type});
        }
        // Object and web filesystem URLs have a problem saving in Google Chrome when
        // viewed in a tab, so I force save with application/octet-stream
        // http://code.google.com/p/chromium/issues/detail?id=91158
        // Update: Google errantly closed 91158, I submitted it again:
        // https://code.google.com/p/chromium/issues/detail?id=389642
        if (view.chrome && type && type !== force_saveable_type) {
            slice = blob.slice || blob.webkitSlice;
            blob = slice.call(blob, 0, blob.size, force_saveable_type);
            blob_changed = true;
        }
        // Since I can't be sure that the guessed media type will trigger a download
        // in WebKit, I append .download to the filename.
        // https://bugs.webkit.org/show_bug.cgi?id=65440
        if (webkit_req_fs && name !== "download") {
            name += ".download";
        }
        if (type === force_saveable_type || webkit_req_fs) {
            target_view = view;
        }
        if (!req_fs) {
            fs_error();
            return;
        }
        fs_min_size += blob.size;
        req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
            fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                var save = function() {
                    dir.getFile(name, create_if_not_found, abortable(function(file) {
                        file.createWriter(abortable(function(writer) {
                            writer.onwriteend = function(event) {
                                target_view.location.href = file.toURL();
                                filesaver.readyState = filesaver.DONE;
                                dispatch(filesaver, "writeend", event);
                                revoke(file);
                            };
                            writer.onerror = function() {
                                var error = writer.error;
                                if (error.code !== error.ABORT_ERR) {
                                    fs_error();
                                }
                            };
                            "writestart progress write abort".split(" ").forEach(function(event) {
                                writer["on" + event] = filesaver["on" + event];
                            });
                            writer.write(blob);
                            filesaver.abort = function() {
                                writer.abort();
                                filesaver.readyState = filesaver.DONE;
                            };
                            filesaver.readyState = filesaver.WRITING;
                        }), fs_error);
                    }), fs_error);
                };
                dir.getFile(name, {create: false}, abortable(function(file) {
                    // delete file if it already exists
                    file.remove();
                    save();
                }), abortable(function(ex) {
                    if (ex.code === ex.NOT_FOUND_ERR) {
                        save();
                    } else {
                        fs_error();
                    }
                }));
            }), fs_error);
        }), fs_error);
    }
    , FS_proto = FileSaver.prototype
    , saveAs = function(blob, name) {
        return new FileSaver(blob, name);
    }
    ;
    FS_proto.abort = function() {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
        null;

    return saveAs;
}(
    typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this.content
   ));
//------------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------------
window.indexedDB      = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
//------------------------------------------------------------------------------------------------
var openrequest = window.indexedDB.open( skanerDataBaseName, 1 );

openrequest.onsuccess = function(event) {
    skanerDB = event.target.result;
    console.log("SkanerMiejscowosciPL.DataBase.Init.OK = ", openrequest.result.name, skanerDB.version );
};

openrequest.onblocked = function(event) {
    //alert( lang.closetabs );
};

openrequest.onerror = function(event) {
    alert(lang.dbopenerror);
};

openrequest.onupgradeneeded = function(event) { 
    
    var db = event.target.result;
    console.log("SkanerMiejscowosciPL.DataBase.Upgrade: ", db);
    
    storeMIEJSC = false;
    var stores = db.objectStoreNames;
    for(var n=0; n<stores.length; n++) {
        if ( stores[n] == 'miejscowosci') storeMIEJSC = true;
    }

    if (storeMIEJSC) {
    }
    else {
        var newStore = db.createObjectStore("miejscowosci", { keyPath: "nr", autoIncrement: true });
        newStore.createIndex("id",        "id",         { unique: false });
        newStore.createIndex("text",      "text",       { unique: false });
        newStore.createIndex("woj",       "woj",        { unique: false });
        newStore.createIndex("pow",       "pow",        { unique: false });
    }
}
//------------------------------------------------------------------------------------------------
function bootstrapSkanerMiejscowosciPL()
{
    if(!window.Waze.map) {
        console.log('SkanerMiejscowosciPL: Waiting for WME...');
        setTimeout(bootstrapSkanerMiejscowosciPL, 1000);
        return;
    }

    window.addEventListener("beforeunload", saveOptions, true);

    setTimeout(initialiseSkanerMiejscowosciPL, 1000);
}
//------------------------------------------------------------------------------------------------
function saveOptions() {
    
    remove_towns();

    var str = '';
    //for(var s in saved) {
    //    str += s + '|' + saved[s] + '|';
    //}

    var opt = '';
    opt += getId('skanermiejscowoscipl_woj').value         + "|";
    opt += getId('skanermiejscowoscipl_shownames').checked + "|";
    opt += getId('skanermiejscowoscipl_hide').checked      + "|";
    opt += getId('skanermiejscowoscipl_pow').value         + "|";
    opt += getId('skanermiejscowoscipl_koloruj').checked   + "|";

    localStorage.setItem('SkanerMiejscowosciPL',        str );
    localStorage.setItem('SkanerMiejscowosciPLOptions', opt );
}
//------------------------------------------------------------------------------------------------
function loadOptions() {

    // niepotrzebne dodatkowe przechowywanie statusu miejscowości w pamięci lokalnej localStorage, te dane przechowywane są w głównej bazie indexedDB
    // w przypadku ponownego importu pliku i tak trzeba jeszcze raz skanować województwo i powiat, aby mieć aktualny status znalezionych miejscowości
    // ponadto pamięć localStorage jest ograniczona i nie jest w stanie pomieścić wszystkich danych miejscowości, do tego celu służy baza indexedDB
    
    //if (localStorage.SkanerMiejscowosciPL) {                          
    //    var table = localStorage.SkanerMiejscowosciPL.split('|');
    //    for(var i=0; i<table.length-1; i+=2) {
    //        var id     = table[i+0];
    //        var status = table[i+1];
    //        saved[ id ] = status;
    //    }
    //}

    if (localStorage.SkanerMiejscowosciPLOptions) {
        var opt = localStorage.SkanerMiejscowosciPLOptions.split('|');
        wojewodztwo                                     =  opt[0];
        getId('skanermiejscowoscipl_shownames').checked = (opt[1] == 'true');
        getId('skanermiejscowoscipl_hide').checked      = (opt[2] == 'true');
        powiat                                          =  opt[3];
        getId('skanermiejscowoscipl_koloruj').checked   = (opt[4] == 'true');
    }
}
//------------------------------------------------------------------------------------------------
function getElementsByClassName(classname, node) {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}
//--------------------------------------------------------------------------------------------------------
function getId(node) {
    return document.getElementById(node);
}
//--------------------------------------------------------------------------------------------------------
function precFloat(f, prec)
{
	if (!isFinite(f)) return "&mdash;";

	if (f < 0) {
		f -= Math.pow(0.1, prec) * 0.5;
	}
	else {
		f += Math.pow(0.1, prec) * 0.5;
	}

	var ipart = parseInt(f);
	var fpart = Math.abs(f - ipart);
	f = ipart;

	if (fpart == '0') fpart = '0.0';
	fpart += '0000000000000000';
	if (prec) f += fpart.substr(1, prec + 1);

	return f;
}
//--------------------------------------------------------------------------------------------------------
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\r/g, ' ').replace(/\n/g, ' ');
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplWCZYTAJPLIK() {

    getId('skanermiejscowoscipl_wrapper').innerHTML = '<input id=skanermiejscowoscipl_fileselector type="file" name="files[]" />';
    getId('skanermiejscowoscipl_wrapper').addEventListener('change', skanermiejscowosciplFILESELECTOR, false);
    
    getId('skanermiejscowoscipl_fileselector').click();
}
//--------------------------------------------------------------------------------------------------------
function load_prng_miejscowosci() {

    //-------------------------------------------------------------------------------------------------------------------------------------------
    //        zdefiniowane projekcji EPSG:2180, której standardowo nie ma w OpenLayers
    //        konwersja współrzędnych za pomocą biblioteki Proj4js
    //-------------------------------------------------------------------------------------------------------------------------------------------
    Proj4js.defs["EPSG:2180"] = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs";
    var proj2180   = new Proj4js.Proj('EPSG:2180');
    var proj900913 = new Proj4js.Proj('EPSG:900913');
    //-------------------------------------------------------------------------------------------------------------------------------------------

    var blob = bigF.slice(bigOffset, bigOffset + 1000000);
    var reader = new FileReader();

    getId('skanermiejscowoscipl_button1').disabled = true;

    reader.onloadend = function(evt) {
        if (evt.loaded == 0) {
            getId('skanermiejscowoscipl_button1').disabled = false;

            bigData += '</WSP_MIEJSCOWOSCI_WGS>\r\n';
            
            var blob = new Blob( [ bigData ], {type: "text/plain;charset=utf-8"});
            saveAs(blob, 'wsp_miejscowosci_wgs.txt' );
            
            return;
        }
        
        var str = bigReszta + evt.target.result;
        
        bigLoaded += evt.loaded;
        var proc = parseInt(bigLoaded * 100 / bigSize + 0.5);
        
        var fme = str.split('<fme:miejscowosci ');
        bigReszta = fme[fme.length-1];
        
        for(var i=0; i<fme.length-1; i++) {
            if (++bigRekordCounter == 1) continue;
            var block = fme[i]; 
            //console.log(rekord.substr(0,15));
            
            var p1 = block.indexOf('<fme:nazwa_glowna>') + 18;
            var p2 = block.indexOf('</fme:nazwa_glowna>');
            if (p1 < p2) var nazwaglowna = block.substr(p1, p2-p1);

            var p1 = block.indexOf('<fme:rodzaj_obiektu>') + 20;
            var p2 = block.indexOf('</fme:rodzaj_obiektu>');
            if (p1 < p2) var rodzajobiektu = block.substr(p1, p2-p1);

            var terytid = '0      ';
            var p1 = block.indexOf('<fme:identyfikator_zewnetrzny>') + 30;
            var p2 = block.indexOf('</fme:identyfikator_zewnetrzny>');
            if (p1 < p2) terytid = block.substr(p1, p2-p1);
            
            var p1 = block.indexOf('<gml:pos>') + 9;
            var p2 = block.indexOf('</gml:pos>');
            if (p1 < p2) {
                var wsp  = block.substr(p1, p2-p1).split(' ');
                var posx = wsp[0];
                var posy = wsp[1];

                // konwersja współrzędnych z EPSG2180 na EPSG900913 
                var p = new Proj4js.Point(posx, posy);
                Proj4js.transform(proj2180, proj900913, p);
                posx = precFloat(p.x, 2);
                posy = precFloat(p.y, 2);
                
                var pt = new OL.LonLat( posx, posy ).transform(epsg900913, epsg4326);
                posx = pt.lon;
                posy = pt.lat;
            }
            
            var p1 = block.indexOf('<fme:data_modyfikacji>') + 22;
            var p2 = block.indexOf('</fme:data_modyfikacji>');
            if (p1 < p2) var data_modyfikacji = block.substr(p1, p2-p1);

            //var p1 = block.indexOf('<fme:data_wprowadzenia>') + 23;
            //var p2 = block.indexOf('</fme:data_wprowadzenia>');
            //if (p1 < p2) var data_wprowadzenia = block.substr(p1, p2-p1);

            var uwagi = '';
            var p1 = block.indexOf('<fme:uwagi>') + 11;
            var p2 = block.indexOf('</fme:uwagi>');
            if (p1 < p2) uwagi = block.substr(p1, p2-p1);
            
            bigData += terytid + '|' + data_modyfikacji + '|' + precFloat(posx, 6) + '|' + precFloat(posy, 6) + '|' + nazwaglowna + '|' + rodzajobiektu + '|' + uwagi + '\r\n';
        }

        getId('skanermiejscowoscipl_log3').innerHTML = bigName + '<br>';
        getId('skanermiejscowoscipl_log3').innerHTML += '' + bigLoaded + '/' + bigSize + ' bajtów &nbsp; ' + proc + '%<br>';
        getId('skanermiejscowoscipl_log3').innerHTML += 'Odczytano ' + bigRekordCounter + ' rekordów gml<br>';
        
        bigOffset += 1000000;
        setTimeout(load_prng_miejscowosci, 10);
    };

    reader.readAsText(blob, 'utf-8');
}
//--------------------------------------------------------------------------------------------------------
function correct(ids, id, rodzaj) {

    if (ids[0] == id) return { id:id, rodzaj:rodzaj };
    if (ids[1] == id) return { id:id, rodzaj:rodzaj };
    if (ids[2] == id) return { id:id, rodzaj:rodzaj };
    if (ids[3] == id) return { id:id, rodzaj:rodzaj };
}
//--------------------------------------------------------------------------------------------------------
function read_waze_cities(rows) {

    getId('skanermiejscowoscipl_log2').innerHTML = '';
    var log = '';

    baza      = [];
    bazaINDEX = {};

    var TERYT_CITIES           = {};
    var UNI_TERYT_CITIES       = {};

    for(var i=1; i<rows.length; i++) {
        var cols = rows[i].split('\t');
        if (cols.length >= 5) {
            var wazename   = cols[0];
            var nazwa      = cols[1];
            var rodzaj     = cols[2];
            var ids        = cols[3].split('+');
            var woj        = cols[4].substr(0, 2);
            var pow        = cols[4].substr(0, 4);
            var terytid    = ids[0];
            var rodz = rodzaj.split(', ');
            
            bazapowiatow[pow] = cols[6];
            
            //------ wybranie najważniejszej jednostki w danej grupie i teryt dla tej grupy jeżeli jest więcej pozycji
            if (rodz.length == ids.length) {
                if (rodz[3] == 'osada leśna') terytid = ids[3];
                if (rodz[2] == 'osada leśna') terytid = ids[2];
                if (rodz[1] == 'osada leśna') terytid = ids[1];
                if (rodz[0] == 'osada leśna') terytid = ids[0];

                if (rodz[3] == 'osada')       terytid = ids[3];
                if (rodz[2] == 'osada')       terytid = ids[2];
                if (rodz[1] == 'osada')       terytid = ids[1];
                if (rodz[0] == 'osada')       terytid = ids[0];

                if (rodz[3] == 'kolonia')     terytid = ids[3];
                if (rodz[2] == 'kolonia')     terytid = ids[2];
                if (rodz[1] == 'kolonia')     terytid = ids[1];
                if (rodz[0] == 'kolonia')     terytid = ids[0];

                if (rodz[3] == 'wieś')        { terytid = ids[3]; rodzaj = 'wieś'; }
                if (rodz[2] == 'wieś')        { terytid = ids[2]; rodzaj = 'wieś'; }
                if (rodz[1] == 'wieś')        { terytid = ids[1]; rodzaj = 'wieś'; }
                if (rodz[0] == 'wieś')        { terytid = ids[0]; rodzaj = 'wieś'; }

                if (rodz[3] == 'miasto')      { terytid = ids[3]; rodzaj = 'miasto'; }
                if (rodz[2] == 'miasto')      { terytid = ids[2]; rodzaj = 'miasto'; }
                if (rodz[1] == 'miasto')      { terytid = ids[1]; rodzaj = 'miasto'; }
                if (rodz[0] == 'miasto')      { terytid = ids[0]; rodzaj = 'miasto'; }
                
                //usunięcie dubli
                rodzaj = rodzaj.replace('kolonia, kolonia', 'kolonia');
                rodzaj = rodzaj.replace('kolonia, kolonia', 'kolonia');
                rodzaj = rodzaj.replace('kolonia, kolonia', 'kolonia');
                rodzaj = rodzaj.replace('kolonia, kolonia', 'kolonia');
                
                rodzaj = rodzaj.replace('osada, osada', 'osada');
                rodzaj = rodzaj.replace('osada, osada', 'osada');
                rodzaj = rodzaj.replace('osada, osada', 'osada');
                rodzaj = rodzaj.replace('osada, osada', 'osada');

                rodzaj = rodzaj.replace('osada leśna, osada leśna', 'osada leśna');
                rodzaj = rodzaj.replace('osada leśna, osada leśna', 'osada leśna');
                rodzaj = rodzaj.replace('osada leśna, osada leśna', 'osada leśna');
                rodzaj = rodzaj.replace('osada leśna, osada leśna', 'osada leśna');
            }
            else {
                if (rodz.length > 1) {
                    
                    //console.log('NIEJEDNOZNACZNOŚĆ w TERYT: ', wazename, 'rodz:', cols[2], 'id:', cols[3]); 

                    //------- korekta kilkunastu wyjątków gdzie ilość rodzaju miejscowości nie zgadza się z ilością terytid i nie wiadomo wtedy, który terytid to wieś

                    // Giby (woj. podlaskie pow. sejneński gm. Giby) [0757499] : wieś        <<---------- wieś jest najważniejsza w tej grupie
                    // Giby (woj. podlaskie pow. sejneński gm. Giby) [0757482] : osada leśna
                    // Giby (woj. podlaskie pow. sejneński gm. Giby) [0757476] : osada leśna 
                    var out = correct(ids, '0757499', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Gracuch (woj. świętokrzyskie pow. konecki gm. Końskie) [0243694] : osada leśna
                    // Gracuch (woj. świętokrzyskie pow. konecki gm. Końskie) [0243702] : osada leśna
                    // Gracuch (woj. świętokrzyskie pow. konecki gm. Końskie) [0243671] : wieś          <<---------- wieś jest najważniejsza w tej grupie
                    var out = correct(ids, '0243671', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Grójec Wielki (woj. łódzkie pow. sieradzki gm. Złoczew) [0722503] : osada leśna
                    // Grójec Wielki (woj. łódzkie pow. sieradzki gm. Złoczew) [0722489] : wieś          <<---------- wieś jest najważniejsza w tej grupie
                    // Grójec Wielki (woj. łódzkie pow. sieradzki gm. Złoczew) [0722510] : osada leśna
                    var out = correct(ids, '0722489', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Gulbin (woj. podlaskie pow. sejneński gm. Giby) [0757542] : osada leśna
                    // Gulbin (woj. podlaskie pow. sejneński gm. Giby) [0757520] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    // Gulbin (woj. podlaskie pow. sejneński gm. Giby) [0757536] : osada leśna
                    var out = correct(ids, '0757520', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Jeziora (woj. kujawsko-pomorskie pow. żniński gm. Rogowo) [1036862] : osada leśna
                    // Jeziora (woj. kujawsko-pomorskie pow. żniński gm. Rogowo) [1036856] : osada leśna
                    // Jeziora (woj. kujawsko-pomorskie pow. żniński gm. Rogowo) [0094159] : osada        <<---------- osada jest najważniejsza w tej grupie
                    var out = correct(ids, '0094159', 'osada, osada leśna');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Kębłowo (woj. wielkopolskie pow. wolsztyński gm. Wolsztyn) [0916383] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    // Kębłowo (woj. wielkopolskie pow. wolsztyński gm. Wolsztyn) [0916437] : osada leśna
                    // Kębłowo (woj. wielkopolskie pow. wolsztyński gm. Wolsztyn) [0916420] : osada leśna
                    var out = correct(ids, '0916383', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Leniszki (woj. łódzkie pow. wieluński gm. Czarnożyły) [0701582] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    // Leniszki (woj. łódzkie pow. wieluński gm. Czarnożyły) [0701607] : osada leśna
                    // Leniszki (woj. łódzkie pow. wieluński gm. Czarnożyły) [0701599] : osada leśna
                    var out = correct(ids, '0701582', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Marcinki (woj. wielkopolskie pow. ostrzeszowski gm. Kobyla Góra) [0200176] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    // Marcinki (woj. wielkopolskie pow. ostrzeszowski gm. Kobyla Góra) [0200182] : osada leśna
                    // Marcinki (woj. wielkopolskie pow. ostrzeszowski gm. Kobyla Góra) [0200199] : osada leśna
                    var out = correct(ids, '0200176', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Małe Końskie (woj. łódzkie pow. opoczyński gm. Mniszków) [0546058] : osada leśna
                    // Małe Końskie (woj. łódzkie pow. opoczyński gm. Mniszków) [0546064] : osada leśna
                    // Małe Końskie (woj. łódzkie pow. opoczyński gm. Mniszków) [0546035] : wieś          <<---------- wieś jest najważniejsza w tej grupie
                    var out = correct(ids, '0546035', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Ościsłowo (woj. mazowieckie pow. ciechanowski gm. Glinojeck) [0114784] : osada leśna
                    // Ościsłowo (woj. mazowieckie pow. ciechanowski gm. Glinojeck) [0114761] : wieś           <<---------- wieś jest najważniejsza w tej grupie
                    // Ościsłowo (woj. mazowieckie pow. ciechanowski gm. Glinojeck) [0114790] : osada leśna
                    var out = correct(ids, '0114761', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Puzdrowizna (woj. mazowieckie pow. ostrowski gm. Brok) [0507147] : wieś        <<---------- wieś jest najważniejsza w tej grupie
                    // Puzdrowizna (woj. mazowieckie pow. ostrowski gm. Brok) [1057338] : osada leśna
                    // Puzdrowizna (woj. mazowieckie pow. ostrowski gm. Brok) [0507093] : osada leśna
                    var out = correct(ids, '0507147', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Rycice (woj. mazowieckie pow. przasnyski gm. Chorzele) [0507785] : osada leśna
                    // Rycice (woj. mazowieckie pow. przasnyski gm. Chorzele) [0507762] : wieś          <<---------- wieś jest najważniejsza w tej grupie
                    // Rycice (woj. mazowieckie pow. przasnyski gm. Chorzele) [0507791] : osada leśna
                    var out = correct(ids, '0507762', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Suchowola (woj. lubelskie pow. radzyński gm. Wohyń) [0022467] : wieś       <<---------- wieś jest najważniejsza w tej grupie
                    // Suchowola (woj. lubelskie pow. radzyński gm. Wohyń) [0022496] : kolonia
                    // Suchowola (woj. lubelskie pow. radzyński gm. Wohyń) [1024965] : osada leśna
                    // Suchowola (woj. lubelskie pow. radzyński gm. Wohyń) [1024959] : osada leśna
                    var out = correct(ids, '0022467', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Szczepki (woj. podlaskie pow. augustowski gm. Nowinka) [0762833] : osada leśna
                    // Szczepki (woj. podlaskie pow. augustowski gm. Nowinka) [1010845] : osada leśna
                    // Szczepki (woj. podlaskie pow. augustowski gm. Nowinka) [0763212] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    var out = correct(ids, '0763212', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Łoś (woj. mazowieckie pow. piaseczyński gm. Prażmów) [0007290] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    // Łoś (woj. mazowieckie pow. piaseczyński gm. Prażmów) [0007309] : osada leśna
                    // Łoś (woj. mazowieckie pow. piaseczyński gm. Prażmów) [0007315] : osada leśna
                    var out = correct(ids, '0007290', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }

                    // Żywocin (woj. łódzkie pow. piotrkowski gm. Wolbórz) [0556750] : kolonia
                    // Żywocin (woj. łódzkie pow. piotrkowski gm. Wolbórz) [0556766] : osada leśna
                    // Żywocin (woj. łódzkie pow. piotrkowski gm. Wolbórz) [0556737] : wieś         <<---------- wieś jest najważniejsza w tej grupie
                    // Żywocin (woj. łódzkie pow. piotrkowski gm. Wolbórz) [0556772] : osada leśna
                    var out = correct(ids, '0556737', 'wieś');
                    if (out != undefined) { rodzaj = out.rodzaj; terytid = out.id; }
                }
                else {
                    //----------- przypadek gdy jest jeden rodzaj miejscowości np. kolonia a kilka teryt id
                    // brany jest wtedy pierwszy teryt id jako ten podstawowy, lista wrzucona tutaj tak informacyjnie
                    // console.log('JEDEN RODZAJ MIEJSCOWOŚCI: ', wazename, 'rodz:', cols[2], 'id:', cols[3]); 
                    
                    // Dębina (woj. świętokrzyskie)    rodz: kolonia     id: 0268889+0269469
                    // Flaki (gm. Olesno)              rodz: osada       id: 0139962+0140008
                    // Gajówka Maziarze                rodz: osada leśna id: 0623008+0623296
                    // Gawrony (gm. Słupia)            rodz: kolonia     id: 0269498+0269370
                    // Hanus                           rodz: osada leśna id: 0764832+0764826
                    // Jasnowo                         rodz: kolonia     id: 0081607+0081760
                    // Kamionka (gm. Chojnice)         rodz: osada       id: 0081524+0082328
                    // Kolonia (pow. przysuski)        rodz: kolonia     id: 0633768+0632208
                    // Końce                           rodz: kolonia     id: 0015190+1022297
                    // Malinówka (woj. mazowieckie)    rodz: osada leśna id: 0514390+0514383
                    // Małachów (woj. świętokrzyskie)  rodz: wieś        id: 0244340+0243760
                    // Mosty (pow. kraśnicki)          rodz: osada leśna id: 0383930+0383923
                    // Motorzyny                       rodz: osada leśna id: 0643034+0643040
                    // Muły (pow. sejneński)           rodz: osada leśna id: 0757401+0757418
                    // Naddatki                        rodz: kolonia     id: 0015421+0015088+0015250
                    // Namule                          rodz: osada leśna id: 1026680+1026674
                    // Patków (pow. radomski)          rodz: osada leśna id: 0631090+0631083
                    // Przywieczerzyn                  rodz: wieś        id: 0865020+0865102
                    // Sajczyce (gm. Chełm)            rodz: osada leśna id: 0101563+0101570
                    // Stanisławów (pow. łowicki)      rodz: osada leśna id: 1039240+0724755
                    // Turka (gm. Brok)                rodz: osada leśna id: 0507101+0507118
                    // Wiłkokuk                        rodz: osada leśna id: 0757832+0757826
                    // Wykrot (gm. Kadzidło)           rodz: osada leśna id: 0511172+0511166
                    // Zagórze (gm. Słupia)            rodz: kolonia     id: 0269430+0269044
                    // Zaskoczyn                       rodz: osada       id: 0176360+0176354
                    // Zaścianek (woj. lubelskie)      rodz: kolonia     id: 1022541+0014999
                    // Łopata (pow. jędrzejowski)      rodz: kolonia     id: 0269104+0269191
                    // Łopuchówko                      rodz: osada leśna id: 0589866+0589872
                    // Śródlesie (woj. opolskie)       rodz: osada leśna id: 0491200+0491216                    
                }

            }

            //-------- 16 wyjątków poprawionych ręcznie, aby wszystkie nazwy były unikalne !!!
            //if (terytid == '0892725') wazename = 'Brzeziny (gm. Bełżec)';
            //if (terytid == '0551390') wazename = 'Brzeziny (gm. Rzeczyca)';
            //if (terytid == '1057516') wazename = 'Kamionka (gm. Nur)';
            //if (terytid == '0205647') wazename = 'Kamionka (gm. Ostrów Wielkopolski)';
            //if (terytid == '0388323') wazename = 'Kamionka (gm. Opole Lubelskie)';
            //if (terytid == '0492641') wazename = 'Kamionka (gm. Chrząstowice)';
            //if (terytid == '0877387') wazename = 'Lutynia (gm. Miękinia)';
            //if (terytid == '0590786') wazename = 'Lutynia (gm. Nowe Miasto nad Wartą)';
            //if (terytid == '0880892') wazename = 'Michałów (gm. Środa Śląska)';
            //if (terytid == '0590852') wazename = 'Michałów (gm. Nowe Miasto nad Wartą)';
            //if (terytid == '0904500') wazename = 'Rzeczyca (gm. Ulhówek)';
            //if (terytid == '0551527') wazename = 'Rzeczyca (gm. Rzeczyca)'; // ta wersja została ustalona przez CM-ów
            //if (terytid == '0517230') wazename = 'Zalesie (gm. Ostrów Mazowiecka)';
            //if (terytid == '0205825') wazename = 'Zalesie (gm. Ostrów Wielkopolski)';
            //if (terytid == '0909414') wazename = 'Łazy (gm. Gubin)';
            //if (terytid == '0358919') wazename = 'Łazy (gm. Rymanów)';
            //if (terytid == '0244340') wazename = 'Małachów (soł. Trzemoszna)';
            //if (terytid == '0243760') wazename = 'Małachów (woj. świętokrzyskie)';
            
            //------- dodatkowe wyjątki ustalone indywidalnie
            if (wazename == 'Józefów (pow. otwocki)' || terytid == '0920404')   wazename = 'Józefów';         // Józefów (pow. otwocki) 20k mieszkańców duże miasto w porównaniu do Józefów (pow. biłgorajski) 2k mieszkańców
            
            

            if (UNI_TERYT_CITIES[ wazename ] != null) {
                log += cols[3] + ': ' + wazename + '<br>';
            }

            // wyświetlanie na liście wg. typów
            var typ = 9999;
            if      (rodzaj == 'miasto')                  typ = 10;
            else if (rodzaj == 'wieś')                    typ = 20;
            else if (rodzaj == 'osada')                   typ = 30;
            else if (rodzaj == 'osada leśna')             typ = 40;
            else if (rodzaj == 'kolonia')                 typ = 50;
            else if (rodzaj == 'przysiółek')              typ = 60;
            else {
                if      (rodzaj.indexOf('miasto') >= 0)   typ = 11;
                else if (rodzaj.indexOf('wieś') >= 0)     typ = 21;
                else if (rodzaj.indexOf('osada') >= 0)    typ = 31;
            }

            // przywrócenie zapamiętanego statusu z localStorage skanowanej miejscowości
            var foundver = 0;
            if (saved[terytid] != null) {
                foundver = saved[terytid];
            }

			var dane = { nazwa:nazwa, rodzaj:rodzaj, posx:0, posy:0, foundver:foundver, terytid:terytid, wazename:wazename, woj:woj, pow:pow, typ:typ };
			bazaINDEX[terytid] = baza.length;
			baza.push(dane);

            if (ids[0] != undefined) { TERYT_CITIES[ ids[0] ] = 1; UNI_TERYT_CITIES[ wazename ] = 1; }
            if (ids[1] != undefined)   TERYT_CITIES[ ids[1] ] = 1;
            if (ids[2] != undefined)   TERYT_CITIES[ ids[2] ] = 1;
            if (ids[3] != undefined)   TERYT_CITIES[ ids[3] ] = 1;
            if (ids[4] != undefined)   TERYT_CITIES[ ids[4] ] = 1;
        }
    }

    TERYT_CITIES_Count     = 0;
    UNI_TERYT_CITIES_Count = 0;
    for(id in TERYT_CITIES)     { TERYT_CITIES_Count++; }
    for(id in UNI_TERYT_CITIES) { UNI_TERYT_CITIES_Count++; }
    TERYT_CITIES     = {};
    UNI_TERYT_CITIES = {};

    getId('skanermiejscowoscipl_log2').innerHTML += '<hr style="margin:0px; margin-bottom:0px;">';
    getId('skanermiejscowoscipl_log2').innerHTML += 'TERYT CITIES by FZ69617<br>';
    getId('skanermiejscowoscipl_log2').innerHTML +=     TERYT_CITIES_Count + ' miejscowości podstawowych<br>';
    getId('skanermiejscowoscipl_log2').innerHTML += UNI_TERYT_CITIES_Count + ' nazw unikalnych<br>';
    if (log != '') {
        getId('skanermiejscowoscipl_log2').innerHTML += '<br><b style="color:#C00000" ><u>Wykryto zdublowane nazwy(!)</u></b><br>';
        getId('skanermiejscowoscipl_log2').innerHTML += log;
        getId('skanermiejscowoscipl_log2').innerHTML += '<br>';
        getId('skanermiejscowoscipl_log2').innerHTML += 'Pobierz nowszy plik <b>waze-cities-wsp.csv</b><br>';
        getId('skanermiejscowoscipl_log2').innerHTML += '<u><a href=https://www.waze.com/forum/viewtopic.php?f=73&t=134267 target=_blank>Forum WAZE: Skaner Miejscowości PL - sprawdza brakujące miejscowości</a></u><br>';
    }
    getId('skanermiejscowoscipl_log2').innerHTML += '<hr style="margin:0px; margin-bottom:0px;">';
}
//--------------------------------------------------------------------------------------------------------
function read_wsp(rows) {
    
    var ok = false;
    
    for(var i=0; i<rows.length; i++) {
        var cols = rows[i].split('|');
        
        var terytid = cols[0];
        var mod     = cols[1];
        var x       = cols[2];
        var y       = cols[3];
        var nazwa   = cols[4];
        
        var index = bazaINDEX[terytid];
        if (index != null) {
            
            var pt = new OL.LonLat( x, y ).transform(epsg4326, epsg900913);
            x = pt.lon;
            y = pt.lat;

            baza[index].posx = x;
            baza[index].posy = y;
            
            ok = true;
        }
        
    }
    
    

    
    
    //wylistowanie miejscowości dla których nieznaleziono współrzędnych
    //for(var i=0; i<baza.length; i++) {
    //    if (baza[i].posx == 0 || baza[i].posy == 0) {
    //        console.log(baza[i].terytid, '|', baza[i].wazename, '|', baza[i].rodzaj);
    //    }
    //}
    
    
    //sortowanie wg. kategorii dopiero po wczytaniu współrzędnych ważne !!!
    baza.sort(function(a, b) {
        if (a.typ == b.typ) {
            if (a.wazename > b.wazename) return 1;
            if (a.wazename < b.wazename) return -1;
            return 0;
        }
        else return a.typ - b.typ;
    });
    
}
//--------------------------------------------------------------------------------------------------------
function load_waze_cities(f) {

    var reader = new FileReader();
    reader.onloadend = function(evt) {

        var rows = evt.target.result.split('\n');
        read_waze_cities(rows);

        if (skanerDB) {

            getId('skmpl_progress_info').innerHTML = lang.preparingdatabase;
            skanerDB.close();

            var req = window.indexedDB.deleteDatabase( skanerDataBaseName );
            req.onsuccess = function () {
                skanerdatabaseInit();

            };
            req.onerror = function () {
                getId('skmpl_progress_info').innerHTML = lang.dberrordelete;
            };
            req.onblocked = function () {
                getId('skmpl_progress_info').innerHTML = lang.dberrorlocked;
            };
        }

        //bazaSeqReadCounter = 0;
        //getId('skanermiejscowoscipl_lista').innerHTML = '';
        //setTimeout(skanermiejscowoscipl_LIST, 100);
    }

    reader.readAsText(f, 'utf-8');
}
//--------------------------------------------------------------------------------------------------------
function skanerdatabaseInit() {

    var openrequest = window.indexedDB.open( skanerDataBaseName, 1 );
    
    openrequest.onsuccess = function(event) {
        skanerDB = event.target.result;
        console.log("SkanerMiejscowosciPL.DataBase.Create.OK = ", openrequest.result.name );
        
        getId('skmpl_dbinfo').innerHTML = lang.dbversion + skanerDB.version;

        importPercent = -1;
        bazaSeqImportCounter = 0;
        setTimeout(skanermiejscowoscipl_SEQ_IMPORT, 100);
    };

    openrequest.onerror = function(event) {
    };

    openrequest.onupgradeneeded = function(event) { 
        var db = event.target.result;
        
        var newStore = db.createObjectStore("miejscowosci", { keyPath: "nr", autoIncrement: true });
        newStore.createIndex("id",        "id",         { unique: false });
        newStore.createIndex("text",      "text",       { unique: false });
        newStore.createIndex("woj",       "woj",        { unique: false });
        newStore.createIndex("pow",       "pow",        { unique: false });
    }
}
//--------------------------------------------------------------------------------------------------------
function load_waze_cities_wsp(f) {

    getId('skmpl_progress').className              = 'loading';
    getId('skmpl_progress_percent').style.minWidth = '0%';
    getId('skmpl_progress_percent').innerHTML      = '0%';
    getId('skmpl_progress_info').innerHTML         = lang.openingfile;

    getId('skanermiejscowoscipl_woj').disabled = true;
    getId('skanermiejscowoscipl_pow').disabled = true;

    var reader = new FileReader();
    reader.onloadend = function(evt) {

        var str = '';
        
        getId('skanermiejscowoscipl_button1').disabled = true;
        getId('skanermiejscowoscipl_run').disabled = true;

        var p1 = evt.target.result.indexOf('<TERYTCITIES>') + 13;
        var p2 = evt.target.result.indexOf('</TERYTCITIES>');
        if (p1 < p2) {
            str = evt.target.result.substr(p1, p2-p1);
            var rows = str.split('\n');
            read_waze_cities(rows);
        }

        var p1 = evt.target.result.indexOf('<WSP_MIEJSCOWOSCI_WGS>') + 18;
        var p2 = evt.target.result.indexOf('</WSP_MIEJSCOWOSCI_WGS>');
        if (p1 < p2) {
            str = evt.target.result.substr(p1, p2-p1);
            var rows = str.split('\n');
            read_wsp(rows);
        }
        
        str = '';
        
        if (skanerDB) {

            getId('skmpl_progress_info').innerHTML = lang.preparingdatabase;
            skanerDB.close();

            var req = window.indexedDB.deleteDatabase( skanerDataBaseName );
            req.onsuccess = function () {
                skanerdatabaseInit();

            };
            req.onerror = function () {
                getId('skmpl_progress_info').innerHTML = lang.dberrordelete;
            };
            req.onblocked = function () {
                getId('skmpl_progress_info').innerHTML = lang.dberrorlocked;
            };
        }


        //bazaSeqReadCounter = 0;
        //getId('skanermiejscowoscipl_lista').innerHTML = '';
        //setTimeout(skanermiejscowoscipl_LIST, 100);
        
    }

    reader.readAsText(f, 'utf-8');
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplFILESELECTOR(evt) {
    
    var files = evt.target.files;
    if (files.length == 0) return;
        
    var f = files[0];
    
    var blob = f.slice(0, 10000);
    var reader = new FileReader();

    reader.onloadend = function(evt) {
        var str = evt.target.result;
        
        bigF = f;
        bigOffset = 0;
        bigSize = f.size;
        bigName = f.name;
        bigLoaded = 0;
        bigReszta = '';
        bigRekordCounter = 0;
        bigData = '<WSP_MIEJSCOWOSCI_WGS>\r\n';

        if (f.name == 'waze-cities.csv' )           load_waze_cities(f);
        if (str.indexOf('<fme:miejscowosci') >= 0)  setTimeout(load_prng_miejscowosci, 100);
        if (str.indexOf('<TERYTCITIES>')     >= 0)  load_waze_cities_wsp(f);;
    };

    reader.readAsText(blob, 'utf-8');
}
//--------------------------------------------------------------------------------------------------------
function mouseoverPLACE(event) {
    var src  = event.target;
    var a    = src.id.split('_');
    
    if (a[0] == 'wsp') {
        var x    = parseInt( a[1] );
        var y    = parseInt( a[2] );
        var name = a[3];

        mouseoverID   = src.id;
        mouseoverNAME = name;
    
        var top  = this.offsetTop  /*+ this.offsetHeight*/;
        var left = this.offsetLeft /*+ this.offsetWidth*/;
        getId('skmpl_clipboard_container').style.top  = (top + 4)  + 'px';
        getId('skmpl_clipboard_container').style.left = (left - 8) + 'px';
    }
}
//--------------------------------------------------------------------------------------------------------
function mouseoutPLACE(event) {
    mouseoverID   = '';
    mouseoverNAME = '';
}
//--------------------------------------------------------------------------------------------------------
function gotoPLACE(event) {

    var WM = window.Waze.map;
	var OL = window.OpenLayers;

    var src  = event.target;
    var a    = src.id.split('_');
    if (a[0] == 'wsp') {
        var x    = parseInt( a[1] );
        var y    = parseInt( a[2] );
        var name = a[3];

        if (!run) {
            var xy = new OL.LonLat( x, y );
            WM.panTo(xy);
            WM.zoomTo(zoom);
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowoscipl_SEQ_IMPORT() {

    var BLOCK = 200;
    
    var savestores = new Array();
    for(var i=0; i<BLOCK; i++) savestores.push( 'miejscowosci' );
    
    var trx = skanerDB.transaction( savestores , 'readwrite');

    trx.oncomplete = function(event) {

        getId('skmpl_progress_info').innerHTML = lang.importeddata + bazaSeqImportCounter + ' / ' + baza.length;

        var percent = Math.round((bazaSeqImportCounter / baza.length) * 100);
        if (percent != importpercent) {
            importpercent = percent;
            getId('skmpl_progress_percent').style.minWidth = percent + '%';
            getId('skmpl_progress_percent').innerHTML      = percent + '%';
        }

        if (bazaSeqImportCounter < baza.length) {
            setTimeout(skanermiejscowoscipl_SEQ_IMPORT, 10);
        }
        else {
            getId('skanermiejscowoscipl_button1').disabled = false;
            getId('skanermiejscowoscipl_run').disabled = false;
            getId('skanermiejscowoscipl_woj').disabled = false;
            getId('skanermiejscowoscipl_pow').disabled = false;

            getId('skmpl_progress_info').innerHTML = lang.importeddata + bazaSeqImportCounter + ' / ' + baza.length;
            getId('skmpl_progress_percent').style.minWidth = '100%';
            getId('skmpl_progress_percent').innerHTML      = '100%';

            setTimeout(progressFadeOut, 2000);

            baza = [];
            bazaINDEX = {};
        }
    };
    trx.onerror = function(error) {
    };                

    for(var i=0; i<BLOCK; i++) {
        if (bazaSeqImportCounter < baza.length) {

            var M = baza[ bazaSeqImportCounter ];

            //utworzenie dodatkowego rekordu indeksu przechowującego nazwy LowerCase
            var text = M.wazename.toLowerCase();
            
            var item = { text:text, woj:M.woj, pow:M.pow, waze: M.wazename, id: M.terytid, typ:M.typ, rodz:M.rodzaj, x:M.posx, y:M.posy, fver:M.foundver, perm:0 };
            if (M.uwagi      != undefined) item.uw = M.uwagi;
            if (M.dontsearch == true)      item.ds = M.dontsearch;

            var store = trx.objectStore( 'miejscowosci' );
            store.put( item );
            
            bazaSeqImportCounter++;
        }
    }

}
//--------------------------------------------------------------------------------------------------------
function listuj(M) {

    var div = document.createElement('div');

    var COL1 = document.createElement('h1');
    if (M.rodzaj == 'miasto') var COL2 = document.createElement('h2');
    else                      var COL2 = document.createElement('h3');
    var COL3 = document.createElement('h4');
    var COL5 = document.createElement('h5');
    var HR   = document.createElement('hr');

    bazaSeqReadCounter++;

    COL1.innerHTML = bazaSeqReadCounter + ':';

    COL2.id = 'wsp_'  + parseInt(M.posx) + '_' + parseInt(M.posy) + '_' + M.wazename;
    COL5.id = 'perm_' + M.terytid;
    
    if (M.foundver == -1) {
        if (M.perm == 0) COL5.innerHTML += '<span class="skmpl_perm0"></span>';
        if (M.perm == 1) COL5.innerHTML += '<span class="skmpl_perm2"></span>';
    }
    else {
        if (M.perm == 0) COL5.innerHTML += '<span class="skmpl_perm0"></span>';
        if (M.perm == 1) COL5.innerHTML += '<span class="skmpl_perm1"></span>';
    }

    COL2.innerHTML = M.wazename;
    COL2.title = 'TERYT SIMC: ' + M.terytid;
    if (M.posx != 0 && M.posy != 0) {
        COL2.onclick = gotoPLACE;
    }
    COL2.onmouseover = mouseoverPLACE;
    COL2.onmouseout  = mouseoutPLACE;

    if (M.foundver == -1) COL2.style.color = '#C00000';
    if (M.foundver ==  1) COL2.style.color = '#008000';
    if (M.foundver ==  2) COL2.style.color = '#008000';
    if (M.foundver ==  3) COL2.style.color = '#008000';
    if (M.foundver ==  4) COL2.style.color = '#008000';


    if (M.rodzaj == 'miasto') COL3.innerHTML = '<b>' + M.rodzaj + '</b>';
    else                      COL3.innerHTML = M.rodzaj;

    if (M.posx == 0 || M.posy == 0) {
        COL1.innerHTML = '<b style="color: #FF6000; ">' + COL1.innerHTML + '</b>';
        COL2.innerHTML = '<b style="color: #FF6000; ">' + COL2.innerHTML + '</b><br><b style="color:#000000;">brak współrzędnych</b>';
        COL3.innerHTML = '<b style="color: #FF6000; ">' + COL3.innerHTML + '</b>';
    }
    
    if (M.uwagi != undefined) {
        var UWAGI = document.createElement('i');
        UWAGI.innerHTML   = '<br>' + M.uwagi;
        UWAGI.style.color = '#90B0FF';
        UWAGI.id = 'wsp_' + parseInt(M.posx) + '_' + parseInt(M.posy) + '_' + M.wazename;
        if (M.posx != 0 && M.posy != 0) {
            UWAGI.onclick = gotoPLACE;
        }
        UWAGI.onmouseover = mouseoverPLACE;
        UWAGI.onmouseout  = mouseoutPLACE;
        COL2.appendChild(UWAGI);
    }

    div.appendChild(COL1);
    div.appendChild(COL5);
    div.appendChild(COL2);
    div.appendChild(COL3);
    div.appendChild(HR);

    getId('skanermiejscowoscipl_lista').appendChild(div);
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowoscipl_LIST() {

    var towns = [];
    var shownames = getId('skanermiejscowoscipl_shownames').checked;
    var hide      = getId('skanermiejscowoscipl_hide').checked;
    var showedit  = getId('skanermiejscowoscipl_showedit').checked;
    
    var range, transaction, store, index, lower, upper;
    var searchmode = 0;
    
    if (searchtext != '') {
        searchmode = 1;
        lower = searchtext.toLowerCase();
        upper = searchtext.toLowerCase() + "\uffff";
        range = IDBKeyRange.bound( lower, upper );
        transaction = skanerDB.transaction(["miejscowosci"], "readonly");
        store = transaction.objectStore("miejscowosci");
        index = store.index("text");
    }
    else {
        if (powiat == '0000') {
            range = IDBKeyRange.only( wojewodztwo );
            transaction = skanerDB.transaction(["miejscowosci"], "readonly");
            store = transaction.objectStore("miejscowosci");
            index = store.index("woj");
        }
        else {
            range = IDBKeyRange.only( powiat );
            transaction = skanerDB.transaction(["miejscowosci"], "readonly");
            store = transaction.objectStore("miejscowosci");
            index = store.index("pow");
        }
    }

    remove_towns();

    getId('skanermiejscowoscipl_lista').innerHTML = '';
    getId('skanermiejscowoscipl_button1').disabled = true;
    getId('skanermiejscowoscipl_run').disabled = true;
    
    baza = [];
    bazaINDEX = {};
    bazaSeqReadCounter = 0;
    
    var baza02 = [];
    var baza04 = [];
    var baza06 = [];
    var baza08 = [];
    var baza10 = [];
    var baza12 = [];
    var baza14 = [];
    var baza16 = [];
    var baza18 = [];
    var baza20 = [];
    var baza22 = [];
    var baza24 = [];
    var baza26 = [];
    var baza28 = [];
    var baza30 = [];
    var baza32 = [];

    index.openCursor(range, "next").onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor && refresh==false) {

            var M = {};
            M.woj        = cursor.value.woj;
            M.pow        = cursor.value.pow;
            M.foundver   = cursor.value.fver;
            M.rodzaj     = cursor.value.rodz;
            M.wazename   = cursor.value.waze;
            M.terytid    = cursor.value.id;
            M.posx       = cursor.value.x;
            M.posy       = cursor.value.y;
            M.uwagi      = cursor.value.uw;
            M.dontsearch = cursor.value.ds;
            M.perm       = cursor.value.perm;



            // -----------------------------------------------------------------------------------------------
            // ręczna korekta współrzędnych i statusu dla miejscowości nie znalezionych w bazie PRNG
            // -----------------------------------------------------------------------------------------------
            if (M.terytid == '0996034') {
                var pt = new OL.LonLat( 17.02194, 51.45194 ).transform(epsg4326, epsg900913); // Bukołowo w woj. dolnoslaskim wg. http://zmigrod.e-mapa.net
                M.posx = pt.lon;
                M.posy = pt.lat;
            }

            if (M.terytid == '1029649') {
                var pt = new OL.LonLat( 18.73956, 52.55501 ).transform(epsg4326, epsg900913);  // Gawroniec (pow. radziejowski)  
                M.posx = pt.lon;
                M.posy = pt.lat;
            }

            if (M.terytid == '1062718') {
                var pt = new OL.LonLat( 18.87244, 52.67367 ).transform(epsg4326, epsg900913);   // Aleksandrowo (pow. włocławski)
                M.posx = pt.lon;
                M.posy = pt.lat;
                M.wazename = 'Aleksandrowo (pow. włocławski)';
                M.uwagi = 'osada Aleksandrówek (woj. kujawsko-pomorskie) już nie istnieje, teraz jest to Aleksandrowo (pow. włocławski) wg. http://brzesckujawski.e-mapa.net';
            }

            if (M.terytid == '1062546') {
                var pt = new OL.LonLat( 18.281664, 53.136603 ).transform(epsg4326, epsg900913);  // Bolmin (woj. kujawsko-pomorskie) 
                M.posx = pt.lon;
                M.posy = pt.lat;
                M.uwagi = 'nazwa historyczna, mapy nie pokazują tej osady';
                M.dontsearch = true;
            }

            if (M.terytid == '0850023') {
                var pt = new OL.LonLat( 19.41361, 52.71944 ).transform(epsg4326, epsg900913); // Seperunki : kolonia wsi       wg. http://tluchowo.e-mapa.net
                M.posx = pt.lon;
                M.posy = pt.lat;
            }

            if (M.terytid == '1023919') {
                var pt = new OL.LonLat( 23.1236994, 51.8673827 ).transform(epsg4326, epsg900913);  // Zagórek : kolonia w woj. lubelskim   
                M.posx = pt.lon;
                M.posy = pt.lat;
                M.uwagi = 'miejscowość wchłonięta przez Rossosz wg. http://rossosz.e-mapa.net';  
                M.dontsearch = true;
            }

            if (M.terytid == '1021837') {
                var pt = new OL.LonLat( 23.1361341, 52.1546097 ).transform(epsg4326, epsg900913);  // Głuchowo : kolonia w woj. lubelskim   
                M.posx = pt.lon;
                M.posy = pt.lat;
                M.uwagi = 'miejscowość nie istnieje wg. http://konstantynow.e-mapa.net';
                M.dontsearch = true;
            }

            if (M.terytid == '1004856') {
                M.uwagi = 'nieistniejąca już wieś w Polsce, zbiornik wodny w miejscu wsi';  // Barszów (niem. Barschau) – nieistniejąca już wieś w Polsce, która położona była w województwie dolnośląskim, w powiecie polkowickim, w gminie Polkowice.
                M.dontsearch = true;
                M.foundver   = 0;
            }

            if (M.terytid == '1040616') {
                M.uwagi = 'miejscowość nie istnieje, hałda kopalni Bełchatów';    // Piła Ruszczyńska miejscowość nie istnieje - hałda kopalni Bełchatów
                M.dontsearch = true;
                M.foundver   = 0;
            }

            if (M.terytid == '1006810') {
                M.uwagi = 'wieś zlikwidowana, teren kopalni';   // Sławęcinek (woj. wielkopolskie)
                M.dontsearch = true;
                M.foundver   = 0;
            }

            if (M.terytid == '1040622') {
                M.uwagi = 'miejscowość nie istnieje, hałda kopalni Bełchatów';  // Ruszczyn|wieś|miejscowość nie istnieje - hałda kopalni Bełchatów
                M.dontsearch = true;
                M.foundver   = 0;
            }

            if (M.terytid == '1042176') {
                M.uwagi = 'miejscowość nie istnieje, hałda kopalni Bełchatów';  // Seweryn|wieś|miejscowość nie istnieje - hałda kopalni Bełchatów
                M.dontsearch = true;
                M.foundver   = 0;
            }

            if (M.terytid == '1065059') {
                M.uwagi = 'miejscowość nie istnieje, brak zabudowy - teren kopalni';  // Biedrzychowice Górne - hałda kopalni
                M.dontsearch = true;
                M.foundver   = 0;
            }

            if (M.terytid == '0188883') {
                M.uwagi = 'miejscowość nie istnieje, teren kopalni';   // Rybarzowice (woj. dolnośląskie)
                M.dontsearch = true;
                M.foundver   = 0;
            }



            
            if ((hide==false || M.foundver <= 0) && (showedit==false || M.perm==1)) {

                if (shownames) {
                    if (M.dontsearch == true) towns.push({ x:M.posx, y:M.posy, name:M.wazename, foundver:M.foundver, grayed:true });
                    else                      towns.push({ x:M.posx, y:M.posy, name:M.wazename, foundver:M.foundver });
                }

                if (searchmode) {
                    if (M.woj == '02') baza02.push(M);
                    if (M.woj == '04') baza04.push(M);
                    if (M.woj == '06') baza06.push(M);
                    if (M.woj == '08') baza08.push(M);
                    if (M.woj == '10') baza10.push(M);
                    if (M.woj == '12') baza12.push(M);
                    if (M.woj == '14') baza14.push(M);
                    if (M.woj == '16') baza16.push(M);
                    if (M.woj == '18') baza18.push(M);
                    if (M.woj == '20') baza20.push(M);
                    if (M.woj == '22') baza22.push(M);
                    if (M.woj == '24') baza24.push(M);
                    if (M.woj == '26') baza26.push(M);
                    if (M.woj == '28') baza28.push(M);
                    if (M.woj == '30') baza30.push(M);
                    if (M.woj == '32') baza32.push(M);
                }
                else {
                    baza.push(M);
                    listuj(M);
                }
            }

            cursor.continue();
        }
        else {

            //listowanie i ułożenie wyników wyszukiwania województwami, gdy w polu wpisano miejscowość do wyszukania
            if (searchmode) {

                if (baza02.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. dolnośląskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza02.length; i++) {
                        var M = baza02[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza04.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. kujawsko-pomorskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza04.length; i++) {
                        var M = baza04[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza06.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. lubelskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza06.length; i++) {
                        var M = baza06[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza08.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. lubuskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza08.length; i++) {
                        var M = baza08[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza10.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. łódzkie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza10.length; i++) {
                        var M = baza10[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza12.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. małopolskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza12.length; i++) {
                        var M = baza12[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza14.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. mazowieckie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza14.length; i++) {
                        var M = baza14[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza16.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. opolskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza16.length; i++) {
                        var M = baza16[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza18.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. podkarpackie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza18.length; i++) {
                        var M = baza18[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza20.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. podalskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza20.length; i++) {
                        var M = baza20[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza22.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. pomorskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza22.length; i++) {
                        var M = baza22[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza24.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. śląskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza24.length; i++) {
                        var M = baza24[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza26.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. świętokrzyskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza26.length; i++) {
                        var M = baza26[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza28.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. warmińsko-mazurskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza28.length; i++) {
                        var M = baza28[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza30.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. wielkopolskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza30.length; i++) {
                        var M = baza30[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

                if (baza32.length) {
                    var div = document.createElement('div');
                    div.innerHTML = 'woj. zachodniopomorskie';
                    div.className = 'skmpl_woj';
                    getId('skanermiejscowoscipl_lista').appendChild(div);
                    
                    for(var i=0; i<baza32.length; i++) {
                        var M = baza32[i];
                        baza.push(M);
                        listuj( M );
                    }
                }

            }
            
            getId('skanermiejscowoscipl_button1').disabled = false;
            getId('skanermiejscowoscipl_run').disabled = false;

            show_towns(towns);
            busy = false;
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function progressFadeOut() {

    //sprawdzenie czy w czasie czekania na efekt transition nie rozpoczęto kolejnego importu
    //zezwolenie na zniknięcie paska postępu tylko wtedy, gdy proces importu został ukończony
    if (getId('skanermiejscowoscipl_button1').disabled == false) {
        getId('skmpl_progress').className = '';
    }
	
    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = getId('skanermiejscowoscipl_pow').value;
	refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplRUN() {
    getId('skanermiejscowoscipl_run').innerHTML              = 'Stop';
    getId('skanermiejscowoscipl_run').onclick                = skanermiejscowosciplSTOP;
    getId('skanermiejscowoscipl_run').style.backgroundColor  = '#FFC0C0';
    getId('skanermiejscowoscipl_button1').disabled            = true;
    
    var hide     = getId('skanermiejscowoscipl_hide').checked;
    var showedit = getId('skanermiejscowoscipl_showedit').checked;
    
    var WM = window.Waze.map;
	var OL = window.OpenLayers;
    
    // reset poprzedniego zaznaczenia
    if (scanID < baza.length) {
        var item  = baza[scanID];
        var mobj  = getId('wsp_' + parseInt(item.posx) + '_' + parseInt(item.posy) + '_' + item.wazename);
        if (mobj != null) mobj.style.backgroundColor = '';
    }

    // start od wyznaczonej pozycji
    scanID = parseInt( getId('skanermiejscowoscipl_offset').value ) - 1;
    if (scanID < 0)            scanID = 0;
    if (scanID >= baza.length) scanID = 0;

    while(scanID < baza.length) {
        var item = baza[scanID];
        if ((hide==false || item.foundver <= 0) && (showedit==false || item.perm==1)) break;
        scanID++;
    }

    if (scanID < baza.length) {
        var item = baza[scanID];
		baza[scanID].perm = 0;
        
        if (item.posx != 0 && item.posy != 0) {
            var xy = new OL.LonLat( item.posx, item.posy );
            WM.panTo(xy);
            WM.zoomTo(zoom);
        }

        var mobj  = getId('wsp_' + parseInt(item.posx) + '_' + parseInt(item.posy) + '_' + item.wazename);
        if (mobj != null) {
            mobj.style.backgroundColor = '#FFFF00';
        }
        
        var t = new Date();
        scantime = 0;
        
        kwadrat = 0;
        run = 1;
    }
    else {
        skanermiejscowosciplSTOP();
    }
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplSTOP() {
    getId('skanermiejscowoscipl_run').innerHTML              = 'Skanuj';
    getId('skanermiejscowoscipl_run').onclick                = skanermiejscowosciplRUN;
    getId('skanermiejscowoscipl_run').style.backgroundColor  = '';
    getId('skanermiejscowoscipl_button1').disabled            = false;
    
    run = 0;
}
//--------------------------------------------------------------------------------------------------------
function update_miejscowosc(terytid, foundver, perm, kwad) {
    
    var range = IDBKeyRange.only( terytid );
    var transaction = skanerDB.transaction(["miejscowosci"], "readwrite");
    var store = transaction.objectStore("miejscowosci");
    var index = store.index("id");

    index.openCursor(range, "next").onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            cursor.value.fver = foundver;
            if (kwad==0) cursor.value.perm = perm;
            cursor.update(cursor.value);
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplLOOP() {

    if (!busy && refresh) {
        busy = true;
        refresh = false;
        skanermiejscowoscipl_LIST();
        return;
    }
    
    searchcounter--;
    if (searchcounter == 0) {
        searchcounter = 99999999;
        skanermiejscowoscipl_SEARCHRUN();
    }
    
    //-------- inicjalizacja warstwy na której będą pokazywane nazwy miejscowości --------
    create_town_layer();

    var hide     = getId('skanermiejscowoscipl_hide').checked;
    var showedit = getId('skanermiejscowoscipl_showedit').checked;

    var ready = (ventCount==0);
    if (run && ready) {
        run = 0;

        var WM = window.Waze.map;
        var OL = window.OpenLayers;

        if(scanID < baza.length) {
            
            var item = baza[scanID];
            
            var testedCity1 = item.nazwa;
            var testedCity2 = item.nazwa + ' (woj. ';
            var testedCity3 = item.nazwa + ' (pow. ';
            var testedCity4 = item.nazwa + ' (gm. ';
            
            if (item.wazename != '') {
                var testedCity1 = item.wazename;
                var testedCity2 = item.wazename;
                var testedCity3 = item.wazename;
                var testedCity4 = item.wazename;
            }

            var mobj = getId('wsp_' + parseInt(item.posx) + '_' + parseInt(item.posy) + '_' + item.wazename);
            
            if (mobj != null) {

                mobj.style.backgroundColor = '';
                
                if (item.posx != 0 && item.posy != 0 && item.dontsearch==undefined && (hide==false || item.foundver <= 0) && (showedit==false || item.perm==1) ) {
    
                    //scentrowanie aktualnie sprawdzanej miejscowości na środku okna podczas skanowania, aby nie trzeba było scrollować ręcznie
                    var sidebarElem   = getId('sidebar');
                    var linksElem     = getId('links');
                    var parentdivElem = mobj.parentNode;
                    var sideH = sidebarElem.offsetHeight;
                    if (linksElem != undefined) sideH -= linksElem.offsetHeight;

                    var pofs  = parentdivElem.offsetTop;
                    var side1 = sidebarElem.scrollTop;
                    var side2 = sidebarElem.scrollTop + sideH;
                    
                    // po 10 sek. scroll wraca do pozycji podświetlenia, w ten sposób umożliwia przejechanie na górę i kliknięcie na stop, który jest niewidoczny
                    if (scantime == 0) {
                        prevScroll = sidebarElem.scrollTop;
                        var t = new Date();
                        scantime = t.getTime() - 100000;
                    }
                    if (sidebarElem.scrollTop != prevScroll) {
                        prevScroll = sidebarElem.scrollTop;
                        var t = new Date();
                        scantime = t.getTime();
                    }
                    else {
                        var t = new Date;
                        if ((pofs < side1 || pofs > side2) && (t.getTime() - scantime > 5000)) {
                            var scroll = pofs - 40;
                            if (scroll < 0) scroll = 0;
                            sidebarElem.scrollTop = scroll;
                            prevScroll = scroll;
                        }
                    }
                    
					var UW = window.Waze;
					var xy = new OL.Geometry.Point(item.posx, item.posy);
					
					for (var a=0; a < UW.model.userAreas.additionalInfo.length; a++) {
						for (var c=0; c < UW.model.userAreas.additionalInfo[a].geometry.components.length; c++) {
							if (UW.model.userAreas.additionalInfo[a].geometry.components[c].containsPoint(xy)) {
								baza[scanID].perm = 1;
							}
						}
					}
					

                    //sprawdzenie nazwy na mapie dla załadowanych segmentów
                    for (var seg in Waze.model.segments.objects) {
                        var segment    = Waze.model.segments.get(seg);
                        var attributes = segment.attributes;
                        var line       = getId(segment.geometry.id);
                        var segID      = attributes.id;

                        if (line !== null && segID !== null) {
						
							var roadcity = '';
                            var street = Waze.model.streets.get(attributes.primaryStreetID);
                            if (street != undefined) {
                                if (street.cityID != null) {
                                    var city = Waze.model.cities.get(street.cityID);
                                    roadcity = city.isEmpty ? '' : city.name;
                                }
                            }

                            if (roadcity == testedCity1)            { item.foundver = 1; break; }
                            if (roadcity.indexOf(testedCity2) == 0) { item.foundver = 2; break; }
                            if (roadcity.indexOf(testedCity3) == 0) { item.foundver = 3; break; }
                            if (roadcity.indexOf(testedCity4) == 0) { item.foundver = 4; break; }

                        }
                    }
					
                    if      (item.foundver == 1) {
                        mobj.style.color = '#008000';
                        saved [item.terytid]  = 1;
                        baza[scanID].foundver = 1;
                        update_miejscowosc(item.terytid, 1, baza[scanID].perm, kwadrat);
                    }
                    else if (item.foundver == 2) {
                        mobj.style.color = '#008000';
                        saved [item.terytid]  = 2;
                        baza[scanID].foundver = 2;
                        update_miejscowosc(item.terytid, 2, baza[scanID].perm, kwadrat);
                    }
                    else if (item.foundver == 3) {
                        mobj.style.color = '#008000';
                        saved [item.terytid]  = 3;
                        baza[scanID].foundver = 3;
                        update_miejscowosc(item.terytid, 3, baza[scanID].perm, kwadrat);
                    }
                    else if (item.foundver == 4) {
                        mobj.style.color = '#008000';
                        saved [item.terytid]  = 4;
                        baza[scanID].foundver = 4;
                        update_miejscowosc(item.terytid, 4, baza[scanID].perm, kwadrat);
                    }
                    else {
                        saved [item.terytid]  = -1;
                        baza[scanID].foundver = -1;
						update_miejscowosc(item.terytid, -1, baza[scanID].perm, kwadrat);

                        mobj.style.color = '#C00000';
                        mobj.style.backgroundColor = '#FFFF40';

                        //---gdy nie znależiono miejscowości w centralnym oknie szukanie dookoła "spiralnie" zgodnie z ruchem wskazówek zegara
                        var W = WM.getSize().w;
                        var H = WM.getSize().h;

                        kwadrat++;

                        if (kwadrat == 1)  { WM.pan(  W,  0); run=1; return; }      // 1 spirala = 1 środkowy + 8 "kwadratów" po bokach wystarczy do poszukiwań
                        if (kwadrat == 2)  { WM.pan(  0,  H); run=1; return; }
                        if (kwadrat == 3)  { WM.pan( -W,  0); run=1; return; }
                        if (kwadrat == 4)  { WM.pan( -W,  0); run=1; return; }
                        if (kwadrat == 5)  { WM.pan(  0, -H); run=1; return; }
                        if (kwadrat == 6)  { WM.pan(  0, -H); run=1; return; }
                        if (kwadrat == 7)  { WM.pan(  W,  0); run=1; return; }
                        if (kwadrat == 8)  { WM.pan(  W,  0); run=1; return; }

                        //if (kwadrat == 9)  { WM.pan(  W,  0); run=1; return; }    // 2 spirala
                        //if (kwadrat == 10) { WM.pan(  0,  H); run=1; return; }
                        //if (kwadrat == 11) { WM.pan(  0,  H); run=1; return; }
                        //if (kwadrat == 12) { WM.pan(  0,  H); run=1; return; }
                        //if (kwadrat == 13) { WM.pan( -W,  0); run=1; return; }
                        //if (kwadrat == 14) { WM.pan( -W,  0); run=1; return; }
                        //if (kwadrat == 15) { WM.pan( -W,  0); run=1; return; }
                        //if (kwadrat == 16) { WM.pan( -W,  0); run=1; return; }
                        //if (kwadrat == 17) { WM.pan(  0, -H); run=1; return; }
                        //if (kwadrat == 18) { WM.pan(  0, -H); run=1; return; }
                        //if (kwadrat == 19) { WM.pan(  0, -H); run=1; return; }
                        //if (kwadrat == 20) { WM.pan(  0, -H); run=1; return; }
                        //if (kwadrat == 21) { WM.pan(  W,  0); run=1; return; }
                        //if (kwadrat == 22) { WM.pan(  W,  0); run=1; return; }
                        //if (kwadrat == 23) { WM.pan(  W,  0); run=1; return; }
                        //if (kwadrat == 24) { WM.pan(  W,  0); run=1; return; }

                        mobj.style.backgroundColor = '';
                        mobj.style.color = '#C00000';
                    }
                }
            }
            
            var h5obj = getId( 'perm_' + item.terytid );

            if (baza[scanID].foundver == -1) {
                if (baza[scanID].perm == 0) h5obj.innerHTML = '<span class="skmpl_perm0"></span>';
                if (baza[scanID].perm == 1) h5obj.innerHTML = '<span class="skmpl_perm2"></span>';
            }
            else {
                if (baza[scanID].perm == 0) h5obj.innerHTML = '<span class="skmpl_perm0"></span>';
                if (baza[scanID].perm == 1) h5obj.innerHTML = '<span class="skmpl_perm1"></span>';
            }

            //pobranie następnego elementu z bazy
            while(++scanID < baza.length) {
                var item = baza[scanID];
                if ((hide==false || item.foundver <= 0) && (showedit==false || item.perm==1)) break;
            }

            if (scanID < baza.length) {
                var item = baza[scanID];
				baza[scanID].perm = 0;

                if (item.posx != 0 && item.posy != 0) {
                    var xy = new OL.LonLat( item.posx, item.posy );
                    WM.panTo(xy);
                    WM.zoomTo(zoom);
                }

                var mobj  = getId('wsp_' + parseInt(item.posx) + '_' + parseInt(item.posy) + '_' + item.wazename);
                if (mobj != null) mobj.style.backgroundColor = '#FFFF00';

                kwadrat = 0;
                run = 1;
            }
            else {
                skanermiejscowosciplSTOP();
                scanID = 0;
            }
        }
        else {
            skanermiejscowosciplSTOP();
            scanID = 0;
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function remove_towns() {

    var WM = window.Waze.map;
    var OL = window.OpenLayers;
    
    var mlayers = WM.getLayersBy("uniqueName","__SkanerMiejscowosciPL");
    var townLayer = mlayers[0];
    
    if (townLayer != undefined) {
        townLayer.removeAllFeatures();
    }
}
//--------------------------------------------------------------------------------------------------------
function show_towns( towns ) {
    
    if (towns.length == 0) return;
    
    var WM = window.Waze.map;
	var OL = window.OpenLayers;

	var mlayers = WM.getLayersBy("uniqueName","__SkanerMiejscowosciPL");
	var townLayer = mlayers[0];
    if (townLayer == undefined) return;

    var lineFeatures  = [];
    
    var koloruj = getId('skanermiejscowoscipl_koloruj').checked;

	while (towns.length) {
        
        var mark     = towns.shift();
        var x        = mark.x;
        var y        = mark.y;
        var name     = mark.name;
        var grayed   = mark.grayed;
		var foundver = mark.foundver;
        
        var p1 = new OL.Geometry.Point(x, y)
        var p2 = new OL.Geometry.Point(x, y)

        var points = [p1, p2];
        var line = new OL.Geometry.LineString( points );
		
		var kolor = '#c75bff';
		if (koloruj && foundver >=  1) kolor = '#00AA00';
		if (koloruj && foundver == -1) kolor = '#ff3480';
		if (grayed == true) kolor = '#A0A0A0';
        
		var lineFeature = new OL.Feature.Vector(line, { labelText: name, labelColor: kolor } );
        lineFeatures.push(lineFeature);
    }

    townLayer.addFeatures(lineFeatures);
}
//--------------------------------------------------------------------------------------------------------
function create_town_layer() {
    
    var WM = window.Waze.map;
	var OL = window.OpenLayers;
    
    var mlayers = WM.getLayersBy("uniqueName","__SkanerMiejscowosciPL");
    if (mlayers.length == 0) {

        var drc_style = new OL.Style({
            strokeDashstyle: 'solid',
            strokeColor : '#000000',
            strokeOpacity: 0.0,
            strokeWidth: 0,
            fillColor: '#000000',
            fillOpacity: 0,
            pointRadius: 0,
            label : '${labelText}',
            fontFamily: 'Verdana',
            labelOutlineColor: '#FFFFFF',
            labelOutlineWidth: '3',
            fontColor: '${labelColor}',
            fontOpacity: 1.0,
            fontWeight: 'bold',
            fontSize: '10px',
            display: 'block'
        });

        var drc_mapLayer = new OL.Layer.Vector("Skaner Miejscowości PL", {
            displayInLayerSwitcher: true,
            styleMap: new OL.StyleMap(drc_style),
            uniqueName: "__SkanerMiejscowosciPL"
        });

        I18n.translations.en.layers.name["__SkanerMiejscowosciPL"] = "Skaner Miejscowości PL";
        WM.addLayer(drc_mapLayer);
        drc_mapLayer.setVisibility(true);

    }
}
//--------------------------------------------------------------------------------------------------------
function updatenames() {
    
    var shownames = getId('skanermiejscowoscipl_shownames').checked;
    
    remove_towns();

    if (shownames) {
        var towns = [];
        for(var i=0; i<baza.length; i++) {
            var M = baza[i];
			if (M.dontsearch == true) towns.push({ x:M.posx, y:M.posy, name:M.wazename, foundver:M.foundver, grayed:true });
			else                      towns.push({ x:M.posx, y:M.posy, name:M.wazename, foundver:M.foundver });
        }
        show_towns(towns);
    }
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplSHOWNAMES() {
    
    setTimeout(updatenames, 200);
}
//--------------------------------------------------------------------------------------------------------
function tworz_liste_wojewodztw() {
    var html = '';
    html +=     '<option value="02">02: woj. dolnośląskie</option>';
    html +=     '<option value="04">04: woj. kujawsko-pomorskie</option>';
    html +=     '<option value="06">06: woj. lubelskie</option>';
    html +=     '<option value="08">08: woj. lubuskie</option>';
    html +=     '<option value="10">10: woj. łódzkie</option>';
    html +=     '<option value="12">12: woj. małopolskie</option>';
    html +=     '<option value="14">14: woj. mazowieckie</option>';
    html +=     '<option value="16">16: woj. opolskie</option>';
    html +=     '<option value="18">18: woj. podkarpackie</option>';
    html +=     '<option value="20">20: woj. podlaskie</option>';
    html +=     '<option value="22">22: woj. pomorskie</option>';
    html +=     '<option value="24">24: woj. śląskie</option>';
    html +=     '<option value="26">26: woj. świętokrzyskie</option>';
    html +=     '<option value="28">28: woj. warmińsko-mazurskie</option>';
    html +=     '<option value="30">30: woj. wielkopolskie</option>';
    html +=     '<option value="32">32: woj. zachodniopomorskie</option>';
    
    if (wojewodztwo < '02') wojewodztwo = '02';
    if (wojewodztwo > '32') wojewodztwo = '32';
    
    getId('skanermiejscowoscipl_woj').innerHTML = html;
    getId('skanermiejscowoscipl_woj').value = wojewodztwo;
    getId('skanermiejscowoscipl_pow').value = powiat;
}
//--------------------------------------------------------------------------------------------------------
function tworz_liste_powiatow() {
    
    var woj = getId('skanermiejscowoscipl_woj').value; 
    var obj = getId('skanermiejscowoscipl_pow');
    
    var str = '';
    if (woj == '02') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="0201">0201: bolesławiecki</option><option value="0202">0202: dzierżoniowski</option><option value="0203">0203: głogowski</option><option value="0204">0204: górowski</option><option value="0205">0205: jaworski</option><option value="0206">0206: jeleniogórski</option><option value="0207">0207: kamiennogórski</option><option value="0208">0208: kłodzki</option><option value="0209">0209: legnicki</option><option value="0210">0210: lubański</option><option value="0211">0211: lubiński</option><option value="0212">0212: lwówecki</option><option value="0213">0213: milicki</option><option value="0214">0214: oleśnicki</option><option value="0215">0215: oławski</option><option value="0216">0216: polkowicki</option><option value="0217">0217: strzeliński</option><option value="0218">0218: średzki</option><option value="0219">0219: świdnicki</option><option value="0220">0220: trzebnicki</option><option value="0221">0221: wałbrzyski</option><option value="0222">0222: wołowski</option><option value="0223">0223: wrocławski</option><option value="0224">0224: ząbkowicki</option><option value="0225">0225: zgorzelecki</option><option value="0226">0226: złotoryjski</option><option value="0261">0261: Jelenia Góra</option><option value="0262">0262: Legnica</option><option value="0264">0264: Wrocław</option><option value="0265">0265: Wałbrzych</option>';
    if (woj == '04') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="0401">0401: aleksandrowski</option><option value="0402">0402: brodnicki</option><option value="0403">0403: bydgoski</option><option value="0404">0404: chełmiński</option><option value="0405">0405: golubsko-dobrzyński</option><option value="0406">0406: grudziądzki</option><option value="0407">0407: inowrocławski</option><option value="0408">0408: lipnowski</option><option value="0409">0409: mogileński</option><option value="0410">0410: nakielski</option><option value="0411">0411: radziejowski</option><option value="0412">0412: rypiński</option><option value="0413">0413: sępoleński</option><option value="0414">0414: świecki</option><option value="0415">0415: toruński</option><option value="0416">0416: tucholski</option><option value="0417">0417: wąbrzeski</option><option value="0418">0418: włocławski</option><option value="0419">0419: żniński</option><option value="0461">0461: Bydgoszcz</option><option value="0462">0462: Grudziądz</option><option value="0463">0463: Toruń</option><option value="0464">0464: Włocławek</option>';
    if (woj == '06') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="0601">0601: bialski</option><option value="0602">0602: biłgorajski</option><option value="0603">0603: chełmski</option><option value="0604">0604: hrubieszowski</option><option value="0605">0605: janowski</option><option value="0606">0606: krasnostawski</option><option value="0607">0607: kraśnicki</option><option value="0608">0608: lubartowski</option><option value="0609">0609: lubelski</option><option value="0610">0610: łęczyński</option><option value="0611">0611: łukowski</option><option value="0612">0612: opolski</option><option value="0613">0613: parczewski</option><option value="0614">0614: puławski</option><option value="0615">0615: radzyński</option><option value="0616">0616: rycki</option><option value="0617">0617: świdnicki</option><option value="0618">0618: tomaszowski</option><option value="0619">0619: włodawski</option><option value="0620">0620: zamojski</option><option value="0661">0661: Biała Podlaska</option><option value="0662">0662: Chełm</option><option value="0663">0663: Lublin</option><option value="0664">0664: Zamość</option>';
    if (woj == '08') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="0801">0801: gorzowski</option><option value="0802">0802: krośnieński</option><option value="0803">0803: międzyrzecki</option><option value="0804">0804: nowosolski</option><option value="0805">0805: słubicki</option><option value="0806">0806: strzelecko-drezdenecki</option><option value="0807">0807: sulęciński</option><option value="0808">0808: świebodziński</option><option value="0809">0809: zielonogórski</option><option value="0810">0810: żagański</option><option value="0811">0811: żarski</option><option value="0812">0812: wschowski</option><option value="0861">0861: Gorzów Wielkopolski</option><option value="0862">0862: Zielona Góra</option>';
    if (woj == '10') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="1001">1001: bełchatowski</option><option value="1002">1002: kutnowski</option><option value="1003">1003: łaski</option><option value="1004">1004: łęczycki</option><option value="1005">1005: łowicki</option><option value="1006">1006: łódzki wschodni</option><option value="1007">1007: opoczyński</option><option value="1008">1008: pabianicki</option><option value="1009">1009: pajęczański</option><option value="1010">1010: piotrkowski</option><option value="1011">1011: poddębicki</option><option value="1012">1012: radomszczański</option><option value="1013">1013: rawski</option><option value="1014">1014: sieradzki</option><option value="1015">1015: skierniewicki</option><option value="1016">1016: tomaszowski</option><option value="1017">1017: wieluński</option><option value="1018">1018: wieruszowski</option><option value="1019">1019: zduńskowolski</option><option value="1020">1020: zgierski</option><option value="1021">1021: brzeziński</option><option value="1061">1061: Łódź</option><option value="1062">1062: Piotrków Trybunalski</option><option value="1063">1063: Skierniewice</option>';
    if (woj == '12') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="1201">1201: bocheński</option><option value="1202">1202: brzeski</option><option value="1203">1203: chrzanowski</option><option value="1204">1204: dąbrowski</option><option value="1205">1205: gorlicki</option><option value="1206">1206: krakowski</option><option value="1207">1207: limanowski</option><option value="1208">1208: miechowski</option><option value="1209">1209: myślenicki</option><option value="1210">1210: nowosądecki</option><option value="1211">1211: nowotarski</option><option value="1212">1212: olkuski</option><option value="1213">1213: oświęcimski</option><option value="1214">1214: proszowicki</option><option value="1215">1215: suski</option><option value="1216">1216: tarnowski</option><option value="1217">1217: tatrzański</option><option value="1218">1218: wadowicki</option><option value="1219">1219: wielicki</option><option value="1261">1261: Kraków</option><option value="1262">1262: Nowy Sącz</option><option value="1263">1263: Tarnów</option>';
    if (woj == '14') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="1401">1401: białobrzeski</option><option value="1402">1402: ciechanowski</option><option value="1403">1403: garwoliński</option><option value="1404">1404: gostyniński</option><option value="1405">1405: grodziski</option><option value="1406">1406: grójecki</option><option value="1407">1407: kozienicki</option><option value="1408">1408: legionowski</option><option value="1409">1409: lipski</option><option value="1410">1410: łosicki</option><option value="1411">1411: makowski</option><option value="1412">1412: miński</option><option value="1413">1413: mławski</option><option value="1414">1414: nowodworski</option><option value="1415">1415: ostrołęcki</option><option value="1416">1416: ostrowski</option><option value="1417">1417: otwocki</option><option value="1418">1418: piaseczyński</option><option value="1419">1419: płocki</option><option value="1420">1420: płoński</option><option value="1421">1421: pruszkowski</option><option value="1422">1422: przasnyski</option><option value="1423">1423: przysuski</option><option value="1424">1424: pułtuski</option><option value="1425">1425: radomski</option><option value="1426">1426: siedlecki</option><option value="1427">1427: sierpecki</option><option value="1428">1428: sochaczewski</option><option value="1429">1429: sokołowski</option><option value="1430">1430: szydłowiecki</option><option value="1432">1432: warszawski zachodni</option><option value="1433">1433: węgrowski</option><option value="1434">1434: wołomiński</option><option value="1435">1435: wyszkowski</option><option value="1436">1436: zwoleński</option><option value="1437">1437: żuromiński</option><option value="1438">1438: żyrardowski</option><option value="1461">1461: Ostrołęka</option><option value="1462">1462: Płock</option><option value="1463">1463: Radom</option><option value="1464">1464: Siedlce</option><option value="1465">1465: Warszawa</option>';
    if (woj == '16') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="1601">1601: brzeski</option><option value="1602">1602: głubczycki</option><option value="1603">1603: kędzierzyńsko-kozielski</option><option value="1604">1604: kluczborski</option><option value="1605">1605: krapkowicki</option><option value="1606">1606: namysłowski</option><option value="1607">1607: nyski</option><option value="1608">1608: oleski</option><option value="1609">1609: opolski</option><option value="1610">1610: prudnicki</option><option value="1611">1611: strzelecki</option><option value="1661">1661: Opole</option>';
    if (woj == '18') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="1801">1801: bieszczadzki</option><option value="1802">1802: brzozowski</option><option value="1803">1803: dębicki</option><option value="1804">1804: jarosławski</option><option value="1805">1805: jasielski</option><option value="1806">1806: kolbuszowski</option><option value="1807">1807: krośnieński</option><option value="1808">1808: leżajski</option><option value="1809">1809: lubaczowski</option><option value="1810">1810: łańcucki</option><option value="1811">1811: mielecki</option><option value="1812">1812: niżański</option><option value="1813">1813: przemyski</option><option value="1814">1814: przeworski</option><option value="1815">1815: ropczycko-sędziszowski</option><option value="1816">1816: rzeszowski</option><option value="1817">1817: sanocki</option><option value="1818">1818: stalowowolski</option><option value="1819">1819: strzyżowski</option><option value="1820">1820: tarnobrzeski</option><option value="1821">1821: leski</option><option value="1861">1861: Krosno</option><option value="1862">1862: Przemyśl</option><option value="1863">1863: Rzeszów</option><option value="1864">1864: Tarnobrzeg</option>';
    if (woj == '20') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="2001">2001: augustowski</option><option value="2002">2002: białostocki</option><option value="2003">2003: bielski</option><option value="2004">2004: grajewski</option><option value="2005">2005: hajnowski</option><option value="2006">2006: kolneński</option><option value="2007">2007: łomżyński</option><option value="2008">2008: moniecki</option><option value="2009">2009: sejneński</option><option value="2010">2010: siemiatycki</option><option value="2011">2011: sokólski</option><option value="2012">2012: suwalski</option><option value="2013">2013: wysokomazowiecki</option><option value="2014">2014: zambrowski</option><option value="2061">2061: Białystok</option><option value="2062">2062: Łomża</option><option value="2063">2063: Suwałki</option>';
    if (woj == '22') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="2201">2201: bytowski</option><option value="2202">2202: chojnicki</option><option value="2203">2203: człuchowski</option><option value="2204">2204: gdański</option><option value="2205">2205: kartuski</option><option value="2206">2206: kościerski</option><option value="2207">2207: kwidzyński</option><option value="2208">2208: lęborski</option><option value="2209">2209: malborski</option><option value="2210">2210: nowodworski</option><option value="2211">2211: pucki</option><option value="2212">2212: słupski</option><option value="2213">2213: starogardzki</option><option value="2214">2214: tczewski</option><option value="2215">2215: wejherowski</option><option value="2216">2216: sztumski</option><option value="2261">2261: Gdańsk</option><option value="2262">2262: Gdynia</option><option value="2263">2263: Słupsk</option><option value="2264">2264: Sopot</option>';
    if (woj == '24') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="2401">2401: będziński</option><option value="2402">2402: bielski</option><option value="2403">2403: cieszyński</option><option value="2404">2404: częstochowski</option><option value="2405">2405: gliwicki</option><option value="2406">2406: kłobucki</option><option value="2407">2407: lubliniecki</option><option value="2408">2408: mikołowski</option><option value="2409">2409: myszkowski</option><option value="2410">2410: pszczyński</option><option value="2411">2411: raciborski</option><option value="2412">2412: rybnicki</option><option value="2413">2413: tarnogórski</option><option value="2414">2414: bieruńsko-lędziński</option><option value="2415">2415: wodzisławski</option><option value="2416">2416: zawierciański</option><option value="2417">2417: żywiecki</option><option value="2461">2461: Bielsko-Biała</option><option value="2462">2462: Bytom</option><option value="2463">2463: Chorzów</option><option value="2464">2464: Częstochowa</option><option value="2465">2465: Dąbrowa Górnicza</option><option value="2466">2466: Gliwice</option><option value="2467">2467: Jastrzębie-Zdrój</option><option value="2468">2468: Jaworzno</option><option value="2469">2469: Katowice</option><option value="2470">2470: Mysłowice</option><option value="2471">2471: Piekary Śląskie</option><option value="2472">2472: Ruda Śląska</option><option value="2473">2473: Rybnik</option><option value="2474">2474: Siemianowice Śląskie</option><option value="2475">2475: Sosnowiec</option><option value="2476">2476: Świętochłowice</option><option value="2477">2477: Tychy</option><option value="2478">2478: Zabrze</option><option value="2479">2479: Żory</option>';
    if (woj == '26') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="2601">2601: buski</option><option value="2602">2602: jędrzejowski</option><option value="2603">2603: kazimierski</option><option value="2604">2604: kielecki</option><option value="2605">2605: konecki</option><option value="2606">2606: opatowski</option><option value="2607">2607: ostrowiecki</option><option value="2608">2608: pińczowski</option><option value="2609">2609: sandomierski</option><option value="2610">2610: skarżyski</option><option value="2611">2611: starachowicki</option><option value="2612">2612: staszowski</option><option value="2613">2613: włoszczowski</option><option value="2661">2661: Kielce</option>';
    if (woj == '28') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="2801">2801: bartoszycki</option><option value="2802">2802: braniewski</option><option value="2803">2803: działdowski</option><option value="2804">2804: elbląski</option><option value="2805">2805: ełcki</option><option value="2806">2806: giżycki</option><option value="2807">2807: iławski</option><option value="2808">2808: kętrzyński</option><option value="2809">2809: lidzbarski</option><option value="2810">2810: mrągowski</option><option value="2811">2811: nidzicki</option><option value="2812">2812: nowomiejski</option><option value="2813">2813: olecki</option><option value="2814">2814: olsztyński</option><option value="2815">2815: ostródzki</option><option value="2816">2816: piski</option><option value="2817">2817: szczycieński</option><option value="2818">2818: gołdapski</option><option value="2819">2819: węgorzewski</option><option value="2861">2861: Elbląg</option><option value="2862">2862: Olsztyn</option>';
    if (woj == '30') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="3001">3001: chodzieski</option><option value="3002">3002: czarnkowsko-trzcianecki</option><option value="3003">3003: gnieźnieński</option><option value="3004">3004: gostyński</option><option value="3005">3005: grodziski</option><option value="3006">3006: jarociński</option><option value="3007">3007: kaliski</option><option value="3008">3008: kępiński</option><option value="3009">3009: kolski</option><option value="3010">3010: koniński</option><option value="3011">3011: kościański</option><option value="3012">3012: krotoszyński</option><option value="3013">3013: leszczyński</option><option value="3014">3014: międzychodzki</option><option value="3015">3015: nowotomyski</option><option value="3016">3016: obornicki</option><option value="3017">3017: ostrowski</option><option value="3018">3018: ostrzeszowski</option><option value="3019">3019: pilski</option><option value="3020">3020: pleszewski</option><option value="3021">3021: poznański</option><option value="3022">3022: rawicki</option><option value="3023">3023: słupecki</option><option value="3024">3024: szamotulski</option><option value="3025">3025: średzki</option><option value="3026">3026: śremski</option><option value="3027">3027: turecki</option><option value="3028">3028: wągrowiecki</option><option value="3029">3029: wolsztyński</option><option value="3030">3030: wrzesiński</option><option value="3031">3031: złotowski</option><option value="3061">3061: Kalisz</option><option value="3062">3062: Konin</option><option value="3063">3063: Leszno</option><option value="3064">3064: Poznań</option>';
    if (woj == '32') str = '<select id="skanermiejscowoscipl_pow" style="margin-top: 10px; margin-bottom: 10px;" title="Wybierz powiat"><option value="0000">wszystkie powiaty</option><option value="3201">3201: białogardzki</option><option value="3202">3202: choszczeński</option><option value="3203">3203: drawski</option><option value="3204">3204: goleniowski</option><option value="3205">3205: gryficki</option><option value="3206">3206: gryfiński</option><option value="3207">3207: kamieński</option><option value="3208">3208: kołobrzeski</option><option value="3209">3209: koszaliński</option><option value="3210">3210: myśliborski</option><option value="3211">3211: policki</option><option value="3212">3212: pyrzycki</option><option value="3213">3213: sławieński</option><option value="3214">3214: stargardzki</option><option value="3215">3215: szczecinecki</option><option value="3216">3216: świdwiński</option><option value="3217">3217: wałecki</option><option value="3218">3218: łobeski</option><option value="3261">3261: Koszalin</option><option value="3262">3262: Szczecin</option><option value="3263">3263: Świnoujście</option>';
    
    var html = '';
    var opt = str.split('<option');
    for(var i=1; i<opt.length; i++) {
        html += '<option' + opt[i];
    }

    if (powiat < '0000') powiat = '0000';
    if (powiat > '9999') powiat = '0000';
    
    getId('skanermiejscowoscipl_pow').innerHTML = html;
    getId('skanermiejscowoscipl_pow').value = powiat;
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplWOJ(event) {

    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = wojewodztwo + '01';
    tworz_liste_powiatow();

    searchtext = '';
    getId('skanermiejscowoscipl_search').value = '';
    refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplPOW() {
    
    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = getId('skanermiejscowoscipl_pow').value;

    searchtext = '';
    getId('skanermiejscowoscipl_search').value = '';
    refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplHIDE() {
    
    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = getId('skanermiejscowoscipl_pow').value;

    refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplSHOWEDIT() {

    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = getId('skanermiejscowoscipl_pow').value;
    
    refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplENTER(e) {
    
    if (!e) e = window.event;
    
    if (e.keyCode == 13) {
        if (run==0) {
            if (getId('skanermiejscowoscipl_run').disabled == false) {
                skanermiejscowosciplRUN();
            }
        }
    }
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplSEARCH() {

    //---------czeka 2 sek. od wpisania ostatniego znaku po czym rozpoczyna przeszukiwanie bazy i wyświetlanie wyników wyszukania tzw. "opóźniacz"
    searchcounter = parseInt(1000 / LOOPTIME);
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowoscipl_SEARCHRUN() {

    //właściwa funkcja przeszukująca
    searchtext = getId('skanermiejscowoscipl_search').value;
    refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function tabclick() {
    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = getId('skanermiejscowoscipl_pow').value;
    
	if (getId('skanermiejscowoscipl_lista').innerHTML == '') {
		refresh = true;
	}
}
//--------------------------------------------------------------------------------------------------------
function skanermiejscowosciplKOLORUJ() {
    wojewodztwo = getId('skanermiejscowoscipl_woj').value;
    powiat      = getId('skanermiejscowoscipl_pow').value;
    refresh = true;
}
//--------------------------------------------------------------------------------------------------------
function initialiseSkanerMiejscowosciPL()
{
    var addon       = document.createElement('section');
	addon.id        = "skanermiejscowoscipl-addon";
    addon.innerHTML = ''
    + '<div style="margin-bottom: 5px;"><b style="margin:0px; padding:0px;"><a href="https://greasyfork.org/pl/scripts/8765-skaner-miejscowosci-pl" target="_blank"><u>Skaner Miejscowości PL</u></a></b> &nbsp; v' + wmech_version + '</div>'
    + '<button title="waze-cities-wsp.csv"     id=skanermiejscowoscipl_button1 class="btn btn-default" style="margin: 0px; ">Importuj plik...</button> &nbsp; '
    + '<br>'
    + '<div style="text-align: center; xborder: solid 1px #c0c0c0; xborder-radius: 4px; ">'
    +     '<div id=skmpl_dbinfo style="text-align: left; " ></div>'
    +     '<div id=skmpl_progress style="margin-top: 0px; ">'
    +         '<br>'
    +         '<div id=skmpl_progress_bar><div id=skmpl_progress_percent>0%</div></div>'
    +         '<div id=skmpl_progress_info></div>'
    +         '<div id=skanermiejscowoscipl_log2   style="font-family: Tahoma; font-size: 11px; " ></div>'
    +         '<br>'
    +     '</div>'
    + '</div>'
    + '<select id=skanermiejscowoscipl_woj style="margin-top: 10px; margin-bottom: 0px;"  title="Wybierz województwo" >'
    + '</select>'
    + '<br>'
    + '<select id=skanermiejscowoscipl_pow style="margin-top: 10px; margin-bottom: 10px;"  title="Wybierz powiat" >'
    + '</select>'
    + '<br>'
    + '<div style="margin-top: 0px; margin-bottom: 0px;" >'
    +     'Skanuj od pozycji: <input id=skanermiejscowoscipl_offset   type=number    min=1     max=99999  size=4  value=1  style="width:70px;" /> &nbsp;&nbsp; '
    +     '<button id=skanermiejscowoscipl_run     class="btn btn-default" style="margin: 0px; position: relative; top: -2px; ">Skanuj</button>'
    + '</div>'
    + '<div style="margin-bottom: 0px;"><input id=skanermiejscowoscipl_shownames  type="checkbox"  checked  />&nbsp;Pokaż miejscowości na mapie</div>'
    + '<div style="margin-bottom: 0px;"><input id=skanermiejscowoscipl_koloruj    type="checkbox"  checked  />&nbsp;Koloruj na mapie</div>'
    + '<div style="margin-bottom: 0px;"><input id=skanermiejscowoscipl_showedit   type="checkbox"           />&nbsp;Pokaż miejscowości w zasięgu edycji</div>'
    + '<div style="margin-bottom: 0px;"><input id=skanermiejscowoscipl_hide       type="checkbox"           />&nbsp;Ukrywaj znalezione</div>'
    + '<div id=skanermiejscowoscipl_searchbox style="margin-top: 0px; margin-bottom: 0px; text-align: center; " >'
    +     '<i style="color: #C0C0C0; font-size: 11px; ">Wyszukiwarka:</i>'
    +     '<br>'
    +     '<input id=skanermiejscowoscipl_search  style=""      name="skmpl_name" value="" />'
    + '</div>'
    + '<div id=skanermiejscowoscipl_wrapper style="display:none; "></div>'
    + '<div id=skanermiejscowoscipl_log1   style="font-family: Tahoma; font-size: 11px; " ></div>'
    + '<div id=skanermiejscowoscipl_log3   style="font-family: Tahoma; font-size: 11px; " ></div>'
    + '<hr style="margin-top: 10px; margin-bottom: 0px; " >'
    + '<div id=skanermiejscowoscipl_lista  style="font-family: Tahoma; font-size: 11px; vertical-align: top; min-height: 1000px; " ></div>'
    + '<div id=skmpl_clipboard_container ><input id=skmpl_clipboard /></div>'
    + '<style>'
    +     '#skanermiejscowoscipl_lista h1        { vertical-align: top; display: inline-block; min-width:  35px; font-family: Tahoma; font-size: 11px; margin: 0px; padding: 0px; font-weight: normal; line-height: 100%; }'
    +     '#skanermiejscowoscipl_lista h5        { vertical-align: top; display: inline-block;     width:  10px; font-family: Tahoma; font-size: 11px; margin: 0px; padding: 0px; font-weight: normal; line-height: 100%; text-align: center; }'
    +     '#skanermiejscowoscipl_lista h2        { vertical-align: top; display: inline-block;     width: 170px; font-family: Tahoma; font-size: 11px; margin: 0px; padding: 0px; font-weight: bold;   line-height: 100%; padding-left: 3px; }'
    +     '#skanermiejscowoscipl_lista h3        { vertical-align: top; display: inline-block;     width: 170px; font-family: Tahoma; font-size: 11px; margin: 0px; padding: 0px; font-weight: normal; line-height: 100%; padding-left: 3px; }'
    +     '#skanermiejscowoscipl_lista h4        { vertical-align: top; display: inline-block;     width:  60px; font-family: Tahoma; font-size: 11px; margin: 0px; padding: 0px; font-weight: normal; line-height: 100%; margin-left: 5px; }'
    +     '#skanermiejscowoscipl_lista hr        { margin: 0px; }'
    +     '#skanermiejscowoscipl_lista h2:hover  { color: #0080FF; cursor:pointer; text-decoration: underline; }'
    +     '#skanermiejscowoscipl_lista h3:hover  { color: #0080FF; cursor:pointer; text-decoration: underline; }'
    +     '#skmpl_progress                  { opacity: 0; height: 0; margin-top: 0px; margin-bottom: 0px; display: none; }'
    +     '#skmpl_progress                  { -moz-transition: opacity 0.5s linear; -o-transition: opacity 0.5s linear; -webkit-transition: opacity 0.5s linear; }'
    +     '#skmpl_progress.loading          { opacity: 1.0; height: auto; display: block; }'
    +     '#skmpl_progress_bar              { margin: 0px; padding: 2px; border: 1px solid #a0a0a0; border-radius: 5px; font-size: 14px; width: 75%; margin: 0 auto; }'
    +     '#skmpl_progress_percent          { background-color: #C0E7F1; width: 0px; color: #000000; white-space: nowrap; }'
    +     '#skmpl_progress_info             { font-family: Tahoma; font-size: 11px; color: #000000; }'
    +     '.skmpl_button_disabled           { disabled: true;  color: #C0C0C0; }'
    +     '.skmpl_button_enabled            { disabled: false; color: #000000; }'
    +     '#skmpl_dbinfo                    { font-size: 11px; color: #a0a0a0; font-weight: normal; text-align: center; padding:0px; font-style: italic; }'
    +     '.skmpl_woj                       { color: #9D9578; font-weight: bold; xfont-style: italic; text-align: center; background-color: #F3F0E5; border-radius: 0px 0px 8px 8px; }'
    +     '#skmpl_clipboard                 { font-size: 11px; font-family: Tahoma; width: 1px; height: 1px; opacity: 0; }'
    +     '#skmpl_clipboard_container       { display: none; position: absolute; width: 7px; height: 7px; background: #0080FF; }'
    +     '.skmpl_perm0                     { display: inline-block; background: #f8f8f8; width: 6px; height: 6px; border-radius: 4px; }'
    +     '.skmpl_perm1                     { display: inline-block; background: #15A700; width: 6px; height: 6px; border-radius: 4px; }'
    +     '.skmpl_perm2                     { display: inline-block; background: #CC0000; width: 6px; height: 6px; border-radius: 4px; }'
    +     '</style>'
    ;

    var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	var newtab = document.createElement('li');
	newtab.innerHTML = '<a id=sidepanel-skanermiejscowoscipl-tab href="#sidepanel-skanermiejscowoscipl" data-toggle="tab" style="" >Skaner Miejscowości</a>';
    newtab.id = 'skanermiejscowoscipl_tab';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-skanermiejscowoscipl";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);

    loadOptions();

    tworz_liste_wojewodztw();
    tworz_liste_powiatow();

    getId('skanermiejscowoscipl_button1').onclick    = skanermiejscowosciplWCZYTAJPLIK;
    getId('skanermiejscowoscipl_run').onclick        = skanermiejscowosciplRUN;
    getId('skanermiejscowoscipl_run').disabled       = true;
    getId('skanermiejscowoscipl_woj').onchange       = skanermiejscowosciplWOJ;
    getId('skanermiejscowoscipl_shownames').onchange = skanermiejscowosciplSHOWNAMES;
    getId('skanermiejscowoscipl_pow').onchange       = skanermiejscowosciplPOW;
    getId('skanermiejscowoscipl_hide').onchange      = skanermiejscowosciplHIDE;
    getId('skanermiejscowoscipl_offset').onkeypress  = skanermiejscowosciplENTER;
    getId('skanermiejscowoscipl_search').onkeyup     = skanermiejscowosciplSEARCH;
    getId('skanermiejscowoscipl_showedit').onchange  = skanermiejscowosciplSHOWEDIT;
    getId('skanermiejscowoscipl_koloruj').onchange   = skanermiejscowosciplKOLORUJ;
    
    getId('skanermiejscowoscipl_lista').innerHTML = '';
    getId('skmpl_dbinfo').innerHTML = lang.dbversion + skanerDB.version;

    getId('sidepanel-skanermiejscowoscipl-tab').onclick = tabclick;

    var list = document.getElementsByTagName("div");
    for(var i=0; i<list.length; i++) {
        var id = list[i].id;
        var p = id.indexOf("PendingOperation");
        if (p>=0) {
            wazepending = list[i];
        }
    }

    Waze.vent.on("operationPending", function() {
        ventCount++;
    });
    Waze.vent.on("operationDone", function() {
        ventCount--;
        if (ventCount < 0) ventCount = 0;
    });


    
    //-----przechwycenie polecenia copy CTRL + C i wstrzyknięcie tekstu do schowka
    window.addEventListener("keydown", function(ev) {
        if (ev.ctrlKey && ev.keyCode == 67 && mouseoverID!='') {
            getId('skmpl_clipboard_container').style.display = 'block';
            getId('skmpl_clipboard').value = mouseoverNAME;
            getId('skmpl_clipboard').select();
        }
    });

    //przechwytywanie zdarzenia kopiowania Ctrl+C
    window.addEventListener('copy', function (ev) {
        if (mouseoverID != '' && baza.length>=0 && getId('skanermiejscowoscipl_lista').innerHTML != '') {
            ev.clipboardData.setData('text/plain', mouseoverNAME );
            ev.preventDefault();
        }
    });    

    window.addEventListener("keyup", function(ev){
        if (ev.ctrlKey && ev.keyCode == 67) {
            getId('skmpl_clipboard_container').style.display = 'none';

            //eksperymentalna opcja, skrót Ctrl+C jednocześnie wkleja nazwę i przenosi do punktu na mapie /opcja do rozważenia/
            //if (mouseoverID != '') {
            //    var WM   = window.Waze.map;
            //    var OL   = window.OpenLayers;
            //    var a    = mouseoverID.split('_');
            //    var x    = parseInt( a[1] );
            //    var y    = parseInt( a[2] );
            //    if (!run) {
            //        var xy = new OL.LonLat( x, y );
            //        WM.panTo(xy);
            //        WM.zoomTo(zoom);
            //    }
            //}

        }
    });

	window.setInterval(skanermiejscowosciplLOOP, LOOPTIME);
}
//--------------------------------------------------------------------------------------------------------------
bootstrapSkanerMiejscowosciPL();