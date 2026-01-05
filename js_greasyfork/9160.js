/**
 * Created by Magnus Fohlström on 2016-09-24 at 22:56
 * with file name
 * in project TampermonkeyUserscripts.
 */
"use strict";
//// ==UserScript==
// @name            My Function library
// @namespace       http://use.i.E.your.homepage/
// @version         0.52
// @description     enter something useful
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_xmlhttpRequest
// @run-at          document-start

// @created         2015-04-06
// @released        2014-00-00
// @updated         2014-00-00
// @history         @version 0.25 - first version: public@released - 2015-04-12
// @history         @version 0.30 - Second version: public@released - 2015-12-10
// @history         @version 0.35 - Second version: public@released - 2016-03-04
// @history         @version 0.45 - Second version: public@released - 2016-09-24
// @history         @version 0.45 - third version: public@released - 2017-01-10
// @history         @version 0.51 - third version: public@released - 2017-08-17
// @history         @version 0.52 - third version: public@released - 2017-09-23

// @compatible      Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @copyright       2014+, Magnus Fohlström
// ==/UserScript==
/*global $, jQuery*/
/*jshint -W014, -W030, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or function call instead saw an expression
// -W082, a function declaration inside a block statement

/*
 $("li").not(function() {
 // returns true for those elements with at least one span as child element
 return $(this).children('span').length > 0
 }).each(function() { /* ...  })
 */
//noinspection JSUnresolvedFunction,JSUnresolvedVariable,BadExpressionStatementJS,JSPotentiallyInvalidConstructorUsage, JSPrimitiveTypeWrapperUsage
//noinspection BadExpressionStatementJS,JSUnresolvedVariable,JSDeprecatedSymbols
performance;

function setGM(window2) {
    window2 = window2 || window;
    console.log('setGM' );
    var localStorage = localStorage;
    window2.GM_getValue      = function( key, def ){
		return localStorage[key] || def;
	};
	window2.GM_setValue      = function( key, value ){
		localStorage[key] = value;
	};
	window2.GM_deleteValue   = function( key ){
        delete localStorage[ key ];
	};
	window2.GM_listValues    = function( ){
		return Object.keys( localStorage );
	};
	window2.GM_lister        = function( remove, item ){
		var keys = GM_listValues(), i = 0, val;
		for ( i; i <= keys.length; i++ ) {
			val = keys[i];
			//noinspection JSUnresolvedVariable
            val !== undefined && (
				console.log( 'GM_ListItem: ' + val + ':', GM_getValue( val ) ),
				( ( item !== undefined && val.inElem( item ) ) || item === undefined )
				&& Boolean.parse( remove ) && GM_deleteValue( val ) );
		}
	};
}

console.log('isFunction( GM_getValue() )', $.isFunction( window.GM_getValue ) );

!!$.isFunction( window.GM_getValue ) || setGM();

(function(){

	var eventMatchers = {
		'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
		'MouseEvents': /^(?:click|mouse(?:down|up|over|move|enter|out))$/
		//'MouseEvents': /^(?:click|dblclick|hover|contextmenu|mouse(?:down|up|over|move|enter|leave|out))$/
	};

	var defaultOptions = {
		pointerX: 0,
		pointerY: 0,
		button: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true,
		cancelable: true
	};

	jQuery.fn.simulate = function(eventName) {
		var element = this[0];
		var options = $.extend(true, defaultOptions, arguments[2] || { });
		var oEvent, eventType = null;

		for (var name in eventMatchers) {
			if (eventMatchers[name].test(eventName)) { eventType = name; break; }
		}

		if (!eventType)
			throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
		 //noinspection JSUnresolvedVariable
        if (document.createEvent) {
            //noinspection JSUnresolvedFunction
			oEvent = document.createEvent(eventType);
			if (eventType == 'HTMLEvents') {
				oEvent.initEvent(eventName, options.bubbles, options.cancelable);
			}
			else {
                //noinspection JSDeprecatedSymbols,noinspection JSUnresolvedVariable
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
					options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
					options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
			}
			element.dispatchEvent(oEvent);
		}
		else {
			options.clientX = options.pointerX;
			options.clientY = options.pointerY;
            //noinspection JSUnresolvedFunction
            oEvent = $.extend(document.createEventObject(), options);
            element.fireEvent('on' + eventName, oEvent);
		}
		return element;
	};
})();

/*window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
	console.debug('Error: ' + errorMsg + '\nScript: ' + url + '\nLine: ' + lineNumber
		+ '\nColumn: ' + column + '\nStackTrace: ' +  errorObj);
};*/
/**
 *  @namespace waitUntilExists_Intervals
 */
