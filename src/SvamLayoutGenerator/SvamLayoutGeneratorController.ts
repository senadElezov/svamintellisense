
import * as vscode from 'vscode';
import { StringConstants } from '../StringConstants/StringConstants';
import { TextEncoder } from 'util';
export class SvamLayoutGenerator {
    private _activationCommand: vscode.Disposable;

    
    public dispose() {
        this._activationCommand.dispose();
    }

    constructor() {
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.generateLayout", () => {
            this.generateFormLayout();
        });
    }

    async generateFormLayout() {

        if (vscode.window.activeTextEditor) {
            let currentDocument = vscode.window.activeTextEditor.document;

            let declarationArray: string[] = currentDocument.getText().split('=')[0].trim().split(' ');
            let variableName = declarationArray[declarationArray.length - 1];
            let fileName = currentDocument.fileName;
            let newFileName = fileName.replace('Controls.js', 'LayoutTest.js');
            let outputVariableName = variableName.replace('Controls', 'Layout');
            let dataFieldValues: string[] = this.getDataFieldValues(currentDocument);

            let fileSystem: vscode.FileSystem = vscode.workspace.fs;

            let layoutHeader = ['\titemType: \'group\'', '\tcolCount: 2', '\tcaption: \'Caption2\'', '\titems:'].join(',\n');

            let genericItemArray = '[\r\n' + dataFieldValues.map(currentDataField => { return '\t\t{ controlName: \'' + currentDataField + '\', colSpan: 1 }'; }).join(',\n') + '\n\t]';
            let layoutString = 'export const ' + outputVariableName + ' = {\n' + layoutHeader + genericItemArray + '\n};';

            let textEncoder: TextEncoder = new TextEncoder();

            let document = vscode.Uri.file(newFileName);

            let doesDocumentExists = Boolean(document);

            let saveDocument = true;

            if (doesDocumentExists) {
                let result =await vscode.window
                    .showInformationMessage(
                        "Document named " + " already exists. Do you want to replace it's content?",
                        ...["Yes", "No"]
                    );
                    // .then((answer) => {
                    //     saveDocument = answer === "No";
                    // });
                
                    saveDocument = result === "Yes";
            }
            
            if(saveDocument) {
                fileSystem.writeFile(vscode.Uri.file(newFileName), textEncoder.encode(layoutString));
            }

        }



        


    };

    getDataFieldValues(currentDocument: vscode.TextDocument): string[] {
        let dataFieldValues: string[] = [];
        for (let lineIndex = 0; lineIndex < (currentDocument ? currentDocument?.lineCount : 0); lineIndex++) {
            let currentLine: vscode.TextLine = currentDocument.lineAt(lineIndex);
            let currentLineText = currentLine.text;

            if (currentLineText.indexOf('dataField') > 0) {
                let dataFieldValue = '';

                let charIndex = currentLineText.indexOf('dataField');

                while (charIndex < currentLineText.length) {
                    let currentChar = currentLineText[charIndex];
                    if (currentChar === StringConstants.STRING_ENCAPSULATOR || currentChar === StringConstants.STRING_ALT_ENCAPSULATOR) {
                        let startedBy = currentChar;
                        charIndex++;
                        currentChar = currentLineText[charIndex];

                        while (charIndex < currentLineText.length) {
                            currentChar = currentLineText[charIndex];
                            if (currentChar === startedBy) {
                                dataFieldValues.push(dataFieldValue);
                                break;
                            }
                            dataFieldValue += currentChar;

                            charIndex++;
                        }

                        break;
                    }
                    charIndex++;
                }
            }
        }

        return dataFieldValues;
    }
}