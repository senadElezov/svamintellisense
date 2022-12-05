import WorkspaceManager from "../WorkspaceManager";
import * as vscode from 'vscode';


type layoutControlDictionary = { [layoutControlName: string]: object }
const MODULES_FULL_PATH: string = 'C:/Users/senad.elezovic/Documents/Layout/Layout';

export class LayoutControlsExtractor {

    private _workspaceManager: WorkspaceManager;
    private _failedFiles:{[varName:string]:string}
    private _moduleControlsAndLayouts: { [moduleName: string]: layoutControlDictionary };

    public constructor() {
        this._workspaceManager = new WorkspaceManager();
        this._moduleControlsAndLayouts = {};
        this._failedFiles = {};
    }


    public async extractLayoutsAndControls() {

        const modulesFolderUri = vscode.Uri.file('C:/Users/senad.elezovic/Documents/Layout/Layout');

        const moduleFolderChildren = await this._workspaceManager.readDirectory(modulesFolderUri);

        moduleFolderChildren.forEach(child => {
            const [
                childName,
                fileType
            ] = child;

            if (fileType === vscode.FileType.Directory) {
                this._moduleControlsAndLayouts[childName] = {};

            }


        });

        await this.loopThroughFiles(modulesFolderUri,'',0,'');
        // this.getTypedServerDefinitions();
        this.saveDocumentsToFiles();
    }

    private async loopThroughFiles(directoryUri: vscode.Uri, moduleName: string, recursionLevel: number,parentFolder:string) {
        let directoryChildren = await this._workspaceManager.readDirectory(directoryUri);

        
        
        for(let fileIndex = 0; fileIndex < directoryChildren.length; fileIndex++) {
            const fileInfo = directoryChildren[fileIndex]; 

            const [fileName, fileType] = fileInfo;
            
            if(fileType === vscode.FileType.Directory) {
                const subDirectoryPath = directoryUri.path + '/' + fileName
                const subDirectoryUri = vscode.Uri.file(subDirectoryPath);
                moduleName = recursionLevel === 0 ? fileName : moduleName;

                await this.loopThroughFiles(subDirectoryUri,moduleName,recursionLevel+1,fileName);
            }
            else if(
                (
                fileName.endsWith('.ts')
                || fileName.endsWith('.js')
                )
                // && 
                // !fileName.toLowerCase().startsWith('get')
                // &&
                // (
                //     fileName.toLowerCase().indexOf('controls') > 0
                //     || fileName.toLowerCase().indexOf('layout') > 0
                //     || fileName.toLowerCase().indexOf('columns') > 0
                //     || parentFolder === 'Izgledi'

                // )
            ){
                const filePath = directoryUri.path + '/' + fileName;
                const fileUri = vscode.Uri.file(filePath);

                const documentText = await this._workspaceManager.readFile(fileUri);

                this.getDocumentControlsLayouts(moduleName,documentText,filePath,fileName.replace('.js','').replace('.ts',''));
            }
        }
            



    }
    private failCount: number = 0;
    private successCount: number = 0;

    private extractedLayouts:string[] = [];

