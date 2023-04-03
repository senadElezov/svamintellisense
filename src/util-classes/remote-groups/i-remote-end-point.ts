import { IRemoteFieldPrimitiveDto } from './i-remote-field.dto'
import { IRemoteFieldObjectDto } from './i-remote-object.dto'


export type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'GET'
export type GroupMethod = 'create' | 'update' | 'remove' | 'byKey' | 'extendedGet' | 'editorSource' | 'createBatch' | 'updateBatch' | 'removeBatch'
export interface IRemoteEndPoint {

    httpMethod: HttpMethod
    remoteGroup?: string
    path: string
    groupMethod?: GroupMethod
    params?: IRemoteFieldPrimitiveDto[]
    body?: IRemoteFieldObjectDto
    response?: IRemoteFieldPrimitiveDto | IRemoteFieldObjectDto

}