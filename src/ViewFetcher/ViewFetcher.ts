import { IColumn } from "../Interfaces/IColumn"
import { typeScriptDataType } from "../SvamSPIntellisense/SvamSPIntellisense"
import { convertDBtoTypeScriptType } from "../Utils/convertDBtoTypeScriptType"
import executeQuery from "../Utils/executeQuery"
import WorkspaceManager from "../WorkspaceManager"

export type ViewDefintionColumns = {

    columnname: string,

    datatype: string

    tablename: string

}

export class ViewFetcher {

    private _viewModel: { [viewName: string]: { dataType: typeScriptDataType, columnName: string }[] }

    private _workspaceManager: WorkspaceManager

    constructor(private _viewMetadata?: any[]) {
        this._viewModel = {}
        this._workspaceManager = new WorkspaceManager();
    }

    public async generateViewModel() {

        const viewsQuery =
            `
        select  cols.name as columnName,
                cols.is_nullable,
                cols.column_id as columnID, 
                tt.name as dataType,
                t.name as table_Name,
                foreignKeyColumns.*
        from    sys.columns as cols
                inner join sys.types as tt on tt.user_type_id = cols.user_type_id
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
        WHERE   tt.name <> 'timestamp'
                AND cols.name NOT IN ('rv','guid')
                AND t.name NOT LIKE 'tmp%'	
                AND t.name NOT LIKE '%vTmp%'
                AND t.name NOT LIKE '[_]%'
        `

        const dbViewDefinitions: ViewDefintionColumns[] = await executeQuery(viewsQuery);

        this._viewMetadata = dbViewDefinitions;
                    
        this.metadataToDict();

        this.saveViewModelToFiles();
    }


    public metadataToDict() {
        this._viewMetadata?.forEach(viewDef => {

            const {
                columnname,
                datatype,
                table_name:tablename
            } = viewDef

            if (!this._viewModel[tablename]) {
                this._viewModel[tablename] = []
            }

            const getColumnName = (columName: string) => {
                if (columName.indexOf(' ') >= 0) {

                    return '\'' + columName + '\'';
                }

                return columName;
            }

            const columnName = getColumnName(columnname).toLowerCase();

            const columnAlreadyDefined = Boolean(this._viewModel[tablename].find(colDef => colDef.columnName === columnName))

            if (columnAlreadyDefined) {
                return;
            }

            this._viewModel[tablename].push({
                columnName: columnName,
                dataType: convertDBtoTypeScriptType[datatype]
            });

        })
    }


    public async saveViewModelToFiles() {
        const rootFolder = this._workspaceManager.getRootFolder()?.path;
        const settings = await WorkspaceManager.getSettings();
        const MODEL_REPOSITORY_PATH = settings?.modelPath || '/app/repository/'

        const VIEW_MODELS_FOLDER = 'Views/';

        const viewModelFullPath = rootFolder + MODEL_REPOSITORY_PATH + VIEW_MODELS_FOLDER + 'viewsModel.ts'

        const TYPE_EXPORT = 'export type ';

        const VIEW_MODEL_TYPE_NAME = 'ViewsModel'


        const viewModelDefinition =
            '{\n' +
            Object.entries(this._viewModel)
                .map(([viewName, viewColumns]) => '\t' + viewName + ':{\n' + viewColumns.map(colDef => '\t\t' + colDef.columnName + '?:' + colDef.dataType).join('\n') + '\n\t}')
                .join(',\n') +
            '\n}'


        const fullModelFileString = TYPE_EXPORT + VIEW_MODEL_TYPE_NAME + ' = ' + viewModelDefinition;
        await this._workspaceManager.addFile(viewModelFullPath, fullModelFileString);
    }
}