import * as vscode from 'vscode';
import { TmpBxSpreader } from './TmpBxSpreader';



export class TmpBxSpreaderController {
    private _activationCommand: vscode.Disposable;
    private _bxSpreader: TmpBxSpreader;

    constructor() {
        this._bxSpreader = new TmpBxSpreader();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.spreadBx", () => {

            this._bxSpreader.spreadBx();
        });
    }

    public dispose() {
        this._activationCommand.dispose()
    }
}