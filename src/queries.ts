
 const SCALAR_FUNCTION_IDENTIFIER = '\'FN\''

 const TABLE_INLINE_FUNCTION_IDENTIFIER = '\'IF\'';
 const TABLE_FUNCTION_IDENTIFIER = '\'TF\'';

export const queries = {

    FETCH_DB_QUERY:`SELECT  LOWER(COLUMN_NAME) as column_name,
                            DATA_TYPE,
                            IS_NULLABLE,
                            tableDefs.TABLE_NAME
                    FROM    INFORMATION_SCHEMA.COLUMNS as colDefs
                            INNER JOIN INFORMATION_SCHEMA.TABLES as tableDefs ON colDefs.TABLE_NAME = tableDefs.TABLE_NAME
                    WHERE	tableDefs.TABLE_TYPE <> 'VIEW'
                            AND LEFT(tableDefs.TABLE_NAME,3)<>'tmp'
                            AND LEFT(tableDefs.TABLE_NAME,1)<>'_'
                            AND LEFT(tableDefs.TABLE_NAME,4) <> 'tUSR'
                    `,

    FETCH_VIEWS_QUERY:`select   cols.name as columnName,
                                cols.is_nullable,
                                cols.column_id as columnID, 
                                tt.name as dataType,
                                t.name as table_Name,
                                foreignKeyColumns.*
                        from    sys.columns as cols
                                inner join sys.views as t ON t.object_id = cols.object_id
                                left join
                                (
                                        select	colParent.column_id,
                                                tparent.object_id,
                                                colRef.name as referencedColumnName,
                                                tref.name as referencedTableName,
                                                colParent.name as parentColumnName,
                                                tparent.name as parentTableName,
                                                viewUsage.VIEW_NAME as viewName
                                        from	sys.foreign_key_columns as c 
                                                inner join sys.tables as tparent ON c.parent_object_id= tparent.object_id 
                                                inner join INFORMATION_SCHEMA.VIEW_COLUMN_USAGE as viewUsage on tparent.name = viewUsage.TABLE_NAME
                                                inner join sys.tables as tref ON c.referenced_object_id=tref.object_id 
                                                inner join sys.columns as colParent ON colParent.object_id=tparent.object_id AND colParent.column_id =c.parent_column_id AND colParent.name = viewUsage.COLUMN_NAME
                                                inner join sys.columns as colRef ON colRef.object_id=tref.object_id AND colRef.column_id=c.referenced_column_id
                                ) as foreignKeyColumns
                                ON	foreignKeyColumns.parentColumnName = cols.name
                                AND foreignKeyColumns.viewName = t.name
                                
                                inner join sys.types as tt on tt.user_type_id = cols.user_type_id
                        WHERE   tt.name <> 'timestamp'
                                AND cols.name NOT IN ('rv','guid')
                                AND t.name NOT LIKE 'tmp%'	
                                AND t.name NOT LIKE '%vTmp%'
                                AND t.name NOT LIKE '[_]%'
                        `,

    FETCH_TABLE_FUNCTIONS_PARAMS_QUERY:`SELECT	funcDefs.name as funcName,
                                                params.name as paramName,
                                                params.parameter_id as paramId,
                                                paramTypes.name as paramType
                                        FROM	sys.objects as funcDefs	
                                                INNER JOIN sys.parameters as params ON params.object_id = funcDefs.object_id
                                                LEFT JOIN sys.types as paramTypes On params.user_type_id = paramTypes.user_type_id
                                        WHERE	funcDefs.type IN (${TABLE_FUNCTION_IDENTIFIER},${TABLE_INLINE_FUNCTION_IDENTIFIER})`,
    FETCH_TABLE_FUNCTIONS_COLUMNS_QUERY:`   SELECT  funcDefs.name as funcname,
                                                    colDefs.name as colname,
                                                    colTypes.name as coltype
                                            FROM	sys.objects as funcDefs
                                                    INNER JOIN sys.columns as colDefs ON colDefs.object_id = funcDefs.object_id
                                                    INNER JOIN sys.types as colTypes On colDefs.user_type_id = colTypes.user_type_id
                                            WHERE	funcDefs.type IN (${TABLE_FUNCTION_IDENTIFIER},${TABLE_INLINE_FUNCTION_IDENTIFIER})`,
    FETCH_SCALAR_FUNCTIONS_QUERY:`  SELECT	funcDefs.name as funcName,
                                            params.name as paramName,
                                            params.parameter_id as paramId,
                                            paramTypes.name as paramType,
                                            params.is_output as isoutput
                                    FROM	sys.objects as funcDefs	
                                            INNER JOIN sys.parameters as params ON params.object_id = funcDefs.object_id
                                            LEFT JOIN sys.types as paramTypes On params.user_type_id = paramTypes.user_type_id
                                    WHERE	funcDefs.type IN (${SCALAR_FUNCTION_IDENTIFIER})`,
    FETCH_SP_QUERY:`SELECT  pr.name as procname,
                            par.name as paramname,
                            t.name as typename,
                            par.is_output as isoutput,
                            schem.name as schemaname,
                            mod.definition as definition
                    FROM    sys.procedures as pr
                            inner join sys.schemas as schem on schem.schema_id = pr.schema_id
                            inner join sys.sql_modules as mod on pr.object_id = mod.object_id
                            left join sys.parameters as par on par.object_id=pr.object_id 
                            left join sys.types as t on par.user_type_id = t.user_type_id`

                    

}