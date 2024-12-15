// *** getter and setter types TS 5.1
class SafeBox {
    #value: string | undefined;
    // Only accepts strings!
    set value(newValue: string) {
    }
    // Must check for 'undefined'!
    get value(): string | undefined {
        return this.#value;
    }
}

// *** [Symbol.dispose] TS 5.2
class TempFile implements Disposable {
    #path: string;
    #handle: number;
    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }
    // other methods
    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}

// *** metadata TS 5.2
interface Context {
    name: string;
    metadata: Record<PropertyKey, unknown>;
}
function setMetadata(_target: any, context: Context) {
    context.metadata[context.name] = true;
}
class SomeClass {
    @setMetadata
    foo = 123;
    @setMetadata
    accessor bar = "hello!";
    @setMetadata
    baz() { }
}
const ourMetadata = SomeClass[Symbol.metadata];
console.log(JSON.stringify(ourMetadata));
// { "bar": true, "baz": true, "foo": true }

// **** Serialise TS 5.2
import { serialize, jsonify } from "./serializer";
class Person {
    firstName: string;
    lastName: string;
    @serialize
    age: number
    @serialize
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    toJSON() {
        return jsonify(this)
    }
    constructor(firstName: string, lastName: string, age: number) {
        // ...
    }
}

// *** use of super TS 5.3
class Base1 {
    someMethod() {
        console.log("someMethod called!");
    }
}
class Derived1 extends Base1 {
    someOtherMethod() {
        // These act identically.
        this.someMethod();
        super.someMethod();
    }
}
new Derived1().someOtherMethod();
// Prints:
//   someMethod called!
//   someMethod called!

class Base2 {
    someMethod = () => {
        console.log("someMethod called!");
    }
}
class Derived2 extends Base2 {
    someOtherMethod() {
        super.someMethod();
    }
}
new Derived2().someOtherMethod();
// 💥
// Doesn't work because 'super.someMethod' is 'undefined'.

// *** getter and setter types TS 5.1
interface CSSStyleRule {
    // ...
    /** Always reads as a `CSSStyleDeclaration` */
    get style(): CSSStyleDeclaration;
    /** Can only write a `string` here. */
    set style(newValue: string);
    // ...
}

//*** function return values examples in 5.1

// ✅ fine - we inferred that 'f1' returns 'void'
function f1() {
    // no returns
}
// ✅ fine - 'void' doesn't need a return statement
function f2(): void {
    // no returns
}
// ✅ fine - 'any' doesn't need a return statement
function f3(): any {
    // no returns
}
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
function f4(): undefined {
    // no returns
}

declare function takesFunction(f: () => undefined): undefined;
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
    // no returns
});
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
takesFunction((): undefined => {
    // no returns
});
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
    return;
});
// ✅ works
takesFunction(() => {
    return undefined;
});
// ✅ works
takesFunction((): undefined => {
    return;
});

// ✅ Works in TypeScript 5.1!
function f4(): undefined {
    // no returns
}
// ✅ Works in TypeScript 5.1!
takesFunction((): undefined => {
    // no returns
});

// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
    //                 ^ return type is undefined
    // no returns
});
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
    //                 ^ return type is undefined
    return;
});

// ✅ Works in TypeScript 5.1 under '--noImplicitReturns'!
function f(): undefined {
    if (Math.random()) {
        // do some stuff...
        return;
    }
}

interface Serializer {
    set value(v: string | number | boolean);
    get value(): string;
}
declare let box: Serializer;
// Allows writing a 'boolean'
box.value = true;
// Comes out as a 'string'
console.log(box.value.toUpperCase());


// *** TS 5.2
function loggy(id: string): Disposable {
    console.log(`Creating ${id}`);
    return {
        [Symbol.dispose]() {
            console.log(`Disposing ${id}`);
        }
    }
}
function func() {
    using a = loggy("a");
    using b = loggy("b");
    {
        using c = loggy("c");
        using d = loggy("d");
    }
    using e = loggy("e");
    return;
    // Unreachable.
    // Never created, never disposed.
    using f = loggy("f");
}
func();

// *** TS 5.2
class ErrorA extends Error {
    name = "ErrorA";
}
class ErrorB extends Error {
    name = "ErrorB";
}
function throwy(id: string) {
    return {
        [Symbol.dispose]() {
            throw new ErrorA(`Error from ${id}`);
        }
    };
}
function func() {
    using a = throwy("a");
    throw new ErrorB("oops!")
}
try {
    func();
}
catch (e: any) {
    console.log(e.name); // SuppressedError
    console.log(e.message); // An error was suppressed during disposal.
    console.log(e.error.name); // ErrorA
    console.log(e.error.message); // Error from a
    console.log(e.suppressed.name); // ErrorB
    console.log(e.suppressed.message); // oops!
}

// *** TS 5.2
function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");
    using cleanup = new DisposableStack();
    cleanup.defer(() => {
        fs.closeSync(file);
        fs.unlinkSync(path);
    });
    // use file...
    if (someCondition()) {
        // do some more work...
        return;
    }
    // ...
}

