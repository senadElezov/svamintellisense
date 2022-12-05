import { SvamSPIntellisense } from "./SvamSPIntellisense";
import * as vscode from 'vscode';

export class SvampSPIntellisenseController
{
    private _svamIntellisense: SvamSPIntellisense;
    private _activationCommand: vscode.Disposable;
    private _deactivationCommand: vscode.Disposable;

    constructor( svamSPIntellisense: SvamSPIntellisense ) {

        this._svamIntellisense = svamSPIntellisense;
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.activateSP", ()=>
        {
            svamSPIntellisense.getAllStoredProceduresAndParams();
        });

        this._deactivationCommand = vscode.commands.registerCommand("svamintellisense.deactivateSP", ()=>
        {
            svamSPIntellisense._myCompletionItemProvider.dispose();
        });
        
    }
    
    public dispose() 
    {
        this._activationCommand.dispose();
        this._deactivationCommand.dispose();
        
    }

}