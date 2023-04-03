import { _IRemoteFieldDtoBase } from './i-remote-field.dto.base'

export type RemoteType = 'int' | 'string' | 'float' | 'boolean' | 'object'

export interface IReference {
    referenceName?: string
    groupName: string
    groupField: string
}


export interface IRemoteFieldPrimitiveDto extends _IRemoteFieldDtoBase {

    type: 'primitive'
    key?: boolean
    dataType: RemoteType
    references?: IReference[]
    calculated?: boolean

}


