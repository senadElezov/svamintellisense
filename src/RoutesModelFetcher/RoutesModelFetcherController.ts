import { RoutesModelFetcher } from "./RoutesModelFetcher";
import * as vscode from 'vscode';

export class RoutesModelFetcherController {
    private _routesModelFetcher:RoutesModelFetcher;
    private _activationCommand: vscode.Disposable;

    constructor() {

        this._routesModelFetcher= new RoutesModelFetcher();
        this._activationCommand = vscode.commands.registerCommand("svamintellisense.fetchRoutes", () => {
            this._routesModelFetcher.fetchRoutes();
        });

    }

    public dispose() {
        this._activationCommand.dispose();

    }

}