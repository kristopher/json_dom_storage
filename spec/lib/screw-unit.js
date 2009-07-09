/*
    json.js
    2008-11-21

    Public Domain

    No warranty expressed or implied. Use at your own risk.

    This file has been superceded by http://www.JSON.org/json2.js

    See http://www.JSON.org/js.html

    This file adds these methods to JavaScript:

        object.toJSONString(whitelist)
            This method produce a JSON text from a JavaScript value.
            It must not contain any cyclical references. Illegal values
            will be excluded.

            The default conversion for dates is to an ISO string. You can
            add a toJSONString method to any date object to get a different
            representation.

            The object and array methods can take an optional whitelist
            argument. A whitelist is an array of strings. If it is provided,
            keys in objects not found in the whitelist are excluded.

        string.parseJSON(filter)
            This method parses a JSON text to produce an object or
            array. It can throw a SyntaxError exception.

            The optional filter parameter is a function which can filter and
            transform the results. It receives each of the keys and values, and
            its return value is used instead of the original value. If it
            returns what it received, then structure is not modified. If it
            returns undefined then the member is deleted.

            Example:


            myData = text.parseJSON(function (key, value) {
                return key.indexOf('date') >= 0 ? new Date(value) : value;
            });

    This file will break programs with improper for..in loops. See
    http://yuiblog.com/blog/2006/09/26/for-in-intrigue/

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:


            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, parseJSON, prototype, push, replace, slice,
    stringify, test, toJSON, toJSONString, toString, valueOf
*/



if (!this.JSON) {
    JSON = {};
}


(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];


        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':


            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);


        case 'object':


            if (!value) {
                return 'null';
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }


                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }


            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }


            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }


    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';


            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }


            return str('', {'': value});
        };
    }



    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {


            var j;

            function walk(holder, key) {


                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }



            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }



            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }


            throw new SyntaxError('JSON.parse');
        };
    }
})();
var Prefs = {
  data: {},

  load: function () {
    var split_cookies = document.cookie && document.cookie.split(';') || [];
    var prefs_string;
    for(var i = 0; i < split_cookies.length; i++) {
      var screw_unit_cookie_prefix = /^ *screw_unit_prefs=/;
      if (split_cookies[i].match(screw_unit_cookie_prefix)) {
        prefs_string = split_cookies[i].replace(/^ *screw_unit_prefs=/, "");
      }
    }

    if (prefs_string) {
      this.data = JSON.parse(unescape(prefs_string));
    }
    return this.data;
  },

  save: function (path, expires) {
    if (!this.data) return;

    var p = path || '/';
    var d = expires || new Date(2020, 02, 02);
    var cookie_string = "screw_unit_prefs=" + escape(JSON.stringify(this.data)) + ';path=' + p + ';expires=' + d.toUTCString()
    document.cookie = cookie_string;
  }
}

Prefs.load();
(function(){
/*
 * jQuery 1.2.6 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-05-24 14:22:17 -0400 (Sat, 24 May 2008) $
 * $Rev: 5685 $
 */

var _jQuery = window.jQuery,
	_$ = window.$;

var jQuery = window.jQuery = window.$ = function( selector, context ) {
	return new jQuery.fn.init( selector, context );
};

var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,

	isSimple = /^.[^:#\[\.]*$/,

	undefined;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		selector = selector || document;

		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			return this;
		}
		if ( typeof selector == "string" ) {
			var match = quickExpr.exec( selector );

			if ( match && (match[1] || !context) ) {

				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				else {
					var elem = document.getElementById( match[3] );

					if ( elem ){
						if ( elem.id != match[3] )
							return jQuery().find( selector );

						return jQuery( elem );
					}
					selector = [];
				}

			} else
				return jQuery( context ).find( selector );

		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document )[ jQuery.fn.ready ? "ready" : "load" ]( selector );

		return this.setArray(jQuery.makeArray(selector));
	},

	jquery: "1.2.6",

	size: function() {
		return this.length;
	},

	length: 0,

	get: function( num ) {
		return num == undefined ?

			jQuery.makeArray( this ) :

			this[ num ];
	},

	pushStack: function( elems ) {
		var ret = jQuery( elems );

		ret.prevObject = this;

		return ret;
	},

	setArray: function( elems ) {
		this.length = 0;
		Array.prototype.push.apply( this, elems );

		return this;
	},

	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	index: function( elem ) {
		var ret = -1;

		return jQuery.inArray(
			elem && elem.jquery ? elem[0] : elem
		, this );
	},

	attr: function( name, value, type ) {
		var options = name;

		if ( name.constructor == String )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		return this.each(function(i){
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text != "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] )
			jQuery( html, this[0].ownerDocument )
				.clone()
				.insertBefore( this[0] )
				.map(function(){
					var elem = this;

					while ( elem.firstChild )
						elem = elem.firstChild;

					return elem;
				})
				.append(this);

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		return this.domManip(arguments, true, false, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},

	before: function() {
		return this.domManip(arguments, false, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, true, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	find: function( selector ) {
		var elems = jQuery.map(this, function(elem){
			return jQuery.find( selector, elem );
		});

		return this.pushStack( /[^+>] [^+>]/.test( selector ) || selector.indexOf("..") > -1 ?
			jQuery.unique( elems ) :
			elems );
	},

	clone: function( events ) {
		var ret = this.map(function(){
			if ( jQuery.browser.msie && !jQuery.isXMLDoc(this) ) {
				var clone = this.cloneNode(true),
					container = document.createElement("div");
				container.appendChild(clone);
				return jQuery.clean([container.innerHTML])[0];
			} else
				return this.cloneNode(true);
		});

		var clone = ret.find("*").andSelf().each(function(){
			if ( this[ expando ] != undefined )
				this[ expando ] = null;
		});

		if ( events === true )
			this.find("*").andSelf().each(function(i){
				if (this.nodeType == 3)
					return;
				var events = jQuery.data( this, "events" );

				for ( var type in events )
					for ( var handler in events[ type ] )
						jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
			});

		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, this ) );
	},

	not: function( selector ) {
		if ( selector.constructor == String )
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ) );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		return this.pushStack( jQuery.unique( jQuery.merge(
			this.get(),
			typeof selector == 'string' ?
				jQuery( selector ) :
				jQuery.makeArray( selector )
		)));
	},

	is: function( selector ) {
		return !!selector && jQuery.multiFilter( selector, this ).length > 0;
	},

	hasClass: function( selector ) {
		return this.is( "." + selector );
	},

	val: function( value ) {
		if ( value == undefined ) {

			if ( this.length ) {
				var elem = this[0];

				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					if ( index < 0 )
						return null;

					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;

							if ( one )
								return value;

							values.push( value );
						}
					}

					return values;

				} else
					return (this[0].value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		if( value.constructor == Number )
			value += '';

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( value.constructor == Array && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(value);

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},

	html: function( value ) {
		return value == undefined ?
			(this[0] ?
				this[0].innerHTML :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ) );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},

	domManip: function( args, table, reverse, callback ) {
		var clone = this.length > 1, elems;

		return this.each(function(){
			if ( !elems ) {
				elems = jQuery.clean( args, this.ownerDocument );

				if ( reverse )
					elems.reverse();
			}

			var obj = this;

			if ( table && jQuery.nodeName( this, "table" ) && jQuery.nodeName( elems[0], "tr" ) )
				obj = this.getElementsByTagName("tbody")[0] || this.appendChild( this.ownerDocument.createElement("tbody") );

			var scripts = jQuery( [] );

			jQuery.each(elems, function(){
				var elem = clone ?
					jQuery( this ).clone( true )[0] :
					this;

				if ( jQuery.nodeName( elem, "script" ) )
					scripts = scripts.add( elem );
				else {
					if ( elem.nodeType == 1 )
						scripts = scripts.add( jQuery( "script", elem ).remove() );

					callback.call( obj, elem );
				}
			});

			scripts.each( evalScript );
		});
	}
};

jQuery.fn.init.prototype = jQuery.fn;

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

function now(){
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if ( typeof target != "object" && typeof target != "function" )
		target = {};

	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		if ( (options = arguments[ i ]) != null )
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				if ( target === copy )
					continue;

				if ( deep && copy && typeof copy == "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep,
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	return target;
};

var expando = "jQuery" + now(), uuid = 0, windowData = {},
	exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	defaultView = document.defaultView || {};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName &&
			fn.constructor != Array && /^[\s[]?function/.test( fn + "" );
	},

	isXMLDoc: function( elem ) {
		return elem.documentElement && !elem.body ||
			elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	globalEval: function( data ) {
		data = jQuery.trim( data );

		if ( data ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.browser.msie )
				script.text = data;
			else
				script.appendChild( document.createTextNode( data ) );

			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( !id )
			id = elem[ expando ] = ++uuid;

		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};

		if ( data !== undefined )
			jQuery.cache[ id ][ name ] = data;

		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				delete jQuery.cache[ id ][ name ];

				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		} else {
			try {
				delete elem[ expando ];
			} catch(e){
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			delete jQuery.cache[ id ];
		}
	},

	each: function( object, callback, args ) {
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length == undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		} else {
			if ( length == undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	prop: function( elem, value, type, i, name ) {
		if ( jQuery.isFunction( value ) )
			value = value.call( elem, i );

		return value && value.constructor == Number && type == "curCSS" && !exclude.test( name ) ?
			value + "px" :
			value;
	},

	className: {
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		remove: function( elem, classNames ) {
			if (elem.nodeType == 1)
				elem.className = classNames != undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );
					}).join(" ") :
					"";
		},

		has: function( elem, className ) {
			return jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	swap: function( elem, options, callback ) {
		var old = {};
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force ) {
		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
				var padding = 0, border = 0;
				jQuery.each( which, function() {
					padding += parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					border += parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
				val -= Math.round(padding + border);
			}

			if ( jQuery(elem).is(":visible") )
				getWH();
			else
				jQuery.swap( elem, props, getWH );

			return Math.max(0, val);
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style;

		function color( elem ) {
			if ( !jQuery.browser.safari )
				return false;

			var ret = defaultView.getComputedStyle( elem, null );
			return !ret || ret.getPropertyValue("color") == "";
		}

		if ( name == "opacity" && jQuery.browser.msie ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}
		if ( jQuery.browser.opera && name == "display" ) {
			var save = style.outline;
			style.outline = "0 solid black";
			style.outline = save;
		}

		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && style && style[ name ] )
			ret = style[ name ];

		else if ( defaultView.getComputedStyle ) {

			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle && !color( elem ) )
				ret = computedStyle.getPropertyValue( name );

			else {
				var swap = [], stack = [], a = elem, i = 0;

				for ( ; a && color(a); a = a.parentNode )
					stack.unshift(a);

				for ( ; i < stack.length; i++ )
					if ( color( stack[ i ] ) ) {
						swap[ i ] = stack[ i ].style.display;
						stack[ i ].style.display = "block";
					}

				ret = name == "display" && swap[ stack.length - 1 ] != null ?
					"none" :
					( computedStyle && computedStyle.getPropertyValue( name ) ) || "";

				for ( i = 0; i < swap.length; i++ )
					if ( swap[ i ] != null )
						stack[ i ].style.display = swap[ i ];
			}

			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];


			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	clean: function( elems, context ) {
		var ret = [];
		context = context || document;
		if (typeof context.createElement == 'undefined')
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		jQuery.each(elems, function(i, elem){
			if ( !elem )
				return;

			if ( elem.constructor == Number )
				elem += '';

			if ( typeof elem == "string" ) {
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				var tags = jQuery.trim( elem ).toLowerCase(), div = context.createElement("div");

				var wrap =
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||

					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||

					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||

					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					jQuery.browser.msie &&
					[ 1, "div<div>", "</div>" ] ||

					[ 0, "", "" ];

				div.innerHTML = wrap[1] + elem + wrap[2];

				while ( wrap[0]-- )
					div = div.lastChild;

				if ( jQuery.browser.msie ) {

					var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
						div.firstChild && div.firstChild.childNodes :

						wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
							div.childNodes :
							[];

					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );

					if ( /^\s/.test( elem ) )
						div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );

				}

				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.length === 0 && (!jQuery.nodeName( elem, "form" ) && !jQuery.nodeName( elem, "select" )) )
				return;

			if ( elem[0] == undefined || jQuery.nodeName( elem, "form" ) || elem.options )
				ret.push( elem );

			else
				ret = jQuery.merge( ret, elem );

		});

		return ret;
	},

	attr: function( elem, name, value ) {
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var notxml = !jQuery.isXMLDoc( elem ),
			set = value !== undefined,
			msie = jQuery.browser.msie;

		name = notxml && jQuery.props[ name ] || name;

		if ( elem.tagName ) {

			var special = /href|src|style/.test( name );

			if ( name == "selected" && jQuery.browser.safari )
				elem.parentNode.selectedIndex;

			if ( name in elem && notxml && !special ) {
				if ( set ){
					if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
						throw "type property can't be changed";

					elem[ name ] = value;
				}

				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
					return elem.getAttributeNode( name ).nodeValue;

				return elem[ name ];
			}

			if ( msie && notxml &&  name == "style" )
				return jQuery.attr( elem.style, "cssText", value );

			if ( set )
				elem.setAttribute( name, "" + value );

			var attr = msie && notxml && special
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			return attr === null ? undefined : attr;
		}


		if ( msie && name == "opacity" ) {
			if ( set ) {
				elem.zoom = 1;

				elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
					(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
			}

			return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
				"";
		}

		name = name.replace(/-([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});

		if ( set )
			elem[ name ] = value;

		return elem[ name ];
	},

	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		if( array != null ){
			var i = array.length;
			if( i == null || array.split || array.setInterval || array.call )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		var i = 0, elem, pos = first.length;
		if ( jQuery.browser.msie ) {
			while ( elem = second[ i++ ] )
				if ( elem.nodeType != 8 )
					first[ pos++ ] = elem;

		} else
			while ( elem = second[ i++ ] )
				first[ pos++ ] = elem;

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});

var userAgent = navigator.userAgent.toLowerCase();

jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

var styleFloat = jQuery.browser.msie ?
	"styleFloat" :
	"cssFloat";

jQuery.extend({
	boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",

	props: {
		"for": "htmlFor",
		"class": "className",
		"float": styleFloat,
		cssFloat: styleFloat,
		styleFloat: styleFloat,
		readonly: "readOnly",
		maxlength: "maxLength",
		cellspacing: "cellSpacing"
	}
});

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ) );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1)
			this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames ) {
		jQuery.className[ jQuery.className.has( this, classNames ) ? "remove" : "add" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).r.length ) {
			jQuery( "*", this ).add(this).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		jQuery( ">*", this ).remove();

		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.each([ "Height", "Width" ], function(i, name){
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		return this[0] == window ?
			jQuery.browser.opera && document.body[ "client" + name ] ||

			jQuery.browser.safari && window[ "inner" + name ] ||

			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] || document.body[ "client" + name ] :

			this[0] == document ?
				Math.max(
					Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]),
					Math.max(document.body["offset" + name], document.documentElement["offset" + name])
				) :

				size == undefined ?
					(this.length ? jQuery.css( this[0], type ) : null) :

					this.css( type, size.constructor == String ? size : size + "px" );
	};
});

