/**
 This file is to check that your tools support the full range of TS syntax up-to v5.0
 The tool most likely to fail with syntax highlighting tools, as those aren't going to link the actual TS lib.

Feed this file into the tool, in pedantic mode that will keep running until the end of file.
For a compiler, it is expected that fake import statements will fail, and an error message near 
		lines marked 'ERROR HERE'.

Text was derived from https://www.typescriptlang.org/docs/handbook/release-notes/
which is a web render of https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/release-notes/

** As far as this is original material (not sure about that status for this file) **::
I release this as the most recent version of LGPL, so copying into projects commercial or otherwise is permitted
*/

// sample for TS 4.4
class Foo {
    static count = 0;
 
    // This is a static block, just like Perl5
    static {
        if (someCondition()) {
            Foo.count++;
        }
    }
}

// sample for TS 4.4
abstract class C {
// allowed, but I would favour an interface value.
  abstract prop1: number;
// doesn't make sense , , , verboten
  abstract prop2 = 1;
}

// sample for TS 4.7
// 'key' has type 'unique symbol'
const key = Symbol();
class C {
// left-hand assignment on array is a thing?
// it would make more sense the class extended Array
    [key]: string;
    constructor(str: string) {
        // ERROR HERE forgot to set 'this[key]'
    }
    screamString() {
        return this[key].toUpperCase();
    }
}

// sample for TS 4.9
class Person {
// new keyword
    accessor name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Person {
    #__name: string;
    get name() {
        return this.#__name;
    }
    set name(value: string) {
        this.#__name = value;
    }
    constructor(name: string) {
// invisible call to the setter
        this.name = name;
    }
}



}}
{{plain sample2
// sample for TS 4.4
let fooModule = {
  foo() {
    console.log(this);
  },
};
// There is suppression of this, to avoid logical errors
//     however you can step round this
(0, fooModule.foo)();

// sample for TS 4.7
declare function f<T>(arg: {
    produce: (n: string) => T,
    consume: (x: T) => void }
): void;
// Works
f({
    produce: () => "hello",
    consume: x => x.toLowerCase()
});
// Works
f({
    produce: (n: string) => n,
    consume: x => x.toLowerCase(),
});
// Was an error, now works.
f({
    produce: n => n,
    consume: x => x.toLowerCase(),
});
// Was an error, now works.
f({
    produce: function () { return "hello"; },
    consume: x => x.toLowerCase(),
});
// Was an error, now works.
f({
    produce() { return "hello" },
    consume: x => x.toLowerCase(),
});

// sample for TS 4.7
type Getter<out T> = () => T;
type Setter<in T> = (value: T) => void;
interface State<in out T> {
    get: () => T;
    set: (value: T) => void;
}

// sample for TS 4.7
/*
resolution-mode  
TypeScript now allows /// <reference types="..." /> directives.
*/

/// <reference types="pkg" resolution-mode="require" />
/// <reference types="pkg" resolution-mode="import" />

// sample for TS 4.8
declare function makePerson1(options: { name: string, age: number }): Person;
declare function makePerson2({ name, age }: { name: string, age: number }): Person;

// sample for TS 5.0
// using this allows / requires a runtime chosen prefix, which makes it more useful.
function loggedMethod(headMessage = "LOG:") {
    return function actualDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
        const methodName = String(context.name);
        function replacementMethod(this: any, ...args: any[]) {
            console.log(`${headMessage} Entering method '${methodName}'.`)
            const result = originalMethod.call(this, ...args);
            console.log(`${headMessage} Exiting method '${methodName}'.`)
            return result;
        }
        return replacementMethod;
    }
}
i
// simpler version
function loggedMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    function replacementMethod(this: any, ...args: any[]) {
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = originalMethod.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }
    return replacementMethod;
}

function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;
    if (context.private) {
        throw new Error(`'bound' cannot decorate private props like ${methodName as string}.`);
    }
    context.addInitializer(function () {
        this[methodName] = this[methodName].bind(this);
    });
}

class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
// Decorators are applied in reverse order
    @bound
    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}
const p = new Person("Ray");
const greet = p.greet;
// Works!
greet();


}}
{{plain sample3
// sample for TS 4.7
interface Box<T> {
    value: T;
}
function makeBox<T>(value: T) {
    return { value };
}
const makeHammerBox = makeBox<Hammer>;
const makeWrenchBox = makeBox<Wrench>;

}}
{{plain sample4
// sample for TS 4.4
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };
 
function area(shape: Shape): number {
  const { kind } = shape;
 
  if (kind === "circle") {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.sideLength ** 2;
  }
}

// sample for TS 4.5
type A = Awaited<Promise<string>>;
type B = Awaited<Promise<Promise<number>>>;
// C = boolean | number
type C = Awaited<boolean | Promise<number>>;

// sample for TS 4.5 + ES2022
// top-level await, meaning you can use await outside of async function
let ret=await fetch('https://google.com', {});

// sample for TS 4.5
import type { BaseType } from "./some-module.js";
import { someFunc, type BaseType } from "./some-module.js";

// sample for TS 4.5
// I think this would execute in C#
class Person {
    #name: string;   // private var without keyword
    constructor(name: string) {
        this.#name = name;
    }
    equals(other: unknown) {
        return other &&
            typeof other === "object" &&
            #name in other && 		// <- this is new!
            this.#name === other.#name;
    }
}

// sample for TS 4.5
import obj from "./something.json" assert { type: "json" };
const obj = await import("./something.json", {
  assert: { type: "json" },
});

// sample for TS 4.7
type FirstIfString<T> =
    T extends [infer S, ...unknown[]]
        ? S extends string ? S : never
        : never;
 // string
type A = FirstIfString<[string, number, number]>;
// "hello"
type B = FirstIfString<["hello", number, number]>;
// "hello" | "world"
type C = FirstIfString<["hello" | "world", boolean]>;
// never
type D = FirstIfString<[boolean, number, string]>;

// sample for TS 4.9
// add keyword satisfies
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
// ERROR HERE The typo is now caught!
} satisfies Record<Colors, string | RGB>;
// toUpperCase() method is still accessible!
const greenNormalized = palette.green.toUpperCase();

// sample for TS 4.9
interface RGB {
    red: number;
    green: number;
    blue: number;
}
interface HSV {
    hue: number;
    saturation: number;
    value: number;
}
function setColor(color: RGB | HSV) {
    if ("hue" in color) {
        // 'color' now has the type HSV
    }
    // ...
}


