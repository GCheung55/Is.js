Is.js
======================

MooTools convenient type-check methods and deep equality comparator.

__Version: 0.0.3__

__Influences:__

*   [Underscore](https://github.com/documentcloud/underscore/)

__Dependencies:__

*   [MooTools-Core 1.x](https://github.com/mootools/mootools-core)

## Is
__Is__ is an object that contains methods for checking type and equality. The API contains all of the methods found in `Type` from MooTools-Core, with a few additions. `Type` is decorated so that a convenient type-check method is also added to `Is` whenever a new type is created.

Along with the positive checks, we have the opposing negative checks that can be accessed in `Is.not`.

All type-check methods take only one argument: the object which will be type-checked. `Is.Equal` is the only method that takes two arguments.

#### Examples:
```javascript
// start a new type.
var Human = function(){};

Is.Human; // returns undefined
Is.not.Human // returns undefined

// create the Human type.
new Type('Human', Human);

Is.Human; // returns function
Is.not.Human; // returns function

var Garrick;
Is.Human(Garrick); // returns false

Garrick = new Human;
Is.Human(Garrick); // returns true
```

### Equal
---
Performs an optimized deep comparison between the two objects, to determine if they should be considered equal.

#### Syntax:
```javascript
Is.Equal(object, other);
```

#### Arguments:
1.  `object` - (Mixed)
    Can be anything. Used to compare with `other` object. Deep comparisons are done on `Object` types where each item is compared with the each item in `other`.
2.  `other` - (Mixed)
    Just like `object`, can be anything.

#### Returns: Boolean (true/false)

#### Notes:
If either `object` or `other` contains an `isEqual` method, that method is passed the opposing object that is being tested. The result will be returned by `Equal` method and the comparisons stops there.

#### Examples:
```javascript
// Two objects that have the same properties, but are two different Object instances.
var a = {something: 'to', compare: 'to'},
    b = {something: 'to', compare: 'to'};

a == b; // returns false
Is.Equal(a, b); // returns true because the properties are the same

// Change the properties
b = {something: 'else', to: {compare: 'to'}};

a == b; // returns false
Is.Equal(a, b); // returns false

// an isEqual that will be used to test two objects
a.isEqual = function(other){
    // we know they do not equal, but lets just say it does
    return true;
}

Is.Equal(a, b); // returns true
```

### NaN
---
Type-check for `NaN`.

#### Examples:
```javascript
Is.NaN('1'); // returns false
Is.NaN('NaN'); // returns false
Is.NaN(NaN); // returns true
```

### Null
---
Type-check for `null`.

#### Examples:
```javascript
Is.Null(''); // returns false
Is.Null(undefined); // returns false
Is.Null(null); // returns true
```

### Undefined
Type-check for `undefined`.

#### Examples:
```javascript
Is.Undefined(''); // returns false
Is.Undefined(null); // returns false
Is.Undefined(); // returns true
Is.Undefined(undefined); // returns true
Is.Undefined(void 0); // returns true
```

### MooTools-Core Type Methods
The following methods have been implemented from MooTools-Core `Type`. They take the same arguments as their `Type` counterparts. They also exist in `Is.not`.

*   `Arguments`
*   `Array`
*   `Boolean`
*   `Class`
*   `DOMEvent`
*   `Date`
*   `Document`
*   `Element`
*   `Elements`
*   `Enumerable`
*   `Function`
*   `IFrame`
*   `Number`
*   `Object`
*   `RegExp`
*   `String`
*   `TextNode`
*   `Type`
*   `WhiteSpace`
*   `Window`