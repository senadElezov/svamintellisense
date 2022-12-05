import { SvamComponentIntellisense } from "./SvamComponentIntellisense";
import * as vscode from 'vscode';
import { ComponentRegistry } from "../ComponentIntellisense/ComponentRegistry";

export class SvamComponentIntellisenseController {
    private _svamIntellisense: SvamComponentIntellisense;
    private _disposable: vscode.Disposable;
    
    constructor( svamComponentIntellisense: SvamComponentIntellisense ) {
        this._svamIntellisense = svamComponentIntellisense;
        ComponentRegistry.initializeComponentRegistry();
        let subscriptions: vscode.Disposable[] = [];
        vscode.workspace.onDidChangeTextDocument(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.workspace.onDidSaveTextDocument(ComponentRegistry.initializeComponentRegistry, this, subscriptions);

        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    
    private _onEvent(params: any) {
        let document: vscode.TextDocument;
        let position: vscode.Position;

        if(params.hasOwnProperty("document"))
        {
            document = params.document;
            // position = params.contentChanges.range.end;
        }
        else
        {
            document = params.textEditor.document;
            // position = params.selections[0].end;
        }

        // this._svamIntellisense.showComponentIntellisense(document,position);
    }

    public dispose() 
    {
        this._disposable.dispose();
        
    }

}