$.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild){
	var found	= 'found',
		$this	= $(this.selector),
		$elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
	if( !isChild ) {
        (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
			window.setInterval(function () {
				$this.waitUntilExists(
					handler, shouldRunHandlerOnce, true);
			}, 500);
	}
	else if (shouldRunHandlerOnce && $elements.length){
        window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
	}
	return $this;
};

$.extend( $.easing,{
	easeOutBounceSmall 	: function(x, t, b, c, d) {
		var ts=(t/=d)*t;
		var tc=ts*t;
		return b+c*(-16.195*tc*ts + 49.935*ts*ts + -53.785*tc + 21.795*ts + -0.75*t);
	},
	easeOutSmoothBounce : function(x, t, b, c, d) {
		var ts=(t/=d)*t;
		var tc=ts*t;
		return b+c*(-19.4293*tc*ts + 53.3838*ts*ts + -49.8485*tc + 15.8081*ts + 1.08586*t);
	},
	easeInOutCubic		: function(x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
});
$.extend( $.fn, {
	// Name of our method & one argument (the parent selector)
	/**
	 * Suppress all rules containing "unused" in this
	 * class
	 *
	 * @SuppressWarnings("unused")
	 */
	//noinspection JSUnusedProperty
    isNode              : function ( node ) {
        var e = this[0] || $('<undefined/>'),
            node_name = e.nodeName;
        return node_name !== undefined && e.nodeName.toLowerCase() === node.toLowerCase();
    }
});

$.extend( $.fn, {
	// Name of our method & one argument (the parent selector)
	/**
	 * Suppress all rules containing "unused" in this
	 * class
	 *
	 * @SuppressWarnings("unused")
	 */
	//noinspection JSUnusedProperty
	within: function( pSelector ) {
		// Returns a subset of items using jQuery.filter
		return this.filter(function(){
			// Return truthy/falsey based on presence in parent
			return $(this).closest( pSelector ).length;
		});
		/* Example
		 $("li").within(".x").css("background", "red");

		 This selects all list items on the document, and then filters to only
		 those that have .x as an ancestor. Because this uses jQuery internally,
		 you could pass in a more complicated selector:

		 $("li").within(".x, .y").css("background", "red");

		 http://stackoverflow.com/questions/2389540/jquery-hasparent
		 http://stackoverflow.com/a/2389549
		 */
	}
});

$.fn.extend({
	exists              : function () {
		return !!this.length;
	},
	Exists              : function ( callback ) {
		var self = this;
		var wrapper = (function(){
			function notExists(){}
			//noinspection JSPotentiallyInvalidConstructorUsage
			notExists.prototype.ExistsNot = function( fallback ){
				!self.length && fallback.call(); };
			//noinspection JSPotentiallyInvalidConstructorUsage
			return new notExists;
		})();
		self.length && callback.call();
		return wrapper;

		/*  And now i can write code like this -
		 $("#elem").Exists(function(){
		 alert ("it exists");
		 }).ExistsNot(function(){
		 alert ("it doesn't exist");
		 });
		 */
	},
	ifExists            : function ( fn ) {
		this.length && fn( this );
		return this.length && this;
		/*
		 $("#element").ifExists( function( $this ){
		 $this.addClass('someClass').animate({marginTop:20},function(){alert('ok')});
		 });
		 */
	},
	iff            		: function ( bool, fn ) {
		( bool && this.length || !bool && !this.length) && fn( this );
        return ( bool && this.length || !bool && !this.length ) && this;
		/*
		 $("#element").if( true, function( $this ){);
		 $("#element").if( false, function( $this ){);
		 */
	},
	ifs            		: function ( fnTrue, fnFalse ) {
		fn( this.length ? fnTrue : fnFalse );
		/*
		 $("#element").ifs( function( $this ){}, function( $this ){});
		 */
	},

	hasId               : function ( id ) {
		return id === this.attr('id');
	},
	hasClasses          : function ( classes, any ) {
		classes = classes.split( classes.inElem(',') ? ',' : ' ' );
		var check = 0, i = 0;
		for ( i; i < classes.length; i++ ) {
			this.hasClass( classes[ i ] ) && check++;
			if ( any !== undefined && check !== 0 ) return true;
		}
		return check === classes.length;
	},
	hasClassLongerThan  : function ( length, addClass ) {
        var str = $( this ).addClass('å').attr('class'),
			classes = str.split( ' ' ),
			check = 0, i = 0;

        for ( i; i < classes.length; i++ ) {
            check = classes[ i ].length >= length ? check++ : check;
            classes[ i ].length >= length && $( this ).addClass( addClass );
            $( this ).removeClass('å');
        }
        return check;
    },
    hasIdLongerThan     : function ( length, addClass ) {
        var str = $( this ).hasAttr('id') ? $( this ).attr('id') : ' ', check = 0;
            check = str.length >= length ? check++ : check;

        str.length >= length && $( this ).addClass( addClass );

        return check;
    },
	hasAttrLength       : function ( attar, length, addClass ) {
        var str = $( this ).attr( attar ),
            attribs = str.attr( attar, $( this ).attr( attar ) + '  ' ).split( ' ' ),
            check = 0, i = 0;

        for ( i; i < attribs.length; i++ ) {
            check = attribs[ i ].length >= length ? check++ : check;
            //attribs[ i ].length >= length
			check && $( this ).addClass( addClass );
        }
        return check;
    },
	hasSiblings			: function ( find ) {
		return !!$(this).siblings( find ).length;
    },
	hasChildren			: function () {
        return $(this).children().length !== 0;
    },
	hasNoChildren       : function ( selection ) {
		return $( this ).filter( function(){
			return $( this ).children( selection ).length === 0;
		});
	},
	/*        hasParent       : function( parentSelection ){
	 return parentSelection.inElem('#')
	 ? this.parent().hasId( parentSelection.split('#').shift() )
	 : this.parent().hasClass( parentSelection.split('.').shift() );
	 },
	 */
	hasAncestor         : function ( Ancestor ) {
		return this.filter(function() {
			return !!$( this ).closest( Ancestor ).length;
		});
		//$('.element').hasAncestor('.container').myAction();
	},
	hasParent           : function ( selection ) {
		return !!$( this ).parent( selection ).length;
	},
	hasParents          : function ( selection ) {
		return !!$( this ).parents( selection ).length;
	},
	hasQuery            : function ( query ) {
        return document.querySelector(query).length;
	},
	hasAttr             : function ( name, val ) {
		var thisAttr = $( this ).attr( name );
		thisAttr =
			val !== undefined
				? thisAttr === val
				: thisAttr;
		return ( typeof thisAttr !== "undefined" && thisAttr !== false && thisAttr !== null );

		//return val !== undefined
		//    ? attrName === val
		//    : typeof( attrName ) !== 'undefined';  //$( this )[0].hasAttribute( name );
	},
	getThisAttr			: function ( destinationObj ) {
        var that = this,
			allAttributes = ($(that) && $(that).length > 0) ? $(that).prop("attributes") : null;

        allAttributes && $(destinationObj) && $(destinationObj).length == 1 &&
            $.each(allAttributes, function() {
                this.name == "class" ? $(destinationObj).addClass(this.value) : destinationObj.attr(this.name, this.value);
            });

        return  destinationObj !== undefined && $(destinationObj).length == 1 ? $(destinationObj) : allAttributes;
	},
    getAttrFrom			: function ( sourceObj ) {
        var that = this,
            allAttributes = ($(sourceObj) && $(sourceObj).length > 0) ? $(sourceObj).prop("attributes") : null;

        allAttributes && $(that) && $(that).length == 1 &&
			$.each(allAttributes, function() {
				this.name == "class" ? $(that).addClass(this.value) : that.attr(this.name, this.value);
			});

        return that;
    },
	isTag               : function ( tag ) {
		var e = this[0] || $('<undefined/>'),
            nodename = e.nodeName;
        return nodename !== undefined && e.nodeName.toLowerCase() === tag.toLowerCase();
	},
	isNode              : function ( node ) {
		var e = this[0] || $('<undefined/>'),
		nodename = e.nodeName;
		return nodename !== undefined && e.nodeName.toLowerCase() === node.toLowerCase();
	},

    swapClass           : function ( replace, newClass) {
        this.className.replace(replace, newClass);
    },
    toggleClasses       : function ( add, remove, if_none) {
        var $this = $(this.selector);
        if_none !== undefined && !$this.hasClass(add) && !$this.hasClass(remove) && $this.addClass(if_none);
        $this.addClass(add).removeClass(remove);
    },
	searchAttr          : function ( search, type, chkLen ) { //bool name value length or 1 2 3 4
		var Attributes = this[0].attributes;

		if ( arguments.length === 0 ) {
			var obj = {};
			$.each( Attributes, function() {
                this.specified && ( obj[ this.name ] = this.value );
			});
			return obj;
		} else if( search != undefined ) {
			var name = '', val = '';
			$.each( Attributes, function() {
                if( this.specified && type == 'length' ) {
					if( this.name.length > chkLen ) {
						name = this.name;
						c.i('Attributes', Attributes);
						return false;
					}
				}
				else {
                    if( this.specified && this.name.inElem( search ) ) {
                                        name = this.name;
                                        val = this.value;
                                        return false;
                                    }
                }
			});
			return ( type == 'bool' || type == 1 ) ? name.length :
				( type == 'name' || type == 2 ) ? name :
					( type == 'value' || type == 3 ) ? val :
					( type == 'length' || type == 4 ) && name;
		}
	},
	findClass           : function ( Class ) {
		return this.find('.' + Class);
	},
	findNextSibling     : function ( thisSelector, bool ) {
		bool = bool || true;
		return bool ? this.eq(0).nextAll( thisSelector ).eq(0) : this.nextAll( thisSelector ).eq(0) ;
	},
	findPrevSibling     : function ( thisSelector, bool ) {
		bool = bool || true;
		return bool ? this.eq(0).prevAll( thisSelector ).eq(0) : this.prevAll( thisSelector ).eq(0) ;
	},
    nthChildClass		: function(expr) {
        return this.filter(':nth-child('+ expr +')');
    },

	href                : function ( newURL ) {
		return arguments.length === 0 ? this.attr('href') : this.attr('href', newURL);
	},
	src                 : function ( newSRC ) {
		return arguments.length === 0 ? this.attr('src') : this.attr('src', newSRC);
	},
    refreshElement      : function ( speed, parentBoolean ) {
        var $elem = parentBoolean ? this.parent() : this, data = $elem.html();
        $elem.hide( speed / 2 ).empty().html( data ).fadeIn( speed );
    },
    replaceElementOld   : function ( newTagName, addAttr ) {

        function stringifyAttr( attrs ){
            var attrString = '', newAttr = addAttr || '';
            $.each( attrs, function( index ){
                attrString += ' ' + attrs[ index ].name + '="' + attrs[ index ].value + '"';
            });
            return newAttr.length ? attrString + ' ' + newAttr : attrString;
        }

        $( this ).each(function(){
            var attributes = stringifyAttr( this.attributes ),
                StartTag = '<' + newTagName + attributes +'>',
                EndTag = '</' + newTagName + '>';
            $( this ).replaceWith( StartTag + $( this ).html() + EndTag );
        });
    },
    replaceElement      : function ( newNodeName, htmlElement ) {

        newNodeName = $('<'+ newNodeName +'/>');
        htmlElement = htmlElement !== undefined ? htmlElement : $('<span/>',{ 'data-tmp':'TemparyAttribute'});

        function newElem_addAttr( attrs, newAttr, newElem ){
            $.each( attrs, function( index ){
                newElem.attr( attrs[ index ].name, attrs[ index ].value ); });
            $.each( newAttr, function( index ){
                newElem.attr( newAttr[ index ].name, newAttr[ index ].value ); });
            return newElem;
        }

        $( this ).each(function(){
            $( this ).replaceWith( newElem_addAttr(
                this.attributes, htmlElement[0].attributes, newNodeName ).html( $( this ).html() ).removeAttr('data-tmp') );
        });

        return this;
    },
	equals              : function ( compareTo ) {
		if (!compareTo || this.length != compareTo.length)
			return false;

		for (var i = 0; i < this.length; ++i) {
			if (this[i] !== compareTo[i])
				return false;
		}
		return true;
	},

    cleaner			: function () {
        $( this ).contents().filter(function () {
            return this.nodeType !== 1 && this.nodeType !== 3 && this.nodeType !== 10;
        }).remove();
        return this;
    },

    defragText			: function (){
        this.nodeType === 3 && this.normalize();
        return this;
    },
	removeText			: function () {
		$( this ).contents().filter(function () {
			 return this.nodeType === 3;
		}).remove();
		return this;
    },
	selectText			: function(){

        var range,
            selection,
            obj = this[0],
            type = {
                func:'function',
                obj:'object'
            },
            // Convenience
            is = function(type, o){
                return typeof o === type;
            };

        if( is(type.obj, obj.ownerDocument)
            && is(type.obj, obj.ownerDocument.defaultView)
            && is(type.func, obj.ownerDocument.defaultView.getSelection) ){

            selection = obj.ownerDocument.defaultView.getSelection();

            if( is(type.func, selection.setBaseAndExtent) ){
                // Chrome, Safari - nice and easy
                selection.setBaseAndExtent(obj, 0, obj, $(obj).contents().size());
            }
            else if( is(type.func, obj.ownerDocument.createRange) ){

                range = obj.ownerDocument.createRange();

                if( is(type.func, range.selectNodeContents)
                    && is(type.func, selection.removeAllRanges)
                    && is(type.func, selection.addRange)){
                    // Mozilla
                    range.selectNodeContents(obj);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
        else if( is(type.obj, document.body) && is(type.obj, document.body.createTextRange) ){

            range = document.body.createTextRange();

            if( is(type.obj, range.moveToElementText) && is(type.obj, range.select) ){
                // IE most likely
                range.moveToElementText(obj);
                range.select();
            }
        }

        // Chainable
        return this;
    },
	selectThisText : function(){
		var doc = document
			, element = this[0]
			, range, selection
		;
		if (doc.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
        return this;
	},
	justText            : function ( newText, prepend ) {
		var $children = null,
			placement = prepend === undefined ? 'prepend':'append';
		if ( newText ) {
			$children = $( this )
				.children()
				.clone();
			$( this )
				.children()
				.remove()
				.end()
				.text( newText )
				[ placement ]( $children );
			return $(this);
		}
		else {
			return $.trim( $( this )
				.clone()
				.children()
				.remove()
				.end()
				.text());
		}
	},
	justThisText		: function () {
		var array = [];
		this.contents().each(function(){
			this.nodeType == 3 && array.push( this.textContent || this.innerText || '' ); });
    	return array;
    },
    toComment			: function ( textNode ) {
        textNode = textNode || false;
        var $this = $( this ),
            comment = function( elem ){
                return document.createComment( !textNode ? elem.get(0).outerHTML : elem );
            };

        textNode !== undefined && textNode
            ? $this.contents().filter(function(){ return this.nodeType === 3; })
                .each(function(){ $( this ).replaceWith( comment( this.nodeValue ) ); })
            : $this.replaceWith( comment( $this ) );
    },
    uncomment           : function ( recurse ) {
        <!-- hidden --> // this will reveal, whats inside. In this case it will bi the word hidden
        recurse = recurse || false;
        $( this ).contents().each(function(){
            this.nodeType === 8 && $( this ).replaceWith( this.nodeValue ); });

        recurse && $( this ).hasChildren()
        	&& $( this ).find('> *').not('iframe').uncomment( recurse );

        /*
        $( this ).contents().each(function() {
            if ( recurse && this.hasChildNodes() ) {
                $( this ).uncomment(recurse);
            } else {
                if ( this.nodeType == 8 ) {
                                // Need to "evaluate" the HTML content,
                                // otherwise simple text won't replace
                    var e = $('<span>' + this.nodeValue + '</span>');
                                $( this ).replaceWith( e.contents() );
                            }
            }
        });
    */
        // $('#uncomment').uncomment( true );
        // http://stackoverflow.com/a/22439787
    },

	getComment          : function ( getValue ) {
		var COMMENT_NODE = this.contents().filter(function(){
            return this.nodeType == Node.COMMENT_NODE;
		});
		return getValue
			? COMMENT_NODE.each(function(){
                return $( this ).nodeValue.str2html(); })
			: COMMENT_NODE;
	},
	getURL              : function ( url, how ) {
        //$.get('defaultComp/foot.html', function(dataContent) {$('#foot').replaceWith(dataContent); });
		how = how || 'html';
		var that = this;
		$.get( url, function(dataContent) {
			$(that)[ how ](dataContent);
		});
		return this;
	},

	scrollTuneAdv       : function ( opt  ){
		// $("body").scrollTune({ pps: 1700, pageY: config.pageY, easing:'easeOutSmoothBounce', hsc: true }).promise()
		//          .done( function() { setTimeout(function(){ toggleClassState( config, 'fullPlayer', type ); },100); })
		console.log('scrollTune');

		var position,
			defaults 		= {
				tune:		0,
				speed:		0,
				pps:        false, // pixel per second
				ppsM:		1000,
				pageYmini:	0,
				pageY:      false, //{ pps: 300, pageY: event.pageY }
				hsc:		false, // height speed compensation
				animate:	false,
				// require	http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js or jQueryUI - if other than ' swing or linear '
				easing:     "easeInOutCubic", // easeInOutCubic  easeInOutQuad  easeInOutElastic http://easings.net/
				delay:		0,
				varStore:	'',
				varAltStore:false,
				name:		false,
				start:   	false,
				startTime: 	0,
				step:   	false,
				stepTime: 	0,
				complete:   false,
				completeTime: 0,
				done:   	false,
				doneTime: 	0,
				goTo:		$('body')
			},
			heightSpeedComp	= function(){
                return opt.hsc ? 1 + ( ( $(document).height() / opt.pageY ) / 1.4 ) : 1 ;
			},
			varStore = function( action, step ){
				(console.log(action,step),
				opt.name !== false
					? opt.varAltStore !== false
						? ( console.log('Store'), opt.varAltStore[opt.name][ action ](step) )
						: ( console.log('Store false'), opt.name[ action ](step) )
					: opt.pageYmini < opt.pageY || opt.varStore === config
						? ( console.log('config'), opt.varStore[ action ](step) )
						: ( console.log('config false'), opt.varStore(step) ));
			};
		console.log('opt.pageY',opt.pageY);
		opt = $.extend( {}, defaults, opt );
		position = ( $( this ).offset().top + opt.tune ) + 'px';

		opt.pps !== false || opt.animate !== false || ( typeof opt.speed === 'string' ? opt.speed.length !== 0 : opt.speed !== 0 )
			? (
			opt.speed = opt.pps !== false ? parseInt( ( opt.pageY / opt.pps * heightSpeedComp() ) * opt.ppsM ) : opt.speed,
				opt.goTo.delay( opt.delay ).animate(
					{ scrollTop	: position },
					{ duration	: opt.speed, easing: opt.easing,
						start		: function(){
							opt.start && setTimeout(function(){
								varStore('start');
							}, opt.startTime );
						},
						step		: function(i){
							opt.step && setTimeout(function(){
								varStore('step',i);
							}, opt.stepTime );
						},
						complete	: function(){
							opt.complete && setTimeout(function(){
								varStore('complete');
							}, opt.completeTime );
						},
						done		: function(){
							opt.done && setTimeout(function(){
								varStore('done');
							}, opt.doneTime );
						}
					}
				)
			)
			: opt.goTo.scrollTop( position );

		return this; // for chaining...

	},
	scrollTuneNew       : function ( opt ){
		var defaultOptions = {
				tune:		0,
				speed:		512,
				animate:	true,
				easing:     'swing',
				goTo:		$('html, body')
			},
			element  = $( this ),
			options  = $.extend({}, defaultOptions, $.fn.scrollTuneNew.changeDefaults, opt ),
			position = ( element.offset().top + options.tune ) + 'px';

		options.animate
			? options.goTo.animate({ scrollTop: position }, options.speed, options.easing )
			: options.goTo.scrollTop( position );

		return element; // for chaining...
	},
	simulateMouseEvent  : function ( MouseEvents ){
		var $this = this[0], evt,
			mEvent = MouseEvents || 'click';
		//noinspection JSUnresolvedVariable, noinspection JSUnresolvedFunction
        document.createEvent
            //noinspection JSUnresolvedFunction
			? ( evt = document.MouseEvents('MouseEvents'),
				//evt.initCustomEvent(type, bubbles, cancelable, detail)
				//evt.initCustomEvent("MyEventType", true, true, "Any Object Here");
				evt.initEvent(mEvent, true, false),
				$this.dispatchEvent(evt) )

			: //noinspection JSUnresolvedFunction
			document.createEventObject
				? $this.fireEvent('onclick')
				: typeof node['on' + mEvent] == 'function' && $this['on' + mEvent]();
	},
	simulateMouse       : function ( typeOfEvent ){
		var $this = this[0],
			evt     = document.createEvent("MouseEvents"),
			mEvent  = typeOfEvent || 'click';
		//noinspection JSDeprecatedSymbols
        evt.initMouseEvent( mEvent, true, true, $this.ownerDocument.defaultView,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
        $this !== undefined && $this.dispatchEvent(evt);
		return this;
	},
    simulateMouseAdv    : function ( typeOfEvent, options ){

        var target   =  this[0],
            event    =  document.createEvent("MouseEvents"),
            defaults =  {
                mButton     : 'left',
                type        : typeOfEvent || 'click',
                canBubble   : true,
                cancelable  : true,
                view        : target.ownerDocument.defaultView, //window, //
                detail      : 1,
                screenX     : 0, //The coordinates within the entire page
                screenY     : 0,
                clientX     : 0, //The coordinates within the viewport
                clientY     : 0,
                ctrlKey     : false,
                altKey      : false,
                shiftKey    : false,
                metaKey     : false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
                button      : 0, //0 = left, 1 = middle, 2 = right
                relatedTarget  : null
            },
            opts     =  $.extend({}, defaults, $.fn.simulateMouseAdv.changeDefaults, options ),
            oButton  = {
                left:0, middle:1, right:2
            };

        console.log('oButton', opts.mButton );
        opts.button  =  oButton[ opts.mButton ];

        //Pass in the options
        //noinspection JSDeprecatedSymbols
        event.initMouseEvent(
            opts.type,
            opts.canBubble,
            opts.cancelable,
            opts.view,
            opts.detail,
            opts.screenX,
            opts.screenY,
            opts.clientX,
            opts.clientY,
            opts.ctrlKey,
            opts.altKey,
            opts.shiftKey,
            opts.metaKey,
            opts.button,
            opts.relatedTarget
        );

        //Fire the event
        target.dispatchEvent(event);
    },

	hasEvent            : function ( event ) {
        var eventHandlerType;
        $( this ).on( event, clickEventHandler ).triggerHandler( event );
        function clickEventHandler( e ) {
            eventHandlerType = e.type;
        }
        return eventHandlerType === event;
    },
	qUnWrap             : function (){
		$( this ).find(':first-child').unwrap();
	},
	designMode          : function ( state, contenteditable ) {
		state = ( state === true || state === 1 || state === 'on' ) ? 'on' :
				( state === false || state === 0 || state === 'off' ) && 'off';
		contenteditable = contenteditable || 'off';
		contenteditable !== 'off'
			? contenteditable === 'document'
				? document.designMode = state
				: contenteditable
					? this.attr('contenteditable', true)
					: this.removeAttr('contenteditable')
			: this.contentWindow.document.designMode = state;
	},

	getThisComputedStyle : function ( style ) {
        return  window.getComputedStyle( $(this), null ).getPropertyValue( style );
    },
    thisCompStyle       : function ( cssStyle ) {
        return cssStyle !== undefined ? this.getComputedStyle().getPropertyValue( cssStyle ) : this.getComputedStyle();
    },
    getStyle       		: function( propertyKey ) {
        var cssPropAll = window.getComputedStyle(this, null);
        return propertyKey === undefined ? cssPropAll : cssPropAll.getPropertyValue( propertyKey );
    }
});

//$.fn.scrollTune.changeDefault = {};

$.extend({
	confirm: function (title, message, yesText, noText, yesCallback) {
		//dialog needs jQueryUI
		/*
		 $.confirm(
		 "CONFIRM", //title
		 "Delete " + filename + "?", //message
		 "Delete", //button text
		 deleteOk //"yes" callback
		 );
		 */
		$("<div></div>").dialog( {
			buttons: [{
				text: yesText,
				click: function() {
					yesCallback();
					$( this ).remove();
				}
			},
				{
					text: noText,
					click: function() {
						$( this ).remove();
					}
				}
			],
			close: function (event, ui) { $(this).remove(); },
			resizable: false,
			title: title,
			modal: true
		}).text(message).parent().addClass("alert");
	}
});
$.extend( $.expr[":"], {

});
$.extend( $.expr[":"], {
	ldata: function(el, idx, selector) {
		var attr = selector[3].split(", ");
		return el.dataset[attr[0]] === attr[1];
	},
	value: function(el, idx, selector) {
		return el.value === selector[selector.length - 1];
	},
	isEmptyTrimmed: function(el){
		return !$.trim($(el).html());
	},
    lengthBetween: function(elem, i, match) {
        var params = match[3].split(",");  //split our parameter string by commas
        var elemLen = $(elem).val().length;   //cache current element length
        return ((elemLen >= params[0] - 0) && (elemLen <= params[1] - 0));  //perform our check
    },
	data: $.expr.createPseudo
		? $.expr.createPseudo(function( dataName ) {
		return function( elem ) {
			return !!$.data( elem, dataName );
		};
	})
		// support: jQuery <1.8
		: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	}
});
$.extend( $.expr[":"], {
    'nth-class': function(elem, index, match) {
        return $(elem).is(':nth-child('+ match[3] +')');
    },
    'nth-last-class': function(elem, index, match) {
        return $(elem).is(':nth-last-child('+ match[3] +')');
    },
    'nth-class-of-type': function(elem, index, match) {
        return $(elem).is(':nth-of-type('+ match[3] +')');
    },
    'nth-last-class-of-type': function(elem, index, match) {
        return $(elem).is(':nth-last-of-type('+ match[3] +')');
    },
    'only-class-of-type': function(elem, index, match) {
        return $(elem).is(':first-of-type');
    },
    'first-class-of-type': function(elem, index, match) {
        return $(elem).is(':first-of-type');
    },
    'last-class-of-type': function(elem, index, match) {
        return $(elem).is(':last-of-type');
    },
    'first-class': function(elem, index, match) {
        return $(elem).is(':first-child');
    },
    'last-class': function(elem, index, match) {
        return $(elem).is(':last-child');
    },
    'has': function(elem, index, match) {
        return $(elem).has( match[3] );
    },
    'nth-class-leftOver' : function(elem, index, match, array){
        var elemLen = $(elem).length,
            div = index % match[3],
            indexLT = ( ( $(elem).length % match[3] === 0 ) * match[3] ) + 1;

        var N= document.getElementsByTagName('*');
        c.i('indexOf',Array.prototype.indexOf.call(elem, $(elem).parent()));

        c.i('elem.eq', $(elem).eq( ));
        c.i('elem', $(elem));
        c.i('elemLen', elemLen);
        c.i('index', index);
        c.i('div', div);
        c.i('indexLT', indexLT);
        return $(elem).is(':lt(' + indexLT + ')');
        //return $(elem).lt( ( ( $(elem).length % match[3] === 0 ) * match[3] ) + 1 );
    },
    external: function(element,index,match) {
        if(!element.href) {return false;}
        return element.hostname && match[3] !== undefined || false
            ? element.hostname !== window.location.hostname
            	&& element.hostname.search( match[3] ) === window.location.hostname.search( match[3] )
            : element.hostname !== window.location.hostname;
    },
    inView: function(element) {
        var st = (document.documentElement.scrollTop || document.body.scrollTop),
            ot = $(element).offset().top,
            wh = (window.innerHeight && window.innerHeight < $(window).height()) ? window.innerHeight : $(window).height();
        return ot > st && ($(element).height() + ot) < (st + wh);
    },
    width: function(element,index,match) {
        // Usage: $('div:width(>200)'); // Select all DIVs that have a width greater than 200px
        // Alternative usage: ('div:width(>200):width(<300)');
        if(!match[3]||!(/^(<|>)d+$/).test(match[3])) {return false;}
        return match[3].substr(0,1) === '>' ?
            $(element).width() > match[3].substr(1) : $(element).width() < match[3].substr(1);
    },
    containsNC: function(elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    },
    containsExact: function( element, index, details, collection ){
        return $(element).text() === details[3];
    }

});

jQuery.expr[":"].Contains = $.expr.createPseudo(function(selector) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(selector.toUpperCase()) >= 0;
    };
});
jQuery.expr[':']['new-nth-class'] = function(elem, index, match) {
    return $(elem).is(':nth-child('+ match[3] +')');
};
jQuery.expr[':']['new-nth-class'] = $.expr.createPseudo( function( matchSelection ) {
    return function( elem ) {
        return $(elem).is(':nth-child('+ matchSelection +')');
    };
});

$.isInArray = function( item, array ) {
	return !!~$.inArray(item, array);
};
$.allVar = function( array, value, all, atLeast ) {
	var count = 0,
		arrLength = array.length,
		isBool = typeof value === 'boolean';

	$.each( array, function( i, e ){
		value === ( isBool ? !!e : e ) && count++;
	});

	return all ? count === arrLength : count >= atLeast;
};
/*
 Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
 //$( selector ).get(0).playing;
 get: function(){
 return !!( this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2 );
 }
 });
 */
/*   Object.prototype.hasAttribute   = function( attrName, val ){
 var thisAttr =
 this.attr
 ? val !== undefined
 ? this.attr( attrName ) === val
 : this.attr( attrName )
 : this.getAttribute( attrName );
 return ( typeof thisAttr !== "undefined" && thisAttr !== false && thisAttr !== null );
 };
 */
Array.prototype.findArrayObj    = function( findKey, exactValue ){
	return $.grep( this, function( obj ){
		return obj[ findKey ] === exactValue;
	})[0];
	//This prototype doesn't modify the array,
	// it gets the element that contains key with correct value and
	// the returns that element
};
Array.prototype.removeArrayObj  = function( findKey, exactValue ){
	//my own example test:  http://jsfiddle.net/aPH7m/82/
	//This prototype doesn't modify the array, needs to be overwritten or put into new var array
	return $.grep( this, function( obj ) {
		return obj[ findKey ] !== exactValue;
	});
};
Array.prototype.addKeyToArrayObj = function( findKey, exactValue, newKey, newValue ){
	return $.grep( this, function( obj ){
		return obj[ findKey ] === exactValue ? obj[ newKey ] = newValue : obj[ findKey ] !== exactValue;
	});
	// This prototype doesn't modify the array,
	// it gets the element that contains key with correct value and
	// adds a new key with its value to that element
};

Array.prototype.filterArrayObj  = function( doWhat, findKey, exactValue, newKey, newValue ){
	return  doWhat === 'remove'
		? this.filter(function( obj ) {
		return obj[ findKey ] !== exactValue;
	})
		: doWhat === 'addKey'
		? this.filter(function( obj ){
		return obj[ findKey ] === exactValue
			?  obj[ newKey ]  = newValue
			:  obj[ findKey ] !== exactValue;
	})
		: doWhat === 'find'
	&& this.filter(function( obj ){
		return obj[ findKey ] === exactValue;
	})[0];
};
Array.prototype.grepArrayObj    = function( doWhat, idKey, uniqueValue, theKey, theValue ){
	doWhat = doWhat === 'updateKey' ? 'addKey' : doWhat;
	return doWhat === 'remove'
		? $.grep( this, function( obj ){
				return obj[ idKey ] !== uniqueValue;
			})
		:  doWhat === 'addKey'
			? $.grep( this, function( obj ){
				return obj[ idKey ] === uniqueValue
					? (
						obj[ theKey ] = theValue,
						obj[ idKey ] === uniqueValue
					)
					: obj[ idKey ] !== uniqueValue;
			})
		:  doWhat === 'find'
			? $.grep( this, function( obj ){
				return obj[ idKey ] === uniqueValue;
			})[0]
		:  doWhat === 'deleteKey'
			&& $.grep( this, function( obj ){
				return obj[ idKey ] === uniqueValue
					? (
						delete obj[ theKey ],
						obj[ idKey ] === uniqueValue
					)
					: obj[ idKey ] !== uniqueValue;
			});
};
/*Array.prototype.sortObjArray    = function( key, reverse ){
	this.sort(function(a, b){
		return ( reverse || false ) ? b[key] - a[key] : a[key] - b[key];
	})
};*/

//noinspection JSPrimitiveTypeWrapperUsage
Boolean.parse                   = function(val) {
    //    http://stackoverflow.com/a/24744599
    var falsely = /^(?:f(?:alse)?|no?|0+)$/i;
    return !falsely.test(val) && !!val;
};
Boolean.prototype.isFalse 		= function( ){
    return this.toString() == "false";
};
Boolean.prototype.isTrue 		= function( ){
    return this.toString() == "true";
};
Boolean.prototype.ifs 			= function ( fnTrue, fnFalse ){
    fn( this ? fnTrue : fnFalse );
    /*
     $("#element").ifs( function( $this ){}, function( $this ){});
     */
};
Boolean.prototype.ifBool 		= function ( Boolean, fn ){
    ( this == ( typeof Boolean === 'string' ) ?  parseBoolean( Boolean ) : Boolean ) && fn();
};

/*
 Object.prototype.isObjectType   = function( type, showType ){ //"[object Number]"
 var objectString = Object.prototype.toString.call( this );
 return  showType === 'show' ? objectString :
 showType === 'exact' ? objectString === type :
 showType === 'search' && objectString.toLowerCase().inElem( type.toLowerCase() );
 };

Object.defineProperty(String.prototype, "_defineBool", {
    //myBool.toString()._defineBool()
    get : function() {
        var falsely = /^(?:f(?:alse)?|no?|off?|n?|failure?|sudumoo?|0+)$/i,
            truely = /^(?:t(?:rue)?|yes?|on?|y?|success?|yabbdoo?|1+)$/i,
            stateBool = !!this;

        return ( truely.test( this ) ===  stateBool ) ? true : ( falsely.test( this ) ===  stateBool ) ? false : !isNaN(parseFloat( this )) && isFinite( this ) ? true : null;
    }
});
Object.prototype.obj2Str        = function( obj ){
    var objArr = $.makeArray( obj );
    return objArr[0].outerHTML;
};
*/
String.prototype.splitEvery     = function( splitter, every ){
	var array = this.split( splitter ), returnString = '';
	$.each( array, function( index, elem ){
		returnString += elem + ( index < array.length - 1 || index % every === 0 ) ? '' : splitter;
	});
	return returnString;
};
String.prototype.advSplit       = function( chr, nbr ){
	var str = this.split(chr),
		strLen = str.length,
		chrLen = chr.length,
		returnStr = ['',''],
		newArr = [];

	$.each( str, function( index ){
		returnStr[ index < nbr ? 0 : 1 ] += str[ index ] + chr;
	});

	$.each( returnStr, function( index ){
		returnStr[ index ] = returnStr[ index ].slice(0, - chrLen);
		returnStr[ index ].length > 0 && newArr.push( returnStr[ index]  );
	});

	return newArr;
};
String.prototype.advSplitJoin   = function( chr, nbr, ips ){

	var str = this.split(chr),
		strLen = str.length,
		ipsLen = ips.length,
		returnStr = '',
		returnStrLen;

	$.each( str, function( index ) {
		var add = index < strLen - 1
			? chr
			: '';
		returnStr += index + 1 === nbr
			? str[index] + ips
			: str[index] + add;
	});

	returnStrLen = returnStr.length;
	returnStr.slice( returnStrLen - ipsLen ) === ips
	&& ( returnStr = returnStr.slice( 0, returnStrLen - ipsLen ) );

	return returnStr;
};
String.prototype.extract        = function( start, end, inside, newWay ){
	var str = this,
		myArray = [ true, 1, 'yes', 'inside' ],
		startCharIndex = str.indexOf( start ),
		endCharIndex = str.indexOf( end );

	newWay = newWay !== undefined ? $.inArray( newWay, myArray ) !== -1 : false;
	inside = inside !== undefined ? $.inArray( inside, myArray ) !== -1 : false;

	function simpler() {
		return inside
			? str.split( start ).pop().split( end ).shift()
			: start + str.split( start ).pop().split( end ).shift() + end;
	}
	function older() {
		return inside //old buggy way, some old scripts may depends on it
			? str.replace( start, '').replace( end, '')
			: str.substr( startCharIndex, endCharIndex );
	}
	return newWay ? simpler() : older();
};
String.prototype.extractNew     = function( start, end, inside ){
	var str = this;
	return inside !== undefined && inside
		? str.split( start ).pop().split( end ).shift()
		: inside
			|| start + str.split( start ).pop().split( end ).shift() + end;
};

String.prototype.charTrim       = function( char ){
	// alert("...their.here.".charTrim('.'));
	var first_pos = 0,
		last_pos = this.length- 1, i ;
	//find first non needle char position
	for( i = 0; i < this.length; i++ ){
		if( this.charAt( i ) !== char ){
			first_pos = ( i == 0 ? 0 : i );
			break;
		}
	}
	//find last non needle char position
	for( i = this.length - 1; i > 0; i-- ){
		if( this.charAt( i ) !== char ){
			last_pos = ( i == this.length ? this.length: i + 1 );
			break;
		}
	}
	return this.substring( first_pos, last_pos );
};
String.prototype.reduceWhiteSpace = function(){
	return this.replace(/\s+/g, ' ');
};
String.prototype.formatString   = function(){

	var inputStr = this.toString().reduceWhiteSpace()
			.split('!').join(' !').split('!;').join("!important;")
			.split(/\s+/g).join(' ')
			.split('{').join('{\n\t')
			.split('; ').join(';')



			.split('( ').join('(')
			.split(' )').join(')')

			.split(' :').join(':')

			.split(';').join(';\n\t')
			.split('*/').join('*/\n')
			.split(')*(').join(') * (')
			.split('}').join('}\n'),
		returnStr = '\t', pop;

	$.each( inputStr.split('\n'), function ( i, elem ) {

		elem.search( '{' ) === -1 && elem.search( ': ' ) === -1
		&& ( elem.search( ':' ) > 1
			? ( pop = elem.split(': ').join(':').split( ':' ).pop(), elem = elem.split( pop ).shift() + ' ' + pop )
			: elem.search(':') === 1 && ( elem = elem.split(': ').join(':').split( ':' ).join( ': ' ) ) );
		//    : elem.search( '{' ) === 1 && ( elem.search( ': ' ) !== -1 || elem.search( ' :' ) !== -1 || elem.search( ' : ' ) !== -1 )
		//        && ( elem = elem.split( ': ' ).join( ' :' ).split( ' :' ).join( ':' ).split( ' : ' ).join( ': ' ) );

		returnStr += elem + '\n\t';
	});
	returnStr = returnStr.split('>').join(' > ').split('  >  ').join(' > ').split( ': //' ).join( '://' ).split( ':url' ).join( ': url' );
	return returnStr.slice( 0, returnStr.lastIndexOf('}') ) + '}';
};

/**
 * Parses mixed type values into booleans. This is the same function as filter_var in PHP using boolean validation
 * //@return {Boolean|Null}
 */
String.prototype.parseBooleanStyle = function( onNull ){
    //myBool.toString().parseBooleanStyle()
    onNull = onNull || false;
    var bool, $this = this.toString().toLowerCase();
    switch( $this ){
        case 'true':
        case '1':
        case 'on':
        case 'y':
        case 'yes':
            bool = true;
            break;
        case 'false':
        case '0':
        case 'off':
        case 'n':
        case 'no':
            bool = false;
            break;
        default:
            bool = typeof bool === 'boolean' ? bool : null;
            break;
    }
    return onNull && bool == null || parseInt( $this ) > 0 || bool;
};
String.prototype.parseBool      = function(){
    //myBool.toString().parseBool()
    var thisStr = ( parseInt( this ) ? this === 0 ? 'false' : !isNaN( parseFloat( this ) ) && 'true' : '' + this ).toLowerCase().trim(),
        trueArray = [ 'on', 'yes','y', 'j', 'success', 'true', true ],
        falseArray = [ 'off', 'no', 'n', 'failure', 'false', false ];

    thisStr = thisStr.toLowerCase().trim();

    return  $.inArray( thisStr, trueArray ) !== -1 ? true : $.inArray( thisStr, falseArray ) !== -1 ? false : null;
};
String.prototype.defineBool     = function(){
    var falsely = /^(?:f(?:alse)?|no?|off?|n?|failure?|sudumoo?|0+)$/i,
        truely = /^(?:t(?:rue)?|yes?|on?|y?|success?|yabbdoo?|1+)$/i,
        stateBool = !!this,
		$string = this;

    return ( truely.test( this ) === stateBool )
		? true : ( falsely.test( this ) === stateBool )
			? false : $string != 0 && !isNaN(parseFloat($string)) && ( (typeof $string === 'number' || typeof $string === 'string') && isFinite($string) ) ? true : null;
};

String.prototype.isType         = function( type ){
	return !!$.type( this ) === type;
};
String.prototype.undef          = function( replace ){
	return this === undefined ? replace : this;
};
String.prototype.isUndefined    = function( state, replace ){
	state = state !== undefined ? state : true;
	replace = replace !== undefined ? replace : true;
	return state ? this === undefined ? replace : this : state;
};
String.prototype.isNumber       = function ( float ) {
	var reg = new RegExp( "^[-]?[0-9]+[\.]?[0-9]+$" );
	return reg.test( this );
};

String.prototype.inURL          = function(){
	var winLoc = window.location.href;
	return winLoc.search(this) !== -1;
};
String.prototype.inString       = function( string ){
	return string !== undefined ? string.search(this) !== -1 : false;
};
String.prototype.inElem         = function( search ){
	return this !== undefined ? this.search(search) !== -1 : false;
};
String.prototype.inElemX        = function( search, exact ){

    var isAll,isNone,inArr,checkInArr,
        string = this,
        countAll = 0, countNone = 0;

    exact = exact || false;
    isAll = exact === 'all';
    isNone = exact === 'none';
    exact = isNone || isAll ? false : exact;

    checkInArr = function( search, all ){
        inArr = false;
        $.each( search, function( i, e ){
            if(string.search( e ) !== -1 || string.search( e ) === -1){
                inArr = true;
                if( all ) string.search( e ) !== -1 ? countAll++ : string.search( e ) === -1 && countNone++;
                else return false;
            }
        });
        return all ? inArr && ( string.length === countAll || string.length === countNone ) : inArr;
    };

    return exact
        ? string === search
        : $.isArray( search )
            ? checkInArr( search, isAll || isNone )
            : isNone
                ? string.search( search ) === -1
                : string.search( search ) !== -1;
};
String.prototype.count          = function( char, UpperCase ){
	var numberOf = this.toString().match( new RegExp( char, ( UpperCase ? "gi" : "g" ) ) );
	return numberOf != null ? numberOf.length : 0;
};
String.prototype.startsWith     = function( str ){
	return this.slice(0, str.length) == str;
};
String.prototype.removeStarts   = function( many ){
	return this.substring( many - 1, this.length );
};
String.prototype.removeEnds     = function( many ){
	return this.substring( 0, this.length - many );
};
String.prototype.endsWith       = function( str ){
	return this.slice( -str.length ) == str;
};
String.prototype.capitalizeFirst = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.lpad           = function( padString, length ){
	var str = this;
	while ( str.length < length ) {
		str = padString + str; }
	return str;
};

// use full to convert String URL, so that you can use location commands
String.prototype.toLocation     = function(){
	var a = document.createElement('a');
	a.href = this;
	return a;
};
String.prototype.toStyle        = function( styleId, append ){
    append = append || 'head';
    var cssID,
        cssSplit = this.split('¤'),
        cssStyled = cssSplit.pop().formatString();
    styleId = styleId !== undefined ? styleId : cssSplit.shift();
    cssID = $( append + ' #' + styleId );
    cssID.length
        ? cssID.html( cssStyled )
        : $( $( '<style/>',{ id: styleId, class:'mySuperStyles', html: cssStyled } ) ).appendTo( append );
};

String.prototype.HTMLEncodedParserHTML = function(){
    return $('<div/>').html( $( $.parseHTML( decodeURI(this) ) ) ).contents();
};
String.prototype.strParserHTML  = function(){
    return $($.parseHTML(this));
};
String.prototype.strDOMParser   = function(){
    return new DOMParser().parseFromString(this, "text/html");
};
String.prototype.str2html       = function(){
	return $('<div/>').html( this ).contents();
};

String.prototype.autoCopyToClipboard = function( cssElement, how ) {
	cssElement = cssElement || 'body';
	how = how || 'append';

	var mainID = 'autoCopyToClipboard',
		copyThis = $( '#' + mainID );

	$( cssElement )[ how ](
		$('<div/>',{ id: mainID + 'Wrapper', style: 'position:relative;' }).append(
			$('<textarea/>',{
				id: mainID, rows:"5", cols:"500", type:"text", value: this.toString(),
				style: 'position:absolute; top:-300px; display:block;' }) ) );

	setTimeout(function (){
        copyThis.focus().select();
        document.execCommand("copy");
        var remove = setInterval(function(){
			$( '#' + mainID + 'Wrapper' ).ifExists(function( $this ){
				$this.remove();
				clearInterval( remove );
			});
		},8);
    },2);
};

//HTMLObjectElement.prototype.obj2Str = function(){var objArr = $.makeArray( this ); return objArr[0].outerHTML;};
/*
 String.prototype.replaceAll = function( target, replacement ) {
 return this.split(target).join(replacement);
 };
 */
function ScrollZoomTune( selection, zooms, tune, ani, speed ){
	//ScrollZoomTune("div.thumb .title a",1,-25,1,'slow');
	var body = $('body'), sel = $( selection), position;
	//noinspection JSValidateTypes
	sel.size() !== 0 && (
		body.css('zoom',zooms),
			position = sel.position().top + tune,
			ani === 1
				? body.animate({ scrollTop: position * zooms }, speed )
				: body.scrollTop( position * zooms )
	);
}
function refreshElement( elem , speed ){ //refreshElement('.videoPlayer','slow');
	var $elem = $( elem ), data = $elem.html();
	$elem.empty().html( data ).fadeIn( speed );
}

!!$.isFunction( $.fn.execCommand ) || ($.fn.execCommand = function(){});

function autoCopy2Clipboard( input, cssElement, how ){
	cssElement = cssElement || 'body';
	how = how || 'append';

	var mainID = 'autoCopyToClipboard',
		copyThis = $( '#' + autoCopyToClipboard );

	'#autoCopyToClipboard { position:absolute; top:-300px; display:block; }'.toStyle( mainID );
	$( cssElement )[ how ]( $('<textarea/>',{ id:mainID, rows:"5", cols:"500", type:"text", value: input }) );

	copyThis.focus().select();
	document.execCommand("copy");
	copyThis.remove();
}
function toStyle( styleId, str, append ){
	append = append || 'head';
	var $id = $( append + ' #' + styleId ),
		cssID = str.formatString();

	$id.length
		? $id.html( cssID )
		: $( $( '<style/>',{ id: styleId, class:'mySuperStyles', html: cssID } ) ).appendTo( append );
}
function getTheStyle( id ){
    var elem = document.getElementById("elem-container");
    var theCSSprop;
    theCSSprop = window.getComputedStyle(elem, null).getPropertyValue("height");
    document.getElementById("output").innerHTML = theCSSprop;
}
function obj2Str( obj ){
	var objArr = $.makeArray(obj);
	return objArr[0].outerHTML;
}
function orderBy(key, reverse){
    return function (a, b) {
        return ( reverse || false ) ? b[ key ] - a[ key ] : a[ key ] - b[ key ];
    };
}
function sortBy(key, reverse){
    var R = reverse || false;
    return function (a, b) {
        var A = a[ key ], B = b[ key ];
        return A < B ? R ? 1 : -1 : A > B ? R ? -1 : 1 : 0;
    };
}
function sortByOLD(key, reverse){
	// Usage: array.sort( sortBy( key, reverse ) )
	// Move smaller items towards the front
	// or back of the array depending on if
	// we want to sort the array in reverse
	// order or not.
	var moveSmaller = reverse ? 1 : -1;
	// Move larger items towards the front
	// or back of the array depending on if
	// we want to sort the array in reverse
	// order or not.
	var moveLarger = reverse ? -1 : 1;
	/**
	 * @param  {*} a
	 * @param  {*} b
	 * @return {Number}
	 */
	return function (a, b) {
		if (a[key] < b[key]) {
			return moveSmaller;
		}
		if (a[key] > b[key]) {
			return moveLarger;
		}
		return 0;
	};
}

/**
 @function sec2timeFormat
 @description convert second to time format in 4+ different ways into @example DD:HH:MM:SS.ms
 @param {(string|Number)} totalSeconds - @desc it will convert to millisecond inside of @function
 @param {Boolean} [complete] - @example true 02:45:05 or 02h 45m 05s false 2:45:05 or 2h 45m 05s
 @param {(string|Boolean)} [divider] - @example common ':' or '-' or '/'
 @param {Number} [toFix] - @desc millisecond after second - @default 2 - @example 45:05.44 or 5.44s
 @return {string}
 @copyright May 2017 - Magnus Fohlström
 @license MIT
 */
function sec2timeFormat( totalSeconds, complete, divider, toFix ){
    totalSeconds = typeof totalSeconds === 'string' ? parseInt(totalSeconds) : totalSeconds;
    toFix = toFix !== undefined ? ( toFix === 0 ? 0 : toFix ) : 2;
    var bFull = complete !== undefined ? complete && true : false,
        div = divider !== undefined ? divider !== false : false,

        date = new Date( totalSeconds * 1000 ),
        d = Math.floor( totalSeconds / 3600 / 24 ),
        //    d = date.getUTCDate() - 1,
        h = date.getUTCHours(),
        m = date.getUTCMinutes(),
        s = date.getSeconds(),
        ms = totalSeconds - Math.floor( totalSeconds ),

        preD = div ? divider : 'd ', dPreD = d + preD,
        dd = bFull
            ? d === 0 ? '00' + preD : (d < 10 ? '0':'') + dPreD
            : d === 0 ? '' : dPreD,

        preH = div ? divider : 'h ', hPreH = h + preH,
        hh = dd.length > 0
            ? h === 0 ? '00' + preH : (h < 10 ? '0':'') + hPreH
            : h === 0 ? bFull ? h < 10 ? '0' + hPreH : hPreH : '' : hPreH,

        preM = div ? divider : 'm ', mPreM = m + preM,
        mm = hh.length > 0
            ? m === 0 ? '00' + preM : (m < 10 ? '0':'') + mPreM
            : m === 0 ? bFull ? m < 10 ? '0' + mPreM : mPreM : '' : mPreM,

        preMS = ( s + ms ).toFixed( toFix ),
        preS = div ? '' : 's', sPreS =  preMS + preS,
        ss = mm.length > 0
            ? s === 0 ? '00' + preS : (s < 10 ? '0':'') + sPreS
            : sPreS;

    return ( dd + hh + mm + ss ).toString();
}

function VideoTitleA( elem , state ){
	//VideoTitleA("div.thumb .title a",'on');
	$( elem ).each(function(){
		var $this    = $(this),
			strTitle = $this.attr('title'),
			strText  = $this.attr('data-text'),
			strHtml  = $this.text();
		state === 'on' ? $this.text(strTitle).attr('data-text',strHtml) : $this.text(strText);
	});
}
/**
 * @return {string}
 */
function MultiString( f ){
	return f.toString().split('\n').slice(1, -1).join('\n');
}
function wrapWithTag( tag, text, selection ){
	var thisAttr = selection != undefined && selection.startsWith('.') ? 'class' : selection.startsWith('#') && 'id',
		thisTag = $('<' + tag + '/>', { text: text });
	return thisAttr.length ? thisTag.attr( thisAttr, selection.splice( 1 ) ) : thisTag;
}

function clean( node ) {
	/*
	 So to clean those unwanted nodes from inside the <body> element, you would simply do this:

	 clean(document.body);
	 Alternatively, to clean the entire document, you could do this:

	 clean(document);
	 */
	for( var n = 0; n < node.childNodes.length; n ++ ){
		var child = node.childNodes[ n ];
		( child.nodeType === 8 || ( child.nodeType === 3 && !/\S/.test( child.nodeValue ) ) )
			? (
			node.removeChild( child ),
				n --
		)
			: child.nodeType === 1 && clean( child );
	}
}
function commentsCleaner( array ){
	array = array === undefined ? [ '*', document, 'html' ] : array;

	// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
	// http://stackoverflow.com/a/2364760
	$.each( array, function( i, e ) {
		$( e ).contents().each( function() {
			this.nodeType === Node.COMMENT_NODE  && $( this ).remove(); }); });
}
function clearSelection() {
    var sel;
    if ( (sel = document.selection) && sel.empty ) {
        sel.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var activeEl = document.activeElement;
        if (activeEl) {
            var tagName = activeEl.nodeName.toLowerCase();
            if ( tagName == "textarea" ||
                (tagName == "input" && activeEl.type == "text") ) {
                // Collapse the selection to the end
                activeEl.selectionStart = activeEl.selectionEnd;
            }
        }
    }
}
function newUrlNoReload( title, url ){
	window.history.pushState("string", title, url );
}
function inURLo( search, exact ){
	exact = exact || false;
	var winLoc = window.location.href;
	return exact ? winLoc === search : winLoc.search( search ) !== -1;
}
function inURLe( search, exact ){
	exact = exact || false;
	var inArr,
		winLoc = window.location.href,
		tiA = function( search ){
			inArr = false;
			$.each( search, function(i,e){
				if( winLoc.search( search ) !== -1 ){
					inArr = true;
					return false;
				}
			});
			return inArr;
		};
	return exact ? winLoc === search : $.isArray( search ) ? tiA( search ) : winLoc.search( search ) !== -1;
}
function inURL( search, exact ){

	var isAll,isNone,inArr,checkInArr,
		winLoc = window.location.href,
		countAll = 0, countNone = 0;

	exact = exact || false;
	isAll = exact === 'all';
	isNone = exact === 'none';
	exact = isNone || isAll ? false : exact;

	checkInArr = function( search, all ){
		inArr = false;
		$.each( search, function( i, e ){
            if(winLoc.search( e ) !== -1 || winLoc.search( e ) === -1){
                inArr = true;
                if( all ) winLoc.search( e ) !== -1 ? countAll++ : winLoc.search( e ) === -1 && countNone++;
                else return false;
            }
/*
            if( winLoc.search( e ) !== -1 ){
				inArr = true;
				if( all ) countAll++; else return false;
			}
			else if( winLoc.search( e ) === -1 ){
				inArr = true;
				if( all ) countNone++; else return false;
			}
*/
		});
		return all ? inArr && ( search.length === countAll || search.length === countNone ) : inArr;
	};

	return 	exact
		? winLoc === search
		: $.isArray( search )
			? checkInArr( search, isAll || isNone )
			: isNone
				? winLoc.search( search ) === -1
				: winLoc.search( search ) !== -1;
}
function loadDoc( href ){
	$( location ).attr('href', href );
}

function isPrimitiveType( value ){
	// will return true if the value is a primitive value
	switch ( typeof value ) {
		case 'string': case 'number': case 'boolean': case 'undefined': {
		return true;
	}
		case 'object': {
			return !value;
		}
	}
	return false;
}
function checkDividedIsInteger( num, div ){
	return ( num % div === 0 );
}
function isEven( value ){
	return ( value % 2 === 0 );
}
function inDom( array, onElement ) {
	var found = false,
		isArrayFN = function(){
			$.each( array, function( i, value ){

				value = onElement !== undefined
					? onElement + value
					: value;

				if( $( value ).length ){
					found = true;
					return false;
				}
			});
		};

	$.isArray( array )
		? isArrayFN()
		: $( array ).length && ( found = true );

	/**
	 * @return {boolean}
	 */
	return found;
}
function isHTMLObject( obj ){
	obj = typeof obj == 'string' ? obj : $( obj );
	return obj.length
		? !!~( obj instanceof HTMLElement || obj[0] instanceof HTMLElement)
		: !!( obj && ( obj.nodeName || ( obj.prop && obj.attr && obj.find ) ) );
}

function isFunction( functionToCheck ){
	var getType = {};
	return functionToCheck && getType.toString.call( functionToCheck ) === '[object Function]';
}
function isNumeric( value ){
	return /^\d+$/.test( value );
}
function is_Numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function parse_Boolean( Boolean, onNull, nullIs ) {
    var falsely = /^(?:f(?:alse)?|no?|off?|n?|failure?|sudumoo?|0+)$/i,
        truely = /^(?:t(?:rue)?|yes?|on?|y?|success?|yabbdoo?|1+)$/i;

    //noinspection JSUnresolvedVariable
    return truely.test( Boolean ) === !!Boolean ? true : falsely.test( Boolean ) === !!Boolean ? false
			: !isNaN(parseFloat( Boolean )) && isFinite( Boolean ) ? true
				: ( onNull || false ) ? bool == null ? nullIs : false : null;
}
function parseBoolean( Boolean , Type ) {
	//    http://stackoverflow.com/a/24744599
	Type = Type || false;
	var falsely = /^(?:f(?:alse)?|no?|0+)$/i,
		truely = /^(?:t(?:rue)?|yes?|1+)$/i;
	return Type ? !truely.test( Boolean ) && !!Boolean : !falsely.test( Boolean ) && !!Boolean;
}
function parseBooleanStyle( str, onNull, nullIs ){
    onNull = onNull || false;
    var bool, $this = this.toString().toLowerCase();
    switch( $this ){
        case 'true':
        case '1':
        case 'on':
        case 'y':
        case 'yes':
            bool = true;
            break;
        case 'false':
        case '0':
        case 'off':
        case 'n':
        case 'no':
            bool = false;
            break;
        default:
            bool = typeof bool === 'boolean' ? bool : null;
            break;
    }
    return ( onNull || false ) && ( bool == null && nullIs || false ) || parseInt( $this ) !== 0 || bool;
}

/**
 * Search for correct object in array and return it.
 * @function getObjKeyVal
 * @param {Array} array - The array you wanna search trough
 * @param {string} findKey - The key to search for
 * @param {string} exactValue - Check correct key is found
 * @param {string} [getObjKeyVal]  - get a key value in that object
 */
function getObjKeyVal( array, findKey, exactValue, getObjKeyVal ){
    var obj, node;
    for( node in array )
        for( findKey in obj = array[ node ] )
            if( obj.hasOwnProperty( findKey ) && obj[ findKey ] == exactValue )
                return getObjKeyVal || false ? obj[ getObjKeyVal ] : obj;
    return false;
}
/**
 * Search for all matched objects in array and return those.
 * @function getAllMatchedObj
 * @param {Array} array - The array you wanna search trough
 * @param {string} findKey - The key to search for
 * @param {string} exactValue - Check correct key found
 */
function getAllMatchedObj( array, findKey, exactValue ){
    var newArr = [], obj, node;
    for( node in array )
        for( findKey in obj = array[ node ] )
            if( obj.hasOwnProperty( findKey ) && obj[ findKey ] == exactValue ) newArr.push( obj );
    return newArr;
}
/**
 * Search for all matched objects in array and return those.
 * @function getAllMatchedObjByObject
 * @param {Array} mainArray - The array you wanna search trough
 * @param {Array} filterObject - Is one array object to match object in main array,
 * this object has multiple keys one each for a search criteria example "{ joined:'2012', rank:5, gender:'female' }"
 */
function getAllMatchedObjByObject( mainArray, filterObject ){
    var newArr = [], objectCount = 0, mainLen = mainArray.length, mainObj, filterLen;
    for ( objectCount; objectCount != mainLen; objectCount++ ){

        mainObj = mainArray[ objectCount ];
        filterLen = Object.keys( filterObject ).length;

        Object.keys( filterObject ).forEach( function( filterKey, index ){
            mainObj.hasOwnProperty( filterKey ) && mainObj[ filterKey ] == filterObject[ filterKey ] && ++index === filterLen && newArr.push( mainObj );
        });
    }
    return newArr;
}
/**
 * Do something with an array then return it
 * @function arrayDo
 * @param {string} what - what function is going to be used on an array
 * @param {(string|string[])} array - The array you wanna search trough
 * @param {string} findKey - The key to search for
 * @param {string} [keyValue] - Check correct key found
 * @param {string} [getKeyVal] - Get a key value from correct object found, or add in conjunction with newVal
 * @param {string} [newVal] - Set a new Value to a key
 */
function arrayDo( what, array, findKey, keyValue, getKeyVal, newVal) {

    what = what === 'newKey' ? 'updateKey' : what;
	/*
		index = array.findIndex( function( obj ){
	 		return obj.hasOwnProperty( findKey ) && obj[ findKey ] === keyValue;
	 	})
	*/
    var index = -1, i=0, len = array.length;

  //  if( !!~$.inArray( doWhat, ['allMatched','add','sort'] ) === true )
        for ( i; i != len ; i++ ) {
            var obj = array[ i ];
            if( obj.hasOwnProperty( findKey ) && obj[ findKey ] === keyValue ){
            	c.i('inArray',obj[ findKey ]);
                index = i;
                break;
            }
        }

    var object = array[ index ],
        doWhat = {
            find        : function(){
                array = object;
            },
            remove      : function(){
                index !== -1 && array.splice( index, 1 );
            },
            keyVal      : function(){
                var obj = object[ getKeyVal ];
                array = obj !== undefined ? obj : '';
            },
            updateKey   : function(){ //newKey
            /*    c.i('updateKey array ', JSON.stringify( array ) )
                c.i('updateKey index ', index )
                c.i('updateKey Value ', keyValue)
                c.i('updateKey newVal', newVal )
                c.i('getKeyVal before', array[ index ] )
                c.i('updateKey', '____________________')
            */
                index !== -1 && ( array[ index ][ getKeyVal ] = newVal );
            //    c.i('getKeyVal after ', array[ index ] )
            },
            deleteKey   : function(){
                index !== -1 && delete array[ index ][ getKeyVal ];
            },
            add         : function(){
                array.push( newVal );
            },
            sort        : function(){
                array.sort( sortBy( findKey, keyValue ) );
            },
			allMatched  : function(){
                var newArr = [], i = 0,
                    secondMatch = ( getKeyVal !== undefined && newVal !== undefined );

                for ( i; i != len; i++ ) {
                    var obj = array[ i ];
                    ( obj.hasOwnProperty( findKey ) && obj[ findKey ] === keyValue )
                        && ( secondMatch ? ( obj.hasOwnProperty( getKeyVal ) && obj[ getKeyVal ] === newVal ) : true )
                            && newArr.push( obj );
                }

                array = newArr;
            }
        };

    doWhat[ what ]();
    return array;
}

function getsComputedStyle( style, elem ) {
	elem = elem || 'body';
	return window.getComputedStyle( document[ elem ] )[ style ] !== undefined;
}
function isPropertySupported( property, elem ){
	elem = elem || 'body';
	return property in document[ elem ].style;
}
function cssPropertyValueSupported( prop, value, elem ) {
	//cssPropertyValueSupported('width', '1px');
	elem = elem || 'div';
	var d = document.createElement( elem );
	d.style[ prop ] = value;
	return d.style[ prop ] === value;
}

var cssSupports = (function(){
	// http://code.tutsplus.com/tutorials/quick-tip-detect-css3-support-in-browsers-with-javascript--net-16444
	/*
	 if ( supports('textShadow') ) {
	 document.documentElement.className += ' textShadow';
	 }
	 */
	var div = document.createElement('div'),
		vendors = 'Khtml Ms O Moz Webkit'.split(' '),
		len = vendors.length;

	return function(prop) {
		if ( prop in div.style ) return true;

		prop = prop.replace(/^[a-z]/, function(val) {
			return val.toUpperCase();
		});

		while(len--) {
			if ( vendors[len] + prop in div.style ) {
				// browser supports box-shadow. Do what you need.
				// Or use a bang (!) to test if the browser doesn't.
				return true;
			}
		}
		return false;
	};
})();

function toggleClassState( config, Class, state, elem ){
	config === undefined ? window.config = {} : config;
	config = config || ( window.config = {} );

	config[ Class ] = typeof state === 'string' ? !config[ Class ] : state;
	$( elem || 'html' )[ config[ Class ] ? 'addClass' : 'removeClass' ]( Class );
	$( elem || 'html' ).attr('class');
}
function filterClick( e, $this ){
	return e.which == 1 && e.target == $this;
}
function dispatchEventResize() {
	//noinspection JSClosureCompilerSyntax,JSUnresolvedFunction
	window.dispatchEvent(new Event('resize'));
}

/**
 * @return {string}
 */
function Undefined( check, replace ){
	return check === undefined ? replace.toString() : check.toString();
}
function checkJqueryUI( maxCount, timeout, module ){
    //noinspection JSUnresolvedVariable
    if( typeof jQuery.ui != 'undefined' ){
        //noinspection JSUnresolvedVariable
        return module != undefined ? typeof jQuery.ui[ module ] != 'undefined' : true; }
    else
        setTimeout(function(){
            if( counter.setGet('chkJQ') > maxCount ){
            	counter.del('chkJQ');
            	return false;
            }
            else checkJqueryUI( maxCount, timeout );
        }, timeout );
}

function getGlobal(){
	return (function(){
		return this;
	})();
}
function GM_lister( remove, item ){
	var keys = GM_listValues();
	for (var i = 0, key = null; key = keys[i]; i++) {
		GM_listValues()[i] !== undefined && (
			c.i('GM_ListItem: ' + GM_listValues()[i] + ':', GM_getValue(key)),
			( ( item !== undefined && GM_listValues()[i].inElem( item ) ) || item === undefined )
			&& ( remove === true || remove === 'yes' || remove === 1 ) && GM_deleteValue(key));
	}
}

function roundFloat( num, dec ){
	var d = 1;
	for ( var i=0; i<dec; i++ ){
		d += "0";
	}
	return Math.round(num * d) / d;
}
function randomFloatBetween( min, max, dec ){
	dec = typeof( dec ) == 'undefined' ? 2 : dec;
	return parseFloat( Math.min( min + ( Math.random() * ( max - min ) ), max ).toFixed( dec ) );
}
function random( max ) {
	var min = 1,
		rand = function(){
			return Math.floor( Math.random() * ( max - min + 1 ) + min );
		},
		num1 = rand(),
		num2 = rand();

	return ( num1 > num2 ? num2/num1 : num1/num2 ) * max;
}
function roundNearPeace( number, peaces, dec ) {
	return ( Math.round( number * peaces ) / peaces ).toFixed( dec );
}

var w = window,
	glob = w,
	$w = $( w ),
	$l = $( location ),
	locDoc = window.location.href,
	d = document,
	$d = $( d ),

	c = {
		defaultState: 3,
		cute : function( type, msg, color ) {
			color = color || "black";
			var newColor, bgc = "White";
			switch ( color ) {
				case "success":  newColor = "Green";      bgc = "LimeGreen";       break;
				case "info":     newColor = "DodgerBlue"; bgc = "Turquoise";       break;
				case "error":    newColor = "Red";        bgc = "Black";           break;
				case "start":    newColor = "OliveDrab";  bgc = "PaleGreen";       break;
				case "warning":  newColor = "Tomato";     bgc = "Black";           break;
				case "end":      newColor = "Orchid";     bgc = "MediumVioletRed"; break;
				default: //noinspection SillyAssignmentJS
					newColor = color;
			}

			typeof msg == "object" ?
				window.console[ type ]( msg )
				: typeof color == "object" ? (
				window.console[ type ]("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;"),
					window.console[ type ]( newColor )
			) :
				window.console[ type ]("%c" + msg, "color:" + newColor + "; background-color: " + bgc + ";");
		},
		show: function( showThis, type ){
			var State = GM_getValue( type + 'StateValue' ) || this.defaultState;
			return showThis !== 0 && State !== 0 && State === ( showThis || State ) || State === 'all';
		},
		pre: function( type, name, fn, line, color ){
			line = line == undefined ? '' : line + ': ';
			/**
			 * @return {string}
			 */
			var Fn = function(){ return fn !== undefined ? fn : ''; };
			typeof fn == "object"
				? window.console[ type ]( name, Fn() )
				: c.cute( type, line + name + ': ' + Fn(), color );
		},
		type: function( type, name, fn, line, color, showThis ){
			this.show( showThis, type ) && this.pre( type, name, fn, line, color );
		},
		l: function( name, fn, line, color, showThis ){
			this.type( 'log', name, fn, line, color, showThis );
		},
		h: function( name, fn, line, color, showThis ){
			this.type( 'handled', name, fn, line, color, showThis );
		},
		//c.l('name', 'fn'=='fn', 'line', 'blue')
		i: function( name, fn, line, color, showThis ){
			this.type( 'info', name, fn, line, color, showThis );
		},
		d: function( name, fn, line, color, showThis ){
			this.type( 'debug', name, fn, line, color, showThis );
		}
	},
	localStorageObj = {
		name        : 'setName', //important
		localArray  : function(){
			return window.localStorage.getItem( this.name );
		},
		getArray    : function(){
			return this.localArray() === null ? [] : JSON.parse( this.localArray() );
		},
        removeArray : function(){
            window.localStorage.removeItem( this.name );
        },
		stringify   : function( array ){
			c.i('[stringify]', JSON.stringify(array) );
			window.localStorage.setItem( this.name, JSON.stringify(array) );
		},
		check       : function( key, value ){
			var array = this.getArray();
			return array.grepArrayObj('find', key, value );
		},
		viewConsole : function( json ){
			var array = this.getArray();
			// $.toJSON() --- https://github.com/Krinkle/jquery-json/blob/master/src/jquery.json.js
			// array.join('\n');
			c.d( this.name, array ); //debug mode important to make this work
			c.i( this.name, json ? isFunction( $.toJSON() ) ? $.toJSON( array ) : JSON.stringify( array ) : array.toSource() );
		},
		addTo       : function() {

		},
		add         : function( key, value, obj ){
			var array = this.getArray(),
				inA = array.toString();
			c.i('[check array 1]', inA );
			this.check( array, key, value )
			|| (
				array.push( obj ),
					c.i('[Added Object into array]', obj ),
					c.i('[check array 2]', array )
			);
			this.stringify( array );
		},
		remove      : function( key, value, obj ){
			var array = this.getArray();
			this.check( array, key, value )
			&& (
				array = array.grepArrayObj('remove', key, value ),
					c.i('[Removed Object from array]', obj )
			);
			this.stringify( array );
		}
	},
	booleanTimer = {
		timers  : [],
		start   : function( name, ms ){
			var that = this, value = name,
				stop = setTimeout(function(){
					that.stop( value );
				}, ms );
			this.timers.push( { 'name': value, stop:stop } );
			//setTimeout(function(){that.stop( value );}, ms );
		},
		check   : function( value ){
			return this.timers.grepArrayObj( 'find', 'name', value ) !== undefined;
		},
		stop    : function( value ){
			this.timers = this.timers.grepArrayObj( 'remove', 'name', value );
		}
	},
	advTimer = {
		timers  : [],
		start   : function( name, ms ){
			var that = this, value = name,
				stop = setTimeout(function(){
					that.stop( value );
				}, ms );
			//noinspection JSUnresolvedVariable
			this.timers.push({ 'name':value, start:window.performance.now(), timeout:ms, stop:stop });
		},
		check   : function( value ){
			var findObj = this.timers.grepArrayObj( 'find', 'name', value );
			//noinspection JSUnresolvedVariable
			return findObj !== undefined
				? findObj.timeout - ( window.performance.now() - findObj.start )
				: false;
		},
		stop    : function( value ){
			this.timers = this.timers.grepArrayObj( 'remove', 'name', value );
		}
	},
	lap     = {
		data : {},
		tid  : function(){
			//noinspection JSUnresolvedVariable
			return performance.now();
		},
		set  : function(name){
			this.data[name] = this.tid();
		},
		get  : function(name){
			return this.tid() - this.data[name];
		},
		end  : function(name){
			this.print(name);
			this.del(name);
		},
		del  : function(name){
			delete this.data[name];
		},
		print: function(name){
			var get = this.get( name );
			c.i( 'Lap: ' + name,  isNaN( get ) ? 'There is no such a name ' : get + 'ms' );
		}
	},
	timer   = {
		ms  : 0,
		set : function(ms){
			var that = this;
			this.ms = ms;
			setTimeout(function(){
				that.ms = 0;
			}, ms );
		}
	},
    counter = {
        data    : {},
        setGet	: function(name, decrease, reset) {

            this.exists(name) && ( reset || false )
				&& this.set(name,0);

			this.exists(name)
				? this[ ( decrease || false ) ? 'decrease' : 'increase' ](name)
				: this.set(name);

            return this.get(name);
        },
        set     : function(name, start, base){
            this.data[name] = start || 0;
            this.data[name+'Default'] = base || 1;
        },
        get     : function(name){
            return this.data[name];
        },
        is      : function(name, count){
            return this.data[name] === count;
        },
        lessThen: function(name, count, equal ){
            return ( equal || false ) ? this.data[name] <= count : this.data[name] < count;
        },
        moreThen: function(name, count, equal){
            return ( equal || false ) ? this.data[name] >= count : this.data[name] > count;
        },
        del     : function(name){
            delete this.data[name];
        },
        exists  : function(name) {
            return this.data[name] !== undefined;
        },
        plus    : function(name, num){
            this.exists(name) || this.set(name);
            this.data[name] = this.data[name] + ( num === undefined ? this.data[name+'Default'] : num );
        },
        minus   : function(name, num){
            this.exists(name) || this.set(name);
            this.data[name] = this.data[name] - ( num === undefined ? this.data[name+'Default'] : num );
        },
        increase: function (name, num) {
            this.plus(name, num);
        },
        decrease: function (name, num) {
            this.minus(name, num);
        },
        '+'     : function (name, num) {
            this.plus(name, num);
        },
        '-'     : function (name, num) {
            this.minus(name, num);
        },
        up      : function (name, num) {
            this.plus(name, num);
        },
        down    : function (name, num) {
            this.minus(name, num);
        },
        add     : function (name, num) {
            this.plus(name, num);
        },
        subtract: function (name, num) {
            this.minus(name, num);
        },
        withdraw: function (name, num) {
            this.minus(name, num);
        }
    },
	g       = {
		locDoc  : window.location.href,
		ms      : 0,
		timer   : function(ms){
			g.ms = ms;
			setTimeout(function(){ g.ms = 0; }, ms );
		},

		GM      : {
			engine : function( mode, val, range ){
				switch (mode){
					case 'set':     GM_setValue( val.name, val.default );
						break;
					case 'get':     range ? config[ val.name ] = GM_getValue( val.name ):
						ui.config[ val.name ] = GM_getValue( val.name );
						break;
					case 'del':     GM_deleteValue( val.name );
				}
			},
			manager : function( mode, array, range ){
				$.each( array, function( i, val ){ this.engine( mode, val, range === undefined ); });
				mode === 'del' && ( GM_deleteValue( 'firstRun' ), GM_deleteValue( 'yourVer' ) );
			}
		}
	},

	testPerformance = function( name, fn, testCycles ) {
		lap.set( name );
		var i = 0;
		for ( i ; i < testCycles; i++ ){
			fn();
		}
		lap.end( name );
	},
	perf = function (testName, fn) {
		var startTime = new Date().getTime();
		fn();
		var endTime = new Date().getTime();
		console.log( testName + ": " + ( endTime - startTime ) + "ms" );
	};

$(document).on('click','*',function(e){
	this == e.target && c.i('target:', $(this)[0] );
});

c.i('my Function Library ÖÖö');
/*
 isScrolledIntoView = (elem) ->
 docViewTop = $(window).scrollTop()
 docViewBottom = docViewTop + $(window).height()
 elemTop = $(elem).offset().top
 elemBottom = elemTop + $(elem).height()

 (elemBottom - 200 < docViewBottom) and (elemBottom + $(elem).height() > docViewBottom )
 */


