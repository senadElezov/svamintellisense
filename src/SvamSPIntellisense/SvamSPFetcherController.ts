import { SvamSPIntellisense } from "./SvamSPIntellisense";
import * as vscode from 'vscode';
import { DBType } from '../Types/db-type';

export class SvamSPFetcherController {

    private _dbSpIntellisense: { [dbType in DBType]: {
        intellisense: SvamSPIntellisense,
        activationCommandString: string,
        activationCommand?: vscode.Disposable,
    } } =
        {
            oo: {
                intellisense: new SvamSPIntellisense('oo'),
                activationCommandString: 'svamintellisense.fetchSPModel'
            },
            op: {
                intellisense: new SvamSPIntellisense('oo'),
                activationCommandString: 'svamintellisense.fetchSPModel.op'
            }
        }
        
    constructor() {

        Object.values(this._dbSpIntellisense).forEach((def) => {

            def.activationCommand = vscode.commands.registerCommand(def.activationCommandString, () => {
                def.intellisense.generateStoredProceduresModel();
            });

        })

    }

    public dispose() {
        Object.values(this._dbSpIntellisense).forEach(({ activationCommand }) => activationCommand?.dispose());

    }
}