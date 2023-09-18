import WorkspaceManager from "../WorkspaceManager";
const fetch = require("node-fetch");

import * as vscode from 'vscode';
import { StringConstants } from "../StringConstants/StringConstants";
import { Injectable } from '../util-classes/di/injectable';

interface IColumnMetaData {
    columnname: string;
    maximumlength: number;
    typename: string;
    isnullable?: boolean;
    isidentity?: boolean;
    referencedcolumn?: string;
    referencedtable?: string;
}

@Injectable()
export class CryptedQueryIntellisense {
    private _tableArray: string[]
    public _myCompletionItemProvider: vscode.Disposable = vscode.Disposable.from({ dispose: () => { } });
    private _tableMetaDataDictionary: { [Key: string]: IColumnMetaData[] }

    constructor(tableArray: string[]) {
        this._tableArray = tableArray.map(rawTable => ("'" + rawTable + "'"));
        this._tableMetaDataDictionary = {};
        this.getTablesMetaData();
    }

    public async getTablesMetaData() {
        this._tableMetaDataDictionary = {};
        const settings = await WorkspaceManager.getSettings();

        const queryForTablesMetaData: string = `select
            t.name as tableName,
            c.name as columnName,
            c.max_length as maximumLength,
            tt.name as typeName,
            c.is_nullable as isNullable,
            c.is_identity as isIdentity,
            refColumn.name as referencedColumn,
            refTable.name as referencedTable
        from sys.columns as c 
            inner join sys.tables as t on t.object_id = c.object_id 
            inner join sys.types as tt on tt.user_type_id = c.user_type_id
            left join sys.foreign_key_columns as fkc on (fkc.parent_object_id = c.object_id AND c.column_id = fkc.parent_column_id)
            left join sys.tables as refTable on fkc.referenced_object_id = refTable.object_id 
            left join sys.columns as refColumn on (fkc.referenced_column_id = refColumn.column_id AND fkc.referenced_object_id = refColumn.object_id)`

        const queryPrepared = [
            {
                query: queryForTablesMetaData,
                commandtype: 'text',
                tableName: 'table'
            }
        ];

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic dGVzdDoxMjM=' },
            body: JSON.stringify({
                db: settings?.ooDatabase,
                queries: queryPrepared,
            })
        };

        const response: any = await fetch(settings?.api, requestOptions);
        const tablesMetaData: any = await response.json();

        this.loadMetaDataToDictionary(tablesMetaData);
        this.registerCompletionItemProvider();
    }

    loadMetaDataToDictionary(tablesMetaData: any[]) {

        tablesMetaData.map(tableMetaData => {
            if (!this._tableMetaDataDictionary[tableMetaData.tablename]) {
                this._tableMetaDataDictionary[tableMetaData.tablename] = [];
            }

            this._tableMetaDataDictionary[tableMetaData.tablename].push(tableMetaData);
        });

    }

    private registerCompletionItemProvider() {
        const sel: vscode.DocumentFilter = { scheme: 'file', language: 'typescript' };

        const self = this;

        const tableMetaDataDictionary = this._tableMetaDataDictionary;

        this._myCompletionItemProvider = vscode.languages.registerCompletionItemProvider(sel, {
            provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position,
                token: vscode.CancellationToken,
                context: vscode.CompletionContext) {

                let completionItemList: vscode.CompletionItem[] = [];

                const documentLine = document.lineAt(position.line);
                const documentLineText = documentLine.text;
                const startingCharIndex = position.character - 1;

                let possibleTable: string = self.findCurrentTable(documentLineText, startingCharIndex);

                if (Object.keys(tableMetaDataDictionary).includes(possibleTable)) {
                    const columnsMetaData: IColumnMetaData[] = tableMetaDataDictionary[possibleTable];

                    columnsMetaData.map(columnMetaData => {
                        let columnCompletionItem = new vscode.CompletionItem(columnMetaData.columnname);
                        columnCompletionItem.kind = vscode.CompletionItemKind.Constructor;
                        columnCompletionItem.insertText = columnMetaData.columnname;
                        columnCompletionItem.sortText = String.fromCharCode(0);

                        const generateAdditionalDocumentation = () => {
                            let returningString = "";

                            for (const [key, value] of Object.entries(columnMetaData)) {
                                if (value !== null) {
                                    returningString += "\n@" + key + ": " + value;
                                }

                            }

                            return returningString;
                        }

                        columnCompletionItem.documentation = generateAdditionalDocumentation();

                        completionItemList.push(columnCompletionItem);
                    });

                    return completionItemList;
                }



                for (let tableName in tableMetaDataDictionary) {
                    let completionItem = new vscode.CompletionItem('tbl' + tableName);
                    completionItem.kind = vscode.CompletionItemKind.Constructor;
                    completionItem.insertText = tableName;
                    completionItem.sortText = String.fromCharCode(0);
                    completionItem.documentation = "table " + tableName;
                    completionItemList.push(completionItem);
                }

                return completionItemList;
            }
        }, ".");

    }

    private findCurrentTable(lineText: string, currentCharacterIndex: number): string {
        let fillTable: boolean = false;
        const FIRST_INDEX: number = 0

        let reversedTable: string = StringConstants.EMPTY;
        let returningTable: string = StringConstants.EMPTY;

        for (let charIndex: number = currentCharacterIndex; charIndex >= FIRST_INDEX; charIndex--) {
            const currentCharacter = lineText.charAt(charIndex);

            if (currentCharacter.match(/[A-Za-z]/)) {
                if (fillTable) {
                    reversedTable += currentCharacter;
                    continue;
                }

                continue;
            }

            if (currentCharacter === '.') {
                fillTable = true;
                continue;
            }

            break;
        }

        returningTable = reversedTable.split("").reverse().join("");

        return returningTable;
    }

    public dispose() {
        this._myCompletionItemProvider.dispose();
    }
}