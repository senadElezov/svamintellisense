import { Param } from "../SvamSPIntellisense/Param"
import { ColumnDefinition, FunctionColumnDefFetch, FunctionParamDefFetch, typeScriptDataType } from "../SvamSPIntellisense/SvamSPIntellisense"
import { convertDBToDataType } from "./convertDBToDataType";
import { convertDBtoTypeScriptType } from "./convertDBtoTypeScriptType";

const functionMetaToInterface = (functionMeta:{
    fetchedParams:FunctionParamDefFetch[],
    fetchedColumns:FunctionColumnDefFetch[]
}) =>
{

    const {
        fetchedColumns,
        fetchedParams
    } = functionMeta;

    const columns:ColumnDefinition[] = [];

    const returningModel:{[columnName:string]:typeScriptDataType} = {}

    const paramsModel:{[paramName:string]:typeScriptDataType} = {}

    fetchedColumns?.forEach(columnDef => {

        const {
            colname,
            coltype,
            funcname
        } = columnDef;

        returningModel[colname.replace(/ /g,'').replace(/č/g,'c').replace(/š/,'s').replace('/ć/','c').replace(/\./g,'').replace(/\//g,'').toLowerCase()] = convertDBtoTypeScriptType[coltype]

        columns.push({
            caption:colname,
            dataField:colname.replace(/ /g,'').replace(/č/g,'c').replace(/š/,'s').replace('/ć/','c').replace(/\./g,'').replace(/\//g,'').toLowerCase(),
            dataType:convertDBToDataType[coltype]
        })
    })

    fetchedParams?.forEach(paramDef => {

        const {
            funcname,
            paramname,
            paramtype
        } = paramDef;

        paramsModel[paramname.replace('@','')] = convertDBtoTypeScriptType[paramtype];

    });
    

    return {
        paramsModel,
        columns,
        returningModel
    }
}

export default functionMetaToInterface;