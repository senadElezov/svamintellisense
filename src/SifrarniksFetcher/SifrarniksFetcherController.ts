import { SifrarniksFetcher } from "./SifrarniksFetcher";
import * as vscode from 'vscode'

export class SifrarniksFetcherController {
    private _sifrarniksFetcher: SifrarniksFetcher;
    private _activationCommand: vscode.Disposable;

    constructor(sifrarnikFetcher: SifrarniksFetcher) {

        this._sifrarniksFetcher= sifrarnikFetcher;
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.fetchSifrarniks", () => {
            this._sifrarniksFetcher.fetchSifrarnikMetaData()
        });

    }

    public dispose() {
        this._activationCommand.dispose();

    }

}