import * as vscode from 'vscode';

import { DBModelFetcher } from './DbModelFetcher';

export class DBModelFetcherController {
    private _dbModelFetcher: DBModelFetcher;
    private _activationCommand: vscode.Disposable;

    constructor(dbModelFetcher: DBModelFetcher) {

        this._dbModelFetcher = dbModelFetcher;
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.fetchDBModel", () => {
            dbModelFetcher.fetchEntireDataBaseModel();
        });

    }

    public dispose() {
        this._activationCommand.dispose();

    }

}