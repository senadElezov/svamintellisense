export interface _ICreatorBase {
    
    name: string

    path?: string

    create: () => Promise<any>

}