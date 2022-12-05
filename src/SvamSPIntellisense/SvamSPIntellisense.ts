import WorkspaceManager, { SISettings } from '../WorkspaceManager';
import { Param } from './Param';
import * as vscode from 'vscode';
import myStringify from '../Utils/myStringify';
import executeQuery from '../Utils/executeQuery';
import { convertDBtoTypeScriptType } from '../Utils/convertDBtoTypeScriptType';
import functionMetaToInterface from '../Utils/functionMetaToInterface';


const fetch = require("node-fetch");
interface catalog {
    name: string,
    description: string
}


export type FunctionColumnDefFetch = {
    funcname: string,
    colname: string,
    coltype: string,
}


export type FunctionParamDefFetch = {
    funcname: string,
    paramname: string,
    paramid: string,
    paramtype: string,
    isoutput?: boolean
}

type returningProcData = {
    procname: string,
    paramname: string,
    typename: string,
    isoutput: boolean,
    schemaname: string,
    definition: string
}

export type ColumnDefinition = {
    dataField?: string,
    caption?: string,
    dataType?: dataTypes
} &
{
    [key: string]: any
}

export type dataTypes = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'object'

export type typeScriptDataType = 'string' | 'number' | 'boolean' | 'Date' | 'any'

type paramTypes = dataTypes | 'IdbFilter[]' | 'IdbSort[]' | 'IReferenceFilter[]'

type functionModel = {
    returningModel: { [columnName: string]: dataTypes },
    paramModel: { [paramName: string]: paramTypes }
}

export const FILE_NEW_LINE_IDENTIFIER = '!?!';
export const FILE_TAB_IDENTIFIER = '?!?';
export const FUNCTION_DEF_IDENTIFIER = 'FUNC_DEF_IDENTIFER'

export type StringDict<T> = { [key: string]: T };

export type SPSignature = { params: Param[], schema: string[], returnType: { [dataField: string]: dataTypes } }

export type ScalarSignature = {
    paramsModel: { [paramName: string]: typeScriptDataType },
    returnType?: typeScriptDataType
}

export type FNSignature = {
    paramsModel: { [paramName: string]: typeScriptDataType },
    returningModel: { [dataField: string]: typeScriptDataType }
    columns: ColumnDefinition[]
}


export class SvamSPIntellisense {
    public _procedureParamsDictionary: StringDict<SPSignature> = {};
    public _myCompletionItemProvider: vscode.Disposable = vscode.Disposable.from({ dispose: () => { } });
    private _functionDictionary: StringDict<FNSignature>

    private _scalarFunctionDictionary: StringDict<ScalarSignature>
    private _settings: SISettings | null = null;

    public _catalogs: catalog[];
    private _workspaceManager: WorkspaceManager;

    constructor(
        private _spMetaData?: any[],
        private _scalarMetadata?: any[],
        private _fnParamsMetadata?: any[],
        private _fnColumnsMetadata?: any[]
    ) {
        this._procedureParamsDictionary = {};
        this._functionDictionary = {};
        this._scalarFunctionDictionary = {};
        this._catalogs = [];
        this._workspaceManager = new WorkspaceManager();
    }

    async getAllStoredProceduresAndParams(withIntellisense: boolean = true) {
        this._settings = await WorkspaceManager.getSettings();
        this._procedureParamsDictionary = {};
        this._catalogs = [];

        this._myCompletionItemProvider.dispose();
        let settings = this._settings;
        const queryPrepared = [
            {
                query: `SELECT  pr.name as procname,
                                par.name as paramname,
                                t.name as typename,
                                par.is_output as isoutput,
                                schem.name as schemaname,
                                mod.definition as definition
                        FROM    sys.procedures as pr
                                inner join sys.schemas as schem on schem.schema_id = pr.schema_id
                                inner join sys.sql_modules as mod on pr.object_id = mod.object_id
                                left join sys.parameters as par on par.object_id=pr.object_id 
                                left join sys.types as t on par.user_type_id = t.user_type_id`,
                commandtype: 'text'
            }
        ];

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic dGVzdDoxMjM=' },
            body: JSON.stringify({
                db: settings?.database,
                queries: queryPrepared,
            })
        };

        const response = await fetch(settings?.api, requestOptions);
        const procedures = await response.json();

        let self = this;

