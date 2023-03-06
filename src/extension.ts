// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SvamSPIntellisense } from './SvamSPIntellisense/SvamSPIntellisense';
import { SvampSPIntellisenseController } from './SvamSPIntellisense/SvamSPIntellisenseController';
import { SvamLayoutGenerator } from './SvamLayoutGenerator/SvamLayoutGeneratorController';
import { DBModelFetcherController } from './DBModelFetcher/DBModelFetcherController';
import { DBModelFetcher } from './DBModelFetcher/DbModelFetcher';
import { SifrarniksFetcherController } from './SifrarniksFetcher/SifrarniksFetcherController';
import { SifrarniksFetcher } from './SifrarniksFetcher/SifrarniksFetcher';
import { LayoutControlsExtractorController } from './LayoutControlsExtractor/LayoutControlsExtractorController';
import { SvamSPFetcherController } from './SvamSPIntellisense/SvamSPFetcherController';
import { DBControlsColumnsIntellisenseController } from './DBControlsColumnsIntellisense/DBControlsColumnsIntellisenseController';
import { ViewFetcherController } from './ViewFetcher/ViewFetcherController';
import { RoutesModelFetcherController } from './RoutesModelFetcher/RoutesModelFetcherController';
import { SPParamsToControlsFetcherController } from './SPParamsToControlsFetcher/SPParamsToControlsFetcherController';
import { AllModelsFetcherController } from './AllModelsFetcher.ts/AllModelsFetcherController';
import { CRMFetcherController } from './CRMFetcher/CRMFetcherController';
import { TmpBxSpreaderController } from './TmpBxSpreader/TmpBxSpreaderController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const terminal = vscode.window.createTerminal("testPath");
	// let cryptedQueryIntellisenseController = new CryptedQueryIntellisenseController();
	let sifrarnikController = new SifrarniksFetcherController(new SifrarniksFetcher('standardni'))
	let svamLayoutGenerator = new SvamLayoutGenerator();
	let svamSP = new SvamSPIntellisense();
	let svamSPController = new SvampSPIntellisenseController(svamSP);
	let dbModelFetcherController = new DBModelFetcherController();
	let layoutControlsExtractorController = new LayoutControlsExtractorController();
	const viewsFetcherController = new ViewFetcherController();
	const crmFetcherController = new CRMFetcherController();
	const routeFetcherController = new RoutesModelFetcherController();

	let svamSPModelController = new SvamSPFetcherController();

	let tmpBxSpreaderController = new TmpBxSpreaderController()

	let dbControlsColumnsController = new DBControlsColumnsIntellisenseController();
	const spControlsFetcherController = new SPParamsToControlsFetcherController();
	let commandActivate = vscode.commands.registerCommand("svamintellisense.myCommand", () => {
		vscode.window.showInformationMessage("Activated!");
	}
	);

	const allModelsFetcherController = new AllModelsFetcherController();

	context.subscriptions.push(dbModelFetcherController)
	context.subscriptions.push(viewsFetcherController);
	context.subscriptions.push(layoutControlsExtractorController);
	context.subscriptions.push(commandActivate);
	context.subscriptions.push(svamSPModelController);
	context.subscriptions.push(svamSPController);
	context.subscriptions.push(routeFetcherController);
	context.subscriptions.push(spControlsFetcherController);
	context.subscriptions.push(allModelsFetcherController);
	context.subscriptions.push(svamLayoutGenerator);
	context.subscriptions.push(dbControlsColumnsController);
	context.subscriptions.push(sifrarnikController);
	context.subscriptions.push(crmFetcherController);
	context.subscriptions.push(tmpBxSpreaderController);

}

// this method is called when your extension is deactivated
export function deactivate() { }
