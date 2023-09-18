
import * as vscode from 'vscode';

export type FileType = 'html' | 'ts' | 'js'

export class CompletionProvider {

    static initCompletionProvider(fileType: FileType, completionItems: vscode.CompletionItem[]): vscode.Disposable {

        const docFilterByFileType: { [fileType in FileType]: vscode.DocumentSelector } = {
            html: {
                scheme: 'file',
                language: 'html'
            },
            ts: [
                {
                    scheme: 'file',
                    language: 'typescript',
                },
                {
                    scheme: 'file',
                    language: 'typescript/react'
                }
            ],
            js: [
                {
                    scheme: 'file',
                    language: 'javascript',
                },
                {
                    scheme: 'file',
                    language: 'javascript/react'
                }
            ]
        }
        completionItems.forEach((completionItem) => completionItem.sortText = String.fromCharCode(0))
        const disposable = vscode.languages.registerCompletionItemProvider(docFilterByFileType[fileType], { provideCompletionItems: () => completionItems });

        return disposable
    }
}