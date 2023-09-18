import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '../di/injectable';
import { ApiDef } from './api-def';
import { Config, IApiConfig } from './config';


@Injectable()
export class AppState {

    private readonly _apiMetadata: { [key: string]: ApiDef } = {}
    constructor(
        private _appConfig: Config
    ) {

    }


    async reloadRemoteEndpoints(apiName?: string) {
        const apisConfig = this._appConfig.apisConfig;

        if (!apiName) {
            apisConfig.forEach(async (api) => {

                this._apiMetadata[api.name] = new ApiDef(this._appConfig, await this._getApiEndpoints(api))
            })

            return;
        }

        const apiConfig = this._appConfig.apisConfig.find(({ name }) => name === apiName)

        if (!apiConfig) {
            return;
        }

        this._apiMetadata[apiName] = new ApiDef(this._appConfig, await this._getApiEndpoints(apiConfig))

    }

    private async _getApiEndpoints(apiConfig: IApiConfig) {

        const { metadataEndpointUrl, auth } = apiConfig;

        return axios.get(
            metadataEndpointUrl,
            {
                headers: {
                    Authorization: auth
                }
            })
            .then(result => result.data);
    }



}