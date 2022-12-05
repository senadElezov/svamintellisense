

import * as vscode from 'vscode';
import { LayoutControlsExtractor } from './LayoutControlsExtractor';



export class LayoutControlsExtractorController {
    private _layoutControlsExtractor:LayoutControlsExtractor ;
    private _activationCommand: vscode.Disposable;

    constructor() {

        this._layoutControlsExtractor = new LayoutControlsExtractor();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.extractLayoutsAndControls", () => {
            this._layoutControlsExtractor.extractLayoutsAndControls();
        });

    }

    public dispose() {
        this._activationCommand.dispose();

    }

}