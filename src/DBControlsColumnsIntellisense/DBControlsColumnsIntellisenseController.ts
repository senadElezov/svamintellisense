import * as vscode from 'vscode';
import { DBType } from '../Types/db-type';
import { DBControlsColumnsIntellisense } from './DBControlsColumnsIntellisense';


export class DBControlsColumnsIntellisenseController {

    private _dbControlsColumnsIntellisense: { [dbType in DBType]: {
        intellisense: DBControlsColumnsIntellisense
        activationCommandString: string,
        activationCommand?: vscode.Disposable,
        deactivationCommandString: string,
        deactivationCommand?: vscode.Disposable
    } } = {
            oo: {
                intellisense: new DBControlsColumnsIntellisense('oo'),
                activationCommandString: "svamintellisense.activateDBControlColumnsIntellisense",
                deactivationCommandString: "svamintellisense.deactivateDBControlColumnsIntellisense",
            },
            op: {
                intellisense: new DBControlsColumnsIntellisense('op'),
                activationCommandString: "svamintellisense.activateDBControlColumnsIntellisense.op",
                deactivationCommandString: "svamintellisense.deactivateDBControlColumnsIntellisense.op",
            }
        }

    constructor() {

        Object.values(this._dbControlsColumnsIntellisense)
            .forEach((def) => {
                def.activationCommand = vscode.commands.registerCommand(def.activationCommandString, () => {
                    def.intellisense.activate();
                });

                def.deactivationCommand = vscode.commands.registerCommand(def.deactivationCommandString, () => {

                    def.intellisense.dispose()

                })

            })

    }

    public dispose() {

        Object.values(this._dbControlsColumnsIntellisense)
            .forEach(({ intellisense, activationCommand, deactivationCommand }) => {
                intellisense.dispose();
                activationCommand?.dispose()
                deactivationCommand?.dispose();
            })


    }
}