    private failedJS:string = '';
    private getDocumentControlsLayouts(currentModule:string,documentText: string,fullPath:string,fileName:string) {
        const layoutControlDeclarationIdentifier = 'export const ';
        
        documentText = documentText.replace(/import .*/g,'');
        documentText = documentText.replace(/}/g,'\n}');
        documentText = documentText.replace(/{/g,'\n{');

        documentText = documentText.replace(/ as .*/g,',');
        documentText = documentText.replace(/:.*GenericIEditorProps.*=/g,' =')
        documentText = documentText.replace(/:.*ISvamColumnOptions.*=/g,' =')
        documentText = documentText.replace(/:.*dxFormGroupItem.*=/g,' =')
        documentText = documentText.replace(/'/g,'"');
        documentText = documentText.replace(/\t/g,'');
        
        const removeDocumentComments = (documentText:string) => {
            const MULTI_LINE_COMMENT_STARTER = '/**';
            const MULTI_LINE_COMMENT_ENDER = '*/';
            const SINGLE_LINE_COMMENT_STARTER = '//';

            let multiLineStarterIndex = documentText.indexOf(MULTI_LINE_COMMENT_STARTER);
            
            while (multiLineStarterIndex >= 0) {
                const multiLineEnderIndex = documentText.indexOf(MULTI_LINE_COMMENT_ENDER);
                const textAfterMultiLineEnder = documentText.substring(multiLineEnderIndex);
                let firstNextLineIndex = textAfterMultiLineEnder.indexOf('\n');
                if(firstNextLineIndex === -1){
                    firstNextLineIndex = 0;
                }

                const replacementText = documentText.substring(multiLineStarterIndex-1,multiLineEnderIndex+firstNextLineIndex);
                documentText = documentText.replace(replacementText,'');
                multiLineStarterIndex = documentText.indexOf(MULTI_LINE_COMMENT_STARTER);
            };
            

            const documentLines = documentText.split('\n');
            documentText = documentLines.map(documentLine => {

                const singleLineCommentIndex = documentLine.indexOf(SINGLE_LINE_COMMENT_STARTER);

                if(singleLineCommentIndex < 0){
                    return documentLine;
                }
                const replacementText = documentLine.substring(singleLineCommentIndex);

                documentLine = documentLine.replace(replacementText,'');

                return documentLine
                
            }).join('\n')

            return documentText;
        }

        documentText = removeDocumentComments(documentText);

        // const docTextLines = documentText.split('\r\n');
        // const transformedLines = docTextLines.map(docTextLine => {
        //     const propValuePair = docTextLine.split(':');

        //     if(propValuePair.length !== 2){
        //         return propValuePair.join(':');
        //     }

        //     let propName = propValuePair[0];
        //     propName = propName.replace('\n','').replace('\t','').replace(/ /g,'');
        //     console.log(propName)
        //     if(propName.startsWith('{')){
        //         propName = propName.replace('{','');
        //         propName =  '{"' + propName+ '"';
        //     }
        //     else{
        //         propName =  '"' + propName+ '"';

        //     }
        //     return propName + ':' + propValuePair[1];
        // })

        // documentText = transformedLines.join('\n');

        const variableDefinitions   = documentText.split(layoutControlDeclarationIdentifier);

        console.log(documentText);
        variableDefinitions.forEach((variableDefinition,index) =>{
            
            if(index === 0) {
                return;
            }

            const equalsIndex = variableDefinition.indexOf('=');

            let variableName = variableDefinition.substring(0,equalsIndex);
            let variableValue = variableDefinition.substring(equalsIndex+1);
            
            let trimmedVariableName = variableName.trim();
            // if(['controls','controls2','osnovno'].includes(trimmedVariableName)) {
            //     trimmedVariableName = fullPath.split(MODULES_FULL_PATH)[1].replace(/\\/g,'_').replace(/\//g,'_').replace('.js','');
            // };

           
            try{
                console.log('let test = ' + variableValue +';test;');
                const evalResult = eval('let test = ' +variableValue +';test;');

                this._moduleControlsAndLayouts[currentModule][fileName] = evalResult; 
                this.successCount++;

                this.extractedLayouts.push(fileName);

            }
            catch {
                this.failedJS += 'let ' + trimmedVariableName + ' = ' +variableValue+';\n'
                console.log(variableValue);
                console.log(trimmedVariableName);
                this._failedFiles[trimmedVariableName] = variableValue;
                this.failCount++;
            }
            

        });
    
    }

    private saveDocumentsToFiles() {
        const modulesDictionary = this._moduleControlsAndLayouts;
        const DESTINATION_FOLDER = 'C:/LayoutsControls/DGL';

        for(const [moduleName,layoutDictionaries] of Object.entries(modulesDictionary)) {

            this._workspaceManager.createFolder(DESTINATION_FOLDER + '/' +moduleName);

            for(const [name,layout] of Object.entries(layoutDictionaries)){

                this._workspaceManager.createFile(DESTINATION_FOLDER+'/'+moduleName + '/' + name + '.json',JSON.stringify(layout,null, '\t'));
            }
        } 
        
        this._workspaceManager.createFile(DESTINATION_FOLDER+'/test.js',this.failedJS);

        for(const [failedVar,value] of Object.entries(this._failedFiles)) {

            this._workspaceManager.createFile(DESTINATION_FOLDER+'/Failed/' + failedVar+'.js', 'let x = ' +value);
        };

    }

    private getTypedServerDefinitions() {
        
        let layoutTypeString = 'export interface IServerDefinitions {\n';

        const getDefinitionType = (name:string) => {

            if(name.toLowerCase().indexOf('layout') >=0) {

                return 'GroupItem[]'
            };

            if(name.toLowerCase().indexOf('control') >= 0) {
                return 'GenericIEditorProps[]'

            }

            if(name.toLowerCase().indexOf('column') >= 0) {
                return 'ISvamColumnOptions[]'

            }
            
            return 'unknown';
        }

        this.extractedLayouts.forEach(extractedLayout => {
            const layoutType = getDefinitionType(extractedLayout);

            layoutTypeString +='\t' + extractedLayout +': ' + layoutType + ';\n'

        })

        layoutTypeString +='\n}'
        console.log(layoutTypeString);
        this._workspaceManager.createFile('C:/Git/Web/WEBErp/WebERP-1/app/core/containers/App/ReduxSlices/ServerDataSlice/Types/IServerDefinitions.ts',layoutTypeString);
    }
}