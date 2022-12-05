import { Property } from './Property';
import WorkspaceManager from "../WorkspaceManager";
import * as vscode from "vscode";

export class ComponentRegistry {
    public static _componentPropTypeDictionary: { [Key: string]: Property[] } = {};
    public static _allComponents: string[] = [];
    public static _componentJSXCompletionItemProvider: vscode.Disposable;

    public static async initializeComponentRegistry() {
        const allTextDocuments: string[] = await (new WorkspaceManager()).getAllDocumentsText();

        const storeComponentsAndTypesToDictionary = (document: string) => {
            let componentName: string;

            componentName = ComponentRegistry.getComponentName(document);

            // Document contains a component
            if (componentName !== "") {
                componentName.replace("/[^a-zA-Z]/g", "");
                let propTypes: Property[];
                propTypes = this.getPropsFromComponent(document, componentName);
                this._allComponents.push(componentName);
                this._componentPropTypeDictionary[componentName] = propTypes;
            }

        };

        allTextDocuments.map(storeComponentsAndTypesToDictionary);

        this.registerComponentJSXAndImportCompletionItemProvider();
    }

    private static getComponentName(document: string): string {
        let componentName: string = "";
        let documentSplitByLines = document.split("\r\n");

        for (let lineIndex: number = 0; lineIndex < documentSplitByLines.length; lineIndex++) {
            let lineWords = documentSplitByLines[lineIndex].trim().split(" ");

            componentName = this.returnComponentNameFromLine(lineWords);
            if (componentName !== "") {
                return componentName;
            }

        }

        return "";

    }

    private static getPropsFromComponent(documentText: string, componentName: string): Property[] {
        let returningProperties: Property[] = [];
        let searchedIndex: number = documentText.indexOf(componentName + ".propTypes");
        if (searchedIndex > 0) {
            let textAfterPropTypes = documentText.substring(searchedIndex);

            let propTypesText = textAfterPropTypes.split(";")[0].split("=")[1];

            propTypesText = this.removeCharsFromAString(propTypesText, ["{", "}", "\n", "\r", "\t"]);

            returningProperties = propTypesText.split(",").map((prop) => {
                let [propName, propType] = prop.split(":");
                return new Property(propName.trim(), propType.trim());
            });

        }

        return returningProperties;
    }

    private static returnComponentNameFromLine(lineWords: string[]) {
        if (lineWords.length > 1) {
            let componentName: string = lineWords[1];
            let componentType: string = lineWords[0];

            if (componentName.charAt(0) !== componentName.charAt(0).toUpperCase()) {
                return "";

            }

            switch (componentType) {
                case "const":
                    {
                        if (lineWords.includes("=>")) {
                            return lineWords[1];
                        }
                    }
                    break;
                case "function":
                    {
                        return this.removePropsFromComponentName(lineWords[1]);
                        break;
                    }
                case "class":
                    {
                        if (lineWords.includes("React.Component")) {
                            return lineWords[1];
                        }
                        break;
                    }
            }
        }
        return "";
    }

    private static removePropsFromComponentName(componentWithProps: string): string {
        if (componentWithProps.indexOf('(') < 0) {
            return componentWithProps;
        }

        return componentWithProps.substring(0, componentWithProps.indexOf('('));
    }

    private static removeCharsFromAString(startingString: string, charsArray: string[]): string {
        charsArray.map((character) => {
            let re = new RegExp(character, "g");
            startingString = startingString.replace(re, "");
        });

        return startingString;
    }

    private static registerComponentJSXAndImportCompletionItemProvider() {
        let sel: vscode.DocumentSelector = { scheme: 'file', language: 'javascript' };
        let svamComponents: string[] = this._allComponents.filter((component) => component.startsWith("Svam"));

        this._componentJSXCompletionItemProvider = vscode.languages.registerCompletionItemProvider(sel, {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

                const mapPropertiesToCompletionItem = (svamComponent: string) => {
                    let completionItem = new vscode.CompletionItem(svamComponent + " JSX auto import");
                    let snippetInsert: vscode.SnippetString = new vscode.SnippetString;
                    snippetInsert.appendText("<" + svamComponent + "\n\t");
                    snippetInsert.appendTabstop();
                    snippetInsert.appendText("\n>\n" + "</" + svamComponent + ">");
                    completionItem.insertText = snippetInsert;
                    if (document.getText().indexOf(svamComponent) < 0) {
                        completionItem.additionalTextEdits = [vscode.TextEdit.insert(new vscode.Position(0, 0), "import { " + svamComponent + " } from '@svam';\n")];
                    }
                    completionItem.documentation = "Insert svam component with autocomplete import";
                    completionItem.sortText = String.fromCharCode(255);

                    return completionItem;
                };

                let completionItemList: vscode.CompletionItem[] = svamComponents.map(mapPropertiesToCompletionItem);

                return completionItemList;
            }
        }, "");
    }
}