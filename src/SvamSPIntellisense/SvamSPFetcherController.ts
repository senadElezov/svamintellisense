import { SvamSPIntellisense } from "./SvamSPIntellisense";
import * as vscode from 'vscode';

export class SvamSPFetcherController {
    
    private _svamIntellisense: SvamSPIntellisense;
    private _activationCommand: vscode.Disposable;
    

    constructor( svamSPIntellisense: SvamSPIntellisense ) {

        this._svamIntellisense = svamSPIntellisense;
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.fetchSPModel", ()=>
        {
            svamSPIntellisense.generateStoredProceduresModel();
        });
        
    }
    
    public dispose() 
    {
        this._activationCommand.dispose();
    
    }
}