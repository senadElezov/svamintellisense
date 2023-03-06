import { IColumn } from "../Interfaces/IColumn";
import { IControl } from "../Interfaces/IControl";
import fetchTableMetaData from "../Utils/fetchTableMetaData";

import tableMetaToInterface from "../Utils/tableMetaToInterface";
import * as vscode from 'vscode';
import generateColumnsString from "../Utils/generateColumnsString";
import generateControlsString from "../Utils/generateControlsString";
import { ITableMeta } from "../Interfaces/ITableMeta";
import { DBType } from '../Types/db-type';

export class DBControlsColumnsIntellisense {

    public _tableDefs: {
        [tableName: string]: {
            controls: IControl[],
            columns: IColumn[]
        }
    }

    private _controlColumnsCompletionProvider: vscode.Disposable;
    constructor(
        private _dbType: DBType
    ) {
        this._controlColumnsCompletionProvider = { dispose: () => { } }
        this._tableDefs = {};

    }

    async fetchTableDefs(params?: { dateDefault: string }) {

        const allTableMetaData = await fetchTableMetaData(this._dbType);

        const tableDict: { [tableName: string]: ITableMeta[] } = {};

        allTableMetaData.forEach(metaTableRow => {

            const {
                tablename
            } = metaTableRow

            if (!tableDict[tablename]) {
                tableDict[tablename] = []
            }

            tableDict[tablename].push(metaTableRow)
        });


        for (let tableName in tableDict) {

            const { columns, controls } = tableMetaToInterface(tableDict[tableName], params);

            this._tableDefs[tableName] = {
                columns: columns,
                controls: controls
            }
        }

    }
    async activate() {
        this.dispose();

        await this.fetchTableDefs();
        this.registerCompletionItemProvider();
    }

    public dispose() {
        this._controlColumnsCompletionProvider.dispose()
    }

    private registerCompletionItemProvider = () => {

        let sel: vscode.DocumentSelector = [
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'typescriptreact' },

        ];

        const tableDefs = this._tableDefs;



        this._controlColumnsCompletionProvider = vscode.languages.registerCompletionItemProvider(
            sel,
            {
                provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

                    let completionItemList: vscode.CompletionItem[] = [];

                    for (let tableName in tableDefs) {
                        let completionItemColumns = new vscode.CompletionItem(tableName + 'Columns');
                        let completionItemControls = new vscode.CompletionItem(tableName + 'Controls')

                        const { controls, columns } = tableDefs[tableName];
                        const generateInsertString = (type: 'controls' | 'columns'): string => {

                            let returningString;
                            if (type === 'columns') {
                                returningString = generateColumnsString(tableName, columns);
                                return returningString;
                            }

                            returningString = generateControlsString(tableName, controls);
                            return returningString;
                        };


                        completionItemColumns.kind = vscode.CompletionItemKind.Constructor;
                        completionItemColumns.insertText = generateInsertString('columns');
                        completionItemColumns.sortText = String.fromCharCode(0);
                        completionItemColumns.documentation = 'Kolone za tablicu ' + tableName;


                        completionItemControls.kind = vscode.CompletionItemKind.Constructor;
                        completionItemControls.insertText = generateInsertString('controls');
                        completionItemControls.sortText = String.fromCharCode(0);
                        completionItemControls.documentation = 'Kontrole za tablicu ' + tableName;

                        completionItemList.push(completionItemColumns);
                        completionItemList.push(completionItemControls);

                    }

                    return completionItemList;
                }
            });

    }

}