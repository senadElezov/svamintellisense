import { IControl } from "../Interfaces/IControl";
import * as vscode from 'vscode';
import executeQuery from "../Utils/executeQuery";
import { dataTypeToEditorType } from "../Utils/dataTypeToEditorType";
import { convertDBToDataType } from "../Utils/convertDBToDataType";
import generateControlsString from "../Utils/generateControlsString";

export class SPParamsToControlsFetcher {

    private _spDefs: {
        [sp: string]: IControl[]
    }

    private _spParamsControlsCompletionProvider: vscode.Disposable;

    constructor() {
        this._spDefs = {}
        this._spParamsControlsCompletionProvider = { dispose: () => { } }
    }

    public async initializeSPParamsIntellisense() {

        const spParamsQuery = `
                                SELECT  pr.name as procname,
                                        par.name as paramname,
                                        t.name as typename
                                FROM    sys.procedures as pr
                                        inner join sys.parameters as par on par.object_id=pr.object_id 
                                        left join sys.types as t on par.user_type_id = t.user_type_id
                                        left join fnWeb
                                WHERE   par.is_output = 0
                                `
        const paramsQueryResult: { procname: string, paramname: string, typename: string }[] = await executeQuery(spParamsQuery);

        paramsQueryResult.forEach((def) => {
            const { paramname, procname, typename } = def

            if (this._spDefs[procname]) {
                this._spDefs[procname] = [];
            }

            const dataType = convertDBToDataType[typename];

            this._spDefs[procname].push({
                dataField: paramname,
                editorType: dataTypeToEditorType[dataType],
                formLabel: {
                    text: paramname
                }
            })
        })

        this.registerSPParamsControlsCompletionProvider();
    }

    private registerSPParamsControlsCompletionProvider() {
        let sel: vscode.DocumentSelector = [
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'typescriptreact'},

        ];

        const spDefs = this._spDefs;



        this._spParamsControlsCompletionProvider = vscode.languages.registerCompletionItemProvider(
            sel,
            {
                provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

                    let completionItemList: vscode.CompletionItem[] = [];

                    for (let spName in spDefs) {
                        let completionItemControls = new vscode.CompletionItem(spName+ 'Controls')

                        const controls = spDefs[spName];

                        completionItemControls.kind = vscode.CompletionItemKind.Constructor;
                        completionItemControls.insertText = generateControlsString(spName,controls);
                        completionItemControls.sortText = String.fromCharCode(0);
                        completionItemControls.documentation = 'Kontrole za storanu proceduru ' + spName;

                        completionItemList.push(completionItemControls);

                    }

                    return completionItemList;
                }
            });

    }

    public dispose() {
        this._spParamsControlsCompletionProvider.dispose();
    }
}