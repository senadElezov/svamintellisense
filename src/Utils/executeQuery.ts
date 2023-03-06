import { DBType } from '../Types/db-type';
import WorkspaceManager from "../WorkspaceManager";

const fetch = require("node-fetch");


const executeQuery = async (query: string, database: DBType) => {


    let settings = await WorkspaceManager.getSettings();

    const queryPrepared = [
        {
            query: query,
            commandtype: 'text',
            tableName: 'infos'
        }
    ];

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic dGVzdDoxMjM=' },
        body: JSON.stringify({
            db: database === 'oo' ? settings?.ooDatabase : settings?.opDatabase,
            queries: queryPrepared,
        })
    };

    const response = await fetch(settings?.api, requestOptions);
    const result = await response.json();

    return result.infos;

}

export default executeQuery;