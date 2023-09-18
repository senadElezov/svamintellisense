import { Config } from '../app-state/config';
import { FormatUtils } from '../format-utils';
import { FSManager } from '../fs-manager';
import { IRemoteEndPoint } from './i-remote-end-point';
import { IRemoteFieldPrimitiveDto } from './i-remote-field.dto';
import { AppliedTypes, _IRemoteFieldDtoBase } from './i-remote-field.dto.base';
import { IRemoteFieldObjectDto } from './i-remote-object.dto';


export class RemoteClassesRepo {

    get remoteEndpoints() {
        return this._remoteEndpoints
    }
    set remoteEndpoints(value) {
        this._remoteEndpoints = value;
        this._initClasses();
    }

    private _classesRepo?: { [className: string]: IRemoteFieldObjectDto }

    constructor(
        private _remoteEndpoints: IRemoteEndPoint[],
        private _appConfig: Config
    ) {

    }

    private _loadAClassToRepo(classesRepo: { [className: string]: IRemoteFieldObjectDto }, classDefinition: IRemoteFieldObjectDto) {

        classesRepo[classDefinition.className] = classDefinition;

        classDefinition.fields
            ?.filter((t) => t.type === 'primitive')
            ?.forEach((objectDto) => {
                const remoteObjectDto = objectDto as IRemoteFieldObjectDto;

                this._loadAClassToRepo(classesRepo, remoteObjectDto)
            })
    }

    private  _initClasses() {

        const classesRepo = this._remoteEndpoints.reduce<{ [className: string]: IRemoteFieldObjectDto }>((classesRepo, currentEndpoint) => {

            const { body, response } = currentEndpoint;

            [body, response]
                .filter(t => t?.type === 'object')
                .forEach((objectDto) => {
                    const remoteObjectDto = objectDto as IRemoteFieldObjectDto;

                    this._loadAClassToRepo(classesRepo, remoteObjectDto)
                })

            return classesRepo;
        },
            {}
        )

        this._classesRepo = classesRepo;
    }

    async loadClassesToFiles() {

        if (!this._classesRepo) {
            return;
        }

        for (const classDefinition of Object.values(this._classesRepo)) {

            await this._loadClassDefinitionToFile(classDefinition);
        }

    }

    private async _loadClassDefinitionToFile(classDefinition: IRemoteFieldObjectDto) {

        const importString = this._getClassImportString(classDefinition);

        const fieldsDefinitionString = classDefinition.fields
            .map((field) => {

                if (field.type === 'object') {
                    return {
                        dataField: field.dataField,
                        appliedType: field.appliedType,
                        name: field.className,
                    }
                }

                return {
                    dataField: field.dataField,
                    appliedType: field.appliedType,
                    name: field.dataType
                }

            })
            .map(({ appliedType, dataField, name }) =>
                FormatUtils.tabOut(1) + dataField + '?:' + this._byAppliedType[appliedType || 'single'](name)

            )



        const classDefintionString = [
            importString,
            '',
            '',
            'export type ' + classDefinition.className + ' = {',
            fieldsDefinitionString,
            '}'
        ].join('\n')


        return FSManager.createFile({
            name: classDefinition.className,
            content: classDefintionString,
            path: this._appConfig.remoteClassesPath,
            suffix: '.ts'
        })
    }

    private _byAppliedType: { [appliedType in AppliedTypes]: (name: string) => string } = {
        map: (name: string) => '{[key:string]:' + name + '}',
        array: (name: string) => name + '[]',
        single: (name: string) => name
    }

    private _getClassImportString(classDefinition: IRemoteFieldObjectDto) {

        const classesArray = classDefinition?.fields
            .filter((field) => field.type === 'object')
            .map((value) => (<IRemoteFieldObjectDto>value).className)

        const importString = [...new Set(classesArray)]
            .map(className => 'import ' + className + ' from ./' + className)
            .join('\n')

        return importString;
    }


}