        procedures.map((procData: returningProcData) => {

            if (!self._procedureParamsDictionary[procData.procname]) {
                self._procedureParamsDictionary[procData.procname] = { schema: [], params: [], returnType: {} };
            }

            const isSchemaAdded = self._procedureParamsDictionary[procData.procname].schema.includes(procData.schemaname);
            if (!isSchemaAdded) {
                self._procedureParamsDictionary[procData.procname].schema.push(procData.schemaname)
            }

            if (procData.paramname) {


                const paramName = procData.paramname.replace("@", "");
                const isParamAlreadyAdded = Boolean(self._procedureParamsDictionary[procData.procname].params.find(param => param._name === paramName));

                if (!isParamAlreadyAdded) {
                    self._procedureParamsDictionary[procData.procname].params.push(new Param(paramName, procData.typename, procData.isoutput));
                }
            }

            if (procData.definition) {
                const definition = procData.definition;

                const getReturnTypeFromDefinition = (spDefinition: string): { [dataField: string]: dataTypes } => {
                    const spDefinitionWithoutSpace = spDefinition.replace(/ /g, '');

                    const RETURN_TYPE_STARTER = 'returns(';

                    const DATA_FIELD_TYPE_SPLITTER = ':';

                    const RETURN_TYPE_ENDER = ')';


                    const spDefintionStartIndex = spDefinitionWithoutSpace.indexOf(RETURN_TYPE_STARTER)
                    const spDefinitionEndIndex = spDefinitionWithoutSpace.indexOf(RETURN_TYPE_ENDER);

                    if (spDefintionStartIndex < 0 || spDefinitionEndIndex < 0) {

                        return {};
                    };

                    const definitionStartIndex = spDefintionStartIndex + RETURN_TYPE_STARTER.length;
                    // const definitionLength = 1 + spDefinitionEndIndex - definitionStartIndex;
                    const definitionString = spDefinitionWithoutSpace.substring(definitionStartIndex, spDefinitionEndIndex - 1);

                    const cleanDefintionString = definitionString.replace(/--/g, '');

                    const definitionArray = cleanDefintionString.split('\r\n').filter(defPart => defPart.indexOf(DATA_FIELD_TYPE_SPLITTER) > 0);

                    const columnDefinitions: { dataField: string, dataType: string }[] = definitionArray.map(definitionRow => {

                        const [dataField, dataType] = definitionRow.split(DATA_FIELD_TYPE_SPLITTER);

                        return {
                            dataField: dataField as string,
                            dataType: dataType as dataTypes
                        }
                    })

                    const returningType: { [dataField: string]: dataTypes } = {}
                    columnDefinitions.forEach(colDef => {

                        returningType[colDef.dataField] = colDef.dataType as dataTypes;

                    })

                    return returningType;
                }


                self._procedureParamsDictionary[procData.procname].returnType = getReturnTypeFromDefinition(procData.definition);

            }

        });

