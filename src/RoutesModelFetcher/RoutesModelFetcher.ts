import executeQuery from "../Utils/executeQuery";
import myStringify from "../Utils/myStringify";
import WorkspaceManager from "../WorkspaceManager";


export interface IRouteModel {

    baseUrl: string

    params?: {
        type: string,
        name: string,
        optional?: boolean,
        priority: number
    }[];

}

export class RoutesModelFetcher {

    private _routesModel: IRouteModel[]

    private _workspaceManager: WorkspaceManager

    constructor() {
        this._routesModel = [];
        this._workspaceManager = new WorkspaceManager();
    }

    async fetchRoutes() {

        const result: { url: string }[] = await executeQuery(`
        SELECT  Url 
        FROM    core.WebMenu
        WHERE   Url IS NOT NULL AND Url<>'prefix'
        `);

        result.forEach(({ url }) => {

            const doubleDotFirstIndex = url.indexOf(':');

            if (doubleDotFirstIndex === -1) {

                this._routesModel.push({
                    baseUrl: url
                })

                return;
            }

            const baseUrl = url.substring(0, doubleDotFirstIndex - 1);
            const paramsSubString = url.substring(doubleDotFirstIndex);

            const params = paramsSubString.split('/:');


            this._routesModel.push({
                baseUrl: baseUrl,
                params: params.map((paramName, index) => {
                    return {
                        name: paramName.replace(':', ''),
                        priority: index,
                        type: 'string',
                        optional: false
                    }
                })
            })
        })

        this._routesModel.push({
            baseUrl: '/doc',
            params: [
                {
                    type: `'gk' | 'rmk' | 'os' | 'si'`,
                    name: 'type',
                    priority: 0,
                    optional: false
                },
                {
                    type: 'string',
                    name: 'sif',
                    priority: 1,
                    optional: false
                },
                {
                    type: 'number',
                    name: 'id',
                    priority: 2,
                    optional: true
                },
            ]
        })

        this._routesModel.push({
            baseUrl: '/sifrarnici',
            params: [
                {
                    name: 'sifrarnikTable',
                    priority: 0,
                    type: 'SifrarnikTable',
                    optional: false
                }
            ]
        })

        this._routesModel.push(
            {
                baseUrl: '/sifrarnik',
                params: [{
                    name: 'sifrarnikTable',
                    priority: 0,
                    type: 'string',
                    optional: false
                }]
            }
        )

        await this.saveRoutesModel();
    }

    async saveRoutesModel() {
        const rootFolder = this._workspaceManager.getRootFolder();
        const SIFRARNICI_FOLDER_PATH = '/app/repository/Routes/'

        const rootPath = rootFolder.path;
        // const IMPORT_HEADER = 'import { WeakType } from "./Types/WeakType";';
        const fullPath = rootPath + SIFRARNICI_FOLDER_PATH;

        const sifrarnikTableImport = 'import { SifrarnikTable } from "modules/Sifrarnici/Types/SifrarnikTable";'

        const alreadyPassedUrls: string[] = [];

        const routesModelBody = this._routesModel
            .sort((first, second) => (second.params?.length || 0) - (first.params?.length || 0))
            .reduce<IRouteModel[]>((total, routeDefinition) => {
                if (total.find(route => route.baseUrl === routeDefinition.baseUrl)) {
                    routeDefinition.params?.forEach((param) => param.optional = true);
                    return [...total];
                }

                return [...total, routeDefinition];
            }
                , [])
            .map((routeDefinition) => {

                const { baseUrl, params } = routeDefinition;

                const paramString = params?.length ? '{\n' +
                    params
                        .sort((first, second) => first.priority - second.priority)
                        .map((param) => '\t\t\t' + param.name + (param.optional ? '?' : '') + ':' + param.type)
                        .join(',\n') + '\n\t\t}'
                    : 'never'

                const returningString = [
                    `\t"${baseUrl}":{`,
                    `\t\tparams?:${paramString}`,
                    '\t}'
                ].join('\n')


                return returningString;
            })
            .join(',\n')


        const routesModelString = 'export type RoutesModel = {\n' + routesModelBody + '\n}'

        const paramsOrder = this._routesModel
            .filter(routeModel => routeModel?.params?.length)
            .reduce((total,routeModel) => {
                return {
                    ...total,
                    [routeModel.baseUrl]: routeModel.params?.sort((first, second) => first.priority - second.priority).map(param => param.name)
                }
            },
                {}            
            )


        const routesImport ='import { RoutesModel } from "./RoutesModel";\n\n';

        await this._workspaceManager.addFile(fullPath + 'RoutesModel.ts', sifrarnikTableImport + '\n\n' + routesModelString);
        await this._workspaceManager.addFile(fullPath +routesImport +  'routesParamsOrder.ts', 'export const routesParamsOrder: { [route in keyof RoutesModel]?: string[] }  = ' + JSON.stringify(paramsOrder, null, '\t'));
    }
}