import { ViewFetcher } from "./ViewFetcher";
import * as vscode from 'vscode'
import { DBType } from '../Types/db-type';

export class ViewFetcherController {


    private _dbViewFetcher: { [dbType in DBType]: {
        fetcher: ViewFetcher,
        activationCommandString: string,
        activationCommand?: vscode.Disposable
    } } =
        {
            oo: {
                fetcher: new ViewFetcher('oo'),
                activationCommandString: 'svamintellisense.fetchViewModel'
            },
            op: {
                fetcher: new ViewFetcher('op'),
                activationCommandString: 'svamintellisense.fetchViewModel.op'
            }
        }

    constructor() {

        Object.values(this._dbViewFetcher)
            .forEach(def => {
                def.activationCommand = vscode.commands.registerCommand(def.activationCommandString, () => {
                    def.fetcher.generateViewModel();
                });
            })

    }

    public dispose() {
        Object.values(this._dbViewFetcher).forEach(({ activationCommand }) => activationCommand?.dispose());
    }


}