function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ?
		"(?:[\\w*_-]|\\\\.)" :
		"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
	quickChild = new RegExp("^>\\s*(" + chars + "+)"),
	quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
	quickClass = new RegExp("^([#.]?)(" + chars + "*)");

jQuery.extend({
	expr: {
		"": function(a,i,m){return m[2]=="*"||jQuery.nodeName(a,m[2]);},
		"#": function(a,i,m){return a.getAttribute("id")==m[2];},
		":": {
			lt: function(a,i,m){return i<m[3]-0;},
			gt: function(a,i,m){return i>m[3]-0;},
			nth: function(a,i,m){return m[3]-0==i;},
			eq: function(a,i,m){return m[3]-0==i;},
			first: function(a,i){return i==0;},
			last: function(a,i,m,r){return i==r.length-1;},
			even: function(a,i){return i%2==0;},
			odd: function(a,i){return i%2;},

			"first-child": function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},
			"last-child": function(a){return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;},
			"only-child": function(a){return !jQuery.nth(a.parentNode.lastChild,2,"previousSibling");},

			parent: function(a){return a.firstChild;},
			empty: function(a){return !a.firstChild;},

			contains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])>=0;},

			visible: function(a){return "hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden";},
			hidden: function(a){return "hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden";},

			enabled: function(a){return !a.disabled;},
			disabled: function(a){return a.disabled;},
			checked: function(a){return a.checked;},
			selected: function(a){return a.selected||jQuery.attr(a,"selected");},

			text: function(a){return "text"==a.type;},
			radio: function(a){return "radio"==a.type;},
			checkbox: function(a){return "checkbox"==a.type;},
			file: function(a){return "file"==a.type;},
			password: function(a){return "password"==a.type;},
			submit: function(a){return "submit"==a.type;},
			image: function(a){return "image"==a.type;},
			reset: function(a){return "reset"==a.type;},
			button: function(a){return "button"==a.type||jQuery.nodeName(a,"button");},
			input: function(a){return /input|select|textarea|button/i.test(a.nodeName);},

			has: function(a,i,m){return jQuery.find(m[3],a).length;},

			header: function(a){return /h\d/i.test(a.nodeName);},

			animated: function(a){return jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length;}
		}
	},

	parse: [
		/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

		/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

		new RegExp("^([:.#]*)(" + chars + "+)")
	],

	multiFilter: function( expr, elems, not ) {
		var old, cur = [];

		while ( expr && expr != old ) {
			old = expr;
			var f = jQuery.filter( expr, elems, not );
			expr = f.t.replace(/^\s*,\s*/, "" );
			cur = not ? elems = f.r : jQuery.merge( cur, f.r );
		}

		return cur;
	},

	find: function( t, context ) {
		if ( typeof t != "string" )
			return [ t ];

		if ( context && context.nodeType != 1 && context.nodeType != 9)
			return [ ];

		context = context || document;

		var ret = [context], done = [], last, nodeName;

		while ( t && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t);

			var foundToken = false,

				re = quickChild,

				m = re.exec(t);

			if ( m ) {
				nodeName = m[1].toUpperCase();

				for ( var i = 0; ret[i]; i++ )
					for ( var c = ret[i].firstChild; c; c = c.nextSibling )
						if ( c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName) )
							r.push( c );

				ret = r;
				t = t.replace( re, "" );
				if ( t.indexOf(" ") == 0 ) continue;
				foundToken = true;
			} else {
				re = /^([>+~])\s*(\w*)/i;

				if ( (m = re.exec(t)) != null ) {
					r = [];

					var merge = {};
					nodeName = m[2].toUpperCase();
					m = m[1];

					for ( var j = 0, rl = ret.length; j < rl; j++ ) {
						var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
						for ( ; n; n = n.nextSibling )
							if ( n.nodeType == 1 ) {
								var id = jQuery.data(n);

								if ( m == "~" && merge[id] ) break;

								if (!nodeName || n.nodeName.toUpperCase() == nodeName ) {
									if ( m == "~" ) merge[id] = true;
									r.push( n );
								}

								if ( m == "+" ) break;
							}
					}

					ret = r;

					t = jQuery.trim( t.replace( re, "" ) );
					foundToken = true;
				}
			}

			if ( t && !foundToken ) {
				if ( !t.indexOf(",") ) {
					if ( context == ret[0] ) ret.shift();

					done = jQuery.merge( done, ret );

					r = ret = [context];

					t = " " + t.substr(1,t.length);

				} else {
					var re2 = quickID;
					var m = re2.exec(t);

					if ( m ) {
						m = [ 0, m[2], m[3], m[1] ];

					} else {
						re2 = quickClass;
						m = re2.exec(t);
					}

					m[2] = m[2].replace(/\\/g, "");

					var elem = ret[ret.length-1];

					if ( m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem) ) {
						var oid = elem.getElementById(m[2]);

						if ( (jQuery.browser.msie||jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2] )
							oid = jQuery('[@id="'+m[2]+'"]', elem)[0];

						ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
					} else {
						for ( var i = 0; ret[i]; i++ ) {
							var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];

							if ( tag == "*" && ret[i].nodeName.toLowerCase() == "object" )
								tag = "param";

							r = jQuery.merge( r, ret[i].getElementsByTagName( tag ));
						}

						if ( m[1] == "." )
							r = jQuery.classFilter( r, m[2] );

						if ( m[1] == "#" ) {
							var tmp = [];

							for ( var i = 0; r[i]; i++ )
								if ( r[i].getAttribute("id") == m[2] ) {
									tmp = [ r[i] ];
									break;
								}

							r = tmp;
						}

						ret = r;
					}

					t = t.replace( re2, "" );
				}

			}

			if ( t ) {
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		if ( t )
			ret = [];

		if ( ret && context == ret[0] )
			ret.shift();

		done = jQuery.merge( done, ret );

		return done;
	},

	classFilter: function(r,m,not){
		m = " " + m + " ";
		var tmp = [];
		for ( var i = 0; r[i]; i++ ) {
			var pass = (" " + r[i].className + " ").indexOf( m ) >= 0;
			if ( !not && pass || not && !pass )
				tmp.push( r[i] );
		}
		return tmp;
	},

	filter: function(t,r,not) {
		var last;

		while ( t && t != last ) {
			last = t;

			var p = jQuery.parse, m;

			for ( var i = 0; p[i]; i++ ) {
				m = p[i].exec( t );

				if ( m ) {
					t = t.substring( m[0].length );

					m[2] = m[2].replace(/\\/g, "");
					break;
				}
			}

			if ( !m )
				break;

			if ( m[1] == ":" && m[2] == "not" )
				r = isSimple.test( m[3] ) ?
					jQuery.filter(m[3], r, true).r :
					jQuery( r ).not( m[3] );

			else if ( m[1] == "." )
				r = jQuery.classFilter(r, m[2], not);

			else if ( m[1] == "[" ) {
				var tmp = [], type = m[3];

				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var a = r[i], z = a[ jQuery.props[m[2]] || m[2] ];

					if ( z == null || /href|src|selected/.test(m[2]) )
						z = jQuery.attr(a,m[2]) || '';

					if ( (type == "" && !!z ||
						 type == "=" && z == m[5] ||
						 type == "!=" && z != m[5] ||
						 type == "^=" && z && !z.indexOf(m[5]) ||
						 type == "$=" && z.substr(z.length - m[5].length) == m[5] ||
						 (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not )
							tmp.push( a );
				}

				r = tmp;

			} else if ( m[1] == ":" && m[2] == "nth-child" ) {
				var merge = {}, tmp = [],
					test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
						m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" ||
						!/\D/.test(m[3]) && "0n+" + m[3] || m[3]),
					first = (test[1] + (test[2] || 1)) - 0, last = test[3] - 0;

				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var node = r[i], parentNode = node.parentNode, id = jQuery.data(parentNode);

					if ( !merge[id] ) {
						var c = 1;

						for ( var n = parentNode.firstChild; n; n = n.nextSibling )
							if ( n.nodeType == 1 )
								n.nodeIndex = c++;

						merge[id] = true;
					}

					var add = false;

					if ( first == 0 ) {
						if ( node.nodeIndex == last )
							add = true;
					} else if ( (node.nodeIndex - last) % first == 0 && (node.nodeIndex - last) / first >= 0 )
						add = true;

					if ( add ^ not )
						tmp.push( node );
				}

				r = tmp;

			} else {
				var fn = jQuery.expr[ m[1] ];
				if ( typeof fn == "object" )
					fn = fn[ m[2] ];

				if ( typeof fn == "string" )
					fn = eval("false||function(a,i){return " + fn + ";}");

				r = jQuery.grep( r, function(elem, i){
					return fn(elem, i, m, r);
				}, not );
			}
		}

		return { r: r, t: t };
	},

	dir: function( elem, dir ){
		var matched = [],
			cur = elem[dir];
		while ( cur && cur != document ) {
			if ( cur.nodeType == 1 )
				matched.push( cur );
			cur = cur[dir];
		}
		return matched;
	},

	nth: function(cur,result,dir,elem){
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] )
			if ( cur.nodeType == 1 && ++num == result )
				break;

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType == 1 && n != elem )
				r.push( n );
		}

		return r;
	}
});
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code orignated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	add: function(elem, types, handler, data) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		if ( jQuery.browser.msie && elem.setInterval )
			elem = window;

		if ( !handler.guid )
			handler.guid = this.guid++;

		if( data != undefined ) {
			var fn = handler;

			handler = this.proxy( fn, function() {
				return fn.apply(this, arguments);
			});

			handler.data = data;
		}

		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				if ( typeof jQuery != "undefined" && !jQuery.event.triggered )
					return jQuery.event.handle.apply(arguments.callee.elem, arguments);
			});
		handle.elem = elem;

		jQuery.each(types.split(/\s+/), function(index, type) {
			var parts = type.split(".");
			type = parts[0];
			handler.type = parts[1];

			var handlers = events[type];

			if (!handlers) {
				handlers = events[type] = {};

				if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false ) {
					if (elem.addEventListener)
						elem.addEventListener(type, handle, false);
					else if (elem.attachEvent)
						elem.attachEvent("on" + type, handle);
				}
			}

			handlers[handler.guid] = handler;

			jQuery.event.global[type] = true;
		});

		elem = null;
	},

	guid: 1,
	global: {},

	remove: function(elem, types, handler) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			if ( types == undefined || (typeof types == "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				jQuery.each(types.split(/\s+/), function(index, type){
					var parts = type.split(".");
					type = parts[0];

					if ( events[type] ) {
						if ( handler )
							delete events[type][handler.guid];

						else
							for ( handler in events[type] )
								if ( !parts[1] || events[type][handler].type == parts[1] )
									delete events[type][handler];

						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	trigger: function(type, data, elem, donative, extra) {
		data = jQuery.makeArray(data);

		if ( type.indexOf("!") >= 0 ) {
			type = type.slice(0, -1);
			var exclusive = true;
		}

		if ( !elem ) {
			if ( this.global[type] )
				jQuery("*").add([window, document]).trigger(type, data);

		} else {
			if ( elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;

			var val, ret, fn = jQuery.isFunction( elem[ type ] || null ),
				event = !data[0] || !data[0].preventDefault;

			if ( event ) {
				data.unshift({
					type: type,
					target: elem,
					preventDefault: function(){},
					stopPropagation: function(){},
					timeStamp: now()
				});
				data[0][expando] = true; // no need to fix fake event
			}

			data[0].type = type;
			if ( exclusive )
				data[0].exclusive = true;

			var handle = jQuery.data(elem, "handle");
			if ( handle )
				val = handle.apply( elem, data );

			if ( (!fn || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
				val = false;

			if ( event )
				data.shift();

			if ( extra && jQuery.isFunction( extra ) ) {
				ret = extra.apply( elem, val == null ? data : data.concat( val ) );
				if (ret !== undefined)
					val = ret;
			}

			if ( fn && donative !== false && val !== false && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
				this.triggered = true;
				try {
					elem[ type ]();
				} catch (e) {}
			}

			this.triggered = false;
		}

		return val;
	},

	handle: function(event) {
		var val, ret, namespace, all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );

		namespace = event.type.split(".");
		event.type = namespace[0];
		namespace = namespace[1];
		all = !namespace && !event.exclusive;

		handlers = ( jQuery.data(this, "events") || {} )[event.type];

		for ( var j in handlers ) {
			var handler = handlers[j];

			if ( all || handler.type == namespace ) {
				event.handler = handler;
				event.data = handler.data;

				ret = handler.apply( this, arguments );

				if ( val !== false )
					val = ret;

				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}
		}

		return val;
	},

	fix: function(event) {
		if ( event[expando] == true )
			return event;

		var originalEvent = event;
		event = { originalEvent: originalEvent };
		var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
		for ( var i=props.length; i; i-- )
			event[ props[i] ] = originalEvent[ props[i] ];

		event[expando] = true;

		event.preventDefault = function() {
			if (originalEvent.preventDefault)
				originalEvent.preventDefault();
			originalEvent.returnValue = false;
		};
		event.stopPropagation = function() {
			if (originalEvent.stopPropagation)
				originalEvent.stopPropagation();
			originalEvent.cancelBubble = true;
		};

		event.timeStamp = event.timeStamp || now();

		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

		if ( event.target.nodeType == 3 )
			event.target = event.target.parentNode;

		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}

		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;

		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

		return event;
	},

	proxy: function( fn, proxy ){
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		return proxy;
	},

	special: {
		ready: {
			setup: function() {
				bindReady();
				return;
			},

			teardown: function() { return; }
		},

		mouseenter: {
			setup: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
				return true;
			},

			teardown: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
				return true;
			},

			handler: function(event) {
				if ( withinElement(event, this) ) return true;
				event.type = "mouseenter";
				return jQuery.event.handle.apply(this, arguments);
			}
		},

		mouseleave: {
			setup: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
				return true;
			},

			teardown: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
				return true;
			},

			handler: function(event) {
				if ( withinElement(event, this) ) return true;
				event.type = "mouseleave";
				return jQuery.event.handle.apply(this, arguments);
			}
		}
	}
};

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},

	one: function( type, data, fn ) {
		var one = jQuery.event.proxy( fn || data, function(event) {
			jQuery(this).unbind(event, one);
			return (fn || data).apply( this, arguments );
		});
		return this.each(function(){
			jQuery.event.add( this, type, one, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this, true, fn );
		});
	},

	triggerHandler: function( type, data, fn ) {
		return this[0] && jQuery.event.trigger( type, data, this[0], false, fn );
	},

	toggle: function( fn ) {
		var args = arguments, i = 1;

		while( i < args.length )
			jQuery.event.proxy( fn, args[i++] );

		return this.click( jQuery.event.proxy( fn, function(event) {
			this.lastToggle = ( this.lastToggle || 0 ) % i;

			event.preventDefault();

			return args[ this.lastToggle++ ].apply( this, arguments ) || false;
		}));
	},

	hover: function(fnOver, fnOut) {
		return this.bind('mouseenter', fnOver).bind('mouseleave', fnOut);
	},

	ready: function(fn) {
		bindReady();

		if ( jQuery.isReady )
			fn.call( document, jQuery );

		else
			jQuery.readyList.push( function() { return fn.call(this, jQuery); } );

		return this;
	}
});

