import { FUNCTION_DEF_IDENTIFIER } from "../SvamSPIntellisense/SvamSPIntellisense";


const myStringify = (objectForStringify:object,tabOut?:number) => {

    const transformJson = (json: string) => {

        const jsonLineArray = json.split('\n');

        const transformedJsonArray: string[] = [];
        jsonLineArray.map(jsonLine => {
            if (jsonLine.indexOf(':') < 0) {
                transformedJsonArray.push(jsonLine);
                return
            }

            const firstDoubleDotIndex = jsonLine.indexOf(':');

            const key = jsonLine.substring(0,firstDoubleDotIndex);
            const value = jsonLine.substring(firstDoubleDotIndex+1);
        

            const replacedKey = key.replace(new RegExp('"', 'g'), '');

            let replacedValue = value.replace(new RegExp('"', 'g'), '\'');
            replacedValue = replacedValue.trim();
            if(replacedValue.startsWith('\'' +FUNCTION_DEF_IDENTIFIER)) {
                
                replacedValue = replacedValue.replace('\'' +FUNCTION_DEF_IDENTIFIER,'');
                replacedValue = replacedValue.substring(0,replacedValue.length-1);
                replacedValue = replacedValue.replace(/\r/g,'');
                replacedValue = replacedValue.replace(/\\n/g,'\n');
                replacedValue = replacedValue.replace(/\\t/g,'\t');
            }

            transformedJsonArray.push(replacedKey + ':' + replacedValue);

        });

        const transformedJson = transformedJsonArray.join('\n');
        return transformedJson;
    }


    const firstJsonTransform = JSON.stringify(objectForStringify, null, '\t');

    const returningJson = transformJson(firstJsonTransform);

    return returningJson;

}

export default myStringify;

