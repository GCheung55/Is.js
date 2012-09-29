/**
 * Comparative and equality utility methods.
 * Inspired/influenced/copied from Underscore.js
 *
 * @author Garrick Cheung
 * @shoutout Mark Obcena (keeto)
 * @producer Dimitar Christoff (Suggested I take a look at Underscore.js)
 *
 * @requires [MooTools-Core]
 */

(function(context, global){

var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    oldType = global.Type,
    Is = context.Is = {};
	
// Wrap oldType so that any new Type will also add to Is object
var Type = global.Type = function(name, object){
	var obj = new oldType(name, object),
		str;
	
	if (!obj) { return obj; }
	
	str = 'is' + name,
	
	Is[name] = Is.not[name] = Type[str] = oldType[str];
	
	return obj;
}.extend(oldType);
	
// Make sure the new Type prototype is the same as the old one
Type.prototype = oldType.prototype;

for(var i in oldType){
    if (Type.hasOwnProperty(i) && i.test('is')){
        i = i.replace('is', '');
        Is[i] = Type['is' + i];
    }
}

Is['NaN'] = function(a){ return a !== a; };

Is['Null'] = function(a){ return a === null; };

Is['Undefined'] = function(a){ return a === void 0; };

var matchMap = {
    // Strings, numbers, dates, and booleans are compared by value.
    'string': function(a, b){
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
    },
    'number': function(a, b){
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
    },
    'date': function(a, b){
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
    },
    'boolean': function(a, b){
        return this.date(a, b);
    },
    // RegExps are compared by their source patterns and flags.
    'regexp': function(a, b){
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
};

var has = function(obj, key){
    return obj.hasOwnProperty(key);
}

// Internal recursive comparison function.
var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;

    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;

    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && Is.Function(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && Is.Function(b.isEqual)) return b.isEqual(a);

    // Compare types.
    var typeA = typeOf(a),
        typeB = typeOf(b);
    if (typeA != typeB) { return false }

    if (matchMap[typeA]) {
        return matchMap[typeA](a, b);
    }

    if (typeof a != 'object' || typeof b != 'object') return false;

    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] == a) return bStack[length] == b;
    }

    // Add the first object to the aStack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (typeA == 'array') {
        // Compare array lengths to determine if a deep comparison is necessary.
        size = a.length;
        result = size == b.length;
        if (result) {
            // Deep compare the contents, ignoring non-numeric properties.
            while (size--) {
                // Ensure commutative equality for sparse arrays.
                if (!(result = eq(a[size], b[size], aStack, bStack))) break;
            }
        }
    } else {
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aConstructor = a.constructor, bConstructor = b.constructor;
        if (aConstructor !== bConstructor 
            && !(Is.Function(aConstructor) 
                && instanceOf(aConstructor, aConstructor) 
                && Is.Function(bConstructor) 
                && instanceOf(bConstructor, bConstructor))) return false;
        // Deep compare objects.
        for (var key in a) {
            if (has(a, key)) {
                // Count the expected number of properties.
                size++;
                // Deep compare each member.
                if (!(result = has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
            }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
            for (key in b) {
                if (has(b, key) && !(size--)) break;
            }
            result = !size;
        }
    }
    // Remove the first object from the aStack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
}

Is.Equal = function(a, b){
    return eq(a, b, [], []);
};

//One out of the Testigo book (thanks keeto)
(function(obj){
    var not = {};
    for(var key in obj){
        if (has(obj, key)) {
            not[key] = (function(name){
                return function(a, b){ return !obj[name].call(obj, a, b); };
            })(key);
        }
    }
    obj.not = not;
})(Is);

})(typeof exports != 'undefined' ? exports : window, this.window || global);