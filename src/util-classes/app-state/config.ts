
export interface IApiConfig {

    name: string
    metadataEndpointUrl: string,
    auth?: string

}

export class Config {

    constructor(
        public remoteClassesPath: string,
        public remoteEnpointsPath: string,
        public remoteGroupsServicesPath: string,
        public remoteGroupsPath: string,

        public apisConfig: IApiConfig[]
    ) {

    }
}