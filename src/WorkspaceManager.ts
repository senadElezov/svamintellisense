import { TextEncoder } from 'util';
import * as vscode from 'vscode';
import { StringConstants } from './StringConstants/StringConstants';
import { DBType } from './Types/db-type';
export type SISettings = {
    server: string,
    api: string,
    ooDatabase: string,
    modelPath: string,
    opDatabase: string
}

export default class WorkspaceManager {
    fileSystem: vscode.FileSystem = vscode.workspace.fs;
    _disposable: vscode.Disposable;
    _settings: any;

    static manager: WorkspaceManager;
    constructor() {
        this._disposable = new vscode.Disposable(() => { });

        if (WorkspaceManager.manager) {
            return WorkspaceManager.manager
        }

        WorkspaceManager.manager = this;

    }


    async getAllDocumentsText(): Promise<string[]> {
        let allTextDocuments: string[];

        if (vscode.workspace.workspaceFolders) {
            let rootFolderUri = this.getRootFolder()

            allTextDocuments = await this.loopThroughFolder(rootFolderUri, 0);

            return allTextDocuments;

        }

        return [];
    }

    async loopThroughFolder(folderUri: vscode.Uri, level: number, documentNames?: string[]): Promise<string[]> {
        let returningDocuments: string[] = [];
        let folderChildrenNameAndTypePairs = await this.fileSystem.readDirectory(folderUri);

        for (let childIndex = 0; childIndex < folderChildrenNameAndTypePairs.length; childIndex++) {
            let [childName, childFileType] = folderChildrenNameAndTypePairs[childIndex];

            if (childFileType === vscode.FileType.Directory && !childName.startsWith(".") && childName !== "node_modules") {
                let childFolderUri: vscode.Uri = vscode.Uri.file(folderUri.path + "/" + childName);
                let childDirectoryResult: string[] = await this.loopThroughFolder(childFolderUri, ++level);
                returningDocuments = returningDocuments.concat(childDirectoryResult);
            }
            else if (
                childName.endsWith(".js")
                || childName.endsWith(".ts")
                || childName.endsWith(".tsx")
                && (
                    !documentNames
                    || documentNames.includes(childName)
                )
            ) {


                let tempArray = await this.fileSystem.readFile(vscode.Uri.file(folderUri.path + "/" + childName));
                let docContent: string = tempArray.toString();
                returningDocuments.push(docContent);
            }

        }
        await folderChildrenNameAndTypePairs.map(async () => {


        });

        return returningDocuments;
    }

    static async getSettings(): Promise<SISettings | null> {
        if (vscode.workspace.workspaceFolders) {
            let rootFolderUri = vscode.workspace.workspaceFolders[0].uri === undefined ? vscode.Uri.file("") : vscode.workspace.workspaceFolders[0].uri;
            let tempArray = await vscode.workspace.fs.readFile(vscode.Uri.file(rootFolderUri.path + "/" + StringConstants.SETTINGS_FILE_NAME));
            let docContent: string = tempArray.toString();
            return JSON.parse(docContent);
        }
        return null;
    }

    public dispose() {
        this._disposable.dispose();

    }

    public getRootFolder() {
        if (vscode.workspace.workspaceFolders) {

            const rootFolder = vscode.workspace.workspaceFolders[0].uri === undefined ?
                vscode.Uri.file("") :
                vscode.workspace.workspaceFolders[0].uri;

            return rootFolder;
        }

        return vscode.Uri.file("");
    }

    public addFile(path: string, fileText: string) {
        const textEncoder = new TextEncoder();
        this.fileSystem.writeFile(vscode.Uri.file(path), textEncoder.encode(fileText));

    }
    public addFolder(path: string) {
        const uri = vscode.Uri.parse(path);
        this.fileSystem.createDirectory(uri);
    }

    public async readDirectory(folderUri: vscode.Uri) {
        let folderChildrenNameAndTypePairs = await this.fileSystem.readDirectory(folderUri);

        return folderChildrenNameAndTypePairs;

    }

    public async readFile(fileUri: vscode.Uri) {
        try {
            const file = await this.fileSystem.readFile(fileUri);

            let fileContent: string = file.toString();

            return fileContent;
        }
        catch {

            return null;
        }


    }

    public async createFolder(folderPath: string) {
        const newFolderUri = vscode.Uri.file(folderPath);
        this.fileSystem.createDirectory(newFolderUri);
    }

    public async createFile(filePath: string, fileContent: string) {
        const newFileUri = vscode.Uri.file(filePath);
        const textEncoder = new TextEncoder();
        this.fileSystem.writeFile(newFileUri, textEncoder.encode(fileContent));
    }

    public async getRepositoryPath(dbType: DBType) {

        const settings = await WorkspaceManager.getSettings();
        const rootFolder = this.getRootFolder();

        const modelPath = settings?.modelPath || '/app/repository/';
        return rootFolder.path + modelPath + dbType + '/';
    }
}

