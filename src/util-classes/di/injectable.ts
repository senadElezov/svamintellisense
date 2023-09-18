

export function Injectable() {

    return function <T extends Function>(target: T) {
        console.log({ target })
        Reflect.construct
    }
}