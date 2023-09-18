
export type FieldDefinition = {

    name?: string

    type?: string

    importPath?: string
}

export class TypeUtils {


    static getTypeFile(type: 'interface' | 'type', name: string, fieldsArray: FieldDefinition[]) {

        const typeDefStart = 'export ' + type + ' ' + name + (type === 'type' ? '=' : '') + ' {'
        const typeDefEnd = '}'

        const importString = fieldsArray
            .filter(({ importPath }) => importPath)
            .map(({ importPath, type }) => 'import {' + type + '} from \'' + importPath + '\';')
            .join('\n')


        const fieldsString = fieldsArray
            .map(({ name, type }) => '\t' + name + ':?' + type)
            .join('\n');


        return [
            importString,
            '',
            typeDefStart,
            fieldsString,
            typeDefEnd
        ].join('\n')

    }
    
}