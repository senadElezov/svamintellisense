import { TextEncoder } from 'util';
import * as vscode from 'vscode';

export class FSManager {
    static readonly fileSystem = vscode.workspace.fs;

    static createDirectory(params: { name: string, path: string }) {

        const { name, path } = params;

        const fullPath = path + '/' + name;
        const directoryUri = vscode.Uri.file(fullPath);
        return new Promise<void>(resolve =>
            this.fileSystem.createDirectory(directoryUri)
                .then(() => resolve())
        )

    }

    static createFile(params: { name: string, path: string, suffix: string, content: string }) {
        const { name, path, content, suffix } = params;

        const fullPath = path + '/' + name + '.' + suffix;
        const textEncoder = new TextEncoder();
        const byteArray = textEncoder.encode(content);

        const fileUri = vscode.Uri.file(fullPath)

        return new Promise<void>(resolve =>
            this.fileSystem.writeFile(fileUri, byteArray)
                .then(() => resolve())
        )
    }

    static readFile(params: { path: string }) {

    }

}