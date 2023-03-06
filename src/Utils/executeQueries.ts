import { DBType } from '../Types/db-type';
import WorkspaceManager from '../WorkspaceManager';
const fetch = require("node-fetch");



const executeQueries = async <T extends { [tableName: string]: string }>(queries: T, dbType: DBType): Promise<{ [tableName in keyof T]: any[] }> => {

    let settings = await WorkspaceManager.getSettings();

    const queryPrepared = Object.entries(queries).map(([tableName, query]) => {

        return {
            query,
            commandtype: 'text',
            tableName
        }
    })

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic dGVzdDoxMjM=' },
        body: JSON.stringify({
            db: dbType === 'oo' ? settings?.ooDatabase : settings?.opDatabase,
            queries: queryPrepared,
        })
    };

    const response = await fetch(settings?.api, requestOptions);
    const result = await response.json();


    return result
}

export default executeQueries;