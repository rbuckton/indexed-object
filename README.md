# `indexed-object`

> NOTE: `indexed-object` has been deprecated in favor of [`@esfx/indexed-object`](https://github.com/esfx/esfx/blob/master/packages/indexed-object#readme).
> Please update your references.

The `indexed-object` package provides a base class that allows for the definition of objects
that support integer indexes similar to native Arrays and Typed Arrays.

The underlying implementation uses a `Proxy` to trap integer indexes in a fashion similar to
the [Integer-Indexed Exotic Object](https://tc39.github.io/ecma262/#integer-indexed-exotic-object) 
in the ECMAScript specification.

# Installation

```sh
npm i indexed-object
```

# Usage

```ts
import { IntegerIndexedObject } from "indexed-object";

class BooleansCollection extends IntegerIndexedObject {
    getLength() {
        return 2;
    }
    getIndex(index) {
        switch (index) {
            case 0: return false;
            case 1: return true;
            default: return undefined;
        }
    }
    // hasIndex(index): boolean
    // setIndex(index, value): boolean
    // deleteIndex(index): boolean
}

const booleans = new BooleansCollection();
console.log(booleans[0]); // false
console.log(booleans[1]); // true
```