jQuery.extend({
	isReady: false,
	readyList: [],
	ready: function() {
		if ( !jQuery.isReady ) {
			jQuery.isReady = true;

			if ( jQuery.readyList ) {
				jQuery.each( jQuery.readyList, function(){
					this.call( document );
				});

				jQuery.readyList = null;
			}

			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	if ( document.addEventListener && !jQuery.browser.opera)
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );

	if ( jQuery.browser.msie && window == top ) (function(){
		if (jQuery.isReady) return;
		try {
			document.documentElement.doScroll("left");
		} catch( error ) {
			setTimeout( arguments.callee, 0 );
			return;
		}
		jQuery.ready();
	})();

	if ( jQuery.browser.opera )
		document.addEventListener( "DOMContentLoaded", function () {
			if (jQuery.isReady) return;
			for (var i = 0; i < document.styleSheets.length; i++)
				if (document.styleSheets[i].disabled) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			jQuery.ready();
		}, false);

	if ( jQuery.browser.safari ) {
		var numStyles;
		(function(){
			if (jQuery.isReady) return;
			if ( document.readyState != "loaded" && document.readyState != "complete" ) {
				setTimeout( arguments.callee, 0 );
				return;
			}
			if ( numStyles === undefined )
				numStyles = jQuery("style, link[rel=stylesheet]").length;
			if ( document.styleSheets.length != numStyles ) {
				setTimeout( arguments.callee, 0 );
				return;
			}
			jQuery.ready();
		})();
	}

	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,change,select," +
	"submit,keydown,keypress,keyup,error").split(","), function(i, name){

	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

var withinElement = function(event, elem) {
	var parent = event.relatedTarget;
	while ( parent && parent != elem ) try { parent = parent.parentNode; } catch(error) { parent = elem; }
	return parent == elem;
};

jQuery(window).bind("unload", function() {
	jQuery("*").add(document).unbind();
});
jQuery.fn.extend({
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url != 'string' )
			return this._load( url );

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		callback = callback || function(){};

		var type = "GET";

		if ( params )
			if ( jQuery.isFunction( params ) ) {
				callback = params;
				params = null;

			} else {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				if ( status == "success" || status == "notmodified" )
					self.html( selector ?
						jQuery("<div/>")
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							.find(selector) :

						res.responseText );

				self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return jQuery.nodeName(this, "form") ?
				jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || /select|textarea/i.test(this.nodeName) ||
					/text|hidden|password/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				val.constructor == Array ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = now();

jQuery.extend({
	get: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		timeout: 0,
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		data: null,
		username: null,
		password: null,
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	lastModified: {},

	ajax: function( s ) {
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		var jsonp, jsre = /=\?(&|$)/g, status, data,
			type = s.type.toUpperCase();

		if ( s.data && s.processData && typeof s.data != "string" )
			s.data = jQuery.param(s.data);

		if ( s.dataType == "jsonp" ) {
			if ( type == "GET" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			s.dataType = "script";

			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && type == "GET" ) {
			var ts = now();
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		if ( s.data && type == "GET" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			s.data = null;
		}

		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var remote = /^(?:\w+:)?\/\/([^\/?#]+)/;

		if ( s.dataType == "script" && type == "GET"
				&& remote.test(s.url) && remote.exec(s.url)[1] != location.host ){
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			if ( !jsonp ) {
				var done = false;

				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			return undefined;
		}

		var requestDone = false;

		var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

		if( s.username )
			xhr.open(type, s.url, s.async, s.username, s.password);
		else
			xhr.open(type, s.url, s.async);

		try {
			if ( s.data )
				xhr.setRequestHeader("Content-Type", s.contentType);

			if ( s.ifModified )
				xhr.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		if ( s.beforeSend && s.beforeSend(xhr, s) === false ) {
			s.global && jQuery.active--;
			xhr.abort();
			return false;
		}

		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xhr, s]);

		var onreadystatechange = function(isTimeout){
			if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;

				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout == "timeout" && "timeout" ||
					!jQuery.httpSuccess( xhr ) && "error" ||
					s.ifModified && jQuery.httpNotModified( xhr, s.url ) && "notmodified" ||
					"success";

				if ( status == "success" ) {
					try {
						data = jQuery.httpData( xhr, s.dataType, s.dataFilter );
					} catch(e) {
						status = "parsererror";
					}
				}

				if ( status == "success" ) {
					var modRes;
					try {
						modRes = xhr.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available

					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					if ( !jsonp )
						success();
				} else
					jQuery.handleError(s, xhr, status);

				complete();

				if ( s.async )
					xhr = null;
			}
		};

		if ( s.async ) {
			var ival = setInterval(onreadystatechange, 13);

			if ( s.timeout > 0 )
				setTimeout(function(){
					if ( xhr ) {
						xhr.abort();

						if( !requestDone )
							onreadystatechange( "timeout" );
					}
				}, s.timeout);
		}

		try {
			xhr.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
		}

		if ( !s.async )
			onreadystatechange();

		function success(){
			if ( s.success )
				s.success( data, status );

			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
		}

		function complete(){
			if ( s.complete )
				s.complete(xhr, status);

			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xhr, s] );

			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}

		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		if ( s.error ) s.error( xhr, status, e );

		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xhr, s, e] );
	},

	active: 0,

	httpSuccess: function( xhr ) {
		try {
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223 ||
				jQuery.browser.safari && xhr.status == undefined;
		} catch(e){}
		return false;
	},

	httpNotModified: function( xhr, url ) {
		try {
			var xhrRes = xhr.getResponseHeader("Last-Modified");

			return xhr.status == 304 || xhrRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xhr.status == undefined;
		} catch(e){}
		return false;
	},

	httpData: function( xhr, type, filter ) {
		var ct = xhr.getResponseHeader("content-type"),
			xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";

		if( filter )
			data = filter( data, type );

		if ( type == "script" )
			jQuery.globalEval( data );

		if ( type == "json" )
			data = eval("(" + data + ")");

		return data;
	},

	param: function( a ) {
		var s = [];

		if ( a.constructor == Array || a.jquery )
			jQuery.each( a, function(){
				s.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( this.value ) );
			});

		else
			for ( var j in a )
				if ( a[j] && a[j].constructor == Array )
					jQuery.each( a[j], function(){
						s.push( encodeURIComponent(j) + "=" + encodeURIComponent( this ) );
					});
				else
					s.push( encodeURIComponent(j) + "=" + encodeURIComponent( jQuery.isFunction(a[j]) ? a[j]() : a[j] ) );

		return s.join("&").replace(/%20/g, "+");
	}

});
jQuery.fn.extend({
	show: function(speed,callback){
		return speed ?
			this.animate({
				height: "show", width: "show", opacity: "show"
			}, speed, callback) :

			this.filter(":hidden").each(function(){
				this.style.display = this.oldblock || "";
				if ( jQuery.css(this,"display") == "none" ) {
					var elem = jQuery("<" + this.tagName + " />").appendTo("body");
					this.style.display = elem.css("display");
					if (this.style.display == "none")
						this.style.display = "block";
					elem.remove();
				}
			}).end();
	},

	hide: function(speed,callback){
		return speed ?
			this.animate({
				height: "hide", width: "hide", opacity: "hide"
			}, speed, callback) :

			this.filter(":visible").each(function(){
				this.oldblock = this.oldblock || jQuery.css(this,"display");
				this.style.display = "none";
			}).end();
	},

	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn ?
				this.animate({
					height: "toggle", width: "toggle", opacity: "toggle"
				}, fn, fn2) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
				});
	},

	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},

	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},

	slideToggle: function(speed, callback){
		return this.animate({height: "toggle"}, speed, callback);
	},

	fadeIn: function(speed, callback){
		return this.animate({opacity: "show"}, speed, callback);
	},

	fadeOut: function(speed, callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
			if ( this.nodeType != 1)
				return false;

			var opt = jQuery.extend({}, optall), p,
				hidden = jQuery(this).is(":hidden"), self = this;

			for ( p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);

				if ( p == "height" || p == "width" ) {
					opt.display = jQuery.css(this, "display");

					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			return true;
		});
	},

	queue: function(type, fn){
		if ( jQuery.isFunction(type) || ( type && type.constructor == Array )) {
			fn = type;
			type = "fx";
		}

		if ( !type || (typeof type == "string" && !fn) )
			return queue( this[0], type );

		return this.each(function(){
			if ( fn.constructor == Array )
				queue(this, type, fn);
			else {
				queue(this, type).push( fn );

				if ( queue(this, type).length == 1 )
					fn.call(this);
			}
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});

var queue = function( elem, type, array ) {
	if ( elem ){

		type = type || "fx";

		var q = jQuery.data( elem, type + "queue" );

		if ( !q || array )
			q = jQuery.data( elem, type + "queue", jQuery.makeArray(array) );

	}
	return q;
};

jQuery.fn.dequeue = function(type){
	type = type || "fx";

	return this.each(function(){
		var q = queue(this, type);

		q.shift();

		if ( q.length )
			q[0].call( this );
	});
};

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = speed && speed.constructor == Object ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && easing.constructor != Function && easing
		};

		opt.duration = (opt.duration && opt.duration.constructor == Number ?
			opt.duration :
			jQuery.fx.speeds[opt.duration]) || jQuery.fx.speeds.def;

		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],
	timerId: null,

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	update: function(){
		if ( this.options.step )
			this.options.step.call( this.elem, this.now, this );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		if ( this.prop == "height" || this.prop == "width" )
			this.elem.style.display = "block";
	},

	cur: function(force){
		if ( this.elem[this.prop] != null && this.elem.style[this.prop] == null )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;
		this.update();

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		jQuery.timers.push(t);

		if ( jQuery.timerId == null ) {
			jQuery.timerId = setInterval(function(){
				var timers = jQuery.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( jQuery.timerId );
					jQuery.timerId = null;
				}
			}, 13);
		}
	},

	show: function(){
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		this.custom(0, this.cur());

		if ( this.prop == "width" || this.prop == "height" )
			this.elem.style[this.prop] = "1px";

		jQuery(this.elem).show();
	},

	hide: function(){
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		this.custom(this.cur(), 0);
	},

	step: function(gotoEnd){
		var t = now();

		if ( gotoEnd || t > this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					this.elem.style.overflow = this.options.overflow;

					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				if ( this.options.hide )
					this.elem.style.display = "none";

				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
			}

			if ( done )
				this.options.complete.call( this.elem );

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {
	speeds:{
		slow: 600,
 		fast: 200,
 		def: 400
	},
	step: {
		scrollLeft: function(fx){
			fx.elem.scrollLeft = fx.now;
		},

		scrollTop: function(fx){
			fx.elem.scrollTop = fx.now;
		},

		opacity: function(fx){
			jQuery.attr(fx.elem.style, "opacity", fx.now);
		},

		_default: function(fx){
			fx.elem.style[ fx.prop ] = fx.now + fx.unit;
		}
	}
});
jQuery.fn.offset = function() {
	var left = 0, top = 0, elem = this[0], results;

	if ( elem ) with ( jQuery.browser ) {
		var parent       = elem.parentNode,
		    offsetChild  = elem,
		    offsetParent = elem.offsetParent,
		    doc          = elem.ownerDocument,
		    safari2      = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
		    css          = jQuery.curCSS,
		    fixed        = css(elem, "position") == "fixed";

		if ( elem.getBoundingClientRect ) {
			var box = elem.getBoundingClientRect();

			add(box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
				box.top  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop));

			add( -doc.documentElement.clientLeft, -doc.documentElement.clientTop );

		} else {

			add( elem.offsetLeft, elem.offsetTop );

			while ( offsetParent ) {
				add( offsetParent.offsetLeft, offsetParent.offsetTop );

				if ( mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2 )
					border( offsetParent );

				if ( !fixed && css(offsetParent, "position") == "fixed" )
					fixed = true;

				offsetChild  = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
				offsetParent = offsetParent.offsetParent;
			}

			while ( parent && parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
				if ( !/^inline|table.*$/i.test(css(parent, "display")) )
					add( -parent.scrollLeft, -parent.scrollTop );

				if ( mozilla && css(parent, "overflow") != "visible" )
					border( parent );

				parent = parent.parentNode;
			}

			if ( (safari2 && (fixed || css(offsetChild, "position") == "absolute")) ||
				(mozilla && css(offsetChild, "position") != "absolute") )
					add( -doc.body.offsetLeft, -doc.body.offsetTop );

			if ( fixed )
				add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
					Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop));
		}

		results = { top: top, left: left };
	}

	function border(elem) {
		add( jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true) );
	}

	function add(l, t) {
		left += parseInt(l, 10) || 0;
		top += parseInt(t, 10) || 0;
	}

	return results;
};


