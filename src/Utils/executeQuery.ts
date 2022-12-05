import WorkspaceManager from "../WorkspaceManager";

const fetch = require("node-fetch");


const executeQuery = async (query:string) => {
    

    let settings = await WorkspaceManager.getSettings();

    const queryPrepared = [
        {
            query: query,
            commandtype: 'text',
            tableName:'infos'
        }
    ];

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

    return result.infos;

}

export default executeQuery;