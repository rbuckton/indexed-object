/*!
   Copyright 2019 Ron Buckton

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

const integerRegExp = /^\d+$/;

function toIndex(propertyKey: PropertyKey) {
    const index =
        typeof propertyKey === "number" ? propertyKey :
        typeof propertyKey === "string" && integerRegExp.test(propertyKey) ? Number(propertyKey) :
        undefined;
    if (index !== undefined) {
        if (isNaN(index) || !isFinite(index)) return undefined;
        if (String(index) !== propertyKey) return undefined;
        if (Object.is(index, -0)) return undefined;
        if (index < 0) return undefined;
        if (index !== Math.floor(index)) return undefined;
        return index;
    }
}

/**
 * Represents an object that can be indexed by an integer value similar to a native
 * Array or TypedArray.
 */
export abstract class IntegerIndexedObject<T> {
    constructor() {
        return new Proxy(this, {
            // TODO: Determine best way to handle proxy trap invariants
            // getOwnPropertyDescriptor: (target, propertyKey) => {
            //     const index = toIndex(propertyKey);
            //     if (index !== undefined) {
            //         if (!target.hasIndex(index)) return undefined;
            //         const value = target.getIndex(index);
            //         return { enumerable: true, configurable: false, writable: true, value };
            //     }
            //     return Reflect.getOwnPropertyDescriptor(target, propertyKey);
            // },
            // defineProperty(target, propertyKey, descriptor) {
            //     const index = toIndex(propertyKey);
            //     if (index !== undefined) {
            //         if (descriptor.get || descriptor.set) return false;
            //         if ("configurable" in descriptor && descriptor.configurable) return false;
            //         if ("enumerable" in descriptor && !descriptor.enumerable) return false;
            //         if ("writable" in descriptor && !descriptor.writable) return false;
            //         if ("value" in descriptor) target.setIndex(index, descriptor.value);
            //         return true;
            //     }
            //     return Reflect.defineProperty(target, propertyKey, descriptor);
            // },
            has(target, propertyKey) {
                const index = toIndex(propertyKey);
                if (index !== undefined) {
                    return target.hasIndex(index);
                }
                return Reflect.has(target, propertyKey);
            },
            get(target, propertyKey, receiver) {
                const index = toIndex(propertyKey);
                if (index !== undefined) {
                    return target.getIndex(index);
                }
                return Reflect.get(target, propertyKey, receiver);
            },
            set(target, propertyKey, value, receiver) {
                const index = toIndex(propertyKey);
                if (index !== undefined) {
                    return target.setIndex(index, value);
                }
                return Reflect.set(target, propertyKey, value, receiver);
            },
            deleteProperty(target, propertyKey) {
                const index = toIndex(propertyKey);
                if (index !== undefined) {
                    return target.deleteIndex(index);
                }
                return Reflect.deleteProperty(target, propertyKey);
            },
            ownKeys(target) {
                const keys: PropertyKey[] = [];
                const length = target.getLength();
                for (let i = 0; i < length; i++) {
                    if (target.hasIndex(i)) {
                        keys.push(String(i));
                    }
                }
                for (const key of Reflect.ownKeys(target)) {
                    if (typeof key !== "string" || toIndex(key) === undefined) {
                        keys.push(key);
                    }
                }
                return keys;
            }
        });
    }

    /**
     * Gets the "length" of the indexed object, which should be one more than the 
     * largest index stored in the object.
     */
    protected abstract getLength(): number;

    /**
     * Determines whether the object contains a value at the specified index.
     * @param index An integer index greater than or equal to zero (`0`).
     */
    protected hasIndex(index: number): boolean {
        return index < this.getLength();
    }

    /**
     * Gets the value at the specified index.
     * @param index An integer index greater than or equal to zero (`0`).
     */
    protected abstract getIndex(index: number): T;

    /**
     * Sets the value at the specified index.
     * @param index An integer index greater than or equal to zero (`0`).
     * @param value The value to set for the specified index.
     * @returns `true` if the value could be set; otherwise, `false`.
     */
    protected setIndex(index: number, value: T): boolean {
        return false;
    }

    /**
     * Deletes the value at the specified index/
     * @param index An integer index greater than or equal to zero (`0`).
     * @returns `true` if the value was successfully deleted; otherwise, `false`.
     */
    protected deleteIndex(index: number): boolean {
        return false;
    }
}

export interface IntegerIndexedObject<T> {
    /**
     * Gets or sets the value at the specified index.
     */
    [index: number]: T;
}