jQuery.fn.extend({
	position: function() {
		var left = 0, top = 0, results;

		if ( this[0] ) {
			var offsetParent = this.offsetParent(),

			offset       = this.offset(),
			parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();

			offset.top  -= num( this, 'marginTop' );
			offset.left -= num( this, 'marginLeft' );

			parentOffset.top  += num( offsetParent, 'borderTopWidth' );
			parentOffset.left += num( offsetParent, 'borderLeftWidth' );

			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}

		return results;
	},

	offsetParent: function() {
		var offsetParent = this[0].offsetParent;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return jQuery(offsetParent);
	}
});


jQuery.each( ['Left', 'Top'], function(i, name) {
	var method = 'scroll' + name;

	jQuery.fn[ method ] = function(val) {
		if (!this[0]) return;

		return val != undefined ?

			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});
jQuery.each([ "Height", "Width" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom"; // bottom or right

	jQuery.fn["inner" + name] = function(){
		return this[ name.toLowerCase() ]() +
			num(this, "padding" + tl) +
			num(this, "padding" + br);
	};

	jQuery.fn["outer" + name] = function(margin) {
		return this["inner" + name]() +
			num(this, "border" + tl + "Width") +
			num(this, "border" + br + "Width") +
			(margin ?
				num(this, "margin" + tl) + num(this, "margin" + br) : 0);
	};

});})();
(function($) {

  function print_array(obj, opts) {
    var result = [];
    for (var i = 0; i < Math.min(opts.max_array, obj.length); i++)
      result.push($.print(obj[i], $.extend({}, opts, { max_array: 3, max_string: 40 })));

    if (obj.length > opts.max_array)
      result.push((obj.length - opts.max_array) + ' more...');
    if (result.length == 0) return "[]"
      return "[ " + result.join(", ") + " ]";
  }

  function print_element(obj) {
    if (obj.nodeType == 1) {
      var result = [];
      var properties = [ 'className', 'id' ];
      var extra = {
        'input': ['type', 'name', 'value'],
        'a': ['href', 'target'],
        'form': ['method', 'action'],
        'script': ['src'],
        'link': ['href'],
        'img': ['src']
      };

      $.each(properties.concat(extra[obj.tagName.toLowerCase()] || []), function(){
        if (obj[this])
          result.push(' ' + this.replace('className', 'class') + "=" + $.print(obj[this]))
      });
      return "<" + obj.tagName.toLowerCase()
              + result.join('') + ">";
    }
  }

  function print_object(obj, opts) {
    var seen = opts.seen || [ obj ];

    var result = [], key, value;
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && $.inArray(obj[k], seen) < 0) {
        seen.push(obj[k]);
        value = $.print(obj[k], $.extend({}, opts, { max_array: 6, max_string: 40, seen: seen }));
      } else
        value = "...";
      result.push(k + ": " + value);
    }
    if (result.length == 0) return "{}";
    return "{ " + result.join(", ") + " }";
  }

  function print_string(value, opts) {
    var character_substitutions = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
    };
    var r = /["\\\x00-\x1f\x7f-\x9f]/g;

    var str = r.test(value)
      ? '"' + value.replace(r, function (a) {
          var c = character_substitutions[a];
          if (c) return c;
          c = a.charCodeAt();
          return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
        }) + '"'
      : '"' + value + '"';
    if (str.length > opts.max_string)
      return str.slice(0, opts.max_string + 1) + '..."';
    else
      return str;
  }

  $.print = function(obj, options) {
    var opts = $.extend({}, { max_array: 10, max_string: 100 }, options);

    if (typeof obj == 'undefined')
      return "undefined";
    else if (typeof obj == 'boolean')
      return obj.toString();
    else if (typeof obj == 'number')
      return obj.toString();
    else if (!obj)
      return "null";
    else if (typeof obj == 'string')
      return print_string(obj, opts);
    else if (obj instanceof RegExp)
      return obj.toString();
    else if (obj instanceof Array || obj.callee || obj.item)
      return print_array(obj, opts);
    else if (typeof obj == 'function' || obj instanceof Function)
      return obj.toString().match(/^([^)]*\))/)[1];
    else if (obj.nodeType)
      return print_element(obj);
    else if (obj instanceof Error)
      return print_object(obj, $.extend({}, options, { max_string: 200 }));
    else if (obj instanceof Object)
      return print_object(obj, opts);
    else
      return obj.toString().replace(/\n\s*/g, '');
  }

})(jQuery);
function module(name, definition) {
  var current_constructor;

  if (!window[name]) {
    window[name] = {};
  }
  var module_stack = [window[name]];

  function current_module() {
    return module_stack[module_stack.length -1];
  }

  function push_module(name) {
    if (!current_module()[name]) {
      current_module()[name] = {};
    }
    var module = current_module()[name];
    module_stack.push(module);
    return module;
  }

  function pop_module() {
    module_stack.pop();
  }

  var keywords = {
    module: function(name, definition) {
      var module = push_module(name);
      definition.call(module);
      pop_module();
    },

    constructor: function(name, definition) {
      current_constructor = function() {
        if (this.initialize) {
          this.initialize.apply(this, arguments);
        }
      };
      definition.call(current_constructor);
      current_module()[name] = current_constructor;
      current_constructor = undefined;
    },

    include: function(mixin) {
      for (var slot_name in mixin) {
        current_constructor.prototype[slot_name] = mixin[slot_name];
      }
    },

    def: function(name, fn) {
      if(current_constructor) {
        current_constructor.prototype[name] = fn;
      } else {
        current_module()[name] = fn;
      }
    }
  }

  definition.call(current_module(), keywords);
}
module("Screw", function(c) { with(c) {
}});
Screw['$'] = jQuery.noConflict(true);
module("Screw", function(c) { with(c) {
  module("Require", function() {
    var required_paths = [];
    var included_stylesheets = {};
    var cache_buster = parseInt(new Date().getTime()/(1*1000));

    def("use_cache_buster", true);

    def("require", function(javascript_path, onload) {
      if(required_paths[javascript_path]) return;
      var full_path = javascript_path + ".js";

      if (Screw.Require.use_cache_buster) {
        full_path += '?' + cache_buster;
      }
      document.write(tag("script", {src: full_path, type: 'text/javascript'}));
      if (onload) {
        var scripts = document.getElementsByTagName('script');
        scripts[scripts.length-1].onload = onload;
      }
      required_paths[javascript_path] = true;
    });
    window.require = Screw.Require.require;

    def("stylesheet", function(stylesheet_path) {
      if(included_stylesheets[stylesheet_path]) return;
      var full_path = stylesheet_path + ".css";
      if(Screw.Require.use_cache_buster) {
        full_path += '?' + cache_buster;
      }
      document.write(tag("link", {rel: 'stylesheet', type: 'text/css', href: full_path}));
      included_stylesheets[stylesheet_path] = true;
    });
    window.stylesheet = this.stylesheet;

    function tag(name, attributes) {
      var html = "<" + name;
      for(var attribute in attributes) {
        html += (" " + attribute + "='" + attributes[attribute]) + "'";
      };

      if (name == "script") {
        html += "></";
        html += name;
        html += ">";
      } else {
        html += "/>";
      }

      return html;
    };
  });
}});
module("Screw", function(c) { with(c) {
  module("Matchers", function() {
    def('equal', {
      match: function(expected, actual) {
        if(expected == actual) return true;
        if(actual == undefined) return false;

        if (expected instanceof Array) {
          if (! (actual instanceof Array)) return false;
          for (var i = 0; i < actual.length; i++)
            if (!Screw.Matchers.equal.match(expected[i], actual[i])) return false;
          return actual.length == expected.length;
        } else if (expected instanceof Object) {
          for (var key in expected)
            if (!this.match(expected[key], actual[key])) return false;
          for (var key in actual)
            if (!this.match(actual[key], expected[key])) return false;
          return true;
        }
        return false;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not equal ' : ' to equal ') + Screw.$.print(expected);
      }
    });

    def('be_gt', {
      match: function(expected, actual) {
        return actual > expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than ' + Screw.$.print(expected);
      }
    });

    def('be_gte', {
      match: function(expected, actual) {
        return actual >= expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than or equal to ' + Screw.$.print(expected);
      }
    });

    def('be_lt', {
      match: function(expected, actual) {
        return actual < expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not ' : ' to ') + 'be less than ' + Screw.$.print(expected);
      }
    });

    def('be_lte', {
      match: function(expected, actual) {
        return actual <= expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not ' : ' to ') + 'be less than or equal to ' + Screw.$.print(expected);
      }
    });

    def('match', {
      match: function(expected, actual) {
        if (expected.constructor == RegExp)
          return expected.exec(actual.toString());
        else
          return actual.indexOf(expected) > -1;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not match ' : ' to match ') + Screw.$.print(expected);
      }
    });

    def('be_blank', {
      match: function(expected, actual) {
        if (actual == undefined) return true;
        if (typeof(actual) == "string") actual = actual.replace(/^\s*(.*?)\s*$/, "$1");
        return Screw.Matchers.be_empty.match(expected, actual);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be blank' : ' to be blank');
      }
    });

    def('be_empty', {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(new Error(actual.toString() + " does not respond to length"));

        return actual.length == 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be empty' : ' to be empty');
      }
    });

    def('have_length', {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(new Error(actual.toString() + " does not respond to length"));

        return actual.length == expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not' : ' to') + ' have length ' + expected;
      }
    });

    def('be_an_instance_of', {
      match: function(expected, actual) {
        return actual instanceof eval(expected);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + typeof actual + (not ? ' not' : '') + ' be an instance of ' + expected;
      }
    });

    def('be_null', {
      match: function(expected, actual) {
        return actual === null;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be null' : ' to be null');
      }
    });

    def('be_undefined', {
      match: function(expected, actual) {
        return actual === undefined;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be undefined' : ' to be undefined');
      }
    });

    def('be_true', {
      match: function(expected, actual) {
        return actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be true' : ' to be true');
      }
    });

    def('be_false', {
      match: function(expected, actual) {
        return !actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be false' : ' to be false');
      }
    });

    def('be_identical', {
      match: function(expected, actual) {
        return (expected === actual);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not be identical to ' : ' to be identical to ') + Screw.$.print(expected);
      }
    });

    def('include', {
      match: function(expected, actual) {
        if((actual instanceof Array) || (actual.callee)) {
          for(var i = 0; i < actual.length; i++) {
            if (Screw.Matchers.equal.match(expected, actual[i]) === true) {
              return true;
            }
          }
        } else if (typeof actual == "string") {
          return (actual.indexOf(expected) !== -1);
        } else {
          throw(new Error(Screw.$.print(actual) + ' is not of Array or String type.'))
        }
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not include ' : ' to include ') + Screw.$.print(expected);
      }
    });

    def('have_key', {
      match: function(expected, actual) {
        var keys = [];
        for(var property in actual) {
          keys.push(property);
        }
        return Screw.Matchers.include.match(expected, keys)
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not have key ' : ' to have key ') + Screw.$.print(expected);
      }
    });

    def('have_value', {
      match: function(expected, actual) {
        var values = [];
        for(var property in actual) {
          values.push(actual[property]);
        }
        return Screw.Matchers.include.match(expected, values)
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + Screw.$.print(actual) + (not ? ' to not have value ' : ' to have value ') + Screw.$.print(expected);
      }
    });

    def('have_been_called', {
      match: function(expected, actual) {
        if (expected) {
          return this.match_with_expectation(expected, actual);
        } else {
          return actual.call_count > 0;
        }
      },

      match_with_expectation: function(expected, actual) {
        if (expected.__with_args__) {
          return Screw.Matchers.equal.match(expected.arguments, actual.most_recent_args);
        } else if (expected.__on_object__) {
          return Screw.Matchers.equal.match(expected.object, actual.most_recent_this_value);
        } else if (typeof expected == "number") {
          return actual.call_count == expected;
        } else {
          throw new Error("unrecognized expectation argument for mock function: " + expected);
        }
      },

      error_message_expectation_fragment: function(expected) {
        if (expected.__with_args__) {
          return "with arguments " + Screw.$.print(expected.arguments);
        } else if (expected.__on_object__) {
          return "on object " + Screw.$.print(expected.object);
        } else {
          return expected.call_count + " time" + ((expected.call_count == 1) ? "" : "s");
        }
      },

      error_message_actual_fragment: function(expected, actual) {
        if (expected.__with_args__) {
          return "with arguments " + Screw.$.print(actual.most_recent_args);
        } else if (expected.__on_object__) {
          return "on object " + Screw.$.print(actual.most_recent_this_value);
        } else {
          return actual.call_count + " time" + ((actual.call_count == 1) ? "" : "s");
        }
      },

      failure_message: function(expected, actual, not) {
        var message;
        if (not) {
          message = 'expected ' + actual.function_name + ' to have not been called ' + this.error_message_expectation_fragment(expected);
        } else {
          message = 'expected ' + actual.function_name + ' to have been called ' + this.error_message_expectation_fragment(expected);
        }
        message += ', but it was called ' + this.error_message_actual_fragment(expected, actual);
        return message;
      }
    });

    def('once', 1);
    def('twice', 2);
    def('thrice', 3);

    def('with_args', function() {
      return {
        __with_args__: true,
        arguments: Array.prototype.slice.call(arguments)
      };
    });

    def('on_object', function(object) {
      return {
        __on_object__: true,
        object: object
      };
    });

    def('throw_exception', {
      match: function(expected, actual) {
        var threw_exception;
        try {
          actual();
          threw_exception = false;
        } catch(e) {
          threw_exception = true;
        }
        return threw_exception;
      },

      failure_message: function(expected, actual, not) {
        if (not) {
          return "expected function to not throw an exception, but it did";
        } else {
          return "expected function to throw an exception, but it did not";
        }
      }
    });
  });
}});
module("Screw", function(c) { with (c) {
  def('Unit', function(specification) {
    specification(new Screw.Context());
  });

  def('root_description', function() {
    return this._root_description = this._root_description || new Screw.Description("All specs");
  });

  def('mocks', []);

  def('reset_mocks', function() {
    Screw.each(Screw.mocks, function() {
      this.mocked_object[this.function_name] = this.original_function;
    })
    Screw.mocks = [];
  });

  def('current_description', function() {
    return this.description_stack()[this.description_stack().length - 1];
  });

  def('push_description', function(description) {
    this.current_description().add_description(description);
    this.description_stack().push(description);
  });

  def('pop_description', function() {
    this.description_stack().pop();
  });

  def('description_stack', function() {
    if (!this._description_stack) {
      this._description_stack = [this.root_description()];
    }
    return this._description_stack;
  });

  def('map', function(array, fn) {
    var results = [];
    Screw.each(array, function() {
      results.push(fn.call(this));
    });
    return results;
  })

  def('each', function(array, fn) {
    for (var i = 0; i < array.length; i++) {
      fn.call(array[i]);
    }
  });

  def('reverse_each', function(array, fn) {
    for (var i = array.length - 1; i >= 0; i--) {
      fn.call(array[i]);
    }
  });
}});
module("Screw", function(c) { with (c) {
  module("Keywords", function() {
    def('describe', function(name, fn) {
      Screw.push_description(new Screw.Description(name));
      fn();
      Screw.pop_description();
    });

    def('context', Screw.Keywords.describe);
    def('it', function(name, fn) {
      Screw.current_description().add_example(new Screw.Example(name, fn));
    });
    def('specify', Screw.Keywords.it);
    def('they', Screw.Keywords.it);

    def('xit', function(name, fn) {
      Screw.current_description().add_example(new Screw.Example(name, fn, true));
    });

    def('pending', Screw.Keywords.xit);

    def('before', function(fn) {
      Screw.current_description().add_before(fn);
    });

    def('after', function(fn) {
      Screw.current_description().add_after(fn);
    });

    def('expect', function(actual) {
      var funcname = function(f) {
          var s = f.toString().match(/function (\w*)/)[1];
          if ((s == null) || (s.length == 0)) return "anonymous";
          return s;
      };

      var stacktrace = function() {
          var s = "";
          for(var a = arguments.caller; a != null; a = a.caller) {
              s += funcname(a.callee) + "\n";
              if (a.caller == a) break;
          }
          return s;
      };

      return {
        to: function(matcher, expected, not) {
          var matched = matcher.match(expected, actual);
          if (not ? matched : !matched) {
            throw(new Error(matcher.failure_message(expected, actual, not)));
          }
        },

        to_not: function(matcher, expected) {
          this.to(matcher, expected, true);
        }
      }
    });

    def('mock', function(object, method_name, method_mock) {
      if (!object[method_name]) {
        throw new Error("in mock_function: " + method_name + " is not a function that can be mocked");
      }
      var mock_function = this.mock_function(method_mock);
      mock_function.mocked_object = object;
      mock_function.function_name = method_name;
      mock_function.original_function = object[method_name];
      Screw.mocks.push(mock_function);
      object[method_name] = mock_function;

      return object;
    });

    def('mock_function', function() {
      var fn_to_call, function_name;

      if (arguments.length == 2) {
        function_name = arguments[0];
        fn_to_call = arguments[1];
      } else if (arguments.length == 1) {
        if (typeof arguments[0] == "function") {
          fn_to_call = arguments[0];
        } else {
          function_name = arguments[0];
        }
      }

      var mock_function = function() {
        var args_array = Array.prototype.slice.call(arguments)
        mock_function.call_count += 1;
        mock_function.this_values.push(this);
        mock_function.most_recent_this_value =  this;
        mock_function.call_args.push(args_array);
        mock_function.most_recent_args = args_array;

        if (fn_to_call) {
          return fn_to_call.apply(this, args_array);
        }
      };

      mock_function.function_name = function_name;
      mock_function.clear = function() {
        this.call_count = 0;
        this.call_args = [];
        this.this_values = [];
        this.most_recent_args = null;
        this.most_recent_this_value = null;
      }
      mock_function.clear();
      return mock_function;
    });
  });
}});
module("Screw", function(c) { with (c) {
  constructor("Context", function() {
    include(Screw.Matchers);
    include(Screw.Keywords);
  });
}});
module("Screw", function(c) { with (c) {
  module("RunnableMethods", function() {
    def('path', function() {
      if (!this.parent_description) {
        return [];
      }
      return this.parent_description.path().concat([this.index]);
    });

    def('on_example_completed', function(callback) {
      this.example_completed_subscription_node.subscribe(callback);
    });
  });
}});
module("Screw", function(c) { with (c) {
  constructor("Description", function() {
    include(Screw.RunnableMethods);

    def('initialize', function(name) {
      this.name = name;
      this.children = [];
      this.child_descriptions = [];
      this.examples = [];
      this.befores = [];
      this.afters = [];
      this.example_completed_subscription_node = new Screw.SubscriptionNode();
    });

    def('total_examples', function() {
      var total_examples = this.examples.length;
      Screw.each(this.child_descriptions, function() {
        total_examples += this.total_examples();
      })
      return total_examples;
    });

    def('failed_examples', function() {
      var failed_examples = [];
      Screw.each(this.examples, function() {
        if (this.failed) {
          failed_examples.push(this);
        }
      });
      Screw.each(this.child_descriptions, function() {
        failed_examples = failed_examples.concat(this.failed_examples());
      });
      return failed_examples;
    });

    def('runnable_at_path', function(path) {
      var current_runnable = this;
      Screw.each(path, function() {
        current_runnable = current_runnable.children[this];
      });
      return current_runnable;
    })

    def('add_description', function(description) {
      var self = this;
      description.parent_description = this;
      description.index = this.children.length;
      this.children.push(description);
      this.child_descriptions.push(description);
      description.on_example_completed(function(example) {
        self.example_completed_subscription_node.publish(example);
      })
    });

    def('add_example', function(example) {
      var self = this;
      example.parent_description = this;
      example.index = this.children.length;
      this.children.push(example);
      this.examples.push(example);

      example.on_example_completed(function(example) {
        self.example_completed_subscription_node.publish(example);
      });
    });

    def('add_before', function(fn) {
      this.befores.push(fn);
    });

    def('add_after', function(fn) {
      this.afters.push(fn);
    });

    def('enqueue', function() {
      var enqueue_it = function() {
        this.enqueue()
      };
      Screw.each(this.examples, enqueue_it);
      Screw.each(this.child_descriptions, enqueue_it);
    });

    def('run', function() {
      var run_it = function() {
        this.run()
      };
      Screw.each(this.examples, run_it);
      Screw.each(this.child_descriptions, run_it);
    });

    def('run_befores', function(example_context) {
      if (this.parent_description) {
        this.parent_description.run_befores(example_context);
      }

      Screw.each(this.befores, function() {
        this.call(example_context);
      });
    });

    def('run_afters', function(example_context) {
      Screw.each(this.afters, function() {
        this.call(example_context);
      });

      if (this.parent_description) {
        this.parent_description.run_afters(example_context);
      }
    });
  });
}});
module("Screw", function(c) { with (c) {
  constructor("Example", function() {
    include(Screw.RunnableMethods);

    def('initialize', function(name, fn, pending) {
      this.name = name;
      this.fn = fn;
      this.fail_subscription_node = new Screw.SubscriptionNode();
      this.pass_subscription_node = new Screw.SubscriptionNode();
      this.pending_subscription_node = new Screw.SubscriptionNode();
      this.example_completed_subscription_node = new Screw.SubscriptionNode();
      this.passed = false;
      this.failed = false;
      this.pending = !!pending;
    });

    def('enqueue', function() {
      var self = this;
      setTimeout(function() { self.run(); }, 0);
    });

    def('run', function() {
      if (this.pending) {
        this.pending_subscription_node.publish()
        this.example_completed_subscription_node.publish(this);
      } else {
        try {
          try {
            var example_context = {};
            this.parent_description.run_befores(example_context);
            this.fn.call(example_context);
          } finally {
            this.parent_description.run_afters(example_context);
            Screw.reset_mocks();
          }
          this.passed = true;
          this.pass_subscription_node.publish();
          this.example_completed_subscription_node.publish(this);
        } catch(e) {
          this.failed = true;
          this.fail_subscription_node.publish(e);
          this.example_completed_subscription_node.publish(this);
        }
      }
    });

    def('on_fail', function(callback) {
      this.fail_subscription_node.subscribe(callback);
    });

    def('on_pass', function(callback) {
      this.pass_subscription_node.subscribe(callback);
    });

    def('on_pending', function(callback) {
      this.pending_subscription_node.subscribe(callback);
    })

    def('total_examples', function() {
      return 1;
    });
  });
}});
module("Screw", function(c) { with (c) {
  constructor("SubscriptionNode", function() {
    def('initialize', function() {
      this.callbacks = [];
    })

    def('subscribe', function(callback) {
      this.callbacks.push(callback);
    })

    def('publish', function() {
      var args = arguments;
      Screw.each(this.callbacks, function() {
        this.apply(this, args);
      })
    })
  })
}});
Screw.Disco = function() {
  this.doc = [];
};

