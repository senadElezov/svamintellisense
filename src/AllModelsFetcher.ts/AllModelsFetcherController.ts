import { AllModelsFetcher } from './AllModelsFetcher';
import * as vscode from 'vscode'

export class AllModelsFetcherController {
    private _allModelsFetcher: AllModelsFetcher;
    private _activationCommand: vscode.Disposable;

    constructor() {

        this._allModelsFetcher = new AllModelsFetcher();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.fetchAllModels", async () => {
            await this._allModelsFetcher.fetchAllMetaData();
            this._allModelsFetcher.loadToFiles();
        });
    }

    public dispose() {
        this._activationCommand.dispose();

    }

}