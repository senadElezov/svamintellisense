
class Injector {

    readonly injectableInstances = new Map<string, Function>()
    readonly injectables: { [key: string]: any } = {};

    static resolve<T extends Function>(target: T): T {

        return target;
    }

    resolve(target: any) {

        return target;
    }

    constructor() { }
}

export const resolver = new Injector();
(globalThis as any)['resolver'] = resolver;
(globalThis as any)['Reflect'] = Reflect;