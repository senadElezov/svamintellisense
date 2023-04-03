import { groupEnd } from 'console';
import { OverviewRulerLane } from 'vscode';
import { Config } from '../app-state/config';
import { FSManager } from '../fs-manager';
import { GroupMethod, IRemoteEndPoint } from './i-remote-end-point';
import { IRemoteFieldPrimitiveDto } from './i-remote-field.dto';
import { IRemoteFieldObjectDto } from './i-remote-object.dto';


export type RemoteOperationVariables = 'filter' | 'sort' | 'columns' | 'group'

export interface IGroupEndpoint {

    body?: IRemoteFieldObjectDto,

    params?: IRemoteFieldPrimitiveDto[],

    response?: IRemoteFieldPrimitiveDto | IRemoteFieldObjectDto

}


type GroupMethodEndpoints = { [groupFunction in GroupMethod]?: IGroupEndpoint }


export interface IGroupDefinition {

    keyField?: string | string[]
    referencedBy: Set<string>
    references: Set<string>

    implementedMethods: GroupMethodEndpoints
}

type GroupRepo = { [groupName: string]: IGroupDefinition };

export class RemoteEndpointsRepo {

    private _groupRepo!: GroupRepo

    get remoteEndpoints() {
        return this._remoteEndpoints;
    }
    set remoteEndpoints(value) {
        this._remoteEndpoints = value;
        this._initGroupRepo(value)
    }

    constructor(
        private _remoteEndpoints: IRemoteEndPoint[],
        private _appConfig: Config
    ) {

    }


    _initGroupRepo(remoteEndpoints: IRemoteEndPoint[]) {

        if (!remoteEndpoints) {
            this._groupRepo = {};
            return;
        }

        this._groupRepo = {}

        const groupRepo = remoteEndpoints
            .filter(({ remoteGroup, groupMethod }) => remoteGroup && groupMethod)
            .reduce<GroupRepo>((groupRepo, endpoint) => {

                const group = endpoint.remoteGroup as string;

                if (!groupRepo[group]) {
                    groupRepo[group] = {
                        referencedBy: new Set<string>(),
                        references: new Set<string>(),
                        implementedMethods: {}
                    };
                }

                const groupMethod = endpoint.groupMethod as GroupMethod;

                groupRepo[group].implementedMethods[groupMethod] = {
                    body: endpoint.body,
                    params: endpoint.params,
                    response: endpoint.response
                };

                const { response } = endpoint;
                if (response && response.type === 'object') {

                    const { fields } = response;

                    fields
                        .filter((field) => field.type === 'primitive')
                        .forEach((field) => {
                            const primitiveField = <IRemoteFieldPrimitiveDto>field;

                            if (primitiveField.key) {
                                const currentKey = groupRepo[group].keyField;

                                if (!currentKey) {
                                    groupRepo[group].keyField = primitiveField.dataField
                                }
                                else if (currentKey !== primitiveField.dataField) {
                                    groupRepo[group].keyField = typeof currentKey === 'string' ? [primitiveField.dataField, currentKey] : [...currentKey, primitiveField.dataField]
                                }

                            }

                            if (primitiveField.references) {
                                primitiveField.references.forEach(({ groupName }) => groupRepo[group].references.add(groupName));
                            }
                        })

                }

                return groupRepo;
            },
                {}
            )


        Object.entries(groupRepo)
            .forEach(([groupName, groupDefinition]) => {

                const { references } = groupDefinition;

                references.forEach((reference) => {
                    if (!groupRepo[reference]) {
                        return;
                    }

                    groupRepo[reference].referencedBy.add(groupName);
                })

            })

    }


    private readonly _baseTypes: { [method in GroupMethod]: string } = {
        byKey:'ByKeyBase<@KeyType>'
    }

    private readonly _baseMethodTemplates: { [method in GroupMethod]: string } = {
        byKey: 'export type ByKeyBase<KeyType> = (key:KeyType)=> TReturn',
        create: 'export type InsertBase<TBody,TReturn> = (insertJSON:TBody) => TReturn',
        editorSource: `export type EditorSourceBase<TReturn,KeyType> = (params: {
    byKey?:boolean,
    value?:KeyType,
    search?:string, 
    filter?:@FilterType[], 
    sort?:@SortType[], 
    additionalFields?:string[],
    skip?:number,
    take?:number
})=> TReturn`,
        extendedGet:
            `export type extendedGetBase<TReturn,AdditionalParams> = (params: { 
    filter?:@FilterType[], 
    sort?:@SortType[], 
    fields?:string[],
    skip?:number,
    take?:number
})=> TReturn`,
        remove: 'export type RemoveBase<KeyType>  = (key:KeyType)=> any',
        update: 'export type UpdateBase<KeyType,TBody> = (key:KeyType,updateJSON:TBody)=> any',
        createBatch: 'export type InsertBatchBase<TBody,TReturn> = (insertJSON:TBody[]) => TReturn',
        updateBatch: 'export type UpdateBatchBase<KeyType,TBody> = (keyUpdatePairs:{key:KeyType,updateJSON:TBody}[])=> any',
        removeBatch: 'export type RemoveBatchBase<KeyType>  = (key:KeyType)=> any',

    }

    public loadGroupRepoToTypeFiles() {

        this._createBaseMethods();

        Object.entries(this._groupRepo)
            .forEach(([groupName, { implementedMethods }]) => {


            })

    }

    private _createBaseMethods() {

        Object.entries(this._baseMethodTemplates)
            .forEach(([methodName, mathodDefinition]) => {

                const methodFileName = StringUtils.convertToKebabCase(methodName)
                FSManager.createFile({
                    content: mathodDefinition,
                    name: methodFileName + '-base',
                    path: this._appConfig.remoteGroupsPath,
                    suffix: '.ts'
                })
            })
    }


}