        if (withIntellisense) {
            await this.getCatalogs(settings);

            this.registerCompletionItemProvider();
        }
    }

    public async metadataToDicts() {

        this._settings = await WorkspaceManager.getSettings();

        const self = this;

        this._spMetaData?.forEach((procData: returningProcData) => {

            if (!self._procedureParamsDictionary[procData.procname]) {
                self._procedureParamsDictionary[procData.procname] = { schema: [], params: [], returnType: {} };
            }

            const isSchemaAdded = self._procedureParamsDictionary[procData.procname].schema.includes(procData.schemaname);
            if (!isSchemaAdded) {
                self._procedureParamsDictionary[procData.procname].schema.push(procData.schemaname)
            }

            if (procData.paramname) {


                const paramName = procData.paramname.replace("@", "");
                const isParamAlreadyAdded = Boolean(self._procedureParamsDictionary[procData.procname].params.find(param => param._name === paramName));

                if (!isParamAlreadyAdded) {
                    self._procedureParamsDictionary[procData.procname].params.push(new Param(paramName, procData.typename, procData.isoutput));
                }
            }

            if (procData.definition) {
                const definition = procData.definition;

                const getReturnTypeFromDefinition = (spDefinition: string): { [dataField: string]: dataTypes } => {
                    const spDefinitionWithoutSpace = spDefinition.replace(/ /g, '');

                    const RETURN_TYPE_STARTER = 'returns(';

                    const DATA_FIELD_TYPE_SPLITTER = ':';

                    const RETURN_TYPE_ENDER = ')';


                    const spDefintionStartIndex = spDefinitionWithoutSpace.indexOf(RETURN_TYPE_STARTER)
                    const spDefinitionEndIndex = spDefinitionWithoutSpace.indexOf(RETURN_TYPE_ENDER);

                    if (spDefintionStartIndex < 0 || spDefinitionEndIndex < 0) {

                        return {};
                    };

                    const definitionStartIndex = spDefintionStartIndex + RETURN_TYPE_STARTER.length;
                    // const definitionLength = 1 + spDefinitionEndIndex - definitionStartIndex;
                    const definitionString = spDefinitionWithoutSpace.substring(definitionStartIndex, spDefinitionEndIndex - 1);

                    const cleanDefintionString = definitionString.replace(/--/g, '');

                    const definitionArray = cleanDefintionString.split('\r\n').filter(defPart => defPart.indexOf(DATA_FIELD_TYPE_SPLITTER) > 0);

                    const columnDefinitions: { dataField: string, dataType: string }[] = definitionArray.map(definitionRow => {

                        const [dataField, dataType] = definitionRow.split(DATA_FIELD_TYPE_SPLITTER);

                        return {
                            dataField: dataField as string,
                            dataType: dataType as dataTypes
                        }
                    })

                    const returningType: { [dataField: string]: dataTypes } = {}
                    columnDefinitions.forEach(colDef => {

                        returningType[colDef.dataField] = colDef.dataType as dataTypes;

                    })

                    return returningType;
                }


                self._procedureParamsDictionary[procData.procname].returnType = getReturnTypeFromDefinition(procData.definition);

            }

        });


        this._scalarMetadata?.forEach(scalarFunctionDefRow => {

            const {
                funcname,
                paramname,
                paramtype,
                isoutput
            } = scalarFunctionDefRow

            if (!this._scalarFunctionDictionary[funcname]) {
                this._scalarFunctionDictionary[funcname] = {
                    paramsModel: {}
                }
            }

            if (isoutput) {
                this._scalarFunctionDictionary[funcname].returnType = convertDBtoTypeScriptType[paramtype];
                return;
            }

            this._scalarFunctionDictionary[funcname].paramsModel[paramname.replace('@', '')] = convertDBtoTypeScriptType[paramtype]

        })

        const functionDict: {
            [functionName: string]: {
                fetchedColumns: FunctionColumnDefFetch[],
                fetchedParams: FunctionParamDefFetch[]
            }
        } = {

        };

        this._fnColumnsMetadata?.forEach(columnDef => {

            const {
                colname,
                coltype,
                funcname
            } = columnDef;

            if (!functionDict[funcname]) {
                functionDict[funcname] = {
                    fetchedParams: [],
                    fetchedColumns: []
                }
            }

            functionDict[funcname].fetchedColumns.push(columnDef)
        });

        this._fnParamsMetadata?.forEach(paramDef => {

            const {
                funcname
            } = paramDef;

            if (!functionDict[funcname]) {
                functionDict[funcname] = {
                    fetchedParams: [],
                    fetchedColumns: []
                }
            }

            functionDict[funcname].fetchedParams.push(paramDef)
        });

        Object.entries(functionDict).forEach(([functionName, functionFetch]) => {

            this._functionDictionary[functionName] = functionMetaToInterface(functionFetch);

        })
    }


    private registerCompletionItemProvider() {
        let sel: vscode.DocumentSelector = { scheme: 'file', language: 'javascript' };

        let procedureParamsDictionary = this._procedureParamsDictionary;
        let self = this;
        let catalogs = this._catalogs;
        this._myCompletionItemProvider = vscode.languages.registerCompletionItemProvider(sel, {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                let completionItemList: vscode.CompletionItem[] = [];
                for (let procedure in procedureParamsDictionary) {
                    let completionItem = new vscode.CompletionItem(procedure);

                    const generateInsertString = (): string => {
                        let paramsArray: string[] = procedureParamsDictionary[procedure].params.map((param, index, array) => {
                            let conditionalComma = ",";
                            if (index === array.length - 1) {
                                conditionalComma = "";
                            }
                            return "\t\t " + param._name + ": null" + conditionalComma + " //" + param._type;
                        });

                        let returningString: string = "";
                        returningString = returningString + "{ \r\n";
                        returningString = returningString + "\tquery:'" + procedure + "',\r\n";
                        returningString = returningString + "\tparams: { \r\n";
                        returningString = returningString + paramsArray.join("\r\n");
                        returningString = returningString + "\r\n\t\t}, \r\n";
                        returningString = returningString + "\tcommandtype: 'sp' \r\n";
                        returningString = returningString + "} \r\n";
                        return returningString;
                    };


                    completionItem.kind = vscode.CompletionItemKind.Constructor;
                    completionItem.insertText = generateInsertString();
                    completionItem.sortText = String.fromCharCode(0);
                    completionItem.documentation = "(stored procedure) " + self._settings?.database + "/" + self._settings?.database;
                    completionItemList.push(completionItem);
                }

                catalogs.map((catalog) => {
                    let completionItem = new vscode.CompletionItem('ctlg' + catalog.name);
                    completionItem.sortText = String.fromCharCode(0);
                    completionItem.documentation = catalog.description;
                    completionItem.insertText = catalog.name;
                    completionItemList.push(completionItem);
                });


                return completionItemList;
            }
        });

    }

    async getCatalogs(settings: any) {

        const queries = [
            {
                query: `exec sp_helptext spWeb_Catalogs`,
                commandtype: 'text'
            }
        ];

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic dGVzdDoxMjM=' },
            body: JSON.stringify({
                db: settings.database,
                queries: queries,
            })
        };

        let response = await fetch(settings.api, requestOptions);
        let catalogsProcedureLines = await response.json();

        this.getCatalogNamesAndDescriptionsFromLines(catalogsProcedureLines.map((textElement: any) => textElement.text));
    }

    getCatalogNamesAndDescriptionsFromLines(catalogsProcedureLines: string[]) {
        let catalogNamesAndDescriptions: any[] = [];

        for (let lineIndex = 0; lineIndex < catalogsProcedureLines.length; lineIndex++) {
            let currentLine = catalogsProcedureLines[lineIndex];

            let catalogNameIndex: number = currentLine.indexOf('@catalogName');

            if (catalogNameIndex >= 0 && currentLine.indexOf('=') >= 0) {
                let catalogName = currentLine.split('=')[1].trim().split(' ')[0];

                let catalogDescription = currentLine.substring(currentLine.indexOf('--') + 2);

                let currentCatalog: catalog = { name: catalogName, description: catalogDescription };
                catalogNamesAndDescriptions.push(currentCatalog);
            }
        }

        this._catalogs = catalogNamesAndDescriptions;
    }

    public async generateStoredProceduresModel() {
        await this.getAllStoredProceduresAndParams(false);

        const convertDBDataType: { [key: string]: 'string' | 'number' | 'boolean' | 'Date' } = {
            bigint: 'number',
            binary: 'string',
            bit: 'boolean',
            char: 'string',
            date: 'Date',
            datetime: 'Date',
            datetime2: 'Date',
            decimal: 'number',
            float: 'number',
            hierarchyid: 'number',
            image: 'string',
            int: 'number',
            money: 'number',
            nchar: 'string',
            ntext: 'string',
            numeric: 'number',
            nvarchar: 'string',
            real: 'number',
            smalldatetime: 'Date',
            smallint: 'number',
            smallmoney: 'number',
            text: 'string',
            time: 'Date',
            timestamp: 'Date',
            tinyint: 'number',
            uniqueidentifier: 'number',
            varbinary: 'string',
            varchar: 'string',
            xml: 'string',
        };

        let importSPModel = 'import { ISvamColumnOptions } from "@svam/components/SvamGridTS/SubComponents/SvamColumn/Interfaces/ISvamColumnOptions";\n';
        importSPModel += 'import { StoredProceduresModel } from "./StoredProceduresModel";\n\n';

        let exportSPColumns = '\n\nexport {storedProcedureColumns }';

        let importDBTypes = 'import { IdbFilter, IdbSort } from "@svam/components/SvamGridTS/Interfaces/SvamCustomStore/SvamPropsTransform/svamCustomStorePropsTransform";\n';
        importDBTypes += 'import { IReferenceFilter } from "core/utils/DataSources/storedProcedure"\n';

        const rootFolder = this._workspaceManager.getRootFolder().path;
        const MODEL_REPOSITORY_PATH = '/app/repository/';
        const storedProceduresFolder = rootFolder + MODEL_REPOSITORY_PATH + 'storedProcedures/';
        let importString = '';

        const storedProcedureColumnsType = ':{[StoredProcedure in keyof StoredProceduresModel]?:ISvamColumnOptions[]}';

        let storedProceduresString = ''

        const spColumnDefs: { [procName: string]: ColumnDefinition[] } = {};

        for (const [storedProcedureName, procDefinition] of Object.entries(this._procedureParamsDictionary)) {
            const tab = '\t';
            const newLine = '\n'

            const outputParams = [];

            const getFolderName = (storedProcedure: string, definition: { params: Param[], schema: string[] }) => {

                if (definition.schema[0] !== 'dbo') {
                    return definition.schema[0];
                }
                else if (storedProcedure.indexOf('_') > 0) {
                    const [folderName] = storedProcedure.split('_');
                    return folderName;
                }

                return 'generic';
            };

            const folderName = getFolderName(storedProcedureName, procDefinition);

            const {
                params,
                schema,
                returnType
            } = procDefinition

            const paramsString = params.map(paramDef => {

                if (paramDef._isOutput) {
                    outputParams.push(paramDef._name)
                }

                const getParamType = (paramDef: Param) => {

                    const JSON_PARAM_IDENTIFIER = 'JSON'

                    const reservedParamDictionary: any = {
                        filter: 'IdbFilter[]',
                        filters: 'IdbFilter[]',
                        sort: 'IdbSort[]',
                        referencedInArray: 'IReferenceFilter[]'
                    }

                    const reservedParamType = reservedParamDictionary[paramDef._name];

                    if (reservedParamType) {
                        return reservedParamType;
                    }

                    if (paramDef._name.indexOf(JSON_PARAM_IDENTIFIER) >= 0) {
                        return 'object'
                    }

                    const defaultParamType = convertDBDataType[paramDef._type]

                    return defaultParamType;
                }


                const paramType = getParamType(paramDef);

                return tab + tab + tab + paramDef._name + '?: ' + paramType;
            }).join(';' + newLine);

            const getReturningModelString = (returnType: { [dataField: string]: string }): string => {

                let returningString = '{' + newLine
                for (const [dataField, dataType] of Object.entries(returnType)) {
                    returningString += tab + tab + tab + dataField + '?:' + (['date', 'datetime'].includes(dataType) ? 'Date' : dataType) + newLine;
                }

                returningString += tab + tab + '}';

                return returningString;

            }

            const addToColumnDefs = (storedProcedureName: string, returnType: { [dataField: string]: dataTypes }) => {

                spColumnDefs[storedProcedureName] = Object.keys(returnType).map(dataField => {
                    const dataType = returnType[dataField];

                    return {
                        caption: dataField,
                        dataField: dataField,
                        dataType: dataType
                    }

                })

            };

            if (Object.values(returnType).length > 0) {
                addToColumnDefs(storedProcedureName, returnType);
            }

            const returningModelString = getReturningModelString(returnType)

            const outputParamsArray = params.filter(param => param._isOutput === true).map(param => "'" + param._name + "'");

            let typeString = '\t' + storedProcedureName + ': {'

            typeString += newLine + tab + tab + 'schema?:' + schema.map(schem => "'" + schem + "'").join('|');
            typeString += newLine + tab + tab + 'params?: ' + (params.length ? '{' + newLine + paramsString + newLine + tab + tab + '}' : 'never');
            typeString += (outputParamsArray.length !== 0 ? newLine + tab + tab + 'outputParams?:(' + outputParamsArray.join('|') + ')[]' : '')
            typeString += newLine + tab + tab + 'returningModel?:' + ((Object.values(returnType).length > 0) ? returningModelString : 'any');
            typeString += newLine + tab + '};'

            storedProceduresString += '\n' + typeString + '\n';

        }


        try {


            const storedProceduresColumnsFile = await this._workspaceManager.readFile(vscode.Uri.file(storedProceduresFolder + 'StoredProcedureColumns.ts'));

            if (storedProceduresColumnsFile) {

                const firstDoubleDotIndex = storedProceduresColumnsFile.indexOf(':');
                const firstEqualsIndex = storedProceduresColumnsFile.indexOf('=');

                const foundImportString = storedProceduresColumnsFile.split('\n').filter(storedProcedureLine => storedProcedureLine.trimStart().startsWith('import')).join('\n');

                const typeString = storedProceduresColumnsFile.substring(firstDoubleDotIndex, firstEqualsIndex);

                const exportIdentifier = 'export'

                const exportIndex = storedProceduresColumnsFile.indexOf(exportIdentifier);
                const afterExport = storedProceduresColumnsFile.substring(exportIndex);

                let cleanFile = storedProceduresColumnsFile.replace(foundImportString, '');;
                cleanFile = cleanFile.replace(afterExport, '');
                cleanFile = cleanFile.replace(typeString, '');

                cleanFile = cleanFile.replace('\r', '');

                const storedProceduresFileJson: { [storedProcedureName: string]: ColumnDefinition[] } = eval(cleanFile + ';storedProcedureColumns;');

                for (const [storedProcedureName, colDefs] of Object.entries(storedProceduresFileJson)) {

                    const dbColumnDefinition = spColumnDefs[storedProcedureName];

                    colDefs.forEach(colDef => {
                        const dbColDef = dbColumnDefinition.find(currentDbColDef => currentDbColDef.dataField === colDef.dataField);

                        if (dbColDef) {
                            for (const [key, value] of Object.entries(colDef)) {

                                if (!['dataField', 'dataType'].includes(key)) {

                                    if (typeof value === 'function') {
                                        dbColDef[key] = FUNCTION_DEF_IDENTIFIER + value.toString();
                                        continue;
                                    }
                                    dbColDef[key] = value;
                                }

                            }

                        }

                    });
                }
            }
        }
        catch (error) {
            throw error;
            return;
        }

        const storedProcedureModelType = 'export type StoredProceduresModel = {' + storedProceduresString + '\n' + '}';


        const stringifiedColumns = myStringify(spColumnDefs)
        await this._workspaceManager.createFile(storedProceduresFolder + 'StoredProcedureColumns.ts', importSPModel + 'const storedProcedureColumns ' + storedProcedureColumnsType + ' = ' + stringifiedColumns + exportSPColumns)
        await this._workspaceManager.createFile(storedProceduresFolder + 'StoredProceduresModel.ts', importDBTypes + '\n\n' + storedProcedureModelType);



        await this.generateTableFunctionsModel();
        await this.generateScalarFunctionsModel();
        await this.saveFunctionDefinitionsToFile();
        await this.saveScalarFunctionDefinitionsToFile();
    }

    public async saveStoredProceduresModelToFile() {

        const convertDBDataType: { [key: string]: 'string' | 'number' | 'boolean' | 'Date' } = {
            bigint: 'number',
            binary: 'string',
            bit: 'boolean',
            char: 'string',
            date: 'Date',
            datetime: 'Date',
            datetime2: 'Date',
            decimal: 'number',
            float: 'number',
            hierarchyid: 'number',
            image: 'string',
            int: 'number',
            money: 'number',
            nchar: 'string',
            ntext: 'string',
            numeric: 'number',
            nvarchar: 'string',
            real: 'number',
            smalldatetime: 'Date',
            smallint: 'number',
            smallmoney: 'number',
            text: 'string',
            time: 'Date',
            timestamp: 'Date',
            tinyint: 'number',
            uniqueidentifier: 'number',
            varbinary: 'string',
            varchar: 'string',
            xml: 'string',
        };

        const rootFolder = this._workspaceManager.getRootFolder().path;
        const MODEL_REPOSITORY_PATH = this._settings?.modelPath || '/app/repository/';

        let storedProceduresString = ''

        for (const [storedProcedureName, procDefinition] of Object.entries(this._procedureParamsDictionary)) {
            const tab = '\t';
            const newLine = '\n'

            const outputParams = [];

            const {
                params,
                schema,
                returnType
            } = procDefinition

            const paramsString = params.map(paramDef => {

                if (paramDef._isOutput) {
                    outputParams.push(paramDef._name)
                }

                const getParamType = (paramDef: Param) => {

                    const JSON_PARAM_IDENTIFIER = 'JSON'

                    const reservedParamDictionary: any = {
                        filter: 'IDBFilter[]',
                        filters: 'IDBFilter[]',
                        sort: 'IDBSort[]',
                        referencedInArray: 'IReferenceFilter[]'
                    }

                    const reservedParamType = reservedParamDictionary[paramDef._name];

                    if (reservedParamType) {
                        return reservedParamType;
                    }

                    if (paramDef._name.indexOf(JSON_PARAM_IDENTIFIER) >= 0) {
                        return 'object'
                    }

                    const defaultParamType = convertDBDataType[paramDef._type]

                    return defaultParamType;
                }


                const paramType = getParamType(paramDef);

                return tab + tab + tab + paramDef._name + '?: ' + paramType;
            }).join(';' + newLine);

            const getReturningModelString = (returnType: { [dataField: string]: string }): string => {

                let returningString = '{' + newLine
                for (const [dataField, dataType] of Object.entries(returnType)) {
                    returningString += tab + tab + tab + dataField + '?:' + (['date', 'datetime'].includes(dataType) ? 'Date' : dataType) + newLine;
                }

                returningString += tab + tab + '}';

                return returningString;

            }

            const returningModelString = getReturningModelString(returnType)

            const outputParamsArray = params.filter(param => param._isOutput === true).map(param => "'" + param._name + "'");

            let typeString = '\t' + storedProcedureName + ': {'

            typeString += newLine + tab + tab + 'schema?:' + schema.map(schem => "'" + schem + "'").join('|');
            typeString += newLine + tab + tab + 'params?: ' + (params.length ? '{' + newLine + paramsString + newLine + tab + tab + '}' : 'never');
            typeString += (outputParamsArray.length !== 0 ? newLine + tab + tab + 'outputParams?:(' + outputParamsArray.join('|') + ')[]' : '')
            typeString += newLine + tab + tab + 'returningModel?:' + ((Object.values(returnType).length > 0) ? returningModelString : 'any');
            typeString += newLine + tab + '};'

            storedProceduresString += '\n' + typeString + '\n';
            const storedProcedureModelType = 'export type StoredProceduresModel = {' + storedProceduresString + '\n' + '}';

            await this._workspaceManager.createFile(rootFolder + MODEL_REPOSITORY_PATH + 'StoredProceduresModel.ts', storedProcedureModelType);

        }
    }

    public async generateTableFunctionsModel() {
        const TABLE_INLINE_FUNCTION_IDENTIFIER = '\'IF\'';
        const TABLE_FUNCTION_IDENTIFIER = '\'TF\'';

        const functionParamDefinitionsQuery = `
        SELECT	funcDefs.name as funcName,
                params.name as paramName,
                params.parameter_id as paramId,
                paramTypes.name as paramType
        FROM	sys.objects as funcDefs	
                INNER JOIN sys.parameters as params ON params.object_id = funcDefs.object_id
                LEFT JOIN sys.types as paramTypes On params.user_type_id = paramTypes.user_type_id
        WHERE	funcDefs.type IN (${TABLE_FUNCTION_IDENTIFIER},${TABLE_INLINE_FUNCTION_IDENTIFIER})`;


        const functionColumnsDefintionQuery = `
        SELECT  funcDefs.name as funcname,
                colDefs.name as colname,
                colTypes.name as coltype
        FROM	sys.objects as funcDefs
                INNER JOIN sys.columns as colDefs ON colDefs.object_id = funcDefs.object_id
                INNER JOIN sys.types as colTypes On colDefs.user_type_id = colTypes.user_type_id
        WHERE	funcDefs.type IN (${TABLE_FUNCTION_IDENTIFIER},${TABLE_INLINE_FUNCTION_IDENTIFIER})`



        const functionColumnsFetch: FunctionColumnDefFetch[] = await executeQuery(functionColumnsDefintionQuery);
        const functionParamsFetch: FunctionParamDefFetch[] = await executeQuery(functionParamDefinitionsQuery);

        const functionDict: {
            [functionName: string]: {
                fetchedColumns: FunctionColumnDefFetch[],
                fetchedParams: FunctionParamDefFetch[]
            }
        } = {

        };

        functionColumnsFetch.forEach(columnDef => {

            const {
                colname,
                coltype,
                funcname
            } = columnDef;

            if (!functionDict[funcname]) {
                functionDict[funcname] = {
                    fetchedParams: [],
                    fetchedColumns: []
                }
            }

            functionDict[funcname].fetchedColumns.push(columnDef)
        });

        functionParamsFetch.forEach(paramDef => {

            const {
                funcname
            } = paramDef;

            if (!functionDict[funcname]) {
                functionDict[funcname] = {
                    fetchedParams: [],
                    fetchedColumns: []
                }
            }

            functionDict[funcname].fetchedParams.push(paramDef)
        });

        Object.entries(functionDict).forEach(([functionName, functionFetch]) => {

            this._functionDictionary[functionName] = functionMetaToInterface(functionFetch);

        })
    }

    public async saveFunctionDefinitionsToFile(onlyModel: boolean = false) {

        const rootFolder = this._workspaceManager.getRootFolder().path;
        const MODEL_REPOSITORY_PATH = this._settings?.modelPath || '/app/repository/';
        const tableFunctionsFolder = rootFolder + MODEL_REPOSITORY_PATH + (onlyModel === false ? 'tableFunctions/' : '');

        let importFNModel = 'import { ISvamColumnOptions } from "@svam/components/SvamGridTS/SubComponents/SvamColumn/Interfaces/ISvamColumnOptions";\n';
        importFNModel += 'import { TableFunctionsModel } from "./TableFunctionsModel";\n\n';

        let tableFunctionsModelString = '';


        Object.entries(this._functionDictionary).forEach(([functionName, functionDef]) => {

            const {
                paramsModel,
                returningModel
            } = functionDef;

            tableFunctionsModelString += '\t\n' + functionName + ':{'

            const getModelString = (model: { [dataField: string]: typeScriptDataType }) => {
                let paramsString = '{';

                Object.entries(model).forEach(([paramName, paramType]) => {
                    paramsString += '\t\t\n' + paramName + '?:' + paramType;
                })

                return paramsString + '\n\t}'
            };

            tableFunctionsModelString += '\n\tparams:' + (Object.keys(paramsModel) ? getModelString(paramsModel) : 'never');
            tableFunctionsModelString += '\n\treturningModel:' + getModelString(returningModel);
            tableFunctionsModelString += '\n\t}';
        })


        try {
            const tableFunctionsFile = await this._workspaceManager.readFile(vscode.Uri.file(tableFunctionsFolder + 'TableFunctionsColumns.ts'));

            if (tableFunctionsFile) {

                const firstDoubleDotIndex = tableFunctionsFile.indexOf(':');
                const firstEqualsIndex = tableFunctionsFile.indexOf('=');

                const typeString = tableFunctionsFile.substring(firstDoubleDotIndex, firstEqualsIndex);

                const exportIdentifier = 'export'

                const exportIndex = tableFunctionsFile.indexOf(exportIdentifier);
                const afterExport = tableFunctionsFile.substring(exportIndex);

                let cleanFile = tableFunctionsFile.replace(importFNModel, '');;
                cleanFile = cleanFile.replace(afterExport, '');
                cleanFile = cleanFile.replace(typeString, '');


                const storedProceduresFileJson: { [storedProcedureName: string]: ColumnDefinition[] } = eval(cleanFile + ';tableFunctionsColumns;');

                for (const [tableFunctionName, colDefs] of Object.entries(storedProceduresFileJson)) {

                    const dbColumnDefinition = this._functionDictionary[tableFunctionName].columns;

                    colDefs.forEach(colDef => {
                        const dbColDef = dbColumnDefinition.find(currentDbColDef => currentDbColDef.dataField === colDef.dataField);

                        if (dbColDef) {
                            for (const [key, value] of Object.entries(colDef)) {

                                if (!['dataField', 'dataType'].includes(key)) {

                                    if (typeof value === 'function') {
                                        dbColDef[key] = FUNCTION_DEF_IDENTIFIER + value.toString();
                                        continue;
                                    }

                                    dbColDef[key] = value;
                                }

                            }

                        }

                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            return;
        }

        const tableFunctionsModelType = 'export type TableFunctionsModel = {' + tableFunctionsModelString + '\n' + '}';

        const fnColumnDefs: any = {}

        Object.entries(this._functionDictionary).forEach(([functionName, functionMeta]) => {

            fnColumnDefs[functionName] = functionMeta.columns

        })

        const tableFunctionsColumnsType = ':{[functionName in keyof TableFunctionsModel]:ISvamColumnOptions[]}'
        const exportFnColumns = '\n export { tableFunctionsColumns } ';
        const stringifiedColumns = myStringify(fnColumnDefs)
        if (onlyModel === false) {
            await this._workspaceManager.createFile(tableFunctionsFolder + 'TableFunctionsColumns.ts', importFNModel + 'const tableFunctionsColumns ' + tableFunctionsColumnsType + ' = ' + stringifiedColumns + exportFnColumns)
        }
        
        await this._workspaceManager.createFile(tableFunctionsFolder + 'TableFunctionsModel.ts', '\n\n' + tableFunctionsModelType);
    }


    public async generateScalarFunctionsModel() {
        const SCALAR_FUNCTION_IDENTIFIER = '\'FN\''

        const arr = [1, 2];

        arr.sort()
        const functionParamDefinitionsQuery = `
        SELECT	funcDefs.name as funcName,
                params.name as paramName,
                params.parameter_id as paramId,
                paramTypes.name as paramType,
                params.is_output as isoutput
        FROM	sys.objects as funcDefs	
                INNER JOIN sys.parameters as params ON params.object_id = funcDefs.object_id
                LEFT JOIN sys.types as paramTypes On params.user_type_id = paramTypes.user_type_id
        WHERE	funcDefs.type IN (${SCALAR_FUNCTION_IDENTIFIER})`;


        const scalarFunctionDefs: FunctionParamDefFetch[] = await executeQuery(functionParamDefinitionsQuery);

        scalarFunctionDefs.forEach(scalarFunctionDefRow => {

            const {
                funcname,
                paramname,
                paramtype,
                isoutput
            } = scalarFunctionDefRow

            if (!this._scalarFunctionDictionary[funcname]) {
                this._scalarFunctionDictionary[funcname] = {
                    paramsModel: {}
                }
            }

            if (isoutput) {
                this._scalarFunctionDictionary[funcname].returnType = convertDBtoTypeScriptType[paramtype];
                return;
            }

            this._scalarFunctionDictionary[funcname].paramsModel[paramname.replace('@', '')] = convertDBtoTypeScriptType[paramtype]

        })
    }

    public async saveScalarFunctionDefinitionsToFile() {
        const rootFolder = this._workspaceManager.getRootFolder().path;
        const MODEL_REPOSITORY_PATH = this._settings?.modelPath || '/app/repository/';
        const scalarFunctionsFolder = rootFolder + MODEL_REPOSITORY_PATH + 'scalarFunctions/';

        let scalarFunctionsModelString = '';

        Object.entries(this._scalarFunctionDictionary).forEach(([functionName, functionDef]) => {
            const {
                paramsModel,
                returnType
            } = functionDef;

            scalarFunctionsModelString += '\t\n' + functionName + ':{'

            const getModelString = (model: { [dataField: string]: typeScriptDataType }) => {
                let paramsString = '{';

                Object.entries(model).forEach(([paramName, paramType]) => {
                    paramsString += '\t\t\n' + paramName + '?:' + paramType;
                })

                return paramsString + '\n\t}'
            };

            scalarFunctionsModelString += '\n\tparams:' + (Object.keys(paramsModel) ? getModelString(paramsModel) : 'never');
            scalarFunctionsModelString += '\n\treturnType:' + returnType;
            scalarFunctionsModelString += '\n\t}';
        })

        const tableFunctionsModelType = 'export type ScalarFunctionsModel = {' + scalarFunctionsModelString + '\n' + '}';
        await this._workspaceManager.createFile(scalarFunctionsFolder + 'ScalarFunctionsModel.ts', '\n\n' + tableFunctionsModelType);

    }
}
