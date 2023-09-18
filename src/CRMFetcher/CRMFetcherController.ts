import * as vscode from 'vscode';
import { Injectable } from '../util-classes/di/injectable';
import { CRMFetcher } from './CRMFetcher';


@Injectable()
export class CRMFetcherController {
    private _activationCommand: vscode.Disposable;
    private _CRMFetcher: CRMFetcher;

    constructor() {
        this._CRMFetcher = new CRMFetcher();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.getCRM", () => {

            this._CRMFetcher.generateFolders();
        });
    }

    public dispose() {
        this._activationCommand.dispose()
    }
}