Screw.$.extend(Screw.Disco, {
  inherit: function(layout, template) {
    var merged_template = Screw.$.extend(true, {}, layout, template);

    merged_template.methods = merged_template.methods || {};

    merged_template.methods.after_initialize = function() {
      if(layout.methods && layout.methods.after_initialize) {
        layout.methods.after_initialize.call(this);
      }
      if(template.methods && template.methods.after_initialize) {
        template.methods.after_initialize.call(this);
      }
    };

    return merged_template;
  },

  build: function(fn_or_template, initial_attributes) {
    var builder = new this();
    if (fn_or_template instanceof Function) {
      fn_or_template(builder, initial_attributes);
    } else {
      fn_or_template.content(builder, initial_attributes);
    }
    return builder.to_view(fn_or_template, initial_attributes);
  },

  initialize: function() {
    var supported_tags = [
      'a', 'acronym', 'address', 'area', 'b', 'base', 'bdo', 'big', 'blockquote', 'body',
      'br', 'button', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dl', 'dt', 'em',
      'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'html', 'i',
      'img', 'iframe', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map',
      'meta', 'noframes', 'noscript', 'ol', 'optgroup', 'option', 'p', 'param', 'pre',
      'samp', 'script', 'select', 'small', 'span', 'strong', 'style', 'sub', 'sup',
      'table', 'tbody', 'td', 'textarea', 'th', 'thead', 'title', 'tr', 'tt', 'ul', 'var'
    ];

    for(var i=0; i < supported_tags.length; i++) {
      var tag = supported_tags[i];
      this.register_tag(tag);
    }
    var event_types = ["blur", "change", "click", "dblclick", "error", "focus", "keydown",
      "keypress", "keyup", "load", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup",
      "resize", "scroll", "select", "submit", "unload"];

    for(var i=0; i < event_types.length; i++) {
      var event_type = event_types[i];
      this.register_event_type(event_type);
    }
  },

  register_tag: function(tag_name) {
    this.prototype[tag_name] = function() {
      return this.tag_with_array_args(tag_name, arguments);
    };
  },

  register_event_type: function(event_type) {
    this.prototype[event_type] = function(fn) {
      this.doc.push(new Screw.Disco.PostProcessorInstruction('bind', [event_type, null, fn]));
    };
  }
});

