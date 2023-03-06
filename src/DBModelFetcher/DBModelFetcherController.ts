import * as vscode from 'vscode';
import { DBType } from '../Types/db-type';

import { DBModelFetcher } from './DbModelFetcher';

export class DBModelFetcherController {

    private _dbModelFetchers: { [dbTypes in DBType]: {
        activationCommandString: string,
        activationCommand?: vscode.Disposable,
        fetcher: DBModelFetcher
    } } = {
            oo: {
                activationCommandString: 'svamintellisense.fetchDBModel',
                fetcher: new DBModelFetcher('oo')
            },
            op: {
                activationCommandString: 'svamintellisense.fetchDBModel.op',
                fetcher: new DBModelFetcher('op')
            }
        }

    constructor() {

        Object.values(this._dbModelFetchers).forEach((def) => {
            def.activationCommand = vscode.commands.registerCommand(def.activationCommandString, () => {
                def.fetcher.fetchEntireDataBaseModel();
            });
        })

    }

    public dispose() {

        Object.values(this._dbModelFetchers).forEach(({ activationCommand }) => activationCommand?.dispose());

    }

}