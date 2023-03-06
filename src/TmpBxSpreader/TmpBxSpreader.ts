
import * as vscode from 'vscode';
import WorkspaceManager from '../WorkspaceManager';
const DEPTH_INC = '{';
const DEPTH_DEC = '}';

const BX_BUTTONS_FOLDER = 'app/modules/Doc/Components/DocView/BxButtons'

type ImportDef = {

    importVariables: string[],
    importString: string,
}
export class TmpBxSpreader {

    private _workspaceManager: WorkspaceManager

    private _bxFunctions: { [bxName: string]: string } = {}

    private _bxChecks: { [checkName: string]: string } = {}

    private _imports: { [importName: string]: ImportDef } = {}


    constructor() {

        this._workspaceManager = new WorkspaceManager();
    }

    private getStringDepth(str: string) {

        if (!str) {
            return 0;
        }

        const charArray = str.split('');
        const increments = charArray.filter(char => char === DEPTH_INC)?.length;
        const decrements = charArray.filter(char => char === DEPTH_DEC)?.length;

        return increments - decrements;
    }



    async fillDicts() {
        const rootFolderPath = this._workspaceManager.getRootFolder()?.path;
        const BX_PATH = BX_BUTTONS_FOLDER + '/bxButtonDefinitionsOLD.tsx';
        const bxFullPath = rootFolderPath + '/' + BX_PATH;
        const bxFile = await this._workspaceManager.readFile(vscode.Uri.file(bxFullPath));

        if(!bxFile) {
            return;
        }
        
        const documentLines = bxFile.split('\n');

        let lineIdx = 0;
        let depth = 0;
        let hookBody = '';

        while (lineIdx < documentLines.length) {
            let documentLine = documentLines[lineIdx]?.trim();

            if (!documentLine.startsWith('import')) {
                break;
            }

            let documentLineWords = documentLine.split(' ');

            const importBody = documentLine.substring('import'.length, documentLine.indexOf('from'))?.trim();

            let importPath = documentLineWords[documentLineWords.length - 1];

            let importQuote = importPath.charAt(0);

            importPath = importPath
                .replace(new RegExp(importQuote, 'g'), '')
                .replace(/;/g, '');


            if (importPath.startsWith('./')) {
                importPath = '.' + importPath
            }
            else if (importPath.startsWith('../')) {
                importPath = '../' + importPath
            }

            importPath = importQuote + importPath + importQuote
            const importVariables = importBody.replace(/{/g, '').replace(/}/g, '').split(',').map((strVar) => strVar.trim());

            const importString = documentLineWords.filter((wrd, idx, arr) => idx !== arr.length - 1).join(' ') + ' ' + importPath + ';';

            this._imports[documentLine] = {
                importVariables,
                importString
            };

            lineIdx++;
        }


        while (lineIdx < documentLines.length) {
            let documentLine = documentLines[lineIdx]?.trim();

            const documentLineWords = documentLine.split(' ');
            const [possibleConst, possibleBxHook] = documentLineWords;

            if (possibleConst === 'const' && possibleBxHook.startsWith('use')) {
                hookBody = documentLine + '\n';
                lineIdx++;
                depth = this.getStringDepth(documentLine);

                while (depth > 0 && lineIdx < documentLines.length) {
                    documentLine = documentLines[lineIdx];
                    depth += this.getStringDepth(documentLine)
                    hookBody += documentLine + '\n';
                    lineIdx++;
                }

                if (possibleBxHook.endsWith('Check')) {

                    this._bxChecks[possibleBxHook] = hookBody + '\nexport default ' + possibleBxHook;
                }
                else {

                    this._bxFunctions[possibleBxHook] = hookBody + '\nexport default ' + possibleBxHook;
                }


                depth = 0;
                lineIdx++;

                continue;
            }


            lineIdx++;
        }
    }

    private getVariablesImportString(defString: string) {

        return Object
            .values(this._imports)
            .filter(({ importVariables }) => {

                return importVariables
                    .reduce<boolean>((total, variable) => {
                        return total || defString.indexOf(variable) >= 0
                    },
                        false
                    )

            })
            .reduce<string>((total, { importString }) => {

                return total + importString + '\n'
            },
                ''
            );
    }

    async spreadBx() {

        await this.fillDicts();

        const rootFolderPath = this._workspaceManager.getRootFolder()?.path;
        const hooksFolder = rootFolderPath + '/' + BX_BUTTONS_FOLDER + '/BxHooks';
        const checksFolder = rootFolderPath + '/' + BX_BUTTONS_FOLDER + '/BxChecks';

        this._workspaceManager.createFolder(hooksFolder);
        this._workspaceManager.createFolder(checksFolder);

        Object
            .entries(this._bxChecks)
            .forEach(([checkName, checkDefinition]) => {
                const variablesImportString = this.getVariablesImportString(checkDefinition)

                this._workspaceManager.createFile(checksFolder + '/' + checkName + '.tsx', variablesImportString + checkDefinition);

            });


        const checks = Object.keys(this._bxChecks);

        const displayMessageImport = 'import getBxDisplayMessage from "../getBxDisplayMessage";\n';

        Object
            .entries(this._bxFunctions)
            .forEach(([bxHookName, bxHookDefinition]) => {

                const checksImportString = checks
                    .filter(check => bxHookDefinition.indexOf(check) >= 0)
                    .map((check) => ' import ' + check + ' from "../BxChecks/' + check + '";')
                    .join('\n')

                const variablesImportString = this.getVariablesImportString(bxHookDefinition)

                const bxName = bxHookName.trim().substring(3);

                const getter = 'get' + bxName + 'Checks';
                const setter = 'set' + bxName + 'Checks';;

                const def = bxName.charAt(0).toLowerCase() + bxName.substring(1) + 'Checks';;

                bxHookDefinition = bxHookDefinition
                    .replace(new RegExp(getter, 'g'), 'getChecks')
                    .replace(new RegExp(setter, 'g'), 'setChecks')
                    .replace(new RegExp(def, 'g'), 'checks');

                this._workspaceManager.createFile(hooksFolder + '/' + bxHookName + '.tsx', displayMessageImport + checksImportString + '\n' + variablesImportString + '\n' + bxHookDefinition);

            });

        console.log('')
        // this._workspaceManager.createFile('');
    }


    async createBxFiles() {

    }
}