Screw.$.extend(Screw.Disco.prototype, {
  tag: function() {
    if(arguments.length > 3) {
      throw("XmlBulider#tag does not accept more than three arguments");
    }
    var tag_name, attributes, value;
    tag_name = arguments[0];

    var arg1 = arguments[1];
    if(typeof arg1 == 'object') {
      attributes = arg1;
      var arg2 = arguments[2];
      if(typeof arg2 == 'function' || typeof arg2 == 'string'){
        value = arg2;
      };
    } else if(typeof arg1 == 'function' || typeof arg1 == 'string'){
      value = arg1;
      var arg2 = arguments[2];
      if(typeof arg2 == 'object') {
        attributes = arg2;
      }
    };

    var open_tag = new Screw.Disco.OpenTag(tag_name, attributes);
    this.doc.push(open_tag);

    if(typeof value == 'function') {
      value.call(this);
    } else if(typeof value == 'string') {
      this.doc.push(new Screw.Disco.Text(value));
    }

    this.doc.push(new Screw.Disco.CloseTag(tag_name));

    return this;
  },

  tag_with_array_args: function(tag, args) {
    if(!args) return this.tag(tag);

    var new_arguments = [tag];
    for(var i=0; i < args.length; i++) {
      new_arguments.push(args[i]);
    }
    return this.tag.apply(this, new_arguments);
  },

  rawtext: function(value) {
    this.doc.push(new Screw.Disco.Text(value));
  },

  text: function(value) {
    var html = this.escape_html(value);
    this.doc.push(new Screw.Disco.Text(html));
  },

  escape_html: function(html) {
    return html.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;")
  },

  subview: function(name, template, initial_attributes) {
    this.doc.push(new Screw.Disco.PostProcessorInstruction('open_subview', [name]))
    template.content(this, initial_attributes);
    this.doc.push(new Screw.Disco.PostProcessorInstruction('close_view', [template, initial_attributes]))
  },

  keyed_subview: function(name, key, template, initial_attributes) {
    this.doc.push(new Screw.Disco.PostProcessorInstruction('open_subview', [name, key]))
    template.content(this, initial_attributes);
    this.doc.push(new Screw.Disco.PostProcessorInstruction('close_view', [template, initial_attributes]))
  },

  bind: function() {
    var type = arguments[0];
    if (arguments.length > 2) {
      var data = arguments[1];
      var fn = arguments[2];
    } else {
      var data = null;
      var fn = arguments[1];
    }

    this.doc.push(new Screw.Disco.PostProcessorInstruction('bind', [type, data, fn]));
  },

  to_string: function() {
    var output = "";
    for(var i=0; i < this.doc.length; i++) {
      var element = this.doc[i];
      output += element.to_string();
    }
    return output;
  },

  to_view: function(template, initial_attributes) {
    var string = this.to_string();
    if (string == "") return "";
    var post_processor = new Screw.Disco.PostProcessor(Screw.$(string));
    for(var i=0; i < this.doc.length; i++) {
      var element = this.doc[i];
      element.post_process(post_processor);
    }
    post_processor.close_view(template, initial_attributes);
    return post_processor.root_view;
  }
});

