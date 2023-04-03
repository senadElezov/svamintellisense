export  class ObjectUtils {

    static mapByKey(objectFrom: object, objectTo: object) {

        if (!objectFrom || !objectTo) {
            return;
        }

        Object.entries(objectFrom)
            .forEach(([key, value]) => {
                (objectTo as any)[key] = value
            });
    }
}
