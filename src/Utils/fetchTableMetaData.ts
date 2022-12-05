import { ITableMeta } from "../Interfaces/ITableMeta";
import executeQuery from "./executeQuery";

const fetchTableMetaData = async (table?:string) => {

    const tableConditionalFilter = table ? ' AND t.name = ' + table : '';

    const tablesQuery = 
    `   select  cols.name as columnName,
                cols.is_nullable,
                cols.column_id as columnID, 
                tt.name as dataType,
                t.name as tableName,
                cols.max_length,
                IIF(pkInfos.tableName IS NULL,CAST(0 as bit), CAST(1 as bit)) as isPrimaryKey,
                pkInfos.isAutoGenerated,
                foreignKeyColumns.*
        from    sys.columns as cols
                inner join sys.tables as t ON t.object_id = cols.object_id
                left join
                (
                        select	colParent.column_id,
                                tparent.object_id,
                                colRef.name as referencedColumnName,
                                tref.name as referencedTableName,
                                colParent.name as parentColumnName,
                                tparent.name as parentTableName,
                                NULL as viewName
                        from	sys.foreign_key_columns as c 
                                inner join sys.tables as tparent ON c.parent_object_id= tparent.object_id 
                                inner join sys.tables as tref ON c.referenced_object_id=tref.object_id 
                                inner join sys.columns as colParent ON colParent.object_id=tparent.object_id AND colParent.column_id =c.parent_column_id 
                                inner join sys.columns as colRef ON colRef.object_id=tref.object_id AND colRef.column_id=c.referenced_column_id
                ) as foreignKeyColumns
                                ON	foreignKeyColumns.column_id = cols.column_id
                                AND     foreignKeyColumns.object_id = t.object_id
                inner join sys.types as tt on tt.user_type_id = cols.user_type_id
                left  join fnWeb_GetTablePrimaryKeysInfo(NULL) pkInfos ON pkInfos.tableName = t.name AND pkInfos.columnName = cols.name
        WHERE   tt.name <> 'timestamp'
                AND cols.name NOT IN ('rv','guid')
                AND t.name NOT LIKE 'tmp%'	
                AND t.name NOT LIKE '%vTmp%'
                AND t.name NOT LIKE '[_]%'
                ${tableConditionalFilter}`
        
    
        
        const viewsQuery = 
        `
        select  cols.name as columnName,
                cols.is_nullable,
                cols.column_id as columnID, 
                tt.name as dataType,
                t.name as tableName,
                cols.max_length,
                NULL as isPrimaryKey,
                NULL as isAutoGenerated,
                v.viewColumnID as column_id,
                v.viewID as object_id,
                v.referencedColumnName,
                v.referencedTableName,
                v.viewColumnName,
                v.parentTableName,
                v.viewName as viewName
        from    sys.columns as cols
                inner join sys.views as t ON t.object_id = cols.object_id
                inner join sys.types as tt on tt.user_type_id = cols.user_type_id
                left join vWeb_ViewsForeignKeyMetadata  as v ON v.viewID = t.object_id AND v.viewColumnID = cols.column_id
        WHERE   tt.name <> 'timestamp'
                AND cols.name NOT IN ('rv','guid')
                AND t.name NOT LIKE 'tmp%'	
                AND t.name NOT LIKE '%vTmp%'
                AND t.name NOT LIKE '[_]%'
        `
        
        const tableFunctionsQuery = 
        `
        select  cols.name as columnName,
                cols.is_nullable,
                cols.column_id as columnID, 
                tt.name as dataType,
                funcDefs.name as tableName,
                cols.max_length,
                NULL as isPrimaryKey,
                NULL as isAutoGenerated,
                column_id as column_id,
                funcDefs.object_id as object_id,
                NULL as referencedColumnName,
                NULL as referencedTableName,
                NULL as viewColumnName,
                NULL as parentTableName,
                NULL as viewName 
        from    sys.columns as cols
                inner join sys.objects as funcDefs ON funcDefs.object_id = cols.object_id
                inner join sys.types as tt on tt.user_type_id = cols.user_type_id
        WHERE   tt.name <> 'timestamp'
                AND cols.name NOT IN ('rv','guid')
	        AND funcDefs.type IN ('IF','TF')
        `

        const metaDataQueryString = `
        select * FROM
        (
                ${tablesQuery}

                UNION

                ${viewsQuery}

                UNION

                ${tableFunctionsQuery}
        ) q
        ORDER BY q.columnID
        `
    
    const tableMetadata:ITableMeta[] = await executeQuery(metaDataQueryString);


    return tableMetadata; 
} 

export default fetchTableMetaData;
