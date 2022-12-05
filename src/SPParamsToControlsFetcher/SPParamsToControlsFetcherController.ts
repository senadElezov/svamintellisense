import * as vscode from 'vscode';
import { SPParamsToControlsFetcher } from './SPParamsToControlsFetcher';


export class SPParamsToControlsFetcherController {
    private _activationCommand: vscode.Disposable;
    private _deactivationCommand:vscode.Disposable;
    private _spParamsIntellisense: SPParamsToControlsFetcher;

    constructor() {
        this._spParamsIntellisense= new SPParamsToControlsFetcher();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.activateSPControlsIntellisense", () => {

            this._spParamsIntellisense.initializeSPParamsIntellisense();
        });

        this._deactivationCommand= vscode.commands.registerCommand("svamintellisense.deactivateSPControlsIntellisense", () => {

            this._spParamsIntellisense.dispose()
            
        })
        

    }

    public dispose() {
        this._spParamsIntellisense.dispose();
        this._activationCommand.dispose()
        this._deactivationCommand.dispose();
    }
}