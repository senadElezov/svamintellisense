import * as vscode from 'vscode';
import { DBType } from '../Types/db-type';
import { SPParamsToControlsFetcher } from './SPParamsToControlsFetcher';


export class SPParamsToControlsFetcherController {
    private _spParamsIntellisense: SPParamsToControlsFetcher;

    private _dbSpParamsIntellisense: { [dbType in DBType]: {
        fetcher: SPParamsToControlsFetcher,
        activateCommandString: string,
        deactivateCommandString: string,
        deactivationCommand?: vscode.Disposable,
        activationCommand?: vscode.Disposable
    }
    } = {
            oo: {
                fetcher: new SPParamsToControlsFetcher('oo'),
                activateCommandString: 'svamintellisense.activateSPControlsIntellisense',
                deactivateCommandString: 'svamintellisense.deactivateSPControlsIntellisense'
            },
            op: {
                fetcher: new SPParamsToControlsFetcher('op'),
                activateCommandString: 'svamintellisense.activateSPControlsIntellisense.op',
                deactivateCommandString: 'svamintellisense.deactivateSPControlsIntellisense.op'
            }
        }
    constructor(
    ) {
        this._spParamsIntellisense = new SPParamsToControlsFetcher('oo');

        Object.values(this._dbSpParamsIntellisense).forEach(def => {
            def.activationCommand = vscode.commands.registerCommand(def.activateCommandString, () => {
                def.fetcher.initializeSPParamsIntellisense();
            })

            def.deactivationCommand = vscode.commands.registerCommand(def.deactivateCommandString, () => {
                this._spParamsIntellisense.dispose()
            })

        })

    }

    public dispose() {

        Object.values(this._dbSpParamsIntellisense).forEach(({ activationCommand, deactivationCommand, fetcher }) => {
            fetcher.dispose();
            activationCommand?.dispose();
            deactivationCommand?.dispose();
        })

    }
}