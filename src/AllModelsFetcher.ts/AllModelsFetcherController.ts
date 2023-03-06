import { AllModelsFetcher } from './AllModelsFetcher';
import * as vscode from 'vscode'
import { DBType } from '../Types/db-type';

export class AllModelsFetcherController {
    ;

    private _dbAllModelsFetcher: { [dbType in DBType]: {
        intellisense: AllModelsFetcher
        activationCommandString: string,
        activationCommand?: vscode.Disposable,
    } } = {
            oo: {
                intellisense: new AllModelsFetcher('oo'),
                activationCommandString: "svamintellisense.fetchAllModels",
            },
            op: {
                intellisense: new AllModelsFetcher('op'),
                activationCommandString: "svamintellisense.fetchAllModels.op",
            }
        }

    constructor() {

        Object.values(this._dbAllModelsFetcher).forEach((def) => {
            def.activationCommand = vscode.commands.registerCommand(def.activationCommandString, async () => {
                await def.intellisense.fetchAllMetaData();
                await def.intellisense.loadToFiles();
            });
        })

    }

    public dispose() {

        Object.values(this._dbAllModelsFetcher)
            .forEach(({ activationCommand }) => {
                activationCommand?.dispose();
            })

    }

}