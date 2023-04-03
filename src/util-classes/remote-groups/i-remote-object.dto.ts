import { IRemoteFieldPrimitiveDto } from './i-remote-field.dto';
import { _IRemoteFieldDtoBase } from './i-remote-field.dto.base';

export interface IRemoteFieldObjectDto extends _IRemoteFieldDtoBase {

    className: string
    type: 'object'
    fields: (IRemoteFieldPrimitiveDto | IRemoteFieldObjectDto)[]
}
