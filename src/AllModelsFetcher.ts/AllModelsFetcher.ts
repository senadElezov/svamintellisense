import { DBModelFetcher } from '../DBModelFetcher/DbModelFetcher';
import { queries } from '../queries';
import { SvamSPIntellisense } from '../SvamSPIntellisense/SvamSPIntellisense';
import { DBType } from '../Types/db-type';
import { Injectable } from '../util-classes/di/injectable';
import executeQueries from '../Utils/executeQueries';
import { ViewFetcher } from '../ViewFetcher/ViewFetcher';


@Injectable()
export class AllModelsFetcher {

    private _allDefs: {
        views: any[],
        tables: any[],
        storedprocedures: any[],
        scalars: any[],
        tablefunctionsparams: any[],
        tablefunctionscolumns: any[]
    } | null = null;

    constructor(
        private _dbType: DBType
    ) { }



    async loadToFiles() {

        const spIntellisense = new SvamSPIntellisense(
            this._dbType,
            this._allDefs?.storedprocedures,
            this._allDefs?.scalars,
            this._allDefs?.tablefunctionsparams,
            this._allDefs?.tablefunctionscolumns
        )

        await spIntellisense.metadataToDicts();
        await spIntellisense.saveFunctionDefinitionsToFile(true);
        await spIntellisense.saveScalarFunctionDefinitionsToFile();
        await spIntellisense.saveStoredProceduresModelToFile()


        const dbModelFetcher = new DBModelFetcher(this._dbType, this._allDefs?.tables);
        await dbModelFetcher.metadataToDict();
        await dbModelFetcher.loadDbModelToFiles();

        const viewsFetcher = new ViewFetcher(this._dbType, this._allDefs?.views);
        await viewsFetcher.metadataToDict();
        await viewsFetcher.saveViewModelToFiles();
    }


    async fetchAllMetaData() {

        const {
            FETCH_DB_QUERY,
            FETCH_SCALAR_FUNCTIONS_QUERY,
            FETCH_SP_QUERY,
            FETCH_TABLE_FUNCTIONS_COLUMNS_QUERY,
            FETCH_TABLE_FUNCTIONS_PARAMS_QUERY,
            FETCH_VIEWS_QUERY
        } = queries

        const queryDefinitions = {
            views: FETCH_VIEWS_QUERY,
            tables: FETCH_DB_QUERY,
            storedprocedures: FETCH_SP_QUERY,
            scalars: FETCH_SCALAR_FUNCTIONS_QUERY,
            tablefunctionsparams: FETCH_TABLE_FUNCTIONS_PARAMS_QUERY,
            tablefunctionscolumns: FETCH_TABLE_FUNCTIONS_COLUMNS_QUERY
        }

        const result = await executeQueries(queryDefinitions, this._dbType);

        this._allDefs = result;
    }



}