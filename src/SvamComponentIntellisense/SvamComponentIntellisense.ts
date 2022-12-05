import * as vscode from 'vscode';
import { ComponentRegistry } from '../ComponentIntellisense/ComponentRegistry'; 
import { Property } from '../ComponentIntellisense/Property';
import { SvamTextLine } from '../WrapperClasses/SvamTextLine';

export class SvamComponentIntellisense {
    private _forbidenStringsArray: string[] = [";", ">", ")","("];
    private _myCompletionItemProvider: vscode.Disposable = vscode.Disposable.from({dispose: ()=>{}});
    private _currentComponent: string = "";
    private _currentComponentProperties: string[] = [];

    showComponentIntellisense(document: vscode.TextDocument, position: vscode.Position) 
    {
        let componentName: string = this.isItWithinAComponent(document, position);

        if(componentName === "")
        {
            if(this._currentComponent !== ""){
                this._myCompletionItemProvider.dispose();
                this._currentComponent = "";
            }

            return;
        }

        if(componentName !== this._currentComponent)
        {
            this._myCompletionItemProvider.dispose();
            this.registerCompletionItemProviderForPropTypes(componentName);
            this._currentComponent = componentName;

        }
        
    }

    isItWithinAComponent(document: vscode.TextDocument, changePosition: vscode.Position): string
	{
        if(this.isCursorWithinJS(changePosition.character, document.lineAt(changePosition.line).text))
        {
             return "";

        }

        for(let lineIndex: number = changePosition.line; lineIndex >=0; lineIndex-- )
        {
            let currentLine: SvamTextLine =new  SvamTextLine(document.lineAt(lineIndex));

            currentLine.trimRemoveJSRemoveStrings();
        
            let currentLineText: string = currentLine.getText();

            if (this.lineContainsAForbiddenString(currentLineText))
            {
                return ""; 
            
            }

            let possibleComponent = this.lineContainsAComponent(currentLineText);
            if(possibleComponent !== "")
            {
                this.findExistingPropertiesOfAComponent(document,possibleComponent,lineIndex);
                return possibleComponent;

            }
            
        }

        return ""; 
        
    }

    private lineContainsAForbiddenString(lineText: string): boolean{
        let doesItContainForbiddenString: boolean = false;
        this._forbidenStringsArray.map(forbiddenString =>{
            let condition: boolean = lineText.indexOf(forbiddenString)>=0;
            doesItContainForbiddenString = doesItContainForbiddenString || condition;
        });

        return doesItContainForbiddenString;

    }

    private lineContainsAComponent(lineText: string): string 
    {
        if(lineText.indexOf("<")<0)
        {
            return "";
        }

        let re = new RegExp(" ", "g");
        lineText = lineText.replace(re,"");

        let allComponents: string[] = ComponentRegistry._allComponents;

        for(let componentIndex:number=0; componentIndex < allComponents.length; componentIndex++)
        {
            let component: string = allComponents[componentIndex];
            
            if(lineText.indexOf("<"+component)>=0)
            {

                return component;
            
            }
        } 

        return ""; 
    }

    private registerCompletionItemProviderForPropTypes(componentName: string)
    {
        let sel:vscode.DocumentSelector = { scheme: 'file', language: 'javascript' };
        let currentComponentProperties: string[] = this._currentComponentProperties;

        const textEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor


        this._myCompletionItemProvider= vscode.languages.registerCompletionItemProvider(sel, {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                let componentPropTypeDictionary = ComponentRegistry._componentPropTypeDictionary;
                let propList: Property[] = componentPropTypeDictionary[componentName];

                const removeExistingProperties = (prop: Property) =>currentComponentProperties.indexOf(prop._name) <0;
                
                const mapPropertiesToCompletionItem = (prop: Property) => {
                    let completionItem = new vscode.CompletionItem(prop._name+"?");
                    completionItem.insertText = prop._name;
                    completionItem.documentation = "(" +componentName+" property) "+prop._propType;
                    completionItem.sortText = String.fromCharCode(0);
                    return completionItem;
                };

                let completionItemList: vscode.CompletionItem[] = propList.filter(removeExistingProperties).map(mapPropertiesToCompletionItem);
                
               return completionItemList;
            }
        },"");
        
    }

    private isCursorWithinJS(cursorCharIndex: number, cursorLine: string): boolean
    {
        const JAVASCRIPT_STARTER= "{";
        const JAVASCRIPT_ENDER = "}";
        
        let howMuchStartersWithoutEnders:number = 0;

        for(let charIndex:number = cursorCharIndex; charIndex>=0; charIndex--)
        {
            switch (cursorLine.charAt(charIndex))
            {
                case JAVASCRIPT_ENDER:
                    howMuchStartersWithoutEnders--;
                    break;
                case JAVASCRIPT_STARTER:
                    howMuchStartersWithoutEnders++;
                    break;

            }
        }
        
        return howMuchStartersWithoutEnders > 0;

    }

    private findExistingPropertiesOfAComponent(document: vscode.TextDocument, componentName:string, componentLineIndex: number)
    {
        let allComponentProps: string[] = ComponentRegistry._componentPropTypeDictionary[componentName].map( prop => prop._name);
        let foundComponentProps: string[] = [];
        
        for(let lineIndex:number = componentLineIndex; lineIndex < document.lineCount; lineIndex++)
        {
            let currentLine: SvamTextLine = new SvamTextLine(document.lineAt(lineIndex));
            currentLine.trimRemoveJSRemoveStrings();

            let currentLineText:string = currentLine.getText();
            
            let possibleProp: string="";
            if( currentLineText.indexOf("=")>=0)
            {
                possibleProp = currentLineText.split("=")[0].trim();
                
            }
            else
            {
                possibleProp = currentLineText.trim();
            }

            if(allComponentProps.indexOf(possibleProp)>=0)
            {
                foundComponentProps.push(possibleProp);
            
            }
            
            if(currentLineText.indexOf(">")>=0)
            {
                this._currentComponentProperties = foundComponentProps;
                break;
            }
        }
    }
  
}
