
import * as vscode from 'vscode';
import { CryptedQueryIntellisense } from './CryptedQueryIntellisense';

export class CryptedQueryIntellisenseController {
    private _activationCommand: vscode.Disposable;
    private _cryptedQueryIntellisense: CryptedQueryIntellisense;

    constructor() {
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.activateCQI", () => {
            vscode.window.showInputBox().then(value => {
                if (value) {
                    this._cryptedQueryIntellisense = new CryptedQueryIntellisense(value.split(','));
                }
            })
        });

        this._cryptedQueryIntellisense = new CryptedQueryIntellisense([]);

    }

    public dispose() {
        this._cryptedQueryIntellisense.dispose();
        this._activationCommand.dispose();
    }
}