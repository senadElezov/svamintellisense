export type AppliedTypes = 'single' | 'array' | 'map'


export interface _IRemoteFieldDtoBase {
    dataField: string
    required?: boolean

    appliedType?: AppliedTypes

}