Screw.Disco.initialize();

Screw.Disco.OpenTag = function(tag_name, attributes) {
  this.tag_name = tag_name;
  this.attributes = attributes;
}

Screw.$.extend(Screw.Disco.OpenTag.prototype, {
  to_string: function() {
    var serialized_attributes = [];
    for(var attributeName in this.attributes) {
      serialized_attributes.push(attributeName + '="' + this.attributes[attributeName] + '"');
    }
    if(serialized_attributes.length > 0) {
      return "<" + this.tag_name + " " + serialized_attributes.join(" ") + ">";
    } else {
      return "<" + this.tag_name + ">";
    }
  },

  post_process: function(processor) {
    processor.push();
  }
});

Screw.Disco.CloseTag = function(tag_name) {
  var that = this;
  this.tag_name = tag_name;
}

Screw.$.extend(Screw.Disco.CloseTag.prototype, {
  to_string: function() {
    return "</" + this.tag_name + ">";
  },

  post_process: function(processor) {
    processor.pop();
  }
});

Screw.Disco.Text = function(value) {
  this.value = value;
}

Screw.$.extend(Screw.Disco.Text.prototype, {
  to_string: function() {
    return this.value;
  },

  post_process: function(processor) {}
});

Screw.Disco.PostProcessorInstruction = function(function_name, arguments) {
  this.function_name = function_name;
  this.arguments = arguments;
}

