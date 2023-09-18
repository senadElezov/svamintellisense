import { IRemoteEndPoint } from '../remote-groups/i-remote-end-point';
import { RemoteClassesRepo } from '../remote-groups/remote-classes.repo';
import { RemoteEndpointsRepo } from '../remote-groups/remote-endpoints.repo';
import { Config } from './config';

export class ApiDef {

    remoteClassesRepo = new RemoteClassesRepo(this._endpoints, this._appConfig);
    remoteEndpointsRepo = new RemoteEndpointsRepo(this._endpoints, this._appConfig);

    constructor(
        private _appConfig: Config,
        private _endpoints: IRemoteEndPoint[]
    ) {

    }


}