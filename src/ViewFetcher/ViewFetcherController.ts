import { ViewFetcher } from "./ViewFetcher";
import * as vscode from 'vscode'

export class ViewFetcherController {

    
    private _viewFetcher: ViewFetcher;
    private _activationCommand: vscode.Disposable;

    constructor() {
        this._viewFetcher = new ViewFetcher();

        this._activationCommand = vscode.commands.registerCommand("svamintellisense.fetchViewModel", () => {
            
            this._viewFetcher.generateViewModel();

        });
    }

    public dispose() {
        this._activationCommand.dispose();
    }

    
}