Screw.$.extend(Screw.Disco.PostProcessorInstruction.prototype, {
  to_string: function() {
    return "";
  },

  post_process: function(processor) {
    processor[this.function_name].apply(processor, this.arguments);
  }
});

Screw.Disco.PostProcessor = function(root_view) {
  this.root_view = root_view;
  this.view_stack = [root_view];
  this.selector_stack = [0];
}

Screw.$.extend(Screw.Disco.PostProcessor.prototype, {
  push: function() {
    this.add_child();
    this.selector_stack.push(0);
  },

  add_child: function() {
    if (!this.selector_stack.length == 0) {
      this.selector_stack[this.selector_stack.length - 1]++;
    }
  },

  pop: function() {
    this.selector_stack.pop();
  },

  open_subview: function(name, key) {
    var view = this.next_element();
    var current_view = this.current_view();
    if (!key) {
      current_view[name] = view;
    } else {
      if (!current_view[name]) {
        current_view[name] = {};
      }
      current_view[name][key] = view;
    }
    view.parent = current_view;
    this.view_stack.push(view);
  },

  close_view: function(template, initial_attributes) {
    var current_view = this.current_view();
    if (template && template.methods) {
      Screw.$.extend(current_view, template.methods);
    }
    if (template && template.configuration) {
      current_view.configuration = template.configuration;
    }
    if (initial_attributes) {
      Screw.$.extend(current_view, initial_attributes);
    }
    if (current_view.after_initialize) {
      current_view.after_initialize();
    }
    this.view_stack.pop();
  },

  bind: function(type, data, fn) {
    var view = this.current_view();
    this.previous_element().bind(type, data, function(event) {
      fn(event, view);
    });
  },

  next_element: function() {
    return this.find_element(this.next_selector());
  },

  previous_element: function() {
    if(this.selector_stack.length == 1) {
      if (this.root_view.length == 1) {
        return this.root_view;
      } else {
        return this.root_view.eq(this.num_root_children() - 1);
      }
    } else {
      return this.find_element(this.previous_selector());
    }
  },

  find_element: function(selector) {
    if(this.root_view.length == 1) {
      return this.root_view.find(selector);
    } else {
      return this.root_view.eq(this.num_root_children() - 1).find(selector);
    }
  },

  num_root_children: function() {
    return this.selector_stack[0];
  },

  next_selector: function() {
    return this.selector(true)
  },

  previous_selector: function() {
    return this.selector(false)
  },

  selector: function(next) {
    var selectors = [];
    for(var i = 1; i < this.selector_stack.length; i++) {
      if (i == this.selector_stack.length - 1) {
        var index = next ? this.selector_stack[i] + 1 : this.selector_stack[i];
        selectors.push(":nth-child(" + index + ")")
      } else {
        selectors.push(":nth-child(" + this.selector_stack[i] + ")")
      }
    }
    return "> " + selectors.join(" > ");
  },

  current_view: function() {
    return this.view_stack[this.view_stack.length - 1];
  }
});
module("Screw", function(c) { with(c) {
  module("Interface", function() {
    def('load_preferences', function() {
      Prefs.load();
      if (!Prefs.data.show) {
        Prefs.data.show = "all";
      }
    });

    def('refresh', function() {
      this.set_location(this.get_location());
    });

    def('set_location', function(location) {
      window.location = location;
    });

    def('get_location', function() {
      return window.location.toString();
    });

    def('examples_to_run', function() {
      if (Prefs.data.run_paths) {
        return Screw.map(Prefs.data.run_paths, function() {
          return Screw.root_description().runnable_at_path(this);
        })
      } else {
        return [Screw.root_description()];
      }
    });
  });
}});

Screw.$(function() {
  Screw.Interface.load_preferences();
  var runner = Screw.Disco.build(Screw.Interface.Runner, {root: Screw.root_description()});
  setTimeout(function() {
    Screw.$('body').html(runner);
    runner.enqueue();
  }, 0);
});
module("Screw", function(c) { with(c) {
  module("Interface", function() {
    def('Runner', {
      content: function(b, initial_attributes) { with (b) {
        div({'id': "screw_unit_runner"}, function() {
          table({'id': "screw_unit_header"}, function() {
            tbody(function() {
              tr(function() {
                td({'id': "screw_unit_controls"}, function() {
                  button({'id': "show_all"}, "Show All").click(function(e, view) {
                    view.show_all();
                  });
                  button({'id': "show_failed"}, "Show Failed").click(function(e, view) {
                    view.show_failed();
                  });
                  button({'id': "rerun_all"}, "Rerun All").click(function(e, view) {
                    view.rerun_all();
                  });
                  button({'id': "rerun_failed"}, "Rerun Failed").click(function(e, view) {
                    view.rerun_failed();
                  });
                });
                td(function() {
                  subview('progress_bar', Screw.Interface.ProgressBar, {examples_to_run: Screw.Interface.examples_to_run()});
                });
              })
            })
          });

          div({'id': 'test_content'});

          ul({'class': 'descriptions'}, function() {
            subview('root_description', Screw.Interface.Description, {description: initial_attributes.root, build_immediately: initial_attributes.build_immediately});
          });
        });
      }},

      methods: {
        after_initialize: function() {
          if (Prefs.data.show == "all") this.addClass("show_all");
          if (Prefs.data.show == "failed") this.addClass("show_failed");
        },

        show_failed: function() {
          Prefs.data.show = "failed";
          Prefs.save();
          this.addClass('show_failed');
          this.removeClass('show_all');
        },

        show_all: function() {
          Prefs.data.show = "all";
          Prefs.save();
          this.addClass('show_all');
          this.removeClass('show_failed');
        },

        rerun_failed: function() {
          Prefs.data.run_paths = Screw.map(this.root.failed_examples(), function() {
            return this.path();
          });
          Prefs.save();
          Screw.Interface.refresh();
        },

        rerun_all: function() {
          Prefs.data.run_paths = null;
          Prefs.save();
          Screw.Interface.refresh();
        },

        enqueue: function() {
          Screw.each(Screw.Interface.examples_to_run(), function() {
            this.enqueue();
          });
        }
      }
    });
  });
}});
module("Screw", function(c) { with(c) {
  module("Interface", function() {
    def('ProgressBar', {
      content: function(b, initial_attributes) { with(b) {
        div({'id': 'screw_unit_progress_bar'}, function() {
          div({'id': 'screw_unit_progress'});
          div({'id': 'screw_unit_progress_text'});
        });
      }},

      methods: {
        after_initialize: function() {
          var self = this;
          this.total_examples = 0;
          Screw.each(this.examples_to_run, function() {
            self.total_examples += this.total_examples();
            this.on_example_completed(function(example) {
              self.update_progress(example);
            });
          });


          this.completed_examples = 0;
          this.failed_examples = 0;

          this.progress_div = this.find('div#screw_unit_progress');
          this.progress_text_div = this.find('div#screw_unit_progress_text');

          this.resize_progress_div();
          this.refresh_progress_text();
        },

        update_progress: function(example) {
          this.completed_examples++;
          if (example.failed) {
            this.failed_examples++;
            this.addClass('failed');
          }

          this.resize_progress_div();
          this.refresh_progress_text();
        },

        resize_progress_div: function() {
          var percent_complete = (this.total_examples == 0) ? 0 : (this.completed_examples / this.total_examples * 100);
          this.progress_div.css("width", percent_complete + "%");
        },

        refresh_progress_text: function() {
          this.progress_text_div.html(this.completed_examples + " of " + this.total_examples + " completed. " + this.failed_examples + " failed.");
        }
      }
    });
  });
}});
module("Screw", function(c) { with(c) {
  module("Interface", function() {
    def('Description', {
      content: function(b, initial_attributes) { with (b) {
        var description = initial_attributes.description;
        li({'class': 'description'}, function() {
          span({'class': 'name'}, description.name).click(function(e, view) {
            view.focus();
          });

          if (description.examples.length > 0) {
            ul({'class': 'examples'});
          }

          if (description.child_descriptions.length > 0) {
            ul({'class': 'child_descriptions'});
          }
        });
      }},

      methods: {
        after_initialize: function() {
          this.build_examples();
          this.build_child_descriptions();

          if (Prefs.data.show == "failed") {
            this.hide();
          }

          var self = this;
          this.description.on_example_completed(function(example) {
            if (example.failed) {
              self.addClass('failed')
            } else {
              self.addClass('passed');
            }
          })
        },

        build_examples: function() {
          var self = this;
          var examples_container = this.find("ul.examples").eq(0);
          Screw.each(this.description.examples, function() {
            var subview = Screw.Disco.build(Screw.Interface.Example, {example: this});
            self.build_subview(examples_container, subview);
          });
        },

        build_child_descriptions: function() {
          var self = this;
          var child_descriptions_container = this.find("ul.child_descriptions").eq(0);
          Screw.each(this.description.child_descriptions, function() {
            var subview = Screw.Disco.build(Screw.Interface.Description, {description: this, build_immediately: self.build_immediately});
            self.build_subview(child_descriptions_container, subview);
          });
        },

        build_subview: function(container, subview) {
          if (this.build_immediately) {
            container.append(subview);
          } else {
            setTimeout(function() { container.append(subview); }, 0);
          }
        },

        focus: function() {
          Prefs.data.run_paths = [this.description.path()];
          Prefs.save();
          Screw.Interface.refresh();
        }
      }
    });
  });
}});
module("Screw", function(c) { with(c) {
  module("Interface", function() {

    def('Example', {
      content: function(b, initial_attributes) { with(b) {
        li({'class': 'example'}, function() {
          span(initial_attributes.example.name, {'class': 'name'}).click(function(e, view) {
            view.focus();
          });
        });
      }},

      methods: {
        after_initialize: function() {
          var self = this;
          this.example.on_pending(function() {
            self.addClass("pending");
          })
          this.example.on_pass(function() {
            self.addClass("passed");
          })
          this.example.on_fail(function(e) {
            self.addClass("failed");

            var message = Screw.$("<div class='failure_message'/>");
            message.text(e.message);

            var trace = Screw.$("<pre class='failure_trace'/>");
            if (e.stack) {
              enhanced_stack = e.stack.replace(/http:\/\/(.*_spec)\.js/g, '<a href="http://$1" target="_blank">http://$1.js</a>')
              trace.html(enhanced_stack);
            }

            self.append(message);
            self.append(trace);
          });
        },

        focus: function() {
          Prefs.data.run_paths = [this.example.path()];
          Prefs.save();
          Screw.Interface.refresh();
        }
      }
    });
  });
}});
