import * as vscode from 'vscode';
import { DBControlsColumnsIntellisense } from './DBControlsColumnsIntellisense';


export class DBControlsColumnsIntellisenseController {
    private _activationCommand: vscode.Disposable;
    private _deactivationCommand:vscode.Disposable;
    private _controlsColumnsIntellisense: DBControlsColumnsIntellisense;

    constructor() {
        this._controlsColumnsIntellisense= new DBControlsColumnsIntellisense();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.activateDBControlColumnsIntellisense", () => {

            this._controlsColumnsIntellisense.activate();
        });

        this._deactivationCommand= vscode.commands.registerCommand("svamintellisense.deactivateDBControlColumnsIntellisense", () => {

            this._controlsColumnsIntellisense.dispose()
            
        })
        

    }

    public dispose() {
        this._controlsColumnsIntellisense.dispose();
        this._activationCommand.dispose()
        this._deactivationCommand.dispose();
    }
}