import executeQuery from "./executeQuery"


const getAllTablesFromDB = async () => {

    const allTablesQuery:string = `
        SELECT  TABLE_NAME as tableName
        FROM    INFORMATION_SCHEMA.TABLES
        WHERE	TABLE_NAME NOT LIKE 'tmp%'	
                AND TABLE_NAME NOT LIKE '%vTmp%'
                AND TABLE_NAME NOT LIKE '[_]%'
    `

    const tablesMeta = await executeQuery(allTablesQuery);
    
    const tableNames:string[] = tablesMeta.map((row:any)=>row.tablename);

    return tableNames;

}

export default getAllTablesFromDB;