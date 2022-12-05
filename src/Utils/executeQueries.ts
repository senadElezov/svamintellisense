import WorkspaceManager from '../WorkspaceManager';
const fetch = require("node-fetch");



const executeQueries = async <T extends { [tableName: string]: string }>(queries: T): Promise<{ [tableName in keyof T]: any[] }> => {

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
            db: settings?.database,
            queries: queryPrepared,
        })
    };

    const response = await fetch(settings?.api, requestOptions);
    const result = await response.json();


    return result
}

export default executeQueries;