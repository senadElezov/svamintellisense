
export class FormatUtils {

    static tabOut(n: number) {

        const arr: string[] = [];
        arr.length = n;
        arr.fill('\t');
        return arr.join('');

    }

}