// **** extra serialise tricks   TS 5.2
const serializables = Symbol();
type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;
export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name === "symbol") {
        throw new Error("Cannot serialize symbol-named properties.");
    }
    const propNames =
        (context.metadata[serializables] as string[] | undefined) ??= [];
    propNames.push(context.name);
}
export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata?.[serializables] as string[] | undefined;
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }
    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });
    return `{ ${pairStrings.join(", ")} }`;
}

// *** narrowing switch types TS 5.3
function f(x: unknown) {
    switch (true) {
        case typeof x === "string":
            // 'x' is a 'string' here
            console.log(x.toUpperCase());
            // falls through...
        case Array.isArray(x):
            // 'x' is a 'string | any[]' here.
            console.log(x.length);
            // falls through...
        default:
          // 'x' is 'unknown' here.
          // ...
    }
}

// **** type fiddling on bool functions  TS 5.3
interface A {
    a: string;
}
interface B {
    b: string;
}
type MyType = A | B;
function isA(x: MyType): x is A {
    return "a" in x;
}
function someFn(x: MyType) {
    if (isA(x) === true) {
        console.log(x.a); // works!
    }
}

// **** add noInfer keyword support, TS 5.4
function createStreetLight1<C extends string>(colors: C[], defaultColor?: C) {
    // ...
}
createStreetLight1(["red", "yellow", "green"], "red");

// ❌ error!   This is undesirable, but is allowed!
createStreetLight1(["red", "yellow", "green"], "blue");

function createStreetLight2<C extends string>(colors: C[], defaultColor?: NoInfer<C>) {
    // ...
}
createStreetLight2(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// ❌ error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.

// *** newish in JS TS 5.4
const array = [0, 1, 2, 3, 4, 5];
const myObj = Object.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even": "odd";
});

// *** TS 5.2 
async function doWork() {
    // Do fake work for half a second.
    await new Promise(resolve => setTimeout(resolve, 500));
}
function loggy(id: string): AsyncDisposable {
    console.log(`Constructing ${id}`);
    return {
        async [Symbol.asyncDispose]() {
            console.log(`Disposing (async) ${id}`);
            await doWork();
        },
    }
}
async function func() {
    await using a = loggy("a");
    await using b = loggy("b");
    {
        await using c = loggy("c");
        await using d = loggy("d");
    }
    await using e = loggy("e");
    return;
    // Unreachable.
    // Never created, never disposed.
    await using f = loggy("f");
}
func();

// **** more complex version of last sample TS 5.2 
async function doWork() {
    // Do fake work for half a second.
    await new Promise(resolve => setTimeout(resolve, 500));
}
function loggy(id: string): AsyncDisposable {
    console.log(`Constructing ${id}`);
    return {
        async [Symbol.asyncDispose]() {
            console.log(`Disposing (async) ${id}`);
            await doWork();
        },
    }
}
async function func() {
    await using a = loggy("a");
    await using b = loggy("b");
    {
        await using c = loggy("c");
        await using d = loggy("d");
    }
    await using e = loggy("e");
    return;
    // Unreachable.
    // Never created, never disposed.
    await using f = loggy("f");
}
func();

// **** types and names  on Tupals  TS 5.2
// ✅ fine - no labels
type Pair1<T> = [T, T];
// ✅ fine - all fully labeled
type Pair2<T> = [first: T, second: T];
// ❌ previously an error
type Pair3<T> = [first: T, T];
//                         ~
// Tuple members must all have names
// or all not have names.
// ✅
type TwoOrMore_B<T> = [first: T, second: T, rest: ...T[]];

// *** KLAAAXXXON KLAAAXXXON this is the most important change, makes types globally useful TS 5.2
import type { JustAType } from "./justTypes.ts";
export function f(param: JustAType) {
    // ...
}

/**
 * @param {import("./justTypes.ts").JustAType} param
 */
export function f(param) {
    // ...
}

// **** extra fiddles for imports TS 5.3
// We only want this to be interpreted as JSON,
// not a runnable/malicious JavaScript file with a `.json` extension.
import obj from "./something.json" with { type: "json" };

const obj = await import("./something.json", {
    with: { type: "json" }
});

// **** add extra option TS 5.3
// Resolve `pkg` as if we were importing with a `require()`
import type { TypeFromRequire } from "pkg" with {
    "resolution-mode": "require"
};
// Resolve `pkg` as if we were importing with an `import`
import type { TypeFromImport } from "pkg" with {
    "resolution-mode": "import"
};
export interface MergedType extends TypeFromRequire, TypeFromImport {}

// **** see verbatimModuleSyntax TS 5.3
import { type Person } from "./types";
export let p: Person

// *** inference improvements TS 5.5
interface Bird {
    commonName: string;
    scientificName: string;
    sing(): void;
}

// Maps country names -> national bird.
// Not all nations have official birds (looking at you, Canada!)
declare const nationalBirds: Map<string, Bird>;

function makeBirdCalls(countries: string[]) {
  // birds: (Bird | undefined)[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);
  for (const bird of birds) {
    bird.sing();  // with new version this has correctly understood the filter declaration
  }
}

// *** inference improvements TS 5.5
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
// a poor implementation for reference
//    .filter(score => !!score);
// a better implementation 
    .filter(score => score !== undefined);
  return studentScores.reduce((a, b) => a + b) / studentScores.length;
}


