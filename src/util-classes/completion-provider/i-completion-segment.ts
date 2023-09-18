import { IRemoteFieldPrimitiveDto } from '../remote-groups/i-remote-field.dto';
import * as vscode from 'vscode';
import { RemoteEndpointsRepo } from '../remote-groups/remote-endpoints.repo';

export interface ICompletionSegment {

    getCompletionSegment: (params: {
        from: IRemoteFieldPrimitiveDto,
        remoteEndpointsRepo: RemoteEndpointsRepo,
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    }) => string

}