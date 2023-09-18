import * as vscode from 'vscode';
import { IRemoteEndPoint } from '../remote-groups/i-remote-end-point';
import { IRemoteFieldPrimitiveDto } from '../remote-groups/i-remote-field.dto';
import { IRemoteFieldObjectDto } from '../remote-groups/i-remote-object.dto';
import { RemoteEndpointsRepo } from '../remote-groups/remote-endpoints.repo';
import { ICompletionSegment } from './i-completion-segment';

export interface ICompletionProvider {

    prefix: string

    getCompletionItems: (params: {
        remoteEndpointsRepo: RemoteEndpointsRepo,
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    }) => vscode.CompletionItem[]

    
}


export abstract class CompletionProvider implements ICompletionProvider {

    constructor(
        private _completionSegment: ICompletionSegment,
        public prefix: string,

        public description: string

    ) { }

    getCompletionItems(params: {
        remoteEndpointsRepo: RemoteEndpointsRepo,
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    }): vscode.CompletionItem[] {

        const returningCompletionItems: vscode.CompletionItem[] = [];

        const { remoteEndpointsRepo } = params;
        remoteEndpointsRepo.remoteEndpoints.forEach((remoteEndpoint) => {

            const keysOfInterest = ['body', 'response'] as const;
            keysOfInterest
                .map((endpointDefKey) => ({ key: endpointDefKey, value: remoteEndpoint[endpointDefKey] }))
                .filter(({ value }) => value)
                .forEach(({ value, key }) => {

                    if (!value) {
                        return;
                    }

                    const fields: IRemoteFieldPrimitiveDto[] = [];

                    this.getFields(value, fields);

                    const insertText = fields
                        .map((field) => this._completionSegment.getCompletionSegment({
                            from: field,
                            ...params
                        }))
                        .join('\n\n')

                    returningCompletionItems.push({
                        label: this.prefix + '//' + remoteEndpoint.path + '//' + key,
                        documentation: this.description,
                        insertText,
                    })
                })

        })


        return returningCompletionItems
    }

    getFields(value: IRemoteFieldPrimitiveDto | IRemoteFieldObjectDto, fields: IRemoteFieldPrimitiveDto[]) {

        if (value.type === 'primitive') {
            return fields.push(value);
        }

        value.fields.forEach((field) => this.getFields(field, fields));
    }



}

