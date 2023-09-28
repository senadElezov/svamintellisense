import * as vscode from 'vscode';
import * as ts from 'typescript'
import WorkspaceManager from '../WorkspaceManager';
import myStringify from '../Utils/myStringify';

export type JSONFile = {
    type: 'layout' | 'controls' | 'columns',
    path: string
}
export class ControlsFileListener {


    get tsOpts() {

        return {
            allowJs: true,
            allowSyntheticDefaultImports: true,
            allowUmdGlobalAccess: true,
            allowUnreachableCode: true,
            allowUnusedLabels: true,
            baseUrl: ''
        } as ts.CompilerOptions
    }
    get fileSystem() {
        return vscode.workspace.fs;
    }

    readonly workspaceManager = new WorkspaceManager();

    get path() {
        return this.workspaceManager.getRootFolder().path + '/app/layout';
    }

    get outputPath() {
        return this.workspaceManager.getRootFolder().path + '/app/assets/layout';
    }

    get modelFilePath() {
        return this.workspaceManager.getRootFolder().path + '/app/core/Hooks/remoteLayout/layout.model.ts'
    }

    readonly disposables: vscode.Disposable[] = []
    constructor() {

    }

    async initializeListeners(path = this.path) {

        const disposable = vscode.workspace.onDidSaveTextDocument(document => {
            const path = document.uri.path;

            if (!path.startsWith(this.path) || !document.fileName.endsWith('.ts')) {
                return
            }

            const js = this.getJs(document.getText())
            if (!js) {
                return;
            }

            const fileName = this.outputPath + '/' + path.replace(this.path, '').replace('.ts', '.json');

            return this.workspaceManager.createFile(fileName, JSON.stringify(js, null, '\t'))
                .then(() => this.updateLayoutModel())
        })

        this.disposables.push(disposable);

        const structure = await this.mapStructure();
        await this.updateLayoutModel();

    }

    async mapStructure(path = this.path): Promise<any> {

        const relativePath = path.replace(this.path, '');

        const folder = await this.fileSystem.readDirectory(vscode.Uri.file(path))

        return Promise.all(
            folder.map<Promise<any>>(([name, fileType]) => {

                if (fileType === vscode.FileType.File) {

                    return this.workspaceManager.readFile(vscode.Uri.file(path + '/' + name))
                        .then((file) => {
                            if (name?.endsWith('.ts') && !name.startsWith('_')) {
                                const js = this.getJs(file as string);

                                const filePath = this.outputPath + '/' + relativePath + '/' + name.replace('.ts', '.json')
                                return this.workspaceManager.createFile(filePath, JSON.stringify(js, null, '\t'))
                            }

                            return Promise.resolve();
                        })
                }

                if (fileType === vscode.FileType.Directory) {
                    const folderPath = [this.outputPath, relativePath, name].filter(Boolean).join('/');
                    return this.workspaceManager.createFolder(folderPath)
                        .then(() => this.mapStructure(path + '/' + name))


                    return this.mapStructure(path + '/' + name);
                }

                return Promise.resolve();
            }))
    }

    async updateLayoutModel() {
        const flattenedJsons = await this.getFlattenedJSONPaths();

        const typeString =
            `
import { ISvamColumnOptions } from '@svam/components/SvamGridTS/SubComponents/SvamColumn/Interfaces/ISvamColumnOptions';
import { GenericIEditorProps } from '@svam/forms/SvamForm/SubComponents/Editors/EditorProps/IEditorProps';
import { GroupItem } from 'devextreme/ui/form';

export type LayoutModel = {
${flattenedJsons.map((({ path, type }) => "\n'" + path + "':" + this.getModelByType(type))).join(',\n')}
}
`

        return this.workspaceManager.createFile(this.modelFilePath, typeString);
    }

    getModelByType(type: JSONFile['type']) {

        if (type === 'columns') {
            return 'ISvamColumnOptions[]'
        }

        if (type === 'layout') {
            return 'GroupItem[]'
        }

        if (type === 'controls') {
            return 'GenericIEditorProps[]'
        }
    }


    async getFlattenedJSONPaths(path = this.outputPath): Promise<JSONFile[]> {

        return this.workspaceManager.readDirectory(vscode.Uri.file(path))
            .then((children) => {
                const promise = children.reduce<Promise<JSONFile[]>>((total, [name, fileType]) => {
                    if (fileType === vscode.FileType.File && name.endsWith('.json')) {

                        return Promise.all([
                            total,
                            this.workspaceManager.readFile(vscode.Uri.file(path + '/' + name))
                        ])
                            .then(([total, fileContents]) => [
                                ...total,
                                {
                                    type: this.getJsonType(fileContents, path + '/' + name),
                                    path: path.replace(this.outputPath, '') + '/' + name.replace('.json', '')
                                } as JSONFile
                            ]
                                .filter(({ type }) => Boolean(type))
                            )
                    }

                    if (fileType === vscode.FileType.Directory) {

                        return Promise.all([
                            total,
                            this.getFlattenedJSONPaths(path + '/' + name)
                        ])
                            .then(([arr1, arr2]) => [...arr1, ...arr2])
                    }

                    return total;
                },
                    Promise.resolve([] as JSONFile[])
                )

                return promise
            })
    }

    getJsonType(jsonString: string | null, pth: string): JSONFile['type'] | null {

        if (!jsonString) {
            return null;
        }

        const jsonArr = [...JSON.parse(jsonString)];

        if (Array.isArray(jsonArr)) {

            const first = jsonArr[0];
            if (!first) {
                console.log({ jsonArr, first, pth })

                return null
            }
            if (first.itemType) {
                return 'layout'
            }

            if (first.editorType) {
                return 'controls'
            }

            return 'columns'
        }

        return 'columns'
    }
    getJs(typescriptFile: string) {

        const js = ts.transpile(typescriptFile)

        const response = eval(js);
        return response;
    }
}